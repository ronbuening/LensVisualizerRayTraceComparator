// The quantity `rays.trace`: mirrors contract/schema/v1/quantities/rays.trace.spec.schema.json and
// rays.trace.data.schema.json. What an engine must report, and the frame and signs of it, are fixed in
// contract/CONTRACT.md.
//
// These are type aliases, not interfaces, so that a value of one is also a `JsonObject` and can be a request's
// `spec` or a result's `data` as it is.
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";

/** The id of the quantity that traces given rays: what the identical-ray rungs compare. */
export const RAYS_TRACE = "rays.trace";

/** The version of `rays.trace`'s definition, which an engine that answers it states in its descriptor. */
export const RAYS_TRACE_VERSION = 1;

/**
 * How a ray ended, as `status` holds it.
 *
 * - `ok` (0): the ray passed every surface and reached the image plane.
 * - `blocked` (1): the ray carries no light to the image, and the engine knows why: it met a surface outside its
 *   clear aperture or inside its central obstruction, it was totally reflected, it provably misses a surface, or it
 *   passed every surface and cannot reach the image plane.
 * - `failed` (2): the engine could not trace the ray: a numerical failure of its own, which says nothing about the
 *   light.
 */
export const RAY_STATUS = Object.freeze({ ok: 0, blocked: 1, failed: 2 } as const);
/** The name of one way a ray ends. */
export type RayStatusName = keyof typeof RAY_STATUS;

/** How far the length of a ray's direction may be from 1. */
export const DIRECTION_NORM_TOLERANCE = 1e-12;

/** The `endSurface` of a ray that reached the image plane. */
export const NO_END_SURFACE = -1;

/** The field a set of rays comes from. */
export type RayField = {
  /** The field angle in degrees; a positive angle is an object toward +y. */
  readonly angleDeg: number;
  /** The fraction of the full image height that the case source resolved to this angle. */
  readonly heightFraction?: number;
};

/**
 * A square lattice the rays lie on: the first `columns * rows` rays of the set are its cells, row by row, so that
 * the cell of row r and column c is ray `r * columns + c`. `step` is the side of a cell, mm, on the plane the
 * lattice is laid on.
 */
export type RayLattice = { readonly columns: number; readonly rows: number; readonly step: number };

/**
 * What the rays of a set are, for whoever reads the answer. An engine traces every ray alike and reads none of
 * this; it is part of the spec, and so of the request's identity.
 */
export type RayGroups = {
  readonly field?: RayField;
  readonly lattice?: RayLattice;
  /** The index of the chief ray of the field: a reference for the others, not a sample of the pupil. */
  readonly chiefIndex?: number;
};

/** What a `rays.trace` request asks for: n rays, to be traced as they are given at one line of the case. */
export type RaysTraceSpec = {
  /** The index, in the case's `conditions.lines`, of the line whose indices the rays are traced with. */
  readonly line: number;
  /**
   * Where each ray starts, mm: float64 `[n, 3]`. Every origin lies in front of the first surface: its z is below
   * the smallest z the surface has within its clear aperture.
   */
  readonly origins: NdArrayWire;
  /** The direction of each ray: float64 `[n, 3]`, unit vectors with a z component above 0. */
  readonly directions: NdArrayWire;
  /** The flux each ray stands for: float64 `[n]`, finite and not negative. A ray of weight 0 is traced like any. */
  readonly weights: NdArrayWire;
  readonly groups?: RayGroups;
};

/** The trace of n rays through the S surfaces of a case and on to its image plane. */
export type RaysTraceData = {
  /** How each ray ended (`RAY_STATUS`): uint8 `[n]`. */
  readonly status: NdArrayWire;
  /**
   * The index of the surface at which each ray ended: int32 `[n]`. S for a ray that passed every surface and
   * cannot reach the image plane, and -1 for a ray that reached it.
   */
  readonly endSurface: NdArrayWire;
  /** Where each ray meets each surface, mm: float64 `[S, n, 3]`; NaN from the surface at which the ray ended. */
  readonly hits: NdArrayWire;
  /** Where each ray leaves the last surface, mm: float64 `[n, 3]`. */
  readonly exitPoint: NdArrayWire;
  /** The unit direction of each ray behind the last surface: float64 `[n, 3]`. */
  readonly exitDirection: NdArrayWire;
  /** Where each ray meets the image plane, mm: float64 `[n, 3]`, with z the case's `imageZ`. */
  readonly imagePoint: NdArrayWire;
  /** The sum of index times length along each ray from its origin to the last surface, mm: float64 `[n]`. */
  readonly opticalPath: NdArrayWire;
  /** The same sum continued to the image plane in the index of the image space, mm: float64 `[n]`. */
  readonly opticalPathToImage: NdArrayWire;
};
