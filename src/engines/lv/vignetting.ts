// `vignetting.native` as the engine `lv` answers it: LensVisualizer's vignetting tab asked as the analysis drawer asks
// it, and its curve written down as the tab presents it (`computeVignettingCurve`): each field's geometric
// transmission, the area on the launch plane of its beam traced in two dimensions on its MTF's launch lattice, and its
// relative illumination, the beam's flux times the cosine of the field angle over the image area a unit of object
// solid angle covers, each over the axis's. Nothing of a figure is computed here; the landing that identifies a field
// is LensVisualizer's own solved chief ray's, and which fields the tab samples, which of them have a beam and how it
// maps each onto the image is decided once, with the case source's sets (vignettingFields.ts).
import type {
  VignettingNativeData,
  VignettingNativeField,
  VignettingNativeSpec,
} from "../../contract/quantities/vignettingNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefGeometry, lvChiefRequest } from "./chiefSetup.ts";
import { lvCurvaturePlaneZ } from "./curvatureFields.ts";
import { linesBeyondCase, tracesAuthored } from "./spot.ts";
import type { LvApi } from "./types.ts";
import {
  LV_VIGNETTING_BEAM_CELLS,
  LV_VIGNETTING_MAPPING_STEP_DEG,
  isVignettingRefusal,
  lvVignettingDecision,
  lvVignettingMapping,
} from "./vignettingFields.ts";
import type { LvVignettingFieldsApi } from "./vignettingFields.ts";

/** The LensVisualizer exports a vignetting curve is answered with. */
export type LvVignettingAnswerApi = LvVignettingFieldsApi &
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
 *   transmission and relative illumination as the tab presents them, and the landing on the design plane of the
 *   field's solved chief ray (`chiefRayImageHeightAccurateForRuntimeLens`, with the drawer's geometry), what
 *   identifies the field.
 * - The fields are of the tab's own (`lvVignettingDecision`, the case source's too), each angle one of those with a
 *   beam to the bit, the axis first; the request is the drawer's (`lvChiefRequest`). `sampling` states the cells
 *   across the beam (`gridCells`), whether the tab traced one half of it and mirrored it (`mirrored`), and whether it
 *   mapped the beam onto the image with ray tubes traced without aperture checks (`tubeMapping`, 1) rather than its lit
 *   chief rays (0).
 * - A state the tab draws no curve of (no pupil, outside its MTF's beam model, a field launched from a bounding sphere)
 *   leaves every field asked of its angles unavailable with that reason; a curve the tab has none of for another reason
 *   (no beam of the axis, a beam whose image mapping cannot be traced) every field (`lv-no-curve`).
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
  const decision = lvVignettingDecision(api, model, geometry);
  // The fields with a beam, of which the case source's ask is (it leaves out a field whose rays would start behind the
  // first surface): each angle asked must be one of them, to the bit. A state with no curve has the tab's angles.
  const own =
    "refused" in decision
      ? decision.anglesDeg.map((angle, index) => ({ index, angle, beam: null }))
      : decision.fields.flatMap(({ index, fieldAngleDeg, made }) =>
          isVignettingRefusal(made) ? [] : [{ index, angle: fieldAngleDeg, beam: made }],
        );
  const fields = spec.fieldAnglesDeg.map((angle) => own.find((field) => Object.is(field.angle, angle)));
  if (fields.some((field) => field === undefined)) {
    const message = `LensVisualizer's vignetting tab samples its own fields: ${own.map((field) => field.angle).join(", ")} degrees`;
    return { unsupported: [{ code: OPTION, item: "fields.angles", message }] };
  }
  const lines = model.exported.conditions.lines;
  const request = lvChiefRequest(api, model);
  const fieldSamples = "refused" in decision ? decision.anglesDeg.length : decision.fields.length;
  const params = {
    stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter,
    pupilSemiDiameterMm: request.aperture.entrancePupilSemiDiameterMm,
    gridCells: LV_VIGNETTING_BEAM_CELLS,
    fieldSamples,
    mappingStepDeg: LV_VIGNETTING_MAPPING_STEP_DEG,
    illumination:
      "flux of the beam's lit cells times the cosine of the field angle over the image area a unit of object solid angle covers",
  };
  const notes = [
    "LensVisualizer traces each field's beam on its MTF's launch lattice over the footprint it finds, one half of it mirrored where every surface is of revolution, and counts the cells whose rays pass every aperture",
    "the relative illumination is the beam's flux, weighted by bulk transmission, times the cosine of the field angle, over (dh/dθ)(h/sin θ) of lit chief rays 0.01 degrees apart, or of the median ray tube of the beam where they are vignetted; each figure is relative to the axis",
  ];
  if ("refused" in decision) {
    const answered = spec.lines.flatMap((line) =>
      fields.map((asked) => unavailableField(line, lines[line].wavelengthNm, asked!.angle, decision.refused.code)),
    );
    const data: VignettingNativeData = {
      fields: answered,
      method: { name: LV_VIGNETTING_TAB, params },
      notes: [...notes, `the tab draws no curve of the state: ${decision.refused.message}`],
    };
    return { data, counts: { fields: answered.length } };
  }
  const curve = api.computeVignettingCurve(request);
  const { state, runtime } = model;
  const zPos = [...state.z];
  const mirrored = decision.setup.mirror ? 1 : 0;
  const tubes: number[] = [];
  const mapping = fields.map((asked) => {
    const tube = lvVignettingMapping(api, model, decision.setup, asked!.beam!) === "tube" ? 1 : 0;
    if (tube === 1) tubes.push(asked!.angle);
    return tube;
  });
  const answered: VignettingNativeField[] = spec.lines.flatMap((line) => {
    const wavelengthNm = lines[line].wavelengthNm;
    return fields.map((asked, at): VignettingNativeField => {
      const { index, angle } = asked!;
      // computeVignettingCurve: an empty curve where the axis has no beam or a beam's mapping cannot be traced.
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
        sampling: { gridCells: LV_VIGNETTING_BEAM_CELLS, fieldSamples, mirrored, tubeMapping: mapping[at] },
      };
    });
  });
  const data: VignettingNativeData = {
    fields: answered,
    method: { name: LV_VIGNETTING_TAB, params },
    notes: [
      ...notes,
      ...(tubes.length === 0
        ? []
        : [
            `the image mapping of the fields at ${tubes.join(", ")} degrees is of ray tubes traced without aperture checks (sampling.tubeMapping)`,
          ]),
    ],
  };
  return { data, counts: { fields: answered.length } };
}
