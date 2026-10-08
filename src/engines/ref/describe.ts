// `system.describe` as the reference engine answers it: its own model, read back.
import type { SystemDescribeData } from "../../contract/quantities/systemDescribe.ts";
import { encodeF8 } from "../../core/numeric/ndarray.ts";
import type { RefSystem } from "./model.ts";
import { sag } from "./surface.ts";

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
    vertexZ: encodeF8(surfaces.map((surface) => surface.z)),
    curvature: encodeF8(surfaces.map((surface) => surface.profile.curvature)),
    conic: encodeF8(surfaces.map((surface) => surface.profile.conic)),
    clipRadius: encodeF8(surfaces.map((surface) => surface.clipRadius)),
    indexAfterSurface: encodeF8(
      indexAfter.flatMap((row) => [...row]),
      [indexAfter.length, surfaces.length],
    ),
    sagRadii: encodeF8(radii, sagShape),
    sag: encodeF8(sags, sagShape),
    terms: surfaces.map((surface) => surface.profile.terms.map(({ power, coeff }) => ({ power, coeff }))),
  };
}
