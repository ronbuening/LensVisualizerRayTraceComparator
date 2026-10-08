// How a metric is worded for people. The reason of a verdict and a report word it alike, so both read it here.
import type { ComparisonMetric } from "../contract/comparison.ts";
import { formatFixed, formatSci } from "../core/numeric/format.ts";

/** How many significant digits a metric, a limit and a place that is not a whole number have wherever one is worded. */
export const METRIC_DIGITS = 3;

/**
 * A metric, a limit or a place as text: a whole number in full, without an exponent, so that a count reads as a
 * count, and any other number in scientific notation with `METRIC_DIGITS` digits. NaN is "NaN" and the infinities
 * are "inf" and "-inf".
 */
export function numberText(value: number): string {
  return Number.isSafeInteger(value) ? formatFixed(value, 0) : formatSci(value, METRIC_DIGITS);
}

/**
 * Where a metric occurs, as words: ` at field 14 deg, index 3`, and nothing for a metric that occurs nowhere. The
 * keys are in code-unit order. A number is worded by `numberText`, and a string is given as it is.
 */
export function whereText(where: ComparisonMetric["where"]): string {
  const keys = Object.keys(where ?? {}).sort();
  const said = keys.map((key) => {
    const value = where?.[key];
    return `${key} ${typeof value === "number" ? numberText(value) : value}`;
  });
  return said.length === 0 ? "" : ` at ${said.join(", ")}`;
}
