// The focus estimator of field curves held to its definition: every expected value is worked out in the test, in
// closed form or in exact fractions (whole numbers over whole numbers), never taken from an engine. A carried rest of
// the estimator that is removed turns a test here red: the focus of a series of parabasal pairs and of fans focused
// near their plane is held to within a unit in the last place of the exact focus of the doubles given, which the
// plain formula misses by thousands of units.
import assert from "node:assert/strict";
import { test } from "node:test";

import { relativeFocus } from "../../src/estimators/fieldFocus.ts";
import type { FocusAxis, FocusRays } from "../../src/estimators/fieldFocus.ts";
import { dyadicOf, nearestQuotient, nearestRoot, series, ulp } from "./support.ts";

/** An exact fraction of two whole numbers, its denominator above 0 and the two without a common factor. */
interface Fraction {
  readonly num: bigint;
  readonly den: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  let [x, y] = [a < 0n ? -a : a, b < 0n ? -b : b];
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

function reduced(num: bigint, den: bigint): Fraction {
  if (den === 0n) throw new RangeError("a fraction over 0");
  const sign = den < 0n ? -1n : 1n;
  const common = gcd(num, den) || 1n;
  return { num: (sign * num) / common, den: (sign * den) / common };
}

/** A finite double as the fraction it is. */
function fractionOf(value: number): Fraction {
  const { numerator, shift } = dyadicOf(value);
  return shift >= 0 ? reduced(numerator, 1n << BigInt(shift)) : reduced(numerator << BigInt(-shift), 1n);
}

const add = (a: Fraction, b: Fraction): Fraction => reduced(a.num * b.den + b.num * a.den, a.den * b.den);
const sub = (a: Fraction, b: Fraction): Fraction => reduced(a.num * b.den - b.num * a.den, a.den * b.den);
const mul = (a: Fraction, b: Fraction): Fraction => reduced(a.num * b.num, a.den * b.den);
const div = (a: Fraction, b: Fraction): Fraction => reduced(a.num * b.den, a.den * b.num);
const ZERO: Fraction = { num: 0n, den: 1n };

/** The double nearest to a fraction. */
function nearest(value: Fraction): number {
  return nearestQuotient({ numerator: value.num, shift: 0 }, { numerator: value.den, shift: 0 });
}

/**
 * The definition carried out in exact fractions: of the rays `members` against the ray `chief`, in the section `axis`,
 * the shift `- sum dc du / sum du^2` and the sum `sum du^2`, with every slope the exact quotient of its direction's
 * components.
 */
function exactFocus(
  rays: FocusRays,
  chief: number,
  members: readonly number[],
  axis: FocusAxis,
): { shift: Fraction; weight: Fraction } {
  const at = axis === "sagittal" ? 0 : 1;
  const slope = (ray: number) => div(fractionOf(rays.direction[3 * ray + at]), fractionOf(rays.direction[3 * ray + 2]));
  const coordinate = (ray: number) => fractionOf(rays.landing[3 * ray + at]);
  let moment = ZERO;
  let weight = ZERO;
  for (const ray of members) {
    if (rays.valid !== undefined && rays.valid[ray] === 0) continue;
    const dc = sub(coordinate(ray), coordinate(chief));
    const du = sub(slope(ray), slope(chief));
    moment = add(moment, mul(dc, du));
    weight = add(weight, mul(du, du));
  }
  return { shift: div(sub(ZERO, moment), weight), weight };
}

/** A set of rays from points (x, y) on the plane z = 0 and directions (l, m, n), in that order. */
function setOf(rays: readonly { point: readonly [number, number]; direction: readonly number[] }[]): FocusRays {
  return {
    landing: rays.flatMap(({ point }) => [point[0], point[1], 0]),
    direction: rays.flatMap(({ direction }) => [...direction]),
  };
}

test("rays through one point of the meridional section have their tangential focus there, to the bit", () => {
  // The chief ray lands at y = 20 mm with the slope -2^-3; four rays of slopes 2^-10 to 2^-7 apart from it pass
  // through the point 0.375 mm behind the plane on it: each lands -0.375 du from the chief ray. Every number is a
  // short binary fraction, so each landing is exact, and the estimator gives the focus back exactly.
  const [y0, u0, shift] = [20, -0.125, 0.375];
  const offsets = [2 ** -10, -(2 ** -9), 2 ** -8, -(2 ** -7)];
  const rays = setOf([
    { point: [0, y0], direction: [0, u0, 1] },
    ...offsets.map((du) => ({ point: [0, y0 - shift * du] as const, direction: [0, u0 + du, 1] })),
  ]);
  const focus = relativeFocus(rays, 0, [1, 2, 3, 4], "tangential");
  assert.ok(focus.available);
  assert.equal(focus.shiftMm, shift);
  assert.equal(focus.rays, 4);
  const squares = offsets.reduce((sum, du) => sum + du * du, 0);
  assert.equal(focus.rmsSlope, nearestRoot(dyadicOf(squares), dyadicOf(4)));
  // In front of the plane, and the same rays read as a sagittal fan have no slope apart from the chief ray's.
  const ahead = setOf([
    { point: [0, y0], direction: [0, u0, 1] },
    ...offsets.map((du) => ({ point: [0, y0 + 1.5 * du] as const, direction: [0, u0 + du, 1] })),
  ]);
  const front = relativeFocus(ahead, 0, [1, 2, 3, 4], "tangential");
  assert.ok(front.available);
  assert.equal(front.shiftMm, -1.5);
  const across = relativeFocus(rays, 0, [1, 2, 3, 4], "sagittal");
  assert.ok(!across.available);
  assert.equal(across.reason, "no-slope");
});

test("an astigmatic field has a tangential and a sagittal focus apart, each to the bit, whichever ray is the chief", () => {
  // The chief ray at (0, -12) mm along (0, 0.25, 1); its tangential pair crosses it 0.5 mm behind the plane, its
  // sagittal pair -0.25 mm, in front of it. The sagittal rays are skew: their y and their y slope are the chief ray's.
  const [y0, u0, tangential, sagittal, d] = [-12, 0.25, 0.5, -0.25, 2 ** -12];
  const chief = { point: [0, y0] as const, direction: [0, u0, 1] };
  const rays = [
    { point: [0, y0 - tangential * d] as const, direction: [0, u0 + d, 1] },
    { point: [0, y0 + tangential * d] as const, direction: [0, u0 - d, 1] },
    { point: [-sagittal * d, y0] as const, direction: [d, u0, 1] },
    { point: [sagittal * d, y0] as const, direction: [-d, u0, 1] },
  ];
  for (const at of [0, 2, 4]) {
    const ordered = [...rays.slice(0, at), chief, ...rays.slice(at)];
    const set = setOf(ordered);
    const others = [0, 1, 2, 3, 4].filter((ray) => ray !== at);
    const [tangentialRays, sagittalRays] = [others.slice(0, 2), others.slice(2)];
    const t = relativeFocus(set, at, tangentialRays, "tangential");
    const s = relativeFocus(set, at, sagittalRays, "sagittal");
    assert.ok(t.available && s.available, `chief at ${at}`);
    assert.equal(t.shiftMm, tangential);
    assert.equal(s.shiftMm, sagittal);
    assert.equal(t.rmsSlope, d);
    assert.equal(s.rmsSlope, d);
  }
});

test("the least-squares focus of a fan with spherical aberration is its closed form, s0 - a sum du^4 / sum du^2", () => {
  // Rays of a fan land dc = -s0 du + a du^3 from the chief ray: no plane brings them all to it, and the plane of least
  // squares is s0 - a (sum du^4) / (sum du^2). Binary fractions throughout; the quotient is rounded once.
  const [y0, u0, s0, a] = [5, -0.0625, 0.125, 3];
  const offsets = [-0.25, -0.125, -0.0625, 0.0625, 0.125, 0.25, 0.1875];
  const rays = setOf([
    { point: [0, y0], direction: [0, u0, 1] },
    ...offsets.map((du) => ({ point: [0, y0 - s0 * du + a * du ** 3] as const, direction: [0, u0 + du, 1] })),
  ]);
  const focus = relativeFocus(rays, 0, [1, 2, 3, 4, 5, 6, 7], "tangential");
  assert.ok(focus.available);
  const [fourth, second] = [offsets.reduce((s, du) => s + du ** 4, 0), offsets.reduce((s, du) => s + du ** 2, 0)];
  const expected = nearestQuotient(dyadicOf(s0 * second - a * fourth), dyadicOf(second));
  assert.equal(focus.shiftMm, expected);
  // A ray that is not taken is in neither sum: the focus of the rest.
  const valid = [1, 0, 1, 1, 1, 1, 1, 1];
  const without = relativeFocus({ ...rays, valid }, 0, [1, 2, 3, 4, 5, 6, 7], "tangential");
  assert.ok(without.available);
  const rest = offsets.slice(1);
  const [fourthRest, secondRest] = [rest.reduce((s, du) => s + du ** 4, 0), rest.reduce((s, du) => s + du ** 2, 0)];
  assert.equal(without.shiftMm, nearestQuotient(dyadicOf(s0 * secondRest - a * fourthRest), dyadicOf(secondRest)));
  assert.equal(without.rays, 6);
});

/** A unit direction of the slopes (v, u) as an engine would hand it: each component rounded once. */
function unitOf(v: number, u: number): number[] {
  const norm = Math.sqrt(v * v + u * u + 1);
  return [v / norm, u / norm, 1 / norm];
}

test("the focus of a parabasal pair is within a unit of the exact focus of the doubles given; the plain sum is not", () => {
  // Parabasal pairs as LensVisualizer launches them: a chief ray up to 25 mm off the axis, slopes up to 0.8, its pair
  // 1e-6 to 1e-4 mm apart on the plane and 1e-5 to 2e-4 apart in slope, with unit directions whose ratios are no
  // binary fractions. The exact focus is worked out in whole numbers.
  const next = series(31);
  let plainMisses = 0;
  let nearestHits = 0;
  const sets = 4000;
  for (let set = 0; set < sets; set++) {
    const axis: FocusAxis = set % 2 === 0 ? "tangential" : "sagittal";
    const [c0, u0, v0] = [(next() - 0.5) * 50, (next() - 0.5) * 1.6, (next() - 0.5) * 0.4];
    const rays = [{ point: [axis === "sagittal" ? c0 : 0, axis === "sagittal" ? 0 : c0] as const, u: u0, v: v0 }];
    for (const sign of [-1, 1]) {
      const du = sign * (1e-5 + next() * 2e-4);
      const dc = (next() - 0.5) * 2e-4;
      const point = axis === "sagittal" ? ([c0 + dc, 0] as const) : ([0, c0 + dc] as const);
      rays.push(axis === "sagittal" ? { point, u: u0, v: v0 + du } : { point, u: u0 + du, v: v0 });
    }
    const focusRays = setOf(rays.map(({ point, u, v }) => ({ point, direction: unitOf(v, u) })));
    const focus = relativeFocus(focusRays, 0, [1, 2], axis);
    assert.ok(focus.available, `set ${set}`);
    const exact = exactFocus(focusRays, 0, [1, 2], axis);
    const want = nearest(exact.shift);
    assert.ok(Math.abs(focus.shiftMm - want) <= ulp(want), `set ${set}: ${focus.shiftMm} against ${want}`);
    if (focus.shiftMm === want) nearestHits++;
    assert.ok(
      Math.abs(focus.rmsSlope - nearestRoot(...rootOf(exact.weight, 2))) <= 2 * ulp(focus.rmsSlope),
      `set ${set}`,
    );
    // The plain formula: the slopes and their differences rounded, the sums of rounded products.
    const at = axis === "sagittal" ? 0 : 1;
    const plainSlope = (ray: number) => focusRays.direction[3 * ray + at] / focusRays.direction[3 * ray + 2];
    let [moment, weight] = [0, 0];
    for (const ray of [1, 2]) {
      const dc = focusRays.landing[3 * ray + at] - focusRays.landing[at];
      const du = plainSlope(ray) - plainSlope(0);
      moment += dc * du;
      weight += du * du;
    }
    if (Math.abs(-moment / weight - want) > ulp(want)) plainMisses++;
  }
  assert.ok(nearestHits > 0.95 * sets, `${nearestHits} of ${sets} the nearest double`);
  assert.ok(plainMisses > sets / 2, `the plain formula misses ${plainMisses} of ${sets}`);
});

/** A fraction as the numerator and denominator `nearestRoot` takes for the square root of it over `count`. */
function rootOf(
  value: Fraction,
  count: number,
): [{ numerator: bigint; shift: number }, { numerator: bigint; shift: number }] {
  return [
    { numerator: value.num, shift: 0 },
    { numerator: value.den * BigInt(count), shift: 0 },
  ];
}

test("the focus of a fan focused near its plane, whose moments cancel, is within a unit of the exact one", () => {
  // Fans across a whole pupil: landings within a micrometre of the chief ray's (the plane near the focus, so the
  // moments of the rays on either side cancel), slopes on both sides of the chief ray's, coordinates that are not
  // within a factor two of the chief ray's (so a difference is not exact) for a share of the sets.
  const next = series(43);
  let plainMisses = 0;
  const sets = 600;
  for (let set = 0; set < sets; set++) {
    const axis: FocusAxis = set % 3 === 0 ? "sagittal" : "tangential";
    const at = axis === "sagittal" ? 0 : 1;
    const c0 = set % 2 === 0 ? (next() - 0.5) * 4e-3 : (next() - 0.5) * 40;
    const [u0, v0] = [(next() - 0.5) * 0.8, axis === "sagittal" ? 0 : (next() - 0.5) * 0.1];
    const shift = (next() - 0.5) * 1e-3;
    const rays = [{ point: [0, 0] as [number, number], u: u0, v: v0 }];
    rays[0].point[at] = c0;
    for (let ray = 0; ray < 12; ray++) {
      const du = (next() - 0.5) * 0.6;
      const point: [number, number] = [0, 0];
      point[at] = c0 - shift * du + (next() - 0.5) * 1e-9;
      rays.push(axis === "sagittal" ? { point, u: u0, v: v0 + du } : { point, u: u0 + du, v: v0 });
    }
    const focusRays = setOf(rays.map(({ point, u, v }) => ({ point, direction: unitOf(v, u) })));
    const members = Array.from({ length: 12 }, (_, ray) => ray + 1);
    const focus = relativeFocus(focusRays, 0, members, axis);
    assert.ok(focus.available, `set ${set}`);
    const want = nearest(exactFocus(focusRays, 0, members, axis).shift);
    assert.ok(Math.abs(focus.shiftMm - want) <= ulp(want), `set ${set}: ${focus.shiftMm} against ${want}`);
    const plainSlope = (ray: number) => focusRays.direction[3 * ray + at] / focusRays.direction[3 * ray + 2];
    let [moment, weight] = [0, 0];
    for (const ray of members) {
      const dc = focusRays.landing[3 * ray + at] - focusRays.landing[at];
      const du = plainSlope(ray) - plainSlope(0);
      moment += dc * du;
      weight += du * du;
    }
    if (Math.abs(-moment / weight - want) > ulp(want)) plainMisses++;
  }
  assert.ok(plainMisses > sets / 10, `the plain formula misses ${plainMisses} of ${sets}`);
});

test("the focus of an aberrated fan near the axis, on the plane of its own focus, keeps every rest", () => {
  // A real-ray fan of a field near the axis: the chief ray within a micrometre of it, at a slope within 0.01 of 0, the
  // fan's rays landing up to 0.05 mm away with coma and spherical aberration (dc = a3 du^3 + a2 du^2 - s du) and slopes
  // up to 0.4 apart. A landing is then not within a factor two of the chief ray's, nor a slope of its slope, so neither
  // difference is exact; and the plane is put within 1e-12 mm of the fan's own least-squares focus, where the moments
  // cancel to a part in a hundred million: the rests of the differences are then all of the focus the doubles have.
  const next = series(59);
  const sets = 600;
  for (let set = 0; set < sets; set++) {
    const axis: FocusAxis = set % 2 === 0 ? "tangential" : "sagittal";
    const at = axis === "sagittal" ? 0 : 1;
    const [c0, u0] = [(next() - 0.5) * 2e-6, (next() - 0.5) * 2e-2];
    const [a3, a2] = [(next() - 0.5) * 2, (next() - 0.5) * 0.4];
    const offsets = Array.from({ length: 10 }, () => (next() - 0.5) * 0.8);
    const [second, third, fourth] = [2, 3, 4].map((power) => offsets.reduce((sum, du) => sum + du ** power, 0));
    // The focus of dc = a3 du^3 + a2 du^2 about the plane, and a plane 1e-12 mm from it.
    const shift = (a3 * fourth + a2 * third) / second + (next() - 0.5) * 2e-12;
    const rays = [
      { point: [0, 0] as [number, number], u: axis === "sagittal" ? 0 : u0, v: axis === "sagittal" ? u0 : 0 },
    ];
    rays[0].point[at] = c0;
    for (const du of offsets) {
      const point: [number, number] = [0, 0];
      point[at] = c0 + a3 * du ** 3 + a2 * du ** 2 - shift * du;
      rays.push(axis === "sagittal" ? { point, u: 0, v: u0 + du } : { point, u: u0 + du, v: 0 });
    }
    const focusRays = setOf(rays.map(({ point, u, v }) => ({ point, direction: unitOf(v, u) })));
    const members = offsets.map((_, ray) => ray + 1);
    const focus = relativeFocus(focusRays, 0, members, axis);
    assert.ok(focus.available, `set ${set}`);
    const want = nearest(exactFocus(focusRays, 0, members, axis).shift);
    assert.ok(Math.abs(focus.shiftMm - want) <= ulp(want), `set ${set}: ${focus.shiftMm} against ${want}`);
  }
});

test("a fan without a focus says why, and arrays of another set or an index of no ray throw", () => {
  const rays = setOf([
    { point: [0, 1], direction: [0, 0.1, 1] },
    { point: [0, 1.001], direction: [0, 0.11, 1] },
    { point: [0, Number.NaN], direction: [0, 0.12, 1] },
    { point: [0, 1], direction: [0, 1, 0] },
    { point: [0, 1], direction: [0, 0.1, 1] },
  ]);
  const reason = (outcome: ReturnType<typeof relativeFocus>): string =>
    outcome.available ? "available" : outcome.reason;
  assert.equal(reason(relativeFocus({ ...rays, valid: [0, 1, 1, 1, 1] }, 0, [1], "tangential")), "no-reference");
  assert.equal(reason(relativeFocus({ ...rays, valid: [1, 0, 1, 1, 1] }, 0, [1], "tangential")), "no-rays");
  assert.equal(reason(relativeFocus(rays, 0, [], "tangential")), "no-rays");
  assert.equal(reason(relativeFocus(rays, 0, [1, 2], "tangential")), "bad-ray");
  assert.equal(reason(relativeFocus(rays, 2, [1], "tangential")), "bad-ray");
  assert.equal(reason(relativeFocus(rays, 0, [3], "tangential")), "out-of-range");
  assert.equal(reason(relativeFocus(rays, 3, [1], "tangential")), "out-of-range");
  assert.equal(reason(relativeFocus(rays, 0, [4], "tangential")), "no-slope");
  // The chief ray's own index among the members adds nothing to either sum.
  const alone = relativeFocus(rays, 0, [0, 1], "tangential");
  const pair = relativeFocus(rays, 0, [1], "tangential");
  assert.ok(alone.available && pair.available);
  assert.equal(alone.shiftMm, pair.shiftMm);
  assert.equal(alone.rays, 2);
  assert.throws(() => relativeFocus({ ...rays, direction: [0, 0, 1] }, 0, [1], "tangential"), RangeError);
  assert.throws(() => relativeFocus({ ...rays, valid: [1] }, 0, [1], "tangential"), RangeError);
  assert.throws(() => relativeFocus(rays, 5, [1], "tangential"), RangeError);
  assert.throws(() => relativeFocus(rays, 0, [1.5], "tangential"), RangeError);
});
