import assert from "node:assert/strict";
import { test } from "node:test";
import { wavefrontOtf } from "../../src/estimators/wavefrontOtf.ts";
import type { SampledWavefront } from "../../src/estimators/wavefrontOtf.ts";
import { importClosure } from "../../src/engines/adapterRevision.ts";

const A = 1 / 8;
const LAMBDA = 1 / 2048;

/** Reference sphere whose radial optical cosines form an affine midpoint grid, n=1. */
function pupil(n: number, lit: (x: number, y: number) => boolean, opd: (x: number, y: number) => number = () => 0) {
  const pupilMm = new Float64Array(3 * n * n);
  const opdWaves = new Float64Array(n * n);
  const intensity = new Float64Array(n * n);
  const valid = new Uint8Array(n * n);
  for (let row = 0; row < n; row++)
    for (let column = 0; column < n; column++) {
      const cell = row * n + column;
      const x = A * ((2 * column + 1) / n - 1),
        y = A * ((2 * row + 1) / n - 1);
      pupilMm.set([-x, -y, -Math.sqrt(1 - x * x - y * y)], 3 * cell);
      valid[cell] = Number(lit(x, y));
      intensity[cell] = valid[cell];
      opdWaves[cell] = opd(x, y);
    }
  return {
    columns: n,
    rows: n,
    pupilMm,
    opdWaves,
    intensity,
    valid,
    centerMm: [0, 0, 0],
    wavelengthMm: LAMBDA,
    imageIndex: 1,
  } satisfies SampledWavefront;
}

function disc(s: number): number {
  return s >= 1 ? 0 : (2 / Math.PI) * (Math.acos(s) - s * Math.sqrt(1 - s * s));
}

/** Intersection of circles, two circular segments (including containment and separation). */
function overlap(a: number, b: number, d: number): number {
  if (d >= a + b) return 0;
  if (d <= Math.abs(a - b)) return Math.PI * Math.min(a, b) ** 2;
  return (
    a * a * Math.acos((d * d + a * a - b * b) / (2 * d * a)) +
    b * b * Math.acos((d * d + b * b - a * a) / (2 * d * b)) -
    0.5 * Math.sqrt((-d + a + b) * (d + a - b) * (d - a + b) * (d + a + b))
  );
}

test("uniform circular sphere pupil: closed-form diffraction MTF with a derived rim bound", () => {
  const n = 128;
  const shares = [0, 0.03125, 0.2, 0.5, 0.8, 1, 1.1];
  const input = pupil(n, (x, y) => x * x + y * y < A * A);
  const answer = wavefrontOtf(
    input,
    shares.map((s) => (2 * A * s) / LAMBDA),
  );
  assert.ok(answer.available);
  // Only cells whose centers lie within h/sqrt(2) of the circle can differ. The area of that
  // two-sided annular strip divided by pi A^2 is e<=4 sqrt(2)/n. A normalized autocorrelation
  // changes by at most 3e/(1-e): two translated boundaries and one flux denominator.
  const e = (4 * Math.SQRT2) / n,
    bound = (3 * e) / (1 - e);
  for (const cut of [answer.sagittal, answer.tangential])
    for (const [i, s] of shares.entries()) {
      assert.ok(Math.abs(cut.modulus[i] - disc(s)) <= bound + 2e-12);
      assert.ok(Math.abs(cut.imaginary[i]) < 2e-13);
    }
  assert.equal(answer.sagittal.real[0], 1);
  assert.equal(answer.sagittal.modulus.at(-1), 0);
  // An independent whole-cell count holds the staircase at an integer lag far more tightly.
  const lag = 16;
  let area = 0,
    pairs = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (input.valid[r * n + c]) {
        area++;
        if (c + lag < n && input.valid[r * n + c + lag]) pairs++;
      }
  const stair = wavefrontOtf(input, [(lag * ((2 * A) / n)) / LAMBDA]);
  assert.ok(stair.available);
  assert.ok(Math.abs(stair.sagittal.real[0] - pairs / area) < 2e-12);
});

test("a pure tilt has the rectangular-pupil closed form, complex sign, and conjugacy", () => {
  const tilt = 1 / 4;
  const frequency = 13;
  const input = pupil(
    64,
    () => true,
    (x) => (-tilt * x) / LAMBDA,
  );
  const result = wavefrontOtf(input, [0, frequency, -frequency]);
  assert.ok(result.available);
  const modulus = 1 - (LAMBDA * frequency) / (2 * A);
  const phase = 2 * Math.PI * tilt * frequency;
  assert.ok(Math.abs(result.sagittal.real[1] - modulus * Math.cos(phase)) < 2e-12);
  assert.ok(Math.abs(result.sagittal.imaginary[1] - modulus * Math.sin(phase)) < 2e-12);
  assert.equal(result.sagittal.real[1], result.sagittal.real[2]);
  assert.equal(result.sagittal.imaginary[1], -result.sagittal.imaginary[2]);
});

test("pure defocus on a square: sinc closed form with the midpoint quadrature bound", () => {
  const n = 128,
    beta = 1 / 64,
    h = (2 * A) / n,
    shear = 8 * h;
  // W=beta(x^2+y^2), OPD=-W/lambda. The pair phase is k(x+s/2),
  // k=4 pi beta s/lambda, over length L=2A-s; the normalized integral is L/(2A) sinc(kL/2).
  const input = pupil(
    n,
    () => true,
    (x, y) => (-beta * (x * x + y * y)) / LAMBDA,
  );
  const result = wavefrontOtf(input, [shear / LAMBDA]);
  assert.ok(result.available);
  const length = 2 * A - shear,
    k = (4 * Math.PI * beta * shear) / LAMBDA;
  const expected = ((length / (2 * A)) * Math.sin((k * length) / 2)) / ((k * length) / 2);
  // The second derivative of exp(ikx) is at most k^2; midpoint error <= L h^2 k^2/24.
  // Integer-cell shear needs no phase interpolation. Divide by the full width 2A.
  const bound = ((length / (2 * A)) * (h * k) ** 2) / 24 + 2e-12;
  assert.ok(Math.abs(result.sagittal.real[0] - expected) <= bound);
  assert.ok(Math.abs(result.tangential.real[0] - expected) <= bound);
  assert.ok(Math.abs(result.sagittal.imaginary[0]) < 2e-12);
});

test("obscured pupil: difference of circle intersections, both rims counted in the bound", () => {
  const n = 128,
    rho = 1 / 2,
    shares = [0, 0.1, 0.3, 0.6, 0.9, 1.1];
  const input = pupil(n, (x, y) => x * x + y * y < A * A && x * x + y * y > rho * rho * A * A);
  const result = wavefrontOtf(
    input,
    shares.map((s) => (s * 2 * A) / LAMBDA),
  );
  assert.ok(result.available);
  // Two boundary strips, outer and inner; normalize by the annulus area pi A^2(1-rho^2).
  const e = (4 * Math.SQRT2 * (1 + rho)) / (n * (1 - rho * rho)),
    bound = (3 * e) / (1 - e);
  for (const [i, s] of shares.entries()) {
    const d = 2 * s;
    const expected = (overlap(1, 1, d) - 2 * overlap(1, rho, d) + overlap(rho, rho, d)) / (Math.PI * (1 - rho * rho));
    assert.ok(Math.abs(result.sagittal.real[i] - expected) <= bound + 2e-12);
  }
});

test("intensity is the cell's flux and the image index scales the cosines: whole-number sums at integer lags", () => {
  // A square pupil, every cell lit, intensity (column + 1)^2 / 64 and n = 3/2: the cosine step is n h. At a shear
  // of L whole cells N(s) / N(0) is the sum over pairs of sqrt(f_i f_j) over the sum of f, here whole numbers:
  // along x, sum_c (c + 1)(c + 1 + L) / sum_c (c + 1)^2; along y, the columns pair with themselves, (n - L) / n.
  const n = 32,
    lag = 5,
    index = 3 / 2;
  const input = pupil(n, () => true);
  for (let cell = 0; cell < n * n; cell++) input.intensity[cell] = ((cell % n) + 1) ** 2 / 64;
  const shear = lag * index * ((2 * A) / n);
  const result = wavefrontOtf({ ...input, imageIndex: index }, [shear / LAMBDA]);
  assert.ok(result.available);
  let pairs = 0,
    total = 0;
  for (let c = 0; c < n; c++) {
    total += (c + 1) ** 2;
    if (c + lag < n) pairs += (c + 1) * (c + 1 + lag);
  }
  assert.ok(Math.abs(result.sagittal.real[0] - pairs / total) < 2e-12);
  assert.ok(Math.abs(result.tangential.real[0] - (n - lag) / n) < 2e-12);
});

test("the reference is the sphere's centre wherever the sphere lies: a translated sphere gives the same OTF", () => {
  const input = pupil(
    64,
    (x, y) => x * x + y * y < A * A,
    (x, y) => (-(x / 64) - (x * x + y * y) / 256) / LAMBDA,
  );
  const offset = [3 / 4, -1 / 2, 3];
  const moved = {
    ...input,
    pupilMm: input.pupilMm.map((value, at) => value + offset[at % 3]),
    centerMm: offset,
  };
  const frequencies = [10, 40, 120];
  const [here, there] = [wavefrontOtf(input, frequencies), wavefrontOtf(moved, frequencies)];
  assert.ok(here.available && there.available);
  for (const cut of ["sagittal", "tangential"] as const)
    for (let at = 0; at < frequencies.length; at++) {
      assert.ok(Math.abs(here[cut].real[at] - there[cut].real[at]) < 1e-10, cut);
      assert.ok(Math.abs(here[cut].imaginary[at] - there[cut].imaginary[at]) < 1e-10, cut);
    }
});

test("unavailable outcomes give reasons and no numerical arrays; bad inputs never leak NaN", () => {
  const input = pupil(8, () => true);
  for (const [changed, frequencies, reason] of [
    [{ centerMm: [NaN, 0, 0] }, [0], "no-reference"],
    [{ imageIndex: 0 }, [0], "bad-line"],
    [{}, [NaN], "bad-frequency"],
    [{ valid: new Uint8Array(64) }, [0], "no-rays"],
    [{ intensity: new Float64Array(64) }, [0], "no-flux"],
    [{ opdWaves: new Float64Array(64).fill(NaN) }, [1], "bad-ray"],
    [{ intensity: new Float64Array(64).fill(-1) }, [0], "bad-weight"],
  ] as const) {
    const result = wavefrontOtf({ ...input, ...changed }, frequencies);
    assert.equal(result.available, false);
    if (!result.available) {
      assert.equal(result.reason, reason);
      assert.ok(result.message.length > 0);
    }
  }
  assert.throws(() => wavefrontOtf({ ...input, opdWaves: [] }, [0]), RangeError);
});

test("the new estimator and the wave kernels stay outside all rays-baseline engine closures", () => {
  for (const entry of ["engines/lv/engine.ts", "engines/ref/engine.ts", "engines/lv/replayEngine.ts"]) {
    const files = importClosure(entry);
    assert.ok(!files.some((f) => /wavefrontOtf|waveOtf|waveValidity|rays\/wavefront/.test(f)), entry);
  }
  const wave = importClosure("engines/lv/waveEngine.ts");
  assert.ok(!wave.some((f) => /wavefrontOtf|engines\/optiland/.test(f)), "engines/lv/waveEngine.ts");
});
