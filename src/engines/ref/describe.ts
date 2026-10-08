// `system.describe` as the reference engine answers it: its own model, read back.
import type { SystemDescribeData } from "../../contract/quantities/systemDescribe.ts";
import { encodeNdArray } from "../../core/numeric/ndarray.ts";
import type { RefSystem } from "./model.ts";
import { sag } from "./surface.ts";

/**
 * The numbers as a float64 array in which -0 is written 0. A case's identity does not tell the two apart, so an
 * answer about a case must not either: adding 0 turns -0 into 0 and changes no other number.
 */
function f8(values: readonly number[]): Float64Array {
  return Float64Array.from(values, (value) => value + 0);
}

/**
 * The model of a case as `system.describe` data, with the sag of every surface at each of `sagFractions` times its
 * nominal semi-diameter (one multiplication). A sag the surface does not have there, beyond the height at which
 * its conic ends, is NaN. Nothing is read from the case: every number comes from the model.
 */
export function describeSystem(system: RefSystem, sagFractions: readonly number[]): SystemDescribeData {
  const { surfaces, indexAfter } = system;
  const radii = surfaces.flatMap((surface) => sagFractions.map((fraction) => fraction * surface.nominalSemiDiameter));
  const sags = surfaces.flatMap((surface, index) =>
    sagFractions.map((_fraction, sample) => sag(surface.profile, radii[index * sagFractions.length + sample])),
  );
  const sagShape = [surfaces.length, sagFractions.length];
  return {
    surfaceCount: surfaces.length,
    stopIndex: system.stopIndex,
    imageZ: system.imageZ,
    stopSemiDiameter: system.stopSemiDiameter,
    vertexZ: encodeNdArray(f8(surfaces.map((surface) => surface.z))),
    curvature: encodeNdArray(f8(surfaces.map((surface) => surface.profile.curvature))),
    conic: encodeNdArray(f8(surfaces.map((surface) => surface.profile.conic))),
    clipRadius: encodeNdArray(f8(surfaces.map((surface) => surface.clipRadius))),
    indexAfterSurface: encodeNdArray(f8(indexAfter.flatMap((row) => [...row])), [indexAfter.length, surfaces.length]),
    sagRadii: encodeNdArray(f8(radii), sagShape),
    sag: encodeNdArray(f8(sags), sagShape),
    terms: surfaces.map((surface) => surface.profile.terms.map(({ power, coeff }) => ({ power, coeff }))),
  };
}
