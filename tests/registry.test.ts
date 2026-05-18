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
