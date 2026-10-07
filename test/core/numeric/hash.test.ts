import assert from "node:assert/strict";
import { test } from "node:test";

import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import { hashCanonical, sha256Hex } from "../../../src/core/numeric/hash.ts";

const EMPTY = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const ABC = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

test("sha256Hex matches the FIPS 180-4 vectors for strings", () => {
  assert.equal(sha256Hex(""), EMPTY);
  assert.equal(sha256Hex("abc"), ABC);
  assert.equal(
    sha256Hex("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"),
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  );
});

test("sha256Hex hashes bytes as they are", () => {
  assert.equal(sha256Hex(new Uint8Array(0)), EMPTY);
  assert.equal(sha256Hex(Uint8Array.of(0x61, 0x62, 0x63)), ABC);
  assert.equal(sha256Hex(Buffer.from("abc")), ABC);
});

test("sha256Hex hashes only the bytes a view covers", () => {
  const padded = Uint8Array.of(0xff, 0x61, 0x62, 0x63, 0xff);
  assert.equal(sha256Hex(padded.subarray(1, 4)), ABC);
  assert.equal(sha256Hex(padded.subarray(2, 2)), EMPTY);
});

test("sha256Hex hashes a string as UTF-8", () => {
  const eAcute = "4a99557e4033c3539de2eb65472017cad5f9557f7a0625a09f1c3f6e2ba69c4c";
  assert.equal(sha256Hex("é"), eAcute);
  assert.equal(sha256Hex(Uint8Array.of(0xc3, 0xa9)), eAcute);
  assert.equal(sha256Hex("😀"), sha256Hex(Uint8Array.of(0xf0, 0x9f, 0x98, 0x80)));
});

test("sha256Hex is lowercase hex of 64 characters", () => {
  assert.match(sha256Hex("anything"), /^[0-9a-f]{64}$/);
});

test("hashCanonical is the sha256 of the canonical text", () => {
  assert.equal(hashCanonical({}), "44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a");
  // sha256 of the bytes {"a":1,"b":[true,null,"x"]}
  const pinned = "eca8cfb31ab74533e1eb2f4c74d2d55dfe3c79ac704787e54be8647ea7777eb1";
  assert.equal(hashCanonical({ b: [true, null, "x"], a: 1 }), pinned);

  const value = { z: [1.5, { y: "é", x: null }], a: -0 };
  assert.equal(hashCanonical(value), sha256Hex(canonicalJson(value)));
});

test("hashCanonical ignores key insertion order and nothing else", () => {
  const hash = hashCanonical({ a: 1, b: { c: 2, d: [1, 2] } });
  assert.equal(hashCanonical({ b: { d: [1, 2], c: 2 }, a: 1 }), hash);
  assert.notEqual(hashCanonical({ a: 1, b: { c: 2, d: [2, 1] } }), hash);
  assert.notEqual(hashCanonical({ a: 1, b: { c: 2, d: [1, 2.0000000000000004] } }), hash);
  assert.notEqual(hashCanonical({ a: "1", b: { c: 2, d: [1, 2] } }), hash);
});

test("hashCanonical tells a lone surrogate from the replacement character", () => {
  // Canonical text escapes a lone surrogate, so UTF-8 encoding never has to replace it.
  assert.notEqual(hashCanonical("\ud800"), hashCanonical("\ufffd"));
  assert.notEqual(hashCanonical("\ud800"), hashCanonical("\udfff"));
});

test("hashCanonical rejects what canonicalJson rejects", () => {
  assert.throws(() => hashCanonical({ a: [NaN] }), { message: "canonicalJson: non-finite number NaN at $.a[0]" });
  assert.throws(() => hashCanonical(new Map()), { message: "canonicalJson: non-plain object (Map) at $" });
});
