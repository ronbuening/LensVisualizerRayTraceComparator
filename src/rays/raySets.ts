// Ray sets: the rays a run asks every engine to trace, as the specs of `rays.trace` requests. Where they come from
// is the case source's business (`CaseSource.raySets` in src/core/suite.ts): a case read from a file gets probe
// lattices made from the case alone, and a LensVisualizer lens gets LensVisualizer's own launch rays. A set is
// content: its arrays are part of the spec, the spec is part of the request's id, and nothing of it is kept in the
// repository.
import type { RayGroups, RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import type { RunFields } from "../contract/runSpec.ts";
import { hashCanonical } from "../core/numeric/hash.ts";
import { encodeNdArray } from "../core/numeric/ndarray.ts";
import type { RayBundle } from "./generators.ts";

/** The fields a run traces rays for when it states none: the axis, half the image height and the full height. */
export const DEFAULT_RAY_FIELDS: RunFields = Object.freeze({
  kind: "image-height-fractions",
  values: Object.freeze([0, 0.5, 1]),
});

/** The number of lattice cells across a beam when a run states no `sampling.bundleGrid`. */
export const DEFAULT_BUNDLE_GRID = 32;

/** The ray sets of one run: a set for every field and line that has one, and why a field has none. */
export interface RaySetResolution {
  /** The sets, in a fixed order: the fields in the order the run states them, and for each field the lines. */
  readonly sets: readonly RaysTraceSpec[];
  /**
   * What kept a field from having rays, each as `<code>: <message>`; deterministic text without absolute paths,
   * since it is recorded with the run. The other fields are not affected.
   */
  readonly problems: readonly string[];
}

/** A coded problem as one line: `<code>: <message>`. */
export function rayProblem(code: string, message: string): string {
  return `${code}: ${message}`;
}

/**
 * A bundle of rays as the spec of a `rays.trace` request at one line of a case. Every bit of the arrays is kept,
 * so the rays an engine is handed are the ones that were generated.
 */
export function raySetSpec(line: number, bundle: RayBundle, groups?: RayGroups): RaysTraceSpec {
  const rays = bundle.weights.length;
  return {
    line,
    origins: encodeNdArray(bundle.origins, [rays, 3]),
    directions: encodeNdArray(bundle.directions, [rays, 3]),
    weights: encodeNdArray(bundle.weights, [rays]),
    ...(groups === undefined ? {} : { groups }),
  };
}

/**
 * The identity of a ray set: the SHA-256 of the canonical JSON of its spec. It does not depend on the case, so two
 * runs that trace the same rays at the same line index show the same id.
 */
export function raySetId(spec: RaysTraceSpec): string {
  return hashCanonical(spec);
}
