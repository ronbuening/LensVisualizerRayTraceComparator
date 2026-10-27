// Which fields and lines of LensVisualizer's vignetting tab have rays that a `rays.trace` request can state, decided
// once for both sides of rungs R11a and R11b: the case source makes its vignetting sets and its `vignetting.native`
// ask of the fields this module admits (vignettingRaySets.ts), and `lv` answers the ask with the tab's samples of the
// same fields (vignetting.ts), so that no engine is asked a field `lv` cannot answer and `lv` never refuses its own case
// source's ask.
//
// Since LensVisualizer 5ba17c20c the tab traces each field's whole beam in two dimensions with its MTF's own launch
// machinery: the chief-ray launch of the field (`prepareMtfFieldLaunch`), the footprint of its beam on the launch plane
// (`findMtfFieldFootprint`) and a lattice of `BEAM_GRID_CELLS` cells across it (`mtfLaunchGrid`), of which it traces
// one half and mirrors it where every surface is mirror-symmetric (`mtfMirrorSymmetric`). Its geometric transmission
// is the lit cells' area on the launch plane; its relative illumination the beam's flux times the cosine of the field
// angle over the image area a unit of object solid angle covers, `(dh/dθ)(h / sin θ)`, from the landings of the
// field's lit chief ray and of those 0.01 degrees to either side, or, where they are vignetted, from the median ray tube
// of the beam, tilted copies of its rays traced without aperture checks. Those, and the footprint's scan, are the only
// rays it traces that no set holds. What the tab does inline is restated here, each line with a source canary
// (test/integration/lv/canaries.test.ts); the launch, the footprint, the lattice and the classification of a trace are
// LensVisualizer's own exports. This module imports nothing of the rays generators.
import type { LvCaseModel } from "./caseModel.ts";
import { lvChiefRequest } from "./chiefSetup.ts";
import type { LvChiefGeometry, LvChiefSetupApi } from "./chiefSetup.ts";
import { tracesAuthored } from "./spot.ts";
import type {
  LvApi,
  LvMtfFieldLaunch,
  LvMtfFootprint,
  LvMtfLaunchGrid,
  LvMtfOptions,
  LvMtfSupport,
  LvRay,
  LvTraceOptions,
} from "./types.ts";

/** The LensVisualizer exports the fields are decided with. */
export type LvVignettingFieldsApi = LvChiefSetupApi &
  Pick<
    LvApi,
    | "uniformFieldFraction"
    | "launchSurfaceForFieldDeg"
    | "mtfSequentialRefractivePath"
    | "mtfAxialImagePlane"
    | "mtfTraceOptions"
    | "mtfMirrorSymmetric"
    | "prepareMtfFieldLaunch"
    | "findMtfFieldFootprint"
    | "mtfLaunchGrid"
    | "mtfLaunchRay"
    | "traceEngineRay"
    | "mtfTraceClassification"
    | "mtfImagePoint"
    | "bulkTransmissionForTrace"
    | "spectralLinesNm"
  >;

/**
 * The cells across each field's beam, the tab's `BEAM_GRID_CELLS` with no count of the drawer's
 * (`vignettingPupilSampleCount` unset):
 *
 * ```
 * const BEAM_GRID_CELLS = 64;
 * ```
 */
export const LV_VIGNETTING_BEAM_CELLS = 64;

/**
 * The step of field angle, degrees, between a field's chief ray and the two whose landings give the tab's image
 * mapping, the tab's `MAPPING_STEP_DEG`:
 *
 * ```
 * const MAPPING_STEP_DEG = 0.01;
 * ```
 */
export const LV_VIGNETTING_MAPPING_STEP_DEG = 0.01;

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
  /** The MTF options the launch and the footprint are found with: the drawer's two radii. */
  readonly options: LvMtfOptions;
  /** The tab's own support record: the d line, at the authored indices, with no finite conjugate. */
  readonly support: LvMtfSupport;
  /** The options the tab traces a ray with: LensVisualizer's own `mtfTraceOptions` of its line. */
  readonly traceOptions: LvTraceOptions;
  /** True where the tab traces one half of each beam and mirrors it (`mtfMirrorSymmetric`). */
  readonly mirror: boolean;
}

/**
 * How the tab sets up its trace of a case's state, restated from `computeVignettingCurve` in vignetting.ts, with the
 * drawer's request (`lvChiefRequest`), or why it draws no curve of the state:
 *
 * ```
 * const { entrancePupilSemiDiameterMm: currentEPSD, stopSemiDiameterMm: currentPhysStopSD } = request.aperture;
 * if (currentEPSD <= 0 || L.N < 1) return [];
 * if (!mtfSequentialRefractivePath(state) || !mtfAxialImagePlane(state)) return [];
 * const options: MtfOptions = { method: "geometric", spectrum: "reference", focus: "design",
 *   pupilSemiDiameterMm: currentEPSD, stopSemiDiameterMm: currentPhysStopSD };
 * const support: MtfSupport = { available: true, reason: null, message: "", referenceWavelengthNm: LINE_NM.d,
 *   useResolvedReference: false, spectralLines: [{ wavelengthNm: LINE_NM.d, weight: 1 }], limitations: [] };
 * const traceOptions = mtfTraceOptions(state, options, support, support.spectralLines[0]);
 * const mirror = mtfMirrorSymmetric(state);
 * ```
 *
 * A state without a pupil is `no-pupil`; one outside the MTF's beam model (a fisheye projection, a folded, mirror,
 * diffractive or annular path, a tilted image plane) is `lv-outside-beam-model`.
 */
export function lvVignettingSetup(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
): LvVignettingSetup | LvVignettingRefusal {
  const { state } = model;
  const { entrancePupilSemiDiameterMm: currentEPSD, stopSemiDiameterMm: currentPhysStopSD } = lvChiefRequest(
    api,
    model,
  ).aperture;
  if (!(currentEPSD > 0) || state.surfaces.length < 1) {
    return { code: "no-pupil", message: `the tabs' pupil radius is ${currentEPSD} mm` };
  }
  if (!api.mtfSequentialRefractivePath(state) || !api.mtfAxialImagePlane(state)) {
    const message =
      "LensVisualizer's vignetting tab draws no curve of a state its MTF's beam model does not cover: a fisheye " +
      "projection, a folded, mirror, diffractive or annular path, or a tilted image plane";
    return { code: "lv-outside-beam-model", message };
  }
  const options: LvMtfOptions = {
    method: "geometric",
    spectrum: "reference",
    focus: "design",
    pupilSemiDiameterMm: currentEPSD,
    stopSemiDiameterMm: currentPhysStopSD,
  };
  const reference = api.spectralLinesNm.d;
  const support: LvMtfSupport = {
    available: true,
    reason: null,
    message: "",
    referenceWavelengthNm: reference,
    useResolvedReference: false,
    spectralLines: [{ wavelengthNm: reference, weight: 1 }],
    limitations: [],
  };
  const traceOptions = api.mtfTraceOptions(state, options, support, support.spectralLines[0]);
  return { options, support, traceOptions, mirror: api.mtfMirrorSymmetric(state) };
}

/**
 * How many fields the tab samples from the axis to the half field, restated from `computeVignettingCurve` with no count
 * of the drawer's (`sampling: {}`):
 *
 * ```
 * const fieldSamples =
 *   sampling.vignettingFieldSampleCount !== undefined
 *     ? Math.max(Math.round(sampling.vignettingFieldSampleCount), 3)
 *     : Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
 * ```
 */
export function lvVignettingFieldCount(halfFieldDeg: number): number {
  return Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);
}

/**
 * The tab's field angles, from the axis to the half field of the drawer's geometry, restated from
 * `computeVignettingCurve`:
 *
 * ```
 * const fieldAngles = Array.from(
 *   { length: fieldSamples },
 *   (_, i) => uniformFieldFraction(i, fieldSamples) * halfFieldDeg,
 * );
 * ```
 */
export function lvVignettingFieldAngles(api: Pick<LvApi, "uniformFieldFraction">, halfFieldDeg: number): number[] {
  const fieldSamples = lvVignettingFieldCount(halfFieldDeg);
  return Array.from({ length: fieldSamples }, (_, i) => api.uniformFieldFraction(i, fieldSamples) * halfFieldDeg);
}

/**
 * The tab's launch of a field angle, restated from `computeVignettingCurve`: the MTF's chief-ray launch where the
 * field is launched from the object plane, none from a bounding sphere; null too where LensVisualizer solves no chief
 * ray through the stop.
 *
 * ```
 * const launchAt = (fieldAngleDeg: number): MtfFieldLaunch | null =>
 *   launchSurfaceForFieldDeg(fieldAngleDeg, state.lens.projection.config) === "object-plane"
 *     ? prepareMtfFieldLaunch(state, options, support, fieldAngleDeg)
 *     : null;
 * ```
 */
function launchAt(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
  setup: LvVignettingSetup,
  fieldAngleDeg: number,
): LvMtfFieldLaunch | null {
  const { state } = model;
  return api.launchSurfaceForFieldDeg(fieldAngleDeg, state.lens.projection.config) === "object-plane"
    ? api.prepareMtfFieldLaunch(state, setup.options, setup.support, fieldAngleDeg)
    : null;
}

/** A field's beam as the tab traces it: its launch, its footprint, the lattice over it and its mapping's launches. */
export interface LvVignettingBeam {
  readonly launch: LvMtfFieldLaunch;
  readonly footprint: LvMtfFootprint;
  /** The lattice of `LV_VIGNETTING_BEAM_CELLS` cells across the beam (`mtfLaunchGrid`). */
  readonly grid: LvMtfLaunchGrid;
  /** The launch of the chief ray `LV_VIGNETTING_MAPPING_STEP_DEG` below the field's, null where the tab has none. */
  readonly below: LvMtfFieldLaunch | null;
  /** The launch of the chief ray `LV_VIGNETTING_MAPPING_STEP_DEG` above the field's, null where the tab has none. */
  readonly above: LvMtfFieldLaunch | null;
}

/** One field of the tab: its place in the tab's curve, its angle, and its beam or why a set has none. */
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
 * Every field of the tab with its beam, LensVisualizer's own launch, footprint and lattice, restated from
 * `computeVignettingCurve`, whose geometry is the drawer's:
 *
 * ```
 * if (fieldAngles.some((deg) => launchSurfaceForFieldDeg(deg, state.lens.projection.config) !== "object-plane"))
 *   return [];
 * const launch = launchAt(fieldAngleDeg);
 * const footprint = launch && findMtfFieldFootprint(state, options, support, launch);
 * ```
 *
 * and from `traceBeam`, `const grid = mtfLaunchGrid(footprint, gridSize);`, and from `chiefMapping`, whose two
 * neighbours are `launchAt(fieldAngleDeg - MAPPING_STEP_DEG)` and `launchAt(fieldAngleDeg + MAPPING_STEP_DEG)`.
 *
 * A state the tab draws no curve of is refused with the angles it would sample (`lvVignettingSetup`, and
 * `lv-bounding-sphere-field` where a field is launched from a bounding sphere: the tab draws a curve of one method or
 * none). A field without a chief-ray launch (`chief-ray-failed`) or without a footprint (`vignetted`) is one the tab
 * plots dark, with no beam a set can state.
 */
export function lvVignettingDecision(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
  geometry: LvChiefGeometry,
): LvVignettingDecision {
  const anglesDeg = lvVignettingFieldAngles(api, geometry.halfFieldDeg);
  const setup = lvVignettingSetup(api, model);
  if (isVignettingRefusal(setup)) return { refused: setup, anglesDeg };
  const { state } = model;
  const config = state.lens.projection.config;
  const sphere = anglesDeg.find((deg) => api.launchSurfaceForFieldDeg(deg, config) !== "object-plane");
  if (sphere !== undefined) {
    const message = `LensVisualizer launches the vignetting tab's field at ${sphere} degrees from a bounding sphere, which its beam model does not cover: the tab draws no curve`;
    return { refused: { code: "lv-bounding-sphere-field", message }, anglesDeg };
  }
  const fields = anglesDeg.map((fieldAngleDeg, index): LvVignettingField => {
    const launch = launchAt(api, model, setup, fieldAngleDeg);
    if (launch === null) {
      const message = `LensVisualizer solves no chief ray through the stop for the vignetting tab's field at ${fieldAngleDeg} degrees, which the tab plots dark`;
      return { index, fieldAngleDeg, made: { code: "chief-ray-failed", message } };
    }
    const footprint = api.findMtfFieldFootprint(state, setup.options, setup.support, launch);
    if (footprint === null) {
      const message = `no ray of the vignetting tab's field at ${fieldAngleDeg} degrees reaches the image through the clear apertures`;
      return { index, fieldAngleDeg, made: { code: "vignetted", message } };
    }
    const grid = api.mtfLaunchGrid(footprint, LV_VIGNETTING_BEAM_CELLS);
    const below = launchAt(api, model, setup, fieldAngleDeg - LV_VIGNETTING_MAPPING_STEP_DEG);
    const above = launchAt(api, model, setup, fieldAngleDeg + LV_VIGNETTING_MAPPING_STEP_DEG);
    return { index, fieldAngleDeg, made: { launch, footprint, grid, below, above } };
  });
  return { setup, fields };
}

/** The lattice a beam set states: the cells the tab traces, row by row, as a lattice of their own. */
export interface LvBeamLattice {
  /** The columns of the lattice the set states: half the grid's where the tab mirrors, all of them where it does not. */
  readonly columns: number;
  readonly rows: number;
  readonly step: number;
  /** The grid's column of the lattice's first: the middle where the tab mirrors, 0 where it does not. */
  readonly firstColumn: number;
}

/** The cells the tab traces of a beam's grid (`traceBeam`): of each row, the columns from the middle on when it mirrors. */
export function lvBeamLattice(grid: LvMtfLaunchGrid, mirror: boolean): LvBeamLattice {
  const firstColumn = mirror ? grid.columns / 2 : 0;
  return { columns: grid.columns - firstColumn, rows: grid.rows, step: grid.step, firstColumn };
}

/**
 * The rays of a beam the tab traces, in its order, restated from `traceBeam` in vignetting.ts:
 *
 * ```
 * for (let row = 0; row < rows; row++) {
 *   for (let column = mirror ? columns / 2 : 0; column < columns; column++) {
 *     const trace = traceRay(
 *       mtfLaunchRay(launch, grid.x0 + (column + 0.5) * grid.step, grid.y0 + (row + 0.5) * grid.step),
 *     );
 * ```
 *
 * The cells of the other half are no rays of it: they are not where the tab's mirror images of its rays start
 * (the lattice's columns are not mirror images of each other to the bit), and the tab traces none of them.
 */
export function lvBeamCellRays(
  api: Pick<LvApi, "mtfLaunchRay">,
  beam: Pick<LvVignettingBeam, "launch" | "grid">,
  mirror: boolean,
): LvRay[] {
  const { grid, launch } = beam;
  const rays: LvRay[] = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let column = mirror ? grid.columns / 2 : 0; column < grid.columns; column++) {
      rays.push(api.mtfLaunchRay(launch, grid.x0 + (column + 0.5) * grid.step, grid.y0 + (row + 0.5) * grid.step));
    }
  }
  return rays;
}

/**
 * The chief rays of a beam's image mapping, in the order the tab traces them (`chiefMapping`): the field's, then
 * those of the fields `LV_VIGNETTING_MAPPING_STEP_DEG` below and above it where the tab has their launches, each
 * `mtfLaunchRay(launch, 0, 0)`.
 */
export function lvMappingChiefRays(api: Pick<LvApi, "mtfLaunchRay">, beam: LvVignettingBeam): LvRay[] {
  return [beam.launch, beam.below, beam.above].flatMap((launch) =>
    launch === null ? [] : [api.mtfLaunchRay(launch, 0, 0)],
  );
}

/** How the tab maps a field's beam onto the image: of its lit chief rays, of ray tubes, or not at all (no flux). */
export type LvVignettingMapping = "chief" | "tube" | "dark";

/**
 * How the tab finds the image area of a field's beam, restated from `computeVignettingCurve`: a beam without flux has
 * none (`dark`: no lit cell of a weight above 0); otherwise the lit chief rays' mapping (`chief`), unless the field's
 * own chief ray is vignetted or both its neighbours are, when the median ray tube of the beam stands in (`tube`):
 *
 * ```
 * const litChiefHeight = (launch: MtfFieldLaunch | null): number | null => {
 *   if (!launch) return null;
 *   const trace = traceRay(mtfLaunchRay(launch, 0, 0));
 *   return mtfTraceClassification(trace, state, currentPhysStopSD) === "valid"
 *     ? (mtfImagePoint(state, trace)?.y ?? null)
 *     : null;
 * };
 * const height = litChiefHeight(launch);
 * if (height === null) return null;
 * const [low, high] = [...].map((deg) => litChiefHeight(launchAt(deg)));
 * ...
 * if (rise === null) return null;
 * const imageArea = chiefMapping(fieldAngleDeg, launch) ?? beam.tubeMapping();
 * ```
 *
 * The ray tubes are copies of the beam's rays tilted by 1e-4 rad and traced without aperture checks, which no
 * `rays.trace` request states.
 */
export function lvVignettingMapping(
  api: LvVignettingFieldsApi,
  model: LvCaseModel,
  setup: LvVignettingSetup,
  beam: LvVignettingBeam,
): LvVignettingMapping {
  const { state } = model;
  const stopRadius = setup.options.stopSemiDiameterMm;
  const lit = (ray: LvRay) => {
    const trace = api.traceEngineRay(state, ray, setup.traceOptions);
    return api.mtfTraceClassification(trace, state, stopRadius) === "valid" ? trace : null;
  };
  // `if (!launch || !beam || !(beam.flux > 0))`: the flux is the lit cells' bulk transmission.
  const flux = lvBeamCellRays(api, beam, setup.mirror).some((ray) => {
    const trace = lit(ray);
    return trace !== null && api.bulkTransmissionForTrace(state.lens, trace.hits) > 0;
  });
  if (!flux) return "dark";
  const height = (launch: LvMtfFieldLaunch | null): number | null => {
    if (launch === null) return null;
    const trace = lit(api.mtfLaunchRay(launch, 0, 0));
    return trace === null ? null : (api.mtfImagePoint(state, trace)?.y ?? null);
  };
  if (height(beam.launch) === null) return "tube";
  return height(beam.below) === null && height(beam.above) === null ? "tube" : "chief";
}

/**
 * The lines of a case the tab traces, in order: the tab traces every surface at its authored index (its support is
 * of the reference line with no index resolver), so it is of a line whose indices are those (`tracesAuthored`) and of
 * no other. The lines of the case source's ask; none for a run of no such line (every photopic and spectral run).
 */
export function lvVignettingLines(model: LvCaseModel): number[] {
  return model.exported.conditions.lines.map((_line, line) => line).filter((line) => tracesAuthored(model, line));
}
