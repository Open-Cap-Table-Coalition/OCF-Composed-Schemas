import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage } from "../scripts/lib/inverse-coverage.js";
import { collectMappingFiles, loadMappingDocuments } from "../scripts/lib/mapping-input.js";
import {
  buildMappingExplorerData,
  renderMappingExplorerCss,
  renderMappingExplorerIndex,
  renderMappingExplorerSourcePage,
  renderMappingExplorerTargetPage,
} from "../scripts/lib/mapping-explorer.js";

describe("mapping explorer", () => {
  async function loadExplorer() {
    const repoRoot = process.cwd();
    const [corpus, files] = await Promise.all([
      loadGreenCorpus(repoRoot),
      collectMappingFiles(repoRoot),
    ]);
    const mappingDocuments = await loadMappingDocuments(repoRoot, files);
    return { corpus, inverse: buildInverseCoverage(corpus), mappingDocuments };
  }

  it("projects every derived source and target into browseable pages", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(
      corpus,
      inverse,
      ["Stakeholder.svg"],
      mappingDocuments
    );

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
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments);
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
    const index = renderMappingExplorerIndex(explorer);
    expect(index).toContain("Carta OCF Core Mapping Explorer");
    expect(index).toContain("OCF source objects");
    expect(index).toContain(`All (${explorer.sources.length})`);
    expect(index).toContain(`Mapped (${explorer.sources.filter((item) => !item.noTarget).length})`);
    expect(index).toContain(`All (${explorer.targets.length})`);
    expect(index).toContain(`Mapped (${explorer.metrics.mappedTargets})`);
    expect(index).toContain(`Gaps (${explorer.metrics.noSourceTargets})`);
    expect(index).toContain(`Support (${explorer.metrics.supportTargets})`);
    expect(index).toContain("Target page scope");
    expect(index).toContain("Full inventory + analysis →");
  });

  it("keeps directory cards inside responsive grid tracks", () => {
    const css = renderMappingExplorerCss();

    expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(css).toContain(".card { min-width: 0;");
    expect(css).toContain("overflow-wrap: anywhere");
  });

  it("renders authored mapping notes and open/closed questions", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const stakeholder = mappingDocuments.get("objects/Stakeholder.mapping.md");
    expect(stakeholder?.questions?.length).toBeGreaterThan(0);
    const firstQuestion = stakeholder!.questions![0]!;
    const closedQuestion = {
      ...firstQuestion,
      answered: true,
      answeredBy: "reviewer@example.com",
      answer: "Confirmed for the current target policy.",
    };
    const targetQuestion = {
      ...firstQuestion,
      property: "addresses[].country",
      target: "Compliance.countryOfResidency",
    };
    const documents = new Map(mappingDocuments);
    documents.set("objects/Stakeholder.mapping.md", {
      ...stakeholder!,
      questions: [firstQuestion, closedQuestion, targetQuestion],
    });
    const explorer = buildMappingExplorerData(corpus, inverse, [], documents);
    const source = explorer.sources.find((item) => item.entity === "Stakeholder");
    const target = explorer.targets.find((item) => item.name === "Compliance");
    const transfer = explorer.sources.find((item) => item.entity === "EquityCompensationTransfer");

    expect(source?.questions).toHaveLength(3);
    expect(renderMappingExplorerSourcePage(source!)).toContain("OPEN");
    expect(renderMappingExplorerSourcePage(source!)).toContain("CLOSED");
    expect(renderMappingExplorerSourcePage(source!)).toContain("reviewer@example.com");
    expect(renderMappingExplorerSourcePage(source!)).toContain(
      "issues/new?template=mapping-question.yml"
    );
    expect(target?.questions).toHaveLength(3);
    expect(renderMappingExplorerTargetPage(target!)).toContain("Questions about this target");
    expect(renderMappingExplorerTargetPage(target!)).toContain("Compliance.countryOfResidency");
    expect(transfer?.notes.some((note) => note.includes("Cancellation + issuance"))).toBe(true);
    expect(renderMappingExplorerSourcePage(transfer!)).toContain(
      "Cancellation + issuance is not an effective Carta replacement"
    );
  });
});
