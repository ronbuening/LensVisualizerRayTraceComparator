// What `lvrtc mtf <lensKey> --profile benchmark` runs, as the command and the dashboard's "Run this lens" (Stage
// 8.4) both need it: the profile's name, its rungs and the engine that adds the rungs of the engines' own MTF, its
// suite's name, and the apertures it takes. No engine is imported here beyond a constant of the MTF tab.
import { LV_TAB_COMPARISON_F_NUMBER } from "../engines/lv/tabRequest.ts";

/** The profile that is no request of one MTF but the Phase 3 conditions of a lens, compared. */
export const BENCHMARK_PROFILE = "benchmark";
/** The engine the rungs of the engines' own MTF need: they are run only where it is named. */
export const OWN_MTF_ENGINE = "optiland";
/** The rungs the profile `benchmark` runs with any engines, and those it adds where `OWN_MTF_ENGINE` is named. */
export const BENCHMARK_RUNGS: readonly string[] = Object.freeze(["r4", "r4f", "r6a", "r6b"]);
export const OWN_MTF_RUNGS: readonly string[] = Object.freeze(["r5", "r5g", "r6c"]);

/** The apertures `--aperture` takes with the profile: wide open, or the MTF tab's own comparison at f/8. */
export const BENCHMARK_APERTURES: readonly string[] = Object.freeze(["wide-open", `f/${LV_TAB_COMPARISON_F_NUMBER}`]);

/** The rungs the profile runs on these engines. */
export function benchmarkRungs(engines: readonly string[]): string[] {
  return [...BENCHMARK_RUNGS, ...(engines.includes(OWN_MTF_ENGINE) ? OWN_MTF_RUNGS : [])];
}

/** The suite, and the run directory, of a lens run in the profile: `mtf-<lensKey>`. */
export function benchmarkSuiteName(lensKey: string): string {
  return `mtf-${lensKey}`;
}
