// The fake's MTF launch and bundles, under LV's names: a chief ray per field; for a field it "aims", a lattice of cells
// evenly spaced over the stop's disc (LV #936), each the fake's ray toward it; for a field it launches from a "bounding
// sphere", a box around the chief ray on a launch plane and a lattice of square cells over it. Its geometry is its own
// and much cruder than LV's: the chief ray is the straight line to the first vertex, a cell's ray starts on the launch
// plane at the cell's fractions of the pupil radius, and the box is a fixed multiple of the seed.
import { LINE_NM } from "../../chromatic.js";
import { traceSequential } from "../../trace/sequentialTrace.js";
import type {
  FakeFieldLaunch,
  FakeFootprint,
  FakeMtfOptions,
  FakeMtfSupport,
  FakeState,
  FakeTraceOptions,
  FakeTraceResult,
  Vec3,
} from "../../types.js";
import { mtfFiniteObjectPoint } from "./mtfConjugates.js";
import { bulkTransmissionForTrace } from "../../trace/bulkAbsorption.js";

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

// The fake's glasses absorb where a lens says so (`bulkTransmissionForTrace`).
export function transmission(state: FakeState, trace: FakeTraceResult): number {
  return bulkTransmissionForTrace(state.lens, trace.hits);
}

// The fake's surfaces are all of revolution: a meridional field's beam is its own mirror image, as LV's is.
export function mtfMirrorSymmetric(state: FakeState): boolean {
  return state.surfaces.every((surface) => ["flat", "spherical", "aspheric"].includes(surface.profile.kind));
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

// The fake's classification lives where LV's does since #927 (`trace/rayClassification.ts`).
import { traceRayClassification } from "../../trace/rayClassification.js";

export function mtfTraceOptions(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
  line: { wavelengthNm: number; weight: number },
  opticalPath = false,
): FakeTraceOptions {
  return traceOptions(state, options, support, line.wavelengthNm, opticalPath);
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
  if (!(Math.abs(fieldAngleDeg) <= (state.lens.runtime.source.field?.chiefLimitDeg ?? 60))) return null;
  const uField = -Math.tan((fieldAngleDeg * Math.PI) / 180);
  const objectPoint = support.conjugate ? mtfFiniteObjectPoint(state, support.conjugate, fieldAngleDeg) : undefined;
  if (objectPoint === null) return null;
  const norm = Math.hypot(1, uField);
  const first = state.surfaces[0];
  const firstZ = Math.min(0, first.profile.sag(first.sd));
  const leadZ = Math.max(firstZ - 10, objectPoint ? (objectPoint[2] + firstZ) / 2 : -Infinity);
  // The fake's chief ray is the straight line to the first vertex.
  const centerY = objectPoint ? (objectPoint[1] * leadZ) / objectPoint[2] : leadZ * uField;
  // Beyond `vectorBeyondDeg` the fake launches from a "bounding sphere", which its aimed launch does not cover.
  const sphere = Math.abs(fieldAngleDeg) > (state.lens.runtime.source.field?.vectorBeyondDeg ?? Infinity);
  const aim = sphere
    ? null
    : objectPoint
      ? { kind: "finite-object" as const, objectPoint, leadZ }
      : { uField, yChief: 0 };
  return { fieldAngleDeg, direction: [0, uField / norm, 1 / norm], objectPoint, leadZ, centerY, aim };
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
  const seed = options.pupilSemiDiameterMm * (state.lens.runtime.source.mtf?.footprintScale ?? 1);
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

/** The cell outcomes the fake marks to find unresolved cells beside the beam, as LV's rule: 0 dark, 1 lit, 2 unresolved. */
function besideBeam(outcome: Uint8Array, weights: Float64Array, columns: number, rows: number) {
  const lit = (row: number, column: number) =>
    row >= 0 && column >= 0 && row < rows && column < columns && outcome[row * columns + column] === 1;
  let count = 0;
  let weight = 0;
  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++)
      if (
        outcome[row * columns + column] === 2 &&
        (lit(row - 1, column) || lit(row + 1, column) || lit(row, column - 1) || lit(row, column + 1))
      ) {
        count++;
        weight += weights[row * columns + column];
      }
  return { count, weight };
}

function flipped(trace: { input: { origin: Vec3; direction: Vec3 }; terminalPoint: Vec3; terminalDirection: Vec3 }) {
  const flip = (v: Vec3): Vec3 => [-v[0], v[1], v[2]];
  return {
    input: { origin: flip(trace.input.origin), direction: flip(trace.input.direction) },
    terminalPoint: flip(trace.terminalPoint),
    terminalDirection: flip(trace.terminalDirection),
  };
}

// The fake's stop lattice: the cells of an n x n grid over the disc whose centre lies in it, as LV's.
export function stopLattice(n: number) {
  const cells: { index: number; row: number; column: number; xFraction: number; yFraction: number; weight: number }[] =
    [];
  for (let row = 0; row < n; row++) {
    const yFraction = (2 * row + 1 - n) / n;
    for (let column = 0; column < n; column++) {
      const xFraction = (2 * column + 1 - n) / n;
      if (xFraction * xFraction + yFraction * yFraction <= 1)
        cells.push({ index: cells.length, row, column, xFraction, yFraction, weight: 0 });
    }
  }
  for (const cell of cells) cell.weight = 1 / cells.length;
  return cells;
}

// The fake "aims" a cell by starting its ray on the launch plane at the cell's fractions of the pupil radius. A lens may
// state the radius of the stop beyond which the fake aims nothing (`mtf.unaimedBeyond`) and beyond which a clear
// aperture ahead of the stop blocks the way (`mtf.blockedBeyond`, at surface 0), as fractions of the stop radius.
export function aimMtfStopLattice(
  state: FakeState,
  options: FakeMtfOptions,
  _support: FakeMtfSupport,
  launch: FakeFieldLaunch,
  gridSize: number,
  _line: { wavelengthNm: number; weight: number },
  _coarse?: unknown,
): unknown {
  if (!launch.aim) return null;
  if (!Number.isInteger(gridSize) || gridSize < 1)
    throw new RangeError(`A stop lattice needs a positive whole number of cells across, not ${String(gridSize)}.`);
  const stated = state.lens.runtime.source.mtf ?? {};
  const pupil = options.pupilSemiDiameterMm;
  const R = options.stopSemiDiameterMm;
  const cells = stopLattice(gridSize);
  const toRay = (index: number, xFraction: number, yFraction: number) => {
    const r = Math.hypot(xFraction, yFraction);
    const base = { index, xFraction, yFraction };
    if (r > (stated.unaimedBeyond ?? Infinity))
      return { ...base, status: "unaimed", reason: "stop-unreachable", origin: null, direction: null };
    const ray = mtfLaunchRay(launch, xFraction * pupil, yFraction * pupil);
    // The fake's blocking ray leaves from far outside the first surface's rim, which clips it there.
    const far = 4 * state.surfaces[0].sd;
    const blocking = mtfLaunchRay(launch, (xFraction / r) * far, (yFraction / r) * far);
    if (r > (stated.blockedBeyond ?? Infinity))
      return { ...base, status: "blocked", ...blocking, blockedAtSurfaceIndex: 0 };
    return { ...base, status: "aimed", reason: null, ...ray };
  };
  const rays = cells.map((cell, i) => toRay(i, cell.xFraction, cell.yFraction));
  const count = (status: string) => rays.filter((ray) => ray.status === status).length;
  return {
    launchSurface: launch.aim && "kind" in launch.aim ? "finite-object" : "object-plane",
    stopSurfaceIndex: state.lens.stop.surfaceIndex,
    stopSemiDiameterMm: R,
    residualToleranceMm: R / 1048576,
    clipSemiDiameterMm: R + R / 1048576,
    chief: toRay(-1, 0, 0),
    rays,
    aimedCount: count("aimed"),
    blockedCount: count("blocked"),
    unaimedCount: count("unaimed"),
    cellsAcross: gridSize,
    cells,
  };
}

type FakeLattice = {
  cellsAcross: number;
  cells: { row: number; column: number; xFraction: number }[];
  rays: { status: string; origin: Vec3 | null; direction: Vec3 | null }[];
  chief: { status: string; origin: Vec3 | null; direction: Vec3 | null };
  stopSemiDiameterMm: number;
  clipSemiDiameterMm: number;
};

// The fake's bundle of an aimed lattice: the +x half traced and mirrored on a lens of revolution, as LV's; every lit
// cell of weight 1 times its transmission; unaimed and failed cells counted, those beside the beam apart.
export function traceMtfLattice(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
  launch: FakeFieldLaunch,
  lattice: FakeLattice,
  line: { wavelengthNm: number; weight: number },
  imagePlaneZ: number = state.imgZ,
  extras: { reference?: { x: number; y: number; weight: number }; opticalPath?: boolean } = {},
): unknown {
  const tracing = {
    ...traceOptions(state, options, support, line.wavelengthNm, extras.opticalPath),
    stopSemiDiameter: lattice.clipSemiDiameterMm,
  };
  const chiefRay = (lattice.chief.status === "aimed" ? lattice.chief : mtfLaunchRay(launch, 0, 0)) as {
    origin: Vec3;
    direction: Vec3;
  };
  const unchecked = traceSequential(state, chiefRay, { ...tracing, checkSemiDiameter: false, stopOnClip: false });
  const chief = mtfImagePoint(state, unchecked, imagePlaneZ) ?? extras.reference;
  if (!chief) return null;
  const n = lattice.cellsAcross;
  const mirror = mtfMirrorSymmetric(state) && n % 2 === 0;
  const outcome = new Uint8Array(n * n);
  const mark = (row: number, column: number, value: number) => {
    outcome[row * n + column] = value;
    if (mirror) outcome[row * n + n - 1 - column] = value;
  };
  const rays: unknown[] = [];
  let [blocked, failed, unaimed, unresolvedWeight] = [0, 0, 0, 0];
  lattice.cells.forEach((cell, i) => {
    if (mirror && cell.xFraction < 0) return;
    const samples = mirror ? 2 : 1;
    const ray = lattice.rays[i];
    if (ray.status === "blocked") {
      blocked += samples;
      return;
    }
    if (ray.status === "unaimed") {
      unaimed += samples;
      unresolvedWeight += samples;
      mark(cell.row, cell.column, 2);
      return;
    }
    const trace = traceSequential(state, ray as { origin: Vec3; direction: Vec3 }, tracing);
    const classification = traceRayClassification(trace, state, lattice.clipSemiDiameterMm);
    if (classification === "blocked") {
      blocked += samples;
      return;
    }
    const point = classification === "valid" ? mtfImagePoint(state, trace, imagePlaneZ) : null;
    if (!point) {
      failed += samples;
      unresolvedWeight += samples;
      mark(cell.row, cell.column, 2);
      return;
    }
    mark(cell.row, cell.column, 1);
    const { input, terminalPoint, terminalDirection, finalMedium, opticalPathLengthMm } = trace;
    const record = { input, terminalPoint, terminalDirection, finalMedium, opticalPathLengthMm };
    rays.push({ ...point, column: cell.column, row: cell.row, trace: record });
    if (mirror)
      rays.push({
        ...point,
        x: -point.x,
        column: n - 1 - cell.column,
        row: cell.row,
        trace: { ...record, ...flipped(record) },
      });
  });
  const beside = besideBeam(outcome, new Float64Array(n * n).fill(1), n, n);
  return {
    sampling: "stop",
    rays,
    blocked,
    failed,
    unaimed,
    unresolvedWeight,
    unresolvedInBeam: beside.count,
    unresolvedInBeamWeight: beside.weight,
    chief,
    chiefClipped: traceRayClassification(traceSequential(state, chiefRay, tracing), state) !== "valid",
    columns: n,
    rows: n,
    mirrored: mirror,
    stepMm: (2 * lattice.stopSemiDiameterMm) / n,
    objectPoint: launch.objectPoint,
    openBorders: { x: false, y0: false, y1: false },
    lattice,
  };
}

export function traceMtfStopBundle(
  state: FakeState,
  options: FakeMtfOptions,
  support: FakeMtfSupport,
  launch: FakeFieldLaunch,
  gridSize: number,
  line: { wavelengthNm: number; weight: number },
  imagePlaneZ: number = state.imgZ,
  extras: { reference?: { x: number; y: number; weight: number }; opticalPath?: boolean; coarse?: unknown } = {},
): unknown {
  const lattice = aimMtfStopLattice(state, options, support, launch, gridSize, line, extras.coarse) as FakeLattice | null;
  return lattice && traceMtfLattice(state, options, support, launch, lattice, line, imagePlaneZ, extras);
}

// The fake's launch-plane bundle traces half the columns and mirrors the rest in x, as LV's does for a lens of
// revolution.
export function traceMtfLaunchPlaneBundle(
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
  const rays: unknown[] = [];
  const openBorders = { x: false, y0: false, y1: false };
  const outcome = new Uint8Array(grid.rows * grid.columns);
  const weights = new Float64Array(grid.rows * grid.columns);
  let blocked = 0;
  let failed = 0;
  let unresolvedWeight = 0;
  for (let row = 0; row < grid.rows; row++) {
    for (let column = grid.columns / 2; column < grid.columns; column++) {
      const x = grid.x0 + (column + 0.5) * grid.step;
      const y = grid.y0 + (row + 0.5) * grid.step;
      const trace = traceSequential(state, mtfLaunchRay(launch, x, y), tracing);
      const launchWeight = source
        ? (chiefDistance / Math.hypot(...trace.input.origin.map((v, i) => v - source[i]))) ** 3
        : 1;
      const classification = traceRayClassification(trace, state, options.stopSemiDiameterMm);
      const point = classification === "valid" ? mtfImagePoint(state, trace, imagePlaneZ) : null;
      const cells = [row * grid.columns + column, row * grid.columns + grid.columns - 1 - column];
      if (classification === "blocked") blocked += 2;
      else if (!point) {
        failed += 2;
        unresolvedWeight += 2 * launchWeight;
        for (const cell of cells) [outcome[cell], weights[cell]] = [2, launchWeight];
      }
      if (!point) continue;
      for (const cell of cells) outcome[cell] = 1;
      point.weight *= launchWeight;
      if (Math.abs(x) > footprint.x1 - footprint.guardMm) openBorders.x = true;
      if (y < footprint.y0 + footprint.guardMm) openBorders.y0 = true;
      if (y > footprint.y1 - footprint.guardMm) openBorders.y1 = true;
      const { input, terminalPoint, terminalDirection, finalMedium, opticalPathLengthMm } = trace;
      const record = { input, terminalPoint, terminalDirection, finalMedium, opticalPathLengthMm };
      rays.push({ ...point, column, row, trace: record });
      rays.push({ ...point, x: -point.x, column: grid.columns - 1 - column, row, trace: { ...record, ...flipped(record) } });
    }
  }
  const beside = besideBeam(outcome, weights, grid.columns, grid.rows);
  return {
    sampling: "launch-plane",
    rays,
    blocked,
    failed,
    unaimed: 0,
    unresolvedWeight,
    unresolvedInBeam: beside.count,
    unresolvedInBeamWeight: beside.weight,
    chief,
    chiefClipped: traceRayClassification(traceSequential(state, chiefRay, tracing), state) !== "valid",
    columns: grid.columns,
    rows: grid.rows,
    mirrored: true,
    stepMm: grid.step,
    objectPoint: source,
    openBorders,
  };
}
