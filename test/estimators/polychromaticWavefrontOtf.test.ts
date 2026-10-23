import assert from "node:assert/strict";
import { test } from "node:test";
import { polychromaticWavefrontOtf } from "../../src/estimators/polychromaticWavefrontOtf.ts";
import { wavefrontOtf } from "../../src/estimators/wavefrontOtf.ts";
import type { SampledWavefront } from "../../src/estimators/wavefrontOtf.ts";

const A = 1 / 8,
  N = 64;
const FREQUENCIES = [0, 8, 16, 32, -16];
const PARAMETERS = [
  { weight: 1 / 4, intensity: 1, wavelength: 1 / 2048, chief: [1 / 128, -1 / 64], tilt: [1 / 256, -1 / 128] },
  { weight: 3 / 4, intensity: 1 / 4, wavelength: 1 / 1024, chief: [3 / 128, -3 / 64], tilt: [-1 / 64, 1 / 128] },
];

function spectrum(disc = false) {
  return PARAMETERS.map((p) => {
    const pupilMm = new Float64Array(3 * N * N),
      opdWaves = new Float64Array(N * N);
    const intensity = new Float64Array(N * N),
      valid = new Uint8Array(N * N);
    for (let row = 0; row < N; row++)
      for (let col = 0; col < N; col++) {
        const cell = row * N + col,
          x = A * ((2 * col + 1) / N - 1),
          y = A * ((2 * row + 1) / N - 1);
        pupilMm.set([p.chief[0] - x, p.chief[1] - y, -Math.sqrt(1 - x * x - y * y)], 3 * cell);
        opdWaves[cell] = -(p.tilt[0] * x + p.tilt[1] * y) / p.wavelength;
        valid[cell] = Number(!disc || x * x + y * y < A * A);
        intensity[cell] = p.intensity;
      }
    const wavefront: SampledWavefront = {
      columns: N,
      rows: N,
      pupilMm,
      opdWaves,
      intensity,
      valid,
      centerMm: [...p.chief, 0],
      wavelengthMm: p.wavelength,
      imageIndex: 1,
    };
    return { weight: p.weight, wavefront };
  });
}

// For a uniform square, overlap/area = 1-|lambda nu|/(2A); for a disc it is the two circular
// segments 2/pi (acos(s)-s sqrt(1-s^2)). A linear W=t.c multiplies either by exp(+2pi i nu t).
// Each chief-centred OTF must additionally turn by exp(-2pi i nu (chief_l-chief_0)).
// Flux is intensity times the common pupil area, so the normalized coefficients are weight*intensity.
function analytic(axis: number, nu: number, disc = false, phase = true, weights = true, flux = true) {
  let re = 0,
    im = 0,
    total = 0;
  for (const p of PARAMETERS) {
    const s = Math.abs(p.wavelength * nu) / (2 * A);
    const overlap = s >= 1 ? 0 : disc ? (2 / Math.PI) * (Math.acos(s) - s * Math.sqrt(1 - s * s)) : 1 - s;
    const angle = 2 * Math.PI * nu * (p.tilt[axis] - (phase ? p.chief[axis] - PARAMETERS[0].chief[axis] : 0));
    const factor = (weights ? p.weight : 1) * (flux ? p.intensity : 1);
    re += factor * overlap * Math.cos(angle);
    im += factor * overlap * Math.sin(angle);
    total += factor;
  }
  return { real: re / total, imaginary: im / total, modulus: Math.hypot(re, im) / total };
}

// All shears are integer-cell lags on both grids: no square-rim or midpoint error, and affine W
// interpolates exactly in real arithmetic. Here |cz|>0.98 and h=2A/N. Radial normalization costs
// <=8 eps A in c; central differences/Jacobians cost <=32 N eps relatively, and sqrt(flux/J)
// <=64 N eps. The affine inverse has scale 1/h, hence <=64 N eps cell-coordinate error.
// Each phase gradient is <1 radian/cell, so interpolated pair phases cost <=128 N eps.
// Two ends, their Jacobian/amplitude products and the flux normalization give <=1024 N eps
// in normalized complex value; the existing phasor error is <1e-15. Four times that budget
// covers rounding of these bounds and the final modulus (which is 1-Lipschitz).
const ROUNDING = 4096 * N * Number.EPSILON;

test("two known tilted wavefronts with lateral colour: complex analytic sum, case weights AND transmitted flux", () => {
  const lines = spectrum();
  const result = polychromaticWavefrontOtf(lines, FREQUENCIES);
  assert.ok(result.available);
  for (const [axis, cut] of ["sagittal", "tangential"].entries())
    for (const [at, nu] of FREQUENCIES.entries()) {
      const expected = analytic(axis, nu);
      for (const component of ["real", "imaginary", "modulus"] as const)
        assert.ok(Math.abs(result[cut as "sagittal" | "tangential"][component][at] - expected[component]) < ROUNDING);
    }
  assert.equal(result.flux, N * N * (1 / 4 + 3 / 16));
  assert.equal(result.lines.length, 2);
  assert.equal(result.sagittal.real[0], 1);
  assert.ok(Math.abs(result.sagittal.imaginary[0]) < ROUNDING);
  // Explicit negative controls: each omitted factor changes this same case by >0.05 in modulus.
  // Thus deleting the phase, weights or intensity/flux factor in the implementation turns the proof red.
  for (const switches of [
    [false, true, true],
    [true, false, true],
    [true, true, false],
  ]) {
    const gap = Math.max(
      ...[0, 1].flatMap((axis) =>
        FREQUENCIES.map((nu) =>
          Math.abs(
            analytic(axis, nu).modulus -
              analytic(axis, nu, false, ...(switches as [boolean, boolean, boolean])).modulus,
          ),
        ),
      ),
    );
    assert.ok(gap > 0.05, `omitted factor changes modulus by ${gap}`);
  }
  // Actually sum the un-re-referenced wavefrontOtf answers: it is the false-phase analytic control.
  const own = lines.map((line) => wavefrontOtf(line.wavefront, FREQUENCIES));
  assert.ok(own[0].available && own[1].available);
  const at = 2;
  const re = (4 * own[0].sagittal.real[at] + 3 * own[1].sagittal.real[at]) / 7;
  const im = (4 * own[0].sagittal.imaginary[at] + 3 * own[1].sagittal.imaginary[at]) / 7;
  assert.ok(Math.abs(Math.hypot(re, im) - analytic(0, 16, false, false).modulus) < ROUNDING);
  assert.ok(Math.abs(Math.hypot(re, im) - result.sagittal.modulus[at]) > 0.1);
  // A common translation changes neither offsets nor pupil cosines.
  const translated = lines.map(({ weight, wavefront }) => ({
    weight,
    wavefront: {
      ...wavefront,
      centerMm: Array.from(wavefront.centerMm, (v, i) => v + [2, -3, 0][i]),
      pupilMm: Array.from(wavefront.pupilMm, (v, i) => v + [2, -3, 0][i % 3]),
    },
  }));
  const moved = polychromaticWavefrontOtf(translated, FREQUENCIES);
  assert.ok(moved.available);
  for (const cut of ["sagittal", "tangential"] as const)
    for (let i = 0; i < FREQUENCIES.length; i++)
      assert.ok(Math.abs(moved[cut].real[i] - result[cut].real[i]) < ROUNDING);
});

test("two uniform discs with tilts and distinct wavelengths: circular-segment analytic sum with rim bound", () => {
  const result = polychromaticWavefrontOtf(spectrum(true), FREQUENCIES);
  assert.ok(result.available);
  // Area difference e<=4sqrt(2)/N; normalized overlap error <=3e/(1-e). Unit phasors
  // preserve it, positive normalized spectral weights sum to one, and modulus is 1-Lipschitz.
  const e = (4 * Math.SQRT2) / N,
    bound = (3 * e) / (1 - e) + ROUNDING;
  for (const [axis, cut] of ["sagittal", "tangential"].entries())
    for (const [i, nu] of FREQUENCIES.entries()) {
      const expected = analytic(axis, nu, true);
      for (const component of ["real", "imaginary", "modulus"] as const)
        assert.ok(Math.abs(result[cut as "sagittal" | "tangential"][component][i] - expected[component]) <= bound);
    }
});

test("a spectrum never drops a line: unavailable outcomes name the line, including phase range and flux overflow", () => {
  const lines = spectrum();
  assert.equal(polychromaticWavefrontOtf([], [0]).available, false);
  for (const [change, reason] of [
    [{ valid: new Uint8Array(N * N) }, "no-rays"],
    [{ intensity: new Float64Array(N * N) }, "no-flux"],
    [{ centerMm: [NaN, 0, 0] }, "no-reference"],
    [{ wavelengthMm: 0 }, "bad-line"],
  ] as const) {
    const result = polychromaticWavefrontOtf(
      [lines[0], { ...lines[1], wavefront: { ...lines[1].wavefront, ...change } }],
      [16],
    );
    assert.ok(!result.available);
    assert.equal(result.line, 1);
    assert.equal(result.reason, reason);
    assert.match(result.message, /line 1/);
  }
  const far = lines[1].wavefront;
  const range = polychromaticWavefrontOtf(
    [
      lines[0],
      {
        ...lines[1],
        wavefront: {
          ...far,
          centerMm: [2 ** 30, far.centerMm[1], 0],
          pupilMm: Array.from(far.pupilMm, (v, i) => (i % 3 === 0 ? v + 2 ** 30 - far.centerMm[0] : v)),
        },
      },
    ],
    [16],
  );
  assert.ok(!range.available);
  assert.equal(range.reason, "out-of-range");
  assert.equal(range.line, 1);
  for (const weight of [0, -1, NaN, Infinity]) {
    const result = polychromaticWavefrontOtf([lines[0], { ...lines[1], weight }], [16]);
    assert.ok(!result.available);
    assert.equal(result.line, 1);
    assert.equal(result.reason, "bad-line-weight");
  }
  assert.equal(polychromaticWavefrontOtf(lines, [NaN]).available, false);
  const overflow = polychromaticWavefrontOtf([{ ...lines[0], weight: Number.MAX_VALUE }], [0]);
  assert.ok(!overflow.available);
  assert.equal(overflow.reason, "out-of-range");
  assert.throws(
    () => polychromaticWavefrontOtf([{ ...lines[0], wavefront: { ...lines[0].wavefront, opdWaves: [] } }], [0]),
    RangeError,
  );
});
