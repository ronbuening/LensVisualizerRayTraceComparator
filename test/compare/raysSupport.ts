// What the tests of the two `rays.trace` comparators and of the floor rule share: a small lens, a set of rays
// through it with a chief ray, the reference engine's trace of them, and ways to make another engine's answer of
// it: a hit moved, a ray stopped, a path lengthened. Every number is synthetic.
import type { OpticalCase } from "../../src/contract/case.ts";
import { RAY_STATUS } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import type { ParticipantResult } from "../../src/compare/pair.ts";
import { buildRefSystem } from "../../src/engines/ref/model.ts";
import { answerRays } from "../../src/engines/ref/rays.ts";
import { caseOf, sphere } from "../engines/ref/support.ts";

/** The clip radius of the stop of `LENS`, and the inner radius of its last surface: each to the last bit. */
export const STOP_CLIP = 3;
export const INNER_CLIP = 0.25;

/**
 * A lens of two lines: a singlet, a stop that clips at exactly 3 mm, and a plate with a central obstruction of
 * 0.25 mm. The lines are 587.5618 nm and 537.5618 nm.
 */
export const LENS: OpticalCase = caseOf(
  [
    { z: 0, shape: sphere(40), index: [1.5, 1.52] },
    { z: 5, shape: sphere(-60), index: [1, 1] },
    { z: 7, shape: sphere(Infinity), index: [1, 1], semiDiameter: STOP_CLIP, clipRadius: STOP_CLIP },
    {
      z: 9,
      shape: sphere(Infinity),
      index: [1.6, 1.61],
      semiDiameter: 8,
      clipRadius: 8,
      innerSemiDiameter: INNER_CLIP,
    },
    { z: 10, shape: sphere(Infinity), index: [1, 1], semiDiameter: 8, clipRadius: 8 },
  ],
  { stopIndex: 2, stopSemiDiameter: STOP_CLIP, lines: 2, imageZ: 60 },
);

/** The wavelength of each line of `LENS`, mm. */
export const WAVE_MM: readonly number[] = LENS.conditions.lines.map((line) => line.wavelengthNm * 1e-6);

/** The index of the chief ray of `SPEC`: its last ray. */
export const CHIEF = 6;

/**
 * Seven rays along the axis at one line: four that pass (rays 0 to 3), one the stop clips (ray 4), one the first
 * surface clips (ray 5), and the chief ray (ray 6), a little off the axis so that the obstruction passes it.
 */
export function specAt(line: number): RaysTraceSpec {
  const heights = [1, -2, 1.5, 2.5, 4.5, 12, 0.5];
  return {
    line,
    origins: encodeNdArray(Float64Array.from(heights.flatMap((y, ray) => [0.1 * ray, y, -10])), [7, 3]),
    directions: encodeNdArray(Float64Array.from(heights.flatMap(() => [0, 0, 1])), [7, 3]),
    weights: encodeNdArray(Float64Array.of(1, 1, 1, 1, 1, 1, 0)),
    groups: { field: { angleDeg: 0 }, chiefIndex: CHIEF },
  };
}

/** The rays at the first line. */
export const SPEC: RaysTraceSpec = specAt(0);

/** The reference engine's trace of a spec through a case: `LENS` unless another is given. */
export function traceOf(spec: RaysTraceSpec, opticalCase: OpticalCase = LENS): RaysTraceData {
  const answer = answerRays(buildRefSystem(opticalCase), spec);
  if (!("data" in answer)) throw new Error(answer.error.message);
  return answer.data;
}

/** The trace of `SPEC`: rays 0 to 3 and 6 are ok, ray 4 ends at surface 2 and ray 5 at surface 0. */
export const BASE: RaysTraceData = traceOf(SPEC);

/** The arrays of an answer, to be changed in place. */
export interface TraceArrays {
  readonly rays: number;
  readonly surfaces: number;
  readonly status: Uint8Array;
  readonly endSurface: Int32Array;
  readonly hits: Float64Array;
  readonly exitPoint: Float64Array;
  readonly exitDirection: Float64Array;
  readonly imagePoint: Float64Array;
  readonly opticalPath: Float64Array;
  readonly opticalPathToImage: Float64Array;
}

/** An answer with its arrays changed by `change`; the answer it was made from is left as it is. */
export function changed(data: RaysTraceData, change: (arrays: TraceArrays) => void): RaysTraceData {
  const of = (name: keyof RaysTraceData) => decodeNdArray(data[name]).values;
  const arrays: TraceArrays = {
    rays: data.status.$nd.shape[0],
    surfaces: data.hits.$nd.shape[0],
    status: of("status") as Uint8Array,
    endSurface: of("endSurface") as Int32Array,
    hits: of("hits") as Float64Array,
    exitPoint: of("exitPoint") as Float64Array,
    exitDirection: of("exitDirection") as Float64Array,
    imagePoint: of("imagePoint") as Float64Array,
    opticalPath: of("opticalPath") as Float64Array,
    opticalPathToImage: of("opticalPathToImage") as Float64Array,
  };
  change(arrays);
  return {
    status: encodeNdArray(arrays.status),
    endSurface: encodeNdArray(arrays.endSurface),
    hits: encodeNdArray(arrays.hits, data.hits.$nd.shape),
    exitPoint: encodeNdArray(arrays.exitPoint, data.exitPoint.$nd.shape),
    exitDirection: encodeNdArray(arrays.exitDirection, data.exitDirection.$nd.shape),
    imagePoint: encodeNdArray(arrays.imagePoint, data.imagePoint.$nd.shape),
    opticalPath: encodeNdArray(arrays.opticalPath),
    opticalPathToImage: encodeNdArray(arrays.opticalPathToImage),
  };
}

/** Where the hit of a ray on a surface starts in `hits`. */
export function hitAt(arrays: Pick<TraceArrays, "rays">, surface: number, ray: number): number {
  return (surface * arrays.rays + ray) * 3;
}

/** Ends a ray at a surface, as an engine that stopped it there reports it: NaN from that surface on. */
export function stopAt(
  arrays: TraceArrays,
  ray: number,
  surface: number,
  status: "blocked" | "failed" = "blocked",
): void {
  arrays.status[ray] = RAY_STATUS[status];
  arrays.endSurface[ray] = surface;
  for (let at = surface; at < arrays.surfaces; at++)
    arrays.hits.fill(NaN, hitAt(arrays, at, ray), hitAt(arrays, at, ray) + 3);
  arrays.imagePoint.fill(NaN, 3 * ray, 3 * ray + 3);
  arrays.opticalPathToImage[ray] = NaN;
  if (surface >= arrays.surfaces) return;
  arrays.exitPoint.fill(NaN, 3 * ray, 3 * ray + 3);
  arrays.exitDirection.fill(NaN, 3 * ray, 3 * ray + 3);
  arrays.opticalPath[ray] = NaN;
}

/** Puts the hit of a ray on a surface at the radial height `r`, along +y, keeping its z. */
export function hitRadius(arrays: TraceArrays, surface: number, ray: number, r: number): void {
  const at = hitAt(arrays, surface, ray);
  arrays.hits[at] = 0;
  arrays.hits[at + 1] = r;
}

/** An engine that answered with this trace. */
export function tracer(engine: string, data: RaysTraceData): ParticipantResult {
  return { engine, fingerprint: `${engine} sources`, status: "ok", data };
}
