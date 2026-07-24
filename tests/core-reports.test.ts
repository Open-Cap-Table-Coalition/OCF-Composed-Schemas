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

  it("explains inverse coverage as a plain-language standalone-target story", async () => {
    const report = renderGapReport(await deriveCore(process.cwd()));
    expect(report).toContain("### CARTA inverse coverage: the simple story");
    expect(report).toContain("4. That leaves **32** standalone mapping candidates.");
    expect(report).toContain(
      "7. We have mapping evidence for **15**: **0** fully mapped and **15** partially mapped (**14** direct executable, **1** type-only, **0** deferred)."
    );
    expect(report).toContain(
      "8. **17** standalone candidates have no mapping evidence yet; their inventory role tells us whether that is expected or actionable (**12** report/read-model roll-ups, **2** alternate shapes, **1** CARTA-specific families without OCF sources, **1** workflow/data gaps, **1** actionable gaps, **0** requiring review)."
    );
    expect(report).toContain("### Technical slot diagnostics");
    expect(report).not.toContain("| mapping evidence detail | count |");
    expect(report).not.toContain("### Unmapped standalone candidates by inventory role");
    expect(report).toContain(
      "### Supporting CARTA definitions excluded from standalone mapping targets (60)"
    );
    expect(report).not.toContain("### CARTA object-definition coverage story");
  });
});
