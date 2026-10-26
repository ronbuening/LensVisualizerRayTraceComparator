// Axial sets from LensVisualizer: the rays its spherical-aberration section (the aberrations tab) and its
// axial-colour section (the chromatic tab) launch, every pupil zone of both, as `rays.trace` specs. "Identical rays"
// for the rung R8a are these: each tab's own launch, traced as given by every engine.
//
// The zones are LensVisualizer's own constants (`NEAR_AXIS_REAL_FRAC`, `MARGINAL_PUPIL_FRACTIONS`, `PROFILE_FRACS`,
// `DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS`). What the tabs do inline is restated here, each line with a source
// canary (test/integration/lv/canaries.test.ts): which zones each section traces and in which order
// (`computeSphericalAberration`, `computeSAProfile` in spherical.ts, `computeRealRayHit` in shared.ts,
// `computeLongitudinalChromaticFocus` and its `normalizeFractions` in chromatic/analysis.ts), and where
// LensVisualizer's meridional launch starts a ray of a height and a slope and in which direction (`bindRayTrace` in
// rayAdapters.ts). An integration test holds the rays to LensVisualizer's own: traced by LensVisualizer they give
// the two sections' figures to the bit (test/integration/lv/axialRays.test.ts).
import type { AxialNativeSpec } from "../../contract/quantities/axialNative.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { startsInFront } from "../../rays/probe.ts";
import { rayProblem } from "../../rays/raySets.ts";
import type { AxialSetResolution } from "../../rays/axialSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvTabPupilSemiDiameter } from "./spotSetup.ts";
import { lvAxialZones } from "./axialZones.ts";
import type { LvAxialApi } from "./axialZones.ts";
import type { LvVec3 } from "./types.ts";
export { lvAxialZones } from "./axialZones.ts";
export type { LvAxialApi, LvAxialZones } from "./axialZones.ts";

/**
 * Where LensVisualizer's meridional launch starts a ray that crosses the first vertex plane at the height `y0` with
 * the slope `u0`, and its direction: restated from `bindRayTrace` in rayAdapters.ts, whose `zPos` is the state's
 * own vertices in both sections (`const zPos = state.z as number[]`),
 *
 * ```
 * const lead = state.lens.constants.rayLead ?? 0;
 * const firstZ = request.zPos?.[0] ?? state.z[0] ?? 0;
 * ray(y0, u0) {
 *   const direction = meridionalDirectionForSlope(u0);
 *   const origin: Vec3 = [0, y0 - u0 * lead, firstZ - lead];
 * ```
 *
 * and from the cache `meridionalDirectionForSlope` reads first, which holds the direction of the slope 0:
 *
 * ```
 * const MERIDIONAL_DIRECTION_BY_SLOPE = new Map<number, Vec3>([[0, [0, 0, 1]]]);
 * ```
 *
 * Both sections launch every ray with the slope 0 (`adapter.ray(h, 0)`).
 */
export function lvAxialLaunch(model: LvCaseModel, y0: number): { readonly origin: LvVec3; readonly direction: LvVec3 } {
  const { state } = model;
  const u0 = 0;
  const lead = state.lens.constants?.rayLead ?? 0;
  const firstZ = state.z[0] ?? 0;
  const direction: LvVec3 = [0, 0, 1];
  const origin: LvVec3 = [0, y0 - u0 * lead, firstZ - lead];
  return { origin, direction };
}

/**
 * The launch rays of a list of zones, each zone a pair: the ray at the fraction and the one at minus the fraction,
 * in that order, each launched at the height the sections give it, restated from `computeRealRayHit` in shared.ts:
 *
 * ```
 * const h = signedFraction * currentEPSD;
 * ```
 *
 * and from `computeLongitudinalChromaticFocus`, whose ray at a fraction is the same: `.ray(marginalFraction *
 * currentEPSD, 0)`.
 */
export function lvAxialPairs(
  model: LvCaseModel,
  entrancePupilSemiDiameter: number,
  zones: readonly number[],
): { readonly origins: Float64Array; readonly directions: Float64Array } {
  const count = 2 * zones.length;
  const origins = new Float64Array(count * 3);
  const directions = new Float64Array(count * 3);
  zones.forEach((fraction, zone) => {
    for (const [side, signedFraction] of [fraction, -fraction].entries()) {
      const h = signedFraction * entrancePupilSemiDiameter;
      const { origin, direction } = lvAxialLaunch(model, h);
      origins.set(origin, 3 * (2 * zone + side));
      directions.set(direction, 3 * (2 * zone + side));
    }
  });
  return { origins, directions };
}

/** What a case keeps the two sections from launching axial sets for, or null. */
function caseProblem(model: LvCaseModel): string | null {
  const { exported } = model;
  if (exported.system.opticalPath !== undefined) {
    return rayProblem(
      "folded-path",
      "the axial rays of a folded path are LensVisualizer's generalized trace, which a rays.trace v1 request does not state",
    );
  }
  if (exported.conditions.object.kind !== "infinity") {
    return rayProblem(
      "object-not-at-infinity",
      "LensVisualizer's spherical-aberration and axial-colour sections launch collimated rays at every focus; their rays are compared at infinity focus",
    );
  }
  return null;
}

/** Each zone once, in the order it is first named. */
function distinct(...lists: (readonly number[])[]): number[] {
  return Array.from(new Set(lists.flat()));
}

/**
 * The axial sets of a case that came from a LensVisualizer lens, each at every line of the case, in the order of the
 * lines; the rays are the same at every line, as in LensVisualizer, whose axial-colour section traces the same heights
 * at each of its channels:
 *
 * 1. the profile: the pairs of the spherical-aberration section's profile zones (`PROFILE_FRACS`), in their order,
 *    the bundle of its best focus;
 * 2. the marginal rays: the near-axis pair, then the pairs of the marginal candidates of the spherical-aberration
 *    section in the order it tries them, then those of the axial-colour section's candidates that are not among
 *    them, each zone once.
 *
 * Every ray has the weight 1 (neither section weights a ray) and the set states the field 0 under `groups`; it has
 * no chief ray. Beside the sets: the `axial.native` requests of the two sections (`AxialNativeSpec`), the spherical
 * aberration at the case's reference line and the axial colour at every line.
 *
 * A folded case (`folded-path`) and a case whose object is not at infinity (`object-not-at-infinity`) have no sets
 * and no requests, one problem each; so has a case whose tabs' pupil radius is not above 0 (`no-pupil`), and one
 * whose rays would not start in front of its first surface (`launch-behind-first-surface`).
 */
export function lvAxialRaySets(api: LvAxialApi, model: LvCaseModel): AxialSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const pupil = lvTabPupilSemiDiameter(api, model);
  if (!(pupil > 0)) {
    return { sets: [], problems: [rayProblem("no-pupil", `the tabs' pupil radius is ${pupil} mm`)], asks: [] };
  }
  const zones = lvAxialZones(api);
  const groups = { field: { angleDeg: 0 } };
  const patterns = [zones.profile, distinct([zones.nearAxis], zones.marginal, zones.colour)];
  const sets: RaysTraceSpec[] = [];
  for (const pattern of patterns) {
    const { origins, directions } = lvAxialPairs(model, pupil, pattern);
    if (!startsInFront(model.exported.system.surfaces[0], origins)) {
      const message = "the axial rays of the tabs would not start in front of the first surface";
      return { sets: [], problems: [rayProblem("launch-behind-first-surface", message)], asks: [] };
    }
    const rays = origins.length / 3;
    const spec = {
      origins: encodeNdArray(origins, [rays, 3]),
      directions: encodeNdArray(directions, [rays, 3]),
      weights: encodeNdArray(new Float64Array(rays).fill(1), [rays]),
      groups,
    };
    sets.push(...model.exported.conditions.lines.map((_line, line) => ({ line, ...spec })));
  }
  const lines = model.exported.conditions.lines.map((_line, line) => line);
  const asks: AxialNativeSpec[] = [
    {
      kind: "spherical",
      lines: [0],
      nearAxis: zones.nearAxis,
      marginal: [...zones.marginal],
      profile: [...zones.profile],
    },
    { kind: "colour", lines, marginal: [...zones.colour] },
  ];
  return { sets, problems: [], asks };
}
