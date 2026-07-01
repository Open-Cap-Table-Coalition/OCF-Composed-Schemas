#!/usr/bin/env node
/**
 * OCF Core — lossy-home inventory (step 1, a discussion artifact — NOT gated).
 *
 * Re-cuts the SAME derived ledger the build produces (one `deriveCore` call; no
 * re-load, no re-classify) into the distinction that matters for a rich Core —
 * LOSSY HOME (the field HAS a Carta target but the fold loses fidelity:
 * `existence-loss` structure/array→scalar, or `heuristic` combine/split/computed)
 * vs NO HOME (`no-destination`, Carta has no field at all) — and presents the flow:
 *
 *   A. Lossy home GROUPED BY OCF OBJECT, each field showing where it flows in Carta.
 *   B. Flow map — the inverse: one entry per Carta slot, listing every OCF property
 *      that lands on it, so convergence (many→one reverse edges) is obvious.
 *   C. No home, grouped by object, for contrast (also in core-gaps.md).
 *
 * OCF bookkeeping (id/object_type/comments) is excluded. Fields are annotated with
 * the OCF-required flag and the entity's current §3 admissibility; variants that map
 * identically are collapsed to one row.
 *
 *   npm run core:lossy            # write docs/core-lossy-inventory.md + print summary
 */
import path from "node:path";
import { writeFile } from "node:fs/promises";

import { deriveCore, RICH_PROFILE } from "./lib/core-pipeline.js";
import { BOOKKEEPING, buildTargetIndex } from "./lib/report-helpers.js";

const OUT_FILE = "docs/core-lossy-inventory.md";
// "Lossy home" = the reasons the rich profile promotes to members (single source
// of truth: RICH_PROFILE.memberReasons); "no home" (no-destination) is separate.
const LOSSY_HOME = RICH_PROFILE.memberReasons;

interface InvRow {
  entity: string;
  variant: string;
  field: string;
  reason: string;
  detail: string;
  target: string;
  ocfRequired: boolean;
  admissible: boolean;
}

async function main(): Promise<number> {
  const d = await deriveCore(process.cwd());
  const admBy = new Map(d.admissibility.map((a) => [`${a.entity} ${a.variant}`, a]));
  const reqBy = new Map(d.corpus.objects.map((o) => [o.entity, new Set(o.requiredFields)]));

  // Join each classified row to the Carta target the mapping actually names.
  const targetOf = buildTargetIndex(d.corpus.objects);

  const lossy: InvRow[] = [];
  const nohome: InvRow[] = [];
  for (const r of d.rows) {
    if (r.verdict.class !== "out" || BOOKKEEPING.has(r.field)) continue;
    const reason = r.verdict.reason;
    if (reason === undefined) continue;
    const row: InvRow = {
      entity: r.entity,
      variant: r.variant,
      field: r.field,
      reason,
      detail: r.verdict.detail ?? "",
      target: targetOf.get(`${r.entity} ${r.variant} ${r.field}`) ?? "—",
      ocfRequired: reqBy.get(r.entity)?.has(r.field) ?? false,
      admissible: admBy.get(`${r.entity} ${r.variant}`)?.admissible ?? false,
    };
    if (LOSSY_HOME.has(reason)) lossy.push(row);
    else if (reason === "no-destination") nohome.push(row);
  }

  const cmp = (a: InvRow, b: InvRow) =>
    a.entity.localeCompare(b.entity) ||
    a.field.localeCompare(b.field) ||
    a.variant.localeCompare(b.variant);
  lossy.sort(cmp);
  nohome.sort(cmp);

  await writeFile(path.join(process.cwd(), OUT_FILE), render(lossy, nohome), "utf8");

  const reqLossy = lossy.filter((r) => r.ocfRequired).length;
  const onAdmissible = new Set(lossy.filter((r) => r.admissible).map((r) => r.entity)).size;
  console.log("OCF Core — lossy-home inventory");
  console.log("=".repeat(60));
  console.log(`A. lossy home (has a target, loses fidelity): ${lossy.length} rows`);
  console.log(`   · ${reqLossy} are OCF-REQUIRED fields`);
  console.log(`   · touching ${onAdmissible} currently-admissible entit(y/ies)`);
  console.log(`B. no home (no Carta target): ${nohome.length} rows`);
  console.log(`\nWritten to ${OUT_FILE}`);
  return 0;
}

// --- Flow parsing: turn a Carta target pointer into legible object.property. ---

/** `#/$defs/ShareClass/properties/seniority` → { object: "ShareClass", prop: "seniority" }. */
function parsePointer(ptr: string): { object: string; prop: string } | null {
  const m = /#\/\$defs\/([^/]+)(?:\/properties\/(.+))?$/.exec(ptr.trim());
  if (!m) return null;
  const prop = (m[2] ?? "").replace(/\/properties\//g, ".").replace(/\/items(?=\/|$)/g, "[]");
  return { object: m[1] as string, prop };
}

/** Every Carta slot a target flows to (a split target names several). */
function parseTargets(target: string): { object: string; prop: string }[] {
  if (!target || target === "—") return [];
  return target
    .split(" + ")
    .map(parsePointer)
    .filter((x): x is { object: string; prop: string } => !!x);
}

/** A target as `Obj.prop` / `Obj.{p1, p2}` (grouped per Carta object), for the flow column. */
function flowString(target: string): string {
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
function lossLabel(reason: string, detail: string): string {
  const d = detail.replace(/^kind /, "").trim();
  return d ? `${reason} (${d})` : reason;
}

// --- Grouping: one field-row per (field, target, loss), variants merged. ---

interface FieldRow {
  field: string;
  ocfRequired: boolean;
  variants: string[];
  target: string;
  reason: string;
  detail: string;
}

function groupByEntity(
  rows: InvRow[]
): { entity: string; admissible: boolean; fields: FieldRow[] }[] {
  const byEntity = new Map<string, InvRow[]>();
  for (const r of rows) {
    const arr = byEntity.get(r.entity) ?? [];
    arr.push(r);
    byEntity.set(r.entity, arr);
  }
  const out: { entity: string; admissible: boolean; fields: FieldRow[] }[] = [];
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

function render(lossy: InvRow[], nohome: InvRow[]): string {
  const groupedLossy = groupByEntity(lossy);
  const reqCount = lossy.filter((r) => r.ocfRequired).length;
  const lines: string[] = [
    "# OCF Core — lossy-home inventory (generated, discussion artifact)",
    "",
    "GENERATED by `npm run core:lossy` from the same derived ledger as the build.",
    "NOT drift-gated — this is an analysis input for the rich-Core work, not a contract.",
    "",
    "Fields that today fall **out** of Core, split by whether Carta offers a home at all.",
    "`OCF-req` marks fields OCF itself requires — a lossy home on a required field is the",
    "strongest rich-Core / upstream-OCF signal.",
    "",
    "**A** groups the lossy-home fields by their OCF object and shows where each one flows",
    "in Carta; **B** flips that around — one entry per Carta slot, listing every OCF property",
    "that lands on it (so convergence is obvious); **C** is the no-home set for contrast.",
    "",
    `## A. Lossy home — by OCF object, flowing to Carta (${lossy.length} (entity,variant,field) rows across ${groupedLossy.length} objects; ${reqCount} OCF-required)`,
    "",
    "Each field HAS a Carta home but the fold loses fidelity: `existence-loss` = the shape",
    "collapses (object/array → scalar); `heuristic` = a non-1:1 transform (combine/split/computed).",
    "A field mapping the same way across variants is shown once, the variants listed.",
    "",
  ];

  for (const g of groupedLossy) {
    lines.push(`### ${g.entity} — ${g.admissible ? "in Core (admissible)" : "not yet admissible"}`);
    lines.push(
      "",
      "| field | OCF-req | variant(s) | flows to (Carta) | loss |",
      "| --- | :---: | --- | --- | --- |"
    );
    for (const f of g.fields) {
      lines.push(
        `| ${f.field} | ${f.ocfRequired ? "**yes**" : ""} | ${f.variants.join(", ")} | ${flowString(
          f.target
        )} | ${lossLabel(f.reason, f.detail)} |`
      );
    }
    lines.push("");
  }

  // --- B. Flow map: one entry per Carta slot, its OCF sources (convergence first). ---
  const slots = new Map<string, string[]>();
  for (const g of groupedLossy) {
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
  const slotList = [...slots.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
  );
  lines.push(
    `## B. Flow map — Carta slot ← OCF sources (${slotList.length} slots)`,
    "",
    "Sorted by fan-in. Slots with several sources are where distinct OCF properties **converge**",
    "onto one Carta field — most visibly the reverse-edge lineage collapsing onto `…PrecededBy.securities`.",
    ""
  );
  for (const [slot, srcs] of slotList) {
    lines.push(`- \`${slot}\` ← ${srcs.length}: ${srcs.map((s) => `\`${s}\``).join(", ")}`);
  }
  lines.push("");

  // --- C. No home — grouped by object, compact. ---
  const noHomeByEntity = groupByEntity(nohome);
  lines.push(
    `## C. No home — no Carta target at all (${nohome.length} across ${noHomeByEntity.length} objects)`,
    "",
    "A different animal: Carta has no field to hold these (also in core-gaps.md §a). NOT what",
    "rich-Core recovers — listed for contrast.",
    ""
  );
  for (const g of noHomeByEntity) {
    const fields = g.fields.map((f) => (f.ocfRequired ? `**${f.field}**` : f.field)).join(", ");
    lines.push(`- **${g.entity}**${g.admissible ? "" : " *(not yet admissible)*"} — ${fields}`);
  }
  lines.push("");

  return lines.join("\n") + "\n";
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
