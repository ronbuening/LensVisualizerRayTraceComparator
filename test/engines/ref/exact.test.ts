// The error-free transformations (src/core/numeric/exact.ts) and the sums the reference engine makes with them,
// held to whole-number arithmetic: a double is a whole number times a power of two, so the sum and the product of
// two doubles are known without rounding.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { AsphereTerm } from "../../../src/contract/case.ts";
import { createExactSum, twoProductError, twoSumError } from "../../../src/core/numeric/exact.ts";
import { polynomial, profileOf, sag, slope } from "../../../src/engines/ref/surface.ts";
import { exactPolynomial, termScale, ulp } from "./support.ts";

/** `a * b + c`, computed without rounding and rounded once. */
function exactProductPlus(a: number, b: number, c: number): number {
  return exactPolynomial(
    [
      { power: 1, coeff: a },
      { power: 0, coeff: c },
    ],
    b,
  );
}

/** Doubles of every kind a trace meets: whole, fractional, tiny, huge, of either sign. */
const SAMPLES: readonly number[] = [
  0,
  1,
  -1,
  0.1,
  -0.3,
  1 / 3,
  Math.PI,
  -Math.E,
  1e-9,
  -7.25e-17,
  123456.789,
  -9.87654321e12,
  2 ** -40 + 2 ** -93,
  1 + 2 ** -52,
  1.5168,
  587.5618e-6,
];

test("the error of a sum is exact: the rounded sum and its error add up to the sum of the two numbers", () => {
  for (const a of SAMPLES) {
    for (const b of SAMPLES) {
      const sum = a + b;
      const error = twoSumError(a, b, sum);
      // a + b - sum, without rounding: the error is a double, so rounding it once changes nothing.
      const expected = exactPolynomial(
        [
          { power: 0, coeff: a },
          { power: 0, coeff: b },
          { power: 0, coeff: -sum },
        ],
        1,
      );
      assert.equal(error, expected, `${a} + ${b}`);
      assert.ok(Math.abs(error) <= ulp(sum) / 2 || sum === 0, `${a} + ${b}: the error is half a unit at most`);
    }
  }
  // Where the smaller number is lost entirely, the error is the smaller number.
  assert.equal(twoSumError(1e20, 1, 1e20 + 1), 1);
  assert.equal(twoSumError(1, 2 ** -60, 1), 2 ** -60);
});

test("the error of a product is exact: the rounded product and its error multiply out to the two numbers", () => {
  for (const a of SAMPLES) {
    for (const b of SAMPLES) {
      const product = a * b;
      assert.equal(twoProductError(a, b, product), exactProductPlus(a, b, -product), `${a} * ${b}`);
    }
  }
  // (1 + 2^-30)^2 = 1 + 2^-29 + 2^-60: the last term is what a double drops.
  const x = 1 + 2 ** -30;
  assert.equal(x * x, 1 + 2 ** -29);
  assert.equal(twoProductError(x, x, x * x), 2 ** -60);
});

test("a sum of products that cancels comes out as if it had been added up exactly", () => {
  // 1e16 * 1 + 3 * 0.25 - 1e16 * 1: in doubles the middle term is rounded away and comes back as 0 or 2.
  const plain = 1e16 * 1 + 3 * 0.25 - 1e16 * 1;
  assert.notEqual(plain, 0.75);
  const sum = createExactSum();
  sum.add(1e16, 1);
  sum.add(3, 0.25);
  sum.add(-1e16, 1);
  assert.equal(sum.value(), 0.75);
  assert.equal(createExactSum().value(), 0);

  // An optical path with a stretch backwards: index times length, forwards and back, and a small one left over.
  const stretches: [index: number, length: number][] = [
    [1, 412.0000001],
    [1.8052, 37.123456789],
    [1.8052, -37.123456788],
    [1, -412],
    [1.5168, 2.5e-7],
  ];
  const path = createExactSum();
  for (const [index, length] of stretches) path.add(index, length);
  // The exact sum, in whole numbers: every product as its rounded value and what the rounding dropped, added up as
  // constants.
  const products = stretches.map(([index, length]) => {
    const product = index * length;
    return [product, twoProductError(index, length, product)];
  });
  const expected = exactPolynomial(
    products.flat().map((value) => ({ power: 0, coeff: value })),
    1,
  );
  assert.ok(Math.abs(path.value() - expected) <= ulp(expected), `${path.value()} against ${expected}`);
  // A running sum in doubles is off by the rounding of its largest partial sum, a hundred thousand times as much.
  const running = stretches.reduce((total, [index, length]) => total + index * length, 0);
  assert.ok(Math.abs(running - expected) > 1e4 * ulp(expected), `${running} against ${expected}`);
});

test("a polynomial whose terms cancel by ten orders of magnitude is summed to the last place of its value", () => {
  // 1e8 r^2 - 2e8 r^4 + 1e8 r^6 + 1e-3 r^3 at r = 1: three terms of 1e8 that add up to nothing, and one of 1e-3.
  const terms: AsphereTerm[] = [
    { power: 2, coeff: 1e8 },
    { power: 3, coeff: 1e-3 },
    { power: 4, coeff: -2e8 },
    { power: 6, coeff: 1e8 },
  ];
  for (const r of [1, 1 + 2 ** -20, 0.99999, 1.00003, 0.5, 1.7]) {
    const [value, steepness] = polynomial(terms, r);
    const exact = exactPolynomial(terms, r);
    const scale = termScale(terms, r);
    assert.ok(Math.abs(value - exact) <= 2 * ulp(exact), `r = ${r}: ${value} against ${exact}`);
    // A sum in doubles, term by term, is off by the rounding of the terms: here some 1e-8, where the value is 1e-3.
    if (Math.abs(exact) < 1e-6 * scale) {
      const naive = terms.reduce((total, { power, coeff }) => total + coeff * r ** power, 0);
      assert.ok(Math.abs(naive - exact) > 100 * ulp(exact), `r = ${r}: a plain sum would do as well`);
    }
    // The derivative, exactly: the terms n a r^(n - 1), as a polynomial of its own.
    const derivative = terms.map(({ power, coeff }) => ({ power: power - 1, coeff: power * coeff }));
    // n a is exact here: every coefficient times its power is a double.
    for (const { power, coeff } of terms) assert.equal(twoProductError(power, coeff, power * coeff), 0);
    const exactSlope = exactPolynomial(derivative, r);
    assert.ok(Math.abs(steepness - exactSlope) <= 2 * ulp(exactSlope), `r = ${r}: slope ${steepness}`);
  }
  // The sag and the slope of a surface are those sums, added to the conic's.
  const flat = profileOf({ kind: "asphere", radius: null, conic: 0, terms });
  assert.equal(sag(flat, 1), polynomial(terms, 1)[0]);
  assert.equal(slope(flat, 1), polynomial(terms, 1)[1]);
  assert.equal(sag(flat, 1), 1e-3);
});

test("a coefficient times its power that is no double is carried exactly into the slope", () => {
  // 3 * (1 + 2^-52) needs 54 bits. Two such terms that cancel leave what the 54th bit was worth.
  const odd = 1 + 2 ** -52;
  assert.notEqual(twoProductError(3, odd, 3 * odd), 0);
  const terms: AsphereTerm[] = [
    { power: 3, coeff: odd },
    { power: 5, coeff: -0.6 * odd },
  ];
  // The slope 3 a r^2 + 5 b r^4 at r = 1 is (3 - 3.0000000000000004...) odd, a number of the order 1e-16.
  const [, steepness] = polynomial(terms, 1);
  // The reference, in whole numbers: each coefficient times its power as its rounded value and what was dropped.
  const reference = exactPolynomial(
    [
      { power: 0, coeff: 3 * odd },
      { power: 0, coeff: twoProductError(3, odd, 3 * odd) },
      { power: 0, coeff: 5 * (-0.6 * odd) },
      { power: 0, coeff: twoProductError(5, -0.6 * odd, 5 * (-0.6 * odd)) },
    ],
    1,
  );
  assert.ok(Math.abs(steepness - reference) <= ulp(reference), `${steepness} against ${reference}`);
  assert.ok(Math.abs(reference) < 1e-15 && reference !== 0);
});

test("the terms are taken as given: a power of 1, a gap between powers, and no terms at all", () => {
  assert.deepEqual(polynomial([], 3), [0, 0]);
  assert.deepEqual(polynomial([{ power: 1, coeff: 0.75 }], 4), [3, 0.75]);
  assert.deepEqual(polynomial([{ power: 1, coeff: 0.75 }], 0), [0, 0.75]);
  assert.deepEqual(polynomial([{ power: 20, coeff: 2 ** -20 }], 2), [1, 10]);
  assert.deepEqual(
    polynomial(
      [
        { power: 2, coeff: 0.5 },
        { power: 19, coeff: 1 },
      ],
      2,
    ),
    [2 + 2 ** 19, 2 + 19 * 2 ** 18],
  );
});
