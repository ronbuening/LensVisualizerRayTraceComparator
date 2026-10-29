// The request LensVisualizer's MTF tab makes for a lens state: what the MTF that LensVisualizer presents was asked
// with. The tab builds it in a React component (src/components/display/analysis/MtfTab.tsx) from numbers of a React
// hook (src/components/hooks/useLensComputation.ts), and neither can be imported. Both are restated here, expression
// by expression and in their order of operations, on the functions and the defaults they themselves read, which
// the binding does import. Source canaries hold every restated expression to LensVisualizer's text
// (test/integration/lv/canaries.test.ts), and an integration test holds the result to a request spelled out again.
import type { MtfMethod, MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import type {
  LvAnalysisRequest,
  LvMtfRequestOptions,
  LvApi,
  LvMtfOptions,
  LvPreparedState,
  LvRuntimeLens,
} from "./types.ts";

/** The LensVisualizer exports the hook's aperture numbers are rebuilt from. */
export type LvHookApi = Pick<
  LvApi,
  | "wideOpenStopAtZoom"
  | "stopSemiDiameterForFNumber"
  | "fopenAtZoomClamped"
  | "fNumberAtStopdown"
  | "computeAnalysisFieldGeometryAtState"
  | "entrancePupilAtState"
>;

/** The LensVisualizer exports the tab's request is rebuilt from. */
export type LvTabApi = LvHookApi &
  Pick<LvApi, "createAnalysisRequest" | "resolveMtfSpectrum" | "mtfDefaultPreferences" | "mtfDefaultFrequencies">;

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
  /**
   * The radius the hook hands the tabs as the stop's: the stop rule's at the slider's f-number
   * (`stopSemiDiameterForFNumber`), which wide open is `wideOpenStopSD`.
   */
  readonly currentPhysStopSD: number;
  /** The paraxial entrance pupil of the wide-open iris at the state, mm. */
  readonly baseEPSD: number;
  /** The radius the hook hands the tabs as the pupil's: the paraxial entrance pupil of `currentPhysStopSD`. */
  readonly currentEPSD: number;
}

/**
 * The hook's aperture numbers for a prepared state, with the aperture slider at wide open (`stopdownT` 0) and the
 * aberration control neutral, as a lens opens. Restated from useLensComputation.ts (LV #933):
 *
 * ```
 * const currentFOPEN = L ? fopenAtZoom(zoomT, L) : 1;
 * const fNumber = L ? fNumberAtStopdown(stopdownT, zoomT, L) : 1;
 * const wideOpenStopSD = L ? wideOpenStopAtZoom(zoomT, L) : 0;
 * const currentPhysStopSD = L ? stopSemiDiameterForFNumber(fNumber, zoomT, L) : 0;
 * const baseEPSD =
 *   L && fieldGeometry ? entrancePupilAtState(wideOpenStopSD, focusT, zoomT, L, fieldGeometry, aberrationT).epSD : 0;
 * const currentEPSD =
 *   L && fieldGeometry ? entrancePupilAtState(currentPhysStopSD, focusT, zoomT, L, fieldGeometry, aberrationT).epSD : 0;
 * ```
 *
 * with `fieldGeometry = computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT)`. The hook's
 * `fopenAtZoom`, `entrancePupilAtState` and `computeAnalysisFieldGeometryAtState` are the functions the binding
 * imports under their rewritten names (the hook aliases fopenAtZoomClamped as fopenAtZoom). Both radii now follow the
 * one stop rule and the state's paraxial pupil (`entrancePupil`: the stop radius over the paraxial marginal ray's
 * height ratio at the stop): no product is divided by its own factor any more, and wide open `currentPhysStopSD` is
 * `wideOpenStopSD` to the bit.
 */
export function lvHookAperture(api: LvHookApi, runtime: LvRuntimeLens, state: LvPreparedState): LvHookAperture {
  const { focusT, zoomT } = state;
  const aberrationT = 0;
  const fieldGeometry = api.computeAnalysisFieldGeometryAtState(focusT, zoomT, runtime, aberrationT);
  const { currentFOPEN, fNumber, wideOpenStopSD, currentPhysStopSD } = lvHookStop(api, runtime, zoomT);
  const baseEPSD = api.entrancePupilAtState(wideOpenStopSD, focusT, zoomT, runtime, fieldGeometry, aberrationT).epSD;
  const currentEPSD = api.entrancePupilAtState(
    currentPhysStopSD,
    focusT,
    zoomT,
    runtime,
    fieldGeometry,
    aberrationT,
  ).epSD;
  return { currentFOPEN, fNumber, wideOpenStopSD, currentPhysStopSD, baseEPSD, currentEPSD };
}

/**
 * The paraxial entrance pupil the hook hands every tab for a stop radius at a state: `currentEPSD` of the slider
 * position whose stop the radius is, `entrancePupilAtState(stop, focusT, zoomT, L, fieldGeometry, aberrationT).epSD`
 * with the hook's field geometry (`lvHookAperture`, the same expression). Since #933 it is the pupil of the radius
 * itself, whatever f-number marks it: no slider position need be found.
 */
export function lvHookPupil(
  api: Pick<LvApi, "computeAnalysisFieldGeometryAtState" | "entrancePupilAtState">,
  runtime: LvRuntimeLens,
  state: LvPreparedState,
  stopSemiDiameterMm: number,
): number {
  const { focusT, zoomT } = state;
  const aberrationT = 0;
  const fieldGeometry = api.computeAnalysisFieldGeometryAtState(focusT, zoomT, runtime, aberrationT);
  return api.entrancePupilAtState(stopSemiDiameterMm, focusT, zoomT, runtime, fieldGeometry, aberrationT).epSD;
}

/** The LensVisualizer exports the hook's stop radius is rebuilt from. */
export type LvHookStopApi = Pick<
  LvApi,
  "wideOpenStopAtZoom" | "stopSemiDiameterForFNumber" | "fopenAtZoomClamped" | "fNumberAtStopdown"
>;

/**
 * The part of the hook's aperture numbers that needs no pupil (`lvHookAperture`): the widest f-number of a zoom
 * position, the f-number of the aperture slider at wide open, the radius of the iris wide open, and the radius the
 * hook hands the tabs as the stop's. The same expressions, in the same order.
 */
export function lvHookStop(
  api: LvHookStopApi,
  runtime: LvRuntimeLens,
  zoomT: number,
): Pick<LvHookAperture, "currentFOPEN" | "fNumber" | "wideOpenStopSD" | "currentPhysStopSD"> {
  const stopdownT = 0;
  const currentFOPEN = api.fopenAtZoomClamped(zoomT, runtime);
  const fNumber = api.fNumberAtStopdown(stopdownT, zoomT, runtime);
  const wideOpenStopSD = api.wideOpenStopAtZoom(zoomT, runtime);
  const currentPhysStopSD = api.stopSemiDiameterForFNumber(fNumber, zoomT, runtime);
  return { currentFOPEN, fNumber, wideOpenStopSD, currentPhysStopSD };
}

/**
 * The pupil radius the hook hands the analysis drawer, and so every tab but the MTF tab's f/8 overlay, for a stop
 * radius: the hook's own `currentEPSD` for its wide-open stop, and otherwise the hook's pupil of the radius
 * (`lvHookPupil`), the slider's `currentEPSD` at the position whose stop it is.
 */
export function lvDrawerPupil(
  api: LvHookApi,
  runtime: LvRuntimeLens,
  state: LvPreparedState,
  stopSemiDiameterMm: number,
): number {
  const { wideOpenStopSD, currentPhysStopSD, currentEPSD } = lvHookAperture(api, runtime, state);
  if (stopSemiDiameterMm === currentPhysStopSD || stopSemiDiameterMm === wideOpenStopSD) return currentEPSD;
  return lvHookPupil(api, runtime, state, stopSemiDiameterMm);
}

/**
 * The pupil radius LensVisualizer's MTF launches are asked with for a stop radius (`pupilSemiDiameterMm`:
 * the aimed launch's launch scale, which sizes its Jacobian probes, and the seed of a launch-plane footprint scan), by
 * the hook's rule (LV #933). For the hook's own wide-open stop, the hook's `currentEPSD`. For the stop of the tab's
 * f/8 comparison, where the tab offers it, the comparison's own pupil, `(currentEPSD * stop) / currentPhysStopSD`
 * (`lvTabComparison`): the tab scales the wide-open request's pupil by the two stops, and that is not the hook's
 * pupil of the f/8 stop to the bit. For any other radius, the hook's pupil of that radius (`lvHookPupil`), which is
 * what the hook hands every tab at the slider position whose stop it is.
 */
export function lvPupilSeed(
  api: LvHookApi,
  runtime: LvRuntimeLens,
  state: LvPreparedState,
  stopSemiDiameterMm: number,
): number {
  const hook = lvHookAperture(api, runtime, state);
  const { wideOpenStopSD, currentPhysStopSD, currentEPSD } = hook;
  if (stopSemiDiameterMm === currentPhysStopSD || stopSemiDiameterMm === wideOpenStopSD) return currentEPSD;
  const comparison = lvTabComparison(api, hook, runtime, state.zoomT);
  if (comparison.unavailable === null && stopSemiDiameterMm === comparison.stopSemiDiameterMm) {
    return lvTabComparisonPupil(hook, stopSemiDiameterMm);
  }
  return lvHookPupil(api, runtime, state, stopSemiDiameterMm);
}

/**
 * The pupil radius of the tab's f/8 comparison for its stop, restated from MtfTab.tsx (LV #933), with the wide-open
 * request's radii the hook's (`createAnalysisRequest` keeps both as given):
 *
 * ```
 * const pupil = (job.aperture.entrancePupilSemiDiameterMm * stop) / job.aperture.stopSemiDiameterMm;
 * ```
 */
export function lvTabComparisonPupil(
  hook: Pick<LvHookAperture, "currentEPSD" | "currentPhysStopSD">,
  stopSemiDiameterMm: number,
): number {
  return (hook.currentEPSD * stopSemiDiameterMm) / hook.currentPhysStopSD;
}

/** The tab's f/8 comparison for a state: the stop it traces, and why it offers none, if it offers none. */
export interface LvTabComparison {
  /** The stop radius of the comparison, mm: `stopSemiDiameterForFNumber(8, zoomT, L)`. */
  readonly stopSemiDiameterMm: number;
  /** Why the tab does not offer the comparison for the state; null when it does. */
  readonly unavailable: string | null;
}

/**
 * The stop of the tab's f/8 comparison, restated from MtfTab.tsx (LV #933: "The f/8 stop comes from the stop rule, as
 * the aperture control's does"):
 *
 * ```
 * const stop = stopSemiDiameterForFNumber(COMPARISON_F_NUMBER, job.preparedGeometry.zoomT, L);
 * ```
 *
 * which is the slider's f/8 stop to the bit. `unavailable` is the tab's own rule, restated, with `fNumber` the
 * hook's:
 *
 * ```
 * const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;
 * ```
 */
export function lvTabComparison(
  api: Pick<LvApi, "stopSemiDiameterForFNumber">,
  hook: Pick<LvHookAperture, "fNumber">,
  runtime: LvRuntimeLens,
  zoomT: number,
): LvTabComparison {
  const { fNumber } = hook;
  const stopSemiDiameterMm = api.stopSemiDiameterForFNumber(LV_TAB_COMPARISON_F_NUMBER, zoomT, runtime);
  let unavailable: string | null = null;
  if (!(!!fNumber && fNumber < LV_TAB_COMPARISON_F_NUMBER - 0.05)) {
    unavailable =
      `the lens is at f/${fNumber} wide open, and LensVisualizer's MTF tab compares with ` +
      `f/${LV_TAB_COMPARISON_F_NUMBER} only a lens that is faster than f/${LV_TAB_COMPARISON_F_NUMBER - 0.05}`;
  } else if (!(runtime.maxFstop >= LV_TAB_COMPARISON_F_NUMBER)) {
    unavailable =
      `the lens stops down to f/${runtime.maxFstop} at most, so LensVisualizer's MTF tab has no ` +
      `f/${LV_TAB_COMPARISON_F_NUMBER} to compare it with`;
  }
  return { stopSemiDiameterMm, unavailable };
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
  readonly request: LvAnalysisRequest;
  readonly settings: LvMtfRequestOptions;
  /** The f-number the view is labelled with: the hook's at wide open, 8 in the comparison. */
  readonly fNumber: number;
  /**
   * The resolved worker options, including the radii. Entry points take request and settings instead.
   * They name no frequencies: LensVisualizer then computes its default list.
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
 *   movementActive,
 * }
 * ```
 *
 * with the hook's two radii (`lvHookAperture`) and no tilt or shift. The view "f8-comparison" is the tab's overlay,
 * a second analysis request with the stop rule's f/8 stop and the wide-open pupil scaled by the two stops (LV #933):
 *
 * ```
 * const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;
 * const stop = stopSemiDiameterForFNumber(COMPARISON_F_NUMBER, job.preparedGeometry.zoomT, L);
 * const pupil = (job.aperture.entrancePupilSemiDiameterMm * stop) / job.aperture.stopSemiDiameterMm;
 * currentEPSD: pupil,
 * currentPhysStopSD: stop,
 * ```
 *
 * Where the tab does not offer the comparison, the request still states the radii those expressions give, and
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
  const [job, settings] = lvMtfInputs(api, state, wideOpen);
  if (view === "wide-open")
    return { view, request: job, settings, fNumber: hook.fNumber, options: wideOpen, ...shared, unavailable: null };

  const { stopSemiDiameterMm: stop, unavailable } = lvTabComparison(api, hook, runtime, state.zoomT);
  const pupil = (job.aperture.entrancePupilSemiDiameterMm * stop) / job.aperture.stopSemiDiameterMm;
  const options = { ...wideOpen, pupilSemiDiameterMm: pupil, stopSemiDiameterMm: stop };
  const [request] = lvMtfInputs(api, state, options);
  return { view, request, settings, fNumber: LV_TAB_COMPARISON_F_NUMBER, options, ...shared, unavailable };
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

/**
 * The one bridge to LV's request entry points. The worker rebuilds the request with dynamicEFL 0;
 * settings omit both radii, which live on the analysis request instead.
 */
export function lvMtfInputs(
  api: Pick<LvApi, "createAnalysisRequest">,
  state: LvPreparedState,
  options: LvMtfOptions,
): [LvAnalysisRequest, LvMtfRequestOptions] {
  const { pupilSemiDiameterMm, stopSemiDiameterMm, ...settings } = options;
  const request = api.createAnalysisRequest({
    preparedState: state,
    dynamicEFL: 0,
    currentEPSD: pupilSemiDiameterMm,
    currentPhysStopSD: stopSemiDiameterMm,
  });
  return [request, settings];
}

/** LV's resolveMtfOptions, expression for expression; lower-level helpers still take both radii in options. */
export function lvResolvedMtfOptions(request: LvAnalysisRequest, options: LvMtfRequestOptions): LvMtfOptions {
  return {
    ...options,
    pupilSemiDiameterMm: request.aperture.entrancePupilSemiDiameterMm,
    stopSemiDiameterMm: request.aperture.stopSemiDiameterMm,
    movementActive: request.pose?.active ?? options.movementActive,
  };
}
