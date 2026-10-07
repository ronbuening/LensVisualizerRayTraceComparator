// The optical case: types mirroring contract/schema/v1/optical-case.schema.json, the case's identity, and the
// invariants a schema cannot state. Frame, units and signs are fixed in contract/CONTRACT.md.
import { hashCanonical } from "../core/numeric/hash.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";
import { deriveFeatures } from "./features.ts";
import type { FeatureFlag } from "./features.ts";
import { deepFreeze } from "./json.ts";
import type { Provenance } from "./provenance.ts";
import { assertKind } from "./schemas.ts";
import { CONTRACT_VERSION } from "./version.ts";

/** One polynomial term of an asphere: it adds `coeff * r^power` to the sag. `power` is an integer of at least 1. */
export interface AsphereTerm {
  readonly power: number;
  readonly coeff: number;
}

/**
 * A surface's shape. The sag is `z = c r^2 / (1 + sqrt(1 - (1 + conic) c^2 r^2)) + sum coeff * r^power` with
 * `c = 1/radius`, or 0 when `radius` is null. A radius above 0 puts the centre of curvature toward +z. A flat
 * surface is always the kind `plane`, never a large radius, and a sphere is a `conic` whose conic constant is 0.
 */
export type SurfaceShape =
  | { readonly kind: "plane" }
  | { readonly kind: "conic"; readonly radius: number; readonly conic: number }
  | {
      readonly kind: "asphere";
      readonly radius: number | null;
      readonly conic: number;
      readonly terms: readonly AsphereTerm[];
    };

/** A surface's clear aperture, mm. */
export interface SurfaceAperture {
  /** The effective clip radius. The limit is inclusive: a ray at exactly this height passes. */
  readonly semiDiameter: number;
  /** The semi-diameter the prescription states, before any rule that tightens it. */
  readonly nominalSemiDiameter: number;
  /** Radius of a central obstruction; 0 for none. */
  readonly innerSemiDiameter: number;
}

/** One surface of the system, in the order light meets it. */
export interface SurfaceIR {
  readonly label: string;
  /** Vertex position, mm. The first surface is at 0. */
  readonly z: number;
  /** Axial distance to the next vertex, mm; after the last surface, to the design image plane. */
  readonly thickness: number;
  readonly shape: SurfaceShape;
  readonly aperture: SurfaceAperture;
  /** The element whose glass follows the surface; 0 when no element does. */
  readonly elementId: number;
  /** Set on a surface the case source generated: a cover-glass or filter plate behind the lens. */
  readonly synthetic?: "rearPlate";
}

/** The lens itself, whatever it is used for. Hashed on its own as `systemId`. */
export interface OpticalSystem {
  readonly surfaces: readonly SurfaceIR[];
  readonly stopIndex: number;
  /** Index of the rear lens vertex: the last surface that is not a synthetic plate. */
  readonly lastLensSurfaceIndex: number;
  /** The image plane the system was designed for, mm: the last vertex plus the last thickness. */
  readonly designImageZ: number;
}

/** Where the object is: at infinity, or on the plane `z` (mm, below 0: ahead of the first vertex). */
export type ObjectConjugate = { readonly kind: "infinity" } | { readonly kind: "finite"; readonly z: number };

/** One wavelength with its weight. */
export interface SpectralLine {
  readonly wavelengthNm: number;
  readonly weight: number;
  /**
   * How the indices of this line were obtained: `authored` when the prescription states the index at this line,
   * `anchored` when a dispersion model anchored to the authored index supplied it.
   */
  readonly indexSource: "authored" | "anchored";
}

/** How the system is used: conjugate, stop, image plane and light. Hashed with the system as `id`. */
export interface CaseConditions {
  readonly object: ObjectConjugate;
  /** The stop's radius under these conditions, mm. */
  readonly stopSemiDiameter: number;
  /** The image plane, mm: the design image plane plus any focus shift. */
  readonly imageZ: number;
  /** Never empty. `lines[0]` is the reference line; its chief ray is the image reference point. */
  readonly lines: readonly SpectralLine[];
  /** Refractive index of the medium that follows each surface: float64, shape `[lines, surfaces]`; air is 1. */
  readonly indexAfterSurface: NdArrayWire;
}

/** What people call a case. Not part of its identity. */
export interface CaseLabel {
  readonly name: string;
  readonly lensKey?: string;
  readonly zoomT?: number;
  readonly focusT?: number;
}

/** One optical system under one set of conditions: the unit every engine is asked about. */
export interface OpticalCase {
  readonly contract: string;
  readonly kind: "optical-case";
  /** SHA-256 of the canonical JSON of `{ system, conditions }`. */
  readonly id: string;
  /** SHA-256 of the canonical JSON of `system`. */
  readonly systemId: string;
  readonly label: CaseLabel;
  readonly system: OpticalSystem;
  readonly conditions: CaseConditions;
  /** The feature flags `deriveFeatures` gives for `system` and `conditions`, sorted. */
  readonly features: readonly FeatureFlag[];
  readonly provenance: Provenance;
}

/** What a case source supplies. `finalizeCase` derives everything else. */
export type OpticalCaseDraft = Pick<OpticalCase, "label" | "system" | "conditions" | "provenance">;

/** How far a vertex may sit from the sum of the thicknesses before it, mm. */
export const Z_TOLERANCE_MM = 1e-9;

/**
 * The invariants of a case that its schema cannot state, as a list of what is broken (empty when nothing is):
 * `stopIndex` and `lastLensSurfaceIndex` are surface indices; each vertex `z`, and `designImageZ` after the last
 * surface, equals the sum of the thicknesses before it within `Z_TOLERANCE_MM`, so the first vertex is at 0; an
 * asphere's term powers are distinct; there is at least one line and every weight is positive; and
 * `indexAfterSurface` decodes to float64 of shape `[lines, surfaces]` holding positive finite indices. The inputs
 * are expected to be schema-valid.
 */
export function caseInvariantProblems(system: OpticalSystem, conditions: CaseConditions): string[] {
  const problems: string[] = [];
  const { surfaces } = system;
  for (const name of ["stopIndex", "lastLensSurfaceIndex"] as const) {
    const index = system[name];
    if (!Number.isInteger(index) || index < 0 || index >= surfaces.length) {
      problems.push(`system.${name} is ${index}, which is not the index of one of the ${surfaces.length} surfaces`);
    }
  }

  let expectedZ = 0;
  surfaces.forEach((surface, index) => {
    if (!(Math.abs(surface.z - expectedZ) <= Z_TOLERANCE_MM)) {
      problems.push(`system.surfaces[${index}].z is ${surface.z}, but the thicknesses before it sum to ${expectedZ}`);
    }
    expectedZ += surface.thickness;
    if (surface.shape.kind === "asphere") {
      const powers = surface.shape.terms.map((term) => term.power);
      const repeated = powers.find((power, at) => powers.indexOf(power) !== at);
      if (repeated !== undefined) {
        problems.push(`system.surfaces[${index}].shape.terms has more than one term of power ${repeated}`);
      }
    }
  });
  if (!(Math.abs(system.designImageZ - expectedZ) <= Z_TOLERANCE_MM)) {
    problems.push(`system.designImageZ is ${system.designImageZ}, but the thicknesses sum to ${expectedZ}`);
  }

  const { lines } = conditions;
  if (lines.length === 0) problems.push("conditions.lines is empty: a case needs a reference line");
  lines.forEach((line, index) => {
    if (!(line.weight > 0)) problems.push(`conditions.lines[${index}].weight is ${line.weight}, which is not positive`);
  });

  try {
    const table = decodeNdArray(conditions.indexAfterSurface);
    const [rows, columns] = table.shape;
    if (table.dtype !== "f8" || table.shape.length !== 2 || rows !== lines.length || columns !== surfaces.length) {
      problems.push(
        `conditions.indexAfterSurface is ${table.dtype} of shape [${table.shape.join(", ")}], ` +
          `expected f8 of shape [${lines.length}, ${surfaces.length}] (lines, surfaces)`,
      );
    } else if (!table.values.every((index) => Number.isFinite(index) && index > 0)) {
      problems.push("conditions.indexAfterSurface holds an index that is not a positive finite number");
    }
  } catch (error) {
    problems.push(`conditions.indexAfterSurface: ${error instanceof Error ? error.message : String(error)}`);
  }
  return problems;
}

/**
 * The two content hashes of a case. `systemId` covers the lens alone and `id` the lens under its conditions, so
 * cases of one lens at different apertures, conjugates or lines share a `systemId`. Label, features and provenance
 * are in neither.
 */
export function caseIdentity(system: OpticalSystem, conditions: CaseConditions): { systemId: string; id: string } {
  return { systemId: hashCanonical(system), id: hashCanonical({ system, conditions }) };
}

const UNSET_ID = "0".repeat(64);

/**
 * Turns a draft into a case: checks it against the schema and the invariants, derives the feature flags, computes
 * `systemId` and `id`, and returns the case frozen at every depth. The draft is copied, so it is neither frozen
 * nor kept. Throws an error listing every schema issue, or every broken invariant, when the draft is not a case.
 */
export function finalizeCase(draft: OpticalCaseDraft): OpticalCase {
  const { label, system, conditions, provenance } = structuredClone(draft);
  const unidentified: OpticalCase = {
    contract: CONTRACT_VERSION,
    kind: "optical-case",
    id: UNSET_ID,
    systemId: UNSET_ID,
    label,
    system,
    conditions,
    features: [],
    provenance,
  };
  // Nothing is derived from the draft until it is known to have the structure the derivations read.
  assertKind("optical-case", unidentified);
  const problems = caseInvariantProblems(system, conditions);
  if (problems.length > 0) throw new Error(`contract: not a valid optical-case: ${problems.join("; ")}`);
  return deepFreeze({
    ...unidentified,
    ...caseIdentity(system, conditions),
    features: deriveFeatures(system, conditions).flags,
  });
}

/** A derived field of a case that does not match what the case's own system and conditions give. */
export interface IdentityMismatch {
  readonly field: "systemId" | "id" | "features";
  /** What the case says; the feature list as JSON text. */
  readonly stated: string;
  /** What its system and conditions give. */
  readonly derived: string;
}

/**
 * Recomputes `systemId`, `id` and `features` from a case's own `system` and `conditions` and reports each one that
 * differs from what the case states; an empty list means the case is what it says it is. The case is expected to
 * be schema-valid.
 */
export function verifyCaseIdentity(opticalCase: OpticalCase): IdentityMismatch[] {
  const { system, conditions } = opticalCase;
  const derived = {
    ...caseIdentity(system, conditions),
    features: JSON.stringify(deriveFeatures(system, conditions).flags),
  };
  const stated = { systemId: opticalCase.systemId, id: opticalCase.id, features: JSON.stringify(opticalCase.features) };
  return (["systemId", "id", "features"] as const)
    .filter((field) => stated[field] !== derived[field])
    .map((field) => ({ field, stated: stated[field], derived: derived[field] }));
}
