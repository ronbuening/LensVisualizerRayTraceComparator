// The fake's shared aimed launch, under LV's names (LV #927): every tab of rays launches its pupil samples through it.
// The fake "aims" a sample by starting its ray on the first vertex plane at the sample's fractions of the request's
// pupil radius, times a factor of the spectrum's own (1 at the authored indices), about the chief ray's height, a sample
// off the meridian lifted by its x fraction squared over 1024 of the radius: its rule, deliberately not LV's Newton solve; the launch of the ray (where it starts, along which direction) is LV's skew
// launch, so that rays made by the comparator give the fake's tab numbers back to the bit. A lens may state the radius
// beyond which the fake aims nothing (`aim.unaimedBeyond`) and beyond which a clear aperture ahead of the stop blocks
// the way (`aim.blockedBeyond`, at surface 0), as fractions of the stop radius. The full trace checks the stop at a clip
// radius a little beyond it, as LV's does.
import { directionFromSkewSlope } from "../../math/vector.js";
import { traceSequential } from "../../trace/sequentialTrace.js";
import { projectCoordinateToZ } from "../../trace/utils.js";
import { bulkTransmissionForTrace } from "../../trace/bulkAbsorption.js";
import { fakeChannelIndex } from "../axial.js";
import { stopLattice } from "../mtf/mtfTracing.js";
import type { FakeState, Vec3 } from "../../types.js";
import type { FakeAnalysisRequest } from "../request.js";

/** The factor of the pupil radius a spectrum's samples start at: binary fractions, so every launch is exact. */
const SPECTRUM_SCALE: Readonly<Record<string, number>> = { R: 1 + 1 / 1024, G: 1, B: 1 - 1 / 1024, V: 1 - 1 / 512 };

type Sample = { readonly xFraction: number; readonly yFraction: number; readonly weight?: number | null };

/** What the fake states of a field's aim: the scalar geometry of its tabs, or of the axis. */
type Geometry = { readonly uField?: number; readonly yChief?: number; readonly kind?: string };

function aimOf(state: FakeState) {
  return (state.lens.runtime.source as { aim?: { unaimedBeyond?: number; blockedBeyond?: number } }).aim ?? {};
}

function launchFor(
  request: FakeAnalysisRequest,
  samples: readonly Sample[],
  geometry: Geometry,
  spectrum: string | undefined,
  cells?: unknown,
) {
  if ("kind" in geometry && geometry.kind !== undefined) return null;
  const state = request.preparedGeometry;
  const R = request.aperture.stopSemiDiameterMm;
  if (!(R > 0)) return null;
  const pupil = request.aperture.entrancePupilSemiDiameterMm * (SPECTRUM_SCALE[spectrum ?? "G"] ?? 1);
  const uField = geometry.uField ?? 0;
  const yChief = geometry.yChief ?? 0;
  const lead = state.lens.constants.rayLead ?? 0;
  const direction = directionFromSkewSlope(0, uField) ?? ([0, 0, 1] as Vec3);
  const ray = (a: number, b: number) => ({
    origin: [a - 0 * lead, b - uField * lead, (state.z[0] ?? 0) - lead] as Vec3,
    direction,
  });
  const stated = aimOf(state);
  const toRay = (index: number, xFraction: number, yFraction: number, weight: number) => {
    const r = Math.hypot(xFraction, yFraction);
    const base = { index, xFraction, yFraction, weight };
    if (r > (stated.unaimedBeyond ?? Infinity))
      return { ...base, status: "unaimed", reason: "stop-unreachable", origin: null, direction: null };
    if (r > (stated.blockedBeyond ?? Infinity)) {
      const far = 4 * state.surfaces[0].sd;
      return {
        ...base,
        status: "blocked",
        reason: null,
        ...ray((xFraction / r) * far, yChief + (yFraction / r) * far),
        blockedAtSurfaceIndex: 0,
      };
    }
    // The fake's "pupil aberration": a sample off the meridian starts a little above the chief ray's height, as an aimed
    // sagittal ray does in LV; the same for a sample and its mirror image.
    const lift = (xFraction * xFraction * pupil) / 1024;
    return { ...base, status: "aimed", reason: null, ...ray(xFraction * pupil, yChief + yFraction * pupil + lift) };
  };
  const defaultWeight = samples.length > 0 ? 1 / samples.length : 1;
  const rays = samples.map((sample, index) =>
    toRay(index, sample.xFraction, sample.yFraction, sample.weight ?? defaultWeight),
  );
  const count = (status: string) => rays.filter((each) => each.status === status).length;
  return {
    launchSurface: "object-plane",
    stopSurfaceIndex: state.lens.stop.surfaceIndex,
    stopSemiDiameterMm: R,
    residualToleranceMm: R / 1048576,
    clipSemiDiameterMm: R + R / 1048576,
    chief: toRay(-1, 0, 0, 0),
    rays,
    aimedCount: count("aimed"),
    blockedCount: count("blocked"),
    unaimedCount: count("unaimed"),
    ...(cells === undefined ? {} : (cells as object)),
  };
}

export function prepareAimedPupilLaunch(
  request: FakeAnalysisRequest,
  samples: readonly Sample[],
  geometry: Geometry,
  spectrum?: string,
) {
  return launchFor(request, samples, geometry, spectrum);
}

export function prepareAimedStopLattice(
  request: FakeAnalysisRequest,
  cellsAcross: number,
  geometry: Geometry,
  spectrum?: string,
) {
  if (!Number.isInteger(cellsAcross) || cellsAcross < 1)
    throw new RangeError(`A stop lattice needs a positive whole number of cells across, not ${String(cellsAcross)}.`);
  const cells = stopLattice(cellsAcross);
  return launchFor(request, cells, geometry, spectrum, { cellsAcross, cells });
}

/** The fake's full trace of an aimed launch's rays: every aperture checked, the stop at the launch's clip radius. */
export function prepareAimedPupilTrace(
  state: FakeState,
  launch: { clipSemiDiameterMm: number },
  spectrum?: string,
) {
  const options = {
    checkSemiDiameter: true,
    stopSemiDiameter: launch.clipSemiDiameterMm,
    stopOnClip: true,
    directionNormalized: true,
    ...(spectrum === undefined ? {} : { indexAtSurface: (_index: number, nd: number) => fakeChannelIndex(nd, spectrum) }),
  };
  const engine = (ray: { origin: Vec3; direction: Vec3 }) => traceSequential(state, ray, options);
  const last = state.surfaces.length - 1;
  return {
    engine,
    skew(ray: { origin: Vec3; direction: Vec3 }) {
      const trace = engine(ray);
      const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
      const z = state.z[Math.max(0, trace.terminalSurfaceIndex)];
      return {
        x: projectCoordinateToZ(point[0], point[2], toward[0], toward[2], z),
        y: projectCoordinateToZ(point[1], point[2], toward[1], toward[2], z),
        ux: toward[0] / toward[2],
        uy: toward[1] / toward[2],
        clipped: trace.status !== "ok",
        transmission: bulkTransmissionForTrace(state.lens, trace.hits),
      };
    },
    meridional(ray: { origin: Vec3; direction: Vec3 }) {
      const trace = engine(ray);
      const [point, toward] = [trace.terminalPoint, trace.terminalDirection];
      return {
        pts: [],
        clipped: trace.status !== "ok",
        y: projectCoordinateToZ(point[1], point[2], toward[1], toward[2], state.z[last]),
        u: toward[1] * (1 / toward[2]),
        reachedImagePlane: false,
      };
    },
  };
}
