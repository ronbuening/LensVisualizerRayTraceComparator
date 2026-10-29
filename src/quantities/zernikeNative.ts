// The quantity module of `zernike.native`: its schemas, and what they cannot state.
import {
  FRINGE_MAX_TERMS,
  ZERNIKE_FIGURES,
  ZERNIKE_NATIVE,
  ZERNIKE_NATIVE_VERSION,
} from "../contract/quantities/zernikeNative.ts";
import type { ZernikeNativeData, ZernikeNativeSpec } from "../contract/quantities/zernikeNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/** The grid is even, and a Fringe fit asks at most OpticStudio's 37 terms. */
function spec(value: unknown): ValidationIssue[] {
  const { grid, ordering, terms } = value as ZernikeNativeSpec;
  const issues: ValidationIssue[] = [];
  if (grid % 2 !== 0) issues.push(invariantIssue("/grid", "the grid is even"));
  if (ordering === "fringe" && terms > FRINGE_MAX_TERMS) {
    issues.push(invariantIssue("/terms", `a Fringe fit takes at most ${FRINGE_MAX_TERMS} terms`));
  }
  return issues;
}

/**
 * The grid is even, and a Fringe answer has at most 37 terms; an unavailable field says why and states no figure;
 * an ok field states every figure, finite, a coefficient for every term, and at least as many valid samples as terms.
 */
function data(value: unknown): ValidationIssue[] {
  const answer = value as ZernikeNativeData;
  const issues = spec({ ...answer, fieldAnglesDeg: [], line: answer.line.index });
  for (const [index, field] of answer.fields.entries()) {
    const path = `/fields/${index}`;
    const figures = ZERNIKE_FIGURES.map((name) => field[name]);
    if (field.status === "unavailable") {
      const stated =
        field.coefficients.length > 0 || figures.some((entry) => entry !== null) || field.fitCondition !== null;
      if (field.reason === undefined || stated) {
        issues.push(invariantIssue(path, "an unavailable field has a reason and states no figure"));
      }
      continue;
    }
    if (field.coefficients.length !== answer.terms || !field.coefficients.every(Number.isFinite)) {
      issues.push(invariantIssue(`${path}/coefficients`, "an ok field states a finite coefficient for every term"));
    }
    if (
      figures.some((entry) => entry === null || !Number.isFinite(entry)) ||
      !Number.isFinite(field.fitCondition ?? 1)
    ) {
      issues.push(invariantIssue(path, "an ok field states every figure, finite"));
    }
    if (field.validSamples < answer.terms) {
      issues.push(invariantIssue(`${path}/validSamples`, "an ok field has at least as many valid samples as terms"));
    }
  }
  return issues;
}

export const zernikeNativeQuantity = schemaQuantity(ZERNIKE_NATIVE, ZERNIKE_NATIVE_VERSION, { spec, data });
