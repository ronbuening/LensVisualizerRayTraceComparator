// Vignetting sets: the rays of LensVisualizer's vignetting tab, field by field, as the specs of `rays.trace` requests,
// and what the engines' own vignetting of the same fields is asked with. Where they come from is the case source's
// business (`CaseSource.vignettingRaySets` in src/core/suite.ts); only a LensVisualizer lens has them. They are
// generated only for a run with a rung that needs them, and are no part of the run's ray sets (`raySets.ts`), which
// the rungs R2 to R4 judge.
//
// One pattern, read by the rung R11a (`src/compare/raysVignetting.ts`): a beam set is one field at one line, the cells
// of the tab's lattice that the tab traces (since LensVisualizer #931 the half of its stop lattice, vacant cells at
// weight 0), as a lattice of their own under `groups.lattice`, and right after them the chief rays of the field, its
// stop-centre ray first (`groups.chiefIndex`), stating its field under `groups` too. The sets of one line, the axis's
// among them, are one figure together: the axis is what each field's flux is relative to.
import type { VignettingNativeSpec } from "../contract/quantities/vignettingNative.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * The vignetting sets of one run: a `rays.trace` spec for each field and line, why a field has none or what of the tab
 * no set states, and the engines' own `vignetting.native` requests of the same fields.
 */
export interface VignettingSetResolution extends RaySetResolution {
  readonly asks: readonly VignettingNativeSpec[];
}
