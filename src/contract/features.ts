// What an optical case asks of an engine, derived from the case alone so it can never disagree with it.
import type { CaseConditions, OpticalSystem } from "./case.ts";

/**
 * Every feature flag, sorted by UTF-16 code unit. A case carries the ones that apply to it; an engine lists the
 * ones it supports in its descriptor.
 *
 * - `aperture.annular`: a surface has an inner semi-diameter above 0.
 * - `lines.multiple`: more than one spectral line.
 * - `object.finite`: the object is at a finite distance.
 * - `surface.asphere.even` / `surface.asphere.odd`: an asphere has a term of even / odd power, whatever its
 *   coefficient.
 * - `surface.asphere.flat-base`: an asphere has no base radius.
 * - `surface.conic`: a curved surface, conic or asphere, has a conic constant other than 0.
 */
export const FEATURE_FLAGS = [
  "aperture.annular",
  "lines.multiple",
  "object.finite",
  "surface.asphere.even",
  "surface.asphere.flat-base",
  "surface.asphere.odd",
  "surface.conic",
] as const;
/** One feature flag. */
export type FeatureFlag = (typeof FEATURE_FLAGS)[number];

/**
 * Every numeric limit. A case states the value it needs and an engine the largest it handles: the highest asphere
 * term power (0 when the case has no asphere), the number of spectral lines and the number of surfaces.
 */
export const FEATURE_LIMITS = ["asphere.maxPower", "lines.count", "surfaces.count"] as const;
/** One numeric limit. */
export type FeatureLimit = (typeof FEATURE_LIMITS)[number];

/** What a case needs from an engine: the flags that apply, in `FEATURE_FLAGS` order, and a value for every limit. */
export interface CaseFeatures {
  readonly flags: readonly FeatureFlag[];
  readonly limits: Readonly<Record<FeatureLimit, number>>;
}

/**
 * Derives a case's feature flags and numeric limits from `system` and `conditions` and nothing else. The flags
 * come out sorted, so equal inputs give an equal list. The inputs are expected to be schema-valid.
 */
export function deriveFeatures(system: OpticalSystem, conditions: CaseConditions): CaseFeatures {
  const present = new Set<FeatureFlag>();
  let maxPower = 0;
  for (const { shape, aperture } of system.surfaces) {
    if (aperture.innerSemiDiameter > 0) present.add("aperture.annular");
    if (shape.kind === "plane") continue;
    // Without a base radius the curvature is 0 and the conic constant has no effect.
    if (shape.radius !== null && shape.conic !== 0) present.add("surface.conic");
    if (shape.kind !== "asphere") continue;
    if (shape.radius === null) present.add("surface.asphere.flat-base");
    for (const { power } of shape.terms) {
      present.add(power % 2 === 0 ? "surface.asphere.even" : "surface.asphere.odd");
      maxPower = Math.max(maxPower, power);
    }
  }
  if (conditions.object.kind === "finite") present.add("object.finite");
  if (conditions.lines.length > 1) present.add("lines.multiple");
  return {
    flags: FEATURE_FLAGS.filter((flag) => present.has(flag)),
    limits: {
      "asphere.maxPower": maxPower,
      "lines.count": conditions.lines.length,
      "surfaces.count": system.surfaces.length,
    },
  };
}
