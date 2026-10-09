// The fake's MTF launch and bundle, under LV's names: a chief ray per field, a box around it on a launch plane, a
// lattice of square cells over the box, and the rays of the cells. Its geometry is its own and much cruder than
// LV's: the chief ray is the straight line to the first vertex, and the box is a fixed multiple of the seed.
import { LINE_NM } from "../spectralLines.js";
import { outside, traceSequential } from "../trace/sequentialTrace.js";
import type {
  FakeFieldLaunch,
  FakeFootprint,
  FakeMtfOptions,
  FakeMtfSupport,
  FakeState,
  FakeTraceOptions,
  FakeTraceResult,
  Vec3,
} from "../types.js";
import { mtfFiniteObjectPoint } from "./mtfConjugates.js";

// A dispersion that is nothing like a glass's and easy to check: 1e-5 of index per nm from the d line, air at 1.
export function mtfIndexResolver(
  _state: FakeState,
  support: FakeMtfSupport,
  wavelengthNm: number,
): ((surfaceIndex: number, nd: number) => number) | undefined {
  if (!support.useResolvedReference) return undefined;
  return (_surfaceIndex, nd) => (nd === 1 ? 1 : nd + (LINE_NM.d - wavelengthNm) * 1e-5);
}

function traceOptions(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
  wavelengthNm: number,
  opticalPath = false,
): FakeTraceOptions {
  return {
    checkSemiDiameter: true,
    stopSemiDiameter: options.stopSemiDiameterMm,
    stopOnClip: true,
    directionNormalized: true,
    wavelengthNm,
    recordOpticalPath: opticalPath,
    indexAtSurface: mtfIndexResolver(state, support, wavelengthNm),
  };
}

// The fake's glasses absorb where a lens says so: exp(-coefficient x path) over every stretch inside an element.
function transmission(state: FakeState, trace: FakeTraceResult): number {
  const coefficient = state.lens.runtime.data.absorptionPerMm ?? 0;
  if (coefficient === 0) return 1;
  let inGlass = 0;
  for (let i = 0; i + 1 < trace.hits.length; i++) {
    if (state.surfaces[trace.hits[i].surfaceIndex].nd === 1) continue;
    const [from, to] = [trace.hits[i].point, trace.hits[i + 1].point];
    inGlass += Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  }
  return Math.exp(-coefficient * inGlass);
}

export function mtfImagePoint(
  state: FakeState,
  trace: FakeTraceResult,
  imagePlaneZ: number = state.imgZ,
): { x: number; y: number; weight: number } | null {
  if (trace.status !== "ok" || Math.abs(trace.terminalDirection[2]) < 1e-12) return null;
  const distance = (imagePlaneZ - trace.terminalPoint[2]) / trace.terminalDirection[2];
  if (!(distance >= -1e-9)) return null;
  const transfer = Math.max(0, distance);
  return {
    x: trace.terminalPoint[0] + transfer * trace.terminalDirection[0],
    y: trace.terminalPoint[1] + transfer * trace.terminalDirection[1],
    weight: transmission(state, trace),
  };
}

// A ray that found no surface is blocked when it passes the surface's vertex plane outside its aperture, which the
// fake takes for proof of a miss; anything else it could not find is a failure of its own.
export function mtfTraceClassification(
  trace: FakeTraceResult,
  state?: FakeState,
  stopRadius?: number,
): "valid" | "blocked" | "failed" {
  if (trace.status === "ok") return "valid";
  if (trace.failureReason === "totalInternalReflection" || (trace.status === "clipped" && !trace.failureReason)) {
    return "blocked";
  }
  const surface = state?.surfaces[trace.terminalSurfaceIndex + 1];
  if (!state || !surface || trace.failureReason !== "noBracket") return "failed";
  const [origin, direction] = [trace.terminalPoint, trace.terminalDirection];
  const t = (surface.z - origin[2]) / direction[2];
  const radius = Math.hypot(origin[0] + t * direction[0], origin[1] + t * direction[1]);
  return outside(state, surface, radius, stopRadius) ? "blocked" : "failed";
}

export function mtfLaunchRay(launch: FakeFieldLaunch, x: number, y: number): { origin: Vec3; direction: Vec3 } {
  const origin: Vec3 = [x, launch.centerY + y, launch.leadZ];
  const source = launch.objectPoint;
  if (!source) return { origin, direction: launch.direction };
  const [dx, dy, dz] = [origin[0] - source[0], origin[1] - source[1], origin[2] - source[2]];
  const length = Math.hypot(dx, dy, dz);
  return { origin, direction: [dx / length, dy / length, dz / length] };
}

export function prepareMtfFieldLaunch(
  state: FakeState,
  _options: FakeMtfOptions,
  support: FakeMtfSupport,
  fieldAngleDeg: number,
): FakeFieldLaunch | null {
  // Beyond this angle the fake "finds no chief ray".
  if (!(Math.abs(fieldAngleDeg) <= (state.lens.runtime.data.field?.chiefLimitDeg ?? 60))) return null;
  const uField = -Math.tan((fieldAngleDeg * Math.PI) / 180);
  const objectPoint = support.conjugate ? mtfFiniteObjectPoint(state, support.conjugate, fieldAngleDeg) : undefined;
  if (objectPoint === null) return null;
  const norm = Math.hypot(1, uField);
  const first = state.surfaces[0];
  const firstZ = Math.min(0, first.profile.sag(first.sd));
  const leadZ = Math.max(firstZ - 10, objectPoint ? (objectPoint[2] + firstZ) / 2 : -Infinity);
  // The fake's chief ray is the straight line to the first vertex.
  const centerY = objectPoint ? (objectPoint[1] * leadZ) / objectPoint[2] : leadZ * uField;
  return { fieldAngleDeg, direction: [0, uField / norm, 1 / norm], objectPoint, leadZ, centerY };
}

export function findMtfFieldFootprint(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
  launch: FakeFieldLaunch,
): FakeFootprint | null {
  // A field whose chief ray is stopped has no beam, in the fake.
  const reference = support.spectralLines[0].wavelengthNm;
  const chief = traceSequential(state, mtfLaunchRay(launch, 0, 0), traceOptions(state, options, support, reference));
  if (chief.status !== "ok") return null;
  // A lens may state that the fake's scan finds only a part of the beam: the box is then too small, and the bundle
  // says which of its sides carried flux.
  const seed = options.pupilSemiDiameterMm * (state.lens.runtime.data.mtf?.footprintScale ?? 1);
  const half = 1.25 * seed;
  return { x0: -half, x1: half, y0: -half, y1: half, beamWidthMm: 2 * seed, beamHeightMm: 2 * seed, guardMm: seed / 16 };
}

export function mtfLaunchGrid(
  footprint: FakeFootprint,
  gridSize: number,
): { columns: number; rows: number; step: number; x0: number; y0: number } {
  const step = Math.max(footprint.beamWidthMm, footprint.beamHeightMm) / gridSize;
  const columns = 2 * Math.max(1, Math.ceil(Math.max(-footprint.x0, footprint.x1) / step - 1e-9));
  const rows = Math.max(1, Math.ceil((footprint.y1 - footprint.y0) / step - 1e-9));
  return { columns, rows, step, x0: (-columns * step) / 2, y0: (footprint.y0 + footprint.y1) / 2 - (rows * step) / 2 };
}

// The fake's bundle traces half the columns and mirrors the rest in x, as LV's does for a lens of revolution.
export function traceMtfBundle(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
  launch: FakeFieldLaunch,
  footprint: FakeFootprint,
  gridSize: number,
  line: { wavelengthNm: number; weight: number },
  imagePlaneZ: number = state.imgZ,
  extras: { reference?: { x: number; y: number; weight: number }; opticalPath?: boolean } = {},
): unknown {
  const tracing = traceOptions(state, options, support, line.wavelengthNm, extras.opticalPath);
  const chiefRay = mtfLaunchRay(launch, 0, 0);
  const unchecked = traceSequential(state, chiefRay, { ...tracing, checkSemiDiameter: false, stopOnClip: false });
  const chief = mtfImagePoint(state, unchecked, imagePlaneZ) ?? extras.reference;
  if (!chief) return null;
  const grid = mtfLaunchGrid(footprint, gridSize);
  const source = launch.objectPoint;
  const chiefDistance = source ? Math.hypot(...chiefRay.origin.map((v, i) => v - source[i])) : 0;
  const flip = (v: Vec3): Vec3 => [-v[0], v[1], v[2]];
  const rays: unknown[] = [];
  const openBorders = { x: false, y0: false, y1: false };
  let blocked = 0;
  let failed = 0;
  let failedWeight = 0;
  for (let row = 0; row < grid.rows; row++) {
    for (let column = grid.columns / 2; column < grid.columns; column++) {
      const x = grid.x0 + (column + 0.5) * grid.step;
      const y = grid.y0 + (row + 0.5) * grid.step;
      const trace = traceSequential(state, mtfLaunchRay(launch, x, y), tracing);
      const launchWeight = source
        ? (chiefDistance / Math.hypot(...trace.input.origin.map((v, i) => v - source[i]))) ** 3
        : 1;
      const outcome = mtfTraceClassification(trace, state, options.stopSemiDiameterMm);
      const point = outcome === "valid" ? mtfImagePoint(state, trace, imagePlaneZ) : null;
      if (outcome === "blocked") blocked += 2;
      else if (!point) {
        failed += 2;
        failedWeight += 2 * launchWeight;
      }
      if (!point) continue;
      point.weight *= launchWeight;
      if (Math.abs(x) > footprint.x1 - footprint.guardMm) openBorders.x = true;
      if (y < footprint.y0 + footprint.guardMm) openBorders.y0 = true;
      if (y > footprint.y1 - footprint.guardMm) openBorders.y1 = true;
      const { input, terminalPoint, terminalDirection, finalMedium, opticalPathLengthMm } = trace;
      rays.push({ ...point, column, row, trace: { input, terminalPoint, terminalDirection, finalMedium, opticalPathLengthMm } });
      rays.push({
        ...point,
        x: -point.x,
        column: grid.columns - 1 - column,
        row,
        trace: {
          input: { origin: flip(input.origin), direction: flip(input.direction) },
          terminalPoint: flip(terminalPoint),
          terminalDirection: flip(terminalDirection),
          finalMedium,
          opticalPathLengthMm,
        },
      });
    }
  }
  return {
    rays,
    blocked,
    failed,
    failedWeight,
    chief,
    chiefClipped: mtfTraceClassification(traceSequential(state, chiefRay, tracing), state) !== "valid",
    columns: grid.columns,
    rows: grid.rows,
    mirrored: true,
    launchStepMm: grid.step,
    objectPoint: source,
    openBorders,
  };
}
