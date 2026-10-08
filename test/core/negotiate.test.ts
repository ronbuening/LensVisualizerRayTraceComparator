import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../src/contract/case.ts";
import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { FEATURE_FLAGS, FEATURE_LIMITS, deriveFeatures } from "../../src/contract/features.ts";
import { deepFreeze } from "../../src/contract/json.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { UnsupportedItem } from "../../src/contract/result.ts";
import { negotiate } from "../../src/core/negotiate.ts";
import {
  ALL_FEATURES_CASE,
  DESCRIPTOR_FULL,
  DESCRIPTOR_MINIMAL,
  REQUEST_MINIMAL,
  REQUEST_WITH_OPTIONS,
  SINGLET_CASE,
  edited,
} from "../contract/corpus.ts";

/** A request for `rays.trace` about a case. */
function requestAbout(opticalCase: OpticalCase, quantity: string = "rays.trace"): QuantityRequest {
  return makeRequest({ caseId: opticalCase.id, quantity, spec: {} });
}

/** An engine that speaks contract 1.0 to 1.2, supports every feature without limits and answers `rays.trace`. */
const CAPABLE: EngineDescriptor = {
  contract: { min: "1.0", max: "1.2" },
  identity: DESCRIPTOR_FULL.identity,
  capabilities: {
    features: { supported: [...FEATURE_FLAGS], limits: {} },
    quantities: { "rays.trace": { version: 1 } },
    deterministic: true,
    maxConcurrency: 1,
  },
};

/** `CAPABLE` with one member replaced; see `edited`. */
function engineWith(pointer: string, replacement: unknown): EngineDescriptor {
  return edited(CAPABLE, pointer, replacement) as EngineDescriptor;
}

function found(items: readonly UnsupportedItem[]): [string, string][] {
  return items.map(({ code, item }) => [code, item]);
}

const HARD = ALL_FEATURES_CASE;
const HARD_REQUEST = requestAbout(HARD);

test("the every-feature case needs every flag and these limits", () => {
  assert.deepEqual(HARD.features, [...FEATURE_FLAGS]);
  assert.deepEqual(deriveFeatures(HARD.system, HARD.conditions).limits, {
    "asphere.maxPower": 6,
    "lines.count": 2,
    "surfaces.count": 7,
  });
  assert.deepEqual(SINGLET_CASE.features, []);
});

test("an engine that offers the quantity and supports what the case has can be asked: nothing is listed", () => {
  assert.deepEqual(negotiate(SINGLET_CASE, requestAbout(SINGLET_CASE), CAPABLE), []);
  assert.deepEqual(negotiate(HARD, HARD_REQUEST, CAPABLE), []);
  // The corpus's own example engine and request.
  assert.deepEqual(negotiate(SINGLET_CASE, REQUEST_WITH_OPTIONS, DESCRIPTOR_FULL), []);
});

test("a quantity the engine does not offer is listed by its id", () => {
  const cases: [QuantityRequest, EngineDescriptor][] = [
    [requestAbout(SINGLET_CASE, "mtf.native"), CAPABLE],
    [requestAbout(SINGLET_CASE, "rays.trace-2"), CAPABLE],
    [requestAbout(SINGLET_CASE), engineWith("/capabilities/quantities", {})],
    [requestAbout(SINGLET_CASE), engineWith("/capabilities/quantities", { "rays.tracer": { version: 1 } })],
  ];
  for (const [request, descriptor] of cases) {
    assert.deepEqual(negotiate(SINGLET_CASE, request, descriptor), [
      { code: "quantity", item: request.quantity, message: `the engine does not offer ${request.quantity}` },
    ]);
  }
  // Which version of the quantity the engine implements is not negotiated here.
  assert.deepEqual(
    negotiate(SINGLET_CASE, requestAbout(SINGLET_CASE), engineWith("/capabilities/quantities/rays.trace/version", 9)),
    [],
  );
});

test("each feature flag of the case that the engine does not support is listed, in the case's order", () => {
  for (const flag of FEATURE_FLAGS) {
    const supported = FEATURE_FLAGS.filter((other) => other !== flag);
    const descriptor = engineWith("/capabilities/features/supported", supported);
    assert.deepEqual(negotiate(HARD, HARD_REQUEST, descriptor), [
      { code: "feature", item: flag, message: `the engine does not support ${flag}` },
    ]);
    // A case without the flag does not need it.
    assert.deepEqual(negotiate(SINGLET_CASE, requestAbout(SINGLET_CASE), descriptor), []);
  }

  const few = engineWith("/capabilities/features/supported", ["surface.conic", "aperture.annular", "not.a.flag"]);
  assert.deepEqual(found(negotiate(HARD, HARD_REQUEST, few)), [
    ["feature", "lines.multiple"],
    ["feature", "object.finite"],
    ["feature", "surface.asphere.even"],
    ["feature", "surface.asphere.flat-base"],
    ["feature", "surface.asphere.odd"],
  ]);
  const none = engineWith("/capabilities/features/supported", []);
  assert.deepEqual(
    found(negotiate(HARD, HARD_REQUEST, none)),
    FEATURE_FLAGS.map((flag) => ["feature", flag]),
  );
});

test("a limit is listed when the case needs more than the engine declares, with the limit and both numbers", () => {
  const cases: [Record<string, number>, UnsupportedItem[]][] = [
    // Equal to the limit is within it.
    [{ "asphere.maxPower": 6, "lines.count": 2, "surfaces.count": 7 }, []],
    [{ "asphere.maxPower": 20, "lines.count": 100, "surfaces.count": 1000 }, []],
    [
      { "asphere.maxPower": 5 },
      [
        {
          code: "feature",
          item: "asphere.maxPower",
          message: "the case needs asphere.maxPower 6; the engine handles at most 5",
        },
      ],
    ],
    [
      { "lines.count": 1 },
      [{ code: "feature", item: "lines.count", message: "the case needs lines.count 2; the engine handles at most 1" }],
    ],
    [
      { "surfaces.count": 6.5 },
      [
        {
          code: "feature",
          item: "surfaces.count",
          message: "the case needs surfaces.count 7; the engine handles at most 6.5",
        },
      ],
    ],
    // A limit this code does not know is the engine's own business.
    [{ "rays.count": 0, "asphere.maxPower": 6 }, []],
  ];
  for (const [limits, expected] of cases) {
    const descriptor = engineWith("/capabilities/features/limits", limits);
    assert.deepEqual(negotiate(HARD, HARD_REQUEST, descriptor), expected, JSON.stringify(limits));
  }
});

test("limits are listed in a fixed order, whatever order the engine wrote them in", () => {
  const descriptor = engineWith("/capabilities/features/limits", {
    "surfaces.count": 1,
    "lines.count": 1,
    "asphere.maxPower": 0,
  });
  assert.deepEqual(
    found(negotiate(HARD, HARD_REQUEST, descriptor)),
    FEATURE_LIMITS.map((limit) => ["feature", limit]),
  );
  // The singlet has no asphere: it needs a maximum power of 0, which a limit of 0 allows.
  assert.deepEqual(found(negotiate(SINGLET_CASE, requestAbout(SINGLET_CASE), descriptor)), [
    ["feature", "surfaces.count"],
  ]);
});

test("a contract version outside the range the engine speaks is listed, naming the range and the document", () => {
  const cases: [{ min: string; max: string }, UnsupportedItem[]][] = [
    [{ min: "1.0", max: "1.0" }, []],
    [{ min: "0.9", max: "1.0" }, []],
    [{ min: "0.1", max: "3.0" }, []],
    [
      { min: "1.1", max: "1.2" },
      [
        {
          code: "contract",
          item: "1.0",
          message: "the engine speaks contract 1.1 to 1.2; the case and the request are written to 1.0",
        },
      ],
    ],
    [
      { min: "2.0", max: "2.4" },
      [
        {
          code: "contract",
          item: "1.0",
          message: "the engine speaks contract 2.0 to 2.4; the case and the request are written to 1.0",
        },
      ],
    ],
    [
      { min: "0.1", max: "0.9" },
      [
        {
          code: "contract",
          item: "1.0",
          message: "the engine speaks contract 0.1 to 0.9; the case and the request are written to 1.0",
        },
      ],
    ],
    // A range that holds nothing.
    [
      { min: "1.2", max: "1.0" },
      [
        {
          code: "contract",
          item: "1.0",
          message: "the engine speaks contract 1.2 to 1.0; the case and the request are written to 1.0",
        },
      ],
    ],
  ];
  for (const [contract, expected] of cases) {
    const descriptor = engineWith("/contract", contract);
    assert.deepEqual(
      negotiate(SINGLET_CASE, requestAbout(SINGLET_CASE), descriptor),
      expected,
      JSON.stringify(contract),
    );
  }
});

test("the case and the request are judged by the version each is written to", () => {
  const newerCase = edited(SINGLET_CASE, "/contract", "1.3") as OpticalCase;
  const newerRequest = edited(requestAbout(SINGLET_CASE), "/contract", "1.4") as QuantityRequest;
  const request = requestAbout(SINGLET_CASE);

  assert.deepEqual(negotiate(newerCase, request, CAPABLE), [
    { code: "contract", item: "1.3", message: "the engine speaks contract 1.0 to 1.2; the case is written to 1.3" },
  ]);
  assert.deepEqual(negotiate(SINGLET_CASE, newerRequest, CAPABLE), [
    { code: "contract", item: "1.4", message: "the engine speaks contract 1.0 to 1.2; the request is written to 1.4" },
  ]);
  // Two versions, two items, the case's first.
  assert.deepEqual(found(negotiate(newerCase, newerRequest, CAPABLE)), [
    ["contract", "1.3"],
    ["contract", "1.4"],
  ]);
  assert.deepEqual(found(negotiate(newerCase, newerRequest, engineWith("/contract", { min: "1.3", max: "1.3" }))), [
    ["contract", "1.4"],
  ]);
  assert.deepEqual(negotiate(newerCase, newerRequest, engineWith("/contract", { min: "1.0", max: "1.4" })), []);
});

test("everything is listed at once, in a fixed order: contract, quantity, flags, limits", () => {
  const descriptor: EngineDescriptor = {
    ...DESCRIPTOR_MINIMAL,
    contract: { min: "2.0", max: "2.0" },
    capabilities: {
      ...DESCRIPTOR_MINIMAL.capabilities,
      features: { supported: ["surface.conic"], limits: { "surfaces.count": 3, "asphere.maxPower": 4 } },
    },
  };
  const expected: [string, string][] = [
    ["contract", "1.0"],
    ["quantity", "rays.trace"],
    ["feature", "aperture.annular"],
    ["feature", "lines.multiple"],
    ["feature", "object.finite"],
    ["feature", "surface.asphere.even"],
    ["feature", "surface.asphere.flat-base"],
    ["feature", "surface.asphere.odd"],
    ["feature", "asphere.maxPower"],
    ["feature", "surfaces.count"],
  ];
  const first = negotiate(HARD, HARD_REQUEST, descriptor);
  assert.deepEqual(found(first), expected);
  // The same arguments give the same list, as a fresh one.
  const second = negotiate(HARD, HARD_REQUEST, descriptor);
  assert.deepEqual(second, first);
  assert.notEqual(second, first);
});

test("an engine that can do nothing is asked for nothing: the minimal descriptor refuses by quantity alone", () => {
  assert.deepEqual(found(negotiate(SINGLET_CASE, REQUEST_MINIMAL, DESCRIPTOR_MINIMAL)), [
    ["quantity", "system.describe"],
  ]);
});

test("negotiation reads its arguments and changes none: frozen ones are fine", () => {
  const descriptor = deepFreeze(structuredClone(engineWith("/capabilities/features/supported", [])));
  const before = JSON.stringify([HARD, HARD_REQUEST, descriptor]);
  assert.ok(Object.isFrozen(HARD) && Object.isFrozen(HARD_REQUEST));
  assert.equal(negotiate(HARD, HARD_REQUEST, descriptor).length, FEATURE_FLAGS.length);
  assert.equal(JSON.stringify([HARD, HARD_REQUEST, descriptor]), before);
});

test("what negotiation lists is what an unsupported result carries", () => {
  const descriptor = engineWith("/capabilities/features/limits", { "lines.count": 1 });
  const items = negotiate(HARD, requestAbout(HARD, "mtf.native"), engineWith("/contract", { min: "2.0", max: "2.0" }));
  const all = [...items, ...negotiate(HARD, HARD_REQUEST, descriptor)];
  assert.deepEqual(found(all), [
    ["contract", "1.0"],
    ["quantity", "mtf.native"],
    ["feature", "lines.count"],
  ]);
  const engine = { id: "example-engine", fingerprint: "f", details: {} };
  const result = makeResult(HARD_REQUEST, engine, { status: "unsupported", unsupported: all });
  assert.deepEqual(result.unsupported, all);
});
