// How much of a field's light a system lets through, and how bright the field's image is, from a trace of rays: the
// comparator's own estimator, applied alike to every engine's trace of the same rays.
//
// The flux of a block of rays. A ray stands for the flux of its weight in the request: what its share of the pupil
// carries, its bulk transmission included where the case source states it. The flux of a block is the sum of the
// weights of the rays taken, compensated (`createExactSum`), in the order of the rays; how many rays are taken beside
// it. LensVisualizer's vignetting tab counts its beam so: the cells of a field that pass every aperture, and their
// transmitted intensity.
//
// The area of a lattice on its launch plane. A lattice's cells are squares of side `step` on the plane its rays are
// launched from, a plane of constant z in front of the system, every ray of a collimated field along one direction: a
// cell whose ray is taken lets the beam through the cell's area there. The transmitted area of a field is the number
// of cells taken times the square of the step, the square carried in two doubles and the product rounded once: the
// two-dimensional counterpart of the tab's fraction of a fixed meridional chord.
//
// The flux into the image. The irradiance a field's beam puts on the image plane of an object at infinity is, by the
// invariance of the radiance along a ray, the radiance of the object times the transmitted area of the beam in the
// optical direction cosines of the image space, n' (L, M), over which its rays converge on the image point:
// `E = L n'^2 integral of tau dL dM`, the projected solid angle of the exit pupil seen from the image point, each part
// weighted by the transmission `tau` of the rays through it. No law of the field angle is assumed (no cos^4): the
// obliquity of the beam on either side, the size and place of the stop's image at each field and the mapping of the
// object onto the image all come from the traced directions. The area a cell of the lattice covers in cosine space is
// the Jacobian of the map from cells to cosines (`pupilFunction` of src/estimators/waveOtf.ts, by central differences
// of the neighbouring cells' cosines, the rim continued one cell, a lit cell being one taken and of a weight above 0),
// and the flux into the image is the sum over the lit cells of weight times area, compensated. The area does not
// depend on the path: `pupilFunction` forms a cell's path, `n' d . (R - Q)` added to the paths it is handed, apart
// from its cosines and area, so the paths handed over are 0 and the reference the origin, and what it makes of them is
// not read. The area's error is of second order in the cell inside and where the lattice's own rim bounds the beam,
// and of first order where an aperture cuts the cells (a staircase). The central differences telescope along a row
// and a column, so the area of a beam is of its rim, as the area of any region is: a cell's direction inside the rim
// enters the sum to second order only.
//
// What it cannot compute is an outcome with a reason, never a NaN: no ray taken (`no-rays`), a weight that is no
// finite number of at least 0 (`bad-weight`), a flux of 0 (`no-flux`), and for the flux into the image those of
// `pupilFunction` (`bad-line`, `bad-ray`, `degenerate-pupil`).
//
// Arithmetic. Only IEEE 754 basic operations, in the order of the rays, so equal input gives equal bits.
import { createExactSum, twoProductError } from "../core/numeric/exact.ts";
import { pupilFunction } from "./waveOtf.ts";

/** Why a flux could not be computed. */
export type IlluminationUnavailableReason =
  /** No ray of the block, or no cell of the lattice, is taken. */
  | "no-rays"
  /** A ray that is taken has a weight that is not a finite number of at least 0. */
  | "bad-weight"
  /** The rays taken carry no flux. */
  | "no-flux"
  /** The index of the image space is not a finite number above 0. */
  | "bad-line"
  /** A cell that is taken has a point or a direction that is not finite, or a direction of length 0. */
  | "bad-ray"
  /** The lit cells do not map one to one onto a patch of cosine space: they lie on one line, or the map folds. */
  | "degenerate-pupil";

/** A flux that could not be computed, and why. Nothing of it is a number. */
export interface IlluminationUnavailable {
  readonly available: false;
  readonly reason: IlluminationUnavailableReason;
  /** The reason in words, with the ray it is about. */
  readonly message: string;
  /** The ray the reason is about, where it is about one. */
  readonly ray?: number;
}

/** The flux of a block of rays. */
export interface BlockFlux {
  readonly available: true;
  /** How many rays of the block are taken. */
  readonly rays: number;
  /** The sum of their weights, rounded once. */
  readonly flux: number;
}

/** A lattice of a field traced at one line: the request's arrays and the engine's, decoded, and which rays are taken. */
export interface IlluminationLattice {
  readonly columns: number;
  readonly rows: number;
  /** The side of a cell on the launch plane, mm. */
  readonly step: number;
  /** The weights of the request, one a ray; the cells are the first `columns * rows`, row by row. */
  readonly weight: ArrayLike<number>;
  /** Which rays are taken: 1 for a ray taken. */
  readonly valid: ArrayLike<number>;
  /** A point of each ray behind the last surface, `[n, 3]` flat: `imagePoint`. Only its being finite is read. */
  readonly point: ArrayLike<number>;
  /** The direction of each ray behind the last surface, `[n, 3]` flat: `exitDirection`. Any length above 0. */
  readonly direction: ArrayLike<number>;
  /** The index of the image space at the line. */
  readonly imageIndex: number;
}

/** The area of a lattice's taken cells on its launch plane, mm^2, and how many there are. */
export interface LaunchArea {
  readonly available: true;
  readonly cells: number;
  readonly areaMm2: number;
}

/** The flux of a lattice's lit cells into the image: weight times area in optical direction cosines, summed. */
export interface CosineFlux {
  readonly available: true;
  /** How many cells are lit. */
  readonly cells: number;
  readonly flux: number;
}

function unavailable(reason: IlluminationUnavailableReason, message: string, ray?: number): IlluminationUnavailable {
  return { available: false, reason, message, ...(ray === undefined ? {} : { ray }) };
}

/**
 * The flux of the rays `first` up to `end` that `valid` takes: the sum of their weights, compensated, rounded once.
 * Unavailable without a ray taken (`no-rays`), or at the first one whose weight is no finite number of at least 0
 * (`bad-weight`). A flux of 0 is a value: a sweep whose every ray is stopped transmits nothing.
 */
export function blockFlux(
  weights: ArrayLike<number>,
  valid: ArrayLike<number>,
  first: number,
  end: number,
): BlockFlux | IlluminationUnavailable {
  const sum = createExactSum();
  let rays = 0;
  for (let ray = first; ray < end; ray++) {
    if (!valid[ray]) continue;
    if (!Number.isFinite(weights[ray]) || !(weights[ray] >= 0)) {
      return unavailable("bad-weight", `ray ${ray} has the weight ${weights[ray]}, not a number of at least 0`, ray);
    }
    sum.add(weights[ray], 1);
    rays++;
  }
  if (rays === 0) return unavailable("no-rays", `no ray from ${first} to ${end - 1} is taken`);
  return { available: true, rays, flux: sum.value() };
}

/**
 * The area of the cells of a lattice that `valid` takes, on its launch plane: their number times the square of the
 * step, the square carried in two doubles and the whole rounded once. Unavailable without a cell taken (`no-rays`).
 */
export function launchArea(
  lattice: Pick<IlluminationLattice, "columns" | "rows" | "step" | "valid">,
): LaunchArea | IlluminationUnavailable {
  const { columns, rows, step, valid } = lattice;
  let cells = 0;
  for (let ray = 0; ray < columns * rows; ray++) if (valid[ray]) cells++;
  if (cells === 0) return unavailable("no-rays", "no cell of the lattice is taken");
  const square = step * step;
  const area = createExactSum();
  area.add(cells, square);
  area.add(cells, twoProductError(step, step, square));
  return { available: true, cells, areaMm2: area.value() };
}

/**
 * The flux of a lattice's lit cells into the image, the module's note says how: the sum over the cells taken and of a
 * weight above 0 of weight times the area the cell covers in optical direction cosines of the image space,
 * compensated. Unavailable as the note says. Throws a RangeError when the lattice is no lattice or its arrays do not
 * hold its cells alike, as `pupilFunction` does.
 */
export function cosineFlux(lattice: IlluminationLattice): CosineFlux | IlluminationUnavailable {
  const { columns, rows, weight, valid, point, direction, imageIndex } = lattice;
  const rays = weight.length;
  const zero = new Float64Array(rays);
  const pupil = pupilFunction(
    {
      columns,
      rows,
      weight,
      valid,
      point,
      direction,
      path: zero,
      launchPath: zero,
      wavelengthMm: 1,
      imageIndex,
    },
    { x: 0, y: 0, z: 0 },
  );
  if (!pupil.available) {
    if (pupil.reason === "bad-line") {
      return unavailable("bad-line", `the index of the image space is ${imageIndex}: not a finite number above 0`);
    }
    if (pupil.reason === "bad-ray" || pupil.reason === "bad-weight" || pupil.reason === "degenerate-pupil") {
      return unavailable(pupil.reason, pupil.message, pupil.ray);
    }
    if (pupil.reason === "no-rays" || pupil.reason === "no-flux") return unavailable(pupil.reason, pupil.message);
    // Paths of 0 and a reference at the origin leave no other reason.
    throw new Error(`cosineFlux: the pupil function has no estimate: ${pupil.reason}: ${pupil.message}`);
  }
  const flux = createExactSum();
  for (let ray = 0; ray < columns * rows; ray++) if (pupil.lit[ray]) flux.add(weight[ray], pupil.area[ray]);
  return { available: true, cells: pupil.cells, flux: flux.value() };
}
