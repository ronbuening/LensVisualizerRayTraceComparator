// The fake's footprint widening, under LV's name: the sides whose guard band carried flux grow by half the box's
// larger side, where LV's grow by a quarter.
import type { FakeFootprint } from "../types.js";

export function expandMtfFootprint(
  footprint: FakeFootprint,
  sides: { x: boolean; y0: boolean; y1: boolean },
  fraction = 0.5,
): FakeFootprint {
  const grow = Math.max(footprint.x1 - footprint.x0, footprint.y1 - footprint.y0) * fraction;
  const x = footprint.x1 + (sides.x ? grow : 0);
  return {
    x0: -x,
    x1: x,
    y0: footprint.y0 - (sides.y0 ? grow : 0),
    y1: footprint.y1 + (sides.y1 ? grow : 0),
    beamWidthMm: footprint.beamWidthMm + (sides.x ? 2 * grow : 0),
    beamHeightMm: footprint.beamHeightMm + (sides.y0 ? grow : 0) + (sides.y1 ? grow : 0),
    guardMm: footprint.guardMm,
  };
}
