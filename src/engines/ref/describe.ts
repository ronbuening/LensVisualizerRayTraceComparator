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
    ...(system.opticalPath === undefined
      ? {}
      : {
          opticalPath: system.opticalPath,
          pathSurfaceIndices: system.opticalPath.map((step) => step.surfaceIndex),
          pathInteractions: system.opticalPath.map((step) => step.interaction),
          pathIndexAfterSurface: encodeF8(
            indexAfter.flatMap((row) => {
              let medium = 1,
                heading = 1;
              return system.opticalPath!.map((step) => {
                const side = heading > 0 ? "front" : "rear";
                const active =
                  step.incidentSide === undefined || step.incidentSide === "both" || step.incidentSide === side;
                const reference =
                  side === "rear" && step.reverseMediumAfter !== undefined ? step.reverseMediumAfter : step.mediumAfter;
                if (active && step.interaction === "refract")
                  medium = reference === null ? 1 : row[reference ?? step.surfaceIndex];
                if (active && step.interaction === "reflect") heading = -heading;
                return medium;
              });
            }),
            [indexAfter.length, system.opticalPath.length],
          ),
        }),
    ...(surfaces.some((surface) => surface.diffractive !== undefined)
      ? { diffractive: surfaces.map((surface) => surface.diffractive ?? null) }
      : {}),
    surfaceCount: surfaces.length,
    stopIndex: system.stopIndex,
    imageZ: system.imageZ,
    stopSemiDiameter: system.stopSemiDiameter,
    vertexZ: encodeF8(surfaces.map((surface) => surface.z)),
    curvature: encodeF8(surfaces.map((surface) => surface.profile.curvature)),
    conic: encodeF8(surfaces.map((surface) => surface.profile.conic)),
    clipRadius: encodeF8(surfaces.map((surface) => surface.clipRadius)),
    innerClipRadius: encodeF8(surfaces.map((surface) => surface.innerClipRadius)),
    indexAfterSurface: encodeF8(
      indexAfter.flatMap((row) => [...row]),
      [indexAfter.length, surfaces.length],
    ),
    sagRadii: encodeF8(radii, sagShape),
    sag: encodeF8(sags, sagShape),
    terms: surfaces.map((surface) => surface.profile.terms.map(({ power, coeff }) => ({ power, coeff }))),
  };
}
