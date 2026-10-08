// Rungs R2 and R3 from end to end, without LensVisualizer: the reference engine against copies of itself that were
// handed another system than the one they answer about. The copies are the test-only engine of
// test/engines/ref/bentEngine.ts, and the rays are the probe lattices of the case.
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { EXIT_FAILURE, EXIT_OK, runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import type { ComparisonSet, PairComparison } from "../../src/contract/comparison.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { CASES_DIRECTORY, readRunCase } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { ResultStore } from "../../src/core/resultStore.ts";
import { createFixtureCaseSource } from "../../src/core/suite.ts";
import { createRefEngine } from "../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { DOUBLE_GAUSS, caseFixture, suiteOf, tempDir, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import { createEngine as createBentEngine } from "../engines/ref/bentEngine.ts";
import type { BentOptions } from "../engines/ref/bentEngine.ts";

const BENT_ENGINE = fileURLToPath(new URL("../engines/ref/bentEngine.ts", import.meta.url));

// ── Through the commands ─────────────────────────────────────────────────────────────────────────────────────────

/** A root with a faithful copy of the reference engine and one that holds a radius one part in 1e9 too long. */
function ladderRoot(t: TestContext): string {
  const rootDir = join(tempDir(t), "root");
  const bent: BentOptions = {
    id: "ref-bent",
    edits: [{ pointer: "/system/surfaces/8/shape/radius", scale: 1 + 1e-9 }],
  };
  const config = {
    engines: {
      "ref-bent": { transport: "in-process", module: BENT_ENGINE, options: bent },
      "ref-twin": { transport: "in-process", module: BENT_ENGINE, options: { id: "ref-twin" } },
    },
  };
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "rays",
    defaults: {
      engines: ["ref", "ref-bent", "ref-twin"],
      referenceEngine: "ref",
      rungs: ["r0", "r2", "r3"],
      fields: { kind: "angles-deg", values: [0, 10] },
      sampling: { bundleGrid: 12 },
    },
    runs: [{ name: "double-gauss", lens: { kind: "fixture", path: "cases/double-gauss.json" } }],
  };
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config));
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
  copyFileSync(caseFixture("double-gauss"), join(rootDir, "cases", "double-gauss.json"));
  return rootDir;
}

async function lvrtc(rootDir: string, ...args: string[]): Promise<{ code: number; out: string; err: string }> {
  const inputs = { rootDir, cwd: rootDir, env: {} };
  const commands = [createRunCommand(inputs), createCompareCommand(inputs), createReportCommand(inputs)];
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  return { code: await runCli(args, io, commands), out: out.join(""), err: err.join("") };
}

test("ref against a faithful copy passes R2 and R3 with no difference at all; a copy that built another surface is blocked", async (t) => {
  const rootDir = ladderRoot(t);
  const ran = await lvrtc(rootDir, "run", "suite.json");
  assert.equal(ran.code, EXIT_OK, ran.err);
  // One request of r0 and two ray sets, each asked by r2 and by r3, of three engines: r3 finds what r2 asked.
  assert.match(ran.out, /^rays: 15 jobs: 15 ok, 0 unsupported, 0 error, 0 pending \(9 computed, 6 cached\)$/m);
  const compared = await lvrtc(rootDir, "compare", "rays");
  assert.equal(compared.code, EXIT_FAILURE, compared.out);
  // Five requests, two pairs against the reference and three pairwise: R0 fails for the two pairs of the bent
  // copy, and both its rungs of traced rays are blocked for them.
  assert.match(
    compared.out,
    /^rays: 25 pairs: 10 PASS, 0 FLOOR, 3 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 12 BLOCKED, 0 ERROR$/m,
  );

  const file: ComparisonFile = JSON.parse(readFileSync(join(rootDir, "runs", "rays", COMPARISONS_FILE), "utf8"));
  const sets = (rung: string, mode: string): ComparisonSet[] =>
    file.comparisons.filter((set) => set.rung === rung && set.mode === mode);
  for (const rung of ["r2", "r3"]) {
    assert.equal(sets(rung, "reference-vs-each").length, 2, "one set for each field");
    for (const set of sets(rung, "reference-vs-each")) {
      const [bent, twin] = set.pairs;
      assert.deepEqual([bent.b, bent.verdict, bent.metrics], ["ref-bent", "BLOCKED", []]);
      assert.equal(bent.reason, "not judged: rung r0 failed for ref and ref-bent on this case");
      // The faithful copy is the same arithmetic on the same rays: every figure is 0, and no ray is in doubt.
      assert.deepEqual([twin.b, twin.verdict], ["ref-twin", "PASS"]);
      for (const metric of twin.metrics) {
        if (metric.name !== "rays.compared") assert.equal(metric.value, 0, `${rung} ${metric.name}`);
      }
    }
  }
  // A probe lattice has no chief ray: the path relative to one is not measured, and the pair says so and passes.
  const [path] = sets("r3", "pairwise").map((set) =>
    set.pairs.find((pair) => pair.a === "ref" && pair.b === "ref-twin"),
  );
  assert.equal(path?.reason, "opd.maxAbs was not measured: the set has no chief ray");
  assert.deepEqual(
    path?.metrics.map((metric) => metric.name),
    ["opticalPath.maxAbs", "opticalPathToImage.maxAbs"],
  );
  // Rays were compared: a twelve-by-twelve lattice over the front element, of which the stop passes the middle.
  const [geometry] = sets("r2", "pairwise").map((set) => set.pairs.find((pair) => pair.b === "ref-twin"));
  const count = geometry?.metrics.find((metric) => metric.name === "rays.compared")?.value ?? 0;
  assert.ok(count >= 8 && count < 144, String(count));
  // The field of the set is in every place a metric occurs at.
  assert.deepEqual(geometry?.metrics[0].where, { line: 0, field: 0, ray: geometry?.metrics[0].where?.ray, surface: 0 });

  const reported = await lvrtc(rootDir, "report", "rays");
  assert.equal(reported.code, EXIT_OK, reported.err);
  const markdown = readFileSync(join(rootDir, "runs", "rays", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(markdown, /^#### r2, request 1 of 2$/m);
  assert.match(markdown, /^Quantity `rays\.trace`, compared identical-rays, gated\. /m);
  assert.match(markdown, /^\| ref-bent \| — \| — \| — \| — \| — \| — \| BLOCKED \| not judged: rung r0 failed /m);
  assert.match(markdown, /^\| rays\.blocked\[0\] \| \d+ \| \d+ \| \d+ \|$/m);
  // The policy has no floor for these engines: a digest of the floor has no pair to show, and says nothing wrong.
  const digest = await lvrtc(rootDir, "report", "rays", "--floor", "digest");
  assert.equal(digest.code, EXIT_OK, digest.err);
  assert.match(readFileSync(join(rootDir, "digest", "lv-floor.md"), "utf8"), /^## By run$/m);
});

test("compare reads each case from the run directory, and a case that is not there is said, not guessed", async (t) => {
  const rootDir = ladderRoot(t);
  assert.equal((await lvrtc(rootDir, "run", "suite.json", "--engines", "ref,ref-twin")).code, EXIT_OK);
  const directory = join(rootDir, "runs", "rays");
  // The case of the run, as the run wrote it.
  assert.deepEqual(readRunCase(directory, DOUBLE_GAUSS.id), DOUBLE_GAUSS);
  assert.equal(readRunCase(directory, "0".repeat(64)), undefined);
  assert.equal(readRunCase(directory, "../manifest"), undefined);
  assert.equal(readRunCase(join(rootDir, "nowhere"), DOUBLE_GAUSS.id), undefined);
  assert.equal((await lvrtc(rootDir, "compare", "rays")).code, EXIT_OK);

  // A case file that is another case than its name says, and one that is no case at all.
  const file = join(directory, CASES_DIRECTORY, `${DOUBLE_GAUSS.id}.json`);
  const original = readFileSync(file, "utf8");
  copyFileSync(caseFixture("singlet"), file);
  assert.equal(readRunCase(directory, DOUBLE_GAUSS.id), undefined);
  writeFileSync(file, "{ not json");
  assert.equal(readRunCase(directory, DOUBLE_GAUSS.id), undefined);
  // Without its case a rung of traced rays cannot be judged: every pair of it is an error that says why.
  const compared = await lvrtc(rootDir, "compare", "rays");
  assert.equal(compared.code, EXIT_FAILURE);
  assert.match(compared.out, /^double-gauss +r0 +pairwise +ref +ref-twin +PASS$/m);
  assert.match(
    compared.out,
    /^double-gauss +r2 +pairwise +ref +ref-twin +ERROR +the case is not at hand: its clip radii say which rays lie in the rim band$/m,
  );
  assert.match(
    compared.out,
    /^double-gauss +r3 +pairwise +ref +ref-twin +ERROR +the request and its case are not at hand: /m,
  );
  writeFileSync(file, original);
  assert.equal((await lvrtc(rootDir, "compare", "rays")).code, EXIT_OK);
});

// ── What each rung catches ───────────────────────────────────────────────────────────────────────────────────────

const REF: EngineMaker = (id) =>
  new RemoteEngineAdapter({ id, transport: createInProcessTransport(createRefEngine()) });

function bentEngine(bend: Omit<BentOptions, "id">): EngineMaker {
  const options = { id: "ref-bent", ...bend };
  return (id) => new RemoteEngineAdapter({ id, transport: createInProcessTransport(createBentEngine(options)) });
}

/** The comparator's own policy with an R0 that blocks nothing, so that the rungs behind it speak for themselves. */
function unblocking(): Policy {
  const own = loadPolicy();
  const { blocksLaterRungs: _blocks, ...r0 } = own.rungs.r0;
  return { ...own, rungs: { ...own.rungs, r0 } };
}

/** The R2 and R3 pairs of `ref` against a bent copy, for each of two fields of the Double-Gauss, R0 not blocking. */
async function against(
  t: TestContext,
  bend: Omit<BentOptions, "id">,
  opticalCase: OpticalCase = DOUBLE_GAUSS,
): Promise<{ r2: PairComparison[]; r3: PairComparison[]; manifest: RunManifest; store: ResultStore }> {
  const runsDir = tempDir(t);
  const { registry } = watchedRegistry({ ref: REF, "ref-bent": bentEngine(bend) });
  const run = {
    name: "one",
    opticalCase,
    rungs: ["r0", "r2", "r3"],
    fields: { kind: "angles-deg", values: [0, 10] } as const,
    sampling: { bundleGrid: 16 },
  };
  const suite = suiteOf("bends", [run]);
  // The suite is in memory: its rays come from the probe generator of the fixture source, by the case alone.
  const sources = { fixture: createFixtureCaseSource(runsDir) };
  const { manifest } = await runSuite({ suite, registry, runsDir, sources });
  assert.ok(
    manifest.jobs.every((job) => job.status === "ok"),
    JSON.stringify(manifest.jobs),
  );
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const file = compareManifest({
    manifest,
    store,
    policy: unblocking(),
    reference: "ref",
    modes: ["reference-vs-each"],
    cases: () => opticalCase,
  });
  const pairsOf = (rung: string): PairComparison[] =>
    file.comparisons.filter((set) => set.rung === rung).map((set) => set.pairs[0]);
  return { r2: pairsOf("r2"), r3: pairsOf("r3"), manifest, store };
}

function metricOf(pair: PairComparison, name: string): number {
  const metric = pair.metrics.find((each) => each.name === name);
  assert.ok(metric !== undefined && metric.value !== null, name);
  return metric.value;
}

test("a radius one part in 1e6 too long moves the hits behind it: R2 fails, and names the ray and the surface", async (t) => {
  const { r2, r3 } = await against(t, { edits: [{ pointer: "/system/surfaces/8/shape/radius", scale: 1 + 1e-6 }] });
  assert.equal(r2.length, 2);
  for (const pair of r2) {
    assert.equal(pair.verdict, "FAIL");
    const worst = pair.metrics.find((metric) => metric.name === "hits.maxDistance");
    // The surfaces before the bent one are the same surfaces: the largest difference is on it or behind it.
    assert.ok(Number(worst?.where?.surface) >= 8, JSON.stringify(worst));
    assert.ok(metricOf(pair, "hits.maxDistance") > 1e-8 && metricOf(pair, "hits.maxDistance") < 1e-4);
    assert.equal(metricOf(pair, "mask.mismatches"), 0);
    assert.match(
      pair.reason ?? "",
      /hits\.maxDistance \d\.\d\de-\d+ exceeds its tolerance 1\.00e-8 at field \d+, line 0, ray \d+, surface \d+/,
    );
    // No engine here has a floor: a failure is a failure.
    assert.ok(!(pair.reason ?? "").includes("floor"));
  }
  for (const pair of r3) {
    assert.equal(pair.verdict, "FAIL");
    assert.ok(metricOf(pair, "opticalPath.maxAbs") > 2e-5);
  }
});

test("an index three parts in 1e9 off bends every ray behind it and lengthens its path: both rungs say so", async (t) => {
  const { r2, r3 } = await against(t, { index: { line: 0, surface: 0, scale: 1 + 3e-9 } });
  for (const pair of r2) {
    assert.equal(pair.verdict, "FAIL");
    const worst = pair.metrics.find((metric) => metric.name === "hits.maxDistance");
    // The first surface is met before any index matters: the rays part behind it, and further apart with every gap.
    assert.ok(Number(worst?.where?.surface) >= 1, JSON.stringify(worst));
    assert.ok(metricOf(pair, "hits.maxDistance") > 1e-8 && metricOf(pair, "hits.maxDistance") < 1e-5);
  }
  for (const pair of r3) {
    assert.equal(pair.verdict, "FAIL", JSON.stringify(pair.metrics));
    // Some 9 mm of that glass: 3e-8 mm of path, 5e-5 waves at the d line.
    assert.ok(metricOf(pair, "opticalPath.maxAbs") > 2e-5 && metricOf(pair, "opticalPath.maxAbs") < 1e-3);
    assert.match(
      pair.reason ?? "",
      /opticalPath\.maxAbs \d\.\d\de-\d exceeds its tolerance 2\.00e-5 at field \d+, line 0, ray \d+/,
    );
  }
});

test("a clip radius a hair too small is the rim band; one a tenth too small is a mismatch of every ray between", async (t) => {
  // The stop of the Double-Gauss, surface 5. A probe lattice has no ray within 2e-9 mm of its rim.
  const pointer = "/system/surfaces/5/aperture/semiDiameter";
  const hair = await against(t, { edits: [{ pointer, scale: 1 - 1e-10 }] });
  for (const pair of hair.r2) {
    assert.equal(pair.verdict, "PASS");
    assert.equal(metricOf(pair, "mask.mismatches"), 0);
  }
  const tenth = await against(t, { edits: [{ pointer, scale: 0.9 }] });
  const mismatches = tenth.r2.map((pair) => metricOf(pair, "mask.mismatches"));
  assert.ok(
    mismatches.every((count) => count > 0),
    String(mismatches),
  );
  for (const pair of tenth.r2) {
    assert.equal(pair.verdict, "FAIL");
    const first = pair.metrics.find((metric) => metric.name === "mask.mismatches");
    assert.equal(first?.where?.surface, 5);
    assert.equal(metricOf(pair, "mask.rimBand"), 0);
    // The rays both engines passed went the same way: the hits do not differ, only how many there are.
    assert.equal(metricOf(pair, "hits.maxDistance"), 0);
    assert.match(
      pair.reason ?? "",
      /^mask\.mismatches \d+ exceeds its tolerance 0 at field \d+, line 0, ray \d+, surface 5$/,
    );
  }
  // R3 reads the rays that are ok in both, and those agree: the mask is R2's matter alone.
  for (const pair of tenth.r3) assert.equal(pair.verdict, "PASS");
});

test("the two rungs of traced rays read one answer: the store is asked once for each engine and set", async (t) => {
  const { manifest, store } = await against(t, {});
  const asked: string[] = [];
  const counting: ResultStore = { ...store, get: (key) => (asked.push(key), store.get(key)) };
  const file = compareManifest({ manifest, store: counting, policy: loadPolicy(), cases: () => DOUBLE_GAUSS });
  assert.ok(file.comparisons.every((set) => set.pairs.every((pair) => pair.verdict === "PASS")));
  // r0 once for each engine; two sets for each engine, which r2 and r3 share: six reads, not ten.
  const rays = manifest.jobs.filter((job) => job.quantity === "rays.trace");
  assert.equal(rays.length, 8);
  assert.equal(new Set(rays.map((job) => job.storeKey)).size, 4);
  assert.equal(asked.length, 6);
  assert.equal(new Set(asked).size, 6);
});
