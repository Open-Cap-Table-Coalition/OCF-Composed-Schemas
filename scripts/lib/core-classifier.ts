import { detectEnumValues } from "./enum-detection.js";
import { Registry } from "./registry.js";
import {
  derefNode,
  isPlainObject,
  resolveJsonPointer,
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
  for (const [name, raw] of Object.entries(fields)) {
    if (!isPlainObject(raw)) continue;
    const kind = typeof raw.kind === "string" ? raw.kind : "";
    if (kind === "unmappable" || kind === "TODO") {
      lost.push(name);
      continue;
    }
    const ptrs = targetPointers(raw.target);
    if (ptrs.length === 0 || ptrs.some((p) => !resolvesTarget(p, bundle).ok)) {
      lost.push(name);
    }
  }
  return { lossless: lost.length === 0, lostProps: lost };
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
    items: arr ? itemsOf(node) : null,
    node,
  };
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

  const pointers = targetPointers(entry.target);
  if (pointers.length === 0) {
    return { class: "out", reason: "no-destination", detail: "no target pointer" };
  }
  const resolved = pointers.map((p) => resolvesTarget(p, ctx.bundle));
  if (resolved.some((r) => !r.ok)) {
    return { class: "out", reason: "no-destination", detail: "target does not resolve" };
  }

  if (kind === "enum-remap") {
    return enumRemapTotality(entry, srcRaw, ctx.registry);
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

  // kind === "rename": lands unless the shape collapses (existence-loss / free-text→enum).
  const tgtRaw = resolved[0]?.node;
  const s = sourceShape(srcRaw, ctx.registry);
  const t = targetShape(tgtRaw, ctx.bundle);

  const top = collapse(s, t);
  if (top) return { class: "out", reason: top.reason, detail: top.detail };

  if (s.isArray && t.isArray) {
    const si = sourceShape(s.items, ctx.registry);
    const ti = targetShape(t.items, ctx.bundle);
    const nested = collapse(si, ti);
    if (nested) return { class: "out", reason: nested.reason, detail: `items: ${nested.detail}` };
  }

  if (s.isMultiProp) {
    // Prefer the type library: it knows OCF↔Carta sub-property correspondences
    // (currency↔currencyCode) that a name match would miss. Target is already
    // known multiProp here (a scalar target collapsed above), so a lossless
    // composite type lands; a lossy one drops named sub-properties.
    const id = isPlainObject(s.node) && typeof s.node.$id === "string" ? s.node.$id : null;
    const lib = id ? ctx.typeLib.get(id) : undefined;
    if (lib) {
      if (!lib.lossless) {
        return {
          class: "out",
          reason: "existence-loss",
          detail: `${typeName(id!)} drops ${lib.lostProps.join(", ")} (per type mapping)`,
        };
      }
    } else {
      const missing = missingTargetProp(s, t);
      if (missing) {
        return {
          class: "out",
          reason: "existence-loss",
          detail: `source property "${missing}" has no target property`,
        };
      }
    }
  }

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
