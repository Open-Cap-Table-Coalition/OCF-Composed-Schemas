#!/usr/bin/env node
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { minimatch } from "minimatch";

import { loadRegistry, RawSchema } from "./lib/registry.js";
import { parseMappingDocument, MappingParseError } from "./lib/mapping-parser.js";
import { validateMapping, ValidationError, TARGET_BUNDLES } from "./lib/mapping-validator.js";
import { MappingReportDocument, renderMappingReport } from "./lib/mapping-report.js";
import {
  renderMappingFlowHtml,
  renderMappingFlowSvgs,
  renderMappingInverseReport,
} from "./lib/mapping-inverse-report.js";
import { loadGreenCorpus } from "./lib/core-corpus.js";
import { buildInverseCoverage } from "./lib/inverse-coverage.js";
import { collectMappingFiles, loadMappingDocuments } from "./lib/mapping-input.js";

interface Args {
  filter?: string;
  verbose: boolean;
  inverse: boolean;
  targetObject?: string;
  inverseSvgDir?: string;
  inverseHtmlDir?: string;
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
    for (const [rel, document] of await loadMappingDocuments(repoRoot, all)) {
      mappingDocuments.set(rel, document);
    }
  }

  if (argv.inverse) {
    try {
      const corpus = await loadGreenCorpus(repoRoot);
      const inverse = buildInverseCoverage(corpus);
      console.log(
        renderMappingInverseReport({
          inverse,
          sourceDocuments: mappingDocuments.size,
          greenDocuments: corpus.greenDocuments.size,
          targetObject: argv.targetObject,
          mappingDocuments,
          includeRelatedObjectPropertyFlows: false,
          compactAggregateTrees: true,
        }) + "\n"
      );
      if (argv.inverseSvgDir) {
        const outputDir = path.resolve(repoRoot, argv.inverseSvgDir);
        await mkdir(outputDir, { recursive: true });
        const artifacts = renderMappingFlowSvgs({
          inverse,
          targetObject: argv.targetObject,
          mappingDocuments,
        });
        await Promise.all(
          [...artifacts.entries()].map(([name, contents]) =>
            writeFile(path.join(outputDir, name), contents, "utf8")
          )
        );
        console.error(
          `Wrote ${artifacts.size} mapping flow SVG artifact(s) to ${argv.inverseSvgDir}`
        );
      }
      if (argv.inverseHtmlDir) {
        const outputDir = path.resolve(repoRoot, argv.inverseHtmlDir);
        await mkdir(outputDir, { recursive: true });
        await writeFile(
          path.join(outputDir, "index.html"),
          renderMappingFlowHtml({
            inverse,
            targetObject: argv.targetObject,
            mappingDocuments,
          }),
          "utf8"
        );
        console.error(`Wrote interactive mapping flow viewer to ${argv.inverseHtmlDir}/index.html`);
      }
    } catch (err) {
      console.error(`Failed to build inverse coverage ledger: ${(err as Error).message}`);
      return 1;
    }
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
          questions: parsed.questions,
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
  .option("inverse-svg-dir", {
    type: "string",
    describe: "Write related-object flow SVG artifacts to this directory",
  })
  .option("inverse-html-dir", {
    type: "string",
    describe: "Write a self-contained interactive related-object flow viewer to this directory",
  })
  .strict()
  .help()
  .parseSync();

const argv: Args = {
  filter: typeof parsed.filter === "string" ? parsed.filter : undefined,
  verbose: Boolean(parsed.verbose),
  inverse: Boolean(parsed.inverse),
  targetObject: typeof parsed.targetObject === "string" ? parsed.targetObject : undefined,
  inverseSvgDir: typeof parsed.inverseSvgDir === "string" ? parsed.inverseSvgDir : undefined,
  inverseHtmlDir: typeof parsed.inverseHtmlDir === "string" ? parsed.inverseHtmlDir : undefined,
};

main(argv).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
