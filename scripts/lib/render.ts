import path from "node:path";
import { detectEnumValues } from "./enum-detection.js";
import { RawSchema, Registry } from "./registry.js";

export interface FrontmatterInput {
  $id: string;
  objectType: string | null;
  title: string;
  kind: "object" | "type";
  requiredFields: string[];
  generatedDate: string;
}

export function renderFrontmatter(input: FrontmatterInput): string {
  const lines: string[] = ["---"];
  lines.push(`ocf_schema_id: ${input.$id}`);
  lines.push(`ocf_object_type: ${input.objectType ?? "null"}`);
  lines.push(`ocf_title: ${yamlScalar(input.title)}`);
  lines.push(`ocf_kind: ${input.kind}`);
  if (input.requiredFields.length === 0) {
    lines.push("required_fields: []");
  } else {
    lines.push("required_fields:");
    for (const f of input.requiredFields) lines.push(`  - ${f}`);
  }
  lines.push("target_standard: TBD");
  lines.push("target_version: TBD");
  lines.push("status: draft");
  lines.push(`last_generated: ${input.generatedDate}`);
  lines.push("---");
  return lines.join("\n");
}

function yamlScalar(s: string): string {
  if (/[:#\[\]{}&*!|>'"%@`,]/.test(s) || s.startsWith(" ") || s.endsWith(" ")) {
    return JSON.stringify(s);
  }
  return s;
}

const KIND_VOCAB =
  "# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO";

export function renderMappingBlock(
  properties: Record<string, unknown>,
  registry: Registry
): string {
  const propertyNames = Object.keys(properties);
  const lines: string[] = ["```yaml", KIND_VOCAB, "status: draft"];
  lines.push(`coverage: 0/${propertyNames.length}`);
  lines.push("");
  lines.push("fields:");

  for (const name of propertyNames) {
    const prop = properties[name];
    const enumValues = detectEnumValues(prop, registry);
    lines.push(`  ${name}:`);
    if (enumValues) {
      lines.push("    kind: TODO          # likely enum-remap");
    } else {
      lines.push("    kind: TODO");
    }
    lines.push("    target: TODO");
    if (enumValues) {
      lines.push("    values:");
      for (const v of enumValues) lines.push(`      ${v}: TODO`);
    }
  }

  lines.push("```");
  return lines.join("\n");
}

export interface RenderInput {
  schema: RawSchema;
  schemaRelPath: string;
  registry: Registry;
  generatedDate: string;
}

const NO_DESCRIPTION = "_(no description in source schema)_";

export function renderMappingMarkdown(input: RenderInput): string {
  const { schema, schemaRelPath, registry, generatedDate } = input;

  const kind: "object" | "type" = schemaRelPath.startsWith("objects/") ? "object" : "type";
  const title = schema.title ?? "Untitled";
  const description = typeof schema.description === "string" ? schema.description : null;
  const objectTypeProp = schema.properties?.object_type;
  const objectType = typeof objectTypeProp?.const === "string" ? objectTypeProp.const : null;
  const required = Array.isArray(schema.required) ? schema.required : [];
  const properties = (schema.properties ?? {}) as Record<string, unknown>;
  const basename = path.basename(schemaRelPath);

  const sections: string[] = [
    renderFrontmatter({
      $id: schema.$id,
      objectType,
      title,
      kind,
      requiredFields: required,
      generatedDate,
    }),
    "",
    `# ${title} → TBD`,
    "",
    `> ${description ?? NO_DESCRIPTION}`,
    "",
    "## OCF schema",
    "",
    `Source: [\`${basename}\`](./${basename})`,
    "",
    "<details>",
    "<summary>Composed schema (click to expand)</summary>",
    "",
    "```json",
    JSON.stringify(schema, null, 2),
    "```",
    "",
    "</details>",
    "",
    "## Mapping",
    "",
    renderMappingBlock(properties, registry),
    "",
    "## Notes / open questions",
    "",
    "- ",
    "",
  ];

  return sections.join("\n");
}
