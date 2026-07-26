import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import {
  buildInverseCoverage,
  groupInverseExcludedRoleRows,
  inverseCoverageStory,
} from "../scripts/lib/inverse-coverage.js";

describe("Carta inverse coverage", () => {
  it("keeps slot evidence and definition roles in separate dimensions", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    const inverse = buildInverseCoverage(corpus);

    expect(inverse.metrics).toMatchObject({
      totalDefs: 139,
      objectDefs: 86,
      definitionRoleCounts: {
        direct: 18,
        "type-only": 1,
        deferred: 0,
        "nested-obj": 53,
        "value-type": 1,
        "report-rollup": 8,
        alternate: 2,
        "vendor-family": 1,
        "workflow-gap": 1,
        gap: 1,
        review: 0,
      },
      directSlots: 225,
      typeOnlyDefs: 6,
      typeOnlyOnlyDefs: 1,
      typeOnlySlots: 28,
      implicitSlots: 1,
      deferredSlots: 0,
      structuralSlots: 28,
      nestedObjDefs: 53,
      reportRollupDefs: 8,
      curatedValueTypeEntries: 7,
      valueTypeDefs: 1,
      alternateDefs: 2,
      actionableGapDefs: 3,
      reviewDefs: 0,
    });

    const byDef = new Map(inverse.defs.map((row) => [row.name, row]));
    expect(byDef.get("Date")?.status).toBe("value-type");
    expect(byDef.get("Vesting")?.status).toBe("alternate");
    expect(byDef.get("DividendDetails")?.status).toBe("nested-obj");
    expect(byDef.get("CertificateIssuanceTransaction")?.status).toBe("nested-obj");
    expect(byDef.get("Interest")?.status).toBe("vendor-family");
    expect(byDef.get("OptionPoolSummary")?.status).toBe("report-rollup");
    expect(
      inverse.slots.find(
        (slot) => slot.def === "OptionPoolSummary" && slot.property === "authorizedShares"
      )?.inverseRoles
    ).toEqual(["state-projection"]);
    expect(
      inverse.slots.find(
        (slot) => slot.def === "OptionGrant" && slot.property === "returnedToPoolQuantity"
      )?.inverseRoles
    ).toEqual(["aggregate-projection"]);
    expect(byDef.get("ThresholdDetails")?.status).toBe("nested-obj");
    expect(byDef.get("OptionGrantDocuments")?.status).toBe("gap");
    expect(byDef.get("WarrantTransactionItem")).toMatchObject({
      status: "direct",
      directSlots: ["securityId", "securityLabel", "stakeholderId"],
      structuralSlots: ["cancellations", "exercises", "issuance", "transfers"],
      emptySlots: [],
    });
    for (const [name, directSlots, structuralSlots] of [
      [
        "CertificateTransactionItem",
        ["securityId", "securityLabel", "stakeholderId"],
        ["cancellations", "issuance"],
      ],
      [
        "ConvertibleTransactionItem",
        ["securityId", "securityLabel", "stakeholderId"],
        ["cancellations", "issuance"],
      ],
      [
        "OptionTransactionItem",
        ["securityId", "securityLabel", "stakeholderId"],
        ["cancellations", "exercises", "issuance"],
      ],
      [
        "RsaTransactionItem",
        ["securityId", "securityLabel", "stakeholderId"],
        ["cancellations", "issuance"],
      ],
      [
        "RsuTransactionItem",
        ["securityId", "securityLabel", "stakeholderId"],
        ["cancellations", "issuance", "settlements"],
      ],
      [
        "SarTransactionItem",
        ["securityId", "securityLabel", "stakeholderId"],
        ["cancellations", "exercises", "issuance"],
      ],
    ] as const) {
      expect(byDef.get(name)).toMatchObject({
        status: "direct",
        directSlots,
        structuralSlots,
        emptySlots: [],
      });
    }
    const transferSlot = inverse.slots.find(
      (slot) => slot.def === "WarrantTransactionItem" && slot.property === "transfers"
    );
    expect(transferSlot).toMatchObject({
      status: "structural",
      structuralEdges: [
        expect.objectContaining({
          source: "WarrantTransfer",
          scope: "structural",
          detail: "items → WarrantTransferTransaction",
        }),
      ],
    });
    expect(corpus.coveragePolicy.cartaDefs.get("Iso8601CompleteCalendarDateTime")).toMatchObject({
      role: "value-type",
    });

    const excluded = inverse.excludedRoleRows;
    expect(excluded).toHaveLength(60);
    const excludedGroups = groupInverseExcludedRoleRows(excluded);
    expect(excludedGroups.valueTypes).toHaveLength(7);
    expect(excludedGroups.nestedWithMappedParent).toHaveLength(38);
    expect(excludedGroups.nestedWithoutMappedParent).toHaveLength(15);
    expect(excluded.find((row) => row.name === "Date")).toMatchObject({ role: "value-type" });
    expect(excluded.find((row) => row.name === "VestingSchedule")).toMatchObject({
      role: "nested-obj",
      coveredThrough: "OptionGrant, RestrictedStockAward, RestrictedStockUnit",
    });
    expect(excluded.find((row) => row.name === "ThresholdDetails")).toMatchObject({
      role: "nested-obj",
      coveredThrough: "Interest",
    });

    expect(inverseCoverageStory(inverse)).toEqual({
      totalDefs: 139,
      nonObjectDefs: 53,
      scalarEnumDefs: 47,
      otherNonObjectDefs: 0,
      objectDefs: 86,
      standaloneCandidateDefs: 32,
      mappedDefs: 19,
      fullyMappedDefs: 8,
      partiallyMappedDefs: 11,
      unmappedCandidateDefs: 13,
      nonEntityDefs: 60,
      nonEntityObjectDefs: 54,
      scalarValueTypeDefs: 6,
    });
  });

  it("recovers source-side complex types through composed-schema refs", async () => {
    const inverse = buildInverseCoverage(await loadGreenCorpus(process.cwd()));
    const pairs = new Set(
      inverse.typeCorrespondences.map((row) => `${row.sourceType} → ${row.targetType}`)
    );

    expect([...pairs]).toEqual(
      expect.arrayContaining([
        "Address → StakeholderAddress",
        "ContactInfo → PointOfContact",
        "Date → Iso8601CompleteCalendarDate",
        "Date → Iso8601CompleteCalendarDateTime",
        "Monetary → Money",
      ])
    );
  });
});
