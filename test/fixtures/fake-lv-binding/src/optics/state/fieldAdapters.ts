// The fake's chief-ray solve and chief-ray image heights, under LV's names. Its "solved" chief ray crosses the first
// vertex plane a thousandth higher than LV's paraxial estimate for every degree of field beyond the first (below one
// degree it is the estimate, as LV's is); a field beyond `field.vectorBeyondDeg` is "launched from a bounding sphere".
import { projectionLaunchSlopeForField } from "../projection.js";
import { meridionalTrace } from "../trace/chiefTrace.js";
import { computeAnalysisFieldGeometryAtState, prepareRuntimeState } from "./runtime.js";
import type { FakeRuntimeLens } from "../types.js";

type Geometry = { epRatio: number; halfFieldDeg: number };

function geometryOf(L: FakeRuntimeLens, focusT: number, zoomT: number, geometry?: unknown): Geometry {
  return (geometry ?? computeAnalysisFieldGeometryAtState(focusT, zoomT, L)) as Geometry;
}

export function solveChiefRayForRuntimeLens(
  fieldAngleDeg: number,
  focusT: number,
  zoomT: number,
  L: FakeRuntimeLens,
  geometry?: unknown,
  _aberrationT = 0,
) {
  const launch = projectionLaunchSlopeForField(L, fieldAngleDeg);
  if (launch.status === "out-of-domain") {
    return { yLaunch: NaN, uField: NaN, status: "out-of-domain", iterations: 0, launchSurface: "object-plane" };
  }
  const paraxial = -geometryOf(L, focusT, zoomT, geometry).epRatio * launch.uField;
  const vectorBeyond = L.source.field?.vectorBeyondDeg;
  if (vectorBeyond !== undefined && Math.abs(fieldAngleDeg) > vectorBeyond) {
    const vectorLaunch = { origin: [0, 0, -10], direction: [0, 0, 1], launchBoundT: 1 };
    return { yLaunch: paraxial, uField: launch.uField, status: "converged", iterations: 0, launchSurface: "bounding-sphere", vectorLaunch };
  }
  if (Math.abs(fieldAngleDeg) < 1) {
    return { yLaunch: paraxial, uField: launch.uField, status: "converged", iterations: 0, launchSurface: "object-plane" };
  }
  const yLaunch = paraxial * (1 + (Math.abs(fieldAngleDeg) - 1) / 1000);
  return { yLaunch, uField: launch.uField, status: "converged", iterations: 1, launchSurface: "object-plane" };
}

/** The image height of the paraxially launched chief ray: LV's `y + u d` of its last gap. */
export function chiefRayImageHeightForRuntimeLens(
  fieldAngleDeg: number,
  _zPos: number[],
  focusT: number,
  zoomT: number,
  L: FakeRuntimeLens,
  geometry?: unknown,
  aberrationT = 0,
): number {
  const state = prepareRuntimeState(L, focusT, zoomT, aberrationT);
  const uField = projectionLaunchSlopeForField(L, fieldAngleDeg).uField;
  const trace = meridionalTrace(state, -geometryOf(L, focusT, zoomT, geometry).epRatio * uField, uField);
  return trace.y + trace.u * state.surfaces[state.surfaces.length - 1].d;
}

/** The image height of the solved chief ray; NaN for a field launched from a bounding sphere. */
export function chiefRayImageHeightAccurateForRuntimeLens(
  fieldAngleDeg: number,
  _zPos: number[],
  focusT: number,
  zoomT: number,
  L: FakeRuntimeLens,
  geometry?: unknown,
  aberrationT = 0,
): number {
  const state = prepareRuntimeState(L, focusT, zoomT, aberrationT);
  const launch = projectionLaunchSlopeForField(L, fieldAngleDeg);
  const solve = solveChiefRayForRuntimeLens(fieldAngleDeg, focusT, zoomT, L, geometry, aberrationT);
  if ("vectorLaunch" in solve) return NaN;
  const trace = meridionalTrace(state, solve.yLaunch, launch.uField);
  return trace.y + trace.u * state.surfaces[state.surfaces.length - 1].d;
}
