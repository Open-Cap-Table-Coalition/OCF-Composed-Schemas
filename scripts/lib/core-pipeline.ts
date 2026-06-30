/**
 * OCF Core — the derive pipeline, end to end.
 *
 * One function that both the build (scripts/derive-core-build) and the CI check
 * (scripts/derive-core-check) call, so they can never disagree on what Core is:
 *   load green corpus → classify every field (§2) → admissibility (§3) →
 *   assemble the admissible Core entities → emit the Core schema (§4).
 */
import { isPlainObject } from "./mapping-validator.js";
import { Corpus, loadGreenCorpus } from "./core-corpus.js";
import { classifyField, ClassifyCtx, Verdict } from "./core-classifier.js";
import { Admissibility, computeAdmissibility } from "./core-admissibility.js";
import { CoreEntity, emitCoreSchema } from "./core-schema-emitter.js";

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
  /** Admissible (entity,variant), pruned to core fields — the schema's $defs. */
  coreEntities: CoreEntity[];
  schema: Record<string, unknown>;
}

function shortDescription(node: unknown): string | undefined {
  if (!isPlainObject(node) || typeof node.description !== "string") return undefined;
  const d = node.description.replace(/\s+/g, " ").trim();
  return d.length > 140 ? d.slice(0, 137) + "…" : d;
}

export function defNameFor(entity: string, variant: string): string {
  return variant === "—" ? entity : `${entity}__${variant}`;
}

export async function deriveCore(repoRoot: string): Promise<Derived> {
  const corpus = await loadGreenCorpus(repoRoot);
  const ctx: ClassifyCtx = {
    registry: corpus.registry,
    bundle: corpus.bundle,
    typeLib: corpus.typeLib,
  };

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

  const admissibility = computeAdmissibility(
    rows.map((r) => ({
      entity: r.entity,
      variant: r.variant,
      field: r.field,
      klass: r.verdict.class,
    }))
  );
  const admissible = new Set(
    admissibility.filter((a) => a.admissible).map((a) => `${a.entity} ${a.variant}`)
  );

  const byNode = new Map<string, DerivedRow[]>();
  for (const r of rows) {
    const k = `${r.entity} ${r.variant}`;
    if (!admissible.has(k)) continue;
    const list = byNode.get(k) ?? [];
    list.push(r);
    byNode.set(k, list);
  }
  const coreEntities: CoreEntity[] = [...byNode.values()].map((frs) => {
    const { entity, variant } = frs[0]!;
    return {
      defName: defNameFor(entity, variant),
      entity,
      variant,
      fields: frs
        .filter((r) => r.verdict.class === "core")
        .map((r) => ({ field: r.field, srcRaw: r.srcRaw, description: r.description })),
    };
  });

  const schema = emitCoreSchema(coreEntities, corpus.registry);
  return { corpus, rows, admissibility, coreEntities, schema };
}
