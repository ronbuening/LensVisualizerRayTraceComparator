#!/usr/bin/env node
// Make a replayable one-run suite from the source-owned catalog expansion; no prescriptions are written.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { REPO_ROOT, loadConfig } from "../src/core/config.ts";
import { expandSuite } from "../src/contract/runSpec.ts";
import { currentCheckId } from "../src/core/legacyIds.ts";
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
// The catalog's suite names its checks by the ids of before the rename; a new reproducer names them by today's.
const checks = (rungs) => (rungs === undefined ? {} : { rungs: rungs.map((id) => currentCheckId(id)) });
const defaults =
  suite.defaults === undefined ? {} : { defaults: { ...suite.defaults, ...checks(suite.defaults.rungs) } };
const runs = selected.map((run) => ({ ...run, ...checks(run.rungs) }));
writeFileSync(file, `${JSON.stringify({ ...suite, ...defaults, name: "catalog-repro", runs }, null, 2)}\n`);
console.log(
  `node bin/lvrtc.mjs run ${output} --checks built-system,first-order,ray-trace,optical-path,geometric-mtf,lv-mtf-replay,wave-mtf --jobs 4`,
);
