import assert from "node:assert/strict";
import { test } from "node:test";

import { LV_FLAT_RADIUS, surfaceShape } from "../../../src/engines/lv/exportShape.ts";
import type { ShapeResult } from "../../../src/engines/lv/exportShape.ts";
import { FLAT, stateOf } from "./exportSupport.ts";
import type { SurfaceSpec } from "./exportSupport.ts";

/** The shape of one hand-built surface. */
function shapeOf(surface: Omit<SurfaceSpec, "label" | "d">): ShapeResult {
  return surfaceShape(stateOf([{ label: "S", d: 1, ...surface }], { stopIndex: 0 }).surfaces[0]);
}

/** LensVisualizer's required coefficients, all zero: what an authored asphere always carries. */
const ZERO = { K: 0, A4: 0, A6: 0, A8: 0, A10: 0, A12: 0, A14: 0 };

test("a flat surface without an asphere is a plane, never a large radius", () => {
  assert.deepEqual(shapeOf({ R: FLAT }), { ok: true, shape: { kind: "plane" } });
  assert.deepEqual(shapeOf({ R: -FLAT }), { ok: true, shape: { kind: "plane" } });
});

test("the flat threshold is LensVisualizer's: a radius of exactly 1e10 is still a sphere", () => {
  assert.equal(LV_FLAT_RADIUS, 1e10);
  assert.deepEqual(shapeOf({ R: 1e10 }), { ok: true, shape: { kind: "conic", radius: 1e10, conic: 0 } });
  assert.deepEqual(shapeOf({ R: 1.0000001e10 }), { ok: true, shape: { kind: "plane" } });
});

test("a sphere is a conic of its radius with conic constant 0, sign kept", () => {
  assert.deepEqual(shapeOf({ R: 52.5 }), { ok: true, shape: { kind: "conic", radius: 52.5, conic: 0 } });
  assert.deepEqual(shapeOf({ R: -31.25 }), { ok: true, shape: { kind: "conic", radius: -31.25, conic: 0 } });
});

test("an even asphere has K as its conic and one term per coefficient that is not zero, in order of power", () => {
  // The coefficients are written out of order, as an object may hold them.
  const asphere = { A8: -2e-10, K: -0.5, A4: 1e-6, A6: 0, A10: 0, A12: 0, A14: 0, A20: 5e-30, A16: 0 };
  assert.deepEqual(shapeOf({ R: -80, asphere }), {
    ok: true,
    shape: {
      kind: "asphere",
      radius: -80,
      conic: -0.5,
      terms: [
        { power: 4, coeff: 1e-6 },
        { power: 8, coeff: -2e-10 },
        { power: 20, coeff: 5e-30 },
      ],
    },
  });
});

test("odd coefficients are terms of their own power, between the even ones", () => {
  const asphere = { ...ZERO, A4: 3e-6, A3: 2e-5, A5: -1e-7, A19: 4e-28 };
  const result = shapeOf({ R: 25, asphere });
  assert.ok(result.ok && result.shape.kind === "asphere");
  assert.deepEqual(result.shape.terms, [
    { power: 3, coeff: 2e-5 },
    { power: 4, coeff: 3e-6 },
    { power: 5, coeff: -1e-7 },
    { power: 19, coeff: 4e-28 },
  ]);
});

test("the power is read from the coefficient's name, so one LensVisualizer adds is carried too", () => {
  const result = shapeOf({ R: 25, asphere: { ...ZERO, A22: 1e-33 } });
  assert.ok(result.ok && result.shape.kind === "asphere");
  assert.deepEqual(result.shape.terms, [{ power: 22, coeff: 1e-33 }]);
});

test("an asphere on a flat base has no radius", () => {
  assert.deepEqual(shapeOf({ R: FLAT, asphere: { ...ZERO, K: 0, A4: 3e-6 } }), {
    ok: true,
    shape: { kind: "asphere", radius: null, conic: 0, terms: [{ power: 4, coeff: 3e-6 }] },
  });
});

test("an asphere whose coefficients are all zero is the conic it equals, with its K", () => {
  assert.deepEqual(shapeOf({ R: 33, asphere: { ...ZERO, K: -1 } }), {
    ok: true,
    shape: { kind: "conic", radius: 33, conic: -1 },
  });
  assert.deepEqual(shapeOf({ R: 33, asphere: ZERO }), { ok: true, shape: { kind: "conic", radius: 33, conic: 0 } });
  // A zero written with a sign is a zero.
  assert.deepEqual(shapeOf({ R: 33, asphere: { ...ZERO, A4: -0 } }), {
    ok: true,
    shape: { kind: "conic", radius: 33, conic: 0 },
  });
});

test("an all-zero asphere on a flat base is a plane: without curvature K has no effect", () => {
  assert.deepEqual(shapeOf({ R: FLAT, asphere: { ...ZERO, K: -1 } }), { ok: true, shape: { kind: "plane" } });
});

test("a coefficient that is not K or A<power> is a problem, not a dropped term", () => {
  const result = shapeOf({ R: 25, asphere: { ...ZERO, A4: 1e-6, Q4: 1e-3, A04: 1 } });
  assert.deepEqual(result, {
    ok: false,
    problems: [
      {
        code: "asphere-coefficient-unknown",
        message: 'surface S has the asphere coefficient "Q4", which is not K or A<power>',
      },
      {
        code: "asphere-coefficient-unknown",
        message: 'surface S has the asphere coefficient "A04", which is not K or A<power>',
      },
    ],
  });
});

test("a profile LensVisualizer builds otherwise than radius and asphere explain is a problem", () => {
  assert.deepEqual(shapeOf({ R: FLAT, kind: "tilted-plane" }), {
    ok: false,
    problems: [
      {
        code: "surface-profile-unsupported",
        message:
          'surface S has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give',
      },
    ],
  });
  // Each kind is checked against its own surface: a sphere that LV calls flat, a flat base that LV calls spherical.
  for (const [surface, expected] of [
    [{ R: 40, kind: "flat" }, "spherical"],
    [{ R: FLAT, kind: "spherical" }, "flat"],
    [{ R: 40, asphere: ZERO, kind: "spherical" }, "aspheric"],
    [{ R: FLAT, asphere: ZERO, kind: "flat" }, "aspheric"],
  ] as const) {
    const result = shapeOf(surface);
    assert.ok(!result.ok);
    assert.equal(result.problems[0].code, "surface-profile-unsupported");
    assert.ok(result.problems[0].message.includes(`not the ${expected} one`), result.problems[0].message);
  }
});
