"""The array codec, pinned to the same literals as test/core/numeric/ndarray.test.ts."""

from __future__ import annotations

import base64
import hashlib
import math
import struct
import unittest
from typing import Any

from lvrtc_worker_kit.ndarray import (
    DTYPES,
    NdArrayError,
    decode_ndarray,
    encode_ndarray,
    encode_ndarray_bytes,
    is_ndarray,
)

from .support import bits_of, f8_bytes

EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

F8_WIRE: dict[str, Any] = {
    "$nd": {
        "dtype": "f8",
        "shape": [3],
        "data": "AAAAAAAA8D8AAAAAAAAAwAAAAAAAAOA/",
        "sha256": "eb9c7e25b0c32384869e705808d06581e674741e70c99a2fd7e42f1b4e22d6c1",
    }
}
F8_VALUES = [1.0, -2.0, 0.5]

# The bit patterns of the TypeScript round-trip test, in its order.
BIT_PATTERNS = [
    0x7FF8000000000000,  # the default quiet NaN
    0x7FF8000000000001,  # quiet NaN, payload 1
    0xFFF8DEADBEEFCAFE,  # negative quiet NaN with a payload
    0x7FF0000000000001,  # signalling NaN
    0xFFF4000000C0FFEE,  # negative signalling NaN with a payload
    0x8000000000000000,  # -0
    0x0000000000000000,  # +0
    0x7FF0000000000000,  # +infinity
    0xFFF0000000000000,  # -infinity
    0x0000000000000001,  # smallest subnormal
    0x000FFFFFFFFFFFFF,  # largest subnormal
    0x800FFFFFFFFFFFFF,  # largest negative subnormal
    0x0010000000000000,  # smallest normal
    0x7FEFFFFFFFFFFFFF,  # largest finite
    0x3FF0000000000001,  # 1 + 2^-52
    0x0123456789ABCDEF,  # every byte different
]


def tampered(**fields: Any) -> dict[str, Any]:
    """The wire example with some fields of ``$nd`` replaced."""
    return {"$nd": {**F8_WIRE["$nd"], **fields}}


def without(*names: str) -> dict[str, Any]:
    """The wire example with some fields of ``$nd`` left out."""
    return {"$nd": {name: value for name, value in F8_WIRE["$nd"].items() if name not in names}}


class NdArrayTest(unittest.TestCase):
    def assert_raises_message(self, wire: Any, message: str) -> None:
        with self.assertRaises(NdArrayError) as raised:
            decode_ndarray(wire)
        self.assertEqual(str(raised.exception), message)

    def test_float64_is_written_least_significant_byte_first_a_pinned_wire_example(self) -> None:
        self.assertEqual(encode_ndarray("f8", F8_VALUES), F8_WIRE)
        self.assertEqual(list(base64.b64decode(F8_WIRE["$nd"]["data"])[:8]), [0, 0, 0, 0, 0, 0, 0xF0, 0x3F])
        decoded = decode_ndarray(F8_WIRE)
        self.assertEqual((decoded.dtype, decoded.shape, decoded.count), ("f8", (3,), 3))
        self.assertEqual(decoded.values(), F8_VALUES)
        self.assertEqual(DTYPES, ("f8", "i4", "u1"))

    def test_pinned_wire_examples_for_minus_zero_a_subnormal_infinity_int32_uint8_and_a_2d_shape(self) -> None:
        cases: list[tuple[str, list[Any], list[int], str, str]] = [
            (
                "f8",
                [1.5, -0.0, 1e-310, math.inf],
                [4],
                "AAAAAAAA+D8AAAAAAAAAgCvmcItoEgAAAAAAAAAA8H8=",
                "f35e88d4f6244ee946acaf047e13c0aa0e46ab66f6113b8a26ddfefac87cb916",
            ),
            (
                "i4",
                [1, -2, 0x01020304],
                [3],
                "AQAAAP7///8EAwIB",
                "6842fbd017dc4705a6401f5a0e4db51bbd3167cc224da5a28f51e3c5b6ec4df7",
            ),
            (
                "u1",
                [0, 1, 254, 255],
                [4],
                "AAH+/w==",
                "c5dbae22661af6db18a1f676db82a7ef7de46d27c3a263a872f00478b0d99fc4",
            ),
            (
                "f8",
                [0.0, 1.0, 2.0, 3.0, 4.0, 5.0],
                [2, 3],
                "AAAAAAAAAAAAAAAAAADwPwAAAAAAAABAAAAAAAAACEAAAAAAAAAQQAAAAAAAABRA",
                "84a6e8b7afdd286a48ab0aab2c72227fff91a935b0489e633018914bd01693cd",
            ),
        ]
        for dtype, values, shape, data, sha256 in cases:
            wire = encode_ndarray(dtype, values, shape)
            self.assertEqual(wire, {"$nd": {"dtype": dtype, "shape": shape, "data": data, "sha256": sha256}})
            decoded = decode_ndarray(wire)
            self.assertEqual(decoded.shape, tuple(shape))
            self.assertEqual(decoded.values(), values)
            self.assertEqual(encode_ndarray_bytes(dtype, decoded.data, decoded.shape), wire)
        self.assertEqual(list(base64.b64decode(encode_ndarray("i4", [0x01020304])["$nd"]["data"])), [4, 3, 2, 1])
        self.assertEqual(math.copysign(1.0, decode_ndarray(encode_ndarray("f8", [-0.0])).values()[0]), -1.0)

    def test_float64_round_trips_bit_for_bit_nan_payloads_minus_zero_infinities_subnormals(self) -> None:
        raw = f8_bytes(*BIT_PATTERNS)
        wire = encode_ndarray_bytes("f8", raw)
        self.assertEqual(wire["$nd"]["shape"], [16])
        self.assertEqual(
            list(base64.b64decode(wire["$nd"]["data"])[-8:]), [0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01]
        )
        self.assertEqual(wire["$nd"]["sha256"], hashlib.sha256(raw).hexdigest())

        decoded = decode_ndarray(wire)
        self.assertEqual(decoded.data, raw)
        self.assertEqual(bits_of(decoded.data), BIT_PATTERNS)
        values = decoded.values()
        self.assertTrue(all(math.isnan(value) for value in values[:5]))
        self.assertEqual((values[5], math.copysign(1.0, values[5])), (0.0, -1.0))
        self.assertEqual((values[6], math.copysign(1.0, values[6])), (0.0, 1.0))
        self.assertEqual(values[7:10], [math.inf, -math.inf, 5e-324])
        self.assertEqual(values[13], 1.7976931348623157e308)
        # Encoding what was decoded gives the same wire value, digest included.
        self.assertEqual(encode_ndarray_bytes("f8", decoded.data, decoded.shape), wire)
        # Everything that is not a NaN also survives being read as a float and packed again.
        self.assertEqual(encode_ndarray("f8", values[5:])["$nd"]["data"], base64.b64encode(raw[40:]).decode())

    def test_the_bytes_do_not_depend_on_the_byte_order_of_the_host(self) -> None:
        # The codec names "<" itself; the native and the big-endian forms are what it must not use.
        self.assertEqual(base64.b64decode(F8_WIRE["$nd"]["data"]), struct.pack("<3d", *F8_VALUES))
        self.assertNotEqual(base64.b64decode(F8_WIRE["$nd"]["data"]), struct.pack(">3d", *F8_VALUES))
        self.assertEqual(base64.b64decode(encode_ndarray("i4", [1])["$nd"]["data"]), b"\x01\x00\x00\x00")

    def test_int32_and_uint8_round_trip_over_their_whole_range(self) -> None:
        ints = [0, 1, -1, 2147483647, -2147483648, 0x01020304, -0x01020304]
        self.assertEqual(decode_ndarray(encode_ndarray("i4", ints)).values(), ints)
        octets = list(range(256))
        self.assertEqual(decode_ndarray(encode_ndarray("u1", octets)).values(), octets)

    def test_empty_arrays_round_trip_for_every_dtype(self) -> None:
        for dtype in DTYPES:
            wire = encode_ndarray(dtype, [])
            self.assertEqual(wire, {"$nd": {"dtype": dtype, "shape": [0], "data": "", "sha256": EMPTY_SHA256}})
            decoded = decode_ndarray(wire)
            self.assertEqual((decoded.dtype, decoded.shape, decoded.count, decoded.values()), (dtype, (0,), 0, []))
            wide = decode_ndarray(encode_ndarray(dtype, [], [0, 3]))
            self.assertEqual((wide.shape, wide.count), ((0, 3), 0))

    def test_a_shape_is_kept_as_given_when_its_product_is_the_element_count(self) -> None:
        values = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]
        for shape in ([6], [2, 3], [3, 2], [1, 6], [6, 1], [1, 2, 3, 1]):
            decoded = decode_ndarray(encode_ndarray("f8", values, shape))
            self.assertEqual((decoded.shape, decoded.values()), (tuple(shape), values))
        # No axes at all is a single element.
        self.assertEqual(decode_ndarray(encode_ndarray("f8", [7.0], [])).shape, ())
        # A shape written with floats, as JSON may, is the same shape.
        self.assertEqual(decode_ndarray(tampered(shape=[3.0])).shape, (3,))
        self.assertEqual(encode_ndarray("f8", values, [2.0, 3])["$nd"]["shape"], [2, 3])

    def test_encode_rejects_a_shape_that_does_not_fit_and_values_the_dtype_cannot_hold(self) -> None:
        values = [0.0] * 6
        cases: list[tuple[list[Any], str]] = [
            ([5], "ndarray: the product of shape [5] is 5 but the array length is 6"),
            ([2, 4], "ndarray: the product of shape [2,4] is 8 but the array length is 6"),
            ([], "ndarray: the product of shape [] is 1 but the array length is 6"),
            ([0, 6], "ndarray: the product of shape [0,6] is 0 but the array length is 6"),
            ([-2, -3], "ndarray: shape must be an array of non-negative integers, got [-2,-3]"),
            ([1.5, 4], "ndarray: shape must be an array of non-negative integers, got [1.5,4]"),
            ([math.nan], "ndarray: shape must be an array of non-negative integers, got [NaN]"),
            ([6, math.inf], "ndarray: shape must be an array of non-negative integers, got [6,Infinity]"),
        ]
        for shape, message in cases:
            with self.assertRaises(NdArrayError) as raised:
                encode_ndarray("f8", values, shape)
            self.assertEqual(str(raised.exception), message)
        for dtype, bad in (("i4", [2**31]), ("u1", [256]), ("u1", [-1]), ("i4", [1.5]), ("f8", ["1"])):
            with self.assertRaisesRegex(NdArrayError, f"^ndarray: the values cannot be written as {dtype}: "):
                encode_ndarray(dtype, bad)
        with self.assertRaisesRegex(NdArrayError, '^ndarray: dtype must be one of f8, i4, u1, got "f4"$'):
            encode_ndarray("f4", [1.0])
        with self.assertRaisesRegex(
            NdArrayError, r"^ndarray: 7 bytes is not a whole number of f8 elements \(8 bytes\)$"
        ):
            encode_ndarray_bytes("f8", b"\0" * 7)

    def test_tampered_data_digest_shape_or_dtype_is_rejected(self) -> None:
        actual = F8_WIRE["$nd"]["sha256"]
        # One base64 character changed: still canonical, same length, different bytes.
        flipped = "AAAAAAAA8D8AAAAAAAAAwAAAAAAAAOB/"
        flipped_sha = hashlib.sha256(base64.b64decode(flipped)).hexdigest()
        self.assert_raises_message(
            tampered(data=flipped),
            f"ndarray: sha256 mismatch: the data hashes to {flipped_sha} but the wire form says {actual}",
        )
        other_sha = "0" + actual[1:]
        self.assert_raises_message(
            tampered(sha256=other_sha),
            f"ndarray: sha256 mismatch: the data hashes to {actual} but the wire form says {other_sha}",
        )
        self.assert_raises_message(tampered(shape=[4]), "ndarray: data is 24 bytes but shape [4] of f8 needs 32")
        self.assert_raises_message(tampered(shape=[2]), "ndarray: data is 24 bytes but shape [2] of f8 needs 16")
        self.assert_raises_message(tampered(shape=[3, 2]), "ndarray: data is 24 bytes but shape [3,2] of f8 needs 48")
        self.assert_raises_message(tampered(shape=[]), "ndarray: data is 24 bytes but shape [] of f8 needs 8")
        self.assert_raises_message(tampered(dtype="i4"), "ndarray: data is 24 bytes but shape [3] of i4 needs 12")
        self.assert_raises_message(tampered(dtype="u1"), "ndarray: data is 24 bytes but shape [3] of u1 needs 3")
        # Truncated data is caught by its length even when the digest was recomputed to match.
        truncated = base64.b64decode(F8_WIRE["$nd"]["data"])[:23]
        self.assert_raises_message(
            tampered(data=base64.b64encode(truncated).decode(), sha256=hashlib.sha256(truncated).hexdigest()),
            "ndarray: data is 23 bytes but shape [3] of f8 needs 24",
        )
        # The digest covers the bytes only: the same bytes under another shape of equal size decode.
        self.assertEqual(decode_ndarray(tampered(shape=[1, 3])).values(), F8_VALUES)

    def test_data_that_is_not_canonical_base64_is_rejected(self) -> None:
        message = "ndarray: data is not canonical base64 (standard alphabet, padded, no whitespace)"
        octets = bytes([0, 1, 254, 255])
        sha256 = hashlib.sha256(octets).hexdigest()

        def wire(data: str) -> dict[str, Any]:
            return {"$nd": {"dtype": "u1", "shape": [4], "data": data, "sha256": sha256}}

        self.assertEqual(decode_ndarray(wire("AAH+/w==")).data, octets)
        variants = [
            "AAH-_w==",  # URL-safe alphabet
            "AAH+/w",  # padding removed
            "AAH+/w=",  # padding cut short
            "AAH+\n/w==",  # line break
            " AAH+/w==",  # leading space
            "AAH+/w== ",  # trailing space
            "AAH+/x==",  # same bytes, unused trailing bits set
            "AAH+/w==AA==",  # data after the padding
            "AAH+/w==!",  # a character outside the alphabet
            "AAH+/w==\n",  # a trailing newline
            "AAH+/é==",  # a character that is not ASCII
        ]
        for data in variants:
            self.assert_raises_message(wire(data), message)

    def test_a_value_without_the_wire_structure_is_rejected_by_decode_and_by_is_ndarray(self) -> None:
        nd = F8_WIRE["$nd"]
        dtype, shape, data, sha256 = nd["dtype"], nd["shape"], nd["data"], nd["sha256"]
        no_key = 'ndarray: expected an object with a "$nd" key'
        bad_shape = "ndarray: shape must be an array of non-negative integers, got"
        bad_sha = "ndarray: sha256 must be 64 lowercase hex characters, got"
        cases: list[tuple[Any, str]] = [
            (None, no_key),
            (5, no_key),
            ("$nd", no_key),
            ([], no_key),
            ([F8_WIRE], no_key),
            ({}, no_key),
            ({"nd": nd}, no_key),
            ({**F8_WIRE, "unit": "mm"}, 'ndarray: unexpected key "unit" beside "$nd"'),
            ({"$nd": None}, 'ndarray: "$nd" must be an object'),
            ({"$nd": [dtype, shape, data, sha256]}, 'ndarray: "$nd" must be an object'),
            ({"$nd": data}, 'ndarray: "$nd" must be an object'),
            (tampered(order="C"), 'ndarray: unknown key "order" in "$nd"'),
            (tampered(dtype="f4"), 'ndarray: dtype must be one of f8, i4, u1, got "f4"'),
            (tampered(dtype="F8"), 'ndarray: dtype must be one of f8, i4, u1, got "F8"'),
            (tampered(dtype=8), "ndarray: dtype must be one of f8, i4, u1, got 8"),
            (without("dtype"), "ndarray: dtype must be one of f8, i4, u1, got undefined"),
            (tampered(shape=[3, -1]), f"{bad_shape} [3,-1]"),
            (tampered(shape=[1.5]), f"{bad_shape} [1.5]"),
            (tampered(shape=["3"]), f'{bad_shape} ["3"]'),
            (tampered(shape=[None]), f"{bad_shape} [null]"),
            (tampered(shape=[True]), f"{bad_shape} [true]"),
            (tampered(shape=[2**53]), f"{bad_shape} [9007199254740992]"),
            (tampered(shape=3), f"{bad_shape} 3"),
            (tampered(shape="3"), f'{bad_shape} "3"'),
            (tampered(shape={"length": 1, "0": 3}), f"{bad_shape} an object"),
            (without("shape"), f"{bad_shape} undefined"),
            (tampered(data=5), "ndarray: data must be a base64 string, got 5"),
            (tampered(data=[0, 0]), "ndarray: data must be a base64 string, got [0,0]"),
            (without("data"), "ndarray: data must be a base64 string, got undefined"),
            (tampered(sha256=sha256.upper()), f'{bad_sha} "{sha256.upper()}"'),
            (tampered(sha256=sha256[1:]), f'{bad_sha} "{sha256[1:]}"'),
            (tampered(sha256=sha256 + "0"), f'{bad_sha} "{sha256}0"'),
            (tampered(sha256=sha256 + "\n"), f'{bad_sha} "{sha256}\\n"'),
            (tampered(sha256=None), f"{bad_sha} null"),
            (without("sha256"), f"{bad_sha} undefined"),
        ]
        for value, message in cases:
            self.assertFalse(is_ndarray(value), message)
            self.assert_raises_message(value, message)

    def test_is_ndarray_accepts_the_wire_structure_without_checking_the_bytes(self) -> None:
        self.assertTrue(is_ndarray(F8_WIRE))
        self.assertTrue(is_ndarray(encode_ndarray("u1", [])))
        wrong_digest = tampered(sha256=EMPTY_SHA256)
        self.assertTrue(is_ndarray(wrong_digest))
        with self.assertRaisesRegex(NdArrayError, "sha256 mismatch"):
            decode_ndarray(wrong_digest)
        not_base64 = tampered(data="not base64!")
        self.assertTrue(is_ndarray(not_base64))
        with self.assertRaisesRegex(NdArrayError, "not canonical base64"):
            decode_ndarray(not_base64)


if __name__ == "__main__":
    unittest.main()
