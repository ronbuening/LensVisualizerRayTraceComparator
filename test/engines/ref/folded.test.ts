import assert from "node:assert/strict";
import test from "node:test";
import { finalizeCase } from "../../../src/contract/case.ts";
import { decodeNdArray, encodeF8 } from "../../../src/core/numeric/ndarray.ts";
import { buildRefSystem } from "../../../src/engines/ref/model.ts";
import { traceSurfaces } from "../../../src/engines/ref/trace.ts";
import { answerFirstOrder } from "../../../src/engines/ref/firstOrder.ts";
import { answerRays } from "../../../src/engines/ref/rays.ts";
import type { OpticalPathStep } from "../../../src/contract/case.ts";
import { foldedCase, SPHERICAL_MIRROR, MANGIN } from "./foldedFixture.ts";

const close = (actual: number, expected: number, tolerance = 2e-12) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const values = (wire: Parameters<typeof decodeNdArray>[0]) => decodeNdArray(wire).values;

test("spherical mirror: R/2 and closed-form longitudinal spherical aberration", () => {
  const system = buildRefSystem(SPHERICAL_MIRROR);
  const first = answerFirstOrder(system);
  assert.ok(first.supported);
  // Mirror vertex z=100, R=-100: f=R/2. Both principal planes are the vertex plane; both focal points are at
  // z=50. EFL is rear focal z minus rear principal z. The stop at z=0 is 100 mm (= 2f) in front of the mirror,
  // so it images onto itself: exit pupil z=0, magnification -1, radius 25.
  const expected = {
    efl: -50,
    rearFocalZ: 50,
    frontFocalZ: 50,
    frontPrincipalZ: 100,
    rearPrincipalZ: 100,
    backFocus: -50,
    entrancePupilZ: 0,
    entrancePupilSemiDiameter: 25,
    exitPupilZ: 0,
    exitPupilSemiDiameter: 25,
  } as const;
  for (const [name, value] of Object.entries(expected))
    close(values(first.data[name as keyof typeof expected])[0], value);
  for (const h of [0.01, 1, 10, 20]) {
    const trace = traceSurfaces(system, system.indexAfter[0], [0, h, -10], [0, 0, 1]);
    assert.equal(trace.status, "ok");
    const hit = trace.hits[1];
    // Sphere centre z=0, radius 100: hit z=sqrt(100^2-h^2).
    // Reflection gives dy=-2 h sqrt(100^2-h^2)/100^2, dz=-1+2h^2/100^2.
    // Eliminating the line parameter gives z_focus=100^2/(2sqrt(100^2-h^2)).
    const root = Math.sqrt(10000 - h * h);
    close(hit[2], root);
    close(trace.direction[1], (-2 * h * root) / 10000);
    close(hit[2] - (h * trace.direction[2]) / trace.direction[1], 5000 / root);
    close(trace.opticalPath, root + 10);
  }
});

test("a paraboloid has perfect axial focus and constant path to it at every height", () => {
  const draft = structuredClone(SPHERICAL_MIRROR);
  const opticalCase = finalizeCase({
    ...draft,
    system: {
      ...draft.system,
      surfaces: draft.system.surfaces.map((surface, at) =>
        at === 1 ? { ...surface, shape: { kind: "conic", radius: -100, conic: -1 } } : surface,
      ),
    },
  });
  const system = buildRefSystem(opticalCase);
  const h = [0, 1, 10, 20];
  const answer = answerRays(system, {
    line: 0,
    origins: encodeF8(
      h.flatMap((y) => [0, y, -10]),
      [4, 3],
    ),
    directions: encodeF8(
      h.flatMap(() => [0, 0, 1]),
      [4, 3],
    ),
    weights: encodeF8([1, 1, 1, 1]),
  });
  assert.ok("data" in answer);
  const image = values(answer.data.imagePoint),
    path = values(answer.data.opticalPathToImage);
  h.forEach((_height, ray) => {
    // z_hit=100-h^2/200; distance to (0,0,50)=50+h^2/200, so total path=160.
    close(image[3 * ray + 1], 0);
    close(image[3 * ray + 2], 50);
    close(path[ray], 160);
  });
});

test("Cassegrain EFL follows the two-mirror conjugate formula", () => {
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 70, radius: -80 }, { z: 100, radius: -100 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 2, interaction: "reflect" },
      { surfaceIndex: 1, interaction: "reflect" },
    ],
    110,
  );
  // Primary f=50. Secondary receives a converging beam with virtual p=-20 and f=-40.
  // 1/q=1/f-1/p=1/40; q=40, m=-q/p=2, EFL=m*50=100; focus=70+40=110.
  const answer = answerFirstOrder(buildRefSystem(opticalCase));
  assert.ok(answer.supported);
  close(values(answer.data.efl)[0], 100);
  close(values(answer.data.rearFocalZ)[0], 110);
  close(values(answer.data.backFocus)[0], 10);
});

test("Mangin: repeated entrance surface, two glass stretches, and Snell on the return pass", () => {
  const system = buildRefSystem(MANGIN);
  const h = 5,
    root = Math.sqrt(10000 - h * h);
  const hitZ = 10 - 100 + root;
  const dy = (-2 * h * root) / 10000,
    dz = -1 + (2 * h * h) / 10000;
  const t = -hitZ / dz;
  const trace = traceSurfaces(system, system.indexAfter[0], [0, h, -10], [0, 0, 1]);
  assert.equal(trace.status, "ok");
  assert.equal(trace.hits.length, 3);
  close(trace.hits[2][1], h + t * dy);
  close(trace.direction[1], 1.5 * dy);
  close(trace.direction[2], -Math.sqrt(1 - (1.5 * dy) ** 2));
  close(trace.opticalPath, 10 + 1.5 * (hitZ + t));
  const first = answerFirstOrder(system);
  assert.ok(first.supported);
  // Plane refractions surround reflection power 2n/R; f=R/(2n), focus=(1-2t/R)*f.
  close(values(first.data.efl)[0], -100 / 3);
  close(values(first.data.rearFocalZ)[0], -80 / 3);
});

test("an opaque annular band blocks exactly its closed band and transmits both complements", () => {
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 5, inner: 3, outer: 7 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "block" },
    ],
    10,
  );
  const system = buildRefSystem(opticalCase);
  for (const h of [0, 2.999, 3, 4, 7, 7.001, 10]) {
    const trace = traceSurfaces(system, system.indexAfter[0], [0, h, -1], [0, 0, 1]);
    assert.equal(trace.status, h >= 3 && h <= 7 ? "blocked" : "ok", `height ${h}`);
    if (trace.status === "blocked") assert.equal(trace.endSurface, 1);
  }
});

test("a stop exactly at a mirror's focus has its exit pupil at infinity, proven without a threshold", () => {
  const focused = foldedCase(
    [{ z: 0 }, { z: 100, radius: -200 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "reflect" },
    ],
    0,
  );
  const answer = answerFirstOrder(buildRefSystem(focused));
  assert.ok(answer.supported);
  // D_rear=1-(2/200)*100=0 exactly in rational arithmetic. Every ray from the stop centre exits parallel.
  assert.equal(values(answer.data.exitPupilSemiDiameter)[0], Infinity);
  assert.equal(values(answer.data.exitPupilZ)[0], -Infinity);
  // The vertex at z=100 is both principal planes, whatever the parity of the reflection count: F=F'=0, EFL=-100.
  close(values(answer.data.frontPrincipalZ)[0], 100);
  close(values(answer.data.rearPrincipalZ)[0], 100);
  close(values(answer.data.frontFocalZ)[0], 0);
  close(values(answer.data.rearFocalZ)[0], 0);
  close(values(answer.data.efl)[0], -100);
  const near = foldedCase([{ z: 0 }, { z: 100, radius: -200 - 2 ** -30 }], focused.system.opticalPath!, 0);
  const finite = answerFirstOrder(buildRefSystem(near));
  assert.ok(finite.supported);
  assert.ok(Number.isFinite(values(finite.data.exitPupilSemiDiameter)[0]));
});

/** One ray of a synthetic case through the recorder: status, end step, landing and the optical path to it. */
function oneRay(opticalCase: ReturnType<typeof foldedCase>, y: number) {
  const answer = answerRays(buildRefSystem(opticalCase), {
    line: 0,
    origins: encodeF8([0, y, -10], [1, 3]),
    directions: encodeF8([0, 0, 1], [1, 3]),
    weights: encodeF8([1]),
  });
  assert.ok("data" in answer);
  return {
    status: values(answer.data.status)[0],
    end: values(answer.data.endSurface)[0],
    image: [...values(answer.data.imagePoint)],
    toImage: values(answer.data.opticalPathToImage)[0],
    hits: [...values(answer.data.hits)],
  };
}
const OK = 0,
  BLOCKED = 1;

test("an active mirror's hole is transparent space and its rim clips; neither depends on the other", () => {
  // Plane mirror at z=100 with an active band 5..20; image plane behind it at z=150. Axial rays, unit index.
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 100, inner: 5, outer: 20 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "reflect" },
    ],
    150,
  );
  // In the hole: unchanged, lands at (0, 2, 150) after 10 + 100 + 50 mm.
  const hole = oneRay(opticalCase, 2);
  assert.equal(hole.status, OK);
  assert.deepEqual(hole.image, [0, 2, 150]);
  close(hole.toImage, 160);
  assert.deepEqual(hole.hits.slice(3, 6), [0, 2, 100]);
  // In the band: reflected to (0, 0, -1); the plane at z=150 lies behind it, so it is blocked after every step.
  const band = oneRay(opticalCase, 10);
  assert.equal(band.status, BLOCKED);
  assert.equal(band.end, 2);
  // Beyond the outer rim of an active visit: blocked at that visit.
  const rim = oneRay(opticalCase, 22);
  assert.equal(rim.status, BLOCKED);
  assert.equal(rim.end, 1);
});

test("a refracting visit's hole keeps the incident medium: the optical path tells glass from air", () => {
  // Plane S1 at z=10 enters glass 1.5 only within 5..25; plane S2 at z=20 returns to air; image at z=30.
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 10, inner: 5, n: 1.5 }, { z: 20 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "refract", mediumAfter: 1 },
      { surfaceIndex: 2, interaction: "refract", mediumAfter: null },
    ],
    30,
  );
  close(oneRay(opticalCase, 2).toImage, 10 + 10 + 10 + 10);
  close(oneRay(opticalCase, 10).toImage, 10 + 10 + 1.5 * 10 + 10);
});

test("incidence sides: a front-only mirror met from its rear passes, blocks in its band only, or reflects when rear-only", () => {
  // S1 at z=100 reflects every ray back toward -z; S2 at z=50 then meets it travelling -z, its rear side, since the
  // normal is oriented toward +z. Image plane at z=0.
  const sides = (step: Partial<OpticalPathStep>, outer = 25) =>
    foldedCase(
      [{ z: 0 }, { z: 50, outer }, { z: 100 }],
      [
        { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
        { surfaceIndex: 2, interaction: "reflect" },
        { surfaceIndex: 1, interaction: "reflect", incidentSide: "front", ...step },
      ],
      0,
    );
  // Inactive and ignored: unchanged, a hit at (0, 3, 50), landing (0, 3, 0) after 10 + 100 + 50 + 50 mm.
  const ignored = oneRay(sides({ inactiveSide: "ignore" }), 3);
  assert.equal(ignored.status, OK);
  assert.deepEqual(ignored.hits.slice(6, 9), [0, 3, 50]);
  assert.deepEqual(ignored.image, [0, 3, 0]);
  close(ignored.toImage, 210);
  // Inactive and blocking: stopped within its band 0..5, transmitted outside it (no outer clip on an inactive side).
  const blocking = sides({ inactiveSide: "block" }, 5);
  const inBand = oneRay(blocking, 3);
  assert.equal(inBand.status, BLOCKED);
  assert.equal(inBand.end, 2);
  const outside = oneRay(blocking, 8);
  assert.equal(outside.status, OK);
  assert.deepEqual(outside.image, [0, 8, 0]);
  // Active from the rear: reflected back to +z, so the plane at z=0 lies behind it.
  const rear = oneRay(sides({ incidentSide: "rear" }), 3);
  assert.equal(rear.status, BLOCKED);
  assert.equal(rear.end, 3);
});

test("a return refraction takes reverseMediumAfter: the image stretch is in air, not in the glass", () => {
  // Glass 1.5 between the plane S0 (z=0) and a plane mirror S1 (z=10); the return through S0 enters air. Image z=-20.
  const opticalCase = foldedCase(
    [
      { z: 0, n: 1.5 },
      { z: 10, n: 1.5 },
    ],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "reflect" },
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0, reverseMediumAfter: null },
    ],
    -20,
  );
  const ray = oneRay(opticalCase, 1);
  assert.equal(ray.status, OK);
  assert.deepEqual(ray.image, [0, 1, -20]);
  close(ray.toImage, 10 + 1.5 * 10 + 1.5 * 10 + 20);
});

test("a visit behind the ray is blocked: a fixed path never steps backwards along a line", () => {
  // The path asks S1 (z=50) and then S0 (z=0), which the ray travelling +z has already left behind.
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 50 }],
    [
      { surfaceIndex: 1, interaction: "refract", mediumAfter: 1 },
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
    ],
    100,
  );
  const ray = oneRay(opticalCase, 1);
  assert.equal(ray.status, BLOCKED);
  assert.equal(ray.end, 1);
  assert.deepEqual(ray.hits.slice(0, 3), [0, 1, 50]);
});

/** The same synthetic case with another physical stop; the stop's semi-diameter stays 25 mm. */
function withStop(opticalCase: ReturnType<typeof foldedCase>, stopIndex: number) {
  const draft = structuredClone(opticalCase);
  return finalizeCase({ ...draft, system: { ...draft.system, stopIndex } });
}

test("first order: the stop's first visit, not its physical index, places the pupils (Cassegrain, stop at the primary)", () => {
  const cassegrain = foldedCase(
    [{ z: 0 }, { z: 70, radius: -80 }, { z: 100, radius: -100 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 2, interaction: "reflect" },
      { surfaceIndex: 1, interaction: "reflect" },
    ],
    110,
  );
  const answer = answerFirstOrder(buildRefSystem(withStop(cassegrain, 2)));
  assert.ok(answer.supported);
  // Nothing bends before the primary: the entrance pupil is the primary itself.
  close(values(answer.data.entrancePupilZ)[0], 100);
  close(values(answer.data.entrancePupilSemiDiameter)[0], 25);
  // The secondary (f=-40) images the primary, 30 mm away: 1/s' = -1/40 - 1/30, s' = -120/7, a virtual image
  // 120/7 mm behind the secondary at z = 70 - 120/7, magnified 4/7.
  close(values(answer.data.exitPupilZ)[0], 70 - 120 / 7);
  close(values(answer.data.exitPupilSemiDiameter)[0], (25 * 4) / 7);
  close(values(answer.data.efl)[0], 100);
});

test("first order: a return refraction takes reverseMediumAfter, as the Mangin's null medium does", () => {
  const mangin = foldedCase(
    [
      { z: 0, n: 1.5 },
      { z: 10, radius: -100, n: 1.5 },
    ],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "reflect" },
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0, reverseMediumAfter: null },
    ],
    -80 / 3,
  );
  const first = answerFirstOrder(buildRefSystem(mangin));
  assert.ok(first.supported);
  close(values(first.data.efl)[0], -100 / 3);
  close(values(first.data.rearFocalZ)[0], -80 / 3);
});

test("first order: a mirror met from its inactive side is a pass, without power", () => {
  // The primary (z=100, R=-100) focuses at z=50; the front-only mirror at z=60 is met travelling -z (its rear side).
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 60, radius: 30 }, { z: 100, radius: -100 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 2, interaction: "reflect" },
      { surfaceIndex: 1, interaction: "reflect", incidentSide: "front" },
    ],
    50,
  );
  const first = answerFirstOrder(buildRefSystem(opticalCase));
  assert.ok(first.supported);
  close(values(first.data.efl)[0], -50);
  close(values(first.data.rearFocalZ)[0], 50);
});

test("first order: a stop at a mirror's focus puts the entrance pupil at infinity, proven without a threshold", () => {
  // A plane stop at z=50 behind the mirror (z=100, R=-100, f=-50) in the light's path: the front matrix's a is
  // 1 - 50 * (2/100) = 0 in exact arithmetic, so object-space chief rays are parallel to the axis.
  const opticalCase = foldedCase(
    [{ z: 0 }, { z: 50 }, { z: 100, radius: -100 }],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 2, interaction: "reflect" },
      { surfaceIndex: 1, interaction: "refract", mediumAfter: 1 },
    ],
    20,
  );
  const answer = answerFirstOrder(buildRefSystem(withStop(opticalCase, 1)));
  assert.ok(answer.supported);
  assert.equal(Math.abs(values(answer.data.entrancePupilZ)[0]), Infinity);
  assert.equal(values(answer.data.entrancePupilSemiDiameter)[0], Infinity);
});
