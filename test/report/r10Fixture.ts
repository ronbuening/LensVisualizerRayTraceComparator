// Rungs R10a and R10b from end to end on engines that know no LensVisualizer: a suite is run, compared and reported,
// and each report is a golden file. In R10a the reference engine traces a curvature set of two fields (each a parabasal
// pair in each section beside its chief ray) through a small lens at two lines, and two stand-ins answer as it does with
// one landing moved and one ray stopped; in R10b two stand-ins named `lv` and `optiland` answer `curvature.native`, the
// first as LensVisualizer's field curves state them and the second as optiland's worker does. Every number is
// synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { CURVATURE_NATIVE, CURVATURE_NATIVE_VERSION } from "../../src/contract/quantities/curvatureNative.ts";
import type {
  CurvatureNativeData,
  CurvatureNativeField,
  CurvatureNativeSpec,
} from "../../src/contract/quantities/curvatureNative.ts";
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

/** The names of the golden reports: `test/fixtures/golden/r10a-stand-ins.report.md` and `r10b-stand-ins`. */
export const R10A_GOLDEN = "r10a-stand-ins";
export const R10B_GOLDEN = "r10b-stand-ins";

/** A policy of one rung, the rung's entry of the comparator's own policy: its gates, or its limit and units. */
function policyOf(rung: "r10a" | "r10b"): Policy {
  return { contract: "1.0", kind: "policy", version: 1, rungs: { [rung]: loadPolicy().rungs[rung] } };
}
export const R10A_POLICY: Policy = policyOf("r10a");
export const R10B_POLICY: Policy = policyOf("r10b");

/** What one cycle of a fixture gave. */
export interface R10Cycle {
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
): Promise<R10Cycle> {
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

// ── R10a ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A singlet and a stop 7 mm behind it at two lines, no obstruction: every ray of the set lands. */
export const CURVATURE_LENS = caseOf(
  [
    { z: 0, shape: sphere(40), index: [1.5, 1.52] },
    { z: 5, shape: sphere(-60), index: [1, 1] },
    { z: 7, shape: sphere(Infinity), index: [1, 1], semiDiameter: 3, clipRadius: 3 },
  ],
  { stopIndex: 2, stopSemiDiameter: 3, lines: 2, imageZ: 60 },
);

/** The field angles of the set, degrees, and the offset of a parabasal ray from its chief ray on z = 0, mm. */
const ANGLES = [0, 5] as const;
const OFFSET = 0.25;

/**
 * A curvature set of two fields: of each, a tangential pair and a sagittal pair beside the chief ray, then the chief
 * ray, every ray along the field's direction `(0, -sin, cos)` from z = -10, its chief ray crossing z = 0 at (0.5, 0)
 * mm. The same rays at both lines.
 */
function curvatureAt(line: number): RaysTraceSpec {
  const launches = ANGLES.flatMap((angle) => {
    const radians = (angle * Math.PI) / 180;
    const [m, n] = [-Math.sin(radians), Math.cos(radians)];
    const [x0, y0] = [0.5, (10 * -m) / n];
    return [
      [x0, y0 - OFFSET],
      [x0, y0 + OFFSET],
      [x0 - OFFSET, y0],
      [x0 + OFFSET, y0],
      [x0, y0],
    ].map(([x, y]) => [x, y, -10, 0, m, n]);
  });
  const rays = launches.length;
  return {
    line,
    origins: encodeNdArray(Float64Array.from(launches.flatMap((launch) => launch.slice(0, 3))), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(launches.flatMap((launch) => launch.slice(3))), [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1)),
  };
}

/** The rung `r10a` as a case without LensVisualizer's sections can be asked it: the set at both lines of the lens. */
export const R10A_FIXTURE_RUNG: RungDefinition = {
  id: "r10a",
  quantity: RAYS_TRACE,
  buildRequests: (opticalCase) =>
    [curvatureAt(0), curvatureAt(1)].map((spec) => makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec })),
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
 * The engines of R10a: `ref`; `moved`, which lands ray 6 of the second line (a tangential ray of the 5 degree field)
 * 2^-25 mm (2.98e-8 mm) further along y, beyond the gate as a landing and, by half of it, as a tangential focus; and
 * `stopped`, which stops ray 3 of the first line (a sagittal ray of the axis) at the first surface.
 */
function r10aEngines(): { readonly [engine: string]: EngineMaker } {
  const lineOf = (request: QuantityRequest): number => (request.spec as { line: number }).line;
  return {
    ref: refLike(),
    moved: refLike((data, request) =>
      lineOf(request) === 1
        ? changed(data, (arrays) => {
            arrays.imagePoint[3 * 6 + 1] += 2 ** -25;
          })
        : data,
    ),
    stopped: refLike((data, request) =>
      lineOf(request) === 0 ? changed(data, (arrays) => stopAt(arrays, 3, 0)) : data,
    ),
  };
}

/** Runs one run of the lens on the three engines into `runsDir`, compares it by the real gates and reports it. */
export function r10aCycle(runsDir: string): Promise<R10Cycle> {
  return cycle(
    runsDir,
    R10A_GOLDEN,
    R10A_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: CURVATURE_LENS, referenceEngine: "ref" }],
    r10aEngines(),
    R10A_POLICY,
  );
}

// ── R10b ─────────────────────────────────────────────────────────────────────────────────────────────────────────

const ASK: CurvatureNativeSpec = { lines: [0, 1], maxFieldDeg: 20, fieldAnglesDeg: [0, 10, 20] };

/** The rung `r10b` as stand-ins can be asked it: the field curves at both lines. */
export const R10B_FIXTURE_RUNG: RungDefinition = {
  id: "r10b",
  quantity: CURVATURE_NATIVE,
  engines: ["lv", "optiland"],
  buildRequests: (opticalCase) => [
    makeRequest({ caseId: opticalCase.id, quantity: CURVATURE_NATIVE, spec: ASK as unknown as JsonObject }),
  ],
};

/** An engine that offers `curvature.native` and answers each request with the body `answer` gives. */
function curvatureEngine(answer: () => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: {
        ...described.capabilities,
        quantities: { [CURVATURE_NATIVE]: { version: CURVATURE_NATIVE_VERSION } },
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

/** A field whose chief ray lands at -0.4 mm a degree, its foci an angle over 512 and minus an angle over 1024. */
function field(line: number, fieldAngleDeg: number, more: Partial<CurvatureNativeField> = {}): CurvatureNativeField {
  return {
    line,
    wavelengthNm: CURVATURE_LENS.conditions.lines[line].wavelengthNm,
    fieldAngleDeg,
    status: "ok",
    chiefLandingMm: -0.4 * fieldAngleDeg,
    tangentialShiftMm: fieldAngleDeg / 512,
    sagittalShiftMm: -fieldAngleDeg / 1024,
    sampling: {},
    ...more,
  };
}

function body(method: string, fields: CurvatureNativeField[]): ResultBody {
  const data: CurvatureNativeData = { fields, method: { name: method, params: {} }, notes: [] };
  return { status: "ok", data: data as unknown as JsonObject };
}

/**
 * The stand-ins of R10b at the axis, 10 and 20 degrees of both lines.
 *
 * - At the first line both are of the case's indices: `optiland`'s tangential focus at 10 degrees is 2^-20 mm further
 *   on, within its band of 1e-5 mm, and its sagittal focus at 20 degrees 2^-16 mm further in, above its band and the
 *   astigmatism's: the pair is marked for attention.
 * - At the second line `lv` states its channel's indices 2^-16 from the case's and no landing: every field is data,
 *   but the one at 20 degrees, whose chief ray `optiland` lost (unavailable).
 */
function r10bEngines(): { readonly [engine: string]: EngineMaker } {
  return {
    lv: curvatureEngine(() =>
      body("lv-field-curves", [
        ...[0, 10, 20].map((angle) => field(0, angle, { sampling: { validSampleCount: 4 } })),
        ...[0, 10, 20].map((angle) => field(1, angle, { chiefLandingMm: null, sampling: { indexMaxDelta: 2 ** -16 } })),
      ]),
    ),
    optiland: curvatureEngine(() =>
      body("optiland-field-curvature", [
        field(0, 0),
        field(0, 10, { tangentialShiftMm: 10 / 512 + 2 ** -20 }),
        field(0, 20, { sagittalShiftMm: -20 / 1024 - 2 ** -16 }),
        field(1, 0),
        field(1, 10),
        field(1, 20, {
          status: "unavailable",
          reason: "no-chief-landing",
          chiefLandingMm: null,
          tangentialShiftMm: null,
          sagittalShiftMm: null,
        }),
      ]),
    ),
  };
}

/** Runs one run on the stand-ins into `runsDir`, compares it by the rung's policy and reports it. */
export function r10bCycle(runsDir: string): Promise<R10Cycle> {
  return cycle(
    runsDir,
    R10B_GOLDEN,
    R10B_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: CURVATURE_LENS }],
    r10bEngines(),
    R10B_POLICY,
  );
}
