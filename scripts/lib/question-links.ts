import path from "node:path";

export const REPOSITORY_URL = "https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas";
export const ISSUE_TEMPLATE = "mapping-question.yml";
export const QUESTION_LINKS_START = "<!-- mapping-question-links:start -->";
export const QUESTION_LINKS_END = "<!-- mapping-question-links:end -->";

function mappingFileUrl(mappingRelPath: string): string {
  const normalizedPath = mappingRelPath.replaceAll("\\", "/");
  return `${REPOSITORY_URL}/blob/main/${normalizedPath}`;
}

function issueUrl(mappingRelPath: string, property: string | null): string {
  const normalizedPath = mappingRelPath.replaceAll("\\", "/");
  const mappingName = path.posix.basename(normalizedPath, ".mapping.md");
  const params = new URLSearchParams({
    template: ISSUE_TEMPLATE,
    mapping_file: normalizedPath,
    source_url: mappingFileUrl(normalizedPath),
    title: `[Mapping question] ${mappingName}${property ? `: ${property}` : ""}`,
  });
  if (property !== null) params.set("property_path", property);
  return `${REPOSITORY_URL}/issues/new?${params.toString()}`;
}

function tableCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

/** Render the generated per-property issue links for one mapping document. */
export function renderQuestionLinks(mappingRelPath: string, properties: readonly string[]): string {
  const rows = properties.map(
    (property) =>
      `| \`${tableCell(property)}\` | [💬 Ask a question](${issueUrl(mappingRelPath, property)}) |`
  );
  const mappingLevel = `| _(mapping-level)_ | [💬 Ask a question](${issueUrl(
    mappingRelPath,
    null
  )}) |`;
  return [
    "## Ask a mapping question",
    "",
    "Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.",
    "",
    "<details>",
    "<summary>Open a prefilled issue for a property</summary>",
    "",
    QUESTION_LINKS_START,
    "| Source property | Action |",
    "| --- | --- |",
    mappingLevel,
    ...rows,
    "</details>",
    QUESTION_LINKS_END,
    "",
  ].join("\n");
}

/** Replace only the generated block, or insert it immediately before the notes section. */
export function upsertQuestionLinks(markdown: string, generatedBlock: string): string {
  const start = markdown.indexOf(QUESTION_LINKS_START);
  const endMarkerIndex = markdown.indexOf(QUESTION_LINKS_END);
  if (start !== -1 || endMarkerIndex !== -1) {
    if (start === -1 || endMarkerIndex === -1 || endMarkerIndex < start) {
      throw new Error("mapping question link markers are incomplete or out of order");
    }
    const end = endMarkerIndex + QUESTION_LINKS_END.length;
    const blockStart = markdown.lastIndexOf("## Ask a mapping question", start);
    if (blockStart === -1) throw new Error("mapping question link start marker has no heading");
    const blockEnd = markdown.indexOf("\n", end);
    return (
      markdown.slice(0, blockStart) +
      generatedBlock.trimEnd() +
      (blockEnd === -1 ? "" : markdown.slice(blockEnd))
    );
  }

  const notesHeading = markdown.indexOf("## Notes / open questions");
  if (notesHeading === -1) {
    throw new Error('mapping document has no "## Notes / open questions" heading');
  }
  return markdown.slice(0, notesHeading) + generatedBlock + "\n" + markdown.slice(notesHeading);
}
