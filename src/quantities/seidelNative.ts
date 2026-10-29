// The quantity module of `seidel.native`: its schemas, and what they cannot state.
import {
  CHROMATIC_SUMS,
  SEIDEL_NATIVE,
  SEIDEL_NATIVE_VERSION,
  SEIDEL_SUMS,
  THIRD_ORDER_SUMS,
} from "../contract/quantities/seidelNative.ts";
import type { SeidelNativeData, SeidelNativeSpec, SeidelSums } from "../contract/quantities/seidelNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/** The two dispersion lines of a spec are two lines. */
function spec(value: unknown): ValidationIssue[] {
  const { dispersionLines } = value as SeidelNativeSpec;
  return dispersionLines === undefined || dispersionLines[0] !== dispersionLines[1]
    ? []
    : [invariantIssue("/dispersionLines", "the two dispersion lines are two lines")];
}

/** The sums of `sums` that are stated. */
function stated(sums: SeidelSums): number[] {
  return SEIDEL_SUMS.map((name) => sums[name]).filter((entry): entry is number => entry !== null);
}

/**
 * An unavailable answer says why and states no value; an ok one states its invariant and the five totals of third
 * order, every value it states is finite, its surfaces ascend and are each listed once, and without dispersion lines
 * it states no chromatic sum.
 */
function data(value: unknown): ValidationIssue[] {
  const answer = value as SeidelNativeData;
  const issues: ValidationIssue[] = [];
  if (answer.status === "unavailable") {
    const nothing = answer.invariant === null && answer.surfaces.length === 0 && stated(answer.total).length === 0;
    if (answer.reason === undefined || !nothing) {
      issues.push(invariantIssue("", "an unavailable answer has a reason and states no value"));
    }
    return issues;
  }
  if (answer.invariant === null || THIRD_ORDER_SUMS.some((name) => answer.total[name] === null)) {
    issues.push(invariantIssue("/total", "an ok answer states its invariant and the five sums of third order"));
  }
  const finite = (path: string, sums: SeidelSums): void => {
    for (const name of SEIDEL_SUMS) {
      const entry = sums[name];
      if (entry !== null && !Number.isFinite(entry)) {
        issues.push(invariantIssue(`${path}/${name}`, "a value an ok answer states is a finite number"));
      }
    }
  };
  if (answer.invariant !== null && !Number.isFinite(answer.invariant)) {
    issues.push(invariantIssue("/invariant", "a value an ok answer states is a finite number"));
  }
  finite("/total", answer.total);
  answer.surfaces.forEach((surface, index) => {
    finite(`/surfaces/${index}`, surface);
    if (index > 0 && !(surface.surface > answer.surfaces[index - 1].surface)) {
      issues.push(invariantIssue(`/surfaces/${index}/surface`, "the surfaces ascend and are each listed once"));
    }
  });
  if (answer.dispersionLines === null) {
    const coloured = [answer.total, ...answer.surfaces].some((sums) =>
      CHROMATIC_SUMS.some((name) => sums[name] !== null),
    );
    if (coloured) issues.push(invariantIssue("/dispersionLines", "a chromatic sum is of two dispersion lines"));
  } else if (answer.dispersionLines[0] === answer.dispersionLines[1]) {
    issues.push(invariantIssue("/dispersionLines", "the two dispersion lines are two lines"));
  }
  return issues;
}

export const seidelNativeQuantity = schemaQuantity(SEIDEL_NATIVE, SEIDEL_NATIVE_VERSION, { spec, data });
