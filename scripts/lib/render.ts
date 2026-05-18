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

import { detectEnumValues } from "./enum-detection.js";
import { Registry } from "./registry.js";

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
