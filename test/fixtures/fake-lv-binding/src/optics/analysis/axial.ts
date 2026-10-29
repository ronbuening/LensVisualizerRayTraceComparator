// The fake's spherical-aberration section and axial-colour section, under LV's names. Its zones and its channel
// indices are its own, deliberately not LV's; since LV #927 each zone is the fake's aimed launch of the axis at the
// fraction of the stop (prepareAimedPupilLaunch, with a channel for the colour), traced as the launch's own trace, and
// the intercept is read as LV reads it (the height carried to the last vertex plane, over the slope); since LV #930 the
// colour zone is chosen from all four channels. So rays made by the comparator give the fake's numbers back to the bit.
import { CHROMATIC_CHANNEL_WAVELENGTH_NM, CHROMATIC_ZONE_CHANNELS, LINE_NM } from "../chromatic.js";
import { PROFILE_FRACS } from "./aberration/shared.js";
import { prepareAimedPupilLaunch, prepareAimedPupilTrace } from "./pupils/aimedPupil.js";
import type { FakeAnalysisRequest } from "./request.js";

export const NEAR_AXIS_REAL_FRAC = 0.25;
export const MARGINAL_PUPIL_FRACTIONS = [0.9, 0.75, 0.5] as const;
export const DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS = [0.9, 0.75, 0.5] as const;
const CHANNELS = CHROMATIC_ZONE_CHANNELS;

/** The fake's index of a medium at a chromatic channel: its own rule, not its MTF's. */
export function fakeChannelIndex(nd: number, channel: string): number {
  if (nd === 1) return 1;
  const wavelength = CHROMATIC_CHANNEL_WAVELENGTH_NM[channel as keyof typeof CHROMATIC_CHANNEL_WAVELENGTH_NM];
  return nd + (LINE_NM.d - wavelength) * 2e-5 + 1e-6;
}

/** The axis's zone at a signed fraction of the stop, aimed and traced at the authored indices or a channel's. */
function meridional(request: FakeAnalysisRequest, signedFraction: number, channel?: string) {
  const launch = prepareAimedPupilLaunch(request, [{ xFraction: 0, yFraction: signedFraction }], { uField: 0, yChief: 0 }, channel);
  const aimed = launch?.rays[0];
  if (!launch || !aimed || aimed.status === "unaimed") return { unaimed: true, clipped: true, y: NaN, u: NaN };
  const ray = prepareAimedPupilTrace(request.preparedGeometry, launch, channel).meridional(aimed as never);
  return { unaimed: false, ...ray };
}

function hitOf(request: FakeAnalysisRequest, signedFraction: number) {
  const state = request.preparedGeometry;
  const last = state.z[state.surfaces.length - 1];
  const ray = meridional(request, signedFraction);
  if (ray.clipped || Math.abs(ray.u) < 1e-12) return null;
  return {
    signedFraction,
    coordinate: ray.y,
    slope: ray.u,
    intercept: last - ray.y / ray.u,
    imageHeight: ray.y + ray.u * (state.imgZ - last),
  };
}

function pairOf(request: FakeAnalysisRequest, fraction: number) {
  const plus = hitOf(request, fraction);
  const minus = hitOf(request, -fraction);
  if (plus === null || minus === null) return null;
  return { fraction, intercept: (plus.intercept + minus.intercept) / 2, imageHeight: (plus.imageHeight + minus.imageHeight) / 2 };
}

function profileHits(request: FakeAnalysisRequest) {
  return PROFILE_FRACS.flatMap((fraction) => {
    const plus = hitOf(request, fraction);
    const minus = hitOf(request, -fraction);
    return plus === null || minus === null ? [] : [plus, minus];
  });
}

function bestFocus(hits: { coordinate: number; slope: number }[], last: number): number {
  const denom = hits.reduce((sum, hit) => sum + hit.slope * hit.slope, 0);
  const numer = hits.reduce((sum, hit) => sum + hit.slope * hit.slope * last - hit.coordinate * hit.slope, 0);
  return numer / denom;
}

function at(hit: { coordinate: number; slope: number }, last: number, plane: number): number {
  return hit.coordinate + hit.slope * (plane - last);
}

export function computeSphericalAberration(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const last = state.z[state.surfaces.length - 1];
  const near = pairOf(request, NEAR_AXIS_REAL_FRAC);
  if (near === null) return null;
  let marginal = null;
  for (const fraction of MARGINAL_PUPIL_FRACTIONS) {
    marginal = pairOf(request, fraction);
    if (marginal !== null) break;
  }
  if (marginal === null) return null;
  const hits = profileHits(request);
  if (hits.length < 4) return null;
  const bestFocusZ = bestFocus(hits, last);
  const rms = (plane: number) => Math.sqrt(hits.reduce((sum, hit) => sum + at(hit, last, plane) ** 2, 0) / hits.length);
  const peak = (plane: number) => Math.max(...hits.map((hit) => Math.abs(at(hit, last, plane))));
  return {
    nearAxisFraction: NEAR_AXIS_REAL_FRAC,
    marginalFraction: marginal.fraction,
    longitudinalSaMm: marginal.intercept - near.intercept,
    nearAxisRealIntercept: near.intercept,
    marginalRealIntercept: marginal.intercept,
    nearAxisImageHeight: near.imageHeight,
    imagePlaneZ: state.imgZ,
    bestFocusZ,
    bestFocusShiftMm: bestFocusZ - state.imgZ,
    bestFocusRmsMm: rms(bestFocusZ),
    bestFocusPeakMm: peak(bestFocusZ),
    currentPlaneRmsMm: rms(state.imgZ),
    currentPlanePeakMm: peak(state.imgZ),
    validSampleCount: hits.length,
  };
}

export function computeSAProfile(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const last = state.z[state.surfaces.length - 1];
  const hits = profileHits(request);
  if (hits.length < 4) return [];
  const bestFocusZ = bestFocus(hits, last);
  const near = hits.find((hit) => hit.signedFraction === NEAR_AXIS_REAL_FRAC);
  if (near === undefined) return [];
  const reference = at(near, last, bestFocusZ);
  return PROFILE_FRACS.flatMap((fraction) => {
    const hit = hits.find((each) => each.signedFraction === fraction);
    return hit === undefined ? [] : [{ fraction, transverseSaMm: at(hit, last, bestFocusZ) - reference }];
  });
}

export function computeLongitudinalChromaticFocus(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const last = state.z[state.surfaces.length - 1];
  for (const marginalFraction of DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS) {
    const rays = CHANNELS.map((channel) => {
      const ray = meridional(request, marginalFraction, channel);
      return { channel, ray, usable: !ray.clipped && Math.abs(ray.u) > 1e-15 };
    });
    // An unaimed zone ends the search; a zone all four channels pass is taken, else (the fake's simplification of LV's
    // rule) none: the fake has no fallback to two channels.
    if (rays.some((each) => each.ray.unaimed)) return null;
    if (rays.some((each) => !each.usable)) continue;
    const reference = rays.find((each) => each.channel === "G")!;
    const focus = (each: (typeof rays)[number]) => (each.usable ? last - each.ray.y / each.ray.u : null);
    const height = (each: (typeof rays)[number]) => (each.usable ? each.ray.y + (state.imgZ - last) * each.ray.u : null);
    const samples = rays.map((each) => {
      const focusZ = focus(each);
      const referenceZ = focus(reference);
      return {
        channel: each.channel,
        focusZ,
        focusShiftMm: focusZ === null ? null : focusZ - state.imgZ,
        relativeFocusShiftMm: focusZ === null || referenceZ === null ? null : focusZ - referenceZ,
        imageHeightMm: height(each),
        relativeImageHeightMm: null,
        usable: each.usable,
        clipped: each.ray.clipped,
      };
    });
    const intercepts = samples.flatMap((sample) => (sample.focusZ === null ? [] : [sample.focusZ]));
    return {
      channels: [...CHANNELS],
      referenceChannel: "G",
      marginalFraction,
      imagePlaneZ: state.imgZ,
      lastSurfaceZ: last,
      longitudinalSpreadMm: Math.max(...intercepts) - Math.min(...intercepts),
      transverseSpreadMm: 0,
      samples,
      validChannelCount: intercepts.length,
    };
  }
  return null;
}
