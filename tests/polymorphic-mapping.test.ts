import { validateMapping, ValidateInput } from "../scripts/lib/mapping-validator.js";
import { renderMappingReport } from "../scripts/lib/mapping-report.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

// A miniature polymorphic mapping: one route property (comp_type ∈ {OPT, RSU})
// routes one OCF transaction to two Carta families.
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
    route_by_property: { property: "comp_type", from: "self", exhaustive: true },
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
    route_by_property: {
      property: "comp_type",
      from: {
        via: "security_id",
        mapping: "../issuance/EquityComp.mapping.md",
      },
      enum: "test://comptype", // registry-resolvable enum the variants must cover
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

describe("polymorphic mapping — route_by_property", () => {
  it("accepts a valid issuance polymorphic mapping", () => {
    expect(messages(input())).toEqual([]);
  });

  it("rejects a route property that is not a source property", () => {
    const m = issuanceMapping({
      route_by_property: { property: "nope", from: "self", exhaustive: true },
    });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /route_by_property.*"nope".*not a property/i.test(s))).toBe(true);
  });

  it("rejects a route property that is not enum-typed", () => {
    const m = issuanceMapping({
      route_by_property: { property: "quantity", from: "self", exhaustive: true },
    });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /route_by_property.*enum/i.test(s))).toBe(true);
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

  it("does not require or read hand-maintained per-variant coverage", () => {
    const withoutCoverage = issuanceMapping();
    delete withoutCoverage.coverage;
    expect(messages(input({ mapping: withoutCoverage }))).toEqual([]);

    const stale = issuanceMapping({ coverage: { Option: "0/999", Rsu: "0/999" } });
    expect(messages(input({ mapping: stale }))).toEqual([]);
  });
});

describe("entry note: field (corner-case annotation)", () => {
  it("accepts an optional string note on an entry", () => {
    const m = issuanceMapping();
    (m.variants as { Option: { fields: Record<string, unknown> } }).Option.fields.comp_type = {
      kind: "unmappable",
      target: null,
      reason: "no-equivalent",
      note: "RSU/CSAR/SSAR route to the Rsu/Sar variants — round-trip preserved",
    };
    expect(messages(input({ mapping: m }))).toEqual([]);
  });

  it("rejects a non-string note", () => {
    const m = issuanceMapping();
    (m.variants as { Option: { fields: Record<string, unknown> } }).Option.fields.comp_type = {
      kind: "unmappable",
      target: null,
      reason: "no-equivalent",
      note: 123,
    };
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /note.*must be a string/i.test(s))).toBe(true);
  });

  it("renders an entry note in the verbose report", () => {
    const m = issuanceMapping();
    (m.variants as { Option: { fields: Record<string, unknown> } }).Option.fields.exercise_price = {
      kind: "rename",
      target: "#/$defs/OptionTx/properties/exercisePrice",
      note: "see also the Sar variant for base_price",
    };
    const out = renderMappingReport({
      file: "f.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: m,
    });
    expect(out).toContain("see also the Sar variant for base_price");
  });
});

describe("routed_to: (verified round-trip edges)", () => {
  function withRoutedTo(routed_to: unknown): ValidateInput {
    const m = issuanceMapping();
    (m.variants as { Option: { fields: Record<string, unknown> } }).Option.fields.comp_type = {
      kind: "unmappable",
      target: null,
      reason: "no-equivalent",
      routed_to,
    };
    return input({ mapping: m });
  }

  it("accepts a routed_to edge to the variant that actually claims the value", () => {
    // RSU is dropped in the Option variant but claimed by the Rsu variant (when: [RSU]).
    expect(messages(withRoutedTo({ RSU: "Rsu" }))).toEqual([]);
  });

  it("rejects routed_to pointing at a non-existent variant", () => {
    const errs = messages(withRoutedTo({ RSU: "Nope" }));
    expect(errs.some((s) => /routed_to.*"Nope".*no such variant/i.test(s))).toBe(true);
  });

  it("rejects routed_to to a variant that does NOT claim the value (route isn't real)", () => {
    // routing RSU to the Option variant is false — Option claims only OPT.
    const errs = messages(withRoutedTo({ RSU: "Option" }));
    expect(errs.some((s) => /routed_to.*RSU.*Option.*does not claim/i.test(s))).toBe(true);
  });

  it("rejects a routed_to key that is not a value of the routed enum", () => {
    const errs = messages(withRoutedTo({ BOGUS: "Rsu" }));
    expect(errs.some((s) => /routed_to key "BOGUS".*not a value of the routed enum/i.test(s))).toBe(
      true
    );
  });

  it("rejects a non-map routed_to", () => {
    const errs = messages(withRoutedTo("Rsu"));
    expect(errs.some((s) => /routed_to.*must be a map/i.test(s))).toBe(true);
  });

  it("renders a routed_to value with the destination variant's Carta targets", () => {
    const out = renderMappingReport({
      file: "f.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        route_by_property: { property: "comp_type", from: "self", exhaustive: true },
        variants: {
          Option: {
            when: ["OPT"],
            primary_targets: ["#/$defs/OptionTx"],
            fields: {
              comp_type: {
                kind: "enum-remap",
                target: "#/$defs/OptionGrant/properties/kind",
                values: { OPT: "A", RSU: null },
                routed_to: { RSU: "Rsu" },
              },
            },
          },
          Rsu: { when: ["RSU"], primary_targets: ["#/$defs/RsuTx"], fields: {} },
        },
        coverage: { Option: "1/1", Rsu: "1/1" },
      },
    });
    expect(out).toContain('RSU → routed to "Rsu" variant: #/$defs/RsuTx');
    expect(out).not.toMatch(/RSU ✗ dropped/);
  });
});

describe("per-variant target maps (divergent shared targets)", () => {
  // A shared field whose Carta home differs per variant: instead of pinning it to
  // one representative family, target: is a { variantLabel → pointer|null } map.
  const BOTH = {
    Option: "#/$defs/OptionTx/properties/quantity",
    Rsu: "#/$defs/RsuTx/properties/quantity",
  };

  function withSharedQuantity(
    target: unknown,
    over: Record<string, unknown> = {}
  ): Record<string, unknown> {
    return issuanceMapping({ shared: { quantity: { kind: "rename", target } }, ...over });
  }

  it("accepts a per-variant target map that covers every variant", () => {
    expect(messages(input({ mapping: withSharedQuantity(BOTH) }))).toEqual([]);
  });

  it("rejects a per-variant target map that is missing a variant (keys must stay in sync)", () => {
    const m = withSharedQuantity({ Option: "#/$defs/OptionTx/properties/quantity" });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /target map is missing variant "Rsu"/i.test(s))).toBe(true);
  });

  it("rejects a per-variant target map with an unknown variant key", () => {
    const m = withSharedQuantity({ ...BOTH, Bogus: "#/$defs/RsuTx/properties/quantity" });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /target map key "Bogus" is not a variant/i.test(s))).toBe(true);
  });

  it("rejects a per-variant target value that does not resolve", () => {
    const m = withSharedQuantity({
      Option: "#/$defs/OptionTx/properties/quantity",
      Rsu: "#/$defs/Nope",
    });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /quantity/.test(s) && /does not resolve/.test(s))).toBe(true);
  });

  it("rejects a per-variant target value that is neither a pointer nor null", () => {
    const m = withSharedQuantity({ Option: "#/$defs/OptionTx/properties/quantity", Rsu: 42 });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /quantity/.test(s) && /pointer or null/i.test(s))).toBe(true);
  });

  it("accepts null for a variant (field unmappable in that variant only)", () => {
    const m = withSharedQuantity({ Option: "#/$defs/OptionTx/properties/quantity", Rsu: null });
    expect(messages(input({ mapping: m }))).toEqual([]);
  });

  it("treats a null per-variant target as a covered (non-TODO) entry", () => {
    const m = withSharedQuantity({ Option: "#/$defs/OptionTx/properties/quantity", Rsu: null });
    expect(messages(input({ mapping: m }))).toEqual([]);
  });

  it("rejects a per-variant target map on an enum-remap entry", () => {
    const m = issuanceMapping({ shared: { quantity: { kind: "enum-remap", target: BOTH } } });
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /per-variant target map.*enum-remap/i.test(s))).toBe(true);
  });

  it("rejects a per-variant target map used in variants.fields (shared-only)", () => {
    const m = issuanceMapping();
    (m.variants as { Option: { fields: Record<string, unknown> } }).Option.fields.exercise_price = {
      kind: "rename",
      target: BOTH,
    };
    const errs = messages(input({ mapping: m }));
    expect(errs.some((s) => /per-variant target map.*only valid on shared/i.test(s))).toBe(true);
  });

  it("renders each variant's target (or ✗) under the shared field in the verbose report", () => {
    const out = renderMappingReport({
      file: "f.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        route_by_property: { property: "comp_type", from: "self", exhaustive: true },
        shared: {
          quantity: {
            kind: "rename",
            target: { Option: "#/$defs/OptionTx/properties/quantity", Rsu: null },
          },
        },
        variants: {
          Option: { when: ["OPT"], primary_targets: ["#/$defs/OptionTx"], fields: {} },
          Rsu: { when: ["RSU"], primary_targets: ["#/$defs/RsuTx"], fields: {} },
        },
        coverage: { Option: "1/1", Rsu: "1/1" },
      },
    });
    expect(out).toContain("Option → #/$defs/OptionTx/properties/quantity");
    expect(out).toContain("Rsu ✗ unmappable");
    expect(out).not.toMatch(/quantity → \? \(rename\)/);
  });
});

describe("polymorphic mapping — downstream (route_by_property)", () => {
  function dinput(over: Partial<ValidateInput> = {}): ValidateInput {
    return input({
      file: "objects/transactions/exercise/ECExercise.mapping.md",
      mapping: downstreamMapping(),
      sourceSchema: DOWNSTREAM_SOURCE,
      ...over,
    });
  }

  it("accepts a valid route_by_property mapping", () => {
    expect(messages(dinput())).toEqual([]);
  });

  it("rejects a route_by_property.from.via that is not a source property", () => {
    const m = downstreamMapping({
      route_by_property: {
        property: "comp_type",
        from: { via: "nope", mapping: "x" },
      },
    });
    const errs = messages(dinput({ mapping: m }));
    expect(errs.some((s) => /route_by_property.*"nope".*not a property/i.test(s))).toBe(true);
  });

  it("the verbose report shows per-variant routes (not just a bare '?' coverage)", () => {
    const out = renderMappingReport({
      file: "objects/transactions/issuance/EquityComp.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: issuanceMapping(),
    });
    expect(out).toContain("polymorphic");
    expect(out).toContain("route_by_property: comp_type (self)");
    expect(out).toContain("shared (1)"); // shared fields shown once
    expect(out).toContain("Option (3/3)");
    expect(out).toContain("#/$defs/OptionGrant"); // variant primary_target
    // a per-variant route line, rendered with the same grammar as simple mappings:
    expect(out).toContain("exercise_price → #/$defs/OptionTx/properties/exercisePrice (rename)");
    expect(out).toMatch(/comp_type ✗ unmappable/); // unmappable route shown
    expect(out).not.toMatch(/complete \? →/);
  });

  it("rejects a route_by_property missing property/from.mapping", () => {
    const m = downstreamMapping({
      route_by_property: {
        from: { via: "security_id" },
        enum: "test://comptype",
      },
    });
    const errs = messages(dinput({ mapping: m }));
    expect(errs.some((s) => /route_by_property.*(property|from\.mapping)/i.test(s))).toBe(true);
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

  it("rejects the removed discriminator key", () => {
    const m = issuanceMapping();
    delete m.route_by_property;
    m.discriminator = { field: "comp_type", exhaustive: true };
    const errs = messages(input({ mapping: m }));
    expect(
      errs.some((s) => /unsupported routing key.*discriminator.*route_by_property/i.test(s))
    ).toBe(true);
  });

  it("renders joined route_by_property as property plus relationship", () => {
    const out = renderMappingReport({
      file: "objects/transactions/exercise/ECExercise.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: downstreamMapping(),
    });
    expect(out).toContain("route_by_property: comp_type (via security_id)");
  });

  it("rejects the removed route_by_security key", () => {
    const m = downstreamMapping();
    delete m.route_by_property;
    m.route_by_security = {};
    const errs = messages(dinput({ mapping: m }));
    expect(
      errs.some((s) => /unsupported routing key.*route_by_security.*route_by_property/i.test(s))
    ).toBe(true);
  });
});

// A miniature of the StockTransfer composite: one OCF transaction folds into an
// ordered pair of Carta transactions (cancel + issue, both emitted), keyed by step
// id, whose targets diverge by family. const captures the fixed reason enums.
const COMPOSITE_BUNDLE = {
  $defs: {
    ...BUNDLE.$defs,
    CancelTx: {
      type: "object",
      properties: { quantity: { type: "number" }, reason: { $ref: "#/$defs/CancelReason" } },
    },
    IssueTx: {
      type: "object",
      properties: {
        quantity: { type: "number" },
        issuanceReason: { $ref: "#/$defs/IssueReason" },
      },
    },
    CancelReason: { enum: ["CANCELED", "TRANSFERRED"] },
    IssueReason: { enum: ["ISSUED", "TRANSFERRED"] },
  },
};

function compositeMapping(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    status: "complete",
    route_by_property: {
      property: "comp_type",
      from: { via: "security_id", mapping: "../issuance/EquityComp.mapping.md" },
      enum: "test://comptype",
      exhaustive: true,
    },
    composite: [
      {
        step: "cancel",
        target: { Option: "#/$defs/CancelTx", Rsu: "#/$defs/CancelTx" },
        const: { Option: { reason: "TRANSFERRED" } },
      },
      {
        step: "issue",
        target: { Option: "#/$defs/IssueTx", Rsu: "#/$defs/IssueTx" },
        const: { Option: { issuanceReason: "TRANSFERRED" } },
      },
    ],
    shared: {
      // per-STEP, per-family target map: the single source property lands on both
      // step transactions' quantity, keyed by step then family.
      security_id: {
        kind: "rename",
        target: {
          cancel: {
            Option: "#/$defs/CancelTx/properties/quantity",
            Rsu: "#/$defs/CancelTx/properties/quantity",
          },
          issue: {
            Option: "#/$defs/IssueTx/properties/quantity",
            Rsu: "#/$defs/IssueTx/properties/quantity",
          },
        },
      },
    },
    variants: {
      Option: { when: ["OPT"], primary_targets: null, fields: {} },
      Rsu: { when: ["RSU"], primary_targets: null, fields: {} },
    },
    coverage: { Option: "1/1", Rsu: "1/1" },
    ...over,
  };
}

describe("composite: (one OCF transaction → an ordered set of Carta steps)", () => {
  function cinput(over: Partial<ValidateInput> = {}): ValidateInput {
    return input({
      file: "objects/transactions/transfer/EC.mapping.md",
      mapping: compositeMapping(),
      sourceSchema: DOWNSTREAM_SOURCE,
      targetBundle: COMPOSITE_BUNDLE,
      ...over,
    });
  }

  it("accepts a valid composite mapping (per-family step targets + const + per-step field map)", () => {
    expect(messages(cinput())).toEqual([]);
  });

  it("rejects a composite step whose target does not resolve", () => {
    const m = compositeMapping();
    (m.composite as { target: unknown }[])[0]!.target = {
      Option: "#/$defs/Nope",
      Rsu: "#/$defs/CancelTx",
    };
    const errs = messages(cinput({ mapping: m }));
    expect(errs.some((s) => /composite step "cancel".*does not resolve/i.test(s))).toBe(true);
  });

  it("rejects duplicate step ids", () => {
    const m = compositeMapping();
    (m.composite as { step: string }[])[1]!.step = "cancel";
    const errs = messages(cinput({ mapping: m }));
    expect(errs.some((s) => /step id "cancel" is declared more than once/i.test(s))).toBe(true);
  });

  it("rejects an empty composite block", () => {
    const errs = messages(cinput({ mapping: compositeMapping({ composite: [] }) }));
    expect(errs.some((s) => /composite.*at least one step/i.test(s))).toBe(true);
  });

  it("rejects a const value that is not a member of the target enum", () => {
    const m = compositeMapping();
    (m.composite as { const: unknown }[])[0]!.const = { Option: { reason: "BOGUS" } };
    const errs = messages(cinput({ mapping: m }));
    expect(
      errs.some((s) => /const\.reason = "BOGUS".*not a member of the target enum/i.test(s))
    ).toBe(true);
  });

  it("rejects a const on a property the step's $def does not have", () => {
    const m = compositeMapping();
    (m.composite as { const: unknown }[])[0]!.const = { Option: { nope: "TRANSFERRED" } };
    const errs = messages(cinput({ mapping: m }));
    expect(errs.some((s) => /const\.nope has no property/i.test(s))).toBe(true);
  });

  it("rejects a composite step target keyed by an unknown variant", () => {
    const m = compositeMapping();
    (m.composite as { target: Record<string, unknown> }[])[0]!.target.Bogus = "#/$defs/CancelTx";
    const errs = messages(cinput({ mapping: m }));
    expect(
      errs.some((s) => /composite step "cancel" target key "Bogus" is not a variant/i.test(s))
    ).toBe(true);
  });

  it("validates a per-step field target map's inner pointers (a bad one errors)", () => {
    const m = compositeMapping();
    (
      m.shared as { security_id: { target: { issue: Record<string, unknown> } } }
    ).security_id.target.issue.Rsu = "#/$defs/Nope";
    const errs = messages(cinput({ mapping: m }));
    expect(
      errs.some((s) => /security_id/.test(s) && /step "issue".*"Rsu".*does not resolve/i.test(s))
    ).toBe(true);
  });

  it("rejects a per-step field target map with an unknown inner variant", () => {
    const m = compositeMapping();
    (m.shared as { security_id: { target: { issue: unknown } } }).security_id.target.issue = {
      Option: "#/$defs/IssueTx/properties/quantity",
      Bogus: "#/$defs/IssueTx/properties/quantity",
    };
    const errs = messages(cinput({ mapping: m }));
    expect(errs.some((s) => /step "issue" target key "Bogus" is not a variant/i.test(s))).toBe(
      true
    );
  });

  it("rejects composite: in a non-polymorphic mapping (no variants)", () => {
    const m = {
      status: "complete",
      composite: [{ step: "cancel", target: "#/$defs/CancelTx" }],
      fields: { security_id: { kind: "unmappable", target: null, reason: "no-equivalent" } },
      coverage: "1/1",
    };
    const errs = messages(cinput({ mapping: m }));
    expect(
      errs.some((s) =>
        /composite.*only supported alongside.*route_by_property \+ variants/i.test(s)
      )
    ).toBe(true);
  });
});

describe("field-level const (fixed values on the target object)", () => {
  // A shared per-family field (the lineage precededBy) that also carries a fixed
  // `reason` its target object always takes — the "known constant into the final obj".
  function fieldConstMapping(over: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      status: "complete",
      route_by_property: {
        property: "comp_type",
        from: { via: "security_id", mapping: "x" },
        enum: "test://comptype",
        exhaustive: true,
      },
      shared: {
        security_id: {
          kind: "computed",
          target: {
            Option: "#/$defs/CancelTx/properties/quantity",
            Rsu: "#/$defs/IssueTx/properties/quantity",
          },
          const: { Option: { reason: "TRANSFERRED" } },
        },
      },
      variants: {
        Option: { when: ["OPT"], primary_targets: null, fields: {} },
        Rsu: { when: ["RSU"], primary_targets: null, fields: {} },
      },
      coverage: { Option: "1/1", Rsu: "1/1" },
      ...over,
    };
  }

  function fcInput(over: Partial<ValidateInput> = {}): ValidateInput {
    return input({
      file: "objects/transactions/transfer/EC.mapping.md",
      mapping: fieldConstMapping(),
      sourceSchema: DOWNSTREAM_SOURCE,
      targetBundle: COMPOSITE_BUNDLE,
      ...over,
    });
  }

  it("accepts a field const whose value is a member of the target-object enum", () => {
    expect(messages(fcInput())).toEqual([]);
  });

  it("rejects a field const value that is not a member of the target enum", () => {
    const m = fieldConstMapping();
    (m.shared as { security_id: { const: unknown } }).security_id.const = {
      Option: { reason: "BOGUS" },
    };
    const errs = messages(fcInput({ mapping: m }));
    expect(
      errs.some((s) => /field "security_id" const\.reason = "BOGUS".*not a member/i.test(s))
    ).toBe(true);
  });
});
