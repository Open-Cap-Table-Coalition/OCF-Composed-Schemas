import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage } from "../scripts/lib/inverse-coverage.js";
import {
  buildMappingExplorerData,
  renderMappingExplorerIndex,
  renderMappingExplorerSourcePage,
  renderMappingExplorerTargetPage,
} from "../scripts/lib/mapping-explorer.js";

describe("mapping explorer", () => {
  it("projects every derived source and target into browseable pages", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    const inverse = buildInverseCoverage(corpus);
    const explorer = buildMappingExplorerData(corpus, inverse, ["Stakeholder.svg"]);

    expect(explorer.sources).toHaveLength(corpus.objects.length);
    expect(explorer.targets).toHaveLength(inverse.defs.length);
    expect(explorer.metrics.noTargetSources).toBe(
      explorer.sources.filter((source) => source.noTarget).length
    );
    expect(explorer.metrics.noSourceTargets).toBe(inverse.candidates.length);
    expect(explorer.targets.find((target) => target.name === "Stakeholder")?.svgFile).toBe(
      "Stakeholder.svg"
    );
  });

  it("keeps gap pages actionable with mapping-specific issue links", async () => {
    const corpus = await loadGreenCorpus(process.cwd());
    const inverse = buildInverseCoverage(corpus);
    const explorer = buildMappingExplorerData(corpus, inverse, []);
    const source = explorer.sources.find((item) => item.noTarget);
    const target = explorer.targets.find((item) => item.noSource);

    expect(source).toBeDefined();
    expect(target).toBeDefined();
    expect(renderMappingExplorerSourcePage(source!)).toContain(
      "issues/new?template=mapping-question.yml"
    );
    expect(renderMappingExplorerTargetPage(target!)).toContain(
      "issues/new?title=%5BMapping+question%5D"
    );
    expect(renderMappingExplorerIndex(explorer)).toContain("OCF source objects");
  });
});
