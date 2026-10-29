// The replay of LensVisualizer's MTF sampling: for one request, the grids LensVisualizer refines each field
// through, the footprint it settles on, the rays of each grid as LensVisualizer traces them, and the comparator's
// own geometric estimator (src/estimators/geometricOtf.ts) on where those rays land. It is what rung R4f holds to
// LensVisualizer's own `computeMtf`: if the two agree, the comparator understands LensVisualizer's sampling.
//
// What LensVisualizer exports is called, never restated: the request before any field is traced, with the focus
// and each field's target (`computeMtfSteps`, its first step); a field's launch (`prepareMtfFieldLaunch`); a grid's
// bundle at a line, with the reference point: on the real stop, aimed and traced (`traceMtfStopBundle`, LV #936,
// whose aimer blocks a total internal reflection ahead of the stop, retries a seeded cell by the lone solve, and
// throws a RangeError for a size that is no whole number), and for a field launched from the bounding sphere over a
// footprint (`findMtfFieldFootprint`, `traceMtfLaunchPlaneBundle`, `expandMtfFootprint`); the walk through the ladder,
// with the test of convergence and the refinement past a failed grid (`refineMtfField`); the record of a field
// (`emptyMtfField`) and the rule of unresolved flux (`assessUnresolvedFlux`); and the constants (`MTF_GRID_LADDER`,
// `MTF_DEFAULT_GRID_CAP`, `MTF_MAX_FOOTPRINT_EXPANSIONS`, `MTF_MIN_RAYS`).
//
// What LensVisualizer does inline in `computeMtfSteps`, `traceField` and `fieldAtGrid` (src/optics/analysis/mtf/mtf.ts)
// and exports no function for is restated here, expression by expression and in its order: the ladder of a
// request, the image plane, which sampling a field has, the lattice each line's next grid is seeded with, the loop
// that widens a launch-plane footprint, and the bookkeeping of one field at one grid, with its end of a lattice the
// aim found no ray of (`aimedNothing`, `aimFailedMessage`, LV #940). Source
// canaries hold every restated line to LensVisualizer's text (test/integration/lv/canaries.test.ts). The one thing
// that is not LensVisualizer's is the transfer function: where LensVisualizer calls its own `geometricOtf` and
// `combineOtfs`, the replay calls the comparator's `polychromaticOtf`.
import { lvMtfInputs, lvResolvedMtfOptions } from "./tabRequest.ts";
import { polychromaticOtf } from "../../estimators/geometricOtf.ts";
import type { SpectralSpots } from "../../estimators/geometricOtf.ts";
import type {
  LvAimedStopLattice,
  LvApi,
  LvMtfBundle,
  LvMtfFieldDraft,
  LvMtfFieldGeometry,
  LvMtfFieldLaunch,
  LvMtfFieldResult,
  LvMtfFocus,
  LvMtfFootprint,
  LvMtfGridOutcome,
  LvMtfOpenBorders,
  LvMtfOptions,
  LvMtfSpot,
  LvMtfSupport,
  LvPreparedState,
  LvSpectralLine,
} from "./types.ts";

/** The LensVisualizer exports the replay is made with. */
export type LvReplayApi = Pick<
  LvApi,
  | "createAnalysisRequest"
  | "computeMtfSteps"
  | "prepareMtfFieldLaunch"
  | "findMtfFieldFootprint"
  | "traceMtfStopBundle"
  | "traceMtfLaunchPlaneBundle"
  | "expandMtfFootprint"
  | "refineMtfField"
  | "emptyMtfField"
  | "assessUnresolvedFlux"
  | "mtfGridLadder"
  | "mtfDefaultGridCap"
  | "mtfMaxFootprintExpansions"
  | "mtfMinRays"
>;

/**
 * The prefix of a field's `reason` when it is the comparator's estimator that has no value for rays LensVisualizer
 * has: `estimator-` and the estimator's own reason (`OtfUnavailableReason`). No field of LensVisualizer's own has
 * such a reason, so the two answers then differ in the field's reason, and rung R4f says so.
 */
export const REPLAY_ESTIMATOR_REASON = "estimator-";

/** One field of a replay: what the comparator's estimator makes of LensVisualizer's sampling of it. */
export interface LvReplayField {
  /**
   * The field as LensVisualizer's own result states one: the target, the status its refinement gave it, its
   * counts, its grid size, and the curves, which are the comparator's estimator's.
   */
  readonly field: LvMtfFieldResult;
  /** The grid sizes that were traced for the field, in order: every level of the ladder the refinement asked for. */
  readonly gridSizes: readonly number[];
  /** How often the footprint was widened, over all the grid sizes; 0 for a field on the real stop, which has none. */
  readonly expansions: number;
  /**
   * The footprint the field was last traced over: a field LensVisualizer launches from the bounding sphere, sampled
   * on the launch plane; null for a field on the real stop, and for a field that has none.
   */
  readonly footprint: LvMtfFootprint | null;
  /**
   * The bundle of each line at the grid the field's curves are of (`field.gridSize`): the rays as LensVisualizer
   * aimed and traced them, each with where it lands and what it weighs. Empty for a field without curves.
   */
  readonly bundles: readonly LvMtfBundle[];
  /** The one point every line's landings are taken relative to; null for a field without curves. */
  readonly reference: LvMtfSpot | null;
}

/** The replay of one request. */
export interface LvReplay {
  /** LensVisualizer's support record for the request; when it is not available there is nothing else. */
  readonly support: LvMtfSupport;
  /** The frequencies LensVisualizer computes for the request. */
  readonly frequenciesPerMm: readonly number[];
  /** The grid sizes a field of the request may be refined through. */
  readonly ladder: readonly number[];
  /** LensVisualizer's field axis; null when no chief ray reaches the image. */
  readonly geometry: LvMtfFieldGeometry | null;
  /** The focus LensVisualizer applies to every field; null without a field axis. */
  readonly focus: LvMtfFocus | null;
  /** The z of the plane every field is evaluated on, mm. */
  readonly imagePlaneZ: number;
  /** One per requested field, in the order of the request. */
  readonly fields: readonly LvReplayField[];
}

/** What one grid of one field was traced with, kept for the field that comes of it. */
interface GridTrace {
  readonly bundles: readonly LvMtfBundle[];
  readonly reference: LvMtfSpot | null;
  readonly footprint: LvMtfFootprint | null;
}

/**
 * How one field samples its pupil across the grid ladder: `MtfFieldSampling` of LensVisualizer, restated. On the real
 * stop each line's latest lattice seeds its next, finer one (the map is keyed by the line's index in the support
 * record); on the launch plane, a footprint, for a field launched from the bounding sphere.
 */
type FieldSampling =
  | { readonly kind: "stop"; readonly lattices: Map<number, LvAimedStopLattice> }
  | { readonly kind: "launch-plane"; readonly footprint: LvMtfFootprint };

/** The note of a field sampled on the launch plane: `MTF_LAUNCH_PLANE_NOTE` of mtf.ts, restated. */
export const LV_LAUNCH_PLANE_NOTE =
  "This field launches from the bounding sphere, which the stop lattice does not cover: its pupil is sampled in equal cells of the launch plane, not evenly on the stop.";

/** Everything one request shares across its fields: `MtfJobContext` of LensVisualizer. */
interface ReplayContext {
  readonly state: LvPreparedState;
  readonly options: LvMtfOptions;
  readonly support: LvMtfSupport;
  readonly frequencies: readonly number[];
  readonly ladder: readonly number[];
  readonly imagePlaneZ: number;
}

function markUnavailable(field: LvMtfFieldDraft, reason: string, message: string): LvMtfFieldDraft {
  field.status = "unavailable";
  field.reason = reason;
  field.message = message;
  return field;
}

/**
 * True when a stop lattice's aim found no ray at all: no cell aimed and none proven blocked. `aimedNothing` of mtf.ts,
 * restated (LV #940).
 */
function aimedNothing(lattice: LvAimedStopLattice): boolean {
  return lattice.aimedCount === 0 && lattice.blockedCount === 0 && lattice.unaimedCount > 0;
}

/**
 * Why a lattice aimed nothing, in the aimer's own reason codes, in the order of its record: `aimFailedMessage` of
 * mtf.ts, restated (LV #940). R4f compares no message, but the field states it as LensVisualizer's does.
 */
function aimFailedMessage(lattice: LvAimedStopLattice, wavelengthNm: number): string {
  const reasons = Object.entries(lattice.unaimedByReason)
    .filter(([, count]) => count > 0)
    .map(([reason, count]) => `${count} ${reason}`)
    .join(", ");
  const chief =
    lattice.chief.status === "unaimed" ? ` The stop-centre chief is unaimed too (${lattice.chief.reason}).` : "";
  return `No sample of the ${lattice.cellsAcross}-cell stop lattice could be aimed at ${wavelengthNm.toFixed(1)} nm (${reasons}).${chief}`;
}

/**
 * One field at one grid size: `fieldAtGrid` of LensVisualizer for the geometric method, restated line for line (LV
 * #936), with the comparator's estimator in the place of LensVisualizer's.
 *
 * - Every line is traced by LensVisualizer's own bundle: on the real stop `traceMtfStopBundle`, seeded with the
 *   line's lattice of the grid before and keeping this one for the next; on the launch plane
 *   `traceMtfLaunchPlaneBundle` over the footprint, with `MTF_LAUNCH_PLANE_NOTE`. The first line's chief ray, traced
 *   with no aperture checked, is the reference of all of them.
 * - The counts add up over the lines, the unaimed and the unresolved samples beside the beam included. The flux the
 *   beam could carry is the transmitted weight plus the weight of the unresolved samples beside it, which alone are
 *   the unresolved share (`unresolvedInBeamWeight`, the third argument of `assessUnresolvedFlux`).
 * - A line whose stop lattice the aim found no ray of (no cell aimed, none blocked, some unaimed) ends the field as
 *   "aim-failed", with the aimer's reasons, once that line's counts are added (LV #940). It asks for no finer grid:
 *   a finer lattice is solved as this one was.
 * - A line no ray reaches, every sample of it resolved, is dark (`darkLines`) and adds no curve; a line with fewer
 *   rays than `MTF_MIN_RAYS`, or without flux, ends the grid as "empty-pupil". Every line dark is "vignetted", some
 *   dark "empty-pupil"; both ask for a finer grid, which may find a thin beam.
 * - A share LensVisualizer's rule refuses is "trace-failed" and asks for a finer grid too, which can resolve a beam
 *   edge this one cannot: the ladder goes on past it (`refineMtfField`).
 *
 * The sums that decide these are LensVisualizer's plain ones, in its order, since they decide which grids are traced.
 */
function fieldAtGrid(
  api: LvReplayApi,
  context: ReplayContext,
  target: LvMtfFieldResult,
  launch: LvMtfFieldLaunch,
  sampling: FieldSampling,
  size: number,
  traces: WeakMap<LvMtfFieldDraft, GridTrace>,
): LvMtfGridOutcome {
  const { state, options, support } = context;
  const field = api.emptyMtfField(target.fieldFraction, target);
  field.gridSize = size;
  field.pupilSampling = sampling.kind;
  if (sampling.kind === "launch-plane") field.notes.push(LV_LAUNCH_PLANE_NOTE);
  const footprint = sampling.kind === "launch-plane" ? sampling.footprint : null;
  const bundles: LvMtfBundle[] = [];
  let commonReference: LvMtfSpot | undefined;
  const unavailable = (reason: string, message: string, refine = false): LvMtfGridOutcome => {
    traces.set(field, { bundles: [], reference: commonReference ?? null, footprint });
    return { kind: "unavailable", field: markUnavailable(field, reason, message), refine };
  };
  const openBorders = { x: false, y0: false, y1: false };
  const lines: SpectralSpots[] = [];
  let sampledWeight = 0;
  let unresolvedWeight = 0;
  let darkLines = 0;
  for (const [index, line] of support.spectralLines.entries()) {
    let bundle: LvMtfBundle | null;
    if (sampling.kind === "stop") {
      bundle = api.traceMtfStopBundle(state, options, support, launch, size, line, context.imagePlaneZ, {
        reference: commonReference,
        coarse: sampling.lattices.get(index),
      });
      if (bundle?.lattice) sampling.lattices.set(index, bundle.lattice);
    } else {
      bundle = api.traceMtfLaunchPlaneBundle(
        state,
        options,
        support,
        launch,
        sampling.footprint,
        size,
        line,
        context.imagePlaneZ,
        { reference: commonReference },
      );
    }
    if (!bundle) return unavailable("chief-ray-failed", "No valid chief ray reaches the image plane.");
    commonReference ??= bundle.chief;
    field.imageHeightMm = Math.hypot(commonReference.x, commonReference.y);
    field.validRays += bundle.rays.length;
    field.blockedRays += bundle.blocked;
    field.failedRays += bundle.failed;
    field.unaimedRays += bundle.unaimed;
    field.unresolvedInBeamRays += bundle.unresolvedInBeam;
    openBorders.x ||= bundle.openBorders.x;
    openBorders.y0 ||= bundle.openBorders.y0;
    openBorders.y1 ||= bundle.openBorders.y1;
    // A finer lattice solves its cells as this one does, so a lattice that aims nothing ends the ladder.
    if (bundle.lattice && aimedNothing(bundle.lattice))
      return unavailable("aim-failed", aimFailedMessage(bundle.lattice, line.wavelengthNm));
    const transmitted = bundle.rays.reduce((sum, ray) => sum + ray.weight, 0);
    sampledWeight += transmitted + bundle.unresolvedInBeamWeight;
    unresolvedWeight += bundle.unresolvedInBeamWeight;
    if (bundle.rays.length === 0 && bundle.unaimed + bundle.failed === 0) {
      darkLines++;
      continue;
    }
    if (bundle.rays.length < api.mtfMinRays || !(transmitted > 0))
      return unavailable("empty-pupil", "Too little pupil remains to estimate MTF.", true);
    bundles.push(bundle);
    lines.push(spotsOf(line, bundle));
  }
  if (darkLines === support.spectralLines.length)
    return unavailable("vignetted", "No rays reach this image height through the model's clear apertures.", true);
  if (darkLines > 0) return unavailable("empty-pupil", "Too little pupil remains to estimate MTF.", true);
  field.unknownFluxFraction = sampledWeight > 0 ? unresolvedWeight / sampledWeight : 0;
  const unresolvedRays = field.failedRays + field.unaimedRays;
  const unresolved = api.assessUnresolvedFlux(unresolvedRays, field.unknownFluxFraction, field.unresolvedInBeamRays);
  if (!unresolved.acceptable) {
    const away = unresolvedRays - field.unresolvedInBeamRays;
    return unavailable(
      "trace-failed",
      `${field.unresolvedInBeamRays} pupil samples beside the transmitted beam could not be aimed or traced and carry ${(field.unknownFluxFraction * 100).toFixed(1)}% of its flux, too much for an MTF estimate.${away > 0 ? ` ${away} more touch no transmitted cell.` : ""}`,
      true,
    );
  }
  if (unresolved.note) field.notes.push(unresolved.note);

  // The comparator's part: one sum over every line, about the one reference, with no modulus cut off.
  const reference = commonReference as LvMtfSpot;
  const otf = polychromaticOtf(lines, reference, context.frequencies);
  if (!otf.available) return unavailable(`${REPLAY_ESTIMATOR_REASON}${otf.reason}`, otf.message);
  field.sagittal = Array.from(otf.sagittal.modulus);
  field.tangential = Array.from(otf.tangential.modulus);
  traces.set(field, { bundles, reference, footprint });
  return { kind: "curves", field, openBorders };
}

/** The rays of a bundle as the estimator takes them: where each lands and what it weighs, at the line's weight. */
function spotsOf(line: LvSpectralLine, bundle: LvMtfBundle): SpectralSpots {
  const count = bundle.rays.length;
  const x = new Float64Array(count);
  const y = new Float64Array(count);
  const weight = new Float64Array(count);
  bundle.rays.forEach((ray, index) => {
    x[index] = ray.x;
    y[index] = ray.y;
    weight[index] = ray.weight;
  });
  return { weight: line.weight, spots: { x, y, weight } };
}

/**
 * One field through launch and refinement: `traceField` of LensVisualizer, restated (LV #936). A field without a
 * chief ray is "chief-ray-failed". A field the aimed launch reaches (`launch.aim`) refines its stop lattice, each
 * line's latest lattice seeding its next. A field launched from the bounding sphere scans a launch-plane footprint
 * first ("vignetted" without one, its `pupilSampling` "launch-plane"), and a grid whose rays reach the guard band of
 * the footprint is traced again over a wider one, at most `MTF_MAX_FOOTPRINT_EXPANSIONS` times for the field over all
 * its grids. The ladder is walked by LensVisualizer's own `refineMtfField`, so which grids are traced, and what a
 * field's status is, are decided by LensVisualizer's code on the estimator's curves.
 */
function replayField(api: LvReplayApi, context: ReplayContext, target: LvMtfFieldResult): LvReplayField {
  const { state, options, support } = context;
  const none = (reason: string, message: string, pupilSampling: "stop" | "launch-plane" = "stop"): LvReplayField => {
    const field = api.emptyMtfField(target.fieldFraction, target);
    field.pupilSampling = pupilSampling;
    return {
      field: markUnavailable(field, reason, message),
      gridSizes: [],
      expansions: 0,
      footprint: null,
      bundles: [],
      reference: null,
    };
  };
  const launch =
    target.fieldAngleDeg === null ? null : api.prepareMtfFieldLaunch(state, options, support, target.fieldAngleDeg);
  if (!launch) return none("chief-ray-failed", "No valid chief ray reaches this image height.");

  const traces = new WeakMap<LvMtfFieldDraft, GridTrace>();
  const gridSizes: number[] = [];
  let expansions = 0;
  let evaluate: (size: number) => LvMtfGridOutcome;
  let footprint: LvMtfFootprint | null = null;
  if (launch.aim) {
    const sampling: FieldSampling = { kind: "stop", lattices: new Map() };
    evaluate = (size) => {
      gridSizes.push(size);
      return fieldAtGrid(api, context, target, launch, sampling, size, traces);
    };
  } else {
    footprint = api.findMtfFieldFootprint(state, options, support, launch);
    if (!footprint) {
      return none("vignetted", "No rays reach this image height through the model's clear apertures.", "launch-plane");
    }
    evaluate = (size) => {
      gridSizes.push(size);
      for (;;) {
        const sampling: FieldSampling = { kind: "launch-plane", footprint: footprint as LvMtfFootprint };
        const outcome = fieldAtGrid(api, context, target, launch, sampling, size, traces);
        const open: LvMtfOpenBorders | undefined = outcome.kind === "curves" ? outcome.openBorders : undefined;
        if (!open || !(open.x || open.y0 || open.y1)) return outcome;
        if (expansions >= api.mtfMaxFootprintExpansions) {
          outcome.field.notes.push(
            "Transmitted rays reach the edge of the sampled pupil region; some flux may be missing.",
          );
          return outcome;
        }
        footprint = api.expandMtfFootprint(footprint as LvMtfFootprint, open);
        expansions++;
      }
    };
  }
  let finished: LvMtfFieldDraft | undefined;
  for (const field of api.refineMtfField(context.ladder, evaluate, context.frequencies)) finished = field;
  // Unreachable while a ladder has a size: the refinement yields after every size it asks for.
  if (finished === undefined) return none("empty-ladder", "The request's ladder has no grid size.");
  const trace = traces.get(finished);
  return {
    field: finished,
    gridSizes,
    expansions,
    footprint,
    bundles: finished.status === "unavailable" ? [] : (trace?.bundles ?? []),
    reference: finished.status === "unavailable" ? null : (trace?.reference ?? null),
  };
}

/**
 * Replays LensVisualizer's MTF sampling for a request, field by field, with the comparator's geometric estimator
 * on the rays of every grid.
 *
 * The request before any field is traced is LensVisualizer's own: the first step of `computeMtfSteps` gives the
 * support record, the frequencies, the field axis, the focus and, for every field, its target and whether it lies
 * outside the model. From there on (`computeMtfSteps` of LensVisualizer, restated):
 *
 * - the ladder is `MTF_GRID_LADDER` up to the request's `maxGridSize`, or to `MTF_DEFAULT_GRID_CAP` without one;
 * - the image plane is the state's, moved by the focus's applied shift;
 * - a field outside the model stays as LensVisualizer's first step states it, and every other is replayed
 *   (`replayField`). Fields are independent of each other, so they are replayed in the order of the request.
 *
 * A request LensVisualizer's gate refuses has no fields: `support` says why. A request without a field axis has the
 * fields LensVisualizer gives it, each unavailable. A field that cannot be replayed is a field with a status and a
 * reason like any other, never one left out: LensVisualizer's own reasons where its sampling ends
 * ("chief-ray-failed", "aim-failed", "vignetted", "empty-pupil", "trace-failed", "outside-modeled-field"), and
 * `REPLAY_ESTIMATOR_REASON` with the estimator's reason where the comparator's estimator has no value.
 *
 * The method of the request is not read: the replay is of the sampling, and its curves are always the geometric
 * estimator's.
 */
export function replayLvMtf(api: LvReplayApi, state: LvPreparedState, options: LvMtfOptions): LvReplay {
  const [request, settings] = lvMtfInputs(api, state, options);
  options = lvResolvedMtfOptions(request, settings);
  const first = api.computeMtfSteps(request, settings).next().value;
  const { support, geometry, focus } = first;
  const frequencies = [...first.frequenciesPerMm];
  const cap = (options.maxGridSize as number | undefined) ?? api.mtfDefaultGridCap;
  const context: ReplayContext = {
    state,
    options,
    support,
    frequencies,
    ladder: api.mtfGridLadder.filter((size) => size <= cap),
    imagePlaneZ: state.imgZ + (focus?.appliedShiftMm ?? 0),
  };
  const untraced = (field: LvMtfFieldResult): LvReplayField => ({
    field,
    gridSizes: [],
    expansions: 0,
    footprint: null,
    bundles: [],
    reference: null,
  });
  const fields =
    !support.available || geometry === null || focus === null
      ? first.fields.map(untraced)
      : first.fields.map((field) => (field.status === "pending" ? replayField(api, context, field) : untraced(field)));
  return {
    support,
    frequenciesPerMm: frequencies,
    ladder: context.ladder,
    geometry,
    focus,
    imagePlaneZ: context.imagePlaneZ,
    fields,
  };
}
