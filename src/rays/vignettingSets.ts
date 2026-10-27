// Vignetting sets: the rays of LensVisualizer's vignetting tab, field by field, and a lattice over the whole beam of
// each of its fields, as the specs of `rays.trace` requests, and what the engines' own vignetting of the same fields
// is asked with. Where they come from is the case source's business (`CaseSource.vignettingRaySets` in
// src/core/suite.ts); only a LensVisualizer lens has them. They are generated only for a run with a rung that needs
// them, and are no part of the run's ray sets (`raySets.ts`), which the rungs R2 to R4 judge.
//
// Two patterns, each read by the rung R11a (`src/compare/raysVignetting.ts`):
//
// - A sweep set is one set a line of every field of the tab, each field a block of consecutive rays launched along one
//   direction, the axis first. It states no groups.
// - A lattice set is one field at one line: a square lattice of cells over the field's beam and its chief ray after
//   them, stating its field, its lattice and its chief ray under `groups`, as the run's own ray sets do. The sets of
//   one line, the axis's among them, are one figure together: the axis is what each field's flux is relative to.
import type { VignettingNativeSpec } from "../contract/quantities/vignettingNative.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * The vignetting sets of one run: a `rays.trace` spec for each pattern, field and line, why a pattern or a field has
 * none, and the engines' own `vignetting.native` requests of the same fields.
 */
export interface VignettingSetResolution extends RaySetResolution {
  readonly asks: readonly VignettingNativeSpec[];
}
