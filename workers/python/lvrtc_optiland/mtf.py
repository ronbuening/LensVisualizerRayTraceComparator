"""``mtf.native``: optiland's own FFT MTF of a case, one line, one field and one sampling at a time.

The curves are those of optiland's ``ScalarFFTMTF`` (``optiland/mtf/fft.py``), asked as anyone would ask it and
read from its own attributes: nothing of the transfer function is computed here. What is the worker's is what the
request needs around the class, and each of these is stated in the answer:

- **One field per call, and a new optic for every call.** optiland computes every field of a call before it gives
  any, and one field it cannot compute raises for all of them; so each field is asked alone, a field that raises is
  a row of the answer with the reason, and the others are what they would be alone. Each call has an optic of its
  own (``field_optic``): the aimer below keeps what it solved, and a number must not depend on what was asked
  before it.
- **The field** is an angle field of optiland at the angle of the spec, the only field of the optic, so its
  normalised coordinate is 1, without a vignetting factor. optiland's positive field angle is an object toward
  -y, the contract's one toward +y: the optic is the mirror image in y of the contract's, which changes no MTF
  of a system of revolution and the sign of where the chief ray lands, whose distance from the axis is what is
  reported. Finite objects are not answered: an angle of optiland is then measured at its paraxial entrance pupil,
  and no spec says where the contract's is. A spec that states its fields as fractions of an image height is
  answered only with the engine option ``fieldAnglesDeg``: the angle each fraction was resolved to by whoever
  knows the image height, one for each, in their order. A case states no image height, so the engine resolves
  none; the answer names each field as it was requested and states the angle it computed with.
- **The pupil** is the stop: ``ray_tracer.set_aiming("robust", max_iter=50, tol=1e-10)``, so optiland's grid of
  ``num_rays`` by ``num_rays`` normalised pupil coordinates is laid on the stop surface, out to the radius of that
  surface's own aperture (the case's clip radius of the stop), and every ray is clipped by every surface's
  aperture. Without aiming the grid would lie on the paraxial entrance pupil, which on a fast lens the real beam
  does not fill and off the axis is not where the beam is.
- **The reference sphere** is optiland's ``chief_ray`` strategy with ``remove_tilt=False``: centred where the
  chief ray, the ray through the centre of the stop, meets the image surface, with the distance to the paraxial
  exit pupil for its radius. That landing is reported for every field (``imageHeightMm``), traced by the call
  optiland's strategy makes.
- **The plane** is the image surface of the builder, at ``conditions.imageZ``, which ``verify_optic`` reads back:
  a best focus of LensVisualizer is a case with that plane. optiland has no focus search for an MTF.
- **The ladder.** ``num_rays`` 128 and then 256, each with ``grid_size`` twice that, stated to optiland: a call
  without a grid size takes ``num_rays`` for OpticStudio's sampling number and puts 64 rays across the pupil for
  128. The curves are those of the finer step, and a field whose values moved by more than the band between the
  two is "unconverged". The engine option ``fftRays`` 512 asks for 256 and 512 instead.
- **The frequencies.** optiland gives a curve at the lags of its grid, on an axis of its own for each cut
  (``freq_tang``, ``freq_sag``, cycles/mm on the image surface, the lag of one ray on the pupil), which it
  calibrates with the four rays through the edge of its pupil. A requested frequency is interpolated linearly
  between the two samples that enclose it, on the axis of its cut, and never beyond the last one, the cut-off.
- **One line.** optiland's class is of one wavelength and gives a modulus. A polychromatic MTF is the modulus of
  a sum of complex transfer functions, each referred to one image point; of the moduli of the lines, each about
  its own chief ray, it cannot be formed: the lateral colour and every phase between the lines are lost, and a
  mean of moduli is an upper bound that is no MTF. So a case of several lines is answered one line at a time
  (the engine option ``line``), and without one it is "unsupported".

What optiland could not compute is a field with a status and a reason of this module (``REASONS``), never a
number: an exception of optiland, an axis that is no axis (a rim ray that did not arrive leaves a NaN in its
step), a frequency beyond the axis, a value that is no modulus.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import bisect
import functools
import math
import time
import warnings
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any, Protocol

from lvrtc_worker_kit.ndarray import encode_ndarray

from .build import BuildMismatch, OptilandApi, build_optic, optiland_api, verify_optic
from .trace import IMAGE_PLANE_TOLERANCE_MM

MTF_NATIVE = "mtf.native"
"""The id of the quantity that is an engine's own MTF: what rung R5 records."""

METHOD_NAME = "scalar-fft-mtf"
"""The engine's name for its method: optiland's ``ScalarFFTMTF``."""

MTF_CLASS = "ScalarFFTMTF"
"""The class of optiland the curves are read from."""

LADDER: tuple[int, ...] = (128, 256, 512)
"""The values of ``num_rays`` the worker asks optiland with: the rays across the pupil."""

DEFAULT_RAYS = 256
"""The finer step of a request that states none: the ladder is 128 and then 256."""

GRID_FACTOR = 2
"""``grid_size`` over ``num_rays``: the pupil padded to twice its width, which holds its whole autocorrelation, so
that the last of the ``grid_size // 2`` samples optiland gives is the cut-off."""

RAYS_OPTION = "fftRays"
"""The engine option that names the finer step: 256, or 512 for the rows the comparator asks again."""

LINE_OPTION = "line"
"""The engine option that names the line of the case the MTF is of: its index in ``conditions.lines``."""

ANGLES_OPTION = "fieldAnglesDeg"
"""The engine option that states, for a spec whose fields are fractions of an image height, the angle of each in
degrees, in the order of the spec: what the run's MTF recipe resolved them to."""

AIMING_MODE = "robust"
AIMING_MAX_ITERATIONS = 50
AIMING_TOLERANCE_MM = 1e-10
"""optiland's ray aiming for its own analyses, as the plan fixed it: every pupil coordinate is a point of the stop
surface, met within this distance."""

REFERENCE_STRATEGY = "chief_ray"
"""optiland's name for the reference sphere the worker asks for: centred on the chief ray's landing."""

CONVERGENCE_ON_AXIS = 0.005
CONVERGENCE_OFF_AXIS = 0.01
"""How far a value may move from the coarser step to the finer before the field is "unconverged": the attention
band of the plan, on the axis and off it. The engine's own flag, which judges no other engine."""

LAUNCH_DIRECTION_TOLERANCE = 1e-12
"""How far the direction optiland launches the chief ray in may lie from the direction of the angle asked. It tells
a field that is another field (radians, another axis, another sign) from a rounding."""

REQUEST_BUDGET_S = 300.0
"""How long one request may have taken when its next field is begun. A request that is over it is answered as the
error ``time-budget`` and the worker lives on: the comparator kills a worker that has not answered within its wait
for a run, ten minutes, and does not start another within a run. A step of one field has been seen to take 45 s."""

UNSUPPORTED = {
    "profile": "profile",
    "geometric": "method.geometric",
    "engine_best": "focus.engine-best",
    "fractions": "fields.image-height-fractions",
    "rays": f"option.{RAYS_OPTION}",
    "line": f"option.{LINE_OPTION}",
    "angles": f"option.{ANGLES_OPTION}",
    "polychromatic": "lines.polychromatic",
    "finite": "object.finite",
}
"""The ``item`` of each refusal of the quantity, by what it is about."""

REASONS = {
    "raised": "optiland-raised",
    "axis": "no-frequency-axis",
    "beyond": "frequency-beyond-axis",
    "values": "mtf-not-a-modulus",
    "moved": "not-converged",
    "unknown": "convergence-unknown",
}
"""The ``reason`` of a field that is not "ok". ``optiland-raised`` is followed by the class of the exception."""

BAD_OPTION = "option"
FEATURE = "feature"

TIME_BUDGET = "time-budget"
"""The ``error.code`` of a request the worker gave up between two fields."""


class TimeBudgetExceeded(RuntimeError):
    """A request took longer than ``REQUEST_BUDGET_S`` before its last field was begun."""


# ── What is asked ────────────────────────────────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class MtfRequest:
    """An ``mtf.native`` request the engine answers, as numbers."""

    frequencies: tuple[float, ...]
    """Cycles/mm, ascending."""
    angles: tuple[float, ...]
    """The fields, degrees, in the order of the spec."""
    line: int
    """The index of the line of the case."""
    ladder: tuple[int, int]
    """``num_rays`` of the coarser and of the finer step."""
    fractions: tuple[float, ...] = ()
    """For a spec that states its fields as fractions of an image height: those fractions, which ``angles`` were
    given for (``ANGLES_OPTION``) and which the answer names its fields by. Empty for a spec of angles."""


def _item(code: str, name: str, message: str) -> dict[str, str]:
    return {"code": code, "item": UNSUPPORTED[name], "message": message}


def _whole(value: Any) -> bool:
    """Whether a value of an option is a whole number, as JSON has it: an int, and no boolean."""
    return isinstance(value, int) and not isinstance(value, bool)


def read_request(
    spec: dict[str, Any], options: dict[str, Any], case: dict[str, Any]
) -> MtfRequest | list[dict[str, str]]:
    """What a schema-valid spec asks, or every reason why the engine has no answer to it, as unsupported items.

    Decided from the spec, the engine's options and the case, before anything is built. An option that is not the
    engine's is another engine's and is not read.
    """
    refused: list[dict[str, str]] = []
    if "profile" in spec:
        message = f"the engine has no profile {spec['profile']}: it is asked by a spec"
        refused.append(_item(BAD_OPTION, "profile", message))
    if spec["method"] != "diffraction":
        message = f"the engine answers with optiland's {MTF_CLASS}, a diffraction MTF, and with no other"
        refused.append(_item(BAD_OPTION, "geometric", message))
    if spec["focus"] != "design":
        message = "optiland has no focus search for an MTF: the plane is the image plane of the case"
        refused.append(_item(BAD_OPTION, "engine_best", message))
    stated = spec["fields"]["values"]
    angles = stated
    fractions = spec["fields"]["kind"] != "angles-deg"
    if fractions:
        angles = options.get(ANGLES_OPTION)
        if angles is None:
            message = (
                "a case states no image height a fraction could be of: state the fields as angles, or give the "
                f"angle of each fraction with the engine option {ANGLES_OPTION}"
            )
            refused.append(_item(BAD_OPTION, "fractions", message))
        elif not (
            isinstance(angles, list)
            and len(angles) == len(stated)
            and all(isinstance(angle, (int, float)) and not isinstance(angle, bool) for angle in angles)
            and all(math.isfinite(angle) for angle in angles)
        ):
            message = (
                f"the option {ANGLES_OPTION} is one angle in degrees for each of the {len(stated)} fields of the "
                f"spec; got {angles!r}"
            )
            refused.append(_item(BAD_OPTION, "angles", message))

    rays = options.get(RAYS_OPTION, DEFAULT_RAYS)
    if not _whole(rays) or rays not in LADDER[1:]:
        allowed = " or ".join(str(step) for step in LADDER[1:])
        message = f"the option {RAYS_OPTION} is {allowed}, the finer step; got {rays!r}"
        refused.append(_item(BAD_OPTION, "rays", message))

    lines = case["conditions"]["lines"]
    line = options.get(LINE_OPTION)
    if line is not None and not (_whole(line) and 0 <= line < len(lines)):
        message = f"the option {LINE_OPTION} is the index of a line of the case, 0 to {len(lines) - 1}; got {line!r}"
        refused.append(_item(BAD_OPTION, "line", message))
    elif line is None and len(lines) > 1:
        message = (
            f"the case has {len(lines)} lines and optiland's {MTF_CLASS} is of one wavelength and gives a modulus: "
            f"no polychromatic MTF is formed of moduli. Ask one line with the engine option {LINE_OPTION}"
        )
        refused.append(_item(FEATURE, "polychromatic", message))

    if case["conditions"]["object"]["kind"] != "infinity":
        message = (
            "the object is finite: optiland measures a field angle at its paraxial entrance pupil then, and no spec "
            "says where the contract's is measured"
        )
        refused.append(_item(FEATURE, "finite", message))
    if refused:
        return refused
    return MtfRequest(
        frequencies=tuple(float(frequency) for frequency in spec["frequenciesPerMm"]),
        angles=tuple(float(angle) for angle in angles),
        fractions=tuple(float(field) for field in stated) if fractions else (),
        line=0 if line is None else int(line),
        ladder=(LADDER[LADDER.index(rays) - 1], int(rays)),
    )


# ── What optiland is asked, and what it gave ─────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class FieldProbe:
    """What optiland says of one field before any MTF: its chief ray, and the four rays through the rim of the stop."""

    angle_deg: float
    """The field angle optiland holds, degrees, in the contract's sense."""
    image_height_mm: float | None
    """How far from the axis the chief ray lands on the image plane; None where it has no landing."""
    rim_rays_lit: int
    """How many of the four rim rays reach the image with an intensity above 0: optiland's own measure of a ray it
    counts. A rim ray lies on the edge of the stop within the aimer's tolerance and may be clipped there by a
    rounding."""
    rim_rays_lost: int
    """How many of the four have no landing or no direction: optiland's frequency step of that cut is then a NaN."""
    rim_spread_mm: float | None
    """The largest distance on the image plane from the chief ray's landing to a rim ray's; None without two
    landings. optiland calibrates its frequency axes with the rim rays whatever became of them: a ray that an
    aperture stopped is traced on through the mathematical surfaces, and a path that leaves the lens shows here."""


@dataclass(frozen=True)
class StepCurves:
    """What one call of optiland's FFT MTF gave for one field, as it gave it."""

    num_rays: int
    grid_size: int
    tangential_axis: tuple[float, ...]
    """``freq_tang`` of the field: cycles/mm, for frequency along image y."""
    sagittal_axis: tuple[float, ...]
    """``freq_sag`` of the field: cycles/mm, for frequency along image x."""
    tangential: tuple[float, ...]
    """``mtf[0][0]``."""
    sagittal: tuple[float, ...]
    """``mtf[0][1]``."""
    working_f_number: float
    """``FNO[0]``: optiland's working f-number of the field."""
    warnings: int = 0
    """How many warnings optiland issued in the call, numpy's of an invalid value apart."""


class MtfMeasure(Protocol):
    """What an answer asks of optiland. ``OptilandMtf`` is the one that asks it; a test may stand in."""

    def aperture(self, case: dict[str, Any], line: int) -> tuple[dict[str, float], list[str]]: ...

    def field(self, case: dict[str, Any], line: int, angle_deg: float) -> FieldProbe: ...

    def step(self, case: dict[str, Any], line: int, angle_deg: float, num_rays: int) -> StepCurves: ...


@dataclass(frozen=True)
class MtfApi:
    """What the worker uses of optiland for an MTF, beside what the builder uses."""

    ScalarFFTMTF: Any
    get_working_FNO: Any
    get_stop_radius_strategy: Any


@functools.lru_cache(maxsize=1)
def mtf_api() -> MtfApi:
    """Imports optiland's MTF. ``hygiene.prepare`` must have run: the import loads matplotlib and numba."""
    from optiland.mtf import ScalarFFTMTF  # noqa: PLC0415 - not before the worker's hygiene
    from optiland.rays.ray_aiming.initialization import get_stop_radius_strategy  # noqa: PLC0415
    from optiland.utils import get_working_FNO  # noqa: PLC0415

    return MtfApi(
        ScalarFFTMTF=ScalarFFTMTF,
        get_working_FNO=get_working_FNO,
        get_stop_radius_strategy=get_stop_radius_strategy,
    )


def _mismatch(what: str, built: Any, expected: Any) -> BuildMismatch:
    return BuildMismatch(f"the field of the MTF: {what} is {built!r} in what optiland holds and {expected!r} asked")


def _hold(what: str, built: Any, expected: Any) -> None:
    same = type(built) is type(expected) and built == expected
    if not same:
        raise _mismatch(what, built, expected)


def set_field(optic: Any, angle_deg: float) -> None:
    """Gives a built optic the one field of an MTF and the aiming of the worker's analyses. Not verified."""
    with warnings.catch_warnings():
        # optiland attributes a deprecation to its caller, which is this module.
        warnings.filterwarnings("error", category=DeprecationWarning, module=r"lvrtc_optiland\.")
        optic.fields.remove(0)
        optic.fields.add(y=float(angle_deg))
        optic.ray_tracer.set_aiming(AIMING_MODE, max_iter=AIMING_MAX_ITERATIONS, tol=AIMING_TOLERANCE_MM)


def field_coordinate(angle_deg: float) -> tuple[float, float]:
    """The normalised coordinates of the one field of an optic: optiland divides each field by the largest."""
    if angle_deg == 0.0:
        return (0.0, 0.0)
    return (0.0, math.copysign(1.0, angle_deg))


def verify_field(optic: Any, case: dict[str, Any], angle_deg: float, tools: MtfApi | None = None) -> None:
    """Holds what ``set_field`` added to an optic to what was asked. Raises a ``BuildMismatch`` for what differs.

    Read back from optiland's own objects: that the optic has one field, of the type ``AngleField``, at the angle
    asked along y and at 0 along x, without a vignetting factor and of weight 1, whose normalised coordinate is
    what an analysis is then asked with; that the object space is not telecentric; that the tracer's aiming is the
    worker's, mode and both settings; that the radius optiland's aimer takes for the stop is the case's clip
    radius of the stop surface, which is where its pupil coordinate 1 lies; and that nothing weights or polarises
    the pupil.
    """
    tools = tools if tools is not None else mtf_api()
    fields = optic.fields
    _hold("the number of fields", int(fields.num_fields), 1)
    _hold("the type of the field", type(fields.field_definition).__name__, "AngleField")
    held = fields.fields[0]
    _hold("the field angle along y, degrees", float(held.y), float(angle_deg))
    _hold("the field angle along x, degrees", float(held.x), 0.0)
    _hold("the vignetting factors", (float(held.vx), float(held.vy)), (0.0, 0.0))
    _hold("the weight", float(held.weight), 1.0)
    coordinates = [(float(x), float(y)) for x, y in fields.get_field_coords()]
    _hold("the normalised field", coordinates, [field_coordinate(angle_deg)])
    _hold("telecentric", bool(fields.telecentric) or bool(optic.obj_space_telecentric), False)
    aiming = {"mode": AIMING_MODE, "max_iter": AIMING_MAX_ITERATIONS, "tol": AIMING_TOLERANCE_MM}
    _hold("the ray aiming", dict(optic.ray_tracer.ray_aiming_config), aiming)
    system = case["system"]
    clip = float(system["surfaces"][system["stopIndex"]]["aperture"]["semiDiameter"])
    aimed = float(tools.get_stop_radius_strategy(optic, AIMING_MODE).calculate_stop_radius())
    _hold("the radius of the stop the rays are aimed at, mm", aimed, clip)
    _hold("the polarization", optic.polarization_state, None)
    _hold("the apodization", optic.apodization, None)


def field_optic(
    case: dict[str, Any], line: int, angle_deg: float, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> Any:
    """A new optic of a case at one line whose one field is ``angle_deg``, verified: the builder's, and the field.

    optiland's angle is given the angle of the spec as it is. Its positive angle is an object toward -y, so the
    optic is the contract's system seen mirrored in y (the module's documentation).
    """
    api = api if api is not None else optiland_api()
    optic = build_optic(case, line, api)
    verify_optic(optic, case, line, api)
    set_field(optic, angle_deg)
    verify_field(optic, case, angle_deg, tools)
    return optic


def _numbers(api: OptilandApi, values: Any) -> list[float]:
    """An array of optiland as floats."""
    return [float(value) for value in api.np.asarray(values, dtype=api.np.float64).ravel()]


class _Quiet:
    """optiland called with numpy's warnings of an invalid value silenced, its own counted, a deprecation an error."""

    def __init__(self, api: OptilandApi) -> None:
        self._errstate = api.np.errstate(all="ignore")
        self._catch = warnings.catch_warnings(record=True)
        self.caught: list[warnings.WarningMessage] = []

    def __enter__(self) -> _Quiet:
        self._errstate.__enter__()
        self.caught = self._catch.__enter__() or []
        warnings.simplefilter("always")
        warnings.filterwarnings("error", category=DeprecationWarning, module=r"lvrtc_optiland\.")
        return self

    def __exit__(self, *exc: object) -> None:
        self._catch.__exit__(*exc)
        self._errstate.__exit__(*exc)

    def count(self) -> int:
        """The warnings that are optiland's own word: every one but numpy's of an invalid value."""
        return sum(1 for warning in self.caught if not issubclass(warning.category, RuntimeWarning))


RIM_PUPIL: tuple[tuple[float, float], ...] = ((1.0, 0.0), (-1.0, 0.0), (0.0, 1.0), (0.0, -1.0))
"""The pupil coordinates of the four rim rays, as optiland's frequency calibration and working f-number take them."""


def _rim_rays(optic: Any, coordinate: tuple[float, float], api: OptilandApi) -> Any:
    np = api.np
    px = np.array([point[0] for point in RIM_PUPIL])
    py = np.array([point[1] for point in RIM_PUPIL])
    return optic.trace_generic(coordinate[0], coordinate[1], Px=px, Py=py, wavelength=optic.primary_wavelength)


def probe_field(optic: Any, case: dict[str, Any], angle_deg: float, api: OptilandApi | None = None) -> FieldProbe:
    """What optiland makes of the field of a ``field_optic``: its chief ray, and the four rim rays.

    The chief ray is generated and traced by the calls optiland's reference strategy makes, at pupil (0, 0). Its
    launch direction is held to the direction of the angle, (0, sin, cos) in optiland's frame, and the aimer that
    made it to the one asked for: a ``BuildMismatch`` otherwise. Its landing is on the image plane of the case.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    coordinate = field_coordinate(angle_deg)
    wavelength = optic.primary_wavelength
    with _Quiet(api):
        launch = optic.ray_tracer.ray_generator.generate_rays(*coordinate, 0.0, 0.0, wavelength)
        direction = tuple(_numbers(api, part)[0] for part in (launch.L, launch.M, launch.N))
        aimer = type(optic.ray_tracer.ray_generator.aimer).__name__
        chief = optic.trace_generic(*coordinate, Px=0.0, Py=0.0, wavelength=wavelength)
        landing = tuple(_numbers(api, part)[0] for part in (chief.x, chief.y, chief.z))
        rim = _rim_rays(optic, coordinate, api)
        rim_xy = list(zip(_numbers(api, rim.x), _numbers(api, rim.y), strict=True))
        rim_parts = [np.asarray(part, dtype=np.float64) for part in (rim.x, rim.y, rim.L, rim.M)]
        rim_finite = np.isfinite(np.stack(rim_parts))
        rim_lit = int(np.count_nonzero(np.asarray(rim.i, dtype=np.float64) > 0))

    _hold("the aimer that launched the chief ray", aimer, "RobustRayAimer")
    radians = math.radians(angle_deg)
    expected = (0.0, math.sin(radians), math.cos(radians))
    if not all(abs(got - want) <= LAUNCH_DIRECTION_TOLERANCE for got, want in zip(direction, expected, strict=True)):
        raise _mismatch("the direction the chief ray is launched in", direction, expected)

    arrived = all(math.isfinite(value) for value in landing)
    if arrived and abs(landing[2] - float(case["conditions"]["imageZ"])) > IMAGE_PLANE_TOLERANCE_MM:
        raise _mismatch("the z of the chief ray's landing, mm", landing[2], float(case["conditions"]["imageZ"]))
    present = [bool(np.all(rim_finite[:, at])) for at in range(len(RIM_PUPIL))]
    apart = [math.hypot(x - landing[0], y - landing[1]) for (x, y), there in zip(rim_xy, present, strict=True) if there]
    return FieldProbe(
        angle_deg=float(optic.fields.fields[0].y),
        image_height_mm=math.hypot(landing[0], landing[1]) if arrived else None,
        rim_rays_lit=rim_lit,
        rim_rays_lost=present.count(False),
        rim_spread_mm=max(apart) if arrived and apart else None,
    )


def fft_step(
    optic: Any, angle_deg: float, num_rays: int, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> StepCurves:
    """One call of optiland's FFT MTF for the field of a ``field_optic``, and what it gave, read from the object.

    What the object says it computed with is held to what was asked: the rays across the pupil and the grid, the
    wavelength, the field, the reference strategy, and one curve of ``grid_size // 2`` samples on each axis. A
    ``BuildMismatch`` otherwise: an answer of another sampling is no answer to the request.
    """
    api = api if api is not None else optiland_api()
    tools = tools if tools is not None else mtf_api()
    coordinate = field_coordinate(angle_deg)
    grid = GRID_FACTOR * num_rays
    with _Quiet(api) as quiet:
        analysis = tools.ScalarFFTMTF(
            optic,
            fields=[coordinate],
            wavelength="primary",
            num_rays=num_rays,
            grid_size=grid,
            strategy=REFERENCE_STRATEGY,
            remove_tilt=False,
        )
        warned = quiet.count()

    def differs(what: str, built: Any, expected: Any) -> BuildMismatch:
        return BuildMismatch(f"the FFT MTF: {what} is {built!r} in what optiland computed and {expected!r} asked")

    said = (
        ("num_rays", int(analysis.num_rays), num_rays),
        ("grid_size", int(analysis.grid_size), grid),
        ("the wavelength in µm", float(analysis.resolved_wavelength), float(optic.primary_wavelength)),
        ("the field", [tuple(float(part) for part in field) for field in analysis.resolved_fields], [coordinate]),
        ("the reference strategy", analysis.strategy, REFERENCE_STRATEGY),
        ("remove_tilt", analysis.remove_tilt, False),
        ("the number of fields with curves", len(analysis.mtf), 1),
    )
    for what, built, expected in said:
        if built != expected:
            raise differs(what, built, expected)
    curves = StepCurves(
        num_rays=num_rays,
        grid_size=grid,
        tangential_axis=tuple(_numbers(api, analysis.freq_tang[0])),
        sagittal_axis=tuple(_numbers(api, analysis.freq_sag[0])),
        tangential=tuple(_numbers(api, analysis.mtf[0][0])),
        sagittal=tuple(_numbers(api, analysis.mtf[0][1])),
        working_f_number=_numbers(api, analysis.FNO[0])[0],
        warnings=warned,
    )
    for what, values in (
        ("freq_tang", curves.tangential_axis),
        ("freq_sag", curves.sagittal_axis),
        ("the tangential curve", curves.tangential),
        ("the sagittal curve", curves.sagittal),
    ):
        if len(values) != grid // 2:
            raise differs(f"the length of {what}", len(values), grid // 2)
    return curves


def axial_aperture(
    case: dict[str, Any], line: int, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> dict[str, float]:
    """What optiland traced of the axial beam of a case at one line: the ``aperture`` of an answer.

    - ``tracedFNumber``: optiland's ``get_working_FNO`` on the axis, from the four rays through the rim of the stop.
    - ``limitingSurfaceIndex``: the first surface of the case at which one of those four loses its light, the stop
      apart, where a ray on the very edge may be clipped by a rounding; the stop's own index where none does. The
      f-number is of the rim of the stop either way.
    - ``aimedStopRadiusMm``: the radius of the stop surface optiland's pupil coordinate 1 is aimed at.
    """
    api = api if api is not None else optiland_api()
    tools = tools if tools is not None else mtf_api()
    np = api.np
    optic = field_optic(case, line, 0.0, api, tools)
    stop = int(case["system"]["stopIndex"])
    with _Quiet(api):
        f_number = _numbers(api, tools.get_working_FNO(optic, (0.0, 0.0), optic.primary_wavelength))[0]
        _rim_rays(optic, (0.0, 0.0), api)
        # One row for each surface of optiland, the object surface first, and one column for each rim ray.
        lit = np.asarray(optic.surfaces.intensity, dtype=np.float64) > 0
    clipped = [int(np.argmin(lit[:, ray])) - 1 for ray in range(lit.shape[1]) if not bool(np.all(lit[:, ray]))]
    elsewhere = [surface for surface in clipped if surface != stop and 0 <= surface < len(case["system"]["surfaces"])]
    aimed = float(tools.get_stop_radius_strategy(optic, AIMING_MODE).calculate_stop_radius())
    measured = {
        "tracedFNumber": f_number,
        "limitingSurfaceIndex": float(min(elsewhere) if elsewhere else stop),
        "aimedStopRadiusMm": aimed,
    }
    return {name: value for name, value in measured.items() if math.isfinite(value)}


FATAL: tuple[type[BaseException], ...] = (BuildMismatch, MemoryError, ImportError)
"""What is never a field's status: an optic or an analysis that is not what was asked, which is the request's
error; and a machine or an installation that cannot compute, which is the engine's failure."""


def _said(error: BaseException) -> str:
    """An exception as one line of a note: its class and what it says, cut at 200 characters."""
    text = " ".join(str(error).split())
    return f"{type(error).__name__}: {text[:200]}"


class OptilandMtf:
    """The measure that asks optiland. Making one imports optiland's MTF: a failure of that is no field's."""

    def __init__(self, api: OptilandApi | None = None, tools: MtfApi | None = None) -> None:
        self._api = api if api is not None else optiland_api()
        self._tools = tools if tools is not None else mtf_api()

    def aperture(self, case: dict[str, Any], line: int) -> tuple[dict[str, float], list[str]]:
        """The ``aperture`` of an answer, and what to note where optiland could not trace the axial beam."""
        try:
            return axial_aperture(case, line, self._api, self._tools), []
        except FATAL:
            raise
        except Exception as error:  # noqa: BLE001 - whatever optiland raises of a beam is said, and no field's
            return {}, [f"the axial beam: optiland raised {_said(error)}"]

    def field(self, case: dict[str, Any], line: int, angle_deg: float) -> FieldProbe:
        optic = field_optic(case, line, angle_deg, self._api, self._tools)
        return probe_field(optic, case, angle_deg, self._api)

    def step(self, case: dict[str, Any], line: int, angle_deg: float, num_rays: int) -> StepCurves:
        optic = field_optic(case, line, angle_deg, self._api, self._tools)
        return fft_step(optic, angle_deg, num_rays, self._api, self._tools)


# ── From optiland's samples to the frequencies asked ─────────────────────────────────────────────────────────────


def axis_is_usable(axis: Sequence[float]) -> bool:
    """Whether a frequency axis of optiland is one: numbers that start at 0 and ascend."""
    if len(axis) < 2 or axis[0] != 0.0 or not all(math.isfinite(value) for value in axis):
        return False
    return all(axis[at] > axis[at - 1] for at in range(1, len(axis)))


def interpolate(axis: Sequence[float], values: Sequence[float], frequency: float) -> float | None:
    """The value at ``frequency`` between the two samples of ``axis`` that enclose it, linearly; None outside.

    A frequency that is a sample of the axis has that sample's value, bit for bit, and a value never leaves the
    range of the two it lies between. Beyond the last sample there is no value: nothing is extrapolated.
    """
    if not axis[0] <= frequency <= axis[-1]:
        return None
    upper = bisect.bisect_left(axis, frequency)
    if axis[upper] == frequency:
        return values[upper]
    low, high = values[upper - 1], values[upper]
    share = (frequency - axis[upper - 1]) / (axis[upper] - axis[upper - 1])
    return min(max(low + share * (high - low), min(low, high)), max(low, high))


def curves_at(step: StepCurves, frequencies: Sequence[float]) -> tuple[list[float], list[float]] | str:
    """The tangential and the sagittal curve of a step at ``frequencies``, each on its own axis; or the reason.

    The reasons, in this order: an axis that is none; a frequency beyond the last sample of an axis; a sample that
    is no modulus, a NaN or a number outside 0 to 1, among the two a frequency lies between. No other sample of a
    curve is read.
    """
    cuts = ((step.tangential_axis, step.tangential), (step.sagittal_axis, step.sagittal))
    if not all(axis_is_usable(axis) and len(values) == len(axis) for axis, values in cuts):
        return REASONS["axis"]
    if any(not axis[0] <= frequency <= axis[-1] for axis, _ in cuts for frequency in frequencies):
        return REASONS["beyond"]
    curves: list[list[float]] = []
    for axis, values in cuts:
        curve: list[float] = []
        for frequency in frequencies:
            upper = bisect.bisect_left(axis, frequency)
            read = values[upper : upper + 1] if axis[upper] == frequency else values[upper - 1 : upper + 1]
            value = interpolate(axis, values, frequency)
            if value is None or not all(0.0 <= sample <= 1.0 for sample in read):
                return REASONS["values"]
            curve.append(value)
        curves.append(curve)
    return curves[0], curves[1]


def largest_move(
    coarse: tuple[list[float], list[float]], fine: tuple[list[float], list[float]]
) -> tuple[float, int, int]:
    """How far the curves moved from one step to the next: the largest difference, its cut (0 tangential, 1
    sagittal) and the index of its frequency; the first on a tie."""
    worst = (0.0, 0, 0)
    for cut in (0, 1):
        for at, (before, after) in enumerate(zip(coarse[cut], fine[cut], strict=True)):
            if abs(after - before) > worst[0]:
                worst = (abs(after - before), cut, at)
    return worst


def _curve(values: Sequence[float]) -> dict[str, Any]:
    return encode_ndarray("f8", [math.nan if value != value else value + 0.0 for value in values], [len(values)])


def answer_field(
    asked: MtfRequest, case: dict[str, Any], angle_deg: float, measure: MtfMeasure, stated: float | None = None
) -> tuple[dict[str, Any], list[str]]:
    """The entry of one field of an answer, and what is noted of it for people.

    The field is probed, then asked at the coarser step and at the finer. An exception of optiland ends it there:
    the field is "unavailable" with the class of the exception in its reason, and where the chief ray landed is
    still said if that was found. The curves are the finer step's. A field whose finer step has none is
    "unavailable"; one whose coarser step has none is "unconverged", nothing saying that it settled; one that
    moved by more than the band between the steps is "unconverged". ``FATAL`` exceptions are not a field's.
    ``stated`` is the field as the spec states it, where that is no angle: the entry is named by it.
    """
    count = len(asked.frequencies)
    named = f"the field at {angle_deg!r} degrees"
    sampling: dict[str, float] = {}
    probe: FieldProbe | None = None
    steps: list[StepCurves] = []

    def entry(status: str, reason: str | None, curves: tuple[list[float], list[float]] | None) -> dict[str, Any]:
        blank = [math.nan] * count
        field: dict[str, Any] = {
            "field": angle_deg if stated is None else stated,
            "fieldAngleDeg": None if probe is None else probe.angle_deg,
            "imageHeightMm": None if probe is None else probe.image_height_mm,
            "sagittal": _curve(blank if curves is None else curves[1]),
            "tangential": _curve(blank if curves is None else curves[0]),
            "status": status,
            "sampling": {name: value for name, value in sampling.items() if math.isfinite(value)},
        }
        if reason is not None:
            field["reason"] = reason
        return field

    at = "its chief ray"
    try:
        probe = measure.field(case, asked.line, angle_deg)
        sampling["rimRaysLit"] = float(probe.rim_rays_lit)
        sampling["rimRaysLost"] = float(probe.rim_rays_lost)
        if probe.rim_spread_mm is not None:
            sampling["rimLandingSpreadMm"] = probe.rim_spread_mm
        for rays in asked.ladder:
            at = f"{rays} rays"
            steps.append(measure.step(case, asked.line, angle_deg, rays))
    except FATAL:
        raise
    except Exception as error:  # noqa: BLE001 - whatever optiland raises of one field is that field's status
        reason = f"{REASONS['raised']}-{type(error).__name__}"
        return entry("unavailable", reason, None), [f"{named}: at {at} optiland raised {_said(error)}"]

    coarse, fine = steps
    sampling.update(
        {
            "numRays": float(fine.num_rays),
            "gridSize": float(fine.grid_size),
            "coarseNumRays": float(coarse.num_rays),
            "workingFNumber": fine.working_f_number,
            "optilandWarnings": float(coarse.warnings + fine.warnings),
        }
    )
    for name, axis in (("Tangential", fine.tangential_axis), ("Sagittal", fine.sagittal_axis)):
        if len(axis) > 1:
            sampling[f"frequencyStep{name}PerMm"] = axis[1] - axis[0]
    finer = curves_at(fine, asked.frequencies)
    if isinstance(finer, str):
        return entry("unavailable", finer, None), [f"{named}: {finer} at {fine.num_rays} rays"]
    coarser = curves_at(coarse, asked.frequencies)
    if isinstance(coarser, str):
        note = f"{named}: {coarser} at {coarse.num_rays} rays, so nothing says that {fine.num_rays} rays settled"
        return entry("unconverged", REASONS["unknown"], finer), [note]
    moved, cut, where = largest_move(coarser, finer)
    sampling["maxDelta"] = moved
    band = CONVERGENCE_ON_AXIS if angle_deg == 0.0 else CONVERGENCE_OFF_AXIS
    if moved <= band:
        return entry("ok", None, finer), []
    cut_name = ("tangential", "sagittal")[cut]
    note = (
        f"{named}: the {cut_name} MTF at {asked.frequencies[where]!r} cycles/mm is {coarser[cut][where]!r} at "
        f"{coarse.num_rays} rays and {finer[cut][where]!r} at {fine.num_rays}, further apart than {band!r}"
    )
    return entry("unconverged", REASONS["moved"], finer), [note]


def method_params(asked: MtfRequest) -> dict[str, Any]:
    """The settings an answer was computed with, by names of the engine's own."""
    return {
        "class": MTF_CLASS,
        "numRays": list(asked.ladder),
        "gridFactor": GRID_FACTOR,
        "line": asked.line,
        "referenceSphere": REFERENCE_STRATEGY,
        "removeTilt": False,
        "aiming": AIMING_MODE,
        "aimingMaxIterations": AIMING_MAX_ITERATIONS,
        "aimingTolerance": AIMING_TOLERANCE_MM,
        "pupil": "stop-surface-grid",
        "fieldType": "angle",
        "frame": "mirrored-in-y",
        "frequencyAxes": "freq_tang-and-freq_sag",
        "interpolation": "linear",
        "polychromatic": "one-line",
        "convergenceOnAxis": CONVERGENCE_ON_AXIS,
        "convergenceOffAxis": CONVERGENCE_OFF_AXIS,
    }


def answer_mtf(
    asked: MtfRequest,
    case: dict[str, Any],
    measure: MtfMeasure,
    clock: Callable[[], float] = time.monotonic,
) -> tuple[dict[str, Any], list[float]]:
    """``mtf.native`` of a case as optiland computes it, and what each field cost in seconds, which is no part of it.

    The axial beam is asked first, so that an optic that is not the case is found before any field. Raises a
    ``TimeBudgetExceeded`` where the request has taken ``REQUEST_BUDGET_S`` when a field is to be begun.
    """
    started = clock()
    aperture, notes = measure.aperture(case, asked.line)
    notes = list(notes)
    fields: list[dict[str, Any]] = []
    seconds: list[float] = []
    for number, angle_deg in enumerate(asked.angles):
        begun = clock()
        if begun - started > REQUEST_BUDGET_S:
            raise TimeBudgetExceeded(
                f"the request had taken {begun - started:.0f} s when field {number} of {len(asked.angles)} was to be "
                f"begun, and {REQUEST_BUDGET_S:.0f} s are its budget: ask fewer fields at once"
            )
        field, noted = answer_field(asked, case, angle_deg, measure, asked.fractions[number] if asked.fractions else None)
        fields.append(field)
        notes.extend(noted)
        seconds.append(clock() - begun)
    line = case["conditions"]["lines"][asked.line]
    if len(case["conditions"]["lines"]) > 1:
        notes.append(f"of line {asked.line} of the case alone, {line['wavelengthNm']!r} nm: no polychromatic MTF")
    data = {
        "fields": fields,
        "method": {"name": METHOD_NAME, "params": method_params(asked)},
        "focus": {"mode": "design", "appliedShiftMm": 0},
        "aperture": aperture,
        "lines": [{"wavelengthNm": line["wavelengthNm"], "weight": line["weight"]}],
        "notes": notes,
    }
    return data, seconds


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many fields of an answer have each status."""
    statuses = [field["status"] for field in data["fields"]]
    return {"fields": len(statuses), **{name: statuses.count(name) for name in ("ok", "unconverged", "unavailable")}}
