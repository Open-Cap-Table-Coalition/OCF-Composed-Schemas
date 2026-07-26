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

interface SvgFlowRow {
  route: SourceRoute;
  flow: PropertyFlowRow;
  targetPrefix: string;
}

interface SvgFlowSection {
  title: string;
  rows: SvgFlowRow[];
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

function svgFlowSections(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument>,
  groups: Map<string, TargetGroup>
): SvgFlowSection[] {
  const variants = targetVariantsForGroup(object, group, inverse);
  if (variants.length < 2) return [];
  const routes = sourceRoutesForFlows(
    variants.flatMap((variant) => variant.flows),
    mappingDocuments
  );
  const sections: SvgFlowSection[] = [];
  for (const variant of variants) {
    const cardinality = variant.child.cardinality === "array" ? "[]" : "";
    const targetPrefix = `${object}.${variant.property}${cardinality}.`;
    const rows = routes.flatMap((route) =>
      propertyFlowsForVariant(variant, route, groups).map((flow) => ({
        route,
        flow,
        targetPrefix,
      }))
    );
    sections.push({ title: `${variant.property}${cardinality} → ${variant.child.name}`, rows });
  }

  const nestedProperties = new Set(variants.map((variant) => variant.property));
  const parentRows = routes.flatMap((route) =>
    parentPropertyFlowsForRoute(route, group, nestedProperties).map((flow) => ({
      route,
      flow,
      targetPrefix: `${object}.`,
    }))
  );
  if (parentRows.length > 0) sections.push({ title: "Shared parent properties", rows: parentRows });
  return sections;
}

function renderMappingFlowSvg(object: string, sections: readonly SvgFlowSection[]): string {
  const width = 1800;
  const sourceX = 64;
  const sourceWidth = 620;
  const arrowX1 = sourceX + sourceWidth + 24;
  const arrowX2 = 900;
  const targetX = 930;
  const targetWidth = width - targetX - 64;
  const rowGap = 16;
  const sectionGap = 26;
  const rowHeight = 86;
  const sectionHeaderHeight = 52;
  const titleHeight = 132;
  const height =
    titleHeight +
    sections.reduce(
      (total, section) =>
        total +
        sectionHeaderHeight +
        Math.max(section.rows.length, 1) * (rowHeight + rowGap) +
        sectionGap,
      0
    ) +
    30;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">`,
    `<title id="title">${svgEscape(object)} related object property flows</title>`,
    `<desc id="desc">Direct OCF source-property to Carta target-property mappings grouped by nested variant.</desc>`,
    `<style>text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}</style>`,
    `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 z" fill="#64748b"/></marker></defs>`,
    `<rect width="${width}" height="${height}" fill="#f8fafc"/>`,
    svgText(`${object}`, sourceX, 48, {
      fill: "#0f172a",
      fontSize: 32,
      fontWeight: 700,
      maxChars: 60,
    }),
    svgText("Related object property flows", sourceX, 82, {
      fill: "#475569",
      fontSize: 20,
      maxChars: 80,
    }),
    svgText("Each arrow is one explicit OCF property → Carta property mapping", sourceX, 112, {
      fill: "#64748b",
      fontSize: 16,
      maxChars: 110,
    }),
    `<rect x="${
      width - 440
    }" y="36" width="20" height="20" rx="4" fill="#e6f4ea" stroke="#62a576"/>`,
    svgText("OCF source", width - 406, 52, { fill: "#166534", fontSize: 16, maxChars: 20 }),
    `<rect x="${
      width - 230
    }" y="36" width="20" height="20" rx="4" fill="#e8f0fe" stroke="#6b8fd6"/>`,
    svgText("Carta target", width - 196, 52, { fill: "#1e3a8a", fontSize: 16, maxChars: 20 }),
  ];

  let y = titleHeight;
  sections.forEach((section) => {
    parts.push(
      `<rect x="${sourceX}" y="${y}" width="${
        width - sourceX * 2
      }" height="${sectionHeaderHeight}" rx="10" fill="#ede9fe" stroke="#a78bfa"/>`,
      svgText(section.title, sourceX + 20, y + 32, {
        fill: "#4c1d95",
        fontSize: 20,
        fontWeight: 700,
        maxChars: 100,
      })
    );
    y += sectionHeaderHeight + 12;

    if (section.rows.length === 0) {
      parts.push(
        svgText("No direct property flows for this variant.", sourceX + 20, y + 28, {
          fill: "#64748b",
          fontSize: 16,
          maxChars: 70,
        })
      );
      y += rowHeight + rowGap;
    } else {
      section.rows.forEach((row) => {
        const sourceLabel = sourceRouteDisplayName(row.route);
        const condition =
          row.route.discriminator && row.route.when && row.route.when.length > 0
            ? `when ${row.route.discriminator} = ${row.route.when.join(" or ")}`
            : undefined;
        const sourceLines = [sourceLabel, row.flow.sourceField, ...(condition ? [condition] : [])];
        const targetLabel = `${row.targetPrefix}${row.flow.targetField}`;
        const sourceText = sourceLines
          .map((line, index) =>
            svgText(line, sourceX + 22, y + 27 + index * 18, {
              fill: index === 1 ? "#14532d" : "#166534",
              fontSize: index === 1 ? 18 : index === 2 ? 13 : 15,
              fontWeight: index === 1 ? 700 : 500,
              maxChars: 58,
            })
          )
          .join("");
        const targetText = svgText(targetLabel, targetX + 22, y + 34, {
          fill: "#1e3a8a",
          fontSize: 18,
          fontWeight: 700,
          maxChars: 66,
        });
        parts.push(
          `<rect x="${sourceX}" y="${y}" width="${sourceWidth}" height="${rowHeight}" rx="10" fill="#e6f4ea" stroke="#62a576"/>`,
          sourceText,
          `<line x1="${arrowX1}" y1="${y + rowHeight / 2}" x2="${arrowX2}" y2="${
            y + rowHeight / 2
          }" stroke="#64748b" stroke-width="3" marker-end="url(#arrow)"/>`,
          `<rect x="${targetX}" y="${y}" width="${targetWidth}" height="${rowHeight}" rx="10" fill="#e8f0fe" stroke="#6b8fd6"/>`,
          targetText
        );
        y += rowHeight + rowGap;
      });
    }
    y += sectionGap;
  });
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
    const sections = svgFlowSections(
      row.name,
      group,
      options.inverse,
      options.mappingDocuments,
      groups
    );
    if (sections.length === 0) continue;
    artifacts.set(`${svgSlug(row.name)}.svg`, renderMappingFlowSvg(row.name, sections));
  }
  return artifacts;
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
  groups: Map<string, TargetGroup>
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
  const mappingDetail = renderMappingTree(row.name, group, inverse, mappingDocuments);
  const body = hasMappings
    ? [
        ...summary,
        ...(summary.length > 0 ? ["", "aggregate mapping detail"] : []),
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
  mappingDocuments?: ReadonlyMap<string, MappingQuestionDocument>
): string[] {
  const lines = [`${title} (${rows.length})`];
  rows.forEach((row, index) => {
    lines.push(
      ...renderObjectPanel(
        row,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse,
        mappingDocuments,
        groups
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
      lines.push(...renderRelatedObjectDiagrams([row], groups, inverse, options.mappingDocuments));
    }
    lines.push(...renderExcludedRows(excluded));
    lines.push(
      "",
      ...renderObjectPanel(
        row,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse,
        options.mappingDocuments,
        groups
      )
    );
    return lines.join("\n");
  }

  if (options.mappingDocuments) {
    lines.push(...renderRelatedObjectDiagrams(mapped, groups, inverse, options.mappingDocuments));
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
        options.mappingDocuments
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
        options.mappingDocuments
      )
    );
  }
  if (allObjects.length === 0) lines.push("", "(no object-like Carta definitions found)");
  return lines.join("\n");
}
