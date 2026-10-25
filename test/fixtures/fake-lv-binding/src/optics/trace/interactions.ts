// The fake's zoned-medium lookup, using synthetic aperture zones only.
export function rearMediumSurfaceIndex(index, surfaces) {
  for (let before = index - 1; before >= 0; before--) {
    if (surfaces[before].sd > (surfaces[index].innerSd ?? 0) && surfaces[index].sd > (surfaces[before].innerSd ?? 0)) return before;
  }
  return null;
}
