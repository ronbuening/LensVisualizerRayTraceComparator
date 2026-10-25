import { readFileSync } from "node:fs";
import { availableParallelism } from "node:os";

import { expandSuite } from "../contract/runSpec.ts";
import { defaultMemoryBudgetGiB, GIB, jobEstimateGiB, JOB_GIB } from "../core/memoryBudget.ts";
import { UsageError } from "../core/usageError.ts";

export function memoryBudgetOption(value: string | undefined): number {
  if (value === undefined) return defaultMemoryBudgetGiB();
  const budget = Number(value);
  if (!/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/.test(value) || !Number.isFinite(budget * GIB) || budget <= 0) {
    throw new UsageError(`--memory-budget must be a positive finite number of GiB, got ${JSON.stringify(value)}`);
  }
  return budget;
}

/**
 * Both CPUs and the declared replica memory must fit. A serial run (one job) starts no pool and is always allowed,
 * so the ceiling is never below 1, whatever the budget.
 */
export function maxJobs(
  budgetGiB = defaultMemoryBudgetGiB(),
  perJobGiB = JOB_GIB,
  cpus = availableParallelism(),
): number {
  return Math.max(1, Math.min(cpus, Math.floor(budgetGiB / perJobGiB)));
}

export function assertJobs(jobs: number, budgetGiB = defaultMemoryBudgetGiB(), perJobGiB = JOB_GIB): void {
  if (jobs === 1) return;
  const most = maxJobs(budgetGiB, perJobGiB);
  if (jobs > most) {
    throw new UsageError(
      `--jobs ${jobs}: at most ${most} (available parallelism ${availableParallelism()}, ` +
        `memory budget ${budgetGiB} GiB / estimate ${perJobGiB} GiB per job); ` +
        "lower --jobs or set --memory-budget <GiB> to an appropriate budget",
    );
  }
}

/** Shared strict CLI rule; scheduling options never become part of a stored identity. */
export function jobsOption(
  value: string | undefined,
  budgetGiB = defaultMemoryBudgetGiB(),
  perJobGiB = JOB_GIB,
): number {
  const jobs = value === undefined ? 1 : Number(value);
  if (value !== undefined && (!/^[1-9][0-9]*$/.test(value) || !Number.isSafeInteger(jobs))) {
    throw new UsageError(`--jobs must be a positive integer, got ${JSON.stringify(value)}`);
  }
  assertJobs(jobs, budgetGiB, perJobGiB);
  return jobs;
}

/** Inspect written selections before starting workers; the normal suite loader diagnoses invalid files. */
export function suiteJobEstimate(file: string, rungs?: readonly string[]): number {
  if (rungs !== undefined) return jobEstimateGiB(rungs);
  try {
    return jobEstimateGiB(expandSuite(JSON.parse(readFileSync(file, "utf8"))).flatMap((run) => run.rungs ?? []));
  } catch {
    return JOB_GIB;
  }
}
