"""``spot.native``: optiland's own spot diagram and ray fan of a case, one line and one field at a time.

The figures are optiland's ``SpotDiagram`` (``optiland/analysis/spot_diagram``) and ``RayFan``
(``optiland/analysis/ray_fan.py``), asked as anyone would ask them and read from their own attributes and methods:
nothing of a spot or a fan is computed here but the subtraction of optiland's own chief-ray landing and the mirror
of the frame. What is the worker's is what the request needs around the classes, and each is stated in the answer:

- **One field per call, and a new optic for every call**, as for the MTF (``mtf.field_optic``): the one field of the
  optic is an angle field at the request's angle, and the aiming is the worker's (``robust``), so optiland's
  normalised pupil coordinates lie on the stop surface out to its clip radius. optiland's aimer keeps what it
  solved, so the chief ray is asked of an optic of its own (``mtf.probe_field``, which also holds its launch to the
  angle and its landing to the image plane of the case).
- **The frame.** optiland's positive field angle is an object toward -y, the contract's one toward +y: the optic is
  the contract's system mirrored in y, and every y of an answer, a pupil coordinate's included, is optiland's with
  its sign changed.
- **A spot** is ``SpotDiagram`` with the ``hexapolar`` distribution of as many rings as give the number of rays
  nearest the request's pattern (``hexapolar_rings``), ``coordinates="global"`` and ``reference="centroid"``: its
  ``centroid()``, the mean landing of the rays it counts (intensity above 0), and its ``rms_spot_radius()``, the RMS
  distance from that centroid, unweighted. The centroid is written relative to the chief ray's landing.
- **A fan** is ``RayFan`` of the request's odd number of samples: its ``line_y`` fan for a tangential one, ``line_x``
  for a sagittal one, the errors optiland gives relative to the fan's own middle ray, which is the chief ray. A
  sample optiland gives no intensity is NaN. A fan whose middle ray optiland gives no intensity is a field without
  figures (``fan-centre-lost``): optiland then refers its fan to the mean of the rays it counts, which is no chief.
- **The plane** is the image surface of the builder, at ``conditions.imageZ``.

What optiland could not compute is a field with a status and a reason of this module (``REASONS``), never a
number. ``FATAL`` exceptions are not a field's, and the request is given up between two fields after
``REQUEST_BUDGET_S``, as for the MTF.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from lvrtc_worker_kit.ndarray import encode_ndarray

from .build import BuildMismatch, OptilandApi, optiland_api
from .mtf import (
    AIMING_MODE,
    ANGLES_OPTION,
    FATAL,
    REQUEST_BUDGET_S,
    MtfApi,
    TimeBudgetExceeded,
    _hold,
    _numbers,
    _Quiet,
    _said,
    field_coordinate,
    field_optic,
    probe_field,
)

SPOT_NATIVE = "spot.native"

SPOT_METHOD = "optiland-spot-diagram"
FAN_METHOD = "optiland-ray-fan"

SPOT_DISTRIBUTION = "hexapolar"
SPOT_COORDINATES = "global"
SPOT_REFERENCE = "centroid"

PUPIL_CENTRE_TOLERANCE = 1e-15
"""How far from 0 the middle pupil coordinate of a fan may be: numpy's ``linspace`` from -1 to 1 rounds its step."""

REASONS = {
    "raised": "optiland-raised",
    "rays": "no-rays",
    "centre": "fan-centre-lost",
    "chief": "no-chief-landing",
}
"""The ``reason`` of a field that is "unavailable". ``optiland-raised`` is followed by the class of the exception."""

UNSUPPORTED = {
    "line": "line",
    "fractions": "fields.half-field-fractions",
    "angles": f"option.{ANGLES_OPTION}",
    "finite": "object.finite",
}
"""The ``item`` of each refusal of the quantity, by what it is about."""


class FanCentreLost(ValueError):
    """optiland gave the middle ray of a fan no intensity: the fan is not referred to a chief ray."""


@dataclass(frozen=True)
class SpotRequest:
    """A ``spot.native`` request the engine answers, as numbers."""

    line: int
    angles: tuple[float, ...]
    """The fields, degrees, in the order of the spec."""
    fractions: tuple[float, ...]
    """For a spec of fractions of the half field: those fractions, which name the fields. Empty for angles."""
    pattern: str
    """``rings`` or ``fan``."""
    rings: int = 0
    """Of a spot: optiland's number of hexapolar rings."""
    axis: str = ""
    """Of a fan: ``tangential`` or ``sagittal``."""
    samples: int = 0
    """Of a fan: its number of samples, odd."""


def hexapolar_count(rings: int) -> int:
    """How many rays optiland's hexapolar distribution of ``rings`` rings has: the centre and 6k on ring k."""
    return 1 + 3 * rings * (rings + 1)


def hexapolar_rings(pattern: list[int]) -> int:
    """The number of hexapolar rings whose count of rays is nearest the pattern's; the smaller on a tie."""
    wanted = sum(pattern)
    best = 1
    for rings in range(1, 64):
        if abs(hexapolar_count(rings) - wanted) < abs(hexapolar_count(best) - wanted):
            best = rings
    return best


def _item(code: str, name: str, message: str) -> dict[str, str]:
    return {"code": code, "item": UNSUPPORTED[name], "message": message}


def read_request(
    spec: dict[str, Any], options: dict[str, Any], case: dict[str, Any]
) -> SpotRequest | list[dict[str, str]]:
    """What a schema-valid spec asks, or every reason why the engine has no answer to it, as unsupported items.

    Decided from the spec, the engine's options and the case, before anything is built. A spec of fractions of the
    half field is answered only with the option ``fieldAnglesDeg``, one angle in degrees for each fraction: a case
    states no half field, and optiland knows none. A finite object is not answered, as for the MTF.
    """
    refused: list[dict[str, str]] = []
    lines = case["conditions"]["lines"]
    line = int(spec["line"])
    if line >= len(lines):
        refused.append(_item("option", "line", f"the case has {len(lines)} lines; the spec asks line {line}"))
    stated = spec["fields"]["values"]
    angles = stated
    fractions = spec["fields"]["kind"] != "angles-deg"
    if fractions:
        angles = options.get(ANGLES_OPTION)
        if angles is None:
            message = (
                "a case states no half field a fraction could be of: state the fields as angles, or give the angle "
                f"of each fraction with the engine option {ANGLES_OPTION}"
            )
            refused.append(_item("option", "fractions", message))
        elif not (
            isinstance(angles, list)
            and len(angles) == len(stated)
            and all(isinstance(angle, (int, float)) and not isinstance(angle, bool) for angle in angles)
            and all(math.isfinite(angle) for angle in angles)
        ):
            message = f"the option {ANGLES_OPTION} is one angle in degrees for each of the {len(stated)} fields"
            refused.append(_item("option", "angles", message))
    if case["conditions"]["object"]["kind"] != "infinity":
        message = "the object is finite: optiland measures a field angle at its paraxial entrance pupil then"
        refused.append(_item("feature", "finite", message))
    if refused:
        return refused
    pupil = spec["pupil"]
    common = {
        "line": line,
        "angles": tuple(float(angle) for angle in angles),
        "fractions": tuple(float(field) for field in stated) if fractions else (),
        "pattern": pupil["kind"],
    }
    if pupil["kind"] == "rings":
        return SpotRequest(**common, rings=hexapolar_rings([int(count) for count in pupil["rings"]]))
    return SpotRequest(**common, axis=str(pupil["axis"]), samples=int(pupil["samples"]))


@dataclass(frozen=True)
class SpotFigures:
    """What optiland's SpotDiagram gave of one field, in the contract's frame, relative to its chief ray."""

    centroid_mm: tuple[float, float]
    rms_radius_mm: float
    launched: int
    landed: int


@dataclass(frozen=True)
class FanFigures:
    """What optiland's RayFan gave of one field, in the contract's frame, the pupil ascending."""

    pupil: tuple[float, ...]
    error_mm: tuple[float, ...]
    landed: int


def spot_step(
    case: dict[str, Any],
    line: int,
    angle_deg: float,
    rings: int,
    chief: tuple[float, float],
    api: OptilandApi | None = None,
    tools: MtfApi | None = None,
) -> SpotFigures:
    """optiland's SpotDiagram of one field on a ``field_optic``, read back, relative to ``chief`` (optiland's frame).

    What the analysis holds is held to what was asked (a ``BuildMismatch`` otherwise): its optic, its one field and
    its one wavelength, its distribution and number of rings, its coordinates, its reference strategy, the number of
    rays the trace launched, and one set of data. The rays it counts are those optiland gives an intensity above 0.
    """
    from optiland.analysis import SpotDiagram  # noqa: PLC0415 - not before the worker's hygiene

    api = api if api is not None else optiland_api()
    np = api.np
    optic = field_optic(case, line, angle_deg, api, tools)
    coordinate = field_coordinate(angle_deg)
    wavelength = float(optic.primary_wavelength)
    with _Quiet(api):
        spot = SpotDiagram(
            optic,
            fields=[coordinate],
            wavelengths=[wavelength],
            num_rings=rings,
            distribution=SPOT_DISTRIBUTION,
            coordinates=SPOT_COORDINATES,
            reference=SPOT_REFERENCE,
        )
        launched = int(np.asarray(optic.surfaces.x).shape[1])
    _hold("the optic of the spot diagram", spot.optic is optic, True)
    _hold(
        "the fields of the spot diagram", [tuple(float(v) for v in field.coord) for field in spot.fields], [coordinate]
    )
    _hold("the wavelengths of the spot diagram", [float(w.value) for w in spot.wavelengths], [wavelength])
    _hold("the reference wavelength of the spot diagram", int(spot._analysis_ref_wavelength_index), 0)
    _hold("the number of rings of the spot diagram", int(spot.num_rings), rings)
    _hold("the distribution of the spot diagram", str(spot.distribution), SPOT_DISTRIBUTION)
    _hold("the coordinates of the spot diagram", str(spot.coordinates), SPOT_COORDINATES)
    _hold("the reference of the spot diagram", type(spot._reference_strategy).__name__, "CentroidReference")
    _hold("the rays the spot diagram launched", launched, hexapolar_count(rings))
    _hold("the sets of data of the spot diagram", [len(field) for field in spot.data], [1])
    held = spot.data[0][0]
    x, y, intensity = (_numbers(api, part) for part in (held.x, held.y, held.intensity))
    _hold("the rays counted by the spot diagram", (len(y), len(intensity)), (len(x), len(x)))
    if not x:
        raise ValueError(REASONS["rays"])
    if not all(math.isfinite(value) for value in (*x, *y)) or not all(value > 0 for value in intensity):
        raise ValueError("the spot diagram counts a ray without a finite landing or without intensity")
    # Asked only now that every setting is held: the centroid strategy centres the spot for the radius.
    with _Quiet(api):
        centroid = [float(value) for value in spot.centroid()[0]]
        rms = float(spot.rms_spot_radius()[0][0])
    if not all(math.isfinite(value) for value in (*centroid, rms)):
        raise ValueError("the spot diagram has no finite centroid or radius")
    # optiland's y is the contract's with its sign changed; the centroid is written relative to the chief ray.
    relative = (centroid[0] - chief[0], -(centroid[1] - chief[1]))
    return SpotFigures(centroid_mm=relative, rms_radius_mm=rms, launched=launched, landed=len(x))


def fan_step(
    case: dict[str, Any],
    line: int,
    angle_deg: float,
    axis: str,
    samples: int,
    api: OptilandApi | None = None,
    tools: MtfApi | None = None,
) -> FanFigures:
    """optiland's RayFan of one field on a ``field_optic``, read back, in the contract's frame.

    What the analysis holds is held to what was asked (a ``BuildMismatch`` otherwise): its optic, its one field and
    wavelength, its number of points, its pupil coordinates from -1 to 1 with the middle one 0, the rays its last
    trace launched, and its data of that field and wavelength. A tangential fan is optiland's ``y`` fan, mirrored:
    the contract's sample at pupil coordinate p is optiland's at -p, its error with the sign changed.
    """
    from optiland.analysis import RayFan  # noqa: PLC0415 - not before the worker's hygiene

    api = api if api is not None else optiland_api()
    np = api.np
    optic = field_optic(case, line, angle_deg, api, tools)
    coordinate = field_coordinate(angle_deg)
    wavelength = float(optic.primary_wavelength)
    with _Quiet(api):
        fan = RayFan(optic, fields=[coordinate], wavelengths=[wavelength], num_points=samples)
        launched = int(np.asarray(optic.surfaces.x).shape[1])
    _hold("the optic of the ray fan", fan.optic is optic, True)
    _hold("the fields of the ray fan", [tuple(float(v) for v in field.coord) for field in fan.fields], [coordinate])
    _hold("the wavelengths of the ray fan", [float(w.value) for w in fan.wavelengths], [wavelength])
    _hold("the number of points of the ray fan", int(fan.num_points), samples)
    _hold("the rays of the ray fan's last trace", launched, samples)
    tangential = axis == "tangential"
    pupil = _numbers(api, fan.data["Py" if tangential else "Px"])
    centre = samples // 2
    _hold("the pupil coordinates of the ray fan", (len(pupil), pupil[0], pupil[-1]), (samples, -1.0, 1.0))
    if not abs(pupil[centre]) <= PUPIL_CENTRE_TOLERANCE:
        raise BuildMismatch(f"the ray fan: its middle sample is at the pupil coordinate {pupil[centre]!r}, not at 0")
    held = fan.data[f"{coordinate}"][f"{wavelength}"]
    errors = _numbers(api, held["y" if tangential else "x"])
    intensity = _numbers(api, held["intensity_y" if tangential else "intensity_x"])
    _hold("the samples of the ray fan", (len(errors), len(intensity)), (samples, samples))
    if not intensity[centre] > 0:
        raise FanCentreLost(REASONS["centre"])
    errors = [error if lit > 0 else math.nan for error, lit in zip(errors, intensity, strict=True)]
    if tangential:
        pupil = [-value for value in reversed(pupil)]
        errors = [-value for value in reversed(errors)]
    return FanFigures(
        pupil=tuple(pupil),
        error_mm=tuple(errors),
        landed=sum(1 for lit in intensity if lit > 0),
    )


def chief_landing(
    case: dict[str, Any], line: int, angle_deg: float, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> tuple[float, float] | None:
    """Where optiland's chief ray of a field lands on the image plane, in its own frame, on an optic of its own."""
    optic = field_optic(case, line, angle_deg, api, tools)
    return probe_field(optic, case, angle_deg, api).landing


Steps = Callable[..., Any]


def answer_field(
    asked: SpotRequest,
    case: dict[str, Any],
    angle_deg: float,
    chief: Steps = chief_landing,
    spot: Steps = spot_step,
    fan: Steps = fan_step,
) -> tuple[dict[str, Any], list[str]]:
    """The entry of one field of an answer, and what is noted of it for people.

    The chief ray is asked first, then the spot or the fan. An exception of optiland ends the field there: it is
    "unavailable" with the class of the exception in its reason, and where the chief ray landed is still said if that
    was found. ``FATAL`` exceptions are not a field's.
    """
    entry: dict[str, Any] = {
        "field": angle_deg,
        "fieldAngleDeg": angle_deg,
        "imageHeightMm": None,
        "status": "ok",
        "spot": None,
        "fan": None,
        "sampling": {},
    }

    def unavailable(reason: str) -> dict[str, Any]:
        return {**entry, "status": "unavailable", "reason": reason, "spot": None, "fan": None}

    named = f"the field at {angle_deg!r} degrees"
    try:
        landing = chief(case, asked.line, angle_deg)
        if landing is None:
            return unavailable(REASONS["chief"]), [f"{named}: optiland's chief ray has no landing"]
        entry["imageHeightMm"] = math.hypot(landing[0], landing[1])
        if asked.pattern == "rings":
            figures = spot(case, asked.line, angle_deg, asked.rings, landing)
            entry["spot"] = {"centroidMm": list(figures.centroid_mm), "rmsRadiusMm": figures.rms_radius_mm}
            entry["sampling"] = {"raysLaunched": float(figures.launched), "raysLanded": float(figures.landed)}
        else:
            figures = fan(case, asked.line, angle_deg, asked.axis, asked.samples)
            entry["fan"] = {
                "pupil": encode_ndarray("f8", list(figures.pupil)),
                "errorMm": encode_ndarray("f8", list(figures.error_mm)),
            }
            entry["sampling"] = {"raysLaunched": float(asked.samples), "raysLanded": float(figures.landed)}
    except FATAL:
        raise
    except FanCentreLost:
        return unavailable(REASONS["centre"]), [f"{named}: optiland gave the middle ray of the fan no intensity"]
    except Exception as error:  # noqa: BLE001 - whatever optiland raises of one field is that field's status
        if isinstance(error, ValueError) and str(error) == REASONS["rays"]:
            return unavailable(REASONS["rays"]), [f"{named}: optiland counted no ray of the spot"]
        reason = f"{REASONS['raised']}-{type(error).__name__}"
        return unavailable(reason), [f"{named}: optiland raised {_said(error)}"]
    return entry, []


def method_of(asked: SpotRequest) -> dict[str, Any]:
    """The method of an answer: optiland's class, and the settings it was asked with, by names of the engine's own."""
    common = {"line": asked.line, "aiming": AIMING_MODE, "fieldType": "angle", "frame": "mirrored-in-y"}
    if asked.pattern == "rings":
        params = {
            "class": "SpotDiagram",
            "distribution": SPOT_DISTRIBUTION,
            "numRings": asked.rings,
            "rays": hexapolar_count(asked.rings),
            "coordinates": SPOT_COORDINATES,
            "reference": SPOT_REFERENCE,
            "weighting": "unweighted",
            "relativeTo": "chief-ray",
            **common,
        }
        return {"name": SPOT_METHOD, "params": params}
    params = {
        "class": "RayFan",
        "axis": asked.axis,
        "numPoints": asked.samples,
        "distribution": "line_y" if asked.axis == "tangential" else "line_x",
        "reference": "middle-ray",
        **common,
    }
    return {"name": FAN_METHOD, "params": params}


def answer_spot(
    spec: dict[str, Any],
    options: dict[str, Any],
    case: dict[str, Any],
    steps: dict[str, Steps] | None = None,
    clock: Callable[[], float] = time.monotonic,
) -> dict[str, Any] | list[dict[str, str]]:
    """``spot.native`` of a case as optiland computes it, or the unsupported items of a request it does not answer.

    Raises a ``TimeBudgetExceeded`` where the request has taken ``REQUEST_BUDGET_S`` when a field is to be begun.
    ``steps`` stands in for the three calls of optiland in a test (``chief``, ``spot``, ``fan``).
    """
    asked = read_request(spec, options, case)
    if isinstance(asked, list):
        return asked
    started = clock()
    fields: list[dict[str, Any]] = []
    notes: list[str] = []
    for number, angle_deg in enumerate(asked.angles):
        begun = clock()
        if begun - started > REQUEST_BUDGET_S:
            raise TimeBudgetExceeded(
                f"the request had taken {begun - started:.0f} s when field {number} of {len(asked.angles)} was to be "
                f"begun, and {REQUEST_BUDGET_S:.0f} s are its budget: ask fewer fields at once"
            )
        field, noted = answer_field(asked, case, angle_deg, **(steps or {}))
        if asked.fractions:
            field["field"] = asked.fractions[number]
        fields.append(field)
        notes.extend(noted)
    line = case["conditions"]["lines"][asked.line]
    if len(case["conditions"]["lines"]) > 1:
        notes.append(f"of line {asked.line} of the case alone, {line['wavelengthNm']!r} nm")
    return {
        "pattern": asked.pattern,
        "fields": fields,
        "method": method_of(asked),
        "lines": [{"wavelengthNm": line["wavelengthNm"], "weight": line["weight"]}],
        "notes": notes,
    }


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many fields of an answer have each status."""
    statuses = [field["status"] for field in data["fields"]]
    return {"fields": len(statuses), **{name: statuses.count(name) for name in ("ok", "unavailable")}}


__all__ = [
    "BuildMismatch",
    "FanCentreLost",
    "SPOT_NATIVE",
    "SpotRequest",
    "answer_field",
    "answer_spot",
    "chief_landing",
    "fan_step",
    "hexapolar_count",
    "hexapolar_rings",
    "read_request",
    "spot_step",
]
