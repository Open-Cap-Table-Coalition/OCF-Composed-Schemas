import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

export interface RawSchema {
  $id: string;
  title?: string;
  description?: string;
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  properties?: Record<string, RawSchema>;
  items?: RawSchema | RawSchema[];
  required?: string[];
  $ref?: string;
  [extra: string]: unknown;
}

export type Registry = Map<string, RawSchema>;

export async function loadRegistry(repoRoot: string): Promise<Registry> {
  const registry: Registry = new Map();
  const files = await collectSchemaFiles(repoRoot);

  for (const filePath of files) {
    const raw = JSON.parse(await readFile(filePath, "utf8")) as RawSchema;
    if (typeof raw.$id !== "string") {
      throw new Error(`Schema at ${filePath} has no $id`);
    }
    const existing = registry.get(raw.$id);
    if (existing) {
      throw new Error(`Duplicate $id ${raw.$id} encountered while loading ${filePath}`);
    }
    registry.set(raw.$id, raw);
  }

  return registry;
}

async function collectSchemaFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.endsWith(".schema.json")) continue;
    // Node 20+: Dirent.parentPath holds the directory; fall back to .path on older types.
    const dir =
      (e as unknown as { parentPath?: string; path?: string }).parentPath ??
      (e as unknown as { path?: string }).path ??
      root;
    const full = path.join(dir, e.name);
    const rel = path.relative(root, full);
    if (rel.split(path.sep).includes("node_modules")) continue;
    out.push(full);
  }
  return out.sort();
}
