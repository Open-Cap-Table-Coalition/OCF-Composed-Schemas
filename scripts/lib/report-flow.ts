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

const SINK = "__SINK__"; // dst sentinel for a field with no Carta home

interface Edge {
  src: string; // OCF entity
  dst: string; // Carta object, or SINK
  label: string; // the property flowing, e.g. "name -> fullName"
  adm: boolean; // is the OCF source admissible
}

/** Quote a mermaid edge label; drop any pipe so it can't break the `|...|` syntax. */
function edgeLabel(text: string): string {
  return `"${text.replace(/\|/g, "/").replace(/"/g, "'")}"`;
}

/** One `flowchart LR` for a single set of edges (already a connected group). */
function renderDiagram(edges: Edge[], sinkLabel?: string): string[] {
  const ocf = [...new Set(edges.map((e) => e.src))].sort();
  const cartaObjs = [...new Set(edges.map((e) => e.dst).filter((d) => d !== SINK))].sort();
  const adm = new Map(edges.map((e) => [e.src, e.adm]));
  const oid = new Map(ocf.map((n, i) => [n, `o${i}`]));
  const tid = new Map(cartaObjs.map((n, i) => [n, `t${i}`]));
  const usesSink = edges.some((e) => e.dst === SINK);

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
  for (const n of ocf) out.push(`    ${oid.get(n)}["${n}"]:::${adm.get(n) ? "adm" : "notadm"}`);
  out.push("  end", '  subgraph TGT["Carta target objects"]', "    direction TB");
  for (const n of cartaObjs) out.push(`    ${tid.get(n)}["${n}"]:::carta`);
  if (usesSink) out.push(`    sink["${sinkLabel}"]:::sink`);
  out.push("  end");
  for (const e of edges) {
    const tgt = e.dst === SINK ? "sink" : tid.get(e.dst);
    out.push(`  ${oid.get(e.src)} -->|${edgeLabel(e.label)}| ${tgt}`);
  }
  out.push("```");
  return out;
}

/**
 * A mermaid flow per CONNECTED GROUP: only objects that actually exchange properties
 * (directly or transitively — e.g. two OCF objects landing on a shared Carta object)
 * share a diagram. One edge PER FIELD, labelled with the property flowing (`name →
 * fullName`); OCF nodes coloured by admissibility. If
 * `opts.sink` is given, all fields with NO Carta home are collected into one final
 * `no home` diagram — the honest visual for the gap report's `no-destination` set
 * (the sink is a shared void, so it does NOT fuse those objects into one component).
 * Each group is preceded by a `**→ <Carta targets>**` label. Groups are largest-first.
 */
export function mermaidFlow(groups: EntityGroup[], opts: { sink?: string } = {}): string[] {
  // One edge PER FIELD, labelled with the property flowing (`field -> prop`).
  const edges: Edge[] = [];
  for (const g of groups) {
    for (const f of g.fields) {
      const parts = parseTargets(f.target);
      if (parts.length === 0) {
        if (opts.sink) edges.push({ src: g.entity, dst: SINK, label: f.field, adm: g.admissible });
        continue;
      }
      const byObj = new Map<string, string[]>();
      for (const { object, prop } of parts) {
        const arr = byObj.get(object) ?? [];
        if (prop) arr.push(prop);
        byObj.set(object, arr);
      }
      for (const [object, props] of byObj) {
        const label = props.length ? `${f.field} → ${props.join(" / ")}` : f.field;
        edges.push({ src: g.entity, dst: object, label, adm: g.admissible });
      }
    }
  }

  // Connected components over the REAL edges (the sink is excluded — it is a shared
  // void, not a real shared destination). Union-find on `o:<entity>` / `c:<object>`.
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    const p = parent.get(x);
    if (p === undefined || p === x) {
      parent.set(x, x);
      return x;
    }
    const root = find(p);
    parent.set(x, root);
    return root;
  };
  const union = (a: string, b: string) => parent.set(find(a), find(b));
  for (const e of edges) {
    if (e.dst === SINK) continue;
    union(`o:${e.src}`, `c:${e.dst}`);
  }
  const comps = new Map<string, Edge[]>();
  for (const e of edges) {
    if (e.dst === SINK) continue;
    const root = find(`o:${e.src}`);
    const arr = comps.get(root) ?? [];
    arr.push(e);
    comps.set(root, arr);
  }
  const cartaTargets = (es: Edge[]) => [...new Set(es.map((e) => e.dst))].sort().join(", ");
  const ordered = [...comps.values()].sort(
    (a, b) => b.length - a.length || cartaTargets(a).localeCompare(cartaTargets(b))
  );

  const out: string[] = [];
  for (const comp of ordered) {
    out.push(`**→ ${cartaTargets(comp)}**`, "");
    out.push(...renderDiagram(comp), "");
  }
  const sinkEdges = edges.filter((e) => e.dst === SINK);
  if (sinkEdges.length) {
    out.push(`**→ ${opts.sink}**`, "");
    out.push(...renderDiagram(sinkEdges, opts.sink), "");
  }
  return out;
}

/**
 * A single `flowchart LR` for a MAGNITUDE view: each OCF object → one shared void
 * node, the edge labelled with how many of its properties land there. Used for the
 * unmapped inventory, where every property has the same (non-)destination — a
 * per-field flow would be a 260-edge hairball, so this shows which objects bleed the
 * most, and the per-object tables carry the names. Empty if no group has fields.
 */
export function mermaidVoid(groups: EntityGroup[], voidLabel: string): string[] {
  const objs = groups.filter((g) => g.fields.length > 0);
  if (!objs.length) return [];
  const oid = new Map(objs.map((g, i) => [g.entity, `o${i}`]));
  const out = [
    "```mermaid",
    "flowchart LR",
    "  classDef adm fill:#e6f4ea,stroke:#34a853,color:#0b3d20;",
    "  classDef notadm fill:#f1f3f4,stroke:#9aa0a6,color:#5f6368,stroke-dasharray:4 3;",
    "  classDef sink fill:#fce8e6,stroke:#d93025,color:#5c0d06;",
    '  subgraph SRC["OCF source objects"]',
    "    direction TB",
  ];
  for (const g of objs)
    out.push(`    ${oid.get(g.entity)}["${g.entity}"]:::${g.admissible ? "adm" : "notadm"}`);
  out.push("  end", `  void["${voidLabel}"]:::sink`);
  for (const g of objs) out.push(`  ${oid.get(g.entity)} -->|${g.fields.length}| void`);
  out.push("```");
  return out;
}

// --- Hub view: per connected group, the full picture around the Core object(s). ---

/** Join names for a loss label, capping so big objects don't produce a giant edge. */
function capList(names: string[], max = 6): string {
  return names.length <= max
    ? names.join(", ")
    : `${names.slice(0, max).join(", ")} +${names.length - max} more`;
}

/**
 * Per CONNECTED GROUP (OCF objects joined to the Carta objects they map into), one
 * diagram showing the whole picture around the Core object(s):
 *   · solid green edges  — a property that FLOWS IN (`ocfField → cartaProp`);
 *   · dashed edge to `⌀ no Carta home`  — OCF properties LOST (no Carta destination);
 *   · dashed edge to `⌀ Core can't hold` — Carta properties LOST (no OCF source fills them).
 * Loss edges are aggregated one-per-object (names in the label, capped) so the flow
 * detail stays legible. `ocfLost`: OCF entity → its no-home prop names. `cartaUnfilled`:
 * Carta object → its unfilled prop names. Groups are largest-first.
 */
export function mermaidHubFlow(
  groups: EntityGroup[],
  ocfLost: Map<string, string[]>,
  cartaUnfilled: Map<string, string[]>
): string[] {
  interface FE {
    src: string;
    dst: string;
    label: string;
    adm: boolean;
  }
  const flows: FE[] = [];
  for (const g of groups) {
    for (const f of g.fields) {
      const byObj = new Map<string, string[]>();
      for (const { object, prop } of parseTargets(f.target)) {
        const a = byObj.get(object) ?? [];
        if (prop) a.push(prop);
        byObj.set(object, a);
      }
      for (const [object, props] of byObj) {
        const label = props.length ? `${f.field} → ${props.join(" / ")}` : f.field;
        flows.push({ src: g.entity, dst: object, label, adm: g.admissible });
      }
    }
  }

  const parent = new Map<string, string>();
  const find = (x: string): string => {
    const p = parent.get(x);
    if (p === undefined || p === x) {
      parent.set(x, x);
      return x;
    }
    const root = find(p);
    parent.set(x, root);
    return root;
  };
  for (const e of flows) parent.set(find(`o:${e.src}`), find(`c:${e.dst}`));
  const comps = new Map<string, FE[]>();
  for (const e of flows) {
    const root = find(`o:${e.src}`);
    const arr = comps.get(root) ?? [];
    arr.push(e);
    comps.set(root, arr);
  }
  const cartaTargets = (es: FE[]) => [...new Set(es.map((e) => e.dst))].sort().join(", ");
  const ordered = [...comps.values()].sort(
    (a, b) => b.length - a.length || cartaTargets(a).localeCompare(cartaTargets(b))
  );

  const out: string[] = [];
  for (const comp of ordered) {
    const ocfObjs = [...new Set(comp.map((e) => e.src))].sort();
    const cartaObjs = [...new Set(comp.map((e) => e.dst))].sort();
    const adm = new Map(comp.map((e) => [e.src, e.adm]));
    const oid = new Map(ocfObjs.map((n, i) => [n, `o${i}`]));
    const tid = new Map(cartaObjs.map((n, i) => [n, `t${i}`]));
    const anyOcfLost = ocfObjs.some((n) => (ocfLost.get(n) ?? []).length);
    const anyCartaLost = cartaObjs.some((n) => (cartaUnfilled.get(n) ?? []).length);

    out.push(`**→ ${cartaTargets(comp)}**`, "");
    out.push(
      "```mermaid",
      "flowchart LR",
      "  classDef adm fill:#e6f4ea,stroke:#34a853,color:#0b3d20;",
      "  classDef notadm fill:#f1f3f4,stroke:#9aa0a6,color:#5f6368,stroke-dasharray:4 3;",
      "  classDef carta fill:#e8f0fe,stroke:#1a73e8,color:#0d2b66;",
      "  classDef lost fill:#fce8e6,stroke:#d93025,color:#5c0d06;",
      '  subgraph SRC["OCF (= Core, source)"]',
      "    direction TB"
    );
    for (const n of ocfObjs)
      out.push(`    ${oid.get(n)}["${n}"]:::${adm.get(n) ? "adm" : "notadm"}`);
    out.push("  end", '  subgraph TGT["Carta"]', "    direction TB");
    for (const n of cartaObjs) out.push(`    ${tid.get(n)}["${n}"]:::carta`);
    out.push("  end");
    if (anyOcfLost) out.push(`  ocflost["⌀ OCF lost (no Carta home)"]:::lost`);
    if (anyCartaLost) out.push(`  cartalost["⌀ Carta lost (no OCF source)"]:::lost`);
    for (const e of comp)
      out.push(`  ${oid.get(e.src)} -->|${edgeLabel(e.label)}| ${tid.get(e.dst)}`);
    for (const n of ocfObjs) {
      const lost = ocfLost.get(n) ?? [];
      if (lost.length) out.push(`  ${oid.get(n)} -.->|${edgeLabel(capList(lost))}| ocflost`);
    }
    for (const n of cartaObjs) {
      const unfilled = cartaUnfilled.get(n) ?? [];
      if (unfilled.length)
        out.push(`  ${tid.get(n)} -.->|${edgeLabel(capList(unfilled))}| cartalost`);
    }
    out.push("```", "");
  }
  return out;
}
