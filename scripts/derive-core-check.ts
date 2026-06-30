#!/usr/bin/env node
/**
 * OCF Core — CI gates (§5/§6). Read-only; exits non-zero on failure.
 *
 *   1. SUBSET — every Core-admissible OCF entity the generator drafts must be
 *      RATIFIED in core/allow-list.yml. An over-derivation (a wrongly-`core`
 *      field flipping an unratified entity admissible) trips this gate; fix the
 *      mapping or ratify the entity. (Ratified-but-not-yet-admissible is fine —
 *      graduation is automatic once its mapping is green.)
 *   2. DRIFT — the committed Core schema PACKAGE (core/**.schema.json) must equal
 *      a fresh recompute, file-for-file (structural equality after canonical
 *      key-sort). Hand-edits, stale builds, and orphaned files trip this; run
 *      `npm run core:build` and commit.
 *
 *   npm run core:check
 */
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";

import { deriveCore } from "./lib/core-pipeline.js";

const ALLOW_LIST = "core/allow-list.yml";
const CORE_DIR = "core";

/** Recursively sort object keys so comparison is structural, not key-order. */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      out[k] = canonical((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}

/** Committed *.schema.json under core/, as repo-relative paths from core/. */
async function committedSchemaFiles(repoRoot: string): Promise<string[]> {
  const dir = path.join(repoRoot, CORE_DIR);
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith(".schema.json")) continue;
    const parent =
      (e as unknown as { parentPath?: string; path?: string }).parentPath ??
      (e as unknown as { path?: string }).path ??
      dir;
    out.push(path.relative(dir, path.join(parent, e.name)));
  }
  return out.sort();
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const derived = await deriveCore(repoRoot);
  const failures: string[] = [];

  // --- Gate 1: subset -------------------------------------------------------
  let ratified = new Set<string>();
  try {
    const raw = parseYaml(await readFile(path.join(repoRoot, ALLOW_LIST), "utf8"));
    const list = raw && typeof raw === "object" ? (raw as { ratified?: unknown }).ratified : null;
    if (Array.isArray(list))
      ratified = new Set(list.filter((x): x is string => typeof x === "string"));
    else failures.push(`${ALLOW_LIST}: missing or malformed "ratified:" list`);
  } catch (err) {
    failures.push(
      `${ALLOW_LIST}: cannot read (${(err as Error).message}) — create it or run core:build`
    );
  }

  const drafted = derived.entities.map((e) => e.entity).sort();
  const unratified = drafted.filter((d) => !ratified.has(d));
  if (unratified.length) {
    failures.push(
      `SUBSET: the generator drafts ${unratified.length} admissible entit(y/ies) not in ${ALLOW_LIST}:\n` +
        unratified.map((d) => `    + ${d}`).join("\n") +
        `\n  → ratify them, or correct the mapping if they are over-derived.`
    );
  }
  const pendingGraduation = [...ratified].filter((r) => !drafted.includes(r)).sort();

  // --- Gate 2: drift (whole package, file-for-file) -------------------------
  const fresh = derived.package; // relPath → schema
  let committed: string[] = [];
  try {
    committed = await committedSchemaFiles(repoRoot);
  } catch (err) {
    failures.push(
      `DRIFT: cannot read ${CORE_DIR}/ (${(err as Error).message}) — run \`npm run core:build\`.`
    );
  }
  const committedSet = new Set(committed);
  const orphans = committed.filter((r) => !fresh.has(r));
  const missing = [...fresh.keys()].filter((r) => !committedSet.has(r));
  if (missing.length) failures.push(`DRIFT: not committed (run core:build): ${missing.join(", ")}`);
  if (orphans.length)
    failures.push(`DRIFT: committed but not generated (stale — delete): ${orphans.join(", ")}`);
  for (const [rel, schema] of fresh) {
    if (!committedSet.has(rel)) continue;
    try {
      const onDisk = JSON.parse(await readFile(path.join(repoRoot, CORE_DIR, rel), "utf8"));
      if (JSON.stringify(canonical(onDisk)) !== JSON.stringify(canonical(schema))) {
        failures.push(
          `DRIFT: ${CORE_DIR}/${rel} differs from recompute — run \`npm run core:build\` and commit.`
        );
      }
    } catch (err) {
      failures.push(`DRIFT: cannot read ${CORE_DIR}/${rel} (${(err as Error).message}).`);
    }
  }

  // --- Report ---------------------------------------------------------------
  if (failures.length) {
    console.error("OCF Core check: FAIL\n");
    for (const f of failures) console.error("✗ " + f + "\n");
    return 1;
  }
  console.log(
    `OCF Core check: OK — ${drafted.length} admissible entit(y/ies) ratified; ` +
      `${fresh.size}-file package matches recompute.` +
      (pendingGraduation.length
        ? `\n  (${
            pendingGraduation.length
          } ratified, awaiting a green mapping: ${pendingGraduation.join(", ")})`
        : "")
  );
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
