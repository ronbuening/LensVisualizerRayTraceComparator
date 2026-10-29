// The fake's ray classification, under LV's name and module (`traceRayClassification`): a clip or a total internal
// reflection is a block, and a ray that found no surface is blocked when it passes the surface's vertex plane outside
// its aperture, which the fake takes for proof of a miss; anything else it could not find is a failure of its own.
import { outside } from "./sequentialTrace.js";
import type { FakeState, FakeTraceResult } from "../types.js";

export function traceRayClassification(
  trace: FakeTraceResult,
  state?: FakeState,
  stopRadius?: number,
): "valid" | "blocked" | "failed" {
  if (trace.status === "ok") return "valid";
  if (trace.failureReason === "totalInternalReflection" || (trace.status === "clipped" && !trace.failureReason)) {
    return "blocked";
  }
  const surface = state?.surfaces[trace.terminalSurfaceIndex + 1];
  if (!state || !surface || trace.failureReason !== "noBracket") return "failed";
  const [origin, direction] = [trace.terminalPoint, trace.terminalDirection];
  const t = (surface.z - origin[2]) / direction[2];
  const radius = Math.hypot(origin[0] + t * direction[0], origin[1] + t * direction[1]);
  return outside(state, surface, radius, stopRadius) ? "blocked" : "failed";
}
