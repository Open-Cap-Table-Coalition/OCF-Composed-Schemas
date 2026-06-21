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

  // fields: with no entries parses as null (property-less schemas) — treat as {}.
  const rawFields = input.mapping.fields ?? {};
  if (!isPlainObject(rawFields)) {
    err(null, `mapping block "fields" must be a map, got ${JSON.stringify(rawFields)}`);
    return errors;
  }
  const fields = rawFields;

  const properties = (input.sourceSchema.properties ?? {}) as Record<string, unknown>;
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
