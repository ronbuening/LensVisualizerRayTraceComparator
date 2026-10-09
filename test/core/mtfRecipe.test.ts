// The MTF recipe: what a case read from a file states of one, the rung that is made from one, and how the
// orchestrator and the comparison treat a rung that needs a recipe and is about engines of its own. No optics: the
// engines are fakes, and every number is synthetic.
import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";

import { compareManifest } from "../../src/compare/manifest.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { RunSpec } from "../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import {
  DEFAULT_RECIPE_FREQUENCIES,
  fixtureRecipe,
  recipeFrequencies,
  recipeOfCase,
} from "../../src/core/mtfRecipe.ts";
import type { MtfRecipe } from "../../src/core/mtfRecipe.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import { R4F_ENGINES, geometricMtfSpec, r4fRung, selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { createFixtureCaseSource } from "../../src/core/suite.ts";
import type { CaseSource } from "../../src/core/suite.ts";
import { mtfNativeQuantity } from "../../src/quantities/mtfNative.ts";
import { DOUBLE_GAUSS, SINGLET, fakeEngine, suiteOf, tempDir, watchedRegistry } from "./support.ts";

const RUN: RunSpec = {
  contract: CONTRACT_VERSION,
  kind: "run-spec",
  name: "a-run",
  lens: { kind: "fixture", path: "case.json" },
};

/** A recipe as LensVisualizer would resolve one: three fractions of a 20 mm image height, two frequencies. */
const RECIPE: MtfRecipe = {
  source: "lv",
  plane: { kind: "lv-best-axial", shiftMm: -0.03125, lvBestAxialShiftMm: -0.03125 },
  imageZ: 99.96875,
  stopSemiDiameter: 5,
  lines: [{ wavelengthNm: 587.5618, weight: 1 }],
  frequenciesPerMm: [10, 30],
  referenceHeightMm: 20,
  fields: [
    { fraction: 0, angleDeg: 0, targetImageHeightMm: 0 },
    { fraction: 0.5, angleDeg: 11.25, targetImageHeightMm: 10 },
    { fraction: 1, angleDeg: null, targetImageHeightMm: 20, problem: "outside-modeled-field: beyond the edge" },
  ],
};

// ── A case read from a file ──────────────────────────────────────────────────────────────────────────────────────

test("a case file's recipe is what the run states: fields as angles, its frequencies, the plane the file has", () => {
  const { recipe, problems } = fixtureRecipe(
    { fields: { kind: "angles-deg", values: [0, 7, 14] }, frequenciesPerMm: [40, 10, 20] },
    SINGLET,
  );
  assert.deepEqual(problems, []);
  assert.deepEqual(recipe, {
    source: "run",
    plane: { kind: "design", shiftMm: 0 },
    imageZ: SINGLET.conditions.imageZ,
    stopSemiDiameter: SINGLET.conditions.stopSemiDiameter,
    lines: SINGLET.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
    // Ascending, as a request states them, however the run does.
    frequenciesPerMm: [10, 20, 40],
    referenceHeightMm: null,
    fields: [0, 7, 14].map((angleDeg) => ({ fraction: null, angleDeg, targetImageHeightMm: null })),
  });
  // It is recorded as JSON: nothing of it is a NaN or an undefined member.
  assert.deepEqual(JSON.parse(canonicalJson(recipe)), recipe);

  // Without frequencies of its own a run takes the default ones.
  const plain = fixtureRecipe({ fields: { kind: "angles-deg", values: [0] } }, SINGLET).recipe;
  assert.deepEqual(plain?.frequenciesPerMm, [10, 30, 50]);
  assert.deepEqual(DEFAULT_RECIPE_FREQUENCIES, [10, 30, 50]);
  assert.deepEqual(recipeFrequencies({ frequenciesPerMm: [3, 1, 2] }, [9]), [1, 2, 3]);
  assert.deepEqual(recipeFrequencies({}, [9, 8]), [8, 9]);
  assert.deepEqual(Object.keys(recipeOfCase(SINGLET)), ["imageZ", "stopSemiDiameter", "lines"]);
});

test("a case file whose image plane is not its design plane has a recipe of that plane, as a shift", () => {
  const moved: OpticalCase = {
    ...SINGLET,
    conditions: { ...SINGLET.conditions, imageZ: SINGLET.system.designImageZ - 0.25 },
  };
  const { recipe } = fixtureRecipe({ fields: { kind: "angles-deg", values: [0] } }, moved);
  assert.deepEqual(recipe?.plane, { kind: "shift", shiftMm: -0.25 });
  assert.equal(recipe?.imageZ, SINGLET.system.designImageZ - 0.25);
});

test("a case file without field angles has no recipe, and the problem says how to state one", () => {
  for (const run of [{}, { fields: { kind: "image-height-fractions", values: [0, 1] } }] as const) {
    const { recipe, problems } = fixtureRecipe(run, SINGLET);
    assert.equal(recipe, null);
    assert.deepEqual(problems, [
      "recipe-needs-field-angles: a case read from a file has no image height that a fraction could be of: " +
        'state the fields of the run as angles, { "kind": "angles-deg", "values": [...] }',
    ]);
  }
  // The source of case files gives exactly this.
  const source = createFixtureCaseSource("/nowhere");
  const run: RunSpec = { ...RUN, fields: { kind: "angles-deg", values: [0, 5] } };
  assert.deepEqual(source.recipe?.(run, SINGLET), fixtureRecipe(run, SINGLET));
});

// ── The rung r4f ─────────────────────────────────────────────────────────────────────────────────────────────────

test("r4f asks one geometric mtf.native of the recipe's fractions and frequencies, on the plane of the case", () => {
  assert.deepEqual([r4fRung.id, r4fRung.quantity, r4fRung.needsRecipe], ["r4f", MTF_NATIVE, true]);
  assert.deepEqual(r4fRung.engines, ["lv", "replay"]);
  assert.equal(r4fRung.engines, R4F_ENGINES);
  assert.ok(Object.isFrozen(R4F_ENGINES));
  const requests = r4fRung.buildRequests(SINGLET, RUN, { raySets: [], recipe: RECIPE });
  assert.equal(requests.length, 1);
  const [request] = requests;
  assert.deepEqual([request.caseId, request.quantity], [SINGLET.id, MTF_NATIVE]);
  assert.deepEqual(request.spec, {
    frequenciesPerMm: [10, 30],
    // Every field of the recipe, the one LensVisualizer has no angle for included: its MTF says why it has none.
    fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
    method: "geometric",
    // The plane of the case as it is: for this recipe LensVisualizer's own best axial focus, which the case is at.
    focus: "design",
  });
  assert.deepEqual(mtfNativeQuantity.validateSpec(request.spec), []);
  assert.deepEqual(geometricMtfSpec(RECIPE), request.spec);
  assert.equal(request.engineOptions, undefined);
  // The same recipe, the same request: its id is that of the case and the spec.
  assert.equal(r4fRung.buildRequests(SINGLET, RUN, { raySets: [], recipe: { ...RECIPE } })[0].id, request.id);
  assert.notEqual(r4fRung.buildRequests(DOUBLE_GAUSS, RUN, { raySets: [], recipe: RECIPE })[0].id, request.id);
});

test("r4f asks nothing without a recipe of LensVisualizer's, or for a field that is no fraction", () => {
  assert.deepEqual(r4fRung.buildRequests(SINGLET, RUN), []);
  assert.deepEqual(r4fRung.buildRequests(SINGLET, RUN, { raySets: [], recipe: null }), []);
  // A case file's recipe is the run's own: no LensVisualizer sampled it, so there is nothing to replay.
  const ofRun = fixtureRecipe({ fields: { kind: "angles-deg", values: [0, 7] } }, SINGLET).recipe;
  assert.deepEqual(r4fRung.buildRequests(SINGLET, RUN, { raySets: [], recipe: ofRun }), []);
  const angled: MtfRecipe = { ...RECIPE, fields: [{ fraction: null, angleDeg: 3, targetImageHeightMm: null }] };
  assert.deepEqual(r4fRung.buildRequests(SINGLET, RUN, { raySets: [], recipe: angled }), []);
  assert.equal(geometricMtfSpec(angled), null);
  assert.equal(geometricMtfSpec({ ...RECIPE, fields: [] }), null);
});

test("r4f hands the run's grid cap to its engines as their option lvGridCap, and nothing without one", () => {
  assert.equal(r4fRung.engineOptions?.(RUN), undefined);
  assert.equal(r4fRung.engineOptions?.({ ...RUN, sampling: { bundleGrid: 16 } }), undefined);
  assert.deepEqual(r4fRung.engineOptions?.({ ...RUN, sampling: { lvGridCap: 64 } }), { lvGridCap: 64 });
});

// ── In a run ─────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * A rung of `selftest.echo` that is made from the recipe, is about two engines of its own, and states an option. It
 * asks for the recipe's frequencies to be echoed: a request of its own, and none without a recipe.
 */
const ownRung: RungDefinition = {
  id: "own",
  quantity: SELFTEST_ECHO,
  needsRecipe: true,
  engines: ["fake-b", "fake-a"],
  engineOptions: (runSpec) =>
    runSpec.sampling?.lvGridCap === undefined ? undefined : { cap: runSpec.sampling.lvGridCap },
  buildRequests: (opticalCase, _runSpec, inputs) => {
    const recipe = inputs?.recipe ?? null;
    if (recipe === null) return [];
    const spec = { values: encodeNdArray(Float64Array.from(recipe.frequenciesPerMm)), scale: 1 };
    return [makeRequest({ caseId: opticalCase.id, quantity: SELFTEST_ECHO, spec })];
  },
};

/** A source whose recipe is `RECIPE` for the run "with" and none for any other; `asked` takes every run it is asked. */
function recipeSource(asked: string[] = []): CaseSource {
  return {
    resolve: () => assert.fail("the suite is already loaded"),
    recipe: (run) => {
      asked.push(run.name);
      return run.name === "with" ? { recipe: RECIPE, problems: [] } : { recipe: null, problems: ["no-recipe: none"] };
    },
  };
}

test("a rung that needs a recipe is handed the source's, once a run, and the manifest records it or why there is none", async (t) => {
  const asked: string[] = [];
  const suite = suiteOf("recipes", [
    { name: "with", opticalCase: SINGLET },
    { name: "without", opticalCase: DOUBLE_GAUSS },
  ]);
  const engines = watchedRegistry({ "fake-a": fakeEngine(), "fake-b": fakeEngine(), "fake-c": fakeEngine() });
  const result = await runSuite({
    suite,
    registry: engines.registry,
    runsDir: tempDir(t),
    sources: { fixture: recipeSource(asked) },
    engines: ["fake-c"],
    rungDefinitions: [selftestRung, ownRung],
  });
  assert.deepEqual(asked, ["with", "without"]);
  assert.deepEqual(
    result.manifest.runs.map((run) => run.recipe),
    [
      { recipe: RECIPE, problems: [] },
      { recipe: null, problems: ["no-recipe: none"] },
    ],
  );
  // The rung of the run's engines is asked of the engine the run names. The rung that is about engines of its own
  // is asked of those, in id order, whatever the run names; and of nobody where the run has no recipe.
  assert.deepEqual(
    result.manifest.jobs.map((job) => `${job.run} ${job.rung} ${job.engine}`),
    ["with selftest fake-c", "with own fake-a", "with own fake-b", "without selftest fake-c"],
  );
  assert.deepEqual(
    result.manifest.engines.map((engine) => engine.id),
    ["fake-a", "fake-b", "fake-c"],
  );

  // A suite without such a rung asks no source for a recipe, and its manifest states none.
  const plain = await runSuite({
    suite,
    registry: engines.registry,
    runsDir: tempDir(t),
    sources: { fixture: recipeSource(asked) },
    rungDefinitions: [selftestRung],
  });
  assert.equal(asked.length, 2);
  assert.ok(plain.manifest.runs.every((run) => !Object.hasOwn(run, "recipe")));
});

test("without a source that resolves a recipe the run has none, and the manifest says so", async (t) => {
  const suite = suiteOf("recipes", [{ name: "with", opticalCase: SINGLET }]);
  const { registry } = watchedRegistry({ "fake-a": fakeEngine(), "fake-b": fakeEngine() });
  for (const sources of [undefined, { fixture: { resolve: () => assert.fail("loaded") } }]) {
    const result = await runSuite({ suite, registry, runsDir: tempDir(t), sources, rungDefinitions: [ownRung] });
    assert.deepEqual(result.manifest.runs[0].recipe, {
      recipe: null,
      problems: ["recipe-unavailable: no case source resolves an MTF recipe for this lens"],
    });
    assert.deepEqual(result.manifest.jobs, []);
  }
});

test("a rung's options for its engines travel with its requests, under the options the run states for an engine", async (t) => {
  const suite = suiteOf("options", [
    {
      name: "with",
      opticalCase: SINGLET,
      sampling: { lvGridCap: 64, engines: { "fake-b": { cap: 32, rays: 7 } } },
    },
  ]);
  const engines = watchedRegistry({ "fake-a": fakeEngine(), "fake-b": fakeEngine() });
  await runSuite({
    suite,
    registry: engines.registry,
    runsDir: tempDir(t),
    sources: { fixture: recipeSource() },
    rungDefinitions: [selftestRung, ownRung],
  });
  assert.deepEqual(
    engines.requests.map((request) => request.engineOptions),
    // selftest carries what the run states for an engine and nothing of another rung's; the rung's own options
    // reach both of its engines, and what the run states for one of them is laid over them.
    [undefined, { cap: 32, rays: 7 }, { cap: 64 }, { cap: 32, rays: 7 }],
  );
});

test("a rung of its own engines is not held to the reference of a run that is none of them", async (t) => {
  const runsDir = tempDir(t);
  const suite = suiteOf("own", [
    { name: "with", opticalCase: SINGLET, engines: ["fake-c"], referenceEngine: "fake-c" },
  ]);
  const { registry } = watchedRegistry({ "fake-a": fakeEngine(), "fake-b": fakeEngine(), "fake-c": fakeEngine() });
  const rungDefinitions = [selftestRung, ownRung];
  const sources = { fixture: recipeSource() };
  const { manifest } = await runSuite({ suite, registry, runsDir, sources, rungDefinitions });
  const base = loadPolicy();
  const policy = { ...base, rungs: { selftest: base.rungs.selftest, own: base.rungs.selftest } };
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const rows = (reference?: string): string[] =>
    compareManifest({ manifest, store, policy, reference, rungDefinitions }).comparisons.flatMap((set) =>
      set.pairs.map((pair) => `${set.rung} ${set.mode} ${set.reference ?? "-"} ${pair.a} ${pair.b} ${pair.verdict}`),
    );
  // The run's reference, fake-c, has no job in the rung of fake-a and fake-b: it is not added as missing there.
  assert.deepEqual(rows(), ["own reference-vs-each fake-a fake-a fake-b PASS", "own pairwise - fake-a fake-b PASS"]);
  // A reference that is one of the rung's engines is taken there. In the rung of the run's engines it has no job,
  // and is shown as missing, as a reference is.
  assert.deepEqual(rows("fake-b"), [
    "selftest reference-vs-each fake-b fake-b fake-c ERROR",
    "selftest pairwise - fake-b fake-c ERROR",
    "own reference-vs-each fake-b fake-b fake-a PASS",
    "own pairwise - fake-a fake-b PASS",
  ]);
  // Told that the rung is one of the run's engines, the comparison adds the reference, which has nothing there.
  const shared = compareManifest({ manifest, store, policy, rungDefinitions: [selftestRung] });
  assert.ok(shared.comparisons.some((set) => set.rung === "own" && set.pairs.some((pair) => pair.verdict === "ERROR")));
});
