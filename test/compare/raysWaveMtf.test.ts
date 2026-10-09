// The comparator of `rays.trace` for rung R6a: the wave MTF of the same rays in two engines. Every answer here is
// synthetic: a wave that converges on one image point from a square of direction cosines, sampled on a lattice
// that fills the square, so that every figure is a closed form written out in the test.
//
// The pupil is the square |p|, |q| <= A / 2 of cosine space, A = 1/8, on a lattice of n by n cells of side h = A / n.
// Every ray lands on the reference point, so its path W is its optical path, which the test sets: W = a p^2, a
// cylinder along image x. A shear of exactly m cells along x pairs cell j with cell j + m, both cell centres, and
//
//   N(m h) / N(0) = (1 / n) sum over j = 0 .. n - m - 1 of exp(i k a ((p_j + m h)^2 - p_j^2)),   k = 2 pi / lambda
//
// a geometric series of ratio exp(i phi), phi = 2 k a m h^2, whose modulus is |sin((n - m) phi / 2) / sin(phi / 2)|
// over n; with a = 0 it is the triangle (n - m) / n, and so is every shear along y. The frequencies are the ones
// whose shear is a whole number of cells on both lattices: lambda = 500 nm and h = 1/64 put m cells at 31.25 m
// cycles a millimetre.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { ComparisonContext, ComputedMetric, UnmeasuredMetric } from "../../src/compare/comparator.ts";
import { COMPARATORS } from "../../src/compare/index.ts";
import { comparePair } from "../../src/compare/pair.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import { raysWaveMtfComparator } from "../../src/compare/raysWaveMtf.ts";
import type { SpanAnswer } from "../../src/compare/span.ts";
import { finalizeCase } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { RAY_STATUS } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { fixtureRecipe } from "../../src/core/mtfRecipe.ts";
import type { MtfRecipe } from "../../src/core/mtfRecipe.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { CONVERGENCE_BANDS } from "../../src/estimators/waveValidity.ts";
import { QUARTER_WAVE } from "../../src/estimators/waveOtf.ts";
import { caseOf, sphere } from "../engines/ref/support.ts";

const R6A = loadPolicy().rungs.r6a;
const GATE = R6A.metrics["waveMtf.maxAbs"].tolerance as number;

/** The side of the pupil in cosine space, the cells across the two lattices, and the wavelengths, nm. */
const SIDE = 1 / 8;
const FINE = 8;
const COARSE = 4;
const WAVE_NM = [500, 250];
const IMAGE_Z = 100;
/** Shears of 0, 2 and 4 cells of the finer lattice at 500 nm: 0, 1 and 2 of the coarser. */
const FREQUENCIES = [0, 62.5, 125];

/** A window before an image plane, in air: one line at 500 nm, or that line and one at 250 nm. */
function caseWith(lines: number): OpticalCase {
  const { label, system, conditions, provenance } = caseOf([{ z: 0, shape: sphere(Infinity), index: 1 }], {
    imageZ: IMAGE_Z,
    lines,
  });
  const stated = conditions.lines.map((line, index) => ({ ...line, wavelengthNm: WAVE_NM[index] }));
  return finalizeCase({ label, system, conditions: { ...conditions, lines: stated }, provenance });
}
const ONE_LINE = caseWith(1);
const TWO_LINES = caseWith(2);

function recipeOf(opticalCase: OpticalCase, frequenciesPerMm: readonly number[] = FREQUENCIES): MtfRecipe {
  const { recipe } = fixtureRecipe({ fields: { kind: "angles-deg", values: [0] }, frequenciesPerMm }, opticalCase);
  assert.ok(recipe !== null);
  return recipe;
}
const CONTEXT: ComparisonContext = { opticalCase: ONE_LINE, recipe: recipeOf(ONE_LINE) };

/** The cosine of cell `index` of a lattice of `cells` across the pupil: a multiple of 1/128, exact. */
function cosineOf(index: number, cells: number): number {
  return (index + 0.5 - cells / 2) * (SIDE / cells);
}

/** The request of a lattice of `cells` by `cells` rays along the axis, from the plane z = -10, at one line. */
function setOf(cells: number, line = 0, angleDeg = 0): RaysTraceSpec {
  const rays = cells * cells;
  const origins = new Float64Array(3 * rays);
  const directions = new Float64Array(3 * rays);
  for (let ray = 0; ray < rays; ray++) {
    origins.set([ray % cells, Math.floor(ray / cells), -10], 3 * ray);
    directions.set([0, 0, 1], 3 * ray);
  }
  return {
    line,
    origins: encodeNdArray(origins, [rays, 3]),
    directions: encodeNdArray(directions, [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1)),
    groups: { field: { angleDeg }, lattice: { columns: cells, rows: cells, step: 8 / cells } },
  };
}

/**
 * An answer to `setOf(cells)`: every ray leaves along its cell's cosines and lands on the axis, with the path
 * `110 + a p^2` mm, or on the point `landX` beside it along x. The rays of `stopped` are blocked, and hold no number.
 */
function waveOf(cells: number, a = 0, stopped: readonly number[] = [], landX = 0): RaysTraceData {
  const rays = cells * cells;
  const status = new Uint8Array(rays);
  const direction = new Float64Array(3 * rays);
  const imagePoint = new Float64Array(3 * rays);
  const path = new Float64Array(rays);
  for (let ray = 0; ray < rays; ray++) {
    const [p, q] = [cosineOf(ray % cells, cells), cosineOf(Math.floor(ray / cells), cells)];
    direction.set([p, q, Math.sqrt(1 - p * p - q * q)], 3 * ray);
    imagePoint.set([landX, 0, IMAGE_Z], 3 * ray);
    path[ray] = 110 + a * p * p;
  }
  for (const ray of stopped) {
    status[ray] = RAY_STATUS.blocked;
    direction.fill(NaN, 3 * ray, 3 * ray + 3);
    imagePoint.fill(NaN, 3 * ray, 3 * ray + 3);
    path[ray] = NaN;
  }
  return {
    status: encodeNdArray(status),
    endSurface: encodeNdArray(Int32Array.from(status, (ended) => (ended === 0 ? -1 : 0))),
    hits: encodeNdArray(new Float64Array(3 * rays), [1, rays, 3]),
    exitPoint: encodeNdArray(new Float64Array(3 * rays), [rays, 3]),
    exitDirection: encodeNdArray(direction, [rays, 3]),
    imagePoint: encodeNdArray(imagePoint, [rays, 3]),
    opticalPath: encodeNdArray(new Float64Array(rays).fill(10)),
    opticalPathToImage: encodeNdArray(path),
  };
}

/** One engine's answers to the requests of a field: each trace with the spec it answers, in the order given. */
function span(...members: readonly (readonly [RaysTraceSpec, RaysTraceData])[]): SpanAnswer {
  return {
    members: members.map(([spec, data]) => ({
      requestId: `line ${spec.line} on ${spec.groups?.lattice?.columns} columns`,
      spec,
      data,
    })),
  };
}

/** An engine's answers on both lattices: the cylinder `a` on the finer, and `coarse` on the coarser. */
function both(a = 0, coarse: RaysTraceData = waveOf(COARSE, a)): SpanAnswer {
  return span([setOf(COARSE), coarse], [setOf(FINE), waveOf(FINE, a)]);
}

function compared(a: SpanAnswer, b: SpanAnswer, context: ComparisonContext = CONTEXT) {
  const outcome = raysWaveMtfComparator.compare(a, b, context);
  assert.ok(outcome.comparable, outcome.comparable ? "" : outcome.reason);
  assert.deepEqual(raysWaveMtfComparator.compare(b, a, context), outcome, "swapping the two changes nothing");
  const metrics: Record<string, ComputedMetric> = Object.fromEntries(
    outcome.metrics.map((metric) => [metric.name, metric]),
  );
  const unmeasured: readonly UnmeasuredMetric[] = outcome.unmeasured ?? [];
  return { metrics, unmeasured };
}

function reasonOf(a: SpanAnswer, b: SpanAnswer, context?: ComparisonContext): string {
  const outcome = raysWaveMtfComparator.compare(a, b, context);
  assert.ok(!outcome.comparable);
  return outcome.reason;
}

function engine(id: string, data: SpanAnswer): ParticipantResult {
  return { engine: id, fingerprint: `${id} sources`, status: "ok", data };
}

function judged(a: SpanAnswer, b: SpanAnswer, context: ComparisonContext = CONTEXT) {
  return comparePair(engine("ref", a), engine("other", b), R6A, raysWaveMtfComparator, undefined, context);
}

/** The wave MTF of the cylinder `a` on a full lattice of `cells`, at a shear of `m` cells along x at 500 nm. */
function cylinderMtf(cells: number, m: number, a: number): number {
  const h = SIDE / cells;
  const phi = 2 * ((2 * Math.PI) / (WAVE_NM[0] * 1e-6)) * a * m * h * h;
  const terms = cells - m;
  // The limit of the quotient where the ratio of the series is 1.
  if (Math.abs(Math.sin(phi / 2)) < 1e-300) return terms / cells;
  return Math.abs(Math.sin((terms * phi) / 2) / Math.sin(phi / 2)) / cells;
}

/** The largest step of the cylinder's path between neighbouring cells of a full lattice, in waves at 500 nm. */
function cylinderStep(cells: number, a: number): number {
  const [outer, inner] = [cosineOf(cells - 1, cells), cosineOf(cells - 2, cells)];
  return (a * (outer * outer - inner * inner)) / (WAVE_NM[0] * 1e-6);
}

/**
 * Holds a figure to its closed form. A pair's sheared point is a cell centre to the 2^-36 of a cell at which the
 * estimator's search stops (1.5e-11), and the path of the steepest cylinder here turns by 0.6 waves, 3.7 radians,
 * from a cell to the next: a phasor is then off by less than 6e-11, and a quotient of sums of them by no more.
 */
function close(metric: ComputedMetric, expected: number, what = metric.name): void {
  assert.ok(Math.abs(metric.value - expected) <= 1e-10, `${what}: ${metric.value} against ${expected}`);
}

/**
 * Holds a step of the path to its closed form. A path of 110 mm is a double to half of 1.4e-14 mm, and a step is
 * the difference of two: 1.4e-14 mm at most, 2.9e-11 of a wave of 500 nm.
 */
function closeStep(metric: ComputedMetric, expected: number): void {
  assert.ok(Math.abs(metric.value - expected) <= 3e-11, `${metric.name}: ${metric.value} against ${expected}`);
}

test("the comparator is of rays.trace for rung r6a, a comparator of spans, and reports the wave MTF and its lattice", () => {
  assert.equal(raysWaveMtfComparator.quantity, "rays.trace");
  assert.equal(raysWaveMtfComparator.rung, "r6a");
  assert.equal(COMPARATORS.get("rays.trace", "r6a"), raysWaveMtfComparator);
  assert.deepEqual(
    raysWaveMtfComparator.metrics.map((metric) => `${metric.name} ${metric.unit}`),
    [
      "waveMtf.maxAbs 1",
      "waveMtf.flagged 1",
      "phaseStep.waves waves",
      "convergence.maxAbs 1",
      "lattice.columns cells",
      "rays.compared rays",
      "rays.dropped rays",
      "lines.compared lines",
    ],
  );
  // The policy judges the one figure, and by a tolerance.
  assert.deepEqual(Object.keys(R6A.metrics), ["waveMtf.maxAbs"]);
  assert.equal(R6A.class, "gated");
  assert.equal(R6A.floor, undefined);
});

test("the sets of a field are one span on every lattice and at every line; a set without a lattice is none", () => {
  const spanOf = (spec: RaysTraceSpec) => raysWaveMtfComparator.spanOf?.(spec);
  assert.equal(spanOf(setOf(FINE)), spanOf(setOf(COARSE)));
  assert.equal(spanOf(setOf(FINE)), spanOf(setOf(FINE, 1)));
  assert.notEqual(spanOf(setOf(FINE)), spanOf(setOf(FINE, 0, 3)));
  assert.equal(typeof spanOf(setOf(FINE)), "string");
  const { groups, ...bare } = setOf(FINE);
  assert.equal(spanOf(bare), undefined);
  assert.equal(spanOf({ ...bare, groups: { field: groups?.field } }), undefined);
  // Such a set is handed over as one answer, and is not comparable.
  const alone = raysWaveMtfComparator.compare(waveOf(FINE), waveOf(FINE), CONTEXT);
  assert.ok(!alone.comparable);
  assert.match(alone.reason, /states no field or no lattice/);
});

test("identical paths give 0: judged on the finer lattice, which the coarser one confirms", () => {
  const { metrics, unmeasured } = compared(both(), both());
  assert.deepEqual(unmeasured, []);
  assert.equal(metrics["waveMtf.maxAbs"].value, 0);
  assert.equal(metrics["waveMtf.flagged"], undefined);
  // Every ray lands on the reference point with one path: no step, and the triangle on either lattice.
  assert.equal(metrics["phaseStep.waves"].value, 0);
  assert.ok(metrics["convergence.maxAbs"].value <= 1e-15);
  assert.equal(metrics["lattice.columns"].value, FINE);
  assert.equal(metrics["rays.compared"].value, FINE * FINE);
  assert.equal(metrics["rays.dropped"].value, 0);
  assert.equal(metrics["lines.compared"].value, 1);
  const pair = judged(both(), both());
  assert.equal(pair.verdict, "PASS");
  assert.equal(pair.reason, undefined);
});

test("a known path perturbation gives its closed form: a cylinder against a sphere, judged and failed", () => {
  // 0.004 mm of cylinder: 0.012 waves a cell at the rim, and 3.0e-3 of MTF at four cells of shear.
  const a = 0.004;
  const { metrics, unmeasured } = compared(both(), both(a));
  assert.deepEqual(unmeasured, []);
  const differences = [2, 4].map((m) => Math.abs((FINE - m) / FINE - cylinderMtf(FINE, m, a)));
  const worst = Math.max(...differences);
  assert.ok(worst > 2e-3 && worst > GATE);
  close(metrics["waveMtf.maxAbs"], worst);
  // The cylinder is along image x: the sagittal cut, at the shear where the difference is largest.
  assert.deepEqual(metrics["waveMtf.maxAbs"].where, {
    field: 0,
    cut: "sagittal",
    frequencyPerMm: FREQUENCIES[1 + differences.indexOf(worst)],
  });
  // The step is the cylinder's own between the two outermost columns; the sphere has none.
  closeStep(metrics["phaseStep.waves"], cylinderStep(FINE, a));
  assert.ok(metrics["phaseStep.waves"].value < QUARTER_WAVE);
  assert.equal(metrics["phaseStep.waves"].where?.line, 0);
  // What the cylinder's own estimate moves by from four cells to eight, the larger of the two shears.
  const moved = [2, 4].map((m) => Math.abs(cylinderMtf(COARSE, m / 2, a) - cylinderMtf(FINE, m, a)));
  close(metrics["convergence.maxAbs"], Math.max(...moved));
  assert.ok(Math.max(...moved) < CONVERGENCE_BANDS.onAxis);

  const pair = judged(both(), both(a));
  assert.equal(pair.verdict, "FAIL");
  assert.match(
    pair.reason ?? "",
    /^waveMtf\.maxAbs 3\.01e-3 exceeds its tolerance 4\.00e-5 at cut sagittal, field 0, frequencyPerMm 125$/,
  );

  // A hundredth of it is within the gate, and passes on its figure.
  const slight = compared(both(), both(a / 400));
  const expected = Math.max(...[2, 4].map((m) => Math.abs((FINE - m) / FINE - cylinderMtf(FINE, m, a / 400))));
  assert.ok(expected > 1e-9 && expected < GATE);
  close(slight.metrics["waveMtf.maxAbs"], expected);
  assert.equal(judged(both(), both(a / 400)).verdict, "PASS");
});

test("the reference point is midway between the two engines' centroids: each estimate carries half the tilt", () => {
  // The other engine lands every ray 0.004 mm beside the axis along x. About the point midway, a ray of cosine p is
  // early by p d / 2 in one estimate and late by as much in the other: a step of h d / 2 a cell in both, 1/16 of a
  // wave on the finer lattice. About either engine's own centroid one estimate would have none and the other 1/8.
  const d = 0.004;
  const beside = span([setOf(COARSE), waveOf(COARSE, 0, [], d)], [setOf(FINE), waveOf(FINE, 0, [], d)]);
  const { metrics, unmeasured } = compared(both(), beside);
  assert.deepEqual(unmeasured, []);
  closeStep(metrics["phaseStep.waves"], ((SIDE / FINE) * d) / 2 / (WAVE_NM[0] * 1e-6));
  // A tilt moves the image and leaves the modulus: both are the triangle, on either lattice.
  assert.ok(metrics["waveMtf.maxAbs"].value <= 1e-10);
  assert.ok(metrics["convergence.maxAbs"].value <= 1e-10);
});

test("an undersampled lattice is not judged: its figure is written down as flagged, whatever its size", () => {
  // 0.2 mm of cylinder: 0.59 waves between the two outermost columns of the finer lattice.
  const a = 0.2;
  assert.ok(cylinderStep(FINE, a) > QUARTER_WAVE);
  const { metrics, unmeasured } = compared(both(), both(a));
  assert.equal(metrics["waveMtf.maxAbs"], undefined);
  const worst = Math.max(...[2, 4].map((m) => Math.abs((FINE - m) / FINE - cylinderMtf(FINE, m, a))));
  assert.ok(worst > 1000 * GATE);
  close(metrics["waveMtf.flagged"], worst);
  closeStep(metrics["phaseStep.waves"], cylinderStep(FINE, a));
  assert.equal(unmeasured.length, 1);
  assert.equal(unmeasured[0].name, "waveMtf.maxAbs");
  assert.match(
    unmeasured[0].reason,
    /^the lattice is no arbiter \(undersampled: neighbouring cells of the lattice of 8/,
  );
  assert.match(unmeasured[0].reason, /waves apart, above 2\.50e-1/);
  assert.match(unmeasured[0].reason, /recorded as waveMtf\.flagged and not judged$/);

  // The gate is of the figure that was not measured: the pair passes, and says why nothing was judged.
  const pair = judged(both(), both(a));
  assert.equal(pair.verdict, "PASS");
  assert.match(pair.reason ?? "", /^waveMtf\.maxAbs was not measured: the lattice is no arbiter \(undersampled/);
  assert.deepEqual(
    pair.metrics.map((metric) => metric.name),
    [
      "waveMtf.flagged",
      "phaseStep.waves",
      "convergence.maxAbs",
      "lattice.columns",
      "rays.compared",
      "rays.dropped",
      "lines.compared",
    ],
  );
});

test("a lattice that has not converged is not judged: the coarser one, cut by a column, has another triangle", () => {
  // Both engines lose the last column of the coarser lattice: three columns of four cells, and all eight of the finer.
  const cut = waveOf(COARSE, 0, [3, 7, 11, 15]);
  const { metrics, unmeasured } = compared(both(0, cut), both(0, cut));
  assert.equal(metrics["waveMtf.maxAbs"], undefined);
  assert.equal(metrics["waveMtf.flagged"].value, 0);
  assert.equal(metrics["phaseStep.waves"].value, 0);
  // At a shear of two coarse cells: one column of three overlaps, where four of eight do.
  close(metrics["convergence.maxAbs"], Math.abs(1 / 3 - 4 / 8));
  assert.deepEqual(metrics["convergence.maxAbs"].where, { field: 0, cut: "sagittal", frequencyPerMm: 125 });
  assert.match(unmeasured[0].reason, /not converged: the estimate moves by 1\.67e-1 from the coarser lattice/);
  assert.match(unmeasured[0].reason, /above 5\.00e-3/);
  assert.equal(judged(both(0, cut), both(0, cut)).verdict, "PASS");

  // Off the axis the band is the wider one, and is named.
  const off = (data: RaysTraceData): SpanAnswer => span([setOf(COARSE, 0, 3), data], [setOf(FINE, 0, 3), waveOf(FINE)]);
  assert.match(compared(off(cut), off(cut)).unmeasured[0].reason, /above 1\.00e-2/);
});

test("a field on one lattice has a figure and no convergence: it is not judged", () => {
  const one = span([setOf(FINE), waveOf(FINE)]);
  const { metrics, unmeasured } = compared(one, one);
  assert.equal(metrics["waveMtf.maxAbs"], undefined);
  assert.equal(metrics["convergence.maxAbs"], undefined);
  assert.equal(metrics["waveMtf.flagged"].value, 0);
  assert.match(unmeasured[0].reason, /convergence unknown: the field has rays on one lattice only/);
});

test("a ray one engine did not bring to the image is in neither pupil, and is counted", () => {
  // The other engine stops the last cell of the first row of the finer lattice, and holds no number for it.
  const other = span([setOf(COARSE), waveOf(COARSE)], [setOf(FINE), waveOf(FINE, 0, [7])]);
  const { metrics } = compared(both(), other);
  assert.equal(metrics["rays.compared"].value, FINE * FINE - 1);
  assert.equal(metrics["rays.dropped"].value, 1);
  assert.deepEqual(metrics["rays.dropped"].where, { field: 0, line: 0, ray: 7 });
  // Both estimates are of the same 63 cells: they differ by nothing.
  assert.equal((metrics["waveMtf.maxAbs"] ?? metrics["waveMtf.flagged"]).value, 0);
});

test("a spectrum is of every line: both lattices at both lines are one comparison", () => {
  const context: ComparisonContext = { opticalCase: TWO_LINES, recipe: recipeOf(TWO_LINES) };
  const answer = span(
    [setOf(COARSE, 0), waveOf(COARSE)],
    [setOf(COARSE, 1), waveOf(COARSE)],
    [setOf(FINE, 1), waveOf(FINE)],
    [setOf(FINE, 0), waveOf(FINE)],
  );
  const { metrics, unmeasured } = compared(answer, answer, context);
  assert.deepEqual(unmeasured, []);
  assert.equal(metrics["lines.compared"].value, 2);
  assert.equal(metrics["rays.compared"].value, 2 * FINE * FINE);
  assert.equal(metrics["waveMtf.maxAbs"].value, 0);
  // A full square is its own staircase at any shear, so the two lattices agree at the half cells of 250 nm too.
  assert.ok(metrics["convergence.maxAbs"].value <= 1e-12);

  const missing = span([setOf(COARSE, 0), waveOf(COARSE)], [setOf(FINE, 0), waveOf(FINE)]);
  assert.match(
    reasonOf(missing, missing, context),
    /the lattice of 4 columns has rays at the lines 0, and the case has 2 lines/,
  );
});

test("the frequencies are the recipe's, thinned to eleven", () => {
  // Thirteen frequencies: every shear of a whole cell of the finer lattice up to the cut-off and beyond.
  const all = Array.from({ length: 13 }, (_unused, index) => 31.25 * index);
  const context: ComparisonContext = { opticalCase: ONE_LINE, recipe: recipeOf(ONE_LINE, all) };
  const a = 0.004;
  const { metrics } = compared(both(), both(a), context);
  // Of the thirteen the first and the last are kept, and nine between them, by rounding the place: 31.25 times
  // 0, 1, 2, 4, 5, 6, 7, 8, 10, 11, 12. The odd shears are half cells of the coarser lattice, which only moves
  // the convergence; the largest difference of the finer lattice is among the shears that are kept.
  const kept = [0, 1, 2, 4, 5, 6, 7, 8, 10, 11, 12];
  const differences = kept.map((m) => (m >= FINE ? 0 : Math.abs((FINE - m) / FINE - cylinderMtf(FINE, m, a))));
  const worst = Math.max(...differences);
  const figure = metrics["waveMtf.maxAbs"] ?? metrics["waveMtf.flagged"];
  close(figure, worst, "the figure over the kept shears");
  assert.equal(figure.where?.frequencyPerMm, 31.25 * kept[differences.indexOf(worst)]);
  // The shear of three cells, which is left out, would have been larger than any that is kept.
  assert.ok(Math.abs((FINE - 3) / FINE - cylinderMtf(FINE, 3, a)) > worst);
});

test("not comparable: no recipe or case, another plane, other requests, other numbers of rays", () => {
  assert.match(reasonOf(both(), both()), /the MTF recipe of the run and its case are not at hand/);
  assert.match(reasonOf(both(), both(), { opticalCase: ONE_LINE }), /not at hand/);
  const recipe = recipeOf(ONE_LINE);
  const elsewhere: ComparisonContext = { opticalCase: ONE_LINE, recipe: { ...recipe, imageZ: IMAGE_Z + 1 } };
  assert.match(
    reasonOf(both(), both(), elsewhere),
    /the recipe is of the plane z = 101 mm, and the rays land on z = 100 mm/,
  );
  const none: ComparisonContext = { opticalCase: ONE_LINE, recipe: { ...recipe, frequenciesPerMm: [] } };
  assert.match(reasonOf(both(), both(), none), /the recipe states no frequency/);
  const one = span([setOf(FINE), waveOf(FINE)]);
  assert.match(reasonOf(both(), one, CONTEXT), /the two answers are to different requests/);
  const short = span([setOf(COARSE), waveOf(COARSE)], [setOf(FINE), waveOf(COARSE)]);
  assert.match(reasonOf(both(), short, CONTEXT), /the request is of 64 rays, and the answers are for 64 and 16/);
});
