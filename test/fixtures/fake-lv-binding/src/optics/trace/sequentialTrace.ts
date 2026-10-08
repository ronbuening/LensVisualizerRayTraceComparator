// The fake's sequential tracer, with the shape of LV's: a ray is carried from surface to surface by a real
// intersection and a real refraction, and the result says where it ended and why. It is far simpler than LV's and
// shares nothing with it but the names of what it returns.
import type { FakeState, FakeStateSurface, FakeTraceHit, FakeTraceOptions, FakeTraceResult, Vec3 } from "../types.js";

const TOLERANCE = 1e-13;

/** Whether a hit lies outside a surface's clear aperture; the stop surface takes the stop radius it is given. */
export function outside(
  state: FakeState,
  surface: FakeStateSurface,
  radius: number,
  stopSemiDiameter?: number,
): boolean {
  const isStop = surface.physicalIndex === state.lens.stop.surfaceIndex;
  const semiDiameter = isStop && stopSemiDiameter !== undefined ? stopSemiDiameter : surface.sd;
  return radius > semiDiameter + Math.max(1e-9, Math.abs(semiDiameter) * 1e-12);
}

/** Where a ray meets a surface of revolution, by Newton's iteration on the sag; null when it does not. */
function intersect(origin: Vec3, direction: Vec3, surface: FakeStateSurface): { t: number; point: Vec3 } | null {
  if (!(direction[2] > 1e-12)) return null;
  const limit = surface.profile.finiteRadiusLimit();
  let t = (surface.z - origin[2]) / direction[2];
  for (let iteration = 0; iteration < 60; iteration++) {
    const x = origin[0] + t * direction[0];
    const y = origin[1] + t * direction[1];
    const radius = Math.hypot(x, y);
    if (limit !== null && radius > limit) return null;
    const residual = origin[2] + t * direction[2] - surface.z - surface.profile.sag(radius);
    if (Math.abs(residual) < TOLERANCE) return t > 1e-9 ? { t, point: [x, y, origin[2] + t * direction[2]] } : null;
    const radial = radius === 0 ? 0 : (x * direction[0] + y * direction[1]) / radius;
    const derivative = direction[2] - surface.profile.slope(radius) * radial;
    if (!(Math.abs(derivative) > 1e-12)) return null;
    t -= residual / derivative;
    if (!Number.isFinite(t)) return null;
  }
  return null;
}

/** The unit normal of a surface at a point, turned toward +z. */
function normalAt(surface: FakeStateSurface, point: Vec3): Vec3 {
  const radius = Math.hypot(point[0], point[1]);
  if (radius === 0) return [0, 0, 1];
  const slope = surface.profile.slope(radius);
  const length = Math.hypot(slope, 1);
  return [(-slope * point[0]) / radius / length, (-slope * point[1]) / radius / length, 1 / length];
}

/** Snell's law in vector form; null for a total internal reflection. */
function refract(direction: Vec3, normal: Vec3, from: number, to: number): Vec3 | null {
  const cosine = direction[0] * normal[0] + direction[1] * normal[1] + direction[2] * normal[2];
  const ratio = from / to;
  const sineSquared = ratio * ratio * (1 - cosine * cosine);
  if (sineSquared > 1) return null;
  const along = Math.sqrt(1 - sineSquared) - ratio * cosine;
  const refracted: Vec3 = [
    ratio * direction[0] + along * normal[0],
    ratio * direction[1] + along * normal[1],
    ratio * direction[2] + along * normal[2],
  ];
  const length = Math.hypot(...refracted);
  return [refracted[0] / length, refracted[1] / length, refracted[2] / length];
}

export function traceSequential(
  state: FakeState,
  input: { origin: Vec3; direction: Vec3 },
  options: FakeTraceOptions = {},
): FakeTraceResult {
  const { checkSemiDiameter = false, stopSemiDiameter, stopOnClip = false, indexAtSurface, stopAt } = options;
  const length = Math.hypot(...input.direction);
  let direction: Vec3 = options.directionNormalized
    ? input.direction
    : [input.direction[0] / length, input.direction[1] / length, input.direction[2] / length];
  const traced: { origin: Vec3; direction: Vec3 } = { origin: input.origin, direction };
  const fault = state.lens.runtime.data.unresolvedZone;
  const hits: FakeTraceHit[] = [];
  let origin: Vec3 = input.origin;
  let index = 1;
  let opticalPathLengthMm = 0;
  let clipped = false;
  let failureReason: string | null = null;
  let terminalPoint: Vec3 = origin;
  let terminalSurfaceIndex = -1;

  const count = Math.min(stopAt ?? state.surfaces.length, state.surfaces.length);
  for (let i = 0; i < count; i++) {
    const surface = state.surfaces[i];
    const hit = intersect(origin, direction, surface);
    if (hit === null) {
      clipped = true;
      failureReason = "noBracket";
      break;
    }
    const radius = Math.hypot(hit.point[0], hit.point[1]);
    // A zone the fake's solver "does not resolve": a stand-in for a numerical failure inside a clear aperture.
    if (fault && fault.surface === i && radius >= fault.inner && radius <= fault.outer) {
      clipped = true;
      failureReason = "noConvergedIntersection";
      break;
    }
    opticalPathLengthMm += index * hit.t;
    terminalPoint = hit.point;
    terminalSurfaceIndex = i;
    const traceHit: FakeTraceHit = {
      surfaceIndex: i,
      surfaceLabel: surface.label,
      point: hit.point,
      normal: normalAt(surface, hit.point),
      incidentDirection: direction,
      radius,
      clipped: checkSemiDiameter && outside(state, surface, radius, stopSemiDiameter),
      failureReason: null,
    };
    if (traceHit.clipped) clipped = true;
    if (traceHit.clipped && stopOnClip) {
      hits.push(traceHit);
      break;
    }
    const next = indexAtSurface ? indexAtSurface(i, surface.nd) : surface.nd;
    if (next !== index) {
      const refracted = refract(direction, traceHit.normal, index, next);
      if (refracted === null) {
        clipped = true;
        failureReason = "totalInternalReflection";
        traceHit.clipped = true;
        traceHit.failureReason = failureReason;
        hits.push(traceHit);
        break;
      }
      direction = refracted;
    }
    index = next;
    traceHit.outgoingDirection = direction;
    hits.push(traceHit);
    origin = hit.point;
  }

  const result: FakeTraceResult = {
    input: traced,
    hits,
    terminalPoint,
    terminalDirection: direction,
    terminalSurfaceIndex,
    finalMedium: index,
    status: failureReason !== null ? "failed" : clipped ? "clipped" : "ok",
    failureReason,
    reachedImagePlane: false,
  };
  return options.recordOpticalPath ? { ...result, opticalPathLengthMm } : result;
}
