#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { loadRegistry } from "./lib/registry.js";
import { walkAndWrite } from "./lib/walk-and-write.js";

interface Args {
  force: boolean;
  dryRun: boolean;
  filter?: string;
  verbose: boolean;
}

async function main(argv: Args): Promise<number> {
  const cwd = process.cwd();
  const today = new Date().toISOString().slice(0, 10);

  let registry;
  try {
    registry = await loadRegistry(cwd);
  } catch (err) {
    console.error(`Failed to load schema registry: ${(err as Error).message}`);
    return 1;
  }

  const result = await walkAndWrite({
    repoRoot: cwd,
    registry,
    force: argv.force,
    dryRun: argv.dryRun,
    filter: argv.filter,
    generatedDate: today,
    verbose: argv.verbose,
  });

  const verb = argv.dryRun ? "Would write" : "Wrote";
  console.log(
    `${verb} ${result.wrote.length} file${result.wrote.length === 1 ? "" : "s"}; ` +
      `skipped ${result.skipped.length}; considered ${result.considered}`
  );
  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("mapping:skeleton")
  .usage("$0 [options]")
  .option("force", {
    type: "boolean",
    default: false,
    describe: "Overwrite existing .mapping.md files",
  })
  .option("dry-run", {
    type: "boolean",
    default: false,
    describe: "Report planned writes without touching disk",
  })
  .option("filter", {
    type: "string",
    describe: "Glob (relative to repo root) restricting which schemas are processed",
  })
  .option("verbose", {
    type: "boolean",
    default: false,
    describe: "Print per-file progress",
  })
  .strict()
  .help()
  .parseSync();

const argv: Args = {
  force: Boolean(parsed.force),
  dryRun: Boolean(parsed["dry-run"]),
  filter: typeof parsed.filter === "string" ? parsed.filter : undefined,
  verbose: Boolean(parsed.verbose),
};

main(argv).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
