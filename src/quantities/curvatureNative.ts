// The quantity module of `curvature.native`: its schemas, and what they cannot state.
import { CURVATURE_NATIVE, CURVATURE_NATIVE_VERSION } from "../contract/quantities/curvatureNative.ts";
import type { CurvatureNativeData, CurvatureNativeSpec } from "../contract/quantities/curvatureNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/** The lines of a request are each named once, and every angle is at most the half field. */
function spec(value: unknown): ValidationIssue[] {
  const { lines, maxFieldDeg, fieldAnglesDeg } = value as CurvatureNativeSpec;
  const issues: ValidationIssue[] = [];
  if (new Set(lines).size !== lines.length) issues.push(invariantIssue("/lines", "a line is asked once"));
  fieldAnglesDeg.forEach((angle, at) => {
    if (angle > maxFieldDeg) {
      issues.push(invariantIssue(`/fieldAnglesDeg/${at}`, "an angle is at most the half field, maxFieldDeg"));
    }
  });
  return issues;
}

/** An unavailable field says why and has neither focus; an ok field has both, each a finite number. */
function data(value: unknown): ValidationIssue[] {
  const { fields } = value as CurvatureNativeData;
  const issues: ValidationIssue[] = [];
  for (const [index, field] of fields.entries()) {
    const path = `/fields/${index}`;
    const shifts = [field.tangentialShiftMm, field.sagittalShiftMm];
    if (field.status === "unavailable") {
      if (field.reason === undefined || shifts.some((shift) => shift !== null)) {
        issues.push(invariantIssue(path, "an unavailable field has a reason and neither focus"));
      }
      continue;
    }
    if (!shifts.every((shift) => shift !== null && Number.isFinite(shift))) {
      issues.push(invariantIssue(path, "an ok field has both foci, each a finite number"));
    }
  }
  return issues;
}

export const curvatureNativeQuantity = schemaQuantity(CURVATURE_NATIVE, CURVATURE_NATIVE_VERSION, { spec, data });
