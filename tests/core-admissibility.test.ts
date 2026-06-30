import {
  computeAdmissibility,
  referentOf,
  ClassifiedRow,
  Admissibility,
} from "../scripts/lib/core-admissibility.js";

const core = (entity: string, variant: string, field: string): ClassifiedRow => ({
  entity,
  variant,
  field,
  klass: "core",
});
const out = (entity: string, variant: string, field: string): ClassifiedRow => ({
  entity,
  variant,
  field,
  klass: "out",
});

function index(adm: Admissibility[]): Map<string, Admissibility> {
  return new Map(adm.map((a) => [`${a.entity} ${a.variant}`, a]));
}

describe("referentOf", () => {
  it("maps known FK fields to their referent entity", () => {
    expect(referentOf("X", "stakeholder_id")).toEqual({ kind: "entity", entity: "Stakeholder" });
    expect(referentOf("X", "stock_class_id")).toEqual({ kind: "entity", entity: "StockClass" });
    expect(referentOf("X", "vesting_template_id")).toEqual({
      kind: "entity",
      entity: "VestingTerms",
    });
  });
  it("treats security_id as created on an issuance, a reference elsewhere", () => {
    expect(referentOf("StockIssuance", "security_id")).toEqual({ kind: "none" });
    expect(referentOf("StockTransfer", "security_id")).toEqual({ kind: "security" });
  });
  it("treats labels as non-references", () => {
    expect(referentOf("X", "custom_id")).toEqual({ kind: "none" });
    expect(referentOf("X", "issuer_assigned_id")).toEqual({ kind: "none" });
  });
  it("flags an unknown id-shaped field as unresolved", () => {
    expect(referentOf("X", "mystery_id")).toEqual({ kind: "unresolved" });
  });
});

describe("computeAdmissibility — non-degeneracy (payload) gate", () => {
  it("blocks an entity that lands only a date / key / reference", () => {
    const adm = index(computeAdmissibility([core("A", "—", "date")]));
    const a = adm.get("A —")!;
    expect(a.admissible).toBe(false);
    expect(a.blockers.map((b) => b.why)).toContain("no-payload");
    expect(a.payloadFieldCount).toBe(0);
  });
  it("admits an entity with at least one payload field", () => {
    const adm = index(
      computeAdmissibility([core("A", "—", "quantity"), out("A", "—", "comments")])
    );
    expect(adm.get("A —")!.admissible).toBe(true);
  });
  it("a reference-only entity is degenerate (references are not payload)", () => {
    // stakeholder_id would also be a closure obligation, but the no-payload gate
    // fires regardless; assert the entity is blocked.
    const adm = index(computeAdmissibility([core("A", "—", "stakeholder_id")]));
    expect(adm.get("A —")!.admissible).toBe(false);
  });
});

describe("computeAdmissibility — referential closure", () => {
  it("admits when a core FK resolves to an admissible referent", () => {
    const adm = index(
      computeAdmissibility([
        core("Iss", "—", "quantity"),
        core("Iss", "—", "stock_class_id"),
        core("StockClass", "—", "name"),
      ])
    );
    expect(adm.get("Iss —")!.admissible).toBe(true);
    expect(adm.get("StockClass —")!.admissible).toBe(true);
  });

  it("blocks when a core FK referent is absent (dangling)", () => {
    const adm = index(
      computeAdmissibility([core("Iss", "—", "quantity"), core("Iss", "—", "stock_class_id")])
    );
    const a = adm.get("Iss —")!;
    expect(a.admissible).toBe(false);
    expect(a.blockers).toContainEqual({
      field: "stock_class_id",
      referent: "StockClass",
      why: "dangling-reference",
    });
  });

  it("an `out` FK imposes no closure obligation", () => {
    const adm = index(
      computeAdmissibility([core("Iss", "—", "quantity"), out("Iss", "—", "stock_class_id")])
    );
    expect(adm.get("Iss —")!.admissible).toBe(true);
  });

  it("propagates: a referent that is itself degenerate dangles its referrer (fixpoint)", () => {
    const adm = index(
      computeAdmissibility([
        core("Iss", "—", "quantity"),
        core("Iss", "—", "stock_class_id"),
        core("StockClass", "—", "id"), // id is bookkeeping → StockClass has no payload
      ])
    );
    expect(adm.get("StockClass —")!.admissible).toBe(false); // no-payload
    const iss = adm.get("Iss —")!;
    expect(iss.admissible).toBe(false); // its FK now dangles
    expect(iss.blockers.some((b) => b.referent === "StockClass")).toBe(true);
  });

  it("a security_id on a transaction needs some admissible issuance", () => {
    const danglingTransfer = index(
      computeAdmissibility([
        core("FooTransfer", "—", "quantity"),
        core("FooTransfer", "—", "security_id"),
      ])
    );
    expect(danglingTransfer.get("FooTransfer —")!.admissible).toBe(false);

    const withIssuance = index(
      computeAdmissibility([
        core("FooTransfer", "—", "quantity"),
        core("FooTransfer", "—", "security_id"),
        core("BarIssuance", "—", "quantity"),
      ])
    );
    expect(withIssuance.get("FooTransfer —")!.admissible).toBe(true);
  });
});
