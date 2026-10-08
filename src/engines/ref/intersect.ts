// Where a ray's line meets one surface of the reference engine's model. A plane and a conic are met in closed
// form; a conic with a polynomial by Newton's method from the conic's own hit, carried to a fixed point in double
// precision, and where that settles on no hit, by a scan of the line for its crossings of the sag. It is written
// from the geometry alone and shares nothing with any other tracer.
//
// A surface is its sag within its clear aperture (contract/CONTRACT.md, `rays.trace`): the line meets the surface
// where it crosses the sag inside the clear aperture, and nowhere else, whatever the formula does beyond the rim.
//
// How precision is kept:
//
// - The line is first carried to the surface's vertex plane, one division and two multiplications, and the surface
//   is then met from there: what is solved for is a step of the size of the sag, not of the gap in front of it, so
//   its rounding is that of the sag.
// - On the vertex plane the conic c (x^2 + y^2 + (1 + K) z^2) - 2 z = 0 is a quadratic A s^2 + 2 B s + C = 0 in
//   the step s. Its root nearest the plane is C / q with q = -(B + sign(B) sqrt(B^2 - A C)): the two numbers under
//   q have one sign, so nothing cancels, where the textbook (-B + sqrt(...)) / A subtracts two nearly equal ones.
// - With a polynomial p(r) the surface is the same conic in w = z - p(r), so Newton's method runs on
//   G = c (r^2 + (1 + K) w^2) - 2 w, which has no square root in it: it is defined at every point of the line, and
//   it is as well conditioned at the rim of a hemisphere as at the vertex. p and p' are compensated sums
//   (`polynomial`, surface.ts).
// - The root of the conic at the hit, which the normal needs, is 1 - (1 + K) c w: one multiplication and one
//   subtraction, where sqrt(1 - (1 + K) c^2 r^2) loses its digits near the height at which the conic ends.
import type { RefSurface } from "./model.ts";
import { polynomial, sag, slope } from "./surface.ts";

/** Where a line meets a surface, within the surface's clear aperture. */
export interface SurfaceHit {
  readonly kind: "hit";
  /**
   * The parameter of the hit along the line: the hit is the line's point plus `t` times its direction. It is
   * negative for a hit behind the point the line was given by.
   */
  readonly t: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  /** The root of the surface's conic at the hit, 1 - (1 + K) c w: what `unitNormalAt` takes. 1 on a flat base. */
  readonly root: number;
}

/**
 * What became of meeting a line with a surface:
 *
 * - `hit`: the line crosses the surface within its clear aperture;
 * - `miss`: it does not: it crosses the sag outside the clear aperture or inside the central obstruction, or it
 *   does not cross the sag at all;
 * - `failed`: the crossing could not be decided, which says nothing about the line.
 */
export type Intersection = SurfaceHit | { readonly kind: "miss" } | { readonly kind: "failed" };

const MISS: Intersection = Object.freeze({ kind: "miss" });
const FAILED: Intersection = Object.freeze({ kind: "failed" });

/** How many Newton steps a hit may take. A smooth surface needs five or six from its conic. */
export const NEWTON_STEP_CAP = 40;

/** How many times a bracket is halved: beyond any double's spacing at the scale of a surface. */
export const BISECTION_STEP_CAP = 200;

/**
 * How many equal parts the stretch of a line within a clear aperture is cut into when it is scanned for crossings
 * that Newton's method did not find. A lens surface is a conic with a polynomial of a few terms: along a line it
 * nears the line and leaves it a handful of times at most.
 */
export const SCAN_PARTS = 32;

/**
 * How large the residual of a hit may be, in units of the rounding of what it is made of: a few units in the last
 * place of the sag. The residual is the sum of three rounded products and a compensated polynomial, so its own
 * rounding is below this.
 */
export const RESIDUAL_ULPS = 16;

const EPSILON = 2 ** -53;

/** Whether a point at the height of (x, y) lies within a surface's clear aperture: both limits are inclusive. */
export function withinAperture(surface: RefSurface, x: number, y: number): boolean {
  const r = Math.sqrt(x * x + y * y);
  return r <= surface.clipRadius && r >= surface.innerClipRadius;
}

/**
 * The steps, from a point of the vertex plane, at which a line crosses the sag sheet of a conic: the root nearest
 * the vertex plane first. The sheet is the part of the quadric the sag formula describes, where the conic's root
 * 1 - (1 + K) c z is not negative. An empty list when the line misses the sheet.
 */
function conicSteps(c: number, k1: number, x0: number, y0: number, dx: number, dy: number, dz: number): number[] {
  const a = c * (dx * dx + dy * dy + k1 * dz * dz);
  const b = c * (x0 * dx + y0 * dy) - dz;
  const constant = c * (x0 * x0 + y0 * y0);
  const discriminant = b * b - a * constant;
  if (!(discriminant >= 0)) return [];
  const q = b > 0 ? -(b + Math.sqrt(discriminant)) : Math.sqrt(discriminant) - b;
  // The product of the roots is C / A, and q^2 is at least |A C|: so C / q is the one of smaller magnitude.
  const candidates = q === 0 ? [0] : a === 0 ? [constant / q] : [constant / q, q / a];
  return candidates.filter((step) => Number.isFinite(step) && 1 - k1 * c * (step * dz) >= 0);
}

/**
 * The stretch of a line, as steps from the point (x0, y0) of the vertex plane, on which it is within the radial
 * height `reach` of the axis: null when it never is. The ends are infinite for a line parallel to the axis.
 */
function stretchWithin(
  reach: number,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
): { readonly from: number; readonly to: number } | null {
  const a = dx * dx + dy * dy;
  const b = x0 * dx + y0 * dy;
  const constant = x0 * x0 + y0 * y0 - reach * reach;
  if (a === 0) return constant <= 0 ? { from: -Infinity, to: Infinity } : null;
  const discriminant = b * b - a * constant;
  if (!(discriminant >= 0)) return null;
  const q = b > 0 ? -(b + Math.sqrt(discriminant)) : Math.sqrt(discriminant) - b;
  if (q === 0) return { from: 0, to: 0 };
  const [one, other] = [constant / q, q / a];
  return one <= other ? { from: one, to: other } : { from: other, to: one };
}

/** How far a point of a line is above a sag, along z, and how fast that grows along the line. */
interface Above {
  readonly value: number;
  readonly rate: number;
}

/**
 * The crossing between two steps of a line that lie on different sides of a sag, where `above` says how far the
 * line is above it: the bracket is halved until its ends are neighbouring doubles, and the end nearer the sag is the
 * crossing. NaN when the sag has no value at a step on the way.
 */
function halvedCrossing(
  above: (step: number) => Above,
  from: number,
  to: number,
  atFrom: number,
  atTo: number,
): number {
  let [low, high, atLow, atHigh] = [from, to, atFrom, atTo];
  for (let halving = 0; halving < BISECTION_STEP_CAP; halving++) {
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) break;
    const { value } = above(middle);
    if (Number.isNaN(value)) return NaN;
    if (value === 0) return middle;
    if (value > 0 === atLow > 0) [low, atLow] = [middle, value];
    else [high, atHigh] = [middle, value];
  }
  return Math.abs(atLow) <= Math.abs(atHigh) ? low : high;
}

/**
 * A step between two others, at both of which a line is on one side of a sag, at which it is on the sag or on its
 * other side, with how far above the sag it is there: null when there is none to be found.
 *
 * There can be one only where the line nears the sag at the first step and leaves it at the second: between them
 * it then comes nearest to the sag, and that point is closed in on by halving, on the sign of the rate, until a step
 * is across or the nearest point is known to a rounding and is not. A value of NaN is a step at which the sag has
 * none.
 */
function stepAcross(
  above: (step: number) => Above,
  from: number,
  to: number,
  atFrom: Above,
  atTo: Above,
): { readonly step: number; readonly value: number } | null {
  // `side` times the rate is how fast the line leaves the sag on the side it is on.
  const side = atFrom.value > 0 ? 1 : -1;
  if (!(side * atFrom.rate < 0 && side * atTo.rate > 0)) return null;
  let [low, high] = [from, to];
  for (let halving = 0; halving < BISECTION_STEP_CAP; halving++) {
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) break;
    const { value, rate } = above(middle);
    if (!(side * value > 0)) return { step: middle, value };
    if (side * rate < 0) low = middle;
    else if (side * rate > 0) high = middle;
    else break;
  }
  return null;
}

/**
 * The steps at which a line crosses a sag within a stretch of it, the one nearest the vertex plane first: an empty
 * list when it crosses nowhere on the stretch, and "undecided" when the sag has no value at a step that is asked,
 * as beyond the height at which a conic ends.
 *
 * Newton's method is not used. The sag's own formula says on which side of the surface a point of the line lies,
 * and its slope whether the line is nearing the surface there or leaving it. The stretch is cut into `SCAN_PARTS`
 * equal parts, and the two are taken at their ends:
 *
 * - a part whose ends lie on different sides holds a crossing (`halvedCrossing`);
 * - a part whose ends lie on one side holds two crossings where the line dips through the surface between them, and
 *   one where it touches it (`stepAcross`). A dip far shorter than a part is found so, and a line that stays clear
 *   of the surface by as little is told from it.
 *
 * What is decided is what the scan can see: a sag that swung to the line and back twice within one part would hide
 * a pair of crossings, which no profile of a few terms does over its clear aperture.
 */
function crossingSteps(
  surface: RefSurface,
  stretch: { readonly from: number; readonly to: number },
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  dz: number,
): number[] | "undecided" {
  const { profile } = surface;
  if (!Number.isFinite(stretch.from) || !Number.isFinite(stretch.to)) {
    // Parallel to the axis: the height is the same all along, and the crossing is one division.
    const height = sag(profile, Math.sqrt(x0 * x0 + y0 * y0));
    return Number.isFinite(height) ? [height / dz] : "undecided";
  }
  const above = (step: number): Above => {
    const [x, y] = [x0 + step * dx, y0 + step * dy];
    const r = Math.sqrt(x * x + y * y);
    // dr/ds along the line. On the axis a smooth sag has no slope, and the rate is the line's own.
    const radial = r === 0 ? 0 : (x * dx + y * dy) / r;
    return { value: step * dz - sag(profile, r), rate: dz - slope(profile, r) * radial };
  };
  const stepOf = (part: number): number =>
    part === SCAN_PARTS ? stretch.to : stretch.from + ((stretch.to - stretch.from) * part) / SCAN_PARTS;

  const crossings: number[] = [];
  let [here, atHere] = [stepOf(0), above(stepOf(0))];
  for (let part = 1; part <= SCAN_PARTS; part++) {
    const next = stepOf(part);
    const atNext = above(next);
    if (Number.isNaN(atHere.value) || Number.isNaN(atNext.value)) return "undecided";
    if (atHere.value === 0) crossings.push(here);
    else if (atNext.value === 0) {
      // The next part takes it, or the end of the scan.
    } else if (atHere.value > 0 !== atNext.value > 0) {
      crossings.push(halvedCrossing(above, here, next, atHere.value, atNext.value));
    } else {
      const across = stepAcross(above, here, next, atHere, atNext);
      if (across !== null && Number.isNaN(across.value)) return "undecided";
      if (across !== null && across.value === 0) crossings.push(across.step);
      else if (across !== null) {
        crossings.push(
          halvedCrossing(above, here, across.step, atHere.value, across.value),
          halvedCrossing(above, across.step, next, across.value, atNext.value),
        );
      }
    }
    [here, atHere] = [next, atNext];
  }
  if (atHere.value === 0) crossings.push(here);
  if (crossings.some((step) => Number.isNaN(step))) return "undecided";
  return crossings.sort((a, b) => Math.abs(a) - Math.abs(b));
}

/**
 * Meets a line with a conic that carries a polynomial, from the point (x0, y0) of its vertex plane.
 *
 * Newton's method starts at the base conic's own hit, or on the vertex plane where the conic has none, and steps on
 * G = c (r^2 + (1 + K) w^2) - 2 w, with w = z - p(r), until an iterate is no better than the best before it: a
 * fixed point of the iteration in double precision. It has converged when the residual there is within
 * `RESIDUAL_ULPS` roundings of the terms it is made of. A hit it converges to on the sag sheet and within the clear
 * aperture is the answer: from the conic's hit nearest the vertex plane, the surface's own crossing beside it.
 *
 * Anything else is decided without Newton (`crossingSteps`), on the stretch of the line that is within the clip
 * radius of the axis, and within the height at which the conic ends: a line that has no such stretch misses, and so
 * does one on whose stretch no crossing is found; of several crossings the one nearest the vertex plane that lies
 * within the clear aperture is the hit, as for a conic. So a ray is never lost to a polynomial that diverges beyond
 * the rim, nor to an iteration that has no slope to go by, as where the line is tangent to the base conic and cuts
 * the surface on either side of that point. Only a crossing that cannot be decided, where the sag has no value at a
 * point of the stretch, is "failed".
 */
function meetAsphere(
  surface: RefSurface,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  dz: number,
): { readonly step: number; readonly root: number } | "miss" | "failed" {
  const { curvature: c, conic, terms } = surface.profile;
  const k1 = 1 + conic;
  // Beyond the height at which its conic ends a surface has no sag, whatever its clear aperture is stated as.
  const closing = k1 * c * c;
  const reach = closing > 0 ? Math.min(surface.clipRadius, 1 / Math.sqrt(closing)) : surface.clipRadius;
  const stretch = stretchWithin(reach, x0, y0, dx, dy);
  if (stretch === null) return "miss";

  const transverse = Math.sqrt(dx * dx + dy * dy);
  const [start = 0] = c === 0 ? [] : conicSteps(c, k1, x0, y0, dx, dy, dz);
  let step = Math.min(Math.max(start, stretch.from), stretch.to);
  let best: { step: number; residual: number; allowed: number; root: number } | null = null;
  for (let iteration = 0; iteration < NEWTON_STEP_CAP; iteration++) {
    const [x, y, z] = [x0 + step * dx, y0 + step * dy, step * dz];
    const rr = x * x + y * y;
    const r = Math.sqrt(rr);
    const [p, polynomialSlope] = polynomial(terms, r);
    const w = z - p;
    const root = 1 - k1 * c * w;
    const g = c * (rr + k1 * w * w) - 2 * w;
    // dr/ds along the line; on the axis the line leaves it at its transverse speed.
    const radial = r === 0 ? transverse : (x * dx + y * dy) / r;
    const derivative = 2 * (c * (x * dx + y * dy) - root * (dz - polynomialSlope * radial));
    if (!Number.isFinite(g) || !Number.isFinite(derivative)) break;
    const residual = Math.abs(g);
    if (best !== null && residual >= best.residual) break;
    const scale = Math.abs(c) * rr + Math.abs(c * k1) * w * w + 2 * (Math.abs(z) + Math.abs(p));
    best = { step, residual, allowed: RESIDUAL_ULPS * EPSILON * scale, root };
    if (g === 0 || derivative === 0) break;
    const next = step - g / derivative;
    if (next === step) break;
    step = next;
  }
  if (best !== null && best.residual <= best.allowed && best.root >= 0) {
    if (withinAperture(surface, x0 + best.step * dx, y0 + best.step * dy)) return best;
  }

  const crossings = crossingSteps(surface, stretch, x0, y0, dx, dy, dz);
  if (crossings === "undecided") return "failed";
  for (const crossing of crossings) {
    const [x, y] = [x0 + crossing * dx, y0 + crossing * dy];
    if (!withinAperture(surface, x, y)) continue;
    const w = crossing * dz - polynomial(terms, Math.sqrt(x * x + y * y))[0];
    return { step: crossing, root: 1 - k1 * c * w };
  }
  return "miss";
}

/**
 * Meets the line through (px, py, pz) along (dx, dy, dz) with a surface.
 *
 * The line is carried to the surface's vertex plane and the surface is met from there:
 *
 * - a plane at that point, in closed form;
 * - a conic at the root of its quadratic (`conicSteps`) that lies on the sag sheet and within the clear aperture:
 *   the one nearest the vertex plane when both do;
 * - a conic with a polynomial by Newton's method (`meetAsphere`).
 *
 * The step may be negative: a surface that lies behind the point, as where two neighbouring surfaces cross within
 * their clear apertures, is met behind it. A hit is one within the clear aperture, both of whose limits are
 * inclusive (`withinAperture`). A line that travels perpendicular to the axis crosses no vertex plane and is taken
 * to meet no surface.
 */
export function intersectSurface(
  surface: RefSurface,
  px: number,
  py: number,
  pz: number,
  dx: number,
  dy: number,
  dz: number,
): Intersection {
  if (dz === 0) return MISS;
  const toPlane = (surface.z - pz) / dz;
  const [x0, y0] = [px + toPlane * dx, py + toPlane * dy];
  if (!Number.isFinite(x0) || !Number.isFinite(y0)) return FAILED;
  const { curvature: c, conic, terms } = surface.profile;

  if (terms.length > 0) {
    const met = meetAsphere(surface, x0, y0, dx, dy, dz);
    if (met === "miss") return MISS;
    if (met === "failed") return FAILED;
    const { step, root } = met;
    return { kind: "hit", t: toPlane + step, x: x0 + step * dx, y: y0 + step * dy, z: surface.z + step * dz, root };
  }
  if (c === 0) {
    return withinAperture(surface, x0, y0) ? { kind: "hit", t: toPlane, x: x0, y: y0, z: surface.z, root: 1 } : MISS;
  }
  const k1 = 1 + conic;
  for (const step of conicSteps(c, k1, x0, y0, dx, dy, dz)) {
    const [x, y] = [x0 + step * dx, y0 + step * dy];
    if (!withinAperture(surface, x, y)) continue;
    return { kind: "hit", t: toPlane + step, x, y, z: surface.z + step * dz, root: 1 - k1 * c * (step * dz) };
  }
  return MISS;
}
