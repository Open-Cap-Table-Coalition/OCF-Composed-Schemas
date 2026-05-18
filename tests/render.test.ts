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
    const out = renderMappingBlock({ kind_field: { enum: ["A", "B", "C"] } }, EMPTY_REGISTRY);
    expect(out).toContain("    kind: TODO          # likely enum-remap");
    expect(out).toContain("    values:");
    expect(out).toContain("      A: TODO");
    expect(out).toContain("      B: TODO");
    expect(out).toContain("      C: TODO");
  });

  it("expands const into a single-key values map", () => {
    const out = renderMappingBlock({ object_type: { const: "TX_FOO" } }, EMPTY_REGISTRY);
    expect(out).toContain("      TX_FOO: TODO");
  });

  it("expands $ref to an enum schema via the registry", () => {
    const reg: Registry = new Map([["test://e", { $id: "test://e", enum: ["P", "Q"] }]]);
    const out = renderMappingBlock({ kind_field: { $ref: "test://e" } }, reg);
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
    const out = renderMappingBlock({ price: { $ref: "test://monetary" } }, reg);
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

import { renderMappingMarkdown } from "../scripts/lib/render.js";

const SAMPLE_SCHEMA = {
  $id: "https://example/StockIssuance.schema.json",
  title: "Object - Stock Issuance Transaction",
  description: "Object describing a stock issuance transaction.",
  type: "object",
  properties: {
    id: { type: "string" },
    object_type: { const: "TX_STOCK_ISSUANCE" },
    quantity: { type: "string" },
  },
  required: ["id", "object_type"],
};

describe("renderMappingMarkdown", () => {
  it("assembles frontmatter, heading, description, schema block, mapping, and notes", () => {
    const out = renderMappingMarkdown({
      schema: SAMPLE_SCHEMA,
      schemaRelPath: "objects/transactions/issuance/StockIssuance.schema.json",
      registry: new Map([["x", { $id: "x" }]]),
      generatedDate: "2026-05-18",
    });

    expect(out).toMatch(/^---\nocf_schema_id: https:\/\/example\/StockIssuance\.schema\.json/);
    expect(out).toContain("ocf_object_type: TX_STOCK_ISSUANCE");
    expect(out).toContain("ocf_kind: object");
    expect(out).toContain("# Object - Stock Issuance Transaction → TBD");
    expect(out).toContain("> Object describing a stock issuance transaction.");
    expect(out).toContain("## OCF schema");
    expect(out).toContain("Source: [`StockIssuance.schema.json`](./StockIssuance.schema.json)");
    expect(out).toContain("<details>");
    expect(out).toContain("<summary>Composed schema (click to expand)</summary>");
    expect(out).toContain('"$id": "https://example/StockIssuance.schema.json"');
    expect(out).toContain("</details>");
    expect(out).toContain("## Mapping");
    expect(out).toContain("coverage: 0/3");
    expect(out).toContain("      TX_STOCK_ISSUANCE: TODO");
    expect(out).toContain("## Notes / open questions");
    expect(out.endsWith("- \n")).toBe(true);
  });

  it("substitutes a fallback when description is missing", () => {
    const out = renderMappingMarkdown({
      schema: { $id: "x", title: "Plain", properties: {} },
      schemaRelPath: "types/Plain.schema.json",
      registry: new Map(),
      generatedDate: "2026-05-18",
    });
    expect(out).toContain("> _(no description in source schema)_");
    expect(out).toContain("ocf_kind: type");
    expect(out).toContain("coverage: 0/0");
    expect(out).toMatch(/fields:\s*\n```/);
  });

  it("determines ocf_kind from path prefix", () => {
    const objMd = renderMappingMarkdown({
      schema: { $id: "x", title: "A", properties: {} },
      schemaRelPath: "objects/A.schema.json",
      registry: new Map(),
      generatedDate: "2026-05-18",
    });
    const typeMd = renderMappingMarkdown({
      schema: { $id: "y", title: "B", properties: {} },
      schemaRelPath: "types/B.schema.json",
      registry: new Map(),
      generatedDate: "2026-05-18",
    });
    expect(objMd).toContain("ocf_kind: object");
    expect(typeMd).toContain("ocf_kind: type");
  });
});
