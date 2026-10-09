// The wave transfer function, held to what is derived here: the autocorrelation of a disc, of an annulus and of a
// staircase of whole cells in closed form, and Hopkins' integral of a defocused pupil by a Gauss-Legendre rule
// written below. Every bundle is a spherical wave built from its geometry: rays through a focus, paths by their
// lengths. No expected value is another estimator's or an engine's.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  QUARTER_WAVE,
  gridConvergence,
  launchPaths,
  polychromaticWaveOtf,
  pupilFunction,
  waveOtf,
  waveOtfSums,
} from "../../src/estimators/waveOtf.ts";
import type { TracedLattice, WaveOtf, WaveOtfUnavailable } from "../../src/estimators/waveOtf.ts";

/** The image plane of every bundle, mm, and the reference point on it. */
const IMAGE_Z = 50;
const REFERENCE = { x: 0, y: 0, z: IMAGE_Z };

/** 500 nm. */
const LAMBDA = 5e-4;

/** The optical path from the incident wavefront to the focus: the same for every ray of a spherical wave. */
const TO_FOCUS = 137.25;

function available<T extends { available: true }>(outcome: T | WaveOtfUnavailable): T {
  if (!outcome.available) assert.fail(`unavailable: ${outcome.reason}: ${outcome.message}`);
  return outcome;
}

function refused(outcome: { available: boolean }): WaveOtfUnavailable {
  assert.equal(outcome.available, false);
  return outcome as WaveOtfUnavailable;
}

function assertNear(actual: number, expected: number, tolerance: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} against ${expected}, within ${tolerance}`);
}

/** A cell of a lattice and the optical cosines of its ray. */
interface Cell {
  readonly column: number;
  readonly row: number;
  readonly p: number;
  readonly q: number;
}

/** A spherical wave converging on a focus in the image space, as a lattice of rays samples it. */
interface Wave {
  readonly columns: number;
  readonly rows: number;
  /** The optical direction cosines (index times cosine) of the ray of a cell. */
  readonly cosines: (column: number, row: number) => readonly [number, number];
  /** Whether the ray of a cell arrives; every one without it. */
  readonly lit?: (cell: Cell) => boolean;
  /** The flux of a cell; 1 without it. */
  readonly flux?: (cell: Cell) => number;
  /** Where the wave converges; the reference point without it. */
  readonly focus?: { readonly x: number; readonly y: number; readonly z: number };
  readonly wavelengthMm?: number;
  /** The index of the image space; 1 without it. */
  readonly index?: number;
  /** Which point of a ray the bundle states: where it meets the image plane, or a surface 40 mm in front of it. */
  readonly through?: "image" | "exit";
  /** A ray after the cells, as the chief ray of a set is. */
  readonly chief?: boolean;
}

/** A bundle whose arrays are known for what they are. */
type Bundle = TracedLattice & {
  readonly weight: Float64Array;
  readonly valid: Uint8Array;
  readonly point: Float64Array;
  readonly direction: Float64Array;
  readonly path: Float64Array;
  readonly launchPath: Float64Array;
};

/**
 * The bundle of a wave. A ray of optical cosines (p, q) in a medium of index n has the unit direction d = (p / n,
 * q / n, sqrt(1 - (p^2 + q^2) / n^2)) and passes through the focus F. The point of it at the height z is F - t d
 * with t = (F_z - z) / d_z, and the optical path to that point is the path to the focus less n t. A ray that does
 * not arrive is left out and holds NaN, as in a trace.
 */
function traced(wave: Wave): Bundle {
  const { columns, rows } = wave;
  const count = columns * rows + (wave.chief ? 1 : 0);
  const index = wave.index ?? 1;
  const focus = wave.focus ?? REFERENCE;
  const bundle = {
    columns,
    rows,
    weight: new Float64Array(count),
    valid: new Uint8Array(count),
    point: new Float64Array(3 * count).fill(NaN),
    direction: new Float64Array(3 * count).fill(NaN),
    path: new Float64Array(count).fill(NaN),
    launchPath: new Float64Array(count),
    wavelengthMm: wave.wavelengthMm ?? LAMBDA,
    imageIndex: index,
  };
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const ray = row * columns + column;
      const [p, q] = wave.cosines(column, row);
      const cell = { column, row, p, q };
      if (wave.lit !== undefined && !wave.lit(cell)) continue;
      const d = [p / index, q / index, Math.sqrt(1 - (p * p + q * q) / (index * index))];
      const z = wave.through === "exit" ? IMAGE_Z - 40 + 30 * d[0] - 20 * d[1] * d[1] : IMAGE_Z;
      const t = (focus.z - z) / d[2];
      bundle.valid[ray] = 1;
      bundle.weight[ray] = wave.flux?.(cell) ?? 1;
      bundle.direction.set(d, 3 * ray);
      bundle.point.set([focus.x - t * d[0], focus.y - t * d[1], z], 3 * ray);
      bundle.path[ray] = TO_FOCUS - index * t;
    }
  }
  if (wave.chief) bundle.valid[count - 1] = 1;
  return bundle;
}

/** An even lattice of `cells` by `cells` over the square of half-width `na` in cosine space; a sign of -1 mirrors. */
function even(cells: number, na: number, signX = 1, signY = 1): Wave["cosines"] {
  const step = (2 * na) / cells;
  return (column, row) => [signX * step * (column + 0.5 - cells / 2), signY * step * (row + 0.5 - cells / 2)];
}

const inDisc =
  (na: number) =>
  ({ p, q }: Cell): boolean =>
    p * p + q * q <= na * na;

/** The frequency, cycles/mm, at the share `s` of the cut-off 2 NA / lambda. */
const atShare = (s: number, na: number, lambda = LAMBDA): number => (s * 2 * na) / lambda;

/**
 * The transfer function of a clear disc: its overlap with itself moved by s diameters, over its area. Two unit
 * circles 2s apart share a lens of two segments of half-angle acos(s): 2 (acos s - s sqrt(1 - s^2)), over pi.
 */
function discOtf(s: number): number {
  return s >= 1 ? 0 : (2 / Math.PI) * (Math.acos(s) - s * Math.sqrt(1 - s * s));
}

/** The area two circles of radii a and b share at the distance d of their centres: two circular segments. */
function sharedArea(a: number, b: number, d: number): number {
  if (d >= a + b) return 0;
  if (d <= Math.abs(a - b)) return Math.PI * Math.min(a, b) ** 2;
  const alpha = Math.acos((d * d + a * a - b * b) / (2 * d * a));
  const beta = Math.acos((d * d + b * b - a * a) / (2 * d * b));
  return a * a * alpha + b * b * beta - 0.5 * Math.sqrt((-d + a + b) * (d + a - b) * (d - a + b) * (d + a + b));
}

/**
 * The autocorrelation of a staircase of whole unit cells at the lag (lagU, lagV), over its area. A unit square
 * moved by (k + f, l + g), with k and l whole, overlaps four squares of the lattice, by (1 - f)(1 - g), f (1 - g),
 * (1 - f) g and f g: so the overlap is those shares of four counts of pairs of lit cells, each a whole number.
 */
function staircase(lit: (column: number, row: number) => boolean, cells: number, lagU: number, lagV: number): number {
  const [k, l] = [Math.floor(lagU), Math.floor(lagV)];
  const [f, g] = [lagU - k, lagV - l];
  const inside = (column: number, row: number): boolean =>
    column >= 0 && column < cells && row >= 0 && row < cells && lit(column, row);
  let area = 0;
  const pairs = [0, 0, 0, 0];
  for (let row = 0; row < cells; row++) {
    for (let column = 0; column < cells; column++) {
      if (!lit(column, row)) continue;
      area++;
      if (inside(column + k, row + l)) pairs[0]++;
      if (inside(column + k + 1, row + l)) pairs[1]++;
      if (inside(column + k, row + l + 1)) pairs[2]++;
      if (inside(column + k + 1, row + l + 1)) pairs[3]++;
    }
  }
  return ((1 - f) * (1 - g) * pairs[0] + f * (1 - g) * pairs[1] + (1 - f) * g * pairs[2] + f * g * pairs[3]) / area;
}

/**
 * How far the transfer function of a staircase S can be from that of the aperture D it stands for, with e the area
 * between the two over the area of D. The overlap |S and (S + s)| differs from |D and (D + s)| by at most twice
 * the area between them, once for each factor, and the area of S from that of D by at most once: so the quotient
 * is within (2 e + e) / (1 - e).
 */
const staircaseBound = (e: number): number => (3 * e) / (1 - e);

/**
 * The area between a disc `cells` cells across and its staircase, over the disc's: a cell is lit by its centre,
 * so the two differ only within half a diagonal of the rim, a ring of area 2 pi R sqrt(2) around a disc of pi R^2.
 */
const discRim = (cells: number): number => (4 * Math.SQRT2) / cells;

/** The nodes and weights of the Gauss-Legendre rule of `n` points on [-1, 1], by Newton's method on P_n. */
function gaussLegendre(n: number): { nodes: number[]; weights: number[] } {
  const nodes: number[] = [];
  const weights: number[] = [];
  for (let i = 0; i < n; i++) {
    let x = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
    let slope = 0;
    for (let step = 0; step < 50; step++) {
      let [before, value] = [1, x];
      for (let k = 2; k <= n; k++) [before, value] = [value, ((2 * k - 1) * x * value - (k - 1) * before) / k];
      slope = (n * (x * value - before)) / (x * x - 1);
      x -= value / slope;
      if (Math.abs(value / slope) < 1e-16) break;
    }
    nodes.push(x);
    weights.push(2 / ((1 - x * x) * slope * slope));
  }
  return { nodes, weights };
}

const RULE = gaussLegendre(96);

type Path = (p: number, q: number) => number;

/**
 * Hopkins' integral over a square pupil of half-width a at the shear (sx, sy), both at least 0:
 *
 *   integral of exp(2 pi i (W(c + s) - W(c)) / lambda) over the c with c and c + s in the square, over (2a)^2
 *
 * The region is the rectangle [-a, a - sx] x [-a, a - sy], and the integrand is smooth on it.
 */
function hopkinsSquare(a: number, path: Path, sx: number, sy: number, lambda: number): [number, number] {
  let [real, imaginary] = [0, 0];
  const [halfP, halfQ] = [(2 * a - sx) / 2, (2 * a - sy) / 2];
  RULE.nodes.forEach((x, i) => {
    RULE.nodes.forEach((y, j) => {
      const [p, q] = [-a + halfP * (x + 1), -a + halfQ * (y + 1)];
      const phase = (2 * Math.PI * (path(p + sx, q + sy) - path(p, q))) / lambda;
      const weight = RULE.weights[i] * RULE.weights[j] * halfP * halfQ;
      real += weight * Math.cos(phase);
      imaginary += weight * Math.sin(phase);
    });
  });
  return [real / (4 * a * a), imaginary / (4 * a * a)];
}

/**
 * Hopkins' integral over a disc of radius a at the shear s along p, over pi a^2. The region is the lens between
 * two circles: q = Q sin(theta) with Q = sqrt(a^2 - s^2 / 4) runs over its height, and for each q the p from
 * -sqrt(a^2 - q^2) to sqrt(a^2 - q^2) - s. Limits and integrand are smooth in theta, to its ends.
 */
function hopkinsDisc(a: number, path: Path, s: number, lambda: number): [number, number] {
  let [real, imaginary] = [0, 0];
  const height = Math.sqrt(a * a - (s * s) / 4);
  RULE.nodes.forEach((x, i) => {
    const theta = (Math.PI / 2) * x;
    const q = height * Math.sin(theta);
    const half = Math.sqrt(a * a - q * q);
    const halfWidth = (2 * half - s) / 2;
    RULE.nodes.forEach((y, j) => {
      const p = -half + halfWidth * (y + 1);
      const phase = (2 * Math.PI * (path(p + s, q) - path(p, q))) / lambda;
      const weight = RULE.weights[i] * RULE.weights[j] * (Math.PI / 2) * height * Math.cos(theta) * halfWidth;
      real += weight * Math.cos(phase);
      imaginary += weight * Math.sin(phase);
    });
  });
  return [real / (Math.PI * a * a), imaginary / (Math.PI * a * a)];
}

/**
 * W of a spherical wave that converges on F, about the reference R: the foot of the perpendicular from R on a ray
 * lies d . (R - F) beyond F along it, so W = T + n d . (R - F). With F = R + (a, b, defocus) and optical cosines
 * (p, q) that is T - p a - q b - defocus sqrt(n^2 - p^2 - q^2).
 */
function pathAbout(focus: { x: number; y: number; z: number }, index = 1): Path {
  return (p, q) =>
    TO_FOCUS +
    p * (REFERENCE.x - focus.x) +
    q * (REFERENCE.y - focus.y) +
    Math.sqrt(index * index - p * p - q * q) * (REFERENCE.z - focus.z);
}

const SHARES = [0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 0.97];

test("the Gauss-Legendre rule of the tests integrates what it must", () => {
  // The rule of n points is exact to the degree 2n - 1: x^2 over [-1, 1] is 2/3, and the weights add up to 2.
  const sum = (f: (x: number) => number): number => RULE.nodes.reduce((s, x, i) => s + RULE.weights[i] * f(x), 0);
  assertNear(
    sum(() => 1),
    2,
    1e-13,
    "the weights",
  );
  assertNear(
    sum((x) => x * x),
    2 / 3,
    1e-13,
    "x^2",
  );
  assertNear(
    sum((x) => x ** 20),
    2 / 21,
    1e-13,
    "x^20",
  );
  // The overlap of two clear discs, by the rule and in closed form.
  for (const s of [0.1, 0.5, 0.9]) {
    const [real, imaginary] = hopkinsDisc(0.2, () => 0, 2 * 0.2 * s, LAMBDA);
    assertNear(real, discOtf(s), 1e-12, `the clear disc at ${s}`);
    assert.equal(imaginary, 0);
  }
});

test("a clear disc: the autocorrelation of its staircase to a rounding, and the closed form within the rim's bound", () => {
  const na = 0.1;
  const worst = new Map<number, number>();
  for (const cells of [32, 64, 128, 256]) {
    const lit = inDisc(na);
    const cosines = even(cells, na);
    const otf = available(
      waveOtf(
        traced({ columns: cells, rows: cells, cosines, lit }),
        REFERENCE,
        SHARES.map((s) => atShare(s, na)),
      ),
    );
    const litCell = (column: number, row: number): boolean => {
      const [p, q] = cosines(column, row);
      return lit({ column, row, p, q });
    };
    let error = 0;
    SHARES.forEach((s, index) => {
      // The shear lambda nu = 2 NA s is s diameters: s times the cells across, along a row or along a column.
      assertNear(otf.sagittal.real[index], staircase(litCell, cells, s * cells, 0), 1e-12, `${cells}: sagittal ${s}`);
      assertNear(otf.tangential.real[index], staircase(litCell, cells, 0, s * cells), 1e-12, `${cells}: tangential`);
      // A clear pupil about its own focus has a real transfer function.
      assertNear(otf.sagittal.imaginary[index], 0, 1e-15, `${cells}: imaginary part at ${s}`);
      for (const cut of [otf.sagittal, otf.tangential]) {
        assertNear(cut.modulus[index], discOtf(s), staircaseBound(discRim(cells)), `${cells} cells at ${s}`);
        error = Math.max(error, Math.abs(cut.modulus[index] - discOtf(s)));
      }
    });
    worst.set(cells, error);
    assert.equal(otf.undersampled, false);
    assert.equal(otf.phaseStep.waves < 1e-9, true, "a wave about its own focus has no step");
  }
  // The bound falls as 1 / n. What is measured falls faster, the cells of a rim erring to both sides: by more than
  // half from one lattice to the one four times as fine, here by 5 and by 9.
  assert.ok(staircaseBound(discRim(256)) < staircaseBound(discRim(64)) / 4);
  assert.ok((worst.get(128) as number) < (worst.get(32) as number) / 2, `${[...worst]}`);
  assert.ok((worst.get(256) as number) < (worst.get(64) as number) / 2, `${[...worst]}`);
  assert.ok((worst.get(256) as number) < 2e-4, `${[...worst]}`);
});

test("the shear is in cosine space, whichever way the lattice lies: turned by 30 degrees, and mirrored", () => {
  const [cells, na] = [48, 0.12];
  const step = (2 * na) / cells;
  const [cos, sin] = [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)];
  // The cosines are the lattice turned: (p, q) = step Rot(30 deg) (u, v). A row is then no line of constant q, and
  // a shear along p is the lag Rot(-30 deg) (L, 0) = (L cos, -L sin) in cells; one along q is (L sin, L cos).
  const turned: Wave["cosines"] = (column, row) => {
    const [u, v] = [column + 0.5 - cells / 2, row + 0.5 - cells / 2];
    return [step * (u * cos - v * sin), step * (u * sin + v * cos)];
  };
  const lit = inDisc(na);
  const litCell = (column: number, row: number): boolean => {
    const [p, q] = turned(column, row);
    return lit({ column, row, p, q });
  };
  const shares = [0.11, 0.37, 0.62, 0.88];
  const otf = available(
    waveOtf(
      traced({ columns: cells, rows: cells, cosines: turned, lit }),
      REFERENCE,
      shares.map((s) => atShare(s, na)),
    ),
  );
  shares.forEach((s, index) => {
    const lag = s * cells;
    assertNear(otf.sagittal.real[index], staircase(litCell, cells, lag * cos, -lag * sin), 1e-12, `sagittal ${s}`);
    assertNear(otf.tangential.real[index], staircase(litCell, cells, lag * sin, lag * cos), 1e-12, `tangential ${s}`);
    assertNear(otf.sagittal.modulus[index], discOtf(s), staircaseBound(discRim(cells)), `the disc at ${s}`);
  });

  // An inverting lens has both cosines against the lattice, and a mirror one of them: the lag changes its sign.
  for (const [signX, signY] of [
    [-1, -1],
    [-1, 1],
  ]) {
    const cosines = even(cells, na, signX, signY);
    // Half a disc and a notch: a pupil that is not its own mirror image.
    const half = (cell: Cell): boolean => lit(cell) && !(cell.p > 0.03 && cell.q > 0.05);
    const halfCell = (column: number, row: number): boolean => {
      const [p, q] = cosines(column, row);
      return half({ column, row, p, q });
    };
    const mirrored = available(
      waveOtf(
        traced({ columns: cells, rows: cells, cosines, lit: half }),
        REFERENCE,
        shares.map((s) => atShare(s, na)),
      ),
    );
    shares.forEach((s, index) => {
      const lag = s * cells;
      assertNear(mirrored.sagittal.real[index], staircase(halfCell, cells, signX * lag, 0), 1e-12, `x ${signX}`);
      assertNear(mirrored.tangential.real[index], staircase(halfCell, cells, 0, signY * lag), 1e-12, `y ${signY}`);
    });
  }
});

test("an annular pupil: the closed form of its autocorrelation, and its staircase to a rounding", () => {
  const [cells, na, obscuration] = [128, 0.1, 0.4];
  const cosines = even(cells, na);
  const lit = ({ p, q }: Cell): boolean => {
    const r2 = p * p + q * q;
    return r2 <= na * na && r2 >= (obscuration * na) ** 2;
  };
  const litCell = (column: number, row: number): boolean => {
    const [p, q] = cosines(column, row);
    return lit({ column, row, p, q });
  };
  // The indicator of an annulus is that of the disc less that of the hole, so its autocorrelation at the distance
  // d is the area two discs share, less twice what the disc and the hole share, plus what two holes share.
  const annulusOtf = (s: number): number => {
    const [outer, inner, d] = [1, obscuration, 2 * s];
    const shared = sharedArea(outer, outer, d) - 2 * sharedArea(outer, inner, d) + sharedArea(inner, inner, d);
    return shared / (Math.PI * (outer * outer - inner * inner));
  };
  // The staircase differs from the annulus within half a diagonal of either rim: rings of 2 pi (R + r) sqrt(2)
  // cells in all, over pi (R^2 - r^2), which is 2 sqrt(2) / (R - r) with the radii in cells.
  const bound = staircaseBound((2 * Math.SQRT2) / ((cells / 2) * (1 - obscuration)));
  // Up to 0.3 the hole of one lies whole in the other's disc, at 0.4 the two holes part, at 0.7 hole and disc do.
  const shares = [0.05, 0.15, 0.3, 0.4, 0.45, 0.6, 0.7, 0.85, 0.95];
  const otf = available(
    waveOtf(
      traced({ columns: cells, rows: cells, cosines, lit }),
      REFERENCE,
      shares.map((s) => atShare(s, na)),
    ),
  );
  let worst = 0;
  shares.forEach((s, index) => {
    assertNear(otf.sagittal.real[index], staircase(litCell, cells, s * cells, 0), 1e-12, `the staircase at ${s}`);
    for (const cut of [otf.sagittal, otf.tangential]) {
      assertNear(cut.modulus[index], annulusOtf(s), bound, `the annulus at ${s}`);
      worst = Math.max(worst, Math.abs(cut.modulus[index] - annulusOtf(s)));
    }
  });
  // An annulus is not a disc: at 0.3 of the cut-off it transfers 0.39 where the clear disc has 0.62.
  assert.ok(discOtf(0.3) - annulusOtf(0.3) > 0.2);
  assert.ok(worst < 2e-3, `measured ${worst}`);
});

test("a defocused square pupil: Hopkins' integral by quadrature, within a bound of second order", () => {
  // A square pupil of whole cells has no staircase: what is left is the estimator's own rule. The wave converges
  // 0.05 mm behind the image plane and a little beside the reference, so W = -p a - q b - defocus sqrt(1 - p^2 -
  // q^2): half a wave of defocus at the middle of a side, a wave at a corner, and a complex transfer function.
  const na = 0.1;
  const focus = { x: 2e-4, y: -1e-4, z: IMAGE_Z + 0.05 };
  const path = pathAbout(focus);
  const shares = [0.1, 0.25, 0.4, 0.6, 0.8];
  const errors: number[] = [];
  for (const cells of [32, 64, 128]) {
    const otf = available(
      waveOtf(
        traced({ columns: cells, rows: cells, cosines: even(cells, na), focus }),
        REFERENCE,
        shares.map((s) => atShare(s, na)),
      ),
    );
    // The bound. In cells (u, v), a pair has the phase Psi = (2 pi / lambda) (W(u + L, v) - W(u, v)), whose first
    // derivatives are within G1 = (2 pi / lambda) 2 h D1 and whose second ones within G2 = (2 pi / lambda) 2 h^2
    // D2, with h the cell in cosines and D1, D2 the largest first and second derivatives of W, taken over the
    // square and one cell beyond it.
    // - A whole cell: the midpoint rule errs by half the second derivatives of exp(i Psi), each within G2 + G1^2,
    //   over the cell, (1/24 + 1/24 + 1/16) of them: 7/48 (G2 + G1^2).
    // - The path at the other end is interpolated between two cells: within h^2 D2 / 8, a phase of G2 / 16.
    // - In each row one cell overlaps the pupil's edge in part. Its phase is read at the node, at most half a
    //   cell either way from any point of the part, G1 in all, and at a point one cell beyond the last lit cell,
    //   where the straight continuation is within h^2 D2, a phase of G2 / 2. It is one cell of the n of a row.
    const h = (2 * na) / cells;
    const edge = na + h;
    const least = Math.sqrt(1 - 2 * edge * edge);
    const defocus = focus.z - IMAGE_Z;
    const d1 = (defocus * edge) / least + Math.max(Math.abs(focus.x), Math.abs(focus.y));
    const d2 = defocus * (1 / least + (edge * edge) / least ** 3);
    const g1 = ((2 * Math.PI) / LAMBDA) * 2 * h * d1;
    const g2 = ((2 * Math.PI) / LAMBDA) * 2 * h * h * d2;
    const bound = (7 / 48) * (g2 + g1 * g1) + g2 / 16 + (g1 + g2 / 2) / cells;
    let error = 0;
    shares.forEach((s, index) => {
      const shear = 2 * na * s;
      const alongX = hopkinsSquare(na, path, shear, 0, LAMBDA);
      const alongY = hopkinsSquare(na, path, 0, shear, LAMBDA);
      const differences = [
        otf.sagittal.real[index] - alongX[0],
        otf.sagittal.imaginary[index] - alongX[1],
        otf.tangential.real[index] - alongY[0],
        otf.tangential.imaginary[index] - alongY[1],
      ];
      for (const difference of differences) {
        assert.ok(Math.abs(difference) <= bound, `${cells} cells at ${s}: ${difference} beyond ${bound}`);
        error = Math.max(error, Math.abs(difference));
      }
    });
    errors.push(error);
    assert.equal(otf.undersampled, false);
  }
  // Defocus matters here: at 0.4 of the cut-off the clear square transfers 0.6 and this one a fifth of it.
  const [real, imaginary] = hopkinsSquare(na, path, 2 * na * 0.4, 0, LAMBDA);
  assert.ok(Math.hypot(real, imaginary) < 0.2, `${real}, ${imaginary}`);
  // The bound falls as the square of the cell. What is measured is some three hundred times below it and falls
  // with it: by more than half for a lattice twice as fine, and by more than eight for one four times as fine.
  assert.ok(errors[1] < errors[0] / 2 && errors[2] < errors[1] / 2 && errors[2] < errors[0] / 8, `${errors}`);
  assert.ok(errors[2] < 1e-4, `${errors}`);
});

test("a defocused disc: Hopkins' integral by quadrature, within the bounds of rim and rule", () => {
  const [cells, na] = [128, 0.1];
  const focus = { x: 0, y: 0, z: IMAGE_Z - 0.04 };
  const path = pathAbout(focus);
  const shares = [0.1, 0.2, 0.35, 0.5, 0.7, 0.9];
  const otf = available(
    waveOtf(
      traced({ columns: cells, rows: cells, cosines: even(cells, na), lit: inDisc(na), focus }),
      REFERENCE,
      shares.map((s) => atShare(s, na)),
    ),
  );
  // The rule's bound as for the square, with one cell in part for each of the n rows of about pi n^2 / 4 cells,
  // and the rim's bound beside it: the integrand has the modulus 1, so the area between staircase and disc counts
  // as it does for a clear pupil.
  const h = (2 * na) / cells;
  const edge = na + h;
  const least = Math.sqrt(1 - edge * edge);
  const defocus = Math.abs(focus.z - IMAGE_Z);
  const g1 = ((2 * Math.PI) / LAMBDA) * 2 * h * ((defocus * edge) / least);
  const g2 = ((2 * Math.PI) / LAMBDA) * 2 * h * h * defocus * (1 / least + (edge * edge) / least ** 3);
  const rule = (7 / 48) * (g2 + g1 * g1) + g2 / 16 + ((4 / Math.PI) * (g1 + g2 / 2)) / cells;
  const bound = staircaseBound(discRim(cells)) + rule;
  let worst = 0;
  shares.forEach((s, index) => {
    const [real, imaginary] = hopkinsDisc(na, path, 2 * na * s, LAMBDA);
    for (const cut of [otf.sagittal, otf.tangential]) {
      const error = Math.hypot(cut.real[index] - real, cut.imaginary[index] - imaginary);
      assert.ok(error <= bound, `at ${s}: ${error} beyond ${bound}`);
      worst = Math.max(worst, error);
    }
    // 0.4 waves of defocus at the rim: 0.29 below the clear disc, which the bound therefore tells it from.
    if (s === 0.35) assert.ok(discOtf(s) - real > bound + 0.1, `${real} against ${discOtf(s)}, bound ${bound}`);
  });
  assert.ok(worst < 1.5e-3, `measured ${worst}`);
});

test("the path of a cell is the path to the foot of the perpendicular from the reference, by either point of a ray", () => {
  const [cells, na, index] = [12, 0.3, 1.5];
  const focus = { x: 0.003, y: -0.002, z: IMAGE_Z + 0.02 };
  const wave: Wave = { columns: cells, rows: cells, cosines: even(cells, na, -1, -1), lit: inDisc(na), focus, index };
  const expected = pathAbout(focus, index);
  const pupils = (["image", "exit"] as const).map((through) =>
    available(pupilFunction(traced({ ...wave, through, chief: true }), REFERENCE)),
  );
  for (const pupil of pupils) {
    const datum = pupil.lit.indexOf(1);
    const [p0, q0] = wave.cosines(datum % cells, Math.floor(datum / cells));
    let lit = 0;
    for (let ray = 0; ray < cells * cells; ray++) {
      const [p, q] = wave.cosines(ray % cells, Math.floor(ray / cells));
      const inside = p * p + q * q <= na * na;
      assert.equal(pupil.lit[ray], inside ? 1 : 0);
      if (!inside) {
        assert.deepEqual([pupil.cosineX[ray], pupil.pathMm[ray], pupil.modulus[ray], pupil.area[ray]], [0, 0, 0, 0]);
        continue;
      }
      lit++;
      // The pupil coordinate is the index times the direction cosine; the path is late where the ray is long.
      assertNear(pupil.cosineX[ray], p, 1e-15, `cosine x of ray ${ray}`);
      assertNear(pupil.cosineY[ray], q, 1e-15, `cosine y of ray ${ray}`);
      assertNear(pupil.pathMm[ray], expected(p, q) - expected(p0, q0), 2e-13, `path of ray ${ray}`);
      // The flux of a cell over the area it covers: the lattice is even, a cell covers the square of its step.
      assertNear(pupil.area[ray], ((2 * na) / cells) ** 2, 1e-15, `area of ray ${ray}`);
      assertNear(pupil.modulus[ray] ** 2 * pupil.area[ray], 1, 1e-13, `flux of ray ${ray}`);
    }
    assert.equal(pupil.cells, lit);
  }
});

test("the modulus is the square root of flux over the area of cosine space a cell covers", () => {
  // A lattice that is even in the entrance pupil and not in cosine space: p = NA phi(x) with phi(x) = (x + 2 x^3)
  // / 3 over x in [-1, 1], q = NA y. A cell covers NA^2 phi'(x) of cosine space times the square of its step,
  // seven times as much at the sides as amid them. With the flux phi'(x) the pupil function is even again, and
  // the pupil is the clear square [-NA, NA]^2, whose transfer function is the triangle 1 - s along either side.
  const [cells, na] = [256, 0.1];
  const phi = (x: number): number => (x + 2 * x ** 3) / 3;
  const slope = (x: number): number => (1 + 6 * x * x) / 3;
  const xOf = (column: number): number => (column + 0.5 - cells / 2) / (cells / 2);
  const wave: Wave = {
    columns: cells,
    rows: cells,
    cosines: (column, row) => [na * phi(xOf(column)), na * xOf(row)],
    flux: ({ column }) => slope(xOf(column)),
  };
  const bundle = traced(wave);
  const pupil = available(pupilFunction(bundle, REFERENCE));
  const step = 2 / cells;
  for (const ray of [0, 3 * cells + 100, 128 * cells + 128, cells * cells - 1]) {
    // The central difference of phi over two cells is phi' to within step^2 / 6 of its third derivative, 4; at
    // the two ends of a row the cell beyond is the straight continuation, and the difference is one-sided, within
    // step / 2 of the second derivative, at most 4.
    const column = ray % cells;
    const atEnd = column === 0 || column === cells - 1;
    const tolerance = na * na * step * step * (atEnd ? 2 * step : (4 * step * step) / 6) * 1.001;
    assertNear(pupil.area[ray], na * na * step * step * slope(xOf(column)), tolerance, `area of ray ${ray}`);
    assertNear(pupil.modulus[ray] ** 2 * pupil.area[ray], slope(xOf(column)), 1e-12, `flux of ray ${ray}`);
  }
  const shares = [0.1, 0.3, 0.5, 0.75];
  const otf = available(
    waveOtf(
      bundle,
      REFERENCE,
      shares.map((s) => atShare(s, na)),
    ),
  );
  // Along q the lattice is even, and the triangle is exact. Along p the sum over a row is of the cells' widths,
  // short of the length 2 NA (1 - s) by no more than the widest cell at either end of the overlap: twice NA
  // phi'(1) step, over 2 NA. With the flux taken for the square of the modulus, without the area, the pupil would
  // be seven times as bright at its sides as amid it, and its autocorrelation no triangle.
  const tolerance = slope(1) * step;
  shares.forEach((s, index) => {
    assertNear(otf.tangential.real[index], 1 - s, 1e-12, `tangential at ${s}`);
    assertNear(otf.sagittal.real[index], 1 - s, tolerance, `sagittal at ${s}`);
  });
  assert.ok(tolerance < 0.02);
});

test("a tilt changes the phase alone: a focus beside the reference, and a reference moved", () => {
  const [cells, na] = [40, 0.15];
  // A lattice that maps into cosine space with a twist and a stretch: no row of it is a line of constant cosine.
  const warped: Wave["cosines"] = (column, row) => {
    const [x, y] = [(column + 0.5 - cells / 2) / (cells / 2), (row + 0.5 - cells / 2) / (cells / 2)];
    return [na * (x + 0.15 * x * (x * x + y * y) + 0.1 * y * y + 0.2 * y), na * (y + 0.15 * y * (x * x + y * y))];
  };
  const frequencies = [0, 20, 55, 130, 260, 410];
  for (const cosines of [even(cells, na), warped]) {
    const lit = inDisc(0.8 * na);
    const flux = ({ p, q }: Cell): number => 1 + 2 * p - 3 * q;
    const wave: Wave = { columns: cells, rows: cells, cosines, lit, flux };
    const defocused = { x: 0, y: 0, z: IMAGE_Z + 0.03 };
    const about = available(waveOtf(traced({ ...wave, focus: defocused }), REFERENCE, frequencies));
    // The same wave, converging 12 and 7 micrometres beside: six and three waves of tilt across the pupil.
    const [dx, dy] = [0.012, -0.007];
    const beside = { x: dx, y: dy, z: defocused.z };
    const shifted = available(waveOtf(traced({ ...wave, focus: beside }), REFERENCE, frequencies));
    // And the first wave again, about a reference moved the other way: the same thing.
    const moved = { x: -dx, y: -dy, z: IMAGE_Z };
    const seenFrom = available(waveOtf(traced({ ...wave, focus: defocused }), moved, frequencies));
    frequencies.forEach((frequency, index) => {
      for (const [cut, offset] of [
        ["sagittal", dx],
        ["tangential", dy],
      ] as const) {
        // A spot displaced by +d turns the transfer function by exp(-2 pi i nu d), as the geometric one. The two
        // bundles agree to the rounding of their paths, of 137 mm: 3e-11 waves a ray.
        const [cos, sin] = [Math.cos(2 * Math.PI * frequency * offset), Math.sin(2 * Math.PI * frequency * offset)];
        const real = about[cut].real[index] * cos + about[cut].imaginary[index] * sin;
        const imaginary = about[cut].imaginary[index] * cos - about[cut].real[index] * sin;
        for (const other of [shifted, seenFrom]) {
          assertNear(other[cut].modulus[index], about[cut].modulus[index], 1e-9, `modulus, ${cut} ${frequency}`);
          assertNear(other[cut].real[index], real, 1e-9, `real part, ${cut} at ${frequency}`);
          assertNear(other[cut].imaginary[index], imaginary, 1e-9, `imaginary part, ${cut} at ${frequency}`);
        }
      }
    });
    // The tilt is in the step of the lattice, though: the reference belongs amid the spot.
    assert.ok(shifted.phaseStep.waves > 4 * about.phaseStep.waves);
    assert.ok(about.sagittal.modulus[3] > 0.05 && about.sagittal.modulus[3] < 0.95);
  }
});

test("the cut-off: nothing beyond the widest row of lit cells, and exactly 1 at the frequency 0", () => {
  const [cells, na] = [32, 0.1];
  const bundle = traced({ columns: cells, rows: cells, cosines: even(cells, na), lit: inDisc(na) });
  const cutOff = (2 * na) / LAMBDA;
  const frequencies = [0, 0.99 * cutOff, cutOff, 1.0001 * cutOff, 1.5 * cutOff, 40 * cutOff, -1.2 * cutOff];
  const otf = available(waveOtf(bundle, REFERENCE, frequencies));
  for (const cut of [otf.sagittal, otf.tangential]) {
    assert.deepEqual([cut.real[0], cut.imaginary[0], cut.modulus[0]], [1, 0, 1]);
    assert.ok(cut.modulus[1] > 0 && cut.modulus[1] < 0.01, `just below the cut-off: ${cut.modulus[1]}`);
    // At the cut-off itself the last cells of the widest row touch, to a rounding of the lag.
    assert.ok(cut.modulus[2] < 1e-15, `at the cut-off: ${cut.modulus[2]}`);
    for (const index of [3, 4, 5, 6]) {
      assert.deepEqual([cut.real[index], cut.imaginary[index], cut.modulus[index]], [0, 0, 0], `at ${index}`);
    }
  }
  // 1 at the frequency 0 whatever the pupil: defocused, tilted, of uneven flux, in glass.
  const rough = traced({
    columns: 20,
    rows: 14,
    cosines: (column, row) => [0.02 * (column - 9.3), 0.017 * (row - 6.1) + 0.001 * column],
    flux: ({ column, row }) => 0.3 + ((7 * column + 3 * row) % 11) / 7,
    focus: { x: 0.004, y: 0.001, z: IMAGE_Z - 0.07 },
    index: 1.33,
  });
  const one = available(waveOtf(rough, REFERENCE, [0, 31, 0]));
  for (const cut of [one.sagittal, one.tangential]) {
    assert.deepEqual([cut.real[0], cut.imaginary[0], cut.modulus[0]], [1, 0, 1]);
    assert.deepEqual([cut.real[2], cut.imaginary[2], cut.modulus[2]], [1, 0, 1]);
    assert.ok(cut.modulus[1] < 1);
  }
  // A value does not depend on which other frequencies are asked, and at a negative frequency it is the
  // conjugate, in every bit: the rule takes each cell as either end of a pair.
  const alone = available(waveOtf(rough, REFERENCE, [31]));
  const mirror = available(waveOtf(rough, REFERENCE, [-31]));
  assert.equal(alone.sagittal.real[0], one.sagittal.real[1]);
  assert.equal(alone.tangential.imaginary[0], one.tangential.imaginary[1]);
  for (const cut of ["sagittal", "tangential"] as const) {
    assert.equal(mirror[cut].real[0], alone[cut].real[0]);
    assert.equal(mirror[cut].imaginary[0], -alone[cut].imaginary[0]);
    assert.ok(Math.abs(alone[cut].imaginary[0]) > 0.01);
  }
});

test("sagittal is the cut along image x and tangential the one along image y", () => {
  const [cells, na] = [96, 0.1];
  // An ellipse of the half-axes NA along x and NA / 2 along y is a disc squeezed: along an axis its
  // autocorrelation is the disc's at the shear over that axis.
  const ellipse = ({ p, q }: Cell): boolean => (p / na) ** 2 + (q / (na / 2)) ** 2 <= 1;
  const frequency = atShare(0.3, na);
  const wide = available(
    waveOtf(traced({ columns: cells, rows: cells, cosines: even(cells, na), lit: ellipse }), REFERENCE, [frequency]),
  );
  const bound = staircaseBound(discRim(cells / 2));
  assertNear(wide.sagittal.modulus[0], discOtf(0.3), bound, "along the long axis");
  assertNear(wide.tangential.modulus[0], discOtf(0.6), bound, "along the short axis");
  assert.ok(Math.abs(wide.sagittal.modulus[0] - discOtf(0.3)) < 2e-3);
  assert.ok(Math.abs(wide.tangential.modulus[0] - discOtf(0.6)) < 2e-3);

  // The same pupil with x and y exchanged, lattice, wave and all: the two cuts change places.
  const focus = { x: 0.002, y: -0.001, z: IMAGE_Z + 0.02 };
  const swap = { x: focus.y, y: focus.x, z: focus.z };
  const upright = even(cells, na);
  const one = available(
    waveOtf(traced({ columns: cells, rows: cells, cosines: upright, lit: ellipse, focus }), REFERENCE, [frequency]),
  );
  const other = available(
    waveOtf(
      traced({
        columns: cells,
        rows: cells,
        cosines: (column, row) => {
          const [p, q] = upright(row, column);
          return [q, p];
        },
        lit: ({ column, row, p, q }) => ellipse({ column: row, row: column, p: q, q: p }),
        focus: swap,
      }),
      REFERENCE,
      [frequency],
    ),
  );
  for (const part of ["real", "imaginary", "modulus"] as const) {
    assertNear(other.sagittal[part][0], one.tangential[part][0], 1e-13, `sagittal ${part}`);
    assertNear(other.tangential[part][0], one.sagittal[part][0], 1e-13, `tangential ${part}`);
  }
  assert.ok(Math.abs(one.sagittal.imaginary[0]) > 0.01);
});

test("the pupil coordinate is the index times the cosine: a wave in glass is the wave in air", () => {
  // The same optical cosines in a medium of index 1.5, about the same focus beside the reference: the directions
  // are other ones and the paths longer, and the pupil function is the same, so the transfer function is.
  const [cells, na] = [36, 0.3];
  const focus = { x: 0.0015, y: 0.0004, z: IMAGE_Z };
  const wave: Wave = { columns: cells, rows: cells, cosines: even(cells, na), lit: inDisc(na), focus };
  const frequencies = [50, 300, 700, 1100];
  const inAir = available(waveOtf(traced(wave), REFERENCE, frequencies));
  const inGlass = available(waveOtf(traced({ ...wave, index: 1.5 }), REFERENCE, frequencies));
  frequencies.forEach((frequency, index) => {
    assertNear(inGlass.sagittal.real[index], inAir.sagittal.real[index], 1e-11, `real at ${frequency}`);
    assertNear(inGlass.sagittal.imaginary[index], inAir.sagittal.imaginary[index], 1e-11, `imaginary at ${frequency}`);
    assertNear(inGlass.tangential.modulus[index], inAir.tangential.modulus[index], 1e-11, `modulus at ${frequency}`);
  });
  // The cut-off is 2 NA / lambda with NA the optical one: 1200 cycles/mm, and something is left at 1100.
  assert.ok(inGlass.sagittal.modulus[3] > 0.01);
});

test("the quarter-wave flag: raised by a steep defocus, not by a mild one, with the step in closed form", () => {
  const [cells, na] = [32, 0.2];
  const cosines = even(cells, na);
  const lit = inDisc(na);
  for (const [defocus, flagged, about] of [
    [0.02, false, 0.1],
    [0.045, false, 0.22],
    [0.055, true, 0.27],
    [0.2, true, 1],
  ] as const) {
    const focus = { x: 0, y: 0, z: IMAGE_Z + defocus };
    const path = pathAbout(focus);
    // The largest step between two lit cells that are neighbours along a row or a column, from W itself.
    let expected = 0;
    for (let row = 0; row < cells; row++) {
      for (let column = 0; column < cells; column++) {
        const [p, q] = cosines(column, row);
        if (!lit({ column, row, p, q })) continue;
        for (const [c, r] of [
          [column + 1, row],
          [column, row + 1],
        ]) {
          if (c >= cells || r >= cells) continue;
          const [p1, q1] = cosines(c, r);
          if (lit({ column: c, row: r, p: p1, q: q1 })) {
            expected = Math.max(expected, Math.abs(path(p1, q1) - path(p, q)) / LAMBDA);
          }
        }
      }
    }
    const otf = available(
      waveOtf(traced({ columns: cells, rows: cells, cosines, lit, focus }), REFERENCE, [atShare(0.2, na)]),
    );
    assertNear(otf.phaseStep.waves, expected, 1e-9, `the step at a defocus of ${defocus} mm`);
    assert.equal(otf.undersampled, flagged);
    assert.equal(expected > QUARTER_WAVE, flagged);
    // The slope of W at the rim is defocus NA / sqrt(1 - NA^2), over cells of 0.0125: 5 waves a cell and millimetre.
    assertNear(expected, about, 0.1 * about, `the step at ${defocus} mm`);
    assert.equal(
      otf.cells,
      available(pupilFunction(traced({ columns: cells, rows: cells, cosines, lit }), REFERENCE)).cells,
    );
    // The two rays named are neighbours, and their paths are that step apart.
    const { ray, neighbour } = otf.phaseStep;
    assert.ok(neighbour === ray + 1 || neighbour === ray + cells, `${ray} and ${neighbour}`);
    const [a, b] = [
      cosines(ray % cells, Math.floor(ray / cells)),
      cosines(neighbour % cells, Math.floor(neighbour / cells)),
    ];
    assertNear(Math.abs(path(...a) - path(...b)) / LAMBDA, expected, 1e-9, "the step between the rays named");
  }
  assert.equal(QUARTER_WAVE, 0.25);
});

test("a spectrum of two lines: each sheared by its own wavelength, added by weight times flux about one point", () => {
  const [cells, na] = [64, 0.1];
  const lit = inDisc(na);
  // Two lines whose spots lie 3 micrometres apart, by lateral colour; the second carries half the flux a cell.
  const blue = { wavelengthMm: 4.5e-4, focus: { x: 0.002, y: 0, z: IMAGE_Z }, flux: () => 1 };
  const red = { wavelengthMm: 6.5e-4, focus: { x: -0.001, y: 0, z: IMAGE_Z }, flux: () => 0.5 };
  const bundles = [blue, red].map((line) =>
    traced({ columns: cells, rows: cells, cosines: even(cells, na), lit, ...line }),
  );
  const weights = [2, 1];
  const frequencies = [0, 40, 110, 200, 290];
  const spectrum = available(
    polychromaticWaveOtf(
      bundles.map((bundle, line) => ({ weight: weights[line], bundle })),
      REFERENCE,
      frequencies,
    ),
  );
  const own = bundles.map((bundle) => available(waveOtfSums(bundle, REFERENCE, frequencies)));
  // The flux of a line is that of its lit cells: as many as there are, at 1 and at a half.
  assertNear(own[0].flux, own[0].cells, 1e-10, "flux of the first line");
  assertNear(own[1].flux, own[1].cells / 2, 1e-10, "flux of the second line");
  const share = [2 * 1, 1 * 0.5].map((part) => part / 2.5);
  const bound = staircaseBound(discRim(cells));
  frequencies.forEach((frequency, index) => {
    // Each line is the clear disc at its own share of its own cut-off, turned by where its spot lies.
    let [real, imaginary] = [0, 0];
    [blue, red].forEach((line, at) => {
      const modulus = discOtf((line.wavelengthMm * frequency) / (2 * na));
      real += share[at] * modulus * Math.cos(2 * Math.PI * frequency * line.focus.x);
      imaginary -= share[at] * modulus * Math.sin(2 * Math.PI * frequency * line.focus.x);
    });
    assert.ok(
      Math.hypot(spectrum.sagittal.real[index] - real, spectrum.sagittal.imaginary[index] - imaginary) <= bound,
      `sagittal at ${frequency}`,
    );
    assert.ok(Math.hypot(spectrum.sagittal.real[index] - real, spectrum.sagittal.imaginary[index] - imaginary) < 3e-3);
    // And the sum is of the lines' own sums, to a rounding.
    for (const cut of ["sagittal", "tangential"] as const) {
      const total = weights[0] * own[0].flux + weights[1] * own[1].flux;
      for (const part of ["real", "imaginary"] as const) {
        const sum = weights[0] * own[0][cut][part][index] + weights[1] * own[1][cut][part][index];
        assertNear(spectrum[cut][part][index], sum / total, 1e-14, `${cut} ${part} at ${frequency}`);
      }
    }
  });
  // Lateral colour lowers the modulus: at 200 cycles/mm the two spots are 0.6 of a cycle apart, and the sum is
  // 0.08 short of what the two lines would give on one spot.
  const alone = bundles.map((bundle) => available(waveOtf(bundle, REFERENCE, frequencies)));
  const onOneSpot = share[0] * alone[0].sagittal.modulus[3] + share[1] * alone[1].sagittal.modulus[3];
  assert.ok(spectrum.sagittal.modulus[3] < onOneSpot - 0.05, `${spectrum.sagittal.modulus[3]} against ${onOneSpot}`);
  assert.equal(spectrum.sagittal.real[0], 1);
  assert.equal(spectrum.cells, own[0].cells + own[1].cells);
  assert.equal(spectrum.lines.length, 2);
  // The step of the spectrum is the largest of its lines', with the line: the blue spot is further off, and its
  // wave shorter.
  assert.equal(spectrum.phaseStep.line, 0);
  assert.equal(spectrum.phaseStep.waves, own[0].phaseStep.waves);
  assert.ok(own[0].phaseStep.waves > own[1].phaseStep.waves);

  // One line of weight 1 is the transfer function of its bundle in every bit.
  const single = available(polychromaticWaveOtf([{ weight: 1, bundle: bundles[1] }], REFERENCE, frequencies));
  for (const cut of ["sagittal", "tangential"] as const) {
    for (const part of ["real", "imaginary", "modulus"] as const) {
      assert.deepEqual(single[cut][part], alone[1][cut][part], `${cut} ${part}`);
    }
  }
});

test("the launch path: a plane wave's is the projection of the origin, a point source's the length to it", () => {
  // A collimated bundle 20 degrees off the axis, started on the plane z = -30. A perfect lens brings every ray
  // to the focus by the same optical path from a wavefront; a trace counts each ray's from its own origin, which
  // lies o . d behind the wavefront through the coordinate origin.
  const [cells, na] = [24, 0.1];
  const angle = (20 * Math.PI) / 180;
  const incoming = [0, Math.sin(angle), Math.cos(angle)];
  const wave: Wave = { columns: cells, rows: cells, cosines: even(cells, na, -1, -1), lit: inDisc(na) };
  const whole = traced(wave);
  const count = cells * cells;
  const origins = new Float64Array(3 * count);
  const directions = new Float64Array(3 * count);
  for (let ray = 0; ray < count; ray++) {
    origins.set([0.8 * ((ray % cells) - 11.5), 0.8 * (Math.floor(ray / cells) - 11.5) - 9, -30], 3 * ray);
    // A direction need not be a unit vector to the last bit: this one is 1.0000001 long.
    directions.set(
      incoming.map((component) => 1.0000001 * component),
      3 * ray,
    );
  }
  const launch = launchPaths(origins, directions, { kind: "infinity" });
  const path = new Float64Array(count);
  for (let ray = 0; ray < count; ray++) {
    const projection = origins[3 * ray + 1] * incoming[1] + origins[3 * ray + 2] * incoming[2];
    assertNear(launch[ray], projection, 1e-13, `launch path of ray ${ray}`);
    path[ray] = whole.path[ray] - projection;
  }
  const frequencies = [atShare(0.3, na), atShare(0.6, na)];
  const expected = available(waveOtf(whole, REFERENCE, frequencies));
  const withLaunch = available(waveOtf({ ...whole, path, launchPath: launch }, REFERENCE, frequencies));
  assertNear(withLaunch.sagittal.modulus[0], expected.sagittal.modulus[0], 1e-11, "sagittal");
  assertNear(withLaunch.tangential.modulus[1], expected.tangential.modulus[1], 1e-11, "tangential");
  assert.ok(withLaunch.phaseStep.waves < 1e-6, `${withLaunch.phaseStep.waves}`);
  // Without it the lattice is a tilt of 0.8 mm sin(20 deg) a row: five hundred waves a cell.
  const without = available(waveOtf({ ...whole, path }, REFERENCE, frequencies));
  assertNear(without.phaseStep.waves, (0.8 * incoming[1]) / LAMBDA, 1e-6, "the step without a launch path");
  assert.equal(without.undersampled, true);

  // From a point of the plane z = -200: the length of each ray from that point to its origin.
  const source = [3, -12, -200];
  for (let ray = 0; ray < count; ray++) {
    const origin = [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]];
    const toOrigin = origin.map((value, axis) => value - source[axis]);
    directions.set(
      toOrigin.map((value) => value / Math.hypot(...toOrigin)),
      3 * ray,
    );
  }
  const fromPoint = launchPaths(origins, directions, { kind: "finite", z: -200 });
  for (let ray = 0; ray < count; ray++) {
    const length = Math.hypot(origins[3 * ray] - 3, origins[3 * ray + 1] + 12, 170);
    assertNear(fromPoint[ray], length, 1e-12, `from the point, ray ${ray}`);
  }
  assert.throws(() => launchPaths(origins, directions.subarray(3), { kind: "infinity" }), RangeError);
});

test("what is not a cell, not taken or of no weight is not looked at, and a piston is of no account", () => {
  const [cells, na] = [24, 0.1];
  const focus = { x: 0.001, y: 0, z: IMAGE_Z + 0.03 };
  const wave: Wave = { columns: cells, rows: cells, cosines: even(cells, na), lit: inDisc(na), focus };
  const frequencies = [atShare(0.2, na), atShare(0.5, na)];
  const plain = available(waveOtf(traced(wave), REFERENCE, frequencies));
  // A chief ray after the cells, taken and all NaN, is no cell.
  const withChief = available(waveOtf(traced({ ...wave, chief: true }), REFERENCE, frequencies));
  assert.deepEqual(withChief.sagittal, plain.sagittal);
  assert.deepEqual(withChief.tangential, plain.tangential);
  // The same pupil as weights of 0 on a lattice that is taken whole: a cell of no flux is dark.
  const dark = traced({ ...wave, lit: undefined, flux: (cell) => (inDisc(na)(cell) ? 1 : 0) });
  const byWeight = available(waveOtf({ ...dark, valid: undefined }, REFERENCE, frequencies));
  assert.deepEqual(byWeight.sagittal, plain.sagittal);
  assert.equal(byWeight.cells, plain.cells);
  // Every path 1000 mm longer: the same transfer function, to the rounding of a path of a metre.
  const bundle = traced(wave);
  const late = available(waveOtf({ ...bundle, path: bundle.path.map((path) => path + 1000) }, REFERENCE, frequencies));
  assertNear(late.sagittal.real[1], plain.sagittal.real[1], 1e-8, "real part");
  assertNear(late.sagittal.imaginary[1], plain.sagittal.imaginary[1], 1e-8, "imaginary part");
  // Either point of a ray, with the path to it, gives the same transfer function.
  const fromExit = available(waveOtf(traced({ ...wave, through: "exit" }), REFERENCE, frequencies));
  assertNear(fromExit.sagittal.real[1], plain.sagittal.real[1], 1e-9, "from the exit point, real");
  assertNear(fromExit.tangential.imaginary[0], plain.tangential.imaginary[0], 1e-9, "from the exit point, imaginary");
  // Twice the flux everywhere is the same pupil.
  const bright = available(
    waveOtf({ ...bundle, weight: bundle.weight.map((flux) => 2 * flux) }, REFERENCE, frequencies),
  );
  assertNear(bright.sagittal.real[0], plain.sagittal.real[0], 1e-14, "twice the flux");
  assertNear(bright.flux, 2 * plain.flux, 1e-10, "the flux");
});

test("the convergence figure of two lattices is the largest change of the MTF, and falls as the lattice is refined", () => {
  const na = 0.1;
  const focus = { x: 0, y: 0, z: IMAGE_Z + 0.05 };
  const frequencies = [0.15, 0.35, 0.55, 0.75].map((s) => atShare(s, na));
  const estimate = (cells: number): WaveOtf =>
    available(
      waveOtf(traced({ columns: cells, rows: cells, cosines: even(cells, na), focus }), REFERENCE, frequencies),
    );
  const [coarse, middle, fine] = [estimate(24), estimate(48), estimate(96)];
  const first = gridConvergence(coarse, middle);
  let largest = 0;
  for (const cut of ["sagittal", "tangential"] as const) {
    frequencies.forEach((_frequency, index) => {
      largest = Math.max(largest, Math.abs(coarse[cut].modulus[index] - middle[cut].modulus[index]));
    });
  }
  assert.equal(first.maxAbs, largest);
  assert.equal(
    Math.abs(coarse[first.cut].modulus[first.frequency] - middle[first.cut].modulus[first.frequency]),
    largest,
  );
  const second = gridConvergence(middle, fine);
  assert.ok(second.maxAbs < first.maxAbs / 3, `${first.maxAbs} then ${second.maxAbs}`);
  assert.equal(gridConvergence(fine, fine).maxAbs, 0);
  assert.throws(
    () =>
      gridConvergence(
        coarse,
        available(waveOtf(traced({ columns: 8, rows: 8, cosines: even(8, na) }), REFERENCE, [1])),
      ),
    RangeError,
  );
});

test("what cannot be computed is an outcome with a reason, and never a number", () => {
  const [cells, na] = [10, 0.1];
  const wave: Wave = { columns: cells, rows: cells, cosines: even(cells, na), lit: inDisc(na) };
  const bundle = traced(wave);
  const first = bundle.valid ? Array.from(bundle.valid).indexOf(1) : 0;
  const withValue = (name: "weight" | "path" | "launchPath", ray: number, value: number): TracedLattice => {
    const values = Float64Array.from(bundle[name]);
    values[ray] = value;
    return { ...bundle, [name]: values };
  };

  assert.equal(refused(waveOtf(bundle, REFERENCE, [10, NaN])).reason, "bad-frequency");
  assert.equal(refused(waveOtf(bundle, { ...REFERENCE, y: Infinity }, [10])).reason, "no-reference");
  assert.equal(refused(pupilFunction(bundle, { ...REFERENCE, z: NaN })).reason, "no-reference");
  assert.equal(refused(waveOtf({ ...bundle, wavelengthMm: 0 }, REFERENCE, [10])).reason, "bad-line");
  assert.equal(refused(waveOtf({ ...bundle, imageIndex: NaN }, REFERENCE, [10])).reason, "bad-line");

  const badWeight = refused(waveOtf(withValue("weight", first + 1, -1), REFERENCE, [10]));
  assert.deepEqual([badWeight.reason, badWeight.ray], ["bad-weight", first + 1]);
  const badPath = refused(waveOtf(withValue("path", first + 2, NaN), REFERENCE, [10]));
  assert.deepEqual([badPath.reason, badPath.ray], ["bad-ray", first + 2]);
  assert.equal(refused(waveOtf(withValue("launchPath", first, Infinity), REFERENCE, [10])).reason, "bad-ray");
  const still = Float64Array.from(bundle.direction);
  still.fill(0, 3 * first, 3 * first + 3);
  assert.equal(refused(waveOtf({ ...bundle, direction: still }, REFERENCE, [10])).reason, "bad-ray");
  // A ray that is not taken may hold anything: the dark cells of this bundle hold NaN.
  assert.ok(Number.isNaN(bundle.path[0]));

  assert.equal(
    refused(waveOtf({ ...bundle, valid: new Uint8Array(cells * cells) }, REFERENCE, [10])).reason,
    "no-rays",
  );
  const noFlux = { ...bundle, weight: new Float64Array(cells * cells) };
  assert.equal(refused(waveOtf(noFlux, REFERENCE, [10])).reason, "no-flux");

  // One row of lit cells has no area; neither has a lattice whose rays all leave in one direction, and one that
  // is folded over on itself has no single pupil function.
  const row = refused(waveOtf(traced({ ...wave, lit: ({ row: at }) => at === 4 }), REFERENCE, [10]));
  assert.equal(row.reason, "degenerate-pupil");
  const diagonal = refused(waveOtf(traced({ ...wave, lit: ({ row: r, column: c }) => r === c }), REFERENCE, [10]));
  assert.equal(diagonal.reason, "degenerate-pupil");
  const collapsed = refused(waveOtf(traced({ ...wave, lit: undefined, cosines: () => [0.01, 0.02] }), REFERENCE, [10]));
  assert.equal(collapsed.reason, "degenerate-pupil");
  const folded = refused(
    waveOtf(
      traced({
        ...wave,
        lit: undefined,
        cosines: (column, row) => [0.02 * Math.abs(column - 4.5), 0.02 * (row - 4.5)],
      }),
      REFERENCE,
      [10],
    ),
  );
  assert.equal(folded.reason, "degenerate-pupil");
  assert.equal(typeof folded.ray, "number");

  // A step of 10^13 waves between two cells is no phase that is reduced.
  const far = refused(waveOtf(withValue("path", first + 1, 1e10), REFERENCE, [atShare(0.1, na)]));
  assert.equal(far.reason, "out-of-range");

  // A spectrum: no line, a weight that is none, and a line that has no answer, named.
  assert.equal(refused(polychromaticWaveOtf([], REFERENCE, [10])).reason, "no-lines");
  const weightless = refused(polychromaticWaveOtf([{ weight: 0, bundle }], REFERENCE, [10]));
  assert.deepEqual([weightless.reason, weightless.line], ["bad-line-weight", 0]);
  const missing = refused(
    polychromaticWaveOtf(
      [
        { weight: 1, bundle },
        { weight: 1, bundle: noFlux },
      ],
      REFERENCE,
      [10],
    ),
  );
  assert.deepEqual([missing.reason, missing.line], ["no-flux", 1]);
  assert.match(missing.message, /^line 1: /);
  for (const outcome of [badWeight, row, far, missing]) {
    assert.deepEqual(
      Object.keys(outcome).filter((key) => !["available", "reason", "message", "line", "ray"].includes(key)),
      [],
    );
  }

  // Arrays that are not of one bundle are an error, not an outcome.
  assert.throws(() => waveOtf({ ...bundle, path: bundle.path.subarray(1) }, REFERENCE, [10]), RangeError);
  assert.throws(() => waveOtf({ ...bundle, columns: cells + 1 }, REFERENCE, [10]), RangeError);
  assert.throws(() => waveOtf({ ...bundle, rows: 2.5 }, REFERENCE, [10]), RangeError);
  assert.throws(() => waveOtf({ ...bundle, valid: new Uint8Array(3) }, REFERENCE, [10]), RangeError);
});

test("a sliver one cell thin beside the beam is carried by the plane of best fit", () => {
  // A detached arc of rays one cell wide has no neighbour across it to say how the lattice maps there: the plane
  // through all lit cells stands in. On an even lattice that is the map itself, and the staircase is exact.
  const [cells, na] = [40, 0.1];
  const cosines = even(cells, na);
  const lit = (cell: Cell): boolean =>
    inDisc(0.6 * na)(cell) || (cell.row === 3 && cell.column > 8 && cell.column < 30);
  const litCell = (column: number, row: number): boolean => {
    const [p, q] = cosines(column, row);
    return lit({ column, row, p, q });
  };
  const shares = [0.07, 0.21, 0.43];
  const otf = available(
    waveOtf(
      traced({ columns: cells, rows: cells, cosines, lit, focus: { x: 0.001, y: 0.002, z: IMAGE_Z } }),
      REFERENCE,
      shares.map((s) => atShare(s, na)),
    ),
  );
  shares.forEach((s, index) => {
    assertNear(otf.sagittal.modulus[index], staircase(litCell, cells, s * cells, 0), 1e-11, `sagittal at ${s}`);
    assertNear(otf.tangential.modulus[index], staircase(litCell, cells, 0, s * cells), 1e-11, `tangential at ${s}`);
  });
});

test("a sheared point is found across dark cells: a disc and an annulus on a lattice that maps unevenly", () => {
  // A lattice with pupil aberration: cubic and quadratic terms a quarter of the linear one, so that where a
  // sheared point lies is several cells from where the slopes of its own cell put it, and for an annulus across a
  // hole of dark cells, of which the lattice says nothing. The map is one to one over the square (its Jacobian,
  // below, is above 0.9 there). With the flux of a cell the Jacobian itself, the pupil function is even in cosine
  // space, and the transfer function that of the aperture, in closed form.
  const [a, b, c, e] = [0.25, 0.1, 0.2, 0.15];
  const na = 0.2;
  const radius = 0.7 * na;
  const obscuration = 0.4;
  const annulusOtf = (s: number): number => {
    const shared =
      sharedArea(1, 1, 2 * s) - 2 * sharedArea(1, obscuration, 2 * s) + sharedArea(obscuration, obscuration, 2 * s);
    return shared / (Math.PI * (1 - obscuration * obscuration));
  };
  const shares = [0.05, 0.2, 0.4, 0.6, 0.8, 0.95];
  for (const cells of [64, 128]) {
    const xy = (column: number, row: number): [number, number] => [
      (column + 0.5 - cells / 2) / (cells / 2),
      (row + 0.5 - cells / 2) / (cells / 2),
    ];
    const cosines: Wave["cosines"] = (column, row) => {
      const [x, y] = xy(column, row);
      return [na * (x + a * x * (x * x + y * y) + b * y * y + c * y), na * (y + a * y * (x * x + y * y) - e * x * x)];
    };
    const flux = ({ column, row }: Cell): number => {
      const [x, y] = xy(column, row);
      const [px, py] = [1 + a * (3 * x * x + y * y), 2 * a * x * y + 2 * b * y + c];
      const [qx, qy] = [2 * a * x * y - 2 * e * x, 1 + a * (x * x + 3 * y * y)];
      return px * qy - py * qx;
    };
    for (const [name, inner, expected] of [
      ["disc", 0, discOtf],
      ["annulus", obscuration * radius, annulusOtf],
    ] as const) {
      const lit = ({ p, q }: Cell): boolean => p * p + q * q <= radius * radius && p * p + q * q >= inner * inner;
      const otf = available(
        waveOtf(
          traced({ columns: cells, rows: cells, cosines, lit, flux }),
          REFERENCE,
          shares.map((s) => atShare(s, radius)),
        ),
      );
      let worst = 0;
      shares.forEach((s, index) => {
        for (const cut of [otf.sagittal, otf.tangential]) {
          worst = Math.max(worst, Math.abs(cut.modulus[index] - expected(s)));
        }
      });
      // The rim's bound says little here, the cells being of unequal width and the aperture 30 or 60 of them
      // across. What is asked is what an even lattice of as many cells across the aperture gives
      // (3.2e-3 at 32, 1.2e-3 at 64, above): a search that ran from cell to cell and gave up among dark ones had
      // no answer at all on 64 cells and lost 0.017 of the annulus on 128.
      assert.ok(worst < (cells === 64 ? 5e-3 : 2.5e-3), `${name}, ${cells} cells: measured ${worst}`);
    }
  }
});
