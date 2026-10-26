// The fake's distortion tab, pupils tab, lateral-colour section and focus-breathing chart, under LV's names. Their
// sample counts and fractions are the fake's own, deliberately not LV's, and the fake's distortion curve plots its
// chief rays' landings at even angles where LV's solves angles for even heights; the rays each launches (its scale
// probe, its solved chief rays, its grid's pupil-corrected launches, its lateral-colour chief rays) follow LV's rules,
// so that rays made by the comparator's restatement give the fake's numbers back to the bit.
import { computeOffAxisFieldGeometry, skewImagePlaneIntercept } from "./spots.js";
import { uniformFieldFraction } from "./sampling.js";
import { paraxialTrace } from "../first-order/lensConstants.js";
import {
  distortionProjectionReferenceForLens,
  isFisheyeProjection,
  projectionFieldSlopesForImagePoint,
  projectionLaunchSlopeForField,
} from "../projection.js";
import {
  chiefRayImageHeightAccurateForRuntimeLens,
  chiefRayImageHeightForRuntimeLens,
  solveChiefRayForRuntimeLens,
} from "../state/fieldAdapters.js";
import { epZRelStopAtZoom, xpZRelLastSurfAtZoom } from "../state/pupils.js";
import { computeAnalysisFieldGeometryAtState, prepareRuntimeState } from "../state/runtime.js";
import { meridionalTrace, skewTrace } from "../trace/chiefTrace.js";
import type { FakeRuntimeLens, FakeState } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

export const PUPIL_ABERRATION_SAMPLE_COUNT = 5;
export const DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS = [0, 0.5, 1] as const;
const DISTORTION_SAMPLE_COUNT = 5;
const GRID_COORDINATES = [-1, 0, 1] as const;
const GRID_AXIS = [-1, -0.5, 0, 0.5, 1] as const;
const CHANNELS = ["R", "G", "B", "V"] as const;

/** Whether the fake samples a lens's ray work coarsely, as LV does a heavy lens: its own flag. */
export function isHeavyLensForRayWork(L: FakeRuntimeLens): boolean {
  return (L.source as { heavy?: boolean }).heavy === true;
}

type Geometry = { epRatio: number; halfFieldDeg: number };

function geometryOf(request: FakeAnalysisRequest): Geometry {
  const state = request.preparedGeometry;
  return (request.fieldGeometry ??
    computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, state.lens.runtime)) as Geometry;
}

/** LV's rectilinear reference: the scale of a near-axis probe, its chief ray launched from the paraxial pupil. */
function referenceOf(state: FakeState, geometry: Geometry) {
  const L = state.lens.runtime;
  const zPos = [...state.z];
  const scaleProbeAngleDeg = Math.min(Math.max(geometry.halfFieldDeg * 0.01, 0.02), 0.5);
  const probeImageHeight = chiefRayImageHeightForRuntimeLens(scaleProbeAngleDeg, zPos, state.focusT, state.zoomT, L, geometry);
  const probeTan = -projectionLaunchSlopeForField(L, scaleProbeAngleDeg).uField;
  const rectilinearScale = -probeImageHeight / probeTan;
  const edge = chiefRayImageHeightAccurateForRuntimeLens(geometry.halfFieldDeg, zPos, state.focusT, state.zoomT, L, geometry);
  return { reference: distortionProjectionReferenceForLens(L, rectilinearScale), edge };
}

export function computeDistortionCurve(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const L = state.lens.runtime;
  const geometry = geometryOf(request);
  const corner = { status: "reached", fieldAngleDeg: geometry.halfFieldDeg };
  if (isFisheyeProjection(L.projection)) return { samples: [], corner, cornerImageHeight: 21.6 };
  const { reference } = referenceOf(state, geometry);
  const samples = [];
  for (let i = 0; i < DISTORTION_SAMPLE_COUNT; i++) {
    const normalizedImageHeight = uniformFieldFraction(i, DISTORTION_SAMPLE_COUNT);
    if (i === 0) {
      samples.push({ fieldAngleDeg: 0, normalizedImageHeight: 0, imageHeight: 0, distortionPercent: 0, realHeight: 0, idealHeight: 0, idealFieldAngleDeg: 0, referenceKind: reference.kind });
      continue;
    }
    const fieldAngleDeg = normalizedImageHeight * geometry.halfFieldDeg;
    const realHeight = chiefRayImageHeightAccurateForRuntimeLens(fieldAngleDeg, [...state.z], state.focusT, state.zoomT, L, geometry);
    if (!Number.isFinite(realHeight)) continue;
    const idealHeight = -(reference.focalScaleMm * Math.tan((fieldAngleDeg * Math.PI) / 180));
    const distortionPercent = (100 * (realHeight - idealHeight)) / idealHeight;
    samples.push({ fieldAngleDeg, normalizedImageHeight, imageHeight: realHeight, distortionPercent, realHeight, idealHeight, idealFieldAngleDeg: fieldAngleDeg, referenceKind: reference.kind });
  }
  return { samples, corner, cornerImageHeight: 21.6 };
}

/** LV's pupil-correction table: the solved chief ray's launch height over the paraxial one, at even angles. */
function pupilCorrectionTable(state: FakeState, geometry: Geometry) {
  const L = state.lens.runtime;
  const sampleCount = isHeavyLensForRayWork(L) ? 9 : 17;
  const table: { angleDeg: number; ratio: number }[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const angleDeg = uniformFieldFraction(i, sampleCount) * geometry.halfFieldDeg;
    const launch = projectionLaunchSlopeForField(L, angleDeg);
    if (launch.status === "out-of-domain") {
      table.push({ angleDeg, ratio: 1 });
      continue;
    }
    const paraxialYChief = -geometry.epRatio * launch.uField;
    const solvedYChief = solveChiefRayForRuntimeLens(angleDeg, state.focusT, state.zoomT, L, geometry).yLaunch;
    const ratio = Math.abs(paraxialYChief) > 1e-12 ? solvedYChief / paraxialYChief : 1;
    table.push({ angleDeg, ratio: isFinite(ratio) ? ratio : 1 });
  }
  return table;
}

function interpolate(table: { angleDeg: number; ratio: number }[], angleDeg: number): number {
  if (table.length === 0) return 1;
  if (angleDeg <= table[0].angleDeg) return table[0].ratio;
  if (angleDeg >= table[table.length - 1].angleDeg) return table[table.length - 1].ratio;
  for (let i = 0; i < table.length - 1; i++) {
    if (angleDeg <= table[i + 1].angleDeg) {
      const t = (angleDeg - table[i].angleDeg) / (table[i + 1].angleDeg - table[i].angleDeg);
      return table[i].ratio + t * (table[i + 1].ratio - table[i].ratio);
    }
  }
  return 1;
}

export function computeDistortionFieldGrid(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const L = state.lens.runtime;
  const geometry = geometryOf(request);
  const empty = { lines: [], idealFieldRadius: 0, referenceKind: "rectilinear", referenceLabel: "Rectilinear distortion" };
  if (isFisheyeProjection(L.projection)) return empty;
  const { reference, edge } = referenceOf(state, geometry);
  if (!Number.isFinite(edge) || Math.abs(edge) < 1e-9) return empty;
  const idealFieldRadius = Math.abs(reference.focalScaleMm * Math.tan((geometry.halfFieldDeg * Math.PI) / 180));
  const table = pupilCorrectionTable(state, geometry);
  const last = state.surfaces.length - 1;
  const lastSurfZ = state.z[last];
  const imagePlaneZ = lastSurfZ + state.surfaces[last].d;
  const point = (x: number, y: number) => {
    const radiusNormalized = Math.hypot(x, y);
    const insideImageCircle = radiusNormalized <= 1 + 1e-9;
    const idealX = x * idealFieldRadius;
    const idealY = y * idealFieldRadius;
    const none = { idealX, idealY, tracedX: null, tracedY: null, radiusNormalized, insideImageCircle, usable: false };
    if (!insideImageCircle) return none;
    const slopes = projectionFieldSlopesForImagePoint(reference, idealX, idealY);
    if (slopes === null) return none;
    const correction = interpolate(table, slopes.equivalentAngleDeg);
    const fieldSlopeX = slopes.fieldSlopeX * 1;
    const fieldSlopeY = slopes.fieldSlopeY * 1;
    const correctedEpRatio = geometry.epRatio * correction;
    const trace = skewTrace(
      state,
      -correctedEpRatio * fieldSlopeX,
      -correctedEpRatio * fieldSlopeY,
      fieldSlopeX,
      fieldSlopeY,
      request.aperture.stopSemiDiameterMm,
    );
    if (trace.clipped) return none;
    const image = skewImagePlaneIntercept(trace.x, trace.y, trace.ux, trace.uy, lastSurfZ, imagePlaneZ);
    return { ...none, tracedX: image?.x ?? null, tracedY: image ? -image.y : null, usable: image !== null };
  };
  return {
    idealFieldRadius,
    referenceKind: reference.kind,
    referenceLabel: reference.label,
    lines: GRID_COORDINATES.flatMap((coordinate) => [
      { orientation: "vertical", idealCoordinate: coordinate, points: GRID_AXIS.map((y) => point(coordinate, y)) },
      { orientation: "horizontal", idealCoordinate: coordinate, points: GRID_AXIS.map((x) => point(x, coordinate)) },
    ]),
  };
}

export function computeBothPupilAberrationProfiles(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const L = state.lens.runtime;
  const geometry = geometryOf(request);
  const { halfFieldDeg, epRatio } = geometry;
  const paraxialEpZRelStop = epZRelStopAtZoom(state.zoomT, L);
  const paraxialXpZRelLastSurf = xpZRelLastSurfAtZoom(state.zoomT, L);
  const n = Math.max(PUPIL_ABERRATION_SAMPLE_COUNT, 2);
  const epSamples = [];
  const xpSamples = [];
  for (let i = 0; i < n; i++) {
    const fieldFrac = uniformFieldFraction(i, n);
    const fieldDeg = fieldFrac * halfFieldDeg;
    const launch = projectionLaunchSlopeForField(L, fieldDeg);
    const solve = solveChiefRayForRuntimeLens(fieldDeg, state.focusT, state.zoomT, L, geometry);
    let chiefRayCorrection = 1;
    let epShiftMm = 0;
    let xpZRelLastSurf = paraxialXpZRelLastSurf;
    let xpShiftMm = 0;
    const paraxialYChief = -epRatio * launch.uField;
    if (Math.abs(fieldDeg) > 1e-9 && launch.status !== "out-of-domain" && !("vectorLaunch" in solve)) {
      const yChief = solve.yLaunch;
      if (Math.abs(paraxialYChief) > 1e-12) {
        chiefRayCorrection = isFinite(yChief) ? yChief / paraxialYChief : 1;
        epShiftMm = (chiefRayCorrection - 1) * epRatio;
      }
      const result = meridionalTrace(state, yChief, launch.uField);
      if (isFinite(result.y) && isFinite(result.u) && Math.abs(result.u) > 1e-9) {
        xpZRelLastSurf = -result.y / result.u;
        xpShiftMm = xpZRelLastSurf - paraxialXpZRelLastSurf;
      }
    }
    epSamples.push({ fieldFrac, fieldDeg, chiefRayCorrection, epShiftMm });
    xpSamples.push({ fieldFrac, fieldDeg, xpZRelLastSurf, xpShiftMm });
  }
  const maxAbsEpShiftMm = Math.max(...epSamples.map((s) => Math.abs(s.epShiftMm)));
  const maxAbsXpShiftMm = Math.max(...xpSamples.map((s) => Math.abs(s.xpShiftMm)));
  return {
    ep: { samples: epSamples, paraxialEpZRelStop, maxAbsShiftMm: maxAbsEpShiftMm, halfFieldDeg },
    xp: { samples: xpSamples, paraxialXpZRelLastSurf, maxAbsShiftMm: maxAbsXpShiftMm, halfFieldDeg },
    halfFieldDeg,
    maxAbsEpShiftMm,
    maxAbsXpShiftMm,
  };
}

export function computeLateralColorCurve(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const geometry = geometryOf(request);
  const epsd = request.aperture.entrancePupilSemiDiameterMm;
  if (!(epsd > 0)) return null;
  const fields = DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS.map((fieldFraction) => {
    const off = computeOffAxisFieldGeometry(state, fieldFraction, geometry);
    const empty = { fieldFraction, label: `${fieldFraction * 100}%`, fieldAngleDeg: 0, referenceChannel: "G", referenceImageHeightMm: null, lateralSpreadMm: null, samples: [], validChannelCount: 0, usable: false };
    if (off === null || "kind" in off) return empty;
    const raw = CHANNELS.map((channel) => {
      const trace = skewTrace(state, 0 * epsd, off.yChief + 0 * epsd, 0, off.uField, request.aperture.stopSemiDiameterMm, channel);
      const image = trace.clipped ? null : skewImagePlaneIntercept(trace.x, trace.y, trace.ux, trace.uy, off.lastSurfZ, off.imagePlaneZ);
      return { channel, imageHeightMm: image?.y ?? null, clipped: image === null };
    });
    const reference = raw.find((sample) => sample.channel === "G")?.imageHeightMm ?? null;
    const valid = raw.flatMap((sample) => (sample.imageHeightMm === null ? [] : [sample.imageHeightMm]));
    const lateralSpreadMm = valid.length < 2 ? null : Math.max(...valid) - Math.min(...valid);
    return {
      fieldFraction,
      label: `${fieldFraction * 100}%`,
      fieldAngleDeg: off.fieldAngleDeg,
      referenceChannel: "G",
      referenceImageHeightMm: reference,
      lateralSpreadMm,
      samples: raw.map((sample) => ({
        channel: sample.channel,
        imageHeightMm: sample.imageHeightMm,
        relativeHeightMm: sample.imageHeightMm === null || reference === null ? null : sample.imageHeightMm - reference,
        usable: sample.imageHeightMm !== null,
        clipped: sample.clipped,
      })),
      validChannelCount: valid.length,
      usable: lateralSpreadMm !== null,
    };
  });
  const usable = fields.filter((field) => field.usable);
  if (usable.length === 0) return null;
  return {
    channels: [...CHANNELS],
    referenceChannel: "G",
    fieldFractions: [...DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS],
    fields,
    usableFieldCount: usable.length,
    maxLateralSpreadMm: Math.max(...usable.map((field) => field.lateralSpreadMm ?? 0)),
    imagePlaneZ: state.imgZ,
    halfFieldDeg: geometry.halfFieldDeg,
  };
}

/** The fake's focal length of a state: its paraxial kernel's unit-height collimated ray. */
function eflOf(state: FakeState): number {
  return -1 / paraxialTrace(state.surfaces, 1, 0, { skipLastTransfer: true }).u;
}

export function computeFocusEFL(request: FakeAnalysisRequest): number {
  return eflOf(request.preparedGeometry);
}

export function computeFocusBreathingSeries(request: FakeAnalysisRequest) {
  const { focusT: current, zoomT } = request.preparedGeometry;
  const L = request.preparedGeometry.lens.runtime;
  const infinity = eflOf(prepareRuntimeState(L, 0, zoomT));
  return [...new Set([0, 0.5, 1, current])]
    .sort((a, b) => a - b)
    .map((focusT) => {
      const efl = eflOf(prepareRuntimeState(L, focusT, zoomT));
      return { focusT, efl, breathingPercent: (100 * (efl - infinity)) / infinity, distanceLabel: String(focusT) };
    });
}
