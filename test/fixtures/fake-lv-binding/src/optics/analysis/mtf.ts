// The fake's product MTF, under LV's names. Its curves are a closed form of the request, so that what was asked
// shows in what comes back: a straight fall to a cutoff that is the method's and the stop's, lowered with the
// field. The numbers describe no lens.
//
// A lens that says so (`mtf.sampled`) has its geometric MTF sampled instead, as LV samples one: a field's launch
// and footprint, a ladder of grids with a test of convergence between them, a footprint that is widened when rays
// reach its border, and a transfer function summed over the rays of every line about one reference point. Every
// number of it (the ladder, the tolerance, the limits) is the fake's own.
import type {
  FakeFieldLaunch,
  FakeFootprint,
  FakeMtfFieldResult,
  FakeMtfOptions,
  FakeMtfResult,
  FakeMtfSupport,
  FakeState,
} from "../types.js";
import {
  MTF_CONVERGENCE_TOLERANCE,
  MTF_DEFAULT_GRID_CAP,
  MTF_GRID_LADDER,
  MTF_MAX_FOOTPRINT_EXPANSIONS,
  MTF_MAX_UNKNOWN_FLUX,
  MTF_MIN_RAYS,
} from "./mtfConstants.js";
import { mtfChiefHeight, mtfModeledHalfField, resolveMtfFieldGeometry, resolveMtfFieldTargets } from "./mtfFields.js";
import { expandMtfFootprint } from "./mtfFootprint.js";
import { assessMtfSupport } from "./mtfSupport.js";
import { findMtfFieldFootprint, prepareMtfFieldLaunch, traceMtfBundle } from "./mtfTracing.js";

/** The frequencies of a request that names none. */
export const MTF_FREQUENCIES: readonly number[] = Object.freeze([0, 10, 20, 30, 40, 50]);
/** The fields of a request that names none. */
export const MTF_FIELDS: readonly number[] = Object.freeze([0, 0.5, 1]);

interface FakeFieldGeometry {
  referenceHeightMm: number;
  modeledEdgeHeightMm: number;
}

interface FakeFieldTarget {
  fraction: number;
  targetImageHeightMm: number;
  fieldAngleDeg: number | null;
  outsideModel: boolean;
}

export function emptyMtfField(
  fraction: number,
  target?: { targetImageHeightMm: number | null; fieldAngleDeg: number | null },
): FakeMtfFieldResult {
  return {
    fieldFraction: fraction,
    targetImageHeightMm: target?.targetImageHeightMm ?? null,
    fieldAngleDeg: target?.fieldAngleDeg ?? null,
    imageHeightMm: null,
    sagittal: [],
    tangential: [],
    status: "pending",
    reason: null,
    message: "Waiting to be traced.",
    notes: [],
    gridSize: 0,
    validRays: 0,
    blockedRays: 0,
    failedRays: 0,
    unknownFluxFraction: 0,
    maxDelta: null,
    convergedThroughLpMm: null,
  };
}

function unavailable(field: FakeMtfFieldResult, reason: string, message: string): FakeMtfFieldResult {
  return { ...field, status: "unavailable", reason, message };
}

interface Spot {
  x: number;
  y: number;
  weight: number;
}

interface FakeBundle {
  rays: Spot[];
  blocked: number;
  failed: number;
  failedWeight: number;
  chief: Spot;
  openBorders: { x: boolean; y0: boolean; y1: boolean };
}

type GridOutcome =
  | { kind: "curves"; field: FakeMtfFieldResult; openBorders?: { x: boolean; y0: boolean; y1: boolean } }
  | { kind: "unavailable"; field: FakeMtfFieldResult; refine: boolean };

interface Job {
  state: FakeState;
  options: FakeMtfOptions;
  support: FakeMtfSupport;
  frequencies: readonly number[];
  ladder: readonly number[];
  imagePlaneZ: number;
}

function mark(field: FakeMtfFieldResult, reason: string, message: string): FakeMtfFieldResult {
  field.status = "unavailable";
  field.reason = reason;
  field.message = message;
  return field;
}

export function assessUnresolvedFlux(
  failedRays: number,
  unknownFluxFraction: number,
): { acceptable: boolean; note: string | null } {
  if (unknownFluxFraction > MTF_MAX_UNKNOWN_FLUX) return { acceptable: false, note: null };
  if (failedRays === 0) return { acceptable: true, note: null };
  return { acceptable: true, note: `${failedRays} unresolved rays are omitted.` };
}

// The fake's transfer function of one line: plain sums in the order of the rays, a cosine and a sine a ray.
function plainOtf(points: readonly Spot[], frequencies: readonly number[], axis: "x" | "y"): { re: number[]; im: number[] } {
  const total = points.reduce((sum, point) => sum + point.weight, 0);
  const re = frequencies.map(() => 0);
  const im = frequencies.map(() => 0);
  for (const point of points) {
    frequencies.forEach((frequency, i) => {
      const phase = -2 * Math.PI * frequency * point[axis];
      re[i] += point.weight * Math.cos(phase);
      im[i] += point.weight * Math.sin(phase);
    });
  }
  return { re: re.map((value) => value / total), im: im.map((value) => value / total) };
}

function sampledAtGrid(
  job: Job,
  target: FakeFieldTarget,
  launch: FakeFieldLaunch,
  footprint: FakeFootprint,
  size: number,
): GridOutcome {
  const { state, options, support } = job;
  const field = emptyMtfField(target.fraction, target);
  field.gridSize = size;
  const unavailable = (reason: string, message: string, refine = false): GridOutcome => ({
    kind: "unavailable",
    field: mark(field, reason, message),
    refine,
  });
  const openBorders = { x: false, y0: false, y1: false };
  const cuts = { x: [] as { re: number[]; im: number[]; weight: number }[], y: [] as { re: number[]; im: number[]; weight: number }[] };
  let reference: Spot | undefined;
  let launched = 0;
  let unresolved = 0;
  for (const line of support.spectralLines) {
    const bundle = traceMtfBundle(state, options, support, launch, footprint, size, line, job.imagePlaneZ, {
      reference,
    }) as FakeBundle | null;
    if (!bundle) return unavailable("chief-ray-failed", "No valid chief ray reaches the image plane.");
    reference ??= bundle.chief;
    field.imageHeightMm = Math.hypot(reference.x, reference.y);
    field.validRays += bundle.rays.length;
    field.blockedRays += bundle.blocked;
    field.failedRays += bundle.failed;
    openBorders.x ||= bundle.openBorders.x;
    openBorders.y0 ||= bundle.openBorders.y0;
    openBorders.y1 ||= bundle.openBorders.y1;
    const transmitted = bundle.rays.reduce((sum, ray) => sum + ray.weight, 0);
    launched += transmitted + bundle.failedWeight;
    unresolved += bundle.failedWeight;
    if (bundle.rays.length < MTF_MIN_RAYS || !(transmitted > 0))
      return unavailable("empty-pupil", "Too little pupil remains to estimate MTF.", true);
    const about = reference;
    const points = bundle.rays.map((ray) => ({ x: ray.x - about.x, y: ray.y - about.y, weight: ray.weight }));
    const weight = line.weight * transmitted;
    cuts.x.push({ ...plainOtf(points, job.frequencies, "x"), weight });
    cuts.y.push({ ...plainOtf(points, job.frequencies, "y"), weight });
  }
  field.unknownFluxFraction = launched > 0 ? unresolved / launched : 0;
  const flux = assessUnresolvedFlux(field.failedRays, field.unknownFluxFraction);
  if (!flux.acceptable) return unavailable("trace-failed", "Numerical ray failures prevent an MTF estimate.");
  if (flux.note) field.notes.push(flux.note);
  const modulus = (lines: { re: number[]; im: number[]; weight: number }[]): number[] => {
    const total = lines.reduce((sum, line) => sum + line.weight, 0);
    return job.frequencies.map((_, i) =>
      Math.min(
        1,
        Math.hypot(
          lines.reduce((sum, line) => sum + line.weight * line.re[i], 0) / total,
          lines.reduce((sum, line) => sum + line.weight * line.im[i], 0) / total,
        ),
      ),
    );
  };
  field.sagittal = modulus(cuts.x);
  field.tangential = modulus(cuts.y);
  return { kind: "curves", field, openBorders };
}

// The fake holds a grid to the one before it at every frequency, and has no band.
function settle(field: FakeMtfFieldResult, previous: FakeMtfFieldResult | null, frequencies: readonly number[]): void {
  if (!previous) {
    field.status = "unconverged";
    field.message = "Sampling has not converged.";
    return;
  }
  const deltas = frequencies.map((_, i) =>
    Math.max(Math.abs(field.sagittal[i] - previous.sagittal[i]), Math.abs(field.tangential[i] - previous.tangential[i])),
  );
  field.maxDelta = Math.max(...deltas);
  field.convergedThroughLpMm = field.maxDelta <= MTF_CONVERGENCE_TOLERANCE ? frequencies[frequencies.length - 1] : null;
  field.status = field.maxDelta <= MTF_CONVERGENCE_TOLERANCE ? "converged" : "unconverged";
  field.message = field.status === "converged" ? "Sampling converged." : "Sampling has not converged.";
}

export function* refineMtfField(
  ladder: readonly number[],
  evaluate: (size: number) => GridOutcome,
  frequencies: readonly number[],
): Generator<FakeMtfFieldResult, void> {
  let previous: FakeMtfFieldResult | null = null;
  for (const size of ladder) {
    const outcome = evaluate(size);
    if (outcome.kind === "unavailable") {
      yield previous ?? outcome.field;
      if (outcome.refine) continue;
      return;
    }
    settle(outcome.field, previous, frequencies);
    yield outcome.field;
    if (outcome.field.status === "converged") return;
    previous = outcome.field;
  }
}

function* sampledField(job: Job, target: FakeFieldTarget): Generator<FakeMtfFieldResult, void> {
  const { state, options, support } = job;
  const launch =
    target.fieldAngleDeg === null ? null : prepareMtfFieldLaunch(state, options, support, target.fieldAngleDeg);
  if (!launch) {
    yield mark(emptyMtfField(target.fraction, target), "chief-ray-failed", "No valid chief ray reaches this image height.");
    return;
  }
  let footprint = findMtfFieldFootprint(state, options, support, launch);
  if (!footprint) {
    yield mark(emptyMtfField(target.fraction, target), "vignetted", "No rays reach this image height.");
    return;
  }
  let expansions = 0;
  const evaluate = (size: number): GridOutcome => {
    for (;;) {
      const outcome = sampledAtGrid(job, target, launch, footprint!, size);
      const open = outcome.kind === "curves" ? outcome.openBorders : undefined;
      if (!open || !(open.x || open.y0 || open.y1)) return outcome;
      if (expansions >= MTF_MAX_FOOTPRINT_EXPANSIONS) {
        outcome.field.notes.push("Transmitted rays reach the edge of the sampled pupil region.");
        return outcome;
      }
      footprint = expandMtfFootprint(footprint!, open);
      expansions++;
    }
  };
  yield* refineMtfField(job.ladder, evaluate, job.frequencies);
}

export function* computeMtfSteps(state: FakeState, options: FakeMtfOptions): Generator<FakeMtfResult, FakeMtfResult> {
  const support = assessMtfSupport(state, options);
  const frequencies = [...(options.frequenciesPerMm ?? MTF_FREQUENCIES)];
  const fractions = options.fieldFractions ?? MTF_FIELDS;
  const result: FakeMtfResult = {
    method: options.method,
    spectrum: options.spectrum,
    support,
    frequenciesPerMm: frequencies,
    fields: [],
    geometry: null,
    focus: null,
    aperture: null,
  };
  if (!support.available) return result;

  const chiefHeight = mtfChiefHeight(state, options, support);
  const geometry = resolveMtfFieldGeometry(state, mtfModeledHalfField(state), chiefHeight) as FakeFieldGeometry | null;
  result.geometry = geometry;
  if (!geometry) {
    result.fields = fractions.map((fraction) =>
      unavailable(emptyMtfField(fraction), "chief-ray-failed", "No valid chief ray reaches the image plane."),
    );
    return result;
  }
  const targets = resolveMtfFieldTargets(state, geometry, fractions) as FakeFieldTarget[];
  result.fields = targets.map((target) => {
    const field = emptyMtfField(target.fraction, target);
    if (!target.outsideModel) return field;
    const edge = geometry.modeledEdgeHeightMm.toFixed(1);
    return unavailable(field, "outside-modeled-field", `Outside the modeled field: beyond ${edge} mm.`);
  });

  const cap = options.maxGridSize ?? MTF_DEFAULT_GRID_CAP;
  // The fake's best focus lies a 128th of the stop radius in front of the design plane, whatever the lens; with a
  // grid capped at 32 or below it is twice as far, as a focus search on a coarser bundle finds another plane.
  const bestShift = -options.stopSemiDiameterMm / (cap <= 32 ? 64 : 128);
  const refocused = options.focus === "best-axial";
  result.focus = {
    requestedMode: options.focus,
    mode: refocused ? "best-axial" : "design",
    appliedShiftMm: refocused ? bestShift : 0,
    bestAxialShiftMm: bestShift,
  };
  const stated = state.lens.runtime.data.mtf ?? {};
  result.aperture = {
    tracedFNumber: state.imgZ / (2 * options.pupilSemiDiameterMm),
    limitingSurfaceLabel: stated.limitingSurfaceLabel ?? null,
  };
  yield result;

  if (stated.sampled && options.method === "geometric") {
    const job: Job = {
      state,
      options,
      support,
      frequencies,
      ladder: MTF_GRID_LADDER.filter((size) => size <= cap),
      imagePlaneZ: state.imgZ + result.focus.appliedShiftMm,
    };
    for (const [index, target] of targets.entries()) {
      if (target.outsideModel) continue;
      for (const field of sampledField(job, target)) {
        result.fields[index] = field;
        yield result;
      }
    }
    return result;
  }

  const lines = support.spectralLines.length;
  const cutoff = (options.method === "diffraction" ? 32 : 64) * options.stopSemiDiameterMm;
  result.fields = targets.map((target, index) => {
    const field = result.fields[index];
    if (target.outsideModel) return field;
    if (target.fieldAngleDeg === null) {
      return unavailable(field, "chief-ray-failed", "No valid chief ray reaches this image height.");
    }
    const fall = 1 - target.fraction / 4;
    const unsettled = stated.unconvergedFraction === target.fraction;
    const clipped = stated.clippedChiefFraction === target.fraction;
    return {
      ...field,
      imageHeightMm: chiefHeight(target.fieldAngleDeg),
      sagittal: frequencies.map((frequency) => Math.max(0, 1 - frequency / cutoff) * fall),
      tangential: frequencies.map((frequency) => Math.max(0, 1 - frequency / cutoff) * fall * fall),
      status: unsettled ? "unconverged" : "converged",
      message: unsettled ? "Sampling has not converged within 0.01 MTF." : "Sampling converged within 0.01 MTF.",
      notes: clipped ? ["A clear aperture stops the chief ray at this height."] : [],
      gridSize: unsettled ? cap : 32,
      validRays: 800 * lines,
      blockedRays: 224 * lines,
      maxDelta: unsettled ? 0.03125 : 0.00390625,
      convergedThroughLpMm: unsettled ? null : frequencies[frequencies.length - 1],
    };
  });
  return result;
}

export function computeMtf(state: FakeState, options: FakeMtfOptions): FakeMtfResult {
  const steps = computeMtfSteps(state, options);
  let next = steps.next();
  while (!next.done) next = steps.next();
  return next.value;
}
