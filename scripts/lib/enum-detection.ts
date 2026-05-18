import { Registry } from "./registry.js";

/**
 * Return the list of enum values for `property` if it is an enum-valued
 * JSON Schema fragment, else null. Walks one $ref step against the
 * registry; arrays delegate to their `items`.
 */
export function detectEnumValues(property: unknown, registry: Registry): string[] | null {
  if (!property || typeof property !== "object") return null;
  const p = property as Record<string, unknown>;

  if (Array.isArray(p.enum)) {
    return p.enum.map((v) => String(v));
  }

  if (p.const !== undefined) {
    return [String(p.const)];
  }

  if (typeof p.$ref === "string") {
    const target = registry.get(p.$ref);
    if (!target) return null;
    return detectEnumValues(target, registry);
  }

  if (p.type === "array" && p.items) {
    return detectEnumValues(p.items, registry);
  }

  return null;
}
