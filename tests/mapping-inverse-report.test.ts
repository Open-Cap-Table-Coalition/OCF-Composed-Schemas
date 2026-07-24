import { Corpus, MappingEdge } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage, InverseCoverageLedger } from "../scripts/lib/inverse-coverage.js";
import { renderMappingInverseReport } from "../scripts/lib/mapping-inverse-report.js";

function ledger(
  defs: Record<string, Record<string, unknown>>,
  edges: MappingEdge[]
): InverseCoverageLedger {
  const corpus = {
    bundle: { $defs: defs },
    coveragePolicy: { cartaDefs: new Map() },
    mappingEdges: edges,
    objects: [],
  } as unknown as Corpus;
  return buildInverseCoverage(corpus);
}

function fieldEdge(
  file: string,
  source: string,
  field: string,
  target: string,
  variant = "—"
): MappingEdge {
  return {
    rel: file,
    sourceKind: "type",
    source,
    variant,
    field,
    scope: "type",
    target,
    kind: "rename",
  };
}

describe("renderMappingInverseReport", () => {
  it("renders ledger edges into target properties and shows unmapped target properties", () => {
    const inverse = ledger(
      {
        ConvertibleNote: {
          properties: { discountPercentage: {}, priceCap: {} },
        },
      },
      [
        fieldEdge(
          "types/SAFE.mapping.md",
          "SAFE",
          "discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage"
        ),
        fieldEdge(
          "types/Note.mapping.md",
          "Note",
          "conversion_discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage"
        ),
      ]
    );

    const out = renderMappingInverseReport({
      inverse,
      sourceDocuments: 2,
      targetObject: "ConvertibleNote",
    });

    expect(out).toContain("source_documents: 2");
    expect(out).toContain("mapped_object_defs: 1");
    expect(out).toContain("Accounting check: 1 + 0 + 0 = 1");
    expect(out).toContain('id: "#/$defs/ConvertibleNote"');
    expect(out).toContain("types/SAFE.mapping.md :: discount (rename)");
    expect(out).toContain("types/Note.mapping.md :: conversion_discount (rename)");
    expect(out).toContain("priceCap");
    expect(out).toContain("✗ no mapped OCF source");
  });

  it("uses ledger variants without duplicating the same source edge", () => {
    const inverse = ledger(
      {
        ConvertibleNote: {
          properties: { discountPercentage: {}, priceCap: {} },
        },
      },
      [
        fieldEdge(
          "objects/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "Note"
        ),
        fieldEdge(
          "objects/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "Safe"
        ),
        fieldEdge(
          "objects/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "cap",
          "#/$defs/ConvertibleNote/properties/priceCap",
          "Note"
        ),
      ]
    );

    const out = renderMappingInverseReport({ inverse, targetObject: "ConvertibleNote" });

    expect(out).toContain("objects/ConvertibleIssuance.mapping.md :: discount [shared] (rename)");
    expect(out).toContain("objects/ConvertibleIssuance.mapping.md :: cap [Note] (rename)");
    expect(out.match(/:: discount \[shared\] \(rename\)/g)).toHaveLength(1);
  });

  it("includes only object-like definitions requiring role follow-up", () => {
    const inverse = ledger(
      {
        EmptyObject: { type: "object", properties: { id: {}, kind: {} } },
        EmptyWithProperties: { type: "object", properties: { id: {} } },
      },
      []
    );

    const out = renderMappingInverseReport({ inverse });

    expect(out).toContain("Carta definitions requiring role follow-up (2)");
    expect(out).toContain("CARTA objects/types intentionally excluded");
    expect(out).toContain("name: EmptyObject");
    expect(out).toContain("name: EmptyWithProperties");
    expect(out).toContain("status: NO MAPPINGS");
    expect(out).not.toContain("Carta objects with no mappings");
    expect(out).not.toContain("✗ no mapped OCF source");
  });
});
