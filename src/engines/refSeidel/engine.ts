// The engine `ref-seidel`: the reference engine's model of a case and the comparator's own third-order sums of it
// (`seidel.ts`), written from the optics alone. It is an engine of its own, beside `ref`, so that the sums are in no
// file of `ref`'s fingerprint (src/engines/ref) or of the import closure of `ref`'s module, which the rays baselines
// hold: it imports `ref`'s model, paraxial kernel and fingerprint, and `ref` imports nothing of it. Its fingerprint is
// of both directories' sources, its adapter revision the import closure of this module.
import type { OpticalCase } from "../../contract/case.ts";
import { engineStamp } from "../../contract/engine.ts";
import type { EngineDescriptor } from "../../contract/engine.ts";
import type { FeatureFlag } from "../../contract/features.ts";
import type { JsonObject } from "../../contract/json.ts";
import type { ProtocolHandler } from "../../contract/protocol.ts";
import { SEIDEL_NATIVE } from "../../contract/quantities/seidelNative.ts";
import type { SeidelNativeSpec } from "../../contract/quantities/seidelNative.ts";
import type { QuantityRequest } from "../../contract/request.ts";
import { makeResult } from "../../contract/result.ts";
import type { ResultEnvelope } from "../../contract/result.ts";
import { formatIssues } from "../../contract/schemas.ts";
import { CONTRACT_VERSION, CONTRACT_VERSION_1_5 } from "../../contract/version.ts";
import { negotiate } from "../../core/negotiate.ts";
import { sha256Hex } from "../../core/numeric/hash.ts";
import { seidelNativeQuantity } from "../../quantities/seidelNative.ts";
import { adapterRevision } from "../adapterRevision.ts";
import { createProtocolHandler } from "../protocolHandler.ts";
import { REF_SOURCE_DIRECTORY, refFingerprint } from "../ref/fingerprint.ts";
import { buildRefSystem } from "../ref/model.ts";
import { answerSeidel } from "./seidel.ts";
import { fileURLToPath } from "node:url";

/** The id of the engine. */
export const REF_SEIDEL_ENGINE_ID = "ref-seidel";

/** The version of the engine, for people. Results are keyed by its fingerprint, never by this. */
export const REF_SEIDEL_ENGINE_VERSION = "1";

/** The module of the engine, relative to the comparator's sources: where its adapter revision starts. */
export const REF_SEIDEL_ENGINE_MODULE = "engines/refSeidel/engine.ts";

/** The directory of the engine's own sources: the one this file is in. */
export const REF_SEIDEL_SOURCE_DIRECTORY: string = fileURLToPath(new URL(".", import.meta.url));

/**
 * The feature flags of a case the engine answers about: those of a sequential system of refracting surfaces. A folded
 * path and a diffractive surface are not: their third-order sums are another construction.
 */
export const REF_SEIDEL_FEATURES: readonly FeatureFlag[] = Object.freeze([
  "aperture.annular",
  "aperture.unclipped",
  "lines.multiple",
  "object.finite",
  "surface.asphere.even",
  "surface.asphere.flat-base",
  "surface.asphere.odd",
  "surface.conic",
] as const);

/**
 * The engine's fingerprint: of the reference engine's sources, whose model and paraxial kernel it computes on, and of
 * its own, each hashed as `refFingerprint` hashes a directory.
 */
export function refSeidelFingerprint(): { readonly fingerprint: string; readonly fileCount: number } {
  const ref = refFingerprint(REF_SOURCE_DIRECTORY);
  const own = refFingerprint(REF_SEIDEL_SOURCE_DIRECTORY);
  return {
    fingerprint: sha256Hex(`${ref.fingerprint}\n${own.fingerprint}\n`),
    fileCount: ref.fileCount + own.fileCount,
  };
}

/** What the engine answers to `hello`: `seidel.native` at version 1, of the features above, deterministic. */
export function refSeidelDescriptor(): EngineDescriptor {
  const { fingerprint, fileCount } = refSeidelFingerprint();
  return {
    contract: { min: CONTRACT_VERSION, max: CONTRACT_VERSION_1_5 },
    identity: {
      id: REF_SEIDEL_ENGINE_ID,
      version: REF_SEIDEL_ENGINE_VERSION,
      fingerprint,
      adapterRevision: adapterRevision(REF_SEIDEL_ENGINE_MODULE).revision,
      details: { sourceFiles: fileCount },
    },
    capabilities: {
      features: { supported: [...REF_SEIDEL_FEATURES], limits: {} },
      quantities: { [SEIDEL_NATIVE]: { version: seidelNativeQuantity.version } },
      deterministic: true,
      maxConcurrency: 1,
    },
  };
}

/**
 * Creates the engine as a protocol handler. `run` of `seidel.native`: the sums of the reference engine's model
 * (`answerSeidel`). A request the descriptor rules out is unsupported with negotiation's items; a spec that is not the
 * quantity's is an error `bad-spec`; a line the case does not have and a term of power 1 or 3 are unsupported; a
 * system without the two rays is an answer `unavailable` that says why. It keeps no state between messages.
 */
export function createRefSeidelEngine(): ProtocolHandler {
  const descriptor = refSeidelDescriptor();
  const engine = engineStamp(descriptor.identity);
  const run = (request: QuantityRequest, opticalCase: OpticalCase): ResultEnvelope => {
    const refused = negotiate(opticalCase, request, descriptor);
    if (refused.length > 0) return makeResult(request, engine, { status: "unsupported", unsupported: refused });
    const issues = seidelNativeQuantity.validateSpec(request.spec);
    if (issues.length > 0) {
      const message = `spec is not a ${request.quantity} spec: ${formatIssues(issues)}`;
      return makeResult(request, engine, { status: "error", error: { code: "bad-spec", message } });
    }
    const answer = answerSeidel(buildRefSystem(opticalCase), request.spec as SeidelNativeSpec);
    if ("unsupported" in answer) {
      return makeResult(request, engine, { status: "unsupported", unsupported: answer.unsupported });
    }
    return makeResult(request, engine, {
      status: "ok",
      method: answer.data.method,
      data: answer.data as unknown as JsonObject,
      diagnostics: { warnings: [], counts: { surfaces: opticalCase.system.surfaces.length } },
    });
  };
  return createProtocolHandler({ descriptor, run });
}
