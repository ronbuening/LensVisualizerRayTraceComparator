"""``axial.native`` of the worker: optiland's own rays along the axis at each line, and its paraxial focus there.

The first half needs no optiland: the request is read, an answer is written from stand-in steps and is valid by the
contract's port, and the engine dispatches it. The second half is the real optiland and is skipped, with the reason,
under an interpreter that has none. Its expected values are derived here: the paraxial focus of a refracting sphere in
closed form, and the exits of the rays by the 60-digit trace of ``exact.py``, never read from an engine's output; and
every setting the worker reads back is held to it with the mistake made on purpose.
"""

from __future__ import annotations

import copy
import math
import unittest
from decimal import Decimal
from typing import Any
from unittest import mock

from lvrtc_optiland import axial
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine, refusals
from lvrtc_optiland.first_order import LINEAR_SAG_TERM, QUADRATIC_SAG_TERM
from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray
from lvrtc_worker_kit.validate import validate_axial_native

from .exact import exact_trace
from .support import PLANE, asphere, make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_first_order import thick_lens
from .test_mtf import IDENTITY

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

# The same sphere with its stop 10 mm behind it, in the glass: the entrance pupil is the stop's image through the
# sphere, of another radius at each line. A ray parallel to the axis at the height h is bent to the slope
# -h (n - 1) / (n R) and reaches the stop at h (1 - 10 (n - 1) / (30 n)): the pupil's radius is 4 over that factor,
# 4.5 mm at n = 3/2 and 4 x 45.6 / 40.4 at n = 1.52.
PUPILS = make_case(
    [surface(0, sphere(30), semi=6.0), surface(10, PLANE, semi=4.0)],
    stop=1,
    indices=[[1.5, 1.5], [1.52, 1.52]],
    lines=(587.5618, 486.1327),
    image_z=90.0,
    stop_radius=4.0,
)
PUPIL_RADII = (4.5, 4 * 45.6 / 40.4)

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


def stand_in_steps(built: list[Any], traced: list[Any]) -> axial.Steps:
    """Steps that build named optics, launch three rays and trace them: every call is noted."""

    def build(case: dict[str, Any], lines: tuple[int, ...]) -> tuple[Any, ...]:
        built.append(lines)
        return tuple(f"optic {line}" for line in lines)

    def launch(optic: Any, fractions: Any) -> axial.Launch:
        return axial.Launch(origins=("origins of", optic), directions=("directions of", optic), radius_mm=4.0)

    def trace(optic: Any, origins: Any, directions: Any) -> axial.Traced:
        traced.append((optic, origins, directions))
        lost = optic == "optic 1"
        return axial.Traced(
            arrived=(1, 0) if lost else (1, 1),
            exit_point=(0.0, 1.0, 5.0, *([math.nan] * 3 if lost else (0.0, -1.0, 5.0))),
            exit_direction=(0.0, -0.125, 0.5, *([math.nan] * 3 if lost else (0.0, 0.125, 0.5))),
        )

    def focus(optic: Any) -> float | None:
        return 90.0 if optic == "optic 0" else None

    return axial.Steps(build=build, launch=launch, trace=trace, focus=focus)


class AnswerTest(unittest.TestCase):
    def test_every_line_states_the_rays_of_the_first_lines_launch_and_its_own_focus(self) -> None:
        built: list[Any] = []
        traced: list[Any] = []
        colour = {**COLOUR, "lines": [0, 1]}
        data = axial.answer_axial(colour, CASE, steps=stand_in_steps(built, traced))
        self.assertEqual(validate_axial_native("data", data), [])
        self.assertEqual(built, [(0, 1)])
        # The rays the first line's optic launched are traced at every line.
        self.assertEqual(
            traced,
            [("optic 0", ("origins of", "optic 0"), ("directions of", "optic 0"))]
            + [("optic 1", ("origins of", "optic 0"), ("directions of", "optic 0"))],
        )
        self.assertEqual(data["pupilRadiusMm"], 4.0)
        self.assertEqual([field["paraxialFocusZ"] for field in data["fields"]], [90.0, None])
        rays = data["fields"][1]["rays"]
        self.assertEqual(decode_ndarray(rays["fractions"]).values(), [0.75, 0.5])
        self.assertEqual(decode_ndarray(rays["arrived"]).values(), [1, 0])
        self.assertTrue(math.isnan(decode_ndarray(rays["exitPoint"]).values()[3]))
        self.assertEqual(data["fields"][1]["sampling"], {"raysLaunched": 2, "raysArrived": 1})
        self.assertEqual(axial.field_counts(data), {"lines": 2, "raysLaunched": 4, "raysArrived": 3})
        self.assertEqual(data["method"]["params"]["aiming"], "paraxial")

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
        # The pupil and the paraxial focus of the answer are optiland's first-order data: a phase profile and the terms
        # of power 1 and 2 are refused as for paraxial.first-order, from the case alone.
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


@unittest.skipIf(MISSING, MISSING or "")
class RealAxialTest(unittest.TestCase):
    """optiland's own axial rays on a refracting sphere that is its own stop, held to exact traces."""

    def answer(self, spec: dict[str, Any], case: dict[str, Any] = CASE) -> dict[str, Any]:
        data = axial.answer_axial(spec, case)
        self.assertIsInstance(data, dict)
        self.assertEqual(validate_axial_native("data", data), [])
        return data

    def test_the_rays_are_optilands_pupil_points_and_leave_the_sphere_where_the_exact_rays_do(self) -> None:
        data = self.answer({**SPHERICAL, "marginal": [0.75]})
        # The stop is the sphere itself and object space air: the entrance pupil is the stop, of radius 4.
        self.assertEqual(data["pupilRadiusMm"], 4.0)
        (field,) = data["fields"]
        fractions = decode_ndarray(field["rays"]["fractions"]).values()
        self.assertEqual(fractions, [0.25, -0.25, 0.75, -0.75, 0.5, -0.5])
        points = decode_ndarray(field["rays"]["exitPoint"]).values()
        directions = decode_ndarray(field["rays"]["exitDirection"]).values()
        self.assertEqual(decode_ndarray(field["rays"]["arrived"]).values(), [1] * 6)
        for ray, fraction in enumerate(fractions):
            exact = exact_trace(CASE, (0.0, fraction * 4.0, -10.0), (0.0, 0.0, 1.0))
            hit, direction = exact.hits[-1], exact.direction
            self.assertIsNotNone(direction)
            for axis in range(3):
                self.assertAlmostEqual(points[3 * ray + axis], float(hit[axis]), delta=1e-12)
                self.assertAlmostEqual(directions[3 * ray + axis], float(direction[axis]), delta=1e-15)
            # The mirror image: x is 0 in both, y and the y of the direction change sign.
            self.assertEqual(points[3 * ray], 0.0)

    def test_the_paraxial_focus_of_each_line_is_the_closed_form_and_the_same_rays_are_traced_at_both(self) -> None:
        data = self.answer({**COLOUR, "lines": [0, 1]})
        foci = [field["paraxialFocusZ"] for field in data["fields"]]
        self.assertAlmostEqual(foci[0], 90.0, delta=1e-12)
        self.assertAlmostEqual(foci[1], 1.52 * 30 / 0.52, delta=1e-12)
        # The heights the rays leave at differ between the lines only by the refraction, not by the launch: the exact
        # traces of the same launch at each line.
        for at, field in enumerate(data["fields"]):
            points = decode_ndarray(field["rays"]["exitPoint"]).values()
            for ray, fraction in enumerate(decode_ndarray(field["rays"]["fractions"]).values()):
                exact = exact_trace(CASE, (0.0, fraction * 4.0, -10.0), (0.0, 0.0, 1.0), line=at)
                self.assertAlmostEqual(points[3 * ray + 1], float(exact.hits[-1][1]), delta=1e-12)

    def test_each_setting_of_the_launch_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from lvrtc_optiland.build import build_case  # noqa: PLC0415

        fractions = (0.5, -0.5)

        def optic() -> Any:
            return build_case(CASE, lines=(0,)).optics[0]

        def robust(made: Any) -> None:
            made.ray_tracer.set_aiming("robust")

        def field(made: Any) -> None:
            made.fields.remove(0)
            made.fields.add(y=5.0)

        def second_field(made: Any) -> None:
            made.fields.add(y=5.0)

        def vignetted(made: Any) -> None:
            made.fields.remove(0)
            made.fields.add(y=0.0, vy=0.25)

        def apodized(made: Any) -> None:
            made.apodization = object()

        faults = {
            "aiming": robust,
            "field": field,
            "fields": second_field,
            "vignetting": vignetted,
            "apodization": apodized,
        }
        for name, mutate in faults.items():
            with self.subTest(fault=name):
                made = optic()
                mutate(made)
                with self.assertRaises(BuildMismatch):
                    axial.launch(made, fractions)

        def angle_field_type(made: Any) -> None:
            # Another type of field, at the same place: what it launches is not of an angle.
            made.fields.set_type("paraxial_image_height")

        with self.subTest(fault="field type"):
            made = optic()
            angle_field_type(made)
            with self.assertRaisesRegex(BuildMismatch, "the type of the field"):
                axial.launch(made, fractions)

        original = axial._ask
        for name, value in (("EPD not a number", math.nan), ("EPD zero", 0.0)):

            def epd(api: Any, made: Any, asked: str, value: float = value) -> float:
                return value if asked == "EPD" else original(api, made, asked)

            with (
                self.subTest(fault=name),
                mock.patch.object(axial, "_ask", epd),
                self.assertRaisesRegex(BuildMismatch, "no diameter of a pupil"),
            ):
                axial.launch(optic(), fractions)

        def launched(change: Any) -> Any:
            made = optic()
            generator = made.ray_tracer.ray_generator
            real = generator.generate_rays

            def wrong(*args: Any, **kwargs: Any) -> Any:
                rays = real(*args, **kwargs)
                change(rays)
                return rays

            generator.generate_rays = wrong
            return made

        moved = {
            "x": lambda rays: rays.x.__setitem__(0, 1e-12),
            "height": lambda rays: rays.y.__setitem__(1, rays.y[1] * (1 + 2**-52)),
            "L": lambda rays: rays.L.__setitem__(0, 1e-16),
            "M": lambda rays: rays.M.__setitem__(1, 1e-16),
            "N": lambda rays: rays.N.__setitem__(0, 1 - 2**-53),
        }
        for name, change in moved.items():
            with self.subTest(fault=f"launched {name}"):
                with self.assertRaises(BuildMismatch):
                    axial.launch(launched(change), fractions)
        # A column of another length than the rays asked for: one value of z for two rays.
        with (
            self.subTest(fault="launched column shape"),
            self.assertRaisesRegex(BuildMismatch, "launched 1 values of z, not 2"),
        ):
            axial.launch(launched(lambda rays: setattr(rays, "z", rays.z[:1])), fractions)
        # Unchanged, it passes, at the heights f times half of EPD.
        held = axial.launch(optic(), fractions)
        self.assertEqual(held.radius_mm, 4.0)
        self.assertEqual([float(value) for value in held.origins[:, 1]], [2.0, -2.0])

    def test_the_rays_of_every_line_are_launched_in_the_pupil_of_the_first_line_asked(self) -> None:
        # Pupils of another radius at each line: the answer's pupil, and the heights its rays leave the first surface
        # at, are the first line's of the request, whichever line that is. Launching from another line's optic is
        # caught.
        spec = {"kind": "colour", "lines": [0, 1], "marginal": [0.75, 0.5]}
        for lines in ([0, 1], [1, 0]):
            with self.subTest(lines=lines):
                data = self.answer({**spec, "lines": lines}, PUPILS)
                radius = PUPIL_RADII[lines[0]]
                self.assertAlmostEqual(data["pupilRadiusMm"], radius, delta=1e-12)
                self.assertGreater(abs(data["pupilRadiusMm"] - PUPIL_RADII[lines[1]]), 1e-3)
                for field in data["fields"]:
                    points = decode_ndarray(field["rays"]["exitPoint"]).values()
                    for ray, fraction in enumerate(decode_ndarray(field["rays"]["fractions"]).values()):
                        start = (0.0, fraction * radius, -10.0)
                        exact = exact_trace(PUPILS, start, (0.0, 0.0, 1.0), line=field["line"])
                        self.assertAlmostEqual(points[3 * ray + 1], float(exact.hits[-1][1]), delta=1e-11)

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
        self.assertTrue(math.isfinite(Decimal(str(colour["pupilRadiusMm"]))))
