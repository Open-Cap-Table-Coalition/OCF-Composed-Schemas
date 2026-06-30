import { deriveCore, defNameFor } from "../scripts/lib/core-pipeline.js";

/** Recursively sort object keys for structural comparison (mirrors core:check). */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      out[k] = canonical((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}

describe("defNameFor", () => {
  it("uses the bare entity name when not polymorphic", () => {
    expect(defNameFor("Stakeholder", "—")).toBe("Stakeholder");
  });
  it("joins entity and variant for polymorphic defs", () => {
    expect(defNameFor("StockIssuance", "Rsa")).toBe("StockIssuance__Rsa");
  });
});

describe("deriveCore (determinism — the drift gate's premise)", () => {
  it("two runs over the same corpus produce a structurally identical schema", async () => {
    const a = await deriveCore(process.cwd());
    const b = await deriveCore(process.cwd());
    expect(JSON.stringify(canonical(a.schema))).toEqual(JSON.stringify(canonical(b.schema)));
  });

  it("every emitted $def corresponds to an admissible (entity,variant)", async () => {
    const d = await deriveCore(process.cwd());
    const admissible = new Set(
      d.admissibility.filter((x) => x.admissible).map((x) => defNameFor(x.entity, x.variant))
    );
    const defNames = Object.keys((d.schema.$defs as Record<string, unknown>) ?? {});
    expect(defNames.length).toBeGreaterThan(0);
    for (const name of defNames) expect(admissible.has(name)).toBe(true);
  });

  it("no admissible entity lands zero core fields (non-degeneracy holds)", async () => {
    const d = await deriveCore(process.cwd());
    for (const a of d.admissibility) {
      if (a.admissible) expect(a.payloadFieldCount).toBeGreaterThan(0);
    }
  });
});
