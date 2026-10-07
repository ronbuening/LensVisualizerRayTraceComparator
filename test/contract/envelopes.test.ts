// Requests, results and protocol messages: what code guarantees about them beyond their schemas.
import assert from "node:assert/strict";
import { test } from "node:test";

import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { deepFreeze } from "../../src/contract/json.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { resultInvariantProblems } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import {
  PROTOCOL_RUN,
  REQUEST_MINIMAL,
  REQUEST_WITH_OPTIONS,
  RESPONSE_HELLO,
  RESPONSE_RUN,
  RESULT_ERROR,
  RESULT_OK,
  RESULT_PENDING,
  RESULT_UNSUPPORTED,
  SINGLET_CASE,
  edited,
  REMOVE,
} from "./corpus.ts";

const CASE_ID = SINGLET_CASE.id;

// ── makeRequest ──────────────────────────────────────────────────────────────────────────────────────────────────

test("makeRequest adds the contract version, the kind and the id", () => {
  const request = makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: { line: 0 } });
  assert.deepEqual(request, {
    contract: CONTRACT_VERSION,
    kind: "request",
    id: request.id,
    caseId: CASE_ID,
    quantity: "rays.trace",
    spec: { line: 0 },
  });
  assert.deepEqual(Object.keys(request), ["contract", "kind", "id", "caseId", "quantity", "spec"]);
  assert.deepEqual(validateKind("request", request), []);
});

test("a request's id hashes the canonical JSON of caseId, quantity and spec", () => {
  const spec = { line: 0, grid: [1, 2, 3], nested: { b: true, a: null } };
  const request = makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec });
  assert.equal(request.id, sha256Hex(canonicalJson({ caseId: CASE_ID, quantity: "rays.trace", spec })));
  // Python: sha256 of json.dumps({"caseId": ..., "quantity": ..., "spec": ...}, sort_keys=True, separators=(",", ":")).
  assert.equal(REQUEST_WITH_OPTIONS.id, "be3888b6ee00068df5059d6f2e33e8a48e1525efaa29d2090a32c4605c77c81b");
});

test("a request's id does not depend on key order, and changes with each part it covers", () => {
  const base = makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: { a: 1, b: { c: 2, d: 3 } } });
  const reordered = makeRequest({ spec: { b: { d: 3, c: 2 }, a: 1 }, quantity: "rays.trace", caseId: CASE_ID });
  assert.equal(reordered.id, base.id);

  const others = [
    makeRequest({ caseId: "0".repeat(64), quantity: "rays.trace", spec: { a: 1, b: { c: 2, d: 3 } } }),
    makeRequest({ caseId: CASE_ID, quantity: "rays.trace-2", spec: { a: 1, b: { c: 2, d: 3 } } }),
    makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: { a: 1, b: { c: 2, d: 4 } } }),
    makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: { a: 1, b: { c: 2, d: 3 }, e: null } }),
    makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: {} }),
  ];
  assert.equal(new Set([base.id, ...others.map((request) => request.id)]).size, others.length + 1);
});

test("engine options travel with a request and are not part of its id", () => {
  const parts = { caseId: CASE_ID, quantity: "mtf.native", spec: { frequenciesPerMm: [10, 30] } };
  const plain = makeRequest(parts);
  const tuned = makeRequest({ ...parts, engineOptions: { numRays: 512 } });
  assert.equal(tuned.id, plain.id);
  assert.deepEqual(tuned.engineOptions, { numRays: 512 });
  assert.equal(Object.hasOwn(plain, "engineOptions"), false);
  assert.equal(Object.hasOwn(makeRequest({ ...parts, engineOptions: undefined }), "engineOptions"), false);
});

test("makeRequest returns a frozen copy of its parts", () => {
  const spec = { grid: [1, 2, 3], nested: { on: true } };
  const engineOptions = { numRays: 512 };
  const request = makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec, engineOptions });
  assert.ok(Object.isFrozen(request) && Object.isFrozen(request.spec) && Object.isFrozen(request.engineOptions));
  assert.ok(
    Object.isFrozen((request.spec as typeof spec).grid) && Object.isFrozen((request.spec as typeof spec).nested),
  );
  assert.ok(!Object.isFrozen(spec) && !Object.isFrozen(spec.grid) && !Object.isFrozen(engineOptions));
  spec.grid.push(4);
  engineOptions.numRays = 1;
  assert.deepEqual(request.spec, { grid: [1, 2, 3], nested: { on: true } });
  assert.deepEqual(request.engineOptions, { numRays: 512 });
});

test("makeRequest refuses parts that do not make a valid request", () => {
  const spec = {};
  assert.throws(() => makeRequest({ caseId: CASE_ID, quantity: "rays", spec }), {
    message: "contract: not a valid request: /quantity [pattern] must match ^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)+$",
  });
  assert.throws(
    () => makeRequest({ caseId: "not-a-hash", quantity: "rays.trace", spec }),
    /not a valid request: \/caseId \[pattern\]/,
  );
  assert.throws(
    () => makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: [] as unknown as Record<string, unknown> }),
    /not a valid request: \/spec \[type\] expected object, got array/,
  );
  // A number JSON cannot carry has no canonical form, so it is refused before there is an id to validate.
  assert.throws(
    () => makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec: { tolerance: NaN } }),
    /canonicalJson: non-finite number NaN at \$\.spec\.tolerance/,
  );
  assert.throws(
    () => makeRequest({ caseId: CASE_ID, quantity: "rays.trace", spec, engineOptions: { scale: Infinity } }),
    /not a valid request: \/engineOptions\/scale \[finite\]/,
  );
});

// ── Result status rules ──────────────────────────────────────────────────────────────────────────────────────────

/** The given result with one member edited; see `edited`. */
function resultWith(base: ResultEnvelope, pointer: string, replacement: unknown): ResultEnvelope {
  return edited(base, pointer, replacement) as ResultEnvelope;
}

test("the example results keep the status rules", () => {
  for (const result of [RESULT_OK, RESULT_UNSUPPORTED, RESULT_ERROR, RESULT_PENDING]) {
    assert.deepEqual(resultInvariantProblems(result), [], result.status);
  }
});

test('status "ok" needs data', () => {
  const withoutData = resultWith(RESULT_OK, "/data", REMOVE);
  assert.deepEqual(validateKind("result", withoutData), []);
  assert.deepEqual(resultInvariantProblems(withoutData), ['status "ok" needs data']);
  assert.deepEqual(resultInvariantProblems(resultWith(RESULT_OK, "/data", {})), []);
});

test('status "unsupported" needs a non-empty unsupported list', () => {
  const problem = ['status "unsupported" needs a non-empty unsupported list'];
  const withoutList = resultWith(RESULT_UNSUPPORTED, "/unsupported", REMOVE);
  assert.deepEqual(validateKind("result", withoutList), []);
  assert.deepEqual(resultInvariantProblems(withoutList), problem);
  assert.deepEqual(resultInvariantProblems(resultWith(RESULT_UNSUPPORTED, "/unsupported", [])), problem);
});

test('status "error" needs error', () => {
  const withoutError = resultWith(RESULT_ERROR, "/error", REMOVE);
  assert.deepEqual(validateKind("result", withoutError), []);
  assert.deepEqual(resultInvariantProblems(withoutError), ['status "error" needs error']);
});

test('status "pending" needs nothing more', () => {
  assert.deepEqual(Object.keys(RESULT_PENDING).sort(), [
    "caseId",
    "contract",
    "diagnostics",
    "engine",
    "kind",
    "requestId",
    "status",
  ]);
  assert.deepEqual(resultInvariantProblems(RESULT_PENDING), []);
});

test("the status decides which rule applies, not which members are present", () => {
  // A result relabelled with another status has that status's member missing.
  assert.deepEqual(resultInvariantProblems(resultWith(RESULT_OK, "/status", "error")), ['status "error" needs error']);
  assert.deepEqual(resultInvariantProblems(resultWith(RESULT_ERROR, "/status", "ok")), ['status "ok" needs data']);
  assert.deepEqual(resultInvariantProblems(resultWith(RESULT_OK, "/status", "unsupported")), [
    'status "unsupported" needs a non-empty unsupported list',
  ]);
  // Members beyond what a status needs are allowed: an ok result may still say what it could not do.
  const partial = resultWith(RESULT_OK, "/unsupported", RESULT_UNSUPPORTED.unsupported);
  assert.deepEqual(validateKind("result", partial), []);
  assert.deepEqual(resultInvariantProblems(partial), []);
});

// ── Examples hang together ───────────────────────────────────────────────────────────────────────────────────────

test("the example result answers the example request about the example case", () => {
  assert.equal(RESULT_OK.requestId, REQUEST_WITH_OPTIONS.id);
  assert.equal(RESULT_OK.caseId, REQUEST_WITH_OPTIONS.caseId);
  assert.equal(REQUEST_WITH_OPTIONS.caseId, SINGLET_CASE.id);
  assert.equal(REQUEST_MINIMAL.caseId, SINGLET_CASE.id);
});

test("a run message carries the request and the whole case it is about, and the responses echo the ids", () => {
  assert.equal(PROTOCOL_RUN.params.request.caseId, PROTOCOL_RUN.params.case.id);
  assert.deepEqual(PROTOCOL_RUN.params.case, SINGLET_CASE);
  assert.equal(RESPONSE_RUN.id, PROTOCOL_RUN.id);
  assert.equal(RESPONSE_RUN.result.requestId, PROTOCOL_RUN.params.request.id);
  assert.equal(RESPONSE_HELLO.result.identity.id, "example-engine");
});

test("a protocol message that carries an invalid case is itself invalid", () => {
  const tampered = edited(PROTOCOL_RUN, "/params/case/system/surfaces/0/aperture/semiDiameter", -1);
  const issues = validateKind("protocol-request", tampered);
  assert.deepEqual(
    issues.map(({ path, keyword }) => [path, keyword]),
    [["", "oneOf"]],
  );
  // The message says where inside the alternative the fault is.
  assert.match(issues[0].message, /\[1\] \/params\/case\/system\/surfaces\/0\/aperture\/semiDiameter exclusiveMinimum/);
});

test("deepFreeze freezes every depth and returns its argument", () => {
  const value = { a: [{ b: 1 }], c: { d: [] as number[] } };
  assert.equal(deepFreeze(value), value);
  assert.ok(Object.isFrozen(value) && Object.isFrozen(value.a) && Object.isFrozen(value.a[0]));
  assert.ok(Object.isFrozen(value.c) && Object.isFrozen(value.c.d));
  for (const primitive of [1, "a", null, undefined, true]) assert.equal(deepFreeze(primitive), primitive);
  // An object frozen from outside is still descended into.
  const shallow = Object.freeze({ inner: { n: 1 } });
  assert.ok(Object.isFrozen(deepFreeze(shallow).inner));
});
