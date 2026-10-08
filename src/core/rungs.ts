// The rung registry. A rung is the unit people ask for (`--rungs`, a RunSpec's `rungs`): it names one quantity and
// says which requests of it a case and a run need. The rungs of the comparison ladder register here as their
// stages land.
import type { OpticalCase } from "../contract/case.ts";
import { PARAXIAL_FIRST_ORDER } from "../contract/quantities/paraxialFirstOrder.ts";
import { RAYS_TRACE } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { SELFTEST_ECHO } from "../contract/quantities/selftestEcho.ts";
import type { SelftestEchoSpec } from "../contract/quantities/selftestEcho.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../contract/quantities/systemDescribe.ts";
import type { SystemDescribeSpec } from "../contract/quantities/systemDescribe.ts";
import { makeRequest } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { RunSpec } from "../contract/runSpec.ts";
import { encodeF8 } from "./numeric/ndarray.ts";
import { UsageError } from "./usageError.ts";

/**
 * What a rung is handed beside the case and the run: what the run's case source made for it. A request builder
 * reads this and never an engine or a lens, so it stays the same function for every engine and every source.
 */
export interface RungInputs {
  /**
   * The ray sets of the run, from the source of its case (`CaseSource.raySets`), for a rung that says it
   * `needsRaySets`; empty for any other rung, and where the source has no rays for the run.
   */
  readonly raySets: readonly RaysTraceSpec[];
}

/** The inputs of a rung that needs none. */
export const NO_RUNG_INPUTS: RungInputs = Object.freeze({ raySets: Object.freeze([]) });

/** One rung: what is asked of every engine for one case in one run. */
export interface RungDefinition {
  /** What `--rungs` and a RunSpec's `rungs` call it. Ids are compared exactly. */
  readonly id: string;
  /** The quantity every request of the rung asks for. */
  readonly quantity: string;
  /**
   * True for a rung whose requests are made from the run's ray sets: the sets are generated, once per run, only
   * when such a rung is run.
   */
  readonly needsRaySets?: boolean;
  /**
   * The requests of this rung for one case, in a fixed order and without engine options: equal arguments give
   * equal requests, with equal ids. Each is about `opticalCase` and asks for `quantity` with a spec the quantity
   * accepts. `inputs` is `NO_RUNG_INPUTS` when the caller has none to give.
   */
  buildRequests(opticalCase: OpticalCase, runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[];
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
    // An array carries the sign of a zero; a case id does not.
    const values = encodeF8([...system.surfaces.map((surface) => surface.z), conditions.stopSemiDiameter]);
    const spec: SelftestEchoSpec = { values, scale: 1 };
    return [makeRequest({ caseId: opticalCase.id, quantity: SELFTEST_ECHO, spec })];
  },
});

/**
 * The rung `r0`, the built-system echo: one `system.describe` request per case, which asks every engine for the
 * system it built, with the sag of each surface at the nine default fractions of its nominal semi-diameter. The
 * fractions are stated in the spec, so the request says what was asked whatever an engine's default is. The
 * RunSpec is not consulted.
 */
export const r0Rung: RungDefinition = Object.freeze({
  id: "r0",
  quantity: SYSTEM_DESCRIBE,
  buildRequests: (opticalCase: OpticalCase): QuantityRequest[] => {
    const spec: SystemDescribeSpec = { sagFractions: [...DEFAULT_SAG_FRACTIONS] };
    return [makeRequest({ caseId: opticalCase.id, quantity: SYSTEM_DESCRIBE, spec })];
  },
});

/**
 * The rung `r1`, the first-order data: one `paraxial.first-order` request per case, with the empty spec the
 * quantity has. The RunSpec is not consulted.
 */
export const r1Rung: RungDefinition = Object.freeze({
  id: "r1",
  quantity: PARAXIAL_FIRST_ORDER,
  buildRequests: (opticalCase: OpticalCase): QuantityRequest[] => [
    makeRequest({ caseId: opticalCase.id, quantity: PARAXIAL_FIRST_ORDER, spec: {} }),
  ],
});

/**
 * The `rays.trace` requests of a run: one for each of its ray sets, in the order of the sets, each set once. They
 * are what every rung that compares traced rays asks, so that such rungs share one answer per engine and set.
 */
export function rayTraceRequests(opticalCase: OpticalCase, inputs: RungInputs = NO_RUNG_INPUTS): QuantityRequest[] {
  const requests = new Map<string, QuantityRequest>();
  for (const spec of inputs.raySets) {
    const request = makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec });
    // A Map keeps the first of two equal sets, in its place.
    if (!requests.has(request.id)) requests.set(request.id, request);
  }
  return [...requests.values()];
}

/**
 * The rung `r2`, the traced rays as geometry: the `rays.trace` requests of the run's ray sets (`rayTraceRequests`),
 * which the source of the run's case generates for the run's fields, lines and bundle grid. Every engine traces the
 * same rays, and the answers are compared hit by hit, in the direction behind the last surface, in the landing on
 * the image plane and in which rays got through.
 */
export const r2Rung: RungDefinition = Object.freeze({
  id: "r2",
  quantity: RAYS_TRACE,
  needsRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    rayTraceRequests(opticalCase, inputs),
});

/**
 * The rung `r3`, the traced rays as optical path: the same requests as `r2`, so an engine that has answered one
 * has answered the other and the store holds one answer for both. The answers are compared in the optical path to
 * the last surface and to the image plane.
 */
export const r3Rung: RungDefinition = Object.freeze({
  id: "r3",
  quantity: RAYS_TRACE,
  needsRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    rayTraceRequests(opticalCase, inputs),
});

/**
 * Every rung there is, in ladder order: the order a run evaluates them in, and the order in which a rung is
 * "later" than another for a policy that blocks later rungs. `selftest` needs no optics and comes first. Every
 * rung is judged: each has an entry in the policy and a comparator for its quantity.
 */
export const RUNGS: readonly RungDefinition[] = Object.freeze([selftestRung, r0Rung, r1Rung, r2Rung, r3Rung]);

/**
 * The rungs that `ids` name, in the order of `rungs` and each once, however `ids` orders or repeats them. When
 * `ids` is undefined, as for a run that states none: every rung. Throws a `UsageError` naming every id that is not
 * a rung, and for an empty list, which asks for nothing.
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
