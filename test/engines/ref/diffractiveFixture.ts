import { finalizeCase } from "../../../src/contract/case.ts";
import type { DiffractivePhase } from "../../../src/contract/case.ts";
import { encodeF8 } from "../../../src/core/numeric/ndarray.ts";
export const PHASE: DiffractivePhase = {
  kind: "radial-polynomial",
  referenceWavelengthNm: 500,
  diffractionOrder: 1,
  terms: [{ radialPower: 2, coefficient: -1 / 200 }],
};
export function phaseCase(phase = PHASE) {
  return finalizeCase({
    label: { name: "Synthetic quadratic kinoform" },
    system: {
      surfaces: [
        {
          label: "DOE",
          z: 0,
          thickness: 100,
          shape: { kind: "plane" },
          aperture: { semiDiameter: 10, nominalSemiDiameter: 10, innerSemiDiameter: 0 },
          elementId: 0,
          diffractive: phase,
        },
      ],
      stopIndex: 0,
      lastLensSurfaceIndex: 0,
      designImageZ: 100,
    },
    conditions: {
      object: { kind: "infinity" },
      stopSemiDiameter: 10,
      imageZ: 100,
      lines: [{ wavelengthNm: 500, weight: 1, indexSource: "authored" }],
      indexAfterSurface: encodeF8([1], [1, 1]),
    },
    provenance: {
      producer: { tool: "lvrtc", version: "0.1.0" },
      source: { kind: "fixture", name: "synthetic-kinoform" },
    },
  });
}
export const KINOFORM = phaseCase();
