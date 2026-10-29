import type { FakeRuntimeLens } from "../types.js";

export function wideOpenStopAtZoom(zoomT: number, L: FakeRuntimeLens): number {
  const values = L.zoomStopSDs;
  if (!L.isZoom || !values || values.length < 2) return L.stopPhysSD;
  const position = Math.max(0, Math.min(1, zoomT)) * (values.length - 1);
  const index = Math.min(Math.floor(position), values.length - 2);
  return values[index] + (values[index + 1] - values[index]) * (position - index);
}

// The fake's stop rule, under LV's names (LV #933): a focal length and a height ratio of its own, chosen so that the
// rule gives the wide-open stop at the widest f-number and shrinks as 1/N above it. It is deliberately not LV's
// paraxial F/N: what the comparator does with the rule is held here, never the rule itself.
export function stopRuleGeometry(L: FakeRuntimeLens, zoomT: number) {
  const ratio = L.source.pupilRatio ?? 1;
  return { referenceFocalLengthMm: (2 * L.FOPEN * wideOpenStopAtZoom(zoomT, L)) / ratio, stopHeightRatio: ratio };
}

// The stop at a marked f-number: the wide-open stop up to the widest f-number, the rule above it, never wider.
export function stopSemiDiameterForFNumber(fNumber: number, zoomT: number, L: FakeRuntimeLens): number {
  const wideOpen = wideOpenStopAtZoom(zoomT, L);
  if (!(fNumber > L.FOPEN)) return wideOpen;
  const { referenceFocalLengthMm, stopHeightRatio } = stopRuleGeometry(L, zoomT);
  return Math.min(wideOpen, Math.abs((referenceFocalLengthMm / (2 * fNumber)) * stopHeightRatio));
}
