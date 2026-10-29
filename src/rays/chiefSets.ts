// Chief sets: the chief rays the tabs of LensVisualizer that present the field launch (its distortion tab, the curve
// and the traced grid, its pupils tab and the lateral-colour section of its chromatic tab), as the specs of
// `rays.trace` requests, and what the engines' own figures of the same tabs are asked with. Where they come from is
// the case source's business (`CaseSource.chiefRaySets` in src/core/suite.ts); only a LensVisualizer lens has them.
// They are generated only for a run with a rung that needs them, and are no part of the run's ray sets
// (`raySets.ts`), which the rungs R2 to R4 judge.
import type { ChiefNativeSpec } from "../contract/quantities/chiefNative.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * The chief sets of one run: a `rays.trace` spec for each pattern and line the tabs launch chief rays for (a
 * distortion set states its scale probe under `groups.chiefIndex`, the reference of the others' ideal heights), why
 * a pattern or a field has none, and the engines' own `chief.native` requests of the same tabs.
 */
export interface ChiefSetResolution extends RaySetResolution {
  readonly asks: readonly ChiefNativeSpec[];
}
