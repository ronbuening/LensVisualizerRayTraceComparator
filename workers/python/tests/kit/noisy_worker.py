"""A worker whose engine writes to the standard output in every way there is, for the test of ``protect_stdout``.

Run as ``python -m tests.kit.noisy_worker`` from ``workers/python``. With ``--late`` the reply stream is reserved by
``serve_stdio`` itself, and not before the engine is made. With ``--raise`` every second run raises an exception,
the first one first.
"""

from __future__ import annotations

import os
import subprocess
import sys
import warnings
from typing import Any

from lvrtc_worker_kit.protocol import engine_stamp, make_result, protect_stdout, serve_stdio

from .support import read_fixture


def shout(where: str) -> None:
    """Writes to the standard output by Python's stream, by its file descriptor, by a warning and by a child."""
    print(f"print {where}")
    sys.stdout.flush()
    os.write(1, f"fd1 {where}\n".encode("ascii"))
    sys.__stdout__.write(f"dunder {where}\n")
    sys.__stdout__.flush()
    warnings.warn(f"warning {where}", RuntimeWarning, stacklevel=1)
    subprocess.run([sys.executable, "-c", f"print('child {where}')"], check=True)


class NoisyEngine:
    """Answers every run "unsupported", noisily."""

    def __init__(self, raises: bool = False) -> None:
        self._descriptor: dict[str, Any] = read_fixture("valid", "engine-descriptor", "minimal.json")
        self._raises = raises
        self._runs = 0

    def describe(self) -> dict[str, Any]:
        shout("in describe")
        return self._descriptor

    def run(self, request: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
        shout("in run")
        self._runs += 1
        if self._raises and self._runs % 2 == 1:
            raise ZeroDivisionError("the ray went sideways")
        item = {"code": "quantity", "item": request["quantity"], "message": "not offered"}
        return make_result(request, engine_stamp(self._descriptor), "unsupported", unsupported=[item])


def main() -> int:
    raises = "--raise" in sys.argv[1:]
    if "--late" in sys.argv[1:]:
        return serve_stdio(NoisyEngine(raises))
    replies = protect_stdout()
    shout("at import")
    return serve_stdio(NoisyEngine(raises), replies=replies)


if __name__ == "__main__":
    sys.exit(main())
