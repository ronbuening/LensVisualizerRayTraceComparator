import { hashCanonical } from "../core/numeric/hash.ts";
// The comparator's policy file, and what holds it to the rungs and comparators of the code.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Baseline } from "../contract/baseline.ts";
import { policyProblems } from "../contract/policy.ts";
import type { Policy } from "../contract/policy.ts";
import { formatIssues, validateKind } from "../contract/schemas.ts";
import { isCompatibleContract } from "../contract/version.ts";
import type { RungDefinition } from "../core/rungs.ts";
import type { ComparatorLookup } from "./comparator.ts";

/** The policy every comparison is judged by: `policy/rungs.v1.json` of this repository. */
export const POLICY_FILE: string = fileURLToPath(new URL("../../policy/rungs.v1.json", import.meta.url));

/**
 * Reads a policy file, `POLICY_FILE` unless another is named. Throws an error that names what is wrong, and not
 * the file's path, for a file that cannot be read, is not JSON, is not a `policy` by its schema, is written to a
 * contract this code cannot read or breaks a rule of a policy (`policyProblems`).
 */
export function loadPolicy(file: string = POLICY_FILE): Policy {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    throw new Error(`policy: the file ${code === undefined ? "is malformed JSON" : `cannot be read (${code})`}`, {
      cause: error,
    });
  }
  const issues = validateKind("policy", parsed);
  if (issues.length > 0) throw new Error(`policy: not a valid policy: ${formatIssues(issues)}`);
  const policy = parsed as Policy;
  if (!isCompatibleContract(policy.contract)) throw new Error(`policy: contract ${policy.contract} cannot be read`);
  const problems = policyProblems(policy);
  if (problems.length > 0) throw new Error(`policy: ${problems.join("; ")}`);
  return policy;
}

/**
 * Everything by which a policy and the code disagree, in a fixed order; empty exactly when a run of any registered
 * rung can be compared and judged:
 *
 * - every registered rung has a policy entry, and every entry is of a registered rung;
 * - an entry names the quantity of its rung, and that quantity has a comparator for the rung;
 * - every metric an entry names is one the comparator reports, in the unit the comparator reports it in.
 */
export function policyRegistryProblems(
  policy: Policy,
  rungs: readonly RungDefinition[],
  comparators: ComparatorLookup,
): string[] {
  const problems: string[] = [];
  const registered = new Map(rungs.map((rung) => [rung.id, rung]));
  for (const rung of rungs) {
    if (!Object.hasOwn(policy.rungs, rung.id)) problems.push(`rung ${rung.id} has no policy entry`);
  }
  for (const id of Object.keys(policy.rungs).sort()) {
    const entry = policy.rungs[id];
    const rung = registered.get(id);
    if (rung === undefined) {
      problems.push(`policy entry ${id} is of no registered rung`);
      continue;
    }
    if (entry.quantity !== rung.quantity) {
      problems.push(`policy entry ${id} names the quantity ${entry.quantity}; the rung's is ${rung.quantity}`);
      continue;
    }
    const comparator = comparators.get(entry.quantity, id);
    if (comparator === undefined) {
      problems.push(`policy entry ${id}: the quantity ${entry.quantity} has no comparator`);
      continue;
    }
    for (const name of Object.keys(entry.metrics).sort()) {
      const declared = comparator.metrics.find((metric) => metric.name === name);
      if (declared === undefined) problems.push(`policy entry ${id}: the comparator reports no metric ${name}`);
      else if (declared.unit !== entry.metrics[name].unit) {
        problems.push(
          `policy entry ${id}: metric ${name} is in ${entry.metrics[name].unit}; the comparator reports ${declared.unit}`,
        );
      }
    }
  }
  return problems;
}

/** Baselines must state the policy version and content hash at hand. */
export function baselinePolicyMatches(
  stated: { readonly hash: string; readonly version: number },
  policy: Policy,
): boolean {
  return stated.version === policy.version && stated.hash === hashCanonical(policy);
}

/**
 * The frozen policies a dated snapshot baseline may record (`policy/snapshots/rungs.v<version>.json`): a copy of the
 * policy file as it was when the snapshot was written, kept so that a later policy does not make the snapshot need
 * a new sweep. Today only the catalog is such a snapshot (`SNAPSHOT_BASELINE_SUITES`).
 */
export const POLICY_SNAPSHOTS: string = fileURLToPath(new URL("../../policy/snapshots/", import.meta.url));

/** The suites whose baselines are dated snapshots, held to the policy they record and not to the policy at hand. */
export const SNAPSHOT_BASELINE_SUITES: readonly string[] = ["catalog"];

/** The file of the frozen policy of a version, relative to the repository: what a message names. */
export function policySnapshotName(version: number): string {
  return `policy/snapshots/rungs.v${version}.json`;
}

/**
 * The frozen policy a snapshot baseline records, read from `directory` and held to the version and hash the baseline
 * states: the policy itself, or why it is not known. The file is held by its canonical hash, not by the schema of
 * today, which may have moved on since it was frozen; a file that is not a policy of that version and hash is no
 * snapshot of it, so a recorded hash with no such file is not accepted.
 */
export function loadPolicySnapshot(
  stated: { readonly hash: string; readonly version: number },
  directory: string = POLICY_SNAPSHOTS,
): { readonly policy: Policy } | { readonly problem: string } {
  const name = policySnapshotName(stated.version);
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(join(directory, `rungs.v${stated.version}.json`), "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return { problem: `${name} ${code === undefined ? "is malformed JSON" : `cannot be read (${code})`}` };
  }
  const policy = parsed as Policy;
  if (
    parsed === null ||
    typeof parsed !== "object" ||
    policy.kind !== "policy" ||
    typeof policy.rungs !== "object" ||
    policy.rungs === null
  )
    return { problem: `${name} is not a policy` };
  if (policy.version !== stated.version) return { problem: `${name} states policy v${String(policy.version)}` };
  const hash = hashCanonical(policy);
  if (hash !== stated.hash) return { problem: `${name} hashes to ${hash}, not to the recorded ${stated.hash}` };
  return { policy };
}

/**
 * Where a baseline's recorded gates are not those of `policy`, the policy it states it was judged by: every rung is
 * one of the policy's, of its quantity; every metric with a tolerance has the policy's tolerance and unit; a band
 * is the policy's attention band; and no PASS pair has a value above its tolerance.
 */
export function baselineGateProblems(baseline: Baseline, policy: Policy): string[] {
  const problems: string[] = [];
  for (const run of baseline.runs) {
    for (const rung of run.rungs) {
      const entry = Object.hasOwn(policy.rungs, rung.rung) ? policy.rungs[rung.rung] : undefined;
      if (entry === undefined) {
        problems.push(`${run.name} ${rung.rung}: the recorded policy has no rung ${rung.rung}`);
        continue;
      }
      if (entry.quantity !== rung.quantity)
        problems.push(`${run.name} ${rung.rung}: the recorded policy's quantity is ${entry.quantity}`);
      for (const [metric, band] of Object.entries(rung.bands ?? {})) {
        if (entry.metrics[metric]?.attention !== band)
          problems.push(`${run.name} ${rung.rung}: the band of ${metric} is not the recorded policy's`);
      }
      for (const pair of rung.pairs) {
        for (const metric of pair.metrics) {
          if (metric.tolerance === undefined) continue;
          const judged = Object.hasOwn(entry.metrics, metric.name) ? entry.metrics[metric.name] : undefined;
          const at = `${run.name} ${rung.rung} ${pair.a} ${pair.b} ${metric.name}`;
          if (judged?.tolerance !== metric.tolerance || judged.unit !== metric.unit)
            problems.push(`${at}: the gate is not the recorded policy's`);
          else if (pair.verdict === "PASS" && metric.value !== null && metric.value > metric.tolerance)
            problems.push(`${at}: PASS with ${metric.value} above the recorded policy's ${metric.tolerance}`);
        }
      }
    }
  }
  return problems;
}
