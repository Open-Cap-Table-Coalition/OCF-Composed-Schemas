#!/usr/bin/env node
/**
 * OCF Core — render the mermaid diagrams embedded in the generated reports to SVG.
 *
 * The report generators emit each diagram as `![alt](img/….svg)` followed by a
 * collapsed `<details>` holding the ```mermaid``` source (see report-flow.embedMermaid).
 * This step reads those pairs and renders each source to its SVG with the real mermaid
 * (mermaid-cli / headless Chromium), so GitHub shows a crisp image regardless of its
 * own mermaid version — while the source stays in the doc, editable.
 *
 * Browser resolution: PUPPETEER_EXECUTABLE_PATH if set, else a cached
 * chrome-headless-shell under ~/.cache/puppeteer, else puppeteer's own default. A
 * white canvas (`-b white`) keeps diagrams legible in GitHub light AND dark themes.
 *
 *   npm run core:render
 */
import path from "node:path";
import os from "node:os";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Reports whose embedded diagrams get rendered. (Only docs/ discussion artifacts for now.)
const TARGETS = ["docs/core-bidirectional-flow.md"];

async function findBrowser(): Promise<string | undefined> {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const base = path.join(os.homedir(), ".cache", "puppeteer", "chrome-headless-shell");
  try {
    for (const ver of (await readdir(base)).sort().reverse()) {
      const inner = (await readdir(path.join(base, ver)))[0];
      if (!inner) continue;
      const bin = path.join(base, ver, inner, "chrome-headless-shell");
      if (existsSync(bin)) return bin;
    }
  } catch {
    /* no puppeteer cache — fall through to puppeteer's default resolution */
  }
  return undefined;
}

async function main(): Promise<number> {
  const repoRoot = process.cwd();
  const exe = await findBrowser();
  const pptr = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ...(exe ? { executablePath: exe } : {}),
  };
  const cfgPath = path.join(os.tmpdir(), "ocf-core-mermaid-pptr.json");
  await writeFile(cfgPath, JSON.stringify(pptr), "utf8");
  // The package restricts `exports`, so resolve the cli file by path (run via node).
  const mmdc = [
    path.join(repoRoot, "node_modules/@mermaid-js/mermaid-cli/src/cli.js"),
    path.join(repoRoot, "node_modules/.bin/mmdc"),
  ].find((p) => existsSync(p));
  if (!mmdc) {
    console.error("mermaid-cli not found — run `npm i -D @mermaid-js/mermaid-cli`.");
    return 1;
  }
  console.log(`mermaid-cli via ${exe ? path.basename(exe) : "puppeteer default"}`);

  // `![alt](path.svg)` … ```mermaid <body> ``` — each image paired with the next block.
  const re = /!\[[^\]]*\]\(([^)]+\.svg)\)[\s\S]*?```mermaid\n([\s\S]*?)\n```/g;
  let total = 0;
  const failures: string[] = [];
  for (const rel of TARGETS) {
    const mdAbs = path.join(repoRoot, rel);
    const text = await readFile(mdAbs, "utf8");
    let n = 0;
    for (const [, img, body] of text.matchAll(re)) {
      const svgAbs = path.resolve(path.dirname(mdAbs), img as string);
      await mkdir(path.dirname(svgAbs), { recursive: true });
      const tmp = path.join(os.tmpdir(), `ocf-core-diagram.mmd`);
      await writeFile(tmp, body as string, "utf8");
      try {
        execFileSync(
          process.execPath,
          [mmdc, "-i", tmp, "-o", svgAbs, "-p", cfgPath, "-b", "white"],
          {
            stdio: "pipe",
          }
        );
        total += 1;
      } catch (err) {
        failures.push(`${img}: ${(err as Error).message.split("\n")[0]}`);
      }
      n += 1;
    }
    console.log(`  ${rel}: ${n} diagram(s)`);
  }
  if (failures.length) {
    console.error(`\n${failures.length} render failure(s):`);
    for (const f of failures) console.error("  ✗ " + f);
    return 1;
  }
  console.log(`\nRendered ${total} SVG(s).`);
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
