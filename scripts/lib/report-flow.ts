/**
 * OCF Core — the shared VISUAL layer for the loss reports (lossy inventory,
 * upstream-OCF report, gap report). Turns already-joined `(OCF field → Carta
 * target)` rows into: a mermaid flow diagram, per-OCF-object tables with a legible
 * `flows to` column, and an inverted flow-map (per Carta slot, its OCF sources).
 * Pure string helpers over `FlowRow[]`; no I/O, no corpus access.
 */

/** One OCF field and where its mapping sends it (target = display string, "—" if no home). */
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

/** A field after variants that map identically are merged. */
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

// --- Target parsing: `#/$defs/Obj/properties/x` → legible object.property. ---

export function parsePointer(ptr: string): { object: string; prop: string } | null {
  const m = /#\/\$defs\/([^/]+)(?:\/properties\/(.+))?$/.exec(ptr.trim());
  if (!m) return null;
  const prop = (m[2] ?? "").replace(/\/properties\//g, ".").replace(/\/items(?=\/|$)/g, "[]");
  return { object: m[1] as string, prop };
}

/** Every Carta slot a target flows to (a split target names several). */
export function parseTargets(target: string): { object: string; prop: string }[] {
  if (!target || target === "—") return [];
  return target
    .split(" + ")
    .map(parsePointer)
    .filter((x): x is { object: string; prop: string } => !!x);
}

/** A target as `Obj.prop` / `Obj.{p1, p2}` (grouped per Carta object), for a table cell. */
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

// --- Grouping: one field-row per (field, target, loss), variants merged. ---

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

// --- Renderers. ---

/** `### <entity>` + a `field | OCF-req | variant(s) | flows to | loss` table per object. */
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

/** Inverted view: one bullet per Carta slot, its OCF sources, fan-in first. */
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

/**
 * A mermaid `flowchart LR`: OCF source objects → the Carta objects their fields flow
 * to, edges labelled with the field count; OCF nodes coloured by admissibility. If
 * `opts.sink` is given, fields with NO Carta home drain to a single sink node — the
 * honest visual for the gap report's `no-destination` casualties.
 */
export function mermaidFlow(groups: EntityGroup[], opts: { sink?: string } = {}): string[] {
  const SEP = "\t"; // safe: entity / Carta-object names never contain a tab
  const SINK = "__SINK__";
  const ocf = new Map<string, boolean>();
  const carta = new Set<string>();
  const edges = new Map<string, number>();
  let sinkUsed = false;
  for (const g of groups) {
    ocf.set(g.entity, g.admissible);
    for (const f of g.fields) {
      const objs = new Set(parseTargets(f.target).map((t) => t.object));
      if (objs.size === 0) {
        if (opts.sink) {
          const k = `${g.entity}${SEP}${SINK}`;
          edges.set(k, (edges.get(k) ?? 0) + 1);
          sinkUsed = true;
        }
        continue;
      }
      for (const obj of objs) {
        carta.add(obj);
        const k = `${g.entity}${SEP}${obj}`;
        edges.set(k, (edges.get(k) ?? 0) + 1);
      }
    }
  }
  const oid = new Map<string, string>();
  [...ocf.keys()].sort().forEach((n, i) => oid.set(n, `o${i}`));
  const tid = new Map<string, string>();
  [...carta].sort().forEach((n, i) => tid.set(n, `t${i}`));

  const out = [
    "```mermaid",
    "flowchart LR",
    "  classDef adm fill:#e6f4ea,stroke:#34a853,color:#0b3d20;",
    "  classDef notadm fill:#f1f3f4,stroke:#9aa0a6,color:#5f6368,stroke-dasharray:4 3;",
    "  classDef carta fill:#e8f0fe,stroke:#1a73e8,color:#0d2b66;",
    "  classDef sink fill:#fce8e6,stroke:#d93025,color:#5c0d06;",
    '  subgraph SRC["OCF source objects"]',
    "    direction TB",
  ];
  for (const [n, id] of oid) out.push(`    ${id}["${n}"]:::${ocf.get(n) ? "adm" : "notadm"}`);
  out.push("  end", '  subgraph TGT["Carta target objects"]', "    direction TB");
  for (const [n, id] of tid) out.push(`    ${id}["${n}"]:::carta`);
  if (sinkUsed) out.push(`    sink["${opts.sink}"]:::sink`);
  out.push("  end");
  for (const [k, count] of [...edges.entries()].sort()) {
    const [e, o] = k.split(SEP);
    const tgt = o === SINK ? "sink" : tid.get(o as string);
    out.push(`  ${oid.get(e as string)} -->|${count}| ${tgt}`);
  }
  out.push("```");
  return out;
}
