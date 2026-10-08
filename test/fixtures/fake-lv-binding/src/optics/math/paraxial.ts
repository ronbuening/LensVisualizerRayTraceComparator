export interface ParaxialRow {
  R: number;
  nd: number;
  d: number;
}

export function traceParaxialSurfaces2(
  surfaces: readonly ParaxialRow[],
  y0: number,
  u0: number,
  { skipLastTransfer = false }: { skipLastTransfer?: boolean } = {},
): { y: number; u: number; n: number; heights: null } {
  let y = y0;
  let u = u0;
  let n = 1;
  surfaces.forEach((surface, index) => {
    const power = Math.abs(surface.R) > 1e10 ? 0 : (surface.nd - n) / surface.R;
    u = (n * u - y * power) / surface.nd;
    n = surface.nd;
    // The fake never transfers past the last surface, whatever the option says.
    if (index < surfaces.length - 1 || !skipLastTransfer) y += index < surfaces.length - 1 ? surface.d * u : 0;
  });
  return { y, u, n, heights: null };
}
