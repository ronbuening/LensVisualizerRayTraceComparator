"""The fake engine as a worker: a whole engine that knows no optics, behind the NDJSON protocol.

    python -m lvrtc_worker_kit.fake_engine [--id ID] [--bias X] [--no-quantities] [--fingerprint F]

It answers ``selftest.echo`` as contract/CONTRACT.md defines it and nothing else, with the semantics and the
options of the TypeScript fake (``src/engines/fake/engine.ts``), so that either can stand in for the other: for
one request the two give byte-equal arrays and equal sums.

Options come from the environment variable ``LVRTC_ENGINE_OPTIONS``, a JSON object with the members ``id``,
``bias``, ``offersQuantities`` and ``fingerprint`` (what the comparator's stdio transport sets from the engine's
configured ``options``), and from the command line, which wins. ``id`` is needed from one of the two.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import struct
import sys
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from . import CONTRACT_VERSION
from .ndarray import NdArrayError, decode_ndarray, encode_ndarray_bytes
from .protocol import engine_stamp, make_result, parse_json, serve_stdio
from .validate import SchemaSet, contract_schemas, format_issues, quantity_schema_id, validate

SELFTEST_ECHO = "selftest.echo"
"""The id of the conformance quantity."""

SELFTEST_ECHO_VERSION = 1
"""The version of ``selftest.echo``'s definition that this engine implements."""

FAKE_ENGINE_VERSION = "1"
"""The version of the fake engine's behaviour, the same as the TypeScript fake's."""

FEATURE_FLAGS: tuple[str, ...] = (
    "aperture.annular",
    "lines.multiple",
    "object.finite",
    "surface.asphere.even",
    "surface.asphere.flat-base",
    "surface.asphere.odd",
    "surface.conic",
)
"""Every feature flag of the contract (``src/contract/features.ts``). The fake supports them all: it reads no case."""

OPTIONS_VARIABLE = "LVRTC_ENGINE_OPTIONS"
"""The environment variable that carries the engine's configured options as a JSON object."""

_OPTION_NAMES = ("bias", "fingerprint", "id", "offersQuantities")
_ENGINE_ID = re.compile(r"[a-z][a-z0-9-]*")
_F8 = struct.Struct("<d")
# The quiet NaN with no payload, 7ff8000000000000, least significant byte first.
_QUIET_NAN = bytes.fromhex("000000000000f87f")


class FakeOptionsError(ValueError):
    """Options that are not the fake engine's. The message names the option."""


@dataclass(frozen=True)
class FakeOptions:
    """The fake engine's options with every default filled in."""

    id: str
    """The engine id its descriptor and results carry."""
    bias: float = 0.0
    """Added to every value it echoes that is not a NaN; 0 adds nothing."""
    offers_quantities: bool = True
    """False: it declares no quantity and answers every run "unsupported"."""
    fingerprint: str = ""
    """The fingerprint it reports: the one given, else ``kit_fingerprint`` of the other options."""


def echo_values(data: bytes, scale: float, bias: float = 0.0) -> tuple[bytes, float | None]:
    """Scales float64 elements, given and returned as little-endian bytes, and sums the outcome.

    - An element that is a NaN is copied bit for bit, sign and payload included, and takes no part in arithmetic.
    - Any other element becomes ``element * scale``, then ``+ bias`` when ``bias`` is not 0: one IEEE 754 double
      operation each, so with a scale of 1 and no bias -0, the infinities and subnormals keep their bits.
    - An outcome that is a NaN the arithmetic made (an infinity times 0) is written as ``7ff8000000000000``.
    - The sum is the running sum of the outcomes in index order, starting from 0, each addition rounded on its
      own: a plain loop, never ``sum()`` or ``math.fsum``, which round differently. None when it is not finite.
    """
    scale = float(scale)
    bias = float(bias)
    echoed = bytearray(data)
    total = 0.0
    for offset in range(0, len(echoed), 8):
        (value,) = _F8.unpack_from(echoed, offset)
        if value != value:
            # Left as the bytes it came as: packing a NaN again is not promised to keep its payload.
            total += value
            continue
        outcome = value * scale if bias == 0 else value * scale + bias
        if outcome != outcome:
            echoed[offset : offset + 8] = _QUIET_NAN
        else:
            _F8.pack_into(echoed, offset, outcome)
        total += outcome
    return bytes(echoed), (total if math.isfinite(total) else None)


def kit_fingerprint(options: FakeOptions) -> str:
    """The fingerprint of a fake engine that was given none: a SHA-256 over the kit's own sources and its options.

    Equal sources and equal options give an equal fingerprint on any machine; a change to either gives another.
    Line endings are read as LF, so a checkout that rewrites them changes nothing.
    """
    digest = hashlib.sha256()
    for source in sorted(Path(__file__).resolve().parent.glob("*.py"), key=lambda path: path.name):
        digest.update(source.name.encode("utf-8") + b"\0")
        digest.update(source.read_bytes().replace(b"\r\n", b"\n") + b"\0")
    stated = {
        "engine": "lvrtc-fake-python",
        "version": FAKE_ENGINE_VERSION,
        "options": {"id": options.id, "bias": options.bias, "offersQuantities": options.offers_quantities},
    }
    digest.update(json.dumps(stated, sort_keys=True, separators=(",", ":")).encode("utf-8"))
    return digest.hexdigest()


def parse_fake_options(given: Mapping[str, Any]) -> FakeOptions:
    """Checks the options a fake engine is created with and fills in the defaults.

    The members are those of the TypeScript fake: ``id``, and optionally ``bias`` (0), ``offersQuantities`` (true)
    and ``fingerprint`` (derived). ``failMode`` is accepted only as "none": this fake does not misbehave. Raises a
    ``FakeOptionsError`` naming the option for one the fake does not have and for a value of the wrong kind.
    """
    if not isinstance(given, Mapping):
        raise FakeOptionsError("fake engine: options must be an object")
    members = dict(given)
    if members.pop("failMode", "none") != "none":
        raise FakeOptionsError('fake engine: option "failMode" can only be "none" for the Python fake')
    unknown = next((name for name in members if name not in _OPTION_NAMES), None)
    if unknown is not None:
        raise FakeOptionsError(f'fake engine: unknown option "{unknown}" (it has {", ".join(_OPTION_NAMES)})')

    engine_id = members.get("id")
    if not isinstance(engine_id, str) or _ENGINE_ID.fullmatch(engine_id) is None:
        raise FakeOptionsError(
            'fake engine: option "id" must be an engine id: a lowercase letter, then lowercase letters, digits or "-"'
        )
    bias = members.get("bias", 0.0)
    if isinstance(bias, bool) or not isinstance(bias, (int, float)):
        raise FakeOptionsError('fake engine: option "bias" must be a finite number')
    try:
        bias = float(bias)
    except OverflowError:
        bias = math.inf
    if not math.isfinite(bias):
        raise FakeOptionsError('fake engine: option "bias" must be a finite number')
    offers = members.get("offersQuantities", True)
    if not isinstance(offers, bool):
        raise FakeOptionsError('fake engine: option "offersQuantities" must be a boolean')
    fingerprint = members.get("fingerprint")
    if fingerprint is not None and (not isinstance(fingerprint, str) or fingerprint == ""):
        raise FakeOptionsError('fake engine: option "fingerprint" must be a non-empty string')
    stated = FakeOptions(id=engine_id, bias=bias, offers_quantities=offers)
    return FakeOptions(engine_id, bias, offers, fingerprint if fingerprint is not None else kit_fingerprint(stated))


class FakeEngine:
    """The fake engine: ``describe()`` and ``run(request, case)`` for the protocol loop.

    - ``describe``: a descriptor with the options' id and fingerprint, which supports every feature flag without
      limits and offers ``selftest.echo``, or no quantity at all when ``offers_quantities`` is false.
    - ``run`` of ``selftest.echo``: the quantity as the contract defines it, with ``bias`` added to every value
      that is not a NaN. A spec that is not valid, or whose array does not decode, is a result of status "error"
      with the code ``bad-spec``.
    - ``run`` of anything else, or of anything when it offers no quantity: a result of status "unsupported" that
      names the quantity.

    It keeps no state between messages and does not read the case.
    """

    def __init__(self, options: FakeOptions, schemas: SchemaSet | None = None) -> None:
        self._options = options
        self._schemas = schemas if schemas is not None else contract_schemas()
        quantities = {SELFTEST_ECHO: {"version": SELFTEST_ECHO_VERSION}} if options.offers_quantities else {}
        self._descriptor: dict[str, Any] = {
            "contract": {"min": CONTRACT_VERSION, "max": CONTRACT_VERSION},
            "identity": {
                "id": options.id,
                "version": FAKE_ENGINE_VERSION,
                "fingerprint": options.fingerprint,
                "details": {"bias": options.bias, "offersQuantities": options.offers_quantities, "failMode": "none"},
            },
            "capabilities": {
                "features": {"supported": list(FEATURE_FLAGS), "limits": {}},
                "quantities": quantities,
                "deterministic": True,
                "maxConcurrency": 1,
            },
        }

    def describe(self) -> dict[str, Any]:
        """The engine's descriptor, the same every time."""
        return self._descriptor

    def run(self, request: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
        """The result of one request; the case is not read."""
        engine = engine_stamp(self._descriptor)
        quantity = request["quantity"]

        def failed(message: str) -> dict[str, Any]:
            return make_result(request, engine, "error", error={"code": "bad-spec", "message": message})

        if not self._options.offers_quantities or quantity != SELFTEST_ECHO:
            message = f"the fake engine does not offer {quantity}"
            item = {"code": "quantity", "item": quantity, "message": message}
            return make_result(request, engine, "unsupported", unsupported=[item])
        spec = request["spec"]
        issues = validate(self._schemas, quantity_schema_id(SELFTEST_ECHO, "spec"), spec)
        if issues:
            return failed(f"spec is not a {SELFTEST_ECHO} spec: {format_issues(issues)}")
        try:
            values = decode_ndarray(spec["values"])
        except NdArrayError as error:
            return failed(f"spec.values does not decode: {error}")
        if values.dtype != "f8":
            return failed(f"spec.values is {values.dtype}, not f8")

        echoed, total = echo_values(values.data, spec["scale"], self._options.bias)
        return make_result(
            request,
            engine,
            "ok",
            method={"name": "fake-echo", "params": {"bias": self._options.bias}},
            data={"values": encode_ndarray_bytes("f8", echoed, values.shape), "sum": total},
            diagnostics={"warnings": [], "counts": {"values": values.count}},
        )


def options_from(argv: Sequence[str], environ: Mapping[str, str]) -> FakeOptions:
    """The options the command line and the environment state together; the command line wins.

    Raises a ``FakeOptionsError`` when ``LVRTC_ENGINE_OPTIONS`` is not a JSON object and when the options are not
    the fake engine's. A command line that cannot be read ends the process as ``argparse`` ends it, with code 2.
    """
    parser = argparse.ArgumentParser(
        prog="python -m lvrtc_worker_kit.fake_engine",
        description="The comparator's fake engine as a stdio worker: it answers selftest.echo and nothing else.",
    )
    parser.add_argument("--id", help="the engine id its descriptor and results carry")
    parser.add_argument("--bias", type=float, help="added to every echoed value that is not a NaN (default 0)")
    parser.add_argument("--no-quantities", action="store_true", help="offer no quantity: every run is unsupported")
    parser.add_argument("--fingerprint", help="the fingerprint to report in place of the derived one")
    stated = parser.parse_args(list(argv))

    members: dict[str, Any] = {}
    text = environ.get(OPTIONS_VARIABLE, "")
    if text != "":
        try:
            parsed = parse_json(text)
        except ValueError as error:
            raise FakeOptionsError(f"fake engine: {OPTIONS_VARIABLE} is not JSON: {error}") from error
        if not isinstance(parsed, dict):
            raise FakeOptionsError(f"fake engine: {OPTIONS_VARIABLE} must be a JSON object")
        members.update(parsed)
    if stated.id is not None:
        members["id"] = stated.id
    if stated.bias is not None:
        members["bias"] = stated.bias
    if stated.no_quantities:
        members["offersQuantities"] = False
    if stated.fingerprint is not None:
        members["fingerprint"] = stated.fingerprint
    return parse_fake_options(members)


def main(argv: Sequence[str] | None = None) -> int:
    """Runs the fake engine on the standard streams until shutdown or end of input. Returns the exit code."""
    try:
        options = options_from(sys.argv[1:] if argv is None else argv, os.environ)
    except FakeOptionsError as error:
        print(str(error), file=sys.stderr)
        return 2
    return serve_stdio(FakeEngine(options))


if __name__ == "__main__":
    sys.exit(main())
