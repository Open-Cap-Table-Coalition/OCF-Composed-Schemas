import path from "node:path";
import { readFile } from "node:fs/promises";

import { deriveCore } from "../scripts/lib/core-pipeline.js";
import { renderLedger, renderGapReport } from "../scripts/lib/core-reports.js";

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

  it("the ledger surfaces alias wrappers as `alias-of X`, not `no-payload`", async () => {
    const ledger = renderLedger(await deriveCore(process.cwd()));
    expect(ledger).toMatch(/PlanSecurityIssuance .*alias-of EquityCompensationIssuance/);
    // A wrapper row must never be tagged no-payload.
    const psiRow = ledger.split("\n").find((l) => l.includes("| PlanSecurityIssuance |"))!;
    expect(psiRow).toContain("alias-of EquityCompensationIssuance");
    expect(psiRow).not.toContain("no-payload");
  });
});
