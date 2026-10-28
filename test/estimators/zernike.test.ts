// The Zernike estimator (src/estimators/zernike.ts), held to what is derived here another way: the orderings from
// their definitions (Noll's index of his paper, OpticStudio's Fringe list), the radial polynomials by Gram-Schmidt in
// exact fractions on [0, 1] with the weight of the unit disc, their normalisation by the exact integral over the disc,
// the values at dyadic points in exact fractions, the fit of a wavefront made of known polynomials, a pure defocus and
// a pure spherical aberration by their closed forms, the orthogonality the grid's symmetry makes exact, and the RMS and
// peak to valley in whole numbers. No engine's output is used.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  FRINGE_POLYNOMIALS,
  STANDARD_MAX_TERMS,
  fitZernike,
  nollPolynomial,
  radialCoefficients,
  rmsAndPeakToValley,
  zernikeBasis,
  zernikeNorm,
  zernikePolynomials,
} from "../../src/estimators/zernike.ts";
import type { ZernikeOrdering, ZernikePolynomial } from "../../src/estimators/zernike.ts";
import { dyadicOf, minus, nearestRoot, plus, times, ulp } from "./support.ts";
import type { Dyadic } from "./support.ts";

const EPSILON = 2 ** -52;

// ── Exact fractions ──────────────────────────────────────────────────────────────────────────────────────────────

/** A fraction of two whole numbers, the denominator above 0, in lowest terms. */
interface Fraction {
  readonly p: bigint;
  readonly q: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  let [x, y] = [a < 0n ? -a : a, b < 0n ? -b : b];
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

function fraction(p: bigint, q: bigint = 1n): Fraction {
  if (q === 0n) throw new RangeError("a fraction of denominator 0");
  const sign = q < 0n ? -1n : 1n;
  const divisor = gcd(p, q) || 1n;
  return { p: (sign * p) / divisor, q: (sign * q) / divisor };
}

const ZERO = fraction(0n);
const ONE = fraction(1n);
const add = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.q + b.p * a.q, a.q * b.q);
const sub = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.q - b.p * a.q, a.q * b.q);
const mul = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.p, a.q * b.q);
const div = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.q, a.q * b.p);
const same = (a: Fraction, b: Fraction): boolean => a.p === b.p && a.q === b.q;

/** A finite double as the fraction it is. */
function fractionOf(value: number): Fraction {
  const { numerator, shift } = dyadicOf(value);
  return shift >= 0 ? fraction(numerator, 1n << BigInt(shift)) : fraction(numerator << BigInt(-shift));
}

/** The double nearest to a fraction, from a dyadic fraction of 80 bits more than a double has. */
function doubleOf(value: Fraction): number {
  const scaled = (value.p << 200n) / value.q;
  return Number(scaled) / 2 ** 200;
}

// ── The orderings, from their definitions ────────────────────────────────────────────────────────────────────────

/**
 * Noll's index of (n, m), by the rule that gives the table of his paper (J. Opt. Soc. Am. 66, 207, 1976):
 * j = n (n + 1) / 2 + |m| + c, c = 0 for a cosine (m > 0) of n mod 4 in {0, 1} and for a sine (m < 0) of n mod 4 in
 * {2, 3}, and c = 1 otherwise, m = 0 included.
 */
function nollIndex(n: number, m: number): number {
  const low = n % 4 <= 1;
  const c = (m > 0 && low) || (m < 0 && !low) ? 0 : 1;
  return (n * (n + 1)) / 2 + Math.abs(m) + c;
}

test("the Standard ordering is Noll's index, the even index the cosine, n ascending then |m|", () => {
  // Every (n, m) of order 20 and below has its index; sorted by it they are the estimator's list, each index once.
  const listed: { j: number; n: number; m: number }[] = [];
  for (let n = 0; n <= 20; n++)
    for (let m = -n; m <= n; m += 2) listed.push({ j: nollIndex(n, m), n, m: m === 0 ? 0 : m });
  listed.sort((a, b) => a.j - b.j);
  assert.deepEqual(
    listed.map(({ j }) => j),
    Array.from({ length: STANDARD_MAX_TERMS }, (_, at) => at + 1),
  );
  assert.deepEqual(
    zernikePolynomials("standard", STANDARD_MAX_TERMS),
    listed.map(({ n, m }) => ({ n, m })),
  );
  // OpticStudio's first eleven: piston, the two tilts (cosine first), defocus, the astigmatisms (sine first), the comas
  // (sine first), the trefoils and spherical aberration.
  assert.deepEqual(
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((j) => nollPolynomial(j)),
    [
      { n: 1, m: 1 },
      { n: 1, m: -1 },
      { n: 2, m: 0 },
      { n: 2, m: -2 },
      { n: 2, m: 2 },
      { n: 3, m: -1 },
      { n: 3, m: 1 },
      { n: 3, m: -3 },
      { n: 3, m: 3 },
      { n: 4, m: 0 },
    ],
  );
});

test("the Fringe ordering is the University of Arizona index, and its 37th polynomial the radial one of order 12", () => {
  // (1 + (n + |m|) / 2)^2 - 2 |m|, plus 1 for the sine, for the first 36; then OpticStudio's 37th.
  const listed: ZernikePolynomial[] = [];
  for (let n = 0; n <= 10; n++)
    for (let m = -n; m <= n; m += 2) {
      const j = (1 + (n + Math.abs(m)) / 2) ** 2 - 2 * Math.abs(m) + (m < 0 ? 1 : 0);
      if (j <= 36) listed[j - 1] = { n, m: m === 0 ? 0 : m };
    }
  assert.equal(listed.filter((entry) => entry !== undefined).length, 36);
  assert.deepEqual(FRINGE_POLYNOMIALS.slice(0, 36), listed);
  assert.deepEqual(FRINGE_POLYNOMIALS[36], { n: 12, m: 0 });
  // OpticStudio's Z37: 924 r^12 - 2772 r^10 + 3150 r^8 - 1680 r^6 + 420 r^4 - 42 r^2 + 1.
  assert.deepEqual(radialCoefficients({ n: 12, m: 0 }), [924, -2772, 3150, -1680, 420, -42, 1]);
  assert.throws(() => zernikePolynomials("fringe", 38), RangeError);
  assert.throws(() => zernikePolynomials("standard", STANDARD_MAX_TERMS + 1), RangeError);
  assert.throws(() => zernikePolynomials("standard", 0), RangeError);
});

// ── The radial polynomials and their normalisation ───────────────────────────────────────────────────────────────

/** A polynomial in t, exact, the coefficient of t^k at k. */
type Polynomial = Fraction[];

/** The integral over [0, 1] of t^m f g dt: the inner product of Zernike's radial polynomials in t = rho^2, halved. */
function inner(m: number, f: Polynomial, g: Polynomial): Fraction {
  let sum = ZERO;
  f.forEach((a, i) => g.forEach((b, k) => (sum = add(sum, mul(mul(a, b), fraction(1n, BigInt(m + i + k + 1)))))));
  return sum;
}

/**
 * The radial polynomials of azimuthal frequency m, R_{m + 2k} / rho^m as polynomials in t, k = 0 .. count - 1, by
 * Gram-Schmidt on 1, t, t^2, ... with the weight t^m on [0, 1] (rho d rho = dt / 2 on the disc), each scaled to 1 at
 * t = 1 (R(1) = 1). Exact.
 */
function gramSchmidt(m: number, count: number): Polynomial[] {
  const out: Polynomial[] = [];
  for (let k = 0; k < count; k++) {
    let p: Polynomial = Array.from({ length: k + 1 }, (_, at) => (at === k ? ONE : ZERO));
    for (const q of out) {
      const c = div(inner(m, p, q), inner(m, q, q));
      p = p.map((a, at) => sub(a, mul(c, q[at] ?? ZERO)));
    }
    const atOne = p.reduce((sum, a) => add(sum, a), ZERO);
    out.push(p.map((a) => div(a, atOne)));
  }
  return out;
}

test("the radial coefficients are the orthogonal polynomials of the disc, and the norms make each of unit mean square", () => {
  for (let m = 0; m <= 12; m++) {
    const count = Math.floor((20 - m) / 2) + 1;
    const derived = gramSchmidt(m, count);
    derived.forEach((p, k) => {
      const n = m + 2 * k;
      // The estimator lists the highest power first, of whole numbers.
      const coefficients = radialCoefficients({ n, m });
      assert.deepEqual(
        coefficients.map((c) => fraction(BigInt(c))),
        [...p].reverse(),
        `R_${n}^${m}`,
      );
      for (const sign of m === 0 ? [0] : [m, -m]) {
        // The mean over the unit disc of (R cos m theta)^2 is (1/pi) (pi or 2 pi) (1/2) inner(R, R).
        const meanSquare = mul(inner(m, p, p), fraction(m === 0 ? 1n : 1n, m === 0 ? 1n : 2n));
        const expected = fraction(1n, BigInt(m === 0 ? n + 1 : 2 * (n + 1)));
        assert.ok(same(meanSquare, expected), `mean square of R_${n}^${sign}`);
        // So the Standard norm is the square root of n + 1 or 2 (n + 1), correctly rounded; the Fringe norm 1.
        assert.equal(zernikeNorm("standard", { n, m: sign }), Math.sqrt(m === 0 ? n + 1 : 2 * (n + 1)));
        assert.equal(zernikeNorm("fringe", { n, m: sign }), 1);
      }
    });
  }
  assert.throws(() => radialCoefficients({ n: 3, m: 2 }), RangeError);
});

// ── Values at dyadic points ──────────────────────────────────────────────────────────────────────────────────────

/** (x + i y)^k exactly. */
function complexPower(x: Fraction, y: Fraction, k: number): [Fraction, Fraction] {
  let [re, im] = [ONE, ZERO];
  for (let step = 0; step < k; step++) [re, im] = [sub(mul(re, x), mul(im, y)), add(mul(re, y), mul(im, x))];
  return [re, im];
}

/** The exact value of a polynomial of the estimator's at a point, without its normalisation: P(rho^2) Re or Im. */
function exactValue({ n, m }: ZernikePolynomial, x: number, y: number): Fraction {
  const [fx, fy] = [fractionOf(x), fractionOf(y)];
  const t = add(mul(fx, fx), mul(fy, fy));
  const p = gramSchmidt(Math.abs(m), (n - Math.abs(m)) / 2 + 1).at(-1) as Polynomial;
  let radial = ZERO;
  for (let k = p.length - 1; k >= 0; k--) radial = add(mul(radial, t), p[k]);
  const [re, im] = complexPower(fx, fy, Math.abs(m));
  return mul(radial, m === 0 ? ONE : m > 0 ? re : im);
}

/** The midpoints of an even grid strictly inside the unit circle, row-major, as wavefront.native's. */
function midpoints(grid: number): { x: number[]; y: number[] } {
  const x: number[] = [];
  const y: number[] = [];
  for (let row = 0; row < grid; row++)
    for (let column = 0; column < grid; column++) {
      const [px, py] = [(2 * column + 1) / grid - 1, (2 * row + 1) / grid - 1];
      if (px * px + py * py < 1) {
        x.push(px);
        y.push(py);
      }
    }
  return { x, y };
}

test("each polynomial's value at a dyadic point is its exact value within a few units of its scale", () => {
  const points = [
    [0.375, -0.5],
    [-0.6875, 0.125],
    [0.0625, 0.9375],
    [0, 0],
    [-0.40625, -0.40625],
  ];
  for (const ordering of ["standard", "fringe"] as const) {
    const polynomials = zernikePolynomials(ordering, ordering === "fringe" ? 37 : 66);
    const values = zernikeBasis(
      ordering,
      polynomials.length,
      points.map(([x]) => x),
      points.map(([, y]) => y),
    );
    points.forEach(([x, y], k) =>
      polynomials.forEach((polynomial, j) => {
        const norm = zernikeNorm(ordering, polynomial);
        const exact = doubleOf(exactValue(polynomial, x, y)) * norm;
        // The scale of what is summed: the magnitudes of the radial terms at rho^2, times rho^|m| and the norm.
        const rho2 = x * x + y * y;
        const coefficients = radialCoefficients(polynomial);
        const magnitude = coefficients.reduce(
          (sum, c, at) => sum + Math.abs(c) * rho2 ** (coefficients.length - 1 - at),
          0,
        );
        const scale = norm * magnitude * Math.sqrt(rho2) ** Math.abs(polynomial.m);
        // The angular part is (x + i y)^|m| in |m| complex products, each of two roundings; the compensated radial sum
        // is exact to one rounding of its value and eps^2 of its scale; the norm and the product, two more roundings.
        const bound = (2 * Math.abs(polynomial.m) + 4) * EPSILON * (Math.abs(exact) + scale) + Number.MIN_VALUE;
        assert.ok(
          Math.abs(values[k * polynomials.length + j] - exact) <= bound,
          `${ordering} ${j + 1} at (${x}, ${y}): ${values[k * polynomials.length + j]} against ${exact}`,
        );
      }),
    );
  }
});

test("a radial polynomial of order 18 or 20 near the rim is its exact value within two units", () => {
  // R_18^0 and R_20^0 are polynomials of degree 9 and 10 in t = rho^2 whose terms near t = 1 sum to 3e6 to 2e9 times
  // their value: a plain Horner scheme keeps 6 to 9 fewer digits. The compensated one keeps the value at the rounded t
  // to a rounding and (2 d eps)^2 of that sum (d the degree: under 1e-22); t's own rounding, under half a unit of t,
  // moves R by its derivative (some 60) times it, up to some 1e4 units of R, which the first-order term restores to
  // (R'' / 2) times its square. One rounding more is the normalisation's product: within two units of the exact value
  // times the norm.
  const points = [
    [0.6, 0.79],
    [0.7071, 0.7],
    [-0.31, 0.947],
    [0.99, 0.1],
    [0.123456789, -0.98765],
    [-0.8, -0.59],
  ];
  const terms = STANDARD_MAX_TERMS;
  const values = zernikeBasis(
    "standard",
    terms,
    points.map(([x]) => x),
    points.map(([, y]) => y),
  );
  for (const polynomial of [
    { n: 18, m: 0 },
    { n: 20, m: 0 },
  ]) {
    const j = zernikePolynomials("standard", terms).findIndex(({ n, m }) => n === polynomial.n && m === polynomial.m);
    const norm = zernikeNorm("standard", polynomial);
    const coefficients = radialCoefficients(polynomial);
    points.forEach(([x, y], k) => {
      // t = x^2 + y^2 is not a double at these points: its rounding is what the first-order term restores.
      const t = add(mul(fractionOf(x), fractionOf(x)), mul(fractionOf(y), fractionOf(y)));
      assert.ok(!same(fractionOf(x * x + y * y), t), `rho^2 at (${x}, ${y}) is a double`);
      const rho2 = x * x + y * y;
      const sum = coefficients.reduce(
        (total, c, at) => total + Math.abs(c) * rho2 ** (coefficients.length - 1 - at),
        0,
      );
      const exact = doubleOf(mul(exactValue(polynomial, x, y), fractionOf(norm)));
      assert.ok(sum > 1e5 * Math.abs(exact / norm), `the terms of R_${polynomial.n} cancel at (${x}, ${y})`);
      const got = values[k * terms + j];
      assert.ok(Math.abs(got - exact) <= 2 * ulp(exact), `R_${polynomial.n} at (${x}, ${y}): ${got} against ${exact}`);
    });
  }
});

test("on the symmetric grid a product of polynomials odd in x or in y sums to exactly zero", () => {
  const { x, y } = midpoints(32);
  const terms = 37;
  const basis = zernikeBasis("standard", terms, x, y);
  const polynomials = zernikePolynomials("standard", terms);
  // A polynomial is odd in y where it is a sine; odd in x where its cosine or sine of |m| theta has the parity: of
  // cos(|m| theta) the x parity is (-1)^|m|, of sin(|m| theta) it is (-1)^(|m| + 1).
  const parity = ({ m }: ZernikePolynomial): [number, number] => [
    m < 0 ? (-1) ** (Math.abs(m) + 1) : (-1) ** Math.abs(m),
    m < 0 ? -1 : 1,
  ];
  let odd = 0;
  for (let j = 0; j < terms; j++)
    for (let l = 0; l < j; l++) {
      const [pj, pl] = [parity(polynomials[j]), parity(polynomials[l])];
      if (pj[0] * pl[0] === 1 && pj[1] * pl[1] === 1) continue;
      odd++;
      // The values at mirrored points are exact negatives; the sum is of them, each product exact to a rounding.
      let exact: Dyadic = { numerator: 0n, shift: 0 };
      for (let k = 0; k < x.length; k++)
        exact = plus(exact, times(dyadicOf(basis[k * terms + j]), dyadicOf(basis[k * terms + l])));
      assert.equal(exact.numerator, 0n, `${j + 1} and ${l + 1}`);
    }
  assert.ok(odd > 400, `${odd} pairs of other parity`);
});

// ── The fit ──────────────────────────────────────────────────────────────────────────────────────────────────────

/** A wavefront of the given coefficients of an ordering at the grid's points, each sample exact and rounded once. */
function wavefrontOf(ordering: ZernikeOrdering, coefficients: readonly number[], x: number[], y: number[]): number[] {
  const polynomials = zernikePolynomials(ordering, coefficients.length);
  return x.map((px, k) => {
    // A Standard polynomial's norm is a square root: the sample is the fraction of the unnormalised polynomials with
    // coefficients times the norm, each coefficient a dyadic times the norm rounded once (the input of the fit).
    let sum = ZERO;
    polynomials.forEach((polynomial, j) => {
      const weight = fractionOf(coefficients[j] * zernikeNorm(ordering, polynomial));
      sum = add(sum, mul(weight, exactValue(polynomial, px, y[k])));
    });
    return doubleOf(sum);
  });
}

test("a wavefront made of known Fringe polynomials is fitted back to its coefficients", () => {
  const { x, y } = midpoints(16);
  const coefficients = [0.5, -0.25, 0.125, 1.5, -0.75, 0.375, 0.0625, -0.03125, 0.25, -0.5, 0.125];
  const w = wavefrontOf("fringe", coefficients, x, y);
  const valid = x.map(() => 1);
  const fit = fitZernike({ x, y, w, valid }, "fringe", coefficients.length);
  assert.ok(fit.available);
  // The samples are exact to half a unit in their last place; the fit is a linear map of them whose gain on this
  // grid is below 4 (its normal matrix is diagonal to within a quarter on the disc), so a coefficient moves by at most
  // 4 units of the largest sample, and the compensated solve adds a unit of the coefficients' scale.
  const largest = Math.max(...w.map(Math.abs));
  for (const [j, value] of coefficients.entries()) {
    assert.ok(Math.abs(fit.coefficients[j] - value) <= 4 * ulp(largest) + ulp(2), `c${j + 1} ${fit.coefficients[j]}`);
  }
  assert.ok(fit.residualRms <= 4 * ulp(largest), `residual ${fit.residualRms}`);
  assert.equal(fit.samples, x.length);
});

test("a pure defocus and a pure spherical aberration have their closed-form Standard coefficients", () => {
  const { x, y } = midpoints(32);
  const valid = x.map(() => 1);
  const r2 = x.map((px, k) => px * px + y[k] * y[k]);
  // rho^2 = Z1 / 2 + Z4 / (2 sqrt 3): R_2^0 = 2 rho^2 - 1 and Z4 = sqrt 3 R_2^0.
  // rho^4 = Z1 / 3 + Z4 / (2 sqrt 3) + Z11 / (6 sqrt 5): R_4^0 = 6 rho^4 - 6 rho^2 + 1 and Z11 = sqrt 5 R_4^0.
  const cases: [string, number[], Map<number, number>][] = [
    [
      "defocus",
      r2,
      new Map([
        [1, 1 / 2],
        [4, 1 / (2 * Math.sqrt(3))],
      ]),
    ],
    [
      "spherical",
      r2.map((t) => t * t),
      new Map([
        [1, 1 / 3],
        [4, 1 / (2 * Math.sqrt(3))],
        [11, 1 / (6 * Math.sqrt(5))],
      ]),
    ],
  ];
  for (const [name, w, expected] of cases) {
    const fit = fitZernike({ x, y, w, valid }, "standard", 37);
    assert.ok(fit.available, name);
    for (let j = 1; j <= 37; j++) {
      const want = expected.get(j) ?? 0;
      // Each sample is rho^2 or rho^4 to a unit or two in its last place (below 1); the fit's gain is below 4.
      assert.ok(Math.abs(fit.coefficients[j - 1] - want) <= 1e-14, `${name} c${j}: ${fit.coefficients[j - 1]}`);
    }
    assert.ok(fit.residualRms <= 1e-15, `${name} residual ${fit.residualRms}`);
  }
});

/** A dyadic fraction as a fraction. */
function fractionOfDyadic({ numerator, shift }: Dyadic): Fraction {
  return shift >= 0 ? fraction(numerator, 1n << BigInt(shift)) : fraction(numerator << BigInt(-shift));
}

/** The normal equations of basis values (row k, column j) and samples, summed exactly. */
function exactNormalEquations(
  basis: Float64Array,
  terms: number,
  w: readonly number[],
): { gram: Fraction[][]; right: Fraction[] } {
  const column = (j: number): Dyadic[] => w.map((_, k) => dyadicOf(basis[k * terms + j]));
  const columns = Array.from({ length: terms }, (_, j) => column(j));
  const samples = w.map(dyadicOf);
  const gram = columns.map((a) =>
    columns.map((b) => fractionOfDyadic(plus(...a.map((value, k) => times(value, b[k]))))),
  );
  const right = columns.map((a) => fractionOfDyadic(plus(...a.map((value, k) => times(value, samples[k])))));
  return { gram, right };
}

/** The solution of G x = r in exact fractions, by Gauss-Jordan elimination; G regular. */
function solveExactly(gram: readonly Fraction[][], right: readonly Fraction[]): Fraction[] {
  const rows = gram.map((row, at) => [...row, right[at]]);
  const size = right.length;
  for (let column = 0; column < size; column++) {
    const pivot = rows.findIndex((row, at) => at >= column && row[column].p !== 0n);
    [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
    const lead = rows[column][column];
    rows[column] = rows[column].map((value) => div(value, lead));
    for (let at = 0; at < size; at++) {
      const factor = rows[at][column];
      if (at !== column && factor.p !== 0n)
        rows[at] = rows[at].map((value, k) => sub(value, mul(factor, rows[column][k])));
    }
  }
  return rows.map((row) => row[size]);
}

/** The inverse of G in exact fractions, column by column, rounded to doubles: what a bound is formed of. */
function inverseOf(gram: readonly Fraction[][]): number[][] {
  return gram.map((_, column) =>
    solveExactly(
      gram,
      gram.map((__, at) => (at === column ? ONE : ZERO)),
    ).map(doubleOf),
  );
}

/** u, the unit roundoff: half a unit in the last place of 1. */
const UNIT_ROUNDOFF = 2 ** -53;

test("an ill-conditioned fit on a strip of the disc is its exact least squares, after two refinements", () => {
  // A strip 1/128 high (y = 0 to 4/512, x in eighths) lit on 75 samples of a pattern of sixty-fourths, fitted with the
  // first eight Fringe polynomials (of degree 3 and less, whole-number coefficients): every value, product and sum of
  // the normal equations is a double, so G and b are exact however they are summed, and the exact least squares is the
  // solution of the estimator's own normal equations. Their condition is some 2e10.
  const x: number[] = [];
  const y: number[] = [];
  for (let row = 0; row <= 4; row++)
    for (let column = -7; column <= 7; column++) {
      x.push(column / 8);
      y.push(row / 512);
    }
  const w = x.map((_, k) => ((k * 37) % 64) / 64 - 0.5);
  const terms = 8;
  const { gram, right } = exactNormalEquations(zernikeBasis("fringe", terms, x, y), terms, w);
  for (const value of [...gram.flat(), ...right]) assert.ok(same(fractionOf(doubleOf(value)), value), "a double");
  const exact = solveExactly(gram, right).map(doubleOf);
  const inverse = inverseOf(gram);
  const norm1 = (columns: readonly (readonly number[])[]): number =>
    Math.max(...columns.map((column) => column.reduce((sum, value) => sum + Math.abs(value), 0)));
  const condition = norm1(gram.map((row) => row.map(doubleOf))) * norm1(inverse);
  assert.ok(condition > 1e10 && condition < 1e11, `${condition}`);
  const fit = fitZernike({ x, y, w, valid: x.map(() => 1) }, "fringe", terms);
  assert.ok(fit.available);
  // The condition's inverse is of the factor alone, unrefined: within 2 kappa u of itself.
  assert.ok(
    Math.abs(fit.normalCondition - condition) <= 2 * condition * UNIT_ROUNDOFF * condition,
    `${fit.normalCondition}`,
  );
  // Cholesky's factor, each entry a compensated dot product, solves G x = b to about 2 kappa u of the solution; a
  // refinement whose residual is exact to working precision (compensated) multiplies that error by about 2 kappa u
  // again: here 5e-6, so 5e-6 of the coefficients after the solve, 2e-11 after one refinement and 1e-16 after two,
  // under a few units of the largest coefficient, beside the half unit of the last addition.
  const scale = Math.max(...exact.map(Math.abs));
  const contraction = 2 * condition * UNIT_ROUNDOFF;
  const bound = contraction ** 3 * exact.reduce((sum, value) => sum + Math.abs(value), 0) + ulp(scale);
  assert.ok(bound < 16 * ulp(scale) && contraction ** 2 * scale > 1e3 * bound, `${bound}`);
  for (const [j, value] of exact.entries()) {
    assert.ok(Math.abs(fit.coefficients[j] - value) <= bound, `c${j + 1}: ${fit.coefficients[j]} against ${value}`);
  }
});

test("the normal equations are summed compensated: a coefficient all but zero by the grid's symmetry stays so", () => {
  // The whole disc on the grid of 32, fifteen Standard polynomials (near orthonormal: a condition of 1.1), a wavefront
  // of doubles that is no sum of them and lacks some of the grid's symmetries (reflection in either axis or in the
  // diagonal). The least squares of these samples against the polynomials' values as the estimator evaluates them (held
  // to their exact values above), in exact fractions, has the coefficients of the polynomials of the symmetries it
  // lacks zero but for the samples' roundings, some 1e-18. Each entry of G and b rounded once moves the solution by at
  // most u |G^-1| (|b| + |G| |c|) (first order; Skeel's bound), which is of that size for those coefficients: G is zero
  // between polynomials of other symmetries, b nearly so. What the compensated sums leave beyond a rounding of an entry
  // the grid makes zero, (N u)^2 times the sum of its terms' magnitudes (below 1e-22), is under 2^-70 of the
  // coefficients' scale through G^-1. Sums that rounded each term would leave units in the last place of the scale in
  // G's zeros, and so in those coefficients.
  const { x, y } = midpoints(32);
  const w = x.map((px, k) => {
    const t = px * px + y[k] * y[k];
    return 0.3 * px + 0.7 * t - 0.2 * t * t + 0.1 * px * y[k] ** 3 + 0.05 * Math.sqrt(t) * y[k];
  });
  const terms = 15;
  const { gram, right } = exactNormalEquations(zernikeBasis("standard", terms, x, y), terms, w);
  const exact = solveExactly(gram, right).map(doubleOf);
  const inverse = inverseOf(gram);
  const [G, b] = [gram.map((row) => row.map(doubleOf)), right.map(doubleOf)];
  const inner = b.map((value, i) => Math.abs(value) + G[i].reduce((sum, g, l) => sum + Math.abs(g * exact[l]), 0));
  const scale = Math.max(...exact.map(Math.abs));
  const fit = fitZernike({ x, y, w, valid: x.map(() => 1) }, "standard", terms);
  assert.ok(fit.available && fit.normalCondition < 1.2, `${fit.available && fit.normalCondition}`);
  let small = 0;
  for (const [j, value] of exact.entries()) {
    const skeel = UNIT_ROUNDOFF * inverse.reduce((sum, column, i) => sum + Math.abs(column[j]) * inner[i], 0);
    if (Math.abs(value) < 1e-15 * scale) small++;
    const bound = 2 * skeel + ulp(value) + 2 ** -70 * scale;
    assert.ok(Math.abs(fit.coefficients[j] - value) <= bound, `c${j + 1}: ${fit.coefficients[j]} against ${value}`);
  }
  assert.ok(small >= 4, `${small} coefficients all but zero`);
});

test("the fit's residual RMS is that of its own residuals, which cancel to the samples' roundings", () => {
  // The samples of known Standard polynomials, each rounded once: what the fit leaves of a sample is some 1e-16 of
  // terms of order 1. Each residual is a compensated sum of the sample and the T products c_j Z_j: exact to a rounding
  // and ((T + 1) u)^2 of its terms' magnitudes, a few 1e-30; then squared and summed compensated, a division and a
  // root. Sums that rounded each product would leave some T u of the terms in each residual: several times the
  // residual.
  const { x, y } = midpoints(16);
  const coefficients = [0.5, -0.25, 0.125, 1.5, -0.75, 0.375, 0.0625, -0.03125, 0.25, -0.5, 0.125];
  const terms = coefficients.length;
  const w = wavefrontOf("standard", coefficients, x, y);
  const fit = fitZernike({ x, y, w, valid: x.map(() => 1) }, "standard", terms);
  assert.ok(fit.available);
  const basis = zernikeBasis("standard", terms, x, y);
  let squares: Dyadic = { numerator: 0n, shift: 0 };
  let largest = 0;
  for (const [k, sample] of w.entries()) {
    const products = Array.from({ length: terms }, (_, j) =>
      times(dyadicOf(-fit.coefficients[j]), dyadicOf(basis[k * terms + j])),
    );
    const residual = plus(dyadicOf(sample), ...products);
    squares = plus(squares, times(residual, residual));
    const magnitude =
      Math.abs(sample) + products.reduce((sum, _, j) => sum + Math.abs(fit.coefficients[j] * basis[k * terms + j]), 0);
    largest = Math.max(largest, magnitude);
  }
  const exact = nearestRoot(squares, { numerator: BigInt(w.length), shift: 0 });
  assert.ok(exact > 0 && exact < 1e-15, `${exact}`);
  const bound = 3 * ulp(exact) + ((terms + 1) * UNIT_ROUNDOFF) ** 2 * largest;
  assert.ok(Math.abs(fit.residualRms - exact) <= bound, `${fit.residualRms} against ${exact}`);
});

// ── The figures ──────────────────────────────────────────────────────────────────────────────────────────────────

/** The RMS about the mean of doubles, in whole numbers, and the double nearest to it. */
function exactRms(values: readonly number[]): number {
  const count = BigInt(values.length);
  const exact = values.map(dyadicOf);
  const sum = plus(...exact);
  // N^2 var = N sum w^2 - (sum w)^2, of fractions; the RMS is sqrt(N^2 var / N^2).
  const squares = plus(...exact.map((w) => times(w, w)));
  const numerator = minus(times({ numerator: count, shift: 0 }, squares), times(sum, sum));
  return nearestRoot(numerator, { numerator: count * count, shift: 0 });
}

test("the RMS about the mean and the peak to valley are the whole-number ones, a large piston included", () => {
  const { x, y } = midpoints(32);
  const defocus = x.map((px, k) => px * px + y[k] * y[k]);
  for (const piston of [0, 2 ** 30]) {
    const w = defocus.map((t) => piston + t);
    const { rms, pv } = rmsAndPeakToValley(w);
    const exact = exactRms(w);
    assert.ok(Math.abs(rms - exact) <= 2 * ulp(exact), `piston ${piston}: ${rms} against ${exact}`);
    assert.equal(pv, Math.max(...w) - Math.min(...w));
  }
  // Samples of every bit, 2^30 + rho^2 pi / 4 rounded once: their sum, some 2^40, needs bits below its last place, and
  // a sum that dropped them would move the mean by some 1e-6, and the RMS by its square over twice itself (1e-11).
  const full = defocus.map((t) => 2 ** 30 + t * 0.7853981633974483);
  const rounded = full.reduce((sum, value) => sum + value, 0);
  assert.ok(!same(fractionOf(rounded), fractionOfDyadic(plus(...full.map(dyadicOf)))), "a plain sum of them rounds");
  const { rms } = rmsAndPeakToValley(full);
  assert.ok(Math.abs(rms - exactRms(full)) <= 2 * ulp(exactRms(full)), `${rms} against ${exactRms(full)}`);
  // A plain mean of 2^30 + rho^2 loses the mean's last bits, and with them some hundred units of the RMS: the low part
  // of the mean carried beside it, and its square, are what keep the figure (the estimator's comment).
  const w = defocus.map((t) => 2 ** 30 + t);
  const plainMean = w.reduce((sum, value) => sum + value, 0) / w.length;
  const plain = Math.sqrt(w.reduce((sum, value) => sum + (value - plainMean) ** 2, 0) / w.length);
  assert.ok(Math.abs(plain - exactRms(w)) > 16 * ulp(exactRms(w)), `${plain} is the plain figure`);
});

test("what cannot be computed is an outcome with a reason; arrays of unequal length throw", () => {
  const { x, y } = midpoints(8);
  const w = x.map(() => 0.25);
  const none = fitZernike({ x, y, w, valid: x.map(() => 0) }, "standard", 4);
  assert.deepEqual(none.available ? null : none.reason, "no-rays");
  const few = fitZernike({ x, y, w, valid: x.map((_, k) => (k < 3 ? 1 : 0)) }, "standard", 4);
  assert.deepEqual(few.available ? null : few.reason, "too-few-samples");
  const bad = fitZernike(
    { x, y, w: w.map((v, k) => (k === 5 ? Number.NaN : v)), valid: x.map(() => 1) },
    "standard",
    4,
  );
  assert.deepEqual(bad.available ? null : [bad.reason, bad.sample], ["bad-sample", 5]);
  // A dark sample's NaN is not looked at.
  const dark = fitZernike(
    { x, y, w: w.map((v, k) => (k === 5 ? Number.NaN : v)), valid: x.map((_, k) => (k === 5 ? 0 : 1)) },
    "standard",
    4,
  );
  assert.ok(dark.available);
  // Every sample at one point: the tilts cannot be told apart.
  const one = fitZernike({ x: x.map(() => 0.25), y: y.map(() => 0.25), w, valid: x.map(() => 1) }, "standard", 4);
  assert.deepEqual(one.available ? null : one.reason, "degenerate-fit");
  assert.throws(() => fitZernike({ x, y: y.slice(1), w, valid: w }, "standard", 4), RangeError);
  assert.throws(() => fitZernike({ x, y, w, valid: w.map(() => 1) }, "fringe", 38), RangeError);
});

test("the condition of the normal equations is the exact one on the symmetric grid, and a strip of the disc is ill-conditioned", () => {
  const { x, y } = midpoints(16);
  const w = x.map((px) => 0.5 * px);
  const valid = x.map(() => 1);
  // 1, x and y are orthogonal on the symmetric grid: G = diag(N, sum x^2, sum y^2), and sum x^2 = sum y^2, so
  // ||G||_1 ||G^-1||_1 = N / sum x^2, in whole numbers of 2^-8 at these dyadic midpoints.
  const fit = fitZernike({ x, y, w, valid }, "fringe", 3);
  assert.ok(fit.available);
  const squares = x.reduce((sum, px) => sum + px * px, 0);
  assert.ok(
    Math.abs(fit.normalCondition - x.length / squares) <= 4 * ulp(x.length / squares),
    `${fit.normalCondition}`,
  );
  // On the whole disc the Standard polynomials are near orthonormal: a condition near 1. Lit only on a strip
  // 0 <= y <= 1/2 (a vignetted field) the polynomials of order 3 and more are nearly dependent there, by orders of
  // magnitude more; on a coarse grid of such a strip 15 of them leave no digit, and on a narrower one the normal
  // equations are not even positive definite to working precision.
  const disc = fitZernike({ x, y, w, valid }, "standard", 15);
  assert.ok(disc.available && disc.normalCondition < 100, `${disc.available && disc.normalCondition}`);
  const fine = midpoints(64);
  const strip = (lit: number): number[] => fine.y.map((py) => (py >= 0 && py <= lit ? 1 : 0));
  const narrow = fitZernike({ x: fine.x, y: fine.y, w: fine.x, valid: strip(0.5) }, "standard", 15);
  assert.ok(narrow.available && narrow.normalCondition > 1e6 * disc.normalCondition);
  const coarse = fitZernike({ x, y, w, valid: y.map((py) => (py >= 0 && py <= 0.5 ? 1 : 0)) }, "standard", 15);
  assert.deepEqual(coarse.available ? null : coarse.reason, "ill-conditioned");
  const thin = fitZernike({ x: fine.x, y: fine.y, w: fine.x, valid: strip(0.25) }, "standard", 37);
  assert.deepEqual(thin.available ? null : thin.reason, "degenerate-fit");
});
