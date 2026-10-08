// The comparator's policy file, and what holds it to the rungs and comparators of the code.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
