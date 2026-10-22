// The geometric optical transfer function of a bundle of rays, from where the rays land and nothing else: the
// comparator's own estimator, applied alike to every engine's trace of the same rays.
//
//   OTF(nu) = sum of w_i exp(-2 pi i nu (u_i - u_ref)) / sum of w_i
//
// over the rays i, with w_i the flux a ray carries to the image, u_i its landing along one axis of the image plane
// and u_ref one reference point. The MTF is the modulus. There is no bin and no transform: every ray is one term,
// at whatever frequency is asked, in cycles a millimetre.
//
// The conventions are those of LensVisualizer's `geometricOtf` (src/optics/analysis/mtfMath.ts) and of the way its
// MTF calls it (`fieldAtGrid` in mtf.ts), read there and restated, with no line of it taken over:
//
// - the sign of the phase is minus: a spot displaced toward +u has a negative imaginary part at a low frequency;
// - the cut along image x is the sagittal one and the cut along image y the tangential one, as for a field that
//   lies in the y-z plane, which every field of a case does;
// - positions are taken relative to one reference point, and one only for all the lines of a spectrum, so that
//   lateral colour stays in the phases and lowers the modulus of the sum;
// - a line counts by its weight times the flux its rays carry: the sum over the lines of weight times a line's own
//   sum, over the sum of weight times a line's flux.
//
// It differs from LensVisualizer's in what is no convention. A value does not depend on which other frequencies
// are asked (LensVisualizer rotates a phasor through an evenly spaced list); the modulus is not cut off at 1; and
// what cannot be computed is an outcome with a reason (`OtfUnavailable`), never an empty list and never a NaN.
//
// Arithmetic. Only IEEE 754 basic operations are used (+, -, *, / and square root, each correctly rounded, and the
// rounding of a number to a whole one, which is exact), in the order of the rays, so a result does not depend on a
// math library and is the same bits on every platform:
//
// - The phase of a ray is reduced before it is an angle. The number of cycles `nu (u - u_ref)` is formed with the
//   rounding of its subtraction and of its product carried along, its whole cycles and quarter cycles are taken
//   off exactly, and only what is left, at most an eighth of a cycle, is multiplied by 2 pi. So a phase of a
//   million cycles is as good as one of a hundredth, and a spot a whole number of quarter cycles from the
//   reference contributes exactly 1, -1 or 0. That holds while the product has a fraction of a cycle to take off:
//   a phase of more than 2^32 cycles (`MAX_PHASE_CYCLES`) is not answered (`out-of-range`), since from 2^53 on a
//   double holds whole cycles only and what its rounding left out is no small angle.
// - The sine and the cosine of that angle, at most pi / 4, are their Taylor polynomials, to the term below a
//   rounding: within 3e-16 of the sine and cosine of the ray's phase.
// - Every sum is compensated (`createExactSum`): a transfer function near one of its zeros is a sum of terms that
//   cancel. A value of an OTF is within 1e-15 of the sum above taken exactly; at frequency 0 it is exactly 1.
import { createExactSum, twoProductError, twoSumError } from "../core/numeric/exact.ts";
import type { ExactSum } from "../core/numeric/exact.ts";

/** The rays of one bundle where they land: one element a ray in each array. */
export interface Spots {
  /** Landing along image x, mm: the axis of the sagittal cut. */
  readonly x: ArrayLike<number>;
  /** Landing along image y, mm: the axis of the tangential cut, in whose plane the field lies. */
  readonly y: ArrayLike<number>;
  /** The flux each ray carries to the image; at least 0. A ray of weight 0, as a chief ray is, adds nothing. */
  readonly weight: ArrayLike<number>;
  /**
   * Which rays are taken: an element that is 0 leaves its ray out, whatever its landing and weight are (those of a
   * ray that did not arrive are NaN). Without it every ray is taken. See `intersectValidity`.
   */
  readonly valid?: ArrayLike<number>;
}

/** A point of the image plane, mm. */
export interface ImagePlanePoint {
  readonly x: number;
  readonly y: number;
}

/** The rays of one spectral line, and what the line counts for. */
export interface SpectralSpots {
  /** The weight of the line in its spectrum; above 0. */
  readonly weight: number;
  readonly spots: Spots;
}

/** Why a transfer function could not be computed. */
export type OtfUnavailableReason =
  /** A frequency is not a finite number. */
  | "bad-frequency"
  /** The reference point is not a finite point: a chief ray that did not land has none. */
  | "no-reference"
  /** A ray that is taken has a landing that is not a finite point. */
  | "bad-landing"
  /** A ray that is taken has a weight that is not a finite number of at least 0. */
  | "bad-weight"
  /** No ray is taken. */
  | "no-rays"
  /** The rays taken carry no flux: every one has the weight 0. */
  | "no-flux"
  /**
   * A frequency times a ray's distance from the reference is more than `MAX_PHASE_CYCLES` cycles, or a sum is not
   * a finite number: numbers the estimator does not reduce a phase of.
   */
  | "out-of-range"
  /** A spectrum has no line. */
  | "no-lines"
  /** The weight of a line is not a finite number above 0. */
  | "bad-line-weight";

/** A transfer function that could not be computed, and why. Nothing of it is a number. */
export interface OtfUnavailable {
  readonly available: false;
  readonly reason: OtfUnavailableReason;
  /** The reason in words, with the ray, the line or the frequency it is about. */
  readonly message: string;
  /** The line the reason is about, where it is about one: its index in the spectrum. */
  readonly line?: number;
  /** The ray the reason is about, where it is about one: its index in the bundle. */
  readonly ray?: number;
}

/** A complex value at each frequency asked. */
export interface ComplexSeries {
  readonly real: Float64Array;
  readonly imaginary: Float64Array;
}

/** One cut of a transfer function: its complex value at each frequency, and the modulus of each, the MTF. */
export interface OtfCut extends ComplexSeries {
  readonly modulus: Float64Array;
}

/** The sums of one bundle before they are divided: what a spectrum adds up line by line. */
export interface SpotSums {
  readonly available: true;
  /** How many rays count: taken, and of a weight above 0. */
  readonly rays: number;
  /** The flux of those rays: the sum of their weights. */
  readonly flux: number;
  /** The sum of `w exp(-2 pi i nu (x - x_ref))` at each frequency. */
  readonly sagittal: ComplexSeries;
  /** The sum of `w exp(-2 pi i nu (y - y_ref))` at each frequency. */
  readonly tangential: ComplexSeries;
}

/** A geometric transfer function at the frequencies asked, in their order. */
export interface GeometricOtf {
  readonly available: true;
  /** How many rays count: taken, and of a weight above 0; over every line of a spectrum. */
  readonly rays: number;
  /** What the sums were divided by: the flux of the rays, or the sum over the lines of weight times flux. */
  readonly flux: number;
  /** Frequency along image x. */
  readonly sagittal: OtfCut;
  /** Frequency along image y. */
  readonly tangential: OtfCut;
}

/** The transfer function of a spectrum, with what each line brought to it. */
export interface PolychromaticOtf extends GeometricOtf {
  /** For each line, in order: how many of its rays count and the flux they carry, before the line's weight. */
  readonly lines: readonly { readonly rays: number; readonly flux: number }[];
}

const TWO_PI = 2 * Math.PI;

/**
 * The longest phase of a ray that is reduced, in cycles: 2^32. Up to it what the product of frequency and offset
 * rounds away is below 1e-6 of a cycle, and the angle left stays within the range of the Taylor polynomials. No
 * spot of a lens comes near it: it is a spot four metres from its reference at a million cycles a millimetre.
 */
export const MAX_PHASE_CYCLES = 2 ** 32;

/** n!, for n up to 19: a whole number that a double holds exactly, as every product on the way to it is. */
function factorial(n: number): number {
  let value = 1;
  for (let factor = 2; factor <= n; factor++) value *= factor;
  return value;
}

/** -1/3!, 1/5!, ... to 1/19!: the Taylor polynomial of `sin(a) / a - 1` in a^2, without its factor a^2. */
const SINE_TERMS: readonly number[] = [3, 5, 7, 9, 11, 13, 15, 17, 19].map(
  (power, index) => (index % 2 === 0 ? -1 : 1) / factorial(power),
);

/** 1/4!, -1/6!, ... to -1/18!: the Taylor polynomial of `cos(a) - 1 + a^2 / 2` in a^2, without its factor a^4. */
const COSINE_TERMS: readonly number[] = [4, 6, 8, 10, 12, 14, 16, 18].map(
  (power, index) => (index % 2 === 0 ? 1 : -1) / factorial(power),
);

/** A polynomial in `square` by Horner's rule, the constant term first in `terms`. */
function horner(terms: readonly number[], square: number): number {
  let value = 0;
  for (let index = terms.length - 1; index >= 0; index--) value = terms[index] + square * value;
  return value;
}

/**
 * Adds, for each of `count` rays, `weight exp(-2 pi i frequency offset)` to the two sums, the offset of a ray being
 * `offset + offsetRest` (a rounded difference and what its rounding left out). Returns -1, or the first ray whose
 * phase is more than `MAX_PHASE_CYCLES` cycles or no number, with nothing of it added: the sums are then of no use.
 */
function addPhasors(
  real: ExactSum,
  imaginary: ExactSum,
  frequency: number,
  count: number,
  weight: Float64Array,
  offset: Float64Array,
  offsetRest: Float64Array,
): number {
  for (let ray = 0; ray < count; ray++) {
    // The phase in cycles: its whole cycles and its quarter cycles are taken off without rounding, and what the
    // product and the subtraction before it rounded away is added to the eighth of a cycle that is left.
    const cycles = frequency * offset[ray];
    if (!(Math.abs(cycles) <= MAX_PHASE_CYCLES)) return ray;
    const within = cycles - Math.round(cycles);
    const quarter = Math.round(4 * within);
    const turn =
      within - 0.25 * quarter + (twoProductError(frequency, offset[ray], cycles) + frequency * offsetRest[ray]);
    const angle = TWO_PI * turn;
    const square = angle * angle;
    const sine = angle + angle * (square * horner(SINE_TERMS, square));
    const cosine = 1 - (0.5 * square - square * square * horner(COSINE_TERMS, square));
    // exp(-i (quarter pi / 2 + angle)), the quarter turns as exchanges of sine and cosine.
    switch (quarter & 3) {
      case 0:
        real.add(weight[ray], cosine);
        imaginary.add(weight[ray], -sine);
        break;
      case 1:
        real.add(weight[ray], -sine);
        imaginary.add(weight[ray], -cosine);
        break;
      case 2:
        real.add(weight[ray], -cosine);
        imaginary.add(weight[ray], sine);
        break;
      default:
        real.add(weight[ray], sine);
        imaginary.add(weight[ray], cosine);
    }
  }
  return -1;
}

function unavailable(
  reason: OtfUnavailableReason,
  message: string,
  about: { line?: number; ray?: number } = {},
): OtfUnavailable {
  return { available: false, reason, message, ...about };
}

/** What is wrong with the reference point or the frequencies of a request, or null. */
function requestProblem(reference: ImagePlanePoint, frequencies: ArrayLike<number>): OtfUnavailable | null {
  for (let index = 0; index < frequencies.length; index++) {
    if (!Number.isFinite(frequencies[index])) {
      return unavailable("bad-frequency", `frequency ${index} is ${frequencies[index]}, not a finite number`);
    }
  }
  if (!Number.isFinite(reference.x) || !Number.isFinite(reference.y)) {
    return unavailable("no-reference", `the reference point is (${reference.x}, ${reference.y}), not a finite point`);
  }
  return null;
}

function emptySeries(count: number): ComplexSeries {
  return { real: new Float64Array(count), imaginary: new Float64Array(count) };
}

/**
 * The sums of one bundle about `reference`, at each of `frequencies` (cycles a millimetre): the flux of the rays
 * and, for each cut, the sum of `w exp(-2 pi i nu (u - u_ref))`. The module's note states the convention and the
 * arithmetic.
 *
 * Only the rays that are taken (`spots.valid`) are looked at. Unavailable, with the first cause in this order: a
 * frequency that is not finite (`bad-frequency`); a reference that is no finite point (`no-reference`); the first
 * ray taken whose landing is not finite (`bad-landing`) or whose weight is not a finite number of at least 0
 * (`bad-weight`), with its index; no ray taken (`no-rays`); rays that all weigh 0 (`no-flux`); at the first
 * frequency that has one, the first ray whose phase is more than `MAX_PHASE_CYCLES` cycles, with its index, or a
 * sum that is no finite number (`out-of-range`).
 *
 * Throws a RangeError when the arrays of `spots` are not of one length: that is no bundle.
 */
export function spotSums(
  spots: Spots,
  reference: ImagePlanePoint,
  frequencies: ArrayLike<number>,
): SpotSums | OtfUnavailable {
  const { x, y, weight, valid } = spots;
  const total = weight.length;
  if (x.length !== total || y.length !== total || (valid !== undefined && valid.length !== total)) {
    throw new RangeError(
      `spotSums: the arrays of a bundle differ in length (x ${x.length}, y ${y.length}, weight ${total}` +
        `${valid === undefined ? "" : `, valid ${valid.length}`})`,
    );
  }
  const problem = requestProblem(reference, frequencies);
  if (problem !== null) return problem;

  // The rays that count, side by side: weight, and the offset from the reference along each axis in two doubles.
  const weights = new Float64Array(total);
  const offsetX = new Float64Array(total);
  const restX = new Float64Array(total);
  const offsetY = new Float64Array(total);
  const restY = new Float64Array(total);
  const indexOf = new Int32Array(total);
  const flux = createExactSum();
  let taken = 0;
  let rays = 0;
  for (let ray = 0; ray < total; ray++) {
    if (valid !== undefined && !valid[ray]) continue;
    taken++;
    if (!Number.isFinite(x[ray]) || !Number.isFinite(y[ray])) {
      return unavailable("bad-landing", `ray ${ray} lands at (${x[ray]}, ${y[ray]}), not a finite point`, { ray });
    }
    if (!Number.isFinite(weight[ray]) || !(weight[ray] >= 0)) {
      return unavailable("bad-weight", `ray ${ray} has the weight ${weight[ray]}, not a number of at least 0`, { ray });
    }
    if (weight[ray] === 0) continue;
    weights[rays] = weight[ray];
    indexOf[rays] = ray;
    offsetX[rays] = x[ray] - reference.x;
    restX[rays] = twoSumError(x[ray], -reference.x, offsetX[rays]);
    offsetY[rays] = y[ray] - reference.y;
    restY[rays] = twoSumError(y[ray], -reference.y, offsetY[rays]);
    // Added as the product with 1, as the term of a ray is at frequency 0: there the two sums are the same bits.
    flux.add(weight[ray], 1);
    rays++;
  }
  if (taken === 0)
    return unavailable("no-rays", total === 0 ? "the bundle has no ray" : "no ray of the bundle is taken");
  if (rays === 0) return unavailable("no-flux", `the ${taken} rays taken all have the weight 0`);

  const sagittal = emptySeries(frequencies.length);
  const tangential = emptySeries(frequencies.length);
  for (let index = 0; index < frequencies.length; index++) {
    const sums = [createExactSum(), createExactSum(), createExactSum(), createExactSum()] as const;
    const beyondX = addPhasors(sums[0], sums[1], frequencies[index], rays, weights, offsetX, restX);
    const beyondY = addPhasors(sums[2], sums[3], frequencies[index], rays, weights, offsetY, restY);
    if (beyondX >= 0 || beyondY >= 0) {
      const ray = indexOf[beyondX >= 0 && (beyondY < 0 || beyondX <= beyondY) ? beyondX : beyondY];
      return unavailable(
        "out-of-range",
        `ray ${ray} at frequency ${index} (${frequencies[index]} cycles/mm) is more than 2^32 cycles from the ` +
          "reference: no phase is reduced that far",
        { ray },
      );
    }
    sagittal.real[index] = sums[0].value();
    sagittal.imaginary[index] = sums[1].value();
    tangential.real[index] = sums[2].value();
    tangential.imaginary[index] = sums[3].value();
  }
  const sums: SpotSums = { available: true, rays, flux: flux.value(), sagittal, tangential };
  return outOfRange(sums.flux, sagittal, tangential, frequencies) ?? sums;
}

/** The outcome `out-of-range` when the flux or a sum is no finite number, naming the first frequency; else null. */
function outOfRange(
  flux: number,
  sagittal: ComplexSeries,
  tangential: ComplexSeries,
  frequencies: ArrayLike<number>,
): OtfUnavailable | null {
  if (!Number.isFinite(flux)) return unavailable("out-of-range", `the flux of the rays is ${flux}`);
  for (let index = 0; index < frequencies.length; index++) {
    const values = [
      sagittal.real[index],
      sagittal.imaginary[index],
      tangential.real[index],
      tangential.imaginary[index],
    ];
    if (!values.every(Number.isFinite)) {
      return unavailable(
        "out-of-range",
        `at frequency ${index} (${frequencies[index]} cycles/mm) a sum is no finite number: a frequency times a ` +
          "distance from the reference is beyond what a double holds",
      );
    }
  }
  return null;
}

/** A cut of a transfer function: the sums of a cut over `flux`, and the modulus of each quotient. */
function cutOf(sums: ComplexSeries, flux: number): OtfCut {
  const count = sums.real.length;
  const cut = { real: new Float64Array(count), imaginary: new Float64Array(count), modulus: new Float64Array(count) };
  for (let index = 0; index < count; index++) {
    const real = sums.real[index] / flux;
    const imaginary = sums.imaginary[index] / flux;
    cut.real[index] = real;
    cut.imaginary[index] = imaginary;
    cut.modulus[index] = Math.sqrt(real * real + imaginary * imaginary);
  }
  return cut;
}

/**
 * The geometric transfer function of one bundle about `reference`, at each of `frequencies` (cycles a millimetre):
 * the sums of `spotSums` over the flux of the rays. `sagittal` is the cut along image x and `tangential` the cut
 * along image y; the modulus of each value is the MTF. At frequency 0 a value is exactly 1 + 0i.
 *
 * Unavailable as `spotSums` is, and it throws as `spotSums` does.
 */
export function geometricOtf(
  spots: Spots,
  reference: ImagePlanePoint,
  frequencies: ArrayLike<number>,
): GeometricOtf | OtfUnavailable {
  const sums = spotSums(spots, reference, frequencies);
  if (!sums.available) return sums;
  return {
    available: true,
    rays: sums.rays,
    flux: sums.flux,
    sagittal: cutOf(sums.sagittal, sums.flux),
    tangential: cutOf(sums.tangential, sums.flux),
  };
}

/**
 * The transfer function of a spectrum: the lines add up as complex numbers before any modulus is taken.
 *
 *   OTF(nu) = sum over lines of W_l S_l(nu) / sum over lines of W_l T_l
 *
 * with W_l the weight of a line, S_l the sum of its rays' `w exp(-2 pi i nu (u - u_ref))` and T_l the flux of its
 * rays (`spotSums`), every line about the same `reference`. So a line that lands beside another, by lateral
 * colour, lowers the modulus of the sum, and a line whose rays carry less flux to the image counts for less. The
 * transfer function of one line of weight 1 is `geometricOtf` of its bundle in every bit.
 *
 * Every line must have an answer of its own: a spectrum from which a line is missing is another spectrum. It is
 * unavailable, with the first cause in this order: no line at all (`no-lines`); a frequency or a reference that is
 * not finite (`bad-frequency`, `no-reference`); then, for the first line in order that has one, a weight that is
 * not a finite number above 0 (`bad-line-weight`) or whatever makes the line's own sums unavailable (`spotSums`:
 * `bad-landing`, `bad-weight`, `no-rays`, `no-flux`, `out-of-range`), each with the index of the line; a sum over
 * the lines that is no finite number (`out-of-range`).
 *
 * Throws as `spotSums` does.
 */
export function polychromaticOtf(
  lines: readonly SpectralSpots[],
  reference: ImagePlanePoint,
  frequencies: ArrayLike<number>,
): PolychromaticOtf | OtfUnavailable {
  if (lines.length === 0) return unavailable("no-lines", "the spectrum has no line");
  const problem = requestProblem(reference, frequencies);
  if (problem !== null) return problem;

  const count = frequencies.length;
  const flux = createExactSum();
  const sums = Array.from({ length: 4 * count }, createExactSum);
  const perLine: { rays: number; flux: number }[] = [];
  for (const [line, { weight, spots }] of lines.entries()) {
    if (!Number.isFinite(weight) || !(weight > 0)) {
      const message = `line ${line} has the weight ${weight}, not a finite number above 0`;
      return unavailable("bad-line-weight", message, { line });
    }
    const own = spotSums(spots, reference, frequencies);
    if (!own.available) return { ...own, message: `line ${line}: ${own.message}`, line };
    perLine.push({ rays: own.rays, flux: own.flux });
    flux.add(weight, own.flux);
    for (let index = 0; index < count; index++) {
      sums[4 * index].add(weight, own.sagittal.real[index]);
      sums[4 * index + 1].add(weight, own.sagittal.imaginary[index]);
      sums[4 * index + 2].add(weight, own.tangential.real[index]);
      sums[4 * index + 3].add(weight, own.tangential.imaginary[index]);
    }
  }
  const sagittal = emptySeries(count);
  const tangential = emptySeries(count);
  for (let index = 0; index < count; index++) {
    sagittal.real[index] = sums[4 * index].value();
    sagittal.imaginary[index] = sums[4 * index + 1].value();
    tangential.real[index] = sums[4 * index + 2].value();
    tangential.imaginary[index] = sums[4 * index + 3].value();
  }
  const total = flux.value();
  return (
    outOfRange(total, sagittal, tangential, frequencies) ?? {
      available: true,
      rays: perLine.reduce((rays, line) => rays + line.rays, 0),
      flux: total,
      sagittal: cutOf(sagittal, total),
      tangential: cutOf(tangential, total),
      lines: perLine,
    }
  );
}
