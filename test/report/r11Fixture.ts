// Rungs R11a and R11b from end to end on engines that know no LensVisualizer: a suite is run, compared and reported,
// and each report is a golden file. In R11a the reference engine traces vignetting sets through a small lens (a sweep of
// three fields, and a lattice of each of two fields), and two stand-ins answer as it does with one exit direction turned
// and one ray stopped; in R11b two stand-ins named `lv` and `flux` answer `vignetting.native`, the first as
// LensVisualizer's tab presents its curve and the second as the flux estimator does. Every number is synthetic.
import { join } from "node:path";

import { compareManifest } from "../../src/compare/manifest.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { engineStamp } from "../../src/contract/engine.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { RAYS_TRACE } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { VIGNETTING_NATIVE, VIGNETTING_NATIVE_VERSION } from "../../src/contract/quantities/vignettingNative.ts";
import type {
  VignettingNativeData,
  VignettingNativeField,
  VignettingNativeSpec,
} from "../../src/contract/quantities/vignettingNative.ts";
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
import { LENS, changed, stopAt } from "../compare/raysSupport.ts";
import { fakeEngine, suiteOf, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";

/** The names of the golden reports: `test/fixtures/golden/r11a-stand-ins.report.md` and `r11b-stand-ins`. */
export const R11A_GOLDEN = "r11a-stand-ins";
export const R11B_GOLDEN = "r11b-stand-ins";

/** A policy of one rung, the rung's entry of the comparator's own policy: its gates, or its limit and units. */
function policyOf(rung: "r11a" | "r11b"): Policy {
  return { contract: "1.0", kind: "policy", version: 1, rungs: { [rung]: loadPolicy().rungs[rung] } };
}
export const R11A_POLICY: Policy = policyOf("r11a");
export const R11B_POLICY: Policy = policyOf("r11b");

/** What one cycle of a fixture gave. */
export interface R11Cycle {
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
): Promise<R11Cycle> {
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

// ── R11a ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** The unit direction of a field of `angleDeg` toward +y. */
function directionOf(angleDeg: number): [number, number, number] {
  const radians = (angleDeg * Math.PI) / 180;
  return [0, -Math.sin(radians), Math.cos(radians)];
}

/** Where a ray of a field starts on z = -10 to cross the stop of `LENS`, at z = 7, at (x, y). */
function startOf(angleDeg: number, x: number, y: number): [number, number, number] {
  const [, m, n] = directionOf(angleDeg);
  return [x, y - (17 * m) / n, -10];
}

/** A sweep of the axis and fields of 3 and 6 degrees, 16 rays each across y at the stop, in one set. */
const SWEEP: RaysTraceSpec = (() => {
  const angles = [0, 3, 6];
  const ys = Array.from({ length: 16 }, (_, at) => -3.75 + at * 0.5);
  const origins = angles.flatMap((angle) => ys.flatMap((y) => startOf(angle, 0, y)));
  const directions = angles.flatMap((angle) => ys.flatMap(() => directionOf(angle)));
  const rays = origins.length / 3;
  return {
    line: 0,
    origins: encodeNdArray(Float64Array.from(origins), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(directions), [rays, 3]),
    weights: encodeNdArray(new Float64Array(rays).fill(1)),
  };
})();

/** A lattice of 10 x 10 cells of 0.75 mm over the stop at a field, its chief ray after the cells. */
function latticeOf(angle: number): RaysTraceSpec {
  const [columns, rows, step] = [10, 10, 0.75];
  const origins: number[] = [];
  const directions: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      origins.push(...startOf(angle, -3.75 + (column + 0.5) * step, -3.75 + (row + 0.5) * step));
      directions.push(...directionOf(angle));
    }
  }
  origins.push(...startOf(angle, 0.05, 0.05));
  directions.push(...directionOf(angle));
  const rays = columns * rows + 1;
  const weights = new Float64Array(rays).fill(1);
  weights[rays - 1] = 0;
  return {
    line: 0,
    origins: encodeNdArray(Float64Array.from(origins), [rays, 3]),
    directions: encodeNdArray(Float64Array.from(directions), [rays, 3]),
    weights: encodeNdArray(weights),
    groups: { field: { angleDeg: angle }, lattice: { columns, rows, step }, chiefIndex: rays - 1 },
  };
}

/** The rung `r11a` as a case without LensVisualizer's tab can be asked it: the sweep, and the two fields' lattices. */
export const R11A_FIXTURE_RUNG: RungDefinition = {
  id: "r11a",
  quantity: RAYS_TRACE,
  buildRequests: (opticalCase) =>
    [SWEEP, latticeOf(0), latticeOf(4)].map((spec) =>
      makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec }),
    ),
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

/** The field angle of a lattice request, or null for the sweep. */
function fieldOf(request: QuantityRequest): number | null {
  return (request.spec as RaysTraceSpec).groups?.field?.angleDeg ?? null;
}

/**
 * The engines of R11a: `ref`; `turned`, which turns the exit direction of cell 41 of the 4-degree lattice, a cell of
 * the beam's rim, by 2^-20 along x, beyond the gate of the flux into the image (a cell inside the rim would move it to
 * second order only: the area of a beam in cosine space is of its rim); and `stopped`, which stops ray 20 of the sweep
 * (a ray of the 3-degree field that passes) at the stop.
 */
function r11aEngines(): { readonly [engine: string]: EngineMaker } {
  return {
    ref: refLike(),
    turned: refLike((data, request) =>
      fieldOf(request) === 4
        ? changed(data, (arrays) => {
            arrays.exitDirection[3 * 41] += 2 ** -20;
          })
        : data,
    ),
    stopped: refLike((data, request) =>
      fieldOf(request) === null ? changed(data, (arrays) => stopAt(arrays, 20, 2)) : data,
    ),
  };
}

/** Runs one run of the lens on the three engines into `runsDir`, compares it by the real gates and reports it. */
export function r11aCycle(runsDir: string): Promise<R11Cycle> {
  return cycle(
    runsDir,
    R11A_GOLDEN,
    R11A_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: LENS, referenceEngine: "ref" }],
    r11aEngines(),
    R11A_POLICY,
  );
}

// ── R11b ─────────────────────────────────────────────────────────────────────────────────────────────────────────

const ASK: VignettingNativeSpec = { lines: [0], maxFieldDeg: 24, fieldAnglesDeg: [0, 8, 16, 24] };

/** The rung `r11b` as stand-ins can be asked it: the tab's curve at the first line. */
export const R11B_FIXTURE_RUNG: RungDefinition = {
  id: "r11b",
  quantity: VIGNETTING_NATIVE,
  engines: ["lv", "flux"],
  buildRequests: (opticalCase) => [
    makeRequest({ caseId: opticalCase.id, quantity: VIGNETTING_NATIVE, spec: ASK as unknown as JsonObject }),
  ],
};

/** An engine that offers `vignetting.native` and answers each request with the body `answer` gives. */
function vignettingEngine(answer: () => ResultBody): EngineMaker {
  return async (id) => {
    const adapter = await fakeEngine()(id);
    const described = await adapter.describe();
    const descriptor: EngineDescriptor = {
      ...described,
      capabilities: {
        ...described.capabilities,
        quantities: { [VIGNETTING_NATIVE]: { version: VIGNETTING_NATIVE_VERSION } },
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

/** A field whose chief ray lands at -0.5 mm a degree, its transmission an angle over 64 below 1, its illumination 32. */
function field(fieldAngleDeg: number, more: Partial<VignettingNativeField> = {}): VignettingNativeField {
  return {
    line: 0,
    wavelengthNm: LENS.conditions.lines[0].wavelengthNm,
    fieldAngleDeg,
    status: "ok",
    chiefLandingMm: -fieldAngleDeg / 2,
    geometricTransmission: 1 - fieldAngleDeg / 64,
    relativeIllumination: 1 - fieldAngleDeg / 32,
    sampling: {},
    ...more,
  };
}

function body(method: string, fields: VignettingNativeField[]): ResultBody {
  const data: VignettingNativeData = { fields, method: { name: method, params: {} }, notes: [] };
  return { status: "ok", data: data as unknown as JsonObject };
}

/**
 * The stand-ins of R11b at the axis, 8, 16 and 24 degrees.
 *
 * - At 8 degrees `flux` lets 1/16 more of the beam through (a pupil wider than the axis's, which a sweep of fixed
 *   width does not see) and its image is 1/8 brighter: the geometric transmission and the falloff differ.
 * - At 16 degrees `flux` does not stand by its figures (its two lattices moved apart): numerical, in no figure.
 * - At 24 degrees the chief rays land 2^-12 mm apart, beyond the limit of 1e-5 mm: data, in no figure, and the
 *   landing marks the pair.
 */
function r11bEngines(): { readonly [engine: string]: EngineMaker } {
  return {
    lv: vignettingEngine(() =>
      body(
        "lv-vignetting-tab",
        [0, 8, 16, 24].map((angle) => field(angle, { sampling: { pupilSamples: 192, fieldSamples: 9 } })),
      ),
    ),
    flux: vignettingEngine(() =>
      body("lattice-flux", [
        field(0),
        field(8, { geometricTransmission: 1 - 8 / 64 + 1 / 16, relativeIllumination: 1 - 8 / 32 + 1 / 8 }),
        field(16, { status: "unconverged", reason: "not-converged", geometricTransmission: 0.5 }),
        field(24, { chiefLandingMm: -12 + 2 ** -12 }),
      ]),
    ),
  };
}

/** Runs one run on the stand-ins into `runsDir`, compares it by the rung's policy and reports it. */
export function r11bCycle(runsDir: string): Promise<R11Cycle> {
  return cycle(
    runsDir,
    R11B_GOLDEN,
    R11B_FIXTURE_RUNG,
    [{ name: "lens", opticalCase: LENS }],
    r11bEngines(),
    R11B_POLICY,
  );
}
