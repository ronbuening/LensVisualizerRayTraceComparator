// `rays.trace` as the engine `lv` answers it: every ray of the request traced for real by LensVisualizer's own
// sequential tracer on its own prepared state, with the indices of the line. LensVisualizer's trace ends on the
// last surface; the landing on the image plane is the comparator's own projection of that end.
import type { ErrorInfo, UnsupportedItem } from "../../contract/result.ts";
import type { RaysTraceDataV2, RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeF8, ndRow } from "../../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import { createTraceRecorder } from "../../rays/traceRecorder.ts";
import type { LvCaseModel } from "./caseModel.ts";
import type { LvApi, LvTraceOptions, LvTraceResult } from "./types.ts";

/** The LensVisualizer exports a ray trace is answered with. */
export type LvRaysApi = Pick<LvApi, "traceEngineRay" | "mtfTraceClassification" | "projectCoordinateToZ">;

/** What the engine makes of a `rays.trace` spec: the trace with its ray counts, or why the spec cannot be traced. */
export type LvRaysAnswer =
  | { readonly unsupported: readonly UnsupportedItem[] }
  | { readonly data: RaysTraceDataV2; readonly counts: { readonly [name: string]: number } }
  | { readonly error: ErrorInfo };

/** The index of the medium after each surface of a case's model at one line of the case. */
function lineIndices(model: LvCaseModel, line: number): Float64Array {
  const table = decodeNdArray(model.exported.conditions.indexAfterSurface);
  if (table.dtype !== "f8") throw new Error(`the index table is ${table.dtype}, not f8`);
  return ndRow(table, line);
}

/**
 * The options LensVisualizer traces a ray of a case with at one of its lines: clear apertures are checked, the
 * stop surface with the stop radius of the case in place of its own semi-diameter; a ray ends at the first surface
 * that stops it; every index is the one the case states for the line, which is LensVisualizer's own for it; the
 * direction is taken as the unit vector it is given as; and the optical path is recorded. They are the options of
 * LensVisualizer's own MTF bundle (`mtfTraceOptions`), with the indices handed over as a table.
 */
export function lvTraceOptions(model: LvCaseModel, line: number): LvTraceOptions {
  const { conditions } = model.exported;
  const indices = lineIndices(model, line);
  return {
    checkSemiDiameter: true,
    stopSemiDiameter: conditions.stopSemiDiameter,
    stopOnClip: true,
    directionNormalized: true,
    wavelengthNm: conditions.lines[line].wavelengthNm,
    recordOpticalPath: true,
    indexAtSurface: (surfaceIndex) => indices[surfaceIndex],
  };
}

/**
 * How many surfaces a trace passed: the hits before the first one the ray ended on. LensVisualizer records a hit
 * for every surface the ray met, in order, and marks the one that stopped it; a surface it could not find has none.
 */
function surfacesPassed(trace: LvTraceResult): number {
  const stopped = trace.hits.findIndex((hit) => hit.clipped);
  const passed = stopped < 0 ? trace.hits.length : stopped;
  for (let surface = 0; surface < passed; surface++) {
    if (trace.hits[surface].surfaceIndex !== surface) {
      const found = trace.hits[surface].surfaceIndex;
      throw new Error(`LensVisualizer's hit ${surface} is on surface ${found}: its trace is not sequential`);
    }
  }
  return passed;
}

/** The elements of an `[n, 3]` or `[n]` float64 array of a spec. */
function f8Of(wire: NdArrayWire, name: string): Float64Array {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== "f8") throw new Error(`${name} is ${decoded.dtype}, not f8`);
  return decoded.values;
}

/**
 * Traces the rays of a `rays.trace` spec through the state of a case's model.
 *
 * Each ray is one call of LensVisualizer's `traceEngineRay` with `lvTraceOptions` of the spec's line, and
 * LensVisualizer's own `mtfTraceClassification` says what became of it:
 *
 * - "valid": the ray passed every surface. `hits` are its hit points, `exitPoint` and `exitDirection` the last of
 *   them and the direction behind it, `opticalPath` LensVisualizer's `opticalPathLengthMm`. `imagePoint` is the
 *   projection of the exit onto the plane `imageZ` of the case (`projectToImagePlane`) and `opticalPathToImage`
 *   the path continued over that distance in the index LensVisualizer ends in (`finalMedium`): status ok. A ray
 *   whose exit does not project onto the plane is blocked, with the end surface S.
 * - "blocked": an aperture stopped the ray, a surface reflected it totally, or LensVisualizer proves that it misses
 *   the next surface: status blocked.
 * - "failed": LensVisualizer could not resolve an intersection: status failed.
 *
 * A ray that did not pass every surface ended at the first surface it did not pass: the one that clipped or
 * reflected it, or the one it was not intersected with. Its values are NaN from that surface on, the hit on that
 * surface included, which LensVisualizer computes beyond a clear aperture in ways of its own.
 *
 * A spec whose line is not a line of the case is answered with the error `bad-spec`. Throws when LensVisualizer's
 * result is not what a sequential trace gives: then the engine no longer reads it correctly.
 */
export function answerLvRays(api: LvRaysApi, model: LvCaseModel, spec: RaysTraceSpec): LvRaysAnswer {
  const { state, exported } = model;
  const { conditions } = exported;
  if (spec.line >= conditions.lines.length) {
    const message = `spec.line is ${spec.line}, and the case has ${conditions.lines.length} lines`;
    return { error: { code: "bad-spec", message } };
  }
  const origins = f8Of(spec.origins, "origins");
  const directions = f8Of(spec.directions, "directions");
  const rays = origins.length / 3;
  if (exported.system.opticalPath !== undefined) {
    const answer = answerLvFoldedRays(api, model, spec.line, origins, directions);
    if (!("data" in answer) || !exported.features.includes("surface.diffractive")) return answer;
    return {
      ...answer,
      data: {
        ...answer.data,
        phasePath: encodeF8(Array<number>(exported.system.opticalPath.length * rays).fill(NaN), [
          exported.system.opticalPath.length,
          rays,
        ]),
        phasePathUnavailable: "lv-phase-path-unavailable: generalized trace exposes no phase delay",
      },
    };
  }
  const surfaces = state.surfaces.length;
  const options = lvTraceOptions(model, spec.line);

  const recorder = createTraceRecorder(rays, surfaces, conditions.imageZ);

  for (let ray = 0; ray < rays; ray++) {
    const trace = api.traceEngineRay(
      state,
      {
        origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
        direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
      },
      options,
    );
    const outcome = api.mtfTraceClassification(trace, state, conditions.stopSemiDiameter);
    const passed = surfacesPassed(trace);
    for (let surface = 0; surface < passed; surface++) recorder.hit(ray, surface, trace.hits[surface].point);
    if (outcome !== "valid") {
      if (passed >= surfaces) throw new Error(`LensVisualizer calls ray ${ray} ${outcome} after its last surface`);
      recorder.stop(ray, outcome === "blocked" ? "blocked" : "failed", passed);
      continue;
    }
    if (passed !== surfaces || trace.opticalPathLengthMm === undefined) {
      throw new Error(`LensVisualizer calls ray ${ray} valid with ${passed} of ${surfaces} surfaces passed`);
    }
    recorder.exit(ray, trace.terminalPoint, trace.terminalDirection, trace.opticalPathLengthMm, trace.finalMedium);
  }
  const answer = recorder.finish();
  return exported.features.includes("surface.diffractive")
    ? {
        ...answer,
        data: {
          ...answer.data,
          phasePath: encodeF8(Array<number>(surfaces * rays).fill(NaN), [surfaces, rays]),
          phasePathUnavailable:
            "lv-phase-path-unavailable: recordOpticalPath records geometric segments only; phase delay is not exposed",
        },
      }
    : answer;
}

/** LV 2e046d71's generalized tracer keeps no optical path (`recordOpticalPath` is sequential only). */
export const LV_FOLDED_PATH_UNAVAILABLE =
  "lv-folded-optical-path-unavailable: LV recordOpticalPath is sequential-only, unavailable for generalized paths until phase-aware validation";

function refused(item: string, message: string): LvRaysAnswer {
  return { unsupported: [{ code: "feature", item, message }] };
}

/**
 * Where each hit LensVisualizer recorded lies in the declared path, or why it cannot be said exactly.
 *
 * LV's explicit traversal takes the declared visits in order, one per step, and records a hit only where the ray
 * interacts or is stopped: a hole, an inactive side it ignores and a blocker outside its band are crossed without
 * a record and change nothing of the ray. Under `recordHeights` it keeps one height for every visit whose
 * intersection it found, recorded or not, so the number of steps it took is known. Each recorded hit is then
 * placed on a declared step of its surface whose kept height is that hit's own, by LV's `projectCoordinateToZ`
 * to the bit, in order (one embedding, or none is chosen), the last one on the step a ray ended on; every step
 * between two records must leave the direction as it was, to the bit.
 */
type FoldedAlignment =
  | { readonly kind: "aligned"; readonly steps: readonly number[]; readonly end: number }
  | { readonly kind: "post-path" | "unaligned"; readonly why: string };

function alignFolded(
  api: LvRaysApi,
  state: LvCaseModel["state"],
  trace: LvTraceResult,
  path: readonly number[],
  launch: readonly [number, number, number],
): FoldedAlignment {
  const visits = trace.heights?.length;
  if (visits === undefined) throw new Error("LensVisualizer gave no heights under recordHeights");
  const { hits } = trace;
  const count = path.length;
  // The step a ray ended on: past the path for a ray that arrived; for a failed search of an intersection, the
  // step LV could not find one for (no height); otherwise the step of the hit it was stopped or failed on.
  const failedSearch = trace.status === "failed" && !hits.at(-1)?.failureReason;
  const ok = trace.status === "ok";
  const end = ok ? count : failedSearch ? visits : visits - 1;
  if (!ok && end >= count)
    return { kind: "post-path", why: `it ended at step ${end} of LV's ${count} declared visits` };
  const endsOnHit = !ok && !failedSearch;
  const limit = ok ? count : endsOnHit ? end + 1 : end;
  // ways[i][k]: in how many ways hits i.. embed in steps k..limit-1, the last hit on `end` when it ends the ray.
  const n = hits.length;
  // A hit fits a step of its surface whose height LV kept is the height of that very hit, carried along the
  // direction it met the surface in to the surface's vertex plane, by LV's own function: to the bit.
  const heights = trace.heights!;
  const fits = (i: number, k: number) => {
    const { surfaceIndex, point, incidentDirection: d } = hits[i];
    if (path[k] !== surfaceIndex || (endsOnHit && i === n - 1 && k !== end) || d === undefined) return false;
    return heights[k] === api.projectCoordinateToZ(point[1], point[2], d[1], d[2], state.surfaces[surfaceIndex].z);
  };
  const ways = Array.from({ length: n + 1 }, (_row, i) => new Array<number>(limit + 1).fill(i === n ? 1 : 0));
  for (let i = n - 1; i >= 0; i--) {
    for (let k = limit - 1; k >= 0; k--)
      ways[i][k] = Math.min(2, ways[i][k + 1] + (fits(i, k) ? ways[i + 1][k + 1] : 0));
  }
  if (ways[0][0] === 0) {
    return ok && n > 0 && visits > count
      ? { kind: "post-path", why: `LV recorded ${n} hits on ${visits} visits; the path declares ${count}` }
      : { kind: "unaligned", why: `LV's ${n} recorded hits do not fit the ${limit} steps it took of the path` };
  }
  if (ways[0][0] > 1) return { kind: "unaligned", why: "LV's recorded hits fit the path in more than one way" };
  const steps: number[] = [];
  for (let i = 0, k = 0; i < n; i++, k++) {
    while (!(fits(i, k) && ways[i + 1][k + 1] > 0)) k++;
    steps.push(k);
  }
  for (let i = 0; i < n; i++) {
    const before = i === 0 ? launch : hits[i - 1].outgoingDirection;
    const skipped = i === 0 ? steps[0] > 0 : steps[i] > steps[i - 1] + 1;
    const incident = hits[i].incidentDirection;
    if (skipped && (before === undefined || incident === undefined || incident.some((v, axis) => v !== before[axis]))) {
      return { kind: "unaligned", why: `the direction changed across the unrecorded visits before hit ${i}` };
    }
  }
  if (failedSearch && trace.diagnostics?.clipEvents.at(-1)?.surfaceIdx !== path[end]) {
    return { kind: "unaligned", why: `LV's last clip event is not at step ${end}, where its search failed` };
  }
  return { kind: "aligned", steps, end };
}

/**
 * The existing post-path detector, applied to every supplied ray rather than stopping at an unrelated request
 * refusal. Passive post-path crossings remain harmless: alignFolded accepts them when no extra hit was recorded.
 * This is a run preflight, not a search for a path or for additional sample rays.
 */
export function foldedPostPathRay(
  api: LvRaysApi,
  model: LvCaseModel,
  spec: RaysTraceSpec,
): { readonly ray: number; readonly why: string } | null {
  const path = model.exported.system.opticalPath?.map((step) => step.surfaceIndex);
  if (path === undefined) return null;
  const origins = f8Of(spec.origins, "origins");
  const directions = f8Of(spec.directions, "directions");
  const options = { ...lvTraceOptions(model, spec.line), recordHeights: true };
  for (let ray = 0; ray < origins.length / 3; ray++) {
    const launch = [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]] as const;
    const trace = api.traceEngineRay(
      model.state,
      { origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]], direction: [...launch] },
      options,
    );
    const aligned = alignFolded(api, model.state, trace, path, launch);
    if (aligned.kind === "post-path") return { ray, why: aligned.why };
  }
  return null;
}

/**
 * `rays.trace` version 2 of a folded case: LV's generalized trace of each ray, its recorded hits placed in the
 * declared path (`alignFolded`). A visit LV crossed without a record is `unrecordedHits` (NaN in `hits`): the ray is
 * unchanged there, and no point is computed for it. LV keeps no optical path (`LV_FOLDED_PATH_UNAVAILABLE`).
 *
 * The request is unsupported, naming the first ray, when a ray cannot be placed exactly:
 * `lv-folded-post-path-interaction` when LV met a reflective surface after the declared visits (its explicit
 * traversal goes on with a search of the reflective surfaces, which the case's fixed path does not state);
 * `lv-folded-unaligned-visits` when its record fits the path in no single way; `lv-folded-unrecorded-visit` when
 * the last declared visit of a ray that arrived has no record, since the exit point is that hit.
 */
function answerLvFoldedRays(
  api: LvRaysApi,
  model: LvCaseModel,
  line: number,
  origins: Float64Array,
  directions: Float64Array,
): LvRaysAnswer {
  const { state, exported } = model;
  const path = exported.system.opticalPath!.map((step) => step.surfaceIndex);
  const count = path.length;
  const rays = origins.length / 3;
  const options = { ...lvTraceOptions(model, line), recordHeights: true };
  const recorder = createTraceRecorder(rays, count, exported.conditions.imageZ, true);
  for (let ray = 0; ray < rays; ray++) {
    const launch = [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]] as const;
    const trace = api.traceEngineRay(
      state,
      { origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]], direction: [...launch] },
      options,
    );
    const aligned = alignFolded(api, state, trace, path, launch);
    if (aligned.kind !== "aligned") {
      if (aligned.kind === "unaligned") return refused("lv-folded-unaligned-visits", `ray ${ray}: ${aligned.why}`);
      const message = `ray ${ray}: ${aligned.why}. LV's explicit path goes on with a search of its reflective surfaces after the declared visits; the case's fixed path does not state it`;
      return refused("lv-folded-post-path-interaction", message);
    }
    const { steps, end } = aligned;
    const outcome =
      trace.status === "ok"
        ? "valid"
        : trace.status === "clipped" || trace.failureReason === "totalInternalReflection"
          ? "blocked"
          : "failed";
    const reached = outcome === "valid" ? count : end;
    if (outcome === "valid" && steps.at(-1) !== count - 1) {
      const message = `ray ${ray}: LV records no hit on the last declared visit, whose point is the exit point`;
      return refused("lv-folded-unrecorded-visit", message);
    }
    let next = 0;
    for (let step = 0; step < reached; step++) {
      if (steps[next] === step) recorder.hit(ray, step, trace.hits[next++].point);
      else recorder.unrecorded(ray, step);
    }
    if (outcome !== "valid") {
      recorder.stop(ray, outcome, end);
      continue;
    }
    recorder.exit(ray, trace.hits[trace.hits.length - 1].point, trace.terminalDirection, NaN, trace.finalMedium);
  }
  const finished = recorder.finish();
  return { ...finished, data: { ...finished.data, pathUnavailable: LV_FOLDED_PATH_UNAVAILABLE } };
}
