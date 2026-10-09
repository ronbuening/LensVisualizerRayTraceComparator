// What the tests of the two rungs of traced rays share: what every pair of a compared run is held to in R2 (where
// each ray meets each surface, where it lands, which rays got through) and in R3 (its optical path), the systems
// made for those rungs, and the answers optiland stored. Nothing here is a test of its own.
//
// Nothing is pinned to a figure of LensVisualizer: every gate is the policy's, a pair of LensVisualizer may be
// PASS or FLOOR, and none is asked to be a floor, so a LensVisualizer that meets its surfaces more closely turns
// nothing red. What is asked of optiland against the reference engine is the agreement the policy's floor rule
// asks of a witness, which is far inside each gate.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { TestContext } from "node:test";

import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { SurfaceShape } from "../../../src/contract/case.ts";
import { RAYS_TRACE } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData } from "../../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { STORE_DIRECTORY } from "../../../src/core/resultStore.ts";
import { sphere } from "../../engines/ref/support.ts";
import type { SurfaceOf, SystemOf } from "../../engines/ref/support.ts";
import { pairsOf, worstOf } from "./support.ts";
import type { RunCycle, RungPair } from "./support.ts";

const POLICY = loadPolicy();
const R2 = POLICY.rungs.r2;
const R3 = POLICY.rungs.r3;

/** The three figures of R2 that are of the rays both engines land. */
export const GEOMETRY = ["hits.maxDistance", "direction.maxAbs", "landing.maxDistance"] as const;
/** The three figures of R3, each in waves of the line: the path to the last surface, to the image, and relative. */
export const PATHS = ["opticalPath.maxAbs", "opticalPathToImage.maxAbs", "opd.maxAbs"] as const;
/** How closely the policy asks another engine to agree with the arbiter before it believes the arbiter. */
export const AGREEMENT: Readonly<Record<string, number>> = Object.fromEntries([
  ...GEOMETRY.map((name) => [name, R2.metrics[name].floor?.agreement ?? NaN]),
  ...PATHS.map((name) => [name, R3.metrics[name].floor?.agreement ?? NaN]),
]);

/** The elements of a float64 array of an answer, in order. */
export function f8(wire: RaysTraceData[keyof RaysTraceData]): number[] {
  return [...decodeNdArray(wire).values];
}

/** How the rays of each engine ended, over every ray set of a rung of traced rays. */
export function rayCounts(
  comparisons: ComparisonFile,
  rung: "r2" | "r3" = "r2",
): Record<string, { ok: number; blocked: number; failed: number }> {
  const counts: Record<string, { ok: number; blocked: number; failed: number }> = {};
  for (const set of comparisons.comparisons) {
    if (set.mode !== "pairwise" || set.rung !== rung) continue;
    for (const { engine, recorded } of set.participants) {
      const of = (counts[engine] ??= { ok: 0, blocked: 0, failed: 0 });
      of.ok += recorded?.["rays.ok"]?.[0] ?? 0;
      of.blocked += recorded?.["rays.blocked"]?.[0] ?? 0;
      of.failed += recorded?.["rays.failed"]?.[0] ?? 0;
    }
  }
  return counts;
}

/** What `assertR2` found, for a second run to be held to. */
export interface R2Summary {
  readonly pairs: readonly RungPair[];
  readonly verdicts: Readonly<Record<string, number>>;
  readonly counts: ReturnType<typeof rayCounts>;
}

/** A number as a verdict's reason writes it. */
const NUMBER = String.raw`\d(\.\d+)?(e-?\d+)?`;

/**
 * Holds the reason of a floor to naming, for each of `names`, both figures of the floor rule: what the witness is
 * off the arbiter by, which is no longer nothing with a third engine, and what LensVisualizer is.
 */
function assertFloorNamesItsWitness(rung: typeof R2, names: readonly string[], reason: string, said: string): void {
  for (const name of names) {
    const limits = rung.metrics[name].floor;
    assert.ok(limits !== undefined);
    const escaped = name.replace(".", String.raw`\.`);
    const witness = new RegExp(`optiland against ref ${escaped} ${NUMBER} within ${limits.agreement.toExponential(2)}`);
    const floored = new RegExp(`lv against ref ${escaped} ${NUMBER} within ${limits.limit.toExponential(2)}`);
    assert.match(reason, witness, said);
    assert.match(reason, floored, said);
  }
  assert.match(reason, /; floor of lv: optiland against ref /, said);
}

/**
 * Holds every pair of a compared run to rung R2: PASS, or FLOOR where the policy allows one, never anything else;
 * not one ray that one engine stopped and the other passed; and no ray that an engine could not trace. A pair of
 * optiland and the reference engine is held to more: the agreement the floor rule asks of a witness. Says, for
 * each two engines, the largest of each figure and where it is.
 */
export function assertR2(t: TestContext, label: string, comparisons: ComparisonFile): R2Summary {
  const pairs = pairsOf(comparisons, "r2", RAYS_TRACE);
  assert.ok(pairs.length > 0);
  const verdicts: Record<string, number> = {};
  for (const pair of pairs) {
    const reason = pair.reason ?? "";
    const said = `${label}, ${pair.run}, ${pair.engines}: ${pair.verdict} ${reason}`;
    verdicts[`${pair.engines} ${pair.verdict}`] = (verdicts[`${pair.engines} ${pair.verdict}`] ?? 0) + 1;
    assert.ok(pair.verdict === "PASS" || pair.verdict === "FLOOR", said);
    assert.equal(pair.metrics["mask.mismatches"]?.value, 0, said);
    if (pair.verdict === "FLOOR") {
      // Only LensVisualizer has a floor, and the reason gives both figures.
      assert.ok(pair.engines.split(" / ").includes("lv"), said);
      assertFloorNamesItsWitness(R2, GEOMETRY, reason, said);
    }
    if (pair.engines === "optiland / ref") {
      // The arbiter and its witness: what the floor rule needs before it believes either.
      assert.equal(pair.verdict, "PASS", said);
      for (const name of GEOMETRY) {
        const value = pair.metrics[name]?.value;
        assert.ok(value !== null && value !== undefined && value <= AGREEMENT[name], `${said} ${name} ${value}`);
      }
    }
  }
  const counts = rayCounts(comparisons);
  for (const [engine, of] of Object.entries(counts)) {
    assert.equal(of.failed, 0, `${label}: ${engine} could not trace ${of.failed} rays`);
    assert.ok(of.ok > 0 && of.blocked > 0, `${label}: ${engine} ${JSON.stringify(of)}`);
  }
  const rimBand = pairs.reduce((total, pair) => total + (pair.metrics["mask.rimBand"]?.value ?? 0), 0);
  t.diagnostic(`${label}: ${JSON.stringify(verdicts)}; rays ${JSON.stringify(counts)}; rim band ${rimBand}`);
  for (const engines of [...new Set(pairs.map((pair) => pair.engines))].sort()) {
    const of = pairs.filter((pair) => pair.engines === engines);
    const compared = of.reduce((total, pair) => total + (pair.metrics["rays.compared"]?.value ?? 0), 0);
    const figures = GEOMETRY.map((name) => {
      const { value, at } = worstOf(of, name);
      return `${name} ${value} (${at})`;
    });
    t.diagnostic(`${label}, R2, ${engines}, ${of.length} pairs, ${compared} rays ok in both: ${figures.join("; ")}`);
  }
  return { pairs, verdicts, counts };
}

/** What `assertR3` found. */
export interface R3Summary {
  readonly pairs: readonly RungPair[];
  readonly verdicts: Readonly<Record<string, number>>;
  /** The ray sets whose path relative to the chief ray's was not measured, each once: the run and the request. */
  readonly withoutChief: readonly string[];
  /** The largest of each figure for each two engines, in waves, with the run, the line, the field and the ray. */
  readonly worst: Readonly<Record<string, Readonly<Record<string, { value: number; at: string }>>>>;
}

/** Why a pair of R3 has no path relative to a chief ray, as the comparator says it. */
const NO_CHIEF = /opd\.maxAbs was not measured: (the set has no chief ray|the chief ray is not ok in both answers)/;

/**
 * Holds every pair of a compared run to rung R3: PASS, or FLOOR where the policy allows one, never anything else.
 * The path to the last surface and the path to the image plane are measured in every pair; the path relative to
 * the chief ray's is measured wherever the set has a chief ray that every engine landed, and where it is not, the
 * pair says why and is judged on the other two. A pair of optiland and the reference engine is held to more: the
 * 1e-7 waves the floor rule asks of a witness, in every figure it has. A floor is LensVisualizer's, and with
 * optiland in the comparison its reason names what optiland is off the reference engine by.
 *
 * Says, for each two engines, the largest of each figure and where it is: the run, the line, the field, the ray.
 */
export function assertR3(t: TestContext, label: string, comparisons: ComparisonFile): R3Summary {
  const pairs = pairsOf(comparisons, "r3", RAYS_TRACE);
  assert.ok(pairs.length > 0);
  const three = new Set(pairs.flatMap((pair) => pair.engines.split(" / "))).has("lv");
  const verdicts: Record<string, number> = {};
  const withoutChief = new Set<string>();
  for (const pair of pairs) {
    const reason = pair.reason ?? "";
    const said = `${label}, ${pair.run}, ${pair.engines}: ${pair.verdict} ${reason}`;
    verdicts[`${pair.engines} ${pair.verdict}`] = (verdicts[`${pair.engines} ${pair.verdict}`] ?? 0) + 1;
    assert.ok(pair.verdict === "PASS" || pair.verdict === "FLOOR", said);
    const measured = PATHS.filter((name) => pair.metrics[name] !== undefined);
    assert.deepEqual(measured.slice(0, 2), PATHS.slice(0, 2), said);
    if (measured.length < PATHS.length) {
      assert.match(reason, NO_CHIEF, said);
      withoutChief.add(`${pair.run} ${pair.requestId}`);
    }
    for (const name of measured) assert.ok(pair.metrics[name].value !== null, `${said}: ${name} is not finite`);
    if (pair.verdict === "FLOOR") {
      // Only LensVisualizer has a floor; beside ref alone there is no witness to name.
      assert.ok(pair.engines.split(" / ").includes("lv"), said);
      if (three) assertFloorNamesItsWitness(R3, measured, reason, said);
    }
    if (pair.engines === "optiland / ref") {
      // The arbiter and its witness: the paths of two engines that share no code, to a thousandth of the gate.
      assert.equal(pair.verdict, "PASS", said);
      for (const name of measured) {
        const value = pair.metrics[name].value;
        assert.ok(value !== null && value <= AGREEMENT[name], `${said} ${name} ${value}`);
      }
    }
  }
  t.diagnostic(
    `${label}: ${JSON.stringify(verdicts)}; ${withoutChief.size} ray sets without a chief ray that every engine landed`,
  );
  const worst: Record<string, Record<string, { value: number; at: string }>> = {};
  for (const engines of [...new Set(pairs.map((pair) => pair.engines))].sort()) {
    const of = pairs.filter((pair) => pair.engines === engines);
    worst[engines] = {};
    const figures = PATHS.map((name) => {
      const has = of.filter((pair) => pair.metrics[name] !== undefined);
      if (has.length === 0) return `${name} not measured`;
      worst[engines][name] = worstOf(has, name);
      return `${name} ${worst[engines][name].value} (${worst[engines][name].at})`;
    });
    t.diagnostic(`${label}, R3, ${engines}, ${of.length} pairs, waves: ${figures.join("; ")}`);
  }
  return { pairs, verdicts, withoutChief: [...withoutChief].sort(), worst };
}

// ── The contract's cases and systems made for the rungs: optiland against the reference engine ───────────────────

const AIR = 1;
const GLASS = 1.5;
const PLANE: SurfaceShape = { kind: "plane" };

/**
 * Systems that put to the test what a trace of given rays must get right beside a lens: a surface that lies behind
 * the one before it, where the ray steps backwards and its path grows shorter; a surface that reflects totally; a
 * central obstruction; even and odd aspheres, one on a flat base; a finite object; a second line; and, for the
 * optical path, where a case ends: in a rear plate, on the rear face of one, and in a medium that is not air. The
 * reference engine's own proof is analytic (test/engines/ref), and the worker's rays and paths are held to closed
 * forms and to a trace in 60 digits by its own tests (workers/python/tests/optiland/test_trace.py, test_path.py):
 * here the two are set against each other.
 */
export const SYSTEMS: Readonly<Record<string, readonly [surfaces: readonly SurfaceOf[], more?: SystemOf]>> = {
  plate: [
    [
      { z: 0, shape: PLANE, index: GLASS },
      { z: 6, shape: PLANE, index: AIR },
    ],
  ],
  "plane-set-into-a-curve": [
    [
      { z: 0, shape: sphere(10), index: GLASS, semiDiameter: 6 },
      { z: 0.5, shape: PLANE, index: AIR, semiDiameter: 6 },
      { z: 4, shape: sphere(-30), index: AIR, semiDiameter: 6 },
    ],
    { stopIndex: 1 },
  ],
  "sphere-set-into-a-curve": [
    [
      { z: 0, shape: sphere(10), index: GLASS, semiDiameter: 6 },
      { z: 0.3, shape: sphere(-50), index: AIR, semiDiameter: 6 },
    ],
  ],
  "asphere-set-into-a-curve": [
    [
      { z: 0, shape: sphere(10), index: GLASS, semiDiameter: 6 },
      {
        z: 0.3,
        shape: { kind: "asphere", radius: -50, conic: 0, terms: [{ power: 4, coeff: 1e-5 }] },
        index: AIR,
        semiDiameter: 6,
      },
    ],
  ],
  "hemisphere-out-of-glass": [
    [
      { z: 0, shape: PLANE, index: GLASS, semiDiameter: 9.5 },
      { z: 10, shape: sphere(-10), index: AIR, semiDiameter: 9.5 },
    ],
  ],
  annulus: [
    [
      { z: 0, shape: sphere(50), index: GLASS },
      { z: 4, shape: sphere(-50), index: AIR },
      { z: 9, shape: PLANE, index: AIR, semiDiameter: 8, innerSemiDiameter: 2.5 },
    ],
    { stopIndex: 2 },
  ],
  "even-and-odd-aspheres": [
    [
      {
        z: 0,
        shape: {
          kind: "asphere",
          radius: 30,
          conic: -0.7,
          terms: [
            { power: 4, coeff: 2e-5 },
            { power: 6, coeff: -3e-8 },
            { power: 8, coeff: 1e-11 },
          ],
        },
        index: GLASS,
        semiDiameter: 9,
      },
      {
        z: 5,
        shape: {
          kind: "asphere",
          radius: -40,
          conic: 0.3,
          terms: [
            { power: 3, coeff: 1e-5 },
            { power: 4, coeff: -2e-6 },
            { power: 5, coeff: 1e-8 },
          ],
        },
        index: AIR,
        semiDiameter: 9,
      },
      {
        z: 9,
        shape: {
          kind: "asphere",
          radius: null,
          conic: 0,
          terms: [
            { power: 4, coeff: -3e-5 },
            { power: 6, coeff: 2e-8 },
          ],
        },
        index: GLASS,
        semiDiameter: 9,
      },
      { z: 11, shape: PLANE, index: AIR, semiDiameter: 9 },
    ],
  ],
  "finite-object": [
    [
      { z: 0, shape: sphere(50), index: GLASS },
      { z: 4, shape: sphere(-50), index: AIR },
    ],
    { objectZ: -200 },
  ],
  "two-lines": [
    [
      { z: 0, shape: sphere(50), index: [1.5168, 1.5224] },
      { z: 4, shape: sphere(-50), index: AIR },
    ],
    { lines: 2 },
  ],
};

/**
 * Systems that differ in where a ray's path ends, which rung R3 measures and R2 does not: a cover glass behind the
 * lens that the case marks as a rear plate, with the image plane behind it and on its rear face, and an image
 * space of another index than air's.
 */
export const PATH_SYSTEMS: Readonly<Record<string, readonly [surfaces: readonly SurfaceOf[], more?: SystemOf]>> = {
  "rear-plate": [
    [
      { z: 0, shape: sphere(50), index: GLASS },
      { z: 4, shape: sphere(-50), index: AIR },
      { z: 40, shape: PLANE, index: 1.5168, synthetic: "rearPlate" },
      { z: 41, shape: PLANE, index: AIR, synthetic: "rearPlate" },
    ],
    { imageZ: 49.5 },
  ],
  "image-on-the-rear-face-of-a-plate": [
    [
      { z: 0, shape: sphere(50), index: GLASS },
      { z: 4, shape: sphere(-50), index: AIR },
      { z: 47, shape: PLANE, index: 1.5168, synthetic: "rearPlate" },
      { z: 48, shape: PLANE, index: AIR, synthetic: "rearPlate" },
    ],
    { imageZ: 48 },
  ],
  "immersed-image-space": [
    [
      { z: 0, shape: sphere(50), index: GLASS },
      { z: 4, shape: sphere(-50), index: 1.33 },
    ],
    { imageZ: 60 },
  ],
};

// ── What optiland stored ─────────────────────────────────────────────────────────────────────────────────────────

/** The pairs of a compared run, each by its ray set (the run and the request) and its two engines. */
export function figuresOf(pairs: readonly RungPair[]): Map<string, RungPair> {
  return new Map(pairs.map((pair) => [`${pair.run} ${pair.requestId} ${pair.engines}`, pair]));
}

/** The stored answer of each ray set that optiland gave on a rung of traced rays in a run, by request id. */
export function optilandAnswers(cycle: RunCycle, rung: "r2" | "r3" = "r2"): Map<string, RaysTraceData> {
  const answers = new Map<string, RaysTraceData>();
  for (const job of cycle.manifest.jobs) {
    if (job.engine !== "optiland" || job.rung !== rung || job.storeKey === null) continue;
    const stored = JSON.parse(readFileSync(join(cycle.runsDir, STORE_DIRECTORY, `${job.storeKey}.json`), "utf8"));
    answers.set(`${job.run} ${job.requestId}`, stored.result.data as RaysTraceData);
  }
  return answers;
}
