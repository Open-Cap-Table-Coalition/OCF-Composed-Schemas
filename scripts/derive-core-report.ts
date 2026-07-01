#!/usr/bin/env node
/**
 * OCF Core — read-only classifier + §3 admissibility report (the experiment).
 *
 * Walks the GREEN corpus (block status complete/reviewed, ocf_kind: object),
 * classifies every `(entity, variant, field)` with scripts/lib/core-classifier,
 * runs §3 admissibility/closure with scripts/lib/core-admissibility, and prints a
 * core/out ledger + per-entity admissible/blocked rollup. It does NOT emit a
 * schema, touch the corpus, or run CI gates — it exists so we can eyeball whether
 * the machine's verdict matches hand judgement before committing to the full
 * derive pipeline (docs/ocf-core-spec.md §8).
 *
 * Usage:
 *   npm run core:report                  # rollup to stdout
 *   npm run core:report -- --entity 'StockIssuance'   # filter (substring)
 *   npm run core:report -- --md out.md   # also write a full markdown ledger
 */
import { writeFile } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { isPlainObject } from "./lib/mapping-validator.js";
import { classifyField, ClassifyCtx, Verdict } from "./lib/core-classifier.js";
import { computeAdmissibility, Admissibility } from "./lib/core-admissibility.js";
import { loadGreenCorpus, loadReferenceGraph } from "./lib/core-corpus.js";

const SPINE = [
  "StockIssuance",
  "EquityCompensationIssuance",
  "WarrantIssuance",
  "ConvertibleIssuance",
  "StockClass",
  "Stakeholder",
];

interface Row {
  entity: string;
  variant: string;
  field: string;
  kind: string;
  target: string;
  verdict: Verdict;
}

function targetString(target: unknown): string {
  if (target === null) return "—";
  if (Array.isArray(target)) return target.join(" + ");
  if (typeof target === "string") return target;
  return JSON.stringify(target);
}

async function main(argv: { entity?: string; md?: string }): Promise<number> {
  const corpus = await loadGreenCorpus(process.cwd());
  const ctx: ClassifyCtx = {
    registry: corpus.registry,
    bundle: corpus.bundle,
    typeLib: corpus.typeLib,
  };
  const skipped = corpus.skipped;
  const greenObjects = corpus.objects.length;

  const rows: Row[] = [];
  for (const obj of corpus.objects) {
    for (const [variant, fields] of obj.variants) {
      for (const [field, rawEntry] of Object.entries(fields)) {
        if (!isPlainObject(rawEntry)) continue;
        rows.push({
          entity: obj.entity,
          variant,
          field,
          kind: typeof rawEntry.kind === "string" ? rawEntry.kind : String(rawEntry.kind),
          target: targetString(rawEntry.target),
          verdict: classifyField(rawEntry, obj.properties[field], ctx),
        });
      }
    }
  }

  // §3 admissibility runs over ALL rows — closure is global (a referent may be
  // outside the entity filter). We display the verdict for the filtered view.
  const graph = await loadReferenceGraph(process.cwd());
  const aliases = new Map(
    corpus.objects.filter((o) => o.aliasOf).map((o) => [o.entity, o.aliasOf as string])
  );
  const adm = computeAdmissibility(
    rows.map((r) => ({
      entity: r.entity,
      variant: r.variant,
      field: r.field,
      klass: r.verdict.class,
    })),
    graph,
    aliases
  );
  const admBy = new Map(adm.map((a) => [`${a.entity} ${a.variant}`, a]));

  const filtered = argv.entity
    ? rows.filter((r) => r.entity.toLowerCase().includes(argv.entity!.toLowerCase()))
    : rows;

  printReport(filtered, admBy, adm, { greenObjects, totalRows: rows.length, skipped });
  if (argv.md) {
    await writeFile(argv.md, renderMarkdown(filtered), "utf8");
    console.log(`\nFull ledger written to ${argv.md}`);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Rendering.
// ---------------------------------------------------------------------------

function groupByEntityVariant(rows: Row[]): Map<string, Row[]> {
  const m = new Map<string, Row[]>();
  for (const r of rows) {
    const key = `${r.entity}${r.variant === "—" ? "" : ` [${r.variant}]`}`;
    const list = m.get(key) ?? [];
    list.push(r);
    m.set(key, list);
  }
  return m;
}

function shortEntity(e: string): string {
  return e.replace(/^TX_/, "");
}

function admKey(label: string): string {
  // groupByEntityVariant key is "Entity" or "Entity [variant]"; admBy key is "Entity variant".
  const m = /^(.*?) \[(.*)\]$/.exec(label);
  return m ? `${m[1]} ${m[2]}` : `${label} —`;
}

function printReport(
  rows: Row[],
  admBy: Map<string, Admissibility>,
  allAdm: Admissibility[],
  meta: { greenObjects: number; totalRows: number; skipped: string[] }
): void {
  const core = rows.filter((r) => r.verdict.class === "core").length;
  const out = rows.length - core;
  const byReason = new Map<string, number>();
  for (const r of rows) {
    if (r.verdict.class === "out") {
      byReason.set(r.verdict.reason ?? "?", (byReason.get(r.verdict.reason ?? "?") ?? 0) + 1);
    }
  }

  console.log("OCF Core — read-only classifier + §3 admissibility report (no schema emitted)");
  console.log("=".repeat(78));
  console.log(
    `Green object mappings: ${meta.greenObjects} | rows shown: ${rows.length}/${meta.totalRows} ` +
      `(entity,variant,field) | core ${core} · out ${out}`
  );
  console.log(
    `out reasons: ${[...byReason.entries()].map(([k, v]) => `${k} ${v}`).join(" · ") || "—"}`
  );
  const admN = allAdm.filter((a) => a.admissible).length;
  const aliasAdmissible = allAdm.filter((a) => a.aliasOf && a.admissible).length;
  const blocked = allAdm.filter((a) => !a.admissible);
  const dangling = blocked.filter((a) =>
    a.blockers.some((b) => b.why === "dangling-reference" || b.why === "unresolved-reference")
  ).length;
  const aliasBlocked = blocked.filter((a) => a.aliasOf).length;
  const noPayload = blocked.length - dangling - aliasBlocked;
  console.log(
    `§3 admissibility: ${admN}/${allAdm.length} (entity,variant) admissible ` +
      `(incl. ${aliasAdmissible} alias wrapper(s)) · ` +
      `${blocked.length} blocked (${dangling} closure · ${aliasBlocked} alias · ${noPayload} no-payload)  ` +
      `[fold-required gate vacuous (Carta target required:[]); it collapses into the no-payload gate]`
  );
  if (meta.skipped.length) {
    console.log(`skipped (not green / no bundle / unparsable): ${meta.skipped.length}`);
  }

  const groups = groupByEntityVariant(rows);
  const spineKeys = [...groups.keys()].filter((k) => SPINE.some((s) => k.includes(s)));
  const otherKeys = [...groups.keys()].filter((k) => !spineKeys.includes(k)).sort();

  if (spineKeys.length) {
    console.log("\n" + "─".repeat(78));
    console.log("SPINE (detailed)");
    console.log("─".repeat(78));
    for (const key of spineKeys.sort()) {
      printEntityDetail(shortEntity(key), groups.get(key)!, admBy.get(admKey(key)));
    }
  }

  console.log("\n" + "─".repeat(78));
  console.log("ALL OTHER GREEN ENTITIES (counts · admissibility)");
  console.log("─".repeat(78));
  for (const key of otherKeys) {
    const g = groups.get(key)!;
    const c = g.filter((r) => r.verdict.class === "core").length;
    const a = admBy.get(admKey(key));
    const verdict = a?.aliasOf
      ? `${a.admissible ? "✓" : "✗"} alias-of ${a.aliasOf}`
      : a?.admissible
      ? "✓ admissible"
      : `✗ blocked: ${blockerSummary(a)}`;
    console.log(
      `  ${shortEntity(key).padEnd(46)} core ${String(c).padStart(2)} / out ${String(
        g.length - c
      ).padStart(2)}  ${verdict}`
    );
  }
}

function blockerSummary(a: Admissibility | undefined): string {
  if (!a || a.blockers.length === 0) return "—";
  return a.blockers
    .map((b) =>
      b.why === "no-payload"
        ? "no-payload"
        : b.why === "alias"
        ? `alias-of ${b.referent}`
        : `${b.field}→${b.referent}`
    )
    .join(", ");
}

function printEntityDetail(label: string, g: Row[], a: Admissibility | undefined): void {
  const core = g.filter((r) => r.verdict.class === "core");
  const out = g.filter((r) => r.verdict.class === "out");
  const verdict = a?.admissible ? "✓ ADMISSIBLE" : `✗ BLOCKED (closure: ${blockerSummary(a)})`;
  console.log(`\n▸ ${label}  —  core ${core.length} / out ${out.length}  —  ${verdict}`);
  for (const r of core) {
    const tag = r.verdict.loss && r.verdict.loss !== "direct" ? ` (${r.verdict.loss})` : "";
    console.log(`    ✓ ${r.field.padEnd(28)} ${r.kind}${tag}`);
  }
  for (const r of out) {
    const why = `${r.verdict.reason}${r.verdict.detail ? `: ${r.verdict.detail}` : ""}`;
    console.log(`    ✗ ${r.field.padEnd(28)} ${why}`);
    if (r.verdict.review) console.log(`        ⚑ ${r.verdict.review}`);
  }
}

function renderMarkdown(rows: Row[]): string {
  const lines: string[] = [
    "# OCF Core — classifier ledger (generated, read-only)",
    "",
    "One row per `(entity, variant, field)` over the green corpus. `class` is the",
    "§2 verdict; this is exploratory and does not run §3 admissibility/closure.",
    "",
    "| entity | variant | field | kind | class | loss/reason | detail |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const r of rows) {
    const v = r.verdict;
    const lr = v.class === "core" ? v.loss ?? "" : v.reason ?? "";
    const detail = [v.detail, v.review ? `⚑ ${v.review}` : ""].filter(Boolean).join("; ");
    lines.push(
      `| ${shortEntity(r.entity)} | ${r.variant} | ${r.field} | ${r.kind} | ${
        v.class
      } | ${lr} | ${detail} |`
    );
  }
  return lines.join("\n") + "\n";
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("core:report")
  .option("entity", { type: "string", describe: "Substring filter on entity name" })
  .option("md", { type: "string", describe: "Write a full markdown ledger to this path" })
  .strict()
  .help()
  .parseSync();

main({
  entity: typeof parsed.entity === "string" ? parsed.entity : undefined,
  md: typeof parsed.md === "string" ? parsed.md : undefined,
}).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
