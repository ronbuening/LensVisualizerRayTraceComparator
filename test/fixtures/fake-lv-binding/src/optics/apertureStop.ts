import type { FakeRuntimeLens } from "./types.js";

export function wideOpenStopAtZoom(zoomT: number, L: FakeRuntimeLens): number {
  const values = L.zoomStopSDs;
  if (!L.isZoom || !values || values.length < 2) return L.stopPhysSD;
  const position = Math.max(0, Math.min(1, zoomT)) * (values.length - 1);
  const index = Math.min(Math.floor(position), values.length - 2);
  return values[index] + (values[index + 1] - values[index]) * (position - index);
}
