// The wave-optical transfer function of a bundle of rays traced on a lattice, from their optical paths: the
// comparator's own estimator, applied alike to every engine's trace of the same rays. It is Hopkins' formula, the
// autocorrelation of the pupil function,
//
//   OTF(nu) = N(lambda nu) / N(0),    N(s) = integral of conj P(c) P(c + s) over the cosines c
//
// with the pupil function P laid out over direction cosines, as the rays of a lattice sample it.
//
// The pupil coordinate. A ray that leaves the last surface in the direction (L, M, N), a unit vector, in a medium
// of index n is the plane wave of the image space whose transverse wave vector is (2 pi / lambda) (n L, n M), with
// lambda the wavelength in vacuum. The coordinate of the pupil is c = (n L, n M), the optical direction cosines at
// the image side: a pattern of nu cycles a millimetre on the image plane is the beat of two plane waves whose
// cosines differ by lambda nu, so the shear of the autocorrelation is lambda nu in these units, along x for the
// sagittal cut and along y for the tangential one, and it does not depend on where the exit pupil is or on how far
// it is from the image. The reference sphere is the one at infinity centred on the reference image point.
//
// The path. The phase of a ray's plane wave at the reference point R is 2 pi / lambda times
//
//   W = launch + path + n d . (R - Q)
//
// with `path` the optical path of the ray from its origin to any point Q of it behind the last surface, d its unit
// direction there, and `launch` the optical path from the incident wavefront to its origin (`launchPaths`): the
// path to the foot of the perpendicular dropped on the ray from R. `rays.trace` holds two such points: the exit
// point with `opticalPath`, and the image point with `opticalPathToImage`. They give the same W; the image point is
// the better conditioned one, since R - Q is then the landing error, and no cancellation is left to the sum. The
// sign is that of a path: a ray that is late has the larger W. A ray that lands at x beside the reference has
// dW/dc = -(x - x_ref), so N(s) turns as exp(-2 pi i nu (x - x_ref)) for a small shear: the convention of the
// geometric OTF (`geometricOtf.ts`), which this estimate tends to as the frequency goes to 0.
//
// Piston and tilt. Only differences of W enter, so a piston is of no account; the path of the first lit cell is
// taken off, to keep the numbers small. Moving the reference point by D adds c . D to W, a tilt that is exactly
// linear in the pupil coordinate, so it multiplies N(s) by exp(-2 pi i nu D) and leaves the modulus alone. The
// estimate has that property to a rounding, because where a sheared point lies in the lattice is found with the
// same interpolation its path is read with (below). The step from cell to cell does depend on the tilt, and with
// it the validity figure: the reference belongs amid the spot.
//
// Amplitude. A cell carries the flux w of its ray (the weight of the request: whatever the lattice's own cells
// weigh, and nothing else apodises), spread over the patch of cosine space the cell covers, of area J: the modulus
// of the pupil function is sqrt(w / J). J is the Jacobian of the map from lattice cells to cosines, by central
// differences of the cosines of the neighbouring cells; it is constant where the sine condition holds and the
// lattice is even in the entrance pupil, and not where it is not. No obliquity factor is applied: the flux of a
// ray is what it brings to the image plane.
//
// The sum. Each lit cell is one node of a midpoint rule over cosine space, of weight J, once as the lower end of a
// pair and once as the upper end:
//
//   N(s) = 1/2 sum over lit cells i of  J_i |P_i| ( |P|(c_i + s) exp(2 pi i (W(c_i + s) - W_i) / lambda)
//                                                 + |P|(c_i - s) exp(2 pi i (W_i - W(c_i - s)) / lambda) )
//
// so that N(-s) is the conjugate of N(s) in every bit, as it is of the integral. The other end of a pair, c_i + s
// or c_i - s, is no cell. The point of the lattice with those cosines is looked for in both coordinates: a row of
// the lattice is no line of constant cosine, and following rows would shear the pupil along a curve. It lies in a
// patch, the square between four neighbouring cells, and only a patch with a lit corner can give anything; those
// patches are kept by where they lie in cosine space, and the point is found in its patch by Newton's method on the
// patch's bilinear map of the cosines. The search therefore never crosses dark cells, of which the lattice says
// nothing, and a hole in the pupil or a beam cut to a crescent is found across as any other. The modulus and the
// path at the point are the bilinear interpolants of the four cells around it, the modulus with 0 for a cell that
// is not lit. The path is never wrapped: it is a length, interpolated as one.
//
// The rim. A lattice says of a cell only whether its ray arrived: there are no partial cells, and the pupil is the
// union of the lit cells, a staircase. Interpolating the modulus toward the 0 of a dark neighbour is exactly the
// overlap of whole cells: on an even lattice of uniform flux, N(s) / N(0) is the autocorrelation of the staircase
// to a rounding, at any shear. Its error against the true aperture is the staircase's: first order in the cell,
// at most 3 e / (1 - e) with e the area between staircase and aperture over the aperture's (e <= 4 sqrt(2) / n for
// a disc n cells across), and in practice far less, since the cells of a rim err to both sides. Cosines and path
// are continued one cell beyond the rim: by the straight line through the two lit cells behind it in its row or
// column, else on a diagonal, and where no line of the lattice has two, by the least-squares plane through all lit
// cells. Inside, the rule is of second order: the midpoint rule over a cell, and the interpolation of the path. On
// a lattice that is uneven in cosine space the cells of a rim are of unequal width, and a rim that follows the
// cells is of first order as well.
//
// Validity. The phase of a pair turns from one node to the next by at most twice the largest step of W between
// neighbouring cells. While that step is below a quarter wave (`QUARTER_WAVE`) the pair phase turns by less than
// half a cycle a cell and the sum samples it; above, the sum may alias, and the estimate is not to be used as an
// arbiter (`undersampled`). The largest step is reported in waves with the two rays it lies between. Two estimates
// of one bundle on lattices of different sizes are compared by `gridConvergence`.
//
// A spectrum adds its lines as the geometric estimator does: the sum over the lines of weight times N_l(lambda_l
// nu), over the sum of weight times N_l(0), every line about the same reference point.
//
// Arithmetic. Only IEEE 754 basic operations are used, in the order of the rays. The phasors of a frequency are
// added by `spotSums` of the geometric estimator, each pair as a spot at its number of cycles: its exactly reduced
// phase, its Taylor kernels and its compensated sums are used as they are. N(0) is the same sum at the shear 0, so
// a transfer function at frequency 0 is exactly 1 + 0i.
import { createExactSum } from "../core/numeric/exact.ts";
import { spotSums } from "./geometricOtf.ts";
import type { ComplexSeries, OtfCut } from "./geometricOtf.ts";

/** The step of the path between neighbouring cells, in waves, above which an estimate is no arbiter. */
export const QUARTER_WAVE = 0.25;

/**
 * A bundle traced on a lattice, at one line: the arrays of a `rays.trace` request and of an engine's answer to it,
 * as they are decoded.
 *
 * Which ray is which cell is the set's own statement (`groups.lattice` of the request): ray `row * columns +
 * column` is the cell of that row and column. Rays after the `columns * rows` cells are no cells and are not
 * looked at: the chief ray of a set follows its cells. Nothing else of the lattice is needed: not its step, and
 * not which way it lies in the pupil, since the cosines of the rays say where each cell is.
 */
export interface TracedLattice {
  readonly columns: number;
  readonly rows: number;
  /** The flux each ray stands for: the weights of the request, one a ray. */
  readonly weight: ArrayLike<number>;
  /** Which rays are taken: 0 leaves a ray out, whatever its numbers are. Without it every ray is taken. */
  readonly valid?: ArrayLike<number>;
  /** A point of each ray behind the last surface, mm, `[n, 3]` flat: `imagePoint`, or `exitPoint`. */
  readonly point: ArrayLike<number>;
  /** The direction of each ray behind the last surface, `[n, 3]` flat: `exitDirection`. Any length above 0. */
  readonly direction: ArrayLike<number>;
  /** The optical path of each ray from its origin to `point`, mm: `opticalPathToImage`, or `opticalPath`. */
  readonly path: ArrayLike<number>;
  /** The optical path from the incident wavefront to each ray's origin, mm (`launchPaths`). */
  readonly launchPath: ArrayLike<number>;
  /** The wavelength of the line in vacuum, mm. */
  readonly wavelengthMm: number;
  /** The index of the image space at the line: of the medium the directions are in. */
  readonly imageIndex: number;
}

/** The bundle of one spectral line, and what the line counts for. */
export interface SpectralLattice {
  /** The weight of the line in its spectrum; above 0. */
  readonly weight: number;
  readonly bundle: TracedLattice;
}

/** The reference image point, mm: the centre of the reference sphere. */
export interface ReferencePoint {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** Why a wave transfer function could not be computed. */
export type WaveOtfUnavailableReason =
  /** A frequency is not a finite number. */
  | "bad-frequency"
  /** The reference point is not a finite point. */
  | "no-reference"
  /** The wavelength or the index of the image space is not a finite number above 0. */
  | "bad-line"
  /** A ray that is taken has a point, a direction or a path that is not finite, or a direction of length 0. */
  | "bad-ray"
  /** A ray that is taken has a weight that is not a finite number of at least 0. */
  | "bad-weight"
  /** No cell of the lattice is taken. */
  | "no-rays"
  /** The cells taken carry no flux. */
  | "no-flux"
  /**
   * The lit cells do not map one to one onto a patch of cosine space: they lie on one line of the lattice, the map
   * or the map folds or collapses at a cell.
   */
  | "degenerate-pupil"
  /** A pair is more than 2^32 cycles of phase apart, or a sum is no finite number. */
  | "out-of-range"
  /** A spectrum has no line. */
  | "no-lines"
  /** The weight of a line is not a finite number above 0. */
  | "bad-line-weight";

/** A wave transfer function that could not be computed, and why. Nothing of it is a number. */
export interface WaveOtfUnavailable {
  readonly available: false;
  readonly reason: WaveOtfUnavailableReason;
  /** The reason in words, with the ray, the line or the frequency it is about. */
  readonly message: string;
  /** The line the reason is about, where it is about one: its index in the spectrum. */
  readonly line?: number;
  /** The ray the reason is about, where it is about one: its index in the bundle. */
  readonly ray?: number;
}

/** The largest step of the path between two neighbouring lit cells of a lattice. */
export interface PhaseStep {
  /** The step in waves of the line; 0 where no two lit cells are neighbours. */
  readonly waves: number;
  /** The two rays it lies between, the first of equal steps; -1 where there is none. */
  readonly ray: number;
  readonly neighbour: number;
  /** In a spectrum: the line whose step it is. */
  readonly line?: number;
}

/** What a lattice says of how far its estimate can be trusted. */
export interface LatticeValidity {
  /** How many cells are lit: taken, and of a weight above 0. */
  readonly cells: number;
  readonly phaseStep: PhaseStep;
  /** Whether the largest step is above a quarter wave: the estimate is then not to be used as an arbiter. */
  readonly undersampled: boolean;
}

/** The pupil function of a bundle, cell by cell, row after row: what the transfer function is the autocorrelation of. */
export interface LatticePupil extends LatticeValidity {
  readonly available: true;
  readonly columns: number;
  readonly rows: number;
  /** 1 for a lit cell. Every other array holds 0 for a cell that is not lit. */
  readonly lit: Uint8Array;
  /** The pupil coordinate of each cell: index times direction cosine along image x, and along image y. */
  readonly cosineX: Float64Array;
  readonly cosineY: Float64Array;
  /** W of each cell less W of the first lit cell, mm. */
  readonly pathMm: Float64Array;
  /** The area of cosine space a cell covers. */
  readonly area: Float64Array;
  /** The modulus of the pupil function: the square root of flux over area. */
  readonly modulus: Float64Array;
}

/** The sums of one bundle before they are divided: what a spectrum adds up line by line. */
export interface WaveOtfSums extends LatticeValidity {
  readonly available: true;
  /** N(0): the flux of the lit cells, to a rounding. */
  readonly flux: number;
  /** N(lambda nu) with the shear along image x, at each frequency. */
  readonly sagittal: ComplexSeries;
  /** N(lambda nu) with the shear along image y, at each frequency. */
  readonly tangential: ComplexSeries;
}

/** A wave transfer function at the frequencies asked, in their order. */
export interface WaveOtf extends LatticeValidity {
  readonly available: true;
  /** What the sums were divided by: N(0), or the sum over the lines of weight times N(0). */
  readonly flux: number;
  /** Frequency along image x. */
  readonly sagittal: OtfCut;
  /** Frequency along image y. */
  readonly tangential: OtfCut;
}

/** The transfer function of a spectrum: `cells` over every line, the largest step of any line, and each line's own. */
export interface PolychromaticWaveOtf extends WaveOtf {
  readonly lines: readonly (LatticeValidity & { readonly flux: number })[];
}

/** Where the object of a case is: the contract's `conditions.object`. */
export type ObjectSide = { readonly kind: "infinity" } | { readonly kind: "finite"; readonly z: number };

const FAR = 0;
const RING = 1;
const LIT = 2;

/** The most steps Newton's method takes to find a sheared point in a patch; a bilinear map needs a few. */
const MAX_SOLVE_STEPS = 32;

/** A sheared point is found when a step is below this, in cells: 2^-36. */
const SOLVE_TOLERANCE = 2 ** -36;

/** A point this far beyond a side of a patch, in cells, is on that side: 2^-30. */
const EDGE = 2 ** -30;

/** The lit cells lie on one line when the determinant of their scatter is below this share of its diagonal. */
const FLATNESS = 2 ** -40;

/** The eight neighbours of a cell, as steps in column and row. */
const NEIGHBOURS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

/** The pupil function on the lattice with one dark cell added on every side: cell (c, r) is at `r * columns + c`. */
interface Pupil {
  readonly columns: number;
  readonly rows: number;
  readonly wavelengthMm: number;
  /** `LIT`, `RING` for a dark cell beside a lit one, `FAR` for any other. */
  readonly state: Uint8Array;
  /** The cosines of a cell: a lit cell's own, a ring cell's continued. A far cell's are not read. */
  readonly p: Float64Array;
  readonly q: Float64Array;
  /** W less the datum, of lit and ring cells. */
  readonly path: Float64Array;
  /** sqrt(flux / area) of a lit cell, 0 of any other. */
  readonly modulus: Float64Array;
  /** |J| of a lit cell. */
  readonly area: Float64Array;
  /** The lit cells in the order of their rays, and the ray of each. */
  readonly lit: Int32Array;
  readonly rayOf: Int32Array;
  /** The sign of the Jacobian. */
  readonly orientation: number;
  readonly bins: PatchBins;
  readonly zeros: Float64Array;
  readonly phaseStep: PhaseStep;
}

/** The patches of a pupil by where they lie in cosine space (`locatePatches`). */
interface PatchBins {
  /** The bins along either side of the box around the patches. */
  readonly across: number;
  readonly lowP: number;
  readonly lowQ: number;
  readonly widthP: number;
  readonly widthQ: number;
  /** The patches of bin `b`, each by its first corner, are `patchOf[start[b]]` up to `patchOf[start[b + 1]]`. */
  readonly start: Int32Array;
  readonly patchOf: Int32Array;
}

function unavailable(
  reason: WaveOtfUnavailableReason,
  message: string,
  about: { line?: number; ray?: number } = {},
): WaveOtfUnavailable {
  return { available: false, reason, message, ...about };
}

/** What is wrong with the reference point or the frequencies of a request, or null. */
function requestProblem(reference: ReferencePoint, frequencies: ArrayLike<number>): WaveOtfUnavailable | null {
  for (let index = 0; index < frequencies.length; index++) {
    if (!Number.isFinite(frequencies[index])) {
      return unavailable("bad-frequency", `frequency ${index} is ${frequencies[index]}, not a finite number`);
    }
  }
  if (!Number.isFinite(reference.x) || !Number.isFinite(reference.y) || !Number.isFinite(reference.z)) {
    const point = `(${reference.x}, ${reference.y}, ${reference.z})`;
    return unavailable("no-reference", `the reference point is ${point}, not a finite point`);
  }
  return null;
}

/** The length of a vector: the square root of its squares added without rounding. */
function lengthOf(x: number, y: number, z: number): number {
  const squares = createExactSum();
  squares.add(x, x);
  squares.add(y, y);
  squares.add(z, z);
  return Math.sqrt(squares.value());
}

/**
 * The optical path from the incident wavefront to the origin of each ray, mm: what a ray's `opticalPath`, which
 * starts at 0 at its origin, lacks of the path from a common wavefront. `origins` and `directions` are those of
 * the request, `[n, 3]` flat; the medium in front of the first surface is air, as the contract has it.
 *
 * - From an object at infinity the incident wave is plane, and the path is the projection of the origin on the
 *   ray's own direction: the rays of a collimated bundle have one direction, and start wherever the set put them.
 * - From an object on the plane `z` the incident wave is a sphere about the object point, where every ray of the
 *   field crosses that plane: the path is the length of the ray from that plane to its origin. The object point
 *   itself is not needed, and no ray that the set does not hold.
 */
export function launchPaths(
  origins: ArrayLike<number>,
  directions: ArrayLike<number>,
  object: ObjectSide,
): Float64Array {
  if (origins.length !== directions.length || origins.length % 3 !== 0) {
    throw new RangeError(`launchPaths: ${origins.length} numbers of origins and ${directions.length} of directions`);
  }
  const paths = new Float64Array(origins.length / 3);
  for (let ray = 0; ray < paths.length; ray++) {
    const [dx, dy, dz] = [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]];
    const length = lengthOf(dx, dy, dz);
    if (object.kind === "finite") {
      paths[ray] = ((origins[3 * ray + 2] - object.z) / dz) * length;
      continue;
    }
    const projection = createExactSum();
    projection.add(origins[3 * ray], dx);
    projection.add(origins[3 * ray + 1], dy);
    projection.add(origins[3 * ray + 2], dz);
    paths[ray] = projection.value() / length;
  }
  return paths;
}

/** The plane of best fit of `values` over the lit cells: its value at the mean cell and its two slopes. */
function fitPlane(
  values: Float64Array,
  pupil: { columns: number; lit: Int32Array },
  mean: { column: number; row: number },
  scatter: { cc: number; cr: number; rr: number; determinant: number },
): { mean: number; byColumn: number; byRow: number } {
  const { columns, lit } = pupil;
  const total = createExactSum();
  for (const cell of lit) total.add(values[cell], 1);
  const centre = total.value() / lit.length;
  const [withColumn, withRow] = [createExactSum(), createExactSum()];
  for (const cell of lit) {
    withColumn.add((cell % columns) - mean.column, values[cell] - centre);
    withRow.add(Math.floor(cell / columns) - mean.row, values[cell] - centre);
  }
  const [sc, sr] = [withColumn.value(), withRow.value()];
  return {
    mean: centre,
    byColumn: (scatter.rr * sc - scatter.cr * sr) / scatter.determinant,
    byRow: (scatter.cc * sr - scatter.cr * sc) / scatter.determinant,
  };
}

/**
 * The pupil function of a bundle on its lattice, about `reference`: the module's note says what it is. Throws a
 * RangeError when the lattice is no lattice or the arrays are not of one number of rays that holds its cells.
 */
function buildPupil(bundle: TracedLattice, reference: ReferencePoint): Pupil | WaveOtfUnavailable {
  const { weight, valid, point, direction, path, launchPath, wavelengthMm, imageIndex } = bundle;
  const total = weight.length;
  if (!Number.isInteger(bundle.columns) || !Number.isInteger(bundle.rows) || bundle.columns < 1 || bundle.rows < 1) {
    throw new RangeError(`waveOtf: a lattice of ${bundle.columns} columns and ${bundle.rows} rows is no lattice`);
  }
  if (
    bundle.columns * bundle.rows > total ||
    point.length !== 3 * total ||
    direction.length !== 3 * total ||
    path.length !== total ||
    launchPath.length !== total ||
    (valid !== undefined && valid.length !== total)
  ) {
    throw new RangeError(
      `waveOtf: the arrays of a bundle do not hold the ${bundle.columns} x ${bundle.rows} cells of its lattice alike ` +
        `(weight ${total}, point ${point.length}, direction ${direction.length}, path ${path.length}, ` +
        `launchPath ${launchPath.length}${valid === undefined ? "" : `, valid ${valid.length}`})`,
    );
  }
  if (!Number.isFinite(wavelengthMm) || !(wavelengthMm > 0) || !Number.isFinite(imageIndex) || !(imageIndex > 0)) {
    return unavailable(
      "bad-line",
      `the wavelength is ${wavelengthMm} mm and the index of the image space ${imageIndex}: not both finite and above 0`,
    );
  }

  // The lattice with one dark cell on every side: a lit cell then has all eight neighbours.
  const columns = bundle.columns + 2;
  const rows = bundle.rows + 2;
  const state = new Uint8Array(columns * rows);
  const p = new Float64Array(columns * rows);
  const q = new Float64Array(columns * rows);
  const pathOf = new Float64Array(columns * rows);
  const flux = new Float64Array(columns * rows);
  const rayAt = new Int32Array(columns * rows).fill(-1);
  const litCells: number[] = [];
  let taken = 0;
  for (let row = 0; row < bundle.rows; row++) {
    for (let column = 0; column < bundle.columns; column++) {
      const ray = row * bundle.columns + column;
      if (valid !== undefined && !valid[ray]) continue;
      taken++;
      if (!Number.isFinite(weight[ray]) || !(weight[ray] >= 0)) {
        return unavailable("bad-weight", `ray ${ray} has the weight ${weight[ray]}, not a number of at least 0`, {
          ray,
        });
      }
      const [dx, dy, dz] = [direction[3 * ray], direction[3 * ray + 1], direction[3 * ray + 2]];
      const length = lengthOf(dx, dy, dz);
      // n d . (R - Q): the stretch from the ray's point to the foot of the perpendicular from the reference.
      const reach = createExactSum();
      reach.add(dx, reference.x - point[3 * ray]);
      reach.add(dy, reference.y - point[3 * ray + 1]);
      reach.add(dz, reference.z - point[3 * ray + 2]);
      const sum = createExactSum();
      sum.add(launchPath[ray], 1);
      sum.add(path[ray], 1);
      sum.add(imageIndex, reach.value() / length);
      const [cosineX, cosineY, w] = [(imageIndex * dx) / length, (imageIndex * dy) / length, sum.value()];
      if (!(length > 0) || !Number.isFinite(cosineX) || !Number.isFinite(cosineY) || !Number.isFinite(w)) {
        return unavailable(
          "bad-ray",
          `ray ${ray} has a point, a direction or a path that is no finite number, or a direction of length 0`,
          { ray },
        );
      }
      if (weight[ray] === 0) continue;
      const cell = (row + 1) * columns + column + 1;
      state[cell] = LIT;
      p[cell] = cosineX;
      q[cell] = cosineY;
      pathOf[cell] = w;
      flux[cell] = weight[ray];
      rayAt[cell] = ray;
      litCells.push(cell);
    }
  }
  if (taken === 0) return unavailable("no-rays", "no cell of the lattice is taken");
  if (litCells.length === 0) return unavailable("no-flux", `the ${taken} cells taken all have the weight 0`);
  const lit = Int32Array.from(litCells);
  const rayOf = lit.map((cell) => rayAt[cell]);

  // Piston: the path of the first lit cell is taken off every cell.
  const datum = pathOf[lit[0]];
  for (const cell of lit) pathOf[cell] -= datum;

  // The largest step of the path between two lit cells that are neighbours along a row or a column.
  let step = 0;
  let [stepRay, stepNeighbour] = [-1, -1];
  for (const cell of lit) {
    for (const other of [cell + 1, cell + columns]) {
      if (state[other] !== LIT) continue;
      const between = Math.abs(pathOf[other] - pathOf[cell]);
      if (between > step) [step, stepRay, stepNeighbour] = [between, rayAt[cell], rayAt[other]];
    }
  }
  const phaseStep: PhaseStep = { waves: step / wavelengthMm, ray: stepRay, neighbour: stepNeighbour };

  // The plane of best fit through the lit cells, of each cosine and of the path: what continues them where the
  // lattice itself says nothing.
  const [columnSum, rowSum] = [createExactSum(), createExactSum()];
  for (const cell of lit) {
    columnSum.add(cell % columns, 1);
    rowSum.add(Math.floor(cell / columns), 1);
  }
  const mean = { column: columnSum.value() / lit.length, row: rowSum.value() / lit.length };
  const [cc, cr, rr] = [createExactSum(), createExactSum(), createExactSum()];
  for (const cell of lit) {
    const [column, row] = [(cell % columns) - mean.column, Math.floor(cell / columns) - mean.row];
    cc.add(column, column);
    cr.add(column, row);
    rr.add(row, row);
  }
  const scatter = { cc: cc.value(), cr: cr.value(), rr: rr.value(), determinant: 0 };
  scatter.determinant = scatter.cc * scatter.rr - scatter.cr * scatter.cr;
  if (!(scatter.determinant > FLATNESS * scatter.cc * scatter.rr)) {
    return unavailable(
      "degenerate-pupil",
      `the ${lit.length} lit cells lie on one line of the lattice: a pupil without area has no autocorrelation`,
    );
  }
  const fields = [p, q, pathOf];
  const planes = fields.map((values) => fitPlane(values, { columns, lit }, mean, scatter));

  // A dark cell beside a lit one continues the lit cells: by the straight line through two lit cells behind it in
  // its row or its column; where neither has two, by the one through two on a diagonal; where no line of the
  // lattice has, by the plane of best fit from each lit neighbour. Several lines of one kind are averaged. Every
  // other dark cell is far from the pupil and is never read.
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const cell = row * columns + column;
      if (state[cell] === LIT) continue;
      const straight = [0, 0, 0];
      const slanted = [0, 0, 0];
      const planar = [0, 0, 0];
      let [near, inLine, onDiagonal] = [0, 0, 0];
      for (const [byColumn, byRow] of NEIGHBOURS) {
        const [c1, r1] = [column + byColumn, row + byRow];
        if (c1 < 0 || c1 >= columns || r1 < 0 || r1 >= rows) continue;
        const first = r1 * columns + c1;
        if (state[first] !== LIT) continue;
        near++;
        fields.forEach((values, field) => {
          planar[field] += values[first] - (planes[field].byColumn * byColumn + planes[field].byRow * byRow);
        });
        const [c2, r2] = [c1 + byColumn, r1 + byRow];
        if (c2 < 0 || c2 >= columns || r2 < 0 || r2 >= rows) continue;
        const second = r2 * columns + c2;
        if (state[second] !== LIT) continue;
        const along = byColumn === 0 || byRow === 0 ? straight : slanted;
        if (along === straight) inLine++;
        else onDiagonal++;
        fields.forEach((values, field) => {
          along[field] += 2 * values[first] - values[second];
        });
      }
      if (near === 0) {
        state[cell] = FAR;
        continue;
      }
      state[cell] = RING;
      fields.forEach((values, field) => {
        if (inLine > 0) values[cell] = straight[field] / inLine;
        else if (onDiagonal > 0) values[cell] = slanted[field] / onDiagonal;
        else values[cell] = planar[field] / near;
      });
    }
  }

  // The Jacobian of the map from cells to cosines at each lit cell, by central differences, and with it the area a
  // cell covers and the modulus of the pupil function.
  const area = new Float64Array(columns * rows);
  const modulus = new Float64Array(columns * rows);
  let orientation = 0;
  for (const [index, cell] of lit.entries()) {
    const pc = (p[cell + 1] - p[cell - 1]) / 2;
    const pr = (p[cell + columns] - p[cell - columns]) / 2;
    const qc = (q[cell + 1] - q[cell - 1]) / 2;
    const qr = (q[cell + columns] - q[cell - columns]) / 2;
    const jacobian = pc * qr - pr * qc;
    if (orientation === 0) orientation = jacobian > 0 ? 1 : -1;
    area[cell] = Math.abs(jacobian);
    modulus[cell] = Math.sqrt(flux[cell] / area[cell]);
    if (!(jacobian * orientation > 0) || !Number.isFinite(modulus[cell])) {
      const ray = rayOf[index];
      return unavailable(
        "degenerate-pupil",
        `at ray ${ray} the lattice folds or collapses in cosine space: a cell there covers the area ${jacobian}, ` +
          `against ${orientation > 0 ? "a positive" : "a negative"} one at the first lit cell`,
        { ray },
      );
    }
  }
  return {
    columns,
    rows,
    wavelengthMm,
    state,
    p,
    q,
    path: pathOf,
    modulus,
    area,
    lit,
    rayOf,
    orientation,
    bins: locatePatches(columns, rows, state, p, q),
    zeros: new Float64Array(2 * lit.length),
    phaseStep,
  };
}

/** What a search for a sheared point gave: a point among the cells, or none within the pupil. */
const POINT = 1;
const OUTSIDE = 0;

/**
 * Where the patches of a pupil lie in cosine space: an even grid of bins over the box around them, and for each bin
 * the patches whose own box reaches into it, in the order of the lattice. A patch is the square between four
 * neighbouring cells of which at least one is lit; the others are then lit or of the ring, so every corner has
 * cosines the lattice itself states or continues, and no cell far from the lit ones is ever read.
 */
function locatePatches(columns: number, rows: number, state: Uint8Array, p: Float64Array, q: Float64Array): PatchBins {
  const patches: number[] = [];
  let [lowP, highP, lowQ, highQ] = [Infinity, -Infinity, Infinity, -Infinity];
  for (let row = 0; row < rows - 1; row++) {
    for (let column = 0; column < columns - 1; column++) {
      const corner = row * columns + column;
      const corners = [corner, corner + 1, corner + columns, corner + columns + 1];
      if (!corners.some((each) => state[each] === LIT)) continue;
      patches.push(corner);
      for (const each of corners) {
        lowP = Math.min(lowP, p[each]);
        highP = Math.max(highP, p[each]);
        lowQ = Math.min(lowQ, q[each]);
        highQ = Math.max(highQ, q[each]);
      }
    }
  }
  // About one patch a bin. The lit cells cover an area, so neither side of the box is 0.
  const across = Math.max(1, Math.floor(Math.sqrt(patches.length)));
  const bins = { across, lowP, lowQ, widthP: (highP - lowP) / across, widthQ: (highQ - lowQ) / across };
  const reach = (corner: number): [number, number, number, number] => {
    const corners = [corner, corner + 1, corner + columns, corner + columns + 1];
    return [
      binOf(Math.min(...corners.map((each) => p[each])), bins.lowP, bins.widthP, across),
      binOf(Math.max(...corners.map((each) => p[each])), bins.lowP, bins.widthP, across),
      binOf(Math.min(...corners.map((each) => q[each])), bins.lowQ, bins.widthQ, across),
      binOf(Math.max(...corners.map((each) => q[each])), bins.lowQ, bins.widthQ, across),
    ];
  };
  const start = new Int32Array(across * across + 1);
  for (const corner of patches) {
    const [p0, p1, q0, q1] = reach(corner);
    for (let binQ = q0; binQ <= q1; binQ++) for (let binP = p0; binP <= p1; binP++) start[binQ * across + binP + 1]++;
  }
  for (let bin = 0; bin < across * across; bin++) start[bin + 1] += start[bin];
  const filled = Int32Array.from(start.subarray(0, across * across));
  const patchOf = new Int32Array(start[across * across]);
  for (const corner of patches) {
    const [p0, p1, q0, q1] = reach(corner);
    for (let binQ = q0; binQ <= q1; binQ++) {
      for (let binP = p0; binP <= p1; binP++) patchOf[filled[binQ * across + binP]++] = corner;
    }
  }
  return { ...bins, start, patchOf };
}

/** The bin of a value along one side of the box; the far edge of the box is in the last bin. */
function binOf(value: number, low: number, width: number, across: number): number {
  return Math.min(Math.max(Math.floor((value - low) / width), 0), across - 1);
}

/**
 * The point of the lattice whose cosines are those of the lit cell `index` moved by (`shearX`, `shearY`): its
 * modulus and its path, the bilinear interpolants there, into `found`. The patches whose box holds those cosines
 * are tried in the order of the lattice, each by Newton's method on its own bilinear map from its middle, and the
 * first that holds the point gives it. `OUTSIDE` when none does, or the modulus there is 0.
 */
function shearedPoint(pupil: Pupil, index: number, shearX: number, shearY: number, found: Float64Array): number {
  const { columns, p, q, path, modulus, orientation, bins } = pupil;
  const cell = pupil.lit[index];
  const targetP = p[cell] + shearX;
  const targetQ = q[cell] + shearY;
  const [inP, inQ] = [(targetP - bins.lowP) / bins.widthP, (targetQ - bins.lowQ) / bins.widthQ];
  if (!(inP >= 0 && inP <= bins.across && inQ >= 0 && inQ <= bins.across)) return OUTSIDE;
  const bin =
    binOf(targetQ, bins.lowQ, bins.widthQ, bins.across) * bins.across +
    binOf(targetP, bins.lowP, bins.widthP, bins.across);
  for (let at = bins.start[bin]; at < bins.start[bin + 1]; at++) {
    const corner = bins.patchOf[at];
    const [p00, p10, p01, p11] = [p[corner], p[corner + 1], p[corner + columns], p[corner + columns + 1]];
    const [q00, q10, q01, q11] = [q[corner], q[corner + 1], q[corner + columns], q[corner + columns + 1]];
    if (
      targetP < Math.min(p00, p10, p01, p11) ||
      targetP > Math.max(p00, p10, p01, p11) ||
      targetQ < Math.min(q00, q10, q01, q11) ||
      targetQ > Math.max(q00, q10, q01, q11)
    ) {
      continue;
    }
    const [pTwist, qTwist] = [p11 - p01 - (p10 - p00), q11 - q01 - (q10 - q00)];
    let [fu, fv] = [0.5, 0.5];
    let settled = false;
    for (let step = 0; step < MAX_SOLVE_STEPS && !settled; step++) {
      const [pu, pv] = [p10 - p00 + fv * pTwist, p01 - p00 + fu * pTwist];
      const [qu, qv] = [q10 - q00 + fv * qTwist, q01 - q00 + fu * qTwist];
      const missP = targetP - (p00 + fu * (p10 - p00) + fv * (p01 - p00 + fu * pTwist));
      const missQ = targetQ - (q00 + fu * (q10 - q00) + fv * (q01 - q00 + fu * qTwist));
      const determinant = pu * qv - pv * qu;
      // A patch of the rim that its continued cells fold, or a search that has left the patch: not this one.
      if (!(determinant * orientation > 0) || !(Math.abs(fu - 0.5) <= 2 && Math.abs(fv - 0.5) <= 2)) break;
      const du = (qv * missP - pv * missQ) / determinant;
      const dv = (pu * missQ - qu * missP) / determinant;
      fu += du;
      fv += dv;
      settled = Math.abs(du) <= SOLVE_TOLERANCE && Math.abs(dv) <= SOLVE_TOLERANCE;
    }
    if (!settled || !(fu >= -EDGE && fu <= 1 + EDGE && fv >= -EDGE && fv <= 1 + EDGE)) continue;
    fu = Math.min(Math.max(fu, 0), 1);
    fv = Math.min(Math.max(fv, 0), 1);
    const shares = [(1 - fu) * (1 - fv), fu * (1 - fv), (1 - fu) * fv, fu * fv];
    let [other, otherPath] = [0, 0];
    [corner, corner + 1, corner + columns, corner + columns + 1].forEach((each, share) => {
      other += modulus[each] * shares[share];
      otherPath += path[each] * shares[share];
    });
    if (!(other > 0)) return OUTSIDE;
    found[0] = other;
    found[1] = otherPath;
    return POINT;
  }
  return OUTSIDE;
}

/**
 * N(s) of a pupil at the shear (`shearX`, `shearY`) in cosines: the sum over the lit cells of the module's note,
 * each cell once as the lower and once as the upper end of a pair. Unavailable when a pair's phase is beyond what
 * is reduced (`out-of-range`).
 */
function pairSum(
  pupil: Pupil,
  shearX: number,
  shearY: number,
): { readonly real: number; readonly imaginary: number } | WaveOtfUnavailable {
  const { path, modulus, area, lit, wavelengthMm } = pupil;
  const count = lit.length;
  const weights = new Float64Array(2 * count);
  const cycles = new Float64Array(2 * count);
  const found = new Float64Array(2);
  for (let index = 0; index < count; index++) {
    const cell = lit[index];
    for (const sign of [1, -1]) {
      const outcome = shearedPoint(pupil, index, sign * shearX, sign * shearY, found);
      if (outcome === OUTSIDE) continue;
      // The cell as the lower end of its pair, and as the upper end: the latter is the conjugate of the pair
      // sheared the other way.
      const slot = sign > 0 ? index : count + index;
      weights[slot] = area[cell] * modulus[cell] * found[0];
      cycles[slot] = (sign * (found[1] - path[cell])) / wavelengthMm;
    }
  }
  // The pairs as spots at their cycles, at the frequency -1: the sum of weight exp(2 pi i cycles), with the phase
  // of each reduced exactly and the sum compensated. Every pair is in it twice, and halving is exact.
  const sums = spotSums({ x: cycles, y: pupil.zeros, weight: weights }, { x: 0, y: 0 }, [-1]);
  if (sums.available) return { real: sums.sagittal.real[0] / 2, imaginary: sums.sagittal.imaginary[0] / 2 };
  // No pair overlaps: beyond the cut-off the autocorrelation is 0.
  if (sums.reason === "no-flux" || sums.reason === "no-rays") return { real: 0, imaginary: 0 };
  const ray = sums.ray === undefined ? undefined : pupil.rayOf[sums.ray % count];
  return unavailable(
    "out-of-range",
    `at the shear (${shearX}, ${shearY}) the pair of ${ray === undefined ? "a ray" : `ray ${ray}`} is more than ` +
      "2^32 cycles of phase apart, or a sum is no finite number",
    ray === undefined ? {} : { ray },
  );
}

function validityOf(pupil: Pupil): LatticeValidity {
  return {
    cells: pupil.lit.length,
    phaseStep: pupil.phaseStep,
    undersampled: pupil.phaseStep.waves > QUARTER_WAVE,
  };
}

/**
 * The pupil function of a bundle about `reference`, cell by cell: cosines, path, area and modulus as the module's
 * note defines them, and the validity of the lattice. It is what `waveOtf` autocorrelates, given for a look at it.
 *
 * Unavailable, with the first cause in this order: a reference that is no finite point (`no-reference`); a
 * wavelength or an index that is not finite and above 0 (`bad-line`); the first cell taken whose weight is not a
 * finite number of at least 0 (`bad-weight`) or whose point, direction or path is not finite (`bad-ray`), with its
 * ray; no cell taken (`no-rays`); cells that all weigh 0 (`no-flux`); lit cells on one line of the lattice, or a
 * cell at which the map to cosines folds (`degenerate-pupil`).
 *
 * Throws a RangeError when the lattice is no lattice or the arrays do not hold its cells alike.
 */
export function pupilFunction(bundle: TracedLattice, reference: ReferencePoint): LatticePupil | WaveOtfUnavailable {
  const problem = requestProblem(reference, []);
  if (problem !== null) return problem;
  const pupil = buildPupil(bundle, reference);
  if ("available" in pupil) return pupil;
  const { columns, rows } = bundle;
  const cells = columns * rows;
  const view = {
    lit: new Uint8Array(cells),
    cosineX: new Float64Array(cells),
    cosineY: new Float64Array(cells),
    pathMm: new Float64Array(cells),
    area: new Float64Array(cells),
    modulus: new Float64Array(cells),
  };
  for (const [index, cell] of pupil.lit.entries()) {
    const ray = pupil.rayOf[index];
    view.lit[ray] = 1;
    view.cosineX[ray] = pupil.p[cell];
    view.cosineY[ray] = pupil.q[cell];
    view.pathMm[ray] = pupil.path[cell];
    view.area[ray] = pupil.area[cell];
    view.modulus[ray] = pupil.modulus[cell];
  }
  return { available: true, columns, rows, ...view, ...validityOf(pupil) };
}

/** The outcome `out-of-range` when the flux or a sum is no finite number, naming the first frequency; else null. */
function outOfRange(
  flux: number,
  sagittal: ComplexSeries,
  tangential: ComplexSeries,
  frequencies: ArrayLike<number>,
): WaveOtfUnavailable | null {
  if (!Number.isFinite(flux) || !(flux > 0)) return unavailable("out-of-range", `the flux of the lit cells is ${flux}`);
  for (let index = 0; index < frequencies.length; index++) {
    const values = [
      sagittal.real[index],
      sagittal.imaginary[index],
      tangential.real[index],
      tangential.imaginary[index],
    ];
    if (!values.every(Number.isFinite)) {
      return unavailable(
        "out-of-range",
        `at frequency ${index} (${frequencies[index]} cycles/mm) a sum is no finite number`,
      );
    }
  }
  return null;
}

function emptySeries(count: number): ComplexSeries {
  return { real: new Float64Array(count), imaginary: new Float64Array(count) };
}

/**
 * The autocorrelation of one bundle's pupil function about `reference`, at each of `frequencies` (cycles a
 * millimetre), before it is divided: N(0), and N(lambda nu) with the shear along image x and along image y. The
 * module's note states what it is the sum of.
 *
 * Unavailable as `pupilFunction` is, after a frequency that is not finite (`bad-frequency`); and, at the first
 * frequency that has one, with the first ray whose pair is more than 2^32 cycles of phase apart
 * (`out-of-range`). Throws as `pupilFunction` does.
 */
export function waveOtfSums(
  bundle: TracedLattice,
  reference: ReferencePoint,
  frequencies: ArrayLike<number>,
): WaveOtfSums | WaveOtfUnavailable {
  const problem = requestProblem(reference, frequencies);
  if (problem !== null) return problem;
  const pupil = buildPupil(bundle, reference);
  if ("available" in pupil) return pupil;
  const whole = pairSum(pupil, 0, 0);
  if ("available" in whole) return whole;
  const sagittal = emptySeries(frequencies.length);
  const tangential = emptySeries(frequencies.length);
  for (let index = 0; index < frequencies.length; index++) {
    const shear = pupil.wavelengthMm * frequencies[index];
    const [alongX, alongY] = [pairSum(pupil, shear, 0), pairSum(pupil, 0, shear)];
    if ("available" in alongX) return alongX;
    if ("available" in alongY) return alongY;
    sagittal.real[index] = alongX.real;
    sagittal.imaginary[index] = alongX.imaginary;
    tangential.real[index] = alongY.real;
    tangential.imaginary[index] = alongY.imaginary;
  }
  return (
    outOfRange(whole.real, sagittal, tangential, frequencies) ?? {
      available: true,
      flux: whole.real,
      sagittal,
      tangential,
      ...validityOf(pupil),
    }
  );
}

/** A cut of a transfer function: the sums of a cut over `flux`, and the modulus of each quotient. */
function cutOf(sums: ComplexSeries, flux: number): OtfCut {
  const count = sums.real.length;
  const cut = { real: new Float64Array(count), imaginary: new Float64Array(count), modulus: new Float64Array(count) };
  for (let index = 0; index < count; index++) {
    const real = sums.real[index] / flux;
    const imaginary = sums.imaginary[index] / flux;
    cut.real[index] = real;
    cut.imaginary[index] = imaginary;
    cut.modulus[index] = Math.sqrt(real * real + imaginary * imaginary);
  }
  return cut;
}

/**
 * The wave transfer function of one bundle about `reference`, at each of `frequencies` (cycles a millimetre): the
 * sums of `waveOtfSums` over N(0). `sagittal` is the cut along image x and `tangential` the cut along image y; the
 * modulus of each value is the MTF. At frequency 0 a value is exactly 1 + 0i, and beyond the cut-off of the lit
 * cells exactly 0. `phaseStep` and `undersampled` say whether the lattice samples the wavefront.
 *
 * Unavailable as `waveOtfSums` is, and it throws as `waveOtfSums` does.
 */
export function waveOtf(
  bundle: TracedLattice,
  reference: ReferencePoint,
  frequencies: ArrayLike<number>,
): WaveOtf | WaveOtfUnavailable {
  const sums = waveOtfSums(bundle, reference, frequencies);
  if (!sums.available) return sums;
  const { cells, phaseStep, undersampled, flux } = sums;
  return {
    available: true,
    flux,
    sagittal: cutOf(sums.sagittal, flux),
    tangential: cutOf(sums.tangential, flux),
    cells,
    phaseStep,
    undersampled,
  };
}

/**
 * The wave transfer function of a spectrum: the lines add up as complex numbers before any modulus is taken.
 *
 *   OTF(nu) = sum over lines of W_l N_l(lambda_l nu) / sum over lines of W_l N_l(0)
 *
 * with W_l the weight of a line and N_l the autocorrelation of its own pupil function (`waveOtfSums`), whose N_l(0)
 * is the flux of its lit cells, every line about the same `reference`. A line shears its pupil by its own
 * wavelength, lateral colour stays in the phases and lowers the modulus, and a line whose rays carry less flux
 * counts for less. The transfer function of one line of weight 1 is `waveOtf` of its bundle in every bit.
 *
 * `phaseStep` is the largest step of any line, in that line's waves, with the line; `undersampled` says whether
 * any line is; `lines` holds each line's own.
 *
 * Every line must have an answer of its own. Unavailable, with the first cause in this order: no line at all
 * (`no-lines`); a frequency or a reference that is not finite; then, for the first line in order that has one, a
 * weight that is not a finite number above 0 (`bad-line-weight`) or whatever makes the line's own sums
 * unavailable, each with the index of the line; a sum over the lines that is no finite number (`out-of-range`).
 *
 * Throws as `waveOtfSums` does.
 */
export function polychromaticWaveOtf(
  lines: readonly SpectralLattice[],
  reference: ReferencePoint,
  frequencies: ArrayLike<number>,
): PolychromaticWaveOtf | WaveOtfUnavailable {
  if (lines.length === 0) return unavailable("no-lines", "the spectrum has no line");
  const problem = requestProblem(reference, frequencies);
  if (problem !== null) return problem;

  const count = frequencies.length;
  const flux = createExactSum();
  const sums = Array.from({ length: 4 * count }, createExactSum);
  const perLine: (LatticeValidity & { flux: number })[] = [];
  let worst: PhaseStep = { waves: 0, ray: -1, neighbour: -1 };
  for (const [line, { weight, bundle }] of lines.entries()) {
    if (!Number.isFinite(weight) || !(weight > 0)) {
      const message = `line ${line} has the weight ${weight}, not a finite number above 0`;
      return unavailable("bad-line-weight", message, { line });
    }
    const own = waveOtfSums(bundle, reference, frequencies);
    if (!own.available) return { ...own, message: `line ${line}: ${own.message}`, line };
    const { cells, phaseStep, undersampled } = own;
    perLine.push({ cells, phaseStep, undersampled, flux: own.flux });
    if (line === 0 || phaseStep.waves > worst.waves) worst = { ...phaseStep, line };
    flux.add(weight, own.flux);
    for (let index = 0; index < count; index++) {
      sums[4 * index].add(weight, own.sagittal.real[index]);
      sums[4 * index + 1].add(weight, own.sagittal.imaginary[index]);
      sums[4 * index + 2].add(weight, own.tangential.real[index]);
      sums[4 * index + 3].add(weight, own.tangential.imaginary[index]);
    }
  }
  const sagittal = emptySeries(count);
  const tangential = emptySeries(count);
  for (let index = 0; index < count; index++) {
    sagittal.real[index] = sums[4 * index].value();
    sagittal.imaginary[index] = sums[4 * index + 1].value();
    tangential.real[index] = sums[4 * index + 2].value();
    tangential.imaginary[index] = sums[4 * index + 3].value();
  }
  const total = flux.value();
  return (
    outOfRange(total, sagittal, tangential, frequencies) ?? {
      available: true,
      flux: total,
      sagittal: cutOf(sagittal, total),
      tangential: cutOf(tangential, total),
      cells: perLine.reduce((cells, line) => cells + line.cells, 0),
      phaseStep: worst,
      undersampled: perLine.some((line) => line.undersampled),
      lines: perLine,
    }
  );
}

/** How far two estimates of one bundle are apart: the largest difference of their MTFs, and where it is. */
export interface GridConvergence {
  /** The largest difference of the two moduli, over both cuts and every frequency. */
  readonly maxAbs: number;
  readonly cut: "sagittal" | "tangential";
  /** The index of the frequency it occurs at, the first on a tie. */
  readonly frequency: number;
}

/**
 * The convergence figure of two estimates of the same bundle at the same frequencies, on lattices of different
 * sizes, as one of n cells across and one of 2n: the largest difference of the two MTFs. The moduli are compared,
 * so the two need not be about one reference point. Throws a RangeError when the two are not of as many
 * frequencies, or of none.
 */
export function gridConvergence(
  coarse: Pick<WaveOtf, "sagittal" | "tangential">,
  fine: Pick<WaveOtf, "sagittal" | "tangential">,
): GridConvergence {
  let worst: GridConvergence | undefined;
  for (const cut of ["sagittal", "tangential"] as const) {
    const [a, b] = [coarse[cut].modulus, fine[cut].modulus];
    if (a.length !== b.length || a.length === 0) {
      throw new RangeError(`gridConvergence: the ${cut} cuts are of ${a.length} and ${b.length} frequencies`);
    }
    for (let frequency = 0; frequency < a.length; frequency++) {
      const maxAbs = Math.abs(a[frequency] - b[frequency]);
      if (worst === undefined || maxAbs > worst.maxAbs) worst = { maxAbs, cut, frequency };
    }
  }
  return worst as GridConvergence;
}
