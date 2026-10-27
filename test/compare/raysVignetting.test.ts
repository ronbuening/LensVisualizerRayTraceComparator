// The comparator of `rays.trace` for rung R11a, on the reference engine's trace of beam sets through a small lens (the
// lattices of a few fields, each with the chief rays of an image mapping after its cells), and on copies of it with a
// direction turned, a ray stopped, a ray failed, a ray stopped at the rim, a landing moved, and the members handed over
// in another order. Every number is synthetic; what a lattice brings into the image is the estimator's, whose proofs
// are test/estimators/illumination.test.ts.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparatorOutcome, ComputedMetric } from "../../src/compare/comparator.ts";
import { comparePair } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { raysVignettingComparator } from "../../src/compare/raysVignetting.ts";
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

/** Where a ray of a field crosses z = -10 to cross z = 7, the stop, at (x, y) were it not refracted. */
function startOf(angleDeg: number, x: number, y: number): [number, number, number] {
  const [, m, n] = directionOf(angleDeg);
  return [x, y - (17 * m) / n, -10];
}

/** The cells of a beam: 10 x 10 of 0.75 mm. */
const CELLS = 100;

/**
 * A beam set at a field: a lattice of 10 x 10 cells of 0.75 mm over the stop, then the chief rays of an image mapping,
 * the field's and those of the fields half a degree below and above it, each a little off the axis so that the
 * obstruction passes it.
 */
function beamSpec(angle: number, line = 0): RaysTraceSpec {
  const [columns, rows, step] = [10, 10, 0.75];
  const origins: number[] = [];
  const directions: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      origins.push(...startOf(angle, -3.75 + (column + 0.5) * step, -3.75 + (row + 0.5) * step));
      directions.push(...directionOf(angle));
    }
  }
  for (const chief of [angle, angle - 0.5, angle + 0.5]) {
    origins.push(...startOf(chief, 0.6, 0.6));
    directions.push(...directionOf(chief));
  }
  const rays = CELLS + 3;
  const weights = new Float64Array(rays).fill(1);
  weights.fill(0, CELLS);
  return {
    line,
    origins: encodeNdArray(Float64Array.from(origins), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(directions), [rays, 3]),
    weights: encodeNdArray(weights),
    groups: { field: { angleDeg: angle }, lattice: { columns, rows, step }, chiefIndex: CELLS },
  };
}

const BEAMS = [beamSpec(0), beamSpec(4)];
const CONTEXT = { spec: BEAMS[0] as unknown as JsonObject, opticalCase: LENS };

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

/** The cells of the axis's beam that get through. */
const AXIS_CELLS = statusOf(traceOf(BEAMS[0]))
  .subarray(0, CELLS)
  .filter((status) => status === 0).length;

test("the spans are the beam sets of a line; a set that is no beam is not comparable", () => {
  const span = (spec: RaysTraceSpec) => raysVignettingComparator.spanOf!(spec as unknown as JsonObject);
  assert.equal(span(BEAMS[0]), span(BEAMS[1]));
  assert.notEqual(span(BEAMS[0]), span(beamSpec(0, 1)));
  // A set without a lattice, and one whose chief ray is not right after its cells, is no beam of the tab.
  const { groups, ...bare } = BEAMS[1];
  const late = { ...BEAMS[1], groups: { ...groups, chiefIndex: CELLS + 1 } };
  for (const other of [bare, late]) {
    const outcome = compared(spanOf([BEAMS[0], other]), spanOf([BEAMS[0], other]));
    assert.equal(outcome.comparable, false);
    assert.match(outcome.comparable ? "" : outcome.reason, /is no beam/);
  }
});

test("the stop of the lens cuts each field's beam, and the chief rays of the mapping get through", () => {
  for (const spec of BEAMS) {
    const status = statusOf(traceOf(spec));
    const cells = status.subarray(0, CELLS).filter((each) => each === 0).length;
    assert.ok(cells > 0 && cells < CELLS);
    assert.deepEqual([...status.subarray(CELLS)], [0, 0, 0]);
  }
});

test("a faithful copy differs by nothing", () => {
  const outcome = compared(spanOf(BEAMS), spanOf(BEAMS));
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.metrics.map(({ name, value }) => [name, value]),
    [
      ["illumination.maxAbs", 0],
      ["transmission.maxAbs", 0],
      ["transmission.rimBandOrFailed", 0],
      ["landing.maxAbs", 0],
      ["mask.mismatches", 0],
      ["mask.rimBand", 0],
      ["rays.compared", outcome.metrics.find((each) => each.name === "rays.compared")!.value],
      ["rays.dropped", 0],
      ["fields.compared", 2],
    ],
  );
  assert.equal(outcome.unmeasured, undefined);
  assert.equal(judged(spanOf(BEAMS), spanOf(BEAMS)).verdict, "PASS");
});

test("a direction turned in one answer moves the field's flux into the image over the axis's, as the estimator says", () => {
  // The exit direction of a lit cell of the 4-degree field turned by 1e-9 along x.
  const base = traceOf(BEAMS[1]);
  const lit = statusOf(base).findIndex((status, ray) => status === 0 && ray > 30 && ray < CELLS);
  const turned = changed(base, (arrays) => {
    arrays.exitDirection[3 * lit] += 1e-9;
  });
  const outcome = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? turned : data)),
  );
  const value = metric(outcome, "illumination.maxAbs")!;
  const [axisSpec, fieldSpec] = BEAMS;
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
  // Nothing else moved: the mask and the transmission are of which rays got through, the landing of where.
  assert.equal(metric(outcome, "transmission.maxAbs")!.value, 0);
  assert.equal(metric(outcome, "transmission.rimBandOrFailed")!.value, 0);
  assert.equal(metric(outcome, "mask.mismatches")!.value, 0);
  assert.equal(metric(outcome, "landing.maxAbs")!.value, 0);
});

test("a chief ray of the mapping landing elsewhere in one answer is the landing figure, judged at R2's 1e-8 mm", () => {
  // The landing of the 4-degree field's upper neighbour moved by 2^-26 mm across the axis in the second answer.
  const ray = CELLS + 2;
  const moved = changed(traceOf(BEAMS[1]), (arrays) => {
    arrays.imagePoint[3 * ray + 1] += 2 ** -26;
  });
  const outcome = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? moved : data)),
  );
  assert.deepEqual(metric(outcome, "landing.maxAbs"), {
    name: "landing.maxAbs",
    value: Math.abs(
      (decodeNdArray(traceOf(BEAMS[1]).imagePoint).values as Float64Array)[3 * ray + 1] -
        (decodeNdArray(moved.imagePoint).values as Float64Array)[3 * ray + 1],
    ),
    where: { line: 0, field: 4, ray },
  });
  const verdict = judged(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? moved : data)),
  );
  assert.equal(verdict.verdict, "FAIL");
  assert.match(
    verdict.reason ?? "",
    /landing\.maxAbs 1\.49e-8 exceeds its tolerance 1\.00e-8 at field 4, line 0, ray 102/,
  );
  // A cell's landing is no figure of the rung: the tab reads no cell's landing.
  const cell = statusOf(traceOf(BEAMS[1])).findIndex((status, at) => status === 0 && at < CELLS);
  const cellMoved = changed(traceOf(BEAMS[1]), (arrays) => {
    arrays.imagePoint[3 * cell + 1] += 2 ** -20;
  });
  const cells = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? cellMoved : data)),
  );
  assert.equal(metric(cells, "landing.maxAbs")!.value, 0);
});

test("a ray stopped in one answer is a mask mismatch, and its flux over the axis's is the transmission", () => {
  // Of the 4-degree field: a cell's flux, the square of the step times its weight, over the axis's in both answers.
  const base = traceOf(BEAMS[1]);
  const lit = statusOf(base).findIndex((status, at) => status === 0 && at < CELLS);
  const cut = changed(base, (arrays) => stopAt(arrays, lit, 2));
  const outcome = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? cut : data)),
  );
  assert.deepEqual(metric(outcome, "transmission.maxAbs"), {
    name: "transmission.maxAbs",
    value: 1 / AXIS_CELLS,
    where: { line: 0, field: 4 },
  });
  assert.equal(metric(outcome, "mask.mismatches")!.value, 1);
  assert.equal(metric(outcome, "rays.dropped")!.value, 1);
  assert.equal(metric(outcome, "transmission.rimBandOrFailed")!.value, 0);
  // The flux into the image is of the rays ok in both answers: the stopped cell is in neither sum.
  assert.ok(metric(outcome, "illumination.maxAbs")!.value >= 0);
  // A ray R2 would fail: the pair fails, on the mask and on the transmission.
  const verdict = judged(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? cut : data)),
  );
  assert.equal(verdict.verdict, "FAIL");
  assert.match(verdict.reason ?? "", /mask\.mismatches 1 exceeds/);
  assert.match(verdict.reason ?? "", /transmission\.maxAbs .* exceeds its tolerance 0/);
  // A chief ray of the mapping stopped in one answer is a mask mismatch and no part of the transmission.
  const chief = changed(base, (arrays) => stopAt(arrays, CELLS, 2));
  const unlit = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? chief : data)),
  );
  assert.equal(metric(unlit, "mask.mismatches")!.value, 1);
  assert.equal(metric(unlit, "transmission.maxAbs")!.value, 0);
});

test("a ray stopped at the rim in one answer passes the mask and the transmission, and its flux is shown beside it", () => {
  // The second answer stops at the stop's rim a cell the first passes there, 1e-9 mm inside the clip: R2's rim band.
  const base = traceOf(BEAMS[1]);
  const ray = statusOf(base).findIndex((status, at) => status === 0 && at < CELLS);
  const first = changed(base, (arrays) => hitRadius(arrays, 2, ray, STOP_CLIP - 1e-9));
  const second = changed(base, (arrays) => stopAt(arrays, ray, 2));
  const [a, b] = [
    spanOf(BEAMS, (data, at) => (at === 1 ? first : data)),
    spanOf(BEAMS, (data, at) => (at === 1 ? second : data)),
  ];
  const outcome = compared(a, b);
  assert.equal(metric(outcome, "mask.mismatches")!.value, 0);
  assert.equal(metric(outcome, "mask.rimBand")!.value, 1);
  // As R2 judges it: the ray is in no count the transmission is of, and its flux is the figure shown beside it.
  assert.equal(metric(outcome, "transmission.maxAbs")!.value, 0);
  assert.deepEqual(metric(outcome, "transmission.rimBandOrFailed"), {
    name: "transmission.rimBandOrFailed",
    value: 1 / AXIS_CELLS,
    where: { line: 0, field: 4 },
  });
  const verdict = judged(a, b);
  assert.equal(verdict.verdict, "PASS", verdict.reason);
  assert.equal(verdict.metrics.find(({ name }) => name === "transmission.rimBandOrFailed")?.value, 1 / AXIS_CELLS);
});

test("a ray one engine failed is no mask mismatch and none of the transmission's, and its flux is shown beside it", () => {
  const base = traceOf(BEAMS[1]);
  const ray = statusOf(base).findIndex((status, at) => status === 0 && at < CELLS);
  const failed = changed(base, (arrays) => stopAt(arrays, ray, 1, "failed"));
  const outcome = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? failed : data)),
  );
  assert.equal(metric(outcome, "mask.mismatches")!.value, 0);
  assert.equal(metric(outcome, "rays.dropped")!.value, 1);
  assert.equal(metric(outcome, "transmission.maxAbs")!.value, 0);
  assert.equal(metric(outcome, "transmission.rimBandOrFailed")!.value, 1 / AXIS_CELLS);
  assert.equal(
    judged(
      spanOf(BEAMS),
      spanOf(BEAMS, (data, at) => (at === 1 ? failed : data)),
    ).verdict,
    "PASS",
  );
});

test("the members of a span are taken in an order of their own: handed over reversed, the outcome is the same", () => {
  // Three fields, the axis among them, with a cell stopped in the second answer at 4 and at 2 degrees, and a direction
  // turned at 4: the first ray of each count, the field of each figure and the recorded values are of the span's order.
  const specs = [beamSpec(0), beamSpec(2), beamSpec(4)];
  const changes = (data: RaysTraceData, at: number) => {
    if (at === 0) return data;
    const lit = statusOf(data).findIndex((status, ray) => status === 0 && ray > 30 && ray < CELLS);
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
  const field = compared(spanOf([BEAMS[1]]), spanOf([BEAMS[1]]));
  assert.ok(field.comparable);
  assert.deepEqual(
    field.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["illumination.maxAbs", "no-axis"],
      ["transmission.maxAbs", "no-axis"],
      ["transmission.rimBandOrFailed", "no-axis"],
    ],
  );
  // The landing figure is of each chief ray, and needs no axis.
  assert.equal(metric(field, "landing.maxAbs")!.value, 0);
  // Every ray of the axis's beam stopped in both answers: no flux to be relative to, and no chief ray of it landed.
  const dark = (data: RaysTraceData, at: number) =>
    at !== 0
      ? data
      : changed(data, (arrays) => {
          for (let ray = 0; ray < CELLS + 3; ray++) if (arrays.status[ray] === 0) stopAt(arrays, ray, 0);
        });
  const outcome = compared(spanOf(BEAMS, dark), spanOf(BEAMS, dark));
  assert.ok(outcome.comparable);
  assert.deepEqual(
    outcome.unmeasured?.map(({ name, reason }) => [name, reason.split(":")[0]]),
    [
      ["illumination.maxAbs", "no-rays"],
      ["transmission.maxAbs", "no-flux"],
      ["transmission.rimBandOrFailed", "no-flux"],
    ],
  );
});

test("a field without a flux into the image in both answers is named; with one in one answer only, not comparable", () => {
  // In the second answer only one row of the 4-degree field gets through: its cells cover no area of cosine space.
  const oneRow = (data: RaysTraceData) =>
    changed(data, (arrays) => {
      for (let ray = 0; ray < CELLS; ray++) {
        if (arrays.status[ray] === 0 && Math.floor(ray / 10) !== 5) stopAt(arrays, ray, 2);
      }
    });
  const outcome = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? oneRow(data) : data)),
  );
  // The rays ok in both are the one row in both: neither answer has a flux of the field, which is named.
  assert.equal(outcome.comparable, true);
  assert.equal(metric(outcome, "fields.compared")!.value, 1);
  assert.deepEqual(outcome.notes, ["illumination.maxAbs is not of the field at 4 degrees: degenerate-pupil"]);
  // In one answer only every cell of the field leaves along one direction: its cells collapse onto one point of cosine
  // space, a flux in one answer and none in the other.
  const folded = changed(traceOf(BEAMS[1]), (arrays) => {
    for (let ray = 0; ray < CELLS; ray++) if (arrays.status[ray] === 0) arrays.exitDirection.set([0, 0, 1], 3 * ray);
  });
  const either = compared(
    spanOf(BEAMS),
    spanOf(BEAMS, (data, at) => (at === 1 ? folded : data)),
  );
  assert.equal(either.comparable, false);
  assert.match(
    either.comparable ? "" : either.reason,
    /in the first answer has a flux into the image, in the second has none: degenerate-pupil/,
  );
  assert.equal(compared(spanOf(BEAMS), spanOf(BEAMS), { spec: CONTEXT.spec }).comparable, false);
});

test("an answer records each field's own figures: its area on the launch plane and its flux into the image", () => {
  const recorded = raysVignettingComparator.recorded!(spanOf(BEAMS) as unknown as JsonObject, CONTEXT);
  assert.deepEqual(recorded.fieldAngleDeg, [0, 4]);
  assert.equal(recorded.geometricTransmission[0], 1);
  assert.equal(recorded.relativeIllumination[0], 1);
  assert.ok(recorded.relativeIllumination[1] > 0 && recorded.relativeIllumination[1] < 1.5);
  assert.equal(recorded["rays.ok"].length, 2);
});
