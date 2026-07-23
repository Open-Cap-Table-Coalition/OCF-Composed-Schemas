import { RawSchema } from "./registry.js";
import {
  MappingReportDocument,
  commonFields,
  compositeFields,
  effectiveVariantFields,
  targetObjectName,
  targetPointerParts,
  targetPointers,
} from "./mapping-report.js";
import { compositeStepIds } from "./mapping-validator.js";

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
  documents: ReadonlyMap<string, MappingReportDocument>;
  targetBundle?: RawSchema;
  targetObject?: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mappingKind(entry: unknown): string {
  return isPlainObject(entry) && typeof entry.kind === "string" ? entry.kind : "?";
}

function addFlows(
  groups: Map<string, TargetGroup>,
  file: string,
  fields: Record<string, unknown>,
  context?: string
): void {
  for (const [sourceField, entry] of Object.entries(fields)) {
    for (const pointer of targetPointers(entry)) {
      const object = targetObjectName(pointer);
      if (object === "?") continue;
      const parts = targetPointerParts(pointer);
      const field = parts.relative === parts.object ? "(object route)" : parts.relative;
      const group = groups.get(object) ?? { object, flows: new Map() };
      const flowKey = field;
      const flows: InverseFlow[] = group.flows.get(flowKey) ?? [];
      const flow: InverseFlow = {
        file,
        sourceField,
        kind: mappingKind(entry),
        pointer,
        ...(context ? { context } : {}),
      };
      if (
        !flows.some(
          (existing) =>
            existing.file === flow.file &&
            existing.sourceField === flow.sourceField &&
            existing.kind === flow.kind &&
            existing.pointer === flow.pointer &&
            existing.context === flow.context
        )
      ) {
        flows.push(flow);
      }
      group.flows.set(flowKey, flows);
      groups.set(object, group);
    }
  }
}

function addPrimaryTargets(
  groups: Map<string, TargetGroup>,
  file: string,
  variant: string,
  rawVariant: unknown
): void {
  if (!isPlainObject(rawVariant) || !Array.isArray(rawVariant.primary_targets)) return;
  for (const pointer of rawVariant.primary_targets) {
    if (typeof pointer !== "string" || !pointer.startsWith("#/")) continue;
    const object = targetObjectName(pointer);
    if (object === "?") continue;
    const group = groups.get(object) ?? { object, flows: new Map() };
    const flows: InverseFlow[] = group.flows.get("(object route)") ?? [];
    const flow: InverseFlow = {
      file,
      sourceField: "(primary target)",
      kind: "route",
      pointer,
      context: variant,
    };
    if (!flows.some((existing) => existing.file === file && existing.context === variant)) {
      flows.push(flow);
    }
    group.flows.set("(object route)", flows);
    groups.set(object, group);
  }
}

function collectDocumentFlows(
  groups: Map<string, TargetGroup>,
  file: string,
  document: MappingReportDocument
): void {
  const mapping = document.mapping;
  const variants = isPlainObject(mapping.variants) ? mapping.variants : null;
  if (!variants) {
    addFlows(groups, file, isPlainObject(mapping.fields) ? mapping.fields : {});
    return;
  }

  const labels = Object.keys(variants);
  const stepIds = compositeStepIds(mapping);
  const effective = new Map<string, Record<string, unknown>>();
  for (const label of labels) {
    effective.set(label, effectiveVariantFields(mapping, label, stepIds));
    addPrimaryTargets(groups, file, label, variants[label]);
  }

  const common = commonFields(mapping, labels, effective, stepIds.length > 0);
  addFlows(groups, file, common, "shared");

  for (const label of labels) {
    const fields = effective.get(label) ?? {};
    const visible = Object.fromEntries(
      Object.entries(fields).filter(([field]) => !(field in common))
    );
    if (stepIds.length === 0) {
      addFlows(groups, file, visible, label);
      continue;
    }

    for (const step of stepIds) {
      addFlows(groups, file, compositeFields(visible, label, step), `${label} · ${step}`);
    }
    // Non-step-keyed fields are still valid mappings alongside a composite.
    addFlows(
      groups,
      file,
      Object.fromEntries(
        Object.entries(visible).filter(([, entry]) => {
          return !(isPlainObject(entry) && isPlainObject(entry.target));
        })
      ),
      label
    );
  }
}

function targetProperties(targetBundle: RawSchema | undefined, object: string): string[] {
  if (!targetBundle || !isPlainObject(targetBundle.$defs)) return [];
  const definition = targetBundle.$defs[object];
  if (!isPlainObject(definition) || !isPlainObject(definition.properties)) return [];
  return Object.keys(definition.properties);
}

function targetObjectNames(targetBundle: RawSchema | undefined): string[] {
  if (!targetBundle || !isPlainObject(targetBundle.$defs)) return [];
  return Object.entries(targetBundle.$defs)
    .filter(([, definition]) => {
      if (!isPlainObject(definition)) return false;
      return (
        definition.type === "object" ||
        (Array.isArray(definition.type) && definition.type.includes("object")) ||
        isPlainObject(definition.properties)
      );
    })
    .map(([object]) => object);
}

function flowLabel(flow: InverseFlow): string {
  const context = flow.context ? ` [${flow.context}]` : "";
  return `${flow.file} :: ${flow.sourceField}${context} (${flow.kind})`;
}

function sortedTargetFields(
  object: string,
  group: TargetGroup,
  targetBundle: RawSchema | undefined
): string[] {
  const fields = new Set(targetProperties(targetBundle, object));
  for (const field of group.flows.keys()) fields.add(field);
  return [...fields].sort((left, right) => {
    if (left === "(object route)") return -1;
    if (right === "(object route)") return 1;
    return left.localeCompare(right);
  });
}

function renderObject(
  object: string,
  group: TargetGroup,
  targetBundle: RawSchema | undefined,
  prefix: string,
  connector: "├── " | "└── "
): string[] {
  const hasMappings = group.flows.size > 0;
  const lines = [`${prefix}${connector}${object}${hasMappings ? "" : " [NO MAPPINGS]"}`];
  if (!hasMappings) return lines;

  const fields = sortedTargetFields(object, group, targetBundle);
  const childPrefix = prefix + (connector === "└── " ? "    " : "│   ");
  fields.forEach((field, fieldIndex) => {
    const lastField = fieldIndex === fields.length - 1;
    const flows: InverseFlow[] = group.flows.get(field) ?? [];
    lines.push(`${childPrefix}${lastField ? "└── " : "├── "}${field}`);
    const flowPrefix = childPrefix + (lastField ? "    " : "│   ");
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

function renderObjectCategory(
  label: string,
  objects: string[],
  groups: Map<string, TargetGroup>,
  targetBundle: RawSchema | undefined,
  prefix: string,
  connector: "├── " | "└── "
): string[] {
  const lines = [`${prefix}${connector}${label} (${objects.length})`];
  const childPrefix = prefix + (connector === "└── " ? "    " : "│   ");
  objects.forEach((object, index) => {
    lines.push(
      ...renderObject(
        object,
        groups.get(object) ?? { object, flows: new Map() },
        targetBundle,
        childPrefix,
        index === objects.length - 1 ? "└── " : "├── "
      )
    );
  });
  return lines;
}

export function renderMappingInverseReport(options: MappingInverseReportOptions): string {
  const groups = new Map<string, TargetGroup>();
  for (const [file, document] of options.documents) collectDocumentFlows(groups, file, document);
  const bundleObjects = new Set(targetObjectNames(options.targetBundle));

  const selected = options.targetObject
    ? [options.targetObject].filter((object) => groups.has(object) || bundleObjects.has(object))
    : [...new Set([...groups.keys(), ...bundleObjects])].sort();

  const lines = [`Carta inverse mapping report (${options.documents.size} source documents)`];
  if (options.targetObject) {
    if (selected.length === 0) {
      lines.push("└── no target flows found");
      return lines.join("\n");
    }
    const object = selected[0]!;
    lines.push(
      ...renderObject(
        object,
        groups.get(object) ?? { object, flows: new Map() },
        options.targetBundle,
        "",
        "└── "
      )
    );
    return lines.join("\n");
  }

  const mappedTargets = selected.filter((object) => (groups.get(object)?.flows.size ?? 0) > 0);
  const unmappedObjects = selected.filter((object) => (groups.get(object)?.flows.size ?? 0) === 0);
  const categories = [mappedTargets.length > 0, unmappedObjects.length > 0].filter(Boolean).length;
  let categoryIndex = 0;
  if (mappedTargets.length > 0) {
    categoryIndex++;
    lines.push(
      ...renderObjectCategory(
        "Carta targets with mappings",
        mappedTargets,
        groups,
        options.targetBundle,
        "",
        categoryIndex === categories ? "└── " : "├── "
      )
    );
  }
  if (unmappedObjects.length > 0) {
    lines.push(
      ...renderObjectCategory(
        "Carta objects with no mappings",
        unmappedObjects,
        groups,
        options.targetBundle,
        "",
        "└── "
      )
    );
  }
  if (selected.length === 0) lines.push("└── no target flows found");
  return lines.join("\n");
}
