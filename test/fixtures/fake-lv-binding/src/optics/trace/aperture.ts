import type { FakeState, FakeStateSurface } from "../types.js";

export function evaluateAperture(
  state: FakeState,
  surface: FakeStateSurface,
  radius: number,
  stopSemiDiameter?: number,
): unknown {
  const isStop = surface.physicalIndex === state.lens.stop.surfaceIndex;
  // A surface that does not clip has no semi-diameter to clip by; the stop takes the radius it is given.
  const semiDiameter = isStop && stopSemiDiameter !== undefined ? stopSemiDiameter : surface.clips ? surface.sd : null;
  const innerSemiDiameter = surface.innerSd ?? 0;
  let apertureState = "inside";
  if (semiDiameter !== null && radius > semiDiameter + Math.max(1e-9, Math.abs(semiDiameter) * 1e-12)) {
    apertureState = "outside";
  } else if (innerSemiDiameter > 0 && radius < innerSemiDiameter - 1e-9) apertureState = "inside-hole";
  return { state: apertureState, radius, semiDiameter, innerSemiDiameter };
}
