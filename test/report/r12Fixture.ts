// Rung R12b from end to end on engines that know no LensVisualizer: a suite is run, compared and reported, and the
// report is a golden file. Two stand-ins named `lv` and `optiland` answer `summary.native` at both lines of a small
// lens, the first as LensVisualizer's summary tab and aperture control present it (a marked f-number and a half field,
// no f-number of a real ray) and the second as optiland's accessors do (a working f-number of the rim rays, no marked
// f-number). Every number is synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { SUMMARY_NATIVE, SUMMARY_NATIVE_VERSION } from "../../src/contract/quantities/summaryNative.ts";
import type {
  SummaryNativeData,
  SummaryNativeLine,
  SummaryNativeSpec,
} from "../../src/contract/quantities/summaryNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultBody } from "../../src/contract/result.ts";
import { readRunCase } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { renderReport } from "../../src/report/index.ts";
import { LENS } from "../compare/raysSupport.ts";
import { fakeEngine, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";

/** The name of the golden report: `test/fixtures/golden/r12b-stand-ins.report.md`. */
export const R12B_GOLDEN = "r12b-stand-ins";

/** A policy of one rung, the rung's entry of the comparator's own policy: its limit and units. */
export const R12B_POLICY: Policy = {
  contract: "1.0",
  kind: "policy",
  version: 1,
  rungs: { r12b: loadPolicy().rungs.r12b },
};

/** What one cycle of the fixture gave. */
export interface R12Cycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  readonly report: { readonly json: string; readonly markdown: string };
}

const ASK: SummaryNativeSpec = { lines: [0, 1] };

/** The rung `r12b` as stand-ins can be asked it: a summary at both lines of the lens. */
export const R12B_FIXTURE_RUNG: RungDefinition = {
  id: "r12b",
  quantity: SUMMARY_NATIVE,
  engines: ["lv", "optiland"],
  buildRequests: (opticalCase) => [
    makeRequest({ caseId: opticalCase.id, quantity: SUMMARY_NATIVE, spec: ASK as unknown as JsonObject }),
  ],
};

/** An engine that offers `summary.native` and answers each request with the body `answer` gives. */
function summaryEngine(answer: () => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: {
        ...described.capabilities,
        quantities: { [SUMMARY_NATIVE]: { version: SUMMARY_NATIVE_VERSION } },
      },
    };
    return {
      id,
      describe: async () => descriptor,
      run: async (request) => makeResult(request, engineStamp(descriptor.identity), answer()),
      close: () => adapter.close(),
    };
  };
}

/** A line of a focal length of 50.5 mm, a pupil of 12.625 mm and an image-space f-number of 4. */
function line(index: number, more: Partial<SummaryNativeLine> = {}): SummaryNativeLine {
  return {
    line: index,
    wavelengthNm: LENS.conditions.lines[index].wavelengthNm,
    status: "ok",
    rearFocalZ: 58.5,
    focalLengthMm: 50.5,
    entrancePupilDiameterMm: 12.625,
    stopDiameterMm: 6,
    imageSpaceFNumber: 4,
    paraxialWorkingFNumber: 4,
    workingFNumber: null,
    nominalFNumber: null,
    totalTrackMm: 60,
    halfFieldDeg: null,
    sampling: {},
    ...more,
  };
}

function body(method: string, lines: SummaryNativeLine[]): ResultBody {
  const data: SummaryNativeData = { lines, method: { name: method, params: {} }, notes: [] };
  return { status: "ok", data: data as unknown as JsonObject };
}

/**
 * The stand-ins of R12b at the two lines of the lens.
 *
 * - At the first line `lv` states the tab's pupil 1/64 mm wider (its stop sized by a real ray), so its image-space
 *   f-number is lower by the same proportion: both outside their bands (3e-9 mm and 2e-9), and the pair ATTENTION; it marks the aperture f/4.25 and records a thin-lens estimate of its own
 *   under `sampling`, where `optiland` states a paraxial working f-number of 4 and a working f-number of 4.125 of its
 *   rim rays: the two working f-numbers are unmeasured, with `lv-summary-tab` named.
 * - At the second line the two rear focal points lie 2^-12 mm apart, beyond the limit of 1e-5 mm: data, in no figure,
 *   and the rear focus marks the pair.
 */
function r12bEngines(): { readonly [engine: string]: EngineMaker } {
  const tab = { nominalFNumber: 4.25, paraxialWorkingFNumber: null, halfFieldDeg: 22.5 };
  const estimate = { lvThinLensEffectiveFNumber: 4.25 };
  return {
    lv: summaryEngine(() =>
      body("lv-summary-tab", [
        line(0, {
          ...tab,
          entrancePupilDiameterMm: 12.625 + 1 / 64,
          imageSpaceFNumber: 50.5 / (12.625 + 1 / 64),
          sampling: estimate,
        }),
        line(1, { ...tab, sampling: { ...estimate, wideOpenNominalEntrancePupilDiameterMm: 11.875 } }),
      ]),
    ),
    optiland: summaryEngine(() =>
      body("optiland-summary", [
        line(0, { workingFNumber: 4.125, sampling: { exitPupilDiameterMm: 14.5 } }),
        line(1, { workingFNumber: 4.125, rearFocalZ: 58.5 + 2 ** -12, sampling: { exitPupilDiameterMm: 14.5 } }),
      ]),
    ),
  };
}

/** Runs one run on the stand-ins into `runsDir`, compares it by the rung's policy and reports it. */
export async function r12bCycle(runsDir: string): Promise<R12Cycle> {
  const watched = watchedRegistry(r12bEngines());
  const rungDefinitions = [R12B_FIXTURE_RUNG];
  const { manifest } = await runSuite({
    suite: suiteOf(R12B_GOLDEN, [{ name: "lens", opticalCase: LENS }]),
    registry: watched.registry,
    runsDir,
    rungDefinitions,
    rungs: ["r12b"],
  });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const cases = (caseId: string) => readRunCase(join(runsDir, R12B_GOLDEN), caseId);
  const comparisons = compareManifest({ manifest, store, policy: R12B_POLICY, rungDefinitions, cases });
  return { manifest, comparisons, report: renderReport(manifest, comparisons, R12B_POLICY) };
}
