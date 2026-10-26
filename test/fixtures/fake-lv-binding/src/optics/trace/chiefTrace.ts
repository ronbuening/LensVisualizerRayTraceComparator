// The fake's meridional and skew launches of a chief ray, with LV's rules (`bindRayTrace`): where a ray of a height
// and slopes on the first vertex plane starts, `rayLead` ahead of it, along which unit direction, and how its trace is
// read (the height carried to the vertex plane of the surface it ended on, the slope as LV's runtime result takes it).
import { directionFromMeridionalSlope, directionFromSkewSlope } from "../math/vector.js";
import { traceSequential } from "./sequentialTrace.js";
import { projectCoordinateToZ } from "./utils.js";
import { fakeChannelIndex } from "../analysis/axial.js";
import type { FakeState, Vec3 } from "../types.js";

/** The options of a chief ray's trace: LV's, at the authored indices or a chromatic channel's. */
function optionsOf(stopSD: number | undefined, channel: string | undefined) {
  return {
    checkSemiDiameter: true,
    stopSemiDiameter: stopSD,
    stopOnClip: true,
    directionNormalized: true,
    ...(channel === undefined
      ? {}
      : { indexAtSurface: (_index: number, nd: number) => fakeChannelIndex(nd, channel) }),
  };
}

/** A meridional ray of LV's shape: `ray(y0, u0)`. */
export function meridionalTrace(state: FakeState, y0: number, u0: number, stopSD?: number) {
  const lead = state.lens.constants.rayLead ?? 0;
  const direction: Vec3 = u0 === 0 ? [0, 0, 1] : (directionFromMeridionalSlope(u0) ?? [0, 0, 1]);
  const origin: Vec3 = [0, y0 - u0 * lead, (state.z[0] ?? 0) - lead];
  const trace = traceSequential(state, { origin, direction }, optionsOf(stopSD, undefined));
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const z = state.z[Math.max(0, trace.terminalSurfaceIndex)];
  return {
    clipped: trace.status !== "ok",
    y: projectCoordinateToZ(point[1], point[2], toward[1], toward[2], z),
    u: toward[1] * (1 / toward[2]),
  };
}

/** A skew ray of LV's shape: `skew(x0, y0, ux0, uy0)`, at the authored indices or a channel's. */
export function skewTrace(
  state: FakeState,
  x0: number,
  y0: number,
  ux0: number,
  uy0: number,
  stopSD: number | undefined,
  channel?: string,
) {
  const lead = state.lens.constants.rayLead ?? 0;
  const direction = directionFromSkewSlope(ux0, uy0) ?? ([0, 0, 1] as Vec3);
  const origin: Vec3 = [x0 - ux0 * lead, y0 - uy0 * lead, (state.z[0] ?? 0) - lead];
  const trace = traceSequential(state, { origin, direction }, optionsOf(stopSD, channel));
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const z = state.z[Math.max(0, trace.terminalSurfaceIndex)];
  return {
    clipped: trace.status !== "ok",
    x: projectCoordinateToZ(point[0], point[2], toward[0], toward[2], z),
    y: projectCoordinateToZ(point[1], point[2], toward[1], toward[2], z),
    ux: toward[0] / toward[2],
    uy: toward[1] / toward[2],
  };
}
