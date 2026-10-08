// The committed suites, checked without LensVisualizer: each is a valid suite of LensVisualizer lenses, names no
// rung, and holds nothing of a prescription. That every run exports is checked against the real LensVisualizer by
// test/integration/lv/suites.test.ts.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { expandSuite, runInvariantProblems } from "../../src/contract/runSpec.ts";
import type { RunSpec, Suite } from "../../src/contract/runSpec.ts";
import { formatIssues, validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { loadSuite } from "../../src/core/suite.ts";
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
  test(`suites/${name}.json is a valid suite of LensVisualizer lenses that names no rung and no engine`, () => {
    const suite = readSuite(name);
    assert.equal(formatIssues(validateKind("suite", suite)), "");
    assert.equal(suite.name, name);
    assert.equal(suite.contract, CONTRACT_VERSION);
    // A run uses every registered rung, and whatever engines it is run on.
    assert.deepEqual(suite.defaults, { aperture: { kind: "wide-open" }, imagePlane: { kind: "design" } });
    const runs = expandSuite(suite);
    assert.ok(runs.length > 0);
    for (const run of runs) {
      assert.deepEqual(runInvariantProblems(run), [], run.name);
      assert.equal(formatIssues(validateKind("run-spec", run)), "", run.name);
      // Nothing but which lens, in which state, on which lines: no number of a prescription has a place to be.
      const { contract: _contract, kind: _kind, name: _name, lens, state, lines, aperture, imagePlane, ...other } = run;
      assert.deepEqual(other, {}, run.name);
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

test("the smoke suite is two small lenses", () => {
  const runs = expandSuite(readSuite("smoke"));
  assert.equal(new Set(runs.map((run) => (run.lens.kind === "lv" ? run.lens.key : ""))).size, 2);
  assert.ok(runs.length <= 4);
});

test("the benchmark suite is the 12 configurations, each on the reference line and on the photopic lines", () => {
  const runs = expandSuite(readSuite("benchmark"));
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
      "mixed-d-e",
      "asphere-a20",
      "flat-base-asphere",
      "rear-plate-rim",
      "fixed-iris-zoom-tele",
      "annular-aperture",
      "zero-asphere",
      "stop-inside-element",
    ],
  );
  for (const [path, keys] of paths) assert.equal(keys.size, 1, path);
  // No lens serves two paths, and none is a lens of the benchmark, which has those paths covered.
  const keys = [...paths.values()].map((set) => [...set][0]);
  assert.equal(new Set(keys).size, keys.length);
  for (const key of keys) assert.ok(!BENCHMARK_KEYS.includes(key), key);
  // The fixed-iris zoom is run at its tele end.
  for (const run of runs.filter((candidate) => candidate.name.startsWith("fixed-iris-zoom-tele"))) {
    assert.deepEqual(run.state, { zoomT: 1 });
  }
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
