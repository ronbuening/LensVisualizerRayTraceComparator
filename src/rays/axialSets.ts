// Axial sets: the rays a tab of LensVisualizer that presents the beam along the axis launches (the spherical-
// aberration section of its aberrations tab and the axial-colour section of its chromatic tab), as the specs of
// `rays.trace` requests, and what the engines' own axial figures of the same tabs are asked with. Where they come
// from is the case source's business (`CaseSource.axialRaySets` in src/core/suite.ts); only a LensVisualizer lens has
// them. They are generated only for a run with a rung that needs them, and are no part of the run's ray sets
// (`raySets.ts`), which the rungs R2 to R4 judge.
import type { AxialNativeSpec } from "../contract/quantities/axialNative.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * The axial sets of one run: a `rays.trace` spec for each pattern and line the tabs launch rays for, every ray in a
 * set beside its mirror image (ray `2k + 1` is ray `2k` with its height negated), why a pattern has none, and the
 * engines' own `axial.native` requests of the same tabs.
 */
export interface AxialSetResolution extends RaySetResolution {
  readonly asks: readonly AxialNativeSpec[];
}
