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
import { classifyField, ClassifyCtx, Verdict } from "./core-classifier.js";
import { Admissibility, computeAdmissibility } from "./core-admissibility.js";
import { CoreEntity, emitCorePackage } from "./core-schema-emitter.js";

export interface DerivedRow {
  entity: string;
  variant: string;
  field: string;
  srcRaw: unknown;
  description?: string;
  verdict: Verdict;
}

export interface Derived {
  corpus: Corpus;
  rows: DerivedRow[];
  admissibility: Admissibility[];
  /** Admissible OCF entities (variants collapsed), pruned to core fields. */
  entities: CoreEntity[];
  /** The emitted package: relative path under core/ → schema object. */
  package: Map<string, Record<string, unknown>>;
}

function shortDescription(node: unknown): string | undefined {
  if (!isPlainObject(node) || typeof node.description !== "string") return undefined;
  const d = node.description.replace(/\s+/g, " ").trim();
  return d.length > 140 ? d.slice(0, 137) + "…" : d;
}

export async function deriveCore(repoRoot: string): Promise<Derived> {
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
  const admissibility = computeAdmissibility(
    rows.map((r) => ({
      entity: r.entity,
      variant: r.variant,
      field: r.field,
      klass: r.verdict.class,
    })),
    graph
  );
  const admissibleNode = new Set(
    admissibility.filter((a) => a.admissible).map((a) => `${a.entity} ${a.variant}`)
  );

  // Collapse variants into OCF entities: an entity is in Core if ANY variant is
  // admissible; its fields are the union of fields `core` in an admissible variant.
  const byEntity = new Map<string, Map<string, { srcRaw: unknown; description?: string }>>();
  for (const r of rows) {
    if (!admissibleNode.has(`${r.entity} ${r.variant}`)) continue;
    if (r.verdict.class !== "core") continue;
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
  return { corpus, rows, admissibility, entities, package: pkg };
}
