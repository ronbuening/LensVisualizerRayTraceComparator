"""``rays.trace``: given rays carried through a built optic by optiland's own sequential tracer.

The rays of a request are handed to optiland as they are given: each origin and each direction as the float64 it
is, in a ``RealRays``, with nothing normalised, mirrored, sorted or left out, and ``optic.surfaces.trace`` carries
them through the line's optic. What optiland records on its surfaces is then read back (``record``): row 0 is the
object surface, which holds the rays as they were launched, rows 1 to S are the surfaces of the case, and row S + 1
is the image surface, which optiland traces to itself.

optiland carries every ray to the image surface whatever became of it, and says of a ray only its intensity. What
the contract asks beside that is decided here, from what optiland returned (``settle``):

- **Whether a ray is valid is optiland's own word.** A ray is alive at a surface while its intensity is above 0
  and its point, its direction and its path there are numbers: the rays optiland's own analyses would count. The
  first surface at which it is not is where it ended. Validity is never finiteness alone: a ray that an aperture
  stopped keeps its coordinates and is traced on, with an intensity of 0. A ray optiland keeps alive is answered
  as it has it, the point included, whether or not that point lies on the surface: what optiland lets through is
  for the comparison to judge, not for the worker to withhold.
- **Why a ray ended needs evidence.** optiland stops a ray at whatever point it has, and a NaN fails its aperture
  test like a point outside the rim: its iteration on an asphere ends after its last step whether or not it met
  its tolerance, and its conic solver falls back to a root on the other sheet of a conic where none is admissible.
  So a ray is *blocked* only where what optiland returned shows why it carries no light: a point that lies on
  optiland's own sag of the surface (within ``ON_SURFACE_TOLERANCE_MM``) with an intensity of 0 is a ray an
  aperture stopped; such a point with no direction behind it is totally reflected where optiland's own radicand
  of Snell's law is negative; no point on a conic is a miss where the line's quadratic with the conic has no real
  root. Everything else is *failed*: optiland does not tell a miss of an asphere from an iteration that did not
  converge, and neither does the worker.
- **What the contract rules itself.** A ray that no longer travels toward +z is blocked at the next surface and is
  not met with it; a ray whose exit point lies up to ``IMAGE_PLANE_TOLERANCE_MM`` behind the image plane lands
  where it left; one that cannot reach the plane is blocked with S as its end surface.

The rays of a request are one batch for optiland, or several of ``MAX_BATCH_RAYS`` for a request that large.
optiland's tolerance on an asphere is the batch's, raised to the rounding of the longest step any ray of it takes
to the surface, a ray that has ended among them. On a curved base that is a rounding; on a flat base a ray that
has a point and no direction, one that was totally reflected further up, is 1e14 times its z from the base plane,
and every ray of its batch is left on that plane and answered so (docs/gotchas.md).

Nothing of optiland or numpy is imported when this module is: ``build.optiland_api`` imports them when the first
case is built. The spec is checked with the standard library alone (``read_spec``).
"""

from __future__ import annotations

import math
import warnings
from dataclasses import dataclass
from types import SimpleNamespace
from typing import Any

from lvrtc_worker_kit.ndarray import NdArray, NdArrayError, decode_ndarray, encode_ndarray_bytes
from lvrtc_worker_kit.validate import ValidationIssue

from .build import OptilandApi, optiland_api

RAYS_TRACE = "rays.trace"
"""The id of the quantity that traces given rays: what the identical-ray rungs compare."""

STATUS_OK, STATUS_BLOCKED, STATUS_FAILED = 0, 1, 2
"""How a ray ended, as ``status`` holds it (``RAY_STATUS`` of ``src/contract/quantities/raysTrace.ts``)."""

NO_END_SURFACE = -1
"""The ``endSurface`` of a ray that reached the image plane."""

DIRECTION_NORM_TOLERANCE = 1e-12
"""How far the length of a given direction may be from 1 (``src/contract/quantities/raysTrace.ts``). optiland takes
a direction for a unit vector and never normalises one, so a spec that breaks this is refused, not traced."""

IMAGE_PLANE_TOLERANCE_MM = 1e-9
"""How far behind its exit point the image plane may lie, along the ray, for the ray still to land on it: the
contract's rule for every engine (``src/estimators/imageProjection.ts``)."""

ON_SURFACE_TOLERANCE_MM = 1e-6
"""How far the point of a ray that optiland stopped may lie from the surface optiland itself evaluates, along the
surface's normal, and be a point of that surface: a nanometre. A point further off is one the iteration did not
bring home, or a root on the sheet of a conic that the sag does not describe, and says nothing of where the ray
met the surface. It is no judge of precision, which the comparison is: a conic that optiland meets from an object
100 m away is 6e-8 mm off its own sag by rounding alone (docs/gotchas.md), and that is a hit."""

MISS_MARGIN = 64 * 2.0**-52
"""How far below 0 the discriminant of a line with a conic must be, as a fraction of the terms it is the difference
of, for the line to miss the conic beyond a rounding of those terms."""

MAX_BATCH_RAYS = 16384
"""The most rays handed to optiland in one batch. A larger set is traced in parts, in the order given: optiland
records eight arrays for each surface and each ray of a batch, 1 MB for a batch of this size on one surface."""

METHOD_NAME = "surfaces-trace"
"""The name of the method the answer states: ``optic.surfaces.trace`` on given ``RealRays``."""


def method_params(asphere_tolerance: float, asphere_max_iterations: int) -> dict[str, Any]:
    """The ``params`` of the method: how the rays were traced and how optiland's rows were read."""
    return {
        "asphereTolerance": asphere_tolerance,
        "asphereMaxIterations": asphere_max_iterations,
        "onSurfaceTolerance": ON_SURFACE_TOLERANCE_MM,
        "imagePlaneTolerance": IMAGE_PLANE_TOLERANCE_MM,
        "maxBatchRays": MAX_BATCH_RAYS,
        # optiland traces to its image surface itself: the landing and the path to it are its own rows.
        "landing": "image-surface",
    }


# ── The spec, with the standard library alone ────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class RaySet:
    """The rays of a spec as they came: the bytes of ``origins`` and of ``directions``, and how many rays."""

    line: int
    count: int
    origins: NdArray
    directions: NdArray


def _issue(path: str, message: str) -> ValidationIssue:
    return ValidationIssue(path, "invariant", message)


def _shape_text(shape: Any) -> str:
    return f"[{', '.join(str(size) for size in shape)}]"


def read_spec(spec: dict[str, Any], lines: int) -> tuple[RaySet | None, list[ValidationIssue]]:
    """The rays of a spec that its schema accepted, or what keeps it from being a spec about a case of ``lines`` lines.

    The rules are those of ``src/quantities/raysTrace.ts``, which no schema states, each with the first ray that
    breaks it: ``origins`` and ``directions`` are ``[n, 3]`` and ``weights`` is ``[n]`` for one n of at least 1;
    every array decodes, so its digest is verified; every origin is finite; every direction is a unit vector within
    ``DIRECTION_NORM_TOLERANCE`` with a z component above 0; every weight is finite and not negative; a chief ray
    is one of the rays and a lattice has no more cells than there are rays. Then the one rule that needs the case:
    ``line`` is a line of it.
    """
    issues: list[ValidationIssue] = []
    rays = int(spec["origins"]["$nd"]["shape"][0])
    if rays < 1:
        return None, [_issue("/origins", "it holds no ray: a set has at least one")]
    for name in ("origins", "directions"):
        shape = spec[name]["$nd"]["shape"]
        if shape[0] != rays or shape[1] != 3:
            issues.append(_issue(f"/{name}", f"its shape is {_shape_text(shape)}, expected [{rays}, 3] (rays, xyz)"))
    weight_shape = spec["weights"]["$nd"]["shape"]
    if weight_shape[0] != rays:
        issues.append(_issue("/weights", f"its shape is {_shape_text(weight_shape)}, expected [{rays}] (rays)"))
    if issues:
        return None, issues

    decoded: dict[str, NdArray] = {}
    for name in ("origins", "directions", "weights"):
        try:
            decoded[name] = decode_ndarray(spec[name])
        except NdArrayError as error:
            issues.append(_issue(f"/{name}", str(error)))
    if issues:
        return None, issues

    origins, directions, weights = (decoded[name].values() for name in ("origins", "directions", "weights"))
    stray = next((ray for ray in range(rays) if not all(map(math.isfinite, origins[3 * ray : 3 * ray + 3]))), None)
    if stray is not None:
        issues.append(_issue("/origins", f"the origin of ray {stray} is not finite"))

    def skewed(ray: int) -> bool:
        x, y, z = directions[3 * ray : 3 * ray + 3]
        return not (abs(math.sqrt(x * x + y * y + z * z) - 1) <= DIRECTION_NORM_TOLERANCE) or not (z > 0)

    askew = next((ray for ray in range(rays) if skewed(ray)), None)
    if askew is not None:
        said = f"the direction of ray {askew} is not a unit vector with a z component above 0"
        issues.append(_issue("/directions", said))
    weightless = next((ray for ray in range(rays) if not (math.isfinite(weights[ray]) and weights[ray] >= 0)), None)
    if weightless is not None:
        issues.append(_issue("/weights", f"the weight of ray {weightless} is not a finite number of at least 0"))

    groups = spec.get("groups", {})
    chief = groups.get("chiefIndex")
    if chief is not None and chief >= rays:
        issues.append(_issue("/groups/chiefIndex", f"{chief} is not the index of one of the {rays} rays"))
    lattice = groups.get("lattice")
    if lattice is not None and lattice["columns"] * lattice["rows"] > rays:
        cells = f"{lattice['columns']} x {lattice['rows']}"
        issues.append(_issue("/groups/lattice", f"a lattice of {cells} cells needs more than the {rays} rays"))

    line = int(spec["line"])
    if line >= lines:
        issues.append(_issue("/line", f"{line} is not a line of the case, which has {lines}"))
    if issues:
        return None, issues
    return RaySet(line=line, count=rays, origins=decoded["origins"], directions=decoded["directions"]), []


# ── What optiland recorded ───────────────────────────────────────────────────────────────────────────────────────

_RECORDED = ("x", "y", "z", "L", "M", "N", "intensity", "opd")


@dataclass(frozen=True)
class Rows:
    """What optiland recorded of one batch of n rays through S surfaces: each a float64 array of shape (S + 2, n).

    Row 0 is the object surface, where the rays are as they were launched; row k + 1 is the case's surface k, with
    the ray's point on it and its direction behind it; the last row is the image surface. Points are global, in mm.
    ``opd`` is the sum of index times step from the launch point, a step backwards counted with its sign.
    """

    x: Any
    y: Any
    z: Any
    L: Any
    M: Any
    N: Any
    intensity: Any
    opd: Any


def _bits_differ(np: Any, a: Any, b: Any) -> bool:
    """Whether two float64 arrays are not the same bits: a -0 is not a 0 here, and a NaN is the NaN it is."""
    return a.shape != b.shape or not np.array_equal(a.view(np.uint64), b.view(np.uint64))


def record(optic: Any, origins: Any, directions: Any, api: OptilandApi | None = None) -> Rows:
    """Hands n rays to optiland, has it trace them through every surface of ``optic``, and returns what it recorded.

    ``origins`` and ``directions`` are float64 arrays of shape (n, 3). Each column goes into the ``RealRays`` as a
    copy of its own, bit for bit: optiland takes a direction for a unit vector and normalises nothing. Every ray
    has the optic's one wavelength, in µm, and an intensity of 1.

    What optiland holds at its object surface is then held to what it was given, bit for bit, and its path there to
    0: a ray that optiland took in as another ray is no answer about the ray that was asked. Raises a
    ``RuntimeError`` for that, and for a record that is not one row a surface and one column a ray.

    numpy warns of the square root of a negative number for a ray that misses a surface or is totally reflected;
    the warnings are not passed on. A call of optiland that it has deprecated is an error, not a warning.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    count = int(origins.shape[0])
    given = [np.array(column, dtype=np.float64) for column in (*origins.T, *directions.T)]
    wavelength = np.full(count, float(optic.primary_wavelength), dtype=np.float64)
    with np.errstate(all="ignore"), warnings.catch_warnings():
        warnings.simplefilter("ignore")
        # optiland attributes a deprecation to its caller, which is this module.
        warnings.filterwarnings("error", category=DeprecationWarning, module=r"lvrtc_optiland\.")
        rays = api.RealRays(*(np.copy(column) for column in given), np.ones(count, dtype=np.float64), wavelength)
        optic.surfaces.trace(rays)
        rows = Rows(*(np.asarray(getattr(optic.surfaces, name), dtype=np.float64) for name in _RECORDED))
    expected = (int(optic.surfaces.num_surfaces), count)
    for name in _RECORDED:
        shape = tuple(getattr(rows, name).shape)
        if shape != expected:
            raise RuntimeError(f"optiland recorded {name} in the shape {shape}, not one row a surface: {expected}")
    launched = (rows.x[0], rows.y[0], rows.z[0], rows.L[0], rows.M[0], rows.N[0])
    for name, held, column in zip(_RECORDED, launched, given, strict=False):
        if _bits_differ(np, np.ascontiguousarray(held), column):
            raise RuntimeError(f"optiland does not hold the rays it was given: {name} at its object surface differs")
    if np.any(rows.opd[0] != 0.0):
        raise RuntimeError("optiland's optical path does not start at 0 at the launch point")
    return rows


# ── From optiland's rows to the contract's answer ────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class Traced:
    """The trace of n rays through S surfaces as the contract states it; every array is numpy's.

    ``status`` is uint8 ``[n]`` and ``end_surface`` int32 ``[n]``; ``hits`` is float64 ``[S, n, 3]``, the three
    points ``[n, 3]`` and the two paths ``[n]``. Every value of a ray is NaN from the surface where it ended.
    """

    status: Any
    end_surface: Any
    hits: Any
    exit_point: Any
    exit_direction: Any
    image_point: Any
    optical_path: Any
    optical_path_to_image: Any


_TRACED = (
    "status",
    "end_surface",
    "hits",
    "exit_point",
    "exit_direction",
    "image_point",
    "optical_path",
    "optical_path_to_image",
)

_RAY_AXIS = {"hits": 1}
"""The axis of an answer's array along which its rays lie, where that is not the first."""


def _finite(np: Any, *arrays: Any) -> Any:
    """Where every one of some arrays is a finite number."""
    result = np.isfinite(arrays[0])
    for array in arrays[1:]:
        result = result & np.isfinite(array)
    return result


def _normal(np: Any, geometry: Any, x: Any, y: Any) -> tuple[Any, Any, Any]:
    """optiland's own unit normal of a surface at points of it, as its interaction model asks it.

    A geometry of optiland reads of the rays it is handed their ``x`` and ``y`` in its own frame, which for a
    surface of a case, placed on the axis and not tilted, are the global ones.
    """
    nx, ny, nz = geometry.surface_normal(SimpleNamespace(x=x, y=y))
    return tuple(np.broadcast_to(np.asarray(part, dtype=np.float64), x.shape) for part in (nx, ny, nz))


def _off_surface(np: Any, geometry: Any, x: Any, y: Any, z: Any, normal_z: Any) -> Any:
    """How far points lie from a surface as optiland evaluates it, mm, along the surface's normal.

    The sag optiland gives at the point's x and y, less the point's own height above the vertex, is the distance
    along z; times the z component of the unit normal it is the distance from the surface, to first order, which a
    steep surface does not magnify. A NaN where optiland has no sag or no normal at the point.
    """
    sag = np.broadcast_to(np.asarray(geometry.sag(x=x, y=y), dtype=np.float64), x.shape)
    return np.abs(sag - (z - float(geometry.cs.z))) * np.abs(normal_z)


def _totally_reflected(np: Any, surface: Any, wavelength: Any, heading: tuple[Any, Any, Any], normal: Any) -> Any:
    """Where optiland's own radicand of Snell's law is negative: the rays it had no refracted direction for.

    The expression is that of ``RealRays.refract`` on the numbers it had: the two indices optiland's materials give
    at the rays' wavelength, the direction in front of the surface and optiland's normal at the point.
    """
    u = surface.material_pre.n(wavelength) / surface.material_post.n(wavelength)
    dot = np.abs(heading[0] * normal[0] + heading[1] * normal[1] + heading[2] * normal[2])
    return 1 - u**2 * (1 - dot**2) < 0


def _misses_conic(np: Any, geometry: Any, start: tuple[Any, Any, Any], heading: tuple[Any, Any, Any]) -> Any:
    """Where a ray's line has no point in common with a conic of optiland, beyond a rounding.

    The contract's sag of a conic, ``z = c r^2 / (1 + sqrt(1 - (1 + K) c^2 r^2))`` with ``c = 1 / R``, is a root of
    ``r^2 - 2 R z + (1 + K) z^2 = 0``. A line ``p + t d`` from a point in the surface's frame meets that quadric
    where ``a t^2 + b t + c = 0`` with

        a = dx^2 + dy^2 + (1 + K) dz^2
        b = 2 (px dx + py dy + ((1 + K) pz - R) dz)
        c = px^2 + py^2 + ((1 + K) pz - 2 R) pz

    and nowhere when ``b^2 - 4 a c`` is negative. It is taken for negative only below ``MISS_MARGIN`` of the two
    terms it is the difference of: what one rounding decides is not proven.
    """
    radius, k1 = float(geometry.radius), 1.0 + float(geometry.k)
    px, py, pz = start[0], start[1], start[2] - float(geometry.cs.z)
    dx, dy, dz = heading
    a = dx * dx + dy * dy + k1 * dz * dz
    b = 2.0 * (px * dx + py * dy + (k1 * pz - radius) * dz)
    c = px * px + py * py + (k1 * pz - 2.0 * radius) * pz
    return b * b - 4.0 * a * c < -MISS_MARGIN * (b * b + np.abs(4.0 * a * c))


def settle(optic: Any, rows: Rows, api: OptilandApi | None = None) -> Traced:
    """What optiland's rows of one batch say of each ray, as the contract's answer.

    Surface by surface, for the rays that passed every surface before it:

    1. a ray that does not travel toward +z in front of the surface is blocked there, and optiland's point on the
       surface is not looked at: the contract sends such a ray to no further surface;
    2. a ray with an intensity above 0 whose point, direction and path are numbers passed the surface, at the
       point optiland has;
    3. a ray without a point there is blocked when the surface is a conic that its line provably misses
       (``_misses_conic``), and failed otherwise: on an asphere optiland's iteration starts from the base conic
       and has no point when the line misses that, whether or not it meets the asphere;
    4. a ray with a point that does not lie on the surface (``_off_surface``, ``ON_SURFACE_TOLERANCE_MM``) is
       failed: optiland stopped it, or lost its direction, at a point that is not where it met the surface;
    5. a ray on the surface with an intensity of 0 is blocked: an aperture stopped it;
    6. a ray on the surface with no direction or no path behind it is blocked when optiland's own radicand of
       Snell's law is negative there (``_totally_reflected``), and failed otherwise.

    Behind the last surface a ray that does not travel toward +z, or whose exit point lies more than
    ``IMAGE_PLANE_TOLERANCE_MM`` behind the image plane along the ray, is blocked with S as its end surface. One
    whose exit point lies behind the plane within that reach lands where it left, with the path it has. Any other
    ray lands where optiland's image surface has it, with optiland's path to it; the point's z is written as the
    plane's, which optiland's own must be within ``ON_SURFACE_TOLERANCE_MM``, or the ray is failed.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    surfaces, count = int(rows.x.shape[0]) - 2, int(rows.x.shape[1])
    wavelength = np.full(count, float(optic.primary_wavelength), dtype=np.float64)
    status = np.zeros(count, dtype=np.uint8)
    end = np.full(count, surfaces, dtype=np.int32)
    alive = np.ones(count, dtype=bool)

    with np.errstate(all="ignore"), warnings.catch_warnings():
        warnings.simplefilter("ignore")
        for number in range(surfaces):
            row = number + 1
            surface = optic.surfaces[row]
            geometry = surface.geometry
            before = (rows.x[row - 1], rows.y[row - 1], rows.z[row - 1])
            heading = (rows.L[row - 1], rows.M[row - 1], rows.N[row - 1])
            x, y, z = rows.x[row], rows.y[row], rows.z[row]

            ahead = heading[2] > 0
            pointed = _finite(np, x, y, z)
            lit = rows.intensity[row] > 0
            bent = _finite(np, rows.L[row], rows.M[row], rows.N[row], rows.opd[row])
            passed = alive & ahead & pointed & lit & bent
            ended = alive & ~passed
            if np.any(ended):
                # Why each ended: asked of optiland's own surface, and only where a ray ended.
                normal = _normal(np, geometry, x, y)
                on = pointed & (_off_surface(np, geometry, x, y, z, normal[2]) <= ON_SURFACE_TOLERANCE_MM)
                blocked = ~ahead | (on & ~lit)
                unbent = ended & ahead & on & lit
                if np.any(unbent):
                    blocked = blocked | (unbent & _totally_reflected(np, surface, wavelength, heading, normal))
                pointless = ended & ahead & ~pointed
                if np.any(pointless) and type(geometry) is api.StandardGeometry:
                    blocked = blocked | (pointless & _misses_conic(np, geometry, before, heading))
                status[ended] = np.where(blocked[ended], STATUS_BLOCKED, STATUS_FAILED)
                end[ended] = number
            alive = passed

        left = alive
        image_z = float(optic.surfaces[surfaces + 1].geometry.cs.z)
        exit_x, exit_y, exit_z = rows.x[surfaces], rows.y[surfaces], rows.z[surfaces]
        exit_path = rows.opd[surfaces]
        # The contract's own measure of the way to the plane: one division, as every engine's landing has it.
        along = (image_z - exit_z) / rows.N[surfaces]
        reach = left & (rows.N[surfaces] > 0) & (along >= -IMAGE_PLANE_TOLERANCE_MM)
        status[left & ~reach] = STATUS_BLOCKED
        at_exit = reach & ~(along > 0)
        beyond = reach & (along > 0)
        image_x, image_y, image_path = rows.x[surfaces + 1], rows.y[surfaces + 1], rows.opd[surfaces + 1]
        on_plane = np.abs(rows.z[surfaces + 1] - image_z) <= ON_SURFACE_TOLERANCE_MM
        landed = beyond & _finite(np, image_x, image_y, image_path) & on_plane & (rows.intensity[surfaces + 1] > 0)
        status[beyond & ~landed] = STATUS_FAILED
        arrived = at_exit | landed

    nan = np.nan
    reached = np.arange(surfaces)[:, None] < end[None, :]
    hits = np.empty((surfaces, count, 3), dtype=np.float64)
    for axis, recorded in enumerate((rows.x, rows.y, rows.z)):
        hits[:, :, axis] = np.where(reached, recorded[1 : surfaces + 1], nan)
    exit_point = np.where(left[:, None], np.stack((exit_x, exit_y, exit_z), axis=1), nan)
    heading = np.stack((rows.L[surfaces], rows.M[surfaces], rows.N[surfaces]), axis=1)
    plane = np.full(count, image_z, dtype=np.float64)
    landing = np.stack((np.where(at_exit, exit_x, image_x), np.where(at_exit, exit_y, image_y), plane), axis=1)
    return Traced(
        status=status,
        end_surface=np.where(arrived, NO_END_SURFACE, end).astype(np.int32),
        hits=hits,
        exit_point=exit_point,
        exit_direction=np.where(left[:, None], heading, nan),
        image_point=np.where(arrived[:, None], landing, nan),
        optical_path=np.where(left, exit_path, nan),
        optical_path_to_image=np.where(arrived, np.where(at_exit, exit_path, image_path), nan),
    )


def trace_rays(
    optic: Any, origins: Any, directions: Any, api: OptilandApi | None = None, *, max_batch: int = MAX_BATCH_RAYS
) -> tuple[Traced, int]:
    """The trace of given rays through a built optic, and how many batches optiland traced for it.

    ``origins`` and ``directions`` are float64 arrays of shape (n, 3), in the contract's frame. The rays are handed
    to optiland in the order given, ``max_batch`` at a time, each batch traced once (``record``) and read once
    (``settle``); the answer has the rays in the order given.
    """
    api = api if api is not None else optiland_api()
    np = api.np
    count = int(origins.shape[0])
    parts = []
    for start in range(0, count, max_batch):
        batch = slice(start, start + max_batch)
        parts.append(settle(optic, record(optic, origins[batch], directions[batch], api), api))
    if len(parts) == 1:
        return parts[0], 1
    joined = (
        np.concatenate([getattr(part, name) for part in parts], axis=_RAY_AXIS.get(name, 0)) for name in _TRACED
    )
    return Traced(*joined), len(parts)


# ── On the wire ──────────────────────────────────────────────────────────────────────────────────────────────────


def ray_columns(rays: RaySet, api: OptilandApi | None = None) -> tuple[Any, Any]:
    """The origins and the directions of a spec as float64 arrays of shape (n, 3): the bytes that came, unchanged."""
    api = api if api is not None else optiland_api()
    np = api.np
    shape = (rays.count, 3)
    return (
        np.frombuffer(rays.origins.data, dtype="<f8").reshape(shape),
        np.frombuffer(rays.directions.data, dtype="<f8").reshape(shape),
    )


def encode_trace(traced: Traced, api: OptilandApi | None = None) -> dict[str, Any]:
    """An answer as ``rays.trace`` data: each array in the wire form, with the bits it has."""
    api = api if api is not None else optiland_api()
    np = api.np

    def wire(dtype: str, code: str, array: Any) -> dict[str, Any]:
        return encode_ndarray_bytes(dtype, np.ascontiguousarray(array, dtype=code).tobytes(), list(array.shape))

    return {
        "status": wire("u1", "u1", traced.status),
        "endSurface": wire("i4", "<i4", traced.end_surface),
        "hits": wire("f8", "<f8", traced.hits),
        "exitPoint": wire("f8", "<f8", traced.exit_point),
        "exitDirection": wire("f8", "<f8", traced.exit_direction),
        "imagePoint": wire("f8", "<f8", traced.image_point),
        "opticalPath": wire("f8", "<f8", traced.optical_path),
        "opticalPathToImage": wire("f8", "<f8", traced.optical_path_to_image),
    }


_STATUS_NAMES = (("ok", STATUS_OK), ("blocked", STATUS_BLOCKED), ("failed", STATUS_FAILED))


def ray_counts(traced: Traced, api: OptilandApi | None = None) -> dict[str, int]:
    """How many rays of an answer ended in each way."""
    api = api if api is not None else optiland_api()
    np = api.np
    by_status = {name: int(np.count_nonzero(traced.status == code)) for name, code in _STATUS_NAMES}
    return {"rays": int(traced.status.shape[0]), **by_status}
