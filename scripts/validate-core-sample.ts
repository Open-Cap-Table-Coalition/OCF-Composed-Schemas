#!/usr/bin/env node
/**
 * OCF Core — end-to-end sample validation, for EVERY profile.
 *
 * Proves each emitted Core package is usable: for both strict (core/, sample
 * core/sample/) and rich (core-rich/, sample core-rich/sample/) it validates every
 * sample document against that profile's generated package schema (ajv, draft-07),
 * runs a few NEGATIVE cases that must be rejected, and runs a referential-closure
 * check over the whole sample using the §3 reference graph. Read-only; exits
 * non-zero on any failure.
 *
 *   npm run core:validate-sample
 */
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

import { isPlainObject } from "./lib/mapping-validator.js";
import { loadReferenceGraph } from "./lib/core-corpus.js";
import { PROFILES } from "./lib/core-pipeline.js";
import { referentOf, ReferenceGraph } from "./lib/core-admissibility.js";

async function jsonFiles(dir: string, suffix: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith(suffix)) continue;
    const parent =
      (e as unknown as { parentPath?: string; path?: string }).parentPath ??
      (e as unknown as { path?: string }).path ??
      dir;
    out.push(path.join(parent, e.name));
  }
  return out.sort();
}

function fileTypeOf(node: unknown): string | undefined {
  if (!isPlainObject(node)) return undefined;
  // schema: properties.file_type.const ; instance: file_type
  const p = isPlainObject(node.properties) ? node.properties : undefined;
  if (p && isPlainObject(p.file_type) && typeof p.file_type.const === "string") {
    return p.file_type.const;
  }
  return typeof node.file_type === "string" ? node.file_type : undefined;
}

/**
 * Validate one profile end-to-end: compile its package schemas, validate its
 * sample docs, run the negative cases, and check referential closure. Returns
 * failures (empty = OK). Each profile gets its OWN ajv — strict and rich share
 * schema `$id`s, so one shared instance would collide.
 */
async function validateProfile(
  repoRoot: string,
  coreDir: string,
  sampleDir: string,
  graph: ReferenceGraph
): Promise<string[]> {
  const failures: string[] = [];
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  console.log(`\n[${coreDir}]`);

  // Compile every generated package schema, indexed by its OCF file_type const.
  const byFileType = new Map<string, ValidateFunction>();
  for (const abs of await jsonFiles(path.join(repoRoot, coreDir), ".schema.json")) {
    const schema = JSON.parse(await readFile(abs, "utf8"));
    const ft = fileTypeOf(schema);
    if (ft) byFileType.set(ft, ajv.compile(schema));
  }

  // Validate each sample document against its package schema.
  const sampleDocs: { rel: string; doc: unknown }[] = [];
  for (const abs of await jsonFiles(path.join(repoRoot, sampleDir), ".ocf.json")) {
    const doc = JSON.parse(await readFile(abs, "utf8"));
    const rel = path.relative(repoRoot, abs);
    sampleDocs.push({ rel, doc });
    const ft = fileTypeOf(doc);
    const validate = ft ? byFileType.get(ft) : undefined;
    if (!validate) {
      failures.push(`${rel}: no Core schema for file_type ${String(ft)}`);
      continue;
    }
    if (!validate(doc)) {
      failures.push(`${rel}: ${ajv.errorsText(validate.errors, { separator: "; " })}`);
    } else {
      console.log(`  ✓ ${rel}  (${ft})`);
    }
  }

  // NEGATIVE cases — the schema must REJECT these. Each mutates a valid stock
  // issuance and revalidates against the TransactionsFile schema.
  const txValidate = byFileType.get("OCF_TRANSACTIONS_FILE");
  const txDoc = sampleDocs.find((s) => fileTypeOf(s.doc) === "OCF_TRANSACTIONS_FILE")?.doc as
    | { items: Record<string, unknown>[] }
    | undefined;
  if (txValidate && txDoc) {
    const base = txDoc.items.find((i) => i.object_type === "TX_STOCK_ISSUANCE")!;
    const mustReject: { why: string; item: Record<string, unknown> }[] = [
      { why: "date carrying a time-of-day", item: { ...base, date: "2024-01-15T09:30:00Z" } },
      { why: "an unknown property", item: { ...base, not_a_core_field: "x" } },
      { why: "a non-numeric quantity", item: { ...base, quantity: "1,000" } },
      { why: "an unknown object_type", item: { ...base, object_type: "TX_BOGUS" } },
    ];
    for (const { why, item } of mustReject) {
      if (txValidate({ file_type: "OCF_TRANSACTIONS_FILE", items: [item] })) {
        failures.push(`NEGATIVE: schema wrongly ACCEPTED ${why}`);
      } else {
        console.log(`  ✓ rejected: ${why}`);
      }
    }
  } else {
    failures.push(`${coreDir}: could not load TransactionsFile schema / sample for negative cases`);
  }

  // CLOSURE (R4) over the whole sample, via the §3 reference graph.
  const objectIds = new Set<string>();
  const securityIds = new Set<string>();
  const refs: { from: string; field: string; value: string; kind: "object" | "security" }[] = [];
  for (const { doc } of sampleDocs) {
    const items = isPlainObject(doc) && Array.isArray(doc.items) ? doc.items : [];
    const all = [
      ...items,
      ...(isPlainObject(doc) && isPlainObject(doc.issuer) ? [doc.issuer] : []),
    ];
    for (const raw of all) {
      if (!isPlainObject(raw)) continue;
      const entity = String(raw.object_type ?? "");
      if (typeof raw.id === "string") objectIds.add(raw.id);
      // An issuance CREATES its security_id; record it as declared.
      if (typeof raw.security_id === "string" && entity.endsWith("_ISSUANCE")) {
        securityIds.add(raw.security_id);
      }
      for (const [field, value] of Object.entries(raw)) {
        if (typeof value !== "string") continue;
        const ref = referentOf(entityForGraph(entity), field, graph);
        if (ref.kind === "entity") refs.push({ from: entity, field, value, kind: "object" });
        else if (ref.kind === "security")
          refs.push({ from: entity, field, value, kind: "security" });
      }
    }
  }
  for (const r of refs) {
    const pool = r.kind === "object" ? objectIds : securityIds;
    if (!pool.has(r.value)) {
      failures.push(`CLOSURE: ${r.from}.${r.field} → "${r.value}" resolves to no Core object`);
    }
  }
  console.log(
    `  ✓ closure: ${refs.length} reference(s) across ${objectIds.size} objects + ${securityIds.size} securities all resolve`
  );
  return failures;
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const graph: ReferenceGraph = await loadReferenceGraph(repoRoot);
  const failures: string[] = [];
  for (const profile of PROFILES) {
    failures.push(
      ...(await validateProfile(
        repoRoot,
        profile.outDir,
        path.join(profile.outDir, "sample"),
        graph
      ))
    );
  }

  if (failures.length) {
    console.error("\nOCF Core sample validation: FAIL\n");
    for (const f of failures) console.error("✗ " + f);
    return 1;
  }
  console.log("\nOCF Core sample validation: OK (all profiles)");
  return 0;
}

/** referentOf keys `security_id` off an "...Issuance" entity name; map object_type → that shape. */
function entityForGraph(objectType: string): string {
  return objectType.endsWith("_ISSUANCE") ? "Issuance" : objectType;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
