import { renderMappingReport } from "../scripts/lib/mapping-report.js";

describe("renderMappingReport", () => {
  it("derives coverage from the source schema when one is provided", () => {
    const out = renderMappingReport({
      file: "types/Derived.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "partial",
        coverage: "0/999",
        fields: { a: { kind: "rename", target: "#/a" } },
      },
      sourceSchema: {
        $id: "test://derived",
        properties: { a: { type: "string" }, b: { type: "string" } },
      },
    });
    expect(out).toBe("types/Derived.mapping.md  partial 1/2 → Carta\n└── a → #/a (rename)");
  });

  it("renders the full worked example exactly", () => {
    const out = renderMappingReport({
      file: "objects/Stakeholder.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "partial",
        coverage: "3/14",
        fields: {
          name: { kind: "rename", target: "#/$defs/Stakeholder/properties/name" },
          stakeholder_type: {
            kind: "enum-remap",
            target: "#/$defs/StakeholderType",
            values: { INDIVIDUAL: "NATURAL_PERSON", INSTITUTION: null },
          },
          address: {
            kind: "split",
            target: [
              "#/$defs/StakeholderAddress/properties/street",
              "#/$defs/StakeholderAddress/properties/city",
            ],
          },
          ...Object.fromEntries(
            Array.from({ length: 11 }, (_, i) => [`todo${i}`, { kind: "TODO", target: "TODO" }])
          ),
        },
      },
    });
    expect(out).toBe(
      [
        "objects/Stakeholder.mapping.md  partial 3/14 → Carta",
        "├── name → #/$defs/Stakeholder/properties/name (rename)",
        "├── stakeholder_type → #/$defs/StakeholderType (enum-remap)",
        "│   ├── INDIVIDUAL → NATURAL_PERSON",
        "│   └── INSTITUTION ✗ dropped",
        "├── address (split)",
        "│   ├── #/$defs/StakeholderAddress/properties/street",
        "│   └── #/$defs/StakeholderAddress/properties/city",
        "└── 11 fields TODO",
      ].join("\n")
    );
  });

  it("indents the last split item's children with spaces", () => {
    const out = renderMappingReport({
      file: "objects/X.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: {
          address: { kind: "split", target: ["#/$defs/A", "#/$defs/B"] },
        },
      },
    });
    expect(out).toBe(
      [
        "objects/X.mapping.md  complete 1/1 → Carta",
        "└── address (split)",
        "    ├── #/$defs/A",
        "    └── #/$defs/B",
      ].join("\n")
    );
  });

  it("renders all-TODO file as header + suffix only", () => {
    const out = renderMappingReport({
      file: "objects/Y.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "draft",
        coverage: "0/3",
        fields: {
          a: { kind: "TODO", target: "TODO" },
          b: { kind: "TODO", target: "TODO" },
          c: { kind: "TODO", target: "TODO" },
        },
      },
    });
    expect(out).toBe("objects/Y.mapping.md  draft 0/3 → Carta (3 fields TODO)");
  });

  it("renders singular '1 field TODO' for all-TODO with one field", () => {
    const out = renderMappingReport({
      file: "objects/Z.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: { status: "draft", coverage: "0/1", fields: { a: { kind: "TODO" } } },
    });
    expect(out).toBe("objects/Z.mapping.md  draft 0/1 → Carta (1 field TODO)");
  });

  it("renders zero-field file as header only", () => {
    const out = renderMappingReport({
      file: "types/Empty.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: { status: "complete", coverage: "0/0", fields: {} },
    });
    expect(out).toBe("types/Empty.mapping.md  complete 0/0 → Carta");
  });

  it("renders fields: null as header only", () => {
    const out = renderMappingReport({
      file: "types/Null.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: { status: "complete", coverage: "0/0", fields: null },
    });
    expect(out).toBe("types/Null.mapping.md  complete 0/0 → Carta");
  });

  it("uses singular for mixed with one TODO", () => {
    const out = renderMappingReport({
      file: "objects/M.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "partial",
        coverage: "1/2",
        fields: {
          a: { kind: "rename", target: "#/x" },
          b: { kind: "TODO" },
        },
      },
    });
    expect(out).toBe(
      [
        "objects/M.mapping.md  partial 1/2 → Carta",
        "├── a → #/x (rename)",
        "└── 1 field TODO",
      ].join("\n")
    );
  });

  it("renders unmappable with reason", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: { kind: "unmappable", reason: "no analog" } },
      },
    });
    expect(out).toBe(["f.md  complete 1/1 → Carta", "└── a ✗ unmappable: no analog"].join("\n"));
  });

  it("renders unmappable without reason", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: { kind: "unmappable" } },
      },
    });
    expect(out).toBe(["f.md  complete 1/1 → Carta", "└── a ✗ unmappable"].join("\n"));
  });

  it("renders an enum value of TODO as KEY → TODO", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "draft",
        coverage: "0/1",
        fields: { e: { kind: "enum-remap", target: "#/T", values: { A: "TODO" } } },
      },
    });
    expect(out).toBe(
      ["f.md  draft 0/1 → Carta", "└── e → #/T (enum-remap)", "    └── A → TODO"].join("\n")
    );
  });

  it("renders enum-remap with missing values as no children", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "draft",
        coverage: "0/1",
        fields: { e: { kind: "enum-remap", target: "#/T" } },
      },
    });
    expect(out).toBe(["f.md  draft 0/1 → Carta", "└── e → #/T (enum-remap)"].join("\n"));
  });

  it("renders computed, combine, and rename one-liners", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "3/3",
        fields: {
          a: { kind: "rename", target: "#/a" },
          b: { kind: "computed", target: "#/b" },
          c: { kind: "combine", target: "#/c" },
        },
      },
    });
    expect(out).toBe(
      [
        "f.md  complete 3/3 → Carta",
        "├── a → #/a (rename)",
        "├── b → #/b (computed)",
        "└── c → #/c (combine)",
      ].join("\n")
    );
  });

  it("renders non-string target as ?", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: { kind: "rename", target: 42 } },
      },
    });
    expect(out).toBe(["f.md  complete 1/1 → Carta", "└── a → ? (rename)"].join("\n"));
  });

  it("renders non-array split target with no children", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: { kind: "split", target: "#/x" } },
      },
    });
    expect(out).toBe(["f.md  complete 1/1 → Carta", "└── a → ? (split)"].join("\n"));
  });

  it("renders non-string split elements as ?", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: { kind: "split", target: ["#/x", 3] } },
      },
    });
    expect(out).toBe(
      ["f.md  complete 1/1 → Carta", "└── a (split)", "    ├── #/x", "    └── ?"].join("\n")
    );
  });

  it("renders an unknown kind with a warning line", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: { kind: "weird" } },
      },
    });
    expect(out).toBe(["f.md  complete 1/1 → Carta", "└── a ⚠ kind: weird"].join("\n"));
  });

  it("renders a non-object entry with a malformed warning line", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "complete",
        coverage: "1/1",
        fields: { a: "oops" },
      },
    });
    expect(out).toBe(["f.md  complete 1/1 → Carta", "└── a ⚠ malformed entry"].join("\n"));
  });

  it("renders ? for missing status, coverage, target_standard", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: {},
      mapping: { fields: { a: { kind: "rename", target: "#/a" } } },
    });
    expect(out).toBe(["f.md  ? ? → ?", "└── a → #/a (rename)"].join("\n"));
  });

  it("renders ? when status/coverage/target are non-strings", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: 5 },
      mapping: { status: 1, coverage: ["x"], fields: {} },
    });
    expect(out).toBe("f.md  ? ? → ?");
  });

  it("treats non-object fields as empty", () => {
    const out = renderMappingReport({
      file: "f.md",
      frontmatter: { target_standard: "Carta" },
      mapping: { status: "complete", coverage: "0/0", fields: "nope" },
    });
    expect(out).toBe("f.md  complete 0/0 → Carta");
  });

  it("never ends with a trailing newline", () => {
    const out = renderMappingReport({
      file: "objects/Stakeholder.mapping.md",
      frontmatter: { target_standard: "Carta" },
      mapping: {
        status: "partial",
        coverage: "3/14",
        fields: {
          name: { kind: "rename", target: "#/n" },
          t: { kind: "TODO" },
        },
      },
    });
    expect(out.endsWith("\n")).toBe(false);
  });
});
