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

interface InverseFlow {
  file: string;
  sourceKind: MappingEdge["sourceKind"];
  sourceField: string;
  kind: string;
  pointer: string;
  context?: string;
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

interface MappingQuestionDocument {
  questions?: readonly MappingQuestion[];
  mapping?: Record<string, unknown>;
  sourceSchema?: RawSchema;
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
  return `[${flow.sourceKind}] ${flow.file} :: ${flow.sourceField}${context} (${flow.kind})`;
}

interface FlowDetail {
  label: string;
  children?: string[];
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

function schemaForRef(
  ref: string,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): RawSchema | undefined {
  for (const document of mappingDocuments?.values() ?? []) {
    if (document.sourceSchema?.$id === ref) return document.sourceSchema;
  }
  const label = schemaLabel(ref);
  for (const document of mappingDocuments?.values() ?? []) {
    const id = document.sourceSchema?.$id;
    if (typeof id === "string" && schemaLabel(id) === label) return document.sourceSchema;
  }
  return undefined;
}

function unionBranchDetails(
  sourceSchema: RawSchema | undefined,
  field: string,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): FlowDetail | undefined {
  const property = sourceSchema?.properties?.[field];
  if (!isPlainObject(property)) return undefined;
  const branches = [property.oneOf, property.anyOf].find(Array.isArray);
  if (!Array.isArray(branches) || branches.length < 2) return undefined;
  const children = branches.filter(isPlainObject).map((branch) => {
    const ref = typeof branch.$ref === "string" ? branch.$ref : null;
    if (!ref) return "? unnamed union branch";
    const branchSchema = schemaForRef(ref, mappingDocuments);
    const discriminator = branchSchema?.properties?.type?.const;
    return typeof discriminator === "string"
      ? `${schemaLabel(ref)} when type = ${discriminator}`
      : schemaLabel(ref);
  });
  return {
    label: `dispatches ${field}.type`,
    children,
  };
}

function flowDetails(
  flow: InverseFlow,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): FlowDetail[] {
  const document = mappingDocuments?.get(flow.file);
  const entry = mappingEntryForFlow(flow, mappingDocuments);
  const details: FlowDetail[] = [];
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

  const union = unionBranchDetails(document?.sourceSchema, flow.sourceField, mappingDocuments);
  if (union) details.push(union);
  return details;
}

function flowRank(
  flow: InverseFlow,
  mappingDocuments: ReadonlyMap<string, MappingQuestionDocument> | undefined
): number {
  const document = mappingDocuments?.get(flow.file);
  if (unionBranchDetails(document?.sourceSchema, flow.sourceField, mappingDocuments)) return 0;
  if (typeof document?.sourceSchema?.properties?.type?.const === "string") return 1;
  return 2;
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
    left.context === right.context
  );
}

function sameDestination(left: InverseFlow, right: InverseFlow): boolean {
  return (
    left.file === right.file &&
    left.sourceField === right.sourceField &&
    left.kind === right.kind &&
    left.pointer === right.pointer
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
  const flow: InverseFlow = {
    file: edge.rel,
    sourceKind: edge.sourceKind,
    sourceField: edgeSourceField(edge),
    kind: edgeKind(edge),
    pointer: edge.target,
    ...(edgeContext(edge) ? { context: edgeContext(edge) } : {}),
  };
  const group = groups.get(parts.object) ?? { object: parts.object, flows: new Map() };
  const flows: InverseFlow[] = group.flows.get(field) ?? [];
  if (!flows.some((existing) => sameFlow(existing, flow))) {
    const sameDestinationFlow = flows.find((existing) => sameDestination(existing, flow));
    if (sameDestinationFlow) sameDestinationFlow.context = "shared";
    else flows.push(flow);
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
  inverse: InverseCoverageLedger
): string[] {
  const fields = new Set(targetProperties(inverse, object));
  for (const field of group.flows.keys()) fields.add(field);
  return [...fields].sort((left, right) => {
    if (left === "(object route)") return -1;
    if (right === "(object route)") return 1;
    return left.localeCompare(right);
  });
}

function renderMappingTree(
  object: string,
  group: TargetGroup,
  inverse: InverseCoverageLedger,
  mappingDocuments?: ReadonlyMap<string, MappingQuestionDocument>
): string[] {
  const fields = sortedTargetFields(object, group, inverse);
  const allFlows = [...group.flows.values()].flat();
  const mappingQuestions = openQuestionsForFlows(
    allFlows,
    mappingDocuments,
    (question) => question.property === null && question.target === null
  );
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
    const objectFlows = flows.filter((flow) => flow.sourceKind === "object");
    const typeFlows = flows.filter((flow) => flow.sourceKind === "type");
    const sections = [
      ...(objectFlows.length > 0
        ? [{ label: "direct OCF object mapping", flows: objectFlows }]
        : []),
      ...(typeFlows.length > 0
        ? [{ label: "reusable type-mapping detail", flows: typeFlows }]
        : []),
    ];
    if (sections.length === 0) children.push("✗ no mapped OCF source");
    else {
      const hasTrailingChildren = propertyQuestions.length > 0 || targetQuestions.length > 0;
      sections.forEach((section, sectionIndex) => {
        const lastSection = sectionIndex === sections.length - 1 && !hasTrailingChildren;
        lines.push(`${flowPrefix}${lastSection ? "└── " : "├── "}${section.label}`);
        const sectionPrefix = `${flowPrefix}${lastSection ? "    " : "│   "}`;
        section.flows.sort(
          (left, right) =>
            flowRank(left, mappingDocuments) - flowRank(right, mappingDocuments) ||
            flowLabel(left).localeCompare(flowLabel(right))
        );
        section.flows.forEach((flow, flowIndex) => {
          const lastFlow = flowIndex === section.flows.length - 1;
          const details = flowDetails(flow, mappingDocuments);
          lines.push(`${sectionPrefix}${lastFlow ? "└── " : "├── "}${flowLabel(flow)}`);
          const detailPrefix = `${sectionPrefix}${lastFlow ? "    " : "│   "}`;
          details.forEach((detail, detailIndex) => {
            const lastDetail = detailIndex === details.length - 1;
            lines.push(`${detailPrefix}${lastDetail ? "└── " : "├── "}${detail.label}`);
            if (detail.children && detail.children.length > 0) {
              const childPrefix = `${detailPrefix}${lastDetail ? "    " : "│   "}`;
              detail.children.forEach((child, childIndex) => {
                const lastChild = childIndex === detail.children!.length - 1;
                lines.push(`${childPrefix}${lastChild ? "└── " : "├── "}${child}`);
              });
            }
          });
        });
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
  mappingDocuments?: ReadonlyMap<string, MappingQuestionDocument>
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
  const body = hasMappings
    ? renderMappingTree(row.name, group, inverse, mappingDocuments)
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
        mappingDocuments
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
    "  [object] direct OCF object route; [type] reusable mapping detail used by that route, not a separate source record."
  );

  lines.push(...renderCoverageStory(inverse), ...renderExcludedRows(excluded));

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
    lines.push(
      "",
      ...renderObjectPanel(
        row,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse,
        options.mappingDocuments
      )
    );
    return lines.join("\n");
  }

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
