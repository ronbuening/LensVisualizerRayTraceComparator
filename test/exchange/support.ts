// Synthetic cases for the tests of the prescription writers: made-up numbers, no LensVisualizer value.
import { finalizeCase } from "../../src/contract/case.ts";
import type { OpticalCase, OpticalCaseDraft } from "../../src/contract/case.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";

/**
 * A sequential case with a surface of every kind the contract has: an asphere on a curved base, a sphere with a
 * diffractive phase, a plane stop, an asphere on a flat base with odd terms and a central obstruction, a conic, and a
 * rear plate that does not clip. A finite object, two lines, a vertex at -0 and a focus shift.
 */
export function everyKindCase(): OpticalCase {
  const aperture = (semiDiameter: number | null, nominal: number, inner = 0) => ({
    semiDiameter,
    nominalSemiDiameter: nominal,
    innerSemiDiameter: inner,
  });
  const draft: OpticalCaseDraft = {
    label: { name: "Every kind", lensKey: "made-up-zoom", zoomT: 0.5, focusT: 0.125 },
    system: {
      surfaces: [
        {
          label: "A1",
          z: -0,
          thickness: 2.5,
          shape: {
            kind: "asphere",
            radius: 50,
            conic: -1,
            terms: [
              { power: 4, coeff: 1.25e-6 },
              { power: 6, coeff: -2.5e-10 },
            ],
          },
          aperture: aperture(10, 10.5),
          elementId: 1,
        },
        {
          label: "D2",
          z: 2.5,
          thickness: 1.5,
          shape: { kind: "conic", radius: -80, conic: 0 },
          aperture: aperture(10, 10),
          elementId: 0,
          diffractive: {
            kind: "radial-polynomial",
            referenceWavelengthNm: 550,
            diffractionOrder: 1,
            terms: [
              { radialPower: 2, coefficient: -0.001 },
              { radialPower: 4, coefficient: 3e-8 },
            ],
          },
        },
        {
          label: "STO",
          z: 4,
          thickness: 3,
          shape: { kind: "plane" },
          aperture: aperture(4, 4),
          elementId: 0,
        },
        {
          label: "O4",
          z: 7,
          thickness: 2,
          shape: {
            kind: "asphere",
            radius: null,
            conic: 0,
            terms: [
              { power: 1, coeff: 0.0005 },
              { power: 3, coeff: 2e-5 },
            ],
          },
          aperture: aperture(8, 8, 1.5),
          elementId: 2,
        },
        {
          label: "C5",
          z: 9,
          thickness: 20,
          shape: { kind: "conic", radius: 30, conic: 0.5 },
          aperture: aperture(8, 8),
          elementId: 0,
        },
        {
          label: "RP",
          z: 29,
          thickness: 1,
          shape: { kind: "plane" },
          aperture: aperture(null, 12),
          elementId: 3,
          synthetic: "rearPlate",
        },
      ],
      stopIndex: 2,
      lastLensSurfaceIndex: 4,
      designImageZ: 30,
    },
    conditions: {
      object: { kind: "finite", z: -200 },
      stopSemiDiameter: 4,
      imageZ: 30.25,
      lines: [
        { wavelengthNm: 550, weight: 1, indexSource: "authored" },
        { wavelengthNm: 650, weight: 0.5, indexSource: "anchored" },
      ],
      indexAfterSurface: encodeNdArray(
        Float64Array.of(1.5, 1, 1, 1.625, 1, 1.5, 1.4921875, 1, 1, 1.6171875, 1, 1.4921875),
        [2, 6],
      ),
    },
    provenance: {
      source: {
        kind: "lv-lens",
        lensKey: "made-up-zoom",
        file: "src/lens-data/made-up/MadeUp.data.ts",
        fileSha256: "a".repeat(64),
        zoomT: 0.5,
        focusT: 0.125,
      },
      lv: { commit: "b".repeat(40), dirty: false, closureHash: "c".repeat(64) },
      notes: ["made-up-note"],
      producer: { tool: "lvrtc", version: "0.0.0" },
    },
  };
  return finalizeCase(draft);
}

/** A folded case: a mirror between two passes of one window, the path stated visit by visit. */
export function foldedCase(): OpticalCase {
  return finalizeCase({
    label: { name: "Folded" },
    system: {
      surfaces: [
        {
          label: "W",
          z: 0,
          thickness: 10,
          shape: { kind: "plane" },
          aperture: { semiDiameter: 20, nominalSemiDiameter: 20, innerSemiDiameter: 0 },
          elementId: 0,
        },
        {
          label: "M",
          z: 10,
          thickness: -40,
          shape: { kind: "conic", radius: -100, conic: -1 },
          aperture: { semiDiameter: 20, nominalSemiDiameter: 20, innerSemiDiameter: 5 },
          elementId: 0,
        },
      ],
      opticalPath: [
        { surfaceIndex: 0, interaction: "refract", mediumAfter: 0, incidentSide: "front", inactiveSide: "ignore" },
        { surfaceIndex: 1, interaction: "reflect" },
        { surfaceIndex: 0, interaction: "refract", mediumAfter: null, reverseMediumAfter: 0 },
      ],
      stopIndex: 0,
      lastLensSurfaceIndex: 1,
      designImageZ: -30,
    },
    conditions: {
      object: { kind: "infinity" },
      stopSemiDiameter: 20,
      imageZ: -30,
      lines: [{ wavelengthNm: 500, weight: 1, indexSource: "authored" }],
      indexAfterSurface: encodeNdArray(Float64Array.of(1.25, 1), [1, 2]),
    },
    provenance: { source: { kind: "fixture", name: "folded" }, producer: { tool: "lvrtc", version: "0.0.0" } },
  });
}

/** A request about `opticalCase` whose spec has an encoded array, a list, a string, nested members and options. */
export function requestAbout(opticalCase: OpticalCase): QuantityRequest {
  return makeRequest({
    caseId: opticalCase.id,
    quantity: "rays.trace",
    spec: {
      rays: encodeNdArray(Float64Array.of(0, 0, 1, 0.5, -0, 1), [2, 3]),
      line: 0,
      fieldsDeg: [0, 1.5, -0],
      label: "two rays",
      groups: { chiefIndex: 1, none: null, empty: {}, flags: [true, false] },
    },
    engineOptions: { fftRays: 512 },
  });
}
