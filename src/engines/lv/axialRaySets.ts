// Axial sets from LensVisualizer: the rays its spherical-aberration section (the aberrations tab) and its
// axial-colour section (the chromatic tab) launch, every zone of both, as `rays.trace` specs. "Identical rays" for the
// rung R8a are these: each tab's own launch, traced as given by every engine.
//
// The zones are LensVisualizer's own constants (`NEAR_AXIS_REAL_FRAC`, `MARGINAL_PUPIL_FRACTIONS`, `PROFILE_FRACS`,
// `DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS`), and since LensVisualizer #927 the ray of a zone is its shared aimed
// launch's (`prepareAimedPupilLaunch`): the ray from the axial object that crosses the stop at the zone's fraction of
// the stop radius, at the authored indices for spherical aberration and at each chromatic channel's own for axial
// colour, kept verbatim. What the tabs do inline is restated here, each line with a source canary
// (test/integration/lv/canaries.test.ts): which zones each section traces and in which order
// (`computeSphericalAberration`, `computeSAProfile` in spherical.ts, `prepareAxialZoneLaunch` and `computeRealRayHit`
// in shared.ts, `computeLongitudinalChromaticFocus` and its `normalizeFractions` in chromatic/analysis.ts). An
// integration test holds the rays to LensVisualizer's own: traced as the sections trace them they give the two
// sections' figures to the bit (test/integration/lv/axialRays.test.ts).
import type { AxialNativeSpec } from "../../contract/quantities/axialNative.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { startsInFront } from "../../rays/probe.ts";
import { rayProblem } from "../../rays/raySets.ts";
import type { AxialSetResolution } from "../../rays/axialSets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefRequest } from "./chiefSetup.ts";
import type { LvChiefSetupApi } from "./chiefSetup.ts";
import { lvTabPupilSemiDiameter } from "./spotSetup.ts";
import { channelAt, lvAxialZones, lvChannelLines } from "./axialZones.ts";
import type { LvAxialApi } from "./axialZones.ts";
import type { LvAimedObjectPlaneField, LvAnalysisRequest, LvApi } from "./types.ts";
export { lvAxialZones } from "./axialZones.ts";
export type { LvAxialApi, LvAxialZones } from "./axialZones.ts";

/** The LensVisualizer exports the axial sets are made with: the zones, the drawer's request and the aimed launch. */
export type LvAxialSetApi = LvAxialApi & LvChiefSetupApi & Pick<LvApi, "prepareAimedPupilLaunch">;

/**
 * The axial object at infinity of the sections' launch, restated from shared.ts: a collimated launch along the axis,
 * whose chief ray is the axis itself,
 *
 * ```
 * const AXIAL_FIELD: AimedObjectPlaneField = { uField: 0, yChief: 0 };
 * ```
 */
export const LV_AXIAL_FIELD: LvAimedObjectPlaneField = { uField: 0, yChief: 0 };

/**
 * The launch rays of a list of zones, each zone a pair: the ray at the fraction and the one at minus the fraction, in
 * that order, as LensVisualizer's shared aimed launch returns them for the axial object, restated from
 * `prepareAxialZoneLaunch` in shared.ts,
 *
 * ```
 * const samples = signedFractions.map((yFraction) => ({ xFraction: 0, yFraction }));
 * const launch = prepareAimedPupilLaunch(request, samples, AXIAL_FIELD, channel);
 * ```
 *
 * with `symmetricZoneFractions` (`fractions.flatMap((fraction) => [fraction, -fraction])`), at the authored indices
 * (`channel` undefined) or a chromatic channel's. A sample's solve depends only on the state, the field, the stop
 * radius, the channel and its own target, so a zone's rays are the same whichever list it is asked in; on the axis a
 * zone at minus the fraction is the exact mirror image of the zone at the fraction. A zone LensVisualizer aims no ray
 * at has no pair, and is named (`unaimed`): LensVisualizer never traces it. A blocked zone keeps LensVisualizer's
 * blocking rays, which every engine stops.
 */
export function lvAxialPairs(
  api: Pick<LvApi, "prepareAimedPupilLaunch">,
  request: LvAnalysisRequest,
  zones: readonly number[],
  channel?: string,
): {
  readonly origins: Float64Array;
  readonly directions: Float64Array;
  readonly zones: readonly number[];
  readonly unaimed: readonly number[];
} | null {
  const samples = zones.flatMap((fraction) => [fraction, -fraction]).map((yFraction) => ({ xFraction: 0, yFraction }));
  const launch = api.prepareAimedPupilLaunch(request, samples, LV_AXIAL_FIELD, channel);
  if (launch === null) return null;
  const origins: number[] = [];
  const directions: number[] = [];
  const kept: number[] = [];
  const unaimed: number[] = [];
  zones.forEach((fraction, zone) => {
    const pair = [launch.rays[2 * zone], launch.rays[2 * zone + 1]];
    if (pair.some((ray) => ray.status === "unaimed")) {
      unaimed.push(fraction);
      return;
    }
    for (const ray of pair) {
      origins.push(...ray.origin!);
      directions.push(...ray.direction!);
    }
    kept.push(fraction);
  });
  return { origins: Float64Array.from(origins), directions: Float64Array.from(directions), zones: kept, unaimed };
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
 * The axial sets of a case that came from a LensVisualizer lens, in the order of the lines (LensVisualizer #927: each
 * zone the ray aimed at its fraction of the real stop):
 *
 * 1. the profile, at every line: the pairs of the spherical-aberration section's profile zones (`PROFILE_FRACS`), in
 *    their order, aimed at the authored indices: the bundle of its best focus;
 * 2. the marginal rays, at every line: the near-axis pair, then the pairs of the spherical-aberration section's
 *    marginal candidates in the order it tries them, aimed at the authored indices;
 * 3. the colour, at each line of the case that is a chromatic channel's (`lvChannelLines`): the pairs of the
 *    axial-colour section's candidates, aimed at that channel's indices, as the section aims each of its channels
 *    (LV #930: the zone is chosen from all four channels, R, G, B and V, whatever lines a case has).
 *
 * Every ray has the weight 1 (neither section weights a ray) and the set states the field 0 under `groups`; it has
 * no chief ray. Beside the sets: the `axial.native` requests of the two sections (`AxialNativeSpec`), the spherical
 * aberration at the case's reference line and the axial colour at every line.
 *
 * A folded case (`folded-path`) and a case whose object is not at infinity (`object-not-at-infinity`) have no sets
 * and no requests, one problem each; so has a case whose tabs' pupil radius is not above 0 (`no-pupil`), one without a
 * stop to aim at (`lv-no-launch`), and one whose rays would not start in front of its first surface
 * (`launch-behind-first-surface`). A zone LensVisualizer aims no ray at is left out of its set and named
 * (`lv-zone-unaimed`); a lens that mixes d-line and e-line indices has no colour set (`lv-mixed-reference`).
 */
export function lvAxialRaySets(api: LvAxialSetApi, model: LvCaseModel): AxialSetResolution {
  const refused = caseProblem(model);
  if (refused !== null) return { sets: [], problems: [refused], asks: [] };
  const pupil = lvTabPupilSemiDiameter(api, model);
  if (!(pupil > 0)) {
    return { sets: [], problems: [rayProblem("no-pupil", `the tabs' pupil radius is ${pupil} mm`)], asks: [] };
  }
  const zones = lvAxialZones(api);
  const request = lvChiefRequest(api, model);
  const groups = { field: { angleDeg: 0 } };
  const lines = model.exported.conditions.lines;
  const channels = lvChannelLines(api, model);
  const problems: string[] = [];
  // Each pattern: its zones, the channel it is aimed at for each line, and the lines it is of.
  const patterns: { name: string; zones: readonly number[]; lines: { line: number; channel?: string }[] }[] = [
    { name: "profile", zones: zones.profile, lines: lines.map((_line, line) => ({ line })) },
    {
      name: "marginal",
      zones: distinct([zones.nearAxis], zones.marginal),
      lines: lines.map((_line, line) => ({ line })),
    },
    {
      name: "colour",
      zones: zones.colour,
      lines:
        channels === null
          ? []
          : lines.flatMap(({ wavelengthNm }, line) => {
              const channel = channelAt(channels, wavelengthNm);
              return channel === null ? [] : [{ line, channel }];
            }),
    },
  ];
  if (channels === null) {
    const message =
      "the lens mixes d-line and e-line indices: no channel of LensVisualizer's chromatic tab is of one line";
    problems.push(rayProblem("lv-mixed-reference", message));
  }
  const sets: RaysTraceSpec[] = [];
  for (const pattern of patterns) {
    for (const { line, channel } of pattern.lines) {
      const made = lvAxialPairs(api, request, pattern.zones, channel);
      if (made === null) {
        const problem = rayProblem("lv-no-launch", "LensVisualizer's aimed launch has no stop to aim the axis at");
        return { sets: [], problems: [problem], asks: [] };
      }
      for (const fraction of made.unaimed) {
        const at = channel === undefined ? "the authored indices" : `the channel ${channel}`;
        const message = `LensVisualizer aims no ray of the ${pattern.name} zone ${fraction} of the stop at ${at}`;
        problems.push(rayProblem("lv-zone-unaimed", message));
      }
      if (!startsInFront(model.exported.system.surfaces[0], made.origins)) {
        const message = "the axial rays of the tabs would not start in front of the first surface";
        return { sets: [], problems: [rayProblem("launch-behind-first-surface", message)], asks: [] };
      }
      const rays = made.origins.length / 3;
      if (rays === 0) continue;
      sets.push({
        line,
        origins: encodeNdArray(made.origins, [rays, 3]),
        directions: encodeNdArray(made.directions, [rays, 3]),
        weights: encodeNdArray(new Float64Array(rays).fill(1), [rays]),
        groups,
      });
    }
  }
  const asks: AxialNativeSpec[] = [
    {
      kind: "spherical",
      lines: [0],
      nearAxis: zones.nearAxis,
      marginal: [...zones.marginal],
      profile: [...zones.profile],
    },
    { kind: "colour", lines: lines.map((_line, line) => line), marginal: [...zones.colour] },
  ];
  return { sets, problems, asks };
}
