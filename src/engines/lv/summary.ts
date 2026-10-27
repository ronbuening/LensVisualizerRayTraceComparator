// `summary.native` as the engine `lv` answers it: LensVisualizer's summary tab asked as the analysis drawer asks it, and
// its readouts written down as the tab presents them (`computeOpticalSummary`), with the two f-numbers its aperture
// control presents beside them: the marked one and its effective one ("eff. f/"). Nothing of a value is computed here.
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
import { lvHookAperture, lvPupilSeed } from "./tabRequest.ts";
import type { LvHookApi, LvHookAperture } from "./tabRequest.ts";
import type { LvAnalysisRequest, LvApi, LvOpticalSummary } from "./types.ts";

/** The LensVisualizer exports the summary is answered with. */
export type LvSummaryApi = LvHookApi &
  Pick<
    LvApi,
    | "createAnalysisRequest"
    | "computeFocusEFL"
    | "computeOpticalSummary"
    | "computeCardinalElementsFromState"
    | "effectiveFNumber"
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
 * The stop radius the hook hands the drawer for a case's stop radius, mm. The hook derives its stop radius from the
 * aperture slider's f-number N, `(wideOpenStopSD * currentFOPEN) / N`; wide open that is `currentPhysStopSD`, which on
 * some lenses is a unit in the last place from `wideOpenStopSD`, the case's (`lvHookStop`), and the tab presents the
 * former. Any other radius is the hook's own for the f-number it is the stop of, as the exporter makes it
 * (`stopRadius` of exportAperture.ts, the same expression).
 */
export function lvSummaryStopSemiDiameter(hook: LvHookAperture, stopSemiDiameterMm: number): number {
  return stopSemiDiameterMm === hook.wideOpenStopSD ? hook.currentPhysStopSD : stopSemiDiameterMm;
}

/**
 * The f-number the aperture control marks a case's stop with: the slider's `fNumber`, which is the hook's own at its
 * wide-open stop, and otherwise the f-number the radius is the stop of by the hook's rule,
 * `(wideOpenStopSD * currentFOPEN) / radius` (as `lvPupilSeed` takes it).
 */
export function lvNominalFNumber(hook: LvHookAperture, stopSemiDiameterMm: number): number {
  const { wideOpenStopSD, currentFOPEN, currentPhysStopSD, fNumber } = hook;
  if (stopSemiDiameterMm === wideOpenStopSD || stopSemiDiameterMm === currentPhysStopSD) return fNumber;
  return (wideOpenStopSD * currentFOPEN) / stopSemiDiameterMm;
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
 * (`lvTabPupilSemiDiameter` of the pupil, `lvSummaryStopSemiDiameter` of the stop), the hook's field geometry and the
 * quality "settled", whose sampling is every family default.
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
    currentEPSD: lvPupilSeed(hook, stop),
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

/**
 * LensVisualizer's summary tab, asked for a spec about a case.
 *
 * - The request is the drawer's (`lvSummaryRequest`); the readouts are `computeOpticalSummary`'s as the tab presents
 *   them: its current focal length (`focalLengthMm`), entrance pupil, physical stop, total track and half field, and
 *   its "Working f/#", the current focal length over the entrance pupil's diameter, which is the contract's
 *   `imageSpaceFNumber`. `rearFocalZ` is the rear focal point of the tab's own cardinal construction
 *   (`computeCardinalElementsFromState`, whose back focus the tab presents).
 * - The aperture control's marked f-number is `nominalFNumber` (`lvNominalFNumber`). Its effective f-number,
 *   `effectiveFNumber(fNumber, focusT, zoomT, L, aberrationT)` of the hook (the marked one at infinity, a thin-lens
 *   bellows estimate of stored pupils elsewhere), is of no definition of the contract's: it is recorded under
 *   `sampling.lvThinLensEffectiveFNumber`, and `paraxialWorkingFNumber` is null.
 * - LensVisualizer traces no real marginal ray for an f-number: `workingFNumber` is null.
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
  const nominal = lvNominalFNumber(hook, exported.conditions.stopSemiDiameter);
  const effective = api.effectiveFNumber(nominal, state.focusT, state.zoomT, runtime, 0);
  const sampling = { ...samplingOf(api, model, summary), ...nonNull("lvThinLensEffectiveFNumber", finite(effective)) };
  const lines = spec.lines.map((line): SummaryNativeLine => ({
    line,
    wavelengthNm: exported.conditions.lines[line].wavelengthNm,
    status: "ok",
    rearFocalZ: finite(cardinals?.points.rearFocal.z),
    focalLengthMm: finite(summary.currentEFLMm),
    entrancePupilDiameterMm: finite(summary.entrancePupilDiameterMm),
    stopDiameterMm: finite(summary.physicalStopDiameterMm),
    imageSpaceFNumber: finite(summary.effectiveFNumber),
    paraxialWorkingFNumber: null,
    workingFNumber: null,
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
        imageSpaceFNumber: "the tab's \"Working f/#\": the current focal length over the entrance pupil's diameter",
        lvThinLensEffectiveFNumber:
          'the aperture control\'s "eff. f/": N (1 + |m| / p) of a thin lens and stored pupils, the mark at infinity',
      },
    },
    notes: [
      "the entrance pupil is the hook's: the stop radius over the height at the stop of a real ray 1e-4 mm from the axis, parallel to it",
      "the half field is the hook's analysis field geometry: the field whose solved chief ray lands at the image corner, the last field whose chief ray clears every aperture where one clips it short of the corner, or the projection's authored trace field",
    ],
  };
  return { data, counts: { lines: lines.length } };
}
