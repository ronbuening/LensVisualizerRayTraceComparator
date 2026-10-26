// Fixed folded paths are translated from prepared metadata, never discovered from sample rays.
import type { OpticalPathStep } from "../../contract/case.ts";
import type { ExportProblem } from "./exportProblems.ts";
import type { LvApi, LvPreparedState } from "./types.ts";

export function exportPath(
  api: Pick<LvApi, "rearMediumSurfaceIndex">,
  state: LvPreparedState,
): { path?: readonly OpticalPathStep[]; problems: ExportProblem[] } {
  if (!state.lens.flags.isFoldedOptics) return { problems: [] };
  const plan = state.lens.opticalPath;
  if (!plan || plan.mode === "auto" || !plan.surfaceOrder?.length) {
    return {
      problems: [
        {
          code: "folded-auto-path",
          message:
            "LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays",
        },
      ],
    };
  }
  if (plan.maxInteractions <= plan.surfaceOrder.length) {
    return {
      problems: [
        {
          code: "folded-interaction-budget",
          message: "LV's interaction budget does not allow the complete path and image-plane visit",
        },
      ],
    };
  }
  const path: OpticalPathStep[] = [];
  for (const surfaceIndex of plan.surfaceOrder) {
    const surface = state.surfaces[surfaceIndex];
    if (surface.interaction.normal?.some((value, axis) => value !== (axis === 2 ? 1 : 0))) {
      return {
        problems: [{ code: "tilted-surface", message: `surface ${surface.label} has a tilted interaction normal` }],
      };
    }
    const interaction = surface.interaction.type;
    if (!["refract", "reflect", "block", "pass"].includes(interaction)) {
      return {
        problems: [
          { code: "non-refract-interaction", message: `surface ${surface.label}: unknown interaction ${interaction}` },
        ],
      };
    }
    path.push({
      surfaceIndex,
      interaction: interaction as OpticalPathStep["interaction"],
      incidentSide: surface.interaction.incidentSide ?? "both",
      inactiveSide: surface.interaction.inactiveSide ?? "ignore",
      ...(interaction === "refract"
        ? { mediumAfter: surfaceIndex, reverseMediumAfter: api.rearMediumSurfaceIndex(surfaceIndex, state.surfaces) }
        : {}),
    });
  }
  return { path, problems: [] };
}
