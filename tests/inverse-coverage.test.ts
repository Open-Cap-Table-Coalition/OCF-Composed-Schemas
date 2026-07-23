import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage } from "../scripts/lib/inverse-coverage.js";

describe("Carta inverse coverage", () => {
  it("keeps slot evidence and definition roles in separate dimensions", async () => {
    const inverse = buildInverseCoverage(await loadGreenCorpus(process.cwd()));

    expect(inverse.metrics).toMatchObject({
      totalDefs: 139,
      objectDefs: 86,
      directSlots: 146,
      typeOnlyDefs: 7,
      typeOnlyOnlyDefs: 6,
      typeOnlySlots: 34,
      implicitSlots: 3,
      deferredSlots: 4,
      nestedCoveredDefs: 9,
      reportRollupDefs: 17,
      actionableGapDefs: 11,
      reviewDefs: 0,
    });

    const byDef = new Map(inverse.defs.map((row) => [row.name, row]));
    expect(byDef.get("Date")?.status).toBe("alternate");
    expect(byDef.get("Vesting")?.status).toBe("alternate");
    expect(byDef.get("DividendDetails")?.status).toBe("nested-covered");
    expect(byDef.get("OptionGrantDocuments")?.status).toBe("gap");
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
