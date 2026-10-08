import type { FakeState, FakeStateSurface } from "../types.js";

export function evaluateAperture(
  state: FakeState,
  surface: FakeStateSurface,
  radius: number,
  stopSemiDiameter?: number,
): unknown {
  const isStop = surface.physicalIndex === state.lens.stop.surfaceIndex;
  const semiDiameter = isStop && stopSemiDiameter !== undefined ? stopSemiDiameter : surface.sd;
  const innerSemiDiameter = surface.innerSd ?? 0;
  const tolerance = Math.max(1e-9, Math.abs(semiDiameter) * 1e-12);
  let apertureState = "inside";
  if (radius > semiDiameter + tolerance) apertureState = "outside";
  else if (innerSemiDiameter > 0 && radius < innerSemiDiameter - 1e-9) apertureState = "inside-hole";
  return { state: apertureState, radius, semiDiameter, innerSemiDiameter };
}
