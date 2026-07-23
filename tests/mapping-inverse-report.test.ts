import { MappingReportDocument } from "../scripts/lib/mapping-report.js";
import { renderMappingInverseReport } from "../scripts/lib/mapping-inverse-report.js";

function document(mapping: Record<string, unknown>, file: string): [string, MappingReportDocument] {
  return [
    file,
    {
      frontmatter: { target_standard: "Carta" },
      mapping,
    },
  ];
}

describe("renderMappingInverseReport", () => {
  it("aggregates source fields into target properties and shows unmapped target properties", () => {
    const out = renderMappingInverseReport({
      documents: new Map([
        document(
          {
            fields: {
              discount: {
                kind: "rename",
                target: "#/$defs/ConvertibleNote/properties/discountPercentage",
              },
            },
          },
          "types/SAFE.mapping.md"
        ),
        document(
          {
            fields: {
              conversion_discount: {
                kind: "rename",
                target: "#/$defs/ConvertibleNote/properties/discountPercentage",
              },
            },
          },
          "types/Note.mapping.md"
        ),
      ]),
      targetBundle: {
        $defs: {
          ConvertibleNote: {
            properties: {
              discountPercentage: {},
              priceCap: {},
            },
          },
        },
      },
      targetObject: "ConvertibleNote",
    });

    expect(out).toContain("Carta inverse mapping report (2 source documents)");
    expect(out).toContain("types/SAFE.mapping.md :: discount (rename)");
    expect(out).toContain("types/Note.mapping.md :: conversion_discount (rename)");
    expect(out).toContain("priceCap");
    expect(out).toContain("✗ no mapped OCF source");
  });

  it("projects shared and variant target maps without duplicating shared flows", () => {
    const out = renderMappingInverseReport({
      documents: new Map([
        document(
          {
            variants: {
              Note: {
                when: ["NOTE"],
                fields: {
                  cap: { kind: "rename", target: "#/$defs/ConvertibleNote/properties/priceCap" },
                },
              },
              Safe: { when: ["SAFE"], fields: {} },
            },
            shared: {
              discount: {
                kind: "rename",
                target: "#/$defs/ConvertibleNote/properties/discountPercentage",
              },
            },
          },
          "objects/ConvertibleIssuance.mapping.md"
        ),
      ]),
      targetObject: "ConvertibleNote",
    });

    expect(out).toContain("objects/ConvertibleIssuance.mapping.md :: discount [shared] (rename)");
    expect(out).toContain("objects/ConvertibleIssuance.mapping.md :: cap [Note] (rename)");
    expect(out).not.toContain("discount [Note]");
    expect(out).not.toContain("discount [Safe]");
  });

  it("includes object definitions with no incoming mappings", () => {
    const out = renderMappingInverseReport({
      documents: new Map(),
      targetBundle: {
        $defs: {
          EmptyObject: { type: "object", properties: {} },
          EmptyWithProperties: { type: "object", properties: { id: {} } },
        },
      },
    });

    expect(out).toContain("EmptyObject [NO MAPPINGS]");
    expect(out).toContain("EmptyWithProperties [NO MAPPINGS]");
    expect(out).toContain("EmptyWithProperties");
    expect(out).toContain("✗ no mapped OCF source");
  });
});
