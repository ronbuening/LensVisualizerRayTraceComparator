// `system.describe` as the engine `lv` answers it: LensVisualizer's prepared state, read back. The shape of a
// surface is read by rules written here, from LensVisualizer's own flat threshold, its own list of polynomial
// coefficients and its own sag, and not through the case exporter's translation: so rung R0 holds the exporter,
// and every engine's reading of the case, to what LensVisualizer traces. The clear aperture is asked of
// LensVisualizer's `evaluateAperture`, by the probe the exporter asks it with.
import type { AsphereTerm } from "../../contract/case.ts";
import type { SystemDescribeData } from "../../contract/quantities/systemDescribe.ts";
import { encodeF8 } from "../../core/numeric/ndarray.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { surfaceAperture } from "./exportAperture.ts";
import type { LvApi, LvSurface } from "./types.ts";

/** The LensVisualizer exports the echo reads beside the state. */
export type LvDescribeApi = Pick<LvApi, "evaluateAperture" | "flatRadiusThreshold" | "asphericPolynomialTerms">;

/**
 * The polynomial terms LensVisualizer's sag adds on a surface: of the coefficients of its own aspheric schema, and
 * of no other member an asphere may carry, those that are not 0, by ascending power.
 */
function termsOf(api: LvDescribeApi, surface: LvSurface): AsphereTerm[] {
  const { asphere } = surface;
  if (asphere === null) return [];
  return api.asphericPolynomialTerms
    .map(({ key, power }): AsphereTerm => ({ power, coeff: asphere[key] ?? 0 }))
    .filter((term) => term.coeff !== 0)
    .sort((a, b) => a.power - b.power);
}

/**
 * The sag LensVisualizer has for a surface at a height: its profile's, or NaN beyond the height at which the
 * profile says the surface ends. LensVisualizer's sag function is finite out there, a continuation no glass
 * occupies, and its own intersection evaluates such a point as no surface.
 */
function sagOf(surface: LvSurface, radius: number): number {
  const limit = surface.profile.finiteRadiusLimit();
  return limit !== null && radius > limit ? NaN : surface.profile.sag(radius);
}

/**
 * The state of a case's model as `system.describe` data.
 *
 * - `vertexZ` is `state.z`; `stopIndex` the state's stop surface; `surfaceCount` the number of its surfaces.
 * - `curvature` is `1 / R` as one division, and 0 where LensVisualizer treats the radius as flat (above its
 *   `FLAT_R_THRESHOLD` in magnitude). `conic` is the asphere's `K`, or 0 without one, and 0 for a plane: a surface
 *   without curvature and without a term, on which `K` shapes nothing.
 * - `terms` are the coefficients LensVisualizer evaluates (`termsOf`).
 * - `clipRadius` is the largest height at which LensVisualizer's `evaluateAperture` passes a ray, the stop surface
 *   asked with the stop radius of the case, as its tracers ask it; `innerClipRadius` is the inner semi-diameter it
 *   reports there, 0 for a surface without a central obstruction; `sagRadii` are the fractions of the
 *   semi-diameter it reports there. `stopSemiDiameter` is that stop radius.
 * - `sag` is the profile's at those heights (`sagOf`).
 * - `indexAfterSurface` and `imageZ` are those of the case LensVisualizer exports now: the indices of its own
 *   resolver for each line, and the image plane the case asks for.
 *
 * Throws where LensVisualizer does not trace a surface with the semi-diameter its state implies (`surfaceAperture`).
 */
export function describeLvSystem(
  api: LvDescribeApi,
  model: LvCaseModel,
  sagFractions: readonly number[],
): SystemDescribeData {
  const { state, exported } = model;
  const stopIndex = state.lens.stop.surfaceIndex;
  const stopSemiDiameter = exported.conditions.stopSemiDiameter;
  const rows = state.surfaces.map((surface, index) => {
    const aperture = surfaceAperture(api, state, surface, index === stopIndex ? stopSemiDiameter : undefined);
    const curvature = Math.abs(surface.R) > api.flatRadiusThreshold ? 0 : 1 / surface.R;
    const terms = termsOf(api, surface);
    const radii = sagFractions.map((fraction) => fraction * aperture.nominalSemiDiameter);
    return {
      curvature,
      conic: curvature === 0 && terms.length === 0 ? 0 : (surface.asphere?.K ?? 0),
      clipRadius: aperture.semiDiameter,
      innerClipRadius: aperture.innerSemiDiameter,
      terms,
      radii,
      sags: radii.map((radius) => sagOf(surface, radius)),
    };
  });
  const sagShape = [rows.length, sagFractions.length];
  return {
    surfaceCount: rows.length,
    stopIndex,
    imageZ: exported.conditions.imageZ,
    stopSemiDiameter,
    vertexZ: encodeF8(rows.map((_row, index) => state.z[index])),
    curvature: encodeF8(rows.map((row) => row.curvature)),
    conic: encodeF8(rows.map((row) => row.conic)),
    clipRadius: encodeF8(rows.map((row) => row.clipRadius)),
    innerClipRadius: encodeF8(rows.map((row) => row.innerClipRadius)),
    indexAfterSurface: exported.conditions.indexAfterSurface,
    sagRadii: encodeF8(
      rows.flatMap((row) => row.radii),
      sagShape,
    ),
    sag: encodeF8(
      rows.flatMap((row) => row.sags),
      sagShape,
    ),
    terms: rows.map((row) => row.terms),
  };
}
