"""What the tests of the optiland worker share.

Most of them need no optiland: they run the worker's own code on temporary trees, and the worker itself on the fake
``optiland`` of ``test/fixtures/fake-optiland``, which is put in front of whatever the interpreter has installed.
The tests of ``test_real.py`` need the real one and skip, with the reason, under an interpreter that has none.
"""

from __future__ import annotations

import importlib.util
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Any

from lvrtc_worker_kit.protocol import parse_json

REPO_ROOT: Path = Path(__file__).resolve().parents[4]
WORKERS_DIR: Path = REPO_ROOT / "workers" / "python"
FAKE_SITE: Path = REPO_ROOT / "test" / "fixtures" / "fake-optiland" / "site"
FIXTURE_DIR: Path = REPO_ROOT / "contract" / "fixtures" / "v1"

HELLO: bytes = b'{"contract":"1.0","id":"h","method":"hello","params":{}}\n'
SHUTDOWN: bytes = b'{"contract":"1.0","id":"s","method":"shutdown","params":{}}\n'

GIT_MISSING: str | None = None if shutil.which("git") else "git is not available on this machine"


def read_fixture(*parts: str) -> Any:
    """One fixture file of the contract, parsed as the protocol loop parses a line."""
    return parse_json(FIXTURE_DIR.joinpath(*parts).read_bytes())


def run_line() -> bytes:
    """The contract's ``run`` message, as one line."""
    return FIXTURE_DIR.joinpath("valid", "protocol-request", "run.json").read_bytes().replace(b"\n", b"") + b"\n"


class TempDirTest(unittest.TestCase):
    """A test with a temporary directory of its own, removed afterwards."""

    def setUp(self) -> None:
        holder = tempfile.TemporaryDirectory(prefix="lvrtc-optiland-")
        self.addCleanup(holder.cleanup)
        self.tmp = Path(holder.name).resolve()

    def fake_site(self) -> Path:
        """A copy of the fake optiland's site directory, outside any git checkout."""
        site = self.tmp / "site"
        shutil.copytree(FAKE_SITE, site)
        return site

    def worker(
        self, site: Path | None, lines: bytes = b"", *arguments: str, env: dict[str, str] | None = None
    ) -> subprocess.CompletedProcess[bytes]:
        """Runs ``python -m lvrtc_optiland`` with ``site`` in front of the worker on its path, and its caches here."""
        inherited = {name: os.environ[name] for name in ("PATH", "SYSTEMROOT", "HOME") if name in os.environ}
        path = [str(WORKERS_DIR)] if site is None else [str(site), str(WORKERS_DIR)]
        environment = {
            **inherited,
            "PYTHONDONTWRITEBYTECODE": "1",
            "PYTHONPATH": os.pathsep.join(path),
            "LVRTC_CACHE_DIR": str(self.tmp / "cache"),
            **(env or {}),
        }
        return subprocess.run(
            [sys.executable, "-m", "lvrtc_optiland", *arguments],
            input=lines,
            capture_output=True,
            cwd=self.tmp,
            env=environment,
            timeout=300,
            check=False,
        )


def real_optiland_missing() -> str | None:
    """Why the tests of the real optiland are skipped under this interpreter, or None when they can run."""
    for name in ("numpy", "scipy", "numba", "optiland"):
        try:
            found = importlib.util.find_spec(name)
        except (ImportError, ValueError):
            found = None
        if found is None:
            return f"{sys.executable} has no {name}: run them with engines.optiland.python (npm run test:optiland)"
    return None
