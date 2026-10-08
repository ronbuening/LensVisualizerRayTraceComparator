// The paraxial kernel of the reference engine: ray-transfer matrices on (height, reduced angle), the cardinal
// points they give, and the pupils as the paraxial images of the stop.
//
// A paraxial ray is the pair (y, w): its height and its angle times the index of the medium it is in, w = n u.
// A surface of power P = (n' - n) c takes (y, w) to (y, w - P y); a gap t in a medium of index n takes it to
// (y + (t / n) w, w). Both have determinant 1, and so has every product of them. The medium in front of the first
// surface is air, as the contract has it.
import type { FirstOrderValue } from "../../contract/quantities/paraxialFirstOrder.ts";
import type { SurfaceProfile } from "./surface.ts";

/** The index of the medium in front of the first surface: the object space is air. */
export const OBJECT_SPACE_INDEX = 1;

/**
 * How small a system's power may be, against the sum of the magnitudes of its surfaces' powers, before the system
 * counts as afocal. The power of a telescope is a sum that cancels, so what is left of it is rounding of this
 * order; a system with a real power this small would have a focal length beyond 1e12 times its surfaces' own.
 */
export const AFOCAL_RELATIVE_POWER = 1e-12;

/** A ray-transfer matrix: y' = a y + b w and w' = c y + d w. */
export interface RayMatrix {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
}

const IDENTITY: RayMatrix = { a: 1, b: 0, c: 0, d: 1 };

/** `matrix` followed by a surface of the given power. */
function refracted(matrix: RayMatrix, power: number): RayMatrix {
  return { a: matrix.a, b: matrix.b, c: matrix.c - power * matrix.a, d: matrix.d - power * matrix.b };
}

/** `matrix` followed by a gap of the given reduced length, t / n. */
function transferred(matrix: RayMatrix, reducedGap: number): RayMatrix {
  return { a: matrix.a + reducedGap * matrix.c, b: matrix.b + reducedGap * matrix.d, c: matrix.c, d: matrix.d };
}

/** One surface as the kernel reads it. */
export interface ParaxialSurface {
  /** Vertex position, mm. */
  readonly z: number;
  /** The curvature of the surface at its vertex, 1/mm. */
  readonly curvature: number;
  /** The index of the medium that follows the surface. */
  readonly indexAfter: number;
}

/**
 * The curvature of a profile at its vertex, which is all a paraxial ray sees of it: the base curvature c, plus
 * twice the coefficient of a term of power 2, since a r^2 is the sag of a surface of curvature 2 a near the axis.
 * A term of power 3 or more is flat to second order and adds nothing; the conic constant enters only at the fourth
 * order. Null for a profile with a term of power 1: a cone has a corner at its vertex and no curvature there.
 */
export function vertexCurvature(profile: SurfaceProfile): number | null {
  let curvature = profile.curvature;
  for (const { power, coeff } of profile.terms) {
    if (power === 1) return null;
    if (power === 2) curvature += 2 * coeff;
  }
  return curvature;
}

/** The matrices of a system, each from one vertex plane to another. */
export interface SystemMatrices {
  /** From in front of the first surface to behind the last one. */
  readonly total: RayMatrix;
  /** From in front of the first surface to the stop surface, without the stop surface's own refraction. */
  readonly front: RayMatrix;
  /** From the stop surface, behind its own refraction, to behind the last surface. */
  readonly rear: RayMatrix;
  /** The sum of the magnitudes of the surfaces' powers, 1/mm: what a power that is rounding is small against. */
  readonly powerScale: number;
}

/**
 * The matrices of `surfaces` (never empty) around the stop at `stopIndex`. With the stop on the first surface the
 * front matrix is the identity, and with the stop on the last surface the rear one is. The stop surface's own
 * refraction is in neither: it bends a ray without moving it, so it changes no image of the stop.
 */
export function systemMatrices(surfaces: readonly ParaxialSurface[], stopIndex: number): SystemMatrices {
  let total = IDENTITY;
  let front = IDENTITY;
  let rear = IDENTITY;
  let powerScale = 0;
  let indexBefore = OBJECT_SPACE_INDEX;
  surfaces.forEach((surface, index) => {
    if (index === stopIndex) front = total;
    const power = (surface.indexAfter - indexBefore) * surface.curvature;
    powerScale += Math.abs(power);
    total = refracted(total, power);
    if (index > stopIndex) rear = refracted(rear, power);
    if (index + 1 < surfaces.length) {
      const reducedGap = (surfaces[index + 1].z - surface.z) / surface.indexAfter;
      total = transferred(total, reducedGap);
      if (index >= stopIndex) rear = transferred(rear, reducedGap);
    }
    indexBefore = surface.indexAfter;
  });
  return { total, front, rear, powerScale };
}

/** What the kernel is asked about: a system at one line. */
export interface FirstOrderInput {
  /** The surfaces in the order light meets them, with the indices of the line; never empty. */
  readonly surfaces: readonly ParaxialSurface[];
  readonly stopIndex: number;
  /** The stop's radius, mm. */
  readonly stopSemiDiameter: number;
  /** The index of the rear lens vertex, from which the back focus is measured. */
  readonly lastLensSurfaceIndex: number;
  /** The object plane, mm; null for an object at infinity. */
  readonly objectZ: number | null;
}

/** The first-order data of a system at one line; null where the system is afocal. */
export interface FirstOrderOutput {
  /** The compared values, in mm; positions are z in the contract frame. */
  readonly values: Readonly<Record<FirstOrderValue, number>>;
  /** The paraxial lateral magnification of the object plane; null for an object at infinity. */
  readonly magnification: number | null;
}

/**
 * The first-order data of a system at one line, or null when the system is afocal there (`AFOCAL_RELATIVE_POWER`).
 *
 * With the total matrix (a, b, c, d) between the first vertex z1 and the last vertex zk, n = 1 in front and n'
 * behind, the power is -c, and:
 *
 * - a ray that enters parallel to the axis at height 1 leaves at height a with the angle c / n', so it crosses
 *   the axis at `rearFocalZ` = zk - n' a / c and, produced backwards, is at height 1 at `rearPrincipalZ` =
 *   zk + n' (1 - a) / c; `efl` is their difference, -n' / c;
 * - a ray that leaves parallel to the axis came through `frontFocalZ` = z1 + n d / c and, produced forwards, is
 *   at the height it leaves with at `frontPrincipalZ` = z1 + n (d - 1) / c;
 * - `backFocus` is `rearFocalZ` minus the vertex of the last lens surface;
 * - the entrance pupil is the plane of the object space from which every ray reaches one point of the stop: with
 *   the front matrix, z1 + n b / a, where the stop appears 1 / |a| times its size;
 * - the exit pupil is the plane of the image space in which every ray from one point of the stop meets again: with
 *   the rear matrix, zk - n' b / d, where the stop appears 1 / |d| times its size.
 *
 * A pupil of a telecentric system is at infinity, and its position and radius are then the infinities the
 * divisions give. The magnification of an object plane a distance s in front of the first vertex is
 * 1 / (d + c s / n).
 */
export function firstOrder(input: FirstOrderInput): FirstOrderOutput | null {
  const { surfaces, stopSemiDiameter } = input;
  const { total, front, rear, powerScale } = systemMatrices(surfaces, input.stopIndex);
  if (Math.abs(total.c) <= AFOCAL_RELATIVE_POWER * powerScale) return null;

  const first = surfaces[0].z;
  const last = surfaces[surfaces.length - 1].z;
  const imageIndex = surfaces[surfaces.length - 1].indexAfter;
  const rearFocalZ = last - (imageIndex * total.a) / total.c;
  const values: Record<FirstOrderValue, number> = {
    efl: -imageIndex / total.c,
    frontFocalZ: first + (OBJECT_SPACE_INDEX * total.d) / total.c,
    rearFocalZ,
    frontPrincipalZ: first + (OBJECT_SPACE_INDEX * (total.d - 1)) / total.c,
    rearPrincipalZ: last + (imageIndex * (1 - total.a)) / total.c,
    backFocus: rearFocalZ - surfaces[input.lastLensSurfaceIndex].z,
    entrancePupilZ: first + (OBJECT_SPACE_INDEX * front.b) / front.a,
    exitPupilZ: last - (imageIndex * rear.b) / rear.d,
    entrancePupilSemiDiameter: stopSemiDiameter / Math.abs(front.a),
    exitPupilSemiDiameter: stopSemiDiameter / Math.abs(rear.d),
  };
  const magnification =
    input.objectZ === null ? null : 1 / (total.d + (total.c * (first - input.objectZ)) / OBJECT_SPACE_INDEX);
  return { values, magnification };
}
