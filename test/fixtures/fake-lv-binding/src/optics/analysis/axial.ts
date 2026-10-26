// The fake's spherical-aberration section and axial-colour section, under LV's names. Its zones and its channel
// indices are its own, deliberately not LV's; the launch of a ray (where it starts, along which direction) and the
// reading of an intercept (the height carried to the last vertex plane, over the slope) are LV's rule, so that rays
// made by the comparator's restatement give the fake's section numbers back to the bit.
import { traceSequential } from "../trace/sequentialTrace.js";
import { projectCoordinateToZ } from "../trace/utils.js";
import { CHROMATIC_CHANNEL_WAVELENGTH_NM, LINE_NM } from "../chromatic.js";
import { PROFILE_FRACS } from "./aberration/shared.js";
import type { FakeState, Vec3 } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

export const NEAR_AXIS_REAL_FRAC = 0.25;
export const MARGINAL_PUPIL_FRACTIONS = [0.9, 0.75, 0.5] as const;
export const DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS = [0.9, 0.75, 0.5] as const;
const CHANNELS = ["R", "G", "B", "V"] as const;

/** The fake's index of a medium at a chromatic channel: its own rule, not its MTF's. */
export function fakeChannelIndex(nd: number, channel: string): number {
  if (nd === 1) return 1;
  const wavelength = CHROMATIC_CHANNEL_WAVELENGTH_NM[channel as keyof typeof CHROMATIC_CHANNEL_WAVELENGTH_NM];
  return nd + (LINE_NM.d - wavelength) * 2e-5 + 1e-6;
}

/** A meridional ray of LV's shape, at the height `y0` with the slope 0, at the authored indices or a channel's. */
function meridional(state: FakeState, y0: number, stopSD: number, channel?: string) {
  const lead = state.lens.constants.rayLead ?? 0;
  const origin: Vec3 = [0, y0 - 0 * lead, (state.z[0] ?? 0) - lead];
  const trace = traceSequential(
    state,
    { origin, direction: [0, 0, 1] },
    {
      checkSemiDiameter: true,
      stopSemiDiameter: stopSD,
      stopOnClip: true,
      directionNormalized: true,
      ...(channel === undefined
        ? {}
        : { indexAtSurface: (_index: number, nd: number) => fakeChannelIndex(nd, channel) }),
    },
  );
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const last = state.surfaces.length - 1;
  return {
    clipped: trace.status !== "ok",
    y: projectCoordinateToZ(point[1], point[2], toward[1], toward[2], state.z[last]),
    u: toward[1] * (1 / toward[2]),
  };
}

function hitOf(request: FakeAnalysisRequest, signedFraction: number) {
  const state = request.preparedGeometry;
  const last = state.z[state.surfaces.length - 1];
  const ray = meridional(state, signedFraction * request.aperture.entrancePupilSemiDiameterMm, request.aperture.stopSemiDiameterMm);
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
      const ray = meridional(
        state,
        marginalFraction * request.aperture.entrancePupilSemiDiameterMm,
        request.aperture.stopSemiDiameterMm,
        channel,
      );
      return { channel, ray, usable: !ray.clipped && Math.abs(ray.u) > 1e-15 };
    });
    if (rays.filter((each) => each.usable).length < 2) continue;
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
