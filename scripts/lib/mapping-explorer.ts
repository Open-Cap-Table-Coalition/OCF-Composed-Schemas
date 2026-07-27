import { cartaCoverageIssueUrl, mappingFileUrl, mappingIssueUrl } from "./question-links.js";
import type {
  CartaDefCoverage,
  CartaSlotCoverage,
  InverseCoverageLedger,
} from "./inverse-coverage.js";
import type { Corpus, GreenObject, MappingEdge } from "./core-corpus.js";
import { targetPointerParts } from "./mapping-report.js";
import type { MappingReportDocument } from "./mapping-report.js";
import type { MappingQuestion } from "./mapping-questions.js";
import { questionTargetParts } from "./mapping-questions.js";

const MAPPING_EXPLORER_TITLE = "Carta OCF Core Mapping Explorer";

export interface ExplorerTargetRef {
  object: string;
  property: string;
  pointer: string;
}

export interface ExplorerSourceField {
  variant: string;
  field: string;
  kind: string;
  targets: ExplorerTargetRef[];
  issueUrl: string;
}

export interface ExplorerQuestion extends MappingQuestion {
  mappingRel: string;
  mappingUrl: string;
  issueUrl: string;
}

export interface ExplorerSource {
  entity: string;
  slug: string;
  rel: string;
  mappingUrl: string;
  issueUrl: string;
  aliasOf?: string;
  noTarget: boolean;
  edgeCount: number;
  targetNames: string[];
  fields: ExplorerSourceField[];
  notes: string[];
  questions: ExplorerQuestion[];
}

export interface ExplorerEvidence {
  rel: string;
  source: string;
  variant: string;
  field?: string;
  kind?: string;
  scope: MappingEdge["scope"];
  issueUrl: string;
}

export interface ExplorerTargetSlot {
  property: string;
  status: CartaSlotCoverage["status"];
  evidence: ExplorerEvidence[];
}

export interface ExplorerTarget {
  name: string;
  slug: string;
  status: CartaDefCoverage["status"];
  reason?: string;
  properties: string[];
  slots: ExplorerTargetSlot[];
  structuralParents: string[];
  sourceMappings: ExplorerEvidence[];
  questions: ExplorerQuestion[];
  noSource: boolean;
  support: boolean;
  svgFile?: string;
  issueUrl: string;
}

export interface MappingExplorerData {
  sources: ExplorerSource[];
  targets: ExplorerTarget[];
  artifactNames: string[];
  metrics: {
    sourceObjects: number;
    noTargetSources: number;
    targetObjects: number;
    mappedTargets: number;
    noSourceTargets: number;
    supportTargets: number;
    visualTargets: number;
  };
}

interface DirectoryFilterCounts {
  all: number;
  mapped: number;
  gap: number;
}

export function explorerSlug(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function edgeTarget(edge: MappingEdge): ExplorerTargetRef {
  const parts = targetPointerParts(edge.target);
  return { object: parts.object, property: parts.relative, pointer: edge.target };
}

function uniqueTargets(edges: readonly MappingEdge[]): ExplorerTargetRef[] {
  return [...new Map(edges.map((edge) => [edge.target, edgeTarget(edge)])).values()].sort(
    (a, b) => a.object.localeCompare(b.object) || a.property.localeCompare(b.property)
  );
}

function sourceEdgesFor(corpus: Corpus, object: GreenObject): MappingEdge[] {
  return corpus.mappingEdges.filter(
    (edge) => edge.rel === object.rel && edge.sourceKind === "object"
  );
}

function sourceFields(object: GreenObject, edges: readonly MappingEdge[]): ExplorerSourceField[] {
  const byVariantField = new Map<string, MappingEdge[]>();
  for (const edge of edges) {
    if (!edge.field) continue;
    const key = `${edge.variant}\u0000${edge.field}`;
    const list = byVariantField.get(key) ?? [];
    list.push(edge);
    byVariantField.set(key, list);
  }

  const fields: ExplorerSourceField[] = [];
  for (const [variant, entries] of object.variants) {
    for (const field of Object.keys(entries).sort()) {
      const fieldEdges = byVariantField.get(`${variant}\u0000${field}`) ?? [];
      fields.push({
        variant,
        field,
        kind: fieldEdges.find((edge) => edge.kind)?.kind ?? "unmappable",
        targets: uniqueTargets(fieldEdges),
        issueUrl: mappingIssueUrl(object.rel, field),
      });
    }
  }
  return fields;
}

function evidenceFor(edge: MappingEdge): ExplorerEvidence {
  return {
    rel: edge.rel,
    source: edge.source,
    variant: edge.variant,
    field: edge.field,
    kind: edge.kind,
    scope: edge.scope,
    issueUrl: mappingIssueUrl(edge.rel, edge.field ?? null),
  };
}

function evidenceKey(evidence: ExplorerEvidence): string {
  return [
    evidence.rel,
    evidence.source,
    evidence.variant,
    evidence.field ?? "",
    evidence.scope,
  ].join("\u0000");
}

function uniqueEvidence(edges: readonly MappingEdge[]): ExplorerEvidence[] {
  return [
    ...new Map(edges.map((edge) => [evidenceKey(evidenceFor(edge)), evidenceFor(edge)])).values(),
  ].sort(
    (a, b) =>
      a.source.localeCompare(b.source) ||
      a.variant.localeCompare(b.variant) ||
      (a.field ?? "").localeCompare(b.field ?? "")
  );
}

function questionSort(left: ExplorerQuestion, right: ExplorerQuestion): number {
  return (
    Number(left.answered) - Number(right.answered) ||
    (left.property ?? "").localeCompare(right.property ?? "") ||
    (left.target ?? "").localeCompare(right.target ?? "") ||
    left.mappingRel.localeCompare(right.mappingRel) ||
    left.line - right.line
  );
}

function explorerQuestion(mappingRel: string, question: MappingQuestion): ExplorerQuestion {
  return {
    ...question,
    mappingRel,
    mappingUrl: mappingFileUrl(mappingRel),
    issueUrl: mappingIssueUrl(mappingRel, question.property),
  };
}

function questionsForMapping(
  mappingRel: string,
  mappingDocuments: ReadonlyMap<string, MappingReportDocument>
): ExplorerQuestion[] {
  return (mappingDocuments.get(mappingRel)?.questions ?? [])
    .map((question) => explorerQuestion(mappingRel, question))
    .sort(questionSort);
}

function questionsForTarget(
  targetName: string,
  mappingDocuments: ReadonlyMap<string, MappingReportDocument>
): ExplorerQuestion[] {
  const questions: ExplorerQuestion[] = [];
  for (const [mappingRel, document] of mappingDocuments) {
    for (const question of document.questions ?? []) {
      const target = question.target === null ? null : questionTargetParts(question.target);
      if (target?.object === targetName) questions.push(explorerQuestion(mappingRel, question));
    }
  }
  return questions.sort(questionSort);
}

function targetSlots(inverse: InverseCoverageLedger, row: CartaDefCoverage): ExplorerTargetSlot[] {
  return inverse.slots
    .filter((slot) => slot.def === row.name)
    .sort((a, b) => a.property.localeCompare(b.property))
    .map((slot) => ({
      property: slot.property,
      status: slot.status,
      evidence: uniqueEvidence([...slot.edges, ...slot.structuralEdges]),
    }));
}

function targetEvidence(slots: readonly ExplorerTargetSlot[]): ExplorerEvidence[] {
  return [
    ...new Map(
      slots.flatMap((slot) => slot.evidence).map((evidence) => [evidence.rel, evidence] as const)
    ).values(),
  ].sort((a, b) => a.source.localeCompare(b.source) || a.rel.localeCompare(b.rel));
}

function isMappedTarget(row: Pick<ExplorerTarget, "status">): boolean {
  return row.status === "direct" || row.status === "type-only" || row.status === "deferred";
}

function isSupportTarget(row: Pick<ExplorerTarget, "status">): boolean {
  return row.status === "nested-obj" || row.status === "value-type";
}

export function buildMappingExplorerData(
  corpus: Corpus,
  inverse: InverseCoverageLedger,
  artifactNames: readonly string[],
  mappingDocuments: ReadonlyMap<string, MappingReportDocument>
): MappingExplorerData {
  const artifacts = [...artifactNames].filter((name) => name.endsWith(".svg")).sort();
  const artifactBySlug = new Map(
    artifacts.map((name) => [explorerSlug(name.replace(/\.svg$/, "")), name])
  );
  const sources = corpus.objects
    .map((object) => {
      const edges = sourceEdgesFor(corpus, object);
      const targetNames = [
        ...new Set(edges.map((edge) => targetPointerParts(edge.target).object)),
      ].sort();
      return {
        entity: object.entity,
        slug: explorerSlug(object.entity),
        rel: object.rel,
        mappingUrl: mappingFileUrl(object.rel),
        issueUrl: mappingIssueUrl(object.rel, null),
        aliasOf: object.aliasOf,
        noTarget: edges.length === 0,
        edgeCount: edges.length,
        targetNames,
        fields: sourceFields(object, edges),
        notes: mappingDocuments.get(object.rel)?.notes ?? [],
        questions: questionsForMapping(object.rel, mappingDocuments),
      };
    })
    .sort((a, b) => a.entity.localeCompare(b.entity));

  const candidateNames = new Set(inverse.candidates.map((row) => row.name));
  const targets = inverse.defs
    .map((row) => {
      const slots = targetSlots(inverse, row);
      const sourceMappings = targetEvidence(slots);
      const support = isSupportTarget(row);
      return {
        name: row.name,
        slug: explorerSlug(row.name),
        status: row.status,
        reason: row.reason,
        properties: row.properties,
        slots,
        structuralParents: row.structuralParents,
        sourceMappings,
        questions: questionsForTarget(row.name, mappingDocuments),
        noSource: candidateNames.has(row.name),
        support,
        svgFile: artifactBySlug.get(explorerSlug(row.name)),
        issueUrl: cartaCoverageIssueUrl(row.name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    sources,
    targets,
    artifactNames: artifacts,
    metrics: {
      sourceObjects: sources.length,
      noTargetSources: sources.filter((source) => source.noTarget).length,
      targetObjects: targets.length,
      mappedTargets: targets.filter(isMappedTarget).length,
      noSourceTargets: targets.filter((target) => target.noSource).length,
      supportTargets: targets.filter(isSupportTarget).length,
      visualTargets: targets.filter((target) => target.svgFile !== undefined).length,
    },
  };
}

function html(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function link(href: string, label: string, className = "text-link"): string {
  return `<a class="${className}" href="${html(href)}">${html(label)}</a>`;
}

function externalLink(href: string, label: string, className = "button button-quiet"): string {
  return `<a class="${className}" href="${html(href)}" target="_blank" rel="noreferrer">${html(
    label
  )}</a>`;
}

function sourceStatus(source: ExplorerSource): string {
  if (source.noTarget) return source.aliasOf ? "Inherited mapping" : "No target";
  return "Mapped";
}

function targetStatus(target: ExplorerTarget): string {
  if (target.noSource) return "No OCF source";
  if (target.support) return "Support definition";
  if (target.status === "direct") return "Mapped target";
  if (target.status === "type-only") return "Type-only evidence";
  if (target.status === "deferred") return "Deferred evidence";
  return target.status;
}

function questionCounts(questions: readonly ExplorerQuestion[]): {
  open: number;
  closed: number;
} {
  return {
    open: questions.filter((question) => !question.answered).length,
    closed: questions.filter((question) => question.answered).length,
  };
}

function questionChip(questions: readonly ExplorerQuestion[]): string {
  if (questions.length === 0) return "";
  const counts = questionCounts(questions);
  return `<span class="mini-chip question-chip">${html(counts.open)} open · ${html(
    counts.closed
  )} closed</span>`;
}

function questionRow(question: ExplorerQuestion): string {
  const property = question.property ?? question.target ?? "mapping-level";
  const target = question.target
    ? `<span class="question-target">→ ${html(question.target)}</span>`
    : "";
  const answeredBy = question.answeredBy ? ` · answered by ${html(question.answeredBy)}` : "";
  const state = question.answered ? "closed" : "open";
  return `<article class="question-row question-${state}">
    <div class="question-status"><span class="question-state question-state-${state}">${
    question.answered ? "CLOSED" : "OPEN"
  }</span><code>${html(property)}</code></div>
    <div class="question-body"><p>${html(
      question.question
    )}</p><div class="question-meta">Asked by ${html(
    question.askedBy
  )}${target}${answeredBy} · ${html(question.mappingRel)}:${html(
    question.line
  )}</div><div class="question-answer"><span>Current answer</span> ${html(
    question.answer
  )}</div></div>
    <div class="question-actions">${externalLink(
      question.issueUrl,
      "Open issue ↗",
      "question-action"
    )}${link(question.mappingUrl, "Mapping ↗", "question-mapping")}</div>
  </article>`;
}

function renderQuestionPanel(
  questions: readonly ExplorerQuestion[],
  title: string,
  description: string
): string {
  if (questions.length === 0) return "";
  const counts = questionCounts(questions);
  return `<section class="question-panel" aria-label="${html(
    title
  )}"><div class="question-panel-heading"><div><span class="eyebrow">Review threads</span><h2>${html(
    title
  )}</h2><p>${html(
    description
  )}</p></div><div class="question-tally"><span class="question-state question-state-open">${html(
    counts.open
  )} open</span><span class="question-state question-state-closed">${html(
    counts.closed
  )} closed</span></div></div><div class="question-list">${questions
    .map(questionRow)
    .join("")}</div></section>`;
}

function renderInlineMarkdown(value: string): string {
  let rendered = html(value);
  rendered = rendered.replace(/`([^`]+)`/gu, "<code>$1</code>");
  rendered = rendered.replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>");
  rendered = rendered.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gu,
    (_match, label, href) =>
      `<a class="text-link" href="${href}" target="_blank" rel="noreferrer">${label}</a>`
  );
  return rendered;
}

function renderNotesPanel(notes: readonly string[]): string {
  if (notes.length === 0) return "";
  return `<section class="notes-panel" aria-label="Mapping notes"><div class="section-heading compact"><div><span class="eyebrow">Authored context</span><h2>Notes / open questions</h2><p>These notes are rendered from the mapping document and remain part of the review record.</p></div></div><div class="notes-list">${notes
    .map((note) => `<p>${renderInlineMarkdown(note)}</p>`)
    .join("")}</div></section>`;
}

function shell(title: string, relative: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#2a30c8">
  <meta name="description" content="${MAPPING_EXPLORER_TITLE}">
  <title>${html(title)} · ${MAPPING_EXPLORER_TITLE}</title>
  <link rel="stylesheet" href="${relative}styles.css">
</head>
<body>
  <div class="page-glow page-glow-one"></div><div class="page-glow page-glow-two"></div>
  <header class="site-header"><div class="container nav-row">
    ${link(`${relative}index.html`, MAPPING_EXPLORER_TITLE, "brand")}
    <nav class="nav-links" aria-label="Primary"><a href="${relative}index.html#ocf-objects">OCF objects</a><a href="${relative}index.html#carta-targets">Carta targets</a><a href="${relative}assets/mapping-flows-interactive/index.html">Interactive viewer</a></nav>
  </div></header>
  <main class="container">${body}</main>
  <footer class="site-footer"><div class="container footer-row"><span>Generated from the green mapping corpus and inverse coverage ledger.</span><span>OCF Composed Schemas</span></div></footer>
  <script src="${relative}app.js" defer></script>
</body>
</html>`;
}

function metric(value: number, label: string, tone = ""): string {
  return `<div class="metric ${tone}"><strong>${html(value)}</strong><span>${html(
    label
  )}</span></div>`;
}

function filterBar(group: string, counts: DirectoryFilterCounts): string {
  return `<div class="filter-controls" data-filter-group="${html(
    group
  )}"><input data-filter-input type="search" placeholder="Search ${html(
    group
  )}…" aria-label="Search ${html(
    group
  )}"><div class="filter-buttons"><button class="filter-button is-active" data-filter-button="all" type="button">All (${html(
    counts.all
  )})</button><button class="filter-button" data-filter-button="mapped" type="button">Mapped (${html(
    counts.mapped
  )})</button><button class="filter-button" data-filter-button="gap" type="button">Gaps (${html(
    counts.gap
  )})</button></div></div>`;
}

function targetScopeLegend(data: MappingExplorerData): string {
  return `<aside class="directory-legend" aria-label="Carta target directory scope"><div><span class="eyebrow">Target page scope</span><p><strong>Mapped (${html(
    data.metrics.mappedTargets
  )})</strong> are standalone Carta definitions with OCF evidence. <strong>Gaps (${html(
    data.metrics.noSourceTargets
  )})</strong> are definitions retained for candidate and coverage review. <strong>Support (${html(
    data.metrics.supportTargets
  )})</strong> are nested object or value-type definitions shown for context, not standalone mapping targets.</p></div><div class="legend-links">${link(
    "assets/mapping-inverse-report.md",
    "Full inventory + analysis →"
  )}</div></aside>`;
}

function sourceCard(source: ExplorerSource): string {
  const targets = source.targetNames.length
    ? source.targetNames
        .slice(0, 3)
        .map((name) => `<span class="mini-chip">${html(name)}</span>`)
        .join("")
    : '<span class="muted">No Carta target evidence</span>';
  return `<article class="card directory-card${
    source.noTarget ? " is-gap" : ""
  }" data-card data-status="${source.noTarget ? "gap" : "mapped"}" data-search="${html(
    `${source.entity} ${source.rel} ${source.targetNames.join(" ")}`
  )}">
    <div class="card-top"><span class="eyebrow">OCF object</span><span class="status-pill ${
      source.noTarget ? "status-gap" : "status-ok"
    }">${html(sourceStatus(source))}</span></div>
    <h3>${link(`sources/${source.slug}.html`, source.entity, "card-title")}</h3>
    <p class="card-copy">${source.edgeCount} executable mapping edge${
    source.edgeCount === 1 ? "" : "s"
  } · ${source.fields.length} source fields.</p>
    <div class="chip-row">${targets}${questionChip(source.questions)}</div>
    <div class="card-footer">${externalLink(
      source.issueUrl,
      "Open mapping issue",
      "text-link issue-link"
    )}</div>
  </article>`;
}

function targetCard(target: ExplorerTarget): string {
  const statusClass = target.noSource
    ? "status-gap"
    : target.support
    ? "status-support"
    : "status-ok";
  const activeStatus = target.noSource ? "gap" : target.support ? "support" : "mapped";
  const visual = target.svgFile ? '<span class="mini-chip">SVG visual</span>' : "";
  return `<article class="card directory-card${
    target.noSource ? " is-gap" : ""
  }" data-card data-status="${activeStatus}" data-search="${html(
    `${target.name} ${target.status} ${target.reason ?? ""}`
  )}">
    <div class="card-top"><span class="eyebrow">Carta target</span><span class="status-pill ${statusClass}">${html(
    targetStatus(target)
  )}</span></div>
    <h3>${link(`targets/${target.slug}.html`, target.name, "card-title")}</h3>
    <p class="card-copy">${
      target.slots.filter((slot) => slot.status !== "empty").length
    } evidence-bearing slots · ${
    target.slots.filter((slot) => slot.status === "empty").length
  } empty slots.</p>
    <div class="chip-row"><span class="mini-chip">${html(
      target.sourceMappings.length
    )} source mapping${target.sourceMappings.length === 1 ? "" : "s"}</span>${visual}</div>
    <div class="chip-row">${questionChip(target.questions)}</div>
    <div class="card-footer">${
      target.noSource
        ? externalLink(target.issueUrl, "Open coverage issue", "text-link issue-link")
        : link(`targets/${target.slug}.html`, "Inspect target →")
    }</div>
  </article>`;
}

export function renderMappingExplorerIndex(data: MappingExplorerData): string {
  const featured = data.artifactNames[0];
  const featuredVisual = featured
    ? `<div class="featured-visual"><img src="assets/mapping-flows/${html(
        featured
      )}" alt="Generated ${html(
        featured.replace(/\.svg$/, "")
      )} mapping visual" loading="lazy"><div class="visual-caption"><span>Generated SVG artifact</span>${link(
        `targets/${explorerSlug(featured.replace(/\.svg$/, ""))}.html`,
        "Open target →"
      )}</div></div>`
    : '<div class="featured-visual empty-state"><span>No standalone SVG artifacts generated.</span></div>';

  return shell(
    "Overview",
    "",
    `<section class="hero"><div class="hero-copy"><span class="eyebrow accent">OCF ↔ Carta / generated explorer</span><h1>See every mapped edge — and every honest gap.</h1><p class="hero-lede">A calm, searchable front door for the mapping corpus. Browse source objects, Carta targets, generated SVGs, and the interactive flow viewer without losing the evidence underneath.</p><div class="hero-actions"><a class="button button-primary" href="#ocf-objects">Browse the corpus</a><a class="button button-quiet" href="assets/mapping-flows-interactive/index.html">Open interactive viewer ↗</a></div></div><div class="hero-orbit"><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><div class="orbit-core"><span>single</span><strong>source</strong><span>of truth</span></div><span class="orbit-tag tag-one">OCF</span><span class="orbit-tag tag-two">CARTA</span><span class="orbit-tag tag-three">SVG</span></div></section>
    <section class="metrics-grid" aria-label="Coverage summary">${metric(
      data.metrics.sourceObjects,
      "OCF source objects"
    )}${metric(data.metrics.noTargetSources, "with no target evidence", "metric-warn")}${metric(
      data.metrics.targetObjects,
      "Carta object definitions"
    )}${metric(
      data.metrics.noSourceTargets,
      "standalone targets with no OCF source",
      "metric-warn"
    )}</section>
    <section class="feature-grid"><div class="feature-copy"><span class="eyebrow">What you are seeing</span><h2>Evidence first, polish second.</h2><p>The explorer is generated alongside the existing inverse report and visual artifacts. Every source and target page links back to its mapping file or opens a prefilled GitHub issue for the exact gap.</p><div class="feature-list"><span><i class="dot dot-mint"></i>${html(
      data.metrics.sourceObjects
    )} OCF mapping pages</span><span><i class="dot dot-coral"></i>${html(
      data.metrics.noSourceTargets
    )} Carta source gaps</span><span><i class="dot dot-blue"></i>${html(
      data.metrics.visualTargets
    )} SVG previews + interactive HTML</span></div></div>${featuredVisual}</section>
    <section id="ocf-objects" class="directory-section"><div class="section-heading"><div><span class="eyebrow">01 / source side</span><h2>OCF objects</h2><p>Each page keeps the authored mapping visible, including objects with no Carta target evidence.</p></div>${filterBar(
      "OCF objects",
      {
        all: data.metrics.sourceObjects,
        mapped: data.metrics.sourceObjects - data.metrics.noTargetSources,
        gap: data.metrics.noTargetSources,
      }
    )}</div><div class="directory-grid" data-directory="OCF objects">${data.sources
      .map(sourceCard)
      .join("")}</div></section>
    <section id="carta-targets" class="directory-section"><div class="section-heading"><div><span class="eyebrow">02 / target side</span><h2>Carta targets</h2><p>Every Carta object-like definition is browseable: standalone targets, source gaps, and support definitions retained for context.</p></div>${filterBar(
      "Carta targets",
      {
        all: data.metrics.targetObjects,
        mapped: data.metrics.mappedTargets,
        gap: data.metrics.noSourceTargets,
      }
    )}</div>${targetScopeLegend(
      data
    )}<div class="directory-grid" data-directory="Carta targets">${data.targets
      .map(targetCard)
      .join("")}</div></section>
    <section class="closing-band"><div><span class="eyebrow accent">Need the raw ledger?</span><h2>Keep the generated report close.</h2></div><div class="hero-actions"><a class="button button-primary" href="assets/mapping-inverse-report.md">Read inverse report</a><a class="button button-quiet" href="https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas">View repository ↗</a></div></section>`
  );
}

function sourceFieldRow(field: ExplorerSourceField): string {
  const targets = field.targets.length
    ? field.targets
        .map(
          (target) =>
            `<span class="target-token">${html(`${target.object}.${target.property}`)}</span>`
        )
        .join("")
    : '<span class="muted">No Carta target</span>';
  return `<tr><td><span class="mono">${html(
    field.variant
  )}</span></td><td><span class="mono strong">${html(
    field.field
  )}</span></td><td><div class="token-stack">${targets}</div></td><td><span class="kind-token ${
    field.targets.length ? "kind-mapped" : "kind-gap"
  }">${html(field.kind)}</span></td><td>${externalLink(
    field.issueUrl,
    "Issue ↗",
    "table-link"
  )}</td></tr>`;
}

export function renderMappingExplorerSourcePage(source: ExplorerSource): string {
  const relative = "../";
  const status = source.noTarget
    ? source.aliasOf
      ? "Inherited mapping"
      : "No target evidence"
    : "Mapped";
  const alert = source.noTarget
    ? `<div class="callout callout-warn"><span class="callout-icon">!</span><div><strong>${
        source.aliasOf
          ? "This object inherits its economic mapping."
          : "No executable Carta target is declared for this OCF object."
      }</strong><p>${
        source.aliasOf
          ? `The mapping is carried by ${html(
              source.aliasOf
            )}. The page stays visible so this OCF compatibility wrapper is not lost in the browse experience.`
          : "Use the issue button on this page or on an individual field to start the auditable mapping discussion."
      }</p></div></div>`
    : "";
  const targetChips = source.targetNames.length
    ? source.targetNames
        .map((name) =>
          link(`../targets/${explorerSlug(name)}.html`, name, "target-token target-link")
        )
        .join("")
    : '<span class="muted">No Carta target evidence</span>';
  const rows = source.fields.length
    ? source.fields.map(sourceFieldRow).join("")
    : '<tr><td colspan="5" class="empty-cell">No field-level mapping entries were derived.</td></tr>';

  return shell(
    source.entity,
    relative,
    `<div class="breadcrumbs">${link("../index.html", "Explorer")} <span>/</span> ${link(
      "../index.html#ocf-objects",
      "OCF objects"
    )} <span>/</span> <strong>${html(source.entity)}</strong></div>
    <section class="detail-hero"><div><span class="eyebrow">OCF source object</span><h1>${html(
      source.entity
    )}</h1><p class="path-label">${html(
      source.rel
    )}</p></div><div class="detail-actions">${externalLink(
      source.issueUrl,
      "Open mapping issue ↗",
      "button button-primary"
    )}${externalLink(
      source.mappingUrl,
      "View mapping file ↗",
      "button button-quiet"
    )}</div></section>
    <div class="detail-meta"><span class="status-pill ${
      source.noTarget ? "status-gap" : "status-ok"
    }">${html(status)}</span><span>${html(source.edgeCount)} executable edges</span><span>${html(
      source.fields.length
    )} source fields</span><span>${html(source.questions.length)} review question${
      source.questions.length === 1 ? "" : "s"
    }</span>${source.aliasOf ? `<span>alias of ${html(source.aliasOf)}</span>` : ""}</div>
${alert}${renderNotesPanel(source.notes)}${renderQuestionPanel(
      source.questions,
      "Questions about this mapping",
      "Property-level review threads stay close to the evidence. Open a prefilled issue for a new decision or follow the mapping link back to the authored file."
    )}
    <section class="detail-grid"><div class="detail-main"><div class="section-heading compact"><div><span class="eyebrow">Field evidence</span><h2>Where the source fields go</h2></div></div><div class="table-wrap"><table><thead><tr><th>Variant</th><th>OCF field</th><th>Carta target</th><th>DSL kind</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div><aside class="detail-aside"><div class="side-card"><span class="eyebrow">Carta destinations</span><h3>${html(
      source.targetNames.length
    )}</h3><div class="token-stack">${targetChips}</div></div><div class="side-card"><span class="eyebrow">Keep exploring</span><p>Open the target-first inverse ledger or inspect the full interactive flow viewer.</p>${link(
      "../assets/mapping-inverse-report.md",
      "Read inverse report →"
    )}<br>${link(
      "../assets/mapping-flows-interactive/index.html",
      "Open interactive viewer →"
    )}</div></aside></div>`
  );
}

function targetEvidenceList(target: ExplorerTarget): string {
  if (target.sourceMappings.length === 0) {
    return `<div class="callout callout-warn"><span class="callout-icon">!</span><div><strong>No OCF source mapping is currently derived.</strong><p>This target is kept in the explorer as a first-class coverage gap.</p>${externalLink(
      target.issueUrl,
      "Open coverage issue ↗",
      "button button-primary"
    )}</div></div>`;
  }
  return `<div class="evidence-list">${target.sourceMappings
    .map(
      (evidence) =>
        `<div class="evidence-row"><div><strong>${html(
          evidence.source
        )}</strong><span class="muted">${html(evidence.variant)}${
          evidence.field ? ` · ${html(evidence.field)}` : ""
        }</span></div>${externalLink(
          evidence.issueUrl,
          "Open mapping issue ↗",
          "table-link"
        )}</div>`
    )
    .join("")}</div>`;
}

function targetSlotRow(slot: ExplorerTargetSlot, target: ExplorerTarget): string {
  const evidence = slot.evidence.length
    ? slot.evidence
        .slice(0, 4)
        .map(
          (item) =>
            `<span class="source-token">${html(item.source)}${
              item.field ? `.${html(item.field)}` : ""
            }</span>`
        )
        .join("")
    : '<span class="muted">No OCF source evidence</span>';
  const issue = slot.evidence[0]?.issueUrl ?? target.issueUrl;
  return `<tr><td><span class="mono strong">${html(
    slot.property
  )}</span></td><td><span class="kind-token status-${slot.status}">${html(
    slot.status
  )}</span></td><td><div class="token-stack">${evidence}</div></td><td>${externalLink(
    issue,
    slot.evidence.length ? "Issue ↗" : "Coverage ↗",
    "table-link"
  )}</td></tr>`;
}

export function renderMappingExplorerTargetPage(target: ExplorerTarget): string {
  const relative = "../";
  const statusClass = target.noSource
    ? "status-gap"
    : target.support
    ? "status-support"
    : "status-ok";
  const issueAction = target.sourceMappings.length
    ? externalLink(
        target.sourceMappings[0]!.issueUrl,
        "Ask about mapping ↗",
        "button button-primary"
      )
    : externalLink(target.issueUrl, "Open coverage issue ↗", "button button-primary");
  const visual = target.svgFile
    ? `<div class="artifact-frame"><div class="artifact-toolbar"><span>Generated SVG artifact</span>${link(
        `../assets/mapping-flows/${target.svgFile}`,
        "Open SVG ↗"
      )}</div><img src="../assets/mapping-flows/${html(target.svgFile)}" alt="${html(
        target.name
      )} mapping graph" loading="lazy"></div>`
    : '<div class="empty-state"><strong>No standalone SVG for this target.</strong><span>This definition is represented in the generated inverse ledger and interactive viewer.</span></div>';
  const parents = target.structuralParents.length
    ? target.structuralParents
        .map((parent) =>
          link(`../targets/${explorerSlug(parent)}.html`, parent, "target-token target-link")
        )
        .join("")
    : '<span class="muted">None</span>';
  const slots = target.slots.length
    ? target.slots.map((slot) => targetSlotRow(slot, target)).join("")
    : '<tr><td colspan="4" class="empty-cell">No properties in this target definition.</td></tr>';
  const questionPanel = renderQuestionPanel(
    target.questions,
    "Questions about this target",
    "Target-bound review threads are shown here with their source property and direct issue action."
  );

  return shell(
    target.name,
    relative,
    `<div class="breadcrumbs">${link("../index.html", "Explorer")} <span>/</span> ${link(
      "../index.html#carta-targets",
      "Carta targets"
    )} <span>/</span> <strong>${html(target.name)}</strong></div>
    <section class="detail-hero"><div><span class="eyebrow">Carta target definition</span><h1>${html(
      target.name
    )}</h1><p class="path-label">#/$defs/${html(
      target.name
    )}</p></div><div class="detail-actions">${externalLink(
      "../assets/mapping-flows-interactive/index.html",
      "Interactive viewer ↗",
      "button button-quiet"
    )}${issueAction}</div></section>
    <div class="detail-meta"><span class="status-pill ${statusClass}">${html(
      targetStatus(target)
    )}</span><span>${html(target.properties.length)} properties</span><span>${html(
      target.sourceMappings.length
    )} source mapping${target.sourceMappings.length === 1 ? "" : "s"}</span><span>${html(
      target.questions.length
    )} target question${target.questions.length === 1 ? "" : "s"}</span>${
      target.reason ? `<span>${html(target.reason)}</span>` : ""
    }</div>
    <section class="artifact-section">${visual}</section>
${questionPanel}
    <section class="detail-grid"><div class="detail-main"><div class="section-heading compact"><div><span class="eyebrow">Target evidence</span><h2>Who can fill this target?</h2></div></div>${targetEvidenceList(
      target
    )}<div class="section-heading compact space-top"><div><span class="eyebrow">Property ledger</span><h2>Slot by slot</h2></div></div><div class="table-wrap"><table><thead><tr><th>Carta property</th><th>Status</th><th>OCF evidence</th><th></th></tr></thead><tbody>${slots}</tbody></table></div></div><aside class="detail-aside"><div class="side-card"><span class="eyebrow">Structural parents</span><div class="token-stack">${parents}</div><p class="muted">Nested definitions remain visible without being mistaken for standalone mapping targets.</p></div><div class="side-card"><span class="eyebrow">Raw artifacts</span><p>Use the generated report for role policy and the interactive viewer for cross-object flow inspection.</p>${link(
      "../assets/mapping-inverse-report.md",
      "Read inverse report →"
    )}<br>${link(
      "../assets/mapping-flows-interactive/index.html",
      "Open HTML viewer →"
    )}</div></aside></div>`
  );
}

export function renderMappingExplorerAppJs(): string {
  return [
    "(() => {",
    '  const state = { query: "", modes: {} };',
    "  const normalize = (value) => value.toLowerCase().trim();",
    "  const apply = () => {",
    "    const query = normalize(state.query);",
    '    document.querySelectorAll("[data-directory]").forEach((directory) => {',
    '      const group = directory.dataset.directory || "";',
    '      const mode = state.modes[group] || "all";',
    '      directory.querySelectorAll("[data-card]").forEach((card) => {',
    '        const matchesQuery = !query || normalize(card.dataset.search || "").includes(query);',
    '        const matchesMode = mode === "all" || card.dataset.status === mode;',
    "        card.hidden = !(matchesQuery && matchesMode);",
    "      });",
    "    });",
    "  };",
    '  document.querySelectorAll("[data-filter-input]").forEach((input) => {',
    '    input.addEventListener("input", (event) => { state.query = event.target.value; apply(); });',
    "  });",
    '  document.querySelectorAll("[data-filter-group]").forEach((group) => {',
    '    const name = group.dataset.filterGroup || "";',
    '    state.modes[name] = "all";',
    '    group.querySelectorAll("[data-filter-button]").forEach((button) => {',
    '      button.addEventListener("click", () => {',
    '        state.modes[name] = button.dataset.filterButton || "all";',
    '        group.querySelectorAll("[data-filter-button]").forEach((item) => item.classList.toggle("is-active", item === button));',
    "        apply();",
    "      });",
    "    });",
    "  });",
    "})();",
  ].join("\n");
}

export function renderMappingExplorerCss(): string {
  return [
    ':root { --ink: #edf4ff; --muted: #9aa9c2; --subtle: #71819d; --bg: #090f1d; --panel: #111a2c; --line: rgba(164,188,224,.16); --mint: #8ff0ce; --coral: #ff927f; --blue: #91b9ff; --gold: #ffd38b; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }',
    "* { box-sizing: border-box; }",
    "html { scroll-behavior: smooth; }",
    "body { margin: 0; background: var(--bg); color: var(--ink); line-height: 1.55; background-image: linear-gradient(rgba(122,152,204,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(122,152,204,.045) 1px, transparent 1px); background-size: 48px 48px; }",
    'body::before { content: ""; position: fixed; inset: 0; pointer-events: none; background: radial-gradient(circle at 20% 0%, rgba(94,132,255,.15), transparent 32%), radial-gradient(circle at 90% 20%, rgba(45,219,167,.09), transparent 25%); z-index: -2; }',
    "a { color: inherit; }",
    ".container { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }",
    ".site-header { position: sticky; top: 0; z-index: 10; background: rgba(9,15,29,.82); backdrop-filter: blur(18px); border-bottom: 1px solid var(--line); }",
    ".nav-row { height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 30px; }",
    ".brand { font-weight: 800; letter-spacing: -.04em; text-decoration: none; font-size: 18px; }",
    '.brand::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 3px; background: var(--mint); margin-right: 10px; box-shadow: 12px 0 0 var(--coral), 24px 0 0 var(--blue); }',
    ".nav-links { display: flex; gap: 24px; color: var(--muted); font-size: 13px; } .nav-links a, .text-link { text-decoration: none; } .nav-links a:hover, .text-link:hover { color: var(--mint); }",
    ".hero { min-height: 570px; display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; gap: 60px; padding: 92px 0 70px; }",
    ".hero h1 { font-size: clamp(44px, 6vw, 78px); line-height: .98; letter-spacing: -.07em; max-width: 760px; margin: 16px 0 24px; } .hero-lede { max-width: 630px; color: var(--muted); font-size: 18px; }",
    ".eyebrow { display: block; color: var(--subtle); font-size: 11px; letter-spacing: .15em; text-transform: uppercase; font-weight: 800; } .eyebrow.accent { color: var(--mint); }",
    ".hero-actions, .detail-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; }",
    ".button { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 999px; padding: 11px 17px; text-decoration: none; font-size: 13px; font-weight: 750; transition: transform .18s ease, border-color .18s ease; } .button:hover { transform: translateY(-2px); border-color: rgba(143,240,206,.5); } .button-primary { background: var(--mint); color: #08131c; border-color: var(--mint); } .button-quiet { background: rgba(255,255,255,.035); color: var(--ink); }",
    ".hero-orbit { height: 390px; position: relative; display: grid; place-items: center; } .orbit-ring { position: absolute; border: 1px solid rgba(143,240,206,.28); border-radius: 50%; transform: rotate(-20deg); } .ring-one { width: 300px; height: 190px; } .ring-two { width: 220px; height: 340px; border-color: rgba(145,185,255,.26); transform: rotate(52deg); }",
    ".orbit-core { width: 155px; height: 155px; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(145deg, #1e3550, #101a2d); box-shadow: 0 0 0 13px rgba(143,240,206,.05), 0 0 70px rgba(143,240,206,.18); font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .16em; } .orbit-core strong { font-size: 23px; letter-spacing: -.04em; text-transform: none; color: var(--ink); }",
    ".orbit-tag { position: absolute; padding: 7px 11px; border-radius: 999px; background: rgba(17,26,44,.9); border: 1px solid var(--line); font-size: 11px; font-weight: 800; letter-spacing: .1em; } .tag-one { top: 70px; left: 34px; color: var(--mint); } .tag-two { right: 15px; top: 130px; color: var(--blue); } .tag-three { bottom: 70px; left: 92px; color: var(--coral); }",
    ".metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 80px; } .metric { padding: 24px; background: rgba(17,26,44,.72); border: 1px solid var(--line); border-radius: 18px; } .metric strong { display: block; font-size: 38px; line-height: 1; letter-spacing: -.07em; } .metric span { display: block; color: var(--muted); font-size: 12px; margin-top: 10px; } .metric-warn strong { color: var(--coral); }",
    ".feature-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 26px; align-items: stretch; margin-bottom: 110px; } .feature-copy, .featured-visual, .card, .side-card, .artifact-frame, .empty-state { background: rgba(17,26,44,.72); border: 1px solid var(--line); border-radius: 24px; } .feature-copy { padding: 38px; }",
    ".feature-copy h2, .section-heading h2, .closing-band h2 { margin: 8px 0 12px; font-size: 34px; letter-spacing: -.06em; } .feature-copy p, .section-heading p, .side-card p { color: var(--muted); } .feature-list { display: grid; gap: 12px; margin-top: 28px; color: var(--muted); font-size: 13px; } .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 10px; } .dot-mint { background: var(--mint); } .dot-coral { background: var(--coral); } .dot-blue { background: var(--blue); }",
    ".featured-visual { overflow: hidden; min-height: 330px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; } .featured-visual img { width: 100%; height: 280px; object-fit: contain; background: #f4f8ff; border-radius: 15px; } .visual-caption, .artifact-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 4px 0; color: var(--muted); font-size: 12px; }",
    ".directory-section { padding: 34px 0 72px; scroll-margin-top: 80px; } .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 28px; } .section-heading.compact { align-items: start; } .section-heading h2 { margin-top: 6px; }",
    ".filter-controls { display: flex; flex-direction: column; gap: 9px; align-items: end; } .filter-controls input { width: 240px; background: rgba(255,255,255,.05); border: 1px solid var(--line); border-radius: 10px; padding: 11px 13px; color: var(--ink); outline: none; } .filter-controls input:focus { border-color: var(--mint); } .filter-buttons { display: flex; gap: 6px; } .filter-button { border: 1px solid var(--line); background: transparent; color: var(--muted); border-radius: 999px; padding: 7px 11px; font-size: 11px; cursor: pointer; } .filter-button.is-active, .filter-button:hover { background: rgba(143,240,206,.11); border-color: rgba(143,240,206,.4); color: var(--mint); }",
    ".directory-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; } .card { min-width: 0; padding: 20px; min-height: 210px; display: flex; flex-direction: column; } .card.is-gap { border-color: rgba(255,146,127,.27); background: linear-gradient(145deg, rgba(74,31,42,.46), rgba(17,26,44,.72)); } .card-top, .card-footer { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; }",
    ".card-title { display: block; min-width: 0; font-size: 22px; letter-spacing: -.05em; text-decoration: none; margin: 17px 0 10px; overflow-wrap: anywhere; word-break: break-word; } .card-title:hover { color: var(--mint); } .card-copy { color: var(--muted); font-size: 12px; margin: 0 0 18px; overflow-wrap: anywhere; }",
    ".status-pill, .kind-token { display: inline-flex; align-items: center; border-radius: 999px; padding: 5px 8px; font-size: 10px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; } .status-ok, .kind-mapped { color: var(--mint); background: rgba(143,240,206,.1); } .status-gap, .kind-gap { color: var(--coral); background: rgba(255,146,127,.1); } .status-support { color: var(--gold); background: rgba(255,211,139,.1); }",
    ".mini-chip, .target-token, .source-token { display: inline-flex; align-items: center; min-width: 0; max-width: 100%; width: max-content; border: 1px solid var(--line); background: rgba(255,255,255,.035); border-radius: 999px; padding: 5px 8px; color: var(--muted); font-size: 11px; overflow-wrap: anywhere; word-break: break-word; } .chip-row, .token-stack { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; } .card-footer { margin-top: auto; padding-top: 18px; } .issue-link { color: var(--coral); }",
    ".closing-band { display: flex; align-items: center; justify-content: space-between; gap: 28px; margin: 45px 0 100px; padding: 36px 40px; border: 1px solid rgba(143,240,206,.2); border-radius: 24px; background: linear-gradient(110deg, rgba(143,240,206,.08), rgba(145,185,255,.08)); } .site-footer { border-top: 1px solid var(--line); color: var(--subtle); font-size: 11px; } .footer-row { display: flex; justify-content: space-between; gap: 20px; padding: 25px 0; }",
    ".breadcrumbs { padding: 42px 0 20px; color: var(--subtle); font-size: 12px; } .breadcrumbs span { padding: 0 8px; color: var(--line); } .breadcrumbs strong { color: var(--ink); } .detail-hero { display: flex; align-items: end; justify-content: space-between; gap: 30px; padding: 34px 0 18px; } .detail-hero h1 { font-size: clamp(40px, 6vw, 68px); line-height: 1; letter-spacing: -.07em; margin: 10px 0; } .path-label { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--subtle); margin: 0; } .detail-actions { justify-content: end; margin: 0; }",
    ".detail-meta { display: flex; flex-wrap: wrap; gap: 10px 18px; color: var(--muted); font-size: 12px; padding: 17px 0 32px; } .callout { display: flex; gap: 15px; padding: 19px; border-radius: 18px; margin: 8px 0 30px; border: 1px solid rgba(255,146,127,.26); background: rgba(74,31,42,.45); color: var(--muted); } .callout strong { color: var(--ink); } .callout p { margin: 4px 0 13px; } .callout-icon { display: grid; place-items: center; flex: 0 0 25px; height: 25px; border-radius: 50%; background: var(--coral); color: #24111a; font-weight: 900; }",
    ".detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 26px; padding-bottom: 90px; } .detail-main { min-width: 0; } .detail-aside { display: grid; align-content: start; gap: 14px; } .side-card { padding: 21px; } .side-card h3 { font-size: 42px; line-height: 1; margin: 8px 0 18px; letter-spacing: -.07em; } .side-card .text-link { line-height: 2; }",
    ".table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 18px; background: rgba(17,26,44,.72); } table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 680px; } th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid var(--line); vertical-align: top; } th { color: var(--subtle); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; font-weight: 800; } tr:last-child td { border-bottom: 0; }",
    ".mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; } .strong { color: var(--ink); } .target-token { color: var(--blue); } .target-link { text-decoration: none; } .source-token { color: var(--mint); } .table-link { color: var(--coral); font-size: 11px; text-decoration: none; white-space: nowrap; } .empty-cell { color: var(--muted); text-align: center; padding: 35px; }",
    ".kind-select, .kind-rename, .kind-computed, .kind-enum-remap, .kind-combine, .kind-split, .kind-construct { color: var(--blue); background: rgba(145,185,255,.1); } .status-direct, .status-type-only, .status-implicit, .status-deferred, .status-structural { color: var(--mint); background: rgba(143,240,206,.1); } .status-empty { color: var(--coral); background: rgba(255,146,127,.1); } .status-nested-obj, .status-value-type { color: var(--gold); background: rgba(255,211,139,.1); }",
    ".evidence-list { display: grid; gap: 8px; } .evidence-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; border: 1px solid var(--line); background: rgba(17,26,44,.72); border-radius: 14px; padding: 13px 15px; } .evidence-row strong { display: block; } .evidence-row .muted { display: block; margin-top: 3px; } .muted { color: var(--muted); } .artifact-section { margin: 10px 0 34px; } .artifact-frame { padding: 15px; background: #f4f8ff; } .artifact-frame img { display: block; width: 100%; max-height: 620px; object-fit: contain; } .artifact-frame .artifact-toolbar { color: #65728a; } .empty-state { display: flex; flex-direction: column; gap: 6px; align-items: center; justify-content: center; min-height: 180px; padding: 25px; color: var(--muted); text-align: center; } .space-top { margin-top: 45px; } [hidden] { display: none !important; }",
    "@media (max-width: 900px) { .hero { grid-template-columns: 1fr; padding-top: 60px; } .hero-orbit { height: 300px; } .metrics-grid { grid-template-columns: repeat(2, 1fr); } .feature-grid { grid-template-columns: 1fr; } .directory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .detail-grid { grid-template-columns: 1fr; } .detail-aside { grid-template-columns: repeat(2, 1fr); } .detail-hero { align-items: start; flex-direction: column; } .detail-actions { justify-content: start; } }",
    "@media (max-width: 620px) { .container { width: min(100% - 26px, 1180px); } .nav-links { display: none; } .hero h1 { font-size: 48px; } .hero-lede { font-size: 16px; } .metrics-grid, .directory-grid, .detail-aside { grid-template-columns: 1fr; } .section-heading { align-items: start; flex-direction: column; } .filter-controls { align-items: stretch; width: 100%; } .filter-controls input { width: 100%; } .closing-band, .footer-row { align-items: start; flex-direction: column; } .closing-band { padding: 27px; } .featured-visual img { height: 220px; } }",
    ".notes-panel { margin: 16px 0 34px; padding: 22px; border: 1px solid rgba(145,185,255,.22); border-radius: 20px; background: linear-gradient(110deg, rgba(145,185,255,.06), rgba(17,26,44,.72)); } .notes-panel .section-heading { margin-bottom: 16px; } .notes-panel .section-heading h2 { margin: 6px 0 5px; font-size: 26px; } .notes-panel .section-heading p { margin: 0; font-size: 12px; max-width: 680px; } .notes-list { display: grid; gap: 10px; } .notes-list p { margin: 0; color: var(--ink); font-size: 13px; } .notes-list code { color: var(--blue); font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; }",
    ".question-panel { margin: 16px 0 34px; padding: 22px; border: 1px solid rgba(255,211,139,.22); border-radius: 20px; background: linear-gradient(110deg, rgba(255,211,139,.06), rgba(17,26,44,.72)); }",
    ".question-panel-heading { display: flex; justify-content: space-between; align-items: start; gap: 24px; margin-bottom: 16px; } .question-panel-heading h2 { margin: 6px 0 5px; font-size: 26px; letter-spacing: -.05em; } .question-panel-heading p { margin: 0; color: var(--muted); font-size: 12px; max-width: 680px; }",
    ".question-tally { display: flex; flex-wrap: wrap; justify-content: end; gap: 6px; } .question-state { display: inline-flex; align-items: center; width: max-content; border-radius: 999px; padding: 5px 8px; font-size: 10px; font-weight: 850; letter-spacing: .06em; } .question-state-open { color: var(--coral); background: rgba(255,146,127,.12); } .question-state-closed { color: var(--blue); background: rgba(145,185,255,.12); }",
    ".question-list { display: grid; gap: 8px; } .question-row { display: grid; grid-template-columns: minmax(140px, .2fr) minmax(0, 1fr) auto; gap: 16px; align-items: start; padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: rgba(9,15,29,.3); } .question-open { border-color: rgba(255,146,127,.28); } .question-closed { border-color: rgba(145,185,255,.2); opacity: .88; }",
    ".question-status { display: flex; flex-direction: column; align-items: start; gap: 8px; } .question-status code { color: var(--ink); font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; } .question-body p { margin: 0; color: var(--ink); font-size: 13px; font-weight: 650; } .question-meta { margin-top: 6px; color: var(--subtle); font-size: 11px; } .question-target { margin-left: 8px; color: var(--blue); } .question-answer { margin-top: 8px; color: var(--muted); font-size: 11px; } .question-answer span { color: var(--subtle); text-transform: uppercase; letter-spacing: .08em; font-weight: 800; margin-right: 5px; }",
    ".question-actions { display: flex; flex-direction: column; align-items: end; gap: 6px; } .question-action, .question-mapping { white-space: nowrap; font-size: 11px; text-decoration: none; } .question-action { color: var(--coral); font-weight: 800; } .question-mapping { color: var(--muted); } .question-action:hover, .question-mapping:hover { color: var(--mint); } .question-chip { color: var(--gold); border-color: rgba(255,211,139,.24); }",
    "@media (max-width: 900px) { .question-row { grid-template-columns: 1fr auto; } .question-status { grid-column: 1 / -1; flex-direction: row; align-items: center; } }",
    "@media (max-width: 620px) { .question-panel-heading { align-items: start; flex-direction: column; } .question-tally { justify-content: start; } .question-row { grid-template-columns: 1fr; } .question-actions { flex-direction: row; align-items: start; } }",
    ':root { --ink: #111114; --muted: #5e5f68; --subtle: #777883; --bg: #ffffff; --panel: #ffffff; --line: rgba(17,17,20,.16); --mint: #2a30c8; --coral: #2a30c8; --blue: #2a30c8; --gold: #2a30c8; --primary: #2a30c8; font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; }',
    'body { background: var(--bg); color: var(--ink); background-image: none; font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; } body::before { display: none; }',
    ".container { width: min(1024px, calc(100% - 40px)); } .site-header { position: relative; background: var(--primary); backdrop-filter: none; border-bottom: 1px solid rgba(255,255,255,.7); } .nav-row { height: 72px; } .brand { color: #fff; font-size: 12px; font-weight: 400; letter-spacing: .16em; text-transform: uppercase; } .brand::before { width: 24px; height: 24px; border: 1px solid rgba(255,255,255,.95); border-radius: 50%; background: transparent; margin-right: 12px; box-shadow: inset 0 0 0 4px var(--primary), inset 0 0 0 5px rgba(255,255,255,.72); vertical-align: middle; } .nav-links { color: rgba(255,255,255,.88); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; } .nav-links a:hover, .text-link:hover { color: #fff; }",
    '.hero { min-height: 520px; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); padding: 104px max(20px, calc((100vw - 1024px) / 2)) 112px; background: var(--primary); color: #fff; } .hero h1 { color: #fff; font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; font-size: clamp(40px, 5.2vw, 64px); font-weight: 400; line-height: 1.05; letter-spacing: .12em; text-transform: uppercase; } .hero-lede { color: rgba(255,255,255,.86); } .eyebrow { color: rgba(17,17,20,.58); font-weight: 400; letter-spacing: .14em; } .hero .eyebrow, .hero .eyebrow.accent { color: rgba(255,255,255,.78); }',
    ".hero-orbit { opacity: .86; } .orbit-ring { border-color: rgba(255,255,255,.52); } .ring-two { border-color: rgba(255,255,255,.32); } .orbit-core { background: transparent; border: 1px solid rgba(255,255,255,.6); box-shadow: none; color: rgba(255,255,255,.78); } .orbit-core strong { color: #fff; } .orbit-tag { background: transparent; border-color: rgba(255,255,255,.55); border-radius: 0; color: #fff !important; font-weight: 400; }",
    ".metrics-grid { background: #f1f1ff; gap: 1px; padding: 1px; } .metric, .feature-copy, .featured-visual, .card, .side-card, .artifact-frame, .empty-state { background: #fff; border: 1px solid var(--line); border-radius: 0; box-shadow: none; } .metric { padding: 24px; } .metric strong { font-weight: 400; } .metric span, .feature-copy p, .section-heading p, .side-card p { color: var(--muted); }",
    '.feature-copy h2, .section-heading h2, .closing-band h2, .question-panel-heading h2, .notes-panel .section-heading h2 { font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; font-weight: 400; letter-spacing: .1em; text-transform: uppercase; } .feature-copy h2, .section-heading h2, .closing-band h2 { font-size: 30px; } .featured-visual img { background: #f1f1ff; border-radius: 0; }',
    ".directory-section { border-top: 1px solid var(--line); } .filter-controls input { background: #fff; border: 1px solid var(--line); border-radius: 0; color: var(--ink); } .filter-controls input:focus { border-color: var(--primary); } .filter-button { border-radius: 0; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; } .filter-button.is-active, .filter-button:hover { background: #f1f1ff; border-color: var(--primary); color: var(--primary); } .card { padding: 20px; } .card.is-gap { border-color: rgba(42,48,200,.35); background: #f1f1ff; } .card-title { font-weight: 400; letter-spacing: .03em; } .card-title:hover { color: var(--primary); }",
    ".button { border-radius: 0; padding: 12px 18px; font-size: 11px; font-weight: 400; letter-spacing: .1em; text-transform: uppercase; transition: background-color .18s ease, color .18s ease, border-color .18s ease; } .button:hover { transform: none; border-color: var(--primary); } .button-primary { background: var(--primary); color: #fff; border-color: var(--primary); } .button-primary:hover { background: #111114; border-color: #111114; } .button-quiet { background: #fff; color: var(--primary); border-color: var(--primary); } .button-quiet:hover { background: #f1f1ff; }",
    ".status-pill, .kind-token, .mini-chip, .target-token, .source-token, .question-state { border-radius: 0; } .status-pill, .kind-token { font-weight: 400; letter-spacing: .08em; } .status-ok, .kind-mapped, .status-gap, .kind-gap, .status-support, .kind-select, .kind-rename, .kind-computed, .kind-enum-remap, .kind-combine, .kind-split, .kind-construct, .status-direct, .status-type-only, .status-implicit, .status-deferred, .status-structural, .status-empty, .status-nested-obj, .status-value-type { color: var(--primary); background: #f1f1ff; } .mini-chip, .target-token, .source-token { background: #f1f1ff; color: var(--primary); border-color: rgba(42,48,200,.24); } .issue-link, .table-link, .question-action, .question-target { color: var(--primary); }",
    ".closing-band { margin-bottom: 100px; padding: 36px 40px; border: 1px solid rgba(42,48,200,.25); border-radius: 0; background: #f1f1ff; } .site-footer { background: var(--primary); border-top: 0; color: rgba(255,255,255,.8); } .footer-row { color: rgba(255,255,255,.8); }",
    '.breadcrumbs { color: var(--subtle); text-transform: uppercase; letter-spacing: .08em; } .detail-hero h1 { font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; font-size: clamp(36px, 5.2vw, 60px); font-weight: 400; letter-spacing: .04em; } .callout { border-radius: 0; border-color: rgba(42,48,200,.28); background: #f1f1ff; color: var(--muted); } .callout strong { color: var(--ink); } .callout-icon { border-radius: 50%; background: var(--primary); color: #fff; }',
    ".table-wrap { border-radius: 0; background: #fff; } th, td { border-color: var(--line); } th { color: var(--primary); font-weight: 400; } .evidence-row { border-radius: 0; background: #fff; } .artifact-frame { background: #f1f1ff; }",
    ".notes-panel { border-color: rgba(42,48,200,.28); border-radius: 0; background: #f1f1ff; } .notes-list p { color: var(--ink); } .question-panel { border-color: rgba(42,48,200,.28); border-radius: 0; background: #f1f1ff; } .question-panel-heading h2 { font-size: 24px; } .question-state { color: var(--primary); background: #fff; border: 1px solid rgba(42,48,200,.24); font-weight: 400; } .question-row { border-radius: 0; background: #fff; } .question-open, .question-closed { border-color: rgba(42,48,200,.24); } .question-body p { font-weight: 400; } .question-chip { color: var(--primary); border-color: rgba(42,48,200,.24); }",
    ".directory-legend { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 20px; max-width: 760px; margin: -8px 0 26px auto; padding: 15px 18px; border: 1px solid rgba(42,48,200,.22); background: #f1f1ff; } .directory-legend p { margin: 5px 0 0; color: var(--muted); font-size: 12px; line-height: 1.55; } .directory-legend strong { color: var(--ink); font-weight: 500; } .legend-links { white-space: nowrap; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; } .legend-links a { color: var(--primary); text-decoration: none; } .legend-links a:hover { color: var(--ink); }",
    "@media (max-width: 900px) { .directory-legend { max-width: none; margin-left: 0; } }",
    "@media (max-width: 620px) { .hero { padding: 76px 20px 84px; } .hero h1 { font-size: 38px; letter-spacing: .1em; } .directory-legend { grid-template-columns: 1fr; gap: 10px; } .legend-links { white-space: normal; } }",
  ].join("\n");
}
