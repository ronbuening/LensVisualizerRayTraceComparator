// `curvature.native` as the engine `lv` answers it: LensVisualizer's field-curve and astigmatism sections (its
// aberrations tab) asked as the analysis drawer asks them, and their numbers written down as the sections present
// them: `computeFieldCurvatureBundle`, its field curves at the authored indices and its chromatic field curves at each
// of its channels. Nothing of a figure is computed here: the foci are LensVisualizer's own shifts from its design
// plane, and the landing that identifies a field is its own chief ray's (`chiefImageHeight`).
import type {
  CurvatureNativeData,
  CurvatureNativeField,
  CurvatureNativeSpec,
} from "../../contract/quantities/curvatureNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import { indexDelta, lvChannelLines } from "./axial.ts";
import type { LvAxialAnswerApi } from "./axial.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefGeometry, lvChiefRequest } from "./chiefSetup.ts";
import type { LvChiefSetupApi } from "./chiefSetup.ts";
import {
  isCurvatureFieldRefusal,
  lvCurvatureFields,
  lvCurvatureLine,
  lvCurvaturePlaneZ,
  lvParabasalFraction,
} from "./curvatureFields.ts";
import type { LvCurvatureFieldsApi } from "./curvatureFields.ts";
import { linesBeyondCase } from "./spot.ts";
import { lvTabPupilSemiDiameter } from "./spotSetup.ts";
import type { LvApi, LvFieldCurvatureField, LvFieldCurvatureResult } from "./types.ts";

/** The LensVisualizer exports a field curve is answered with. */
export type LvCurvatureAnswerApi = LvChiefSetupApi &
  LvCurvatureFieldsApi &
  Pick<LvAxialAnswerApi, "chromaticChannelWavelengthsNm" | "eLineChannelWavelengthsNm" | "lensChromaticReference"> &
  Pick<LvApi, "computeFieldCurvatureBundle">;

/** What the engine makes of a `curvature.native` spec. */
export type LvCurvatureAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: CurvatureNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

const FEATURE = "feature";
const OPTION = "option";

/** The method name of the sections. */
export const LV_FIELD_CURVES = "lv-field-curves";

/** A case off the plane the sections place their foci from. */
function offDesign(imagePlaneZ: number, model: LvCaseModel): UnsupportedItem | null {
  const imageZ = model.exported.conditions.imageZ;
  if (imageZ === imagePlaneZ) return null;
  const message =
    `LensVisualizer's field curves place their foci from the design image plane, z = ${imagePlaneZ} mm; ` +
    `the case's plane is z = ${imageZ} mm`;
  return { code: FEATURE, item: "focus.off-design", message };
}

/** Why the sections cannot answer a spec about a case, before anything is asked of LensVisualizer but its channels. */
function refusals(api: LvCurvatureAnswerApi, model: LvCaseModel, spec: CurvatureNativeSpec): UnsupportedItem[] {
  const { conditions, system } = model.exported;
  const refused: UnsupportedItem[] = [];
  if (conditions.object.kind !== "infinity") {
    const message = "LensVisualizer's field curves launch collimated rays";
    refused.push({ code: FEATURE, item: "object.finite", message });
  }
  if (system.opticalPath !== undefined) {
    const message = "LensVisualizer's field curves of a folded path are not translated";
    refused.push({ code: FEATURE, item: "path.folded", message });
  }
  const beyond = linesBeyondCase(model, spec.lines);
  if (beyond !== null) return [...refused, beyond];
  // The sections place their foci from the design plane: decided from the prepared state, before they are asked.
  const plane = offDesign(lvCurvaturePlaneZ(model), model);
  if (plane !== null) refused.push(plane);
  const traced = spec.lines.map((line) => lvCurvatureLine(api, model, line));
  if (traced.every((made) => made.kind === "none")) {
    const mixed = traced.some((made) => made.kind === "none" && made.reason === "lv-mixed-reference");
    const channels = lvChannelLines(api, model);
    const message = mixed
      ? "the lens mixes d-line and e-line indices, so no channel of LensVisualizer's chromatic field curves is of " +
        "one line, and no line asked is its authored reference line"
      : "no line asked is LensVisualizer's authored reference line or a channel of its chromatic field curves " +
        `(${Object.values(channels ?? {}).join(", ")} nm)`;
    refused.push({ code: FEATURE, item: mixed ? "lines.mixed-reference" : "lines.not-traced", message });
  }
  return refused;
}

/** An unavailable field of an answer, with LensVisualizer's reason. */
function unavailableField(
  line: number,
  wavelengthNm: number,
  fieldAngleDeg: number,
  reason: string,
  sampling: { readonly [name: string]: number } = {},
): CurvatureNativeField {
  return {
    line,
    wavelengthNm,
    fieldAngleDeg,
    status: "unavailable",
    reason,
    chiefLandingMm: null,
    tangentialShiftMm: null,
    sagittalShiftMm: null,
    sampling,
  };
}

/** A field of a result of the sections, of a fraction: of its curve, or of the fields it marks. */
function fieldAt(result: LvFieldCurvatureResult, fraction: number): LvFieldCurvatureField | undefined {
  return (
    result.curveFields.find((field) => field.fieldFraction === fraction) ??
    result.fields.find((field) => field.fieldFraction === fraction)
  );
}

/**
 * The sections' field at the authored indices: the parabasal foci as their shifts from the design plane, the chief
 * ray's landing there, and in `sampling` how many of the four parabasal rays landed, the Petzval shift the sections
 * draw beside the curves (paraxial: no ray of it is traced), and the foci of the real-ray fans where the sections have
 * them.
 */
function authoredField(
  line: number,
  wavelengthNm: number,
  angle: number,
  field: LvFieldCurvatureField,
  parabasalFraction: number,
): CurvatureNativeField {
  if (!field.usable) return unavailableField(line, wavelengthNm, angle, "lv-field-unusable");
  const realRay: { [name: string]: number } = {};
  if (field.diagnosticTangentialShiftMm !== undefined && field.diagnosticSagittalShiftMm !== undefined) {
    realRay.realRayTangentialShiftMm = field.diagnosticTangentialShiftMm;
    realRay.realRaySagittalShiftMm = field.diagnosticSagittalShiftMm;
  }
  return {
    line,
    wavelengthNm,
    fieldAngleDeg: angle,
    status: "ok",
    chiefLandingMm: field.chiefImageHeight,
    tangentialShiftMm: field.tangentialShiftMm,
    sagittalShiftMm: field.sagittalShiftMm,
    sampling: {
      parabasalFraction,
      validSampleCount: field.validSampleCount,
      petzvalShiftMm: field.petzvalShiftMm,
      ...realRay,
    },
  };
}

/**
 * LensVisualizer's field-curve and astigmatism sections, asked for a spec about a case.
 *
 * - At a line whose indices are the authored ones (`tracesAuthored`): the sections' field curves, each field's
 *   parabasal tangential and sagittal shifts from the design plane and its chief ray's landing.
 * - At a line whose wavelength is one of the chromatic channels' (`lvChannelLines`): the chromatic field curves, the
 *   shifts of the same rays traced at the channel's indices, which `sampling.indexMaxDelta` sets against the case's.
 *   The sections state no landing of a channel's chief ray: `chiefLandingMm` is null there.
 * - A line that is neither is unavailable at every field (`lv-no-channel-at-line`).
 * - The fields are of the sections' own (`lvCurvatureFields`, the case source's too), each angle one of them to the
 *   bit; the request is the drawer's (`lvChiefRequest`).
 *
 * Unsupported: a finite object, a folded path, a line the case does not have (`line`), a case off the design plane,
 * no line asked that the sections trace, and fields other than the sections' own.
 */
export function answerLvCurvature(
  api: LvCurvatureAnswerApi,
  model: LvCaseModel,
  spec: CurvatureNativeSpec,
): LvCurvatureAnswer {
  // What the case and the spec decide comes first, before LensVisualizer is asked anything but its channels.
  const refused = refusals(api, model, spec);
  if (refused.length > 0) return { unsupported: refused };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const message = "LensVisualizer's field geometry of the state has no half field";
    return { unsupported: [{ code: FEATURE, item: "field.no-half-field", message }] };
  }
  const request = lvChiefRequest(api, model);
  // The fields with a launch, of which the case source's ask is (it leaves out a field whose rays would start behind
  // the first surface): each angle asked must be one of them, to the bit.
  const launched = lvCurvatureFields(api, request, geometry).flatMap(({ fieldFraction, made }) =>
    isCurvatureFieldRefusal(made) ? [] : [{ fieldFraction, angle: made.fieldAngleDeg }],
  );
  const fields = spec.fieldAnglesDeg.map((angle) => launched.find((field) => Object.is(field.angle, angle)));
  if (fields.some((field) => field === undefined)) {
    const own = launched.map((field) => field.angle);
    const message = `LensVisualizer's field curves trace their own fields: ${own.join(", ")} degrees`;
    return { unsupported: [{ code: OPTION, item: "fields.angles", message }] };
  }
  const bundle = api.computeFieldCurvatureBundle(request);
  const lines = model.exported.conditions.lines;
  const base = bundle.fieldCurvature;
  const chromatic = bundle.chromaticFieldCurvature;
  // computeFieldCurvatureBundle: null where fewer than two fields are usable.
  for (const result of [base, chromatic]) {
    if (result === null) continue;
    const plane = offDesign(result.imagePlaneZ, model);
    if (plane !== null) return { unsupported: [plane] };
  }
  const parabasalFraction = lvParabasalFraction(lvTabPupilSemiDiameter(api, model));
  const answered: CurvatureNativeField[] = spec.lines.flatMap((line) => {
    const wavelengthNm = lines[line].wavelengthNm;
    const traced = lvCurvatureLine(api, model, line);
    return fields.map((asked): CurvatureNativeField => {
      const { fieldFraction, angle } = asked!;
      if (traced.kind === "none") return unavailableField(line, wavelengthNm, angle, traced.reason);
      if (traced.kind === "authored") {
        const field = base === null ? undefined : fieldAt(base, fieldFraction);
        if (field === undefined) return unavailableField(line, wavelengthNm, angle, "lv-field-curves-unavailable");
        return authoredField(line, wavelengthNm, angle, field, parabasalFraction);
      }
      const sampling = { indexMaxDelta: indexDelta(model, line, traced.channel) };
      const field = chromatic === null ? undefined : fieldAt(chromatic, fieldFraction);
      const shift = field?.chromaticFieldShifts?.find((each) => each.channel === traced.channel);
      if (field === undefined || !field.usable || shift === undefined) {
        return unavailableField(line, wavelengthNm, angle, "lv-channel-unavailable", sampling);
      }
      return {
        line,
        wavelengthNm,
        fieldAngleDeg: angle,
        status: "ok",
        chiefLandingMm: null,
        tangentialShiftMm: shift.tangentialShiftMm,
        sagittalShiftMm: shift.sagittalShiftMm,
        sampling,
      };
    });
  });
  const offCase = answered.some((field) => (field.sampling.indexMaxDelta ?? 0) > 0);
  const channelLines = answered.some((field) => field.status === "ok" && field.chiefLandingMm === null);
  const data: CurvatureNativeData = {
    fields: answered,
    method: {
      name: LV_FIELD_CURVES,
      params: {
        stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter,
        parabasalFraction,
        parabasalRayHeightMm: 0.01,
        focus: "least-squares crossing of the parabasal rays with the chief ray, along z from the design plane",
      },
    },
    notes: [
      "LensVisualizer solves each field's chief ray through the centre of the real stop, and launches its paraxial estimate below 1 degree",
      "the foci are of four parabasal rays 0.01 mm from the chief ray on the first vertex plane (a pupil fraction between 1e-4 and 0.02)",
      ...(channelLines
        ? [
            "LensVisualizer's chromatic field curves trace each field's chief-ray launch at every channel and state no landing of it",
          ]
        : []),
      ...(offCase
        ? [
            "LensVisualizer's chromatic field curves trace some media at indices of its own, not the case's (sampling.indexMaxDelta)",
          ]
        : []),
    ],
  };
  return { data, counts: { fields: answered.length } };
}
