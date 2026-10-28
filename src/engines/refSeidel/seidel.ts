// `seidel.native` as the engine `ref-seidel` answers it: the third-order (Seidel) sums of a case at one line, written
// from the optics alone on the reference engine's model of the case (`buildRefSystem`, `vertexCurvature`). No code of
// LensVisualizer's or optiland's is ported here.
//
// Two paraxial rays are traced with the indices of the line, as (height y, slope u) from surface to surface: the
// marginal ray, from the axial object point (parallel to the axis for an object at infinity) through the rim of the
// stop at the height +stopSemiDiameter, and the chief ray of the field `maxFieldDeg`, whose slope in object space is
// tan(maxFieldDeg) and which crosses the axis at the stop. The air in front of the system has the index 1. At each
// surface, of curvature c at its vertex (`vertexCurvature`), between the indices n and n', with the rays' heights and
// slopes in front of it, Welford's sums (Aberrations of Optical Systems, ch. 8), in OpticStudio's names and signs:
//
//   A = n (y c + u), Abar = n (ybar c + ubar), H = n (ubar y - u ybar) (the Lagrange invariant, the same at every
//   surface), Delta(u/n) = u'/n' - u/n = -(n' - n) (u (n + n') + n y c) / (n n'^2),
//   Delta(1/n) = 1/n' - 1/n, Delta(1/n^2) = 1/n'^2 - 1/n^2;
//
//   SPHA = S1 = -A^2 y Delta(u/n) + 8 b (n' - n) y^4
//   COMA = S2 = -A Abar y Delta(u/n) + 8 b (n' - n) y^3 ybar
//   ASTI = S3 = -Abar^2 y Delta(u/n) + 8 b (n' - n) y^2 ybar^2
//   FCUR = S4 = -H^2 c Delta(1/n)
//   DIST = S5 = -Abar^3 y Delta(1/n^2) + Abar ybar c Delta(1/n) (Abar y + H) + 8 b (n' - n) y ybar^3
//            (Welford's (Abar / A)(S3 + S4), written without the division: Abar y - A ybar = H)
//   CLA = C1 = A y Delta(dn/n), CTR = C2 = Abar y Delta(dn/n), dn the index of the first dispersion line less that of
//   the second in the medium (0 in the air in front)
//
// where b is the surface's fourth-order departure from the sphere of its vertex curvature: of a conic of base
// curvature c0 and constant K with a term a4 r^4 and maybe a2 r^2 (vertex curvature c = c0 + 2 a2),
// b = ((1 + K) c0^3 - c^3) / 8 + a4, which is K c0^3 / 8 + a4 without a2. A term of power 6 and above is of fifth order
// and adds nothing. A term of power 1 (a cone) has no vertex curvature and one of power 3 adds a wavefront term of
// lower order than Seidel's: both are `unsupported`. The sums are in lens units, mm; a total is the compensated sum of
// the surfaces' terms, and every sum of two products that can cancel (y c + u and ybar c + ubar, the bracket of
// Delta(u/n), the refraction n u - y (n' - n) c of either ray, a height carried to the next surface or the image
// plane, the chromatic difference, the invariant at the first surface) is formed with the rounding of each product
// carried, so it is exact to one rounding of the doubles it is formed of (of which n + n', n y and (n' - n) c are each
// one rounding): a ray along a surface's normal, an object at its aplanatic point, a ray refracted parallel to the
// axis or reaching a surface where it crosses the axis, media of proportional dispersion and an object near the
// entrance pupil lose no digit to it.
//
// The sign. With the marginal ray at +y at the stop and the chief ray of positive slope, a positive surface converging
// a collimated beam has SPHA > 0 (undercorrected), as OpticStudio lists it; optiland states the negative of every one
// of the five (its `seidels()`, docs/gotchas.md).
//
// Arithmetic. Only IEEE 754 basic operations, in a fixed order; tan(maxFieldDeg) is a Taylor series of sine and
// cosine on an argument reduced to [0, pi/4], pi/2 - x formed of two doubles each above 45 degrees (`tanDegrees`).
import type { UnsupportedItem } from "../../contract/result.ts";
import { CHROMATIC_SUMS, SEIDEL_SUMS } from "../../contract/quantities/seidelNative.ts";
import type {
  SeidelNativeData,
  SeidelNativeSpec,
  SeidelSum,
  SeidelSums,
  SeidelSurface,
} from "../../contract/quantities/seidelNative.ts";
import { createExactSum, twoProductError, twoSumError } from "../../core/numeric/exact.ts";
import type { RefSystem } from "../ref/model.ts";
import { OBJECT_SPACE_INDEX, systemMatrices, vertexCurvature } from "../ref/paraxial.ts";

/** The name of the engine's method. */
export const SEIDEL_METHOD = "paraxial-seidel-sums";

/** The unsupported item of a term of power 3, which adds a wavefront term of lower order than Seidel's. */
export const CUBIC_SAG_TERM = "surface.asphere.cubic-term";

/** The unsupported item of a term of power 1, as for `paraxial.first-order`. */
export const LINEAR_SAG_TERM_ITEM = "surface.asphere.linear-term";

// ── tan of an angle in degrees ───────────────────────────────────────────────────────────────────────────────────

/** pi / 180 in two doubles. */
const RADIANS_HIGH = 0.017453292519943295;
const RADIANS_LOW = 2.9486522708701687e-19;
/** pi / 2 in two doubles, and pi / 4. */
const HALF_PI_HIGH = 1.5707963267948966;
const HALF_PI_LOW = 6.123233995736766e-17;
const QUARTER_PI = 0.7853981633974483;

/** 1 / k! for k = 0 .. 25, each one division of exact factorials (exact to 22!, then rounded). */
const INVERSE_FACTORIALS: readonly number[] = (() => {
  const out = [1];
  let factorial = 1;
  for (let k = 1; k <= 25; k++) {
    factorial *= k;
    out.push(1 / factorial);
  }
  return out;
})();

/** tan(h) for |h| <= pi/4: Taylor series of sine and cosine in h^2. */
function tanReduced(h: number): number {
  const square = h * h;
  let sine = 0;
  let cosine = 0;
  for (let k = 12; k >= 0; k--) {
    const sign = k % 2 === 0 ? 1 : -1;
    sine = sine * square + sign * INVERSE_FACTORIALS[2 * k + 1];
    cosine = cosine * square + sign * INVERSE_FACTORIALS[2 * k];
  }
  sine *= h;
  return sine / cosine;
}

/**
 * tan of an angle in degrees above -90 and below 90, with IEEE 754 basic operations only: the angle in radians,
 * reduced to [0, pi/4] by tan(x) = 1 / tan(pi/2 - x) above pi/4, then `tanReduced`. Above pi/4 the reduced angle is
 * formed of the radians and pi/2 each in two doubles: near 90 degrees their low parts are many units of the reduced
 * angle. Below pi/4 the radians' rounding, under a unit of the angle, moves tan by under a unit and is not carried: the
 * series' own roundings are some units. Within a few units in the last place (test/engines/refSeidel/seidel.test.ts
 * holds it to a series in whole numbers).
 */
export function tanDegrees(degrees: number): number {
  if (!(degrees > -90 && degrees < 90)) throw new RangeError(`tan of ${degrees} degrees is not taken`);
  if (degrees < 0) return -tanDegrees(-degrees);
  const high = degrees * RADIANS_HIGH;
  if (high <= QUARTER_PI) return tanReduced(high);
  // pi/2 - x: the high parts' difference is exact (Sterbenz), the low parts' is far below it.
  const low = twoProductError(degrees, RADIANS_HIGH, high) + degrees * RADIANS_LOW;
  const difference = HALF_PI_HIGH - high;
  const rest = HALF_PI_LOW - low;
  return 1 / tanReduced(difference + rest);
}

// ── Exact-to-one-rounding forms ──────────────────────────────────────────────────────────────────────────────────

/** a * b + c, the product's and the sum's roundings carried: exact to one rounding. */
function productPlus(a: number, b: number, c: number): number {
  const product = a * b;
  const sum = product + c;
  return sum + (twoProductError(a, b, product) + twoSumError(product, c, sum));
}

/** a * b - c * d, both products' roundings carried: exact to one rounding. */
function productDifference(a: number, b: number, c: number, d: number): number {
  const sum = createExactSum();
  sum.add(a, b);
  sum.add(-c, d);
  return sum.value();
}

// ── The answer ───────────────────────────────────────────────────────────────────────────────────────────────────

/** What the engine makes of a request: its data, or why it has none for this case. */
export type SeidelAnswer = { readonly data: SeidelNativeData } | { readonly unsupported: readonly UnsupportedItem[] };

/** A surface of the trace: where it is, its vertex curvature, its fourth-order departure, and the medium after it. */
interface Traced {
  readonly z: number;
  readonly curvature: number;
  readonly departure: number;
}

/** What keeps a case from having Seidel sums by this engine's rules: a term of power 1 or 3. */
function termRefusals(system: RefSystem): UnsupportedItem[] {
  const items: UnsupportedItem[] = [];
  for (const [power, item, why] of [
    [1, LINEAR_SAG_TERM_ITEM, "a cone has no curvature at its vertex"],
    [3, CUBIC_SAG_TERM, "a term of power 3 adds a wavefront term of lower order than the Seidel sums'"],
  ] as const) {
    const at = system.surfaces.findIndex((surface) => surface.profile.terms.some((term) => term.power === power));
    if (at >= 0) items.push({ code: "feature", item, message: `surface ${at} has a term of power ${power}: ${why}` });
  }
  return items;
}

/** The fourth-order departure b of a profile from the sphere of its vertex curvature (the module's documentation). */
function departureOf(system: RefSystem, at: number, vertex: number): number {
  const { curvature, conic, terms } = system.surfaces[at].profile;
  const a4 = terms.find((term) => term.power === 4)?.coeff ?? 0;
  const quadratic = terms.some((term) => term.power === 2);
  const cube = curvature * curvature * curvature;
  if (!quadratic) return productPlus(conic, cube / 8, a4);
  const vertexCube = vertex * vertex * vertex;
  const sum = createExactSum();
  sum.add(1 + conic, cube / 8);
  sum.add(-1, vertexCube / 8);
  sum.add(1, a4);
  return sum.value();
}

function nullSums(): Record<SeidelSum, number | null> {
  return Object.fromEntries(SEIDEL_SUMS.map((name) => [name, null])) as Record<SeidelSum, number | null>;
}

/** The unsupported item of a line the case does not have, as every engine names it, or null. */
function linesBeyondCase(system: RefSystem, spec: SeidelNativeSpec): UnsupportedItem | null {
  const count = system.indexAfter.length;
  const beyond = [spec.line, ...(spec.dispersionLines ?? [])].filter((line) => line >= count);
  if (beyond.length === 0) return null;
  return {
    code: "option",
    item: "line",
    message: `the case has ${count} lines; the spec asks line ${beyond.join(", ")}`,
  };
}

/**
 * `seidel.native` of a model at the spec's line (the module's documentation). A spec naming a line the case does not
 * have is unsupported (`line`), as for every engine of the quantity; so is a term of power 1 or 3; a system whose
 * stop has no image in object space (its entrance pupil at infinity), or whose object lies in its entrance pupil, is
 * an answer `unavailable` with the reason.
 */
export function answerSeidel(system: RefSystem, spec: SeidelNativeSpec): SeidelAnswer {
  const beyond = linesBeyondCase(system, spec);
  const refused = [...(beyond === null ? [] : [beyond]), ...termRefusals(system)];
  if (refused.length > 0) return { unsupported: refused };

  const indices = system.indexAfter[spec.line];
  const traced: Traced[] = system.surfaces.map((surface, at) => {
    const curvature = vertexCurvature(surface.profile) as number;
    return { z: surface.z, curvature, departure: departureOf(system, at, curvature) };
  });
  const base: Omit<SeidelNativeData, "status" | "invariant" | "surfaces" | "total" | "sampling" | "notes"> = {
    line: { index: spec.line, wavelengthNm: system.wavelengthsNm?.[spec.line] ?? Number.NaN },
    maxFieldDeg: spec.maxFieldDeg,
    dispersionLines: spec.dispersionLines === undefined ? null : [spec.dispersionLines[0], spec.dispersionLines[1]],
    method: {
      name: SEIDEL_METHOD,
      params: {
        rays: "paraxial marginal through the stop's rim, chief of slope tan(maxFieldDeg) through its centre",
        convention: "OpticStudio: SPHA > 0 undercorrected",
        aspheric: "conic constant and term of power 4",
      },
    },
  };
  const unavailable = (reason: string, note: string): SeidelAnswer => ({
    data: {
      ...base,
      status: "unavailable",
      reason,
      invariant: null,
      surfaces: [],
      total: nullSums(),
      sampling: {},
      notes: [note],
    },
  });

  // Where the rays enter: the matrix from the first vertex plane to the stop's, on (y, n u), takes a height and a
  // reduced slope at the first vertex to the height at the stop, a y + b w.
  const { front } = systemMatrices(
    traced.map((surface, at) => ({ z: surface.z, curvature: surface.curvature, indexAfter: indices[at] })),
    system.stopIndex,
    true,
  );
  if (front.a === 0) {
    return unavailable(
      "system.telecentric.object-space",
      "the stop has no image in object space: no chief ray crosses its centre at a slope",
    );
  }
  const slope = tanDegrees(spec.maxFieldDeg);
  const first = traced[0].z;
  // The chief ray crosses the axis at the stop: a y1 + b ubar = 0.
  const chiefHeight = -(front.b * slope) / front.a;
  let marginalHeight: number;
  let marginalSlope: number;
  if (system.objectZ === null) {
    marginalHeight = system.stopSemiDiameter / front.a;
    marginalSlope = 0;
  } else {
    // From the axial object point: y1 = u (z1 - zo), and a y1 + b u = r.
    const reach = productPlus(front.a, first - system.objectZ, front.b);
    if (reach === 0) {
      return unavailable("object-at-entrance-pupil", "the object lies in the entrance pupil: no marginal ray");
    }
    marginalSlope = system.stopSemiDiameter / reach;
    marginalHeight = marginalSlope * (first - system.objectZ);
  }
  // H = n (ubar y - u ybar), n the index in front of the system.
  const invariant = OBJECT_SPACE_INDEX * productDifference(slope, marginalHeight, marginalSlope, chiefHeight);

  const pair = spec.dispersionLines;
  const dispersion =
    pair === undefined ? null : indices.map((_, at) => system.indexAfter[pair[0]][at] - system.indexAfter[pair[1]][at]);
  const totals = Object.fromEntries(SEIDEL_SUMS.map((name) => [name, createExactSum()])) as Record<
    SeidelSum,
    ReturnType<typeof createExactSum>
  >;
  const surfaces: SeidelSurface[] = [];
  let [y, u, ybar, ubar] = [marginalHeight, marginalSlope, chiefHeight, slope];
  let n = OBJECT_SPACE_INDEX;
  let dn = 0;
  for (const [at, surface] of traced.entries()) {
    const after = indices[at];
    const c = surface.curvature;
    const step = after - n;
    const A = n * productPlus(y, c, u);
    const Abar = n * productPlus(ybar, c, ubar);
    // Delta(u/n) = -(n' - n) (u (n + n') + n y c) / (n n'^2).
    const bracket = productDifference(u, n + after, -(n * y), c);
    const deltaUOverN = -(step * bracket) / (n * after * after);
    const deltaInverse = -step / (n * after);
    const deltaInverseSquare = -(step * (n + after)) / (n * n * after * after);
    const aspheric = 8 * surface.departure * step;
    const y2 = y * y;
    const sums: Record<SeidelSum, number | null> = nullSums();
    sums.SPHA = productPlus(-(A * A * y), deltaUOverN, aspheric * y2 * y2);
    sums.COMA = productPlus(-(A * Abar * y), deltaUOverN, aspheric * y2 * y * ybar);
    sums.ASTI = productPlus(-(Abar * Abar * y), deltaUOverN, aspheric * y2 * ybar * ybar);
    sums.FCUR = -(invariant * invariant * c * deltaInverse);
    const distortion = createExactSum();
    distortion.add(-(Abar * Abar * Abar * y), deltaInverseSquare);
    distortion.add(Abar * ybar * c * deltaInverse, productPlus(Abar, y, invariant));
    distortion.add(aspheric * y, ybar * ybar * ybar);
    sums.DIST = distortion.value();
    if (dispersion !== null) {
      // Delta(dn/n) = (dn' n - dn n') / (n n').
      const deltaDispersion = productDifference(dispersion[at], n, dn, after) / (n * after);
      sums.CLA = A * y * deltaDispersion;
      sums.CTR = Abar * y * deltaDispersion;
    }
    for (const name of SEIDEL_SUMS) {
      const value = sums[name];
      if (value !== null) totals[name].add(value, 1);
    }
    surfaces.push({ surface: at, ...(sums as SeidelSums) });
    // Refract, then go on to the next vertex: n' u' = n u - y (n' - n) c.
    const refracted = productDifference(n, u, y, step * c) / after;
    const refractedBar = productDifference(n, ubar, ybar, step * c) / after;
    const next = traced[at + 1];
    if (next !== undefined) {
      const gap = next.z - surface.z;
      y = productPlus(gap, refracted, y);
      ybar = productPlus(gap, refractedBar, ybar);
    }
    [u, ubar] = [refracted, refractedBar];
    n = after;
    if (dispersion !== null) dn = dispersion[at];
  }
  const total = Object.fromEntries(
    SEIDEL_SUMS.map((name) => [
      name,
      CHROMATIC_SUMS.includes(name) && dispersion === null ? null : totals[name].value(),
    ]),
  ) as Record<SeidelSum, number | null>;
  // The chief ray's height on the image plane of the case, and the marginal ray's slope behind the last surface.
  const last = traced[traced.length - 1];
  const imageHeight = productPlus(system.imageZ - last.z, ubar, ybar);
  return {
    data: {
      ...base,
      status: "ok",
      invariant,
      surfaces,
      total: total as SeidelSums,
      sampling: { marginalSlopeImageSpace: u, chiefHeightAtImageMm: imageHeight },
      notes: [],
    },
  };
}
