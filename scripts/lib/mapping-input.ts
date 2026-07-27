import path from "node:path";
import { readFile, readdir, stat } from "node:fs/promises";

import { parseMappingDocument } from "./mapping-parser.js";
import type { MappingReportDocument } from "./mapping-report.js";
import type { RawSchema } from "./registry.js";

const MAPPING_DIRS = ["objects", "types"] as const;

/** Find every mapping document using the repository's canonical source roots. */
export async function collectMappingFiles(repoRoot: string): Promise<string[]> {
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
      const parent =
        (entry as unknown as { parentPath?: string }).parentPath ??
        (entry as unknown as { path?: string }).path ??
        abs;
      out.push(path.relative(repoRoot, path.join(parent, entry.name)));
    }
  }
  return out.sort();
}

/** Load all parseable mapping/schema pairs for report and renderer consumers. */
export async function loadMappingDocuments(
  repoRoot: string,
  files: readonly string[]
): Promise<Map<string, MappingReportDocument>> {
  const documents = new Map<string, MappingReportDocument>();
  for (const rel of files) {
    try {
      const parsed = parseMappingDocument(await readFile(path.join(repoRoot, rel), "utf8"), rel);
      const schemaRel = rel.replace(/\.mapping\.md$/, ".schema.json");
      const sourceSchema = JSON.parse(
        await readFile(path.join(repoRoot, schemaRel), "utf8")
      ) as RawSchema;
      documents.set(rel, { ...parsed, sourceSchema });
    } catch {
      // The validator reports selected parse/schema errors. Renderers retain
      // the parseable evidence they can inspect without masking those errors.
    }
  }
  return documents;
}
