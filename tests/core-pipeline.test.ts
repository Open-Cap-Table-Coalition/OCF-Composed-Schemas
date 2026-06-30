import { deriveCore } from "../scripts/lib/core-pipeline.js";

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
});
