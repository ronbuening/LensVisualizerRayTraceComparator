// The comparator of `rays.trace` for rung R11a, on the reference engine's trace of vignetting sets through a small lens
// (a sweep of three fields, and the lattices of two), and on copies of it with a direction turned, a ray stopped, a
// ray failed, a ray stopped at the rim, and the members handed over in another order. Every number is synthetic; what a lattice brings into the image is the
// estimator's, whose proofs are test/estimators/illumination.test.ts.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { raysVignettingComparator, sweepBlocks } from "../../src/compare/raysVignetting.ts";
import type { SpanAnswer } from "../../src/compare/span.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { cosineFlux } from "../../src/estimators/illumination.ts";
import { LENS, STOP_CLIP, changed, hitRadius, stopAt, traceOf } from "./raysSupport.ts";

/** The unit direction of a field of `angleDeg` toward +y, from z = -10. */
function directionOf(angleDeg: number): [number, number, number] {
  const radians = (angleDeg * Math.PI) / 180;
  return [0, -Math.sin(radians), Math.cos(radians)];
}

/** Where a ray of a field crosses z = -10 to cross z = 7, the stop, at (x, y). */
function startOf(angleDeg: number, x: number, y: number): [number, number, number] {
  const [, m, n] = directionOf(angleDeg);
  return [x, y - (17 * m) / n, -10];
}

/** A sweep of fields, each 16 rays across y from -3.75 to 3.75 at the stop, in one set. */
function sweepSpec(angles: readonly number[], line = 0): RaysTraceSpec {
  const ys = Array.from({ length: 16 }, (_, at) => -3.75 + at * 0.5);
  const origins = angles.flatMap((angle) => ys.flatMap((y) => startOf(angle, 0, y)));
  const directions = angles.flatMap((angle) => ys.flatMap(() => directionOf(angle)));
  const rays = origins.length / 3;
  return {
    line,
    origins: encodeNdArray(Float64Array.from(origins), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(directions), [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1)),
  };
}

/** A lattice of 10 x 10 cells of 0.75 mm over the stop at a field, the chief ray after them, as a lattice set. */
function latticeSpec(angle: number, line = 0): RaysTraceSpec {
  const [columns, rows, step] = [10, 10, 0.75];
  const origins: number[] = [];
  const directions: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      origins.push(...startOf(angle, -3.75 + (column + 0.5) * step, -3.75 + (row + 0.5) * step));
      directions.push(...directionOf(angle));
    }
  }
  origins.push(...startOf(angle, 0.05, 0.05));
  directions.push(...directionOf(angle));
  const rays = columns * rows + 1;
  const weights = new Float64Array(rays).fill(1);
  weights[rays - 1] = 0;
  return {
    line,
    origins: encodeNdArray(Float64Array.from(origins), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(directions), [rays, 3]),
    weights: encodeNdArray(weights),
    groups: { field: { angleDeg: angle }, lattice: { columns, rows, step }, chiefIndex: rays - 1 },
  };
}

const SWEEP = sweepSpec([0, 3, 6]);
const LATTICES = [latticeSpec(0), latticeSpec(4)];
const CONTEXT = { spec: SWEEP as unknown as JsonObject, opticalCase: LENS };

/** A span answer of the specs, each traced by the reference engine, with the answers changed by `change`. */
function spanOf(
  specs: readonly RaysTraceSpec[],
  change: (data: RaysTraceData, at: number) => RaysTraceData = (d) => d,
) {
  return {
    members: specs.map((spec, at) => ({
      requestId: `request-${at}`,
      spec: spec as unknown as JsonObject,
      data: change(traceOf(spec), at) as unknown as JsonObject,
    })),
  } satisfies SpanAnswer;
}

function compared(a: SpanAnswer, b: SpanAnswer, context: object = CONTEXT): ComparatorOutcome {
  return raysVignettingComparator.compare(a as unknown as JsonObject, b as unknown as JsonObject, context);
}

/** Two span answers judged by the policy of R11a, with the case at hand. */
function judged(a: SpanAnswer, b: SpanAnswer) {
  const participant = (engine: string, data: SpanAnswer) => ({
    engine,
    fingerprint: `${engine} sources`,
    status: "ok" as const,
    data: data as unknown as JsonObject,
  });
  return comparePair(
    participant("ref", a),
    participant("lv", b),
    loadPolicy().rungs.r11a,
    raysVignettingComparator,
    undefined,
    CONTEXT,
  );
}

function metric(outcome: ComparatorOutcome, name: string): ComputedMetric | undefined {
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  return outcome.metrics.find((each) => each.name === name);
}

/** The flux of a lattice's lit cells into the image in an answer, of the rays ok in both answers. */
function fluxOf(spec: RaysTraceSpec, data: RaysTraceData, valid: Uint8Array): number {
  const { columns, rows, step } = spec.groups!.lattice!;
  const made = cosineFlux({
    columns,
    rows,
    step,
    weight: decodeNdArray(spec.weights).values as Float64Array,
    valid,
    point: decodeNdArray(data.imagePoint).values as Float64Array,
    direction: decodeNdArray(data.exitDirection).values as Float64Array,
    imageIndex: 1,
  });
  assert.ok(made.available);
  return made.flux;
}

function statusOf(data: RaysTraceData): Uint8Array {
  return decodeNdArray(data.status).values as Uint8Array;
}

test("the fields of a sweep are its blocks of one direction, the axis first; the spans are of a pattern and a line", () => {
  assert.deepEqual(sweepBlocks(SWEEP), [
    { first: 0, end: 16 },
    { first: 16, end: 32 },
    { first: 32, end: 48 },
  ]);
  const span = (spec: RaysTraceSpec) => raysVignettingComparator.spanOf!(spec as unknown as JsonObject);
  assert.equal(span(LATTICES[0]), span(LATTICES[1]));
  assert.notEqual(span(LATTICES[0]), span(SWEEP));
  assert.notEqual(span(LATTICES[0]), span(latticeSpec(0, 1)));
  assert.notEqual(span(SWEEP), span(sweepSpec([0, 3, 6], 1)));
});

test("the stop of the lens cuts each field's beam: rays of the edge get through on the axis and not off it", () => {
  const sweep = statusOf(traceOf(SWEEP));
  const passed = (first: number) => sweep.subarray(first, first + 16).filter((status) => status === 0).length;
  assert.deepEqual([passed(0), passed(16), passed(32)], [12, 12, 12]);
  const lattices = LATTICES.map(
    (spec) =>
      statusOf(traceOf(spec))
        .subarray(0, 100)
        .filter((s) => s === 0).length,
  );
  assert.ok(lattices[0] > 0 && lattices[1] > 0);
});

test("a faithful copy differs by nothing: of a sweep only the mask and the transmission, of the lattices every figure", () => {
  const sweep = compared(spanOf([SWEEP]), spanOf([SWEEP]));
  assert.ok(sweep.comparable);
  assert.deepEqual(
    sweep.metrics.map(({ name, value }) => [name, value]),
    [
      ["transmission.maxAbs", 0],
      ["transmission.rimBandOrFailed", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", 36],
      ["rays.dropped", 0],
      ["fields.compared", 0],
    ],
  );
  assert.deepEqual(sweep.inapplicable, ["illumination.maxAbs"]);
  const lattice = compared(spanOf(LATTICES), spanOf(LATTICES));
  assert.ok(lattice.comparable);
  assert.deepEqual(
    lattice.metrics.map(({ name, value }) => [name, value]),
    [
      ["illumination.maxAbs", 0],
      ["transmission.maxAbs", 0],
      ["transmission.rimBandOrFailed", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", lattice.metrics.find((each) => each.name === "rays.compared")!.value],
      ["rays.dropped", 0],
      ["fields.compared", 2],
    ],
  );
  assert.equal(lattice.unmeasured, undefined);
});

test("a direction turned in one answer moves the field's flux into the image over the axis's, as the estimator says", () => {
  // The exit direction of a lit cell of the 4-degree field turned by 1e-9 along x.
  const base = traceOf(LATTICES[1]);
  const lit = statusOf(base).findIndex((status, ray) => status === 0 && ray > 30 && ray < 100);
  const turned = changed(base, (arrays) => {
    arrays.exitDirection[3 * lit] += 1e-9;
  });
  const outcome = compared(
    spanOf(LATTICES),
    spanOf(LATTICES, (data, at) => (at === 1 ? turned : data)),
  );
  const value = metric(outcome, "illumination.maxAbs")!;
  const [axisSpec, fieldSpec] = LATTICES;
  const axis = traceOf(axisSpec);
  const [okAxis, okField] = [
    statusOf(axis).map((s) => (s === 0 ? 1 : 0)),
    statusOf(base).map((s) => (s === 0 ? 1 : 0)),
  ];
  const expected = Math.abs(
    fluxOf(fieldSpec, base, okField) / fluxOf(axisSpec, axis, okAxis) -
      fluxOf(fieldSpec, turned, okField) / fluxOf(axisSpec, axis, okAxis),
  );
  assert.ok(expected > 0);
  assert.equal(value.value, expected);
  assert.deepEqual(value.where, { line: 0, field: 4 });
  // Nothing else moved: the mask and the transmission are of which rays got through.
  assert.equal(metric(outcome, "transmission.maxAbs")!.value, 0);
  assert.equal(metric(outcome, "transmission.rimBandOrFailed")!.value, 0);
  assert.equal(metric(outcome, "mask.mismatches")!.value, 0);
});

test("a ray stopped in one answer is a mask mismatch, and its flux over the axis's is the transmission", () => {
  // Of the sweep: the second field's first ray that gets through, stopped at the stop in the second answer.
  const sweepBase = traceOf(SWEEP);
  const ray = statusOf(sweepBase).findIndex((status, at) => status === 0 && at >= 16);
  const stopped = changed(sweepBase, (arrays) => stopAt(arrays, ray, 2));
  const sweep = compared(
    spanOf([SWEEP]),
    spanOf([SWEEP], () => stopped),
  );
  assert.equal(metric(sweep, "mask.mismatches")!.value, 1);
  assert.equal(metric(sweep, "rays.dropped")!.value, 1);
  // One ray of the 12 the axis lets through in both answers.
  assert.deepEqual(metric(sweep, "transmission.maxAbs"), {
    name: "transmission.maxAbs",
    value: 1 / 12,
    where: { line: 0, ray: 16 },
  });
  assert.equal(metric(sweep, "transmission.rimBandOrFailed")!.value, 0);
  // A ray R2 would fail: the pair fails, on the mask and on the transmission.
  const verdict = judged(
    spanOf([SWEEP]),
    spanOf([SWEEP], () => stopped),
  );
  assert.equal(verdict.verdict, "FAIL");
  assert.match(verdict.reason ?? "", /mask\.mismatches 1 exceeds/);
  assert.match(verdict.reason ?? "", /transmission\.maxAbs 8\.33e-2 exceeds its tolerance 0/);
  // Of a lattice: a cell's flux, the square of the step times its weight, over the axis's in both answers.
  const base = traceOf(LATTICES[1]);
  const lit = statusOf(base).findIndex((status, at) => status === 0 && at < 100);
  const cut = changed(base, (arrays) => stopAt(arrays, lit, 2));
  const lattice = compared(
    spanOf(LATTICES),
    spanOf(LATTICES, (data, at) => (at === 1 ? cut : data)),
  );
  const axisCells = statusOf(traceOf(LATTICES[0]))
    .subarray(0, 100)
    .filter((status) => status === 0).length;
  assert.equal(metric(lattice, "transmission.maxAbs")!.value, 1 / axisCells);
  assert.equal(metric(lattice, "mask.mismatches")!.value, 1);
  // The flux into the image is of the rays ok in both answers: the stopped cell is in neither sum.
  assert.ok(metric(lattice, "illumination.maxAbs")!.value >= 0);
});

test("a ray stopped at the rim in one answer passes the mask and the transmission, and its flux is shown beside it", () => {
  // The second answer stops at the stop's rim a ray the first passes there, 1e-9 mm inside the clip: R2's rim band.
  const base = traceOf(SWEEP);
  const ray = statusOf(base).findIndex((status) => status === 0);
  const first = changed(base, (arrays) => hitRadius(arrays, 2, ray, STOP_CLIP - 1e-9));
  const second = changed(base, (arrays) => stopAt(arrays, ray, 2));
  const outcome = compared(
    spanOf([SWEEP], () => first),
    spanOf([SWEEP], () => second),
  );
  assert.equal(metric(outcome, "mask.mismatches")!.value, 0);
  assert.equal(metric(outcome, "mask.rimBand")!.value, 1);
  // As R2 judges it: the ray is in no count the transmission is of, and its flux is the figure shown beside it.
  assert.equal(metric(outcome, "transmission.maxAbs")!.value, 0);
  assert.deepEqual(metric(outcome, "transmission.rimBandOrFailed"), {
    name: "transmission.rimBandOrFailed",
    value: 1 / 11,
    where: { line: 0, ray: 0 },
  });
  const verdict = judged(
    spanOf([SWEEP], () => first),
    spanOf([SWEEP], () => second),
  );
  assert.equal(verdict.verdict, "PASS", verdict.reason);
  assert.equal(verdict.metrics.find(({ name }) => name === "transmission.rimBandOrFailed")?.value, 1 / 11);
});

test("a ray one engine failed is no mask mismatch and none of the transmission's, and its flux is shown beside it", () => {
  const base = traceOf(SWEEP);
  const ray = statusOf(base).findIndex((status, at) => status === 0 && at >= 32);
  const failed = changed(base, (arrays) => stopAt(arrays, ray, 1, "failed"));
  const outcome = compared(
    spanOf([SWEEP]),
    spanOf([SWEEP], () => failed),
  );
  assert.equal(metric(outcome, "mask.mismatches")!.value, 0);
  assert.equal(metric(outcome, "rays.dropped")!.value, 1);
  assert.equal(metric(outcome, "transmission.maxAbs")!.value, 0);
  assert.equal(metric(outcome, "transmission.rimBandOrFailed")!.value, 1 / 12);
  assert.equal(
    judged(
      spanOf([SWEEP]),
      spanOf([SWEEP], () => failed),
    ).verdict,
    "PASS",
  );
});

test("the members of a lattice span are taken in an order of their own: handed over reversed, the outcome is the same", () => {
  // Three fields, the axis among them, with a cell stopped in the second answer at 4 and at 2 degrees, and a direction
  // turned at 4: the first ray of each count, the field of each figure and the recorded values are of the span's order.
  const specs = [latticeSpec(0), latticeSpec(2), latticeSpec(4)];
  const changes = (data: RaysTraceData, at: number) => {
    if (at === 0) return data;
    const lit = statusOf(data).findIndex((status, ray) => status === 0 && ray > 30 && ray < 100);
    return changed(data, (arrays) => {
      stopAt(arrays, lit, 2);
      if (at === 2) arrays.exitDirection[3 * (lit + 1)] += 1e-9;
    });
  };
  const reversed = (span: SpanAnswer): SpanAnswer => ({ members: [...span.members].reverse() });
  const [a, b] = [spanOf(specs), spanOf(specs, changes)];
  const outcome = compared(a, b);
  assert.ok(outcome.comparable);
  assert.equal(metric(outcome, "mask.mismatches")!.value, 2);
  assert.deepEqual(metric(outcome, "rays.dropped")!.where?.field, 2);
  assert.deepEqual(metric(outcome, "illumination.maxAbs")!.where, { line: 0, field: 4 });
  assert.equal(JSON.stringify(compared(reversed(a), reversed(b))), JSON.stringify(outcome));
  const record = (span: SpanAnswer) =>
    JSON.stringify(raysVignettingComparator.recorded!(span as unknown as JsonObject, CONTEXT));
  assert.equal(record(reversed(b)), record(b));
  assert.deepEqual(
    raysVignettingComparator.recorded!(reversed(b) as unknown as JsonObject, CONTEXT).fieldAngleDeg,
    [0, 2, 4],
  );
});

test("without the axis, or a flux of it, a figure is not measured, with the reason", () => {
  const field = compared(spanOf([LATTICES[1]]), spanOf([LATTICES[1]]));
  assert.ok(field.comparable);
  assert.deepEqual(
    field.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["illumination.maxAbs", "no-axis"],
      ["transmission.maxAbs", "no-axis"],
      ["transmission.rimBandOrFailed", "no-axis"],
    ],
  );
  // Every ray of the sweep's axis stopped in both answers: no flux to be relative to.
  const dark = (data: RaysTraceData) =>
    changed(data, (arrays) => {
      for (let ray = 0; ray < 16; ray++) stopAt(arrays, ray, 0);
    });
  const sweep = compared(spanOf([SWEEP], dark), spanOf([SWEEP], dark));
  assert.ok(sweep.comparable);
  assert.deepEqual(
    sweep.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["transmission.maxAbs", "no-flux"],
      ["transmission.rimBandOrFailed", "no-flux"],
    ],
  );
});

test("a field without a flux into the image in both answers is named; with one in one answer only, not comparable", () => {
  // In the second answer only one row of the 4-degree field gets through: its cells cover no area of cosine space.
  const oneRow = (data: RaysTraceData) =>
    changed(data, (arrays) => {
      for (let ray = 0; ray < 100; ray++) {
        if (arrays.status[ray] === 0 && Math.floor(ray / 10) !== 5) stopAt(arrays, ray, 2);
      }
    });
  const outcome = compared(
    spanOf(LATTICES),
    spanOf(LATTICES, (data, at) => (at === 1 ? oneRow(data) : data)),
  );
  // The rays ok in both are the one row in both: neither answer has a flux of the field, which is named.
  assert.equal(outcome.comparable, true);
  assert.equal(metric(outcome, "fields.compared")!.value, 1);
  assert.deepEqual(outcome.notes, ["illumination.maxAbs is not of the field at 4 degrees: degenerate-pupil"]);
  // In one answer only every cell of the field leaves along one direction: its cells collapse onto one point of cosine
  // space, a flux in one answer and none in the other.
  const folded = changed(traceOf(LATTICES[1]), (arrays) => {
    for (let ray = 0; ray < 100; ray++) if (arrays.status[ray] === 0) arrays.exitDirection.set([0, 0, 1], 3 * ray);
  });
  const either = compared(
    spanOf(LATTICES),
    spanOf(LATTICES, (data, at) => (at === 1 ? folded : data)),
  );
  assert.equal(either.comparable, false);
  assert.match(
    either.comparable ? "" : either.reason,
    /in the first answer has a flux into the image, in the second has none: degenerate-pupil/,
  );
  assert.equal(compared(spanOf(LATTICES), spanOf(LATTICES), { spec: CONTEXT.spec }).comparable, false);
});

test("an answer records each field's own figures: of a sweep the tab's fractions, of a lattice its area and flux", () => {
  const sweep = raysVignettingComparator.recorded!(spanOf([SWEEP]) as unknown as JsonObject, CONTEXT);
  assert.deepEqual(sweep.geometricTransmission, [1, 1, 1]);
  assert.deepEqual(sweep.transmittedFlux, [1, 1, 1]);
  assert.deepEqual(sweep["rays.ok"], [36]);
  const lattice = raysVignettingComparator.recorded!(spanOf(LATTICES) as unknown as JsonObject, CONTEXT);
  assert.deepEqual(lattice.fieldAngleDeg, [0, 4]);
  assert.equal(lattice.geometricTransmission[0], 1);
  assert.equal(lattice.relativeIllumination[0], 1);
  assert.ok(lattice.relativeIllumination[1] > 0 && lattice.relativeIllumination[1] < 1.5);
});
