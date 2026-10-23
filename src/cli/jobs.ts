import { availableParallelism } from "node:os";

import { UsageError } from "../core/usageError.ts";

/**
 * The most jobs a command takes on this machine: its available parallelism, and never fewer than 4. Each job is a
 * Node process with its own engine replicas (about 2 GiB with optiland, `docs/REFERENCE.md`), so jobs beyond the
 * CPUs add memory and no speed.
 */
export function maxJobs(): number {
  return Math.max(4, availableParallelism());
}

/** Shared strict CLI rule; explicit concurrency never becomes part of a stored identity. */
export function jobsOption(value: string | undefined): number {
  if (value === undefined) return 1;
  const jobs = Number(value);
  if (!/^[1-9][0-9]*$/.test(value) || !Number.isSafeInteger(jobs)) {
    throw new UsageError(`--jobs must be a positive integer, got ${JSON.stringify(value)}`);
  }
  const most = maxJobs();
  if (jobs > most) {
    throw new UsageError(
      `--jobs ${jobs}: at most ${most} on this machine (its available parallelism); each job is a process with ` +
        "its own engine workers, about 2 GiB with optiland",
    );
  }
  return jobs;
}
