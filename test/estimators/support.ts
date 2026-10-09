// What the estimators' tests share: whole-number arithmetic to hold a double to, and a fixed series of numbers.
// Nothing here is an estimator's own code: every expected value is worked out another way.

/** The distance between a double and the next one above it in magnitude: one unit in its last place. */
export { ulp } from "../engines/ref/support.ts";

/** An exact fraction `numerator / 2^shift`: every finite double is one, and so are their sums and products. */
export interface Dyadic {
  readonly numerator: bigint;
  /** May be negative: then the value is a whole number, `numerator * 2^-shift`. */
  readonly shift: number;
}

/** A finite double as the fraction it is. */
export function dyadicOf(value: number): Dyadic {
  if (!Number.isFinite(value)) throw new RangeError(`dyadicOf: ${value} is no finite number`);
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const biased = Number((bits >> 52n) & 0x7ffn);
  const fraction = bits & 0xf_ffff_ffff_ffffn;
  // A subnormal has no hidden bit and the exponent of the smallest normal.
  const magnitude = biased === 0 ? fraction : fraction | (1n << 52n);
  return { numerator: bits >> 63n === 1n ? -magnitude : magnitude, shift: 1075 - (biased === 0 ? 1 : biased) };
}

/** The product of two fractions, exactly. */
export function times(a: Dyadic, b: Dyadic): Dyadic {
  return { numerator: a.numerator * b.numerator, shift: a.shift + b.shift };
}

/** The sum of fractions, exactly. */
export function plus(...terms: readonly Dyadic[]): Dyadic {
  const shift = Math.max(...terms.map((term) => term.shift));
  const numerator = terms.reduce((sum, term) => sum + (term.numerator << BigInt(shift - term.shift)), 0n);
  return { numerator, shift };
}

/** -1, 0 or 1 as `a` is below, equal to or above `b`, exactly. */
export function compare(a: Dyadic, b: Dyadic): number {
  const shift = Math.max(a.shift, b.shift);
  const difference = (a.numerator << BigInt(shift - a.shift)) - (b.numerator << BigInt(shift - b.shift));
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

/**
 * A fixed series of numbers in [0, 1), the same in every run: a linear congruential generator in whole numbers
 * below 2^31 (Park and Miller's), whose products stay below 2^53 and so are exact in doubles.
 */
export function series(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

// ── A transfer function in whole numbers ─────────────────────────────────────────────────────────────────────────

/** Fixed-point numbers: a value times 2^300, as a BigInt. Ninety digits, where a double has sixteen. */
const FIXED_BITS = 300;
const FIXED_ONE = 1n << BigInt(FIXED_BITS);

/** A fraction as a fixed-point number, exactly: its denominator is at most 2^300. */
function fixedOf(value: Dyadic): bigint {
  if (value.shift > FIXED_BITS) throw new RangeError(`fixedOf: a fraction over 2^${value.shift} needs more digits`);
  return value.numerator << BigInt(FIXED_BITS - value.shift);
}

/** A fixed-point number as the double nearest to it. */
function doubleOf(fixed: bigint): number {
  return Number(fixed) / 2 ** FIXED_BITS;
}

/** The first hundred decimals of pi, as a fixed-point number. */
const FIXED_PI =
  (BigInt("31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679") <<
    BigInt(FIXED_BITS)) /
  10n ** 100n;

/** The cosine and the sine of `turns` whole turns (a fraction in [0, 1)), by their series, to some 2^-290. */
function cosineAndSine(turns: bigint): { cosine: bigint; sine: bigint } {
  const angle = (2n * FIXED_PI * turns) >> BigInt(FIXED_BITS);
  let cosine = 0n;
  let sine = 0n;
  // The term angle^n / n!, added to the cosine for an even n and to the sine for an odd one, with the series' signs.
  let term = FIXED_ONE;
  for (let n = 0; term !== 0n; n++) {
    if (n % 2 === 0) cosine += n % 4 === 0 ? term : -term;
    else sine += n % 4 === 1 ? term : -term;
    term = ((term * angle) >> BigInt(FIXED_BITS)) / BigInt(n + 1);
  }
  return { cosine, sine };
}

/** A spot of a bundle for `exactTransfer`: where it lands along the cut, and its weight as an exact fraction. */
export interface ExactSpot {
  readonly u: number;
  readonly weight: Dyadic;
}

/**
 * The sum of `w exp(-2 pi i nu (u - reference))` over the spots, divided by the sum of `w`, worked out in whole
 * numbers and rounded once: the number of cycles of each spot is an exact fraction, its whole cycles are taken off
 * exactly, and the cosine and sine of what is left are summed series in ninety digits. It is the definition of the
 * transfer function carried out, and shares no line with the estimator.
 */
export function exactTransfer(
  spots: readonly ExactSpot[],
  reference: number,
  frequency: number,
): { real: number; imaginary: number } {
  let real = 0n;
  let imaginary = 0n;
  let flux = 0n;
  for (const { u, weight } of spots) {
    const cycles = times(dyadicOf(frequency), plus(dyadicOf(u), dyadicOf(-reference)));
    // The fraction of a cycle, in [0, 1): a whole number of cycles (no denominator) leaves none.
    const one = 1n << BigInt(Math.max(cycles.shift, 0));
    const part = cycles.shift <= 0 ? 0n : ((cycles.numerator % one) + one) % one;
    const { cosine, sine } = cosineAndSine(fixedOf({ numerator: part, shift: Math.max(cycles.shift, 0) }));
    const w = fixedOf(weight);
    real += (w * cosine) >> BigInt(FIXED_BITS);
    imaginary -= (w * sine) >> BigInt(FIXED_BITS);
    flux += w;
  }
  return {
    real: doubleOf((real << BigInt(FIXED_BITS)) / flux),
    imaginary: doubleOf((imaginary << BigInt(FIXED_BITS)) / flux),
  };
}

/** pi as the fixed-point constant holds it, rounded to a double: a test holds it to `Math.PI`. */
export const PI_OF_THE_SERIES: number = doubleOf(FIXED_PI);

/** The double `steps` doubles above a positive double, or below it for a negative number of steps. */
export function neighbour(value: number, steps: number): number {
  if (!(value > 0) || !Number.isFinite(value)) throw new RangeError(`neighbour: ${value} is no positive double`);
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  view.setBigUint64(0, view.getBigUint64(0) + BigInt(steps));
  return view.getFloat64(0);
}

/**
 * The double nearest to `factor * sqrt(x^2 + y^2 + z^2)` for a positive factor: the length of the stretch of a
 * line from its parameter 0 to `factor`, along the direction (x, y, z) as it is held. It is found in whole
 * numbers: the double whose half-way points to its two neighbours have the exact square of the length between
 * their squares.
 */
export function exactLength(factor: number, direction: readonly number[]): number {
  if (factor === 0) return 0;
  const squared = times(
    times(dyadicOf(factor), dyadicOf(factor)),
    plus(...direction.map((component) => times(dyadicOf(component), dyadicOf(component)))),
  );
  const halfway = (a: number, b: number): Dyadic => {
    const sum = plus(dyadicOf(a), dyadicOf(b));
    return { numerator: sum.numerator, shift: sum.shift + 1 };
  };
  // From the factor itself, which is the length where the direction is a unit vector, a step at a time.
  let length = factor;
  for (let step = 0; step < 1e6; step++) {
    const low = halfway(neighbour(length, -1), length);
    const high = halfway(length, neighbour(length, 1));
    if (compare(times(high, high), squared) < 0) length = neighbour(length, 1);
    else if (compare(times(low, low), squared) > 0) length = neighbour(length, -1);
    else return length;
  }
  throw new RangeError(`exactLength: the direction ${direction} is too far from a unit vector to step to its length`);
}
