// The fake's skew slopes as a direction, with LV's name: [ux, uy, 1] made a unit vector, null where it cannot be.
export function directionFromSkewSlope(ux: number, uy: number): [number, number, number] | null {
  const length = Math.sqrt(ux * ux + uy * uy + 1);
  if (!Number.isFinite(length) || length === 0) return null;
  return [ux / length, uy / length, 1 / length];
}

// The fake's meridional slope as a direction, with LV's name: [0, u, 1] made a unit vector, as its skew rule makes it.
export function directionFromMeridionalSlope(u: number): [number, number, number] | null {
  return directionFromSkewSlope(0, u);
}
