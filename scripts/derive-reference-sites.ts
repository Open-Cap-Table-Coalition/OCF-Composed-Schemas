#!/usr/bin/env node
import { readFile } from "node:fs/promises";

import { updateGeneratedReferenceSection } from "./lib/reference-sites.js";

const repoRoot = process.cwd();
const schemaPath = "types/CountryCode.schema.json";
const mappingPath = "types/CountryCode.mapping.md";
const schema = JSON.parse(await readFile(`${repoRoot}/${schemaPath}`, "utf8")) as {
  $id?: unknown;
};

if (typeof schema.$id !== "string") {
  console.error(`${schemaPath}: missing string $id`);
  process.exit(1);
}

const sites = await updateGeneratedReferenceSection(repoRoot, schema.$id, mappingPath);
console.log(`OK: generated ${sites.length} CountryCode reference site(s) in ${mappingPath}`);
