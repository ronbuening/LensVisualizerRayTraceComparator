// The request LensVisualizer's MTF tab makes for a lens state: what the MTF that LensVisualizer presents was asked
// with. The tab builds it in a React component (src/components/display/analysis/MtfTab.tsx) from numbers of a React
// hook (src/components/hooks/useLensComputation.ts), and neither can be imported. Both are restated here, expression
// by expression and in their order of operations, on the functions and the defaults they themselves read, which
// the binding does import. Source canaries hold every restated expression to LensVisualizer's text
// (test/integration/lv/canaries.test.ts), and an integration test holds the result to a request spelled out again.
import type { MtfMethod, MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import type { LvApi, LvMtfOptions, LvPreparedState, LvRuntimeLens } from "./types.ts";

/** The LensVisualizer exports the hook's aperture numbers are rebuilt from. */
export type LvHookApi = Pick<
  LvApi,
  | "wideOpenStopAtZoom"
  | "fopenAtZoom2"
  | "fNumberAtStopdown"
  | "computeAnalysisFieldGeometryAtState2"
  | "entrancePupilAtState2"
>;

/** The LensVisualizer exports the tab's request is rebuilt from. */
export type LvTabApi = LvHookApi &
  Pick<LvApi, "resolveMtfSpectrum" | "mtfDefaultPreferences" | "mtfDefaultFrequencies">;

/**
 * The profile of `mtf.native` that is the MTF tab as it opens: LensVisualizer's default preferences, on the lens
 * wide open or in the tab's own comparison at f/8.
 */
export const LV_TAB_PROFILE = "lv-tab-default";

/** The f-number of the tab's comparison overlay: `COMPARISON_F_NUMBER` in MtfTab.tsx. */
export const LV_TAB_COMPARISON_F_NUMBER = 8;

/**
 * The two requests the tab makes for a state it opens on: the lens wide open, and the overlay that compares it
 * with f/8.
 */
export type LvTabView = "wide-open" | "f8-comparison";

/** The aperture of a state as the hook computes it with its aperture slider at wide open. Names are the hook's. */
export interface LvHookAperture {
  /** The widest f-number of the zoom state. */
  readonly currentFOPEN: number;
  /** The f-number of the slider position: at wide open, never below `currentFOPEN`. */
  readonly fNumber: number;
  /** The radius of the iris wide open at the zoom state, mm: the prepared stop surface's. */
  readonly wideOpenStopSD: number;
  /** The radius the hook hands the tab as the stop's: `wideOpenStopSD` to one rounding, not always to the bit. */
  readonly currentPhysStopSD: number;
  /** The entrance pupil of the wide-open iris at the state, mm. */
  readonly baseEPSD: number;
  /** The radius the hook hands the tab as the pupil's: the seed of the footprint scan. */
  readonly currentEPSD: number;
}

/**
 * The hook's aperture numbers for a prepared state, with the aperture slider at wide open (`stopdownT` 0) and the
 * aberration control neutral, as a lens opens. Restated from useLensComputation.ts:
 *
 * ```
 * const currentFOPEN = L ? fopenAtZoom(zoomT, L) : 1;
 * const fNumber = L ? fNumberAtStopdown(stopdownT, zoomT, L) : 1;
 * const wideOpenStopSD = L ? wideOpenStopAtZoom(zoomT, L) : 0;
 * const currentPhysStopSD = L ? (wideOpenStopSD * currentFOPEN) / fNumber : 0;
 * const baseEPSD =
 *   L && fieldGeometry ? entrancePupilAtState(wideOpenStopSD, focusT, zoomT, L, fieldGeometry, aberrationT).epSD : 0;
 * const currentEPSD = L ? (baseEPSD * currentFOPEN) / fNumber : 0;
 * ```
 *
 * with `fieldGeometry = computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT)`. The hook's
 * `fopenAtZoom`, `entrancePupilAtState` and `computeAnalysisFieldGeometryAtState` are the functions the binding
 * imports under their names with a 2. A product divided by its own factor is not always the other factor again: on
 * some lenses `currentPhysStopSD` is one unit in the last place from `wideOpenStopSD`, and the tab traces with the
 * former.
 */
export function lvHookAperture(api: LvHookApi, runtime: LvRuntimeLens, state: LvPreparedState): LvHookAperture {
  const { focusT, zoomT } = state;
  const aberrationT = 0;
  const fieldGeometry = api.computeAnalysisFieldGeometryAtState2(focusT, zoomT, runtime, aberrationT);
  const { currentFOPEN, fNumber, wideOpenStopSD, currentPhysStopSD } = lvHookStop(api, runtime, zoomT);
  const baseEPSD = api.entrancePupilAtState2(wideOpenStopSD, focusT, zoomT, runtime, fieldGeometry, aberrationT).epSD;
  const currentEPSD = (baseEPSD * currentFOPEN) / fNumber;
  return { currentFOPEN, fNumber, wideOpenStopSD, currentPhysStopSD, baseEPSD, currentEPSD };
}

/** The LensVisualizer exports the hook's stop radius is rebuilt from. */
export type LvHookStopApi = Pick<LvApi, "wideOpenStopAtZoom" | "fopenAtZoom2" | "fNumberAtStopdown">;

/**
 * The part of the hook's aperture numbers that needs no pupil (`lvHookAperture`): the widest f-number of a zoom
 * position, the f-number of the aperture slider at wide open, the radius of the iris wide open, and the radius the
 * hook hands the tab as the stop's. The same expressions, in the same order.
 */
export function lvHookStop(
  api: LvHookStopApi,
  runtime: LvRuntimeLens,
  zoomT: number,
): Pick<LvHookAperture, "currentFOPEN" | "fNumber" | "wideOpenStopSD" | "currentPhysStopSD"> {
  const stopdownT = 0;
  const currentFOPEN = api.fopenAtZoom2(zoomT, runtime);
  const fNumber = api.fNumberAtStopdown(stopdownT, zoomT, runtime);
  const wideOpenStopSD = api.wideOpenStopAtZoom(zoomT, runtime);
  const currentPhysStopSD = (wideOpenStopSD * currentFOPEN) / fNumber;
  return { currentFOPEN, fNumber, wideOpenStopSD, currentPhysStopSD };
}

/**
 * The seed of LensVisualizer's footprint scan for a stop radius, by the hook's rule. The hook derives both radii
 * of a request from one f-number N: the stop's is `(wideOpenStopSD * currentFOPEN) / N` and the pupil's
 * `(baseEPSD * currentFOPEN) / N`. For the stop radius of the hook's own wide-open state, and for the prepared
 * state's, N is the hook's f-number and the seed the hook's own, to the bit. For the stop radius of the tab's f/8
 * comparison, the hook's scaled by `fNumber / 8` (`lvTabComparison`), the seed is the comparison's, the hook's
 * scaled alike, to the bit. For any other radius N is the f-number that radius is the stop of,
 * `(wideOpenStopSD * currentFOPEN) / radius`: the tab reaches such a state only through a slider position, so it
 * has no number there to be equal to.
 */
export function lvPupilSeed(hook: LvHookAperture, stopSemiDiameterMm: number): number {
  const { wideOpenStopSD, currentFOPEN, currentPhysStopSD, baseEPSD, currentEPSD } = hook;
  if (stopSemiDiameterMm === currentPhysStopSD || stopSemiDiameterMm === wideOpenStopSD) return currentEPSD;
  const { scale } = lvTabComparison(hook);
  if (stopSemiDiameterMm === currentPhysStopSD * scale) return currentEPSD * scale;
  const fNumber = (wideOpenStopSD * currentFOPEN) / stopSemiDiameterMm;
  return (baseEPSD * currentFOPEN) / fNumber;
}

/** The tab's f/8 comparison for a state: what it scales both radii by, and why it offers none, if it offers none. */
export interface LvTabComparison {
  /** What the tab multiplies the stop radius and the pupil radius of its wide-open request by. */
  readonly scale: number;
  /** Why the tab does not offer the comparison for the state; null when it does. */
  readonly unavailable: string | null;
}

/**
 * The scale of the tab's f/8 comparison, restated from MtfTab.tsx:
 *
 * ```
 * const scale = fNumber / COMPARISON_F_NUMBER;
 * ```
 *
 * with `fNumber` the hook's. Without `runtime` nothing is said of whether the tab offers the comparison. With it,
 * `unavailable` is the tab's own rule, restated:
 *
 * ```
 * const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;
 * ```
 */
export function lvTabComparison(
  hook: Pick<LvHookAperture, "fNumber">,
  runtime?: Pick<LvRuntimeLens, "maxFstop">,
): LvTabComparison {
  const { fNumber } = hook;
  const scale = fNumber / LV_TAB_COMPARISON_F_NUMBER;
  let unavailable: string | null = null;
  if (runtime === undefined) return { scale, unavailable };
  if (!(!!fNumber && fNumber < LV_TAB_COMPARISON_F_NUMBER - 0.05)) {
    unavailable =
      `the lens is at f/${fNumber} wide open, and LensVisualizer's MTF tab compares with ` +
      `f/${LV_TAB_COMPARISON_F_NUMBER} only a lens that is faster than f/${LV_TAB_COMPARISON_F_NUMBER - 0.05}`;
  } else if (!(runtime.maxFstop >= LV_TAB_COMPARISON_F_NUMBER)) {
    unavailable =
      `the lens stops down to f/${runtime.maxFstop} at most, so LensVisualizer's MTF tab has no ` +
      `f/${LV_TAB_COMPARISON_F_NUMBER} to compare it with`;
  }
  return { scale, unavailable };
}

/**
 * Evenly spaced fractions of the reference image height: `mtfFieldFractions` of MtfTab.tsx, restated.
 *
 * ```
 * const count = Math.round(100 / stepPercent);
 * return Array.from({ length: count + 1 }, (_, i) => i / count);
 * ```
 */
export function lvTabFieldFractions(stepPercent: number): number[] {
  const count = Math.round(100 / stepPercent);
  return Array.from({ length: count + 1 }, (_, i) => i / count);
}

/** One request of the MTF tab for a state. */
export interface LvTabRequest {
  readonly view: LvTabView;
  /** The f-number the view is labelled with: the hook's at wide open, 8 in the comparison. */
  readonly fNumber: number;
  /**
   * The options, member for member as the tab hands them to its worker. They name no frequencies: LensVisualizer
   * then computes its default list.
   */
  readonly options: LvMtfOptions & { readonly fieldFractions: readonly number[]; readonly maxGridSize: number };
  /** The frequencies LensVisualizer computes for a request that names none: its `MTF_FREQUENCIES`. */
  readonly frequenciesPerMm: readonly number[];
  /** The frequencies the tab draws: `frequencies` of its preferences. */
  readonly displayedFrequenciesPerMm: readonly number[];
  /** What `resolveMtfSpectrum` says when the spectrum is not the preferred one, or estimates a dispersion. */
  readonly spectrumNote: string | null;
  /** Why the tab does not offer this view for the state; null when it does. */
  readonly unavailable: string | null;
}

/**
 * The request the MTF tab makes for a prepared state with LensVisualizer's default preferences, restated from
 * MtfTab.tsx:
 *
 * ```
 * const spectrum = resolveMtfSpectrum(preparedState, preferences.spectrum)
 * const options = {
 *   method: preferences.method,
 *   spectrum: spectrum.spectrum,
 *   focus: preferences.focus,
 *   maxGridSize: preferences.maxGridSize,
 *   fieldFractions: mtfFieldFractions(preferences.fieldStepPercent),
 *   pupilSemiDiameterMm: currentEPSD,
 *   stopSemiDiameterMm: currentPhysStopSD,
 *   movementActive,
 * }
 * ```
 *
 * with the hook's two radii (`lvHookAperture`) and no tilt or shift. The view "f8-comparison" is the tab's overlay,
 * the same options with both radii scaled:
 *
 * ```
 * const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;
 * const scale = fNumber / COMPARISON_F_NUMBER;
 * pupilSemiDiameterMm: job.options.pupilSemiDiameterMm * scale,
 * stopSemiDiameterMm: job.options.stopSemiDiameterMm * scale,
 * ```
 *
 * Where the tab does not offer the comparison, the request still states the radii that scaling gives, and
 * `unavailable` says why the tab makes no such request: the lens is not faster than f/8 by the tab's margin, or
 * does not stop down to f/8. Nothing here is computed by LensVisualizer's MTF: the request is only built.
 */
export function lvTabRequest(
  api: LvTabApi,
  runtime: LvRuntimeLens,
  state: LvPreparedState,
  view: LvTabView,
): LvTabRequest {
  const preferences = api.mtfDefaultPreferences;
  const hook = lvHookAperture(api, runtime, state);
  const spectrum = api.resolveMtfSpectrum(state, preferences.spectrum);
  const wideOpen = {
    method: preferences.method,
    spectrum: spectrum.spectrum,
    focus: preferences.focus,
    maxGridSize: preferences.maxGridSize,
    fieldFractions: lvTabFieldFractions(preferences.fieldStepPercent),
    pupilSemiDiameterMm: hook.currentEPSD,
    stopSemiDiameterMm: hook.currentPhysStopSD,
    movementActive: false,
  };
  const shared = {
    frequenciesPerMm: [...api.mtfDefaultFrequencies],
    displayedFrequenciesPerMm: [...preferences.frequencies],
    spectrumNote: spectrum.note,
  };
  if (view === "wide-open") return { view, fNumber: hook.fNumber, options: wideOpen, ...shared, unavailable: null };

  const { scale, unavailable } = lvTabComparison(hook, runtime);
  const options = {
    ...wideOpen,
    pupilSemiDiameterMm: wideOpen.pupilSemiDiameterMm * scale,
    stopSemiDiameterMm: wideOpen.stopSemiDiameterMm * scale,
  };
  return { view, fNumber: LV_TAB_COMPARISON_F_NUMBER, options, ...shared, unavailable };
}

const CONTRACT_METHODS: readonly string[] = ["geometric", "diffraction"] satisfies readonly MtfMethod[];

/**
 * The `mtf.native` spec that a request of the tab is: its frequencies and fields, its method under the contract's
 * name, which is LensVisualizer's, and its focus, where LensVisualizer's "design" is the contract's and both of its
 * other modes are a criterion of its own ("engine-best"). The spec names the profile, which stands for everything
 * of the request that a spec does not state: the spectrum, the grid cap and the two radii. Throws when
 * LensVisualizer's default method is one the contract does not know.
 */
export function lvTabSpec(request: LvTabRequest): MtfNativeSpec {
  const { method, focus, fieldFractions } = request.options;
  if (!CONTRACT_METHODS.includes(method)) {
    throw new Error(`LensVisualizer's MTF tab opens with the method "${method}", which the contract does not know`);
  }
  return {
    frequenciesPerMm: [...request.frequenciesPerMm],
    fields: { kind: "image-height-fractions", values: [...fieldFractions] },
    method: method as MtfMethod,
    focus: focus === "design" ? "design" : "engine-best",
    profile: LV_TAB_PROFILE,
  };
}
