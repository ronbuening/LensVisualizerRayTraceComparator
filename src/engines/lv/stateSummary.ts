import { syntheticKind } from "./binding.ts";
import { LV_FLAT_RADIUS } from "./exportShape.ts";
import type { LvPreparedState } from "./types.ts";

/** One surface of a prepared state, as `lvrtc lenses show` prints it. Lengths are in mm. */
export interface SurfaceSummary {
  readonly index: number;
  readonly label: string;
  /** Radius of curvature, or null for a plane. */
  readonly R: number | null;
  /** The gap after the surface at this focus and zoom. */
  readonly d: number;
  /** The index after the surface at the lens's reference line. */
  readonly nd: number;
  /** The clear semi-diameter; on the stop surface, the runtime stop radius. */
  readonly sd: number;
  readonly z: number;
  readonly asphere: boolean;
  /** "rearPlate" for a surface LV added, else null. */
  readonly synthetic: string | null;
}

/** A prepared state in the numbers that say what is traced. */
export interface StateSummary {
  readonly focusT: number;
  readonly zoomT: number;
  readonly surfaceCount: number;
  readonly stopIndex: number;
  /** The stop radius of this zoom position, wide open: the prepared stop surface's `sd`. */
  readonly stopRadius: number;
  readonly lastLensSurfaceIndex: number;
  readonly imgZ: number;
  readonly surfaces: readonly SurfaceSummary[];
}

/**
 * Summarizes a prepared state. Everything is read from the state itself: the stop radius is the stop surface's
 * `sd`, never an authored value, and the positions are those of the state's focus and zoom.
 */
export function summarizeState(state: LvPreparedState): StateSummary {
  const stopIndex = state.lens.stop.surfaceIndex;
  return {
    focusT: state.focusT,
    zoomT: state.zoomT,
    surfaceCount: state.surfaces.length,
    stopIndex,
    stopRadius: state.surfaces[stopIndex].sd,
    lastLensSurfaceIndex: state.lens.runtime.lastLensSurfaceIdx,
    imgZ: state.imgZ,
    surfaces: state.surfaces.map((surface, index) => ({
      index,
      label: surface.label,
      R: Math.abs(surface.R) > LV_FLAT_RADIUS ? null : surface.R,
      d: surface.d,
      nd: surface.nd,
      sd: surface.sd,
      z: surface.z,
      asphere: surface.asphere !== null && surface.asphere !== undefined,
      synthetic: syntheticKind(surface),
    })),
  };
}
