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
    delete fm.ocf_object_type;
    delete fm.last_generated;
    const errs = messages(makeInput({ frontmatter: fm }));
    expect(errs).toContain('frontmatter is missing required key "ocf_object_type"');
    expect(errs).toContain('frontmatter is missing required key "last_generated"');
  });

  it("errors when neither an ocf_ nor canonical_ schema id is declared", () => {
    const fm = frontmatter();
    delete fm.ocf_schema_id;
    const errs = messages(makeInput({ frontmatter: fm }));
    expect(errs.some((m) => m.includes("must declare a source schema"))).toBe(true);
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

  it("requires a policy on select", () => {
    const errs = messages(withField({ kind: "select", target: "#/$defs/Thing/properties/name" }));
    expect(errs.some((m) => m.includes("kind select requires a non-empty policy"))).toBe(true);
    expect(
      messages(
        withField({
          kind: "select",
          target: "#/$defs/Thing/properties/name",
          policy: "legal_name",
          source: "/legal_name",
        })
      )
    ).toEqual([]);
  });

  it("rejects an implicit array-to-scalar rename", () => {
    const input = makeInput({
      sourceSchema: {
        ...SOURCE_SCHEMA,
        properties: { tags: { type: "array", items: { type: "string" } } },
      },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: {
          tags: { kind: "rename", target: "#/$defs/Thing/properties/name" },
        },
      },
    });
    expect(messages(input).some((m) => m.includes("cannot reduce array to scalar"))).toBe(true);
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

  it("accepts a defer placeholder with a note and resolvable targets", () => {
    expect(
      messages(
        withField({
          kind: "rename",
          target: "#/$defs/Thing/properties/name",
          defer: {
            note: "nested content is mappable but not extracted yet",
            targets: ["#/$defs/Thing/properties/color"],
          },
        })
      )
    ).toEqual([]);
  });

  it("rejects a defer that is not a map, a non-string note, or an unresolvable target", () => {
    const base = { kind: "rename", target: "#/$defs/Thing/properties/name" };
    expect(messages(withField({ ...base, defer: "nope" })).some((m) => m.includes("defer:"))).toBe(
      true
    );
    expect(
      messages(withField({ ...base, defer: { note: 5 } })).some((m) => m.includes("defer.note"))
    ).toBe(true);
    expect(
      messages(
        withField({ ...base, defer: { note: "x", targets: ["#/$defs/Nope/properties/y"] } })
      ).some((m) => m.includes("defer target"))
    ).toBe(true);
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

  it("rejects an enum-remap whose target resolves to a non-enum node", () => {
    // #/$defs/Thing/properties/name is a plain string, not an enum. Previously this
    // resolved fine and value-membership checking was silently skipped; now it errors.
    const m = mapping();
    (m.fields as Record<string, unknown>).color = {
      kind: "enum-remap",
      target: "#/$defs/Thing/properties/name",
      values: { RED: "red", BLUE: "blue" },
    };
    const errs = messages(makeInput({ mapping: m }));
    expect(errs.some((s) => /enum-remap target .* must resolve to an enum/.test(s))).toBe(true);
  });
});

describe("validateMapping — coverage and status strictness", () => {
  it("does not require or read a hand-maintained coverage value", () => {
    const m = mapping();
    delete m.coverage;
    expect(messages(makeInput({ mapping: m }))).toEqual([]);

    const stale = mapping({ coverage: "0/999" });
    expect(messages(makeInput({ mapping: stale }))).toEqual([]);
  });

  it("accepts a draft skeleton with TODO kinds and TODO values", () => {
    const input = makeInput({
      frontmatter: frontmatter({ status: "draft", target_standard: "TBD", target_version: "TBD" }),
      mapping: {
        status: "draft",
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

describe("validateMapping — canonical dialect", () => {
  function canonicalFrontmatter(over: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      canonical_schema_id: "test://thing",
      canonical_title: "Thing",
      canonical_kind: "type",
      required_fields: ["name"],
      target_standard: "Carta",
      target_version: "v1alpha1",
      status: "complete",
      last_generated: "2026-06-11",
      ...over,
    };
  }

  const canonicalInput = (over: Partial<ValidateInput> = {}): ValidateInput =>
    makeInput({ file: "canonical/Thing.mapping.md", frontmatter: canonicalFrontmatter(), ...over });

  it("accepts a canonical file declaring canonical_* frontmatter", () => {
    expect(messages(canonicalInput())).toEqual([]);
  });

  it("reports a missing canonical_* key", () => {
    const fm = canonicalFrontmatter();
    delete fm.canonical_title;
    expect(messages(canonicalInput({ frontmatter: fm }))).toContain(
      'frontmatter is missing required key "canonical_title"'
    );
  });

  it("does not demand ocf_* keys of a canonical file", () => {
    expect(messages(canonicalInput()).some((m) => m.includes("ocf_schema_id"))).toBe(false);
  });

  it("does not demand canonical_* keys of an OCF file", () => {
    expect(messages(makeInput()).some((m) => m.includes("canonical_"))).toBe(false);
  });

  it("still requires shared keys in the canonical dialect", () => {
    const fm = canonicalFrontmatter();
    delete fm.last_generated;
    expect(messages(canonicalInput({ frontmatter: fm }))).toContain(
      'frontmatter is missing required key "last_generated"'
    );
  });
});
