import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileP = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(REPO_ROOT, "scripts/validate-mappings.ts");
const TS_NODE_LOADER = pathToFileURL(path.join(REPO_ROOT, "node_modules/ts-node/esm.mjs")).href;

async function runCli(cwd: string, args: string[] = []) {
  return execFileP(process.execPath, ["--loader", TS_NODE_LOADER, "--no-warnings", CLI, ...args], {
    cwd,
  });
}

const BUNDLE = {
  title: "Carta Cap Table Data Schema",
  $defs: {
    Thing: { type: "object", properties: { name: { type: "string" } } },
    EmptyObject: { type: "object", properties: { id: { type: "string" } } },
  },
};

function mappingDoc(over: {
  status?: string;
  coverage?: string;
  fieldsYaml?: string;
  standard?: string;
}): string {
  const status = over.status ?? "complete";
  const coverage = over.coverage ?? "1/1";
  const standard = over.standard ?? "Carta";
  const fieldsYaml =
    over.fieldsYaml ??
    ["fields:", "  name:", "    kind: rename", '    target: "#/$defs/Thing/properties/name"'].join(
      "\n"
    );
  return [
    "---",
    "ocf_schema_id: test://thing",
    "ocf_object_type: null",
    "ocf_title: Thing",
    "ocf_kind: object",
    "required_fields:",
    "  - name",
    `target_standard: ${standard}`,
    "target_version: v1",
    `status: ${status}`,
    "last_generated: 2026-06-11",
    "---",
    "",
    "# Thing → Carta",
    "",
    "## Mapping",
    "",
    "```yaml",
    `status: ${status}`,
    `coverage: ${coverage}`,
    "",
    fieldsYaml,
    "```",
    "",
    "## Notes / open questions",
    "",
    "- ",
    "",
  ].join("\n");
}

async function makeTree(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "ocf-validate-"));
  await mkdir(path.join(root, "objects"), { recursive: true });
  await mkdir(path.join(root, "target-schema"), { recursive: true });
  await mkdir(path.join(root, "core"), { recursive: true });
  await writeFile(
    path.join(root, "objects", "Thing.schema.json"),
    JSON.stringify({
      $id: "test://thing",
      title: "Thing",
      properties: { name: { type: "string" } },
    })
  );
  await writeFile(path.join(root, "target-schema", "Carta.schema.json"), JSON.stringify(BUNDLE));
  await writeFile(path.join(root, "core", "inverse-coverage-policy.yml"), "carta_defs: {}\n");
  return root;
}

describe("validate-mappings CLI (temp tree)", () => {
  let root: string;
  beforeEach(async () => {
    root = await makeTree();
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("exits 0 on a valid tree", async () => {
    await writeFile(path.join(root, "objects", "Thing.mapping.md"), mappingDoc({}));
    const { stdout } = await runCli(root);
    expect(stdout).toMatch(/OK: checked 1 mapping file\(s\), 0 errors/);
  });

  it("prints a per-file mapping tree in --verbose mode", async () => {
    await writeFile(path.join(root, "objects", "Thing.mapping.md"), mappingDoc({}));
    const { stdout } = await runCli(root, ["--verbose"]);
    expect(stdout).toContain("objects/Thing.mapping.md  complete 1/1 → Carta");
    expect(stdout).toContain("└── name → #/$defs/Thing/properties/name (rename)");
    expect(stdout).toMatch(/OK: checked 1 mapping file\(s\), 0 errors/);
  });

  it("prints a target-first inverse report", async () => {
    await writeFile(path.join(root, "objects", "Thing.mapping.md"), mappingDoc({}));
    const { stdout } = await runCli(root, ["--inverse", "--target-object", "Thing"]);
    expect(stdout).toContain("source_documents: 1");
    expect(stdout).toContain('id: "#/$defs/Thing"');
    expect(stdout).toContain("objects/Thing.mapping.md :: name (rename)");
    expect(stdout).toMatch(/OK: checked 1 mapping file\(s\), 0 errors/);
  });

  it("includes Carta objects with no incoming mappings in an unfiltered inverse report", async () => {
    await writeFile(path.join(root, "objects", "Thing.mapping.md"), mappingDoc({}));
    const { stdout } = await runCli(root, ["--inverse"]);
    expect(stdout).toContain("name: EmptyObject");
    expect(stdout).toContain("status: NO MAPPINGS");
    expect(stdout).toContain("7. 1 standalone candidates have no mapping evidence yet");
  });

  it("exits 1 and reports field-level errors on a broken mapping", async () => {
    await writeFile(
      path.join(root, "objects", "Thing.mapping.md"),
      mappingDoc({
        fieldsYaml: [
          "fields:",
          "  name:",
          "    kind: rename",
          '    target: "#/$defs/Thing/properties/nope"',
        ].join("\n"),
      })
    );
    const promise = runCli(root);
    await expect(promise).rejects.toMatchObject({ code: 1 });
    const err = (await promise.catch((e) => e)) as { stderr: string };
    expect(err.stderr).toContain("objects/Thing.mapping.md");
    expect(err.stderr).toContain("fields.name");
    expect(err.stderr).toContain("does not resolve");
  });

  it("reports parse failures as errors rather than crashing", async () => {
    await writeFile(path.join(root, "objects", "Thing.mapping.md"), "# not a mapping doc\n");
    const err = (await runCli(root).catch((e) => e)) as { code: number; stderr: string };
    expect(err.code).toBe(1);
    expect(err.stderr).toContain("frontmatter");
    const occurrences = err.stderr.split("objects/Thing.mapping.md").length - 1;
    expect(occurrences).toBe(1);
  });

  it("reports a missing sibling schema as an error", async () => {
    await mkdir(path.join(root, "types"), { recursive: true });
    await writeFile(path.join(root, "types", "Orphan.mapping.md"), mappingDoc({}));
    const err = (await runCli(root).catch((e) => e)) as { code: number; stderr: string };
    expect(err.code).toBe(1);
    expect(err.stderr).toContain("types/Orphan.schema.json");
  });

  it("reports an unknown target_standard", async () => {
    await writeFile(
      path.join(root, "objects", "Thing.mapping.md"),
      mappingDoc({ standard: "Pulley" })
    );
    const err = (await runCli(root).catch((e) => e)) as { code: number; stderr: string };
    expect(err.code).toBe(1);
    expect(err.stderr).toContain('unknown target_standard "Pulley"');
  });

  it("honors --filter", async () => {
    await writeFile(path.join(root, "objects", "Thing.mapping.md"), mappingDoc({}));
    await mkdir(path.join(root, "types"), { recursive: true });
    await writeFile(path.join(root, "types", "Broken.mapping.md"), "# not a mapping doc\n");
    // Without the filter the broken file fails the run; with it, only Thing is checked.
    const { stdout } = await runCli(root, ["--filter", "objects/**"]);
    expect(stdout).toMatch(/OK: checked 1 mapping file\(s\), 0 errors/);
  });

  it("requires reason: on unmappable entries in complete mappings", async () => {
    await writeFile(
      path.join(root, "objects", "Thing.mapping.md"),
      mappingDoc({
        fieldsYaml: ["fields:", "  name:", "    kind: unmappable", "    target: null"].join("\n"),
      })
    );
    const err = (await runCli(root).catch((e) => e)) as { code: number; stderr: string };
    expect(err.code).toBe(1);
    expect(err.stderr).toContain("require a reason");
  });
});

describe("validate-mappings CLI (real repo)", () => {
  it("validates the actual repository tree cleanly", async () => {
    const { stdout } = await runCli(REPO_ROOT);
    expect(stdout).toMatch(/OK: checked \d+ mapping file\(s\), 0 errors/);
  }, 60_000);
});
