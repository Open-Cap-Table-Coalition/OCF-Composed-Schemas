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
