import { RawSchema } from "./registry.js";
import { deriveMappingCoverage, formatCoverage } from "./mapping-coverage.js";

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
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asStringOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
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
  stepIds: string[] = []
): Item {
  if (!isPlainObject(entry)) {
    return { label: `${name} ⚠ malformed entry`, children: [] };
  }
  const kind = entry.kind;
  const target = entry.target;

  let item: Item;
  switch (kind) {
    case "rename":
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
      item = !Array.isArray(target)
        ? { label: `${name} → ? (split)`, children: [] }
        : { label: `${name} (split)`, children: target.map((el) => asStringOr(el, "?")) };
      break;

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

function fieldTrees(
  fields: unknown,
  routeTargets?: Record<string, string[]>,
  stepIds: string[] = []
): Tree[] {
  return isPlainObject(fields)
    ? Object.entries(fields).map(([name, entry]) =>
        itemToTree(renderItem(name, entry, routeTargets, stepIds))
      )
    : [];
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

  // Polymorphic mappings (discriminator / route_by_security + variants) carry no
  // top-level fields; render the routing plus each variant's per-field routes
  // (shared fields shown once).
  const rawVariants = input.mapping.variants;
  if (isPlainObject(rawVariants)) {
    const disc = input.mapping.discriminator;
    const rbs = input.mapping.route_by_security;
    const routing = isPlainObject(disc)
      ? `discriminator: ${asStringOr(disc.field, "?")}`
      : isPlainObject(rbs)
      ? `route_by_security: ${asStringOr(rbs.via, "?")} → ${asStringOr(rbs.resolve, "?")}`
      : "variants";
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

    // variant label → its primary_targets, so routed_to edges can name the
    // actual Carta destination ("routed to Rsu variant: RsuIssuanceTransaction").
    const variantTargets: Record<string, string[]> = {};
    for (const [label, rawV] of Object.entries(rawVariants)) {
      const pts =
        isPlainObject(rawV) && Array.isArray(rawV.primary_targets) ? rawV.primary_targets : [];
      variantTargets[label] = pts.filter((p): p is string => typeof p === "string");
    }

    // composite: a transaction folding into an ordered SET of Carta transactions
    // (all emitted). Render the steps and the Carta object each lands on, and key
    // the shared/variant per-step field maps off the step ids.
    const composite = Array.isArray(input.mapping.composite) ? input.mapping.composite : [];
    const stepIds = composite
      .filter(isPlainObject)
      .map((s) => s.step)
      .filter((x): x is string => typeof x === "string");

    const roots: Tree[] = [{ label: routing, children: [] }];
    if (composite.length > 0) {
      roots.push({
        label: `composite (${composite.length} step${
          composite.length === 1 ? "" : "s"
        }, all emitted)`,
        children: composite.filter(isPlainObject).map((s) => {
          const tgt = s.target;
          const targetLines = isPlainObject(tgt)
            ? Object.entries(tgt).map(([fam, ptr]) => `${fam} → ${asStringOr(ptr, "?")}`)
            : [`→ ${asStringOr(tgt, "?")}`];
          if (isPlainObject(s.const)) targetLines.push(`const: ${JSON.stringify(s.const)}`);
          return {
            label: asStringOr(s.step, "?"),
            children: targetLines.map((l) => ({ label: l, children: [] })),
          };
        }),
      });
    }
    const shared = input.mapping.shared;
    if (isPlainObject(shared) && Object.keys(shared).length > 0) {
      roots.push({
        label: `shared (${Object.keys(shared).length})`,
        children: fieldTrees(shared, variantTargets, stepIds),
      });
    }
    for (const [label, rawV] of Object.entries(rawVariants)) {
      const v = isPlainObject(rawV) ? rawV : {};
      const targets = Array.isArray(v.primary_targets)
        ? ` → ${(v.primary_targets as unknown[]).map((p) => asStringOr(p, "?")).join(", ")}`
        : "";
      roots.push({
        label: `${label} (${asStringOr(coverageMap[label], "?")})${targets}`,
        children: fieldTrees(v.fields, variantTargets, stepIds),
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
    items.push(renderItem(name, entry));
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
