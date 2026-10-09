// Rung R5g from end to end on engines that know no optics: three stand-ins named `lv`, `optiland` and `replay`
// answer one `mtf.native` request for a geometric MTF with curves this file writes out, and the suite of
// `r5Fixture.ts` is run, compared and reported with them. Every number is synthetic: a binary fraction, or a band of
// the policy.
import type { Policy } from "../../src/contract/policy.ts";
import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeSpec } from "../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import type { ResultBody } from "../../src/contract/result.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { SPEC, answer, raised } from "../compare/mtfNativeSupport.ts";
import type { FieldsOf } from "../compare/mtfNativeSupport.ts";
import { DOUBLE_GAUSS, SINGLET } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import {
  CHIEF_LANDING_LIMIT_MM,
  OFF_AXIS_BAND,
  ON_AXIS_BAND,
  R5_POLICY,
  mtfEngine,
  standInCycle,
} from "./r5Fixture.ts";
import type { R5Cycle } from "./r5Fixture.ts";

/** The name of the golden report of the stand-ins: `test/fixtures/golden/r5g-stand-ins.report.md`. */
export const R5G_GOLDEN = "r5g-stand-ins";

/** The request of the fixture: that of `SPEC`, for the geometric MTF. */
export const GEOMETRIC_SPEC: MtfNativeSpec = { ...SPEC, method: "geometric" };

/** A policy of the one rung `r5g`, with the bands of the fixture of `r5`. */
export const R5G_POLICY: Policy = { ...R5_POLICY, rungs: { r5g: R5_POLICY.rungs.r5 } };

/** The rung `r5g` as far as engines that know no optics can be asked it: one request, of three engines. */
export const R5G_FIXTURE_RUNG: RungDefinition = {
  id: "r5g",
  quantity: MTF_NATIVE,
  engines: ["lv", "optiland", "replay"],
  buildRequests: (opticalCase) => [makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec: GEOMETRIC_SPEC })],
};

/** The lines of the answers of the run `polychromatic`, nm. */
export const SEVERAL_LINES: readonly number[] = [486.1327, 587.5618, 656.2725];

/** What the stand-in for LensVisualizer states of its sampling of every field. */
const LV_FIELD = { sampling: { gridSize: 64, maxDelta: 1 / 512 } };

const ok = (data: ReturnType<typeof answer>): ResultBody => ({ status: "ok", data });

/**
 * What the three stand-ins answer for each run. The differences of `lv` and `optiland`, by run:
 *
 * - `edge` (the singlet): on the axis exactly the band at 10 cycles/mm, off the axis at field 0.5 exactly the band
 *   at 30: inside both, so nothing is asked again. Of field 1 the stand-in for optiland has no curve: its bins moved
 *   a value by more than a band.
 * - `beyond` (the Double-Gauss): on the axis one unit in the last place more than the band at 50 cycles/mm, so
 *   optiland is asked again at 512 rays, and answers the same on the axis. At field 0.5 its chief ray lands twice
 *   the limit from LensVisualizer's; of field 1 it says, at both steps, that its sampling did not settle.
 * - `polychromatic` (the case of every feature): all three answer for three lines, the stand-in for optiland by
 *   the sum of landings, twice the band off the axis from the others at 30 cycles/mm: outside the band, and not
 *   asked again, since the finer step is asked of an answer of one line only.
 */
export function geometricStandIns(): { readonly [engine: string]: EngineMaker } {
  const edge = (request: QuantityRequest): boolean => request.caseId === SINGLET.id;
  const beyond = (request: QuantityRequest): boolean => request.caseId === DOUBLE_GAUSS.id;
  const optilandFields = (request: QuantityRequest): FieldsOf => {
    const fine = request.engineOptions?.geometricRays === 512;
    const sampling = {
      numRays: fine ? 512 : 256,
      coarseNumRays: fine ? 256 : 128,
      maxDelta: fine ? 1 / 2048 : 1 / 1024,
      binningMaxDelta: 1 / 4096,
    };
    if (edge(request)) {
      return [
        { sagittal: raised(-ON_AXIS_BAND, 0), sampling },
        { tangential: raised(-OFF_AXIS_BAND, 1), sampling },
        { status: "unavailable", reason: "frequency-beyond-bins", sampling: { ...sampling, binningMaxDelta: 1 / 32 } },
      ];
    }
    return [
      { sagittal: raised(-ON_AXIS_BAND * (1 + 2 ** -40), 2), sampling },
      { imageHeightMm: 8 + 2 * CHIEF_LANDING_LIMIT_MM, sampling },
      { tangential: raised(1 / 16, 3), status: "unconverged", reason: "sampling-not-settled", sampling },
    ];
  };
  const several = (request: QuantityRequest): boolean => !edge(request) && !beyond(request);
  const lines = (request: QuantityRequest): readonly number[] | undefined =>
    several(request) ? SEVERAL_LINES : undefined;
  return {
    lv: mtfEngine((request) => ok(answer("lv-product", [LV_FIELD, LV_FIELD, LV_FIELD], lines(request)))),
    optiland: mtfEngine((request) =>
      several(request)
        ? ok(answer("spot-landings-sum", [{}, { sagittal: raised(2 * OFF_AXIS_BAND, 1) }, {}], SEVERAL_LINES))
        : ok(answer("geometric-mtf", optilandFields(request))),
    ),
    replay: mtfEngine((request) => ok(answer("binless-replay", [{}, {}, {}], lines(request)))),
  };
}

/** Runs the three runs on the stand-ins into `runsDir`, compares them by `policy` and reports them. */
export function r5gCycle(runsDir: string, policy: Policy = R5G_POLICY): Promise<R5Cycle> {
  return standInCycle(runsDir, R5G_GOLDEN, R5G_FIXTURE_RUNG, geometricStandIns(), policy);
}
