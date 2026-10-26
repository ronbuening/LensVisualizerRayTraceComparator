// Rungs R7a and R7b from end to end on engines that know no LensVisualizer: a suite is run, compared and reported,
// and each report is a golden file. In R7a the reference engine traces a set of rays with a chief ray, and two
// stand-ins answer as it does with one landing moved and one ray stopped; in R7b two stand-ins named `lv` and
// `optiland` answer `spot.native` with spots and fans this file writes out. Every number is synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { RAYS_TRACE } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData } from "../../src/contract/quantities/raysTrace.ts";
import { SPOT_NATIVE, SPOT_NATIVE_VERSION } from "../../src/contract/quantities/spotNative.ts";
import type { SpotNativeData, SpotNativeField, SpotNativeSpec } from "../../src/contract/quantities/spotNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultBody } from "../../src/contract/result.ts";
import { readRunCase } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { createRefEngine } from "../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { renderReport } from "../../src/report/index.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { LENS, changed, specAt, stopAt } from "../compare/raysSupport.ts";
import { DOUBLE_GAUSS, SINGLET, fakeEngine, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";

/** The names of the golden reports: `test/fixtures/golden/r7a-stand-ins.report.md` and `r7b-stand-ins`. */
export const R7A_GOLDEN = "r7a-stand-ins";
export const R7B_GOLDEN = "r7b-stand-ins";

/** A policy of one rung, the rung's entry of the comparator's own policy: its gates, or its bandless metrics. */
function policyOf(rung: "r7a" | "r7b"): Policy {
  return { contract: "1.0", kind: "policy", version: 1, rungs: { [rung]: loadPolicy().rungs[rung] } };
}
export const R7A_POLICY: Policy = policyOf("r7a");
export const R7B_POLICY: Policy = policyOf("r7b");

/** What one cycle of a fixture gave. */
export interface R7Cycle {
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
): Promise<R7Cycle> {
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

// ── R7a ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** The rung `r7a` as a case without a LensVisualizer tab can be asked it: the seven rays of `SPEC` at both lines. */
export const R7A_FIXTURE_RUNG: RungDefinition = {
  id: "r7a",
  quantity: RAYS_TRACE,
  buildRequests: (opticalCase) =>
    [specAt(0), specAt(1)].map((spec) => makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec })),
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
 * The engines of R7a: `ref`; `moved`, which lands ray 2 of the second line 2^-26 mm (1.49e-8 mm) further along y,
 * beyond the gate; and `stopped`, which stops ray 1 of the first line at the first surface, which no other does.
 */
function r7aEngines(): { readonly [engine: string]: EngineMaker } {
  return {
    ref: refLike(),
    moved: refLike((data, request) =>
      (request.spec as { line: number }).line === 1
        ? changed(data, (arrays) => {
            arrays.imagePoint[3 * 2 + 1] += 2 ** -26;
          })
        : data,
    ),
    stopped: refLike((data, request) =>
      (request.spec as { line: number }).line === 0 ? changed(data, (arrays) => stopAt(arrays, 1, 0)) : data,
    ),
  };
}

/** Runs one run of the lens on the three engines into `runsDir`, compares it by the real gates and reports it. */
export function r7aCycle(runsDir: string): Promise<R7Cycle> {
  return cycle(
    runsDir,
    R7A_GOLDEN,
    R7A_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: LENS, referenceEngine: "ref" }],
    r7aEngines(),
    R7A_POLICY,
  );
}

// ── R7b ──────────────────────────────────────────────────────────────────────────────────────────────────────────

const RINGS_SPEC: SpotNativeSpec = {
  line: 0,
  fields: { kind: "half-field-fractions", values: [0, 0.5, 0.75] },
  pupil: { kind: "rings", rings: [1, 8, 16], weighting: "area" },
};
const FAN_SPEC: SpotNativeSpec = {
  line: 0,
  fields: { kind: "half-field-fractions", values: [0.75] },
  pupil: { kind: "fan", axis: "tangential", samples: 5 },
};

/** The rung `r7b` as stand-ins can be asked it: a spot of three fields and a tangential fan, of `lv` and `optiland`. */
export const R7B_FIXTURE_RUNG: RungDefinition = {
  id: "r7b",
  quantity: SPOT_NATIVE,
  engines: ["lv", "optiland"],
  buildRequests: (opticalCase) =>
    [RINGS_SPEC, FAN_SPEC].map((spec) => makeRequest({ caseId: opticalCase.id, quantity: SPOT_NATIVE, spec })),
};

/** An engine that offers `spot.native` and answers each request with the body `answerOf` gives for it. */
function spotEngine(answerOf: (request: QuantityRequest) => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: { ...described.capabilities, quantities: { [SPOT_NATIVE]: { version: SPOT_NATIVE_VERSION } } },
    };
    return {
      id,
      describe: async () => descriptor,
      run: async (request) => makeResult(request, engineStamp(descriptor.identity), answerOf(request)),
      close: () => adapter.close(),
    };
  };
}

function spotField(field: number, centroidY: number, rms: number, height: number | null): SpotNativeField {
  return {
    field,
    fieldAngleDeg: 20 * field,
    imageHeightMm: height,
    status: "ok",
    spot: { centroidMm: [0, centroidY], rmsRadiusMm: rms },
    fan: null,
    sampling: { raysLaunched: 25, raysLanded: 25 },
  };
}

function fanField(errors: readonly number[]): SpotNativeField {
  return {
    field: 0.75,
    fieldAngleDeg: 15,
    imageHeightMm: 12,
    status: "ok",
    spot: null,
    fan: {
      pupil: encodeNdArray(Float64Array.of(-1, -0.5, 0, 0.5, 1)),
      errorMm: encodeNdArray(Float64Array.from(errors)),
    },
    sampling: { raysLaunched: 5, raysLanded: errors.filter((error) => !Number.isNaN(error)).length },
  };
}

function answerOf(
  method: string,
  pattern: "rings" | "fan",
  fields: SpotNativeField[],
  wavelengthNm = 587.5,
): ResultBody {
  const data: SpotNativeData = {
    pattern,
    fields,
    method: { name: method, params: {} },
    lines: [{ wavelengthNm, weight: 1 }],
    notes: [],
  };
  return { status: "ok", data: data as unknown as JsonObject };
}

/**
 * The stand-ins of R7b. On the singlet, every field of the spot is one of two methods, the second's centroid and
 * radius a binary fraction away; its fan lost one sample at the rim of each. On the Double-Gauss, the stand-in for
 * optiland has no chief ray of the half field and could not compute the full field, and is of another line in its
 * fan.
 */
function r7bEngines(): { readonly [engine: string]: EngineMaker } {
  const singlet = (request: QuantityRequest): boolean => request.caseId === SINGLET.id;
  const rings = (request: QuantityRequest): boolean => (request.spec as SpotNativeSpec).pupil.kind === "rings";
  return {
    lv: spotEngine((request) =>
      rings(request)
        ? answerOf("lv-coma-tab", "rings", [
            spotField(0, 0, 1 / 64, 0),
            spotField(0.5, -1 / 32, 1 / 16, 8),
            spotField(0.75, -1 / 16, 1 / 8, 12),
          ])
        : answerOf("lv-coma-tab", "fan", [fanField([NaN, -1 / 8, 0, 1 / 4, 1 / 2])]),
    ),
    optiland: spotEngine((request) => {
      if (rings(request)) {
        return singlet(request)
          ? answerOf("optiland-spot-diagram", "rings", [
              spotField(0, 0, 1 / 64 + 1 / 1024, 0),
              spotField(0.5, -1 / 32 - 1 / 256, 1 / 16, 8),
              spotField(0.75, -1 / 16 + 1 / 128, 1 / 8 + 1 / 512, 12),
            ])
          : answerOf("optiland-spot-diagram", "rings", [
              spotField(0, 0, 1 / 64, 0),
              spotField(0.5, -1 / 32, 1 / 16, null),
              {
                field: 0.75,
                fieldAngleDeg: 15,
                imageHeightMm: null,
                status: "unavailable",
                reason: "optiland-raised-ValueError",
                spot: null,
                fan: null,
                sampling: {},
              },
            ]);
      }
      return singlet(request)
        ? answerOf("optiland-ray-fan", "fan", [fanField([-1 / 4, -1 / 8 + 1 / 256, 0, 1 / 4, NaN])])
        : answerOf("optiland-ray-fan", "fan", [fanField([-1 / 4, -1 / 8, 0, 1 / 4, 1 / 2])], 546.07);
    }),
  };
}

/** Runs two runs on the stand-ins into `runsDir`, compares them by the rung's bandless policy and reports them. */
export function r7bCycle(runsDir: string): Promise<R7Cycle> {
  return cycle(
    runsDir,
    R7B_GOLDEN,
    R7B_FIXTURE_RUNG,
    [
      { name: "singlet", opticalCase: SINGLET },
      { name: "double-gauss", opticalCase: DOUBLE_GAUSS },
    ],
    r7bEngines(),
    R7B_POLICY,
  );
}
