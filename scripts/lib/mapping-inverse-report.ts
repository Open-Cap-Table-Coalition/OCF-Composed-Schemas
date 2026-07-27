import {
  CartaDefCoverage,
  InverseCoverageLedger,
  InverseExcludedRoleRow,
  groupInverseExcludedRoleRows,
  isInverseMappedDefinition,
  inverseCoverageStory,
} from "./inverse-coverage.js";
import { MappingEdge } from "./core-corpus.js";
import { targetPointerParts } from "./mapping-report.js";
import { questionPropertyRoot, questionTargetParts } from "./mapping-questions.js";
import type { MappingQuestion } from "./mapping-questions.js";
import type { RawSchema } from "./registry.js";
import type { InverseRole } from "./inverse-semantics.js";

interface InverseFlow {
  file: string;
  sourceKind: MappingEdge["sourceKind"];
  sourceField: string;
  kind: string;
  pointer: string;
  inverseRole?: InverseRole;
  inverseNote?: string;
  context?: string;
  /**
   * The route variants that produced this flow. The main report deliberately
   * collapses identical destinations to `[shared]`, but subtype projections
   * need to know that the same flow applies to each branch.
   */
  routeVariants?: string[];
}

interface TargetGroup {
  object: string;
  flows: Map<string, InverseFlow[]>;
}

export interface MappingInverseReportOptions {
  /** The shared Carta-side ledger used by every inverse report. */
  inverse: InverseCoverageLedger;
  /** Number of parseable mapping documents in the repository. */
  sourceDocuments?: number;
  /** Number of green Carta mapping documents in the repository. */
  greenDocuments?: number;
  targetObject?: string;
  /** Parsed mapping documents, used to attach open questions to inverse flows. */
  mappingDocuments?: ReadonlyMap<string, MappingQuestionDocument>;
  /** Include the verbose related-object flow tables in the text report. */
  includeRelatedObjectPropertyFlows?: boolean;
  /** Render standalone target panels as compact target-first aggregate ledgers. */
  compactAggregateTrees?: boolean;
}

export interface MappingFlowSvgOptions {
  inverse: InverseCoverageLedger;
  targetObject?: string;
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>;
}

interface MappingQuestionDocument {
  questions?: readonly MappingQuestion[];
  mapping?: Record<string, unknown>;
  sourceSchema?: RawSchema;
}

interface RouteBranch {
  label: string;
  when: string[];
}

interface RouteAxis {
  file: string;
  discriminator: string;
  branches: RouteBranch[];
}

interface RouteFlavor {
  file: string;
  label: string;
  discriminator: string;
  when: string[];
  properties: string[];
}

interface TargetChildRef {
  name: string;
  cardinality: "object" | "array";
}

interface TargetVariant {
  property: string;
  child: TargetChildRef;
  flows: InverseFlow[];
}

interface SourceRoute {
  file: string;
  label: string;
  discriminator?: string;
  when?: string[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function edgeSourceField(edge: MappingEdge): string {
  if (edge.field) return edge.field;
  if (edge.detail === "primary_targets") return "(primary target)";
  if (edge.scope === "structural") return `(contains ${edge.detail ?? "child object"})`;
  if (edge.scope === "composite") return "(composite step)";
  if (edge.scope === "constant") return "(constant)";
  return "(target route)";
}

function edgeKind(edge: MappingEdge): string {
  if (edge.kind) return edge.kind;
  if (edge.detail === "primary_targets") return "route";
  return edge.scope;
}

function edgeContext(edge: MappingEdge): string | undefined {
  if (edge.scope === "composite" && edge.detail) return edge.detail;
  return edge.variant === "—" ? undefined : edge.variant;
}

function flowLabel(flow: InverseFlow): string {
  const context = flow.context ? ` [${flow.context}]` : "";
  const inverse = flow.inverseRole ? `; inverse: ${flow.inverseRole}` : "";
  return `[${flow.sourceKind}] ${flow.file} :: ${flow.sourceField}${context} (${flow.kind}${inverse})`;
}

interface FlowDetail {
  label: string;
  children?: string[];
  childNodes?: FlowNode[];
  kind?: "union-dispatch";
}

function mappingEntryForFlow(
  flow: InverseFlow,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): Record<string, unknown> | undefined {
  const mapping = mappingDocuments?.get(flow.file)?.mapping;
  if (!mapping || !flow.sourceField || flow.sourceField.startsWith("(")) return undefined;
  const fields = mapping.fields;
  if (!isPlainObject(fields)) return undefined;
  const entry = fields[flow.sourceField];
  return isPlainObject(entry) ? entry : undefined;
}

function schemaLabel(ref: string): string {
  return (
    ref
      .split(/[/?#]/)
      .pop()
      ?.replace(/\.schema\.json$/, "")
      .replace(/\.mapping\.md$/, "") ?? ref
  );
}

function unionBranchDetails(
  sourceSchema: RawSchema | undefined,
  field: string
): FlowDetail | undefined {
  const property = sourceSchema?.properties?.[field];
  if (!isPlainObject(property)) return undefined;
  const branches = [property.oneOf, property.anyOf].find(Array.isArray);
  if (!Array.isArray(branches) || branches.length < 2) return undefined;
  return {
    label: `dispatches exactly one ${field}.type branch (mutually exclusive)`,
    kind: "union-dispatch",
  };
}

function flowDetails(
  flow: InverseFlow,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): FlowDetail[] {
  const document = mappingDocuments?.get(flow.file);
  const entry = mappingEntryForFlow(flow, mappingDocuments);
  const details: FlowDetail[] = [];
  if (flow.inverseRole && flow.inverseRole !== "record-construction") {
    details.push({
      label: `inverse semantics: ${flow.inverseRole}${
        flow.inverseNote ? ` — ${flow.inverseNote}` : ""
      }`,
    });
  }
  const sourceType = document?.sourceSchema?.properties?.type?.const;
  if (typeof sourceType === "string") {
    details.push({ label: `active when type = ${sourceType}` });
  }

  if (flow.sourceKind === "object" && entry?.kind === "sequential_transform") {
    const steps = Array.isArray(entry.steps) ? entry.steps : [];
    const select = steps[0];
    const apply = steps[1];
    if (isPlainObject(select) && isPlainObject(select.where)) {
      const source = typeof select.source === "string" ? select.source : "";
      const path = typeof select.where.path === "string" ? select.where.path : "";
      const equals = typeof select.where.equals === "string" ? select.where.equals : "";
      const selectedMapping =
        isPlainObject(apply) && typeof apply.mapping === "string"
          ? schemaLabel(apply.mapping)
          : "the selected nested type";
      if (source && path && equals) {
        details.push({
          label: `selects ${selectedMapping} where ${[source, path]
            .join("")
            .replaceAll("/", ".")
            .replace(/^\./, "")} = ${equals}`,
        });
      }
    }
  }

  const union = unionBranchDetails(document?.sourceSchema, flow.sourceField);
  if (union) details.push(union);
  return details;
}

function flowRank(
  flow: InverseFlow,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): number {
  const document = mappingDocuments?.get(flow.file);
  if (unionBranchDetails(document?.sourceSchema, flow.sourceField)) return 0;
  if (typeof document?.sourceSchema?.properties?.type?.const === "string") return 1;
  return 2;
}

function directSourceRefs(node: unknown): string[] {
  if (!isPlainObject(node)) return [];
  if (typeof node.$ref === "string") return [node.$ref];
  if (node.items !== undefined) return directSourceRefs(node.items);
  const refs: string[] = [];
  for (const key of ["oneOf", "anyOf", "allOf"] as const) {
    const branches = node[key];
    if (!Array.isArray(branches)) continue;
    for (const branch of branches) refs.push(...directSourceRefs(branch));
  }
  return [...new Set(refs)];
}

function mappingPathForRef(
  ref: string,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): string | undefined {
  for (const [path, document] of mappingDocuments ?? []) {
    if (document.sourceSchema?.$id === ref) return path;
  }
  const label = schemaLabel(ref);
  for (const [path, document] of mappingDocuments ?? []) {
    if (document.sourceSchema?.$id && schemaLabel(document.sourceSchema.$id) === label) {
      return path;
    }
  }
  return undefined;
}

function nestedMappingPaths(
  flow: InverseFlow,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): string[] {
  const document = mappingDocuments?.get(flow.file);
  const paths: string[] = [];
  const entry = mappingEntryForFlow(flow, mappingDocuments);
  if (flow.sourceKind === "object" && entry?.kind === "sequential_transform") {
    const steps = Array.isArray(entry.steps) ? entry.steps : [];
    const apply = steps[1];
    if (isPlainObject(apply) && typeof apply.mapping === "string") paths.push(apply.mapping);
  }
  const sourceNode = document?.sourceSchema?.properties?.[flow.sourceField];
  for (const ref of directSourceRefs(sourceNode)) {
    const path = mappingPathForRef(ref, mappingDocuments);
    if (path) paths.push(path);
  }
  return [...new Set(paths)];
}

interface FlowNode {
  flow: InverseFlow;
  children: FlowNode[];
}

function buildFlowForest(
  flows: InverseFlow[],
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): FlowNode[] {
  const nodes = flows.map((flow) => ({ flow, children: [] as FlowNode[] }));
  const parents = new Set<FlowNode>();
  for (const node of nodes) {
    const nestedPaths = new Set(nestedMappingPaths(node.flow, mappingDocuments));
    if (nestedPaths.size === 0) continue;
    for (const child of nodes) {
      if (child === node || !nestedPaths.has(child.flow.file)) continue;
      if (!node.children.includes(child)) node.children.push(child);
      parents.add(child);
    }
  }
  const rank = (node: FlowNode): number => flowRank(node.flow, mappingDocuments);
  for (const node of nodes)
    node.children.sort(
      (left, right) =>
        rank(left) - rank(right) || flowLabel(left.flow).localeCompare(flowLabel(right.flow))
    );
  return nodes
    .filter((node) => !parents.has(node))
    .sort(
      (left, right) =>
        rank(left) - rank(right) || flowLabel(left.flow).localeCompare(flowLabel(right.flow))
    );
}

interface ReportQuestion {
  file: string;
  question: MappingQuestion;
}

function questionMatchesSourceField(question: MappingQuestion, sourceField: string): boolean {
  if (question.property === null || question.target !== null) return false;
  const path = question.property;
  if (path.startsWith("/")) return questionPropertyRoot(path) === sourceField;
  return (
    path === sourceField ||
    path.startsWith(`${sourceField}.`) ||
    path.startsWith(`${sourceField}[]`)
  );
}

function questionMatchesTargetField(
  question: MappingQuestion,
  object: string,
  field: string
): boolean {
  const target = question.target === null ? null : questionTargetParts(question.target);
  return target?.object === object && target.property === field;
}

function openQuestionsForFlows(
  flows: readonly InverseFlow[],
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined,
  predicate: (question: MappingQuestion, flow: InverseFlow) => boolean
): ReportQuestion[] {
  if (!mappingDocuments) return [];
  const found = new Map<string, ReportQuestion>();
  for (const flow of flows) {
    const questions = mappingDocuments.get(flow.file)?.questions ?? [];
    for (const question of questions) {
      if (question.answered || !predicate(question, flow)) continue;
      const key = `${flow.file}:${question.line}`;
      if (!found.has(key)) found.set(key, { file: flow.file, question });
    }
  }
  return [...found.values()].sort(
    (left, right) => left.file.localeCompare(right.file) || left.question.line - right.question.line
  );
}

function openQuestionsForTargetField(
  object: string,
  field: string,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): ReportQuestion[] {
  if (!mappingDocuments) return [];
  const found = new Map<string, ReportQuestion>();
  for (const [file, document] of mappingDocuments) {
    for (const question of document.questions ?? []) {
      if (question.answered || !questionMatchesTargetField(question, object, field)) continue;
      const key = `${file}:${question.line}`;
      if (!found.has(key)) found.set(key, { file, question });
    }
  }
  return [...found.values()].sort(
    (left, right) => left.file.localeCompare(right.file) || left.question.line - right.question.line
  );
}

function questionLabel(reportQuestion: ReportQuestion): string {
  const { file, question } = reportQuestion;
  return `? open question: ${question.question} [asked by ${question.askedBy}; answer: ${question.answer}; ${file}]`;
}

function compactQuestionLabel(reportQuestion: ReportQuestion): string {
  const { file, question } = reportQuestion;
  const prefix = "? open question: ";
  const suffix = ` [asked by ${question.askedBy}; ${mappingSourceName(file)}:${question.line}]`;
  const maxLength = 220;
  const available = Math.max(40, maxLength - prefix.length - suffix.length);
  const questionText =
    question.question.length > available
      ? `${question.question.slice(0, available - 1).trimEnd()}…`
      : question.question;
  return `${prefix}${questionText}${suffix}`;
}

function sameFlow(left: InverseFlow, right: InverseFlow): boolean {
  return (
    left.file === right.file &&
    left.sourceKind === right.sourceKind &&
    left.sourceField === right.sourceField &&
    left.kind === right.kind &&
    left.pointer === right.pointer &&
    left.inverseRole === right.inverseRole &&
    left.inverseNote === right.inverseNote &&
    left.context === right.context &&
    JSON.stringify(left.routeVariants ?? []) === JSON.stringify(right.routeVariants ?? [])
  );
}

function sameDestination(left: InverseFlow, right: InverseFlow): boolean {
  return (
    left.file === right.file &&
    left.sourceField === right.sourceField &&
    left.kind === right.kind &&
    left.pointer === right.pointer &&
    left.inverseRole === right.inverseRole &&
    left.inverseNote === right.inverseNote
  );
}

function addEdge(
  groups: Map<string, TargetGroup>,
  edge: MappingEdge,
  inverse: InverseCoverageLedger
): void {
  const parts = targetPointerParts(edge.target);
  const info = inverse.schema.defs.get(parts.object);
  // The inverse report is intentionally object-oriented. Scalar wrappers and
  // other non-entity defs remain accounted for by the shared ledger but do not
  // become object panels.
  if (!info?.isObjectLike) return;

  const field = parts.relative === parts.object ? "(object route)" : parts.relative;
  const routeVariant = edge.variant === "—" ? undefined : edge.variant;
  const flow: InverseFlow = {
    file: edge.rel,
    sourceKind: edge.sourceKind,
    sourceField: edgeSourceField(edge),
    kind: edgeKind(edge),
    pointer: edge.target,
    ...(edge.inverseRole ? { inverseRole: edge.inverseRole } : {}),
    ...(edge.inverseNote ? { inverseNote: edge.inverseNote } : {}),
    ...(edgeContext(edge) ? { context: edgeContext(edge) } : {}),
    ...(routeVariant ? { routeVariants: [routeVariant] } : {}),
  };
  const group = groups.get(parts.object) ?? { object: parts.object, flows: new Map() };
  const flows: InverseFlow[] = group.flows.get(field) ?? [];
  if (!flows.some((existing) => sameFlow(existing, flow))) {
    const sameDestinationFlow = flows.find((existing) => sameDestination(existing, flow));
    if (sameDestinationFlow) {
      const routeVariants = new Set([
        ...(sameDestinationFlow.routeVariants ?? []),
        ...(flow.routeVariants ?? []),
      ]);
      if (routeVariants.size > 0) sameDestinationFlow.routeVariants = [...routeVariants].sort();
      sameDestinationFlow.context = "shared";
    } else flows.push(flow);
  }
  group.flows.set(field, flows);
  groups.set(parts.object, group);
}

function buildGroups(inverse: InverseCoverageLedger): Map<string, TargetGroup> {
  const groups = new Map<string, TargetGroup>();
  for (const edge of inverse.edges) addEdge(groups, edge, inverse);
  for (const edge of inverse.structuralEdges ?? []) addEdge(groups, edge, inverse);
  return groups;
}

function targetObjectNames(inverse: InverseCoverageLedger): string[] {
  return [...inverse.schema.defs.values()]
    .filter((info) => info.isObjectLike)
    .map((info) => info.name)
    .sort();
}

function mappedDefinitions(inverse: InverseCoverageLedger): CartaDefCoverage[] {
  return inverse.defs
    .filter(isInverseMappedDefinition)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function followUpDefinitions(inverse: InverseCoverageLedger): CartaDefCoverage[] {
  return [...inverse.candidates].sort((a, b) => a.name.localeCompare(b.name));
}

function targetProperties(inverse: InverseCoverageLedger, object: string): string[] {
  return inverse.schema.defs.get(object)?.properties
    ? Object.keys(inverse.schema.defs.get(object)!.properties)
    : [];
}

function sortedTargetFields(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  includeUnmappedProperties = true
): string[] {
  const fields = new Set(includeUnmappedProperties ? targetProperties(inverse, object) : []);
  for (const field of group.flows.keys()) fields.add(field);
  return [...fields].sort((left, right) => {
    if (left === "(object route)") return -1;
    if (right === "(object route)") return 1;
    return left.localeCompare(right);
  });
}

function routeDiscriminator(mapping: Record<string, unknown>): string | undefined {
  const route = mapping.route_by_property;
  if (!isPlainObject(route)) return undefined;
  if (typeof route.on_property === "string") return route.on_property;
  if (!isPlainObject(route.lookup_by)) return undefined;
  const key = typeof route.lookup_by.key === "string" ? route.lookup_by.key : "?";
  const through = route.lookup_by.through;
  const property =
    isPlainObject(through) && typeof through.on_property === "string" ? through.on_property : "?";
  return `${key} → ${property} (lookup)`;
}

function mappingSourceName(file: string): string {
  return (
    file
      .split("/")
      .pop()
      ?.replace(/\.mapping\.md$/, "") ?? file
  );
}

function targetContainsObject(target: unknown, object: string): boolean {
  if (typeof target === "string") return target === `#/$defs/${object}`;
  if (Array.isArray(target)) return target.some((value) => targetContainsObject(value, object));
  if (!isPlainObject(target)) return false;
  return Object.values(target).some((value) => targetContainsObject(value, object));
}

function directTargetChildRefs(
  node: unknown,
  cardinality: "object" | "array" = "object"
): TargetChildRef[] {
  if (!isPlainObject(node)) return [];
  if (typeof node.$ref === "string") {
    const name = schemaLabel(node.$ref);
    return name ? [{ name, cardinality }] : [];
  }

  if (node.items !== undefined) return directTargetChildRefs(node.items, "array");

  const refs: TargetChildRef[] = [];
  for (const key of ["oneOf", "anyOf", "allOf"] as const) {
    const branches = node[key];
    if (!Array.isArray(branches)) continue;
    for (const branch of branches) refs.push(...directTargetChildRefs(branch, cardinality));
  }
  return refs.filter(
    (ref, index) =>
      refs.findIndex(
        (candidate) => candidate.name === ref.name && candidate.cardinality === ref.cardinality
      ) === index
  );
}

function targetVariantLabel(variant: TargetVariant): string {
  const suffix = variant.child.cardinality === "array" ? "[]" : "";
  return `${variant.property}${suffix} → ${variant.child.name}`;
}

function targetVariantsForGroup(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger
): TargetVariant[] {
  const info = inverse.schema.defs.get(object);
  if (!info) return [];

  const variants: TargetVariant[] = [];
  for (const [property, rawProperty] of Object.entries(info.properties)) {
    const children = directTargetChildRefs(rawProperty);
    if (children.length === 0) continue;
    const structuralFlows = (group.flows.get(property) ?? []).filter(
      (flow) => flow.sourceKind === "object" && flow.kind === "structural"
    );
    for (const child of children) {
      const flows =
        children.length === 1
          ? structuralFlows
          : structuralFlows.filter((flow) => flow.sourceField.endsWith(`→ ${child.name})`));
      if (flows.length > 0) variants.push({ property, child, flows });
    }
  }

  return variants.sort(
    (left, right) =>
      left.property.localeCompare(right.property) || left.child.name.localeCompare(right.child.name)
  );
}

function routeLabelsForFlow(flow: InverseFlow): string[] {
  if (flow.routeVariants && flow.routeVariants.length > 0) return flow.routeVariants;
  if (flow.context && flow.context !== "shared") return [flow.context];
  return ["—"];
}

function sourceRouteFor(
  flow: InverseFlow,
  label: string,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>
): SourceRoute {
  const document = mappingDocuments.get(flow.file);
  const mapping = document?.mapping;
  const discriminator = mapping ? routeDiscriminator(mapping) : undefined;
  const rawVariant =
    label === "—" || !isPlainObject(mapping?.variants) ? undefined : mapping.variants[label];
  const when =
    isPlainObject(rawVariant) && Array.isArray(rawVariant.when)
      ? rawVariant.when.filter((value): value is string => typeof value === "string")
      : undefined;
  return {
    file: flow.file,
    label,
    ...(discriminator ? { discriminator } : {}),
    ...(when && when.length > 0 ? { when } : {}),
  };
}

function sourceRouteKey(route: SourceRoute): string {
  return `${route.file}\u0000${route.label}`;
}

function sourceRoutesForFlows(
  flows: readonly InverseFlow[],
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>
): SourceRoute[] {
  const routes = new Map<string, SourceRoute>();
  for (const flow of flows) {
    if (flow.sourceKind !== "object") continue;
    for (const label of routeLabelsForFlow(flow)) {
      const route = sourceRouteFor(flow, label, mappingDocuments);
      routes.set(sourceRouteKey(route), route);
    }
  }
  return [...routes.values()].sort(
    (left, right) =>
      mappingSourceName(left.file).localeCompare(mappingSourceName(right.file)) ||
      left.label.localeCompare(right.label)
  );
}

function sourceRouteDisplayName(route: SourceRoute): string {
  const source = mappingSourceName(route.file);
  return route.label === "—" ? source : `${source} [${route.label}]`;
}

function flowAppliesToRoute(flow: InverseFlow, route: SourceRoute): boolean {
  return flow.file === route.file && routeLabelsForFlow(flow).includes(route.label);
}

function sourceFieldsInTargetVariant(
  variant: TargetVariant,
  route: SourceRoute,
  groups: Map<string, TargetGroup>
): string[] {
  const childGroup = groups.get(variant.child.name);
  if (!childGroup) return [];
  const fields = new Set<string>();
  for (const flows of childGroup.flows.values()) {
    for (const flow of flows) {
      if (
        flow.sourceKind === "object" &&
        flow.kind !== "structural" &&
        flowAppliesToRoute(flow, route) &&
        !flow.sourceField.startsWith("(")
      ) {
        fields.add(flow.sourceField);
      }
    }
  }
  return [...fields].sort();
}

function parentSlotsForRoute(
  variant: TargetVariant,
  route: SourceRoute,
  group: TargetGroup
): string[] {
  const slots = new Set<string>();
  for (const [field, flows] of group.flows) {
    if (field === variant.property || field === "(object route)") continue;
    for (const flow of flows) {
      if (
        flow.sourceKind === "object" &&
        flow.kind !== "structural" &&
        flowAppliesToRoute(flow, route)
      ) {
        slots.add(field);
      }
    }
  }
  return [...slots].sort();
}

function markdownCell(value: string): string {
  return value.replaceAll("|", "\\|");
}

function markdownRouteLabel(route: SourceRoute): string {
  const name = sourceRouteDisplayName(route);
  return `<code>${markdownCell(name)}</code>`;
}

interface PropertyFlowRow {
  sourceField: string;
  targetField: string;
}

function propertyFlowsForVariant(
  variant: TargetVariant,
  route: SourceRoute,
  groups: Map<string, TargetGroup>
): PropertyFlowRow[] {
  const childGroup = groups.get(variant.child.name);
  if (!childGroup) return [];
  const rows = new Map<string, PropertyFlowRow>();
  for (const [targetField, flows] of childGroup.flows) {
    for (const flow of flows) {
      if (
        flow.sourceKind !== "object" ||
        flow.kind === "structural" ||
        !flowAppliesToRoute(flow, route) ||
        flow.sourceField.startsWith("(")
      ) {
        continue;
      }
      rows.set(`${flow.sourceField}\u0000${targetField}`, {
        sourceField: flow.sourceField,
        targetField,
      });
    }
  }
  return [...rows.values()].sort(
    (left, right) =>
      left.targetField.localeCompare(right.targetField) ||
      left.sourceField.localeCompare(right.sourceField)
  );
}

function parentPropertyFlowsForRoute(
  route: SourceRoute,
  group: TargetGroup,
  nestedProperties: ReadonlySet<string>
): PropertyFlowRow[] {
  const rows = new Map<string, PropertyFlowRow>();
  for (const [targetField, flows] of group.flows) {
    if (targetField === "(object route)" || nestedProperties.has(targetField)) continue;
    for (const flow of flows) {
      if (
        flow.sourceKind !== "object" ||
        flow.kind === "structural" ||
        !flowAppliesToRoute(flow, route) ||
        flow.sourceField.startsWith("(")
      ) {
        continue;
      }
      rows.set(`${flow.sourceField}\u0000${targetField}`, {
        sourceField: flow.sourceField,
        targetField,
      });
    }
  }
  return [...rows.values()].sort(
    (left, right) =>
      left.targetField.localeCompare(right.targetField) ||
      left.sourceField.localeCompare(right.sourceField)
  );
}

function renderPropertyFlowTable(
  title: string,
  propertyPrefix: string,
  rows: readonly { route: SourceRoute; flow: PropertyFlowRow }[],
  targetLabel: (field: string) => string
): string[] {
  const lines = [
    `#### ${title}`,
    "",
    "| OCF route | OCF property | → | Carta property |",
    "| --- | --- | --- | --- |",
  ];
  for (const row of rows) {
    lines.push(
      `| ${markdownRouteLabel(row.route)} | \`${markdownCell(
        row.flow.sourceField
      )}\` | → | \`${markdownCell(`${propertyPrefix}${targetLabel(row.flow.targetField)}`)}\` |`
    );
  }
  return lines;
}

function renderTargetVariantTables(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>,
  groups: Map<string, TargetGroup>
): string[] {
  const variants = targetVariantsForGroup(object, group, inverse);
  if (variants.length < 2) return [];

  const routes = sourceRoutesForFlows(
    variants.flatMap((variant) => variant.flows),
    mappingDocuments
  );
  const nestedProperties = new Set(variants.map((variant) => variant.property));
  const lines = [`### ${object}`, "", `Carta parent: \`${object}\``];
  variants.forEach((variant) => {
    const cardinality = variant.child.cardinality === "array" ? "[]" : "";
    const variantLabel = `${variant.property}${cardinality} → ${variant.child.name}`;
    const rows = routes.flatMap((route) =>
      propertyFlowsForVariant(variant, route, groups).map((flow) => ({ route, flow }))
    );
    lines.push(
      ...renderPropertyFlowTable(
        variantLabel,
        `${object}.${variant.property}${cardinality}.`,
        rows,
        (field) => field
      ),
      ""
    );
  });

  const parentRows = routes.flatMap((route) =>
    parentPropertyFlowsForRoute(route, group, nestedProperties).map((flow) => ({ route, flow }))
  );
  if (parentRows.length > 0) {
    lines.push(
      ...renderPropertyFlowTable(
        "Shared parent properties",
        `${object}.`,
        parentRows,
        (field) => field
      )
    );
  }
  return lines;
}

function routeAxesForGroup(
  group: TargetGroup,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): RouteAxis[] {
  if (!mappingDocuments) return [];
  const flows = [...group.flows.values()].flat();
  const axes: RouteAxis[] = [];

  for (const [file, document] of mappingDocuments) {
    const discriminator = document.mapping ? routeDiscriminator(document.mapping) : undefined;
    const variants = document.mapping?.variants;
    if (!discriminator || !isPlainObject(variants)) continue;

    const branches = Object.entries(variants)
      .map(([label, raw]) => {
        if (!isPlainObject(raw) || !Array.isArray(raw.when)) return undefined;
        const when = raw.when.filter((value): value is string => typeof value === "string");
        if (when.length === 0) return undefined;
        const relevant = flows.some(
          (flow) => flow.file === file && flow.routeVariants?.includes(label)
        );
        return relevant ? { label, when } : undefined;
      })
      .filter((branch): branch is RouteBranch => branch !== undefined);

    // A single surviving branch is still useful for coverage, but it is not a
    // subtype split. Keep the ordinary object panel for that case.
    if (branches.length < 2) continue;
    axes.push({ file, discriminator, branches });
  }

  return axes.sort(
    (left, right) =>
      left.discriminator.localeCompare(right.discriminator) || left.file.localeCompare(right.file)
  );
}

function flowsForRouteVariant(group: TargetGroup, file: string, label: string): TargetGroup {
  const flows = new Map<string, InverseFlow[]>();
  for (const [field, fieldFlows] of group.flows) {
    const selected = fieldFlows.filter(
      (flow) => flow.file === file && flow.routeVariants?.includes(label)
    );
    if (selected.length > 0) flows.set(field, selected);
  }
  return { object: group.object, flows };
}

function routeFlavorsForGroup(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>
): RouteFlavor[] {
  const flavors: RouteFlavor[] = [];
  for (const [file, document] of mappingDocuments) {
    const mapping = document.mapping;
    const discriminator = mapping ? routeDiscriminator(mapping) : undefined;
    const variants = mapping?.variants;
    if (!discriminator || !isPlainObject(variants)) continue;

    for (const [label, raw] of Object.entries(variants)) {
      if (!isPlainObject(raw) || !Array.isArray(raw.when)) continue;
      const when = raw.when.filter((value): value is string => typeof value === "string");
      if (when.length === 0 || !targetContainsObject(raw.primary_targets, object)) continue;
      const variantGroup = flowsForRouteVariant(group, file, label);
      const properties = sortedTargetFields(object, variantGroup, inverse, false).filter(
        (field) => field !== "(object route)"
      );
      flavors.push({ file, label, discriminator, when, properties });
    }
  }
  return flavors.sort(
    (left, right) => left.file.localeCompare(right.file) || left.label.localeCompare(right.label)
  );
}

function routeVariantProperties(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  file: string,
  label: string
): string[] {
  return sortedTargetFields(
    object,
    flowsForRouteVariant(group, file, label),
    inverse,
    false
  ).filter((field) => field !== "(object route)");
}

function renderObjectSummary(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>,
  groups: Map<string, TargetGroup>
): string[] {
  const flavors = routeFlavorsForGroup(object, group, inverse, mappingDocuments);
  const targetVariants = targetVariantsForGroup(object, group, inverse);
  const targetVariantRoutes = sourceRoutesForFlows(
    targetVariants.length >= 2
      ? [...group.flows.values()].flat().filter((flow) => flow.sourceKind === "object")
      : [],
    mappingDocuments
  );
  const targetVariantRouteKeys = new Set(targetVariantRoutes.map(sourceRouteKey));
  const remainingFlavors =
    targetVariantRoutes.length > 0
      ? flavors.filter(
          (flavor) =>
            !targetVariantRouteKeys.has(sourceRouteKey({ file: flavor.file, label: flavor.label }))
        )
      : flavors;
  const flavorFiles = new Set(flavors.map((flavor) => flavor.file));
  const axes = routeAxesForGroup(group, mappingDocuments).filter(
    (axis) => !flavorFiles.has(axis.file)
  );
  const lines: string[] = [];

  if (remainingFlavors.length > 0) {
    lines.push(
      `${
        targetVariantRoutes.length > 0
          ? "additional OCF source routes reaching parent object"
          : "resulting Carta object flavors"
      } (${remainingFlavors.length})`
    );
    remainingFlavors.forEach((flavor, index) => {
      const last = index === remainingFlavors.length - 1;
      const prefix = last ? "└── " : "├── ";
      const childPrefix = last ? "    " : "│   ";
      lines.push(`${prefix}${mappingSourceName(flavor.file)}.${flavor.label} → ${object}`);
      lines.push(
        `${childPrefix}├── when: ${mappingSourceName(flavor.file)}.${
          flavor.discriminator
        } = [${flavor.when.join(", ")}]`
      );
      lines.push(
        `${childPrefix}└── properties: ${
          flavor.properties.length > 0 ? flavor.properties.join(", ") : "(none directly mapped)"
        }`
      );
    });
  }

  if (axes.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push(`conditional property flows (${axes.length} discriminators)`);
    axes.forEach((axis, axisIndex) => {
      const lastAxis = axisIndex === axes.length - 1;
      const axisPrefix = lastAxis ? "    " : "│   ";
      lines.push(
        `${lastAxis ? "└── " : "├── "}${mappingSourceName(axis.file)} :: ${axis.discriminator}`
      );
      const groups = new Map<string, RouteBranch[]>();
      for (const branch of axis.branches) {
        const properties = routeVariantProperties(object, group, inverse, axis.file, branch.label);
        const key = properties.join("\u0000");
        const branches = groups.get(key) ?? [];
        branches.push(branch);
        groups.set(key, branches);
      }
      const entries = [...groups.entries()];
      entries.forEach(([key, branches], entryIndex) => {
        const properties = key.length > 0 ? key.split("\u0000") : ["(route only)"];
        const condition = branches
          .map((branch) => `${branch.label} [${branch.when.join(", ")}]`)
          .join(" or ");
        const lastEntry = entryIndex === entries.length - 1;
        lines.push(
          `${axisPrefix}${lastEntry ? "└── " : "├── "}${condition} → ${properties.join(", ")}`
        );
      });
    });
  }

  return lines;
}

function renderRelatedObjectDiagrams(
  rows: readonly CartaDefCoverage[],
  groups: Map<string, TargetGroup>,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>
): string[] {
  const diagrams = rows
    .map((row) =>
      renderTargetVariantTables(
        row.name,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse,
        mappingDocuments,
        groups
      )
    )
    .filter((diagram) => diagram.length > 0);
  if (diagrams.length === 0) return [];

  const lines = [
    "",
    "<!-- mapping-flow:start -->",
    `## Related object property flows (${diagrams.length} groups)`,
    "Only OCF routes that populate a nested variant are shown. Each row is one explicit source-property → target-property mapping; parent-only routes remain in the audit panels.",
  ];
  diagrams.forEach((diagram) => lines.push("", ...diagram));
  lines.push("<!-- mapping-flow:end -->");
  return lines;
}

function svgEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function svgSlug(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

function svgWrap(value: string, maxChars: number): string[] {
  if (value.length <= maxChars) return [value];
  const lines: string[] = [];
  let remaining = value;
  while (remaining.length > maxChars) {
    let split = remaining.lastIndexOf(".", maxChars);
    if (split < Math.floor(maxChars * 0.55)) split = remaining.lastIndexOf("/", maxChars);
    if (split < Math.floor(maxChars * 0.55)) split = maxChars;
    else split += 1;
    lines.push(remaining.slice(0, split));
    remaining = remaining.slice(split);
  }
  if (remaining.length > 0) lines.push(remaining);
  return lines;
}

function svgText(
  value: string,
  x: number,
  y: number,
  options: {
    className?: string;
    fill?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    maxChars?: number;
    anchor?: "start" | "middle" | "end";
  } = {}
): string {
  const lines = svgWrap(value, options.maxChars ?? 48);
  const className = options.className ? ` class="${options.className}"` : "";
  const fill = options.fill ? ` fill="${options.fill}"` : "";
  const fontSize = options.fontSize ? ` font-size="${options.fontSize}"` : "";
  const fontWeight = options.fontWeight ? ` font-weight="${options.fontWeight}"` : "";
  const anchor = options.anchor ? ` text-anchor="${options.anchor}"` : "";
  const lineHeight = options.lineHeight ?? 18;
  return `<text x="${x}" y="${y}"${className}${fill}${fontSize}${fontWeight}${anchor}>${lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${svgEscape(line)}</tspan>`
    )
    .join("")}</text>`;
}

interface SvgGraphPropertyFlow {
  route: SourceRoute;
  sourceField: string;
  targetKey: string;
  targetField: string;
  targetLabel: string;
}

interface SvgGraphSourceRow {
  sourceField: string;
  flows: SvgGraphPropertyFlow[];
}

interface SvgGraphSourceNode {
  route: SourceRoute;
  rows: SvgGraphSourceRow[];
  x: number;
  y: number;
  width: number;
  height: number;
  headerHeight: number;
  rowAnchors: Map<string, number>;
}

interface SvgGraphTargetNode {
  key: string;
  title: string;
  stereotype: string;
  fields: string[];
  relations?: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  rowAnchors: Map<string, number>;
  relationAnchors: Map<string, number>;
}

interface SvgGraphContainmentEdge {
  route: SourceRoute;
  targetKey: string;
  label: string;
}

interface SvgGraphMappingLaneGroup {
  route: SourceRoute;
  flows: SvgGraphPropertyFlow[];
  anchorY: number;
  rowAnchors: Map<string, number>;
}

interface SvgGraphMappingLane {
  targetKey: string;
  title: string;
  mappingCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
  headerHeight: number;
  groups: SvgGraphMappingLaneGroup[];
}

function svgVariantKey(variant: TargetVariant): string {
  return `${variant.property}\u0000${variant.child.name}`;
}

function svgTargetAnchorKey(targetKey: string, field: string): string {
  return `${targetKey}\u0000${field}`;
}

function svgGraphPropertyFlowKey(flow: SvgGraphPropertyFlow): string {
  return `${sourceRouteKey(flow.route)}\u0000${flow.targetKey}\u0000${flow.sourceField}\u0000${
    flow.targetField
  }`;
}

function svgGraphInteractiveKey(value: string): string {
  return value.replaceAll("\u0000", "|");
}

function svgRouteCondition(route: SourceRoute): string | undefined {
  return route.discriminator && route.when && route.when.length > 0
    ? `when ${route.discriminator} = ${route.when.join(" or ")}`
    : undefined;
}

function svgGraphPropertyFlowsForRoute(
  object: string,
  route: SourceRoute,
  variants: readonly TargetVariant[],
  group: TargetGroup,
  groups: Map<string, TargetGroup>
): SvgGraphPropertyFlow[] {
  const flows = new Map<string, SvgGraphPropertyFlow>();
  for (const variant of variants) {
    const targetKey = svgVariantKey(variant);
    const cardinality = variant.child.cardinality === "array" ? "[]" : "";
    const targetPrefix = `${object}.${variant.property}${cardinality}.`;
    for (const flow of propertyFlowsForVariant(variant, route, groups)) {
      const key = `${flow.sourceField}\u0000${targetKey}\u0000${flow.targetField}`;
      flows.set(key, {
        route,
        sourceField: flow.sourceField,
        targetKey,
        targetField: flow.targetField,
        targetLabel: `${targetPrefix}${flow.targetField}`,
      });
    }
  }

  const nestedProperties = new Set(variants.map((variant) => variant.property));
  for (const flow of parentPropertyFlowsForRoute(route, group, nestedProperties)) {
    const key = `${flow.sourceField}\u0000parent\u0000${flow.targetField}`;
    flows.set(key, {
      route,
      sourceField: flow.sourceField,
      targetKey: "parent",
      targetField: flow.targetField,
      targetLabel: `${object}.${flow.targetField}`,
    });
  }
  return [...flows.values()].sort(
    (left, right) =>
      left.sourceField.localeCompare(right.sourceField) ||
      left.targetLabel.localeCompare(right.targetLabel)
  );
}

function svgGraphContainmentEdges(
  variants: readonly TargetVariant[],
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>
): SvgGraphContainmentEdge[] {
  const edges = new Map<string, SvgGraphContainmentEdge>();
  for (const variant of variants) {
    const targetKey = svgVariantKey(variant);
    const cardinality = variant.child.cardinality === "array" ? "[]" : "";
    for (const flow of variant.flows) {
      if (flow.sourceKind !== "object" || flow.kind !== "structural") continue;
      for (const label of routeLabelsForFlow(flow)) {
        const route = sourceRouteFor(flow, label, mappingDocuments);
        const key = `${sourceRouteKey(route)}\u0000${targetKey}`;
        edges.set(key, {
          route,
          targetKey,
          label: `${variant.property}${cardinality} → ${variant.child.name}`,
        });
      }
    }
  }
  return [...edges.values()].sort(
    (left, right) =>
      sourceRouteDisplayName(left.route).localeCompare(sourceRouteDisplayName(right.route)) ||
      left.label.localeCompare(right.label)
  );
}

function svgGraphNodeTitleLines(
  stereotype: string,
  title: string,
  maxChars: number
): { lines: string[]; headerHeight: number } {
  const titleLines = svgWrap(title, maxChars);
  return {
    lines: [stereotype, ...titleLines],
    headerHeight: 22 + titleLines.length * 20 + 8,
  };
}

function svgGraphPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options: {
    color: string;
    markerEnd: string;
    dash?: string;
    markerStart?: string;
    width?: number;
    className?: string;
    data?: Readonly<Record<string, string>>;
  }
): string {
  const controlX = x1 + (x2 - x1) * 0.52;
  const dash = options.dash ? ` stroke-dasharray="${options.dash}"` : "";
  const markerStart = options.markerStart ? ` marker-start="url(#${options.markerStart})"` : "";
  const className = options.className ? ` class="${svgEscape(options.className)}"` : "";
  const data = Object.entries(options.data ?? {})
    .map(([key, value]) => ` data-${svgEscape(key)}="${svgEscape(value)}"`)
    .join("");
  return `<path${className}${data} d="M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}" fill="none" stroke="${
    options.color
  }" stroke-width="${options.width ?? 2}"${dash}${markerStart} marker-end="url(#${
    options.markerEnd
  })"/>`;
}

function svgGraphNodeRect(
  node: SvgGraphTargetNode | SvgGraphSourceNode,
  fill: string,
  stroke: string,
  options: {
    className?: string;
    data?: Readonly<Record<string, string>>;
    rx?: number;
    strokeWidth?: number;
  } = {}
): string {
  const className = options.className ? ` class="${svgEscape(options.className)}"` : "";
  const data = Object.entries(options.data ?? {})
    .map(([key, value]) => ` data-${svgEscape(key)}="${svgEscape(value)}"`)
    .join("");
  return `<rect${className}${data} x="${node.x}" y="${node.y}" width="${node.width}" height="${
    node.height
  }" rx="${options.rx ?? 10}" fill="${fill}" stroke="${stroke}" stroke-width="${
    options.strokeWidth ?? 2
  }"/>`;
}

function svgGraphMappingLanes(
  object: string,
  targetLayouts: readonly SvgGraphTargetNode[],
  propertyFlows: readonly SvgGraphPropertyFlow[],
  x: number,
  width: number,
  startY: number,
  nodeGap: number
): SvgGraphMappingLane[] {
  const lanes: SvgGraphMappingLane[] = [];
  let y = startY;
  for (const target of targetLayouts) {
    const targetFlows = propertyFlows.filter((flow) => flow.targetKey === target.key);
    if (targetFlows.length === 0) continue;
    const grouped = new Map<string, { route: SourceRoute; flows: SvgGraphPropertyFlow[] }>();
    for (const flow of targetFlows) {
      const routeKey = sourceRouteKey(flow.route);
      const group = grouped.get(routeKey) ?? { route: flow.route, flows: [] };
      group.flows.push(flow);
      grouped.set(routeKey, group);
    }
    const groups = [...grouped.values()]
      .map((group) => ({
        ...group,
        flows: group.flows.sort(
          (left, right) =>
            left.targetField.localeCompare(right.targetField) ||
            left.sourceField.localeCompare(right.sourceField)
        ),
      }))
      .sort((left, right) =>
        sourceRouteDisplayName(left.route).localeCompare(sourceRouteDisplayName(right.route))
      );
    const title = target.key === "parent" ? `${object} parent` : target.title;
    const titleLayout = svgGraphNodeTitleLines("«mapping lane»", title, 44);
    const headerHeight = titleLayout.headerHeight + 24;
    let cursor = y + headerHeight + 12;
    const laneGroups: SvgGraphMappingLaneGroup[] = [];
    for (const group of groups) {
      const anchorY = cursor + 10;
      const rowAnchors = new Map<string, number>();
      const rowStart = cursor + 24;
      group.flows.forEach((flow, index) => {
        rowAnchors.set(svgGraphPropertyFlowKey(flow), rowStart + index * 24 + 12);
      });
      cursor = rowStart + group.flows.length * 24 + 8;
      laneGroups.push({ route: group.route, flows: group.flows, anchorY, rowAnchors });
    }
    const height = cursor - y + 10;
    lanes.push({
      targetKey: target.key,
      title,
      mappingCount: targetFlows.length,
      x,
      y,
      width,
      height,
      headerHeight,
      groups: laneGroups,
    });
    y += height + nodeGap;
  }
  return lanes;
}

function renderMappingStructuralSvg(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>,
  groups: Map<string, TargetGroup>
): string {
  const variants = targetVariantsForGroup(object, group, inverse);
  const allObjectFlows = [...group.flows.values()]
    .flat()
    .filter((flow) => flow.sourceKind === "object");
  const routes = sourceRoutesForFlows(allObjectFlows, mappingDocuments);
  const nestedProperties = new Set(variants.map((variant) => variant.property));
  const parentRows = routes.flatMap((route) =>
    parentPropertyFlowsForRoute(route, group, nestedProperties).map((flow) => ({ route, flow }))
  );
  const sharedFields = [...new Set(parentRows.map((row) => row.flow.targetField))].sort();
  const propertyFlows = routes.flatMap((route) =>
    svgGraphPropertyFlowsForRoute(object, route, variants, group, groups)
  );
  const denseGraph = sharedFields.length >= 20 || propertyFlows.length >= 28;
  const containmentEdges = svgGraphContainmentEdges(variants, mappingDocuments);
  const sourceRows = routes.map((route) => {
    const flows = propertyFlows.filter(
      (flow) => sourceRouteKey(flow.route) === sourceRouteKey(route)
    );
    const byField = new Map<string, SvgGraphPropertyFlow[]>();
    for (const flow of flows)
      byField.set(flow.sourceField, [...(byField.get(flow.sourceField) ?? []), flow]);
    const rows = [...byField.entries()]
      .map(([sourceField, fieldFlows]) => ({
        sourceField,
        flows: fieldFlows.sort((left, right) => left.targetLabel.localeCompare(right.targetLabel)),
      }))
      .sort((left, right) => left.sourceField.localeCompare(right.sourceField));
    return {
      route,
      rows: rows.length > 0 ? rows : [{ sourceField: "(structural route only)", flows: [] }],
    };
  });

  const width = 2700;
  const sourceX = 70;
  const sourceWidth = 650;
  const targetX = 1740;
  const targetWidth = 880;
  const targetIndent = 42;
  const targetVariantWidth = targetWidth - targetIndent;
  const titleHeight = 150;
  const nodeGap = 34;
  const targetNodeGap = 24;
  const rowHeight = 34;
  const sourceLayouts: SvgGraphSourceNode[] = [];
  let sourceY = titleHeight + 44;
  for (const source of sourceRows) {
    const title = sourceRouteDisplayName(source.route);
    const condition = svgRouteCondition(source.route);
    const titleLayout = svgGraphNodeTitleLines("«OCF route»", title, 48);
    const conditionLines = condition ? svgWrap(condition, 72) : [];
    const headerHeight =
      titleLayout.headerHeight + (conditionLines.length > 0 ? 12 + conditionLines.length * 16 : 0);
    const height = headerHeight + 14 + Math.max(1, source.rows.length) * rowHeight + 14;
    const rowAnchors = new Map<string, number>();
    source.rows.forEach((row, index) => {
      rowAnchors.set(
        row.sourceField,
        sourceY + headerHeight + 14 + index * rowHeight + rowHeight / 2
      );
    });
    sourceLayouts.push({
      route: source.route,
      rows: source.rows,
      x: sourceX,
      y: sourceY,
      width: sourceWidth,
      height,
      headerHeight,
      rowAnchors,
    });
    sourceY += height + nodeGap;
  }

  const parentRelations = variants.map((variant) => {
    const cardinality = variant.child.cardinality === "array" ? "[]" : "";
    return `${variant.property}${cardinality}: ${variant.child.name}`;
  });
  const parentTitleLayout = svgGraphNodeTitleLines("«Carta parent»", object, 52);
  const parentHeaderHeight = parentTitleLayout.headerHeight;
  const parentSectionHeaderHeight = 30;
  const parentSharedStart = titleHeight + 44 + parentHeaderHeight + 14;
  const parentSharedHeight = Math.max(1, sharedFields.length) * rowHeight;
  const parentRelationsStart =
    parentSharedStart + parentSectionHeaderHeight + parentSharedHeight + 12;
  const parentHeight =
    parentHeaderHeight +
    14 +
    parentSectionHeaderHeight +
    parentSharedHeight +
    12 +
    parentSectionHeaderHeight +
    Math.max(1, parentRelations.length) * rowHeight +
    16;
  const targetLayouts: SvgGraphTargetNode[] = [];
  const parentAnchors = new Map<string, number>();
  sharedFields.forEach((field, index) => {
    parentAnchors.set(
      svgTargetAnchorKey("parent", field),
      parentSharedStart + parentSectionHeaderHeight + index * rowHeight + rowHeight / 2
    );
  });
  const relationAnchors = new Map<string, number>();
  variants.forEach((variant, index) => {
    relationAnchors.set(
      svgVariantKey(variant),
      parentRelationsStart + index * rowHeight + rowHeight / 2
    );
  });
  const parentNode: SvgGraphTargetNode = {
    key: "parent",
    title: object,
    stereotype: "«Carta parent»",
    fields: sharedFields,
    relations: parentRelations,
    x: targetX,
    y: titleHeight + 44,
    width: targetWidth,
    height: parentHeight,
    rowAnchors: parentAnchors,
    relationAnchors,
  };
  targetLayouts.push(parentNode);

  let targetY = parentNode.y + parentNode.height + 54;
  const containedTypesLabelY = targetY - 22;
  for (const variant of variants) {
    const targetKey = svgVariantKey(variant);
    const variantFields = [
      ...new Set(
        propertyFlows.filter((flow) => flow.targetKey === targetKey).map((flow) => flow.targetField)
      ),
    ].sort();
    const title = `${variant.property}${variant.child.cardinality === "array" ? "[]" : ""} : ${
      variant.child.name
    }`;
    const titleLayout = svgGraphNodeTitleLines("«contained type»", title, 52);
    const height =
      titleLayout.headerHeight + 14 + Math.max(1, variantFields.length) * rowHeight + 16;
    const anchors = new Map<string, number>();
    variantFields.forEach((field, index) => {
      const anchor = targetY + titleLayout.headerHeight + 14 + index * rowHeight + rowHeight / 2;
      anchors.set(svgTargetAnchorKey(targetKey, field), anchor);
    });
    targetLayouts.push({
      key: targetKey,
      title,
      stereotype: "«contained type»",
      fields: variantFields.length > 0 ? variantFields : ["(no direct property flows)"],
      x: targetX + targetIndent,
      y: targetY,
      width: targetVariantWidth,
      height,
      rowAnchors: anchors,
      relationAnchors: new Map(),
    });
    targetY += height + targetNodeGap;
  }

  const mappingLaneX = 820;
  const mappingLaneWidth = 840;
  const mappingLanes = denseGraph
    ? svgGraphMappingLanes(
        object,
        targetLayouts,
        propertyFlows,
        mappingLaneX,
        mappingLaneWidth,
        titleHeight + 44,
        nodeGap
      )
    : [];
  const mappingLaneY =
    mappingLanes.length > 0
      ? Math.max(...mappingLanes.map((lane) => lane.y + lane.height))
      : titleHeight + 44;
  const height = Math.max(sourceY, targetY, mappingLaneY) + 44;
  const graphSubtitle = `${
    denseGraph ? "Dense mapping layout" : "Native structural mapping graph"
  } · ${sharedFields.length} parent properties · ${variants.length} nested variants`;
  const graphDescription = denseGraph
    ? "OCF route classes feed target-specific mapping lanes; each lane preserves exact source-property to target-property mappings before the Carta class structure."
    : "OCF route classes map directly to Carta parent and nested variant properties; dashed purple edges show containment.";
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">`,
    `<title id="title">${svgEscape(object)} structural mapping graph</title>`,
    `<desc id="desc">Native UML-like graph of OCF route nodes, Carta parent and nested variant nodes, containment edges, and property mappings.</desc>`,
    `<style>text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.field{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.muted{font-size:13px}</style>`,
    `<defs>
      <marker id="property-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 z" fill="#64748b"/></marker>
      <marker id="contains-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 z" fill="#7c3aed"/></marker>
      <marker id="composition-diamond" markerWidth="12" markerHeight="12" refX="2" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M0,6 L6,0 L12,6 L6,12 z" fill="#7c3aed"/></marker>
    </defs>`,
    `<rect width="${width}" height="${height}" fill="#f8fafc"/>`,
    svgText(object, 70, 48, { fill: "#0f172a", fontSize: 34, fontWeight: 700, maxChars: 60 }),
    svgText(graphSubtitle, 70, 84, { fill: "#475569", fontSize: 20, maxChars: 120 }),
    svgText(graphDescription, 70, 116, { fill: "#64748b", fontSize: 16, maxChars: 150 }),
    `<rect x="${
      width - 620
    }" y="38" width="20" height="20" rx="4" fill="#e6f4ea" stroke="#62a576"/>`,
    svgText("OCF route node", width - 586, 54, { fill: "#166534", fontSize: 16, maxChars: 30 }),
    `<rect x="${
      width - 390
    }" y="38" width="20" height="20" rx="4" fill="#e8f0fe" stroke="#6b8fd6"/>`,
    svgText("Carta class node", width - 356, 54, { fill: "#1e3a8a", fontSize: 16, maxChars: 30 }),
    `<line x1="${width - 620}" y1="84" x2="${
      width - 570
    }" y2="84" stroke="#64748b" stroke-width="2" marker-end="url(#property-arrow)"/>`,
    svgText("property mapping", width - 550, 90, { fill: "#475569", fontSize: 14, maxChars: 30 }),
    `<line x1="${width - 620}" y1="112" x2="${
      width - 570
    }" y2="112" stroke="#7c3aed" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#contains-arrow)"/>`,
    svgText("contains", width - 550, 118, { fill: "#6d28d9", fontSize: 14, maxChars: 30 }),
    `<rect x="${sourceX - 20}" y="${titleHeight + 14}" width="${sourceWidth + 40}" height="${
      sourceY - titleHeight - 14
    }" rx="14" fill="#f0fdf4" stroke="#bbf7d0" stroke-dasharray="8 6"/>`,
    svgText("OCF source routes", sourceX, titleHeight + 4, {
      fill: "#166534",
      fontSize: 18,
      fontWeight: 700,
      maxChars: 40,
    }),
    ...(denseGraph
      ? [
          `<rect x="${mappingLaneX - 20}" y="${titleHeight + 14}" width="${
            mappingLaneWidth + 40
          }" height="${
            mappingLaneY - titleHeight - 14
          }" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="8 6"/>`,
          svgText("Target-specific mapping lanes", mappingLaneX, titleHeight + 4, {
            fill: "#475569",
            fontSize: 18,
            fontWeight: 700,
            maxChars: 50,
          }),
        ]
      : []),
    `<rect x="${targetX - 40}" y="${titleHeight + 14}" width="${targetWidth + 80}" height="${
      targetY - titleHeight - 14
    }" rx="18" fill="#f8fbff" stroke="#7c9bd3" stroke-width="3"/>`,
    svgText("Carta target aggregate", targetX, titleHeight + 4, {
      fill: "#1e3a8a",
      fontSize: 18,
      fontWeight: 700,
      maxChars: 50,
    }),
    svgText("«Carta aggregate»", targetX - 18, titleHeight + 38, {
      fill: "#315a9d",
      fontSize: 13,
      fontWeight: 700,
      maxChars: 30,
    }),
    svgText("contained types", targetX + targetIndent, containedTypesLabelY, {
      fill: "#5574a8",
      fontSize: 13,
      fontWeight: 700,
      maxChars: 30,
    }),
  ];

  const sourceByRoute = new Map(sourceLayouts.map((node) => [sourceRouteKey(node.route), node]));
  const targetByKey = new Map(targetLayouts.map((node) => [node.key, node]));
  if (denseGraph) {
    for (const lane of mappingLanes) {
      const target = targetByKey.get(lane.targetKey);
      for (const group of lane.groups) {
        const source = sourceByRoute.get(sourceRouteKey(group.route));
        if (!source) continue;
        parts.push(
          svgGraphPath(
            source.x + source.width,
            source.y + source.headerHeight / 2,
            lane.x,
            group.anchorY,
            {
              color: "#64748b",
              markerEnd: "property-arrow",
              width: 2,
              className: "mapping-group-edge",
              data: {
                "target-key": svgGraphInteractiveKey(lane.targetKey),
                "source-route": svgGraphInteractiveKey(sourceRouteKey(group.route)),
                "source-label": sourceRouteDisplayName(group.route),
              },
            }
          ).replace(
            "/>",
            `><title>${svgEscape(
              `${sourceRouteDisplayName(group.route)} → ${lane.title} (${
                group.flows.length
              } property mappings)`
            )}</title></path>`
          )
        );
      }
      if (!target) continue;
      for (const group of lane.groups) {
        for (const flow of group.flows) {
          const laneRowY = group.rowAnchors.get(svgGraphPropertyFlowKey(flow));
          const targetRowY = target.rowAnchors.get(
            svgTargetAnchorKey(flow.targetKey, flow.targetField)
          );
          if (laneRowY === undefined || targetRowY === undefined) continue;
          parts.push(
            svgGraphPath(lane.x + lane.width, laneRowY, target.x, targetRowY, {
              color: "#64748b",
              markerEnd: "property-arrow",
              width: 2,
              className: "mapping-edge",
              data: {
                "target-key": svgGraphInteractiveKey(flow.targetKey),
                "source-route": svgGraphInteractiveKey(sourceRouteKey(flow.route)),
                "source-label": sourceRouteDisplayName(flow.route),
                "flow-key": svgGraphInteractiveKey(svgGraphPropertyFlowKey(flow)),
              },
            }).replace(
              "/>",
              `><title>${svgEscape(
                `${sourceRouteDisplayName(flow.route)}.${flow.sourceField} → ${flow.targetLabel}`
              )}</title></path>`
            )
          );
        }
      }
    }
  } else {
    for (const flow of propertyFlows) {
      const source = sourceByRoute.get(sourceRouteKey(flow.route));
      const target = targetByKey.get(flow.targetKey);
      const sourceYAnchor = source?.rowAnchors.get(flow.sourceField);
      const targetYAnchor = target?.rowAnchors.get(
        svgTargetAnchorKey(flow.targetKey, flow.targetField)
      );
      if (!source || !target || sourceYAnchor === undefined || targetYAnchor === undefined)
        continue;
      parts.push(
        svgGraphPath(source.x + source.width, sourceYAnchor, target.x, targetYAnchor, {
          color: "#64748b",
          markerEnd: "property-arrow",
          width: 2,
          className: "mapping-edge",
          data: {
            "target-key": svgGraphInteractiveKey(flow.targetKey),
            "source-route": svgGraphInteractiveKey(sourceRouteKey(flow.route)),
            "source-label": sourceRouteDisplayName(flow.route),
            "flow-key": svgGraphInteractiveKey(svgGraphPropertyFlowKey(flow)),
          },
        }).replace(
          "/>",
          `><title>${svgEscape(
            `${sourceRouteDisplayName(flow.route)}.${flow.sourceField} → ${flow.targetLabel}`
          )}</title></path>`
        )
      );
    }
  }
  for (const edge of containmentEdges) {
    const source = sourceByRoute.get(sourceRouteKey(edge.route));
    const target = targetByKey.get(edge.targetKey);
    if (!source || !target) continue;
    const sourceAnchor = source.y + source.headerHeight / 2;
    const targetAnchor = target.y + 14;
    parts.push(
      svgGraphPath(source.x + source.width, sourceAnchor, target.x, targetAnchor, {
        color: "#7c3aed",
        markerEnd: "contains-arrow",
        dash: "7 5",
        width: 2,
        className: "containment-edge",
        data: {
          "target-key": svgGraphInteractiveKey(edge.targetKey),
          "source-route": svgGraphInteractiveKey(sourceRouteKey(edge.route)),
          "source-label": sourceRouteDisplayName(edge.route),
        },
      }).replace(
        "/>",
        `><title>${svgEscape(
          `${sourceRouteDisplayName(edge.route)} contains ${edge.label}`
        )}</title></path>`
      )
    );
  }
  for (const variant of variants) {
    const target = targetByKey.get(svgVariantKey(variant));
    const parentAnchor = parentNode.relationAnchors.get(svgVariantKey(variant));
    if (!target || parentAnchor === undefined) continue;
    const startX = parentNode.x + parentNode.width;
    const endX = target.x + target.width;
    const routeX = startX + 30;
    parts.push(
      `<path class="composition-edge" data-target-key="${svgEscape(
        svgGraphInteractiveKey(svgVariantKey(variant))
      )}" d="M ${startX} ${parentAnchor} L ${routeX} ${parentAnchor} L ${routeX} ${
        target.y - 14
      } L ${endX} ${
        target.y - 14
      }" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="7 5" marker-start="url(#composition-diamond)" marker-end="url(#contains-arrow)"><title>${svgEscape(
        `${object} contains ${target.title}`
      )}</title></path>`
    );
  }

  for (const lane of mappingLanes) {
    parts.push(
      `<rect class="mapping-lane" data-target-key="${svgEscape(
        svgGraphInteractiveKey(lane.targetKey)
      )}" x="${lane.x}" y="${lane.y}" width="${lane.width}" height="${
        lane.height
      }" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>`,
      svgText("«mapping lane»", lane.x + 18, lane.y + 22, {
        fill: "#475569",
        fontSize: 13,
        fontWeight: 700,
        maxChars: 30,
      }),
      svgText(lane.title, lane.x + 18, lane.y + 44, {
        fill: "#334155",
        fontSize: 17,
        fontWeight: 700,
        maxChars: 44,
      }),
      svgText(
        `${lane.mappingCount} exact property ${lane.mappingCount === 1 ? "mapping" : "mappings"}`,
        lane.x + 18,
        lane.y + 64,
        { fill: "#64748b", fontSize: 13, maxChars: 50 }
      )
    );
    let cursor = lane.y + lane.headerHeight + 12;
    for (const group of lane.groups) {
      parts.push(
        `<line x1="${lane.x}" y1="${cursor}" x2="${
          lane.x + lane.width
        }" y2="${cursor}" stroke="#cbd5e1"/>`,
        svgText(
          `${sourceRouteDisplayName(group.route)} (${group.flows.length})`,
          lane.x + 18,
          cursor + 17,
          { fill: "#475569", fontSize: 12, fontWeight: 700, maxChars: 72 }
        )
      );
      cursor += 24;
      for (const flow of group.flows) {
        parts.push(
          `<line x1="${lane.x}" y1="${cursor}" x2="${
            lane.x + lane.width
          }" y2="${cursor}" stroke="#e2e8f0"/>`,
          svgText(`+ ${flow.sourceField} → ${flow.targetField}`, lane.x + 18, cursor + 17, {
            className: "field",
            fill: "#334155",
            fontSize: 13,
            maxChars: 100,
          })
        );
        cursor += 24;
      }
      cursor += 8;
    }
  }

  for (const node of sourceLayouts) {
    parts.push(
      svgGraphNodeRect(node, "#e6f4ea", "#62a576", {
        className: "source-node",
        data: {
          "source-route": svgGraphInteractiveKey(sourceRouteKey(node.route)),
          "source-label": sourceRouteDisplayName(node.route),
        },
      })
    );
    const titleLayout = svgGraphNodeTitleLines(
      "«OCF route»",
      sourceRouteDisplayName(node.route),
      48
    );
    parts.push(
      svgText(titleLayout.lines[0] ?? "", node.x + 18, node.y + 22, {
        fill: "#166534",
        fontSize: 13,
        fontWeight: 700,
        maxChars: 30,
      }),
      svgText(sourceRouteDisplayName(node.route), node.x + 18, node.y + 44, {
        fill: "#14532d",
        fontSize: 16,
        fontWeight: 700,
        maxChars: 48,
      })
    );
    const condition = svgRouteCondition(node.route);
    if (condition) {
      svgWrap(condition, 72).forEach((line, index) => {
        parts.push(
          svgText(line, node.x + 18, node.y + titleLayout.headerHeight + 12 + index * 16, {
            fill: "#166534",
            fontSize: 12,
            maxChars: 72,
          })
        );
      });
    }
    node.rows.forEach((row, index) => {
      const y = node.y + node.headerHeight + 14 + index * rowHeight;
      parts.push(
        `<line x1="${node.x}" y1="${y}" x2="${node.x + node.width}" y2="${y}" stroke="#b7d8bf"/>`,
        svgText(`+ ${row.sourceField}`, node.x + 18, y + 23, {
          className: "field",
          fill: "#14532d",
          fontSize: 16,
          fontWeight: 700,
          maxChars: 64,
        })
      );
    });
  }

  for (const node of targetLayouts) {
    const nested = node.key !== "parent";
    parts.push(
      svgGraphNodeRect(node, "#e8f0fe", "#6b8fd6", {
        className: "target-node",
        data: { "target-key": svgGraphInteractiveKey(node.key) },
        rx: nested ? 8 : 10,
        strokeWidth: nested ? 1.5 : 2.5,
      })
    );
    const titleLayout = svgGraphNodeTitleLines(node.stereotype, node.title, 52);
    parts.push(
      svgText(titleLayout.lines[0] ?? "", node.x + 18, node.y + 22, {
        fill: nested ? "#5574a8" : "#1e3a8a",
        fontSize: 13,
        fontWeight: 700,
        maxChars: 30,
      }),
      svgText(node.title, node.x + 18, node.y + 44, {
        fill: nested ? "#315a9d" : "#1e3a8a",
        fontSize: nested ? 16 : 18,
        fontWeight: 700,
        maxChars: 52,
      })
    );
    if (node.key === "parent") {
      const sharedHeaderY = node.y + parentHeaderHeight + 14;
      const relationHeaderY = parentRelationsStart - parentSectionHeaderHeight;
      parts.push(
        `<line x1="${node.x}" y1="${sharedHeaderY}" x2="${
          node.x + node.width
        }" y2="${sharedHeaderY}" stroke="#9bb6ea"/>`,
        svgText(`parent properties (${sharedFields.length})`, node.x + 18, sharedHeaderY + 22, {
          fill: "#1e3a8a",
          fontSize: 14,
          fontWeight: 700,
          maxChars: 60,
        }),
        `<line x1="${node.x}" y1="${relationHeaderY}" x2="${
          node.x + node.width
        }" y2="${relationHeaderY}" stroke="#9bb6ea"/>`,
        svgText(
          `contains (${variants.length} nested variants)`,
          node.x + 18,
          relationHeaderY + 22,
          { fill: "#1e3a8a", fontSize: 14, fontWeight: 700, maxChars: 60 }
        )
      );
      sharedFields.forEach((field, index) => {
        const y = parentSharedStart + parentSectionHeaderHeight + index * rowHeight;
        parts.push(
          `<line x1="${node.x}" y1="${y}" x2="${node.x + node.width}" y2="${y}" stroke="#c4d3f3"/>`,
          svgText(`+ ${field}`, node.x + 18, y + 23, {
            className: "field",
            fill: "#1e3a8a",
            fontSize: 16,
            fontWeight: 700,
            maxChars: 70,
          })
        );
      });
      variants.forEach((variant, index) => {
        const y = parentRelationsStart + index * rowHeight;
        parts.push(
          `<line x1="${node.x}" y1="${y}" x2="${node.x + node.width}" y2="${y}" stroke="#c4d3f3"/>`,
          svgText(`+ ${parentRelations[index]}`, node.x + 18, y + 23, {
            className: "field",
            fill: "#1e3a8a",
            fontSize: 16,
            fontWeight: 700,
            maxChars: 70,
          })
        );
      });
    } else {
      const fieldStart = node.y + titleLayout.headerHeight + 14;
      node.fields.forEach((field, index) => {
        const y = fieldStart + index * rowHeight;
        parts.push(
          `<line x1="${node.x}" y1="${y}" x2="${node.x + node.width}" y2="${y}" stroke="#c4d3f3"/>`,
          svgText(`+ ${field}`, node.x + 18, y + 23, {
            className: "field",
            fill: field.startsWith("(") ? "#64748b" : nested ? "#315a9d" : "#1e3a8a",
            fontSize: 16,
            fontWeight: field.startsWith("(") ? 400 : 700,
            maxChars: 76,
          })
        );
      });
    }
  }

  parts.push("</svg>");
  return parts.join("\n");
}

export function renderMappingFlowSvgs(options: MappingFlowSvgOptions): Map<string, string> {
  const groups = buildGroups(options.inverse);
  const rows = options.targetObject
    ? options.inverse.defs.filter((row) => row.name === options.targetObject)
    : mappedDefinitions(options.inverse);
  const artifacts = new Map<string, string>();
  for (const row of rows) {
    const group = groups.get(row.name) ?? { object: row.name, flows: new Map() };
    const variants = targetVariantsForGroup(row.name, group, options.inverse);
    if (variants.length < 2) continue;
    artifacts.set(
      `${svgSlug(row.name)}.svg`,
      renderMappingStructuralSvg(row.name, group, options.inverse, options.mappingDocuments, groups)
    );
  }
  return artifacts;
}

export function renderMappingFlowHtml(options: MappingFlowSvgOptions): string {
  const artifacts = renderMappingFlowSvgs(options);
  const payload = JSON.stringify(
    [...artifacts.entries()].map(([name, svg]) => ({ name, svg }))
  ).replaceAll("<", "\\u003c");
  return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Interactive polymorphic mapping flows</title>
  <style>
    :root {
      color-scheme: light;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f8fafc; }
    header {
      position: sticky;
      top: 0;
      z-index: 2;
      padding: 16px 20px 12px;
      border-bottom: 1px solid #cbd5e1;
      background: rgba(248, 250, 252, .96);
      backdrop-filter: blur(8px);
    }
    h1 { margin: 0 0 4px; font-size: 22px; }
    .hint { color: #475569; font-size: 13px; }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 16px;
      align-items: center;
      margin-top: 12px;
    }
    label, .group-label { color: #334155; font-size: 12px; font-weight: 700; }
    select, button {
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: #fff;
      color: #0f172a;
      font: inherit;
      font-size: 13px;
      padding: 6px 9px;
    }
    select { margin-left: 6px; }
    button { cursor: pointer; }
    button:hover, button.is-active { border-color: #2563eb; background: #eff6ff; }
    button.is-active { color: #1d4ed8; font-weight: 700; }
    .control-group { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .status { color: #475569; font-size: 12px; margin-left: auto; }
    .zoom-value { min-width: 48px; text-align: center; color: #475569; font-size: 12px; font-variant-numeric: tabular-nums; }
    #diagram {
      overflow: auto;
      padding: 16px;
      min-height: calc(100vh - 150px);
    }
    #stage { position: relative; width: fit-content; }
    #diagram svg { display: block; width: auto; min-width: 0; height: auto; transform-origin: top left; }
    #diagram path.mapping-edge,
    #diagram path.mapping-group-edge,
    #diagram path.containment-edge,
    #diagram path.composition-edge { transition: opacity .15s, stroke-width .15s; }
    #diagram path.mapping-edge { cursor: pointer; }
    #diagram path.is-dimmed { opacity: .08 !important; }
    #diagram path.is-focused {
      opacity: 1 !important;
      stroke: #0f172a !important;
      stroke-width: 4 !important;
    }
    #diagram rect.mapping-lane.is-dimmed,
    #diagram rect.target-node.is-dimmed { opacity: .2; }
    .empty { padding: 40px; color: #475569; }
  </style>
</head>
<body>
  <header>
    <h1>Interactive polymorphic mapping flows</h1>
    <div class="hint">Toggle target lanes or source routes. Click a property arrow to focus one mapping; shift-click to select several.</div>
    <div class="toolbar">
      <label>Family<select id="family"></select></label>
      <div class="control-group"><span class="group-label">Target lanes</span><span id="layers"></span></div>
      <div class="control-group"><span class="group-label">Source routes</span><span id="routes"></span></div>
      <button id="show-all" type="button">Show all</button>
      <button id="clear-focus" type="button">Clear focus</button>
      <div class="control-group" aria-label="Diagram zoom">
        <span class="group-label">Zoom</span>
        <button id="zoom-out" type="button" aria-label="Zoom out">−</button>
        <span class="zoom-value" id="zoom-value" aria-live="polite">Fit width</span>
        <button id="zoom-in" type="button" aria-label="Zoom in">+</button>
        <button id="fit-width" type="button">Fit width</button>
      </div>
      <span class="status" id="status"></span>
    </div>
  </header>
  <main id="diagram" aria-live="polite"><div id="stage"></div></main>
  <script id="mapping-data" type="application/json">${payload}</script>
  <script>
    (function () {
      const families = JSON.parse(document.getElementById("mapping-data").textContent || "[]");
      const familySelect = document.getElementById("family");
      const layerControls = document.getElementById("layers");
      const routeControls = document.getElementById("routes");
      const diagram = document.getElementById("diagram");
      const stage = document.getElementById("stage");
      const status = document.getElementById("status");
      const zoomValue = document.getElementById("zoom-value");
      const selectedLayers = new Set();
      const selectedRoutes = new Set();
      const selectedFlows = new Set();
      let activeSvg = null;
      let activeEdges = [];
      let zoom = 1;
      let fitWidthMode = true;

      function svgSize(svg) {
        const viewBox = (svg.getAttribute("viewBox") || "").trim().split(/\s+/).map(Number);
        if (viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
          return { width: viewBox[2], height: viewBox[3] };
        }
        return { width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height };
      }

      function applyZoom() {
        if (!activeSvg) {
          zoomValue.textContent = "Fit width";
          return;
        }
        const size = svgSize(activeSvg);
        activeSvg.style.width = size.width + "px";
        activeSvg.style.height = size.height + "px";
        activeSvg.style.transform = "scale(" + zoom + ")";
        stage.style.width = size.width * zoom + "px";
        stage.style.height = size.height * zoom + "px";
        zoomValue.textContent = Math.round(zoom * 100) + "%";
      }

      function fitToWidth() {
        if (!activeSvg) return;
        const size = svgSize(activeSvg);
        const available = Math.max(320, diagram.clientWidth - 32);
        zoom = Math.max(0.25, Math.min(1, available / size.width));
        fitWidthMode = true;
        applyZoom();
      }

      function setZoom(nextZoom) {
        zoom = Math.max(0.25, Math.min(3, nextZoom));
        fitWidthMode = false;
        applyZoom();
      }

      function labelForLayer(key) {
        if (key === "parent") return "parent";
        return key.split("|").join(" → ");
      }

      function uniqueValues(elements, attribute, labelAttribute) {
        const values = new Map();
        elements.forEach(function (element) {
          const key = element.dataset[attribute];
          if (key && !values.has(key)) values.set(key, labelAttribute ? (element.dataset[labelAttribute] || key) : key);
        });
        return Array.from(values.entries()).sort(function (left, right) {
          return left[1].localeCompare(right[1]);
        });
      }

      function addToggle(container, kind, key, label, selected) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.kind = kind;
        button.dataset.value = key;
        button.className = selected ? "is-active" : "";
        button.addEventListener("click", function () {
          const set = kind === "layer" ? selectedLayers : selectedRoutes;
          if (set.has(key)) set.delete(key); else set.add(key);
          renderControls();
          updateVisibility();
        });
        container.appendChild(button);
      }

      function renderControls() {
        layerControls.replaceChildren();
        routeControls.replaceChildren();
        const layerValues = uniqueValues(activeEdges, "targetKey");
        const routeValues = uniqueValues(activeEdges, "sourceRoute", "sourceLabel");
        layerValues.forEach(function (entry) {
          addToggle(layerControls, "layer", entry[0], labelForLayer(entry[0]), selectedLayers.has(entry[0]));
        });
        routeValues.forEach(function (entry) {
          addToggle(routeControls, "route", entry[0], entry[1], selectedRoutes.has(entry[0]));
        });
      }

      function updateVisibility() {
        activeEdges.forEach(function (edge) {
          const layerVisible = !selectedLayers.size || selectedLayers.has(edge.dataset.targetKey);
          const routeVisible = !selectedRoutes.size || selectedRoutes.has(edge.dataset.sourceRoute);
          const flowVisible = !selectedFlows.size ||
            !edge.classList.contains("mapping-edge") ||
            selectedFlows.has(edge.dataset.flowKey);
          edge.classList.toggle("is-dimmed", !(layerVisible && routeVisible && flowVisible));
          edge.classList.toggle("is-focused", selectedFlows.has(edge.dataset.flowKey));
        });
        if (activeSvg) {
          activeSvg.querySelectorAll("rect.mapping-lane, rect.target-node").forEach(function (node) {
            const key = node.dataset.targetKey;
            const keep = !selectedLayers.size || selectedLayers.has(key) || key === "parent";
            node.classList.toggle("is-dimmed", !keep);
          });
        }
        const parts = [];
        if (selectedLayers.size) parts.push(selectedLayers.size + " lane" + (selectedLayers.size === 1 ? "" : "s"));
        if (selectedRoutes.size) parts.push(selectedRoutes.size + " route" + (selectedRoutes.size === 1 ? "" : "s"));
        if (selectedFlows.size) parts.push(selectedFlows.size + " focused mapping" + (selectedFlows.size === 1 ? "" : "s"));
        status.textContent = parts.length ? parts.join(" · ") : "Showing all mappings";
      }

      function bindEdges() {
        activeEdges = Array.from(activeSvg.querySelectorAll(
          "path.mapping-edge, path.mapping-group-edge, path.containment-edge, path.composition-edge"
        ));
        activeSvg.querySelectorAll("path.mapping-edge").forEach(function (edge) {
          edge.addEventListener("click", function (event) {
            if (!event.shiftKey) selectedFlows.clear();
            const key = edge.dataset.flowKey;
            if (key) {
              if (event.shiftKey && selectedFlows.has(key)) selectedFlows.delete(key);
              else selectedFlows.add(key);
            }
            updateVisibility();
          });
        });
        renderControls();
        updateVisibility();
      }

      function renderFamily(name) {
        selectedLayers.clear();
        selectedRoutes.clear();
        selectedFlows.clear();
        const family = families.find(function (entry) { return entry.name === name; });
        if (!family) {
          stage.innerHTML = '<div class="empty">No mapping flow artifact found.</div>';
          activeSvg = null;
          activeEdges = [];
          renderControls();
          updateVisibility();
          return;
        }
        stage.innerHTML = family.svg;
        activeSvg = stage.querySelector("svg");
        bindEdges();
        fitToWidth();
      }

      families.forEach(function (family) {
        const option = document.createElement("option");
        option.value = family.name;
        option.textContent = family.name.replace(/\.svg$/, "");
        familySelect.appendChild(option);
      });
      familySelect.addEventListener("change", function () { renderFamily(familySelect.value); });
      document.getElementById("show-all").addEventListener("click", function () {
        selectedLayers.clear();
        selectedRoutes.clear();
        selectedFlows.clear();
        renderControls();
        updateVisibility();
      });
      document.getElementById("clear-focus").addEventListener("click", function () {
        selectedFlows.clear();
        updateVisibility();
      });
      document.getElementById("zoom-out").addEventListener("click", function () {
        setZoom(zoom / 1.25);
      });
      document.getElementById("zoom-in").addEventListener("click", function () {
        setZoom(zoom * 1.25);
      });
      document.getElementById("fit-width").addEventListener("click", fitToWidth);
      window.addEventListener("resize", function () {
        if (fitWidthMode) fitToWidth();
      });
      if (families.length) {
        familySelect.value = families[0].name;
        renderFamily(families[0].name);
      } else {
        stage.innerHTML = '<div class="empty">No mapping flow artifacts found.</div>';
      }
    }());
  </script>
</body>
</html>`;
}

function renderFlowNode(
  node: FlowNode,
  prefix: string,
  last: boolean,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined,
  lines: string[]
): void {
  lines.push(`${prefix}${last ? "└── " : "├── "}${flowLabel(node.flow)}`);
  const details = flowDetails(node.flow, mappingDocuments);
  const unionDetail = details.find((detail) => detail.kind === "union-dispatch");
  const items: Array<{ detail: FlowDetail } | { node: FlowNode }> = [
    ...details.filter((detail) => detail !== unionDetail).map((detail) => ({ detail })),
    ...(unionDetail ? [{ detail: { ...unionDetail, childNodes: node.children } }] : []),
    ...(unionDetail ? [] : node.children.map((child) => ({ node: child }))),
  ];
  const childPrefix = `${prefix}${last ? "    " : "│   "}`;
  items.forEach((item, index) => {
    const itemLast = index === items.length - 1;
    if ("detail" in item) {
      lines.push(`${childPrefix}${itemLast ? "└── " : "├── "}${item.detail.label}`);
      if (item.detail.children && item.detail.children.length > 0) {
        const detailPrefix = `${childPrefix}${itemLast ? "    " : "│   "}`;
        item.detail.children.forEach((child, childIndex) => {
          const childLast = childIndex === item.detail.children!.length - 1;
          lines.push(`${detailPrefix}${childLast ? "└── " : "├── "}${child}`);
        });
      }
      if (item.detail.childNodes && item.detail.childNodes.length > 0) {
        const detailPrefix = `${childPrefix}${itemLast ? "    " : "│   "}`;
        item.detail.childNodes.forEach((child, childIndex) => {
          const childLast = childIndex === item.detail.childNodes!.length - 1;
          renderFlowNode(child, detailPrefix, childLast, mappingDocuments, lines);
        });
      }
    } else {
      renderFlowNode(item.node, childPrefix, itemLast, mappingDocuments, lines);
    }
  });
}

function renderMappingTree(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments?: ReadonlyMap<string, MappingQuestionDocument>,
  includeUnmappedProperties = true,
  includeMappingQuestions = true
): string[] {
  const fields = sortedTargetFields(object, group, inverse, includeUnmappedProperties);
  const allFlows = [...group.flows.values()].flat();
  const mappingQuestions = includeMappingQuestions
    ? openQuestionsForFlows(
        allFlows,
        mappingDocuments,
        (question) => question.property === null && question.target === null
      )
    : [];
  const renderedFields = mappingQuestions.length > 0 ? [...fields, "(mapping questions)"] : fields;
  const lines: string[] = [];
  renderedFields.forEach((field, fieldIndex) => {
    const lastField = fieldIndex === renderedFields.length - 1;
    const flows = group.flows.get(field) ?? [];
    lines.push(`${lastField ? "└── " : "├── "}${field}`);
    const flowPrefix = lastField ? "    " : "│   ";

    if (field === "(mapping questions)") {
      mappingQuestions.forEach((reportQuestion, questionIndex) => {
        const lastQuestion = questionIndex === mappingQuestions.length - 1;
        lines.push(
          `${flowPrefix}${lastQuestion ? "└── " : "├── "}${questionLabel(reportQuestion)}`
        );
      });
      return;
    }

    const targetQuestions = openQuestionsForTargetField(object, field, mappingDocuments);
    const propertyQuestions = openQuestionsForFlows(
      flows,
      mappingDocuments,
      (question, flow) =>
        question.property !== null && questionMatchesSourceField(question, flow.sourceField)
    );
    const children: string[] = [];
    const roots = buildFlowForest(flows, mappingDocuments);
    const hasTrailingChildren = propertyQuestions.length > 0 || targetQuestions.length > 0;
    if (roots.length === 0) children.push("✗ no mapped OCF source");
    else {
      const lastSource = !hasTrailingChildren;
      lines.push(`${flowPrefix}${lastSource ? "└── " : "├── "}source path(s)`);
      const sourcePrefix = `${flowPrefix}${lastSource ? "    " : "│   "}`;
      roots.forEach((root, rootIndex) => {
        const lastRoot = rootIndex === roots.length - 1 && !hasTrailingChildren;
        renderFlowNode(root, sourcePrefix, lastRoot, mappingDocuments, lines);
      });
    }
    children.push(...propertyQuestions.map(questionLabel));
    children.push(...targetQuestions.map(questionLabel));
    children.forEach((child, childIndex) => {
      const lastChild = childIndex === children.length - 1;
      lines.push(`${flowPrefix}${lastChild ? "└── " : "├── "}${child}`);
    });
  });
  return lines;
}

function compactFlowLabel(flow: InverseFlow): string {
  const sourceKind = flow.sourceKind === "type" ? "type " : "";
  const context = flow.context ? ` [${flow.context}]` : "";
  const sourceField = flow.sourceField.startsWith("(")
    ? ` ${flow.sourceField}`
    : `.${flow.sourceField}`;
  const inverse =
    flow.inverseRole && flow.inverseRole !== "record-construction"
      ? `; inverse: ${flow.inverseRole}`
      : "";
  return `${sourceKind}${mappingSourceName(flow.file)}${context}${sourceField} (${
    flow.kind
  }${inverse})`;
}

function renderCompactFlowNode(
  node: FlowNode,
  prefix: string,
  last: boolean,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined,
  lines: string[]
): void {
  lines.push(`${prefix}${last ? "└─ " : "├─ "}← ${compactFlowLabel(node.flow)}`);
  const details = flowDetails(node.flow, mappingDocuments);
  const unionDetail = details.find((detail) => detail.kind === "union-dispatch");
  const items: Array<{ detail: FlowDetail } | { node: FlowNode }> = [
    ...details.filter((detail) => detail !== unionDetail).map((detail) => ({ detail })),
    ...(unionDetail ? [{ detail: { ...unionDetail, childNodes: node.children } }] : []),
    ...(unionDetail ? [] : node.children.map((child) => ({ node: child }))),
  ];
  const childPrefix = `${prefix}${last ? "   " : "│  "}`;
  items.forEach((item, index) => {
    const itemLast = index === items.length - 1;
    if ("detail" in item) {
      lines.push(`${childPrefix}${itemLast ? "└─ " : "├─ "}↳ ${item.detail.label}`);
      if (item.detail.children && item.detail.children.length > 0) {
        const detailPrefix = `${childPrefix}${itemLast ? "   " : "│  "}`;
        item.detail.children.forEach((child, childIndex) => {
          const childLast = childIndex === item.detail.children!.length - 1;
          lines.push(`${detailPrefix}${childLast ? "└─ " : "├─ "}${child}`);
        });
      }
      if (item.detail.childNodes && item.detail.childNodes.length > 0) {
        const detailPrefix = `${childPrefix}${itemLast ? "   " : "│  "}`;
        item.detail.childNodes.forEach((child, childIndex) => {
          const childLast = childIndex === item.detail.childNodes!.length - 1;
          renderCompactFlowNode(child, detailPrefix, childLast, mappingDocuments, lines);
        });
      }
    } else {
      renderCompactFlowNode(item.node, childPrefix, itemLast, mappingDocuments, lines);
    }
  });
}

function renderCompactField(
  object: string,
  field: string,
  flows: InverseFlow[],
  prefix: string,
  last: boolean,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined,
  lines: string[]
): void {
  lines.push(`${prefix}${last ? "└─ " : "├─ "}+ ${field}`);
  const childPrefix = `${prefix}${last ? "   " : "│  "}`;
  const roots = buildFlowForest(flows, mappingDocuments);
  const propertyQuestions = openQuestionsForFlows(
    flows,
    mappingDocuments,
    (question, flow) =>
      question.property !== null && questionMatchesSourceField(question, flow.sourceField)
  );
  const targetQuestions = openQuestionsForTargetField(object, field, mappingDocuments);
  const childCount = Math.max(roots.length, 1) + propertyQuestions.length + targetQuestions.length;
  let childIndex = 0;
  if (roots.length === 0) {
    lines.push(
      `${childPrefix}${childIndex++ === childCount - 1 ? "└─ " : "├─ "}✗ no mapped OCF source`
    );
  } else {
    roots.forEach((root) => {
      const rootLast = childIndex++ === childCount - 1;
      renderCompactFlowNode(root, childPrefix, rootLast, mappingDocuments, lines);
    });
  }
  [...propertyQuestions, ...targetQuestions].forEach((question) => {
    const questionLast = childIndex++ === childCount - 1;
    lines.push(`${childPrefix}${questionLast ? "└─ " : "├─ "}${compactQuestionLabel(question)}`);
  });
}

function relevantVariantFlows(
  variant: TargetVariant,
  field: string,
  childGroup: TargetGroup | undefined,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): InverseFlow[] {
  const flows = childGroup?.flows.get(field) ?? [];
  const routes = mappingDocuments ? sourceRoutesForFlows(variant.flows, mappingDocuments) : [];
  const seen = new Set<string>();
  return flows.filter((flow) => {
    if (
      flow.sourceKind === "object" &&
      routes.length > 0 &&
      !routes.some((route) => flowAppliesToRoute(flow, route))
    ) {
      return false;
    }
    const key = [flow.file, flow.sourceKind, flow.sourceField, flow.context, flow.kind].join(
      "\u0000"
    );
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderCompactAggregateMappingLedger(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined,
  groups: Map<string, TargetGroup>,
  includeUnmappedProperties = true,
  includeMappingQuestions = true
): string[] {
  const variants = targetVariantsForGroup(object, group, inverse);
  const nestedProperties = new Set(variants.map((variant) => variant.property));
  const parentFields = sortedTargetFields(object, group, inverse, includeUnmappedProperties).filter(
    (field) => field !== "(object route)" && !nestedProperties.has(field)
  );
  const lines = [`parent properties (${parentFields.length})`];
  parentFields.forEach((field, index) => {
    renderCompactField(
      object,
      field,
      group.flows.get(field) ?? [],
      "  ",
      index === parentFields.length - 1,
      mappingDocuments,
      lines
    );
  });

  if (variants.length > 0) {
    lines.push("", `contains (${variants.length} nested variants)`);
    variants.forEach((variant, index) => {
      const lastVariant = index === variants.length - 1;
      const cardinality = variant.child.cardinality === "array" ? "[]" : "";
      lines.push(
        `  ${lastVariant ? "└─ " : "├─ "}${variant.property}${cardinality} : ${variant.child.name}`
      );
      const variantPrefix = `  ${lastVariant ? "   " : "│  "}`;
      const childGroup = groups.get(variant.child.name);
      const childFields = childGroup
        ? sortedTargetFields(variant.child.name, childGroup, inverse).filter(
            (field) => field !== "(object route)"
          )
        : [];
      const structuralRoots = buildFlowForest(variant.flows, mappingDocuments);
      const itemCount = structuralRoots.length + childFields.length;
      if (itemCount === 0) {
        lines.push(`${variantPrefix}└─ ✗ no mapped OCF source`);
        return;
      }
      let itemIndex = 0;
      structuralRoots.forEach((root) => {
        const rootLast = itemIndex++ === itemCount - 1;
        renderCompactFlowNode(root, variantPrefix, rootLast, mappingDocuments, lines);
      });
      childFields.forEach((field) => {
        const fieldLast = itemIndex++ === itemCount - 1;
        renderCompactField(
          variant.child.name,
          field,
          relevantVariantFlows(variant, field, childGroup, mappingDocuments),
          variantPrefix,
          fieldLast,
          mappingDocuments,
          lines
        );
      });
    });
  }

  if (includeMappingQuestions) {
    const mappingQuestions = openQuestionsForFlows(
      [...group.flows.values()].flat(),
      mappingDocuments,
      (question) => question.property === null && question.target === null
    );
    if (mappingQuestions.length > 0) {
      lines.push("", "mapping questions");
      mappingQuestions.forEach((question, index) => {
        lines.push(
          `  ${index === mappingQuestions.length - 1 ? "└─ " : "├─ "}${compactQuestionLabel(
            question
          )}`
        );
      });
    }
  }
  return lines;
}

function boxLine(content: string, innerWidth: number): string {
  return `│ ${content.padEnd(innerWidth - 2)} │`;
}

function renderBox(title: string, metadata: string[], body: string[] = []): string[] {
  const titleText = ` ${title} `;
  const innerWidth =
    Math.max(
      titleText.length,
      ...metadata.map((line) => line.length),
      ...body.map((line) => line.length)
    ) + 2;
  const lines = [
    `╭${titleText}${"─".repeat(innerWidth - titleText.length)}╮`,
    ...metadata.map((line) => boxLine(line, innerWidth)),
  ];
  if (body.length > 0) {
    lines.push(`├${"─".repeat(innerWidth)}┤`);
    lines.push(...body.map((line) => boxLine(line, innerWidth)));
  }
  lines.push(`╰${"─".repeat(innerWidth)}╯`);
  return lines;
}

function flowCount(group: TargetGroup): number {
  return [...group.flows.values()].reduce((count, flows) => count + flows.length, 0);
}

function flowCountBySourceKind(group: TargetGroup, sourceKind: MappingEdge["sourceKind"]): number {
  return [...group.flows.values()].flat().filter((flow) => flow.sourceKind === sourceKind).length;
}

function renderObjectPanel(
  row: CartaDefCoverage,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined,
  groups: Map<string, TargetGroup>,
  compactAggregateTree = false
): string[] {
  const hasMappings = group.flows.size > 0;
  const fields = sortedTargetFields(row.name, group, inverse);
  const unmappedProperties = hasMappings ? row.emptySlots.length : 0;
  const metadata = [
    `name: ${row.name}`,
    `id: "#/$defs/${row.name}"`,
    `inverse_role: ${row.status}`,
    `status: ${hasMappings ? (unmappedProperties > 0 ? "PARTIAL" : "MAPPED") : "NO MAPPINGS"}`,
    `mapping_evidence: ${flowCount(group)} (direct object: ${flowCountBySourceKind(
      group,
      "object"
    )}, reusable type detail: ${flowCountBySourceKind(group, "type")})`,
  ];
  if (hasMappings) metadata.push(`unmapped_properties: ${unmappedProperties}`);
  if (!hasMappings && row.reason) metadata.push(`reason: ${row.reason}`);
  const summary =
    mappingDocuments && hasMappings
      ? renderObjectSummary(row.name, group, inverse, mappingDocuments, groups)
      : [];
  const mappingDetail = compactAggregateTree
    ? renderCompactAggregateMappingLedger(row.name, group, inverse, mappingDocuments, groups)
    : renderMappingTree(row.name, group, inverse, mappingDocuments);
  const body = hasMappings
    ? [
        ...summary,
        ...(summary.length > 0
          ? ["", compactAggregateTree ? "aggregate mapping ledger" : "aggregate mapping detail"]
          : []),
        ...mappingDetail,
      ]
    : ["(empty mapping)"];
  return renderBox(`Carta object: ${row.name}`, metadata, body);
}

function renderSection(
  title: string,
  rows: CartaDefCoverage[],
  groups: Map<string, TargetGroup>,
  inverse: InverseCoverageLedger,
  mappingDocuments?: ReadonlyMap<string, MappingQuestionDocument>,
  compactAggregateTree = false
): string[] {
  const lines = [`${title} (${rows.length})`];
  rows.forEach((row, index) => {
    lines.push(
      ...renderObjectPanel(
        row,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse,
        mappingDocuments,
        groups,
        compactAggregateTree
      )
    );
    if (index < rows.length - 1) lines.push("");
  });
  return lines;
}

function renderCoverageStory(inverse: InverseCoverageLedger): string[] {
  const story = inverseCoverageStory(inverse);
  const counts = inverse.metrics.definitionRoleCounts;
  const otherNonObjectText = story.otherNonObjectDefs
    ? ` + ${story.otherNonObjectDefs} other non-object definitions`
    : "";
  return [
    "",
    "Simple story",
    `  1. Carta defines ${story.totalDefs} total definitions.`,
    `  2. ${story.nonObjectDefs} are non-object definitions:`,
    `       ${story.scalarEnumDefs} scalar enum definitions (field vocabularies) + ${story.scalarValueTypeDefs} curated scalar support types; neither is a standalone mapping target.`,
    `  3. ${story.objectDefs} are object-shaped definitions.`,
    `  4. Of those ${story.objectDefs}:`,
    `       ${story.nonEntityObjectDefs} are support definitions, not standalone objects (${counts["nested-obj"]} nested objects + ${counts["value-type"]} object-shaped value type).`,
    `       ${story.standaloneCandidateDefs} are standalone mapping candidates.`,
    `  5. ${story.nonEntityDefs} support definitions are excluded from standalone mapping: ${story.nonEntityObjectDefs} object-shaped support definitions + ${story.scalarValueTypeDefs} scalar support types.`,
    `  6. ${story.mappedDefs} standalone candidates have OCF mapping evidence:`,
    `       ${counts.direct} direct executable, ${counts["type-only"]} type-only, ${counts.deferred} deferred.`,
    `       Completeness: ${story.fullyMappedDefs} fully mapped, ${story.partiallyMappedDefs} partially mapped.`,
    `  7. ${story.unmappedCandidateDefs} standalone candidates have no mapping evidence yet; their inventory role says whether that is expected or actionable:`,
    `       ${counts["report-rollup"]} report/read-model roll-ups, ${counts.alternate} alternate shapes,`,
    `       ${counts["vendor-family"]} CARTA-specific families without OCF sources, ${counts["workflow-gap"]} workflow/data gaps,`,
    `       ${counts.gap} actionable gaps, ${counts.review} requiring review.`,
    `  Check: ${story.totalDefs} = ${story.nonObjectDefs} non-object + ${story.objectDefs} object-shaped; ${story.nonObjectDefs} = ${story.scalarEnumDefs} scalar enum + ${story.scalarValueTypeDefs} scalar support${otherNonObjectText}; ${story.standaloneCandidateDefs} = ${story.mappedDefs} + ${story.unmappedCandidateDefs}; ${story.objectDefs} = ${story.standaloneCandidateDefs} + ${story.nonEntityObjectDefs}.`,
  ];
}

function wrapReportText(
  text: string,
  firstPrefix: string,
  continuationPrefix: string,
  width = 112
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = firstPrefix;
  for (const word of words) {
    const separator = current === firstPrefix ? "" : " ";
    if (current !== firstPrefix && current.length + separator.length + word.length > width) {
      lines.push(current);
      current = continuationPrefix + word;
    } else {
      current += separator + word;
    }
  }
  if (current !== firstPrefix) lines.push(current);
  return lines;
}

function renderExcludedRoleGroup(
  title: string,
  rows: InverseExcludedRoleRow[],
  detail: "value" | "nested"
): string[] {
  const lines = ["", `  ${title} (${rows.length})`];
  for (const row of rows) {
    if (detail === "nested") {
      lines.push(
        ...wrapReportText(
          `#/$defs/${row.name} — parent(s): ${row.coveredThrough}`,
          "    - ",
          "      "
        )
      );
      continue;
    }
    lines.push(`    - #/$defs/${row.name}`);
    lines.push(...wrapReportText(`through: ${row.coveredThrough}`, "      ", "      "));
    lines.push(...wrapReportText(`note: ${row.reason}`, "      ", "      "));
  }
  return lines;
}

function renderExcludedRows(rows: InverseExcludedRoleRow[]): string[] {
  const groups = groupInverseExcludedRoleRows(rows);
  const lines = [
    "",
    `Supporting CARTA definitions excluded from standalone mapping targets (${rows.length})`,
    `  ${
      groups.nestedWithMappedParent.length + groups.nestedWithoutMappedParent.length
    } nested object definitions + ${groups.valueTypes.length} value-type support definitions.`,
    `  These ${rows.length} definitions are packaging/support types, not standalone mapping targets; their mapping/type evidence remains valid.`,
  ];
  lines.push(
    ...renderExcludedRoleGroup("Value-type support definitions", groups.valueTypes, "value"),
    ...renderExcludedRoleGroup(
      "Nested objects with mapped parent coverage",
      groups.nestedWithMappedParent,
      "nested"
    ),
    ...renderExcludedRoleGroup(
      "Nested objects without mapped parent coverage",
      groups.nestedWithoutMappedParent,
      "nested"
    )
  );
  return lines;
}

function rowForTarget(
  inverse: InverseCoverageLedger,
  object: string
): CartaDefCoverage | undefined {
  return inverse.defs.find((row) => row.name === object);
}

export function renderMappingInverseReport(options: MappingInverseReportOptions): string {
  const { inverse } = options;
  const groups = buildGroups(inverse);
  const allObjects = targetObjectNames(inverse);
  const mapped = mappedDefinitions(inverse);
  const followUp = followUpDefinitions(inverse);
  const excluded = inverse.excludedRoleRows;
  const sourceDocuments =
    options.sourceDocuments ?? new Set(inverse.edges.map((edge) => edge.rel)).size;
  const greenDocuments =
    options.greenDocuments ?? new Set(inverse.edges.map((edge) => edge.rel)).size;
  const lines = renderBox("Carta inverse coverage report", [
    `source_documents: ${sourceDocuments}`,
    `green_carta_documents: ${greenDocuments}`,
  ]);

  lines.push(
    "",
    "Evidence legend",
    "  [object] direct OCF object route; [type] reusable mapping detail used by that route, not a separate source record.",
    "  inverse semantics are orthogonal: record-construction (default), reference-only, state-projection, aggregate-projection, or event-reconstruction."
  );

  lines.push(...renderCoverageStory(inverse));

  if (options.targetObject) {
    const row = rowForTarget(inverse, options.targetObject);
    if (!row || !allObjects.includes(options.targetObject)) {
      lines.push("", `No object-like Carta definition found for ${options.targetObject}`);
      return lines.join("\n");
    }
    if (row.status === "value-type" || row.status === "nested-obj") {
      lines.push(
        "",
        `Carta definition ${options.targetObject} is a supporting definition, not a standalone mapping target (${row.status}).`
      );
    }
    if (options.mappingDocuments) {
      if (options.includeRelatedObjectPropertyFlows !== false) {
        lines.push(
          ...renderRelatedObjectDiagrams([row], groups, inverse, options.mappingDocuments)
        );
      }
    }
    lines.push(...renderExcludedRows(excluded));
    lines.push(
      "",
      ...renderObjectPanel(
        row,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse,
        options.mappingDocuments,
        groups,
        options.compactAggregateTrees === true
      )
    );
    return lines.join("\n");
  }

  if (options.mappingDocuments) {
    if (options.includeRelatedObjectPropertyFlows !== false) {
      lines.push(...renderRelatedObjectDiagrams(mapped, groups, inverse, options.mappingDocuments));
    }
  }

  lines.push(...renderExcludedRows(excluded));

  if (mapped.length > 0) {
    lines.push(
      "",
      ...renderSection(
        "Standalone Carta targets with mapping evidence",
        mapped,
        groups,
        inverse,
        options.mappingDocuments,
        options.compactAggregateTrees === true
      )
    );
  }
  if (followUp.length > 0) {
    lines.push(
      "",
      ...renderSection(
        "Standalone candidates requiring inventory detail",
        followUp,
        groups,
        inverse,
        options.mappingDocuments,
        options.compactAggregateTrees === true
      )
    );
  }
  if (allObjects.length === 0) lines.push("", "(no object-like Carta definitions found)");
  return lines.join("\n");
}
