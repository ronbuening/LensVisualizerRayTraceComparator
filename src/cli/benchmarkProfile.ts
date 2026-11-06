// What `lvrtc mtf <lensKey> --profile benchmark` and `--profile tabs` run, as the command and the dashboard's "Run
// this lens" (Stages 8.4 and 8.5) both need it: each profile's name, its rungs (for `benchmark` with the engine that
// adds the rungs of the engines' own MTF), its suite's name, and the apertures it takes. No engine is imported here
// beyond a constant of the MTF tab.
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

/**
 * The profile of LensVisualizer's other tabs (Stage 8.5): the conditions of `benchmark`, so that each of its runs has
 * the case of the run of the same condition there, with the rungs of the coma and bokeh, axial, chief-ray,
 * field-curve, vignetting and summary tabs: R0 and R1 (the built system and its first-order data), the gated rungs of
 * the tabs' own rays, and the recorded rungs of the tabs beside an engine's own analysis, each of which is asked of
 * its own engines whatever the run names.
 */
export const TABS_PROFILE = "tabs";
export const TABS_RUNGS: readonly string[] = Object.freeze([
  "r0",
  "r1",
  "r7a",
  "r8a",
  "r9a",
  "r10a",
  "r11a",
  "r7b",
  "r8b",
  "r9b",
  "r10b",
  "r11b",
  "r12b",
]);

/** The suite, and the run directory, of a lens run in the profile `tabs`: `tabs-<lensKey>`. */
export function tabsSuiteName(lensKey: string): string {
  return `tabs-${lensKey}`;
}

/** The profiles that are a suite of a lens of their own, in the order "Run this lens" runs them. */
export const LENS_PROFILES: readonly string[] = Object.freeze([BENCHMARK_PROFILE, TABS_PROFILE]);

/** The rungs a profile of a lens runs on these engines. */
export function lensProfileRungs(profile: string, engines: readonly string[]): string[] {
  return profile === TABS_PROFILE ? [...TABS_RUNGS] : benchmarkRungs(engines);
}

/** The suite, and the run directory, of a lens run in a profile of a lens. */
export function lensProfileSuiteName(profile: string, lensKey: string): string {
  return profile === TABS_PROFILE ? tabsSuiteName(lensKey) : benchmarkSuiteName(lensKey);
}
