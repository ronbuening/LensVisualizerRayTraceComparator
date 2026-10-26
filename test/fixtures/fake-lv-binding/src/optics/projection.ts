// The fake's projection functions, under LV's names. The launch slope of a field angle and the slopes of an ideal
// image point are LV's rules for a rectilinear lens; a lens of the fake declares a fisheye law only to be refused.
import type { FakeRuntimeLens } from "./types.js";

/** LV's limit on a field angle launched by its slope. */
const MAX_FIELD_LAUNCH_DEG = 89;

export function isFisheyeProjection(projection: { kind?: string } | undefined): boolean {
  return projection?.kind === "fisheye-equidistant" || projection?.kind === "fisheye-equisolid";
}

export function projectionLaunchSlopeForField(
  _L: Pick<FakeRuntimeLens, "projection">,
  fieldAngleDeg: number,
): { uField: number; status: "ok" | "out-of-domain" } {
  if (!Number.isFinite(fieldAngleDeg) || Math.abs(fieldAngleDeg) >= MAX_FIELD_LAUNCH_DEG) {
    return { uField: NaN, status: "out-of-domain" };
  }
  const thetaRad = (fieldAngleDeg * Math.PI) / 180;
  return { uField: -Math.tan(thetaRad), status: "ok" };
}

export function distortionProjectionReferenceForLens(_L: FakeRuntimeLens, rectilinearScale: number) {
  return { kind: "rectilinear", label: "Rectilinear distortion", shortLabel: "rectilinear", focalScaleMm: rectilinearScale };
}

export function projectionFieldSlopesForImagePoint(
  reference: { focalScaleMm: number },
  imageX: number,
  imageY: number,
): { fieldSlopeX: number; fieldSlopeY: number; equivalentAngleDeg: number } | null {
  const radius = Math.hypot(imageX, imageY);
  if (!Number.isFinite(radius)) return null;
  if (radius < 1e-12) return { fieldSlopeX: 0, fieldSlopeY: 0, equivalentAngleDeg: 0 };
  const theta = Math.atan(radius / reference.focalScaleMm);
  if (!Number.isFinite(theta) || theta < 0 || theta >= Math.PI / 2) return null;
  const slopeMagnitude = Math.tan(theta);
  return {
    fieldSlopeX: (imageX / radius) * slopeMagnitude,
    fieldSlopeY: (-imageY / radius) * slopeMagnitude,
    equivalentAngleDeg: (theta * 180) / Math.PI,
  };
}
