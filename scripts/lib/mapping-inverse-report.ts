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

function renderTree(nodes: Array<{ label: string; children?: string[] }>, prefix = ""): string[] {
  const out: string[] = [];
  nodes.forEach((node, index) => {
    const last = index === nodes.length - 1;
    out.push(`${prefix}${last ? "└── " : "├── "}${node.label}`);
    if (node.children) {
      node.children.forEach((child, childIndex) => {
        const childLast = childIndex === node.children!.length - 1;
        out.push(`${prefix}${last ? "    " : "│   "}${childLast ? "└── " : "├── "}${child}`);
      });
    }
  });
  return out;
}

export function renderMappingInverseReport(options: MappingInverseReportOptions): string {
  const groups = new Map<string, TargetGroup>();
  for (const [file, document] of options.documents) collectDocumentFlows(groups, file, document);
  const bundleObjects = new Set(targetObjectNames(options.targetBundle));

  const selected = options.targetObject
    ? [options.targetObject].filter((object) => groups.has(object) || bundleObjects.has(object))
    : [...new Set([...groups.keys(), ...bundleObjects])].sort();

  const lines = [`Carta inverse mapping report (${options.documents.size} source documents)`];
  for (const object of selected) {
    const group = groups.get(object) ?? { object, flows: new Map() };
    const hasMappings = group.flows.size > 0;
    const properties = new Set(targetProperties(options.targetBundle, object));
    for (const field of group.flows.keys()) {
      if (field !== "(object route)") properties.add(field);
    }

    lines.push(
      ...renderTree(
        [{ label: `${object}${hasMappings ? "" : " [NO MAPPINGS]"}`, children: [] }],
        ""
      )
    );
    const fields: string[] = [...properties].sort((left, right) => {
      if (left === "(object route)") return -1;
      if (right === "(object route)") return 1;
      return left.localeCompare(right);
    });
    if (fields.length === 0 && !hasMappings) {
      lines.push("    └── ✗ no mapped OCF source");
    }
    fields.forEach((field, fieldIndex) => {
      const lastField = fieldIndex === fields.length - 1;
      const fieldPrefix = lastField ? "    └── " : "    ├── ";
      const flows: InverseFlow[] = group.flows.get(field) ?? [];
      lines.push(`${fieldPrefix}${field}`);
      if (flows.length === 0) {
        lines.push(`    ${lastField ? "    " : "│   "}└── ✗ no mapped OCF source`);
        return;
      }
      flows.sort((left, right) => flowLabel(left).localeCompare(flowLabel(right)));
      flows.forEach((flow, flowIndex) => {
        const lastFlow = flowIndex === flows.length - 1;
        lines.push(
          `    ${lastField ? "    " : "│   "}${lastFlow ? "└── " : "├── "}${flowLabel(flow)}`
        );
      });
    });
  }

  if (selected.length === 0) lines.push("└── no target flows found");
  return lines.join("\n");
}
