// Zernike polynomials fitted to a sampled wavefront by least squares, and the RMS and peak to valley of the samples:
// the comparator's own estimator, applied to an engine's raw wavefront samples (`wavefront.native`), which its fit and
// figures are set beside (rung R14b, `zernike.native`).
//
// The polynomials. Of the normalised pupil coordinates (x, y), the unit circle being the rim of the pupil, with
// rho^2 = x^2 + y^2 and theta = atan2(y, x): Z = N R_n^|m|(rho) cos(|m| theta) for m >= 0 and N R_n^|m|(rho)
// sin(|m| theta) for m < 0, R_n^|m| Zernike's radial polynomial (R(1) = 1). Two orderings, OpticStudio's:
//
// - `standard`, OpticStudio's Zernike Standard: Noll's sequential index j from 1 (`nollPolynomial`): within a radial
//   order n, |m| ascends, and of the two of one |m| > 0 the even j is the cosine; N = sqrt(n + 1) for m = 0 and
//   sqrt(2 (n + 1)) otherwise, so that every polynomial has a mean square of 1 over the unit disc;
// - `fringe`, OpticStudio's Zernike Fringe: the University of Arizona index from 1 (`FRINGE_POLYNOMIALS`, 37 of them,
//   the 37th the radial polynomial of order 12), N = 1.
//
// Each is evaluated with IEEE 754 basic operations only: rho^|m| cos(|m| theta) and rho^|m| sin(|m| theta) are the real
// and the imaginary part of (x + i y)^|m|, and R_n^|m|(rho) / rho^|m| is a polynomial in rho^2 of integer
// coefficients, evaluated by a compensated Horner scheme (each product's and each sum's rounding carried beside it) at
// rho^2 rounded once, with the first-order term of that rounding added (the derivative times what the rounding left
// out). No trigonometric function and no square root but of the normalisation is taken.
//
// The fit. The coefficients c minimise the sum over the valid samples of (w - sum_j c_j Z_j)^2, every sample of equal
// weight: the samples are the midpoints of a square grid, each of one cell's area. The normal equations G c = b,
// G_jl = sum Z_j Z_l and b_j = sum Z_j w, are summed compensated (each product's and each addition's rounding carried
// in a second double, rounded once), solved by Cholesky's factorisation and refined twice with residuals summed alike.
// How well the samples determine the coefficients is the condition of G, ||G||_1 ||G^-1||_1 (`normalCondition`), its
// inverse a column a solve: where the lit samples cover a strip of the disc (a vignetted field), polynomials that differ
// only outside it are nearly one, and the coefficients carry about log10 of the square root of it fewer digits. A
// condition of 2^52 or more leaves none: the fit is `ill-conditioned`.
//
// The figures, of the valid samples, unweighted: the RMS about the mean (piston removed: the chief ray's reference
// keeps the tilt), the largest less the smallest sample, and the RMS of what the fit leaves. Each sum is compensated,
// each difference from the mean carried with its rounding.
//
// What it cannot compute is an outcome with a reason, never a NaN: no valid sample (`no-rays`), fewer valid samples
// than terms (`too-few-samples`), a valid sample whose coordinates or wavefront are not finite (`bad-sample`, with the
// sample), normal equations that are not positive definite (`degenerate-fit`) or of a condition of 2^52 or more
// (`ill-conditioned`). Arrays of unequal length throw, and so does an ordering of no such number of terms.
//
// Arithmetic. Only IEEE 754 basic operations, the samples in their order, so equal input gives equal bits.
import { twoProductError, twoSumError } from "../core/numeric/exact.ts";

/** The orderings of the polynomials, OpticStudio's two. */
export type ZernikeOrdering = "standard" | "fringe";

/** One polynomial: its radial order n and its azimuthal frequency m, a cosine for m > 0 and a sine for m < 0. */
export interface ZernikePolynomial {
  readonly n: number;
  readonly m: number;
}

/**
 * OpticStudio's 37 Zernike Fringe polynomials in their order (the University of Arizona index): by (n + |m|) / 2, then
 * by descending |m|, the cosine before the sine; the 37th is the radial polynomial of order 12.
 */
export const FRINGE_POLYNOMIALS: readonly ZernikePolynomial[] = Object.freeze(
  (
    [
      [0, 0],
      [1, 1],
      [1, -1],
      [2, 0],
      [2, 2],
      [2, -2],
      [3, 1],
      [3, -1],
      [4, 0],
      [3, 3],
      [3, -3],
      [4, 2],
      [4, -2],
      [5, 1],
      [5, -1],
      [6, 0],
      [4, 4],
      [4, -4],
      [5, 3],
      [5, -3],
      [6, 2],
      [6, -2],
      [7, 1],
      [7, -1],
      [8, 0],
      [5, 5],
      [5, -5],
      [6, 4],
      [6, -4],
      [7, 3],
      [7, -3],
      [8, 2],
      [8, -2],
      [9, 1],
      [9, -1],
      [10, 0],
      [12, 0],
    ] as const
  ).map(([n, m]) => Object.freeze({ n, m })),
);

/** The most polynomials of the Standard ordering the estimator takes: those of radial order 20 and below. */
export const STANDARD_MAX_TERMS = 231;

/**
 * Noll's polynomial of index `j` (from 1): the radial order n is the row of the triangle of n + 1 polynomials that holds
 * j; within the row |m| ascends from n mod 2 in steps of 2, each |m| above 0 twice, the even index the cosine.
 */
export function nollPolynomial(j: number): ZernikePolynomial {
  if (!Number.isInteger(j) || j < 1) throw new RangeError(`a Noll index is an integer from 1, got ${j}`);
  let n = 0;
  while (((n + 1) * (n + 2)) / 2 < j) n++;
  const k = j - (n * (n + 1)) / 2 - 1;
  const size = n % 2 === 0 ? 2 * Math.floor((k + 1) / 2) : 2 * Math.floor(k / 2) + 1;
  return { n, m: size === 0 ? 0 : j % 2 === 0 ? size : -size };
}

/** The first `terms` polynomials of an ordering. Throws for a number of terms the ordering does not have. */
export function zernikePolynomials(ordering: ZernikeOrdering, terms: number): ZernikePolynomial[] {
  const most = ordering === "fringe" ? FRINGE_POLYNOMIALS.length : STANDARD_MAX_TERMS;
  if (!Number.isInteger(terms) || terms < 1 || terms > most) {
    throw new RangeError(`the ${ordering} ordering has 1 to ${most} terms, not ${terms}`);
  }
  return ordering === "fringe"
    ? FRINGE_POLYNOMIALS.slice(0, terms)
    : Array.from({ length: terms }, (_, at) => nollPolynomial(at + 1));
}

/** n! as an exact integer. */
function factorial(n: number): bigint {
  let product = 1n;
  for (let k = 2n; k <= BigInt(n); k++) product *= k;
  return product;
}

/**
 * The coefficients of R_n^|m|(rho) / rho^|m| as a polynomial in t = rho^2, the highest power first: the k-th is
 * (-1)^k (n - k)! / (k! ((n + |m|) / 2 - k)! ((n - |m|) / 2 - k)!), of t^((n - |m|) / 2 - k). Exact integers, each
 * below 2^53 for n up to 20.
 */
export function radialCoefficients({ n, m }: ZernikePolynomial): number[] {
  const size = Math.abs(m);
  if (!Number.isInteger(n) || n < 0 || size > n || (n - size) % 2 !== 0) {
    throw new RangeError(`no Zernike polynomial has n = ${n} and m = ${m}`);
  }
  const half = (n - size) / 2;
  return Array.from({ length: half + 1 }, (_, k) => {
    const value = factorial(n - k) / (factorial(k) * factorial((n + size) / 2 - k) * factorial(half - k));
    return Number(k % 2 === 0 ? value : -value);
  });
}

/** The normalisation of a polynomial in an ordering: sqrt(n + 1) or sqrt(2 (n + 1)) in the Standard one, else 1. */
export function zernikeNorm(ordering: ZernikeOrdering, { n, m }: ZernikePolynomial): number {
  if (ordering === "fringe") return 1;
  return Math.sqrt(m === 0 ? n + 1 : 2 * (n + 1));
}

/** A polynomial made ready to evaluate: its coefficients in t, its |m|, whether a sine, its normalisation. */
interface Prepared {
  readonly coefficients: readonly number[];
  readonly size: number;
  readonly sine: boolean;
  readonly norm: number;
}

function prepare(ordering: ZernikeOrdering, polynomial: ZernikePolynomial): Prepared {
  return {
    coefficients: radialCoefficients(polynomial),
    size: Math.abs(polynomial.m),
    sine: polynomial.m < 0,
    norm: zernikeNorm(ordering, polynomial),
  };
}

/**
 * The value at t = high + low of a polynomial in t of the coefficients given (the highest power first), by a
 * compensated Horner scheme on `high`, each product's and each sum's rounding carried beside the value, and the term
 * `low` times the derivative added.
 */
function horner(coefficients: readonly number[], high: number, low: number): number {
  let value = coefficients[0];
  let rest = 0;
  let slope = 0;
  for (let at = 1; at < coefficients.length; at++) {
    slope = slope * high + value;
    const product = value * high;
    const productError = twoProductError(value, high, product);
    const sum = product + coefficients[at];
    const sumError = twoSumError(product, coefficients[at], sum);
    rest = rest * high + (productError + sumError);
    value = sum;
  }
  return value + (rest + low * slope);
}

/** The value of a prepared polynomial at (x, y), given rho^2 as high + low and (x + i y)^|m| as re + i im. */
function valueOf(prepared: Prepared, high: number, low: number, re: number, im: number): number {
  const radial = horner(prepared.coefficients, high, low);
  const angular = prepared.size === 0 ? 1 : prepared.sine ? im : re;
  return prepared.norm * radial * angular;
}

/** (x + i y)^k for k = 0 .. most, as [re, im] pairs. */
function powers(x: number, y: number, most: number): Float64Array {
  const out = new Float64Array(2 * (most + 1));
  out[0] = 1;
  for (let k = 1; k <= most; k++) {
    const [re, im] = [out[2 * k - 2], out[2 * k - 1]];
    out[2 * k] = re * x - im * y;
    out[2 * k + 1] = re * y + im * x;
  }
  return out;
}

/** The values of the first `terms` polynomials of an ordering at the points (x[k], y[k]): row k, column j. */
export function zernikeBasis(
  ordering: ZernikeOrdering,
  terms: number,
  x: ArrayLike<number>,
  y: ArrayLike<number>,
): Float64Array {
  if (x.length !== y.length) throw new RangeError("the coordinates are of unequal length");
  const prepared = zernikePolynomials(ordering, terms).map((polynomial) => prepare(ordering, polynomial));
  const most = Math.max(...prepared.map(({ size }) => size));
  const out = new Float64Array(x.length * terms);
  for (let k = 0; k < x.length; k++) {
    const [xk, yk] = [x[k], y[k]];
    const xx = xk * xk;
    const yy = yk * yk;
    const high = xx + yy;
    const low = twoProductError(xk, xk, xx) + twoProductError(yk, yk, yy) + twoSumError(xx, yy, high);
    const angles = powers(xk, yk, most);
    for (let j = 0; j < terms; j++) {
      const { size } = prepared[j];
      out[k * terms + j] = valueOf(prepared[j], high, low, angles[2 * size], angles[2 * size + 1]);
    }
  }
  return out;
}

/** A running compensated sum: the value and what its roundings left out. */
class Compensated {
  private sum = 0;
  private rest = 0;
  /** Adds a * b. */
  product(a: number, b: number): void {
    const product = a * b;
    const next = this.sum + product;
    this.rest += twoSumError(this.sum, product, next) + twoProductError(a, b, product);
    this.sum = next;
  }
  /** Adds a. */
  add(a: number): void {
    const next = this.sum + a;
    this.rest += twoSumError(this.sum, a, next);
    this.sum = next;
  }
  value(): number {
    return this.sum + this.rest;
  }
  /** The running sum without what its roundings left out. */
  high(): number {
    return this.sum;
  }
  /** What the roundings of the running sum left out. */
  low(): number {
    return this.rest;
  }
}

/** Why a fit or a figure could not be computed. */
export type ZernikeUnavailableReason =
  "no-rays" | "too-few-samples" | "bad-sample" | "degenerate-fit" | "ill-conditioned";

/** The condition of the normal equations from which their solution keeps no digit: 2^52. */
export const ILL_CONDITIONED = 2 ** 52;

/** A fit that could not be computed, and why. Nothing of it is a number. */
export interface ZernikeUnavailable {
  readonly available: false;
  readonly reason: ZernikeUnavailableReason;
  readonly message: string;
  /** The sample the reason is about, where it is about one. */
  readonly sample?: number;
}

/** The fit and the figures of a sampled wavefront, in the unit of its samples. */
export interface ZernikeFit {
  readonly available: true;
  /** The coefficients of the polynomials, from the first of the ordering. */
  readonly coefficients: Float64Array;
  /** The RMS of the valid samples about their mean. */
  readonly rmsToChief: number;
  /** The largest less the smallest valid sample. */
  readonly pvToChief: number;
  /** The RMS of the valid samples less the fitted polynomials. */
  readonly residualRms: number;
  /** How many samples are valid. */
  readonly samples: number;
  /** The condition of the normal equations, ||G||_1 ||G^-1||_1. */
  readonly normalCondition: number;
}

/** A sampled wavefront: normalised pupil coordinates, the wavefront, and which samples are valid (1) or not (0). */
export interface ZernikeSamples {
  readonly x: ArrayLike<number>;
  readonly y: ArrayLike<number>;
  readonly w: ArrayLike<number>;
  readonly valid: ArrayLike<number>;
}

/**
 * The RMS of `values` about their mean and their largest less their smallest. The mean is carried in two doubles, the
 * compensated sum over the count and what that quotient's rounding left out, so that a large common offset (a piston)
 * costs the figure nothing; each difference from it is carried with its rounding, and its square summed compensated.
 */
export function rmsAndPeakToValley(values: ArrayLike<number>): { readonly rms: number; readonly pv: number } {
  const count = values.length;
  const total = new Compensated();
  let [lowest, highest] = [Infinity, -Infinity];
  for (let k = 0; k < count; k++) {
    total.add(values[k]);
    lowest = Math.min(lowest, values[k]);
    highest = Math.max(highest, values[k]);
  }
  const mean = total.value() / count;
  // What the mean's rounding left out: (sum - mean * count) / count, the product's rounding taken exactly.
  const product = mean * count;
  const left = new Compensated();
  left.add(total.high());
  left.add(-product);
  left.add(total.low());
  left.add(-twoProductError(mean, count, product));
  const meanLow = left.value() / count;
  const squares = new Compensated();
  for (let k = 0; k < count; k++) {
    // The difference from the mean, d + e, the mean's low part in e: its square is d^2 + 2 d e + e^2.
    const d = values[k] - mean;
    const e = twoSumError(values[k], -mean, d) - meanLow;
    squares.product(d, d);
    squares.product(2 * d, e);
    squares.product(e, e);
  }
  return { rms: Math.sqrt(Math.max(0, squares.value()) / count), pv: highest - lowest };
}

/** The Cholesky factor of the symmetric matrix `a` (size by size, row-major), or null where it is not positive. */
function cholesky(a: Float64Array, size: number): Float64Array | null {
  const lower = new Float64Array(size * size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= i; j++) {
      const sum = new Compensated();
      sum.add(a[i * size + j]);
      for (let k = 0; k < j; k++) sum.product(-lower[i * size + k], lower[j * size + k]);
      const value = sum.value();
      if (i === j) {
        if (!(value > 0)) return null;
        lower[i * size + i] = Math.sqrt(value);
      } else {
        lower[i * size + j] = value / lower[j * size + j];
      }
    }
  }
  return lower;
}

/** The solution of L L^T x = r. */
function solve(lower: Float64Array, size: number, r: Float64Array): Float64Array {
  const z = new Float64Array(size);
  for (let i = 0; i < size; i++) {
    const sum = new Compensated();
    sum.add(r[i]);
    for (let k = 0; k < i; k++) sum.product(-lower[i * size + k], z[k]);
    z[i] = sum.value() / lower[i * size + i];
  }
  const x = new Float64Array(size);
  for (let i = size - 1; i >= 0; i--) {
    const sum = new Compensated();
    sum.add(z[i]);
    for (let k = i + 1; k < size; k++) sum.product(-lower[k * size + i], x[k]);
    x[i] = sum.value() / lower[i * size + i];
  }
  return x;
}

/**
 * The least-squares Zernike fit of the valid samples of a wavefront, and its figures (the module's documentation).
 * Throws for arrays of unequal length and for a number of terms the ordering does not have.
 */
export function fitZernike(
  samples: ZernikeSamples,
  ordering: ZernikeOrdering,
  terms: number,
): ZernikeFit | ZernikeUnavailable {
  const { x, y, w, valid } = samples;
  if (y.length !== x.length || w.length !== x.length || valid.length !== x.length) {
    throw new RangeError("the samples' arrays are of unequal length");
  }
  zernikePolynomials(ordering, terms);
  const taken: number[] = [];
  for (let k = 0; k < x.length; k++) {
    if (valid[k] !== 1) continue;
    if (![x[k], y[k], w[k]].every(Number.isFinite)) {
      const message = `sample ${k} is valid and its coordinates or wavefront are not finite numbers`;
      return { available: false, reason: "bad-sample", message, sample: k };
    }
    taken.push(k);
  }
  const count = taken.length;
  if (count === 0) return { available: false, reason: "no-rays", message: "no sample is valid" };
  if (count < terms) {
    const message = `${count} valid samples cannot determine ${terms} coefficients`;
    return { available: false, reason: "too-few-samples", message };
  }
  const values = Float64Array.from(taken, (k) => w[k]);
  const basis = zernikeBasis(
    ordering,
    terms,
    taken.map((k) => x[k]),
    taken.map((k) => y[k]),
  );
  const gram = new Float64Array(terms * terms);
  const right = new Float64Array(terms);
  for (let j = 0; j < terms; j++) {
    for (let l = 0; l <= j; l++) {
      const sum = new Compensated();
      for (let k = 0; k < count; k++) sum.product(basis[k * terms + j], basis[k * terms + l]);
      gram[j * terms + l] = gram[l * terms + j] = sum.value();
    }
    const sum = new Compensated();
    for (let k = 0; k < count; k++) sum.product(basis[k * terms + j], values[k]);
    right[j] = sum.value();
  }
  const lower = cholesky(gram, terms);
  if (lower === null) {
    return { available: false, reason: "degenerate-fit", message: "the normal equations are not positive definite" };
  }
  const condition = normalCondition(gram, lower, terms);
  if (!(condition < ILL_CONDITIONED)) {
    const message = `the normal equations have a condition of ${condition}, at which their solution keeps no digit`;
    return { available: false, reason: "ill-conditioned", message };
  }
  const coefficients = solve(lower, terms, right);
  for (let step = 0; step < 2; step++) {
    const residual = new Float64Array(terms);
    for (let j = 0; j < terms; j++) {
      const sum = new Compensated();
      sum.add(right[j]);
      for (let l = 0; l < terms; l++) sum.product(-gram[j * terms + l], coefficients[l]);
      residual[j] = sum.value();
    }
    const correction = solve(lower, terms, residual);
    for (let j = 0; j < terms; j++) coefficients[j] += correction[j];
  }
  const left = new Compensated();
  for (let k = 0; k < count; k++) {
    const sum = new Compensated();
    sum.add(values[k]);
    for (let j = 0; j < terms; j++) sum.product(-coefficients[j], basis[k * terms + j]);
    const d = sum.value();
    left.product(d, d);
  }
  const { rms, pv } = rmsAndPeakToValley(values);
  return {
    available: true,
    coefficients,
    rmsToChief: rms,
    pvToChief: pv,
    residualRms: Math.sqrt(Math.max(0, left.value()) / count),
    samples: count,
    normalCondition: condition,
  };
}

/** ||G||_1 ||G^-1||_1, the inverse a column a solve of the factor `lower` of G; each norm the largest column sum. */
function normalCondition(gram: Float64Array, lower: Float64Array, size: number): number {
  let norm = 0;
  let inverseNorm = 0;
  for (let column = 0; column < size; column++) {
    const unit = new Float64Array(size);
    unit[column] = 1;
    const inverse = solve(lower, size, unit);
    const [direct, inverted] = [new Compensated(), new Compensated()];
    for (let row = 0; row < size; row++) {
      direct.add(Math.abs(gram[row * size + column]));
      inverted.add(Math.abs(inverse[row]));
    }
    norm = Math.max(norm, direct.value());
    inverseNorm = Math.max(inverseNorm, inverted.value());
  }
  return norm * inverseNorm;
}
