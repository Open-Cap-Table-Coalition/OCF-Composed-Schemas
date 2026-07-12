/**
 * Small shared helpers for the generated reports (ledger, gap, upstream) and the
 * lossy-home inventory — one home for the pieces those renderers would otherwise
 * each re-implement.
 */
import { isPlainObject } from "./mapping-validator.js";
import { GreenObject } from "./core-corpus.js";

/** OCF object scaffolding that carries no economic effect — excluded from gap/loss reports. */
export const BOOKKEEPING = new Set(["id", "object_type", "comments"]);

/** Render a mapping `target:` (string | null | array | per-variant object) as one display string. */
export function targetString(target: unknown): string {
  if (target === null || target === undefined) return "—";
  if (typeof target === "string") return target;
  if (Array.isArray(target)) return target.map(targetString).join(" + ");
  return JSON.stringify(target);
}

/** `"<entity> <variant> <field>"` → the Carta target the mapping names, as a display string. */
export function buildTargetIndex(objects: GreenObject[]): Map<string, string> {
  const targetOf = new Map<string, string>();
  for (const o of objects) {
    for (const [variant, fields] of o.variants) {
      for (const [field, entry] of Object.entries(fields)) {
        if (isPlainObject(entry)) {
          targetOf.set(`${o.entity} ${variant} ${field}`, targetString(entry.target));
        }
      }
    }
  }
  return targetOf;
}
