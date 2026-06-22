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

export const KIND_VOCABULARY = [
  "rename",
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

  // fields: with no entries parses as null (property-less schemas) — treat as {}.
  const rawFields = input.mapping.fields ?? {};
  if (!isPlainObject(rawFields)) {
    err(null, `mapping block "fields" must be a map, got ${JSON.stringify(rawFields)}`);
    return errors;
  }
  const fields = rawFields;

  const properties = (input.sourceSchema.properties ?? {}) as Record<string, unknown>;
  const propertyNames = Object.keys(properties);

  const nonTodoCount = validateFieldMap(fields, properties, strict, opts, input, err);

  const coverage = input.mapping.coverage;
  const match = typeof coverage === "string" ? /^(\d+)\/(\d+)$/.exec(coverage) : null;
  if (!match) {
    err(null, `coverage "${String(coverage)}" must look like "X/N"`);
  } else {
    const x = Number(match[1]);
    const n = Number(match[2]);
    if (n !== propertyNames.length) {
      err(
        null,
        `coverage denominator ${n} does not match source schema property count ${propertyNames.length}`
      );
    }
    if (x !== nonTodoCount) {
      err(
        null,
        `coverage numerator ${x} does not match the count of non-TODO entries (${nonTodoCount})`
      );
    }
  }

  return errors;
}

function isStatus(v: unknown): v is typeof STATUS_VOCABULARY[number] {
  return typeof v === "string" && (STATUS_VOCABULARY as readonly string[]).includes(v);
}

type ErrFn = (field: string | null, message: string) => void;

/**
 * Validate one field map — the `fields:` of a simple mapping, or a variant's
 * effective `shared:` ∪ `fields:` map. Reports key/coverage/entry errors via
 * `err` and returns the count of non-TODO entries (the coverage numerator).
 */
function validateFieldMap(
  fields: Record<string, unknown>,
  properties: Record<string, unknown>,
  strict: boolean,
  opts: ValidateOptions,
  input: ValidateInput,
  err: ErrFn
): number {
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

  let nonTodoCount = 0;
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
    if (kind !== "TODO") nonTodoCount += 1;

    validateEntryShape(entry, name, kind, strict, opts, err);
    const sourceEnumValues = detectEnumValues(properties[name], input.registry);
    validateValuesBlock(entry, name, kind, strict, sourceEnumValues, err);
    if (input.targetBundle !== null) {
      validateEntryTargets(entry, name, kind, strict, sourceEnumValues, input.targetBundle, err);
    }
  }
  return nonTodoCount;
}

/**
 * Validate a polymorphic mapping: a `discriminator:` (issuance-time routing) or
 * `route_by_security:` (downstream join routing) block plus a `variants:` map
 * whose `when:` value sets partition the routed enum. Each variant carries its
 * own `primary_targets:` (the Carta family roots) and a `shared:`-merged field
 * map, validated per variant against a per-variant `coverage:` map. The routed
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

  // 4. Per-variant: primary_targets resolve; shared∪fields validates; coverage matches.
  const coverage = mapping.coverage;
  if (!isPlainObject(coverage)) {
    err(
      null,
      `a polymorphic mapping requires a per-variant coverage map (e.g. { Variant: "X/N" }), got ${JSON.stringify(
        coverage
      )}`
    );
  }
  const coverageMap = (isPlainObject(coverage) ? coverage : {}) as Record<string, unknown>;

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
    for (const k of Object.keys(rawVFields)) {
      if (k in shared) {
        err(
          null,
          `variant "${label}" field "${k}" also appears in shared: (a field is either shared or variant-specific)`
        );
      }
    }
    const effective: Record<string, unknown> = {
      ...shared,
      ...(rawVFields as Record<string, unknown>),
    };
    const variantErr: ErrFn = (field, message) => err(field ? `${label}.${field}` : null, message);
    const nonTodo = validateFieldMap(effective, properties, strict, opts, input, variantErr);

    const cov = coverageMap[label];
    const cm = typeof cov === "string" ? /^(\d+)\/(\d+)$/.exec(cov) : null;
    if (cov === undefined) {
      err(null, `coverage is missing an entry for variant "${label}"`);
    } else if (!cm) {
      err(null, `coverage for variant "${label}" "${String(cov)}" must look like "X/N"`);
    } else {
      const x = Number(cm[1]);
      const n = Number(cm[2]);
      if (n !== propertyNames.length) {
        err(
          null,
          `coverage["${label}"] denominator ${n} does not match source schema property count ${propertyNames.length}`
        );
      }
      if (x !== nonTodo) {
        err(
          null,
          `coverage["${label}"] numerator ${x} does not match the count of non-TODO entries (${nonTodo})`
        );
      }
    }
  }

  for (const label of Object.keys(coverageMap)) {
    if (!(label in variants)) {
      err(null, `coverage has an entry for "${label}" but there is no such variant`);
    }
  }
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

  if (kind === "enum-remap" && sourceEnumValues !== null && lastResolved !== undefined) {
    const targetEnum = targetEnumValuesAt(bundle, lastResolved);
    const values = entry.values;
    if (targetEnum !== null && isPlainObject(values)) {
      for (const [key, v] of Object.entries(values)) {
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
