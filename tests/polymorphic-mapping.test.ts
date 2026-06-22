import { validateMapping, ValidateInput } from "../scripts/lib/mapping-validator.js";
import { renderMappingReport } from "../scripts/lib/mapping-report.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

// A miniature of the EquityCompensationIssuance polymorphism: a discriminator
// (comp_type ∈ {OPT, RSU}) routes one OCF transaction to two Carta families.
const BUNDLE = {
  $defs: {
    OptionTx: {
      type: "object",
      properties: { quantity: { type: "number" }, exercisePrice: { type: "string" } },
    },
    OptionGrant: { type: "object", properties: { stakeholderId: { type: "string" } } },
    RsuTx: { type: "object", properties: { quantity: { type: "number" } } },
    Excluded: true,
  },
};

const SOURCE: RawSchema = {
  $id: "test://equitycomp",
  title: "EquityComp",
  properties: {
    comp_type: { $ref: "test://comptype" },
    quantity: { type: "number" },
    exercise_price: { type: "string" },
  },
};

const REGISTRY: Registry = new Map([
  ["test://comptype", { $id: "test://comptype", enum: ["OPT", "RSU"] }],
]);

function frontmatter(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ocf_schema_id: "test://equitycomp",
    ocf_object_type: null,
    ocf_title: "EquityComp",
    ocf_kind: "object",
    required_fields: [],
    target_standard: "Carta",
    target_version: "v1",
    status: "complete",
    last_generated: "2026-06-22",
    ...over,
  };
}

function issuanceMapping(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    status: "complete",
    discriminator: { field: "comp_type", exhaustive: true },
    shared: {
      quantity: { kind: "rename", target: "#/$defs/OptionTx/properties/quantity" },
    },
    variants: {
      Option: {
        when: ["OPT"],
        primary_targets: ["#/$defs/OptionTx", "#/$defs/OptionGrant"],
        fields: {
          comp_type: { kind: "unmappable", target: null, reason: "no-equivalent" },
          exercise_price: { kind: "rename", target: "#/$defs/OptionTx/properties/exercisePrice" },
        },
      },
      Rsu: {
        when: ["RSU"],
        primary_targets: ["#/$defs/RsuTx"],
        fields: {
          comp_type: { kind: "unmappable", target: null, reason: "no-equivalent" },
          exercise_price: { kind: "unmappable", target: null, reason: "no-equivalent" },
        },
      },
    },
    coverage: { Option: "3/3", Rsu: "3/3" },
    ...over,
  };
}

function downstreamMapping(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    status: "complete",
    route_by_security: {
      via: "security_id",
      resolve: "comp_type",
      resolve_enum: "test://comptype", // registry-resolvable enum the variants must cover
      source_mapping: "../issuance/EquityComp.mapping.md",
      exhaustive: true,
    },
    variants: {
      Option: {
        when: ["OPT"],
        primary_targets: ["#/$defs/OptionTx"],
        fields: { security_id: { kind: "rename", target: "#/$defs/OptionTx/properties/quantity" } },
      },
      Rsu: {
        when: ["RSU"],
        primary_targets: ["#/$defs/RsuTx"],
        fields: { security_id: { kind: "rename", target: "#/$defs/RsuTx/properties/quantity" } },
      },
    },
    coverage: { Option: "1/1", Rsu: "1/1" },
    ...over,
  };
}

const DOWNSTREAM_SOURCE: RawSchema = {
  $id: "test://ec-exercise",
  title: "ECExercise",
  properties: { security_id: { type: "string" } },
};

function input(over: Partial<ValidateInput> = {}): ValidateInput {
  return {
    file: "objects/transactions/issuance/EquityComp.mapping.md",
    frontmatter: frontmatter(),
    mapping: issuanceMapping(),
    sourceSchema: SOURCE,
    registry: REGISTRY,
    targetBundle: BUNDLE,
    ...over,
  };
}

function messages(inp: ValidateInput, requireUnmappableReason = true): string[] {
  return validateMapping(inp, { requireUnmappableReason }).map((e) =>
    e.field ? `${e.field}: ${e.message}` : e.message
  );
}

describe("polymorphic mapping — issuance (discriminator + variants)", () => {
  it("accepts a valid issuance polymorphic mapping", () => {
    expect(messages(input())).toEqual([]);
  });

  it("rejects a discriminator field that is not a source property", () => {
    const m = issuanceMapping({ discriminator: { field: "nope", exhaustive: true } });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /discriminator.*"nope".*not a property/i.test(s))).toBe(true);
  });

  it("rejects a discriminator field that is not enum-typed", () => {
    const m = issuanceMapping({ discriminator: { field: "quantity", exhaustive: true } });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /discriminator.*enum/i.test(s))).toBe(true);
  });

  it("rejects variants that do not cover every enum value when exhaustive", () => {
    const m = issuanceMapping();
    delete (m.variants as Record<string, unknown>).Rsu; // drops the RSU value
    (m.coverage as Record<string, unknown>) = { Option: "3/3" };
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /enum value "RSU" is not claimed/i.test(s))).toBe(true);
  });

  it("rejects an enum value claimed by more than one variant", () => {
    const m = issuanceMapping();
    (m.variants as { Rsu: { when: string[] } }).Rsu.when = ["RSU", "OPT"]; // OPT now in both
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /"OPT" is claimed by more than one variant/i.test(s))).toBe(true);
  });

  it("rejects a variant primary_target that does not resolve", () => {
    const m = issuanceMapping();
    (m.variants as { Rsu: { primary_targets: string[] } }).Rsu.primary_targets = [
      "#/$defs/DoesNotExist",
    ];
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /primary_target.*does not resolve/i.test(s))).toBe(true);
  });

  it("rejects a primary_target that resolves to the excluded `true` sentinel", () => {
    const m = issuanceMapping();
    (m.variants as { Rsu: { primary_targets: string[] } }).Rsu.primary_targets = [
      "#/$defs/Excluded",
    ];
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /excluded|`true`/i.test(s))).toBe(true);
  });

  it("validates per-variant field targets (a bad target in one variant errors)", () => {
    const m = issuanceMapping();
    (m.variants as { Option: { fields: Record<string, unknown> } }).Option.fields.exercise_price = {
      kind: "rename",
      target: "#/$defs/OptionTx/properties/nope",
    };
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /exercise_price/.test(s) && /does not resolve/.test(s))).toBe(true);
  });

  it("requires every source property to be covered by shared ∪ variant.fields", () => {
    const m = issuanceMapping();
    delete (m.variants as { Rsu: { fields: Record<string, unknown> } }).Rsu.fields.exercise_price; // Rsu now misses a property
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /exercise_price/.test(s) && /missing/i.test(s))).toBe(true);
  });

  it("rejects per-variant coverage whose denominator disagrees with the property count", () => {
    const m = issuanceMapping({ coverage: { Option: "3/3", Rsu: "3/4" } });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /Rsu/.test(s) && /denominator/i.test(s))).toBe(true);
  });

  it("rejects a missing per-variant coverage entry", () => {
    const m = issuanceMapping({ coverage: { Option: "3/3" } });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /coverage.*Rsu/i.test(s))).toBe(true);
  });

  it("rejects a string coverage on a polymorphic mapping", () => {
    const m = issuanceMapping({ coverage: "3/3" });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /coverage/i.test(s))).toBe(true);
  });
});

describe("polymorphic mapping — downstream (route_by_security)", () => {
  function dinput(over: Partial<ValidateInput> = {}): ValidateInput {
    return input({
      file: "objects/transactions/exercise/ECExercise.mapping.md",
      mapping: downstreamMapping(),
      sourceSchema: DOWNSTREAM_SOURCE,
      ...over,
    });
  }

  it("accepts a valid route_by_security mapping", () => {
    expect(messages(dinput())).toEqual([]);
  });

  it("rejects a route_by_security.via that is not a source property", () => {
    const m = downstreamMapping({
      route_by_security: { via: "nope", resolve: "comp_type", source_mapping: "x" },
    });
    const errs = messages(dinput({ mapping: m }));
    expect(errs.some((s) => /route_by_security.*"nope".*not a property/i.test(s))).toBe(true);
  });

  it("the verbose report shows per-variant routes (not just a bare '?' coverage)", () => {
    const out = renderMappingReport({
      file: "objects/transactions/issuance/EquityComp.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: issuanceMapping(),
    });
    expect(out).toContain("polymorphic");
    expect(out).toContain("discriminator: comp_type");
    expect(out).toContain("shared (1)"); // shared fields shown once
    expect(out).toContain("Option (3/3)");
    expect(out).toContain("#/$defs/OptionGrant"); // variant primary_target
    // a per-variant route line, rendered with the same grammar as simple mappings:
    expect(out).toContain("exercise_price → #/$defs/OptionTx/properties/exercisePrice (rename)");
    expect(out).toMatch(/comp_type ✗ unmappable/); // unmappable route shown
    expect(out).not.toMatch(/complete \? →/);
  });

  it("rejects a route_by_security missing resolve/source_mapping", () => {
    const m = downstreamMapping({
      route_by_security: { via: "security_id", resolve_enum: "test://comptype" },
    });
    const errs = messages(dinput({ mapping: m }));
    expect(errs.some((s) => /route_by_security.*(resolve|source_mapping)/i.test(s))).toBe(true);
  });

  it("rejects routes that do not cover every value of the resolved enum (exhaustive)", () => {
    const m = downstreamMapping();
    delete (m.variants as Record<string, unknown>).Rsu; // RSU instrument now unrouted
    (m.coverage as Record<string, unknown>) = { Option: "1/1" };
    const errs = messages(dinput({ mapping: m }));
    expect(errs.some((s) => /enum value "RSU" is not claimed/i.test(s))).toBe(true);
  });

  it("accepts a value explicitly handled by an unroutable variant (primary_targets: null)", () => {
    const m = downstreamMapping();
    (m.variants as Record<string, unknown>).Rsu = {
      when: ["RSU"],
      primary_targets: null, // RSU exercise is invalid — explicitly unroutable, but still claimed
      fields: { security_id: { kind: "unmappable", target: null, reason: "no-equivalent" } },
    };
    expect(messages(dinput({ mapping: m }))).toEqual([]);
  });
});
