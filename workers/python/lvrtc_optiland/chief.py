"""``chief.native``: optiland's own distortion of a case, and its own chief rays across the field, one field at a time.

The figures are optiland's: its distortion model (``optiland/analysis/distortion_strategies``, the strategy its
``Distortion`` analysis computes with, asked at the request's angles), its chief rays (its ray generator, its aimer and
its tracer), and its paraxial pupils (``optic.paraxial``). Nothing of a figure is computed here but the mirror of the
frame and the sum of two of optiland's numbers; the comparator forms the pupils of the chief rays with its own
estimator (``axialIntercept``), as it forms every engine's. What is the worker's is what the request needs around the
classes, and each is stated in the answer:

- **One field per call, and a new optic for every call**, as for the MTF (``mtf.field_optic``): optiland's aimer keeps
  what it solved, and a number must not depend on what was asked before it.
- **Distortion** is ``create_distortion_model("paraxial", distortion_type="f-tan")``, the ``RotationalDistortionModel``
  that optiland's ``Distortion`` analysis builds by default, on an optic whose one field is the request's half field
  (``maxFieldDeg``), asked at the normalised field ``angle / maxFieldDeg``. Its chief rays are its
  ``ChiefRayReferencePoint``'s, under optiland's default aiming (``paraxial``): the chief ray through the centre of the
  paraxial entrance pupil, and its reference scale is the landing of the chief ray at ``1e-10`` of the half field over
  the tangent of that angle. optiland's ``robust`` aimer launches a field that small along the axis, which lands on it
  and gives the model a scale of 0 (``docs/gotchas.md``): the model is asked with optiland's own default aiming, which
  is what anyone asking its ``Distortion`` gets.
- **The chief ray that identifies a field** is optiland's under the worker's ``robust`` aiming (``spot.chief_landing``,
  through ``mtf.probe_field``), the chief ray through the centre of the real stop, as LensVisualizer's tabs solve
  theirs: its landing on the image plane of the case is ``chiefLandingMm``, for every kind.
- **Lateral colour** is that chief ray at each line, on each line's optic.
- **Pupils**: the field's robust-aimed chief ray, traced once (``optic.trace_generic`` at the pupil (0, 0)), stated as
  where it meets the first surface and its direction in front of it, and where it leaves the last surface and its
  direction behind it; the paraxial pupils are the line's ``EPL()`` and ``XPL()`` (``first_order.line_data``).
- **The frame.** optiland's positive field angle is an object toward -y, the contract's one toward +y: every y and
  every y of a direction is optiland's with its sign changed. A percent distortion keeps its sign.

What optiland could not compute is a field with a status and a reason of this module (``REASONS``), never a number.
``FATAL`` exceptions are not a field's, and the request is given up between two fields after ``REQUEST_BUDGET_S``, as
for the MTF. A finite object is not answered; nor, for distortion and pupils, a case whose first-order data optiland's
paraxial model does not see (``first_order.term_refusals``, decided by the engine before anything is built): the
paraxial aiming of the distortion and the paraxial pupils are of that model.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from .build import BuildMismatch, OptilandApi, build_optic, optiland_api, verify_optic
from .first_order import line_data
from .mtf import (
    FATAL,
    LAUNCH_DIRECTION_TOLERANCE,
    REQUEST_BUDGET_S,
    MtfApi,
    TimeBudgetExceeded,
    _hold,
    _numbers,
    _Quiet,
    _said,
    field_coordinate,
    field_optic,
)
from .spot import chief_landing
from .trace import IMAGE_PLANE_TOLERANCE_MM

CHIEF_NATIVE = "chief.native"

DISTORTION_METHOD = "optiland-distortion"
"""The method of a distortion answer: optiland's rotational distortion model, as its ``Distortion`` computes."""

CHIEF_METHOD = "optiland-chief-rays"
"""The method of a lateral-colour or a pupils answer: optiland's own chief rays, robust-aimed."""

DISTORTION_KIND = "f-tan"
"""The distortion type asked of optiland's model: the rectilinear reference, ``scale * tan(angle)``."""

DISTORTION_AIMING = "paraxial"
"""optiland's own default aiming, under which its distortion model is asked: the chief ray through the centre of the
paraxial entrance pupil."""

NEAR_AXIS = 1e-10
"""The normalised field of optiland's reference probe (``RotationalDistortionModel._NEAR_AXIS``), read back."""

REASONS = {
    "raised": "optiland-raised",
    "chief": "no-chief-landing",
    "ray": "no-chief-ray",
    "scale": "no-scale",
    "pupils": "no-paraxial-pupils",
}
"""The ``reason`` of a field that is "unavailable". ``optiland-raised`` is followed by the class of the exception."""

UNSUPPORTED = {"line": "line", "finite": "object.finite"}
"""The ``item`` of each refusal of the quantity, by what it is about."""


@dataclass(frozen=True)
class ChiefRequest:
    """A ``chief.native`` request the engine answers, as numbers."""

    kind: str
    lines: tuple[int, ...]
    max_field_deg: float
    angles: tuple[float, ...]


def read_request(spec: dict[str, Any], case: dict[str, Any]) -> ChiefRequest | list[dict[str, str]]:
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
    return ChiefRequest(
        kind=str(spec["kind"]),
        lines=lines,
        max_field_deg=float(spec["maxFieldDeg"]),
        angles=tuple(float(angle) for angle in spec["fieldAnglesDeg"]),
    )


# ── Distortion ───────────────────────────────────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class DistortionFigures:
    """What optiland's distortion model gave of one field, in the contract's frame."""

    real_mm: float
    """The real image height relative to the axis's chief ray, as the model has it (``y_real``), mirrored."""
    ideal_mm: float
    """The ideal height of the model's reference (``y_ideal``), mirrored."""
    percent: float
    """The model's signed percent distortion (``percent(result, signed=True)``)."""
    landing_mm: float
    """Where the model's own chief ray landed: ``y_real`` plus the axis's chief landing (``_origin``), mirrored."""
    scale_mm: float
    """The model's scale (``_scale``): an ideal height is the scale times the tangent of the angle, mirrored."""


def distortion_optic(case: dict[str, Any], line: int, max_field_deg: float, api: OptilandApi | None = None) -> Any:
    """A new optic of a case at one line whose one field is the half field, verified, under optiland's default aiming.

    The builder's optic, held to the case (``verify_optic``); its one field replaced by an angle field at the half
    field, as for the MTF (``mtf.set_field``) but leaving optiland's aiming as it is by default. Read back: one
    ``AngleField``, at the half field along y and 0 along x, without a vignetting factor and of weight 1, and the
    aiming optiland's default (``paraxial``); a difference is a ``BuildMismatch``.
    """
    api = api if api is not None else optiland_api()
    optic = build_optic(case, line, api)
    verify_optic(optic, case, line, api)
    with _Quiet(api):
        optic.fields.remove(0)
        optic.fields.add(y=float(max_field_deg))
    fields = optic.fields
    _hold("the number of fields", int(fields.num_fields), 1)
    _hold("the type of the field", type(fields.field_definition).__name__, "AngleField")
    held = fields.fields[0]
    _hold("the field angle along y, degrees", float(held.y), float(max_field_deg))
    _hold("the field angle along x, degrees", float(held.x), 0.0)
    _hold("the vignetting factors", (float(held.vx), float(held.vy)), (0.0, 0.0))
    _hold("the weight", float(held.weight), 1.0)
    _hold("the half field the model normalises by, degrees", float(fields.max_field), float(max_field_deg))
    _hold("the ray aiming", str(optic.ray_tracer.ray_aiming_config["mode"]), DISTORTION_AIMING)
    return optic


def distortion_model() -> Any:
    """optiland's distortion model as its ``Distortion`` analysis makes it by default: the paraxial method, f-tan."""
    from optiland.analysis.distortion_strategies import create_distortion_model  # noqa: PLC0415 - after hygiene

    return create_distortion_model("paraxial", distortion_type=DISTORTION_KIND)


def distortion_step(
    case: dict[str, Any],
    line: int,
    max_field_deg: float,
    angle_deg: float,
    api: OptilandApi | None = None,
    model_of: Callable[[], Any] = distortion_model,
) -> DistortionFigures:
    """optiland's distortion of one field, on a ``distortion_optic``, read back, in the contract's frame.

    What the model holds is held to what was asked (a ``BuildMismatch`` otherwise): its class, its distortion type,
    its reference-point strategy (the chief ray), its near-axis probe, the half field it normalised by, the aiming it
    traced under, and one value of each result. A scale of 0, or one that is no number, is ``no-scale``: the model
    then has no reference (``ValueError``).
    """
    api = api if api is not None else optiland_api()
    np = api.np
    optic = distortion_optic(case, line, max_field_deg, api)
    model = model_of()
    normalised = float(angle_deg) / float(max_field_deg)
    wavelength = float(optic.primary_wavelength)
    with _Quiet(api):
        result = model.compute(
            optic, np.array([0.0], dtype=np.float64), np.array([normalised], dtype=np.float64), wavelength
        )
        percent = model.percent(result, signed=True)
    _hold("the class of the distortion model", type(model).__name__, "RotationalDistortionModel")
    _hold("the distortion type", str(model.distortion_type), DISTORTION_KIND)
    _hold("the reference point of the model", type(model.reference_point).__name__, "ChiefRayReferencePoint")
    _hold("the model's near-axis probe, normalised", float(model._NEAR_AXIS), NEAR_AXIS)
    radians = float(np.radians(np.float64(max_field_deg)))
    _hold("the half field the model normalised by, radians", float(model._max_field_rad), radians)
    _hold("the ray aiming of the model's traces", str(optic.ray_tracer.ray_aiming_config["mode"]), DISTORTION_AIMING)
    real, ideal, signed = (_numbers(api, part) for part in (result.y_real, result.y_ideal, percent))
    _hold("the values the model gave", (len(real), len(ideal), len(signed)), (1, 1, 1))
    scale = float(model._scale)
    origin = float(model._origin[1])
    if not (math.isfinite(scale) and scale != 0.0):
        raise ValueError(REASONS["scale"])
    values = (real[0], ideal[0], signed[0], origin)
    if not all(math.isfinite(value) for value in values):
        raise ValueError("the distortion model gave a value that is no finite number")
    # optiland's y is the contract's with its sign changed; a percent is a ratio of two heights and keeps its sign.
    return DistortionFigures(
        real_mm=-real[0],
        ideal_mm=-ideal[0],
        percent=signed[0],
        landing_mm=-(real[0] + origin),
        scale_mm=scale,
    )


# ── Pupils ───────────────────────────────────────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class ChiefRay:
    """optiland's robust-aimed chief ray of a field, as the contract states it: its entry and its exit."""

    entry_point: tuple[float, float, float]
    entry_direction: tuple[float, float, float]
    exit_point: tuple[float, float, float]
    exit_direction: tuple[float, float, float]
    landing_mm: float
    """The y at which it meets the image surface, mirrored."""


def chief_ray_step(
    case: dict[str, Any], line: int, angle_deg: float, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> ChiefRay:
    """optiland's chief ray of one field on a ``field_optic``, traced once at the pupil (0, 0), read back.

    Held (a ``BuildMismatch`` otherwise): the aimer that launched it (``RobustRayAimer``), its launch direction, that
    of the angle within ``LAUNCH_DIRECTION_TOLERANCE``, one ray on every row of the optic's surfaces, and its landing
    on the image plane of the case. A chief ray that does not reach the image with an intensity above 0 at every
    surface, or whose rows are not numbers, is ``no-chief-ray`` (``ValueError``). Row 0 of optiland's surfaces is the
    object surface, rows 1 to S the surfaces of the case, row S + 1 the image surface.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    optic = field_optic(case, line, angle_deg, api, tools)
    coordinate = field_coordinate(angle_deg)
    wavelength = optic.primary_wavelength
    with _Quiet(api):
        launch = optic.ray_tracer.ray_generator.generate_rays(*coordinate, 0.0, 0.0, wavelength)
        direction = tuple(_numbers(api, part)[0] for part in (launch.L, launch.M, launch.N))
        aimer = type(optic.ray_tracer.ray_generator.aimer).__name__
        optic.trace_generic(*coordinate, Px=0.0, Py=0.0, wavelength=wavelength)
        surfaces = optic.surfaces
        rows = {name: np.asarray(getattr(surfaces, name), dtype=np.float64) for name in ("x", "y", "z", "L", "M", "N")}
        intensity = np.asarray(surfaces.intensity, dtype=np.float64)
    _hold("the aimer that launched the chief ray", aimer, "RobustRayAimer")
    radians = math.radians(angle_deg)
    expected = (0.0, math.sin(radians), math.cos(radians))
    if not all(abs(got - want) <= LAUNCH_DIRECTION_TOLERANCE for got, want in zip(direction, expected, strict=True)):
        raise BuildMismatch(
            f"the chief ray: it is launched along {direction!r} in what optiland holds and {expected!r} asked"
        )
    count = len(case["system"]["surfaces"]) + 2
    _hold("the rows of the chief ray's trace", tuple(rows["y"].shape), (count, 1))
    if not (np.all(np.isfinite(np.stack(list(rows.values())))) and np.all(intensity > 0)):
        raise ValueError(REASONS["ray"])
    at = {name: [float(value) for value in values[:, 0]] for name, values in rows.items()}
    image_z = float(case["conditions"]["imageZ"])
    if abs(at["z"][-1] - image_z) > IMAGE_PLANE_TOLERANCE_MM:
        raise BuildMismatch(f"the chief ray: it lands at z = {at['z'][-1]!r} mm, and the case's plane is {image_z!r}")
    last = count - 2

    def point(row: int) -> tuple[float, float, float]:
        return (at["x"][row], -at["y"][row], at["z"][row])

    def heading(row: int) -> tuple[float, float, float]:
        return (at["L"][row], -at["M"][row], at["N"][row])

    return ChiefRay(
        entry_point=point(1),
        entry_direction=heading(0),
        exit_point=point(last),
        exit_direction=heading(last),
        landing_mm=-at["y"][-1],
    )


def paraxial_pupils(case: dict[str, Any], line: int, api: OptilandApi | None = None) -> tuple[float, float] | None:
    """optiland's paraxial entrance and exit pupils of a line, z in the contract's frame, or None where it has none.

    ``first_order.line_data`` of the line's verified optic: ``EPL()`` from the first surface plus the first vertex,
    ``XPL()`` from the image surface plus the image plane.
    """
    api = api if api is not None else optiland_api()
    optic = build_optic(case, line, api)
    verify_optic(optic, case, line, api)
    data = line_data(optic, int(case["system"]["lastLensSurfaceIndex"]), api)
    if data.values is None:
        return None
    return data.values["entrancePupilZ"], data.values["exitPupilZ"]


# ── The answer ───────────────────────────────────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class Steps:
    """What an answer asks of optiland, one call a step; a test hands stand-ins in their place."""

    distortion: Callable[[dict[str, Any], int, float, float], DistortionFigures]
    landing: Callable[[dict[str, Any], int, float], tuple[float, float] | None]
    chief_ray: Callable[[dict[str, Any], int, float], ChiefRay]
    pupils: Callable[[dict[str, Any], int], tuple[float, float] | None]


def optiland_steps() -> Steps:
    """The steps on the real optiland."""
    return Steps(
        distortion=lambda case, line, max_field, angle: distortion_step(case, line, max_field, angle),
        landing=lambda case, line, angle: chief_landing(case, line, angle),
        chief_ray=lambda case, line, angle: chief_ray_step(case, line, angle),
        pupils=lambda case, line: paraxial_pupils(case, line),
    )


NO_FIGURES = {"realHeightMm": None, "idealHeightMm": None, "percent": None, "entrancePupilZ": None, "exitPupilZ": None}


def answer_field(
    asked: ChiefRequest, case: dict[str, Any], line: int, angle_deg: float, steps: Steps
) -> tuple[dict[str, Any], list[str]]:
    """The entry of one field at one line of an answer, and what is noted of it for people.

    The identifying chief ray is asked first (lateral colour and distortion), then the kind's figures. An exception
    of optiland ends the field there: it is "unavailable" with the class of the exception in its reason, and where the
    chief ray landed is still said if that was found. ``FATAL`` exceptions are not a field's.
    """
    entry: dict[str, Any] = {
        "line": line,
        "wavelengthNm": case["conditions"]["lines"][line]["wavelengthNm"],
        "fieldAngleDeg": angle_deg,
        "status": "ok",
        "chiefLandingMm": None,
        "figures": None,
        "chiefRay": None,
        "sampling": {},
    }

    def unavailable(reason: str) -> dict[str, Any]:
        return {**entry, "status": "unavailable", "reason": reason, "figures": None, "chiefRay": None}

    named = f"the field at {angle_deg!r} degrees, line {line}"
    try:
        if asked.kind == "pupils":
            ray = steps.chief_ray(case, line, angle_deg)
            entry["chiefLandingMm"] = ray.landing_mm
            entry["chiefRay"] = {
                "entryPoint": list(ray.entry_point),
                "entryDirection": list(ray.entry_direction),
                "exitPoint": list(ray.exit_point),
                "exitDirection": list(ray.exit_direction),
            }
            return entry, []
        landing = steps.landing(case, line, angle_deg)
        if landing is None:
            return unavailable(REASONS["chief"]), [f"{named}: optiland's chief ray has no landing"]
        # optiland's y is the contract's with its sign changed.
        entry["chiefLandingMm"] = -landing[1]
        if asked.kind == "distortion":
            # The field is stated at the angle asked; the model traced its normalised field, angle / maxFieldDeg of the
            # half field, which is that angle to a rounding.
            figures = steps.distortion(case, line, asked.max_field_deg, angle_deg)
            entry["figures"] = {
                **NO_FIGURES,
                "realHeightMm": figures.real_mm,
                "idealHeightMm": figures.ideal_mm,
                "percent": figures.percent,
            }
            entry["sampling"] = {"focalScaleMm": figures.scale_mm, "distortionLandingMm": figures.landing_mm}
    except FATAL:
        raise
    except Exception as error:  # noqa: BLE001 - whatever optiland raises of one field is that field's status
        if isinstance(error, ValueError) and str(error) in (REASONS["scale"], REASONS["ray"]):
            return unavailable(str(error)), [f"{named}: {str(error)}"]
        reason = f"{REASONS['raised']}-{type(error).__name__}"
        return unavailable(reason), [f"{named}: optiland raised {_said(error)}"]
    return entry, []


def method_of(asked: ChiefRequest) -> dict[str, Any]:
    """The method of an answer: optiland's classes and calls, and the settings asked, by names of the engine's own."""
    common = {
        "identifyingAiming": "robust",
        "fieldType": "angle",
        "frame": "mirrored-in-y",
        "maxFieldDeg": asked.max_field_deg,
    }
    if asked.kind == "distortion":
        params = {
            "model": "RotationalDistortionModel",
            "referencePoint": "ChiefRayReferencePoint",
            "distortionType": DISTORTION_KIND,
            "aiming": DISTORTION_AIMING,
            "probe": f"{NEAR_AXIS!r} of the half field",
            **common,
        }
        return {"name": DISTORTION_METHOD, "params": params}
    calls = "trace_generic at the pupil (0, 0)" if asked.kind == "pupils" else "probe_field's chief ray"
    return {"name": CHIEF_METHOD, "params": {"aiming": "robust", "chiefRay": calls, **common}}


def answer_chief(
    spec: dict[str, Any],
    case: dict[str, Any],
    *,
    steps: Steps | None = None,
    clock: Callable[[], float] = time.monotonic,
) -> dict[str, Any] | list[dict[str, str]]:
    """``chief.native`` of a case as optiland computes it, or the unsupported items of a request it does not answer.

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
            field, noted = answer_field(asked, case, line, angle_deg, steps)
            fields.append(field)
            notes.extend(noted)
    reference: dict[str, Any] = {
        "focalScaleMm": None,
        "probeAngleDeg": None,
        "paraxialEntrancePupilZ": None,
        "paraxialExitPupilZ": None,
    }
    if asked.kind == "distortion":
        scales = [field["sampling"]["focalScaleMm"] for field in fields if field["status"] == "ok"]
        if scales:
            reference["focalScaleMm"] = scales[0]
            reference["probeAngleDeg"] = NEAR_AXIS * asked.max_field_deg
            if any(scale != scales[0] for scale in scales):
                notes.append("the fields' optics gave the reference scales that differ")
    if asked.kind == "pupils":
        pupils = steps.pupils(case, asked.lines[0])
        if pupils is None:
            notes.append(f"{REASONS['pupils']}: optiland has no paraxial pupils of line {asked.lines[0]}")
        else:
            reference["paraxialEntrancePupilZ"], reference["paraxialExitPupilZ"] = pupils
    return {
        "kind": asked.kind,
        "fields": fields,
        "reference": reference,
        "method": method_of(asked),
        "notes": notes,
    }


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many fields of an answer have each status."""
    statuses = [field["status"] for field in data["fields"]]
    return {"fields": len(statuses), **{name: statuses.count(name) for name in ("ok", "unavailable")}}


__all__ = [
    "CHIEF_NATIVE",
    "ChiefRay",
    "ChiefRequest",
    "DistortionFigures",
    "Steps",
    "answer_chief",
    "answer_field",
    "chief_ray_step",
    "distortion_optic",
    "distortion_step",
    "field_counts",
    "paraxial_pupils",
    "read_request",
]
