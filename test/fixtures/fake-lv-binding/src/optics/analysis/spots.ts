// The fake's coma and bokeh tabs, under LV's names: pupil patterns, an off-axis field geometry, a skew launch of
// LV's shape and the spots and fans it draws. Its patterns, fields and thresholds are its own, deliberately not
// LV's; the launch of a skew ray (where it starts, along which direction) is LV's rule, so that rays made by the
// comparator's restatement give the fake's tab numbers back to the bit.
import { traceSequential } from "../trace/sequentialTrace.js";
import { projectCoordinateToZ } from "../trace/utils.js";
import { directionFromSkewSlope } from "../math/vector.js";
import { prepareRuntimeState } from "../state/runtime.js";
import { prepareAimedPupilLaunch, prepareAimedPupilTrace } from "./pupils/aimedPupil.js";
import { transmission } from "./mtf/mtfTracing.js";
import type { FakeRuntimeLens, FakeState, Vec3 } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

export const COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES = [1, 4, 8] as const;
export const COMA_PREVIEW_FIELD_FRACTIONS = [0, 0.5, 0.9] as const;
export const MERIDIONAL_COMA_SAMPLE_COUNT = 6;
export const BOKEH_CIRCULAR_PUPIL_RING_SAMPLES = [1, 6, 10] as const;
export const BOKEH_PREVIEW_FIELD_FRACTIONS = [0, 0.3] as const;

/** The fake's circular pattern: a centre, then rings at even radii, each sample of weight 1/N. */
export function sampleCircularPupil(ringSamples: readonly number[]) {
  const counts = ringSamples.map((count) => Math.max(1, Math.round(count)));
  const total = counts.reduce((sum, count) => sum + count, 0);
  const samples: {
    index: number;
    xFraction: number;
    yFraction: number;
    radiusFraction: number;
    azimuthRad: number;
    weight: number;
  }[] = [];
  counts.forEach((count, ring) => {
    const radiusFraction = counts.length === 1 ? 0 : ring / (counts.length - 1);
    for (let at = 0; at < count; at++) {
      const azimuthRad = (2 * Math.PI * at) / count;
      samples.push({
        index: samples.length,
        xFraction: radiusFraction * Math.cos(azimuthRad),
        yFraction: radiusFraction * Math.sin(azimuthRad),
        radiusFraction,
        azimuthRad,
        weight: 1 / total,
      });
    }
  });
  return samples;
}

/** The fake's fan: an odd count, evenly from -1 to 1. */
export function sampleOrthogonalPupilFan(sampleCount: number, orientation: "tangential" | "sagittal") {
  const rounded = Math.max(1, Math.round(sampleCount));
  const odd = rounded % 2 === 0 ? rounded + 1 : rounded;
  return Array.from({ length: odd }, (_unused, index) => {
    const pupilFraction = odd === 1 ? 0 : -1 + (2 * index) / (odd - 1);
    return {
      index,
      pupilFraction,
      xFraction: orientation === "sagittal" ? pupilFraction : 0,
      yFraction: orientation === "tangential" ? pupilFraction : 0,
    };
  });
}

/**
 * The fake's off-axis field: the angle is the fraction of its half field, the slope that of the angle toward -y, and
 * its chief ray crosses the first vertex plane on the axis, as the fake's MTF chief ray does. Beyond `chiefLimitDeg`
 * there is none, and beyond `vectorBeyondDeg` the fake "launches from a bounding sphere".
 */
export function computeOffAxisFieldGeometry(state: FakeState, fieldFraction: number, stateGeometry?: unknown) {
  if (!(fieldFraction >= 0 && fieldFraction <= 1)) return null;
  const field = state.lens.runtime.source.field;
  const halfFieldDeg = (stateGeometry as { halfFieldDeg?: number } | undefined)?.halfFieldDeg ?? field?.edgeDeg ?? 20;
  const fieldAngleDeg = halfFieldDeg * fieldFraction;
  if (!(Math.abs(fieldAngleDeg) <= (field?.chiefLimitDeg ?? 60))) return null;
  const last = state.surfaces.length - 1;
  const common = { fieldFraction, fieldAngleDeg, lastSurfZ: state.z[last], imagePlaneZ: state.imgZ };
  const vectorBeyond = (field as { vectorBeyondDeg?: number } | undefined)?.vectorBeyondDeg;
  if (vectorBeyond !== undefined && fieldAngleDeg > vectorBeyond) return { kind: "vector" as const, ...common };
  return { ...common, uField: -Math.tan((fieldAngleDeg * Math.PI) / 180), yChief: 0 };
}

/** A skew trace's crossing of the last vertex plane and its slopes, as LV's runtime result has them. */
interface SkewTrace {
  x: number;
  y: number;
  ux: number;
  uy: number;
  clipped: boolean;
  transmission: number;
}

/** LV's skew launch: the ray crosses the first vertex plane at (x0, y0) and starts `rayLead` ahead of it. */
function skewOn(state: FakeState, x0: number, y0: number, ux0: number, uy0: number, stopSD: number | undefined): SkewTrace {
  const lead = state.lens.constants.rayLead ?? 0;
  const direction = directionFromSkewSlope(ux0, uy0) ?? ([0, 0, 1] as Vec3);
  const origin: Vec3 = [x0 - ux0 * lead, y0 - uy0 * lead, (state.z[0] ?? 0) - lead];
  const trace = traceSequential(
    state,
    { origin, direction },
    { checkSemiDiameter: true, stopSemiDiameter: stopSD, stopOnClip: true, directionNormalized: true },
  );
  const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
  const z = state.z[Math.max(0, trace.terminalSurfaceIndex)];
  return {
    x: projectCoordinateToZ(point[0], point[2], toward[0], toward[2], z),
    y: projectCoordinateToZ(point[1], point[2], toward[1], toward[2], z),
    ux: toward[0] / toward[2],
    uy: toward[1] / toward[2],
    clipped: trace.status !== "ok",
    transmission: transmission(state, trace),
  };
}

export function traceSkewRay(
  x0: number,
  y0: number,
  ux0: number,
  uy0: number,
  focusT: number,
  zoomT: number,
  stopSD: number | undefined,
  _ghost: boolean,
  L: FakeRuntimeLens,
  aberrationT = 0,
): SkewTrace {
  return skewOn(prepareRuntimeState(L, focusT, zoomT, aberrationT), x0, y0, ux0, uy0, stopSD);
}

export function skewImagePlaneIntercept(
  x: number,
  y: number,
  ux: number,
  uy: number,
  lastSurfZ: number,
  imagePlaneZ: number,
): { x: number; y: number } | null {
  const dz = imagePlaneZ - lastSurfZ;
  const imagePoint = { x: x + ux * dz, y: y + uy * dz };
  return isFinite(imagePoint.x) && isFinite(imagePoint.y) ? imagePoint : null;
}

/**
 * One traced bundle of a field: its chief ray's landing and every sample that landed, at a plane. Since LV #927 every
 * sample is the fake's aimed launch at its point of the stop (`prepareAimedPupilLaunch`), traced as the launch's own
 * trace; the chief ray is the launch's stop-centre ray, an unaimed sample is counted and never traced.
 */
function bundleOf(
  request: FakeAnalysisRequest,
  fieldFraction: number,
  samples: readonly { index: number; xFraction: number; yFraction: number; weight?: number }[],
  planeZ?: number,
) {
  const state = request.preparedGeometry;
  const geometry = computeOffAxisFieldGeometry(state, fieldFraction, request.fieldGeometry ?? undefined);
  if (geometry === null || "kind" in geometry) return null;
  const launch = prepareAimedPupilLaunch(request, samples, geometry);
  if (launch === null || launch.chief.status !== "aimed") return null;
  const tracer = prepareAimedPupilTrace(state, launch);
  const plane = planeZ ?? geometry.imagePlaneZ;
  const land = (trace: SkewTrace) =>
    skewImagePlaneIntercept(trace.x, trace.y, trace.ux, trace.uy, geometry.lastSurfZ, plane);
  const chiefTrace = tracer.skew(launch.chief as never);
  const chief = chiefTrace.clipped ? null : land(chiefTrace);
  if (chief === null) return null;
  const landed = samples.flatMap((sample, at) => {
    const ray = launch.rays[at];
    if (ray.status !== "aimed") return [];
    const trace = tracer.skew(ray as never);
    const point = trace.clipped ? null : land(trace);
    return point === null ? [] : [{ sample, point, transmission: trace.transmission }];
  });
  return { geometry, chief, landed, total: samples.length, unaimed: launch.unaimedCount };
}

/** The fake's coma tab: its point cloud at its preview fields, and its two fans at the detail field. */
export function computeComaAnalysis(request: FakeAnalysisRequest) {
  const sampling = request.sampling as {
    comaDetailFieldFraction?: number;
    comaFieldFractions?: readonly number[];
    comaRingSamples?: readonly number[];
    comaFanSampleCount?: number;
  };
  const runtime = request.preparedGeometry.lens.runtime as FakeRuntimeLens & { offAxisFieldFrac: number };
  const detail = sampling.comaDetailFieldFraction ?? runtime.offAxisFieldFrac;
  const count = Math.max(3, Math.round(sampling.comaFanSampleCount ?? MERIDIONAL_COMA_SAMPLE_COUNT));
  const fan = (axis: "tangential" | "sagittal") => {
    const samples = sampleOrthogonalPupilFan(count, axis);
    const bundle = bundleOf(request, detail, samples);
    if (bundle === null || !(bundle.geometry.fieldAngleDeg > 0) || bundle.landed.length < 3) return null;
    const along = (point: { x: number; y: number }) => (axis === "tangential" ? point.y : point.x);
    const centerIntercept = along(bundle.chief);
    return {
      fieldFraction: detail,
      fieldAngleDeg: bundle.geometry.fieldAngleDeg,
      sampleCount: samples.length,
      validSampleCount: bundle.landed.length,
      clippedSampleCount: samples.length - bundle.landed.length,
      centerIntercept,
      samples: samples.map((sample) => {
        const hit = bundle.landed.find((each) => each.sample.index === sample.index);
        const relative = hit === undefined ? null : along(hit.point) - centerIntercept;
        return {
          index: sample.index,
          pupilFraction: sample.pupilFraction,
          [axis === "tangential" ? "relativeImageHeight" : "relativeImageX"]: relative,
          clipped: hit === undefined,
        };
      }),
    };
  };
  const fractions = sampling.comaFieldFractions ?? COMA_PREVIEW_FIELD_FRACTIONS;
  const rings = sampleCircularPupil(sampling.comaRingSamples ?? COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES);
  const fields = fractions.map((fieldFraction) => {
    const bundle = bundleOf(request, fieldFraction, rings);
    const empty = {
      fieldFraction,
      fieldAngleDeg: 0,
      sampleCount: rings.length,
      validSampleCount: 0,
      clippedSampleCount: rings.length,
      chiefIntercept: 0,
      centroidTangentialImageHeight: 0,
      centroidSagittalImageHeight: 0,
      rmsRadiusMm: 0,
      usable: false,
    };
    // The fake draws a field of three landed samples or more: LV wants five.
    if (bundle === null || bundle.landed.length < 3) return empty;
    const points = bundle.landed.map(({ sample, point }) => ({
      t: point.y - bundle.chief.y,
      s: point.x - bundle.chief.x,
      w: sample.weight ?? 0,
    }));
    const total = points.reduce((sum, point) => sum + point.w, 0);
    const ct = points.reduce((sum, point) => sum + point.t * point.w, 0) / total;
    const cs = points.reduce((sum, point) => sum + point.s * point.w, 0) / total;
    const rms = Math.sqrt(points.reduce((sum, p) => sum + p.w * ((p.t - ct) ** 2 + (p.s - cs) ** 2), 0) / total);
    return {
      fieldFraction,
      fieldAngleDeg: bundle.geometry.fieldAngleDeg,
      sampleCount: rings.length,
      validSampleCount: bundle.landed.length,
      clippedSampleCount: rings.length - bundle.landed.length,
      chiefIntercept: bundle.chief.y,
      centroidTangentialImageHeight: ct,
      centroidSagittalImageHeight: cs,
      rmsRadiusMm: rms,
      usable: true,
    };
  });
  const usable = fields.filter((field) => field.usable).length;
  return {
    meridionalComa: fan("tangential"),
    sagittalComa: fan("sagittal"),
    pointCloudPreview: usable < 2 ? null : { fieldFractions: [...fractions], fields },
  };
}

/** The fake's bokeh tile: its rings traced at the request's focus and intercepted at `sensorZ`. */
export function computeBokehFieldFootprint(request: FakeAnalysisRequest, fieldFraction: number, sensorZ: number) {
  const rings = sampleCircularPupil(BOKEH_CIRCULAR_PUPIL_RING_SAMPLES);
  const bundle = bundleOf(request, fieldFraction, rings, sensorZ);
  if (bundle === null) return null;
  const points = bundle.landed.map(({ sample, point, transmission: transmitted }) => ({
    s: point.x - bundle.chief.x,
    t: point.y - bundle.chief.y,
    w: sample.weight * transmitted,
  }));
  const usable = points.length >= 3;
  const total = points.reduce((sum, point) => sum + point.w, 0);
  const cs = usable ? points.reduce((sum, point) => sum + point.s * point.w, 0) / total : 0;
  const ct = usable ? points.reduce((sum, point) => sum + point.t * point.w, 0) / total : 0;
  const rms = usable
    ? Math.sqrt(points.reduce((sum, p) => sum + p.w * ((p.s - cs) ** 2 + (p.t - ct) ** 2), 0) / total)
    : 0;
  return {
    fieldFraction,
    fieldAngleDeg: bundle.geometry.fieldAngleDeg,
    totalRays: rings.length,
    passedRays: points.length,
    centroidSagittal: cs,
    centroidTangential: ct,
    rmsRadiusMm: rms,
    maxRadiusMm: usable ? Math.max(...points.map((p) => Math.hypot(p.s - cs, p.t - ct))) : 0,
    // Transmission is over the rays that have a launch: unaimed ones are left out (LV #927).
    transmission: points.length / (rings.length - bundle.unaimed),
    usable,
  };
}
