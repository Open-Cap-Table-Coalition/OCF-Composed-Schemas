#!/usr/bin/env node
import path from "node:path";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { renderQuestionLinks, upsertQuestionLinks } from "./lib/question-links.js";

interface Args {
  check: boolean;
}

const MAPPING_DIRS = ["objects", "types"] as const;

async function collectMappingFiles(repoRoot: string): Promise<string[]> {
  const out: string[] = [];
  for (const dir of MAPPING_DIRS) {
    const abs = path.join(repoRoot, dir);
    try {
      await stat(abs);
    } catch {
      continue;
    }
    const entries = await readdir(abs, { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".mapping.md")) continue;
      const direntDir =
        (entry as unknown as { parentPath?: string; path?: string }).parentPath ??
        (entry as unknown as { path?: string }).path ??
        abs;
      out.push(path.relative(repoRoot, path.join(direntDir, entry.name)));
    }
  }
  return out.sort();
}

async function main(args: Args): Promise<number> {
  const repoRoot = process.cwd();
  const changed: string[] = [];
  for (const mappingRelPath of await collectMappingFiles(repoRoot)) {
    const schemaRelPath = mappingRelPath.replace(/\.mapping\.md$/, ".schema.json");
    const mappingAbsPath = path.join(repoRoot, mappingRelPath);
    const schemaAbsPath = path.join(repoRoot, schemaRelPath);
    const markdown = await readFile(mappingAbsPath, "utf8");
    const schema = JSON.parse(await readFile(schemaAbsPath, "utf8")) as {
      properties?: Record<string, unknown>;
    };
    const properties = Object.keys(schema.properties ?? {});
    const generatedBlock = renderQuestionLinks(mappingRelPath, properties);
    const updated = upsertQuestionLinks(markdown, generatedBlock);
    if (updated === markdown) continue;
    changed.push(mappingRelPath);
    if (!args.check) await writeFile(mappingAbsPath, updated);
  }

  if (args.check && changed.length > 0) {
    console.error(`${changed.length} mapping file(s) have stale question links`);
    for (const file of changed) console.error(`  ${file}`);
    return 1;
  }
  console.log(
    `${args.check ? "Checked" : "Updated"} ${changed.length} mapping file${
      changed.length === 1 ? "" : "s"
    }`
  );
  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("mapping:question-links")
  .usage("$0 [options]")
  .option("check", {
    type: "boolean",
    default: false,
    describe: "Fail if generated question-link blocks are stale",
  })
  .strict()
  .help()
  .parseSync();

main({ check: Boolean(parsed.check) }).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
