// `summary.native` as the engine `lv` answers it: LensVisualizer's summary tab asked as the analysis drawer asks it, and
// its readouts written down as the tab presents them (`computeOpticalSummary`): since LV #933 OpticStudio's three
// f-numbers under their names, with the aperture control's marked one beside them. Nothing of a value is computed here.
// The tab and its hook are React and cannot be imported: what they do inline is restated, expression by expression,
// with a source canary each (test/integration/lv/canaries.test.ts).
import type {
  SummaryNativeData,
  SummaryNativeLine,
  SummaryNativeSpec,
} from "../../contract/quantities/summaryNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvSpotSetup } from "./spotSetup.ts";
import { linesBeyondCase, tracesAuthored } from "./spot.ts";
import { lvDrawerPupil, lvHookAperture } from "./tabRequest.ts";
import type { LvHookApi, LvHookAperture } from "./tabRequest.ts";
import type { LvAnalysisRequest, LvApi, LvOpticalSummary, LvRuntimeLens, LvSurface } from "./types.ts";

/** The LensVisualizer exports the summary is answered with. */
export type LvSummaryApi = LvHookApi &
  Pick<
    LvApi,
    | "createAnalysisRequest"
    | "computeFocusEFL"
    | "computeOpticalSummary"
    | "computeCardinalElementsFromState"
    | "stopRuleGeometry"
    | "epAtZoomClamped"
  >;

/** What the engine makes of a `summary.native` spec. */
export type LvSummaryAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: SummaryNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

const FEATURE = "feature";

/** The method name of the tab. */
export const LV_SUMMARY_TAB = "lv-summary-tab";

/**
 * The stop radius the hook hands the drawer for a case's stop radius, mm. The hook's stop is the stop rule's at the
 * aperture slider's f-number N (`stopSemiDiameterForFNumber`, LV #933), the radius the exporter makes for N
 * (`stopRadius` of exportAperture.ts); wide open it is `currentPhysStopSD`, which is the case's `wideOpenStopSD`
 * unless the slider's widest f-number lies above the zoom position's wide-open one.
 */
export function lvSummaryStopSemiDiameter(hook: LvHookAperture, stopSemiDiameterMm: number): number {
  return stopSemiDiameterMm === hook.wideOpenStopSD ? hook.currentPhysStopSD : stopSemiDiameterMm;
}

/**
 * The f-number the aperture control marks a case's stop with: the slider's `fNumber` at the hook's wide-open stop,
 * and otherwise the f-number whose stop the radius is by LensVisualizer's stop rule (LV #933, paraxial EPD = F/N at
 * infinity focus of the zoom position: radius `|(F / (2 N)) ρ|`, `stopRuleGeometry`), taken back from the radius,
 * `|F ρ| / (2 radius)`: the slider's N to a rounding or two. A mark, never a figure.
 */
export function lvNominalFNumber(
  api: Pick<LvApi, "stopRuleGeometry">,
  runtime: LvRuntimeLens,
  zoomT: number,
  hook: LvHookAperture,
  stopSemiDiameterMm: number,
): number {
  const { wideOpenStopSD, currentPhysStopSD, fNumber } = hook;
  if (stopSemiDiameterMm === wideOpenStopSD || stopSemiDiameterMm === currentPhysStopSD) return fNumber;
  const { referenceFocalLengthMm, stopHeightRatio } = api.stopRuleGeometry(runtime, zoomT);
  return Math.abs(referenceFocalLengthMm * stopHeightRatio) / (2 * stopSemiDiameterMm);
}

/**
 * The request the analysis drawer hands the summary tab for a case, restated from useLensComputation.ts and
 * AnalysisDrawerContent.tsx. The hook's focal length of the state is
 *
 * ```
 * const dynamicEFL = useMemo(() => (firstOrderRequest ? computeFocusEFL(firstOrderRequest) : 0), [firstOrderRequest]);
 * ```
 *
 * where `firstOrderRequest` is a request of the hook's prepared state with constants in its other members, which
 * `computeFocusEFL` does not read (`eflAtPreparedState(request.preparedGeometry)`): it is asked here of a request of
 * the same state. The drawer's request then carries that focal length, the hook's two radii for the case's stop
 * (`lvDrawerPupil` of the pupil, `lvSummaryStopSemiDiameter` of the stop), the hook's field geometry and the quality
 * "settled", whose sampling is every family default.
 */
export function lvSummaryRequest(api: LvSummaryApi, model: LvCaseModel): LvAnalysisRequest {
  const { state, runtime, exported } = model;
  const stop = exported.conditions.stopSemiDiameter;
  const hook = lvHookAperture(api, runtime, state);
  const firstOrder = api.createAnalysisRequest({
    preparedState: state,
    dynamicEFL: 0,
    currentEPSD: hook.currentEPSD,
    currentPhysStopSD: hook.currentPhysStopSD,
  });
  const dynamicEFL = api.computeFocusEFL(firstOrder);
  return api.createAnalysisRequest({
    preparedState: state,
    dynamicEFL,
    currentEPSD: lvDrawerPupil(api, runtime, state, stop),
    currentPhysStopSD: lvSummaryStopSemiDiameter(hook, stop),
    fieldGeometry: lvSpotSetup(api, model).fieldGeometry,
    sampling: {},
  });
}

/** Why the tab cannot answer a spec about a case, decided before LensVisualizer is asked anything. */
function refusals(model: LvCaseModel, spec: SummaryNativeSpec): UnsupportedItem[] {
  const { conditions, system } = model.exported;
  const refused: UnsupportedItem[] = [];
  if (system.opticalPath !== undefined) {
    const message = "LensVisualizer's summary of a folded path is not translated";
    refused.push({ code: FEATURE, item: "path.folded", message });
  }
  const beyond = linesBeyondCase(model, spec.lines);
  if (beyond !== null) return [...refused, beyond];
  if (conditions.imageZ !== model.state.imgZ) {
    const message =
      "LensVisualizer's summary tab is of its prepared state, whose image plane is the design plane, " +
      `z = ${model.state.imgZ} mm; the case's plane is z = ${conditions.imageZ} mm`;
    refused.push({ code: FEATURE, item: "focus.off-design", message });
  }
  const other = spec.lines.filter((line) => !tracesAuthored(model, line));
  if (other.length > 0) {
    const message =
      "LensVisualizer's summary tab is first-order at every surface's authored index; the case's line " +
      `${other.join(", ")} has other indices, or is not its reference line`;
    refused.push({ code: FEATURE, item: "lines.not-authored-reference", message });
  }
  return refused;
}

/** A number of LensVisualizer's, or null where it has none that is finite. */
function finite(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** A member of a sampling record, or none where the value is null. */
function nonNull(name: string, value: number | null): { [name: string]: number } {
  return value === null ? {} : { [name]: value };
}

/** What else the tab and the hook present of the state, by the comparator's names: only what is a finite number. */
function samplingOf(api: LvSummaryApi, model: LvCaseModel, summary: LvOpticalSummary): { [name: string]: number } {
  const stated: { [name: string]: number | null } = {
    infinityFocalLengthMm: finite(summary.infinityEFLMm),
    breathingPercent: finite(summary.breathingPercent),
    focusDistanceM: finite(summary.focusDistanceM),
    // LensVisualizer's stored entrance pupil of the zoom position: its focal length over twice its marked f-number
    // wide open, at infinity focus (`epAtZoomClamped`, which R1 records as lvNominalEntrancePupilSemiDiameter).
    wideOpenNominalEntrancePupilDiameterMm: finite(2 * api.epAtZoomClamped(model.state.zoomT, model.runtime)),
  };
  return Object.fromEntries(Object.entries(stated).filter((entry): entry is [string, number] => entry[1] !== null));
}

/** The index of the one surface of a state that carries a label, or null where none or several do. */
function surfaceIndexOf(surfaces: readonly LvSurface[], label: string): number | null {
  const found = surfaces.flatMap((surface, index) => (surface.label === label ? [index] : []));
  return found.length === 1 ? found[0] : null;
}

/**
 * The tab's two working f-numbers, each under the contract's definition where LensVisualizer's is the same, and under
 * `sampling` by a name of its own where it is not. LensVisualizer forms both at "the current object distance", the
 * paraxial object plane its image plane is conjugate to (`paraxialObjectVergence`), infinite at infinity focus: the
 * case's own axial object point only at infinity focus, where the case's object is at infinity too. At a finite
 * focus the case's object is the conjugate LensVisualizer certifies by its documented distance, which is another
 * point: there both values are null and recorded as `lvParaxialWorkingFNumberAtParaxialObject` and
 * `lvWorkingFNumberAtParaxialObject`. The real marginal ray's f-number is a number only where LensVisualizer traced
 * it (`traced`); a vignetted one names the surface (`lvMarginalRayVignettedSurfaceIndex`, with
 * `lvMarginalRayVignettedBeforeStop` 1 before the stop and 0 after it).
 */
function workingFNumbers(
  model: LvCaseModel,
  summary: LvOpticalSummary,
): {
  readonly paraxialWorkingFNumber: number | null;
  readonly workingFNumber: number | null;
  readonly sampling: { [name: string]: number };
} {
  const atInfinity = model.exported.conditions.object.kind === "infinity" && model.state.focusT === 0;
  const working = summary.workingFNumber;
  const traced = working.status === "traced" ? finite(working.value) : null;
  const paraxial = finite(summary.paraxialWorkingFNumber);
  const sampling: { [name: string]: number } = {};
  if (!atInfinity) {
    Object.assign(sampling, nonNull("lvParaxialWorkingFNumberAtParaxialObject", paraxial));
    Object.assign(sampling, nonNull("lvWorkingFNumberAtParaxialObject", traced));
  }
  if (working.status === "vignetted") {
    Object.assign(
      sampling,
      nonNull("lvMarginalRayVignettedSurfaceIndex", surfaceIndexOf(model.state.surfaces, working.surfaceLabel)),
    );
    sampling.lvMarginalRayVignettedBeforeStop = working.beforeStop ? 1 : 0;
  }
  return {
    paraxialWorkingFNumber: atInfinity ? paraxial : null,
    workingFNumber: atInfinity ? traced : null,
    sampling,
  };
}

/**
 * LensVisualizer's summary tab, asked for a spec about a case.
 *
 * - The request is the drawer's (`lvSummaryRequest`); the readouts are `computeOpticalSummary`'s as the tab presents
 *   them: its current focal length (`focalLengthMm`), entrance pupil, physical stop, total track and half field, and
 *   since LV #933 OpticStudio's three f-numbers under their names. Its "Image-space f/#", EFL over EPD, both paraxial
 *   (`imageSpaceFNumber` of the state and the stop), is the contract's `imageSpaceFNumber`. Its "Paraxial working
 *   f/#", `1 / (2 n' |u'|)` of the paraxial marginal ray through the stop rim, and its "Working f/#",
 *   `1 / (2 n' sin θ')` of the real marginal ray aimed at the stop rim, are the contract's two working f-numbers at
 *   infinity focus and are recorded under `sampling` elsewhere (`workingFNumbers`). `rearFocalZ` is the rear focal
 *   point of the tab's own cardinal construction (`computeCardinalElementsFromState`, whose back focus the tab
 *   presents).
 * - The aperture control's marked f-number is `nominalFNumber` (`lvNominalFNumber`). Its thin-lens "eff. f/" is gone
 *   (#933): the control shows the paraxial working f-number beside the mark instead, which is the tab's.
 *
 * Every line asked has the same values: they are of the authored indices. Unsupported: a folded path, a line the case
 * does not have (`line`), a case off the design plane, and a line whose indices are not the authored ones.
 */
export function answerLvSummary(api: LvSummaryApi, model: LvCaseModel, spec: SummaryNativeSpec): LvSummaryAnswer {
  // What the case and the spec decide comes first, before LensVisualizer is asked anything.
  const refused = refusals(model, spec);
  if (refused.length > 0) return { unsupported: refused };
  const { state, runtime, exported } = model;
  const request = lvSummaryRequest(api, model);
  const summary = api.computeOpticalSummary(request);
  const cardinals = api.computeCardinalElementsFromState(state);
  const hook = lvHookAperture(api, runtime, state);
  const nominal = lvNominalFNumber(api, runtime, state.zoomT, hook, exported.conditions.stopSemiDiameter);
  const working = workingFNumbers(model, summary);
  const sampling = { ...samplingOf(api, model, summary), ...working.sampling };
  const lines = spec.lines.map((line): SummaryNativeLine => ({
    line,
    wavelengthNm: exported.conditions.lines[line].wavelengthNm,
    status: "ok",
    rearFocalZ: finite(cardinals?.points.rearFocal.z),
    focalLengthMm: finite(summary.currentEFLMm),
    entrancePupilDiameterMm: finite(summary.entrancePupilDiameterMm),
    stopDiameterMm: finite(summary.physicalStopDiameterMm),
    imageSpaceFNumber: finite(summary.imageSpaceFNumber),
    paraxialWorkingFNumber: working.paraxialWorkingFNumber,
    workingFNumber: working.workingFNumber,
    nominalFNumber: finite(nominal),
    totalTrackMm: finite(summary.totalTrackMm),
    halfFieldDeg: finite(summary.halfFieldDeg),
    sampling,
  }));
  const data: SummaryNativeData = {
    lines,
    method: {
      name: LV_SUMMARY_TAB,
      params: {
        stopSemiDiameterMm: request.aperture.stopSemiDiameterMm,
        pupilSemiDiameterMm: request.aperture.entrancePupilSemiDiameterMm,
        imageSpaceFNumber: 'the tab\'s "Image-space f/#": EFL / EPD, both paraxial, of the state and its stop',
        paraxialWorkingFNumber:
          "the tab's \"Paraxial working f/#\": 1 / (2 n' |u'|) of the paraxial marginal ray through the stop rim, at the paraxial object distance the image plane is conjugate to",
        workingFNumber:
          "the tab's \"Working f/#\": 1 / (2 n' sin θ') of the real marginal ray aimed at the stop rim, at the same object distance",
      },
    },
    notes: [
      "the entrance pupil is the hook's: the stop radius over the paraxial marginal ray's height ratio at the stop",
      "the half field is the hook's analysis field geometry: the field whose solved chief ray lands at the image corner, the last field whose chief ray clears every aperture where one clips it short of the corner, or the projection's authored trace field",
    ],
  };
  return { data, counts: { lines: lines.length } };
}
