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
import { loadCartaSchemaResources } from "../scripts/lib/carta-schema.js";
import { cartaCoverageIssueUrl } from "../scripts/lib/question-links.js";

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

    expect(explorer.sources).toHaveLength(
      corpus.objects.filter((object) => !object.aliasOf).length
    );
    expect(explorer.metrics.compatibilityWrappers).toBe(
      corpus.objects.filter((object) => object.aliasOf).length
    );
    expect(explorer.sources.some((source) => source.entity.startsWith("PlanSecurity"))).toBe(false);
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
    expect(
      explorer.targets.find((target) => target.name === "OptionGrantDocuments")
    ).toBeUndefined();
    expect(
      explorer.targets.find((target) => target.name === "CapitalizationTableSummary")
    ).toBeUndefined();
    expect(explorer.targets.find((target) => target.name === "OptionExercise")).toMatchObject({
      status: "workflow-gap",
      noSource: true,
      support: false,
    });
    expect(explorer.metrics.actionableTargets).toBe(0);
    expect(explorer.metrics.explainedTargets).toBe(1);
  });

  it("keeps gap pages actionable with mapping-specific issue links", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments);
    const source = explorer.sources.find((item) => item.noTarget);
    const target = explorer.targets.find((item) => item.status === "workflow-gap");

    expect(source).toBeDefined();
    expect(target).toBeDefined();
    expect(renderMappingExplorerSourcePage(source!)).toContain(
      "issues/new?template=mapping-question.yml"
    );
    expect(renderMappingExplorerTargetPage(target!)).toContain("No standalone OCF source record");
    expect(renderMappingExplorerTargetPage(target!)).not.toContain("Open coverage issue ↗");

    // The June 22 bundle leaves zero real definitions in the actionable branch
    // (`noSource` + status gap/review), so cover it with a synthetic target rather
    // than losing the assertion that an actionable gap offers a coverage issue link.
    for (const status of ["gap", "review"] as const) {
      const actionable = { ...target!, status, sourceMappings: [] };
      const page = renderMappingExplorerTargetPage(actionable);
      expect(page).toContain("No OCF source record or field mapping is currently derived.");
      expect(page).toContain("Open coverage issue ↗");
      expect(page).toContain(cartaCoverageIssueUrl(actionable.name).replace(/&/gu, "&amp;"));
      expect(page).not.toContain("No standalone OCF source record");
    }

    const index = renderMappingExplorerIndex(explorer);
    expect(index).toContain("Cap-table data map");
    expect(index).toContain("OCF records");
    expect(index).toContain("Open Cap Table Coalition");
    expect(index).toContain("OCT-coalition-seal_horizontal%202.png");
    expect(index).toContain("Choose a side, then open a record.");
    expect(index).toContain('class="proposal-banner"');
    expect(index.indexOf('id="carta-core"')).toBeLessThan(index.indexOf('class="hero"'));
    expect(index).toContain("The Flow viewer shows relationships across records");
    expect(index).not.toContain('class="metrics-grid"');
    expect(index).not.toContain('class="feature-grid"');
    expect(index).not.toContain('class="featured-visual"');
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
    expect(css).toContain(".map-guide { display: grid;");
    expect(css).toContain(".proposal-banner { display: grid;");
    expect(css).toContain(".proposal-banner .mini-chip, .proposal-main-action { width: 100%; }");
    expect(css).toContain(".map-guide-steps { display: grid; grid-template-columns: repeat(3");
    expect(css).toContain(
      ".hero-orbit { height: 390px; position: relative; display: grid; place-items: center; overflow: hidden; }"
    );
    expect(css).toContain(".map-guide { background: #f1f1ff; border-color: rgba(42,48,200,.22); }");
    expect(css).toContain(".hero + .map-guide { margin-top: 42px; }");
  });

  it("surfaces the tracked Carta schema resources on the overview", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const resources = await loadCartaSchemaResources(process.cwd());
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments, resources);
    const index = renderMappingExplorerIndex(explorer);

    expect(resources.schemaPath).toBe("target-schema/Carta.schema.json");
    expect(resources.schemaUrl).toBe(
      "https://drive.google.com/file/d/1m9MDcazr1svUk2BCqRkR38R0bCgwBql0/view?usp=share_link"
    );
    expect(resources.reports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "target-schema/Explainer.md",
          url: "https://docs.google.com/document/d/1aomMxmO13SkVPsbLbJnUxtFN3juLZFMMUysNnpIC_eU/edit?usp=share_link",
        }),
      ])
    );
    expect(resources.metadata.map((item) => item.label)).toEqual(
      expect.arrayContaining(["Version", "Standard", "Source", "Uploaded", "SHA-256"])
    );
    expect(index).toContain('id="carta-core"');
    expect(index).toContain("1 · Read Carta’s proposed OCF Core ↗");
    expect(index).toContain("2 · Read Carta’s explainer ↗");
    expect(index).toContain("Comment on the proposal ↗");
    expect(index).toContain("scroll below to view mappings to and from the proposed Carta schema");
    expect(index).not.toContain("Target-schema notes ↗");
    expect(index).toContain("Version:");
    expect(index).not.toContain("Uploader:");

    const withReport = {
      ...resources,
      reports: [
        {
          path: "target-schema/Carta.report.md",
          label: "Carta Report",
          url: "https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/blob/main/target-schema/Carta.report.md",
        },
      ],
    };
    const reportIndex = renderMappingExplorerIndex(
      buildMappingExplorerData(corpus, inverse, [], mappingDocuments, withReport)
    );
    expect(reportIndex).toContain("2 · Read Carta Report ↗");
  });

  it("renders authored mapping notes and open/closed questions", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const stakeholder = mappingDocuments.get("objects/Stakeholder.mapping.md");
    expect(stakeholder?.questions?.length).toBeGreaterThan(0);
    const firstQuestion = stakeholder!.questions![0]!;
    const openQuestion = {
      ...firstQuestion,
      answered: false,
      answeredBy: "—",
      answer: "Open: confirm the target policy.",
    };
    const closedQuestion = {
      ...firstQuestion,
      answered: true,
      answeredBy: "reviewer@example.com",
      answer: "Confirmed for the current target policy.",
    };
    const targetQuestion = {
      ...firstQuestion,
      property: "addresses[].country",
      target: "OptionExercise.state",
    };
    const documents = new Map(mappingDocuments);
    documents.set("objects/Stakeholder.mapping.md", {
      ...stakeholder!,
      questions: [openQuestion, closedQuestion, targetQuestion],
    });
    const explorer = buildMappingExplorerData(corpus, inverse, [], documents);
    const source = explorer.sources.find((item) => item.entity === "Stakeholder");
    const target = explorer.targets.find((item) => item.name === "OptionExercise");
    const transfer = explorer.sources.find((item) => item.entity === "EquityCompensationTransfer");

    expect(source?.questions).toHaveLength(3);
    expect(renderMappingExplorerSourcePage(source!)).toContain("OPEN");
    expect(renderMappingExplorerSourcePage(source!)).toContain("CLOSED");
    expect(renderMappingExplorerSourcePage(source!)).toContain("reviewer@example.com");
    expect(renderMappingExplorerSourcePage(source!)).toContain(
      "issues/new?template=mapping-question.yml"
    );
    expect(target?.questions).toHaveLength(2);
    expect(renderMappingExplorerTargetPage(target!)).toContain("Questions about this target");
    expect(renderMappingExplorerTargetPage(target!)).toContain("OptionExercise.state");
    expect(transfer?.notes.some((note) => note.includes("key causal information"))).toBe(true);
    expect(renderMappingExplorerSourcePage(transfer!)).toContain(
      "cannot represent this event without losing key causal information"
    );
  });

  it("renders the concrete Carta property, never a placeholder name", async () => {
    const { corpus, inverse, mappingDocuments } = await loadExplorer();
    const explorer = buildMappingExplorerData(corpus, inverse, [], mappingDocuments);

    // Positive case: a live pointer renders as Object.property, derived from the
    // pointer itself rather than a serialized property name.
    const issuer = explorer.sources.find((item) => item.entity === "Issuer");
    expect(issuer).toBeDefined();
    const legalName = issuer!.fields.find((field) => field.field === "legal_name");
    expect(legalName?.targets).toEqual([
      {
        object: "Issuer",
        property: "legalName",
        pointer: "#/$defs/Issuer/properties/legalName",
      },
    ]);
    expect(renderMappingExplorerSourcePage(issuer!)).toContain("Issuer.legalName");

    // Regression guard on targetLabel(): no source page may render the generic
    // placeholder label in place of a real property name.
    for (const source of explorer.sources) {
      expect(renderMappingExplorerSourcePage(source)).not.toMatch(/>[A-Za-z]+\.field</u);
    }

    // Document lost its Carta definition in the June 22 bundle, so path/uri now
    // resolve to no target at all rather than to Document.fileId.
    const document = explorer.sources.find((item) => item.entity === "Document");
    expect(document).toBeDefined();
    const path = document!.fields.find((field) => field.field === "path");
    const uri = document!.fields.find((field) => field.field === "uri");
    expect(path?.targets).toEqual([]);
    expect(uri?.targets).toEqual(path?.targets);
    expect(renderMappingExplorerSourcePage(document!)).not.toContain("Document.fileId");
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
