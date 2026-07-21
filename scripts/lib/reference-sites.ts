import path from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";

import { parseMappingDocument } from "./mapping-parser.js";

export interface TypeReferenceSite {
  sourceSchemaPath: string;
  sourceSchemaId: string;
  propertyPath: string;
  mappingPath: string;
  entry: Record<string, unknown> | null;
}

const SCHEMA_DIRS = ["enums", "files", "objects", "primitives", "types", "canonical"] as const;

async function collectSchemaFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  for (const dir of SCHEMA_DIRS) {
    const abs = path.join(root, dir);
    let entries;
    try {
      entries = await readdir(abs, { recursive: true, withFileTypes: true });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw err;
    }
    for (const e of entries) {
      if (!e.isFile() || !e.name.endsWith(".schema.json")) continue;
      const direntDir =
        (e as unknown as { parentPath?: string; path?: string }).parentPath ??
        (e as unknown as { path?: string }).path ??
        abs;
      out.push(path.join(direntDir, e.name));
    }
  }
  return out.sort();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pointerToken(value: string): string {
  return value.replace(/~1/g, "/").replace(/~0/g, "~");
}

function propertyPath(pointer: string[]): string {
  const properties: string[] = [];
  for (let i = 0; i < pointer.length; i++) {
    if (pointer[i] === "properties" && pointer[i + 1]) {
      properties.push(pointerToken(pointer[i + 1] as string));
    }
  }
  return properties.join(".") || "(schema-level reference)";
}

function mappingPathForSchema(repoRoot: string, schemaPath: string): string {
  return path.relative(repoRoot, schemaPath.replace(/\.schema\.json$/, ".mapping.md"));
}

async function scanTypeReferenceSites(
  repoRoot: string,
  targetSchemaId: string
): Promise<TypeReferenceSite[]> {
  const sites: TypeReferenceSite[] = [];
  for (const schemaPath of await collectSchemaFiles(repoRoot)) {
    const raw = JSON.parse(await readFile(schemaPath, "utf8")) as unknown;
    if (!isObject(raw) || typeof raw.$id !== "string") continue;
    const sourceSchemaId = raw.$id;
    const sourceSchemaPath = path.relative(repoRoot, schemaPath);

    const visit = (node: unknown, pointer: string[]): void => {
      if (Array.isArray(node)) {
        node.forEach((child, index) => visit(child, [...pointer, String(index)]));
        return;
      }
      if (!isObject(node)) return;
      if (node.$ref === targetSchemaId) {
        const mappingPath = mappingPathForSchema(repoRoot, schemaPath);
        let entry: Record<string, unknown> | null = null;
        try {
          const mappingMarkdown = requireReadMapping(repoRoot, mappingPath);
          const parsed = parseMappingDocument(mappingMarkdown, mappingPath);
          const fields = isObject(parsed.mapping.fields) ? parsed.mapping.fields : {};
          const leaf = propertyPath(pointer).split(".").at(-1) ?? "";
          const candidate = fields[leaf];
          if (isObject(candidate)) entry = candidate;
        } catch {
          // The validator reports missing or malformed consumer mappings. The
          // generator still lists the site so the omission is visible.
        }
        sites.push({
          sourceSchemaPath,
          sourceSchemaId,
          propertyPath: propertyPath(pointer),
          mappingPath,
          entry,
        });
      }
      for (const [key, child] of Object.entries(node)) visit(child, [...pointer, key]);
    };

    visit(raw, []);
  }
  return sites.sort((a, b) =>
    `${a.sourceSchemaPath}:${a.propertyPath}`.localeCompare(
      `${b.sourceSchemaPath}:${b.propertyPath}`
    )
  );
}

// Kept as a small synchronous-shaped adapter so the recursive scanner remains
// readable while mapping files are read through the async filesystem API.
let mappingReadCache: Map<string, string> | null = null;
function requireReadMapping(repoRoot: string, mappingPath: string): string {
  // This function is replaced by the async preloader below before discovery
  // runs. Throwing here makes an unavailable mapping visible to the caller.
  const value = mappingReadCache?.get(path.join(repoRoot, mappingPath));
  if (value === undefined) throw new Error(`mapping not loaded: ${mappingPath}`);
  return value;
}

async function preloadMappings(repoRoot: string): Promise<void> {
  mappingReadCache = new Map();
  for (const dir of ["objects", "types"] as const) {
    const abs = path.join(repoRoot, dir);
    let entries;
    try {
      entries = await readdir(abs, { recursive: true, withFileTypes: true });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw err;
    }
    for (const e of entries) {
      if (!e.isFile() || !e.name.endsWith(".mapping.md")) continue;
      const direntDir =
        (e as unknown as { parentPath?: string; path?: string }).parentPath ??
        (e as unknown as { path?: string }).path ??
        abs;
      const filePath = path.join(direntDir, e.name);
      mappingReadCache.set(filePath, await readFile(filePath, "utf8"));
    }
  }
}

export async function findTypeReferenceSites(
  repoRoot: string,
  targetSchemaId: string
): Promise<TypeReferenceSite[]> {
  await preloadMappings(repoRoot);
  return scanTypeReferenceSites(repoRoot, targetSchemaId);
}

export function referenceDisposition(entry: Record<string, unknown> | null): string {
  if (!entry) return "MISSING mapping entry";
  const kind = typeof entry.kind === "string" ? entry.kind : "invalid kind";
  if (kind === "unmappable") {
    const reason = typeof entry.reason === "string" ? entry.reason : "missing reason";
    return `${kind} / ${reason}`;
  }
  const target = typeof entry.target === "string" ? entry.target : "missing target";
  const policy = typeof entry.policy === "string" ? `; policy: ${entry.policy}` : "";
  return `${kind} → ${target}${policy}`;
}

export function validateReferenceSites(sites: TypeReferenceSite[]): string[] {
  const errors: string[] = [];
  for (const site of sites) {
    if (!site.entry) {
      errors.push(
        `${site.mappingPath}: missing mapping for referenced property ${site.propertyPath}`
      );
      continue;
    }
    if (typeof site.entry.kind !== "string") {
      errors.push(`${site.mappingPath}: referenced property ${site.propertyPath} has no kind`);
    }
    if (site.entry.kind === "unmappable" && typeof site.entry.reason !== "string") {
      errors.push(
        `${site.mappingPath}: referenced property ${site.propertyPath} is unmappable without reason`
      );
    }
  }
  return errors;
}

export async function updateGeneratedReferenceSection(
  repoRoot: string,
  targetSchemaId: string,
  targetMappingPath: string
): Promise<TypeReferenceSite[]> {
  const sites = await findTypeReferenceSites(repoRoot, targetSchemaId);
  const targetPath = path.join(repoRoot, targetMappingPath);
  const markdown = await readFile(targetPath, "utf8");
  const begin = "<!-- BEGIN GENERATED REFERENCE SITES -->";
  const end = "<!-- END GENERATED REFERENCE SITES -->";
  const targetDir = path.posix.dirname(targetMappingPath);
  const rows = sites.map((site) => {
    const consumer = path.posix.relative(targetDir, site.mappingPath);
    const href = consumer.startsWith(".") ? consumer : `./${consumer}`;
    const label = `${site.mappingPath.replace(/\.mapping\.md$/, "")} · ${site.propertyPath}`;
    return `| ${site.sourceSchemaPath.replace(
      /\.schema\.json$/,
      ""
    )} | [${label}](${href}) | ${referenceDisposition(site.entry)} |`;
  });
  const block = [
    begin,
    "### Reference sites (generated)",
    "",
    `Reverse \`$ref\` index: **${sites.length}/${sites.length}** discovered consumer sites are listed here. The consumer mapping is authoritative; this section exists to make the context-dependent resolution auditable and complete.`,
    "",
    "| OCF consumer schema | Consumer mapping | Disposition |",
    "| --- | --- | --- |",
    ...rows,
    end,
  ].join("\n");
  const markerPattern = new RegExp(`${escapeRegExp(begin)}[\\s\\S]*?${escapeRegExp(end)}`);
  const updated = markerPattern.test(markdown)
    ? markdown.replace(markerPattern, block)
    : markdown.replace(
        "\n## Notes / open questions\n",
        `\n${block}\n\n## Notes / open questions\n`
      );
  if (updated === markdown && !markerPattern.test(markdown)) {
    throw new Error(`Could not find insertion point in ${targetMappingPath}`);
  }
  await writeFile(targetPath, updated, "utf8");
  return sites;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
