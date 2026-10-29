// Rungs R13b and R14b from end to end on engines that know no optics: a suite is run, compared and reported, and each
// report is a golden file. Stand-ins named `ref-seidel` and `optiland` answer `seidel.native` of a small lens, the
// second without chromatic sums and with spherical aberration 2^-30 mm apart; stand-ins named `optiland` and
// `optiland-wave` answer `zernike.native` of two fields, the second field unavailable in one, and a coefficient 2^-40
// waves apart. Every number is synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { SEIDEL_NATIVE, SEIDEL_NATIVE_VERSION } from "../../src/contract/quantities/seidelNative.ts";
import type { SeidelNativeData, SeidelNativeSpec } from "../../src/contract/quantities/seidelNative.ts";
import { ZERNIKE_NATIVE, ZERNIKE_NATIVE_VERSION } from "../../src/contract/quantities/zernikeNative.ts";
import type { ZernikeNativeData, ZernikeNativeSpec } from "../../src/contract/quantities/zernikeNative.ts";
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

/** The names of the golden reports: `test/fixtures/golden/r13b-stand-ins.report.md` and `r14b-stand-ins`. */
export const R13B_GOLDEN = "r13b-stand-ins";
export const R14B_GOLDEN = "r14b-stand-ins";

/** A policy of each rung, its entry of the comparator's own policy. */
const policyOf = (rung: "r13b" | "r14b"): Policy => ({
  contract: "1.0",
  kind: "policy",
  version: 1,
  rungs: { [rung]: loadPolicy().rungs[rung] },
});
export const R13B_POLICY: Policy = policyOf("r13b");
export const R14B_POLICY: Policy = policyOf("r14b");

/** What one cycle of the fixture gave. */
export interface R13Cycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  readonly report: { readonly json: string; readonly markdown: string };
}

const SEIDEL_ASK: SeidelNativeSpec = { line: 0, maxFieldDeg: 20, dispersionLines: [1, 0] };
const ZERNIKE_ASK: ZernikeNativeSpec = { line: 0, fieldAnglesDeg: [0, 20], grid: 8, ordering: "standard", terms: 4 };

/** A rung of one request about the lens, asked of two stand-ins. */
function rungOf(id: string, quantity: string, spec: object, engines: string[]): RungDefinition {
  return {
    id,
    quantity,
    engines,
    buildRequests: (opticalCase) => [
      makeRequest({ caseId: opticalCase.id, quantity, spec: spec as unknown as JsonObject }),
    ],
  };
}

/** An engine that offers `quantity` and answers each request with the body `answer` gives. */
function standIn(quantity: string, version: number, answer: () => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: { ...described.capabilities, quantities: { [quantity]: { version } } },
    };
    return {
      id,
      describe: async () => descriptor,
      run: async (request) => makeResult(request, engineStamp(descriptor.identity), answer()),
      close: () => adapter.close(),
    };
  };
}

/** The sums of two surfaces and their total at the lens's first line, the colour of lines 1 and 0. */
function sums(name: string, delta: number, colour: boolean): SeidelNativeData {
  const chromatic = (value: number) => (colour ? value : null);
  return {
    line: { index: 0, wavelengthNm: LENS.conditions.lines[0].wavelengthNm },
    maxFieldDeg: 20,
    dispersionLines: [1, 0],
    status: "ok",
    invariant: 1.25,
    surfaces: [
      {
        surface: 0,
        SPHA: 0.5 + delta,
        COMA: 0.25,
        ASTI: 0.125,
        FCUR: 0.0625,
        DIST: 0.03125,
        CLA: chromatic(0.375),
        CTR: chromatic(0.0625),
      },
      {
        surface: 1,
        SPHA: -0.25,
        COMA: -0.125,
        ASTI: -0.0625,
        FCUR: 0.0625,
        DIST: -0.015625,
        CLA: chromatic(-0.125),
        CTR: chromatic(0),
      },
    ],
    total: {
      SPHA: 0.25 + delta,
      COMA: 0.125,
      ASTI: 0.0625,
      FCUR: 0.125,
      DIST: 0.015625,
      CLA: chromatic(0.25),
      CTR: chromatic(0.0625),
    },
    sampling: { marginalSlopeImageSpace: -0.125 },
    method: { name, params: {} },
    notes: [],
  };
}

/** The figures of two fields, the second unavailable where `dark`. */
function fits(name: string, delta: number, dark: boolean): ZernikeNativeData {
  const ok = {
    status: "ok" as const,
    rmsToChiefWaves: 0.0625,
    pvToChiefWaves: 0.25,
    fitResidualRmsWaves: 2 ** -20,
    fitCondition: 2.5,
    validSamples: 32,
    sampling: { gridSize: 8 },
  };
  return {
    line: { index: 0, wavelengthNm: LENS.conditions.lines[0].wavelengthNm },
    grid: 8,
    ordering: "standard",
    terms: 4,
    fields: [
      { fieldAngleDeg: 0, imageHeightMm: 0, coefficients: [0.125, 0, 0, 0.0625 + delta], ...ok },
      dark
        ? {
            fieldAngleDeg: 20,
            imageHeightMm: null,
            status: "unavailable",
            reason: "optiland-raised-ValueError",
            coefficients: [],
            rmsToChiefWaves: null,
            pvToChiefWaves: null,
            fitResidualRmsWaves: null,
            fitCondition: null,
            validSamples: 0,
            sampling: {},
          }
        : { fieldAngleDeg: 20, imageHeightMm: 8.5, coefficients: [0.5, 0, -0.25, 0.125], ...ok },
    ],
    method: { name, params: {} },
    notes: [],
  };
}

const body = (data: object): ResultBody => ({ status: "ok", data: data as unknown as JsonObject });

/** Runs one run of one rung on its stand-ins into `runsDir`, compares it by the rung's policy and reports it. */
async function cycleOf(
  golden: string,
  rung: RungDefinition,
  engines: { readonly [engine: string]: EngineMaker },
  policy: Policy,
  runsDir: string,
): Promise<R13Cycle> {
  const watched = watchedRegistry(engines);
  const rungDefinitions = [rung];
  const { manifest } = await runSuite({
    suite: suiteOf(golden, [{ name: "lens", opticalCase: LENS }]),
    registry: watched.registry,
    runsDir,
    rungDefinitions,
    rungs: [rung.id],
  });
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const cases = (caseId: string) => readRunCase(join(runsDir, golden), caseId);
  const comparisons = compareManifest({ manifest, store, policy, rungDefinitions, cases });
  return { manifest, comparisons, report: renderReport(manifest, comparisons, policy) };
}

/** R13b on its stand-ins: `ref-seidel` with colour, `optiland` without, their SPHA 2^-30 mm apart. */
export async function r13bCycle(runsDir: string): Promise<R13Cycle> {
  return cycleOf(
    R13B_GOLDEN,
    rungOf("r13b", SEIDEL_NATIVE, SEIDEL_ASK, ["ref-seidel", "optiland"]),
    {
      "ref-seidel": standIn(SEIDEL_NATIVE, SEIDEL_NATIVE_VERSION, () => body(sums("paraxial-seidel-sums", 0, true))),
      optiland: standIn(SEIDEL_NATIVE, SEIDEL_NATIVE_VERSION, () => body(sums("optiland-seidels", 2 ** -30, false))),
    },
    R13B_POLICY,
    runsDir,
  );
}

/** R14b on its stand-ins: `optiland` with its second field unavailable, `optiland-wave` with a coefficient apart. */
export async function r14bCycle(runsDir: string): Promise<R13Cycle> {
  return cycleOf(
    R14B_GOLDEN,
    rungOf("r14b", ZERNIKE_NATIVE, ZERNIKE_ASK, ["optiland", "optiland-wave"]),
    {
      optiland: standIn(ZERNIKE_NATIVE, ZERNIKE_NATIVE_VERSION, () => body(fits("optiland-zernike-fit", 0, true))),
      "optiland-wave": standIn(ZERNIKE_NATIVE, ZERNIKE_NATIVE_VERSION, () =>
        body(fits("comparator-zernike-optiland-wavefront", 2 ** -40, false)),
      ),
    },
    R14B_POLICY,
    runsDir,
  );
}
