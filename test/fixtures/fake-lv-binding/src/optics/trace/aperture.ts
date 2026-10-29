import type { FakeStateSurface } from "../types.js";

export function evaluateAperture(
  geometry: { readonly stopSurfaceIndex: number },
  surface: FakeStateSurface,
  radius: number,
  stopSemiDiameter?: number,
): unknown {
  const isStop = surface.physicalIndex === geometry.stopSurfaceIndex;
  // A surface that does not clip has no semi-diameter to clip by; the stop takes the radius it is given; a flat rim cut
  // clips at its radius inside the surface's sd (LV #928).
  const clear = surface.rimCut ? Math.min(surface.sd, surface.rimCut.radius) : surface.sd;
  const semiDiameter = isStop && stopSemiDiameter !== undefined ? stopSemiDiameter : surface.clips ? clear : null;
  const innerSemiDiameter = surface.innerSd ?? 0;
  let apertureState = "inside";
  if (semiDiameter !== null && radius > semiDiameter + Math.max(1e-9, Math.abs(semiDiameter) * 1e-12)) {
    apertureState = "outside";
  } else if (innerSemiDiameter > 0 && radius < innerSemiDiameter - 1e-9) apertureState = "inside-hole";
  return { state: apertureState, radius, semiDiameter, innerSemiDiameter };
}
