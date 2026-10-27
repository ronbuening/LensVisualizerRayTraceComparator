// The quantity module of `summary.native`: its schemas, and what they cannot state.
import { SUMMARY_NATIVE, SUMMARY_NATIVE_VERSION, SUMMARY_VALUES } from "../contract/quantities/summaryNative.ts";
import type { SummaryNativeData, SummaryNativeSpec } from "../contract/quantities/summaryNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/** The lines of a request are each named once. */
function spec(value: unknown): ValidationIssue[] {
  const { lines } = value as SummaryNativeSpec;
  return new Set(lines).size === lines.length ? [] : [invariantIssue("/lines", "a line is asked once")];
}

/**
 * An unavailable line says why and states no value; every value an ok line states is a finite number, and an ok line
 * states at least one.
 */
function data(value: unknown): ValidationIssue[] {
  const { lines } = value as SummaryNativeData;
  const issues: ValidationIssue[] = [];
  for (const [index, line] of lines.entries()) {
    const path = `/lines/${index}`;
    const stated = SUMMARY_VALUES.map((name) => line[name]).filter((entry) => entry !== null);
    if (line.status === "unavailable") {
      if (line.reason === undefined || stated.length > 0) {
        issues.push(invariantIssue(path, "an unavailable line has a reason and states no value"));
      }
      continue;
    }
    if (stated.length === 0) issues.push(invariantIssue(path, "an ok line states at least one value"));
    for (const name of SUMMARY_VALUES) {
      const entry = line[name];
      if (entry !== null && !Number.isFinite(entry)) {
        issues.push(invariantIssue(`${path}/${name}`, "a value an ok line states is a finite number"));
      }
    }
  }
  return issues;
}

export const summaryNativeQuantity = schemaQuantity(SUMMARY_NATIVE, SUMMARY_NATIVE_VERSION, { spec, data });
