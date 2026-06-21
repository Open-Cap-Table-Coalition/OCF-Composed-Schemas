#!/usr/bin/env node
/**
 * Build a distilled, greppable catalog of the pinned Carta target bundle: every
 * `$def`, its description/type, and a flattened view of each property (type,
 * referenced `$def`, inline/`$ref`'d enum values, format) plus a table of every
 * enum `$def`. It is a *derived* convenience index over
 * `target-schema/Carta.schema.json` — the schema bundle remains the source of
 * truth. `tests/carta-index.test.ts` asserts the committed
 * `target-schema/Carta.index.json` matches a fresh generation, so the index
 * cannot silently drift when the bundle is refreshed.
 *
 *   npm run carta:index            # regenerate target-schema/Carta.index.json
 *   npm run carta:index -- --check # exit non-zero if it is out of date
 */
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

interface PropertyEntry {
  type?: unknown;
  ref?: string;
  enum?: string[];
  format?: string;
  description?: string;
  itemsRef?: string;
  itemsType?: unknown;
}

interface DefEntry {
  description?: string;
  type?: unknown;
  ref?: string;
  enum?: string[];
  properties?: Record<string, PropertyEntry>;
}

export interface CartaIndex {
  $comment: string;
  source: { title?: string; bundle: string };
  defs: Record<string, DefEntry>;
  enums: Record<string, string[]>;
}

const GENERATED_NOTE =
  "GENERATED from target-schema/Carta.schema.json by scripts/build-carta-index.ts — " +
  "do not edit by hand; run `npm run carta:index`.";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Last path segment of a `#/$defs/<Name>` pointer, else the raw ref. */
function refBase(ref: unknown): string | undefined {
  if (typeof ref !== "string") return undefined;
  const m = ref.match(/#\/\$defs\/([^/]+)$/);
  return m ? m[1] : ref;
}

/** Enum values of a node if it is (directly) an enum schema, else null. */
function enumOf(node: unknown): string[] | null {
  if (!isObject(node)) return null;
  if (Array.isArray(node.enum)) return node.enum.map((v) => String(v));
  return null;
}

export function buildCartaIndex(bundle: unknown): CartaIndex {
  const defs: Record<string, DefEntry> = {};
  const enums: Record<string, string[]> = {};
  const rawDefs = isObject(bundle) && isObject(bundle.$defs) ? bundle.$defs : {};

  for (const [name, rawDef] of Object.entries(rawDefs)) {
    if (!isObject(rawDef)) continue;
    const entry: DefEntry = {};
    if (typeof rawDef.description === "string") entry.description = rawDef.description;
    const topEnum = enumOf(rawDef);
    if (topEnum) {
      entry.enum = topEnum;
      enums[name] = topEnum;
    }
    if (rawDef.type !== undefined) entry.type = rawDef.type;
    if (typeof rawDef.$ref === "string") entry.ref = refBase(rawDef.$ref);

    if (isObject(rawDef.properties) && Object.keys(rawDef.properties).length > 0) {
      entry.properties = {};
      for (const [propName, rawProp] of Object.entries(rawDef.properties)) {
        if (!isObject(rawProp)) continue;
        const pe: PropertyEntry = {};
        if (rawProp.type !== undefined) pe.type = rawProp.type;
        if (typeof rawProp.$ref === "string") {
          pe.ref = refBase(rawProp.$ref);
          const target = pe.ref !== undefined ? rawDefs[pe.ref] : undefined;
          const targetEnum = enumOf(target);
          if (targetEnum) pe.enum = targetEnum;
        }
        const inlineEnum = enumOf(rawProp);
        if (inlineEnum) pe.enum = inlineEnum;
        if (typeof rawProp.format === "string") pe.format = rawProp.format;
        if (typeof rawProp.description === "string") pe.description = rawProp.description;
        if (rawProp.type === "array" && isObject(rawProp.items)) {
          pe.itemsRef = refBase(rawProp.items.$ref);
          if (rawProp.items.type !== undefined) pe.itemsType = rawProp.items.type;
        }
        entry.properties[propName] = pe;
      }
    }
    defs[name] = entry;
  }

  const title = isObject(bundle) && typeof bundle.title === "string" ? bundle.title : undefined;
  return {
    $comment: GENERATED_NOTE,
    source: { title, bundle: "target-schema/Carta.schema.json" },
    defs,
    enums,
  };
}

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUNDLE_PATH = path.join(REPO_ROOT, "target-schema/Carta.schema.json");
const INDEX_PATH = path.join(REPO_ROOT, "target-schema/Carta.index.json");

async function main(): Promise<number> {
  const check = process.argv.includes("--check");
  const bundle = JSON.parse(await readFile(BUNDLE_PATH, "utf8"));
  const serialized = JSON.stringify(buildCartaIndex(bundle), null, 2) + "\n";

  if (check) {
    let existing: string | null = null;
    try {
      existing = await readFile(INDEX_PATH, "utf8");
    } catch {
      existing = null;
    }
    if (existing !== serialized) {
      console.error(
        "target-schema/Carta.index.json is out of date with Carta.schema.json; run `npm run carta:index`."
      );
      return 1;
    }
    console.log("target-schema/Carta.index.json is up to date.");
    return 0;
  }

  await writeFile(INDEX_PATH, serialized);
  const parsed = JSON.parse(serialized) as CartaIndex;
  console.log(
    `Wrote target-schema/Carta.index.json (${Object.keys(parsed.defs).length} defs, ${
      Object.keys(parsed.enums).length
    } enums).`
  );
  return 0;
}

// Run the CLI only when executed directly, not when imported (e.g. by tests).
const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}
