import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import { cartaSchemaIssueUrl, mappingFileUrl } from "./question-links.js";
import { TARGET_BUNDLES } from "./mapping-validator.js";

export interface CartaSchemaMetadata {
  label: string;
  value: string;
}

export interface CartaSchemaReport {
  path: string;
  label: string;
  url: string;
}

export interface CartaSchemaResources {
  title: string;
  schemaPath: string;
  schemaUrl: string;
  readmeUrl?: string;
  issueUrl: string;
  metadata: CartaSchemaMetadata[];
  reports: CartaSchemaReport[];
}

const TARGET_SCHEMA_README = "target-schema/README.md";
const CARTA_SCHEMA_PATH = TARGET_BUNDLES.Carta ?? "target-schema/Carta.schema.json";

interface ProvenanceCarta {
  version?: string;
  sha256?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function titleForMarkdownFile(file: string): string {
  const basename = path.posix.basename(file, ".md");
  return basename.replace(/[-_]+/gu, " ").replace(/\b\w/gu, (letter) => letter.toUpperCase());
}

function readTrackedMetadata(markdown: string): Map<string, string> {
  const fields = new Map<string, string>();
  for (const line of markdown.split(/\r?\n/u)) {
    const match = line.match(/^\s*-\s+\*\*([^*]+):\*\*\s*(.*?)\s*$/u);
    if (match?.[1] && match[2]) fields.set(match[1].trim().toLowerCase(), match[2].trim());
  }
  return fields;
}

function parseCopyMetadata(value: string | undefined): {
  date?: string;
  person?: string;
} {
  if (!value) return {};
  const match = value.match(/^(.*?)\s+by\s+(.+)$/iu);
  return match?.[1] && match[2]
    ? { date: match[1].trim(), person: match[2].trim() }
    : { date: value };
}

async function readProvenance(repoRoot: string): Promise<ProvenanceCarta> {
  try {
    const parsed: unknown = JSON.parse(
      await readFile(path.join(repoRoot, "provenance.lock.json"), "utf8")
    );
    const carta = isRecord(parsed) && isRecord(parsed.carta) ? parsed.carta : {};
    return {
      version: typeof carta.version === "string" ? carta.version : undefined,
      sha256: typeof carta.sha256 === "string" ? carta.sha256 : undefined,
    };
  } catch {
    return {};
  }
}

export function defaultCartaSchemaResources(): CartaSchemaResources {
  const schemaPath = CARTA_SCHEMA_PATH;
  return {
    title: "Carta OCF Core proposal",
    schemaPath,
    schemaUrl: mappingFileUrl(schemaPath),
    issueUrl: cartaSchemaIssueUrl(schemaPath),
    metadata: [],
    reports: [],
  };
}

/** Read the tracked Carta bundle, metadata, and optional Markdown reports. */
export async function loadCartaSchemaResources(repoRoot: string): Promise<CartaSchemaResources> {
  const schemaPath = CARTA_SCHEMA_PATH;
  const targetSchemaDirectory = path.join(repoRoot, "target-schema");
  const schema = JSON.parse(await readFile(path.join(repoRoot, schemaPath), "utf8")) as unknown;
  const readme = await readFile(path.join(repoRoot, TARGET_SCHEMA_README), "utf8");
  const tracked = readTrackedMetadata(readme);
  const provenance = await readProvenance(repoRoot);
  const copied = parseCopyMetadata(
    tracked.get("last copied") ?? tracked.get("uploaded") ?? tracked.get("upload")
  );
  const version = provenance.version ?? tracked.get("version");
  const sha256 = provenance.sha256 ?? tracked.get("sha-256") ?? tracked.get("sha256");
  const metadata: CartaSchemaMetadata[] = [];

  const add = (label: string, value: string | undefined) => {
    if (value) metadata.push({ label, value });
  };
  add("Version", version);
  add("Standard", tracked.get("standard"));
  add("Source", tracked.get("source"));
  add("Uploaded", copied.date);
  add("Uploader", copied.person);
  add("SHA-256", sha256);

  const reports = (await readdir(targetSchemaDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => `target-schema/${entry.name}`)
    .filter((file) => file !== TARGET_SCHEMA_README)
    .sort()
    .map((file) => ({
      path: file,
      label: titleForMarkdownFile(file),
      url: mappingFileUrl(file),
    }));

  const title =
    isRecord(schema) && typeof schema.title === "string" ? schema.title : "Carta OCF Core proposal";
  return {
    title,
    schemaPath,
    schemaUrl: mappingFileUrl(schemaPath),
    readmeUrl: mappingFileUrl(TARGET_SCHEMA_README),
    issueUrl: cartaSchemaIssueUrl(schemaPath, { title, version, sha256 }),
    metadata,
    reports,
  };
}
