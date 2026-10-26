// Owner decision 2026-10-23: validate only the run's own rays, before any engine is compared on a fixed path.
import type { OpticalCase } from "../../contract/case.ts";
import { deepFreeze } from "../../contract/json.ts";
import type { RunSpec } from "../../contract/runSpec.ts";
import type { CaseResolution, RunRaySets } from "../../core/suite.ts";
import { raySetId } from "../../rays/raySets.ts";
import type { LvCaseModel } from "./caseModel.ts";
import { foldedPostPathRay } from "./rays.ts";
import type { LvRaysApi } from "./rays.ts";

export const FOLDED_CONFIRMATION = "folded-declared-path-confirmed:";

/** No static check, no new launches: only the exact coarse/fine sets the orchestrator will hand to engines. */
export function confirmFoldedPath(api: LvRaysApi, model: LvCaseModel, run: RunSpec, sets: RunRaySets): CaseResolution {
  const opticalCase = model.exported;
  if (opticalCase.system.opticalPath === undefined) return { ok: true, opticalCase };
  for (const resolution of ["coarse", "fine"] as const) {
    for (const set of sets[resolution]?.sets ?? []) {
      const post = foldedPostPathRay(api, model, set);
      if (post !== null) {
        const message = `${resolution} set ${raySetId(set)}, line ${set.line}, ray ${post.ray}: ${post.why}; LV continues its reflective-surface search past the declared path`;
        return { ok: false, problems: [`folded-post-path-reflection: ${message}`] };
      }
    }
  }
  // Keep the existing provenance-code alphabet. The UTF-8 hex name is reversible; hashes identify exact specs.
  const scope = (resolution: RunRaySets["coarse"]): string =>
    resolution === null ? "unrequested" : resolution.sets.map(raySetId).join(".") || "empty";
  const name = Buffer.from(run.name, "utf8").toString("hex");
  const note = `${FOLDED_CONFIRMATION}run:${name}:coarse:${scope(sets.coarse)}:fine:${scope(sets.fine)}`;
  const confirmed: OpticalCase = {
    ...opticalCase,
    provenance: {
      ...opticalCase.provenance,
      notes: [...new Set([...(opticalCase.provenance.notes ?? []), note])].sort(),
    },
  };
  return { ok: true, opticalCase: deepFreeze(confirmed) };
}
