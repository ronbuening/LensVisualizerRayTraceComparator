// The fake's vignetting tab, under LV's name. Its tracer and its lenses are the fake's own; the rays it launches (the
// solved chief ray of each field and a meridional sweep across the pupil's diameter around it, at LV's counts of
// fields and rays), how it counts them and its cos^4 follow LV's rules (`computeVignettingCurve`), so that rays made by
// the comparator's restatement give the fake's numbers back to the bit.
import { evenlySpacedSigned, uniformFieldFraction } from "./sampling.js";
import { isHeavyLensForRayWork } from "./chief.js";
import { transmission } from "./mtf/mtfTracing.js";
import { directionFromMeridionalSlope } from "../math/vector.js";
import { projectionLaunchSlopeForField } from "../projection.js";
import { solveChiefRayForRuntimeLens } from "../state/fieldAdapters.js";
import { computeAnalysisFieldGeometryAtState } from "../state/runtime.js";
import { traceSequential } from "../trace/sequentialTrace.js";
import type { Vec3 } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

export function computeVignettingCurve(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const L = state.lens.runtime;
  const epsd = request.aperture.entrancePupilSemiDiameterMm;
  const stopSD = request.aperture.stopSemiDiameterMm;
  if (epsd <= 0) return [];
  const geometry = (request.fieldGeometry ?? computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, L)) as {
    halfFieldDeg: number;
  };
  const halfFieldDeg = geometry.halfFieldDeg;
  if (!(halfFieldDeg > 0) || !isFinite(halfFieldDeg)) return [];
  const fieldSamples = Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
  const nPupil = Math.max(isHeavyLensForRayWork(L) ? 96 : 192, 3);
  const fractions = evenlySpacedSigned(nPupil);
  const lead = state.lens.constants.rayLead ?? 0;
  const rawGT: number[] = [];
  const rawIntensity: number[] = [];
  for (let i = 0; i < fieldSamples; i++) {
    const fieldAngleDeg = uniformFieldFraction(i, fieldSamples) * halfFieldDeg;
    const solve = solveChiefRayForRuntimeLens(fieldAngleDeg, state.focusT, state.zoomT, L, geometry);
    const launch = projectionLaunchSlopeForField(L, fieldAngleDeg);
    if (launch.status === "out-of-domain" && !("vectorLaunch" in solve)) {
      rawGT.push(0);
      rawIntensity.push(0);
      continue;
    }
    const u0 = launch.uField;
    // The fake traces a field it "launches from a bounding sphere" from its paraxial height: its own number.
    const yChief = solve.yLaunch;
    const direction: Vec3 = u0 === 0 ? [0, 0, 1] : (directionFromMeridionalSlope(u0) ?? [0, 0, 1]);
    let surviving = 0;
    let transmitted = 0;
    for (const fraction of fractions) {
      const pupilOffset = fraction * epsd;
      const y0 = yChief + pupilOffset;
      const origin: Vec3 = [0, y0 - u0 * lead, (state.z[0] ?? 0) - lead];
      const trace = traceSequential(
        state,
        { origin, direction },
        { checkSemiDiameter: true, stopSemiDiameter: stopSD, stopOnClip: true, directionNormalized: true },
      );
      if (trace.status !== "ok") continue;
      surviving++;
      transmitted += transmission(state, trace);
    }
    rawGT.push(surviving / nPupil);
    rawIntensity.push(transmitted / nPupil);
  }
  const [gtAxis, intensityAxis] = [rawGT[0], rawIntensity[0]];
  if (gtAxis === 0 || intensityAxis === 0) return [];
  return rawGT.map((gt, i) => {
    const fieldAngleDeg = uniformFieldFraction(i, fieldSamples) * halfFieldDeg;
    const cos4 = Math.pow(Math.cos((fieldAngleDeg * Math.PI) / 180), 4);
    return {
      fieldAngleDeg,
      geometricTransmission: gt / gtAxis,
      relativeIllumination: (rawIntensity[i] * cos4) / intensityAxis,
    };
  });
}
