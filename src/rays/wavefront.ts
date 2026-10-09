// A `rays.trace` request and an answer to it as the wave estimator reads them (src/estimators/waveOtf.ts): the
// lattice of a field at the lines of a case, with what each ray weighs, where it started, where it met the image
// plane, which way it travelled there and how long its path was. Rung R6a reads two engines' answers this way, and
// the engine `wave` LensVisualizer's own.
import type { OpticalCase } from "../contract/case.ts";
import type { JsonObject } from "../contract/json.ts";
import type { RayLattice, RaysTraceData, RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { createExactSum } from "../core/numeric/exact.ts";
import { decodeNdArray, ndRow } from "../core/numeric/ndarray.ts";
import type { NdArrayWire, NdDtype, NdValuesByDtype } from "../core/numeric/ndarray.ts";
import { launchPaths, polychromaticWaveOtf } from "../estimators/waveOtf.ts";
import type {
  PolychromaticWaveOtf,
  ReferencePoint,
  SpectralLattice,
  WaveOtfUnavailable,
} from "../estimators/waveOtf.ts";

/** Millimetres in a nanometre. */
const MM_PER_NM = 1e-6;

/**
 * What a `rays.trace` answer says of the wave behind the last surface: how each ray ended, where it meets the image
 * plane, which way it travels there and the optical path to that point.
 */
export interface DecodedWavefront {
  readonly rays: number;
  readonly status: Uint8Array;
  /** The x of each ray's `imagePoint`, mm; NaN for a ray that did not arrive. */
  readonly x: Float64Array;
  /** The y of each ray's `imagePoint`, mm; NaN for a ray that did not arrive. */
  readonly y: Float64Array;
  /** `imagePoint`, `[n, 3]` flat, mm. */
  readonly imagePoint: Float64Array;
  /** `exitDirection`, `[n, 3]` flat. */
  readonly exitDirection: Float64Array;
  /** `opticalPathToImage`, mm. */
  readonly opticalPathToImage: Float64Array;
}

function elements<D extends NdDtype>(wire: NdArrayWire, dtype: D, name: string): NdValuesByDtype[D] {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== dtype) throw new Error(`rays.trace: ${name} is ${decoded.dtype}, not ${dtype}`);
  return decoded.values as NdValuesByDtype[D];
}

/** Decodes what an estimator of the wavefront reads of an answer: never its hits. The data is valid by the rules. */
export function decodeWavefront(data: JsonObject): DecodedWavefront {
  const trace = data as RaysTraceData;
  const rays = trace.status.$nd.shape[0];
  const imagePoint = elements(trace.imagePoint, "f8", "imagePoint");
  const x = new Float64Array(rays);
  const y = new Float64Array(rays);
  for (let ray = 0; ray < rays; ray++) {
    x[ray] = imagePoint[3 * ray];
    y[ray] = imagePoint[3 * ray + 1];
  }
  return {
    rays,
    status: elements(trace.status, "u1", "status"),
    x,
    y,
    imagePoint,
    exitDirection: elements(trace.exitDirection, "f8", "exitDirection"),
    opticalPathToImage: elements(trace.opticalPathToImage, "f8", "opticalPathToImage"),
  };
}

/**
 * The flux-weighted centroid of the landings of the rays `valid` takes, or null when they carry no flux. Every sum
 * is compensated and the rays are added in their order, so equal landings give equal bits.
 */
export function fluxCentroid(
  landings: { readonly rays: number; readonly x: ArrayLike<number>; readonly y: ArrayLike<number> },
  weights: ArrayLike<number>,
  valid: ArrayLike<number>,
): { x: number; y: number } | null {
  const [flux, x, y] = [createExactSum(), createExactSum(), createExactSum()];
  for (let ray = 0; ray < landings.rays; ray++) {
    if (!valid[ray] || !(weights[ray] > 0)) continue;
    flux.add(weights[ray], 1);
    x.add(weights[ray], landings.x[ray]);
    y.add(weights[ray], landings.y[ray]);
  }
  const total = flux.value();
  return total > 0 ? { x: x.value() / total, y: y.value() / total } : null;
}

/** The index of the image space of a case at each of its lines: of the medium behind the last surface. */
export function imageSpaceIndices(opticalCase: OpticalCase): number[] {
  const table = decodeNdArray(opticalCase.conditions.indexAfterSurface);
  if (table.dtype !== "f8") throw new Error(`the index table is ${table.dtype}, not f8`);
  const last = opticalCase.system.surfaces.length - 1;
  return opticalCase.conditions.lines.map((_line, line) => ndRow(table, line)[last]);
}

/** What a request says of its rays, decoded once for every engine that traced them. */
export interface LaunchedSet {
  /** The index of the line in the case. */
  readonly line: number;
  /** The flux each ray stands for. */
  readonly weights: Float64Array;
  /** The optical path from the incident wavefront to each ray's origin, mm (`launchPaths`). */
  readonly launch: Float64Array;
}

/** The weights of a set and the launch paths of its rays under the conjugate of `opticalCase`. */
export function launchedSet(spec: RaysTraceSpec, opticalCase: OpticalCase): LaunchedSet {
  return {
    line: spec.line,
    weights: elements(spec.weights, "f8", "weights"),
    launch: launchPaths(
      elements(spec.origins, "f8", "origins"),
      elements(spec.directions, "f8", "directions"),
      opticalCase.conditions.object,
    ),
  };
}

/** One line of a field on one lattice as one engine traced it, with the rays that are taken. */
export interface WaveLine {
  readonly set: LaunchedSet;
  readonly trace: DecodedWavefront;
  /** The rays that are taken: 1 for each. */
  readonly valid: ArrayLike<number>;
}

/**
 * The wave transfer function of a field from one engine's traces of its lattice at every line of a case, about
 * `reference`, at `frequencies` (cycles a millimetre): `polychromaticWaveOtf` of the bundles the traces are.
 *
 * Of each answer it reads `imagePoint` with `opticalPathToImage`, the better conditioned of the two points a trace
 * has behind the last surface, and `exitDirection`; of each request the weights and the launch paths; of the case
 * the wavelength and the weight of each line and the index of the image space (`indices`: `imageSpaceIndices`).
 * `lines` are in the order the spectrum is to be added in, the reference line first.
 */
export function fieldWaveOtf(
  opticalCase: OpticalCase,
  indices: readonly number[],
  lattice: RayLattice,
  lines: readonly WaveLine[],
  reference: ReferencePoint,
  frequencies: readonly number[],
): PolychromaticWaveOtf | WaveOtfUnavailable {
  const { conditions } = opticalCase;
  const spectrum = lines.map(({ set, trace, valid }): SpectralLattice => {
    return {
      weight: conditions.lines[set.line].weight,
      bundle: {
        columns: lattice.columns,
        rows: lattice.rows,
        weight: set.weights,
        valid,
        point: trace.imagePoint,
        direction: trace.exitDirection,
        path: trace.opticalPathToImage,
        launchPath: set.launch,
        wavelengthMm: conditions.lines[set.line].wavelengthNm * MM_PER_NM,
        imageIndex: indices[set.line],
      },
    };
  });
  return polychromaticWaveOtf(spectrum, reference, frequencies);
}
