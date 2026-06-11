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

function renderItem(name: string, entry: unknown): Item {
  if (!isPlainObject(entry)) {
    return { label: `${name} ⚠ malformed entry`, children: [] };
  }
  const kind = entry.kind;
  const target = entry.target;

  switch (kind) {
    case "rename":
    case "computed":
    case "combine":
      return { label: `${name} → ${asStringOr(target, "?")} (${kind})`, children: [] };

    case "split": {
      if (!Array.isArray(target)) {
        return { label: `${name} → ? (split)`, children: [] };
      }
      return {
        label: `${name} (split)`,
        children: target.map((el) => asStringOr(el, "?")),
      };
    }

    case "enum-remap": {
      const label = `${name} → ${asStringOr(target, "?")} (enum-remap)`;
      const values = entry.values;
      if (!isPlainObject(values)) {
        return { label, children: [] };
      }
      const children = Object.entries(values).map(([key, value]) =>
        value === null ? `${key} ✗ dropped` : `${key} → ${String(value)}`
      );
      return { label, children };
    }

    case "unmappable": {
      const reason = entry.reason;
      return {
        label:
          typeof reason === "string" ? `${name} ✗ unmappable: ${reason}` : `${name} ✗ unmappable`,
        children: [],
      };
    }

    default:
      return { label: `${name} ⚠ kind: ${String(kind)}`, children: [] };
  }
}

export function renderMappingReport(input: MappingReportInput): string {
  const status = asStringOr(input.mapping.status, "?");
  const coverage = asStringOr(input.mapping.coverage, "?");
  const target = asStringOr(input.frontmatter.target_standard, "?");
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
