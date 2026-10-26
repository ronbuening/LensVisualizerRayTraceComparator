// The quantity module of `chief.native`: its schemas, and what they cannot state.
import { CHIEF_NATIVE, CHIEF_NATIVE_VERSION } from "../contract/quantities/chiefNative.ts";
import type { ChiefFigures, ChiefNativeData, ChiefNativeSpec } from "../contract/quantities/chiefNative.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";

/**
 * The lines of a request are each named once, and distortion and pupils name one; every angle is at most the half
 * field, and an angle of distortion and of pupils is above 0: on the axis neither has a figure.
 */
function spec(value: unknown): ValidationIssue[] {
  const { kind, lines, maxFieldDeg, fieldAnglesDeg } = value as ChiefNativeSpec;
  const issues: ValidationIssue[] = [];
  if (new Set(lines).size !== lines.length) issues.push(invariantIssue("/lines", "a line is asked once"));
  if (kind !== "lateral-colour" && lines.length !== 1) {
    issues.push(invariantIssue("/lines", `${kind} is of one line`));
  }
  fieldAnglesDeg.forEach((angle, at) => {
    if (angle > maxFieldDeg) {
      issues.push(invariantIssue(`/fieldAnglesDeg/${at}`, "an angle is at most the half field, maxFieldDeg"));
    } else if (kind !== "lateral-colour" && !(angle > 0)) {
      issues.push(invariantIssue(`/fieldAnglesDeg/${at}`, `an angle of ${kind} is above 0`));
    }
  });
  return issues;
}

/** The members of figures each kind has; every other member is null. */
const MEMBERS: { readonly [kind: string]: readonly (keyof ChiefFigures)[] } = {
  distortion: ["realHeightMm", "idealHeightMm", "percent"],
  pupils: ["entrancePupilZ", "exitPupilZ"],
  "lateral-colour": [],
};

/**
 * An unavailable field says why and has neither figures nor a chief ray; an ok field has its landing. Of distortion an
 * ok field has its figures, every member of distortion's and no other; of lateral colour it has neither figures nor a
 * chief ray; of pupils its figures, every member of the pupils' and no other, or its chief ray, and not both. A chief
 * ray's points and directions are finite numbers.
 */
function data(value: unknown): ValidationIssue[] {
  const { kind, fields } = value as ChiefNativeData;
  const issues: ValidationIssue[] = [];
  const own = MEMBERS[kind];
  for (const [index, field] of fields.entries()) {
    const path = `/fields/${index}`;
    if (field.status === "unavailable") {
      if (field.reason === undefined || field.figures !== null || field.chiefRay !== null) {
        issues.push(invariantIssue(path, "an unavailable field has a reason and neither figures nor a chief ray"));
      }
      continue;
    }
    if (field.chiefLandingMm === null)
      issues.push(invariantIssue(`${path}/chiefLandingMm`, "an ok field has its landing"));
    if (kind === "lateral-colour" && (field.figures !== null || field.chiefRay !== null)) {
      issues.push(invariantIssue(path, "a field of lateral colour has neither figures nor a chief ray"));
      continue;
    }
    if (kind === "distortion" && (field.figures === null || field.chiefRay !== null)) {
      issues.push(invariantIssue(path, "an ok field of distortion has its figures and no chief ray"));
      continue;
    }
    if (kind === "pupils" && (field.figures === null) === (field.chiefRay === null)) {
      issues.push(invariantIssue(path, "an ok field of pupils has its figures or its chief ray, and not both"));
      continue;
    }
    if (field.figures !== null) {
      const { figures } = field;
      const complete = (Object.keys(figures) as (keyof ChiefFigures)[]).every(
        (name) => (figures[name] !== null) === own.includes(name),
      );
      if (!complete) {
        const message = `the figures of ${kind} have every one of ${own.join(", ")} and no other`;
        issues.push(invariantIssue(`${path}/figures`, message));
      }
    }
    if (field.chiefRay !== null) {
      const ray = field.chiefRay;
      const parts = [ray.entryPoint, ray.entryDirection, ray.exitPoint, ray.exitDirection];
      if (!parts.every((part) => part.every(Number.isFinite))) {
        issues.push(invariantIssue(`${path}/chiefRay`, "a chief ray's points and directions are finite numbers"));
      }
    }
  }
  return issues;
}

export const chiefNativeQuantity = schemaQuantity(CHIEF_NATIVE, CHIEF_NATIVE_VERSION, { spec, data });
