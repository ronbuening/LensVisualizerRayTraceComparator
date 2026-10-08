// Error-free transformations: the rounding error of a sum or a product of two doubles, as a double. With them a
// sum whose terms cancel is carried in two doubles, a value and what its rounding left out, and comes out as if it
// had been added up in twice the precision. Only IEEE 754 basic operations are used, each correctly rounded, so a
// result is the same bits on every platform.
//
// The algorithms are the classical ones: Knuth's TwoSum, Dekker's product with Veltkamp's split, and the
// compensated dot product of Ogita, Rump and Oishi.

/** 2^27 + 1: a double times this, minus what the product's rounding dropped, is the double's upper 26 bits. */
const SPLITTER = 134217729;

/**
 * The rounding error of `a + b`, exactly: with `sum` the rounded sum, `sum + twoSumError(a, b, sum)` is the sum of
 * the two numbers without rounding. It holds for any two finite doubles whose sum does not overflow.
 */
export function twoSumError(a: number, b: number, sum: number): number {
  const bVirtual = sum - a;
  return a - (sum - bVirtual) + (b - bVirtual);
}

/**
 * The rounding error of `a * b`, exactly: with `product` the rounded product, `product + twoProductError(a, b,
 * product)` is the product without rounding. Each factor is split into two halves of 26 bits, whose four partial
 * products are exact. It holds while neither the split (a factor below 2^996 in magnitude) nor the product
 * overflows and the product is not so small that its error is below the smallest double (2^-969).
 */
export function twoProductError(a: number, b: number, product: number): number {
  const aScaled = SPLITTER * a;
  const aHigh = aScaled - (aScaled - a);
  const aLow = a - aHigh;
  const bScaled = SPLITTER * b;
  const bHigh = bScaled - (bScaled - b);
  const bLow = b - bHigh;
  return aHigh * bHigh - product + aHigh * bLow + aLow * bHigh + aLow * bLow;
}

/**
 * A running sum of products that keeps what each rounding leaves out: `add(a, b)` adds `a * b`, and `value()` is
 * the sum so far. The rounding error of every product and of every addition is itself added up, in a second
 * double, and joins the sum at the end: the result is the sum of the products as if computed in twice the working
 * precision and rounded once, so it does not lose digits when positive and negative products cancel.
 */
export interface ExactSum {
  /** Adds the product `a * b`. */
  add(a: number, b: number): void;
  /** The sum of everything added, rounded to a double. */
  value(): number;
}

/** A running sum of products (`ExactSum`) that starts at 0. */
export function createExactSum(): ExactSum {
  let sum = 0;
  let rest = 0;
  return {
    add: (a, b) => {
      const product = a * b;
      const next = sum + product;
      rest += twoSumError(sum, product, next) + twoProductError(a, b, product);
      sum = next;
    },
    value: () => sum + rest,
  };
}
