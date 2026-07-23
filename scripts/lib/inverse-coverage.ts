/**
 * Shared Carta-side inverse coverage model.
 *
 * The mapping corpus contains several different kinds of target evidence:
 * executable OCF-object edges, reusable type mappings, composite constants,
 * deferred extraction targets, and structural `$ref` reachability. This module
 * keeps those dimensions separate so every report can render the same ledger.
 */
import { Corpus, GreenObject, MappingEdge } from "./core-corpus.js";
import { isPlainObject } from "./mapping-validator.js";

export type CartaDefDisposition =
  | "report-rollup"
  | "alternate"
  | "vendor-family"
  | "workflow-gap"
  | "gap"
  | "review";

export type CartaDefStatus =
  | "direct"
  | "type-only"
  | "nested-covered"
  | "deferred"
  | CartaDefDisposition;

export interface CartaRefSite {
  from: string;
  pointer: string;
}

export interface CartaDefInfo {
  name: string;
  def: Record<string, unknown>;
  properties: Record<string, unknown>;
  isObjectLike: boolean;
  isScalarWrapper: boolean;
  outboundRefs: string[];
  inboundRefs: CartaRefSite[];
}

export interface CartaSchemaIndex {
  defs: Map<string, CartaDefInfo>;
  refClosure: (roots: Iterable<string>) => Set<string>;
  refParents: (roots: Iterable<string>) => Map<string, Set<string>>;
  resolve: (pointer: string) => unknown;
}

export interface CartaSlotCoverage {
  pointer: string;
  def: string;
  property: string;
  status: "direct" | "type-only" | "implicit" | "deferred" | "empty";
  edges: MappingEdge[];
}

export interface CartaDefCoverage {
  name: string;
  properties: string[];
  directRoot: boolean;
  directSlots: string[];
  typeOnlySlots: string[];
  implicitSlots: string[];
  deferredSlots: string[];
  emptySlots: string[];
  structuralParents: string[];
  status: CartaDefStatus;
  disposition?: CartaDefDisposition;
  reason?: string;
}

export interface TypeCorrespondence {
  sourceType: string;
  targetType: string;
  edges: MappingEdge[];
}

export interface InverseCoverageMetrics {
  totalDefs: number;
  objectDefs: number;
  objectSlots: number;
  directDefs: number;
  directSlots: number;
  /** Definitions with at least one type-only slot; may also have direct slots. */
  typeOnlyDefs: number;
  /** Definitions whose only non-empty evidence is type-only. */
  typeOnlyOnlyDefs: number;
  typeOnlySlots: number;
  implicitSlots: number;
  deferredSlots: number;
  emptySlots: number;
  nestedCoveredDefs: number;
  reportRollupDefs: number;
  alternateDefs: number;
  vendorFamilyDefs: number;
  workflowGapDefs: number;
  actionableGapDefs: number;
  reviewDefs: number;
}

export interface InverseCoverageLedger {
  schema: CartaSchemaIndex;
  edges: MappingEdge[];
  slots: CartaSlotCoverage[];
  defs: CartaDefCoverage[];
  typeCorrespondences: TypeCorrespondence[];
  metrics: InverseCoverageMetrics;
  /** Object-like Carta defs with no direct/type/deferred evidence or mapped-parent reachability. */
  candidates: CartaDefCoverage[];
}

interface DispositionPolicy {
  disposition: CartaDefDisposition;
  reason: string;
}

/**
 * Exceptions that cannot be inferred reliably from JSON Schema shape alone.
 * The rest of the classification is derived from target pointers and `$ref`
 * reachability. Keeping this policy in one place avoids report-specific lists.
 */
const CARTA_DEF_POLICY: Record<string, DispositionPolicy> = {
  Corporation: {
    disposition: "alternate",
    reason: "Unused alternate issuer shape; OCF Issuer maps to Carta Issuer.",
  },
  Date: {
    disposition: "alternate",
    reason: "Partial-date helper; OCF Date maps to the Iso8601 date wrappers.",
  },
  Vesting: {
    disposition: "alternate",
    reason: "Unreachable option-grant vesting shape; mapped OCF vesting uses schedule/event defs.",
  },
  Acceleration: {
    disposition: "alternate",
    reason: "Child of the unreachable Carta Vesting shape.",
  },
  Interest: {
    disposition: "vendor-family",
    reason: "Carta profits-interest security family has no OCF source object.",
  },
  ThresholdDetails: {
    disposition: "vendor-family",
    reason: "Nested profits-interest threshold details have no OCF source.",
  },
  PhantomCancellationTransaction: {
    disposition: "vendor-family",
    reason: "Carta phantom-equity transaction family has no OCF route.",
  },
  PhantomIssuanceTransaction: {
    disposition: "vendor-family",
    reason: "Carta phantom-equity transaction family has no OCF route.",
  },
  PiuCancellationTransaction: {
    disposition: "vendor-family",
    reason: "Carta profits-interest-unit transaction family has no OCF route.",
  },
  PiuIssuanceTransaction: {
    disposition: "vendor-family",
    reason: "Carta profits-interest-unit transaction family has no OCF route.",
  },
  OptionExercise: {
    disposition: "workflow-gap",
    reason: "Carta exercise-request workflow object; OCF maps the realized transaction instead.",
  },
  OptionExerciseMoneyMovement: {
    disposition: "workflow-gap",
    reason: "Nested Carta exercise-funding workflow data has no OCF source.",
  },
  OptionExerciseTaxWithholdingLineItem: {
    disposition: "workflow-gap",
    reason: "Nested Carta tax-withholding workflow data has no OCF source.",
  },
  Jurisdiction: {
    disposition: "workflow-gap",
    reason:
      "Carta tax-withholding jurisdiction; OCF address/exemption jurisdictions are different concepts.",
  },
  OptionGrantDocuments: {
    disposition: "gap",
    reason: "Carta grant-document relationship has no OCF source relationship.",
  },
};

export function isCartaObjectLike(def: unknown): boolean {
  if (!isPlainObject(def) || !isPlainObject(def.properties)) return false;
  const keys = Object.keys(def.properties);
  return keys.length > 1 || (keys.length === 1 && keys[0] !== "value");
}

function isCartaScalarWrapper(def: unknown): boolean {
  return (
    isPlainObject(def) && isPlainObject(def.properties) && Object.keys(def.properties).length === 1
  );
}

function localRefName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const m = /^#\/\$defs\/([^/]+)/.exec(value);
  return m ? (m[1] as string) : null;
}

function schemaRefName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const local = localRefName(value);
  if (local) return local;
  const basename = value.split(/[/?#]/).pop();
  return basename?.replace(/\.schema\.json$/, "") || null;
}

function collectRefs(node: unknown, into: Set<string>, pointer: string): void {
  if (Array.isArray(node)) {
    node.forEach((value, index) => collectRefs(value, into, `${pointer}/${index}`));
    return;
  }
  if (!isPlainObject(node)) return;
  if (node.$ref) {
    const name = localRefName(node.$ref);
    if (name) into.add(name);
  }
  for (const [key, value] of Object.entries(node)) {
    if (key !== "$ref") collectRefs(value, into, `${pointer}/${key}`);
  }
}

function decodePointerSegment(value: string): string {
  return value.replace(/~1/g, "/").replace(/~0/g, "~");
}

function resolvePointerValue(document: unknown, pointer: string): unknown {
  if (!pointer.startsWith("#/")) return undefined;
  const segments = pointer.slice(2).split("/").map(decodePointerSegment);
  let value: unknown = document;
  for (const segment of segments) {
    if (Array.isArray(value)) value = value[Number(segment)];
    else if (isPlainObject(value)) value = value[segment];
    else return undefined;
  }
  return value;
}

export function buildCartaSchemaIndex(bundle: unknown): CartaSchemaIndex {
  const rawDefs = isPlainObject(bundle) && isPlainObject(bundle.$defs) ? bundle.$defs : {};
  const defs = new Map<string, CartaDefInfo>();
  const inbound = new Map<string, CartaRefSite[]>();

  for (const [name, rawDef] of Object.entries(rawDefs)) {
    if (!isPlainObject(rawDef)) continue;
    const refs = new Set<string>();
    collectRefs(rawDef, refs, `#/$defs/${name}`);
    const properties = isPlainObject(rawDef.properties) ? rawDef.properties : {};
    defs.set(name, {
      name,
      def: rawDef,
      properties,
      isObjectLike: isCartaObjectLike(rawDef),
      isScalarWrapper: isCartaScalarWrapper(rawDef),
      outboundRefs: [...refs].sort(),
      inboundRefs: [],
    });
    for (const child of refs) {
      const list = inbound.get(child) ?? [];
      list.push({ from: name, pointer: `#/$defs/${name}` });
      inbound.set(child, list);
    }
  }

  for (const [name, info] of defs)
    info.inboundRefs = (inbound.get(name) ?? []).sort((a, b) => a.from.localeCompare(b.from));

  const refParents = (roots: Iterable<string>): Map<string, Set<string>> => {
    const parents = new Map<string, Set<string>>();
    const queue = [...roots];
    const seen = new Set(queue);
    while (queue.length) {
      const parent = queue.shift() as string;
      const info = defs.get(parent);
      if (!info) continue;
      for (const child of info.outboundRefs) {
        const list = parents.get(child) ?? new Set<string>();
        list.add(parent);
        parents.set(child, list);
        if (!seen.has(child)) {
          seen.add(child);
          queue.push(child);
        }
      }
    }
    return parents;
  };

  return {
    defs,
    refClosure: (roots) => new Set(refParents(roots).keys()),
    refParents,
    resolve: (pointer) => resolvePointerValue(bundle, pointer),
  };
}

function rootOf(pointer: string): string | null {
  return localRefName(pointer);
}

function isDirect(edge: MappingEdge): boolean {
  return edge.scope === "object" || edge.scope === "composite";
}

function reportRollupPolicy(name: string): DispositionPolicy | undefined {
  if (!/(?:Summary|TransactionItem)$/.test(name) && name !== "StakeholderGroup") return undefined;
  return {
    disposition: "report-rollup",
    reason: "Carta read-model aggregate; OCF records the underlying leaf facts instead.",
  };
}

function isPointerForDef(pointer: string, name: string): boolean {
  return pointer === `#/$defs/${name}` || pointer.startsWith(`#/$defs/${name}/`);
}

function slotPointer(name: string, property: string): string {
  return `#/$defs/${name}/properties/${property}`;
}

function sourcePropertyNode(corpus: Corpus, object: GreenObject, field: string): unknown {
  const root = object.sourceSchemaId ? corpus.registry.get(object.sourceSchemaId) : undefined;
  const seen = new Set<unknown>();
  const visit = (node: unknown): unknown => {
    if (!isPlainObject(node) || seen.has(node)) return undefined;
    seen.add(node);
    if (isPlainObject(node.properties) && field in node.properties) return node.properties[field];
    if (Array.isArray(node.allOf)) {
      for (const part of node.allOf) {
        const ref = isPlainObject(part) && typeof part.$ref === "string" ? part.$ref : null;
        const child = ref ? corpus.registry.get(ref) : part;
        const found = visit(child);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  };
  return visit(root) ?? object.properties[field];
}

function refNames(node: unknown): string[] {
  const refs = new Set<string>();
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isPlainObject(value)) return;
    if (value.$ref) {
      const name = schemaRefName(value.$ref);
      if (name) refs.add(name);
    }
    Object.entries(value).forEach(([key, child]) => {
      if (key !== "$ref") visit(child);
    });
  };
  visit(node);
  return [...refs].sort();
}

function buildTypeCorrespondences(
  corpus: Corpus,
  schema: CartaSchemaIndex,
  edges: MappingEdge[]
): TypeCorrespondence[] {
  const objects = new Map(corpus.objects.map((object) => [object.entity, object]));
  const byPair = new Map<string, TypeCorrespondence>();

  for (const edge of edges) {
    const targetNode = schema.resolve(edge.target);
    const targetTypes = refNames(targetNode);
    if (edge.sourceKind === "type") {
      const targets = targetTypes.length
        ? targetTypes
        : rootOf(edge.target)
        ? [rootOf(edge.target)!]
        : [];
      for (const targetType of targets) {
        const key = `${edge.source}\u0000${targetType}`;
        const row = byPair.get(key) ?? { sourceType: edge.source, targetType, edges: [] };
        row.edges.push(edge);
        byPair.set(key, row);
      }
      continue;
    }

    if (!edge.field) continue;
    const object = objects.get(edge.source);
    if (!object) continue;
    const sourceTypes = refNames(sourcePropertyNode(corpus, object, edge.field));
    if (!sourceTypes.length || !targetTypes.length) continue;
    for (const sourceType of sourceTypes) {
      for (const targetType of targetTypes) {
        const key = `${sourceType}\u0000${targetType}`;
        const row = byPair.get(key) ?? { sourceType, targetType, edges: [] };
        row.edges.push(edge);
        byPair.set(key, row);
      }
    }
  }
  return [...byPair.values()].sort(
    (a, b) => a.sourceType.localeCompare(b.sourceType) || a.targetType.localeCompare(b.targetType)
  );
}

export function buildInverseCoverage(corpus: Corpus): InverseCoverageLedger {
  const schema = buildCartaSchemaIndex(corpus.bundle);
  const edges = corpus.mappingEdges;
  const directEdges = edges.filter(isDirect);
  const typeEdges = edges.filter((edge) => edge.scope === "type");
  const constantEdges = edges.filter((edge) => edge.scope === "constant");
  const deferredEdges = edges.filter((edge) => edge.scope === "deferred");
  const directPointers = new Set(directEdges.map((edge) => edge.target));
  const typePointers = new Set(typeEdges.map((edge) => edge.target));
  const constantPointers = new Set(constantEdges.map((edge) => edge.target));
  const deferredPointers = new Set(deferredEdges.map((edge) => edge.target));
  const directRoots = new Set(
    directEdges.map((edge) => rootOf(edge.target)).filter(Boolean) as string[]
  );
  const parents = schema.refParents(directRoots);
  const slots: CartaSlotCoverage[] = [];

  for (const info of schema.defs.values()) {
    if (!info.isObjectLike) continue;
    for (const property of Object.keys(info.properties).sort()) {
      const pointer = slotPointer(info.name, property);
      const slotEdges = edges.filter((edge) => edge.target === pointer);
      const status = directPointers.has(pointer)
        ? "direct"
        : typePointers.has(pointer)
        ? "type-only"
        : constantPointers.has(pointer)
        ? "implicit"
        : deferredPointers.has(pointer)
        ? "deferred"
        : "empty";
      slots.push({ pointer, def: info.name, property, status, edges: slotEdges });
    }
  }

  const defRows: CartaDefCoverage[] = [];
  for (const info of schema.defs.values()) {
    if (!info.isObjectLike) continue;
    const defSlots = slots.filter((slot) => slot.def === info.name);
    const directSlots = defSlots
      .filter((slot) => slot.status === "direct")
      .map((slot) => slot.property);
    const typeOnlySlots = defSlots
      .filter((slot) => slot.status === "type-only")
      .map((slot) => slot.property);
    const implicitSlots = defSlots
      .filter((slot) => slot.status === "implicit")
      .map((slot) => slot.property);
    const deferredSlots = defSlots
      .filter((slot) => slot.status === "deferred")
      .map((slot) => slot.property);
    const emptySlots = defSlots
      .filter((slot) => slot.status === "empty")
      .map((slot) => slot.property);
    const directRoot = directRoots.has(info.name);
    const structuralParents = [...(parents.get(info.name) ?? new Set<string>())].sort();
    const policy = CARTA_DEF_POLICY[info.name] ?? reportRollupPolicy(info.name);
    let status: CartaDefStatus;
    let disposition: CartaDefDisposition | undefined;
    let reason: string | undefined;

    if (directRoot || directSlots.length > 0) status = "direct";
    else if (
      typeOnlySlots.length > 0 ||
      typeEdges.some((edge) => rootOf(edge.target) === info.name)
    )
      status = "type-only";
    else if (
      deferredSlots.length > 0 ||
      deferredEdges.some((edge) => rootOf(edge.target) === info.name)
    )
      status = "deferred";
    else if (structuralParents.length > 0) status = "nested-covered";
    else if (policy) {
      status = policy.disposition;
      disposition = policy.disposition;
      reason = policy.reason;
    } else {
      status = "review";
      disposition = "review";
      reason = "No mapping evidence or mapped-parent reachability; target role needs review.";
    }

    defRows.push({
      name: info.name,
      properties: Object.keys(info.properties).sort(),
      directRoot,
      directSlots,
      typeOnlySlots,
      implicitSlots,
      deferredSlots,
      emptySlots,
      structuralParents,
      status,
      disposition,
      reason,
    });
  }

  const candidates = defRows.filter((row) =>
    ["report-rollup", "alternate", "vendor-family", "workflow-gap", "gap", "review"].includes(
      row.status
    )
  );
  const countStatus = (status: CartaDefStatus) =>
    defRows.filter((row) => row.status === status).length;
  const metrics: InverseCoverageMetrics = {
    totalDefs: schema.defs.size,
    objectDefs: defRows.length,
    objectSlots: slots.length,
    directDefs: countStatus("direct"),
    directSlots: slots.filter((slot) => slot.status === "direct").length,
    typeOnlyDefs: defRows.filter((row) => row.typeOnlySlots.length > 0).length,
    typeOnlyOnlyDefs: countStatus("type-only"),
    typeOnlySlots: slots.filter((slot) => slot.status === "type-only").length,
    implicitSlots: slots.filter((slot) => slot.status === "implicit").length,
    deferredSlots: slots.filter((slot) => slot.status === "deferred").length,
    emptySlots: slots.filter((slot) => slot.status === "empty").length,
    nestedCoveredDefs: countStatus("nested-covered"),
    reportRollupDefs: countStatus("report-rollup"),
    alternateDefs: countStatus("alternate"),
    vendorFamilyDefs: countStatus("vendor-family"),
    workflowGapDefs: countStatus("workflow-gap"),
    actionableGapDefs:
      countStatus("gap") + countStatus("vendor-family") + countStatus("workflow-gap"),
    reviewDefs: countStatus("review"),
  };

  return {
    schema,
    edges,
    slots,
    defs: defRows.sort((a, b) => a.name.localeCompare(b.name)),
    typeCorrespondences: buildTypeCorrespondences(corpus, schema, edges),
    metrics,
    candidates: candidates.sort((a, b) => a.name.localeCompare(b.name)),
  };
}
