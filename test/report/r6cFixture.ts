// Synthetic four-column R6c, including data, numerical and unsupported rows.
import type { Policy } from "../../src/contract/policy.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { answer, raised } from "../compare/mtfNativeSupport.ts";
import { ALL_FEATURES_CASE } from "../contract/corpus.ts";
import { R5_FIXTURE_RUNG, R5_POLICY, mtfEngine, standInCycle, standIns } from "./r5Fixture.ts";

export const R6C_GOLDEN = "r6c-stand-ins";
export const R6C_POLICY: Policy = {
  ...R5_POLICY,
  rungs: {
    r6c: {
      ...R5_POLICY.rungs.r5,
      metrics: {
        ...R5_POLICY.rungs.r5.metrics,
        "chiefLanding.maxAbs": { ...R5_POLICY.rungs.r5.metrics["chiefLanding.maxAbs"], attentionSeveralLines: 1e-3 },
      },
    },
  },
};
export const R6C_FIXTURE_RUNG: RungDefinition = {
  ...R5_FIXTURE_RUNG,
  id: "r6c",
  engines: ["lv", "wave", "optiland", "optiland-wave"],
};
function spectralLines(caseId: string) {
  return caseId === ALL_FEATURES_CASE.id
    ? { lines: ALL_FEATURES_CASE.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })) }
    : {};
}
export function r6cCycle(runsDir: string) {
  const engines = {
    ...standIns(),
    lv: mtfEngine((request) => ({
      status: "ok",
      data: {
        ...answer("lv-product", [{}, {}, {}]),
        ...spectralLines(request.caseId),
      },
    })),
    wave: mtfEngine((request) => ({
      status: "ok",
      data: {
        ...answer("hopkins-autocorrelation", [{}, {}, { status: "unconverged", reason: "undersampled" }]),
        ...spectralLines(request.caseId),
      },
    })),
    "optiland-wave": mtfEngine((request) => ({
      status: "ok",
      data: {
        ...answer("hopkins-optiland-wavefront", [
          { sagittal: raised(-1 / 128, 0), sampling: { gridSize: 256, maxDelta: 1 / 1024 } },
          request.caseId === ALL_FEATURES_CASE.id
            ? { imageHeightMm: 8 + 5e-6 }
            : { status: "unconverged", reason: "undersampled" },
          { imageHeightMm: 20 },
        ]),
        ...spectralLines(request.caseId),
      },
    })),
  };
  return standInCycle(runsDir, R6C_GOLDEN, R6C_FIXTURE_RUNG, engines, R6C_POLICY);
}
