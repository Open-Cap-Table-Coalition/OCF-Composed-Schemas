import { deriveMappingCoverage } from "../scripts/lib/mapping-coverage.js";
import { RawSchema } from "../scripts/lib/registry.js";

describe("deriveMappingCoverage", () => {
  it("counts construct entries as mapped", () => {
    const result = deriveMappingCoverage(
      {
        fields: {
          percentage: {
            kind: "construct",
            target: "#/$defs/VestingPeriod/properties/percentage",
            construct: {
              property: "value",
              normalization: { integer_leading_zeros: "strip" },
            },
          },
        },
      },
      { properties: { percentage: { type: "string" } } } as RawSchema
    );

    expect(result.overall).toEqual({
      mapped: 1,
      total: 1,
      fields: { percentage: "mapped" },
    });
  });
});
