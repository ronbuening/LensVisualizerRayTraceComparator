// The engine `ref-seidel` and its third-order sums, held to what is derived here another way: tan of an angle by a
// series in whole numbers; a single refracting surface by its closed forms, and its spherical aberration by the limit
// of a real ray's longitudinal aberration, with a term of power 4 too; an aplanatic surface (S1 = S2 = S3 = 0) and a
// surface whose centre of curvature is the stop (S2 = S3 = S5 = 0); a thin lens with the stop on it (S3 = H^2 K,
// S4 = H^2 K / n, S5 = 0); the Petzval sum of separated thin lenses; a plane-parallel plate in a diverging beam; a
// Cartesian ellipsoid free of spherical aberration; a fourth-order plate; a paraboloid made of a term of power 2; the
// stop-shift identities between the same lens stopped in two places; the colour of a thin achromat; and the sums of two
// products that cancel, against Welford's sums in exact fractions of the model's doubles, and a height on the image
// plane against the double nearest to it. No engine's output is used.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { SEIDEL_SUMS } from "../../../src/contract/quantities/seidelNative.ts";
import type { SeidelNativeData, SeidelNativeSpec, SeidelSum } from "../../../src/contract/quantities/seidelNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import { importClosure } from "../../../src/engines/adapterRevision.ts";
import { REF_ENGINE_MODULE, refDescriptor } from "../../../src/engines/ref/engine.ts";
import { buildRefSystem } from "../../../src/engines/ref/model.ts";
import type { RefSystem } from "../../../src/engines/ref/model.ts";
import {
  REF_SEIDEL_ENGINE_ID,
  REF_SEIDEL_ENGINE_MODULE,
  createRefSeidelEngine,
  refSeidelDescriptor,
} from "../../../src/engines/refSeidel/engine.ts";
import { CUBIC_SAG_TERM, answerSeidel, tanDegrees } from "../../../src/engines/refSeidel/seidel.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { seidelNativeQuantity } from "../../../src/quantities/seidelNative.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { caseOf, sphere, ulp } from "../ref/support.ts";
import type { SurfaceOf, SystemOf } from "../ref/support.ts";

const EPSILON = 2 ** -52;

/** The sums of a case, as the engine answers them, valid by the quantity's port of the contract. */
function sums(surfaces: readonly SurfaceOf[], more: SystemOf, spec: SeidelNativeSpec): SeidelNativeData {
  const answer = answerSeidel(buildRefSystem(caseOf(surfaces, more)), spec);
  assert.ok("data" in answer, JSON.stringify(answer));
  assert.deepEqual(seidelNativeQuantity.validateData(answer.data), []);
  return answer.data;
}

/** |got - want| within `units` of `scale`'s last place. */
function near(got: number | null, want: number, scale: number, units: number, what: string): void {
  assert.ok(got !== null, what);
  assert.ok(Math.abs(got - want) <= units * ulp(scale), `${what}: ${got} against ${want}`);
}

// ── tan in degrees ───────────────────────────────────────────────────────────────────────────────────────────────

/** Fixed point: a value times 2^256. */
const ONE = 1n << 256n;

/** pi in fixed point, by Machin's formula, pi = 16 atan(1/5) - 4 atan(1/239), each atan its series to 2^-300. */
function fixedPi(): bigint {
  const atanInverse = (x: bigint): bigint => {
    let sum = 0n;
    let power = (ONE << 40n) / x;
    for (let k = 0n; power !== 0n; k++) {
      sum += (k % 2n === 0n ? power : -power) / (2n * k + 1n);
      power /= x * x;
    }
    return sum >> 40n;
  };
  return 16n * atanInverse(5n) - 4n * atanInverse(239n);
}

/** tan of `degrees` (a double), in fixed point: the angle's exact value times pi / 180, sine and cosine by series. */
function fixedTan(degrees: number): bigint {
  const pi = fixedPi();
  // The double as a fraction p / 2^s: x = p pi / (180 2^s).
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, degrees);
  const bits = view.getBigUint64(0);
  const exponent = Number((bits >> 52n) & 0x7ffn) - 1075;
  const mantissa = (bits & 0xf_ffff_ffff_ffffn) | (1n << 52n);
  const angle =
    exponent >= 0 ? ((mantissa * pi) / 180n) << BigInt(exponent) : (mantissa * pi) / (180n << BigInt(-exponent));
  let [sine, cosine] = [0n, 0n];
  let term = ONE;
  for (let k = 0n; term !== 0n; k++) {
    if (k % 2n === 0n) cosine += (k / 2n) % 2n === 0n ? term : -term;
    else sine += ((k - 1n) / 2n) % 2n === 0n ? term : -term;
    term = (term * angle) / ONE / (k + 1n);
  }
  return (sine * ONE) / cosine;
}

test("tan of an angle in degrees is the series in whole numbers to a few units in the last place", () => {
  for (const degrees of [0.5, 1, 5, 10.25, 22.5, 30, 44.990234375, 45, 45.009765625, 60, 75, 84.5, 89.5]) {
    const exact = Number(fixedTan(degrees)) / Number(ONE);
    near(tanDegrees(degrees), exact, exact, 4, `tan ${degrees}`);
    assert.equal(tanDegrees(-degrees), -tanDegrees(degrees));
  }
  assert.equal(tanDegrees(0), 0);
  assert.throws(() => tanDegrees(90), RangeError);
});

// ── One refracting surface ───────────────────────────────────────────────────────────────────────────────────────

/** A sphere of radius 50 mm from air into glass of index 1.5, its own stop of radius 5, the object at infinity. */
const SURFACE: SurfaceOf[] = [{ z: 0, shape: sphere(50), index: 1.5, semiDiameter: 6 }];
const AT_SURFACE: SystemOf = { stopSemiDiameter: 5, imageZ: 150 };

test("a single surface that is its own stop has the closed-form sums of its eccentricity", () => {
  const [y, c, n] = [5, 1 / 50, 1.5];
  const ubar = tanDegrees(5);
  const data = sums(SURFACE, AT_SURFACE, { line: 0, maxFieldDeg: 5 });
  // The marginal ray parallel at the stop's rim, the chief ray through its centre: A = y c, Abar = ubar, H = ubar y,
  // u' = -y (n - 1) c / n. Then S1 = y^4 c^3 (n - 1) / n^2, and the stop on the surface makes each next sum the one
  // before times Abar / A = ubar / (y c); S4 = H^2 c (n - 1) / n; S5 = (Abar / A)(S3 + S4).
  const s1 = (y ** 4 * c ** 3 * (n - 1)) / n ** 2;
  const e = ubar / (y * c);
  const s4 = ((ubar * y) ** 2 * c * (n - 1)) / n;
  const expected: Partial<Record<SeidelSum, number>> = {
    SPHA: s1,
    COMA: e * s1,
    ASTI: e * e * s1,
    FCUR: s4,
    DIST: e * (e * e * s1 + s4),
  };
  for (const [name, value] of Object.entries(expected)) near(data.total[name as SeidelSum], value, value, 16, name);
  near(data.invariant, ubar * y, ubar * y, 2, "invariant");
  assert.equal(data.total.CLA, null);
  assert.equal(data.dispersionLines, null);
  // OpticStudio's sign: a positive surface converging a collimated beam is undercorrected, S1 > 0.
  assert.ok((data.total.SPHA as number) > 0);
});

test("S1 is the third-order part of a real ray's longitudinal aberration, by the limit of small heights", () => {
  const [y, R, n] = [5, 50, 1.5];
  const data = sums(SURFACE, AT_SURFACE, { line: 0, maxFieldDeg: 5 });
  // The paraxial focus and slope: f' = n R / (n - 1) behind the vertex, u' = -y / f'.
  const focus = (n * R) / (n - 1);
  const slope = -y / focus;
  // A real ray parallel at height h meets the sphere at angle I (sin I = h / R), leaves at I' (sin I' = sin I / n), and
  // crosses the axis R sin I' / sin(I - I') behind the centre of curvature.
  const crossing = (h: number): number => {
    const incidence = Math.asin(h / R);
    const refracted = Math.asin(Math.sin(incidence) / n);
    return R + (R * Math.sin(refracted)) / Math.sin(incidence - refracted);
  };
  // LA(h) = -S1 (h / y)^2 / (2 n' u'^2) + O(h^4): the estimate at h, and Richardson's of h and h / 2.
  const estimate = (h: number): number => (-2 * n * slope * slope * (crossing(h) - focus)) / (h / y) ** 2;
  const h = y / 8;
  const extrapolated = (4 * estimate(h / 2) - estimate(h)) / 3;
  const s1 = data.total.SPHA as number;
  // The estimate at h is off by the fifth-order term, (h / y)^2 = 1/64 of a ratio of order 2e-3 here: above 1e-5 of
  // S1. Richardson's removes it, leaving the seventh-order term, (h / y)^4 = 1/4096 of a ratio of like order, and the
  // crossings' rounding (1e-13 mm over an aberration of 5e-3 mm): below 1e-9 of S1.
  assert.ok(Math.abs(estimate(h) - s1) > 1e-5 * s1, "the unextrapolated estimate is off by a fifth-order term");
  assert.ok(Math.abs(extrapolated - s1) <= 1e-9 * s1, `${extrapolated} against ${s1}`);
});

test("a term of power 4 adds 8 a4 (n' - n) y^4 to S1, by the limit of a real ray's longitudinal aberration", () => {
  // The sphere of the test before with a term a4 r^4 that bends its rim back: its S1 of 1.1e-3 mm and the term's
  // -2.4e-3 mm make a surface overcorrected. The paraxial focus is the sphere's: the term has no power.
  const [y, R, n, a4] = [5, 50, 1.5, -(2 ** -20)];
  const data = sums(
    [{ z: 0, shape: { kind: "asphere", radius: R, conic: 0, terms: [{ power: 4, coeff: a4 }] }, index: n }],
    AT_SURFACE,
    { line: 0, maxFieldDeg: 5 },
  );
  const focus = (n * R) / (n - 1);
  const slope = -y / focus;
  // A real ray parallel at height h meets the surface at h, where its sag is h^2 / (R + sqrt(R^2 - h^2)) + a4 h^4 and
  // the sag's slope s = h / sqrt(R^2 - h^2) + 4 a4 h^3. Snell's law in vector form about the unit normal (-s, 1) / |.|,
  // on the side the ray goes: t = mu d + (cos T - mu cos I) N, mu = 1 / n. It crosses the axis at sag - h t_z / t_r.
  const crossing = (h: number): number => {
    const root = Math.sqrt(R * R - h * h);
    const sag = (h * h) / (R + root) + a4 * h ** 4;
    const s = h / root + 4 * a4 * h ** 3;
    const norm = Math.sqrt(1 + s * s);
    const [normalR, normalZ] = [-s / norm, 1 / norm];
    const mu = 1 / n;
    const cosI = normalZ;
    const cosT = Math.sqrt(1 - mu * mu * (1 - cosI * cosI));
    const k = cosT - mu * cosI;
    const [tr, tz] = [k * normalR, mu + k * normalZ];
    return sag - (h * tz) / tr;
  };
  const estimate = (h: number): number => (-2 * n * slope * slope * (crossing(h) - focus)) / (h / y) ** 2;
  // Richardson's of h and h / 2 removes the fifth-order term, (h / y)^2 times a ratio; that of two such of h and h / 2,
  // the seventh-order one, (h / y)^4 times another.
  const once = (h: number): number => (4 * estimate(h / 2) - estimate(h)) / 3;
  const h = y / 4;
  const twice = (16 * once(h / 2) - once(h)) / 15;
  const s1 = data.total.SPHA as number;
  // The term's part is the larger and of the other sign: a sum that dropped it, or took it with another factor, would
  // be off by a whole part of order 1e-3 mm.
  const sphere = (y ** 4 * (n - 1)) / (R ** 3 * n * n);
  assert.ok(s1 < 0 && Math.abs(s1 - sphere) > 2e-3, `${s1}`);
  // At h = y / 4 the fifth-order term is above 1e-4 of S1 and the seventh-order one, which the term of power 4 makes
  // larger than the sphere's, above 1e-8 of it. Removing both leaves the ninth-order term, falling 64-fold with each
  // halving of h, and the crossings' rounding, 1e-13 mm over an aberration of 1.5e-3 mm at y / 16: below 1e-9 of S1.
  assert.ok(
    Math.abs(estimate(h) - s1) > 1e-4 * Math.abs(s1),
    "the unextrapolated estimate is off by a fifth-order term",
  );
  assert.ok(Math.abs(once(h) - s1) > 1e-8 * Math.abs(s1), "one extrapolation is off by a seventh-order term");
  assert.ok(Math.abs(twice - s1) <= 1e-9 * Math.abs(s1), `${twice} against ${s1}`);
});

test("an aplanatic surface has S1 = S2 = S3 = 0, and a surface centred on the stop S2 = S3 = S5 = 0", () => {
  // A plane into glass of index 2 at z = 0, then a sphere of radius -32 at z = 16 into air. The object at z = -16 is
  // imaged by the plane to z = -32, which is the sphere's aplanatic point: 16 from its centre (z = -16), |R| n' / n.
  const aplanatic = sums(
    [
      { z: 0, shape: sphere(Infinity), index: 2 },
      { z: 16, shape: sphere(-32), index: 1, semiDiameter: 20 },
    ],
    { objectZ: -16, stopSemiDiameter: 4, imageZ: 120 },
    { line: 0, maxFieldDeg: 5 },
  );
  const [, sphereSums] = aplanatic.surfaces;
  for (const name of ["SPHA", "COMA", "ASTI"] as const) {
    // Each is a product of Delta(u/n), exact to a rounding of its terms (of order 1e-5 here), so of order 1e-21.
    assert.ok(Math.abs(sphereSums[name] as number) <= 1e-18, `${name} ${sphereSums[name]}`);
  }
  assert.ok(Math.abs(sphereSums.FCUR as number) > 1e-6, "the field curvature is not that of an aplanatic point");

  // A sphere of radius 50 into glass of index 1.5, the stop a plane in the glass at its centre of curvature: the chief
  // ray meets the sphere along its normal, so Abar = 0.
  const centred = sums(
    [
      { z: 0, shape: sphere(50), index: 1.5, semiDiameter: 12 },
      { z: 50, shape: sphere(Infinity), index: 1.5, semiDiameter: 12 },
    ],
    { stopIndex: 1, stopSemiDiameter: 2, imageZ: 160 },
    { line: 0, maxFieldDeg: 10 },
  );
  const [lens, stop] = centred.surfaces;
  for (const name of ["COMA", "ASTI", "DIST"] as const) {
    assert.ok(Math.abs(lens[name] as number) <= 1e-18, `${name} ${lens[name]}`);
  }
  assert.ok((lens.SPHA as number) > 0 && (lens.FCUR as number) > 0);
  // The stop plane between two media of one index adds nothing.
  for (const name of SEIDEL_SUMS.slice(0, 5)) assert.equal(stop[name], 0, name);
});

test("a thin lens with the stop on it has S3 = H^2 K, S4 = H^2 K / n and S5 = 0", () => {
  const [r1, r2, n, r] = [50, -80, 1.5, 4];
  const data = sums(
    [
      { z: 0, shape: sphere(r1), index: n },
      { z: 0, shape: sphere(r2), index: 1 },
    ],
    { stopSemiDiameter: r, imageZ: 100 },
    { line: 0, maxFieldDeg: 10 },
  );
  const power = (n - 1) * (1 / r1 - 1 / r2);
  const H = tanDegrees(10) * r;
  near(data.total.ASTI, H * H * power, H * H * power, 32, "ASTI");
  near(data.total.FCUR, (H * H * power) / n, (H * H * power) / n, 32, "FCUR");
  assert.ok(Math.abs(data.total.DIST as number) <= 32 * ulp(Math.abs(data.surfaces[0].DIST as number)));
});

test("the Petzval sum of separated thin lenses is H^2 times the sum of K / n", () => {
  // Three thin lenses of other glasses and powers at 0, 20 and 45 mm, the stop on the first: H = tan(theta) r.
  const lenses = [
    { z: 0, r1: 40, r2: -60, n: 1.6 },
    { z: 20, r1: -30, r2: 45, n: 1.75 },
    { z: 45, r1: 70, r2: -70, n: 1.5 },
  ];
  const surfaces: SurfaceOf[] = lenses.flatMap(({ z, r1, r2, n }) => [
    { z, shape: sphere(r1), index: n, semiDiameter: 12 },
    { z, shape: sphere(r2), index: 1, semiDiameter: 12 },
  ]);
  const data = sums(surfaces, { stopSemiDiameter: 3, imageZ: 120 }, { line: 0, maxFieldDeg: 8 });
  const H = tanDegrees(8) * 3;
  const petzval = lenses.reduce((sum, { r1, r2, n }) => sum + ((n - 1) * (1 / r1 - 1 / r2)) / n, 0);
  near(data.invariant, H, H, 4, "invariant");
  near(data.total.FCUR, H * H * petzval, H * H * 0.05, 64, "FCUR");
});

test("a plane-parallel plate in a diverging beam has Welford's closed forms", () => {
  // The object 50 mm in front of a plate 8 mm thick of index 1.5, the stop on its first face of radius 2: u = 2 / 50.
  const [d, n, u] = [8, 1.5, 2 / 50];
  const ubar = tanDegrees(12);
  const data = sums(
    [
      { z: 0, shape: sphere(Infinity), index: n },
      { z: d, shape: sphere(Infinity), index: 1 },
    ],
    { objectZ: -50, stopSemiDiameter: 2, imageZ: 40 },
    { line: 0, maxFieldDeg: 12 },
  );
  const k = -(d / n ** 3) * (n * n - 1);
  const expected: Record<string, number> = {
    SPHA: k * u ** 4,
    COMA: k * u ** 3 * ubar,
    ASTI: k * u ** 2 * ubar ** 2,
    FCUR: 0,
    DIST: k * u * ubar ** 3,
  };
  for (const [name, value] of Object.entries(expected)) {
    near(data.total[name as SeidelSum], value, Math.abs(value) + Math.abs(k) * 1e-6, 64, name);
  }
});

test("aspheric terms: a Cartesian ellipsoid has no S1, a fourth-order plate 8 a4 (n' - n) y^4, a power-2 paraboloid", () => {
  // From air into index n a collimated beam is focused without spherical aberration by an ellipsoid of K = -1 / n^2.
  const ellipsoid = sums(
    [{ z: 0, shape: { kind: "conic", radius: 50, conic: -1 / 2.25 }, index: 1.5, semiDiameter: 12 }],
    { stopSemiDiameter: 10, imageZ: 150 },
    { line: 0, maxFieldDeg: 5 },
  );
  // The sphere's term and the conic's are each about 1.8e-2: their sum is exact to a few units of that.
  assert.ok(Math.abs(ellipsoid.total.SPHA as number) <= 16 * EPSILON * 1.8e-2, `${ellipsoid.total.SPHA}`);

  // A plane with a term a4 r^4, its own stop: S1 = 8 a4 (n' - n) y^4 from the term alone (A = 0), no coma, astigmatism
  // or field curvature, and the plane's own distortion, -ubar^3 y (1 / n'^2 - 1), the term adding none (ybar = 0).
  const a4 = 2 ** -20;
  const plate = sums(
    [{ z: 0, shape: { kind: "asphere", radius: null, conic: 0, terms: [{ power: 4, coeff: a4 }] }, index: 1.5 }],
    { stopSemiDiameter: 8, imageZ: 50 },
    { line: 0, maxFieldDeg: 15 },
  );
  assert.equal(plate.total.SPHA, 8 * a4 * 0.5 * 8 ** 4);
  for (const name of ["COMA", "ASTI", "FCUR"] as const) assert.equal(plate.total[name], 0, name);
  const ubar = tanDegrees(15);
  const planeDistortion = -(ubar ** 3) * 8 * (1 / 2.25 - 1);
  near(plate.total.DIST, planeDistortion, planeDistortion, 8, "DIST");

  // A flat-based surface of a term r^2 / 100 is the paraboloid of radius 50: K = -1.
  const terms = sums(
    [
      { z: 0, shape: { kind: "asphere", radius: null, conic: 0, terms: [{ power: 2, coeff: 1 / 100 }] }, index: 1.5 },
      { z: 6, shape: sphere(-120), index: 1 },
    ],
    { stopSemiDiameter: 6, imageZ: 90 },
    { line: 0, maxFieldDeg: 12 },
  );
  const conic = sums(
    [
      { z: 0, shape: { kind: "conic", radius: 50, conic: -1 }, index: 1.5 },
      { z: 6, shape: sphere(-120), index: 1 },
    ],
    { stopSemiDiameter: 6, imageZ: 90 },
    { line: 0, maxFieldDeg: 12 },
  );
  for (const name of SEIDEL_SUMS.slice(0, 5)) {
    const scale = Math.max(...conic.surfaces.map((surface) => Math.abs(surface[name] as number)));
    near(terms.total[name], conic.total[name] as number, scale, 16, name);
  }
});

/** A paraxial trace in exact fractions: the heights at each surface of a ray of height y and slope u at z = 0. */
function exactHeights(surfaces: readonly SurfaceOf[], y0: number, u0: number): number[] {
  // In whole-number fractions of 2^k: the test's numbers are chosen dyadic where it matters; a double is enough here,
  // since only E = (ybar* - ybar) / y is taken from it, and the identities are held to a relative 1e-12.
  const heights: number[] = [];
  let [y, w, n] = [y0, u0, 1];
  surfaces.forEach((surface, at) => {
    heights.push(y);
    const c = surface.shape.kind === "plane" ? 0 : 1 / (surface.shape.radius as number);
    const after = surface.index as number;
    w -= y * (after - n) * c;
    n = after;
    const next = surfaces[at + 1];
    if (next !== undefined) y += ((next.z - surface.z) * w) / n;
  });
  return heights;
}

test("the same lens stopped in two places obeys the stop-shift identities", () => {
  // A dummy plane at 0, a singlet at 10 to 16, a dummy plane at 30: stopped at the first plane (A) or the last (B),
  // the last's radius chosen so that the marginal ray is the same ray. Then, with E = (ybar_B - ybar_A) / y at any
  // surface: S1 B = S1, S2 B = S2 + E S1, S3 B = S3 + 2 E S2 + E^2 S1, S4 B = S4,
  // S5 B = S5 + E (3 S3 + S4) + 3 E^2 S2 + E^3 S1.
  const surfaces: SurfaceOf[] = [
    { z: 0, shape: sphere(Infinity), index: 1, semiDiameter: 20 },
    { z: 10, shape: sphere(40), index: 1.6, semiDiameter: 20 },
    { z: 16, shape: { kind: "asphere", radius: -80, conic: -2, terms: [{ power: 4, coeff: 3e-6 }] }, index: 1 },
    { z: 30, shape: sphere(Infinity), index: 1, semiDiameter: 20 },
  ];
  const r = 4;
  const marginal = exactHeights(surfaces, r, 0);
  const field = 9;
  const A = sums(surfaces, { stopIndex: 0, stopSemiDiameter: r, imageZ: 90 }, { line: 0, maxFieldDeg: field });
  const B = sums(
    surfaces,
    { stopIndex: 3, stopSemiDiameter: marginal[3], imageZ: 90 },
    { line: 0, maxFieldDeg: field },
  );
  // The chief ray of A crosses the axis at z = 0; that of B at z = 30, of the same slope in object space.
  const ubar = tanDegrees(field);
  const chiefA = exactHeights(surfaces, 0, ubar);
  // At the stop a ray of height y1 and slope ubar is at a y1 + b ubar: a of the ray (1, 0), b of the ray (0, 1).
  const [a, b] = [exactHeights(surfaces, 1, 0)[3], exactHeights(surfaces, 0, 1)[3]];
  const chiefB = exactHeights(surfaces, -(b / a) * ubar, ubar);
  const E = (chiefB[1] - chiefA[1]) / marginal[1];
  // The test's own trace is in doubles, and a difference of two chief rays loses some ten bits: 1e-12 of E.
  const again = (chiefB[2] - chiefA[2]) / marginal[2];
  assert.ok(Math.abs(again - E) <= 1e-12 * Math.abs(E), `E is the same at every surface: ${again} against ${E}`);
  const [s1, s2, s3, s4, s5] = ["SPHA", "COMA", "ASTI", "FCUR", "DIST"].map(
    (name) => A.total[name as SeidelSum] as number,
  );
  const shifted: Record<string, number> = {
    SPHA: s1,
    COMA: s2 + E * s1,
    ASTI: s3 + 2 * E * s2 + E * E * s1,
    FCUR: s4,
    DIST: s5 + E * (3 * s3 + s4) + 3 * E * E * s2 + E ** 3 * s1,
  };
  const scale = Math.max(...[s1, s2, s3, s4, s5].map(Math.abs)) * (1 + Math.abs(E)) ** 3;
  for (const [name, value] of Object.entries(shifted)) {
    const got = B.total[name as SeidelSum] as number;
    assert.ok(Math.abs(got - value) <= 1e-12 * scale, `${name}: ${got} against ${value}`);
  }
  near(B.invariant, A.invariant as number, A.invariant as number, 8, "the invariant does not move with the stop");
});

test("the colour of thin lenses in contact is y^2 times the sum of (c1 - c2) dn, and an achromat has none", () => {
  // Three surfaces at z = 0: crown (1.5 at the line, 1.508 less 1.496 apart) then flint (1.62, 1.636 less 1.612).
  const [crown, flint] = [
    { n: 1.5, dn: 1.508 - 1.496, short: 1.508, long: 1.496 },
    { n: 1.62, dn: 1.636 - 1.612, short: 1.636, long: 1.612 },
  ];
  const doublet = (c: readonly [number, number, number]): SeidelNativeData =>
    sums(
      [
        { z: 0, shape: sphere(1 / c[0]), index: [crown.n, crown.short, crown.long] },
        { z: 0, shape: sphere(1 / c[1]), index: [flint.n, flint.short, flint.long] },
        { z: 0, shape: sphere(1 / c[2]), index: [1, 1, 1] },
      ],
      { stopSemiDiameter: 5, imageZ: 100, lines: 3 },
      { line: 0, maxFieldDeg: 6, dispersionLines: [1, 2] },
    );
  const y = 5;
  const c: [number, number, number] = [1 / 40, -1 / 45, -1 / 250];
  const data = doublet(c);
  const colour = y * y * ((c[0] - c[1]) * crown.dn + (c[1] - c[2]) * flint.dn);
  near(data.total.CLA, colour, Math.abs(colour), 64, "CLA");
  // With the stop on the lenses the chief ray crosses them at the axis: no transverse colour.
  assert.ok(Math.abs(data.total.CTR as number) <= 1e-18, `${data.total.CTR}`);
  // An achromat: (c1 - c2) dn1 + (c2 - c3) dn2 = 0, c3 chosen so.
  const c3 = c[1] + ((c[0] - c[1]) * crown.dn) / flint.dn;
  const achromat = doublet([c[0], c[1], c3]);
  assert.ok(Math.abs(achromat.total.CLA as number) <= 64 * EPSILON * y * y * Math.abs(c[0] * crown.dn));
});

// ── Sums of two products that cancel ─────────────────────────────────────────────────────────────────────────────

/** A fraction of two whole numbers, the denominator above 0, in lowest terms. */
interface Fraction {
  readonly p: bigint;
  readonly q: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  let [x, y] = [a < 0n ? -a : a, b < 0n ? -b : b];
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

function fraction(p: bigint, q: bigint = 1n): Fraction {
  const sign = q < 0n ? -1n : 1n;
  const divisor = gcd(p, q) || 1n;
  return { p: (sign * p) / divisor, q: (sign * q) / divisor };
}

const add = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.q + b.p * a.q, a.q * b.q);
const sub = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.q - b.p * a.q, a.q * b.q);
const mul = (...factors: Fraction[]): Fraction =>
  factors.reduce((a, b) => fraction(a.p * b.p, a.q * b.q), fraction(1n));
const div = (a: Fraction, b: Fraction): Fraction => fraction(a.p * b.q, a.q * b.p);
const neg = (a: Fraction): Fraction => fraction(-a.p, a.q);
const isZero = (a: Fraction): boolean => a.p === 0n;

/** A finite double as the fraction it is. */
function fractionOf(value: number): Fraction {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const biased = Number((bits >> 52n) & 0x7ffn);
  const magnitude = (bits & 0xf_ffff_ffff_ffffn) | (biased === 0 ? 0n : 1n << 52n);
  const mantissa = bits >> 63n === 1n ? -magnitude : magnitude;
  const exponent = (biased === 0 ? 1 : biased) - 1075;
  return exponent >= 0 ? fraction(mantissa << BigInt(exponent)) : fraction(mantissa, 1n << BigInt(-exponent));
}

/** The double nearest to a fraction: its quotient to 80 bits, then rounded once to a double. */
function doubleOf({ p, q }: Fraction): number {
  if (p === 0n) return 0;
  const magnitude = p < 0n ? -p : p;
  const shift = 80 - (magnitude.toString(2).length - q.toString(2).length);
  const scaled = shift >= 0 ? (magnitude << BigInt(shift)) / q : magnitude / (q << BigInt(-shift));
  const half = Math.trunc(shift / 2);
  const value = Number(scaled) * 2 ** -half * 2 ** -(shift - half);
  return p < 0n ? -value : value;
}

/** |a| / |b|, as a double. */
const ratio = (a: Fraction, b: Fraction): number => Math.abs(doubleOf(div(a, b)));

/** The sums of one surface in exact fractions. */
type ExactSurface = Record<SeidelSum, Fraction>;

/**
 * Welford's sums of a model in exact fractions of its doubles: the vertex curvature c = c0 + 2 a2 and the departure
 * b = ((1 + K) c0^3 - c^3) / 8 + a4, the rays launched as the engine's documentation says (the matrix to the stop by
 * the two rays (1, 0) and (0, 1)), traced as heights and slopes, n' u' = n u - y (n' - n) c, with Delta(u/n) as
 * u'/n' - u/n and DIST as Welford writes it, (Abar / A)(S3 + S4) of the sphere's parts plus the term's.
 */
function exactSums(
  system: RefSystem,
  line: number,
  slope: number,
  pair?: readonly [number, number],
): { invariant: Fraction; surfaces: ExactSurface[] } {
  const zero = fraction(0n);
  const one = fraction(1n);
  const surfaces = system.surfaces.map((surface, at) => {
    const { curvature, conic, terms } = surface.profile;
    const coefficient = (power: number): Fraction => fractionOf(terms.find((t) => t.power === power)?.coeff ?? 0);
    const c0 = fractionOf(curvature);
    const c = add(c0, mul(fraction(2n), coefficient(2)));
    const b = add(div(sub(mul(add(one, fractionOf(conic)), c0, c0, c0), mul(c, c, c)), fraction(8n)), coefficient(4));
    const index = (l: number): Fraction => fractionOf(system.indexAfter[l][at]);
    return {
      z: fractionOf(surface.z),
      c,
      b,
      n: index(line),
      dn: pair === undefined ? zero : sub(index(pair[0]), index(pair[1])),
    };
  });
  // The matrix from the first vertex plane to the stop's: the heights there of the rays (1, 0) and (0, 1) in (y, n u).
  let [ya, wa, yb, wb, n] = [one, zero, zero, one, one];
  for (let at = 0; at < system.stopIndex; at++) {
    const { z, c, n: after } = surfaces[at];
    const power = mul(sub(after, n), c);
    [wa, wb] = [sub(wa, mul(power, ya)), sub(wb, mul(power, yb))];
    const reduced = div(sub(surfaces[at + 1].z, z), after);
    [ya, yb] = [add(ya, mul(reduced, wa)), add(yb, mul(reduced, wb))];
    n = after;
  }
  const radius = fractionOf(system.stopSemiDiameter);
  const ubar0 = fractionOf(slope);
  const ybar0 = neg(div(mul(yb, ubar0), ya));
  let [y0, u0] = [div(radius, ya), zero];
  if (system.objectZ !== null) {
    const distance = sub(surfaces[0].z, fractionOf(system.objectZ));
    u0 = div(radius, add(mul(ya, distance), yb));
    y0 = mul(u0, distance);
  }
  const invariant = sub(mul(ubar0, y0), mul(u0, ybar0));
  const out: ExactSurface[] = [];
  let [y, u, ybar, ubar, dn] = [y0, u0, ybar0, ubar0, zero];
  n = one;
  for (const [at, { z, c, b, n: after, dn: dispersion }] of surfaces.entries()) {
    const A = mul(n, add(mul(y, c), u));
    const Abar = mul(n, add(mul(ybar, c), ubar));
    const refract = (height: Fraction, angle: Fraction): Fraction =>
      div(sub(mul(n, angle), mul(height, sub(after, n), c)), after);
    const [refracted, refractedBar] = [refract(y, u), refract(ybar, ubar)];
    const deltaUOverN = sub(div(refracted, after), div(u, n));
    const deltaInverse = sub(div(one, after), div(one, n));
    const aspheric = mul(fraction(8n), b, sub(after, n));
    const sphere3 = neg(mul(Abar, Abar, y, deltaUOverN));
    const s4 = neg(mul(invariant, invariant, c, deltaInverse));
    const sphere5 = isZero(A)
      ? add(
          neg(mul(Abar, Abar, Abar, y, sub(div(one, mul(after, after)), div(one, mul(n, n))))),
          mul(Abar, ybar, c, deltaInverse, add(mul(Abar, y), invariant)),
        )
      : mul(div(Abar, A), add(sphere3, s4));
    const deltaDispersion = sub(div(dispersion, after), div(dn, n));
    out.push({
      SPHA: add(neg(mul(A, A, y, deltaUOverN)), mul(aspheric, y, y, y, y)),
      COMA: add(neg(mul(A, Abar, y, deltaUOverN)), mul(aspheric, y, y, y, ybar)),
      ASTI: add(sphere3, mul(aspheric, y, y, ybar, ybar)),
      FCUR: s4,
      DIST: add(sphere5, mul(aspheric, y, ybar, ybar, ybar)),
      CLA: mul(A, y, deltaDispersion),
      CTR: mul(Abar, y, deltaDispersion),
    });
    const next = surfaces[at + 1];
    if (next !== undefined) {
      const gap = sub(next.z, z);
      [y, ybar] = [add(y, mul(gap, refracted)), add(ybar, mul(gap, refractedBar))];
    }
    [u, ubar, n, dn] = [refracted, refractedBar, after, dispersion];
  }
  return { invariant, surfaces: out };
}

/** That a product of two doubles is not a double: its rounding is what a sum of it carries. */
function rounds(a: number, b: number, what: string): void {
  const product = mul(fractionOf(a), fractionOf(b));
  const rounded = fractionOf(a * b);
  assert.ok(product.p !== rounded.p || product.q !== rounded.q, `${what} is a double: nothing to carry`);
}

/** A value of the engine within `units` of the last place of the double nearest to its exact value. */
function exactly(got: number | null, exact: Fraction, units: number, what: string): void {
  const want = doubleOf(exact);
  near(got, want, want, units, what);
}

test("a sum of two products that cancels is exact to a rounding of its factors", () => {
  // Each case is launched so that its rays' heights and slopes at the surface in question are exact doubles, and one
  // of the sums cancels there to 2^-16 of its products or less: carried, each product's rounding leaves the sum exact
  // to one rounding, and the sums it is a factor of to a few; dropped, it costs some 2^16 units of the sum. Welford's
  // sums of the model's doubles in exact fractions are what the engine's are held to.
  const field = 5;
  const slope = tanDegrees(field);
  const check = (
    surfaces: readonly SurfaceOf[],
    more: SystemOf,
    spec: SeidelNativeSpec,
  ): { data: SeidelNativeData; exact: ReturnType<typeof exactSums> } => {
    const data = sums(surfaces, more, spec);
    const system = buildRefSystem(caseOf(surfaces, more));
    return { data, exact: exactSums(system, spec.line, tanDegrees(spec.maxFieldDeg), spec.dispersionLines) };
  };

  // A ray along the surface's normal: the object 64 in front of a sphere whose centre of curvature is within 1e-7 of
  // it, the stop on the sphere at 3.1: y = 3.1, u = 3.1 / 64 and A = y c + u.
  const R = -64.0000001;
  const normal = check(
    [{ z: 0, shape: sphere(R), index: 1.5 }],
    { objectZ: -64, stopSemiDiameter: 3.1, imageZ: 100 },
    { line: 0, maxFieldDeg: field },
  );
  const [y, u, c] = [fractionOf(3.1), fractionOf(3.1 / 64), fractionOf(1 / R)];
  rounds(3.1, 1 / R, "y c");
  assert.ok(ratio(add(mul(y, c), u), u) < 2 ** -16, "y c + u cancels");
  for (const name of SEIDEL_SUMS.slice(0, 5)) {
    exactly(normal.data.surfaces[0][name], normal.exact.surfaces[0][name], 8, `along the normal: ${name}`);
  }

  // The object at the sphere's aplanatic point, (n + n') R / n in front of it: the bracket u (n + n') + n y c of
  // Delta(u/n) cancels, and with it S1, S2 and S3. The stop's 3.1 makes u (n + n') a product that is not a double.
  const aplanatic = check(
    [{ z: 0, shape: sphere(-25.600001), index: 1.5 }],
    { objectZ: -64, stopSemiDiameter: 3.1, imageZ: 100 },
    { line: 0, maxFieldDeg: field },
  );
  const [ya, ua, ca] = [fractionOf(3.1), fractionOf(3.1 / 64), fractionOf(1 / -25.600001)];
  rounds(3.1 / 64, 2.5, "u (n + n')");
  rounds(3.1, 1 / -25.600001, "n y c");
  assert.ok(ratio(add(mul(ua, fractionOf(2.5)), mul(ya, ca)), mul(ya, ca)) < 2 ** -16, "the bracket cancels");
  for (const name of SEIDEL_SUMS.slice(0, 5)) {
    exactly(aplanatic.data.surfaces[0][name], aplanatic.exact.surfaces[0][name], 8, `aplanatic: ${name}`);
  }

  // The object at the sphere's front focal point: n' u' = n u - y (n' - n) c cancels; with n' - n = 1/2 the factor
  // (n' - n) c is a double, and u' is the marginal ray's slope behind the one surface.
  const Rf = 32.000001;
  const focal = check(
    [{ z: 0, shape: sphere(Rf), index: 1.5 }],
    { objectZ: -64, stopSemiDiameter: 3, imageZ: 100 },
    { line: 0, maxFieldDeg: field },
  );
  const turned = sub(fractionOf(3 / 64), mul(fractionOf(3), fractionOf(0.5), fractionOf(1 / Rf)));
  rounds(3, 0.5 * (1 / Rf), "y (n' - n) c");
  assert.ok(ratio(turned, fractionOf(3 / 64)) < 2 ** -16, "n u - y (n' - n) c cancels");
  exactly(focal.data.sampling.marginalSlopeImageSpace ?? null, div(turned, fractionOf(1.5)), 2, "u' behind it");

  // The chief ray's two sums alike, the stop a plane 64 in front of a sphere: centred on the stop within 1e-7, the
  // chief ray meets the sphere along its normal (Abar = ybar c + ubar, ybar = 64 ubar, cancels: S2, S3 and S5 with it);
  // of focal length 64 within 2e-6, it leaves the sphere parallel to the axis (n ubar - ybar (n' - n) c cancels), and
  // Abar at a plane behind it is n' ubar'. The collimated marginal ray keeps y = 3 to the sphere.
  const chief = (radius: number, rest: readonly SurfaceOf[]) =>
    check(
      [{ z: 0, shape: sphere(Infinity), index: 1 }, { z: 64, shape: sphere(radius), index: 1.5 }, ...rest],
      { stopSemiDiameter: 3, imageZ: 300 },
      { line: 0, maxFieldDeg: field },
    );
  const ybar = mul(fractionOf(64), fractionOf(slope));
  rounds(64 * slope, 1 / R, "ybar c");
  rounds(64 * slope, 0.5 * (1 / Rf), "ybar (n' - n) c");
  const centred = chief(R, []);
  assert.ok(ratio(add(mul(ybar, fractionOf(1 / R)), fractionOf(slope)), fractionOf(slope)) < 2 ** -16, "Abar cancels");
  for (const name of SEIDEL_SUMS.slice(0, 5)) {
    exactly(centred.data.surfaces[1][name], centred.exact.surfaces[1][name], 8, `chief along the normal: ${name}`);
  }
  const parallel = chief(Rf, [{ z: 72, shape: sphere(Infinity), index: 1 }]);
  const leaving = sub(fractionOf(slope), mul(ybar, fractionOf(0.5), fractionOf(1 / Rf)));
  assert.ok(ratio(leaving, fractionOf(slope)) < 2 ** -16, "n ubar - ybar (n' - n) c cancels");
  for (const name of SEIDEL_SUMS.slice(0, 5)) {
    exactly(parallel.data.surfaces[2][name], parallel.exact.surfaces[2][name], 16, `chief leaving parallel: ${name}`);
  }

  // A height carried to a surface 2e-7 behind the ray's crossing of the axis: a sphere of radius 32 into an index of 2
  // turns the collimated marginal ray at 3 to u' = -3/64 exactly, and y + d u' at the plane 64.0000002 behind it
  // cancels; the plane's S1, S2 and S3 are proportional to it.
  const gap = 64.0000002;
  const crossing = check(
    [
      { z: 0, shape: sphere(32), index: 2 },
      { z: gap, shape: sphere(Infinity), index: 1 },
    ],
    { stopSemiDiameter: 3, imageZ: 100 },
    { line: 0, maxFieldDeg: field },
  );
  rounds(gap, -3 / 64, "d u'");
  assert.ok(ratio(add(fractionOf(3), mul(fractionOf(gap), fractionOf(-3 / 64))), fractionOf(3)) < 2 ** -16, "cancels");
  for (const name of SEIDEL_SUMS.slice(0, 5)) {
    exactly(crossing.data.surfaces[1][name], crossing.exact.surfaces[1][name], 8, `near the crossing: ${name}`);
  }

  // The object near the entrance pupil: a thin lens of focal length 32 and the stop 64 behind it image the stop 64 in
  // front of the lens; the object 2^-12 in front of that. The marginal ray is launched at u = -12288, y = -786435 and
  // the chief ray at ybar = 64 ubar: H = ubar y - u ybar = -3 ubar, of products of 786432 ubar.
  const pupil = check(
    [
      { z: 0, shape: sphere(32), index: 1.5 },
      { z: 0, shape: sphere(-32), index: 1 },
      { z: 64, shape: sphere(Infinity), index: 1 },
    ],
    { stopIndex: 2, objectZ: -(64 + 2 ** -12), stopSemiDiameter: 3, imageZ: 200 },
    { line: 0, maxFieldDeg: field },
  );
  rounds(slope, -786435, "ubar y");
  assert.ok(ratio(pupil.exact.invariant, mul(fractionOf(slope), fractionOf(786435))) < 2 ** -16, "H cancels");
  exactly(pupil.data.invariant, pupil.exact.invariant, 1, "the invariant");

  // Glasses of proportional dispersion: dn' n - dn n' of Delta(dn/n) at the second surface cancels. A collimated beam
  // through a plane keeps y = 4 and u = 0 there, so A = n y c = 3/16.
  const proportional = check(
    [
      { z: 0, shape: sphere(Infinity), index: [1.5, 1.506, 1.494] },
      { z: 4, shape: sphere(32), index: [1.6, 1.6064001, 1.5936] },
      { z: 8, shape: sphere(Infinity), index: [1, 1, 1] },
    ],
    { stopSemiDiameter: 4, imageZ: 100, lines: 3 },
    { line: 0, maxFieldDeg: field, dispersionLines: [1, 2] },
  );
  const [dn1, dn2] = [sub(fractionOf(1.506), fractionOf(1.494)), sub(fractionOf(1.6064001), fractionOf(1.5936))];
  const cross = sub(mul(dn2, fractionOf(1.5)), mul(dn1, fractionOf(1.6)));
  rounds(1.506 - 1.494, 1.6, "dn n'");
  assert.ok(ratio(cross, mul(dn1, fractionOf(1.6))) < 2 ** -16, "dn' n - dn n' cancels");
  exactly(proportional.data.surfaces[1].CLA, proportional.exact.surfaces[1].CLA, 4, "CLA");
});

test("the chief ray's height on the image plane, y + d u, is the double nearest to it", () => {
  // The stop a plane at 0, a plane at 64 and the image 100 behind it, in air: the chief ray reaches the second plane at
  // ybar = 64 ubar, exactly, and the image at 164 ubar. Its product's and its sum's roundings carried, the height is
  // the nearest double to that, but where the carried rest's own rounding is within 2^-50 of a unit of a tie.
  for (const field of [1, 5, 10.25, 20, 30, 40, 50, 60, 70, 80]) {
    const data = sums(
      [
        { z: 0, shape: sphere(Infinity), index: 1 },
        { z: 64, shape: sphere(Infinity), index: 1 },
      ],
      { stopSemiDiameter: 3, imageZ: 164 },
      { line: 0, maxFieldDeg: field },
    );
    const exact = doubleOf(mul(fractionOf(164), fractionOf(tanDegrees(field))));
    const got = data.sampling.chiefHeightAtImageMm as number;
    assert.ok(Math.abs(got - exact) <= (0.5 + 2 ** -40) * ulp(exact), `${field} degrees: ${got} against ${exact}`);
  }
});

// ── The engine ───────────────────────────────────────────────────────────────────────────────────────────────────

/** The engine's answer to one request about one case. */
async function ask(opticalCase: OpticalCase, spec: JsonObject): Promise<ResultEnvelope> {
  const adapter = new RemoteEngineAdapter({
    id: REF_SEIDEL_ENGINE_ID,
    transport: createInProcessTransport(createRefSeidelEngine()),
  });
  try {
    return await adapter.run(makeRequest({ caseId: opticalCase.id, quantity: "seidel.native", spec }), opticalCase);
  } finally {
    await adapter.close();
  }
}

test("ref-seidel describes itself apart from ref, which imports nothing of it", async () => {
  const descriptor = refSeidelDescriptor();
  assert.equal(descriptor.identity.id, "ref-seidel");
  assert.deepEqual(descriptor.capabilities.quantities, { "seidel.native": { version: 1 } });
  assert.notEqual(descriptor.identity.fingerprint, refDescriptor().identity.fingerprint);
  // ref's closure has nothing of ref-seidel, which reaches ref's model and kernel.
  assert.ok(!importClosure(REF_ENGINE_MODULE).some((file) => file.startsWith("engines/refSeidel/")));
  const closure = importClosure(REF_SEIDEL_ENGINE_MODULE);
  for (const file of ["engines/ref/model.ts", "engines/ref/paraxial.ts", "engines/refSeidel/seidel.ts"]) {
    assert.ok(closure.includes(file), file);
  }
  assert.ok(!closure.some((file) => /engines\/(lv|optiland)\/|estimators\//.test(file)));
});

test("the engine answers, refuses and errs as its descriptor and its rules say", async () => {
  const single = caseOf(SURFACE, AT_SURFACE);
  const ok = await ask(single, { line: 0, maxFieldDeg: 5 });
  assert.equal(ok.status, "ok");
  assert.deepEqual(seidelNativeQuantity.validateData(ok.data), []);
  // A line the case does not have is unsupported, as every engine of the quantity says it.
  const beyond = await ask(single, { line: 1, maxFieldDeg: 5 });
  assert.deepEqual(
    [beyond.status, beyond.unsupported?.map(({ code, item }) => [code, item])],
    ["unsupported", [["option", "line"]]],
  );
  assert.match(beyond.unsupported?.[0].message ?? "", /the case has 1 lines; the spec asks line 1$/);
  const dispersionBeyond = await ask(single, { line: 0, maxFieldDeg: 5, dispersionLines: [2, 0] });
  assert.deepEqual(
    dispersionBeyond.unsupported?.map(({ item }) => item),
    ["line"],
  );
  assert.match(dispersionBeyond.unsupported?.[0].message ?? "", /asks line 2$/);
  const badSpec = await ask(single, { line: 0, maxFieldDeg: 5, dispersionLines: [0, 0] });
  assert.deepEqual([badSpec.status, badSpec.error?.code], ["error", "bad-spec"]);
  const cubic = caseOf(
    [{ z: 0, shape: { kind: "asphere", radius: 40, conic: 0, terms: [{ power: 3, coeff: 1e-5 }] }, index: 1.5 }],
    AT_SURFACE,
  );
  const refused = await ask(cubic, { line: 0, maxFieldDeg: 5 });
  assert.deepEqual([refused.status, refused.unsupported?.map((item) => item.item)], ["unsupported", [CUBIC_SAG_TERM]]);
  const linear = caseOf(
    [{ z: 0, shape: { kind: "asphere", radius: 40, conic: 0, terms: [{ power: 1, coeff: 1e-5 }] }, index: 1.5 }],
    AT_SURFACE,
  );
  assert.deepEqual(
    (await ask(linear, { line: 0, maxFieldDeg: 5 })).unsupported?.[0].item,
    "surface.asphere.linear-term",
  );
  // A stop at the rear focal point of the lens in front of it has its image in object space at infinity: a collimated
  // ray meets the stop at its centre, so no marginal ray reaches its rim and no chief ray crosses its centre at a
  // slope. A thin lens of radii 64 and -64 in index 1.5 has a focal length of 64 exactly.
  const telecentric = caseOf(
    [
      { z: 0, shape: sphere(64), index: 1.5, semiDiameter: 10 },
      { z: 0, shape: sphere(-64), index: 1, semiDiameter: 10 },
      { z: 64, shape: sphere(Infinity), index: 1, semiDiameter: 10 },
    ],
    { stopIndex: 2, stopSemiDiameter: 4, imageZ: 140 },
  );
  const answered = await ask(telecentric, { line: 0, maxFieldDeg: 5 });
  assert.equal(answered.status, "ok");
  const data = answered.data as unknown as SeidelNativeData;
  assert.deepEqual([data.status, data.reason], ["unavailable", "system.telecentric.object-space"]);
  assert.deepEqual(seidelNativeQuantity.validateData(data), []);
});
