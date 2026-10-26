"""``axial.native``: optiland's own rays along the axis of a case at each line, and its paraxial focus there.

optiland has no analysis of spherical aberration or of axial colour by real rays: what it has of them is its own pupil,
its own aiming, its own real tracer, one optic for each line, and its own paraxial focus. The worker asks each and
reads what optiland holds; nothing of a figure is computed here. The comparator forms the figures of the rays with its
own estimator (``src/estimators/axialIntercept.ts``), as it does of every engine's rays.

- **The rays are optiland's own launch.** The optic of the request's first line is the reference: its ray generator,
  with its default aiming (``paraxial``) and the builder's one field on the axis, is asked for the rays at the
  normalised pupil coordinates (0, f), one for each signed fraction f of the request. What it launched is read back:
  every ray starts on the meridian (x and L are 0) parallel to the axis (M is 0 and N is 1), at the height f times
  half of optiland's paraxial entrance-pupil diameter ``EPD()``, as its aimer places a pupil point. Those same rays,
  bit for bit, are traced at every line (``trace.trace_rays``), as LensVisualizer's axial-colour section traces the
  same heights at each of its channels.
- **The fractions** are those of the spec. Spherical aberration: each zone of the near-axis zone, the marginal
  candidates and the profile, once, in that order, as a ray and its mirror image, ``+f`` and then ``-f``. Colour: each
  candidate of the marginal ray, once, ``+f`` alone.
- **What a line states.** Whether each ray passed every surface and reached the image plane (``arrived``), and where
  it leaves the last surface, its point and its direction, NaN where it did not arrive; and the paraxial rear focal
  point of the line's optic, ``F2()`` from the image surface plus the image plane (``first_order``), or null where
  optiland has none that is a number. The answer states the radius, ``abs(EPD()) / 2`` of the first line's optic.

Every optic is the builder's, verified (``build.build_case``). Each setting the launch depends on is read back from
optiland's objects (``launch``): the aiming, the field, the apodization, the diameter of the pupil, every launched ray;
a difference is ``BuildMismatch``. A finite object is not answered: optiland's aimer then aims at its paraxial
entrance pupil from the object point, and LensVisualizer's sections launch collimated rays. Nor is a case whose
first-order data optiland's paraxial model does not see, which the engine refuses before this module is asked
(``engine.refusals``, ``first_order.term_refusals``): a phase profile, a term of power 1 or 2 of a polynomial sag.
The pupil the rays are launched in and the paraxial focus are optiland's first-order data, and of such a case they
would be those of the lens without what it does not see.

Nothing of optiland or numpy is imported when this module is.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any

from lvrtc_worker_kit.ndarray import encode_ndarray

from .build import BuildMismatch, OptilandApi, build_case, optiland_api, wavelength_um
from .first_order import _ask
from .trace import STATUS_OK, trace_rays

AXIAL_NATIVE = "axial.native"

METHOD = "optiland-real-rays"
"""The name of the method the answer states: optiland's own launch and real trace, one optic for each line."""

AIMING = "paraxial"
"""optiland's own aiming, its default: a pupil coordinate is a point of its paraxial entrance pupil."""

UNSUPPORTED = {"line": "line", "finite": "object.finite"}
"""The ``item`` of each refusal of the quantity, by what it is about."""


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
        message = "the object is finite: optiland aims at its paraxial entrance pupil from the object point then"
        refused.append({"code": "feature", "item": UNSUPPORTED["finite"], "message": message})
    if refused:
        return refused
    return AxialRequest(kind=str(spec["kind"]), lines=lines, fractions=signed_fractions(spec))


@dataclass(frozen=True)
class Launch:
    """optiland's own rays at the pupil coordinates of a request, as its ray generator launched them."""

    origins: Any
    """float64 (m, 3)."""
    directions: Any
    """float64 (m, 3)."""
    radius_mm: float
    """Half of the magnitude of the optic's paraxial entrance-pupil diameter."""


def _hold(what: str, held: Any, expected: Any) -> None:
    if not (type(held) is type(expected) and held == expected):
        raise BuildMismatch(f"the axial launch: {what} is {held!r} in what optiland holds and {expected!r} asked")


def launch(optic: Any, fractions: Sequence[float], api: OptilandApi | None = None) -> Launch:
    """optiland's rays at the normalised pupil coordinates (0, f) of the optic's one field, read back.

    Held to what was asked, from optiland's own objects: the aiming is optiland's default (``paraxial``); the optic has
    one ``AngleField``, on the axis, without a vignetting factor; nothing weights the pupil; ``EPD()`` is a finite
    number other than 0; and each ray optiland launched starts on the meridian (x 0), at the height ``f * EPD / 2``
    as its aimer places it, parallel to the axis (L and M 0, N 1). A difference is ``BuildMismatch``.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    _hold("the aiming", str(optic.ray_tracer.ray_aiming_config["mode"]), AIMING)
    fields = optic.fields
    _hold("the number of fields", int(fields.num_fields), 1)
    _hold("the type of the field", type(fields.field_definition).__name__, "AngleField")
    held = fields.fields[0]
    _hold("the field angle, degrees", (float(held.x), float(held.y)), (0.0, 0.0))
    _hold("the vignetting factors", (float(held.vx), float(held.vy)), (0.0, 0.0))
    _hold("the apodization", optic.apodization, None)
    diameter = _ask(api, optic, "EPD")
    if not (math.isfinite(diameter) and diameter != 0.0):
        raise BuildMismatch(f"the axial launch: optiland's EPD() is {diameter!r}, no diameter of a pupil")
    count = len(fractions)
    pupil = np.array([float(fraction) for fraction in fractions], dtype=np.float64)
    rays = optic.ray_tracer.ray_generator.generate_rays(
        0.0, 0.0, np.zeros(count, dtype=np.float64), pupil, float(optic.primary_wavelength)
    )
    columns = [np.asarray(getattr(rays, name), dtype=np.float64).reshape(-1) for name in ("x", "y", "z", "L", "M", "N")]
    for name, column in zip(("x", "y", "z", "L", "M", "N"), columns, strict=True):
        if column.shape != (count,):
            raise BuildMismatch(f"the axial launch: optiland launched {column.shape[0]} values of {name}, not {count}")
    x, y, z, L, M, N = columns
    expected = [float(fraction) * diameter / 2 for fraction in fractions]
    for ray in range(count):
        _hold(f"ray {ray}: its x", float(x[ray]), 0.0)
        _hold(f"ray {ray}: its height", float(y[ray]), expected[ray])
        _hold(f"ray {ray}: its direction", (float(L[ray]), float(M[ray]), float(N[ray])), (0.0, 0.0, 1.0))
    return Launch(
        origins=np.ascontiguousarray(np.column_stack((x, y, z))),
        directions=np.ascontiguousarray(np.column_stack((L, M, N))),
        radius_mm=abs(diameter) / 2,
    )


def paraxial_focus(optic: Any, api: OptilandApi | None = None) -> float | None:
    """The paraxial rear focal point of an optic in the contract's frame, ``F2()`` plus the image plane; or None."""
    api = api if api is not None else optiland_api()
    positions = api.np.asarray(optic.surfaces.positions, dtype=api.np.float64).ravel()
    focus = float(positions[-1]) + _ask(api, optic, "F2")
    return focus if math.isfinite(focus) else None


@dataclass(frozen=True)
class Traced:
    """What became of the rays of a request at one line: arrival, and the exit point and direction of each."""

    arrived: tuple[int, ...]
    exit_point: tuple[float, ...]
    """m times x, y, z; NaN where the ray did not arrive."""
    exit_direction: tuple[float, ...]


def trace(optic: Any, origins: Any, directions: Any, api: OptilandApi | None = None) -> Traced:
    """The rays traced through one line's optic by optiland's own tracer (``trace.trace_rays``), as a line has them."""
    api = api if api is not None else optiland_api()
    np = api.np
    traced, _ = trace_rays(optic, origins, directions, api)
    arrived = traced.status == STATUS_OK
    point = np.where(arrived[:, None], traced.exit_point, np.nan)
    direction = np.where(arrived[:, None], traced.exit_direction, np.nan)
    return Traced(
        arrived=tuple(int(value) for value in arrived),
        exit_point=tuple(float(value) for value in point.reshape(-1)),
        exit_direction=tuple(float(value) for value in direction.reshape(-1)),
    )


@dataclass(frozen=True)
class Steps:
    """What an answer asks of optiland, one call a step; a test hands stand-ins in their place."""

    build: Callable[[dict[str, Any], tuple[int, ...]], tuple[Any, ...]]
    launch: Callable[[Any, Sequence[float]], Launch]
    trace: Callable[[Any, Any, Any], Traced]
    focus: Callable[[Any], float | None]


def optiland_steps() -> Steps:
    """The steps on the real optiland."""
    return Steps(
        build=lambda case, lines: build_case(case, lines=lines).optics,
        launch=launch,
        trace=trace,
        focus=paraxial_focus,
    )


def answer_axial(spec: dict[str, Any], case: dict[str, Any], *, steps: Steps | None = None) -> dict[str, Any] | list:
    """``axial.native`` data for a request, or the unsupported items that say why there is none.

    One verified optic for each line of the request; the rays launched by the first; each traced at every line. A
    ``BuildMismatch`` is raised, for the engine to answer as an error: nothing is said about an optic that is not the
    case, nor about a launch that is not what was asked.
    """
    asked = read_request(spec, case)
    if isinstance(asked, list):
        return asked
    steps = steps if steps is not None else optiland_steps()
    optics = steps.build(case, asked.lines)
    launched = steps.launch(optics[0], asked.fractions)
    count = len(asked.fractions)
    fields = []
    for line, optic in zip(asked.lines, optics, strict=True):
        traced = steps.trace(optic, launched.origins, launched.directions)
        fields.append(
            {
                "line": line,
                "wavelengthNm": case["conditions"]["lines"][line]["wavelengthNm"],
                "status": "ok",
                "paraxialFocusZ": steps.focus(optic),
                "figures": None,
                "rays": {
                    "fractions": encode_ndarray("f8", list(asked.fractions), [count]),
                    "arrived": encode_ndarray("u1", list(traced.arrived), [count]),
                    "exitPoint": encode_ndarray("f8", list(traced.exit_point), [count, 3]),
                    "exitDirection": encode_ndarray("f8", list(traced.exit_direction), [count, 3]),
                },
                "sampling": {"raysLaunched": count, "raysArrived": sum(traced.arrived)},
            }
        )
    return {
        "kind": asked.kind,
        "pupilRadiusMm": launched.radius_mm,
        "fields": fields,
        "method": {
            "name": METHOD,
            "params": {
                "aiming": AIMING,
                "pupil": "abs(EPD()) / 2 of the first line's optic",
                "launch": "ray_generator.generate_rays at (0, f) of the axial field",
                "wavelengthUm": wavelength_um(case["conditions"]["lines"][asked.lines[0]]),
            },
        },
        "notes": ["the rays launched at the first line are traced at every line, the same heights at each"],
    }


def field_counts(data: dict[str, Any]) -> dict[str, int]:
    """How many lines an answer has, and how many rays it launched and saw arrive, over every line."""
    return {
        "lines": len(data["fields"]),
        "raysLaunched": sum(int(field["sampling"].get("raysLaunched", 0)) for field in data["fields"]),
        "raysArrived": sum(int(field["sampling"].get("raysArrived", 0)) for field in data["fields"]),
    }
