// Which fields of LensVisualizer's field-curve and astigmatism sections have rays that a `rays.trace` request can
// state, decided once for both sides of rungs R10a and R10b: the case source makes its curvature sets and its
// `curvature.native` ask of the fields this module admits (curvatureRaySets.ts), and `lv` answers the ask with the
// sections' figures of the same fields (curvature.ts). A field LensVisualizer has no launch for is no field of a set,
// of the ask or of `lv`'s answer, so that no engine is asked a field `lv` cannot answer and `lv` never refuses its own
// case source's ask. Every restated line has a source canary (test/integration/lv/canaries.test.ts). This module reads
// LensVisualizer only through the exports it names, and imports nothing of the rays generators.
import { lvChannelLines } from "./axial.ts";
import type { LvCaseModel } from "./caseModel.ts";
import type { LvChiefGeometry } from "./chiefSetup.ts";
import { tracesAuthored } from "./spot.ts";
import type { LvAnalysisRequest, LvApi, LvScalarFieldGeometry } from "./types.ts";

/** The LensVisualizer exports the fields are decided with. */
export type LvCurvatureFieldsApi = Pick<
  LvApi,
  | "computeOffAxisFieldGeometryScalar"
  | "fieldCurvatureFieldFractions"
  | "fieldCurvatureCurveFieldFractions"
  | "chromaticChannelWavelengthsNm"
  | "eLineChannelWavelengthsNm"
  | "lensChromaticReference"
>;

/** Why a field has no rays a set can state: the problem code of the set, and what it says. */
export interface LvCurvatureFieldRefusal {
  readonly code: "lv-no-launch";
  readonly message: string;
}

/** One field of the sections: its fraction of the half field, and its launch or why a set has none. */
export interface LvCurvatureField {
  readonly fieldFraction: number;
  readonly made: LvScalarFieldGeometry | LvCurvatureFieldRefusal;
}

/** Whether a field's decision is a refusal. */
export function isCurvatureFieldRefusal(
  made: LvScalarFieldGeometry | LvCurvatureFieldRefusal,
): made is LvCurvatureFieldRefusal {
  return "code" in made;
}

/**
 * The fractions of the half field the sections trace, each once and in ascending order: the fields they mark and the
 * fields their curves are drawn through, restated from `computeFieldCurvatureBase` in fieldCurvature.ts with no
 * fractions of the drawer's (`sampling: {}`):
 *
 * ```
 * const fieldFractions = sampling.fieldCurvatureFieldFractions ?? FIELD_CURVATURE_FIELD_FRACTIONS;
 * const curveFieldFractions = sampling.fieldCurvatureCurveFieldFractions ?? FIELD_CURVATURE_CURVE_FIELD_FRACTIONS;
 * ```
 *
 * The sections compute a field of each list on its own, by the same function of the fraction alone: a fraction of
 * both lists is the same field, the same rays and the same figures, and is traced here once.
 */
export function lvCurvatureFractions(
  api: Pick<LvCurvatureFieldsApi, "fieldCurvatureFieldFractions" | "fieldCurvatureCurveFieldFractions">,
): number[] {
  const all = [...api.fieldCurvatureFieldFractions, ...api.fieldCurvatureCurveFieldFractions];
  return [...new Set(all)].sort((a, b) => a - b);
}

/**
 * Every field of the sections (`lvCurvatureFractions`) with its launch, LensVisualizer's own: restated from
 * `computeFieldCurvatureField` in fieldCurvature.ts, which launches a field at
 *
 * ```
 * const geometry = computeOffAxisFieldGeometryScalar(request.preparedGeometry, meta.fieldFraction, stateGeometry);
 * if (geometry === null) return emptyFieldCurvatureFieldResult(meta);
 * ```
 *
 * with `stateGeometry` the field geometry the drawer hands it (`fieldGeometry ?? computeAnalysisFieldGeometryAtState`).
 * The geometry is scalar whatever LensVisualizer's projection launches the field with elsewhere: the sections take the
 * solved chief ray's launch height and the field's slope. A field without one is `lv-no-launch`: LensVisualizer marks
 * it unusable and traces nothing of it.
 */
export function lvCurvatureFields(
  api: LvCurvatureFieldsApi,
  request: LvAnalysisRequest,
  geometry: LvChiefGeometry,
): LvCurvatureField[] {
  return lvCurvatureFractions(api).map((fieldFraction) => {
    const made = api.computeOffAxisFieldGeometryScalar(request.preparedGeometry, fieldFraction, geometry);
    if (made === null) {
      const message = `LensVisualizer has no launch for the field curves at the fraction ${fieldFraction} of the half field`;
      return { fieldFraction, made: { code: "lv-no-launch", message } };
    }
    return { fieldFraction, made };
  });
}

/**
 * The pupil fraction of the four parabasal rays of a field, restated from `parabasalPupilFraction` in
 * fieldCurvature.ts with its constants `FIELD_CURVATURE_PARABASAL_RAY_HEIGHT_MM = 0.01`,
 * `FIELD_CURVATURE_PARABASAL_FRACTION_MIN = 1e-4` and `FIELD_CURVATURE_PARABASAL_FRACTION_MAX = 0.02`:
 *
 * ```
 * if (!isFinite(entrancePupilSemiDiameter) || entrancePupilSemiDiameter <= 0) {
 *   return FIELD_CURVATURE_PARABASAL_FRACTION_MIN;
 * }
 * const fraction = FIELD_CURVATURE_PARABASAL_RAY_HEIGHT_MM / entrancePupilSemiDiameter;
 * return Math.min(FIELD_CURVATURE_PARABASAL_FRACTION_MAX, Math.max(FIELD_CURVATURE_PARABASAL_FRACTION_MIN, fraction));
 * ```
 *
 * A ray of 0.01 mm from the chief ray where it crosses the first vertex plane, held between 1e-4 and 0.02 of the
 * pupil.
 */
export function lvParabasalFraction(entrancePupilSemiDiameter: number): number {
  if (!isFinite(entrancePupilSemiDiameter) || entrancePupilSemiDiameter <= 0) return 1e-4;
  const fraction = 0.01 / entrancePupilSemiDiameter;
  return Math.min(0.02, Math.max(1e-4, fraction));
}

/** The sections' field geometry for a model: the drawer's, which the chief tabs read too (`lvChiefGeometry`). */
export type LvCurvatureGeometry = LvChiefGeometry;

/** A prepared state's design image plane, z: the last vertex plus its gap, where the sections place their foci. */
export function lvCurvaturePlaneZ(model: LvCaseModel): number {
  const last = model.state.surfaces.length - 1;
  return model.state.z[last] + (model.state.surfaces[last]?.d ?? 0);
}

/** What the sections trace at a line of a case: its field curves, one of its chromatic channels', or nothing. */
export type LvCurvatureLine =
  | { readonly kind: "authored" }
  | { readonly kind: "channel"; readonly channel: string }
  | { readonly kind: "none"; readonly reason: "lv-no-channel-at-line" | "lv-mixed-reference" };

/**
 * What the sections trace at a line of a case, decided once for the case source's ask and `lv`'s answer: the field
 * curves at a line whose indices are the authored ones (`tracesAuthored`), the chromatic field curves of the channel
 * whose wavelength the line's is (`lvChannelLines`, which LensVisualizer's `lensChromaticReference` decides), and else
 * nothing: a line that is no channel's (`lv-no-channel-at-line`), or any other line of a lens that mixes d-line and
 * e-line indices, whose channels are of no one line (`lv-mixed-reference`). It reads the lens and asks LensVisualizer
 * nothing else.
 */
export function lvCurvatureLine(
  api: Pick<
    LvCurvatureFieldsApi,
    "chromaticChannelWavelengthsNm" | "eLineChannelWavelengthsNm" | "lensChromaticReference"
  >,
  model: LvCaseModel,
  line: number,
): LvCurvatureLine {
  if (tracesAuthored(model, line)) return { kind: "authored" };
  const channels = lvChannelLines(api, model);
  if (channels === null) return { kind: "none", reason: "lv-mixed-reference" };
  const wavelengthNm = model.exported.conditions.lines[line]?.wavelengthNm;
  const channel = Object.keys(channels).find((name) => channels[name] === wavelengthNm);
  return channel === undefined ? { kind: "none", reason: "lv-no-channel-at-line" } : { kind: "channel", channel };
}

/** The lines of a case the sections trace (`lvCurvatureLine`), in order: the lines of the case source's ask. */
export function lvCurvatureLines(
  api: Pick<
    LvCurvatureFieldsApi,
    "chromaticChannelWavelengthsNm" | "eLineChannelWavelengthsNm" | "lensChromaticReference"
  >,
  model: LvCaseModel,
): number[] {
  return model.exported.conditions.lines
    .map((_line, line) => line)
    .filter((line) => lvCurvatureLine(api, model, line).kind !== "none");
}
