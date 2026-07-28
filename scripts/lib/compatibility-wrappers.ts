import type { RawSchema } from "./registry.js";

/** Properties a compatibility wrapper may narrow without adding new payload. */
export const WRAPPER_BOOKKEEPING = new Set(["object_type", "id", "comments"]);

/** Return the concrete schema basenames directly composed by an `allOf`. */
export function allOfRefBasenames(schema: unknown): string[] {
  const allOf = isPlainObject(schema) ? schema.allOf : undefined;
  if (!Array.isArray(allOf)) return [];

  return allOf.flatMap((entry) => {
    if (!isPlainObject(entry) || typeof entry.$ref !== "string") return [];
    return [
      entry.$ref
        .split("/")
        .pop()!
        .replace(/\.schema\.json$/, ""),
    ];
  });
}

/**
 * Detect a thin OCF compatibility wrapper. When `entityNames` is supplied, the
 * composed base must also be a concrete entity in the current mapping corpus.
 */
export function compatibilityWrapperBase(
  schema: unknown,
  entityNames?: ReadonlySet<string>
): string | undefined {
  const base = allOfRefBasenames(schema).find((candidate) =>
    entityNames ? entityNames.has(candidate) : candidate.startsWith("EquityCompensation")
  );
  if (!base || !isPlainObject(schema)) return undefined;

  const properties = isPlainObject(schema.properties) ? Object.keys(schema.properties) : [];
  if (
    properties.length === 0 ||
    !properties.every((property) => WRAPPER_BOOKKEEPING.has(property))
  ) {
    return undefined;
  }
  return base;
}

export function isCompatibilityWrapperSchema(schema: RawSchema): boolean {
  return compatibilityWrapperBase(schema) !== undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
