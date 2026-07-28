import {
  cartaSchemaIssueUrl,
  renderQuestionLinks,
  upsertQuestionLinks,
} from "../scripts/lib/question-links.js";

describe("mapping question links", () => {
  it("renders prefilled issue links for mapping-level and source properties", () => {
    const markdown = renderQuestionLinks("objects/Foo.mapping.md", ["name", "security_id"]);
    const link = markdown.match(/\| `name` \| \[💬 Ask a question\]\(([^)]+)\)/u)?.[1];
    expect(link).toBeDefined();
    const url = new URL(link as string);

    expect(url.pathname).toBe("/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new");
    expect(url.searchParams.get("template")).toBe("mapping-question.yml");
    expect(url.searchParams.get("mapping_file")).toBe("objects/Foo.mapping.md");
    expect(url.searchParams.get("source_url")).toContain("/blob/main/objects/Foo.mapping.md");
    expect(url.searchParams.get("title")).toBe("[Mapping question] Foo: name");
    expect(markdown).toContain("property_path=name");
    expect(markdown).toContain("property_path=security_id");
    expect(markdown).toContain("_(mapping-level)_");
  });

  it("inserts and then replaces only the generated block", () => {
    const original = [
      "# Foo",
      "",
      "## Mapping",
      "",
      "```yaml",
      "fields: {}",
      "```",
      "",
      "## Notes / open questions",
      "",
      "- Existing human-authored note",
      "",
    ].join("\n");
    const first = upsertQuestionLinks(
      original,
      renderQuestionLinks("objects/Foo.mapping.md", ["name"])
    );
    const second = upsertQuestionLinks(
      first,
      renderQuestionLinks("objects/Foo.mapping.md", ["name", "security_id"])
    );

    expect(second.match(/## Ask a mapping question/g)).toHaveLength(1);
    expect(second).toContain("property_path=security_id");
    expect(second).toContain("- Existing human-authored note");
  });

  it("renders a schema-level issue link with tracked context", () => {
    const url = new URL(
      cartaSchemaIssueUrl("target-schema/Carta.schema.json", {
        title: "Carta Cap Table Data Schema",
        version: "v1alpha1 (2026-04-30)",
        sha256: "abc123",
      })
    );

    expect(url.pathname).toBe("/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new");
    expect(url.searchParams.get("title")).toBe("[Carta schema] Carta Cap Table Data Schema");
    expect(url.searchParams.get("body")).toContain("target-schema/Carta.schema.json");
    expect(url.searchParams.get("body")).toContain("v1alpha1 (2026-04-30)");
    expect(url.searchParams.get("body")).toContain("SHA-256: abc123");
  });
});
