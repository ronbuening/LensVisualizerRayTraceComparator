"""What the tests of the optiland worker share.

Most of them need no optiland: they run the worker's own code on temporary trees, and the worker itself on the fake
``optiland`` of ``test/fixtures/fake-optiland``, which is put in front of whatever the interpreter has installed.
The tests of ``test_real.py`` need the real one and skip, with the reason, under an interpreter that has none.
"""

from __future__ import annotations

import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Any

from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray
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
    """The contract's ``run`` message, as one line: a ``rays.trace`` request about the singlet."""
    return FIXTURE_DIR.joinpath("valid", "protocol-request", "run.json").read_bytes().replace(b"\n", b"") + b"\n"


UNOFFERED_QUANTITY = "selftest.echo"
"""A quantity of the contract that the engine does not offer: the conformance quantity, which needs no optics."""


def unoffered_request() -> dict[str, Any]:
    """The request of the contract's ``run`` message, asking for a quantity the engine does not offer.

    The engine refuses it by its descriptor before it looks at the spec, so the spec may stay what it is.
    """
    request = read_fixture("valid", "protocol-request", "run.json")["params"]["request"]
    return {**request, "quantity": UNOFFERED_QUANTITY}


def unoffered_line() -> bytes:
    """The ``run`` message that asks the contract's singlet for a quantity the engine does not offer, as one line."""
    return run_message(unoffered_request(), read_fixture("valid", "protocol-request", "run.json")["params"]["case"])


def describe_request(case: dict[str, Any], spec: dict[str, Any] | None = None) -> dict[str, Any]:
    """A ``system.describe`` request about ``case``. Its id is a made-up one: a worker echoes ids and checks none."""
    return {
        "contract": "1.0",
        "kind": "request",
        "id": "d" * 64,
        "caseId": case["id"],
        "quantity": "system.describe",
        "spec": {} if spec is None else spec,
    }


def first_order_request(case: dict[str, Any], spec: dict[str, Any] | None = None) -> dict[str, Any]:
    """A ``paraxial.first-order`` request about ``case``, with a made-up id; its spec is the empty object."""
    return {**describe_request(case, spec), "id": "f" * 64, "quantity": "paraxial.first-order"}


def run_message(request: dict[str, Any], case: dict[str, Any]) -> bytes:
    """The ``run`` message that asks ``request`` of ``case``, as one line."""
    message = {"contract": "1.0", "id": "r", "method": "run", "params": {"request": request, "case": case}}
    return json.dumps(message, allow_nan=False, separators=(",", ":")).encode("ascii") + b"\n"


def describe_line(case: dict[str, Any], spec: dict[str, Any] | None = None) -> bytes:
    """The ``run`` message that asks ``system.describe`` of ``case``, as one line."""
    return run_message(describe_request(case, spec), case)


def first_order_line(case: dict[str, Any], spec: dict[str, Any] | None = None) -> bytes:
    """The ``run`` message that asks ``paraxial.first-order`` of ``case``, as one line."""
    return run_message(first_order_request(case, spec), case)


def ray_spec(
    origins: list[tuple[float, float, float]],
    directions: list[tuple[float, float, float]],
    *,
    line: int = 0,
    weights: list[float] | None = None,
    **groups: Any,
) -> dict[str, Any]:
    """A ``rays.trace`` spec of the rays given, each number as the float64 it is; every weight is 1 unless given."""
    count = len(origins)
    spec: dict[str, Any] = {
        "line": line,
        "origins": encode_ndarray("f8", [value for point in origins for value in point], [count, 3]),
        "directions": encode_ndarray("f8", [value for vector in directions for value in vector], [count, 3]),
        "weights": encode_ndarray("f8", [1.0] * count if weights is None else weights, [count]),
    }
    if groups:
        spec["groups"] = groups
    return spec


def trace_request(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    """A ``rays.trace`` request about ``case``, with a made-up id."""
    return {**describe_request(case, spec), "id": "7" * 64, "quantity": "rays.trace"}


def trace_line(case: dict[str, Any], spec: dict[str, Any]) -> bytes:
    """The ``run`` message that asks ``rays.trace`` of ``case``, as one line."""
    return run_message(trace_request(case, spec), case)


# ── Synthetic cases ──────────────────────────────────────────────────────────────────────────────────────────────

D_LINE = 587.5618
"""The wavelength of a synthetic case's one line, nm."""


def surface(z: float, shape: dict[str, Any], semi: float = 10.0, **more: Any) -> dict[str, Any]:
    """One surface of a synthetic case; the thickness is filled in by ``make_case``."""
    aperture = {
        "semiDiameter": more.pop("clip", semi),
        "nominalSemiDiameter": semi,
        "innerSemiDiameter": more.pop("inner", 0),
    }
    return {
        "label": more.pop("label", "s"),
        "z": z,
        "thickness": 0,
        "shape": shape,
        "aperture": aperture,
        "elementId": 0,
    }


def sphere(radius: float, conic: float = 0) -> dict[str, Any]:
    return {"kind": "conic", "radius": radius, "conic": conic}


def asphere(radius: float | None, conic: float, *terms: tuple[int, float]) -> dict[str, Any]:
    stated = [{"power": power, "coeff": coeff} for power, coeff in terms]
    return {"kind": "asphere", "radius": radius, "conic": conic, "terms": stated}


PLANE: dict[str, Any] = {"kind": "plane"}


def make_case(
    surfaces: list[dict[str, Any]],
    *,
    stop: int = 0,
    image_z: float | None = None,
    stop_radius: float = 2.0,
    object_z: float | None = None,
    lines: tuple[float, ...] = (D_LINE,),
    indices: list[list[float]] | None = None,
    last_lens: int | None = None,
) -> dict[str, Any]:
    """A synthetic optical case. Its ids are made up: nothing in a worker computes or checks one.

    Without ``indices`` the surfaces bound glass of index 1.5 and air in turn, at every line. The design image
    plane lies 25 mm behind the last vertex. ``last_lens`` is the index of the rear lens vertex, the last surface
    without it: every surface behind it is marked as a rear plate.
    """
    design = surfaces[-1]["z"] + 25.0
    rear = len(surfaces) - 1 if last_lens is None else last_lens
    for entry in surfaces[rear + 1 :]:
        entry["synthetic"] = "rearPlate"
    for number, entry in enumerate(surfaces):
        entry["label"] = str(number + 1)
        following = surfaces[number + 1]["z"] if number + 1 < len(surfaces) else design
        entry["thickness"] = following - entry["z"]
    rows = (
        indices
        if indices is not None
        else [[1.5 if number % 2 == 0 else 1.0 for number in range(len(surfaces))]] * len(lines)
    )
    return {
        "contract": "1.0",
        "kind": "optical-case",
        "id": "c" * 64,
        "systemId": "5" * 64,
        "label": {"name": "synthetic"},
        "system": {
            "surfaces": surfaces,
            "stopIndex": stop,
            "lastLensSurfaceIndex": rear,
            "designImageZ": design,
        },
        "conditions": {
            "object": {"kind": "infinity"} if object_z is None else {"kind": "finite", "z": object_z},
            "stopSemiDiameter": stop_radius,
            "imageZ": design if image_z is None else image_z,
            "lines": [{"wavelengthNm": nm, "weight": 1, "indexSource": "authored"} for nm in lines],
            "indexAfterSurface": encode_ndarray("f8", [n for row in rows for n in row], [len(lines), len(surfaces)]),
        },
        "features": [],
        "provenance": {
            "source": {"kind": "fixture", "name": "synthetic"},
            "producer": {"tool": "lvrtc", "version": "0"},
        },
    }


def f8(wire: dict[str, Any]) -> list[float]:
    """The elements of a float64 array of an answer, in order."""
    return decode_ndarray(wire).values()


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
