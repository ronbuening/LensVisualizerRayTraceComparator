"""The one-shot answer of one message by files: the loop's answer, written whole or not at all, and its exit code."""

from __future__ import annotations

import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Any
from unittest import mock

from lvrtc_worker_kit import CONTRACT_VERSION
from lvrtc_worker_kit.fake_engine import OPTIONS_VARIABLE, FakeEngine, command_line, parse_fake_options
from lvrtc_worker_kit.ndarray import encode_ndarray
from lvrtc_worker_kit.protocol import (
    NO_ID,
    REQUEST_FILE_VARIABLE,
    RESULT_FILE_VARIABLE,
    TEMP_SUFFIX,
    encode_reply,
    parse_json,
    reply_to,
    serve,
    serve_oneshot,
    write_file_atomic,
)
from lvrtc_worker_kit.validate import contract_schemas, validate_kind

from .support import REPO_ROOT, read_fixture

CASE: dict[str, Any] = read_fixture("valid", "optical-case", "singlet.json")


def fake() -> FakeEngine:
    return FakeEngine(parse_fake_options({"id": "fake", "bias": 0.25}))


def run_message(message_id: str = "r") -> dict[str, Any]:
    request = {
        "contract": CONTRACT_VERSION,
        "kind": "request",
        "id": "ab" * 32,
        "caseId": CASE["id"],
        "quantity": "selftest.echo",
        "spec": {"values": encode_ndarray("f8", [1.5, -0.0, 2.5]), "scale": 2},
    }
    params = {"request": request, "case": CASE}
    return {"contract": CONTRACT_VERSION, "id": message_id, "method": "run", "params": params}


HELLO = b'{"contract":"1.0","id":"h","method":"hello","params":{}}\n'
SHUTDOWN = b'{"contract":"1.0","id":"s","method":"shutdown","params":{}}\n'


class OneshotTest(unittest.TestCase):
    def setUp(self) -> None:
        self.directory = Path(tempfile.mkdtemp(prefix="lvrtc-oneshot-test-"))
        self.addCleanup(shutil.rmtree, self.directory)
        self.request = self.directory / "call.request.json"
        self.result = self.directory / "call.result.json"
        self.environ = {REQUEST_FILE_VARIABLE: str(self.request), RESULT_FILE_VARIABLE: str(self.result)}
        self.log = io.StringIO()

    def answer(self, message: bytes, engine: Any = None, environ: dict[str, str] | None = None) -> int:
        """Writes ``message`` as the request file and lets the one-shot worker answer it; returns its exit code."""
        self.request.write_bytes(message)
        engine = engine if engine is not None else fake()
        return serve_oneshot(engine, environ=self.environ if environ is None else environ, log=self.log)

    def reply(self) -> dict[str, Any]:
        """The reply in the result file, checked to be one compact ASCII line that is a protocol response."""
        data = self.result.read_bytes()
        reply = parse_json(data)
        self.assertEqual(data, encode_reply(reply))
        self.assertEqual(validate_kind("protocol-response", reply), [], data)
        return reply

    def test_the_reply_is_the_one_the_ndjson_loop_gives_for_the_same_message_byte_for_byte(self) -> None:
        for message in (HELLO, json.dumps(run_message()).encode() + b"\n", SHUTDOWN, b"garbage\n", b"[1, 2]"):
            self.assertEqual(self.answer(message), 0, message)
            replies = io.BytesIO()
            line = message if message.endswith(b"\n") else message + b"\n"
            serve(fake(), io.BytesIO(line), replies, log=io.StringIO())
            self.assertEqual(self.result.read_bytes(), replies.getvalue(), message)
            self.assertEqual(reply_to(fake(), message, contract_schemas(), io.StringIO())[0], replies.getvalue())
            self.result.unlink()

    def test_hello_a_run_and_shutdown_are_answered_and_the_worker_exits_0(self) -> None:
        self.assertEqual(self.answer(HELLO), 0)
        self.assertEqual(self.reply()["result"]["identity"]["id"], "fake")
        self.assertEqual(self.answer(json.dumps(run_message("r-1")).encode()), 0)
        ran = self.reply()
        self.assertEqual((ran["id"], ran["result"]["status"], ran["result"]["data"]["sum"]), ("r-1", "ok", 8.75))
        self.assertEqual(self.answer(SHUTDOWN), 0)
        self.assertEqual(self.reply(), {"contract": CONTRACT_VERSION, "id": "s", "ok": True, "result": {}})
        # The worker leaves its reply and nothing else: no temporary file beside it.
        self.assertEqual(sorted(path.name for path in self.directory.iterdir()), [self.request.name, self.result.name])

    def test_a_message_that_cannot_be_handled_is_answered_ok_false_and_the_worker_still_exits_0(self) -> None:
        cases = [
            (b"not json", "parse-error", NO_ID),
            (b'{"contract":"1.0","id":"x","method":"hello","params":{"a":1}}', "bad-request", "x"),
            (b'{"contract":"1.0","id":"y","method":"fly","params":{}}', "unknown-method", "y"),
            (b'{"contract":"1.0","id":"z","method":"run","params":{"request":{}}}', "bad-request", "z"),
        ]
        for message, code, message_id in cases:
            self.assertEqual(self.answer(message), 0, message)
            reply = self.reply()
            self.assertIs(reply["ok"], False)
            self.assertEqual((reply["error"]["code"], reply["id"]), (code, message_id), reply)

    def test_the_reply_is_written_to_a_temporary_file_beside_the_result_and_renamed_over_it(self) -> None:
        self.result.write_bytes(b"an older reply")
        renames: list[tuple[str, str]] = []
        real_replace = os.replace

        def replace(source: Any, target: Any) -> None:
            renames.append((str(source), str(target)))
            # At the moment of the rename the temporary file is whole and the result file is still the old one.
            self.assertEqual(parse_json(Path(source).read_bytes())["id"], "h")
            self.assertEqual(self.result.read_bytes(), b"an older reply")
            real_replace(source, target)

        with mock.patch("lvrtc_worker_kit.protocol.os.replace", side_effect=replace):
            self.assertEqual(self.answer(HELLO), 0)
        ((source, target),) = renames
        self.assertEqual(target, str(self.result))
        self.assertEqual(os.path.dirname(source), str(self.directory))
        self.assertTrue(os.path.basename(source).startswith(self.result.name + "."))
        self.assertTrue(source.endswith(TEMP_SUFFIX))
        self.assertEqual(self.reply()["id"], "h")

    def test_a_write_that_fails_leaves_no_file_and_says_so_in_the_log_with_exit_code_2(self) -> None:
        with mock.patch("lvrtc_worker_kit.protocol.os.replace", side_effect=OSError("disk full")):
            self.assertEqual(self.answer(HELLO), 2)
        self.assertEqual([path.name for path in self.directory.iterdir()], [self.request.name])
        self.assertIn("the result file cannot be written: disk full", self.log.getvalue())

        elsewhere = {**self.environ, RESULT_FILE_VARIABLE: str(self.directory / "missing" / "result.json")}
        self.assertEqual(self.answer(HELLO, environ=elsewhere), 2)
        self.assertEqual([path.name for path in self.directory.iterdir()], [self.request.name])

        with self.assertRaises(FileNotFoundError):
            write_file_atomic(str(self.directory / "missing" / "x"), b"x")

    def test_without_a_result_file_nothing_is_written_and_the_exit_code_is_2(self) -> None:
        unset = {REQUEST_FILE_VARIABLE: str(self.request)}
        for environ in (unset, {**unset, RESULT_FILE_VARIABLE: ""}):
            self.assertEqual(self.answer(HELLO, environ=environ), 2)
            self.assertIn(f"{RESULT_FILE_VARIABLE} is not set", self.log.getvalue())
            self.assertEqual([path.name for path in self.directory.iterdir()], [self.request.name])

    def test_a_request_file_that_is_not_set_or_cannot_be_read_is_answered_parse_error(self) -> None:
        self.assertEqual(serve_oneshot(fake(), environ={RESULT_FILE_VARIABLE: str(self.result)}, log=self.log), 0)
        reply = self.reply()
        self.assertEqual((reply["ok"], reply["id"], reply["error"]["code"]), (False, NO_ID, "parse-error"))
        self.assertIn(f"{REQUEST_FILE_VARIABLE} is not set", reply["error"]["message"])

        missing = {**self.environ, REQUEST_FILE_VARIABLE: str(self.directory / "absent.json")}
        self.assertEqual(serve_oneshot(fake(), environ=missing, log=self.log), 0)
        reply = self.reply()
        self.assertEqual((reply["ok"], reply["error"]["code"]), (False, "parse-error"))
        self.assertIn("the request file cannot be read", reply["error"]["message"])

    def test_oneshot_is_how_the_fake_runs_and_no_option_of_its_engine(self) -> None:
        options, oneshot = command_line(["--id", "f", "--oneshot"], {})
        self.assertTrue(oneshot)
        self.assertEqual(options, command_line(["--id", "f"], {})[0])
        self.assertFalse(command_line(["--id", "f"], {})[1])


class OneshotProcessTest(unittest.TestCase):
    """The fake as the process a one-shot transport starts: one message in by a file, its reply out by another."""

    def test_as_a_process_it_answers_one_message_by_files_and_its_standard_output_is_only_log(self) -> None:
        inherited = {name: os.environ[name] for name in ("PATH", "SYSTEMROOT") if name in os.environ}
        options = json.dumps({"id": "fake-py", "bias": 0.25})
        with tempfile.TemporaryDirectory(prefix="lvrtc-oneshot-test-") as directory:
            request = Path(directory) / "call.request.json"
            result = Path(directory) / "call.result.json"

            def worker(message: bytes, *arguments: str) -> subprocess.CompletedProcess[bytes]:
                request.write_bytes(message)
                return subprocess.run(
                    [sys.executable, "-B", "-m", "lvrtc_worker_kit.fake_engine", "--oneshot", *arguments],
                    input=b"",
                    capture_output=True,
                    cwd=REPO_ROOT / "workers" / "python",
                    env={
                        **inherited,
                        "PYTHONDONTWRITEBYTECODE": "1",
                        OPTIONS_VARIABLE: options,
                        REQUEST_FILE_VARIABLE: str(request),
                        RESULT_FILE_VARIABLE: str(result),
                    },
                    timeout=60,
                    check=False,
                )

            ran = worker(json.dumps(run_message("r-2")).encode() + b"\n")
            self.assertEqual((ran.returncode, ran.stdout, ran.stderr), (0, b"", b""))
            reply = parse_json(result.read_bytes())
            self.assertEqual((reply["id"], reply["result"]["data"]["sum"]), ("r-2", 8.75))
            # The same bytes as the loop on the standard streams writes for the same message.
            stdio = subprocess.run(
                [sys.executable, "-B", "-m", "lvrtc_worker_kit.fake_engine"],
                input=json.dumps(run_message("r-2")).encode() + b"\n",
                capture_output=True,
                cwd=REPO_ROOT / "workers" / "python",
                env={**inherited, "PYTHONDONTWRITEBYTECODE": "1", OPTIONS_VARIABLE: options},
                timeout=60,
                check=False,
            )
            self.assertEqual(stdio.stdout, result.read_bytes())

            refused = worker(b"garbage")
            self.assertEqual(refused.returncode, 0)
            self.assertEqual(parse_json(result.read_bytes())["error"]["code"], "parse-error")
            self.assertEqual(sorted(os.listdir(directory)), [request.name, result.name])

            # Options it cannot use: no engine, so no reply, and the exit code says so.
            result.unlink()
            bad = worker(HELLO, "--id", "Not An Id")
            self.assertNotEqual(bad.returncode, 0)
            self.assertFalse(result.exists())


if __name__ == "__main__":
    unittest.main()
