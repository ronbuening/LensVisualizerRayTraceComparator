// The engine `wave`: the comparator's wave estimator on LensVisualizer's own rays. It answers `mtf.native` for the
// method "diffraction", and where the engine `lv` hands such a request to LensVisualizer's `computeMtf`, whose
// diffraction estimate is LensVisualizer's own, this engine launches LensVisualizer's lattice over the beam of
// each field, has LensVisualizer trace it, and takes Hopkins' autocorrelation of the pupil function the optical
// paths give (src/estimators/waveOtf.ts). Rung R6b sets the two answers beside each other.
//
// It is no independent engine: its rays are LensVisualizer's, launched and traced by LensVisualizer, the very sets
// a run asks every engine to trace (`lvFieldRaySets`) and the very trace `lv` answers `rays.trace` with
// (`answerLvRays`). What is its own is the estimate, and whether a lattice may carry it (`waveFlags`); that is what
// its adapter revision covers. Its fingerprint is LensVisualizer's.
import type { JsonObject } from "../../contract/json.ts";
import type { ProtocolHandler } from "../../contract/protocol.ts";
import { MTF_DESIGN_PLANE } from "../../contract/quantities/mtfNative.ts";
import type {
  MtfFieldStatus,
  MtfNativeData,
  MtfNativeField,
  MtfNativeSpec,
} from "../../contract/quantities/mtfNative.ts";
import { RAY_STATUS } from "../../contract/quantities/raysTrace.ts";
import type { RayLattice, RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import type { UnsupportedItem } from "../../contract/result.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import { countValid, maskWhere } from "../../estimators/validity.ts";
import { QUARTER_WAVE, gridConvergence } from "../../estimators/waveOtf.ts";
import type { PolychromaticWaveOtf, WaveOtfUnavailable } from "../../estimators/waveOtf.ts";
import { CONVERGENCE_BANDS, waveFlags } from "../../estimators/waveValidity.ts";
import { mtfNativeQuantity } from "../../quantities/mtfNative.ts";
import { DEFAULT_BUNDLE_GRID, FINE_GRID_FACTOR } from "../../rays/raySets.ts";
import { decodeWavefront, fieldWaveOtf, fluxCentroid, imageSpaceIndices, launchedSet } from "../../rays/wavefront.ts";
import type { DecodedWavefront, WaveLine } from "../../rays/wavefront.ts";
import type { LvBinding } from "./binding.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { bindLvFor, createLvBackedEngine } from "./engine.ts";
import type { LvAnswer, LvAnswered, LvBackedIdentity } from "./engine.ts";
import { mtfCounts } from "./mtf.ts";
import { lvFieldAngles, lvFieldRaySets, lvLaunchSetup } from "./raySets.ts";
import type { LvLaunchSetup, LvRaySetApi } from "./raySets.ts";
import { answerLvRays } from "./rays.ts";

/** The id of the engine that is the comparator's wave estimator on LensVisualizer's own rays. */
export const LV_WAVE_ENGINE_ID = "wave";

/** The version of the engine, for people. Results are keyed by its fingerprint and its adapter revision. */
export const LV_WAVE_ENGINE_VERSION = "1";

/** The module of the engine, relative to the comparator's sources: where its adapter revision starts from. */
export const LV_WAVE_ENGINE_MODULE = "engines/lv/waveEngine.ts";

/** What the engine calls its method in an answer. */
export const LV_WAVE_METHOD = "hopkins-autocorrelation";

/**
 * The engine option that states the cells across the coarser of the engine's two lattices: a run's
 * `sampling.bundleGrid`. The finer has `FINE_GRID_FACTOR` times as many. Without it: `DEFAULT_BUNDLE_GRID`.
 */
export const LV_WAVE_GRID_OPTION = "bundleGrid";

/** The most cells across the coarser lattice: the finer is then of 256, LensVisualizer's own largest grid. */
export const LV_WAVE_MAX_GRID = 128;

/**
 * The `item` of each "unsupported" answer that is this engine's own:
 *
 * - `geometric` (`option`): the method "geometric": the engine has the wave estimator only;
 * - `profile` (`option`): any profile: the engine is asked by a spec;
 * - `engineBest` (`option`): the focus "engine-best": the estimator has no focus criterion, and answers about the
 *   image plane of the case as it is;
 * - `grid` (`option`): a `bundleGrid` that is no whole number from 2 to `LV_WAVE_MAX_GRID`.
 *
 * A state LensVisualizer's launch does not cover is "unsupported" as a `feature`, with the gate's reason as item.
 */
export const LV_WAVE_UNSUPPORTED = Object.freeze({
  geometric: "method.geometric",
  profile: "profile",
  engineBest: "focus.engine-best",
  grid: "option.bundleGrid",
} as const);

/** The LensVisualizer exports the engine answers with: those of the ray sets, and the tracer. */
export type LvWaveEngineApi = LvRaySetApi;

/** A field of the request on one lattice: its sets as LensVisualizer traced them, and the estimate they give. */
interface LatticeEstimate {
  readonly lattice: RayLattice;
  readonly sets: readonly RaysTraceSpec[];
  readonly traces: readonly DecodedWavefront[];
  /** The estimate, or why the lattice has none: the estimator's reason, or `no-flux` without a reference point. */
  readonly otf: PolychromaticWaveOtf | { readonly available: false; readonly reason: string };
}

/** The part of a coded problem `<code>: <message>` before the colon. */
function codeOf(problem: string): string {
  const colon = problem.indexOf(":");
  return colon < 0 ? problem : problem.slice(0, colon);
}

/**
 * The estimate of one field on a lattice of `cells` cells across, or the coded problem of a field that has no rays
 * on it. LensVisualizer traces each set as the engine `lv` does (`answerLvRays`); the rays taken are the ones it
 * brings to the image; the reference point is the flux-weighted centroid of the first line's landings, on the
 * image plane of the case.
 */
function estimateOn(
  api: LvWaveEngineApi,
  model: LvCaseModel,
  setup: LvLaunchSetup,
  field: { readonly angleDeg: number; readonly heightFraction?: number },
  cells: number,
  frequencies: readonly number[],
  indices: readonly number[],
): LatticeEstimate | { readonly problem: string } {
  const { exported } = model;
  const made = lvFieldRaySets(api, model, setup, field, cells);
  if ("problem" in made) return made;
  const { sets } = made;
  const lattice = sets[0].groups?.lattice as RayLattice;
  const traces = sets.map((set) => {
    const answer = answerLvRays(api, model, set);
    if ("error" in answer) throw new Error(`a set of the engine's own was not traced: ${answer.error.message}`);
    return decodeWavefront(answer.data);
  });
  const lines = sets.map((set, index): WaveLine => {
    return {
      set: launchedSet(set, exported),
      trace: traces[index],
      valid: maskWhere(traces[index].status, RAY_STATUS.ok),
    };
  });
  const centre = fluxCentroid(lines[0].trace, lines[0].set.weights, lines[0].valid);
  if (centre === null) return { lattice, sets, traces, otf: { available: false, reason: "no-flux" } };
  const reference = { ...centre, z: exported.conditions.imageZ };
  const otf: PolychromaticWaveOtf | WaveOtfUnavailable = fieldWaveOtf(
    exported,
    indices,
    lattice,
    lines,
    reference,
    frequencies,
  );
  return { lattice, sets, traces, otf };
}

/** How many of the cells of a lattice ended as `status`, over the lines. The chief ray is no cell. */
function cellsThat(estimate: LatticeEstimate, status: number): number {
  const cells = estimate.lattice.columns * estimate.lattice.rows;
  return estimate.traces.reduce(
    (sum, trace) => sum + countValid(maskWhere(trace.status.subarray(0, cells), status)),
    0,
  );
}

/** A field without curves: NaN at every frequency, and the reason. */
function unavailableField(requested: number, angleDeg: number | null, frequencies: number, reason: string) {
  const curve = encodeNdArray(new Float64Array(frequencies).fill(NaN));
  const field: MtfNativeField = {
    field: requested,
    fieldAngleDeg: angleDeg,
    imageHeightMm: null,
    sagittal: curve,
    tangential: curve,
    status: "unavailable",
    reason,
    sampling: {},
  };
  return field;
}

/**
 * Answers an `mtf.native` spec about the state of a case's model with the comparator's wave estimator on
 * LensVisualizer's rays.
 *
 * **Unsupported**: the method "geometric", any profile, the focus "engine-best", a `bundleGrid` that is no lattice
 * (`LV_WAVE_UNSUPPORTED`), and a state LensVisualizer's launch does not cover, with the reason of its gate.
 *
 * **The rays** of a field are the run's own ray sets for it: LensVisualizer's launch lattice at `bundleGrid` cells
 * across the beam and at `FINE_GRID_FACTOR` times as many, each at every line of the case (`lvFieldRaySets`),
 * traced by LensVisualizer with the indices of the line (`answerLvRays`). Fields are fractions of LensVisualizer's
 * reference image height, resolved as its MTF resolves them, or angles (`lvFieldAngles`).
 *
 * **The answer**, per requested field:
 *
 * - the curves are the moduli of `fieldWaveOtf` on the finer lattice, at the frequencies of the spec; a value the
 *   rounding of a modulus left above 1 is 1, the range the contract gives an MTF;
 * - `status` is "ok" where the finer lattice may be used as an arbiter (`waveFlags`), and "unconverged", with the
 *   flags joined by `+` as `reason`, where its cells are more than a quarter wave apart, where the estimate moved
 *   by more than the band of the field from the coarser lattice, or where the coarser has no estimate;
 *   "unavailable", with the reason, where the field has no chief-ray angle, no rays, or no estimate;
 * - `imageHeightMm` is how far from the axis LensVisualizer lands the chief ray of the set at the reference line;
 * - `sampling`: `gridSize` and `coarseGridSize`, the cells LensVisualizer's launch lattice was asked for across the
 *   beam on the finer and on the coarser lattice, as LensVisualizer states its own grid; `validRays`, `blockedRays` and
 *   `failedRays`, the cells of the finer lattice by how LensVisualizer ended them, summed over the lines;
 *   `phaseStepWaves`, the largest step of the path between neighbouring lit cells; and `maxDelta`, how far the
 *   MTF moved from the coarser lattice to the finer, where both have an estimate.
 *
 * `method.params` state the two grids and the limits a lattice is held to; `focus` is the plane of the case as it
 * is; `lines` are those of the case; a note says of each field that is no arbiter why.
 */
export function answerLvWave(
  api: LvWaveEngineApi,
  model: LvCaseModel,
  spec: MtfNativeSpec,
  engineOptions: JsonObject = {},
): LvAnswer {
  const refuse = (code: UnsupportedItem["code"], item: string, message: string): LvAnswer => {
    return { unsupported: [{ code, item, message }] };
  };
  const self = `the engine ${LV_WAVE_ENGINE_ID}`;
  if (spec.profile !== undefined) {
    return refuse("option", LV_WAVE_UNSUPPORTED.profile, `${self} has no profile: it is asked by a spec`);
  }
  if (spec.method !== "diffraction") {
    const message = `${self} has the comparator's wave estimator and no other`;
    return refuse("option", LV_WAVE_UNSUPPORTED.geometric, message);
  }
  if (spec.focus !== "design") {
    const message = `${self} has no focus criterion: it answers about the image plane of the case as it is`;
    return refuse("option", LV_WAVE_UNSUPPORTED.engineBest, message);
  }
  const stated = Object.hasOwn(engineOptions, LV_WAVE_GRID_OPTION) ? engineOptions[LV_WAVE_GRID_OPTION] : undefined;
  const coarseCells = stated === undefined ? DEFAULT_BUNDLE_GRID : (stated as number);
  if (!Number.isInteger(coarseCells) || coarseCells < 2 || coarseCells > LV_WAVE_MAX_GRID) {
    const message =
      `${LV_WAVE_GRID_OPTION} is ${JSON.stringify(stated)}: the cells across the coarser lattice are a whole ` +
      `number from 2 to ${LV_WAVE_MAX_GRID}`;
    return refuse("option", LV_WAVE_UNSUPPORTED.grid, message);
  }
  const fineCells = FINE_GRID_FACTOR * coarseCells;

  const setup = lvLaunchSetup(api, model);
  if ("problem" in setup) return refuse("feature", codeOf(setup.problem), setup.problem);

  const { exported } = model;
  const frequencies = spec.frequenciesPerMm;
  const indices = imageSpaceIndices(exported);
  const notes: string[] = [];
  const resolved = lvFieldAngles(api, model, setup, spec.fields);
  const fields = resolved.map((field, index): MtfNativeField => {
    const requested = spec.fields.values[index];
    if ("problem" in field) return unavailableField(requested, null, frequencies.length, codeOf(field.problem));
    const fine = estimateOn(api, model, setup, field, fineCells, frequencies, indices);
    if ("problem" in fine) return unavailableField(requested, field.angleDeg, frequencies.length, codeOf(fine.problem));
    if (!fine.otf.available) return unavailableField(requested, field.angleDeg, frequencies.length, fine.otf.reason);
    const coarse = estimateOn(api, model, setup, field, coarseCells, frequencies, indices);
    const before = "problem" in coarse || !coarse.otf.available ? null : coarse.otf;
    const moved = before === null ? null : gridConvergence(before, fine.otf).maxAbs;
    const step = fine.otf.phaseStep.waves;
    const flags = waveFlags(step, moved, field.angleDeg === 0);
    const status: MtfFieldStatus = flags.length === 0 ? "ok" : "unconverged";
    if (flags.length > 0) {
      const { columns } = fine.lattice;
      const figures = `${step} waves a cell${moved === null ? "" : `, moved by ${moved} on doubling`}`;
      notes.push(
        `field ${requested}: the lattice of ${columns} columns is no arbiter (${flags.join(", ")}; ${figures})`,
      );
    }
    const chief = fine.sets[0].groups?.chiefIndex;
    const [reference] = fine.traces;
    const landed = chief !== undefined && reference.status[chief] === RAY_STATUS.ok;
    const clipped = (curve: Float64Array): Float64Array => curve.map((value) => Math.min(1, value));
    return {
      field: requested,
      fieldAngleDeg: field.angleDeg,
      imageHeightMm: landed ? Math.hypot(reference.x[chief], reference.y[chief]) : null,
      sagittal: encodeNdArray(clipped(fine.otf.sagittal.modulus)),
      tangential: encodeNdArray(clipped(fine.otf.tangential.modulus)),
      status,
      ...(flags.length === 0 ? {} : { reason: flags.join("+") }),
      sampling: {
        gridSize: fineCells,
        coarseGridSize: coarseCells,
        validRays: cellsThat(fine, RAY_STATUS.ok),
        blockedRays: cellsThat(fine, RAY_STATUS.blocked),
        failedRays: cellsThat(fine, RAY_STATUS.failed),
        phaseStepWaves: step,
        ...(moved === null ? {} : { maxDelta: moved }),
      },
    };
  });

  const data: MtfNativeData = {
    fields,
    method: {
      name: LV_WAVE_METHOD,
      params: {
        bundleGrid: coarseCells,
        fineGrid: fineCells,
        quarterWave: QUARTER_WAVE,
        convergenceOnAxis: CONVERGENCE_BANDS.onAxis,
        convergenceOffAxis: CONVERGENCE_BANDS.offAxis,
        stopSemiDiameterMm: exported.conditions.stopSemiDiameter,
      },
    },
    focus: { mode: MTF_DESIGN_PLANE, appliedShiftMm: 0 },
    aperture: {},
    lines: exported.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
    notes,
  };
  return { data, counts: mtfCounts(data, spec) };
}

const ANSWERED: readonly LvAnswered[] = [
  {
    quantity: mtfNativeQuantity,
    method: LV_WAVE_METHOD,
    answer: (api, model, spec, engineOptions) => answerLvWave(api, model, spec as MtfNativeSpec, engineOptions),
  },
];

const IDENTITY: LvBackedIdentity = {
  id: LV_WAVE_ENGINE_ID,
  version: LV_WAVE_ENGINE_VERSION,
  module: LV_WAVE_ENGINE_MODULE,
};

/**
 * The engine `wave` on a bound LensVisualizer checkout, as a protocol handler: `mtf.native` by `answerLvWave`, and
 * for a case everything the engine `lv` does (`createLvBackedEngine`): a case that is no longer what
 * LensVisualizer gives is "stale-case", and a case from any other source "unsupported".
 */
export function createLvWaveEngineOn(binding: LvBinding): ProtocolHandler {
  return createLvBackedEngine(binding, IDENTITY, ANSWERED);
}

/**
 * The engine `wave` on the LensVisualizer checkout at `lvPath`. Rejects with an `EngineUnavailableError` when
 * LensVisualizer cannot be bound, as the engine `lv` does.
 */
export async function createLvWaveEngine(lvPath: string | null): Promise<ProtocolHandler> {
  return createLvWaveEngineOn(await bindLvFor(LV_WAVE_ENGINE_ID, lvPath));
}
