// Rung R3 with optiland: the optical path of the same rays in three engines. Every engine is handed the rays
// LensVisualizer launches, or rays made here from a case file, and the path optiland's own tracer sums for each is
// set against the reference engine's and LensVisualizer's, through the commands as a user runs them: to the last
// surface of the case, on to the image plane, and relative to the chief ray's, in waves of the line.
//
// The rung is the one the reference engine and LensVisualizer were held to in Phase 1: nothing of it changed for a
// third engine. Its requests are those of R2, so an engine traces a set once for both.
//
// The requests made here and the systems made for the rung need optiland only; the suites need LensVisualizer too.
// Each test skips with the reason when one of them is missing. Run output goes to a temporary directory, and the
// worker's caches under this repository's gitignored cache directory. The focus stations, whose rays diverge from
// an object point, are stations.test.ts.
//
// The figures quoted in comments were measured at optiland 4e893f53 and LensVisualizer c05a2ab7 (engine closure
// 78215d72, 151 files). Nothing is pinned to them: every gate is the policy's, a pair of LensVisualizer may be PASS
// or FLOOR, and none is asked to be a floor, so a LensVisualizer that meets its surfaces more closely turns nothing
// red.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { raysGeometryComparator } from "../../../src/compare/raysGeometry.ts";
import { raysPathComparator } from "../../../src/compare/raysPath.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { caseFixture } from "../../core/support.ts";
import { caseOf } from "../../engines/ref/support.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, optilandRoot, runAndCompare } from "./support.ts";
import { AGREEMENT, PATHS, PATH_SYSTEMS, SYSTEMS, assertR2, assertR3, f8 } from "./traced.ts";
import type { R3Summary } from "./traced.ts";

const skip = OPTILAND_UNAVAILABLE;
const skipSuites = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;

// ── One request, straight to the two engines: rays with a chief ray ──────────────────────────────────────────────

/** The cells of a lattice over the middle of a case's first surface: where each ray of it is aimed, on the vertex plane. */
function latticeCells(opticalCase: OpticalCase): [x: number, y: number][] {
  const across = 12;
  const reach = 0.4 * opticalCase.system.surfaces[0].aperture.semiDiameter;
  const cells: [number, number][] = [];
  for (let row = 0; row < across; row++) {
    for (let column = 0; column < across; column++) {
      cells.push([-reach + (2 * reach * (column + 0.5)) / across, -reach + (2 * reach * (row + 0.5)) / across]);
    }
  }
  return cells;
}

/**
 * Rays aimed at points of a case's first vertex plane: a collimated bundle that leans by `degrees` and starts
 * 10 mm in front of the lens for an object at infinity, and for a finite one rays from one point of the object
 * plane, `degrees` off the axis as seen from the first vertex. With `chief` the last ray is stated as the set's
 * chief ray, which to rung R3 is the ray that every other ray's path is taken relative to. A case file has no
 * chief ray of its own (its probe lattices state none), so the path relative to one is measured on rays made here.
 * Every direction is a unit vector to a rounding times `stretch`: the same lines, stated with longer directions.
 */
function raysAt(
  opticalCase: OpticalCase,
  line: number,
  degrees: number,
  targets: readonly (readonly [number, number])[],
  chief: boolean,
  stretch = 1,
): RaysTraceSpec {
  const placed = opticalCase.conditions.object;
  const tangent = Math.tan((degrees * Math.PI) / 180);
  const rays = targets.length;
  const origins = new Float64Array(3 * rays);
  const directions = new Float64Array(3 * rays);
  targets.forEach(([x, y], ray) => {
    // Toward -y for a positive field angle, as the contract has it.
    const from: [number, number, number] =
      placed.kind === "finite" ? [0, -placed.z * tangent, placed.z] : [x, y + 10 * tangent, -10];
    const toward = [x - from[0], y - from[1], -from[2]];
    const length = Math.hypot(toward[0], toward[1], toward[2]);
    origins.set(from, 3 * ray);
    directions.set(
      toward.map((part) => (part / length) * stretch),
      3 * ray,
    );
  });
  return {
    line,
    origins: encodeNdArray(origins, [rays, 3]),
    directions: encodeNdArray(directions, [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1)),
    groups: { field: { angleDeg: degrees }, ...(chief ? { chiefIndex: rays - 1 } : {}) },
  };
}

test(
  "optiland's path of rays with a chief ray is ref's: to the last surface, to the image plane and relative to it",
  { skip, timeout: 600_000 },
  async (t) => {
    const optiland = await createEngineRegistry(optilandRoot(t)).create("optiland");
    const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
    t.after(() => Promise.all([optiland.close(), ref.close()]));

    // The contract's lens of eleven surfaces and its case of every feature (a finite object, two lines, a rear
    // plate), and the three systems that differ in where a path ends.
    const fixtures = ["double-gauss", "all-features"].map(
      (name) => [name, JSON.parse(readFileSync(caseFixture(name), "utf8")) as OpticalCase] as const,
    );
    const made = Object.entries(PATH_SYSTEMS).map(
      ([name, [surfaces, more]]) => [name, caseOf(surfaces, more)] as const,
    );
    let worst = 0;
    const counted: string[] = [];
    for (const [name, opticalCase] of [...fixtures, ...made]) {
      const surfaces = opticalCase.system.surfaces.length;
      const lines = opticalCase.conditions.lines;
      const after = decodeNdArray(opticalCase.conditions.indexAfterSurface).values;
      for (let line = 0; line < lines.length; line++) {
        const said = `${name}, line ${line}`;
        // Which ray is the chief ray is asked of the reference engine first: of the cells it lands, the one in the
        // middle of them. A stop cuts into the lattice, and one of the cases has a central obstruction.
        const cells = latticeCells(opticalCase);
        const scout = raysAt(opticalCase, line, 4, cells, false);
        const scouted = await ref.run(
          makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec: scout }),
          opticalCase,
        );
        assert.equal(scouted.status, "ok", said);
        const through = [...decodeNdArray((scouted.data as RaysTraceData).status).values].flatMap((ended, cell) =>
          ended === RAY_STATUS.ok ? [cells[cell]] : [],
        );
        assert.ok(through.length > 48, `${said}: ${through.length} cells landed`);
        const middle = [0, 1].map((axis) => through.reduce((sum, cell) => sum + cell[axis], 0) / through.length);
        const nearest = through.reduce((best, cell) =>
          Math.hypot(cell[0] - middle[0], cell[1] - middle[1]) < Math.hypot(best[0] - middle[0], best[1] - middle[1])
            ? cell
            : best,
        );
        const spec = raysAt(opticalCase, line, 4, [...cells, nearest], true);
        assert.deepEqual(raysTraceQuantity.validateSpec(spec), [], said);
        const request = makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec });
        const [traced, exact] = [await optiland.run(request, opticalCase), await ref.run(request, opticalCase)];
        assert.deepEqual([traced.status, exact.status], ["ok", "ok"], JSON.stringify(traced.error ?? exact.error));
        assert.deepEqual(raysTraceQuantity.validateData(traced.data), [], said);
        assert.equal(traced.method?.params.opticalPath, "opd-stretches-times-direction-length");
        const [mine, theirs] = [traced.data as RaysTraceData, exact.data as RaysTraceData];
        const context = { opticalCase, spec };

        // The two engines land the same rays, the chief ray among them.
        const status = decodeNdArray(mine.status).values;
        const chief = status.length - 1;
        assert.deepEqual(mine.status, theirs.status, said);
        assert.equal(status[chief], RAY_STATUS.ok, `${said}: the chief ray landed`);
        const geometry = raysGeometryComparator.compare(mine as JsonObject, theirs as JsonObject, context);
        assert.ok(geometry.comparable, said);
        const landed = geometry.metrics.find((metric) => metric.name === "rays.compared")?.value ?? 0;
        assert.ok(landed > 48, `${said}: ${landed} rays landed`);
        counted.push(`${name} line ${line}: ${landed}`);

        // The comparator of R3 on the two answers: all three figures, each within what the floor rule asks of a
        // witness, a thousandth of the gate.
        const outcome = raysPathComparator.compare(mine as JsonObject, theirs as JsonObject, context);
        assert.ok(outcome.comparable, said);
        assert.deepEqual(outcome.unmeasured, [], said);
        assert.deepEqual(
          outcome.metrics.map((metric) => metric.name),
          [...PATHS],
        );
        for (const { name: metric, value } of outcome.metrics) {
          assert.ok(value <= AGREEMENT[metric], `${said}: ${metric} ${value} waves`);
          worst = Math.max(worst, value);
        }

        // What the contract says of the way to the image plane, held to each engine's own answer: the path grows
        // by the index after the last surface, at the line, times the length from the exit point to the landing.
        const index = after[line * surfaces + surfaces - 1];
        for (const [engine, data] of [
          ["optiland", mine],
          ["ref", theirs],
        ] as const) {
          const [toLast, toImage] = [f8(data.opticalPath), f8(data.opticalPathToImage)];
          const [exit, landing] = [f8(data.exitPoint), f8(data.imagePoint)];
          status.forEach((ended, ray) => {
            if (ended !== RAY_STATUS.ok) return;
            const length = Math.hypot(
              landing[3 * ray] - exit[3 * ray],
              landing[3 * ray + 1] - exit[3 * ray + 1],
              landing[3 * ray + 2] - exit[3 * ray + 2],
            );
            const grown = toImage[ray] - toLast[ray];
            assert.ok(Math.abs(grown - index * length) <= 2e-12, `${said}, ${engine}, ray ${ray}: ${grown}`);
          });
        }
      }
    }
    // On the rear face of a plate a ray lands where it left: the image space adds nothing to its path.
    const onTheFace = caseOf(...PATH_SYSTEMS["image-on-the-rear-face-of-a-plate"]);
    assert.equal(onTheFace.conditions.imageZ, onTheFace.system.surfaces[3].z);
    // And the image space of one of the systems is not air.
    const immersed = decodeNdArray(caseOf(...PATH_SYSTEMS["immersed-image-space"]).conditions.indexAfterSurface);
    assert.equal(immersed.values[1], 1.33);
    t.diagnostic(
      `rays with a chief ray, optiland against ref: the largest figure of R3 is ${worst} waves; of 145 rays a set, ` +
        `landed in both: ${counted.join(", ")}`,
    );
  },
);

test(
  "a ray is its line: stated with directions 4.5e-13 longer, the same rays have the same paths, in optiland and in ref",
  { skip, timeout: 600_000 },
  async (t) => {
    const optiland = await createEngineRegistry(optilandRoot(t)).create("optiland");
    const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
    t.after(() => Promise.all([optiland.close(), ref.close()]));

    // A lens 2 m from an object point, and the rays from that point twice: with directions that are unit vectors to
    // a rounding, and with the same directions 2^-41 longer, which a spec may state (1e-12). The contract's path is
    // index times length, so it is a property of the line and the two sets have one answer. An engine that counts
    // its steps along the direction for lengths has the second set's paths short by 2^-41 of 2 m, fifteen times
    // what the floor rule asks of a witness: optiland's own sum does (docs/gotchas.md), and its worker makes each
    // step a length. The lens is 4 mm thick and met within 2 degrees of its axis, so what optiland's refraction
    // makes of a longer direction, which bends another ray, is nothing that shows here.
    const far = 2000;
    const longer = 1 + 2 ** -41;
    const opticalCase = caseOf(SYSTEMS["finite-object"][0], { objectZ: -far });
    const wave = opticalCase.conditions.lines[0].wavelengthNm * 1e-6;
    assert.ok((far * (longer - 1)) / wave > 10 * AGREEMENT["opticalPath.maxAbs"]);
    const cells = latticeCells(opticalCase);
    const targets = [...cells, cells[Math.floor(cells.length / 2)]];
    const answers: { optiland: RaysTraceData; ref: RaysTraceData }[] = [];
    for (const stretch of [1, longer]) {
      const spec = raysAt(opticalCase, 0, 1, targets, true, stretch);
      assert.deepEqual(raysTraceQuantity.validateSpec(spec), [], `directions ${stretch} long`);
      const request = makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec });
      const [traced, exact] = [await optiland.run(request, opticalCase), await ref.run(request, opticalCase)];
      assert.deepEqual([traced.status, exact.status], ["ok", "ok"], JSON.stringify(traced.error ?? exact.error));
      const [mine, theirs] = [traced.data as RaysTraceData, exact.data as RaysTraceData];
      // Every ray lands, in both engines.
      assert.ok(decodeNdArray(mine.status).values.every((ended) => ended === RAY_STATUS.ok));
      assert.deepEqual(mine.status, theirs.status);
      // The two engines against each other, on either set: every figure of R3 within the witness's agreement.
      const outcome = raysPathComparator.compare(mine as JsonObject, theirs as JsonObject, { opticalCase, spec });
      assert.ok(outcome.comparable);
      assert.deepEqual(outcome.unmeasured, []);
      for (const { name, value } of outcome.metrics) {
        assert.ok(value <= AGREEMENT[name], `directions ${stretch} long: ${name} ${value} waves`);
      }
      answers.push({ optiland: mine, ref: theirs });
    }
    // And each engine against itself: the same line has the same path, whatever length its direction was given.
    const moved: Record<string, number> = {};
    for (const engine of ["optiland", "ref"] as const) {
      for (const member of ["opticalPath", "opticalPathToImage"] as const) {
        const [unit, stretched] = [f8(answers[0][engine][member]), f8(answers[1][engine][member])];
        const worst = Math.max(...unit.map((path, ray) => Math.abs(stretched[ray] - path) / wave));
        assert.ok(worst <= AGREEMENT[`${member}.maxAbs`], `${engine}, ${member}: moved by ${worst} waves`);
        moved[`${engine} ${member}`] = worst;
      }
    }
    t.diagnostic(
      `the same ${targets.length} rays with directions 2^-41 longer, from ${far} mm: paths moved by, in waves, ` +
        `${JSON.stringify(moved)}; a sum of steps would be ${(far * (longer - 1)) / wave} short`,
    );
  },
);

// ── The contract's cases and systems made for the rungs: optiland against the reference engine ───────────────────

test(
  "R3 of the contract's cases and of systems made for it: optiland's paths are ref's, wherever a case ends",
  { skip, timeout: 900_000 },
  (t) => {
    const { rootDir } = optilandRoot(t);
    const fixtures = ["singlet", "double-gauss", "all-features"];
    const systems = { ...SYSTEMS, ...PATH_SYSTEMS };
    const made = Object.entries(systems).map(([name, [surfaces, more]]) => [name, caseOf(surfaces, more)] as const);
    mkdirSync(join(rootDir, "cases"));
    for (const name of fixtures) writeFileSync(join(rootDir, "cases", `${name}.json`), readFileSync(caseFixture(name)));
    for (const [name, opticalCase] of made) {
      writeFileSync(join(rootDir, "cases", `${name}.json`), JSON.stringify(opticalCase));
    }
    const names = [...fixtures, ...made.map(([name]) => name)];
    const suite = {
      contract: CONTRACT_VERSION,
      kind: "suite",
      name: "made-for-r3",
      defaults: { fields: { kind: "angles-deg", values: [0, 5, 12] }, sampling: { bundleGrid: 32 } },
      runs: names.map((name) => ({ name, lens: { kind: "fixture", path: `cases/${name}.json` } })),
    };
    writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));

    // Both rungs: the three systems that are here for where a path ends have not been through R2 either.
    const cycle = runAndCompare(t, {
      suite: "suite.json",
      name: "made-for-r3",
      engines: "ref,optiland",
      rungs: "r2,r3",
      root: rootDir,
    });
    const { manifest } = cycle;
    assert.deepEqual(
      manifest.jobs.filter((job) => job.status !== "ok").map((job) => [job.run, job.engine, job.status, job.error]),
      [],
    );
    // Three fields a line: 17 lines over the 15 cases, 51 ray sets, each asked of both engines on both rungs.
    const sets = manifest.runs.reduce((total, run) => total + (run.raySets?.sets.length ?? 0), 0);
    assert.equal(sets, 3 * 17);
    assert.equal(manifest.jobs.length, 2 * 2 * sets);
    assertTracedOnce(manifest.jobs);
    assert.equal(assertR2(t, "made for R3", cycle.comparisons).pairs.length, sets);
    const paths = assertR3(t, "made for R3", cycle.comparisons);
    assert.deepEqual([...new Set(paths.pairs.map((pair) => pair.engines))], ["optiland / ref"]);
    assert.equal(paths.pairs.length, sets);
    // The probe lattice of a case file states no chief ray: the two paths are judged, and the pair says that the
    // third was not measured. The request above measures it.
    assert.equal(paths.withoutChief.length, sets);
    assert.deepEqual(Object.keys(paths.worst["optiland / ref"]), PATHS.slice(0, 2));
  },
);

// ── The suites: lv, ref and optiland on every rung of Phase 2 ────────────────────────────────────────────────────

/** Holds a manifest to each ray set having been traced once by each engine: R3's job of a set is R2's answer. */
function assertTracedOnce(jobs: readonly { rung: string; storeKey: string | null }[]): void {
  const answered = (rung: string): (string | null)[] =>
    jobs.filter((job) => job.rung === rung).map((job) => job.storeKey);
  assert.ok(answered("r3").length > 0 && !answered("r3").includes(null));
  assert.deepEqual(answered("r3"), answered("r2"), "the answer of a set to R3 is its answer to R2");
}

/**
 * A suite on rungs R0 to R3 by all three engines, as Phase 2 states its benchmark:
 * `lvrtc run <suite> --engines lv,ref,optiland --rungs r0,r1,r2,r3`, then `lvrtc compare`, which must find no
 * failure on any rung. R3 is then held pair by pair; R0, R1 and R2 have tests of their own.
 */
function everyRung(
  t: TestContext,
  suite: "benchmark" | "features",
): { paths: R3Summary; verdicts: string; sets: number } {
  const cycle = runAndCompare(t, {
    suite: suitePath(suite),
    name: suite,
    engines: "lv,ref,optiland",
    rungs: "r0,r1,r2,r3",
  });
  const { manifest } = cycle;
  assert.deepEqual(
    manifest.jobs.filter((job) => job.status !== "ok").map((job) => [job.run, job.rung, job.engine, job.status]),
    [],
  );
  const sets = manifest.runs.reduce((total, run) => total + (run.raySets?.sets.length ?? 0), 0);
  // The built system and its first-order data of each run, and each ray set on two rungs, of three engines.
  assert.equal(manifest.jobs.length, 3 * (2 * manifest.runs.length + 2 * sets));
  assertTracedOnce(manifest.jobs);
  const paths = assertR3(t, suite, cycle.comparisons);
  assert.equal(paths.pairs.length, 3 * sets);
  assert.deepEqual([...new Set(paths.pairs.map((pair) => pair.engines))].sort(), [
    "lv / optiland",
    "lv / ref",
    "optiland / ref",
  ]);
  for (const pair of paths.pairs.filter((pair) => pair.verdict === "FLOOR")) {
    t.diagnostic(`${suite}: floor of R3, ${pair.run}, ${pair.engines}: ${pair.reason ?? ""}`);
  }
  t.diagnostic(`${suite}, R0 to R3 on three engines in ${cycle.runSeconds.toFixed(1)} s: ${cycle.verdicts}`);
  t.diagnostic(`${suite}: no chief ray landed in ${paths.withoutChief.length} of ${sets} ray sets`);
  return { paths, verdicts: cycle.verdicts, sets };
}

test(
  "the benchmark on R0 to R3, three ways: no pair fails a rung, and optiland's paths are ref's on every ray set",
  { skip: skipSuites, timeout: 1_800_000 },
  (t) => {
    const { paths, verdicts, sets } = everyRung(t, "benchmark");
    // 12 configurations, three fields, the reference line and the five photopic ones.
    assert.equal(sets, 216);
    // Measured: optiland within 2.7e-9 waves of ref in every path and relative to every chief ray, over 137 596
    // rays, and LensVisualizer within 6.0e-6 waves of both: every pair inside the gate, so the benchmark has no
    // floor. A pair is counted in both modes: 24 runs on R0 and on R1, 216 ray sets on R2 and on R3, five pairs each.
    assert.match(
      verdicts,
      /^benchmark: 2400 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
    // Every chief ray of the benchmark lands, in every engine: the path relative to it is measured in every pair.
    assert.deepEqual(paths.withoutChief, []);
  },
);

test(
  "the feature suite on R0 to R3, three ways: no pair fails a rung, and a floor of R3 names its witness",
  { skip: skipSuites, timeout: 1_800_000 },
  (t) => {
    const { paths, verdicts, sets } = everyRung(t, "features");
    // 16 runs as written, 18 as run: the fixed-iris zoom is run at both ends.
    assert.equal(sets, 162);
    assert.match(
      verdicts,
      /^features: 1800 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
    // Measured: optiland within 3.5e-9 waves of ref; two ray sets of the Hologon, at its full field at 470 nm and
    // 510 nm, are floors of LensVisualizer against ref and against optiland alike (2.07e-5 waves to the image and
    // 2.28e-5 relative to the chief ray, where optiland is 4.2e-10 waves from ref). None is asked for here:
    // `assertR3` holds whatever is a floor to naming both figures. At the wide end of the fixed-iris zoom an
    // aperture stops the chief ray of the full field for all three engines, on every line: six ray sets whose
    // paths are judged without it.
    assert.ok(paths.withoutChief.length <= sets / 10, JSON.stringify(paths.withoutChief));
  },
);
