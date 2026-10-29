// The quantity module of `vignetting.native`: its schemas, and what they cannot state.
import { VIGNETTING_NATIVE, VIGNETTING_NATIVE_VERSION } from "../contract/quantities/vignettingNative.ts";
import type { VignettingNativeData, VignettingNativeSpec } from "../contract/quantities/vignettingNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/**
 * The lines of a request are each named once, the first angle is the axis that every figure is relative to, and
 * every angle is at most the half field.
 */
function spec(value: unknown): ValidationIssue[] {
  const { lines, maxFieldDeg, fieldAnglesDeg } = value as VignettingNativeSpec;
  const issues: ValidationIssue[] = [];
  if (new Set(lines).size !== lines.length) issues.push(invariantIssue("/lines", "a line is asked once"));
  if (fieldAnglesDeg[0] !== 0) {
    issues.push(invariantIssue("/fieldAnglesDeg/0", "the first angle is 0: the axis every figure is relative to"));
  }
  fieldAnglesDeg.forEach((angle, at) => {
    if (angle > maxFieldDeg) {
      issues.push(invariantIssue(`/fieldAnglesDeg/${at}`, "an angle is at most the half field, maxFieldDeg"));
    }
  });
  return issues;
}

/**
 * An unavailable field says why and has neither figure; any other field has both, each a finite number, and one that
 * is unconverged says why.
 */
function data(value: unknown): ValidationIssue[] {
  const { fields } = value as VignettingNativeData;
  const issues: ValidationIssue[] = [];
  for (const [index, field] of fields.entries()) {
    const path = `/fields/${index}`;
    const figures = [field.geometricTransmission, field.relativeIllumination];
    if (field.status === "unavailable") {
      if (field.reason === undefined || figures.some((figure) => figure !== null)) {
        issues.push(invariantIssue(path, "an unavailable field has a reason and neither figure"));
      }
      continue;
    }
    if (!figures.every((figure) => figure !== null && Number.isFinite(figure))) {
      issues.push(invariantIssue(path, "a field that is not unavailable has both figures, each a finite number"));
    }
    if (field.status === "unconverged" && field.reason === undefined) {
      issues.push(invariantIssue(path, "an unconverged field says why"));
    }
  }
  return issues;
}

export const vignettingNativeQuantity = schemaQuantity(VIGNETTING_NATIVE, VIGNETTING_NATIVE_VERSION, { spec, data });
