// `axial.native` as the engine `lv` answers it: LensVisualizer's spherical-aberration section (its aberrations tab) and
// its axial-colour section (its chromatic tab) asked as the analysis drawer asks them, and their numbers written down
// as the sections present them. The spherical aberration is LensVisualizer's `computeSphericalAberration` and
// `computeSAProfile`; the axial colour is its `computeLongitudinalChromaticFocus`. Nothing of a figure is computed
// here: the comparator reads LensVisualizer's own, and states which channel of the chromatic tab a line of the case is.
import type {
  AxialFigures,
  AxialNativeData,
  AxialNativeField,
  AxialNativeSpec,
} from "../../contract/quantities/axialNative.ts";
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import { decodeNdArray, encodeNdArray, ndRow } from "../../core/numeric/ndarray.ts";
import { channelAt, lvAxialZones, lvChannelLines } from "./axialZones.ts";
export { lvChannelLines } from "./axialZones.ts";
import type { LvAxialApi } from "./axialZones.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { linesBeyondCase, tracesAuthored } from "./spot.ts";
import { lvSpotSetup, lvTabPupilSemiDiameter } from "./spotSetup.ts";
import type { LvAnalysisRequest, LvApi } from "./types.ts";

/** The LensVisualizer exports an axial figure is answered with. */
export type LvAxialAnswerApi = LvAxialApi &
  Pick<
    LvApi,
    | "createAnalysisRequest"
    | "computeSphericalAberration"
    | "computeSAProfile"
    | "computeLongitudinalChromaticFocus"
    | "chromaticChannelWavelengthsNm"
    | "eLineChannelWavelengthsNm"
    | "lensChromaticReference"
  >;

/** What the engine makes of an `axial.native` spec. */
export type LvAxialAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: AxialNativeData; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

const FEATURE = "feature";
const OPTION = "option";

/** The method names of the two sections. */
export const LV_SPHERICAL_SECTION = "lv-aberrations-tab";
export const LV_COLOUR_SECTION = "lv-chromatic-tab";

/** Two lists of fractions alike, value by value. */
function sameFractions(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((value, at) => Object.is(value, b[at]));
}

/** Why the sections cannot answer a spec about a case, before anything is asked of LensVisualizer. */
function refusals(api: LvAxialAnswerApi, model: LvCaseModel, spec: AxialNativeSpec): UnsupportedItem[] {
  const { conditions, system } = model.exported;
  const zones = lvAxialZones(api);
  const refused: UnsupportedItem[] = [];
  if (conditions.object.kind !== "infinity") {
    const message = "LensVisualizer's spherical-aberration and axial-colour sections launch collimated rays";
    refused.push({ code: FEATURE, item: "object.finite", message });
  }
  if (system.opticalPath !== undefined) {
    const message = "LensVisualizer's axial rays of a folded path are not translated";
    refused.push({ code: FEATURE, item: "path.folded", message });
  }
  const beyond = linesBeyondCase(model, spec.lines);
  if (beyond !== null) return [...refused, beyond];
  const own =
    spec.kind === "spherical"
      ? spec.nearAxis === zones.nearAxis &&
        sameFractions(spec.marginal, zones.marginal) &&
        sameFractions(spec.profile, zones.profile)
      : sameFractions(spec.marginal, zones.colour);
  if (!own) {
    const message = `LensVisualizer's ${spec.kind === "spherical" ? "spherical-aberration" : "axial-colour"} section traces only its own zones`;
    refused.push({ code: OPTION, item: "pupil.fractions", message });
  }
  if (spec.kind === "spherical" && !tracesAuthored(model, spec.lines[0])) {
    const message =
      "LensVisualizer's spherical-aberration section traces every surface at its authored index; the case's line " +
      `${spec.lines[0]} has other indices, or is not its reference line`;
    refused.push({ code: FEATURE, item: "lines.not-authored-reference", message });
  }
  if (spec.kind === "colour") {
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

/** An unavailable line of an answer, with LensVisualizer's reason. */
function unavailableField(
  line: number,
  wavelengthNm: number,
  reason: string,
  sampling: { readonly [name: string]: number } = {},
): AxialNativeField {
  return {
    line,
    wavelengthNm,
    status: "unavailable",
    reason,
    paraxialFocusZ: null,
    figures: null,
    rays: null,
    sampling,
  };
}

/**
 * The request the drawer hands the two sections for the case, restated from AnalysisDrawerContent.tsx as for the
 * coma tab (`tabRequest` in spot.ts): the prepared state, the two radii, the hook's field geometry, the quality
 * "settled", whose sampling is every family default. `dynamicEFL` is 0: neither section reads it.
 */
function sectionRequest(
  api: LvAxialAnswerApi & Parameters<typeof lvSpotSetup>[0],
  model: LvCaseModel,
): LvAnalysisRequest {
  return api.createAnalysisRequest({
    preparedState: model.state,
    dynamicEFL: 0,
    currentEPSD: lvTabPupilSemiDiameter(api, model),
    currentPhysStopSD: model.exported.conditions.stopSemiDiameter,
    fieldGeometry: lvSpotSetup(api, model).fieldGeometry,
    sampling: {},
  });
}

/** The design plane a section's figures are on, or why the case's is another. */
function offDesign(imagePlaneZ: number, model: LvCaseModel): UnsupportedItem | null {
  const imageZ = model.exported.conditions.imageZ;
  if (imageZ === imagePlaneZ) return null;
  const message =
    `LensVisualizer's sections present their figures on the design image plane, z = ${imagePlaneZ} mm; ` +
    `the case's plane is z = ${imageZ} mm`;
  return { code: FEATURE, item: "focus.off-design", message };
}

/** The spherical-aberration section's figures at the spec's one line. */
function spherical(
  api: LvAxialAnswerApi,
  model: LvCaseModel,
  spec: Extract<AxialNativeSpec, { kind: "spherical" }>,
): readonly AxialNativeField[] | UnsupportedItem {
  const request = sectionRequest(api, model);
  const line = spec.lines[0];
  const wavelengthNm = model.exported.conditions.lines[line].wavelengthNm;
  const result = api.computeSphericalAberration(request);
  // computeSphericalAberration: null when the near-axis or every marginal pair clips, or fewer than four hits.
  if (result === null) return [unavailableField(line, wavelengthNm, "lv-spherical-unavailable")];
  const plane = offDesign(result.imagePlaneZ, model);
  if (plane !== null) return plane;
  const points = api.computeSAProfile(request);
  const profile = spec.profile.map(
    (fraction) => points.find((point) => point.fraction === fraction)?.transverseSaMm ?? Number.NaN,
  );
  const figures: AxialFigures = {
    landingMm: result.nearAxisImageHeight,
    marginalFraction: result.marginalFraction,
    marginalInterceptZ: result.marginalRealIntercept,
    nearAxisInterceptZ: result.nearAxisRealIntercept,
    bestFocusZ: result.bestFocusZ,
    bestFocusRmsMm: result.bestFocusRmsMm,
    profileMm: encodeNdArray(Float64Array.from(profile)),
  };
  const sampling = {
    raysArrived: result.validSampleCount,
    profilePoints: points.length,
    ...(result.unaimedZoneCount === undefined ? {} : { zonesUnaimed: result.unaimedZoneCount }),
    ...(result.blockedZoneCount === undefined ? {} : { zonesBlocked: result.blockedZoneCount }),
  };
  return [{ line, wavelengthNm, status: "ok", paraxialFocusZ: null, figures, rays: null, sampling }];
}

/**
 * How far a channel's indices are from the case's indices at a line: LensVisualizer's chromatic tab traces each medium
 * at its channel's index (`indexAtPreparedSurface`: `state.lens.dispersion[i]?.indexAt(channel) ?? nd`), which for a
 * glass LensVisualizer matched to a catalog is the catalog's own and not the authored index the case is anchored to.
 */
export function indexDelta(model: LvCaseModel, line: number, channel: string): number {
  const table = ndRow(decodeNdArray(model.exported.conditions.indexAfterSurface), line);
  const dispersion = model.state.lens.dispersion ?? [];
  let largest = 0;
  model.state.surfaces.forEach((surface, at) => {
    const traced = surface.nd === 1 ? 1 : (dispersion[at]?.indexAt(channel) ?? surface.nd);
    largest = Math.max(largest, Math.abs(traced - table[at]));
  });
  return largest;
}

/** The axial-colour section's figures at each line of the spec that is one of its channels. */
function colour(
  api: LvAxialAnswerApi,
  model: LvCaseModel,
  spec: Extract<AxialNativeSpec, { kind: "colour" }>,
  channels: Readonly<Record<string, number>>,
): readonly AxialNativeField[] | UnsupportedItem {
  const result = api.computeLongitudinalChromaticFocus(sectionRequest(api, model));
  const lines = model.exported.conditions.lines;
  // computeLongitudinalChromaticFocus: null when no candidate's ray arrives at two channels.
  if (result === null) {
    return spec.lines.map((line) => unavailableField(line, lines[line].wavelengthNm, "lv-colour-unavailable"));
  }
  const plane = offDesign(result.imagePlaneZ, model);
  if (plane !== null) return plane;
  return spec.lines.map((line): AxialNativeField => {
    const wavelengthNm = lines[line].wavelengthNm;
    const channel = channelAt(channels, wavelengthNm);
    if (channel === null) return unavailableField(line, wavelengthNm, "lv-no-channel-at-line");
    const delta = indexDelta(model, line, channel);
    const sampling = {
      validChannels: result.validChannelCount,
      indexMaxDelta: delta,
      ...(result.omittedChannels === undefined ? {} : { channelsOmitted: result.omittedChannels.length }),
    };
    const sample = result.samples.find((each) => each.channel === channel);
    if (sample === undefined || sample.focusZ === null || sample.imageHeightMm === null) {
      return unavailableField(line, wavelengthNm, "lv-channel-clipped", sampling);
    }
    const figures: AxialFigures = {
      landingMm: sample.imageHeightMm,
      marginalFraction: result.marginalFraction,
      marginalInterceptZ: sample.focusZ,
      nearAxisInterceptZ: null,
      bestFocusZ: null,
      bestFocusRmsMm: null,
      profileMm: null,
    };
    return { line, wavelengthNm, status: "ok", paraxialFocusZ: null, figures, rays: null, sampling };
  });
}

/**
 * LensVisualizer's spherical-aberration or axial-colour section, asked for a spec about a case.
 *
 * - Spherical aberration is the aberrations tab's section at the authored indices: the near-axis and marginal pairs'
 *   intercepts and the best focus and RMS of the profile's pairs (`computeSphericalAberration`), and the profile at
 *   the best focus (`computeSAProfile`), one value for each zone of the spec, NaN where LensVisualizer dropped it.
 * - Axial colour is the chromatic tab's section (`computeLongitudinalChromaticFocus`): at each line of the spec whose
 *   wavelength is the line of one of its channels (`lvChannelLines`), that channel's focus and image height, at the
 *   fraction the section took; a line that is no channel is unavailable (`lv-no-channel-at-line`). The section traces
 *   its channels at its own indices, which `sampling.indexMaxDelta` sets against the case's.
 * - Both sections present their figures on the design image plane, and answer only a case of that plane; since
 *   LensVisualizer #927 the fractions are of the real stop's radius, each zone aimed there (`pupilRadiusMm` is the
 *   case's stop radius); since #930 the colour zone is chosen from all four channels. No paraxial focus is presented.
 *
 * Unsupported: a finite object, a folded path, a line the case does not have (`line`), zones other than the section's
 * own, spherical aberration at a line that is not the authored reference line, colour of a lens that mixes d-line and
 * e-line indices or at no line of a channel, and a case off the design plane.
 */
export function answerLvAxial(api: LvAxialAnswerApi, model: LvCaseModel, spec: AxialNativeSpec): LvAxialAnswer {
  // What the case and the spec decide comes first, before LensVisualizer is asked anything.
  const refused = refusals(api, model, spec);
  if (refused.length > 0) return { unsupported: refused };
  const channels = lvChannelLines(api, model)!;
  const fields = spec.kind === "spherical" ? spherical(api, model, spec) : colour(api, model, spec, channels);
  if (!Array.isArray(fields)) return { unsupported: [fields as UnsupportedItem] };
  const offCase = fields.some((field) => (field.sampling.indexMaxDelta ?? 0) > 0);
  const data: AxialNativeData = {
    kind: spec.kind,
    pupilRadiusMm: model.exported.conditions.stopSemiDiameter,
    fields: fields as AxialNativeField[],
    method: {
      name: spec.kind === "spherical" ? LV_SPHERICAL_SECTION : LV_COLOUR_SECTION,
      params: {
        stopSemiDiameterMm: model.exported.conditions.stopSemiDiameter,
        pupilSemiDiameterMm: lvTabPupilSemiDiameter(api, model),
      },
    },
    notes: [
      "LensVisualizer aims every ray parallel to the axis at a fraction of the real stop's radius (pupilRadiusMm), at the authored indices for spherical aberration and at each channel's own for axial colour",
      ...(offCase
        ? [
            "LensVisualizer's chromatic tab traces some media at indices of its own, not the case's (sampling.indexMaxDelta)",
          ]
        : []),
    ],
  };
  return { data, counts: { fields: fields.length } };
}
