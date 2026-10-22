"""``mtf.native`` by the method "geometric": optiland's own geometric MTF, one line, one field and one sampling a call.

The curves of one line are those of optiland's ``GeometricMTF`` (``optiland/mtf/geometric.py``), asked as anyone
would ask it, with every option stated, and read from its own attributes. What that class computes, read in its
source at ``4e893f53``:

- **The rays.** It is a ``SpotDiagram``: for the one field and the one wavelength it traces the pupil distribution
  ``"uniform"`` with ``num_rays``, which it hands to the spot diagram as that class's ``num_rings``: the points of
  ``linspace(-1, 1, num_rays)`` in both normalised pupil coordinates that lie within the unit circle, about
  ``pi / 4`` of the square, all in one batch. With the aiming this module's optic has (``mtf.set_field``) a pupil
  coordinate is a point of the stop surface, out to its clip radius, as for the FFT: the grid is even on the stop.
- **The spot.** What optiland's image surface recorded of each ray whose intensity there is above 0: x and y in
  the coordinates of that surface (``coordinates="local"``), which is the plane of the case and has no decentre, so
  they are millimetres from the axis. A ray an aperture stopped has an intensity of 0 and is left out. Every other
  counts once: the intensity is no weight, and here it is 1 (no coating, no absorption).
- **No reference point.** The spot diagram has one, the chief ray, for its radii and its plots; the MTF does not
  read it. Each cut is of the landings as they are.
- **Bins and a direct sum.** The landings along one axis are counted into ``num_points + 1`` bins of equal width
  from the least landing to the greatest (``numpy.histogram``), and the value at a frequency is the modulus of the
  sum of ``count * exp(2 pi i nu centre)`` over the bins, over the number of rays: no FFT, a modulus, 1 at no
  frequency. ``mtf[0][0]`` is of the landings' y, the tangential cut, and ``mtf[0][1]`` of their x, the sagittal
  one. The optic is the contract's mirrored in y, which changes neither.
- **The frequencies** are ``linspace(0, max_freq, num_points)``, cycles/mm on the image surface, as stated: no rim
  ray calibrates them, and nothing of the FFT's axes applies. The worker states the largest frequency asked for
  ``max_freq`` and interpolates linearly between the two samples that enclose a frequency.
- **No diffraction.** By default the class multiplies its curve by the diffraction limit of a circular pupil,
  with the paraxial f-number's cut-off (``scale=True``). The worker states ``scale=False`` and reads back both
  the flag and the factor the class says it multiplied by.

**What the bins do.** A ray counts at the centre of its bin, up to half a bin from where it landed, so optiland's
value is the modulus of the sum of its own landings moved by that much: lower by the factor
``sin(pi nu w) / (pi nu w)`` for a spot spread evenly over bins of width ``w``, off by at most
``2 sin(pi nu w / 2)`` whatever the spot, and of no meaning above ``1 / (2 w)``, where the bins cannot tell a
frequency from its alias. The worker does not rely on that estimate: it sums the same landings without bins
(``landing_sums``) and gives optiland's value only where it lies within the field's band of that sum, 0.005 on
the axis and 0.01 off it. A field with a value further off has no curves (``frequency-beyond-bins``), and how far
the two lie apart is stated for every field (``binningMaxDelta``), with the width of a bin of each cut.

**Several lines.** optiland's class is of one wavelength and gives a modulus about no stated point, so the MTF of
a spectrum cannot be read from it. It can be formed of its rays, because a landing is a point of the image plane:
each line is asked as above on an optic of its own, and the worker sums

    OTF(nu) = sum over lines of W_l S_l(nu) / sum over lines of W_l T_l

with ``W_l`` the weight of the line in the case, ``S_l`` the sum of ``w exp(-2 pi i nu u)`` over the landings ``u``
of the line's lit rays, ``w`` the intensity optiland gives each, and ``T_l`` the sum of those intensities: the
comparator's convention for a spectrum (``polychromaticOtf``), every line about one point, the axis point of the
image plane, on which no modulus depends. The lines are added as complex numbers before the modulus is taken, so
lateral colour lowers it. Then the rays and the pupil grid are optiland's and the sum is the worker's, without
bins: the answer says so (``method.name`` ``spot-landings-sum``), and states how far optiland's own curve of each
line lies from the modulus of that line's sum. One line, a case's only one or the one the engine option ``line``
names, is optiland's own curve (``geometric-mtf``).

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

from .build import BuildMismatch, OptilandApi, optiland_api
from .mtf import (
    AIMING_MAX_ITERATIONS,
    AIMING_MODE,
    AIMING_TOLERANCE_MM,
    CONVERGENCE_OFF_AXIS,
    CONVERGENCE_ON_AXIS,
    FATAL,
    REASONS,
    Curves,
    FieldProbe,
    MtfApi,
    MtfMeasure,
    MtfRequest,
    StepCurves,
    _numbers,
    _Quiet,
    _said,
    curves_at,
    field_coordinate,
    field_entry,
    judge_steps,
    largest_move,
    mtf_api,
)

METHOD_CLASS = "geometric-mtf"
"""The engine's name for the method of one line: the curves of optiland's ``GeometricMTF``."""

METHOD_SUM = "spot-landings-sum"
"""The engine's name for the method of several lines: the worker's sum of the landings optiland's class traced."""

GEOMETRIC_CLASS = "GeometricMTF"
"""The class of optiland the rays, and for one line the curves, are read from."""

DISTRIBUTION = "uniform"
"""optiland's name for the pupil distribution asked for: a square grid of ``num_rays`` a side, within the circle."""

NUM_POINTS = 2048
"""``num_points``: the samples of optiland's frequency axis, and one less than its bins across a spot. A step of the
class costs the square of it, 0.1 s; at 2049 bins a spot 0.5 mm wide is lowered by 2e-4 of its value at 50
cycles/mm, ``1 - sin(pi nu w) / (pi nu w)`` at a bin of 0.24 micrometres."""

SPOT_COORDINATES = "local"
"""The coordinates of optiland's spot: the image surface's own, which the class does not let a caller choose."""

MODULUS_ROUNDING = 1e-12
"""How far above 1 a modulus may lie and be 1: the modulus of a sum of unit vectors that all point one way, a spot
that is a point, is 1 to a rounding of the square root."""

GEOMETRIC_REASONS = {
    "bins": "frequency-beyond-bins",
    "empty": "no-rays",
    "flux": "no-flux",
}
"""The ``reason`` of a field that only this method has, beside ``mtf.REASONS``."""


# ── What optiland is asked, and what it gave ─────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class SpotStep:
    """What one call of optiland's geometric MTF gave for one field at one line, and the sums of its landings."""

    num_rays: int
    num_points: int
    axis: tuple[float, ...]
    """``freq``: cycles/mm, the same for both cuts."""
    tangential: tuple[float, ...]
    """``mtf[0][0]``: of the landings' y."""
    sagittal: tuple[float, ...]
    """``mtf[0][1]``: of the landings' x."""
    launched: int
    """The rays optiland traced: the points of its grid within the unit circle."""
    lit: int
    """The rays of its spot: those with an intensity above 0 on the image surface."""
    flux: float
    """The sum of the intensities of the rays of the spot."""
    extent_mm: tuple[float, float]
    """From the least landing to the greatest along x and along y: what optiland's bins of each cut span."""
    sums_tangential: tuple[complex, ...]
    """``landing_sums`` of the landings' y at the frequencies asked: the worker's, of optiland's rays."""
    sums_sagittal: tuple[complex, ...]
    """The same of the landings' x."""
    warnings: int = 0
    """How many warnings optiland issued in the call, numpy's of an invalid value apart."""


def top_frequency(frequencies: Sequence[float]) -> float:
    """``max_freq`` of a call: the largest frequency asked, or 1 cycle/mm where none is above 0."""
    largest = max(frequencies)
    return largest if largest > 0.0 else 1.0


def landing_sums(
    landings: Sequence[float], weights: Sequence[float], frequencies: Sequence[float]
) -> tuple[complex, ...]:
    """The sum of ``w exp(-2 pi i nu u)`` over rays that land at ``u`` with weight ``w``, at each frequency.

    About the origin of the coordinate, the axis point of the image plane. Each part is summed without a rounding
    of its own (``math.fsum``): at no frequency the sum is the sum of the weights, bit for bit.
    """
    sums = []
    for frequency in frequencies:
        turn = -2.0 * math.pi * frequency
        real = math.fsum(weight * math.cos(turn * at) for at, weight in zip(landings, weights, strict=True))
        imaginary = math.fsum(weight * math.sin(turn * at) for at, weight in zip(landings, weights, strict=True))
        sums.append(complex(real, imaginary))
    return tuple(sums)


def geometric_step(
    optic: Any,
    angle_deg: float,
    num_rays: int,
    frequencies: Sequence[float],
    api: OptilandApi | None = None,
    tools: MtfApi | None = None,
    num_points: int = NUM_POINTS,
) -> SpotStep:
    """One call of optiland's geometric MTF for the field of a ``field_optic``, and what it gave, read from it.

    What the object says it computed with is held to what was asked: the rays across the pupil and their
    distribution, the samples, the largest frequency, that nothing was multiplied in, the coordinates, the
    wavelength, the field, and one spot and two curves of ``num_points`` samples on an axis from 0 to that
    frequency. A ``BuildMismatch`` otherwise: an answer of another sampling is no answer to the request.
    """
    api = api if api is not None else optiland_api()
    tools = tools if tools is not None else mtf_api()
    coordinate = field_coordinate(angle_deg)
    top = top_frequency(frequencies)
    wavelength = float(optic.primary_wavelength)
    with _Quiet(api) as quiet:
        analysis = tools.GeometricMTF(
            optic,
            fields=[coordinate],
            wavelength="primary",
            num_rays=num_rays,
            distribution=DISTRIBUTION,
            num_points=num_points,
            max_freq=top,
            scale=False,
        )
        warned = quiet.count()
        # One row for each surface of optiland and one column for each ray of the trace the spot is of, its last.
        launched = int(api.np.asarray(optic.surfaces.intensity).shape[-1])

    def differs(what: str, built: Any, expected: Any) -> BuildMismatch:
        told = f"{what} is {built!r} in what optiland computed and {expected!r} asked"
        return BuildMismatch(f"the geometric MTF: {told}")

    said = (
        ("num_rays, the spot diagram's num_rings", int(analysis.num_rings), num_rays),
        ("the distribution", analysis.distribution, DISTRIBUTION),
        ("num_points", int(analysis.num_points), num_points),
        ("max_freq", float(analysis.max_freq), top),
        ("scale", analysis.scale, False),
        ("the factor its curves are multiplied by", _numbers(api, analysis.diff_limited_mtf), [1.0]),
        ("the coordinates of the spot", analysis.coordinates, SPOT_COORDINATES),
        ("the wavelengths in µm", [float(point.value) for point in analysis.wavelengths], [wavelength]),
        ("the field", [tuple(float(part) for part in point.coord) for point in analysis.fields], [coordinate]),
        ("the spots of each field", [len(spots) for spots in analysis.data], [1]),
        ("the curves of each field", [len(curves) for curves in analysis.mtf], [2]),
    )
    for what, built, expected in said:
        if built != expected:
            raise differs(what, built, expected)
    axis = tuple(_numbers(api, analysis.freq))
    tangential = tuple(_numbers(api, analysis.mtf[0][0]))
    sagittal = tuple(_numbers(api, analysis.mtf[0][1]))
    for what, values in (("freq", axis), ("the tangential curve", tangential), ("the sagittal curve", sagittal)):
        if len(values) != num_points:
            raise differs(f"the length of {what}", len(values), num_points)
    if (axis[0], axis[-1]) != (0.0, top):
        raise differs("the ends of freq", (axis[0], axis[-1]), (0.0, top))
    spot = analysis.data[0][0]
    x, y, intensity = (_numbers(api, part) for part in (spot.x, spot.y, spot.intensity))
    if not len(x) == len(y) == len(intensity) <= launched:
        raise differs("the rays of the spot in x, in y and in intensity", (len(x), len(y), len(intensity)), launched)
    return SpotStep(
        num_rays=num_rays,
        num_points=num_points,
        axis=axis,
        tangential=tangential,
        sagittal=sagittal,
        launched=launched,
        lit=len(x),
        flux=math.fsum(intensity),
        extent_mm=(max(x) - min(x), max(y) - min(y)) if x else (0.0, 0.0),
        sums_tangential=landing_sums(y, intensity, frequencies),
        sums_sagittal=landing_sums(x, intensity, frequencies),
        warnings=warned,
    )


# ── From what optiland gave to the curves of a field ─────────────────────────────────────────────────────────────


def _modulus(value: float) -> float:
    """A modulus that a rounding left above 1 is 1; any other value is itself."""
    return 1.0 if 1.0 < value <= 1.0 + MODULUS_ROUNDING else value


def class_curves(step: SpotStep, frequencies: Sequence[float]) -> Curves | str:
    """optiland's own curves of a step at ``frequencies``, by ``mtf.curves_at`` on the one axis of both cuts; or the
    reason it has for none."""
    tangential = tuple(_modulus(value) for value in step.tangential)
    sagittal = tuple(_modulus(value) for value in step.sagittal)
    binned = StepCurves(step.num_rays, step.num_points, step.axis, step.axis, tangential, sagittal, math.nan)
    return curves_at(binned, frequencies)


def sum_curves(steps: Sequence[SpotStep], weights: Sequence[float], count: int) -> Curves | str:
    """The modulus, at each of ``count`` frequencies, of the lines' sums added with their weights over their flux;
    or the reason for none.

    ``|sum of W_l S_l| / sum of W_l T_l`` for each cut, the module's convention. Every line must have rays of its
    own, a spectrum from which a line is missing being another spectrum: ``no-rays`` where a spot is empty,
    ``no-flux`` where the weighted flux is no number above 0, ``mtf-not-a-modulus`` where a value is none.
    """
    if any(step.lit == 0 for step in steps):
        return GEOMETRIC_REASONS["empty"]
    flux = math.fsum(weight * step.flux for weight, step in zip(weights, steps, strict=True))
    if not (math.isfinite(flux) and flux > 0.0):
        return GEOMETRIC_REASONS["flux"]
    curves: list[list[float]] = []
    for cut in ("sums_tangential", "sums_sagittal"):
        curve: list[float] = []
        for at in range(count):
            terms = [weight * getattr(step, cut)[at] for weight, step in zip(weights, steps, strict=True)]
            total = complex(math.fsum(term.real for term in terms), math.fsum(term.imag for term in terms))
            value = _modulus(abs(total) / flux)
            if not 0.0 <= value <= 1.0:
                return REASONS["values"]
            curve.append(value)
        curves.append(curve)
    return curves[0], curves[1]


def curves_of(
    steps: Sequence[SpotStep], weights: Sequence[float], frequencies: Sequence[float], band: float
) -> tuple[Curves | str, float | None]:
    """The curves of a field at one step of the ladder, or the reason for none; and how far optiland's own curve of
    a line lies from the modulus of the sum of that line's landings, the largest over the lines, where every line
    has both.

    Of one line the curves are optiland's own, whatever the line weighs, and there are none where one of their
    values lies further than ``band`` from the sum: the bins are too wide for that frequency. Of several lines the
    curves are the sum's.
    """
    count = len(frequencies)
    alone = [sum_curves([step], [1.0], count) for step in steps]
    own = [class_curves(step, frequencies) for step in steps]
    apart = [
        largest_move(sums, binned)[0]
        for sums, binned in zip(alone, own, strict=True)
        if not isinstance(sums, str) and not isinstance(binned, str)
    ]
    delta = max(apart) if len(apart) == len(steps) else None
    if len(steps) > 1:
        return sum_curves(steps, weights, count), delta
    (sums,), (binned,) = alone, own
    if isinstance(sums, str):
        return sums, None
    if isinstance(binned, str) or delta is None:
        return binned, None
    return (GEOMETRIC_REASONS["bins"] if delta > band else binned), delta


def bin_width(step: SpotStep, axis: int) -> float:
    """The width of one of optiland's bins across the spot of a step along x (0) or y (1), mm; NaN for no spot.

    numpy's rule: ``num_points + 1`` bins from the least landing to the greatest, and across one millimetre about
    a spot that is a point.
    """
    if step.lit == 0:
        return math.nan
    extent = step.extent_mm[axis]
    return (extent if extent > 0.0 else 1.0) / (step.num_points + 1)


def answer_field(
    asked: MtfRequest, case: dict[str, Any], angle_deg: float, measure: MtfMeasure
) -> tuple[dict[str, Any], list[str]]:
    """The entry of one field of a geometric answer, and what is noted of it for people.

    The field is probed at the first line asked, then every line is asked at the coarser step and at the finer. An
    exception of optiland ends it there, as for the FFT (``mtf.answer_field``), and the two steps are judged as
    the FFT's are (``mtf.judge_steps``). What is stated of the sampling is the finer step's, and of its first line
    where it is a line's.
    """
    count = len(asked.frequencies)
    sampling: dict[str, float] = {}
    probe: FieldProbe | None = None
    steps: list[list[SpotStep]] = []

    def entry(status: str, reason: str | None, curves: Curves | None) -> dict[str, Any]:
        return field_entry(angle_deg, probe, sampling, count, status, reason, curves)

    at = "its chief ray"
    try:
        probe = measure.field(case, asked.line, angle_deg)
        for rays in asked.ladder:
            at = f"{rays} rays"
            steps.append([measure.spot(case, line, angle_deg, rays, asked.frequencies) for line in asked.lines])
    except FATAL:
        raise
    except Exception as error:  # noqa: BLE001 - whatever optiland raises of one field is that field's status
        reason = f"{REASONS['raised']}-{type(error).__name__}"
        note = f"the field at {angle_deg!r} degrees: at {at} optiland raised {_said(error)}"
        return entry("unavailable", reason, None), [note]

    coarse, fine = steps
    first = fine[0]
    sampling.update(
        {
            "numRays": float(first.num_rays),
            "coarseNumRays": float(coarse[0].num_rays),
            "numPoints": float(first.num_points),
            "raysLaunched": float(first.launched),
            "raysLit": float(first.lit),
            "binWidthSagittalMm": bin_width(first, 0),
            "binWidthTangentialMm": bin_width(first, 1),
            "optilandWarnings": float(sum(step.warnings for step in (*coarse, *fine))),
        }
    )
    band = CONVERGENCE_ON_AXIS if angle_deg == 0.0 else CONVERGENCE_OFF_AXIS
    weights = [float(case["conditions"]["lines"][line]["weight"]) for line in asked.lines]
    coarser, _ = curves_of(coarse, weights, asked.frequencies, band)
    finer, apart = curves_of(fine, weights, asked.frequencies, band)
    if apart is not None:
        sampling["binningMaxDelta"] = apart
    return judge_steps(
        asked.frequencies, angle_deg, (coarse[0].num_rays, first.num_rays), coarser, finer, sampling, entry
    )


def method_params(asked: MtfRequest) -> dict[str, Any]:
    """The settings a geometric answer was computed with, by names of the engine's own."""
    several = len(asked.lines) > 1
    return {
        "class": GEOMETRIC_CLASS,
        "numRays": list(asked.ladder),
        "distribution": DISTRIBUTION,
        "numPoints": NUM_POINTS,
        "bins": NUM_POINTS + 1,
        "maxFrequency": "largest-asked",
        "scale": False,
        "spotCoordinates": SPOT_COORDINATES,
        "spotReference": "none",
        "lines": list(asked.lines),
        "curves": "worker-sum-of-optiland-landings" if several else "optiland",
        "transform": "sum-over-landings" if several else "sum-over-bin-centres",
        "rayWeight": "intensity" if several else "one-a-lit-ray",
        "polychromatic": "complex-sum-of-lines" if several else "one-line",
        "sumReference": "image-plane-axis-point",
        "modulusRounding": MODULUS_ROUNDING,
        "aiming": AIMING_MODE,
        "aimingMaxIterations": AIMING_MAX_ITERATIONS,
        "aimingTolerance": AIMING_TOLERANCE_MM,
        "pupil": "stop-surface-grid",
        "fieldType": "angle",
        "frame": "mirrored-in-y",
        "frequencyAxis": "linspace-to-largest-asked",
        "interpolation": "linear",
        "convergenceOnAxis": CONVERGENCE_ON_AXIS,
        "convergenceOffAxis": CONVERGENCE_OFF_AXIS,
    }


def describe(asked: MtfRequest, case: dict[str, Any]) -> tuple[dict[str, Any], list[dict[str, Any]], list[str]]:
    """Of a geometric answer: its method, the lines of the case it is of, and what is noted of them."""
    every = case["conditions"]["lines"]
    lines = [every[line] for line in asked.lines]
    notes = []
    if len(lines) > 1:
        notes.append(
            f"of the {len(lines)} lines of the case, summed by the worker as complex numbers with their weights: the "
            f"rays and their landings are optiland's {GEOMETRIC_CLASS}'s, a line a call, and the sum has no bins"
        )
    elif len(every) > 1:
        notes.append(f"of line {asked.line} of the case alone, {lines[0]['wavelengthNm']!r} nm")
    name = METHOD_SUM if len(lines) > 1 else METHOD_CLASS
    return {"name": name, "params": method_params(asked)}, lines, notes
