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
import { SPOT_NATIVE } from "../contract/quantities/spotNative.ts";
import { AXIAL_NATIVE } from "../contract/quantities/axialNative.ts";
import type { AxialNativeSpec } from "../contract/quantities/axialNative.ts";
import { CHIEF_NATIVE } from "../contract/quantities/chiefNative.ts";
import type { ChiefNativeSpec } from "../contract/quantities/chiefNative.ts";
import { CURVATURE_NATIVE } from "../contract/quantities/curvatureNative.ts";
import type { CurvatureNativeSpec } from "../contract/quantities/curvatureNative.ts";
import { VIGNETTING_NATIVE } from "../contract/quantities/vignettingNative.ts";
import type { VignettingNativeSpec } from "../contract/quantities/vignettingNative.ts";
import { SUMMARY_NATIVE } from "../contract/quantities/summaryNative.ts";
import type { SummaryNativeSpec } from "../contract/quantities/summaryNative.ts";
import { SEIDEL_NATIVE } from "../contract/quantities/seidelNative.ts";
import type { SeidelNativeSpec } from "../contract/quantities/seidelNative.ts";
import { ZERNIKE_NATIVE } from "../contract/quantities/zernikeNative.ts";
import type { ZernikeNativeSpec, ZernikeOrdering } from "../contract/quantities/zernikeNative.ts";
import type { SelftestEchoSpec } from "../contract/quantities/selftestEcho.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../contract/quantities/systemDescribe.ts";
import type { SystemDescribeSpec } from "../contract/quantities/systemDescribe.ts";
import { makeRequest } from "../contract/request.ts";
import type { QuantityRequest } from "../contract/request.ts";
import type { RunFields, RunSpec } from "../contract/runSpec.ts";
import { DEFAULT_RAY_FIELDS, FINE_GRID_FACTOR } from "../rays/raySets.ts";
import type { SpotNativeAsk } from "../rays/spotSets.ts";
import { waveFrequencies } from "./mtfRecipe.ts";
import type { MtfRecipe } from "./mtfRecipe.ts";
import { canonicalJson } from "./numeric/canonicalJson.ts";
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
  /**
   * The spot sets of the run, from the source of its case (`CaseSource.spotRaySets`), for a rung that says it
   * `needsSpotRaySets`: the rays of the tabs that show a spot or a ray fan. Empty, or left out, for any other rung.
   */
  readonly spotRaySets?: readonly RaysTraceSpec[];
  /** The engines' own spot requests of the same tabs, from the same source, for such a rung (`SpotNativeAsk`). */
  readonly spotAsks?: readonly SpotNativeAsk[];
  /**
   * The axial sets of the run, from the source of its case (`CaseSource.axialRaySets`), for a rung that says it
   * `needsAxialRaySets`: the rays of the tabs that present the beam along the axis. Empty, or left out, for any other
   * rung.
   */
  readonly axialRaySets?: readonly RaysTraceSpec[];
  /** The engines' own axial requests of the same tabs, from the same source, for such a rung. */
  readonly axialAsks?: readonly AxialNativeSpec[];
  /**
   * The chief sets of the run, from the source of its case (`CaseSource.chiefRaySets`), for a rung that says it
   * `needsChiefRaySets`: the chief rays of the tabs that present the field. Empty, or left out, for any other rung.
   */
  readonly chiefRaySets?: readonly RaysTraceSpec[];
  /** The engines' own chief-ray requests of the same tabs, from the same source, for such a rung. */
  readonly chiefAsks?: readonly ChiefNativeSpec[];
  /**
   * The curvature sets of the run, from the source of its case (`CaseSource.curvatureRaySets`), for a rung that says
   * it `needsCurvatureRaySets`: the rays of the sections that present the field curves. Empty, or left out, for any
   * other rung.
   */
  readonly curvatureRaySets?: readonly RaysTraceSpec[];
  /** The engines' own field-curve requests of the same sections, from the same source, for such a rung. */
  readonly curvatureAsks?: readonly CurvatureNativeSpec[];
  /**
   * The vignetting sets of the run, from the source of its case (`CaseSource.vignettingRaySets`), for a rung that says
   * it `needsVignettingRaySets`: the rays of the vignetting tab, each field's beam and the chief rays of its image
   * mapping. Empty, or left out, for any other rung.
   */
  readonly vignettingRaySets?: readonly RaysTraceSpec[];
  /** The engines' own vignetting requests of the same fields, from the same source, for such a rung. */
  readonly vignettingAsks?: readonly VignettingNativeSpec[];
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
   * True for a rung whose requests are made from the run's spot sets (`RungInputs.spotRaySets` and `spotAsks`):
   * those are generated, once per run, only when such a rung is run, and no other rung is handed them.
   */
  readonly needsSpotRaySets?: boolean;
  /**
   * True for a rung whose requests are made from the run's axial sets (`RungInputs.axialRaySets` and `axialAsks`):
   * those are generated, once per run, only when such a rung is run, and no other rung is handed them.
   */
  readonly needsAxialRaySets?: boolean;
  /**
   * True for a rung whose requests are made from the run's chief sets (`RungInputs.chiefRaySets` and `chiefAsks`):
   * those are generated, once per run, only when such a rung is run, and no other rung is handed them.
   */
  readonly needsChiefRaySets?: boolean;
  /**
   * True for a rung whose requests are made from the run's curvature sets (`RungInputs.curvatureRaySets` and
   * `curvatureAsks`): those are generated, once per run, only when such a rung is run, and no other rung is handed
   * them.
   */
  readonly needsCurvatureRaySets?: boolean;
  /**
   * True for a rung whose requests are made from the run's vignetting sets (`RungInputs.vignettingRaySets` and
   * `vignettingAsks`): those are generated, once per run, only when such a rung is run, and no other rung is handed
   * them.
   */
  readonly needsVignettingRaySets?: boolean;
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
   * laid over them. Without it, only those. `request` is the one of the rung's requests the options are for, for a
   * rung whose requests do not all carry the same.
   */
  engineOptions?(
    runSpec: RunSpec,
    inputs?: RungInputs,
    engineId?: string,
    request?: QuantityRequest,
  ): JsonObject | undefined;
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
    makeRequest({
      caseId: opticalCase.id,
      quantity: PARAXIAL_FIRST_ORDER,
      spec: {},
      ...(opticalCase.features.includes("surface.diffractive") ? { quantityVersion: 2 } : {}),
    }),
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
    const request = makeRequest({
      caseId: opticalCase.id,
      quantity: RAYS_TRACE,
      spec,
      ...(opticalCase.features.includes("surface.diffractive")
        ? { quantityVersion: 3 }
        : opticalCase.system.opticalPath === undefined
          ? {}
          : { quantityVersion: 2 }),
    });
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
 * The `mtf.native` spec that asks for the MTF of a recipe by `method`, on the plane of the case: the recipe's
 * frequencies thinned as for a wave transfer function (`waveFrequencies`), at the fields the run traces rays for
 * (`fields`, `DEFAULT_RAY_FIELDS` without them), as fractions of the reference image height, each of them a field
 * the recipe resolved to an angle. Null where the run's fields are angles, or the recipe resolved none of them.
 */
export function rayFieldsMtfSpec(
  recipe: MtfRecipe,
  method: MtfNativeSpec["method"],
  fields: RunFields = DEFAULT_RAY_FIELDS,
): MtfNativeSpec | null {
  if (fields.kind !== "image-height-fractions") return null;
  const resolved = fields.values.filter((fraction) =>
    recipe.fields.some((field) => field.fraction === fraction && field.angleDeg !== null),
  );
  if (resolved.length === 0) return null;
  return {
    frequenciesPerMm: waveFrequencies(recipe.frequenciesPerMm),
    fields: { kind: "image-height-fractions", values: resolved },
    method,
    focus: "design",
  };
}

/** The `mtf.native` spec that asks for the diffraction MTF of a recipe: `rayFieldsMtfSpec` for that method. */
export function waveMtfSpec(recipe: MtfRecipe, fields: RunFields = DEFAULT_RAY_FIELDS): MtfNativeSpec | null {
  return rayFieldsMtfSpec(recipe, "diffraction", fields);
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

/** The engine of `r5` and `r5g` that is handed the angles of the fields, and the option it is handed them as. */
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

/** R6c: four-column diffraction comparison; native request and R5 field angles, no automatic follow-up. */
export const r6cRung: RungDefinition = Object.freeze({
  ...r5Rung,
  id: "r6c",
  engines: Object.freeze(["lv", "wave", "optiland", "optiland-wave"]),
  engineOptions: (runSpec: RunSpec, inputs?: RungInputs, engineId?: string): JsonObject | undefined =>
    r5Rung.engineOptions?.(runSpec, inputs, engineId === "optiland-wave" ? "optiland" : engineId),
  buildRequests: (opticalCase: OpticalCase, runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    r5Rung.buildRequests(opticalCase, runSpec, inputs),
});

/** The engines of the rung `r5g`: LensVisualizer, optiland, and the comparator's estimator on a replay of LensVisualizer's sampling. */
export const R5G_ENGINES: readonly string[] = Object.freeze(["lv", "optiland", "replay"]);

/**
 * The `mtf.native` specs of `r5g`, one for each field: the geometric MTF of a recipe at the fields and the
 * frequencies `r5` asks the diffraction MTF at (`rayFieldsMtfSpec`), each field in a spec of its own, in their
 * order. Empty where `r5` would have no spec.
 */
export function geometricFieldMtfSpecs(recipe: MtfRecipe, fields?: RunFields): MtfNativeSpec[] {
  const every = rayFieldsMtfSpec(recipe, "geometric", fields);
  if (every === null) return [];
  return every.fields.values.map((fraction) => ({
    ...every,
    fields: { kind: "image-height-fractions", values: [fraction] },
  }));
}

/**
 * The rung `r5g`, LensVisualizer's geometric MTF beside an engine's own: the geometric MTF of the run's recipe on
 * the plane of the case, at the fields the run traces rays for, as fractions of the reference image height, at the
 * frequencies of `r5` (`geometricFieldMtfSpecs`), asked of LensVisualizer, of optiland, whose answer is its own
 * geometric MTF, and of the engine `replay`, the comparator's estimator on a replay of LensVisualizer's sampling.
 *
 * **One request a field.** optiland's geometric MTF of a fast lens wide open has been measured at 26 s a field and
 * line on its ladder of 128 and 256 rays and at 135 s on the finer one, a request of the worker has a budget of
 * 300 s when its last field is begun, and a worker that has not answered in ten minutes is ended
 * (docs/gotchas.md). A request of three fields on five lines was within a sixth of that budget. With a field a
 * request, one field's cost is one request's, and the finer step is asked for the field that is outside its band
 * and for no other. It is therefore not the request of `r4f` either, which is of every field and frequency of the
 * recipe.
 *
 * optiland is handed the recipe's angle of the request's field as its option `fieldAnglesDeg`, as in `r5`. The
 * other two are handed the options `r4f` hands them. It is asked of those three and of no other engine
 * (`R5G_ENGINES`), only for a recipe LensVisualizer resolved, and only where the rung is named.
 */
export const r5gRung: RungDefinition = Object.freeze({
  id: "r5g",
  quantity: MTF_NATIVE,
  needsRecipe: true,
  engines: R5G_ENGINES,
  onlyWhereNamed: true,
  engineOptions: (
    runSpec: RunSpec,
    inputs?: RungInputs,
    engineId?: string,
    request?: QuantityRequest,
  ): JsonObject | undefined => {
    if (engineId !== R5_ANGLES_ENGINE) return r4fRung.engineOptions?.(runSpec);
    const recipe = inputs?.recipe ?? null;
    const angles =
      recipe === null || request === undefined ? null : recipeAngles(recipe, request.spec as MtfNativeSpec);
    return angles === null ? undefined : { [R5_ANGLES_OPTION]: angles };
  },
  buildRequests: (opticalCase: OpticalCase, runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] => {
    const recipe = inputs?.recipe ?? null;
    if (recipe === null || recipe.source !== "lv") return [];
    return geometricFieldMtfSpecs(recipe, runSpec.fields).map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec }),
    );
  },
});

/**
 * The rung `r7a`, the spot and the ray fan of LensVisualizer's coma and bokeh tabs on identical rays: one
 * `rays.trace` request for each of the run's spot sets (`RungInputs.spotRaySets`), the rays each tab launches, every
 * sample of its pupil pattern and its chief ray, which every engine traces as given. The comparator's spot estimator
 * is applied to where each engine lands them on the plane of the case, and the centroids, the RMS radii and the
 * transverse error of every ray are compared, beside which rays got through (`src/compare/raysSpot.ts`). It is
 * asked of the engines of the run, and only of a run whose source has spot sets: a LensVisualizer lens at infinity
 * focus that is not folded.
 */
export const r7aRung: RungDefinition = Object.freeze({
  id: "r7a",
  quantity: RAYS_TRACE,
  needsSpotRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    requestsOfSets(opticalCase, inputs?.spotRaySets ?? []),
});

/** The engines of the rung `r7b`: LensVisualizer, whose tabs are asked, and optiland's own spot and ray fan. */
export const R7B_ENGINES: readonly string[] = Object.freeze(["lv", "optiland"]);

/**
 * The rung `r7b`, LensVisualizer's coma and bokeh tabs beside an engine's own spot and ray fan: one `spot.native`
 * request for each pattern the tabs draw (`RungInputs.spotAsks`), at the case's reference line and the tabs' own
 * fractions of the half field, asked of LensVisualizer, whose answer is its tab's, and of optiland, whose answer is
 * its `SpotDiagram` or its `RayFan`. optiland is handed the angle LensVisualizer draws each fraction at as its option
 * `fieldAnglesDeg`, matched to the request by its spec. Recorded, of those two engines and of no other, and run only
 * where it is named: optiland is not on every machine.
 */
export const r7bRung: RungDefinition = Object.freeze({
  id: "r7b",
  quantity: SPOT_NATIVE,
  needsSpotRaySets: true,
  engines: R7B_ENGINES,
  onlyWhereNamed: true,
  engineOptions: (
    _runSpec: RunSpec,
    inputs?: RungInputs,
    engineId?: string,
    request?: QuantityRequest,
  ): JsonObject | undefined => {
    if (engineId !== R5_ANGLES_ENGINE || request === undefined) return undefined;
    const asked = canonicalJson(request.spec);
    const ask = inputs?.spotAsks?.find((each) => canonicalJson(each.spec) === asked);
    return ask === undefined ? undefined : { [R5_ANGLES_OPTION]: [...ask.fieldAnglesDeg] };
  },
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.spotAsks ?? []).map((ask) =>
      makeRequest({ caseId: opticalCase.id, quantity: SPOT_NATIVE, spec: ask.spec as JsonObject }),
    ),
});

/**
 * The rung `r8a`, LensVisualizer's spherical-aberration and axial-colour sections on identical rays: one `rays.trace`
 * request for each of the run's axial sets (`RungInputs.axialRaySets`), the rays the two sections launch parallel to
 * the axis, each beside its mirror image, which every engine traces as given. The comparator's estimator of where a
 * ray crosses the axis is applied to each engine's trace of them, and the two engines' intercepts, the
 * least-squares focus of each set's pairs and the RMS of their heights there are compared, beside which rays got
 * through (`src/compare/raysAxial.ts`). It is asked of the engines of the run, and only of a run whose source has
 * axial sets: a LensVisualizer lens at infinity focus that is not folded.
 */
export const r8aRung: RungDefinition = Object.freeze({
  id: "r8a",
  quantity: RAYS_TRACE,
  needsAxialRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    requestsOfSets(opticalCase, inputs?.axialRaySets ?? []),
});

/** The engines of the rung `r8b`: LensVisualizer, whose sections are asked, and optiland's own rays and focus. */
export const R8B_ENGINES: readonly string[] = Object.freeze(["lv", "optiland"]);

/**
 * The rung `r8b`, LensVisualizer's spherical-aberration and axial-colour sections beside an engine's own: one
 * `axial.native` request for each section (`RungInputs.axialAsks`), the spherical aberration at the case's reference
 * line and the axial colour at every line, at the sections' own pupil zones, asked of LensVisualizer, whose answer
 * is its sections' figures, and of optiland, whose answer is the real rays it traces at its own pupil and its
 * paraxial focus at each line. Recorded, of those two engines and of no other, and run only where it is named:
 * optiland is not on every machine.
 */
export const r8bRung: RungDefinition = Object.freeze({
  id: "r8b",
  quantity: AXIAL_NATIVE,
  needsAxialRaySets: true,
  engines: R8B_ENGINES,
  onlyWhereNamed: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.axialAsks ?? []).map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: AXIAL_NATIVE, spec: spec as JsonObject }),
    ),
});

/**
 * The rung `r9a`, LensVisualizer's distortion, pupils and lateral-colour tabs on identical rays: one `rays.trace`
 * request for each of the run's chief sets (`RungInputs.chiefRaySets`), the chief rays the tabs launch, which every
 * engine traces as given. Where each engine lands them is compared, with what the tabs make of the landings: the
 * distortion of each ray against the reference its set's probe scales, where each chief ray crosses the axis behind
 * the system, and how each landing moves from the case's first line to its others (`src/compare/raysChief.ts`). It
 * is asked of the engines of the run, and only of a run whose source has chief sets: a LensVisualizer lens at
 * infinity focus that is not folded.
 */
export const r9aRung: RungDefinition = Object.freeze({
  id: "r9a",
  quantity: RAYS_TRACE,
  needsChiefRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    requestsOfSets(opticalCase, inputs?.chiefRaySets ?? []),
});

/** The engines of the rung `r9b`: LensVisualizer, whose tabs are asked, and optiland's own chief rays and classes. */
export const R9B_ENGINES: readonly string[] = Object.freeze(["lv", "optiland"]);

/**
 * The rung `r9b`, LensVisualizer's distortion, pupils and lateral-colour tabs beside an engine's own: one
 * `chief.native` request for each tab (`RungInputs.chiefAsks`), the distortion and the pupils at the case's reference
 * line and the lateral colour at every line, at the tabs' own fields, asked of LensVisualizer, whose answer is its
 * tabs' figures, and of optiland, whose answer is its own distortion model and the chief rays it traces. Recorded, of
 * those two engines and of no other, and run only where it is named: optiland is not on every machine.
 */
export const r9bRung: RungDefinition = Object.freeze({
  id: "r9b",
  quantity: CHIEF_NATIVE,
  needsChiefRaySets: true,
  engines: R9B_ENGINES,
  onlyWhereNamed: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.chiefAsks ?? []).map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: CHIEF_NATIVE, spec: spec as JsonObject }),
    ),
});

/**
 * The rung `r10a`, LensVisualizer's field-curve and astigmatism sections on identical rays: one `rays.trace` request
 * for each of the run's curvature sets (`RungInputs.curvatureRaySets`), the rays the sections launch, field by field:
 * the four parabasal rays of each field and its real-ray fans, beside its chief ray, which every engine traces as
 * given. Where each engine has the tangential and the sagittal focus of each field relative to its chief ray is
 * compared, with where the rays land (`src/compare/raysCurvature.ts`). It is asked of the engines of the run, and only
 * of a run whose source has curvature sets: a LensVisualizer lens at infinity focus that is not folded.
 */
export const r10aRung: RungDefinition = Object.freeze({
  id: "r10a",
  quantity: RAYS_TRACE,
  needsCurvatureRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    requestsOfSets(opticalCase, inputs?.curvatureRaySets ?? []),
});

/** The engines of the rung `r10b`: LensVisualizer, whose sections are asked, and optiland's own `FieldCurvature`. */
export const R10B_ENGINES: readonly string[] = Object.freeze(["lv", "optiland"]);

/**
 * The rung `r10b`, LensVisualizer's field-curve and astigmatism sections beside an engine's own field curves: one
 * `curvature.native` request (`RungInputs.curvatureAsks`), at every line of the case and at the sections' own fields,
 * asked of LensVisualizer, whose answer is its sections' foci, and of optiland, whose answer is its own
 * `FieldCurvature`. Recorded, of those two engines and of no other, and run only where it is named: optiland is not on
 * every machine.
 */
export const r10bRung: RungDefinition = Object.freeze({
  id: "r10b",
  quantity: CURVATURE_NATIVE,
  needsCurvatureRaySets: true,
  engines: R10B_ENGINES,
  onlyWhereNamed: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.curvatureAsks ?? []).map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: CURVATURE_NATIVE, spec: spec as JsonObject }),
    ),
});

/**
 * The rung `r11a`, LensVisualizer's vignetting tab on identical rays: one `rays.trace` request for each of the run's
 * vignetting sets (`RungInputs.vignettingRaySets`): the tab's own trace of each field's beam on its launch lattice and
 * the chief rays of its image mapping, which every engine traces as given. Which rays get through, how much flux the
 * two engines disagree about, the flux each field's beam brings into the image relative to the axis's and where the
 * mapping's chief rays land are compared (`src/compare/raysVignetting.ts`). It is asked of the engines of the
 * run, and only of a run whose source has vignetting sets: a LensVisualizer lens at infinity focus that is not folded.
 */
export const r11aRung: RungDefinition = Object.freeze({
  id: "r11a",
  quantity: RAYS_TRACE,
  needsVignettingRaySets: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    requestsOfSets(opticalCase, inputs?.vignettingRaySets ?? []),
});

/** The engines of the rung `r11b`: LensVisualizer, whose tab is asked, and the comparator's flux estimator on its rays. */
export const R11B_ENGINES: readonly string[] = Object.freeze(["lv", "flux"]);

/**
 * The rung `r11b`, LensVisualizer's vignetting tab beside the comparator's flux in two dimensions: one
 * `vignetting.native` request (`RungInputs.vignettingAsks`), at the lines the tab traces and its own fields, asked of
 * LensVisualizer, whose answer is its tab's curve, and of the engine `flux`, whose answer is the area and the flux into
 * the image of LensVisualizer's lattice over each field's beam, traced by LensVisualizer. Where the run states a
 * `sampling.bundleGrid`, the engine `flux` is handed `FINE_GRID_FACTOR` times it as its option `bundleGrid`, the cells
 * across the coarser of its two lattices: as its default (64, then 128) is twice the run's default of 32, its coarser
 * lattice is never the run's own, whose staircase rim moves a field's figures by up to 0.02 on doubling. A run of more
 * than 64 cells gives the engine more than its largest lattice, which it answers as unsupported (`option.bundleGrid`),
 * never on a lattice it was not asked for. Recorded, of those two engines and of no other, and run only where it is
 * named.
 */
export const r11bRung: RungDefinition = Object.freeze({
  id: "r11b",
  quantity: VIGNETTING_NATIVE,
  needsVignettingRaySets: true,
  engines: R11B_ENGINES,
  onlyWhereNamed: true,
  engineOptions: (runSpec: RunSpec, _inputs?: RungInputs, engineId?: string): JsonObject | undefined => {
    const bundleGrid = runSpec.sampling?.bundleGrid;
    return engineId === "flux" && bundleGrid !== undefined ? { bundleGrid: FINE_GRID_FACTOR * bundleGrid } : undefined;
  },
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] =>
    (inputs?.vignettingAsks ?? []).map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: VIGNETTING_NATIVE, spec: spec as JsonObject }),
    ),
});

/** The engines of the rung `r12b`: LensVisualizer, whose summary tab is asked, and optiland's own accessors. */
export const R12B_ENGINES: readonly string[] = Object.freeze(["lv", "optiland"]);

/**
 * The `summary.native` spec of a case: its lines whose indices are the prescription's own (`indexSource`
 * "authored"), at which LensVisualizer's summary tab is first-order; null for a case of no such line (every photopic
 * and spectral run) and for a case LensVisualizer did not export (`provenance.source.kind` other than "lv-lens"), whose
 * state has no summary tab, as the other rungs about engines of their own ask nothing of such a case. Decided from the
 * case alone: an engine refuses a line it cannot answer.
 */
export function summaryNativeSpec(opticalCase: OpticalCase): SummaryNativeSpec | null {
  if (opticalCase.provenance.source.kind !== "lv-lens") return null;
  const lines = opticalCase.conditions.lines.flatMap((line, index) => (line.indexSource === "authored" ? [index] : []));
  return lines.length === 0 ? null : { lines };
}

/**
 * The rung `r12b`, LensVisualizer's summary tab and aperture control beside an engine's own first-order summary: one
 * `summary.native` request (`summaryNativeSpec`), at the case's lines of the prescription's own indices, asked of
 * LensVisualizer, whose answer is its tab's readouts and its control's f-numbers, and of optiland, whose answer is its
 * own paraxial accessors and its working f-number of the real rim rays. Recorded, of those two engines and of no other,
 * and run only where it is named: optiland is not on every machine.
 */
export const r12bRung: RungDefinition = Object.freeze({
  id: "r12b",
  quantity: SUMMARY_NATIVE,
  engines: R12B_ENGINES,
  onlyWhereNamed: true,
  buildRequests: (opticalCase: OpticalCase): QuantityRequest[] => {
    const spec = summaryNativeSpec(opticalCase);
    return spec === null
      ? []
      : [makeRequest({ caseId: opticalCase.id, quantity: SUMMARY_NATIVE, spec: spec as JsonObject })];
  },
});

/** The engines of the rung `r13b`: the comparator's sums on the reference engine's model, and optiland's own. */
export const R13B_ENGINES: readonly string[] = Object.freeze(["ref-seidel", "optiland"]);

/**
 * The `seidel.native` spec of a case and its recipe: at the case's first line (its reference line, OpticStudio's
 * primary wavelength), of the largest field angle the recipe resolved (OpticStudio's maximum field), and, for a case of
 * lines of two wavelengths or more, of its shortest and its longest line as dispersion lines (OpticStudio's extremes of
 * the system's wavelengths). Null where the recipe resolved no angle below 90 degrees.
 */
export function seidelNativeSpec(opticalCase: OpticalCase, recipe: MtfRecipe): SeidelNativeSpec | null {
  const angles = recipe.fields.flatMap((field) => (field.angleDeg === null ? [] : [Math.abs(field.angleDeg)]));
  if (angles.length === 0) return null;
  const maxFieldDeg = Math.max(...angles);
  if (!(maxFieldDeg < 90)) return null;
  const wavelengths = opticalCase.conditions.lines.map((line) => line.wavelengthNm);
  const shortest = wavelengths.indexOf(Math.min(...wavelengths));
  const longest = wavelengths.indexOf(Math.max(...wavelengths));
  return { line: 0, maxFieldDeg, ...(shortest === longest ? {} : { dispersionLines: [shortest, longest] }) };
}

/**
 * The rung `r13b`, the engines' own Seidel sums: one `seidel.native` request (`seidelNativeSpec`) of each case whose
 * run has a recipe, asked of `ref-seidel`, the comparator's sums on the reference engine's model, and of optiland, its
 * own `aberrations`. Recorded, of those two engines and of no other, and run only where it is named: optiland is not on
 * every machine. LensVisualizer presents no Seidel sums.
 */
export const r13bRung: RungDefinition = Object.freeze({
  id: "r13b",
  quantity: SEIDEL_NATIVE,
  needsRecipe: true,
  engines: R13B_ENGINES,
  onlyWhereNamed: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] => {
    const recipe = inputs?.recipe ?? null;
    const spec = recipe === null ? null : seidelNativeSpec(opticalCase, recipe);
    return spec === null
      ? []
      : [makeRequest({ caseId: opticalCase.id, quantity: SEIDEL_NATIVE, spec: spec as unknown as JsonObject })];
  },
});

/** The engines of the rung `r14b`: optiland's own Zernike fit, and the comparator's fit of optiland's raw samples. */
export const R14B_ENGINES: readonly string[] = Object.freeze(["optiland", "optiland-wave"]);

/** The grid of `r14b`'s samples: cells across the square of normalised pupil coordinates, R6c's first. */
export const ZERNIKE_GRID = 128;

/**
 * The orderings `r14b` asks, each with its number of terms: OpticStudio's 37 Standard ones, and 36 Fringe ones, since
 * optiland's 37th Fringe polynomial is not OpticStudio's (docs/gotchas.md).
 */
export const ZERNIKE_ASKS: readonly { readonly ordering: ZernikeOrdering; readonly terms: number }[] = Object.freeze([
  { ordering: "standard", terms: 37 },
  { ordering: "fringe", terms: 36 },
]);

/**
 * The `zernike.native` specs of a recipe: at the case's first line, of the angles the recipe resolved its fields to,
 * in its order, on `ZERNIKE_GRID`, one for each of `ZERNIKE_ASKS`. None where a field has no angle.
 */
export function zernikeNativeSpecs(recipe: MtfRecipe): ZernikeNativeSpec[] {
  const angles = recipe.fields.map((field) => field.angleDeg);
  if (angles.length === 0 || angles.some((angle) => angle === null || !(Math.abs(angle) < 90))) return [];
  return ZERNIKE_ASKS.map(({ ordering, terms }) => ({
    line: 0,
    fieldAnglesDeg: angles as number[],
    grid: ZERNIKE_GRID,
    ordering,
    terms,
  }));
}

/**
 * The rung `r14b`, the engines' own Zernike fits of one wavefront: the `zernike.native` requests of a run's recipe
 * (`zernikeNativeSpecs`), asked of optiland, its own fit of its `Wavefront`, and of `optiland-wave`, the comparator's
 * estimator on optiland's raw samples of the same wavefront. Recorded, of those two engines and of no other, and run
 * only where it is named. LensVisualizer presents no wavefront.
 */
export const r14bRung: RungDefinition = Object.freeze({
  id: "r14b",
  quantity: ZERNIKE_NATIVE,
  needsRecipe: true,
  engines: R14B_ENGINES,
  onlyWhereNamed: true,
  buildRequests: (opticalCase: OpticalCase, _runSpec: RunSpec, inputs?: RungInputs): QuantityRequest[] => {
    const recipe = inputs?.recipe ?? null;
    return (recipe === null ? [] : zernikeNativeSpecs(recipe)).map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: ZERNIKE_NATIVE, spec: spec as unknown as JsonObject }),
    );
  },
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
  r5gRung,
  r6aRung,
  r6bRung,
  r6cRung,
  r7aRung,
  r7bRung,
  r8aRung,
  r8bRung,
  r9aRung,
  r9bRung,
  r10aRung,
  r10bRung,
  r11aRung,
  r11bRung,
  r12bRung,
  r13bRung,
  r14bRung,
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
