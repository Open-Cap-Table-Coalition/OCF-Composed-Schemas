import { RawSchema } from "./registry.js";
import { deriveMappingCoverage, formatCoverage } from "./mapping-coverage.js";
import { getTransformPolicy } from "./mapping-policies.js";
import { compositeStepIds, isStepKeyedTarget } from "./mapping-validator.js";

/**
 * Pure renderer for the `--verbose` mapping report. Given a parsed mapping
 * document it produces a per-file ASCII tree of what each OCF field maps to.
 *
 * Lenient by design: it renders whatever shape it is handed and never throws on
 * malformed input. Judging correctness is the validator's job; this report is
 * printed even for files that will later show validation errors.
 */

export interface MappingReportInput {
  file: string;
  frontmatter: Record<string, unknown>;
  mapping: Record<string, unknown>;
  sourceSchema?: RawSchema;
  mappingDocuments?: ReadonlyMap<string, MappingReportDocument>;
}

export interface MappingReportDocument {
  frontmatter: Record<string, unknown>;
  mapping: Record<string, unknown>;
  sourceSchema?: RawSchema;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asStringOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

interface RenderContext {
  fieldName?: string;
  sourceSchema?: RawSchema;
  mappingDocuments?: ReadonlyMap<string, MappingReportDocument>;
  mappingPath?: string;
  depth?: number;
  visitedMappings?: ReadonlySet<string>;
}

function mappingLabel(path: string): string {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.mapping\.md$/, "") ?? path
  );
}

function sourceRef(node: unknown): string | null {
  if (!isPlainObject(node)) return null;
  if (typeof node.$ref === "string") return node.$ref;
  for (const key of ["oneOf", "anyOf"]) {
    const branches = node[key];
    if (!Array.isArray(branches)) continue;
    const refs = branches
      .filter(isPlainObject)
      .map((branch) => (typeof branch.$ref === "string" ? branch.$ref : null))
      .filter((ref): ref is string => ref !== null);
    if (refs.length === 1) return refs[0] ?? null;
  }
  return null;
}

function nestedMappingForField(
  document: MappingReportDocument,
  field: string,
  mappingDocuments: ReadonlyMap<string, MappingReportDocument> | undefined
): [string, MappingReportDocument] | null {
  if (!document.sourceSchema || !mappingDocuments) return null;
  const properties = document.sourceSchema.properties;
  const sourceNode = isPlainObject(properties) ? properties[field] : undefined;
  const node =
    isPlainObject(sourceNode) && sourceNode.type === "array" ? sourceNode.items : sourceNode;
  const ref = sourceRef(node);
  if (!ref) return null;
  for (const [path, candidate] of mappingDocuments) {
    if (candidate.sourceSchema?.$id === ref) return [path, candidate];
  }
  return null;
}

function sourceFieldLabel(sourceSchema: RawSchema | undefined, field: string): string {
  if (!sourceSchema || !isPlainObject(sourceSchema.properties)) return field;
  const node = sourceSchema.properties[field];
  if (!isPlainObject(node)) return field;
  if (node.type !== "array") return field;
  const item = sourceItemLabel(sourceSchema, field);
  return `${field}[]${item ? ` (${item})` : ""}`;
}

function sourceItemLabel(sourceSchema: RawSchema | undefined, field: string): string | null {
  if (!sourceSchema || !isPlainObject(sourceSchema.properties)) return null;
  const node = sourceSchema.properties[field];
  if (!isPlainObject(node) || node.type !== "array" || !isPlainObject(node.items)) return null;
  const ref = sourceRef(node.items);
  return ref ? sourceSchemaLabel(ref) : null;
}

function renderReferencedFields(
  path: string,
  document: MappingReportDocument,
  context: RenderContext
): Tree[] {
  const fields = document.mapping.fields;
  if (!isPlainObject(fields)) return [];
  const depth = context.depth ?? 0;
  const visited = new Set(context.visitedMappings ?? []);
  visited.add(path);
  return Object.entries(fields).map(([field, entry]) => {
    const nested =
      depth < 4 && isPlainObject(entry) && entry.kind === "split"
        ? nestedMappingForField(document, field, context.mappingDocuments)
        : null;
    if (nested && !visited.has(nested[0])) {
      const [nestedPath, nestedDocument] = nested;
      const nestedFields = renderReferencedFields(nestedPath, nestedDocument, {
        ...context,
        depth: depth + 1,
        visitedMappings: visited,
      });
      return {
        label: `${field} (${
          isPlainObject(entry) ? `${String(entry.kind)}; ` : ""
        }nested mapping: ${mappingLabel(nestedPath)})`,
        children: nestedFields,
      };
    }
    return itemToTree(renderItem(field, entry));
  });
}

function renderSequentialStep(step: unknown, index: number, context: RenderContext): Tree {
  if (!isPlainObject(step)) {
    return { label: `step ${index + 1} ⚠ malformed`, children: [] };
  }

  if (step.kind === "select") {
    const policy = typeof step.policy === "string" ? step.policy : "?";
    const policyDefinition =
      typeof step.policy === "string" ? getTransformPolicy(step.policy) : null;
    const input = sourceFieldLabel(context.sourceSchema, context.fieldName ?? "source");
    const selectedType = sourceItemLabel(context.sourceSchema, context.fieldName ?? "source");
    const children: Tree[] = [
      { label: `input: ${input}`, children: [] },
      {
        label: `policy: ${policy}${policyDefinition ? " [registered]" : " [unregistered]"}`,
        children: [],
      },
    ];
    if (policyDefinition)
      children.push({ label: `rule: ${policyDefinition.description}`, children: [] });
    if (typeof step.source === "string")
      children.push({ label: `source: ${step.source}`, children: [] });
    children.push({ label: `result: one selected ${selectedType ?? "value"}`, children: [] });
    if (input.includes("[]")) children.push({ label: "unselected values: dropped", children: [] });
    return { label: `${index + 1}. select`, children };
  }

  if (step.kind === "apply_mapping") {
    const mapping = asStringOr(step.mapping, "?");
    const document = context.mappingDocuments?.get(mapping);
    const selectedType = document ? mappingLabel(mapping) : "value";
    const inputChildren: Tree[] = [];
    if (document) {
      inputChildren.push(
        ...renderReferencedFields(mapping, document, {
          ...context,
          depth: 0,
          visitedMappings: new Set([mapping]),
        })
      );
    } else {
      const targets = Array.isArray(step.targets)
        ? step.targets.map((target) => ({ label: asStringOr(target, "?"), children: [] }))
        : [];
      inputChildren.push({ label: "target summary", children: targets });
    }
    const children: Tree[] = [
      { label: `mapping: ${mapping}`, children: [] },
      { label: `input: selected ${selectedType}`, children: inputChildren },
    ];
    return { label: `${index + 1}. apply_mapping`, children };
  }

  return { label: `step ${index + 1} ⚠ kind: ${String(step.kind)}`, children: [] };
}

function sourceSchemaLabel(value: unknown): string {
  if (typeof value !== "string") return "?";
  return (
    value
      .split("/")
      .pop()
      ?.replace(/\.schema\.json$/, "") ?? value
  );
}

/** A node in a (possibly nested) ASCII tree. */
interface Tree {
  label: string;
  children: Tree[];
}

/** A rendered top-level field: a label line plus zero or more child lines. */
interface Item {
  label: string;
  children: Array<string | Tree>;
}

function renderItem(
  name: string,
  entry: unknown,
  routeTargets?: Record<string, string[]>,
  stepIds: string[] = [],
  context: RenderContext = {}
): Item {
  if (!isPlainObject(entry)) {
    return { label: `${name} ⚠ malformed entry`, children: [] };
  }
  const kind = entry.kind;
  const target = entry.target;

  let item: Item;
  switch (kind) {
    case "rename":
    case "construct":
    case "select":
    case "computed":
    case "combine":
      if (isPlainObject(target)) {
        const keys = Object.keys(target);
        if (stepIds.length > 0 && keys.length > 0 && keys.every((k) => stepIds.includes(k))) {
          // A per-STEP target map (composite): keys are step ids, each value a scalar
          // pointer or a per-family map. Render `step · family → target`.
          const children: string[] = [];
          for (const [step, sv] of Object.entries(target)) {
            if (sv === null) children.push(`${step} ✗ unmappable`);
            else if (isPlainObject(sv))
              for (const [fam, ptr] of Object.entries(sv))
                children.push(
                  ptr === null ? `${step} · ${fam} ✗` : `${step} · ${fam} → ${asStringOr(ptr, "?")}`
                );
            else children.push(`${step} → ${asStringOr(sv, "?")}`);
          }
          item = { label: `${name} (${kind} · per step)`, children };
        } else {
          // A per-variant target map (shared field with a divergent home): render each
          // variant's own target (or ✗ where it has none) instead of one borrowed pointer.
          item = {
            label: `${name} (${kind} · per variant)`,
            children: Object.entries(target).map(([variant, ptr]) =>
              ptr === null ? `${variant} ✗ unmappable` : `${variant} → ${asStringOr(ptr, "?")}`
            ),
          };
        }
      } else {
        const policy =
          kind === "select" && typeof entry.policy === "string" ? ` · ${entry.policy}` : "";
        item = { label: `${name} → ${asStringOr(target, "?")} (${kind}${policy})`, children: [] };
      }
      break;

    case "union-map": {
      const cases = Array.isArray(entry.cases) ? entry.cases : [];
      item = {
        label: `${name} (union-map)`,
        children: cases.filter(isPlainObject).map((rawCase) => {
          const source = sourceSchemaLabel(rawCase.source_schema);
          const mapping = isPlainObject(rawCase.mapping) ? rawCase.mapping : {};
          const detail = renderItem("", mapping);
          const values =
            mapping.kind !== "enum-remap" && isPlainObject(mapping.values)
              ? Object.entries(mapping.values).map(([key, value]) => ({
                  label: value === null ? `${key} ✗ dropped` : `${key} → ${String(value)}`,
                  children: [],
                }))
              : [];
          return {
            label: source,
            children: [
              {
                label: detail.label.trimStart(),
                children: [
                  ...detail.children.map((child) =>
                    typeof child === "string" ? { label: child, children: [] } : child
                  ),
                  ...values,
                ],
              },
            ],
          };
        }),
      };
      break;
    }

    case "split":
      {
        const policy = typeof entry.policy === "string" ? ` · policy: ${entry.policy}` : "";
        item = !Array.isArray(target)
          ? { label: `${name} → ? (split${policy})`, children: [] }
          : {
              label: `${name} (split${policy})`,
              children: target.map((el) => asStringOr(el, "?")),
            };
      }
      break;

    case "sequential_transform": {
      const steps = Array.isArray(entry.steps) ? entry.steps : [];
      item = {
        label: `${name} (sequential_transform)`,
        children: steps.map((step, index) =>
          renderSequentialStep(step, index, {
            ...context,
            fieldName: name,
          })
        ),
      };
      break;
    }

    case "enum-remap": {
      const label = `${name} → ${asStringOr(target, "?")} (enum-remap)`;
      const values = entry.values;
      const routedTo = isPlainObject(entry.routed_to) ? entry.routed_to : {};
      item = isPlainObject(values)
        ? {
            label,
            children: Object.entries(values).map(([key, value]) => {
              if (value !== null) return `${key} → ${String(value)}`;
              const route = routedTo[key];
              if (typeof route !== "string") return `${key} ✗ dropped`;
              const tgts = routeTargets?.[route] ?? [];
              return tgts.length
                ? `${key} → routed to "${route}" variant: ${tgts.join(", ")}`
                : `${key} → routed to "${route}" variant`;
            }),
          }
        : { label, children: [] };
      break;
    }

    case "unmappable": {
      const reason = entry.reason;
      item = {
        label:
          typeof reason === "string" ? `${name} ✗ unmappable: ${reason}` : `${name} ✗ unmappable`,
        children: [],
      };
      break;
    }

    default:
      item = { label: `${name} ⚠ kind: ${String(kind)}`, children: [] };
  }

  // A free-text note: renders as the field's last child line (e.g. to record that a
  // value dropped in this variant is routed to another — round-trip preserved).
  if (typeof entry.note === "string") item.children.push(`ℹ ${entry.note}`);
  return item;
}

/** Lift a flat {label, children: string[]} Item into a Tree. */
function itemToTree(item: Item): Tree {
  return {
    label: item.label,
    children: item.children.map((child) =>
      typeof child === "string" ? { label: child, children: [] } : child
    ),
  };
}

/** Recursively draw an ASCII tree from the given root nodes. */
function renderTree(nodes: Tree[], prefix = ""): string[] {
  const out: string[] = [];
  nodes.forEach((node, i) => {
    const last = i === nodes.length - 1;
    out.push(`${prefix}${last ? "└── " : "├── "}${node.label}`);
    out.push(...renderTree(node.children, prefix + (last ? "    " : "│   ")));
  });
  return out;
}

interface TargetField {
  name: string;
  entry: unknown;
  pointers: string[];
}

function unescapePointerToken(value: string): string {
  return value.replace(/~1/g, "/").replace(/~0/g, "~");
}

/** Identify the Carta `$defs` object and shorten a field pointer for display. */
function targetPointerParts(pointer: string): { object: string; relative: string } {
  const match = pointer.match(/^#\/\$defs\/([^/]+)(?:\/(.*))?$/);
  if (!match) return { object: pointer || "?", relative: pointer || "?" };

  const object = unescapePointerToken(match[1]!);
  const remainder = match[2] ?? "";
  const relative = remainder.replace(/^properties\//, "") || object;
  return { object, relative };
}

function targetObjectName(pointer: unknown): string {
  return typeof pointer === "string" ? targetPointerParts(pointer).object : "?";
}

function targetPointers(entry: unknown): string[] {
  if (!isPlainObject(entry)) return [];

  if (entry.kind === "union-map" && Array.isArray(entry.cases)) {
    const pointers: string[] = [];
    for (const rawCase of entry.cases) {
      if (!isPlainObject(rawCase) || !isPlainObject(rawCase.mapping)) continue;
      for (const pointer of targetPointers(rawCase.mapping)) {
        if (!pointers.includes(pointer)) pointers.push(pointer);
      }
    }
    return pointers;
  }

  if (entry.kind === "sequential_transform" && Array.isArray(entry.steps)) {
    const pointers: string[] = [];
    for (const step of entry.steps) {
      if (!isPlainObject(step) || !Array.isArray(step.targets)) continue;
      for (const pointer of step.targets) {
        if (typeof pointer === "string" && pointer.startsWith("#/")) {
          if (!pointers.includes(pointer)) pointers.push(pointer);
        }
      }
    }
    return pointers;
  }

  const target = entry.target;
  if (typeof target === "string") return target.startsWith("#/") ? [target] : [];
  if (Array.isArray(target)) {
    return target.filter(
      (pointer): pointer is string => typeof pointer === "string" && pointer.startsWith("#/")
    );
  }
  return [];
}

function targetEntryForPointers(entry: unknown, pointers: string[]): unknown {
  if (!isPlainObject(entry) || pointers.length === 0) return entry;
  if (entry.kind === "union-map" || entry.kind === "sequential_transform") return entry;

  if (Array.isArray(entry.target)) return { ...entry, target: pointers };
  if (typeof entry.target === "string") {
    return { ...entry, target: pointers[0] };
  }
  return entry;
}

function displayTargetEntry(entry: unknown, pointers: string[]): unknown {
  const projected = targetEntryForPointers(entry, pointers);
  if (!isPlainObject(projected)) return projected;
  if (projected.kind === "union-map" || projected.kind === "sequential_transform") {
    return projected;
  }

  const displayPointer = (pointer: unknown): string =>
    typeof pointer === "string" ? targetPointerParts(pointer).relative : asStringOr(pointer, "?");
  if (typeof projected.target === "string") {
    return { ...projected, target: displayPointer(projected.target) };
  }
  if (Array.isArray(projected.target)) {
    return { ...projected, target: projected.target.map(displayPointer) };
  }
  return projected;
}

function projectVariantEntry(entry: unknown, variant: string, stepIds: string[]): unknown {
  if (!isPlainObject(entry) || !isPlainObject(entry.target)) return entry;

  const target = entry.target;
  if (isStepKeyedTarget(target, stepIds)) {
    const projected: Record<string, unknown> = {};
    for (const step of stepIds) {
      const value = target[step];
      projected[step] = isPlainObject(value) ? (variant in value ? value[variant] : null) : value;
    }
    return { ...entry, target: projected };
  }

  const projected = variant in target ? target[variant] : null;
  if (
    projected === null &&
    typeof entry.kind === "string" &&
    entry.kind !== "unmappable" &&
    entry.kind !== "TODO"
  ) {
    return { ...entry, kind: "unmappable", target: null };
  }
  return { ...entry, target: projected };
}

function effectiveVariantFields(
  mapping: Record<string, unknown>,
  variant: string,
  stepIds: string[]
): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  const shared = isPlainObject(mapping.shared) ? mapping.shared : {};
  for (const [name, entry] of Object.entries(shared)) {
    fields[name] = projectVariantEntry(entry, variant, stepIds);
  }

  const rawVariant = isPlainObject(mapping.variants) ? mapping.variants[variant] : undefined;
  const variantFields =
    isPlainObject(rawVariant) && isPlainObject(rawVariant.fields) ? rawVariant.fields : {};
  Object.assign(fields, variantFields);
  return fields;
}

function entriesEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function commonFields(
  mapping: Record<string, unknown>,
  variants: string[],
  effective: Map<string, Record<string, unknown>>,
  composite: boolean
): Record<string, unknown> {
  if (composite || variants.length === 0 || !isPlainObject(mapping.shared)) return {};

  const out: Record<string, unknown> = {};
  for (const field of Object.keys(mapping.shared)) {
    const first = effective.get(variants[0]!)?.[field];
    if (variants.every((variant) => entriesEqual(effective.get(variant)?.[field], first))) {
      out[field] = first;
    }
  }
  return out;
}

function targetFields(
  fields: Record<string, unknown>,
  declaredTargets: string[],
  routeTargets: Record<string, string[]>,
  context: RenderContext
): Tree[] {
  const groups = new Map<string, { label: string; fields: TargetField[] }>();
  for (const pointer of declaredTargets) {
    const object = targetObjectName(pointer);
    if (!groups.has(object)) groups.set(object, { label: object, fields: [] });
  }

  const unmappable: TargetField[] = [];
  const todo: TargetField[] = [];
  const unresolved: TargetField[] = [];

  for (const [name, entry] of Object.entries(fields)) {
    const pointers = targetPointers(entry);
    if (pointers.length === 0) {
      const item = { name, entry, pointers };
      if (isPlainObject(entry) && entry.kind === "TODO") todo.push(item);
      else if (isPlainObject(entry) && entry.kind === "unmappable") unmappable.push(item);
      else unresolved.push(item);
      continue;
    }

    const byObject = new Map<string, string[]>();
    for (const pointer of pointers) {
      const object = targetObjectName(pointer);
      const objectPointers = byObject.get(object) ?? [];
      objectPointers.push(pointer);
      byObject.set(object, objectPointers);
    }
    for (const [object, objectPointers] of byObject) {
      const group = groups.get(object) ?? { label: object, fields: [] };
      group.fields.push({ name, entry, pointers: objectPointers });
      groups.set(object, group);
    }
  }

  const trees: Tree[] = [];
  for (const group of groups.values()) {
    trees.push({
      label: group.label,
      children: group.fields.map(({ name, entry, pointers }) =>
        itemToTree(renderItem(name, displayTargetEntry(entry, pointers), routeTargets, [], context))
      ),
    });
  }

  const addSpecial = (label: string, items: TargetField[]) => {
    if (items.length === 0) return;
    trees.push({
      label,
      children: items.map(({ name, entry }) =>
        itemToTree(renderItem(name, entry, routeTargets, [], context))
      ),
    });
  };
  addSpecial("unmappable", unmappable);
  addSpecial("TODO", todo);
  addSpecial("unresolved target", unresolved);
  return trees;
}

function compositeTargetForVariant(step: unknown, variant: string): string[] {
  if (!isPlainObject(step)) return [];
  const target = step.target;
  if (typeof target === "string") return [target];
  if (Array.isArray(target))
    return target.filter((value): value is string => typeof value === "string");
  if (!isPlainObject(target)) return [];
  const selected = target[variant];
  if (typeof selected === "string") return [selected];
  if (Array.isArray(selected))
    return selected.filter((value): value is string => typeof value === "string");
  return [];
}

function compositeFields(
  fields: Record<string, unknown>,
  variant: string,
  step: string
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, entry] of Object.entries(fields)) {
    if (!isPlainObject(entry) || !isPlainObject(entry.target)) continue;
    const target = entry.target[step];
    if (typeof target === "string" || Array.isArray(target)) {
      out[name] = { ...entry, target };
      continue;
    }
    if (isPlainObject(target)) {
      const selected = variant in target ? target[variant] : null;
      if (typeof selected === "string" || Array.isArray(selected)) {
        out[name] = { ...entry, target: selected };
      }
    }
  }
  return out;
}

function compositeStepPointers(fields: Record<string, unknown>, stepIds: string[]): Set<string> {
  const used = new Set<string>();
  for (const [name, entry] of Object.entries(fields)) {
    if (!isPlainObject(entry) || !isPlainObject(entry.target)) continue;
    if (!isStepKeyedTarget(entry.target, stepIds)) continue;
    for (const step of stepIds) {
      const value = entry.target[step];
      if (typeof value === "string" && value.startsWith("#/")) used.add(name);
      if (
        Array.isArray(value) &&
        value.some((pointer) => typeof pointer === "string" && pointer.startsWith("#/"))
      ) {
        used.add(name);
      }
    }
  }
  return used;
}

function compositeResidualFields(
  fields: Record<string, unknown>,
  stepIds: string[]
): Record<string, unknown> {
  const used = compositeStepPointers(fields, stepIds);
  const out: Record<string, unknown> = {};
  for (const [name, entry] of Object.entries(fields)) {
    if (used.has(name)) continue;
    if (
      isPlainObject(entry) &&
      isPlainObject(entry.target) &&
      isStepKeyedTarget(entry.target, stepIds)
    ) {
      out[name] = entry.kind === "TODO" ? entry : { ...entry, kind: "unmappable", target: null };
    } else {
      out[name] = entry;
    }
  }
  return out;
}

function compositeTrees(
  fields: Record<string, unknown>,
  variant: string,
  variantLabels: string[],
  composite: Record<string, unknown>[],
  routeTargets: Record<string, string[]>,
  context: RenderContext
): Tree[] {
  const trees: Tree[] = [];
  for (const step of composite) {
    const stepName = asStringOr(step.step, "?");
    const stepFields = compositeFields(fields, variant, stepName);
    const declared = compositeTargetForVariant(step, variant);
    const children = targetFields(stepFields, declared, routeTargets, context);
    if (isPlainObject(step.const)) {
      const isVariantMap = Object.keys(step.const).some((key) => variantLabels.includes(key));
      const value = isVariantMap ? step.const[variant] : step.const;
      if (value !== undefined)
        children.push({ label: `const: ${JSON.stringify(value)}`, children: [] });
    }
    trees.push({ label: stepName, children });
  }
  return trees;
}

function variantWhenLabel(rawVariant: unknown): string {
  if (!isPlainObject(rawVariant) || !Array.isArray(rawVariant.when)) return "";
  const values = rawVariant.when.map((value) => String(value)).join(", ");
  return values ? ` [${values}]` : "";
}

export function renderMappingReport(input: MappingReportInput): string {
  const status = asStringOr(input.mapping.status, "?");
  const derivedCoverage = input.sourceSchema
    ? deriveMappingCoverage(input.mapping, input.sourceSchema)
    : null;
  const coverage = derivedCoverage?.overall
    ? formatCoverage(derivedCoverage.overall)
    : asStringOr(input.mapping.coverage, "?");
  const target = asStringOr(input.frontmatter.target_standard, "?");

  // Polymorphic mappings (route_by_property + variants) carry no top-level fields.
  // Render the effective mapping target-first: route family → target object →
  // source fields. The YAML remains shared/variant-oriented; this is the
  // reader-facing projection of that same data.
  const rawVariants = input.mapping.variants;
  if (isPlainObject(rawVariants)) {
    const rbp = input.mapping.route_by_property;
    const routeByPropertyLabel = (route: Record<string, unknown>): string => {
      if (typeof route.on_property === "string") {
        return `route_by_property: ${route.on_property} (self)`;
      }
      const lookupBy = route.lookup_by;
      if (isPlainObject(lookupBy)) {
        const key = asStringOr(lookupBy.key, "?");
        const through = lookupBy.through;
        const property = isPlainObject(through) ? asStringOr(through.on_property, "?") : "?";
        return `route_by_property: ${property} (lookup by ${key})`;
      }
      return "route_by_property: ?";
    };
    const routing = isPlainObject(rbp) ? routeByPropertyLabel(rbp) : "variants";
    const coverageMap = derivedCoverage?.variants
      ? Object.fromEntries(
          Object.entries(derivedCoverage.variants).map(([label, slice]) => [
            label,
            formatCoverage(slice),
          ])
        )
      : isPlainObject(input.mapping.coverage)
      ? input.mapping.coverage
      : {};

    const variantLabels = Object.keys(rawVariants);

    // variant label → its primary target object names, so routed_to edges can
    // name the actual Carta destination without repeating full JSON pointers.
    const variantTargets: Record<string, string[]> = {};
    for (const [label, rawV] of Object.entries(rawVariants)) {
      const pts =
        isPlainObject(rawV) && Array.isArray(rawV.primary_targets) ? rawV.primary_targets : [];
      variantTargets[label] = pts
        .filter((p): p is string => typeof p === "string")
        .map((pointer) => targetObjectName(pointer));
    }

    // Project shared target maps into each variant before rendering. This is the
    // same effective field set the validator uses for coverage, but organized by
    // target object instead of by the YAML's shared/variants declaration shape.
    const composite = Array.isArray(input.mapping.composite) ? input.mapping.composite : [];
    const compositeSteps = composite.filter(isPlainObject);
    const stepIds = compositeStepIds(input.mapping);
    const effective = new Map<string, Record<string, unknown>>();
    for (const label of variantLabels) {
      effective.set(label, effectiveVariantFields(input.mapping, label, stepIds));
    }
    const common = commonFields(input.mapping, variantLabels, effective, stepIds.length > 0);
    const commonCount = Object.keys(common).length;

    const roots: Tree[] = [{ label: routing, children: [] }];
    for (const [label, rawV] of Object.entries(rawVariants)) {
      const v = isPlainObject(rawV) ? rawV : {};
      const fields = effective.get(label) ?? {};
      const visibleFields = Object.fromEntries(
        Object.entries(fields).filter(([field]) => !(field in common))
      );
      const coverageLabel = asStringOr(coverageMap[label], "?");
      const when = variantWhenLabel(v);
      let children: Tree[];
      if (stepIds.length > 0) {
        const compositeChildren = compositeTrees(
          visibleFields,
          label,
          variantLabels,
          compositeSteps,
          variantTargets,
          {
            sourceSchema: input.sourceSchema,
            mappingDocuments: input.mappingDocuments,
          }
        );
        const residualFields = compositeResidualFields(visibleFields, stepIds);
        const residualTrees = targetFields(residualFields, [], variantTargets, {
          sourceSchema: input.sourceSchema,
          mappingDocuments: input.mappingDocuments,
        });
        children = [
          {
            label: `composite (${compositeSteps.length} step${
              compositeSteps.length === 1 ? "" : "s"
            }, all emitted)`,
            children: compositeChildren,
          },
        ];
        if (residualTrees.length > 0) {
          children.push({ label: "other mappings", children: residualTrees });
        }
      } else {
        const primaryTargets = Array.isArray(v.primary_targets)
          ? v.primary_targets.filter((p): p is string => typeof p === "string")
          : [];
        children = targetFields(visibleFields, primaryTargets, variantTargets, {
          sourceSchema: input.sourceSchema,
          mappingDocuments: input.mappingDocuments,
        });
      }
      roots.push({
        label: `${label}${when} (${coverageLabel}${
          commonCount > 0 ? `; +${commonCount} shared` : ""
        })`,
        children,
      });
    }
    if (commonCount > 0) {
      roots.push({
        label: `shared across all variants (${commonCount}; shown once)`,
        children: targetFields(common, [], variantTargets, {
          sourceSchema: input.sourceSchema,
          mappingDocuments: input.mappingDocuments,
        }),
      });
    }
    return [`${input.file}  ${status} polymorphic → ${target}`, ...renderTree(roots)].join("\n");
  }

  const header = `${input.file}  ${status} ${coverage} → ${target}`;

  const rawFields = input.mapping.fields;
  const fields = isPlainObject(rawFields) ? rawFields : {};

  const items: Item[] = [];
  let todoCount = 0;
  for (const [name, entry] of Object.entries(fields)) {
    if (isPlainObject(entry) && entry.kind === "TODO") {
      todoCount++;
      continue;
    }
    items.push(
      renderItem(name, entry, undefined, [], {
        sourceSchema: input.sourceSchema,
        mappingDocuments: input.mappingDocuments,
      })
    );
  }

  // All-TODO (or some TODOs and no concrete items): collapse to a header suffix.
  if (items.length === 0) {
    if (todoCount === 0) return header;
    const noun = todoCount === 1 ? "field" : "fields";
    return `${header} (${todoCount} ${noun} TODO)`;
  }

  const lines = [header];
  const topLevel: Item[] = [...items];
  if (todoCount > 0) {
    const noun = todoCount === 1 ? "field" : "fields";
    topLevel.push({ label: `${todoCount} ${noun} TODO`, children: [] });
  }

  lines.push(...renderTree(topLevel.map(itemToTree)));

  return lines.join("\n");
}
