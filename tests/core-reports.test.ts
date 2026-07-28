import path from "node:path";
import { readFile } from "node:fs/promises";

import { deriveCore } from "../scripts/lib/core-pipeline.js";
import { renderLedger, renderGapReport } from "../scripts/lib/core-reports.js";
import { parsePointer } from "../scripts/lib/report-flow.js";

describe("core reports (the markdown drift gate's premise)", () => {
  it("render deterministically — two runs over the same corpus are byte-identical", async () => {
    const a = await deriveCore(process.cwd());
    const b = await deriveCore(process.cwd());
    expect(renderLedger(a)).toEqual(renderLedger(b));
    expect(renderGapReport(a)).toEqual(renderGapReport(b));
  });

  it("the committed core/*.md match a fresh render (must rebuild after a change)", async () => {
    const d = await deriveCore(process.cwd());
    const reports: Record<string, string> = {
      "core-ledger.md": renderLedger(d),
      "core-gaps.md": renderGapReport(d),
    };
    for (const [name, expected] of Object.entries(reports)) {
      const onDisk = await readFile(path.join(process.cwd(), "core", name), "utf8");
      expect(onDisk).toEqual(expected);
    }
  });

  it("the ledger omits alias wrappers from its output tables and documents the omission", async () => {
    const ledger = renderLedger(await deriveCore(process.cwd()));
    expect(ledger).toContain("Compatibility wrappers (`PlanSecurity*`) are intentionally omitted");
    expect(ledger.split("\n").some((line) => line.startsWith("| PlanSecurity"))).toBe(false);
  });

  it("links to the canonical inverse report instead of duplicating its ledger", async () => {
    const report = renderGapReport(await deriveCore(process.cwd()));
    expect(report).toContain(
      "The canonical target-first inverse report owns the Carta-side object panels"
    );
    expect(report).toContain("The same `renderMappingInverseReport` renderer");
    expect(report).toContain("docs/generated/mapping-explorer/assets/mapping-inverse-report.md");
    expect(report).not.toContain("| Shared inverse-ledger dimension | count |");
  });

  it("uses the inverse-report target-pointer parser for source-side flow tables", () => {
    expect(parsePointer("#/$defs/ShareClass/properties/authorizedShareCount")).toEqual({
      object: "ShareClass",
      prop: "authorizedShareCount",
    });
    expect(parsePointer("#/$defs/ShareClass")).toEqual({
      object: "ShareClass",
      prop: "",
    });
    expect(
      parsePointer("Numeric → —; Numeric → #/$defs/ShareClass/properties/authorizedShareCount")
    ).toEqual({
      object: "ShareClass",
      prop: "authorizedShareCount",
    });
    expect(parsePointer("not-a-target-pointer")).toBeNull();
  });
});
