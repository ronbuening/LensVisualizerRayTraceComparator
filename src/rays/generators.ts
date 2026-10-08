// Ray generators that need nothing but numbers: lattices of rays laid on a plane in front of a lens. They know no
// engine and no case, so a set they make is the same set whoever asks for it. Frame and signs are the contract's:
// light travels toward +z, and a positive field angle is an object toward +y, whose rays travel toward -y.
//
// A set is laid out row by row: the rows ascend in y, and within a row the columns ascend in x.

/** A point or a direction: x sagittal, y meridional, z along the axis. */
export type Vec3 = readonly [x: number, y: number, z: number];

/** Rays as flat arrays: `origins` and `directions` hold x, y, z of each ray in turn, `weights` one number each. */
export interface RayBundle {
  readonly origins: Float64Array;
  readonly directions: Float64Array;
  readonly weights: Float64Array;
}

/** A bundle whose rays are the cells of a lattice, row by row. */
export interface LatticeBundle extends RayBundle {
  readonly columns: number;
  readonly rows: number;
  /** The side of a cell on the plane the lattice is laid on, mm. */
  readonly step: number;
}

/** Where a lattice lies. */
export interface LatticePlacement {
  /** The number of cells across the lattice, in x and in y; at least 1. See `cellCount`. */
  readonly cells: number;
  /** Half the side of the square the lattice covers, mm; above 0. */
  readonly halfWidth: number;
  /** The z of the plane the lattice is laid on, mm. */
  readonly planeZ: number;
  /** The centre of the lattice on that plane, mm; the axis unless given. */
  readonly center?: readonly [x: number, y: number];
  /**
   * True to keep an odd number of cells, whose middle row and middle column pass through the centre of the
   * lattice: with the centre on the axis, those rays lie in the meridional plane, in the sagittal plane and, one of
   * them, on the axis itself.
   */
  readonly throughCenter?: boolean;
}

/**
 * The number of cells a lattice has across for a request of `cells`: an even number, the next one up from an odd
 * request, so that no cell centre lies on a line through the centre of the lattice. A ray on the axis or in a plane
 * of symmetry meets a surface where its formulas degenerate, and is a poor sample of a pupil; `throughCenter` keeps
 * an odd request as it is, for whoever wants exactly those rays. Throws unless `cells` is an integer of at least 1.
 */
export function cellCount(cells: number, throughCenter = false): number {
  if (!Number.isInteger(cells) || cells < 1) throw new Error(`rays: a lattice needs at least 1 cell, got ${cells}`);
  return throughCenter || cells % 2 === 0 ? cells : cells + 1;
}

/**
 * The cell centres of a lattice along one axis: `count` of them over the span from `-halfWidth` to `halfWidth`,
 * ascending. Each is `(i + 0.5 - count / 2) * step` with `step = 2 * halfWidth / count`, so the centres are placed
 * symmetrically to the last bit: the i-th from one end is the negative of the i-th from the other.
 */
export function cellCentres(count: number, halfWidth: number): { centres: number[]; step: number } {
  if (!(halfWidth > 0) || !Number.isFinite(halfWidth)) {
    throw new Error(`rays: a lattice needs a half width above 0, got ${halfWidth}`);
  }
  const step = (2 * halfWidth) / count;
  return { centres: Array.from({ length: count }, (_unused, index) => (index + 0.5 - count / 2) * step), step };
}

/** A number with -0 written as 0, as every array made here has it. */
function plain(value: number): number {
  return value + 0;
}

/**
 * The unit direction of a collimated bundle from a field at `fieldAngleDeg`: (0, -sin, cos) of the angle. The
 * angle lies between -90 and 90 degrees, so the z component is above 0.
 */
export function fieldDirection(fieldAngleDeg: number): Vec3 {
  if (!(Math.abs(fieldAngleDeg) < 90)) {
    throw new Error(`rays: a field angle lies between -90 and 90 degrees, got ${fieldAngleDeg}`);
  }
  const angle = (fieldAngleDeg * Math.PI) / 180;
  return [0, plain(-Math.sin(angle)), Math.cos(angle)];
}

/** The points of a lattice on its plane, row by row. */
function latticePoints(placement: LatticePlacement): { points: [x: number, y: number][]; count: number; step: number } {
  const count = cellCount(placement.cells, placement.throughCenter);
  const { centres, step } = cellCentres(count, placement.halfWidth);
  const [centerX, centerY] = placement.center ?? [0, 0];
  const points = centres.flatMap((y) => centres.map((x): [number, number] => [centerX + x, centerY + y]));
  return { points, count, step };
}

/** A collimated lattice: where it lies, where it comes from and where its rays start. */
export interface CollimatedGridOptions extends LatticePlacement {
  /** The field angle in degrees, between -90 and 90. */
  readonly fieldAngleDeg: number;
  /** The z of the plane the rays start on, mm: in front of `planeZ`. */
  readonly launchZ: number;
}

/**
 * A collimated square lattice of rays from a field at infinity: every ray has the direction of the field
 * (`fieldDirection`), and the rays cross the plane `planeZ` at the cell centres of the lattice. Each starts where
 * its line meets the plane `launchZ`, which lies in front of `planeZ`. Every weight is 1: equal cells of a plane
 * across a collimated beam carry equal flux.
 */
export function collimatedGrid(options: CollimatedGridOptions): LatticeBundle {
  const { planeZ, launchZ } = options;
  if (!(launchZ < planeZ)) throw new Error(`rays: the launch plane ${launchZ} is not in front of the plane ${planeZ}`);
  const direction = fieldDirection(options.fieldAngleDeg);
  const { points, count, step } = latticePoints(options);
  // Back along the ray from the lattice plane to the launch plane: the ray's y changes by -slope times the way.
  const rise = ((planeZ - launchZ) * -direction[1]) / direction[2];
  const origins = new Float64Array(points.length * 3);
  const directions = new Float64Array(points.length * 3);
  points.forEach(([x, y], ray) => {
    origins.set([plain(x), plain(y + rise), launchZ], 3 * ray);
    directions.set(direction, 3 * ray);
  });
  return { origins, directions, weights: new Float64Array(points.length).fill(1), columns: count, rows: count, step };
}

/** A diverging lattice: where it lies and the point its rays come from. */
export interface DivergingGridOptions extends LatticePlacement {
  /** The object point, mm: in front of `planeZ`. Every ray starts there. */
  readonly objectPoint: Vec3;
}

/**
 * A diverging square lattice of rays from one object point: every ray starts at the point and is aimed at a cell
 * centre of the lattice on the plane `planeZ`. Its weight is the solid angle its cell subtends at the point,
 * relative to a cell straight ahead of the point: `(D / d)^3`, with D the distance of the point from the plane and
 * d its distance from the cell centre. So the weights are the flux of an isotropic point source through equal
 * cells, and none is above 1.
 */
export function divergingGrid(options: DivergingGridOptions): LatticeBundle {
  const { objectPoint, planeZ } = options;
  const depth = planeZ - objectPoint[2];
  if (!(depth > 0)) throw new Error(`rays: the object point at z ${objectPoint[2]} is not in front of ${planeZ}`);
  const { points, count, step } = latticePoints(options);
  const origins = new Float64Array(points.length * 3);
  const directions = new Float64Array(points.length * 3);
  const weights = new Float64Array(points.length);
  points.forEach(([x, y], ray) => {
    const [dx, dy] = [x - objectPoint[0], y - objectPoint[1]];
    const distance = Math.sqrt(dx * dx + dy * dy + depth * depth);
    origins.set(objectPoint, 3 * ray);
    directions.set([plain(dx / distance), plain(dy / distance), depth / distance], 3 * ray);
    const ratio = depth / distance;
    weights[ray] = ratio * ratio * ratio;
  });
  return { origins, directions, weights, columns: count, rows: count, step };
}

/** A collimated fan: the line it lies on, where it comes from and where its rays start. */
export interface CollimatedFanOptions extends CollimatedGridOptions {
  /** The axis the fan is spread along: "x" for a sagittal fan, "y" for a meridional one. */
  readonly axis: "x" | "y";
}

/**
 * A collimated fan of rays from a field at infinity: the rays cross the plane `planeZ` on one line through the
 * centre of the placement, along x or along y, at the cell centres of a lattice of one row. A fan lies in a plane
 * through the centre by what it is; no ray of it passes through the centre itself unless `throughCenter` keeps an
 * odd number of cells. The rays ascend along the axis, and every weight is 1.
 */
export function collimatedFan(options: CollimatedFanOptions): RayBundle {
  const { planeZ, launchZ, axis } = options;
  if (!(launchZ < planeZ)) throw new Error(`rays: the launch plane ${launchZ} is not in front of the plane ${planeZ}`);
  const direction = fieldDirection(options.fieldAngleDeg);
  const count = cellCount(options.cells, options.throughCenter);
  const { centres } = cellCentres(count, options.halfWidth);
  const [centerX, centerY] = options.center ?? [0, 0];
  const rise = ((planeZ - launchZ) * -direction[1]) / direction[2];
  const origins = new Float64Array(count * 3);
  const directions = new Float64Array(count * 3);
  centres.forEach((offset, ray) => {
    const [x, y] = axis === "x" ? [centerX + offset, centerY] : [centerX, centerY + offset];
    origins.set([plain(x), plain(y + rise), launchZ], 3 * ray);
    directions.set(direction, 3 * ray);
  });
  return { origins, directions, weights: new Float64Array(count).fill(1) };
}
