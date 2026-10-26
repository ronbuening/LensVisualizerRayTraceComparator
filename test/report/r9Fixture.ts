// Rungs R9a and R9b from end to end on engines that know no LensVisualizer: a suite is run, compared and reported,
// and each report is a golden file. In R9a the reference engine traces a set of chief rays with a near-axis probe at
// two lines, and two stand-ins answer as it does with one landing moved and one ray stopped; in R9b two stand-ins
// named `lv` and `optiland` answer `chief.native`, the first with figures as LensVisualizer's tabs state them and the
// second with figures and chief rays as optiland's worker states them. Every number is synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { CHIEF_NATIVE, CHIEF_NATIVE_VERSION } from "../../src/contract/quantities/chiefNative.ts";
import type {
  ChiefFigures,
  ChiefNativeData,
  ChiefNativeField,
  ChiefNativeSpec,
  ChiefReference,
} from "../../src/contract/quantities/chiefNative.ts";
import { RAYS_TRACE } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
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
import { changed, stopAt } from "../compare/raysSupport.ts";
import { fakeEngine, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import { caseOf, sphere } from "../engines/ref/support.ts";

/** The names of the golden reports: `test/fixtures/golden/r9a-stand-ins.report.md` and `r9b-stand-ins`. */
export const R9A_GOLDEN = "r9a-stand-ins";
export const R9B_GOLDEN = "r9b-stand-ins";

/** A policy of one rung, the rung's entry of the comparator's own policy: its gates, or its limit and units. */
function policyOf(rung: "r9a" | "r9b"): Policy {
  return { contract: "1.0", kind: "policy", version: 1, rungs: { [rung]: loadPolicy().rungs[rung] } };
}
export const R9A_POLICY: Policy = policyOf("r9a");
export const R9B_POLICY: Policy = policyOf("r9b");

/** What one cycle of a fixture gave. */
export interface R9Cycle {
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
): Promise<R9Cycle> {
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

// ── R9a ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A singlet and a stop 7 mm behind it at two lines, no obstruction: every chief ray through the stop's centre lands. */
export const CHIEF_LENS = caseOf(
  [
    { z: 0, shape: sphere(40), index: [1.5, 1.52] },
    { z: 5, shape: sphere(-60), index: [1, 1] },
    { z: 7, shape: sphere(Infinity), index: [1, 1], semiDiameter: 3, clipRadius: 3 },
  ],
  { stopIndex: 2, stopSemiDiameter: 3, lines: 2, imageZ: 60 },
);

/** The slopes of the set: a near-axis probe first, then fields of growing angle. */
const SLOPES = [-0.001, -0.02, -0.05, -0.08] as const;

/**
 * Chief rays aimed at the stop's vertex as if the singlet were not there, launched 10 mm ahead of the first vertex
 * along `(0, u, 1)` made a unit vector, as LensVisualizer's meridional launch makes them; the probe first, stated
 * under `groups.chiefIndex`. The same rays at both lines: one span.
 */
function chiefAt(line: number): RaysTraceSpec {
  return {
    line,
    origins: encodeNdArray(Float64Array.from(SLOPES.flatMap((u) => [0, -u * 17, -10])), [SLOPES.length, 3]),
    directions: encodeNdArray(
      Float64Array.from(
        SLOPES.flatMap((u) => {
          const length = Math.sqrt(u * u + 1);
          return [0, u / length, 1 / length];
        }),
      ),
      [SLOPES.length, 3],
    ),
    weights: encodeNdArray(new Float64Array(SLOPES.length).fill(1)),
    groups: { chiefIndex: 0 },
  };
}

/** The rung `r9a` as a case without LensVisualizer's tabs can be asked it: the set at both lines of the lens. */
export const R9A_FIXTURE_RUNG: RungDefinition = {
  id: "r9a",
  quantity: RAYS_TRACE,
  buildRequests: (opticalCase) =>
    [chiefAt(0), chiefAt(1)].map((spec) => makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec })),
};

/** The reference engine, under the id it is made with, answering as `change` changes its trace. */
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
 * The engines of R9a: `ref`; `moved`, which lands ray 2 of the second line 2^-26 mm (1.49e-8 mm) further along y,
 * beyond the gate as a landing, as a lateral colour and as a distortion; and `stopped`, which stops ray 3 of the first
 * line at the first surface.
 */
function r9aEngines(): { readonly [engine: string]: EngineMaker } {
  const lineOf = (request: QuantityRequest): number => (request.spec as { line: number }).line;
  return {
    ref: refLike(),
    moved: refLike((data, request) =>
      lineOf(request) === 1
        ? changed(data, (arrays) => {
            arrays.imagePoint[3 * 2 + 1] += 2 ** -26;
          })
        : data,
    ),
    stopped: refLike((data, request) =>
      lineOf(request) === 0 ? changed(data, (arrays) => stopAt(arrays, 3, 0)) : data,
    ),
  };
}

/** Runs one run of the lens on the three engines into `runsDir`, compares it by the real gates and reports it. */
export function r9aCycle(runsDir: string): Promise<R9Cycle> {
  return cycle(
    runsDir,
    R9A_GOLDEN,
    R9A_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: CHIEF_LENS, referenceEngine: "ref" }],
    r9aEngines(),
    R9A_POLICY,
  );
}

// ── R9b ──────────────────────────────────────────────────────────────────────────────────────────────────────────

const DISTORTION: ChiefNativeSpec = { kind: "distortion", lines: [0], maxFieldDeg: 20, fieldAnglesDeg: [5, 10, 20] };
const LATERAL: ChiefNativeSpec = {
  kind: "lateral-colour",
  lines: [0, 1],
  maxFieldDeg: 20,
  fieldAnglesDeg: [0, 10, 20],
};
const PUPILS: ChiefNativeSpec = { kind: "pupils", lines: [0], maxFieldDeg: 20, fieldAnglesDeg: [10, 20] };

/** The rung `r9b` as stand-ins can be asked it: distortion and pupils at the first line, lateral colour at both. */
export const R9B_FIXTURE_RUNG: RungDefinition = {
  id: "r9b",
  quantity: CHIEF_NATIVE,
  engines: ["lv", "optiland"],
  buildRequests: (opticalCase) =>
    [DISTORTION, LATERAL, PUPILS].map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: CHIEF_NATIVE, spec: spec as unknown as JsonObject }),
    ),
};

/** An engine that offers `chief.native` and answers each request with the body `answerOf` gives for it. */
function chiefEngine(answerOf: (spec: ChiefNativeSpec) => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: { ...described.capabilities, quantities: { [CHIEF_NATIVE]: { version: CHIEF_NATIVE_VERSION } } },
    };
    return {
      id,
      describe: async () => descriptor,
      run: async (request) =>
        makeResult(request, engineStamp(descriptor.identity), answerOf(request.spec as unknown as ChiefNativeSpec)),
      close: () => adapter.close(),
    };
  };
}

const NO_FIGURES: ChiefFigures = {
  realHeightMm: null,
  idealHeightMm: null,
  percent: null,
  entrancePupilZ: null,
  exitPupilZ: null,
};
const NO_REFERENCE: ChiefReference = {
  focalScaleMm: null,
  probeAngleDeg: null,
  paraxialEntrancePupilZ: null,
  paraxialExitPupilZ: null,
};

function field(line: number, fieldAngleDeg: number, more: Partial<ChiefNativeField>): ChiefNativeField {
  const wavelengthNm = CHIEF_LENS.conditions.lines[line].wavelengthNm;
  const base = { line, wavelengthNm, fieldAngleDeg, status: "ok" as const, chiefLandingMm: null };
  return { ...base, figures: null, chiefRay: null, sampling: {}, ...more };
}

function body(
  method: string,
  kind: ChiefNativeData["kind"],
  fields: ChiefNativeField[],
  reference: Partial<ChiefReference> = {},
): ResultBody {
  const data: ChiefNativeData = {
    kind,
    fields,
    reference: { ...NO_REFERENCE, ...reference },
    method: { name: method, params: {} },
    notes: [],
  };
  return { status: "ok", data: data as unknown as JsonObject };
}

/**
 * A distortion field: a real height, the ideal height half a millimetre a degree and the percent between them, the
 * chief ray landing at `landing`, the real height unless it is said.
 */
function distorted(angle: number, real: number, landing = real): ChiefNativeField {
  const ideal = -0.5 * angle;
  return field(0, angle, {
    chiefLandingMm: landing,
    figures: { ...NO_FIGURES, realHeightMm: real, idealHeightMm: ideal, percent: (100 * (real - ideal)) / ideal },
  });
}

/**
 * The stand-ins of R9b, the field's chief ray landing at the same height in both but where it is said otherwise.
 *
 * - Distortion at 5, 10 and 20 degrees: `optiland`'s curve at 10 degrees has its real height 2^-12 mm further from
 *   the axis than its chief ray lands, which moves its percent; it has no scale at 20 degrees (unavailable), and its
 *   reference scale is 2^-14 mm larger.
 * - Lateral colour at 0, 10 and 20 degrees at both lines: `lv` states its channels' indices as 0 from the case's but at
 *   20 degrees of the second line (2^-16, data); `optiland` lands the second line 2^-20 mm further at 10 degrees.
 * - Pupils at 10 and 20 degrees: `lv` states its pupils, `optiland` its chief rays, whose lines cross the axis at 8 and
 *   8.5 ahead of the system and at 12 behind it; `lv`'s entrance pupil at 10 degrees is 2^-8 mm further back, and
 *   `optiland`'s paraxial entrance pupil 2^-20 mm.
 */
function r9bEngines(): { readonly [engine: string]: EngineMaker } {
  const lateral = (line: number, angle: number, more: number, sampling: ChiefNativeField["sampling"]) =>
    field(line, angle, { chiefLandingMm: -0.4 * angle - line * (angle / 10) * 2 ** -10 - more, sampling });
  return {
    lv: chiefEngine((spec) => {
      if (spec.kind === "distortion") {
        return body(
          "lv-distortion-tab",
          "distortion",
          [distorted(5, -2.5), distorted(10, -4.96875), distorted(20, -9.75)],
          {
            focalScaleMm: 28.5,
            probeAngleDeg: 0.25,
          },
        );
      }
      if (spec.kind === "lateral-colour") {
        return body("lv-chromatic-tab", "lateral-colour", [
          ...[0, 10, 20].map((angle) => lateral(0, angle, 0, { indexMaxDelta: 0 })),
          ...[0, 10, 20].map((angle) => lateral(1, angle, 0, { indexMaxDelta: angle === 20 ? 2 ** -16 : 0 })),
        ]);
      }
      return body(
        "lv-pupils-tab",
        "pupils",
        [
          field(0, 10, { chiefLandingMm: -4, figures: { ...NO_FIGURES, entrancePupilZ: 8 + 2 ** -8, exitPupilZ: 12 } }),
          field(0, 20, { chiefLandingMm: -8, figures: { ...NO_FIGURES, entrancePupilZ: 8.5, exitPupilZ: 12 } }),
        ],
        { paraxialEntrancePupilZ: 7.5, paraxialExitPupilZ: 12 },
      );
    }),
    optiland: chiefEngine((spec) => {
      if (spec.kind === "distortion") {
        const scale = 28.5 + 2 ** -14;
        const fields = [
          distorted(5, -2.5),
          distorted(10, -4.96875 - 2 ** -12, -4.96875),
          field(0, 20, { status: "unavailable", reason: "no-scale", chiefLandingMm: -9.75 }),
        ];
        return body("optiland-distortion", "distortion", fields, { focalScaleMm: scale, probeAngleDeg: 2e-9 });
      }
      if (spec.kind === "lateral-colour") {
        return body("optiland-chief-rays", "lateral-colour", [
          ...[0, 10, 20].map((angle) => lateral(0, angle, 0, {})),
          ...[0, 10, 20].map((angle) => lateral(1, angle, angle === 10 ? 2 ** -20 : 0, {})),
        ]);
      }
      // Lines that cross the axis at 8 and 8.5 ahead of the first vertex, and at 12 behind the last surface.
      const ray = (height: number) => ({
        entryPoint: [0, height, 0],
        entryDirection: [0, -0.125, 1],
        exitPoint: [0, 1, 10],
        exitDirection: [0, -0.5, 1],
      });
      return body(
        "optiland-chief-rays",
        "pupils",
        [
          field(0, 10, { chiefLandingMm: -4, chiefRay: ray(1) }),
          field(0, 20, { chiefLandingMm: -8, chiefRay: ray(1.0625) }),
        ],
        { paraxialEntrancePupilZ: 7.5 + 2 ** -20, paraxialExitPupilZ: 12 },
      );
    }),
  };
}

/** Runs one run on the stand-ins into `runsDir`, compares it by the rung's policy and reports it. */
export function r9bCycle(runsDir: string): Promise<R9Cycle> {
  return cycle(
    runsDir,
    R9B_GOLDEN,
    R9B_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: CHIEF_LENS }],
    r9bEngines(),
    R9B_POLICY,
  );
}
