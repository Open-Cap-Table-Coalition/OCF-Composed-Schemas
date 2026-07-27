import path from "node:path";
import { readFile } from "node:fs/promises";

import { deriveCore } from "../scripts/lib/core-pipeline.js";
import { renderUnmappedInventory } from "../scripts/derive-core-unmapped-inventory.js";
import { renderLossyInventory } from "../scripts/derive-core-lossy-inventory.js";

// The source-side analysis docs are drift-gated by core:check (gate 3), same as the
// packages and reports. They render the STRICT derivation.
describe("analysis docs (core:check gate 3)", () => {
  it("render deterministically — two runs over the same corpus are byte-identical", async () => {
    const [s1, s2] = await Promise.all([deriveCore(process.cwd()), deriveCore(process.cwd())]);
    expect(renderUnmappedInventory(s1)).toEqual(renderUnmappedInventory(s2));
    expect(renderLossyInventory(s1)).toEqual(renderLossyInventory(s2));
  });

  it("the committed docs/*.md match a fresh render (must rebuild after a change)", async () => {
    const strict = await deriveCore(process.cwd());
    const docs: Record<string, string> = {
      "core-unmapped-inventory.md": renderUnmappedInventory(strict),
      "core-lossy-inventory.md": renderLossyInventory(strict),
    };
    for (const [name, expected] of Object.entries(docs)) {
      const onDisk = await readFile(path.join(process.cwd(), "docs", name), "utf8");
      expect(onDisk).toEqual(expected);
    }
  });
});
