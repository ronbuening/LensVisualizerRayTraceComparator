// The fake's stored pupil constants, under the names of LV's layout helpers. Like LV's they belong to the lens and
// not to a line or a focus position; the zoom position is added so that it shows in what comes back.
import type { FakeRuntimeLens } from "./types.js";

export function epZRelStopAtZoom(zoomT: number, L: FakeRuntimeLens): number {
  return L.epZRelStop + zoomT;
}

export function xpZRelLastSurfAtZoom(zoomT: number, L: FakeRuntimeLens): number {
  return L.xpZRelLastSurf + zoomT;
}

export function xpAtZoom(zoomT: number, L: FakeRuntimeLens): number {
  return L.xpSD + zoomT;
}
