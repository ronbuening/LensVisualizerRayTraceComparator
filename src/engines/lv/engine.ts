// The engine `lv`: LensVisualizer answering the comparator's quantities from its own prepared state and its own
// kernels. It is the second role LensVisualizer has here; the first, the case source, writes the cases. The engine
// reads nothing of a case's surfaces: it rebuilds the state the case was exported from and answers from that, so
// what it says is what LensVisualizer does. It is built in: `--engines lv` names it under any configuration root.
import type { OpticalCase } from "../../contract/case.ts";
import { engineStamp } from "../../contract/engine.ts";
import type { EngineDescriptor } from "../../contract/engine.ts";
import { FEATURE_FLAGS } from "../../contract/features.ts";
import type { JsonObject } from "../../contract/json.ts";
import type { ProtocolHandler } from "../../contract/protocol.ts";
import type { RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { DEFAULT_SAG_FRACTIONS } from "../../contract/quantities/systemDescribe.ts";
import type { SystemDescribeSpec } from "../../contract/quantities/systemDescribe.ts";
import type { QuantityRequest } from "../../contract/request.ts";
import { makeResult } from "../../contract/result.ts";
import type { ErrorInfo, ResultEnvelope, UnsupportedItem } from "../../contract/result.ts";
import { formatIssues } from "../../contract/schemas.ts";
import { CONTRACT_VERSION } from "../../contract/version.ts";
import { negotiate } from "../../core/negotiate.ts";
import type { QuantityModule } from "../../quantities/module.ts";
import { paraxialFirstOrderQuantity } from "../../quantities/paraxialFirstOrder.ts";
import { raysTraceQuantity } from "../../quantities/raysTrace.ts";
import { systemDescribeQuantity } from "../../quantities/systemDescribe.ts";
import { EngineUnavailableError } from "../adapter.ts";
import { adapterRevision } from "../adapterRevision.ts";
import { createProtocolHandler } from "../protocolHandler.ts";
import { loadLvBinding } from "./binding.ts";
import type { LvBinding } from "./binding.ts";
import { STALE_CASE, rebuildCase } from "./caseModel.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { describeLvSystem } from "./describe.ts";
import { LvBindingError } from "./errors.ts";
import type { LvFingerprint } from "./fingerprint.ts";
import { answerLvFirstOrder } from "./firstOrder.ts";
import { createLensBuilder } from "./lensBuilder.ts";
import { answerLvRays } from "./rays.ts";
import type { LvApi } from "./types.ts";

/** The id of the engine that is LensVisualizer. */
export const LV_ENGINE_ID = "lv";

/**
 * The version of the comparator's own part of the engine, for people. Results are keyed by the fingerprint, which
 * is LensVisualizer's, never by this.
 */
export const LV_ENGINE_VERSION = "1";

/** The module of the engine `lv`, relative to the comparator's sources: where its adapter revision starts from. */
export const LV_ENGINE_MODULE = "engines/lv/engine.ts";

/**
 * What a quantity makes of a model: its data, with the counts it has to report beside the model's; what keeps the
 * model from having any; or why the spec cannot be answered about this case.
 */
type Answer =
  | { readonly data: JsonObject; readonly counts?: { readonly [name: string]: number } }
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly error: ErrorInfo };

/** One quantity the engine answers: how its spec is checked, what its method is called, and the computation. */
interface Answered {
  readonly quantity: QuantityModule;
  readonly method: string;
  answer(api: LvApi, model: LvCaseModel, spec: JsonObject): Answer;
}

const ANSWERED: readonly Answered[] = [
  {
    quantity: systemDescribeQuantity,
    method: "prepared-state-echo",
    answer: (api, model, spec) => {
      const { sagFractions = DEFAULT_SAG_FRACTIONS } = spec as SystemDescribeSpec;
      return { data: describeLvSystem(api, model, sagFractions) };
    },
  },
  {
    quantity: paraxialFirstOrderQuantity,
    method: "paraxial-kernel",
    answer: (api, model) => {
      const answer = answerLvFirstOrder(api, model);
      return answer.supported ? { data: answer.data } : { unsupported: answer.items };
    },
  },
  {
    quantity: raysTraceQuantity,
    method: "sequential-trace",
    answer: (api, model, spec) => answerLvRays(api, model, spec as RaysTraceSpec),
  },
];

/**
 * What the engine answers to `hello`, for LensVisualizer with the given fingerprint. Its `fingerprint` is the hash
 * of the closure of LensVisualizer's engine files, in which no lens file takes part: an edit to LensVisualizer's
 * code retires what the store holds of it, and an edit to a lens does not. Its `adapterRevision` is the hash of the
 * comparator's own code behind it (`adapterRevision` of `LV_ENGINE_MODULE`): an edit to how the engine asks
 * LensVisualizer, or to a kernel it shares, retires the same results and leaves the fingerprint LensVisualizer's.
 * `details` carry the checkout's commit and dirty flag, null outside git, and the number of engine files. It
 * declares every feature of a case and no limit: it answers for whatever LensVisualizer's own exporter wrote. It is
 * deterministic.
 */
export function lvDescriptor(fingerprint: LvFingerprint): EngineDescriptor {
  const { engineClosureHash, engineFileCount, commit, dirty } = fingerprint;
  return {
    contract: { min: CONTRACT_VERSION, max: CONTRACT_VERSION },
    identity: {
      id: LV_ENGINE_ID,
      version: LV_ENGINE_VERSION,
      fingerprint: engineClosureHash,
      adapterRevision: adapterRevision(LV_ENGINE_MODULE).revision,
      details: { commit, dirty, engineFileCount },
    },
    capabilities: {
      features: { supported: [...FEATURE_FLAGS], limits: {} },
      quantities: Object.fromEntries(ANSWERED.map(({ quantity }) => [quantity.id, { version: quantity.version }])),
      deterministic: true,
      maxConcurrency: 1,
    },
  };
}

/**
 * The engine `lv` on a bound LensVisualizer checkout, as a protocol handler.
 *
 * - `hello`: `lvDescriptor` of the binding's fingerprint as it is when the engine is made.
 * - `run`, for a case that came from a LensVisualizer lens: the state is rebuilt and held to the case
 *   (`rebuildCase`), and the quantity answered from it: `system.describe` by `describeLvSystem`,
 *   `paraxial.first-order` by `answerLvFirstOrder`, `rays.trace` by `answerLvRays`. A case that is no longer what
 *   LensVisualizer gives is a result of status "error" with the code `stale-case`, whose message names what
 *   changed.
 * - `run`, for a case from any other source: a result of status "unsupported" with one item of code `case-source`
 *   that names the kind of source. LensVisualizer has no state for such a case, and building one from the case's
 *   surfaces would be an import, which is no part of what is compared.
 * - A request the descriptor rules out (another quantity, a contract version it does not speak) is "unsupported"
 *   with the items negotiation gives, and a spec that is not the quantity's, or that names a line the case does not
 *   have, is an "error" with the code `bad-spec`.
 *
 * The engine keeps the lenses it has built and nothing else between messages, and it never closes the binding,
 * which the case source of the same run shares. An exception while it computes becomes a result of status "error"
 * with the code `engine-failure`, as for every engine behind `createProtocolHandler`.
 */
export function createLvEngineOn(binding: LvBinding): ProtocolHandler {
  const descriptor = lvDescriptor(binding.fingerprint());
  const engine = engineStamp(descriptor.identity);
  const build = createLensBuilder(binding);

  const run = async (request: QuantityRequest, opticalCase: OpticalCase): Promise<ResultEnvelope> => {
    const refused = negotiate(opticalCase, request, descriptor);
    if (refused.length > 0) return makeResult(request, engine, { status: "unsupported", unsupported: refused });
    const { source } = opticalCase.provenance;
    if (source.kind !== "lv-lens") {
      const message =
        `the engine ${LV_ENGINE_ID} answers from LensVisualizer's own state of a lens, ` +
        `and this case came from a ${source.kind}, not from a LensVisualizer lens`;
      const item: UnsupportedItem = { code: "case-source", item: source.kind, message };
      return makeResult(request, engine, { status: "unsupported", unsupported: [item] });
    }
    // Negotiation has passed, so the quantity is one the engine answers.
    const answered = ANSWERED.find(({ quantity }) => quantity.id === request.quantity) as Answered;
    const issues = answered.quantity.validateSpec(request.spec);
    if (issues.length > 0) {
      const message = `spec is not a ${request.quantity} spec: ${formatIssues(issues)}`;
      return makeResult(request, engine, { status: "error", error: { code: "bad-spec", message } });
    }

    const rebuilt = await rebuildCase(binding, build, opticalCase);
    if (!rebuilt.ok) {
      const message = `the case of lens ${source.lensKey} is stale: ${rebuilt.reason}`;
      return makeResult(request, engine, { status: "error", error: { code: STALE_CASE, message } });
    }
    const { model } = rebuilt;
    const answer = answered.answer(binding.api, model, request.spec);
    if ("unsupported" in answer) {
      return makeResult(request, engine, { status: "unsupported", unsupported: answer.unsupported });
    }
    if ("error" in answer) return makeResult(request, engine, { status: "error", error: answer.error });
    const counts = {
      surfaces: model.state.surfaces.length,
      lines: model.exported.conditions.lines.length,
      ...answer.counts,
    };
    return makeResult(request, engine, {
      status: "ok",
      method: { name: answered.method, params: {} },
      data: answer.data,
      diagnostics: { warnings: [], counts },
    });
  };
  return createProtocolHandler({ descriptor, run });
}

/**
 * The engine `lv` on the LensVisualizer checkout at `lvPath`, which is loaded now. Rejects with an
 * `EngineUnavailableError` when LensVisualizer cannot be bound: `not-configured` when no `lvPath` is set, and
 * `load-failed` for a path that is no checkout or a checkout that cannot be loaded, with the binding's own reason.
 * Nothing else is affected: every other engine of a run carries on.
 */
export async function createLvEngine(lvPath: string | null): Promise<ProtocolHandler> {
  let binding: LvBinding;
  try {
    binding = await loadLvBinding(lvPath);
  } catch (error) {
    if (!(error instanceof LvBindingError)) throw error;
    if (error.code === "not-configured") {
      throw new EngineUnavailableError(LV_ENGINE_ID, "not-configured", error.message, { cause: error });
    }
    const detail = `LensVisualizer cannot be loaded (${error.code}): ${error.message}`;
    throw new EngineUnavailableError(LV_ENGINE_ID, "load-failed", detail, { cause: error });
  }
  return createLvEngineOn(binding);
}
