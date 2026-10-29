// The zones of LensVisualizer's spherical-aberration section (its aberrations tab) and its axial-colour section (its
// chromatic tab): which fractions of the stop each traces, and which chromatic channel a line of a case is. Shared by
// the axial sets (axialRaySets.ts) and the engine's answer of the sections (axial.ts), which keeps the engine's closure
// to what it answers with.
import type { LvCaseModel } from "./caseModel.ts";
import type { LvHookApi } from "./tabRequest.ts";
import type { LvApi } from "./types.ts";

/** The LensVisualizer exports the axial sets are made with. */
export type LvAxialApi = LvHookApi &
  Pick<
    LvApi,
    | "saNearAxisFraction"
    | "marginalPupilFractions"
    | "saProfileFractions"
    | "locaMarginalFractions"
    | "lensChromaticReference"
    | "eLineChannelWavelengthsNm"
    | "chromaticChannelWavelengthsNm"
  >;

/**
 * The zones of the two sections as they open (`analysisQuality` "settled", whose sampling leaves every zone at its
 * family default), each a fraction of the stop radius (LV #927: a zone is the ray from the axial object aimed at that
 * height of the real stop):
 *
 * - `nearAxis`, `marginal` and `profile` of the spherical-aberration section, restated from spherical.ts:
 *
 *   ```
 *   const nearAxisSample = computeSymmetricRealSample(request, lastSurfZ, imagePlaneZ, NEAR_AXIS_REAL_FRAC, prepared);
 *   for (const fraction of MARGINAL_FRACS) {
 *   const hits = PROFILE_FRACS.flatMap((fraction) => {
 *   ```
 *
 *   with `export const MARGINAL_FRACS = MARGINAL_PUPIL_FRACTIONS;` in shared.ts. Each zone is a pair, the ray at the
 *   fraction and its mirror image (`computeSymmetricRealSample`, and `-fraction` beside `fraction` in the profile).
 * - `colour`, the candidates of the axial-colour section, restated from chromatic/analysis.ts: its default options
 *   read `request.sampling.chromaticLongitudinalFractions`, which the settled sampling leaves undefined, and
 *
 *   ```
 *   const fractions = normalizeFractions(options.longitudinalFractions, DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS, {
 *     allowZero: false,
 *   });
 *   ```
 *
 *   with `normalizeFractions` keeping the finite fractions above 0, each clamped to [0, 1], once, in their order.
 *   The section traces the ray at the fraction alone, with no mirror image.
 */
export interface LvAxialZones {
  readonly nearAxis: number;
  readonly marginal: readonly number[];
  readonly profile: readonly number[];
  readonly colour: readonly number[];
}

/** LensVisualizer's `normalizeFractions` with `allowZero: false`, restated (chromatic/analysis.ts). */
function normalizedFractions(fractions: readonly number[]): number[] {
  const values = fractions
    .filter((value) => isFinite(value) && value > 0)
    .map((value) => Math.max(0, Math.min(1, value)));
  return Array.from(new Set(values));
}

/** The zones of the two sections (`LvAxialZones`). */
export function lvAxialZones(api: LvAxialApi): LvAxialZones {
  return {
    nearAxis: api.saNearAxisFraction,
    marginal: [...api.marginalPupilFractions],
    profile: [...api.saProfileFractions],
    colour: normalizedFractions(api.locaMarginalFractions),
  };
}

/**
 * The line each chromatic channel of a lens is traced at, nm, as LensVisualizer's materials resolve it: C, d, F and g
 * for a lens whose elements state d-line indices; C', e, F' and g for a lens whose elements all state e-line indices
 * (`makeSurfaceDispersion` in materialResolver.ts gives a native e-line element those lines on every tier). Which a
 * lens is, LensVisualizer says: its chromatic tab asks `lensChromaticReference(L.elements)` of the runtime lens, whose
 * elements leave the synthetic rear plates out, and the comparator asks the same of the same elements. A lens that
 * mixes the two, whose reference is "d" with an element whose own reference (asked of it alone) is "e", has no one
 * line a channel is of: null.
 */
export function lvChannelLines(
  api: Pick<LvApi, "lensChromaticReference" | "eLineChannelWavelengthsNm" | "chromaticChannelWavelengthsNm">,
  model: LvCaseModel,
): Readonly<Record<string, number>> | null {
  const elements = model.runtime.elements;
  if (api.lensChromaticReference(elements) === "e") return api.eLineChannelWavelengthsNm;
  const mixed = elements.some((element) => api.lensChromaticReference([element]) === "e");
  return mixed ? null : api.chromaticChannelWavelengthsNm;
}

/** The channel traced at a wavelength, or null. */
export function channelAt(channels: Readonly<Record<string, number>>, wavelengthNm: number | undefined): string | null {
  return Object.keys(channels).find((channel) => channels[channel] === wavelengthNm) ?? null;
}
