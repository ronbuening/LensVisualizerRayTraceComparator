// The reference engine's own model of a case: what it builds from the contract's surfaces and conditions, and the
// only thing its quantities read. `system.describe` re-reads this model, so a fault in building it shows in rung R0.
import type { OpticalCase } from "../../contract/case.ts";
import { decodeNdArray, ndRow } from "../../core/numeric/ndarray.ts";
import { profileOf } from "./surface.ts";
import type { SurfaceProfile } from "./surface.ts";

/** One surface of the model. */
export interface RefSurface {
  /** Vertex position, mm. */
  readonly z: number;
  readonly profile: SurfaceProfile;
  /** The largest radial height at which a ray passes the surface, mm: the limit is inclusive. */
  readonly clipRadius: number;
  /** The radius of the surface's central obstruction, mm: a ray below it is stopped; 0 for none. */
  readonly innerClipRadius: number;
  /** The clear semi-diameter the clip radius was derived from, mm: the heights the sag is reported at scale with it. */
  readonly nominalSemiDiameter: number;
}

/** A case as the reference engine holds it. Every length is in mm, in the contract frame. */
export interface RefSystem {
  /** The surfaces in the order light meets them; never empty. */
  readonly surfaces: readonly RefSurface[];
  readonly stopIndex: number;
  /** The index of the rear lens vertex, from which the back focus is measured. */
  readonly lastLensSurfaceIndex: number;
  /** The stop's radius, from which the pupils are derived. */
  readonly stopSemiDiameter: number;
  readonly imageZ: number;
  /** The object plane; null for an object at infinity. */
  readonly objectZ: number | null;
  /** The index of the medium that follows each surface: one row per line of the case, one element per surface. */
  readonly indexAfter: readonly Float64Array[];
}

/**
 * Builds the model of a case. A surface stands where its vertex `z` says, and the gap between two surfaces is the
 * difference of their vertices: `thickness`, which the case keeps equal to it within 1e-9 mm, is not read, so the
 * model has one statement of where a surface is. The stop surface clips by its own aperture like any other, which
 * a case states for its stop setting; `stopSemiDiameter` is the radius the pupils are images of, and no second
 * clip. The case is expected to be valid by its schema and its invariants, as the protocol handler has checked.
 */
export function buildRefSystem(opticalCase: OpticalCase): RefSystem {
  const { system, conditions } = opticalCase;
  const table = decodeNdArray(conditions.indexAfterSurface);
  if (table.dtype !== "f8") throw new Error(`the index table is ${table.dtype}, not f8`);
  return {
    surfaces: system.surfaces.map((surface) => ({
      z: surface.z,
      profile: profileOf(surface.shape),
      clipRadius: surface.aperture.semiDiameter,
      innerClipRadius: surface.aperture.innerSemiDiameter,
      nominalSemiDiameter: surface.aperture.nominalSemiDiameter,
    })),
    stopIndex: system.stopIndex,
    lastLensSurfaceIndex: system.lastLensSurfaceIndex,
    stopSemiDiameter: conditions.stopSemiDiameter,
    imageZ: conditions.imageZ,
    objectZ: conditions.object.kind === "finite" ? conditions.object.z : null,
    indexAfter: conditions.lines.map((_line, row) => ndRow(table, row)),
  };
}
