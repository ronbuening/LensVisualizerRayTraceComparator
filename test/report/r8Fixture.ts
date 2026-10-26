// Rungs R8a and R8b from end to end on engines that know no LensVisualizer: a suite is run, compared and reported,
// and each report is a golden file. In R8a the reference engine traces mirror pairs of rays along the axis, and two
// stand-ins answer as it does with one exit moved and one ray stopped; in R8b two stand-ins named `lv` and
// `optiland` answer `axial.native`, the first with figures and the second with rays this file writes out. Every
// number is synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { AXIAL_NATIVE, AXIAL_NATIVE_VERSION } from "../../src/contract/quantities/axialNative.ts";
import type {
  AxialFigures,
  AxialNativeData,
  AxialNativeField,
  AxialNativeSpec,
} from "../../src/contract/quantities/axialNative.ts";
import { RAYS_TRACE } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultBody } from "../../src/contract/result.ts";
import { readRunCase } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { createRefEngine } from "../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { axialIntercepts, heightAt, sphericalFigures } from "../../src/estimators/axialIntercept.ts";
import { renderReport } from "../../src/report/index.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { LENS, changed, stopAt } from "../compare/raysSupport.ts";
import { fakeEngine, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";

/** The names of the golden reports: `test/fixtures/golden/r8a-stand-ins.report.md` and `r8b-stand-ins`. */
export const R8A_GOLDEN = "r8a-stand-ins";
export const R8B_GOLDEN = "r8b-stand-ins";

/** A policy of one rung, the rung's entry of the comparator's own policy: its gates, or its bands and limits. */
function policyOf(rung: "r8a" | "r8b"): Policy {
  return { contract: "1.0", kind: "policy", version: 1, rungs: { [rung]: loadPolicy().rungs[rung] } };
}
export const R8A_POLICY: Policy = policyOf("r8a");
export const R8B_POLICY: Policy = policyOf("r8b");

/** What one cycle of a fixture gave. */
export interface R8Cycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  readonly report: { readonly json: string; readonly markdown: string };
}

async function cycle(
  runsDir: string,
  name: string,
  rung: RungDefinition,
  runs: Parameters<typeof suiteOf>[1],
  engines: { readonly [engine: string]: EngineMaker },
  policy: Policy,
): Promise<R8Cycle> {
  const watched = watchedRegistry(engines);
  const rungDefinitions = [rung];
  const { manifest } = await runSuite({
    suite: suiteOf(name, runs),
    registry: watched.registry,
    runsDir,
    rungDefinitions,
    rungs: [rung.id],
  });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const cases = (caseId: string) => readRunCase(join(runsDir, name), caseId);
  const comparisons = compareManifest({ manifest, store, policy, rungDefinitions, cases });
  return { manifest, comparisons, report: renderReport(manifest, comparisons, policy) };
}

// ── R8a ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Mirror pairs of rays along the axis of `LENS` at a line: heights 1, 2 and 2.5 pass its stop, 4.5 does not. */
function pairsAt(line: number): RaysTraceSpec {
  const heights = [1, -1, 2, -2, 2.5, -2.5, 4.5, -4.5];
  return {
    line,
    origins: encodeNdArray(Float64Array.from(heights.flatMap((y) => [0, y, -10])), [heights.length, 3]),
    directions: encodeNdArray(Float64Array.from(heights.flatMap(() => [0, 0, 1])), [heights.length, 3]),
    weights: encodeNdArray(new Float64Array(heights.length).fill(1)),
    groups: { field: { angleDeg: 0 } },
  };
}

/** The rung `r8a` as a case without a LensVisualizer tab can be asked it: the pairs at both lines of `LENS`. */
export const R8A_FIXTURE_RUNG: RungDefinition = {
  id: "r8a",
  quantity: RAYS_TRACE,
  buildRequests: (opticalCase) =>
    [pairsAt(0), pairsAt(1)].map((spec) => makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec })),
};

/** The reference engine, under the id it is made with, answering as `answer` changes its trace. */
function refLike(change?: (data: RaysTraceData, request: QuantityRequest) => RaysTraceData): EngineMaker {
  return async (id) => {
    const adapter = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = { ...described, identity: { ...described.identity, id } };
    return {
      id,
      describe: async () => descriptor,
      run: async (request, opticalCase) => {
        const result = await adapter.run(request, opticalCase);
        if (result.status !== "ok" || change === undefined)
          return { ...result, engine: engineStamp(descriptor.identity) };
        const data = change(result.data as unknown as RaysTraceData, request) as unknown as JsonObject;
        return makeResult(request, engineStamp(descriptor.identity), { status: "ok", method: result.method, data });
      },
      close: () => adapter.close(),
    };
  };
}

/**
 * The engines of R8a: `ref`; `moved`, which has ray 2 of the second line leave the last surface 2^-26 mm (1.49e-8
 * mm) further along y in the same direction, so that it crosses the axis that over its slope further on, beyond the
 * gate on the transverse scale; and `stopped`, which stops ray 1 of the first line at the first surface.
 */
function r8aEngines(): { readonly [engine: string]: EngineMaker } {
  return {
    ref: refLike(),
    moved: refLike((data, request) =>
      (request.spec as { line: number }).line === 1
        ? changed(data, (arrays) => {
            arrays.exitPoint[3 * 2 + 1] += 2 ** -26;
          })
        : data,
    ),
    stopped: refLike((data, request) =>
      (request.spec as { line: number }).line === 0 ? changed(data, (arrays) => stopAt(arrays, 1, 0)) : data,
    ),
  };
}

/** Runs one run of the lens on the three engines into `runsDir`, compares it by the real gates and reports it. */
export function r8aCycle(runsDir: string): Promise<R8Cycle> {
  return cycle(
    runsDir,
    R8A_GOLDEN,
    R8A_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: LENS, referenceEngine: "ref" }],
    r8aEngines(),
    R8A_POLICY,
  );
}

// ── R8b ──────────────────────────────────────────────────────────────────────────────────────────────────────────

const SPHERICAL: AxialNativeSpec = {
  kind: "spherical",
  lines: [0],
  nearAxis: 0.25,
  marginal: [1, 0.5],
  profile: [0.25, 0.5, 1],
};
const COLOUR: AxialNativeSpec = { kind: "colour", lines: [0, 1], marginal: [1, 0.5] };

/** The rung `r8b` as stand-ins can be asked it: spherical aberration at the first line and colour at both. */
export const R8B_FIXTURE_RUNG: RungDefinition = {
  id: "r8b",
  quantity: AXIAL_NATIVE,
  engines: ["lv", "optiland"],
  buildRequests: (opticalCase) =>
    [SPHERICAL, COLOUR].map((spec) => makeRequest({ caseId: opticalCase.id, quantity: AXIAL_NATIVE, spec })),
};

/** An engine that offers `axial.native` and answers each request with the body `answerOf` gives for it. */
function axialEngine(answerOf: (request: QuantityRequest) => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: { ...described.capabilities, quantities: { [AXIAL_NATIVE]: { version: AXIAL_NATIVE_VERSION } } },
    };
    return {
      id,
      describe: async () => descriptor,
      run: async (request) => makeResult(request, engineStamp(descriptor.identity), answerOf(request)),
      close: () => adapter.close(),
    };
  };
}

const IMAGE_Z = LENS.conditions.imageZ;

/** Where a ray of fraction f crosses the axis at a line: f^2 in front of the image plane, a 64th further at line 1. */
function interceptOf(fraction: number, line: number): number {
  return IMAGE_Z - fraction * fraction + line / 64;
}

/** The rays of signed fractions at a line, leaving z = 50 at the height 8 f toward their crossing. */
function raysOf(fractions: readonly number[], line: number): NonNullable<AxialNativeField["rays"]> {
  return {
    fractions: encodeNdArray(Float64Array.from(fractions)),
    arrived: encodeNdArray(new Uint8Array(fractions.length).fill(1)),
    exitPoint: encodeNdArray(Float64Array.from(fractions.flatMap((f) => [0, 8 * f, 50])), [fractions.length, 3]),
    exitDirection: encodeNdArray(
      Float64Array.from(fractions.flatMap((f) => [0, -8 * f, interceptOf(Math.abs(f), line) - 50])),
      [fractions.length, 3],
    ),
  };
}

/** The figures the comparator's estimator forms of rays: what the stand-in for LensVisualizer states, nearly. */
function figuresOf(rays: NonNullable<AxialNativeField["rays"]>): AxialFigures {
  const values = (wire: Parameters<typeof decodeNdArray>[0]) => decodeNdArray(wire).values as Float64Array;
  const set = axialIntercepts({
    exitPoint: values(rays.exitPoint),
    exitDirection: values(rays.exitDirection),
    valid: decodeNdArray(rays.arrived).values,
  });
  const made = sphericalFigures(
    set,
    { fractions: values(rays.fractions), nearAxis: 0.25, marginal: [1, 0.5], profile: [0.25, 0.5, 1] },
    IMAGE_Z,
  );
  if (!("figures" in made)) throw new Error(made.reason);
  return { ...made.figures, profileMm: encodeNdArray(made.figures.profileMm) };
}

function field(line: number, more: Partial<AxialNativeField>): AxialNativeField {
  const wavelengthNm = LENS.conditions.lines[line].wavelengthNm;
  return { line, wavelengthNm, status: "ok", paraxialFocusZ: null, figures: null, rays: null, sampling: {}, ...more };
}

function body(method: string, kind: AxialNativeData["kind"], fields: AxialNativeField[]): ResultBody {
  const data: AxialNativeData = { kind, pupilRadiusMm: 8, fields, method: { name: method, params: {} }, notes: [] };
  return { status: "ok", data: data as unknown as JsonObject };
}

/**
 * The stand-ins of R8b. `optiland` states its rays at every line and a paraxial focus a 32nd further back at the
 * second line. `lv` states figures: of spherical aberration the estimator's of those rays with the near-axis
 * intercept a 1024th further back, beyond the spherical figures' band; of colour the marginal ray at the first line as
 * the rays have it, and at the second line 2^-20 mm further back, as by an arithmetic of its own at the case's own
 * indices (`indexMaxDelta` 0), landing within the limit of the sorting.
 */
function r8bEngines(): { readonly [engine: string]: EngineMaker } {
  const spherical = (request: QuantityRequest): boolean => (request.spec as AxialNativeSpec).kind === "spherical";
  const signed = [0.25, -0.25, 1, -1, 0.5, -0.5];
  const marginal = (line: number, more = 0): AxialFigures => {
    const intercept = interceptOf(1, line) + more;
    return {
      landingMm: heightAt(intercept, -8 / (intercept - 50), IMAGE_Z),
      marginalFraction: 1,
      marginalInterceptZ: intercept,
      nearAxisInterceptZ: null,
      bestFocusZ: null,
      bestFocusRmsMm: null,
      profileMm: null,
    };
  };
  return {
    lv: axialEngine((request) => {
      if (spherical(request)) {
        const figures = figuresOf(raysOf(signed, 0));
        return body("lv-aberrations-tab", "spherical", [
          field(0, { figures: { ...figures, nearAxisInterceptZ: figures.nearAxisInterceptZ! + 1 / 1024 } }),
        ]);
      }
      return body("lv-chromatic-tab", "colour", [
        field(0, { figures: marginal(0) }),
        field(1, { figures: marginal(1, 2 ** -20), sampling: { indexMaxDelta: 0 } }),
      ]);
    }),
    optiland: axialEngine((request) =>
      spherical(request)
        ? body("optiland-real-rays", "spherical", [field(0, { rays: raysOf(signed, 0), paraxialFocusZ: 59.75 })])
        : body("optiland-real-rays", "colour", [
            field(0, { rays: raysOf([1, 0.5], 0), paraxialFocusZ: 59.75 }),
            field(1, { rays: raysOf([1, 0.5], 1), paraxialFocusZ: 59.75 + 1 / 32 }),
          ]),
    ),
  };
}

/** Runs one run on the stand-ins into `runsDir`, compares it by the rung's policy and reports it. */
export function r8bCycle(runsDir: string): Promise<R8Cycle> {
  return cycle(runsDir, R8B_GOLDEN, R8B_FIXTURE_RUNG, [{ name: "lens", opticalCase: LENS }], r8bEngines(), R8B_POLICY);
}
