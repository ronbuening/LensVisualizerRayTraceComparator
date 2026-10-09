"""``paraxial.first-order``: optiland's own first-order data of built optics, stated in the contract's frame.

Every number is asked of ``optic.paraxial`` of one line's optic, which answers at the optic's primary wavelength: the
line's, the only one it has. Nothing of the data is computed here but the change of reference, and each reference is
optiland's own statement of where its number is measured from (``optiland/paraxial.py``):

==============================  ==================  ===========================================================
The contract's value            optiland's          Measured from, in optiland
==============================  ==================  ===========================================================
``efl``                         ``f2()``            nothing: a length
``frontFocalZ``                 ``F1()``            the first surface, index 1: the first vertex is added
``frontPrincipalZ``             ``P1()``            the first surface: the first vertex is added
``rearFocalZ``                  ``F2()``            the IMAGE surface: the image plane is added
``rearPrincipalZ``              ``P2()``            the image surface: the image plane is added
``backFocus``                   ``F2()``            the rear focal point above, minus the last lens vertex
``entrancePupilZ``              ``EPL()``           the first surface: the first vertex is added
``exitPupilZ``                  ``XPL()``           the image surface: the image plane is added
``entrancePupilSemiDiameter``   ``EPD()``           nothing: a diameter, halved, without its sign
``exitPupilSemiDiameter``       ``XPD()``           nothing: a diameter, halved, without its sign
==============================  ==================  ===========================================================

The vertices and the image plane are read from the optic too (``surfaces.positions``, the axis its paraxial rays run
along). The one thing an optic cannot say is which surface is the last of the lens and which a rear plate: that
index is the case's, and is handed over as a number.

**Whose radius the pupils are images of.** ``EPD()`` asks the system's aperture, which for ``float_by_stop_size``
divides its own value, the stop diameter the builder set to twice ``conditions.stopSemiDiameter``, by the height a
paraxial ray of height 1 has at the stop; ``XPD()`` follows the marginal ray of that pupil to the exit pupil. Neither
reads the stop surface's ``aperture.r_max``, the clip limit, which optiland's ray aiming takes for the stop's radius.

**What optiland has no answer for** is answered "unsupported", never with a number that is something else:

- a term of power 2: optiland's paraxial power of a surface is ``(n2 - n1) / radius`` and does not see it;
- a term of power 1, as in every engine: a cone has no curvature at its vertex;
- an afocal system, whose focal length optiland gives as an infinity, or as what rounding left of one;
- an entrance pupil at infinity: optiland sizes the exit pupil with a marginal ray it launches at the rim of the
  entrance pupil, and has no such ray.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
import warnings
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any

from lvrtc_worker_kit.ndarray import encode_ndarray

from .build import OptilandApi, nonzero_terms, optiland_api

PARAXIAL_FIRST_ORDER = "paraxial.first-order"
"""The id of the quantity that holds a system's first-order data: what rung R1 compares."""

FIRST_ORDER_VALUES: tuple[str, ...] = (
    "efl",
    "frontFocalZ",
    "rearFocalZ",
    "frontPrincipalZ",
    "rearPrincipalZ",
    "backFocus",
    "entrancePupilZ",
    "exitPupilZ",
    "entrancePupilSemiDiameter",
    "exitPupilSemiDiameter",
)
"""The compared values of the quantity, in the order of the contract (``src/contract/quantities``)."""

PUPIL_VALUES: tuple[str, ...] = FIRST_ORDER_VALUES[6:]
"""The values that are the position or the radius of a pupil: these alone may be an infinity."""

AFOCAL_SYSTEM = "system.afocal"
"""The ``item`` of the "unsupported" answer to a system without a finite focal length at a line: the contract's."""

LINEAR_SAG_TERM = "surface.asphere.linear-term"
"""The ``item`` of the "unsupported" answer to a case with a term of power 1: the contract's, for every engine."""

QUADRATIC_SAG_TERM = "surface.asphere.quadratic-term"
"""The ``item`` of the "unsupported" answer to a case with a term of power 2: the contract's, for an engine whose
paraxial model reads the radius of a surface alone, as optiland's does. The contract counts twice the coefficient
as curvature at the vertex."""

TELECENTRIC_OBJECT_SPACE = "system.telecentric.object-space"
"""The ``item`` of the "unsupported" answer to a system whose entrance pupil optiland puts at infinity: this
engine's own. optiland then has no diameter of the exit pupil (``XPD()`` is a NaN)."""

AFOCAL_RELATIVE_POWER = 1e-12
"""How small a system's power may be, against the sum of the magnitudes of its surfaces' powers, before the worker
calls the system afocal. optiland has no test of its own: ``f2()`` of a telescope is an infinity where the sum of
the powers cancels to the bit, and a focal length of 1e17 mm where rounding left something."""

RECORDED_F_NUMBER = "optilandFNumber"
"""The name under which optiland's paraxial f-number is recorded: ``FNO()``, which for a stop given by its size is
``f2() / EPD()``, the focal length over the diameter of the entrance pupil whatever the object distance, with the
sign of that diameter."""

RECORDED_MAGNIFICATION = "magnification"
"""The name under which every engine records the paraxial lateral magnification of a finite object."""


def term_refusals(case: dict[str, Any]) -> list[dict[str, str]]:
    """What the polynomial terms of a case keep optiland's first-order data from answering; empty when nothing does.

    One item of code ``feature`` for a term of power 1 and one for a term of power 2, each naming the first surface
    that has one, the linear one first. Only a term whose coefficient is not 0 counts: a zero adds nothing to a
    surface, in the contract and in optiland's coefficient list alike.
    """
    reasons = (
        (1, LINEAR_SAG_TERM, "a cone has no curvature at its vertex"),
        (2, QUADRATIC_SAG_TERM, "optiland's paraxial power of a surface is (n2 - n1) / radius, which does not see it"),
    )
    items: list[dict[str, str]] = []
    for power, item, why in reasons:
        for number, surface in enumerate(case["system"]["surfaces"]):
            if any(stated == power for stated, _ in nonzero_terms(surface["shape"])):
                message = f"surface {number} has a term of power {power}: {why}"
                items.append({"code": "feature", "item": item, "message": message})
                break
    return items


@dataclass(frozen=True)
class LineData:
    """The first-order data of one line's optic, as optiland gives it: or why optiland has none."""

    values: dict[str, float] | None
    """The ten compared values in the contract's frame, by name; None where ``without`` says why there are none."""
    recorded: dict[str, float]
    """What is reported and never judged, by name."""
    without: str | None = None
    """The unsupported item that keeps the line from having values, or None."""
    why: str = ""
    """What optiland gave that the item was decided on."""


def _number(api: OptilandApi, value: Any, name: str) -> float:
    """One number of optiland as a float: its accessors give numpy scalars, 0-d arrays and arrays of one element."""
    array = api.np.asarray(value, dtype=api.np.float64)
    if array.size != 1:
        raise RuntimeError(f"optiland's paraxial.{name}() holds {array.size} values, not one")
    return float(array.reshape(-1)[0])


def _ask(api: OptilandApi, optic: Any, name: str) -> float:
    """What the accessor ``name`` of ``optic.paraxial`` gives, as a float.

    optiland divides by a slope that is 0 where a pupil or a focal point lies at infinity: the infinity is the
    answer, and numpy's warning of the division is not passed on. A call that optiland has deprecated is an error,
    not a warning in the log: optiland attributes a deprecation to its caller, which is this module.
    """
    accessor: Callable[[], Any] = getattr(optic.paraxial, name)
    with api.np.errstate(all="ignore"), warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        warnings.filterwarnings("error", category=DeprecationWarning, module=r"lvrtc_optiland\.")
        return _number(api, accessor(), name)


def surface_power_scale(api: OptilandApi, optic: Any) -> tuple[float, float]:
    """The sum of the magnitudes of the surfaces' paraxial powers, 1/mm, and the index of the image space.

    Both are read from the optic as optiland's paraxial tracer reads them (``paraxial_ray_tracer.trace_generic``): a
    surface's power is the step of the index at it over its radius, with the radii of ``surfaces.radii`` and the
    indices of ``surfaces.n`` at the primary wavelength. The image space is the medium the image surface states.
    """
    radii = [float(value) for value in api.np.asarray(optic.surfaces.radii, dtype=api.np.float64).ravel()]
    wavelength = optic.primary_wavelength
    indices = [float(value) for value in api.np.asarray(optic.surfaces.n(wavelength), dtype=api.np.float64).ravel()]
    scale = math.fsum(abs((indices[at] - indices[at - 1]) / radii[at]) for at in range(1, len(radii)))
    return scale, indices[-1]


def line_data(optic: Any, last_lens_surface: int, api: OptilandApi | None = None) -> LineData:
    """The first-order data of one optic, in the contract's frame, or the item that says why it has none.

    ``last_lens_surface`` is the case's index of the rear lens vertex, which the back focus is measured from: a
    rear plate lies inside the back focus, and an optic does not say which of its surfaces is one.

    Each reference is stated where it is applied. Raises a ``RuntimeError`` for a value optiland gives that is no
    value and has no item: a NaN, or an infinity that is not a pupil's.
    """
    api = api if api is not None else optiland_api()
    positions = [float(value) for value in api.np.asarray(optic.surfaces.positions, dtype=api.np.float64).ravel()]
    # optiland's index 0 is the object surface and its last one the image surface: a case's surface k is k + 1.
    first_vertex, image_plane = positions[1], positions[-1]
    last_lens_vertex = positions[last_lens_surface + 1]

    # The focal length first: without one there is no focal point to refer anything to. An infinite one is that of
    # an afocal system; one that is no number says nothing of the system, and is no "unsupported".
    focal_length = _ask(api, optic, "f2")
    if math.isnan(focal_length):
        raise RuntimeError(f"optiland's first-order data has no efl: it is {focal_length!r}")
    scale, image_index = surface_power_scale(api, optic)
    power = 0.0 if math.isinf(focal_length) else image_index / focal_length
    if math.isinf(focal_length) or abs(power) <= AFOCAL_RELATIVE_POWER * scale:
        why = f"optiland's f2() is {focal_length!r} mm, and the powers of the surfaces add up to {scale!r} per mm"
        return LineData(values=None, recorded={}, without=AFOCAL_SYSTEM, why=why)

    # The entrance pupil: EPL() is its distance from the first surface, EPD() its diameter. A diameter has the sign
    # of the ray height it was divided by, which is negative where the stop is imaged upside down.
    entrance_location = _ask(api, optic, "EPL")
    entrance_diameter = _ask(api, optic, "EPD")
    if math.isinf(entrance_location) or math.isinf(entrance_diameter):
        why = f"optiland's EPL() is {entrance_location!r} mm and its EPD() {entrance_diameter!r} mm"
        return LineData(values=None, recorded={}, without=TELECENTRIC_OBJECT_SPACE, why=why)

    # F2(), P2() and XPL() are distances from the image surface, wherever the case put it: the image plane is added.
    rear_focal_z = image_plane + _ask(api, optic, "F2")
    values = {
        "efl": focal_length,
        # F1() and P1() are distances from the first surface, as EPL() is: the first vertex is added.
        "frontFocalZ": first_vertex + _ask(api, optic, "F1"),
        "rearFocalZ": rear_focal_z,
        "frontPrincipalZ": first_vertex + _ask(api, optic, "P1"),
        "rearPrincipalZ": image_plane + _ask(api, optic, "P2"),
        # optiland reports its back focal point from the image surface; the contract's back focus is from the last
        # vertex of the lens, in front of any rear plate.
        "backFocus": rear_focal_z - last_lens_vertex,
        "entrancePupilZ": first_vertex + entrance_location,
        "exitPupilZ": image_plane + _ask(api, optic, "XPL"),
        "entrancePupilSemiDiameter": abs(entrance_diameter) / 2.0,
        "exitPupilSemiDiameter": abs(_ask(api, optic, "XPD")) / 2.0,
    }
    for name in FIRST_ORDER_VALUES:
        value = values[name]
        if math.isnan(value) or (math.isinf(value) and name not in PUPIL_VALUES):
            raise RuntimeError(f"optiland's first-order data has no {name}: it is {value!r}")

    recorded = {RECORDED_F_NUMBER: _ask(api, optic, "FNO")}
    if not bool(optic.object_surface.is_infinite):
        recorded[RECORDED_MAGNIFICATION] = _ask(api, optic, "magnification")
    return LineData(values=values, recorded=recorded)


@dataclass(frozen=True)
class FirstOrderAnswer:
    """``paraxial.first-order`` of a case's optics: its data, or the unsupported items that say why there is none."""

    data: dict[str, Any] | None
    unsupported: tuple[dict[str, str], ...] = ()


def first_order_of(optics: Sequence[Any], last_lens_surface: int, api: OptilandApi | None = None) -> FirstOrderAnswer:
    """``paraxial.first-order`` of built optics, one for each line, in the order of the lines.

    Every array has one value per line. ``recorded`` holds optiland's paraxial f-number at each line and, for a
    finite object, its lateral magnification of the object plane.

    A line at which optiland has no first-order data makes the whole answer "unsupported", with one item of code
    ``feature`` for each kind of reason, naming every such line: ``system.afocal`` first.
    """
    api = api if api is not None else optiland_api()
    lines = [line_data(optic, last_lens_surface, api) for optic in optics]

    unsupported: list[dict[str, str]] = []
    reasons = (
        (AFOCAL_SYSTEM, "the system has no finite focal length"),
        (TELECENTRIC_OBJECT_SPACE, "the entrance pupil is at infinity, so optiland has no diameter of the exit pupil"),
    )
    for item, said in reasons:
        at = [number for number, line in enumerate(lines) if line.without == item]
        if not at:
            continue
        named = f"{'lines' if len(at) > 1 else 'line'} {', '.join(str(number) for number in at)}"
        message = f"{said} at {named}: {lines[at[0]].why}"
        unsupported.append({"code": "feature", "item": item, "message": message})
    if unsupported:
        return FirstOrderAnswer(data=None, unsupported=tuple(unsupported))

    count = len(lines)
    data: dict[str, Any] = {}
    for name in FIRST_ORDER_VALUES:
        data[name] = encode_ndarray("f8", [_values(line)[name] for line in lines], [count])
    data["recorded"] = {
        name: encode_ndarray("f8", [line.recorded[name] for line in lines], [count]) for name in lines[0].recorded
    }
    return FirstOrderAnswer(data=data)


def _values(line: LineData) -> dict[str, float]:
    """The compared values of a line that has them: one without was answered as unsupported before this is asked."""
    if line.values is None:
        raise RuntimeError("a line without first-order data was not answered as unsupported")
    return line.values
