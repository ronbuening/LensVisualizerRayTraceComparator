"""``seidel.native``: optiland's own third-order sums of a case at one line.

Asked of optiland's ``aberrations`` of a verified optic of the line whose one field is ``maxFieldDeg``
(``mtf.field_optic``): ``seidels()``, the five totals S1 to S5, and ``third_order()``, whose per-surface terms of
transverse aberration (``TSC``, ``CC``, ``TAC``, ``TPC``, ``DC``) optiland sums into them as ``-sum(T) * 2 n' u'``
(its ``_sum_seidels``: ``n'`` the image space's index, ``u'`` its marginal ray's slope there). Nothing of a sum is
computed here but two changes optiland states no accessor for, each stated where it is applied:

- a surface's sum is its term times optiland's own factor ``-2 n' u'``, read from ``optic.surfaces.n`` and
  ``paraxial.marginal_ray()``; the surfaces' sums are held to optiland's total (``SURFACE_SUM_TOLERANCE`` of the sum of
  their magnitudes), a ``BuildMismatch`` otherwise;
- every sum is negated: OpticStudio's sign (the contract's) is the opposite of optiland's on all five, as optiland's own
  cross-tool test of the Hubble telescope against OpticStudio 2023 R1.02 states (docs/gotchas.md); and optiland's
  Lagrange invariant ``paraxial.invariant()``, ``n (y_chief u_marginal - y_marginal u_chief)``, is the contract's
  negated.

optiland's ``seidels()`` reads of a surface its radius and its conic constant (``_get_conic_term``): a term of power 3
or 4 of an asphere adds to the third-order sums, and optiland's would be the sums of another lens, so such a case is
refused (``term_refusals``), as are a phase profile and a term of power 1 or 2, which optiland's paraxial rays do not
see (``first_order.term_refusals``). optiland states no chromatic sum: its ``TAchC`` and ``TchC`` are of an optic that
disperses between the shortest and the longest of its wavelengths, and the builder's optic of a line has one, of a
constant index: ``CLA`` and ``CTR`` are null, with a note where they were asked.

Every setting is read back (``seidel_step``), each check with a test that makes the mistake on purpose
(``test_seidel.py``): the builder's optic and the field (``field_optic``), the type and value of the system aperture,
the wavelength, the image space's index, the largest field, where the marginal ray starts, the chief ray's slope in
object space (tan(maxFieldDeg)) and its height at the stop (0), the number of surfaces, ``third_order()``'s total
against ``seidels()``. A system optiland has no first-order data of is an answer ``unavailable`` with the item of
``first_order``; an exception of optiland, or a sum that is no number, an answer ``unavailable`` with the reason.
``FATAL`` exceptions are no answer's.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from .build import BuildMismatch, OptilandApi, index_rows, nonzero_terms, optiland_api, wavelength_um
from .first_order import line_data
from .first_order import term_refusals as first_order_refusals
from .mtf import FATAL, MtfApi, _Quiet, _numbers, _said, field_optic

SEIDEL_NATIVE = "seidel.native"

METHOD = "optiland-seidels"
"""The method of an answer: optiland's ``aberrations.seidels()`` and ``third_order()``."""

SUMS = ("SPHA", "COMA", "ASTI", "FCUR", "DIST")
"""The five sums of third order, in OpticStudio's order: optiland's S1 to S5."""

TERMS = ("TSC", "CC", "TAC", "TPC", "DC")
"""optiland's per-surface terms of those sums, in ``third_order()``'s tuple at 0, 2, 4, 6 and 8."""

CHROMATIC = ("CLA", "CTR")
"""The chromatic sums, which optiland's optic of one line states none of."""

APERTURE_TYPE = "float_by_stop_size"
"""The type of the system aperture the builder gives every optic, read back."""

SURFACE_SUM_TOLERANCE = 1e-12
"""How far the surfaces' sums may add up from optiland's own total, against the sum of their magnitudes: the rounding
of optiland's ``be.sum`` and of the worker's product by the factor, with room; terms of another factor, or of
another sum, are far beyond it. Which surface a term is of is optiland's order of its surfaces, held by their count."""

SLOPE_TOLERANCE = 4
"""How many units in the last place the chief ray's slope in object space may differ from tan(maxFieldDeg): optiland
takes numpy's ``tan`` of its ``deg2rad``, the worker the standard library's ``tan`` of its ``radians``."""

CHIEF_AT_STOP_TOLERANCE = 1e-12
"""How far from the axis the chief ray may cross the stop's vertex plane, against the largest of its heights."""

ASPHERIC_REASONS = (
    (3, "surface.asphere.cubic-term"),
    (4, "surface.asphere.quartic-term"),
)
"""The terms of an asphere optiland's Seidel sums do not read, each with its unsupported item."""


def term_refusals(case: dict[str, Any]) -> list[dict[str, str]]:
    """What keeps optiland's sums from being the sums of the case: ``first_order.term_refusals`` (a phase profile, a
    term of power 1 or 2), then a term of power 3 or 4, each naming the first surface that has one."""
    items = first_order_refusals(case)
    for power, item in ASPHERIC_REASONS:
        for number, surface in enumerate(case["system"]["surfaces"]):
            if any(stated == power for stated, _ in nonzero_terms(surface["shape"])):
                message = (
                    f"surface {number} has a term of power {power}: optiland's Seidel sums read a surface's radius and "
                    "conic constant alone (_get_conic_term), and would be the sums of another lens"
                )
                items.append({"code": "feature", "item": item, "message": message})
                break
    return items


@dataclass(frozen=True)
class SeidelRequest:
    """A ``seidel.native`` request the engine answers: its line, its largest field, its dispersion lines or None."""

    line: int
    max_field_deg: float
    dispersion: tuple[int, int] | None


def read_request(spec: dict[str, Any], case: dict[str, Any]) -> SeidelRequest | list[dict[str, str]]:
    """What a schema-valid spec asks, or why the engine has no answer to it, as unsupported items."""
    count = len(case["conditions"]["lines"])
    pair = spec.get("dispersionLines")
    asked = [int(spec["line"]), *(int(line) for line in pair or [])]
    beyond = [line for line in asked if line >= count]
    if beyond:
        message = f"the case has {count} lines; the spec asks line {', '.join(str(line) for line in beyond)}"
        return [{"code": "option", "item": "line", "message": message}]
    return SeidelRequest(
        line=int(spec["line"]),
        max_field_deg=float(spec["maxFieldDeg"]),
        dispersion=None if pair is None else (int(pair[0]), int(pair[1])),
    )


class AnswerUnavailable(Exception):
    """optiland has no sums of the line's system: the reason, and what optiland gave."""

    def __init__(self, reason: str, why: str) -> None:
        super().__init__(reason)
        self.reason = reason
        self.why = why


def _mismatch(what: str, built: Any, expected: Any) -> BuildMismatch:
    return BuildMismatch(f"the Seidel sums: {what} is {built!r} in what optiland holds and {expected!r} asked")


def _hold(what: str, built: Any, expected: Any) -> None:
    if not (type(built) is type(expected) and built == expected):
        raise _mismatch(what, built, expected)


def _units_apart(a: float, b: float) -> float:
    """How many units in the last place of the larger magnitude two floats lie apart."""
    if a == b:
        return 0.0
    return abs(a - b) / math.ulp(max(abs(a), abs(b)))


@dataclass(frozen=True)
class Sums:
    """optiland's sums of one line in the contract's sign: the totals, each surface's, the invariant, and what else."""

    total: dict[str, float]
    surfaces: list[dict[str, float]]
    invariant: float
    sampling: dict[str, float]


def seidel_step(
    case: dict[str, Any],
    line: int,
    max_field_deg: float,
    api: OptilandApi | None = None,
    tools: MtfApi | None = None,
    optic: Any | None = None,
) -> Sums:
    """optiland's sums of one line on a verified optic whose one field is ``max_field_deg``, every setting read back (a
    ``BuildMismatch`` for what differs). ``optic`` stands for the field's optic in a test.

    Raises an ``AnswerUnavailable`` where optiland has no first-order data of the system, or a sum that is no number.
    """
    api = api if api is not None else optiland_api()
    if optic is None:
        optic = field_optic(case, line, max_field_deg, api, tools)
    conditions = case["conditions"]
    surfaces = case["system"]["surfaces"]
    _hold("the type of the system aperture", str(optic.aperture.ap_type), APERTURE_TYPE)
    _hold("the stop diameter of the system aperture, mm", float(optic.aperture.value),
          2.0 * float(conditions["stopSemiDiameter"]))
    _hold("the wavelength, um", float(optic.primary_wavelength), wavelength_um(conditions["lines"][line]))
    image_index = _numbers(api, optic.surfaces.n(optic.primary_wavelength))[-1]
    _hold("the index of the image space", image_index, float(index_rows(case)[line][-1]))
    _hold("the largest field, degrees", float(optic.fields.max_y_field), float(max_field_deg))
    _hold("the number of surfaces", int(optic.surfaces.num_surfaces), len(surfaces) + 2)
    data = line_data(optic, int(case["system"]["lastLensSurfaceIndex"]), api)
    if data.values is None:
        raise AnswerUnavailable(str(data.without), data.why)
    with _Quiet(api):
        entrance = _numbers(api, optic.paraxial.EPD())[0]
        ya, ua = (_numbers(api, values) for values in optic.paraxial.marginal_ray())
        yb, ub = (_numbers(api, values) for values in optic.paraxial.chief_ray())
        invariant = _numbers(api, optic.paraxial.invariant())[0]
        totals = _numbers(api, optic.aberrations.seidels())
        third = optic.aberrations.third_order()
    if bool(optic.object_surface.is_infinite):
        _hold("where the marginal ray starts: its height and slope", (ya[0], ua[0]), (entrance / 2.0, 0.0))
    else:
        _hold("where the marginal ray starts: its height", ya[0], 0.0)
    slope = math.tan(math.radians(max_field_deg))
    if _units_apart(ub[0], slope) > SLOPE_TOLERANCE:
        raise _mismatch("the chief ray's slope in object space", ub[0], slope)
    stop = int(case["system"]["stopIndex"])
    # optiland's surface k + 1 is the case's surface k.
    if abs(yb[stop + 1]) > CHIEF_AT_STOP_TOLERANCE * max(1.0, *(abs(value) for value in yb)):
        raise _mismatch("the chief ray's height at the stop, mm", yb[stop + 1], 0.0)
    _hold("third_order()'s total", _numbers(api, third[-1]), totals)
    factor = 2.0 * image_index * ua[-1]
    per_surface: list[dict[str, float]] = [{} for _ in surfaces]
    for name, position in zip(SUMS, (0, 2, 4, 6, 8), strict=True):
        terms = _numbers(api, third[position])
        _hold(f"the number of {TERMS[SUMS.index(name)]} terms", len(terms), len(surfaces))
        # optiland's own per-surface sum, -T 2 n' u', in the contract's sign: negated.
        values = [term * factor for term in terms]
        total = -totals[SUMS.index(name)]
        scale = math.fsum(abs(value) for value in values)
        if abs(math.fsum(values) - total) > SURFACE_SUM_TOLERANCE * scale + 1e-300:
            raise _mismatch(f"the surfaces' {name} added up", math.fsum(values), total)
        for number, value in enumerate(values):
            per_surface[number][name] = value
    contract_totals = {name: -totals[at] for at, name in enumerate(SUMS)}
    stated = [*contract_totals.values(), invariant, *(v for entry in per_surface for v in entry.values())]
    if not all(math.isfinite(value) for value in stated):
        raise AnswerUnavailable("no-sums", "optiland's sums hold a value that is no number")
    return Sums(
        total=contract_totals,
        surfaces=per_surface,
        invariant=-invariant,
        sampling={"marginalSlopeImageSpace": ua[-1], "chiefHeightAtImageMm": yb[-1]},
    )


def method_of() -> dict[str, Any]:
    """The method of an answer: optiland's accessors and how their values became the contract's."""
    return {
        "name": METHOD,
        "params": {
            "totals": "-aberrations.seidels()",
            "surfaces": "third_order() terms times 2 n' u'",
            "sign": "OpticStudio's, optiland's negated",
            "chiefSlope": "tan(maxFieldDeg)",
            "aspheric": "conic constant only (terms of power 3 and 4 refused)",
        },
    }


def answer_seidel(
    spec: dict[str, Any],
    case: dict[str, Any],
    *,
    step: Callable[[dict[str, Any], int, float], Sums] | None = None,
) -> dict[str, Any] | list[dict[str, str]]:
    """``seidel.native`` of a case as optiland states it, or the unsupported items of a request it does not answer.
    ``step`` stands in for optiland in a test."""
    asked = read_request(spec, case)
    if isinstance(asked, list):
        return asked
    step = step if step is not None else (lambda c, line, angle: seidel_step(c, line, angle))
    line = case["conditions"]["lines"][asked.line]
    base: dict[str, Any] = {
        "line": {"index": asked.line, "wavelengthNm": line["wavelengthNm"]},
        "maxFieldDeg": spec["maxFieldDeg"],
        "dispersionLines": None if asked.dispersion is None else list(asked.dispersion),
        "method": method_of(),
    }
    notes: list[str] = []
    if asked.dispersion is not None:
        notes.append(
            "optiland states no chromatic sum: its TAchC and TchC are of an optic dispersing between its wavelengths, "
            "and the optic of a line has one wavelength of a constant index"
        )
    empty = {name: None for name in (*SUMS, *CHROMATIC)}

    def unavailable(reason: str, why: str) -> dict[str, Any]:
        return {**base, "status": "unavailable", "reason": reason, "invariant": None, "surfaces": [],
                "total": dict(empty), "sampling": {}, "notes": [*notes, why]}

    try:
        sums = step(case, asked.line, asked.max_field_deg)
    except AnswerUnavailable as missing:
        return unavailable(missing.reason, missing.why)
    except FATAL:
        raise
    except Exception as error:  # noqa: BLE001 - what optiland raises of the sums is their absence
        return unavailable(f"optiland-raised-{type(error).__name__}", f"optiland raised {_said(error)}")
    return {
        **base,
        "status": "ok",
        "invariant": sums.invariant,
        "surfaces": [
            {"surface": number, **{name: entry[name] for name in SUMS}, **{name: None for name in CHROMATIC}}
            for number, entry in enumerate(sums.surfaces)
        ],
        "total": {**sums.total, **{name: None for name in CHROMATIC}},
        "sampling": dict(sums.sampling),
        "notes": notes,
    }


def answer_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many surfaces an answer states sums of, and whether it is ok."""
    return {"surfaces": len(data["surfaces"]), "ok": int(data["status"] == "ok")}


__all__ = [
    "AnswerUnavailable",
    "SEIDEL_NATIVE",
    "SeidelRequest",
    "Sums",
    "answer_counts",
    "answer_seidel",
    "read_request",
    "seidel_step",
    "term_refusals",
]
