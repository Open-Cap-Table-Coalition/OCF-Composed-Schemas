import {
  resolveJsonPointer,
  targetEnumValuesAt,
  validateMapping,
  ValidateInput,
} from "../scripts/lib/mapping-validator.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

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

  it("rejects leading-zero array indices per RFC 6901", () => {
    const doc = { list: ["a", "b"] };
    expect(resolveJsonPointer(doc, "#/list/01").found).toBe(false);
  });

  it("treats present null/false values as found", () => {
    const doc = { a: null, b: false };
    expect(resolveJsonPointer(doc, "#/a")).toEqual({ found: true, value: null });
    expect(resolveJsonPointer(doc, "#/b")).toEqual({ found: true, value: false });
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

const SOURCE_SCHEMA: RawSchema = {
  $id: "test://thing",
  title: "Thing",
  properties: {
    name: { type: "string" },
    color: { $ref: "test://color-enum" },
  },
  required: ["name"],
};

const REGISTRY: Registry = new Map([
  ["test://color-enum", { $id: "test://color-enum", enum: ["RED", "BLUE"] }],
]);

function frontmatter(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ocf_schema_id: "test://thing",
    ocf_object_type: null,
    ocf_title: "Thing",
    ocf_kind: "type",
    required_fields: ["name"],
    target_standard: "Carta",
    target_version: "v1alpha1",
    status: "complete",
    last_generated: "2026-06-11",
    ...over,
  };
}

function mapping(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    status: "complete",
    coverage: "2/2",
    fields: {
      name: { kind: "rename", target: "#/$defs/Thing/properties/name" },
      color: {
        kind: "enum-remap",
        target: "#/$defs/Thing/properties/color",
        values: { RED: "red", BLUE: "blue" },
      },
    },
    ...over,
  };
}

function makeInput(over: Partial<ValidateInput> = {}): ValidateInput {
  return {
    file: "types/Thing.mapping.md",
    frontmatter: frontmatter(),
    mapping: mapping(),
    sourceSchema: SOURCE_SCHEMA,
    registry: REGISTRY,
    targetBundle: BUNDLE,
    ...over,
  };
}

function messages(input: ValidateInput, requireUnmappableReason = false): string[] {
  return validateMapping(input, { requireUnmappableReason }).map((e) =>
    e.field ? `${e.field}: ${e.message}` : e.message
  );
}

describe("validateMapping — frontmatter and top level", () => {
  it("accepts a fully valid complete mapping", () => {
    expect(messages(makeInput())).toEqual([]);
  });

  it("reports each missing required frontmatter key", () => {
    const fm = frontmatter();
    delete fm.ocf_schema_id;
    delete fm.last_generated;
    const errs = messages(makeInput({ frontmatter: fm }));
    expect(errs).toContain('frontmatter is missing required key "ocf_schema_id"');
    expect(errs).toContain('frontmatter is missing required key "last_generated"');
  });

  it("rejects an unknown frontmatter status", () => {
    const errs = messages(makeInput({ frontmatter: frontmatter({ status: "done" }) }));
    expect(errs.some((m) => m.includes('frontmatter status "done"'))).toBe(true);
  });

  it("rejects an unknown mapping block status", () => {
    const errs = messages(makeInput({ mapping: mapping({ status: "finished" }) }));
    expect(errs.some((m) => m.includes('mapping block status "finished"'))).toBe(true);
  });

  it("rejects a frontmatter/mapping status mismatch", () => {
    const errs = messages(makeInput({ frontmatter: frontmatter({ status: "draft" }) }));
    expect(errs.some((m) => m.includes("does not match"))).toBe(true);
  });

  it("treats fields: null as an empty map (property-less schemas)", () => {
    const input = makeInput({
      sourceSchema: { $id: "test://scalar", title: "Scalar" },
      mapping: { status: "complete", coverage: "0/0", fields: null },
    });
    expect(messages(input)).toEqual([]);
  });

  it("rejects a fields value that is not a map", () => {
    const errs = messages(makeInput({ mapping: mapping({ fields: "nope" }) }));
    expect(errs.some((m) => m.includes("fields"))).toBe(true);
  });

  it("rejects field keys that are not source schema properties", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).bogus = {
      kind: "rename",
      target: "#/$defs/Thing/properties/name",
    };
    const errs = messages(makeInput({ mapping: { ...m, coverage: "3/2" } }));
    expect(errs.some((s) => s.startsWith("bogus: "))).toBe(true);
  });
});

describe("validateMapping — entry shapes", () => {
  function withField(entry: Record<string, unknown>, coverage = "2/2"): ValidateInput {
    const m = mapping({ coverage });
    (m.fields as Record<string, unknown>).name = entry;
    return makeInput({ mapping: m });
  }

  it("rejects kinds outside the vocabulary", () => {
    const errs = messages(withField({ kind: "renamed", target: "#/$defs/Thing/properties/name" }));
    expect(errs.some((m) => m.includes('kind "renamed"'))).toBe(true);
  });

  it("requires string targets for rename/combine/enum-remap/computed", () => {
    const errs = messages(withField({ kind: "rename", target: null }));
    expect(errs.some((m) => m.includes("string target"))).toBe(true);
  });

  it("requires split targets to be arrays of at least 2 strings", () => {
    expect(
      messages(withField({ kind: "split", target: ["#/$defs/Thing/properties/name"] })).some((m) =>
        m.includes("at least 2")
      )
    ).toBe(true);
    expect(
      messages(
        withField({
          kind: "split",
          target: ["#/$defs/Thing/properties/name", "#/$defs/Thing/properties/color"],
        })
      )
    ).toEqual([]);
  });

  it("requires unmappable targets to be null", () => {
    const errs = messages(withField({ kind: "unmappable", target: "#/$defs/Thing" }));
    expect(errs.some((m) => m.includes("target: null"))).toBe(true);
  });

  it("rejects reason on non-unmappable entries", () => {
    const errs = messages(
      withField({
        kind: "rename",
        target: "#/$defs/Thing/properties/name",
        reason: "no-equivalent",
      })
    );
    expect(errs.some((m) => m.includes("only valid on unmappable"))).toBe(true);
  });

  it("rejects reasons outside the vocabulary", () => {
    const errs = messages(withField({ kind: "unmappable", target: null, reason: "because" }));
    expect(errs.some((m) => m.includes('reason "because"'))).toBe(true);
  });

  it("accepts each vocabulary reason on unmappable", () => {
    for (const reason of [
      "no-equivalent",
      "excluded-from-snapshot",
      "out-of-scope",
      "ocf-internal",
    ]) {
      expect(messages(withField({ kind: "unmappable", target: null, reason }))).toEqual([]);
    }
  });

  it("does not require reason by default, but does when the option is set", () => {
    const input = withField({ kind: "unmappable", target: null });
    expect(messages(input, false)).toEqual([]);
    expect(messages(input, true).some((m) => m.includes("require a reason"))).toBe(true);
  });

  it("does not require reason in draft files even when the option is set", () => {
    const m = mapping({ status: "draft", coverage: "2/2" });
    (m.fields as Record<string, unknown>).name = { kind: "unmappable", target: null };
    const input = makeInput({ frontmatter: frontmatter({ status: "draft" }), mapping: m });
    expect(messages(input, true)).toEqual([]);
  });
});

describe("validateMapping — values blocks", () => {
  it("requires a values map on enum-remap", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/color",
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes("requires a values"))).toBe(true);
  });

  it("rejects values on a non-enum-typed property", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).name = {
      kind: "rename",
      target: "#/$defs/Thing/properties/name",
      values: { A: "b" },
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes("not enum-typed"))).toBe(true);
  });

  it("allows values on unmappable entries for enum-typed properties, keys still checked", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "unmappable",
      target: null,
      values: { RED: null, BLUE: null },
    };
    expect(messages(makeInput({ mapping: { ...m, coverage: "2/2" } }))).toEqual([]);

    (m.fields as Record<string, unknown>).color = {
      kind: "unmappable",
      target: null,
      values: { RED: null, GREEN: null },
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes('"GREEN"'))).toBe(true);
    expect(errs.some((s) => s.includes('missing OCF enum value "BLUE"'))).toBe(true);
  });

  it("flags values keys that are not OCF enum values and missing OCF values", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/color",
      values: { RED: "red", GREEN: "green" },
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes('values key "GREEN"'))).toBe(true);
    expect(errs.some((s) => s.includes('missing OCF enum value "BLUE"'))).toBe(true);
  });

  it("allows null values (dropped enum members)", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/color",
      values: { RED: "red", BLUE: null },
    };
    expect(messages(makeInput({ mapping: m }))).toEqual([]);
  });
});

describe("validateMapping — coverage and status strictness", () => {
  it("rejects malformed coverage", () => {
    const errs = messages(makeInput({ mapping: mapping({ coverage: "all" }) }));
    expect(errs.some((m) => m.includes('"X/N"'))).toBe(true);
  });

  it("rejects a denominator that disagrees with the property count", () => {
    const errs = messages(makeInput({ mapping: mapping({ coverage: "2/3" }) }));
    expect(errs.some((m) => m.includes("denominator"))).toBe(true);
  });

  it("rejects a numerator that disagrees with the non-TODO count", () => {
    const errs = messages(makeInput({ mapping: mapping({ coverage: "1/2" }) }));
    expect(errs.some((m) => m.includes("numerator"))).toBe(true);
  });

  it("accepts a draft skeleton with TODO kinds and TODO values", () => {
    const input = makeInput({
      frontmatter: frontmatter({ status: "draft", target_standard: "TBD", target_version: "TBD" }),
      mapping: {
        status: "draft",
        coverage: "0/2",
        fields: {
          name: { kind: "TODO", target: "TODO" },
          color: { kind: "TODO", target: "TODO", values: { RED: "TODO", BLUE: "TODO" } },
        },
      },
      targetBundle: null,
    });
    expect(messages(input)).toEqual([]);
  });

  it("rejects TODO kinds in complete files", () => {
    const m = mapping({ coverage: "1/2" });
    (m.fields as Record<string, unknown>).name = { kind: "TODO", target: "TODO" };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes("TODO"))).toBe(true);
  });

  it("rejects TODO enum values in complete files", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/color",
      values: { RED: "red", BLUE: "TODO" },
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes("TODO"))).toBe(true);
  });

  it("requires complete files to cover every property", () => {
    const m = mapping({ coverage: "1/2" });
    delete (m.fields as Record<string, unknown>).color;
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.startsWith("color: missing"))).toBe(true);
  });

  it("allows partial files to omit properties", () => {
    const m = mapping({ status: "partial", coverage: "1/2" });
    delete (m.fields as Record<string, unknown>).color;
    const input = makeInput({ frontmatter: frontmatter({ status: "partial" }), mapping: m });
    expect(messages(input)).toEqual([]);
  });
});

describe("validateMapping — semantic target checks", () => {
  function withField(entry: Record<string, unknown>, coverage = "2/2"): ValidateInput {
    const m = mapping({ coverage });
    (m.fields as Record<string, unknown>).name = entry;
    return makeInput({ mapping: m });
  }

  it("rejects targets that are not #/ JSON pointers", () => {
    const errs = messages(withField({ kind: "rename", target: "$defs.Thing.name" }));
    expect(errs.some((m) => m.includes('"#/..." JSON pointer'))).toBe(true);
  });

  it("rejects targets that do not resolve in the bundle", () => {
    const errs = messages(withField({ kind: "rename", target: "#/$defs/Thing/properties/nope" }));
    expect(errs.some((m) => m.includes("does not resolve"))).toBe(true);
  });

  it("checks every element of a split target", () => {
    const errs = messages(
      withField({ kind: "split", target: ["#/$defs/Thing/properties/name", "#/$defs/Missing"] })
    );
    expect(errs.some((m) => m.includes("#/$defs/Missing"))).toBe(true);
  });

  it("rejects targets resolving to true (excluded from the snapshot)", () => {
    const errs = messages(withField({ kind: "rename", target: "#/$defs/Excluded" }));
    expect(errs.some((m) => m.includes("excluded-from-snapshot"))).toBe(true);
  });

  it("rejects enum-remap values not in the target enum", () => {
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/color",
      values: { RED: "red", BLUE: "magenta" },
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => s.includes('"magenta"'))).toBe(true);
  });

  it("accepts enum-remap values that are in the target enum", () => {
    expect(messages(makeInput())).toEqual([]);
  });

  it("skips all semantic checks when targetBundle is null (TBD drafts)", () => {
    const input = makeInput({
      frontmatter: frontmatter({ target_standard: "TBD", target_version: "TBD", status: "draft" }),
      mapping: {
        status: "draft",
        coverage: "1/2",
        fields: {
          name: { kind: "rename", target: "#/this/will/not/resolve/anywhere" },
        },
      },
      targetBundle: null,
    });
    expect(messages(input)).toEqual([]);
  });

  it("does not pointer-check TODO targets", () => {
    const input = makeInput({
      frontmatter: frontmatter({ status: "draft" }),
      mapping: {
        status: "draft",
        coverage: "0/2",
        fields: { name: { kind: "TODO", target: "TODO" } },
      },
    });
    expect(messages(input)).toEqual([]);
  });
});

describe("validateMapping — canonical ($defs-keyed) sources", () => {
  // A canonical-style source: no top-level `properties`, several named objects
  // under `$defs`, addressed by the mapping with dotted `Def.prop` field names.
  // `Unreferenced` stands in for a nested value-object def (e.g. a Fraction)
  // that no field targets directly and so must be excluded from coverage.
  const DEFS_SOURCE: RawSchema = {
    $id: "test://canonical",
    title: "Canonical",
    $defs: {
      Outer: {
        type: "object",
        properties: { id: { type: "string" }, kind: { $ref: "test://color-enum" } },
      },
      Inner: { type: "object", properties: { a: { type: "string" }, b: { type: "string" } } },
      Unreferenced: { type: "object", properties: { x: { type: "string" } } },
    },
  };

  function canonicalFrontmatter(over: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      canonical_schema_id: "test://canonical",
      canonical_title: "Canonical",
      canonical_kind: "type",
      required_fields: [],
      target_standard: "Carta",
      target_version: "v1alpha1",
      status: "complete",
      last_generated: "2026-06-11",
      ...over,
    };
  }

  function canonicalMapping(over: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      status: "complete",
      coverage: "4/4",
      fields: {
        "Outer.id": { kind: "rename", target: "#/$defs/Thing/properties/name" },
        "Outer.kind": {
          kind: "enum-remap",
          target: "#/$defs/Thing/properties/color",
          values: { RED: "red", BLUE: "blue" },
        },
        "Inner.a": { kind: "rename", target: "#/$defs/Thing/properties/name" },
        "Inner.b": { kind: "rename", target: "#/$defs/Thing/properties/name" },
      },
      ...over,
    };
  }

  function canonicalInput(over: Partial<ValidateInput> = {}): ValidateInput {
    return makeInput({
      file: "canonical/Thing.mapping.md",
      frontmatter: canonicalFrontmatter(),
      mapping: canonicalMapping(),
      sourceSchema: DEFS_SOURCE,
      ...over,
    });
  }

  it("accepts a $defs-keyed mapping with dotted Def.prop field names", () => {
    expect(messages(canonicalInput())).toEqual([]);
  });

  it("requires the canonical_* identity block, not the ocf_* one", () => {
    const fm = canonicalFrontmatter();
    delete fm.canonical_title;
    const errs = messages(canonicalInput({ frontmatter: fm }));
    expect(errs).toContain('frontmatter is missing required key "canonical_title"');
    // The OCF identity keys must NOT be demanded of a canonical file.
    expect(errs.some((m) => m.includes("ocf_"))).toBe(false);
  });

  it("flags dotted field names whose def or property does not exist", () => {
    const m = canonicalMapping({ coverage: "6/4" });
    (m.fields as Record<string, unknown>)["Outer.bogus"] = {
      kind: "rename",
      target: "#/$defs/Thing/properties/name",
    };
    (m.fields as Record<string, unknown>)["Missing.x"] = {
      kind: "rename",
      target: "#/$defs/Thing/properties/name",
    };
    const errs = messages(canonicalInput({ mapping: m }));
    expect(errs).toContain("Outer.bogus: is not a property of the source schema");
    expect(errs).toContain("Missing.x: is not a property of the source schema");
  });

  it("excludes unreferenced value-object defs from the coverage universe", () => {
    // Universe is Outer.{id,kind} + Inner.{a,b} = 4; Unreferenced.x is not counted.
    expect(messages(canonicalInput())).toEqual([]);
    const errs = messages(canonicalInput({ mapping: canonicalMapping({ coverage: "4/6" }) }));
    expect(errs.some((m) => m.includes("denominator 6"))).toBe(true);
  });

  it("detects source-side enums through $defs for dotted fields", () => {
    // Outer.kind $refs the color enum; a bad target enum value must be caught,
    // proving the property node was resolved through $defs.
    const m = canonicalMapping();
    (m.fields as Record<string, unknown>)["Outer.kind"] = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/color",
      values: { RED: "red", BLUE: "magenta" },
    };
    const errs = messages(canonicalInput({ mapping: m }));
    expect(errs.some((s) => s.includes('"magenta"'))).toBe(true);
  });
});
