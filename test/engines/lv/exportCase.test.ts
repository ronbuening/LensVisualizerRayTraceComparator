// The case exporter against prepared states built by hand: every branch of the translation, with no LensVisualizer.
import assert from "node:assert/strict";
import { test } from "node:test";

import packageJson from "../../../package.json" with { type: "json" };
import { caseInvariantProblems, verifyCaseIdentity } from "../../../src/contract/case.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import { validateKind } from "../../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { exportCase } from "../../../src/engines/lv/exportCase.ts";
import type { ExportCaseInput, ExportCaseResult, LvExportApi } from "../../../src/engines/lv/exportCase.ts";
import { EXPORT_PROBLEM_CODES } from "../../../src/engines/lv/exportProblems.ts";
import type { LvPreparedState } from "../../../src/engines/lv/types.ts";
import {
  FLAT,
  LENS,
  LINES_NM,
  LV_PROVENANCE,
  PHOTOPIC,
  TRIPLET,
  gate,
  inputFor,
  lvEvaluateAperture,
  resolvedIndex,
  stateOf,
} from "./exportSupport.ts";
import type { StateSpec, SurfaceSpec } from "./exportSupport.ts";

function tripletState(spec: Partial<StateSpec> = {}, surfaces: readonly SurfaceSpec[] = TRIPLET): LvPreparedState {
  return stateOf(surfaces, { stopIndex: 2, ...spec });
}

function exported(result: ExportCaseResult): OpticalCase {
  assert.ok(result.ok, JSON.stringify(result));
  return result.opticalCase;
}

function codesOf(result: ExportCaseResult): string[] {
  assert.ok(!result.ok, "expected problems");
  return result.problems.map((problem) => problem.code);
}

/** The triplet exported under a run's options. */
function tripletCase(options: ExportCaseInput["options"] = {}, overrides: Partial<LvExportApi> = {}): OpticalCase {
  return exported(exportCase(inputFor(tripletState(), options, overrides)));
}

// ── A whole case ─────────────────────────────────────────────────────────────────────────────────────────────────

test("a hand-built state becomes a valid case: every member is the state's, and nothing is invented", () => {
  const opticalCase = tripletCase();
  assert.deepEqual(validateKind("optical-case", opticalCase), []);
  assert.deepEqual(caseInvariantProblems(opticalCase.system, opticalCase.conditions), []);
  assert.deepEqual(verifyCaseIdentity(opticalCase), []);
  assert.ok(Object.isFrozen(opticalCase) && Object.isFrozen(opticalCase.system.surfaces[0].shape));

  assert.equal(opticalCase.contract, CONTRACT_VERSION);
  assert.deepEqual(opticalCase.label, { name: "Hand-built lens", lensKey: "hand-built", focusT: 0 });
  assert.deepEqual(opticalCase.system, {
    surfaces: [
      {
        label: "1",
        z: 0,
        thickness: 3,
        shape: { kind: "conic", radius: 40, conic: 0 },
        aperture: { semiDiameter: 9.000000001, nominalSemiDiameter: 9, innerSemiDiameter: 0 },
        elementId: 1,
      },
      {
        label: "2A",
        z: 3,
        thickness: 2,
        shape: {
          kind: "asphere",
          radius: -80,
          conic: -1,
          terms: [
            { power: 4, coeff: 1e-6 },
            { power: 8, coeff: -2e-10 },
          ],
        },
        aperture: { semiDiameter: 9.000000001, nominalSemiDiameter: 9, innerSemiDiameter: 0 },
        elementId: 0,
      },
      {
        label: "STO",
        z: 5,
        thickness: 2,
        shape: { kind: "plane" },
        aperture: { semiDiameter: 3.000000001, nominalSemiDiameter: 3, innerSemiDiameter: 0 },
        elementId: 0,
      },
      {
        label: "4A",
        z: 7,
        thickness: 3,
        shape: {
          kind: "asphere",
          radius: null,
          conic: 0,
          terms: [
            { power: 3, coeff: 2e-5 },
            { power: 4, coeff: 3e-6 },
          ],
        },
        aperture: { semiDiameter: 7.000000001, nominalSemiDiameter: 7, innerSemiDiameter: 0 },
        elementId: 4,
      },
      {
        label: "5",
        z: 10,
        thickness: 30,
        shape: { kind: "conic", radius: -60, conic: 0 },
        aperture: { semiDiameter: 7.000000001, nominalSemiDiameter: 7, innerSemiDiameter: 0 },
        elementId: 0,
      },
      {
        label: "RP1a",
        z: 40,
        thickness: 1.5,
        shape: { kind: "plane" },
        aperture: { semiDiameter: 12.000000001, nominalSemiDiameter: 12, innerSemiDiameter: 0 },
        elementId: 9,
        synthetic: "rearPlate",
      },
      {
        label: "RP1b",
        z: 41.5,
        thickness: 0.5,
        shape: { kind: "plane" },
        aperture: { semiDiameter: 12.000000001, nominalSemiDiameter: 12, innerSemiDiameter: 0 },
        elementId: 0,
        synthetic: "rearPlate",
      },
    ],
    stopIndex: 2,
    lastLensSurfaceIndex: 4,
    designImageZ: 42,
  });
  const { indexAfterSurface, ...conditions } = opticalCase.conditions;
  assert.deepEqual(conditions, {
    object: { kind: "infinity" },
    stopSemiDiameter: 3,
    imageZ: 42,
    lines: [{ wavelengthNm: LINES_NM.d, weight: 1, indexSource: "authored" }],
  });
  const table = decodeNdArray(indexAfterSurface);
  assert.deepEqual(table.shape, [1, 7]);
  assert.deepEqual([...table.values], [1.6, 1, 1, 1.7, 1, 1.5, 1]);
  assert.deepEqual(opticalCase.features, [
    "surface.asphere.even",
    "surface.asphere.flat-base",
    "surface.asphere.odd",
    "surface.conic",
  ]);
  assert.deepEqual(opticalCase.provenance, {
    source: {
      kind: "lv-lens",
      lensKey: LENS.key,
      file: LENS.file,
      fileSha256: LENS.fileSha256,
      zoomT: 0,
      focusT: 0,
    },
    lv: LV_PROVENANCE,
    producer: { tool: "lvrtc", version: packageJson.version },
  });
});

test("equal states give equal cases, and the identity ignores label and provenance", () => {
  const first = tripletCase();
  const again = tripletCase();
  assert.deepEqual(again, first);
  const elsewhere = exported(
    exportCase({
      ...inputFor(tripletState()),
      lens: { key: "renamed", name: "Renamed", file: "src/lens-data/x/Y.data.ts", fileSha256: "ef".repeat(32) },
      lv: { commit: null, dirty: null, closureHash: "01".repeat(32) },
    }),
  );
  assert.equal(elsewhere.id, first.id);
  assert.equal(elsewhere.systemId, first.systemId);
  assert.notDeepEqual(elsewhere.provenance, first.provenance);
});

test("the state asked of LensVisualizer is the run's: zoom as given, focus 0 for infinity", () => {
  const asked: [number, number][] = [];
  const state = tripletState({ runtime: { isZoom: true } });
  const recording: Partial<LvExportApi> = {
    prepareRuntimeState: (_runtime, focusT, zoomT) => {
      asked.push([focusT, zoomT]);
      return state;
    },
  };
  exportCase(inputFor(state, {}, recording));
  exportCase(inputFor(state, { state: { zoomT: 0.75 } }, recording));
  exportCase(inputFor(state, { state: { zoomT: 1, focus: { kind: "infinity" } } }, recording));
  exportCase(inputFor(state, { state: { focus: { kind: "focusT", value: 0.4 } } }, recording));
  assert.deepEqual(asked, [
    [0, 0],
    [0, 0.75],
    [0, 1],
    [0.4, 0],
  ]);
});

test("a prime has no zoom position: whatever the run states, LensVisualizer is asked for zoom 0", () => {
  const asked: [number, number][] = [];
  const state = tripletState();
  const recording: Partial<LvExportApi> = {
    prepareRuntimeState: (_runtime, focusT, zoomT) => {
      asked.push([focusT, zoomT]);
      return state;
    },
  };
  const plain = exported(exportCase(inputFor(state, {}, recording)));
  const positioned = exported(exportCase(inputFor(state, { state: { zoomT: 0.5 } }, recording)));
  exportCase(inputFor(state, { state: { zoomT: 1, focus: { kind: "focusT", value: 0.4 } } }, recording));
  assert.deepEqual(asked, [
    [0, 0],
    [0, 0],
    [0.4, 0],
  ]);
  // So a position given to a prime changes nothing: the same case, with the same provenance.
  assert.deepEqual(positioned, plain);
});

test("the label states the zoom position of a zoom lens only, and the focus position always", () => {
  const prime = exported(exportCase(inputFor(tripletState({ zoomT: 0.5 }))));
  assert.deepEqual(prime.label, { name: "Hand-built lens", lensKey: "hand-built", focusT: 0 });
  const zoom = tripletState({ zoomT: 0.5, runtime: { isZoom: true } });
  assert.deepEqual(exported(exportCase(inputFor(zoom))).label, {
    name: "Hand-built lens",
    lensKey: "hand-built",
    zoomT: 0.5,
    focusT: 0,
  });
});

// ── Gaps and the image plane ─────────────────────────────────────────────────────────────────────────────────────

test("the last thickness is LensVisualizer's last gap wherever that reaches the image plane, bit for bit", () => {
  // 0.1 + 0.2 is not 0.3: a gap recomputed as imgZ - z would differ from the state's own in the last bit.
  const surfaces: SurfaceSpec[] = [
    { label: "STO", R: FLAT, d: 0.1, sd: 3 },
    { label: "2", R: 50, d: 0.2 },
  ];
  const state = stateOf(surfaces, { stopIndex: 0 });
  assert.equal(state.imgZ, 0.1 + 0.2);
  assert.notEqual(state.imgZ - state.z[1], 0.2);
  const { system } = exported(exportCase(inputFor(state)));
  assert.equal(system.surfaces[1].thickness, 0.2);
  assert.equal(system.designImageZ, 0.1 + 0.2);
});

test("where the image plane is not one last gap behind the last vertex, the last thickness is the distance to it", () => {
  const state = tripletState({ imgZ: 45 });
  const { system, conditions } = exported(exportCase(inputFor(state)));
  assert.equal(system.surfaces[6].thickness, 45 - 41.5);
  assert.equal(system.designImageZ, 45);
  assert.equal(conditions.imageZ, 45);
});

test("the image plane is the design plane, or the design plane moved by the run's shift", () => {
  assert.equal(tripletCase({ imagePlane: { kind: "design" } }).conditions.imageZ, 42);
  assert.equal(tripletCase({ imagePlane: { kind: "shift", mm: -0.125 } }).conditions.imageZ, 41.875);
  const shifted = tripletCase({ imagePlane: { kind: "shift", mm: 0.5 } });
  assert.equal(shifted.conditions.imageZ, 42.5);
  assert.equal(shifted.system.designImageZ, 42);
  // A shift moves the image plane of the conditions and nothing of the system.
  assert.equal(shifted.systemId, tripletCase().systemId);
  assert.notEqual(shifted.id, tripletCase().id);
});

test("an image plane stated as a position is that position, whatever the design plane is", () => {
  const placed = tripletCase({ imagePlane: { kind: "at", z: 41.3 } });
  assert.equal(placed.conditions.imageZ, 41.3);
  assert.equal(placed.system.designImageZ, 42);
  assert.equal(placed.systemId, tripletCase().systemId);
  // A shift does not always add up to the same double again; the position is the number itself.
  const shifted = tripletCase({ imagePlane: { kind: "shift", mm: 0.1 + 0.2 } });
  const again = tripletCase({ imagePlane: { kind: "at", z: shifted.conditions.imageZ } });
  assert.equal(again.id, shifted.id);
  assert.equal(tripletCase({ imagePlane: { kind: "at", z: 42 } }).id, tripletCase().id);
});

test("the provenance states the zoom and focus position of the state the case was read from", () => {
  const conjugate = { focusT: 0.4, zoomT: 0.75, objectDistanceMm: 800, distanceReference: "first-surface" };
  const state = tripletState({ zoomT: 0.75, focusT: 0.4 });
  const refocused = exported(exportCase(inputFor(state, {}, { assessMtfSupport: gate({ conjugate }) })));
  assert.deepEqual(refocused.provenance.source, {
    kind: "lv-lens",
    lensKey: LENS.key,
    file: LENS.file,
    fileSha256: LENS.fileSha256,
    zoomT: 0.75,
    focusT: 0.4,
  });
  // The label states the zoom position of a zoom lens only; the provenance always does.
  assert.deepEqual(refocused.label, { name: "Hand-built lens", lensKey: "hand-built", focusT: 0.4 });
});

test("LensVisualizer's best axial focus is a problem here, with the stage that resolves it", () => {
  const result = exportCase(inputFor(tripletState(), { imagePlane: { kind: "lv-best-axial" } }));
  assert.ok(!result.ok);
  assert.equal(result.problems.length, 1);
  assert.equal(result.problems[0].code, "lv-best-axial-needs-mtf-recipe");
  assert.match(result.problems[0].message, /MTF recipe \(Stage 3\.2\)/);
});

// ── The stop ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("the stop surface carries the run's stop radius, and the other surfaces keep their own", () => {
  const wideOpen = tripletCase();
  for (const [aperture, radius] of [
    [{ kind: "f-number", value: 8 }, (3 * 2) / 8],
    [{ kind: "f-number", value: 2 }, (3 * 2) / 2],
    [{ kind: "stop-radius", mm: 1.25 }, 1.25],
    [{ kind: "stop-radius", mm: 4 }, 4],
  ] as const) {
    const stopped = tripletCase({ aperture });
    assert.equal(stopped.conditions.stopSemiDiameter, radius);
    assert.deepEqual(stopped.system.surfaces[2].aperture, {
      semiDiameter: radius + 1e-9,
      nominalSemiDiameter: radius,
      innerSemiDiameter: 0,
    });
    stopped.system.surfaces.forEach((surface, index) => {
      if (index !== 2) assert.deepEqual(surface.aperture, wideOpen.system.surfaces[index].aperture);
    });
  }
  // Another stop setting is another stop surface, so another system.
  assert.notEqual(tripletCase({ aperture: { kind: "f-number", value: 8 } }).systemId, wideOpen.systemId);
});

test("the stop is the surface LensVisualizer names, whatever its label, also the first surface and the last", () => {
  // No surface is labelled STO: the stop is read from the state, never looked for by name.
  const surfaces: SurfaceSpec[] = [
    { label: "1", R: FLAT, d: 2, sd: 3 },
    { label: "2", R: 40, d: 3, nd: 1.6, sd: 9 },
    { label: "3", R: -60, d: 30, sd: 7 },
  ];
  for (const [stopIndex, wideOpen] of [
    [0, 3],
    [2, 7],
  ] as const) {
    const state = stateOf(surfaces, { stopIndex });
    const { system, conditions } = exported(exportCase(inputFor(state, { aperture: { kind: "f-number", value: 4 } })));
    assert.equal(system.stopIndex, stopIndex);
    // The stand-in's widest f-number is 2, so f/4 halves the wide-open radius of the stop surface.
    assert.equal(conditions.stopSemiDiameter, wideOpen / 2);
    assert.deepEqual(
      system.surfaces.map((surface) => surface.aperture.nominalSemiDiameter),
      [3, 9, 7].map((sd, index) => (index === stopIndex ? wideOpen / 2 : sd)),
    );
    assert.equal(system.lastLensSurfaceIndex, 2);
  }
});

test("an f-number faster than wide open is a problem of the run", () => {
  const result = exportCase(inputFor(tripletState(), { aperture: { kind: "f-number", value: 1.4 } }));
  assert.deepEqual(codesOf(result), ["aperture-faster-than-wide-open"]);
});

test("a wide-open radius that is not the prepared stop surface's is thrown, naming the lens", () => {
  const input = inputFor(tripletState(), {}, { wideOpenStopAtZoom: () => 3.5 });
  assert.throws(() => exportCase(input), {
    message: "lens hand-built: LensVisualizer's wide-open stop radius 3.5 is not the prepared stop surface's 3",
  });
});

test("the clip radius is asked of LensVisualizer for every surface, with the stop radius on the stop surface only", () => {
  const overrides: (number | undefined)[] = [];
  const recording: Partial<LvExportApi> = {
    evaluateAperture: (state, surface, radius, stopSemiDiameter) => {
      if (radius === 0) overrides[surface.physicalIndex] = stopSemiDiameter;
      return lvEvaluateAperture(state, surface, radius, stopSemiDiameter);
    },
  };
  tripletCase({ aperture: { kind: "stop-radius", mm: 2 } }, recording);
  assert.deepEqual(overrides, [undefined, undefined, 2, undefined, undefined, undefined, undefined]);
});

test("an annular aperture is exported with its inner semi-diameter and the flag", () => {
  const surfaces = TRIPLET.map((surface, index) => (index === 4 ? { ...surface, innerSd: 2.5 } : surface));
  const opticalCase = exported(exportCase(inputFor(tripletState({}, surfaces))));
  assert.equal(opticalCase.system.surfaces[4].aperture.innerSemiDiameter, 2.5);
  assert.ok(opticalCase.features.includes("aperture.annular"));
});

// ── Lines, object and notes ──────────────────────────────────────────────────────────────────────────────────────

test("photopic lines give a case of five lines, with the table one row per line", () => {
  const opticalCase = tripletCase({ lines: { kind: "photopic" } });
  assert.equal(opticalCase.conditions.lines.length, 5);
  assert.ok(opticalCase.features.includes("lines.multiple"));
  const table = decodeNdArray(opticalCase.conditions.indexAfterSurface);
  assert.deepEqual(table.shape, [5, 7]);
  PHOTOPIC.forEach((line, row) => {
    assert.deepEqual(
      [...table.values.subarray(row * 7, row * 7 + 7)],
      [1.6, 1, 1, 1.7, 1, 1.5, 1].map((nd) => resolvedIndex(nd, line.wavelengthNm)),
    );
  });
  // Lines change the conditions only.
  assert.equal(opticalCase.systemId, tripletCase().systemId);
});

test("a certified finite conjugate gives a finite object, and the flag", () => {
  const conjugate = { focusT: 0.5, zoomT: 0, objectDistanceMm: 480, distanceReference: "first-surface" };
  const state = tripletState({ focusT: 0.5 });
  const opticalCase = exported(exportCase(inputFor(state, {}, { assessMtfSupport: gate({ conjugate }) })));
  assert.deepEqual(opticalCase.conditions.object, { kind: "finite", z: -480 });
  assert.equal(opticalCase.label.focusT, 0.5);
  assert.ok(opticalCase.features.includes("object.finite"));
  assert.deepEqual(codesOf(exportCase(inputFor(state))), ["finite-conjugate-unavailable"]);
});

test("what changes no surface is a provenance note: bulk absorption and a projection that is not rectilinear", () => {
  const absorbing = tripletState({ runtime: { elements: [{ id: 1 }, { id: 4, absorptionCoefficientPerMm: 0.55 }] } });
  assert.deepEqual(exported(exportCase(inputFor(absorbing))).provenance.notes, ["bulk-absorption"]);
  const clear = tripletState({ runtime: { elements: [{ id: 1, absorptionCoefficientPerMm: 0 }] } });
  assert.equal(exported(exportCase(inputFor(clear))).provenance.notes, undefined);

  const fisheye = tripletState({
    projection: "fisheye-equisolid",
    runtime: { elements: [{ id: 4, absorptionCoefficientPerMm: 0.1 }] },
  });
  const unsupported = { assessMtfSupport: gate({ reason: "unsupported-path" }) };
  const opticalCase = exported(exportCase(inputFor(fisheye, {}, unsupported)));
  assert.deepEqual(opticalCase.provenance.notes, ["bulk-absorption", "projection:fisheye-equisolid"]);
  // A note is not part of the identity, and the surfaces are those of the same lens without it.
  assert.equal(opticalCase.id, tripletCase().id);
});

// ── What the contract cannot express ─────────────────────────────────────────────────────────────────────────────

test("each thing the contract cannot express is a problem with its code, and no case", () => {
  const withSurface = (index: number, change: Partial<SurfaceSpec>): LvPreparedState =>
    tripletState(
      {},
      TRIPLET.map((surface, at) => (at === index ? { ...surface, ...change } : surface)),
    );
  const cases: [LvPreparedState, string, RegExp][] = [
    [tripletState({ folded: true }), "folded-path", /optical path is folded/],
    [withSurface(4, { interaction: "reflect" }), "non-refract-interaction", /reflect or block.*: 5$/],
    [withSurface(0, { interaction: "block" }), "non-refract-interaction", /: 1$/],
    [withSurface(1, { diffractive: { kind: "radial-polynomial" } }), "diffractive-surface", /diffractive phase: 2A$/],
    [tripletState({ normal: [0, 0.6, 0.8] }), "tilted-image-plane", /not perpendicular/],
    [tripletState({ normal: [1e-9, 0, 1] }), "tilted-image-plane", /not perpendicular/],
    [tripletState({ normal: [0, 0, -1] }), "tilted-image-plane", /not perpendicular/],
    [tripletState({ imagePoint: [0, 12] }), "off-axis-image-plane", /not centred/],
    [withSurface(6, { synthetic: "sensorStack" }), "synthetic-surface-unknown", /RP1b \(sensorStack\)$/],
    [withSurface(4, { kind: "tilted-plane" }), "surface-profile-unsupported", /surface 5 has/],
    [withSurface(1, { asphere: { K: 0, B4: 1 } }), "asphere-coefficient-unknown", /"B4"/],
  ];
  for (const [state, code, message] of cases) {
    const result = exportCase(inputFor(state));
    assert.ok(!result.ok, code);
    assert.deepEqual(codesOf(result), [code]);
    assert.match(result.problems[0].message, message);
    assert.ok((EXPORT_PROBLEM_CODES as readonly string[]).includes(code), code);
  }
  // An image-plane normal within LensVisualizer's own tolerance of +z is perpendicular.
  assert.equal(exportCase(inputFor(tripletState({ normal: [5e-11, -5e-11, 1] }))).ok, true);
});

test("every problem of a lens is reported together, and LensVisualizer's gate is not asked about a lens it rejects", () => {
  const surfaces = TRIPLET.map((surface, index) =>
    index === 4 ? { ...surface, interaction: "reflect", kind: "tilted-plane" } : surface,
  );
  const state = tripletState({ folded: true, normal: [0, 1, 0], imagePoint: [0, 20] }, surfaces);
  const never: Partial<LvExportApi> = {
    assessMtfSupport: () => assert.fail("the gate was asked about a lens the contract cannot express"),
  };
  const options = { aperture: { kind: "f-number", value: 1 }, imagePlane: { kind: "lv-best-axial" } } as const;
  assert.deepEqual(codesOf(exportCase(inputFor(state, options, never))), [
    "folded-path",
    "non-refract-interaction",
    "tilted-image-plane",
    "off-axis-image-plane",
    "surface-profile-unsupported",
    "aperture-faster-than-wide-open",
    "lv-best-axial-needs-mtf-recipe",
  ]);
});

test("a problem of the run and a problem of the light are reported together", () => {
  const options = { aperture: { kind: "f-number", value: 1 }, lines: { kind: "photopic" } } as const;
  const refused = { assessMtfSupport: gate({ reason: "spectral-data-unavailable" }) };
  assert.deepEqual(codesOf(exportCase(inputFor(tripletState(), options, refused))), [
    "aperture-faster-than-wide-open",
    "spectral-data-unavailable",
  ]);
});

test("a state LensVisualizer cannot prepare is a problem with its reason", () => {
  const failing: Partial<LvExportApi> = {
    prepareRuntimeState: () => {
      throw new Error("Resolved thickness for surface 3 must be finite and non-negative");
    },
  };
  const result = exportCase(inputFor(tripletState({ runtime: { isZoom: true } }), { state: { zoomT: 0.5 } }, failing));
  assert.deepEqual(result, {
    ok: false,
    problems: [
      {
        code: "state-prepare-failed",
        message:
          "LensVisualizer cannot prepare focus 0, zoom 0.5: " +
          "Resolved thickness for surface 3 must be finite and non-negative",
      },
    ],
  });
});

// ── Defects are thrown, with the lens ────────────────────────────────────────────────────────────────────────────

test("a draft that is not a valid case is the exporter's defect: thrown, naming the lens", () => {
  // The last lens surface is not the last surface that is not a rear plate.
  const misplaced = tripletState({ runtime: { lastLensSurfaceIdx: 5 } });
  assert.throws(
    () => exportCase(inputFor(misplaced)),
    /^Error: lens hand-built: contract: not a valid optical-case: system\.lastLensSurfaceIndex is 5, which is not/,
  );
  // A negative gap, which only a folded system has, is refused by the schema.
  const backwards = stateOf(
    [
      { label: "STO", R: FLAT, d: 5, sd: 3 },
      { label: "2", R: 50, d: -2 },
    ],
    { stopIndex: 0 },
  );
  assert.throws(() => exportCase(inputFor(backwards)), /^Error: lens hand-built: contract: not a valid optical-case: /);
  // An index that is not a positive finite number.
  const noIndex = stateOf([{ label: "STO", R: FLAT, d: 5, sd: 3, nd: Number.NaN }], { stopIndex: 0 });
  assert.throws(() => exportCase(inputFor(noIndex)), /^Error: lens hand-built: .*not a positive finite number/);
});

test("the error of a defect keeps its cause", () => {
  const input = inputFor(tripletState(), {}, { wideOpenStopAtZoom: () => -1 });
  try {
    exportCase(input);
    assert.fail("expected a throw");
  } catch (error) {
    assert.ok(error instanceof Error && error.cause instanceof Error);
    assert.equal(error.message, `lens hand-built: ${error.cause.message}`);
  }
});
