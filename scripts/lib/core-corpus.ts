/**
 * Load the GREEN OCF mapping corpus once, shaped for the Core converter.
 *
 * Shared by the read-only report (scripts/derive-core-report) and the schema
 * build (scripts/derive-core-build) so both walk the corpus identically:
 *   - green = block status complete/reviewed, target_standard Carta;
 *   - `ocf_kind: type` mappings feed the type library (sub-property landing);
 *   - `ocf_kind: object` mappings become per-variant effective field maps.
 */
import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";
import { parse as parseYaml } from "yaml";

import { loadRegistry, RawSchema, Registry } from "./registry.js";
import { parseMappingDocument, MappingParseError } from "./mapping-parser.js";
import { TARGET_BUNDLES, isPlainObject } from "./mapping-validator.js";
import { classifyType, TypeVerdict } from "./core-classifier.js";
import { ReferenceGraph } from "./core-admissibility.js";

const REFERENCE_GRAPH = "core/reference-graph.yml";

/** How OCF packages one entity kind into a `*File` document (from files/*File.schema.json). */
export interface FileCategory {
  /** OCF file_type const, e.g. OCF_STOCK_CLASSES_FILE. */
  fileType: string;
  /** Manifest collection key, e.g. stock_classes_files. */
  collectionKey: string;
  /** Vendored file-schema basename, e.g. StockClassesFile. */
  fileName: string;
}

export interface OcfPackaging {
  /** Object entity name → its OCF object-file category. */
  objectFiles: Map<string, FileCategory>;
  /** Entity names OCF places in the (single) TransactionsFile. */
  transactionEntities: Set<string>;
  /** Transactions file category. */
  transactions: FileCategory;
  /** $id of types/File (the manifest `*_files[]` pointer), for inlining. */
  filePointerId: string;
}

const FILE_POINTER_ID =
  "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/File.schema.json";

/** OCF_STOCK_CLASSES_FILE → stock_classes_files (the manifest collection key). */
function collectionKeyOf(fileType: string): string {
  return (
    fileType
      .replace(/^OCF_/, "")
      .replace(/_FILE$/, "")
      .toLowerCase() + "_files"
  );
}

function entitiesOfItems(items: unknown): string[] {
  if (!isPlainObject(items)) return [];
  const it = isPlainObject(items.items) ? items.items : {};
  const refToName = (r: unknown) =>
    typeof r === "string"
      ? r
          .split("/")
          .pop()!
          .replace(/\.schema\.json$/, "")
      : null;
  if (typeof it.$ref === "string") return [refToName(it.$ref)!];
  if (Array.isArray(it.oneOf)) {
    return it.oneOf
      .map((o) => (isPlainObject(o) ? refToName(o.$ref) : null))
      .filter((x): x is string => !!x);
  }
  return [];
}

/**
 * Learn OCF's packaging from the vendored files/*File.schema.json: which object
 * entity lands in which `*File`, and which entities the TransactionsFile holds.
 * Derived, not hand-mapped — the converter mirrors OCF's own file layout.
 */
export async function loadOcfFileCategories(repoRoot: string): Promise<OcfPackaging> {
  const dir = path.join(repoRoot, "files");
  const objectFiles = new Map<string, FileCategory>();
  const transactionEntities = new Set<string>();
  let transactions: FileCategory = {
    fileType: "OCF_TRANSACTIONS_FILE",
    collectionKey: "transactions_files",
    fileName: "TransactionsFile",
  };

  for (const name of (await readdir(dir)).sort()) {
    if (!name.endsWith("File.schema.json")) continue;
    const schema = JSON.parse(await readFile(path.join(dir, name), "utf8"));
    const props =
      isPlainObject(schema) && isPlainObject(schema.properties) ? schema.properties : {};
    const ft = isPlainObject(props.file_type) ? props.file_type.const : undefined;
    if (typeof ft !== "string" || ft === "OCF_MANIFEST_FILE") continue;
    const fileName = name.replace(/\.schema\.json$/, "");
    const cat: FileCategory = { fileType: ft, collectionKey: collectionKeyOf(ft), fileName };
    const entities = entitiesOfItems(props.items);
    if (ft === "OCF_TRANSACTIONS_FILE") {
      transactions = cat;
      for (const e of entities) transactionEntities.add(e);
    } else {
      for (const e of entities) objectFiles.set(e, cat);
    }
  }

  return { objectFiles, transactionEntities, transactions, filePointerId: FILE_POINTER_ID };
}

/** Load the curated §3 reference graph (core/reference-graph.yml). */
export async function loadReferenceGraph(repoRoot: string): Promise<ReferenceGraph> {
  const raw = parseYaml(await readFile(path.join(repoRoot, REFERENCE_GRAPH), "utf8"));
  const obj = isPlainObject(raw) ? raw : {};
  const references: Record<string, string> = {};
  if (isPlainObject(obj.references)) {
    for (const [k, v] of Object.entries(obj.references))
      if (typeof v === "string") references[k] = v;
  }
  const toSet = (v: unknown): Set<string> =>
    new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  return {
    references,
    nonReferences: toSet(obj.non_references),
    nonPayload: toSet(obj.non_payload),
  };
}

const MAPPING_DIRS = ["objects", "types"] as const;
const GREEN = new Set(["complete", "reviewed"]);

export interface GreenObject {
  /** Canonical entity name (the mapping filename, camelCase). */
  entity: string;
  rel: string;
  /** OCF `required_fields` from frontmatter (used for R5 gap reporting). */
  requiredFields: string[];
  /** Source composed-schema properties, by field name. */
  properties: Record<string, unknown>;
  /** variant label ("—" when not polymorphic) → effective field→entry map. */
  variants: Map<string, Record<string, unknown>>;
  /**
   * Set iff this schema is an OCF compatibility wrapper: it `allOf`-inherits
   * another green entity and re-declares only bookkeeping (`object_type`), adding
   * no economic fields of its own (e.g. `PlanSecurityIssuance` → the value is
   * `EquityCompensationIssuance`). Its economic mapping lives in the base.
   */
  aliasOf?: string;
}

export interface Corpus {
  registry: Registry;
  bundle: unknown;
  typeLib: Map<string, TypeVerdict>;
  objects: GreenObject[];
  /** Root Carta `$def` names targeted by any green mapping (for gap report b). */
  targetedDefs: Set<string>;
  /**
   * Carta `$defs` reachable by `$ref` from any `targetedDefs` entry (transitive
   * structural coverage). A green mapping writes to a parent object, and that
   * parent `$ref`s these children — so the concept is covered indirectly even
   * though `collectTargets` only ever credits the ROOT segment of a target
   * pointer and never these nested defs. Used to separate "nested-covered" from
   * "true gap" in gap report (b). Structural reachability, not a proof that a
   * specific field writes into the child.
   */
  transitivelyCoveredDefs: Set<string>;
  skipped: string[];
}

/**
 * Effective field map per variant, mirroring the validator's walk: a plain
 * `fields:` map (single implicit variant "—"), or a polymorphic `shared:` ∪
 * projected-per-variant-target ∪ variant `fields:`.
 */
export function variantFieldMaps(
  mapping: Record<string, unknown>
): Map<string, Record<string, unknown>> {
  const polymorphic =
    isPlainObject(mapping.discriminator) || isPlainObject(mapping.route_by_security);
  if (!polymorphic) {
    const fields = isPlainObject(mapping.fields) ? mapping.fields : {};
    return new Map([["—", fields as Record<string, unknown>]]);
  }

  const variants = isPlainObject(mapping.variants) ? mapping.variants : {};
  const shared = isPlainObject(mapping.shared) ? (mapping.shared as Record<string, unknown>) : {};
  const labels = Object.keys(variants);

  const simpleShared: Record<string, unknown> = {};
  const projected: Record<string, Record<string, unknown>> = Object.fromEntries(
    labels.map((l) => [l, {}])
  );
  for (const [field, entry] of Object.entries(shared)) {
    if (isPlainObject(entry) && isPlainObject(entry.target)) {
      const map = entry.target as Record<string, unknown>;
      for (const label of labels) {
        const val = label in map ? map[label] : null;
        projected[label]![field] =
          typeof val === "string"
            ? { ...entry, target: val }
            : { kind: "unmappable", target: null, reason: "no-equivalent" };
      }
    } else {
      simpleShared[field] = entry;
    }
  }

  const result = new Map<string, Record<string, unknown>>();
  for (const [label, rawV] of Object.entries(variants)) {
    const vFields =
      isPlainObject(rawV) && isPlainObject(rawV.fields)
        ? (rawV.fields as Record<string, unknown>)
        : {};
    result.set(label, { ...simpleShared, ...projected[label], ...vFields });
  }
  return result;
}

/** Basenames of the schemas an `allOf` composes, e.g. `EquityCompensationIssuance`. */
function allOfRefBasenames(schema: unknown): string[] {
  const allOf = isPlainObject(schema) ? (schema as { allOf?: unknown }).allOf : undefined;
  if (!Array.isArray(allOf)) return [];
  const out: string[] = [];
  for (const el of allOf) {
    if (isPlainObject(el) && typeof el.$ref === "string") {
      out.push(
        el.$ref
          .split("/")
          .pop()!
          .replace(/\.schema\.json$/, "")
      );
    }
  }
  return out;
}

/**
 * The base entity a schema is a pure compatibility wrapper for, or undefined.
 * A wrapper `allOf`-composes exactly one *concrete green entity* (not an OCF
 * primitive like `Object`/`Transaction`, which are inlined during composition and
 * are absent from `entityNames`) and re-declares only bookkeeping properties —
 * it adds no economic field of its own. This is the `PlanSecurity*` shape.
 */
const WRAPPER_BOOKKEEPING = new Set(["object_type", "id", "comments"]);
function detectAlias(schema: unknown, entityNames: Set<string>): string | undefined {
  const base = allOfRefBasenames(schema).find((b) => entityNames.has(b));
  if (!base) return undefined;
  const props =
    isPlainObject(schema) && isPlainObject((schema as { properties?: unknown }).properties)
      ? Object.keys((schema as { properties: Record<string, unknown> }).properties)
      : [];
  const bookkeepingOnly = props.length > 0 && props.every((k) => WRAPPER_BOOKKEEPING.has(k));
  return bookkeepingOnly ? base : undefined;
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
      if (!e.isFile() || !e.name.endsWith(".mapping.md")) continue;
      const direntDir =
        (e as unknown as { parentPath?: string; path?: string }).parentPath ??
        (e as unknown as { path?: string }).path ??
        abs;
      out.push(path.relative(repoRoot, path.join(direntDir, e.name)));
    }
  }
  return out.sort();
}

/** Collect every Carta `#/$defs/<Root>/...` root name reachable from a target value. */
function collectTargets(target: unknown, into: Set<string>): void {
  const add = (ptr: string) => {
    const m = /^#\/\$defs\/([^/]+)/.exec(ptr);
    if (m) into.add(m[1] as string);
  };
  if (typeof target === "string") add(target);
  else if (Array.isArray(target)) target.forEach((t) => collectTargets(t, into));
  else if (isPlainObject(target)) Object.values(target).forEach((t) => collectTargets(t, into));
}

/** Collect every `#/$defs/<Root>` root named by a `$ref` anywhere inside a schema node. */
function collectRefRoots(node: unknown, into: Set<string>): void {
  if (Array.isArray(node)) {
    node.forEach((n) => collectRefRoots(n, into));
    return;
  }
  if (!isPlainObject(node)) return;
  for (const [key, val] of Object.entries(node)) {
    if (key === "$ref" && typeof val === "string") {
      const m = /^#\/\$defs\/([^/]+)/.exec(val);
      if (m) into.add(m[1] as string);
    } else {
      collectRefRoots(val, into);
    }
  }
}

/**
 * Transitive `$ref` closure over the Carta bundle: from the directly-targeted
 * roots, follow every `$ref` reachable through their `$def` bodies (properties,
 * items, oneOf/allOf, at any depth) and collect the reached roots. This credits
 * children a green mapping writes to only indirectly — the fix for `collectTargets`
 * crediting just the root segment of a pointer. Returns the strictly-reachable
 * descendants (the seed roots themselves are not added).
 */
function closeOverRefs(bundle: unknown, roots: Set<string>): Set<string> {
  const defs =
    isPlainObject(bundle) && isPlainObject((bundle as { $defs?: unknown }).$defs)
      ? (bundle as { $defs: Record<string, unknown> }).$defs
      : {};
  const covered = new Set<string>();
  const queue: string[] = [...roots];
  while (queue.length > 0) {
    const name = queue.shift() as string;
    const def = defs[name];
    if (def === undefined) continue;
    const children = new Set<string>();
    collectRefRoots(def, children);
    for (const child of children) {
      if (!covered.has(child)) {
        covered.add(child);
        queue.push(child);
      }
    }
  }
  return covered;
}

export async function loadGreenCorpus(repoRoot: string): Promise<Corpus> {
  const registry = await loadRegistry(repoRoot);
  const bundle = JSON.parse(
    await readFile(path.join(repoRoot, TARGET_BUNDLES.Carta as string), "utf8")
  );
  const typeLib = new Map<string, TypeVerdict>();
  const targetedDefs = new Set<string>();
  const skipped: string[] = [];

  const files = await collectMappingFiles(repoRoot);
  const parsed: {
    rel: string;
    frontmatter: Record<string, unknown>;
    mapping: Record<string, unknown>;
  }[] = [];
  for (const rel of files) {
    const markdown = await readFile(path.join(repoRoot, rel), "utf8");
    try {
      const { frontmatter, mapping } = parseMappingDocument(markdown, rel);
      parsed.push({ rel, frontmatter, mapping });
    } catch (err) {
      if (err instanceof MappingParseError) {
        skipped.push(`${rel} (parse error)`);
        continue;
      }
      throw err;
    }
  }

  const isGreenCarta = (fm: Record<string, unknown>, m: Record<string, unknown>) =>
    typeof m.status === "string" && GREEN.has(m.status) && fm.target_standard === "Carta";

  // Pass 1 — type library + harvest all target pointers (for the gap report).
  for (const { frontmatter, mapping } of parsed) {
    if (!isGreenCarta(frontmatter, mapping)) continue;
    for (const fm of variantFieldMaps(mapping).values()) {
      for (const entry of Object.values(fm)) {
        if (isPlainObject(entry)) {
          collectTargets(entry.target, targetedDefs);
          // enum-value → Carta pointer maps (`values:` on a field entry) are
          // targets too, but sit beside `target:` where the old harvest missed them.
          collectTargets(entry.values, targetedDefs);
        }
      }
    }
    // Object-level target blocks that variantFieldMaps does not surface: the
    // top-level and per-variant `primary_targets` arrays (the Carta objects a
    // whole variant lands on). Harvesting these closes a latent blind spot.
    collectTargets(mapping.primary_targets, targetedDefs);
    const variantBlocks = isPlainObject(mapping.variants) ? mapping.variants : {};
    for (const v of Object.values(variantBlocks)) {
      if (isPlainObject(v)) collectTargets(v.primary_targets, targetedDefs);
    }
    if (frontmatter.ocf_kind === "type") {
      const id = frontmatter.ocf_schema_id;
      const fields = isPlainObject(mapping.fields)
        ? (mapping.fields as Record<string, unknown>)
        : null;
      if (typeof id === "string" && fields) typeLib.set(id, classifyType(fields, bundle));
    }
  }

  // The green object entity names — the set an alias `allOf`-base must belong to
  // (OCF composition primitives are not entities, so they never match).
  const objectEntityNames = new Set(
    parsed
      .filter((p) => p.frontmatter.ocf_kind === "object" && isGreenCarta(p.frontmatter, p.mapping))
      .map((p) => path.basename(p.rel).replace(/\.mapping\.md$/, ""))
  );

  // Pass 2 — green objects with their effective field maps + source properties.
  const objects: GreenObject[] = [];
  for (const { rel, frontmatter, mapping } of parsed) {
    if (frontmatter.ocf_kind !== "object") continue;
    if (!isGreenCarta(frontmatter, mapping)) {
      if (typeof mapping.status === "string" && GREEN.has(mapping.status)) {
        skipped.push(`${rel} (target ${String(frontmatter.target_standard)})`);
      }
      continue;
    }
    const schemaRel = rel.replace(/\.mapping\.md$/, ".schema.json");
    let sourceSchema: RawSchema;
    try {
      sourceSchema = JSON.parse(
        await readFile(path.join(repoRoot, schemaRel), "utf8")
      ) as RawSchema;
    } catch {
      skipped.push(`${rel} (no sibling schema)`);
      continue;
    }
    const requiredFields = Array.isArray(frontmatter.required_fields)
      ? (frontmatter.required_fields as unknown[]).filter((x): x is string => typeof x === "string")
      : [];
    objects.push({
      entity: path.basename(rel).replace(/\.mapping\.md$/, ""),
      rel,
      requiredFields,
      properties: (sourceSchema.properties ?? {}) as Record<string, unknown>,
      variants: variantFieldMaps(mapping),
      aliasOf: detectAlias(sourceSchema, objectEntityNames),
    });
  }

  const transitivelyCoveredDefs = closeOverRefs(bundle, targetedDefs);

  return { registry, bundle, typeLib, objects, targetedDefs, transitivelyCoveredDefs, skipped };
}
