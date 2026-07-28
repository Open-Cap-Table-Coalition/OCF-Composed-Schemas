#!/usr/bin/env node

import { createHash } from "node:crypto";
import path from "node:path";
import { readFile } from "node:fs/promises";

import { parseMappingDocument } from "./lib/mapping-parser.js";
import { collectMappingFiles } from "./lib/mapping-input.js";
import { resolveJsonPointer } from "./lib/mapping-validator.js";

const EXPECTED_VERSION = "v1alpha1 (2026-06-22)";
const EXPECTED_SHA256 = "b8d54974eea8957f67ebe600097b31024a691e50d949a8a6db6227dd7a2aa06c";
const EXPECTED_MAPPING_FILE_COUNT = 102;
const EXPECTED_DEFINITION_COUNT = 99;

const REMOVED_DEFINITIONS = new Set([
  "Acceleration",
  "BoardApproval",
  "CapitalizationTableSummary",
  "Compliance",
  "Corporation",
  "Date",
  "Document",
  "FederalExemption",
  "GrantReason",
  "Interest",
  "NoteBlockSummary",
  "OptionGrantDocuments",
  "OptionPoolSummary",
  "PhantomCancellationReason",
  "PhantomCancellationTransaction",
  "PhantomIssuanceTransaction",
  "PhantomTransactionItem",
  "PiuCancellationReason",
  "PiuCancellationTransaction",
  "PiuIssuanceReason",
  "PiuIssuanceTransaction",
  "PiuTransactionItem",
  "SarCancellationReason",
  "SarCancellationTransaction",
  "SarExerciseTransaction",
  "SarIssuanceTransaction",
  "SarTransactionItem",
  "ShareClassSummary",
  "ShareClassValuation",
  "StakeholderCapitalizationTableSummary",
  "StakeholderGroup",
  "StakeholderNoteBlockSummary",
  "StakeholderOptionPoolSummary",
  "StakeholderShareClassSummary",
  "StakeholderType",
  "StakeholderWarrantBlockSummary",
  "ThresholdDetails",
  "ThresholdDetailsThresholdType",
  "Vesting",
  "WarrantBlockSummary",
]);

// These are deliberate context/shape exceptions, not silent omissions. The
// checker fails if the new bundle introduces any additional unmapped required
// field or if one of these documented exceptions disappears unexpectedly.
const REQUIRED_FIELD_EXCEPTIONS: Record<string, string[]> = {
  Certificate: ["issuerId"],
  ConvertibleNote: ["interest", "issuerId", "noteBlock"],
  OptionExercise: ["issuerId", "optionGrantId", "quantity", "stakeholderId"],
  OptionGrant: ["issuerId"],
  PointOfContact: ["issuerId", "type"],
  RestrictedStockAward: ["issuerId"],
  RestrictedStockUnit: ["issuerId"],
  ShareClass: ["issuerId"],
  Stakeholder: ["issuerId"],
  VestingScheduleTemplate: ["issuerId", "name", "vestingScheduleType"],
};

function collectTargetPointers(value: unknown, out: Set<string>): void {
  if (typeof value === "string") {
    if (value.startsWith("#/$defs/")) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectTargetPointers(item, out);
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const item of Object.values(value)) collectTargetPointers(item, out);
  }
}

function targetRoot(pointer: string): string | undefined {
  const parts = pointer.slice("#/$defs/".length).split("/");
  return parts[0];
}

function targetProperty(pointer: string, root: string): string | undefined {
  const parts = pointer.slice(`#/$defs/${root}/`.length).split("/");
  return parts[0] === "properties" ? parts[1] : undefined;
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const errors: string[] = [];
  const schemaPath = path.join(repoRoot, "target-schema/Carta.schema.json");
  const schemaText = await readFile(schemaPath, "utf8");
  const schema = JSON.parse(schemaText) as {
    $defs?: Record<string, { required?: string[] }>;
  };
  const defs = schema.$defs ?? {};
  const sha256 = createHash("sha256").update(schemaText).digest("hex");

  if (sha256 !== EXPECTED_SHA256) {
    errors.push(`schema SHA-256 is ${sha256}, expected ${EXPECTED_SHA256}`);
  }
  if (Object.keys(defs).length !== EXPECTED_DEFINITION_COUNT) {
    errors.push(
      `schema has ${Object.keys(defs).length} definitions, expected ${EXPECTED_DEFINITION_COUNT}`
    );
  }
  for (const name of REMOVED_DEFINITIONS) {
    if (name in defs) errors.push(`removed definition is still present: ${name}`);
  }

  const readme = await readFile(path.join(repoRoot, "target-schema/README.md"), "utf8");
  if (!readme.includes(`**Version:** ${EXPECTED_VERSION}`)) {
    errors.push("target-schema/README.md does not carry the expected version");
  }
  if (!readme.includes(EXPECTED_SHA256)) {
    errors.push("target-schema/README.md does not carry the expected SHA-256");
  }
  const provenance = JSON.parse(
    await readFile(path.join(repoRoot, "provenance.lock.json"), "utf8")
  ) as { carta?: { version?: string; sha256?: string } };
  if (provenance.carta?.version !== EXPECTED_VERSION) {
    errors.push("provenance.lock.json has the wrong Carta version");
  }
  if (provenance.carta?.sha256 !== EXPECTED_SHA256) {
    errors.push("provenance.lock.json has the wrong Carta SHA-256");
  }

  const mappingFiles = await collectMappingFiles(repoRoot);
  if (mappingFiles.length !== EXPECTED_MAPPING_FILE_COUNT) {
    errors.push(
      `found ${mappingFiles.length} mapping files, expected ${EXPECTED_MAPPING_FILE_COUNT}`
    );
  }

  const pointers = new Set<string>();
  const mappedProperties = new Map<string, Set<string>>();
  for (const rel of mappingFiles) {
    const markdown = await readFile(path.join(repoRoot, rel), "utf8");
    let parsed;
    try {
      parsed = parseMappingDocument(markdown, rel);
    } catch (error) {
      errors.push(`${rel}: ${(error as Error).message}`);
      continue;
    }
    if (parsed.frontmatter.target_version !== EXPECTED_VERSION) {
      errors.push(`${rel}: target_version is not ${EXPECTED_VERSION}`);
    }
    const filePointers = new Set<string>();
    collectTargetPointers(parsed.mapping, filePointers);
    for (const pointer of filePointers) pointers.add(pointer);
  }

  for (const pointer of pointers) {
    const root = targetRoot(pointer);
    if (!root) continue;
    if (REMOVED_DEFINITIONS.has(root)) {
      errors.push(`mapping target points to removed definition: ${pointer}`);
    }
    const resolved = resolveJsonPointer(schema, pointer);
    if (!resolved.found) errors.push(`mapping target does not resolve: ${pointer}`);
    if (resolved.value === true)
      errors.push(`mapping target resolves to excluded true: ${pointer}`);
    const property = targetProperty(pointer, root);
    if (property) {
      const existing = mappedProperties.get(root) ?? new Set<string>();
      existing.add(property);
      mappedProperties.set(root, existing);
    }
  }

  for (const [root, definition] of Object.entries(defs)) {
    if (!(root in REQUIRED_FIELD_EXCEPTIONS)) continue;
    const required = new Set(definition.required ?? []);
    const mapped = mappedProperties.get(root) ?? new Set<string>();
    const missing = [...required].filter((field) => !mapped.has(field)).sort();
    const expected = [...(REQUIRED_FIELD_EXCEPTIONS[root] ?? [])].sort();
    if (missing.join("\u0000") !== expected.join("\u0000")) {
      errors.push(
        `${root} required-field audit mismatch: missing [${missing.join(
          ", "
        )}], expected explicit exceptions [${expected.join(", ")}]`
      );
    }
  }

  const requiredExclusionFiles = [
    "objects/Document.mapping.md",
    "objects/Valuation.mapping.md",
    "objects/StockPlan.mapping.md",
    "types/SecurityExemption.mapping.md",
    "objects/transactions/issuance/ConvertibleIssuance.mapping.md",
    "objects/transactions/issuance/EquityCompensationIssuance.mapping.md",
    "objects/transactions/issuance/StockIssuance.mapping.md",
    "objects/transactions/issuance/WarrantIssuance.mapping.md",
    "objects/transactions/return_to_pool/StockPlanReturnToPool.mapping.md",
  ];
  for (const rel of requiredExclusionFiles) {
    const markdown = await readFile(path.join(repoRoot, rel), "utf8");
    if (!markdown.includes("reason: excluded-from-snapshot")) {
      errors.push(`${rel}: missing explicit excluded-from-snapshot migration marker`);
    }
  }

  for (const rel of [
    "types/vesting/VestingScheduleSegment.mapping.md",
    "types/vesting/VestingStatement.mapping.md",
  ]) {
    const markdown = await readFile(path.join(repoRoot, rel), "utf8");
    if (!/lengthUnit\s*=\s*MONTH/u.test(markdown)) {
      errors.push(`${rel}: missing June 22 VestingPeriod MONTH constraint acknowledgment`);
    }
  }

  const explainer = await readFile(path.join(repoRoot, "target-schema/Explainer.md"), "utf8");
  if (!explainer.includes("Carta")) errors.push("target-schema/Explainer.md is missing or empty");
  const generatedIndex = await readFile(
    path.join(repoRoot, "docs/generated/mapping-explorer/index.html"),
    "utf8"
  );
  for (const expected of [
    EXPECTED_VERSION,
    EXPECTED_SHA256,
    "Read Explainer ↗",
    "schema-source-panel",
  ]) {
    if (!generatedIndex.includes(expected)) {
      errors.push(`generated mapping explorer is missing: ${expected}`);
    }
  }

  if (errors.length) {
    for (const error of errors) console.error(error);
    console.error(`FAILED: ${errors.length} Carta schema refresh check(s)`);
    return 1;
  }
  console.log(
    `OK: Carta schema refresh ${EXPECTED_VERSION}; ${mappingFiles.length} mappings, ${pointers.size} live target pointers, ${REMOVED_DEFINITIONS.size} removed definitions audited`
  );
  return 0;
}

process.exitCode = await main();
