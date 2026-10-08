// A test-only engine: the reference engine under another id, asked about a case that was changed on its way to
// it. It stands for an engine that built another system than the one it was given: what rung R0 exists to catch.
//
// Configured as an in-process engine:
//
//   "ref-bent": { "transport": "in-process", "module": "<this file>",
//                 "options": { "id": "ref-bent", "edits": [{ "pointer": "/system/surfaces/2/shape/radius",
//                                                             "scale": 1.000001 }] } }
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { EngineDescriptor } from "../../../src/contract/engine.ts";
import type { ProtocolHandler, ProtocolResponse } from "../../../src/contract/protocol.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import { hashCanonical } from "../../../src/core/numeric/hash.ts";
import { decodeNdArray, encodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";

/** One change to a case: the number at a JSON Pointer into the case is multiplied by `scale`. */
export interface CaseEdit {
  readonly pointer: string;
  readonly scale: number;
}

/** The options of a bent engine. Without an edit it is the reference engine under another id. */
export interface BentOptions {
  /** The engine id its descriptor and results carry. */
  readonly id: string;
  /** The numbers of the case to scale before the reference engine sees it. */
  readonly edits?: readonly CaseEdit[];
  /** One element of the index table to scale: the index after `surface` at `line`. */
  readonly index?: { readonly line: number; readonly surface: number; readonly scale: number };
}

/**
 * A copy of a case with the edits applied. An edit whose pointer names no number of the case changes nothing, so
 * one engine can be wrong about a surface that only some cases have. The case's ids are left as they are: an
 * engine echoes what it is given.
 */
export function bentCase(opticalCase: OpticalCase, options: BentOptions): OpticalCase {
  const bent = structuredClone(opticalCase) as unknown as Record<string, unknown>;
  for (const { pointer, scale } of options.edits ?? []) {
    const tokens = pointer.slice(1).split("/");
    const last = tokens.pop() as string;
    let parent: Record<string, unknown> | undefined = bent;
    for (const token of tokens) parent = parent?.[token] as Record<string, unknown> | undefined;
    if (typeof parent?.[last] === "number") parent[last] = parent[last] * scale;
  }
  if (options.index !== undefined) {
    const { line, surface, scale } = options.index;
    const conditions = bent.conditions as { indexAfterSurface: OpticalCase["conditions"]["indexAfterSurface"] };
    const table = decodeNdArray(conditions.indexAfterSurface);
    table.values[line * table.shape[1] + surface] *= scale;
    conditions.indexAfterSurface = encodeNdArray(table.values, table.shape);
  }
  return bent as unknown as OpticalCase;
}

/**
 * Creates the engine: `createRefEngine()`, with every `run` about the bent case and every reply under this
 * engine's id and a fingerprint of its own, derived from the reference engine's and the options.
 */
export function createEngine(options: unknown): ProtocolHandler {
  const bend = options as BentOptions;
  const ref = createRefEngine();
  let fingerprint: string | undefined;
  return async (message) => {
    const asked =
      message.method === "run"
        ? { ...message, params: { ...message.params, case: bentCase(message.params.case, bend) } }
        : message;
    const reply: ProtocolResponse = structuredClone(await ref(asked));
    if (!reply.ok) return reply;
    const result = reply.result as { identity?: EngineDescriptor["identity"]; engine?: ResultEnvelope["engine"] };
    const who = (result.identity ?? result.engine) as { id: string; fingerprint: string } | undefined;
    if (who !== undefined) {
      fingerprint ??= hashCanonical({ of: who.fingerprint, bend });
      who.id = bend.id;
      who.fingerprint = fingerprint;
    }
    return reply;
  };
}
