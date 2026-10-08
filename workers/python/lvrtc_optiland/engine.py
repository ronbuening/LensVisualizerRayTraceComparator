"""The engine: optiland as the protocol loop sees it. This module is the door to optiland.

``load_engine`` imports optiland, after ``hygiene.prepare`` has run, and gives the engine; when optiland cannot be
imported it gives an engine that says so to every ``hello``, with what to set, and the worker stays a worker.

The engine answers ``system.describe``: the case is built as optiland optics, one for each line (``build``), each
is read back and held to the case, and the answer is written from the optics alone. An optic that is not the case
is answered as an error that names the surface and the field, never described.
"""

from __future__ import annotations

import importlib
import importlib.metadata
import platform
import sys
from collections.abc import Callable
from pathlib import Path
from typing import Any

from lvrtc_worker_kit import CONTRACT_VERSION
from lvrtc_worker_kit.protocol import engine_stamp, make_result
from lvrtc_worker_kit.validate import (
    SchemaSet,
    ValidationIssue,
    contract_schemas,
    format_issues,
    quantity_schema_id,
    validate,
)

from . import ENGINE_ID
from .build import ASPHERE_MAX_ITERATIONS, ASPHERE_TOLERANCE_MM, BuildMismatch, BuiltCase, build_case, describe_optics
from .hygiene import CacheDirs, check
from .identity import adapter_revision, engine_identity

SUPPORTED_FEATURES: tuple[str, ...] = (
    "aperture.annular",
    "lines.multiple",
    "object.finite",
    "surface.asphere.even",
    "surface.asphere.flat-base",
    "surface.asphere.odd",
    "surface.conic",
)
"""The feature flags of a case the builder honours, sorted, which is every flag the contract has. Each is built,
read back and held to the case by ``build.verify_optic``, and has a test on the real optiland:

- ``aperture.annular``: the inner radius of a ``RadialAperture``, which passes a ray at exactly that height;
- ``lines.multiple``: one optic for each line, with that line's indices and wavelength;
- ``object.finite``: the object surface at the object plane;
- ``surface.asphere.even``, ``surface.asphere.odd``: optiland's two aspheres, with their coefficient lists;
- ``surface.asphere.flat-base``: an asphere of infinite radius, which keeps its conic constant;
- ``surface.conic``: the conic constant of a standard surface and of an asphere.

The engine states no limit: a coefficient list is as long as the highest power of a case asks, and nothing in the
builder counts lines or surfaces."""

SYSTEM_DESCRIBE = "system.describe"
"""The id of the quantity that echoes the built system."""

QUANTITIES: dict[str, dict[str, int]] = {SYSTEM_DESCRIBE: {"version": 2}}
"""The quantities the engine answers, each with the version of its definition that the worker implements."""

DEFAULT_SAG_FRACTIONS: tuple[float, ...] = (0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0)
"""The fractions of ``system.describe`` when a spec names none (contract/CONTRACT.md)."""

BUILD_MISMATCH = "build-mismatch"
"""The ``error.code`` of a result about a case that optiland did not build as it is stated."""

BAD_SPEC = "bad-spec"
"""The ``error.code`` of a result for a spec that is not the quantity's."""

SETTING_HINT = (
    "set engines.optiland.python in lvrtc.local.json (or LVRTC_OPTILAND_PYTHON) to an interpreter that can import "
    "optiland, numpy, scipy and numba"
)
"""What to do about an interpreter that cannot be the engine's."""


class EngineUnavailable(RuntimeError):
    """optiland cannot be used by this interpreter. The message says why and what to set."""


def refusals(request: dict[str, Any], case: dict[str, Any]) -> list[dict[str, str]]:
    """What keeps the engine from answering ``request`` about ``case``, by its own descriptor; empty when nothing does.

    In the order of the comparator's negotiation (``src/core/negotiate.ts``): a contract version that is not the
    worker's, the case's first; the quantity, when it is not offered; each feature flag the case states that is not
    supported. The engine states no limit, so none is exceeded.
    """
    items: list[dict[str, str]] = []
    written = (("the case", case["contract"]), ("the request", request["contract"]))
    for version in dict.fromkeys(stated for _, stated in written):
        if version == CONTRACT_VERSION:
            continue
        names = [name for name, stated in written if stated == version]
        said = f"{' and '.join(names)} {'are' if len(names) > 1 else 'is'} written to {version}"
        message = f"the engine speaks contract {CONTRACT_VERSION} to {CONTRACT_VERSION}; {said}"
        items.append({"code": "contract", "item": version, "message": message})
    quantity = request["quantity"]
    if quantity not in QUANTITIES:
        items.append({"code": "quantity", "item": quantity, "message": f"the engine does not offer {quantity}"})
    for flag in case["features"]:
        if flag not in SUPPORTED_FEATURES:
            items.append({"code": "feature", "item": flag, "message": f"the engine does not support {flag}"})
    return items


class OptilandEngine:
    """optiland, for the protocol loop: ``describe()`` and ``run(request, case)``.

    ``build`` makes the optics of a case and verifies them; it is ``build.build_case`` unless a test says otherwise.
    """

    def __init__(
        self,
        identity: dict[str, Any],
        *,
        schemas: SchemaSet | None = None,
        build: Callable[[dict[str, Any]], BuiltCase] = build_case,
    ) -> None:
        self._schemas = schemas if schemas is not None else contract_schemas()
        self._build = build
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
        """The result of one request about one case.

        - What the engine's own descriptor rules out is a result of status "unsupported" (``refusals``).
        - A spec that is not the quantity's is a result of status "error" with the code ``bad-spec``.
        - A case that optiland did not build as it is stated is a result of status "error" with the code
          ``build-mismatch``, whose message names the surface and the field: nothing is answered about such an
          optic.
        - Anything else that goes wrong is raised, and the protocol loop answers it as ``engine-failure``.
        """
        engine = engine_stamp(self._descriptor)
        refused = refusals(request, case)
        if refused:
            return make_result(request, engine, "unsupported", unsupported=refused)

        quantity = request["quantity"]
        spec = request["spec"]
        issues = validate(self._schemas, quantity_schema_id(quantity, "spec"), spec)
        if issues:
            message = f"spec is not a {quantity} spec: {format_issues(issues)}"
            return make_result(request, engine, "error", error={"code": BAD_SPEC, "message": message})
        stated = spec.get("sagFractions", DEFAULT_SAG_FRACTIONS)
        # The one rule of a spec that its schema cannot state (src/quantities/systemDescribe.ts): the fractions ascend.
        unordered = next((at for at in range(1, len(stated)) if not stated[at] > stated[at - 1]), None)
        if unordered is not None:
            said = f"the fractions must ascend: {stated[unordered]} follows {stated[unordered - 1]}"
            issue = ValidationIssue(f"/sagFractions/{unordered}", "invariant", said)
            message = f"spec is not a {quantity} spec: {format_issues([issue])}"
            return make_result(request, engine, "error", error={"code": BAD_SPEC, "message": message})
        fractions = [float(fraction) for fraction in stated]

        try:
            built = self._build(case)
        except BuildMismatch as error:
            return make_result(request, engine, "error", error={"code": BUILD_MISMATCH, "message": str(error)})
        data = describe_optics(built.optics, fractions)
        issues = validate(self._schemas, quantity_schema_id(quantity, "data"), data)
        if issues:
            raise RuntimeError(f"the answer is not {quantity} data: {format_issues(issues)}")
        return make_result(
            request,
            engine,
            "ok",
            method={
                "name": "optic-readback",
                "params": {
                    "asphereTolerance": ASPHERE_TOLERANCE_MM,
                    "asphereMaxIterations": ASPHERE_MAX_ITERATIONS,
                    "positioning": "absolute-z",
                },
            },
            data=data,
            diagnostics={"warnings": [], "counts": {"surfaces": data["surfaceCount"], "lines": len(built.optics)}},
        )


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
    names the interpreter and the setting. What the builder uses of optiland is imported when the first case is
    built.
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
