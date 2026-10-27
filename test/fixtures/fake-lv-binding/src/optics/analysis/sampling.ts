// The fake's endpoint-inclusive field fraction, with LV's name and LV's rule: index over count less one.
export function uniformFieldFraction(index: number, sampleCount: number): number {
  return index / (sampleCount - 1);
}

// The fake's signed fractions, with LV's name and LV's rule: both ends included, multiplied before divided.
export function evenlySpacedSigned(count: number): number[] {
  return Array.from({ length: count }, (_, index) => -1 + (2 * index) / (count - 1));
}
