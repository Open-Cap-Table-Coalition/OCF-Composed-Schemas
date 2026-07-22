import { deriveCore, RICH_PROFILE } from "../scripts/lib/core-pipeline.js";

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

function canonicalPackage(pkg: Map<string, Record<string, unknown>>): string {
  return JSON.stringify([...pkg.entries()].sort().map(([k, v]) => [k, canonical(v)]));
}

describe("deriveCore (determinism — the drift gate's premise)", () => {
  it("two runs over the same corpus produce a structurally identical package", async () => {
    const a = await deriveCore(process.cwd());
    const b = await deriveCore(process.cwd());
    expect(canonicalPackage(a.package)).toEqual(canonicalPackage(b.package));
  });

  it("variants are collapsed — entities carry no __variant suffix", async () => {
    const d = await deriveCore(process.cwd());
    for (const e of d.entities) expect(e.entity).not.toContain("__");
  });

  it("every admissible event lands in the TransactionsFile; objects in their files/manifest", async () => {
    const d = await deriveCore(process.cwd());
    const tf = d.package.get("files/TransactionsFile.schema.json") as any;
    const eventTitles = new Set(tf.properties.items.items.oneOf.map((o: any) => o.title));
    for (const e of d.entities) {
      if (e.kind === "event") expect(eventTitles.has(e.entity)).toBe(true);
    }
    // The package only emits files for admissible entities (subset gate's premise).
    expect(d.entities.length).toBeGreaterThan(0);
    expect(d.package.has("OCFCoreManifestFile.schema.json")).toBe(true);
  });

  it("no admissible entity lands zero core fields (non-degeneracy holds)", async () => {
    const d = await deriveCore(process.cwd());
    for (const e of d.entities) expect(e.fields.length).toBeGreaterThan(0);
  });

  it("alias wrappers get an admissibility verdict but never emit a Core schema", async () => {
    const d = await deriveCore(process.cwd());
    const aliasRows = d.admissibility.filter((a) => a.aliasOf);
    expect(aliasRows.length).toBeGreaterThan(0); // the PlanSecurity* family

    const psi = aliasRows.find((a) => a.entity === "PlanSecurityIssuance");
    expect(psi?.aliasOf).toBe("EquityCompensationIssuance");
    // Recursive inspection of the required inline vestings array makes the
    // strict base inadmissible; the compatibility wrapper mirrors that result.
    expect(psi?.admissible).toBe(false);

    // A wrapper carries no core fields of its own, so it is never drafted as a
    // Core entity, and an inadmissible base is not emitted either.
    const emitted = new Set(d.entities.map((e) => e.entity));
    for (const a of aliasRows) expect(emitted.has(a.entity)).toBe(false);
    expect(emitted.has("EquityCompensationIssuance")).toBe(false);
  });

  it("every entity carries the OCF identity spine (id + object_type)", async () => {
    const d = await deriveCore(process.cwd());
    for (const e of d.entities) {
      const names = new Set(e.fields.map((f) => f.field));
      expect(names.has("id")).toBe(true);
      expect(names.has("object_type")).toBe(true);
    }
    // The discriminator is present on every event def in the emitted package.
    const tf = d.package.get("files/TransactionsFile.schema.json") as any;
    for (const def of tf.properties.items.items.oneOf) {
      expect(def.properties.object_type).toBeDefined();
    }
  });

  it("does not admit StockClass.initial_shares_authorized to strict Core", async () => {
    const strict = await deriveCore(process.cwd());
    const rich = await deriveCore(process.cwd(), RICH_PROFILE);
    const row = strict.rows.find(
      (r) =>
        r.entity === "StockClass" && r.variant === "—" && r.field === "initial_shares_authorized"
    );
    expect(row?.verdict).toMatchObject({ class: "out", reason: "partial" });
    expect(row?.verdict.detail).toContain("AuthorizedShares: unmapped members");
    expect(row?.verdict.detail).toContain("Numeric: widening");
    const strictStockClass = strict.package.get("files/StockClassesFile.schema.json") as any;
    const richStockClass = rich.package.get("files/StockClassesFile.schema.json") as any;
    expect(
      strictStockClass.properties.items.items.properties.initial_shares_authorized
    ).toBeUndefined();
    expect(
      richStockClass.properties.items.items.properties.initial_shares_authorized
    ).toBeDefined();
  });

  it("classifies nested array-item mappings recursively", async () => {
    const strict = await deriveCore(process.cwd());
    const rich = await deriveCore(process.cwd(), RICH_PROFILE);
    const row = (entity: string, variant: string, field: string) =>
      strict.rows.find((r) => r.entity === entity && r.variant === variant && r.field === field);

    expect(row("VestingTerms", "—", "statements")?.verdict).toMatchObject({
      class: "out",
      reason: "heuristic",
    });
    expect(row("EquityCompensationIssuance", "Option", "vestings")?.verdict).toMatchObject({
      class: "core",
      loss: "direct",
    });
    expect(row("StockIssuance", "Rsa", "vestings")?.verdict).toMatchObject({
      class: "core",
      loss: "direct",
    });

    // VestingTerms still has a lossy statements payload, and the issuance
    // entities remain blocked by their references to that entity. Core-Rich
    // deliberately retains those lossy homes and their original OCF shapes.
    for (const entity of ["VestingTerms", "EquityCompensationIssuance", "StockIssuance"]) {
      expect(strict.entities.some((e) => e.entity === entity)).toBe(false);
      expect(rich.entities.some((e) => e.entity === entity)).toBe(true);
    }
  });
});
