// Synthetic four-column R6c, including data, numerical and unsupported rows.
import type { Policy } from "../../src/contract/policy.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { answer, raised } from "../compare/mtfNativeSupport.ts";
import { ALL_FEATURES_CASE } from "../contract/corpus.ts";
import { R5_FIXTURE_RUNG, R5_POLICY, mtfEngine, standInCycle, standIns } from "./r5Fixture.ts";

export const R6C_GOLDEN = "r6c-stand-ins";
export const R6C_POLICY: Policy = { ...R5_POLICY, rungs: { r6c: R5_POLICY.rungs.r5 } };
export const R6C_FIXTURE_RUNG: RungDefinition = {
  ...R5_FIXTURE_RUNG,
  id: "r6c",
  engines: ["lv", "wave", "optiland", "optiland-wave"],
};
export function r6cCycle(runsDir: string) {
  const engines = {
    ...standIns(),
    "optiland-wave": mtfEngine((request) =>
      request.caseId === ALL_FEATURES_CASE.id
        ? {
            status: "unsupported",
            unsupported: [{ code: "feature", item: "lines.polychromatic", message: "one line only" }],
          }
        : {
            status: "ok",
            data: answer("hopkins-optiland-wavefront", [
              { sagittal: raised(-1 / 128, 0), sampling: { gridSize: 256, maxDelta: 1 / 1024 } },
              { status: "unconverged", reason: "undersampled" },
              { imageHeightMm: 20 },
            ]),
          },
    ),
  };
  return standInCycle(runsDir, R6C_GOLDEN, R6C_FIXTURE_RUNG, engines, R6C_POLICY);
}
