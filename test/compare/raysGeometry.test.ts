// The comparator of `rays.trace` for rung R2: the distance between two engines' hits, directions and landings on
// the rays both passed, and which rays one of them stopped that the other let through.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric, UnmeasuredMetric } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { NO_COMMON_RAY, raysGeometryComparator } from "../../src/compare/raysGeometry.ts";
import { RIM_BAND_MM } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData } from "../../src/contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import { SINGLET_CASE } from "../contract/corpus.ts";
import { DOUBLE_GAUSS } from "../core/support.ts";
import {
  BASE,
  CHIEF,
  INNER_CLIP,
  LENS,
  SPEC,
  STOP_CLIP,
  changed,
  hitAt,
  hitRadius,
  stopAt,
  traceOf,
  tracer,
} from "./raysSupport.ts";

const R2 = loadPolicy().rungs.r2;
const CONTEXT: ComparisonContext = { spec: SPEC, opticalCase: LENS };
/** Where every metric of `SPEC` occurs: the first line, on the axis. */
const PLACE = { line: 0, field: 0 };

/** The metrics of two answers by name, and what was not measured; fails the test when they are not comparable. */
function compared(a: RaysTraceData, b: RaysTraceData, context: ComparisonContext = CONTEXT) {
  const outcome = raysGeometryComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(raysGeometryComparator.compare(b, a, context), outcome, "swapping the two changes nothing");
  const metrics: Record<string, ComputedMetric> = Object.fromEntries(
    outcome.metrics.map((metric) => [metric.name, metric]),
  );
  const unmeasured: readonly UnmeasuredMetric[] = outcome.unmeasured ?? [];
  return { metrics, unmeasured };
}

function judged(a: RaysTraceData, b: RaysTraceData) {
  return comparePair(tracer("ref", a), tracer("other", b), R2, raysGeometryComparator, undefined, CONTEXT);
}

test("the comparator is of rays.trace for rung r2, and reports six metrics", () => {
  assert.equal(raysGeometryComparator.quantity, "rays.trace");
  assert.equal(raysGeometryComparator.rung, "r2");
  assert.equal(COMPARATORS.get("rays.trace", "r2"), raysGeometryComparator);
  assert.deepEqual(raysGeometryComparator.metrics, [
    { name: "hits.maxDistance", unit: "mm" },
    { name: "direction.maxAbs", unit: "1" },
    { name: "landing.maxDistance", unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
  ]);
  assert.equal(RIM_BAND_MM, 1e-8);
  // The base is a valid answer in which five rays are ok and two are stopped, at the stop and at the first surface.
  assert.deepEqual(raysTraceQuantity.validateData(BASE), []);
  assert.deepEqual(raysGeometryComparator.recorded?.(BASE), {
    "rays.ok": [5],
    "rays.blocked": [2],
    "rays.failed": [0],
  });
});

test("an answer against itself differs by nothing, at the first ray and the first surface", () => {
  const { metrics, unmeasured } = compared(BASE, structuredClone(BASE));
  assert.deepEqual(unmeasured, []);
  assert.deepEqual(metrics, {
    "hits.maxDistance": { name: "hits.maxDistance", value: 0, where: { ...PLACE, ray: 0, surface: 0 } },
    "direction.maxAbs": { name: "direction.maxAbs", value: 0, where: { ...PLACE, ray: 0 } },
    "landing.maxDistance": { name: "landing.maxDistance", value: 0, where: { ...PLACE, ray: 0 } },
    // A count of nothing occurs nowhere.
    "mask.mismatches": { name: "mask.mismatches", value: 0 },
    "mask.rimBand": { name: "mask.rimBand", value: 0 },
    "rays.compared": { name: "rays.compared", value: 5 },
  });
  assert.equal(judged(BASE, BASE).verdict, "PASS");
});

test("a hit is compared as a point: the distance, on the surface and the ray it is largest at", () => {
  // Ray 3 on surface 1, moved by (3, 4, 12) parts of 1e-9 mm: 13e-9 mm away. A smaller move elsewhere.
  const moved = changed(BASE, (arrays) => {
    arrays.hits[hitAt(arrays, 1, 3)] += 3 * 2 ** -30;
    arrays.hits[hitAt(arrays, 1, 3) + 1] -= 4 * 2 ** -30;
    arrays.hits[hitAt(arrays, 1, 3) + 2] += 12 * 2 ** -30;
    arrays.hits[hitAt(arrays, 4, 0) + 1] += 2 ** -30;
  });
  const { metrics } = compared(BASE, moved);
  const hits = metrics["hits.maxDistance"];
  assert.ok(Math.abs(hits.value - 13 * 2 ** -30) <= 2 ** -45, String(hits.value));
  assert.deepEqual(hits.where, { ...PLACE, ray: 3, surface: 1 });
  // Nothing else moved: the direction and the landing are what they were.
  assert.equal(metrics["direction.maxAbs"].value, 0);
  assert.equal(metrics["landing.maxDistance"].value, 0);
  // 1.2e-8 mm is above the gate of 1e-8 mm; 9.3e-10 mm, the smaller move alone, is below it.
  const failed = judged(BASE, moved);
  assert.equal(failed.verdict, "FAIL");
  assert.equal(
    failed.reason,
    "hits.maxDistance 1.21e-8 exceeds its tolerance 1.00e-8 at field 0, line 0, ray 3, surface 1",
  );
  const small = changed(BASE, (arrays) => void (arrays.hits[hitAt(arrays, 4, 0) + 1] += 2 ** -30));
  assert.equal(judged(BASE, small).verdict, "PASS");
  assert.deepEqual(compared(BASE, small).metrics["hits.maxDistance"].where, { ...PLACE, ray: 0, surface: 4 });
});

test("the direction is compared by component and the landing as a point, each on its own ray", () => {
  const turned = changed(BASE, (arrays) => {
    arrays.exitDirection[3 * 1 + 1] += 2 ** -29;
    arrays.exitDirection[3 * 2 + 2] -= 2 ** -31;
    arrays.imagePoint[3 * CHIEF] += 6 * 2 ** -30;
    arrays.imagePoint[3 * CHIEF + 1] += 8 * 2 ** -30;
  });
  const { metrics } = compared(BASE, turned);
  assert.deepEqual(metrics["direction.maxAbs"], {
    name: "direction.maxAbs",
    value: 2 ** -29,
    where: { ...PLACE, ray: 1 },
  });
  assert.ok(Math.abs(metrics["landing.maxDistance"].value - 10 * 2 ** -30) <= 2 ** -45);
  // The chief ray is a ray like any other: it is compared, at whatever weight it carries.
  assert.deepEqual(metrics["landing.maxDistance"].where, { ...PLACE, ray: CHIEF });
  // Every component of a direction counts, the one along the axis as much as the two across it.
  for (const axis of [0, 1, 2]) {
    const one = changed(BASE, (arrays) => void (arrays.exitDirection[3 * 3 + axis] -= 2 ** -28));
    const { value, where } = compared(BASE, one).metrics["direction.maxAbs"];
    assert.ok(Math.abs(value - 2 ** -28) <= 2 ** -60, `axis ${axis}: ${value}`);
    assert.deepEqual(where, { ...PLACE, ray: 3 });
  }
  const pair = judged(BASE, turned);
  assert.equal(pair.verdict, "FAIL");
  // 1.86e-9 is above the direction's gate of 1e-9; the landing, 9.31e-9 mm, is inside its 1e-8 mm.
  assert.equal(pair.reason, "direction.maxAbs 1.86e-9 exceeds its tolerance 1.00e-9 at field 0, line 0, ray 1");
  // The gates themselves: 2^-30 is 9.3e-10, inside; a landing 1.1e-8 mm off is outside.
  assert.equal(
    judged(
      BASE,
      changed(BASE, (arrays) => void (arrays.exitDirection[4] += 2 ** -30)),
    ).verdict,
    "PASS",
  );
  const landed = judged(
    BASE,
    changed(BASE, (arrays) => void (arrays.imagePoint[1] += 1.1e-8)),
  );
  assert.match(
    landed.reason ?? "",
    /^landing\.maxDistance 1\.10e-8 exceeds its tolerance 1\.00e-8 at field 0, line 0, ray 0$/,
  );
});

test("where a metric occurs says the line and the field of the set, when the request is at hand", () => {
  const moved = changed(BASE, (arrays) => void (arrays.hits[hitAt(arrays, 2, 2)] += 1e-9));
  const spec = { ...SPEC, line: 1, groups: { field: { angleDeg: 12.5, heightFraction: 0.5 } } };
  assert.deepEqual(compared(BASE, moved, { opticalCase: LENS, spec }).metrics["hits.maxDistance"].where, {
    line: 1,
    field: 12.5,
    ray: 2,
    surface: 2,
  });
  // A set that states no field, and a comparison without its request.
  const { groups: _groups, ...plain } = SPEC;
  assert.deepEqual(compared(BASE, moved, { opticalCase: LENS, spec: plain }).metrics["hits.maxDistance"].where, {
    line: 0,
    ray: 2,
    surface: 2,
  });
  assert.deepEqual(compared(BASE, moved, { opticalCase: LENS }).metrics["hits.maxDistance"].where, {
    ray: 2,
    surface: 2,
  });
});

test("a ray one engine stopped and the other passed is a mismatch, unless the hit lies in the rim band", () => {
  // Ray 3 passes the stop in the base. Another engine stops it there: where does the base say it hit the stop?
  const stoppedAtStop = (radius: number): { a: RaysTraceData; b: RaysTraceData } => ({
    a: changed(BASE, (arrays) => hitRadius(arrays, 2, 3, radius)),
    b: changed(BASE, (arrays) => stopAt(arrays, 3, 2)),
  });
  // Well inside the stop: one engine clipped a ray the other has in the clear. A mismatch, at that ray and surface.
  const inside = stoppedAtStop(2.5);
  assert.deepEqual(compared(inside.a, inside.b).metrics["mask.mismatches"], {
    name: "mask.mismatches",
    value: 1,
    where: { ...PLACE, ray: 3, surface: 2 },
  });
  assert.equal(compared(inside.a, inside.b).metrics["mask.rimBand"].value, 0);
  const failed = judged(inside.a, inside.b);
  assert.equal(failed.verdict, "FAIL");
  assert.equal(failed.reason, "mask.mismatches 1 exceeds its tolerance 0 at field 0, line 0, ray 3, surface 2");

  // Within 1e-8 mm of the clip radius, on either side of it: the rim band. Counted, shown, and not judged.
  for (const offset of [0, -4e-9, -9.9e-9, 4e-9, 9.9e-9]) {
    const rim = stoppedAtStop(STOP_CLIP + offset);
    const { metrics } = compared(rim.a, rim.b);
    assert.equal(metrics["mask.mismatches"].value, 0, `offset ${offset}`);
    assert.deepEqual(metrics["mask.rimBand"], {
      name: "mask.rimBand",
      value: 1,
      where: { ...PLACE, ray: 3, surface: 2 },
    });
    assert.equal(judged(rim.a, rim.b).verdict, "PASS", `offset ${offset}`);
  }
  // Just beyond the band, on either side: a mismatch again.
  for (const offset of [-1.1e-8, 1.1e-8, -1e-6]) {
    const beyond = stoppedAtStop(STOP_CLIP + offset);
    assert.equal(compared(beyond.a, beyond.b).metrics["mask.mismatches"].value, 1, `offset ${offset}`);
    assert.equal(compared(beyond.a, beyond.b).metrics["mask.rimBand"].value, 0, `offset ${offset}`);
  }
  // The ray is no longer one of those whose positions are compared.
  assert.equal(compared(inside.a, inside.b).metrics["rays.compared"].value, 4);
});

test("the band is of the surface the two part at: its clip radius, and the radius of its obstruction", () => {
  // Surface 3 has a clip radius of 8 mm and a central obstruction of 0.25 mm.
  const stoppedAtPlate = (radius: number): { a: RaysTraceData; b: RaysTraceData } => ({
    a: changed(BASE, (arrays) => hitRadius(arrays, 3, 0, radius)),
    b: changed(BASE, (arrays) => stopAt(arrays, 0, 3)),
  });
  const counts = (radius: number): number[] => {
    const { a, b } = stoppedAtPlate(radius);
    const { metrics } = compared(a, b);
    return [metrics["mask.mismatches"].value, metrics["mask.rimBand"].value];
  };
  assert.deepEqual(counts(INNER_CLIP - 5e-9), [0, 1]);
  assert.deepEqual(counts(INNER_CLIP + 5e-9), [0, 1]);
  assert.deepEqual(counts(INNER_CLIP + 2e-8), [1, 0]);
  assert.deepEqual(counts(8 - 5e-9), [0, 1]);
  assert.deepEqual(counts(4), [1, 0]);
  // The stop's 3 mm is another surface's radius: a hit at 3 mm on this plate is nowhere near a rim of it.
  assert.deepEqual(counts(STOP_CLIP), [1, 0]);
  // A surface without an obstruction has no band at its axis.
  const onAxis = {
    a: changed(BASE, (arrays) => hitRadius(arrays, 2, 0, 5e-9)),
    b: changed(BASE, (arrays) => stopAt(arrays, 0, 2)),
  };
  assert.equal(compared(onAxis.a, onAxis.b).metrics["mask.mismatches"].value, 1);
});

test("two engines that stopped a ray at different surfaces part at the first of the two", () => {
  // Ray 4 ends at the stop, surface 2, in the base. Another engine stops it at the first surface already.
  const earlier = changed(BASE, (arrays) => stopAt(arrays, 4, 0));
  const { metrics } = compared(BASE, earlier);
  // The base has its hit on the first surface, 4.5 mm from the axis: nowhere near that surface's rim.
  assert.deepEqual(metrics["mask.mismatches"], {
    name: "mask.mismatches",
    value: 1,
    where: { ...PLACE, ray: 4, surface: 0 },
  });
  // And one that let it through the stop and stopped it at the plate: the two part at the stop, where the base
  // stopped it. The other engine's hit there says whether that is the rim: here 4.5 mm on a stop of 3.
  const later = changed(BASE, (arrays) => {
    hitRadius(arrays, 2, 4, 4.5);
    arrays.hits[hitAt(arrays, 2, 4) + 2] = 7;
    stopAt(arrays, 4, 3);
  });
  assert.deepEqual(compared(BASE, later).metrics["mask.mismatches"].where, { ...PLACE, ray: 4, surface: 2 });
  const atRim = changed(later, (arrays) => hitRadius(arrays, 2, 4, STOP_CLIP + 2e-9));
  assert.deepEqual(
    [compared(BASE, atRim).metrics["mask.mismatches"].value, compared(BASE, atRim).metrics["mask.rimBand"].value],
    [0, 1],
  );
  // Both stopped it at one surface: no disagreement, whatever each would call the reason.
  assert.equal(compared(BASE, structuredClone(BASE)).metrics["mask.mismatches"].value, 0);
});

test("a ray that passed every surface in both and lands in only one is a mismatch, with no band to be in", () => {
  const surfaces = LENS.system.surfaces.length;
  const lost = changed(BASE, (arrays) => stopAt(arrays, 1, surfaces));
  assert.deepEqual(raysTraceQuantity.validateData(lost), []);
  const { metrics } = compared(BASE, lost);
  assert.deepEqual(metrics["mask.mismatches"], {
    name: "mask.mismatches",
    value: 1,
    where: { ...PLACE, ray: 1, surface: surfaces },
  });
  assert.equal(metrics["mask.rimBand"].value, 0);
});

test("a ray either engine failed is in no count: a failure says nothing about the light", () => {
  // Ray 3 failed in one engine at the stop, well inside it, where the other has it in the clear.
  const failedOne = changed(BASE, (arrays) => stopAt(arrays, 3, 2, "failed"));
  const { metrics } = compared(BASE, failedOne);
  assert.equal(metrics["mask.mismatches"].value, 0);
  assert.equal(metrics["mask.rimBand"].value, 0);
  assert.equal(metrics["rays.compared"].value, 4);
  assert.equal(judged(BASE, failedOne).verdict, "PASS");
  // It is counted where each engine's own rays are counted, beside the comparison.
  assert.deepEqual(raysGeometryComparator.recorded?.(failedOne), {
    "rays.ok": [4],
    "rays.blocked": [2],
    "rays.failed": [1],
  });
  // Failed in one and blocked in the other, at another surface: still in no count.
  const blockedOther = changed(BASE, (arrays) => stopAt(arrays, 3, 0));
  assert.equal(compared(blockedOther, failedOne).metrics["mask.mismatches"].value, 0);
});

test("several disagreements are counted, and the first of each kind is the one named", () => {
  const a = changed(BASE, (arrays) => {
    hitRadius(arrays, 2, 0, STOP_CLIP - 1e-9);
    hitRadius(arrays, 2, 2, STOP_CLIP - 2e-9);
  });
  const b = changed(BASE, (arrays) => {
    stopAt(arrays, 0, 2);
    stopAt(arrays, 1, 1);
    stopAt(arrays, 2, 2);
    stopAt(arrays, 3, 4);
  });
  const { metrics } = compared(a, b);
  assert.deepEqual(metrics["mask.rimBand"], {
    name: "mask.rimBand",
    value: 2,
    where: { ...PLACE, ray: 0, surface: 2 },
  });
  assert.deepEqual(metrics["mask.mismatches"], {
    name: "mask.mismatches",
    value: 2,
    where: { ...PLACE, ray: 1, surface: 1 },
  });
  assert.equal(metrics["rays.compared"].value, 1);
});

test("where no ray is ok in both, the positions are not measured, and the mask is judged all the same", () => {
  const none = changed(BASE, (arrays) => {
    for (const ray of [0, 1, 2, 3, CHIEF]) stopAt(arrays, ray, 0);
  });
  const { metrics, unmeasured } = compared(BASE, none);
  assert.deepEqual(Object.keys(metrics), ["mask.mismatches", "mask.rimBand", "rays.compared"]);
  assert.equal(metrics["rays.compared"].value, 0);
  assert.equal(metrics["mask.mismatches"].value, 5);
  assert.deepEqual(
    unmeasured,
    ["hits.maxDistance", "direction.maxAbs", "landing.maxDistance"].map((name) => ({ name, reason: NO_COMMON_RAY })),
  );
  // Two engines that both stopped every ray agree: a pass, which says what it could not measure.
  const pair = judged(none, none);
  assert.equal(pair.verdict, "PASS");
  assert.equal(
    pair.reason,
    ["direction.maxAbs", "hits.maxDistance", "landing.maxDistance"]
      .map((name) => `${name} was not measured: no ray is ok in both answers`)
      .join("; "),
  );
  assert.deepEqual(
    pair.metrics.map((metric) => metric.name),
    ["mask.mismatches", "mask.rimBand", "rays.compared"],
  );
});

test("a NaN where a ray is ok in both is never hidden: the metric is a NaN, and the pair fails", () => {
  const broken = changed(BASE, (arrays) => {
    arrays.hits[hitAt(arrays, 1, 1) + 2] = NaN;
    arrays.hits[hitAt(arrays, 3, 2)] += 1;
    arrays.imagePoint[3 * 3 + 1] = NaN;
  });
  const { metrics } = compared(BASE, broken);
  assert.ok(Number.isNaN(metrics["hits.maxDistance"].value));
  assert.deepEqual(metrics["hits.maxDistance"].where, { ...PLACE, ray: 1, surface: 1 });
  assert.ok(Number.isNaN(metrics["landing.maxDistance"].value));
  assert.equal(metrics["direction.maxAbs"].value, 0);
  const pair = judged(BASE, broken);
  assert.equal(pair.verdict, "FAIL");
  assert.match(pair.reason ?? "", /^hits\.maxDistance is NaN at .*; landing\.maxDistance is NaN at /);
  assert.equal(pair.metrics.find((metric) => metric.name === "hits.maxDistance")?.value, null);
});

test("answers of other rays or surfaces are not comparable, and no two answers are without their case", () => {
  const reasonOf = (a: RaysTraceData, b: RaysTraceData, context?: ComparisonContext): string => {
    const outcome = raysGeometryComparator.compare(a, b, context);
    assert.equal(outcome.comparable, false);
    return outcome.comparable ? "" : outcome.reason;
  };
  // The trace of two of the rays through the same lens, and of all of them through a lens of two surfaces.
  const two = traceOf({
    line: 0,
    origins: encodeNdArray(Float64Array.of(0, 1, -10, 0, 2, -10), [2, 3]),
    directions: encodeNdArray(Float64Array.of(0, 0, 1, 0, 0, 1), [2, 3]),
    weights: encodeNdArray(Float64Array.of(1, 1)),
  });
  assert.equal(reasonOf(BASE, two, CONTEXT), "the answers are for different numbers of rays: 7 and 2");
  const singlet = traceOf(SPEC, SINGLET_CASE);
  assert.equal(reasonOf(BASE, singlet, CONTEXT), "the answers are for different numbers of surfaces: 5 and 2");
  assert.equal(reasonOf(BASE, BASE), "the case is not at hand: its clip radii say which rays lie in the rim band");
  assert.equal(
    reasonOf(BASE, BASE, { spec: SPEC }),
    "the case is not at hand: its clip radii say which rays lie in the rim band",
  );
  assert.equal(
    reasonOf(BASE, BASE, { spec: SPEC, opticalCase: DOUBLE_GAUSS }),
    "the answers are for 5 surfaces, and the case has 11",
  );
  const pair = comparePair(tracer("a", BASE), tracer("b", BASE), R2, raysGeometryComparator);
  assert.deepEqual([pair.verdict, pair.metrics.length], ["ERROR", 0]);
});
