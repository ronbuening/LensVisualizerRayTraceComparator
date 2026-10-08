"""The bit-exact wire form of a numeric array, as ``src/core/numeric/ndarray.ts`` accepts and emits it:

    { "$nd": { "dtype": "f8", "shape": [2, 3], "data": "<base64>", "sha256": "<hex>" } }

``data`` is the elements in C (row-major) order as little-endian bytes, in standard padded base64 without
whitespace. ``sha256`` is the lowercase hex digest of those bytes. Plain JSON numbers cannot carry NaN, the
infinities or -0; this form carries every bit pattern unchanged.

A decoded array keeps its bytes, and the bytes are the truth: elements are read and written with ``struct`` and an
explicit ``<``, so nothing depends on the byte order of the host. Code that must keep a NaN's payload copies the
element's bytes and does not pass it through arithmetic, which may replace the payload.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
import json
import math
import re
import struct
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

DTYPES: tuple[str, ...] = ("f8", "i4", "u1")
"""Element types of the wire form: IEEE 754 float64, two's-complement int32 and uint8."""

ITEM_SIZE: dict[str, int] = {"f8": 8, "i4": 4, "u1": 1}
"""The size of one element of each dtype, in bytes."""

_STRUCT_CODE = {"f8": "d", "i4": "i", "u1": "B"}
_WIRE_KEYS = ("dtype", "shape", "data", "sha256")
_SHA256_HEX = re.compile(r"[0-9a-f]{64}")
_MAX_SAFE_INTEGER = 2**53 - 1
# Stands for a member that is not there, which error messages show as ECMAScript does.
_MISSING: Any = object()


class NdArrayError(ValueError):
    """A value that is not the wire form, or values that cannot be written in it. The message says what is wrong."""


@dataclass(frozen=True)
class NdArray:
    """A decoded array: ``data`` is the elements in C order as little-endian bytes, ``shape``'s product of them."""

    dtype: str
    shape: tuple[int, ...]
    data: bytes

    @property
    def count(self) -> int:
        """How many elements the array holds."""
        return len(self.data) // ITEM_SIZE[self.dtype]

    def values(self) -> list[Any]:
        """The elements in C order: floats for f8, ints for i4 and u1. For a NaN's payload, read ``data``."""
        return list(struct.unpack(f"<{self.count}{_STRUCT_CODE[self.dtype]}", self.data))


def _show(value: Any) -> str:
    """A value as an error message shows it, in the words the TypeScript codec uses."""
    if value is _MISSING:
        return "undefined"
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, (list, tuple)):
        return f"[{','.join(_show(item) for item in value)}]"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        if math.isnan(value):
            return "NaN"
        if math.isinf(value):
            return "Infinity" if value > 0 else "-Infinity"
        return str(int(value)) if value.is_integer() and abs(value) < 1e21 else repr(value)
    return "an object"


def _is_shape(shape: Any) -> bool:
    if not isinstance(shape, (list, tuple)):
        return False
    for size in shape:
        if isinstance(size, bool) or not isinstance(size, (int, float)):
            return False
        if isinstance(size, float) and not (math.isfinite(size) and size.is_integer()):
            return False
        if size < 0 or size > _MAX_SAFE_INTEGER:
            return False
    return True


def _shape_problem(shape: Any) -> str | None:
    return None if _is_shape(shape) else f"shape must be an array of non-negative integers, got {_show(shape)}"


def _element_count(shape: Sequence[Any]) -> int:
    count = 1
    for size in shape:
        count *= int(size)
    return count


def _wire_problem(value: Any) -> str | None:
    """Why a value is not the wire form, or None when it is. Structure only: the bytes are not looked at."""
    if not isinstance(value, dict) or "$nd" not in value:
        return 'expected an object with a "$nd" key'
    beside = next((key for key in value if key != "$nd"), _MISSING)
    if beside is not _MISSING:
        return f'unexpected key {_show(beside)} beside "$nd"'
    nd = value["$nd"]
    if not isinstance(nd, dict):
        return '"$nd" must be an object'
    extra = next((key for key in nd if key not in _WIRE_KEYS), _MISSING)
    if extra is not _MISSING:
        return f'unknown key {_show(extra)} in "$nd"'
    dtype = nd.get("dtype", _MISSING)
    if not isinstance(dtype, str) or dtype not in DTYPES:
        return f"dtype must be one of {', '.join(DTYPES)}, got {_show(dtype)}"
    shape = _shape_problem(nd.get("shape", _MISSING))
    if shape is not None:
        return shape
    data = nd.get("data", _MISSING)
    if not isinstance(data, str):
        return f"data must be a base64 string, got {_show(data)}"
    sha256 = nd.get("sha256", _MISSING)
    if not isinstance(sha256, str) or _SHA256_HEX.fullmatch(sha256) is None:
        return f"sha256 must be 64 lowercase hex characters, got {_show(sha256)}"
    return None


def is_ndarray(value: Any) -> bool:
    """True exactly when ``value`` has the structure of the wire form.

    That is: an object whose only key is ``$nd``, holding a known dtype, a shape of non-negative integers, a string
    ``data``, a 64-character lowercase hex ``sha256`` and no other key. ``data`` is not decoded, so a true result
    does not mean ``decode_ndarray`` will accept the bytes.
    """
    return _wire_problem(value) is None


def encode_ndarray_bytes(dtype: str, data: bytes, shape: Sequence[int] | None = None) -> dict[str, Any]:
    """Encodes little-endian element bytes in the wire form, bit for bit. ``shape`` defaults to one axis.

    Raises an ``NdArrayError`` when ``dtype`` is not a dtype of the wire form, when ``data`` is not a whole number
    of elements, and when ``shape`` is not a list of non-negative integers whose product is the element count.
    """
    if not isinstance(dtype, str) or dtype not in DTYPES:
        raise NdArrayError(f"ndarray: dtype must be one of {', '.join(DTYPES)}, got {_show(dtype)}")
    raw = bytes(data)
    item_size = ITEM_SIZE[dtype]
    if len(raw) % item_size != 0:
        raise NdArrayError(f"ndarray: {len(raw)} bytes is not a whole number of {dtype} elements ({item_size} bytes)")
    length = len(raw) // item_size
    if shape is None:
        shape = [length]
    problem = _shape_problem(shape)
    if problem is not None:
        raise NdArrayError(f"ndarray: {problem}")
    count = _element_count(shape)
    if count != length:
        raise NdArrayError(f"ndarray: the product of shape {_show(shape)} is {count} but the array length is {length}")
    return {
        "$nd": {
            "dtype": dtype,
            "shape": [int(size) for size in shape],
            "data": base64.b64encode(raw).decode("ascii"),
            "sha256": hashlib.sha256(raw).hexdigest(),
        }
    }


def encode_ndarray(dtype: str, values: Sequence[Any], shape: Sequence[int] | None = None) -> dict[str, Any]:
    """Encodes numbers in the wire form: ``values`` is the flat sequence in C order; ``shape`` defaults to one axis.

    -0, the infinities and subnormals keep their bits. So does a NaN on the processors CPython runs on today, but
    only ``encode_ndarray_bytes`` promises it. Raises an ``NdArrayError`` as ``encode_ndarray_bytes`` does, and for
    a value its dtype cannot hold.
    """
    if not isinstance(dtype, str) or dtype not in DTYPES:
        raise NdArrayError(f"ndarray: dtype must be one of {', '.join(DTYPES)}, got {_show(dtype)}")
    try:
        raw = struct.pack(f"<{len(values)}{_STRUCT_CODE[dtype]}", *values)
    except (struct.error, TypeError, OverflowError) as error:
        raise NdArrayError(f"ndarray: the values cannot be written as {dtype}: {error}") from error
    return encode_ndarray_bytes(dtype, raw, shape)


def decode_ndarray(wire: Any) -> NdArray:
    """Decodes the wire form, bit for bit.

    Raises an ``NdArrayError`` saying what is wrong unless all of these hold: the structure is the one
    ``is_ndarray`` accepts; ``data`` is canonical base64 (standard alphabet, padded, no whitespace); its byte
    length is the shape's product times the element size; and the bytes hash to ``sha256``.
    """
    problem = _wire_problem(wire)
    if problem is not None:
        raise NdArrayError(f"ndarray: {problem}")
    nd = wire["$nd"]
    dtype, shape, data, sha256 = nd["dtype"], nd["shape"], nd["data"], nd["sha256"]
    try:
        raw = base64.b64decode(data.encode("ascii"), validate=True)
    except (binascii.Error, UnicodeEncodeError, ValueError):
        raw = None
    # A lenient decoder accepts unused trailing bits; the only strict test is encoding the result again.
    if raw is None or base64.b64encode(raw).decode("ascii") != data:
        raise NdArrayError("ndarray: data is not canonical base64 (standard alphabet, padded, no whitespace)")
    expected = _element_count(shape) * ITEM_SIZE[dtype]
    if len(raw) != expected:
        raise NdArrayError(f"ndarray: data is {len(raw)} bytes but shape {_show(shape)} of {dtype} needs {expected}")
    actual = hashlib.sha256(raw).hexdigest()
    if actual != sha256:
        raise NdArrayError(f"ndarray: sha256 mismatch: the data hashes to {actual} but the wire form says {sha256}")
    return NdArray(dtype=dtype, shape=tuple(int(size) for size in shape), data=raw)
