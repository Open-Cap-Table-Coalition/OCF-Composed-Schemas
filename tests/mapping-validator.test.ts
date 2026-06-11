import { resolveJsonPointer, targetEnumValuesAt } from "../scripts/lib/mapping-validator.js";

const BUNDLE = {
  $defs: {
    Thing: {
      type: "object",
      properties: {
        name: { type: "string" },
        color: { $ref: "#/$defs/Color" },
        tags: { type: "array", items: { $ref: "#/$defs/Color" } },
        "weird/name": { type: "string" },
      },
    },
    Color: { type: "string", enum: ["red", "blue"] },
    Excluded: true,
    Loop: { $ref: "#/$defs/Loop" },
  },
};

describe("resolveJsonPointer", () => {
  it("resolves a nested pointer", () => {
    const res = resolveJsonPointer(BUNDLE, "#/$defs/Thing/properties/name");
    expect(res).toEqual({ found: true, value: { type: "string" } });
  });

  it("resolves the root pointer", () => {
    expect(resolveJsonPointer(BUNDLE, "#")).toEqual({ found: true, value: BUNDLE });
  });

  it("reports missing paths as not found", () => {
    expect(resolveJsonPointer(BUNDLE, "#/$defs/Thing/properties/nope").found).toBe(false);
    expect(resolveJsonPointer(BUNDLE, "#/$defs/Missing").found).toBe(false);
  });

  it("rejects pointers that do not start with #/", () => {
    expect(resolveJsonPointer(BUNDLE, "/$defs/Thing").found).toBe(false);
    expect(resolveJsonPointer(BUNDLE, "$defs/Thing").found).toBe(false);
  });

  it("unescapes ~1 and ~0 per RFC 6901", () => {
    const res = resolveJsonPointer(BUNDLE, "#/$defs/Thing/properties/weird~1name");
    expect(res.found).toBe(true);
  });

  it("indexes into arrays", () => {
    const doc = { list: ["a", "b"] };
    expect(resolveJsonPointer(doc, "#/list/1")).toEqual({ found: true, value: "b" });
    expect(resolveJsonPointer(doc, "#/list/2").found).toBe(false);
    expect(resolveJsonPointer(doc, "#/list/x").found).toBe(false);
  });
});

describe("targetEnumValuesAt", () => {
  it("returns enum values from a direct enum node", () => {
    expect(targetEnumValuesAt(BUNDLE, { enum: ["x", "y"] })).toEqual(["x", "y"]);
  });

  it("follows $ref chains within the bundle", () => {
    expect(targetEnumValuesAt(BUNDLE, { $ref: "#/$defs/Color" })).toEqual(["red", "blue"]);
  });

  it("delegates arrays to their items", () => {
    const node = resolveJsonPointer(BUNDLE, "#/$defs/Thing/properties/tags").value;
    expect(targetEnumValuesAt(BUNDLE, node)).toEqual(["red", "blue"]);
  });

  it("returns null for non-enum nodes", () => {
    expect(targetEnumValuesAt(BUNDLE, { type: "string" })).toBeNull();
    expect(targetEnumValuesAt(BUNDLE, true)).toBeNull();
  });

  it("survives $ref cycles", () => {
    expect(targetEnumValuesAt(BUNDLE, { $ref: "#/$defs/Loop" })).toBeNull();
  });
});
