import { renderFrontmatter } from "../scripts/lib/render.js";
import { renderMappingBlock } from "../scripts/lib/render.js";
import { Registry } from "../scripts/lib/registry.js";

const EMPTY_REGISTRY: Registry = new Map();

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

describe("renderMappingBlock", () => {
  it("emits one entry per property in source order, no enums", () => {
    const out = renderMappingBlock(
      { id: { type: "string" }, comments: { type: "array", items: { type: "string" } } },
      EMPTY_REGISTRY
    );
    expect(out).toBe(
      [
        "```yaml",
        "# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO",
        "status: draft",
        "coverage: 0/2",
        "",
        "fields:",
        "  id:",
        "    kind: TODO",
        "    target: TODO",
        "  comments:",
        "    kind: TODO",
        "    target: TODO",
        "```",
      ].join("\n")
    );
  });

  it("expands inline enum values into a values: map", () => {
    const out = renderMappingBlock(
      { kind_field: { enum: ["A", "B", "C"] } },
      EMPTY_REGISTRY
    );
    expect(out).toContain("    kind: TODO          # likely enum-remap");
    expect(out).toContain("    values:");
    expect(out).toContain("      A: TODO");
    expect(out).toContain("      B: TODO");
    expect(out).toContain("      C: TODO");
  });

  it("expands const into a single-key values map", () => {
    const out = renderMappingBlock(
      { object_type: { const: "TX_FOO" } },
      EMPTY_REGISTRY
    );
    expect(out).toContain("      TX_FOO: TODO");
  });

  it("expands $ref to an enum schema via the registry", () => {
    const reg: Registry = new Map([
      ["test://e", { $id: "test://e", enum: ["P", "Q"] }],
    ]);
    const out = renderMappingBlock(
      { kind_field: { $ref: "test://e" } },
      reg
    );
    expect(out).toContain("      P: TODO");
    expect(out).toContain("      Q: TODO");
  });

  it("does NOT expand $ref to a non-enum schema (e.g. Monetary)", () => {
    const reg: Registry = new Map([
      [
        "test://monetary",
        {
          $id: "test://monetary",
          title: "Monetary",
          properties: { amount: { type: "string" }, currency: { type: "string" } },
        },
      ],
    ]);
    const out = renderMappingBlock(
      { price: { $ref: "test://monetary" } },
      reg
    );
    expect(out).toContain("  price:");
    expect(out).not.toContain("    values:");
    expect(out).not.toContain("    amount:");
  });

  it("handles empty properties with a 0/0 coverage line", () => {
    const out = renderMappingBlock({}, EMPTY_REGISTRY);
    expect(out).toContain("coverage: 0/0");
    expect(out).toContain("fields:");
  });
});
