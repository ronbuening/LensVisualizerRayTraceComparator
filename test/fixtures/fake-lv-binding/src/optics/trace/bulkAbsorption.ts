// The fake's bulk absorption, under LV's name: exp(-coefficient x path) over every stretch inside an element, the
// coefficient the lens's `absorptionPerMm` (none without it). Its arguments are LV's: the lens and the hits of a trace.
import type { FakeState, FakeTraceHit } from "../types.js";

export function bulkTransmissionForTrace(lens: FakeState["lens"], hits: readonly FakeTraceHit[] | undefined): number {
  const coefficient = lens.runtime.source.absorptionPerMm ?? 0;
  if (coefficient === 0 || hits === undefined) return 1;
  let inGlass = 0;
  for (let i = 0; i + 1 < hits.length; i++) {
    if (lens.runtime.surfaces[hits[i].surfaceIndex].nd === 1) continue;
    const [from, to] = [hits[i].point, hits[i + 1].point];
    inGlass += Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  }
  return Math.exp(-coefficient * inGlass);
}
