/**
 * Inverse semantics for a forward OCF → Carta mapping entry.
 *
 * The mapping `kind` describes how a value is transformed. This vocabulary
 * describes what can be recovered when walking the resulting Carta data back
 * toward OCF. The two axes are deliberately independent.
 */

export const INVERSE_ROLE_VOCABULARY = [
  "record-construction",
  "reference-only",
  "state-projection",
  "aggregate-projection",
  "event-reconstruction",
] as const;

export type InverseRole = typeof INVERSE_ROLE_VOCABULARY[number];

export interface InverseSpec {
  role: InverseRole;
  note?: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isInverseRole(value: unknown): value is InverseRole {
  return (
    typeof value === "string" && (INVERSE_ROLE_VOCABULARY as readonly string[]).includes(value)
  );
}

/** Read an optional `inverse:` block without applying the default role. */
export function inverseSpecOf(entry: Record<string, unknown>): InverseSpec | undefined {
  if (!isPlainObject(entry.inverse)) return undefined;
  const raw = entry.inverse;
  if (!isInverseRole(raw.role)) return undefined;
  return {
    role: raw.role,
    ...(typeof raw.note === "string" ? { note: raw.note } : {}),
  };
}

/** The effective role for an edge; omitted metadata means ordinary record construction. */
export function inverseRoleOf(entry: Record<string, unknown>): InverseRole {
  return inverseSpecOf(entry)?.role ?? "record-construction";
}

/** Validate the closed shape of an optional `inverse:` block. */
export function validateInverseSpec(
  entry: Record<string, unknown>,
  field: string,
  err: (field: string, message: string) => void
): void {
  if (entry.inverse === undefined) return;
  if (!isPlainObject(entry.inverse)) {
    err(field, "inverse: must be a map with role: and optional note:");
    return;
  }

  const raw = entry.inverse;
  const keys = Object.keys(raw).sort();
  if (keys.some((key) => key !== "note" && key !== "role")) {
    err(field, "inverse: allows only role: and note:");
  }
  if (!isInverseRole(raw.role)) {
    err(
      field,
      `inverse.role "${String(raw.role)}" is not one of ${INVERSE_ROLE_VOCABULARY.join(" | ")}`
    );
  }
  if (raw.note !== undefined && typeof raw.note !== "string") {
    err(field, "inverse.note: must be a string");
  }
}
