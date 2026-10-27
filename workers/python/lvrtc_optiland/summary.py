"""``summary.native``: optiland's own first-order summary of a case, one line at a time.

Every value is optiland's, asked of its own objects; nothing of a value is computed here but a change of reference, a
magnitude, and the one formula optiland has no accessor for, each stated where it is applied:

==========================  ==================================================================================
The contract's value        optiland's
==========================  ==================================================================================
``rearFocalZ``              ``F2()`` from the image surface, the image plane added (``first_order.line_data``)
``focalLengthMm``           ``f2()``
``entrancePupilDiameterMm`` the magnitude of ``EPD()``: the system aperture's stop diameter over the height of a
                            paraxial ray of height 1 at the stop (``float_by_stop_size``)
``stopDiameterMm``          the system aperture's ``value``, read back as twice ``conditions.stopSemiDiameter``
``imageSpaceFNumber``       the magnitude of ``FNO()``, which for a stop given by its size is ``f2() / EPD()``
``paraxialWorkingFNumber``  ``1 / (2 n' |u'|)`` of ``marginal_ray()``, its slope after the last surface and the index
                            of the image space: optiland has no accessor of it
``workingFNumber``          ``optiland.utils.get_working_FNO`` on the axis, on an optic of its own under the worker's
                            ``robust`` aiming (``mtf.field_optic``): the four rays through the rim of the real stop,
                            ``1 / (2 sqrt(mean(n'^2 sin^2)))`` of their angles to the chief ray in image space
``nominalFNumber``          null: optiland marks no aperture
``totalTrackMm``            ``optic.total_track``
``halfFieldDeg``            null: optiland assigns a system no field
==========================  ==================================================================================

Under ``sampling`` a line states ``exitPupilDiameterMm`` (the magnitude of ``XPD()``), ``magnification`` (for a finite
object, ``paraxial.magnification()``), ``workingFNumberUnaimed``: ``get_working_FNO`` on the builder's optic, under
optiland's default ``paraxial`` aiming, whose rim rays start at the rim of the paraxial entrance pupil whatever becomes
of them at the stop, ``unaimedRimRaysLost``, how many of its four rim rays are dark at the image, and
``workingRimRaysVignetted``, how many of the aimed rim rays are dark at a surface of the case other than the stop (one
aimed at the stop's clip radius may be clipped there by a rounding, and is not counted). ``get_working_FNO`` leaves a
dark rim ray out of its mean, and takes all four where all four are dark (``docs/gotchas.md``): the worker states the
counts and corrects nothing.

Every setting is read back (``paraxial_step``, ``working_step``), each check with a test that makes the mistake on
purpose (``test_summary.py``): the builder's optic (``build.verify_optic``), the type and the value of its system
aperture, its wavelength, the index of its image space, where its marginal ray starts, its aiming; the field and the
aiming of the optic of the working f-number (``mtf.verify_field``), before and after it is asked. A system optiland has
no first-order data of (afocal, or with its entrance pupil at infinity) is a line that is ``unavailable`` with the item
of ``first_order`` as its reason; an exception of optiland while a working f-number is asked leaves that value null,
with a note. ``FATAL`` exceptions are no line's, and the request is given up between two lines after
``REQUEST_BUDGET_S``, as for the MTF.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
import time
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any

from .build import BuildMismatch, OptilandApi, build_optic, index_rows, optiland_api, verify_optic, wavelength_um
from .first_order import line_data
from .mtf import FATAL, REQUEST_BUDGET_S, MtfApi, TimeBudgetExceeded, _numbers, _Quiet, _said, field_optic, mtf_api
from .mtf import verify_field

SUMMARY_NATIVE = "summary.native"

METHOD = "optiland-summary"
"""The method of an answer: optiland's paraxial accessors and its working f-number."""

APERTURE_TYPE = "float_by_stop_size"
"""The type of the system aperture the builder gives every optic, read back."""

DEFAULT_AIMING = {"mode": "paraxial", "max_iter": 10, "tol": 1e-06}
"""optiland's own ray aiming of an optic the builder made, which ``workingFNumberUnaimed`` is asked under."""

AXIS = (0.0, 0.0)
"""The normalised field a working f-number is asked at: the axis."""

UNSUPPORTED = {"line": "line"}
"""The ``item`` of each refusal of the quantity, by what it is about."""

VALUES = (
    "rearFocalZ",
    "focalLengthMm",
    "entrancePupilDiameterMm",
    "stopDiameterMm",
    "imageSpaceFNumber",
    "paraxialWorkingFNumber",
    "workingFNumber",
    "nominalFNumber",
    "totalTrackMm",
    "halfFieldDeg",
)
"""The values of a line, in the contract's order."""


@dataclass(frozen=True)
class SummaryRequest:
    """A ``summary.native`` request the engine answers: its lines."""

    lines: tuple[int, ...]


def read_request(spec: dict[str, Any], case: dict[str, Any]) -> SummaryRequest | list[dict[str, str]]:
    """What a schema-valid spec asks, or why the engine has no answer to it, as unsupported items."""
    count = len(case["conditions"]["lines"])
    lines = tuple(int(line) for line in spec["lines"])
    beyond = [line for line in lines if line >= count]
    if beyond:
        message = f"the case has {count} lines; the spec asks line {', '.join(str(line) for line in beyond)}"
        return [{"code": "option", "item": UNSUPPORTED["line"], "message": message}]
    return SummaryRequest(lines=lines)


class LineUnavailable(Exception):
    """optiland has no first-order data of the line's system: the item that says why, and what optiland gave."""

    def __init__(self, item: str, why: str) -> None:
        super().__init__(item)
        self.item = item
        self.why = why


def _mismatch(what: str, built: Any, expected: Any) -> BuildMismatch:
    return BuildMismatch(f"the summary: {what} is {built!r} in what optiland holds and {expected!r} asked")


def _hold(what: str, built: Any, expected: Any) -> None:
    if not (type(built) is type(expected) and built == expected):
        raise _mismatch(what, built, expected)


def _one(api: OptilandApi, value: Any, name: str) -> float:
    numbers = _numbers(api, value)
    if len(numbers) != 1:
        raise RuntimeError(f"optiland's {name} holds {len(numbers)} values, not one")
    return numbers[0]


def paraxial_step(
    case: dict[str, Any], line: int, api: OptilandApi | None = None, optic: Any | None = None
) -> dict[str, float]:
    """optiland's paraxial values of one line, read from a verified optic of the builder's, with the settings they are
    of read back (a ``BuildMismatch`` for what differs): the type and the value of the system aperture, the wavelength,
    the index of the image space, and where the marginal ray starts (at the rim of the entrance pupil parallel to the
    axis for an object at infinity, on the axis at the object otherwise). ``optic`` stands for the builder's in a test.

    Raises a ``LineUnavailable`` where optiland has no first-order data of the system.
    """
    api = api if api is not None else optiland_api()
    if optic is None:
        optic = build_optic(case, line, api)
        verify_optic(optic, case, line, api)
    conditions = case["conditions"]
    _hold("the type of the system aperture", str(optic.aperture.ap_type), APERTURE_TYPE)
    stop_diameter = 2.0 * float(conditions["stopSemiDiameter"])
    _hold("the stop diameter of the system aperture, mm", float(optic.aperture.value), stop_diameter)
    _hold("the wavelength, um", float(optic.primary_wavelength), wavelength_um(conditions["lines"][line]))
    image_index = _numbers(api, optic.surfaces.n(optic.primary_wavelength))[-1]
    _hold("the index of the image space", image_index, float(index_rows(case)[line][-1]))
    last_lens = int(case["system"]["lastLensSurfaceIndex"])
    data = line_data(optic, last_lens, api)
    if data.values is None:
        raise LineUnavailable(str(data.without), data.why)
    with _Quiet(api):
        entrance = _one(api, optic.paraxial.EPD(), "EPD()")
        heights, slopes = optic.paraxial.marginal_ray()
        ya, ua = _numbers(api, heights), _numbers(api, slopes)
        f_number = _one(api, optic.paraxial.FNO(), "FNO()")
        exit_diameter = _one(api, optic.paraxial.XPD(), "XPD()")
        track = float(optic.total_track)
    if bool(optic.object_surface.is_infinite):
        _hold("where the marginal ray starts: its height and slope", (ya[0], ua[0]), (entrance / 2.0, 0.0))
    else:
        _hold("where the marginal ray starts: its height", ya[0], 0.0)
    values = {
        "rearFocalZ": data.values["rearFocalZ"],
        "focalLengthMm": data.values["efl"],
        "entrancePupilDiameterMm": abs(entrance),
        "stopDiameterMm": float(optic.aperture.value),
        "imageSpaceFNumber": abs(f_number),
        # optiland has no accessor of it: its marginal ray's slope after the last surface, in the image space.
        "paraxialWorkingFNumber": 1.0 / (2.0 * image_index * abs(ua[-1])),
        "totalTrackMm": track,
        "exitPupilDiameterMm": abs(exit_diameter),
    }
    if not bool(optic.object_surface.is_infinite):
        values["magnification"] = data.recorded["magnification"]
    return values


WORKING_PUPIL: tuple[tuple[float, ...], tuple[float, ...]] = (
    (0.0, 0.0, 0.0, 1.0, -1.0),
    (0.0, 1.0, -1.0, 0.0, 0.0),
)
"""The batch ``get_working_FNO`` traces, ``Px`` and ``Py``: the chief ray, then the four rim rays."""


@dataclass(frozen=True)
class Working:
    """A working f-number of optiland's, how many of its four rim rays are dark at the image, and how many of them are
    dark first at a surface of the case other than the stop."""

    f_number: float
    rim_rays_lost: int
    rim_rays_vignetted: int


def rim_ray_counts(lit: Sequence[Sequence[bool]], stop: int, surfaces: int) -> tuple[int, int]:
    """How many rim rays are dark at the image, and how many of those are dark first at a surface of the case other
    than the stop: ``lit`` holds a row for each surface of optiland's (the object surface first, then the case's
    surfaces ``0`` to ``surfaces - 1``, then the image surface), a column for each rim ray. A ray dark first at the
    stop may be clipped there by a rounding (it is aimed at the clip radius), and one dark first at the object or the
    image surface was stopped by no surface of the case: neither is counted as vignetted."""
    lost = 0
    vignetted = 0
    for ray in range(len(lit[0]) if lit else 0):
        column = [bool(row[ray]) for row in lit]
        if all(column):
            continue
        lost += 1
        # optiland's surface k + 1 is the case's surface k.
        surface = column.index(False) - 1
        if 0 <= surface < surfaces and surface != stop:
            vignetted += 1
    return lost, vignetted


def _working(api: OptilandApi, tools: MtfApi, optic: Any, case: dict[str, Any]) -> Working:
    """``get_working_FNO`` on the axis, then its own batch traced again on the same optic, as it traced it: the
    intensity of its rim rays at the image says which of them it left out of its mean, or, all four dark, took all the
    same."""
    np = api.np
    with _Quiet(api):
        working = _one(api, tools.get_working_FNO(optic, AXIS, optic.primary_wavelength), "get_working_FNO")
        px, py = (np.array(values, dtype=np.float64) for values in WORKING_PUPIL)
        optic.trace_generic(Hx=AXIS[0], Hy=AXIS[1], Px=px, Py=py, wavelength=optic.primary_wavelength)
        # One row for each surface of optiland, the object surface first, and one column for each rim ray.
        lit = (np.asarray(optic.surfaces.intensity, dtype=np.float64)[:, 1:] > 0).tolist()
    system = case["system"]
    lost, vignetted = rim_ray_counts(lit, int(system["stopIndex"]), len(system["surfaces"]))
    return Working(f_number=working, rim_rays_lost=lost, rim_rays_vignetted=vignetted)


def working_step(
    case: dict[str, Any], line: int, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> Working:
    """optiland's working f-number of the axis at one line, on an optic of its own under the worker's ``robust``
    aiming: the field and the aiming are read back before (``field_optic``) and after it is asked (``verify_field``)."""
    api = api if api is not None else optiland_api()
    tools = tools if tools is not None else mtf_api()
    optic = field_optic(case, line, 0.0, api, tools)
    working = _working(api, tools, optic, case)
    verify_field(optic, case, 0.0, tools)
    return working


def unaimed_step(
    case: dict[str, Any], line: int, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> Working:
    """optiland's working f-number of the axis at one line on the builder's optic, under optiland's default aiming,
    which is read back before and after it is asked."""
    api = api if api is not None else optiland_api()
    tools = tools if tools is not None else mtf_api()
    optic = build_optic(case, line, api)
    verify_optic(optic, case, line, api)
    _hold("the ray aiming", dict(optic.ray_tracer.ray_aiming_config), DEFAULT_AIMING)
    working = _working(api, tools, optic, case)
    _hold("the ray aiming after the working f-number", dict(optic.ray_tracer.ray_aiming_config), DEFAULT_AIMING)
    return working


@dataclass(frozen=True)
class Steps:
    """What an answer asks of optiland, one call a step; a test hands stand-ins in their place."""

    paraxial: Callable[[dict[str, Any], int], dict[str, float]]
    working: Callable[[dict[str, Any], int], Working]
    unaimed: Callable[[dict[str, Any], int], Working]


def optiland_steps() -> Steps:
    """The steps on the real optiland."""
    return Steps(
        paraxial=lambda case, line: paraxial_step(case, line),
        working=lambda case, line: working_step(case, line),
        unaimed=lambda case, line: unaimed_step(case, line),
    )


def answer_line(case: dict[str, Any], line: int, steps: Steps) -> tuple[dict[str, Any], list[str]]:
    """The entry of one line of an answer, and what is noted of it for people.

    The paraxial values are asked first: a system optiland has none of is a line that is unavailable, with the item as
    its reason. Then each working f-number: an exception of optiland leaves that one null and is noted. ``FATAL``
    exceptions are no line's.
    """
    entry: dict[str, Any] = {
        "line": line,
        "wavelengthNm": case["conditions"]["lines"][line]["wavelengthNm"],
        "status": "ok",
        **{name: None for name in VALUES},
        "sampling": {},
    }
    named = f"line {line}"
    try:
        paraxial = steps.paraxial(case, line)
    except LineUnavailable as unavailable:
        return {**entry, "status": "unavailable", "reason": unavailable.item}, [f"{named}: {unavailable.why}"]
    for name in VALUES:
        if name in paraxial:
            entry[name] = paraxial[name]
    entry["sampling"] = {name: paraxial[name] for name in ("exitPupilDiameterMm", "magnification") if name in paraxial}
    notes: list[str] = []
    for name, step, into in (
        ("workingFNumber", steps.working, entry),
        ("workingFNumberUnaimed", steps.unaimed, entry["sampling"]),
    ):
        try:
            working = step(case, line)
        except FATAL:
            raise
        except Exception as error:  # noqa: BLE001 - what optiland raises of one value is that value's absence
            notes.append(f"{named}: optiland has no {name}: optiland raised {_said(error)}")
            continue
        if not math.isfinite(working.f_number):
            notes.append(f"{named}: optiland's {name} is {working.f_number!r}")
            continue
        into[name] = working.f_number
        if step is steps.unaimed:
            entry["sampling"]["unaimedRimRaysLost"] = float(working.rim_rays_lost)
            continue
        entry["sampling"]["workingRimRaysVignetted"] = float(working.rim_rays_vignetted)
        if working.rim_rays_vignetted == 0:
            continue
        said = (
            "optiland takes their angles all the same"
            if working.rim_rays_lost == len(WORKING_PUPIL[0]) - 1
            else "optiland leaves those out"
        )
        notes.append(
            f"{named}: {working.rim_rays_vignetted} of the rim rays of optiland's {name} are dark at a surface other "
            f"than the stop, and {said}"
        )
    return entry, notes


def method_of() -> dict[str, Any]:
    """The method of an answer: optiland's accessors and the settings they were asked under."""
    return {
        "name": METHOD,
        "params": {
            "aperture": APERTURE_TYPE,
            "imageSpaceFNumber": "|FNO()|",
            "paraxialWorkingFNumber": "1 / (2 n' |u'|) of marginal_ray()",
            "workingFNumber": "get_working_FNO on the axis",
            "workingAiming": "robust",
            "unaimedAiming": DEFAULT_AIMING["mode"],
        },
    }


def answer_summary(
    spec: dict[str, Any],
    case: dict[str, Any],
    *,
    steps: Steps | None = None,
    clock: Callable[[], float] = time.monotonic,
) -> dict[str, Any] | list[dict[str, str]]:
    """``summary.native`` of a case as optiland states it, or the unsupported items of a request it does not answer.

    Every line of the spec in its order. Raises a ``TimeBudgetExceeded`` where the request has taken
    ``REQUEST_BUDGET_S`` when a line is to be begun. ``steps`` stands in for optiland in a test.
    """
    asked = read_request(spec, case)
    if isinstance(asked, list):
        return asked
    steps = steps if steps is not None else optiland_steps()
    started = clock()
    lines: list[dict[str, Any]] = []
    notes: list[str] = []
    for line in asked.lines:
        begun = clock()
        if begun - started > REQUEST_BUDGET_S:
            raise TimeBudgetExceeded(
                f"the request had taken {begun - started:.0f} s when line {len(lines)} of {len(asked.lines)} was to be "
                f"begun, and {REQUEST_BUDGET_S:.0f} s are its budget: ask fewer lines at once"
            )
        entry, noted = answer_line(case, line, steps)
        lines.append(entry)
        notes.extend(noted)
    return {"lines": lines, "method": method_of(), "notes": notes}


def line_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many lines of an answer have each status."""
    statuses = [line["status"] for line in data["lines"]]
    return {"lines": len(statuses), **{name: statuses.count(name) for name in ("ok", "unavailable")}}


__all__ = [
    "LineUnavailable",
    "Working",
    "SUMMARY_NATIVE",
    "Steps",
    "SummaryRequest",
    "answer_line",
    "answer_summary",
    "line_counts",
    "paraxial_step",
    "read_request",
    "rim_ray_counts",
    "unaimed_step",
    "working_step",
]
