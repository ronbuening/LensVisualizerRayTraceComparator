#!/usr/bin/env node
// Make a replayable one-run suite from the source-owned catalog expansion; no prescriptions are written.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { REPO_ROOT, loadConfig } from "../src/core/config.ts";
import { expandSuite } from "../src/contract/runSpec.ts";
import { createLvCaseSource } from "../src/engines/lv/caseSource.ts";

const [name, output, ...extra] = process.argv.slice(2);
if (!name || !output?.endsWith(".json") || extra.length)
  throw new Error("Usage: node bin/catalog-case.mjs <expanded-run-name> <one-run-suite.json>");
const suite = JSON.parse(readFileSync(join(REPO_ROOT, "suites/catalog.json"), "utf8"));
const { config } = loadConfig({ rootDir: REPO_ROOT, env: process.env });
const source = createLvCaseSource(config.lvPath);
const selected = (await source.expand(expandSuite(suite)[0])).filter((run) => run.name === name);
if (selected.length !== 1) throw new Error(`${name}: expected one expanded catalog run, found ${selected.length}`);
const file = resolve(output);
mkdirSync(dirname(file), { recursive: true });
// A suite of its own name: run under the name "catalog", a reproduction would replace runs/catalog, the run that
// `lvrtc baseline write catalog` records, with a run of one state. Run names, cases and requests are unchanged.
writeFileSync(file, `${JSON.stringify({ ...suite, name: "catalog-repro", runs: selected }, null, 2)}\n`);
console.log(`node bin/lvrtc.mjs run ${output} --rungs r0,r1,r2,r3,r4,r4f,r6a --jobs 4`);
