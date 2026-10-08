"""The Python fake engine: the contract's examples byte for byte, and the options of the TypeScript fake."""

from __future__ import annotations

import io
import json
import math
import os
import struct
import subprocess
import sys
import unittest
from typing import Any

from lvrtc_worker_kit import CONTRACT_VERSION
from lvrtc_worker_kit.fake_engine import (
    FEATURE_FLAGS,
    OPTIONS_VARIABLE,
    FakeEngine,
    FakeOptions,
    FakeOptionsError,
    echo_values,
    kit_fingerprint,
    options_from,
    parse_fake_options,
)
from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray, encode_ndarray_bytes
from lvrtc_worker_kit.protocol import parse_json, result_problems, serve
from lvrtc_worker_kit.validate import contract_schemas, quantity_schema_id, validate, validate_kind

from .support import FIXTURE_DIR, REPO_ROOT, bits_of, f8_bytes, read_fixture

CASE: dict[str, Any] = read_fixture("valid", "optical-case", "singlet.json")
QUIET_NAN = 0x7FF8000000000000


def request_for(spec: Any, quantity: str = "selftest.echo") -> dict[str, Any]:
    """A request about ``CASE``. Its id is made up: an engine echoes ids and never checks how they were made."""
    return {
        "contract": CONTRACT_VERSION,
        "kind": "request",
        "id": "ab" * 32,
        "caseId": CASE["id"],
        "quantity": quantity,
        "spec": spec,
    }


def echo_spec(values: list[float], scale: float = 1, shape: list[int] | None = None) -> dict[str, Any]:
    return {"values": encode_ndarray("f8", values, shape), "scale": scale}


def fake(**options: Any) -> FakeEngine:
    return FakeEngine(parse_fake_options({"id": "fake", **options}))


class EchoTest(unittest.TestCase):
    def run_checked(self, engine: FakeEngine, request: dict[str, Any]) -> dict[str, Any]:
        result = engine.run(request, CASE)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual(result_problems(result), [])
        self.assertEqual((result["requestId"], result["caseId"]), (request["id"], CASE["id"]))
        return result

    def test_the_fake_answers_every_conformance_example_as_the_contract_states_byte_for_byte(self) -> None:
        directory = FIXTURE_DIR / "valid" / "quantities"
        names = sorted(file.name for file in (directory / "selftest.echo.spec").glob("*.json"))
        self.assertEqual(names, sorted(file.name for file in (directory / "selftest.echo.data").glob("*.json")))
        self.assertGreaterEqual(len(names), 7)
        for name in names:
            spec = read_fixture("valid", "quantities", "selftest.echo.spec", name)
            data = read_fixture("valid", "quantities", "selftest.echo.data", name)
            result = self.run_checked(fake(), request_for(spec))
            self.assertEqual(result["status"], "ok", name)
            self.assertEqual(result["data"], data, name)
            self.assertIs(type(result["data"]["sum"]), type(data["sum"]) if data["sum"] is None else float, name)
            self.assertEqual(
                validate(contract_schemas(), quantity_schema_id("selftest.echo", "data"), result["data"]), []
            )

    def test_an_ok_result_says_who_answered_how_and_how_many_values(self) -> None:
        options = parse_fake_options({"id": "fake"})
        request = request_for(echo_spec([1.0, 2.0, 3.0], 2))
        self.assertEqual(
            self.run_checked(FakeEngine(options), request),
            {
                "contract": CONTRACT_VERSION,
                "kind": "result",
                "requestId": request["id"],
                "caseId": CASE["id"],
                "engine": {
                    "id": "fake",
                    "fingerprint": options.fingerprint,
                    "details": {"bias": 0, "offersQuantities": True, "failMode": "none"},
                },
                "status": "ok",
                "method": {"name": "fake-echo", "params": {"bias": 0}},
                "data": {"values": encode_ndarray("f8", [2.0, 4.0, 6.0]), "sum": 12},
                "diagnostics": {"warnings": [], "counts": {"values": 3}},
            },
        )

    def test_with_scale_1_every_element_comes_back_bit_for_bit(self) -> None:
        patterns = [
            0x7FF8000000000001,  # quiet NaN with a payload
            0xFFF8DEADBEEFCAFE,  # negative quiet NaN with a payload
            0x7FF0000000000001,  # signalling NaN, which arithmetic would quiet
            0xFFF4000000C0FFEE,  # negative signalling NaN with a payload
            0x8000000000000000,  # -0
            0x7FF0000000000000,  # +infinity
            0xFFF0000000000000,  # -infinity
            0x0000000000000001,  # smallest subnormal
            0x800FFFFFFFFFFFFF,  # largest negative subnormal
            0x0010000000000000,  # smallest normal
            0x7FEFFFFFFFFFFFFF,  # largest finite
            0xFFEFFFFFFFFFFFFF,  # most negative finite
            0x0123456789ABCDEF,
        ]
        raw = f8_bytes(*patterns)
        echoed, total = echo_values(raw, 1)
        self.assertEqual(bits_of(echoed), patterns)
        self.assertIsNone(total)
        # The same through the engine, as a 1-D array and with the scale written as a float.
        spec = {"values": encode_ndarray_bytes("f8", raw), "scale": 1.0}
        data = self.run_checked(fake(), request_for(spec))["data"]
        self.assertEqual(data, {"values": spec["values"], "sum": None})
        self.assertEqual(decode_ndarray(data["values"]).data, raw)

    def test_a_nan_is_copied_whatever_the_scale_and_a_nan_the_multiplication_makes_is_the_quiet_nan(self) -> None:
        payload = 0xFFF8000000000123
        raw = f8_bytes(payload, 0x7FF0000000000000, 0xFFF0000000000000, 0x3FF0000000000000)
        echoed, total = echo_values(raw, 0)
        self.assertEqual(bits_of(echoed), [payload, QUIET_NAN, QUIET_NAN, 0])
        self.assertIsNone(total)
        echoed, total = echo_values(raw, -2.5, 0.5)
        self.assertEqual(bits_of(echoed)[0], payload)
        self.assertEqual(struct.unpack("<3d", echoed[8:]), (-math.inf, math.inf, -2.0))
        # An infinity plus the opposite infinity in the sum is no number: null.
        self.assertIsNone(total)

    def test_each_element_is_one_multiplication_and_the_sum_a_plain_running_sum_from_0(self) -> None:
        values = [0.1, 0.2, 0.3]
        echoed, total = echo_values(struct.pack("<3d", *values), 3)
        self.assertEqual(list(struct.unpack("<3d", echoed)), [0.1 * 3, 0.2 * 3, 0.3 * 3])
        self.assertEqual(total, ((0.0 + 0.1 * 3) + 0.2 * 3) + 0.3 * 3)

        # A compensated sum, math.fsum, gives 2; so does Python's own sum() from 3.12 on. The contract's gives 0.
        big = [1e16, 1.0, -1e16, 1.0]
        _, plain = echo_values(struct.pack("<4d", *big), 1)
        self.assertEqual(plain, 1.0)
        self.assertEqual(math.fsum(big), 2.0)
        _, running = echo_values(struct.pack("<3d", 1.0, 1e100, -1e100), 1)
        self.assertEqual(running, 0.0)

        self.assertEqual(echo_values(b"", 5), (b"", 0.0))
        _, negative_zero = echo_values(struct.pack("<d", -0.0), 1)
        self.assertEqual(math.copysign(1.0, negative_zero), 1.0)
        overflowed, total = echo_values(struct.pack("<2d", 1e308, -1e308), 10)
        self.assertEqual(struct.unpack("<2d", overflowed), (math.inf, -math.inf))
        self.assertIsNone(total)
        # The scale may arrive as an int; the arithmetic is float64 all the same.
        self.assertEqual(echo_values(struct.pack("<d", 0.1), 3), echo_values(struct.pack("<d", 0.1), 3.0))

    def test_a_bias_is_added_to_every_value_that_is_not_a_nan(self) -> None:
        raw = f8_bytes(0x7FF8000000000001) + struct.pack("<2d", 1.0, -0.0)
        echoed, total = echo_values(raw, 2, 0.001)
        self.assertEqual(bits_of(echoed)[0], 0x7FF8000000000001)
        self.assertEqual(struct.unpack("<2d", echoed[8:]), (1.0 * 2 + 0.001, -0.0 * 2 + 0.001))
        self.assertIsNone(total)

        request = request_for(echo_spec([1.0, 2.0]))
        biased = self.run_checked(fake(bias=0.001), request)
        self.assertEqual(decode_ndarray(biased["data"]["values"]).values(), [1.001, 2.001])
        self.assertEqual(biased["data"]["sum"], 0.0 + 1.001 + 2.001)
        self.assertEqual(biased["method"], {"name": "fake-echo", "params": {"bias": 0.001}})
        self.assertNotEqual(biased["data"], self.run_checked(fake(), request)["data"])

    def test_the_shape_of_the_values_is_the_shape_of_the_answer(self) -> None:
        for shape in ([6], [2, 3], [3, 2], [1, 2, 3, 1]):
            data = self.run_checked(fake(), request_for(echo_spec([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], 1, shape)))["data"]
            self.assertEqual(data["values"]["$nd"]["shape"], shape)
        scalar = self.run_checked(fake(), request_for(echo_spec([7.0], 2, [])))["data"]
        self.assertEqual((scalar["values"]["$nd"]["shape"], scalar["sum"]), ([], 14.0))
        empty = self.run_checked(fake(), request_for(echo_spec([], 2, [0, 4])))
        self.assertEqual((empty["data"]["values"]["$nd"]["shape"], empty["data"]["sum"]), ([0, 4], 0.0))
        self.assertEqual(empty["diagnostics"]["counts"], {"values": 0})

    def test_a_quantity_the_fake_does_not_answer_and_every_quantity_of_one_that_offers_none_is_unsupported(
        self,
    ) -> None:
        other = self.run_checked(fake(), request_for({}, "system.describe"))
        self.assertEqual(other["status"], "unsupported")
        self.assertEqual(
            other["unsupported"],
            [
                {
                    "code": "quantity",
                    "item": "system.describe",
                    "message": "the fake engine does not offer system.describe",
                }
            ],
        )
        self.assertNotIn("data", other)

        none = fake(offersQuantities=False)
        self.assertEqual(none.describe()["capabilities"]["quantities"], {})
        refused = self.run_checked(none, request_for(echo_spec([1.0])))
        self.assertEqual(
            refused["unsupported"],
            [{"code": "quantity", "item": "selftest.echo", "message": "the fake engine does not offer selftest.echo"}],
        )

    def test_a_spec_that_is_no_selftest_echo_spec_or_whose_array_does_not_decode_is_a_result_of_status_error(
        self,
    ) -> None:
        spec = echo_spec([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], 2, [2, 3])
        no_scale = self.run_checked(fake(), request_for({"values": spec["values"]}))
        self.assertEqual(no_scale["status"], "error")
        self.assertEqual(
            no_scale["error"],
            {
                "code": "bad-spec",
                "message": 'spec is not a selftest.echo spec: (root) [required] missing property "scale"',
            },
        )
        for scale in (True, "2", None):
            flagged = self.run_checked(fake(), request_for({**spec, "scale": scale}))
            self.assertEqual(flagged["error"]["code"], "bad-spec", repr(scale))

        wrong_digest = {"values": {"$nd": {**spec["values"]["$nd"], "sha256": "0" * 64}}, "scale": 2}
        error = self.run_checked(fake(), request_for(wrong_digest))["error"]
        self.assertEqual(error["code"], "bad-spec")
        self.assertRegex(error["message"], r"^spec\.values does not decode: ndarray: sha256 mismatch")

        wrong_length = {"values": {"$nd": {**spec["values"]["$nd"], "shape": [7]}}, "scale": 2}
        error = self.run_checked(fake(), request_for(wrong_length))["error"]
        self.assertRegex(error["message"], r"^spec\.values does not decode: ndarray: data is 48 bytes but shape")

        integers = {"values": encode_ndarray("i4", [1, 2]), "scale": 2}
        self.assertEqual(self.run_checked(fake(), request_for(integers))["error"]["code"], "bad-spec")


class DescriptorAndOptionsTest(unittest.TestCase):
    def test_hello_describes_an_engine_of_this_contract_that_supports_every_feature_and_offers_selftest_echo(
        self,
    ) -> None:
        options = parse_fake_options({"id": "fake-py"})
        descriptor = FakeEngine(options).describe()
        self.assertEqual(validate_kind("engine-descriptor", descriptor), [])
        self.assertEqual(
            descriptor,
            {
                "contract": {"min": CONTRACT_VERSION, "max": CONTRACT_VERSION},
                "identity": {
                    "id": "fake-py",
                    "version": "1",
                    "fingerprint": options.fingerprint,
                    "details": {"bias": 0, "offersQuantities": True, "failMode": "none"},
                },
                "capabilities": {
                    "features": {"supported": list(FEATURE_FLAGS), "limits": {}},
                    "quantities": {"selftest.echo": {"version": 1}},
                    "deterministic": True,
                    "maxConcurrency": 1,
                },
            },
        )
        self.assertEqual(list(FEATURE_FLAGS), sorted(FEATURE_FLAGS))
        self.assertEqual(len(FEATURE_FLAGS), 7)

    def test_only_id_is_needed_and_the_other_options_default_to_a_well_behaved_engine(self) -> None:
        options = parse_fake_options({"id": "fake"})
        self.assertEqual((options.id, options.bias, options.offers_quantities), ("fake", 0.0, True))
        self.assertRegex(options.fingerprint, r"^[0-9a-f]{64}$")
        stated = parse_fake_options(
            {"id": "b", "bias": 1, "offersQuantities": False, "fingerprint": "f", "failMode": "none"}
        )
        self.assertEqual(stated, FakeOptions("b", 1.0, False, "f"))
        self.assertIs(type(stated.bias), float)

    def test_the_fingerprint_is_derived_from_the_sources_and_the_options_and_one_given_is_the_fingerprint(self) -> None:
        one = parse_fake_options({"id": "fake"})
        self.assertEqual(one.fingerprint, parse_fake_options({"id": "fake", "bias": 0.0}).fingerprint)
        self.assertEqual(one.fingerprint, kit_fingerprint(FakeOptions("fake")))
        others = [{"id": "other"}, {"id": "fake", "bias": 0.5}, {"id": "fake", "offersQuantities": False}]
        fingerprints = {parse_fake_options(options).fingerprint for options in others} | {one.fingerprint}
        self.assertEqual(len(fingerprints), 4)

        given = fake(fingerprint="pinned-1")
        self.assertEqual(given.describe()["identity"]["fingerprint"], "pinned-1")
        self.assertEqual(given.run(request_for(echo_spec([1.0])), CASE)["engine"]["fingerprint"], "pinned-1")

    def test_options_that_are_not_the_fake_engine_s_are_an_error_naming_the_option(self) -> None:
        cases: list[tuple[Any, str]] = [
            ([], "fake engine: options must be an object"),
            ({}, 'fake engine: option "id" must be an engine id'),
            ({"id": "Fake"}, 'fake engine: option "id" must be an engine id'),
            ({"id": "fake\n"}, 'fake engine: option "id" must be an engine id'),
            ({"id": 5}, 'fake engine: option "id" must be an engine id'),
            (
                {"id": "fake", "baias": 1},
                'fake engine: unknown option "baias" (it has bias, fingerprint, id, offersQuantities)',
            ),
            ({"id": "fake", "bias": "1"}, 'fake engine: option "bias" must be a finite number'),
            ({"id": "fake", "bias": True}, 'fake engine: option "bias" must be a finite number'),
            ({"id": "fake", "bias": math.inf}, 'fake engine: option "bias" must be a finite number'),
            ({"id": "fake", "bias": 10**400}, 'fake engine: option "bias" must be a finite number'),
            ({"id": "fake", "offersQuantities": 1}, 'fake engine: option "offersQuantities" must be a boolean'),
            ({"id": "fake", "fingerprint": ""}, 'fake engine: option "fingerprint" must be a non-empty string'),
            (
                {"id": "fake", "failMode": "throw"},
                'fake engine: option "failMode" can only be "none" for the Python fake',
            ),
        ]
        for options, message in cases:
            with self.assertRaises(FakeOptionsError) as raised:
                parse_fake_options(options)
            self.assertTrue(str(raised.exception).startswith(message), str(raised.exception))

    def test_the_command_line_and_the_environment_state_the_options_and_the_command_line_wins(self) -> None:
        from_flags = options_from(["--id", "fake-py", "--bias", "0.25", "--no-quantities", "--fingerprint", "f1"], {})
        self.assertEqual(from_flags, FakeOptions("fake-py", 0.25, False, "f1"))

        stated = json.dumps({"id": "from-env", "bias": 0.5, "offersQuantities": False, "fingerprint": "f2"})
        self.assertEqual(options_from([], {OPTIONS_VARIABLE: stated}), FakeOptions("from-env", 0.5, False, "f2"))
        mixed = options_from(["--id", "from-flag", "--bias", "0"], {OPTIONS_VARIABLE: stated})
        self.assertEqual(mixed, FakeOptions("from-flag", 0.0, False, "f2"))
        self.assertEqual(options_from(["--id", "a"], {OPTIONS_VARIABLE: "{}"}).id, "a")
        self.assertEqual(options_from(["--id", "a"], {OPTIONS_VARIABLE: ""}).id, "a")

        for text in ("[1]", "not json", "NaN"):
            with self.assertRaisesRegex(FakeOptionsError, f"^fake engine: {OPTIONS_VARIABLE} "):
                options_from(["--id", "a"], {OPTIONS_VARIABLE: text})
        with self.assertRaisesRegex(FakeOptionsError, 'option "id" must be an engine id'):
            options_from([], {})


class WorkerTest(unittest.TestCase):
    """The fake as a worker: through the loop in memory, and once as the process a transport starts."""

    def test_the_fake_behind_the_loop_answers_hello_a_run_and_shutdown(self) -> None:
        request = request_for(echo_spec([1.5, -0.0, 2.5], 2))
        messages = [
            {"contract": CONTRACT_VERSION, "id": "1", "method": "hello", "params": {}},
            {"contract": CONTRACT_VERSION, "id": "2", "method": "run", "params": {"request": request, "case": CASE}},
            {"contract": CONTRACT_VERSION, "id": "3", "method": "shutdown", "params": {}},
        ]
        requests = io.BytesIO(b"".join(json.dumps(message).encode() + b"\n" for message in messages))
        replies = io.BytesIO()
        self.assertEqual(serve(fake(), requests, replies, log=io.StringIO()), 0)
        hello, ran, bye = [parse_json(line) for line in replies.getvalue().splitlines()]
        self.assertEqual([reply["id"] for reply in (hello, ran, bye)], ["1", "2", "3"])
        self.assertEqual(hello["result"]["identity"]["id"], "fake")
        self.assertEqual(decode_ndarray(ran["result"]["data"]["values"]).values(), [3.0, -0.0, 5.0])
        self.assertEqual(ran["result"]["data"]["sum"], 8.0)
        self.assertEqual(bye["result"], {})

    def test_as_a_process_it_speaks_ndjson_on_its_standard_streams_and_exits_0(self) -> None:
        # What an interpreter needs to start on any system, and nothing of the developer's own environment.
        inherited = {name: os.environ[name] for name in ("PATH", "SYSTEMROOT") if name in os.environ}

        def worker(arguments: list[str], lines: bytes, options: str = "") -> subprocess.CompletedProcess[bytes]:
            return subprocess.run(
                [sys.executable, "-B", "-m", "lvrtc_worker_kit.fake_engine", *arguments],
                input=lines,
                capture_output=True,
                cwd=REPO_ROOT / "workers" / "python",
                env={**inherited, "PYTHONDONTWRITEBYTECODE": "1", OPTIONS_VARIABLE: options},
                timeout=60,
                check=False,
            )

        hello = b'{"contract":"1.0","id":"h","method":"hello","params":{}}\n'
        shutdown = b'{"contract":"1.0","id":"s","method":"shutdown","params":{}}\n'
        ended = worker(["--id", "fake-py"], hello + b"garbage\n" + shutdown + hello)
        self.assertEqual((ended.returncode, ended.stderr), (0, b""))
        replies = [parse_json(line) for line in ended.stdout.splitlines()]
        self.assertEqual([(reply["id"], reply["ok"]) for reply in replies], [("h", True), ("?", False), ("s", True)])
        self.assertEqual(replies[0]["result"]["identity"]["id"], "fake-py")

        # The end of the input ends it too, and the options may come through the environment.
        from_env = worker([], hello, json.dumps({"id": "from-env", "bias": 0.5}))
        self.assertEqual(from_env.returncode, 0)
        self.assertEqual(parse_json(from_env.stdout)["result"]["identity"]["details"]["bias"], 0.5)

        refused = worker([], hello)
        self.assertEqual((refused.returncode, refused.stdout), (2, b""))
        self.assertIn(b'option "id" must be an engine id', refused.stderr)


if __name__ == "__main__":
    unittest.main()
