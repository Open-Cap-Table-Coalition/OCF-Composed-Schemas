import path from "node:path";
import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";

import { isPlainObject } from "./mapping-validator.js";

const POLICY_FILE = "core/inverse-coverage-policy.yml";

export type CartaCoverageRole =
  | "value-type"
  | "alternate"
  | "report-rollup"
  | "vendor-family"
  | "workflow-gap"
  | "gap";

const ROLES = new Set<CartaCoverageRole>([
  "value-type",
  "alternate",
  "report-rollup",
  "vendor-family",
  "workflow-gap",
  "gap",
]);

export interface CartaCoveragePolicyEntry {
  role: CartaCoverageRole;
  reason: string;
}

export interface CoveragePolicy {
  cartaDefs: Map<string, CartaCoveragePolicyEntry>;
}

/** Load the shared, hand-curated inverse-coverage roles. */
export async function loadCoveragePolicy(repoRoot: string): Promise<CoveragePolicy> {
  const raw = parseYaml(await readFile(path.join(repoRoot, POLICY_FILE), "utf8"));
  const root = isPlainObject(raw) ? raw : {};
  const cartaDefs = new Map<string, CartaCoveragePolicyEntry>();
  const rawDefs = isPlainObject(root.carta_defs) ? root.carta_defs : {};

  for (const [name, rawEntry] of Object.entries(rawDefs)) {
    if (!isPlainObject(rawEntry)) {
      throw new Error(`${POLICY_FILE}: carta_defs.${name} must be a mapping`);
    }
    const role = rawEntry.role;
    const reason = rawEntry.reason;
    if (typeof role !== "string" || !ROLES.has(role as CartaCoverageRole)) {
      throw new Error(`${POLICY_FILE}: carta_defs.${name}.role is invalid`);
    }
    if (typeof reason !== "string" || reason.trim() === "") {
      throw new Error(`${POLICY_FILE}: carta_defs.${name}.reason is required`);
    }
    cartaDefs.set(name, { role: role as CartaCoverageRole, reason });
  }

  return { cartaDefs };
}

/** Fail closed when a curated role names a definition absent from the pinned bundle. */
export function validateCoveragePolicy(policy: CoveragePolicy, bundle: unknown): void {
  const defs = isPlainObject(bundle) && isPlainObject(bundle.$defs) ? bundle.$defs : {};
  const missing = [...policy.cartaDefs.keys()].filter((name) => !(name in defs));
  if (missing.length > 0) {
    throw new Error(`${POLICY_FILE}: unknown Carta $defs: ${missing.join(", ")}`);
  }
}
