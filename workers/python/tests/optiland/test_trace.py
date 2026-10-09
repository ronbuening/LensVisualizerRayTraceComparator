"""``rays.trace`` of the worker: the spec, the rays as optiland is given them, and what optiland's rows become.

The first classes need no optiland: the rules of a spec, and what the engine does before a case is built. The rest
runs on the real optiland and skips, with the reason, under an interpreter that has none
(``npm run test:optiland``). Nothing here imports optiland: rays go in through the engine or through
``lvrtc_optiland.trace``.

Every expected value is derived here, and never taken from an engine: closed forms of a plate, of one sphere, of
the aplanatic points and of the two Cartesian conics, and for everything else a trace in 60-digit decimal
arithmetic (``exact.exact_trace``) that is written from the contract alone: Newton's method on the contract's sag
from the surface's vertex plane, the textbook vector form of Snell's law, and the contract's rules of where a ray
ends. What an answer's optical path is made of, and what it is held to, is ``test_path.py``'s.
"""

from __future__ import annotations

import dataclasses
import math
import unittest
import warnings
from decimal import Decimal, getcontext
from typing import Any

from lvrtc_optiland import trace
from lvrtc_optiland.build import BuildMismatch, build_case, optiland_api
from lvrtc_optiland.engine import QUANTITIES, OptilandEngine
from lvrtc_optiland.trace import (
    DIRECTION_NORM_TOLERANCE,
    IMAGE_PLANE_TOLERANCE_MM,
    MAX_BATCH_RAYS,
    ON_SURFACE_TOLERANCE_MM,
    OPTICAL_PATH_RULE,
    RAYS_TRACE,
    STATUS_BLOCKED,
    STATUS_FAILED,
    STATUS_OK,
    read_spec,
)
from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray
from lvrtc_worker_kit.validate import contract_schemas, quantity_schema_id, validate, validate_kind

from .exact import Point, exact_sag, exact_trace
from .support import (
    PLANE,
    REPO_ROOT,
    asphere,
    f8,
    make_case,
    ray_spec,
    read_fixture,
    real_optiland_missing,
    sphere,
    surface,
    trace_request,
)
from .traced import AXIS, IDENTITY, Answer, TracedRays, is_finite, unit

MISSING = real_optiland_missing()
getcontext().prec = 60

SINGLET = read_fixture("valid", "optical-case", "singlet.json")
WORKED_SPEC = read_fixture("valid", "quantities", "rays.trace.spec", "singlet-axis-and-rim.json")
WORKED_DATA = read_fixture("valid", "quantities", "rays.trace.data", "singlet-axis-and-rim.json")

# ── Without optiland: the spec ───────────────────────────────────────────────────────────────────────────────────


class SpecTest(unittest.TestCase):
    """``read_spec``: the rules of ``src/quantities/raysTrace.ts`` that no schema states, and the one of the case."""

    def issues(self, spec: dict[str, Any], lines: int = 1) -> list[str]:
        self.assertEqual(validate(contract_schemas(), quantity_schema_id(RAYS_TRACE, "spec"), spec), [])
        rays, issues = read_spec(spec, lines)
        self.assertEqual(rays is None, bool(issues))
        return [f"{issue.path} [{issue.keyword}] {issue.message}" for issue in issues]

    def test_the_rays_of_a_spec_are_handed_on_as_the_bytes_that_came(self) -> None:
        origins = [(0.0, -0.0, -10.0), (1.5, 5e-324, -10.0)]
        directions = [AXIS, (-0.0, 0.6, 0.8)]
        spec = ray_spec(origins, directions, line=2, chiefIndex=1, lattice={"columns": 1, "rows": 1, "step": 0.5})
        rays, issues = read_spec(spec, 3)
        self.assertEqual(issues, [])
        assert rays is not None
        self.assertEqual((rays.line, rays.count), (2, 2))
        self.assertEqual(rays.origins.data, decode_ndarray(spec["origins"]).data)
        self.assertEqual(rays.directions.data, decode_ndarray(spec["directions"]).data)
        # A -0 and the smallest subnormal are the bits they came as.
        self.assertEqual(rays.origins.data[8:16].hex(), "0000000000000080")
        self.assertEqual(rays.origins.data[32:40].hex(), "0100000000000000")
        # The contract's own two specs are specs, the second of a case with a second line.
        for name, lines in (("singlet-axis-and-rim", 1), ("lattice-with-chief", 2)):
            spec = read_fixture("valid", "quantities", "rays.trace.spec", f"{name}.json")
            self.assertEqual(self.issues(spec, lines), [], name)

    def test_each_rule_names_the_first_ray_that_breaks_it(self) -> None:
        good = [AXIS, AXIS, AXIS]
        start = [(0.0, 0.0, -1.0)] * 3
        nan, inf = math.nan, math.inf
        for spec, said in (
            (ray_spec([(0.0, 0.0, -1.0), (nan, 0.0, -1.0), (inf, 0.0, -1.0)], good), "/origins [invariant] the origin"),
            (
                ray_spec(start, [AXIS, (0.0, 0.0, 1.0 + 3e-12), AXIS]),
                "/directions [invariant] the direction of ray 1 is not a unit vector with a z component above 0",
            ),
            (ray_spec(start, [AXIS, AXIS, (0.0, 1.0, 0.0)]), "/directions [invariant] the direction of ray 2 is not"),
            (ray_spec(start, [(0.0, 0.6, -0.8), AXIS, AXIS]), "/directions [invariant] the direction of ray 0 is not"),
            (ray_spec(start, [AXIS, (nan, 0.0, 1.0), AXIS]), "/directions [invariant] the direction of ray 1 is not"),
            (ray_spec(start, good, weights=[1.0, -0.5, 1.0]), "/weights [invariant] the weight of ray 1 is not"),
            (ray_spec(start, good, weights=[inf, 1.0, 1.0]), "/weights [invariant] the weight of ray 0 is not"),
            (ray_spec(start, good, chiefIndex=3), "/groups/chiefIndex [invariant] 3 is not the index of one of the 3"),
            (
                ray_spec(start, good, lattice={"columns": 2, "rows": 2, "step": 1}),
                "/groups/lattice [invariant] a lattice of 2 x 2 cells needs more than the 3 rays",
            ),
            (ray_spec(start, good, line=1), "/line [invariant] 1 is not a line of the case, which has 1"),
        ):
            issues = self.issues(spec)
            self.assertEqual(len(issues), 1, issues)
            self.assertTrue(issues[0].startswith(said), issues[0])
        self.assertEqual(self.issues(ray_spec(start, good)), [])
        # A direction may be as far from a unit vector as the contract allows, and a weight may be 0.
        within = 1.0 - DIRECTION_NORM_TOLERANCE / 2
        self.assertEqual(self.issues(ray_spec(start, [AXIS, (0.0, 0.0, within), AXIS], weights=[0.0, 1.0, 2.0])), [])

    def test_arrays_that_are_not_one_set_of_rays_and_bytes_that_are_not_what_they_say(self) -> None:
        two = [(0.0, 0.0, -1.0), (1.0, 0.0, -1.0)]
        spec = ray_spec(two, [AXIS, AXIS])
        other = ray_spec([*two, (2.0, 0.0, -1.0)], [AXIS] * 3)
        mixed = {**spec, "directions": other["directions"], "weights": other["weights"]}
        self.assertEqual(
            self.issues(mixed),
            [
                "/directions [invariant] its shape is [3, 3], expected [2, 3] (rays, xyz)",
                "/weights [invariant] its shape is [3], expected [2] (rays)",
            ],
        )
        flat = {**spec, "origins": encode_ndarray("f8", [0.0, 0.0, -1.0, 1.0], [2, 2])}
        self.assertEqual(self.issues(flat), ["/origins [invariant] its shape is [2, 2], expected [2, 3] (rays, xyz)"])
        empty = {
            "line": 0,
            "origins": encode_ndarray("f8", [], [0, 3]),
            "directions": encode_ndarray("f8", [], [0, 3]),
            "weights": encode_ndarray("f8", [], [0]),
        }
        self.assertEqual(self.issues(empty), ["/origins [invariant] it holds no ray: a set has at least one"])
        # A digest that is not the data's: the array is refused, with the codec's own words.
        wire = dict(spec["origins"]["$nd"])
        wire["sha256"] = "0" * 64
        (issue,) = self.issues({**spec, "origins": {"$nd": wire}})
        self.assertTrue(issue.startswith("/origins [invariant] ndarray: sha256 mismatch"), issue)

    def test_the_limits_are_the_contracts_own(self) -> None:
        # Each is restated here from a constant of the comparator: the source says the same number.
        quantity = (REPO_ROOT / "src" / "contract" / "quantities" / "raysTrace.ts").read_text(encoding="utf-8")
        self.assertIn("export const DIRECTION_NORM_TOLERANCE = 1e-12;", quantity)
        self.assertIn("export const RAY_STATUS = Object.freeze({ ok: 0, blocked: 1, failed: 2 } as const);", quantity)
        self.assertIn("export const NO_END_SURFACE = -1;", quantity)
        self.assertIn("export const RAYS_TRACE_VERSION = 1;", quantity)
        projection = (REPO_ROOT / "src" / "estimators" / "imageProjection.ts").read_text(encoding="utf-8")
        self.assertIn("export const IMAGE_PLANE_TOLERANCE_MM = 1e-9;", projection)
        self.assertEqual((DIRECTION_NORM_TOLERANCE, IMAGE_PLANE_TOLERANCE_MM), (1e-12, 1e-9))
        self.assertEqual((STATUS_OK, STATUS_BLOCKED, STATUS_FAILED, trace.NO_END_SURFACE), (0, 1, 2, -1))
        self.assertEqual(QUANTITIES[RAYS_TRACE], {"version": 1})


class RunTest(unittest.TestCase):
    """The engine's ``run`` of ``rays.trace`` up to the point where optiland is needed."""

    def engine(self, outcome: Exception) -> tuple[OptilandEngine, list[Any]]:
        asked: list[Any] = []

        def build(case: dict[str, Any], **more: Any) -> Any:
            asked.append((case["id"], more))
            raise outcome

        return OptilandEngine(IDENTITY, build=build), asked

    def test_a_spec_that_is_not_one_is_answered_before_anything_is_built(self) -> None:
        engine, asked = self.engine(AssertionError("nothing here builds an optic"))
        start = [(0.0, 0.0, -10.0)]
        for spec, said in (
            ({}, "[required]"),
            ({**WORKED_SPEC, "rays": 2}, "[additionalProperties]"),
            (ray_spec(start, [(0.0, 0.0, 0.5)]), "/directions [invariant] the direction of ray 0 is not a unit vector"),
            (ray_spec(start, [AXIS], line=1), "/line [invariant] 1 is not a line of the case, which has 1"),
        ):
            answered = engine.run(trace_request(SINGLET, spec), SINGLET)
            self.assertEqual(validate_kind("result", answered), [])
            self.assertEqual((answered["status"], answered["error"]["code"]), ("error", "bad-spec"), spec)
            self.assertTrue(answered["error"]["message"].startswith("spec is not a rays.trace spec: "), answered)
            self.assertIn(said, answered["error"]["message"])
        self.assertEqual(asked, [])

    def test_only_the_optic_of_the_specs_line_is_built_and_one_that_is_not_the_case_is_an_error(self) -> None:
        two_lines = make_case([surface(0.0, sphere(50.0))], lines=(587.5618, 486.1327))
        said = "surface 0 (1): radius is 5.0 in the optic optiland built and 50.0 in the case (line 1, 486.1327 nm)"
        engine, asked = self.engine(BuildMismatch(said))
        spec = ray_spec([(0.0, 0.0, -10.0)], [AXIS], line=1)
        answered = engine.run(trace_request(two_lines, spec), two_lines)
        self.assertEqual(asked, [(two_lines["id"], {"lines": (1,)})])
        self.assertEqual(validate_kind("result", answered), [])
        self.assertEqual(answered["error"], {"code": "build-mismatch", "message": said})
        self.assertNotIn("data", answered)

    def test_any_other_failure_is_raised_for_the_protocol_loop_to_answer(self) -> None:
        engine, _ = self.engine(ModuleNotFoundError("No module named 'optiland.geometries'"))
        with self.assertRaises(ModuleNotFoundError):
            engine.run(trace_request(SINGLET, WORKED_SPEC), SINGLET)


# ── On the real optiland ─────────────────────────────────────────────────────────────────────────────────────────


@unittest.skipIf(MISSING is not None, MISSING)
class TraceTest(TracedRays):
    """Given rays through optiland, held to what the contract says of them."""

    # ── Closed forms ──

    def test_a_plate_shifts_a_ray_sideways_and_leaves_its_direction(self) -> None:
        thickness, n = 6.0, 1.5
        case = make_case([surface(0.0, PLANE), surface(thickness, PLANE)])
        origin, d = (1.0, -2.0, -5.0), unit(0.3, -0.1, 1.0)
        answer = self.answer(case, [origin], [d])
        self.assertEqual((answer.status, answer.end), ([0], [-1]))
        # In front: a straight line to z = 0. In the glass the transverse direction is 1/n of what it was.
        first = tuple(origin[axis] + (5.0 / d[2]) * d[axis] for axis in range(3))
        inside_z = math.sqrt(1 - (d[0] ** 2 + d[1] ** 2) / n**2)
        inside = (d[0] / n, d[1] / n, inside_z)
        second = tuple(first[axis] + (thickness / inside_z) * inside[axis] for axis in range(3))
        image_z = case["conditions"]["imageZ"]
        landing = tuple(second[axis] + ((image_z - thickness) / d[2]) * d[axis] for axis in range(3))
        self.assert_near(answer.hits[0][0], first, 1e-14)
        self.assert_near(answer.hits[1][0], second, 1e-14)
        self.assert_near(answer.exit_direction[0], d, 1e-15)
        self.assert_near(answer.image[0], landing, 1e-13)
        self.assertEqual(answer.image[0][2], image_z, "the landing's z is the plane's own number")
        to_last = 5.0 / d[2] + n * thickness / inside_z
        self.assert_near(answer.path[0], to_last, 1e-14)
        self.assert_near(answer.path_image[0], to_last + (image_z - thickness) / d[2], 1e-13)
        # The plate shifts the ray by t sin(a) (1 - cos(a) / (n cos(a'))), a the angle of incidence.
        sine = math.hypot(d[0], d[1])
        shift = thickness * sine * (1 - d[2] / (n * inside_z))
        undeviated = tuple(origin[axis] + ((image_z + 5.0) / d[2]) * d[axis] for axis in range(2))
        moved = math.hypot(answer.image[0][0] - undeviated[0], answer.image[0][1] - undeviated[1])
        self.assertAlmostEqual(moved * d[2], shift, delta=1e-13)

    def test_one_sphere_by_hand(self) -> None:
        radius, n, height = 50.0, 1.5, 10.0
        focus = n * radius / (n - 1)
        case = make_case([surface(0.0, sphere(radius), 20.0)], image_z=focus)
        answer = self.answer(case, [(0.0, height, -5.0), (0.0, 0.0, -5.0)], [AXIS, AXIS])
        self.assertEqual(answer.status, [0, 0])
        # A ray parallel to the axis meets the sphere where sin(i) = h / R, and leaves it at i - i' to the axis.
        sag = radius - math.sqrt(radius**2 - height**2)
        incidence = math.asin(height / radius)
        turned = incidence - math.asin(math.sin(incidence) / n)
        self.assert_near(answer.hits[0][0], (0.0, height, sag), 1e-14)
        self.assert_near(answer.exit_direction[0], (0.0, -math.sin(turned), math.cos(turned)), 1e-15)
        self.assert_near(answer.image[0], (0.0, height - (focus - sag) * math.tan(turned), focus), 2e-13)
        self.assert_near(answer.path[0], 5.0 + sag, 1e-14)
        self.assert_near(answer.path_image[0], 5.0 + sag + n * (focus - sag) / math.cos(turned), 2e-13)
        # Spherical aberration: the ray at 10 mm crosses the axis in front of the paraxial focus.
        self.assertLess(answer.image[0][1], -0.01)
        # The ray along the axis is bent by nothing: n times the way to the paraxial focus.
        self.assert_near(answer.hits[0][1], (0.0, 0.0, 0.0), 1e-14)
        self.assert_near(answer.exit_direction[1], AXIS, 2e-16)
        self.assert_near(answer.image[1], (0.0, 0.0, focus), 0.0)
        self.assert_near(answer.path_image[1], 5.0 + n * focus, 1e-13)

    def test_the_aplanatic_points_of_a_sphere_at_every_aperture(self) -> None:
        # Rays in air aimed at the point n R behind the centre of a sphere of glass all pass, in the glass, through
        # the point R / n behind the centre: exactly, at every aperture. And since every point A of the sphere is
        # n times as far from the first point as from the second, the optical path to the second is the distance
        # from the origin to the first: |OA| + n |AP'| = |OA| + |AP| = |OP|.
        radius, n = 20.0, 1.5
        aimed_at = radius + n * radius
        meet = radius + radius / n
        case = make_case([surface(0.0, sphere(radius), 19.0)], image_z=meet)
        heights = ((0.0, 1.0), (0.0, 6.0), (3.0, -9.0), (-12.0, 5.0), (0.0, 18.5), (13.0, 13.0))
        starts = [(x, y, -5.0) for x, y in heights]
        directions = [unit(-x, -y, aimed_at - z) for x, y, z in starts]
        answer = self.answer(case, starts, directions)
        self.assertEqual(answer.status, [0] * len(starts))
        for ray, start in enumerate(starts):
            hit = answer.hits[0][ray]
            self.assertGreater(math.hypot(hit[0], hit[1]), 0.5)
            self.assert_near(answer.image[ray], (0.0, 0.0, meet), 2e-14, ray)
            self.assert_near(answer.path_image[ray], math.dist(start, (0.0, 0.0, aimed_at)), 1e-13, ray)
            # Behind the surface the ray points at the second point.
            onward = unit(-hit[0], -hit[1], meet - hit[2])
            self.assert_near(answer.exit_direction[ray], onward, 2e-15, ray)
        # The widest of them meets the sphere more than 14 mm off its axis, where it is 6 mm deep.
        self.assertGreater(max(math.hypot(hit[0], hit[1]) for hit in answer.hits[0]), 14.0)

    def test_the_cartesian_ellipsoid_and_hyperboloid_focus_collimated_light_with_equal_paths(self) -> None:
        n, radius = 1.5, 20.0
        heights = [(0.0, 0.0), (0.0, 2.0), (-5.0, 3.0), (7.0, 7.0), (0.0, -14.0), (12.0, -9.0)]
        starts = [(x, y, -5.0) for x, y in heights]
        # Air into glass: the ellipsoid of conic constant -1/n^2 focuses a collimated beam at n R / (n - 1).
        focus = n * radius / (n - 1)
        ellipsoid = make_case([surface(0.0, sphere(radius, -1 / n**2), 16.0)], image_z=focus)
        answer = self.answer(ellipsoid, starts, [AXIS] * len(starts))
        self.assertEqual(answer.status, [0] * len(starts))
        for ray in range(len(starts)):
            self.assert_near(answer.image[ray], (0.0, 0.0, focus), 5e-14, ray)
            self.assert_near(answer.path_image[ray], 5.0 + n * focus, 1e-13, ray)
        # Glass into air: behind a plane, the hyperboloid of conic constant -n^2 focuses it at |R| / (n - 1).
        thickness = 8.0
        behind = radius / (n - 1)
        back = surface(thickness, sphere(-radius, -(n**2)), 16.0)
        hyperboloid = make_case([surface(0.0, PLANE, 16.0), back], image_z=thickness + behind)
        answer = self.answer(hyperboloid, starts, [AXIS] * len(starts))
        self.assertEqual(answer.status, [0] * len(starts))
        for ray in range(len(starts)):
            self.assert_near(answer.image[ray], (0.0, 0.0, thickness + behind), 5e-14, ray)
            self.assert_near(answer.path_image[ray], 5.0 + n * thickness + behind, 1e-13, ray)
        # The ray 14 mm from the axis took another way to the same path: it left the glass 4.3 mm earlier.
        self.assertLess(answer.hits[1][4][2], thickness - 4.0)

    # ── Against the trace in 60 digits ──

    def test_aspheres_even_and_odd_against_an_independent_solve(self) -> None:
        front = asphere(30.0, -0.7, (4, 2e-5), (6, -3e-8), (8, 1e-11))
        back = asphere(-40.0, 0.3, (3, 1e-5), (4, -2e-6), (5, 1e-8))
        flat = asphere(None, 0.0, (4, -3e-5), (6, 2e-8))
        case = make_case(
            [surface(0.0, front, 9.0), surface(5.0, back, 9.0), surface(9.0, flat, 9.0), surface(11.0, PLANE, 9.0)]
        )
        origins = [(0.0, 0.0, -4.0), (0.0, 7.5, -4.0), (-3.0, 2.0, -4.0), (5.0, -6.0, -4.0), (1.0, 8.0, -4.0)]
        directions = [AXIS, AXIS, unit(0.05, -0.02, 1.0), unit(-0.1, 0.12, 1.0), unit(0.02, -0.25, 1.0)]
        answer = self.answer(case, origins, directions)
        self.assertEqual(answer.status, [0] * 5)
        # optiland's iteration stops at a residual of 1e-12 mm, and the answer is the truth to a few of those.
        self.assert_is_the_exact_trace(case, answer, origins, directions, 1e-11)
        self.assertEqual(
            answer.result["method"],
            {
                "name": "surfaces-trace",
                "params": {
                    "asphereTolerance": 1e-12,
                    "asphereMaxIterations": 100,
                    "onSurfaceTolerance": ON_SURFACE_TOLERANCE_MM,
                    "imagePlaneTolerance": IMAGE_PLANE_TOLERANCE_MM,
                    "maxBatchRays": MAX_BATCH_RAYS,
                    "landing": "image-surface",
                    "opticalPath": OPTICAL_PATH_RULE,
                },
            },
        )
        counts = {"surfaces": 4, "rays": 5, "ok": 5, "blocked": 0, "failed": 0, "batches": 1}
        self.assertEqual(answer.result["diagnostics"], {"warnings": [], "counts": counts})

    def test_skew_rays_through_a_lens_of_spheres_and_their_invariant(self) -> None:
        lens = [surface(0.0, sphere(40.0), 12.0), surface(6.0, sphere(-35.0), 12.0)]
        case = make_case([*lens, surface(9.0, sphere(-60.0, 0.4), 12.0)], indices=[[1.6, 1.3, 1.0]])
        origins = [(4.0, -7.0, -10.0), (-9.0, 2.0, -10.0), (6.0, 6.0, -10.0), (0.0, -11.0, -10.0)]
        directions = [unit(-0.2, 0.1, 1.0), unit(0.05, 0.3, 1.0), unit(-0.15, 0.1, 1.0), unit(0.3, 0.2, 1.0)]
        answer = self.answer(case, origins, directions)
        self.assertEqual(answer.status, [0] * 4)
        # A conic is met in closed form: the answer is the truth to a rounding of a length of some tens of mm.
        self.assert_is_the_exact_trace(case, answer, origins, directions, 2e-13)
        # Around an axis of symmetry n (x M - y L) of a ray is the same in front of the lens and behind it.
        for ray, (origin, d) in enumerate(zip(origins, directions, strict=True)):
            before = origin[0] * d[1] - origin[1] * d[0]
            point, out = answer.image[ray], answer.exit_direction[ray]
            self.assertGreater(abs(before), 0.1, "the ray is skew")
            self.assertAlmostEqual(point[0] * out[1] - point[1] * out[0], before, delta=2e-13)

    def test_where_two_neighbouring_surfaces_cross_the_ray_steps_backwards(self) -> None:
        # A plane, a sphere and an asphere, each set into the curve of the sphere before it: at a height of 4 mm
        # that sphere is 0.83 mm deep, and the next surface lies behind the hit on it.
        origins = [(4.0, 0.0, -5.0), (1.0, 0.0, -5.0), (-2.5, 3.0, -5.0)]
        directions = [AXIS, AXIS, unit(0.02, -0.03, 1.0)]
        for name, following, within in (
            ("plane", surface(0.5, PLANE, 6.0), 2e-14),
            ("sphere", surface(0.3, sphere(-50.0), 6.0), 2e-14),
            ("asphere", surface(0.3, asphere(-50.0, 0.0, (4, 1e-5)), 6.0), 5e-12),
        ):
            case = make_case([surface(0.0, sphere(10.0), 6.0), following])
            answer = self.answer(case, origins, directions)
            self.assertEqual(answer.status, [0, 0, 0], name)
            self.assert_is_the_exact_trace(case, answer, origins, directions, within)
            # The first ray: back by a third of a millimetre or more, and its path is shorter for it. The second
            # meets the first sphere 0.05 mm deep, in front of the next surface, and steps forwards.
            first, second = answer.hits[0][0], answer.hits[1][0]
            self.assertAlmostEqual(first[2], 10.0 - math.sqrt(84.0), delta=1e-14)
            self.assertLess(second[2], first[2] - 0.3, name)
            self.assertLess(answer.path[0], 5.0 + first[2] - 1.5 * 0.3, name)
            self.assertGreater(answer.hits[1][1][2], answer.hits[0][1][2], name)

    # ── Where a ray ends ──

    def test_a_total_internal_reflection_is_blocked_at_the_surface_that_reflects(self) -> None:
        # A plane, then a hemisphere of radius 10 out of glass of index 1.5: a ray parallel to the axis meets it at
        # sin(i) = h / 10, and is totally reflected where 1.5 h / 10 is above 1, beyond a height of 6.67 mm.
        case = make_case([surface(0.0, PLANE, 9.9), surface(10.0, sphere(-10.0), 9.9)])
        origins = [(6.6, 0.0, -5.0), (6.7, 0.0, -5.0), (0.0, -9.0, -5.0)]
        answer = self.answer(case, origins, [AXIS] * 3)
        self.assertEqual((answer.status, answer.end), ([0, 1, 1], [-1, 1, 1]))
        self.assert_near(answer.hits[0][1], (6.7, 0.0, 0.0), 0.0)
        self.assert_is_the_exact_trace(case, answer, origins, [AXIS] * 3, 2e-13)
        # The one that passes leaves 81.5 degrees from the normal: sin(i') = 0.99.
        self.assertAlmostEqual(math.sin(math.asin(0.66) + math.acos(answer.exit_direction[0][2])), 0.99, delta=1e-13)

    def test_a_line_that_misses_a_conic_is_blocked_and_one_that_optiland_has_no_point_of_on_an_asphere_is_failed(
        self,
    ) -> None:
        # A sphere of radius 5 with a clear aperture of 4.9: a line 6 mm from the axis and parallel to it meets no
        # sphere of that radius, which the quadratic of the two says; one 4.95 mm from it meets the sphere outside
        # the clear aperture.
        origins = [(6.0, 0.0, -5.0), (0.0, 4.95, -5.0), (4.9, 0.0, -5.0), (0.0, 0.0, -5.0)]
        conic = make_case([surface(0.0, sphere(5.0), 4.9)])
        answer = self.answer(conic, origins, [AXIS] * 4)
        self.assertEqual((answer.status, answer.end), ([1, 1, 0, 0], [0, 0, -1, -1]))
        self.assert_is_the_exact_trace(conic, answer, origins, [AXIS] * 4, 2e-13)
        # The same base with a term: optiland's iteration starts from the base conic's hit and has none to start
        # from. Whether the line meets the asphere it does not say, so the worker does not either.
        bent = make_case([surface(0.0, asphere(5.0, 0.0, (4, 1e-4)), 4.9)])
        answer = self.answer(bent, origins, [AXIS] * 4)
        self.assertEqual((answer.status, answer.end), ([2, 1, 0, 0], [0, 0, -1, -1]))
        counts = answer.result["diagnostics"]["counts"]
        self.assertEqual((counts["ok"], counts["blocked"], counts["failed"]), (2, 1, 1))

    def test_an_asphere_whose_base_conic_a_line_misses_is_lost_to_optiland_though_the_line_meets_it(self) -> None:
        # A paraboloid of radius 2, z = r^2 / 4, made shallow by a term of power 2: the surface is z = r^2 / 20.
        # The line z = -0.3 + 0.3 y misses the paraboloid (y^2 / 4 - 0.3 y + 0.3 has no root) and meets the surface
        # at y = 3 - sqrt(3), inside its clear aperture, where the contract passes it. A phone lens has such
        # surfaces (docs/gotchas.md).
        shape = asphere(2.0, -1.0, (2, 0.05 - 0.25))
        case = make_case([surface(0.0, shape, 2.5), surface(1.0, PLANE, 6.0)], indices=[[1.5, 1.0]])
        origin, d = (0.0, -1.0, -0.6), unit(0.0, 1.0, 0.3)
        exact = exact_trace(case, origin, d)
        self.assertEqual(len(exact.hits), 2, "by the contract the ray passes both surfaces")
        self.assertAlmostEqual(float(exact.hits[0][1]), 3 - math.sqrt(3), delta=1e-9)
        self.assertLess(0.3**2 - 4 * 0.25 * 0.3, 0, "the line misses the base conic")
        # A second ray, along the axis, is traced: the first is optiland's failure, not the surface's.
        answer = self.answer(case, [origin, (0.0, 0.0, -0.6)], [d, AXIS])
        self.assertEqual((answer.status, answer.end), ([STATUS_FAILED, STATUS_OK], [0, -1]))

    def test_the_clip_radius_is_inclusive_and_so_is_the_radius_of_a_central_obstruction(self) -> None:
        # A plane does not move a ray that is parallel to the axis, so each ray is at its height to the bit. The
        # two radii have squares that are doubles (6.25 and 1), as (1.5, 2) has: optiland compares squares.
        clip, inner = 2.5, 1.0
        case = make_case([surface(0.0, PLANE, clip, inner=inner), surface(3.0, PLANE, 9.0)])
        at = [
            (clip, 0.0),
            (1.5, 2.0),
            (math.nextafter(clip, 0.0), 0.0),
            (math.nextafter(clip, 9.0), 0.0),
            (0.0, -2.6),
            (inner, 0.0),
            (0.0, -math.nextafter(inner, 9.0)),
            (math.nextafter(inner, 0.0), 0.0),
            (0.0, 0.0),
        ]
        origins = [(x, y, -1.0) for x, y in at]
        answer = self.answer(case, origins, [AXIS] * len(at))
        self.assertEqual(answer.status, [0, 0, 0, 1, 1, 0, 0, 1, 1])
        self.assertEqual(answer.end, [-1, -1, -1, 0, 0, -1, -1, 0, 0])
        self.assert_is_the_exact_trace(case, answer, origins, [AXIS] * len(at), 1e-14)
        # A ray that passes at the rim is where it was put, to the bit, on both planes.
        self.assertEqual(answer.hits[0][0], (clip, 0.0, 0.0))
        self.assertEqual(answer.hits[1][1][:2], (1.5, 2.0))

    def test_a_ray_lands_on_a_plane_within_its_reach_and_is_blocked_by_one_behind_it(self) -> None:
        thickness = 6.0
        origin, d = [(1.0, 2.0, -5.0), (0.0, 0.0, -5.0)], [unit(0.2, -0.3, 1.0), AXIS]

        def plate(image_z: float) -> Answer:
            return self.answer(make_case([surface(0.0, PLANE), surface(thickness, PLANE)], image_z=image_z), origin, d)

        # The rear face is the image plane: the ray lands where it left, with the path it has.
        on = plate(thickness)
        self.assertEqual(on.status, [0, 0])
        for ray in range(2):
            self.assert_near(on.image[ray], on.exit_point[ray], 2e-15, ray)
            self.assertEqual(on.image[ray][2], thickness)
            self.assert_near(on.path_image[ray], on.path[ray], 2e-15, ray)
        # Half a nanometre behind the exit point: within the contract's reach, and the landing is the exit point
        # itself, bit for bit, where a projection would step back along the ray.
        near = plate(thickness - 5e-10)
        self.assertEqual(near.status, [0, 0])
        for ray in range(2):
            self.assertEqual(near.image[ray], (*near.exit_point[ray][:2], thickness - 5e-10))
            self.assertEqual(near.path_image[ray], near.path[ray])
        # A micrometre behind it: the ray passed every surface and cannot reach the plane.
        behind = plate(thickness - 1e-6)
        self.assertEqual((behind.status, behind.end), ([1, 1], [2, 2]))
        self.assertTrue(is_finite(behind.exit_point[0]) and is_finite(behind.exit_direction[0]))
        # Just outside the reach along the oblique ray, and inside it along the axis: the reach is along the ray.
        slant = plate(thickness - 9.5e-10)
        self.assertLess(d[0][2], 0.95)
        self.assertEqual((slant.status, slant.end), ([1, 0], [2, -1]))

    def test_the_contracts_worked_answer_is_optilands_to_a_rounding(self) -> None:
        result = OptilandEngine(IDENTITY).run(trace_request(SINGLET, WORKED_SPEC), SINGLET)
        self.assertEqual(result["status"], "ok", result.get("error"))
        data = result["data"]
        self.assertEqual(data["status"], WORKED_DATA["status"])
        self.assertEqual(data["endSurface"], WORKED_DATA["endSurface"])
        for name in ("hits", "exitPoint", "exitDirection", "imagePoint", "opticalPath", "opticalPathToImage"):
            self.assertEqual(data[name]["$nd"]["shape"], WORKED_DATA[name]["$nd"]["shape"], name)
            for value, expected in zip(f8(data[name]), f8(WORKED_DATA[name]), strict=True):
                if math.isnan(expected):
                    self.assertTrue(math.isnan(value), name)
                else:
                    self.assertAlmostEqual(value, expected, delta=2e-14, msg=name)
        # optiland refracts the ray along the axis to a direction of 1 less a rounding: u + 1 - u, as it adds.
        self.assertIn(f8(data["exitDirection"])[2], (1.0, math.nextafter(1.0, 0.0)))

    # ── What optiland is handed, and what its rows become ──

    def lens(self) -> tuple[dict[str, Any], Any]:
        """A sphere and an asphere of glass, and its optic."""
        case = make_case([surface(0.0, sphere(40.0), 8.0), surface(5.0, asphere(-60.0, 0.0, (4, 1e-5)), 8.0)])
        return case, build_case(case).optics[0]

    def test_optiland_is_handed_every_ray_bit_for_bit_and_a_ray_it_changed_is_refused(self) -> None:
        api = optiland_api()
        np = api.np
        _, optic = self.lens()
        short = 1.0 - 3e-13
        origins = np.array([[0.0, -0.0, -10.0], [5e-324, 1.5, -10.0], [-2.0, 3.0, -1e-300]], dtype=np.float64)
        directions = np.array([[-0.0, 0.0, 1.0], [0.0, -0.0, short], [0.6, -0.0, 0.8]], dtype=np.float64)
        rows = trace.record(optic, origins, directions)
        given = [origins[:, axis] for axis in range(3)] + [directions[:, axis] for axis in range(3)]
        held = (rows.x[0], rows.y[0], rows.z[0], rows.L[0], rows.M[0], rows.N[0])
        for column, kept in zip(given, held, strict=True):
            self.assertEqual(np.ascontiguousarray(kept).tobytes(), np.ascontiguousarray(column).tobytes())
        # A -0 is a -0 and a direction that is 3e-13 short of a unit vector stays that short: nothing is normalised.
        self.assertTrue(math.copysign(1.0, float(rows.y[0][0])) < 0 and math.copysign(1.0, float(rows.L[0][0])) < 0)
        self.assertEqual(float(rows.N[0][1]), short)
        self.assertEqual([float(value) for value in rows.opd[0]], [0.0, 0.0, 0.0])
        # The arrays that were given are the arrays they were.
        self.assertEqual(float(origins[1, 0]), 5e-324)
        # One row a surface: the object, the two of the lens, the image.
        self.assertEqual(rows.x.shape, (4, 3))

        class Normalising(api.RealRays):
            """Rays that do to a direction what the worker must never have done to it."""

            def __init__(self, x: Any, y: Any, z: Any, L: Any, M: Any, N: Any, *more: Any) -> None:
                length = np.sqrt(L * L + M * M + N * N)
                super().__init__(x, y, z, L / length, M / length, N / length, *more)

        with self.assertRaises(RuntimeError) as raised:
            trace.record(optic, origins, directions, dataclasses.replace(api, RealRays=Normalising))
        said = "optiland does not hold the rays it was given: N at its object surface differs"
        self.assertEqual(str(raised.exception), said)

        # Beside the six columns every ray is given an intensity of 1 and the wavelength of the optic's line in
        # micrometres, 587.5618 nm by one division; and a path that does not start at 0 is refused like a ray
        # that was changed.
        made: dict[str, list[float]] = {}

        class Watched(api.RealRays):
            """Rays that say what they were made with."""

            def __init__(self, *columns: Any) -> None:
                super().__init__(*columns)
                made["intensity"], made["wavelength"] = self.i.tolist(), self.w.tolist()

        trace.record(optic, origins, directions, dataclasses.replace(api, RealRays=Watched))
        self.assertEqual(made, {"intensity": [1.0] * 3, "wavelength": [587.5618 / 1000.0] * 3})

        class Travelled(api.RealRays):
            """Rays that have a path behind them before they start."""

            def __init__(self, *columns: Any) -> None:
                super().__init__(*columns)
                self.opd = self.opd + 1.0

        with self.assertRaises(RuntimeError) as raised:
            trace.record(optic, origins, directions, dataclasses.replace(api, RealRays=Travelled))
        self.assertEqual(str(raised.exception), "optiland's optical path does not start at 0 at the launch point")

    def test_a_large_set_is_traced_in_batches_and_is_the_same_answer(self) -> None:
        api = optiland_api()
        np = api.np
        case = make_case([surface(0.0, sphere(40.0), 8.0), surface(5.0, sphere(-60.0), 8.0)])
        optic = build_case(case).optics[0]
        heights = np.linspace(-11.0, 11.0, 23)
        origins = np.stack((heights, 0.3 * heights, np.full(23, -6.0)), axis=1)
        directions = np.tile(np.array(unit(0.01, -0.02, 1.0)), (23, 1))
        whole, batches = trace.trace_rays(optic, origins, directions)
        self.assertEqual(batches, 1)
        parts, count = trace.trace_rays(optic, origins, directions, max_batch=5)
        self.assertEqual(count, 5)
        self.assertEqual(sorted(set(whole.status.tolist())), [STATUS_OK, STATUS_BLOCKED])
        for name in ("status", "end_surface", "hits", "exit_point", "exit_direction", "image_point", "optical_path"):
            one, other = getattr(whole, name), getattr(parts, name)
            self.assertEqual((one.shape, one.dtype), (other.shape, other.dtype), name)
            self.assertEqual(one.tobytes(), other.tobytes(), name)
        self.assertEqual(whole.hits.shape, (2, 23, 3))
        self.assertEqual((whole.status.dtype, whole.end_surface.dtype), (np.uint8, np.int32))
        encoded = trace.encode_trace(parts)
        self.assertEqual(validate(contract_schemas(), quantity_schema_id(RAYS_TRACE, "data"), encoded), [])
        self.assertEqual(trace.ray_counts(parts)["rays"], 23)

    def test_what_optilands_rows_say_of_a_ray_that_ended_decides_between_blocked_and_failed(self) -> None:
        api = optiland_api()
        np = api.np
        case, optic = self.lens()
        count = 9
        origins = np.tile(np.array([1.0, 2.0, -6.0]), (count, 1))
        directions = np.tile(np.array(unit(0.02, -0.01, 1.0)), (count, 1))
        traced = trace.record(optic, origins, directions)
        untouched = trace.settle(optic, traced)
        self.assertEqual(untouched.status.tolist(), [STATUS_OK] * count)
        recorded = ("x", "y", "z", "L", "M", "N", "intensity", "opd")
        rows = trace.Rows(*(np.array(getattr(traced, name)) for name in recorded))
        nan = np.nan
        sphere_row, asphere_row, image_row = 1, 2, 3

        def lose(ray: int, row: int) -> None:
            """What optiland leaves of a ray it has no point of: NaN from that row on, and an intensity of 0."""
            for values in (rows.x, rows.y, rows.z, rows.L, rows.M, rows.N, rows.opd):
                values[row:, ray] = nan
            rows.intensity[row:, ray] = 0.0

        # 1: an iteration that did not come home, a millimetre from the surface, which then fails the aperture
        # test as any point may: optiland stopped the ray, and nothing shows that an aperture would have.
        rows.z[asphere_row, 1] += 1e-3
        rows.intensity[asphere_row:, 1] = 0.0
        # 2: the same point, which optiland lets through: the ray is alive, and is answered as optiland has it.
        rows.z[asphere_row, 2] += 1e-3
        # 3: no point on an asphere, and 4: none on a conic that the line does meet.
        lose(3, asphere_row)
        lose(4, sphere_row)
        # 5: behind the last surface the ray travels away from the image plane.
        rows.N[asphere_row, 5] = -rows.N[asphere_row, 5]
        # 6: behind the first surface it does: it is not met with the second, whatever optiland has there.
        rows.N[sphere_row, 6] = -0.25
        # 7: a point on the surface, light, and no direction, where Snell's law has one.
        for values in (rows.L, rows.M, rows.N):
            values[asphere_row:, 7] = nan
        # 8: nothing on the image surface.
        rows.x[image_row, 8] = nan
        # 0: a ray that arrived. What the image surface recorded as a direction is no part of an answer, and its z
        # is the plane's within a rounding of optiland's own step: neither is passed on.
        rows.N[image_row, 0] = 0.5
        rows.z[image_row, 0] += 1e-9

        settled = trace.settle(optic, rows)
        blocked, failed = STATUS_BLOCKED, STATUS_FAILED
        self.assertEqual(settled.status.tolist(), [0, failed, 0, failed, failed, blocked, blocked, failed, failed])
        self.assertEqual(settled.end_surface.tolist(), [-1, 1, -1, 1, 0, 2, 1, 1, 2])
        # The exit direction is the one the last surface of the case recorded, bit for bit, and the landing's z
        # the number of the case's image plane.
        behind_the_lens = np.array([traced.L[asphere_row, 0], traced.M[asphere_row, 0], traced.N[asphere_row, 0]])
        self.assertEqual(settled.exit_direction[0].tobytes(), behind_the_lens.tobytes())
        self.assertEqual(float(settled.image_point[0, 2]), case["conditions"]["imageZ"])
        self.assertNotEqual(float(rows.z[image_row, 0]), case["conditions"]["imageZ"])
        # The ray optiland let through has the point optiland had, a micrometre and more from the surface.
        self.assertEqual(float(settled.hits[1, 2, 2]), float(untouched.hits[1, 2, 2]) + 1e-3)
        # NaN from where each ended: the hit on the end surface too, whatever optiland had there.
        self.assertTrue(np.isnan(settled.hits[1, 1]).all() and np.isfinite(settled.hits[0, 1]).all())
        self.assertTrue(np.isnan(settled.hits[:, 4]).all())
        self.assertTrue(np.isnan(settled.hits[1, 6]).all() and np.isnan(settled.exit_point[6]).all())
        # A ray that passed every surface keeps its exit point, its direction and its path, and has no landing.
        for ray in (5, 8):
            self.assertTrue(np.isfinite(settled.exit_point[ray]).all())
            self.assertTrue(np.isfinite(settled.exit_direction[ray]).all())
            self.assertTrue(np.isfinite(settled.optical_path[ray]) and np.isnan(settled.optical_path_to_image[ray]))
            self.assertTrue(np.isnan(settled.image_point[ray]).all())
        encoded = trace.encode_trace(settled)
        self.assertEqual(validate(contract_schemas(), quantity_schema_id(RAYS_TRACE, "data"), encoded), [])
        self.assertEqual(trace.ray_counts(settled), {"rays": 9, "ok": 2, "blocked": 2, "failed": 5})

        # The same lost ray on a conic that its line provably misses is blocked: the miss is the reason.
        missed = make_case([surface(0.0, sphere(5.0), 4.9)])
        optic = build_case(missed).optics[0]
        beside = 5.000000000000004
        starts = np.array([[height, 0.0, -5.0] for height in (6.0, 5.0, beside, 4.95, 4.95)])
        rows = trace.record(optic, starts, np.array([AXIS] * 5))
        self.assertTrue(np.isnan(rows.x[1, 0]))
        # The second line touches the sphere at its equator, and the third passes it 4e-15 mm away, where the
        # discriminant of the two is below 0 by three units of its last place: a miss that a rounding decides is
        # not proven.
        self.assertLess(400.0 - 4.0 * (beside * beside + 75.0), 0.0)
        rows.x[1, 1] = rows.x[1, 2] = nan
        # The last two meet the sphere 0.05 mm beyond its rim, where it is 82 degrees steep and an aperture stops
        # them. A point 3e-6 mm from the surface along the axis is 4e-7 mm from it, and a point of it; one ten
        # times as far is not, and nothing says why optiland stopped the ray there.
        self.assertTrue(np.all(rows.intensity[1, 3:] == 0.0) and np.all(np.isfinite(rows.z[1, 3:])))
        rows.z[1, 3] += 3e-6
        rows.z[1, 4] += 3e-5
        self.assertEqual(trace.settle(optic, rows).status.tolist(), [blocked, failed, failed, blocked, failed])

        # Behind the last surface a ray that travels away from +z is blocked, wherever the image plane is: here
        # the plane lies in front of the rear face of a plate, and optiland steps back onto it.
        plate = make_case([surface(0.0, PLANE), surface(6.0, PLANE)], image_z=5.0)
        optic = build_case(plate).optics[0]
        rows = trace.record(optic, np.array([[1.0, 2.0, -5.0]]), np.array([unit(0.2, -0.3, 1.0)]))
        self.assertTrue(float(rows.intensity[3, 0]) > 0 and abs(float(rows.z[3, 0]) - 5.0) < 1e-12)
        rows.N[2, 0] = -rows.N[2, 0]
        turned = trace.settle(optic, rows)
        self.assertEqual((turned.status.tolist(), turned.end_surface.tolist()), ([blocked], [2]))

    def test_nothing_numpy_or_optiland_warns_of_leaves_the_trace(self) -> None:
        case = make_case([surface(0.0, PLANE, 9.9), surface(10.0, sphere(-10.0), 9.9)])
        missed = make_case([surface(0.0, asphere(5.0, 0.0, (4, 1e-4)), 4.9)])
        # An iteration that wanders past the end of its base conic takes the square root of a negative number, and
        # of that numpy warns when optiland is asked directly.
        wandering = make_case([surface(0.0, asphere(6.0, 0.0, (4, 5e-3)), 5.5)])
        origin, d = (5.4, 0.0, -1.0), unit(0.05, 0.0, 1.0)
        api = optiland_api()
        np = api.np
        columns = [np.array([value]) for value in (*origin, *d)]
        with warnings.catch_warnings(record=True) as heard:
            warnings.simplefilter("always")
            rays = api.RealRays(*columns, np.ones(1), np.full(1, 0.5875618))
            build_case(wandering).optics[0].surfaces.trace(rays)
        self.assertIn("invalid value encountered in sqrt", [str(warning.message) for warning in heard])
        with warnings.catch_warnings():
            warnings.simplefilter("error")
            reflected = self.answer(case, [(9.0, 0.0, -5.0)], [AXIS])
            lost = self.answer(missed, [(6.0, 0.0, -5.0)], [AXIS])
            strayed = self.answer(wandering, [origin], [d])
        self.assertEqual((reflected.status, lost.status), ([STATUS_BLOCKED], [STATUS_FAILED]))
        self.assertEqual(strayed.status, [STATUS_FAILED])

    # ── What a comparison must know of optiland (docs/gotchas.md) ──

    def test_beyond_the_equator_of_a_hemisphere_optiland_passes_a_ray_on_the_far_side_of_the_sphere(self) -> None:
        # A hemisphere of radius 10, concave toward the object, with its vertex at z = 0: the surface is the half of
        # the sphere between z = -10 and z = 0. A steep line that cuts the sphere twice in front of z = -10 does not
        # meet it, and the contract blocks the ray. optiland has no admissible root, falls back to the one nearer
        # the vertex, finds it inside the clear aperture and carries the ray on from there.
        case = make_case([surface(0.0, sphere(-10.0), 10.0)])
        origin, d = (0.0, -12.0, -15.0), unit(0.0, 1.0, 0.2)
        # The two points of the line on the sphere of centre (0, 0, -10), by the quadratic of the two.
        b = d[1] * origin[1] + d[2] * (origin[2] + 10.0)
        root = math.sqrt(b * b - (origin[1] ** 2 + (origin[2] + 10.0) ** 2 - 100.0))
        crossings = [origin[2] + step * d[2] for step in (-b - root, -b + root)]
        self.assertTrue(all(-15.0 < z < -10.5 for z in crossings), crossings)
        self.assertEqual(exact_trace(case, origin, d).status, STATUS_BLOCKED)
        answer = self.answer(case, [origin], [d])
        # optiland did not stop the ray at the surface: it has a hit there, on the half the case does not have,
        # 0.02 mm inside the clear aperture, and lands the ray a quarter of a metre from the axis. The answer says
        # what optiland does: such a ray is one that a comparison finds, not one the worker hides.
        self.assertEqual((answer.status, answer.end), ([STATUS_OK], [-1]))
        hit = answer.hits[0][0]
        self.assertAlmostEqual(hit[2], crossings[1], delta=1e-12)
        self.assertTrue(9.9 < math.hypot(hit[0], hit[1]) < 10.0, hit)
        self.assertGreater(answer.image[0][1], 200.0)

    def test_a_conic_met_from_far_away_is_off_its_own_surface_by_the_square_of_the_distance(self) -> None:
        # optiland solves the quadratic of a line with a conic from where the ray is, and its terms grow with the
        # square of the distance. An asphere is brought home by the iteration, to a rounding of the distance.
        def worst(shape: dict[str, Any], distance: float) -> float:
            case = make_case([surface(0.0, shape, 9.0)], object_z=-distance)
            aims = [(x, y) for x in (-6.0, -2.0, 3.0, 6.0) for y in (-6.0, 1.0, 5.0)]
            start = (0.0, 0.02 * distance, -distance)
            directions = [unit(x, y - start[1], distance) for x, y in aims]
            answer = self.answer(case, [start] * len(aims), directions)
            self.assertEqual(answer.status, [0] * len(aims))
            off = Decimal(0)
            for hit in answer.hits[0]:
                height = (Decimal(hit[0]) ** 2 + Decimal(hit[1]) ** 2).sqrt()
                sag = exact_sag(shape, height)
                assert sag is not None
                off = max(off, abs(Decimal(hit[2]) - sag))
            return float(off)

        ball, bent = sphere(30.0), asphere(30.0, -0.5, (4, 1e-5), (6, -2e-8))
        self.assertLess(worst(ball, 100.0), 1e-12)
        self.assertLess(worst(bent, 100.0), 5e-12)
        # A hundred metres: 6e-8 mm on a sphere, which is beyond the gate of R2 and within what the worker takes
        # for a point of the surface, and 2e-11 mm on an asphere.
        far_ball, far_bent = worst(ball, 1e5), worst(bent, 1e5)
        self.assertTrue(1e-9 < far_ball < ON_SURFACE_TOLERANCE_MM, far_ball)
        self.assertLess(far_bent, 1e-9)

    def test_the_tolerance_on_an_asphere_is_that_of_the_batch_and_one_far_ray_loosens_it_for_every_ray(self) -> None:
        api = optiland_api()
        np = api.np
        # An asphere 8 nm from its base sphere at a height of 3 mm. With a ray that comes from 10 km away in the
        # batch, optiland's tolerance is the rounding of that step, 1.8e-8 mm, the base sphere's hit is within it,
        # and no step is taken for any ray.
        case = make_case([surface(0.0, asphere(30.0, 0.0, (4, 1e-10)), 9.0)])
        optic = build_case(case).optics[0]
        near = np.array([[3.0, 0.0, -5.0], [0.0, -2.5, -5.0]])
        far = np.array([[0.5, 0.0, -1e7]])
        ahead = np.array([AXIS, AXIS, AXIS])
        alone, _ = trace.trace_rays(optic, near, ahead[:2])
        together, _ = trace.trace_rays(optic, np.concatenate((near, far)), ahead)
        self.assertEqual(alone.status.tolist() + together.status.tolist(), [0] * 5)
        moved = np.abs(together.hits[0, :2, 2] - alone.hits[0, :2, 2])
        self.assertTrue(4e-9 < float(moved.max()) < 1e-8, moved)
        shape = case["system"]["surfaces"][0]["shape"]
        sag = exact_sag(shape, Decimal(3))
        assert sag is not None
        self.assertLess(abs(Decimal(float(alone.hits[0, 0, 2])) - sag), Decimal(2e-12))

    def test_one_ray_without_a_direction_leaves_every_ray_of_its_batch_on_the_base_plane_of_a_flat_asphere(
        self,
    ) -> None:
        api = optiland_api()
        np = api.np
        # A hemisphere out of glass, which reflects a ray 6.7 mm from the axis totally (above), and behind it an
        # asphere on a flat base, z = 1e-4 r^4. optiland keeps the point of the reflected ray and has no direction
        # for it. The iteration on the asphere starts at the distance to the base plane, -z / N, and optiland puts
        # 1e-14 where N is no number above that: the ray is 4.6e14 mm away, the batch's tolerance is 8 eps of
        # that, 0.8 mm, the base plane is within it for every ray, and no ray is brought to the surface.
        flat = asphere(None, 0.0, (4, 1e-4))

        def lens(shape: dict[str, Any]) -> dict[str, Any]:
            hemisphere = [surface(0.0, PLANE, 9.9), surface(10.0, sphere(-10.0), 9.9)]
            return make_case([*hemisphere, surface(12.0, shape, 9.9), surface(14.0, PLANE, 9.9)])

        case = lens(flat)
        optic = build_case(case).optics[0]
        live: list[Point] = [(3.0, 0.0, -5.0), (0.0, -2.0, -5.0)]
        reflected: Point = (6.7, 0.0, -5.0)
        ahead = np.array([AXIS] * 3)
        alone, _ = trace.trace_rays(optic, np.array(live), ahead[:2])
        together, _ = trace.trace_rays(optic, np.array([*live, reflected]), ahead)
        self.assertEqual(alone.status.tolist() + together.status.tolist(), [0, 0, 0, 0, STATUS_BLOCKED])
        self.assertEqual(int(together.end_surface[2]), 1)
        for ray, origin in enumerate(live):
            exact = exact_trace(case, origin, AXIS)
            self.assertEqual(exact.status, STATUS_OK)
            # Alone the ray is on the surface, where the contract has it: 4.5e-3 mm and 9.8e-4 mm behind the plane.
            self.assert_near(tuple(alone.hits[2, ray].tolist()), exact.hits[2], 1e-12, ray)
            self.assertGreater(float(exact.hits[2][2]) - 12.0, 9e-4)
            # Beside the reflected ray it is on the base plane, to the bit, is answered as a ray that arrived, and
            # lands somewhere else.
            self.assertEqual(float(together.hits[2, ray, 2]), 12.0)
            self.assertGreater(float(np.abs(together.image_point[ray] - alone.image_point[ray]).max()), 2e-5)
        # On a curved base, however weakly curved, the same ray does no harm: a conic has no distance for a ray
        # without a direction, and a distance that is no number raises no tolerance.
        optic = build_case(lens(asphere(1e4, 0.0, (4, 1e-4)))).optics[0]
        alone, _ = trace.trace_rays(optic, np.array(live), ahead[:2])
        together, _ = trace.trace_rays(optic, np.array([*live, reflected]), ahead)
        self.assertEqual(together.status.tolist(), [0, 0, STATUS_BLOCKED])
        self.assertEqual(together.hits[:, :2].tobytes(), alone.hits.tobytes())

    def test_behind_a_surface_that_crosses_the_one_before_a_steep_ray_is_met_in_front_of_it_and_stopped(self) -> None:
        api = optiland_api()
        np = api.np
        # A sphere of radius 10 that changes no index, and 1 mm behind its vertex a sphere of radius 40 with a clear
        # aperture of 12 mm. A ray 53 degrees from the axis meets the first 8 mm from the axis, where it is 4 mm
        # deep: 3 mm behind the vertex of the second, inside its ball.
        case = make_case([surface(0.0, sphere(10.0), 9.0), surface(1.0, sphere(40.0), 12.0)], indices=[[1.0, 1.5]])
        origin, d = (0.0, 16.0, -2.0), (0.0, -0.8, 0.6)
        first = (origin[1] + 10.0 * d[1], origin[2] + 10.0 * d[2])
        self.assertAlmostEqual(first[0] ** 2 + (first[1] - 10.0) ** 2, 100.0, delta=1e-13)
        # The line and the second sphere, of centre (0, 0, 41), by the quadratic of the two: one crossing 2.8 mm
        # behind the ray and one 60 mm in front of it, both on the half of the sphere that the sag describes.
        y, z = first[0], first[1] - 41.0
        half = y * d[1] + z * d[2]
        root = math.sqrt(half * half - (y * y + z * z - 1600.0))
        behind, in_front = ((first[0] + step * d[1], first[1] + step * d[2]) for step in (-half - root, -half + root))
        self.assertTrue(-half - root < -2.7 and -half + root > 59.0)
        self.assertTrue(all(1.0 < height < 41.0 for _, height in (behind, in_front)), (behind, in_front))
        # The crossing behind the ray is 10.2 mm from the axis, inside the clear aperture: the next surface lies
        # behind the last hit, and the contract passes the ray there by a step backwards. The one in front of it
        # is 40 mm from the axis.
        self.assertTrue(10.2 < behind[0] < 10.3 and in_front[0] < -39.9, (behind, in_front))
        optic = build_case(case).optics[0]
        rows = trace.record(optic, np.array([origin]), np.array([d]))
        self.assert_near((float(rows.y[1, 0]), float(rows.z[1, 0])), first, 1e-14)
        # optiland admits a crossing only in front of the ray, and steps backwards only where there is none: it
        # carries the ray to the crossing in front, where its aperture stops it.
        self.assert_near((float(rows.y[2, 0]), float(rows.z[2, 0])), in_front, 1e-11)
        self.assertEqual(float(rows.intensity[2, 0]), 0.0)
        settled = trace.settle(optic, rows)
        self.assertEqual((settled.status.tolist(), settled.end_surface.tolist()), ([STATUS_BLOCKED], [1]))


if __name__ == "__main__":
    unittest.main()
