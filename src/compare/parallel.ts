// Runs are independent; keep each run's spans, follow-ups and blocking ledger together in one worker.
import { Worker } from "node:worker_threads";
import type { ComparisonMode, ComparisonSet } from "../contract/comparison.ts";
import type { Policy } from "../contract/policy.ts";
import { readRunManifest } from "../core/manifest.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { orderedMap } from "../core/orderedMap.ts";
import { UsageError } from "../core/usageError.ts";
import { CONTRACT_VERSION } from "../contract/version.ts";
import type { ComparisonFile } from "./comparisonFile.ts";

export interface ParallelCompareOptions {
  readonly reference?: string;
  readonly modes?: readonly ComparisonMode[];
}
export async function compareDirectoryParallel(
  directory: string,
  policy: Policy,
  jobs: number,
  options: ParallelCompareOptions,
): Promise<ComparisonFile> {
  if (!Number.isSafeInteger(jobs) || jobs < 1) throw new UsageError("--jobs must be a positive integer");
  const manifest = readRunManifest(directory);
  if (options.reference !== undefined && !manifest.engines.some((engine) => engine.id === options.reference)) {
    throw new UsageError(
      `unknown engine "${options.reference}": the run has ${manifest.engines.map((engine) => engine.id).join(", ") || "no engine"}`,
    );
  }
  const workers: Worker[] = [];
  const results: (readonly ComparisonSet[])[] = new Array(manifest.runs.length);
  let next = 0;
  try {
    await orderedMap(Array.from({ length: Math.min(jobs, manifest.runs.length) }), jobs, async () => {
      const worker = new Worker(new URL("./compareWorker.ts", import.meta.url), {
        execArgv: [],
        workerData: { directory, policy, manifest, options },
      });
      workers.push(worker);
      let pending: { resolve(value: readonly ComparisonSet[]): void; reject(error: Error): void } | undefined;
      let gone: Error | undefined;
      const fail = (error: Error): void => {
        gone = error;
        pending?.reject(error);
        pending = undefined;
      };
      worker.on("error", fail);
      worker.on("exit", () => fail(new Error("comparison worker exited")));
      worker.on("message", (reply: { comparisons?: readonly ComparisonSet[]; error?: string; usage?: boolean }) => {
        if (reply.error !== undefined)
          pending?.reject(reply.usage ? new UsageError(reply.error) : new Error(reply.error));
        else pending?.resolve(reply.comparisons!);
        pending = undefined;
      });
      while (next < manifest.runs.length) {
        const index = next++;
        if (gone) throw gone;
        results[index] = await new Promise((resolve, reject) => {
          pending = { resolve, reject };
          worker.postMessage(index);
        });
      }
      await new Promise<void>((resolve) => {
        worker.once("exit", () => resolve());
        worker.postMessage(null);
      });
    });
  } finally {
    await Promise.all(workers.map((worker) => worker.terminate()));
  }
  return {
    contract: CONTRACT_VERSION,
    kind: "comparison-file",
    suite: manifest.suite.name,
    manifest: hashCanonical(manifest),
    policy: hashCanonical(policy),
    comparisons: results.flat(),
  };
}
