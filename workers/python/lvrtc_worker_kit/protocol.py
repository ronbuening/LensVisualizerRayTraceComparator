"""The engine protocol over NDJSON: one JSON object per line in, exactly one compact JSON line out for each.

The protocol is stateless (contract/CONTRACT.md, "protocol-request and protocol-response"): ``hello`` is answered
with the engine's descriptor, ``run`` carries a request together with its optical case and is answered with a
result, and ``shutdown`` is answered with an empty object, after which the loop ends. An engine is any object with
``describe()`` and ``run(request, case)``; this module supplies the rest.

What the loop guarantees, whatever arrives and whatever the engine does:
  - every line read gets exactly one reply line, written whole and flushed, and nothing else is ever written to
    the reply stream: logging goes to the log stream;
  - a reply is ASCII and holds no ``NaN`` or ``Infinity`` token;
  - a line that is not JSON, a message that is not an object or not a protocol request, an unknown method, a run
    whose request or case is not valid, an exception in the engine and an answer that is not valid are all
    answered ``{ "ok": false, "error": { "code", "message" } }``, with the message's ``id`` when one can be read;
  - ids are echoed, never recomputed: Python does not write numbers the way the hashes need them written.
"""

from __future__ import annotations

import json
import sys
import traceback
from typing import Any, BinaryIO, Protocol, TextIO

from . import CONTRACT_VERSION
from .ndarray import NdArrayError, decode_ndarray
from .validate import SchemaSet, contract_schemas, format_issues, validate_kind

NO_ID = "?"
"""The ``id`` of a reply to a line no id could be read from. A reply needs one, and it must not be empty."""

METHODS: tuple[str, ...] = ("hello", "run", "shutdown")
"""Every method of the protocol."""

ERROR_CODES: tuple[str, ...] = (
    "parse-error",
    "bad-request",
    "unknown-method",
    "engine-failure",
    "invalid-result",
)
"""The ``error.code`` of every refusal the loop writes:

- ``parse-error``: the line is not UTF-8, not JSON, or holds a ``NaN`` or ``Infinity`` token;
- ``bad-request``: the message is not a protocol request, or a run's request or case is not valid by its own kind,
  holds an array that does not decode, or the request is about another case;
- ``unknown-method``: the method is none of ``METHODS``;
- ``engine-failure``: the engine raised an exception;
- ``invalid-result``: what the engine returned is not a valid descriptor or result, or does not echo the ids.
"""


class Engine(Protocol):
    """An engine, without the protocol."""

    def describe(self) -> dict[str, Any]:
        """What the engine answers to ``hello``: an engine descriptor."""
        ...

    def run(self, request: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
        """Answers one request about one case; both have been validated. "unsupported" is returned, not raised."""
        ...


def engine_stamp(descriptor: dict[str, Any]) -> dict[str, Any]:
    """The ``engine`` member of every result an engine with this descriptor gives: its id, fingerprint and details."""
    identity = descriptor["identity"]
    return {"id": identity["id"], "fingerprint": identity["fingerprint"], "details": dict(identity["details"])}


def make_result(request: dict[str, Any], engine: dict[str, Any], status: str, **parts: Any) -> dict[str, Any]:
    """Builds the result of ``request`` as ``engine`` (an ``engine_stamp``) gives it.

    Both ids are echoed from the request, never computed. ``parts`` are the members that go with the status:
    ``unsupported``, ``error``, ``method``, ``data``, ``diagnostics``; one that is None is left out, and
    ``diagnostics`` defaults to no warnings and no counts.
    """
    result: dict[str, Any] = {
        "contract": CONTRACT_VERSION,
        "kind": "result",
        "requestId": request["id"],
        "caseId": request["caseId"],
        "engine": engine,
        "status": status,
    }
    for name in ("unsupported", "error", "method", "data"):
        if parts.get(name) is not None:
            result[name] = parts[name]
    diagnostics = parts.get("diagnostics")
    result["diagnostics"] = diagnostics if diagnostics is not None else {"warnings": [], "counts": {}}
    return result


def result_problems(result: dict[str, Any]) -> list[str]:
    """The status rules of a schema-valid result that its schema cannot state, as a list of what is broken."""
    problems: list[str] = []
    status = result["status"]
    if status == "unsupported" and not result.get("unsupported"):
        problems.append('status "unsupported" needs a non-empty unsupported list')
    if status == "error" and "error" not in result:
        problems.append('status "error" needs error')
    if status == "ok" and "data" not in result:
        problems.append('status "ok" needs data')
    return problems


def case_array_problems(case: dict[str, Any]) -> list[str]:
    """What is wrong with the array of a schema-valid case: its bytes, its digest and its shape.

    ``conditions.indexAfterSurface`` must decode, so its digest is verified, and have one row per line and one
    column per surface. The other invariants of a case are its producer's to keep.
    """
    lines = len(case["conditions"]["lines"])
    surfaces = len(case["system"]["surfaces"])
    try:
        table = decode_ndarray(case["conditions"]["indexAfterSurface"])
    except NdArrayError as error:
        return [f"conditions.indexAfterSurface: {error}"]
    if table.dtype != "f8" or table.shape != (lines, surfaces):
        shape = ", ".join(str(size) for size in table.shape)
        return [
            f"conditions.indexAfterSurface is {table.dtype} of shape [{shape}], "
            f"expected f8 of shape [{lines}, {surfaces}] (lines, surfaces)"
        ]
    return []


def _reject_constant(token: str) -> Any:
    raise ValueError(f"{token} is not JSON")


def parse_json(text: str | bytes) -> Any:
    """Parses JSON strictly: ``NaN``, ``Infinity`` and ``-Infinity``, which ``json`` reads by default, are errors.

    A number too large for a float64, such as ``1e400``, still parses, as an infinity; the validator rejects it.
    Raises a ``ValueError`` for anything that is not JSON, bytes that are not UTF-8 included.
    """
    if isinstance(text, (bytes, bytearray)):
        text = bytes(text).decode("utf-8")
    return json.loads(text, parse_constant=_reject_constant)


def _refused(message_id: str, code: str, text: str) -> dict[str, Any]:
    return {"contract": CONTRACT_VERSION, "id": message_id, "ok": False, "error": {"code": code, "message": text}}


def _answered(message_id: str, result: dict[str, Any]) -> dict[str, Any]:
    return {"contract": CONTRACT_VERSION, "id": message_id, "ok": True, "result": result}


def _run(engine: Engine, message_id: str, params: Any, schemas: SchemaSet, log: TextIO) -> dict[str, Any]:
    if not isinstance(params, dict):
        return _refused(message_id, "bad-request", "params is not an object")
    for member, kind in (("request", "request"), ("case", "optical-case")):
        if member not in params:
            return _refused(message_id, "bad-request", f"params has no {member}")
        issues = validate_kind(kind, params[member], schemas)
        if issues:
            text = f"params.{member} is not a valid {kind}: {format_issues(issues)}"
            return _refused(message_id, "bad-request", text)
    extra = sorted(name for name in params if name not in ("request", "case"))
    if extra:
        return _refused(message_id, "bad-request", f"params has an unexpected member {json.dumps(extra[0])}")
    request, case = params["request"], params["case"]
    problems = case_array_problems(case)
    if problems:
        text = f"params.case is not a valid optical-case: {'; '.join(problems)}"
        return _refused(message_id, "bad-request", text)
    if request["caseId"] != case["id"]:
        text = f"params.request is about case {request['caseId']}, params.case is {case['id']}"
        return _refused(message_id, "bad-request", text)

    try:
        result = engine.run(request, case)
    except Exception as error:  # noqa: BLE001 - whatever an engine raises is answered, never a crash
        traceback.print_exc(file=log)
        return _refused(message_id, "engine-failure", f"{type(error).__name__}: {error}")
    issues = validate_kind("result", result, schemas)
    if issues:
        return _refused(message_id, "invalid-result", f"the engine's answer is not a result: {format_issues(issues)}")
    problems = result_problems(result)
    if result["requestId"] != request["id"]:
        problems.append("requestId does not echo the request's id")
    if result["caseId"] != case["id"]:
        problems.append("caseId does not echo the case's id")
    if problems:
        return _refused(message_id, "invalid-result", f"the engine's answer breaks a rule: {'; '.join(problems)}")
    return _answered(message_id, result)


def handle_message(engine: Engine, message: Any, schemas: SchemaSet, log: TextIO) -> tuple[dict[str, Any], bool]:
    """The reply to one parsed message, and whether it was a ``shutdown`` that was answered. Never raises."""
    message_id = NO_ID
    try:
        if not isinstance(message, dict):
            return _refused(NO_ID, "bad-request", "the message is not an object"), False
        if isinstance(message.get("id"), str) and message["id"] != "":
            message_id = message["id"]
        method = message.get("method")
        if not isinstance(method, str) or method not in METHODS:
            shown = json.dumps(method) if isinstance(method, str) else type(method).__name__
            return _refused(message_id, "unknown-method", f"unknown method {shown}"), False
        # A run's params are validated by their own kinds below, where a fault is reported at its own path; here
        # they are left out, so that the envelope alone is judged.
        envelope = message
        if method == "run":
            if "params" not in message:
                return _refused(message_id, "bad-request", "the message has no params"), False
            envelope = {**message, "method": "hello", "params": {}}
        issues = validate_kind("protocol-request", envelope, schemas)
        if issues:
            text = f"the message is not a protocol request: {format_issues(issues)}"
            return _refused(message_id, "bad-request", text), False

        if method == "shutdown":
            return _answered(message_id, {}), True
        if method == "run":
            return _run(engine, message_id, message["params"], schemas, log), False
        try:
            descriptor = engine.describe()
        except Exception as error:  # noqa: BLE001
            traceback.print_exc(file=log)
            return _refused(message_id, "engine-failure", f"{type(error).__name__}: {error}"), False
        issues = validate_kind("engine-descriptor", descriptor, schemas)
        if issues:
            text = f"the engine's descriptor is not valid: {format_issues(issues)}"
            return _refused(message_id, "invalid-result", text), False
        return _answered(message_id, descriptor), False
    except Exception as error:  # noqa: BLE001 - a fault of the loop itself is still answered
        traceback.print_exc(file=log)
        return _refused(message_id, "engine-failure", f"{type(error).__name__}: {error}"), False


def handle_line(engine: Engine, line: bytes, schemas: SchemaSet, log: TextIO) -> tuple[dict[str, Any], bool]:
    """The reply to one line as it was read, and whether the loop ends after it. Never raises."""
    try:
        message = parse_json(line)
    except (ValueError, RecursionError) as error:
        return _refused(NO_ID, "parse-error", f"the line is not JSON: {error}"), False
    return handle_message(engine, message, schemas, log)


def encode_reply(reply: dict[str, Any]) -> bytes:
    """A reply as its line: compact ASCII JSON and a newline. An answer JSON cannot carry becomes a refusal."""
    try:
        text = json.dumps(reply, allow_nan=False, ensure_ascii=True, separators=(",", ":"))
    except (ValueError, TypeError, RecursionError) as error:
        message_id = reply.get("id") if isinstance(reply.get("id"), str) else NO_ID
        refusal = _refused(message_id, "invalid-result", f"the reply cannot be written as JSON: {error}")
        text = json.dumps(refusal, allow_nan=False, ensure_ascii=True, separators=(",", ":"))
    return text.encode("ascii") + b"\n"


def serve(
    engine: Engine,
    requests: BinaryIO,
    replies: BinaryIO,
    *,
    schemas: SchemaSet | None = None,
    log: TextIO | None = None,
) -> int:
    """Runs the message loop until ``shutdown`` is answered or ``requests`` ends, and returns the exit code, 0.

    ``requests`` and ``replies`` are binary streams. One line is read at a time; its reply is written with one
    write and flushed before the next line is read. ``schemas`` defaults to the contract's schemas beside the kit,
    and ``log`` to the standard error stream.
    """
    schemas = schemas if schemas is not None else contract_schemas()
    log = log if log is not None else sys.stderr
    while True:
        line = requests.readline()
        if not line:
            return 0
        reply, stop = handle_line(engine, line, schemas, log)
        replies.write(encode_reply(reply))
        replies.flush()
        if stop:
            return 0


def serve_stdio(engine: Engine, *, schemas: SchemaSet | None = None) -> int:
    """Runs the message loop on this process's standard streams and returns the exit code.

    The standard output is reserved for replies: ``sys.stdout`` is pointed at the standard error stream for as
    long as the loop runs, so that a ``print`` in an engine is a log line and not a broken reply.
    """
    replies = sys.stdout.buffer
    printed, sys.stdout = sys.stdout, sys.stderr
    try:
        return serve(engine, sys.stdin.buffer, replies, schemas=schemas, log=sys.stderr)
    finally:
        sys.stdout = printed
