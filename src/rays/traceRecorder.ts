// The answer to a `rays.trace` request while it is written, ray by ray. Every engine of the comparator fills the
// same arrays by the same rules: NaN from the surface where a ray ended, and one landing on the image plane, by
// the comparator's own projection, for every engine whose trace ends on the last surface.
import { NO_END_SURFACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceData } from "../contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../core/numeric/ndarray.ts";
import { continuedOpticalPath, projectToImagePlane } from "../estimators/imageProjection.ts";
import type { Vec3 } from "../estimators/imageProjection.ts";

/** How many rays of an answer ended in each way. A type alias, so that it is also a map of counts by name. */
export type TraceCounts = {
  readonly rays: number;
  readonly ok: number;
  readonly blocked: number;
  readonly failed: number;
};

/** The arrays of one `rays.trace` answer, filled ray by ray. Each ray is ended exactly once. */
export interface TraceRecorder {
  /** Writes the hit of a ray on a surface it passed. */
  hit(ray: number, surface: number, point: Vec3): void;
  /** Ends a ray at the surface it did not pass, as "blocked" or "failed". Its hits before that surface stay. */
  stop(ray: number, status: "blocked" | "failed", endSurface: number): void;
  /**
   * Ends a ray that passed every surface: it left the last one at `exitPoint` along the unit vector
   * `exitDirection`, with the optical path `opticalPath` behind it, into a medium of index `imageIndex`. It is
   * landed on the image plane (`projectToImagePlane`), and its path continued over the landing's distance
   * (`continuedOpticalPath`): status ok. A ray that does not reach the plane is blocked, with the number of
   * surfaces as its end surface, and keeps its exit point, exit direction and optical path. Returns how it ended.
   */
  exit(ray: number, exitPoint: Vec3, exitDirection: Vec3, opticalPath: number, imageIndex: number): "ok" | "blocked";
  /** The answer as data of the quantity, and how many rays ended in each way. */
  finish(): { readonly data: RaysTraceData; readonly counts: TraceCounts };
}

/**
 * A recorder for `rays` rays through `surfaces` surfaces, with the image plane at z = `imageZ`. Every value is NaN
 * until it is written, so a ray that ended has NaN from its end surface on without anything being cleared.
 */
export function createTraceRecorder(rays: number, surfaces: number, imageZ: number): TraceRecorder {
  const status = new Uint8Array(rays);
  const endSurface = new Int32Array(rays);
  const hits = new Float64Array(surfaces * rays * 3).fill(NaN);
  const exitPoint = new Float64Array(rays * 3).fill(NaN);
  const exitDirection = new Float64Array(rays * 3).fill(NaN);
  const imagePoint = new Float64Array(rays * 3).fill(NaN);
  const opticalPath = new Float64Array(rays).fill(NaN);
  const opticalPathToImage = new Float64Array(rays).fill(NaN);
  const counts = { rays, ok: 0, blocked: 0, failed: 0 };
  const stop = (ray: number, name: "blocked" | "failed", end: number): void => {
    status[ray] = RAY_STATUS[name];
    endSurface[ray] = end;
    counts[name]++;
  };
  return {
    hit: (ray, surface, point) => hits.set(point, (surface * rays + ray) * 3),
    stop,
    exit: (ray, point, direction, path, imageIndex) => {
      exitPoint.set(point, 3 * ray);
      exitDirection.set(direction, 3 * ray);
      opticalPath[ray] = path;
      const landing = projectToImagePlane(point, direction, imageZ);
      if (landing === null) {
        stop(ray, "blocked", surfaces);
        return "blocked";
      }
      status[ray] = RAY_STATUS.ok;
      endSurface[ray] = NO_END_SURFACE;
      imagePoint.set(landing.point, 3 * ray);
      opticalPathToImage[ray] = continuedOpticalPath(path, imageIndex, landing.distance);
      counts.ok++;
      return "ok";
    },
    finish: () => ({
      data: {
        status: encodeNdArray(status),
        endSurface: encodeNdArray(endSurface),
        hits: encodeNdArray(hits, [surfaces, rays, 3]),
        exitPoint: encodeNdArray(exitPoint, [rays, 3]),
        exitDirection: encodeNdArray(exitDirection, [rays, 3]),
        imagePoint: encodeNdArray(imagePoint, [rays, 3]),
        opticalPath: encodeNdArray(opticalPath),
        opticalPathToImage: encodeNdArray(opticalPathToImage),
      },
      counts: { ...counts },
    }),
  };
}
