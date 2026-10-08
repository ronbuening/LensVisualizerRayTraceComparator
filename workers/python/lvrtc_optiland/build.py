"""The builder: an optical case as optiland ``Optic`` objects, and the built optics read back.

One ``Optic`` is built for each spectral line of a case, because optiland's constant-index material is the same at
every wavelength and its first-order data is that of its primary wavelength: a line's optic holds that line's
indices and has that line's wavelength as its only, primary one.

Three things are kept apart here, and the order is the point:

1. ``build_optic`` hands the numbers of the case to optiland, through its surface factory;
2. ``verify_optic`` reads the optic back and holds it to the case, value by value and then by the sag optiland
   itself evaluates: an optic that is not the case is a ``BuildMismatch`` that names the surface and the field,
   and nothing is answered about it;
3. ``describe_optics`` writes ``system.describe`` from the optics alone. It is not given the case.

What optiland's factory does with what it is given, and why each keyword below is what it is, is in
``docs/gotchas.md`` under "optiland". Nothing of optiland or numpy is imported when this module is: ``optiland_api``
imports them when the first case is built, after ``hygiene.prepare`` has run.
"""

from __future__ import annotations

import functools
import math
import warnings
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray

ASPHERE_TOLERANCE_MM = 1e-12
"""The tolerance of optiland's Newton iteration on an asphere, as a residual in mm. Its factory's own is 1e-6."""

ASPHERE_MAX_ITERATIONS = 100
"""How many Newton steps optiland may take on an asphere."""

SAG_PROBE_FRACTIONS: tuple[float, ...] = (0.25, 0.5, 0.75, 1.0)
"""The fractions of a surface's nominal semi-diameter at which a built surface's sag is held to the case's."""

SAG_PROBE_TOLERANCE = 1e-9
"""How far optiland's sag of a built surface may lie from the contract's sag of the case's surface, on the scale of
``sag_scale``: a thousand times the gate of rung R0. It is there to find a surface that is another surface (a
coefficient in the wrong place, a radius of the wrong sign), and leaves rounding to R0, which judges it."""

SAG_PROBE_MARGIN = 1e-6
"""A probe is skipped where ``1 - (1 + K) c^2 r^2`` is below this: at the height where a conic ends, whether a sag
is a number or none is a matter of one rounding."""


class BuildMismatch(RuntimeError):
    """The optic optiland built is not the case. The message names the surface and the field that differ."""


# ── The case, as numbers ─────────────────────────────────────────────────────────────────────────────────────────


def index_rows(case: dict[str, Any]) -> list[list[float]]:
    """The index of the medium after each surface, one row per line of the case."""
    table = decode_ndarray(case["conditions"]["indexAfterSurface"])
    values = table.values()
    lines, surfaces = table.shape
    return [values[row * surfaces : (row + 1) * surfaces] for row in range(lines)]


def wavelength_um(line: dict[str, Any]) -> float:
    """A line's wavelength in micrometres, which is what optiland counts in: one division of the nanometres."""
    return float(line["wavelengthNm"]) / 1000.0


def stated_terms(shape: dict[str, Any]) -> list[tuple[int, float]]:
    """Every polynomial term a shape states, as ``(power, coeff)`` in the order of the case; none for a conic."""
    terms = shape["terms"] if shape["kind"] == "asphere" else []
    return [(int(term["power"]), float(term["coeff"])) for term in terms]


def nonzero_terms(shape: dict[str, Any]) -> list[tuple[int, float]]:
    """The polynomial terms of a shape that add something, as ``(power, coeff)`` by ascending power."""
    return sorted(term for term in stated_terms(shape) if term[1] != 0.0)


# ── The contract's sag, for the probe ────────────────────────────────────────────────────────────────────────────


def contract_sag(curvature: float, conic: float, terms: Sequence[tuple[int, float]], r: float) -> float:
    """The contract's sag at the radial height ``r`` (contract/CONTRACT.md, "Sag"); NaN beyond the end of a conic.

    Written from the contract and from nothing of optiland: ``c r^2 / (1 + sqrt(1 - (1 + K) c^2 r^2))`` plus the
    terms, summed with ``math.fsum``. It is the worker's own second opinion of a built surface, never an answer.
    """
    conic_part = 0.0
    if curvature != 0.0:
        u = curvature * r
        inside = 1.0 - (1.0 + conic) * u * u
        if inside < 0.0:
            return math.nan
        conic_part = (u * r) / (1.0 + math.sqrt(inside))
    return conic_part + math.fsum(coeff * r**power for power, coeff in terms)


def sag_scale(curvature: float, conic: float, terms: Sequence[tuple[int, float]], r: float) -> float:
    """How large a rounding error of that sag can be, in mm: the scale of rung R0's ``sag.maxScaled``."""
    scale = 0.0
    if curvature != 0.0:
        u = curvature * r
        q = (1.0 + conic) * u * u
        root = math.sqrt(max(0.0, 1.0 - q))
        magnified = math.inf if root == 0.0 else abs(q) / (root * (1.0 + root))
        scale = abs((u * r) / (1.0 + root)) * (1.0 + magnified)
    return scale + math.fsum(abs(coeff) * r**power for power, coeff in terms)


# ── From a shape to optiland's keywords, and back ────────────────────────────────────────────────────────────────


def coefficient_list(terms: Sequence[tuple[int, float]]) -> tuple[str, list[float]]:
    """The surface type and the coefficient list of optiland for polynomial terms ``(power, coeff)``.

    - Every power even: ``even_asphere``, whose ``coefficients[i]`` multiplies ``r^(2(i + 1))``: the first entry
      is the term of power 2, not of power 4.
    - Any power odd: ``odd_asphere``, whose ``coefficients[i]`` multiplies ``r^(i + 1)``.

    The list reaches the highest power the terms state, with 0 wherever the case has no term. Whether a power is
    even is asked of every term that is stated, whatever its coefficient, as the case's feature flags are.
    """
    if not terms:
        raise ValueError("an asphere without a term has no coefficient list")
    if any(power < 1 for power, _ in terms):
        raise ValueError("a polynomial term has a power below 1")
    highest = max(power for power, _ in terms)
    if all(power % 2 == 0 for power, _ in terms):
        coefficients = [0.0] * (highest // 2)
        for power, coeff in terms:
            coefficients[power // 2 - 1] = coeff
        return "even_asphere", coefficients
    coefficients = [0.0] * highest
    for power, coeff in terms:
        coefficients[power - 1] = coeff
    return "odd_asphere", coefficients


def terms_of(odd: bool, coefficients: Sequence[float]) -> list[tuple[int, float]]:
    """The terms a coefficient list of optiland stands for, as ``(power, coeff)``, those that are not 0, ascending.

    Written from optiland's two sag functions, not as the inverse of ``coefficient_list``: entry ``i`` of an even
    asphere multiplies ``r2 ** (i + 1)``, so its power is ``2 i + 2``; of an odd asphere ``r ** (i + 1)``.
    """
    powers = range(1, len(coefficients) + 1) if odd else range(2, 2 * len(coefficients) + 2, 2)
    return [(power, float(coeff)) for power, coeff in zip(powers, coefficients, strict=True) if float(coeff) != 0.0]


def shape_keywords(shape: dict[str, Any]) -> dict[str, Any]:
    """The keywords of ``surfaces.add`` that state a contract shape. Standard library only.

    - A plane is ``radius=inf`` of the type ``standard``, which optiland makes a ``Plane``.
    - A conic is ``standard`` with its radius and conic constant.
    - An asphere is ``even_asphere`` or ``odd_asphere`` by the powers it states (``coefficient_list``), on a base
      of radius ``inf`` where the case states none, with the tolerance and the iteration count of this module: the
      factory's own tolerance is 1e-6 mm, and a keyword it does not know is dropped without a word.

    An asphere stays an asphere whatever its coefficients are: optiland then keeps its conic constant, also on a
    flat base, where a ``standard`` surface would become a plane that has none.
    """
    if shape["kind"] == "plane":
        return {"surface_type": "standard", "radius": math.inf}
    if shape["kind"] == "conic":
        return {"surface_type": "standard", "radius": float(shape["radius"]), "conic": float(shape["conic"])}
    surface_type, coefficients = coefficient_list(stated_terms(shape))
    return {
        "surface_type": surface_type,
        "radius": math.inf if shape["radius"] is None else float(shape["radius"]),
        "conic": float(shape["conic"]),
        "coefficients": coefficients,
        "tol": ASPHERE_TOLERANCE_MM,
        "max_iter": ASPHERE_MAX_ITERATIONS,
    }


# ── optiland, loaded when the first case is built ────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class OptilandApi:
    """What the builder uses of optiland and numpy: the classes it calls and the ones it expects to find."""

    np: Any
    Optic: Any
    IdealMaterial: Any
    RadialAperture: Any
    Plane: Any
    StandardGeometry: Any
    EvenAsphere: Any
    OddAsphere: Any


@functools.lru_cache(maxsize=1)
def optiland_api() -> OptilandApi:
    """Imports what the builder uses of optiland. ``hygiene.prepare`` must have run: importing optiland writes."""
    import numpy  # noqa: PLC0415 - not before the worker's hygiene
    from optiland.geometries import EvenAsphere, OddAsphere, Plane, StandardGeometry  # noqa: PLC0415
    from optiland.materials import IdealMaterial  # noqa: PLC0415
    from optiland.optic import Optic  # noqa: PLC0415
    from optiland.physical_apertures import RadialAperture  # noqa: PLC0415

    return OptilandApi(
        np=numpy,
        Optic=Optic,
        IdealMaterial=IdealMaterial,
        RadialAperture=RadialAperture,
        Plane=Plane,
        StandardGeometry=StandardGeometry,
        EvenAsphere=EvenAsphere,
        OddAsphere=OddAsphere,
    )


# ── Building ─────────────────────────────────────────────────────────────────────────────────────────────────────


def surface_keywords(api: OptilandApi, surface: dict[str, Any], index_after: float, is_stop: bool) -> dict[str, Any]:
    """Every keyword of ``surfaces.add`` for one surface of a case, at one line.

    - ``z`` is the vertex of the case, as it is. A surface given a ``thickness`` instead is placed by optiland at
      the sum of what came before, which is the case's vertex only where the case's vertices are those sums; and
      no thickness states an image plane that was shifted.
    - ``material`` is the medium after the surface, of the line's index, the same at every wavelength.
    - ``aperture`` is a ``RadialAperture`` of the case's clip radius, and of its inner radius: a radius, where a
      bare number given as ``aperture`` would be read as a diameter. Without one nothing is clipped, at the stop
      as little as anywhere.
    """
    aperture = surface["aperture"]
    return {
        **shape_keywords(surface["shape"]),
        "z": float(surface["z"]),
        "material": api.IdealMaterial(n=float(index_after)),
        "is_stop": is_stop,
        "aperture": api.RadialAperture(
            r_max=float(aperture["semiDiameter"]), r_min=float(aperture["innerSemiDiameter"])
        ),
    }


def build_optic(case: dict[str, Any], line: int, api: OptilandApi | None = None) -> Any:
    """The optiland ``Optic`` of a case at its line number ``line``. It is not verified: ``verify_optic`` does that.

    The object surface stands at the object plane, or at minus infinity; each surface at its vertex, with its
    shape, its medium and its aperture (``surface_keywords``); the image surface at ``conditions.imageZ``, flat and
    without an aperture. The system's aperture is the stop's diameter (``float_by_stop_size``), twice the case's
    stop radius. Each surface's nominal semi-diameter is set as optiland's own semi-aperture of the surface, which
    clips nothing: the heights the sag is asked at are fractions of it. The line's wavelength is the only one, and
    the field is the axis.

    A call of optiland that it has deprecated is an error here, not a warning in the log.
    """
    api = api if api is not None else optiland_api()
    system, conditions = case["system"], case["conditions"]
    surfaces = system["surfaces"]
    indices = index_rows(case)[line]
    placed = conditions["object"]
    with warnings.catch_warnings():
        # optiland attributes a deprecation to its caller, which is this module.
        warnings.filterwarnings("error", category=DeprecationWarning, module=r"lvrtc_optiland\.")
        optic = api.Optic()
        optic.surfaces.add(index=0, z=-math.inf if placed["kind"] == "infinity" else float(placed["z"]))
        for number, surface in enumerate(surfaces):
            keywords = surface_keywords(api, surface, indices[number], number == system["stopIndex"])
            optic.surfaces.add(index=number + 1, **keywords)
        optic.surfaces.add(index=len(surfaces) + 1, z=float(conditions["imageZ"]))
        for number, surface in enumerate(surfaces):
            optic.surfaces[number + 1].set_semi_aperture(r_max=float(surface["aperture"]["nominalSemiDiameter"]))
        optic.set_aperture("float_by_stop_size", 2.0 * float(conditions["stopSemiDiameter"]))
        optic.fields.set_type("angle")
        optic.fields.add(y=0.0)
        optic.wavelengths.add(value=wavelength_um(conditions["lines"][line]), is_primary=True)
    return optic


# ── Reading back ─────────────────────────────────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class SurfaceReadback:
    """One surface as optiland holds it. Every number is read from optiland's own objects."""

    geometry: str
    """The name of the class of its geometry: ``Plane``, ``StandardGeometry``, ``EvenAsphere``, ``OddAsphere``."""
    z: float
    """The vertex, from the geometry's coordinate system."""
    axial: float
    """The vertex on the axis optiland's paraxial rays are traced along (``surfaces.positions``)."""
    off_axis: tuple[float, ...]
    """Its decentres and tilts, which are all 0 for a surface of a case."""
    radius: float
    conic: float
    """The conic constant; 0 for a geometry that has none, a plane."""
    terms: tuple[tuple[int, float], ...]
    """The polynomial terms its coefficients stand for, those that are not 0."""
    coefficients: tuple[float, ...] | None
    tolerance: float | None
    max_iterations: int | None
    aperture: str | None
    """The name of the class of its physical aperture, or None without one."""
    clip_radius: float | None
    inner_clip_radius: float | None
    semi_aperture: float | None
    is_stop: bool
    reflective: bool
    interaction: str
    """The name of the class of its interaction model: ``RefractiveReflectiveModel`` refracts by Snell's law, where
    a thin lens or a phase profile, which optiland also puts on a plane, bends a ray by another rule."""
    coating: str | None
    """The name of the class of its coating, or None without one."""
    index_after: float
    """The index of the medium after it at the wavelength it was read at."""


def _float(value: Any) -> float:
    """A number of optiland (a Python float, a numpy scalar, a 0-d array) as a float, bit for bit."""
    return float(value)


def read_optic(optic: Any, wavelength: float, api: OptilandApi | None = None) -> list[SurfaceReadback]:
    """Reads back every surface of an optic at ``wavelength`` in µm: the object surface, the lens, the image."""
    api = api if api is not None else optiland_api()
    axial = [_float(value) for value in api.np.asarray(optic.surfaces.positions).ravel()]
    read = []
    for number, surface in enumerate(optic.surfaces):
        geometry = surface.geometry
        frame = geometry.cs
        coefficients = getattr(geometry, "coefficients", None)
        aperture = surface.aperture
        semi = surface.semi_aperture
        model = surface.interaction_model
        coating = getattr(model, "coating", None)
        row = SurfaceReadback(
            geometry=type(geometry).__name__,
            z=_float(frame.z),
            axial=axial[number],
            off_axis=tuple(_float(value) for value in (frame.x, frame.y, frame.rx, frame.ry, frame.rz)),
            radius=_float(geometry.radius),
            conic=_float(geometry.k) if hasattr(geometry, "k") else 0.0,
            terms=() if coefficients is None else tuple(terms_of(isinstance(geometry, api.OddAsphere), coefficients)),
            coefficients=None if coefficients is None else tuple(_float(value) for value in coefficients),
            tolerance=None if getattr(geometry, "tol", None) is None else _float(geometry.tol),
            max_iterations=getattr(geometry, "max_iter", None),
            aperture=None if aperture is None else type(aperture).__name__,
            # An aperture of another class than the builder's may have neither radius: its class is what is reported.
            clip_radius=None if getattr(aperture, "r_max", None) is None else _float(aperture.r_max),
            inner_clip_radius=None if getattr(aperture, "r_min", None) is None else _float(aperture.r_min),
            semi_aperture=None if semi is None else _float(semi),
            is_stop=bool(surface.is_stop),
            reflective=bool(model.is_reflective),
            interaction=type(model).__name__,
            coating=None if coating is None else type(coating).__name__,
            index_after=_float(surface.material_post.n(wavelength)),
        )
        read.append(row)
    return read


def read_sag(optic: Any, number: int, radii: Sequence[float], api: OptilandApi | None = None) -> list[float]:
    """The sag of the surface at optiland's index ``number`` at each of ``radii``, as optiland's geometry gives it.

    The heights are taken along y, so optiland sees ``r^2`` as ``0 + y^2``. Where it has no real sag, beyond the
    end of a conic, it gives a NaN and warns of the square root; the warning is not passed on.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    heights = np.array([float(radius) for radius in radii], dtype=np.float64)
    with np.errstate(all="ignore"), warnings.catch_warnings():
        warnings.simplefilter("ignore")
        values = optic.surfaces[number].geometry.sag(x=np.zeros_like(heights), y=heights)
    return [float(value) for value in np.broadcast_to(np.asarray(values, dtype=np.float64), heights.shape)]


# ── Verifying ────────────────────────────────────────────────────────────────────────────────────────────────────


def _same(built: Any, expected: Any) -> bool:
    """Whether a value read back is the value of the case: the same number (where -0 is 0), or the same thing."""
    if isinstance(built, float) and isinstance(expected, float):
        return built == expected
    return type(built) is type(expected) and built == expected


def _expected_geometry(shape: dict[str, Any]) -> tuple[str, float, float, tuple[tuple[int, float], ...]]:
    """The class of geometry, the radius, the conic constant and the terms a contract shape must have become."""
    if shape["kind"] == "plane":
        return "Plane", math.inf, 0.0, ()
    if shape["kind"] == "conic":
        return "StandardGeometry", float(shape["radius"]), float(shape["conic"]), ()
    radius = math.inf if shape["radius"] is None else float(shape["radius"])
    even = all(power % 2 == 0 for power, _ in stated_terms(shape))
    return "EvenAsphere" if even else "OddAsphere", radius, float(shape["conic"]), tuple(nonzero_terms(shape))


def verify_optic(optic: Any, case: dict[str, Any], line: int, api: OptilandApi | None = None) -> None:
    """Holds a built optic to the case at one line. Raises a ``BuildMismatch`` for the first thing that differs.

    Everything the builder handed over is read back from optiland's objects and must be the number of the case:
    the count of surfaces, the object and image planes, and for each surface its vertex (in the geometry's frame
    and on the paraxial axis alike), the class of its geometry, its radius, conic constant and terms, the Newton
    settings of an asphere, its aperture's class and two radii, its semi-aperture, whether it is the stop, that it
    refracts by optiland's ordinary model (no mirror, no thin lens, no coating), and the index after it; then the
    system's aperture and the wavelength. So a keyword the factory dropped, a coefficient list one place off and a
    diameter taken for a radius are each found, and named.

    Then the surface optiland evaluates is held to the surface of the case: its sag at ``SAG_PROBE_FRACTIONS`` of
    the nominal semi-diameter against ``contract_sag``, within ``SAG_PROBE_TOLERANCE`` on the scale of the sag's
    rounding. That is the one check that does not depend on how this module lays a coefficient list out.
    """
    api = api if api is not None else optiland_api()
    system, conditions = case["system"], case["conditions"]
    surfaces = system["surfaces"]
    wavelength = wavelength_um(conditions["lines"][line])
    indices = index_rows(case)[line]

    def differs(where: str, field: str, built: Any, expected: Any) -> BuildMismatch:
        said = f"{where}: {field} is {built!r} in the optic optiland built and {expected!r} in the case"
        return BuildMismatch(f"{said} (line {line}, {conditions['lines'][line]['wavelengthNm']} nm)")

    def hold(where: str, field: str, built: Any, expected: Any) -> None:
        if not _same(built, expected):
            raise differs(where, field, built, expected)

    hold("the system", "the number of surfaces", int(optic.surfaces.num_surfaces) - 2, len(surfaces))

    read = read_optic(optic, wavelength, api)
    placed = conditions["object"]
    front = read[0]
    hold("the object surface", "z", front.z, -math.inf if placed["kind"] == "infinity" else float(placed["z"]))
    hold("the object surface", "is_infinite", bool(optic.object_surface.is_infinite), placed["kind"] == "infinity")
    hold("the object surface", "the index after it", front.index_after, 1.0)

    for number, surface in enumerate(surfaces):
        where = f"surface {number} ({surface['label']})"
        built = read[number + 1]
        geometry, radius, conic, terms = _expected_geometry(surface["shape"])
        aperture = surface["aperture"]
        asphere = geometry in ("EvenAsphere", "OddAsphere")
        checks: list[tuple[str, Any, Any]] = [
            ("z", built.z, float(surface["z"])),
            ("its position on the paraxial axis", built.axial, float(surface["z"])),
            ("its decentres and tilts", built.off_axis, (0.0, 0.0, 0.0, 0.0, 0.0)),
            ("the class of its geometry", built.geometry, geometry),
            ("radius", built.radius, radius),
            ("conic", built.conic, conic),
            ("terms", built.terms, terms),
            ("tol", built.tolerance, ASPHERE_TOLERANCE_MM if asphere else None),
            ("max_iter", built.max_iterations, ASPHERE_MAX_ITERATIONS if asphere else None),
            ("the class of its aperture", built.aperture, "RadialAperture"),
            ("aperture.r_max", built.clip_radius, float(aperture["semiDiameter"])),
            ("aperture.r_min", built.inner_clip_radius, float(aperture["innerSemiDiameter"])),
            ("semi_aperture", built.semi_aperture, float(aperture["nominalSemiDiameter"])),
            ("is_stop", built.is_stop, number == system["stopIndex"]),
            ("is_reflective", built.reflective, False),
            ("the model of its interaction", built.interaction, "RefractiveReflectiveModel"),
            ("its coating", built.coating, None),
            ("the index after it", built.index_after, float(indices[number])),
        ]
        for field, value, expected in checks:
            hold(where, field, value, expected)

        curvature = 0.0 if math.isinf(radius) else 1.0 / radius
        nominal = float(aperture["nominalSemiDiameter"])
        heights = [fraction * nominal for fraction in SAG_PROBE_FRACTIONS]
        for height, value in zip(heights, read_sag(optic, number + 1, heights, api), strict=True):
            inside = 1.0 - (1.0 + conic) * (curvature * height) ** 2
            if curvature != 0.0 and inside < SAG_PROBE_MARGIN:
                continue
            expected = contract_sag(curvature, conic, terms, height)
            allowed = SAG_PROBE_TOLERANCE * max(1.0, sag_scale(curvature, conic, terms, height))
            if not abs(value - expected) <= allowed:
                raise differs(where, f"the sag at the height {height!r} mm", value, expected)

    image = read[len(surfaces) + 1]
    hold("the image surface", "z", image.z, float(conditions["imageZ"]))
    hold("the image surface", "its position on the paraxial axis", image.axial, float(conditions["imageZ"]))
    hold("the image surface", "the class of its geometry", image.geometry, "Plane")
    hold("the image surface", "aperture", image.aperture, None)

    hold("the system", "the index of the stop surface", int(optic.surfaces.stop_index) - 1, system["stopIndex"])
    hold("the system", "the type of its aperture", optic.aperture.ap_type, "float_by_stop_size")
    hold("the system", "the stop diameter", _float(optic.aperture.value), 2.0 * float(conditions["stopSemiDiameter"]))
    hold("the system", "the number of wavelengths", int(optic.wavelengths.num_wavelengths), 1)
    hold("the system", "the primary wavelength in µm", _float(optic.primary_wavelength), wavelength)


@dataclass(frozen=True)
class BuiltCase:
    """A case as optiland holds it: one verified optic for each line, in the order of the lines."""

    optics: tuple[Any, ...]


def build_case(case: dict[str, Any], api: OptilandApi | None = None) -> BuiltCase:
    """Builds the optic of every line of a case and verifies each. Raises a ``BuildMismatch`` for one that differs."""
    api = api if api is not None else optiland_api()
    optics = []
    for line in range(len(case["conditions"]["lines"])):
        optic = build_optic(case, line, api)
        verify_optic(optic, case, line, api)
        optics.append(optic)
    return BuiltCase(optics=tuple(optics))


# ── system.describe ──────────────────────────────────────────────────────────────────────────────────────────────


def _f8(values: Sequence[float], shape: Sequence[int] | None = None) -> dict[str, Any]:
    """A float64 array in the wire form, with -0 written as 0 and every NaN as the quiet NaN without a payload."""
    return encode_ndarray("f8", [_plain(value) for value in values], shape)


def _plain(value: float) -> float:
    """A number as an answer states it: -0 is 0, and a NaN is the one NaN, whatever the processor made."""
    return math.nan if value != value else value + 0.0


def describe_optics(
    optics: Sequence[Any], sag_fractions: Sequence[float], api: OptilandApi | None = None
) -> dict[str, Any]:
    """``system.describe`` of built optics, one for each line: every number is read from optiland's objects.

    The layout, the shapes and the apertures are those of the first line's optic (``verify_optic`` has held every
    line's optic to the same case); the index table has one row from each optic, at that optic's own wavelength.

    - ``curvature`` is one division, 1 / radius, which is 0 for optiland's infinite radius; ``conic`` is the
      geometry's ``k``, and 0 for a plane, which has none.
    - ``clipRadius`` and ``innerClipRadius`` are the two radii of each surface's aperture.
    - ``stopSemiDiameter`` is half the stop diameter optiland derives its pupils from: halving the double of a
      number gives the number back.
    - ``sagRadii`` are the fractions of each surface's semi-aperture, one multiplication each, and ``sag`` what
      optiland's geometry evaluates there.
    """
    api = api if api is not None else optiland_api()
    first = optics[0]
    count = int(first.surfaces.num_surfaces) - 2
    wavelengths = [_float(optic.primary_wavelength) for optic in optics]
    rows = read_optic(first, wavelengths[0], api)[1 : count + 1]
    fractions = [float(fraction) for fraction in sag_fractions]
    radii = [[fraction * _semi_aperture(row, number) for fraction in fractions] for number, row in enumerate(rows)]
    sags = [read_sag(first, number + 1, radii[number], api) for number in range(count)]
    index_table = [
        row.index_after
        for optic, wavelength in zip(optics, wavelengths, strict=True)
        for row in read_optic(optic, wavelength, api)[1 : count + 1]
    ]
    sag_shape = [count, len(fractions)]
    return {
        "surfaceCount": count,
        "stopIndex": int(first.surfaces.stop_index) - 1,
        "imageZ": _plain(_float(first.surfaces[count + 1].geometry.cs.z)),
        "stopSemiDiameter": _plain(_float(first.aperture.value) / 2.0),
        "vertexZ": _f8([row.z for row in rows]),
        "curvature": _f8([1.0 / row.radius for row in rows]),
        "conic": _f8([row.conic for row in rows]),
        "clipRadius": _f8([_clip(row.clip_radius, number) for number, row in enumerate(rows)]),
        "innerClipRadius": _f8([_clip(row.inner_clip_radius, number) for number, row in enumerate(rows)]),
        "indexAfterSurface": _f8(index_table, [len(optics), count]),
        "sagRadii": _f8([radius for row in radii for radius in row], sag_shape),
        "sag": _f8([value for row in sags for value in row], sag_shape),
        "terms": [[{"power": power, "coeff": coeff} for power, coeff in row.terms] for row in rows],
    }


def _semi_aperture(row: SurfaceReadback, number: int) -> float:
    """The semi-aperture optiland holds for a surface; without one there is nothing to describe its sag at."""
    if row.semi_aperture is None:
        raise BuildMismatch(f"surface {number}: optiland holds no semi-aperture for it, so its sag has no heights")
    return row.semi_aperture


def _clip(radius: float | None, number: int) -> float:
    """A radius of a surface's aperture as it was read back; a surface without an aperture clips nothing."""
    if radius is None:
        raise BuildMismatch(f"surface {number}: it has no aperture in the optic optiland built, so nothing is clipped")
    return radius
