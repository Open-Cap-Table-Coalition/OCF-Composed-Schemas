import {
  deriveCore,
  isMember,
  STRICT_PROFILE,
  RICH_PROFILE,
} from "../scripts/lib/core-pipeline.js";
import { renderUpstreamReport } from "../scripts/lib/core-reports.js";
import { Verdict } from "../scripts/lib/core-classifier.js";

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort())
      out[k] = canonical((value as Record<string, unknown>)[k]);
    return out;
  }
  return value;
}
const pkgStr = (p: Map<string, Record<string, unknown>>) =>
  JSON.stringify([...p.entries()].sort().map(([k, v]) => [k, canonical(v)]));

const stakeholderDef = (d: Awaited<ReturnType<typeof deriveCore>>) => {
  const f = d.package.get("files/StakeholdersFile.schema.json") as any;
  return f.properties.items.items.properties as Record<string, unknown>;
};

describe("isMember — the profile-distinguishing predicate", () => {
  const core: Verdict = { class: "core", loss: "direct" };
  const existenceLoss: Verdict = {
    class: "out",
    reason: "existence-loss",
    detail: "structure→scalar",
  };
  const heuristic: Verdict = { class: "out", reason: "heuristic", detail: "kind combine" };
  const noHome: Verdict = { class: "out", reason: "no-destination" };

  it("a `core` field is a member of both profiles", () => {
    expect(isMember(core, STRICT_PROFILE)).toBe(true);
    expect(isMember(core, RICH_PROFILE)).toBe(true);
  });
  it("a lossy-home field is a member of rich only", () => {
    for (const v of [existenceLoss, heuristic]) {
      expect(isMember(v, STRICT_PROFILE)).toBe(false);
      expect(isMember(v, RICH_PROFILE)).toBe(true);
    }
  });
  it("a no-home field is a member of neither", () => {
    expect(isMember(noHome, STRICT_PROFILE)).toBe(false);
    expect(isMember(noHome, RICH_PROFILE)).toBe(false);
  });
});

describe("deriveCore profiles over the real corpus", () => {
  it("the default profile is strict, byte-for-byte", async () => {
    const def = await deriveCore(process.cwd());
    const strict = await deriveCore(process.cwd(), STRICT_PROFILE);
    expect(def.profile.name).toBe("strict");
    expect(pkgStr(def.package)).toEqual(pkgStr(strict.package));
  });

  it("rich is a strict SUPERSET of entities, adding lossy nested mappings", async () => {
    const strict = await deriveCore(process.cwd(), STRICT_PROFILE);
    const rich = await deriveCore(process.cwd(), RICH_PROFILE);
    const se = new Set(strict.entities.map((e) => e.entity));
    const re = new Set(rich.entities.map((e) => e.entity));
    for (const e of se) expect(re.has(e)).toBe(true); // superset — no strict entity lost
    const added = [...re].filter((e) => !se.has(e)).sort();
    expect(added).toEqual([
      "Document",
      "EquityCompensationIssuance",
      "StockClassConversionRatioAdjustment",
      "StockIssuance",
      "VestingTerms",
      "WarrantIssuance",
    ]);
  });

  it("rich Stakeholder carries the personal-info fields strict drops, in OCF's structured shape", async () => {
    const strict = stakeholderDef(await deriveCore(process.cwd(), STRICT_PROFILE));
    const rich = stakeholderDef(await deriveCore(process.cwd(), RICH_PROFILE));

    for (const f of ["name", "addresses", "contact_info", "primary_contact"]) {
      expect(strict[f]).toBeUndefined(); // strict Core has no personal info
      expect(rich[f]).toBeDefined();
    }
    // `name` is OCF's structured Name (not Carta's flat fullName scalar).
    const name = rich.name as any;
    expect(name.type).toBe("object");
    expect(Object.keys(name.properties).sort()).toEqual(["first_name", "last_name", "legal_name"]);
    expect(name.required).toEqual(["legal_name"]);
    // `addresses` stays an array of structured Address (not collapsed to a scalar).
    expect((rich.addresses as any).type).toBe("array");
    expect((rich.addresses as any).items.properties.country).toBeDefined();
  });

  it("every emitted node has unique `required` (draft-07 valid) — dedupe holds", async () => {
    const rich = await deriveCore(process.cwd(), RICH_PROFILE);
    const walk = (n: unknown): void => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (!n || typeof n !== "object") return;
      const o = n as Record<string, unknown>;
      if (Array.isArray(o.required)) {
        expect(new Set(o.required as string[]).size).toBe((o.required as string[]).length);
      }
      Object.values(o).forEach(walk);
    };
    for (const schema of rich.package.values()) walk(schema);
  });
});

describe("upstream-OCF report", () => {
  it("rich groups lossy-home members by object with a flow diagram; strict lists none", async () => {
    const rich = renderUpstreamReport(await deriveCore(process.cwd(), RICH_PROFILE));
    expect(rich).toContain("upstream-OCF change candidates");
    expect(rich).toContain("```mermaid"); // visual flow diagram
    expect(rich).toContain("### Stakeholder — in Core (admissible)"); // grouped by object
    // name explicitly selects legal_name into the flattened Carta fullName, OCF-required.
    expect(rich).toMatch(/\| name \| \*\*yes\*\* \|.*Stakeholder\.fullName.*select \(legal_name\)/);
    expect(rich).toContain("addresses");

    const strict = renderUpstreamReport(await deriveCore(process.cwd(), STRICT_PROFILE));
    expect(strict).toContain("(none"); // strict carries no lossy-home fields
    expect(strict).not.toContain("### Stakeholder");
    expect(strict).not.toContain("```mermaid");
  });
});
