// Ray sets from LensVisualizer: its own launch rays. "Identical rays" in the comparison ladder are these: the
// lattice LensVisualizer's MTF lays over the beam of a field, every cell of it, traced as given by every engine.
//
// The chief ray of a field, the footprint of its beam and the lattice over the footprint are LensVisualizer's own
// functions. Two things LensVisualizer does inside `traceMtfBundle` and `computeMtfSteps`, and exports no function
// for, are restated here: where a lattice cell's ray starts and what it weighs, and how the field axis is put
// together from its parts. Integration tests hold both to LensVisualizer: the rays to those of its own bundle, bit
// for bit, and the source lines to their text.
import type { RayGroups, RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import type { RunFields, RunSampling } from "../../contract/runSpec.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { launchBehindProblem, startsInFront } from "../../rays/probe.ts";
import { DEFAULT_BUNDLE_GRID, DEFAULT_RAY_FIELDS, rayProblem, raySetSpec } from "../../rays/raySets.ts";
import type { RaySetResolution } from "../../rays/raySets.ts";
import { exportOptionsOf } from "./caseModel.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { lvTraceOptions } from "./rays.ts";
import type { LvRaysApi } from "./rays.ts";
import { lvHookAperture, lvPupilSeed } from "./tabRequest.ts";
import type { LvHookApi } from "./tabRequest.ts";
import type {
  LvApi,
  LvMtfFieldLaunch,
  LvMtfFootprint,
  LvMtfLaunchGrid,
  LvMtfOptions,
  LvMtfSupport,
  LvVec3,
} from "./types.ts";

/** The LensVisualizer exports the ray sets are made with. */
export type LvRaySetApi = LvRaysApi &
  LvHookApi &
  Pick<
    LvApi,
    | "assessMtfSupport"
    | "mtfModeledHalfField"
    | "mtfChiefHeight"
    | "mtfBeamHeight"
    | "resolveMtfFieldGeometry"
    | "resolveMtfFieldTargets"
    | "prepareMtfFieldLaunch"
    | "findMtfFieldFootprint"
    | "mtfLaunchGrid"
    | "mtfLaunchRay"
    | "mtfImagePoint"
  >;

/** What LensVisualizer's launch functions are asked with, for one case. */
export interface LvLaunchSetup {
  /** The MTF request the launch is asked with: its stop radius is the case's, its pupil radius the footprint's seed. */
  readonly options: LvMtfOptions;
  /** LensVisualizer's support record, with the lines of the case: its first line is the one the launch is found at. */
  readonly support: LvMtfSupport;
}

/**
 * The setup of LensVisualizer's launch for a case, or the coded problem that keeps every field from having rays.
 *
 * - The stop radius is the case's. The seed of the footprint scan is the pupil radius LensVisualizer's own hook
 *   hands its MTF tab for that stop radius (`lvPupilSeed`): for a case that is the tab's, the launch is then the
 *   tab's, to the bit.
 * - The support record is LensVisualizer's own (`assessMtfSupport`), asked for the reference line when that is all
 *   the case has and for a spectral run otherwise, as the case's export was (`exportOptionsOf`); its lines are then
 *   those of the case, so that the chief ray is aimed and the beam is found at the case's reference line, with the
 *   indices LensVisualizer traces that line with.
 *
 * Where LensVisualizer's gate does not pass, there is no launch of its own to take: the problem carries the gate's
 * reason as its code.
 */
export function lvLaunchSetup(
  api: LvHookApi & Pick<LvApi, "assessMtfSupport">,
  model: LvCaseModel,
): LvLaunchSetup | { readonly problem: string } {
  const { state, runtime, exported } = model;
  const { lines, stopSemiDiameter } = exported.conditions;
  const seed = lvPupilSeed(lvHookAperture(api, runtime, state), stopSemiDiameter);
  const asked = exportOptionsOf(exported, state.zoomT, state.focusT).lines;
  const options: LvMtfOptions = {
    method: "geometric",
    spectrum: asked?.kind === "explicit" ? "cdf" : "reference",
    pupilSemiDiameterMm: seed,
    stopSemiDiameterMm: stopSemiDiameter,
    focus: "design",
  };
  const gate = api.assessMtfSupport(state, options);
  if (!gate.available) {
    const message = `LensVisualizer's MTF launch does not cover this state: ${gate.message}`;
    return { problem: rayProblem(gate.reason ?? "launch-unavailable", message) };
  }
  const support: LvMtfSupport = {
    ...gate,
    referenceWavelengthNm: lines[0].wavelengthNm,
    spectralLines: lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
  };
  return { options, support };
}

/** A field of a run as LensVisualizer resolves it: its chief-ray angle, or the coded problem of a field without one. */
export type LvResolvedField =
  { readonly angleDeg: number; readonly heightFraction?: number } | { readonly problem: string };

/**
 * The chief-ray angles of a run's fields.
 *
 * Angles in degrees are taken as given. Fractions of the image height are resolved as LensVisualizer's MTF resolves
 * them (`computeMtfSteps`): the field axis from its modeled half field, the chief ray's height with and without
 * clear apertures and the beam's height (`resolveMtfFieldGeometry`), and then the angle of each fraction of the
 * reference height (`resolveMtfFieldTargets`), with LensVisualizer's exact inversion at infinity and its root
 * solve on the aimed chief ray at a finite conjugate.
 *
 * A fraction has a problem instead of an angle when its height lies beyond the modeled edge
 * (`outside-modeled-field`), and when no chief ray reaches the image at all or no angle was found for the height
 * (`chief-ray-failed`): LensVisualizer's own reasons, under its own codes.
 */
export function lvFieldAngles(
  api: Pick<
    LvApi,
    "mtfModeledHalfField" | "mtfChiefHeight" | "mtfBeamHeight" | "resolveMtfFieldGeometry" | "resolveMtfFieldTargets"
  >,
  model: LvCaseModel,
  setup: LvLaunchSetup,
  fields: RunFields,
): LvResolvedField[] {
  if (fields.kind === "angles-deg") return fields.values.map((angleDeg) => ({ angleDeg }));
  const { state } = model;
  const { options, support } = setup;
  const referenceHeight = api.mtfChiefHeight(state, options, support, false);
  const geometry = api.resolveMtfFieldGeometry(
    state,
    api.mtfModeledHalfField(state),
    api.mtfChiefHeight(state, options, support),
    { reference: referenceHeight, beam: api.mtfBeamHeight(state, options, support) },
  );
  if (geometry === null) {
    const problem = rayProblem("chief-ray-failed", "LensVisualizer finds no chief ray that reaches the image plane");
    return fields.values.map(() => ({ problem }));
  }
  const targets = api.resolveMtfFieldTargets(state, geometry, fields.values, referenceHeight, !support.conjugate);
  return targets.map((target, index): LvResolvedField => {
    const heightFraction = fields.values[index];
    const height = `the image height ${target.targetImageHeightMm} mm (fraction ${heightFraction})`;
    if (target.outsideModel) {
      const message = `${height} lies beyond the modeled edge of the field at ${geometry.modeledEdgeHeightMm} mm`;
      return { problem: rayProblem("outside-modeled-field", message) };
    }
    if (target.fieldAngleDeg === null) {
      const message = `LensVisualizer finds no chief-ray angle for ${height}`;
      return { problem: rayProblem("chief-ray-failed", message) };
    }
    return { angleDeg: target.fieldAngleDeg, heightFraction };
  });
}

/** The launch rays of one field: LensVisualizer's lattice, every cell of it, and the chief ray after them. */
export interface LvFieldRays {
  readonly launch: LvMtfFieldLaunch;
  readonly footprint: LvMtfFootprint;
  readonly grid: LvMtfLaunchGrid;
  /** x, y, z of each ray's origin: the cells row by row, then the chief ray. */
  readonly origins: Float64Array;
  /** x, y, z of each ray's direction, in the same order. */
  readonly directions: Float64Array;
  /** The flux of each ray as it is launched, before anything absorbs: 1 in a collimated bundle; the chief's is 0. */
  readonly launchWeights: Float64Array;
  /** The index of the chief ray: the last ray. */
  readonly chiefIndex: number;
}

function distance(a: LvVec3, b: LvVec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * The launch rays of the field at `angleDeg`, or the coded problem of a field that has none: `chief-ray-failed`
 * when LensVisualizer finds no chief ray for it, and `vignetted` when no ray of it reaches the image.
 *
 * The lattice is LensVisualizer's (`mtfLaunchGrid`) over the footprint it finds for the field
 * (`findMtfFieldFootprint`), with `cells` cells across the beam's larger side. Every cell is a ray, the ones an
 * aperture will stop included, and none is the mirror image of another: the cell of row r and column c is ray
 * `r * columns + c`, launched from the lattice point `(x0 + (c + 0.5) step, y0 + (r + 0.5) step)` by
 * `mtfLaunchRay`, which is where LensVisualizer's own bundle launches it. The chief ray, `mtfLaunchRay(launch, 0,
 * 0)`, is not a cell of the lattice, which has an even number of columns; it follows the cells as the last ray.
 *
 * The launch weight of a cell is LensVisualizer's: 1 in a collimated bundle, and from a finite object point the
 * solid angle of the cell relative to the chief ray's, `(chief distance / ray distance)^3`. The chief ray is a
 * reference and no sample of the pupil: its weight is 0.
 */
export function lvFieldRays(
  api: Pick<LvApi, "prepareMtfFieldLaunch" | "findMtfFieldFootprint" | "mtfLaunchGrid" | "mtfLaunchRay">,
  model: LvCaseModel,
  setup: LvLaunchSetup,
  angleDeg: number,
  cells: number,
): LvFieldRays | { readonly problem: string } {
  const { state } = model;
  const { options, support } = setup;
  const launch = api.prepareMtfFieldLaunch(state, options, support, angleDeg);
  if (launch === null) {
    const message = `LensVisualizer finds no chief ray for the field at ${angleDeg} degrees`;
    return { problem: rayProblem("chief-ray-failed", message) };
  }
  const footprint = api.findMtfFieldFootprint(state, options, support, launch);
  if (footprint === null) {
    const message = `no ray of the field at ${angleDeg} degrees reaches the image through the clear apertures`;
    return { problem: rayProblem("vignetted", message) };
  }
  const grid = api.mtfLaunchGrid(footprint, cells);
  const count = grid.columns * grid.rows + 1;
  const origins = new Float64Array(count * 3);
  const directions = new Float64Array(count * 3);
  const launchWeights = new Float64Array(count);
  const chief = api.mtfLaunchRay(launch, 0, 0);
  const source = launch.objectPoint;
  const chiefDistance = source === undefined ? 0 : distance(chief.origin, source);
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      const x = grid.x0 + (column + 0.5) * grid.step;
      const y = grid.y0 + (row + 0.5) * grid.step;
      const ray = api.mtfLaunchRay(launch, x, y);
      const index = row * grid.columns + column;
      origins.set(ray.origin, 3 * index);
      directions.set(ray.direction, 3 * index);
      launchWeights[index] = source === undefined ? 1 : (chiefDistance / distance(ray.origin, source)) ** 3;
    }
  }
  const chiefIndex = count - 1;
  origins.set(chief.origin, 3 * chiefIndex);
  directions.set(chief.direction, 3 * chiefIndex);
  return { launch, footprint, grid, origins, directions, launchWeights, chiefIndex };
}

/**
 * The weights of a field's rays at one line of the case: the launch weight of each, times LensVisualizer's bulk
 * transmission along its path where a glass of the lens absorbs. LensVisualizer states that transmission as the
 * weight of a ray's image point (`mtfImagePoint`), so every ray is traced once to ask for it; a ray that does not
 * land keeps its launch weight, which nothing reads.
 */
export function lvRayWeights(
  api: LvRaysApi & Pick<LvApi, "mtfImagePoint">,
  model: LvCaseModel,
  rays: LvFieldRays,
  line: number,
): Float64Array {
  const { state, exported } = model;
  const options = lvTraceOptions(model, line);
  return rays.launchWeights.map((launchWeight, ray) => {
    if (ray === rays.chiefIndex) return 0;
    const origin: LvVec3 = [rays.origins[3 * ray], rays.origins[3 * ray + 1], rays.origins[3 * ray + 2]];
    const direction: LvVec3 = [rays.directions[3 * ray], rays.directions[3 * ray + 1], rays.directions[3 * ray + 2]];
    const trace = api.traceEngineRay2(state, { origin, direction }, options);
    const spot = api.mtfImagePoint(state, trace, exported.conditions.imageZ);
    return spot === null ? launchWeight : spot.weight * launchWeight;
  });
}

/**
 * The ray sets of a case that came from a LensVisualizer lens: for every field of `fields` (`DEFAULT_RAY_FIELDS`
 * without them) LensVisualizer's own launch rays (`lvFieldRays`) at `sampling.bundleGrid` cells across the beam
 * (`DEFAULT_BUNDLE_GRID` without it), as one set for each line of the case. The rays of a field are the same at
 * every line, as in LensVisualizer, which finds a field's chief ray and footprint once, at the reference line; the
 * weights are those of the line (`lvRayWeights`). Each set states its field, its lattice and the index of its chief
 * ray under `groups`. Collimated bundles and the bundles of a certified finite conjugate are made alike.
 *
 * A field without rays is a coded problem, and the other fields are not affected (`lvFieldAngles`, `lvFieldRays`);
 * so is a field whose rays would not start in front of the first surface of the case, as the contract requires of
 * every ray (`launch-behind-first-surface`). A state LensVisualizer's launch does not cover is one problem for all
 * of them (`lvLaunchSetup`).
 */
export function lvRaySets(
  api: LvRaySetApi,
  model: LvCaseModel,
  options: { readonly fields?: RunFields; readonly sampling?: Pick<RunSampling, "bundleGrid"> } = {},
): RaySetResolution {
  const setup = lvLaunchSetup(api, model);
  if ("problem" in setup) return { sets: [], problems: [setup.problem] };
  const cells = options.sampling?.bundleGrid ?? DEFAULT_BUNDLE_GRID;
  const sets: RaysTraceSpec[] = [];
  const problems: string[] = [];
  for (const field of lvFieldAngles(api, model, setup, options.fields ?? DEFAULT_RAY_FIELDS)) {
    if ("problem" in field) {
      problems.push(field.problem);
      continue;
    }
    const rays = lvFieldRays(api, model, setup, field.angleDeg, cells);
    if ("problem" in rays) {
      problems.push(rays.problem);
      continue;
    }
    // LensVisualizer launches from a plane in front of the first surface's rim; the contract is held to here.
    if (!startsInFront(model.exported.system.surfaces[0], rays.origins)) {
      problems.push(launchBehindProblem(field.angleDeg));
      continue;
    }
    const { columns, rows, step } = rays.grid;
    const groups: RayGroups = { field, lattice: { columns, rows, step }, chiefIndex: rays.chiefIndex };
    // One encoding of the rays serves every line: only the weights are the line's.
    const { origins, directions } = raySetSpec(0, { ...rays, weights: rays.launchWeights });
    model.exported.conditions.lines.forEach((_line, line) => {
      const weights = encodeNdArray(lvRayWeights(api, model, rays, line));
      sets.push({ line, origins, directions, weights, groups });
    });
  }
  return { sets, problems };
}
