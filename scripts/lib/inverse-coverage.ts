/**
 * Shared Carta-side inverse coverage model.
 *
 * The mapping corpus contains several different kinds of target evidence:
 * executable OCF-object edges, reusable type mappings, composite constants,
 * deferred extraction targets, and structural `$ref` reachability. This module
 * keeps those dimensions separate so every report can render the same ledger.
 */
import { Corpus, GreenObject, MappingEdge } from "./core-corpus.js";
import { CartaCoverageRole, CartaCoveragePolicyEntry, CoveragePolicy } from "./coverage-policy.js";
import { isPlainObject } from "./mapping-validator.js";
import type { InverseRole } from "./inverse-semantics.js";

export type CartaDefDisposition = CartaCoverageRole | "review";

export type NestedNamespace = "ocf" | "carta";

export type CartaDefStatus = "direct" | "nested-obj" | "deferred" | CartaDefDisposition;

/** Mutually exclusive primary roles used to account for every object-like definition. */
export const CARTA_DEF_STATUS_ORDER: CartaDefStatus[] = [
  "direct",
  "deferred",
  "nested-obj",
  "value-type",
  "report-rollup",
  "alternate",
  "vendor-family",
  "workflow-gap",
  "gap",
  "review",
];

export const CARTA_DEF_STATUS_LABELS: Record<CartaDefStatus, string> = {
  direct: "direct executable",
  deferred: "deferred",
  "nested-obj": "nested object / non-target",
  "value-type": "value-type / non-target",
  "report-rollup": "report roll-up",
  alternate: "alternate shape",
  "vendor-family": "CARTA-specific family (no OCF source)",
  "workflow-gap": "workflow/data gap",
  gap: "actionable gap",
  review: "review required",
};

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
  status: "direct" | "type-only" | "implicit" | "deferred" | "structural" | "empty";
  edges: MappingEdge[];
  structuralEdges: MappingEdge[];
  /** Inverse semantics attached to executable edges reaching this slot. */
  inverseRoles: InverseRole[];
}

export interface CartaDefCoverage {
  name: string;
  properties: string[];
  directRoot: boolean;
  directSlots: string[];
  typeOnlySlots: string[];
  implicitSlots: string[];
  deferredSlots: string[];
  structuralSlots: string[];
  emptySlots: string[];
  structuralParents: string[];
  status: CartaDefStatus;
  /** Namespace in which a nested-object role is established. */
  nestedNamespace?: NestedNamespace;
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
  /** Mutually exclusive primary role for every object-like Carta definition. */
  definitionRoleCounts: Record<CartaDefStatus, number>;
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
  structuralSlots: number;
  emptySlots: number;
  nestedObjDefs: number;
  reportRollupDefs: number;
  curatedValueTypeEntries: number;
  valueTypeDefs: number;
  alternateDefs: number;
  vendorFamilyDefs: number;
  workflowGapDefs: number;
  actionableGapDefs: number;
  reviewDefs: number;
  /** Count of executable mapping edges by inverse meaning. */
  inverseRoleCounts: Record<InverseRole, number>;
}

export interface InverseCoverageStory {
  /** All Carta `$defs` in the schema bundle, including scalar and support definitions. */
  totalDefs: number;
  /** Definitions without an object-shaped properties payload. */
  nonObjectDefs: number;
  /** Non-object definitions that provide scalar enum/value vocabularies. */
  scalarEnumDefs: number;
  /** Non-object definitions not covered by the named scalar buckets. */
  otherNonObjectDefs: number;
  /** Definitions with an object-shaped `properties` payload. */
  objectDefs: number;
  /** Object-shaped definitions that are standalone mapping candidates. */
  standaloneCandidateDefs: number;
  /** Object-like definitions with standalone executable evidence. */
  mappedDefs: number;
  /** Mapped standalone targets with no empty object slots. */
  fullyMappedDefs: number;
  /** Mapped standalone targets with one or more empty object slots. */
  partiallyMappedDefs: number;
  /** Standalone candidates without mapping evidence, partitioned by inventory role. */
  unmappedCandidateDefs: number;
  /** All curated value types plus nested object definitions, including scalar wrappers. */
  nonEntityDefs: number;
  /** The subset of non-entities that are object-like and therefore appear in the 86-def denominator. */
  nonEntityObjectDefs: number;
  /** Curated scalar value wrappers outside the object-like definition denominator. */
  scalarValueTypeDefs: number;
}

export interface InverseCoverageLedger {
  schema: CartaSchemaIndex;
  edges: MappingEdge[];
  /** Schema-backed parent-property evidence inferred from mapped child definitions. */
  structuralEdges: MappingEdge[];
  slots: CartaSlotCoverage[];
  defs: CartaDefCoverage[];
  typeCorrespondences: TypeCorrespondence[];
  metrics: InverseCoverageMetrics;
  excludedRoleRows: InverseExcludedRoleRow[];
  /** Object-like Carta defs needing role review or follow-up after policy exclusions. */
  candidates: CartaDefCoverage[];
}

export interface InverseExcludedRoleRow {
  role: "value-type" | "nested-obj";
  name: string;
  coveredThrough: string;
  reason: string;
  nestedNamespace?: NestedNamespace;
}

export interface InverseExcludedRoleGroups {
  valueTypes: InverseExcludedRoleRow[];
  nestedWithMappedParent: InverseExcludedRoleRow[];
  nestedWithoutMappedParent: InverseExcludedRoleRow[];
}

export function groupInverseExcludedRoleRows(
  rows: InverseExcludedRoleRow[]
): InverseExcludedRoleGroups {
  return {
    valueTypes: rows.filter((row) => row.role === "value-type"),
    nestedWithMappedParent: rows.filter(
      (row) => row.role === "nested-obj" && row.reason.includes("covered through mapped parent")
    ),
    nestedWithoutMappedParent: rows.filter(
      (row) => row.role === "nested-obj" && !row.reason.includes("covered through mapped parent")
    ),
  };
}

export const INVERSE_NON_ENTITY_STATUSES: readonly CartaDefStatus[] = ["value-type", "nested-obj"];

export function isInverseNonEntityDefinition(row: Pick<CartaDefCoverage, "status">): boolean {
  return INVERSE_NON_ENTITY_STATUSES.includes(row.status);
}

export const INVERSE_MAPPED_STATUSES: readonly CartaDefStatus[] = ["direct", "deferred"];

export function isInverseMappedDefinition(row: Pick<CartaDefCoverage, "status">): boolean {
  return INVERSE_MAPPED_STATUSES.includes(row.status);
}

/**
 * Collapse the mutually exclusive primary roles into the three-bucket story
 * used by human-facing reports. These buckets intentionally sum to the
 * object-like definition denominator; slot counts and curated scalar policy
 * entries live in separate dimensions.
 */
export function inverseCoverageStory(inverse: InverseCoverageLedger): InverseCoverageStory {
  const counts = inverse.metrics.definitionRoleCounts;
  const mappedDefs = counts.direct + counts.deferred;
  const nonEntityObjectDefs = counts["nested-obj"] + counts["value-type"];
  const unmappedCandidateDefs =
    counts["report-rollup"] +
    counts.alternate +
    counts["vendor-family"] +
    counts["workflow-gap"] +
    counts.gap +
    counts.review;
  const nonEntityDefs = inverse.excludedRoleRows.length;
  const nonObjectDefs = inverse.metrics.totalDefs - inverse.metrics.objectDefs;
  const scalarValueTypeDefs = Math.max(
    0,
    inverse.metrics.curatedValueTypeEntries - inverse.metrics.valueTypeDefs
  );
  const scalarEnumDefs = [...inverse.schema.defs.values()].filter(
    (info) => !info.isObjectLike && Array.isArray(info.def.enum)
  ).length;
  const otherNonObjectDefs = Math.max(0, nonObjectDefs - scalarEnumDefs - scalarValueTypeDefs);
  const mappedRows = inverse.defs.filter(isInverseMappedDefinition);
  return {
    totalDefs: inverse.metrics.totalDefs,
    nonObjectDefs,
    scalarEnumDefs,
    otherNonObjectDefs,
    objectDefs: inverse.metrics.objectDefs,
    standaloneCandidateDefs: inverse.metrics.objectDefs - nonEntityObjectDefs,
    mappedDefs,
    fullyMappedDefs: mappedRows.filter((row) => row.emptySlots.length === 0).length,
    partiallyMappedDefs: mappedRows.filter((row) => row.emptySlots.length > 0).length,
    unmappedCandidateDefs,
    nonEntityDefs,
    nonEntityObjectDefs,
    scalarValueTypeDefs,
  };
}

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

function inverseRoleForEdge(edge: MappingEdge): InverseRole {
  return edge.inverseRole ?? "record-construction";
}

function reportRollupPolicy(name: string): CartaCoveragePolicyEntry | undefined {
  if (!/(?:Summary|TransactionItem)$/.test(name) && name !== "StakeholderGroup") return undefined;
  return {
    role: "report-rollup",
    reason: "Carta read-model aggregate; OCF records the underlying leaf facts instead.",
  };
}

function slotPointer(name: string, property: string): string {
  return `#/$defs/${name}/properties/${property}`;
}

interface CartaPropertyChildRef {
  name: string;
  cardinality: "object" | "array";
}

/**
 * Find the definitions directly contained by one Carta property schema.
 *
 * This deliberately stops at the first `$ref` it encounters. A property such
 * as `transfers.items.$ref` therefore reports `WarrantTransferTransaction`,
 * while a reusable child definition's own descendants are handled when that
 * child is visited as a parent in its own right. The same rule works for
 * direct object properties and for union branches.
 */
function directPropertyChildRefs(
  node: unknown,
  cardinality: "object" | "array" = "object"
): CartaPropertyChildRef[] {
  if (!isPlainObject(node)) return [];
  if (typeof node.$ref === "string") {
    const name = schemaRefName(node.$ref);
    return name ? [{ name, cardinality }] : [];
  }

  const items = node.items;
  if (items !== undefined) return directPropertyChildRefs(items, "array");

  const refs: CartaPropertyChildRef[] = [];
  for (const key of ["oneOf", "anyOf", "allOf"] as const) {
    const branches = node[key];
    if (!Array.isArray(branches)) continue;
    for (const branch of branches) refs.push(...directPropertyChildRefs(branch, cardinality));
  }
  return refs.filter(
    (ref, index) =>
      refs.findIndex(
        (candidate) => candidate.name === ref.name && candidate.cardinality === ref.cardinality
      ) === index
  );
}

/**
 * Infer parent-property evidence from executable mappings to referenced child
 * definitions. A mapping must also have executable evidence for the containing
 * parent (typically a routing key such as `securityId`) before it can populate
 * the parent slot. This is schema-backed containment evidence, not a second
 * field mapping: the child fields retain their original mapping edges, while
 * the parent slot records that the child record(s) can be placed there.
 */
function structuralEdgesForProperties(
  schema: CartaSchemaIndex,
  edges: MappingEdge[]
): MappingEdge[] {
  const executableByRoot = new Map<string, MappingEdge[]>();
  const executableBySource = new Map<string, MappingEdge[]>();
  for (const edge of edges) {
    if (!isDirect(edge)) continue;
    const root = rootOf(edge.target);
    if (!root) continue;
    const group = executableByRoot.get(root) ?? [];
    group.push(edge);
    executableByRoot.set(root, group);

    const sourceKey = `${edge.rel}\u0000${edge.source}\u0000${edge.variant}`;
    const sourceGroup = executableBySource.get(sourceKey) ?? [];
    sourceGroup.push(edge);
    executableBySource.set(sourceKey, sourceGroup);
  }

  const structural: MappingEdge[] = [];
  for (const parent of schema.defs.values()) {
    if (!parent.isObjectLike) continue;
    for (const property of Object.keys(parent.properties)) {
      const pointer = slotPointer(parent.name, property);
      for (const child of directPropertyChildRefs(parent.properties[property])) {
        const childInfo = schema.defs.get(child.name);
        if (!childInfo?.isObjectLike) continue;

        const childEdges = executableByRoot.get(child.name) ?? [];
        const sources = new Map<string, MappingEdge>();
        for (const edge of childEdges) {
          const key = `${edge.rel}\u0000${edge.source}\u0000${edge.variant}`;
          const parentAnchored = (executableBySource.get(key) ?? []).some(
            (candidate) => rootOf(candidate.target) === parent.name
          );
          if (parentAnchored && !sources.has(key)) sources.set(key, edge);
        }

        for (const edge of sources.values()) {
          structural.push({
            rel: edge.rel,
            sourceKind: edge.sourceKind,
            source: edge.source,
            variant: edge.variant,
            scope: "structural",
            kind: "structural",
            target: pointer,
            detail: `${child.cardinality === "array" ? "items →" : "→"} ${child.name}`,
          });
        }
      }
    }
  }
  return structural;
}

function sourcePropertyNodeFromRoot(corpus: Corpus, root: unknown, field: string): unknown {
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
  return visit(root);
}

export function sourcePropertyNode(corpus: Corpus, object: GreenObject, field: string): unknown {
  const root = object.sourceSchemaId ? corpus.registry.get(object.sourceSchemaId) : undefined;
  return sourcePropertyNodeFromRoot(corpus, root, field) ?? object.properties[field];
}

export function sourceSchemaPropertyNode(corpus: Corpus, schemaId: string, field: string): unknown {
  return sourcePropertyNodeFromRoot(corpus, corpus.registry.get(schemaId), field);
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
  const structuralEdges = structuralEdgesForProperties(schema, edges);
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
      const slotStructuralEdges = structuralEdges.filter((edge) => edge.target === pointer);
      const status = directPointers.has(pointer)
        ? "direct"
        : typePointers.has(pointer)
        ? "type-only"
        : constantPointers.has(pointer)
        ? "implicit"
        : deferredPointers.has(pointer)
        ? "deferred"
        : slotStructuralEdges.length > 0
        ? "structural"
        : "empty";
      slots.push({
        pointer,
        def: info.name,
        property,
        status,
        edges: slotEdges,
        structuralEdges: slotStructuralEdges,
        inverseRoles: [
          ...new Set(
            slotEdges.filter((edge) => isDirect(edge)).map((edge) => inverseRoleForEdge(edge))
          ),
        ].sort(),
      });
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
    const structuralSlots = defSlots
      .filter((slot) => slot.status === "structural")
      .map((slot) => slot.property);
    const emptySlots = defSlots
      .filter((slot) => slot.status === "empty")
      .map((slot) => slot.property);
    const directRoot = directRoots.has(info.name);
    const structuralParents = [...(parents.get(info.name) ?? new Set<string>())].sort();
    const policy = corpus.coveragePolicy.cartaDefs.get(info.name) ?? reportRollupPolicy(info.name);
    let status: CartaDefStatus;
    let nestedNamespace: NestedNamespace | undefined;
    let disposition: CartaDefDisposition | undefined;
    let reason: string | undefined;

    if (policy?.override === true) {
      status = policy.role;
      if (policy.role === "nested-obj") nestedNamespace = "carta";
      disposition = policy.role;
      reason = policy.reason;
    } else if (policy?.role === "value-type") {
      status = "value-type";
      disposition = policy.role;
      reason = policy.reason;
    } else if (info.inboundRefs.length > 0 || policy?.role === "nested-obj") {
      status = "nested-obj";
      nestedNamespace = "carta";
    } else if (directRoot || directSlots.length > 0) status = "direct";
    else if (
      typeOnlySlots.length > 0 ||
      typeEdges.some((edge) => rootOf(edge.target) === info.name)
    ) {
      status = "nested-obj";
      nestedNamespace = "ocf";
      disposition = "nested-obj";
      reason = "Only OCF reusable type mapping evidence; not a standalone target.";
    } else if (
      deferredSlots.length > 0 ||
      deferredEdges.some((edge) => rootOf(edge.target) === info.name)
    )
      status = "deferred";
    else if (policy) {
      status = policy.role;
      disposition = policy.role;
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
      structuralSlots,
      emptySlots,
      structuralParents,
      status,
      nestedNamespace,
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
  const definitionRoleCounts = Object.fromEntries(
    CARTA_DEF_STATUS_ORDER.map((status) => [status, countStatus(status)])
  ) as Record<CartaDefStatus, number>;
  const metrics: InverseCoverageMetrics = {
    totalDefs: schema.defs.size,
    objectDefs: defRows.length,
    definitionRoleCounts,
    objectSlots: slots.length,
    directDefs: countStatus("direct"),
    directSlots: slots.filter((slot) => slot.status === "direct").length,
    typeOnlyDefs: defRows.filter((row) => row.typeOnlySlots.length > 0).length,
    typeOnlyOnlyDefs: defRows.filter(
      (row) =>
        row.typeOnlySlots.length > 0 &&
        row.directSlots.length === 0 &&
        row.implicitSlots.length === 0 &&
        row.deferredSlots.length === 0 &&
        row.structuralSlots.length === 0
    ).length,
    typeOnlySlots: slots.filter((slot) => slot.status === "type-only").length,
    implicitSlots: slots.filter((slot) => slot.status === "implicit").length,
    deferredSlots: slots.filter((slot) => slot.status === "deferred").length,
    structuralSlots: slots.filter((slot) => slot.status === "structural").length,
    emptySlots: slots.filter((slot) => slot.status === "empty").length,
    nestedObjDefs: countStatus("nested-obj"),
    reportRollupDefs: countStatus("report-rollup"),
    curatedValueTypeEntries: [...corpus.coveragePolicy.cartaDefs.values()].filter(
      (entry) => entry.role === "value-type"
    ).length,
    valueTypeDefs: countStatus("value-type"),
    alternateDefs: countStatus("alternate"),
    vendorFamilyDefs: countStatus("vendor-family"),
    workflowGapDefs: countStatus("workflow-gap"),
    actionableGapDefs:
      countStatus("gap") + countStatus("vendor-family") + countStatus("workflow-gap"),
    reviewDefs: countStatus("review"),
    inverseRoleCounts: Object.fromEntries(
      (
        [
          "record-construction",
          "reference-only",
          "state-projection",
          "aggregate-projection",
          "event-reconstruction",
        ] as InverseRole[]
      ).map((role) => [
        role,
        directEdges.filter((edge) => inverseRoleForEdge(edge) === role).length,
      ])
    ) as Record<InverseRole, number>,
  };

  const typeCorrespondences = buildTypeCorrespondences(corpus, schema, edges);
  const ledger: InverseCoverageLedger = {
    schema,
    edges,
    structuralEdges,
    slots,
    defs: defRows.sort((a, b) => a.name.localeCompare(b.name)),
    typeCorrespondences,
    metrics,
    excludedRoleRows: [],
    candidates: candidates.sort((a, b) => a.name.localeCompare(b.name)),
  };
  ledger.excludedRoleRows = excludedInverseRoleRows(corpus.coveragePolicy, ledger);
  return ledger;
}

/**
 * Return the definitions intentionally omitted from inverse-gap follow-up.
 * Value-type policy entries include scalar wrappers that are not object-like;
 * nested rows name the immediate parent and, when available, the mapped parent
 * that provides coverage. Nested objects remain excluded even when no mapped
 * parent evidence exists.
 */
export function excludedInverseRoleRows(
  policy: CoveragePolicy,
  inverse: InverseCoverageLedger
): InverseExcludedRoleRow[] {
  const rows: InverseExcludedRoleRow[] = [];
  for (const [name, entry] of [...policy.cartaDefs.entries()]
    .filter(([, policy]) => policy.role === "value-type")
    .sort(([a], [b]) => a.localeCompare(b))) {
    const correspondence = inverse.typeCorrespondences
      .filter((row) => row.sourceType === name)
      .map((row) => row.targetType)
      .sort();
    rows.push({
      role: "value-type",
      name,
      coveredThrough: correspondence.length
        ? `type correspondence: ${correspondence.join(", ")}`
        : "owning Carta object properties; not a standalone entity",
      reason: entry.reason,
    });
  }
  for (const row of inverse.defs
    .filter((definition) => definition.status === "nested-obj")
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const info = inverse.schema.defs.get(row.name);
    const immediateParents = (info?.inboundRefs ?? []).map((ref) => ref.from).sort();
    const coveredThrough = row.structuralParents.length
      ? row.structuralParents.join(", ")
      : immediateParents.join(", ") || "—";
    rows.push({
      role: "nested-obj",
      name: row.name,
      coveredThrough,
      nestedNamespace: row.nestedNamespace,
      reason:
        row.nestedNamespace === "ocf"
          ? "Nested OCF type; type mapping evidence is not a standalone Carta target."
          : row.structuralParents.length
          ? "Nested Carta object; covered through mapped parent(s)."
          : "Nested Carta object; no mapped parent coverage established, but not a standalone target.",
    });
  }
  for (const [name, entry] of [...policy.cartaDefs.entries()]
    .filter(([, policy]) => policy.role === "nested-obj")
    .sort(([a], [b]) => a.localeCompare(b))) {
    if (rows.some((row) => row.name === name)) continue;
    const inboundParents = (inverse.schema.defs.get(name)?.inboundRefs ?? [])
      .map((ref) => ref.from)
      .sort();
    rows.push({
      role: "nested-obj",
      name,
      coveredThrough: inboundParents.join(", ") || "curated nested role",
      nestedNamespace: "carta",
      reason: entry.reason,
    });
  }
  return rows;
}
