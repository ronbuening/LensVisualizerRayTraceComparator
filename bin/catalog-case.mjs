#!/usr/bin/env node
// Make a replayable one-run suite from the source-owned expansion of a suite that lists known failures (the catalog,
// or another of KNOWN_FAILURE_SUITES, such as focus-stations); no prescriptions are written.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { KNOWN_FAILURE_SUITES, reproducerSuiteName } from "../src/baseline/catalog.ts";
import { REPO_ROOT, loadConfig } from "../src/core/config.ts";
import { expandSuite } from "../src/contract/runSpec.ts";
import { currentCheckId, currentEngineId } from "../src/core/legacyIds.ts";
import { createLvCaseSource } from "../src/engines/lv/caseSource.ts";

const usage = "Usage: node bin/catalog-case.mjs [--suite <suite>] <expanded-run-name> <one-run-suite.json>";
const args = process.argv.slice(2);
let suiteName = "catalog";
if (args[0] === "--suite") {
  suiteName = args[1];
  args.splice(0, 2);
}
const [name, output, ...extra] = args;
if (!name || !output?.endsWith(".json") || extra.length) throw new Error(usage);
if (!KNOWN_FAILURE_SUITES.includes(suiteName))
  throw new Error(`${suiteName}: reproducers are made of ${KNOWN_FAILURE_SUITES.join(" and ")} alone\n${usage}`);
const suite = JSON.parse(readFileSync(join(REPO_ROOT, "suites", `${suiteName}.json`), "utf8"));
const { config } = loadConfig({ rootDir: REPO_ROOT, env: process.env });
const source = createLvCaseSource(config.lvPath);
const expanded = [];
for (const spec of expandSuite(suite)) expanded.push(...(await source.expand(spec)));
const selected = expanded.filter((run) => run.name === name);
if (selected.length !== 1) throw new Error(`${name}: expected one expanded ${suiteName} run, found ${selected.length}`);
const file = resolve(output);
mkdirSync(dirname(file), { recursive: true });
// A suite of its own name (`<suite>-repro`): run under the suite's own name, a reproduction would replace
// runs/<suite>, the run that `lvrtc baseline write <suite>` records, with a run of one state. Run names, cases and
// requests are unchanged. The catalog's suite names its checks and engines by the ids of before the renames; a new
// reproducer names them by today's.
const checks = (rungs) => (rungs === undefined ? {} : { rungs: rungs.map((id) => currentCheckId(id)) });
const engines = (ids) => (ids === undefined ? {} : { engines: ids.map((id) => currentEngineId(id)) });
const ids = (spec) => ({ ...spec, ...checks(spec.rungs), ...engines(spec.engines) });
const defaults = suite.defaults === undefined ? {} : { defaults: ids(suite.defaults) };
const runs = selected.map(ids);
writeFileSync(
  file,
  `${JSON.stringify({ ...suite, ...defaults, name: reproducerSuiteName(suiteName), runs }, null, 2)}\n`,
);
const asked = (defaults.defaults?.rungs ?? []).join(",");
console.log(`node bin/lvrtc.mjs run ${output} --checks ${asked} --jobs 4`);
