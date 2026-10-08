// `rays.trace` as the engine `lv` answers it: every ray of the request traced for real by LensVisualizer's own
// sequential tracer on its own prepared state, with the indices of the line. LensVisualizer's trace ends on the
// last surface; the landing on the image plane is the comparator's own projection of that end.
import type { ErrorInfo } from "../../contract/result.ts";
import { NO_END_SURFACE, RAY_STATUS } from "../../contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeNdArray, ndRow } from "../../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import { continuedOpticalPath, projectToImagePlane } from "../../estimators/imageProjection.ts";
import type { LvCaseModel } from "./caseModel.ts";
import type { LvApi, LvTraceOptions, LvTraceResult } from "./types.ts";

/** The LensVisualizer exports a ray trace is answered with. */
export type LvRaysApi = Pick<LvApi, "traceEngineRay2" | "mtfTraceClassification">;

/** What the engine makes of a `rays.trace` spec: the trace with its ray counts, or why the spec cannot be traced. */
export type LvRaysAnswer =
  | { readonly data: RaysTraceData; readonly counts: { readonly [name: string]: number } }
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
 * Each ray is one call of LensVisualizer's `traceEngineRay2` with `lvTraceOptions` of the spec's line, and
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
  const surfaces = state.surfaces.length;
  const options = lvTraceOptions(model, spec.line);

  const status = new Uint8Array(rays);
  const endSurface = new Int32Array(rays);
  const hits = new Float64Array(surfaces * rays * 3).fill(NaN);
  const exitPoint = new Float64Array(rays * 3).fill(NaN);
  const exitDirection = new Float64Array(rays * 3).fill(NaN);
  const imagePoint = new Float64Array(rays * 3).fill(NaN);
  const opticalPath = new Float64Array(rays).fill(NaN);
  const opticalPathToImage = new Float64Array(rays).fill(NaN);
  const counts = { rays, ok: 0, blocked: 0, failed: 0 };

  for (let ray = 0; ray < rays; ray++) {
    const trace = api.traceEngineRay2(
      state,
      {
        origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
        direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
      },
      options,
    );
    const outcome = api.mtfTraceClassification(trace, state, conditions.stopSemiDiameter);
    const passed = surfacesPassed(trace);
    for (let surface = 0; surface < passed; surface++) {
      hits.set(trace.hits[surface].point, (surface * rays + ray) * 3);
    }
    if (outcome !== "valid") {
      if (passed >= surfaces) throw new Error(`LensVisualizer calls ray ${ray} ${outcome} after its last surface`);
      const name = outcome === "blocked" ? "blocked" : "failed";
      status[ray] = RAY_STATUS[name];
      endSurface[ray] = passed;
      counts[name]++;
      continue;
    }
    if (passed !== surfaces || trace.opticalPathLengthMm === undefined) {
      throw new Error(`LensVisualizer calls ray ${ray} valid with ${passed} of ${surfaces} surfaces passed`);
    }
    exitPoint.set(trace.terminalPoint, 3 * ray);
    exitDirection.set(trace.terminalDirection, 3 * ray);
    opticalPath[ray] = trace.opticalPathLengthMm;
    const landing = projectToImagePlane(trace.terminalPoint, trace.terminalDirection, conditions.imageZ);
    if (landing === null) {
      status[ray] = RAY_STATUS.blocked;
      endSurface[ray] = surfaces;
      counts.blocked++;
      continue;
    }
    status[ray] = RAY_STATUS.ok;
    endSurface[ray] = NO_END_SURFACE;
    imagePoint.set(landing.point, 3 * ray);
    opticalPathToImage[ray] = continuedOpticalPath(trace.opticalPathLengthMm, trace.finalMedium, landing.distance);
    counts.ok++;
  }

  return {
    data: {
      status: encodeNdArray(status),
      endSurface: encodeNdArray(endSurface),
      hits: encodeNdArray(hits, [surfaces, rays, 3]),
      exitPoint: encodeNdArray(exitPoint, [rays, 3]),
      exitDirection: encodeNdArray(exitDirection, [rays, 3]),
      imagePoint: encodeNdArray(imagePoint, [rays, 3]),
      opticalPath: encodeNdArray(opticalPath),
      opticalPathToImage: encodeNdArray(opticalPathToImage),
    },
    counts,
  };
}
