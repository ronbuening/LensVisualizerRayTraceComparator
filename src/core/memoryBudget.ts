// Scheduling policy only: never imported by an optical engine or included in stored identities.
import { totalmem } from "node:os";

import { LEGACY_CHECK_IDS, currentCheckId } from "./legacyIds.ts";

export const GIB = 2 ** 30;
export const JOB_GIB = 2.5;
export const R6C_JOB_GIB = 4;

/** Leave room for other applications: a quarter of installed RAM, less 2 GiB for the controller/reserve. */
export function defaultMemoryBudgetGiB(totalBytes = totalmem()): number {
  return Math.max(0, totalBytes / GIB / 4 - 2);
}

/** The memory one job of a run of `rungs` is planned at; a check named by an id it had before a rename is that check. */
export function jobEstimateGiB(
  rungs: readonly string[] = [],
  legacy: Readonly<Record<string, string>> = LEGACY_CHECK_IDS,
): number {
  return rungs.some((rung) => currentCheckId(rung, legacy) === "mtf-vs-optiland-wavefront") ? R6C_JOB_GIB : JOB_GIB;
}
