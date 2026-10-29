// The fake's vignetting tab, under LV's names. Its tracer, its lenses and its aimed launch are the fake's own; what the
// tab does with them follows LV's rules since LV #931 (`computeVignettingCurve`, `computeVignettingField`): each field's
// stop lattice of `BEAM_GRID_CELLS` cells across the stop, aimed through the shared launch (`prepareAimedStopLattice`)
// and traced as the launch's own trace, one half of it mirrored where every surface is of revolution; the unvignetted
// fraction is the share of the samples, neither unaimed nor failed, that reach the image; the relative illumination a
// sum of n'^2 times bulk transmission times each lit cell's area in direction cosines over the axis's. The fake's cosines
// are each ray's own exit direction (LV refers them to the image point through a reference sphere): its own rule. No
// curve of a state outside the MTF's beam model, or of one with a field launched from a bounding sphere.
import { uniformFieldFraction } from "./sampling.js";
import { mtfMirrorSymmetric, stopLattice } from "./mtf/mtfTracing.js";
import { traceRayClassification } from "../trace/rayClassification.js";
import { mtfAxialImagePlane, mtfSequentialRefractivePath } from "./mtf/mtfSupport.js";
import { launchSurfaceForFieldDeg } from "../projection.js";
import { computeAnalysisFieldGeometryAtState } from "../state/runtime.js";
import { bulkTransmissionForTrace } from "../trace/bulkAbsorption.js";
import { computeOffAxisFieldGeometry } from "./spots.js";
import { prepareAimedPupilTrace, prepareAimedStopLattice } from "./pupils/aimedPupil.js";
import type { Vec3 } from "../types.js";
import type { FakeAnalysisRequest } from "./request.js";

export const BEAM_GRID_CELLS = 64;
export const MIN_BEAM_GRID_CELLS = 4;
const MAX_UNAIMED_SHARE = 0.01;

type Cell = ReturnType<typeof stopLattice>[number];
interface CellResult {
  cell: Cell;
  ray: { status: string; origin: Vec3 | null; direction: Vec3 | null };
  transmitted: boolean;
  failed: boolean;
  bulkTransmission: number;
  exitDirectionCosines: readonly [number, number] | null;
  referredDirectionCosines: readonly [number, number] | null;
  imageIndex: number | null;
  cosineArea: number | null;
}

function analysisFields(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  return (request.fieldGeometry ?? computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, state.lens.runtime)) as {
    halfFieldDeg: number;
  };
}

/** The sum of n'^2 T |det J| cellArea over the lit cells, J by differences of lit neighbours; null for an isolated cell. */
function rimmer(cells: CellResult[], n: number): number | null {
  const at = new Map<string, CellResult>();
  for (const result of cells) at.set(`${result.cell.row} ${result.cell.column}`, result);
  const lit = (row: number, column: number) => {
    const result = at.get(`${row} ${column}`);
    return result && result.transmitted ? result.exitDirectionCosines! : null;
  };
  const h = 2 / n;
  const along = (row: number, column: number, dRow: number, dColumn: number): [number, number] | null => {
    const here = lit(row, column)!;
    const before = lit(row - dRow, column - dColumn);
    const after = lit(row + dRow, column + dColumn);
    if (before && after) return [(after[0] - before[0]) / (2 * h), (after[1] - before[1]) / (2 * h)];
    if (after) return [(after[0] - here[0]) / h, (after[1] - here[1]) / h];
    if (before) return [(here[0] - before[0]) / h, (here[1] - before[1]) / h];
    return null;
  };
  let sum = 0;
  for (const result of cells) {
    if (!result.transmitted) continue;
    const dx = along(result.cell.row, result.cell.column, 0, 1);
    const dy = along(result.cell.row, result.cell.column, 1, 0);
    if (!dx || !dy) return null;
    result.cosineArea = Math.abs(dx[0] * dy[1] - dx[1] * dy[0]) * h * h;
    sum += result.imageIndex! ** 2 * result.bulkTransmission * result.cosineArea;
  }
  return sum;
}

export function computeVignettingField(
  request: FakeAnalysisRequest,
  fieldFraction: number,
  cellsAcross: number = BEAM_GRID_CELLS,
  stateGeometry?: unknown,
) {
  const state = request.preparedGeometry;
  const fields = (stateGeometry as { halfFieldDeg: number } | undefined) ?? analysisFields(request);
  const n = Math.max(Math.round(cellsAcross), MIN_BEAM_GRID_CELLS);
  const lattice = stopLattice(n);
  const geometry = computeOffAxisFieldGeometry(state, fieldFraction, fields);
  const base = {
    fieldFraction,
    fieldAngleDeg: fieldFraction * fields.halfFieldDeg,
    cellsAcross: n,
    cellArea: (2 / n) ** 2,
    sampleCount: lattice.length,
  };
  const launch = geometry && !("kind" in geometry) ? prepareAimedStopLattice(request, n, geometry) : null;
  const none = (reason: string) => ({
    ...base,
    mirrored: false,
    imagePoint: null,
    transmittedCount: 0,
    blockedCount: 0,
    unaimedCount: 0,
    failedCount: 0,
    unvignettedFraction: null,
    rimmerSum: null,
    unavailableReason: reason,
    relativeIlluminationReason: reason,
    cells: [] as CellResult[],
  });
  if (!launch) return none("no-field-launch");
  const mirrored = mtfMirrorSymmetric(state);
  const tracer = prepareAimedPupilTrace(state, launch);
  const results: CellResult[] = new Array(lattice.length);
  for (const cell of lattice) {
    if (mirrored && cell.xFraction < 0) continue;
    const ray = launch.rays[cell.index] as CellResult["ray"];
    const dark: CellResult = {
      cell,
      ray,
      transmitted: false,
      failed: false,
      bulkTransmission: 0,
      exitDirectionCosines: null,
      referredDirectionCosines: null,
      imageIndex: null,
      cosineArea: null,
    };
    if (ray.status !== "aimed") {
      results[cell.index] = dark;
      continue;
    }
    const trace = tracer.engine(ray as { origin: Vec3; direction: Vec3 });
    const outcome = traceRayClassification(trace, state, launch.clipSemiDiameterMm);
    if (outcome === "blocked") results[cell.index] = dark;
    else if (outcome === "failed" || !(trace.terminalDirection[2] > 0)) results[cell.index] = { ...dark, failed: true };
    else {
      const cosines = [trace.terminalDirection[0], trace.terminalDirection[1]] as const;
      results[cell.index] = {
        ...dark,
        transmitted: true,
        bulkTransmission: bulkTransmissionForTrace(state.lens, trace.hits),
        exitDirectionCosines: cosines,
        referredDirectionCosines: cosines,
        imageIndex: trace.finalMedium,
      };
    }
  }
  if (mirrored) {
    const index = new Map(lattice.map((cell) => [`${cell.row} ${cell.column}`, cell.index]));
    for (const cell of lattice) {
      if (cell.xFraction >= 0) continue;
      const partner = results[index.get(`${cell.row} ${n - 1 - cell.column}`)!];
      const mirror = (c: readonly [number, number] | null) => c && ([-c[0], c[1]] as const);
      results[cell.index] = {
        ...partner,
        cell,
        ray: launch.rays[cell.index] as CellResult["ray"],
        exitDirectionCosines: mirror(partner.exitDirectionCosines),
        referredDirectionCosines: mirror(partner.referredDirectionCosines),
      };
    }
  }
  const failedCount = results.filter((result) => result.failed).length;
  const transmittedCount = results.filter((result) => result.transmitted).length;
  const counts = {
    ...base,
    mirrored,
    imagePoint: null,
    transmittedCount,
    blockedCount: launch.blockedCount,
    unaimedCount: launch.unaimedCount,
    failedCount,
  };
  if (launch.unaimedCount + failedCount > MAX_UNAIMED_SHARE * lattice.length) {
    const reason = launch.unaimedCount >= failedCount ? "too-many-unaimed" : "too-many-failed";
    return {
      ...counts,
      unvignettedFraction: null,
      rimmerSum: null,
      unavailableReason: reason,
      relativeIlluminationReason: reason,
      cells: results,
    };
  }
  const sum = rimmer(results, n);
  return {
    ...counts,
    unvignettedFraction: transmittedCount / (lattice.length - launch.unaimedCount - failedCount),
    rimmerSum: sum,
    unavailableReason: null,
    relativeIlluminationReason: sum === null ? "isolated-cell" : null,
    cells: results,
  };
}

export function computeVignettingCurve(request: FakeAnalysisRequest) {
  const state = request.preparedGeometry;
  const cellsAcross = BEAM_GRID_CELLS;
  const none = (reason: string) => ({ available: false, reason, cellsAcross, samples: [] });
  if (!(request.aperture.stopSemiDiameterMm > 0)) return none("invalid-state");
  if (!mtfSequentialRefractivePath(state)) return none("unsupported-path");
  if (!mtfAxialImagePlane(state)) return none("tilted-image-plane");
  const geometry = analysisFields(request);
  const halfFieldDeg = geometry.halfFieldDeg;
  if (!(halfFieldDeg > 0) || !isFinite(halfFieldDeg)) return none("invalid-state");
  const fieldCount = Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
  const fractions = Array.from({ length: fieldCount }, (_, i) => uniformFieldFraction(i, fieldCount));
  const config = state.lens.projection.config;
  if (fractions.some((fraction) => launchSurfaceForFieldDeg(fraction * halfFieldDeg, config) !== "object-plane"))
    return none("bounding-sphere-field");
  const fields = fractions.map((fraction) => computeVignettingField(request, fraction, cellsAcross, geometry));
  const axis = fields[0];
  const axisSum = axis.relativeIlluminationReason === null ? axis.rimmerSum : null;
  const samples = fields.map((field) => {
    let relativeIllumination: number | null = null;
    let relativeIlluminationReason = field.relativeIlluminationReason;
    if (relativeIlluminationReason === null) {
      if (axisSum !== null && axisSum > 0 && field.rimmerSum !== null) relativeIllumination = field.rimmerSum / axisSum;
      else relativeIlluminationReason = "axis-unavailable";
    }
    return {
      fieldAngleDeg: field.fieldAngleDeg,
      fieldFraction: field.fieldFraction,
      unvignettedFraction: field.unvignettedFraction,
      relativeIllumination,
      sampleCount: field.sampleCount,
      transmittedCount: field.transmittedCount,
      blockedCount: field.blockedCount,
      unaimedCount: field.unaimedCount,
      failedCount: field.failedCount,
      unavailableReason: field.unavailableReason,
      relativeIlluminationReason,
    };
  });
  return { available: true, reason: null, cellsAcross, samples };
}
