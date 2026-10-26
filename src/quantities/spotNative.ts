// The quantity module of `spot.native`: its schemas, and what they cannot state.
import { SPOT_NATIVE, SPOT_NATIVE_VERSION } from "../contract/quantities/spotNative.ts";
import type { SpotNativeData, SpotNativeSpec } from "../contract/quantities/spotNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/** A fan has an odd number of samples, so that its middle one is the chief ray's place. */
function spec(value: unknown): ValidationIssue[] {
  const { pupil } = value as SpotNativeSpec;
  return pupil.kind === "fan" && pupil.samples % 2 === 0
    ? [invariantIssue("/pupil/samples", "a fan has an odd number of samples")]
    : [];
}

/**
 * An unavailable field says why and has neither spot nor fan; an ok field has exactly the member of the answer's
 * pattern; a fan's two arrays have one length, and its pupil coordinates are finite numbers from -1 to 1.
 */
function data(value: unknown): ValidationIssue[] {
  const { pattern, fields } = value as SpotNativeData;
  const issues: ValidationIssue[] = [];
  for (const [index, field] of fields.entries()) {
    const path = `/fields/${index}`;
    if (field.status === "unavailable") {
      if (field.reason === undefined || field.spot !== null || field.fan !== null) {
        issues.push(invariantIssue(path, "an unavailable field has a reason and neither spot nor fan"));
      }
      continue;
    }
    const [wanted, unwanted] = pattern === "rings" ? (["spot", "fan"] as const) : (["fan", "spot"] as const);
    if (field[wanted] === null || field[unwanted] !== null) {
      issues.push(invariantIssue(path, `an ok field of a ${pattern} answer has its ${wanted} and no ${unwanted}`));
      continue;
    }
    if (field.fan === null) continue;
    try {
      const pupil = decodeNdArray(field.fan.pupil).values;
      const error = decodeNdArray(field.fan.errorMm).values;
      if (pupil.length !== error.length || pupil.length === 0) {
        issues.push(invariantIssue(`${path}/fan`, "the pupil and the errors of a fan have one length, above 0"));
      } else if (!pupil.every((at) => Number.isFinite(at) && at >= -1 && at <= 1)) {
        issues.push(invariantIssue(`${path}/fan/pupil`, "a pupil coordinate is a finite number from -1 to 1"));
      }
    } catch (error) {
      issues.push(invariantIssue(`${path}/fan`, String(error)));
    }
  }
  return issues;
}

export const spotNativeQuantity = schemaQuantity(SPOT_NATIVE, SPOT_NATIVE_VERSION, { spec, data });
