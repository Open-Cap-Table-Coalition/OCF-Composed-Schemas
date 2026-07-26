import { Corpus, MappingEdge } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage, InverseCoverageLedger } from "../scripts/lib/inverse-coverage.js";
import { renderMappingInverseReport } from "../scripts/lib/mapping-inverse-report.js";
import type { RawSchema } from "../scripts/lib/registry.js";

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
  variant = "—",
  kind = "rename"
): MappingEdge {
  return {
    rel: file,
    sourceKind: "type",
    source,
    variant,
    field,
    scope: "type",
    target,
    kind,
  };
}

function objectFieldEdge(
  file: string,
  source: string,
  field: string,
  target: string,
  variant = "—",
  kind = "rename"
): MappingEdge {
  return {
    rel: file,
    sourceKind: "object",
    source,
    variant,
    field,
    scope: "object",
    target,
    kind,
  };
}

function structuralEdge(
  file: string,
  source: string,
  target: string,
  variant = "—",
  detail = "contains → Child"
): MappingEdge {
  return {
    rel: file,
    sourceKind: "object",
    source,
    variant,
    scope: "structural",
    target,
    kind: "structural",
    detail,
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
    expect(out).toContain("[type] types/SAFE.mapping.md :: discount (rename)");
    expect(out).toContain("[type] types/Note.mapping.md :: conversion_discount (rename)");
    expect(out).toContain("priceCap");
    expect(out).toContain("✗ no mapped OCF source");
  });

  it("renders inverse semantics without changing forward slot evidence", () => {
    const edge = objectFieldEdge(
      "objects/StockPlan.mapping.md",
      "StockPlan",
      "initial_shares_reserved",
      "#/$defs/OptionPoolSummary/properties/authorizedShares"
    );
    edge.inverseRole = "state-projection";
    edge.inverseNote = "Current summary state; no adjustment history.";
    const inverse = ledger({ OptionPoolSummary: { properties: { authorizedShares: {} } } }, [edge]);

    const out = renderMappingInverseReport({
      inverse,
      targetObject: "OptionPoolSummary",
    });

    expect(out).toContain("initial_shares_reserved (rename; inverse: state-projection)");
    expect(out).toContain(
      "inverse semantics: state-projection — Current summary state; no adjustment history."
    );
    expect(out).toContain("status: MAPPED");
  });

  it("uses ledger variants without duplicating the same source edge", () => {
    const inverse = ledger(
      {
        ConvertibleNote: {
          properties: { discountPercentage: {}, priceCap: {} },
        },
      },
      [
        objectFieldEdge(
          "objects/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "Note"
        ),
        objectFieldEdge(
          "objects/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "Safe"
        ),
        objectFieldEdge(
          "objects/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "cap",
          "#/$defs/ConvertibleNote/properties/priceCap",
          "Note"
        ),
        fieldEdge(
          "types/NoteConversionMechanism.mapping.md",
          "NoteConversionMechanism",
          "conversion_valuation_cap",
          "#/$defs/ConvertibleNote/properties/priceCap"
        ),
      ]
    );

    const out = renderMappingInverseReport({ inverse, targetObject: "ConvertibleNote" });

    expect(out).toContain(
      "[object] objects/ConvertibleIssuance.mapping.md :: discount [shared] (rename)"
    );
    expect(out).toContain("[object] objects/ConvertibleIssuance.mapping.md :: cap [Note] (rename)");
    expect(out).toContain("source path(s)");
    expect(out.match(/:: discount \[shared\] \(rename\)/g)).toHaveLength(1);
  });

  it("renders mutually exclusive target subtype projections while retaining shared flows", () => {
    const inverse = ledger(
      {
        ShareClass: {
          properties: { name: {}, type: {}, issuerId: {} },
        },
      },
      [
        objectFieldEdge(
          "objects/StockClass.mapping.md",
          "StockClass",
          "name",
          "#/$defs/ShareClass/properties/name",
          "Common"
        ),
        objectFieldEdge(
          "objects/StockClass.mapping.md",
          "StockClass",
          "name",
          "#/$defs/ShareClass/properties/name",
          "Preferred"
        ),
        objectFieldEdge(
          "objects/StockClass.mapping.md",
          "StockClass",
          "class_type",
          "#/$defs/ShareClass/properties/type",
          "Common",
          "computed"
        ),
        objectFieldEdge(
          "objects/StockClass.mapping.md",
          "StockClass",
          "class_type",
          "#/$defs/ShareClass/properties/type",
          "Preferred",
          "computed"
        ),
      ]
    );

    const out = renderMappingInverseReport({
      inverse,
      targetObject: "ShareClass",
      mappingDocuments: new Map([
        [
          "objects/StockClass.mapping.md",
          {
            mapping: {
              route_by_property: { on_property: "class_type" },
              variants: {
                Common: {
                  when: ["COMMON"],
                  primary_targets: ["#/$defs/ShareClass"],
                },
                Preferred: {
                  when: ["PREFERRED"],
                  primary_targets: ["#/$defs/ShareClass"],
                },
              },
            },
          },
        ],
      ]),
    });

    expect(out).toContain("resulting Carta object flavors (2)");
    expect(out).toContain("StockClass.Common → ShareClass");
    expect(out).toContain("when: StockClass.class_type = [COMMON]");
    expect(out).toContain("properties: name, type");
    expect(out).toContain("StockClass.Preferred → ShareClass");
    expect(out).toContain("when: StockClass.class_type = [PREFERRED]");
    expect(out).not.toContain("conditional property flows");
    expect(
      out.match(/\[object\] objects\/StockClass\.mapping\.md :: name \[shared\]/g)
    ).toHaveLength(1);
  });

  it("renders Carta child variants as explicit OCF-to-target flows", () => {
    const inverse = ledger(
      {
        TransactionItem: {
          type: "object",
          properties: {
            securityId: { type: "string" },
            issuance: { $ref: "#/$defs/IssuanceTransaction" },
            cancellations: {
              type: "array",
              items: { $ref: "#/$defs/CancellationTransaction" },
            },
          },
        },
        IssuanceTransaction: {
          type: "object",
          properties: { date: { type: "string" } },
        },
        CancellationTransaction: {
          type: "object",
          properties: { date: { type: "string" } },
        },
      },
      [
        structuralEdge(
          "objects/SharedSource.mapping.md",
          "SharedSource",
          "#/$defs/TransactionItem/properties/issuance",
          "Issue",
          "contains → IssuanceTransaction"
        ),
        structuralEdge(
          "objects/SharedSource.mapping.md",
          "SharedSource",
          "#/$defs/TransactionItem/properties/cancellations",
          "Cancel",
          "contains items → CancellationTransaction"
        ),
        structuralEdge(
          "objects/OtherCancellation.mapping.md",
          "OtherCancellation",
          "#/$defs/TransactionItem/properties/cancellations",
          "—",
          "contains items → CancellationTransaction"
        ),
        objectFieldEdge(
          "objects/SharedSource.mapping.md",
          "SharedSource",
          "date",
          "#/$defs/IssuanceTransaction/properties/date",
          "Issue"
        ),
        objectFieldEdge(
          "objects/SharedSource.mapping.md",
          "SharedSource",
          "date",
          "#/$defs/CancellationTransaction/properties/date",
          "Cancel"
        ),
        objectFieldEdge(
          "objects/OtherCancellation.mapping.md",
          "OtherCancellation",
          "date",
          "#/$defs/CancellationTransaction/properties/date"
        ),
        objectFieldEdge(
          "objects/SharedSource.mapping.md",
          "SharedSource",
          "security_id",
          "#/$defs/TransactionItem/properties/securityId",
          "Issue"
        ),
        objectFieldEdge(
          "objects/SharedSource.mapping.md",
          "SharedSource",
          "security_id",
          "#/$defs/TransactionItem/properties/securityId",
          "Cancel"
        ),
        objectFieldEdge(
          "objects/OtherCancellation.mapping.md",
          "OtherCancellation",
          "security_id",
          "#/$defs/TransactionItem/properties/securityId"
        ),
        objectFieldEdge(
          "objects/ParentOnly.mapping.md",
          "ParentOnly",
          "security_id",
          "#/$defs/TransactionItem/properties/securityId"
        ),
      ]
    );

    const out = renderMappingInverseReport({
      inverse,
      targetObject: "TransactionItem",
      mappingDocuments: new Map([
        [
          "objects/SharedSource.mapping.md",
          {
            mapping: {
              route_by_property: { on_property: "kind" },
              variants: {
                Issue: { when: ["ISSUE"] },
                Cancel: { when: ["CANCEL"] },
              },
            },
          },
        ],
        ["objects/OtherCancellation.mapping.md", { mapping: {} }],
      ]),
    });

    expect(out).toContain("<!-- mapping-flow:start -->");
    expect(out).toContain("## Related object property flows (1 groups)");
    expect(out).toContain("### TransactionItem");
    expect(out).toContain("#### cancellations[] → CancellationTransaction");
    expect(out).toContain("#### issuance → IssuanceTransaction");
    expect(out).toContain("| OCF route | OCF property | → | Carta property |");
    expect(out).toContain("SharedSource [Issue]");
    expect(out).toContain("SharedSource [Cancel]");
    expect(out).toContain("OtherCancellation");
    expect(out).toContain("TransactionItem.cancellations[].date");
    expect(out).toContain("TransactionItem.issuance.date");
    expect(out).toContain("TransactionItem.securityId");
    expect(out).toContain("<!-- mapping-flow:end -->");
    const flowStart = out.indexOf("<!-- mapping-flow:start -->");
    const flowEnd = out.indexOf("<!-- mapping-flow:end -->");
    const flowBlock = out.slice(flowStart, flowEnd);
    expect(flowBlock.match(/SharedSource \[(Issue|Cancel)\]/g)).toHaveLength(4);
    expect(flowBlock).not.toContain("ParentOnly");
    expect(out).not.toContain("```mermaid");
  });

  it("keeps independent route axes separate instead of forming Cartesian subtype combinations", () => {
    const inverse = ledger(
      {
        Certificate: {
          properties: { issueDate: {}, shareClassName: {}, securityId: {} },
        },
      },
      [
        objectFieldEdge(
          "objects/transactions/issuance/StockIssuance.mapping.md",
          "StockIssuance",
          "date",
          "#/$defs/Certificate/properties/issueDate"
        ),
        objectFieldEdge(
          "objects/StockClass.mapping.md",
          "StockClass",
          "name",
          "#/$defs/Certificate/properties/shareClassName",
          "Common"
        ),
        objectFieldEdge(
          "objects/StockClass.mapping.md",
          "StockClass",
          "name",
          "#/$defs/Certificate/properties/shareClassName",
          "Preferred"
        ),
        objectFieldEdge(
          "objects/transactions/exercise/EquityCompensationExercise.mapping.md",
          "EquityCompensationExercise",
          "security_id",
          "#/$defs/Certificate/properties/securityId",
          "Option"
        ),
        objectFieldEdge(
          "objects/transactions/exercise/EquityCompensationExercise.mapping.md",
          "EquityCompensationExercise",
          "security_id",
          "#/$defs/Certificate/properties/securityId",
          "Sar"
        ),
      ]
    );

    const out = renderMappingInverseReport({
      inverse,
      targetObject: "Certificate",
      mappingDocuments: new Map([
        [
          "objects/StockClass.mapping.md",
          {
            mapping: {
              route_by_property: { on_property: "class_type" },
              variants: {
                Common: { when: ["COMMON"] },
                Preferred: { when: ["PREFERRED"] },
              },
            },
          },
        ],
        [
          "objects/transactions/exercise/EquityCompensationExercise.mapping.md",
          {
            mapping: {
              route_by_property: {
                lookup_by: {
                  key: "security_id",
                  through: { on_property: "compensation_type" },
                },
              },
              variants: {
                Option: { when: ["OPTION"] },
                Sar: { when: ["CSAR"] },
              },
            },
          },
        ],
      ]),
    });

    expect(out).toContain("conditional property flows (2 discriminators)");
    expect(out).toContain("StockClass :: class_type");
    expect(out).toContain("EquityCompensationExercise :: security_id → compensation_type (lookup)");
    expect(out).toContain("Common [COMMON] or Preferred [PREFERRED] → shareClassName");
    expect(out).toContain("Option [OPTION] or Sar [CSAR] → securityId");
    expect(out.match(/:: date \(rename\)/g)).toHaveLength(1);
    expect(out.match(/:: name \[shared\] \(rename\)/g)).toHaveLength(1);
    expect(out.match(/:: security_id \[shared\] \(rename\)/g)).toHaveLength(1);
  });

  it("renders the outer and inner discriminator chain for nested convertible mechanisms", () => {
    const inverse = ledger(
      {
        ConvertibleNote: {
          properties: { discountPercentage: {} },
        },
      },
      [
        objectFieldEdge(
          "objects/transactions/issuance/ConvertibleIssuance.mapping.md",
          "ConvertibleIssuance",
          "conversion_triggers",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "—",
          "sequential_transform"
        ),
        fieldEdge(
          "types/conversion_rights/ConvertibleConversionRight.mapping.md",
          "ConvertibleConversionRight",
          "conversion_mechanism",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "—",
          "union-map"
        ),
        fieldEdge(
          "types/conversion_mechanisms/NoteConversionMechanism.mapping.md",
          "NoteConversionMechanism",
          "conversion_discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "—",
          "rename"
        ),
        fieldEdge(
          "types/conversion_mechanisms/SAFEConversionMechanism.mapping.md",
          "SAFEConversionMechanism",
          "conversion_discount",
          "#/$defs/ConvertibleNote/properties/discountPercentage",
          "—",
          "rename"
        ),
      ]
    );
    const out = renderMappingInverseReport({
      inverse,
      targetObject: "ConvertibleNote",
      mappingDocuments: new Map<
        string,
        { mapping?: Record<string, unknown>; sourceSchema?: RawSchema }
      >([
        [
          "objects/transactions/issuance/ConvertibleIssuance.mapping.md",
          {
            mapping: {
              fields: {
                conversion_triggers: {
                  kind: "sequential_transform",
                  steps: [
                    {
                      kind: "select",
                      source: "/conversion_right",
                      where: { path: "/type", equals: "CONVERTIBLE_CONVERSION_RIGHT" },
                    },
                    {
                      kind: "apply_mapping",
                      mapping: "types/conversion_rights/ConvertibleConversionRight.mapping.md",
                    },
                  ],
                },
              },
            },
          },
        ],
        [
          "types/conversion_rights/ConvertibleConversionRight.mapping.md",
          {
            sourceSchema: {
              properties: {
                type: { const: "CONVERTIBLE_CONVERSION_RIGHT" },
                conversion_mechanism: {
                  oneOf: [
                    {
                      $ref: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json",
                    },
                    {
                      $ref: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json",
                    },
                  ],
                },
              },
            },
          },
        ],
        [
          "types/conversion_mechanisms/SAFEConversionMechanism.mapping.md",
          {
            sourceSchema: {
              $id: "https://example.test/SAFEConversionMechanism.schema.json",
              properties: { type: { const: "SAFE_CONVERSION" } },
            },
          },
        ],
        [
          "types/conversion_mechanisms/NoteConversionMechanism.mapping.md",
          {
            sourceSchema: {
              $id: "https://example.test/NoteConversionMechanism.schema.json",
              properties: { type: { const: "CONVERTIBLE_NOTE_CONVERSION" } },
            },
          },
        ],
      ]),
    });

    expect(out).toContain(
      "selects ConvertibleConversionRight where conversion_right.type = CONVERTIBLE_CONVERSION_RIGHT"
    );
    expect(out).toContain("active when type = CONVERTIBLE_CONVERSION_RIGHT");
    expect(out).toContain(
      "[type] types/conversion_rights/ConvertibleConversionRight.mapping.md :: conversion_mechanism (union-map)"
    );
    expect(out).toContain(
      "dispatches exactly one conversion_mechanism.type branch (mutually exclusive)"
    );
    expect(out).toContain(
      "[type] types/conversion_mechanisms/SAFEConversionMechanism.mapping.md :: conversion_discount (rename)"
    );
    expect(out).toContain(
      "[type] types/conversion_mechanisms/NoteConversionMechanism.mapping.md :: conversion_discount (rename)"
    );
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
