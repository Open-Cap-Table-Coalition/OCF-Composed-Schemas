#!/usr/bin/env node
/**
 * Materialize the canonical inverse report and the reviewable Pages explorer.
 *
 * CI renders the same values into its uploaded artifact directory. This command
 * exists for the checked-in Pages explorer copy and for a byte-for-byte drift
 * check against the CI renderer.
 */
import path from "node:path";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { loadGreenCorpus } from "./lib/core-corpus.js";
import { buildInverseCoverage } from "./lib/inverse-coverage.js";
import { collectMappingFiles, loadMappingDocuments } from "./lib/mapping-input.js";
import {
  renderMappingFlowHtml,
  renderMappingFlowSvgs,
  renderMappingInverseReport,
} from "./lib/mapping-inverse-report.js";
import {
  buildMappingExplorerData,
  renderMappingExplorerAppJs,
  renderMappingExplorerCss,
  renderMappingExplorerIndex,
  renderMappingExplorerSourcePage,
  renderMappingExplorerTargetPage,
} from "./lib/mapping-explorer.js";
import { loadCartaSchemaResources } from "./lib/carta-schema.js";

interface Args {
  base: string;
  check: boolean;
}

async function compareOrWrite(
  file: string,
  expected: string,
  check: boolean,
  failures: string[]
): Promise<void> {
  try {
    const actual = await readFile(file, "utf8");
    if (actual !== expected && check) {
      failures.push(`stale or different: ${path.relative(process.cwd(), file)}`);
    }
  } catch {
    if (check) failures.push(`missing: ${path.relative(process.cwd(), file)}`);
  }
  if (!check) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, expected, "utf8");
  }
}

async function collectFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { recursive: true, withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const parent =
          (entry as unknown as { parentPath?: string }).parentPath ??
          (entry as unknown as { path?: string }).path ??
          directory;
        return path.relative(directory, path.join(parent, entry.name));
      })
      .sort();
  } catch {
    return [];
  }
}

async function compareOrWriteSite(
  directory: string,
  files: ReadonlyMap<string, string>,
  check: boolean,
  failures: string[]
): Promise<void> {
  const existing = await collectFiles(directory);
  const expected = new Set(files.keys());
  for (const stale of existing.filter((file) => !expected.has(file))) {
    if (check)
      failures.push(
        `stale site artifact: ${path.relative(process.cwd(), path.join(directory, stale))}`
      );
    else await unlink(path.join(directory, stale));
  }
  for (const [relative, contents] of files) {
    await compareOrWrite(path.join(directory, relative), contents, check, failures);
  }
}

function buildExplorerSiteFiles(
  explorer: ReturnType<typeof buildMappingExplorerData>,
  report: string,
  html: string,
  svgArtifacts: ReadonlyMap<string, string>
): Map<string, string> {
  const files = new Map<string, string>([
    ["index.html", renderMappingExplorerIndex(explorer)],
    ["styles.css", renderMappingExplorerCss()],
    ["app.js", renderMappingExplorerAppJs()],
    ["assets/mapping-inverse-report.md", report],
    ["assets/mapping-flows-interactive/index.html", html],
  ]);
  for (const [name, contents] of svgArtifacts) files.set(`assets/mapping-flows/${name}`, contents);
  for (const source of explorer.sources) {
    files.set(`sources/${source.slug}.html`, renderMappingExplorerSourcePage(source));
  }
  for (const target of explorer.targets) {
    files.set(`targets/${target.slug}.html`, renderMappingExplorerTargetPage(target));
  }
  validateExplorerLinks(files);
  return files;
}

function validateExplorerLinks(files: ReadonlyMap<string, string>): void {
  const known = new Set(files.keys());
  for (const [relative, contents] of files) {
    if (!relative.endsWith(".html")) continue;
    for (const match of contents.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1] ?? "";
      if (
        !reference ||
        reference.startsWith("#") ||
        reference.startsWith("http://") ||
        reference.startsWith("https://") ||
        reference.startsWith("mailto:")
      ) {
        continue;
      }
      const local = reference.split(/[?#]/u, 1)[0] ?? "";
      if (!local) continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(relative), local));
      if (!known.has(target))
        throw new Error(`Mapping explorer has a broken local link: ${relative} → ${reference}`);
    }
  }
}

async function main(args: Args): Promise<number> {
  const repoRoot = process.cwd();
  const files = await collectMappingFiles(repoRoot);
  const mappingDocuments = await loadMappingDocuments(repoRoot, files);
  const corpus = await loadGreenCorpus(repoRoot);
  const inverse = buildInverseCoverage(corpus);
  const compatibilityWrappers = corpus.objects.filter((object) => object.aliasOf).length;
  const report =
    renderMappingInverseReport({
      inverse,
      sourceDocuments: mappingDocuments.size - compatibilityWrappers,
      greenDocuments: corpus.greenDocuments.size - compatibilityWrappers,
      excludedCompatibilityWrappers: compatibilityWrappers,
      mappingDocuments,
      includeRelatedObjectPropertyFlows: false,
      compactAggregateTrees: true,
    }) + "\n";
  const svgArtifacts = renderMappingFlowSvgs({ inverse, mappingDocuments });
  const html = renderMappingFlowHtml({ inverse, mappingDocuments });
  const explorer = buildMappingExplorerData(
    corpus,
    inverse,
    [...svgArtifacts.keys()],
    mappingDocuments,
    await loadCartaSchemaResources(repoRoot)
  );
  const explorerFiles = buildExplorerSiteFiles(explorer, report, html, svgArtifacts);

  const outputRoot = path.resolve(repoRoot, args.base);
  const failures: string[] = [];
  await compareOrWriteSite(
    path.join(outputRoot, "docs/generated/mapping-explorer"),
    explorerFiles,
    args.check,
    failures
  );

  if (failures.length > 0) {
    console.error("Mapping Explorer artifacts: FAIL");
    for (const failure of failures) console.error(`✗ ${failure}`);
    return 1;
  }
  console.log(
    `${args.check ? "Mapping inverse artifacts: OK" : "Wrote mapping inverse artifacts"} (${
      svgArtifacts.size
    } SVGs, ${explorerFiles.size} explorer files)`
  );
  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("mapping:artifacts")
  .option("base", {
    type: "string",
    default: ".",
    describe: "Output base directory (default: repository root)",
  })
  .option("check", {
    type: "boolean",
    default: false,
    describe: "Check checked-in artifacts without writing them",
  })
  .strict()
  .help()
  .parseSync();

main({
  base: typeof parsed.base === "string" ? parsed.base : ".",
  check: Boolean(parsed.check),
}).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
