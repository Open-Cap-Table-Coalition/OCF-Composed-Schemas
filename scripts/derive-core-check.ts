#!/usr/bin/env node
/**
 * OCF Core — CI gates (§5/§6). Read-only; exits non-zero on failure. Runs for
 * EVERY profile (strict → core/, rich → core-rich/):
 *
 *   1. SUBSET — every Core-admissible OCF entity the generator drafts must be
 *      RATIFIED in <outDir>/allow-list.yml. An over-derivation (a wrongly-member
 *      field flipping an unratified entity admissible) trips this gate; fix the
 *      mapping or ratify the entity. (Ratified-but-not-yet-admissible is fine —
 *      graduation is automatic once its mapping is green.)
 *   2. DRIFT — the committed artifacts must equal a fresh recompute: the schema
 *      PACKAGE (<outDir>/**.schema.json), file-for-file (structural equality after
 *      canonical key-sort), AND the generated markdown reports (core-ledger.md,
 *      core-gaps.md, and rich's core-upstream.md), byte-for-byte. Hand-edits, stale
 *      builds, and orphaned files trip this; run `npm run core:build` and commit.
 *   3. DRIFT (analysis docs) — the docs/ inventories (core-unmapped-inventory.md,
 *      core-lossy-inventory.md, core-bidirectional-flow.md) must likewise equal a
 *      fresh recompute. Not covered by the package/report gates, so a generator-only
 *      change to a doc is caught here rather than slipping through.
 *
 *   npm run core:check
 */
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";

import { deriveCore, CoreProfile, PROFILES, RICH_PROFILE } from "./lib/core-pipeline.js";
import { renderLedger, renderGapReport, renderUpstreamReport } from "./lib/core-reports.js";
import { renderBidiDoc } from "./derive-core-bidirectional-flow.js";
import { renderLossyInventory } from "./derive-core-lossy-inventory.js";
import { renderUnmappedInventory } from "./derive-core-unmapped-inventory.js";

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

/** Committed *.schema.json under `dir`, as paths relative to `dir`. */
async function committedSchemaFiles(dir: string): Promise<string[]> {
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

interface ProfileResult {
  failures: string[];
  drafted: string[];
  pendingGraduation: string[];
  fileCount: number;
  reportCount: number;
}

async function checkProfile(repoRoot: string, profile: CoreProfile): Promise<ProfileResult> {
  const derived = await deriveCore(repoRoot, profile);
  const outDir = profile.outDir;
  const dirAbs = path.join(repoRoot, outDir);
  const allowList = path.join(outDir, "allow-list.yml");
  const failures: string[] = [];

  // --- Gate 1: subset -------------------------------------------------------
  let ratified = new Set<string>();
  try {
    const raw = parseYaml(await readFile(path.join(repoRoot, allowList), "utf8"));
    const list = raw && typeof raw === "object" ? (raw as { ratified?: unknown }).ratified : null;
    if (Array.isArray(list))
      ratified = new Set(list.filter((x): x is string => typeof x === "string"));
    else failures.push(`[${profile.name}] ${allowList}: missing or malformed "ratified:" list`);
  } catch (err) {
    failures.push(
      `[${profile.name}] ${allowList}: cannot read (${(err as Error).message}) — run core:build`
    );
  }

  const drafted = derived.entities.map((e) => e.entity).sort();
  const unratified = drafted.filter((d) => !ratified.has(d));
  if (unratified.length) {
    failures.push(
      `[${profile.name}] SUBSET: the generator drafts ${unratified.length} admissible entit(y/ies) not in ${allowList}:\n` +
        unratified.map((d) => `    + ${d}`).join("\n") +
        `\n  → ratify them, or correct the mapping if they are over-derived.`
    );
  }
  const pendingGraduation = [...ratified].filter((r) => !drafted.includes(r)).sort();

  // --- Gate 2: drift (package, file-for-file) -------------------------------
  const fresh = derived.package;
  let committed: string[] = [];
  try {
    committed = await committedSchemaFiles(dirAbs);
  } catch (err) {
    failures.push(`[${profile.name}] DRIFT: cannot read ${outDir}/ (${(err as Error).message}).`);
  }
  const committedSet = new Set(committed);
  const orphans = committed.filter((r) => !fresh.has(r));
  const missing = [...fresh.keys()].filter((r) => !committedSet.has(r));
  if (missing.length)
    failures.push(`[${profile.name}] DRIFT: not committed (run core:build): ${missing.join(", ")}`);
  if (orphans.length)
    failures.push(
      `[${profile.name}] DRIFT: committed but not generated (stale — delete): ${orphans.join(", ")}`
    );
  for (const [rel, schema] of fresh) {
    if (!committedSet.has(rel)) continue;
    try {
      const onDisk = JSON.parse(await readFile(path.join(dirAbs, rel), "utf8"));
      if (JSON.stringify(canonical(onDisk)) !== JSON.stringify(canonical(schema))) {
        failures.push(
          `[${profile.name}] DRIFT: ${outDir}/${rel} differs from recompute — run \`npm run core:build\` and commit.`
        );
      }
    } catch (err) {
      failures.push(
        `[${profile.name}] DRIFT: cannot read ${outDir}/${rel} (${(err as Error).message}).`
      );
    }
  }

  // --- Gate 2 (cont.): drift on the generated markdown reports --------------
  const reports: Record<string, string> = {
    "core-ledger.md": renderLedger(derived),
    "core-gaps.md": renderGapReport(derived),
  };
  // The upstream report is rich-only (the strict profile has no lossy members).
  if (profile.memberReasons.size > 0) reports["core-upstream.md"] = renderUpstreamReport(derived);
  for (const [name, expected] of Object.entries(reports)) {
    try {
      const onDisk = await readFile(path.join(dirAbs, name), "utf8");
      if (onDisk !== expected) {
        failures.push(
          `[${profile.name}] DRIFT: ${outDir}/${name} differs from recompute — run \`npm run core:build\` and commit.`
        );
      }
    } catch (err) {
      failures.push(
        `[${profile.name}] DRIFT: cannot read ${outDir}/${name} (${
          (err as Error).message
        }) — run \`npm run core:build\`.`
      );
    }
  }

  return {
    failures,
    drafted,
    pendingGraduation,
    fileCount: fresh.size,
    reportCount: Object.keys(reports).length,
  };
}

/**
 * Gate 3: the analysis docs (docs/core-{unmapped-inventory,lossy-inventory,
 * bidirectional-flow}.md) must equal a fresh recompute, byte-for-byte. They come off
 * the SAME pipeline but are profile-scoped (unmapped/lossy render the strict
 * derivation, bidi the rich one). Previously they were only refreshed by core:build,
 * NOT gated — a generator-only change (e.g. doc prose/framing) could stale them
 * without tripping the package/report gates. Gated directly here.
 */
async function checkAnalysisDocs(repoRoot: string): Promise<{ failures: string[]; count: number }> {
  const [strict, rich] = await Promise.all([
    deriveCore(repoRoot),
    deriveCore(repoRoot, RICH_PROFILE),
  ]);
  const docs: Record<string, string> = {
    "core-unmapped-inventory.md": renderUnmappedInventory(strict),
    "core-lossy-inventory.md": renderLossyInventory(strict),
    "core-bidirectional-flow.md": renderBidiDoc(rich),
  };
  const failures: string[] = [];
  for (const [name, expected] of Object.entries(docs)) {
    const rel = path.join("docs", name);
    try {
      const onDisk = await readFile(path.join(repoRoot, rel), "utf8");
      if (onDisk !== expected) {
        failures.push(
          `[docs] DRIFT: ${rel} differs from recompute — run \`npm run core:build\` and commit.`
        );
      }
    } catch (err) {
      failures.push(
        `[docs] DRIFT: cannot read ${rel} (${(err as Error).message}) — run \`npm run core:build\`.`
      );
    }
  }
  return { failures, count: Object.keys(docs).length };
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const results = await Promise.all(PROFILES.map((p) => checkProfile(repoRoot, p)));
  const docs = await checkAnalysisDocs(repoRoot);
  const failures = [...results.flatMap((r) => r.failures), ...docs.failures];

  if (failures.length) {
    console.error("OCF Core check: FAIL\n");
    for (const f of failures) console.error("✗ " + f + "\n");
    return 1;
  }
  console.log("OCF Core check: OK");
  PROFILES.forEach((p, i) => {
    const r = results[i]!;
    console.log(
      `  [${p.name}] ${r.drafted.length} admissible entit(y/ies) ratified; ` +
        `${r.fileCount}-file package + ${r.reportCount} report(s) match recompute.` +
        (r.pendingGraduation.length
          ? `\n    (${
              r.pendingGraduation.length
            } ratified, awaiting a green mapping: ${r.pendingGraduation.join(", ")})`
          : "")
    );
  });
  console.log(`  [docs] ${docs.count} analysis doc(s) match recompute.`);
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
