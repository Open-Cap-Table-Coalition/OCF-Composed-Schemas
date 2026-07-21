/**
 * OCF Core — §4 schema emitter (packaged like OCF proper).
 *
 * Emits a multi-file package mirroring OCF's own layout (a manifest + per-category
 * `*File` schemas, each with `items`), reusing OCF `file_type` consts so a Core
 * package is also a shape-valid OCF package:
 *   OCFCoreManifestFile.schema.json  — issuer + `*_files` collections (file_type OCF_MANIFEST_FILE)
 *   files/TransactionsFile.schema.json — every admissible EVENT, items.oneOf
 *   files/<Category>File.schema.json   — each admissible OBJECT, items[]
 *
 * Entities are OCF entities (variants collapsed): a Carta-fold variant split like
 * StockIssuance Default/Rsa is one OCF `StockIssuance` here (R0 — Core uses OCF's
 * own objects); a field is included if it is `core` in any admissible variant.
 * Every value is INLINED into OCF grammar (assertable patterns, synthesized Date),
 * so each file is self-contained — no `$ref`, intra-package or external.
 *
 * Every emitted entity requires OCF's identity spine (`object_type` + `id`);
 * economic fields remain optional because the Carta fold declares nothing
 * required (§3).
 */
import { detectEnumValues } from "./enum-detection.js";
import { Registry } from "./registry.js";
import { isPlainObject } from "./mapping-validator.js";
import { resolveSource } from "./core-classifier.js";
import { OcfPackaging } from "./core-corpus.js";

const DRAFT7 = "http://json-schema.org/draft-07/schema#";
const ID_BASE = "https://opencaptablecoalition.com/ocf-core/v0";
const DATE_PATTERN = "^\\d{4}-\\d{2}-\\d{2}$";

/** Render one OCF source node into an inlined, OCF-grammar-constrained Core node. */
export function renderNode(
  srcRaw: unknown,
  registry: Registry,
  depth = 0
): Record<string, unknown> {
  if (depth > 12) return {};
  const n = resolveSource(srcRaw, registry);
  if (!isPlainObject(n)) return {};

  if (n.type === "array") {
    return withUnion(
      n,
      copyAssertions(n, {
        type: "array",
        items: renderNode(n.items, registry, depth + 1),
      }),
      registry,
      depth
    );
  }

  // Preserve a const (e.g. object_type) — it discriminates the transaction union.
  if (n.const !== undefined) return { const: n.const };

  const enumVals = detectEnumValues(n, registry);
  if (enumVals)
    return withUnion(n, copyAssertions(n, { type: "string", enum: enumVals }), registry, depth);

  // Composite type (object with its own properties): recurse, keep its required.
  // OCF scalar type files carry boilerplate `properties: {}`; require ≥1 property.
  if (isPlainObject(n.properties) && Object.keys(n.properties).length > 0) {
    const props = n.properties as Record<string, unknown>;
    const rendered: Record<string, unknown> = {};
    for (const k of Object.keys(props).sort())
      rendered[k] = renderNode(props[k], registry, depth + 1);
    // Dedupe: an OCF composed schema can list a field in `required` more than once
    // (an allOf base and the local schema both name it); draft-07 forbids duplicate
    // `required` entries. Strict never hit this — the rich profile renders composite
    // types (e.g. StockClass.conversion_rights) strict left `out`.
    const required = Array.isArray(n.required)
      ? [...new Set(n.required.filter((r): r is string => typeof r === "string" && r in rendered))]
      : [];
    const node: Record<string, unknown> = { type: "object", additionalProperties: false };
    node.properties = rendered;
    if (required.length) node.required = required;
    return withUnion(n, copyAssertions(n, node), registry, depth);
  }

  if (typeof n.pattern === "string") {
    return withUnion(
      n,
      copyAssertions(n, {
        type: typeof n.type === "string" ? n.type : "string",
        pattern: n.pattern,
      }),
      registry,
      depth
    );
  }
  if (n.format === "date")
    return withUnion(
      n,
      copyAssertions(n, { type: "string", pattern: DATE_PATTERN }),
      registry,
      depth
    );
  if (n.format === "date-time")
    return withUnion(
      n,
      copyAssertions(n, { type: "string", format: "date-time" }),
      registry,
      depth
    );

  // A union branch such as `{ required: ["schedule"] }` is a valid schema
  // without a type. Do not invent `type: string` for assertion-only nodes.
  if (typeof n.type !== "string") return withUnion(n, copyAssertions(n, {}), registry, depth);
  return withUnion(n, copyAssertions(n, { type: n.type }), registry, depth);
}

/** Attach a non-null union after rendering the node's own object/array shape. */
function withUnion(
  source: Record<string, unknown>,
  node: Record<string, unknown>,
  registry: Registry,
  depth: number
): Record<string, unknown> {
  for (const keyword of ["oneOf", "anyOf"] as const) {
    if (Array.isArray(source[keyword])) {
      node[keyword] = source[keyword].map((branch: unknown) =>
        renderNode(branch, registry, depth + 1)
      );
      break;
    }
  }
  return node;
}

/**
 * Preserve draft-07 assertion keywords that constrain the source value domain.
 * Structural keywords (`properties`, `items`, and unions) are rendered by
 * renderNode itself so no source `$ref` can leak into the emitted package.
 */
function copyAssertions(
  source: Record<string, unknown>,
  node: Record<string, unknown>
): Record<string, unknown> {
  const keys = [
    "minItems",
    "maxItems",
    "uniqueItems",
    "minLength",
    "maxLength",
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
    "minProperties",
    "maxProperties",
  ] as const;
  for (const key of keys) {
    if (source[key] !== undefined) node[key] = source[key];
  }
  if (Array.isArray(source.required) && source.required.length > 0) {
    node.required = [...new Set(source.required.filter((x): x is string => typeof x === "string"))];
  }
  return node;
}

export interface CoreField {
  field: string;
  srcRaw: unknown;
  description?: string;
}

/** One OCF entity admitted to Core (variants already collapsed). */
export interface CoreEntity {
  entity: string;
  kind: "object" | "event";
  fields: CoreField[];
}

/** Build the inlined `type: object` def for one Core entity. */
function entityDef(e: CoreEntity, registry: Registry): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  for (const f of [...e.fields].sort((a, b) => a.field.localeCompare(b.field))) {
    const node = renderNode(f.srcRaw, registry);
    if (f.description) node.description = f.description;
    properties[f.field] = node;
  }
  const identity = ["object_type", "id"];
  const missing = identity.filter((field) => properties[field] === undefined);
  if (missing.length > 0) {
    throw new Error(`${e.entity} is missing required OCF identity field(s): ${missing.join(", ")}`);
  }
  return {
    type: "object",
    title: e.entity,
    properties,
    // OCF identity is required for referential closure and union discrimination;
    // the Carta fold-driven economic required set remains empty (§3).
    required: identity,
    additionalProperties: false,
  };
}

function coreId(rel: string): string {
  return `${ID_BASE}/${rel}`;
}

function fileSchema(
  fileName: string,
  fileType: string,
  itemsSchema: Record<string, unknown>,
  description: string
): Record<string, unknown> {
  return {
    $schema: DRAFT7,
    $id: coreId(`files/${fileName}.schema.json`),
    title: `OCF Core — ${fileName}`,
    description,
    type: "object",
    properties: {
      file_type: { const: fileType },
      items: { type: "array", items: itemsSchema },
    },
    required: ["file_type", "items"],
    additionalProperties: false,
  };
}

/**
 * Emit the full Core package as relativePath → schema object. The caller writes
 * each under core/ (build) or compares against committed copies (check).
 */
export function emitCorePackage(
  entities: CoreEntity[],
  registry: Registry,
  packaging: OcfPackaging
): Map<string, Record<string, unknown>> {
  const out = new Map<string, Record<string, unknown>>();
  const sorted = [...entities].sort((a, b) => a.entity.localeCompare(b.entity));

  // Events → one TransactionsFile (items.oneOf), mirroring OCF.
  const events = sorted.filter((e) => e.kind === "event");
  if (events.length) {
    const oneOf = events.map((e) => entityDef(e, registry));
    out.set(
      `files/${packaging.transactions.fileName}.schema.json`,
      fileSchema(
        packaging.transactions.fileName,
        packaging.transactions.fileType,
        oneOf.length === 1 ? oneOf[0]! : { oneOf },
        "Generated. Core-admissible transaction events; values inlined into OCF grammar."
      )
    );
  }

  // Objects → one per-category file each (OCF holds one entity type per file).
  // Issuer has no OCF file — it rides inline on the manifest.
  const issuer = sorted.find((e) => e.kind === "object" && e.entity === "Issuer");
  const collections: { key: string; fileName: string }[] = [];
  for (const e of sorted) {
    if (e.kind !== "object" || e.entity === "Issuer") continue;
    const cat = packaging.objectFiles.get(e.entity);
    if (!cat) continue; // object with no OCF file category — skip (surfaced elsewhere)
    out.set(
      `files/${cat.fileName}.schema.json`,
      fileSchema(
        cat.fileName,
        cat.fileType,
        entityDef(e, registry),
        `Generated. Core-admissible ${e.entity}; values inlined into OCF grammar.`
      )
    );
    collections.push({ key: cat.collectionKey, fileName: cat.fileName });
  }
  if (events.length) {
    collections.push({
      key: packaging.transactions.collectionKey,
      fileName: packaging.transactions.fileName,
    });
  }
  collections.sort((a, b) => a.key.localeCompare(b.key));

  // Manifest — issuer inline + a `*_files` pointer collection per present category.
  const filePointer = renderNode({ $ref: packaging.filePointerId }, registry);
  const manifestProps: Record<string, unknown> = {
    file_type: { const: "OCF_MANIFEST_FILE" },
    ocf_version: { type: "string" },
    as_of: { type: "string", pattern: DATE_PATTERN },
    generated_at: { type: "string", format: "date-time" },
    comments: { type: "array", items: { type: "string" } },
  };
  if (issuer) manifestProps.issuer = entityDef(issuer, registry);
  for (const c of collections) {
    manifestProps[c.key] = { type: "array", items: filePointer };
  }
  out.set("OCFCoreManifestFile.schema.json", {
    $schema: DRAFT7,
    $id: coreId("OCFCoreManifestFile.schema.json"),
    title: "OCF Core Manifest File",
    description:
      "GENERATED by scripts/derive-core-build — do not hand-edit. A Core cap-table " +
      "package: issuer + references to the Core object/transaction files. Mirrors " +
      "OCFManifestFile (reuses OCF file_type consts) so a Core package is shape-valid OCF.",
    type: "object",
    properties: manifestProps,
    required: ["file_type", ...collections.map((c) => c.key)],
    additionalProperties: false,
  });

  return out;
}
