// Which fields and lines of LensVisualizer's vignetting tab have rays that a `rays.trace` request can state, decided
// once for both sides of rungs R11a and R11b: the case source makes its vignetting sets and its `vignetting.native`
// ask of the fields this module admits (vignettingRaySets.ts), and `lv` answers the ask with the tab's samples of the
// same fields (vignetting.ts), so that no engine is asked a field `lv` cannot answer and `lv` never refuses its own case
// source's ask.
//
// Since LensVisualizer #931 (`4092f6a25`) the tab is OpticStudio's two field analyses on one lattice on the real stop a
// field (`computeVignettingCurve`, `computeVignettingField`): `BEAM_GRID_CELLS` cells across the stop's diameter, the
// cells whose centre lies in the unit disc (`stopLattice`), aimed through the shared aimed launch (since #936 the MTF's
// own stop lattice, `prepareAimedStopLattice`, at the authored indices) for the field's scalar off-axis geometry
// (`computeOffAxisFieldGeometry`), every returned ray traced with every aperture checked and the stop at the launch's
// clip radius, one half of it mirrored where every surface is mirror-symmetric about the meridian
// (`mirrorSymmetricAboutMeridian`, which `mtfMirrorSymmetric` hands on). Its vignetting curve is the share of the
// samples, neither unaimed nor failed, that reach the image; its relative illumination Rimmer's: n'^2 times bulk
// transmission times each lit cell's area in direction cosines referred to the chief ray's image point through a
// reference sphere, over the axis's. What the tab does inline is restated here, each line with a source canary
// (test/integration/lv/canaries.test.ts); the field geometry, the lattice and its aim are LensVisualizer's own exports.
// This module imports nothing of the rays generators.
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefRequest } from "./chiefSetup.ts";
import type { LvChiefGeometry, LvChiefSetupApi } from "./chiefSetup.ts";
import { tracesAuthored } from "./spot.ts";
import type { LvAimedStopLattice, LvAnalysisRequest, LvApi, LvScalarFieldGeometry } from "./types.ts";

/** The LensVisualizer exports the fields are decided with. */
export type LvVignettingFieldsApi = LvChiefSetupApi &
  Pick<
    LvApi,
    | "uniformFieldFraction"
    | "launchSurfaceForFieldDeg"
    | "mtfSequentialRefractivePath"
    | "mtfAxialImagePlane"
    | "mtfMirrorSymmetric"
    | "computeOffAxisFieldGeometry"
    | "prepareAimedStopLattice"
    | "traceEngineRay"
    | "bulkTransmissionForTrace"
    | "vignettingBeamCells"
    | "vignettingMinBeamCells"
  >;

/** Why a state or a field has no rays a set can state: the problem code, and what it says. */
export interface LvVignettingRefusal {
  readonly code: string;
  readonly message: string;
}

/** Whether a decision is a refusal. */
export function isVignettingRefusal(made: object): made is LvVignettingRefusal {
  return "code" in made;
}

/** What the tab launches and traces every field with, as `computeVignettingCurve` sets it up. */
export interface LvVignettingSetup {
  /** The drawer's request (`lvChiefRequest`): the prepared state, the case's stop radius and the drawer's pupil. */
  readonly request: LvAnalysisRequest;
  /** The cells across the stop's diameter of each field's lattice: `BEAM_GRID_CELLS`, no count of the drawer's. */
  readonly cells: number;
  /** True where the tab traces the +x half of each lattice and mirrors it (`mirrorSymmetricAboutMeridian`). */
  readonly mirror: boolean;
}

/**
 * How the tab sets up its trace of a case's state, restated from `computeVignettingCurve` in vignetting.ts, with the
 * drawer's request (`lvChiefRequest`), or why it draws no curve of the state:
 *
 * ```
 * if (!(request.aperture.stopSemiDiameterMm > 0) || L.N < 1) return none("invalid-state");
 * if (!mtfSequentialRefractivePath(state)) return none("unsupported-path");
 * if (!mtfAxialImagePlane(state)) return none("tilted-image-plane");
 * const cellsAcross = vignettingCellsAcross(request);   // BEAM_GRID_CELLS without a count of the drawer's
 * const mirrored = mirrorSymmetricAboutMeridian(state);  // vignettingField
 * ```
 *
 * A state without a stop is `no-stop`; one outside the MTF's beam model (a fisheye projection, a folded, mirror,
 * diffractive or annular path, a tilted image plane) is `lv-outside-beam-model`.
 */
export function lvVignettingSetup(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
): LvVignettingSetup | LvVignettingRefusal {
  const { state } = model;
  const request = lvChiefRequest(api, model);
  const stop = request.aperture.stopSemiDiameterMm;
  if (!(stop > 0) || state.surfaces.length < 1) {
    return { code: "no-stop", message: `the stop radius of the drawer's request is ${stop} mm` };
  }
  if (!api.mtfSequentialRefractivePath(state) || !api.mtfAxialImagePlane(state)) {
    const message =
      "LensVisualizer's vignetting tab draws no curve of a state its MTF's beam model does not cover: a fisheye " +
      "projection, a folded, mirror, diffractive or annular path, or a tilted image plane";
    return { code: "lv-outside-beam-model", message };
  }
  const cells = Math.max(Math.round(api.vignettingBeamCells), api.vignettingMinBeamCells);
  return { request, cells, mirror: api.mtfMirrorSymmetric(state) };
}

/**
 * How many fields the tab samples from the axis to the half field, restated from `computeVignettingCurve` with no count
 * of the drawer's (`sampling: {}`):
 *
 * ```
 * const fieldCount =
 *   sampling.vignettingFieldSampleCount !== undefined
 *     ? Math.max(Math.round(sampling.vignettingFieldSampleCount), 3)
 *     : Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
 * ```
 */
export function lvVignettingFieldCount(halfFieldDeg: number): number {
  return Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
}

/**
 * The tab's fields as fractions of the half field of the drawer's geometry, from the axis, restated from
 * `computeVignettingCurve`:
 *
 * ```
 * const fractions = Array.from({ length: fieldCount }, (_, i) => uniformFieldFraction(i, fieldCount));
 * ```
 */
export function lvVignettingFieldFractions(api: Pick<LvApi, "uniformFieldFraction">, halfFieldDeg: number): number[] {
  const fieldCount = lvVignettingFieldCount(halfFieldDeg);
  return Array.from({ length: fieldCount }, (_, i) => api.uniformFieldFraction(i, fieldCount));
}

/**
 * The tab's field angles, from the axis to the half field, restated from `vignettingField`:
 *
 * ```
 * const fieldAngleDeg = fieldFraction * fields.halfFieldDeg;
 * ```
 */
export function lvVignettingFieldAngles(api: Pick<LvApi, "uniformFieldFraction">, halfFieldDeg: number): number[] {
  return lvVignettingFieldFractions(api, halfFieldDeg).map((fraction) => fraction * halfFieldDeg);
}

/** A field's lattice as the tab aims it: its scalar geometry and LensVisualizer's aimed stop lattice. */
export interface LvVignettingBeam {
  readonly fieldFraction: number;
  readonly geometry: LvScalarFieldGeometry;
  /** `prepareAimedStopLattice` of the field: `rays[i]` is the ray of `cells[i]`, the chief its stop-centre ray. */
  readonly lattice: LvAimedStopLattice;
}

/** One field of the tab: its place in the tab's curve, its angle, and its lattice or why a set has none. */
export interface LvVignettingField {
  readonly index: number;
  readonly fieldAngleDeg: number;
  readonly made: LvVignettingBeam | LvVignettingRefusal;
}

/** What the tab makes of a state: its setup and every field, or why it draws no curve, with the angles it samples. */
export type LvVignettingDecision =
  | { readonly refused: LvVignettingRefusal; readonly anglesDeg: readonly number[] }
  | { readonly setup: LvVignettingSetup; readonly fields: readonly LvVignettingField[] };

/**
 * Every field of the tab with its lattice, LensVisualizer's own field geometry and aimed stop lattice, restated from
 * `computeVignettingCurve`, whose geometry is the drawer's,
 *
 * ```
 * if (fractions.some((fraction) => launchSurfaceForFieldDeg(fraction * halfFieldDeg, state.lens.projection.config) !== "object-plane"))
 *   return none("bounding-sphere-field");
 * ```
 *
 * and from `vignettingField`:
 *
 * ```
 * const geometry = computeOffAxisFieldGeometry(state, fieldFraction, fields);
 * const scalar = geometry && !isOffAxisVectorFieldGeometry(geometry) ? geometry : null;
 * const launch = scalar && prepareAimedStopLattice(request, n, scalar);
 * if (!scalar || !launch) return unavailableField(base, "no-field-launch");
 * ```
 *
 * A state the tab draws no curve of is refused with the angles it would sample (`lvVignettingSetup`, and
 * `lv-bounding-sphere-field` where a field is launched from a bounding sphere: the tab draws a curve of one method or
 * none). A field without a launch (`no-field-launch`, which the tab draws without figures) or whose stop-centre ray
 * LensVisualizer aims none of (`lv-chief-unaimed`: the tab's image point is that ray's, and the set would have no ray for
 * a vacant cell) has no set.
 */
export function lvVignettingDecision(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
): LvVignettingDecision {
  const halfFieldDeg = geometry.halfFieldDeg;
  const fractions = lvVignettingFieldFractions(api, halfFieldDeg);
  const anglesDeg = fractions.map((fraction) => fraction * halfFieldDeg);
  const setup = lvVignettingSetup(api, model);
  if (isVignettingRefusal(setup)) return { refused: setup, anglesDeg };
  const { state } = model;
  const config = state.lens.projection.config;
  const sphere = fractions.find(
    (fraction) => api.launchSurfaceForFieldDeg(fraction * halfFieldDeg, config) !== "object-plane",
  );
  if (sphere !== undefined) {
    const message = `LensVisualizer launches the vignetting tab's field at ${sphere * halfFieldDeg} degrees from a bounding sphere, which its beam model does not cover: the tab draws no curve`;
    return { refused: { code: "lv-bounding-sphere-field", message }, anglesDeg };
  }
  const fields = fractions.map((fieldFraction, index): LvVignettingField => {
    const fieldAngleDeg = fieldFraction * halfFieldDeg;
    const scalar = api.computeOffAxisFieldGeometry(state, fieldFraction, geometry);
    const lattice =
      scalar !== null && scalar.kind !== "vector"
        ? api.prepareAimedStopLattice(setup.request, setup.cells, scalar)
        : null;
    if (scalar === null || scalar.kind === "vector" || lattice === null) {
      const message = `LensVisualizer has no launch of the vignetting tab's field at ${fieldAngleDeg} degrees, which the tab draws without figures`;
      return { index, fieldAngleDeg, made: { code: "no-field-launch", message } };
    }
    if (lattice.chief.status !== "aimed") {
      const message = `LensVisualizer aims no stop-centre ray of the vignetting tab's field at ${fieldAngleDeg} degrees, the ray its image point is of`;
      return { index, fieldAngleDeg, made: { code: "lv-chief-unaimed", message } };
    }
    return { index, fieldAngleDeg, made: { fieldFraction, geometry: scalar, lattice } };
  });
  return { setup, fields };
}

/** The lattice a beam set states: the square of the cells the tab traces, row by row, as a lattice of its own. */
export interface LvBeamLattice {
  /** The columns of the lattice the set states: the +x half of the stop's where the tab mirrors, all where it does not. */
  readonly columns: number;
  readonly rows: number;
  /** The side of a cell on the stop, mm: twice the stop radius over the cells across. */
  readonly step: number;
  /** The stop lattice's column of the set's first: the middle where the tab mirrors, 0 where it does not. */
  readonly firstColumn: number;
}

/**
 * The cells the tab traces of a field's stop lattice, restated from `traceLattice` in vignetting.ts:
 *
 * ```
 * for (const cell of lattice) {
 *   if (mirrored && cell.xFraction < 0) continue;
 *   results[cell.index] = traceCell(cell);
 * }
 * ```
 *
 * with the lattice's coordinates `(2k + 1 - n) / n` (`stopLattice`), so that on an even lattice the cells of x above 0
 * are the columns from the middle on. The set states the square of those columns over every row, so that the cell of
 * row r and column c is ray `r * columns + c`, as the contract's `groups.lattice` says; a square's cell outside the
 * stop's disc is in no lattice of LensVisualizer's.
 */
export function lvBeamLattice(beam: LvVignettingBeam, mirror: boolean): LvBeamLattice {
  const n = beam.lattice.cellsAcross;
  const firstColumn = mirror ? Math.floor(n / 2) : 0;
  return { columns: n - firstColumn, rows: n, step: (2 * beam.lattice.stopSemiDiameterMm) / n, firstColumn };
}

/**
 * The rays of a beam set, in the order of `lvBeamLattice`'s square, then the stop-centre ray: each cell of the stop
 * lattice the tab traces holds its ray as LensVisualizer's aimed lattice returns it (an aimed ray, or a blocked cell's
 * blocking ray, which every engine stops ahead of the stop: LensVisualizer counts it vignetted), and `launch` 1 for it;
 * a square's cell LensVisualizer has no ray for (outside the stop's disc, or a cell it could not aim, which it never
 * traces) holds the stop-centre ray at `launch` 0, so nothing is fabricated. The stop-centre ray is the one
 * LensVisualizer traces, without aperture checks, for the field's image point.
 */
export function lvBeamRays(
  beam: LvVignettingBeam,
  mirror: boolean,
): {
  readonly rays: readonly { readonly origin: readonly number[]; readonly direction: readonly number[] }[];
  readonly launch: readonly number[];
  readonly unaimed: number;
} {
  const { lattice } = beam;
  const chief = lattice.chief as { readonly origin: readonly number[]; readonly direction: readonly number[] };
  const { columns, rows, firstColumn } = lvBeamLattice(beam, mirror);
  const rays = Array.from({ length: columns * rows + 1 }, () => chief);
  const launch = new Array<number>(columns * rows + 1).fill(0);
  let unaimed = 0;
  lattice.cells.forEach((cell, at) => {
    if (cell.column < firstColumn) return;
    const ray = lattice.rays[at];
    if (ray.status === "unaimed") {
      unaimed++;
      return;
    }
    const index = cell.row * columns + (cell.column - firstColumn);
    rays[index] = { origin: ray.origin, direction: ray.direction };
    launch[index] = 1;
  });
  return { rays, launch, unaimed };
}

/**
 * The lines of a case the tab traces, in order: the tab aims and traces every surface at its authored index (its
 * launch is asked with no spectrum), so it is of a line whose indices are those (`tracesAuthored`) and of no other.
 * The lines of the case source's ask; none for a run of no such line (every photopic and spectral run).
 */
export function lvVignettingLines(model: LvCaseModel): number[] {
  return model.exported.conditions.lines.map((_line, line) => line).filter((line) => tracesAuthored(model, line));
}
