import { loadGreenCorpus } from "../scripts/lib/core-corpus.js";
import { buildInverseCoverage } from "../scripts/lib/inverse-coverage.js";
import { collectMappingFiles, loadMappingDocuments } from "../scripts/lib/mapping-input.js";
import {
  buildMappingExplorerData,
  renderMappingExplorerAppJs,
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
    expect(explorer.targets.find((target) => target.name === "PointOfContact")).toMatchObject({
      status: "nested-obj",
      nestedNamespace: "ocf",
      support: true,
    });
    expect(explorer.targets.find((target) => target.name === "OptionGrantDocuments")).toMatchObject(
      {
        status: "gap",
        noSource: true,
        support: false,
      }
    );
    expect(
      explorer.targets.find((target) => target.name === "CapitalizationTableSummary")
    ).toMatchObject({
      status: "report-rollup",
      noSource: true,
      support: false,
    });
    expect(explorer.metrics.actionableTargets).toBe(1);
    expect(explorer.metrics.explainedTargets).toBe(12);
  });

  it("keeps gap pages actionable with mapping-specific issue links", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments);
    const source = explorer.sources.find((item) => item.noTarget);
    const target = explorer.targets.find((item) => item.status === "gap");

    expect(source).toBeDefined();
    expect(target).toBeDefined();
    expect(renderMappingExplorerSourcePage(source!)).toContain(
      "issues/new?template=mapping-question.yml"
    );
    expect(renderMappingExplorerTargetPage(target!)).toContain(
      "issues/new?title=%5BMapping+question%5D"
    );
    const index = renderMappingExplorerIndex(explorer);
    expect(index).toContain("Cap-table data map");
    expect(index).toContain("OCF records");
    expect(index).toContain("Open Cap Table Coalition");
    expect(index).toContain("OCT-coalition-seal_horizontal%202.png");
    expect(index).toContain(`All (${explorer.metrics.sourceObjects})`);
    expect(index).toContain(
      `Mapped (${explorer.metrics.sourceObjects - explorer.metrics.noTargetSources})`
    );
    expect(index).toContain(`All (${explorer.metrics.targetObjects})`);
    expect(index).toContain(`Mapped (${explorer.metrics.mappedTargets})`);
    expect(index).toContain(`Needs a decision (${explorer.metrics.actionableTargets})`);
    expect(index).toContain(`No standalone record (${explorer.metrics.explainedTargets})`);
    expect(index).toContain(`Support (${explorer.metrics.supportTargets})`);
    expect(index).toContain('data-filter-button="support"');
    expect(index).toContain('data-filter-button="explained"');
    expect(index).toContain("Target page scope");
    expect(index).toContain("Full inventory + analysis →");
    expect(index).toContain('data-side-tab="source"');
    expect(index).toContain('data-side-tab="target"');
    expect(index).toContain('data-side-panel="target"');
    expect(index).toMatch(/styles\.css\?v=[a-z0-9]+/);
    expect(index).toMatch(/app\.js\?v=[a-z0-9]+/);
    expect(renderMappingExplorerAppJs()).toContain(
      "setSide(sideFromHash(), Boolean(window.location.hash))"
    );
    const targetDirectory = index.split('data-directory="Carta records">')[1] ?? "";
    expect(targetDirectory).toContain('data-status="support"');
    expect(targetDirectory).toContain(">PointOfContact</a>");
  });

  it("keeps directory cards inside responsive grid tracks", () => {
    const css = renderMappingExplorerCss();

    expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(css).toContain(".direction-tabs");
    expect(css).toContain("appearance: none");
    expect(css).toContain(".card { min-width: 0;");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain(".nav-links { display: flex; flex-wrap: wrap;");
    expect(css).toContain(".nav-row { height: auto; min-height: 72px;");
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

  it("renders the concrete Carta property for Document mappings", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments);
    const document = explorer.sources.find((item) => item.entity === "Document");

    expect(document).toBeDefined();
    const path = document!.fields.find((field) => field.field === "path");
    const uri = document!.fields.find((field) => field.field === "uri");
    expect(path?.targets).toEqual([
      {
        object: "Document",
        property: "fileId",
        pointer: "#/$defs/Document/properties/fileId",
      },
    ]);
    expect(uri?.targets).toEqual(path?.targets);

    const page = renderMappingExplorerSourcePage(document!);
    expect(page).toContain("Document.fileId");
    expect(page).not.toContain("Document.field");
  });

  it("shows Carta and OCF schema types in the target slot ledger", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments);
    const target = explorer.targets.find((item) => item.name === "WarrantIssuanceTransaction");
    const quantity = target?.slots.find((slot) => slot.property === "quantity");

    expect(quantity?.type).toBe("Decimal");
    expect(quantity?.evidence[0]?.sourceType).toBe("Numeric");

    const money = explorer.targets
      .find((item) => item.name === "Money")
      ?.slots.find((slot) => slot.property === "amount");
    expect(money?.type).toBe("Decimal");
    expect(money?.evidence[0]?.sourceType).toBe("Numeric");

    const page = renderMappingExplorerTargetPage(target!);
    expect(page).toContain("Carta property / type");
    expect(page).toContain(">Decimal ↗</a>");
    expect(page).toContain(">Numeric ↗</a>");
    expect(page).toContain("target-schema/Carta.schema.json");
    expect(page).toContain("types/Numeric.schema.json");
  });
});
