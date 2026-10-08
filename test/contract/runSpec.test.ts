import assert from "node:assert/strict";
import { test } from "node:test";

import { deepFreeze } from "../../src/contract/json.ts";
import { RUN_OPTION_KEYS, expandSuite, runInvariantProblems } from "../../src/contract/runSpec.ts";
import type { RunOptions, RunSpec, Suite } from "../../src/contract/runSpec.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { RUN_SPEC_LV, RUN_SPEC_MINIMAL, RUN_SPEC_WORKED, SUITE_MINIMAL, SUITE_WORKED } from "./corpus.ts";

const LENS = { kind: "lv", key: "some-lens" } as const;

/** A suite of the given runs, each a name with its own options, over the given defaults. */
function suiteOf(defaults: Suite["defaults"], ...runs: Omit<Suite["runs"][number], "lens">[]): Suite {
  return { contract: "1.0", kind: "suite", name: "test", defaults, runs: runs.map((run) => ({ lens: LENS, ...run })) };
}

test("the options a suite can default are every option of a RunSpec, in one fixed order", () => {
  assert.deepEqual(
    [...RUN_OPTION_KEYS],
    [
      "state",
      "aperture",
      "lines",
      "fields",
      "imagePlane",
      "frequenciesPerMm",
      "sampling",
      "rungs",
      "engines",
      "referenceEngine",
    ],
  );
});

test("the worked suite expands to its three runs, each a complete RunSpec", () => {
  const shared = {
    aperture: { kind: "wide-open" },
    lines: { kind: "reference" },
    rungs: ["r0", "r1", "r2", "r3", "r4"],
  } as const;
  const lvRun = {
    fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
    imagePlane: { kind: "lv-best-axial" },
    engines: ["lv", "ref", "optiland"],
    referenceEngine: "lv",
  } as const;
  assert.deepEqual(expandSuite(SUITE_WORKED), [
    {
      contract: "1.0",
      kind: "run-spec",
      name: "nikon-z-24-70f4s-wide",
      lens: { kind: "lv", key: "nikon-z-24-70f4s" },
      state: { zoomT: 0 },
      ...shared,
      ...lvRun,
      frequenciesPerMm: [10, 30],
      sampling: { lvGridCap: 64, bundleGrid: 33 },
    },
    {
      contract: "1.0",
      kind: "run-spec",
      name: "nikon-z-24-70f4s-tele",
      lens: { kind: "lv", key: "nikon-z-24-70f4s" },
      state: { zoomT: 1 },
      ...shared,
      ...lvRun,
      frequenciesPerMm: [10, 30, 50],
      sampling: { lvGridCap: 128 },
    },
    {
      contract: "1.0",
      kind: "run-spec",
      name: "double-gauss",
      lens: { kind: "fixture", path: "contract/fixtures/v1/valid/optical-case/double-gauss.json" },
      ...shared,
      fields: { kind: "angles-deg", values: [0, 10, 14] },
      imagePlane: { kind: "design" },
      frequenciesPerMm: [10, 30],
      sampling: { lvGridCap: 64, bundleGrid: 33 },
      engines: ["ref", "optiland"],
      referenceEngine: "ref",
    },
  ] satisfies RunSpec[]);
});

test("a run's value replaces the default for that option whole; it is never merged into it", () => {
  const suite = suiteOf(
    { sampling: { lvGridCap: 64, bundleGrid: 33, engines: { optiland: { numRays: 512 } } }, state: { zoomT: 0.5 } },
    { name: "own-sampling", sampling: { bundleGrid: 9 } },
    { name: "own-state", state: { focus: { kind: "infinity" } } },
  );
  const [ownSampling, ownState] = expandSuite(suite);
  assert.deepEqual(ownSampling.sampling, { bundleGrid: 9 });
  assert.deepEqual(ownSampling.state, { zoomT: 0.5 });
  assert.deepEqual(ownState.state, { focus: { kind: "infinity" } });
  assert.deepEqual(ownState.sampling, suite.defaults?.sampling);
});

test("every option falls back to its default on its own", () => {
  const defaults = { ...SUITE_WORKED.defaults, state: { zoomT: 1 } } satisfies Required<RunOptions>;
  const own = {
    state: { zoomT: 0.25 },
    aperture: { kind: "stop-radius", mm: 3 },
    lines: { kind: "photopic" },
    fields: { kind: "angles-deg", values: [5] },
    imagePlane: { kind: "shift", mm: 0.1 },
    frequenciesPerMm: [80],
    sampling: { lvGridCap: 32 },
    rungs: ["R5"],
    engines: ["ref"],
    referenceEngine: "ref",
  } satisfies Required<RunOptions>;
  for (const key of RUN_OPTION_KEYS) {
    const stated: RunOptions = { [key]: own[key] };
    const [run] = expandSuite(suiteOf(defaults, { name: "one", ...stated }));
    for (const other of RUN_OPTION_KEYS) {
      assert.deepEqual(run[other], other === key ? own[other] : defaults[other], `${other} when the run states ${key}`);
    }
  }
});

test("a suite without defaults gives runs with only what they state", () => {
  assert.deepEqual(expandSuite(SUITE_MINIMAL), [RUN_SPEC_MINIMAL]);
  const [run] = expandSuite(suiteOf(undefined, { name: "bare" }));
  assert.deepEqual(Object.keys(run), ["contract", "kind", "name", "lens"]);
});

test("an expanded run's keys come in the RunSpec's order, wherever each value came from", () => {
  const [run] = expandSuite(
    suiteOf(
      { referenceEngine: "ref", engines: ["ref"], state: { zoomT: 0 } },
      { rungs: ["R0"], aperture: { kind: "wide-open" }, name: "ordered" },
    ),
  );
  assert.deepEqual(Object.keys(run), [
    "contract",
    "kind",
    "name",
    "lens",
    "state",
    "aperture",
    "rungs",
    "engines",
    "referenceEngine",
  ]);
});

test("a run keeps the contract it states and takes the suite's otherwise", () => {
  const suite: Suite = {
    ...suiteOf(undefined, { name: "a" }, { name: "b", contract: "1.0", kind: "run-spec" }),
    contract: "1.3",
  };
  assert.deepEqual(
    expandSuite(suite).map((run) => [run.name, run.contract, run.kind]),
    [
      ["a", "1.3", "run-spec"],
      ["b", "1.0", "run-spec"],
    ],
  );
});

test("an option present with the value undefined counts as left out", () => {
  const suite = suiteOf(
    { aperture: { kind: "wide-open" }, rungs: undefined },
    { name: "a", aperture: undefined, engines: undefined },
  );
  const [run] = expandSuite(suite);
  assert.deepEqual(run, { contract: "1.0", kind: "run-spec", name: "a", lens: LENS, aperture: { kind: "wide-open" } });
  assert.deepEqual(validateKind("run-spec", run), []);
});

test("runs come out in suite order", () => {
  const names = ["c", "a", "b", "A"];
  assert.deepEqual(
    expandSuite(suiteOf(undefined, ...names.map((name) => ({ name })))).map((run) => run.name),
    names,
  );
});

test("two runs with one name are refused", () => {
  const suite = suiteOf(undefined, { name: "wide" }, { name: "tele" }, { name: "wide", state: { zoomT: 1 } });
  assert.throws(() => expandSuite(suite), { message: 'suite test: more than one run is named "wide"' });
});

test("expandSuite does not write to the suite", () => {
  const frozen = deepFreeze(structuredClone(SUITE_WORKED));
  assert.deepEqual(expandSuite(frozen), expandSuite(SUITE_WORKED));
});

test("every run of a valid suite is a valid RunSpec", () => {
  for (const suite of [SUITE_WORKED, SUITE_MINIMAL]) {
    assert.deepEqual(validateKind("suite", suite), []);
    for (const run of expandSuite(suite)) assert.deepEqual(validateKind("run-spec", run), [], run.name);
  }
});

// ── Run invariants ───────────────────────────────────────────────────────────────────────────────────────────────

test("explicit lines that give weights give one for each wavelength", () => {
  const explicit = (wavelengthsNm: number[], weights?: number[]): RunOptions => ({
    lines: { kind: "explicit", wavelengthsNm, ...(weights === undefined ? {} : { weights }) },
  });
  assert.deepEqual(runInvariantProblems(explicit([656.3, 587.6, 486.1], [1, 2, 1])), []);
  assert.deepEqual(runInvariantProblems(explicit([656.3, 587.6, 486.1])), []);
  assert.deepEqual(runInvariantProblems(explicit([656.3, 587.6, 486.1], [1, 2])), [
    "lines states 2 weights for 3 wavelengths",
  ]);
  assert.deepEqual(runInvariantProblems(explicit([587.6], [1, 2])), ["lines states 2 weights for 1 wavelengths"]);
  // The schema cannot count one list against another, so both of these are schema-valid.
  const spec = { ...RUN_SPEC_MINIMAL, ...explicit([656.3, 587.6], [1]) };
  assert.deepEqual(validateKind("run-spec", spec), []);
  assert.deepEqual(runInvariantProblems(spec), ["lines states 1 weights for 2 wavelengths"]);
});

test("a run without explicit lines, and every example, keeps the run invariants", () => {
  assert.deepEqual(runInvariantProblems({}), []);
  assert.deepEqual(runInvariantProblems({ lines: { kind: "photopic" } }), []);
  const examples: RunSpec[] = [RUN_SPEC_MINIMAL, RUN_SPEC_WORKED, RUN_SPEC_LV, ...expandSuite(SUITE_WORKED)];
  for (const spec of examples) assert.deepEqual(runInvariantProblems(spec), [], spec.name);
  assert.deepEqual(runInvariantProblems(SUITE_WORKED.defaults), []);
});

test("a run that takes mismatched explicit lines from the suite's defaults breaks the invariant too", () => {
  const defaults: RunOptions = { lines: { kind: "explicit", wavelengthsNm: [587.6, 486.1], weights: [1, 1, 1] } };
  const [inherits, replaces] = expandSuite(suiteOf(defaults, { name: "a" }, { name: "b", lines: { kind: "cdf" } }));
  assert.deepEqual(runInvariantProblems(inherits), ["lines states 3 weights for 2 wavelengths"]);
  assert.deepEqual(runInvariantProblems(replaces), []);
});
