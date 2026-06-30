#!/usr/bin/env node
/**
 * OCF Core — CI gates (§5/§6). Read-only; exits non-zero on failure.
 *
 *   1. SUBSET — every Core-admissible (entity,variant) the generator drafts must
 *      be RATIFIED in core/allow-list.yml. An over-derivation (a wrongly-`core`
 *      field flipping an unratified entity admissible) trips this gate; fix the
 *      mapping or ratify the entity. (Ratified-but-not-yet-admissible is fine —
 *      graduation is automatic once its mapping is green.)
 *   2. DRIFT — the committed core/core.schema.json must equal a fresh recompute
 *      (structural equality after canonical key-sort). Hand-edits and stale
 *      builds trip this; run `npm run core:build` and commit.
 *
 *   npm run core:check
 */
import path from "node:path";
import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";

import { deriveCore } from "./lib/core-pipeline.js";

const ALLOW_LIST = "core/allow-list.yml";
const SCHEMA = "core/core.schema.json";

/** Recursively sort object keys so comparison is structural, not key-order. */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      out[k] = canonical((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const derived = await deriveCore(repoRoot);
  const failures: string[] = [];

  // --- Gate 1: subset -------------------------------------------------------
  let ratified = new Set<string>();
  try {
    const raw = parseYaml(await readFile(path.join(repoRoot, ALLOW_LIST), "utf8"));
    const list = raw && typeof raw === "object" ? (raw as { ratified?: unknown }).ratified : null;
    if (Array.isArray(list))
      ratified = new Set(list.filter((x): x is string => typeof x === "string"));
    else failures.push(`${ALLOW_LIST}: missing or malformed "ratified:" list`);
  } catch (err) {
    failures.push(
      `${ALLOW_LIST}: cannot read (${(err as Error).message}) — create it or run core:build`
    );
  }

  const drafted = derived.coreEntities.map((e) => e.defName).sort();
  const unratified = drafted.filter((d) => !ratified.has(d));
  if (unratified.length) {
    failures.push(
      `SUBSET: the generator drafts ${unratified.length} admissible $def(s) not in ${ALLOW_LIST}:\n` +
        unratified.map((d) => `    + ${d}`).join("\n") +
        `\n  → ratify them, or correct the mapping if they are over-derived.`
    );
  }
  const pendingGraduation = [...ratified].filter((r) => !drafted.includes(r)).sort();

  // --- Gate 2: drift --------------------------------------------------------
  try {
    const committed = JSON.parse(await readFile(path.join(repoRoot, SCHEMA), "utf8"));
    if (JSON.stringify(canonical(committed)) !== JSON.stringify(canonical(derived.schema))) {
      failures.push(
        `DRIFT: committed ${SCHEMA} differs from a fresh recompute — run \`npm run core:build\` and commit.`
      );
    }
  } catch (err) {
    failures.push(
      `DRIFT: cannot read ${SCHEMA} (${
        (err as Error).message
      }) — run \`npm run core:build\` and commit.`
    );
  }

  // --- Report ---------------------------------------------------------------
  if (failures.length) {
    console.error("OCF Core check: FAIL\n");
    for (const f of failures) console.error("✗ " + f + "\n");
    return 1;
  }
  console.log(
    `OCF Core check: OK — ${drafted.length} admissible $def(s) all ratified; schema matches recompute.` +
      (pendingGraduation.length
        ? `\n  (${
            pendingGraduation.length
          } ratified but awaiting a green mapping: ${pendingGraduation.join(", ")})`
        : "")
  );
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
