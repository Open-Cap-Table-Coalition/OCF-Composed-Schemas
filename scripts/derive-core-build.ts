#!/usr/bin/env node
/**
 * OCF Core — §4 build (the generator).
 *
 * Runs the derive pipeline (scripts/lib/core-pipeline) once PER PROFILE and EMITS
 * each profile's generated artifacts (all generated / never hand-edited):
 *   <profile.outDir>/**.schema.json — the Core JSON Schema package (drift-gated)
 *   <profile.outDir>/core-ledger.md — the membership ledger
 *   <profile.outDir>/core-gaps.md   — the R5 gap report
 *   <profile.outDir>/core-upstream.md — rich only: upstream-OCF change candidates
 * Two profiles ship: `strict` → core/ (lossless intersection) and `rich` →
 * core-rich/ (relaxed-OCF union). `--base` prefixes both dirs (default: repo root).
 * It ALSO regenerates the non-drift-gated analysis docs (docs/core-bidirectional-flow,
 * -lossy-inventory, -unmapped-inventory) so one `core:build` refreshes every generated
 * artifact — a stale analysis doc can't slip past `core:check` (see main()).
 *
 *   npm run core:build                    # emit core/ + core-rich/, print summary
 *   npm run core:build -- --base /tmp/x   # emit /tmp/x/core + /tmp/x/core-rich
 *   npm run core:build -- --sample StockIssuance
 */
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { deriveCore, CoreProfile, PROFILES } from "./lib/core-pipeline.js";
import { renderLedger, renderGapReport, renderUpstreamReport } from "./lib/core-reports.js";
import { writeBidiDoc } from "./derive-core-bidirectional-flow.js";
import { writeLossyInventory } from "./derive-core-lossy-inventory.js";
import { writeUnmappedInventory } from "./derive-core-unmapped-inventory.js";

async function emitProfile(repoRoot: string, base: string, profile: CoreProfile, sample: string) {
  const derived = await deriveCore(repoRoot, profile);
  const outDir = path.join(base, profile.outDir);

  // Write the OCF-style schema package (relative path → schema), plus reports.
  for (const [rel, schema] of derived.package) {
    const abs = path.join(outDir, rel);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, JSON.stringify(schema, null, 2) + "\n", "utf8");
  }
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "core-ledger.md"), renderLedger(derived), "utf8");
  await writeFile(path.join(outDir, "core-gaps.md"), renderGapReport(derived), "utf8");
  // The upstream report is rich-only (empty for strict, which has no lossy members).
  if (profile.memberReasons.size > 0) {
    await writeFile(path.join(outDir, "core-upstream.md"), renderUpstreamReport(derived), "utf8");
  }

  const objects = derived.entities.filter((e) => e.kind === "object").length;
  const events = derived.entities.filter((e) => e.kind === "event").length;
  console.log(`\n[${profile.name}] → ${profile.outDir}/`);
  console.log(
    `  admissible OCF entities: ${derived.entities.length} (${objects} objects, ${events} events)`
  );
  console.log(`  package: ${derived.package.size} files + reports`);

  const sampleRel = [...derived.package.keys()].find((r) => r.includes(sample));
  if (sampleRel && profile.memberReasons.size > 0) {
    console.log(`  sample — ${sampleRel}:`);
    console.log(JSON.stringify(derived.package.get(sampleRel), null, 2));
  }
}

async function main(argv: { base: string; sample: string }): Promise<number> {
  const repoRoot = process.cwd();
  console.log("OCF Core — §4 build (packaged like OCF)");
  console.log("=".repeat(70));
  for (const profile of PROFILES) {
    await emitProfile(repoRoot, argv.base, profile, argv.sample);
  }

  // Analysis docs (docs/*.md) — NOT drift-gated, but regenerated here so ONE
  // `core:build` refreshes EVERY generated artifact. A stale analysis doc can't
  // slip through: any pipeline change that stales one also stales a drift-gated
  // report, which `core:check` catches and forces a rebuild.
  console.log("\nAnalysis docs (docs/, not drift-gated) — regenerating:");
  await writeBidiDoc(argv.base);
  await writeLossyInventory(argv.base);
  await writeUnmappedInventory(argv.base);

  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("core:build")
  .option("base", {
    type: "string",
    describe: "Base directory both profile dirs are written under (default: repo root)",
  })
  .option("sample", {
    type: "string",
    default: "StakeholdersFile",
    describe: "Package file (substring) to print as a sample (rich profile)",
  })
  .strict()
  .help()
  .parseSync();

main({
  base: typeof parsed.base === "string" ? parsed.base : process.cwd(),
  sample: typeof parsed.sample === "string" ? parsed.sample : "StakeholdersFile",
}).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
