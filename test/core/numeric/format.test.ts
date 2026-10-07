import assert from "node:assert/strict";
import { test } from "node:test";

import { formatFixed, formatSci, formatSignificant } from "../../../src/core/numeric/format.ts";

type Row = readonly [x: number, digits: number, expected: string];

function checkTable(format: (x: number, digits: number) => string, rows: readonly Row[]): void {
  for (const [x, digits, expected] of rows) {
    assert.equal(format(x, digits), expected, `${format.name}(${Object.is(x, -0) ? "-0" : x}, ${digits})`);
  }
}

test("formatSci prints the requested significant digits with a bare exponent", () => {
  checkTable(formatSci, [
    [1.24e-8, 3, "1.24e-8"],
    [1.2351e-8, 3, "1.24e-8"],
    [1.2349e-8, 3, "1.23e-8"],
    [2.3e-9, 2, "2.3e-9"],
    [5e-6, 2, "5.0e-6"],
    [123456, 3, "1.23e5"],
    [1, 1, "1e0"],
    [1, 3, "1.00e0"],
    [10, 2, "1.0e1"],
    [0.5, 1, "5e-1"],
    [1e-7, 1, "1e-7"],
    [1e21, 2, "1.0e21"],
    [-1.5e10, 2, "-1.5e10"],
    [-4.9e-11, 1, "-5e-11"],
    [5e-324, 3, "4.94e-324"],
    [Number.MAX_VALUE, 4, "1.798e308"],
    [Math.PI, 17, "3.1415926535897931e0"],
    [0.1, 20, "1.0000000000000000555e-1"],
  ]);
});

test("formatSci rounds the exact binary value to nearest, a tie away from zero", () => {
  checkTable(formatSci, [
    // A carry moves the exponent.
    [9.996, 3, "1.00e1"],
    [9.994, 3, "9.99e0"],
    [0.9996, 3, "1.00e0"],
    // 1.25 is exact in binary, so it is a true tie.
    [1.25, 2, "1.3e0"],
    [-1.25, 2, "-1.3e0"],
    // 1.35 is stored slightly above its decimal, 1.45 slightly below.
    [1.35, 2, "1.4e0"],
    [1.45, 2, "1.4e0"],
  ]);
});

test("formatSci spells zero, NaN and the infinities without digits", () => {
  checkTable(formatSci, [
    [0, 3, "0"],
    [-0, 3, "0"],
    [0, 1, "0"],
    [NaN, 3, "NaN"],
    [Infinity, 3, "inf"],
    [-Infinity, 3, "-inf"],
  ]);
});

test("formatFixed prints the requested decimals in positional notation", () => {
  checkTable(formatFixed, [
    [3.14159, 2, "3.14"],
    [123.456, 1, "123.5"],
    [123.456, 0, "123"],
    [-123.456, 2, "-123.46"],
    [1234567.891, 2, "1234567.89"],
    [0, 0, "0"],
    [0, 3, "0.000"],
    [1e-7, 7, "0.0000001"],
    [1e-7, 3, "0.000"],
    [0.000001, 6, "0.000001"],
    [0.1, 20, "0.10000000000000000555"],
    [1, 100, `1.${"0".repeat(100)}`],
  ]);
});

test("formatFixed rounds the exact binary value to nearest, a tie away from zero", () => {
  checkTable(formatFixed, [
    [0.5, 0, "1"],
    [1.5, 0, "2"],
    [2.5, 0, "3"],
    [-2.5, 0, "-3"],
    [0.4999, 0, "0"],
    // 1.005 is stored slightly below its decimal, 8.345 slightly above.
    [1.005, 2, "1.00"],
    [8.345, 2, "8.35"],
    [-0.005, 2, "-0.01"],
  ]);
});

test("formatFixed never prints a negative zero", () => {
  checkTable(formatFixed, [
    [-0, 0, "0"],
    [-0, 2, "0.00"],
    [-0.001, 2, "0.00"],
    [-0.4, 0, "0"],
    [-1e-320, 5, "0.00000"],
    [-5e-324, 100, `0.${"0".repeat(100)}`],
    // The sign stays as soon as one digit is not zero.
    [-0.001, 3, "-0.001"],
    [-0.006, 2, "-0.01"],
  ]);
});

test("formatFixed stays positional beyond 1e21, where toFixed would switch to an exponent", () => {
  checkTable(formatFixed, [
    [9.999999999999999e20, 0, "999999999999999868928"],
    [1e21, 0, "1000000000000000000000"],
    [1e21, 1, "1000000000000000000000.0"],
    [-1e21, 0, "-1000000000000000000000"],
    [1.5e22, 2, "15000000000000000000000.00"],
    [2 ** 70, 0, "1180591620717411303424"],
    [-(2 ** 70), 3, "-1180591620717411303424.000"],
  ]);
  const largest = formatFixed(Number.MAX_VALUE, 1);
  assert.equal(largest.length, 311);
  assert.match(largest, /^17976931348623157\d{292}\.0$/);
});

test("formatFixed spells NaN and the infinities without digits", () => {
  checkTable(formatFixed, [
    [NaN, 2, "NaN"],
    [Infinity, 2, "inf"],
    [-Infinity, 0, "-inf"],
  ]);
});

test("formatSignificant prints the requested significant digits in positional notation", () => {
  checkTable(formatSignificant, [
    [12.3456, 4, "12.35"],
    [0.00012345, 3, "0.000123"],
    [1.5, 3, "1.50"],
    [135.0012, 7, "135.0012"],
    [0.8234, 4, "0.8234"],
    [0.5, 1, "0.5"],
    [-0.5, 1, "-0.5"],
    [1.5e-10, 2, "0.00000000015"],
    [123456789, 9, "123456789"],
    [123456789, 10, "123456789.0"],
    [1234.5, 6, "1234.50"],
    // Digits beyond the precision are zeros, not an exponent.
    [1234.5, 3, "1230"],
    [-123.456, 2, "-120"],
    [1e21, 3, "1000000000000000000000"],
    [1e21, 25, "1000000000000000000000.000"],
    [5e-324, 1, `0.${"0".repeat(323)}5`],
    [Number.MAX_VALUE, 3, `180${"0".repeat(306)}`],
  ]);
});

test("formatSignificant rounds to nearest, a tie away from zero, and carries into a new digit", () => {
  checkTable(formatSignificant, [
    [1234.5, 4, "1235"],
    [-1234.5, 4, "-1235"],
    [999.96, 4, "1000"],
    [99.996, 4, "100.0"],
    [9.9996, 4, "10.00"],
    [0.99996, 4, "1.000"],
    [0.96, 1, "1"],
    [0.096, 1, "0.1"],
  ]);
});

test("formatSignificant spells zero, NaN and the infinities without digits", () => {
  checkTable(formatSignificant, [
    [0, 4, "0"],
    [-0, 4, "0"],
    [NaN, 1, "NaN"],
    [Infinity, 1, "inf"],
    [-Infinity, 1, "-inf"],
  ]);
});

test("a digit count outside the supported range throws", () => {
  const cases: readonly (readonly [() => string, string])[] = [
    [() => formatSci(1, 0), "formatSci: significantDigits must be an integer from 1 to 100, got 0"],
    [() => formatSci(1, 101), "formatSci: significantDigits must be an integer from 1 to 100, got 101"],
    [() => formatSci(1, 2.5), "formatSci: significantDigits must be an integer from 1 to 100, got 2.5"],
    [() => formatSci(NaN, NaN), "formatSci: significantDigits must be an integer from 1 to 100, got NaN"],
    [() => formatFixed(1, -1), "formatFixed: decimals must be an integer from 0 to 100, got -1"],
    [() => formatFixed(1, 101), "formatFixed: decimals must be an integer from 0 to 100, got 101"],
    [() => formatFixed(0, 0.5), "formatFixed: decimals must be an integer from 0 to 100, got 0.5"],
    [() => formatFixed(1, Infinity), "formatFixed: decimals must be an integer from 0 to 100, got Infinity"],
    [() => formatSignificant(1, 0), "formatSignificant: significantDigits must be an integer from 1 to 100, got 0"],
    [() => formatSignificant(0, 101), "formatSignificant: significantDigits must be an integer from 1 to 100, got 101"],
  ];
  for (const [run, message] of cases) {
    assert.throws(run, (error: unknown) => error instanceof RangeError && error.message === message, message);
  }
  // Both ends of each range are accepted.
  assert.equal(formatSci(0.000123456, 100).length, "1.e-4".length + 99);
  assert.equal(formatFixed(1, 0), "1");
  assert.equal(formatSignificant(1, 100), `1.${"0".repeat(99)}`);
});

test("output is plain ASCII with no grouping, whatever the magnitude", () => {
  const values = [0, -0, 1, -1, 0.1, 1234567.891, -98765432.1, 1e-12, 1e15, 1e21, 6.02214076e23, -2.5e-300, 5e-324];
  for (const x of values) {
    for (const text of [formatSci(x, 6), formatFixed(x, 3), formatSignificant(x, 6)]) {
      assert.match(text, /^-?\d+(\.\d+)?(e-?\d+)?$/, `${x} -> ${text}`);
      assert.ok(!text.startsWith("-") || /[1-9]/.test(text), `${x} -> ${text} is a negative zero`);
    }
  }
});

test("the same input always gives the same text", () => {
  const x = 0.1 + 0.2;
  assert.equal(formatSci(x, 17), "3.0000000000000004e-1");
  assert.equal(formatSci(x, 17), formatSci(x, 17));
  assert.equal(formatFixed(x, 17), "0.30000000000000004");
  assert.equal(formatSignificant(x, 17), "0.30000000000000004");
});
