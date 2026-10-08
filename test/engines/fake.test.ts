import assert from "node:assert/strict";
import { test } from "node:test";

import type { EngineDescriptor } from "../../src/contract/engine.ts";
import { FEATURE_FLAGS } from "../../src/contract/features.ts";
import type { ProtocolRequest, ProtocolResponse } from "../../src/contract/protocol.ts";
import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { resultInvariantProblems } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { sha256Hex } from "../../src/core/numeric/hash.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { negotiate } from "../../src/core/negotiate.ts";
import { echoValues } from "../../src/engines/fake/echo.ts";
import { createEngine } from "../../src/engines/fake/engine.ts";
import { FAIL_MODES, FAKE_ENGINE_VERSION, fakeFingerprint, parseFakeOptions } from "../../src/engines/fake/options.ts";
import { selftestEchoQuantity } from "../../src/quantities/selftestEcho.ts";
import {
  ALL_FEATURES_CASE,
  REQUEST_MINIMAL,
  SELFTEST_ECHO_EXAMPLES,
  edited,
  f8FromBits,
  REMOVE,
} from "../contract/corpus.ts";
import {
  CASE,
  HELLO,
  bitsOf,
  echoRequest,
  echoRequestFor,
  echoedValues,
  runMessage,
  shutdownMessage,
} from "./support.ts";

/** The reply of a fake engine with these options to one message, checked to be a valid protocol response. */
async function ask(options: unknown, message: ProtocolRequest): Promise<ProtocolResponse> {
  const reply = await createEngine(options)(message);
  assert.deepEqual(validateKind("protocol-response", reply), []);
  assert.equal(reply.id, message.id);
  return reply;
}

async function describe(options: unknown): Promise<EngineDescriptor> {
  const reply = await ask(options, HELLO);
  assert.ok(reply.ok);
  assert.deepEqual(validateKind("engine-descriptor", reply.result), []);
  return reply.result as EngineDescriptor;
}

/** The result of a fake engine with these options for one request, checked to be a valid result that echoes it. */
async function run(options: unknown, request: QuantityRequest): Promise<ResultEnvelope> {
  const reply = await ask(options, runMessage(request));
  assert.ok(reply.ok);
  const result = reply.result as ResultEnvelope;
  assert.deepEqual(validateKind("result", result), []);
  assert.deepEqual(resultInvariantProblems(result), []);
  assert.equal(result.requestId, request.id);
  assert.equal(result.caseId, CASE.id);
  return result;
}

// ── Options ──────────────────────────────────────────────────────────────────────────────────────────────────────

test("only id is needed; the other options default to a well-behaved engine", () => {
  const options = parseFakeOptions({ id: "fake" });
  assert.deepEqual(options, {
    id: "fake",
    bias: 0,
    offersQuantities: true,
    failMode: "none",
    fingerprint: options.fingerprint,
  });
  assert.deepEqual(
    parseFakeOptions({ id: "fake-b", bias: -0.25, offersQuantities: false, failMode: "throw", fingerprint: "f" }),
    {
      id: "fake-b",
      bias: -0.25,
      offersQuantities: false,
      failMode: "throw",
      fingerprint: "f",
    },
  );
  assert.deepEqual([...FAIL_MODES], ["none", "protocol-error", "invalid-result", "wrong-request-id", "throw"]);
});

test("options that are not the fake engine's are an error naming the option, from parser and createEngine", () => {
  const idRule = 'option "id" must be an engine id: a lowercase letter, then lowercase letters, digits or "-"';
  const cases: [unknown, string][] = [
    [undefined, "options must be an object"],
    [null, "options must be an object"],
    ["fake", "options must be an object"],
    [[{ id: "fake" }], "options must be an object"],
    [{}, idRule],
    [{ id: "Fake" }, idRule],
    [{ id: "" }, idRule],
    [{ id: 7 }, idRule],
    [{ id: "fake", seed: 1 }, 'unknown option "seed" (it has bias, failMode, fingerprint, id, offersQuantities)'],
    [{ id: "fake", Bias: 1 }, 'unknown option "Bias" (it has bias, failMode, fingerprint, id, offersQuantities)'],
    [{ id: "fake", bias: "0.1" }, 'option "bias" must be a finite number'],
    [{ id: "fake", bias: null }, 'option "bias" must be a finite number'],
    [{ id: "fake", bias: NaN }, 'option "bias" must be a finite number'],
    [{ id: "fake", bias: Infinity }, 'option "bias" must be a finite number'],
    [{ id: "fake", offersQuantities: "no" }, 'option "offersQuantities" must be a boolean'],
    [{ id: "fake", offersQuantities: 0 }, 'option "offersQuantities" must be a boolean'],
    [
      { id: "fake", failMode: "explode" },
      'option "failMode" must be one of none, protocol-error, invalid-result, wrong-request-id, throw',
    ],
    [
      { id: "fake", failMode: true },
      'option "failMode" must be one of none, protocol-error, invalid-result, wrong-request-id, throw',
    ],
    [{ id: "fake", fingerprint: "" }, 'option "fingerprint" must be a non-empty string'],
    [{ id: "fake", fingerprint: 12 }, 'option "fingerprint" must be a non-empty string'],
  ];
  for (const [options, problem] of cases) {
    assert.throws(() => parseFakeOptions(options), { message: `fake engine: ${problem}` }, problem);
    assert.throws(() => createEngine(options), { message: `fake engine: ${problem}` }, problem);
  }
});

test("the fingerprint is derived from the options alone: equal options, equal fingerprint", () => {
  const base = parseFakeOptions({ id: "fake" });
  // Pinned, so that a fingerprint is the same in another process, on another machine and after a refactoring. It is
  // the SHA-256 of {"engine":"lvrtc-fake","options":{"bias":0,"failMode":"none","id":"fake","offersQuantities":true},
  // "version":"1"} written without the line break.
  assert.equal(base.fingerprint, "a721c5e1ffb4d2b4a7af65c1456d8ed68d1c5c1489d81591b4c213ff29c58795");
  assert.match(base.fingerprint, /^[0-9a-f]{64}$/);
  assert.equal(parseFakeOptions({ id: "fake" }).fingerprint, base.fingerprint);
  // Stating a default, or the options in another order, describes the same engine.
  assert.equal(
    parseFakeOptions({ failMode: "none", offersQuantities: true, bias: 0, id: "fake" }).fingerprint,
    base.fingerprint,
  );
  assert.equal(fakeFingerprint({ id: "fake", bias: 0, offersQuantities: true, failMode: "none" }), base.fingerprint);
  assert.equal(parseFakeOptions({ id: "fake", bias: -0 }).fingerprint, base.fingerprint);

  const others = [
    { id: "fake-b" },
    { id: "fake", bias: 1e-9 },
    { id: "fake", bias: -1e-9 },
    { id: "fake", offersQuantities: false },
    ...FAIL_MODES.filter((failMode) => failMode !== "none").map((failMode) => ({ id: "fake", failMode })),
  ].map((options) => parseFakeOptions(options).fingerprint);
  assert.equal(new Set([base.fingerprint, ...others]).size, others.length + 1);
});

test("a fingerprint that is given is the fingerprint, in the descriptor and on every result", async () => {
  const options = { id: "fake", fingerprint: "build 2026-01-01" };
  assert.equal(parseFakeOptions(options).fingerprint, "build 2026-01-01");
  assert.equal((await describe(options)).identity.fingerprint, "build 2026-01-01");
  assert.equal((await run(options, echoRequest(Float64Array.of(1)))).engine.fingerprint, "build 2026-01-01");
});

// ── hello and shutdown ───────────────────────────────────────────────────────────────────────────────────────────

test("hello describes an engine of this contract that supports every feature and offers selftest.echo", async () => {
  const options = parseFakeOptions({ id: "fake-a", bias: 0.5 });
  assert.deepEqual(await describe({ id: "fake-a", bias: 0.5 }), {
    contract: { min: CONTRACT_VERSION, max: CONTRACT_VERSION },
    identity: {
      id: "fake-a",
      version: FAKE_ENGINE_VERSION,
      fingerprint: options.fingerprint,
      details: { bias: 0.5, offersQuantities: true, failMode: "none" },
    },
    capabilities: {
      features: { supported: [...FEATURE_FLAGS], limits: {} },
      quantities: { "selftest.echo": { version: selftestEchoQuantity.version } },
      deterministic: true,
      maxConcurrency: 1,
    },
  });
});

test("the fake engine can be asked selftest.echo about any case, and nothing else", async () => {
  const descriptor = await describe({ id: "fake" });
  for (const opticalCase of [CASE, ALL_FEATURES_CASE]) {
    const request = makeRequest({ caseId: opticalCase.id, quantity: "selftest.echo", spec: {} });
    assert.deepEqual(negotiate(opticalCase, request, descriptor), []);
  }
  assert.deepEqual(
    negotiate(CASE, REQUEST_MINIMAL, descriptor).map(({ code, item }) => [code, item]),
    [["quantity", "system.describe"]],
  );
});

test("shutdown is answered with an empty object, and the engine goes on answering", async () => {
  const engine = createEngine({ id: "fake" });
  const bye = await engine(shutdownMessage("3"));
  assert.deepEqual(bye, { contract: CONTRACT_VERSION, id: "3", ok: true, result: {} });
  assert.equal((await engine({ ...HELLO, id: "4" })).ok, true);
});

// ── selftest.echo ────────────────────────────────────────────────────────────────────────────────────────────────

test("the fake engine answers every conformance example as the contract states, byte for byte", async () => {
  for (const [name, { spec, data }] of Object.entries(SELFTEST_ECHO_EXAMPLES)) {
    const result = await run({ id: "fake" }, echoRequestFor(spec));
    assert.equal(result.status, "ok", name);
    assert.deepEqual(result.data, data, name);
    assert.deepEqual(selftestEchoQuantity.validateData(result.data), [], name);
  }
});

test("an ok result says who answered, how, and how many values", async () => {
  const { fingerprint } = parseFakeOptions({ id: "fake" });
  const request = echoRequest(Float64Array.of(1, 2, 3), 2);
  const result = await run({ id: "fake" }, request);
  assert.deepEqual(result, {
    contract: CONTRACT_VERSION,
    kind: "result",
    requestId: request.id,
    caseId: CASE.id,
    engine: { id: "fake", fingerprint, details: { bias: 0, offersQuantities: true, failMode: "none" } },
    status: "ok",
    method: { name: "fake-echo", params: { bias: 0 } },
    data: { values: encodeNdArray(Float64Array.of(2, 4, 6)), sum: 12 },
    diagnostics: { warnings: [], counts: { values: 3 } },
  });
  assert.deepEqual([...echoedValues(result)], [2, 4, 6]);
});

test("with scale 1 every element comes back bit for bit: NaN payloads, -0, infinities, subnormals", () => {
  const values = f8FromBits(
    0x7ff8_0000_dead_beefn,
    0x7ff0_0000_0000_0001n,
    0xfff8_0000_0000_0123n,
    0xffff_ffff_ffff_ffffn,
    0x8000_0000_0000_0000n,
    0x7ff0_0000_0000_0000n,
    0xfff0_0000_0000_0000n,
    0x0000_0000_0000_0001n,
    0x800f_ffff_ffff_ffffn,
    0x0010_0000_0000_0000n,
    0x7fef_ffff_ffff_ffffn,
    0x3fb9_9999_9999_999an,
  );
  const echoed = echoValues(values, 1);
  assert.deepEqual(bitsOf(echoed.values), bitsOf(values));
  assert.equal(echoed.sum, null);
  assert.notEqual(echoed.values, values);
  assert.notEqual(echoed.values.buffer, values.buffer);
});

test("a NaN is copied whatever the scale, and a NaN the multiplication makes is the quiet NaN without payload", () => {
  const nan = 0xfff4_0000_0000_0042n;
  for (const scale of [0, 1, -1, 2.5, 1e300, -0]) {
    const echoed = echoValues(f8FromBits(nan, 0x7ff0_0000_0000_0000n, 0xfff0_0000_0000_0000n), scale);
    const infinities =
      scale === 0
        ? [0x7ff8_0000_0000_0000n, 0x7ff8_0000_0000_0000n]
        : bitsOf(Float64Array.of(Infinity * scale, -Infinity * scale));
    assert.deepEqual(bitsOf(echoed.values), [nan, ...infinities], String(scale));
    assert.equal(echoed.sum, null);
  }
});

test("each element is one multiplication, and the sum a plain running sum from 0", () => {
  const values = Float64Array.of(0.1, 0.2, 0.3, -0, 1e-320, 1e308);
  for (const scale of [3, -0.1, 1e-10, 10]) {
    const echoed = echoValues(values, scale);
    let sum = 0;
    values.forEach((value, index) => {
      assert.equal(Object.is(echoed.values[index], value * scale), true, `${value} * ${scale}`);
      sum += value * scale;
    });
    assert.equal(echoed.sum, Number.isFinite(sum) ? sum : null, String(scale));
  }
  // 0.1 + 0.2 + 0.3 is 0.6000000000000001 summed left to right; an exactly rounded sum would be 0.6.
  assert.equal(echoValues(Float64Array.of(0.1, 0.2, 0.3), 1).sum, 0.6000000000000001);
  assert.equal(echoValues(new Float64Array(0), 5).sum, 0);
  // The sum of -0 alone is the 0 the sum starts from.
  assert.equal(Object.is(echoValues(Float64Array.of(-0), 1).sum, 0), true);
  assert.equal(echoValues(Float64Array.of(Infinity, -Infinity), 1).sum, null);
  assert.equal(echoValues(Float64Array.of(1e308, 1e308), 1).sum, null);
});

test("echoValues reads a view where the view is, and leaves its input alone", () => {
  const backing = Float64Array.of(100, 1, -0, NaN, 200);
  const view = backing.subarray(1, 4);
  const before = bitsOf(backing);
  const echoed = echoValues(view, 2);
  assert.deepEqual(bitsOf(echoed.values), bitsOf(Float64Array.of(2, -0, NaN)));
  assert.equal(echoed.values.length, 3);
  assert.deepEqual(bitsOf(backing), before);
});

test("a bias is added to every value that is not a NaN, so a biased fake differs from an unbiased one", async () => {
  const values = f8FromBits(
    0x3ff0_0000_0000_0000n,
    0x8000_0000_0000_0000n,
    0x7ff8_0000_dead_beefn,
    0x4000_0000_0000_0000n,
  );
  const request = echoRequest(values, 3);
  const plain = await run({ id: "fake" }, request);
  const biased = await run({ id: "fake", bias: 0.25 }, request);
  assert.deepEqual(
    bitsOf(echoedValues(plain)),
    bitsOf(f8FromBits(0x4008_0000_0000_0000n, 0x8000_0000_0000_0000n, 0x7ff8_0000_dead_beefn, 0x4018_0000_0000_0000n)),
  );
  assert.deepEqual(
    bitsOf(echoedValues(biased)),
    bitsOf(f8FromBits(0x400a_0000_0000_0000n, 0x3fd0_0000_0000_0000n, 0x7ff8_0000_dead_beefn, 0x4019_0000_0000_0000n)),
  );
  assert.deepEqual(biased.method, { name: "fake-echo", params: { bias: 0.25 } });
  assert.notEqual(biased.engine.fingerprint, plain.engine.fingerprint);

  // Without a NaN in the way the sum moves by the bias times the number of values.
  const sums = await Promise.all(
    [0, 0.5].map(async (bias) => (await run({ id: "fake", bias }, echoRequest(Float64Array.of(1, 2, 3), 1))).data?.sum),
  );
  assert.deepEqual(sums, [6, 7.5]);
});

test("the shape of the values is the shape of the answer", async () => {
  for (const shape of [[6], [2, 3], [3, 2], [1, 1, 6], [6, 1]]) {
    const result = await run({ id: "fake" }, echoRequest(Float64Array.of(1, 2, 3, 4, 5, 6), 1, shape));
    assert.deepEqual((result.data as { values: { $nd: { shape: number[] } } }).values.$nd.shape, shape);
  }
});

test("a quantity the fake does not answer, and every quantity of a fake that offers none, is unsupported", async () => {
  const other = await run({ id: "fake" }, REQUEST_MINIMAL);
  assert.equal(other.status, "unsupported");
  assert.deepEqual(other.unsupported, [
    { code: "quantity", item: "system.describe", message: "the fake engine does not offer system.describe" },
  ]);
  assert.equal(Object.hasOwn(other, "data"), false);

  const none = { id: "fake-none", offersQuantities: false };
  assert.deepEqual((await describe(none)).capabilities.quantities, {});
  const refused = await run(none, echoRequest(Float64Array.of(1)));
  assert.equal(refused.status, "unsupported");
  assert.deepEqual(refused.unsupported, [
    { code: "quantity", item: "selftest.echo", message: "the fake engine does not offer selftest.echo" },
  ]);
});

test("a spec that is no selftest.echo spec, or whose array does not decode, is a result of status error", async () => {
  const { spec } = SELFTEST_ECHO_EXAMPLES.matrix;
  const request = (edit: unknown): QuantityRequest =>
    makeRequest({ caseId: CASE.id, quantity: "selftest.echo", spec: edit as Record<string, unknown> });

  const noScale = await run({ id: "fake" }, request(edited(spec, "/scale", REMOVE)));
  assert.equal(noScale.status, "error");
  assert.deepEqual(noScale.error, {
    code: "bad-spec",
    message: 'spec is not a selftest.echo spec: (root) [required] missing property "scale"',
  });

  const wrongDigest = await run({ id: "fake" }, request(edited(spec, "/values/$nd/sha256", sha256Hex("other bytes"))));
  assert.equal(wrongDigest.error?.code, "bad-spec");
  assert.match(wrongDigest.error?.message ?? "", /^spec\.values does not decode: ndarray: sha256 mismatch/);

  const wrongLength = await run({ id: "fake" }, request(edited(spec, "/values/$nd/shape", [7])));
  assert.equal(wrongLength.error?.code, "bad-spec");
  assert.match(wrongLength.error?.message ?? "", /^spec\.values does not decode: ndarray: data is 48 bytes but shape/);
});

test("a message the fake cannot handle at all is refused, as any engine behind the protocol refuses it", async () => {
  const message = edited(runMessage(echoRequest(Float64Array.of(1))), "/params/case/system/stopIndex", "0");
  const reply = await ask({ id: "fake" }, message as ProtocolRequest);
  assert.equal(reply.ok, false);
  assert.equal((reply as Extract<ProtocolResponse, { ok: false }>).error.code, "bad-request");
});

// ── Misbehaviour on demand ───────────────────────────────────────────────────────────────────────────────────────

test("every failMode leaves hello and shutdown as they are", async () => {
  for (const failMode of FAIL_MODES) {
    const descriptor = await describe({ id: "fake", failMode });
    assert.equal(descriptor.identity.details.failMode, failMode);
    assert.deepEqual(descriptor.capabilities.quantities, { "selftest.echo": { version: 1 } });
    const bye = await ask({ id: "fake", failMode }, shutdownMessage());
    assert.deepEqual(bye, { contract: CONTRACT_VERSION, id: "1", ok: true, result: {} });
  }
});

test("failMode protocol-error answers a run with ok: false", async () => {
  const reply = await ask({ id: "fake", failMode: "protocol-error" }, runMessage(echoRequest(Float64Array.of(1)), "8"));
  assert.deepEqual(reply, {
    contract: CONTRACT_VERSION,
    id: "8",
    ok: false,
    error: { code: "fake-failure", message: "the fake engine is set to fail (failMode protocol-error)" },
  });
});

test("failMode invalid-result answers a run with a result that lacks its diagnostics", async () => {
  const request = echoRequest(Float64Array.of(1, 2));
  const reply = await createEngine({ id: "fake", failMode: "invalid-result", fingerprint: "f" })(runMessage(request));
  assert.ok(reply.ok);
  // As a whole message it is no protocol response either: its result is none of the three a response may carry.
  assert.equal(validateKind("protocol-response", reply).length, 1);
  assert.deepEqual(
    validateKind("result", reply.result).map(({ path, keyword }) => [path, keyword]),
    [["", "required"]],
  );
  // Everything else about it is the answer a well-behaved fake gives.
  const { diagnostics, ...proper } = await run({ id: "fake", fingerprint: "f" }, request);
  assert.deepEqual(diagnostics, { warnings: [], counts: { values: 2 } });
  const details = { ...proper.engine.details, failMode: "invalid-result" };
  assert.deepEqual(reply.result, { ...proper, engine: { ...proper.engine, details } });
});

test("failMode wrong-request-id answers a run with a valid result about another request", async () => {
  const request = echoRequest(Float64Array.of(1, 2));
  const reply = await createEngine({ id: "fake", failMode: "wrong-request-id" })(runMessage(request));
  assert.ok(reply.ok);
  const result = reply.result as ResultEnvelope;
  assert.deepEqual(validateKind("result", result), []);
  assert.deepEqual(resultInvariantProblems(result), []);
  assert.equal(result.status, "ok");
  assert.notEqual(result.requestId, request.id);
  assert.equal(result.requestId, sha256Hex(request.id));
  assert.equal(result.caseId, CASE.id);
});

test("failMode throw makes the handler throw on a run, at once", () => {
  const engine = createEngine({ id: "fake", failMode: "throw" });
  assert.throws(() => engine(runMessage(echoRequest(Float64Array.of(1)))), {
    message: "the fake engine is set to fail (failMode throw)",
  });
});
