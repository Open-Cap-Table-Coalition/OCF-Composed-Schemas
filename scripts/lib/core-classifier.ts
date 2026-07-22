import { detectEnumValues } from "./enum-detection.js";
import { Registry } from "./registry.js";
import {
  derefNode,
  isDeclaredStringWrapperNode,
  isPlainObject,
  readWrapSpec,
  resolveJsonPointer,
  sourceUnionBranches,
  targetEnumValuesAt,
} from "./mapping-validator.js";

/**
 * OCF Core classifier (read-only, exploratory).
 *
 * Implements the §2 cascade and the §2.3 type inspector from
 * docs/ocf-core-spec.md: does a single `(entity, variant, field)` mapping entry
 * **land in the Carta snapshot** via a clear, deterministic, total, lossless
 * rule? It consumes the mapping `kind`/`target`/`values` already in the corpus
 * plus a shape read against the OCF registry (source) and the Carta bundle
 * (target). Nothing here mutates the corpus; it only reports a verdict.
 *
 * This is the cheap falsifiable experiment: run it over the green corpus and
 * check whether the machine's core/out verdict matches hand judgement on the
 * spine. It deliberately does NOT do §3 admissibility/closure (the fold-required
 * set and id→entity resolution aren't encoded in the corpus yet).
 */

export type FieldClass = "core" | "out";

/** Why an `out` field has no guaranteed home (§2). */
export type OutReason = "no-destination" | "existence-loss" | "partial" | "heuristic";

/** How a `core` field coarsens, if at all (§4 ledger loss kind). */
export type CoreLoss = "direct" | "widening" | "value-coarsening";

export interface Verdict {
  class: FieldClass;
  /** Present on `out`. */
  reason?: OutReason;
  /** Present on `core`. */
  loss?: CoreLoss;
  /** Short human note, e.g. "array→scalar" or "unmapped members: X, Y". */
  detail?: string;
  /** A judgement call a static read can't settle — surfaced for the eyeball pass. */
  review?: string;
}

/** Whether a composite OCF type (Monetary, Ratio, Name, …) lands losslessly in Carta. */
export interface TypeVerdict {
  lossless: boolean;
  lostProps: string[];
  /** Why at least one nested property cannot be admitted to strict Core. */
  reason?: OutReason;
}

export interface ClassifyCtx {
  registry: Registry;
  bundle: unknown;
  /**
   * The §4 type library: OCF type `$id` → whether its sub-properties all land.
   * Built from the green `ocf_kind: type` mappings; consulted for multiProp→
   * multiProp renames, where OCF↔Carta sub-property *names* diverge (OCF
   * `currency` vs Carta `currencyCode`) and a name match would false-positive.
   */
  typeLib: Map<string, TypeVerdict>;
}

/** A composite type lands losslessly iff every sub-property has a resolving, non-unmappable target. */
export function classifyType(fields: Record<string, unknown>, bundle: unknown): TypeVerdict {
  const lost: string[] = [];
  let reason: OutReason | undefined;
  for (const [name, raw] of Object.entries(fields)) {
    if (!isPlainObject(raw)) continue;
    const kind = typeof raw.kind === "string" ? raw.kind : "";
    if (kind === "unmappable" || kind === "TODO") {
      lost.push(name);
      reason ??= "no-destination";
      continue;
    }
    // A type-library entry is consulted recursively when a containing field is
    // renamed.  A nested transform may have a target, but it still cannot be
    // proven to preserve the complete value of the nested object by itself.
    if (kind === "select") {
      lost.push(name);
      reason ??= "existence-loss";
      continue;
    }
    if (kind === "computed" || kind === "combine" || kind === "split") {
      lost.push(name);
      reason ??= "heuristic";
      continue;
    }
    const ptrs = targetPointers(raw.target);
    if (ptrs.length === 0 || ptrs.some((p) => !resolvesTarget(p, bundle).ok)) {
      lost.push(name);
      reason ??= "no-destination";
    }
  }
  return {
    lossless: lost.length === 0,
    lostProps: lost,
    ...(reason ? { reason } : {}),
  };
}

function typeName(id: string): string {
  return (
    id
      .split("/")
      .pop()
      ?.replace(/\.schema\.json$/, "") ?? id
  );
}

// ---------------------------------------------------------------------------
// §2.3 type inspector — resolve, unwrap nullable unions, then four predicates.
// ---------------------------------------------------------------------------

/** A `oneOf`/`anyOf` of `{type:null}` + exactly one real branch resolves to that branch. */
function unwrapNullableUnion(node: unknown): unknown {
  if (!isPlainObject(node)) return node;
  const union = node.oneOf ?? node.anyOf;
  if (!Array.isArray(union)) return node;
  const branches = union.filter(isPlainObject);
  if (branches.length !== union.length) return node;
  const nullBranches = branches.filter((b) => b.type === "null");
  const realBranches = branches.filter((b) => b.type !== "null");
  if (nullBranches.length >= 1 && realBranches.length === 1) return realBranches[0];
  return node;
}

/** Resolve a SOURCE node: follow OCF `$ref` (full-URL $id) via the registry, unwrap nullable unions. */
export function resolveSource(node: unknown, registry: Registry, depth = 0): unknown {
  if (depth > 10 || !isPlainObject(node)) return node;
  if (typeof node.$ref === "string") {
    const target = registry.get(node.$ref);
    if (target && target !== node) return resolveSource(target, registry, depth + 1);
  }
  const unwrapped = unwrapNullableUnion(node);
  if (unwrapped !== node) return resolveSource(unwrapped, registry, depth + 1);
  return node;
}

/** Resolve a TARGET node: follow Carta `#/...` `$ref` via the bundle, unwrap nullable unions. */
export function resolveTarget(node: unknown, bundle: unknown, depth = 0): unknown {
  if (depth > 10) return node;
  const dereffed = derefNode(bundle, node);
  const unwrapped = unwrapNullableUnion(dereffed);
  if (unwrapped !== dereffed) return resolveTarget(unwrapped, bundle, depth + 1);
  return dereffed;
}

function dataProps(node: unknown): Record<string, unknown> | null {
  if (!isPlainObject(node) || !isPlainObject(node.properties)) return null;
  // OCF scalar type files carry boilerplate `properties: {}` — an empty object is
  // not a composite. Treat it as no properties so scalars resolve as scalars.
  const props = node.properties as Record<string, unknown>;
  return Object.keys(props).length > 0 ? props : null;
}

function isArrayNode(node: unknown): boolean {
  return isPlainObject(node) && node.type === "array";
}

function itemsOf(node: unknown): unknown {
  return isPlainObject(node) ? node.items ?? null : null;
}

/**
 * A scalar leaf: a bare `type: string` node, or a single-property wrapper whose
 * one property resolves to a string leaf (Carta's `{value: …}` wrappers —
 * Decimal, Iso8601*, and the like). `resolve` is the side-appropriate resolver.
 */
function isScalarNode(node: unknown, resolve: (n: unknown) => unknown): boolean {
  if (!isPlainObject(node)) return false;
  const props = dataProps(node);
  if (!props) return node.type === "string";
  const keys = Object.keys(props);
  if (keys.length !== 1) return false;
  const only = resolve(props[keys[0] as string]);
  return isPlainObject(only) && only.type === "string";
}

/** An object with ≥2 data properties that is not a scalar wrapper (Money, Ratio, …). */
function isMultiPropObject(node: unknown, resolve: (n: unknown) => unknown): boolean {
  const props = dataProps(node);
  if (!props) return false;
  if (isScalarNode(node, resolve)) return false;
  return Object.keys(props).length >= 2;
}

interface Shape {
  isEnum: boolean;
  isArray: boolean;
  isScalar: boolean;
  isMultiProp: boolean;
  /** More than one non-null branch remains after nullable-union unwrapping. */
  hasRealUnion: boolean;
  /** Raw `items` node (pre-resolution) when isArray, else null. */
  items: unknown;
  /** Resolved + unwrapped node. */
  node: unknown;
}

function sourceShape(raw: unknown, registry: Registry): Shape {
  const node = resolveSource(raw, registry);
  const resolve = (n: unknown) => resolveSource(n, registry);
  const arr = isArrayNode(node);
  return {
    isEnum: detectEnumValues(node, registry) !== null,
    isArray: arr,
    isScalar: isScalarNode(node, resolve),
    isMultiProp: isMultiPropObject(node, resolve),
    hasRealUnion: hasRealUnion(node),
    items: arr ? itemsOf(node) : null,
    node,
  };
}

function targetShape(raw: unknown, bundle: unknown): Shape {
  const node = resolveTarget(raw, bundle);
  const resolve = (n: unknown) => resolveTarget(n, bundle);
  const arr = isArrayNode(node);
  return {
    isEnum: targetEnumValuesAt(bundle, node) !== null,
    isArray: arr,
    isScalar: isScalarNode(node, resolve),
    isMultiProp: isMultiPropObject(node, resolve),
    hasRealUnion: hasRealUnion(node),
    items: arr ? itemsOf(node) : null,
    node,
  };
}

function hasRealUnion(node: unknown): boolean {
  if (!isPlainObject(node)) return false;
  const union = node.oneOf ?? node.anyOf;
  if (!Array.isArray(union)) return false;
  const branches = union.filter(isPlainObject);
  if (branches.length !== union.length) return false;
  const realBranches = branches.filter((b) => b.type !== "null" && !isAssertionOnlyUnionBranch(b));
  return realBranches.length > 1;
}

/** `anyOf: [{required: [...]}, ...]` constrains the containing object; it is
 * not a union of alternative value shapes and must not make a direct rename
 * look partial. */
function isAssertionOnlyUnionBranch(branch: Record<string, unknown>): boolean {
  const keys = Object.keys(branch);
  return keys.length > 0 && keys.every((key) => key === "required");
}

/** The three structural collapses, in cascade order. Returns the first that fires. */
function collapse(src: Shape, tgt: Shape): { detail: string; reason: OutReason } | null {
  if (src.isArray && !tgt.isArray) return { detail: "array→scalar", reason: "existence-loss" };
  if (src.isMultiProp && !tgt.isMultiProp)
    return { detail: "structure→scalar", reason: "existence-loss" };
  if (tgt.isEnum && !src.isEnum) return { detail: "free-text→enum", reason: "heuristic" };
  return null;
}

/** A source data property whose name has no counterpart on the target object, else null. */
function missingTargetProp(src: Shape, tgt: Shape): string | null {
  const srcProps = dataProps(src.node);
  const tgtProps = dataProps(tgt.node);
  if (!srcProps || !tgtProps) return null;
  const tgtNames = new Set(Object.keys(tgtProps));
  for (const name of Object.keys(srcProps)) {
    if (!tgtNames.has(name)) return name;
  }
  return null;
}

/**
 * Check the lossiness of a composite shape using the type library, if one is
 * available.  This is deliberately separate from `collapse`: a composite can
 * have a compatible target shape while one of its nested mapping entries is a
 * computed/split/select or has no destination.
 */
function compositeLoss(
  src: Shape,
  tgt: Shape,
  ctx: ClassifyCtx
): { detail: string; reason: OutReason } | null {
  if (!src.isMultiProp) return null;

  const id = isPlainObject(src.node) && typeof src.node.$id === "string" ? src.node.$id : null;
  const lib = id ? ctx.typeLib.get(id) : undefined;
  if (lib) {
    if (!lib.lossless) {
      return {
        reason: lib.reason ?? "existence-loss",
        detail: `${typeName(id!)} drops ${lib.lostProps.join(", ")} (per type mapping)`,
      };
    }
    return null;
  }

  const missing = missingTargetProp(src, tgt);
  if (missing) {
    return {
      reason: "existence-loss",
      detail: `source property "${missing}" has no target property`,
    };
  }
  return null;
}

/** Recursively inspect an object and all array items for direct-rename loss. */
function nestedShapeLoss(
  src: Shape,
  tgt: Shape,
  ctx: ClassifyCtx,
  path = ""
): { detail: string; reason: OutReason } | null {
  const qualify = (detail: string) => (path ? `${path}: ${detail}` : detail);

  if (src.hasRealUnion) {
    return {
      reason: "partial",
      detail: qualify("source union has multiple real branches; direct rename is not total"),
    };
  }

  const top = collapse(src, tgt);
  if (top) return { reason: top.reason, detail: qualify(top.detail) };

  const composite = compositeLoss(src, tgt, ctx);
  if (composite) return { reason: composite.reason, detail: qualify(composite.detail) };

  if (src.isArray && tgt.isArray) {
    const si = sourceShape(src.items, ctx.registry);
    const ti = targetShape(tgt.items, ctx.bundle);
    return nestedShapeLoss(si, ti, ctx, path ? `${path}.items` : "items");
  }
  return null;
}

// ---------------------------------------------------------------------------
// Target resolution helpers.
// ---------------------------------------------------------------------------

/** The pointer(s) a `target:` carries: [] for null/TODO/absent, n for split arrays, else [ptr]. */
function targetPointers(target: unknown): string[] {
  if (Array.isArray(target)) return target.filter((t): t is string => typeof t === "string");
  if (typeof target === "string" && target !== "TODO") return [target];
  return [];
}

/** Mirror of the validator's resolve predicate: resolves and is not Carta's `true` no-home marker. */
function resolvesTarget(ptr: string, bundle: unknown): { ok: boolean; node?: unknown } {
  if (!ptr.startsWith("#/")) return { ok: false };
  const res = resolveJsonPointer(bundle, ptr);
  if (!res.found) return { ok: false };
  const node = derefNode(bundle, res.value);
  if (node === true) return { ok: false };
  return { ok: true, node };
}

// ---------------------------------------------------------------------------
// §2 cascade.
// ---------------------------------------------------------------------------

/** Totality of an enum-remap: a source member sent to null and not routed elsewhere ⇒ partial ⇒ out. */
function enumRemapTotality(
  entry: Record<string, unknown>,
  srcRaw: unknown,
  registry: Registry
): Verdict {
  const values = isPlainObject(entry.values) ? entry.values : {};
  const routed = isPlainObject(entry.routed_to) ? entry.routed_to : {};
  const members = detectEnumValues(srcRaw, registry) ?? Object.keys(values);
  const unmapped: string[] = [];
  for (const m of members) {
    const mapped = m in values ? values[m] : undefined;
    const lands = typeof mapped === "string" && mapped !== "TODO";
    if (!lands && !(m in routed)) unmapped.push(m);
  }
  if (unmapped.length > 0) {
    return { class: "out", reason: "partial", detail: `unmapped members: ${unmapped.join(", ")}` };
  }
  return { class: "core", loss: "value-coarsening", detail: "enum→bucket" };
}

function sourceSchemaName(sourceSchema: string): string {
  return (
    sourceSchema
      .split("/")
      .pop()
      ?.replace(/\.schema\.json$/, "") ?? sourceSchema
  );
}

function unionCaseDetail(
  sourceSchema: string,
  mapping: Record<string, unknown>,
  verdict: Verdict
): string {
  const label = sourceSchemaName(sourceSchema);
  if (verdict.reason === "no-destination" && isPlainObject(mapping.values)) {
    const dropped = Object.entries(mapping.values)
      .filter(([, value]) => value === null || value === "TODO")
      .map(([value]) => value);
    if (dropped.length > 0) return `${label}: unmapped members ${dropped.join(", ")}`;
  }
  if (verdict.class === "core") return `${label}: ${verdict.loss ?? "direct"}`;
  return `${label}: ${verdict.reason ?? "out"}${verdict.detail ? ` (${verdict.detail})` : ""}`;
}

function unionMapTotality(
  entry: Record<string, unknown>,
  srcRaw: unknown,
  ctx: ClassifyCtx
): Verdict {
  const branches = sourceUnionBranches(srcRaw, ctx.registry);
  const cases = Array.isArray(entry.cases) ? entry.cases : [];
  const casesByRef = new Map<string, Record<string, unknown>>();
  for (const rawCase of cases) {
    if (!isPlainObject(rawCase) || typeof rawCase.source_schema !== "string") continue;
    if (isPlainObject(rawCase.mapping)) casesByRef.set(rawCase.source_schema, rawCase.mapping);
  }

  const verdicts: Array<{ detail: string; verdict: Verdict }> = [];
  for (const branch of branches) {
    const mapping = casesByRef.get(branch.sourceSchema);
    if (!mapping) {
      verdicts.push({
        detail: `${sourceSchemaName(branch.sourceSchema)}: missing case`,
        verdict: { class: "out", reason: "partial" },
      });
      continue;
    }
    const verdict = classifyField(mapping, branch.node, ctx);
    verdicts.push({
      detail: unionCaseDetail(branch.sourceSchema, mapping, verdict),
      verdict,
    });
  }

  if (verdicts.length === 0) {
    return {
      class: "out",
      reason: "no-destination",
      detail: "union-map has no resolvable source cases",
    };
  }

  const details = verdicts.map((v) => v.detail).join("; ");
  const out = verdicts.filter((v) => v.verdict.class === "out");
  if (out.length === 0) {
    const rank: Record<CoreLoss, number> = { direct: 0, widening: 1, "value-coarsening": 2 };
    const loss = verdicts
      .map((v) => v.verdict.loss ?? "direct")
      .sort((a, b) => rank[b] - rank[a])[0] as CoreLoss;
    return { class: "core", loss, detail: details };
  }

  const hasLanding = verdicts.some((v) => v.verdict.class === "core");
  const hasPartial = out.some((v) => v.verdict.reason === "partial");
  if (hasLanding || hasPartial) return { class: "out", reason: "partial", detail: details };

  const firstReason = out[0]?.verdict.reason ?? "partial";
  return { class: "out", reason: firstReason, detail: details };
}

/**
 * Classify one mapping entry for a single `(entity, variant, field)`.
 * `srcRaw` is the source schema's property node (raw, pre-resolution).
 */
export function classifyField(
  entry: Record<string, unknown>,
  srcRaw: unknown,
  ctx: ClassifyCtx
): Verdict {
  const kind = typeof entry.kind === "string" ? entry.kind : String(entry.kind);

  if (kind === "unmappable" || kind === "TODO") {
    return { class: "out", reason: "no-destination", detail: `kind ${kind}` };
  }

  if (kind === "union-map") return unionMapTotality(entry, srcRaw, ctx);

  const pointers = targetPointers(entry.target);
  if (pointers.length === 0) {
    return { class: "out", reason: "no-destination", detail: "no target pointer" };
  }
  const resolved = pointers.map((p) => resolvesTarget(p, ctx.bundle));
  if (resolved.some((r) => !r.ok)) {
    return { class: "out", reason: "no-destination", detail: "target does not resolve" };
  }

  if (kind === "enum-remap") {
    const enumSource = sourceShape(srcRaw, ctx.registry);
    const enumTarget = targetShape(resolved[0]?.node, ctx.bundle);
    if (enumSource.isArray && !enumTarget.isArray) {
      return { class: "out", reason: "existence-loss", detail: "array→scalar" };
    }
    if (enumSource.isMultiProp && !enumTarget.isMultiProp) {
      return { class: "out", reason: "existence-loss", detail: "structure→scalar" };
    }
    return enumRemapTotality(entry, srcRaw, ctx.registry);
  }

  if (kind === "select") {
    const policy = typeof entry.policy === "string" ? entry.policy : "unspecified";
    return { class: "out", reason: "existence-loss", detail: `select (${policy})` };
  }

  if (kind === "wrap") {
    const spec = readWrapSpec(entry);
    const source = sourceShape(srcRaw, ctx.registry);
    const target = resolved[0]?.node;
    if (
      !spec ||
      !source.isScalar ||
      !isDeclaredStringWrapperNode(ctx.bundle, target, spec.property)
    ) {
      return { class: "out", reason: "no-destination", detail: "invalid wrap shape" };
    }
    return { class: "core", loss: "widening", detail: `scalar→${spec.property} wrapper` };
  }

  if (kind === "computed" || kind === "combine" || kind === "split") {
    // Ruling A vs B: the kind alone doesn't decide. A static read can't establish a
    // lossless reverse-edge landing, so the default is out (heuristic); flag array
    // targets as ruling-B candidates for the human to confirm.
    const last = resolved[resolved.length - 1]?.node;
    const tgt = targetShape(last, ctx.bundle);
    const review = tgt.isArray
      ? "possible reverse-edge (ruling B) — target is an array; confirm lossless lineage"
      : undefined;
    return { class: "out", reason: "heuristic", detail: `kind ${kind}`, review };
  }

  // kind === "rename": lands only when the shape is compatible. The validator rejects
  // implicit reductions; this defensive classifier keeps generated verdicts honest too.
  const tgtRaw = resolved[0]?.node;
  const s = sourceShape(srcRaw, ctx.registry);
  const t = targetShape(tgtRaw, ctx.bundle);

  // A direct rename must be total not only at its top-level shape but also at
  // every nested object/array item. Nullable unions were already unwrapped;
  // genuine multi-branch domains and nested computed/split/select mappings are
  // therefore kept out of strict Core.
  const nested = nestedShapeLoss(s, t, ctx);
  if (nested) return { class: "out", reason: nested.reason, detail: nested.detail };

  // Lands. Distinguish a widening (scalar→differently-typed scalar) from a direct copy.
  const loss: CoreLoss =
    s.isScalar && t.isScalar && !sameScalar(s.node, t.node) ? "widening" : "direct";
  return { class: "core", loss };
}

/** Two scalar leaves share a primitive type (so a rename is a direct copy, not a widening). */
function sameScalar(a: unknown, b: unknown): boolean {
  const prim = (n: unknown): string | null => {
    if (!isPlainObject(n)) return null;
    if (typeof n.type === "string") return n.type;
    const props = dataProps(n);
    if (props) {
      const keys = Object.keys(props);
      if (keys.length === 1) {
        const only = props[keys[0] as string];
        if (isPlainObject(only) && typeof only.type === "string") return only.type;
      }
    }
    return null;
  };
  const pa = prim(a);
  const pb = prim(b);
  return pa !== null && pa === pb;
}
