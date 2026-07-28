/**
 * Small shared helpers for the generated reports (ledger, gap, upstream) and the
 * lossy-home inventory — one home for the pieces those renderers would otherwise
 * each re-implement.
 */
import { isPlainObject } from "./mapping-validator.js";

/** OCF object scaffolding that carries no economic effect — excluded from gap/loss reports. */
export const BOOKKEEPING = new Set(["id", "object_type", "comments"]);

/** Render a mapping `target:` (string | null | array | per-variant object) as one display string. */
export function targetString(target: unknown): string {
  if (target === null || target === undefined) return "—";
  if (typeof target === "string") return target;
  if (Array.isArray(target)) return target.map(targetString).join(" + ");
  return JSON.stringify(target);
}

/** Render all Carta targets named by a field entry, including union-map cases. */
export function entryTargetString(entry: unknown): string {
  if (!isPlainObject(entry)) return "—";
  if (entry.kind === "sequential_transform" && Array.isArray(entry.steps)) {
    const targets: string[] = [];
    for (const step of entry.steps) {
      if (!isPlainObject(step) || !Array.isArray(step.targets)) continue;
      for (const target of step.targets) if (typeof target === "string") targets.push(target);
    }
    return targets.join(" + ") || "—";
  }
  if (entry.kind !== "union-map" || !Array.isArray(entry.cases)) {
    return targetString(entry.target);
  }
  const cases = entry.cases.filter(isPlainObject).map((rawCase) => {
    const source =
      typeof rawCase.source_schema === "string"
        ? rawCase.source_schema
            .split("/")
            .pop()
            ?.replace(/\.schema\.json$/, "")
        : "?";
    const mapping = isPlainObject(rawCase.mapping) ? rawCase.mapping : {};
    return `${source ?? "?"} → ${targetString(mapping.target)}`;
  });
  return cases.join("; ") || "—";
}
