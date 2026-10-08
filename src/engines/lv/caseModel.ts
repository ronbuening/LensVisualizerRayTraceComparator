// The case an engine request is about, as LensVisualizer itself holds it: the engine `lv` answers from LV's own
// prepared state, never from the surfaces of the case it is handed. So the state is rebuilt from what the case says
// of its origin, exported again under the case's own conditions, and used only if that gives the very same case.
import type { OpticalCase } from "../../contract/case.ts";
import type { LvBinding } from "./binding.ts";
import type { LvCatalogEntry } from "./catalog.ts";
import { exportCase } from "./exportCase.ts";
import type { ExportOptions } from "./exportCase.ts";
import { problemText } from "./exportProblems.ts";
import type { LensBuilder } from "./lensBuilder.ts";
import type { LvPreparedState, LvRuntimeLens } from "./types.ts";

/**
 * The `error.code` of a case that is no longer what LensVisualizer gives for the lens, the state and the conditions
 * it states: the lens file or LensVisualizer's engine code changed after it was exported, or the case was altered.
 * An answer from LensVisualizer's present state would be about another system than the one every other engine was
 * asked about, so there is none.
 */
export const STALE_CASE = "stale-case";

/** A case as LensVisualizer holds it. */
export interface LvCaseModel {
  /** The lens as `buildLens` built it. */
  readonly runtime: LvRuntimeLens;
  /** The state LensVisualizer prepares for the zoom and focus position of the case. */
  readonly state: LvPreparedState;
  /**
   * The case LensVisualizer gives now for the same lens, state and conditions. It has the `systemId` and the `id`
   * of the case that was asked about: what it holds is what LensVisualizer traces that case with.
   */
  readonly exported: OpticalCase;
}

/** The model of a case, or why the case is stale. */
export type RebuiltCase =
  { readonly ok: true; readonly model: LvCaseModel } | { readonly ok: false; readonly reason: string };

/**
 * The export options that ask for a case again: its own stop radius, its own image plane position, and its own
 * lines. A single line with an authored index is LensVisualizer's reference line, the only one it traces with the
 * indices of the prescription; any other set of lines is asked for by wavelength and weight, which takes the same
 * anchored indices whether the lines came from a named spectrum or from a list.
 */
export function exportOptionsOf(opticalCase: OpticalCase, zoomT: number, focusT: number): ExportOptions {
  const { lines, stopSemiDiameter, imageZ } = opticalCase.conditions;
  const reference = lines.length === 1 && lines[0].indexSource === "authored";
  return {
    state: { zoomT, focus: { kind: "focusT", value: focusT } },
    aperture: { kind: "stop-radius", mm: stopSemiDiameter },
    lines: reference
      ? { kind: "reference" }
      : {
          kind: "explicit",
          wavelengthsNm: lines.map((line) => line.wavelengthNm),
          weights: lines.map((line) => line.weight),
        },
    imagePlane: { kind: "at", z: imageZ },
  };
}

function shortHash(hash: string): string {
  return hash.slice(0, 12);
}

/** What changed since a case was exported, of the two things its provenance states a hash of. */
function changedSince(opticalCase: OpticalCase, entry: LvCatalogEntry, closureHash: string): string {
  const { source, lv } = opticalCase.provenance;
  const changed: string[] = [];
  if (source.kind === "lv-lens" && (source.file !== entry.file || source.fileSha256 !== entry.fileSha256)) {
    const [then, now] = [shortHash(source.fileSha256), shortHash(entry.fileSha256)];
    changed.push(`the lens file ${entry.file} (sha256 ${then} when the case was exported, ${now} now)`);
  }
  if (lv !== undefined && lv.closureHash !== closureHash) {
    const [then, now] = [shortHash(lv.closureHash), shortHash(closureHash)];
    changed.push(`LensVisualizer's engine code (closure ${then} when the case was exported, ${now} now)`);
  }
  if (changed.length > 0) return `changed since it was exported: ${changed.join(", and ")}`;
  if (lv === undefined) {
    return (
      "the lens file has not changed since it was exported, " +
      "and the case does not say which engine code exported it"
    );
  }
  return (
    "neither the lens file nor LensVisualizer's engine code has changed since it was exported: " +
    "the case itself was altered"
  );
}

/**
 * Rebuilds the model of a case that came from a LensVisualizer lens (`provenance.source.kind` "lv-lens"): builds
 * the lens of the source's key, exports it at the source's zoom and focus position under the case's conditions
 * (`exportOptionsOf`), and prepares the state.
 *
 * The case is stale, with a reason that names what differs, unless that export is the case: the same `systemId`
 * and the same `id`. The reason says whether the lens file's hash or the engine closure is no longer the one of the
 * case's provenance; when both still are, the case was altered after it was exported. A case that does not state
 * its zoom and focus position, a lens LensVisualizer no longer has or can build, and a state it no longer exports
 * are stale too. The lens file's hash is that of the bytes this process loaded.
 *
 * Rejects where `exportCase` throws: for a defect of the exporter, not for anything the case states.
 */
export async function rebuildCase(
  binding: LvBinding,
  build: LensBuilder,
  opticalCase: OpticalCase,
): Promise<RebuiltCase> {
  const { source } = opticalCase.provenance;
  if (source.kind !== "lv-lens") throw new Error(`a case from a ${source.kind} has no LensVisualizer state`);
  const stale = (reason: string): RebuiltCase => ({ ok: false, reason });
  const { zoomT, focusT } = source;
  if (zoomT === undefined || focusT === undefined) {
    return stale("the case does not state the zoom and focus position it was exported at; export it again");
  }

  const lens = await build(source.lensKey);
  if (!lens.ok) return stale(`LensVisualizer has no such lens to build now: ${problemText(lens.problem)}`);
  const { commit, dirty, engineClosureHash } = binding.fingerprint();
  const since = changedSince(opticalCase, lens.entry, engineClosureHash);
  const result = exportCase({
    api: binding.api,
    lens: lens.entry,
    runtime: lens.runtime,
    options: exportOptionsOf(opticalCase, zoomT, focusT),
    lv: { commit, dirty, closureHash: engineClosureHash },
  });
  if (!result.ok) {
    const problems = result.problems.map(problemText).join("; ");
    return stale(`LensVisualizer does not export the lens as the case states it (${problems}); ${since}`);
  }
  const exported = result.opticalCase;
  if (exported.systemId !== opticalCase.systemId) {
    return stale(`its system is not the one LensVisualizer gives for the lens in that state; ${since}`);
  }
  if (exported.id !== opticalCase.id) {
    return stale(`its conditions are not the ones LensVisualizer gives for the same lines, stop and focus; ${since}`);
  }
  const state = binding.api.prepareRuntimeState(lens.runtime, focusT, zoomT);
  return { ok: true, model: { runtime: lens.runtime, state, exported } };
}
