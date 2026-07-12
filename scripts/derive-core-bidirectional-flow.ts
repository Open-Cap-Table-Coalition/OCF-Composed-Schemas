#!/usr/bin/env node
/**
 * OCF Core — bidirectional coverage (a discussion artifact — NOT gated).
 *
 * Treats OCF Core (the RICH profile — the relaxed-OCF union both formats populate)
 * as the interop HUB and asks, from each side, what flows IN and what is LEFT BEHIND:
 *
 *   OCF → Core   : an OCF property flows in if it is a Core member (mapped, even
 *                  lossily); it is left behind if it has no Carta home (`no-destination`).
 *                  Split three ways: clean (core), lossy (existence-loss/heuristic), dropped.
 *   Carta → Core : Core is OCF-shaped, so a Carta field flows in iff some green mapping
 *                  targets it (a Carta doc can populate that Core slot via the reverse
 *                  edge); a Carta field is left behind if no mapping ever targets it —
 *                  Carta richness Core (being OCF-shaped) can't hold.
 *
 * One `deriveCore` call; the Carta side uses the corpus's property-level
 * `targetedPointers`. Read-only; writes docs/core-bidirectional-flow.md.
 *
 *   npm run core:bidi
 */
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { deriveCore, isMember, RICH_PROFILE } from "./lib/core-pipeline.js";
import { isPlainObject } from "./lib/mapping-validator.js";
import { BOOKKEEPING, buildTargetIndex } from "./lib/report-helpers.js";
import {
  EntityGroup,
  FlowRow,
  flavorLabel,
  groupByVariant,
  mermaidHubFlow,
} from "./lib/report-flow.js";

const OUT_FILE = "docs/core-bidirectional-flow.md";

/** A Carta `$def` is an object type if it has >1 property, or 1 that isn't a scalar `value`. */
function isObjectType(def: unknown): boolean {
  if (!isPlainObject(def) || !isPlainObject(def.properties)) return false;
  const keys = Object.keys(def.properties as Record<string, unknown>);
  return keys.length > 1 || (keys.length === 1 && keys[0] !== "value");
}

export async function writeBidiDoc(base: string = process.cwd()): Promise<number> {
  const d = await deriveCore(process.cwd(), RICH_PROFILE);

  // --- OCF → Core: per object, clean / lossy / dropped (distinct fields). ---
  interface OcfObj {
    clean: Set<string>;
    lossy: Set<string>;
    dropped: Set<string>;
    admissible: boolean;
  }
  const admBy = new Map(d.admissibility.map((a) => [`${a.entity} ${a.variant}`, a]));
  const ocf = new Map<string, OcfObj>();
  for (const r of d.rows) {
    if (BOOKKEEPING.has(r.field)) continue;
    const o = ocf.get(r.entity) ?? {
      clean: new Set(),
      lossy: new Set(),
      dropped: new Set(),
      admissible: false,
    };
    if (admBy.get(`${r.entity} ${r.variant}`)?.admissible) o.admissible = true;
    if (r.verdict.class === "core") o.clean.add(r.field);
    else if (isMember(r.verdict, RICH_PROFILE)) o.lossy.add(r.field);
    else if (r.verdict.reason === "no-destination") o.dropped.add(r.field);
    ocf.set(r.entity, o);
  }
  // A field can be core in one variant and out in another; count it by its "best" landing.
  for (const o of ocf.values()) {
    for (const f of o.clean) {
      o.lossy.delete(f);
      o.dropped.delete(f);
    }
    for (const f of o.lossy) o.dropped.delete(f);
  }

  // --- Carta → Core: which Carta object properties are targeted by a green mapping. ---
  const targetedSlots = new Set<string>(); // "#/$defs/Obj/properties/prop"
  const targetedRoots = new Set<string>(); // objects hit only at the root (primary_targets)
  for (const ptr of d.corpus.targetedPointers) {
    const slot = /^(#\/\$defs\/[^/]+\/properties\/[^/]+)/.exec(ptr);
    if (slot) targetedSlots.add(slot[1] as string);
    else {
      const root = /^#\/\$defs\/([^/]+)$/.exec(ptr);
      if (root) targetedRoots.add(root[1] as string);
    }
  }
  const cartaDefs = (d.corpus.bundle as { $defs?: Record<string, unknown> }).$defs ?? {};
  interface CartaObj {
    filled: string[];
    empty: string[];
  }
  const carta = new Map<string, CartaObj>();
  const untargetedNames: string[] = [];
  for (const [name, def] of Object.entries(cartaDefs)) {
    if (!isObjectType(def)) continue;
    const props = Object.keys((def as { properties: Record<string, unknown> }).properties);
    const filled = props.filter((p) => targetedSlots.has(`#/$defs/${name}/properties/${p}`));
    const empty = props.filter((p) => !targetedSlots.has(`#/$defs/${name}/properties/${p}`));
    if (filled.length === 0 && !targetedRoots.has(name)) {
      untargetedNames.push(name); // no field-level mapping targets it — see gap report (b)
      continue;
    }
    carta.set(name, { filled, empty });
  }
  // Some untargeted $defs are $ref-reachable from a TARGETED parent, so OCF data still
  // flows into them via that parent (e.g. the `…VestingEvent` / `…PrecededBy` element
  // types) — those are NOT "whole concepts OCF lacks". Split the count so the prose
  // doesn't overstate the OCF-less set.
  const untargetedObjectCount = untargetedNames.length;
  const untargetedReachable = untargetedNames.filter((n) =>
    d.corpus.transitivelyCoveredDefs.has(n)
  ).length;

  // Member (flow-in) fields with their Carta targets, plus the per-object loss
  // lists, for the grouped hub diagrams.
  const targetOf = buildTargetIndex(d.corpus.objects);
  const memberRows: FlowRow[] = [];
  for (const r of d.rows) {
    if (BOOKKEEPING.has(r.field) || !isMember(r.verdict, RICH_PROFILE)) continue;
    memberRows.push({
      entity: r.entity,
      variant: r.variant,
      field: r.field,
      reason: r.verdict.reason ?? "",
      detail: r.verdict.detail ?? "",
      target: targetOf.get(`${r.entity} ${r.variant} ${r.field}`) ?? "—",
      ocfRequired: false,
      admissible: admBy.get(`${r.entity} ${r.variant}`)?.admissible ?? false,
    });
  }
  const memberGroups = groupByVariant(memberRows);
  // ocfLost keyed by FLAVOR — the hub diagram now splits polymorphic flavors into
  // separate OCF nodes, so its dashed "no Carta home" loss edge is computed per
  // (entity, variant) rather than collapsed per entity.
  const ocfLost = new Map<string, string[]>();
  for (const r of d.rows) {
    if (BOOKKEEPING.has(r.field) || r.verdict.reason !== "no-destination") continue;
    const key = flavorLabel(r.entity, r.variant);
    const arr = ocfLost.get(key) ?? [];
    if (!arr.includes(r.field)) arr.push(r.field);
    ocfLost.set(key, arr);
  }
  for (const arr of ocfLost.values()) arr.sort();
  const cartaUnfilled = new Map<string, string[]>(
    [...carta].map(([n, c]) => [n, c.empty] as [string, string[]])
  );

  // Composite const fills, keyed by flavor: the Carta slots a step populates with a
  // fixed value (the *_TRANSFERRED reason codes). Drawn as `⊙` edges so the diagram
  // shows the reason we know implicitly, rather than reading it as "no OCF source".
  const constFills = new Map<string, { dst: string; label: string }[]>();
  for (const o of d.corpus.objects) {
    for (const [family, fills] of Object.entries(o.constFills)) {
      const flavor = flavorLabel(o.entity, family);
      const arr = constFills.get(flavor) ?? [];
      for (const f of fills) arr.push({ dst: f.object, label: `${f.prop}=${f.value}` });
      constFills.set(flavor, arr);
    }
  }

  await writeFile(
    path.join(base, OUT_FILE),
    render(
      ocf,
      carta,
      untargetedObjectCount,
      untargetedReachable,
      memberGroups,
      ocfLost,
      cartaUnfilled,
      constFills
    ),
    "utf8"
  );

  const ocfClean = sum([...ocf.values()].map((o) => o.clean.size));
  const ocfLossy = sum([...ocf.values()].map((o) => o.lossy.size));
  const ocfDropped = sum([...ocf.values()].map((o) => o.dropped.size));
  const cartaFilled = sum([...carta.values()].map((c) => c.filled.length));
  const cartaEmpty = sum([...carta.values()].map((c) => c.empty.length));
  console.log("OCF Core — bidirectional coverage (rich hub)");
  console.log("=".repeat(60));
  console.log(`OCF → Core : ${ocfClean} clean + ${ocfLossy} lossy IN · ${ocfDropped} left behind`);
  console.log(
    `Carta → Core : ${cartaFilled} fields IN · ${cartaEmpty} left behind (+ ${untargetedObjectCount} untargeted Carta objects)`
  );
  console.log(`\nWritten to ${OUT_FILE}`);
  return 0;
}

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

function render(
  ocf: Map<
    string,
    { clean: Set<string>; lossy: Set<string>; dropped: Set<string>; admissible: boolean }
  >,
  carta: Map<string, { filled: string[]; empty: string[] }>,
  untargetedObjects: number,
  untargetedReachable: number,
  memberGroups: EntityGroup[],
  ocfLost: Map<string, string[]>,
  cartaUnfilled: Map<string, string[]>,
  constFills: Map<string, { dst: string; label: string }[]>
): string {
  const ocfClean = sum([...ocf.values()].map((o) => o.clean.size));
  const ocfLossy = sum([...ocf.values()].map((o) => o.lossy.size));
  const ocfDropped = sum([...ocf.values()].map((o) => o.dropped.size));
  const cartaFilled = sum([...carta.values()].map((c) => c.filled.length));
  const cartaEmpty = sum([...carta.values()].map((c) => c.empty.length));

  const lines: string[] = [
    "# OCF Core — bidirectional coverage (generated, discussion artifact)",
    "",
    "GENERATED by `npm run core:bidi`. NOT drift-gated — an analysis input, not a contract.",
    "",
    "**OCF Core (rich)** is the interop hub. Both formats feed it: OCF *projects* into Core",
    "(Core is OCF-shaped), and Carta *populates* Core via the reverse of each mapping edge. This",
    "shows, from each side, what flows IN and what is LEFT BEHIND.",
    "",
    "## Overview",
    "",
    "```mermaid",
    "flowchart LR",
    "  classDef core fill:#fff4d6,stroke:#f9a825,color:#5c4400;",
    "  classDef in fill:#e6f4ea,stroke:#34a853,color:#0b3d20;",
    "  classDef out fill:#fce8e6,stroke:#d93025,color:#5c0d06;",
    `  OCF["OCF"]:::in -->|"${ocfClean} clean + ${ocfLossy} lossy"| CORE`,
    `  OCF -.->|"${ocfDropped} left behind"| ocfvoid["⌀ dropped (no Carta home)"]:::out`,
    '  CORE["OCF Core (rich)"]:::core',
    `  Carta["Carta"]:::in -->|"${cartaFilled} fields"| CORE`,
    `  Carta -.->|"${cartaEmpty} left behind"| cartavoid["⌀ Core can't hold"]:::out`,
    "```",
    "",
    "- **OCF → Core**: a property flows in if it is a Core member (mapped, even lossily); it is",
    "  left behind only if it has **no Carta home** (`no-destination`).",
    "- **Carta → Core**: a Carta field flows in if some mapping targets it (a Carta doc can fill",
    `  that Core slot); left behind = a Carta field no mapping targets. Plus **${untargetedObjects}**`,
    "  object-typed Carta `$defs` get no field-level mapping — of these, " +
      `**${untargetedReachable}** are \`$ref\`-reachable from a targeted parent (OCF data flows in`,
    "  via the parent, e.g. the `…VestingEvent` / `…PrecededBy` element types), leaving " +
      `**${untargetedObjects - untargetedReachable}** untouched: mostly concepts OCF lacks (rollup`,
    "  summaries, phantom/PIU families) plus a few shared value-types (`Date`, `Jurisdiction`).",
    "  See gap report b.",
    "",
    "## Hub flow — per related group (what flows in vs is lost, both sides)",
    "",
    "One diagram per OCF object — each polymorphic flavor (`Object [Variant]`) fully separate — with",
    "the Carta objects it maps into. **Solid** edges = a property that FLOWS IN",
    "(`OCF field → Carta prop`). **`⊙`** edges = a Carta slot the composite fills with a FIXED value",
    "(the `*_TRANSFERRED` reason codes) — known implicitly, not from an OCF field. **Dashed** edges to",
    "a red void = properties LOST: OCF fields with no Carta home, and Carta fields no OCF source fills.",
    "Loss lists are capped per object (full names in the tables below); OCF nodes are green (in Core) /",
    "dashed grey (not admissible).",
    "",
    ...mermaidHubFlow(memberGroups, ocfLost, cartaUnfilled, constFills),
    "## OCF → Core — per object (fields; clean = direct/coarsen, lossy = has a home but narrows, left behind = no home)",
    "",
    "See `core-lossy-inventory.md` / `core-unmapped-inventory.md` for the property names. Counts here",
    "are DISTINCT fields per object (variants collapsed; a field that lands in any variant is not",
    '"left behind"), so totals run lower than those inventories\' per-(entity,variant,field) row counts.',
    "",
    "| OCF object | in Core | clean | lossy | left behind |",
    "| --- | :---: | ---: | ---: | ---: |",
  ];
  for (const [entity, o] of [...ocf.entries()].sort(
    (a, b) =>
      b[1].lossy.size + b[1].dropped.size - (a[1].lossy.size + a[1].dropped.size) ||
      a[0].localeCompare(b[0])
  )) {
    lines.push(
      `| ${entity} | ${o.admissible ? "✓" : "✗"} | ${o.clean.size} | ${o.lossy.size} | ${
        o.dropped.size
      } |`
    );
  }

  lines.push(
    "",
    "## Carta → Core — per object (which Carta fields OCF fills vs leaves empty)",
    "",
    "Only Carta objects a green mapping writes into. `filled` = a Core slot a Carta doc can",
    "populate; `left behind` = Carta capability Core (being OCF-shaped) doesn't represent.",
    "",
    "Caveat: `left behind` is slot-level. Carta denormalizes issuance-time attributes across a",
    "security object and its issuance transaction (`OptionGrant`↔`OptionIssuanceTransaction`,",
    "`Certificate`↔`CertificateIssuanceTransaction`, the RSA/RSU pairs); a mapping fills one twin,",
    "so the other reads `left behind` even though the same OCF value already populates its sibling.",
    "Those duplicated slots inflate the count — they are not capability Core lacks.",
    "",
    "| Carta object | fills | left behind | left-behind fields |",
    "| --- | ---: | ---: | --- |"
  );
  for (const [name, c] of [...carta.entries()].sort(
    (a, b) => b[1].empty.length - a[1].empty.length || a[0].localeCompare(b[0])
  )) {
    const left = c.empty.length ? c.empty.join(", ") : "—";
    lines.push(`| ${name} | ${c.filled.length} | ${c.empty.length} | ${left} |`);
  }
  lines.push("");
  return lines.join("\n") + "\n";
}

// Run as a CLI only when invoked directly (not when imported by core:build).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeBidiDoc().then(
    (code) => process.exit(code),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}
