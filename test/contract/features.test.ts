import assert from "node:assert/strict";
import { test } from "node:test";

import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { OpticalCaseDraft } from "../../src/contract/case.ts";
import { FEATURE_FLAGS, FEATURE_LIMITS, deriveFeatures } from "../../src/contract/features.ts";
import type { CaseFeatures } from "../../src/contract/features.ts";
import { ALL_FEATURES_CASE, ALL_FEATURES_DRAFT, SINGLET_CASE, SINGLET_DRAFT, edited } from "./corpus.ts";

/** The features of the singlet after the given edits, each a JSON Pointer and its replacement. */
function featuresWith(...edits: [pointer: string, replacement: unknown][]): CaseFeatures {
  let draft: unknown = SINGLET_DRAFT;
  for (const [pointer, replacement] of edits) draft = edited(draft, pointer, replacement);
  const { system, conditions } = draft as OpticalCaseDraft;
  return deriveFeatures(system, conditions);
}

const SHAPE_0 = "/system/surfaces/0/shape";
const NO_LIMITS_REACHED = { "asphere.maxPower": 0, "lines.count": 1, "surfaces.count": 2 };

test("the flag and limit lists are sorted and without repeats", () => {
  assert.deepEqual([...FEATURE_FLAGS], [...new Set(FEATURE_FLAGS)].sort());
  assert.deepEqual([...FEATURE_LIMITS], [...new Set(FEATURE_LIMITS)].sort());
});

test("a spherical singlet at infinity on one line has no flag", () => {
  const { system, conditions } = SINGLET_DRAFT;
  assert.deepEqual(deriveFeatures(system, conditions), { flags: [], limits: NO_LIMITS_REACHED });
});

test("the all-features example carries every flag, in the list's order", () => {
  const { system, conditions } = ALL_FEATURES_DRAFT;
  assert.deepEqual(deriveFeatures(system, conditions), {
    flags: [...FEATURE_FLAGS],
    limits: { "asphere.maxPower": 6, "lines.count": 2, "surfaces.count": 7 },
  });
});

test("the limits always have a value for each limit", () => {
  for (const draft of [SINGLET_DRAFT, ALL_FEATURES_DRAFT]) {
    assert.deepEqual(Object.keys(deriveFeatures(draft.system, draft.conditions).limits), [...FEATURE_LIMITS]);
  }
});

test("surface.conic: a curved surface with a conic constant other than 0", () => {
  assert.deepEqual(featuresWith([`${SHAPE_0}/conic`, -1]).flags, ["surface.conic"]);
  assert.deepEqual(featuresWith([`${SHAPE_0}/conic`, 1e-12]).flags, ["surface.conic"]);
  assert.deepEqual(featuresWith([`${SHAPE_0}/conic`, -0]).flags, []);
  assert.deepEqual(featuresWith([SHAPE_0, { kind: "plane" }]).flags, []);
});

test("surface.asphere.even and .odd: an asphere has a term of that parity", () => {
  const asphere = (...powers: number[]): unknown => ({
    kind: "asphere",
    radius: 50,
    conic: 0,
    terms: powers.map((power) => ({ power, coeff: 1e-7 })),
  });
  assert.deepEqual(featuresWith([SHAPE_0, asphere(4, 6, 8)]), {
    flags: ["surface.asphere.even"],
    limits: { ...NO_LIMITS_REACHED, "asphere.maxPower": 8 },
  });
  assert.deepEqual(featuresWith([SHAPE_0, asphere(3)]), {
    flags: ["surface.asphere.odd"],
    limits: { ...NO_LIMITS_REACHED, "asphere.maxPower": 3 },
  });
  assert.deepEqual(featuresWith([SHAPE_0, asphere(1)]).flags, ["surface.asphere.odd"]);
  assert.deepEqual(featuresWith([SHAPE_0, asphere(2)]).flags, ["surface.asphere.even"]);
  assert.deepEqual(featuresWith([SHAPE_0, asphere(5, 4)]).flags, ["surface.asphere.even", "surface.asphere.odd"]);
});

test("a term counts whatever its coefficient", () => {
  const zeroTerm = { kind: "asphere", radius: 50, conic: 0, terms: [{ power: 20, coeff: 0 }] };
  assert.deepEqual(featuresWith([SHAPE_0, zeroTerm]), {
    flags: ["surface.asphere.even"],
    limits: { ...NO_LIMITS_REACHED, "asphere.maxPower": 20 },
  });
});

test("asphere.maxPower is the highest power over all surfaces", () => {
  const first = { kind: "asphere", radius: 50, conic: 0, terms: [{ power: 10, coeff: 1e-15 }] };
  const second = { kind: "asphere", radius: -50, conic: 0, terms: [{ power: 18, coeff: 1e-25 }] };
  const features = featuresWith([SHAPE_0, first], ["/system/surfaces/1/shape", second]);
  assert.equal(features.limits["asphere.maxPower"], 18);
});

test("an asphere's conic constant counts only when it has a base radius", () => {
  const terms = [{ power: 4, coeff: 1e-7 }];
  assert.deepEqual(featuresWith([SHAPE_0, { kind: "asphere", radius: 50, conic: -1, terms }]).flags, [
    "surface.asphere.even",
    "surface.conic",
  ]);
  // Without a radius the curvature is 0, so the conic constant multiplies nothing.
  assert.deepEqual(featuresWith([SHAPE_0, { kind: "asphere", radius: null, conic: -1, terms }]).flags, [
    "surface.asphere.even",
    "surface.asphere.flat-base",
  ]);
});

test("aperture.annular: a surface has an inner semi-diameter above 0", () => {
  assert.deepEqual(featuresWith(["/system/surfaces/1/aperture/innerSemiDiameter", 0.5]).flags, ["aperture.annular"]);
});

test("object.finite: the object is at a finite distance", () => {
  assert.deepEqual(featuresWith(["/conditions/object", { kind: "finite", z: -1000 }]).flags, ["object.finite"]);
});

test("lines.multiple: more than one line", () => {
  const line = { wavelengthNm: 500, weight: 1, indexSource: "anchored" };
  const features = featuresWith(
    ["/conditions/lines/1", line],
    ["/conditions/lines/2", line],
    ["/conditions/indexAfterSurface", encodeNdArray(Float64Array.of(1.5, 1, 1.52, 1, 1.52, 1), [3, 2])],
  );
  assert.deepEqual(features, { flags: ["lines.multiple"], limits: { ...NO_LIMITS_REACHED, "lines.count": 3 } });
});

test("surfaces.count counts every surface, synthetic plates included", () => {
  const { system, conditions } = ALL_FEATURES_DRAFT;
  assert.equal(system.surfaces.filter((surface) => surface.synthetic === "rearPlate").length, 2);
  assert.equal(deriveFeatures(system, conditions).limits["surfaces.count"], system.surfaces.length);
});

test("a finalised case states exactly its derived flags", () => {
  assert.deepEqual(SINGLET_CASE.features, []);
  assert.deepEqual(ALL_FEATURES_CASE.features, [...FEATURE_FLAGS]);
});
