// The engine `replay`: the comparator's own estimators on a replay of LensVisualizer's sampling. It answers
// `mtf.native` for the request the engine `lv` would make for the same case and spec, and where `lv` hands that
// request to LensVisualizer's `computeMtf`, this engine replays LensVisualizer's sampling of it (`replayLvMtf`) and
// puts the comparator's geometric estimator on the rays. Rung R4f holds the two answers to each other.
//
// It is no independent engine: its rays are LensVisualizer's, launched and traced by LensVisualizer. What is its
// own is which bundles it asks for, what it sums and how, which is the comparator's understanding of
// LensVisualizer's MTF and is what its adapter revision covers. Its fingerprint is LensVisualizer's.
import type { JsonObject } from "../../contract/json.ts";
import type { ProtocolHandler } from "../../contract/protocol.ts";
import { MTF_DESIGN_PLANE } from "../../contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../contract/quantities/mtfNative.ts";
import type { UnsupportedItem } from "../../contract/result.ts";
import { mtfNativeQuantity } from "../../quantities/mtfNative.ts";
import type { LvBinding } from "./binding.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { bindLvFor, createLvBackedEngine } from "./engine.ts";
import type { LvAnswer, LvAnswered, LvBackedIdentity } from "./engine.ts";
import { fieldNotes, fieldOf, lvMtfRequest, mtfCounts } from "./mtf.ts";
import type { LvMtfRequestApi } from "./mtf.ts";
import { replayLvMtf } from "./replay.ts";
import type { LvReplay, LvReplayApi } from "./replay.ts";
import type { LvMtfOptions } from "./types.ts";

/** The id of the engine that is the comparator's estimators on LensVisualizer's own sampling. */
export const LV_REPLAY_ENGINE_ID = "replay";

/** The version of the engine, for people. Results are keyed by its fingerprint and its adapter revision. */
export const LV_REPLAY_ENGINE_VERSION = "1";

/** The module of the engine, relative to the comparator's sources: where its adapter revision starts from. */
export const LV_REPLAY_ENGINE_MODULE = "engines/lv/replayEngine.ts";

/**
 * The `item` of each "unsupported" answer that is this engine's own, beside those of `lv`, which it gives for the
 * same requests (`lvMtfRequest`):
 *
 * - `diffraction` (`option`): the method "diffraction": the replay has the geometric estimator only;
 * - `profile` (`option`): any profile: a replay is asked by a spec, and a profile's method is not geometric.
 */
export const LV_REPLAY_UNSUPPORTED = Object.freeze({ diffraction: "method.diffraction", profile: "profile" } as const);

/** The LensVisualizer exports the engine answers with. */
export type LvReplayEngineApi = LvMtfRequestApi & LvReplayApi;

/**
 * A replay as `mtf.native` data, in the form the engine `lv` gives LensVisualizer's own result (`mtfData` of
 * src/engines/lv/mtf.ts), so that the two answers can be held to each other member by member.
 *
 * - `fields`: one per requested fraction (`fieldOf`). A curve is the estimator's modulus, and a value the rounding
 *   of the modulus left above 1 is 1, which is the range the contract gives an MTF. `sampling` holds what
 *   LensVisualizer's result holds, under the same names (`gridSize`, the three ray counts summed over the lines,
 *   `unknownFluxFraction`, `maxDelta`, `convergedThroughLpMm`), and beside them `gridSizesTraced`, how many grid
 *   sizes of the ladder were traced for the field, and `footprintExpansions`, how often its footprint was widened.
 * - `method`: the name is `replay-geometric`; `params` hold the request as `lv` states it, and the `ladder`.
 * - `focus`: the plane of the replay, as `lv` states LensVisualizer's.
 * - `aperture`: empty. The traced aperture is LensVisualizer's own diagnostic and no part of its sampling.
 * - `lines`: the lines of LensVisualizer's support record for the request.
 */
export function replayData(
  options: LvMtfOptions,
  fractions: readonly number[],
  replay: LvReplay,
  atBestAxial: boolean,
): MtfNativeData {
  const frequencies = replay.frequenciesPerMm.length;
  if (replay.fields.length !== fractions.length) {
    throw new Error(`LensVisualizer states ${replay.fields.length} fields for the ${fractions.length} of the request`);
  }
  const geometry =
    replay.geometry === null
      ? {}
      : { referenceHeightMm: replay.geometry.referenceHeightMm, fieldBasis: replay.geometry.basis };
  const fields = replay.fields.map(({ field, gridSizes, expansions }, index) => {
    const clipped = (curve: readonly number[]): number[] => curve.map((value) => Math.min(1, value));
    const stated = fieldOf(
      { ...field, sagittal: clipped(field.sagittal), tangential: clipped(field.tangential) },
      fractions[index],
      frequencies,
    );
    return {
      ...stated,
      sampling: { ...stated.sampling, gridSizesTraced: gridSizes.length, footprintExpansions: expansions },
    };
  });
  return {
    fields,
    method: {
      name: "replay-geometric",
      params: {
        spectrum: options.spectrum,
        focus: options.focus as string,
        maxGridSize: options.maxGridSize as number,
        pupilSemiDiameterMm: options.pupilSemiDiameterMm,
        stopSemiDiameterMm: options.stopSemiDiameterMm,
        ladder: [...replay.ladder],
        ...geometry,
      },
    },
    focus:
      replay.focus === null || atBestAxial
        ? { mode: MTF_DESIGN_PLANE, appliedShiftMm: 0 }
        : { mode: replay.focus.mode, appliedShiftMm: replay.focus.appliedShiftMm },
    aperture: {},
    lines: replay.support.spectralLines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
    notes: replay.fields.flatMap(({ field }) => fieldNotes(field)),
  };
}

/**
 * Answers an `mtf.native` spec about the state of a case's model with a replay of LensVisualizer's sampling.
 *
 * The method "diffraction" and any profile are "unsupported" (`LV_REPLAY_UNSUPPORTED`). Everything else is decided
 * as the engine `lv` decides it, by the same function (`lvMtfRequest`): what LensVisualizer's MTF does not compute
 * is "unsupported" here with the same item, and the request that is replayed is the very one `lv` hands to
 * `computeMtf`, a case at LensVisualizer's own best axial focus included. A request LensVisualizer's gate then
 * refuses is "unsupported" with the gate's reason.
 *
 * Throws when the replay is of another plane than the case's, or of other frequencies than the spec's: the
 * comparator then no longer reads LensVisualizer correctly.
 */
export function answerLvReplay(
  api: LvReplayEngineApi,
  model: LvCaseModel,
  spec: MtfNativeSpec,
  engineOptions: JsonObject = {},
): LvAnswer {
  const refuse = (item: string, message: string): LvAnswer => {
    const unsupported: UnsupportedItem = { code: "option", item, message };
    return { unsupported: [unsupported] };
  };
  if (spec.profile !== undefined) {
    return refuse(
      LV_REPLAY_UNSUPPORTED.profile,
      `the engine ${LV_REPLAY_ENGINE_ID} has no profile: it is asked by a spec`,
    );
  }
  if (spec.method !== "geometric") {
    const message = `the engine ${LV_REPLAY_ENGINE_ID} has the comparator's geometric estimator and no other`;
    return refuse(LV_REPLAY_UNSUPPORTED.diffraction, message);
  }
  const request = lvMtfRequest(api, model, spec, engineOptions);
  if ("refused" in request) return request.refused;
  const { state, exported } = model;
  const replay = replayLvMtf(api, state, request.options);
  if (!replay.support.available) {
    const reason = replay.support.reason ?? "unavailable";
    return { unsupported: [{ code: "feature", item: reason, message: replay.support.message }] };
  }
  const { frequenciesPerMm } = spec;
  const sameFrequencies =
    replay.frequenciesPerMm.length === frequenciesPerMm.length &&
    replay.frequenciesPerMm.every((frequency, index) => frequency === frequenciesPerMm[index]);
  if (!sameFrequencies) throw new Error("LensVisualizer states other frequencies for the request than the spec's");
  if (request.atBestAxial && replay.imagePlaneZ !== exported.conditions.imageZ) {
    throw new Error(
      `the replay is of the plane z = ${replay.imagePlaneZ} mm, and the image plane of the case, which is ` +
        `LensVisualizer's best axial focus, lies at ${exported.conditions.imageZ} mm`,
    );
  }
  const data = replayData(request.options, spec.fields.values, replay, request.atBestAxial);
  return { data, counts: mtfCounts(data, spec) };
}

const ANSWERED: readonly LvAnswered[] = [
  {
    quantity: mtfNativeQuantity,
    method: "replay-geometric",
    answer: (api, model, spec, engineOptions) => answerLvReplay(api, model, spec as MtfNativeSpec, engineOptions),
  },
];

const IDENTITY: LvBackedIdentity = {
  id: LV_REPLAY_ENGINE_ID,
  version: LV_REPLAY_ENGINE_VERSION,
  module: LV_REPLAY_ENGINE_MODULE,
};

/**
 * The engine `replay` on a bound LensVisualizer checkout, as a protocol handler: `mtf.native` by
 * `answerLvReplay`, and for a case everything the engine `lv` does (`createLvBackedEngine`): a case that is no
 * longer what LensVisualizer gives is "stale-case", and a case from any other source "unsupported".
 */
export function createLvReplayEngineOn(binding: LvBinding): ProtocolHandler {
  return createLvBackedEngine(binding, IDENTITY, ANSWERED);
}

/**
 * The engine `replay` on the LensVisualizer checkout at `lvPath`. Rejects with an `EngineUnavailableError` when
 * LensVisualizer cannot be bound, as the engine `lv` does.
 */
export async function createLvReplayEngine(lvPath: string | null): Promise<ProtocolHandler> {
  return createLvReplayEngineOn(await bindLvFor(LV_REPLAY_ENGINE_ID, lvPath));
}
