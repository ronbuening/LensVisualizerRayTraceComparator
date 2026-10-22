// What the two comparators of `rays.trace` share: an answer decoded once, the check that two answers are of the
// same rays, and where a set of rays lies in its run.
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire, NdDtype, NdValuesByDtype } from "../core/numeric/ndarray.ts";

/** Where a metric occurs. */
export type Where = NonNullable<ComparisonMetric["where"]>;

/** A `rays.trace` answer with its arrays decoded: n rays through S surfaces. */
export interface DecodedTrace {
  readonly rays: number;
  readonly surfaces: number;
  readonly status: Uint8Array;
  readonly endSurface: Int32Array;
  /** `[S, n, 3]`, flat: the hit of ray r on surface s starts at `(s * n + r) * 3`. */
  readonly hits: Float64Array;
  readonly exitDirection: Float64Array;
  readonly imagePoint: Float64Array;
  readonly opticalPath: Float64Array;
  readonly opticalPathToImage: Float64Array;
}

function elements<D extends NdDtype>(wire: NdArrayWire, dtype: D, name: string): NdValuesByDtype[D] {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== dtype) throw new Error(`${RAYS_TRACE}: ${name} is ${decoded.dtype}, not ${dtype}`);
  return decoded.values as NdValuesByDtype[D];
}

/** Decodes the arrays of an answer that two metrics or more read. The data is valid by the quantity's rules. */
export function decodeTrace(data: JsonObject): DecodedTrace {
  const trace = data as RaysTraceData;
  return {
    rays: trace.status.$nd.shape[0],
    surfaces: trace.hits.$nd.shape[0],
    status: elements(trace.status, "u1", "status"),
    endSurface: elements(trace.endSurface, "i4", "endSurface"),
    hits: elements(trace.hits, "f8", "hits"),
    exitDirection: elements(trace.exitDirection, "f8", "exitDirection"),
    imagePoint: elements(trace.imagePoint, "f8", "imagePoint"),
    opticalPath: elements(trace.opticalPath, "f8", "opticalPath"),
    opticalPathToImage: elements(trace.opticalPathToImage, "f8", "opticalPathToImage"),
  };
}

/** Where the rays of a `rays.trace` answer land, and how each ended: what an estimator of the image reads. */
export interface DecodedLandings {
  readonly rays: number;
  readonly status: Uint8Array;
  /** The x of each ray's `imagePoint`, mm; NaN for a ray that did not arrive. */
  readonly x: Float64Array;
  /** The y of each ray's `imagePoint`, mm; NaN for a ray that did not arrive. */
  readonly y: Float64Array;
}

/** Decodes the landings of an answer and nothing else of it. The data is valid by the quantity's rules. */
export function decodeLandings(data: JsonObject): DecodedLandings {
  const trace = data as RaysTraceData;
  const rays = trace.status.$nd.shape[0];
  const imagePoint = elements(trace.imagePoint, "f8", "imagePoint");
  const x = new Float64Array(rays);
  const y = new Float64Array(rays);
  for (let ray = 0; ray < rays; ray++) {
    x[ray] = imagePoint[3 * ray];
    y[ray] = imagePoint[3 * ray + 1];
  }
  return { rays, status: elements(trace.status, "u1", "status"), x, y };
}

/** Why two answers are not traces of the same rays through the same surfaces, or null when they are. */
export function differentRays(a: DecodedTrace, b: DecodedTrace): string | null {
  if (a.rays !== b.rays) return `the answers are for different numbers of rays: ${a.rays} and ${b.rays}`;
  if (a.surfaces !== b.surfaces) {
    return `the answers are for different numbers of surfaces: ${a.surfaces} and ${b.surfaces}`;
  }
  return null;
}

/** The rays that are ok in both answers, in order: the rays whose positions and paths are compared. */
export function okInBoth(a: DecodedTrace, b: DecodedTrace): Int32Array {
  const both: number[] = [];
  for (let ray = 0; ray < a.rays; ray++) {
    if (a.status[ray] === RAY_STATUS.ok && b.status[ray] === RAY_STATUS.ok) both.push(ray);
  }
  return Int32Array.from(both);
}

/**
 * Where the rays of a request lie in their run, for the `where` of a metric: the `line` of the case they were
 * traced at and, for a set that states one, the `field` angle in degrees. Empty without a spec.
 */
export function placeOf(spec: JsonObject | undefined): Where {
  if (spec === undefined) return {};
  const { line, groups } = spec as RaysTraceSpec;
  const angle = groups?.field?.angleDeg;
  return { line, ...(angle === undefined ? {} : { field: angle }) };
}

/** The largest of a series of values and the ray, and surface, it occurs at; a NaN, once met, stays. */
export interface WorstRay {
  value: number;
  ray: number;
  surface: number;
}

/** A series with nothing in it yet. */
export function noWorst(): WorstRay {
  return { value: 0, ray: -1, surface: -1 };
}

/** Takes one more value into a series: the first of equal values is kept, and a NaN ends the series. */
export function takeWorst(worst: WorstRay, value: number, ray: number, surface = -1): void {
  if (Number.isNaN(worst.value)) return;
  if (Number.isNaN(value) || worst.ray < 0 || value > worst.value) {
    worst.value = value;
    worst.ray = ray;
    worst.surface = surface;
  }
}

/** Where the largest value of a series occurs: the place of the set, the ray and, where it has one, the surface. */
export function whereOf(place: Where, worst: Pick<WorstRay, "ray" | "surface">): Where {
  return { ...place, ray: worst.ray, ...(worst.surface < 0 ? {} : { surface: worst.surface }) };
}
