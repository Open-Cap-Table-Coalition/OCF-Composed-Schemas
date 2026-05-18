# OCF Mapping Skeleton Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Node.js CLI in this repo that emits one `.mapping.md` per `.schema.json` under `objects/` and `types/`, pre-populated with a YAML mapping skeleton (every property + every enum value as `kind: TODO`), so a human can fill in field-by-field mappings to a target JSON-Schema-based standard.

**Architecture:** Standalone TypeScript + Node project at `~/Code/OCF-Composed-Schemas/`. Pure functions for registry loading, enum detection, and markdown rendering, glued by a small CLI module. Tests use Jest with ts-jest's ESM preset (mirrors the OCF repo's setup so the toolchain is already known-good). The generator is deterministic given `(schema, registry, date)`; tests pin the date.

**Tech Stack:** Node v24.11.0 (matches OCF), TypeScript (ESM), Jest + ts-jest, yargs (CLI), minimatch (`--filter` glob), Prettier.

**Spec:** [`docs/superpowers/specs/2026-05-18-mapping-skeleton-design.md`](../specs/2026-05-18-mapping-skeleton-design.md)

---

## File Structure

| File | Responsibility |
| --- | --- |
| `package.json` | npm scripts, deps |
| `.nvmrc` | pins Node 24.11.0 |
| `tsconfig.json` | ESM TS config |
| `jest.config.js` | Jest ESM + ts-jest preset |
| `.prettierrc` | formatting (mirrors OCF) |
| `scripts/generate-mapping-skeletons.ts` | yargs CLI entry point |
| `scripts/lib/registry.ts` | walks repo, parses `*.schema.json`, builds `$id → schema` Map |
| `scripts/lib/enum-detection.ts` | pure function: property + registry → enum values or null |
| `scripts/lib/render.ts` | pure functions: schema → frontmatter / fields YAML / full markdown |
| `scripts/lib/walk-and-write.ts` | finds target schemas, applies idempotency / `--force` / `--dry-run` |
| `tests/registry.test.ts` | unit tests |
| `tests/enum-detection.test.ts` | unit tests |
| `tests/render.test.ts` | unit tests |
| `tests/walk-and-write.test.ts` | unit tests using tmpdir |
| `tests/cli.e2e.test.ts` | end-to-end test running the CLI against a fixture tree |

Each `lib/*.ts` file has one clear responsibility and a narrow interface, so the file the agent edits in a given task is always small.

---

## Task 1: Project scaffolding

**Files:**
- Create: `/home/jman/Code/OCF-Composed-Schemas/.nvmrc`
- Create: `/home/jman/Code/OCF-Composed-Schemas/package.json`
- Create: `/home/jman/Code/OCF-Composed-Schemas/tsconfig.json`
- Create: `/home/jman/Code/OCF-Composed-Schemas/jest.config.js`
- Create: `/home/jman/Code/OCF-Composed-Schemas/.prettierrc`
- Test: `/home/jman/Code/OCF-Composed-Schemas/tests/smoke.test.ts`

- [ ] **Step 1: Write the failing smoke test**

Create `tests/smoke.test.ts`:

```typescript
describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 2: Create `.nvmrc`**

Contents (exactly one line, no trailing whitespace):

```
v24.11.0
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "ocf-composed-schemas",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=24.11.0",
    "npm": ">=11.0.0 <12"
  },
  "scripts": {
    "mapping:skeleton": "node --loader ts-node/esm --no-warnings ./scripts/generate-mapping-skeletons.ts",
    "test": "node --experimental-vm-modules --experimental-json-modules --no-warnings node_modules/.bin/jest",
    "lint": "prettier --check \"scripts/**/*.ts\" \"tests/**/*.ts\"",
    "lint:fix": "prettier --write \"scripts/**/*.ts\" \"tests/**/*.ts\""
  },
  "dependencies": {
    "minimatch": "^10.0.1",
    "yargs": "^17.7.2"
  },
  "devDependencies": {
    "@types/jest": "^29.5.12",
    "@types/minimatch": "^5.1.2",
    "@types/node": "^22.5.0",
    "@types/yargs": "^17.0.32",
    "jest": "^29.7.0",
    "prettier": "2.5.1",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": false,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["scripts/**/*.ts", "tests/**/*.ts"]
}
```

- [ ] **Step 5: Create `jest.config.js`**

```javascript
/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: { module: "ES2022", target: "ES2022" },
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.ts"],
};
```

- [ ] **Step 6: Create `.prettierrc`**

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "proseWrap": "always",
  "overrides": [
    {
      "files": "*.md",
      "options": { "tabWidth": 4 }
    }
  ]
}
```

- [ ] **Step 7: Install dependencies**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm install`
Expected: install completes, `node_modules/` and `package-lock.json` created.

- [ ] **Step 8: Run the smoke test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test`
Expected: PASS — `1 passed, 1 total`.

- [ ] **Step 9: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add .nvmrc package.json package-lock.json tsconfig.json jest.config.js .prettierrc tests/smoke.test.ts
git commit -m "$(cat <<'EOF'
Add Node/TypeScript project scaffolding

Standalone TypeScript ESM project mirroring the OCF repo's toolchain:
- Node 24.11.0 pinned via .nvmrc
- Jest with ts-jest ESM preset
- Prettier with OCF-matching settings
- Smoke test verifies the toolchain runs end-to-end

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Schema registry loader

**Files:**
- Create: `/home/jman/Code/OCF-Composed-Schemas/scripts/lib/registry.ts`
- Test: `/home/jman/Code/OCF-Composed-Schemas/tests/registry.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/registry.test.ts`:

```typescript
import { mkdir, writeFile } from "node:fs/promises";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRegistry } from "../scripts/lib/registry.js";

async function makeTree(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "ocf-reg-"));
}

describe("loadRegistry", () => {
  let root: string;
  beforeEach(async () => {
    root = await makeTree();
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("indexes every *.schema.json by $id and ignores other files", async () => {
    await mkdir(path.join(root, "objects"), { recursive: true });
    await mkdir(path.join(root, "enums"), { recursive: true });
    await writeFile(
      path.join(root, "objects", "Foo.schema.json"),
      JSON.stringify({ $id: "test://foo", title: "Foo" })
    );
    await writeFile(
      path.join(root, "enums", "Bar.schema.json"),
      JSON.stringify({ $id: "test://bar", enum: ["X", "Y"] })
    );
    await writeFile(path.join(root, "README.md"), "ignored");
    await writeFile(path.join(root, "objects", "notes.txt"), "ignored");

    const registry = await loadRegistry(root);

    expect(registry.size).toBe(2);
    expect(registry.get("test://foo")?.title).toBe("Foo");
    expect(registry.get("test://bar")?.enum).toEqual(["X", "Y"]);
  });

  it("throws when a schema has no $id", async () => {
    await mkdir(path.join(root, "objects"), { recursive: true });
    await writeFile(
      path.join(root, "objects", "NoId.schema.json"),
      JSON.stringify({ title: "Headless" })
    );

    await expect(loadRegistry(root)).rejects.toThrow(/no \$id/);
  });

  it("throws when two schemas share an $id", async () => {
    await mkdir(path.join(root, "objects"), { recursive: true });
    await mkdir(path.join(root, "types"), { recursive: true });
    await writeFile(
      path.join(root, "objects", "Dup.schema.json"),
      JSON.stringify({ $id: "test://dup" })
    );
    await writeFile(
      path.join(root, "types", "Dup.schema.json"),
      JSON.stringify({ $id: "test://dup" })
    );

    await expect(loadRegistry(root)).rejects.toThrow(/Duplicate \$id/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/registry.test.ts`
Expected: FAIL — "Cannot find module '../scripts/lib/registry.js'".

- [ ] **Step 3: Implement `registry.ts`**

Create `scripts/lib/registry.ts`:

```typescript
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

export interface RawSchema {
  $id: string;
  title?: string;
  description?: string;
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  properties?: Record<string, RawSchema>;
  items?: RawSchema | RawSchema[];
  required?: string[];
  $ref?: string;
  [extra: string]: unknown;
}

export type Registry = Map<string, RawSchema>;

export async function loadRegistry(repoRoot: string): Promise<Registry> {
  const registry: Registry = new Map();
  const files = await collectSchemaFiles(repoRoot);

  for (const filePath of files) {
    const raw = JSON.parse(await readFile(filePath, "utf8")) as RawSchema;
    if (typeof raw.$id !== "string") {
      throw new Error(`Schema at ${filePath} has no $id`);
    }
    const existing = registry.get(raw.$id);
    if (existing) {
      throw new Error(`Duplicate $id ${raw.$id} encountered while loading ${filePath}`);
    }
    registry.set(raw.$id, raw);
  }

  return registry;
}

async function collectSchemaFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.endsWith(".schema.json")) continue;
    // Node 20+: Dirent.parentPath holds the directory; fall back to .path on older types.
    const dir = (e as unknown as { parentPath?: string; path?: string }).parentPath
      ?? (e as unknown as { path?: string }).path
      ?? root;
    out.push(path.join(dir, e.name));
  }
  return out.sort();
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/registry.test.ts`
Expected: PASS — `3 passed, 3 total`.

- [ ] **Step 5: Sanity-check against real data**

Run:

```bash
cd /home/jman/Code/OCF-Composed-Schemas && node --loader ts-node/esm --no-warnings --input-type=module -e "
import { loadRegistry } from './scripts/lib/registry.js';
const r = await loadRegistry('.');
console.log('registry size:', r.size);
"
```

Expected: `registry size: 175`.

- [ ] **Step 6: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/lib/registry.ts tests/registry.test.ts
git commit -m "$(cat <<'EOF'
Add schema registry loader

Walks a repo root, parses every *.schema.json, and returns a Map keyed by
$id. Throws on missing or duplicate $id. Tests use tmpdir fixtures so the
production schemas aren't touched.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Enum detection

**Files:**
- Create: `/home/jman/Code/OCF-Composed-Schemas/scripts/lib/enum-detection.ts`
- Test: `/home/jman/Code/OCF-Composed-Schemas/tests/enum-detection.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/enum-detection.test.ts`:

```typescript
import { detectEnumValues } from "../scripts/lib/enum-detection.js";
import { RawSchema, Registry } from "../scripts/lib/registry.js";

function makeRegistry(entries: Array<RawSchema>): Registry {
  const r: Registry = new Map();
  for (const e of entries) r.set(e.$id, e);
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
    const reg = makeRegistry([
      { $id: "test://e", enum: ["X", "Y"] },
    ]);
    expect(detectEnumValues({ $ref: "test://e" }, reg)).toEqual(["X", "Y"]);
  });

  it("returns null when $ref resolves to a non-enum schema", () => {
    const reg = makeRegistry([
      { $id: "test://obj", title: "Some object", properties: {} },
    ]);
    expect(detectEnumValues({ $ref: "test://obj" }, reg)).toBeNull();
  });

  it("returns null when $ref is unresolvable", () => {
    const reg = makeRegistry([]);
    expect(detectEnumValues({ $ref: "test://missing" }, reg)).toBeNull();
  });

  it("handles arrays of inline-enum items", () => {
    const reg = makeRegistry([]);
    expect(
      detectEnumValues({ type: "array", items: { enum: ["P", "Q"] } }, reg)
    ).toEqual(["P", "Q"]);
  });

  it("handles arrays whose items are a $ref to an enum", () => {
    const reg = makeRegistry([
      { $id: "test://e", enum: ["U", "V"] },
    ]);
    expect(
      detectEnumValues(
        { type: "array", items: { $ref: "test://e" } },
        reg
      )
    ).toEqual(["U", "V"]);
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/enum-detection.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `enum-detection.ts`**

Create `scripts/lib/enum-detection.ts`:

```typescript
import { Registry } from "./registry.js";

/**
 * Return the list of enum values for `property` if it is an enum-valued
 * JSON Schema fragment, else null. Walks one $ref step against the
 * registry; arrays delegate to their `items`.
 */
export function detectEnumValues(
  property: unknown,
  registry: Registry
): string[] | null {
  if (!property || typeof property !== "object") return null;
  const p = property as Record<string, unknown>;

  if (Array.isArray(p.enum)) {
    return p.enum.map((v) => String(v));
  }

  if (p.const !== undefined) {
    return [String(p.const)];
  }

  if (typeof p.$ref === "string") {
    const target = registry.get(p.$ref);
    if (!target) return null;
    return detectEnumValues(target, registry);
  }

  if (p.type === "array" && p.items) {
    return detectEnumValues(p.items, registry);
  }

  return null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/enum-detection.test.ts`
Expected: PASS — `9 passed, 9 total`.

- [ ] **Step 5: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/lib/enum-detection.ts tests/enum-detection.test.ts
git commit -m "$(cat <<'EOF'
Add enum-value detection for schema properties

Pure function that takes a property fragment + registry and returns its
enum values (or null). Supports inline enum, const, $ref to enum schema,
array of enum, and array of $ref-to-enum.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Frontmatter renderer

**Files:**
- Create: `/home/jman/Code/OCF-Composed-Schemas/scripts/lib/render.ts`
- Test: `/home/jman/Code/OCF-Composed-Schemas/tests/render.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/render.test.ts` (start with frontmatter cases only — more sections added in later tasks):

```typescript
import { renderFrontmatter } from "../scripts/lib/render.js";

describe("renderFrontmatter", () => {
  it("includes $id, title, kind, generated date", () => {
    const out = renderFrontmatter({
      $id: "https://example/Foo.schema.json",
      objectType: null,
      title: "Foo",
      kind: "type",
      requiredFields: [],
      generatedDate: "2026-05-18",
    });
    expect(out).toBe(
      [
        "---",
        "ocf_schema_id: https://example/Foo.schema.json",
        "ocf_object_type: null",
        "ocf_title: Foo",
        "ocf_kind: type",
        "required_fields: []",
        "target_standard: TBD",
        "target_version: TBD",
        "status: draft",
        "last_generated: 2026-05-18",
        "---",
      ].join("\n")
    );
  });

  it("renders ocf_object_type when const is set", () => {
    const out = renderFrontmatter({
      $id: "x",
      objectType: "TX_STOCK_ISSUANCE",
      title: "Stock Issuance",
      kind: "object",
      requiredFields: ["id", "object_type"],
      generatedDate: "2026-05-18",
    });
    expect(out).toContain("ocf_object_type: TX_STOCK_ISSUANCE");
    expect(out).toContain("required_fields:\n  - id\n  - object_type");
  });

  it("quotes titles containing YAML-special characters", () => {
    const out = renderFrontmatter({
      $id: "x",
      objectType: null,
      title: "Object: with colon",
      kind: "object",
      requiredFields: [],
      generatedDate: "2026-05-18",
    });
    expect(out).toContain('ocf_title: "Object: with colon"');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/render.test.ts`
Expected: FAIL — "Cannot find module".

- [ ] **Step 3: Implement `renderFrontmatter` in `render.ts`**

Create `scripts/lib/render.ts` (this file grows in later tasks):

```typescript
export interface FrontmatterInput {
  $id: string;
  objectType: string | null;
  title: string;
  kind: "object" | "type";
  requiredFields: string[];
  generatedDate: string;
}

export function renderFrontmatter(input: FrontmatterInput): string {
  const lines: string[] = ["---"];
  lines.push(`ocf_schema_id: ${input.$id}`);
  lines.push(`ocf_object_type: ${input.objectType ?? "null"}`);
  lines.push(`ocf_title: ${yamlScalar(input.title)}`);
  lines.push(`ocf_kind: ${input.kind}`);
  if (input.requiredFields.length === 0) {
    lines.push("required_fields: []");
  } else {
    lines.push("required_fields:");
    for (const f of input.requiredFields) lines.push(`  - ${f}`);
  }
  lines.push("target_standard: TBD");
  lines.push("target_version: TBD");
  lines.push("status: draft");
  lines.push(`last_generated: ${input.generatedDate}`);
  lines.push("---");
  return lines.join("\n");
}

function yamlScalar(s: string): string {
  if (/[:#\[\]{}&*!|>'"%@`,]/.test(s) || s.startsWith(" ") || s.endsWith(" ")) {
    return JSON.stringify(s);
  }
  return s;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/render.test.ts`
Expected: PASS — `3 passed, 3 total`.

- [ ] **Step 5: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/lib/render.ts tests/render.test.ts
git commit -m "$(cat <<'EOF'
Render mapping markdown frontmatter

Pure function that emits the YAML frontmatter block from schema metadata,
quoting titles when they contain YAML-special characters.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Mapping YAML block renderer

**Files:**
- Modify: `/home/jman/Code/OCF-Composed-Schemas/scripts/lib/render.ts` (add `renderMappingBlock`)
- Modify: `/home/jman/Code/OCF-Composed-Schemas/tests/render.test.ts` (append new describe block)

- [ ] **Step 1: Write the failing test**

Append to `tests/render.test.ts`:

```typescript
import { renderMappingBlock } from "../scripts/lib/render.js";
import { Registry } from "../scripts/lib/registry.js";

const EMPTY_REGISTRY: Registry = new Map();

describe("renderMappingBlock", () => {
  it("emits one entry per property in source order, no enums", () => {
    const out = renderMappingBlock(
      { id: { type: "string" }, comments: { type: "array", items: { type: "string" } } },
      EMPTY_REGISTRY
    );
    expect(out).toBe(
      [
        "```yaml",
        "# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO",
        "status: draft",
        "coverage: 0/2",
        "",
        "fields:",
        "  id:",
        "    kind: TODO",
        "    target: TODO",
        "  comments:",
        "    kind: TODO",
        "    target: TODO",
        "```",
      ].join("\n")
    );
  });

  it("expands inline enum values into a values: map", () => {
    const out = renderMappingBlock(
      { kind_field: { enum: ["A", "B", "C"] } },
      EMPTY_REGISTRY
    );
    expect(out).toContain("    kind: TODO          # likely enum-remap");
    expect(out).toContain("    values:");
    expect(out).toContain("      A: TODO");
    expect(out).toContain("      B: TODO");
    expect(out).toContain("      C: TODO");
  });

  it("expands const into a single-key values map", () => {
    const out = renderMappingBlock(
      { object_type: { const: "TX_FOO" } },
      EMPTY_REGISTRY
    );
    expect(out).toContain("      TX_FOO: TODO");
  });

  it("expands $ref to an enum schema via the registry", () => {
    const reg: Registry = new Map([
      ["test://e", { $id: "test://e", enum: ["P", "Q"] }],
    ]);
    const out = renderMappingBlock(
      { kind_field: { $ref: "test://e" } },
      reg
    );
    expect(out).toContain("      P: TODO");
    expect(out).toContain("      Q: TODO");
  });

  it("does NOT expand $ref to a non-enum schema (e.g. Monetary)", () => {
    const reg: Registry = new Map([
      [
        "test://monetary",
        {
          $id: "test://monetary",
          title: "Monetary",
          properties: { amount: { type: "string" }, currency: { type: "string" } },
        },
      ],
    ]);
    const out = renderMappingBlock(
      { price: { $ref: "test://monetary" } },
      reg
    );
    expect(out).toContain("  price:");
    expect(out).not.toContain("    values:");
    expect(out).not.toContain("    amount:");
  });

  it("handles empty properties with a 0/0 coverage line", () => {
    const out = renderMappingBlock({}, EMPTY_REGISTRY);
    expect(out).toContain("coverage: 0/0");
    expect(out).toContain("fields:");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/render.test.ts`
Expected: FAIL — "renderMappingBlock is not a function" or "not exported".

- [ ] **Step 3: Implement `renderMappingBlock` in `render.ts`**

Append to `scripts/lib/render.ts`:

```typescript
import { detectEnumValues } from "./enum-detection.js";
import { Registry } from "./registry.js";

const KIND_VOCAB =
  "# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO";

export function renderMappingBlock(
  properties: Record<string, unknown>,
  registry: Registry
): string {
  const propertyNames = Object.keys(properties);
  const lines: string[] = ["```yaml", KIND_VOCAB, "status: draft"];
  lines.push(`coverage: 0/${propertyNames.length}`);
  lines.push("");
  lines.push("fields:");

  for (const name of propertyNames) {
    const prop = properties[name];
    const enumValues = detectEnumValues(prop, registry);
    lines.push(`  ${name}:`);
    if (enumValues) {
      lines.push("    kind: TODO          # likely enum-remap");
    } else {
      lines.push("    kind: TODO");
    }
    lines.push("    target: TODO");
    if (enumValues) {
      lines.push("    values:");
      for (const v of enumValues) lines.push(`      ${v}: TODO`);
    }
  }

  lines.push("```");
  return lines.join("\n");
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/render.test.ts`
Expected: PASS — all 9 (3 frontmatter + 6 mapping-block) pass.

- [ ] **Step 5: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/lib/render.ts tests/render.test.ts
git commit -m "$(cat <<'EOF'
Render mapping YAML block with enum pre-population

Walks the schema's properties in source order and emits one entry per
property. Enum-valued properties get an additional values: block with
every OCF enum value mapped to TODO. Non-enum $refs (e.g., Monetary)
are deliberately not expanded.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Full markdown renderer

**Files:**
- Modify: `/home/jman/Code/OCF-Composed-Schemas/scripts/lib/render.ts` (add `renderMappingMarkdown`)
- Modify: `/home/jman/Code/OCF-Composed-Schemas/tests/render.test.ts` (append new describe block)

- [ ] **Step 1: Write the failing test**

Append to `tests/render.test.ts`:

```typescript
import { renderMappingMarkdown } from "../scripts/lib/render.js";

const SAMPLE_SCHEMA = {
  $id: "https://example/StockIssuance.schema.json",
  title: "Object - Stock Issuance Transaction",
  description: "Object describing a stock issuance transaction.",
  type: "object",
  properties: {
    id: { type: "string" },
    object_type: { const: "TX_STOCK_ISSUANCE" },
    quantity: { type: "string" },
  },
  required: ["id", "object_type"],
};

describe("renderMappingMarkdown", () => {
  it("assembles frontmatter, heading, description, schema block, mapping, and notes", () => {
    const out = renderMappingMarkdown({
      schema: SAMPLE_SCHEMA,
      schemaRelPath: "objects/transactions/issuance/StockIssuance.schema.json",
      registry: new Map([["x", { $id: "x" }]]),
      generatedDate: "2026-05-18",
    });

    expect(out).toMatch(/^---\nocf_schema_id: https:\/\/example\/StockIssuance\.schema\.json/);
    expect(out).toContain("ocf_object_type: TX_STOCK_ISSUANCE");
    expect(out).toContain("ocf_kind: object");
    expect(out).toContain("# Object - Stock Issuance Transaction → TBD");
    expect(out).toContain("> Object describing a stock issuance transaction.");
    expect(out).toContain("## OCF schema");
    expect(out).toContain("Source: [`StockIssuance.schema.json`](./StockIssuance.schema.json)");
    expect(out).toContain("<details>");
    expect(out).toContain("<summary>Composed schema (click to expand)</summary>");
    expect(out).toContain('"$id": "https://example/StockIssuance.schema.json"');
    expect(out).toContain("</details>");
    expect(out).toContain("## Mapping");
    expect(out).toContain("coverage: 0/3");
    expect(out).toContain("      TX_STOCK_ISSUANCE: TODO");
    expect(out).toContain("## Notes / open questions");
    expect(out.endsWith("- \n")).toBe(true);
  });

  it("substitutes a fallback when description is missing", () => {
    const out = renderMappingMarkdown({
      schema: { $id: "x", title: "Plain", properties: {} },
      schemaRelPath: "types/Plain.schema.json",
      registry: new Map(),
      generatedDate: "2026-05-18",
    });
    expect(out).toContain("> _(no description in source schema)_");
    expect(out).toContain("ocf_kind: type");
  });

  it("determines ocf_kind from path prefix", () => {
    const objMd = renderMappingMarkdown({
      schema: { $id: "x", title: "A", properties: {} },
      schemaRelPath: "objects/A.schema.json",
      registry: new Map(),
      generatedDate: "2026-05-18",
    });
    const typeMd = renderMappingMarkdown({
      schema: { $id: "y", title: "B", properties: {} },
      schemaRelPath: "types/B.schema.json",
      registry: new Map(),
      generatedDate: "2026-05-18",
    });
    expect(objMd).toContain("ocf_kind: object");
    expect(typeMd).toContain("ocf_kind: type");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/render.test.ts`
Expected: FAIL — "renderMappingMarkdown is not exported".

- [ ] **Step 3: Implement `renderMappingMarkdown` in `render.ts`**

Append to `scripts/lib/render.ts`:

```typescript
import path from "node:path";
import { RawSchema } from "./registry.js";

export interface RenderInput {
  schema: RawSchema;
  schemaRelPath: string;
  registry: Registry;
  generatedDate: string;
}

const NO_DESCRIPTION = "_(no description in source schema)_";

export function renderMappingMarkdown(input: RenderInput): string {
  const { schema, schemaRelPath, registry, generatedDate } = input;

  const kind: "object" | "type" = schemaRelPath.startsWith("objects/")
    ? "object"
    : "type";
  const title = schema.title ?? "Untitled";
  const description = typeof schema.description === "string" ? schema.description : null;
  const objectTypeProp = schema.properties?.object_type as
    | { const?: unknown }
    | undefined;
  const objectType =
    typeof objectTypeProp?.const === "string" ? objectTypeProp.const : null;
  const required = Array.isArray(schema.required) ? schema.required : [];
  const properties = (schema.properties ?? {}) as Record<string, unknown>;
  const basename = path.basename(schemaRelPath);

  const sections: string[] = [
    renderFrontmatter({
      $id: schema.$id,
      objectType,
      title,
      kind,
      requiredFields: required,
      generatedDate,
    }),
    "",
    `# ${title} → TBD`,
    "",
    `> ${description ?? NO_DESCRIPTION}`,
    "",
    "## OCF schema",
    "",
    `Source: [\`${basename}\`](./${basename})`,
    "",
    "<details>",
    "<summary>Composed schema (click to expand)</summary>",
    "",
    "```json",
    JSON.stringify(schema, null, 2),
    "```",
    "",
    "</details>",
    "",
    "## Mapping",
    "",
    renderMappingBlock(properties, registry),
    "",
    "## Notes / open questions",
    "",
    "- ",
    "",
  ];

  return sections.join("\n");
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/render.test.ts`
Expected: PASS — all `render` tests pass.

- [ ] **Step 5: Spot-check against the real StockIssuance composed schema**

Run:

```bash
cd /home/jman/Code/OCF-Composed-Schemas && node --loader ts-node/esm --no-warnings --input-type=module -e "
import { loadRegistry } from './scripts/lib/registry.js';
import { renderMappingMarkdown } from './scripts/lib/render.js';
const r = await loadRegistry('.');
const schema = r.get('https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/StockIssuance.schema.json');
const md = renderMappingMarkdown({
  schema,
  schemaRelPath: 'objects/transactions/issuance/StockIssuance.schema.json',
  registry: r,
  generatedDate: '2026-05-18',
});
console.log(md);
" | head -60
```

Expected: prints frontmatter starting with `---`, then the description blockquote, then the schema fenced block. Sanity check that `coverage: 0/21` appears and `issuance_type` has a `values:` block with `RSA` and `FOUNDERS_STOCK`.

- [ ] **Step 6: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/lib/render.ts tests/render.test.ts
git commit -m "$(cat <<'EOF'
Render full mapping markdown document

Combines frontmatter, heading, description blockquote, embedded composed
schema, mapping YAML block, and notes section into the final .mapping.md
output.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Walk-and-write logic

**Files:**
- Create: `/home/jman/Code/OCF-Composed-Schemas/scripts/lib/walk-and-write.ts`
- Test: `/home/jman/Code/OCF-Composed-Schemas/tests/walk-and-write.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/walk-and-write.test.ts`:

```typescript
import { mkdir, mkdtemp, readFile, rm, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRegistry } from "../scripts/lib/registry.js";
import { walkAndWrite } from "../scripts/lib/walk-and-write.js";

async function makeTree(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "ocf-walk-"));
  await mkdir(path.join(root, "objects"), { recursive: true });
  await mkdir(path.join(root, "types"), { recursive: true });
  await mkdir(path.join(root, "enums"), { recursive: true });

  await writeFile(
    path.join(root, "objects", "Foo.schema.json"),
    JSON.stringify({
      $id: "test://foo",
      title: "Foo",
      description: "A foo.",
      properties: {
        id: { type: "string" },
        flavor: { $ref: "test://flavors" },
      },
      required: ["id"],
    })
  );
  await writeFile(
    path.join(root, "types", "Bar.schema.json"),
    JSON.stringify({
      $id: "test://bar",
      title: "Bar",
      description: "A bar.",
      properties: { value: { type: "string" } },
    })
  );
  await writeFile(
    path.join(root, "enums", "Flavors.schema.json"),
    JSON.stringify({ $id: "test://flavors", enum: ["SWEET", "SOUR"] })
  );

  return root;
}

describe("walkAndWrite", () => {
  let root: string;
  beforeEach(async () => {
    root = await makeTree();
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("writes one .mapping.md per schema in objects/ and types/", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: false,
      generatedDate: "2026-05-18",
      verbose: false,
    });

    expect(result.wrote.sort()).toEqual(
      [
        "objects/Foo.mapping.md",
        "types/Bar.mapping.md",
      ].sort()
    );
    expect(result.skipped).toEqual([]);

    const fooMd = await readFile(path.join(root, "objects", "Foo.mapping.md"), "utf8");
    expect(fooMd).toContain("ocf_title: Foo");
    expect(fooMd).toContain("      SWEET: TODO");
  });

  it("is idempotent: a second run with no flags is a no-op", async () => {
    const registry = await loadRegistry(root);
    await walkAndWrite({
      repoRoot: root, registry, force: false, dryRun: false,
      generatedDate: "2026-05-18", verbose: false,
    });
    const beforeMtime = (await stat(path.join(root, "objects", "Foo.mapping.md"))).mtimeMs;

    // Wait a tick so a re-write would have a later mtime
    await new Promise((r) => setTimeout(r, 10));

    const result = await walkAndWrite({
      repoRoot: root, registry, force: false, dryRun: false,
      generatedDate: "2026-05-19", verbose: false,
    });
    expect(result.wrote).toEqual([]);
    expect(result.skipped.sort()).toEqual([
      "objects/Foo.mapping.md", "types/Bar.mapping.md",
    ].sort());

    const afterMtime = (await stat(path.join(root, "objects", "Foo.mapping.md"))).mtimeMs;
    expect(afterMtime).toBe(beforeMtime);
  });

  it("--force overwrites and updates last_generated", async () => {
    const registry = await loadRegistry(root);
    await walkAndWrite({
      repoRoot: root, registry, force: false, dryRun: false,
      generatedDate: "2026-05-18", verbose: false,
    });

    const result = await walkAndWrite({
      repoRoot: root, registry, force: true, dryRun: false,
      generatedDate: "2026-06-01", verbose: false,
    });
    expect(result.wrote.length).toBe(2);

    const md = await readFile(path.join(root, "objects", "Foo.mapping.md"), "utf8");
    expect(md).toContain("last_generated: 2026-06-01");
    expect(md).not.toContain("last_generated: 2026-05-18");
  });

  it("--dry-run writes nothing", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root, registry, force: false, dryRun: true,
      generatedDate: "2026-05-18", verbose: false,
    });
    expect(result.wrote.length).toBe(2);
    await expect(
      stat(path.join(root, "objects", "Foo.mapping.md"))
    ).rejects.toThrow(/ENOENT/);
  });

  it("--filter restricts to matching schemas", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root, registry, force: false, dryRun: false,
      filter: "objects/**", generatedDate: "2026-05-18", verbose: false,
    });
    expect(result.wrote).toEqual(["objects/Foo.mapping.md"]);
  });

  it("ignores schemas outside objects/ and types/", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root, registry, force: false, dryRun: false,
      generatedDate: "2026-05-18", verbose: false,
    });
    // Flavors.schema.json is under enums/; should be loaded into registry but not generated for.
    expect(result.wrote.some((p) => p.startsWith("enums/"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/walk-and-write.test.ts`
Expected: FAIL — "Cannot find module '../scripts/lib/walk-and-write.js'".

- [ ] **Step 3: Implement `walk-and-write.ts`**

Create `scripts/lib/walk-and-write.ts`:

```typescript
import path from "node:path";
import { readdir, writeFile, stat } from "node:fs/promises";
import { minimatch } from "minimatch";

import { Registry } from "./registry.js";
import { renderMappingMarkdown } from "./render.js";

export interface WalkAndWriteOptions {
  repoRoot: string;
  registry: Registry;
  force: boolean;
  dryRun: boolean;
  filter?: string;
  generatedDate: string;
  verbose: boolean;
}

export interface WalkAndWriteResult {
  wrote: string[];
  skipped: string[];
  considered: number;
}

const TARGET_DIRS = ["objects", "types"] as const;

export async function walkAndWrite(
  options: WalkAndWriteOptions
): Promise<WalkAndWriteResult> {
  const { repoRoot, registry, force, dryRun, filter, generatedDate, verbose } =
    options;

  const candidates: string[] = [];
  for (const dir of TARGET_DIRS) {
    const abs = path.join(repoRoot, dir);
    try {
      await stat(abs);
    } catch {
      continue;
    }
    const entries = await readdir(abs, { recursive: true, withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith(".schema.json")) continue;
      const direntDir =
        (e as unknown as { parentPath?: string }).parentPath
        ?? (e as unknown as { path?: string }).path
        ?? abs;
      const absPath = path.join(direntDir, e.name);
      candidates.push(path.relative(repoRoot, absPath));
    }
  }
  candidates.sort();

  const filtered = filter
    ? candidates.filter((rel) => minimatch(rel, filter))
    : candidates;

  const wrote: string[] = [];
  const skipped: string[] = [];

  for (const schemaRel of filtered) {
    const mappingRel = schemaRel.replace(/\.schema\.json$/, ".mapping.md");
    const mappingAbs = path.join(repoRoot, mappingRel);

    if (!force) {
      try {
        await stat(mappingAbs);
        skipped.push(mappingRel);
        if (verbose) console.log(`skip   ${mappingRel}`);
        continue;
      } catch {
        // not present — fall through to write
      }
    }

    const schemaAbs = path.join(repoRoot, schemaRel);
    const json = JSON.parse(
      await (await import("node:fs/promises")).readFile(schemaAbs, "utf8")
    );
    const md = renderMappingMarkdown({
      schema: json,
      schemaRelPath: schemaRel,
      registry,
      generatedDate,
    });

    wrote.push(mappingRel);
    if (verbose) console.log(`${dryRun ? "dry-write" : "write"}  ${mappingRel}`);
    if (!dryRun) {
      await writeFile(mappingAbs, md);
    }
  }

  return { wrote, skipped, considered: candidates.length };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/walk-and-write.test.ts`
Expected: PASS — `6 passed, 6 total`.

- [ ] **Step 5: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/lib/walk-and-write.ts tests/walk-and-write.test.ts
git commit -m "$(cat <<'EOF'
Walk objects/ and types/, write .mapping.md siblings idempotently

Discovers .schema.json files under TARGET_DIRS, applies optional
--filter glob, and writes .mapping.md siblings. Skips existing files
unless --force; --dry-run reports planned writes without touching disk.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: CLI wiring

**Files:**
- Create: `/home/jman/Code/OCF-Composed-Schemas/scripts/generate-mapping-skeletons.ts`
- Test: `/home/jman/Code/OCF-Composed-Schemas/tests/cli.e2e.test.ts`

- [ ] **Step 1: Write the failing end-to-end test**

Create `tests/cli.e2e.test.ts`:

```typescript
import { mkdir, mkdtemp, readFile, rm, writeFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";

const execFileP = promisify(execFile);
const REPO_ROOT = path.resolve(__dirname, "..");
const CLI = path.join(REPO_ROOT, "scripts/generate-mapping-skeletons.ts");

async function makeTree(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "ocf-cli-"));
  await mkdir(path.join(root, "objects"), { recursive: true });
  await writeFile(
    path.join(root, "objects", "Foo.schema.json"),
    JSON.stringify({
      $id: "test://foo",
      title: "Foo",
      description: "A foo.",
      properties: { id: { type: "string" } },
    })
  );
  return root;
}

async function runCli(cwd: string, args: string[] = []) {
  return execFileP(
    process.execPath,
    [
      "--loader", "ts-node/esm",
      "--no-warnings",
      CLI,
      ...args,
    ],
    { cwd }
  );
}

describe("generate-mapping-skeletons CLI", () => {
  let root: string;
  beforeEach(async () => { root = await makeTree(); });
  afterEach(async () => { await rm(root, { recursive: true, force: true }); });

  it("writes mapping files end-to-end when run with no args", async () => {
    const { stdout } = await runCli(root, []);
    expect(stdout).toMatch(/Wrote 1 file/);
    const md = await readFile(path.join(root, "objects", "Foo.mapping.md"), "utf8");
    expect(md).toContain("ocf_title: Foo");
  });

  it("exits non-zero if a source schema lacks $id", async () => {
    await writeFile(
      path.join(root, "objects", "Bad.schema.json"),
      JSON.stringify({ title: "Bad" })
    );
    await expect(runCli(root, [])).rejects.toMatchObject({ code: 1 });
    // And nothing got written
    await expect(
      stat(path.join(root, "objects", "Foo.mapping.md"))
    ).rejects.toThrow(/ENOENT/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/cli.e2e.test.ts`
Expected: FAIL — "Cannot find module '.../scripts/generate-mapping-skeletons.ts'" or similar.

- [ ] **Step 3: Implement the CLI**

Create `scripts/generate-mapping-skeletons.ts`:

```typescript
#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { loadRegistry } from "./lib/registry.js";
import { walkAndWrite } from "./lib/walk-and-write.js";

interface Args {
  force: boolean;
  dryRun: boolean;
  filter?: string;
  verbose: boolean;
}

async function main(argv: Args): Promise<number> {
  const cwd = process.cwd();
  const today = new Date().toISOString().slice(0, 10);

  let registry;
  try {
    registry = await loadRegistry(cwd);
  } catch (err) {
    console.error(`Failed to load schema registry: ${(err as Error).message}`);
    return 1;
  }

  const result = await walkAndWrite({
    repoRoot: cwd,
    registry,
    force: argv.force,
    dryRun: argv.dryRun,
    filter: argv.filter,
    generatedDate: today,
    verbose: argv.verbose,
  });

  const verb = argv.dryRun ? "Would write" : "Wrote";
  console.log(
    `${verb} ${result.wrote.length} file${result.wrote.length === 1 ? "" : "s"}; ` +
      `skipped ${result.skipped.length}; considered ${result.considered}`
  );
  return 0;
}

const parsed = yargs(hideBin(process.argv))
  .scriptName("mapping:skeleton")
  .usage("$0 [options]")
  .option("force", {
    type: "boolean",
    default: false,
    describe: "Overwrite existing .mapping.md files",
  })
  .option("dry-run", {
    type: "boolean",
    default: false,
    describe: "Report planned writes without touching disk",
  })
  .option("filter", {
    type: "string",
    describe: "Glob (relative to repo root) restricting which schemas are processed",
  })
  .option("verbose", {
    type: "boolean",
    default: false,
    describe: "Print per-file progress",
  })
  .strict()
  .help()
  .parseSync();

const argv: Args = {
  force: Boolean(parsed.force),
  dryRun: Boolean(parsed["dry-run"]),
  filter: typeof parsed.filter === "string" ? parsed.filter : undefined,
  verbose: Boolean(parsed.verbose),
};

main(argv).then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test -- tests/cli.e2e.test.ts`
Expected: PASS — `2 passed, 2 total`.

- [ ] **Step 5: Run the full test suite to confirm nothing regressed**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm test`
Expected: all suites pass.

- [ ] **Step 6: Lint check**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm run lint`
Expected: no formatting violations. If any, run `npm run lint:fix` and re-stage.

- [ ] **Step 7: Commit**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add scripts/generate-mapping-skeletons.ts tests/cli.e2e.test.ts
git commit -m "$(cat <<'EOF'
Add CLI entry point

Wires yargs flags to loadRegistry + walkAndWrite. Loads the full schema
registry first so registry errors (missing or duplicate $id) abort
before any file is written.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Run on real data and commit generated files

**Files:**
- Create: 56 files under `objects/**/*.mapping.md`
- Create: 51 files under `types/**/*.mapping.md`

- [ ] **Step 1: Dry-run against the real tree to preview file count**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm run mapping:skeleton -- --dry-run`
Expected: `Would write 107 files; skipped 0; considered 107`.

- [ ] **Step 2: Generate for real**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm run mapping:skeleton`
Expected: `Wrote 107 files; skipped 0; considered 107`.

- [ ] **Step 3: Verify idempotency on real data**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && npm run mapping:skeleton`
Expected: `Wrote 0 files; skipped 107; considered 107`.

- [ ] **Step 4: Spot-check the StockIssuance output**

Run: `cd /home/jman/Code/OCF-Composed-Schemas && head -30 objects/transactions/issuance/StockIssuance.mapping.md`
Expected: starts with `---`, contains `ocf_object_type: TX_STOCK_ISSUANCE`, the description blockquote, and `# Object - Stock Issuance Transaction → TBD`.

- [ ] **Step 5: Verify the generated set covers every objects/ and types/ schema**

Run:

```bash
cd /home/jman/Code/OCF-Composed-Schemas
schemas=$(find objects types -name "*.schema.json" | wc -l)
mappings=$(find objects types -name "*.mapping.md" | wc -l)
echo "schemas=$schemas mappings=$mappings"
test "$schemas" = "$mappings" && echo OK || echo MISMATCH
```

Expected: `schemas=107 mappings=107` followed by `OK`.

- [ ] **Step 6: Commit the generated files**

```bash
cd /home/jman/Code/OCF-Composed-Schemas
git add objects types
git commit -m "$(cat <<'EOF'
Generate initial .mapping.md skeletons for all OCF objects and types

Output of `npm run mapping:skeleton`. One file per .schema.json under
objects/ (56) and types/ (51), 107 total. Each contains schema-derived
frontmatter, the composed schema in a <details> block, and a YAML
mapping skeleton with every property + every enum value pre-listed as
kind: TODO for manual fill-in.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review (done by plan author, not by the agent executing)

**Spec coverage check — every spec section maps to a task:**

| Spec section | Implementing task(s) |
| --- | --- |
| Repo layout | Task 1 (project files); Tasks 6/9 (generated `.mapping.md` placement under `objects/` & `types/`) |
| Frontmatter schema | Task 4 (`renderFrontmatter`) |
| Body sections | Task 6 (`renderMappingMarkdown` — heading, description, schema details, mapping, notes) |
| Mapping YAML schema + `kind` vocabulary | Task 5 (`renderMappingBlock` — kind vocab comment + per-property entries) |
| Pre-population rules | Tasks 3 (enum detection), 5 (use detected enums), 6 (frontmatter / description fallback) |
| Enum detection (inline / const / $ref / array) | Task 3 |
| Non-expansion of non-enum $refs | Task 5 test "does NOT expand $ref to a non-enum schema" |
| Schema registry | Task 2 |
| CLI flags (--force / --dry-run / --filter / --verbose) | Task 7 (logic) + Task 8 (CLI wiring) |
| Idempotency invariant | Task 7 test "is idempotent" + Task 9 step 3 |
| `--force` updates `last_generated` | Task 7 test "`--force` overwrites and updates last_generated" |
| Failure mode (invalid schema → non-zero, no writes) | Task 8 test "exits non-zero if a source schema lacks `$id`" |
| Project setup | Task 1 |
| Testing | Tasks 2–8 (every module has tests) |
| Out-of-scope (coverage auto-recalc, multi-target, etc.) | Not implemented — by spec |

**Placeholder scan:** every step contains explicit commands, file paths, and code blocks. No "TODO", "TBD", or "implement appropriately" in plan narrative (only in generator output, which is intentional).

**Type consistency:** `RawSchema`, `Registry`, `RenderInput`, `WalkAndWriteOptions` defined in their introducing tasks and re-used verbatim in later tasks. `renderFrontmatter` / `renderMappingBlock` / `renderMappingMarkdown` signatures match between test and implementation.
