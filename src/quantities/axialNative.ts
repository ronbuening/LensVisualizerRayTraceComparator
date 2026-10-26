// The quantity module of `axial.native`: its schemas, and what they cannot state.
import { AXIAL_NATIVE, AXIAL_NATIVE_VERSION } from "../contract/quantities/axialNative.ts";
import type { AxialNativeData, AxialNativeSpec } from "../contract/quantities/axialNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/** The lines of a request are each named once. */
function spec(value: unknown): ValidationIssue[] {
  const { lines } = value as AxialNativeSpec;
  return new Set(lines).size === lines.length ? [] : [invariantIssue("/lines", "a line is asked once")];
}

/** The members of figures that spherical aberration has and colour has not. */
const SPHERICAL_ONLY = ["nearAxisInterceptZ", "bestFocusZ", "bestFocusRmsMm", "profileMm"] as const;

/**
 * An unavailable line says why and has neither figures nor rays; an ok line has exactly one of them. Figures of
 * spherical aberration have every member, those of colour none of `SPHERICAL_ONLY`. The arrays of rays are of one
 * set: m fractions, each finite, not 0 and from -1 to 1, m arrivals of 0 or 1, and exits of shape [m, 3].
 */
function data(value: unknown): ValidationIssue[] {
  const { kind, fields } = value as AxialNativeData;
  const issues: ValidationIssue[] = [];
  for (const [index, field] of fields.entries()) {
    const path = `/fields/${index}`;
    if (field.status === "unavailable") {
      if (field.reason === undefined || field.figures !== null || field.rays !== null) {
        issues.push(invariantIssue(path, "an unavailable line has a reason and neither figures nor rays"));
      }
      continue;
    }
    if ((field.figures === null) === (field.rays === null)) {
      issues.push(invariantIssue(path, "an ok line has its figures or its rays, and not both"));
      continue;
    }
    if (field.figures !== null) {
      const { figures } = field;
      const stated = SPHERICAL_ONLY.filter((name) => figures[name] !== null);
      if (kind === "spherical" ? stated.length !== SPHERICAL_ONLY.length : stated.length > 0) {
        const message =
          kind === "spherical"
            ? `the figures of spherical aberration have every one of ${SPHERICAL_ONLY.join(", ")}`
            : `the figures of colour have none of ${SPHERICAL_ONLY.join(", ")}`;
        issues.push(invariantIssue(`${path}/figures`, message));
      }
      continue;
    }
    const rays = field.rays!;
    try {
      const fractions = decodeNdArray(rays.fractions).values;
      const arrived = decodeNdArray(rays.arrived).values;
      const count = fractions.length;
      const [point, direction] = [rays.exitPoint.$nd.shape, rays.exitDirection.$nd.shape];
      if (
        count === 0 ||
        arrived.length !== count ||
        [point, direction].some(([m, axes]) => m !== count || axes !== 3)
      ) {
        issues.push(invariantIssue(`${path}/rays`, "the rays are m fractions, m arrivals and exits of shape [m, 3]"));
      } else if (!fractions.every((at) => Number.isFinite(at) && at !== 0 && at >= -1 && at <= 1)) {
        issues.push(invariantIssue(`${path}/rays/fractions`, "a fraction is a finite number from -1 to 1, not 0"));
      } else if (!arrived.every((at) => at === 0 || at === 1)) {
        issues.push(invariantIssue(`${path}/rays/arrived`, "an arrival is 0 or 1"));
      }
    } catch (error) {
      issues.push(invariantIssue(`${path}/rays`, String(error)));
    }
  }
  return issues;
}

export const axialNativeQuantity = schemaQuantity(AXIAL_NATIVE, AXIAL_NATIVE_VERSION, { spec, data });
