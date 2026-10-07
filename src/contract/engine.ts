// The engine descriptor: mirrors contract/schema/v1/engine-descriptor.schema.json.
import type { EngineDetails } from "./result.ts";

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
  /** The quantities the engine answers, keyed by quantity id, each with the version of its implementation. */
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
