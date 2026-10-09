// LensVisualizer's own best axial focus for a state, a stop and a set of lines: what the image plane
// "lv-best-axial" of a run is, and what the engine `lv` holds a case with a moved image plane to. It is asked of
// LensVisualizer, never computed here: the first step of its `computeMtfSteps` states the focus the request
// applies to every field, found by its own search on the axial beam.
import type { SpectralLine } from "../../contract/case.ts";
import type { ExportProblem } from "./exportProblems.ts";
import { lvHookAperture, lvPupilSeed } from "./tabRequest.ts";
import type { LvHookApi } from "./tabRequest.ts";
import type { LvApi, LvMtfFocus, LvMtfOptions, LvPreparedState, LvRuntimeLens } from "./types.ts";

/** The LensVisualizer exports a focus is asked with. */
export type LvFocusApi = LvHookApi & Pick<LvApi, "assessMtfSupport" | "computeMtfSteps">;

/**
 * The spectra LensVisualizer's MTF has, by its own names: the reference line, three lines C, d and F, and five
 * photopic lines. A request names one of them; it has no other, and none by wavelength.
 */
export const LV_MTF_SPECTRA = ["reference", "cdf", "photopic"] as const;

/**
 * The codes of a run that asks for the image plane "lv-best-axial" and has none, beside the reasons of
 * LensVisualizer's own gate: its lines are none of LensVisualizer's spectra, whose focus search has no other, or
 * the search found no focus.
 */
export const LV_BEST_AXIAL_PROBLEMS = Object.freeze({
  customSpectrum: "lv-best-axial-needs-lv-spectrum",
  unavailable: "lv-best-axial-unavailable",
} as const);

/**
 * The MTF request every request of the comparator about a stop radius starts from: geometric, on the reference
 * line, at the design plane, with the stop radius as given and, as the seed of the footprint scan, the pupil
 * radius the tab's hook would hand over for that stop radius (`lvPupilSeed`).
 */
export function lvGeneralMtfOptions(
  api: LvHookApi,
  runtime: LvRuntimeLens,
  state: LvPreparedState,
  stopSemiDiameterMm: number,
): LvMtfOptions {
  return {
    method: "geometric",
    spectrum: "reference",
    focus: "design",
    pupilSemiDiameterMm: lvPupilSeed(lvHookAperture(api, runtime, state), stopSemiDiameterMm),
    stopSemiDiameterMm,
    movementActive: false,
  };
}

/**
 * The spectrum of LensVisualizer whose lines are those of a case, or null when none is: the same wavelengths with
 * the same weights in the same order, as its support gate lists them for that spectrum, traced with the indices the
 * case states (the authored ones exactly where LensVisualizer traces that spectrum with them).
 */
export function lvSpectrumOf(
  api: Pick<LvApi, "assessMtfSupport">,
  state: LvPreparedState,
  options: LvMtfOptions,
  lines: readonly Pick<SpectralLine, "wavelengthNm" | "weight" | "indexSource">[],
): (typeof LV_MTF_SPECTRA)[number] | null {
  for (const spectrum of LV_MTF_SPECTRA) {
    const support = api.assessMtfSupport(state, { ...options, spectrum });
    const source = support.useResolvedReference ? "anchored" : "authored";
    const same =
      support.spectralLines.length === lines.length &&
      support.spectralLines.every(
        (line, index) =>
          line.wavelengthNm === lines[index].wavelengthNm &&
          line.weight === lines[index].weight &&
          lines[index].indexSource === source,
      );
    if (same) return spectrum;
  }
  return null;
}

/**
 * The focus LensVisualizer applies to every field of a request: the first step of `computeMtfSteps`, before any
 * field is traced. Null for a request its gate refuses and for a state without a field axis, which have none.
 */
export function lvAxialFocus(
  api: Pick<LvApi, "computeMtfSteps">,
  state: LvPreparedState,
  options: LvMtfOptions,
): LvMtfFocus | null {
  return api.computeMtfSteps(state, options).next().value.focus;
}

/** What a best axial focus is asked for: the stop radius and the lines of a case, and a grid cap when one is stated. */
export interface LvBestAxialAsk {
  readonly stopSemiDiameterMm: number;
  readonly lines: readonly Pick<SpectralLine, "wavelengthNm" | "weight" | "indexSource">[];
  /** The grid cap of the request; LensVisualizer's own default without it. */
  readonly gridCap?: number;
}

/**
 * LensVisualizer's best axial focus for a state at a stop radius and on the lines of one of its spectra: the shift
 * of the plane from the state's image plane, mm, positive away from the lens. The request is the comparator's
 * general one (`lvGeneralMtfOptions`) on the spectrum the lines are (`lvSpectrumOf`), with LensVisualizer's focus
 * mode "best-axial". The search is LensVisualizer's own, on its axial bundle of 64 cells, or of the grid cap when
 * that is smaller, at every line of the spectrum: so the shift is that of one stop, one spectrum and one cap.
 *
 * A problem instead, with a code: the reason of LensVisualizer's gate where it refuses the state; lines that are
 * none of its spectra (`LV_BEST_AXIAL_PROBLEMS.customSpectrum`); a search that found no focus
 * (`LV_BEST_AXIAL_PROBLEMS.unavailable`), as for a state without a field axis or an axial beam.
 */
export function lvBestAxialFocus(
  api: LvFocusApi,
  runtime: LvRuntimeLens,
  state: LvPreparedState,
  ask: LvBestAxialAsk,
): { readonly shiftMm: number } | { readonly problem: ExportProblem } {
  const general = lvGeneralMtfOptions(api, runtime, state, ask.stopSemiDiameterMm);
  const gate = api.assessMtfSupport(state, general);
  if (!gate.available) {
    const message = `LensVisualizer's MTF, whose focus search finds its best axial focus, refuses this state: ${gate.message}`;
    return { problem: { code: gate.reason ?? LV_BEST_AXIAL_PROBLEMS.unavailable, message } };
  }
  const spectrum = lvSpectrumOf(api, state, general, ask.lines);
  if (spectrum === null) {
    const wavelengths = ask.lines.map((line) => line.wavelengthNm).join(", ");
    const message =
      `LensVisualizer's focus search is of one of its spectra (${LV_MTF_SPECTRA.join(", ")}): ` +
      `the lines ${wavelengths} nm are none of them`;
    return { problem: { code: LV_BEST_AXIAL_PROBLEMS.customSpectrum, message } };
  }
  const focus = lvAxialFocus(api, state, {
    ...general,
    spectrum,
    focus: "best-axial",
    fieldFractions: [0],
    ...(ask.gridCap === undefined ? {} : { maxGridSize: ask.gridCap }),
  });
  if (focus === null || focus.mode !== "best-axial" || !Number.isFinite(focus.appliedShiftMm)) {
    const message = "LensVisualizer's focus search finds no best axial focus for this state";
    return { problem: { code: LV_BEST_AXIAL_PROBLEMS.unavailable, message } };
  }
  return { shiftMm: focus.appliedShiftMm };
}
