import jsonpointer from "jsonpointer";
import { detectEnumValues } from "./enum-detection.js";
import { RawSchema, Registry } from "./registry.js";

export interface PointerResult {
  found: boolean;
  value?: unknown;
}

/**
 * Resolve a "#/a/b" JSON pointer (RFC 6901, with the leading "#" fragment
 * marker) against a parsed JSON document. Purely structural — does not
 * follow $ref. Delegates to the `jsonpointer` package; `undefined` is a
 * reliable not-found sentinel because JSON.parse output cannot contain
 * undefined values.
 */
export function resolveJsonPointer(doc: unknown, pointer: string): PointerResult {
  if (pointer === "#") return { found: true, value: doc };
  if (!pointer.startsWith("#/")) return { found: false };
  if (typeof doc !== "object" || doc === null) return { found: false };
  let value: unknown;
  try {
    value = jsonpointer.get(doc, pointer.slice(1));
  } catch {
    return { found: false };
  }
  if (value === undefined) return { found: false };
  return { found: true, value };
}

/** Follow $ref chains within the bundle, bounded against cycles. */
export function derefNode(bundle: unknown, node: unknown, depth = 0): unknown {
  if (depth > 10) return node;
  if (isPlainObject(node) && typeof node.$ref === "string") {
    const res = resolveJsonPointer(bundle, node.$ref);
    if (!res.found || res.value === node) return node;
    return derefNode(bundle, res.value, depth + 1);
  }
  return node;
}

/**
 * If the (dereferenced) node is an enum schema — directly or via array items —
 * return its values as strings; else null.
 */
export function targetEnumValuesAt(bundle: unknown, node: unknown, depth = 0): string[] | null {
  if (depth > 10) return null;
  const n = derefNode(bundle, node);
  if (!isPlainObject(n)) return null;
  if (Array.isArray(n.enum)) return n.enum.map((v) => String(v));
  if (n.type === "array" && n.items !== undefined) {
    return targetEnumValuesAt(bundle, n.items, depth + 1);
  }
  return null;
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * The step ids declared by a `composite:` block, in order. A composite mapping
 * folds ONE OCF transaction into an ordered list of Carta transactions ("steps"),
 * ALL emitted — unlike variants, which are mutually exclusive. Empty when the
 * mapping has no composite block. See docs/polymorphic-transaction-routing.md §4.9.
 */
export function compositeStepIds(mapping: Record<string, unknown>): string[] {
  if (!Array.isArray(mapping.composite)) return [];
  const ids: string[] = [];
  for (const s of mapping.composite) {
    if (isPlainObject(s) && typeof s.step === "string") ids.push(s.step);
  }
  return ids;
}

/**
 * True iff a target MAP is keyed by composite step ids (rather than variant
 * labels). Step ids and variant labels are disjoint sets, so key membership
 * disambiguates a per-step map `{ cancel, issue }` from a per-variant map
 * `{ Rsa, Default }` without any extra syntax.
 */
export function isStepKeyedTarget(map: Record<string, unknown>, stepIds: string[]): boolean {
  const keys = Object.keys(map);
  return stepIds.length > 0 && keys.length > 0 && keys.every((k) => stepIds.includes(k));
}

/**
 * Reduce a per-step target map to the single per-family landing pointer: the last
 * non-null target in declared step order (the issue step's slot wins over the
 * cancel step's — the payload conceptually lands on the resulting security), or
 * null when the field lands on no step for this family. A step's value may be a
 * scalar pointer (family-agnostic) or a per-family `{ label: pointer|null }` map.
 * The Core classifier only needs "does it land"; the full per-step maps are kept
 * verbatim in the mapping (and harvested for the coverage report).
 */
export function reduceStepTarget(
  map: Record<string, unknown>,
  family: string,
  stepIds: string[]
): string | null {
  let chosen: string | null = null;
  for (const step of stepIds) {
    if (!(step in map)) continue;
    const sv = map[step];
    if (sv === null || sv === undefined) continue;
    const fam =
      typeof sv === "string"
        ? sv
        : isPlainObject(sv) && typeof sv[family] === "string"
        ? (sv[family] as string)
        : null;
    if (typeof fam === "string") chosen = fam;
  }
  return chosen;
}

/**
 * ALL per-family landing pointers of a step-keyed target map, in declared step
 * order (deduped). Where {@link reduceStepTarget} keeps the single issue-step
 * landing (for validation's scalar shape check), this keeps EVERY step a composite
 * field lands on — so the Core projection and the flow diagrams show the whole fold
 * (e.g. `quantity` landing on both the cancel AND the issue transaction), not just
 * one. Classified as a `rename` onto multiple slots (same source, replicated).
 */
export function collectStepTargets(
  map: Record<string, unknown>,
  family: string,
  stepIds: string[]
): string[] {
  const out: string[] = [];
  for (const step of stepIds) {
    if (!(step in map)) continue;
    const sv = map[step];
    if (sv === null || sv === undefined) continue;
    const fam =
      typeof sv === "string"
        ? sv
        : isPlainObject(sv) && typeof sv[family] === "string"
        ? (sv[family] as string)
        : null;
    if (typeof fam === "string" && !out.includes(fam)) out.push(fam);
  }
  return out;
}

export const KIND_VOCABULARY = [
  "rename",
  "select",
  "split",
  "combine",
  "enum-remap",
  "computed",
  "unmappable",
  "TODO",
] as const;

export const STATUS_VOCABULARY = ["draft", "partial", "complete", "reviewed"] as const;

export const REASON_VOCABULARY = [
  "no-equivalent",
  "excluded-from-snapshot",
  "out-of-scope",
  "ocf-internal",
] as const;

/** Frontmatter keys required of every mapping, regardless of dialect. */
export const SHARED_FRONTMATTER_KEYS = [
  "required_fields",
  "target_standard",
  "target_version",
  "status",
  "last_generated",
] as const;

/** Source-side keys an OCF mapping declares (identified by ocf_schema_id). */
export const OCF_FRONTMATTER_KEYS = [
  "ocf_schema_id",
  "ocf_object_type",
  "ocf_title",
  "ocf_kind",
] as const;

/** Source-side keys a canonical mapping declares (identified by canonical_schema_id). */
export const CANONICAL_FRONTMATTER_KEYS = [
  "canonical_schema_id",
  "canonical_title",
  "canonical_kind",
] as const;

/** target_standard frontmatter value → repo-relative bundle path. */
export const TARGET_BUNDLES: Record<string, string> = {
  Carta: "target-schema/Carta.schema.json",
};

export interface ValidationError {
  file: string;
  /** Property name within fields:, or null for file-level errors. */
  field: string | null;
  message: string;
}

export interface ValidateInput {
  /** Repo-relative path of the .mapping.md, used in error reports. */
  file: string;
  frontmatter: Record<string, unknown>;
  mapping: Record<string, unknown>;
  /** The sibling composed .schema.json, parsed. */
  sourceSchema: RawSchema;
  /** OCF schema registry, for source-side enum detection. */
  registry: Registry;
  /** Parsed target bundle, or null when target_standard is TBD. */
  targetBundle: unknown | null;
}

export interface ValidateOptions {
  /**
   * When true, unmappable entries in complete/reviewed mappings must carry a
   * reason:. Ships false (PR-1) and flips to true once existing complete
   * mappings carry reasons (PR-2).
   */
  requireUnmappableReason: boolean;
}

export function validateMapping(input: ValidateInput, opts: ValidateOptions): ValidationError[] {
  const errors: ValidationError[] = [];
  const err = (field: string | null, message: string) =>
    errors.push({ file: input.file, field, message });

  // A mapping declares its source dialect by which identity key it carries:
  // canonical_schema_id (canonical layer) or ocf_schema_id (OCF objects/types).
  // Validate by what the file declares, not where it lives.
  for (const key of SHARED_FRONTMATTER_KEYS) {
    if (!(key in input.frontmatter)) err(null, `frontmatter is missing required key "${key}"`);
  }
  if ("canonical_schema_id" in input.frontmatter) {
    for (const key of CANONICAL_FRONTMATTER_KEYS) {
      if (!(key in input.frontmatter)) err(null, `frontmatter is missing required key "${key}"`);
    }
  } else if ("ocf_schema_id" in input.frontmatter) {
    for (const key of OCF_FRONTMATTER_KEYS) {
      if (!(key in input.frontmatter)) err(null, `frontmatter is missing required key "${key}"`);
    }
  } else {
    err(
      null,
      'frontmatter must declare a source schema: "ocf_schema_id" (OCF) or "canonical_schema_id" (canonical)'
    );
  }

  const fmStatus = input.frontmatter.status;
  if (fmStatus !== undefined && !isStatus(fmStatus)) {
    err(
      null,
      `frontmatter status "${String(fmStatus)}" is not one of ${STATUS_VOCABULARY.join(" | ")}`
    );
  }
  const blockStatus = input.mapping.status;
  if (!isStatus(blockStatus)) {
    err(
      null,
      `mapping block status "${String(blockStatus)}" is not one of ${STATUS_VOCABULARY.join(" | ")}`
    );
  } else if (isStatus(fmStatus) && fmStatus !== blockStatus) {
    err(
      null,
      `frontmatter status "${fmStatus}" does not match mapping block status "${blockStatus}"`
    );
  }
  const strict = blockStatus === "complete" || blockStatus === "reviewed";

  // Polymorphic dispatch: a `discriminator:` block (issuance-time routing) or a
  // `route_by_security:` block (downstream join routing) selects the per-instrument
  // Carta family. With neither, this is a plain single-target mapping and the legacy
  // path below runs unchanged (full backward compatibility).
  if (
    isPlainObject(input.mapping.discriminator) ||
    isPlainObject(input.mapping.route_by_security)
  ) {
    validatePolymorphicMapping(input, strict, opts, err);
    return errors;
  }

  // composite: (a transaction folding into an ordered set of Carta steps) is only
  // meaningful alongside a route_by_security/discriminator + variants block, which
  // supplies the family axis its per-step target maps key into. A bare composite
  // (no variants) is not yet supported — flag it rather than silently ignore it.
  if (Array.isArray(input.mapping.composite)) {
    err(
      null,
      "composite: is only supported alongside a route_by_security or discriminator + variants block"
    );
  }

  // fields: with no entries parses as null (property-less schemas) — treat as {}.
  const rawFields = input.mapping.fields ?? {};
  if (!isPlainObject(rawFields)) {
    err(null, `mapping block "fields" must be a map, got ${JSON.stringify(rawFields)}`);
    return errors;
  }
  const fields = rawFields;

  const properties = (input.sourceSchema.properties ?? {}) as Record<string, unknown>;

  // Coverage is derived for reports and never read from the mapping YAML.
  // Keeping it out of validation removes a duplicated, stale-prone input.
  validateFieldMap(fields, properties, strict, opts, input, err);

  return errors;
}

function isStatus(v: unknown): v is typeof STATUS_VOCABULARY[number] {
  return typeof v === "string" && (STATUS_VOCABULARY as readonly string[]).includes(v);
}

type ErrFn = (field: string | null, message: string) => void;

/**
 * Validate one field map — the `fields:` of a simple mapping, or a variant's
 * effective `shared:` ∪ `fields:` map. Reports key and entry errors via `err`.
 */
function validateFieldMap(
  fields: Record<string, unknown>,
  properties: Record<string, unknown>,
  strict: boolean,
  opts: ValidateOptions,
  input: ValidateInput,
  err: ErrFn
): void {
  const propertyNames = Object.keys(properties);
  for (const name of Object.keys(fields)) {
    if (!(name in properties)) err(name, "is not a property of the source schema");
  }
  if (strict) {
    for (const name of propertyNames) {
      if (!(name in fields)) {
        err(name, "missing from fields: — complete/reviewed mappings must cover every property");
      }
    }
  }

  for (const [name, rawEntry] of Object.entries(fields)) {
    if (!isPlainObject(rawEntry)) {
      err(name, "entry must be a map with at least kind: and target:");
      continue;
    }
    const entry = rawEntry;
    const kind = entry.kind;
    if (typeof kind !== "string" || !(KIND_VOCABULARY as readonly string[]).includes(kind)) {
      err(name, `kind "${String(kind)}" is not one of ${KIND_VOCABULARY.join(" | ")}`);
      continue;
    }
    validateEntryShape(entry, name, kind, strict, opts, err);
    validateTransformSemantics(
      entry,
      name,
      kind,
      properties[name],
      input.registry,
      input.targetBundle,
      err
    );
    const sourceEnumValues = detectEnumValues(properties[name], input.registry);
    validateValuesBlock(entry, name, kind, strict, sourceEnumValues, err);
    if (input.targetBundle !== null) {
      validateEntryTargets(entry, name, kind, strict, sourceEnumValues, input.targetBundle, err);
    }
  }
}

/** Resolve an OCF source node through the local registry, including nullable unions. */
function resolveSourceNode(node: unknown, registry: Registry, depth = 0): unknown {
  if (depth > 10 || !isPlainObject(node)) return node;
  if (typeof node.$ref === "string") {
    const resolved = registry.get(node.$ref);
    if (resolved && resolved !== node) return resolveSourceNode(resolved, registry, depth + 1);
  }
  const union = node.oneOf ?? node.anyOf;
  if (Array.isArray(union)) {
    const real = union.filter((branch) => isPlainObject(branch) && branch.type !== "null");
    if (real.length === 1) return resolveSourceNode(real[0], registry, depth + 1);
  }
  return node;
}

function schemaProperties(node: unknown): Record<string, unknown> | null {
  if (!isPlainObject(node) || !isPlainObject(node.properties)) return null;
  const props = node.properties as Record<string, unknown>;
  return Object.keys(props).length > 0 ? props : null;
}

function isArraySchema(node: unknown): boolean {
  return isPlainObject(node) && node.type === "array";
}

function isMultiPropertySchema(node: unknown): boolean {
  const props = schemaProperties(node);
  return props !== null && Object.keys(props).length >= 2;
}

function targetPointerNodes(target: unknown, bundle: unknown): unknown[] {
  if (bundle === null) return [];
  const pointers = Array.isArray(target)
    ? target.filter((p): p is string => typeof p === "string")
    : typeof target === "string" && target !== "TODO"
    ? [target]
    : [];
  return pointers.flatMap((ptr) => {
    const resolved = resolveJsonPointer(bundle, ptr);
    return resolved.found ? [derefNode(bundle, resolved.value)] : [];
  });
}

/**
 * Keep the declarative DSL honest about whether an entry is executable. `rename` is a
 * lossless 1:1 copy; reductions must name their policy explicitly so a consumer cannot
 * mistake a prose note for an executable transform.
 */
function validateTransformSemantics(
  entry: Record<string, unknown>,
  name: string,
  kind: string,
  sourceRaw: unknown,
  registry: Registry,
  bundle: unknown | null,
  err: ErrFn
): void {
  const policy = entry.policy;
  if (kind === "select") {
    if (typeof entry.target !== "string") return;
    if (typeof policy !== "string" || policy.trim() === "") {
      err(name, "kind select requires a non-empty policy: naming the deterministic reduction");
    }
    if (
      entry.source !== undefined &&
      (typeof entry.source !== "string" || !entry.source.startsWith("/"))
    ) {
      err(name, "select source: must be a relative JSON pointer beginning with '/'");
    }
    return;
  }

  if (kind !== "rename" && kind !== "split" && kind !== "enum-remap") return;
  const source = resolveSourceNode(sourceRaw, registry);
  const targets = targetPointerNodes(entry.target, bundle);
  if (targets.length === 0) return;

  const sourceArray = isArraySchema(source);
  const targetArrays = targets.map(isArraySchema);
  if (kind === "rename") {
    if (sourceArray && targetArrays.some((isArray) => !isArray)) {
      err(name, "kind rename cannot reduce array to scalar; use kind select with policy:");
    }
    if (isMultiPropertySchema(source) && targets.some((target) => !isMultiPropertySchema(target))) {
      err(
        name,
        "kind rename cannot reduce a structured object to scalar; use kind select with policy:"
      );
    }
  } else if (
    (kind === "split" || kind === "enum-remap") &&
    sourceArray &&
    targetArrays.some((isArray) => !isArray)
  ) {
    if (typeof policy !== "string" || policy.trim() === "") {
      err(name, `array-to-scalar ${kind} requires policy: naming the deterministic reduction`);
    }
  }
}

/**
 * Validate a polymorphic mapping: a `discriminator:` (issuance-time routing) or
 * `route_by_security:` (downstream join routing) block plus a `variants:` map
 * whose `when:` value sets partition the routed enum. Each variant carries its
 * own `primary_targets:` (the Carta family roots) and a `shared:`-merged field
 * map, validated per variant. Derived coverage is reported separately. The routed
 * enum is the discriminator property's enum (issuance) or `resolve_enum`
 * (downstream); `exhaustive` requires every enum value to be claimed by a
 * variant (mappable or explicitly unroutable).
 */
function validatePolymorphicMapping(
  input: ValidateInput,
  strict: boolean,
  opts: ValidateOptions,
  err: ErrFn
): void {
  const mapping = input.mapping;
  const properties = (input.sourceSchema.properties ?? {}) as Record<string, unknown>;
  const propertyNames = Object.keys(properties);

  // 1. Resolve the routed enum — the value set the variants must partition.
  let enumValues: string[] | null = null;
  let exhaustive = false;
  let enumDeclared = false;
  if (isPlainObject(mapping.discriminator)) {
    const disc = mapping.discriminator;
    exhaustive = disc.exhaustive === true;
    const field = disc.field;
    if (typeof field !== "string" || !(field in properties)) {
      err(null, `discriminator.field "${String(field)}" is not a property of the source schema`);
    } else {
      enumDeclared = true;
      enumValues = detectEnumValues(properties[field], input.registry);
      if (enumValues === null) {
        err(
          null,
          `discriminator.field "${field}" is not enum-typed; a discriminator must route on an enum`
        );
      }
    }
  } else if (isPlainObject(mapping.route_by_security)) {
    const rbs = mapping.route_by_security;
    exhaustive = rbs.exhaustive === true;
    if (typeof rbs.via !== "string" || !(rbs.via in properties)) {
      err(
        null,
        `route_by_security.via "${String(rbs.via)}" is not a property of the source schema`
      );
    }
    if (typeof rbs.resolve !== "string" || rbs.resolve.length === 0) {
      err(
        null,
        'route_by_security requires a non-empty "resolve" (the discriminator field on the joined issuance)'
      );
    }
    if (typeof rbs.source_mapping !== "string" || rbs.source_mapping.length === 0) {
      err(
        null,
        'route_by_security requires a non-empty "source_mapping" (the issuance mapping it joins to)'
      );
    }
    if (typeof rbs.resolve_enum === "string") {
      enumDeclared = true;
      enumValues = detectEnumValues({ $ref: rbs.resolve_enum }, input.registry);
      if (enumValues === null) {
        err(
          null,
          `route_by_security.resolve_enum "${rbs.resolve_enum}" did not resolve to an enum in the registry`
        );
      }
    }
  }

  // 2. variants: + shared:
  const rawVariants = mapping.variants;
  if (!isPlainObject(rawVariants) || Object.keys(rawVariants).length === 0) {
    err(null, 'a polymorphic mapping requires a non-empty "variants" map');
    return;
  }
  const variants = rawVariants;
  const rawShared = mapping.shared ?? {};
  if (!isPlainObject(rawShared)) {
    err(null, '"shared" must be a map of field → entry');
    return;
  }
  const shared = rawShared as Record<string, unknown>;

  // Per-variant target maps: a shared field whose Carta home differs by variant
  // carries `target: { <variantLabel>: pointer|null }`. Validate the maps (keys in
  // sync with the variant set; values resolve) once, and keep the projected
  // scalar-target entry to splice into each variant's effective field map below.
  // `simpleShared` is every other (uniform-target) shared field.
  const variantLabels = Object.keys(variants);
  // composite: an ordered set of Carta transactions this OCF transaction folds
  // into (all emitted). Orthogonal to the family axis — its per-step field target
  // maps key into the step ids, and each step's target/const may diverge by family.
  const stepIds =
    "composite" in mapping
      ? validateCompositeBlock(mapping.composite, variantLabels, input.targetBundle, err)
      : [];
  const { mapped: mappedShared, projected: projectedShared } = validateSharedTargetMaps(
    shared,
    variantLabels,
    stepIds,
    input.targetBundle,
    err
  );
  const simpleShared: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(shared)) if (!mappedShared.has(k)) simpleShared[k] = v;

  // 3. Partition the routed enum across variants' `when:` sets.
  const claimedBy: Record<string, string[]> = {};
  for (const [label, rawV] of Object.entries(variants)) {
    if (!isPlainObject(rawV)) {
      err(null, `variant "${label}" must be a map`);
      continue;
    }
    const when = rawV.when;
    if (!Array.isArray(when) || when.length === 0 || !when.every((w) => typeof w === "string")) {
      err(null, `variant "${label}" requires a non-empty "when" array of discriminator values`);
      continue;
    }
    for (const w of when as string[]) (claimedBy[w] ??= []).push(label);
  }
  for (const [val, labels] of Object.entries(claimedBy)) {
    if (labels.length > 1) {
      err(
        null,
        `discriminator value "${val}" is claimed by more than one variant (${labels.join(", ")})`
      );
    }
  }
  if (enumValues !== null) {
    const enumSet = new Set(enumValues);
    for (const val of Object.keys(claimedBy)) {
      if (!enumSet.has(val))
        err(null, `variant "when" value "${val}" is not a value of the routed enum`);
    }
    if (exhaustive) {
      for (const val of enumValues) {
        if (!(val in claimedBy)) {
          err(
            null,
            `enum value "${val}" is not claimed by any variant (exhaustive routing requires every value handled or explicitly marked unroutable)`
          );
        }
      }
    }
  } else if (exhaustive && !enumDeclared) {
    err(
      null,
      "exhaustive routing requires a resolvable enum (discriminator.field or route_by_security.resolve_enum)"
    );
  }

  // 4. Per-variant: primary_targets resolve; shared∪fields validates.
  for (const [label, rawV] of Object.entries(variants)) {
    if (!isPlainObject(rawV)) continue;
    const v = rawV;

    const pts = v.primary_targets;
    if (pts !== null && pts !== undefined) {
      if (!Array.isArray(pts) || !pts.every((p) => typeof p === "string")) {
        err(
          null,
          `variant "${label}" primary_targets must be an array of "#/..." pointers or null`
        );
      } else if (input.targetBundle !== null) {
        for (const ptr of pts as string[]) {
          if (!ptr.startsWith("#/")) {
            err(null, `variant "${label}" primary_target "${ptr}" must be a "#/..." JSON pointer`);
            continue;
          }
          const res = resolveJsonPointer(input.targetBundle, ptr);
          if (!res.found) {
            err(
              null,
              `variant "${label}" primary_target "${ptr}" does not resolve in the target bundle`
            );
            continue;
          }
          if (derefNode(input.targetBundle, res.value) === true) {
            err(
              null,
              `variant "${label}" primary_target "${ptr}" resolves to \`true\` (excluded from the bundle snapshot)`
            );
          }
        }
      }
    }

    const rawVFields = v.fields ?? {};
    if (!isPlainObject(rawVFields)) {
      err(null, `variant "${label}" fields must be a map`);
      continue;
    }
    const vFields: Record<string, unknown> = {};
    for (const [k, fe] of Object.entries(rawVFields as Record<string, unknown>)) {
      if (k in shared) {
        err(
          null,
          `variant "${label}" field "${k}" also appears in shared: (a field is either shared or variant-specific)`
        );
      }
      // A per-variant target map expresses "shared field, divergent home"; inside
      // a variant (already variant-specific) it is meaningless — flag and neutralize.
      if (isPlainObject(fe) && isPlainObject(fe.target)) {
        err(`${label}.${k}`, "a per-variant target map is only valid on shared: entries");
        vFields[k] = unmappableProjection();
      } else {
        vFields[k] = fe;
      }
    }
    const effective: Record<string, unknown> = {
      ...simpleShared,
      ...(projectedShared[label] ?? {}),
      ...vFields,
    };
    const variantErr: ErrFn = (field, message) => err(field ? `${label}.${field}` : null, message);
    validateFieldMap(effective, properties, strict, opts, input, variantErr);

    // Verify routed_to edges on this variant's fields: each maps a routed enum
    // value to a variant that actually claims it (a real, deterministic route).
    for (const [fieldName, fEntry] of Object.entries(rawVFields)) {
      if (!isPlainObject(fEntry) || !isPlainObject(fEntry.routed_to)) continue;
      for (const [val, vlabel] of Object.entries(fEntry.routed_to)) {
        const where = `${label}.${fieldName}`;
        if (enumValues !== null && !enumValues.includes(val)) {
          err(null, `${where} routed_to key "${val}" is not a value of the routed enum`);
        }
        if (typeof vlabel !== "string" || !(vlabel in variants)) {
          err(null, `${where} routed_to "${String(vlabel)}" names no such variant`);
          continue;
        }
        if (!(claimedBy[val] ?? []).includes(vlabel)) {
          err(
            null,
            `${where} routed_to says "${val}" → ${vlabel}, but the ${vlabel} variant does not claim "${val}"`
          );
        }
      }
    }
  }
}

/**
 * A per-variant `null`/absent target: the field has no Carta home in this
 * variant. Projected to an `unmappable` so derived coverage counts it (non-TODO) and the
 * per-field validator does not re-flag it. The reason is implicit — the target
 * object is simply absent from this variant's family — so it carries a blanket
 * `no-equivalent`, which never surfaces (the report renders it from the map).
 */
function unmappableProjection(): Record<string, unknown> {
  return { kind: "unmappable", target: null, reason: "no-equivalent" };
}

/** Kinds whose `target:` is a single pointer and so may diverge per variant. */
const PER_VARIANT_TARGET_KINDS = new Set(["rename", "computed", "combine"]);

/**
 * A per-variant/per-step target value: null (= unmappable here) or a "#/..."
 * pointer that resolves in the bundle and is not Carta's `true` no-home marker.
 * `ctx` labels the value in error messages (e.g. `target for variant "Rsa"`).
 */
function pointerResolves(
  val: unknown,
  bundle: unknown | null,
  field: string | null,
  ctx: string,
  err: ErrFn
): boolean {
  if (typeof val !== "string" || !val.startsWith("#/")) {
    err(field, `${ctx} must be a "#/..." pointer or null`);
    return false;
  }
  if (bundle !== null) {
    const res = resolveJsonPointer(bundle, val);
    if (!res.found) {
      err(field, `${ctx} "${val}" does not resolve in the target bundle`);
      return false;
    }
    if (derefNode(bundle, res.value) === true) {
      err(field, `${ctx} "${val}" resolves to \`true\` (excluded from the bundle snapshot)`);
      return false;
    }
  }
  return true;
}

/**
 * Validate the optional `composite:` block — an ordered list of Carta transaction
 * steps a single OCF transaction folds into (all emitted, unlike variants which
 * are mutually exclusive). Returns the ordered step ids (used to key and validate
 * per-step field target maps). Each step:
 *   - step:   a unique non-empty id;
 *   - target: the Carta $def the step lands on — a "#/..." pointer, or a per-family
 *             { label: pointer|null } map when the $def diverges by family;
 *   - const:  (optional) fixed field values the step always carries (the Carta
 *             reason enums), as { field: value } — applied to every family — or
 *             per-family { label: { field: value } }. Each field must resolve on
 *             the step's $def and, if enum-typed, `value` must be a member.
 */
function validateCompositeBlock(
  composite: unknown,
  variantLabels: string[],
  bundle: unknown | null,
  err: ErrFn
): string[] {
  if (!Array.isArray(composite)) {
    err(null, "composite: must be an ordered list of { step, target } steps");
    return [];
  }
  if (composite.length === 0) {
    err(null, "composite: must declare at least one step");
    return [];
  }
  const stepIds: string[] = [];
  composite.forEach((raw, i) => {
    if (!isPlainObject(raw)) {
      err(null, `composite[${i}] must be a map with a step: and target:`);
      return;
    }
    const step = raw.step;
    if (typeof step !== "string" || step.length === 0) {
      err(null, `composite[${i}] requires a non-empty string "step"`);
      return;
    }
    if (stepIds.includes(step)) err(null, `composite step id "${step}" is declared more than once`);
    stepIds.push(step);

    // target: a scalar $def pointer (family-agnostic) or a per-family map. Record
    // the resolved $def per family so const: can be resolved against it.
    const target = raw.target;
    const familyDef: Record<string, string | null> = {};
    if (typeof target === "string") {
      const ok = pointerResolves(target, bundle, null, `composite step "${step}" target`, err);
      for (const label of variantLabels) familyDef[label] = ok ? target : null;
    } else if (isPlainObject(target)) {
      for (const key of Object.keys(target)) {
        if (!variantLabels.includes(key)) {
          err(
            null,
            `composite step "${step}" target key "${key}" is not a variant (have: ${variantLabels.join(
              ", "
            )})`
          );
        }
      }
      for (const label of variantLabels) {
        const v = label in target ? target[label] : null;
        familyDef[label] =
          v === null
            ? null
            : pointerResolves(
                v,
                bundle,
                null,
                `composite step "${step}" target for variant "${label}"`,
                err
              )
            ? (v as string)
            : null;
      }
    } else {
      err(null, `composite step "${step}" requires a target ("#/..." pointer or a per-family map)`);
    }

    if (raw.const !== undefined) {
      validateConstFills(
        `composite step "${step}"`,
        raw.const,
        variantLabels,
        familyDef,
        bundle,
        err
      );
    }
  });
  return stepIds;
}

/**
 * Validate a `const:` block's fixed values against a per-family target `$def`. Used
 * for composite STEP const (reason codes on the cancel/issue transactions) and for
 * FIELD const (the precededBy reason on the lineage objects). `where` labels the
 * source in errors (e.g. `composite step "cancel"` / `field "resulting_security_ids"`);
 * `familyDef` maps each family to the `#/$defs/<Root>` the const's props sit on.
 */
function validateConstFills(
  where: string,
  constVal: unknown,
  variantLabels: string[],
  familyDef: Record<string, string | null>,
  bundle: unknown | null,
  err: ErrFn
): void {
  if (!isPlainObject(constVal)) {
    err(null, `${where} const: must be a map of field → value`);
    return;
  }
  // Per-family { label: { field: value } } when any key is a variant label;
  // otherwise a flat { field: value } that applies to every family.
  const perFamily = variantLabels.some((l) => l in constVal);
  const byFamily: Record<string, unknown> = perFamily
    ? constVal
    : Object.fromEntries(variantLabels.map((l) => [l, constVal]));
  for (const [label, consts] of Object.entries(byFamily)) {
    if (!variantLabels.includes(label)) {
      err(null, `${where} const key "${label}" is not a variant`);
      continue;
    }
    if (!isPlainObject(consts)) {
      err(null, `${where} const for variant "${label}" must be a map of field → value`);
      continue;
    }
    const def = familyDef[label];
    if (!def || bundle === null) continue;
    for (const [prop, value] of Object.entries(consts)) {
      const ptr = `${def}/properties/${prop}`;
      const res = resolveJsonPointer(bundle, ptr);
      if (!res.found) {
        err(null, `${where} const.${prop} has no property "${prop}" on ${def}`);
        continue;
      }
      const enumVals = targetEnumValuesAt(bundle, derefNode(bundle, res.value));
      if (enumVals !== null && (typeof value !== "string" || !enumVals.includes(value))) {
        err(
          null,
          `${where} const.${prop} = "${String(value)}" is not a member of the target enum at ${ptr}`
        );
      }
    }
  }
}

/**
 * Validate per-variant target maps on `shared:` entries. A shared field whose
 * Carta home differs by variant carries `target: { <variantLabel>: pointer|null }`
 * instead of a single pointer — so RSU/SAR fields name their own objects instead
 * of borrowing a representative family's. The map's keys must stay in sync with
 * the variant set (every variant present, none unknown); each value is a resolving
 * `#/...` pointer or `null` (= unmappable in that variant). Returns the set of
 * fields that used a map and, per variant, the projected scalar-target entry to
 * splice into that variant's effective field map.
 */
function validateSharedTargetMaps(
  shared: Record<string, unknown>,
  variantLabels: string[],
  stepIds: string[],
  bundle: unknown | null,
  err: ErrFn
): { mapped: Set<string>; projected: Record<string, Record<string, unknown>> } {
  const mapped = new Set<string>();
  const projected: Record<string, Record<string, unknown>> = {};
  for (const label of variantLabels) projected[label] = {};

  for (const [field, rawEntry] of Object.entries(shared)) {
    if (!isPlainObject(rawEntry) || !isPlainObject(rawEntry.target)) continue;
    mapped.add(field);
    const entry = rawEntry;
    const map = entry.target as Record<string, unknown>;
    const kind = typeof entry.kind === "string" ? entry.kind : String(entry.kind);

    if (!PER_VARIANT_TARGET_KINDS.has(kind)) {
      err(
        field,
        `a per-variant target map is not supported for kind ${kind} ` +
          "(only rename/computed/combine; route enum values in variants.fields)"
      );
      for (const label of variantLabels) projected[label]![field] = unmappableProjection();
      continue;
    }

    // A per-STEP target map (composite): keys are step ids, each value a scalar
    // pointer (family-agnostic) or a per-family { label: pointer|null } map. Validate
    // each declared step, then project each family to its single landing pointer.
    if (isStepKeyedTarget(map, stepIds)) {
      for (const [stepKey, sv] of Object.entries(map)) {
        if (sv === null) continue;
        if (typeof sv === "string") {
          pointerResolves(sv, bundle, field, `step "${stepKey}" target`, err);
        } else if (isPlainObject(sv)) {
          for (const key of Object.keys(sv)) {
            if (!variantLabels.includes(key)) {
              err(
                field,
                `step "${stepKey}" target key "${key}" is not a variant (have: ${variantLabels.join(
                  ", "
                )})`
              );
            }
          }
          for (const label of variantLabels) {
            const v = label in sv ? sv[label] : null;
            if (v === null) continue;
            pointerResolves(
              v,
              bundle,
              field,
              `step "${stepKey}" target for variant "${label}"`,
              err
            );
          }
        } else {
          err(
            field,
            `step "${stepKey}" target must be null, a "#/..." pointer, or a per-family map`
          );
        }
      }
      for (const label of variantLabels) {
        const ptr = reduceStepTarget(map, label, stepIds);
        projected[label]![field] =
          ptr === null ? unmappableProjection() : { ...entry, target: ptr };
      }
      continue;
    }

    // Otherwise a per-VARIANT (family) target map. Keys must be exactly the variant
    // set: every variant present, none unknown.
    for (const key of Object.keys(map)) {
      if (!variantLabels.includes(key)) {
        err(field, `target map key "${key}" is not a variant (have: ${variantLabels.join(", ")})`);
      }
    }
    for (const label of variantLabels) {
      if (!(label in map)) err(field, `target map is missing variant "${label}"`);
    }

    // Each value: null (= unmappable here) or a resolving "#/..." pointer.
    for (const label of variantLabels) {
      const val = label in map ? map[label] : null;
      if (val === null) {
        projected[label]![field] = unmappableProjection();
        continue;
      }
      projected[label]![field] = pointerResolves(
        val,
        bundle,
        field,
        `target for variant "${label}"`,
        err
      )
        ? { ...entry, target: val }
        : unmappableProjection();
    }

    // Field-level `const:` — fixed values populated on sibling slots of this field's
    // target object (the precededBy `reason` on the lineage objects). Validated against
    // each family's target `$def` root.
    if (entry.const !== undefined) {
      const familyDef: Record<string, string | null> = {};
      for (const label of variantLabels) {
        const val = label in map ? map[label] : null;
        const m = typeof val === "string" ? /^(#\/\$defs\/[^/]+)/.exec(val) : null;
        familyDef[label] = m ? (m[1] as string) : null;
      }
      validateConstFills(`field "${field}"`, entry.const, variantLabels, familyDef, bundle, err);
    }
  }
  return { mapped, projected };
}

function validateEntryShape(
  entry: Record<string, unknown>,
  name: string,
  kind: string,
  strict: boolean,
  opts: ValidateOptions,
  err: ErrFn
): void {
  const target = entry.target;
  switch (kind) {
    case "rename":
    case "select":
    case "combine":
    case "enum-remap":
    case "computed":
      if (typeof target !== "string") err(name, `kind ${kind} requires a string target`);
      break;
    case "split":
      if (
        !Array.isArray(target) ||
        target.length < 2 ||
        !target.every((t) => typeof t === "string")
      ) {
        err(name, "kind split requires target to be an array of at least 2 strings");
      }
      break;
    case "unmappable":
      if (target !== null) err(name, "kind unmappable requires target: null");
      break;
    case "TODO":
      if (strict) err(name, "kind TODO is not allowed when status is complete/reviewed");
      if (target !== "TODO") err(name, "kind TODO requires target: TODO");
      break;
  }

  const reason = entry.reason;
  if (reason !== undefined) {
    if (kind !== "unmappable") {
      err(name, "reason: is only valid on unmappable entries");
    } else if (
      typeof reason !== "string" ||
      !(REASON_VOCABULARY as readonly string[]).includes(reason)
    ) {
      err(name, `reason "${String(reason)}" is not one of ${REASON_VOCABULARY.join(" | ")}`);
    }
  } else if (kind === "unmappable" && strict && opts.requireUnmappableReason) {
    err(
      name,
      `unmappable entries in complete/reviewed mappings require a reason: (${REASON_VOCABULARY.join(
        " | "
      )})`
    );
  }

  // Optional free-text annotation (valid on any kind) — used to record corner
  // cases, e.g. that a discriminator value dropped in this variant has a real
  // home in another variant (the round-trip is preserved, not lost).
  if (entry.note !== undefined && typeof entry.note !== "string") {
    err(name, "note: must be a string");
  }

  // routed_to: a structured, machine-checkable round-trip edge { discriminator
  // value → variant label }. Shape only here; the polymorphic path verifies the
  // named variants actually claim the values.
  if (entry.routed_to !== undefined && !isPlainObject(entry.routed_to)) {
    err(name, "routed_to: must be a map of discriminator value → variant label");
  }

  // defer: a placeholder recording that a complex field carries MORE mappable
  // content (nested sub-fields) not yet extracted — a tracked future-investigation
  // TODO, additive to the field's own mapping. `note` describes it; optional
  // `targets` name the Carta slots OCF could fill once built, so reports show them
  // as "deferred (OCF has it)" rather than "no OCF source". Target pointers are
  // resolved in validateEntryTargets (which has the bundle).
  if (entry.defer !== undefined) {
    const d = entry.defer;
    if (!isPlainObject(d)) {
      err(name, "defer: must be a map with note: and optional targets:");
    } else {
      if (typeof d.note !== "string") err(name, "defer.note: must be a string");
      if (
        d.targets !== undefined &&
        (!Array.isArray(d.targets) || !d.targets.every((t) => typeof t === "string"))
      ) {
        err(name, "defer.targets: must be an array of Carta target pointers");
      }
    }
  }
}

function validateValuesBlock(
  entry: Record<string, unknown>,
  name: string,
  kind: string,
  strict: boolean,
  sourceEnumValues: string[] | null,
  err: ErrFn
): void {
  const values = entry.values;
  if (values === undefined) {
    if (kind === "enum-remap") err(name, "kind enum-remap requires a values: map");
    return;
  }
  if (!isPlainObject(values)) {
    err(name, "values: must be a map of OCF enum value → target value");
    return;
  }
  if (sourceEnumValues === null) {
    err(name, "values: present but the source property is not enum-typed");
    return;
  }

  for (const key of Object.keys(values)) {
    if (!sourceEnumValues.includes(key)) {
      err(name, `values key "${key}" is not an OCF enum value of this property`);
    }
  }
  for (const v of sourceEnumValues) {
    if (!(v in values)) err(name, `values map is missing OCF enum value "${v}"`);
  }
  for (const [key, v] of Object.entries(values)) {
    if (v === null) continue;
    if (v === "TODO") {
      if (strict)
        err(name, `values.${key} is TODO, which is not allowed when status is complete/reviewed`);
      continue;
    }
    if (typeof v !== "string") {
      err(name, `values.${key} must be a string, null, or TODO`);
    }
  }
}

function validateEntryTargets(
  entry: Record<string, unknown>,
  name: string,
  kind: string,
  strict: boolean,
  sourceEnumValues: string[] | null,
  bundle: unknown,
  err: ErrFn
): void {
  const target = entry.target;
  const pointers: string[] = [];
  if (kind === "split" && Array.isArray(target)) {
    for (const t of target) if (typeof t === "string") pointers.push(t);
  } else if (typeof target === "string" && target !== "TODO") {
    pointers.push(target);
  }

  let lastResolved: unknown;
  for (const ptr of pointers) {
    if (!ptr.startsWith("#/")) {
      err(name, `target "${ptr}" must be a "#/..." JSON pointer into the target bundle`);
      continue;
    }
    const res = resolveJsonPointer(bundle, ptr);
    if (!res.found) {
      err(name, `target "${ptr}" does not resolve in the target bundle`);
      continue;
    }
    const node = derefNode(bundle, res.value);
    if (node === true) {
      err(
        name,
        `target "${ptr}" resolves to \`true\` (excluded from the bundle snapshot); ` +
          "use kind: unmappable with reason: excluded-from-snapshot instead"
      );
      continue;
    }
    lastResolved = node;
  }

  // defer.targets: the Carta slots a future nested-extraction would fill. Validate
  // they resolve, so the placeholder can't name a slot that doesn't exist.
  const defer = entry.defer;
  if (isPlainObject(defer) && Array.isArray(defer.targets)) {
    for (const ptr of defer.targets) {
      if (typeof ptr !== "string") continue;
      if (!ptr.startsWith("#/")) {
        err(name, `defer target "${ptr}" must be a "#/..." JSON pointer into the target bundle`);
      } else if (!resolveJsonPointer(bundle, ptr).found) {
        err(name, `defer target "${ptr}" does not resolve in the target bundle`);
      }
    }
  }

  if (kind === "enum-remap" && lastResolved !== undefined) {
    const targetEnum = targetEnumValuesAt(bundle, lastResolved);
    if (targetEnum === null) {
      // An enum-remap whose target is not an enum silently skipped value-membership
      // checking, letting a structurally-resolvable but semantically-wrong target
      // (e.g. a whole object $def) pass. Require the target to actually be an enum.
      err(
        name,
        `kind enum-remap target "${String(target)}" must resolve to an enum in the target bundle`
      );
    } else if (sourceEnumValues !== null && isPlainObject(entry.values)) {
      for (const [key, v] of Object.entries(entry.values)) {
        if (typeof v !== "string" || v === "TODO") continue;
        if (!targetEnum.includes(v)) {
          err(
            name,
            `values.${key} = "${v}" is not a member of the target enum at the mapped target`
          );
        }
      }
    }
  }
}
