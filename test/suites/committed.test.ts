// The committed suites, checked without LensVisualizer: each is a valid suite of LensVisualizer lenses, names no
// rung and the built-in engines, and holds nothing of a prescription. That every run exports is checked against
// the real LensVisualizer by test/integration/lv/suites.test.ts.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { createRunCommand } from "../../src/cli/commands/run.ts";
import { EXIT_FAILURE, runCli } from "../../src/cli/main.ts";
import { expandSuite, runInvariantProblems } from "../../src/contract/runSpec.ts";
import type { RunSpec, Suite } from "../../src/contract/runSpec.ts";
import { formatIssues, validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { loadSuite } from "../../src/core/suite.ts";
import { BUILTIN_ENGINES } from "../../src/engines/builtin.ts";
import { BENCHMARK_KEYS, SUITES_DIR, SUITE_NAMES, suitePath } from "./support.ts";

function readSuite(name: (typeof SUITE_NAMES)[number]): Suite {
  return JSON.parse(readFileSync(suitePath(name), "utf8"));
}

/** A run as "key@zoom lines": what it asks of which lens. */
function configuration(run: RunSpec): string {
  assert.equal(run.lens.kind, "lv");
  return `${run.lens.kind === "lv" ? run.lens.key : ""}@${run.state?.zoomT ?? 0} ${run.lines?.kind}`;
}

test("the suites directory holds the three suites and nothing else", () => {
  assert.deepEqual(
    readdirSync(SUITES_DIR).sort(),
    SUITE_NAMES.map((name) => `${name}.json`),
  );
});

for (const name of SUITE_NAMES) {
  test(`suites/${name}.json is a valid suite of LensVisualizer lenses that names no rung, and the built-in engines`, () => {
    const suite = readSuite(name);
    assert.equal(formatIssues(validateKind("suite", suite)), "");
    assert.equal(suite.name, name);
    assert.equal(suite.contract, CONTRACT_VERSION);
    // A run uses every judged rung, and the built-in engines unless it is run on others: so the suite runs at the
    // root of this repository, whose configuration defines no engine.
    // optiland is built in too, and joins a suite's own engines with the rungs it answers.
    assert.deepEqual(Object.keys(BUILTIN_ENGINES).sort(), ["lv", "optiland", "ref"]);
    const builtin = ["lv", "ref"];
    assert.deepEqual(suite.defaults, {
      aperture: { kind: "wide-open" },
      imagePlane: { kind: "design" },
      engines: builtin,
    });
    const runs = expandSuite(suite);
    assert.ok(runs.length > 0);
    for (const run of runs) {
      assert.deepEqual(runInvariantProblems(run), [], run.name);
      assert.equal(formatIssues(validateKind("run-spec", run)), "", run.name);
      // Nothing but which lens, in which state, on which lines: no number of a prescription has a place to be.
      const { contract: _contract, kind: _kind, name: _name, lens, state, lines, aperture, imagePlane, ...other } = run;
      assert.deepEqual(other, { engines: builtin }, run.name);
      assert.ok(lens.kind === "lv" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(lens.key), run.name);
      assert.deepEqual(
        Object.keys(state ?? {}).filter((member) => member !== "zoomT"),
        [],
        run.name,
      );
      assert.ok(lines?.kind === "reference" || lines?.kind === "photopic", run.name);
      assert.deepEqual([aperture, imagePlane], [{ kind: "wide-open" }, { kind: "design" }], run.name);
    }
  });
}

test("the smoke suite is two small primes and one small zoom, which states no zoom position", () => {
  const runs = expandSuite(readSuite("smoke"));
  assert.equal(new Set(runs.map((run) => (run.lens.kind === "lv" ? run.lens.key : ""))).size, 3);
  assert.ok(runs.length <= 4);
  // No run states a position: the zoom is run at both ends, by the rule of the LensVisualizer case source, so the
  // smallest suite exercises it. Which lens is the zoom is LensVisualizer's to say (test/integration/lv).
  for (const run of runs) assert.equal(run.state, undefined, run.name);
  assert.equal(runs.at(-1)?.name, "minolta-af-35-70-f4-ref");
});

test("the benchmark suite is the 12 configurations, each on the reference line and on the photopic lines", () => {
  const runs = expandSuite(readSuite("benchmark"));
  // Every run of a zoom states its position, so the suite is these 24 runs whatever the rule of the zoom does:
  // its hash, which reports/benchmark/lv-floor.json names, is that of the file as written.
  const digest = JSON.parse(readFileSync(join(REPO_ROOT, "reports", "benchmark", "lv-floor.json"), "utf8"));
  assert.equal(hashCanonical({ name: "benchmark", runs }), digest.suite.hash);
  for (const run of runs.filter((each) => each.lens.kind === "lv" && each.lens.key === "nikon-z-24-70f4s")) {
    assert.ok(run.state?.zoomT === 0 || run.state?.zoomT === 1, run.name);
  }
  const expected = BENCHMARK_KEYS.flatMap((key) =>
    (key === "nikon-z-24-70f4s" ? [0, 1] : [0]).flatMap((zoomT) =>
      ["reference", "photopic"].map((lines) => `${key}@${zoomT} ${lines}`),
    ),
  );
  assert.equal(expected.length, 24);
  assert.deepEqual(runs.map(configuration), expected);
});

test("the feature suite has one lens for each translation path, on the reference line first", () => {
  const runs = expandSuite(readSuite("features"));
  const paths = new Map<string, Set<string>>();
  for (const run of runs) {
    const [, path, lines] = /^(.+)-(ref|photopic)$/.exec(run.name) ?? [];
    assert.ok(path !== undefined, run.name);
    assert.equal(run.lines?.kind, lines === "ref" ? "reference" : "photopic", run.name);
    paths.set(path, (paths.get(path) ?? new Set()).add(run.lens.kind === "lv" ? run.lens.key : ""));
  }
  assert.deepEqual(
    [...paths.keys()],
    [
      "odd-asphere",
      "e-line",
      "asphere-a20",
      "flat-base-asphere",
      "rear-plate-rim",
      "fixed-iris-zoom",
      "zero-asphere",
      "stop-inside-element",
    ],
  );
  // Two paths have no lens LensVisualizer can supply a case for, and so no run: a lens that mixes d- and
  // e-referenced glasses, and one with an annular aperture. docs/gotchas.md says why, and an integration test fails
  // on the day one of the two can be exported.
  assert.equal(runs.length, 16);
  for (const [path, keys] of paths) assert.equal(keys.size, 1, path);
  // No lens serves two paths, and none is a lens of the benchmark, which has those paths covered.
  const keys = [...paths.values()].map((set) => [...set][0]);
  assert.equal(new Set(keys).size, keys.length);
  for (const key of keys) assert.ok(!BENCHMARK_KEYS.includes(key), key);
  // No run of the suite states a zoom position: its one zoom, the fixed-iris one, is run at both ends.
  for (const run of runs) assert.equal(run.state, undefined, run.name);
});

test("a committed suite runs at the root of the repository without naming an engine: it names the built-in ones", async (t) => {
  // Without a LensVisualizer no run can be started, which is a failure of the runs and no usage error: before the
  // suites named their engines, the same command was refused for naming none.
  const runsDir = mkdtempSync(join(tmpdir(), "lvrtc-suites-"));
  t.after(() => rmSync(runsDir, { recursive: true, force: true }));
  const out: string[] = [];
  const err: string[] = [];
  const command = createRunCommand({
    rootDir: REPO_ROOT,
    env: { LVRTC_LV_PATH: join(runsDir, "no-lv-here"), LVRTC_RUNS_DIR: runsDir },
    cwd: REPO_ROOT,
  });
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  const code = await runCli(["run", "suites/smoke.json"], io, [command]);
  assert.equal(code, EXIT_FAILURE, err.join(""));
  assert.match(out.join(""), /^smoke: 0 jobs: 0 ok, 0 unsupported, 0 error, 0 pending/m);
  const lines = err.join("").trimEnd().split("\n");
  // One line per run as written: without LensVisualizer nothing says which lens is a zoom.
  assert.equal(lines.length, 4);
  for (const line of lines) {
    assert.match(line, /^lvrtc run: run [a-z0-9-]+ was not started: lv-path-missing: LensVisualizer cannot be loaded/);
  }
  const manifest = JSON.parse(readFileSync(join(runsDir, "smoke", "manifest.json"), "utf8"));
  assert.deepEqual(manifest.jobs, []);
});

test("without a LensVisualizer source every run of a committed suite says so, and the suite still loads", async () => {
  for (const name of SUITE_NAMES) {
    const suite = await loadSuite(suitePath(name), { rootDir: REPO_ROOT });
    assert.equal(suite.name, name);
    for (const run of suite.runs) {
      assert.equal(run.opticalCase, null);
      assert.deepEqual(run.problems, ["no case source builds cases from LensVisualizer lenses"]);
    }
  }
});
