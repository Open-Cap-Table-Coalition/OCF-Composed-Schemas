#!/usr/bin/env node
/**
 * OCF Core — §4 build (the generator).
 *
 * Runs the derive pipeline (scripts/lib/core-pipeline) and EMITS the generated
 * artifacts for the admissible set, all generated / never hand-edited:
 *   - core.schema.json — the Core JSON Schema (drift-gated by core:check)
 *   - core-ledger.md   — the membership ledger (one row per entity,variant,field)
 *   - core-gaps.md     — the R5 gap report
 * Writes into --out-dir (default: ./core) and prints a summary + a sample $def.
 *
 *   npm run core:build                       # emit to ./core, print summary
 *   npm run core:build -- --out-dir /tmp/x   # emit elsewhere
 *   npm run core:build -- --sample StockIssuance
 */
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { deriveCore } from "./lib/core-pipeline.js";
import { renderLedger, renderGapReport } from "./lib/core-reports.js";

async function main(argv: { outDir: string; sample: string }): Promise<number> {
  const repoRoot = process.cwd();
  const derived = await deriveCore(repoRoot);

  // Write the OCF-style schema package (relative path → schema), plus the
  // generated markdown reports.
  for (const [rel, schema] of derived.package) {
    const abs = path.join(argv.outDir, rel);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, JSON.stringify(schema, null, 2) + "\n", "utf8");
  }
  await mkdir(argv.outDir, { recursive: true });
  await writeFile(path.join(argv.outDir, "core-ledger.md"), renderLedger(derived), "utf8");
  await writeFile(path.join(argv.outDir, "core-gaps.md"), renderGapReport(derived), "utf8");

  const objects = derived.entities.filter((e) => e.kind === "object").length;
  const events = derived.entities.filter((e) => e.kind === "event").length;
  console.log("OCF Core — §4 build (packaged like OCF)");
  console.log("=".repeat(70));
  console.log(
    `Admissible OCF entities: ${derived.entities.length} (${objects} objects, ${events} events)`
  );
  console.log(`Schema package (${derived.package.size} files) under ${argv.outDir}/:`);
  for (const rel of [...derived.package.keys()].sort()) console.log(`  ${rel}`);
  console.log(`  core-ledger.md\n  core-gaps.md`);

  const sampleRel = [...derived.package.keys()].find((r) => r.includes(argv.sample));
  if (sampleRel) {
    console.log(`\nSample — ${sampleRel}:`);
    console.log(JSON.stringify(derived.package.get(sampleRel), null, 2));
  }
  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("core:build")
  .option("out-dir", {
    type: "string",
    describe: "Directory to write artifacts into (default ./core)",
  })
  .option("sample", {
    type: "string",
    default: "TransactionsFile",
    describe: "Package file (substring) to print as a sample",
  })
  .strict()
  .help()
  .parseSync();

main({
  outDir:
    typeof parsed["out-dir"] === "string"
      ? (parsed["out-dir"] as string)
      : path.join(process.cwd(), "core"),
  sample: typeof parsed.sample === "string" ? parsed.sample : "StockIssuance",
}).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
