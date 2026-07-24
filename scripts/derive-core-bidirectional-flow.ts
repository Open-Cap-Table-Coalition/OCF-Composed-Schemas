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
 * One `deriveCore` call; the Carta side uses the shared inverse-coverage
 * ledger. Read-only; writes docs/core-bidirectional-flow.md.
 *
 *   npm run core:bidi
 */
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { deriveCore, Derived, isMember, RICH_PROFILE } from "./lib/core-pipeline.js";
import { BOOKKEEPING, buildTargetIndex } from "./lib/report-helpers.js";
import {
  buildInverseCoverage,
  inverseCoverageStory,
  InverseExcludedRoleRow,
  InverseCoverageLedger,
} from "./lib/inverse-coverage.js";
import {
  EntityGroup,
  FlowRow,
  flavorLabel,
  groupByVariant,
  mermaidHubFlow,
} from "./lib/report-flow.js";

const OUT_FILE = "docs/core-bidirectional-flow.md";

/** Pure render of docs/core-bidirectional-flow.md from a (rich) derivation — shared by build + check. */
export function renderBidiDoc(d: Derived): string {
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

  // --- Carta → Core: shared inverse ledger (slots, reusable types, and defs). ---
  const inverse = buildInverseCoverage(d.corpus);
  interface CartaObj {
    direct: string[];
    typeOnly: string[];
    implicit: string[];
    deferred: string[];
    empty: string[];
  }
  const carta = new Map<string, CartaObj>();
  for (const def of inverse.defs) {
    const defSlots = inverse.slots.filter((slot) => slot.def === def.name);
    const direct = defSlots.filter((slot) => slot.status === "direct").map((slot) => slot.property);
    const typeOnly = defSlots
      .filter((slot) => slot.status === "type-only")
      .map((slot) => slot.property);
    const implicit = defSlots
      .filter((slot) => slot.status === "implicit")
      .map((slot) => slot.property);
    const deferred = defSlots
      .filter((slot) => slot.status === "deferred")
      .map((slot) => slot.property);
    const empty = defSlots.filter((slot) => slot.status === "empty").map((slot) => slot.property);
    if (direct.length || typeOnly.length || implicit.length || deferred.length || def.directRoot) {
      carta.set(def.name, { direct, typeOnly, implicit, deferred, empty });
    }
  }
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

  return render(
    ocf,
    carta,
    inverse,
    inverse.excludedRoleRows,
    memberGroups,
    ocfLost,
    cartaUnfilled,
    constFills
  );
}

/** Derive (rich profile) and write docs/core-bidirectional-flow.md. */
export async function writeBidiDoc(base: string = process.cwd()): Promise<number> {
  const d = await deriveCore(process.cwd(), RICH_PROFILE);
  await writeFile(path.join(base, OUT_FILE), renderBidiDoc(d), "utf8");
  console.log(`Written to ${OUT_FILE}`);
  return 0;
}

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

function renderInverseCoverageStory(
  inverse: InverseCoverageLedger,
  excludedDefinitions: InverseExcludedRoleRow[]
): string[] {
  const story = inverseCoverageStory(inverse);
  const counts = inverse.metrics.definitionRoleCounts;
  return [
    "### CARTA inverse coverage: the simple story",
    "",
    `1. Carta defines **${story.totalDefs}** total definitions.`,
    `2. **${story.objectDefs}** of them are object-shaped.`,
    `3. Of those **${story.objectDefs}**, **${story.nonEntityObjectDefs}** are support definitions, not standalone objects (**${counts["nested-obj"]}** nested objects + **${counts["value-type"]}** object-shaped value type).`,
    `4. That leaves **${story.standaloneCandidateDefs}** standalone mapping candidates.`,
    `5. Separately, **${story.scalarValueTypeDefs}** scalar support types are also excluded; they are outside the **${story.objectDefs}** object-shaped definitions.`,
    `6. Total support definitions excluded: **${story.nonEntityDefs}**.`,
    `7. We have mapping evidence for **${story.mappedDefs}**: **${story.fullyMappedDefs}** fully mapped and **${story.partiallyMappedDefs}** partially mapped.`,
    `8. **${story.unmappedCandidateDefs}** standalone candidates have no mapping evidence yet; their inventory role tells us whether that is expected or actionable.`,
    "",
    `**Checks:** ${story.standaloneCandidateDefs} = ${story.mappedDefs} + ${story.unmappedCandidateDefs}; ${story.objectDefs} = ${story.standaloneCandidateDefs} + ${story.nonEntityObjectDefs}.`,
    "",
    `### Supporting CARTA definitions excluded from standalone mapping targets (${excludedDefinitions.length})`,
    "",
    `${
      excludedDefinitions.filter((row) => row.role === "nested-obj").length
    } nested object definitions and ${
      excludedDefinitions.filter((row) => row.role === "value-type").length
    } curated value types are intentionally not standalone targets.`,
    `${story.scalarValueTypeDefs} scalar wrappers are outside the object-like definition denominator; ${counts["value-type"]} value-type definition is object-like.`,
    "These definitions are packaging/support types, not standalone mapping targets; their mapping/type evidence remains valid.",
    "The parent column names the immediate parent(s); the reason says whether mapped-parent coverage is established.",
    "",
  ];
}

function render(
  ocf: Map<
    string,
    { clean: Set<string>; lossy: Set<string>; dropped: Set<string>; admissible: boolean }
  >,
  carta: Map<
    string,
    {
      direct: string[];
      typeOnly: string[];
      implicit: string[];
      deferred: string[];
      empty: string[];
    }
  >,
  inverse: InverseCoverageLedger,
  excludedDefinitions: InverseExcludedRoleRow[],
  memberGroups: EntityGroup[],
  ocfLost: Map<string, string[]>,
  cartaUnfilled: Map<string, string[]>,
  constFills: Map<string, { dst: string; label: string }[]>
): string {
  const ocfClean = sum([...ocf.values()].map((o) => o.clean.size));
  const ocfLossy = sum([...ocf.values()].map((o) => o.lossy.size));
  const ocfDropped = sum([...ocf.values()].map((o) => o.dropped.size));
  const cartaDirect = sum([...carta.values()].map((c) => c.direct.length));
  const cartaTypeOnly = sum([...carta.values()].map((c) => c.typeOnly.length));
  const cartaImplicit = sum([...carta.values()].map((c) => c.implicit.length));
  const cartaDeferred = sum([...carta.values()].map((c) => c.deferred.length));
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
    "  classDef defer fill:#fff8e1,stroke:#f9a825,color:#5c4400,stroke-dasharray:4 3;",
    `  OCF["OCF"]:::in -->|"${ocfClean} clean + ${ocfLossy} lossy"| CORE`,
    `  OCF -.->|"${ocfDropped} left behind"| ocfvoid["⌀ dropped (no Carta home)"]:::out`,
    '  CORE["OCF Core (rich)"]:::core',
    `  Carta["Carta"]:::in -->|"${cartaDirect} direct + ${cartaTypeOnly} type-only + ${cartaImplicit} implicit"| CORE`,
    ...(cartaDeferred
      ? [
          `  Carta -.->|"${cartaDeferred} deferred"| deferbox["⏳ deferred (OCF has it, extraction TODO)"]:::defer`,
        ]
      : []),
    `  Carta -.->|"${cartaEmpty} left behind"| cartavoid["⌀ Core can't hold"]:::out`,
    "```",
    "",
    "- **OCF → Core**: a property flows in if it is a Core member (mapped, even lossily); it is",
    "  left behind only if it has **no Carta home** (`no-destination`).",
    "- **Carta → Core**: direct slots are populated by executable object/composite mappings;",
    "  type-only slots are reusable correspondences whose concrete object context is supplied",
    "  separately; implicit slots come from deterministic constants. Empty slots are reported",
    "  separately from unmapped `$defs` so root shape, nested coverage, and semantic type coverage",
    "  are not conflated. Curated value-type roles (for example, date/datetime wrappers) remain",
    "  available for type correspondences but are not treated as standalone inverse entities.",
    "",
    "## Inverse metrics",
    "",
    "These counts are mutually descriptive dimensions of the same ledger, not a single loss total.",
    "",
    "| Carta-side dimension | count |",
    "| --- | ---: |",
    `| Carta \`$defs\` total | ${inverse.metrics.totalDefs} |`,
    `| object-like Carta \`$defs\` | ${inverse.metrics.objectDefs} |`,
    `| Carta object slots | ${inverse.metrics.objectSlots} |`,
    `| defs with direct executable coverage | ${inverse.metrics.directDefs} |`,
    `| direct executable slots | ${inverse.metrics.directSlots} |`,
    `| defs with type-only slots | ${inverse.metrics.typeOnlyDefs} |`,
    `| defs with only type-only coverage | ${inverse.metrics.typeOnlyOnlyDefs} |`,
    `| type-only slots | ${inverse.metrics.typeOnlySlots} |`,
    `| implicit constant slots | ${inverse.metrics.implicitSlots} |`,
    `| deferred slots | ${inverse.metrics.deferredSlots} |`,
    `| nested object defs | ${inverse.metrics.nestedObjDefs} |`,
    `| expected report roll-ups | ${inverse.metrics.reportRollupDefs} |`,
    `| curated value-type policy entries | ${inverse.metrics.curatedValueTypeEntries} |`,
    `| object-like value-type/non-target defs | ${inverse.metrics.valueTypeDefs} |`,
    `| alternate/unreachable shapes | ${inverse.metrics.alternateDefs} |`,
    `| vendor-only family candidates | ${inverse.metrics.vendorFamilyDefs} |`,
    `| workflow/data-shape gap candidates | ${inverse.metrics.workflowGapDefs} |`,
    `| actionable inverse gap candidates | ${inverse.metrics.actionableGapDefs} |`,
    `| unresolved role-review candidates | ${inverse.metrics.reviewDefs} |`,
    "",
    ...renderInverseCoverageStory(inverse, excludedDefinitions),
    "| role | Carta `$def` | covered through | reason |",
    "| --- | --- | --- | --- |",
    ...excludedDefinitions.map(
      (row) => `| ${row.role} | \`#/$defs/${row.name}\` | ${row.coveredThrough} | ${row.reason} |`
    ),
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
    "Only Carta objects with direct, reusable, implicit, or deferred evidence are listed here.",
    "`direct` = executable object/composite edge; `type-only` = reusable type correspondence;",
    "`implicit` = fixed deterministic value; `left behind` = an empty slot on this Carta object.",
    "",
    "Caveat: `left behind` is slot-level. Carta denormalizes issuance-time attributes across a",
    "security object and its issuance transaction (`OptionGrant`↔`OptionIssuanceTransaction`,",
    "`Certificate`↔`CertificateIssuanceTransaction`, the RSA/RSU pairs); a mapping fills one twin,",
    "so the other reads `left behind` even though the same OCF value already populates its sibling.",
    "Those duplicated slots inflate the count — they are not capability Core lacks.",
    "",
    "`deferred` = a slot a field's `defer:` placeholder claims: OCF *has* the data, the nested",
    "extraction just isn't built yet (see the ledger's Deferred mappings). Not counted as left behind.",
    "",
    "| Carta object | direct | type-only | implicit | deferred | left behind | left-behind fields |",
    "| --- | ---: | ---: | ---: | ---: | ---: | --- |"
  );
  for (const [name, c] of [...carta.entries()].sort(
    (a, b) =>
      b[1].empty.length - a[1].empty.length ||
      b[1].deferred.length - a[1].deferred.length ||
      a[0].localeCompare(b[0])
  )) {
    const left = c.empty.length ? c.empty.join(", ") : "—";
    lines.push(
      `| ${name} | ${c.direct.length} | ${c.typeOnly.length} | ${c.implicit.length} | ${c.deferred.length} | ${c.empty.length} | ${left} |`
    );
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
