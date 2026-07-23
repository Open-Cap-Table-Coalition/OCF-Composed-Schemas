import { variantFieldMaps, loadGreenCorpus } from "../scripts/lib/core-corpus.js";

describe("variantFieldMaps", () => {
  it("a non-polymorphic mapping yields a single '—' variant", () => {
    const m = variantFieldMaps({ fields: { a: { kind: "rename", target: "t" } } });
    expect([...m.keys()]).toEqual(["—"]);
    expect(m.get("—")).toEqual({ a: { kind: "rename", target: "t" } });
  });

  it("a mapping with no fields yields an empty '—' variant", () => {
    expect(variantFieldMaps({}).get("—")).toEqual({});
  });

  it("merges shared ∪ per-variant-target projection ∪ variant fields", () => {
    const m = variantFieldMaps({
      route_by_property: { on_property: "x", exhaustive: true },
      shared: {
        s1: { kind: "rename", target: "#/uniform" },
        sm: { kind: "rename", target: { V1: "#/a", V2: null } },
      },
      variants: {
        V1: { when: ["P"], fields: { f1: { kind: "rename", target: "#/f1" } } },
        V2: { when: ["Q"], fields: {} },
      },
    });

    expect([...m.keys()].sort()).toEqual(["V1", "V2"]);

    const v1 = m.get("V1")!;
    expect(v1.s1).toEqual({ kind: "rename", target: "#/uniform" }); // uniform shared
    expect(v1.sm).toEqual({ kind: "rename", target: "#/a" }); // per-variant target projected to scalar
    expect(v1.f1).toEqual({ kind: "rename", target: "#/f1" }); // variant-specific

    const v2 = m.get("V2")!;
    expect(v2.s1).toEqual({ kind: "rename", target: "#/uniform" });
    expect(v2.sm).toEqual({ kind: "unmappable", target: null, reason: "no-equivalent" }); // null → unmappable
    expect(v2.f1).toBeUndefined();
  });

  it("projects a composite per-step target map onto ALL its step targets per family", () => {
    const m = variantFieldMaps({
      route_by_property: {
        lookup_by: {
          key: "security_id",
          through: {
            mapping: "../issuance/EquityComp.mapping.md",
            on_property: "x",
          },
        },
      },
      composite: [
        { step: "cancel", target: {} },
        { step: "issue", target: {} },
      ],
      shared: {
        quantity: {
          kind: "rename",
          target: {
            cancel: { A: "#/cancelA", B: "#/cancelB" },
            issue: { A: "#/issueA", B: null },
          },
        },
      },
      variants: {
        A: { when: ["P"], fields: {} },
        B: { when: ["Q"], fields: {} },
      },
    });
    // Lands on BOTH steps → an array (both transactions show in the flow diagram).
    expect(m.get("A")!.quantity).toEqual({ kind: "rename", target: ["#/cancelA", "#/issueA"] });
    // Lands on only one step (issue slot null) → a single scalar target.
    expect(m.get("B")!.quantity).toEqual({ kind: "rename", target: "#/cancelB" });
  });
});

describe("loadGreenCorpus (smoke — reads the real repo)", () => {
  it("loads registry, bundle, type library, and green objects", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    expect(corpus.registry.size).toBeGreaterThan(0);
    expect((corpus.bundle as { $defs?: object }).$defs).toBeTruthy();
    expect(corpus.objects.length).toBeGreaterThan(0);
    expect(corpus.targetedDefs.size).toBeGreaterThan(0);

    // Every green object exposes source properties and at least one variant.
    for (const obj of corpus.objects) {
      expect(obj.variants.size).toBeGreaterThan(0);
      expect(typeof obj.entity).toBe("string");
    }
  });

  it("detects PlanSecurity* compatibility wrappers as aliases of their EquityCompensation base", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    const byEntity = new Map(corpus.objects.map((o) => [o.entity, o]));

    const psi = byEntity.get("PlanSecurityIssuance");
    expect(psi?.aliasOf).toBe("EquityCompensationIssuance");

    // Every green PlanSecurity* is an alias; nothing else is (composition
    // primitives are inlined, not `$ref`d to a concrete entity).
    for (const obj of corpus.objects) {
      if (obj.entity.startsWith("PlanSecurity")) {
        expect(obj.aliasOf).toBe(obj.entity.replace(/^PlanSecurity/, "EquityCompensation"));
      } else {
        expect(obj.aliasOf).toBeUndefined();
      }
    }
  });
});
