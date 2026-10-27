// The fake's vignetting tab, under LV's name. Its tracer, its lenses and its MTF launch are the fake's own; what the tab
// does with them follows LV's rules since 5ba17c20c (`computeVignettingCurve`): each field's beam traced on the MTF's
// launch lattice of 64 cells across its footprint, one half of it mirrored, its lit cells' area and their bulk
// transmission; the image area a unit of object solid angle covers from lit chief rays 0.01 degrees apart; no curve of
// a state outside the MTF's beam model, of one with a field launched from a bounding sphere, or where a beam's mapping
// cannot be traced. Where a field's chief rays are vignetted, the fake's "ray tubes" are its own: the same chief rays
// traced without aperture checks. So rays made by the comparator's restatement give the fake's numbers back to the bit.
import { uniformFieldFraction } from "./sampling.js";
import {
  findMtfFieldFootprint,
  mtfImagePoint,
  mtfLaunchGrid,
  mtfLaunchRay,
  mtfMirrorSymmetric,
  mtfTraceClassification,
  mtfTraceOptions,
  prepareMtfFieldLaunch,
} from "./mtf/mtfTracing.js";
import { mtfAxialImagePlane, mtfSequentialRefractivePath } from "./mtf/mtfSupport.js";
import { LINE_NM } from "../chromatic.js";
import { launchSurfaceForFieldDeg } from "../projection.js";
import { computeAnalysisFieldGeometryAtState } from "../state/runtime.js";
import { bulkTransmissionForTrace } from "../trace/bulkAbsorption.js";
import { traceSequential } from "../trace/sequentialTrace.js";
import type { FakeFieldLaunch, FakeMtfOptions, FakeMtfSupport } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

const BEAM_GRID_CELLS = 64;
const MAPPING_STEP_DEG = 0.01;

export function computeVignettingCurve(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const L = state.lens.runtime;
  const currentEPSD = request.aperture.entrancePupilSemiDiameterMm;
  const currentPhysStopSD = request.aperture.stopSemiDiameterMm;
  if (currentEPSD <= 0) return [];
  if (!mtfSequentialRefractivePath(state) || !mtfAxialImagePlane(state)) return [];
  const geometry = (request.fieldGeometry ?? computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, L)) as {
    halfFieldDeg: number;
  };
  const halfFieldDeg = geometry.halfFieldDeg;
  if (!(halfFieldDeg > 0) || !isFinite(halfFieldDeg)) return [];
  const fieldSamples = Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
  const options = {
    method: "geometric",
    spectrum: "reference",
    focus: "design",
    pupilSemiDiameterMm: currentEPSD,
    stopSemiDiameterMm: currentPhysStopSD,
  } as FakeMtfOptions;
  const support: FakeMtfSupport = {
    available: true,
    reason: null,
    message: "",
    referenceWavelengthNm: LINE_NM.d,
    useResolvedReference: false,
    spectralLines: [{ wavelengthNm: LINE_NM.d, weight: 1 }],
    limitations: [],
  };
  const traceOptions = mtfTraceOptions(state, options, support, support.spectralLines[0]);
  const traceRay = (ray: { origin: [number, number, number]; direction: [number, number, number] }) =>
    traceSequential(state, ray, traceOptions);
  const mirror = mtfMirrorSymmetric(state);
  const config = state.lens.projection.config;
  const launchAt = (deg: number): FakeFieldLaunch | null =>
    launchSurfaceForFieldDeg(deg, config) === "object-plane" ? prepareMtfFieldLaunch(state, options, support, deg) : null;
  const fieldAngles = Array.from({ length: fieldSamples }, (_, i) => uniformFieldFraction(i, fieldSamples) * halfFieldDeg);
  if (fieldAngles.some((deg) => launchSurfaceForFieldDeg(deg, config) !== "object-plane")) return [];
  const litChiefHeight = (launch: FakeFieldLaunch | null): number | null => {
    if (!launch) return null;
    const trace = traceRay(mtfLaunchRay(launch, 0, 0));
    return mtfTraceClassification(trace, state, currentPhysStopSD) === "valid" ? (mtfImagePoint(state, trace)?.y ?? null) : null;
  };
  const unchecked = { ...traceOptions, checkSemiDiameter: false, stopOnClip: false };
  const uncheckedHeight = (launch: FakeFieldLaunch | null): number | null =>
    launch ? (mtfImagePoint(state, traceSequential(state, mtfLaunchRay(launch, 0, 0), unchecked))?.y ?? null) : null;
  const chiefMapping = (
    fieldAngleDeg: number,
    launch: FakeFieldLaunch,
    litChiefHeight: (launch: FakeFieldLaunch | null) => number | null,
  ): number | null => {
    const height = litChiefHeight(launch);
    if (height === null) return null;
    const [low, high] = [fieldAngleDeg - MAPPING_STEP_DEG, fieldAngleDeg + MAPPING_STEP_DEG].map((deg) =>
      litChiefHeight(launchAt(deg)),
    );
    const rise =
      low !== null && high !== null ? (high - low) / 2 : high !== null ? high - height : low !== null ? height - low : null;
    if (rise === null) return null;
    const slope = Math.abs(rise / ((MAPPING_STEP_DEG * Math.PI) / 180));
    return slope * (fieldAngleDeg === 0 ? slope : Math.abs(height) / Math.sin((fieldAngleDeg * Math.PI) / 180));
  };
  const samples: { fieldAngleDeg: number; area: number; illumination: number }[] = [];
  for (const fieldAngleDeg of fieldAngles) {
    const launch = launchAt(fieldAngleDeg);
    const footprint = launch && findMtfFieldFootprint(state, options, support, launch);
    let beam: { area: number; flux: number } | null = null;
    if (launch && footprint) {
      const grid = mtfLaunchGrid(footprint, BEAM_GRID_CELLS);
      let [cells, transmitted] = [0, 0];
      for (let row = 0; row < grid.rows; row++) {
        for (let column = mirror ? grid.columns / 2 : 0; column < grid.columns; column++) {
          const trace = traceRay(mtfLaunchRay(launch, grid.x0 + (column + 0.5) * grid.step, grid.y0 + (row + 0.5) * grid.step));
          if (mtfTraceClassification(trace, state, currentPhysStopSD) !== "valid") continue;
          const w = bulkTransmissionForTrace(state.lens, trace.hits);
          cells += mirror ? 2 : 1;
          transmitted += mirror ? 2 * w : w;
        }
      }
      const cellArea = grid.step * grid.step;
      beam = cells === 0 ? { area: 0, flux: 0 } : { area: cells * cellArea, flux: transmitted * cellArea };
    }
    if (!launch || !beam || !(beam.flux > 0)) {
      samples.push({ fieldAngleDeg, area: beam?.area ?? 0, illumination: 0 });
      continue;
    }
    const imageArea =
      chiefMapping(fieldAngleDeg, launch, litChiefHeight) ?? chiefMapping(fieldAngleDeg, launch, uncheckedHeight);
    if (!(imageArea !== null && imageArea > 0)) return [];
    samples.push({ fieldAngleDeg, area: beam.area, illumination: (beam.flux * launch.direction[2]) / imageArea });
  }
  const axis = samples[0];
  if (!(axis.area > 0) || !(axis.illumination > 0)) return [];
  return samples.map(({ fieldAngleDeg, area, illumination }) => ({
    fieldAngleDeg,
    geometricTransmission: area / axis.area,
    relativeIllumination: illumination / axis.illumination,
  }));
}
