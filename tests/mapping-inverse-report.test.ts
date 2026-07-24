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

function objectFieldEdge(file: string, source: string, field: string, target: string): MappingEdge {
  return {
    rel: file,
    sourceKind: "object",
    source,
    variant: "—",
    field,
    scope: "object",
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
    expect(out).toContain("Simple story");
    expect(out).toContain("6. 1 standalone candidates have OCF mapping evidence:");
    expect(out).toContain("Completeness: 0 fully mapped, 1 partially mapped.");
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

  it("renders only open questions beneath the related target property", () => {
    const inverse = ledger(
      {
        ConvertibleNote: {
          properties: { discountPercentage: {} },
        },
      },
      [
        fieldEdge(
          "types/SAFE.mapping.md",
          "SAFE",
          "discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage"
        ),
      ]
    );
    const out = renderMappingInverseReport({
      inverse,
      targetObject: "ConvertibleNote",
      mappingDocuments: new Map([
        [
          "types/SAFE.mapping.md",
          {
            questions: [
              {
                property: "discount",
                target: null,
                question: "Should this discount be preserved exactly?",
                askedBy: "@alice",
                answer: "Pending confirmation.",
                answeredBy: null,
                answered: false,
                line: 12,
              },
              {
                property: "discount",
                target: null,
                question: "This answered question must not appear.",
                askedBy: "@alice",
                answer: "Yes.",
                answeredBy: "@bob",
                answered: true,
                line: 18,
              },
            ],
          },
        ],
      ]),
    });

    expect(out).toContain("discountPercentage");
    expect(out).toContain("? open question: Should this discount be preserved exactly?");
    expect(out).toContain("asked by @alice");
    expect(out).not.toContain("This answered question must not appear.");
  });

  it("renders target-bound questions beside unmapped target properties", () => {
    const inverse = ledger(
      {
        Compliance: {
          properties: { countryOfResidency: {}, federalExemption: {} },
        },
      },
      [
        fieldEdge(
          "types/SecurityExemption.mapping.md",
          "SecurityExemption",
          "description",
          "#/$defs/Compliance/properties/federalExemption"
        ),
      ]
    );
    const out = renderMappingInverseReport({
      inverse,
      targetObject: "Compliance",
      mappingDocuments: new Map([
        [
          "objects/Stakeholder.mapping.md",
          {
            questions: [
              {
                property: "addresses[].country",
                target: "Compliance.countryOfResidency",
                question: "Should stakeholder country feed compliance residency?",
                askedBy: "@alice",
                answer: "Pending investigation.",
                answeredBy: null,
                answered: false,
                line: 12,
              },
            ],
          },
        ],
      ]),
    });

    expect(out).toContain("countryOfResidency");
    expect(out).toContain("✗ no mapped OCF source");
    expect(out).toContain("? open question: Should stakeholder country feed compliance residency?");
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

    expect(out).toContain("7. 2 standalone candidates have no mapping evidence yet");
    expect(out).toContain("0 report/read-model roll-ups, 0 alternate shapes");
    expect(out).toContain("Supporting CARTA definitions excluded from standalone mapping targets");
    expect(out).toContain("name: EmptyObject");
    expect(out).toContain("name: EmptyWithProperties");
    expect(out).toContain("status: NO MAPPINGS");
    expect(out).not.toContain("Carta objects with no mappings");
    expect(out).not.toContain("✗ no mapped OCF source");
  });

  it("projects executable child mappings into direct parent container slots", () => {
    const inverse = ledger(
      {
        Parent: {
          type: "object",
          properties: {
            child: { $ref: "#/$defs/Child" },
            children: { type: "array", items: { $ref: "#/$defs/Child" } },
            empty: { type: "string" },
          },
        },
        Child: {
          type: "object",
          properties: { value: { type: "string" }, label: { type: "string" } },
        },
      },
      [
        {
          rel: "objects/Child.mapping.md",
          sourceKind: "object",
          source: "Child",
          variant: "—",
          scope: "object",
          target: "#/$defs/Parent",
        },
        objectFieldEdge(
          "objects/Child.mapping.md",
          "Child",
          "value",
          "#/$defs/Child/properties/value"
        ),
      ]
    );

    const parent = inverse.defs.find((row) => row.name === "Parent");
    expect(parent).toMatchObject({
      status: "direct",
      structuralSlots: ["child", "children"],
      emptySlots: ["empty"],
    });

    const out = renderMappingInverseReport({ inverse, targetObject: "Parent" });
    expect(out).toContain("child");
    expect(out).toContain("(contains → Child) (structural)");
    expect(out).toContain("children");
    expect(out).toContain("(contains items → Child) (structural)");
    expect(out).toContain("empty");
    expect(out).toContain("✗ no mapped OCF source");
  });
});
