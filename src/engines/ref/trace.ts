// The reference engine's sequential ray tracer: one ray, carried surface by surface through the model of a case,
// as the contract defines a trace (contract/CONTRACT.md, `rays.trace`). It is written from the optics alone:
// analytic geometry and Snell's law, and nothing of any other tracer.
import type { RayStatusName } from "../../contract/quantities/raysTrace.ts";
import type { Vec3 } from "../../estimators/imageProjection.ts";
import { createExactSum } from "./exact.ts";
import { intersectSurface } from "./intersect.ts";
import type { RefSystem } from "./model.ts";
import { OBJECT_SPACE_INDEX } from "./paraxial.ts";
import { refract } from "./refract.ts";
import { unitNormalAt } from "./surface.ts";

/** One ray carried through the surfaces of a model. */
export interface SurfaceTrace {
  /**
   * How the ray ended at the surfaces: "ok" when it passed every one of them. Whether it then reaches the image
   * plane is not decided here.
   */
  readonly status: RayStatusName;
  /** The index of the surface the ray did not pass; the number of surfaces for a ray that passed them all. */
  readonly endSurface: number;
  /** The hit on each surface the ray passed, in order: `endSurface` of them. */
  readonly hits: readonly Vec3[];
  /** The unit direction of the ray behind the last surface it passed; the direction it was given before the first. */
  readonly direction: Vec3;
  /**
   * The sum of index times length over the stretches of the ray from its origin to its last hit, mm. A stretch
   * that runs backwards, to a surface behind the one before it, counts with its sign.
   */
  readonly opticalPath: number;
}

/**
 * Carries a ray from `origin` along `direction` through the surfaces of a model, with `indexAfter` the index of
 * the medium that follows each surface at one line. The medium in front of the first surface is air.
 *
 * At each surface, in the order of the model:
 *
 * 1. the ray's line is met with the surface (`intersectSurface`): within the clear aperture, whose limits are
 *    inclusive, and wherever on the line that is. A surface that lies behind the last hit, as where two
 *    neighbouring surfaces cross inside their clear apertures, is met by a step backwards, as a sequential trace
 *    defines it. A ray that does not meet the surface within its clear aperture is "blocked" there; one whose
 *    crossing could not be decided is "failed". A ray that no longer travels toward +z, as one that a steep
 *    surface has bent past the perpendicular to the axis, goes to no further surface: it is "blocked" at the next
 *    one, and its line is not met with it, since the point where the line crosses that surface lies behind the ray;
 * 2. the stretch to the hit is added to the optical path: the index of the medium the ray is in, times the step
 *    along the line, times the length of the direction, which is 1 to rounding behind a refraction and whatever
 *    the ray was given with before the first;
 * 3. the ray is bent by Snell's law (`refract`) at the surface's normal, which is taken from the slope at the hit
 *    (`unitNormalAt`). A ray that is totally reflected is "blocked" at that surface; where the surface has no
 *    normal, as at the apex of a cone, the ray is "failed".
 *
 * The optical path is a sum of products that can cancel, where a stretch runs backwards; it is kept as a
 * compensated sum (`createExactSum`): the rounding error of every product and of every addition is added up beside
 * the sum and joins it at the end, so the path is the exact sum of the stretches as computed, rounded once.
 *
 * A ray that ends at a surface has a hit on every surface before it and none on that one.
 */
export function traceSurfaces(
  system: RefSystem,
  indexAfter: ArrayLike<number>,
  origin: Vec3,
  direction: Vec3,
): SurfaceTrace {
  const hits: Vec3[] = [];
  const path = createExactSum();
  let [px, py, pz] = origin;
  let heading = direction;
  let index = OBJECT_SPACE_INDEX;
  const ended = (status: RayStatusName, endSurface: number): SurfaceTrace => ({
    status,
    endSurface,
    hits,
    direction: heading,
    opticalPath: path.value(),
  });
  for (let at = 0; at < system.surfaces.length; at++) {
    const surface = system.surfaces[at];
    const [dx, dy, dz] = heading;
    if (!(dz > 0)) return ended("blocked", at);
    const met = intersectSurface(surface, px, py, pz, dx, dy, dz);
    if (met.kind !== "hit") return ended(met.kind === "miss" ? "blocked" : "failed", at);
    const normal = unitNormalAt(surface.profile, met.x, met.y, met.root);
    if (!Number.isFinite(normal[0]) || !Number.isFinite(normal[1]) || !Number.isFinite(normal[2])) {
      return ended("failed", at);
    }
    const bent = refract(heading, normal, index, indexAfter[at]);
    if (bent === null) return ended("blocked", at);

    path.add(index, met.t * Math.sqrt(dx * dx + dy * dy + dz * dz));
    hits.push([met.x, met.y, met.z]);
    [px, py, pz] = [met.x, met.y, met.z];
    heading = bent;
    index = indexAfter[at];
  }
  return ended("ok", system.surfaces.length);
}
