"""The message loop, driven with streams in memory: every reply, every refusal, and never a partial line."""

from __future__ import annotations

import copy
import io
import json
import math
import os
import subprocess
import sys
import unittest
from typing import Any

from lvrtc_worker_kit import CONTRACT_VERSION
from lvrtc_worker_kit.protocol import (
    ENGINE_FAILURE,
    ERROR_CODES,
    NO_ID,
    case_array_problems,
    encode_reply,
    engine_stamp,
    make_result,
    parse_json,
    result_problems,
    serve,
)
from lvrtc_worker_kit.validate import validate_kind

from .support import REPO_ROOT, read_fixture

DESCRIPTOR: dict[str, Any] = read_fixture("valid", "engine-descriptor", "minimal.json")
HELLO: dict[str, Any] = read_fixture("valid", "protocol-request", "hello.json")
RUN: dict[str, Any] = read_fixture("valid", "protocol-request", "run.json")
SHUTDOWN: dict[str, Any] = read_fixture("valid", "protocol-request", "shutdown.json")


_DEFAULT: Any = object()


class StubEngine:
    """An engine that answers every run "unsupported", unless told to do something else."""

    def __init__(self, answer: Any = _DEFAULT, descriptor: Any = None) -> None:
        self.answer = answer
        self.descriptor = descriptor if descriptor is not None else DESCRIPTOR
        self.runs: list[tuple[dict[str, Any], dict[str, Any]]] = []

    def describe(self) -> dict[str, Any]:
        if callable(self.descriptor):
            return self.descriptor()
        return self.descriptor

    def run(self, request: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
        self.runs.append((request, case))
        if callable(self.answer):
            return self.answer(request, case)
        if self.answer is not _DEFAULT:
            return self.answer
        item = {"code": "quantity", "item": request["quantity"], "message": "not offered"}
        return make_result(request, engine_stamp(DESCRIPTOR), "unsupported", unsupported=[item])


class Recorder(io.BytesIO):
    """A reply stream that keeps every write and notes each flush."""

    def __init__(self) -> None:
        super().__init__()
        self.events: list[Any] = []

    def write(self, data: Any) -> int:
        self.events.append(bytes(data))
        return super().write(data)

    def flush(self) -> None:
        self.events.append("flush")
        super().flush()


def line_of(message: Any) -> bytes:
    return json.dumps(message).encode("utf-8") + b"\n"


def edited(message: dict[str, Any], path: str, value: Any = None, remove: bool = False) -> dict[str, Any]:
    """A deep copy of ``message`` with the member at the slash-separated ``path`` replaced or removed."""
    copied = copy.deepcopy(message)
    *parents, last = path.split("/")
    target: Any = copied
    for name in parents:
        target = target[int(name)] if isinstance(target, list) else target[name]
    if remove:
        del target[last]
    else:
        target[last] = value
    return copied


class LoopTest(unittest.TestCase):
    def converse(self, engine: Any, *lines: bytes) -> list[dict[str, Any]]:
        """The replies to ``lines``, each checked to be one whole, compact, ASCII line that is a protocol response."""
        replies = Recorder()
        self.log = io.StringIO()
        code = serve(engine, io.BytesIO(b"".join(lines)), replies, log=self.log)
        self.assertEqual(code, 0)
        written = [event for event in replies.events if event != "flush"]
        # One write per reply, each followed by a flush, and nothing else.
        self.assertEqual(replies.events, [event for line in written for event in (line, "flush")])
        parsed = []
        for line in written:
            self.assertTrue(line.endswith(b"\n"))
            self.assertEqual(line.count(b"\n"), 1)
            self.assertTrue(line.isascii())
            self.assertNotIn(b": ", line.split(b'"message"')[0])
            reply = parse_json(line)
            self.assertEqual(line, encode_reply(reply))
            self.assertEqual(validate_kind("protocol-response", reply), [], line)
            parsed.append(reply)
        return parsed

    def refusal(self, engine: Any, line: bytes, code: str, message_id: str) -> str:
        """The message of the one refusal that ``line`` gets, checked for its code and id."""
        (reply,) = self.converse(engine, line)
        self.assertIs(reply["ok"], False, reply)
        self.assertEqual((reply["error"]["code"], reply["id"]), (code, message_id), reply)
        self.assertIn(code, ERROR_CODES)
        return reply["error"]["message"]

    # ── What is answered ─────────────────────────────────────────────────────────────────────────────────────────

    def test_hello_run_and_shutdown_are_answered_one_line_each_with_the_id_of_the_message(self) -> None:
        engine = StubEngine()
        hello, ran, bye = self.converse(engine, line_of(HELLO), line_of(RUN), line_of(SHUTDOWN))
        self.assertEqual(hello, {"contract": CONTRACT_VERSION, "id": HELLO["id"], "ok": True, "result": DESCRIPTOR})
        self.assertEqual(bye, {"contract": CONTRACT_VERSION, "id": SHUTDOWN["id"], "ok": True, "result": {}})
        self.assertEqual((ran["id"], ran["ok"]), (RUN["id"], True))
        request, case = RUN["params"]["request"], RUN["params"]["case"]
        self.assertEqual(engine.runs, [(request, case)])
        # The ids are the ones that were sent: nothing was hashed again.
        self.assertEqual((ran["result"]["requestId"], ran["result"]["caseId"]), (request["id"], case["id"]))
        self.assertEqual(ran["result"]["status"], "unsupported")
        self.assertEqual(validate_kind("result", ran["result"]), [])

    def test_ids_are_echoed_whatever_text_they_are(self) -> None:
        for message_id in ("1", "a b", "é ☃ \U0001f600", '"quoted"', "0" * 300):
            (reply,) = self.converse(StubEngine(), line_of({**HELLO, "id": message_id}))
            self.assertEqual(reply["id"], message_id)

    def test_shutdown_ends_the_loop_and_what_follows_is_not_read(self) -> None:
        engine = StubEngine()
        requests = io.BytesIO(line_of(SHUTDOWN) + line_of(RUN) + line_of(HELLO))
        replies = io.BytesIO()
        self.assertEqual(serve(engine, requests, replies, log=io.StringIO()), 0)
        self.assertEqual(len(replies.getvalue().splitlines()), 1)
        self.assertEqual(engine.runs, [])
        self.assertEqual(requests.readline(), line_of(RUN))

    def test_the_end_of_the_input_ends_the_loop_with_exit_code_0(self) -> None:
        self.assertEqual(self.converse(StubEngine()), [])
        self.assertEqual(len(self.converse(StubEngine(), line_of(HELLO), line_of(HELLO))), 2)
        # A last line without its newline is a line all the same.
        (reply,) = self.converse(StubEngine(), line_of(HELLO).rstrip(b"\n"))
        self.assertTrue(reply["ok"])

    def test_the_loop_goes_on_after_every_refusal(self) -> None:
        replies = self.converse(StubEngine(), b"nonsense\n", line_of(HELLO), b"[1]\n", line_of(RUN), line_of(SHUTDOWN))
        self.assertEqual([reply["ok"] for reply in replies], [False, True, False, True, True])

    # ── What is refused ──────────────────────────────────────────────────────────────────────────────────────────

    def test_a_line_that_is_not_json_is_a_parse_error_under_the_placeholder_id(self) -> None:
        lines = [
            b"not json\n",
            b"\n",
            b"   \n",
            b'{"contract":"1.0","id":"7","method":"hello","params":{}\n',
            b'{"contract":"1.0","id":"7","method":"hello","params":{}}}\n',
            b"\xff\xfe\n",
            b'{"id":"7","method":"hello","params":{},"contract":"1.0","x":NaN}\n',
            b'{"id":"7","x":Infinity}\n',
            b'{"id":"7","x":-Infinity}\n',
            b"{'id':'7'}\n",
            b"[" * 100000 + b"\n",
        ]
        for line in lines:
            message = self.refusal(StubEngine(), line, "parse-error", NO_ID)
            self.assertTrue(message.startswith("the line is not JSON: "), message)
        self.assertEqual(NO_ID, "?")

    def test_a_message_that_is_not_an_object_is_a_bad_request(self) -> None:
        for line in (b"42\n", b"null\n", b'"hello"\n', b"[]\n", b"true\n", line_of([HELLO])):
            self.assertEqual(self.refusal(StubEngine(), line, "bad-request", NO_ID), "the message is not an object")

    def test_an_unknown_method_is_refused_with_the_id_of_the_message(self) -> None:
        engine = StubEngine()
        message = self.refusal(engine, line_of({**HELLO, "method": "describe"}), "unknown-method", HELLO["id"])
        self.assertEqual(message, 'unknown method "describe"')
        for method in ("Hello", "", "run ", None, 5, ["hello"], {"name": "hello"}):
            self.refusal(engine, line_of({**HELLO, "method": method}), "unknown-method", HELLO["id"])
        self.refusal(engine, line_of(edited(HELLO, "method", remove=True)), "unknown-method", HELLO["id"])
        self.refusal(engine, line_of({"method": "nothing"}), "unknown-method", NO_ID)
        self.assertEqual(engine.runs, [])

    def test_a_message_that_is_not_a_protocol_request_is_a_bad_request(self) -> None:
        engine = StubEngine()
        cases: list[tuple[dict[str, Any], str]] = [
            (edited(HELLO, "contract", remove=True), HELLO["id"]),
            (edited(HELLO, "contract", "2.0"), HELLO["id"]),
            (edited(HELLO, "contract", 1.0), HELLO["id"]),
            (edited(HELLO, "params", {"verbose": True}), HELLO["id"]),
            (edited(HELLO, "params", remove=True), HELLO["id"]),
            (edited(HELLO, "params", None), HELLO["id"]),
            (edited(HELLO, "extra", 1), HELLO["id"]),
            (edited(SHUTDOWN, "params", []), SHUTDOWN["id"]),
            (edited(RUN, "contract", remove=True), RUN["id"]),
            (edited(RUN, "extra", 1), RUN["id"]),
            # An id that cannot be echoed is answered under the placeholder.
            (edited(HELLO, "id", remove=True), NO_ID),
            (edited(HELLO, "id", ""), NO_ID),
            (edited(HELLO, "id", 7), NO_ID),
            (edited(RUN, "id", None), NO_ID),
        ]
        for message, message_id in cases:
            text = self.refusal(engine, line_of(message), "bad-request", message_id)
            self.assertTrue(text.startswith("the message is not a protocol request: (root) [oneOf] "), text)
        self.assertEqual(engine.runs, [])

    def test_a_run_whose_request_or_case_is_not_valid_is_refused_naming_which_and_where(self) -> None:
        engine = StubEngine()
        run_id = RUN["id"]
        cases: list[tuple[dict[str, Any], str]] = [
            (edited(RUN, "params", remove=True), "the message has no params"),
            (edited(RUN, "params", [1]), "params is not an object"),
            (edited(RUN, "params/request", remove=True), "params has no request"),
            (edited(RUN, "params/case", remove=True), "params has no case"),
            (edited(RUN, "params/more", 1), 'params has an unexpected member "more"'),
            (
                edited(RUN, "params/request/spec", remove=True),
                'params.request is not a valid request: (root) [required] missing property "spec"',
            ),
            (
                edited(RUN, "params/request/quantity", "Rays"),
                "params.request is not a valid request: /quantity [pattern] must match "
                "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)+$",
            ),
            (
                edited(RUN, "params/request/spec/line", math.inf),
                "params.request is not a valid request: /spec/line [finite] the number is not a finite float64",
            ),
            (
                edited(RUN, "params/case/system/stopIndex", "0"),
                "params.case is not a valid optical-case: /system/stopIndex [type] expected integer, got string",
            ),
            (
                edited(RUN, "params/case/system/surfaces/0/thickness", True),
                "params.case is not a valid optical-case: "
                "/system/surfaces/0/thickness [type] expected number, got boolean",
            ),
            (
                edited(RUN, "params/case", None),
                "params.case is not a valid optical-case: (root) [type] expected object, got null",
            ),
        ]
        for message, text in cases:
            line = json.dumps(message).replace("Infinity", "1e400").encode() + b"\n"
            self.assertEqual(self.refusal(engine, line, "bad-request", run_id), text)

        other = "0" * 64
        text = self.refusal(engine, line_of(edited(RUN, "params/request/caseId", other)), "bad-request", run_id)
        self.assertEqual(text, f"params.request is about case {other}, params.case is {RUN['params']['case']['id']}")
        self.assertEqual(engine.runs, [])

    def test_the_array_of_a_case_is_decoded_so_its_digest_and_shape_are_verified(self) -> None:
        engine = StubEngine()
        case = RUN["params"]["case"]
        self.assertEqual(case_array_problems(case), [])
        table = "params/case/conditions/indexAfterSurface/$nd"
        wrong_digest = self.refusal(engine, line_of(edited(RUN, f"{table}/sha256", "0" * 64)), "bad-request", RUN["id"])
        self.assertTrue(
            wrong_digest.startswith(
                "params.case is not a valid optical-case: conditions.indexAfterSurface: ndarray: sha256 mismatch"
            ),
            wrong_digest,
        )
        rows, columns = case["conditions"]["indexAfterSurface"]["$nd"]["shape"]
        turned = self.refusal(engine, line_of(edited(RUN, f"{table}/shape", [columns, rows])), "bad-request", RUN["id"])
        self.assertEqual(
            turned,
            f"params.case is not a valid optical-case: conditions.indexAfterSurface is f8 of shape "
            f"[{columns}, {rows}], expected f8 of shape [{rows}, {columns}] (lines, surfaces)",
        )
        self.assertEqual(engine.runs, [])

    # ── What an engine does wrong ────────────────────────────────────────────────────────────────────────────────

    def test_an_exception_in_run_is_a_result_of_status_error_stamped_by_the_engine_and_logged(self) -> None:
        def explode(*_: Any) -> Any:
            raise RuntimeError("the ray went sideways")

        (reply,) = self.converse(StubEngine(answer=explode), line_of(RUN))
        self.assertEqual((reply["id"], reply["ok"]), (RUN["id"], True))
        self.assertEqual(validate_kind("protocol-response", reply), [])
        request, case = RUN["params"]["request"], RUN["params"]["case"]
        self.assertEqual(
            reply["result"],
            make_result(
                request,
                engine_stamp(DESCRIPTOR),
                "error",
                error={"code": ENGINE_FAILURE, "message": "RuntimeError: the ray went sideways"},
            ),
        )
        self.assertEqual((reply["result"]["requestId"], reply["result"]["caseId"]), (request["id"], case["id"]))
        self.assertEqual(ENGINE_FAILURE, "engine-failure")
        self.assertIn("Traceback", self.log.getvalue())
        self.assertIn("the ray went sideways", self.log.getvalue())

    def test_an_exception_where_no_result_can_say_so_is_a_refusal(self) -> None:
        def explode(*_: Any) -> Any:
            raise RuntimeError("the ray went sideways")

        # hello has no result to carry a failure, and a run cannot be stamped without a descriptor.
        engine = StubEngine(answer=explode, descriptor=explode)
        for message in (HELLO, RUN):
            self.assertEqual(
                self.refusal(engine, line_of(message), "engine-failure", message["id"]),
                "RuntimeError: the ray went sideways",
            )
        broken = copy.deepcopy(DESCRIPTOR)
        del broken["identity"]["fingerprint"]
        unstamped = StubEngine(answer=explode, descriptor=broken)
        self.assertEqual(
            self.refusal(unstamped, line_of(RUN), "engine-failure", RUN["id"]), "RuntimeError: the ray went sideways"
        )

    def test_the_loop_goes_on_after_an_engine_raised(self) -> None:
        def quit_engine(*_: Any) -> Any:
            raise ZeroDivisionError("division by zero")

        replies = self.converse(StubEngine(answer=quit_engine), line_of(RUN), line_of(HELLO))
        self.assertEqual([reply["ok"] for reply in replies], [True, True])
        self.assertEqual(replies[0]["result"]["error"]["message"], "ZeroDivisionError: division by zero")

    def test_an_answer_that_is_not_a_valid_result_is_refused_in_the_engine_s_place(self) -> None:
        request = RUN["params"]["request"]
        stamp = engine_stamp(DESCRIPTOR)
        proper = make_result(request, stamp, "ok", data={"x": 1})
        self.assertEqual(validate_kind("result", proper), [])
        no_diagnostics = {name: value for name, value in proper.items() if name != "diagnostics"}
        cases: list[tuple[Any, str]] = [
            (None, "the engine's answer is not a result: (root) [type] expected object, got null"),
            ("ok", "the engine's answer is not a result: (root) [type] expected object, got string"),
            (no_diagnostics, 'the engine\'s answer is not a result: (root) [required] missing property "diagnostics"'),
            (
                make_result(request, stamp, "ok", data={"x": math.nan}),
                "the engine's answer is not a result: /data/x [finite] the number is not a finite float64",
            ),
            (
                make_result(request, stamp, "ok", data={"x": (1, 2)}),
                "the engine's answer is not a result: /data/x [json] tuple is not JSON data",
            ),
            (make_result(request, stamp, "ok"), 'the engine\'s answer breaks a rule: status "ok" needs data'),
            (make_result(request, stamp, "error"), 'the engine\'s answer breaks a rule: status "error" needs error'),
            (
                make_result(request, stamp, "unsupported"),
                'the engine\'s answer breaks a rule: status "unsupported" needs a non-empty unsupported list',
            ),
            (
                {**proper, "requestId": "0" * 64},
                "the engine's answer breaks a rule: requestId does not echo the request's id",
            ),
            ({**proper, "caseId": "0" * 64}, "the engine's answer breaks a rule: caseId does not echo the case's id"),
        ]
        for answer, text in cases:
            self.assertEqual(self.refusal(StubEngine(answer=answer), line_of(RUN), "invalid-result", RUN["id"]), text)
        (reply,) = self.converse(StubEngine(answer=proper), line_of(RUN))
        self.assertEqual(reply["result"], proper)

    def test_a_descriptor_that_is_not_valid_is_refused_in_the_engine_s_place(self) -> None:
        broken = edited(DESCRIPTOR, "capabilities/maxConcurrency", True)
        text = self.refusal(StubEngine(descriptor=broken), line_of(HELLO), "invalid-result", HELLO["id"])
        self.assertEqual(
            text,
            "the engine's descriptor is not valid: /capabilities/maxConcurrency [type] expected integer, got boolean",
        )

    def test_a_reply_is_ascii_and_holds_no_token_that_is_not_json(self) -> None:
        request = RUN["params"]["request"]
        warned = make_result(
            request,
            engine_stamp(DESCRIPTOR),
            "ok",
            data={"note": "é ☃ \U0001f600  "},
            diagnostics={"warnings": ["naïve"], "counts": {}},
        )
        replies = io.BytesIO()
        serve(StubEngine(answer=warned), io.BytesIO(line_of(RUN)), replies, log=io.StringIO())
        line = replies.getvalue()
        self.assertTrue(line.isascii())
        self.assertIn(b"\\u00e9 \\u2603 \\ud83d\\ude00 \\u2028", line)
        self.assertEqual(parse_json(line)["result"], warned)

        # Should a non-finite number ever reach the encoder, the line is a refusal, not a NaN token.
        for value in (math.nan, math.inf, {1, 2}):
            fallback = encode_reply({"contract": CONTRACT_VERSION, "id": "9", "ok": True, "result": {"x": value}})
            reply = parse_json(fallback)
            self.assertEqual((reply["id"], reply["ok"], reply["error"]["code"]), ("9", False, "invalid-result"))
            self.assertEqual(validate_kind("protocol-response", reply), [])

    def test_parse_json_is_strict_about_the_tokens_python_reads_by_default(self) -> None:
        for text in ("NaN", "[Infinity]", '{"a":-Infinity}', "", "{", b"\xff"):
            with self.assertRaises(ValueError):
                parse_json(text)
        self.assertEqual(parse_json(b'{"a":[1,2.5,"x",null,true]}'), {"a": [1, 2.5, "x", None, True]})
        # Grammatically JSON, and an infinity once read: the validator is what rejects it.
        self.assertEqual(parse_json("1e400"), math.inf)

    def test_result_helpers_echo_ids_and_state_the_status_rules(self) -> None:
        request = {"id": "r" * 64, "caseId": "c" * 64}
        stamp = engine_stamp(DESCRIPTOR)
        self.assertEqual(stamp, {name: DESCRIPTOR["identity"][name] for name in ("id", "fingerprint", "details")})
        # An engine whose worker is the comparator's own states an adapter revision, and every result carries it.
        revised = copy.deepcopy(DESCRIPTOR)
        revised["identity"]["adapterRevision"] = "a" * 64
        self.assertEqual(validate_kind("engine-descriptor", revised), [])
        self.assertEqual(
            engine_stamp(revised),
            {"id": stamp["id"], "fingerprint": stamp["fingerprint"], "adapterRevision": "a" * 64, "details": {}},
        )
        self.assertEqual(list(engine_stamp(revised)), ["id", "fingerprint", "adapterRevision", "details"])
        result = make_result(request, stamp, "error", error={"code": "x", "message": "y"}, data=None)
        self.assertEqual(
            result,
            {
                "contract": CONTRACT_VERSION,
                "kind": "result",
                "requestId": "r" * 64,
                "caseId": "c" * 64,
                "engine": stamp,
                "status": "error",
                "error": {"code": "x", "message": "y"},
                "diagnostics": {"warnings": [], "counts": {}},
            },
        )
        self.assertEqual(result_problems(result), [])
        self.assertEqual(result_problems({"status": "pending"}), [])


class StandardStreamsTest(unittest.TestCase):
    """The reply stream of a real process: nothing but replies reaches it, whoever writes to the standard output."""

    def noisy(self, *arguments: str) -> subprocess.CompletedProcess[bytes]:
        inherited = {name: os.environ[name] for name in ("PATH", "SYSTEMROOT") if name in os.environ}
        return subprocess.run(
            [sys.executable, "-B", "-m", "tests.kit.noisy_worker", *arguments],
            input=line_of(HELLO) + line_of(RUN) + line_of(SHUTDOWN),
            capture_output=True,
            cwd=REPO_ROOT / "workers" / "python",
            env={**inherited, "PYTHONDONTWRITEBYTECODE": "1"},
            timeout=120,
            check=False,
        )

    def test_a_print_a_write_to_descriptor_1_a_warning_and_a_child_process_all_go_to_the_log(self) -> None:
        ended = self.noisy()
        self.assertEqual(ended.returncode, 0, ended.stderr)
        replies = [parse_json(line) for line in ended.stdout.splitlines()]
        self.assertEqual(
            [(reply["id"], reply["ok"]) for reply in replies],
            [(HELLO["id"], True), (RUN["id"], True), (SHUTDOWN["id"], True)],
        )
        self.assertEqual(replies[1]["result"]["status"], "unsupported")
        log = ended.stderr.decode("utf-8")
        for where in ("at import", "in describe", "in run"):
            for how in ("print", "fd1", "dunder", "child"):
                self.assertIn(f"{how} {where}\n", log)
            self.assertIn(f"RuntimeWarning: warning {where}", log)

    def test_serve_stdio_reserves_the_stream_itself_for_a_worker_that_did_not(self) -> None:
        ended = self.noisy("--late")
        self.assertEqual(ended.returncode, 0, ended.stderr)
        self.assertEqual(
            [parse_json(line)["id"] for line in ended.stdout.splitlines()], [HELLO["id"], RUN["id"], SHUTDOWN["id"]]
        )
        self.assertIn(b"fd1 in describe\n", ended.stderr)
        self.assertNotIn(b"at import", ended.stderr)

    def test_the_duplicate_of_the_reply_stream_is_not_inherited_by_a_child(self) -> None:
        script = (
            "import os, subprocess, sys\n"
            "from lvrtc_worker_kit.protocol import protect_stdout\n"
            "replies = protect_stdout()\n"
            "fd = replies.fileno()\n"
            "probe = 'import os, sys\\ntry:\\n os.fstat(int(sys.argv[1]))\\n print(\"open\")\\n"
            "except OSError:\\n print(\"closed\")'\n"
            "out = subprocess.run([sys.executable, '-c', probe, str(fd)], capture_output=True, check=True).stdout\n"
            "replies.write(out)\n"
            "replies.flush()\n"
        )
        ended = subprocess.run(
            [sys.executable, "-B", "-c", script],
            capture_output=True,
            cwd=REPO_ROOT / "workers" / "python",
            timeout=120,
            check=False,
        )
        self.assertEqual((ended.returncode, ended.stdout), (0, b"closed\n"), ended.stderr)


if __name__ == "__main__":
    unittest.main()
