/**
 * OCF Core — shared markdown renderers for source-side loss reports.
 *
 * Mapping joins are performed before these pure renderers run. The reports use
 * canonical JSON-pointer targets from `Corpus.mappingEdges`, the same normalized
 * edge model consumed by the Mapping Explorer.
 */
import { targetPointerParts } from "./mapping-report.js";

export interface FlowRow {
  entity: string;
  variant: string;
  field: string;
  target: string;
  reason: string;
  detail: string;
  ocfRequired: boolean;
  admissible: boolean;
}

export interface FieldRow {
  field: string;
  ocfRequired: boolean;
  variants: string[];
  target: string;
  reason: string;
  detail: string;
}

export interface EntityGroup {
  entity: string;
  admissible: boolean;
  fields: FieldRow[];
}

/** Parse one canonical Carta JSON pointer into a readable object/property pair. */
export function parsePointer(ptr: string): { object: string; prop: string } | null {
  const value = ptr.trim();
  const pointerStart = value.lastIndexOf("#/$defs/");
  if (pointerStart < 0) return null;
  const pointer = value.slice(pointerStart);
  const parts = targetPointerParts(pointer);
  if (
    parts.object === pointer ||
    parts.relative === pointer ||
    (parts.relative !== parts.object && !pointer.includes("/properties/"))
  )
    return null;
  const prop = parts.relative.replace(/\/properties\//g, ".").replace(/\/items(?=\/|$)/g, "[]");
  return { object: parts.object, prop: prop === parts.object ? "" : prop };
}

/** Every Carta slot a source field flows to. */
export function parseTargets(target: string): { object: string; prop: string }[] {
  if (!target || target === "—") return [];
  return target
    .split(" + ")
    .map(parsePointer)
    .filter((x): x is { object: string; prop: string } => !!x);
}

/** Render targets as `Obj.prop` / `Obj.{p1, p2}`, grouped by Carta object. */
export function flowString(target: string): string {
  const parts = parseTargets(target);
  if (!parts.length) return target || "—";
  const byObj = new Map<string, string[]>();
  for (const { object, prop } of parts) {
    const arr = byObj.get(object) ?? [];
    if (prop) arr.push(prop);
    byObj.set(object, arr);
  }
  return [...byObj.entries()]
    .map(([obj, props]) =>
      props.length > 1
        ? `${obj}.{${props.join(", ")}}`
        : props.length === 1
        ? `${obj}.${props[0]}`
        : obj
    )
    .join(" + ");
}

/** `heuristic` + `kind computed` → `heuristic (computed)`. */
export function lossLabel(reason: string, detail: string): string {
  const d = detail.replace(/^kind /, "").trim();
  return d ? `${reason} (${d})` : reason;
}

/** Group one field-row per `(field, target, loss)`, merging identical variants. */
export function groupByEntity(rows: FlowRow[]): EntityGroup[] {
  const byEntity = new Map<string, FlowRow[]>();
  for (const r of rows) {
    const arr = byEntity.get(r.entity) ?? [];
    arr.push(r);
    byEntity.set(r.entity, arr);
  }
  const out: EntityGroup[] = [];
  for (const [entity, ers] of byEntity) {
    const byField = new Map<string, FieldRow>();
    for (const r of ers) {
      const key = `${r.field}|${r.target}|${r.reason}|${r.detail}`;
      let f = byField.get(key);
      if (!f) {
        f = {
          field: r.field,
          ocfRequired: false,
          variants: [],
          target: r.target,
          reason: r.reason,
          detail: r.detail,
        };
        byField.set(key, f);
      }
      f.ocfRequired = f.ocfRequired || r.ocfRequired;
      if (r.variant !== "—" && !f.variants.includes(r.variant)) f.variants.push(r.variant);
    }
    out.push({
      entity,
      admissible: ers.some((r) => r.admissible),
      fields: [...byField.values()].sort((a, b) => a.field.localeCompare(b.field)),
    });
  }
  return out.sort((a, b) => a.entity.localeCompare(b.entity));
}

/** Render one source-side table per OCF object. */
export function byObjectTables(groups: EntityGroup[]): string[] {
  const out: string[] = [];
  for (const g of groups) {
    out.push(`### ${g.entity} — ${g.admissible ? "in Core (admissible)" : "not yet admissible"}`);
    out.push(
      "",
      "| field | OCF-req | variant(s) | flows to (Carta) | loss |",
      "| --- | :---: | --- | --- | --- |"
    );
    for (const f of g.fields) {
      out.push(
        `| ${f.field} | ${f.ocfRequired ? "**yes**" : ""} | ${f.variants.join(", ")} | ${flowString(
          f.target
        )} | ${lossLabel(f.reason, f.detail)} |`
      );
    }
    out.push("");
  }
  return out;
}

/** Render the inverse source-side view, sorted by Carta-slot fan-in. */
export function flowMapLines(groups: EntityGroup[]): string[] {
  const slots = new Map<string, string[]>();
  for (const g of groups) {
    for (const f of g.fields) {
      const src = `${g.entity}.${f.field}${f.variants.length ? ` [${f.variants.join(", ")}]` : ""}`;
      for (const { object, prop } of parseTargets(f.target)) {
        const slot = prop ? `${object}.${prop}` : object;
        const arr = slots.get(slot) ?? [];
        if (!arr.includes(src)) arr.push(src);
        slots.set(slot, arr);
      }
    }
  }
  return [...slots.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(
      ([slot, srcs]) => `- \`${slot}\` ← ${srcs.length}: ${srcs.map((s) => `\`${s}\``).join(", ")}`
    );
}
