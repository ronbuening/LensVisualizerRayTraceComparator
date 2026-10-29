// The engine `flux`: the comparator's flux estimator on LensVisualizer's own rays. It answers `vignetting.native`, and
// where the engine `lv` hands such a request to LensVisualizer's vignetting tab, this engine launches LensVisualizer's
// MTF lattice on the real stop of each field (since LensVisualizer #936; the tab's own is the same kind of lattice
// since #931), has LensVisualizer trace it, and sums what gets through (src/estimators/illumination.ts): the share of
// the stop's samples that reach the image, and their flux into the image in the optical direction cosines of each ray's
// own exit direction, the relative illumination of the projected solid angle of the exit pupil (Rimmer's, as the tab's
// since #931, which refers each ray's direction to the chief ray's image point through a reference sphere instead),
// with no law of the field angle assumed. Rung R11b sets the two answers beside each other.
//
// It is no independent engine: its rays are LensVisualizer's, launched and traced by LensVisualizer, the very lattices
// a run asks every engine to trace in rung R11a (`lvFieldRaySets`) and the very trace `lv` answers `rays.trace` with
// (`answerLvRays`). What is its own is the estimate, and whether a lattice may carry it; that is what its adapter
// revision covers. Its fingerprint is LensVisualizer's.
import type { JsonObject } from "../../contract/json.ts";
import type { ProtocolHandler } from "../../contract/protocol.ts";
import { RAY_STATUS } from "../../contract/quantities/raysTrace.ts";
import type { RayLattice, RaysTraceData, RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import type {
  VignettingNativeData,
  VignettingNativeField,
  VignettingNativeSpec,
} from "../../contract/quantities/vignettingNative.ts";
import type { UnsupportedItem } from "../../contract/result.ts";
import { decodeNdArray } from "../../core/numeric/ndarray.ts";
import { cosineFlux, launchArea } from "../../estimators/illumination.ts";
import type { CosineFlux, IlluminationUnavailable } from "../../estimators/illumination.ts";
import { maskWhere } from "../../estimators/validity.ts";
import { CONVERGENCE_BANDS } from "../../estimators/waveValidity.ts";
import { vignettingNativeQuantity } from "../../quantities/vignettingNative.ts";
import { DEFAULT_BUNDLE_GRID, FINE_GRID_FACTOR } from "../../rays/raySets.ts";
import { imageSpaceIndices } from "../../rays/wavefront.ts";
import type { LvBinding } from "./binding.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { bindLvFor, createLvBackedEngine } from "./engine.ts";
import type { LvAnswer, LvAnswered, LvBackedIdentity } from "./engine.ts";
import { lvFieldRaySets, lvLaunchSetup } from "./raySets.ts";
import type { LvLaunchSetup, LvRaySetApi } from "./raySets.ts";
import { answerLvRays } from "./rays.ts";
import { linesBeyondCase } from "./spot.ts";

/** The id of the engine that is the comparator's flux estimator on LensVisualizer's own rays. */
export const LV_FLUX_ENGINE_ID = "flux";

/** The version of the engine, for people. Results are keyed by its fingerprint and its adapter revision. */
export const LV_FLUX_ENGINE_VERSION = "1";

/** The module of the engine, relative to the comparator's sources: where its adapter revision starts from. */
export const LV_FLUX_ENGINE_MODULE = "engines/lv/fluxEngine.ts";

/** What the engine calls its method in an answer. */
export const LV_FLUX_METHOD = "lattice-flux";

/**
 * The engine option that states the cells across the coarser of the engine's two lattices: a run's
 * `sampling.bundleGrid`, where the run states one. The finer has `FINE_GRID_FACTOR` times as many. Without it:
 * `LV_FLUX_DEFAULT_GRID`.
 */
export const LV_FLUX_GRID_OPTION = "bundleGrid";

/**
 * The cells across the coarser lattice without the option: twice a run's own `DEFAULT_BUNDLE_GRID`, since the rim of a
 * lattice is a staircase whose area moves the figures by about one cell's share of the rim: on the benchmark a field
 * moves by up to 0.02 on doubling from 32 to 64 cells, and by at most 0.00997 from 64 to 128, within the band of a
 * field off the axis. Rung R11b hands the engine twice a run's stated `bundleGrid` alike (`r11bRung`).
 */
export const LV_FLUX_DEFAULT_GRID = 2 * DEFAULT_BUNDLE_GRID;

/** The most cells across the coarser lattice: the finer is then of 256, LensVisualizer's own largest grid. */
export const LV_FLUX_MAX_GRID = 128;

/**
 * The `item` of each "unsupported" answer that is this engine's own:
 *
 * - `grid` (`option`): a `bundleGrid` that is no whole number from 2 to `LV_FLUX_MAX_GRID`;
 * - `finite` (`feature`): an object not at infinity: the flux of a collimated beam is what the estimate is of;
 * - `folded` (`feature`): a folded path, which a lattice of LensVisualizer's MTF launch does not cover.
 *
 * A state LensVisualizer's launch does not cover is "unsupported" as a `feature`, with the gate's reason as item.
 */
export const LV_FLUX_UNSUPPORTED = Object.freeze({
  grid: "option.bundleGrid",
  finite: "object.finite",
  folded: "path.folded",
} as const);

/** The LensVisualizer exports the engine answers with: those of the ray sets, and the tracer. */
export type LvFluxEngineApi = LvRaySetApi;

/** A field on one lattice at one line: what gets through, or why nothing could be said of it. */
interface LatticeTake {
  readonly lattice: RayLattice;
  /**
   * The share of the lattice's samples of the real stop that reach the image: of the cells LensVisualizer has a ray
   * for, those an engine did not fail; or why there is none (a launch-plane lattice has no samples of the stop).
   */
  readonly share:
    | { readonly available: true; readonly value: number }
    | { readonly available: false; readonly reason: string; readonly message: string };
  readonly flux: CosineFlux | IlluminationUnavailable;
  /** Where the chief ray of the set lands, y, mm; null where it does not. */
  readonly chiefLandingMm: number | null;
  /** How many lit cells lie on the lattice's outermost rows and columns: the beam may reach beyond it there. */
  readonly edgeCells: number;
}

/** The part of a coded problem `<code>: <message>` before the colon. */
function codeOf(problem: string): string {
  const colon = problem.indexOf(":");
  return colon < 0 ? problem : problem.slice(0, colon);
}

/** A field's lattices of `cells` cells across at every line of the case (`lvFieldRaySets`), or its coded problem. */
type FieldSets = ReturnType<typeof lvFieldRaySets>;

/**
 * The lattices of the fields of one answer, made once a field and a number of cells whatever line is asked: a field's
 * sets are of every line of the case, and the same bytes whenever they are made, so taking them again changes nothing
 * of an answer. Keyed by the bits of the angle, -0 apart from 0.
 */
function fieldSetsOf(
  api: LvFluxEngineApi,
  model: LvCaseModel,
  setup: LvLaunchSetup,
): (angleDeg: number, cells: number) => FieldSets {
  const made = new Map<string, FieldSets>();
  return (angleDeg, cells) => {
    const key = `${cells} ${Object.is(angleDeg, -0) ? "-0" : String(angleDeg)}`;
    let sets = made.get(key);
    if (sets === undefined) made.set(key, (sets = lvFieldRaySets(api, model, setup, { angleDeg }, cells)));
    return sets;
  };
}

/**
 * A field's lattice of `cells` cells across at one line (`setsOf`), traced by LensVisualizer as the engine `lv` traces
 * it (`answerLvRays`), and the estimate of the rays it brings to the image: or the coded problem of a field that has no
 * lattice.
 */
function takeOn(
  api: LvFluxEngineApi,
  model: LvCaseModel,
  setsOf: (angleDeg: number, cells: number) => FieldSets,
  angleDeg: number,
  line: number,
  cells: number,
): LatticeTake | { readonly problem: string } {
  const made = setsOf(angleDeg, cells);
  if ("problem" in made) return made;
  const set: RaysTraceSpec = made.sets[line];
  // Since LensVisualizer #936 a field's lattice is of cells on the real stop: a cell that is no sample of it (outside
  // the stop's disc, or unaimed) holds the chief ray at weight 0, and is taken by neither estimate; and the stop's
  // disc touches the square's rim, which a beam bounded by the stop cannot reach beyond.
  const onStop = made.sampling === "stop";
  const lattice = set.groups?.lattice as RayLattice;
  const answer = answerLvRays(api, model, set);
  if ("error" in answer) throw new Error(`a set of the engine's own was not traced: ${answer.error.message}`);
  if ("unsupported" in answer) throw new Error(answer.unsupported.map((item) => item.message).join("; "));
  const data = answer.data as RaysTraceData;
  const status = decodeNdArray(data.status).values as Uint8Array;
  const imagePoint = decodeNdArray(data.imagePoint).values as Float64Array;
  const exitDirection = decodeNdArray(data.exitDirection).values as Float64Array;
  const weight = decodeNdArray(set.weights).values as Float64Array;
  const valid = maskWhere(status, RAY_STATUS.ok);
  const { columns, rows, step } = lattice;
  const lit = valid.map((taken, ray) => (taken && weight[ray] > 0 ? 1 : 0));
  let edgeCells = 0;
  for (let ray = 0; ray < columns * rows && !onStop; ray++) {
    if (!lit[ray]) continue;
    const [column, row] = [ray % columns, Math.floor(ray / columns)];
    if (column === 0 || row === 0 || column === columns - 1 || row === rows - 1) edgeCells++;
  }
  // The samples of the stop: the cells LensVisualizer has a ray for (of a weight above 0), but those the trace failed,
  // which LensVisualizer's tab leaves out of both counts as it does an unaimed sample.
  let samples = 0;
  let transmitted = 0;
  for (let ray = 0; ray < columns * rows; ray++) {
    if (!(weight[ray] > 0) || status[ray] === RAY_STATUS.failed) continue;
    samples++;
    if (lit[ray]) transmitted++;
  }
  const area = launchArea({ columns, rows, step, valid: lit });
  const share: LatticeTake["share"] = !onStop
    ? {
        available: false,
        reason: "launch-plane-lattice",
        message: "a lattice on the launch plane has no samples of the stop to take a share of",
      }
    : samples === 0
      ? { available: false, reason: "no-rays", message: "no cell of the lattice is a sample of the stop" }
      : !area.available
        ? area
        : { available: true, value: transmitted / samples };
  const chief = set.groups?.chiefIndex;
  const landed = chief !== undefined && status[chief] === RAY_STATUS.ok;
  return {
    lattice,
    share,
    flux: cosineFlux({
      columns,
      rows,
      step,
      weight,
      valid,
      point: imagePoint,
      direction: exitDirection,
      imageIndex: imageSpaceIndices(model.exported)[line],
    }),
    chiefLandingMm: landed ? imagePoint[3 * chief + 1] : null,
    edgeCells,
  };
}

/**
 * The two figures of a field on one lattice: its share of the stop's samples that reach the image, absolute, and its
 * flux into the image over the axis's of the same lattice; null where either has none.
 */
function figuresOf(field: LatticeTake, axis: LatticeTake): { transmission: number; illumination: number } | null {
  if (!field.share.available || !field.flux.available || !axis.flux.available) return null;
  return { transmission: field.share.value, illumination: field.flux.flux / axis.flux.flux };
}

/** Why a lattice has no figures: the reason of the first of its two estimates without one. */
function whyNone(take: LatticeTake): string {
  if (!take.share.available) return take.share.reason;
  return take.flux.available ? "no-figures" : take.flux.reason;
}

/**
 * Answers a `vignetting.native` spec about the state of a case's model with the comparator's flux estimator on
 * LensVisualizer's rays.
 *
 * **Unsupported**: a `bundleGrid` that is no lattice, an object not at infinity, a folded path (`LV_FLUX_UNSUPPORTED`),
 * a line the case does not have (`line`), and a state LensVisualizer's launch does not cover, with the reason of its
 * gate.
 *
 * **The rays** of a field are LensVisualizer's launch lattice over the whole beam it finds for the field
 * (`lvFieldRaySets`), at `bundleGrid` cells across (`LV_FLUX_DEFAULT_GRID` without it) and at `FINE_GRID_FACTOR` times
 * as many, at the line, traced by
 * LensVisualizer with the indices of the line (`answerLvRays`): the rays taken are the ones it brings to the image.
 *
 * **The answer**, per line and field:
 *
 * - `geometricTransmission`: the share of the finer lattice's samples of the real stop (the cells LensVisualizer has a
 *   ray for, but those the trace failed) that reach the image, absolute, as LensVisualizer's tab takes it since #931; a
 *   lattice on the launch plane has no samples of the stop, and its field is unavailable (`launch-plane-lattice`);
 * - `relativeIllumination`: the flux of the lit cells into the image, weight times the area each covers in the optical
 *   direction cosines of the image space, over the axis's (`cosineFlux`), on the finer lattice;
 * - `chiefLandingMm`: the y at which the finer lattice's chief ray lands on the image plane of the case;
 * - `status` "ok" where both figures moved by no more than the band of the field (`CONVERGENCE_BANDS`) from the coarser
 *   lattice and no lit cell lies on the finer lattice's outermost rows and columns; else "unconverged", with
 *   `not-converged`, `convergence-unknown` (the coarser has no figures) or `lattice-edge-lit` joined by `+`;
 *   "unavailable", with the reason, where the field or the axis has no lattice or no figures;
 * - `sampling`: `gridSize` and `coarseGridSize`, the cells asked for across the beam on the two lattices; `cells`, the
 *   lit cells of the finer; `edgeCells`, those on its rim; `maxDelta`, how far either figure moved from the coarser.
 */
export function answerLvFlux(
  api: LvFluxEngineApi,
  model: LvCaseModel,
  spec: VignettingNativeSpec,
  engineOptions: JsonObject = {},
): LvAnswer {
  const refuse = (code: UnsupportedItem["code"], item: string, message: string): LvAnswer => {
    return { unsupported: [{ code, item, message }] };
  };
  const self = `the engine ${LV_FLUX_ENGINE_ID}`;
  const { exported } = model;
  if (exported.conditions.object.kind !== "infinity") {
    const message = `${self} sums the flux of a collimated beam: the object is at infinity`;
    return refuse("feature", LV_FLUX_UNSUPPORTED.finite, message);
  }
  if (exported.system.opticalPath !== undefined) {
    return refuse("feature", LV_FLUX_UNSUPPORTED.folded, `${self} has no lattice of a folded path`);
  }
  const beyond = linesBeyondCase(model, spec.lines);
  if (beyond !== null) return { unsupported: [beyond] };
  const stated = Object.hasOwn(engineOptions, LV_FLUX_GRID_OPTION) ? engineOptions[LV_FLUX_GRID_OPTION] : undefined;
  const coarseCells = stated === undefined ? LV_FLUX_DEFAULT_GRID : (stated as number);
  if (!Number.isInteger(coarseCells) || coarseCells < 2 || coarseCells > LV_FLUX_MAX_GRID) {
    const message =
      `${LV_FLUX_GRID_OPTION} is ${JSON.stringify(stated)}: the cells across the coarser lattice are a whole ` +
      `number from 2 to ${LV_FLUX_MAX_GRID}`;
    return refuse("option", LV_FLUX_UNSUPPORTED.grid, message);
  }
  const fineCells = FINE_GRID_FACTOR * coarseCells;
  const setup = lvLaunchSetup(api, model);
  if ("problem" in setup) return refuse("feature", codeOf(setup.problem), setup.problem);
  const setsOf = fieldSetsOf(api, model, setup);

  const notes: string[] = [];
  const answered: VignettingNativeField[] = spec.lines.flatMap((line) => {
    const { wavelengthNm } = exported.conditions.lines[line];
    const unavailable = (fieldAngleDeg: number, reason: string, sampling = {}): VignettingNativeField => ({
      line,
      wavelengthNm,
      fieldAngleDeg,
      status: "unavailable",
      reason,
      chiefLandingMm: null,
      geometricTransmission: null,
      relativeIllumination: null,
      sampling,
    });
    const [axisFine, axisCoarse] = [fineCells, coarseCells].map((cells) => takeOn(api, model, setsOf, 0, line, cells));
    return spec.fieldAnglesDeg.map((angle, at): VignettingNativeField => {
      if ("problem" in axisFine) return unavailable(angle, `axis-${codeOf(axisFine.problem)}`);
      const fine = at === 0 ? axisFine : takeOn(api, model, setsOf, angle, line, fineCells);
      if ("problem" in fine) return unavailable(angle, codeOf(fine.problem));
      const figures = figuresOf(fine, axisFine);
      if (figures === null) {
        const reason = figuresOf(axisFine, axisFine) === null ? `axis-${whyNone(axisFine)}` : whyNone(fine);
        return unavailable(angle, reason);
      }
      const coarse = at === 0 ? axisCoarse : takeOn(api, model, setsOf, angle, line, coarseCells);
      const before = "problem" in coarse || "problem" in axisCoarse ? null : figuresOf(coarse, axisCoarse);
      const moved =
        before === null
          ? null
          : Math.max(
              Math.abs(figures.transmission - before.transmission),
              Math.abs(figures.illumination - before.illumination),
            );
      const band = angle === 0 ? CONVERGENCE_BANDS.onAxis : CONVERGENCE_BANDS.offAxis;
      const flags = [
        ...(moved === null ? ["convergence-unknown"] : moved > band ? ["not-converged"] : []),
        ...(fine.edgeCells > 0 ? ["lattice-edge-lit"] : []),
      ];
      if (flags.length > 0) {
        const figure = `${moved === null ? "no coarser figures" : `moved by ${moved} on doubling`}, ${fine.edgeCells} lit cells on the rim`;
        notes.push(
          `line ${line}, field ${angle}: the lattice of ${fine.lattice.columns} columns is no arbiter (${flags.join(", ")}; ${figure})`,
        );
      }
      return {
        line,
        wavelengthNm,
        fieldAngleDeg: angle,
        status: flags.length === 0 ? "ok" : "unconverged",
        ...(flags.length === 0 ? {} : { reason: flags.join("+") }),
        chiefLandingMm: fine.chiefLandingMm,
        geometricTransmission: figures.transmission,
        relativeIllumination: figures.illumination,
        sampling: {
          gridSize: fineCells,
          coarseGridSize: coarseCells,
          cells: fine.flux.available ? fine.flux.cells : 0,
          edgeCells: fine.edgeCells,
          ...(moved === null ? {} : { maxDelta: moved }),
        },
      };
    });
  });
  const data: VignettingNativeData = {
    fields: answered,
    method: {
      name: LV_FLUX_METHOD,
      params: {
        bundleGrid: coarseCells,
        fineGrid: fineCells,
        convergenceOnAxis: CONVERGENCE_BANDS.onAxis,
        convergenceOffAxis: CONVERGENCE_BANDS.offAxis,
        stopSemiDiameterMm: exported.conditions.stopSemiDiameter,
        transmission: "share of the lattice's samples of the real stop that reach the image",
        illumination: "flux of the lit cells into the image in the optical direction cosines of the image space",
      },
    },
    notes: [
      "the lattice is LensVisualizer's own aimed lattice on the real stop of each field (its MTF's), traced by LensVisualizer",
      "the relative illumination is the projected solid angle of the exit pupil seen from the image point, weighted by each ray's transmission: no law of the field angle is applied",
      ...notes,
    ],
  };
  return { data, counts: { fields: answered.length } };
}

const ANSWERED: readonly LvAnswered[] = [
  {
    quantity: vignettingNativeQuantity,
    method: LV_FLUX_METHOD,
    answer: (api, model, spec, engineOptions) => answerLvFlux(api, model, spec as VignettingNativeSpec, engineOptions),
  },
];

const IDENTITY: LvBackedIdentity = {
  id: LV_FLUX_ENGINE_ID,
  version: LV_FLUX_ENGINE_VERSION,
  module: LV_FLUX_ENGINE_MODULE,
};

/**
 * The engine `flux` on a bound LensVisualizer checkout, as a protocol handler: `vignetting.native` by `answerLvFlux`,
 * and for a case everything the engine `lv` does (`createLvBackedEngine`): a case that is no longer what
 * LensVisualizer gives is "stale-case", and a case from any other source "unsupported".
 */
export function createLvFluxEngineOn(binding: LvBinding): ProtocolHandler {
  return createLvBackedEngine(binding, IDENTITY, ANSWERED);
}

/**
 * The engine `flux` on the LensVisualizer checkout at `lvPath`. Rejects with an `EngineUnavailableError` when
 * LensVisualizer cannot be bound, as the engine `lv` does.
 */
export async function createLvFluxEngine(lvPath: string | null): Promise<ProtocolHandler> {
  return createLvFluxEngineOn(await bindLvFor(LV_FLUX_ENGINE_ID, lvPath));
}
