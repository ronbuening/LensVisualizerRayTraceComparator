// The image projection: a ray behind the last surface, carried in a straight line to the image plane. It is the
// comparator's own, so that every engine whose trace ends on the last surface lands its rays by one rule, and a
// landing never differs between two engines by how each of them projects.
//
// Only IEEE 754 basic operations are used, each once and in a fixed order, so equal inputs give equal bits.

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
  /** The length of the ray from its exit point to the plane, mm; never negative. */
  readonly distance: number;
}

/**
 * Carries a ray from `point`, travelling along the unit vector `direction`, to the plane z = `imageZ`.
 *
 * The distance along the ray is `(imageZ - point.z) / direction.z`, one division, and the landing is
 * `point + distance * direction` in x and y, each one multiplication and one addition. A plane that lies behind the
 * point by no more than `IMAGE_PLANE_TOLERANCE_MM` along the ray is the plane the point is on: the distance is 0
 * and the landing is the point itself.
 *
 * Null when the ray does not arrive: it does not travel toward +z (`direction.z` is not above 0), the plane lies
 * further behind the point than the tolerance, or a component is not a number.
 */
export function projectToImagePlane(point: Vec3, direction: Vec3, imageZ: number): ImageLanding | null {
  if (!(direction[2] > 0)) return null;
  const along = (imageZ - point[2]) / direction[2];
  if (!(along >= -IMAGE_PLANE_TOLERANCE_MM)) return null;
  const distance = along > 0 ? along : 0;
  const x = point[0] + distance * direction[0];
  const y = point[1] + distance * direction[1];
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
