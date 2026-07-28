/**
 * Canonical source-side projection of the normalized mapping edges.
 *
 * The Mapping Explorer and the Core reports must agree on where an OCF field
 * goes. Both therefore read the same `Corpus.mappingEdges` representation,
 * rather than re-parsing authored `target:` values independently.
 */
import type { Corpus, GreenObject, MappingEdge } from "./core-corpus.js";

export function sourceEdgesFor(corpus: Corpus, object: GreenObject): MappingEdge[] {
  return corpus.mappingEdges.filter(
    (edge) => edge.rel === object.rel && edge.sourceKind === "object"
  );
}

export function sourceFieldEdgesFor(
  corpus: Corpus,
  object: GreenObject,
  variant: string,
  field: string
): MappingEdge[] {
  return sourceEdgesFor(corpus, object).filter(
    (edge) => edge.variant === variant && edge.field === field
  );
}

export function sourceFieldTarget(
  corpus: Corpus,
  object: GreenObject,
  variant: string,
  field: string
): string {
  return (
    [...new Set(sourceFieldEdgesFor(corpus, object, variant, field).map((edge) => edge.target))]
      .sort()
      .join(" + ") || "—"
  );
}

export function sourceFieldTargetIndex(corpus: Corpus): Map<string, string> {
  const targetOf = new Map<string, Set<string>>();
  for (const object of corpus.objects) {
    for (const edge of sourceEdgesFor(corpus, object)) {
      if (!edge.field) continue;
      const key = `${edge.source} ${edge.variant} ${edge.field}`;
      const targets = targetOf.get(key) ?? new Set<string>();
      targets.add(edge.target);
      targetOf.set(key, targets);
    }
  }
  return new Map(
    [...targetOf.entries()].map(([key, targets]) => [key, [...targets].sort().join(" + ")])
  );
}
