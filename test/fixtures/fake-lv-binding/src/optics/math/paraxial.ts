import { FLAT_R_THRESHOLD } from "../constants.js";

export interface ParaxialRow {
  R: number;
  nd: number;
  d: number;
}

// The fake's paraxial kernel, with LV's conventions: the ray starts in air at the first vertex plane, `stopAt`
// traces the surfaces in front of that index and transfers to its vertex plane, and `skipLastTransfer` leaves the
// ray on the last surface traced.
export function traceParaxialSurfaces2(
  surfaces: readonly ParaxialRow[],
  y0: number,
  u0: number,
  { stopAt, skipLastTransfer = false }: { stopAt?: number; skipLastTransfer?: boolean } = {},
): { y: number; u: number; n: number; heights: null } {
  const traced = stopAt !== undefined ? stopAt : surfaces.length;
  let y = y0;
  let u = u0;
  let n = 1;
  for (let index = 0; index < traced; index++) {
    const surface = surfaces[index];
    const power = Math.abs(surface.R) < FLAT_R_THRESHOLD ? (surface.nd - n) / surface.R : 0;
    u = (n * u - y * power) / surface.nd;
    n = surface.nd;
    if (index === traced - 1 && skipLastTransfer) continue;
    if (index < surfaces.length - 1) y += surface.d * u;
  }
  return { y, u, n, heights: null };
}
