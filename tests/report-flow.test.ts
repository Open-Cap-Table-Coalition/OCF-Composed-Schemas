import { groupByEntity, FlowRow } from "../scripts/lib/report-flow.js";

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

describe("groupByEntity", () => {
  it("collapses identical field mappings across variants", () => {
    const rows = [
      row("StockIssuance", "Rsa", "quantity"),
      row("StockIssuance", "Default", "quantity"),
      row("Stakeholder", "—", "name"),
    ];
    expect(groupByEntity(rows).map((g) => g.entity)).toEqual(["Stakeholder", "StockIssuance"]);
    expect(
      groupByEntity(rows).find((g) => g.entity === "StockIssuance")?.fields[0]?.variants
    ).toEqual(["Rsa", "Default"]);
  });

  it("carries admissibility from the source rows", () => {
    const groups = groupByEntity([
      row("T", "A", "f1", { admissible: true }),
      row("T", "B", "f2", { admissible: false }),
    ]);
    expect(groups[0]?.admissible).toBe(true);
    expect(groups[0]?.fields.map((f) => f.field)).toEqual(["f1", "f2"]);
  });
});
