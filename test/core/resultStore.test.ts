import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { makeRequest } from "../../src/contract/request.ts";
import type { QuantityRequest } from "../../src/contract/request.ts";
import { makeResult } from "../../src/contract/result.ts";
import type { ResultEnvelope } from "../../src/contract/result.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { STORED_STATUSES, createResultStore, isStorable, storeKey } from "../../src/core/resultStore.ts";
import type { ResultStore, StoreLookup } from "../../src/core/resultStore.ts";
import { echoValues } from "../../src/engines/fake/echo.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { SELFTEST_ECHO_EXAMPLES } from "../contract/corpus.ts";
import { CASE, echoRequest, echoRequestFor } from "../engines/support.ts";
import { tempDir } from "./support.ts";

const ENGINE = { id: "fake-a", fingerprint: "f".repeat(64), details: { bias: 0 } } as const;
const VALUES = Float64Array.of(1, 2, 3);
const REQUEST = echoRequest(VALUES, 2);

/** The "ok" result a conforming engine gives a `selftest.echo` request built by `echoRequest`. */
function okResult(request: QuantityRequest = REQUEST, engine: ResultEnvelope["engine"] = ENGINE): ResultEnvelope {
  const echoed = echoValues(VALUES, 2);
  const data = { values: encodeNdArray(echoed.values), sum: echoed.sum };
  return makeResult(request, engine, { status: "ok", data });
}

function keyOf(request: QuantityRequest, engine: ResultEnvelope["engine"] = ENGINE): string {
  return storeKey({
    requestId: request.id,
    engineId: engine.id,
    engineFingerprint: engine.fingerprint,
    engineOptions: request.engineOptions,
  });
}

function newStore(t: TestContext): ResultStore {
  return createResultStore(join(tempDir(t), "store"));
}

/** The problem of a lookup, which must be "corrupt". */
function corruption(lookup: StoreLookup): string {
  assert.equal(lookup.kind, "corrupt", JSON.stringify(lookup));
  return lookup.kind === "corrupt" ? lookup.problem : "";
}

// ── The key ──────────────────────────────────────────────────────────────────────────────────────────────────────

test("a store key is the hash of the request id, the engine id, its fingerprint and the engine options", () => {
  const parts = { requestId: REQUEST.id, engineId: "fake-a", engineFingerprint: "abc", engineOptions: { rays: 64 } };
  assert.equal(storeKey(parts), hashCanonical(parts));
  assert.match(storeKey(parts), /^[0-9a-f]{64}$/);
  assert.equal(storeKey(parts), storeKey({ ...parts }));
});

test("the key changes with every part: the request, the engine, its fingerprint, and each engine option", () => {
  const parts = { requestId: REQUEST.id, engineId: "fake-a", engineFingerprint: "abc", engineOptions: { rays: 64 } };
  const variants = [
    parts,
    { ...parts, requestId: echoRequest(VALUES, 3).id },
    { ...parts, engineId: "fake-b" },
    { ...parts, engineFingerprint: "abd" },
    { ...parts, engineOptions: { rays: 65 } },
    { ...parts, engineOptions: { rays: 64, jit: true } },
    { ...parts, engineOptions: { beams: 64 } },
    { ...parts, engineOptions: {} },
  ];
  assert.equal(new Set(variants.map(storeKey)).size, variants.length);
});

test("engine options are keyed by content, and none at all is the same as an empty object", () => {
  const parts = { requestId: REQUEST.id, engineId: "fake-a", engineFingerprint: "abc" };
  const [ab, ba] = [
    { a: 1, b: { c: 2, d: 3 } },
    { b: { d: 3, c: 2 }, a: 1 },
  ];
  assert.equal(storeKey({ ...parts, engineOptions: ab }), storeKey({ ...parts, engineOptions: ba }));
  assert.equal(storeKey(parts), storeKey({ ...parts, engineOptions: {} }));
  assert.equal(storeKey(parts), storeKey({ ...parts, engineOptions: undefined }));
});

// ── Round trip ───────────────────────────────────────────────────────────────────────────────────────────────────

test("an entry that is put is got back, under the key of its request, engine and options", (t) => {
  const store = newStore(t);
  const result = okResult();
  assert.equal(store.has(keyOf(REQUEST)), false);
  assert.deepEqual(store.get(keyOf(REQUEST)), { kind: "miss" });

  const key = store.put(REQUEST, result);
  assert.equal(key, keyOf(REQUEST));
  assert.equal(store.has(keyOf(REQUEST)), true);
  const found = store.get(keyOf(REQUEST));
  assert.equal(found.kind, "hit");
  assert.deepEqual(found.kind === "hit" && found.entry, { request: REQUEST, result });
  assert.ok(found.kind === "hit" && Object.isFrozen(found.entry.result.data));
});

test("an entry is one file, <key>.json, holding canonical JSON and a newline", (t) => {
  const store = newStore(t);
  const result = okResult();
  const key = store.put(REQUEST, result);
  assert.deepEqual(readdirSync(store.directory), [`${key}.json`]);
  const text = readFileSync(join(store.directory, `${key}.json`), "utf8");
  assert.equal(text, `${canonicalJson({ request: REQUEST, result })}\n`);
  assert.equal(text.indexOf("\n"), text.length - 1);
});

test("an unsupported result is stored like an answer, which it is", (t) => {
  const store = newStore(t);
  const unsupported = [{ code: "option", item: "rays", message: "the ray count is fixed" }] as const;
  const result = makeResult(REQUEST, ENGINE, { status: "unsupported", unsupported });
  const key = store.put(REQUEST, result);
  assert.equal(key, keyOf(REQUEST));
  assert.deepEqual(store.get(keyOf(REQUEST)), { kind: "hit", entry: { request: REQUEST, result } });
});

test("an error and a pending result are never stored", (t) => {
  const store = newStore(t);
  const error = makeResult(REQUEST, ENGINE, { status: "error", error: { code: "engine-failure", message: "boom" } });
  const pending = makeResult(REQUEST, ENGINE, { status: "pending" });
  assert.equal(store.put(REQUEST, error), null);
  assert.equal(store.put(REQUEST, pending), null);
  assert.equal(existsSync(store.directory), false, "nothing was written, not even the directory");
  assert.equal(store.has(keyOf(REQUEST)), false);
  assert.deepEqual(STORED_STATUSES, ["ok", "unsupported"]);
  assert.deepEqual(
    (["ok", "unsupported", "error", "pending"] as const).map((status) => isStorable({ status })),
    [true, true, false, false],
  );
});

test("writing leaves no temporary file, however many entries are written and rewritten", (t) => {
  const store = newStore(t);
  const keys: string[] = [];
  for (const scale of [1, 2, 3, 4, 5]) {
    const request = echoRequest(VALUES, scale);
    for (let times = 0; times < 3; times++) keys.push(store.put(request, okResult(request)) ?? "");
  }
  assert.deepEqual(
    readdirSync(store.directory).sort(),
    [...new Set(keys)].sort().map((key) => `${key}.json`),
  );
  assert.equal(new Set(keys).size, 5);
});

test("putting under a key that is taken replaces the entry", (t) => {
  const store = newStore(t);
  const first = okResult();
  const second = makeResult(REQUEST, ENGINE, { status: "ok", data: { ...first.data, sum: null } });
  assert.equal(store.put(REQUEST, first), store.put(REQUEST, second));
  const found = store.get(keyOf(REQUEST));
  assert.equal(found.kind === "hit" && found.entry.result.data?.sum, null);
  assert.equal(readdirSync(store.directory).length, 1);
});

test("the same request is kept apart per engine, per fingerprint and per engine options", (t) => {
  const store = newStore(t);
  const { caseId, quantity, spec } = REQUEST;
  const withOptions = makeRequest({ caseId, quantity, spec, engineOptions: { rays: 64 } });
  assert.equal(withOptions.id, REQUEST.id);
  const other = { ...ENGINE, id: "fake-b" };
  const changed = { ...ENGINE, fingerprint: "e".repeat(64) };

  const keys = [
    store.put(REQUEST, okResult()),
    store.put(REQUEST, okResult(REQUEST, other)),
    store.put(REQUEST, okResult(REQUEST, changed)),
    store.put(withOptions, okResult(withOptions)),
  ];
  assert.equal(new Set(keys).size, 4);
  assert.equal(readdirSync(store.directory).length, 4);
  assert.equal(store.has(keyOf(REQUEST, { ...ENGINE, fingerprint: "d".repeat(64) })), false);
  const found = store.get(keyOf(withOptions));
  assert.deepEqual(found.kind === "hit" && found.entry.request.engineOptions, { rays: 64 });
});

test("arrays come back bit for bit: NaN payloads, -0, the infinities and subnormals", (t) => {
  const store = newStore(t);
  const { spec, data } = SELFTEST_ECHO_EXAMPLES["special-values"];
  const request = echoRequestFor(spec);
  const key = store.put(request, makeResult(request, ENGINE, { status: "ok", data }));
  const found = store.get(key ?? "");
  assert.deepEqual(found.kind === "hit" && found.entry.result.data, data);
});

test("two stores on one directory see each other's entries", (t) => {
  const directory = join(tempDir(t), "store");
  const key = createResultStore(directory).put(REQUEST, okResult());
  assert.equal(createResultStore(directory).has(key ?? ""), true);
});

// ── What is not trusted ──────────────────────────────────────────────────────────────────────────────────────────

test("an entry that cannot be trusted is corrupt, with the reason, and is not had", async (t) => {
  const other = echoRequest(VALUES, 7);
  const result = okResult();
  const error = { code: "engine-failure", message: "boom" };
  const forged = { ...REQUEST, id: other.id };
  const elsewhere = { ...result, caseId: "0".repeat(64) };
  const corruptions: [name: string, text: string, problem: RegExp][] = [
    ["a file cut short", canonicalJson({ request: REQUEST, result }).slice(0, 200), /it is malformed JSON/],
    ["an empty file", "", /it is malformed JSON/],
    ["a value that is not an object", "[1, 2]", /not an object with a request and a result/],
    ["a result alone", JSON.stringify({ result }), /not an object with a request and a result/],
    ["a member too many", JSON.stringify({ request: REQUEST, result, cached: true }), /and nothing else/],
    [
      "a request that is not one",
      JSON.stringify({ request: { ...REQUEST, kind: "nope" }, result }),
      /its request is not a valid request: \/kind \[const\]/,
    ],
    [
      "a request with another spec than its id says",
      JSON.stringify({ request: { ...REQUEST, spec: other.spec }, result }),
      /its request states the id .* but its content hashes to/,
    ],
    [
      "a result that is not one",
      JSON.stringify({ request: REQUEST, result: { ...result, diagnostics: undefined } }),
      /its result is not a valid result: \(root\) \[required\]/,
    ],
    [
      "a result that breaks a status rule",
      JSON.stringify({ request: REQUEST, result: { ...result, data: undefined } }),
      /its result breaks a status rule: status "ok" needs data/,
    ],
    [
      "a result that answers another request",
      JSON.stringify({ request: REQUEST, result: { ...result, requestId: other.id } }),
      /its result answers request/,
    ],
    [
      "a result about another case",
      JSON.stringify({ request: REQUEST, result: elsewhere }),
      /its result is about case 0{64}/,
    ],
    [
      "an error someone stored by hand",
      JSON.stringify({ request: REQUEST, result: { ...result, status: "error", error } }),
      /status "error", which is never stored/,
    ],
    [
      "a number JSON cannot carry",
      canonicalJson({ request: REQUEST, result }).replace('"scale":2', '"scale":1e400'),
      /its request is not a valid request: \/spec\/scale \[finite\]/,
    ],
    [
      "an entry whose request was given another id",
      JSON.stringify({ request: forged, result: { ...result, requestId: other.id } }),
      /its request states the id/,
    ],
  ];
  for (const [name, text, problem] of corruptions) {
    await t.test(name, (t) => {
      const store = newStore(t);
      const key = keyOf(REQUEST);
      mkdirSync(store.directory, { recursive: true });
      writeFileSync(join(store.directory, `${key}.json`), text);
      const said = corruption(store.get(key));
      assert.match(said, problem);
      assert.ok(said.startsWith(`store entry ${key}: `), said);
      assert.equal(store.has(key), false);
    });
  }
});

test("an entry filed under a key that is not its own is corrupt", (t) => {
  const store = newStore(t);
  const key = store.put(REQUEST, okResult()) ?? "";
  // The same answer, claimed for another engine's fingerprint: what a renamed or copied file is.
  const claimed = keyOf(REQUEST, { ...ENGINE, fingerprint: "e".repeat(64) });
  copyFileSync(join(store.directory, `${key}.json`), join(store.directory, `${claimed}.json`));
  assert.match(corruption(store.get(claimed)), new RegExp(`^store entry ${claimed}: it is the entry of key ${key}$`));
  assert.equal(store.has(claimed), false);
  assert.equal(store.has(key), true);
});

test("an entry that cannot be read is corrupt, and the reason is a code, not a path", (t) => {
  const store = newStore(t);
  const key = keyOf(REQUEST);
  mkdirSync(join(store.directory, `${key}.json`), { recursive: true });
  const said = corruption(store.get(key));
  assert.equal(said, `store entry ${key}: it cannot be read (EISDIR)`);
  assert.ok(!said.includes(store.directory));
});

test("a corrupt entry is repaired by putting the answer again", (t) => {
  const store = newStore(t);
  const key = keyOf(REQUEST);
  mkdirSync(store.directory, { recursive: true });
  writeFileSync(join(store.directory, `${key}.json`), "{");
  assert.equal(store.get(key).kind, "corrupt");
  assert.equal(store.put(REQUEST, okResult()), key);
  assert.equal(store.get(key).kind, "hit");
});

test("an entry that was removed is a miss again", (t) => {
  const store = newStore(t);
  const key = store.put(REQUEST, okResult()) ?? "";
  rmSync(join(store.directory, `${key}.json`));
  assert.deepEqual(store.get(key), { kind: "miss" });
});

// ── Misuse ───────────────────────────────────────────────────────────────────────────────────────────────────────

test("put refuses a result that does not answer the request, and writes nothing", (t) => {
  const store = newStore(t);
  const other = echoRequest(VALUES, 7);
  assert.throws(() => store.put(other, okResult()), /result store: not an entry: its result answers request/);
  const elsewhere = { ...okResult(), caseId: "0".repeat(64) };
  assert.throws(() => store.put(REQUEST, elsewhere), /not an entry: its result is about case/);
  const invalid = { ...REQUEST, quantity: "Not A Quantity" };
  assert.throws(() => store.put(invalid, okResult()), /not an entry: its request is not a valid request/);
  assert.equal(existsSync(store.directory), false);
  assert.equal(REQUEST.caseId, CASE.id);
});

test("a key that is not a store key is refused before it becomes a file name", (t) => {
  const store = newStore(t);
  for (const key of ["", "abc", "../escape", `${"a".repeat(63)}/`, "A".repeat(64), `${"a".repeat(64)}.json`]) {
    assert.throws(() => store.get(key), /is not a store key/, key);
    assert.throws(() => store.has(key), /is not a store key/, key);
  }
});
