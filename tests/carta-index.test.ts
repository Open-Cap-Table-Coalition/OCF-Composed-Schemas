import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildCartaIndex } from "../scripts/build-carta-index.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("Carta.index.json freshness", () => {
  it("matches a fresh generation from Carta.schema.json", async () => {
    const bundle = JSON.parse(
      await readFile(path.join(REPO_ROOT, "target-schema/Carta.schema.json"), "utf8")
    );
    const committed = JSON.parse(
      await readFile(path.join(REPO_ROOT, "target-schema/Carta.index.json"), "utf8")
    );
    // If this fails, the bundle changed without regenerating the index:
    // run `npm run carta:index`.
    expect(buildCartaIndex(bundle)).toEqual(committed);
  });
});
