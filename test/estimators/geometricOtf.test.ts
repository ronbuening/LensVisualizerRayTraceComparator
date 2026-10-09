// The binless geometric transfer function, held to closed forms: a cosine, a Dirichlet kernel, a sinc and the
// transfer function of a disc, each derived here, and to the definition carried out in whole numbers. No expected
// value is another estimator's or an engine's.
import assert from "node:assert/strict";
import { test } from "node:test";

import { geometricOtf, polychromaticOtf, spotSums } from "../../src/estimators/geometricOtf.ts";
import type { GeometricOtf, OtfCut, OtfUnavailable, Spots } from "../../src/estimators/geometricOtf.ts";
import { PI_OF_THE_SERIES, dyadicOf, exactTransfer, series, times } from "./support.ts";

const ORIGIN = { x: 0, y: 0 };

/** The stated accuracy of a value of the estimator: its distance from the sum taken exactly. */
const ACCURACY = 1e-15;

/** A transfer function that must be available. */
function available<T extends { available: true }>(outcome: T | OtfUnavailable): T {
  if (!outcome.available) assert.fail(`unavailable: ${outcome.reason}: ${outcome.message}`);
  return outcome;
}

/** A bundle of rays of weight 1, unless weights are given. */
function spotsOf(x: readonly number[], y: readonly number[], weight?: readonly number[]): Spots {
  return { x, y, weight: weight ?? x.map(() => 1) };
}

/** Every bit of a cut, for comparing two cuts bit for bit (-0 and 0 apart). */
function bitsOf(cut: OtfCut): string {
  return [cut.real, cut.imaginary, cut.modulus].map((values) => Buffer.from(values.buffer).toString("hex")).join(" ");
}

function assertSameBits(actual: GeometricOtf, expected: GeometricOtf, message?: string): void {
  assert.equal(bitsOf(actual.sagittal), bitsOf(expected.sagittal), message);
  assert.equal(bitsOf(actual.tangential), bitsOf(expected.tangential), message);
}

function assertNear(actual: number, expected: number, tolerance: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} against ${expected}, within ${tolerance}`);
}

test("two points are a cosine: exp(-i a) + exp(i a) over 2", () => {
  // Two rays 2^-6 mm apart along x, the reference midway between them. The sum is cos(2 pi nu 2^-7).
  const half = 2 ** -7;
  const frequencies = [0, 5, 16, 32, 37.5, 64, 96, 128, 1000];
  const otf = available(geometricOtf(spotsOf([-half, half], [0.25, 0.25]), { x: 0, y: 0.25 }, frequencies));
  assert.equal(otf.rays, 2);
  assert.equal(otf.flux, 2);
  frequencies.forEach((frequency, index) => {
    // The cycles are exact in doubles here, and their whole number is taken off before the cosine is asked for: at
    // 1000 cycles/mm the phase is 49 rad, and a rounding of that is 5e-15 of the cosine.
    const cycles = frequency * half;
    const expected = Math.cos(2 * Math.PI * (cycles - Math.round(cycles)));
    assertNear(otf.sagittal.real[index], expected, ACCURACY, `${frequency} cycles/mm`);
    // The two rays mirror each other in the reference: their sines cancel to the last bit.
    assert.equal(otf.sagittal.imaginary[index], 0);
    assertNear(otf.sagittal.modulus[index], Math.abs(expected), ACCURACY, `modulus at ${frequency}`);
    // Neither ray is displaced along y: the tangential cut sees a point.
    assert.deepEqual(
      [otf.tangential.real[index], otf.tangential.imaginary[index], otf.tangential.modulus[index]],
      [1, 0, 1],
    );
  });
  // A whole number of quarter cycles is exact: 32 cycles/mm puts each ray a quarter cycle from the reference, 64
  // half a cycle, 128 a whole one. The cosine of a right angle is 0, where Math.cos(Math.PI / 2) is 6e-17.
  assert.deepEqual(
    [3, 5, 7].map((index) => otf.sagittal.real[index]),
    [0, -1, 1],
  );
  assert.deepEqual(
    [3, 5, 7].map((index) => otf.sagittal.modulus[index]),
    [0, 1, 1],
  );
  assertNear(otf.sagittal.real[2], Math.SQRT1_2, ACCURACY, "an eighth of a cycle");
});

test("N equally spaced points are a Dirichlet kernel: sin(N a) / (N sin(a))", () => {
  // Seven rays 3 um apart along y. About their middle the sum is real: the geometric series of exp(-2 i a k), with
  // a = pi nu d, is exp(-i a (N - 1)) sin(N a) / sin(a), and the middle ray is (N - 1) / 2 steps from the first.
  const [count, step, first] = [7, 0.003, 0.2];
  const y = Array.from({ length: count }, (_, k) => first + k * step);
  const x = y.map(() => -1.5);
  const frequencies = [5, 20, 61, 80, 150];
  const kernel = (frequency: number): number => {
    const a = Math.PI * frequency * step;
    return Math.sin(count * a) / (count * Math.sin(a));
  };
  const middle = available(geometricOtf(spotsOf(x, y), { x: -1.5, y: y[3] }, frequencies));
  frequencies.forEach((frequency, index) => {
    assertNear(middle.tangential.real[index], kernel(frequency), 4 * ACCURACY, `${frequency} cycles/mm`);
    assertNear(middle.tangential.imaginary[index], 0, ACCURACY, `imaginary at ${frequency}`);
    assert.equal(middle.sagittal.real[index], 1);
  });
  // About the first ray the same kernel carries the phase of the middle ray's distance from it.
  const fromFirst = available(geometricOtf(spotsOf(x, y), { x: -1.5, y: y[0] }, frequencies));
  frequencies.forEach((frequency, index) => {
    const phase = -2 * Math.PI * frequency * (y[3] - y[0]);
    assertNear(
      fromFirst.tangential.real[index],
      kernel(frequency) * Math.cos(phase),
      4 * ACCURACY,
      `real, ${frequency}`,
    );
    assertNear(fromFirst.tangential.imaginary[index], kernel(frequency) * Math.sin(phase), 4 * ACCURACY, `imaginary`);
    assertNear(fromFirst.tangential.modulus[index], Math.abs(kernel(frequency)), 4 * ACCURACY, `modulus`);
  });
});

test("a uniform line sampled densely is a sinc, within the bound of the midpoint rule", () => {
  // N rays at the middles of N equal parts of a line L long, along y. Their sum is the Dirichlet kernel
  // sin(N a) / (N sin(a)) with a = pi nu L / N, and the line's transfer function is sin(N a) / (N a). They differ
  // by sin(N a) (a - sin(a)) / (N a sin(a)), and a - sin(a) is at most a^3 / 6: the bound is
  // |sin(N a)| a^2 / (6 N sin(a)), about pi nu L / (6 N^2).
  const [length, count] = [0.04, 2000];
  const y = Array.from({ length: count }, (_, k) => -length / 2 + ((k + 0.5) * length) / count);
  const frequencies = [10, 30, 50, 77];
  const otf = available(
    geometricOtf(
      spotsOf(
        y.map(() => 0),
        y,
      ),
      ORIGIN,
      frequencies,
    ),
  );
  frequencies.forEach((frequency, index) => {
    const a = (Math.PI * frequency * length) / count;
    const sinc = Math.sin(count * a) / (count * a);
    const bound = (Math.abs(Math.sin(count * a)) * a * a) / (6 * count * Math.sin(a));
    assert.ok(bound < 5e-7, `the bound says something: ${bound}`);
    assertNear(otf.tangential.real[index], sinc, bound + 4 * ACCURACY, `${frequency} cycles/mm`);
    assertNear(otf.tangential.imaginary[index], 0, ACCURACY, `imaginary at ${frequency}`);
    // The sum itself is the kernel, to rounding.
    assertNear(otf.tangential.real[index], Math.sin(count * a) / (count * Math.sin(a)), 4 * ACCURACY, "the kernel");
  });
});

test("a uniform disc sampled densely is 2 J1(z) / z, within the bound of its rings and spokes", () => {
  // A disc of radius R as M rings of equal area, each sampled at the radius that halves the ring's area by K rays
  // equally spaced in angle: every ray stands for the same area. With z = 2 pi nu R and s = (r / R)^2:
  //
  // - Around a ring of radius r the rays average exp(-i a cos(theta)), a = 2 pi nu r, which by the Jacobi-Anger
  //   expansion is J0(a) plus only the terms of order K, 2K, ...: at most 2 q / (1 - q) in all, with
  //   q = (z / 2)^K / K!, since |J_m(a)| <= (a / 2)^m / m!.
  // - Over the rings the mean of g(s) = J0(z sqrt(s)) at the midpoints of M equal parts of [0, 1] is the midpoint
  //   rule for the integral of g, which is 2 J1(z) / z; its error is at most max |g''| / (24 M^2), and
  //   g''(s) = (z^4 / 4) J2(t) / t^2 at t = z sqrt(s), with |J2(t)| <= t^2 / 8: at most z^4 / (768 M^2).
  const [radius, rings, spokes] = [0.012, 300, 48];
  const x: number[] = [];
  const y: number[] = [];
  for (let ring = 0; ring < rings; ring++) {
    const r = radius * Math.sqrt((ring + 0.5) / rings);
    for (let spoke = 0; spoke < spokes; spoke++) {
      // Every ring is turned a little against the one before, so that no axis is an axis of the pattern.
      const theta = (2 * Math.PI * (spoke + 0.37 * ring)) / spokes;
      x.push(r * Math.cos(theta));
      y.push(r * Math.sin(theta));
    }
  }
  /** J1 by its power series, the sum of (-1)^k (z / 2)^(2k + 1) / (k! (k + 1)!): to 1e-13 for z below 8. */
  const besselJ1 = (z: number): number => {
    let term = z / 2;
    let sum = term;
    for (let k = 1; k < 60; k++) {
      term *= -(z * z) / 4 / (k * (k + 1));
      sum += term;
    }
    return sum;
  };
  const frequencies = [10, 30, 50, 90];
  const otf = available(geometricOtf(spotsOf(x, y), ORIGIN, frequencies));
  assert.equal(otf.rays, rings * spokes);
  frequencies.forEach((frequency, index) => {
    const z = 2 * Math.PI * frequency * radius;
    const expected = (2 * besselJ1(z)) / z;
    let q = 1;
    for (let k = 1; k <= spokes; k++) q *= z / 2 / k;
    const bound = z ** 4 / (768 * rings ** 2) + (2 * q) / (1 - q) + 1e-12;
    assert.ok(bound < 4e-5 && q < 1e-30, `the bound says something: ${bound}`);
    for (const cut of [otf.sagittal, otf.tangential]) {
      const distance = Math.hypot(cut.real[index] - expected, cut.imaginary[index]);
      assert.ok(distance <= bound, `${frequency} cycles/mm: ${cut.real[index]} against ${expected}, within ${bound}`);
    }
  });
  // The first zero of the disc's transfer function is at z = 3.8317: 50 cycles/mm is just short of it, 90 beyond.
  assert.ok(otf.sagittal.real[0] > 0.9 && Math.abs(otf.sagittal.real[2]) < 0.02 && otf.sagittal.real[3] < -0.02);
});

test("a shift of the spot changes the phase and nothing else", () => {
  const next = series(31);
  const x = Array.from({ length: 60 }, () => (next() - 0.5) * 0.03);
  const y = Array.from({ length: 60 }, () => (next() - 0.5) * 0.05);
  const weight = x.map(() => 0.25 + next());
  const frequencies = [8, 30, 55.5];
  const here = available(geometricOtf({ x, y, weight }, ORIGIN, frequencies));
  // The whole spot moved by (s, t), the reference left where it was: every term turns by exp(-2 pi i nu s).
  const [s, t] = [0.004, -0.0075];
  const moved = available(
    geometricOtf({ x: x.map((u) => u + s), y: y.map((u) => u + t), weight }, ORIGIN, frequencies),
  );
  frequencies.forEach((frequency, index) => {
    for (const [cut, shifted, shift] of [
      [here.sagittal, moved.sagittal, s],
      [here.tangential, moved.tangential, t],
    ] as const) {
      const [cosine, sine] = [Math.cos(2 * Math.PI * frequency * shift), Math.sin(2 * Math.PI * frequency * shift)];
      const real = cut.real[index] * cosine + cut.imaginary[index] * sine;
      const imaginary = cut.imaginary[index] * cosine - cut.real[index] * sine;
      // The moved landings are sums that round, 1e-18 mm each: no part of the tolerance.
      assertNear(shifted.real[index], real, 4 * ACCURACY, `real at ${frequency}`);
      assertNear(shifted.imaginary[index], imaginary, 4 * ACCURACY, `imaginary at ${frequency}`);
      assertNear(shifted.modulus[index], cut.modulus[index], 4 * ACCURACY, `modulus at ${frequency}`);
      assert.ok(Math.abs(shifted.real[index] - cut.real[index]) > 1e-3, "the phase did change");
    }
  });
  // The spot and the reference moved together: nothing changes at all. Landings on a grid of 2^-20 mm move without
  // rounding, and then the transfer function is the same in every bit.
  const grid = (value: number): number => Math.round(value * 2 ** 20) / 2 ** 20;
  const [gx, gy] = [x.map(grid), y.map(grid)];
  const before = available(geometricOtf({ x: gx, y: gy, weight }, { x: grid(0.001), y: grid(-0.002) }, frequencies));
  const after = available(
    geometricOtf(
      { x: gx.map((u) => u + 3.5), y: gy.map((u) => u - 21.25), weight },
      { x: grid(0.001) + 3.5, y: grid(-0.002) - 21.25 },
      frequencies,
    ),
  );
  assertSameBits(after, before);
});

test("a ray counts by its weight, and a ray of weight 0 not at all", () => {
  // Two rays d apart along x with weights p and q, the reference at the first:
  // (p + q exp(-2 pi i nu d)) / (p + q), of modulus sqrt(p^2 + q^2 + 2 p q cos(2 pi nu d)) / (p + q).
  const [d, p, q] = [0.006, 3, 1];
  const frequencies = [12.5, 40, 1 / (2 * d)];
  const two = available(geometricOtf(spotsOf([0.1, 0.1 + d], [0, 0], [p, q]), { x: 0.1, y: 0 }, frequencies));
  assert.deepEqual([two.rays, two.flux], [2, 4]);
  frequencies.forEach((frequency, index) => {
    const angle = 2 * Math.PI * frequency * d;
    assertNear(two.sagittal.real[index], (p + q * Math.cos(angle)) / (p + q), 2 * ACCURACY, `real at ${frequency}`);
    assertNear(two.sagittal.imaginary[index], (-q * Math.sin(angle)) / (p + q), 2 * ACCURACY, `imaginary`);
    const modulus = Math.sqrt(p * p + q * q + 2 * p * q * Math.cos(angle)) / (p + q);
    assertNear(two.sagittal.modulus[index], modulus, 2 * ACCURACY, `modulus at ${frequency}`);
  });
  // Half a cycle apart the two rays oppose each other, and the heavier one is left: (3 - 1) / 4.
  assertNear(two.sagittal.modulus[2], 0.5, 2 * ACCURACY, "half a cycle apart");

  // A chief ray of weight 0 is no sample of the pupil: wherever it lands, it adds nothing, bit for bit.
  const withChief = available(
    geometricOtf(spotsOf([0.1, 0.1 + d, 7.5], [0, 0, -3], [p, q, 0]), { x: 0.1, y: 0 }, frequencies),
  );
  assertSameBits(withChief, two);
  assert.deepEqual([withChief.rays, withChief.flux], [2, 4]);
  // Only the ratios of the weights matter: a power of two changes no bit, another factor a rounding.
  const doubled = available(
    geometricOtf(spotsOf([0.1, 0.1 + d], [0, 0], [p * 8, q * 8]), { x: 0.1, y: 0 }, frequencies),
  );
  assertSameBits(doubled, two);
  const scaled = available(
    geometricOtf(spotsOf([0.1, 0.1 + d], [0, 0], [p * 0.3, q * 0.3]), { x: 0.1, y: 0 }, frequencies),
  );
  frequencies.forEach((_, index) => {
    assertNear(scaled.sagittal.real[index], two.sagittal.real[index], 2 * ACCURACY, "weights times 0.3");
    assertNear(scaled.sagittal.imaginary[index], two.sagittal.imaginary[index], 2 * ACCURACY, "weights times 0.3");
  });
});

test("at frequency 0 a transfer function is exactly 1", () => {
  const next = series(5);
  const x = Array.from({ length: 501 }, () => (next() - 0.5) * 40);
  const y = Array.from({ length: 501 }, () => (next() - 0.5) * 1e-3);
  // Weights that do not add up without rounding: from 1e-7 to 1.
  const weight = x.map(() => 10 ** (-7 * next()));
  const spots = { x, y, weight };
  for (const frequencies of [[0], [0, 10, 30], [-0, 50]]) {
    const otf = available(geometricOtf(spots, { x: 0.3, y: -1e-4 }, frequencies));
    for (const cut of [otf.sagittal, otf.tangential]) {
      assert.ok(Object.is(cut.real[0], 1) && Object.is(cut.imaginary[0], 0) && Object.is(cut.modulus[0], 1));
    }
    const lines = [0.3, 1, 0.11].map((line) => ({ weight: line, spots }));
    const spectrum = available(polychromaticOtf(lines, { x: 0.3, y: -1e-4 }, frequencies));
    for (const cut of [spectrum.sagittal, spectrum.tangential]) {
      assert.ok(Object.is(cut.real[0], 1) && Object.is(cut.imaginary[0], 0) && Object.is(cut.modulus[0], 1));
    }
  }
});

test("a spot that is symmetric about the reference has a real transfer function", () => {
  const next = series(77);
  const half = Array.from({ length: 80 }, () => ({ x: next() * 0.02, y: (next() - 0.5) * 0.02, w: 0.5 + next() }));
  const frequencies = [3, 17.25, 40, 96];
  // Each ray followed by its mirror image in the reference: every pair of sines cancels as it is added.
  const paired = half.flatMap((ray) => [ray, { x: -ray.x, y: -ray.y, w: ray.w }]);
  const otf = available(
    geometricOtf(
      spotsOf(
        paired.map((ray) => ray.x),
        paired.map((ray) => ray.y),
        paired.map((ray) => ray.w),
      ),
      ORIGIN,
      frequencies,
    ),
  );
  frequencies.forEach((_, index) => {
    assert.equal(otf.sagittal.imaginary[index], 0);
    assert.equal(otf.tangential.imaginary[index], 0);
    assert.equal(otf.sagittal.modulus[index], Math.abs(otf.sagittal.real[index]));
  });
  // The same rays in another order, every mirror image after every ray: the sines cancel across the whole sum, and
  // what is left is the rounding of the compensation itself, some 1e-32 of the flux a ray.
  const apart = [...half, ...half.map((ray) => ({ x: -ray.x, y: -ray.y, w: ray.w }))];
  const other = available(
    geometricOtf(
      spotsOf(
        apart.map((ray) => ray.x),
        apart.map((ray) => ray.y),
        apart.map((ray) => ray.w),
      ),
      ORIGIN,
      frequencies,
    ),
  );
  frequencies.forEach((frequency, index) => {
    assert.ok(Math.abs(other.sagittal.imaginary[index]) <= 2 ** -90, `${other.sagittal.imaginary[index]}`);
    assert.ok(Math.abs(other.tangential.imaginary[index]) <= 2 ** -90, `${other.tangential.imaginary[index]}`);
    assertNear(other.sagittal.real[index], otf.sagittal.real[index], ACCURACY, `real at ${frequency}`);
  });
});

test("the convention: minus in the phase, x for the sagittal cut, y for the tangential one, one reference", () => {
  // One ray, 1 um toward +x and 3 um toward -y of the reference: exp(-2 pi i nu u) for each cut.
  const frequency = 25;
  const one = available(geometricOtf(spotsOf([0.501], [-0.203]), { x: 0.5, y: -0.2 }, [frequency]));
  const [alongX, alongY] = [0.501 - 0.5, -0.203 - -0.2];
  assertNear(one.sagittal.real[0], Math.cos(2 * Math.PI * frequency * alongX), ACCURACY, "sagittal, real");
  assertNear(one.sagittal.imaginary[0], -Math.sin(2 * Math.PI * frequency * alongX), ACCURACY, "sagittal, imaginary");
  assertNear(one.tangential.real[0], Math.cos(2 * Math.PI * frequency * alongY), ACCURACY, "tangential, real");
  assertNear(
    one.tangential.imaginary[0],
    -Math.sin(2 * Math.PI * frequency * alongY),
    ACCURACY,
    "tangential, imaginary",
  );
  // Displaced toward +x: a negative imaginary part. Toward -y: a positive one.
  assert.ok(one.sagittal.imaginary[0] < -0.1 && one.tangential.imaginary[0] > 0.4);
  assert.deepEqual(
    [one.sagittal.modulus[0], one.tangential.modulus[0]].map((m) => Math.abs(m - 1) <= ACCURACY),
    [true, true],
  );

  // A negative frequency is the conjugate.
  const mirrored = available(geometricOtf(spotsOf([0.501], [-0.203]), { x: 0.5, y: -0.2 }, [-frequency]));
  assert.equal(mirrored.sagittal.real[0], one.sagittal.real[0]);
  assert.equal(mirrored.sagittal.imaginary[0], -one.sagittal.imaginary[0]);

  // The two cuts are the same sum on the two axes: with x and y exchanged they exchange, bit for bit.
  const next = series(11);
  const x = Array.from({ length: 40 }, () => (next() - 0.5) * 0.02);
  const y = Array.from({ length: 40 }, () => (next() - 0.2) * 0.07);
  const weight = x.map(() => next());
  const frequencies = [10, 30, 50];
  const straight = available(geometricOtf({ x, y, weight }, { x: 0.001, y: 0.004 }, frequencies));
  const exchanged = available(geometricOtf({ x: y, y: x, weight }, { x: 0.004, y: 0.001 }, frequencies));
  assert.equal(bitsOf(exchanged.sagittal), bitsOf(straight.tangential));
  assert.equal(bitsOf(exchanged.tangential), bitsOf(straight.sagittal));
  // A spot that is a line along x is a point to the tangential cut: 1 at every frequency.
  const line = available(geometricOtf({ x, y: x.map(() => 0.004), weight }, { x: 0.001, y: 0.004 }, frequencies));
  assert.deepEqual([...line.tangential.modulus], [1, 1, 1]);
  assert.ok([...line.sagittal.modulus].every((modulus) => modulus < 0.99));
});

test("a value is the sum of the definition to 1e-15, at any phase", () => {
  assert.equal(PI_OF_THE_SERIES, Math.PI);
  const next = series(2026);
  // Spots from a micrometre to a metre across, about a reference that is off the axis, at frequencies from a
  // fraction of a cycle to ten thousand cycles a millimetre: up to ten million cycles of phase.
  let worst = 0;
  let worstPlain = 0;
  for (const [extent, frequencies] of [
    [1e-3, [0.37, 10, 30, 50, 250.1]],
    [0.05, [10, 30, 123.456, 1e4]],
    [1000, [1e-3, 30, 1e4]],
  ] as const) {
    const u = Array.from({ length: 40 }, () => 17.3 + (next() - 0.5) * extent);
    const weight = u.map(() => 0.05 + next());
    const reference = 17.3 + 0.1 * extent;
    const otf = available(
      geometricOtf({ x: u, y: u.map((value) => -value), weight }, { x: reference, y: -reference }, frequencies),
    );
    frequencies.forEach((frequency, index) => {
      const exact = exactTransfer(
        u.map((value, ray) => ({ u: value, weight: dyadicOf(weight[ray]) })),
        reference,
        frequency,
      );
      const off = Math.hypot(otf.sagittal.real[index] - exact.real, otf.sagittal.imaginary[index] - exact.imaginary);
      worst = Math.max(worst, off);
      assert.ok(off <= ACCURACY, `${frequency} cycles/mm over ${extent} mm: off by ${off}`);
      // The tangential cut is of the mirrored spot: the conjugate, and as good.
      assertNear(otf.tangential.real[index], exact.real, ACCURACY, "the mirrored spot, real");
      assertNear(otf.tangential.imaginary[index], -exact.imaginary, ACCURACY, "the mirrored spot, imaginary");
      // The same sum with the phase as one product in doubles: its rounding is a rounding of the whole phase.
      const flux = weight.reduce((sum, w) => sum + w, 0);
      const plain = u.reduce(
        (sum, value, ray) => sum + weight[ray] * Math.cos(-2 * Math.PI * frequency * (value - reference)),
        0,
      );
      worstPlain = Math.max(worstPlain, Math.abs(plain / flux - exact.real));
    });
  }
  assert.ok(worst > 0 && worstPlain > 1e4 * ACCURACY, `${worst} and ${worstPlain}`);
});

test("the lines of a spectrum add up as complex numbers about one reference: lateral colour lowers the modulus", () => {
  // Two lines, each a point: the second lands d = 2^-6 mm above the first, as lateral colour puts it. With the
  // weights a and b of the lines (weight times flux) the sum about the first is (a + b exp(-2 pi i nu d)) / (a + b),
  // of modulus sqrt(a^2 + b^2 + 2 a b cos(2 pi nu d)) / (a + b): |cos(pi nu d)| for equal lines.
  const d = 2 ** -6;
  const frequencies = [0, 8, 16, 21.3, 32, 64];
  const first = spotsOf([0.5, 0.5, 0.5, 0.5], [2, 2, 2, 2]);
  const second = spotsOf([0.5, 0.5, 0.5, 0.5], [2 + d, 2 + d, 2 + d, 2 + d]);
  const reference = { x: 0.5, y: 2 };
  const equal = available(
    polychromaticOtf(
      [
        { weight: 1, spots: first },
        { weight: 1, spots: second },
      ],
      reference,
      frequencies,
    ),
  );
  assert.deepEqual([equal.rays, equal.flux, equal.lines], [8, 8, [4, 4].map((flux) => ({ rays: 4, flux }))]);
  frequencies.forEach((frequency, index) => {
    const angle = 2 * Math.PI * frequency * d;
    assertNear(equal.tangential.modulus[index], Math.abs(Math.cos(angle / 2)), 2 * ACCURACY, `${frequency} cycles/mm`);
    assertNear(equal.tangential.real[index], (1 + Math.cos(angle)) / 2, 2 * ACCURACY, `real at ${frequency}`);
    assertNear(equal.tangential.imaginary[index], -Math.sin(angle) / 2, 2 * ACCURACY, `imaginary at ${frequency}`);
    // The colour is along y: the sagittal cut sees one point.
    assert.equal(equal.sagittal.modulus[index], 1);
  });
  // 32 cycles/mm puts the lines half a cycle apart: they cancel. Each line alone, about its own point, is 1 there.
  assert.equal(equal.tangential.modulus[4], 0);
  for (const [spots, own] of [
    [first, reference],
    [second, { x: 0.5, y: 2 + d }],
  ] as const) {
    assert.deepEqual(
      [...available(geometricOtf(spots, own, frequencies)).tangential.modulus],
      frequencies.map(() => 1),
    );
  }

  // A line of twice the weight whose rays carry four times the flux counts eight times: (8 + exp(-2 pi i nu d)) / 9.
  const faint = spotsOf([0.5, 0.5, 0.5, 0.5], [2 + d, 2 + d, 2 + d, 2 + d], [0.25, 0.25, 0.25, 0.25]);
  const unequal = available(
    polychromaticOtf(
      [
        { weight: 2, spots: first },
        { weight: 1, spots: faint },
      ],
      reference,
      frequencies,
    ),
  );
  assert.deepEqual([unequal.flux, unequal.lines.map((line) => line.flux)], [9, [4, 1]]);
  frequencies.forEach((frequency, index) => {
    const angle = 2 * Math.PI * frequency * d;
    const modulus = Math.sqrt(64 + 1 + 16 * Math.cos(angle)) / 9;
    assertNear(unequal.tangential.modulus[index], modulus, 2 * ACCURACY, `${frequency} cycles/mm`);
  });
  // A quarter cycle apart, at 16 cycles/mm, the faint line is at -i: (8 - i) / 9, in every bit.
  assert.deepEqual([unequal.tangential.real[2], unequal.tangential.imaginary[2]], [8 / 9, -1 / 9]);
  // Half a cycle apart the lines no longer cancel: (8 - 1) / 9.
  assert.equal(unequal.tangential.modulus[4], 7 / 9);

  // The reference is one point for every line. Another point turns the phase of the whole sum and leaves the
  // modulus; a reference of each line's own would have removed the colour.
  const elsewhere = available(
    polychromaticOtf(
      [
        { weight: 2, spots: first },
        { weight: 1, spots: faint },
      ],
      { x: 0.25, y: 2.003 },
      frequencies,
    ),
  );
  frequencies.forEach((frequency, index) => {
    assertNear(elsewhere.tangential.modulus[index], unequal.tangential.modulus[index], 2 * ACCURACY, `${frequency}`);
    // A reference 3 um further up puts every ray that much further down: exp(2 pi i nu 0.003) on the whole sum.
    const turn = 2 * Math.PI * frequency * (2.003 - 2);
    const [real, imaginary] = [unequal.tangential.real[index], unequal.tangential.imaginary[index]];
    const turned = real * Math.cos(turn) - imaginary * Math.sin(turn);
    assertNear(elsewhere.tangential.real[index], turned, 4 * ACCURACY, `the phase at ${frequency}`);
  });
  assert.ok(Math.abs(elsewhere.tangential.real[3] - unequal.tangential.real[3]) > 0.02);
});

test("a spectrum is the sum over its lines of weight times a line's own sum, over weight times flux", () => {
  const next = series(404);
  const frequencies = [10, 30, 50];
  const reference = { x: 0.002, y: 11.5 };
  // Three lines of some thirty rays each, landing a few micrometres apart, with weights and fluxes of their own.
  const lines = [0.31, 1, 0.07].map((weight, line) => {
    const count = 30 + line;
    return {
      weight,
      spots: {
        x: Array.from({ length: count }, () => (next() - 0.5) * 0.02),
        y: Array.from({ length: count }, () => 11.5 + 0.004 * line + (next() - 0.5) * 0.03),
        weight: Array.from({ length: count }, () => (0.2 + next()) / (line + 1)),
      },
    };
  });
  const spectrum = available(polychromaticOtf(lines, reference, frequencies));
  // In whole numbers: one bundle of every ray of every line, each with the weight of its line times its own.
  const all = (axis: "x" | "y") =>
    lines.flatMap(({ weight, spots }) =>
      Array.from(spots[axis], (u, ray) => ({ u, weight: times(dyadicOf(weight), dyadicOf(spots.weight[ray])) })),
    );
  frequencies.forEach((frequency, index) => {
    for (const [cut, axis] of [
      [spectrum.sagittal, "x"],
      [spectrum.tangential, "y"],
    ] as const) {
      const exact = exactTransfer(all(axis), reference[axis], frequency);
      const off = Math.hypot(cut.real[index] - exact.real, cut.imaginary[index] - exact.imaginary);
      assert.ok(off <= 2 * ACCURACY, `${axis} at ${frequency} cycles/mm: off by ${off}`);
      assertNear(cut.modulus[index], Math.hypot(exact.real, exact.imaginary), 2 * ACCURACY, "modulus");
    }
  });
  // It is made of the lines' own sums: weight times sum over weight times flux, for each cut.
  const own = lines.map(({ spots }) => available(spotSums(spots, reference, frequencies)));
  const flux = lines.reduce((sum, { weight }, line) => sum + weight * own[line].flux, 0);
  assertNear(spectrum.flux, flux, 4 * ACCURACY, "the flux");
  assert.deepEqual(
    spectrum.lines,
    own.map(({ rays, flux: lineFlux }) => ({ rays, flux: lineFlux })),
  );
  const real = lines.reduce((sum, { weight }, line) => sum + weight * own[line].tangential.real[1], 0) / flux;
  assertNear(spectrum.tangential.real[1], real, 4 * ACCURACY, "the tangential cut at 30 cycles/mm");

  // One line of weight 1 is the transfer function of its bundle in every bit; of another weight, to a rounding.
  const alone = available(geometricOtf(lines[1].spots, reference, frequencies));
  assertSameBits(available(polychromaticOtf([lines[1]], reference, frequencies)), alone);
  const weighted = available(polychromaticOtf([{ weight: 0.7, spots: lines[1].spots }], reference, frequencies));
  frequencies.forEach((_, index) => {
    assertNear(weighted.sagittal.real[index], alone.sagittal.real[index], 2 * ACCURACY, "one line of weight 0.7");
  });
});

test("equal input gives equal bits, and a frequency's value does not depend on the others asked", () => {
  const next = series(9);
  const x = Array.from({ length: 300 }, () => (next() - 0.5) * 0.04);
  const y = Array.from({ length: 300 }, () => (next() - 0.5) * 0.04);
  const weight = x.map(() => next());
  const reference = { x: 1e-4, y: -3e-4 };
  const frequencies = [0, 10, 20, 30, 40, 50];
  const once = available(geometricOtf({ x, y, weight }, reference, frequencies));
  assertSameBits(available(geometricOtf({ x, y, weight }, reference, frequencies)), once);
  // Arrays of doubles of any kind are the same numbers.
  const typed = { x: Float64Array.from(x), y: Float64Array.from(y), weight: Float64Array.from(weight) };
  assertSameBits(available(geometricOtf(typed, reference, Float64Array.from(frequencies))), once);
  // 30 cycles/mm asked alone, and in another list.
  for (const others of [[30], [30, 10], [7, 13, 30, 99.5]]) {
    const again = available(geometricOtf({ x, y, weight }, reference, others));
    const at = others.indexOf(30);
    assert.ok(Object.is(again.sagittal.real[at], once.sagittal.real[3]));
    assert.ok(Object.is(again.sagittal.imaginary[at], once.sagittal.imaginary[3]));
    assert.ok(Object.is(again.tangential.modulus[at], once.tangential.modulus[3]));
  }
  const lines = [
    { weight: 0.4, spots: { x, y, weight } },
    { weight: 1, spots: { x: y, y: x, weight } },
  ];
  assertSameBits(
    available(polychromaticOtf(lines, reference, frequencies)),
    available(polychromaticOtf(lines, reference, frequencies)),
  );
  // No frequency is asked: an answer with no value in it.
  const none = available(geometricOtf({ x, y, weight }, reference, []));
  assert.deepEqual([none.rays, none.sagittal.real.length, none.tangential.modulus.length], [300, 0, 0]);
});

test("the rays that are not taken are not looked at", () => {
  // Five rays, of which the trace lost two: their landings are NaN, as a trace states them.
  const x = [0.001, NaN, -0.002, 0.004, NaN];
  const y = [0.003, NaN, 0.001, -0.002, NaN];
  const weight = [1, 1, 0.5, 0.25, NaN];
  const valid = Uint8Array.of(1, 0, 1, 1, 0);
  const frequencies = [20, 45];
  const masked = available(geometricOtf({ x, y, weight, valid }, ORIGIN, frequencies));
  const kept = available(
    geometricOtf(spotsOf([0.001, -0.002, 0.004], [0.003, 0.001, -0.002], [1, 0.5, 0.25]), ORIGIN, frequencies),
  );
  assertSameBits(masked, kept);
  assert.deepEqual([masked.rays, masked.flux], [3, 1.75]);
  // A mask can leave out a ray that did land: then it is the bundle without that ray.
  const fewer = available(geometricOtf({ x, y, weight, valid: [1, 0, 0, 1, 0] }, ORIGIN, frequencies));
  assertSameBits(
    fewer,
    available(geometricOtf(spotsOf([0.001, 0.004], [0.003, -0.002], [1, 0.25]), ORIGIN, frequencies)),
  );
});

test("a phase too long to reduce is an outcome, never a number that is no transfer function", () => {
  // The modulus of one ray's transfer function is 1 whatever its phase. Up to 2^32 cycles the phase is reduced
  // exactly and the value is good to the stated accuracy; beyond that nothing is answered: a product of 2^53
  // cycles and more has no fraction of a cycle left in a double, and the terms of its rounding are no small angle.
  // A reference of a quarter keeps the offset the whole number of cycles and its fraction, exactly.
  for (const cycles of [2 ** 20 + 0.375, 2 ** 31 + 0.375, 2 ** 32 - 0.625, -(2 ** 32) + 0.125, 2 ** 32]) {
    const otf = available(geometricOtf(spotsOf([cycles + 0.25], [0]), { x: 0.25, y: 0 }, [1]));
    assertNear(otf.sagittal.modulus[0], 1, ACCURACY, `${cycles} cycles`);
    const exact = exactTransfer([{ u: cycles + 0.25, weight: dyadicOf(1) }], 0.25, 1);
    assertNear(otf.sagittal.real[0], exact.real, ACCURACY, `${cycles} cycles, real`);
    assertNear(otf.sagittal.imaginary[0], exact.imaginary, ACCURACY, `${cycles} cycles, imaginary`);
  }
  // The product is at least half of the scale: beyond 2^32 cycles in every trial.
  const next = series(7);
  for (const scale of [2 ** 34, 1e12, 1e15, 3e16, 1e17, 1e20, 1e25, 1e60, 1e150, 1e300]) {
    for (let trial = 0; trial < 50; trial++) {
      const frequency = (0.5 + next()) * Math.sqrt(scale);
      const u = (trial % 2 === 0 ? 1 : -1) * (1 + next()) * Math.sqrt(scale);
      for (const spots of [spotsOf([0, u], [0, 0]), spotsOf([0, 0], [0, u])]) {
        const outcome = geometricOtf(spots, ORIGIN, [0, frequency]);
        assert.ok(!outcome.available, `${frequency} cycles/mm at ${u} mm was answered`);
        assert.deepEqual([outcome.reason, outcome.ray], ["out-of-range", 1]);
        assert.match(outcome.message, /^ray 1 at frequency 1 /);
      }
    }
  }
  // In a spectrum the line is named too.
  const line = { weight: 1, spots: spotsOf([0.001], [0]) };
  const far = polychromaticOtf([line, { weight: 1, spots: spotsOf([0, 0, 1e9], [0, 0, 0]) }], ORIGIN, [1e9]);
  assert.ok(!far.available);
  assert.deepEqual([far.reason, far.ray, far.line], ["out-of-range", 2, 1]);
});

test("what cannot be computed is an outcome with a reason, never a NaN", () => {
  const spots = spotsOf([0.001, -0.002, 0.004], [0.003, 0.001, -0.002], [1, 0.5, 0.25]);
  const reasonOf = (outcome: { available: boolean; reason?: string; ray?: number; line?: number }) => {
    assert.equal(outcome.available, false);
    assert.deepEqual(
      Object.keys(outcome).filter((key) => !["available", "reason", "message", "ray", "line"].includes(key)),
      [],
    );
    return [outcome.reason, outcome.ray, outcome.line];
  };
  // The request: a frequency or a reference that is no finite number. A chief ray that did not land has none.
  for (const frequency of [NaN, Infinity, -Infinity]) {
    assert.deepEqual(reasonOf(geometricOtf(spots, ORIGIN, [10, frequency])), ["bad-frequency", undefined, undefined]);
  }
  for (const reference of [
    { x: NaN, y: 0 },
    { x: 0, y: NaN },
    { x: Infinity, y: 0 },
  ]) {
    assert.deepEqual(reasonOf(geometricOtf(spots, reference, [10])), ["no-reference", undefined, undefined]);
  }
  // A ray that is taken and has no landing, or no weight: the first one, by its index. A ray of weight 0 is taken
  // too, and must have landed.
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, x: [0.001, NaN, NaN] }, ORIGIN, [10])), [
    "bad-landing",
    1,
    undefined,
  ]);
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, y: [0.003, 0.001, Infinity] }, ORIGIN, [10])), [
    "bad-landing",
    2,
    undefined,
  ]);
  assert.deepEqual(reasonOf(geometricOtf({ x: [0.001, NaN], y: [0, 0], weight: [1, 0] }, ORIGIN, [10])), [
    "bad-landing",
    1,
    undefined,
  ]);
  for (const bad of [NaN, -1e-9, Infinity]) {
    assert.deepEqual(reasonOf(geometricOtf({ ...spots, weight: [bad, 1, 1] }, ORIGIN, [10])), [
      "bad-weight",
      0,
      undefined,
    ]);
  }
  // No ray, or none that is taken; rays that carry nothing.
  assert.deepEqual(reasonOf(geometricOtf(spotsOf([], []), ORIGIN, [10])), ["no-rays", undefined, undefined]);
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, valid: [0, 0, 0] }, ORIGIN, [10])), [
    "no-rays",
    undefined,
    undefined,
  ]);
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, weight: [0, 0, 0] }, ORIGIN, [10])), [
    "no-flux",
    undefined,
    undefined,
  ]);
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, weight: [0, 1, 1], valid: [1, 0, 0] }, ORIGIN, [10])), [
    "no-flux",
    undefined,
    undefined,
  ]);
  // Numbers no double can multiply: the sum would be no number, and is an outcome.
  assert.deepEqual(reasonOf(geometricOtf(spotsOf([1e200], [0]), ORIGIN, [1e200])), ["out-of-range", 0, undefined]);
  // The request is looked at first, then the rays in their order, then how many there are.
  assert.equal(geometricOtf({ ...spots, x: [NaN, 0, 0] }, { x: NaN, y: 0 }, [NaN]).available, false);
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, x: [NaN, 0, 0] }, { x: NaN, y: 0 }, [NaN])), [
    "bad-frequency",
    undefined,
    undefined,
  ]);
  assert.deepEqual(reasonOf(geometricOtf({ ...spots, x: [NaN, 0, 0] }, { x: NaN, y: 0 }, [1])), [
    "no-reference",
    undefined,
    undefined,
  ]);
  assert.deepEqual(reasonOf(spotSums({ ...spots, weight: [1, -1, NaN] }, ORIGIN, [1])), ["bad-weight", 1, undefined]);
  // A message says which ray, and what was found.
  const outcome = geometricOtf({ ...spots, weight: [1, -1, 1] }, ORIGIN, [1]);
  assert.ok(!outcome.available && outcome.message === "ray 1 has the weight -1, not a number of at least 0");

  // A spectrum: every line must have an answer, and the outcome names the first line that has none.
  const line = { weight: 1, spots };
  assert.deepEqual(reasonOf(polychromaticOtf([], ORIGIN, [10])), ["no-lines", undefined, undefined]);
  for (const weight of [0, -1, NaN, Infinity]) {
    assert.deepEqual(reasonOf(polychromaticOtf([line, { weight, spots }], ORIGIN, [10])), [
      "bad-line-weight",
      undefined,
      1,
    ]);
  }
  const dark = { weight: 1, spots: { ...spots, valid: [0, 0, 0] } };
  assert.deepEqual(reasonOf(polychromaticOtf([line, line, dark], ORIGIN, [10])), ["no-rays", undefined, 2]);
  const weightless = { weight: 1, spots: { ...spots, weight: [0, 0, 0] } };
  assert.deepEqual(reasonOf(polychromaticOtf([weightless, dark], ORIGIN, [10])), ["no-flux", undefined, 0]);
  const lost = { weight: 1, spots: { ...spots, x: [0, 0, NaN] } };
  const named = polychromaticOtf([line, lost], ORIGIN, [10]);
  assert.deepEqual(reasonOf(named), ["bad-landing", 2, 1]);
  assert.ok(!named.available && named.message === "line 1: ray 2 lands at (NaN, -0.002), not a finite point");
  // The request before any line.
  assert.deepEqual(reasonOf(polychromaticOtf([dark], { x: NaN, y: 0 }, [10])), ["no-reference", undefined, undefined]);
  assert.deepEqual(reasonOf(polychromaticOtf([dark], ORIGIN, [NaN])), ["bad-frequency", undefined, undefined]);

  // Arrays of unequal length are no bundle: that is the caller's mistake, and an error.
  assert.throws(() => geometricOtf({ x: [0, 1], y: [0], weight: [1, 1] }, ORIGIN, [10]), RangeError);
  assert.throws(() => geometricOtf({ x: [0, 1], y: [0, 1], weight: [1] }, ORIGIN, [10]), RangeError);
  assert.throws(() => geometricOtf({ ...spots, valid: [1, 1] }, ORIGIN, [10]), /differ in length/);
  assert.throws(() => polychromaticOtf([line, { weight: 1, spots: { ...spots, y: [] } }], ORIGIN, [10]), RangeError);

  // What is available holds numbers only.
  const fine = available(geometricOtf(spots, ORIGIN, [0, 10, 1e6]));
  for (const cut of [fine.sagittal, fine.tangential]) {
    assert.ok([...cut.real, ...cut.imaginary, ...cut.modulus].every(Number.isFinite));
  }
});
