// Rungs R6a and R6b from end to end, without LensVisualizer.
//
// R6a: the reference engine against a faithful copy of itself and against a copy that was handed another radius,
// on the probe rays of a lens at two lattices (the test-only engine of test/engines/ref/bentEngine.ts). What is
// held here is the plumbing: a field's sets on both lattices are compared as one, the finer lattice is asked of
// this rung alone, and a lattice that is no arbiter is not judged. The closed forms of the wave MTF are
// test/compare/raysWaveMtf.test.ts.
//
// R6b: `lvrtc run`, `compare` and `report` on a copy of the fake LV tree, each in a child process: the fake's own
// diffraction MTF, which is a closed form and no estimate of anything, beside the comparator's wave estimator on
// the rays the fake launches and traces. The fake's numbers describe no real lens.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { EXIT_FAILURE, EXIT_OK, runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import type { ComparisonSet, PairComparison } from "../../src/contract/comparison.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { adapterRevision } from "../../src/engines/adapterRevision.ts";
import { LV_WAVE_ENGINE_MODULE } from "../../src/engines/lv/waveEngine.ts";
import { REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { LENS } from "../compare/raysSupport.ts";
import { tempDir } from "../core/support.ts";
import type { BentOptions } from "../engines/ref/bentEngine.ts";
import { FAKE_LV } from "../engines/lv/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const BENT_ENGINE = fileURLToPath(new URL("../engines/ref/bentEngine.ts", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));

/** The cells across the coarser lattice of the R6a suite; the finer has twice as many. */
const GRID = 16;

/**
 * A root with a faithful copy of the reference engine, a copy that holds the first radius one part in a hundred
 * thousand too long, and an engine that traces no rays; and a suite of the support's lens on the axis.
 */
function waveRoot(t: TestContext): string {
  const rootDir = join(tempDir(t), "root");
  const bent: BentOptions = {
    id: "ref-bent",
    edits: [{ pointer: "/system/surfaces/0/shape/radius", scale: 1 + 1e-5 }],
  };
  const config = {
    engines: {
      "ref-bent": { transport: "in-process", module: BENT_ENGINE, options: bent },
      "ref-twin": { transport: "in-process", module: BENT_ENGINE, options: { id: "ref-twin" } },
      "fake-a": { transport: "in-process", module: FAKE_ENGINE, options: { id: "fake-a" } },
    },
  };
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "wave",
    defaults: {
      engines: ["ref", "ref-bent", "ref-twin", "fake-a"],
      referenceEngine: "ref",
      rungs: ["r6a"],
      fields: { kind: "angles-deg", values: [0] },
      sampling: { bundleGrid: GRID },
    },
    runs: [{ name: "design", lens: { kind: "fixture", path: "cases/lens.json" } }],
  };
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config));
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
  writeFileSync(join(rootDir, "cases", "lens.json"), JSON.stringify(LENS));
  return rootDir;
}

async function inProcess(rootDir: string, ...args: string[]): Promise<{ code: number; out: string; err: string }> {
  const inputs = { rootDir, cwd: rootDir, env: {} };
  const commands = [createRunCommand(inputs), createCompareCommand(inputs), createReportCommand(inputs)];
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  return { code: await runCli(args, io, commands), out: out.join(""), err: err.join("") };
}

function read<T>(rootDir: string, suite: string, file: string): T {
  return JSON.parse(readFileSync(join(rootDir, "runs", suite, file), "utf8")) as T;
}

function metricsOf(pair: PairComparison): Record<string, number | null> {
  return Object.fromEntries(pair.metrics.map((metric) => [metric.name, metric.value]));
}

test("R6a compares a field on both lattices at every line as one set: a faithful copy differs by nothing", async (t) => {
  const rootDir = waveRoot(t);
  const ran = await inProcess(rootDir, "run", "suite.json");
  assert.equal(ran.code, EXIT_OK, ran.err);
  // One field at two lines on two lattices: four ray sets, asked of four engines, of which one traces no rays.
  assert.match(ran.out, /^wave: 16 jobs: 12 ok, 4 unsupported, 0 error, 0 pending \(12 computed, 0 cached\)$/m);
  const manifest = read<RunManifest>(rootDir, "wave", MANIFEST_FILE);
  const [run] = manifest.runs;
  // The sets of the finer lattice are recorded apart from the run's own, and are other sets.
  assert.equal(run.raySets?.sets.length, 2);
  assert.equal(run.fineRaySets?.sets.length, 2);
  assert.ok(run.fineRaySets?.sets.every((set) => !run.raySets?.sets.includes(set)));
  assert.deepEqual(run.fineRaySets?.problems, []);

  const compared = await inProcess(rootDir, "compare", "wave");
  const file = read<ComparisonFile>(rootDir, "wave", COMPARISONS_FILE);
  assert.ok(file.comparisons.every((set) => set.rung === "r6a" && set.quantity === "rays.trace"));
  // The four requests of the field are one set in each mode, under the id of the first of them.
  const sets = (mode: string): ComparisonSet[] => file.comparisons.filter((set) => set.mode === mode);
  assert.equal(sets("pairwise").length, 1);
  assert.equal(sets("reference-vs-each").length, 1);
  const [pairwise] = sets("pairwise");
  assert.equal(
    pairwise.requestId,
    manifest.jobs.find((job) => job.engine === "ref")?.requestId,
    "the set stands under its first request",
  );
  const pair = (a: string, b: string): PairComparison => {
    const found = pairwise.pairs.find((each) => each.a === a && each.b === b);
    assert.ok(found !== undefined, `${a} ${b}`);
    return found;
  };

  // The faithful copy: the same paths, and nothing between the two estimates, whatever the lattice is worth.
  const twin = pair("ref", "ref-twin");
  const ofTwin = metricsOf(twin);
  assert.equal(twin.verdict, "PASS");
  assert.equal(ofTwin["waveMtf.maxAbs"] ?? ofTwin["waveMtf.flagged"], 0);
  assert.equal(ofTwin["lattice.columns"], 2 * GRID);
  assert.equal(ofTwin["lines.compared"], 2);
  assert.equal(ofTwin["rays.dropped"], 0);
  assert.ok((ofTwin["rays.compared"] as number) > 0);
  assert.ok((ofTwin["phaseStep.waves"] as number) >= 0);
  assert.ok((ofTwin["convergence.maxAbs"] as number) >= 0);

  // The other radius: another wavefront, and a figure that is not nothing. It is judged where the lattice is an
  // arbiter and written down where it is not; either way the two estimates are of the same rays.
  const bent = pair("ref", "ref-bent");
  const ofBent = metricsOf(bent);
  const figure = (ofBent["waveMtf.maxAbs"] ?? ofBent["waveMtf.flagged"]) as number;
  assert.ok(figure > 1e-9, String(figure));
  if (ofBent["waveMtf.maxAbs"] === undefined) {
    assert.equal(bent.verdict, "PASS");
    assert.match(bent.reason ?? "", /^waveMtf\.maxAbs was not measured: the lattice is no arbiter \(/);
  } else {
    assert.equal(bent.verdict, figure > 4e-5 ? "FAIL" : "PASS");
  }
  assert.equal(compared.code, bent.verdict === "FAIL" ? EXIT_FAILURE : EXIT_OK, compared.out);
  // The engine that traces no rays is unsupported, as in every rung of traced rays.
  assert.equal(pair("fake-a", "ref").verdict, "UNSUPPORTED");

  const reported = await inProcess(rootDir, "report", "wave");
  assert.equal(reported.code, EXIT_OK, reported.err);
  const markdown = readFileSync(join(rootDir, "runs", "wave", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(markdown, /^#### r6a, request 1 of 4\n\nQuantity `rays\.trace`, compared identical-rays, gated\./m);
  // The figure that is judged, then the one that is only written down, then what the lattice says of itself.
  assert.match(
    markdown,
    /^\| Engine \| waveMtf\.maxAbs \(≤ 4\.00e-5\) \| waveMtf\.flagged \| phaseStep\.waves \[waves\] \| convergence\.maxAbs \| /m,
  );
  assert.doesNotMatch(markdown, /^#### r6a, request 2 of 4$/m);
});

test("the finer lattice is asked of R6a alone: R2 to R4 trace the run's own sets, and R6a finds them in the store", async (t) => {
  const rootDir = waveRoot(t);
  const first = await inProcess(rootDir, "run", "suite.json", "--rungs", "r2,r3,r4", "--engines", "ref,ref-twin");
  assert.equal(first.code, EXIT_OK, first.err);
  const before = read<RunManifest>(rootDir, "wave", MANIFEST_FILE);
  assert.equal(Object.hasOwn(before.runs[0], "fineRaySets"), false);
  const coarse = [...new Set(before.jobs.map((job) => job.requestId))];
  assert.equal(coarse.length, 2);

  const all = await inProcess(rootDir, "run", "suite.json", "--rungs", "r2,r3,r4,r6a", "--engines", "ref,ref-twin");
  assert.equal(all.code, EXIT_OK, all.err);
  const after = read<RunManifest>(rootDir, "wave", MANIFEST_FILE);
  const of = (rung: string): string[] => [
    ...new Set(after.jobs.filter((job) => job.rung === rung).map((job) => job.requestId)),
  ];
  for (const rung of ["r2", "r3", "r4"]) assert.deepEqual(of(rung), coarse, rung);
  // The run's own sets first, then those of the finer lattice.
  assert.deepEqual(of("r6a").slice(0, 2), coarse);
  assert.equal(of("r6a").length, 4);
  // Two sets, two engines: the four traces of the finer lattice are all that was computed.
  assert.match(all.out, /\(4 computed, 16 cached\)$/m);
});

/** A root whose `lvPath` is a copy of the fake LV tree. */
function fakeLvRoot(t: TestContext): string {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(rootDir, { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv" }));
  cpSync(FAKE_LV, join(rootDir, "lv"), { recursive: true });
  return rootDir;
}

function lvrtc(rootDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: join(rootDir, "runs"), LVRTC_LV_PATH: "" };
  const child = spawnSync(process.execPath, [BIN, ...args, "--root", rootDir], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env,
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

test("lvrtc run --rungs r6b: LensVisualizer's diffraction MTF beside the wave estimator on its rays, recorded", (t) => {
  const rootDir = fakeLvRoot(t);
  const singlet = { kind: "lv", key: "acme-singlet-50" };
  const suite = join(rootDir, "suite.json");
  const runs = [
    { name: "open", lens: singlet },
    { name: "f8", lens: singlet, aperture: { kind: "lv-f8-comparison" }, frequenciesPerMm: [40, 10, 20] },
  ];
  // The suite names an engine that is none of the rung's: the rung is asked of its own two all the same.
  const defaults = { engines: ["ref"], rungs: ["r6b"], sampling: { bundleGrid: 8 } };
  writeFileSync(suite, JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name: "wave", defaults, runs }));

  const ran = lvrtc(rootDir, "run", suite);
  assert.equal(ran.code, EXIT_OK, ran.err);
  assert.match(ran.out, /^wave: 4 jobs: 4 ok, 0 unsupported, 0 error, 0 pending \(4 computed, 0 cached\)$/m);
  const manifest = read<RunManifest>(rootDir, "wave", MANIFEST_FILE);
  assert.deepEqual(
    manifest.jobs.map((job) => `${job.run} ${job.rung} ${job.quantity} ${job.engine} ${job.status}`),
    runs.flatMap(({ name }) => ["lv", "wave"].map((engine) => `${name} r6b mtf.native ${engine} ok`)),
  );
  // The two engines are one LensVisualizer, with an adapter revision each; the rung traces no rays of the run's.
  const [lv, wave] = manifest.engines;
  assert.deepEqual([lv.id, wave.id, manifest.engines.length], ["lv", "wave", 2]);
  assert.ok(lv.status === "available" && wave.status === "available");
  assert.equal(wave.fingerprint, lv.fingerprint);
  assert.equal(wave.adapterRevision, adapterRevision(LV_WAVE_ENGINE_MODULE).revision);
  assert.notEqual(wave.adapterRevision, lv.adapterRevision);
  assert.equal(Object.hasOwn(manifest.runs[0], "raySets"), false);

  const compared = lvrtc(rootDir, "compare", "wave");
  // A recorded rung fails nothing, whatever its figures are.
  assert.equal(compared.code, EXIT_OK, compared.out);
  assert.match(
    compared.out,
    /^wave: 4 pairs: 0 PASS, 0 FLOOR, 0 FAIL, \d RECORDED, \d ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
  );
  const file = read<ComparisonFile>(rootDir, "wave", COMPARISONS_FILE);
  const pairwise = file.comparisons.filter((set) => set.mode === "pairwise");
  assert.deepEqual(
    pairwise.map((set) => [set.run, set.rung, set.pairs.map((pair) => `${pair.a} ${pair.b} ${pair.class}`)]),
    [
      ["open", "r6b", ["lv wave recorded"]],
      ["f8", "r6b", ["lv wave recorded"]],
    ],
  );
  for (const set of pairwise) {
    const [pair] = set.pairs;
    assert.ok(["RECORDED", "ATTENTION"].includes(pair.verdict), pair.verdict);
    const metrics = metricsOf(pair);
    // Three fields, each of one class or another, and every one accounted for.
    const counted = ["fields.compared", "fields.flagged", "fields.unavailable"].map((name) => metrics[name] as number);
    assert.equal(
      counted.reduce((sum, count) => sum + count, 0),
      3,
      set.run,
    );
    // What each answer states of its sampling is recorded, a value a field: the estimator's two lattices are
    // the run's grid and twice it, and the fake's product states no step of a path.
    const [ofLv, ofWave] = set.participants.map((participant) => participant.recorded);
    assert.deepEqual(ofWave?.gridSize, [16, 16, 16], set.run);
    assert.equal(ofWave?.settled.length, 3);
    assert.equal(ofWave?.phaseStepWaves.length, 3);
    assert.deepEqual(ofLv?.phaseStepWaves, [null, null, null]);
    assert.deepEqual(ofLv?.settled, [1, 1, 1]);
  }

  const reported = lvrtc(rootDir, "report", "wave");
  assert.equal(reported.code, EXIT_OK, reported.err);
  const markdown = readFileSync(join(rootDir, "runs", "wave", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(markdown, /^#### r6b\n\nQuantity `mtf\.native`, compared independent-method, recorded\./m);
  assert.match(
    markdown,
    /^\| Engine \| mtfOffAxis\.maxAbs \(band 1\.00e-2\) \| mtfOnAxis\.maxAbs \(band 5\.00e-3\) \| mtfFlagged\.maxAbs \| /m,
  );
  // On the fake's rays no lattice is an arbiter: every field is written down as flagged, and the reason says
  // what the estimator said of each.
  assert.match(
    markdown,
    /mtfOnAxis\.maxAbs was not measured: no field on the axis has curves both answers stand by: field 0: /,
  );
  assert.match(markdown, /hopkins-autocorrelation: unconverged \((undersampled\+)?not-converged\)/);
});
