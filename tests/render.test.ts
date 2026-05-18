import { renderFrontmatter } from "../scripts/lib/render.js";

describe("renderFrontmatter", () => {
  it("includes $id, title, kind, generated date", () => {
    const out = renderFrontmatter({
      $id: "https://example/Foo.schema.json",
      objectType: null,
      title: "Foo",
      kind: "type",
      requiredFields: [],
      generatedDate: "2026-05-18",
    });
    expect(out).toBe(
      [
        "---",
        "ocf_schema_id: https://example/Foo.schema.json",
        "ocf_object_type: null",
        "ocf_title: Foo",
        "ocf_kind: type",
        "required_fields: []",
        "target_standard: TBD",
        "target_version: TBD",
        "status: draft",
        "last_generated: 2026-05-18",
        "---",
      ].join("\n")
    );
  });

  it("renders ocf_object_type when const is set", () => {
    const out = renderFrontmatter({
      $id: "x",
      objectType: "TX_STOCK_ISSUANCE",
      title: "Stock Issuance",
      kind: "object",
      requiredFields: ["id", "object_type"],
      generatedDate: "2026-05-18",
    });
    expect(out).toContain("ocf_object_type: TX_STOCK_ISSUANCE");
    expect(out).toContain("required_fields:\n  - id\n  - object_type");
  });

  it("quotes titles containing YAML-special characters", () => {
    const out = renderFrontmatter({
      $id: "x",
      objectType: null,
      title: "Object: with colon",
      kind: "object",
      requiredFields: [],
      generatedDate: "2026-05-18",
    });
    expect(out).toContain('ocf_title: "Object: with colon"');
  });
});
