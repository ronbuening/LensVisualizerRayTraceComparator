// Deterministic number formatting for reports.
//
// Everything is built on `Number.prototype.toExponential` and `toFixed`, which ECMAScript defines exactly: the
// nearest decimal to the double's exact value, a tie going away from zero. No locale is consulted, so the same
// number gives the same text on every machine. Shared conventions: NaN is "NaN", the infinities are "inf" and
// "-inf", and a minus sign is printed only in front of a non-zero digit, so "-0" never appears.

const MAX_DIGITS = 100;

function requireDigits(name: string, parameter: string, value: number, min: number): void {
  if (!Number.isInteger(value) || value < min || value > MAX_DIGITS) {
    throw new RangeError(`${name}: ${parameter} must be an integer from ${min} to ${MAX_DIGITS}, got ${value}`);
  }
}

/** The spelling of NaN and the infinities, or null for a finite number. */
function nonFinite(x: number): string | null {
  if (Number.isNaN(x)) return "NaN";
  if (x === Infinity) return "inf";
  if (x === -Infinity) return "-inf";
  return null;
}

/**
 * Scientific notation with exactly `significantDigits` digits: `formatSci(1.2351e-8, 3)` is "1.24e-8". The
 * exponent has no "+" and no padding ("1.00e0", "1.23e5"), trailing zeros are kept, and zero of either sign is
 * "0". Throws unless `significantDigits` is an integer from 1 to 100.
 */
export function formatSci(x: number, significantDigits: number): string {
  requireDigits("formatSci", "significantDigits", significantDigits, 1);
  const special = nonFinite(x);
  if (special !== null) return special;
  if (x === 0) return "0";
  return x.toExponential(significantDigits - 1).replace("e+", "e");
}

/**
 * Positional notation with exactly `decimals` digits after the point: `formatFixed(3.14159, 2)` is "3.14". Never
 * uses an exponent, however large the number. A value that rounds to zero prints without a sign
 * (`formatFixed(-0.001, 2)` is "0.00"). Throws unless `decimals` is an integer from 0 to 100.
 */
export function formatFixed(x: number, decimals: number): string {
  requireDigits("formatFixed", "decimals", decimals, 0);
  const special = nonFinite(x);
  if (special !== null) return special;
  const magnitude = Math.abs(x);
  // toFixed switches to exponent notation at 1e21. A double that large is an integer, and BigInt prints it exactly.
  const digits =
    magnitude >= 1e21
      ? `${BigInt(magnitude)}${decimals > 0 ? `.${"0".repeat(decimals)}` : ""}`
      : magnitude.toFixed(decimals);
  return x < 0 && /[1-9]/.test(digits) ? `-${digits}` : digits;
}

/**
 * Positional notation rounded to `significantDigits` digits: 12.3456 at 4 digits is "12.35", 0.00012345 at 3 is
 * "0.000123", 1.5 at 3 is "1.50". Never uses an exponent: digits beyond the precision of a large number are
 * printed as zeros (1234.5 at 3 is "1230"), so use `formatSci` where magnitudes vary widely. Zero of either sign
 * is "0". Throws unless `significantDigits` is an integer from 1 to 100.
 */
export function formatSignificant(x: number, significantDigits: number): string {
  requireDigits("formatSignificant", "significantDigits", significantDigits, 1);
  const special = nonFinite(x);
  if (special !== null) return special;
  if (x === 0) return "0";
  // toExponential does the rounding; what follows only lays its digits out without the exponent.
  const rounded = Math.abs(x).toExponential(significantDigits - 1);
  const [mantissa, exponentText] = rounded.split("e");
  const digits = mantissa.replace(".", "");
  // The decimal position of the first digit after rounding: 9.996 at 3 digits is 1.00e1.
  const exponent = Number(exponentText);
  let text: string;
  if (exponent < 0) text = `0.${"0".repeat(-exponent - 1)}${digits}`;
  else if (exponent >= significantDigits - 1) text = digits + "0".repeat(exponent - (significantDigits - 1));
  else text = `${digits.slice(0, exponent + 1)}.${digits.slice(exponent + 1)}`;
  return x < 0 ? `-${text}` : text;
}
