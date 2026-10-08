// Run as a process of its own by export.test.ts: loads the suite file given as the second argument with the
// LensVisualizer checkout given as the first, and prints, as one line of JSON, the case id of every run that has a
// case and the problems of every run that has none. Two such processes must print the same line.
import { dirname } from "node:path";

import { loadSuite } from "../../../src/core/suite.ts";
import { createLvCaseSource } from "../../../src/engines/lv/caseSource.ts";

const [lvPath, suiteFile] = process.argv.slice(2);
const suite = await loadSuite(suiteFile, { rootDir: dirname(suiteFile), sources: { lv: createLvCaseSource(lvPath) } });
const runs = suite.runs.map((run) => [run.spec.name, run.opticalCase?.id ?? run.problems]);
process.stdout.write(`${JSON.stringify({ suite: suite.hash, runs: Object.fromEntries(runs) })}\n`);
