"""The engine: optiland as the protocol loop sees it. This module is the door to optiland.

``load_engine`` imports optiland, after ``hygiene.prepare`` has run, and gives the engine; when optiland cannot be
imported it gives an engine that says so to every ``hello``, with what to set, and the worker stays a worker.

In this stage the engine offers no quantity: it identifies itself, and answers every run "unsupported".
"""

from __future__ import annotations

import importlib
import importlib.metadata
import platform
import sys
from pathlib import Path
from typing import Any

from lvrtc_worker_kit import CONTRACT_VERSION
from lvrtc_worker_kit.protocol import engine_stamp, make_result

from . import ENGINE_ID
from .hygiene import CacheDirs, check
from .identity import adapter_revision, engine_identity

SUPPORTED_FEATURES: tuple[str, ...] = ("lines.multiple", "surface.asphere.even", "surface.conic")
"""The feature flags of a case the engine handles, sorted: those the planning spike measured against LensVisualizer
on the benchmark lenses (conics and even aspheres up to the r^20 term, one optic per spectral line). A flag joins
the list with the code and the test that honour it: an annular aperture, a finite object, an odd asphere and an
asphere without a base radius are not claimed yet."""

QUANTITIES: dict[str, dict[str, int]] = {}
"""The quantities the engine answers, each with the version of its definition. None yet."""

SETTING_HINT = (
    "set engines.optiland.python in lvrtc.local.json (or LVRTC_OPTILAND_PYTHON) to an interpreter that can import "
    "optiland, numpy, scipy and numba"
)
"""What to do about an interpreter that cannot be the engine's."""


class EngineUnavailable(RuntimeError):
    """optiland cannot be used by this interpreter. The message says why and what to set."""


class OptilandEngine:
    """optiland, for the protocol loop: ``describe()`` and ``run(request, case)``."""

    def __init__(self, identity: dict[str, Any]) -> None:
        self._descriptor: dict[str, Any] = {
            "contract": {"min": CONTRACT_VERSION, "max": CONTRACT_VERSION},
            "identity": identity,
            "capabilities": {
                "features": {"supported": list(SUPPORTED_FEATURES), "limits": {}},
                "quantities": {name: dict(entry) for name, entry in QUANTITIES.items()},
                "deterministic": True,
                "maxConcurrency": 1,
            },
        }

    def describe(self) -> dict[str, Any]:
        """The engine's descriptor, the same every time."""
        return self._descriptor

    def run(self, request: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
        """The result of one request. No quantity is offered yet, so each is answered "unsupported"."""
        quantity = request["quantity"]
        item = {"code": "quantity", "item": quantity, "message": f"the engine {ENGINE_ID} does not offer {quantity}"}
        return make_result(request, engine_stamp(self._descriptor), "unsupported", unsupported=[item])


class UnavailableEngine:
    """Stands where the engine would when optiland cannot be loaded: every message is refused with the reason."""

    def __init__(self, reason: str) -> None:
        self.reason = reason

    def describe(self) -> dict[str, Any]:
        raise EngineUnavailable(self.reason)

    def run(self, request: dict[str, Any], case: dict[str, Any]) -> dict[str, Any]:
        raise EngineUnavailable(self.reason)


def refused_engine(error: Exception) -> UnavailableEngine:
    """The engine of a worker that must not compute, as ``hygiene`` found: its reason names the interpreter."""
    return UnavailableEngine(f"{sys.executable} cannot run optiland for the comparator: {error}")


def load_engine(dirs: CacheDirs) -> OptilandEngine | UnavailableEngine:
    """Imports optiland and what it computes with, checks the state they are in, and gives the engine.

    ``dirs`` is what ``hygiene.prepare`` returned: it must have run before this is called. An import that fails,
    and a state the worker must not compute in (``hygiene.check``), give an ``UnavailableEngine`` whose reason
    names the interpreter and the setting.
    """
    try:
        numpy = importlib.import_module("numpy")
        scipy = importlib.import_module("scipy")
        numba = importlib.import_module("numba")
        optiland = importlib.import_module("optiland")
        importlib.import_module("optiland.backend")
        dist_version = importlib.metadata.version("optiland")
    except Exception as error:  # noqa: BLE001 - an import can fail in any way a module's code can
        reason = f"{sys.executable} cannot import optiland ({type(error).__name__}: {error}): {SETTING_HINT}"
        return UnavailableEngine(reason)
    try:
        check(dirs, optiland, numba)
    except Exception as error:  # noqa: BLE001
        return refused_engine(error)
    identity = engine_identity(
        engine_id=ENGINE_ID,
        package_dir=Path(optiland.__file__).resolve().parent,
        dist_version=dist_version,
        python=platform.python_version(),
        numpy=str(numpy.__version__),
        scipy=str(scipy.__version__),
        numba=str(numba.__version__),
        jit=not bool(numba.config.DISABLE_JIT),
        adapter=adapter_revision(),
    )
    return OptilandEngine(identity)
