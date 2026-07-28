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
      totalDefs: 99,
      objectDefs: 55,
      definitionRoleCounts: {
        direct: 15,
        deferred: 0,
        "nested-obj": 39,
        "value-type": 0,
        "report-rollup": 0,
        alternate: 0,
        "vendor-family": 0,
        "workflow-gap": 1,
        gap: 0,
        review: 0,
      },
      directSlots: 205,
      typeOnlyDefs: 7,
      typeOnlyOnlyDefs: 7,
      typeOnlySlots: 29,
      implicitSlots: 1,
      deferredSlots: 0,
      structuralSlots: 25,
      nestedObjDefs: 39,
      reportRollupDefs: 0,
      curatedValueTypeEntries: 6,
      valueTypeDefs: 0,
      alternateDefs: 0,
      actionableGapDefs: 1,
      reviewDefs: 0,
    });

    const byDef = new Map(inverse.defs.map((row) => [row.name, row]));
    expect(byDef.has("Date")).toBe(false);
    expect(byDef.get("PointOfContact")).toMatchObject({
      status: "nested-obj",
      nestedNamespace: "ocf",
      typeOnlySlots: ["userEmail", "userFullName"],
    });
    expect(byDef.get("DividendDetails")?.status).toBe("nested-obj");
    expect(byDef.get("CertificateIssuanceTransaction")?.status).toBe("nested-obj");
    expect(
      inverse.slots.find(
        (slot) => slot.def === "OptionGrant" && slot.property === "returnedToPoolQuantity"
      )?.inverseRoles
    ).toEqual(["aggregate-projection"]);
    expect(byDef.get("OptionExercise")?.status).toBe("workflow-gap");
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
    expect(excluded).toHaveLength(45);
    const excludedGroups = groupInverseExcludedRoleRows(excluded);
    expect(excludedGroups.valueTypes).toHaveLength(6);
    expect(excludedGroups.nestedWithMappedParent).toHaveLength(35);
    expect(excludedGroups.nestedWithoutMappedParent).toHaveLength(4);
    expect(excluded.find((row) => row.name === "VestingSchedule")).toMatchObject({
      role: "nested-obj",
      coveredThrough: "OptionGrant, RestrictedStockAward, RestrictedStockUnit",
    });
    expect(excluded.find((row) => row.name === "PointOfContact")).toMatchObject({
      role: "nested-obj",
      nestedNamespace: "ocf",
      reason: "Nested OCF type; type mapping evidence is not a standalone Carta target.",
    });

    expect(inverseCoverageStory(inverse)).toEqual({
      totalDefs: 99,
      nonObjectDefs: 44,
      scalarEnumDefs: 38,
      otherNonObjectDefs: 0,
      objectDefs: 55,
      standaloneCandidateDefs: 16,
      mappedDefs: 15,
      fullyMappedDefs: 6,
      partiallyMappedDefs: 9,
      unmappedCandidateDefs: 1,
      nonEntityDefs: 45,
      nonEntityObjectDefs: 39,
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
