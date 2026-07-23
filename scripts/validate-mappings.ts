#!/usr/bin/env node
import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { minimatch } from "minimatch";

import { loadRegistry, RawSchema } from "./lib/registry.js";
import { parseMappingDocument, MappingParseError } from "./lib/mapping-parser.js";
import { validateMapping, ValidationError, TARGET_BUNDLES } from "./lib/mapping-validator.js";
import { MappingReportDocument, renderMappingReport } from "./lib/mapping-report.js";
import { renderMappingInverseReport } from "./lib/mapping-inverse-report.js";

const MAPPING_DIRS = ["objects", "types"] as const;

interface Args {
  filter?: string;
  verbose: boolean;
  inverse: boolean;
  targetObject?: string;
}

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
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith(".mapping.md")) continue;
      const direntDir =
        (e as unknown as { parentPath?: string; path?: string }).parentPath ??
        (e as unknown as { path?: string }).path ??
        abs;
      out.push(path.relative(repoRoot, path.join(direntDir, e.name)));
    }
  }
  return out.sort();
}

async function main(argv: Args): Promise<number> {
  const repoRoot = process.cwd();

  let registry;
  try {
    registry = await loadRegistry(repoRoot);
  } catch (err) {
    console.error(`Failed to load schema registry: ${(err as Error).message}`);
    return 1;
  }

  const all = await collectMappingFiles(repoRoot);
  const mappingFiles = new Set(all);
  const mappingSourceSchemas = new Map<string, RawSchema>();
  for (const rel of all) {
    const schemaRel = rel.replace(/\.mapping\.md$/, ".schema.json");
    try {
      mappingSourceSchemas.set(
        rel,
        JSON.parse(await readFile(path.join(repoRoot, schemaRel), "utf8")) as RawSchema
      );
    } catch {
      // The selected file's sibling-schema error is reported in the main pass below.
    }
  }
  const files = argv.filter ? all.filter((rel) => minimatch(rel, argv.filter as string)) : all;

  const bundleCache = new Map<string, unknown>();
  const errors: ValidationError[] = [];
  const mappingDocuments = new Map<string, MappingReportDocument>();

  // Verbose reports may expand an apply_mapping reference into the referenced
  // mapping's effective fields. Preload the report index without changing the
  // validator's normal error handling for the selected --filter set.
  if (argv.verbose || argv.inverse) {
    for (const rel of all) {
      try {
        const parsed = parseMappingDocument(await readFile(path.join(repoRoot, rel), "utf8"), rel);
        const schemaRel = rel.replace(/\.mapping\.md$/, ".schema.json");
        const sourceSchema = JSON.parse(
          await readFile(path.join(repoRoot, schemaRel), "utf8")
        ) as RawSchema;
        mappingDocuments.set(rel, { ...parsed, sourceSchema });
      } catch {
        // The selected file's parse/schema error is still reported below.
      }
    }
  }

  if (argv.inverse) {
    const bundleRel = TARGET_BUNDLES.Carta;
    if (!bundleRel) {
      console.error("Failed to load target bundle: no Carta bundle is configured");
      return 1;
    }
    let targetBundle: RawSchema;
    try {
      targetBundle = JSON.parse(
        await readFile(path.join(repoRoot, bundleRel), "utf8")
      ) as RawSchema;
    } catch (err) {
      console.error(`Failed to load target bundle ${bundleRel}: ${(err as Error).message}`);
      return 1;
    }
    console.log(
      renderMappingInverseReport({
        documents: mappingDocuments,
        targetBundle,
        targetObject: argv.targetObject,
      }) + "\n"
    );
  }

  for (const rel of files) {
    const markdown = await readFile(path.join(repoRoot, rel), "utf8");

    let parsed;
    try {
      parsed = parseMappingDocument(markdown, rel);
    } catch (err) {
      if (err instanceof MappingParseError) {
        const prefix = `${rel}: `;
        const message = err.message.startsWith(prefix)
          ? err.message.slice(prefix.length)
          : err.message;
        errors.push({ file: rel, field: null, message });
        continue;
      }
      throw err;
    }

    const schemaRel = rel.replace(/\.mapping\.md$/, ".schema.json");
    let sourceSchema: RawSchema;
    try {
      sourceSchema = JSON.parse(
        await readFile(path.join(repoRoot, schemaRel), "utf8")
      ) as RawSchema;
    } catch (err) {
      errors.push({
        file: rel,
        field: null,
        message: `cannot read sibling schema ${schemaRel}: ${(err as Error).message}`,
      });
      continue;
    }

    if (argv.verbose) {
      console.log(
        renderMappingReport({
          file: rel,
          frontmatter: parsed.frontmatter,
          mapping: parsed.mapping,
          sourceSchema,
          mappingDocuments,
        }) + "\n"
      );
    }

    const standard = parsed.frontmatter.target_standard;
    let targetBundle: unknown | null = null;
    if (typeof standard === "string" && standard !== "TBD") {
      const bundleRel = TARGET_BUNDLES[standard];
      if (!bundleRel) {
        errors.push({
          file: rel,
          field: null,
          message: `unknown target_standard "${standard}" (known: ${Object.keys(
            TARGET_BUNDLES
          ).join(", ")})`,
        });
        continue;
      }
      if (!bundleCache.has(bundleRel)) {
        try {
          bundleCache.set(
            bundleRel,
            JSON.parse(await readFile(path.join(repoRoot, bundleRel), "utf8"))
          );
        } catch (err) {
          console.error(`Failed to load target bundle ${bundleRel}: ${(err as Error).message}`);
          return 1;
        }
      }
      targetBundle = bundleCache.get(bundleRel) ?? null;
    }

    errors.push(
      ...validateMapping(
        {
          file: rel,
          frontmatter: parsed.frontmatter,
          mapping: parsed.mapping,
          sourceSchema,
          registry,
          targetBundle,
          mappingFiles,
          mappingSourceSchemas,
        },
        { requireUnmappableReason: true }
      )
    );
  }

  // Reusable scalar types are resolved by their consumers. Keep the reverse
  // index complete without inventing a document-wide mapping mode.
  if (!argv.filter) {
    const countryCodeId = [...registry.keys()].find((id) =>
      id.endsWith("/types/CountryCode.schema.json")
    );
    if (countryCodeId) {
      const { findTypeReferenceSites, validateReferenceSites } = await import(
        "./lib/reference-sites.js"
      );
      for (const message of validateReferenceSites(
        await findTypeReferenceSites(repoRoot, countryCodeId)
      )) {
        errors.push({ file: "types/CountryCode.mapping.md", field: null, message });
      }
    }
  }

  const byFile = new Map<string, ValidationError[]>();
  for (const e of errors) {
    const list = byFile.get(e.file) ?? [];
    list.push(e);
    byFile.set(e.file, list);
  }
  for (const [file, list] of byFile) {
    console.error(file);
    for (const e of list) {
      console.error(`  ${e.field ? `fields.${e.field}: ` : ""}${e.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(
      `\n${errors.length} error(s) across ${byFile.size} file(s); checked ${files.length} mapping file(s)`
    );
    return 1;
  }
  console.log(`OK: checked ${files.length} mapping file(s), 0 errors`);
  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("mapping:validate")
  .usage("$0 [options]")
  .option("filter", {
    type: "string",
    describe: "Glob (relative to repo root) restricting which .mapping.md files are checked",
  })
  .option("verbose", {
    type: "boolean",
    default: false,
    describe: "Print per-file progress",
  })
  .option("inverse", {
    type: "boolean",
    default: false,
    describe: "Print a repository-wide target-first mapping report",
  })
  .option("target-object", {
    type: "string",
    describe: "Restrict --inverse to one Carta $defs object, e.g. ConvertibleNote",
  })
  .strict()
  .help()
  .parseSync();

const argv: Args = {
  filter: typeof parsed.filter === "string" ? parsed.filter : undefined,
  verbose: Boolean(parsed.verbose),
  inverse: Boolean(parsed.inverse),
  targetObject: typeof parsed.targetObject === "string" ? parsed.targetObject : undefined,
};

main(argv).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
