import { cartaCoverageIssueUrl, mappingFileUrl, mappingIssueUrl } from "./question-links.js";
import { sourcePropertyNode, sourceSchemaPropertyNode } from "./inverse-coverage.js";
import type {
  CartaDefCoverage,
  CartaSlotCoverage,
  InverseCoverageLedger,
  NestedNamespace,
} from "./inverse-coverage.js";
import type { Corpus, GreenObject, MappingEdge } from "./core-corpus.js";
import { resolveSource, resolveTarget } from "./core-classifier.js";
import { isPlainObject, TARGET_BUNDLES } from "./mapping-validator.js";
import { targetPointerParts } from "./mapping-report.js";
import type { MappingReportDocument } from "./mapping-report.js";
import type { MappingQuestion } from "./mapping-questions.js";
import { questionTargetParts } from "./mapping-questions.js";

const MAPPING_EXPLORER_TITLE = "Cap-table data map";
const MAPPING_EXPLORER_BRAND = "Open Cap Table Coalition";
const OCT_ICON_SOURCE_URL =
  "https://cdn.prod.website-files.com/65e8bf22cc227c12aab0fed1/65e8bf22cc227c12aab0ff33_OCT-coalition-seal_horizontal%202.png";
// Official OCT icon asset, encoded here so generated GitHub Pages output has no
// runtime dependency on the source site's CDN.
const OCT_ICON_DATA_URI =
  "data:image/png;base64,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";
let mappingExplorerAssetVersionCache: string | undefined;

function mappingExplorerAssetVersion(): string {
  if (mappingExplorerAssetVersionCache) return mappingExplorerAssetVersionCache;

  // Keep deployed pages from reusing stale static CSS or JS after regeneration.
  const assets = `${renderMappingExplorerCss()}\n${renderMappingExplorerAppJs()}`;
  let hash = 2166136261;
  for (let index = 0; index < assets.length; index += 1) {
    hash ^= assets.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  mappingExplorerAssetVersionCache = (hash >>> 0).toString(36);
  return mappingExplorerAssetVersionCache;
}

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
  sourceSlug?: string;
  variant: string;
  field?: string;
  sourceType: string;
  sourceTypeUrl: string;
  kind?: string;
  scope: MappingEdge["scope"];
  issueUrl: string;
}

export interface ExplorerTargetSlot {
  property: string;
  type: string;
  typeUrl: string;
  status: CartaSlotCoverage["status"];
  evidence: ExplorerEvidence[];
}

export interface ExplorerTarget {
  name: string;
  slug: string;
  status: CartaDefCoverage["status"];
  nestedNamespace?: NestedNamespace;
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
    compatibilityWrappers: number;
    noTargetSources: number;
    targetObjects: number;
    mappedTargets: number;
    noSourceTargets: number;
    actionableTargets: number;
    explainedTargets: number;
    supportTargets: number;
    visualTargets: number;
  };
}

interface DirectoryFilterCounts {
  all: number;
  mapped: number;
  gap: number;
  explained?: number;
  support?: number;
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

function targetLabel(target: ExplorerTargetRef): string {
  // Derive the visible label from the canonical pointer at render time. This
  // keeps the explorer from displaying a generic/stale property name when a
  // target reference has been serialized or transformed upstream.
  const parts = targetPointerParts(target.pointer);
  return `${parts.object}.${parts.relative}`;
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

function schemaRefName(value: string): string {
  return (
    value
      .split(/[/?#]/)
      .pop()
      ?.replace(/\.schema\.json$/, "") ?? value
  );
}

function schemaFileUrl(schemaId: string): string | undefined {
  const schemaMarker = "/schema/";
  const relative = schemaId.includes(schemaMarker)
    ? schemaId.slice(schemaId.indexOf(schemaMarker) + schemaMarker.length)
    : undefined;
  return relative ? mappingFileUrl(relative) : undefined;
}

function cartaSchemaUrl(): string {
  return mappingFileUrl(TARGET_BUNDLES.Carta as string);
}

function schemaTypeUrl(node: unknown, fallbackUrl: string): string {
  if (isPlainObject(node) && typeof node.$ref === "string") {
    return schemaFileUrl(node.$ref) ?? fallbackUrl;
  }
  return fallbackUrl;
}

function schemaTypeLabel(node: unknown, resolve: (value: unknown) => unknown, depth = 0): string {
  if (depth > 10 || !isPlainObject(node)) return "unknown";
  if (typeof node.$ref === "string") return schemaRefName(node.$ref);

  const resolved = resolve(node);
  if (resolved !== node && isPlainObject(resolved)) {
    return schemaTypeLabel(resolved, resolve, depth + 1);
  }

  const union = node.oneOf ?? node.anyOf;
  if (Array.isArray(union)) {
    const labels = union
      .map((branch) => schemaTypeLabel(branch, resolve, depth + 1))
      .filter((label) => label !== "unknown");
    if (labels.length) return [...new Set(labels)].join(" | ");
  }

  if (node.items !== undefined) {
    return `array<${schemaTypeLabel(node.items, resolve, depth + 1)}>`;
  }

  if (node.type !== undefined) {
    if (Array.isArray(node.type)) return node.type.join(" | ");
    if (typeof node.type === "string") {
      return typeof node.format === "string" ? `${node.type} (${node.format})` : node.type;
    }
  }

  if (node.const !== undefined) return `literal (${typeof node.const})`;
  if (isPlainObject(node.properties)) return "object";
  return "unknown";
}

function sourceTypeForEdge(
  corpus: Corpus,
  objects: ReadonlyMap<string, GreenObject>,
  edge: MappingEdge
): { label: string; url: string } {
  const object = objects.get(edge.source);
  const objectSchemaUrl = object?.sourceSchemaId ? schemaFileUrl(object.sourceSchemaId) : undefined;
  if (edge.field && object) {
    const node = sourcePropertyNode(corpus, object, edge.field);
    if (node !== undefined) {
      return {
        label: schemaTypeLabel(node, (value) => resolveSource(value, corpus.registry)),
        url: schemaTypeUrl(
          node,
          objectSchemaUrl ?? mappingFileUrl(object.rel.replace(/\.mapping\.md$/, ".schema.json"))
        ),
      };
    }
  }
  if (edge.field) {
    const schemaId = [...corpus.registry.keys()].find((id) => schemaRefName(id) === edge.source);
    if (schemaId) {
      const node = sourceSchemaPropertyNode(corpus, schemaId, edge.field);
      if (node !== undefined) {
        return {
          label: schemaTypeLabel(node, (value) => resolveSource(value, corpus.registry)),
          url: schemaTypeUrl(
            node,
            schemaFileUrl(schemaId) ??
              mappingFileUrl(edge.rel.replace(/\.mapping\.md$/, ".schema.json"))
          ),
        };
      }
    }
  }
  if (object?.sourceSchemaId) {
    return {
      label: schemaRefName(object.sourceSchemaId),
      url: objectSchemaUrl ?? mappingFileUrl(object.rel.replace(/\.mapping\.md$/, ".schema.json")),
    };
  }
  return {
    label: edge.sourceKind === "type" ? edge.source : "object",
    url: mappingFileUrl(edge.rel.replace(/\.mapping\.md$/, ".schema.json")),
  };
}

function evidenceFor(
  corpus: Corpus,
  objects: ReadonlyMap<string, GreenObject>,
  edge: MappingEdge
): ExplorerEvidence {
  const object = objects.get(edge.source);
  const sourceType = sourceTypeForEdge(corpus, objects, edge);
  return {
    rel: edge.rel,
    source: edge.source,
    sourceSlug: edge.sourceKind === "object" && object ? explorerSlug(object.entity) : undefined,
    variant: edge.variant,
    field: edge.field,
    sourceType: sourceType.label,
    sourceTypeUrl: sourceType.url,
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

function uniqueEvidence(
  corpus: Corpus,
  objects: ReadonlyMap<string, GreenObject>,
  edges: readonly MappingEdge[]
): ExplorerEvidence[] {
  return [
    ...new Map(
      edges.map((edge) => {
        const evidence = evidenceFor(corpus, objects, edge);
        return [evidenceKey(evidence), evidence] as const;
      })
    ).values(),
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

function targetSlots(
  corpus: Corpus,
  inverse: InverseCoverageLedger,
  row: CartaDefCoverage,
  objects: ReadonlyMap<string, GreenObject>
): ExplorerTargetSlot[] {
  return inverse.slots
    .filter((slot) => slot.def === row.name)
    .sort((a, b) => a.property.localeCompare(b.property))
    .map((slot) => ({
      property: slot.property,
      type: schemaTypeLabel(inverse.schema.resolve(slot.pointer), (node) =>
        resolveTarget(node, corpus.bundle)
      ),
      typeUrl: schemaTypeUrl(inverse.schema.resolve(slot.pointer), cartaSchemaUrl()),
      status: slot.status,
      evidence: uniqueEvidence(corpus, objects, [...slot.edges, ...slot.structuralEdges]),
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
  return row.status === "direct" || row.status === "deferred";
}

function isSupportTarget(row: Pick<ExplorerTarget, "status">): boolean {
  return row.status === "nested-obj" || row.status === "value-type";
}

function isActionableTarget(target: Pick<ExplorerTarget, "noSource" | "status">): boolean {
  return target.noSource && (target.status === "gap" || target.status === "review");
}

function isExplainedTarget(target: Pick<ExplorerTarget, "noSource" | "status">): boolean {
  return target.noSource && !isActionableTarget(target);
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
    .filter((object) => !object.aliasOf)
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
  const objectsByEntity = new Map(corpus.objects.map((object) => [object.entity, object]));
  const targets = inverse.defs
    .map((row) => {
      const slots = targetSlots(corpus, inverse, row, objectsByEntity);
      const sourceMappings = targetEvidence(slots);
      const support = isSupportTarget(row);
      return {
        name: row.name,
        slug: explorerSlug(row.name),
        status: row.status,
        nestedNamespace: row.nestedNamespace,
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
      compatibilityWrappers: corpus.objects.filter((object) => object.aliasOf).length,
      noTargetSources: sources.filter((source) => source.noTarget).length,
      targetObjects: targets.length,
      mappedTargets: targets.filter(isMappedTarget).length,
      noSourceTargets: targets.filter((target) => target.noSource).length,
      actionableTargets: targets.filter(isActionableTarget).length,
      explainedTargets: targets.filter(isExplainedTarget).length,
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

function brandMarkup(relative: string): string {
  return `<a class="brand" href="${html(`${relative}index.html`)}" aria-label="${html(
    MAPPING_EXPLORER_BRAND
  )}" data-icon-source="${OCT_ICON_SOURCE_URL}"><span class="brand-mark" role="img" aria-label="${html(
    MAPPING_EXPLORER_BRAND
  )}"></span></a>`;
}

function schemaTypeLink(label: string, href: string): string {
  return `<a class="schema-type-link" href="${html(href)}" target="_blank" rel="noreferrer">${html(
    label
  )} ↗</a>`;
}

function sourceStatus(source: ExplorerSource): string {
  if (source.noTarget) return source.aliasOf ? "Inherited rules" : "No Carta destination";
  return "Mapped";
}

function targetStatus(target: ExplorerTarget): string {
  if (target.support) {
    return target.nestedNamespace === "ocf" ? "OCF helper type" : "Carta support type";
  }
  if (isActionableTarget(target)) return "Needs mapping decision";
  if (target.noSource && target.sourceMappings.length > 0) return "No standalone OCF record";
  if (isExplainedTarget(target)) return "No standalone OCF record";
  if (target.status === "direct") return "Mapped target";
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
  const assetVersion = mappingExplorerAssetVersion();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#2a30c8">
  <meta name="description" content="${MAPPING_EXPLORER_TITLE}">
  <title>${html(title)} · ${MAPPING_EXPLORER_TITLE}</title>
  <link rel="stylesheet" href="${relative}styles.css?v=${assetVersion}">
</head>
<body>
  <div class="page-glow page-glow-one"></div><div class="page-glow page-glow-two"></div>
  <header class="site-header"><div class="container nav-row">
    ${brandMarkup(relative)}
    <nav class="nav-links" aria-label="Primary"><a href="${relative}index.html#ocf-objects">OCF records</a><a href="${relative}index.html#carta-targets">Carta records</a><a href="${relative}assets/mapping-flows-interactive/index.html">Flow viewer</a></nav>
  </div></header>
  <main class="container">${body}</main>
  <footer class="site-footer"><div class="container footer-row"><span>Generated from the green mapping corpus and inverse coverage ledger.</span><a class="footer-brand-link" href="https://www.opencaptablecoalition.com/" target="_blank" rel="noreferrer">${MAPPING_EXPLORER_BRAND} ↗</a></div></footer>
  <script src="${relative}app.js?v=${assetVersion}" defer></script>
</body>
</html>`;
}

function metric(value: number, label: string, tone = ""): string {
  return `<div class="metric ${tone}"><strong>${html(value)}</strong><span>${html(
    label
  )}</span></div>`;
}

function filterBar(
  group: string,
  counts: DirectoryFilterCounts,
  options: { gapLabel?: string; explainedLabel?: string; supportLabel?: string } = {}
): string {
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
  )})</button><button class="filter-button" data-filter-button="gap" type="button">${html(
    options.gapLabel ?? "Gaps"
  )} (${html(counts.gap)})</button>${
    counts.explained === undefined
      ? ""
      : `<button class="filter-button" data-filter-button="explained" type="button">${html(
          options.explainedLabel ?? "Explained"
        )} (${html(counts.explained)})</button>`
  }${
    counts.support === undefined
      ? ""
      : `<button class="filter-button" data-filter-button="support" type="button">${html(
          options.supportLabel ?? "Support"
        )} (${html(counts.support)})</button>`
  }</div></div>`;
}

function targetScopeLegend(data: MappingExplorerData): string {
  return `<aside class="directory-legend" aria-label="Carta target directory scope"><div><span class="eyebrow">Target page scope</span><p><strong>Mapped (${html(
    data.metrics.mappedTargets
  )})</strong> have a direct OCF record route. <strong>Needs a decision (${html(
    data.metrics.actionableTargets
  )})</strong> are gaps that need a mapping choice. <strong>No standalone record (${html(
    data.metrics.explainedTargets
  )})</strong> are documented exclusions such as summaries, alternate shapes, or Carta-only workflows. <strong>Support (${html(
    data.metrics.supportTargets
  )})</strong> are nested helpers used inside other Carta records. Every definition is listed here; use the detail page for the slot-level evidence.</p></div><div class="legend-links">${link(
    "assets/mapping-inverse-report.md",
    "Full inventory + analysis →"
  )}</div></aside>`;
}

function directionTabs(): string {
  return `<nav class="direction-tabs" aria-label="Mapping direction" data-side-tabs role="tablist"><button id="source-side-tab" class="direction-tab is-active" data-side-tab="source" aria-controls="ocf-objects" aria-selected="true" role="tab" type="button"><span class="direction-tab-kicker">01 / source side</span><strong>OCF records</strong></button><button id="target-side-tab" class="direction-tab" data-side-tab="target" aria-controls="carta-targets" aria-selected="false" role="tab" type="button"><span class="direction-tab-kicker">02 / destination side</span><strong>Carta records</strong></button></nav>`;
}

function sourceCard(source: ExplorerSource): string {
  const targets = source.targetNames.length
    ? source.targetNames
        .slice(0, 3)
        .map((name) => `<span class="mini-chip">${html(name)}</span>`)
        .join("")
    : '<span class="muted">No Carta destination</span>';
  return `<article class="card directory-card${
    source.noTarget ? " is-gap" : ""
  }" data-card data-status="${source.noTarget ? "gap" : "mapped"}" data-search="${html(
    `${source.entity} ${source.rel} ${source.targetNames.join(" ")}`
  )}">
    <div class="card-top"><span class="eyebrow">OCF record</span><span class="status-pill ${
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
  const statusClass = target.support
    ? "status-support"
    : target.noSource
    ? isActionableTarget(target)
      ? "status-gap"
      : "status-explained"
    : "status-ok";
  const activeStatus = target.support
    ? "support"
    : target.noSource
    ? isActionableTarget(target)
      ? "gap"
      : "explained"
    : "mapped";
  const visual = target.svgFile ? '<span class="mini-chip">SVG visual</span>' : "";
  const issueUrl = target.sourceMappings[0]?.issueUrl ?? target.issueUrl;
  const issueLabel = target.sourceMappings.length ? "Open mapping issue" : "Open coverage issue";
  return `<article class="card directory-card${
    isActionableTarget(target) ? " is-gap" : ""
  }" data-card data-status="${activeStatus}" data-search="${html(
    `${target.name} ${target.status} ${target.reason ?? ""} ${target.properties.join(
      " "
    )} ${target.sourceMappings.map((mapping) => mapping.source).join(" ")}`
  )}">
    <div class="card-top"><span class="eyebrow">Carta record</span><span class="status-pill ${statusClass}">${html(
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
      isActionableTarget(target) && target.sourceMappings.length === 0
        ? externalLink(issueUrl, issueLabel, "text-link issue-link")
        : link(`targets/${target.slug}.html`, "Inspect target →")
    }</div>
  </article>`;
}

export function renderMappingExplorerIndex(data: MappingExplorerData): string {
  return shell(
    "Overview",
    "",
    `<section class="hero"><div class="hero-copy"><span class="eyebrow accent">OCF ↔ Carta / cap-table data</span><h1>How cap-table records move from OCF to Carta.</h1><p class="hero-lede"><strong>OCF</strong> is the Open Cap Format: the source-side records and events that describe a cap table. <strong>Carta</strong> is the destination data model in this comparison. Start with an OCF record to see where each field goes, or switch to Carta records to see what is mapped, derived, or still unmatched.</p><div class="hero-actions"><a class="button button-primary" href="#ocf-objects">Start with OCF records</a><a class="button button-quiet" href="#carta-targets">View Carta records</a></div></div><div class="hero-orbit"><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><div class="orbit-core"><span>source</span><strong>→</strong><span>destination</span></div><span class="orbit-tag tag-one">OCF</span><span class="orbit-tag tag-two">CARTA</span><span class="orbit-tag tag-three">MAP</span></div></section>
    <section class="metrics-grid" aria-label="Coverage summary">${metric(
      data.metrics.sourceObjects,
      "OCF records"
    )}${metric(data.metrics.noTargetSources, "with no Carta destination", "metric-warn")}${metric(
      data.metrics.targetObjects,
      "Carta definitions"
    )}${metric(
      data.metrics.noSourceTargets,
      "without a standalone OCF record",
      "metric-warn"
    )}</section>
    <section class="map-guide" aria-labelledby="map-guide-title"><div class="map-guide-heading"><span class="eyebrow">Start here</span><h2 id="map-guide-title">Choose a side, then open a record.</h2><p>Use the tabs below to switch between the source records and the destination records. The Flow viewer shows relationships across records. It is a fixed diagram, so there are no layer controls.</p><p class="callout-copy">Legacy <code>PlanSecurity*</code> compatibility wrappers are omitted from this browseable output; their economic mapping is represented by the corresponding <code>EquityCompensation*</code> object (${html(
      data.metrics.compatibilityWrappers
    )} wrapper pages omitted).</p></div><ol class="map-guide-steps"><li class="map-guide-step"><span class="map-guide-number">1</span><div><strong>OCF records</strong><span>See a source record and where its fields go.</span></div></li><li class="map-guide-step"><span class="map-guide-number">2</span><div><strong>Carta records</strong><span>See destination definitions, support types, and gaps.</span></div></li><li class="map-guide-step"><span class="map-guide-number">3</span><div><strong>Inspect the details</strong><span>Read the field-level mapping, transformation, and open questions.</span></div></li></ol></section>
    ${directionTabs()}
    <section id="ocf-objects" class="directory-section" data-side-panel="source" aria-labelledby="source-side-tab" role="tabpanel"><div class="section-heading"><div><span class="eyebrow">01 / source side</span><h2>OCF records</h2><p>These are the source-side OCF records and events. Open one to see each field, its Carta destination, and any known loss or open question.</p></div>${filterBar(
      "OCF records",
      {
        all: data.metrics.sourceObjects,
        mapped: data.metrics.sourceObjects - data.metrics.noTargetSources,
        gap: data.metrics.noTargetSources,
      }
    )}</div><div class="directory-grid" data-directory="OCF records">${data.sources
      .map(sourceCard)
      .join("")}</div></section>
    <section id="carta-targets" class="directory-section" data-side-panel="target" aria-labelledby="target-side-tab" role="tabpanel" hidden><div class="section-heading"><div><span class="eyebrow">02 / destination side</span><h2>Carta records</h2><p>Every Carta definition is listed here. Mapped entries have a direct OCF record route; entries needing review lack a standalone route; support entries are nested helpers used inside another Carta record.</p></div>${filterBar(
      "Carta records",
      {
        all: data.metrics.targetObjects,
        mapped: data.metrics.mappedTargets,
        gap: data.metrics.actionableTargets,
        explained: data.metrics.explainedTargets,
        support: data.metrics.supportTargets,
      },
      { gapLabel: "Needs a decision", explainedLabel: "No standalone record" }
    )}</div>${targetScopeLegend(
      data
    )}<div class="directory-grid" data-directory="Carta records">${data.targets
      .map(targetCard)
      .join("")}</div></section>
    <section class="closing-band"><div><span class="eyebrow accent">Need the raw ledger?</span><h2>Keep the generated report close.</h2></div><div class="hero-actions"><a class="button button-primary" href="assets/mapping-inverse-report.md">Read inverse report</a><a class="button button-quiet" href="https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas">View repository ↗</a></div></section>`
  );
}

function sourceFieldRow(field: ExplorerSourceField): string {
  const targets = field.targets.length
    ? field.targets
        .map((target) =>
          link(
            `../targets/${explorerSlug(target.object)}.html`,
            targetLabel(target),
            "target-token target-link"
          )
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
      : "No Carta destination"
    : "Mapped";
  const alert = source.noTarget
    ? `<div class="callout callout-warn"><span class="callout-icon">!</span><div><strong>${
        source.aliasOf
          ? "This record inherits its economic mapping."
          : "No executable Carta destination is declared for this OCF record."
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
    : '<span class="muted">No Carta destination</span>';
  const rows = source.fields.length
    ? source.fields.map(sourceFieldRow).join("")
    : '<tr><td colspan="5" class="empty-cell">No field-level mapping entries were derived.</td></tr>';

  return shell(
    source.entity,
    relative,
    `<div class="breadcrumbs">${link("../index.html", "Data map")} <span>/</span> ${link(
      "../index.html#ocf-objects",
      "OCF records"
    )} <span>/</span> <strong>${html(source.entity)}</strong></div>
    <section class="detail-hero"><div><span class="eyebrow">OCF source record</span><h1>${html(
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
    <section class="detail-grid"><div class="detail-main"><div class="section-heading compact"><div><span class="eyebrow">Field evidence</span><h2>Where the OCF fields go</h2></div></div><div class="table-wrap"><table><thead><tr><th>Variant</th><th>OCF field</th><th>Carta destination</th><th>Mapping kind</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div><aside class="detail-aside"><div class="side-card"><span class="eyebrow">Carta destinations</span><h3>${html(
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
    const heading = target.support
      ? "Supporting definition; no standalone OCF record is expected."
      : isActionableTarget(target)
      ? "No OCF source record or field mapping is currently derived."
      : "No standalone OCF source record is expected for this definition.";
    const action = isActionableTarget(target)
      ? externalLink(target.issueUrl, "Open coverage issue ↗", "button button-primary")
      : "";
    return `<div class="callout callout-warn"><span class="callout-icon">!</span><div><strong>${heading}</strong><p>This Carta definition is kept in the explorer as an explicit coverage item.</p>${action}</div></div>`;
  }
  return `<div class="evidence-list">${target.sourceMappings
    .map(
      (evidence) =>
        `<div class="evidence-row"><div><strong>${
          evidence.sourceSlug
            ? link(`../sources/${evidence.sourceSlug}.html`, evidence.source, "text-link")
            : html(evidence.source)
        }</strong><span class="muted">${html(evidence.variant)}${
          evidence.field ? ` · ${html(evidence.field)}` : ""
        } · OCF type: ${schemaTypeLink(
          evidence.sourceType,
          evidence.sourceTypeUrl
        )}</span></div>${externalLink(
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
            `<span class="source-token"><span>${
              item.sourceSlug
                ? link(`../sources/${item.sourceSlug}.html`, item.source, "text-link")
                : html(item.source)
            }${
              item.field ? `.${html(item.field)}` : ""
            }</span><span class="schema-type"><span class="schema-type-label">OCF type</span> ${schemaTypeLink(
              item.sourceType,
              item.sourceTypeUrl
            )}</span></span>`
        )
        .join("")
    : '<span class="muted">No OCF source evidence</span>';
  const action = slot.evidence.length
    ? externalLink(slot.evidence[0]!.issueUrl, "Issue ↗", "table-link")
    : isActionableTarget(target)
    ? externalLink(target.issueUrl, "Coverage ↗", "table-link")
    : `<span class="muted">Documented</span>`;
  return `<tr><td><span class="mono strong">${html(
    slot.property
  )}</span><span class="schema-type"><span class="schema-type-label">Carta type</span> ${schemaTypeLink(
    slot.type,
    slot.typeUrl
  )}</span></td><td><span class="kind-token status-${slot.status}">${html(
    slot.status
  )}</span></td><td><div class="token-stack">${evidence}</div></td><td>${action}</td></tr>`;
}

export function renderMappingExplorerTargetPage(target: ExplorerTarget): string {
  const relative = "../";
  const statusClass = target.support
    ? "status-support"
    : target.noSource
    ? isActionableTarget(target)
      ? "status-gap"
      : "status-explained"
    : "status-ok";
  const issueAction = target.sourceMappings.length
    ? externalLink(
        target.sourceMappings[0]!.issueUrl,
        "Open mapping issue ↗",
        "button button-primary"
      )
    : isActionableTarget(target)
    ? externalLink(target.issueUrl, "Open coverage issue ↗", "button button-primary")
    : link("../index.html#carta-targets", "Back to Carta records ↗", "button button-primary");
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
    `<div class="breadcrumbs">${link("../index.html", "Data map")} <span>/</span> ${link(
      "../index.html#carta-targets",
      "Carta records"
    )} <span>/</span> <strong>${html(target.name)}</strong></div>
    <section class="detail-hero"><div><span class="eyebrow">Carta record definition</span><h1>${html(
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
    )}<div class="section-heading compact space-top"><div><span class="eyebrow">Property ledger</span><h2>Slot by slot</h2><p>Schema types are shown for both sides of each mapping slot.</p></div></div><div class="table-wrap"><table><thead><tr><th>Carta property / type</th><th>Status</th><th>OCF evidence / type</th><th></th></tr></thead><tbody>${slots}</tbody></table></div></div><aside class="detail-aside"><div class="side-card"><span class="eyebrow">Structural parents</span><div class="token-stack">${parents}</div><p class="muted">Nested definitions remain visible without being mistaken for standalone mapping targets.</p></div><div class="side-card"><span class="eyebrow">Raw artifacts</span><p>Use the generated report for role policy and the interactive viewer for cross-object flow inspection.</p>${link(
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
    '  const sideFromHash = () => window.location.hash === "#carta-targets" ? "target" : "source";',
    "  const setSide = (side, scrollToPanel = false) => {",
    '    document.querySelectorAll("[data-side-panel]").forEach((panel) => { const active = panel.dataset.sidePanel === side; panel.hidden = !active; panel.setAttribute("aria-hidden", String(!active)); });',
    '    document.querySelectorAll("[data-side-tab]").forEach((button) => { const active = button.dataset.sideTab === side; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active)); });',
    '    if (scrollToPanel) { const panel = document.querySelector(`[data-side-panel="${side}"]`); panel?.scrollIntoView({ behavior: "auto", block: "start" }); }',
    "  };",
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
    '  document.querySelectorAll("[data-side-tab]").forEach((button) => {',
    '    button.addEventListener("click", () => { const side = button.dataset.sideTab || "source"; history.replaceState(null, "", side === "target" ? "#carta-targets" : "#ocf-objects"); setSide(side, true); });',
    "  });",
    "  setSide(sideFromHash(), Boolean(window.location.hash));",
    '  window.addEventListener("hashchange", () => setSide(sideFromHash(), true));',
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
    ".brand { display: inline-flex; align-items: center; gap: 12px; font-weight: 800; letter-spacing: -.04em; text-decoration: none; font-size: 18px; }",
    `.brand::before { content: none; } .brand-mark { display: block; width: 166px; height: 36px; flex: 0 0 auto; background: url("${OCT_ICON_DATA_URI}") center / 166px 36px no-repeat; }`,
    ".nav-links { display: flex; gap: 24px; color: var(--muted); font-size: 13px; } .nav-links a, .text-link { text-decoration: none; } .nav-links a:hover, .text-link:hover { color: var(--mint); }",
    ".hero { min-height: 570px; display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; gap: 60px; padding: 92px 0 70px; }",
    ".hero h1 { font-size: clamp(44px, 6vw, 78px); line-height: .98; letter-spacing: -.07em; max-width: 760px; margin: 16px 0 24px; } .hero-lede { max-width: 630px; color: var(--muted); font-size: 18px; }",
    ".eyebrow { display: block; color: var(--subtle); font-size: 11px; letter-spacing: .15em; text-transform: uppercase; font-weight: 800; } .eyebrow.accent { color: var(--mint); }",
    ".hero-actions, .detail-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; }",
    ".button { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 999px; padding: 11px 17px; text-decoration: none; font-size: 13px; font-weight: 750; transition: transform .18s ease, border-color .18s ease; } .button:hover { transform: translateY(-2px); border-color: rgba(143,240,206,.5); } .button-primary { background: var(--mint); color: #08131c; border-color: var(--mint); } .button-quiet { background: rgba(255,255,255,.035); color: var(--ink); }",
    ".hero-orbit { height: 390px; position: relative; display: grid; place-items: center; overflow: hidden; } .orbit-ring { position: absolute; border: 1px solid rgba(143,240,206,.28); border-radius: 50%; transform: rotate(-20deg); } .ring-one { width: 300px; height: 190px; } .ring-two { width: 220px; height: 340px; border-color: rgba(145,185,255,.26); transform: rotate(52deg); }",
    `.orbit-core { width: 155px; height: 155px; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(145deg, #1e3550, #101a2d); box-shadow: 0 0 0 13px rgba(143,240,206,.05), 0 0 70px rgba(143,240,206,.18); font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .16em; } .orbit-mark { display: block; width: 36px; height: 36px; margin-bottom: 9px; background: url("${OCT_ICON_DATA_URI}") left center / 166px 36px no-repeat; } .orbit-core strong { font-size: 23px; letter-spacing: -.04em; text-transform: none; color: var(--ink); }`,
    ".orbit-tag { position: absolute; padding: 7px 11px; border-radius: 999px; background: rgba(17,26,44,.9); border: 1px solid var(--line); font-size: 11px; font-weight: 800; letter-spacing: .1em; } .tag-one { top: 70px; left: 34px; color: var(--mint); } .tag-two { right: 15px; top: 130px; color: var(--blue); } .tag-three { bottom: 70px; left: 92px; color: var(--coral); }",
    ".metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 80px; } .metric { padding: 24px; background: rgba(17,26,44,.72); border: 1px solid var(--line); border-radius: 18px; } .metric strong { display: block; font-size: 38px; line-height: 1; letter-spacing: -.07em; } .metric span { display: block; color: var(--muted); font-size: 12px; margin-top: 10px; } .metric-warn strong { color: var(--coral); }",
    ".map-guide { display: grid; grid-template-columns: minmax(230px, .72fr) minmax(0, 1.28fr); gap: 28px; align-items: start; margin-bottom: 42px; padding: 24px 26px; background: rgba(17,26,44,.72); border: 1px solid var(--line); border-radius: 18px; } .map-guide-heading h2 { margin: 8px 0 10px; font-size: 27px; letter-spacing: -.05em; } .map-guide-heading p { margin: 0; color: var(--muted); font-size: 13px; } .map-guide-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 0; padding: 0; list-style: none; } .map-guide-step { display: flex; gap: 10px; min-width: 0; padding: 13px; border: 1px solid var(--line); border-radius: 12px; background: rgba(255,255,255,.025); } .map-guide-number { display: grid; place-items: center; flex: 0 0 24px; width: 24px; height: 24px; border-radius: 50%; background: var(--mint); color: #08131c; font-size: 11px; font-weight: 850; } .map-guide-step strong, .map-guide-step span { display: block; } .map-guide-step strong { font-size: 13px; } .map-guide-step div > span { margin-top: 4px; color: var(--muted); font-size: 11px; line-height: 1.4; }",
    ".card, .side-card, .artifact-frame, .empty-state { background: rgba(17,26,44,.72); border: 1px solid var(--line); border-radius: 24px; }",
    ".section-heading h2, .closing-band h2 { margin: 8px 0 12px; font-size: 34px; letter-spacing: -.06em; } .section-heading p, .side-card p { color: var(--muted); }",
    ".artifact-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 4px 0; color: var(--muted); font-size: 12px; }",
    ".directory-section { padding: 34px 0 72px; scroll-margin-top: 80px; } .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 28px; } .section-heading.compact { align-items: start; } .section-heading h2 { margin-top: 6px; }",
    ".direction-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; margin: 0 0 18px; padding: 1px; background: var(--line); } .direction-tab { appearance: none; -webkit-appearance: none; display: grid; width: 100%; gap: 5px; border: 0; padding: 18px 20px; background: var(--panel); color: var(--muted); font: inherit; text-align: left; cursor: pointer; } .direction-tab:hover { color: var(--ink); } .direction-tab:focus-visible { outline: 2px solid var(--mint); outline-offset: -4px; } .direction-tab.is-active { background: var(--mint); color: #08131c; } .direction-tab-kicker { font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; } .direction-tab strong { font-size: 18px; font-weight: 750; letter-spacing: -.03em; }",
    ".filter-controls { display: flex; flex-direction: column; gap: 9px; align-items: end; } .filter-controls input { width: 240px; background: rgba(255,255,255,.05); border: 1px solid var(--line); border-radius: 10px; padding: 11px 13px; color: var(--ink); outline: none; } .filter-controls input:focus { border-color: var(--mint); } .filter-buttons { display: flex; gap: 6px; } .filter-button { border: 1px solid var(--line); background: transparent; color: var(--muted); border-radius: 999px; padding: 7px 11px; font-size: 11px; cursor: pointer; } .filter-button.is-active, .filter-button:hover { background: rgba(143,240,206,.11); border-color: rgba(143,240,206,.4); color: var(--mint); }",
    ".directory-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; } .card { min-width: 0; padding: 20px; min-height: 210px; display: flex; flex-direction: column; } .card.is-gap { border-color: rgba(255,146,127,.27); background: linear-gradient(145deg, rgba(74,31,42,.46), rgba(17,26,44,.72)); } .card-top, .card-footer { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; }",
    ".card-title { display: block; min-width: 0; font-size: 22px; letter-spacing: -.05em; text-decoration: none; margin: 17px 0 10px; overflow-wrap: anywhere; word-break: break-word; } .card-title:hover { color: var(--mint); } .card-copy { color: var(--muted); font-size: 12px; margin: 0 0 18px; overflow-wrap: anywhere; }",
    ".status-pill, .kind-token { display: inline-flex; align-items: center; border-radius: 999px; padding: 5px 8px; font-size: 10px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; } .status-ok, .kind-mapped { color: var(--mint); background: rgba(143,240,206,.1); } .status-gap, .kind-gap { color: var(--coral); background: rgba(255,146,127,.1); } .status-explained { color: var(--blue); background: rgba(145,185,255,.1); } .status-support { color: var(--gold); background: rgba(255,211,139,.1); }",
    ".mini-chip, .target-token, .source-token { display: inline-flex; align-items: center; min-width: 0; max-width: 100%; width: max-content; border: 1px solid var(--line); background: rgba(255,255,255,.035); border-radius: 999px; padding: 5px 8px; color: var(--muted); font-size: 11px; overflow-wrap: anywhere; word-break: break-word; } .chip-row, .token-stack { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; } .card-footer { margin-top: auto; padding-top: 18px; } .issue-link { color: var(--coral); }",
    ".closing-band { display: flex; align-items: center; justify-content: space-between; gap: 28px; margin: 45px 0 100px; padding: 36px 40px; border: 1px solid rgba(143,240,206,.2); border-radius: 24px; background: linear-gradient(110deg, rgba(143,240,206,.08), rgba(145,185,255,.08)); } .site-footer { border-top: 1px solid var(--line); color: var(--subtle); font-size: 11px; } .footer-row { display: flex; justify-content: space-between; gap: 20px; padding: 25px 0; } .footer-brand-link { color: inherit; text-decoration: none; }",
    ".breadcrumbs { padding: 42px 0 20px; color: var(--subtle); font-size: 12px; } .breadcrumbs span { padding: 0 8px; color: var(--line); } .breadcrumbs strong { color: var(--ink); } .detail-hero { display: flex; align-items: end; justify-content: space-between; gap: 30px; padding: 34px 0 18px; } .detail-hero h1 { font-size: clamp(40px, 6vw, 68px); line-height: 1; letter-spacing: -.07em; margin: 10px 0; } .path-label { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--subtle); margin: 0; } .detail-actions { justify-content: end; margin: 0; }",
    ".detail-meta { display: flex; flex-wrap: wrap; gap: 10px 18px; color: var(--muted); font-size: 12px; padding: 17px 0 32px; } .callout { display: flex; gap: 15px; padding: 19px; border-radius: 18px; margin: 8px 0 30px; border: 1px solid rgba(255,146,127,.26); background: rgba(74,31,42,.45); color: var(--muted); } .callout strong { color: var(--ink); } .callout p { margin: 4px 0 13px; } .callout-icon { display: grid; place-items: center; flex: 0 0 25px; height: 25px; border-radius: 50%; background: var(--coral); color: #24111a; font-weight: 900; }",
    ".detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 26px; padding-bottom: 90px; } .detail-main { min-width: 0; } .detail-aside { display: grid; align-content: start; gap: 14px; } .side-card { padding: 21px; } .side-card h3 { font-size: 42px; line-height: 1; margin: 8px 0 18px; letter-spacing: -.07em; } .side-card .text-link { line-height: 2; }",
    ".table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 18px; background: rgba(17,26,44,.72); } table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 680px; } th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid var(--line); vertical-align: top; } th { color: var(--subtle); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; font-weight: 800; } tr:last-child td { border-bottom: 0; }",
    ".mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; } .strong { color: var(--ink); } .target-token { color: var(--blue); } .target-link { text-decoration: none; } .source-token { color: var(--mint); flex-direction: column; align-items: flex-start; } .schema-type { display: block; margin-top: 4px; color: var(--subtle); font: 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .01em; } .schema-type-label { margin-right: 5px; color: var(--blue); font-family: inherit; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; } .schema-type-link { color: inherit; text-decoration: none; } .schema-type-link:hover { color: var(--blue); text-decoration: underline; } .table-link { color: var(--coral); font-size: 11px; text-decoration: none; white-space: nowrap; } .empty-cell { color: var(--muted); text-align: center; padding: 35px; }",
    ".kind-select, .kind-rename, .kind-computed, .kind-enum-remap, .kind-combine, .kind-split, .kind-construct { color: var(--blue); background: rgba(145,185,255,.1); } .status-direct, .status-type-only, .status-implicit, .status-deferred, .status-structural { color: var(--mint); background: rgba(143,240,206,.1); } .status-empty { color: var(--coral); background: rgba(255,146,127,.1); } .status-nested-obj, .status-value-type { color: var(--gold); background: rgba(255,211,139,.1); }",
    ".evidence-list { display: grid; gap: 8px; } .evidence-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; border: 1px solid var(--line); background: rgba(17,26,44,.72); border-radius: 14px; padding: 13px 15px; } .evidence-row strong { display: block; } .evidence-row .muted { display: block; margin-top: 3px; } .muted { color: var(--muted); } .artifact-section { margin: 10px 0 34px; } .artifact-frame { padding: 15px; background: #f4f8ff; } .artifact-frame img { display: block; width: 100%; max-height: 620px; object-fit: contain; } .artifact-frame .artifact-toolbar { color: #65728a; } .empty-state { display: flex; flex-direction: column; gap: 6px; align-items: center; justify-content: center; min-height: 180px; padding: 25px; color: var(--muted); text-align: center; } .space-top { margin-top: 45px; } [hidden] { display: none !important; }",
    "@media (max-width: 900px) { .hero { grid-template-columns: 1fr; padding-top: 60px; } .hero-orbit { height: 300px; } .metrics-grid { grid-template-columns: repeat(2, 1fr); } .map-guide { grid-template-columns: 1fr; } .directory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .detail-grid { grid-template-columns: 1fr; } .detail-aside { grid-template-columns: repeat(2, 1fr); } .detail-hero { align-items: start; flex-direction: column; } .detail-actions { justify-content: start; } }",
    "@media (max-width: 620px) { .container { width: min(100% - 26px, 1180px); } .nav-row { height: auto; min-height: 72px; padding-top: 12px; padding-bottom: 12px; align-items: flex-start; } .brand { max-width: 42%; } .nav-links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px 10px; font-size: 10px; line-height: 1.3; } .hero h1 { font-size: 48px; } .hero-lede { font-size: 16px; } .metrics-grid, .directory-grid, .detail-aside { grid-template-columns: 1fr; } .map-guide { padding: 20px; } .map-guide-steps { grid-template-columns: 1fr; } .section-heading { align-items: start; flex-direction: column; } .filter-controls { align-items: stretch; width: 100%; } .filter-controls input { width: 100%; } .closing-band, .footer-row { align-items: start; flex-direction: column; } .closing-band { padding: 27px; } }",
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
    ".container { width: min(1024px, calc(100% - 40px)); } .site-header { position: relative; background: var(--primary); backdrop-filter: none; border-bottom: 1px solid rgba(255,255,255,.7); } .nav-row { height: 72px; } .brand { color: #fff; font-size: 12px; font-weight: 400; letter-spacing: .16em; text-transform: uppercase; } .brand::before { content: none; } .brand-mark { width: 166px; height: 36px; } .nav-links { color: rgba(255,255,255,.88); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; } .nav-links a:hover, .text-link:hover { color: #fff; }",
    '.hero { min-height: 520px; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); padding: 104px max(20px, calc((100vw - 1024px) / 2)) 112px; background: var(--primary); color: #fff; } .hero h1 { color: #fff; font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; font-size: clamp(40px, 5.2vw, 64px); font-weight: 400; line-height: 1.05; letter-spacing: .12em; text-transform: uppercase; } .hero-lede { color: rgba(255,255,255,.86); } .eyebrow { color: rgba(17,17,20,.58); font-weight: 400; letter-spacing: .14em; } .hero .eyebrow, .hero .eyebrow.accent { color: rgba(255,255,255,.78); }',
    ".hero-orbit { opacity: .86; } .orbit-ring { border-color: rgba(255,255,255,.52); } .ring-two { border-color: rgba(255,255,255,.32); } .orbit-core { background: transparent; border: 1px solid rgba(255,255,255,.6); box-shadow: none; color: rgba(255,255,255,.78); } .orbit-mark { width: 36px; height: 36px; } .orbit-core strong { color: #fff; } .orbit-tag { background: transparent; border-color: rgba(255,255,255,.55); border-radius: 0; color: #fff !important; font-weight: 400; }",
    ".map-guide { background: #f1f1ff; border-color: rgba(42,48,200,.22); } .map-guide-heading h2 { color: var(--ink); } .map-guide-heading p { color: var(--muted); } .map-guide-step { background: #fff; border-color: var(--line); } .map-guide-number { background: var(--primary); color: #fff; } .map-guide-step strong { color: var(--ink); } .map-guide-step div > span { color: var(--muted); }",
    ".metrics-grid { background: #f1f1ff; gap: 1px; padding: 1px; } .metric, .card, .side-card, .artifact-frame, .empty-state { background: #fff; border: 1px solid var(--line); border-radius: 0; box-shadow: none; } .metric { padding: 24px; } .metric strong { font-weight: 400; } .metric span, .section-heading p, .side-card p { color: var(--muted); }",
    '.section-heading h2, .closing-band h2, .question-panel-heading h2, .notes-panel .section-heading h2 { font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; font-weight: 400; letter-spacing: .1em; text-transform: uppercase; } .section-heading h2, .closing-band h2 { font-size: 30px; }',
    ".directory-section { border-top: 1px solid var(--line); } .filter-controls input { background: #fff; border: 1px solid var(--line); border-radius: 0; color: var(--ink); } .filter-controls input:focus { border-color: var(--primary); } .filter-button { border-radius: 0; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; } .filter-button.is-active, .filter-button:hover { background: #f1f1ff; border-color: var(--primary); color: var(--primary); } .card { padding: 20px; } .card.is-gap { border-color: rgba(42,48,200,.35); background: #f1f1ff; } .card-title { font-weight: 400; letter-spacing: .03em; } .card-title:hover { color: var(--primary); }",
    ".direction-tabs { background: #f1f1ff; } .direction-tab { background: #fff; color: var(--muted); } .direction-tab.is-active { background: var(--primary); color: #fff; } .direction-tab:hover { color: var(--primary); } .direction-tab.is-active:hover { color: #fff; } .direction-tab:focus-visible { outline-color: var(--primary); }",
    ".button { border-radius: 0; padding: 12px 18px; font-size: 11px; font-weight: 400; letter-spacing: .1em; text-transform: uppercase; transition: background-color .18s ease, color .18s ease, border-color .18s ease; } .button:hover { transform: none; border-color: var(--primary); } .button-primary { background: var(--primary); color: #fff; border-color: var(--primary); } .button-primary:hover { background: #111114; border-color: #111114; } .button-quiet { background: #fff; color: var(--primary); border-color: var(--primary); } .button-quiet:hover { background: #f1f1ff; }",
    ".status-pill, .kind-token, .mini-chip, .target-token, .source-token, .question-state { border-radius: 0; } .status-pill, .kind-token { font-weight: 400; letter-spacing: .08em; } .status-ok, .kind-mapped, .status-gap, .kind-gap, .status-explained, .status-support, .kind-select, .kind-rename, .kind-computed, .kind-enum-remap, .kind-combine, .kind-split, .kind-construct, .status-direct, .status-type-only, .status-implicit, .status-deferred, .status-structural, .status-empty, .status-nested-obj, .status-value-type { color: var(--primary); background: #f1f1ff; } .mini-chip, .target-token, .source-token { background: #f1f1ff; color: var(--primary); border-color: rgba(42,48,200,.24); } .issue-link, .table-link, .question-action, .question-target { color: var(--primary); }",
    ".status-pill, .kind-token, .mini-chip, .target-token, .source-token, .question-state { border-radius: 0; } .status-pill, .kind-token { font-weight: 400; letter-spacing: .08em; } .status-ok, .kind-mapped, .status-gap, .kind-gap, .status-explained, .status-support, .kind-select, .kind-rename, .kind-computed, .kind-enum-remap, .kind-combine, .kind-split, .kind-construct, .status-direct, .status-type-only, .status-implicit, .status-deferred, .status-structural, .status-empty, .status-nested-obj, .status-value-type { color: var(--primary); background: #f1f1ff; } .mini-chip, .target-token, .source-token { background: #f1f1ff; color: var(--primary); border-color: rgba(42,48,200,.24); } .issue-link, .table-link, .question-action, .question-target { color: var(--primary); }",
    ".closing-band { margin-bottom: 100px; padding: 36px 40px; border: 1px solid rgba(42,48,200,.25); border-radius: 0; background: #f1f1ff; } .site-footer { background: var(--primary); border-top: 0; color: rgba(255,255,255,.8); } .footer-row { color: rgba(255,255,255,.8); } .footer-brand-link:hover { color: #fff; }",
    '.breadcrumbs { color: var(--subtle); text-transform: uppercase; letter-spacing: .08em; } .detail-hero h1 { font-family: "Gotham", "Helvetica Neue", Arial, sans-serif; font-size: clamp(36px, 5.2vw, 60px); font-weight: 400; letter-spacing: .04em; } .callout { border-radius: 0; border-color: rgba(42,48,200,.28); background: #f1f1ff; color: var(--muted); } .callout strong { color: var(--ink); } .callout-icon { border-radius: 50%; background: var(--primary); color: #fff; }',
    ".table-wrap { border-radius: 0; background: #fff; } th, td { border-color: var(--line); } th { color: var(--primary); font-weight: 400; } .evidence-row { border-radius: 0; background: #fff; } .artifact-frame { background: #f1f1ff; }",
    ".notes-panel { border-color: rgba(42,48,200,.28); border-radius: 0; background: #f1f1ff; } .notes-list p { color: var(--ink); } .question-panel { border-color: rgba(42,48,200,.28); border-radius: 0; background: #f1f1ff; } .question-panel-heading h2 { font-size: 24px; } .question-state { color: var(--primary); background: #fff; border: 1px solid rgba(42,48,200,.24); font-weight: 400; } .question-row { border-radius: 0; background: #fff; } .question-open, .question-closed { border-color: rgba(42,48,200,.24); } .question-body p { font-weight: 400; } .question-chip { color: var(--primary); border-color: rgba(42,48,200,.24); }",
    ".directory-legend { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 20px; max-width: 760px; margin: -8px 0 26px auto; padding: 15px 18px; border: 1px solid rgba(42,48,200,.22); background: #f1f1ff; } .directory-legend p { margin: 5px 0 0; color: var(--muted); font-size: 12px; line-height: 1.55; } .directory-legend strong { color: var(--ink); font-weight: 500; } .legend-links { white-space: nowrap; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; } .legend-links a { color: var(--primary); text-decoration: none; } .legend-links a:hover { color: var(--ink); }",
    "@media (max-width: 900px) { .directory-legend { max-width: none; margin-left: 0; } }",
    "@media (max-width: 620px) { .hero { padding: 76px 20px 84px; } .hero h1 { font-size: 38px; letter-spacing: .1em; } .direction-tabs { grid-template-columns: 1fr; } .directory-legend { grid-template-columns: 1fr; gap: 10px; } .legend-links { white-space: normal; } }",
  ].join("\n");
}
