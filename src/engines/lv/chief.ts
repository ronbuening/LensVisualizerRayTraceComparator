// `chief.native` as the engine `lv` answers it: LensVisualizer's distortion tab (its curve), its pupils tab and the
// lateral-colour section of its chromatic tab asked as the analysis drawer asks them, and their numbers written down
// as the tabs present them: `computeDistortionCurve`, `computeBothPupilAberrationProfiles` and
// `computeLateralColorCurve`. Nothing of a figure is computed here but a position the pupils tab states relative to a
// vertex, made absolute with LensVisualizer's own vertex and ratio; the landing that identifies a field is
// LensVisualizer's own solved chief ray's (`chiefRayImageHeightAccurateForRuntimeLens`), or, for lateral colour, the
// section's own.
import type {
  ChiefFigures,
  ChiefNativeData,
  ChiefNativeField,
  ChiefNativeSpec,
  ChiefReference,
} from "../../contract/quantities/chiefNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import { lvChannelLines } from "./axial.ts";
import type { LvAxialAnswerApi } from "./axial.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { isChiefFieldRefusal, lvLateralChief, lvSolvedChief } from "./chiefFields.ts";
import type { LvChiefFieldsApi } from "./chiefFields.ts";
import { lvChiefGeometry, lvChiefRequest, lvDistortionReference } from "./chiefSetup.ts";
import type { LvChiefGeometry, LvChiefSetupApi } from "./chiefSetup.ts";
import { tracesAuthored } from "./spot.ts";
import type { LvApi } from "./types.ts";
import { decodeNdArray, ndRow } from "../../core/numeric/ndarray.ts";

/** The LensVisualizer exports a chief-ray figure is answered with. */
export type LvChiefAnswerApi = LvChiefSetupApi &
  LvChiefFieldsApi &
  Pick<LvAxialAnswerApi, "chromaticChannelWavelengthsNm" | "eLineChannelWavelengthsNm" | "lensChromaticReference"> &
  Pick<
    LvApi,
    | "computeDistortionCurve"
    | "computeBothPupilAberrationProfiles"
    | "computeLateralColorCurve"
    | "chiefRayImageHeightAccurateForRuntimeLens"
    | "isFisheyeProjection"
  >;

/** What the engine makes of a `chief.native` spec. */
export type LvChiefAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: ChiefNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

const FEATURE = "feature";
const OPTION = "option";

/** The method names of the three tabs. */
export const LV_DISTORTION_TAB = "lv-distortion-tab";
export const LV_PUPILS_TAB = "lv-pupils-tab";
export const LV_LATERAL_COLOUR_SECTION = "lv-chromatic-tab";

const NO_FIGURES: ChiefFigures = {
  realHeightMm: null,
  idealHeightMm: null,
  percent: null,
  entrancePupilZ: null,
  exitPupilZ: null,
};

const NO_REFERENCE: ChiefReference = {
  focalScaleMm: null,
  probeAngleDeg: null,
  paraxialEntrancePupilZ: null,
  paraxialExitPupilZ: null,
};

/** The channel traced at a wavelength, or null. */
function channelAt(channels: Readonly<Record<string, number>>, wavelengthNm: number | undefined): string | null {
  return Object.keys(channels).find((channel) => channels[channel] === wavelengthNm) ?? null;
}

/**
 * The design image plane the three tabs present their figures on, restated from `computeDistortionReference` in
 * distortion.ts: `lastSurfZ + (prepareState(...).surfaces[L.N - 1]?.d ?? 0)`. The lateral-colour section's own plane
 * (`currentImagePlaneZ` in chromatic/analysis.ts) is the last vertex plus the same gap; it is decided from this one
 * before the section is asked, and the plane the section states is held to the case's again once it is.
 */
function designPlaneZ(model: LvCaseModel): number {
  const last = model.state.surfaces.length - 1;
  return model.state.z[last] + (model.state.surfaces[last]?.d ?? 0);
}

/** A case off the plane a tab presents its figures on. */
function offDesign(imagePlaneZ: number, model: LvCaseModel): UnsupportedItem | null {
  const imageZ = model.exported.conditions.imageZ;
  if (imageZ === imagePlaneZ) return null;
  const message =
    `LensVisualizer's tabs present their chief rays on the design image plane, z = ${imagePlaneZ} mm; ` +
    `the case's plane is z = ${imageZ} mm`;
  return { code: FEATURE, item: "focus.off-design", message };
}

/** Why the tabs cannot answer a spec about a case, before anything is asked of LensVisualizer but its channels. */
function refusals(api: LvChiefAnswerApi, model: LvCaseModel, spec: ChiefNativeSpec): UnsupportedItem[] {
  const { conditions, system } = model.exported;
  const refused: UnsupportedItem[] = [];
  if (conditions.object.kind !== "infinity") {
    const message = "LensVisualizer's distortion, pupils and lateral-colour tabs launch collimated chief rays";
    refused.push({ code: FEATURE, item: "object.finite", message });
  }
  if (system.opticalPath !== undefined) {
    const message = "LensVisualizer's chief rays of a folded path are not translated";
    refused.push({ code: FEATURE, item: "path.folded", message });
  }
  if (spec.kind !== "lateral-colour" && !tracesAuthored(model, spec.lines[0])) {
    const message =
      `LensVisualizer's ${spec.kind} tab traces every surface at its authored index; the case's line ` +
      `${spec.lines[0]} has other indices, or is not its reference line`;
    refused.push({ code: FEATURE, item: "lines.not-authored-reference", message });
  }
  if (spec.kind === "distortion" && api.isFisheyeProjection(model.runtime.projection)) {
    const message = "LensVisualizer's distortion of a fisheye lens is the residual of its declared projection law";
    refused.push({ code: FEATURE, item: "projection.fisheye", message });
  }
  // Every tab presents its figures on the design plane: decided from the prepared state, before any tab is asked.
  const plane = offDesign(designPlaneZ(model), model);
  if (plane !== null) refused.push(plane);
  if (spec.kind === "lateral-colour") {
    const channels = lvChannelLines(api, model);
    if (channels === null) {
      const message =
        "the lens mixes d-line and e-line indices: no channel of LensVisualizer's chromatic tab is of one line";
      refused.push({ code: FEATURE, item: "lines.mixed-reference", message });
    } else if (!spec.lines.some((line) => channelAt(channels, conditions.lines[line]?.wavelengthNm) !== null)) {
      const message = `no line asked is a channel of LensVisualizer's chromatic tab (${Object.values(channels).join(", ")} nm)`;
      refused.push({ code: FEATURE, item: "lines.not-chromatic-channels", message });
    }
  }
  return refused;
}

/** The refusal of a spec whose fields are not the ones the tab traces. */
function otherFields(kind: string, own: readonly number[], asked: readonly number[]): UnsupportedItem | null {
  const same = own.length === asked.length && own.every((angle, at) => Object.is(angle, asked[at]));
  if (same) return null;
  const message = `LensVisualizer's ${kind} tab traces its own fields: ${own.join(", ")} degrees`;
  return { code: OPTION, item: "fields.angles", message };
}

/** The landing of LensVisualizer's solved chief ray of a field: what its distortion inversion traces. */
function solvedLanding(api: LvChiefAnswerApi, model: LvCaseModel, geometry: LvChiefGeometry, angle: number): number {
  const { state, runtime } = model;
  return api.chiefRayImageHeightAccurateForRuntimeLens(
    angle,
    [...state.z],
    state.focusT,
    state.zoomT,
    runtime,
    geometry,
    0,
  );
}

/** An unavailable field of an answer, with LensVisualizer's reason. */
function unavailableField(
  line: number,
  wavelengthNm: number,
  fieldAngleDeg: number,
  reason: string,
  sampling: { readonly [name: string]: number } = {},
): ChiefNativeField {
  return {
    line,
    wavelengthNm,
    fieldAngleDeg,
    status: "unavailable",
    reason,
    chiefLandingMm: null,
    figures: null,
    chiefRay: null,
    sampling,
  };
}

/**
 * Whether a field's solved chief ray is one a chief set states (`lvSolvedChief`, chiefFields.ts, which the case source
 * makes its sets and asks with): a field LensVisualizer launches from a bounding sphere, or has no slope for, is
 * left out of the answer as it is out of the ask.
 */
function launched(
  api: LvChiefAnswerApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
  fieldAngleDeg: number,
  named: string,
): boolean {
  return !isChiefFieldRefusal(lvSolvedChief(api, model, geometry, fieldAngleDeg, named));
}

/** What a kind's answer is made of, or the unsupported item of a spec the tab has no answer to. */
type Made = { readonly fields: ChiefNativeField[]; readonly reference: ChiefReference } | UnsupportedItem;

/**
 * The distortion tab's curve at the spec's one line: each traced sample's target height, which the curve plots as
 * its real height, its ideal height and its percent distortion, as the curve presents them; the landing of the
 * sample's solved chief ray, which identifies the field and lands within LensVisualizer's 1e-4 mm of the target
 * (`sampling.inversionResidualMm`, the distance); and the scale of the rectilinear reference and its probe's angle.
 */
function distortion(api: LvChiefAnswerApi, model: LvCaseModel, spec: ChiefNativeSpec, geometry: LvChiefGeometry): Made {
  const line = spec.lines[0];
  const wavelengthNm = model.exported.conditions.lines[line].wavelengthNm;
  const curve = api.computeDistortionCurve(lvChiefRequest(api, model));
  // The samples after the axis whose chief ray a chief set states: the fields of the case source's ask.
  const samples = curve.samples
    .slice(1)
    .filter((sample) => launched(api, model, geometry, sample.fieldAngleDeg, "a distortion sample"));
  const fields = otherFields(
    "distortion",
    samples.map((sample) => sample.fieldAngleDeg),
    spec.fieldAnglesDeg,
  );
  if (fields !== null) return fields;
  const reference = lvDistortionReference(api, model, geometry);
  return {
    fields: samples.map((sample): ChiefNativeField => {
      const landing = solvedLanding(api, model, geometry, sample.fieldAngleDeg);
      if (!isFinite(landing)) {
        return unavailableField(line, wavelengthNm, sample.fieldAngleDeg, "lv-chief-ray-without-landing");
      }
      const figures = {
        ...NO_FIGURES,
        realHeightMm: sample.realHeight,
        idealHeightMm: sample.idealHeight,
        percent: sample.distortionPercent,
      };
      const sampling = { inversionResidualMm: Math.abs(landing - sample.realHeight) };
      const field = { line, wavelengthNm, fieldAngleDeg: sample.fieldAngleDeg, status: "ok" as const };
      return { ...field, chiefLandingMm: landing, figures, chiefRay: null, sampling };
    }),
    reference: {
      ...NO_REFERENCE,
      focalScaleMm: reference?.rectilinearScale ?? null,
      probeAngleDeg: reference?.probeAngleDeg ?? null,
    },
  };
}

/**
 * The pupils tab at the spec's one line: of each field off the axis, the real entrance pupil, where the field's solved
 * chief ray crosses the axis ahead of the system, and the real exit pupil, where it crosses it behind; and the
 * paraxial pupils the tab shifts them from. The tab states them relative to references of its own, which are made
 * absolute here with LensVisualizer's own numbers, restated from pupilAberration.ts:
 *
 * - the entrance pupil's shift is from `epRatio` behind the first vertex (`Δz_EP = (r − 1) × epRatio`, the solved
 *   chief ray's crossing at `r × epRatio`): the real one is at `z[0] + epRatio + epShiftMm`;
 * - the exit pupil is `xpZRelLastSurf` from the last vertex (`−y'_last / u'_last`): at `z[last] + xpZRelLastSurf`;
 * - the paraxial pupils are the stored `paraxialEpZRelStop` from the stop's vertex and `paraxialXpZRelLastSurf` from
 *   the last vertex.
 *
 * The landing of the field's solved chief ray identifies it. `sampling` states the tab's own numbers.
 */
function pupils(api: LvChiefAnswerApi, model: LvCaseModel, spec: ChiefNativeSpec, geometry: LvChiefGeometry): Made {
  const line = spec.lines[0];
  const wavelengthNm = model.exported.conditions.lines[line].wavelengthNm;
  const profiles = api.computeBothPupilAberrationProfiles(lvChiefRequest(api, model));
  // The fields off the axis whose chief ray a chief set states: the fields of the case source's ask.
  const traced = profiles.xp.samples.flatMap((xp, at) =>
    Math.abs(xp.fieldDeg) > 1e-9 && launched(api, model, geometry, xp.fieldDeg, "a chief ray of the pupils tab")
      ? [{ xp, ep: profiles.ep.samples[at] }]
      : [],
  );
  const fields = otherFields(
    "pupils",
    traced.map(({ xp }) => xp.fieldDeg),
    spec.fieldAnglesDeg,
  );
  if (fields !== null) return fields;
  const { z } = model.state;
  const first = z[0];
  const last = z[model.state.surfaces.length - 1];
  const stop = z[model.state.lens.stop.surfaceIndex];
  return {
    fields: traced.map(({ xp, ep }): ChiefNativeField => {
      const landing = solvedLanding(api, model, geometry, xp.fieldDeg);
      if (!isFinite(landing)) return unavailableField(line, wavelengthNm, xp.fieldDeg, "lv-chief-ray-without-landing");
      const figures = {
        ...NO_FIGURES,
        entrancePupilZ: first + geometry.epRatio + ep.epShiftMm,
        exitPupilZ: last + xp.xpZRelLastSurf,
      };
      const sampling = {
        chiefRayCorrection: ep.chiefRayCorrection,
        epShiftMm: ep.epShiftMm,
        xpShiftMm: xp.xpShiftMm,
      };
      const field = { line, wavelengthNm, fieldAngleDeg: xp.fieldDeg, status: "ok" as const };
      return { ...field, chiefLandingMm: landing, figures, chiefRay: null, sampling };
    }),
    reference: {
      ...NO_REFERENCE,
      paraxialEntrancePupilZ: stop + profiles.ep.paraxialEpZRelStop,
      paraxialExitPupilZ: last + profiles.xp.paraxialXpZRelLastSurf,
    },
  };
}

/**
 * How far a channel's indices are from the case's indices at a line, as for the axial-colour section (`indexDelta` in
 * axial.ts): the chromatic tab traces each medium at its channel's index, which for a glass LensVisualizer matched to
 * a catalog is the catalog's own and not the authored index the case is anchored to.
 */
function indexDelta(model: LvCaseModel, line: number, channel: string): number {
  const table = ndRow(decodeNdArray(model.exported.conditions.indexAfterSurface), line);
  const dispersion = model.state.lens.dispersion ?? [];
  let largest = 0;
  model.state.surfaces.forEach((surface, at) => {
    const traced = surface.nd === 1 ? 1 : (dispersion[at]?.indexAt(channel) ?? surface.nd);
    largest = Math.max(largest, Math.abs(traced - table[at]));
  });
  return largest;
}

/**
 * The lateral-colour section at each line of the spec that is one of its channels: each field's chief-ray landing at
 * that channel, as the section presents it (`imageHeightMm`), which is also what identifies the field; a line that is
 * no channel is unavailable at every field (`lv-no-channel-at-line`), and so is a channel whose chief ray the section
 * lost (`lv-channel-clipped`). The section traces its channels at its own indices, which `sampling.indexMaxDelta`
 * sets against the case's.
 */
function lateral(api: LvChiefAnswerApi, model: LvCaseModel, spec: ChiefNativeSpec, geometry: LvChiefGeometry): Made {
  const request = lvChiefRequest(api, model);
  const result = api.computeLateralColorCurve(request);
  const lines = model.exported.conditions.lines;
  const channels = lvChannelLines(api, model)!;
  // computeLateralColorCurve: null when no field is usable.
  if (result === null) {
    return {
      fields: spec.lines.flatMap((line) =>
        spec.fieldAnglesDeg.map((angle) =>
          unavailableField(line, lines[line].wavelengthNm, angle, "lv-lateral-colour-unavailable"),
        ),
      ),
      reference: NO_REFERENCE,
    };
  }
  // The design plane was decided before the section was asked; a section of another plane is off the case's too.
  const plane = offDesign(result.imagePlaneZ, model);
  if (plane !== null) return plane;
  // The fields whose chief ray a chief set states: the fields of the case source's ask.
  const usable = result.fields.filter(
    (field) => !isChiefFieldRefusal(lvLateralChief(api, request, geometry, field.fieldFraction)),
  );
  const fields = otherFields(
    "lateral-colour",
    usable.map((field) => field.fieldAngleDeg),
    spec.fieldAnglesDeg,
  );
  if (fields !== null) return fields;
  return {
    fields: spec.lines.flatMap((line) => {
      const wavelengthNm = lines[line].wavelengthNm;
      const channel = channelAt(channels, wavelengthNm);
      return usable.map((field): ChiefNativeField => {
        if (channel === null) return unavailableField(line, wavelengthNm, field.fieldAngleDeg, "lv-no-channel-at-line");
        const sampling = { indexMaxDelta: indexDelta(model, line, channel) };
        const sample = field.samples.find((each) => each.channel === channel);
        if (sample === undefined || sample.imageHeightMm === null) {
          return unavailableField(line, wavelengthNm, field.fieldAngleDeg, "lv-channel-clipped", sampling);
        }
        return {
          line,
          wavelengthNm,
          fieldAngleDeg: field.fieldAngleDeg,
          status: "ok",
          chiefLandingMm: sample.imageHeightMm,
          figures: null,
          chiefRay: null,
          sampling,
        };
      });
    }),
    reference: NO_REFERENCE,
  };
}

/**
 * LensVisualizer's distortion tab, pupils tab or lateral-colour section, asked for a spec about a case.
 *
 * - Distortion is the distortion tab's curve at the authored indices (`computeDistortionCurve`): each sample after
 *   the axis at the angle LensVisualizer's inversion solved for its target height; the spec's angles must be those.
 * - Pupils are the pupils tab's profiles (`computeBothPupilAberrationProfiles`) at its fields off the axis.
 * - Lateral colour is the chromatic tab's section (`computeLateralColorCurve`) at each line of the spec whose
 *   wavelength is one of its channels (`lvChannelLines`), at its fields.
 * - Every figure is on the design image plane; the request is the drawer's (`lvChiefRequest`).
 *
 * Unsupported: a finite object, a folded path, distortion or pupils at a line that is not the authored reference
 * line, distortion of a fisheye lens, lateral colour of a lens that mixes d-line and e-line indices or at no line of a
 * channel, a case off the design plane, and fields other than the tab's own.
 */
export function answerLvChief(api: LvChiefAnswerApi, model: LvCaseModel, spec: ChiefNativeSpec): LvChiefAnswer {
  // What the case and the spec decide comes first, before LensVisualizer is asked anything but its channels.
  const refused = refusals(api, model, spec);
  if (refused.length > 0) return { unsupported: refused };
  const geometry = lvChiefGeometry(api, model);
  if (geometry === null) {
    const message = "LensVisualizer's field geometry of the state has no half field";
    return { unsupported: [{ code: FEATURE, item: "field.no-half-field", message }] };
  }
  const made =
    spec.kind === "distortion"
      ? distortion(api, model, spec, geometry)
      : spec.kind === "pupils"
        ? pupils(api, model, spec, geometry)
        : lateral(api, model, spec, geometry);
  if (!("fields" in made)) return { unsupported: [made] };
  const offCase = made.fields.some((field) => (field.sampling.indexMaxDelta ?? 0) > 0);
  const data: ChiefNativeData = {
    kind: spec.kind,
    fields: made.fields,
    reference: made.reference,
    method: {
      name:
        spec.kind === "distortion"
          ? LV_DISTORTION_TAB
          : spec.kind === "pupils"
            ? LV_PUPILS_TAB
            : LV_LATERAL_COLOUR_SECTION,
      params: { stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter },
    },
    notes: [
      "LensVisualizer solves each chief ray through the centre of the real stop, and launches its paraxial estimate below 1 degree",
      ...(spec.kind === "distortion"
        ? [
            "the curve plots each sample's target image height as its real height; its chief ray lands within 1e-4 mm of it (sampling.inversionResidualMm)",
          ]
        : []),
      ...(offCase
        ? [
            "LensVisualizer's chromatic tab traces some media at indices of its own, not the case's (sampling.indexMaxDelta)",
          ]
        : []),
    ],
  };
  return { data, counts: { fields: made.fields.length } };
}
