"""``axial.native``: optiland's own rays along the axis of a case, aimed at the real stop at each line, and its paraxial
focus there.

optiland has no analysis of spherical aberration or of axial colour by real rays: what it has of them is its own ray
aimer, its own real tracer, one optic for each line, and its own paraxial focus. The worker asks each and reads what
optiland holds; nothing of a figure is computed here. The comparator forms the figures of the rays with its own
estimator (``src/estimators/axialIntercept.ts``), as it does of every engine's rays.

- **One optic a line, each aiming its own rays.** Each line of the request has an optic of its own
  (``mtf.field_optic``: the builder's, verified, whose one field is an angle field on the axis) under the worker's
  aiming, ``set_aiming("robust", max_iter=50, tol=1e-10)``. Its ray generator is asked once, at the line's own
  wavelength and indices, for one ray a signed fraction f of the request, aimed at the point (0, f R) of the stop
  surface, R the case's stop radius (``conditions.stopSemiDiameter``), and those rays are traced through the same
  optic (``trace.record``, ``trace.settle``, optiland's own tracer as ``rays.trace`` has it). No ray of one line's
  optic is traced at another line: LensVisualizer's sections aim each zone at its point of the real stop, and each
  colour channel at its own indices (LensVisualizer #927, #930). A new optic a line also keeps a number from depending
  on what an aimer solved before: optiland's robust aimer keeps a map of the pupil for each field and wavelength.
- **The radius the fractions are of** is the stop's, R, the radius LensVisualizer's sections aim their zones at
  (``pupilRadiusMm`` states it). optiland's robust aimer puts its normalised pupil coordinate 1 at the radius it takes
  for the stop, the stop surface's clip radius r, which is held to the case's (``mtf.verify_field``) and for a case
  from LensVisualizer is R plus 1e-9 mm (the exporter's clip tolerance, LensVisualizer's own): the ray of a fraction f
  is asked at the pupil coordinate (0, f R / r). Asked at (0, f), every zone would lie f times 1e-9 mm outside
  LensVisualizer's, and pupils 1e-9 mm apart are two pupils to R8b where R is below 5 mm.
- **What the aimer launched for an object at infinity on the axis** is a ray parallel to the axis, x 0 and direction
  (0, 0, 1) to the bit, from a launch plane in front of the first surface, at the height that brings it to (0, f R)
  of the stop within the aimer's tolerance. A ray the aimer could not bring there (no ray of the line reaches that
  point: a miss or a total reflection on the way) it returns as NaN in all six values: such a ray is unaimed, is not
  traced, and is stated as a ray that did not arrive (``sampling.raysUnaimed``), as LensVisualizer leaves an unaimed
  zone untraced. A ray clipped by an aperture in front of the stop is aimed all the same (the aimer clips nothing)
  and is blocked where optiland's trace says.
- **The fractions** are those of the spec. Spherical aberration: each zone of the near-axis zone, the marginal
  candidates and the profile, once, in that order, as a ray and its mirror image, ``+f`` and then ``-f``. Colour: each
  candidate of the marginal ray, once, ``+f`` alone.
- **What a line states.** Whether each ray passed every surface and reached the image plane (``arrived``), and where
  it leaves the last surface, its point and its direction, NaN where it did not arrive; and the paraxial rear focal
  point of the line's optic, ``F2()`` from the image surface plus the image plane (``first_order``), or null where
  optiland has none that is a number. The answer states the radius the fractions are of, ``pupilRadiusMm``, R.

Every setting the launch depends on is read back from optiland's objects, before and after the rays are generated
(``mtf.verify_field``: the aiming, its mode and both settings, the one ``AngleField`` on the axis without a
vignetting factor and of weight 1, the radius of the stop the aimer takes, no apodization or polarization), and of
what was launched (``launch``, ``trace``): the aimer that launched it, the length of every column, each aimed ray's
x and direction, and where optiland's own trace of each crosses the stop surface, at (0, f R) within the aimer's
tolerance. A difference is ``BuildMismatch``: a launch from another line's optic crosses this line's stop elsewhere.
A line whose rays optiland's aimer gives up on altogether (it raises, every ray unaimed) is ``unavailable``,
``aim-failed``, the others of the request as they are.

A finite object is not answered: optiland's aimer then aims from the object point, and LensVisualizer's sections
launch collimated rays. Nor is a case whose first-order data optiland's paraxial model does not see, which the engine
refuses before this module is asked (``engine.refusals``, ``first_order.term_refusals``): a phase profile, a term of
power 1 or 2 of a polynomial sag. The paraxial focus of the answer is optiland's first-order data, and of such a case
it would be that of the lens without what it does not see.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any

from lvrtc_worker_kit.ndarray import encode_ndarray

from .build import BuildMismatch, OptilandApi, optiland_api
from .first_order import _ask
from .mtf import (
    AIMING_MAX_ITERATIONS,
    AIMING_MODE,
    AIMING_TOLERANCE_MM,
    MtfApi,
    _Quiet,
    _said,
    field_optic,
    mtf_api,
    verify_field,
)
from .trace import STATUS_OK, record, settle

AXIAL_NATIVE = "axial.native"

METHOD = "optiland-real-rays"
"""The name of the method the answer states: optiland's own aimed launch and real trace, one optic for each line."""

AIMER = "RobustRayAimer"
"""The class of optiland's aimer that ``AIMING_MODE`` makes, which is to have launched every ray."""

AXIS = 0.0
"""The angle of the one field of each optic, degrees: the axis."""

UNSUPPORTED = {"line": "line", "finite": "object.finite"}
"""The ``item`` of each refusal of the quantity, by what it is about."""

REASONS = {"aim": "aim-failed"}
"""The ``reason`` of a line that is "unavailable": optiland's aimer aimed none of its rays."""


@dataclass(frozen=True)
class AxialRequest:
    """An ``axial.native`` request the engine answers, as numbers."""

    kind: str
    lines: tuple[int, ...]
    fractions: tuple[float, ...]
    """The signed fraction of each ray, in the order traced."""


def signed_fractions(spec: dict[str, Any]) -> tuple[float, ...]:
    """The rays of a spec: of spherical aberration each zone once as ``+f, -f``, of colour each candidate as ``+f``."""
    if spec["kind"] == "spherical":
        zones = dict.fromkeys(float(f) for f in [spec["nearAxis"], *spec["marginal"], *spec["profile"]])
        return tuple(value for zone in zones for value in (zone, -zone))
    return tuple(dict.fromkeys(float(f) for f in spec["marginal"]))


def read_request(spec: dict[str, Any], case: dict[str, Any]) -> AxialRequest | list[dict[str, str]]:
    """What a schema-valid spec asks, or every reason why the engine has no answer to it, as unsupported items."""
    refused: list[dict[str, str]] = []
    count = len(case["conditions"]["lines"])
    lines = tuple(int(line) for line in spec["lines"])
    beyond = [line for line in lines if line >= count]
    if beyond:
        message = f"the case has {count} lines; the spec asks line {', '.join(str(line) for line in beyond)}"
        refused.append({"code": "option", "item": UNSUPPORTED["line"], "message": message})
    if case["conditions"]["object"]["kind"] != "infinity":
        message = "the object is finite: optiland's aimer aims from the object point then, and the rays are no beam"
        refused.append({"code": "feature", "item": UNSUPPORTED["finite"], "message": message})
    if refused:
        return refused
    return AxialRequest(kind=str(spec["kind"]), lines=lines, fractions=signed_fractions(spec))


class AimFailed(Exception):
    """optiland's aimer aimed none of the rays of a line: it raised, and says why."""


AIMER_GAVE_UP = "RobustRayAimer:"
"""How optiland's robust aimer begins the ``ValueError`` it raises when it aims no ray of a call, or no chief ray
(``optiland/rays/ray_aiming/robust.py``). Only such an error is a line's ``aim-failed``: any other ``ValueError`` of
the generator (a polarization, a registry) is a fault of the request and stays an error."""


@dataclass(frozen=True)
class LineOptic:
    """The optic of one line of a case, built, verified and given the axial field and the worker's aiming."""

    optic: Any
    case: dict[str, Any]
    stop_index: int
    """The case's index of the stop surface."""
    stop_radius_mm: float
    """The radius optiland's aimer takes for the stop, held to the case's clip radius: its pupil coordinate 1."""
    pupil_radius_mm: float
    """The case's stop radius, ``conditions.stopSemiDiameter``: what the fractions are of."""


@dataclass(frozen=True)
class Launch:
    """optiland's own rays at the pupil coordinates of a request, as its aimer launched them on one line's optic."""

    fractions: tuple[float, ...]
    origins: Any
    """float64 (m, 3); NaN for a ray that is not aimed."""
    directions: Any
    """float64 (m, 3); NaN for a ray that is not aimed."""
    aimed: tuple[bool, ...]
    """Whether the aimer aimed each ray; one it did not is NaN in all six values, and is not traced."""


def _hold(what: str, held: Any, expected: Any) -> None:
    if not (type(held) is type(expected) and held == expected):
        raise BuildMismatch(f"the axial launch: {what} is {held!r} in what optiland holds and {expected!r} asked")


def line_optic(
    case: dict[str, Any], line: int, api: OptilandApi | None = None, tools: MtfApi | None = None
) -> LineOptic:
    """A new optic of a case at one line whose one field is the axis, under the worker's aiming, verified."""
    tools = tools if tools is not None else mtf_api()
    optic = field_optic(case, line, AXIS, api, tools)
    radius = float(tools.get_stop_radius_strategy(optic, AIMING_MODE).calculate_stop_radius())
    return LineOptic(
        optic=optic,
        case=case,
        stop_index=int(case["system"]["stopIndex"]),
        stop_radius_mm=radius,
        pupil_radius_mm=float(case["conditions"]["stopSemiDiameter"]),
    )


def launch(
    held: LineOptic, fractions: Sequence[float], api: OptilandApi | None = None, tools: MtfApi | None = None
) -> Launch:
    """optiland's rays of the optic's one field aimed at the points (0, f R) of the stop, read back: the pupil
    coordinates (0, f R / r), R the case's stop radius and r the radius optiland's aimer takes for the stop.

    The field and the aiming are held to what was asked before and after the rays are generated (``verify_field``);
    the aimer that launched them is optiland's robust one; every column it launched has one value a ray; and each ray
    it aimed starts on the meridian (x 0) parallel to the axis (L and M 0, N 1), to the bit. A ray that is NaN in all
    six values is one the aimer did not aim. A difference is ``BuildMismatch``; the aimer's giving up on every ray of
    the line is ``AimFailed``.
    """
    api = api if api is not None else optiland_api()
    tools = tools if tools is not None else mtf_api()
    np = api.np
    optic = held.optic
    verify_field(optic, held.case, AXIS, tools)
    count = len(fractions)
    pupil = np.array(
        [float(fraction) * held.pupil_radius_mm / held.stop_radius_mm for fraction in fractions], dtype=np.float64
    )
    generator = optic.ray_tracer.ray_generator
    try:
        with _Quiet(api):
            rays = generator.generate_rays(
                AXIS, AXIS, np.zeros(count, dtype=np.float64), pupil, float(optic.primary_wavelength)
            )
    except ValueError as error:
        if not str(error).startswith(AIMER_GAVE_UP):
            raise
        raise AimFailed(_said(error)) from error
    _hold("the aimer that launched the rays", type(generator.aimer).__name__, AIMER)
    verify_field(optic, held.case, AXIS, tools)
    names = ("x", "y", "z", "L", "M", "N")
    columns = [np.asarray(getattr(rays, name), dtype=np.float64).reshape(-1) for name in names]
    for name, column in zip(names, columns, strict=True):
        if column.shape != (count,):
            raise BuildMismatch(f"the axial launch: optiland launched {column.shape[0]} values of {name}, not {count}")
    x, y, z, L, M, N = columns
    unaimed = np.all(np.isnan(np.stack(columns)), axis=0)
    for ray in range(count):
        if bool(unaimed[ray]):
            continue
        _hold(f"ray {ray}: its x", float(x[ray]), 0.0)
        _hold(f"ray {ray}: its direction", (float(L[ray]), float(M[ray]), float(N[ray])), (0.0, 0.0, 1.0))
    return Launch(
        fractions=tuple(float(fraction) for fraction in fractions),
        origins=np.ascontiguousarray(np.column_stack((x, y, z))),
        directions=np.ascontiguousarray(np.column_stack((L, M, N))),
        aimed=tuple(not bool(value) for value in unaimed),
    )


def paraxial_focus(held: LineOptic, api: OptilandApi | None = None) -> float | None:
    """The paraxial rear focal point of an optic in the contract's frame, ``F2()`` plus the image plane; or None."""
    api = api if api is not None else optiland_api()
    positions = api.np.asarray(held.optic.surfaces.positions, dtype=api.np.float64).ravel()
    focus = float(positions[-1]) + _ask(api, held.optic, "F2")
    return focus if math.isfinite(focus) else None


@dataclass(frozen=True)
class Traced:
    """What became of the rays of a request at one line: arrival, and the exit point and direction of each."""

    arrived: tuple[int, ...]
    exit_point: tuple[float, ...]
    """m times x, y, z; NaN where the ray did not arrive."""
    exit_direction: tuple[float, ...]


def trace(held: LineOptic, launched: Launch, api: OptilandApi | None = None) -> Traced:
    """The aimed rays of a launch traced through the line's own optic by optiland's own tracer, as a line has them.

    One batch, ``trace.record`` then ``trace.settle``, as ``rays.trace`` traces one. Where optiland's own trace of each
    aimed ray crosses the stop surface (its row of the stop, which goes on behind an aperture that clipped the ray) is
    held to (0, f R) within the aimer's tolerance, R the case's stop radius: a ``BuildMismatch`` otherwise. A
    ray that is not aimed is not traced, and did not arrive.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    count = len(launched.fractions)
    taken = [ray for ray in range(count) if launched.aimed[ray]]
    arrived = np.zeros(count, dtype=bool)
    point = np.full((count, 3), np.nan, dtype=np.float64)
    direction = np.full((count, 3), np.nan, dtype=np.float64)
    if taken:
        rows = record(held.optic, launched.origins[taken], launched.directions[taken], api)
        # optiland's row k + 1 is the case's surface k.
        at_stop = held.stop_index + 1
        for column, ray in enumerate(taken):
            crossing = (float(rows.x[at_stop][column]), float(rows.y[at_stop][column]))
            target = launched.fractions[ray] * held.pupil_radius_mm
            apart = math.hypot(crossing[0], crossing[1] - target)
            if not apart <= AIMING_TOLERANCE_MM:
                raise BuildMismatch(
                    f"the axial launch: ray {ray} crosses the stop at {crossing!r} in optiland's trace, "
                    f"{apart!r} mm from (0, {target!r}) asked (fraction {launched.fractions[ray]!r} of "
                    f"{held.pupil_radius_mm!r} mm), beyond the aimer's tolerance of {AIMING_TOLERANCE_MM!r} mm"
                )
        traced = settle(held.optic, rows, api)
        ok = traced.status == STATUS_OK
        arrived[taken] = ok
        point[taken] = np.where(ok[:, None], traced.exit_point, np.nan)
        direction[taken] = np.where(ok[:, None], traced.exit_direction, np.nan)
    return Traced(
        arrived=tuple(int(value) for value in arrived),
        exit_point=tuple(float(value) for value in point.reshape(-1)),
        exit_direction=tuple(float(value) for value in direction.reshape(-1)),
    )


@dataclass(frozen=True)
class Steps:
    """What an answer asks of optiland, one call a step; a test hands stand-ins in their place."""

    optic: Callable[[dict[str, Any], int], LineOptic]
    launch: Callable[[LineOptic, Sequence[float]], Launch]
    trace: Callable[[LineOptic, Launch], Traced]
    focus: Callable[[LineOptic], float | None]


def optiland_steps() -> Steps:
    """The steps on the real optiland."""
    return Steps(optic=line_optic, launch=launch, trace=trace, focus=paraxial_focus)


def answer_axial(spec: dict[str, Any], case: dict[str, Any], *, steps: Steps | None = None) -> dict[str, Any] | list:
    """``axial.native`` data for a request, or the unsupported items that say why there is none.

    One verified optic for each line of the request, each launching its own rays at its own stop and tracing them. A
    ``BuildMismatch`` is raised, for the engine to answer as an error: nothing is said about an optic that is not the
    case, nor about a launch that is not what was asked. A line whose rays the aimer gave up on is unavailable.
    """
    asked = read_request(spec, case)
    if isinstance(asked, list):
        return asked
    steps = steps if steps is not None else optiland_steps()
    count = len(asked.fractions)
    fields = []
    notes: list[str] = []
    optics = [steps.optic(case, line) for line in asked.lines]
    radius = optics[0].pupil_radius_mm
    for line, held in zip(asked.lines, optics, strict=True):
        entry: dict[str, Any] = {
            "line": line,
            "wavelengthNm": case["conditions"]["lines"][line]["wavelengthNm"],
            "status": "ok",
            "paraxialFocusZ": steps.focus(held),
            "figures": None,
        }
        try:
            launched = steps.launch(held, asked.fractions)
        except AimFailed as error:
            unavailable = {"status": "unavailable", "reason": REASONS["aim"], "rays": None}
            sampling = {"raysLaunched": count, "raysUnaimed": count, "raysArrived": 0}
            fields.append({**entry, **unavailable, "sampling": sampling})
            notes.append(f"line {line}: optiland's aimer aimed none of its rays: {error}")
            continue
        traced = steps.trace(held, launched)
        unaimed = launched.aimed.count(False)
        if unaimed:
            notes.append(f"line {line}: optiland's aimer aimed {count - unaimed} of its {count} rays")
        fields.append(
            {
                **entry,
                "rays": {
                    "fractions": encode_ndarray("f8", list(asked.fractions), [count]),
                    "arrived": encode_ndarray("u1", list(traced.arrived), [count]),
                    "exitPoint": encode_ndarray("f8", list(traced.exit_point), [count, 3]),
                    "exitDirection": encode_ndarray("f8", list(traced.exit_direction), [count, 3]),
                },
                "sampling": {"raysLaunched": count, "raysUnaimed": unaimed, "raysArrived": sum(traced.arrived)},
            }
        )
    return {
        "kind": asked.kind,
        "pupilRadiusMm": radius,
        "fields": fields,
        "method": {
            "name": METHOD,
            "params": {
                "aiming": AIMING_MODE,
                "aimingMaxIterations": AIMING_MAX_ITERATIONS,
                "aimingToleranceMm": AIMING_TOLERANCE_MM,
                "pupil": "conditions.stopSemiDiameter: each ray aimed at (0, f R) of the stop surface",
                "launch": "ray_generator.generate_rays at (0, f R / r) of the axial field, on each line's own optic",
                "pupilRadiusMm": radius,
                "aimerStopRadiusMm": optics[0].stop_radius_mm,
            },
        },
        "notes": ["each line's optic aims its own rays at (0, f R) of the stop and traces them", *notes],
    }


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many lines an answer has, and how many rays it launched, could not aim and saw arrive, over every line."""
    return {
        "lines": len(data["fields"]),
        **{
            name: sum(int(field["sampling"].get(name, 0)) for field in data["fields"])
            for name in ("raysLaunched", "raysUnaimed", "raysArrived")
        },
    }
