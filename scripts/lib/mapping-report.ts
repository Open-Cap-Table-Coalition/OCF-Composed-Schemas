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
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asStringOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

/** A rendered top-level field: a label line plus zero or more child lines. */
interface Item {
  label: string;
  children: string[];
}

function renderItem(name: string, entry: unknown, routeTargets?: Record<string, string[]>): Item {
  if (!isPlainObject(entry)) {
    return { label: `${name} ⚠ malformed entry`, children: [] };
  }
  const kind = entry.kind;
  const target = entry.target;

  let item: Item;
  switch (kind) {
    case "rename":
    case "computed":
    case "combine":
      // A per-variant target map (shared field with a divergent home): render each
      // variant's own target (or ✗ where it has none) instead of one borrowed pointer.
      item = isPlainObject(target)
        ? {
            label: `${name} (${kind} · per variant)`,
            children: Object.entries(target).map(([variant, ptr]) =>
              ptr === null ? `${variant} ✗ unmappable` : `${variant} → ${asStringOr(ptr, "?")}`
            ),
          }
        : { label: `${name} → ${asStringOr(target, "?")} (${kind})`, children: [] };
      break;

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

/** A node in a (possibly nested) ASCII tree. */
interface Tree {
  label: string;
  children: Tree[];
}

/** Lift a flat {label, children: string[]} Item into a Tree. */
function itemToTree(item: Item): Tree {
  return { label: item.label, children: item.children.map((c) => ({ label: c, children: [] })) };
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

function fieldTrees(fields: unknown, routeTargets?: Record<string, string[]>): Tree[] {
  return isPlainObject(fields)
    ? Object.entries(fields).map(([name, entry]) =>
        itemToTree(renderItem(name, entry, routeTargets))
      )
    : [];
}

export function renderMappingReport(input: MappingReportInput): string {
  const status = asStringOr(input.mapping.status, "?");
  const coverage = asStringOr(input.mapping.coverage, "?");
  const target = asStringOr(input.frontmatter.target_standard, "?");

  // Polymorphic mappings (discriminator / route_by_security + variants) carry no
  // top-level fields:/coverage; render the routing plus each variant's per-field
  // routes (shared fields shown once).
  const rawVariants = input.mapping.variants;
  if (isPlainObject(rawVariants)) {
    const disc = input.mapping.discriminator;
    const rbs = input.mapping.route_by_security;
    const routing = isPlainObject(disc)
      ? `discriminator: ${asStringOr(disc.field, "?")}`
      : isPlainObject(rbs)
      ? `route_by_security: ${asStringOr(rbs.via, "?")} → ${asStringOr(rbs.resolve, "?")}`
      : "variants";
    const coverageMap = isPlainObject(input.mapping.coverage) ? input.mapping.coverage : {};

    // variant label → its primary_targets, so routed_to edges can name the
    // actual Carta destination ("routed to Rsu variant: RsuIssuanceTransaction").
    const variantTargets: Record<string, string[]> = {};
    for (const [label, rawV] of Object.entries(rawVariants)) {
      const pts =
        isPlainObject(rawV) && Array.isArray(rawV.primary_targets) ? rawV.primary_targets : [];
      variantTargets[label] = pts.filter((p): p is string => typeof p === "string");
    }

    const roots: Tree[] = [{ label: routing, children: [] }];
    const shared = input.mapping.shared;
    if (isPlainObject(shared) && Object.keys(shared).length > 0) {
      roots.push({
        label: `shared (${Object.keys(shared).length})`,
        children: fieldTrees(shared, variantTargets),
      });
    }
    for (const [label, rawV] of Object.entries(rawVariants)) {
      const v = isPlainObject(rawV) ? rawV : {};
      const targets = Array.isArray(v.primary_targets)
        ? ` → ${(v.primary_targets as unknown[]).map((p) => asStringOr(p, "?")).join(", ")}`
        : "";
      roots.push({
        label: `${label} (${asStringOr(coverageMap[label], "?")})${targets}`,
        children: fieldTrees(v.fields, variantTargets),
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
  const topLevel: Array<Item | { label: string; children: string[] }> = [...items];
  if (todoCount > 0) {
    const noun = todoCount === 1 ? "field" : "fields";
    topLevel.push({ label: `${todoCount} ${noun} TODO`, children: [] });
  }

  topLevel.forEach((item, i) => {
    const isLastTop = i === topLevel.length - 1;
    lines.push(`${isLastTop ? "└── " : "├── "}${item.label}`);
    const childPrefix = isLastTop ? "    " : "│   ";
    item.children.forEach((child, j) => {
      const isLastChild = j === item.children.length - 1;
      lines.push(`${childPrefix}${isLastChild ? "└── " : "├── "}${child}`);
    });
  });

  return lines.join("\n");
}
