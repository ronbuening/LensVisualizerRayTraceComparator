"""``zernike.native``: optiland's own Zernike fit of its wavefront, one line, field and grid per fresh verified optic.

The samples are those of ``wavefront.native`` (``wavefront.wavefront_sample``: ``Wavefront`` of the worker's midpoint
grid strictly inside the unit circle, under the robust aiming, referred to the sphere about the chief ray's landing, its
OPD in vacuum waves as optiland gives it, every setting read back). Its fit is optiland's ``ZernikeFit`` of them as
optiland's own ``ZernikeOPD`` makes it: the distribution's normalised coordinates and the OPD of the samples of
positive intensity (``ZernikeOPD`` itself takes a hexapolar grid only, so its two steps are taken here on the midpoint
grid; ``test_zernike.py`` holds the two steps on a hexapolar grid to ``ZernikeOPD``'s coefficients bit for bit).
OpticStudio's Zernike Standard is optiland's ``"noll"`` (optiland's ``"standard"`` is the OSA/ANSI ordering, another
one), its Zernike Fringe optiland's ``"fringe"``, whose 37th polynomial is not OpticStudio's: optiland's is
rho^6 cos 6 theta, OpticStudio's the radial polynomial of order 12. A Fringe fit of 37 terms is therefore refused
(``zernike.fringe-term-37``), and every fit is held, term by term, to the contract's ordering (``polynomials``).

Read back besides the samples' settings: the fit's type and class, its number of terms and of points, its
coordinates and values bit for bit, and the (n, m) of every term; each with a test that makes the mistake on purpose.
What optiland states no accessor of is computed here and stated where it is: the RMS of the samples about their mean
(optiland's ``OPD.rms()`` is about the chief ray's path, the piston included: docs/gotchas.md), their peak to valley,
and the RMS of what the fit leaves, of optiland's own evaluation of its polynomials (``zernike.poly``), each a
``math.fsum``; and the condition of the fit's normal equations, ``||G||_1 ||G^-1||_1`` (numpy's ``cond`` of order 1),
G the Gram matrix of optiland's own polynomials at the samples (``terms`` of a basis of unit coefficients, as
``ZernikeFit`` builds its design matrix). A vignetted field lights a strip of the disc, on which polynomials that differ
only outside it are nearly one: a condition of 2^52 or more leaves the coefficients no digit, and the field is
``unavailable`` (``ill-conditioned``); below it the condition is stated, and a comparison sorts by it. The frame is optiland's, the contract's mirrored in y, which is OpticStudio's for the same field angle.

A field optiland raises on is an ``unavailable`` row with ``optiland-raised-<class>``; one with fewer valid samples than
terms is ``unavailable`` (``too-few-samples``, as ``optiland-wave`` says it) before optiland is asked to fit it;
``FATAL`` exceptions are no field's; the request is given up between two fields after ``REQUEST_BUDGET_S``. Nothing of
optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
import time
from collections.abc import Callable
from typing import Any

from .build import BuildMismatch, optiland_api
from .mtf import FATAL, REQUEST_BUDGET_S, TimeBudgetExceeded, _Quiet, _numbers, _said
from .wavefront import read_request as read_wavefront_request
from .wavefront import wavefront_sample

ZERNIKE_NATIVE = "zernike.native"

METHOD = "optiland-zernike-fit"
"""The method of an answer: optiland's ``ZernikeFit`` of its ``Wavefront`` samples, ``ZernikeOPD``'s two steps."""

OPTILAND_TYPES = {"standard": "noll", "fringe": "fringe"}
"""optiland's ``zernike_type`` of each ordering of the contract (OpticStudio's names)."""

OPTILAND_CLASSES = {"standard": "ZernikeNoll", "fringe": "ZernikeFringe"}
"""The class of optiland's basis of each ordering, read back."""

FRINGE_TERMS_AGREED = 36
"""How many of optiland's Fringe polynomials are OpticStudio's: its 37th is (6, 6), OpticStudio's (12, 0)."""

FRINGE_TERM_37 = "zernike.fringe-term-37"
"""The unsupported item of a Fringe fit of 37 terms."""

ILL_CONDITIONED = 2.0**52
"""The condition of the normal equations from which their solution keeps no digit."""


class IllConditioned(Exception):
    """The fit's normal equations are singular to working precision: the coefficients have no digit."""


class TooFewSamples(Exception):
    """Fewer valid samples than terms: no fit determines the coefficients. Raised by the worker, not by optiland."""


REASONS: tuple[tuple[type[Exception], str], ...] = ((IllConditioned, "ill-conditioned"),
                                                   (TooFewSamples, "too-few-samples"))
"""The reason of a field the worker itself finds no fit of; any other exception is ``optiland-raised-<class>``."""


FRINGE_POLYNOMIALS: tuple[tuple[int, int], ...] = (
    (0, 0), (1, 1), (1, -1), (2, 0), (2, 2), (2, -2), (3, 1), (3, -1), (4, 0), (3, 3), (3, -3), (4, 2), (4, -2),
    (5, 1), (5, -1), (6, 0), (4, 4), (4, -4), (5, 3), (5, -3), (6, 2), (6, -2), (7, 1), (7, -1), (8, 0), (5, 5),
    (5, -5), (6, 4), (6, -4), (7, 3), (7, -3), (8, 2), (8, -2), (9, 1), (9, -1), (10, 0), (12, 0),
)
"""OpticStudio's 37 Zernike Fringe polynomials in their order, as (n, m): m > 0 a cosine, m < 0 a sine."""


def noll(j: int) -> tuple[int, int]:
    """Noll's polynomial of index ``j`` from 1: the row n of the triangle that holds j, |m| ascending in it, each |m|
    above 0 twice, the even index the cosine."""
    n = 0
    while (n + 1) * (n + 2) // 2 < j:
        n += 1
    k = j - n * (n + 1) // 2 - 1
    size = 2 * ((k + 1) // 2) if n % 2 == 0 else 2 * (k // 2) + 1
    return n, 0 if size == 0 else (size if j % 2 == 0 else -size)


def polynomials(ordering: str, terms: int) -> list[tuple[int, int]]:
    """The contract's first ``terms`` polynomials of an ordering, as (n, m)."""
    if ordering == "fringe":
        return list(FRINGE_POLYNOMIALS[:terms])
    return [noll(j) for j in range(1, terms + 1)]


def read_request(spec: dict[str, Any], case: dict[str, Any]) -> Any:
    """What a schema-valid spec asks (the fields of ``wavefront.read_request``), or why the engine has no answer."""
    if spec["ordering"] == "fringe" and int(spec["terms"]) > FRINGE_TERMS_AGREED:
        message = (
            f"optiland's Fringe polynomial {FRINGE_TERMS_AGREED + 1} is rho^6 cos 6 theta and OpticStudio's the radial "
            "polynomial of order 12: a fit of 37 terms would be of another basis"
        )
        return [{"code": "option", "item": FRINGE_TERM_37, "message": message}]
    raw = {"line": spec["line"], "fields": {"kind": "angles-deg", "values": spec["fieldAnglesDeg"]},
           "grids": [spec["grid"]]}
    return read_wavefront_request(raw, {}, case)


def _hold(what: str, built: Any, expected: Any) -> None:
    if not (type(built) is type(expected) and built == expected):
        raise BuildMismatch(f"the Zernike fit: {what} is {built!r} in what optiland holds and {expected!r} asked")


def rms_and_peak_to_valley(values: list[float]) -> tuple[float, float]:
    """The RMS of ``values`` about their mean and their largest less their smallest, each sum a ``math.fsum``."""
    mean = math.fsum(values) / len(values)
    return math.sqrt(math.fsum((value - mean) ** 2 for value in values) / len(values)), max(values) - min(values)


def zernike_field(case: dict[str, Any], line: int, angle: float, grid: int, ordering: str, terms: int,
                   sample: Callable[..., Any] = wavefront_sample) -> dict[str, Any]:
    """The entry of one field: ``wavefront_sample``, then optiland's fit of its valid samples, read back. Fewer valid
    samples than terms raise ``TooFewSamples`` before optiland is asked for a fit."""
    raw = sample(case, line, angle, grid)
    cells = [cell for cell in raw.inside if raw.valid[cell] == 1]
    if len(cells) < terms:
        raise TooFewSamples(f"{len(cells)} valid samples cannot determine {terms} coefficients")
    from optiland.zernike import ZernikeFit  # noqa: PLC0415 - after worker hygiene

    api = optiland_api()
    np = api.np
    x = [raw.x[cell] for cell in cells]
    y = [raw.y[cell] for cell in cells]
    w = [raw.opd[cell] for cell in cells]
    with _Quiet(api):
        fit = ZernikeFit(np.array(x, dtype=np.float64), np.array(y, dtype=np.float64), np.array(w, dtype=np.float64),
                         zernike_type=OPTILAND_TYPES[ordering], num_terms=terms)
    _hold("the type", fit.zernike_type, OPTILAND_TYPES[ordering])
    _hold("the class of the basis", type(fit.zernike).__name__, OPTILAND_CLASSES[ordering])
    _hold("the number of terms", int(fit.num_terms), terms)
    _hold("the number of points", int(fit.num_pts), len(cells))
    _hold("the x of the points", _numbers(api, fit.x), x)
    _hold("the y of the points", _numbers(api, fit.y), y)
    _hold("the values at the points", _numbers(api, fit.z), w)
    indices = [(int(n), int(m)) for n, m in fit.zernike.indices.tolist()]
    _hold("the polynomials (n, m)", indices, polynomials(ordering, terms))
    coefficients = _numbers(api, fit.coeffs)
    _hold("the number of coefficients", len(coefficients), terms)
    with _Quiet(api):
        fitted = _numbers(api, fit.zernike.poly(fit.radius, fit.phi))
        design = np.stack(type(fit.zernike)(np.ones(terms)).terms(fit.radius, fit.phi), axis=1)
        condition = float(np.linalg.cond(design.T @ design, 1))
    if not condition < ILL_CONDITIONED:
        raise IllConditioned(f"the normal equations have a condition of {condition!r}, at which the fit keeps no digit")
    if not all(math.isfinite(value) for value in [*coefficients, *fitted]):
        raise ValueError("optiland's fit holds a value that is no number")
    rms, pv = rms_and_peak_to_valley(w)
    residual = math.sqrt(math.fsum((value - fit_value) ** 2 for value, fit_value in zip(w, fitted, strict=True))
                         / len(w))
    return {"imageHeightMm": math.hypot(raw.center[0], raw.center[1]), "coefficients": coefficients,
            "rmsToChiefWaves": rms, "pvToChiefWaves": pv, "fitResidualRmsWaves": residual, "fitCondition": condition,
            "validSamples": len(cells),
            "sampling": {"gridSize": float(grid)}}


def answer_zernike(spec: dict[str, Any], case: dict[str, Any],
                   step: Callable[..., dict[str, Any]] = zernike_field,
                   clock: Callable[[], float] = time.monotonic) -> dict[str, Any] | list[dict[str, str]]:
    """``zernike.native`` of a case as optiland states it, or the unsupported items of a request it does not answer.
    ``step`` stands in for optiland in a test."""
    asked = read_request(spec, case)
    if isinstance(asked, list):
        return asked
    fields, notes = [], []
    started = clock()
    for angle in asked.angles:
        if clock() - started > REQUEST_BUDGET_S:
            raise TimeBudgetExceeded("zernike.native exceeded REQUEST_BUDGET_S before its next field")
        entry: dict[str, Any] = {"fieldAngleDeg": angle, "status": "ok"}
        try:
            entry.update(step(case, asked.line, angle, int(spec["grid"]), spec["ordering"], int(spec["terms"])))
        except FATAL:
            raise
        except Exception as error:  # noqa: BLE001 - one failed field, never the whole request
            reason = next((name for kind, name in REASONS if isinstance(error, kind)),
                          f"optiland-raised-{type(error).__name__}")
            entry.update(status="unavailable", reason=reason, imageHeightMm=None, coefficients=[],
                         rmsToChiefWaves=None, pvToChiefWaves=None, fitResidualRmsWaves=None, fitCondition=None,
                         validSamples=0, sampling={})
            notes.append(f"field {angle}: {_said(error)}")
        fields.append(entry)
    line = case["conditions"]["lines"][asked.line]
    return {"line": {"index": asked.line, "wavelengthNm": line["wavelengthNm"]}, "grid": spec["grid"],
            "ordering": spec["ordering"], "terms": spec["terms"], "fields": fields,
            "method": {"name": METHOD, "params": {"source": "Wavefront.get_data", "fit": "ZernikeFit",
                                                  "zernikeType": OPTILAND_TYPES[spec["ordering"]],
                                                  "pupil": "stop-midpoints", "strategy": "chief_ray",
                                                  "removeTilt": False, "frame": "mirrored-in-y",
                                                  "opdSign": "reference-minus-path", "opdUnit": "vacuum-waves"}},
            "notes": notes}


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many fields of an answer have each status."""
    statuses = [field["status"] for field in data["fields"]]
    return {"fields": len(statuses), **{name: statuses.count(name) for name in ("ok", "unavailable")}}


__all__ = [
    "FRINGE_POLYNOMIALS",
    "FRINGE_TERM_37",
    "REASONS",
    "ZERNIKE_NATIVE",
    "IllConditioned",
    "TooFewSamples",
    "answer_zernike",
    "field_counts",
    "noll",
    "polynomials",
    "read_request",
    "rms_and_peak_to_valley",
    "zernike_field",
]
