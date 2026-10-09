// The rung registry. A rung is the unit people ask for (`--rungs`, a RunSpec's `rungs`): it names one quantity and
// says which requests of it a case and a run need. The rungs of the comparison ladder register here as their
// stages land.
import type { OpticalCase } from "../contract/case.ts";
import type { JsonObject } from "../contract/json.ts";
import { MTF_NATIVE } from "../contract/quantities/mtfNative.ts";
import type { MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import { PARAXIAL_FIRST_ORDER } from "../contract/quantities/paraxialFirstOrder.ts";
import { RAYS_TRACE } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { SELFTEST_ECHO } from "../contract/quantities/selftestEcho.ts";
import type { SelftestEchoSpec } from "../contract/quantities/selftestEcho.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../contract/quantities/systemDescribe.ts";
import type { SystemDescribeSpec } from "../contract/quantities/systemDescribe.ts";
import { makeRequest } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { RunFields, RunSpec } from "../contract/runSpec.ts";
import { DEFAULT_RAY_FIELDS } from "../rays/raySets.ts";
import { waveFrequencies } from "./mtfRecipe.ts";
import type { MtfRecipe } from "./mtfRecipe.ts";
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
  /**
   * The ray sets of the run on the lattice of `FINE_GRID_FACTOR` times as many cells across, from the same source
   * asked with the finer sampling (`fineSampling`), for a rung that says it `needsFineRaySets`; empty, or left out,
   * for any other rung.
   */
  readonly fineRaySets?: readonly RaysTraceSpec[];
  /**
   * The MTF recipe of the run, from the source of its case (`CaseSource.recipe`), for a rung that says it
   * `needsRecipe`; null, or left out, for any other rung, and where the source has no recipe for the run.
   */
  readonly recipe?: MtfRecipe | null;
}

/** The inputs of a rung that needs none. */
export const NO_RUNG_INPUTS: RungInputs = Object.freeze({ raySets: Object.freeze([]), recipe: null });

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
   * True for a rung whose requests are also made from the run's ray sets on the finer lattice
   * (`RungInputs.fineRaySets`): those are generated, once per run, only when such a rung is run, and no other rung
   * is handed them.
   */
  readonly needsFineRaySets?: boolean;
  /**
   * True for a rung whose requests are made from the run's MTF recipe: the recipe is resolved, once per run, only
   * when such a rung is run.
   */
  readonly needsRecipe?: boolean;
  /**
   * The engines the rung is asked of, for a rung that is about named engines and is no comparison between the
   * engines of a run: it is asked of exactly these, whatever engines the run names. Without it the rung is asked
   * of the run's engines.
   */
  readonly engines?: readonly string[];
  /**
   * True for a rung that is run only where it is named, by `--rungs` or by a run's `rungs`: a run that names no
   * rung is not asked it. For a rung that needs an engine not every machine has.
   */
  readonly onlyWhereNamed?: boolean;
  /**
   * The options the rung's requests carry for the engine `engineId`, made from the run and from what the run's
   * case source made for the rung; the options the run states for an engine by its id (`sampling.engines`) are
   * laid over them. Without it, only those.
   */
  engineOptions?(runSpec: RunSpec, inputs?: RungInputs, engineId?: string): JsonObject | undefined;
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
  return requestsOfSets(opticalCase, inputs.raySets);
}

/** One `rays.trace` request for each of `sets`, in their order, each set once. */
function requestsOfSets(opticalCase: OpticalCase, sets: readonly RaysTraceSpec[]): QuantityRequest[] {
  const requests = new Map<string, QuantityRequest>();
  for (const spec of sets) {
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
 * The rung `r4`, the traced rays as a geometric MTF: the same requests as `r2` and `r3`, so an engine that has
 * traced a set for one has traced it for all three. The comparator's binless estimator is applied to where each
 * engine lands the rays of a field, at every line of the case, on the plane of the case and at the frequencies of
 * the run's MTF recipe, and the curves are compared (`src/compare/raysMtf.ts`). It is asked of the engines of the
 * run, and only of a run that has a recipe: without one nothing says at which frequencies an MTF is to be taken.
 */
export const r4Rung: RungDefinition = Object.freeze({
  id: "r4",
  quantity: RAYS_TRACE,
  needsRaySets: true,
  needsRecipe: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.recipe ?? null) === null ? [] : rayTraceRequests(opticalCase, inputs),
});

/**
 * The `rays.trace` requests of a run on both lattices: those of the run's own ray sets (`rayTraceRequests`), which
 * an engine has traced for `r2` to `r4`, and after them those of the sets on the finer lattice.
 */
export function waveTraceRequests(opticalCase: OpticalCase, inputs: RungInputs = NO_RUNG_INPUTS): QuantityRequest[] {
  return requestsOfSets(opticalCase, [...inputs.raySets, ...(inputs.fineRaySets ?? [])]);
}

/**
 * The rung `r6a`, the traced rays as a wave MTF: the requests of the run's ray sets, which `r2` to `r4` ask too,
 * and those of the same fields on a lattice of twice as many cells across (`waveTraceRequests`). The comparator's
 * wave estimator is applied to each engine's trace of a field at every line of the case, on the finer lattice, and
 * the curves are compared; the coarser lattice says whether the finer one has converged
 * (`src/compare/raysWaveMtf.ts`). It is asked of the engines of the run, and only of a run that has a recipe.
 */
export const r6aRung: RungDefinition = Object.freeze({
  id: "r6a",
  quantity: RAYS_TRACE,
  needsRaySets: true,
  needsFineRaySets: true,
  needsRecipe: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.recipe ?? null) === null ? [] : waveTraceRequests(opticalCase, inputs),
});

/** The engines of the rung `r4f`: LensVisualizer, and the comparator's estimator on a replay of its sampling. */
export const R4F_ENGINES: readonly string[] = Object.freeze(["lv", "replay"]);

/**
 * The `mtf.native` spec that asks for the geometric MTF of a recipe, on the plane of the case: the recipe's
 * frequencies and its fields as the fractions of the reference image height they were resolved from. Null for a
 * recipe that has a field without a fraction, which no such spec can state.
 */
export function geometricMtfSpec(recipe: MtfRecipe): MtfNativeSpec | null {
  const fractions = recipe.fields.map((field) => field.fraction);
  if (recipe.fields.length === 0 || fractions.some((fraction) => fraction === null)) return null;
  return {
    frequenciesPerMm: [...recipe.frequenciesPerMm],
    fields: { kind: "image-height-fractions", values: fractions as number[] },
    method: "geometric",
    focus: "design",
  };
}

/**
 * The rung `r4f`, the fidelity of the comparator's reading of LensVisualizer's MTF sampling: one `mtf.native`
 * request for the geometric MTF of the run's recipe on the plane of the case (`geometricMtfSpec`), asked of
 * LensVisualizer, whose answer is its own `computeMtf`, and of the engine `replay`, whose answer is the
 * comparator's estimator on a replay of the same sampling. It is asked of those two and of no other engine
 * (`R4F_ENGINES`), and only for a recipe LensVisualizer resolved: a case read from a file has no sampling of
 * LensVisualizer's to replay, and no request. Both engines are handed the run's `sampling.lvGridCap` as their
 * option `lvGridCap`, where the run states one.
 */
export const r4fRung: RungDefinition = Object.freeze({
  id: "r4f",
  quantity: MTF_NATIVE,
  needsRecipe: true,
  engines: R4F_ENGINES,
  engineOptions: (runSpec: RunSpec): JsonObject | undefined => {
    const cap = runSpec.sampling?.lvGridCap;
    return cap === undefined ? undefined : { lvGridCap: cap };
  },
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] => {
    const recipe = inputs?.recipe ?? null;
    if (recipe === null || recipe.source !== "lv") return [];
    const spec = geometricMtfSpec(recipe);
    return spec === null ? [] : [makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec })];
  },
});

/** The engines of the rung `r6b`: LensVisualizer, and the comparator's wave estimator on LensVisualizer's rays. */
export const R6B_ENGINES: readonly string[] = Object.freeze(["lv", "wave"]);

/**
 * The `mtf.native` spec that asks for the diffraction MTF of a recipe, on the plane of the case: the recipe's
 * frequencies thinned for a wave transfer function (`waveFrequencies`), at the fields the run traces rays for
 * (`fields`, `DEFAULT_RAY_FIELDS` without them), as fractions of the reference image height, each of them a field
 * the recipe resolved to an angle. Null where the run's fields are angles, or the recipe resolved none of them.
 */
export function waveMtfSpec(recipe: MtfRecipe, fields: RunFields = DEFAULT_RAY_FIELDS): MtfNativeSpec | null {
  if (fields.kind !== "image-height-fractions") return null;
  const resolved = fields.values.filter((fraction) =>
    recipe.fields.some((field) => field.fraction === fraction && field.angleDeg !== null),
  );
  if (resolved.length === 0) return null;
  return {
    frequenciesPerMm: waveFrequencies(recipe.frequenciesPerMm),
    fields: { kind: "image-height-fractions", values: resolved },
    method: "diffraction",
    focus: "design",
  };
}

/**
 * The rung `r6b`, LensVisualizer's own diffraction MTF beside the comparator's wave estimator on LensVisualizer's
 * rays: one `mtf.native` request for the diffraction MTF of the run's recipe on the plane of the case
 * (`waveMtfSpec`), asked of LensVisualizer, whose answer is its own `computeMtf`, and of the engine `wave`, whose
 * answer is Hopkins' autocorrelation of the optical paths LensVisualizer traces on the lattices rung `r6a` judges.
 * It is asked of those two and of no other engine (`R6B_ENGINES`), and only for a recipe LensVisualizer resolved.
 * Both engines are handed the run's `sampling.lvGridCap` and `sampling.bundleGrid` as the options `lvGridCap` and
 * `bundleGrid`, where the run states them; each reads its own.
 */
export const r6bRung: RungDefinition = Object.freeze({
  id: "r6b",
  quantity: MTF_NATIVE,
  needsRecipe: true,
  engines: R6B_ENGINES,
  engineOptions: (runSpec: RunSpec): JsonObject | undefined => {
    const { lvGridCap, bundleGrid } = runSpec.sampling ?? {};
    if (lvGridCap === undefined && bundleGrid === undefined) return undefined;
    return { ...(lvGridCap === undefined ? {} : { lvGridCap }), ...(bundleGrid === undefined ? {} : { bundleGrid }) };
  },
  buildRequests: (opticalCase: OpticalCase, runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] => {
    const recipe = inputs?.recipe ?? null;
    if (recipe === null || recipe.source !== "lv") return [];
    const spec = waveMtfSpec(recipe, runSpec.fields);
    return spec === null ? [] : [makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec })];
  },
});

/** The engines of the rung `r5`: LensVisualizer, optiland, and the comparator's wave estimator on LensVisualizer's rays. */
export const R5_ENGINES: readonly string[] = Object.freeze(["lv", "optiland", "wave"]);

/** The engine of `r5` that is handed the angles of the fields, and the option it is handed them as. */
export const R5_ANGLES_ENGINE = "optiland";
export const R5_ANGLES_OPTION = "fieldAnglesDeg";

/**
 * The angle the recipe resolved each field of an `mtf.native` spec of fractions to, degrees, in the order of the
 * spec; null where the recipe has no angle for one of them.
 */
export function recipeAngles(recipe: MtfRecipe, spec: MtfNativeSpec): number[] | null {
  const angles = spec.fields.values.map(
    (fraction) => recipe.fields.find((field) => field.fraction === fraction && field.angleDeg !== null)?.angleDeg,
  );
  return angles.some((angle) => angle === undefined || angle === null) ? null : (angles as number[]);
}

/**
 * The rung `r5`, LensVisualizer's product MTF beside an engine's own: the one `mtf.native` request of `r6b`
 * (`waveMtfSpec`: the diffraction MTF of the run's recipe on the plane of the case, at the fields the run traces
 * rays for, as fractions of the reference image height), asked of LensVisualizer, of optiland, whose answer is its
 * FFT MTF, and of the engine `wave`, the comparator's wave estimator on LensVisualizer's rays. One request, so
 * the three answers are one comparison and an answer `r6b` has in the store is not computed again.
 *
 * No engine but LensVisualizer knows which angle a fraction of its image height is. The recipe states it, and
 * optiland is handed the recipe's angles as its option `fieldAnglesDeg`, one for each field of the spec; the other
 * two are handed the options `r6b` hands them. It is asked of those three and of no other engine (`R5_ENGINES`),
 * only for a recipe LensVisualizer resolved, and only where the rung is named: optiland is not on every machine.
 */
export const r5Rung: RungDefinition = Object.freeze({
  id: "r5",
  quantity: MTF_NATIVE,
  needsRecipe: true,
  engines: R5_ENGINES,
  onlyWhereNamed: true,
  engineOptions: (runSpec: RunSpec, inputs?: RungInputs, engineId?: string): JsonObject | undefined => {
    if (engineId !== R5_ANGLES_ENGINE) return r6bRung.engineOptions?.(runSpec);
    const recipe = inputs?.recipe ?? null;
    const spec = recipe === null ? null : waveMtfSpec(recipe, runSpec.fields);
    const angles = recipe === null || spec === null ? null : recipeAngles(recipe, spec);
    return angles === null ? undefined : { [R5_ANGLES_OPTION]: angles };
  },
  buildRequests: (opticalCase: OpticalCase, runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    r6bRung.buildRequests(opticalCase, runSpec, inputs),
});

/**
 * Every rung there is, in ladder order: the order a run evaluates them in, and the order in which a rung is
 * "later" than another for a policy that blocks later rungs. `selftest` needs no optics and comes first. Every
 * rung is judged: each has an entry in the policy and a comparator for its quantity.
 */
export const RUNGS: readonly RungDefinition[] = Object.freeze([
  selftestRung,
  r0Rung,
  r1Rung,
  r2Rung,
  r3Rung,
  r4Rung,
  r4fRung,
  r5Rung,
  r6aRung,
  r6bRung,
]);

/**
 * The rungs that `ids` name, in the order of `rungs` and each once, however `ids` orders or repeats them. When
 * `ids` is undefined, as for a run that states none: every rung but those that are run only where they are named
 * (`RungDefinition.onlyWhereNamed`). Throws a `UsageError` naming every id that is not
 * a rung, and for an empty list, which asks for nothing.
 */
export function selectRungs(
  ids: readonly string[] | undefined,
  rungs: readonly RungDefinition[] = RUNGS,
): RungDefinition[] {
  if (ids === undefined) return rungs.filter((rung) => rung.onlyWhereNamed !== true);
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
