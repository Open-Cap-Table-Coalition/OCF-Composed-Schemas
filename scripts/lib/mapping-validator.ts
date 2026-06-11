export interface PointerResult {
  found: boolean;
  value?: unknown;
}

/**
 * Resolve a "#/a/b" JSON pointer (RFC 6901, with the leading "#" fragment
 * marker) against a parsed JSON document. Purely structural — does not
 * follow $ref.
 */
export function resolveJsonPointer(doc: unknown, pointer: string): PointerResult {
  if (pointer === "#") return { found: true, value: doc };
  if (!pointer.startsWith("#/")) return { found: false };

  const parts = pointer
    .slice(2)
    .split("/")
    .map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));

  let cur: unknown = doc;
  for (const part of parts) {
    if (Array.isArray(cur)) {
      if (!/^\d+$/.test(part)) return { found: false };
      const idx = Number(part);
      if (idx >= cur.length) return { found: false };
      cur = cur[idx];
    } else if (isPlainObject(cur) && part in cur) {
      cur = cur[part];
    } else {
      return { found: false };
    }
  }
  return { found: true, value: cur };
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
