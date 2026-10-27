// The fake's field-curve and astigmatism sections, under LV's names. Their fields, their fans and their Petzval
// shift are the fake's own, deliberately not LV's; the rays each field launches (the chief ray, the four parabasal
// rays at LV's pupil fraction of 0.01 mm over the pupil radius, the real-ray fans) and how their foci are found (LV's
// least squares of the hits relative to the chief ray's) follow LV's rules, so that rays made by the comparator's
// restatement give the fake's numbers back to the bit.
import { sampleOrthogonalPupilFan, MERIDIONAL_COMA_SAMPLE_COUNT } from "./spots.js";
import { skewTrace } from "../trace/chiefTrace.js";
import type { FakeState } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

export const FIELD_CURVATURE_FIELD_FRACTIONS = [0, 0.5, 1] as const;
export const FIELD_CURVATURE_CURVE_FIELD_FRACTIONS = [0, 0.25, 0.5, 0.75, 1] as const;
const CHANNELS = ["R", "G", "B", "V"] as const;

/**
 * The fake's scalar off-axis field: the angle is the fraction of its half field, the slope that of the angle toward
 * -y, and its chief ray crosses the first vertex plane on the axis. Beyond `chiefLimitDeg` there is none; a field the
 * fake elsewhere "launches from a bounding sphere" is scalar here, as LV's is.
 */
export function computeOffAxisFieldGeometryScalar(state: FakeState, fieldFraction: number, stateGeometry?: unknown) {
  if (!(fieldFraction >= 0 && fieldFraction <= 1)) return null;
  const field = state.lens.runtime.source.field;
  const halfFieldDeg = (stateGeometry as { halfFieldDeg?: number } | undefined)?.halfFieldDeg ?? field?.edgeDeg ?? 20;
  const fieldAngleDeg = halfFieldDeg * fieldFraction;
  if (!(Math.abs(fieldAngleDeg) <= (field?.chiefLimitDeg ?? 60))) return null;
  const last = state.surfaces.length - 1;
  const lastSurfZ = state.z[last];
  const imagePlaneZ = lastSurfZ + (state.surfaces[last]?.d ?? 0);
  return { fieldFraction, fieldAngleDeg, uField: -Math.tan((fieldAngleDeg * Math.PI) / 180), yChief: 0, lastSurfZ, imagePlaneZ };
}

interface Hit {
  coordinate: number;
  slope: number;
}

/** LV's least squares of hits relative to a reference hit, from the last vertex plane. */
function bestRelativeFocusPlane(hits: Hit[], referenceHit: Hit, lastSurfZ: number): number {
  const denom = hits.reduce((sum, hit) => {
    const du = hit.slope - referenceHit.slope;
    return sum + du * du;
  }, 0);
  if (denom <= 1e-12) return lastSurfZ;
  const numer = hits.reduce((sum, hit) => {
    const du = hit.slope - referenceHit.slope;
    const offset = hit.coordinate - hit.slope * lastSurfZ - referenceHit.coordinate + referenceHit.slope * lastSurfZ;
    return sum + offset * du;
  }, 0);
  return -numer / denom;
}

function focusPlaneFromRelativeHits(hits: Hit[], referenceHit: Hit, lastSurfZ: number): number | null {
  if (hits.length === 0) return null;
  if (hits.length === 1) {
    const dy = hits[0].coordinate - referenceHit.coordinate;
    const du = hits[0].slope - referenceHit.slope;
    if (Math.abs(du) <= 1e-12) return lastSurfZ;
    return lastSurfZ - dy / du;
  }
  return bestRelativeFocusPlane(hits, referenceHit, lastSurfZ);
}

/** LV's parabasal pupil fraction: 0.01 mm over the pupil radius, between 1e-4 and 0.02. */
function parabasalPupilFraction(epsd: number): number {
  if (!isFinite(epsd) || epsd <= 0) return 1e-4;
  return Math.min(0.02, Math.max(1e-4, 0.01 / epsd));
}

type Geometry = NonNullable<ReturnType<typeof computeOffAxisFieldGeometryScalar>>;

/** The parabasal foci of a field at the authored indices or a channel's, as LV's `computeStandardizedFieldFocus`. */
function standardized(request: FakeAnalysisRequest, geometry: Geometry, channel?: string) {
  const state = request.preparedGeometry;
  const epsd = request.aperture.entrancePupilSemiDiameterMm;
  const stopSD = request.aperture.stopSemiDiameterMm;
  const chief = skewTrace(state, 0 * epsd, geometry.yChief + 0 * epsd, 0, geometry.uField, stopSD, channel);
  if (chief.clipped) return null;
  const p = parabasalPupilFraction(epsd);
  const hits = (direction: "tangential" | "sagittal"): Hit[] =>
    ([-1, 1] as const).flatMap((sign) => {
      const xFraction = direction === "sagittal" ? sign * p : 0;
      const yFraction = direction === "tangential" ? sign * p : 0;
      const trace = skewTrace(state, xFraction * epsd, geometry.yChief + yFraction * epsd, 0, geometry.uField, stopSD, channel);
      if (trace.clipped) return [];
      return [direction === "tangential" ? { coordinate: trace.y, slope: trace.uy } : { coordinate: trace.x, slope: trace.ux }];
    });
  const tangential = hits("tangential");
  const sagittal = hits("sagittal");
  const t = focusPlaneFromRelativeHits(tangential, { coordinate: chief.y, slope: chief.uy }, geometry.lastSurfZ);
  const s = focusPlaneFromRelativeHits(sagittal, { coordinate: chief.x, slope: chief.ux }, geometry.lastSurfZ);
  if (t === null || s === null) return null;
  const dz = geometry.imagePlaneZ - geometry.lastSurfZ;
  return {
    validSampleCount: tangential.length + sagittal.length,
    chiefImageHeight: chief.y + chief.uy * dz,
    tangentialBestFocusZ: t,
    sagittalBestFocusZ: s,
    tangentialShiftMm: t - geometry.imagePlaneZ,
    sagittalShiftMm: s - geometry.imagePlaneZ,
  };
}

/** The real-ray foci of a field's fans, as LV's `computeDiagnosticFieldFocus`, or undefined with fewer than 3 rays. */
function diagnostic(request: FakeAnalysisRequest, geometry: Geometry) {
  const state = request.preparedGeometry;
  const epsd = request.aperture.entrancePupilSemiDiameterMm;
  const stopSD = request.aperture.stopSemiDiameterMm;
  const chief = skewTrace(state, 0 * epsd, geometry.yChief + 0 * epsd, 0, geometry.uField, stopSD);
  const fan = (axis: "tangential" | "sagittal"): Hit[] =>
    sampleOrthogonalPupilFan(MERIDIONAL_COMA_SAMPLE_COUNT, axis).flatMap((sample) => {
      const trace = skewTrace(state, sample.xFraction * epsd, geometry.yChief + sample.yFraction * epsd, 0, geometry.uField, stopSD);
      if (trace.clipped) return [];
      return [axis === "tangential" ? { coordinate: trace.y, slope: trace.uy } : { coordinate: trace.x, slope: trace.ux }];
    });
  const [tangential, sagittal] = [fan("tangential"), fan("sagittal")];
  if (chief.clipped || tangential.length < 3 || sagittal.length < 3) return undefined;
  const t = bestRelativeFocusPlane(tangential, { coordinate: chief.y, slope: chief.uy }, geometry.lastSurfZ);
  const s = bestRelativeFocusPlane(sagittal, { coordinate: chief.x, slope: chief.ux }, geometry.lastSurfZ);
  return { t, s };
}

function fieldOf(request: FakeAnalysisRequest, fieldFraction: number, chromatic: boolean) {
  const empty = {
    fieldFraction,
    label: `${fieldFraction * 100}%`,
    fieldAngleDeg: 0,
    sampleCount: 4,
    validSampleCount: 0,
    clippedSampleCount: 4,
    chiefImageHeight: 0,
    tangentialBestFocusZ: 0,
    sagittalBestFocusZ: 0,
    petzvalBestFocusZ: 0,
    tangentialShiftMm: 0,
    sagittalShiftMm: 0,
    petzvalShiftMm: 0,
    astigmaticDifferenceMm: 0,
    astigmaticDifferenceUm: 0,
    chromaticFieldShifts: null,
    usable: false,
  };
  const state = request.preparedGeometry;
  if (!(request.aperture.entrancePupilSemiDiameterMm > 0)) return empty;
  const geometry = computeOffAxisFieldGeometryScalar(state, fieldFraction, request.fieldGeometry ?? undefined);
  if (geometry === null) return empty;
  const focus = standardized(request, geometry);
  if (focus === null) return empty;
  const real = diagnostic(request, geometry);
  const shifts = chromatic
    ? CHANNELS.map((channel) => {
        const atChannel = standardized(request, geometry, channel);
        return atChannel === null
          ? null
          : { channel, tangentialShiftMm: atChannel.tangentialShiftMm, sagittalShiftMm: atChannel.sagittalShiftMm };
      })
    : null;
  return {
    fieldFraction,
    label: `${fieldFraction * 100}%`,
    fieldAngleDeg: geometry.fieldAngleDeg,
    sampleCount: 4,
    validSampleCount: focus.validSampleCount,
    clippedSampleCount: 4 - focus.validSampleCount,
    chiefImageHeight: focus.chiefImageHeight,
    tangentialBestFocusZ: focus.tangentialBestFocusZ,
    sagittalBestFocusZ: focus.sagittalBestFocusZ,
    petzvalBestFocusZ: geometry.imagePlaneZ,
    tangentialShiftMm: focus.tangentialShiftMm,
    sagittalShiftMm: focus.sagittalShiftMm,
    petzvalShiftMm: 0,
    astigmaticDifferenceMm: focus.sagittalBestFocusZ - focus.tangentialBestFocusZ,
    astigmaticDifferenceUm: (focus.sagittalBestFocusZ - focus.tangentialBestFocusZ) * 1000,
    ...(real === undefined
      ? {}
      : {
          diagnosticTangentialBestFocusZ: real.t,
          diagnosticSagittalBestFocusZ: real.s,
          diagnosticTangentialShiftMm: real.t - geometry.imagePlaneZ,
          diagnosticSagittalShiftMm: real.s - geometry.imagePlaneZ,
          diagnosticAstigmaticDifferenceMm: real.s - real.t,
        }),
    chromaticFieldShifts: shifts === null || shifts.some((shift) => shift === null) ? null : shifts,
    usable: true,
  };
}

function resultOf(request: FakeAnalysisRequest, chromatic: boolean) {
  const state = request.preparedGeometry;
  const last = state.surfaces.length - 1;
  const imagePlaneZ = state.z[last] + (state.surfaces[last]?.d ?? 0);
  const fields = FIELD_CURVATURE_FIELD_FRACTIONS.map((fraction) => fieldOf(request, fraction, chromatic));
  const curveFields = FIELD_CURVATURE_CURVE_FIELD_FRACTIONS.map((fraction) => fieldOf(request, fraction, chromatic));
  const usable = fields.filter((field) => field.usable);
  if (usable.length < 2) return null;
  const edge = usable[usable.length - 1];
  return {
    fieldFractions: [...FIELD_CURVATURE_FIELD_FRACTIONS],
    curveFieldFractions: [...FIELD_CURVATURE_CURVE_FIELD_FRACTIONS],
    fields,
    curveFields,
    usableFieldCount: usable.length,
    imagePlaneZ,
    maxAstigmaticDifferenceMm: Math.max(...usable.map((field) => Math.abs(field.astigmaticDifferenceMm))),
    edgeTangentialShiftMm: edge.tangentialShiftMm,
    edgeSagittalShiftMm: edge.sagittalShiftMm,
    chromaticFocusSpreadMm: chromatic ? 0 : null,
  };
}

/** The fake's field curves at its authored indices and, with each channel's shifts, at its chromatic channels. */
export function computeFieldCurvatureBundle(request: FakeAnalysisRequest) {
  const fieldCurvature = resultOf(request, false);
  return { fieldCurvature, chromaticFieldCurvature: fieldCurvature === null ? null : resultOf(request, true) };
}
