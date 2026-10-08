import assert from "node:assert/strict";
import { test } from "node:test";

import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import { sha256Hex } from "../../../src/core/numeric/hash.ts";
import {
  HOST_LITTLE_ENDIAN,
  ND_DTYPES,
  decodeNdArray,
  encodeF8,
  encodeNdArray,
  fromLittleEndianBytes,
  isNdArray,
  ndRow,
  toLittleEndianBytes,
} from "../../../src/core/numeric/ndarray.ts";
import type { NdArray, NdArrayWire, NdDtype, NdValues } from "../../../src/core/numeric/ndarray.ts";

const EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

/** A wire example whose base64 and digest were produced outside this codebase (Python struct + hashlib). */
const F8_WIRE: NdArrayWire = {
  $nd: {
    dtype: "f8",
    shape: [3],
    data: "AAAAAAAA8D8AAAAAAAAAwAAAAAAAAOA/",
    sha256: "eb9c7e25b0c32384869e705808d06581e674741e70c99a2fd7e42f1b4e22d6c1",
  },
};
const F8_VALUES = Float64Array.of(1, -2, 0.5);

/** What a wire value looks like after travelling as JSON text. */
function viaJson(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

function decodeAs<D extends NdDtype>(dtype: D, wire: unknown): Extract<NdArray, { dtype: D }> {
  const decoded = decodeNdArray(wire);
  assert.equal(decoded.dtype, dtype);
  return decoded as Extract<NdArray, { dtype: D }>;
}

/** The IEEE 754 bit pattern of every element, read without going through a number. */
function bitsOf(values: Float64Array): bigint[] {
  return [...new BigUint64Array(values.buffer, values.byteOffset, values.length)];
}

function wireBytes(wire: NdArrayWire): number[] {
  return [...Buffer.from(wire.$nd.data, "base64")];
}

/** The wire example with some fields of `$nd` replaced. */
function tampered(fields: Record<string, unknown>): unknown {
  return { $nd: { ...F8_WIRE.$nd, ...fields } };
}

function throwsMessage(run: () => unknown, message: string): void {
  assert.throws(run, (error: unknown) => error instanceof Error && error.message === message, message);
}

test("float64 is written least significant byte first: a pinned wire example", () => {
  assert.deepEqual(encodeNdArray(F8_VALUES), F8_WIRE);
  assert.deepEqual(wireBytes(F8_WIRE).slice(0, 8), [0, 0, 0, 0, 0, 0, 0xf0, 0x3f]);

  const decoded = decodeAs("f8", viaJson(F8_WIRE));
  assert.deepEqual(decoded.shape, [3]);
  assert.deepEqual(decoded.values, F8_VALUES);
});

test("pinned wire examples for -0, a subnormal, infinity, int32, uint8 and a 2-D shape", () => {
  const cases: readonly (readonly [NdValues, readonly number[], string, string])[] = [
    [
      Float64Array.of(1.5, -0, 1e-310, Infinity),
      [4],
      "AAAAAAAA+D8AAAAAAAAAgCvmcItoEgAAAAAAAAAA8H8=",
      "f35e88d4f6244ee946acaf047e13c0aa0e46ab66f6113b8a26ddfefac87cb916",
    ],
    [
      Int32Array.of(1, -2, 0x01020304),
      [3],
      "AQAAAP7///8EAwIB",
      "6842fbd017dc4705a6401f5a0e4db51bbd3167cc224da5a28f51e3c5b6ec4df7",
    ],
    [
      Uint8Array.of(0, 1, 254, 255),
      [4],
      "AAH+/w==",
      "c5dbae22661af6db18a1f676db82a7ef7de46d27c3a263a872f00478b0d99fc4",
    ],
    [
      Float64Array.of(0, 1, 2, 3, 4, 5),
      [2, 3],
      "AAAAAAAAAAAAAAAAAADwPwAAAAAAAABAAAAAAAAACEAAAAAAAAAQQAAAAAAAABRA",
      "84a6e8b7afdd286a48ab0aab2c72227fff91a935b0489e633018914bd01693cd",
    ],
  ];
  for (const [values, shape, data, sha256] of cases) {
    const wire = encodeNdArray(values, shape);
    assert.equal(wire.$nd.data, data);
    assert.equal(wire.$nd.sha256, sha256);
    assert.deepEqual(wire.$nd.shape, shape);

    const decoded = decodeNdArray(viaJson(wire));
    assert.deepEqual(decoded.shape, shape);
    assert.deepEqual(toLittleEndianBytes(decoded.values), toLittleEndianBytes(values));
  }
  assert.deepEqual(wireBytes(encodeNdArray(Int32Array.of(0x01020304))), [4, 3, 2, 1]);
});

test("float64 round-trips bit for bit: NaN payloads, -0, infinities, subnormals", () => {
  const bits = BigUint64Array.of(
    0x7ff8000000000000n, // the default quiet NaN
    0x7ff8000000000001n, // quiet NaN, payload 1
    0xfff8deadbeefcafen, // negative quiet NaN with a payload
    0x7ff0000000000001n, // signalling NaN
    0xfff4000000c0ffeen, // negative signalling NaN with a payload
    0x8000000000000000n, // -0
    0x0000000000000000n, // +0
    0x7ff0000000000000n, // +infinity
    0xfff0000000000000n, // -infinity
    0x0000000000000001n, // smallest subnormal
    0x000fffffffffffffn, // largest subnormal
    0x800fffffffffffffn, // largest negative subnormal
    0x0010000000000000n, // smallest normal
    0x7fefffffffffffffn, // largest finite
    0x3ff0000000000001n, // 1 + 2^-52
    0x0123456789abcdefn, // every byte different
  );
  const values = new Float64Array(bits.buffer);
  const wire = encodeNdArray(values);

  // The wire bytes are each bit pattern, least significant byte first.
  const expected = new DataView(new ArrayBuffer(bits.length * 8));
  bits.forEach((pattern, index) => expected.setBigUint64(index * 8, pattern, true));
  assert.deepEqual(wireBytes(wire), [...new Uint8Array(expected.buffer)]);
  assert.deepEqual(wireBytes(wire).slice(-8), [0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01]);

  const decoded = decodeAs("f8", viaJson(wire));
  assert.deepEqual(bitsOf(decoded.values), [...bits]);
  assert.ok(decoded.values.subarray(0, 5).every((value) => Number.isNaN(value)));
  assert.ok(Object.is(decoded.values[5], -0));
  assert.ok(Object.is(decoded.values[6], 0));
  assert.equal(decoded.values[7], Infinity);
  assert.equal(decoded.values[8], -Infinity);
  assert.equal(decoded.values[9], 5e-324);
  assert.equal(decoded.values[13], Number.MAX_VALUE);

  // Encoding what was decoded gives the same wire value, digest included.
  assert.deepEqual(encodeNdArray(decoded.values), wire);
});

test("int32 and uint8 round-trip over their whole range", () => {
  const ints = Int32Array.of(0, 1, -1, 2147483647, -2147483648, 0x01020304, -0x01020304);
  const decodedInts = decodeAs("i4", viaJson(encodeNdArray(ints)));
  assert.ok(decodedInts.values instanceof Int32Array);
  assert.deepEqual(decodedInts.values, ints);

  const bytes = Uint8Array.from({ length: 256 }, (_, index) => index);
  const decodedBytes = decodeAs("u1", viaJson(encodeNdArray(bytes)));
  assert.ok(decodedBytes.values instanceof Uint8Array && !Buffer.isBuffer(decodedBytes.values));
  assert.deepEqual(decodedBytes.values, bytes);
});

test("empty arrays round-trip for every dtype", () => {
  const empties: readonly (readonly [NdDtype, NdValues])[] = [
    ["f8", new Float64Array(0)],
    ["i4", new Int32Array(0)],
    ["u1", new Uint8Array(0)],
  ];
  assert.deepEqual(
    empties.map(([dtype]) => dtype),
    [...ND_DTYPES],
  );
  for (const [dtype, values] of empties) {
    const wire = encodeNdArray(values);
    assert.deepEqual(wire, { $nd: { dtype, shape: [0], data: "", sha256: EMPTY_SHA256 } });
    const decoded = decodeNdArray(viaJson(wire));
    assert.equal(decoded.dtype, dtype);
    assert.deepEqual(decoded.shape, [0]);
    assert.equal(decoded.values.length, 0);

    const wide = decodeNdArray(encodeNdArray(values, [0, 3]));
    assert.deepEqual(wide.shape, [0, 3]);
    assert.equal(wide.values.length, 0);
  }
});

test("a shape is kept as given when its product is the element count", () => {
  const values = Float64Array.of(1, 2, 3, 4, 5, 6);
  for (const shape of [[6], [2, 3], [3, 2], [1, 6], [6, 1], [1, 2, 3, 1]]) {
    const decoded = decodeAs("f8", viaJson(encodeNdArray(values, shape)));
    assert.deepEqual(decoded.shape, shape);
    assert.deepEqual(decoded.values, values);
  }
  // No axes at all is a single element.
  assert.deepEqual(decodeNdArray(encodeNdArray(Float64Array.of(7), [])).shape, []);
});

test("encodeF8 writes a list of numbers as float64 with -0 as 0, and every other number as it is", () => {
  const wire = encodeF8([1, -0, 0, -2.5, Infinity, -Infinity, NaN, 5e-324]);
  assert.equal(wire.$nd.dtype, "f8");
  assert.deepEqual(wire.$nd.shape, [8]);
  const { values } = decodeNdArray(wire);
  assert.ok(Object.is(values[1], 0) && Object.is(values[2], 0), "neither zero is negative");
  assert.deepEqual([...values], [1, 0, 0, -2.5, Infinity, -Infinity, NaN, 5e-324]);
  // Two lists that differ only in the sign of a zero are one array, as they are one number in a case's identity.
  assert.deepEqual(encodeF8([0, 1]), encodeF8([-0, 1]));
  assert.notDeepEqual(encodeNdArray(Float64Array.of(0, 1)), encodeNdArray(Float64Array.of(-0, 1)));
  assert.deepEqual(encodeF8([1, 2, 3, 4, 5, 6], [2, 3]).$nd.shape, [2, 3]);
  assert.deepEqual(encodeF8([]).$nd.shape, [0]);
  assert.throws(() => encodeF8([1, 2, 3], [2, 2]), /the product of shape \[2,2\] is 4 but the array length is 3/);
});

test("encodeNdArray rejects a shape that does not fit the array", () => {
  const values = new Float64Array(6);
  const cases: readonly (readonly [readonly number[], string])[] = [
    [[5], "ndarray: the product of shape [5] is 5 but the array length is 6"],
    [[2, 4], "ndarray: the product of shape [2,4] is 8 but the array length is 6"],
    [[], "ndarray: the product of shape [] is 1 but the array length is 6"],
    [[0, 6], "ndarray: the product of shape [0,6] is 0 but the array length is 6"],
    [[-2, -3], "ndarray: shape must be an array of non-negative integers, got [-2,-3]"],
    [[1.5, 4], "ndarray: shape must be an array of non-negative integers, got [1.5,4]"],
    [[NaN], "ndarray: shape must be an array of non-negative integers, got [NaN]"],
    [[6, Infinity], "ndarray: shape must be an array of non-negative integers, got [6,Infinity]"],
  ];
  for (const [shape, message] of cases) throwsMessage(() => encodeNdArray(values, shape), message);
});

test("encodeNdArray rejects typed arrays the wire form has no dtype for, and anything that is not one", () => {
  const message = "ndarray: only a Float64Array, an Int32Array or a Uint8Array can be encoded";
  const others = [new Float32Array(2), new Uint8ClampedArray(2), new Int16Array(2), [1, 2], null, undefined, 5];
  for (const values of others) {
    throwsMessage(() => encodeNdArray(values as unknown as NdValues), message);
    throwsMessage(() => encodeNdArray(values as unknown as NdValues, [2]), message);
  }
});

test("encodeNdArray reads exactly the elements a view covers and does not keep the array", () => {
  const backing = Float64Array.of(9, 1, -2, 0.5, 9);
  const view = backing.subarray(1, 4);
  assert.equal(view.byteOffset, 8);
  assert.deepEqual(encodeNdArray(view), F8_WIRE);

  const shape = [3];
  const wire = encodeNdArray(view, shape);
  shape[0] = 99;
  backing.fill(0);
  assert.deepEqual(wire, F8_WIRE);
});

test("decodeNdArray returns fresh, exactly sized memory each time", () => {
  const first = decodeAs("f8", F8_WIRE);
  const second = decodeAs("f8", F8_WIRE);
  assert.notEqual(first.values.buffer, second.values.buffer);
  assert.equal(first.values.byteOffset, 0);
  assert.equal(first.values.buffer.byteLength, 24);
  first.values[0] = 42;
  assert.deepEqual(second.values, F8_VALUES);
  assert.notEqual(first.shape, F8_WIRE.$nd.shape);
});

test("ndRow is a view on one row of a 2-D array", () => {
  const array = decodeAs("f8", encodeNdArray(Float64Array.of(0, 1, 2, 3, 4, 5), [2, 3]));
  assert.deepEqual(ndRow(array, 0), Float64Array.of(0, 1, 2));
  assert.deepEqual(ndRow(array, 1), Float64Array.of(3, 4, 5));

  const row = ndRow(array, 1);
  assert.equal(row.buffer, array.values.buffer);
  row[2] = -5;
  assert.equal(array.values[5], -5);

  const ints = decodeAs("i4", encodeNdArray(Int32Array.of(1, 2, 3, 4, 5, 6), [3, 2]));
  assert.deepEqual(ndRow(ints, 2), Int32Array.of(5, 6));

  const noColumns = decodeAs("u1", encodeNdArray(new Uint8Array(0), [2, 0]));
  assert.equal(ndRow(noColumns, 1).length, 0);
});

test("ndRow rejects arrays that are not 2-D and rows that do not exist", () => {
  const array = decodeNdArray(encodeNdArray(Float64Array.of(0, 1, 2, 3, 4, 5), [2, 3]));
  throwsMessage(() => ndRow(array, 2), "ndarray: row 2 does not exist in an array of 2 rows");
  throwsMessage(() => ndRow(array, -1), "ndarray: row -1 does not exist in an array of 2 rows");
  throwsMessage(() => ndRow(array, 0.5), "ndarray: row 0.5 does not exist in an array of 2 rows");
  throwsMessage(() => ndRow(array, NaN), "ndarray: row NaN does not exist in an array of 2 rows");

  const flat = decodeNdArray(encodeNdArray(Float64Array.of(0, 1, 2)));
  throwsMessage(() => ndRow(flat, 0), "ndarray: a row needs a 2-D array, got shape [3]");
  const cube = decodeNdArray(encodeNdArray(new Float64Array(8), [2, 2, 2]));
  throwsMessage(() => ndRow(cube, 0), "ndarray: a row needs a 2-D array, got shape [2,2,2]");
  const noRows = decodeNdArray(encodeNdArray(new Float64Array(0), [0, 3]));
  throwsMessage(() => ndRow(noRows, 0), "ndarray: row 0 does not exist in an array of 0 rows");
});

test("tampered data, digest, shape or dtype is rejected", () => {
  const actual = F8_WIRE.$nd.sha256;

  // One base64 character changed: still canonical, same length, different bytes.
  const flipped = "AAAAAAAA8D8AAAAAAAAAwAAAAAAAAOB/";
  const flippedSha = sha256Hex(Buffer.from(flipped, "base64"));
  throwsMessage(
    () => decodeNdArray(tampered({ data: flipped })),
    `ndarray: sha256 mismatch: the data hashes to ${flippedSha} but the wire form says ${actual}`,
  );

  const otherSha = `0${actual.slice(1)}`;
  assert.notEqual(otherSha, actual);
  throwsMessage(
    () => decodeNdArray(tampered({ sha256: otherSha })),
    `ndarray: sha256 mismatch: the data hashes to ${actual} but the wire form says ${otherSha}`,
  );

  throwsMessage(
    () => decodeNdArray(tampered({ shape: [4] })),
    "ndarray: data is 24 bytes but shape [4] of f8 needs 32",
  );
  throwsMessage(
    () => decodeNdArray(tampered({ shape: [2] })),
    "ndarray: data is 24 bytes but shape [2] of f8 needs 16",
  );
  throwsMessage(
    () => decodeNdArray(tampered({ shape: [3, 2] })),
    "ndarray: data is 24 bytes but shape [3,2] of f8 needs 48",
  );
  throwsMessage(() => decodeNdArray(tampered({ shape: [] })), "ndarray: data is 24 bytes but shape [] of f8 needs 8");
  throwsMessage(
    () => decodeNdArray(tampered({ dtype: "i4" })),
    "ndarray: data is 24 bytes but shape [3] of i4 needs 12",
  );
  throwsMessage(
    () => decodeNdArray(tampered({ dtype: "u1" })),
    "ndarray: data is 24 bytes but shape [3] of u1 needs 3",
  );

  // Truncated data is caught by its length even when the digest was recomputed to match.
  const truncated = Buffer.from(F8_WIRE.$nd.data, "base64").subarray(0, 23);
  throwsMessage(
    () => decodeNdArray(tampered({ data: truncated.toString("base64"), sha256: sha256Hex(truncated) })),
    "ndarray: data is 23 bytes but shape [3] of f8 needs 24",
  );
});

test("the digest covers the bytes only: the same bytes under another shape of equal size decode", () => {
  const reshaped = decodeAs("f8", tampered({ shape: [1, 3] }));
  assert.deepEqual(reshaped.shape, [1, 3]);
  assert.deepEqual(reshaped.values, F8_VALUES);
  // What tells the two apart is the hash of the enclosing JSON.
  assert.notEqual(canonicalJson(tampered({ shape: [1, 3] })), canonicalJson(F8_WIRE));
});

test("data that is not canonical base64 is rejected", () => {
  const message = "ndarray: data is not canonical base64 (standard alphabet, padded, no whitespace)";
  const bytes = Uint8Array.of(0, 1, 254, 255);
  const sha256 = sha256Hex(bytes);
  const wire = (data: string): unknown => ({ $nd: { dtype: "u1", shape: [4], data, sha256 } });

  assert.deepEqual(decodeAs("u1", wire("AAH+/w==")).values, bytes);
  const variants = [
    "AAH-_w==", // URL-safe alphabet
    "AAH+/w", // padding removed
    "AAH+/w=", // padding cut short
    "AAH+\n/w==", // line break
    " AAH+/w==", // leading space
    "AAH+/w== ", // trailing space
    "AAH+/x==", // same bytes, unused trailing bits set
    "AAH+/w==AA==", // data after the padding
    "AAH+/w==!", // a character outside the alphabet
  ];
  for (const data of variants) throwsMessage(() => decodeNdArray(wire(data)), message);
});

test("a value without the wire structure is rejected by decodeNdArray and by isNdArray", () => {
  const { dtype, shape, data, sha256 } = F8_WIRE.$nd;
  const noKey = 'ndarray: expected an object with a "$nd" key';
  const badShape = "ndarray: shape must be an array of non-negative integers, got";
  const badSha = "ndarray: sha256 must be 64 lowercase hex characters, got";
  const cases: readonly (readonly [unknown, string])[] = [
    [null, noKey],
    [undefined, noKey],
    [5, noKey],
    ["$nd", noKey],
    [[], noKey],
    [[F8_WIRE], noKey],
    [{}, noKey],
    [{ nd: F8_WIRE.$nd }, noKey],
    [F8_VALUES, noKey],
    [Object.create(F8_WIRE), noKey],

    [{ ...F8_WIRE, unit: "mm" }, 'ndarray: unexpected key "unit" beside "$nd"'],
    [{ $nd: null }, 'ndarray: "$nd" must be an object'],
    [{ $nd: [dtype, shape, data, sha256] }, 'ndarray: "$nd" must be an object'],
    [{ $nd: data }, 'ndarray: "$nd" must be an object'],
    [tampered({ order: "C" }), 'ndarray: unknown key "order" in "$nd"'],

    [tampered({ dtype: "f4" }), 'ndarray: dtype must be one of f8, i4, u1, got "f4"'],
    [tampered({ dtype: "F8" }), 'ndarray: dtype must be one of f8, i4, u1, got "F8"'],
    [tampered({ dtype: 8 }), "ndarray: dtype must be one of f8, i4, u1, got 8"],
    [{ $nd: { shape, data, sha256 } }, "ndarray: dtype must be one of f8, i4, u1, got undefined"],

    [tampered({ shape: [3, -1] }), `${badShape} [3,-1]`],
    [tampered({ shape: [1.5] }), `${badShape} [1.5]`],
    [tampered({ shape: ["3"] }), `${badShape} ["3"]`],
    [tampered({ shape: [null] }), `${badShape} [null]`],
    [tampered({ shape: [2 ** 53] }), `${badShape} [9007199254740992]`],
    [tampered({ shape: 3 }), `${badShape} 3`],
    [tampered({ shape: "3" }), `${badShape} "3"`],
    [tampered({ shape: { length: 1, 0: 3 } }), `${badShape} an object`],
    [{ $nd: { dtype, data, sha256 } }, `${badShape} undefined`],

    [tampered({ data: 5 }), "ndarray: data must be a base64 string, got 5"],
    [tampered({ data: [0, 0] }), "ndarray: data must be a base64 string, got [0,0]"],
    [{ $nd: { dtype, shape, sha256 } }, "ndarray: data must be a base64 string, got undefined"],

    [tampered({ sha256: sha256.toUpperCase() }), `${badSha} "${sha256.toUpperCase()}"`],
    [tampered({ sha256: sha256.slice(1) }), `${badSha} "${sha256.slice(1)}"`],
    [tampered({ sha256: `${sha256}0` }), `${badSha} "${sha256}0"`],
    [tampered({ sha256: null }), `${badSha} null`],
    [{ $nd: { dtype, shape, data } }, `${badSha} undefined`],
  ];
  for (const [value, message] of cases) {
    assert.equal(isNdArray(value), false, message);
    throwsMessage(() => decodeNdArray(value), message);
  }
});

test("isNdArray accepts the wire structure without checking the bytes", () => {
  assert.equal(isNdArray(F8_WIRE), true);
  assert.equal(isNdArray(viaJson(F8_WIRE)), true);
  assert.equal(isNdArray(encodeNdArray(new Uint8Array(0))), true);

  // Structurally sound but not decodable: the guard is cheap, decodeNdArray is the check.
  const wrongDigest = tampered({ sha256: EMPTY_SHA256 });
  assert.equal(isNdArray(wrongDigest), true);
  assert.throws(() => decodeNdArray(wrongDigest), /sha256 mismatch/);
  const notBase64 = tampered({ data: "not base64!" });
  assert.equal(isNdArray(notBase64), true);
  assert.throws(() => decodeNdArray(notBase64), /not canonical base64/);
});

test("the wire form is plain JSON that canonicalJson accepts", () => {
  const wire = encodeNdArray(Float64Array.of(NaN, -0, Infinity), [1, 3]);
  const text = canonicalJson(wire);
  assert.equal(text.startsWith('{"$nd":{"data":"'), true);
  assert.deepEqual(JSON.parse(text), wire);
  assert.deepEqual(Object.keys(wire), ["$nd"]);
  assert.deepEqual(Object.keys(wire.$nd).sort(), ["data", "dtype", "sha256", "shape"]);
});

test("HOST_LITTLE_ENDIAN describes this machine", () => {
  const memory = new DataView(Float64Array.of(1.5).buffer);
  assert.equal(memory.getFloat64(0, HOST_LITTLE_ENDIAN), 1.5);
  assert.notEqual(memory.getFloat64(0, !HOST_LITTLE_ENDIAN), 1.5);
});

test("on a little-endian host the bytes are copied unchanged", () => {
  const memory = Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  assert.deepEqual(toLittleEndianBytes(new Float64Array(memory.buffer), true), memory);
  assert.deepEqual(toLittleEndianBytes(new Int32Array(memory.buffer), true), memory);
  assert.deepEqual(toLittleEndianBytes(memory, true), memory);

  assert.deepEqual(new Uint8Array(fromLittleEndianBytes("f8", memory, true).buffer), memory);
  assert.deepEqual(new Uint8Array(fromLittleEndianBytes("i4", memory, true).buffer), memory);
  assert.deepEqual(fromLittleEndianBytes("u1", memory, true), memory);
});

test("on a big-endian host every element's bytes are reversed, in both directions", () => {
  // The memory a big-endian host holds for the float64 values [1, -2], and their little-endian wire bytes.
  const bigEndianDoubles = Uint8Array.of(0x3f, 0xf0, 0, 0, 0, 0, 0, 0, 0xc0, 0, 0, 0, 0, 0, 0, 0);
  const wireDoubles = Uint8Array.of(0, 0, 0, 0, 0, 0, 0xf0, 0x3f, 0, 0, 0, 0, 0, 0, 0, 0xc0);
  assert.deepEqual(toLittleEndianBytes(new Float64Array(bigEndianDoubles.buffer), false), wireDoubles);
  assert.deepEqual(new Uint8Array(fromLittleEndianBytes("f8", wireDoubles, false).buffer), bigEndianDoubles);

  // int32 [0x01020304, -2].
  const bigEndianInts = Uint8Array.of(1, 2, 3, 4, 0xff, 0xff, 0xff, 0xfe);
  const wireInts = Uint8Array.of(4, 3, 2, 1, 0xfe, 0xff, 0xff, 0xff);
  assert.deepEqual(toLittleEndianBytes(new Int32Array(bigEndianInts.buffer), false), wireInts);
  assert.deepEqual(new Uint8Array(fromLittleEndianBytes("i4", wireInts, false).buffer), bigEndianInts);

  // Single bytes have no order.
  const bytes = Uint8Array.of(1, 2, 3);
  assert.deepEqual(toLittleEndianBytes(bytes, false), bytes);
  assert.deepEqual(fromLittleEndianBytes("u1", bytes, false), bytes);

  // A NaN payload survives the swap: the bytes are moved, never interpreted.
  const payload = Uint8Array.of(0x7f, 0xf8, 0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe);
  const swapped = toLittleEndianBytes(new Float64Array(payload.buffer), false);
  assert.deepEqual(swapped, Uint8Array.from(payload).reverse());
  assert.deepEqual(new Uint8Array(fromLittleEndianBytes("f8", swapped, false).buffer), payload);
});

test("the byte helpers copy: neither result shares memory with its input", () => {
  const values = Float64Array.of(1, 2);
  const bytes = toLittleEndianBytes(values);
  assert.notEqual(bytes.buffer, values.buffer);
  assert.equal(bytes.length, 16);

  const back = fromLittleEndianBytes("f8", bytes);
  assert.notEqual(back.buffer, bytes.buffer);
  assert.deepEqual(back, values);

  const sameBytes = fromLittleEndianBytes("u1", bytes);
  assert.notEqual(sameBytes.buffer, bytes.buffer);
  assert.deepEqual(sameBytes, bytes);
});

test("fromLittleEndianBytes aligns bytes that start at any offset", () => {
  const padded = new Uint8Array(17);
  padded.set(toLittleEndianBytes(Float64Array.of(1, -2)), 1);
  const unaligned = padded.subarray(1);
  assert.equal(unaligned.byteOffset % 8, 1);
  assert.deepEqual(fromLittleEndianBytes("f8", unaligned), Float64Array.of(1, -2));
});

test("fromLittleEndianBytes rejects a byte count that is not a whole number of elements", () => {
  throwsMessage(
    () => fromLittleEndianBytes("f8", new Uint8Array(12)),
    "ndarray: 12 bytes is not a whole number of f8 elements (8 bytes)",
  );
  throwsMessage(
    () => fromLittleEndianBytes("i4", new Uint8Array(6)),
    "ndarray: 6 bytes is not a whole number of i4 elements (4 bytes)",
  );
});
