import {
  CartaDefCoverage,
  InverseCoverageLedger,
  InverseExcludedRoleRow,
  isInverseMappedDefinition,
  inverseCoverageStory,
} from "./inverse-coverage.js";
import { MappingEdge } from "./core-corpus.js";
import { targetPointerParts } from "./mapping-report.js";

interface InverseFlow {
  file: string;
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
}

function edgeSourceField(edge: MappingEdge): string {
  if (edge.field) return edge.field;
  if (edge.detail === "primary_targets") return "(primary target)";
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
  return `${flow.file} :: ${flow.sourceField}${context} (${flow.kind})`;
}

function sameFlow(left: InverseFlow, right: InverseFlow): boolean {
  return (
    left.file === right.file &&
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
  inverse: InverseCoverageLedger
): string[] {
  const fields = sortedTargetFields(object, group, inverse);
  const lines: string[] = [];
  fields.forEach((field, fieldIndex) => {
    const lastField = fieldIndex === fields.length - 1;
    const flows = group.flows.get(field) ?? [];
    lines.push(`${lastField ? "└── " : "├── "}${field}`);
    const flowPrefix = lastField ? "    " : "│   ";
    if (flows.length === 0) {
      lines.push(`${flowPrefix}└── ✗ no mapped OCF source`);
      return;
    }
    flows.sort((left, right) => flowLabel(left).localeCompare(flowLabel(right)));
    flows.forEach((flow, flowIndex) => {
      const lastFlow = flowIndex === flows.length - 1;
      lines.push(`${flowPrefix}${lastFlow ? "└── " : "├── "}${flowLabel(flow)}`);
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

function renderObjectPanel(
  row: CartaDefCoverage,
  group: TargetGroup,
  inverse: InverseCoverageLedger
): string[] {
  const hasMappings = group.flows.size > 0;
  const fields = sortedTargetFields(row.name, group, inverse);
  const unmappedProperties = hasMappings ? row.emptySlots.length : 0;
  const metadata = [
    `name: ${row.name}`,
    `id: "#/$defs/${row.name}"`,
    `inverse_role: ${row.status}`,
    `status: ${hasMappings ? (unmappedProperties > 0 ? "PARTIAL" : "MAPPED") : "NO MAPPINGS"}`,
    `incoming_mappings: ${flowCount(group)}`,
  ];
  if (hasMappings) metadata.push(`unmapped_properties: ${unmappedProperties}`);
  if (!hasMappings && row.reason) metadata.push(`reason: ${row.reason}`);
  const body = hasMappings ? renderMappingTree(row.name, group, inverse) : ["(empty mapping)"];
  return renderBox(`Carta object: ${row.name}`, metadata, body);
}

function renderSection(
  title: string,
  rows: CartaDefCoverage[],
  groups: Map<string, TargetGroup>,
  inverse: InverseCoverageLedger
): string[] {
  const lines = [`${title} (${rows.length})`];
  rows.forEach((row, index) => {
    lines.push(
      ...renderObjectPanel(
        row,
        groups.get(row.name) ?? { object: row.name, flows: new Map() },
        inverse
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

function renderExcludedRows(
  rows: InverseExcludedRoleRow[],
  inverse: InverseCoverageLedger
): string[] {
  const nested = rows.filter((row) => row.role === "nested-obj").length;
  const valueTypes = rows.filter((row) => row.role === "value-type").length;
  const scalarValueTypes = Math.max(0, valueTypes - inverse.metrics.valueTypeDefs);
  const lines = [
    "",
    `Supporting CARTA definitions excluded from standalone mapping targets (${rows.length})`,
    `  ${nested} nested object definitions + ${valueTypes} curated value types (${scalarValueTypes} scalar wrappers, ${inverse.metrics.valueTypeDefs} object-shaped value type).`,
    `  These ${rows.length} definitions are packaging/support types, not standalone mapping targets; their mapping/type evidence remains valid.`,
  ];
  for (const row of rows) {
    lines.push(`  - ${row.role}: #/$defs/${row.name} — ${row.coveredThrough}; ${row.reason}`);
  }
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

  lines.push(...renderCoverageStory(inverse), ...renderExcludedRows(excluded, inverse));

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
        inverse
      )
    );
    return lines.join("\n");
  }

  if (mapped.length > 0) {
    lines.push(
      "",
      ...renderSection("Standalone Carta targets with mapping evidence", mapped, groups, inverse)
    );
  }
  if (followUp.length > 0) {
    lines.push(
      "",
      ...renderSection(
        "Standalone candidates requiring inventory detail",
        followUp,
        groups,
        inverse
      )
    );
  }
  if (allObjects.length === 0) lines.push("", "(no object-like Carta definitions found)");
  return lines.join("\n");
}
