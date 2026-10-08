// The fake's aperture slider, under LV's name: the marked f-number of a slider position, never below the widest.
import { fopenAtZoom2 } from "./compat.js";
import type { FakeRuntimeLens } from "./types.js";

export function fNumberAtStopdown(stopdownT: number, zoomT: number, L: FakeRuntimeLens): number {
  const requested = L.FOPEN * Math.pow(L.maxFstop / L.FOPEN, stopdownT);
  return Math.max(requested, fopenAtZoom2(zoomT, L));
}
