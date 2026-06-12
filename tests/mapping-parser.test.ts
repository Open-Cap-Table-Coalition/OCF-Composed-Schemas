import { parseMappingDocument, MappingParseError } from "../scripts/lib/mapping-parser.js";

function doc(parts: { frontmatter?: string; mappingSection?: string }): string {
  const fm = parts.frontmatter ?? "ocf_title: Foo\nstatus: draft";
  const mapping =
    parts.mappingSection ??
    [
      "```yaml",
      "status: draft",
      "coverage: 0/1",
      "",
      "fields:",
      "  id:",
      "    kind: TODO",
      "    target: TODO",
      "```",
    ].join("\n");
  return [
    "---",
    fm,
    "---",
    "",
    "# Foo → TBD",
    "",
    "## Mapping",
    "",
    mapping,
    "",
    "## Notes / open questions",
    "",
    "- ",
    "",
  ].join("\n");
}

describe("parseMappingDocument", () => {
  it("parses frontmatter and the mapping block into objects", () => {
    const parsed = parseMappingDocument(doc({}), "objects/Foo.mapping.md");
    expect(parsed.frontmatter.ocf_title).toBe("Foo");
    expect(parsed.mapping.coverage).toBe("0/1");
    const fields = parsed.mapping.fields as Record<string, { kind: string }>;
    expect(fields.id?.kind).toBe("TODO");
  });

  it("parses a multi-line transform block scalar", () => {
    const mappingSection = [
      "```yaml",
      "status: draft",
      "coverage: 1/1",
      "",
      "fields:",
      "  id:",
      "    kind: computed",
      '    target: "#/$defs/Foo/properties/id"',
      "    transform: |",
      "      first line",
      "      second line",
      "```",
    ].join("\n");
    const parsed = parseMappingDocument(doc({ mappingSection }), "objects/Foo.mapping.md");
    const fields = parsed.mapping.fields as Record<string, { transform: string }>;
    expect(fields.id?.transform).toBe("first line\nsecond line\n");
  });

  it("ignores yaml fences outside the ## Mapping section", () => {
    const full = [
      "---",
      "ocf_title: Foo",
      "---",
      "",
      "## OCF schema",
      "",
      "```json",
      "{}",
      "```",
      "",
      "## Mapping",
      "",
      "```yaml",
      "status: draft",
      "coverage: 0/0",
      "",
      "fields:",
      "```",
      "",
      "## Notes / open questions",
      "",
      "```yaml",
      "not: relevant",
      "```",
      "",
    ].join("\n");
    const parsed = parseMappingDocument(full, "objects/Foo.mapping.md");
    expect(parsed.mapping.status).toBe("draft");
    expect(parsed.mapping.not).toBeUndefined();
  });

  it("throws when the file does not start with frontmatter", () => {
    expect(() => parseMappingDocument("# No frontmatter\n", "x.mapping.md")).toThrow(
      MappingParseError
    );
    expect(() => parseMappingDocument("# No frontmatter\n", "x.mapping.md")).toThrow(
      /x\.mapping\.md/
    );
  });

  it("throws when frontmatter is unterminated", () => {
    expect(() => parseMappingDocument("---\nocf_title: Foo\n", "x.mapping.md")).toThrow(
      /not terminated/
    );
  });

  it("throws when there is no ## Mapping heading", () => {
    const full = ["---", "ocf_title: Foo", "---", "", "# Foo", ""].join("\n");
    expect(() => parseMappingDocument(full, "x.mapping.md")).toThrow(/## Mapping/);
  });

  it("throws when the ## Mapping section has no yaml fence", () => {
    const full = ["---", "ocf_title: Foo", "---", "", "## Mapping", "", "prose only", ""].join(
      "\n"
    );
    expect(() => parseMappingDocument(full, "x.mapping.md")).toThrow(/exactly one/);
  });

  it("throws when the ## Mapping section has two yaml fences", () => {
    const mappingSection = [
      "```yaml",
      "status: draft",
      "```",
      "",
      "```yaml",
      "again: true",
      "```",
    ].join("\n");
    expect(() => parseMappingDocument(doc({ mappingSection }), "x.mapping.md")).toThrow(
      /exactly one/
    );
  });

  it("throws on an unterminated yaml fence", () => {
    const full = [
      "---",
      "ocf_title: Foo",
      "---",
      "",
      "## Mapping",
      "",
      "```yaml",
      "status: draft",
      "",
    ].join("\n");
    expect(() => parseMappingDocument(full, "x.mapping.md")).toThrow(/unterminated/);
  });

  it("throws on YAML syntax errors with file context", () => {
    const mappingSection = ["```yaml", "status: [unclosed", "```"].join("\n");
    expect(() => parseMappingDocument(doc({ mappingSection }), "objects/Foo.mapping.md")).toThrow(
      /objects\/Foo\.mapping\.md: mapping block/
    );
  });

  it("throws on duplicate keys in the mapping block", () => {
    const mappingSection = ["```yaml", "status: draft", "status: complete", "```"].join("\n");
    expect(() => parseMappingDocument(doc({ mappingSection }), "x.mapping.md")).toThrow(
      MappingParseError
    );
  });

  it("throws when the mapping block is not a map at the top level", () => {
    const mappingSection = ["```yaml", "- just", "- a list", "```"].join("\n");
    expect(() => parseMappingDocument(doc({ mappingSection }), "x.mapping.md")).toThrow(/YAML map/);
  });
});
