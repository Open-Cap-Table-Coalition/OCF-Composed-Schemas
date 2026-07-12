/**
 * OCF Core — the derive pipeline, end to end.
 *
 * One function that both the build (scripts/derive-core-build) and the CI check
 * (scripts/derive-core-check) call, so they can never disagree on what Core is:
 *   load green corpus → classify every field (§2) → admissibility (§3) →
 *   collapse variants into OCF entities → emit the Core package (§4).
 */
import { isPlainObject } from "./mapping-validator.js";
import {
  Corpus,
  loadGreenCorpus,
  loadOcfFileCategories,
  loadReferenceGraph,
  OcfPackaging,
} from "./core-corpus.js";
import { classifyField, ClassifyCtx, OutReason, Verdict } from "./core-classifier.js";
import { Admissibility, computeAdmissibility } from "./core-admissibility.js";
import { CoreEntity, emitCorePackage } from "./core-schema-emitter.js";

/**
 * A Core is a READING of the one derived ledger — which loss classes still count
 * a field as a member. Both profiles share every earlier stage (corpus, classify,
 * even the emitter); they diverge only in this predicate and where they are written.
 *
 *   strict — the lossless intersection: only `core`-class fields (direct / widening
 *            / value-coarsening). Everything is faithfully Carta-expressible. This
 *            is the original Core; its output (core/) must stay byte-identical.
 *   rich   — the relaxed-OCF union: strict PLUS the lossy-home classes
 *            (`existence-loss` / `heuristic` / `partial`). The field is kept in
 *            OCF's own shape (renderNode already inlines it); the target narrows it
 *            on the way out. Core→target — and possibly Core→OCF — is thus lossy.
 */
export interface CoreProfile {
  name: "strict" | "rich";
  /** Directory the package + reports are written to / checked against. */
  outDir: string;
  /** Out-reasons that, in this profile, STILL count a field as a Core member. */
  memberReasons: ReadonlySet<OutReason>;
}

export const STRICT_PROFILE: CoreProfile = {
  name: "strict",
  outDir: "core",
  memberReasons: new Set(),
};

export const RICH_PROFILE: CoreProfile = {
  name: "rich",
  outDir: "core-rich",
  memberReasons: new Set<OutReason>(["existence-loss", "heuristic", "partial"]),
};

export const PROFILES: CoreProfile[] = [STRICT_PROFILE, RICH_PROFILE];

/** Is this field a member of `profile`'s Core? `core` always; lossy-home iff rich. */
export function isMember(verdict: Verdict, profile: CoreProfile): boolean {
  if (verdict.class === "core") return true;
  return verdict.reason !== undefined && profile.memberReasons.has(verdict.reason);
}

export interface DerivedRow {
  entity: string;
  variant: string;
  field: string;
  srcRaw: unknown;
  description?: string;
  verdict: Verdict;
}

export interface Derived {
  /** The profile this derivation was run under. */
  profile: CoreProfile;
  corpus: Corpus;
  rows: DerivedRow[];
  admissibility: Admissibility[];
  /** Admissible OCF entities (variants collapsed), pruned to member fields. */
  entities: CoreEntity[];
  /** The emitted package: relative path under the profile's outDir → schema object. */
  package: Map<string, Record<string, unknown>>;
}

function shortDescription(node: unknown): string | undefined {
  if (!isPlainObject(node) || typeof node.description !== "string") return undefined;
  const d = node.description.replace(/\s+/g, " ").trim();
  return d.length > 140 ? d.slice(0, 137) + "…" : d;
}

export async function deriveCore(
  repoRoot: string,
  profile: CoreProfile = STRICT_PROFILE
): Promise<Derived> {
  const corpus = await loadGreenCorpus(repoRoot);
  const ctx: ClassifyCtx = {
    registry: corpus.registry,
    bundle: corpus.bundle,
    typeLib: corpus.typeLib,
  };
  // OCF places transactions under objects/transactions/; everything else is an object.
  const isEvent = new Map(corpus.objects.map((o) => [o.entity, o.rel.includes("/transactions/")]));

  const rows: DerivedRow[] = [];
  for (const obj of corpus.objects) {
    for (const [variant, fields] of obj.variants) {
      for (const [field, rawEntry] of Object.entries(fields)) {
        if (!isPlainObject(rawEntry)) continue;
        rows.push({
          entity: obj.entity,
          variant,
          field,
          srcRaw: obj.properties[field],
          description: shortDescription(obj.properties[field]),
          verdict: classifyField(rawEntry, obj.properties[field], ctx),
        });
      }
    }
  }

  const graph = await loadReferenceGraph(repoRoot);
  const aliases = new Map(
    corpus.objects.filter((o) => o.aliasOf).map((o) => [o.entity, o.aliasOf as string])
  );
  // Feed admissibility the profile's membership, not the raw class: a rich member
  // (a lossy-home field) participates in §3 exactly like a `core` field — it can
  // supply payload and it carries closure obligations. For the strict profile
  // isMember ≡ (class === "core"), so this is identical to the original feed.
  const admissibility = computeAdmissibility(
    rows.map((r) => ({
      entity: r.entity,
      variant: r.variant,
      field: r.field,
      klass: isMember(r.verdict, profile) ? "core" : "out",
    })),
    graph,
    aliases
  );
  const admissibleNode = new Set(
    admissibility.filter((a) => a.admissible).map((a) => `${a.entity} ${a.variant}`)
  );

  // Collapse variants into OCF entities: an entity is in Core if ANY variant is
  // admissible; its fields are the union of fields `core` in an admissible variant.
  const byEntity = new Map<string, Map<string, { srcRaw: unknown; description?: string }>>();
  for (const r of rows) {
    if (!admissibleNode.has(`${r.entity} ${r.variant}`)) continue;
    if (!isMember(r.verdict, profile)) continue;
    const fields = byEntity.get(r.entity) ?? new Map();
    if (!fields.has(r.field)) fields.set(r.field, { srcRaw: r.srcRaw, description: r.description });
    byEntity.set(r.entity, fields);
  }

  // Identity spine: Core is an OCF subset, so every Core entity carries OCF's
  // universal keys — `id` and `object_type` — even though they are economically
  // `out` (no Carta payload home). Required for referential closure (R4) and to
  // discriminate the transaction union; the §3 note flags them as fold keys.
  const propsByEntity = new Map(corpus.objects.map((o) => [o.entity, o.properties]));
  for (const [entity, fields] of byEntity) {
    const props = propsByEntity.get(entity) ?? {};
    for (const key of ["object_type", "id"]) {
      if (props[key] !== undefined && !fields.has(key)) {
        fields.set(key, { srcRaw: props[key], description: shortDescription(props[key]) });
      }
    }
  }

  const entities: CoreEntity[] = [...byEntity.entries()]
    .map(([entity, fields]) => ({
      entity,
      kind: (isEvent.get(entity) ? "event" : "object") as "event" | "object",
      fields: [...fields.entries()].map(([field, f]) => ({ field, ...f })),
    }))
    .sort((a, b) => a.entity.localeCompare(b.entity));

  const packaging: OcfPackaging = await loadOcfFileCategories(repoRoot);
  const pkg = emitCorePackage(entities, corpus.registry, packaging);
  return { profile, corpus, rows, admissibility, entities, package: pkg };
}
