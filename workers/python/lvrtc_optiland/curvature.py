"""``curvature.native``: optiland's own field curves of a case, one field and one line at a time.

The figures are optiland's: its ``FieldCurvature`` analysis (``optiland/analysis/field_curvature.py``), which traces a
pair of parabasal rays at ``-delta`` and ``+delta`` of the pupil in the meridional section, and another across it, at
each of its points of the field, and states where the two rays of a pair cross each other, along z from the image
surface. Nothing of a figure is computed here. What is the worker's is what the request needs around the class, and
each is stated in the answer:

- **One field per call, and a new optic for every call**, as for the MTF (``mtf.field_optic``): optiland's aimer keeps
  what it solved, and a number must not depend on what was asked before it. The optic's one field is the angle asked,
  under the worker's ``robust`` aiming, so that a pair of parabasal rays is centred on the chief ray through the centre
  of the real stop, as LensVisualizer's are.
- **The analysis** is ``FieldCurvature(optic, wavelengths="primary", num_points=2)``: its points of the field are the
  normalised fields 0 and 1, the axis and the one field of the optic; the second is read. Its pairs are at
  ``delta = 1e-5`` of the pupil, the default of its two methods, read back.
- **The chief ray that identifies a field** is optiland's under the worker's ``robust`` aiming
  (``spot.chief_landing``, through ``mtf.probe_field``), on an optic of its own: its landing on the image plane of the
  case is ``chiefLandingMm``.
- **The frame.** optiland's positive field angle is an object toward -y, the contract's one toward +y: a landing is
  optiland's with its sign changed. A focus along z is the same in both frames.

Every setting is read back (``curvature_step``), each check with a test that makes the mistake on purpose: the class
of the analysis, its points, its wavelength, its pairs' ``delta``, the values it gave, and the optic's field and aiming
after it. What optiland could not compute is a field with a status and a reason of this module (``REASONS``), never a
number: a focus that is no finite number, and a parabasal ray of the field that optiland's own trace, of the batches the
analysis traced and in their shape, does not bring to the image with an intensity above 0 (its class states the
crossing of the rays it traced whatever became of them). ``FATAL`` exceptions
are not a field's, and the request is given up between two fields after ``REQUEST_BUDGET_S``, as for the MTF. A finite
object is not answered.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import inspect
import math
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from .build import BuildMismatch, OptilandApi, optiland_api
from .mtf import (
    AIMING_MODE,
    FATAL,
    REQUEST_BUDGET_S,
    MtfApi,
    TimeBudgetExceeded,
    _numbers,
    _Quiet,
    _said,
    field_optic,
    verify_field,
)
from .spot import chief_landing

CURVATURE_NATIVE = "curvature.native"

METHOD = "optiland-field-curvature"
"""The method of an answer: optiland's ``FieldCurvature``."""

ANALYSIS_CLASS = "FieldCurvature"
"""The class of optiland's analysis, read back."""

NUM_POINTS = 2
"""The points of the field the analysis is asked at: ``linspace(0, 1, 2)`` of the normalised field, the axis and the
optic's one field."""

FIELD_POINT = 1
"""The point of the analysis that is the field asked: the normalised field 1."""

PARABASAL_DELTA = 1e-5
"""The normalised pupil coordinate of a parabasal pair, the default of the analysis's two methods, read back."""

PAIR_METHODS = ("_intersection_parabasal_tangential", "_intersection_parabasal_sagittal")
"""The analysis's two methods, each of which traces one batch of pairs: the tangential pairs, then the sagittal."""

REASONS = {
    "raised": "optiland-raised",
    "chief": "no-chief-landing",
    "focus": "no-focus",
    "lost": "parabasal-ray-lost",
}
"""The ``reason`` of a field that is "unavailable". ``optiland-raised`` is followed by the class of the exception."""

UNSUPPORTED = {"line": "line", "finite": "object.finite"}
"""The ``item`` of each refusal of the quantity, by what it is about."""


@dataclass(frozen=True)
class CurvatureRequest:
    """A ``curvature.native`` request the engine answers, as numbers."""

    lines: tuple[int, ...]
    max_field_deg: float
    angles: tuple[float, ...]


def read_request(spec: dict[str, Any], case: dict[str, Any]) -> CurvatureRequest | list[dict[str, str]]:
    """What a schema-valid spec asks, or every reason why the engine has no answer to it, as unsupported items."""
    refused: list[dict[str, str]] = []
    count = len(case["conditions"]["lines"])
    lines = tuple(int(line) for line in spec["lines"])
    beyond = [line for line in lines if line >= count]
    if beyond:
        message = f"the case has {count} lines; the spec asks line {', '.join(str(line) for line in beyond)}"
        refused.append({"code": "option", "item": UNSUPPORTED["line"], "message": message})
    if case["conditions"]["object"]["kind"] != "infinity":
        message = "the object is finite: optiland measures a field angle at its paraxial entrance pupil then"
        refused.append({"code": "feature", "item": UNSUPPORTED["finite"], "message": message})
    if refused:
        return refused
    return CurvatureRequest(
        lines=lines,
        max_field_deg=float(spec["maxFieldDeg"]),
        angles=tuple(float(angle) for angle in spec["fieldAnglesDeg"]),
    )


@dataclass(frozen=True)
class FieldFoci:
    """Where optiland's analysis puts the two foci of a field: z less the z of the image surface, mm."""

    tangential_mm: float
    sagittal_mm: float


def field_curvature(optic: Any) -> Any:
    """optiland's analysis of an optic's field curves, asked at the axis and the optic's one field, its own line."""
    from optiland.analysis import FieldCurvature  # noqa: PLC0415 - after hygiene

    return FieldCurvature(optic, wavelengths="primary", num_points=NUM_POINTS)


def _mismatch(what: str, built: Any, expected: Any) -> BuildMismatch:
    return BuildMismatch(f"the field curvature: {what} is {built!r} in what optiland holds and {expected!r} asked")


def _hold(what: str, built: Any, expected: Any) -> None:
    if not (type(built) is type(expected) and built == expected):
        raise _mismatch(what, built, expected)


def _delta_of(method: Any) -> Any:
    """The default of a method's ``delta``, or None where it states none."""
    parameter = inspect.signature(method).parameters.get("delta")
    return None if parameter is None else parameter.default


def curvature_step(
    case: dict[str, Any],
    line: int,
    angle_deg: float,
    api: OptilandApi | None = None,
    tools: MtfApi | None = None,
    analysis_of: Callable[[Any], Any] = field_curvature,
) -> FieldFoci:
    """optiland's field curves of one field, on a ``field_optic``, read back.

    What the analysis holds is held to what was asked (a ``BuildMismatch`` otherwise): its class, its number of points,
    its one wavelength (the optic's own, the line's), the ``delta`` of its two pairs, one wavelength of two curves of
    two values; and the optic after it: its one field, the worker's aiming and its stop (``verify_field`` again). A
    focus that is no finite number is ``no-focus``; a parabasal ray of the field that optiland's own trace does not
    bring to the image surface with an intensity above 0 and numbers on every surface is ``parabasal-ray-lost``
    (``ValueError``): the analysis states the crossing of the rays it traced whatever became of them, so each of its
    two batches is traced again (``parabasal_batches``), on the same optic, as the analysis traced it.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    optic = field_optic(case, line, angle_deg, api, tools)
    wavelength = float(optic.primary_wavelength)
    with _Quiet(api):
        analysis = analysis_of(optic)
    _hold("the class of the analysis", type(analysis).__name__, ANALYSIS_CLASS)
    _hold("the points of the field it is asked at", int(analysis.num_points), NUM_POINTS)
    analysed = [float(point.value) for point in analysis.wavelengths]
    _hold("the wavelengths of the analysis, um", analysed, [wavelength])
    for name in PAIR_METHODS:
        _hold(f"the delta of the parabasal pairs of {name}", _delta_of(getattr(analysis, name)), PARABASAL_DELTA)
    data = analysis.data
    lengths = [len(_numbers(api, values)) for curve in data for values in curve]
    shape = (len(data), *(len(curve) for curve in data), *lengths)
    _hold("the values the analysis gave", shape, (1, 2, NUM_POINTS, NUM_POINTS))
    # The optic after the analysis: its one field, its aiming and its stop, as they were asked.
    verify_field(optic, case, angle_deg, tools)
    tangential = _numbers(api, data[0][0])[FIELD_POINT]
    sagittal = _numbers(api, data[0][1])[FIELD_POINT]
    if not (math.isfinite(tangential) and math.isfinite(sagittal)):
        raise ValueError(REASONS["focus"])
    pair = slice(2 * FIELD_POINT, 2 * FIELD_POINT + 2)
    for hx, hy, px, py in parabasal_batches(np):
        with _Quiet(api):
            optic.trace_generic(hx, hy, px, py, wavelength=wavelength)
            surfaces = optic.surfaces
            names = ("x", "y", "z", "L", "M", "N")
            rows = np.stack([np.asarray(getattr(surfaces, name), dtype=np.float64)[:, pair] for name in names])
            intensity = np.asarray(surfaces.intensity, dtype=np.float64)[-1, pair]
        if not (bool(np.all(np.isfinite(rows))) and bool(np.all(intensity > 0))):
            raise ValueError(REASONS["lost"])
    return FieldFoci(tangential_mm=tangential, sagittal_mm=sagittal)


def parabasal_batches(np: Any) -> tuple[tuple[Any, Any, Any, Any], ...]:
    """The two batches ``(Hx, Hy, Px, Py)`` the analysis traces, in its order and shape: its ``num_points`` points of
    the field, each twice, a pair at ``-delta`` and ``+delta`` of the pupil, along y for the tangential pairs and along
    x for the sagittal (``FieldCurvature._intersection_parabasal_*``). The pair of the field read is rays
    ``2 * FIELD_POINT`` and the next. Traced as the analysis traced them, on the same optic, the robust aimer reuses the
    pupil maps it solved there and polishes each pair in a batch of the same shape, so the rays are the analysis's own
    (``test_curvature.py`` holds them to it bit for bit).
    """
    hx = np.zeros(2 * NUM_POINTS, dtype=np.float64)
    hy = np.repeat(np.linspace(0.0, 1.0, NUM_POINTS), 2)
    zeros = np.zeros(2 * NUM_POINTS, dtype=np.float64)
    pairs = np.tile(np.array([-PARABASAL_DELTA, PARABASAL_DELTA], dtype=np.float64), NUM_POINTS)
    return (hx, hy, zeros, pairs), (hx, hy, pairs, zeros)


@dataclass(frozen=True)
class Steps:
    """What an answer asks of optiland, one call a step; a test hands stand-ins in their place."""

    landing: Callable[[dict[str, Any], int, float], tuple[float, float] | None]
    curvature: Callable[[dict[str, Any], int, float], FieldFoci]


def optiland_steps() -> Steps:
    """The steps on the real optiland."""
    return Steps(
        landing=lambda case, line, angle: chief_landing(case, line, angle),
        curvature=lambda case, line, angle: curvature_step(case, line, angle),
    )


def answer_field(
    case: dict[str, Any], line: int, angle_deg: float, steps: Steps
) -> tuple[dict[str, Any], list[str]]:
    """The entry of one field at one line of an answer, and what is noted of it for people.

    The identifying chief ray is asked first, then the field curves. An exception of optiland ends the field there: it
    is "unavailable" with the class of the exception in its reason, and where the chief ray landed is still said if
    that was found. ``FATAL`` exceptions are not a field's.
    """
    entry: dict[str, Any] = {
        "line": line,
        "wavelengthNm": case["conditions"]["lines"][line]["wavelengthNm"],
        "fieldAngleDeg": angle_deg,
        "status": "ok",
        "chiefLandingMm": None,
        "tangentialShiftMm": None,
        "sagittalShiftMm": None,
        "sampling": {},
    }

    def unavailable(reason: str) -> dict[str, Any]:
        return {**entry, "status": "unavailable", "reason": reason, "tangentialShiftMm": None, "sagittalShiftMm": None}

    named = f"the field at {angle_deg!r} degrees, line {line}"
    try:
        landing = steps.landing(case, line, angle_deg)
        if landing is None:
            return unavailable(REASONS["chief"]), [f"{named}: optiland's chief ray has no landing"]
        # optiland's y is the contract's with its sign changed.
        entry["chiefLandingMm"] = -landing[1]
        foci = steps.curvature(case, line, angle_deg)
        entry["tangentialShiftMm"] = foci.tangential_mm
        entry["sagittalShiftMm"] = foci.sagittal_mm
    except FATAL:
        raise
    except Exception as error:  # noqa: BLE001 - whatever optiland raises of one field is that field's status
        if isinstance(error, ValueError) and str(error) in (REASONS["focus"], REASONS["lost"]):
            return unavailable(str(error)), [f"{named}: {str(error)}"]
        reason = f"{REASONS['raised']}-{type(error).__name__}"
        return unavailable(reason), [f"{named}: optiland raised {_said(error)}"]
    return entry, []


def method_of(asked: CurvatureRequest) -> dict[str, Any]:
    """The method of an answer: optiland's class and calls, and the settings asked, by names of the engine's own."""
    return {
        "name": METHOD,
        "params": {
            "analysis": ANALYSIS_CLASS,
            "numPoints": NUM_POINTS,
            "fieldPoint": FIELD_POINT,
            "parabasalDelta": PARABASAL_DELTA,
            "aiming": AIMING_MODE,
            "identifyingAiming": AIMING_MODE,
            "fieldType": "angle",
            "frame": "mirrored-in-y",
            "maxFieldDeg": asked.max_field_deg,
            "focus": "crossing of a parabasal pair, along z from the image surface",
        },
    }


def answer_curvature(
    spec: dict[str, Any],
    case: dict[str, Any],
    *,
    steps: Steps | None = None,
    clock: Callable[[], float] = time.monotonic,
) -> dict[str, Any] | list[dict[str, str]]:
    """``curvature.native`` of a case as optiland computes it, or the unsupported items of a request it does not answer.

    Every field of the spec at every line it asks, line by line. Raises a ``TimeBudgetExceeded`` where the request has
    taken ``REQUEST_BUDGET_S`` when a field is to be begun. ``steps`` stands in for optiland in a test.
    """
    asked = read_request(spec, case)
    if isinstance(asked, list):
        return asked
    steps = steps if steps is not None else optiland_steps()
    started = clock()
    fields: list[dict[str, Any]] = []
    notes: list[str] = []
    total = len(asked.lines) * len(asked.angles)
    for line in asked.lines:
        for angle_deg in asked.angles:
            begun = clock()
            if begun - started > REQUEST_BUDGET_S:
                raise TimeBudgetExceeded(
                    f"the request had taken {begun - started:.0f} s when field {len(fields)} of {total} was to be "
                    f"begun, and {REQUEST_BUDGET_S:.0f} s are its budget: ask fewer fields at once"
                )
            field, noted = answer_field(case, line, angle_deg, steps)
            fields.append(field)
            notes.extend(noted)
    return {"fields": fields, "method": method_of(asked), "notes": notes}


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many fields of an answer have each status."""
    statuses = [field["status"] for field in data["fields"]]
    return {"fields": len(statuses), **{name: statuses.count(name) for name in ("ok", "unavailable")}}


__all__ = [
    "CURVATURE_NATIVE",
    "CurvatureRequest",
    "FieldFoci",
    "Steps",
    "answer_curvature",
    "answer_field",
    "curvature_step",
    "field_counts",
    "field_curvature",
    "read_request",
]
