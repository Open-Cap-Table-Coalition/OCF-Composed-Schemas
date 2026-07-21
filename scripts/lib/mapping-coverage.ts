import { RawSchema } from "./registry.js";

export type MappingFieldState = "mapped" | "todo" | "missing" | "invalid";

export interface CoverageSlice {
  mapped: number;
  total: number;
  fields: Record<string, MappingFieldState>;
}

export interface MappingCoverage {
  polymorphic: boolean;
  overall?: CoverageSlice;
  variants?: Record<string, CoverageSlice>;
}

const KINDS = new Set([
  "rename",
  "split",
  "combine",
  "enum-remap",
  "computed",
  "unmappable",
  "TODO",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fieldState(entry: unknown): MappingFieldState {
  if (!isPlainObject(entry) || typeof entry.kind !== "string") return "invalid";
  if (entry.kind === "TODO") return "todo";
  return KINDS.has(entry.kind) ? "mapped" : "invalid";
}

function deriveSlice(fields: Record<string, unknown>, propertyNames: string[]): CoverageSlice {
  const states: Record<string, MappingFieldState> = {};
  let mapped = 0;
  for (const name of propertyNames) {
    const state = name in fields ? fieldState(fields[name]) : "missing";
    states[name] = state;
    if (state === "mapped") mapped += 1;
  }
  return { mapped, total: propertyNames.length, fields: states };
}

/**
 * Derive mapping completion from the source schema and mapping entries.
 * Coverage is intentionally not read from the mapping YAML: it is a report,
 * not author-maintained input.
 */
export function deriveMappingCoverage(
  mapping: Record<string, unknown>,
  sourceSchema: RawSchema
): MappingCoverage {
  const propertyNames = Object.keys(sourceSchema.properties ?? {});
  const variants = isPlainObject(mapping.variants) ? mapping.variants : null;

  if (!variants) {
    const fields = isPlainObject(mapping.fields) ? mapping.fields : {};
    return {
      polymorphic: false,
      overall: deriveSlice(fields, propertyNames),
    };
  }

  const shared = isPlainObject(mapping.shared) ? mapping.shared : {};
  const slices: Record<string, CoverageSlice> = {};
  for (const [label, rawVariant] of Object.entries(variants)) {
    const variant = isPlainObject(rawVariant) ? rawVariant : {};
    const fields: Record<string, unknown> = { ...shared };
    if (isPlainObject(variant.fields)) Object.assign(fields, variant.fields);
    slices[label] = deriveSlice(fields, propertyNames);
  }
  return { polymorphic: true, variants: slices };
}

export function formatCoverage(slice: CoverageSlice): string {
  return `${slice.mapped}/${slice.total}`;
}

export function todoFields(slice: CoverageSlice): string[] {
  return Object.entries(slice.fields)
    .filter(([, state]) => state === "todo")
    .map(([name]) => name);
}

export function missingFields(slice: CoverageSlice): string[] {
  return Object.entries(slice.fields)
    .filter(([, state]) => state === "missing" || state === "invalid")
    .map(([name]) => name);
}
