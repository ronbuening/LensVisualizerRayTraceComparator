// The comparator of `rays.trace` for rung R3: the optical path of the same rays in two engines, in waves of the line
// they were traced at, and the path relative to the chief ray's.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric, UnmeasuredMetric } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { raysPathComparator } from "../../src/compare/raysPath.ts";
import type { RaysTraceData } from "../../src/contract/quantities/raysTrace.ts";
import { BASE, CHIEF, LENS, SPEC, WAVE_MM, changed, specAt, stopAt, tracer } from "./raysSupport.ts";

const R3 = loadPolicy().rungs.r3;
const CONTEXT: ComparisonContext = { spec: SPEC, opticalCase: LENS };
const PLACE = { line: 0, field: 0 };
/** One wave of the first line, mm: 587.5618 nm. */
const WAVE = WAVE_MM[0];

function compared(a: RaysTraceData, b: RaysTraceData, context: ComparisonContext = CONTEXT) {
  const outcome = raysPathComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(raysPathComparator.compare(b, a, context), outcome, "swapping the two changes nothing");
  const metrics: Record<string, ComputedMetric> = Object.fromEntries(
    outcome.metrics.map((metric) => [metric.name, metric]),
  );
  const unmeasured: readonly UnmeasuredMetric[] = outcome.unmeasured ?? [];
  return { metrics, unmeasured };
}

function judged(a: RaysTraceData, b: RaysTraceData, context: ComparisonContext = CONTEXT) {
  return comparePair(tracer("ref", a), tracer("other", b), R3, raysPathComparator, undefined, context);
}

/**
 * Asserts that a metric is `expected` waves. A path of some 70 mm is a multiple of 1.4e-14 mm, so a change of it by
 * a few nanometres is the change asked for to a few parts in a million: 1e-10 waves is what that leaves open.
 */
function waves(metric: ComputedMetric, expected: number): void {
  assert.ok(Math.abs(metric.value - expected) <= 1e-10, `${metric.name}: ${metric.value} against ${expected}`);
}

test("the comparator is of rays.trace for rung r3, and reports three metrics in waves", () => {
  assert.equal(raysPathComparator.quantity, "rays.trace");
  assert.equal(raysPathComparator.rung, "r3");
  assert.equal(COMPARATORS.get("rays.trace", "r3"), raysPathComparator);
  assert.deepEqual(raysPathComparator.metrics, [
    { name: "opticalPath.maxAbs", unit: "waves" },
    { name: "opticalPathToImage.maxAbs", unit: "waves" },
    { name: "opd.maxAbs", unit: "waves" },
  ]);
  // It lists nothing beside the comparison: the rays of each engine are counted once, with rung r2.
  assert.equal(raysPathComparator.recorded, undefined);
  assert.equal(WAVE, 587.5618e-6);
});

test("an answer against itself differs by nothing, at the first ray", () => {
  const { metrics, unmeasured } = compared(BASE, structuredClone(BASE));
  assert.deepEqual(unmeasured, []);
  for (const name of ["opticalPath.maxAbs", "opticalPathToImage.maxAbs", "opd.maxAbs"]) {
    assert.deepEqual(metrics[name], { name, value: 0, where: { ...PLACE, ray: 0 } });
  }
  assert.equal(judged(BASE, BASE).verdict, "PASS");
});

test("a path is compared in waves of the line it was traced at: 1e-9 mm is 1.7e-6 waves at 587.56 nm", () => {
  const longer = changed(BASE, (arrays) => {
    arrays.opticalPath[2] += 1e-9;
    arrays.opticalPath[3] -= 4e-9;
    arrays.opticalPathToImage[1] += 2e-9;
  });
  const { metrics } = compared(BASE, longer);
  waves(metrics["opticalPath.maxAbs"], 4e-9 / WAVE);
  assert.deepEqual(metrics["opticalPath.maxAbs"].where, { ...PLACE, ray: 3 });
  waves(metrics["opticalPathToImage.maxAbs"], 2e-9 / WAVE);
  assert.deepEqual(metrics["opticalPathToImage.maxAbs"].where, { ...PLACE, ray: 1 });
  // Against the chief ray's path, which did not change, ray 1 is as far off as its path to the image is.
  waves(metrics["opd.maxAbs"], 2e-9 / WAVE);
  assert.equal(judged(BASE, longer).verdict, "PASS");

  // The same answers at the second line of the case, 537.56 nm, are more waves apart.
  const second = compared(BASE, longer, { spec: specAt(1), opticalCase: LENS }).metrics;
  waves(second["opticalPath.maxAbs"], 4e-9 / WAVE_MM[1]);
  assert.deepEqual(second["opticalPath.maxAbs"].where, { line: 1, field: 0, ray: 3 });
  assert.ok(second["opticalPath.maxAbs"].value > metrics["opticalPath.maxAbs"].value);
});

test("a gate of 2e-5 waves: 1.1e-8 mm of path is inside it at this line, and 1.3e-8 mm is outside", () => {
  assert.ok(1.1e-8 / WAVE < 2e-5 && 1.3e-8 / WAVE > 2e-5);
  for (const member of ["opticalPath", "opticalPathToImage"] as const) {
    const inside = changed(BASE, (arrays) => void (arrays[member][0] += 1.1e-8));
    assert.equal(judged(BASE, inside).verdict, "PASS", member);
    const outside = changed(BASE, (arrays) => void (arrays[member][0] += 1.3e-8));
    const pair = judged(BASE, outside);
    assert.equal(pair.verdict, "FAIL", member);
    assert.match(
      pair.reason ?? "",
      new RegExp(`${member}\\.maxAbs 2\\.21e-5 exceeds its tolerance 2\\.00e-5 at field 0, line 0, ray 0`),
    );
  }
});

test("the path relative to the chief ray's cancels what two engines differ by on every ray alike", () => {
  // One engine measures every path from 2.5e-7 mm further back: half a wave more on every ray, the chief included.
  const shifted = changed(BASE, (arrays) => {
    for (let ray = 0; ray < arrays.rays; ray++) arrays.opticalPathToImage[ray] += 2.5e-7;
  });
  const { metrics } = compared(BASE, shifted);
  waves(metrics["opticalPathToImage.maxAbs"], 2.5e-7 / WAVE);
  // Each ray's path is rounded where it is, so what is left of the shift is a few units of the paths' last place.
  assert.ok(metrics["opd.maxAbs"].value < 1e-9, String(metrics["opd.maxAbs"].value));
  // The raw path fails its gate, and the relative one alone would pass: both are judged.
  const pair = judged(BASE, shifted);
  assert.equal(pair.verdict, "FAIL");
  assert.match(pair.reason ?? "", /^opticalPathToImage\.maxAbs 4\.25e-4 exceeds its tolerance 2\.00e-5 at /);
  assert.ok(!(pair.reason ?? "").includes("opd.maxAbs"));

  // A difference on the chief ray alone is a difference of every other ray against it.
  const chiefOff = changed(BASE, (arrays) => void (arrays.opticalPathToImage[CHIEF] += 3e-9));
  const off = compared(BASE, chiefOff).metrics;
  waves(off["opd.maxAbs"], 3e-9 / WAVE);
  // The chief ray against itself is 0, so the first of the others is where it is largest.
  assert.deepEqual(off["opd.maxAbs"].where, { ...PLACE, ray: 0 });
  assert.deepEqual(off["opticalPathToImage.maxAbs"].where, { ...PLACE, ray: CHIEF });
  // W = path(chief) - path(ray): a ray 5e-9 mm longer in one engine, with the chief 2e-9 mm longer, is 3e-9 off.
  const both = changed(BASE, (arrays) => {
    arrays.opticalPathToImage[CHIEF] += 2e-9;
    arrays.opticalPathToImage[2] += 5e-9;
  });
  const mixed = compared(BASE, both).metrics;
  waves(mixed["opd.maxAbs"], 3e-9 / WAVE);
  assert.deepEqual(mixed["opd.maxAbs"].where, { ...PLACE, ray: 2 });
});

test("without a chief ray that is ok in both, the relative path is not measured, and nothing fails for it", () => {
  // The chief ray stopped in one engine.
  const lost = changed(BASE, (arrays) => stopAt(arrays, CHIEF, 3));
  const blocked = compared(BASE, lost);
  assert.deepEqual(Object.keys(blocked.metrics), ["opticalPath.maxAbs", "opticalPathToImage.maxAbs"]);
  assert.deepEqual(blocked.unmeasured, [{ name: "opd.maxAbs", reason: "the chief ray is not ok in both answers" }]);
  const pair = judged(BASE, lost);
  assert.equal(pair.verdict, "PASS");
  assert.equal(pair.reason, "opd.maxAbs was not measured: the chief ray is not ok in both answers");
  // The raw paths are still judged: a difference there fails as ever, and the reason says both.
  const longer = changed(lost, (arrays) => void (arrays.opticalPath[1] += 1e-7));
  const failed = judged(BASE, longer);
  assert.equal(failed.verdict, "FAIL");
  assert.match(
    failed.reason ?? "",
    /^opticalPath\.maxAbs 1\.70e-4 exceeds its tolerance 2\.00e-5 at field 0, line 0, ray 1; opd\.maxAbs was not measured: /,
  );

  // A set that states no chief ray.
  const { groups: _groups, ...plain } = SPEC;
  const without = compared(BASE, BASE, { spec: { ...plain, groups: { field: { angleDeg: 0 } } }, opticalCase: LENS });
  assert.deepEqual(without.unmeasured, [{ name: "opd.maxAbs", reason: "the set has no chief ray" }]);
  assert.deepEqual(compared(BASE, BASE, { spec: plain, opticalCase: LENS }).unmeasured, without.unmeasured);
});

test("a ray that is not ok in both has no path in one answer: that is rung R2's matter, and R3 passes it by", () => {
  // Ray 3 stopped in one engine; its path there is NaN.
  const stopped = changed(BASE, (arrays) => stopAt(arrays, 3, 2));
  const { metrics, unmeasured } = compared(BASE, stopped);
  assert.deepEqual(unmeasured, []);
  for (const metric of Object.values(metrics)) assert.equal(metric.value, 0, metric.name);
  assert.equal(judged(BASE, stopped).verdict, "PASS");
  // A ray that passed every surface and does not land has a path to the last surface and none to the image.
  const unlanded = changed(BASE, (arrays) => stopAt(arrays, 0, arrays.surfaces));
  for (const metric of Object.values(compared(BASE, unlanded).metrics)) assert.equal(metric.value, 0);
  // No ray in common: nothing is measured, and the pair says so.
  const none = changed(BASE, (arrays) => {
    for (const ray of [0, 1, 2, 3, CHIEF]) stopAt(arrays, ray, 1);
  });
  const empty = compared(BASE, none);
  assert.deepEqual(empty.metrics, {});
  assert.deepEqual(
    empty.unmeasured.map((metric) => `${metric.name}: ${metric.reason}`),
    ["opticalPath.maxAbs", "opticalPathToImage.maxAbs", "opd.maxAbs"].map(
      (name) => `${name}: no ray is ok in both answers`,
    ),
  );
  const pair = judged(BASE, none);
  assert.deepEqual([pair.verdict, pair.metrics], ["PASS", []]);
  assert.match(pair.reason ?? "", /^opd\.maxAbs was not measured: no ray is ok in both answers; opticalPath\.maxAbs /);
});

test("a path that is not a number on a ray both engines call ok is a NaN, which no gate admits", () => {
  const broken = changed(BASE, (arrays) => void (arrays.opticalPath[1] = NaN));
  const { metrics } = compared(BASE, broken);
  assert.ok(Number.isNaN(metrics["opticalPath.maxAbs"].value));
  assert.deepEqual(metrics["opticalPath.maxAbs"].where, { ...PLACE, ray: 1 });
  assert.equal(judged(BASE, broken).verdict, "FAIL");
  assert.equal(judged(BASE, broken).reason, "opticalPath.maxAbs is NaN at field 0, line 0, ray 1");
});

test("no two answers are comparable without the request and its case, which name the line and its wavelength", () => {
  const reasonOf = (context?: ComparisonContext, b: RaysTraceData = BASE): string => {
    const outcome = raysPathComparator.compare(BASE, b, context);
    assert.equal(outcome.comparable, false);
    return outcome.comparable ? "" : outcome.reason;
  };
  const without = "the request and its case are not at hand: a path is measured in waves of the request's line";
  assert.equal(reasonOf(undefined), without);
  assert.equal(reasonOf({ spec: SPEC }), without);
  assert.equal(reasonOf({ opticalCase: LENS }), without);
  assert.equal(reasonOf({ spec: specAt(2), opticalCase: LENS }), "the request is for line 2, and the case has 2");
  const pair = comparePair(tracer("a", BASE), tracer("b", BASE), R3, raysPathComparator);
  assert.deepEqual([pair.verdict, pair.reason], ["ERROR", without]);
});
