import path from "node:path";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { minimatch } from "minimatch";

import { RawSchema, Registry } from "./registry.js";
import { renderMappingMarkdown } from "./render.js";

export interface WalkAndWriteOptions {
  repoRoot: string;
  registry: Registry;
  force: boolean;
  dryRun: boolean;
  filter?: string;
  generatedDate: string;
  verbose: boolean;
}

export interface WalkAndWriteResult {
  wrote: string[];
  skipped: string[];
  considered: number;
}

const TARGET_DIRS = ["objects", "types"] as const;

export async function walkAndWrite(options: WalkAndWriteOptions): Promise<WalkAndWriteResult> {
  const { repoRoot, registry, force, dryRun, filter, generatedDate, verbose } = options;

  const candidates: string[] = [];
  for (const dir of TARGET_DIRS) {
    const abs = path.join(repoRoot, dir);
    try {
      await stat(abs);
    } catch {
      continue;
    }
    const entries = await readdir(abs, { recursive: true, withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith(".schema.json")) continue;
      const direntDir =
        (e as unknown as { parentPath?: string }).parentPath ??
        (e as unknown as { path?: string }).path ??
        abs;
      const absPath = path.join(direntDir, e.name);
      candidates.push(path.relative(repoRoot, absPath));
    }
  }
  candidates.sort();

  const filtered = filter ? candidates.filter((rel) => minimatch(rel, filter)) : candidates;

  const wrote: string[] = [];
  const skipped: string[] = [];

  for (const schemaRel of filtered) {
    const mappingRel = schemaRel.replace(/\.schema\.json$/, ".mapping.md");
    const mappingAbs = path.join(repoRoot, mappingRel);

    if (!force) {
      try {
        await stat(mappingAbs);
        skipped.push(mappingRel);
        if (verbose) console.log(`skip   ${mappingRel}`);
        continue;
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
        // ENOENT: file doesn't exist, fall through to write
      }
    }

    const schemaAbs = path.join(repoRoot, schemaRel);
    const raw = await readFile(schemaAbs, "utf8");
    let json: RawSchema;
    try {
      json = JSON.parse(raw) as RawSchema;
    } catch (err) {
      throw new Error(`Failed to parse ${schemaRel}: ${(err as Error).message}`);
    }
    const md = renderMappingMarkdown({
      schema: json,
      schemaRelPath: schemaRel,
      registry,
      generatedDate,
    });

    wrote.push(mappingRel);
    if (verbose) console.log(`${dryRun ? "dry-write" : "write"}  ${mappingRel}`);
    if (!dryRun) {
      await writeFile(mappingAbs, md);
    }
  }

  return { wrote, skipped, considered: candidates.length };
}
