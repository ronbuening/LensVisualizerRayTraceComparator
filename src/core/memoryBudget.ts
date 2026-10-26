// Scheduling policy only: never imported by an optical engine or included in stored identities.
import { totalmem } from "node:os";

export const GIB = 2 ** 30;
export const JOB_GIB = 2.5;
export const R6C_JOB_GIB = 4;

/** Leave room for other applications: a quarter of installed RAM, less 2 GiB for the controller/reserve. */
export function defaultMemoryBudgetGiB(totalBytes = totalmem()): number {
  return Math.max(0, totalBytes / GIB / 4 - 2);
}

export function jobEstimateGiB(rungs: readonly string[] = []): number {
  return rungs.includes("r6c") ? R6C_JOB_GIB : JOB_GIB;
}
