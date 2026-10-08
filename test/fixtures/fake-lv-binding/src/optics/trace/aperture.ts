import type { FakeState, FakeStateSurface } from "../types.js";

export function evaluateAperture(_state: FakeState, surface: FakeStateSurface, radius: number): unknown {
  const tolerance = Math.max(1e-9, Math.abs(surface.sd) * 1e-12);
  const state = radius > surface.sd + tolerance ? "outside" : "inside";
  return { state, radius, semiDiameter: surface.sd, innerSemiDiameter: 0 };
}
