import { flavorLabel, groupByEntity, groupByVariant, FlowRow } from "../scripts/lib/report-flow.js";

function row(entity: string, variant: string, field: string, over: Partial<FlowRow> = {}): FlowRow {
  return {
    entity,
    variant,
    field,
    target: "#/$defs/X/properties/y",
    reason: "",
    detail: "",
    ocfRequired: false,
    admissible: true,
    ...over,
  };
}

describe("flavorLabel", () => {
  it("labels a polymorphic flavor with its base + variant (lineage explicit)", () => {
    expect(flavorLabel("StockIssuance", "Rsa")).toBe("StockIssuance [Rsa]");
  });
  it("uses the bare entity when not polymorphic", () => {
    expect(flavorLabel("Stakeholder", "—")).toBe("Stakeholder");
  });
});

describe("groupByVariant", () => {
  it("splits each polymorphic flavor into its own group; groupByEntity collapses them", () => {
    const rows = [
      row("StockIssuance", "Rsa", "quantity"),
      row("StockIssuance", "Default", "quantity"),
      row("Stakeholder", "—", "name"),
    ];
    expect(groupByVariant(rows).map((g) => g.entity)).toEqual([
      "Stakeholder",
      "StockIssuance [Default]",
      "StockIssuance [Rsa]",
    ]);
    // Contrast: the entity grouping fuses the two flavors into one (crowded) node.
    expect(groupByEntity(rows).map((g) => g.entity)).toEqual(["Stakeholder", "StockIssuance"]);
  });

  it("carries each flavor's own admissibility and fields", () => {
    const groups = groupByVariant([
      row("T", "A", "f1", { admissible: true }),
      row("T", "B", "f2", { admissible: false }),
    ]);
    const a = groups.find((g) => g.entity === "T [A]")!;
    const b = groups.find((g) => g.entity === "T [B]")!;
    expect(a.admissible).toBe(true);
    expect(a.fields.map((f) => f.field)).toEqual(["f1"]);
    expect(b.admissible).toBe(false);
    expect(b.fields.map((f) => f.field)).toEqual(["f2"]);
  });
});
