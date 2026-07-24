import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage, inverseCoverageStory } from "../scripts/lib/inverse-coverage.js";

describe("Carta inverse coverage", () => {
  it("keeps slot evidence and definition roles in separate dimensions", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    const inverse = buildInverseCoverage(corpus);

    expect(inverse.metrics).toMatchObject({
      totalDefs: 139,
      objectDefs: 86,
      definitionRoleCounts: {
        direct: 14,
        "type-only": 1,
        deferred: 0,
        "nested-obj": 53,
        "value-type": 1,
        "report-rollup": 12,
        alternate: 2,
        "vendor-family": 1,
        "workflow-gap": 1,
        gap: 1,
        review: 0,
      },
      directSlots: 146,
      typeOnlyDefs: 7,
      typeOnlyOnlyDefs: 1,
      typeOnlySlots: 34,
      implicitSlots: 3,
      deferredSlots: 4,
      nestedObjDefs: 53,
      reportRollupDefs: 12,
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
    expect(byDef.get("ThresholdDetails")?.status).toBe("nested-obj");
    expect(byDef.get("OptionGrantDocuments")?.status).toBe("gap");
    expect(corpus.coveragePolicy.cartaDefs.get("Iso8601CompleteCalendarDateTime")).toMatchObject({
      role: "value-type",
    });

    const excluded = inverse.excludedRoleRows;
    expect(excluded).toHaveLength(60);
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
      objectDefs: 86,
      standaloneCandidateDefs: 32,
      mappedDefs: 15,
      fullyMappedDefs: 0,
      partiallyMappedDefs: 15,
      unmappedCandidateDefs: 17,
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
