// The comparator of `rays.trace` for rung R4: the geometric MTF of the same rays in two engines. Every answer here
// is synthetic: a trace of the support's rays whose landings are put where the test says, so that the MTF of each
// engine, and so their difference, is a closed form written out in the test: rays at +a and -a have the MTF
// |cos(2 pi nu a)|, and two lines add up as complex numbers about one point.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric, UnmeasuredMetric } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { MTF_CUTS, raysMtfComparator } from "../../src/compare/raysMtf.ts";
import type { SpanAnswer } from "../../src/compare/span.ts";
import { finalizeCase } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { fixtureRecipe } from "../../src/core/mtfRecipe.ts";
import type { MtfRecipe } from "../../src/core/mtfRecipe.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { BASE, LENS, SPEC, changed, specAt, stopAt, traceOf } from "./raysSupport.ts";

const R4 = loadPolicy().rungs.r4;
const FREQUENCIES = [10, 30, 50];
const TWO_PI = 2 * Math.PI;

/** `LENS` with other conditions: the system, and so the design plane at z = 60, stays. */
function lensWith(conditions: Partial<OpticalCase["conditions"]>): OpticalCase {
  const { label, system, provenance } = LENS;
  return finalizeCase({ label, system, conditions: { ...LENS.conditions, ...conditions }, provenance });
}

/** The case of the support at its first line only: a spectrum of one line. */
const ONE_LINE = ((): OpticalCase => {
  const table = decodeNdArray(LENS.conditions.indexAfterSurface);
  const surfaces = table.shape[1];
  const first = (table.values as Float64Array).slice(0, surfaces);
  return lensWith({ lines: LENS.conditions.lines.slice(0, 1), indexAfterSurface: encodeNdArray(first, [1, surfaces]) });
})();
/** The case of the support with lines that count 1 and 0.4. */
const TWO_LINES = lensWith({
  lines: LENS.conditions.lines.map((line, index) => ({ ...line, weight: index === 0 ? 1 : 0.4 })),
});

/** The recipe of a run of `opticalCase` on the axis, at the frequencies of these tests: the plane is the case's. */
function recipeOf(opticalCase: OpticalCase): MtfRecipe {
  const { recipe } = fixtureRecipe(
    { fields: { kind: "angles-deg", values: [0] }, frequenciesPerMm: FREQUENCIES },
    opticalCase,
  );
  assert.ok(recipe !== null);
  return recipe;
}

const CONTEXT: ComparisonContext = { spec: SPEC, opticalCase: ONE_LINE, recipe: recipeOf(ONE_LINE) };
const SPECTRUM: ComparisonContext = { spec: SPEC, opticalCase: TWO_LINES, recipe: recipeOf(TWO_LINES) };

/** A trace of the support's rays whose rays land where `points` says, by ray; every other value is `base`'s. */
function landed(points: Readonly<Record<number, readonly [x: number, y: number]>>, base = BASE): RaysTraceData {
  return changed(base, (arrays) => {
    for (const [ray, [x, y]] of Object.entries(points)) {
      arrays.imagePoint[3 * Number(ray)] = x;
      arrays.imagePoint[3 * Number(ray) + 1] = y;
    }
  });
}

/** The four rays of the support that pass, at the heights `ys` along image y and at one x. */
function fan(ys: readonly [number, number, number, number], x = 0.25): RaysTraceData {
  return landed(Object.fromEntries(ys.map((y, ray) => [ray, [x, y]])));
}

/** One engine's answers to the requests of a field: each trace with the spec it answers, in the order given. */
function span(...members: readonly (readonly [RaysTraceSpec, RaysTraceData])[]): SpanAnswer {
  return { members: members.map(([spec, data]) => ({ requestId: `request of line ${spec.line}`, spec, data })) };
}

function compared(a: SpanAnswer, b: SpanAnswer, context: ComparisonContext = CONTEXT) {
  const outcome = raysMtfComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(raysMtfComparator.compare(b, a, context), outcome, "swapping the two changes nothing");
  const metrics: Record<string, ComputedMetric> = Object.fromEntries(
    outcome.metrics.map((metric) => [metric.name, metric]),
  );
  const unmeasured: readonly UnmeasuredMetric[] = outcome.unmeasured ?? [];
  return { metrics, unmeasured };
}

function reasonOf(a: SpanAnswer, b: SpanAnswer, context?: ComparisonContext): string {
  const outcome = raysMtfComparator.compare(a, b, context);
  assert.ok(!outcome.comparable);
  return outcome.reason;
}

function engine(id: string, data: SpanAnswer): ParticipantResult {
  return { engine: id, fingerprint: `${id} sources`, status: "ok", data };
}

function judged(a: SpanAnswer, b: SpanAnswer, context: ComparisonContext = CONTEXT) {
  return comparePair(engine("ref", a), engine("other", b), R4, raysMtfComparator, undefined, context);
}

/** The largest of `difference(nu)` over the frequencies of these tests, and the first frequency it occurs at. */
function largest(difference: (frequency: number) => number): { value: number; frequencyPerMm: number } {
  let worst = { value: -1, frequencyPerMm: Number.NaN };
  for (const frequencyPerMm of FREQUENCIES) {
    const value = difference(frequencyPerMm);
    if (value > worst.value) worst = { value, frequencyPerMm };
  }
  return worst;
}

/** Asserts a metric to be `expected`, to the 1e-15 the estimator holds each of two curves to, twice over. */
function close(metric: ComputedMetric, expected: number): void {
  assert.ok(Math.abs(metric.value - expected) <= 4e-15, `${metric.name}: ${metric.value} against ${expected}`);
}

test("the comparator is of rays.trace for rung r4, a comparator of spans, and reports the MTF and three counts", () => {
  assert.equal(raysMtfComparator.quantity, "rays.trace");
  assert.equal(raysMtfComparator.rung, "r4");
  assert.equal(COMPARATORS.get("rays.trace", "r4"), raysMtfComparator);
  assert.deepEqual(raysMtfComparator.metrics, [
    { name: "mtf.maxAbs", unit: "1" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
    { name: "lines.compared", unit: "lines" },
  ]);
  assert.deepEqual(MTF_CUTS, ["sagittal", "tangential"]);
  // The rays of each engine are counted once, with rung r2.
  assert.equal(raysMtfComparator.recorded, undefined);
});

test("the sets of one field are one span, whatever their line; another field is another, and a set without a field is its own", () => {
  const spanOf = raysMtfComparator.spanOf;
  assert.ok(spanOf !== undefined);
  assert.equal(spanOf(specAt(0)), spanOf(specAt(1)));
  assert.equal(typeof spanOf(specAt(0)), "string");
  const other = { ...SPEC, groups: { ...SPEC.groups, field: { angleDeg: 5 } } };
  assert.notEqual(spanOf(other), spanOf(SPEC));
  // The same field over another lattice, or with another chief ray, is other rays.
  assert.notEqual(spanOf({ ...SPEC, groups: { ...SPEC.groups, chiefIndex: 0 } }), spanOf(SPEC));
  // The order of a spec's members is not its content.
  const { chiefIndex, field } = SPEC.groups ?? {};
  assert.equal(spanOf({ ...SPEC, groups: { chiefIndex, field } }), spanOf(SPEC));
  const { groups: _groups, ...bare } = SPEC;
  assert.equal(spanOf(bare), undefined);
  assert.equal(spanOf({ ...bare, groups: { chiefIndex: 6 } }), undefined);
});

test("identical answers differ by nothing: the MTF of each is the other's, to the bit", () => {
  const { metrics, unmeasured } = compared(span([SPEC, BASE]), span([SPEC, structuredClone(BASE)]));
  assert.deepEqual(unmeasured, []);
  // The first of equal values: the first cut at the first frequency.
  assert.deepEqual(metrics["mtf.maxAbs"], {
    name: "mtf.maxAbs",
    value: 0,
    where: { field: 0, cut: "sagittal", frequencyPerMm: 10 },
  });
  // Rays 0 to 3 and the chief ray are ok in both; the two the lens stops are ok in neither, and are no loss.
  assert.deepEqual(metrics["rays.compared"], { name: "rays.compared", value: 5 });
  assert.deepEqual(metrics["rays.dropped"], { name: "rays.dropped", value: 0 });
  assert.deepEqual(metrics["lines.compared"], { name: "lines.compared", value: 1 });
  assert.equal(judged(span([SPEC, BASE]), span([SPEC, BASE])).verdict, "PASS");
});

test("a known change of the landings gives the closed-form change of the MTF", () => {
  // Two rays at +a and two at -a along image y: the tangential MTF is |cos(2 pi nu a)|, and the sagittal one 1,
  // since every ray has the same x. The chief ray weighs nothing.
  const [a, delta] = [0.004, 1e-6];
  const modulus = (halfWidth: number) => (frequency: number) => Math.abs(Math.cos(TWO_PI * frequency * halfWidth));
  const one = span([SPEC, fan([a, -a, a, -a])]);
  const wider = span([SPEC, fan([a + delta, -(a + delta), a + delta, -(a + delta)])]);
  const expected = largest((frequency) => Math.abs(modulus(a)(frequency) - modulus(a + delta)(frequency)));
  assert.ok(expected.value > 2.9e-4 && expected.frequencyPerMm === 50, JSON.stringify(expected));

  const { metrics } = compared(one, wider);
  close(metrics["mtf.maxAbs"], expected.value);
  assert.deepEqual(metrics["mtf.maxAbs"].where, { field: 0, cut: "tangential", frequencyPerMm: 50 });
  assert.deepEqual(metrics["rays.dropped"], { name: "rays.dropped", value: 0 });
  const failed = judged(one, wider);
  assert.equal(failed.verdict, "FAIL");
  assert.match(
    failed.reason ?? "",
    /^mtf\.maxAbs 2\.9\de-4 exceeds its tolerance 1\.00e-7 at cut tangential, field 0, frequencyPerMm 50$/,
  );

  // A change a hundred thousand times smaller is inside the gate, and is still the closed form.
  const little = 1e-11;
  const nearly = span([SPEC, fan([a + little, -(a + little), a + little, -(a + little)])]);
  const small = largest((frequency) => Math.abs(modulus(a)(frequency) - modulus(a + little)(frequency)));
  assert.ok(small.value > 2e-9 && small.value < 1e-7);
  close(compared(one, nearly).metrics["mtf.maxAbs"], small.value);
  assert.equal(judged(one, nearly).verdict, "PASS");

  // The same change along image x is the sagittal cut's.
  const across = (halfWidth: number): SpanAnswer =>
    span([SPEC, landed({ 0: [halfWidth, 1], 1: [-halfWidth, 1], 2: [halfWidth, 1], 3: [-halfWidth, 1] })]);
  const sagittal = compared(across(a), across(a + delta)).metrics["mtf.maxAbs"];
  close(sagittal, expected.value);
  assert.deepEqual(sagittal.where, { field: 0, cut: "sagittal", frequencyPerMm: 50 });
});

test("an engine that lands every ray beside the other's by one step has the same MTF: the modulus has no reference", () => {
  const [a, b] = [0.004, 0.0015];
  const one = span([SPEC, fan([a, -a, b, -b])]);
  const moved = span([SPEC, fan([a + 0.3, -a + 0.3, b + 0.3, -b + 0.3], 0.25 - 0.2)]);
  close(compared(one, moved).metrics["mtf.maxAbs"], 0);
  assert.equal(judged(one, moved).verdict, "PASS");
});

test("a ray that is not ok in one engine is dropped from both, and counted", () => {
  // Ray 3 lands far from the others. An engine that stops it has three rays; the other's sum must leave it out
  // too, or the two curves are of different bundles.
  const a = 0.004;
  const all = fan([a, -a, 2 * a, -5 * a]);
  const three = changed(all, (arrays) => stopAt(arrays, 3, 2));
  const { metrics, unmeasured } = compared(span([SPEC, all]), span([SPEC, three]));
  assert.deepEqual(unmeasured, []);
  assert.equal(metrics["mtf.maxAbs"].value, 0);
  assert.deepEqual(metrics["rays.dropped"], {
    name: "rays.dropped",
    value: 1,
    where: { field: 0, line: 0, ray: 3 },
  });
  assert.deepEqual(metrics["rays.compared"], { name: "rays.compared", value: 4 });
  // What a mask disagrees about is R2's to judge: this rung passes the pair on the rays both have.
  assert.equal(judged(span([SPEC, all]), span([SPEC, three])).verdict, "PASS");

  // The three rays that are compared are compared: moving one of them in the engine that has four is the change
  // of a bundle of three, |e^(-i p a) + e^(i p a) + e^(-i p c)| / 3 with c the place of the third ray.
  const delta = 2e-6;
  const three_ = (c: number) => (frequency: number) => {
    const p = TWO_PI * frequency;
    const real = 2 * Math.cos(p * a) + Math.cos(p * c);
    const imaginary = -Math.sin(p * c);
    return Math.hypot(real, imaginary) / 3;
  };
  const shifted = fan([a, -a, 2 * a + delta, -5 * a]);
  const expected = largest((frequency) => Math.abs(three_(2 * a)(frequency) - three_(2 * a + delta)(frequency)));
  assert.ok(expected.value > 1e-5);
  close(compared(span([SPEC, shifted]), span([SPEC, three])).metrics["mtf.maxAbs"], expected.value);
  // A ray that failed in one engine is dropped like one that was blocked.
  const failed = changed(all, (arrays) => stopAt(arrays, 3, 2, "failed"));
  assert.equal(compared(span([SPEC, all]), span([SPEC, failed])).metrics["rays.dropped"].value, 1);
});

test("the lines of a spectrum add up as complex numbers about one point, each by its weight and its flux", () => {
  // Line 0, weight 1: rays at +a and -a. Line 1, weight 0.4: rays at s + b and s - b, beside the first line by
  // lateral colour. About the centre of line 0, with four rays of flux 1 in each line:
  //   OTF(nu) = (cos(p a) + 0.4 cos(p b) e^(-i p s)) / 1.4,  p = 2 pi nu.
  const [a, b, s, delta] = [0.004, 0.003, 0.0021, 1e-6];
  const modulus = (shift: number) => (frequency: number) => {
    const p = TWO_PI * frequency;
    const real = Math.cos(p * a) + 0.4 * Math.cos(p * b) * Math.cos(p * shift);
    const imaginary = -0.4 * Math.cos(p * b) * Math.sin(p * shift);
    return Math.hypot(real, imaginary) / 1.4;
  };
  const [first, second] = [specAt(0), specAt(1)];
  const base1 = traceOf(second);
  const line0 = fan([a, -a, a, -a]);
  const line1 = (shift: number): RaysTraceData =>
    landed({ 0: [0.25, shift + b], 1: [0.25, shift - b], 2: [0.25, shift + b], 3: [0.25, shift - b] }, base1);
  const one = span([first, line0], [second, line1(s)]);
  const other = span([first, line0], [second, line1(s + delta)]);
  const expected = largest((frequency) => Math.abs(modulus(s)(frequency) - modulus(s + delta)(frequency)));
  assert.ok(expected.value > 1e-5, String(expected.value));
  // Lateral colour is in the sum: the modulus is below what the two lines would have each about its own centre.
  assert.ok(modulus(s)(50) < modulus(0)(50) - 0.01);

  const { metrics } = compared(one, other, SPECTRUM);
  close(metrics["mtf.maxAbs"], expected.value);
  assert.deepEqual(metrics["mtf.maxAbs"].where, {
    field: 0,
    cut: "tangential",
    frequencyPerMm: expected.frequencyPerMm,
  });
  assert.deepEqual(metrics["lines.compared"], { name: "lines.compared", value: 2 });
  assert.deepEqual(metrics["rays.compared"], { name: "rays.compared", value: 10 });
  // The requests of a span come in the order of the run; the lines are taken in the order of the case.
  const turned = compared(
    span([second, line1(s)], [first, line0]),
    span([second, line1(s + delta)], [first, line0]),
    SPECTRUM,
  );
  assert.deepEqual(turned.metrics, metrics);

  // A ray is dropped from the line it was lost at, and from no other.
  const lost = changed(line1(s), (arrays) => stopAt(arrays, 2, 2));
  const dropped = compared(one, span([first, line0], [second, lost]), SPECTRUM).metrics;
  assert.deepEqual(dropped["rays.dropped"], { name: "rays.dropped", value: 1, where: { field: 0, line: 1, ray: 2 } });
  assert.deepEqual(dropped["rays.compared"], { name: "rays.compared", value: 9 });
  assert.equal(dropped["mtf.maxAbs"].value, 0);
});

test("a spectrum from which a line is missing, or is there twice, is not compared", () => {
  const [first, second] = [specAt(0), specAt(1)];
  const only = span([first, BASE]);
  assert.match(
    reasonOf(only, only, SPECTRUM),
    /^the field has rays at the lines 0, and the case has 2 lines: a spectrum from which a line is missing/,
  );
  const twice = span([first, BASE], [first, BASE]);
  assert.match(reasonOf(twice, twice, SPECTRUM), /^the field has rays at the lines 0, 0, and the case has 2 lines/);
  const both = span([first, BASE], [second, traceOf(second)]);
  assert.match(reasonOf(both, both, CONTEXT), /^the field has rays at the lines 0, 1, and the case has 1 lines/);
  assert.equal(compared(both, both, SPECTRUM).metrics["mtf.maxAbs"].value, 0);
});

test("the plane is the case's: at the design plane two engines may agree where at a shifted plane they do not", () => {
  // Four rays through one point of the design plane, z = 60, with the slopes +t and -t along y. An engine whose
  // slopes are too steep by one part in a thousand lands them on the same point there, and the MTF of both is 1.
  // On a plane 0.02 mm behind it the rays stand at +-0.02 t and +-0.02 t (1 + 1e-3): |cos(2 pi nu 0.02 t)|.
  const [t, steeper, shift] = [0.1, 1e-3, 0.02];
  const through = (slope: number, plane: number): RaysTraceData => {
    const y = (plane - 60) * slope;
    return fan([y, -y, y, -y], 0);
  };
  const atDesign = compared(span([SPEC, through(t, 60)]), span([SPEC, through(t * (1 + steeper), 60)]));
  assert.equal(atDesign.metrics["mtf.maxAbs"].value, 0);

  const moved = lensWith({
    lines: ONE_LINE.conditions.lines,
    indexAfterSurface: ONE_LINE.conditions.indexAfterSurface,
    imageZ: 60 + shift,
  });
  const context: ComparisonContext = { spec: SPEC, opticalCase: moved, recipe: recipeOf(moved) };
  assert.equal(context.recipe?.plane.kind, "shift");
  assert.equal(context.recipe?.imageZ, 60 + shift);
  // The plane as a double holds it: the landings are of that plane, as an engine's are.
  const plane = moved.conditions.imageZ;
  const modulus = (slope: number) => (frequency: number) =>
    Math.abs(Math.cos(TWO_PI * frequency * ((plane - 60) * slope)));
  const expected = largest((frequency) => Math.abs(modulus(t)(frequency) - modulus(t * (1 + steeper))(frequency)));
  assert.ok(expected.value > 1e-4);
  const one = span([SPEC, through(t, plane)]);
  const other = span([SPEC, through(t * (1 + steeper), plane)]);
  close(compared(one, other, context).metrics["mtf.maxAbs"], expected.value);

  // A recipe of one plane and a case of another are not of the same MTF: nothing is projected, and nothing guessed.
  assert.equal(
    reasonOf(one, other, { ...context, recipe: CONTEXT.recipe }),
    `the recipe is of the plane z = 60 mm, and the rays land on z = ${plane} mm`,
  );
});

test("where no ray of a line is ok in both, or none carries flux, the MTF is not measured, and the pair says so", () => {
  const none = changed(BASE, (arrays) => [0, 1, 2, 3, 6].forEach((ray) => stopAt(arrays, ray, 0)));
  const { metrics, unmeasured } = compared(span([SPEC, BASE]), span([SPEC, none]));
  const reason = "no ray of line 0 that carries flux is ok in both answers";
  assert.deepEqual(unmeasured, [{ name: "mtf.maxAbs", reason }]);
  assert.deepEqual(Object.keys(metrics), ["rays.compared", "rays.dropped", "lines.compared"]);
  assert.equal(metrics["rays.compared"].value, 0);
  assert.equal(metrics["rays.dropped"].value, 5);
  const pair = judged(span([SPEC, BASE]), span([SPEC, none]));
  assert.deepEqual([pair.verdict, pair.reason], ["PASS", `mtf.maxAbs was not measured: ${reason}`]);

  // Only the chief ray, which weighs nothing, is left to both.
  const chiefOnly = changed(BASE, (arrays) => [0, 1, 2, 3].forEach((ray) => stopAt(arrays, ray, 0)));
  assert.deepEqual(compared(span([SPEC, BASE]), span([SPEC, chiefOnly])).unmeasured, [{ name: "mtf.maxAbs", reason }]);

  // A later line without a ray is the estimator's to say.
  const [first, second] = [specAt(0), specAt(1)];
  const base1 = traceOf(second);
  const dark = changed(base1, (arrays) => [0, 1, 2, 3, 6].forEach((ray) => stopAt(arrays, ray, 0)));
  const second_ = compared(span([first, BASE], [second, base1]), span([first, BASE], [second, dark]), SPECTRUM);
  assert.deepEqual(second_.unmeasured, [
    { name: "mtf.maxAbs", reason: "no-rays: line 1: no ray of the bundle is taken" },
  ]);
});

test("answers that cannot be set against each other are not comparable, with the reason", () => {
  const one = span([SPEC, BASE]);
  const without = /^the MTF recipe of the run and its case are not at hand: /;
  assert.match(reasonOf(one, one), without);
  assert.match(reasonOf(one, one, { spec: SPEC, opticalCase: ONE_LINE }), without);
  assert.match(reasonOf(one, one, { spec: SPEC, recipe: CONTEXT.recipe }), without);
  const silent = { ...CONTEXT, recipe: { ...recipeOf(ONE_LINE), frequenciesPerMm: [] } };
  assert.equal(reasonOf(one, one, silent), "the recipe states no frequency");

  const elsewhere: SpanAnswer = { members: [{ ...one.members[0], requestId: "another request" }] };
  assert.equal(reasonOf(one, elsewhere, CONTEXT), "the two answers are to different requests");
  assert.equal(reasonOf(one, span([SPEC, BASE], [SPEC, BASE]), CONTEXT), "the two answers are to different requests");

  // An answer for other rays than the request has.
  const fewer: RaysTraceSpec = {
    ...SPEC,
    origins: encodeNdArray(Float64Array.of(0, 1, -10), [1, 3]),
    directions: encodeNdArray(Float64Array.of(0, 0, 1), [1, 3]),
    weights: encodeNdArray(Float64Array.of(1)),
  };
  const short = traceOf(fewer);
  assert.equal(
    reasonOf(one, span([SPEC, short]), CONTEXT),
    "line 0: the request is of 7 rays, and the answers are for 7 and 1",
  );

  // A ray an engine calls ok and lands nowhere is a defect of the answer, not a ray to leave out.
  const nowhere = span([SPEC, landed({ 1: [Number.NaN, 0] })]);
  assert.match(reasonOf(one, nowhere, CONTEXT), /^the estimator has no value: /);
});
