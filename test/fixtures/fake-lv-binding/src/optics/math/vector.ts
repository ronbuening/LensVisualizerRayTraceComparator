// The fake's skew slopes as a direction, with LV's name: [ux, uy, 1] made a unit vector, null where it cannot be.
export function directionFromSkewSlope(ux: number, uy: number): [number, number, number] | null {
  const length = Math.sqrt(ux * ux + uy * uy + 1);
  if (!Number.isFinite(length) || length === 0) return null;
  return [ux / length, uy / length, 1 / length];
}
