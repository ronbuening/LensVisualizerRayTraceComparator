"""``axial.native`` of the worker: optiland's own rays along the axis, aimed at the real stop at each line, and its
paraxial focus there.

The first half needs no optiland: the request is read, an answer is written from stand-in steps and is valid by the
contract's port, and the engine dispatches it. The second half is the real optiland and is skipped, with the reason,
under an interpreter that has none. Its expected values are derived here: the paraxial focus of a refracting sphere in
closed form, the entrance height of each aimed ray by bisection in 60 digits on the hit at the stop of ``exact.py``'s
trace, and the exits of the rays by that trace, never read from an engine's output; and every setting the worker reads
back is held to it with the mistake made on purpose.
"""

from __future__ import annotations

import copy
import dataclasses
import math
import unittest
from decimal import Decimal
from typing import Any
from unittest import mock

from lvrtc_optiland import axial
from lvrtc_optiland.build import BuildMismatch, optiland_api
from lvrtc_optiland.engine import OptilandEngine, refusals
from lvrtc_optiland.first_order import LINEAR_SAG_TERM, QUADRATIC_SAG_TERM
from lvrtc_optiland.mtf import AIMING_TOLERANCE_MM
from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray
from lvrtc_worker_kit.validate import validate_axial_native

from .exact import exact_trace
from .support import PLANE, asphere, make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_first_order import thick_lens
from .test_mtf import IDENTITY
from .test_summary import unclipped

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")

SPHERICAL = {"kind": "spherical", "lines": [0], "nearAxis": 0.25, "marginal": [1.0, 0.75], "profile": [0.25, 0.5, 0.75]}
COLOUR = {"kind": "colour", "lines": [0], "marginal": [0.75, 0.5]}


# One sphere of radius 30 into glass, its own stop of radius 4; at the second line the glass is of a higher index.
# The paraxial focus of a sphere of radius R into glass of index n from air is n R / (n - 1) behind its vertex: 90 mm
# at index 3/2, and 30 * 1.52 / 0.52 at 1.52.
CASE = make_case(
    [surface(0, sphere(30), semi=4.0)],
    indices=[[1.5], [1.52]],
    lines=(587.5618, 486.1327),
    image_z=90.0,
    stop_radius=4.0,
)

# The same sphere with its stop 10 mm behind it, in the glass: a ray parallel to the axis at the height h is bent to
# the slope -h (n - 1) / (n R) (paraxially) and reaches the stop below h, by another factor at each line. The ray aimed
# at a point of the stop therefore enters at another height at each line: the paraxial entrance pupil is 4.5 mm at
# n = 3/2 and 4 x 45.6 / 40.4 at n = 1.52, the stop 4 mm at both.
PUPILS = make_case(
    [surface(0, sphere(30), semi=6.0), surface(10, PLANE, semi=4.0)],
    stop=1,
    indices=[[1.5, 1.5], [1.52, 1.52]],
    lines=(587.5618, 486.1327),
    image_z=90.0,
    stop_radius=4.0,
)

# A lens whose first surface has a term of power 2 (a curvature at the vertex the contract counts, 2e-3, which
# optiland's paraxial model does not see) and one with a term of power 1 (a cone at the vertex).
CURVED = make_case([surface(0.0, asphere(50, 0, (2, 1e-3))), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]])
CONE = make_case([surface(0.0, asphere(50, 0, (1, 1e-3))), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]])
KINOFORM = read_fixture("valid", "optical-case", "diffractive-kinoform.json")


def axial_request(case: dict[str, Any], spec: dict[str, Any] = COLOUR) -> dict[str, Any]:
    return {"contract": "1.0", "id": "d" * 64, "caseId": case["id"], "quantity": "axial.native", "spec": spec}


class RequestTest(unittest.TestCase):
    def test_the_rays_of_a_request_are_its_zones_once_and_of_spherical_aberration_with_mirror_images(self) -> None:
        self.assertEqual(axial.signed_fractions(SPHERICAL), (0.25, -0.25, 1.0, -1.0, 0.75, -0.75, 0.5, -0.5))
        self.assertEqual(axial.signed_fractions({**COLOUR, "marginal": [0.75, 0.5, 0.75]}), (0.75, 0.5))

    def test_what_the_engine_does_not_answer_is_said_before_anything_is_built(self) -> None:
        def items(spec: dict[str, Any], case: dict[str, Any] = DOUBLE_GAUSS) -> list[str]:
            asked = axial.read_request(spec, case)
            return [item["item"] for item in asked] if isinstance(asked, list) else []

        self.assertEqual(items(SPHERICAL), [])
        self.assertEqual(items({**COLOUR, "lines": [0, 4]}), ["line"])
        finite = copy.deepcopy(DOUBLE_GAUSS)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        self.assertEqual(items(COLOUR, finite), ["object.finite"])
        asked = axial.read_request(SPHERICAL, DOUBLE_GAUSS)
        self.assertEqual((asked.kind, asked.lines, len(asked.fractions)), ("spherical", (0,), 8))


def stand_in_steps(built: list[Any], traced: list[Any], *, unaimed: int = -1, failing: str = "") -> axial.Steps:
    """Steps that make named optics, each launching rays of its own name, and trace them: every call is noted. The ray
    ``unaimed`` of every launch is one the aimer did not aim; the optic ``failing`` gives up on every ray."""

    def optic(case: dict[str, Any], line: int) -> axial.LineOptic:
        built.append(line)
        return axial.LineOptic(
            optic=f"optic {line}", case=case, stop_index=0, stop_radius_mm=4.0 + line, pupil_radius_mm=3.0 + line
        )

    def launch(held: axial.LineOptic, fractions: Any) -> axial.Launch:
        if held.optic == failing:
            raise axial.AimFailed("ValueError: RobustRayAimer: every ray failed to converge")
        aimed = tuple(ray != unaimed for ray in range(len(fractions)))
        named = ("origins of", held.optic), ("directions of", held.optic)
        return axial.Launch(fractions=tuple(fractions), origins=named[0], directions=named[1], aimed=aimed)

    def trace(held: axial.LineOptic, launched: axial.Launch) -> axial.Traced:
        traced.append((held.optic, launched.origins, launched.directions))
        lost = held.optic == "optic 1" or not all(launched.aimed)
        return axial.Traced(
            arrived=(1, 0) if lost else (1, 1),
            exit_point=(0.0, 1.0, 5.0, *([math.nan] * 3 if lost else (0.0, -1.0, 5.0))),
            exit_direction=(0.0, -0.125, 0.5, *([math.nan] * 3 if lost else (0.0, 0.125, 0.5))),
        )

    def focus(held: axial.LineOptic) -> float | None:
        return 90.0 if held.optic == "optic 0" else None

    return axial.Steps(optic=optic, launch=launch, trace=trace, focus=focus)


class AnswerTest(unittest.TestCase):
    def test_every_line_traces_the_rays_its_own_optic_aimed_and_states_its_own_focus(self) -> None:
        built: list[Any] = []
        traced: list[Any] = []
        colour = {**COLOUR, "lines": [1, 0]}
        data = axial.answer_axial(colour, CASE, steps=stand_in_steps(built, traced))
        self.assertEqual(validate_axial_native("data", data), [])
        self.assertEqual(built, [1, 0])
        # Each line's optic launches its own rays, which are traced through it and no other.
        self.assertEqual(
            traced,
            [("optic 1", ("origins of", "optic 1"), ("directions of", "optic 1"))]
            + [("optic 0", ("origins of", "optic 0"), ("directions of", "optic 0"))],
        )
        # The radius the fractions are of is the stop's, as the first line asked has it, beside the aimer's radius.
        self.assertEqual(data["pupilRadiusMm"], 4.0)
        self.assertEqual(data["method"]["params"]["pupilRadiusMm"], 4.0)
        self.assertEqual(data["method"]["params"]["aimerStopRadiusMm"], 5.0)
        self.assertEqual([field["paraxialFocusZ"] for field in data["fields"]], [None, 90.0])
        rays = data["fields"][0]["rays"]
        self.assertEqual(decode_ndarray(rays["fractions"]).values(), [0.75, 0.5])
        self.assertEqual(decode_ndarray(rays["arrived"]).values(), [1, 0])
        self.assertTrue(math.isnan(decode_ndarray(rays["exitPoint"]).values()[3]))
        self.assertEqual(data["fields"][0]["sampling"], {"raysLaunched": 2, "raysUnaimed": 0, "raysArrived": 1})
        self.assertEqual(axial.field_counts(data), {"lines": 2, "raysLaunched": 4, "raysUnaimed": 0, "raysArrived": 3})
        params = data["method"]["params"]
        self.assertEqual(
            (params["aiming"], params["aimingMaxIterations"], params["aimingToleranceMm"]), ("robust", 50, 1e-10)
        )

    def test_a_ray_the_aimer_did_not_aim_is_counted_and_a_line_it_gave_up_on_is_unavailable(self) -> None:
        # A ray the aimer returned no launch for did not arrive, and is counted and noted.
        data = axial.answer_axial(COLOUR, CASE, steps=stand_in_steps([], [], unaimed=1))
        self.assertEqual(validate_axial_native("data", data), [])
        self.assertEqual(data["fields"][0]["sampling"], {"raysLaunched": 2, "raysUnaimed": 1, "raysArrived": 1})
        self.assertIn("line 0: optiland's aimer aimed 1 of its 2 rays", data["notes"])
        # A line whose rays the aimer gave up on altogether says why; the other line is answered as it is.
        both = {**COLOUR, "lines": [0, 1]}
        traced: list[Any] = []
        data = axial.answer_axial(both, CASE, steps=stand_in_steps([], traced, failing="optic 0"))
        self.assertEqual(validate_axial_native("data", data), [])
        lost, kept = data["fields"]
        self.assertEqual((lost["status"], lost["reason"], lost["rays"]), ("unavailable", "aim-failed", None))
        self.assertEqual(lost["sampling"], {"raysLaunched": 2, "raysUnaimed": 2, "raysArrived": 0})
        self.assertEqual(lost["paraxialFocusZ"], 90.0)
        self.assertEqual((kept["status"], [entry[0] for entry in traced]), ("ok", ["optic 1"]))
        self.assertTrue(any(note.startswith("line 0: optiland's aimer aimed none") for note in data["notes"]))
        self.assertEqual(data["pupilRadiusMm"], 3.0)

    def test_the_port_holds_an_answer_to_the_invariants_of_the_quantity(self) -> None:
        base = axial.answer_axial(COLOUR, DOUBLE_GAUSS, steps=stand_in_steps([], []))
        self.assertEqual(validate_axial_native("data", base), [])
        both = copy.deepcopy(base)
        both["fields"][0]["figures"] = {
            "landingMm": 0.0,
            "marginalFraction": 0.75,
            "marginalInterceptZ": 50.0,
            "nearAxisInterceptZ": None,
            "bestFocusZ": None,
            "bestFocusRmsMm": None,
            "profileMm": None,
        }
        self.assertEqual([issue.keyword for issue in validate_axial_native("data", both)], ["invariant"])
        figures = copy.deepcopy(both)
        figures["fields"][0]["rays"] = None
        self.assertEqual(validate_axial_native("data", figures), [])
        figures["kind"] = "spherical"
        self.assertEqual([issue.path for issue in validate_axial_native("data", figures)], ["/fields/0/figures"])
        short = copy.deepcopy(base)
        short["fields"][0]["rays"]["arrived"] = encode_ndarray("u1", [1], [1])
        self.assertEqual([issue.path for issue in validate_axial_native("data", short)], ["/fields/0/rays"])
        zero = copy.deepcopy(base)
        zero["fields"][0]["rays"]["fractions"] = encode_ndarray("f8", [0.75, 0.0], [2])
        self.assertEqual([issue.path for issue in validate_axial_native("data", zero)], ["/fields/0/rays/fractions"])
        lost = copy.deepcopy(base)
        lost["fields"][0] = {**lost["fields"][0], "status": "unavailable", "reason": "build-failed"}
        self.assertEqual([issue.path for issue in validate_axial_native("data", lost)], ["/fields/0"])
        twice = {**COLOUR, "lines": [0, 0]}
        self.assertEqual([issue.path for issue in validate_axial_native("spec", twice)], ["/lines"])

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        request = {
            "contract": "1.0",
            "id": "d" * 64,
            "caseId": DOUBLE_GAUSS["id"],
            "quantity": "axial.native",
            "spec": SPHERICAL,
        }
        self.assertIn("axial.native", engine.describe()["capabilities"]["quantities"])
        with mock.patch("lvrtc_optiland.engine.answer_axial", side_effect=BuildMismatch("read-back fault")):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["error"]["code"]), ("error", "build-mismatch"))
        bad = {**request, "spec": {**COLOUR, "lines": [0, 0]}}
        self.assertEqual(engine.run(bad, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        finite = copy.deepcopy(DOUBLE_GAUSS)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        result = engine.run(request, finite)
        self.assertEqual((result["status"], result["unsupported"][0]["item"]), ("unsupported", "object.finite"))

    def test_a_case_whose_first_order_data_optiland_does_not_see_is_refused_before_anything_is_built(self) -> None:
        # The paraxial focus of the answer is optiland's first-order data: a phase profile and the terms of power 1 and
        # 2 are refused as for paraxial.first-order, from the case alone.
        def items(case: dict[str, Any]) -> list[str]:
            return [item["item"] for item in refusals(axial_request(case), case)]

        self.assertEqual(items(CURVED), [QUADRATIC_SAG_TERM])
        self.assertEqual(items(CONE), [LINEAR_SAG_TERM])
        self.assertIn("optiland-phase-paraxial-unseen", items(KINOFORM))
        self.assertEqual(items(CASE), [])
        self.assertEqual(items(PUPILS), [])
        engine = OptilandEngine(IDENTITY)
        with mock.patch("lvrtc_optiland.engine.answer_axial", side_effect=AssertionError("an optic was built")):
            for case, item in ((CURVED, QUADRATIC_SAG_TERM), (CONE, LINEAR_SAG_TERM)):
                result = engine.run(axial_request(case), case)
                self.assertEqual(result["status"], "unsupported")
                self.assertEqual([each["item"] for each in result["unsupported"]], [item])


def aimed_height(
    case: dict[str, Any], fraction: float, line: int, start_z: float, radius: float | None = None
) -> float:
    """The entrance height of the ray parallel to the axis that crosses the stop at ``fraction`` of the case's stop
    radius (or of ``radius``) at one line, by bisection in 60 digits on ``exact_trace``'s hit at the stop of the case
    without its clipping: what optiland's robust aimer is asked to solve for at infinity. Of a negative fraction, the
    mirror image of the positive one's."""
    system = case["system"]
    stop = system["stopIndex"]
    radius = float(case["conditions"]["stopSemiDiameter"]) if radius is None else radius
    target = abs(Decimal(fraction)) * Decimal(radius)
    low, high = Decimal(0), 2 * Decimal(system["surfaces"][stop]["aperture"]["semiDiameter"])
    free = unclipped(case)

    def at_stop(height: Decimal) -> Decimal:
        return exact_trace(free, (0.0, float(height), start_z), (0.0, 0.0, 1.0), line=line).hits[stop][1]

    for _ in range(80):
        middle = (low + high) / 2
        if at_stop(middle) < target:
            low = middle
        else:
            high = middle
    return math.copysign(float((low + high) / 2), fraction)


# The aimer settles each ray within 1e-10 mm of its point of the stop. On these lenses an exit point moves by no more
# than the height at the stop does (the stop is the last surface, or the only one; on the double Gauss 0.994 times it,
# by 60-digit traces a micrometre apart), and an exit direction by under 1/50 per mm of that height. With the rounding
# of a trace in doubles: a point within twice the aimer's tolerance of the exact ray's, a direction within a tenth.
POINT_DELTA = 2 * AIMING_TOLERANCE_MM
DIRECTION_DELTA = AIMING_TOLERANCE_MM / 10


@unittest.skipIf(MISSING, MISSING or "")
class RealAxialTest(unittest.TestCase):
    """optiland's own axial rays aimed at the stop of synthetic lenses, held to exact traces."""

    def answer(self, spec: dict[str, Any], case: dict[str, Any] = CASE) -> dict[str, Any]:
        data = axial.answer_axial(spec, case)
        self.assertIsInstance(data, dict)
        assert isinstance(data, dict)
        self.assertEqual(validate_axial_native("data", data), [])
        return data

    def assert_exact(self, case: dict[str, Any], field: dict[str, Any], start_z: float) -> list[float]:
        """Every ray of a line leaves the last surface where the exact ray aimed at its point of the stop does; the
        entrance heights of those exact rays, in the order of the line's rays."""
        points = decode_ndarray(field["rays"]["exitPoint"]).values()
        directions = decode_ndarray(field["rays"]["exitDirection"]).values()
        fractions = decode_ndarray(field["rays"]["fractions"]).values()
        self.assertEqual(decode_ndarray(field["rays"]["arrived"]).values(), [1] * len(fractions))
        self.assertEqual(field["sampling"]["raysUnaimed"], 0)
        heights = []
        for ray, fraction in enumerate(fractions):
            height = aimed_height(case, fraction, field["line"], start_z)
            heights.append(height)
            exact = exact_trace(case, (0.0, height, start_z), (0.0, 0.0, 1.0), line=field["line"])
            self.assertIsNotNone(exact.direction)
            assert exact.direction is not None
            for axis in range(3):
                self.assertAlmostEqual(points[3 * ray + axis], float(exact.hits[-1][axis]), delta=POINT_DELTA)
                self.assertAlmostEqual(directions[3 * ray + axis], float(exact.direction[axis]), delta=DIRECTION_DELTA)
            self.assertEqual(points[3 * ray], 0.0)
        return heights

    def test_the_stop_is_the_pupil_and_the_rays_leave_the_sphere_where_the_exact_rays_do(self) -> None:
        data = self.answer({**SPHERICAL, "marginal": [0.75]})
        # The stop is the sphere itself, of radius 4 mm, which is its clip radius too, as the aimer takes it.
        self.assertEqual(data["pupilRadiusMm"], 4.0)
        self.assertEqual(data["method"]["params"]["aimerStopRadiusMm"], 4.0)
        (field,) = data["fields"]
        self.assertEqual(decode_ndarray(field["rays"]["fractions"]).values(), [0.25, -0.25, 0.75, -0.75, 0.5, -0.5])
        heights = self.assert_exact(CASE, field, -10.0)
        # A ray parallel to the axis meets the sphere at its own height: each enters at f times the stop's radius.
        for height, fraction in zip(heights, [0.25, -0.25, 0.75, -0.75, 0.5, -0.5], strict=True):
            self.assertAlmostEqual(height, fraction * 4.0, delta=1e-15)

    def test_the_paraxial_focus_of_each_line_is_the_closed_form(self) -> None:
        data = self.answer({**COLOUR, "lines": [0, 1]})
        foci = [field["paraxialFocusZ"] for field in data["fields"]]
        self.assertAlmostEqual(foci[0], 90.0, delta=1e-12)
        self.assertAlmostEqual(foci[1], 1.52 * 30 / 0.52, delta=1e-12)
        for field in data["fields"]:
            self.assert_exact(CASE, field, -10.0)

    def test_each_line_aims_its_own_rays_at_the_stop_through_its_own_indices(self) -> None:
        # The stop behind the sphere: the ray aimed at a point of the stop enters at another height at each line, and
        # each line's rays are its own exact aimed rays, whichever line is asked first; the radius is the stop's.
        spec = {"kind": "colour", "lines": [0, 1], "marginal": [0.75, 0.5]}
        for lines in ([0, 1], [1, 0]):
            with self.subTest(lines=lines):
                data = self.answer({**spec, "lines": lines}, PUPILS)
                self.assertEqual(data["pupilRadiusMm"], 4.0)
                heights = {field["line"]: self.assert_exact(PUPILS, field, -10.0) for field in data["fields"]}
                for zero, one in zip(heights[0], heights[1], strict=True):
                    self.assertGreater(abs(zero - one), 1e-3)
        # The spherical aberration of the same lens: each zone and its mirror image aimed at their points of the stop.
        data = self.answer({**SPHERICAL, "marginal": [0.75]}, PUPILS)
        self.assert_exact(PUPILS, data["fields"][0], -10.0)

    def test_behind_a_lens_each_ray_is_the_exact_ray_aimed_at_its_point_of_the_stop(self) -> None:
        # The double Gauss's stop radius is 6.3412 mm and its stop surface clips at 6.35 mm, where optiland's aimer puts
        # its pupil coordinate 1: the fractions are of the stop radius, the rays aimed at f times it.
        start = DOUBLE_GAUSS["system"]["surfaces"][0]["z"] - 10.0
        data = self.answer({"kind": "colour", "lines": [0], "marginal": [0.9, 0.5]}, DOUBLE_GAUSS)
        stop = DOUBLE_GAUSS["system"]["surfaces"][DOUBLE_GAUSS["system"]["stopIndex"]]
        clip = float(stop["aperture"]["semiDiameter"])
        self.assertEqual(data["pupilRadiusMm"], DOUBLE_GAUSS["conditions"]["stopSemiDiameter"])
        self.assertEqual(data["method"]["params"]["aimerStopRadiusMm"], clip)
        (field,) = data["fields"]
        heights = self.assert_exact(DOUBLE_GAUSS, field, start)
        for height, fraction in zip(heights, [0.9, 0.5], strict=True):
            self.assertGreater(abs(height - aimed_height(DOUBLE_GAUSS, fraction, 0, start, clip)), 1e-3)
        # A launch at the fractions of the clip radius, (0, f) of optiland's pupil, crosses the stop elsewhere: caught.
        held = axial.line_optic(DOUBLE_GAUSS, 0)
        at_clip = dataclasses.replace(held, pupil_radius_mm=held.stop_radius_mm)
        with self.assertRaisesRegex(BuildMismatch, "ray 0 crosses the stop at"):
            axial.trace(held, axial.launch(at_clip, (0.9, 0.5)))

    def test_each_setting_of_the_launch_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        fractions = (0.5, -0.5)

        def held() -> axial.LineOptic:
            return axial.line_optic(CASE, 0)

        def refused(made: axial.LineOptic, said: str) -> None:
            with self.assertRaisesRegex(BuildMismatch, said):
                axial.trace(made, axial.launch(made, fractions))

        def aiming(**settings: Any) -> Any:
            def mutate(made: axial.LineOptic) -> None:
                made.optic.ray_tracer.set_aiming(**settings)

            return mutate

        def field(**more: Any) -> Any:
            def mutate(made: axial.LineOptic) -> None:
                made.optic.fields.remove(0)
                made.optic.fields.add(**more)

            return mutate

        def second_field(made: axial.LineOptic) -> None:
            made.optic.fields.add(y=5.0)

        def field_type(made: axial.LineOptic) -> None:
            made.optic.fields.set_type("paraxial_image_height")

        def weighted(made: axial.LineOptic) -> None:
            made.optic.fields.fields[0].weight = 2.0

        def apodized(made: axial.LineOptic) -> None:
            made.optic.apodization = "gaussian"

        def stop_radius(made: axial.LineOptic) -> None:
            made.optic.surfaces[1].aperture = optiland_api().RadialAperture(r_max=3.75)

        faults = {
            "aiming mode": (aiming(mode="paraxial"), "the ray aiming"),
            "aiming iterations": (aiming(mode="robust", max_iter=20, tol=1e-10), "the ray aiming"),
            "aiming tolerance": (aiming(mode="robust", max_iter=50, tol=1e-8), "the ray aiming"),
            "field off the axis": (field(y=5.0), "the field angle along y"),
            "second field": (second_field, "the number of fields"),
            "vignetting": (field(y=0.0, vy=0.25), "the vignetting factors"),
            "weight": (weighted, r"the weight is 2\.0"),
            "field type": (field_type, "the type of the field"),
            "apodization": (apodized, "the apodization"),
            "stop radius": (stop_radius, r"the radius of the stop the rays are aimed at, mm is 3\.75"),
        }
        for name, (mutate, said) in faults.items():
            with self.subTest(fault=name):
                made = held()
                mutate(made)
                refused(made, said)
        with self.subTest(fault="polarization"):
            made = held()
            with mock.patch.object(type(made.optic), "polarization_state", new_callable=mock.PropertyMock) as state:
                state.return_value = "ignore"
                refused(made, "the polarization is 'ignore'")

        def launched(change: Any) -> axial.LineOptic:
            made = held()
            generator = made.optic.ray_tracer.ray_generator
            real = generator.generate_rays

            def wrong(*args: Any, **kwargs: Any) -> Any:
                rays = real(*args, **kwargs)
                change(rays, made)
                return rays

            generator.generate_rays = wrong
            return made

        def nan(name: str) -> Any:
            return lambda rays, made: getattr(rays, name).__setitem__(1, math.nan)

        def unaim(rays: Any, made: axial.LineOptic) -> None:
            for name in ("x", "y", "z", "L", "M", "N"):
                getattr(rays, name).__setitem__(1, math.nan)

        def unaiming(rays: Any, made: axial.LineOptic) -> None:
            made.optic.ray_tracer.set_aiming("paraxial")

        moved = {
            "x": (lambda rays, made: rays.x.__setitem__(0, 1e-12), "ray 0: its x"),
            "L": (lambda rays, made: rays.L.__setitem__(0, 1e-16), "ray 0: its direction"),
            "M": (lambda rays, made: rays.M.__setitem__(1, 1e-16), "ray 1: its direction"),
            "N": (lambda rays, made: rays.N.__setitem__(0, 1 - 2**-53), "ray 0: its direction"),
            "x not a number": (nan("x"), "ray 1: its x"),
            "N not a number": (nan("N"), "ray 1: its direction"),
            # A height that misses the stop's point by ten times the aimer's tolerance: optiland's trace says so.
            "height": (lambda rays, made: rays.y.__setitem__(1, rays.y[1] + 1e-9), "ray 1 crosses the stop at"),
            "aiming changed by the launch": (unaiming, "the ray aiming"),
            "column shape": (lambda rays, made: setattr(rays, "z", rays.z[:1]), "launched 1 values of z, not 2"),
        }
        for name, (change, said) in moved.items():
            with self.subTest(fault=f"launched {name}"):
                refused(launched(change), said)

        with self.subTest(fault="another aimer"):
            # The generator holds an aimer of another kind than the aiming says, which it does not replace.
            made = held()
            generator = made.optic.ray_tracer.ray_generator
            generator.set_ray_aiming("paraxial")
            generator._current_config = dict(made.optic.ray_tracer.ray_aiming_config)
            refused(made, "the aimer that launched the rays is 'ParaxialRayAimer'")

        # A ray NaN in all six values is one the aimer did not aim: not traced, and not arrived; no mistake.
        made = launched(unaim)
        launch = axial.launch(made, fractions)
        self.assertEqual(launch.aimed, (True, False))
        traced = axial.trace(made, launch)
        self.assertEqual(traced.arrived, (1, 0))
        self.assertTrue(all(math.isnan(value) for value in traced.exit_point[3:]))
        # An aimer that gives up on every ray of the line raises; the launch says so.
        made = held()

        def gives_up(*args: Any, **kwargs: Any) -> Any:
            raise ValueError("RobustRayAimer: every ray failed to converge for field (Hx=0.0, Hy=0.0)")

        made.optic.ray_tracer.ray_generator.generate_rays = gives_up
        with self.assertRaisesRegex(axial.AimFailed, "every ray failed to converge"):
            axial.launch(made, fractions)
        # Any other ValueError of the generator is no failure of the aim, and is not answered as one.
        made = held()

        def misconfigured(*args: Any, **kwargs: Any) -> Any:
            raise ValueError("Polarization state must be set for this analysis")

        made.optic.ray_tracer.ray_generator.generate_rays = misconfigured
        with self.assertRaisesRegex(ValueError, "Polarization") as raised:
            axial.launch(made, fractions)
        self.assertNotIsInstance(raised.exception, axial.AimFailed)
        # Unchanged, it passes: each ray at (0, f R) of the stop, which is the sphere, so at f R as it enters.
        made = held()
        launch = axial.launch(made, fractions)
        self.assertEqual(launch.aimed, (True, True))
        self.assertEqual([float(value) for value in launch.origins[:, 0]], [0.0, 0.0])
        for value, fraction in zip(launch.origins[:, 1], fractions, strict=True):
            self.assertAlmostEqual(float(value), fraction * 4.0, delta=AIMING_TOLERANCE_MM)
        self.assertEqual(axial.trace(made, launch).arrived, (1, 1))

    def test_a_launch_from_another_lines_optic_crosses_this_lines_stop_elsewhere_and_is_caught(self) -> None:
        # The stop behind the sphere, of another index at each line: the rays aimed through one line's optic, traced
        # through the other's, cross its stop millimetres apart from their points.
        fractions = (0.75, -0.75, 0.5)
        zero, one = axial.line_optic(PUPILS, 0), axial.line_optic(PUPILS, 1)
        with self.assertRaisesRegex(BuildMismatch, "ray 0 crosses the stop at"):
            axial.trace(one, axial.launch(zero, fractions))
        with self.assertRaisesRegex(BuildMismatch, "ray 0 crosses the stop at"):
            axial.trace(zero, axial.launch(one, fractions))
        self.assertEqual(axial.trace(one, axial.launch(one, fractions)).arrived, (1, 1, 1))
        # Answered with steps that launch every line's rays on the first line's optic, as before Stage 6.9: caught.
        first: dict[str, axial.LineOptic] = {}

        def from_first(held: axial.LineOptic, asked: Any) -> axial.Launch:
            return axial.launch(first.setdefault("optic", held), asked)

        steps = axial.optiland_steps()
        stale = axial.Steps(optic=steps.optic, launch=from_first, trace=steps.trace, focus=steps.focus)
        with self.assertRaisesRegex(BuildMismatch, "crosses the stop at"):
            axial.answer_axial({"kind": "colour", "lines": [0, 1], "marginal": [0.75]}, PUPILS, steps=stale)

    def test_without_the_refusal_optiland_would_state_the_focus_of_another_lens(self) -> None:
        # What the engine refuses (RequestTest) is what optiland's paraxial model does not see. Asked directly, the
        # module would state the paraxial focus of the lens without the term of power 2, which is 2.4 mm from the
        # contract's lens; and of the kinoform, a phase on a plane, no focus at all where its rays cross at 100 mm.
        data = axial.answer_axial(COLOUR, CURVED)
        assert isinstance(data, dict)
        substrate = float(thick_lens(50, -50, 4, 1.5)["rearFocalZ"])
        contract = float(thick_lens(1 / (1 / 50 + 2e-3), -50, 4, 1.5)["rearFocalZ"])
        self.assertAlmostEqual(data["fields"][0]["paraxialFocusZ"], substrate, delta=1e-9)
        self.assertGreater(abs(contract - substrate), 2.0)
        kinoform = axial.answer_axial({"kind": "colour", "lines": [0], "marginal": [0.1]}, KINOFORM)
        assert isinstance(kinoform, dict)
        self.assertIsNone(kinoform["fields"][0]["paraxialFocusZ"])
        point = decode_ndarray(kinoform["fields"][0]["rays"]["exitPoint"]).values()
        direction = decode_ndarray(kinoform["fields"][0]["rays"]["exitDirection"]).values()
        crossing = point[2] - point[1] * direction[2] / direction[1]
        self.assertAlmostEqual(crossing, 100.0, delta=0.01)
        engine = OptilandEngine(IDENTITY)
        for case, item in ((CURVED, QUADRATIC_SAG_TERM), (KINOFORM, "optiland-phase-paraxial-unseen")):
            result = engine.run(axial_request(case), case)
            self.assertEqual(result["status"], "unsupported")
            self.assertIn(item, [each["item"] for each in result["unsupported"]])

    def test_the_double_gauss_answers_both_kinds_at_every_line(self) -> None:
        spherical = axial.answer_axial(
            {"kind": "spherical", "lines": [0], "nearAxis": 0.1, "marginal": [0.97, 0.9], "profile": [0.1, 0.5, 0.9]},
            DOUBLE_GAUSS,
        )
        self.assertEqual(validate_axial_native("data", spherical), [])
        lines = list(range(len(DOUBLE_GAUSS["conditions"]["lines"])))
        colour = axial.answer_axial({"kind": "colour", "lines": lines, "marginal": [0.97, 0.9]}, DOUBLE_GAUSS)
        self.assertEqual(validate_axial_native("data", colour), [])
        self.assertEqual(len(colour["fields"]), len(lines))
        self.assertTrue(all(field["paraxialFocusZ"] is not None for field in colour["fields"]))
        self.assertTrue(all(field["sampling"]["raysUnaimed"] == 0 for field in colour["fields"]))
        self.assertTrue(math.isfinite(Decimal(str(colour["pupilRadiusMm"]))))
