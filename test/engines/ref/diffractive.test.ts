import assert from "node:assert/strict";
import test from "node:test";
import { finalizeCase } from "../../../src/contract/case.ts";
import { encodeF8, decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { buildRefSystem } from "../../../src/engines/ref/model.ts";
import { traceSurfaces } from "../../../src/engines/ref/trace.ts";
import { phasePolynomial, phasePower, diffract } from "../../../src/engines/ref/phase.ts";
import { answerFirstOrder } from "../../../src/engines/ref/firstOrder.ts";
import { answerRays } from "../../../src/engines/ref/rays.ts";
import { KINOFORM, PHASE } from "./diffractiveFixture.ts";
import { foldedCase } from "./foldedFixture.ts";
import { foldedSingularities } from "../../../src/engines/ref/foldedSingularities.ts";
const close = (actual: number, expected: number, error = 1e-12) =>
  assert.ok(Math.abs(actual - expected) < error, `${actual} != ${expected}`);

test("quadratic kinoform: paraxial f and exact height-dependent focus derived from transverse momentum", () => {
  const system = buildRefSystem(KINOFORM);
  const first = answerFirstOrder(system);
  assert.ok(first.supported);
  // n=1, W=-r²/(2f), m=lambda/lambda0=1: dy=-h/f, dz=sqrt(1-h²/f²).
  // Axis intercept is h*dz/(h/f) = f*sqrt(1-h²/f²), tending to f=100.
  close(phasePower(PHASE, 500), 1 / 100);
  close(decodeNdArray(first.data.efl).values[0], 100);
  close(decodeNdArray(first.data.frontFocalZ).values[0], -100);
  close(decodeNdArray(first.data.rearPrincipalZ).values[0], 0);
  for (const h of [0, 0.125, 1, 8]) {
    const trace = traceSurfaces(system, [1], [0, h, -2], [0, 0, 1]);
    assert.equal(trace.status, "ok");
    close(trace.direction[1], -h / 100);
    close(trace.direction[2], Math.sqrt(1 - (h * h) / 10000));
    if (h) close((-h * trace.direction[2]) / trace.direction[1], 100 * Math.sqrt(1 - (h * h) / 10000));
    close(trace.opticalPath, 2);
    close(trace.phasePath[0], (-h * h) / 200);
  }
});
test("local linear grating: sin(theta_out) = sin(theta_in) + m lambda / period", () => {
  // At r=1, W=C2 r² has a local gradient 2C2=.25. At lambda/lambda0=2, m=-1,
  // the kick is -.5, equal to a linear grating of period lambda0/.25 in order -1.
  const phase = { ...PHASE, diffractionOrder: -1, terms: [{ radialPower: 2, coefficient: 0.125 }] };
  const out = diffract([0, 0.6, 0.8], [0, 0, 1], [0, 1, 0], 1, 1, phase, 1000);
  assert.ok(out);
  close(out[1], 0.1);
  close(out[2], Math.sqrt(0.99));
  assert.equal(diffract([0, 0, 1], [0, 0, 1], [0, 10, 0], 1, 1, phase, 1000), null);
});
test("phase path is per-surface and signed, distinct from geometric OPL", () => {
  const system = buildRefSystem(KINOFORM);
  const answer = answerRays(system, {
    line: 0,
    origins: encodeF8([0, 2, -3], [1, 3]),
    directions: encodeF8([0, 0, 1], [1, 3]),
    weights: encodeF8([1]),
  });
  assert.ok("data" in answer);
  close(decodeNdArray(answer.data.phasePath!).values[0], -0.02);
  close(decodeNdArray(answer.data.opticalPath).values[0], 3);
  // At z=100, length is 100/sqrt(1-.02²); the wave path additionally has W(2)=-.02.
  close(decodeNdArray(answer.data.opticalPathToImage).values[0], 3 + 100 / Math.sqrt(1 - 0.02 ** 2));
  const cancellation = {
    ...PHASE,
    terms: [
      { radialPower: 2, coefficient: 1e16 },
      { radialPower: 4, coefficient: 1 },
      { radialPower: 6, coefficient: -1e16 },
    ],
  };
  assert.equal(phasePolynomial(cancellation, 1), 1);
});
test("hybrid thin refractive-diffractive singlet achromatizes two lines in closed form", () => {
  // P(lambda)=(n(lambda)-1)c + k lambda. Equal powers demand
  // k=c*(n_blue-n_red)/(lambda_red-lambda_blue). C2=-k*lambda0/2.
  const c = 0.02,
    blue = 500,
    red = 600,
    nb = 1.52,
    nr = 1.5;
  const k = (c * (nb - nr)) / (red - blue);
  const phase = { ...PHASE, terms: [{ radialPower: 2, coefficient: (-k * 500) / 2 }] };
  const single = KINOFORM.system.surfaces[0];
  const back = {
    label: "back",
    z: 0,
    thickness: 100,
    shape: { kind: "plane" as const },
    aperture: single.aperture,
    elementId: 0,
  };
  const opticalCase = finalizeCase({
    ...KINOFORM,
    system: {
      ...KINOFORM.system,
      surfaces: [
        { ...single, shape: { kind: "conic", radius: 1 / c, conic: 0 }, diffractive: phase, thickness: 0 },
        back,
      ],
      lastLensSurfaceIndex: 1,
    },
    conditions: {
      ...KINOFORM.conditions,
      lines: [
        { wavelengthNm: blue, weight: 1, indexSource: "anchored" },
        { wavelengthNm: red, weight: 1, indexSource: "anchored" },
      ],
      indexAfterSurface: encodeF8([nb, 1, nr, 1], [2, 2]),
    },
  });
  const first = answerFirstOrder(buildRefSystem(opticalCase));
  assert.ok(first.supported);
  for (const value of decodeNdArray(first.data.efl).values) close(value, 1 / ((nb - 1) * c + k * blue));
});

test("phase derivative retains coefficient-times-power rounding through cancellation", () => {
  // From the original integer coefficients: 2*(-27021597764222972)+6*9007199254740991=2.
  // The rounded products alone cancel to zero.
  const terms = [
    { radialPower: 2, coefficient: -27021597764222972 },
    { radialPower: 6, coefficient: 9007199254740991 },
  ];
  assert.equal(2n * BigInt(terms[0].coefficient) + 6n * BigInt(terms[1].coefficient), 2n);
  assert.equal(phasePolynomial({ ...PHASE, terms }, 1, true), 2);
});

test("odd radial phase term has its exact grating kick and no quadratic power", () => {
  const phase = { ...PHASE, terms: [{ radialPower: 3, coefficient: -0.01 }] };
  assert.equal(phasePower(phase, 500), 0);
  const out = diffract([0, 0, 1], [0, 0, 1], [0, 2, 0], 1, 1, phase, 500);
  assert.ok(out);
  // d(C3*r^3)/dr=3*C3*r² = -.12 at r=2.
  close(out[1], -0.12);
  close(phasePolynomial(phase, 2), -0.08);
});

test("folded pupil singularity proof includes exact phase power at the requested wavelength", () => {
  // n=2, c=1/64: refractive P=1/64 and gap/n=64 make the substrate's front A exactly zero.
  // Add phase P=1/128: A=1-64*(1/64+1/128)=-1/2, giving finite pupil radius 10/|A|=20.
  const base = foldedCase(
    [
      { z: 0, radius: 64, n: 2, outer: 10 },
      { z: 128, n: 2, outer: 10 },
    ],
    [
      { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
      { surfaceIndex: 1, interaction: "pass" },
    ],
    200,
  );
  const opticalCase = finalizeCase({
    ...base,
    system: {
      ...base.system,
      stopIndex: 1,
      surfaces: base.system.surfaces.map((surface, at) =>
        at
          ? surface
          : {
              ...surface,
              diffractive: { ...PHASE, terms: [{ radialPower: 2, coefficient: -1 / 256 }] },
            },
      ),
    },
    conditions: { ...base.conditions, stopSemiDiameter: 10, lines: KINOFORM.conditions.lines },
  });
  const system = buildRefSystem(opticalCase);
  assert.equal(foldedSingularities(system, system.indexAfter[0], 500).entrance, null);
  const first = answerFirstOrder(system);
  assert.ok(first.supported);
  close(decodeNdArray(first.data.entrancePupilSemiDiameter).values[0], 20);
  // At lambda=1000 the phase power doubles: A=-1, still finite.
  assert.equal(foldedSingularities(system, system.indexAfter[0], 1000).entrance, null);
});

test("curved substrate: the phase gradient is projected onto the sheet before the momentum is completed", () => {
  // Sphere point (0,30) of radius 50: N=(0,-.6,.8). C2=-1/240 gives g=(0,-.25,0), g.N=.15, Pg=(0,-.16,-.12);
  // D=(0,0,1): PD=(0,.48,.36). t=(0,.32,.24), |t|²=.16, D_out=t+sqrt(.84)N. An unprojected g gives t=(0,.23,.36).
  const phase = { ...PHASE, terms: [{ radialPower: 2, coefficient: -1 / 240 }] };
  const out = diffract([0, 0, 1], [0, -0.6, 0.8], [0, 30, 0], 1, 1, phase, 500);
  assert.ok(out);
  const root = Math.sqrt(0.84);
  close(out[0], 0);
  close(out[1], 0.32 - 0.6 * root);
  close(out[2], 0.24 + 0.8 * root);
});

test("phasePath rows are per surface and ray, at the request line's order and wavelength ratio", () => {
  // m=-2, lambda0=500, line 1 at 750 nm: s=-3. W=-r²/200, so W(2)=-.02 and W(1)=-.005 give phase paths
  // .06 and .015 at the phase plane and 0 at the plain plane behind it; the kicks are -s*r/100 = .06 and .03.
  const phase = { ...PHASE, diffractionOrder: -2 };
  const { diffractive: _phase, ...plain } = KINOFORM.system.surfaces[0];
  const doe = { ...plain, thickness: 10, diffractive: phase };
  const plate = { ...plain, label: "plate", z: 10, thickness: 90 };
  const opticalCase = finalizeCase({
    ...KINOFORM,
    system: { ...KINOFORM.system, surfaces: [doe, plate], lastLensSurfaceIndex: 1 },
    conditions: {
      ...KINOFORM.conditions,
      lines: [
        { wavelengthNm: 500, weight: 1, indexSource: "anchored" },
        { wavelengthNm: 750, weight: 1, indexSource: "anchored" },
      ],
      indexAfterSurface: encodeF8([1, 1, 1, 1], [2, 2]),
    },
  });
  const answer = answerRays(buildRefSystem(opticalCase), {
    line: 1,
    origins: encodeF8([0, 2, -3, 0, 1, -3], [2, 3]),
    directions: encodeF8([0, 0, 1, 0, 0, 1], [2, 3]),
    weights: encodeF8([1, 1]),
  });
  assert.ok("data" in answer);
  const rows = decodeNdArray(answer.data.phasePath!);
  assert.deepEqual(rows.shape, [2, 2]);
  [0.06, 0.015, 0, 0].forEach((expected, at) => close(rows.values[at], expected));
  const exit = decodeNdArray(answer.data.exitDirection).values;
  close(exit[1], 0.06);
  close(exit[4], 0.03);
});
