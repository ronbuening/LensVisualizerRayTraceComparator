import { dirname, join } from "node:path";
import { parentPort, workerData } from "node:worker_threads";
import { readRunCase } from "../core/manifest.ts";
import type { RunManifest } from "../core/manifest.ts";
import { createResultStore, STORE_DIRECTORY } from "../core/resultStore.ts";
import { profileSync } from "../core/profile.ts";
import { UsageError } from "../core/usageError.ts";
import { compareManifest } from "./manifest.ts";

const { directory, policy, manifest, options } = workerData;
const full = manifest as RunManifest;
const byRun = new Map(full.runs.map((run) => [run.name, full.jobs.filter((job) => job.run === run.name)]));
const store = createResultStore(join(dirname(directory), STORE_DIRECTORY));
parentPort!.on("message", (index: number | null) => {
  if (index === null) {
    parentPort!.close();
    return;
  }
  try {
    const run = full.runs[index];
    const file = profileSync("compare.run", () =>
      compareManifest({
        manifest: { ...full, runs: [run], jobs: byRun.get(run.name)! },
        store,
        policy,
        ...options,
        cases: (id) => readRunCase(directory, id),
      }),
    );
    parentPort!.postMessage({ comparisons: file.comparisons });
  } catch (error) {
    parentPort!.postMessage({
      error: error instanceof Error ? error.message : String(error),
      usage: error instanceof UsageError,
    });
  }
});
