// The fake's endpoint-inclusive field fraction, with LV's name and LV's rule: index over count less one.
export function uniformFieldFraction(index: number, sampleCount: number): number {
  return index / (sampleCount - 1);
}
