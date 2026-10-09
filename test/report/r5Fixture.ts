// Rung R5 from end to end on engines that know no optics: three stand-ins named `lv`, `optiland` and `wave` answer
// one `mtf.native` request with curves this file writes out, a suite of three runs is run, compared and reported,
// and the report is a golden file. Every number is synthetic: a binary fraction, or a band of the policy.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { followUpsOf } from "../../src/compare/followUp.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { MTF_NATIVE, MTF_NATIVE_VERSION } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData } from "../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultBody } from "../../src/contract/result.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import type { JobOutcome } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { renderReport } from "../../src/report/index.ts";
import { ALL_FEATURES_CASE } from "../contract/corpus.ts";
import { SPEC, answer, raised } from "../compare/mtfNativeSupport.ts";
import type { FieldsOf } from "../compare/mtfNativeSupport.ts";
import { DOUBLE_GAUSS, SINGLET, fakeEngine, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker, WatchedRegistry } from "../core/support.ts";

/** The name of the golden report of the stand-ins: `test/fixtures/golden/r5-stand-ins.report.md`. */
export const R5_GOLDEN = "r5-stand-ins";

/** The bands of the fixture's policy: binary fractions, so that a difference at the edge of one is exact. */
export const ON_AXIS_BAND = 1 / 256;
export const OFF_AXIS_BAND = 1 / 128;
export const CHIEF_LANDING_LIMIT_MM = 1 / 1024;

/** A policy of the one rung, with the fixture's bands. */
export const R5_POLICY: Policy = {
  contract: "1.0",
  kind: "policy",
  version: 1,
  rungs: {
    r5: {
      quantity: MTF_NATIVE,
      mode: "independent-method",
      class: "recorded",
      metrics: {
        "chiefLanding.maxAbs": { attention: CHIEF_LANDING_LIMIT_MM, unit: "mm" },
        "mtfOffAxis.maxAbs": { attention: OFF_AXIS_BAND, unit: "1" },
        "mtfOnAxis.maxAbs": { attention: ON_AXIS_BAND, unit: "1" },
      },
    },
  },
};

/** The rung `r5` as far as engines that know no optics can be asked it: one request of `SPEC`, of three engines. */
export const R5_FIXTURE_RUNG: RungDefinition = {
  id: "r5",
  quantity: MTF_NATIVE,
  engines: ["lv", "optiland", "wave"],
  buildRequests: (opticalCase) => [makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec: SPEC })],
};

/** An engine that offers `mtf.native` and answers each request with the body `answerOf` gives for it. */
export function mtfEngine(answerOf: (request: QuantityRequest) => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const [anyQuantity] = Object.values(described.capabilities.quantities);
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: {
        ...described.capabilities,
        quantities: { [MTF_NATIVE]: { ...anyQuantity, version: MTF_NATIVE_VERSION } },
      },
    };
    return {
      id,
      describe: async () => descriptor,
      run: async (request) => makeResult(request, engineStamp(descriptor.identity), answerOf(request)),
      close: () => adapter.close(),
    };
  };
}

const ok = (data: MtfNativeData): ResultBody => ({ status: "ok", data });

/**
 * What the three stand-ins answer for each run. The differences of `lv` and `optiland`, by run:
 *
 * - `edge` (the singlet): on the axis exactly the band at 10 cycles/mm, off the axis at field 0.5 exactly the band
 *   at 30: inside both, so nothing is asked again. At field 1 the stand-in for optiland lost a rim ray.
 * - `beyond` (the Double-Gauss): on the axis one unit in the last place more than the band at 50 cycles/mm, so
 *   optiland is asked again at 512 rays, and answers the same on the axis and a curve of its own at field 1. At
 *   field 0.5 its chief ray lands twice the limit from LensVisualizer's.
 * - `polychromatic` (the case of every feature): optiland is unsupported.
 *
 * `wave` says of field 1 that it is unconverged in every run.
 */
export function standIns(): { readonly [engine: string]: EngineMaker } {
  const edge = (request: QuantityRequest): boolean => request.caseId === SINGLET.id;
  const beyond = (request: QuantityRequest): boolean => request.caseId === DOUBLE_GAUSS.id;
  const optilandFields = (request: QuantityRequest): FieldsOf => {
    const sampling = { numRays: request.engineOptions?.fftRays === 512 ? 512 : 256, rimRaysLost: 0 };
    if (edge(request)) {
      return [
        { sagittal: raised(-ON_AXIS_BAND, 0), sampling },
        { tangential: raised(-OFF_AXIS_BAND, 1), sampling },
        { sagittal: raised(1 / 8, 2), sampling: { ...sampling, rimRaysLost: 1, rimLandingSpreadMm: 4.5 } },
      ];
    }
    const step = sampling.numRays === 512 ? 1 / 512 : 0;
    return [
      { sagittal: raised(-ON_AXIS_BAND * (1 + 2 ** -40), 2), sampling },
      { imageHeightMm: 8 + 2 * CHIEF_LANDING_LIMIT_MM, sampling },
      { tangential: raised(step, 3), sampling },
    ];
  };
  return {
    lv: mtfEngine(() => ok(answer("lv-product", [{}, {}, {}]))),
    optiland: mtfEngine((request) => {
      if (!edge(request) && !beyond(request)) {
        const message = "the stand-in answers one line";
        return { status: "unsupported", unsupported: [{ code: "feature", item: "lines.polychromatic", message }] };
      }
      return ok(answer("scalar-fft-mtf", optilandFields(request)));
    }),
    wave: mtfEngine(() =>
      ok(answer("hopkins-autocorrelation", [{}, {}, { status: "unconverged", reason: "undersampled" }])),
    ),
  };
}

/** What one cycle of the fixture gave. */
export interface R5Cycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  readonly report: { readonly json: string; readonly markdown: string };
  readonly outcomes: readonly JobOutcome[];
  readonly watched: WatchedRegistry;
}

/** Runs the three runs on the stand-ins into `runsDir`, compares them by `policy` and reports them. */
export async function r5Cycle(runsDir: string, policy: Policy = R5_POLICY): Promise<R5Cycle> {
  const suite = suiteOf("r5-stand-ins", [
    { name: "edge", opticalCase: SINGLET },
    { name: "beyond", opticalCase: DOUBLE_GAUSS },
    { name: "polychromatic", opticalCase: ALL_FEATURES_CASE },
  ]);
  const watched = watchedRegistry(standIns());
  const rungDefinitions = [R5_FIXTURE_RUNG];
  const { manifest, outcomes } = await runSuite({
    suite,
    registry: watched.registry,
    runsDir,
    rungDefinitions,
    rungs: ["r5"],
    followUps: followUpsOf(policy),
  });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const comparisons = compareManifest({ manifest, store, policy, rungDefinitions });
  return { manifest, comparisons, report: renderReport(manifest, comparisons, policy), outcomes, watched };
}
