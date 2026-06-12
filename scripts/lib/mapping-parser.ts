import { parse } from "yaml";

export class MappingParseError extends Error {}

export interface ParsedMapping {
  frontmatter: Record<string, unknown>;
  mapping: Record<string, unknown>;
}

/**
 * Extract and YAML-parse a .mapping.md document's frontmatter and the single
 * ```yaml block under its `## Mapping` heading. Throws MappingParseError with
 * the file path in the message on any structural or YAML syntax problem.
 * No semantic validation happens here.
 */
export function parseMappingDocument(markdown: string, filePath: string): ParsedMapping {
  return {
    frontmatter: parseYamlObject(
      extractFrontmatter(markdown, filePath),
      `${filePath}: frontmatter`
    ),
    mapping: parseYamlObject(extractMappingYaml(markdown, filePath), `${filePath}: mapping block`),
  };
}

function extractFrontmatter(markdown: string, filePath: string): string {
  const lines = markdown.split("\n");
  if (lines[0] !== "---") {
    throw new MappingParseError(`${filePath}: file must start with "---" frontmatter`);
  }
  const end = lines.indexOf("---", 1);
  if (end === -1) {
    throw new MappingParseError(`${filePath}: frontmatter is not terminated by "---"`);
  }
  return lines.slice(1, end).join("\n");
}

function extractMappingYaml(markdown: string, filePath: string): string {
  const lines = markdown.split("\n");
  const headingIdx = lines.findIndex((l) => l.trim() === "## Mapping");
  if (headingIdx === -1) {
    throw new MappingParseError(`${filePath}: no "## Mapping" heading found`);
  }
  let sectionEnd = lines.length;
  for (let i = headingIdx + 1; i < lines.length; i++) {
    if ((lines[i] ?? "").startsWith("## ")) {
      sectionEnd = i;
      break;
    }
  }

  const blocks: string[] = [];
  let current: string[] | null = null;
  for (let i = headingIdx + 1; i < sectionEnd; i++) {
    const line = lines[i] ?? "";
    if (current === null && line.trim() === "```yaml") {
      current = [];
      continue;
    }
    if (current !== null && line.trim() === "```") {
      blocks.push(current.join("\n"));
      current = null;
      continue;
    }
    if (current !== null) current.push(line);
  }
  if (current !== null) {
    throw new MappingParseError(
      `${filePath}: unterminated \`\`\`yaml fence in the ## Mapping section`
    );
  }
  if (blocks.length !== 1) {
    throw new MappingParseError(
      `${filePath}: expected exactly one \`\`\`yaml block under ## Mapping, found ${blocks.length}`
    );
  }
  return blocks[0] as string;
}

function parseYamlObject(src: string, context: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    // yaml v2 throws on duplicate keys by default (uniqueKeys: true).
    parsed = parse(src);
  } catch (err) {
    throw new MappingParseError(`${context}: ${(err as Error).message}`);
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new MappingParseError(`${context}: expected a YAML map at the top level`);
  }
  return parsed as Record<string, unknown>;
}
