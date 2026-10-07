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
import type { OpticalCaseDraft } from "../../src/contract/case.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { FEATURE_FLAGS } from "../../src/contract/features.ts";
import type { ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import type { RunSpec, Suite } from "../../src/contract/runSpec.ts";
import type { ContractKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";

/** The corpus directory: `valid/<kind>/<name>.json`, `invalid/<kind>/<name>.json` and `<name>.expect.json`. */
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
    },
    lv: { commit: "0123456789abcdef0123456789abcdef01234567", dirty: false, closureHash: sha256Hex("example closure") },
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
  rungs: ["R0", "R1", "R2", "R3", "R4"],
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
  rungs: ["R5"],
  engines: ["lv", "optiland"],
  referenceEngine: "lv",
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
    rungs: ["R0", "R1", "R2", "R3", "R4"],
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

// ── request and result ───────────────────────────────────────────────────────────────────────────────────────────
//
// No quantity has a schema yet, so the specs and data below only show that an object travels as it is.

/** The smallest request: an empty spec and no engine options. */
export const REQUEST_MINIMAL = makeRequest({ caseId: SINGLET_CASE.id, quantity: "system.describe", spec: {} });

/** A spec that carries an array, and options for the engine the request goes to. */
export const REQUEST_WITH_OPTIONS = makeRequest({
  caseId: SINGLET_CASE.id,
  quantity: "rays.trace",
  spec: { line: 0, rays: encodeNdArray(Float64Array.of(0, 0, -10, 0, 0, 1, 0, 2.5, -10, 0, 0, 1), [2, 6]) },
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
  data: {
    valid: encodeNdArray(Uint8Array.of(1, 1)),
    hits: encodeNdArray(Float64Array.of(0, 0, 0, 0, 2.5, 0.0625), [2, 3]),
  },
  diagnostics: { warnings: [], counts: { rays: 2, clipped: 0 } },
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

/** An engine that supports every feature flag, states limits and answers two quantities. */
export const DESCRIPTOR_FULL = {
  contract: { min: "1.0", max: "1.2" },
  identity: {
    id: "example-engine",
    version: "2.4.1+build.20260101",
    fingerprint: sha256Hex("example engine sources"),
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

/** Every valid fixture written here: `valid/<kind>/<name>.json` holds exactly this value. */
export const VALID: Readonly<Record<ContractKind, Readonly<Record<string, unknown>>>> = {
  "optical-case": { singlet: SINGLET_CASE, "all-features": ALL_FEATURES_CASE },
  "run-spec": { minimal: RUN_SPEC_MINIMAL, "worked-example": RUN_SPEC_WORKED, "lv-lens-all-options": RUN_SPEC_LV },
  suite: { minimal: SUITE_MINIMAL, "worked-example": SUITE_WORKED },
  request: { minimal: REQUEST_MINIMAL, "with-engine-options": REQUEST_WITH_OPTIONS },
  result: { ok: RESULT_OK, unsupported: RESULT_UNSUPPORTED, error: RESULT_ERROR, pending: RESULT_PENDING },
  "engine-descriptor": { minimal: DESCRIPTOR_MINIMAL, full: DESCRIPTOR_FULL },
  "protocol-request": { hello: PROTOCOL_HELLO, run: PROTOCOL_RUN, shutdown: PROTOCOL_SHUTDOWN },
  "protocol-response": {
    hello: RESPONSE_HELLO,
    run: RESPONSE_RUN,
    shutdown: RESPONSE_SHUTDOWN,
    failure: RESPONSE_FAILURE,
  },
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
    "provenance-dirty-as-string": fault(ALL_FEATURES_CASE, "/provenance/lv/dirty", "no", "type"),
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
    "unsupported-empty": fault(RESULT_UNSUPPORTED, "/unsupported", [], "minItems"),
    "unsupported-unknown-code": fault(RESULT_UNSUPPORTED, "/unsupported/0/code", "version", "enum"),
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
};
