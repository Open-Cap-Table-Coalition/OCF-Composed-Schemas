import { detectEnumValues } from "../scripts/lib/enum-detection.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

function makeRegistry(entries: Array<RawSchema>): Registry {
  const r: Registry = new Map();
  for (const e of entries) {
    if (typeof e.$id !== "string") throw new Error("test fixture missing $id");
    r.set(e.$id, e);
  }
  return r;
}

describe("detectEnumValues", () => {
  it("returns inline enum values", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues({ enum: ["A", "B", "C"] }, reg)).toEqual(["A", "B", "C"]);
  });

  it("returns a single value array for `const`", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues({ const: "TX_FOO" }, reg)).toEqual(["TX_FOO"]);
  });

  it("resolves $ref to an enum schema", () => {
    const reg = makeRegistry([{ $id: "test://e", enum: ["X", "Y"] }]);
    expect(detectEnumValues({ $ref: "test://e" }, reg)).toEqual(["X", "Y"]);
  });

  it("returns null when $ref resolves to a non-enum schema", () => {
    const reg = makeRegistry([{ $id: "test://obj", title: "Some object", properties: {} }]);
    expect(detectEnumValues({ $ref: "test://obj" }, reg)).toBeNull();
  });

  it("returns null when $ref is unresolvable", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues({ $ref: "test://missing" }, reg)).toBeNull();
  });

  it("handles arrays of inline-enum items", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues({ type: "array", items: { enum: ["P", "Q"] } }, reg)).toEqual([
      "P",
      "Q",
    ]);
  });

  it("handles arrays whose items are a $ref to an enum", () => {
    const reg = makeRegistry([{ $id: "test://e", enum: ["U", "V"] }]);
    expect(detectEnumValues({ type: "array", items: { $ref: "test://e" } }, reg)).toEqual([
      "U",
      "V",
    ]);
  });

  it("returns null for plain typed properties", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues({ type: "string" }, reg)).toBeNull();
    expect(detectEnumValues({ type: "object", properties: {} }, reg)).toBeNull();
    expect(detectEnumValues({ type: "array", items: { type: "string" } }, reg)).toBeNull();
  });

  it("returns null for null/undefined input", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues(null, reg)).toBeNull();
    expect(detectEnumValues(undefined, reg)).toBeNull();
  });
});
