// Synthetic fixtures only. No number or prescription here is read from LV.
import { finalizeCase } from "../../../src/contract/case.ts";
import type { OpticalPathStep, SurfaceShape } from "../../../src/contract/case.ts";
import { encodeF8 } from "../../../src/core/numeric/ndarray.ts";

export function foldedCase(
  surfaces: readonly { z: number; radius?: number; conic?: number; n?: number; inner?: number; outer?: number }[],
  path: readonly OpticalPathStep[],
  imageZ: number,
) {
  return finalizeCase({
    label: { name: "synthetic folded system" },
    system: {
      surfaces: surfaces.map((surface, at) => ({
        label: `S${at}`,
        z: surface.z,
        thickness: (surfaces[at + 1]?.z ?? imageZ) - surface.z,
        shape:
          surface.radius === undefined
            ? { kind: "plane" }
            : ({ kind: "conic", radius: surface.radius, conic: surface.conic ?? 0 } as SurfaceShape),
        aperture: {
          semiDiameter: surface.outer ?? 25,
          nominalSemiDiameter: surface.outer ?? 25,
          innerSemiDiameter: surface.inner ?? 0,
        },
        elementId: 0,
      })),
      opticalPath: path,
      stopIndex: 0,
      lastLensSurfaceIndex: surfaces.length - 1,
      designImageZ: imageZ,
    },
    conditions: {
      object: { kind: "infinity" },
      stopSemiDiameter: 25,
      imageZ,
      lines: [{ wavelengthNm: 550, weight: 1, indexSource: "authored" }],
      indexAfterSurface: encodeF8(
        surfaces.map((surface) => surface.n ?? 1),
        [1, surfaces.length],
      ),
    },
    provenance: {
      source: { kind: "fixture", name: "analytic folded proof" },
      producer: { tool: "lvrtc", version: "test" },
    },
  });
}

export const SPHERICAL_MIRROR = foldedCase(
  [{ z: 0 }, { z: 100, radius: -100 }],
  [
    { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
    { surfaceIndex: 1, interaction: "reflect" },
  ],
  50,
);
export const MANGIN = foldedCase(
  [
    { z: 0, n: 1.5 },
    { z: 10, radius: -100, n: 1.5 },
  ],
  [
    { surfaceIndex: 0, interaction: "refract", mediumAfter: 0 },
    { surfaceIndex: 1, interaction: "reflect" },
    { surfaceIndex: 0, interaction: "refract", mediumAfter: null },
  ],
  -80 / 3,
);
