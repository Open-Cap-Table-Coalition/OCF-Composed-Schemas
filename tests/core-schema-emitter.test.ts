import { renderNode, emitCoreSchema, CoreEntity } from "../scripts/lib/core-schema-emitter.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

function makeRegistry(entries: RawSchema[]): Registry {
  const r: Registry = new Map();
  for (const e of entries) r.set(e.$id as string, e);
  return r;
}

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
  { $id: "ocf://Enum3", enum: ["A", "B", "C"] },
]);

describe("renderNode — inline OCF grammar", () => {
  it("reuses a shipped pattern (Numeric)", () => {
    expect(renderNode({ $ref: "ocf://Numeric" }, registry)).toEqual({
      type: "string",
      pattern: "^[0-9]+$",
    });
  });

  it("SYNTHESISES a Date pattern (format:date is annotation-only)", () => {
    expect(renderNode({ $ref: "ocf://Date" }, registry)).toEqual({
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    });
  });

  it("does NOT misread a boilerplate-scalar (properties:{}) as an object", () => {
    const node = renderNode({ $ref: "ocf://Numeric" }, registry);
    expect(node.type).toBe("string");
    expect(node.properties).toBeUndefined();
  });

  it("inlines an enum's value set", () => {
    expect(renderNode({ $ref: "ocf://Enum3" }, registry)).toEqual({
      type: "string",
      enum: ["A", "B", "C"],
    });
  });

  it("recurses into a composite type, keeping its required", () => {
    expect(renderNode({ $ref: "ocf://Monetary" }, registry)).toEqual({
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "string", pattern: "^[0-9]+$" },
        currency: { type: "string", pattern: "^[A-Z]{3}$" },
      },
      required: ["amount", "currency"],
    });
  });

  it("renders arrays, recursing into items", () => {
    expect(renderNode({ type: "array", items: { $ref: "ocf://Numeric" } }, registry)).toEqual({
      type: "array",
      items: { type: "string", pattern: "^[0-9]+$" },
    });
  });

  it("unwraps a nullable union to its real branch", () => {
    expect(renderNode({ anyOf: [{ type: "null" }, { $ref: "ocf://Numeric" }] }, registry)).toEqual({
      type: "string",
      pattern: "^[0-9]+$",
    });
  });
});

describe("emitCoreSchema", () => {
  const entities: CoreEntity[] = [
    {
      defName: "StockIssuance__Rsa",
      entity: "StockIssuance",
      variant: "Rsa",
      fields: [{ field: "quantity", srcRaw: { $ref: "ocf://Numeric" } }],
    },
    {
      defName: "Stakeholder",
      entity: "Stakeholder",
      variant: "—",
      fields: [{ field: "name", srcRaw: { type: "string" }, description: "Legal name" }],
    },
  ];

  it("emits one self-contained $def per entity, draft-07, with oneOf", () => {
    const schema = emitCoreSchema(entities, registry) as Record<string, any>;
    expect(schema.$schema).toContain("draft-07");
    expect(Object.keys(schema.$defs).sort()).toEqual(["Stakeholder", "StockIssuance__Rsa"]);
    expect(schema.oneOf).toContainEqual({ $ref: "#/$defs/Stakeholder" });
  });

  it("each $def is closed, with an empty (fold-driven) required set", () => {
    const schema = emitCoreSchema(entities, registry) as Record<string, any>;
    const def = schema.$defs.StockIssuance__Rsa;
    expect(def).toMatchObject({ type: "object", additionalProperties: false, required: [] });
    expect(def.properties.quantity).toEqual({ type: "string", pattern: "^[0-9]+$" });
  });

  it("carries a field description through onto the rendered node", () => {
    const schema = emitCoreSchema(entities, registry) as Record<string, any>;
    expect(schema.$defs.Stakeholder.properties.name.description).toBe("Legal name");
  });

  it("contains no external $ref (everything inlined)", () => {
    const schema = emitCoreSchema(entities, registry);
    const json = JSON.stringify(schema);
    // The only $refs allowed are the top-level oneOf pointers into #/$defs.
    const externalRef = /"\$ref":"(?!#\/\$defs\/)/.test(json);
    expect(externalRef).toBe(false);
  });
});
