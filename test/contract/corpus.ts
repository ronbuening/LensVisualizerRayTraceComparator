// The fixture corpus of contract/fixtures/v1, as typed TypeScript.
//
// Every valid fixture is written here against the TypeScript type of its kind (`satisfies`, or the return type of
// the function that builds it), and corpus.test.ts requires the JSON files to equal these values. So a type and
// its schema cannot drift apart silently: a value the type allows and the schema rejects fails the corpus test,
// and a fixture the schema allows and the type rejects fails the type check. Every invalid fixture is one valid
// value with one fault, together with where the validator must report it.
//
// After changing anything here, rewrite the files with `node test/contract/writeCorpus.ts`.
import { fileURLToPath } from "node:url";

import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { finalizeCase } from "../../src/contract/case.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import type { OpticalCaseDraft } from "../../src/contract/case.ts";
import type { ComparisonSet } from "../../src/contract/comparison.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { FEATURE_FLAGS } from "../../src/contract/features.ts";
import type { Policy } from "../../src/contract/policy.ts";
import type { ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../src/contract/quantities/mtfNative.ts";
import { PARAXIAL_FIRST_ORDER } from "../../src/contract/quantities/paraxialFirstOrder.ts";
import type {
  ParaxialFirstOrderData,
  ParaxialFirstOrderSpec,
} from "../../src/contract/quantities/paraxialFirstOrder.ts";
import { RAYS_TRACE } from "../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../src/contract/quantities/raysTrace.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../../src/contract/quantities/selftestEcho.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../../src/contract/quantities/systemDescribe.ts";
import type { SystemDescribeData, SystemDescribeSpec } from "../../src/contract/quantities/systemDescribe.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import type { RunSpec, Suite } from "../../src/contract/runSpec.ts";
import type { ContractKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";

/**
 * The corpus directory: `valid/<schema>/<name>.json`, `invalid/<schema>/<name>.json` and `<name>.expect.json`,
 * where `<schema>` is a kind, or `quantities/<quantity>.<part>` for a quantity's spec or data.
 */
export const FIXTURE_DIR: string = fileURLToPath(new URL("../../contract/fixtures/v1", import.meta.url));

const OVERFLOW_MARKER = "@@overflow@@";

/**
 * The exact text of a fixture file that holds `value`. An infinity is written `1e400`: a literal that is JSON by
 * its grammar, is too large for a float64, and so reads back as the same infinity in ECMAScript and in Python.
 * That is how a fixture file holds a non-finite number, which `JSON.stringify` would write as `null`.
 */
export function fixtureText(value: unknown): string {
  const json = JSON.stringify(value, (_key, member: unknown) => (member === Infinity ? OVERFLOW_MARKER : member), 2);
  return `${json.replaceAll(`"${OVERFLOW_MARKER}"`, "1e400")}\n`;
}

const PRODUCER = { tool: "lvrtc", version: "0.1.0" } as const;

/** The path of a valid optical-case fixture, as a RunSpec names it. */
function caseFixturePath(name: string): string {
  return `contract/fixtures/v1/valid/optical-case/${name}.json`;
}

// ── optical-case ─────────────────────────────────────────────────────────────────────────────────────────────────

/** The smallest sensible case: a biconvex singlet with the stop on its first surface, one line, no feature. */
export const SINGLET_DRAFT = {
  label: { name: "Biconvex singlet" },
  system: {
    surfaces: [
      {
        label: "1",
        z: 0,
        thickness: 4,
        shape: { kind: "conic", radius: 50, conic: 0 },
        aperture: { semiDiameter: 10, nominalSemiDiameter: 10, innerSemiDiameter: 0 },
        elementId: 1,
      },
      {
        label: "2",
        z: 4,
        thickness: 96,
        shape: { kind: "conic", radius: -50, conic: 0 },
        aperture: { semiDiameter: 10, nominalSemiDiameter: 10, innerSemiDiameter: 0 },
        elementId: 0,
      },
    ],
    stopIndex: 0,
    lastLensSurfaceIndex: 1,
    designImageZ: 100,
  },
  conditions: {
    object: { kind: "infinity" },
    stopSemiDiameter: 5,
    imageZ: 100,
    lines: [{ wavelengthNm: 587.5618, weight: 1, indexSource: "authored" }],
    indexAfterSurface: encodeNdArray(Float64Array.of(1.5168, 1), [1, 2]),
  },
  provenance: { source: { kind: "fixture", name: "singlet" }, producer: PRODUCER },
} satisfies OpticalCaseDraft;

/** A case that carries every feature flag and every optional field. It is a format example, not a real lens. */
export const ALL_FEATURES_DRAFT = {
  label: { name: "Every feature", lensKey: "example-zoom", zoomT: 0.5, focusT: 0.25 },
  system: {
    surfaces: [
      {
        label: "1",
        z: 0,
        thickness: 3,
        shape: {
          kind: "asphere",
          radius: 40,
          conic: -0.8,
          terms: [
            { power: 4, coeff: 1.2e-6 },
            { power: 6, coeff: -3.4e-9 },
          ],
        },
        aperture: { semiDiameter: 12, nominalSemiDiameter: 12.5, innerSemiDiameter: 0 },
        elementId: 1,
      },
      {
        label: "2",
        z: 3,
        thickness: 5,
        shape: { kind: "conic", radius: -120, conic: 0 },
        aperture: { semiDiameter: 12, nominalSemiDiameter: 12, innerSemiDiameter: 0 },
        elementId: 0,
      },
      {
        label: "STO",
        z: 8,
        thickness: 4,
        shape: { kind: "plane" },
        aperture: { semiDiameter: 6, nominalSemiDiameter: 6, innerSemiDiameter: 0 },
        elementId: 0,
      },
      {
        label: "4",
        z: 12,
        thickness: 2.5,
        shape: {
          kind: "asphere",
          radius: null,
          conic: 0,
          terms: [
            { power: 3, coeff: 2e-5 },
            { power: 4, coeff: -1e-6 },
          ],
        },
        aperture: { semiDiameter: 9, nominalSemiDiameter: 9, innerSemiDiameter: 2 },
        elementId: 2,
      },
      {
        label: "5",
        z: 14.5,
        thickness: 30,
        shape: { kind: "conic", radius: -35, conic: 0 },
        aperture: { semiDiameter: 9, nominalSemiDiameter: 9, innerSemiDiameter: 0 },
        elementId: 0,
      },
      {
        label: "RP1a",
        z: 44.5,
        thickness: 1,
        shape: { kind: "plane" },
        aperture: { semiDiameter: 15, nominalSemiDiameter: 15, innerSemiDiameter: 0 },
        elementId: 3,
        synthetic: "rearPlate",
      },
      {
        label: "RP1b",
        z: 45.5,
        thickness: 2,
        shape: { kind: "plane" },
        aperture: { semiDiameter: 15, nominalSemiDiameter: 15, innerSemiDiameter: 0 },
        elementId: 0,
        synthetic: "rearPlate",
      },
    ],
    stopIndex: 2,
    lastLensSurfaceIndex: 4,
    designImageZ: 47.5,
  },
  conditions: {
    object: { kind: "finite", z: -500 },
    stopSemiDiameter: 4.5,
    imageZ: 47.625,
    lines: [
      { wavelengthNm: 587.5618, weight: 0.75, indexSource: "authored" },
      { wavelengthNm: 486.1327, weight: 0.25, indexSource: "anchored" },
    ],
    indexAfterSurface: encodeNdArray(
      Float64Array.of(1.58913, 1, 1, 1.8061, 1, 1.5168, 1, 1.59581, 1, 1, 1.82224, 1, 1.52238, 1),
      [2, 7],
    ),
  },
  provenance: {
    source: {
      kind: "lv-lens",
      lensKey: "example-zoom",
      file: "src/lens-data/example/ExampleZoom.data.ts",
      fileSha256: sha256Hex("example lens file"),
      zoomT: 0.5,
      focusT: 0.25,
    },
    lv: { commit: "0123456789abcdef0123456789abcdef01234567", dirty: false, closureHash: sha256Hex("example closure") },
    notes: ["bulk-absorption", "projection:fisheye-equisolid"],
    producer: PRODUCER,
  },
} satisfies OpticalCaseDraft;

/** The singlet as a finished case; it is the case the example requests, results and messages are about. */
export const SINGLET_CASE = finalizeCase(SINGLET_DRAFT);
/** The every-feature draft as a finished case. */
export const ALL_FEATURES_CASE = finalizeCase(ALL_FEATURES_DRAFT);

// ── run-spec and suite ───────────────────────────────────────────────────────────────────────────────────────────

/** Only what a RunSpec must have. */
export const RUN_SPEC_MINIMAL = {
  contract: CONTRACT_VERSION,
  kind: "run-spec",
  name: "singlet",
  lens: { kind: "fixture", path: caseFixturePath("singlet") },
} satisfies RunSpec;

/** The worked example of contract/CONTRACT.md: the Double-Gauss fixture, wide open, on its reference line. */
export const RUN_SPEC_WORKED = {
  contract: CONTRACT_VERSION,
  kind: "run-spec",
  name: "double-gauss-f5",
  lens: { kind: "fixture", path: caseFixturePath("double-gauss") },
  aperture: { kind: "wide-open" },
  lines: { kind: "reference" },
  fields: { kind: "angles-deg", values: [0, 10, 14] },
  imagePlane: { kind: "design" },
  frequenciesPerMm: [10, 20, 40],
  sampling: { lvGridCap: 64, bundleGrid: 33, engines: { optiland: { numRays: 512 } } },
  rungs: ["r0", "r1", "r2", "r3", "r4"],
  engines: ["ref", "optiland"],
  referenceEngine: "ref",
} satisfies RunSpec;

/** A LensVisualizer lens with the other alternative of every option. */
export const RUN_SPEC_LV = {
  contract: CONTRACT_VERSION,
  kind: "run-spec",
  name: "nikon-z-24-70f4s-tele-f8",
  lens: { kind: "lv", key: "nikon-z-24-70f4s" },
  state: { zoomT: 1, focus: { kind: "focusT", value: 0.5 } },
  aperture: { kind: "f-number", value: 8 },
  lines: { kind: "explicit", wavelengthsNm: [656.2725, 587.5618, 486.1327], weights: [1, 2, 1] },
  fields: { kind: "image-height-fractions", values: [0, 0.7, 1] },
  imagePlane: { kind: "shift", mm: -0.02 },
  frequenciesPerMm: [30],
  sampling: { lvGridCap: 256 },
  rungs: ["r5"],
  engines: ["lv", "optiland"],
  referenceEngine: "lv",
} satisfies RunSpec;

/**
 * A LensVisualizer lens as its MTF tab compares it at f/8, at LensVisualizer's own best axial focus: the two
 * options only a LensVisualizer lens has.
 */
export const RUN_SPEC_LV_MTF = {
  contract: CONTRACT_VERSION,
  kind: "run-spec",
  name: "nikkor-z50f12-f8-best-photopic",
  lens: { kind: "lv", key: "nikkor-z50f12" },
  aperture: { kind: "lv-f8-comparison" },
  lines: { kind: "photopic" },
  imagePlane: { kind: "lv-best-axial" },
  rungs: ["r4f"],
} satisfies RunSpec;

/** The worked example of contract/CONTRACT.md: shared defaults, and runs that replace some of them. */
export const SUITE_WORKED = {
  contract: CONTRACT_VERSION,
  kind: "suite",
  name: "contract-example",
  defaults: {
    aperture: { kind: "wide-open" },
    lines: { kind: "reference" },
    fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
    imagePlane: { kind: "lv-best-axial" },
    frequenciesPerMm: [10, 30],
    sampling: { lvGridCap: 64, bundleGrid: 33 },
    rungs: ["r0", "r1", "r2", "r3", "r4"],
    engines: ["lv", "ref", "optiland"],
    referenceEngine: "lv",
  },
  runs: [
    { name: "nikon-z-24-70f4s-wide", lens: { kind: "lv", key: "nikon-z-24-70f4s" }, state: { zoomT: 0 } },
    {
      name: "nikon-z-24-70f4s-tele",
      lens: { kind: "lv", key: "nikon-z-24-70f4s" },
      state: { zoomT: 1 },
      frequenciesPerMm: [10, 30, 50],
      sampling: { lvGridCap: 128 },
    },
    {
      name: "double-gauss",
      lens: { kind: "fixture", path: caseFixturePath("double-gauss") },
      fields: { kind: "angles-deg", values: [0, 10, 14] },
      imagePlane: { kind: "design" },
      engines: ["ref", "optiland"],
      referenceEngine: "ref",
    },
  ],
} satisfies Suite;

/** No defaults, and one run that states its own contract and kind. */
export const SUITE_MINIMAL = {
  contract: CONTRACT_VERSION,
  kind: "suite",
  name: "one-run",
  runs: [
    {
      contract: CONTRACT_VERSION,
      kind: "run-spec",
      name: "singlet",
      lens: { kind: "fixture", path: caseFixturePath("singlet") },
    },
  ],
} satisfies Suite;

// ── rays.trace ───────────────────────────────────────────────────────────────────────────────────────────────────
//
// `valid/quantities/rays.trace.data/singlet-axis-and-rim.json` is the answer to the spec of the same name about
// `valid/optical-case/singlet.json`, exact in every number: the ray along the axis is bent by nothing, and the ray
// 12 mm off the axis meets the first surface outside its clip radius of 10 mm, where it ends.

const SINGLET_GLASS = 1.5168;
const NAN3 = [NaN, NaN, NaN] as const;
/** A unit direction toward +z and -y: the 3-4-5 triangle. */
const DOWNWARD = [0, -0.6, 0.8] as const;

/** Two rays for the singlet, parallel to the axis from 10 mm in front of it: one on the axis, one past the rim. */
export const RAYS_SPEC_SINGLET = {
  line: 0,
  origins: encodeNdArray(Float64Array.of(0, 0, -10, 0, 12, -10), [2, 3]),
  directions: encodeNdArray(Float64Array.of(0, 0, 1, 0, 0, 1), [2, 3]),
  weights: encodeNdArray(Float64Array.of(1, 1)),
} satisfies RaysTraceSpec;

/** The trace of those two rays: the first lands on the axis, the second is blocked at surface 0. */
export const RAYS_DATA_SINGLET = {
  status: encodeNdArray(Uint8Array.of(0, 1)),
  endSurface: encodeNdArray(Int32Array.of(-1, 0)),
  hits: encodeNdArray(Float64Array.of(0, 0, 0, ...NAN3, 0, 0, 4, ...NAN3), [2, 2, 3]),
  exitPoint: encodeNdArray(Float64Array.of(0, 0, 4, ...NAN3), [2, 3]),
  exitDirection: encodeNdArray(Float64Array.of(0, 0, 1, ...NAN3), [2, 3]),
  imagePoint: encodeNdArray(Float64Array.of(0, 0, 100, ...NAN3), [2, 3]),
  // 10 mm of air and 4 mm of glass to the last surface, then 96 mm of air to the image plane.
  opticalPath: encodeNdArray(Float64Array.of(10 + SINGLET_GLASS * 4, NaN)),
  opticalPathToImage: encodeNdArray(Float64Array.of(10 + SINGLET_GLASS * 4 + 96, NaN)),
} satisfies RaysTraceData;

/**
 * A format example of a spec with everything a spec can state: a lattice of two by two cells from a field off the
 * axis, with its chief ray after it at weight 0, at the second line of a case. The direction is (0, -0.6, 0.8).
 */
export const RAYS_SPEC_LATTICE = {
  line: 1,
  origins: encodeNdArray(Float64Array.of(-2, 5.5, -10, 2, 5.5, -10, -2, 9.5, -10, 2, 9.5, -10, 0, 7.5, -10), [5, 3]),
  directions: encodeNdArray(Float64Array.of(...DOWNWARD, ...DOWNWARD, ...DOWNWARD, ...DOWNWARD, ...DOWNWARD), [5, 3]),
  weights: encodeNdArray(Float64Array.of(1, 1, 0.96875, 0.96875, 0)),
  groups: {
    field: { angleDeg: 36.86989764584402, heightFraction: 0.5 },
    lattice: { columns: 2, rows: 2, step: 4 },
    chiefIndex: 4,
  },
} satisfies RaysTraceSpec;

/**
 * A format example of every way a ray ends, through two surfaces, with the image plane at z = 8.25: ray 0 lands;
 * ray 1 is blocked at surface 1; ray 2 could not be traced to surface 0; ray 3 passes both surfaces so far out
 * that it leaves the last one behind the image plane, which it therefore cannot reach: its end surface is 2, and
 * it keeps its exit. The numbers describe no lens.
 */
export const RAYS_DATA_STATUSES = {
  status: encodeNdArray(Uint8Array.of(0, 1, 2, 1)),
  endSurface: encodeNdArray(Int32Array.of(-1, 1, 0, 2)),
  hits: encodeNdArray(
    Float64Array.of(1, 2, 0.5, 3, 4, 0.75, ...NAN3, -3, -6, 1.5, 0.5, 1, 4.25, ...NAN3, ...NAN3, -3, -6, 9),
    [2, 4, 3],
  ),
  exitPoint: encodeNdArray(Float64Array.of(0.5, 1, 4.25, ...NAN3, ...NAN3, -3, -6, 9), [4, 3]),
  exitDirection: encodeNdArray(Float64Array.of(...DOWNWARD, ...NAN3, ...NAN3, 0, 0.6, 0.8), [4, 3]),
  imagePoint: encodeNdArray(Float64Array.of(0.5, -2, 8.25, ...NAN3, ...NAN3, ...NAN3), [4, 3]),
  opticalPath: encodeNdArray(Float64Array.of(16.5, NaN, NaN, 16.75)),
  opticalPathToImage: encodeNdArray(Float64Array.of(21.5, NaN, NaN, NaN)),
} satisfies RaysTraceData;

// ── mtf.native ───────────────────────────────────────────────────────────────────────────────────────────────────
//
// Format examples of an engine's own MTF. The numbers describe no lens: every curve value is a dyadic fraction.

/** Three fields as fractions of the image height at 10 and 30 cycles/mm: geometric, on the plane of the case. */
export const MTF_SPEC_FRACTIONS = {
  frequenciesPerMm: [10, 30],
  fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
  method: "geometric",
  focus: "design",
} satisfies MtfNativeSpec;

/** Everything a spec can state: field angles, the engine's own best focus and a profile of the engine. */
export const MTF_SPEC_PROFILE = {
  frequenciesPerMm: [0, 10, 20, 40],
  fields: { kind: "angles-deg", values: [0, 10, 14] },
  method: "diffraction",
  focus: "engine-best",
  profile: "some-engine-default",
} satisfies MtfNativeSpec;

/**
 * An answer to `MTF_SPEC_FRACTIONS` with every status: the axis is ok, the half field has curves whose sampling did
 * not settle, and the full field lies outside what the engine models, so it has no curve and says why.
 */
export const MTF_DATA_FRACTIONS: MtfNativeData = {
  fields: [
    {
      field: 0,
      fieldAngleDeg: 0,
      imageHeightMm: 0,
      sagittal: encodeNdArray(Float64Array.of(0.875, 0.5)),
      tangential: encodeNdArray(Float64Array.of(0.875, 0.5)),
      status: "ok",
      sampling: { gridSize: 32, validRays: 812, blockedRays: 212, failedRays: 0 },
    },
    {
      field: 0.5,
      fieldAngleDeg: 12.5,
      imageHeightMm: 10.75,
      sagittal: encodeNdArray(Float64Array.of(0.75, 0.375)),
      tangential: encodeNdArray(Float64Array.of(0.6875, 0.25)),
      status: "unconverged",
      sampling: { gridSize: 128, validRays: 11584, blockedRays: 4800, failedRays: 0, maxDelta: 0.03125 },
    },
    {
      field: 1,
      fieldAngleDeg: null,
      imageHeightMm: null,
      sagittal: encodeNdArray(Float64Array.of(NaN, NaN)),
      tangential: encodeNdArray(Float64Array.of(NaN, NaN)),
      status: "unavailable",
      reason: "outside-modeled-field",
      sampling: {},
    },
  ],
  method: { name: "ray-sum", params: { gridCap: 128 } },
  focus: { mode: "design", appliedShiftMm: 0 },
  aperture: {},
  lines: [{ wavelengthNm: 587.5618, weight: 1 }],
  notes: [],
};

/**
 * An answer to `MTF_SPEC_PROFILE`: three fields at four frequencies on the engine's own best focus, 1/32 mm in
 * front of the image plane of the case, on three lines, with what the engine recorded of its aperture.
 */
export const MTF_DATA_BEST_FOCUS: MtfNativeData = {
  fields: [0, 10, 14].map((field, index) => ({
    field,
    fieldAngleDeg: field,
    imageHeightMm: 1.75 * field,
    sagittal: encodeNdArray(Float64Array.of(1, 0.875 - index / 16, 0.75 - index / 16, 0.5 - index / 16)),
    tangential: encodeNdArray(Float64Array.of(1, 0.875 - index / 8, 0.75 - index / 8, 0.5 - index / 8)),
    status: "ok",
    sampling: { gridSize: 64 },
  })),
  method: {
    name: "pupil-autocorrelation",
    params: { profile: "some-engine-default", spectrum: "three-line", displayedFrequenciesPerMm: [10, 40] },
  },
  focus: { mode: "best-axial", appliedShiftMm: -0.03125 },
  aperture: { tracedFNumber: 2.0625, limitingSurfaceIndex: 3 },
  lines: [
    { wavelengthNm: 550, weight: 1 },
    { wavelengthNm: 480, weight: 0.25 },
    { wavelengthNm: 620, weight: 0.5 },
  ],
  notes: ["The dispersion of one glass is estimated."],
};

// ── request and result ───────────────────────────────────────────────────────────────────────────────────────────
//
// A request and a result carry a spec and data as they are: their schemas belong to the quantity, which has
// fixtures of its own further down.

/** The smallest request: an empty spec and no engine options. */
export const REQUEST_MINIMAL = makeRequest({ caseId: SINGLET_CASE.id, quantity: "system.describe", spec: {} });

/** A spec that carries arrays, and options for the engine the request goes to. */
export const REQUEST_WITH_OPTIONS = makeRequest({
  caseId: SINGLET_CASE.id,
  quantity: RAYS_TRACE,
  spec: RAYS_SPEC_SINGLET,
  engineOptions: { tolerance: 1e-12 },
});

const FAKE_ENGINE = {
  id: "fake",
  fingerprint: sha256Hex("fake engine sources"),
  details: { version: "0.1.0", threads: 1, jit: false, build: null },
} as const;

/** An engine's data for `REQUEST_WITH_OPTIONS`, with the method that produced it. */
export const RESULT_OK = {
  contract: CONTRACT_VERSION,
  kind: "result",
  requestId: REQUEST_WITH_OPTIONS.id,
  caseId: SINGLET_CASE.id,
  engine: FAKE_ENGINE,
  status: "ok",
  method: { name: "sequential-trace", params: { tolerance: 1e-12 } },
  data: RAYS_DATA_SINGLET,
  diagnostics: { warnings: [], counts: { rays: 2, ok: 1, blocked: 1, failed: 0 } },
} satisfies ResultEnvelope;

/** An answer of an engine that is part of the comparator: it states the adapter revision of its descriptor. */
export const RESULT_BUILTIN = {
  ...RESULT_OK,
  engine: { ...FAKE_ENGINE, id: "builtin", adapterRevision: sha256Hex("the comparator's code behind the engine") },
} satisfies ResultEnvelope;

/** A refusal that names a case feature and an option the engine does not have. */
export const RESULT_UNSUPPORTED = {
  contract: CONTRACT_VERSION,
  kind: "result",
  requestId: REQUEST_WITH_OPTIONS.id,
  caseId: ALL_FEATURES_CASE.id,
  engine: FAKE_ENGINE,
  status: "unsupported",
  unsupported: [
    { code: "feature", item: "surface.asphere.odd", message: "odd asphere terms are not implemented" },
    { code: "option", item: "tolerance", message: "the intersection tolerance is fixed" },
  ],
  diagnostics: { warnings: [], counts: {} },
} satisfies ResultEnvelope;

/** A refusal by an engine that answers only about cases of its own source: this case came from a fixture. */
export const RESULT_UNSUPPORTED_SOURCE = {
  contract: CONTRACT_VERSION,
  kind: "result",
  requestId: REQUEST_MINIMAL.id,
  caseId: SINGLET_CASE.id,
  engine: FAKE_ENGINE,
  status: "unsupported",
  unsupported: [
    { code: "case-source", item: "fixture", message: "the engine answers only about cases of its own lenses" },
  ],
  diagnostics: { warnings: [], counts: {} },
} satisfies ResultEnvelope;

/** A run the engine attempted and failed, with a warning and a count. */
export const RESULT_ERROR = {
  contract: CONTRACT_VERSION,
  kind: "result",
  requestId: REQUEST_MINIMAL.id,
  caseId: SINGLET_CASE.id,
  engine: FAKE_ENGINE,
  status: "error",
  error: { code: "engine-failure", message: "the trace raised: division by zero" },
  diagnostics: { warnings: ["retried once"], counts: { attempts: 2 } },
} satisfies ResultEnvelope;

/** A job handed to an engine a person operates; only what every result must have. */
export const RESULT_PENDING = {
  contract: CONTRACT_VERSION,
  kind: "result",
  requestId: REQUEST_MINIMAL.id,
  caseId: SINGLET_CASE.id,
  engine: { id: "bench", fingerprint: "operator-run 2", details: {} },
  status: "pending",
  diagnostics: { warnings: [], counts: {} },
} satisfies ResultEnvelope;

// ── engine-descriptor ────────────────────────────────────────────────────────────────────────────────────────────

/** An engine that can do nothing: every list and map is empty. */
export const DESCRIPTOR_MINIMAL = {
  contract: { min: "1.0", max: "1.0" },
  identity: { id: "fake", version: "0.1.0", fingerprint: FAKE_ENGINE.fingerprint, details: {} },
  capabilities: {
    features: { supported: [], limits: {} },
    quantities: {},
    deterministic: true,
    maxConcurrency: 1,
  },
} satisfies EngineDescriptor;

/** An engine that supports every feature flag, states limits, an adapter revision and answers two quantities. */
export const DESCRIPTOR_FULL = {
  contract: { min: "1.0", max: "1.2" },
  identity: {
    id: "example-engine",
    version: "2.4.1+build.20260101",
    fingerprint: sha256Hex("example engine sources"),
    adapterRevision: sha256Hex("example adapter sources"),
    details: { python: "3.14.0", numpy: "2.3.0", jit: true, gpu: null },
  },
  capabilities: {
    features: { supported: [...FEATURE_FLAGS], limits: { "asphere.maxPower": 20, "surfaces.count": 200 } },
    quantities: { "system.describe": { version: 1 }, "rays.trace": { version: 2 } },
    deterministic: false,
    maxConcurrency: 4,
  },
} satisfies EngineDescriptor;

// ── protocol ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** The three messages of one session, in order: hello, a run that carries its whole case, shutdown. */
export const PROTOCOL_HELLO = {
  contract: CONTRACT_VERSION,
  id: "1",
  method: "hello",
  params: {},
} satisfies ProtocolRequest;

/** See `PROTOCOL_HELLO`. */
export const PROTOCOL_RUN = {
  contract: CONTRACT_VERSION,
  id: "2",
  method: "run",
  params: { request: REQUEST_WITH_OPTIONS, case: SINGLET_CASE },
} satisfies ProtocolRequest;

/** See `PROTOCOL_HELLO`. */
export const PROTOCOL_SHUTDOWN = {
  contract: CONTRACT_VERSION,
  id: "3",
  method: "shutdown",
  params: {},
} satisfies ProtocolRequest;

/** The replies to those messages, by `id`: a descriptor, a result, an empty object. */
export const RESPONSE_HELLO = {
  contract: CONTRACT_VERSION,
  id: "1",
  ok: true,
  result: DESCRIPTOR_FULL,
} satisfies ProtocolResponse;

/** See `RESPONSE_HELLO`. */
export const RESPONSE_RUN = {
  contract: CONTRACT_VERSION,
  id: "2",
  ok: true,
  result: RESULT_OK,
} satisfies ProtocolResponse;

/** See `RESPONSE_HELLO`. */
export const RESPONSE_SHUTDOWN = {
  contract: CONTRACT_VERSION,
  id: "3",
  ok: true,
  result: {},
} satisfies ProtocolResponse;

/** The reply to a message the engine could not handle at all. */
export const RESPONSE_FAILURE = {
  contract: CONTRACT_VERSION,
  id: "2",
  ok: false,
  error: { code: "bad-request", message: "params.case is not an optical-case" },
} satisfies ProtocolResponse;

// ── policy and comparison ────────────────────────────────────────────────────────────────────────────────────────

/** A policy of one rung: `selftest`, direct and gated, as the comparator's own policy judges it. */
export const POLICY_SELFTEST = {
  contract: CONTRACT_VERSION,
  kind: "policy",
  version: 1,
  rungs: {
    selftest: {
      quantity: SELFTEST_ECHO,
      mode: "direct",
      class: "gated",
      metrics: {
        "sum.abs": { tolerance: 1e-12, unit: "1" },
        "values.maxAbs": { tolerance: 1e-12, unit: "1" },
      },
    },
  },
} satisfies Policy;

/** The floor limits of a length between traced rays, mm, as the ladder has them: a fresh object for each metric. */
const floorMm = () => ({ limit: 1e-7, agreement: 1e-10 });
/** The floor limits of a component of a ray's exit direction, as the ladder has them: ten times its gate. */
const floorDirection = () => ({ limit: 1e-8, agreement: 1e-12 });
/** The floor limits of an optical path, waves, as the ladder has them. */
const floorWaves = () => ({ limit: 2e-4, agreement: 1e-7 });

/**
 * The comparator's own policy, as `policy/rungs.v1.json` holds it: `selftest`, the built-system echo `r0`, which
 * blocks the rungs after it, the first-order data `r1`, the two rungs of traced rays, `r2` and `r3`, with the
 * floor of `lv` against `ref`, the geometric MTF of those rays, `r4`, the fidelity of the replay of
 * LensVisualizer's MTF sampling, `r4f`, the engines' own MTF side by side, `r5`, and their own geometric MTF,
 * `r5g`, which are recorded, the wave MTF
 * of the traced rays, `r6a`, and LensVisualizer's own diffraction MTF beside the comparator's wave estimator,
 * `r6b`, which is recorded.
 */
export const POLICY_LADDER = {
  contract: CONTRACT_VERSION,
  kind: "policy",
  version: 10,
  rungs: {
    selftest: POLICY_SELFTEST.rungs.selftest,
    r0: {
      quantity: SYSTEM_DESCRIBE,
      mode: "direct",
      class: "gated",
      metrics: {
        "aperture.mismatches": { tolerance: 0, unit: "elements" },
        "index.mismatches": { tolerance: 0, unit: "elements" },
        "layout.mismatches": { tolerance: 0, unit: "elements" },
        "sag.maxScaled": { tolerance: 1e-12, unit: "1" },
        "shape.mismatches": { tolerance: 0, unit: "elements" },
      },
      blocksLaterRungs: true,
    },
    r1: {
      quantity: PARAXIAL_FIRST_ORDER,
      mode: "direct",
      class: "gated",
      metrics: {
        "firstOrder.maxAbs": { tolerance: 1e-9, unit: "mm" },
        "pupilRadius.maxScaled": { tolerance: 1e-9, unit: "mm" },
        "pupilZ.maxScaled": { tolerance: 1e-9, unit: "mm" },
      },
    },
    r2: {
      quantity: RAYS_TRACE,
      mode: "identical-rays",
      class: "gated",
      metrics: {
        "direction.maxAbs": { tolerance: 1e-9, unit: "1", floor: floorDirection() },
        "hits.maxDistance": { tolerance: 1e-8, unit: "mm", floor: floorMm() },
        "landing.maxDistance": { tolerance: 1e-8, unit: "mm", floor: floorMm() },
        "mask.mismatches": { tolerance: 0, unit: "rays" },
      },
      floor: { engine: "lv", arbiter: "ref" },
    },
    r3: {
      quantity: RAYS_TRACE,
      mode: "identical-rays",
      class: "gated",
      metrics: {
        "opd.maxAbs": { tolerance: 2e-5, unit: "waves", floor: floorWaves() },
        "opticalPath.maxAbs": { tolerance: 2e-5, unit: "waves", floor: floorWaves() },
        "opticalPathToImage.maxAbs": { tolerance: 2e-5, unit: "waves", floor: floorWaves() },
      },
      floor: { engine: "lv", arbiter: "ref" },
    },
    r4: {
      quantity: RAYS_TRACE,
      mode: "identical-rays",
      class: "gated",
      metrics: { "mtf.maxAbs": { tolerance: 1e-7, unit: "1" } },
    },
    r4f: {
      quantity: MTF_NATIVE,
      mode: "direct",
      class: "gated",
      metrics: {
        "fields.mismatches": { tolerance: 0, unit: "elements" },
        "mtf.maxAbs": { tolerance: 1e-9, unit: "1" },
        "sampling.mismatches": { tolerance: 0, unit: "elements" },
      },
    },
    r5: {
      quantity: MTF_NATIVE,
      mode: "independent-method",
      class: "recorded",
      metrics: {
        "chiefLanding.maxAbs": { attention: 1e-7, unit: "mm" },
        "mtfOffAxis.maxAbs": { attention: 0.01, unit: "1" },
        "mtfOnAxis.maxAbs": { attention: 0.005, unit: "1" },
      },
    },
    r5g: {
      quantity: MTF_NATIVE,
      mode: "independent-method",
      class: "recorded",
      metrics: {
        "chiefLanding.maxAbs": { attention: 1e-3, unit: "mm" },
        "mtfOffAxis.maxAbs": { attention: 0.01, unit: "1" },
        "mtfOnAxis.maxAbs": { attention: 0.005, unit: "1" },
      },
    },
    r6a: {
      quantity: RAYS_TRACE,
      mode: "identical-rays",
      class: "gated",
      metrics: { "waveMtf.maxAbs": { tolerance: 4e-5, unit: "1" } },
    },
    r6b: {
      quantity: MTF_NATIVE,
      mode: "independent-method",
      class: "recorded",
      metrics: {
        "mtfOffAxis.maxAbs": { attention: 0.01, unit: "1" },
        "mtfOnAxis.maxAbs": { attention: 0.005, unit: "1" },
      },
    },
  },
} satisfies Policy;

/**
 * A policy with a rung of every mode and both classes. It is a format example: its rungs are none of the
 * comparator's, though two of them bear the id of one.
 */
export const POLICY_EVERY_MODE = {
  contract: CONTRACT_VERSION,
  kind: "policy",
  version: 7,
  rungs: {
    r1: {
      quantity: "paraxial.first-order",
      mode: "direct",
      class: "gated",
      metrics: { "efl.abs": { tolerance: 1e-9, unit: "mm" }, "pupil.z.abs": { tolerance: 1e-9, unit: "mm" } },
    },
    r2: {
      quantity: "rays.trace",
      mode: "identical-rays",
      class: "gated",
      metrics: {
        "hits.maxDistance": { tolerance: 1e-8, unit: "mm" },
        "clip.mismatches": { tolerance: 0, unit: "rays" },
      },
    },
    r5: {
      quantity: "mtf.native",
      mode: "independent-method",
      class: "recorded",
      metrics: { "mtf.maxAbs": { attention: 0.005, unit: "1" }, "mtf.rms": { unit: "1" } },
    },
    notes: { quantity: "system.describe", mode: "direct", class: "recorded", metrics: {} },
  },
} satisfies Policy;

const COMPARISON_BASE = {
  contract: CONTRACT_VERSION,
  kind: "comparison",
  suite: "contract-example",
  run: "singlet",
  caseId: SINGLET_CASE.id,
  rung: "selftest",
  quantity: SELFTEST_ECHO,
  requestId: REQUEST_MINIMAL.id,
} as const;

/** Three engines against a reference: one agrees within the tolerance, one cannot answer. */
export const COMPARISON_REFERENCE = {
  ...COMPARISON_BASE,
  participants: [
    { engine: "fake-a", fingerprint: sha256Hex("fake-a sources"), status: "ok" },
    { engine: "fake-b", fingerprint: "operator-run 2", status: "ok" },
    { engine: "fake-none", fingerprint: sha256Hex("fake-none sources"), status: "unsupported" },
  ],
  mode: "reference-vs-each",
  reference: "fake-a",
  pairs: [
    {
      a: "fake-a",
      b: "fake-b",
      metrics: [
        { name: "values.maxAbs", value: 2.5e-14, unit: "1", where: { index: 2 } },
        { name: "sum.abs", value: 0, unit: "1" },
      ],
      class: "gated",
      verdict: "PASS",
    },
    {
      a: "fake-a",
      b: "fake-none",
      metrics: [],
      class: "gated",
      verdict: "UNSUPPORTED",
      reason: "fake-none is unsupported (quantity selftest.echo)",
    },
  ],
} satisfies ComparisonSet;

/** Every pair of four participants, with every other verdict: a metric that is not finite, and an engine that failed. */
export const COMPARISON_PAIRWISE = {
  ...COMPARISON_BASE,
  rung: "r5",
  quantity: "mtf.native",
  participants: [
    { engine: "broken", fingerprint: null, status: "error" },
    { engine: "lv", fingerprint: sha256Hex("lv sources"), status: "ok" },
    { engine: "optiland", fingerprint: sha256Hex("optiland sources"), status: "ok" },
    { engine: "ref", fingerprint: sha256Hex("ref sources"), status: "ok" },
  ],
  mode: "pairwise",
  pairs: [
    {
      a: "broken",
      b: "lv",
      metrics: [],
      class: "recorded",
      verdict: "ERROR",
      reason: "broken ended as error (load-failed)",
    },
    {
      a: "broken",
      b: "optiland",
      metrics: [],
      class: "recorded",
      verdict: "ERROR",
      reason: "broken ended as error (load-failed)",
    },
    {
      a: "broken",
      b: "ref",
      metrics: [],
      class: "recorded",
      verdict: "ERROR",
      reason: "broken ended as error (load-failed)",
    },
    {
      a: "lv",
      b: "optiland",
      metrics: [{ name: "mtf.maxAbs", value: 0.0125, unit: "1", where: { field: "14 deg", frequencyPerMm: 40 } }],
      class: "recorded",
      verdict: "ATTENTION",
      reason: "mtf.maxAbs 1.25e-2 is outside its attention band 5.00e-3 at field 14 deg, frequencyPerMm 40",
    },
    {
      a: "lv",
      b: "ref",
      metrics: [{ name: "mtf.maxAbs", value: 0.0004, unit: "1", where: { field: "0 deg", frequencyPerMm: 10 } }],
      class: "recorded",
      verdict: "RECORDED",
    },
    {
      a: "optiland",
      b: "ref",
      metrics: [{ name: "mtf.maxAbs", value: null, unit: "1", where: { index: 5 } }],
      class: "gated",
      verdict: "FAIL",
      reason: "mtf.maxAbs is NaN at index 5",
    },
  ],
} satisfies ComparisonSet;

/**
 * A rung behind one that failed: the pair is not judged, and says which rung blocks it. Each engine's answer is
 * listed with the values it only records: one that both report, one of a single engine, one that is not finite.
 */
export const COMPARISON_BLOCKED = {
  ...COMPARISON_BASE,
  rung: "r1",
  quantity: PARAXIAL_FIRST_ORDER,
  participants: [
    {
      engine: "lv",
      fingerprint: sha256Hex("lv sources"),
      status: "ok",
      recorded: { epZRelStop: [-12.5, null], magnification: [-0.25, -0.2501] },
    },
    { engine: "ref", fingerprint: sha256Hex("ref sources"), status: "ok", recorded: { magnification: [-0.25, -0.25] } },
  ],
  mode: "reference-vs-each",
  reference: "ref",
  pairs: [
    {
      a: "ref",
      b: "lv",
      metrics: [],
      class: "gated",
      verdict: "BLOCKED",
      reason: "not judged: rung r0 failed for lv and ref on this case",
    },
  ],
} satisfies ComparisonSet;

/**
 * A pair above a tolerance that is the floor of one of its engines: the verdict is `FLOOR`, and the reason gives
 * what exceeded and the figures against the arbiter. A metric that was not measured is not among the metrics.
 */
export const COMPARISON_FLOOR: ComparisonSet = {
  ...COMPARISON_BASE,
  rung: "r2",
  quantity: RAYS_TRACE,
  participants: [
    {
      engine: "lv",
      fingerprint: sha256Hex("lv sources"),
      status: "ok",
      recorded: { "rays.blocked": [3], "rays.failed": [0], "rays.ok": [5] },
    },
    {
      engine: "ref",
      fingerprint: sha256Hex("ref sources"),
      status: "ok",
      recorded: { "rays.blocked": [3], "rays.failed": [0], "rays.ok": [5] },
    },
  ],
  mode: "pairwise",
  pairs: [
    {
      a: "lv",
      b: "ref",
      metrics: [
        { name: "hits.maxDistance", value: 2.5e-9, unit: "mm", where: { field: 54, line: 0, ray: 4, surface: 6 } },
        { name: "direction.maxAbs", value: 2e-10, unit: "1", where: { field: 54, line: 0, ray: 4 } },
        { name: "landing.maxDistance", value: 1.25e-8, unit: "mm", where: { field: 54, line: 0, ray: 4 } },
        { name: "mask.mismatches", value: 0, unit: "rays" },
        { name: "mask.rimBand", value: 1, unit: "rays", where: { field: 54, line: 0, ray: 7, surface: 2 } },
        { name: "rays.compared", value: 5, unit: "rays" },
      ],
      class: "gated",
      verdict: "FLOOR",
      reason:
        "landing.maxDistance 1.25e-8 exceeds its tolerance 1.00e-8 at field 54, line 0, ray 4; floor of lv: " +
        "lv against ref direction.maxAbs 2.00e-10 within 1.00e-8, lv against ref hits.maxDistance 2.50e-9 within " +
        "1.00e-7, lv against ref landing.maxDistance 1.25e-8 within 1.00e-7",
    },
  ],
};

// ── system.describe and paraxial.first-order ─────────────────────────────────────────────────────────────────────
//
// The examples below are of the singlet case, worked out here from the textbook formulas of a single lens and not
// by any engine, so that an engine can be held to them: `valid/quantities/system.describe.data/singlet.json` is the
// answer to the spec `three-fractions.json` about `valid/optical-case/singlet.json`, to rounding, and
// `valid/quantities/paraxial.first-order.data/singlet.json` is the answer to the empty spec about the same case.

const [SINGLET_FRONT, SINGLET_REAR] = SINGLET_DRAFT.system.surfaces;
const SINGLET_INDEX = 1.5168;
const SINGLET_STOP = SINGLET_DRAFT.conditions.stopSemiDiameter;

/** The sag of a sphere of radius `radius` at the height `r`: r^2 / (R + sqrt(R^2 - r^2)), with the sign of R. */
function sphereSag(radius: number, r: number): number {
  const magnitude = Math.abs(radius);
  return (Math.sign(radius) * (r * r)) / (magnitude + Math.sqrt(magnitude * magnitude - r * r));
}

/** A spec with three fractions, and the default one written out. */
export const DESCRIBE_SPEC_THREE = { sagFractions: [0, 0.5, 1] } satisfies SystemDescribeSpec;

/** The singlet as an engine that built it describes it: two spheres of 50 mm, the sag at 0, 5 and 10 mm. */
export const DESCRIBE_DATA_SINGLET = {
  surfaceCount: 2,
  stopIndex: 0,
  imageZ: 100,
  stopSemiDiameter: SINGLET_STOP,
  vertexZ: encodeNdArray(Float64Array.of(0, 4)),
  curvature: encodeNdArray(Float64Array.of(1 / 50, 1 / -50)),
  conic: encodeNdArray(Float64Array.of(0, 0)),
  clipRadius: encodeNdArray(Float64Array.of(10, 10)),
  innerClipRadius: encodeNdArray(Float64Array.of(0, 0)),
  indexAfterSurface: encodeNdArray(Float64Array.of(SINGLET_INDEX, 1), [1, 2]),
  sagRadii: encodeNdArray(Float64Array.of(0, 5, 10, 0, 5, 10), [2, 3]),
  sag: encodeNdArray(
    Float64Array.of(0, sphereSag(50, 5), sphereSag(50, 10), 0, sphereSag(-50, 5), sphereSag(-50, 10)),
    [2, 3],
  ),
  terms: [[], []],
} satisfies SystemDescribeData;

/**
 * A format example with everything the singlet lacks: two lines, a paraboloid with two terms and a central
 * obstruction of 1.5 mm, and a sphere of radius -6 whose nominal semi-diameter of 8 reaches past its equator, where
 * it has no sag: a NaN.
 */
export const DESCRIBE_DATA_ASPHERE = {
  surfaceCount: 2,
  stopIndex: 1,
  imageZ: 31.5,
  stopSemiDiameter: 2.25,
  vertexZ: encodeNdArray(Float64Array.of(0, 3)),
  curvature: encodeNdArray(Float64Array.of(0.025, 1 / -6)),
  conic: encodeNdArray(Float64Array.of(-1, 0)),
  clipRadius: encodeNdArray(Float64Array.of(12.000000001, 2.250000001)),
  innerClipRadius: encodeNdArray(Float64Array.of(1.5, 0)),
  indexAfterSurface: encodeNdArray(Float64Array.of(1.5168, 1, 1.5224, 1), [2, 2]),
  sagRadii: encodeNdArray(Float64Array.of(6, 12, 4, 8), [2, 2]),
  // A paraboloid's sag is c r^2 / 2; the terms add 1e-6 r^4 - 2e-9 r^6.
  sag: encodeNdArray(
    Float64Array.of(
      0.0125 * 36 + 1e-6 * 6 ** 4 - 2e-9 * 6 ** 6,
      0.0125 * 144 + 1e-6 * 12 ** 4 - 2e-9 * 12 ** 6,
      sphereSag(-6, 4),
      NaN,
    ),
    [2, 2],
  ),
  terms: [
    [
      { power: 4, coeff: 1e-6 },
      { power: 6, coeff: -2e-9 },
    ],
    [],
  ],
} satisfies SystemDescribeData;

/**
 * The first-order data of the singlet by the formulas of a thick lens in air. With the surface powers
 * P1 = (n - 1) / R1 and P2 = (1 - n) / R2 and the thickness t, the power is P = P1 + P2 - P1 P2 t / n and the
 * focal length f = 1 / P. The rear principal point lies f P1 t / n in front of the rear vertex and the front one
 * f P2 t / n behind the front vertex; each focal point is f from its principal point. The stop is on the front
 * surface, so the entrance pupil is the stop itself. The exit pupil is the image of the stop through the rear
 * surface: an object t in front of it, in glass, with n / (-t) + P2 = 1 / l' and the magnification n l' / (-t).
 */
function singletFirstOrder(): Record<keyof Omit<ParaxialFirstOrderData, "recorded">, number> {
  const t = SINGLET_FRONT.thickness;
  const front = (SINGLET_INDEX - 1) / SINGLET_FRONT.shape.radius;
  const rear = (1 - SINGLET_INDEX) / SINGLET_REAR.shape.radius;
  const efl = 1 / (front + rear - (front * rear * t) / SINGLET_INDEX);
  const rearPrincipalZ = SINGLET_REAR.z - (efl * front * t) / SINGLET_INDEX;
  const frontPrincipalZ = SINGLET_FRONT.z + (efl * rear * t) / SINGLET_INDEX;
  const pupilDistance = 1 / (rear - SINGLET_INDEX / t);
  return {
    efl,
    frontFocalZ: frontPrincipalZ - efl,
    rearFocalZ: rearPrincipalZ + efl,
    frontPrincipalZ,
    rearPrincipalZ,
    backFocus: rearPrincipalZ + efl - SINGLET_REAR.z,
    entrancePupilZ: SINGLET_FRONT.z,
    exitPupilZ: SINGLET_REAR.z + pupilDistance,
    entrancePupilSemiDiameter: SINGLET_STOP,
    exitPupilSemiDiameter: SINGLET_STOP * Math.abs((SINGLET_INDEX * pupilDistance) / -t),
  };
}

/** One value per line, as the quantity carries it. */
function perLine(...values: number[]): ReturnType<typeof encodeNdArray> {
  return encodeNdArray(Float64Array.from(values));
}

/** The singlet's first-order data, at its one line; an object at infinity records nothing. */
export const FIRST_ORDER_DATA_SINGLET = {
  ...(Object.fromEntries(Object.entries(singletFirstOrder()).map(([name, value]) => [name, perLine(value)])) as Omit<
    ParaxialFirstOrderData,
    "recorded"
  >),
  recorded: {},
} satisfies ParaxialFirstOrderData;

/**
 * A format example: two lines, a finite object, whose magnification is recorded beside a value of the engine's
 * own, and an exit pupil at infinity at the second line.
 */
export const FIRST_ORDER_DATA_TWO_LINES = {
  efl: perLine(50.25, 50.5),
  frontFocalZ: perLine(-48.5, -48.75),
  rearFocalZ: perLine(57.25, 57.5),
  frontPrincipalZ: perLine(1.75, 1.75),
  rearPrincipalZ: perLine(7, 7),
  backFocus: perLine(47.25, 47.5),
  entrancePupilZ: perLine(3.5, 3.5),
  exitPupilZ: perLine(-120, Infinity),
  entrancePupilSemiDiameter: perLine(6.25, 6.25),
  exitPupilSemiDiameter: perLine(18.5, Infinity),
  recorded: { epZRelStop: perLine(-4.5, -4.5), magnification: perLine(-0.25, -0.2515) },
} satisfies ParaxialFirstOrderData;

/** The spec of `paraxial.first-order`: there is nothing to choose. */
export const FIRST_ORDER_SPEC = {} satisfies ParaxialFirstOrderSpec;

// ── selftest.echo ────────────────────────────────────────────────────────────────────────────────────────────────

/** A float64 array given by the bits of each element, for the values a number literal cannot state. */
export function f8FromBits(...bits: bigint[]): Float64Array {
  return new Float64Array(new BigUint64Array(bits).buffer);
}

/** A `selftest.echo` spec, and the data that every conforming engine answers it with, bit for bit. */
export interface EchoExample {
  readonly spec: SelftestEchoSpec;
  readonly data: SelftestEchoData;
}

function echoExample(
  shape: readonly number[],
  values: Float64Array,
  scale: number,
  echoed: Float64Array,
  sum: number | null,
): EchoExample {
  return {
    spec: { values: encodeNdArray(values, shape), scale },
    data: { values: encodeNdArray(echoed, shape), sum },
  };
}

const QUIET_NAN = 0x7ff8_0000_0000_0000n;
const NAN_WITH_PAYLOAD = 0x7ff8_0000_dead_beefn;
/** Every value a plain JSON number cannot carry, and the ones arithmetic is tempted to change. */
const SPECIAL_VALUES = f8FromBits(
  NAN_WITH_PAYLOAD,
  0x7ff0_0000_0000_0001n, // a signalling NaN, which arithmetic would quiet
  0xfff8_0000_0000_0123n, // a NaN with its sign bit set
  0x8000_0000_0000_0000n, // -0
  0x7ff0_0000_0000_0000n, // +infinity
  0xfff0_0000_0000_0000n, // -infinity
  0x0000_0000_0000_0001n, // the smallest subnormal
  0x000f_ffff_ffff_ffffn, // the largest subnormal
  0x7fef_ffff_ffff_ffffn, // the largest finite number
  0x3ff8_0000_0000_0000n, // 1.5
);

/**
 * The conformance examples of `selftest.echo`, by fixture name: `valid/quantities/selftest.echo.spec/<name>.json`
 * holds the spec and `valid/quantities/selftest.echo.data/<name>.json` the answer. The answers are written out
 * here, not computed, so that an engine is tested against the contract and not against another engine.
 */
export const SELFTEST_ECHO_EXAMPLES: Readonly<Record<string, EchoExample>> = {
  // Scale 1 sends every element back unchanged, NaN payloads included. A NaN among them leaves no finite sum.
  "special-values": echoExample([10], SPECIAL_VALUES, 1, SPECIAL_VALUES, null),
  // Every product and every partial sum is exact, and -0 times a negative number is +0.
  matrix: echoExample(
    [2, 3],
    Float64Array.of(1.5, -2, 0.25, 4, -0, 0.125),
    -2.5,
    Float64Array.of(-3.75, 5, -0.625, -10, 0, -0.3125),
    -9.6875,
  ),
  // A running sum loses the first 1 to rounding and gives 1. A compensated sum gives 2: Python's math.fsum does,
  // and from Python 3.12 on its built-in sum does too.
  "sum-is-not-compensated": echoExample(
    [4],
    Float64Array.of(1e16, 1, -1e16, 1),
    1,
    Float64Array.of(1e16, 1, -1e16, 1),
    1,
  ),
  // An infinity times 0 has no value and is written as the quiet NaN without payload; a NaN that came in is kept.
  "zero-scale": echoExample(
    [5],
    f8FromBits(
      0x7ff0_0000_0000_0000n,
      0xfff0_0000_0000_0000n,
      0x3ff0_0000_0000_0000n,
      0xbff0_0000_0000_0000n,
      NAN_WITH_PAYLOAD,
    ),
    0,
    f8FromBits(QUIET_NAN, QUIET_NAN, 0x0000_0000_0000_0000n, 0x8000_0000_0000_0000n, NAN_WITH_PAYLOAD),
    null,
  ),
  // A product too large for a float64 is an infinity, and an infinite sum is null.
  overflow: echoExample([2], Float64Array.of(Number.MAX_VALUE, 1), 2, Float64Array.of(Infinity, 2), null),
  // No elements: the shape is kept and the sum is the 0 it starts from.
  empty: echoExample([0, 3], new Float64Array(0), 2, new Float64Array(0), 0),
  // A shape without axes is one element.
  scalar: echoExample([], Float64Array.of(3), 2, Float64Array.of(6), 6),
};

// ── The corpus ───────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * The value of `valid/engine-descriptor/integers-as-floats.json`, whose text writes every integer here with a
 * fraction of zero or an exponent (`4.0`, `1.0`, `2e0`): an integer is a number without a fraction, however it was
 * written, and Python reads those spellings as floats.
 */
export const DESCRIPTOR_INTEGERS_AS_FLOATS = {
  ...DESCRIPTOR_MINIMAL,
  capabilities: {
    ...DESCRIPTOR_MINIMAL.capabilities,
    quantities: { "system.describe": { version: 1 }, "rays.trace": { version: 2 } },
    maxConcurrency: 4,
  },
} satisfies EngineDescriptor;

/**
 * Valid fixtures whose files are not written from here, by kind: the Double-Gauss case, derived from optiland's
 * sample, and a descriptor whose point is how its file spells numbers, which `JSON.stringify` cannot reproduce.
 */
export const EXTERNAL_VALID: Readonly<Partial<Record<ContractKind, readonly string[]>>> = {
  "optical-case": ["double-gauss"],
  "engine-descriptor": ["integers-as-floats"],
};

// ── baseline ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** The baseline of a suite of one run on `selftest`: two fake engines that agree. */
export const BASELINE_SELFTEST: Baseline = {
  contract: CONTRACT_VERSION,
  kind: "baseline",
  suite: { name: "example", hash: sha256Hex("example suite") },
  policy: { version: 1, hash: sha256Hex("example policy") },
  engines: [
    { id: "fake-a", version: "1", fingerprint: sha256Hex("fake-a sources"), details: { bias: 0 } },
    { id: "fake-near", version: "1", fingerprint: sha256Hex("fake-near sources"), details: { bias: 2e-14 } },
  ],
  runs: [
    {
      name: "singlet",
      caseId: sha256Hex("singlet case"),
      rungs: [
        {
          rung: "selftest",
          quantity: SELFTEST_ECHO,
          requests: 1,
          support: [
            { engine: "fake-a", status: "ok" },
            { engine: "fake-near", status: "ok" },
          ],
          pairs: [
            {
              a: "fake-a",
              b: "fake-near",
              verdict: "PASS",
              verdicts: [{ verdict: "PASS", count: 1 }],
              metrics: [
                { name: "values.maxAbs", unit: "1", value: 2e-14, where: { index: 3 }, tolerance: 1e-12 },
                { name: "sum.abs", unit: "1", value: 1.25e-13, tolerance: 1e-12 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * The baseline of a suite of traced rays on three engines: two requests of `r2`, one of them a floor of `lv`; an
 * engine with an adapter revision; ray counts; and a rung one engine does not support.
 */
export const BASELINE_RAYS: Baseline = {
  contract: CONTRACT_VERSION,
  kind: "baseline",
  suite: { name: "rays", hash: sha256Hex("rays suite") },
  policy: { version: 5, hash: sha256Hex("ladder policy") },
  engines: [
    {
      id: "lv",
      version: "0.0.0",
      fingerprint: sha256Hex("lv sources"),
      adapterRevision: sha256Hex("lv adapter"),
      details: { commit: "0123456789abcdef0123456789abcdef01234567", dirty: false },
    },
    { id: "other", version: "1.2", fingerprint: sha256Hex("other sources"), details: {} },
    {
      id: "ref",
      version: "1",
      fingerprint: sha256Hex("ref sources"),
      adapterRevision: sha256Hex("ref adapter"),
      details: { sourceFiles: 12 },
    },
  ],
  runs: [
    {
      name: "zoom-wide",
      caseId: sha256Hex("zoom at its wide end"),
      rungs: [
        {
          rung: "r1",
          quantity: PARAXIAL_FIRST_ORDER,
          requests: 1,
          support: [
            { engine: "lv", status: "ok" },
            { engine: "other", status: "unsupported", detail: "quantity paraxial.first-order" },
            { engine: "ref", status: "ok" },
          ],
          pairs: [
            {
              a: "lv",
              b: "other",
              verdict: "UNSUPPORTED",
              verdicts: [{ verdict: "UNSUPPORTED", count: 1 }],
              metrics: [],
            },
            {
              a: "lv",
              b: "ref",
              verdict: "PASS",
              verdicts: [{ verdict: "PASS", count: 1 }],
              metrics: [{ name: "firstOrder.maxAbs", unit: "mm", value: 2.5e-13, where: { line: 0 }, tolerance: 1e-9 }],
            },
            {
              a: "other",
              b: "ref",
              verdict: "UNSUPPORTED",
              verdicts: [{ verdict: "UNSUPPORTED", count: 1 }],
              metrics: [],
            },
          ],
        },
        {
          rung: "r2",
          quantity: RAYS_TRACE,
          requests: 2,
          support: [
            { engine: "lv", status: "ok" },
            { engine: "other", status: "ok" },
            { engine: "ref", status: "ok" },
          ],
          rays: [
            { engine: "lv", ok: 10, blocked: 6, failed: 0 },
            { engine: "other", ok: 10, blocked: 6, failed: 0 },
            { engine: "ref", ok: 10, blocked: 6, failed: 0 },
          ],
          pairs: [
            {
              a: "lv",
              b: "other",
              verdict: "FLOOR",
              verdicts: [
                { verdict: "PASS", count: 1 },
                { verdict: "FLOOR", count: 1 },
              ],
              metrics: [
                {
                  name: "landing.maxDistance",
                  unit: "mm",
                  value: 1.25e-8,
                  where: { field: 54, line: 0, ray: 4 },
                  tolerance: 1e-8,
                },
                { name: "mask.mismatches", unit: "rays", value: 0, tolerance: 0 },
                { name: "mask.rimBand", unit: "rays", value: 1 },
              ],
            },
            {
              a: "lv",
              b: "ref",
              verdict: "FLOOR",
              verdicts: [
                { verdict: "PASS", count: 1 },
                { verdict: "FLOOR", count: 1 },
              ],
              metrics: [
                {
                  name: "landing.maxDistance",
                  unit: "mm",
                  value: 1.25e-8,
                  where: { field: 54, line: 0, ray: 4 },
                  tolerance: 1e-8,
                },
                { name: "mask.mismatches", unit: "rays", value: 0, tolerance: 0 },
                { name: "mask.rimBand", unit: "rays", value: 1 },
              ],
            },
            {
              a: "other",
              b: "ref",
              verdict: "PASS",
              verdicts: [{ verdict: "PASS", count: 2 }],
              metrics: [
                { name: "landing.maxDistance", unit: "mm", value: null, tolerance: 1e-8 },
                { name: "mask.mismatches", unit: "rays", value: 0, tolerance: 0 },
                { name: "mask.rimBand", unit: "rays", value: 0 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Every valid fixture written here: `valid/<kind>/<name>.json` holds exactly this value. */
export const VALID: Readonly<Record<ContractKind, Readonly<Record<string, unknown>>>> = {
  "optical-case": { singlet: SINGLET_CASE, "all-features": ALL_FEATURES_CASE },
  "run-spec": {
    minimal: RUN_SPEC_MINIMAL,
    "worked-example": RUN_SPEC_WORKED,
    "lv-lens-all-options": RUN_SPEC_LV,
    "lv-lens-mtf-options": RUN_SPEC_LV_MTF,
  },
  suite: { minimal: SUITE_MINIMAL, "worked-example": SUITE_WORKED },
  request: { minimal: REQUEST_MINIMAL, "with-engine-options": REQUEST_WITH_OPTIONS },
  result: {
    ok: RESULT_OK,
    "ok-with-adapter-revision": RESULT_BUILTIN,
    unsupported: RESULT_UNSUPPORTED,
    "unsupported-case-source": RESULT_UNSUPPORTED_SOURCE,
    error: RESULT_ERROR,
    pending: RESULT_PENDING,
  },
  "engine-descriptor": { minimal: DESCRIPTOR_MINIMAL, full: DESCRIPTOR_FULL },
  "protocol-request": { hello: PROTOCOL_HELLO, run: PROTOCOL_RUN, shutdown: PROTOCOL_SHUTDOWN },
  "protocol-response": {
    hello: RESPONSE_HELLO,
    run: RESPONSE_RUN,
    shutdown: RESPONSE_SHUTDOWN,
    failure: RESPONSE_FAILURE,
  },
  policy: { selftest: POLICY_SELFTEST, ladder: POLICY_LADDER, "every-mode": POLICY_EVERY_MODE },
  comparison: {
    "reference-vs-each": COMPARISON_REFERENCE,
    pairwise: COMPARISON_PAIRWISE,
    blocked: COMPARISON_BLOCKED,
    floor: COMPARISON_FLOOR,
  },
  baseline: { selftest: BASELINE_SELFTEST, rays: BASELINE_RAYS },
};

/** Where the validator must report an invalid fixture: its one issue has this instance path and this keyword. */
export interface Expectation {
  readonly path: string;
  readonly keyword: string;
}

/** An invalid fixture: `invalid/<kind>/<name>.json` holds `value` and `<name>.expect.json` holds `expect`. */
export interface InvalidFixture {
  readonly value: unknown;
  readonly expect: Expectation;
}

/** As the replacement in `edited`, removes the member instead of setting it. */
export const REMOVE = Symbol("remove");

/**
 * A deep copy of `base` in which the member at JSON Pointer `pointer` is set to `replacement`, added when it was
 * not there, or removed when `replacement` is `REMOVE`. The pointer "" replaces the whole value.
 */
export function edited(base: unknown, pointer: string, replacement: unknown): unknown {
  if (pointer === "") return replacement;
  const value: unknown = structuredClone(base);
  const tokens = pointer.slice(1).split("/");
  const last = tokens.pop() as string;
  let parent = value as Record<string, unknown>;
  for (const token of tokens) parent = parent[token] as Record<string, unknown>;
  if (replacement === REMOVE) delete parent[last];
  else parent[last] = replacement;
  return value;
}

/**
 * One invalid fixture: `base` with one member edited, and the place the validator must report it, which is the
 * edited member itself unless `reportedAt` says otherwise.
 */
function fault(
  base: unknown,
  pointer: string,
  replacement: unknown,
  keyword: string,
  reportedAt: string = pointer,
): InvalidFixture {
  return { value: edited(base, pointer, replacement), expect: { path: reportedAt, keyword } };
}

const SURFACE_0 = "/system/surfaces/0";
const INDEX_TABLE = "/conditions/indexAfterSurface/$nd";

/** Every invalid fixture. Each is invalid for exactly one reason. */
export const INVALID: Readonly<Record<ContractKind, Readonly<Record<string, InvalidFixture>>>> = {
  "optical-case": {
    "not-an-object": fault(SINGLET_CASE, "", "optical-case", "type"),
    "missing-system-id": fault(SINGLET_CASE, "/systemId", REMOVE, "required", ""),
    "kind-of-another-document": fault(SINGLET_CASE, "/kind", "run-spec", "const"),
    "contract-major-2": fault(SINGLET_CASE, "/contract", "2.0", "pattern"),
    "id-uppercase-hex": fault(SINGLET_CASE, "/id", SINGLET_CASE.id.toUpperCase(), "pattern"),
    "label-empty-name": fault(SINGLET_CASE, "/label/name", "", "minLength"),
    "label-zoom-above-one": fault(ALL_FEATURES_CASE, "/label/zoomT", 1.5, "maximum"),
    "no-surfaces": fault(SINGLET_CASE, "/system/surfaces", [], "minItems"),
    "stop-index-as-string": fault(SINGLET_CASE, "/system/stopIndex", "0", "type"),
    "stop-index-fractional": fault(SINGLET_CASE, "/system/stopIndex", 0.5, "type"),
    "stop-index-negative": fault(SINGLET_CASE, "/system/stopIndex", -1, "minimum"),
    "surface-unknown-property": fault(SINGLET_CASE, `${SURFACE_0}/tilt`, 0, "additionalProperties"),
    "surface-negative-thickness": fault(SINGLET_CASE, `${SURFACE_0}/thickness`, -4, "minimum"),
    "surface-unknown-synthetic": fault(SINGLET_CASE, `${SURFACE_0}/synthetic`, "filter", "enum"),
    "shape-unknown-kind": fault(SINGLET_CASE, `${SURFACE_0}/shape/kind`, "toroid", "oneOf", `${SURFACE_0}/shape`),
    "shape-zero-radius": fault(SINGLET_CASE, `${SURFACE_0}/shape/radius`, 0, "oneOf", `${SURFACE_0}/shape`),
    "shape-plane-as-huge-radius": fault(SINGLET_CASE, `${SURFACE_0}/shape`, { kind: "plane", radius: 1e15 }, "oneOf"),
    "asphere-without-terms": fault(ALL_FEATURES_CASE, `${SURFACE_0}/shape/terms`, [], "oneOf", `${SURFACE_0}/shape`),
    "asphere-power-zero": fault(
      ALL_FEATURES_CASE,
      `${SURFACE_0}/shape/terms/0/power`,
      0,
      "oneOf",
      `${SURFACE_0}/shape`,
    ),
    "aperture-zero-semi-diameter": fault(SINGLET_CASE, `${SURFACE_0}/aperture/semiDiameter`, 0, "exclusiveMinimum"),
    "aperture-missing-inner": fault(
      SINGLET_CASE,
      `${SURFACE_0}/aperture/innerSemiDiameter`,
      REMOVE,
      "required",
      `${SURFACE_0}/aperture`,
    ),
    "object-behind-first-vertex": fault(SINGLET_CASE, "/conditions/object", { kind: "finite", z: 25 }, "oneOf"),
    "no-lines": fault(SINGLET_CASE, "/conditions/lines", [], "minItems"),
    "line-unknown-index-source": fault(SINGLET_CASE, "/conditions/lines/0/indexSource", "measured", "enum"),
    "line-zero-weight": fault(SINGLET_CASE, "/conditions/lines/0/weight", 0, "exclusiveMinimum"),
    "index-table-as-plain-numbers": fault(SINGLET_CASE, "/conditions/indexAfterSurface", [[1.5168, 1]], "type"),
    "index-table-not-float64": fault(SINGLET_CASE, `${INDEX_TABLE}/dtype`, "i4", "const"),
    "index-table-one-axis": fault(SINGLET_CASE, `${INDEX_TABLE}/shape`, [2], "minItems"),
    "index-table-three-axes": fault(SINGLET_CASE, `${INDEX_TABLE}/shape`, [1, 1, 2], "maxItems"),
    "index-table-malformed-digest": fault(SINGLET_CASE, `${INDEX_TABLE}/sha256`, "0f", "pattern"),
    "feature-unknown": fault(SINGLET_CASE, "/features", ["surface.toroid"], "enum", "/features/0"),
    "feature-repeated": fault(SINGLET_CASE, "/features", ["object.finite", "object.finite"], "uniqueItems"),
    "provenance-missing-producer": fault(SINGLET_CASE, "/provenance/producer", REMOVE, "required", "/provenance"),
    "provenance-unknown-source": fault(SINGLET_CASE, "/provenance/source", { kind: "zmx", file: "a.zmx" }, "oneOf"),
    "provenance-focus-above-one": fault(
      ALL_FEATURES_CASE,
      "/provenance/source/focusT",
      1.25,
      "oneOf",
      "/provenance/source",
    ),
    "provenance-dirty-as-string": fault(ALL_FEATURES_CASE, "/provenance/lv/dirty", "no", "type"),
    "provenance-note-repeated": fault(
      ALL_FEATURES_CASE,
      "/provenance/notes",
      ["bulk-absorption", "bulk-absorption"],
      "uniqueItems",
    ),
    "provenance-note-not-a-code": fault(ALL_FEATURES_CASE, "/provenance/notes/1", "Fisheye projection", "pattern"),
    // The file says 1e400, which every JSON parser reads as an infinity; see `fixtureText`.
    "number-overflow": fault(SINGLET_CASE, "/conditions/imageZ", Infinity, "finite"),
  },
  "run-spec": {
    "missing-lens": fault(RUN_SPEC_WORKED, "/lens", REMOVE, "required", ""),
    "kind-of-another-document": fault(RUN_SPEC_WORKED, "/kind", "suite", "const"),
    "name-with-slash": fault(RUN_SPEC_WORKED, "/name", "double/gauss", "pattern"),
    // A pattern's $ is the very end of the string; Python's own $ would let the newline through.
    "name-with-trailing-newline": fault(RUN_SPEC_WORKED, "/name", "double-gauss-f5\n", "pattern"),
    "unknown-option": fault(RUN_SPEC_WORKED, "/wavelengthNm", 550, "additionalProperties"),
    "lens-unknown-kind": fault(RUN_SPEC_WORKED, "/lens", { kind: "zmx", path: "a.zmx" }, "oneOf"),
    "state-zoom-above-one": fault(RUN_SPEC_LV, "/state/zoomT", 1.2, "maximum"),
    "state-focus-without-value": fault(RUN_SPEC_LV, "/state/focus", { kind: "focusT" }, "oneOf"),
    "aperture-zero-f-number": fault(RUN_SPEC_LV, "/aperture/value", 0, "oneOf", "/aperture"),
    // The tab's comparison is at f/8 and at no other: it takes no number.
    "aperture-f8-comparison-with-value": fault(RUN_SPEC_LV_MTF, "/aperture/value", 8, "oneOf", "/aperture"),
    "lines-unknown-set": fault(RUN_SPEC_WORKED, "/lines/kind", "rgb", "oneOf", "/lines"),
    "fields-angle-of-90": fault(RUN_SPEC_WORKED, "/fields/values", [0, 90], "oneOf", "/fields"),
    "fields-without-values": fault(RUN_SPEC_WORKED, "/fields/values", [], "oneOf", "/fields"),
    "image-plane-shift-without-mm": fault(RUN_SPEC_WORKED, "/imagePlane", { kind: "shift" }, "oneOf"),
    "frequencies-empty": fault(RUN_SPEC_WORKED, "/frequenciesPerMm", [], "minItems"),
    "frequency-negative": fault(RUN_SPEC_WORKED, "/frequenciesPerMm/0", -10, "minimum"),
    "frequency-repeated": fault(RUN_SPEC_WORKED, "/frequenciesPerMm", [10, 20, 10], "uniqueItems"),
    "sampling-grid-cap-not-offered": fault(RUN_SPEC_WORKED, "/sampling/lvGridCap", 100, "enum"),
    "sampling-bundle-grid-fractional": fault(RUN_SPEC_WORKED, "/sampling/bundleGrid", 16.5, "type"),
    "sampling-engine-options-as-number": fault(RUN_SPEC_WORKED, "/sampling/engines/optiland", 512, "type"),
    "rung-empty": fault(RUN_SPEC_WORKED, "/rungs/0", "", "minLength"),
    "engines-as-string": fault(RUN_SPEC_WORKED, "/engines", "optiland", "type"),
    "engine-id-uppercase": fault(RUN_SPEC_WORKED, "/engines/1", "Optiland", "pattern"),
    "reference-engine-as-number": fault(RUN_SPEC_WORKED, "/referenceEngine", 1, "type"),
  },
  suite: {
    "missing-runs": fault(SUITE_WORKED, "/runs", REMOVE, "required", ""),
    "no-runs": fault(SUITE_WORKED, "/runs", [], "minItems"),
    "runs-as-object": fault(SUITE_WORKED, "/runs", {}, "type"),
    "kind-of-another-document": fault(SUITE_WORKED, "/kind", "run-spec", "const"),
    "contract-without-minor": fault(SUITE_WORKED, "/contract", "1", "pattern"),
    "defaults-with-lens": fault(SUITE_WORKED, "/defaults/lens", { kind: "lv", key: "a" }, "additionalProperties"),
    "defaults-grid-cap-not-offered": fault(SUITE_WORKED, "/defaults/sampling/lvGridCap", 48, "enum"),
    "run-missing-name": fault(SUITE_WORKED, "/runs/0/name", REMOVE, "required", "/runs/0"),
    "run-kind-of-another-document": fault(SUITE_MINIMAL, "/runs/0/kind", "suite", "const"),
    "run-unknown-option": fault(SUITE_WORKED, "/runs/1/zoom", 1, "additionalProperties"),
  },
  request: {
    "missing-spec": fault(REQUEST_WITH_OPTIONS, "/spec", REMOVE, "required", ""),
    "missing-id": fault(REQUEST_WITH_OPTIONS, "/id", REMOVE, "required", ""),
    "kind-of-another-document": fault(REQUEST_WITH_OPTIONS, "/kind", "result", "const"),
    "case-id-too-short": fault(REQUEST_WITH_OPTIONS, "/caseId", "abc123", "pattern"),
    "quantity-without-dot": fault(REQUEST_WITH_OPTIONS, "/quantity", "rays", "pattern"),
    "quantity-uppercase": fault(REQUEST_WITH_OPTIONS, "/quantity", "MTF.native", "pattern"),
    "spec-as-array": fault(REQUEST_WITH_OPTIONS, "/spec", [], "type"),
    "engine-options-null": fault(REQUEST_WITH_OPTIONS, "/engineOptions", null, "type"),
    "unknown-property": fault(REQUEST_WITH_OPTIONS, "/priority", 1, "additionalProperties"),
    // No schema describes the inside of a spec, and a number there must be finite all the same.
    "spec-number-overflow": fault(REQUEST_WITH_OPTIONS, "/spec/line", Infinity, "finite"),
  },
  result: {
    "missing-diagnostics": fault(RESULT_OK, "/diagnostics", REMOVE, "required", ""),
    "status-unknown": fault(RESULT_OK, "/status", "done", "enum"),
    "request-id-not-a-hash": fault(RESULT_OK, "/requestId", "request-1", "pattern"),
    "unknown-property": fault(RESULT_OK, "/elapsedMs", 12, "additionalProperties"),
    "engine-missing-fingerprint": fault(RESULT_OK, "/engine/fingerprint", REMOVE, "required", "/engine"),
    "engine-details-nested": fault(RESULT_OK, "/engine/details/build", { date: "2026-01-01" }, "type"),
    "engine-adapter-revision-not-a-hash": fault(RESULT_BUILTIN, "/engine/adapterRevision", "r2", "pattern"),
    "unsupported-empty": fault(RESULT_UNSUPPORTED, "/unsupported", [], "minItems"),
    "unsupported-unknown-code": fault(RESULT_UNSUPPORTED, "/unsupported/0/code", "version", "enum"),
    // The code is `case-source`; a code of another spelling is no code.
    "unsupported-source-misspelled": fault(RESULT_UNSUPPORTED_SOURCE, "/unsupported/0/code", "caseSource", "enum"),
    "unsupported-missing-item": fault(RESULT_UNSUPPORTED, "/unsupported/1/item", REMOVE, "required", "/unsupported/1"),
    "error-missing-message": fault(RESULT_ERROR, "/error/message", REMOVE, "required", "/error"),
    "error-empty-code": fault(RESULT_ERROR, "/error/code", "", "minLength"),
    "method-missing-params": fault(RESULT_OK, "/method/params", REMOVE, "required", "/method"),
    "data-as-array": fault(RESULT_OK, "/data", [1, 2], "type"),
    "count-as-string": fault(RESULT_OK, "/diagnostics/counts/rays", "2", "type"),
    // A boolean is not a number, though Python's `True` is an `int`.
    "count-as-boolean": fault(RESULT_OK, "/diagnostics/counts/rays", true, "type"),
    "warning-as-number": fault(RESULT_ERROR, "/diagnostics/warnings/0", 3, "type"),
  },
  "engine-descriptor": {
    "missing-capabilities": fault(DESCRIPTOR_FULL, "/capabilities", REMOVE, "required", ""),
    "contract-as-string": fault(DESCRIPTOR_FULL, "/contract", "1.0", "type"),
    "contract-max-malformed": fault(DESCRIPTOR_FULL, "/contract/max", "1.x", "pattern"),
    "identity-id-uppercase": fault(DESCRIPTOR_FULL, "/identity/id", "Example", "pattern"),
    "identity-missing-fingerprint": fault(DESCRIPTOR_FULL, "/identity/fingerprint", REMOVE, "required", "/identity"),
    "identity-details-as-list": fault(DESCRIPTOR_FULL, "/identity/details/python", ["3.14"], "type"),
    // An adapter revision is a content hash, never a version someone numbers.
    "identity-adapter-revision-not-a-hash": fault(DESCRIPTOR_FULL, "/identity/adapterRevision", "2", "pattern"),
    "supported-repeated": fault(
      DESCRIPTOR_FULL,
      "/capabilities/features/supported",
      ["surface.conic", "object.finite", "surface.conic"],
      "uniqueItems",
    ),
    "supported-as-number": fault(DESCRIPTOR_FULL, "/capabilities/features/supported/0", 7, "type"),
    "limit-as-string": fault(DESCRIPTOR_FULL, "/capabilities/features/limits/asphere.maxPower", "20", "type"),
    "quantity-version-zero": fault(DESCRIPTOR_FULL, "/capabilities/quantities/rays.trace/version", 0, "minimum"),
    "quantity-unknown-property": fault(
      DESCRIPTOR_FULL,
      "/capabilities/quantities/rays.trace/units",
      "mm",
      "additionalProperties",
    ),
    "deterministic-as-string": fault(DESCRIPTOR_FULL, "/capabilities/deterministic", "yes", "type"),
    "concurrency-zero": fault(DESCRIPTOR_FULL, "/capabilities/maxConcurrency", 0, "minimum"),
    "concurrency-fractional": fault(DESCRIPTOR_FULL, "/capabilities/maxConcurrency", 1.5, "type"),
    "concurrency-as-boolean": fault(DESCRIPTOR_FULL, "/capabilities/maxConcurrency", true, "type"),
  },
  // A protocol message is one of two whole shapes, so every fault in it is reported at the root, by oneOf.
  "protocol-request": {
    "not-an-object": fault(PROTOCOL_HELLO, "", ["hello"], "oneOf"),
    "missing-id": fault(PROTOCOL_HELLO, "/id", REMOVE, "oneOf", ""),
    "unknown-method": fault(PROTOCOL_HELLO, "/method", "ping", "oneOf", ""),
    "hello-with-params": fault(PROTOCOL_HELLO, "/params/verbose", true, "oneOf", ""),
    "shutdown-without-params": fault(PROTOCOL_SHUTDOWN, "/params", REMOVE, "oneOf", ""),
    "run-without-case": fault(PROTOCOL_RUN, "/params/case", REMOVE, "oneOf", ""),
    "run-with-invalid-case": fault(PROTOCOL_RUN, "/params/case/system/stopIndex", "0", "oneOf", ""),
    "run-with-invalid-request": fault(PROTOCOL_RUN, "/params/request/quantity", "rays", "oneOf", ""),
  },
  "protocol-response": {
    "missing-contract": fault(RESPONSE_HELLO, "/contract", REMOVE, "oneOf", ""),
    "ok-as-string": fault(RESPONSE_HELLO, "/ok", "true", "oneOf", ""),
    // 1 is not true, though Python's `1 == True`.
    "ok-as-number": fault(RESPONSE_HELLO, "/ok", 1, "oneOf", ""),
    "ok-without-result": fault(RESPONSE_SHUTDOWN, "/result", REMOVE, "oneOf", ""),
    "ok-with-error": fault(RESPONSE_SHUTDOWN, "/error", { code: "none", message: "" }, "oneOf", ""),
    "ok-with-unknown-result": fault(RESPONSE_RUN, "/result", { status: "ok" }, "oneOf", ""),
    "failure-without-error": fault(RESPONSE_FAILURE, "/error", REMOVE, "oneOf", ""),
    "failure-with-result": fault(RESPONSE_FAILURE, "/result", {}, "oneOf", ""),
  },
  policy: {
    "missing-rungs": fault(POLICY_SELFTEST, "/rungs", REMOVE, "required", ""),
    "kind-of-another-document": fault(POLICY_SELFTEST, "/kind", "suite", "const"),
    "version-zero": fault(POLICY_SELFTEST, "/version", 0, "minimum"),
    "version-as-string": fault(POLICY_SELFTEST, "/version", "1", "type"),
    "rungs-as-list": fault(POLICY_SELFTEST, "/rungs", [], "type"),
    "rung-missing-class": fault(POLICY_SELFTEST, "/rungs/selftest/class", REMOVE, "required", "/rungs/selftest"),
    "rung-unknown-mode": fault(POLICY_SELFTEST, "/rungs/selftest/mode", "identical", "enum"),
    "rung-unknown-class": fault(POLICY_EVERY_MODE, "/rungs/r5/class", "informational", "enum"),
    "rung-quantity-without-dot": fault(POLICY_SELFTEST, "/rungs/selftest/quantity", "selftest", "pattern"),
    "rung-unknown-property": fault(POLICY_SELFTEST, "/rungs/selftest/tolerance", 1e-12, "additionalProperties"),
    "metric-missing-unit": fault(
      POLICY_SELFTEST,
      "/rungs/selftest/metrics/sum.abs/unit",
      REMOVE,
      "required",
      "/rungs/selftest/metrics/sum.abs",
    ),
    "metric-empty-unit": fault(POLICY_SELFTEST, "/rungs/selftest/metrics/sum.abs/unit", "", "minLength"),
    "metric-negative-tolerance": fault(POLICY_SELFTEST, "/rungs/selftest/metrics/sum.abs/tolerance", -1e-12, "minimum"),
    "metric-attention-as-string": fault(POLICY_EVERY_MODE, "/rungs/r5/metrics/mtf.maxAbs/attention", "0.005", "type"),
    "metric-as-number": fault(POLICY_SELFTEST, "/rungs/selftest/metrics/sum.abs", 1e-12, "type"),
    "rung-blocks-as-string": fault(POLICY_LADDER, "/rungs/r0/blocksLaterRungs", "later", "type"),
    "rung-floor-without-arbiter": fault(
      POLICY_LADDER,
      "/rungs/r2/floor/arbiter",
      REMOVE,
      "required",
      "/rungs/r2/floor",
    ),
    "rung-floor-engine-uppercase": fault(POLICY_LADDER, "/rungs/r3/floor/engine", "LV", "pattern"),
    "metric-floor-negative-limit": fault(
      POLICY_LADDER,
      "/rungs/r2/metrics/hits.maxDistance/floor/limit",
      -1e-7,
      "minimum",
    ),
    "metric-floor-without-agreement": fault(
      POLICY_LADDER,
      "/rungs/r3/metrics/opd.maxAbs/floor/agreement",
      REMOVE,
      "required",
      "/rungs/r3/metrics/opd.maxAbs/floor",
    ),
  },
  comparison: {
    "missing-pairs": fault(COMPARISON_REFERENCE, "/pairs", REMOVE, "required", ""),
    "kind-of-another-document": fault(COMPARISON_REFERENCE, "/kind", "result", "const"),
    "suite-with-slash": fault(COMPARISON_REFERENCE, "/suite", "runs/example", "pattern"),
    "request-id-not-a-hash": fault(COMPARISON_REFERENCE, "/requestId", "request-1", "pattern"),
    "mode-unknown": fault(COMPARISON_REFERENCE, "/mode", "all-pairs", "enum"),
    "reference-uppercase": fault(COMPARISON_REFERENCE, "/reference", "Fake-A", "pattern"),
    "participant-unknown-status": fault(COMPARISON_REFERENCE, "/participants/0/status", "cached", "enum"),
    "participant-missing-fingerprint": fault(
      COMPARISON_REFERENCE,
      "/participants/1/fingerprint",
      REMOVE,
      "required",
      "/participants/1",
    ),
    "participant-fingerprint-as-number": fault(COMPARISON_PAIRWISE, "/participants/0/fingerprint", 0, "type"),
    "pair-verdict-lowercase": fault(COMPARISON_REFERENCE, "/pairs/0/verdict", "pass", "enum"),
    "pair-unknown-verdict": fault(COMPARISON_REFERENCE, "/pairs/0/verdict", "MARGINAL", "enum"),
    "pair-unknown-class": fault(COMPARISON_REFERENCE, "/pairs/0/class", "method", "enum"),
    "pair-empty-reason": fault(COMPARISON_REFERENCE, "/pairs/1/reason", "", "minLength"),
    "pair-unknown-property": fault(COMPARISON_REFERENCE, "/pairs/0/tolerance", 1e-12, "additionalProperties"),
    "metric-value-as-string": fault(COMPARISON_REFERENCE, "/pairs/0/metrics/0/value", "NaN", "type"),
    "metric-missing-unit": fault(
      COMPARISON_REFERENCE,
      "/pairs/0/metrics/1/unit",
      REMOVE,
      "required",
      "/pairs/0/metrics/1",
    ),
    "metric-where-nested": fault(COMPARISON_REFERENCE, "/pairs/0/metrics/0/where/index", [2], "type"),
    "pair-verdict-of-another-ladder": fault(COMPARISON_BLOCKED, "/pairs/0/verdict", "STALE", "enum"),
    "participant-recorded-as-list": fault(COMPARISON_BLOCKED, "/participants/1/recorded", [-0.25], "type"),
    "participant-recorded-value-as-text": fault(
      COMPARISON_BLOCKED,
      "/participants/0/recorded/epZRelStop/1",
      "NaN",
      "type",
    ),
  },
  baseline: {
    "missing-runs": fault(BASELINE_SELFTEST, "/runs", REMOVE, "required", ""),
    "kind-of-another-document": fault(BASELINE_SELFTEST, "/kind", "comparison", "const"),
    "suite-hash-not-a-hash": fault(BASELINE_SELFTEST, "/suite/hash", "example", "pattern"),
    "policy-version-zero": fault(BASELINE_SELFTEST, "/policy/version", 0, "minimum"),
    "engine-missing-fingerprint": fault(BASELINE_SELFTEST, "/engines/0/fingerprint", REMOVE, "required", "/engines/0"),
    "engine-id-uppercase": fault(BASELINE_SELFTEST, "/engines/1/id", "Fake", "pattern"),
    "engine-with-path": fault(BASELINE_RAYS, "/engines/0/path", "/somewhere/lv", "additionalProperties"),
    "run-case-not-a-hash": fault(BASELINE_SELFTEST, "/runs/0/caseId", "singlet", "pattern"),
    "run-with-time": fault(BASELINE_SELFTEST, "/runs/0/writtenAt", "2020-01-01", "additionalProperties"),
    "rung-requests-negative": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/requests", -1, "minimum"),
    "rung-missing-support": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/support", REMOVE, "required", "/runs/0/rungs/0"),
    "support-unknown-status": fault(BASELINE_RAYS, "/runs/0/rungs/0/support/1/status", "cached", "enum"),
    "rays-count-as-fraction": fault(BASELINE_RAYS, "/runs/0/rungs/1/rays/0/ok", 9.5, "type"),
    "pair-unknown-verdict": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/pairs/0/verdict", "OK", "enum"),
    "pair-verdict-count-zero": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/pairs/0/verdicts/0/count", 0, "minimum"),
    "pair-with-reason": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/pairs/0/reason", "none", "additionalProperties"),
    "metric-value-as-string": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/pairs/0/metrics/0/value", "2e-14", "type"),
    "metric-missing-unit": fault(
      BASELINE_SELFTEST,
      "/runs/0/rungs/0/pairs/0/metrics/1/unit",
      REMOVE,
      "required",
      "/runs/0/rungs/0/pairs/0/metrics/1",
    ),
    "metric-negative-tolerance": fault(BASELINE_SELFTEST, "/runs/0/rungs/0/pairs/0/metrics/0/tolerance", -1, "minimum"),
    "metric-with-array": fault(
      BASELINE_RAYS,
      "/runs/0/rungs/1/pairs/0/metrics/0/values",
      [1, 2],
      "additionalProperties",
    ),
  },
};

/** The fixtures of one quantity schema, valid and invalid, as `VALID` and `INVALID` hold them for a kind. */
export interface QuantityFixtures {
  readonly valid: Readonly<Record<string, unknown>>;
  readonly invalid: Readonly<Record<string, InvalidFixture>>;
}

function examplePart(part: keyof EchoExample): Record<string, unknown> {
  return Object.fromEntries(Object.entries(SELFTEST_ECHO_EXAMPLES).map(([name, example]) => [name, example[part]]));
}

const ECHO_SPEC = SELFTEST_ECHO_EXAMPLES.matrix.spec;
const ECHO_DATA = SELFTEST_ECHO_EXAMPLES.matrix.data;

/**
 * The fixtures of every quantity schema, by `<quantity>.<part>`: the name of the schema file without
 * `.schema.json`, and of the fixture directory below `valid/quantities/` and `invalid/quantities/`.
 */
export const QUANTITY_FIXTURES: Readonly<Record<string, QuantityFixtures>> = {
  [`${SYSTEM_DESCRIBE}.spec`]: {
    valid: {
      default: {} satisfies SystemDescribeSpec,
      "three-fractions": DESCRIBE_SPEC_THREE,
      "nine-fractions": { sagFractions: [...DEFAULT_SAG_FRACTIONS] } satisfies SystemDescribeSpec,
    },
    invalid: {
      "not-an-object": fault(DESCRIBE_SPEC_THREE, "", [0, 0.5, 1], "type"),
      "fractions-as-number": fault(DESCRIBE_SPEC_THREE, "/sagFractions", 9, "type"),
      "fractions-empty": fault(DESCRIBE_SPEC_THREE, "/sagFractions", [], "minItems"),
      "fractions-repeated": fault(DESCRIBE_SPEC_THREE, "/sagFractions", [0, 0.5, 0.5], "uniqueItems"),
      "fraction-above-one": fault(DESCRIBE_SPEC_THREE, "/sagFractions/2", 1.25, "maximum"),
      "fraction-negative": fault(DESCRIBE_SPEC_THREE, "/sagFractions/0", -0.5, "minimum"),
      "fraction-as-string": fault(DESCRIBE_SPEC_THREE, "/sagFractions/1", "1/2", "type"),
      "unknown-property": fault(DESCRIBE_SPEC_THREE, "/radii", [0, 5, 10], "additionalProperties"),
    },
  },
  [`${SYSTEM_DESCRIBE}.data`]: {
    valid: { singlet: DESCRIBE_DATA_SINGLET, "asphere-two-lines": DESCRIBE_DATA_ASPHERE },
    invalid: {
      "missing-terms": fault(DESCRIBE_DATA_SINGLET, "/terms", REMOVE, "required", ""),
      "missing-sag": fault(DESCRIBE_DATA_SINGLET, "/sag", REMOVE, "required", ""),
      "missing-inner-clip-radius": fault(DESCRIBE_DATA_SINGLET, "/innerClipRadius", REMOVE, "required", ""),
      "inner-clip-radius-as-number": fault(DESCRIBE_DATA_SINGLET, "/innerClipRadius", 0, "type"),
      "surface-count-zero": fault(DESCRIBE_DATA_SINGLET, "/surfaceCount", 0, "minimum"),
      "stop-index-negative": fault(DESCRIBE_DATA_SINGLET, "/stopIndex", -1, "minimum"),
      "stop-semi-diameter-zero": fault(DESCRIBE_DATA_SINGLET, "/stopSemiDiameter", 0, "exclusiveMinimum"),
      "image-z-null": fault(DESCRIBE_DATA_SINGLET, "/imageZ", null, "type"),
      "vertex-z-as-plain-numbers": fault(DESCRIBE_DATA_SINGLET, "/vertexZ", [0, 4], "type"),
      "vertex-z-two-axes": fault(DESCRIBE_DATA_SINGLET, "/vertexZ/$nd/shape", [1, 2], "maxItems"),
      "index-table-one-axis": fault(DESCRIBE_DATA_SINGLET, "/indexAfterSurface/$nd/shape", [2], "minItems"),
      "sag-not-float64": fault(DESCRIBE_DATA_SINGLET, "/sag/$nd/dtype", "i4", "const"),
      "terms-empty": fault(DESCRIBE_DATA_SINGLET, "/terms", [], "minItems"),
      "term-power-zero": fault(DESCRIBE_DATA_ASPHERE, "/terms/0/0/power", 0, "minimum"),
      // A term that adds nothing is not listed: an engine that holds one leaves it out.
      "term-zero-coefficient": fault(DESCRIBE_DATA_ASPHERE, "/terms/0/1/coeff", 0, "anyOf"),
      "term-unknown-property": fault(DESCRIBE_DATA_ASPHERE, "/terms/0/0/name", "A4", "additionalProperties"),
      "unknown-property": fault(DESCRIBE_DATA_SINGLET, "/lastLensSurfaceIndex", 1, "additionalProperties"),
    },
  },
  [`${PARAXIAL_FIRST_ORDER}.spec`]: {
    valid: { empty: FIRST_ORDER_SPEC },
    invalid: {
      "not-an-object": fault(FIRST_ORDER_SPEC, "", [], "type"),
      "as-null": fault(FIRST_ORDER_SPEC, "", null, "type"),
      "as-string": fault(FIRST_ORDER_SPEC, "", "paraxial", "type"),
      "line-chosen": fault(FIRST_ORDER_SPEC, "/line", 0, "additionalProperties"),
      "object-chosen": fault(FIRST_ORDER_SPEC, "/object", { kind: "infinity" }, "additionalProperties"),
    },
  },
  [`${PARAXIAL_FIRST_ORDER}.data`]: {
    valid: { singlet: FIRST_ORDER_DATA_SINGLET, "finite-object-two-lines": FIRST_ORDER_DATA_TWO_LINES },
    invalid: {
      "missing-efl": fault(FIRST_ORDER_DATA_SINGLET, "/efl", REMOVE, "required", ""),
      "missing-recorded": fault(FIRST_ORDER_DATA_SINGLET, "/recorded", REMOVE, "required", ""),
      "efl-as-number": fault(FIRST_ORDER_DATA_SINGLET, "/efl", 49.04, "type"),
      "back-focus-not-float64": fault(FIRST_ORDER_DATA_SINGLET, "/backFocus/$nd/dtype", "i4", "const"),
      "pupil-z-two-axes": fault(FIRST_ORDER_DATA_TWO_LINES, "/exitPupilZ/$nd/shape", [1, 2], "maxItems"),
      "pupil-z-no-axis": fault(FIRST_ORDER_DATA_TWO_LINES, "/entrancePupilZ/$nd/shape", [], "minItems"),
      "recorded-as-list": fault(FIRST_ORDER_DATA_TWO_LINES, "/recorded", [], "type"),
      "recorded-value-as-plain-numbers": fault(
        FIRST_ORDER_DATA_TWO_LINES,
        "/recorded/magnification",
        [-0.25, -0.2515],
        "type",
      ),
      "unknown-property": fault(FIRST_ORDER_DATA_SINGLET, "/fNumber", 4.9, "additionalProperties"),
    },
  },
  [`${RAYS_TRACE}.spec`]: {
    valid: { "singlet-axis-and-rim": RAYS_SPEC_SINGLET, "lattice-with-chief": RAYS_SPEC_LATTICE },
    invalid: {
      "not-an-object": fault(RAYS_SPEC_SINGLET, "", [0, 0, -10, 0, 0, 1], "type"),
      "missing-origins": fault(RAYS_SPEC_SINGLET, "/origins", REMOVE, "required", ""),
      "missing-weights": fault(RAYS_SPEC_SINGLET, "/weights", REMOVE, "required", ""),
      "line-negative": fault(RAYS_SPEC_SINGLET, "/line", -1, "minimum"),
      "line-as-wavelength": fault(RAYS_SPEC_SINGLET, "/line", 587.5618, "type"),
      "origins-one-axis": fault(RAYS_SPEC_SINGLET, "/origins/$nd/shape", [6], "minItems"),
      "directions-not-float64": fault(RAYS_SPEC_SINGLET, "/directions/$nd/dtype", "i4", "const"),
      "directions-as-plain-numbers": fault(RAYS_SPEC_SINGLET, "/directions", [[0, 0, 1]], "type"),
      "weights-two-axes": fault(RAYS_SPEC_SINGLET, "/weights/$nd/shape", [2, 1], "maxItems"),
      "unknown-property": fault(RAYS_SPEC_SINGLET, "/wavelengthNm", 587.5618, "additionalProperties"),
      "groups-unknown-property": fault(RAYS_SPEC_LATTICE, "/groups/pupil", "exit", "additionalProperties"),
      "field-without-angle": fault(RAYS_SPEC_LATTICE, "/groups/field/angleDeg", REMOVE, "required", "/groups/field"),
      // A field at 90 degrees has no ray that travels toward +z.
      "field-angle-ninety": fault(RAYS_SPEC_LATTICE, "/groups/field/angleDeg", 90, "exclusiveMaximum"),
      "field-fraction-above-one": fault(RAYS_SPEC_LATTICE, "/groups/field/heightFraction", 1.5, "maximum"),
      "lattice-columns-zero": fault(RAYS_SPEC_LATTICE, "/groups/lattice/columns", 0, "minimum"),
      "lattice-step-zero": fault(RAYS_SPEC_LATTICE, "/groups/lattice/step", 0, "exclusiveMinimum"),
      "chief-index-negative": fault(RAYS_SPEC_LATTICE, "/groups/chiefIndex", -1, "minimum"),
    },
  },
  [`${RAYS_TRACE}.data`]: {
    valid: { "singlet-axis-and-rim": RAYS_DATA_SINGLET, "every-status": RAYS_DATA_STATUSES },
    invalid: {
      "missing-status": fault(RAYS_DATA_SINGLET, "/status", REMOVE, "required", ""),
      "missing-optical-path-to-image": fault(RAYS_DATA_SINGLET, "/opticalPathToImage", REMOVE, "required", ""),
      // A status is one byte per ray, never a word or a flag.
      "status-not-uint8": fault(RAYS_DATA_SINGLET, "/status/$nd/dtype", "i4", "const"),
      "status-as-words": fault(RAYS_DATA_SINGLET, "/status", ["ok", "blocked"], "type"),
      "end-surface-not-int32": fault(RAYS_DATA_SINGLET, "/endSurface/$nd/dtype", "u1", "const"),
      "end-surface-two-axes": fault(RAYS_DATA_SINGLET, "/endSurface/$nd/shape", [2, 1], "maxItems"),
      "hits-two-axes": fault(RAYS_DATA_SINGLET, "/hits/$nd/shape", [4, 3], "minItems"),
      "hits-not-float64": fault(RAYS_DATA_SINGLET, "/hits/$nd/dtype", "i4", "const"),
      "exit-point-one-axis": fault(RAYS_DATA_SINGLET, "/exitPoint/$nd/shape", [6], "minItems"),
      "image-point-as-plain-numbers": fault(RAYS_DATA_SINGLET, "/imagePoint", [[0, 0, 100]], "type"),
      "optical-path-two-axes": fault(RAYS_DATA_SINGLET, "/opticalPath/$nd/shape", [2, 1], "maxItems"),
      "unknown-property": fault(RAYS_DATA_SINGLET, "/valid", [true, false], "additionalProperties"),
    },
  },
  [`${MTF_NATIVE}.spec`]: {
    valid: { "three-fractions": MTF_SPEC_FRACTIONS, "angles-and-profile": MTF_SPEC_PROFILE },
    invalid: {
      "not-an-object": fault(MTF_SPEC_FRACTIONS, "", [10, 30], "type"),
      "missing-frequencies": fault(MTF_SPEC_FRACTIONS, "/frequenciesPerMm", REMOVE, "required", ""),
      "missing-focus": fault(MTF_SPEC_FRACTIONS, "/focus", REMOVE, "required", ""),
      "frequencies-empty": fault(MTF_SPEC_FRACTIONS, "/frequenciesPerMm", [], "minItems"),
      "frequencies-repeated": fault(MTF_SPEC_FRACTIONS, "/frequenciesPerMm", [10, 10], "uniqueItems"),
      "frequency-negative": fault(MTF_SPEC_FRACTIONS, "/frequenciesPerMm/0", -10, "minimum"),
      "method-unknown": fault(MTF_SPEC_FRACTIONS, "/method", "huygens", "enum"),
      // An engine's own name for its focus criterion is what the answer states, never what a spec asks by.
      "focus-by-engine-name": fault(MTF_SPEC_PROFILE, "/focus", "best-axial", "enum"),
      "fields-as-list": fault(MTF_SPEC_FRACTIONS, "/fields", [0, 0.5, 1], "oneOf"),
      "field-fraction-above-one": fault(MTF_SPEC_FRACTIONS, "/fields/values/2", 1.5, "oneOf", "/fields"),
      "field-angle-ninety": fault(MTF_SPEC_PROFILE, "/fields/values/2", 90, "oneOf", "/fields"),
      "profile-with-space": fault(MTF_SPEC_PROFILE, "/profile", "some engine default", "pattern"),
      "unknown-property": fault(MTF_SPEC_FRACTIONS, "/lines", "photopic", "additionalProperties"),
    },
  },
  [`${MTF_NATIVE}.data`]: {
    valid: { "every-status": MTF_DATA_FRACTIONS, "best-focus-three-lines": MTF_DATA_BEST_FOCUS },
    invalid: {
      "missing-fields": fault(MTF_DATA_FRACTIONS, "/fields", REMOVE, "required", ""),
      "missing-notes": fault(MTF_DATA_FRACTIONS, "/notes", REMOVE, "required", ""),
      "fields-empty": fault(MTF_DATA_FRACTIONS, "/fields", [], "minItems"),
      "field-missing-status": fault(MTF_DATA_FRACTIONS, "/fields/0/status", REMOVE, "required", "/fields/0"),
      // An engine's own word for a status is mapped to one of the three, never passed on.
      "status-by-engine-name": fault(MTF_DATA_FRACTIONS, "/fields/0/status", "converged", "enum"),
      "sagittal-as-plain-numbers": fault(MTF_DATA_FRACTIONS, "/fields/0/sagittal", [0.875, 0.5], "type"),
      "tangential-two-axes": fault(MTF_DATA_FRACTIONS, "/fields/0/tangential/$nd/shape", [2, 1], "maxItems"),
      "sagittal-not-float64": fault(MTF_DATA_FRACTIONS, "/fields/1/sagittal/$nd/dtype", "u1", "const"),
      "field-angle-ninety": fault(MTF_DATA_FRACTIONS, "/fields/1/fieldAngleDeg", 90, "exclusiveMaximum"),
      "image-height-negative": fault(MTF_DATA_FRACTIONS, "/fields/1/imageHeightMm", -10.75, "minimum"),
      "reason-empty": fault(MTF_DATA_FRACTIONS, "/fields/2/reason", "", "minLength"),
      "sampling-value-as-string": fault(MTF_DATA_FRACTIONS, "/fields/0/sampling/gridSize", "32", "type"),
      "field-unknown-property": fault(MTF_DATA_FRACTIONS, "/fields/0/meridional", [0.875, 0.5], "additionalProperties"),
      "method-without-params": fault(MTF_DATA_FRACTIONS, "/method/params", REMOVE, "required", "/method"),
      "focus-without-mode": fault(MTF_DATA_BEST_FOCUS, "/focus/mode", REMOVE, "required", "/focus"),
      "focus-shift-null": fault(MTF_DATA_BEST_FOCUS, "/focus/appliedShiftMm", null, "type"),
      // A label is not a number: the limiting surface is named by its index in the case.
      "aperture-value-as-label": fault(MTF_DATA_BEST_FOCUS, "/aperture/limitingSurfaceIndex", "4A", "type"),
      "lines-empty": fault(MTF_DATA_FRACTIONS, "/lines", [], "minItems"),
      "line-weight-zero": fault(MTF_DATA_BEST_FOCUS, "/lines/1/weight", 0, "exclusiveMinimum"),
      "notes-as-string": fault(MTF_DATA_BEST_FOCUS, "/notes", "The dispersion of one glass is estimated.", "type"),
      "unknown-property": fault(MTF_DATA_FRACTIONS, "/frequenciesPerMm", [10, 30], "additionalProperties"),
    },
  },
  [`${SELFTEST_ECHO}.spec`]: {
    valid: examplePart("spec"),
    invalid: {
      "not-an-object": fault(ECHO_SPEC, "", [1, 2, 3], "type"),
      "missing-scale": fault(ECHO_SPEC, "/scale", REMOVE, "required", ""),
      "missing-values": fault(ECHO_SPEC, "/values", REMOVE, "required", ""),
      "scale-as-string": fault(ECHO_SPEC, "/scale", "2", "type"),
      "scale-null": fault(ECHO_SPEC, "/scale", null, "type"),
      "unknown-property": fault(ECHO_SPEC, "/offset", 1, "additionalProperties"),
      "values-as-plain-numbers": fault(ECHO_SPEC, "/values", [1.5, -2], "type"),
      "values-not-float64": fault(ECHO_SPEC, "/values/$nd/dtype", "i4", "const"),
      "values-missing-shape": fault(ECHO_SPEC, "/values/$nd/shape", REMOVE, "required", "/values/$nd"),
      "values-malformed-digest": fault(ECHO_SPEC, "/values/$nd/sha256", "0f", "pattern"),
    },
  },
  [`${SELFTEST_ECHO}.data`]: {
    valid: examplePart("data"),
    invalid: {
      "missing-sum": fault(ECHO_DATA, "/sum", REMOVE, "required", ""),
      "missing-values": fault(ECHO_DATA, "/values", REMOVE, "required", ""),
      "sum-as-string": fault(ECHO_DATA, "/sum", "-9.6875", "type"),
      // A sum that is not finite is null, never a boolean or a token.
      "sum-as-boolean": fault(ECHO_DATA, "/sum", false, "type"),
      "unknown-property": fault(ECHO_DATA, "/count", 6, "additionalProperties"),
      "values-as-plain-numbers": fault(ECHO_DATA, "/values", [-3.75, 5], "type"),
      "values-not-float64": fault(ECHO_DATA, "/values/$nd/dtype", "u1", "const"),
      "values-negative-axis": fault(ECHO_DATA, "/values/$nd/shape/0", -2, "minimum"),
      "values-data-not-base64": fault(ECHO_DATA, "/values/$nd/data", "not base64!", "pattern"),
    },
  },
};
