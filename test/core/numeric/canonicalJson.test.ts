import assert from "node:assert/strict";
import { test } from "node:test";

import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";

test("primitives serialise as JSON, numbers in shortest round-trip form", () => {
  const cases: readonly (readonly [unknown, string])[] = [
    [null, "null"],
    [true, "true"],
    [false, "false"],
    [0, "0"],
    [1, "1"],
    [-1.5, "-1.5"],
    [0.1 + 0.2, "0.30000000000000004"],
    [1e21, "1e+21"],
    [1e-7, "1e-7"],
    [123456789012345680000, "123456789012345680000"],
    [5e-324, "5e-324"],
    [Number.MAX_VALUE, "1.7976931348623157e+308"],
    [Number.MIN_SAFE_INTEGER, "-9007199254740991"],
    ["", '""'],
    ["plain", '"plain"'],
    ['quote " backslash \\ newline \n tab \t', '"quote \\" backslash \\\\ newline \\n tab \\t"'],
    ["\u0001\u001f", '"\\u0001\\u001f"'],
    ["é ～ 😀", '"é ～ 😀"'],
    ["\ud800", '"\\ud800"'],
  ];
  for (const [value, expected] of cases) assert.equal(canonicalJson(value), expected);
});

test("-0 serialises as 0, at the top level and nested", () => {
  assert.equal(canonicalJson(-0), "0");
  assert.equal(canonicalJson({ a: [-0, 0] }), '{"a":[0,0]}');
});

test("object keys are sorted by UTF-16 code unit, whatever the insertion order", () => {
  const value = { b: 1, a: 2, A: 3, "10": 4, "9": 5, "": 6, aa: 7, _: 8 };
  assert.equal(canonicalJson(value), '{"":6,"10":4,"9":5,"A":3,"_":8,"a":2,"aa":7,"b":1}');

  const reversed = Object.fromEntries(Object.entries(value).reverse());
  assert.equal(canonicalJson(reversed), canonicalJson(value));
});

test("non-ASCII keys sort by code unit, not by code point or locale", () => {
  // U+1F600 is the surrogate pair D83D DE00, so it sorts before U+FF5E although its code point is larger; a
  // locale-aware sort would put "é" next to "e".
  const value = { "\uff5e": 1, "\u{1f600}": 2, é: 3, z: 4, e: 5 };
  assert.equal(canonicalJson(value), '{"e":5,"z":4,"é":3,"😀":2,"～":1}');
});

test("keys are sorted at every depth and arrays keep their order", () => {
  const value = {
    z: [
      { b: 1, a: [3, 1, 2] },
      { d: null, c: { y: true, x: false } },
    ],
    a: { c: "x", b: { b: 2, a: 1 } },
  };
  assert.equal(
    canonicalJson(value),
    '{"a":{"b":{"a":1,"b":2},"c":"x"},"z":[{"a":[3,1,2],"b":1},{"c":{"x":false,"y":true},"d":null}]}',
  );
});

test("empty containers, null-prototype objects and repeated references are serialised", () => {
  assert.equal(canonicalJson({}), "{}");
  assert.equal(canonicalJson([]), "[]");
  assert.equal(canonicalJson([[], {}]), "[[],{}]");

  const bare: Record<string, unknown> = Object.create(null);
  bare.b = 1;
  bare.a = 2;
  assert.equal(canonicalJson(bare), '{"a":2,"b":1}');

  const shared = { k: 1 };
  assert.equal(canonicalJson([shared, shared, { again: shared }]), '[{"k":1},{"k":1},{"again":{"k":1}}]');
});

test("non-enumerable properties are not part of the value", () => {
  const value = { a: 1 };
  Object.defineProperty(value, "hidden", { value: 2, enumerable: false });
  assert.equal(canonicalJson(value), '{"a":1}');
});

test("every value JSON cannot carry is rejected with its path", () => {
  class Lens {
    readonly name = "x";
  }
  const sparse: unknown[] = [1];
  sparse[2] = 3;
  const cyclic: Record<string, unknown> = { inner: {} };
  (cyclic.inner as Record<string, unknown>).back = cyclic;
  const selfList: unknown[] = [];
  selfList.push([selfList]);

  const cases: readonly (readonly [unknown, string])[] = [
    [NaN, "canonicalJson: non-finite number NaN at $"],
    [Infinity, "canonicalJson: non-finite number Infinity at $"],
    [{ a: [1, -Infinity] }, "canonicalJson: non-finite number -Infinity at $.a[1]"],
    [{ rays: [{ x: 0 }, { x: NaN }] }, "canonicalJson: non-finite number NaN at $.rays[1].x"],

    [undefined, "canonicalJson: undefined at $"],
    [{ a: undefined }, "canonicalJson: undefined at $.a"],
    [[1, undefined], "canonicalJson: undefined at $[1]"],
    [sparse, "canonicalJson: undefined at $[1]"],

    [() => 1, "canonicalJson: function at $"],
    [{ f: Math.sin }, "canonicalJson: function at $.f"],
    [{ toJSON: () => "x" }, "canonicalJson: function at $.toJSON"],
    [[Symbol("s")], "canonicalJson: symbol at $[0]"],
    [{ n: 1n }, "canonicalJson: bigint at $.n"],
    [{ [Symbol("key")]: 1 }, "canonicalJson: symbol-keyed property at $"],

    [new Map([["a", 1]]), "canonicalJson: non-plain object (Map) at $"],
    [{ s: new Set([1]) }, "canonicalJson: non-plain object (Set) at $.s"],
    [{ when: new Date(0) }, "canonicalJson: non-plain object (Date) at $.when"],
    [{ v: new Float64Array(2) }, "canonicalJson: non-plain object (Float64Array) at $.v"],
    [[new Uint8Array(1)], "canonicalJson: non-plain object (Uint8Array) at $[0]"],
    [{ b: Buffer.from("x") }, "canonicalJson: non-plain object (Uint8Array) at $.b"],
    [[0, new Lens()], "canonicalJson: non-plain object (Lens) at $[1]"],
    [Object.create({ inherited: 1 }), "canonicalJson: non-plain object (custom prototype) at $"],
    [new Number(1), "canonicalJson: non-plain object (Number) at $"],
    [{ re: /x/ }, "canonicalJson: non-plain object (RegExp) at $.re"],
    [{ e: new Error("x") }, "canonicalJson: non-plain object (Error) at $.e"],

    // An array carries its elements only: a named or symbol-keyed property on it would be dropped without a word.
    ["abc".match(/b/), 'canonicalJson: non-index array property "index" at $'],
    [{ list: Object.assign([1, 2], { unit: "mm" }) }, 'canonicalJson: non-index array property "unit" at $.list'],
    [[0, Object.assign([], { "-1": 5 })], 'canonicalJson: non-index array property "-1" at $[1]'],
    [Object.assign([1], { [Symbol("tag")]: 2 }), "canonicalJson: symbol-keyed property at $"],

    [cyclic, "canonicalJson: circular reference at $.inner.back"],
    [selfList, "canonicalJson: circular reference at $[0][0]"],

    [
      { "odd key": { "a.b": [0, { "": new Map() }] } },
      'canonicalJson: non-plain object (Map) at $["odd key"]["a.b"][1][""]',
    ],
    [{ 'q"uote': { "1st": NaN } }, 'canonicalJson: non-finite number NaN at $["q\\"uote"]["1st"]'],
    [{ $ref: { _x9: undefined } }, "canonicalJson: undefined at $.$ref._x9"],
  ];
  for (const [value, message] of cases) {
    assert.throws(
      () => canonicalJson(value),
      (error: unknown) => error instanceof Error && error.message === message,
      message,
    );
  }
});

test("the first offending value in canonical order is the one reported", () => {
  // Keys are visited sorted, so "a" is reported although "z" was inserted first.
  assert.throws(() => canonicalJson({ z: NaN, a: undefined }), { message: "canonicalJson: undefined at $.a" });
});

test("canonical text parses back to an equal canonical text", () => {
  const samples: readonly unknown[] = [
    null,
    -0,
    [-0, 1e21, 1e-7, 5e-324, Number.MAX_VALUE, 0.1 + 0.2, -123.456e-30],
    "\ud800 lone, \u{1f600} paired, \u0000 control, é",
    { b: [1, { d: null, c: "x" }], a: { "": true, "\uff5e": false, "\u{1f600}": 0 } },
    JSON.parse('{"__proto__": {"b": 1, "a": 2}, "constructor": 1, "10": [], "9": {}}'),
    { nested: { deeper: { deepest: [[[]], [{}], [[1, [2, [3]]]]] } } },
  ];
  for (const sample of samples) {
    const text = canonicalJson(sample);
    assert.equal(canonicalJson(JSON.parse(text)), text);
  }
});

test("an own __proto__ key is data like any other", () => {
  const parsed: unknown = JSON.parse('{"b": 1, "__proto__": {"y": 1, "x": 2}, "a": 3}');
  assert.equal(canonicalJson(parsed), '{"__proto__":{"x":2,"y":1},"a":3,"b":1}');
});

test("the text agrees with JSON.stringify for data whose keys are already sorted", () => {
  const value = { a: [1, 2.5, "x", null, true], b: { c: "\n", d: -1e-9 }, c: "é" };
  assert.equal(canonicalJson(value), JSON.stringify(value));
});
