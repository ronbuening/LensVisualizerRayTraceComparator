// `vignetting.native` as the engine `lv` answers it: LensVisualizer's vignetting tab asked as the analysis drawer asks
// it, and its curve written down as the tab presents it (`computeVignettingCurve`): each field's geometric
// transmission, the fraction of the tab's one meridional sweep across a fixed pupil that passes every aperture, and its
// relative illumination, the sweep's transmitted intensity times cos^4 of the field angle, each over the axis's.
// Nothing of a figure is computed here; the landing that identifies a field is LensVisualizer's own solved chief ray's,
// the ray the tab centres its sweep on.
import type {
  VignettingNativeData,
  VignettingNativeField,
  VignettingNativeSpec,
} from "../../contract/quantities/vignettingNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefGeometry, lvChiefRequest } from "./chiefSetup.ts";
import type { LvChiefSetupApi } from "./chiefSetup.ts";
import { lvCurvaturePlaneZ } from "./curvatureFields.ts";
import { linesBeyondCase, tracesAuthored } from "./spot.ts";
import type { LvApi } from "./types.ts";
import {
  isVignettingFieldRefusal,
  lvVignettingFieldCount,
  lvVignettingFields,
  lvVignettingPupilCount,
} from "./vignettingFields.ts";
import type { LvVignettingFieldsApi } from "./vignettingFields.ts";

/** The LensVisualizer exports a vignetting curve is answered with. */
export type LvVignettingAnswerApi = LvChiefSetupApi &
  LvVignettingFieldsApi &
  Pick<LvApi, "computeVignettingCurve" | "chiefRayImageHeightAccurateForRuntimeLens">;

/** What the engine makes of a `vignetting.native` spec. */
export type LvVignettingAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: VignettingNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

const FEATURE = "feature";
const OPTION = "option";

/** The method name of the tab. */
export const LV_VIGNETTING_TAB = "lv-vignetting-tab";

/** Why the tab cannot answer a spec about a case, decided before LensVisualizer is asked anything. */
function refusals(model: LvCaseModel, spec: VignettingNativeSpec): UnsupportedItem[] {
  const { conditions, system } = model.exported;
  const refused: UnsupportedItem[] = [];
  if (conditions.object.kind !== "infinity") {
    const message = "LensVisualizer's vignetting tab launches collimated rays";
    refused.push({ code: FEATURE, item: "object.finite", message });
  }
  if (system.opticalPath !== undefined) {
    const message = "LensVisualizer's vignetting of a folded path is not translated";
    refused.push({ code: FEATURE, item: "path.folded", message });
  }
  const beyond = linesBeyondCase(model, spec.lines);
  if (beyond !== null) return [...refused, beyond];
  // The field that identifies each field lands on the design plane: decided from the prepared state.
  const designZ = lvCurvaturePlaneZ(model);
  if (conditions.imageZ !== designZ) {
    const message =
      "LensVisualizer's vignetting tab is of its prepared state, whose chief rays land on the design image plane, " +
      `z = ${designZ} mm; the case's plane is z = ${conditions.imageZ} mm`;
    refused.push({ code: FEATURE, item: "focus.off-design", message });
  }
  const other = spec.lines.filter((line) => !tracesAuthored(model, line));
  if (other.length > 0) {
    const message =
      "LensVisualizer's vignetting tab traces every surface at its authored index; the case's line " +
      `${other.join(", ")} has other indices, or is not its reference line`;
    refused.push({ code: FEATURE, item: "lines.not-authored-reference", message });
  }
  return refused;
}

/** An unavailable field of an answer, with LensVisualizer's reason. */
function unavailableField(line: number, wavelengthNm: number, fieldAngleDeg: number, reason: string) {
  const field: VignettingNativeField = {
    line,
    wavelengthNm,
    fieldAngleDeg,
    status: "unavailable",
    reason,
    chiefLandingMm: null,
    geometricTransmission: null,
    relativeIllumination: null,
    sampling: {},
  };
  return field;
}

/**
 * LensVisualizer's vignetting tab, asked for a spec about a case.
 *
 * - At a line whose indices are the authored ones (`tracesAuthored`): the tab's curve, each field's geometric
 *   transmission and relative illumination as the tab presents them, and the landing on the design plane of the solved
 *   chief ray the tab centres the field's sweep on (`chiefRayImageHeightAccurateForRuntimeLens`, with the drawer's
 *   geometry), what identifies the field.
 * - The fields are of the tab's own (`lvVignettingFields`, the case source's too), each angle one of them to the bit,
 *   the axis first; the request is the drawer's (`lvChiefRequest`).
 * - A curve the tab has none of (it draws none where no ray of the axis passes) leaves every field unavailable
 *   (`lv-no-curve`).
 *
 * Unsupported: a finite object, a folded path, a line the case does not have (`line`), a case off the design plane, a
 * line whose indices are not the authored ones, and fields other than the tab's own.
 */
export function answerLvVignetting(
  api: LvVignettingAnswerApi,
  model: LvCaseModel,
  spec: VignettingNativeSpec,
): LvVignettingAnswer {
  // What the case and the spec decide comes first, before LensVisualizer is asked anything.
  const refused = refusals(model, spec);
  if (refused.length > 0) return { unsupported: refused };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const message = "LensVisualizer's field geometry of the state has no half field";
    return { unsupported: [{ code: FEATURE, item: "field.no-half-field", message }] };
  }
  // The fields with a sweep, of which the case source's ask is (it leaves out a field whose rays would start behind
  // the first surface): each angle asked must be one of them, to the bit.
  const launched = lvVignettingFields(api, model, geometry).flatMap(({ index, fieldAngleDeg, made }) =>
    isVignettingFieldRefusal(made) ? [] : [{ index, angle: fieldAngleDeg }],
  );
  const fields = spec.fieldAnglesDeg.map((angle) => launched.find((field) => Object.is(field.angle, angle)));
  if (fields.some((field) => field === undefined)) {
    const own = launched.map((field) => field.angle);
    const message = `LensVisualizer's vignetting tab samples its own fields: ${own.join(", ")} degrees`;
    return { unsupported: [{ code: OPTION, item: "fields.angles", message }] };
  }
  const curve = api.computeVignettingCurve(lvChiefRequest(api, model));
  const { state, runtime } = model;
  const zPos = [...state.z];
  const pupilSamples = lvVignettingPupilCount(api, runtime);
  const fieldSamples = lvVignettingFieldCount(geometry.halfFieldDeg);
  const lines = model.exported.conditions.lines;
  const answered: VignettingNativeField[] = spec.lines.flatMap((line) => {
    const wavelengthNm = lines[line].wavelengthNm;
    return fields.map((asked): VignettingNativeField => {
      const { index, angle } = asked!;
      // computeVignettingCurve: an empty curve where the axis transmits nothing.
      const sample = curve[index];
      if (sample === undefined) return unavailableField(line, wavelengthNm, angle, "lv-no-curve");
      if (!Object.is(sample.fieldAngleDeg, angle)) {
        throw new Error(`the vignetting tab's field ${index} is at ${sample.fieldAngleDeg} degrees, not ${angle}`);
      }
      const landing = api.chiefRayImageHeightAccurateForRuntimeLens(
        angle,
        zPos,
        state.focusT,
        state.zoomT,
        runtime,
        geometry,
        0,
      );
      return {
        line,
        wavelengthNm,
        fieldAngleDeg: angle,
        status: "ok",
        chiefLandingMm: Number.isFinite(landing) ? landing : null,
        geometricTransmission: sample.geometricTransmission,
        relativeIllumination: sample.relativeIllumination,
        sampling: { pupilSamples, fieldSamples },
      };
    });
  });
  const data: VignettingNativeData = {
    fields: answered,
    method: {
      name: LV_VIGNETTING_TAB,
      params: {
        stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter,
        pupilSemiDiameterMm: lvChiefRequest(api, model).aperture.entrancePupilSemiDiameterMm,
        pupilSamples,
        fieldSamples,
        illumination: "transmitted intensity of the meridional sweep times cos^4 of the object-space field angle",
      },
    },
    notes: [
      "LensVisualizer sweeps one meridional line of rays across the entrance pupil's diameter at the axis, centred on each field's solved chief ray on the first vertex plane, and counts the rays that pass every aperture",
      "each figure is relative to the axis; the relative illumination applies cos^4 of the object-space field angle and the bulk transmission of the rays that pass",
    ],
  };
  return { data, counts: { fields: answered.length } };
}
