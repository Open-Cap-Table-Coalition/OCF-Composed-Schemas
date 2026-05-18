import { mkdir, mkdtemp, readFile, rm, writeFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileP = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(REPO_ROOT, "scripts/generate-mapping-skeletons.ts");
const TS_NODE_LOADER = pathToFileURL(path.join(REPO_ROOT, "node_modules/ts-node/esm.mjs")).href;

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
  return execFileP(process.execPath, ["--loader", TS_NODE_LOADER, "--no-warnings", CLI, ...args], {
    cwd,
  });
}

describe("generate-mapping-skeletons CLI", () => {
  let root: string;
  beforeEach(async () => {
    root = await makeTree();
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

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
    await expect(stat(path.join(root, "objects", "Foo.mapping.md"))).rejects.toThrow(/ENOENT/);
  });
});
