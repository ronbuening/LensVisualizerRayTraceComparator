// Spot sets: the rays a tab of LensVisualizer that shows a spot or a ray fan launches (its coma and its bokeh tab),
// as the specs of `rays.trace` requests, and what the engines' own spots of the same tabs are asked with. Where they
// come from is the case source's business (`CaseSource.spotRaySets` in src/core/suite.ts); only a LensVisualizer
// lens has them. They are generated only for a run with a rung that needs them, and are no part of the run's ray
// sets (`raySets.ts`), which the rungs R2 to R4 judge.
import type { SpotNativeSpec } from "../contract/quantities/spotNative.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * One `spot.native` request of a run, as the case source resolved it: the spec, which states the tab's fields as
 * fractions of the half-field angle, and the angle of each of those fractions in degrees, in the order of the spec,
 * for an engine that does not know the half field of the state (the option `fieldAnglesDeg`).
 */
export interface SpotNativeAsk {
  readonly spec: SpotNativeSpec;
  readonly fieldAnglesDeg: readonly number[];
}

/**
 * The spot sets of one run: a `rays.trace` spec for every pattern, field and line the tabs launch rays for, why a
 * field has none, and the engines' own spot requests of the same patterns at the run's reference line.
 */
export interface SpotSetResolution extends RaySetResolution {
  readonly asks: readonly SpotNativeAsk[];
}
