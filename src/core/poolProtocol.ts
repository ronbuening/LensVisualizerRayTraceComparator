// Private IPC messages. Advanced serialization preserves numeric bits (including -0) across Node processes.
import type { RunSpec } from "../contract/runSpec.ts";
import type { CaseResolution, LoadedRun, SourceAudit } from "./suite.ts";
import type { Plan, PlannedJob, JobSource } from "./orchestrator.ts";
import type { MtfRecipeResolution } from "./mtfRecipe.ts";
import type { RaySetResolution } from "../rays/raySets.ts";
import type { PoolInputs } from "./poolInputs.ts";
import type { EngineDescriptor } from "../contract/engine.ts";
import type { ResultEnvelope } from "../contract/result.ts";
import type { EngineUnavailableCode } from "../engines/adapter.ts";
import type { LoadedConfig } from "./config.ts";

export type WirePlan = Omit<Plan, "jobs"> & {
  readonly jobs: readonly (Omit<PlannedJob, "rung" | "quantity" | "opticalCase"> & {
    rung: string;
    quantity: string;
  })[];
};
export interface StoredAnswer {
  readonly result: Pick<ResultEnvelope, "status" | "unsupported" | "error">;
  readonly storeKey: string | null;
  readonly source: Exclude<JobSource, "unavailable">;
}
export type PoolRequest = { readonly id: number } & (
  | { readonly method: "init"; readonly loaded: Pick<LoadedConfig, "rootDir" | "config"> }
  | { readonly method: "describe"; readonly engine: string }
  | (PoolInputs & { readonly method: "run"; readonly engine: string })
  | {
      readonly method: "source";
      readonly kind: "lv" | "fixture";
      readonly action: "expand" | "resolve";
      readonly run: RunSpec;
    }
  | {
      readonly method: "plan";
      readonly inputsFile: string;
      readonly retainSpecsFor: readonly string[];
      readonly run: LoadedRun;
      readonly engines?: readonly string[];
      readonly rungs?: readonly string[];
    }
  | { readonly method: "audit" }
  | { readonly method: "warm"; readonly engines: readonly string[] }
  | (PoolInputs & {
      readonly method: "ask";
      readonly temporary: string;
      readonly descriptor: EngineDescriptor;
      readonly broken: boolean;
      readonly engine: string;
    })
  | { readonly method: "close" }
);

export type PoolReply = { readonly id: number } & (
  | {
      readonly ok: true;
      readonly value:
        | EngineDescriptor
        | ResultEnvelope
        | null
        | readonly RunSpec[]
        | CaseResolution
        | WirePlan
        | { readonly lv: SourceAudit | null }
        | MtfRecipeResolution
        | RaySetResolution
        | { readonly answer: StoredAnswer; readonly warnings: readonly string[] };
    }
  | { readonly ok: false; readonly message: string; readonly code?: EngineUnavailableCode }
);

export interface PoolMemoryReport {
  readonly type: "memory";
  readonly rssBytes: number;
}
