// The reference engine `ref`: the comparator's own small engine. It is written from the optics alone, shares no
// code with LensVisualizer or optiland, and uses closed forms throughout, so that it can arbitrate between the two
// and answer for a case in tests that have neither. It is built in: `--engines ref` names it under any
// configuration root.
import type { OpticalCase } from "../../contract/case.ts";
import { engineStamp } from "../../contract/engine.ts";
import type { EngineDescriptor } from "../../contract/engine.ts";
import type { FeatureFlag } from "../../contract/features.ts";
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
import { adapterRevision } from "../adapterRevision.ts";
import { createProtocolHandler } from "../protocolHandler.ts";
import { describeSystem } from "./describe.ts";
import { refFingerprint } from "./fingerprint.ts";
import { answerFirstOrder } from "./firstOrder.ts";
import { buildRefSystem } from "./model.ts";
import type { RefSystem } from "./model.ts";
import { answerRays } from "./rays.ts";

/** The id of the reference engine. */
export const REF_ENGINE_ID = "ref";

/** The version of the reference engine, for people. Results are keyed by its fingerprint, never by this. */
export const REF_ENGINE_VERSION = "1";

/** The module of the reference engine, relative to the comparator's sources: where its adapter revision starts. */
export const REF_ENGINE_MODULE = "engines/ref/engine.ts";

/**
 * The feature flags of a case that the reference engine handles, which is every one the contract has: an annular
 * aperture, which its tracer clips by, several lines, a finite object, and every shape.
 */
export const REF_FEATURES: readonly FeatureFlag[] = Object.freeze([
  "aperture.annular",
  "lines.multiple",
  "object.finite",
  "surface.asphere.even",
  "surface.asphere.flat-base",
  "surface.asphere.odd",
  "surface.conic",
] as const);

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
  answer(system: RefSystem, spec: JsonObject): Answer;
}

const ANSWERED: readonly Answered[] = [
  {
    quantity: systemDescribeQuantity,
    method: "model-echo",
    answer: (system, spec) => {
      const { sagFractions = DEFAULT_SAG_FRACTIONS } = spec as SystemDescribeSpec;
      return { data: describeSystem(system, sagFractions) };
    },
  },
  {
    quantity: paraxialFirstOrderQuantity,
    method: "ray-transfer-matrix",
    answer: (system) => {
      const answer = answerFirstOrder(system);
      return answer.supported ? { data: answer.data } : { unsupported: answer.items };
    },
  },
  {
    quantity: raysTraceQuantity,
    method: "exact-sequential-trace",
    answer: (system, spec) => answerRays(system, spec as RaysTraceSpec),
  },
];

/**
 * What the reference engine answers to `hello`: its id, a fingerprint of its own source files (`refFingerprint`),
 * the adapter revision of everything of the comparator it runs on (`adapterRevision` of `REF_ENGINE_MODULE`: its
 * own files and the kernels it shares, such as the array codec), the features of `REF_FEATURES` without a limit of
 * any kind, and the quantities `system.describe`, `paraxial.first-order` and `rays.trace`. It is deterministic: its
 * arithmetic is IEEE 754 basic operations in a fixed order.
 */
export function refDescriptor(): EngineDescriptor {
  const { fingerprint, fileCount } = refFingerprint();
  return {
    contract: { min: CONTRACT_VERSION, max: CONTRACT_VERSION },
    identity: {
      id: REF_ENGINE_ID,
      version: REF_ENGINE_VERSION,
      fingerprint,
      adapterRevision: adapterRevision(REF_ENGINE_MODULE).revision,
      details: { sourceFiles: fileCount },
    },
    capabilities: {
      features: { supported: [...REF_FEATURES], limits: {} },
      quantities: Object.fromEntries(ANSWERED.map(({ quantity }) => [quantity.id, { version: quantity.version }])),
      deterministic: true,
      maxConcurrency: 1,
    },
  };
}

/**
 * Creates the reference engine as a protocol handler.
 *
 * - `hello`: `refDescriptor()`.
 * - `run` of `system.describe`: the model the engine builds from the case, read back (`describeSystem`).
 * - `run` of `paraxial.first-order`: the paraxial kernel on that model (`answerFirstOrder`); a system without
 *   first-order data is a result of status "unsupported" that says which kind it is.
 * - `run` of `rays.trace`: every ray of the request carried through that model by the engine's own sequential
 *   tracer (`answerRays`), exact to rounding.
 * - A request the engine's own descriptor rules out (another quantity, a contract version it does not speak) is a
 *   result of status "unsupported" with the items negotiation gives, so the engine never answers what it says it
 *   cannot. A spec that is not the quantity's, or that names a line the case does not have, is a result of status
 *   "error" with the code `bad-spec`.
 *
 * It keeps no state between messages. An exception while it computes becomes a result of status "error" with the
 * code `engine-failure`, as for every engine behind `createProtocolHandler`.
 */
export function createRefEngine(): ProtocolHandler {
  const descriptor = refDescriptor();
  const engine = engineStamp(descriptor.identity);

  const run = (request: QuantityRequest, opticalCase: OpticalCase): ResultEnvelope => {
    const refused = negotiate(opticalCase, request, descriptor);
    if (refused.length > 0) return makeResult(request, engine, { status: "unsupported", unsupported: refused });
    // Negotiation has passed, so the quantity is one the engine answers.
    const answered = ANSWERED.find(({ quantity }) => quantity.id === request.quantity) as Answered;
    const issues = answered.quantity.validateSpec(request.spec);
    if (issues.length > 0) {
      const message = `spec is not a ${request.quantity} spec: ${formatIssues(issues)}`;
      return makeResult(request, engine, { status: "error", error: { code: "bad-spec", message } });
    }

    const system = buildRefSystem(opticalCase);
    const answer = answered.answer(system, request.spec);
    if ("unsupported" in answer) {
      return makeResult(request, engine, { status: "unsupported", unsupported: answer.unsupported });
    }
    if ("error" in answer) return makeResult(request, engine, { status: "error", error: answer.error });
    const counts = { surfaces: system.surfaces.length, lines: system.indexAfter.length, ...answer.counts };
    return makeResult(request, engine, {
      status: "ok",
      method: { name: answered.method, params: {} },
      data: answer.data,
      diagnostics: { warnings: [], counts },
    });
  };
  return createProtocolHandler({ descriptor, run });
}
