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

    expect(result.wrote.sort()).toEqual(["objects/Foo.mapping.md", "types/Bar.mapping.md"].sort());
    expect(result.skipped).toEqual([]);

    const fooMd = await readFile(path.join(root, "objects", "Foo.mapping.md"), "utf8");
    expect(fooMd).toContain("ocf_title: Foo");
    expect(fooMd).toContain("      SWEET: TODO");
  });

  it("is idempotent: a second run with no flags is a no-op", async () => {
    const registry = await loadRegistry(root);
    await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: false,
      generatedDate: "2026-05-18",
      verbose: false,
    });
    const beforeMtime = (await stat(path.join(root, "objects", "Foo.mapping.md"))).mtimeMs;

    await new Promise((r) => setTimeout(r, 10));

    const result = await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: false,
      generatedDate: "2026-05-19",
      verbose: false,
    });
    expect(result.wrote).toEqual([]);
    expect(result.skipped.sort()).toEqual(
      ["objects/Foo.mapping.md", "types/Bar.mapping.md"].sort()
    );

    const afterMtime = (await stat(path.join(root, "objects", "Foo.mapping.md"))).mtimeMs;
    expect(afterMtime).toBe(beforeMtime);
  });

  it("--force overwrites and updates last_generated", async () => {
    const registry = await loadRegistry(root);
    await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: false,
      generatedDate: "2026-05-18",
      verbose: false,
    });

    const result = await walkAndWrite({
      repoRoot: root,
      registry,
      force: true,
      dryRun: false,
      generatedDate: "2026-06-01",
      verbose: false,
    });
    expect(result.wrote.length).toBe(2);

    const md = await readFile(path.join(root, "objects", "Foo.mapping.md"), "utf8");
    expect(md).toContain("last_generated: 2026-06-01");
    expect(md).not.toContain("last_generated: 2026-05-18");
  });

  it("--dry-run writes nothing", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: true,
      generatedDate: "2026-05-18",
      verbose: false,
    });
    expect(result.wrote.length).toBe(2);
    await expect(stat(path.join(root, "objects", "Foo.mapping.md"))).rejects.toThrow(/ENOENT/);
  });

  it("--filter restricts to matching schemas", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: false,
      filter: "objects/**",
      generatedDate: "2026-05-18",
      verbose: false,
    });
    expect(result.wrote).toEqual(["objects/Foo.mapping.md"]);
  });

  it("ignores schemas outside objects/ and types/", async () => {
    const registry = await loadRegistry(root);
    const result = await walkAndWrite({
      repoRoot: root,
      registry,
      force: false,
      dryRun: false,
      generatedDate: "2026-05-18",
      verbose: false,
    });
    expect(result.wrote.some((p) => p.startsWith("enums/"))).toBe(false);
  });
});
