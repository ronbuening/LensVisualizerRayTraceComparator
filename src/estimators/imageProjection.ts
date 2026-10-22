// The image projection: a ray behind the last surface, carried in a straight line to the image plane. It is the
// comparator's own, so that every engine whose trace ends on the last surface lands its rays by one rule, and a
// landing never differs between two engines by how each of them projects.
//
// Only IEEE 754 basic operations are used (+, -, *, / and square root, each correctly rounded), each in a fixed
// order, so equal inputs give equal bits.
import { twoProductError, twoSumError } from "../core/numeric/exact.ts";

/** A point or a direction: x sagittal, y meridional, z along the axis. */
export type Vec3 = readonly [x: number, y: number, z: number];

/**
 * How far behind its exit point the image plane may lie, mm, for the ray still to land on it. A plate whose rear
 * face is the image plane puts the exit point on the plane to within an engine's intersection tolerance, on either
 * side of it; the tolerance of an iterative intersection is of this size.
 */
export const IMAGE_PLANE_TOLERANCE_MM = 1e-9;

/** Where a ray lands on an image plane, and how far it travelled to get there. */
export interface ImageLanding {
  /** The landing point, mm: its z is the plane's z, exactly. */
  readonly point: Vec3;
  /** The length of the ray from its exit point to the plane, mm, whatever the length of its direction; never negative. */
  readonly distance: number;
}

/** The length of a vector in two doubles: `value + rest` is the length to about 1e-32 of it. */
export interface VectorLength {
  /** The length to a rounding: the square root of the sum of the squares as a double holds that sum. */
  readonly value: number;
  /** What `value` leaves out of the length: at most a rounding of it, and 0 where the root is exact. */
  readonly rest: number;
}

/**
 * The length of a vector, without the rounding that hides how far a direction is from a unit vector.
 *
 * The length of a direction that is a unit vector to a rounding is within 2e-16 of 1, and `sqrt(x^2 + y^2 + z^2)`
 * in doubles is 1 or a neighbour of 1 for it: what the length differs from 1 by is lost where the squares are
 * added. Here the three squares and their sum are carried in two doubles each, so the sum of the squares is exact
 * before it is rounded once; the root of its rounded part is corrected by what that root's square leaves of the
 * sum, `(sum - root^2) / (2 root)`, one step of Newton's method whose own remainder is the square of a rounding.
 *
 * It holds for a vector whose squares neither overflow nor vanish, a length between 1e-140 and 1e140; the length of
 * a vector that is not a number, or is zero, is none (`rest` is NaN).
 */
export function lengthOf(vector: Vec3): VectorLength {
  const [x, y, z] = vector;
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const partial = xx + yy;
  const whole = partial + zz;
  // What the two additions and the three squares rounded away, each exactly: five numbers a rounding of 1 in size
  // at most, whose own sum loses nothing that the length could show.
  const dropped =
    twoSumError(xx, yy, partial) +
    twoSumError(partial, zz, whole) +
    (twoProductError(x, x, xx) + twoProductError(y, y, yy) + twoProductError(z, z, zz));
  const root = Math.sqrt(whole);
  const square = root * root;
  // `whole - square` is the difference of two doubles a rounding apart, which is a double: nothing is lost in it.
  const left = whole - square - twoProductError(root, root, square) + dropped;
  return { value: root, rest: left / (root + root) };
}

/**
 * Carries a ray from `point`, travelling along `direction`, to the plane z = `imageZ`.
 *
 * The parameter of the line is `(imageZ - point.z) / direction.z`, one division, and the landing is
 * `point + parameter * direction` in x and y, each one multiplication and one addition: the point of the line on
 * the plane, whatever the length of `direction`. A plane that lies behind the point by no more than
 * `IMAGE_PLANE_TOLERANCE_MM` of that parameter is the plane the point is on: the distance is 0 and the landing is
 * the point itself.
 *
 * The distance is a length: the parameter times the length of `direction` (`lengthOf`), the product of the two
 * formed without rounding and rounded once. No engine is asked for a unit vector: one that never normalises a
 * direction, and one whose directions are unit vectors to rounding, are charged the stretch they travelled. For a
 * direction whose squares add up to 1 exactly the distance is the parameter itself in every bit, and so it is for
 * one within 5.5e-17 (2^-54) of a unit vector; for one that is a unit vector to a rounding, up to 2e-16 from it,
 * the distance is the parameter or a neighbour of it, a unit or two in its last place.
 *
 * Null when the ray does not arrive: it does not travel toward +z (`direction.z` is not above 0), the plane lies
 * further behind the point than the tolerance, or a component, the landing or the distance is not a finite number
 * (a direction outside the range of `lengthOf`, or a parameter of 2^996 or more, has no distance here).
 */
export function projectToImagePlane(point: Vec3, direction: Vec3, imageZ: number): ImageLanding | null {
  if (!(direction[2] > 0)) return null;
  const along = (imageZ - point[2]) / direction[2];
  if (!(along >= -IMAGE_PLANE_TOLERANCE_MM)) return null;
  const parameter = along > 0 ? along : 0;
  const x = point[0] + parameter * direction[0];
  const y = point[1] + parameter * direction[1];
  const length = lengthOf(direction);
  const product = parameter * length.value;
  const distance = product + (twoProductError(parameter, length.value, product) + parameter * length.rest);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(distance)) return null;
  return { point: [x, y, imageZ], distance };
}

/**
 * An optical path continued over a straight stretch: `opticalPath + index * distance`, one multiplication and one
 * addition. With the path to the last surface, the index of the image space and the distance of a landing, it is
 * the path to the image plane.
 */
export function continuedOpticalPath(opticalPath: number, index: number, distance: number): number {
  return opticalPath + index * distance;
}
