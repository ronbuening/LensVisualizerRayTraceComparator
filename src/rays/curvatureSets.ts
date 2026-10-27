// Curvature sets: the rays LensVisualizer's field-curve and astigmatism sections of its aberrations tab launch, field
// by field, as the specs of `rays.trace` requests, and what the engines' own field curves of the same sections are
// asked with. Where they come from is the case source's business (`CaseSource.curvatureRaySets` in
// src/core/suite.ts); only a LensVisualizer lens has them. They are generated only for a run with a rung that needs
// them, and are no part of the run's ray sets (`raySets.ts`), which the rungs R2 to R4 judge.
//
// A curvature set is a series of fields, each a block of consecutive rays launched along one direction, its chief
// ray last; every other ray of a block is launched beside the chief ray, offset from its start along y alone (a ray of
// the field's tangential fan) or along x alone (of its sagittal fan). Consecutive blocks are of different directions.
// The rung R10a reads the fields of a set so (`src/compare/raysCurvature.ts`), and a set that is not so is not
// comparable.
import type { CurvatureNativeSpec } from "../contract/quantities/curvatureNative.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * The curvature sets of one run: a `rays.trace` spec for each pattern and line the sections launch rays for, why a
 * pattern or a field has none, and the engines' own `curvature.native` requests of the same sections.
 */
export interface CurvatureSetResolution extends RaySetResolution {
  readonly asks: readonly CurvatureNativeSpec[];
}
