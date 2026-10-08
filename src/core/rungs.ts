// The rung registry. A rung is the unit people ask for (`--rungs`, a RunSpec's `rungs`): it names one quantity and
// says which requests of it a case and a run need. The rungs of the comparison ladder register here as their
// stages land.
import type { OpticalCase } from "../contract/case.ts";
import { SELFTEST_ECHO } from "../contract/quantities/selftestEcho.ts";
import type { SelftestEchoSpec } from "../contract/quantities/selftestEcho.ts";
import { makeRequest } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { RunSpec } from "../contract/runSpec.ts";
import { encodeNdArray } from "./numeric/ndarray.ts";
import { UsageError } from "./usageError.ts";

/** One rung: what is asked of every engine for one case in one run. */
export interface RungDefinition {
  /** What `--rungs` and a RunSpec's `rungs` call it. Ids are compared exactly. */
  readonly id: string;
  /** The quantity every request of the rung asks for. */
  readonly quantity: string;
  /**
   * The requests of this rung for one case, in a fixed order and without engine options: equal arguments give
   * equal requests, with equal ids. Each is about `opticalCase` and asks for `quantity` with a spec the quantity
   * accepts.
   */
  buildRequests(opticalCase: OpticalCase, runSpec: RunSpec): QuantityRequest[];
}

/**
 * The rung `selftest`: one `selftest.echo` request per case, so the whole pipeline (suites, engines, the store,
 * comparison, reports) runs with engines that know no optics. The elements to echo are the vertex `z` of every
 * surface, in order, followed by the stop semi-diameter, with a scale of 1; two cases therefore give two
 * requests unless they agree on all of those. A `z` of -0 is sent as 0, which is what it is in the case's identity,
 * so one case gives one request however its numbers are spelled. The RunSpec is not consulted.
 */
export const selftestRung: RungDefinition = Object.freeze({
  id: "selftest",
  quantity: SELFTEST_ECHO,
  buildRequests: (opticalCase: OpticalCase): QuantityRequest[] => {
    const { system, conditions } = opticalCase;
    // Adding 0 turns -0 into 0 and changes no other number. An array carries the sign of a zero; a case id does not.
    const values = Float64Array.from(
      [...system.surfaces.map((surface) => surface.z), conditions.stopSemiDiameter],
      (value) => value + 0,
    );
    const spec: SelftestEchoSpec = { values: encodeNdArray(values), scale: 1 };
    return [makeRequest({ caseId: opticalCase.id, quantity: SELFTEST_ECHO, spec })];
  },
});

/** Every rung there is, in ladder order: the order a run evaluates them in. */
export const RUNGS: readonly RungDefinition[] = Object.freeze([selftestRung]);

/**
 * The rungs that `ids` name, in the order of `rungs` and each once, however `ids` orders or repeats them; every
 * rung when `ids` is undefined, as for a run that states none. Throws a `UsageError` naming every id that is not a
 * rung, and for an empty list, which asks for nothing.
 */
export function selectRungs(
  ids: readonly string[] | undefined,
  rungs: readonly RungDefinition[] = RUNGS,
): RungDefinition[] {
  if (ids === undefined) return [...rungs];
  const known = rungs.map((rung) => rung.id);
  const unknown = [...new Set(ids)].filter((id) => !known.includes(id));
  if (unknown.length > 0) {
    const named = unknown.map((id) => JSON.stringify(id)).join(", ");
    throw new UsageError(
      `unknown ${unknown.length > 1 ? "rungs" : "rung"} ${named}: the rungs are ${known.join(", ")}`,
    );
  }
  if (ids.length === 0) throw new UsageError(`no rung was named: the rungs are ${known.join(", ")}`);
  return rungs.filter((rung) => ids.includes(rung.id));
}
