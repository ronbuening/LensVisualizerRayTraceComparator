// The engine descriptor: mirrors contract/schema/v1/engine-descriptor.schema.json.
import type { EngineDetails, ResultEnvelope } from "./result.ts";

/** Who an engine is. Results are keyed by `fingerprint`, a content hash of the engine's sources, never by `version`. */
export interface EngineIdentity {
  readonly id: string;
  readonly version: string;
  readonly fingerprint: string;
  readonly details: EngineDetails;
}

/** What an engine can do. */
export interface EngineCapabilities {
  readonly features: {
    /** Feature flags of an optical case the engine can handle. */
    readonly supported: readonly string[];
    /** The largest value the engine handles, per numeric limit; a limit left out is unbounded. */
    readonly limits: { readonly [limit: string]: number };
  };
  /** The quantities the engine answers, keyed by quantity id, each with the version of its definition it implements. */
  readonly quantities: { readonly [quantityId: string]: { readonly version: number } };
  /** Whether equal requests give bit-equal results. */
  readonly deterministic: boolean;
  /** How many requests the engine can work on at once; at least 1. */
  readonly maxConcurrency: number;
}

/** What an engine says about itself in answer to `hello`. */
export interface EngineDescriptor {
  /** The range of contract versions the engine speaks, both ends included. */
  readonly contract: { readonly min: string; readonly max: string };
  readonly identity: EngineIdentity;
  readonly capabilities: EngineCapabilities;
}

/**
 * What an engine id looks like: a lowercase letter followed by lowercase letters, digits and `-`. The same pattern
 * as `engineId` in common.schema.json, kept here as well so that an id can be judged without loading the schemas.
 */
export const ENGINE_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

/** Whether a value is an engine id: a string that matches `ENGINE_ID_PATTERN`. */
export function isEngineId(value: unknown): value is string {
  return typeof value === "string" && ENGINE_ID_PATTERN.test(value);
}

/**
 * The `engine` member of every result an engine with this identity gives: its id, fingerprint and details.
 * `version` is for people and is not stamped on results.
 */
export function engineStamp(identity: EngineIdentity): ResultEnvelope["engine"] {
  return { id: identity.id, fingerprint: identity.fingerprint, details: identity.details };
}
