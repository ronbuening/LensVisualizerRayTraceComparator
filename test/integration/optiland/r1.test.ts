// Rung R1 with optiland: optiland's own first-order data, brought into the contract's frame by its worker, set
// against the reference engine's and LensVisualizer's. A frame or a sign that the worker got wrong would show here
// as a focal point or a pupil in another place, on the first lens.
//
// The contract's cases and the systems made here need optiland only; the suites, the focus stations and the catalog
// need LensVisualizer too. Each test skips with the reason when one of them is missing. Run output goes to a
// temporary directory, and the worker's caches under this repository's gitignored cache directory.
//
// The figures quoted in comments were measured at optiland 4e893f53 and LensVisualizer 5278694b (engine closure
// 78215d72, 151 files). Nothing is pinned to them but verdicts and bounds an order of magnitude above them: every
// gate is the policy's.
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { COMPARATORS } from "../../../src/compare/index.ts";
import { compareGroup } from "../../../src/compare/group.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { OpticalCase, SurfaceShape } from "../../../src/contract/case.ts";
import type { PairComparison } from "../../../src/contract/comparison.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { PARAXIAL_FIRST_ORDER } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import type { ParaxialFirstOrderData } from "../../../src/contract/quantities/paraxialFirstOrder.ts";
import { SYSTEM_DESCRIBE } from "../../../src/contract/quantities/systemDescribe.ts";
import type { QuantityRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import type { RunSpec } from "../../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import type { ManifestJob } from "../../../src/core/manifest.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { r0Rung, r1Rung } from "../../../src/core/rungs.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { ZOOM_ENDS } from "../../../src/engines/lv/zoomEnds.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { caseFixture } from "../../core/support.ts";
import { caseOf, sphere } from "../../engines/ref/support.ts";
import type { SurfaceOf, SystemOf } from "../../engines/ref/support.ts";
import { suitePath } from "../../suites/support.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE, focusStations } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, optilandRoot, pairsOf, runAndCompare, rungSuite, worstOf } from "./support.ts";
import type { RungPair } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE;
/** The suites, the stations and the catalog are of LensVisualizer lenses: they need both. */
const skipLv = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const POLICY = loadPolicy();
const R1 = POLICY.rungs.r1;
/** The metrics of R1 that are judged, each with the plain figure that is shown beside it, where it has one. */
const JUDGED = ["firstOrder.maxAbs", "pupilZ.maxScaled", "pupilRadius.maxScaled"] as const;
const SHOWN = ["pupilZ.maxAbs", "pupilRadius.maxAbs"] as const;

function f8(wire: NdArrayWire): Float64Array {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, "f8");
  return decoded.values as Float64Array;
}

/** Holds every pair of R1 to the gates of the policy as PASS, and says the worst figures of each pair of engines. */
function assertR1Passes(t: TestContext, suite: string, pairs: readonly RungPair[]): void {
  assert.deepEqual(
    JUDGED.map((name) => R1.metrics[name].tolerance),
    [1e-9, 1e-9, 1e-9],
  );
  for (const pair of pairs) {
    const said = `${pair.run}, ${pair.engines}: ${pair.reason ?? ""}`;
    assert.equal(pair.verdict, "PASS", said);
    for (const name of JUDGED) {
      const { value } = pair.metrics[name];
      assert.ok(value !== null && value <= (R1.metrics[name].tolerance ?? 0), `${said} ${name} ${value}`);
    }
  }
  for (const engines of [...new Set(pairs.map((pair) => pair.engines))].sort()) {
    const of = pairs.filter((pair) => pair.engines === engines);
    const figures = [...JUDGED, ...SHOWN].map((name) => {
      const { value, at } = worstOf(of, name);
      return `${name} ${value} mm (${at})`;
    });
    t.diagnostic(`${suite}, R1, ${engines}, ${of.length} pairs: ${figures.join("; ")}`);
  }
}

/** The jobs of a manifest that are not "ok", each as `[run, rung, engine, status, what its entry says]`. */
function notOk(jobs: readonly ManifestJob[]): unknown[] {
  return jobs
    .filter((job) => job.status !== "ok")
    .map((job) => [job.run, job.rung, job.engine, job.status, job.unsupported ?? job.error]);
}

// ── Systems made for the rung: optiland against the reference engine ─────────────────────────────────────────────

const AIR = 1;
const GLASS = 1.5;
/** A biconvex lens of radii 50 and -50 mm, 4 mm thick, with its first vertex at `z`: 50.68 mm of focal length. */
function lens(z: number, index: number | readonly number[] = GLASS): SurfaceOf[] {
  return [
    { z, shape: sphere(50), index },
    { z: z + 4, shape: sphere(-50), index: AIR },
  ];
}
const PLANE: SurfaceShape = { kind: "plane" };

/**
 * Systems that put each reference of the worker's conversion to the test: where the stop stands, a pupil that is
 * upside down, a finite object, an image space that is not air, a rear plate, an image plane that is not where the
 * focus is, several lines, and a pupil at infinity. The reference engine answers each from its ray-transfer
 * matrices, which the analytic tests of test/engines/ref hold to closed forms.
 */
const ANSWERED: Readonly<Record<string, readonly [surfaces: readonly SurfaceOf[], more?: SystemOf]>> = {
  "stop-on-the-first-surface": [lens(0)],
  "stop-on-the-last-surface": [lens(0), { stopIndex: 1 }],
  "stop-in-front": [[{ z: 0, shape: PLANE, index: AIR }, ...lens(10)], { stopSemiDiameter: 1.75 }],
  "stop-behind": [[...lens(0), { z: 14, shape: PLANE, index: AIR }], { stopIndex: 2, stopSemiDiameter: 1.75 }],
  "stop-between-two-lenses": [[...lens(0), { z: 10, shape: PLANE, index: AIR }, ...lens(16)], { stopIndex: 2 }],
  "entrance-pupil-upside-down": [[...lens(0), { z: 150, shape: PLANE, index: AIR }], { stopIndex: 2 }],
  "exit-pupil-upside-down": [[{ z: 0, shape: PLANE, index: AIR }, ...lens(150)]],
  "finite-object": [[...lens(0), { z: 14, shape: PLANE, index: AIR }], { stopIndex: 2, objectZ: -200 }],
  "image-space-of-water": [
    [
      { z: 0, shape: sphere(50), index: GLASS },
      { z: 4, shape: sphere(-50), index: 1.33 },
    ],
  ],
  "one-surface-into-glass": [[{ z: 0, shape: sphere(50), index: GLASS }]],
  "rear-plate": [
    [
      ...lens(0),
      { z: 30, shape: PLANE, index: 1.5168, synthetic: "rearPlate" },
      { z: 32, shape: PLANE, index: AIR, synthetic: "rearPlate" },
    ],
  ],
  "image-plane-inside-the-focus": [lens(0), { imageZ: 20 }],
  "three-lines": [lens(0, [1.5168, 1.5224, 1.5143]), { lines: 3 }],
  "cemented-doublet": [
    [
      { z: 0, shape: sphere(61.47), index: 1.5168 },
      { z: 6, shape: sphere(-44.64), index: 1.6727 },
      { z: 8.5, shape: sphere(-129.94), index: AIR },
    ],
    { stopSemiDiameter: 7.5 },
  ],
  // A plano-convex lens of 100 mm with its stop in its front focal plane: the exit pupil is at minus infinity in
  // both engines, and infinitely large.
  "telecentric-in-image-space": [
    [
      { z: 0, shape: PLANE, index: AIR },
      { z: 100, shape: sphere(50), index: GLASS },
      { z: 103, shape: PLANE, index: AIR },
    ],
  ],
  // A term of power 3 and one of power 4 are flat at the vertex: both engines read the radius alone.
  "higher-terms": [
    [
      {
        z: 0,
        shape: {
          kind: "asphere",
          radius: 50,
          conic: -0.7,
          terms: [
            { power: 3, coeff: 1e-4 },
            { power: 4, coeff: 1e-5 },
          ],
        },
        index: GLASS,
      },
      { z: 4, shape: sphere(-50), index: AIR },
    ],
  ],
};

/** Systems optiland, or every engine, has no first-order data of: each with what each of the two engines answers. */
const REFUSED: Readonly<
  Record<string, { system: readonly [readonly SurfaceOf[], SystemOf?]; optiland: string; ref: string | null }>
> = {
  // The contract counts twice the coefficient as curvature at the vertex; optiland's paraxial model does not.
  "term-of-power-2": {
    system: [
      [
        {
          z: 0,
          shape: { kind: "asphere", radius: 50, conic: 0, terms: [{ power: 2, coeff: 1e-3 }] },
          index: GLASS,
        },
        { z: 4, shape: sphere(-50), index: AIR },
      ],
    ],
    optiland: "surface.asphere.quadratic-term",
    ref: null,
  },
  "term-of-power-1": {
    system: [
      [
        {
          z: 0,
          shape: { kind: "asphere", radius: 50, conic: 0, terms: [{ power: 1, coeff: 1e-3 }] },
          index: GLASS,
        },
        { z: 4, shape: sphere(-50), index: AIR },
      ],
    ],
    optiland: "surface.asphere.linear-term",
    ref: "surface.asphere.linear-term",
  },
  // A surface that focuses 150 mm behind itself in glass, and one whose front focal point lies 75 mm in front of it.
  afocal: {
    system: [
      [
        { z: 0, shape: sphere(50), index: GLASS },
        { z: 225, shape: sphere(-25), index: AIR },
      ],
    ],
    optiland: "system.afocal",
    ref: "system.afocal",
  },
  // The plano-convex lens turned round, with its stop in its rear focal plane: the reference engine answers, with
  // the entrance pupil at an infinity; optiland has no diameter of the exit pupil then.
  "telecentric-in-object-space": {
    system: [
      [
        { z: 0, shape: PLANE, index: GLASS },
        { z: 3, shape: sphere(-50), index: AIR },
        { z: 103, shape: PLANE, index: AIR },
      ],
      { stopIndex: 2 },
    ],
    optiland: "system.telecentric.object-space",
    ref: null,
  },
};

/** Writes cases into a configuration root and a suite of them, one run for each, and returns the suite's name. */
function writeSuite(rootDir: string, name: string, cases: Readonly<Record<string, OpticalCase | string>>): string {
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  for (const [run, opticalCase] of Object.entries(cases)) {
    const path = join(rootDir, "cases", `${run}.json`);
    if (typeof opticalCase === "string") copyFileSync(opticalCase, path);
    else writeFileSync(path, JSON.stringify(opticalCase));
  }
  const runs = Object.keys(cases).map((run) => ({ name: run, lens: { kind: "fixture", path: `cases/${run}.json` } }));
  writeFileSync(
    join(rootDir, `${name}.json`),
    JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name, runs }),
  );
  return name;
}

test(
  "R1 of the contract's cases and of systems made for it: optiland's first-order data is ref's, in every frame",
  { skip, timeout: 600_000 },
  (t) => {
    const { rootDir } = optilandRoot(t);
    const fixtures = Object.fromEntries(
      ["singlet", "double-gauss", "all-features"].map((name) => [name, caseFixture(name)]),
    );
    const made = Object.fromEntries(Object.entries(ANSWERED).map(([name, system]) => [name, caseOf(...system)]));
    const names = [...Object.keys(fixtures), ...Object.keys(made)];
    const name = writeSuite(rootDir, "first-order", { ...fixtures, ...made });

    const { manifest, comparisons, verdicts } = runAndCompare(t, {
      suite: `${name}.json`,
      name,
      engines: "ref,optiland",
      rungs: "r0,r1",
      root: rootDir,
    });
    assert.deepEqual(notOk(manifest.jobs), []);
    assert.equal(manifest.jobs.length, names.length * 2 * 2);
    // Each request is compared against a reference and pair by pair: with two engines, the same pair twice.
    const pairs = names.length * 2 * 2;
    assert.equal(
      verdicts,
      `${name}: ${pairs} pairs: ${pairs} PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR`,
    );
    const r1 = pairsOf(comparisons, "r1", PARAXIAL_FIRST_ORDER);
    assert.deepEqual(
      r1.map((pair) => [pair.run, pair.engines]),
      names.map((run) => [run, "optiland / ref"]),
    );
    assertR1Passes(t, name, r1);
    // Measured: no value of these systems is more than 5.4e-14 mm apart in the two engines.
    for (const metric of JUDGED) assert.ok(worstOf(r1, metric).value < 1e-11, JSON.stringify(worstOf(r1, metric)));

    // What each engine only records travels with the comparison: optiland's f-number, and for the two cases with a
    // finite object the magnification both engines give.
    const recordedBy = (run: string, engine: string): Record<string, readonly (number | null)[]> => {
      const set = comparisons.comparisons.find((each) => each.run === run && each.rung === "r1");
      return set?.participants.find((participant) => participant.engine === engine)?.recorded ?? {};
    };
    assert.deepEqual(Object.keys(recordedBy("singlet", "optiland")), ["optilandFNumber"]);
    assert.deepEqual(recordedBy("singlet", "ref"), {});
    for (const run of ["finite-object", "all-features"]) {
      assert.deepEqual(Object.keys(recordedBy(run, "optiland")), ["magnification", "optilandFNumber"], run);
      const [mine, theirs] = [recordedBy(run, "optiland").magnification, recordedBy(run, "ref").magnification];
      assert.equal(mine.length, theirs.length);
      mine.forEach((value, line) => {
        const other = theirs[line];
        assert.ok(value !== null && other !== null && value < 0, `${run} line ${line}`);
        assert.ok(Math.abs(value - other) <= 1e-12 * Math.abs(other), `${run} line ${line}: ${value} and ${other}`);
      });
    }
  },
);

test(
  "what optiland has no first-order data of is UNSUPPORTED with its item, and R0 of the same case still passes",
  { skip, timeout: 600_000 },
  (t) => {
    const { rootDir } = optilandRoot(t);
    const names = Object.keys(REFUSED);
    const cases = Object.fromEntries(names.map((name) => [name, caseOf(...REFUSED[name].system)]));
    const name = writeSuite(rootDir, "no-first-order", cases);
    // Neither command fails: "unsupported" is an answer.
    const { manifest, comparisons, verdicts } = runAndCompare(t, {
      suite: `${name}.json`,
      name,
      engines: "ref,optiland",
      rungs: "r0,r1",
      root: rootDir,
    });
    const item = (item: string | null): unknown => (item === null ? "ok" : [{ code: "feature", item }]);
    assert.deepEqual(
      manifest.jobs.map((job) => [job.run, job.rung, job.engine, job.status === "ok" ? "ok" : job.unsupported]),
      names.flatMap((run) => [
        [run, "r0", "optiland", "ok"],
        [run, "r0", "ref", "ok"],
        [run, "r1", "optiland", item(REFUSED[run].optiland)],
        [run, "r1", "ref", item(REFUSED[run].ref)],
      ]),
    );
    const pairs = names.length * 2;
    assert.equal(
      verdicts,
      `${name}: ${2 * pairs} pairs: ${pairs} PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, ${pairs} UNSUPPORTED, 0 BLOCKED, 0 ERROR`,
    );
    // The system is built and echoed whatever its first-order data: a term of power 2 is in optiland's sag.
    for (const pair of pairsOf(comparisons, "r0", SYSTEM_DESCRIBE)) assert.equal(pair.verdict, "PASS", pair.run);
    const r1 = pairsOf(comparisons, "r1", PARAXIAL_FIRST_ORDER);
    assert.deepEqual(
      r1.map((pair) => [pair.run, pair.verdict, pair.reason]),
      names.map((run) => {
        const said = [
          `optiland is unsupported (feature ${REFUSED[run].optiland})`,
          ...(REFUSED[run].ref === null ? [] : [`ref is unsupported (feature ${REFUSED[run].ref})`]),
        ];
        return [run, "UNSUPPORTED", said.join("; ")];
      }),
    );
  },
);

// ── The suites: lv, ref and optiland ─────────────────────────────────────────────────────────────────────────────

test(
  "the benchmark on R1: lv, ref and optiland give the same first-order data for all 24 runs, at the reference and photopic lines",
  { skip: skipLv, timeout: 900_000 },
  (t) => {
    const { manifest, comparisons, verdicts } = runAndCompare(t, {
      suite: rungSuite(t, "benchmark"),
      name: "benchmark",
      engines: "lv,ref,optiland",
      rungs: "r0,r1",
    });
    // 12 configurations, each at the reference line and at the five photopic lines; two rungs, three engines.
    assert.equal(manifest.runs.length, 24);
    assert.deepEqual(notOk(manifest.jobs), []);
    assert.equal(manifest.jobs.length, 24 * 2 * 3);
    // For each request two pairs against a reference, and three pair by pair.
    assert.equal(
      verdicts,
      "benchmark: 240 pairs: 240 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR",
    );
    const pairs = pairsOf(comparisons, "r1", PARAXIAL_FIRST_ORDER);
    assert.equal(pairs.length, 24 * 3);
    assert.deepEqual([...new Set(pairs.map((pair) => pair.engines))].sort(), [
      "lv / optiland",
      "lv / ref",
      "optiland / ref",
    ]);
    assertR1Passes(t, "benchmark", pairs);
    // Measured: the largest difference of the suite is 1.8e-12 mm, the front focal point of the 400 mm lens.
    for (const metric of JUDGED)
      assert.ok(worstOf(pairs, metric).value < 1e-10, JSON.stringify(worstOf(pairs, metric)));
  },
);

test(
  "the feature suite on R1: every translation path passes three ways, and optiland declares nothing unsupported",
  { skip: skipLv, timeout: 900_000 },
  (t) => {
    const { manifest, comparisons, verdicts } = runAndCompare(t, {
      suite: suitePath("features"),
      name: "features",
      engines: "lv,ref,optiland",
      rungs: "r0,r1",
    });
    // 16 runs as written, 18 as run: the fixed-iris zoom is run at both ends.
    assert.equal(manifest.runs.length, 18);
    assert.ok(manifest.runs.every((run) => run.caseId !== null && run.problems.length === 0));
    // An odd asphere, an e line, a term of power 20, a flat base, a rear plate, a zoom, a stop inside an element:
    // none of them is a term of power 1 or 2, so optiland's first-order data is asked of each and answers each.
    assert.deepEqual(notOk(manifest.jobs), []);
    assert.equal(
      verdicts,
      "features: 180 pairs: 180 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR",
    );
    const pairs = pairsOf(comparisons, "r1", PARAXIAL_FIRST_ORDER);
    assert.equal(pairs.length, 18 * 3);
    assertR1Passes(t, "features", pairs);
    // Measured: the largest difference of the suite is 1.2e-13 mm, the exit pupil of the zoom at its tele end.
    for (const metric of JUDGED)
      assert.ok(worstOf(pairs, metric).value < 1e-10, JSON.stringify(worstOf(pairs, metric)));
  },
);

// ── In this process: the stations, the stored constants and the catalog ──────────────────────────────────────────

/** `lv` on the real LensVisualizer and `ref` in this process, `optiland` in its worker, and LensVisualizer's exporter. */
async function engines(t: TestContext) {
  const binding = await loadLvBinding(LV_PATH);
  const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  const optiland = await createEngineRegistry(optilandRoot(t)).create("optiland");
  t.after(() => Promise.all([lv.close(), ref.close(), optiland.close()]));
  return { binding, exporter: createLvExporter(binding), lv, ref, optiland };
}

/** A run of one lens, for a rung's request builder. */
function runOf(key: string): RunSpec {
  return { contract: CONTRACT_VERSION, kind: "run-spec", name: key, lens: { kind: "lv", key } };
}

/** Why an engine did not answer, in its own words: the items of an "unsupported", or the error. */
function refusal(result: ResultEnvelope): string {
  if (result.status === "unsupported") {
    return `unsupported: ${(result.unsupported ?? []).map((item) => `${item.code} ${item.item} (${item.message})`).join("; ")}`;
  }
  return `${result.status}: ${result.error?.code ?? ""} ${result.error?.message ?? ""}`;
}

/** The pairs of some answers to one request of a rung, each two engines once, judged as `lvrtc compare` judges. */
function judged(
  rung: "r0" | "r1",
  request: QuantityRequest,
  opticalCase: OpticalCase,
  at: string,
  answers: Readonly<Record<string, JsonObject>>,
): readonly PairComparison[] {
  const { quantity } = POLICY.rungs[rung];
  return compareGroup(
    {
      suite: "in-process",
      run: at,
      caseId: opticalCase.id,
      rung,
      quantity,
      requestId: request.id,
      participants: Object.entries(answers).map(([engine, data]) => ({
        engine,
        fingerprint: null,
        status: "ok" as const,
        data,
      })),
      policy: POLICY.rungs[rung],
      comparator: COMPARATORS.get(quantity, rung),
      context: { spec: request.spec, opticalCase },
    },
    "pairwise",
  ).pairs;
}

/** The largest value of each metric over the pairs it was shown, with where. */
class Worst {
  readonly #found = new Map<string, { value: number; at: string }>();

  see(pair: PairComparison, at: string): void {
    for (const metric of pair.metrics) {
      assert.ok(metric.value !== null, `${at}: ${metric.name} is not finite`);
      const known = this.#found.get(metric.name);
      if (known !== undefined && known.value >= metric.value) continue;
      const place = `${at}, ${pair.a} / ${pair.b}, ${JSON.stringify(metric.where ?? {})}`;
      this.#found.set(metric.name, { value: metric.value, at: place });
    }
  }

  of(name: string): { value: number; at: string } {
    return this.#found.get(name) ?? { value: 0, at: "nowhere" };
  }

  said(names: readonly string[]): string {
    return names.map((name) => `${name} ${this.of(name).value} (${this.of(name).at})`).join("; ");
  }
}

const R0_FIGURES = ["sag.maxScaled", "sag.maxAbs"] as const;
const R1_FIGURES = [...JUDGED, ...SHOWN] as const;

test(
  "at every focus station LensVisualizer certifies, lv, ref and optiland pass R0 and R1 and record one magnification",
  { skip: skipLv, timeout: 600_000 },
  async (t) => {
    const { binding, exporter, lv, ref, optiland } = await engines(t);
    const worst = new Worst();
    let stations = 0;
    const lenses = new Set<string>();
    for (const { key, at, exported, refused } of await focusStations(binding, exporter)) {
      // A station LensVisualizer does not certify has no case: test/integration/lv holds that it is refused.
      if (refused !== null || !exported.ok) continue;
      const { opticalCase } = exported;
      assert.equal(opticalCase.conditions.object.kind, "finite", at);
      for (const rung of [r0Rung, r1Rung]) {
        const id = rung.id as "r0" | "r1";
        const [request] = rung.buildRequests(opticalCase, runOf(key));
        const answers: Record<string, JsonObject> = {};
        for (const [engine, adapter] of Object.entries({ lv, optiland, ref })) {
          const result = await adapter.run(request, opticalCase);
          assert.equal(result.status, "ok", `${at} ${id} ${engine}: ${refusal(result)}`);
          answers[engine] = result.data as JsonObject;
        }
        for (const pair of judged(id, request, opticalCase, at, answers)) {
          assert.equal(pair.verdict, "PASS", `${at} ${id} ${pair.a} / ${pair.b}: ${pair.reason ?? ""}`);
          if (pair.a === "optiland" || pair.b === "optiland") worst.see(pair, at);
        }
        if (id !== "r1") continue;
        // The paraxial magnification of the object plane, from three kernels: LensVisualizer's, the reference
        // engine's ray-transfer matrix and optiland's marginal ray from the axial object point.
        const m = Object.fromEntries(
          Object.entries(answers).map(([engine, data]) => [
            engine,
            f8((data as ParaxialFirstOrderData).recorded.magnification)[0],
          ]),
        );
        assert.ok(m.optiland < 0, `${at}: ${m.optiland}`);
        for (const other of [m.lv, m.ref]) {
          assert.ok(Math.abs(m.optiland - other) <= 1e-12 * Math.abs(other), `${at}: ${m.optiland} against ${other}`);
        }
      }
      stations++;
      lenses.add(key);
    }
    t.diagnostic(
      `${stations} certified focus stations of ${lenses.size} lenses, the pairs of optiland: ` +
        `R0 ${worst.said(R0_FIGURES)}; R1 ${worst.said(R1_FIGURES)}`,
    );
    // At 5278694b: 22 stations of 14 lenses, from 1:40 to 1:1 (19 of 12 at d36f44b3, where test/integration/lv
    // first counted them).
    assert.ok(stations >= 10, String(stations));
    for (const metric of JUDGED)
      assert.ok(worst.of(metric).value < 1e-10, `${metric} ${JSON.stringify(worst.of(metric))}`);
  },
);

test(
  "optiland's pupils and f-number beside LensVisualizer's stored constants on the benchmark: recorded, never judged",
  { skip: skipLv, timeout: 600_000 },
  async (t) => {
    // LensVisualizer's stored pupil constants are found with real rays near the axis, or are nominal; optiland's
    // values are paraxial images of the stop, as lv's compared ones are. How far the two kinds lie apart is
    // information about LensVisualizer's constants (docs/gotchas.md, "The stored pupil constants are not
    // paraxial"), and is said here and nowhere asserted but for being a number.
    const { exporter, lv, optiland } = await engines(t);
    /** Each of LensVisualizer's recorded constants with optiland's own value of a like meaning. */
    const beside: readonly (readonly [stored: string, mine: (data: ParaxialFirstOrderData) => number])[] = [
      ["lvStoredEntrancePupilZ", (data) => f8(data.entrancePupilZ)[0]],
      ["lvStoredExitPupilZ", (data) => f8(data.exitPupilZ)[0]],
      ["lvNominalEntrancePupilSemiDiameter", (data) => f8(data.entrancePupilSemiDiameter)[0]],
      ["lvStoredExitPupilSemiDiameter", (data) => f8(data.exitPupilSemiDiameter)[0]],
      ["lvNominalFNumber", (data) => f8(data.recorded.optilandFNumber)[0]],
    ];
    const widest = new Map<string, { difference: number; relative: number; at: string }>();
    let cases = 0;
    for (const key of BENCHMARK_KEYS) {
      const isZoom = key === "nikon-z-24-70f4s";
      for (const { end, zoomT } of isZoom ? ZOOM_ENDS : [{ end: "", zoomT: 0 }]) {
        const exported = await exporter.exportLens(key, isZoom ? { state: { zoomT } } : {});
        assert.ok(exported.ok, `${key}: ${JSON.stringify(exported)}`);
        const { opticalCase } = exported;
        const [request] = r1Rung.buildRequests(opticalCase, runOf(key));
        const [mine, theirs] = [await optiland.run(request, opticalCase), await lv.run(request, opticalCase)];
        assert.deepEqual([mine.status, theirs.status], ["ok", "ok"], key);
        const [ours, stored] = [mine.data as ParaxialFirstOrderData, (theirs.data as ParaxialFirstOrderData).recorded];
        cases++;
        for (const [name, value] of beside) {
          const [a, b] = [value(ours), f8(stored[name])[0]];
          assert.ok(Number.isFinite(a) && Number.isFinite(b), `${key} ${name}: ${a} and ${b}`);
          const difference = Math.abs(a - b);
          if (difference > (widest.get(name)?.difference ?? -1)) {
            const at = `${key}${end === "" ? "" : ` ${end}`}: optiland ${a}, LensVisualizer ${b}`;
            widest.set(name, { difference, relative: difference / Math.abs(b), at });
          }
        }
      }
    }
    assert.equal(cases, 12);
    for (const [name] of beside) {
      const { difference, relative, at } = widest.get(name) ?? { difference: NaN, relative: NaN, at: "" };
      t.diagnostic(`${name} against optiland's own, widest of 12: ${difference} (${relative} of it) on ${at}`);
    }
  },
);

test(
  "on every exportable lens of the catalog, a zoom at both ends, optiland builds the case and passes R0 and R1 against ref",
  { skip: skipLv, timeout: 1_800_000 },
  async (t) => {
    const { binding, exporter, ref, optiland } = await engines(t);
    const { entries } = await binding.catalog();
    const threw: string[] = [];
    const notExported = new Map<string, number>();
    const notBuilt: string[] = [];
    const noFirstOrder: string[] = [];
    const failed: string[] = [];
    const counts = { lenses: 0, zooms: 0, cases: 0, r0: 0, r1: 0 };
    const worst = new Worst();
    for (const entry of entries) {
      counts.lenses++;
      if (entry.zoom === true) counts.zooms++;
      // The default state of a lens: a prime as it is, a zoom at each end; the reference line, the stop wide open.
      for (const { end, zoomT } of entry.zoom === true ? ZOOM_ENDS : [{ end: "", zoomT: 0 }]) {
        const at = `${entry.key}${end === "" ? "" : ` ${end}`}`;
        let exported: Awaited<ReturnType<typeof exporter.exportLens>>;
        try {
          exported = await exporter.exportLens(entry.key, entry.zoom === true ? { state: { zoomT } } : {});
        } catch (error) {
          threw.push(`${at}: ${error instanceof Error ? error.message : String(error)}`);
          continue;
        }
        if (!exported.ok) {
          for (const code of new Set(exported.problems.map((problem) => problem.code))) {
            notExported.set(code, (notExported.get(code) ?? 0) + 1);
          }
          continue;
        }
        const { opticalCase } = exported;
        assert.equal(opticalCase.conditions.lines.length, 1, at);
        counts.cases++;
        for (const rung of [r0Rung, r1Rung]) {
          const id = rung.id as "r0" | "r1";
          const [request] = rung.buildRequests(opticalCase, runOf(entry.key));
          const [mine, theirs] = [await optiland.run(request, opticalCase), await ref.run(request, opticalCase)];
          assert.equal(theirs.status, "ok", `${at} ${id} ref: ${refusal(theirs)}`);
          if (mine.status !== "ok") {
            // A case optiland did not build, or built as another system, is an error of R0; what it has no
            // first-order data of is an "unsupported" of R1. Either is named with the lens and the reason.
            (id === "r0" ? notBuilt : noFirstOrder).push(`${at}: ${refusal(mine)}`);
            continue;
          }
          const [pair] = judged(id, request, opticalCase, at, {
            optiland: mine.data as JsonObject,
            ref: theirs.data as JsonObject,
          });
          counts[id]++;
          if (pair.verdict !== "PASS") failed.push(`${at} ${id}: ${pair.verdict} ${pair.reason ?? ""}`);
          worst.see(pair, at);
        }
      }
    }
    const refusedExports =
      [...notExported]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([code, count]) => `${code} ${count}`)
        .join(", ") || "none";
    t.diagnostic(
      `${counts.lenses} lenses, ${counts.zooms} of them zooms: ${counts.cases} cases on the reference line ` +
        `(states not exported, by code: ${refusedExports}); optiland built ${counts.r0} and gave first-order data ` +
        `of ${counts.r1}`,
    );
    t.diagnostic(`optiland against ref, R0: ${worst.said(R0_FIGURES)}`);
    t.diagnostic(`optiland against ref, R1: ${worst.said(R1_FIGURES)}`);
    t.diagnostic(`cases optiland cannot build: ${notBuilt.join("; ") || "none"}`);
    t.diagnostic(`cases optiland has no first-order data of: ${noFirstOrder.join("; ") || "none"}`);
    t.diagnostic(`not PASS: ${failed.join("; ") || "none"}`);

    assert.deepEqual(threw, [], "exporting a lens threw");
    // At 5278694b: 900 lenses, 297 of them zooms, 1173 cases.
    assert.ok(counts.cases > 1000, `about 1170 cases export, found ${counts.cases}`);
    // optiland refuses no case of the catalog: every one is built as the case states it, and none has a term of
    // power 1 or 2, is afocal or has its entrance pupil at infinity.
    assert.deepEqual(notBuilt, []);
    assert.deepEqual(noFirstOrder, []);
    assert.deepEqual([counts.r0, counts.r1], [counts.cases, counts.cases]);
    assert.deepEqual(failed, []);
    // Everything R0 holds to equality is equal in every case, and the sag is within rounding.
    for (const count of ["layout", "shape", "aperture", "index"]) {
      assert.equal(worst.of(`${count}.mismatches`).value, 0, count);
    }
    assert.ok(worst.of("sag.maxScaled").value < 1e-14, JSON.stringify(worst.of("sag.maxScaled")));
    for (const name of JUDGED) {
      assert.ok(worst.of(name).value <= (R1.metrics[name].tolerance ?? 0), `${name} ${JSON.stringify(worst.of(name))}`);
    }
  },
);
