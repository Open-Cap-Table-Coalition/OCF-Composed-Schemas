import { renderNode, emitCorePackage, CoreEntity } from "../scripts/lib/core-schema-emitter.js";
import { OcfPackaging } from "../scripts/lib/core-corpus.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";
import { validateSchemaPackage } from "../scripts/lib/core-schema-validation.js";

function makeRegistry(entries: RawSchema[]): Registry {
  const r: Registry = new Map();
  for (const e of entries) r.set(e.$id as string, e);
  return r;
}

const registry = makeRegistry([
  { $id: "ocf://Numeric", type: "string", pattern: "^[0-9]+$", properties: {}, required: [] },
  { $id: "ocf://Date", type: "string", format: "date", properties: {}, required: [] },
  { $id: "ocf://Cur", type: "string", pattern: "^[A-Z]{3}$", properties: {}, required: [] },
  { $id: "ocf://Md5", type: "string", pattern: "^[a-f0-9]{32}$", properties: {}, required: [] },
  {
    $id: "ocf://Monetary",
    type: "object",
    properties: { amount: { $ref: "ocf://Numeric" }, currency: { $ref: "ocf://Cur" } },
    required: ["amount", "currency"],
  } as unknown as RawSchema,
  {
    $id: "ocf://File",
    type: "object",
    properties: { filepath: { type: "string" }, md5: { $ref: "ocf://Md5" } },
    required: ["filepath", "md5"],
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
  it("preserves a const (the object_type discriminator)", () => {
    expect(renderNode({ const: "TX_STOCK_ISSUANCE" }, registry)).toEqual({
      const: "TX_STOCK_ISSUANCE",
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
  it("unwraps a nullable union to its real branch", () => {
    expect(renderNode({ anyOf: [{ type: "null" }, { $ref: "ocf://Numeric" }] }, registry)).toEqual({
      type: "string",
      pattern: "^[0-9]+$",
    });
  });
  it("preserves real unions and their branch constraints", () => {
    expect(
      renderNode(
        {
          oneOf: [{ $ref: "ocf://Enum3" }, { $ref: "ocf://Numeric" }],
        },
        registry
      )
    ).toEqual({
      oneOf: [
        { type: "string", enum: ["A", "B", "C"] },
        { type: "string", pattern: "^[0-9]+$" },
      ],
    });
  });
  it("preserves array/object assertions instead of widening them away", () => {
    const node = renderNode(
      {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: { order: { type: "integer", minimum: 1 } },
          required: ["order"],
          anyOf: [{ required: ["schedule"] }, { required: ["event_condition"] }],
          additionalProperties: false,
        },
      },
      registry
    ) as any;
    expect(node.minItems).toBe(1);
    expect(node.items.properties.order).toEqual({ type: "integer", minimum: 1 });
    expect(node.items.anyOf).toEqual([
      { required: ["schedule"] },
      { required: ["event_condition"] },
    ]);
  });
});

const packaging: OcfPackaging = {
  objectFiles: new Map([
    [
      "StockClass",
      {
        fileType: "OCF_STOCK_CLASSES_FILE",
        collectionKey: "stock_classes_files",
        fileName: "StockClassesFile",
      },
    ],
  ]),
  transactionEntities: new Set(["StockIssuance", "StockCancellation"]),
  transactions: {
    fileType: "OCF_TRANSACTIONS_FILE",
    collectionKey: "transactions_files",
    fileName: "TransactionsFile",
  },
  filePointerId: "ocf://File",
};

const entities: CoreEntity[] = [
  {
    entity: "StockIssuance",
    kind: "event",
    fields: [{ field: "quantity", srcRaw: { $ref: "ocf://Numeric" } }],
  },
  {
    entity: "StockCancellation",
    kind: "event",
    fields: [{ field: "date", srcRaw: { $ref: "ocf://Date" } }],
  },
  { entity: "StockClass", kind: "object", fields: [{ field: "name", srcRaw: { type: "string" } }] },
  {
    entity: "Issuer",
    kind: "object",
    fields: [{ field: "legal_name", srcRaw: { type: "string" } }],
  },
];

describe("emitCorePackage", () => {
  const pkg = emitCorePackage(entities, registry, packaging);

  it("packages events into a TransactionsFile with OCF file_type and oneOf items", () => {
    const tf = pkg.get("files/TransactionsFile.schema.json") as any;
    expect(tf.properties.file_type.const).toBe("OCF_TRANSACTIONS_FILE");
    const titles = tf.properties.items.items.oneOf.map((o: any) => o.title).sort();
    expect(titles).toEqual(["StockCancellation", "StockIssuance"]);
  });

  it("packages each object into its OCF category file", () => {
    const scf = pkg.get("files/StockClassesFile.schema.json") as any;
    expect(scf.properties.file_type.const).toBe("OCF_STOCK_CLASSES_FILE");
    expect(scf.properties.items.items).toMatchObject({
      type: "object",
      required: [],
      additionalProperties: false,
      properties: { name: { type: "string" } },
    });
  });

  it("rides Issuer inline on the manifest (no IssuerFile) with file-pointer collections", () => {
    expect([...pkg.keys()].some((k) => /Issuer.*File/.test(k))).toBe(false);
    const mf = pkg.get("OCFCoreManifestFile.schema.json") as any;
    expect(mf.properties.file_type.const).toBe("OCF_MANIFEST_FILE");
    expect(mf.properties.issuer.properties.legal_name).toEqual({ type: "string" });
    expect(
      Object.keys(mf.properties)
        .filter((k) => k.endsWith("_files"))
        .sort()
    ).toEqual(["stock_classes_files", "transactions_files"]);
    // *_files items are inlined File pointers, not $refs.
    expect(mf.properties.transactions_files.items).toEqual({
      type: "object",
      additionalProperties: false,
      properties: {
        filepath: { type: "string" },
        md5: { type: "string", pattern: "^[a-f0-9]{32}$" },
      },
      required: ["filepath", "md5"],
    });
  });

  it("emits no $ref anywhere — every file is self-contained", () => {
    expect(JSON.stringify([...pkg.values()]).includes('"$ref"')).toBe(false);
  });

  it("emits schemas that compile as draft-07 JSON Schemas", () => {
    expect(validateSchemaPackage(pkg)).toEqual([]);
  });
});
