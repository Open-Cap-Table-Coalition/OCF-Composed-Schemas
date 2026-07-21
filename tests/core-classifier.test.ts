import {
  classifyField,
  classifyType,
  ClassifyCtx,
  TypeVerdict,
} from "../scripts/lib/core-classifier.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

function makeRegistry(entries: RawSchema[]): Registry {
  const r: Registry = new Map();
  for (const e of entries) r.set(e.$id as string, e);
  return r;
}

// OCF source types. Numeric/Date carry the boilerplate `properties: {}` that the
// real OCF type files ship — the classifier must still treat them as scalars.
const registry = makeRegistry([
  { $id: "ocf://Numeric", type: "string", pattern: "^[0-9]+$", properties: {}, required: [] },
  { $id: "ocf://Date", type: "string", format: "date", properties: {}, required: [] },
  { $id: "ocf://Cur", type: "string", pattern: "^[A-Z]{3}$", properties: {}, required: [] },
  {
    $id: "ocf://Monetary",
    type: "object",
    properties: { amount: { $ref: "ocf://Numeric" }, currency: { $ref: "ocf://Cur" } },
    required: ["amount", "currency"],
  } as unknown as RawSchema,
  { $id: "ocf://Enum2", enum: ["A", "B"] },
  { $id: "ocf://Enum3", enum: ["A", "B", "C"] },
]);

// Carta target bundle (self-contained #/$defs).
const bundle = {
  $defs: {
    Scalar: { type: "string" },
    EnumT: { enum: ["X", "Y"] },
    ArrayT: { type: "array", items: { type: "string" } },
    Money: {
      type: "object",
      properties: { amount: { $ref: "#/$defs/Dec" }, currencyCode: { $ref: "#/$defs/Iso" } },
    },
    Dec: { type: "object", properties: { value: { type: "string" } } },
    Iso: { type: "object", properties: { value: { type: "string" } } },
    Excluded: true, // Carta's out-of-snapshot marker
  },
};

const ctx = (typeLib: Map<string, TypeVerdict> = new Map()): ClassifyCtx => ({
  registry,
  bundle,
  typeLib,
});

describe("classifyField — no destination", () => {
  it("unmappable → out/no-destination", () => {
    expect(
      classifyField({ kind: "unmappable", target: null }, { type: "string" }, ctx())
    ).toMatchObject({
      class: "out",
      reason: "no-destination",
    });
  });
  it("TODO → out/no-destination", () => {
    expect(classifyField({ kind: "TODO", target: "TODO" }, { type: "string" }, ctx()).class).toBe(
      "out"
    );
  });
  it("target that does not resolve → out/no-destination", () => {
    expect(
      classifyField({ kind: "rename", target: "#/$defs/Missing" }, { type: "string" }, ctx())
    ).toMatchObject({ class: "out", reason: "no-destination" });
  });
  it("target resolving to Carta `true` marker → out/no-destination", () => {
    expect(
      classifyField({ kind: "rename", target: "#/$defs/Excluded" }, { type: "string" }, ctx())
    ).toMatchObject({ class: "out", reason: "no-destination" });
  });
});

describe("classifyField — rename shape cascade", () => {
  it("scalar → scalar lands as core/direct", () => {
    expect(
      classifyField({ kind: "rename", target: "#/$defs/Scalar" }, { $ref: "ocf://Numeric" }, ctx())
    ).toMatchObject({ class: "core" });
  });
  it("array(src) → scalar(tgt) is existence-loss (array→scalar)", () => {
    const v = classifyField(
      { kind: "rename", target: "#/$defs/Scalar" },
      { type: "array", items: { type: "string" } },
      ctx()
    );
    expect(v).toMatchObject({ class: "out", reason: "existence-loss" });
    expect(v.detail).toContain("array→scalar");
  });
  it("multiProp(src) → scalar(tgt) is existence-loss (structure→scalar)", () => {
    const v = classifyField(
      { kind: "rename", target: "#/$defs/Scalar" },
      { $ref: "ocf://Monetary" },
      ctx()
    );
    expect(v).toMatchObject({ class: "out", reason: "existence-loss" });
    expect(v.detail).toContain("structure→scalar");
  });
  it("free-text(src) → enum(tgt) is heuristic", () => {
    const v = classifyField({ kind: "rename", target: "#/$defs/EnumT" }, { type: "string" }, ctx());
    expect(v).toMatchObject({ class: "out", reason: "heuristic" });
    expect(v.detail).toContain("free-text→enum");
  });
  it("select is explicitly existence-loss with its policy", () => {
    const v = classifyField(
      { kind: "select", target: "#/$defs/Scalar", policy: "first" },
      { type: "array", items: { type: "string" } },
      ctx()
    );
    expect(v).toMatchObject({ class: "out", reason: "existence-loss", detail: "select (first)" });
  });
  it("a boilerplate-scalar source (properties:{}) is NOT misread as a collapse", () => {
    // Numeric ships `properties: {}`; it must classify as a clean scalar rename.
    expect(
      classifyField({ kind: "rename", target: "#/$defs/Scalar" }, { $ref: "ocf://Date" }, ctx())
        .class
    ).toBe("core");
  });
});

describe("classifyField — enum-remap totality (ruling C)", () => {
  it("total values map → core/value-coarsening", () => {
    const v = classifyField(
      { kind: "enum-remap", target: "#/$defs/EnumT", values: { A: "X", B: "Y", C: "X" } },
      { $ref: "ocf://Enum3" },
      ctx()
    );
    expect(v).toMatchObject({ class: "core", loss: "value-coarsening" });
  });
  it("a member sent to null with no route → out/partial", () => {
    const v = classifyField(
      { kind: "enum-remap", target: "#/$defs/EnumT", values: { A: "X", B: null, C: "X" } },
      { $ref: "ocf://Enum3" },
      ctx()
    );
    expect(v).toMatchObject({ class: "out", reason: "partial" });
    expect(v.detail).toContain("B");
  });
  it("a null member that is routed elsewhere keeps the map total → core", () => {
    const v = classifyField(
      {
        kind: "enum-remap",
        target: "#/$defs/EnumT",
        values: { A: "X", B: null },
        routed_to: { B: "Sib" },
      },
      { $ref: "ocf://Enum2" },
      ctx()
    );
    expect(v.class).toBe("core");
  });
});

describe("classifyField — computed/combine/split (ruling A vs B)", () => {
  it("computed defaults to out/heuristic", () => {
    expect(
      classifyField({ kind: "computed", target: "#/$defs/Scalar" }, { type: "string" }, ctx())
    ).toMatchObject({ class: "out", reason: "heuristic" });
  });
  it("an array target flags a possible reverse-edge for review", () => {
    const v = classifyField(
      { kind: "computed", target: "#/$defs/ArrayT" },
      { type: "string" },
      ctx()
    );
    expect(v.class).toBe("out");
    expect(v.review).toMatch(/reverse-edge/);
  });
});

describe("classifyField — type library overrides name matching", () => {
  it("a lossless composite type → core even though sub-property names differ", () => {
    // Monetary{amount,currency} → Money{amount,currencyCode}: a name match would
    // call `currency` missing; the type library says it lands.
    const lib = new Map<string, TypeVerdict>([
      ["ocf://Monetary", { lossless: true, lostProps: [] }],
    ]);
    expect(
      classifyField(
        { kind: "rename", target: "#/$defs/Money" },
        { $ref: "ocf://Monetary" },
        ctx(lib)
      )
    ).toMatchObject({ class: "core" });
  });
  it("a lossy composite type → out/existence-loss naming the dropped prop", () => {
    const lib = new Map<string, TypeVerdict>([
      ["ocf://Monetary", { lossless: false, lostProps: ["currency"] }],
    ]);
    const v = classifyField(
      { kind: "rename", target: "#/$defs/Money" },
      { $ref: "ocf://Monetary" },
      ctx(lib)
    );
    expect(v).toMatchObject({ class: "out", reason: "existence-loss" });
    expect(v.detail).toContain("currency");
  });
});

describe("classifyType", () => {
  it("all sub-properties land → lossless", () => {
    const v = classifyType(
      {
        amount: { kind: "rename", target: "#/$defs/Scalar" },
        currency: { kind: "rename", target: "#/$defs/Scalar" },
      },
      bundle
    );
    expect(v).toEqual({ lossless: true, lostProps: [] });
  });
  it("an unmappable sub-property → lossy, named", () => {
    const v = classifyType(
      {
        numerator: { kind: "unmappable", target: null },
        denominator: { kind: "unmappable", target: null },
      },
      bundle
    );
    expect(v.lossless).toBe(false);
    expect(v.lostProps).toEqual(["numerator", "denominator"]);
  });
});
