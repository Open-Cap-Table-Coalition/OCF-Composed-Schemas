import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage } from "../scripts/lib/inverse-coverage.js";

describe("Carta inverse coverage", () => {
  it("keeps slot evidence and definition roles in separate dimensions", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    const inverse = buildInverseCoverage(corpus);

    expect(inverse.metrics).toMatchObject({
      totalDefs: 139,
      objectDefs: 86,
      definitionRoleCounts: {
        direct: 39,
        "type-only": 6,
        deferred: 0,
        "nested-covered": 9,
        "value-type": 1,
        "report-rollup": 17,
        alternate: 3,
        "vendor-family": 6,
        "workflow-gap": 4,
        gap: 1,
        review: 0,
      },
      directSlots: 146,
      typeOnlyDefs: 7,
      typeOnlyOnlyDefs: 6,
      typeOnlySlots: 34,
      implicitSlots: 3,
      deferredSlots: 4,
      nestedCoveredDefs: 9,
      reportRollupDefs: 17,
      curatedValueTypeEntries: 7,
      valueTypeDefs: 1,
      alternateDefs: 3,
      actionableGapDefs: 11,
      reviewDefs: 0,
    });

    const byDef = new Map(inverse.defs.map((row) => [row.name, row]));
    expect(byDef.get("Date")?.status).toBe("value-type");
    expect(byDef.get("Vesting")?.status).toBe("alternate");
    expect(byDef.get("DividendDetails")?.status).toBe("nested-covered");
    expect(byDef.get("OptionGrantDocuments")?.status).toBe("gap");
    expect(corpus.coveragePolicy.cartaDefs.get("Iso8601CompleteCalendarDateTime")).toMatchObject({
      role: "value-type",
    });

    const excluded = inverse.excludedRoleRows;
    expect(excluded).toHaveLength(16);
    expect(excluded.find((row) => row.name === "Date")).toMatchObject({ role: "value-type" });
    expect(excluded.find((row) => row.name === "VestingSchedule")).toMatchObject({
      role: "nested-covered",
      coveredThrough: "OptionGrant, RestrictedStockAward, RestrictedStockUnit",
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
