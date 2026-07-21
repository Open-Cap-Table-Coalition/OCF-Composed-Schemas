#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

interface ProvenanceLock {
  schema: number;
  ocf: {
    repository: string;
    version: string;
    revision: string;
    resolved_commit: string;
    snapshot_sha256: string;
    schema_file_count: number;
  };
  carta: {
    snapshot_file: string;
    version: string;
    sha256: string;
  };
}

const repoRoot = process.cwd();
const sourceDirs = ["enums", "files", "objects", "primitives", "types"] as const;

async function collectSourceFiles(): Promise<string[]> {
  const files: string[] = [];
  const visit = async (relativeDir: string): Promise<void> => {
    const absoluteDir = path.join(repoRoot, relativeDir);
    for (const entry of await readdir(absoluteDir, { withFileTypes: true })) {
      const relativePath = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) await visit(relativePath);
      else if (entry.isFile() && entry.name.endsWith(".schema.json")) files.push(relativePath);
    }
  };
  for (const dir of sourceDirs) await visit(dir);
  return files.sort();
}

async function sourceSnapshotSha256(files: string[]): Promise<string> {
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath.replaceAll(path.sep, "/"));
    hash.update("\0");
    hash.update(await readFile(path.join(repoRoot, relativePath)));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function fail(message: string): never {
  throw new Error(`provenance check failed: ${message}`);
}

const lock = JSON.parse(
  await readFile(path.join(repoRoot, "provenance.lock.json"), "utf8")
) as ProvenanceLock;
if (lock.schema !== 1) fail(`unsupported lock schema ${String(lock.schema)}`);
if (!/^main$/.test(lock.ocf.revision)) fail("OCF revision must remain an explicit branch/ref name");
if (!/^[0-9a-f]{40}$/.test(lock.ocf.resolved_commit))
  fail("OCF resolved_commit is not a 40-character SHA-1");

const sourceFiles = await collectSourceFiles();
if (sourceFiles.length !== lock.ocf.schema_file_count) {
  fail(`OCF schema file count is ${sourceFiles.length}, expected ${lock.ocf.schema_file_count}`);
}
const sourceHash = await sourceSnapshotSha256(sourceFiles);
if (sourceHash !== lock.ocf.snapshot_sha256) {
  fail(`OCF source snapshot SHA-256 is ${sourceHash}, expected ${lock.ocf.snapshot_sha256}`);
}

const cartaBytes = await readFile(path.join(repoRoot, lock.carta.snapshot_file));
const cartaHash = createHash("sha256").update(cartaBytes).digest("hex");
if (cartaHash !== lock.carta.sha256) {
  fail(`Carta snapshot SHA-256 is ${cartaHash}, expected ${lock.carta.sha256}`);
}

console.log(
  `OK: OCF ${lock.ocf.version} ${lock.ocf.revision}@${lock.ocf.resolved_commit} and Carta ${lock.carta.version} provenance verified`
);
