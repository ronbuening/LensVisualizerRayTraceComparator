"""``summary.native`` of the worker: optiland's own first-order summary, one line at a time.

The first half needs no optiland: the request is read, an answer is written from stand-in steps and is valid by the
contract's port, and the engine dispatches it. The second half is the real optiland and is skipped, with the reason,
under an interpreter that has none. Its expected values are derived here: the paraxial ones in exact rational
arithmetic (``test_first_order.exact``, the textbook's y-nu trace, and the marginal ray of a finite object carried by
it), the working f-numbers of real rays traced in 60 digits by the contract's rules (``exact.exact_trace``):
``1 / (2 n' sin t')`` of the ray through the rim of the stop, which for a stop on the first surface is found without a
search (the ray from the object point to the rim of that surface) and behind it by bisecting the entrance height in 60
digits. Every setting the worker reads back is held to it with the mistake made on purpose.
"""

from __future__ import annotations

import copy
import dataclasses
import math
import unittest
from decimal import Decimal
from fractions import Fraction
from typing import Any
from unittest import mock

from lvrtc_optiland import summary
from lvrtc_optiland.build import BuildMismatch, index_rows
from lvrtc_optiland.engine import OptilandEngine, refusals
from lvrtc_optiland.mtf import TimeBudgetExceeded
from lvrtc_worker_kit.validate import validate_summary_native

from .exact import exact_sag, exact_trace
from .support import asphere, make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_first_order import exact
from .test_mtf import IDENTITY

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")

# A biconvex lens of radii 50 and -50 mm, 4 mm thick, in glass of index 1.5, whose first surface is its stop of radius
# 5 mm, clipped there: its entrance pupil is that surface's rim, at infinity and at a finite object alike.
STOP_RADIUS = 5.0


def lens_case(object_z: float | None = None) -> dict[str, Any]:
    return make_case(
        [surface(0.0, sphere(50), semi=STOP_RADIUS), surface(4.0, sphere(-50))],
        stop_radius=STOP_RADIUS,
        object_z=object_z,
    )


CASE = lens_case()
FINITE = lens_case(-200.0)

SPEC = {"lines": [0]}


def summary_request(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    return {"contract": "1.0", "id": "d" * 64, "caseId": case["id"], "quantity": "summary.native", "spec": spec}


class RequestTest(unittest.TestCase):
    def test_a_line_the_case_does_not_have_is_said_before_anything_is_built(self) -> None:
        refused = summary.read_request({"lines": [0, 3]}, CASE)
        self.assertEqual([item["item"] for item in refused], ["line"])  # type: ignore[index]
        asked = summary.read_request(SPEC, FINITE)
        self.assertEqual(asked, summary.SummaryRequest(lines=(0,)))


def stand_in_steps(calls: list[Any]) -> summary.Steps:
    """Steps that state binary fractions, every call noted; the second line has no first-order data."""

    def paraxial(case: dict[str, Any], line: int) -> dict[str, float]:
        calls.append(("paraxial", line))
        if line == 1:
            raise summary.LineUnavailable("system.afocal", "optiland's f2() is inf mm")
        return {
            "rearFocalZ": 52.5,
            "focalLengthMm": 50.5,
            "entrancePupilDiameterMm": 10.0,
            "stopDiameterMm": 10.0,
            "imageSpaceFNumber": 5.05,
            "paraxialWorkingFNumber": 5.25,
            "totalTrackMm": 54.0,
            "exitPupilDiameterMm": 10.5,
            "magnification": -0.25,
        }

    def working(case: dict[str, Any], line: int) -> summary.Working:
        calls.append(("working", line))
        return summary.Working(f_number=5.125, rim_rays_lost=4, rim_rays_vignetted=4)

    def unaimed(case: dict[str, Any], line: int) -> summary.Working:
        calls.append(("unaimed", line))
        raise ValueError("Working F/# could not be calculated due to raytrace errors.")

    return summary.Steps(paraxial=paraxial, working=working, unaimed=unaimed)


TWO_LINES = make_case(
    [surface(0.0, sphere(50), semi=STOP_RADIUS), surface(4.0, sphere(-50))],
    stop_radius=STOP_RADIUS,
    lines=(587.5618, 486.1327),
)


class AnswerTest(unittest.TestCase):
    def test_each_line_states_optilands_values_and_a_line_without_first_order_data_says_why(self) -> None:
        calls: list[Any] = []
        data = summary.answer_summary({"lines": [0, 1]}, TWO_LINES, steps=stand_in_steps(calls))
        self.assertEqual(validate_summary_native("data", data), [])
        self.assertEqual(calls, [("paraxial", 0), ("working", 0), ("unaimed", 0), ("paraxial", 1)])
        first, second = data["lines"]
        self.assertEqual((first["status"], first["wavelengthNm"]), ("ok", 587.5618))
        self.assertEqual(
            [first[name] for name in summary.VALUES],
            [52.5, 50.5, 10.0, 10.0, 5.05, 5.25, 5.125, None, 54.0, None],
        )
        # Beside the values: the exit pupil, the magnification and the working f-number's rim rays dark before the image
        # at a surface other than the stop, all four, which optiland takes all the same, and is noted; the unaimed
        # working f-number raised, and is noted.
        self.assertEqual(
            first["sampling"], {"exitPupilDiameterMm": 10.5, "magnification": -0.25, "workingRimRaysVignetted": 4.0}
        )
        vignetted = "4 of the rim rays of optiland's workingFNumber are dark at a surface other than the stop"
        self.assertTrue(any(vignetted in note and "all the same" in note for note in data["notes"]))
        self.assertTrue(any("workingFNumberUnaimed" in note and "ValueError" in note for note in data["notes"]))
        self.assertEqual((second["status"], second["reason"]), ("unavailable", "system.afocal"))
        self.assertTrue(all(second[name] is None for name in summary.VALUES))
        self.assertEqual(data["method"]["name"], summary.METHOD)
        self.assertEqual(summary.line_counts(data), {"lines": 2, "ok": 1, "unavailable": 1})

    def test_a_request_is_given_up_between_two_lines_after_its_budget_and_fatal_errors_are_no_lines(self) -> None:
        ticks = iter([0.0, 0.0, summary.REQUEST_BUDGET_S + 1])
        with self.assertRaises(TimeBudgetExceeded):
            summary.answer_summary({"lines": [0, 1]}, TWO_LINES, steps=stand_in_steps([]), clock=lambda: next(ticks))
        for fatal in (BuildMismatch("a read-back"), MemoryError(), ImportError("numba")):
            failing = dataclasses.replace(stand_in_steps([]), working=mock.Mock(side_effect=fatal))
            with self.subTest(fatal=type(fatal).__name__), self.assertRaises(type(fatal)):
                summary.answer_summary(SPEC, CASE, steps=failing)
        # A working f-number that is no finite number is left null, and noted.
        infinite = dataclasses.replace(stand_in_steps([]), working=lambda case, line: summary.Working(math.inf, 0, 0))
        data = summary.answer_summary(SPEC, CASE, steps=infinite)
        self.assertIsNone(data["lines"][0]["workingFNumber"])  # type: ignore[index]
        self.assertTrue(any("is inf" in note for note in data["notes"]))  # type: ignore[union-attr]

    def test_a_rim_ray_dark_first_at_the_stop_or_at_no_surface_of_the_case_is_lost_but_not_vignetted(self) -> None:
        # Rows: optiland's object surface, the case's surfaces 0 to 3 (the stop is 2), the image surface; a column a ray.
        def lit(*first_dark: int | None) -> list[list[bool]]:
            return [[dark is None or row < dark for dark in first_dark] for row in range(6)]

        # Four rays dark first at the stop (optiland's row 3): each clipped there by a rounding, none vignetted.
        self.assertEqual(summary.rim_ray_counts(lit(3, 3, 3, 3), stop=2, surfaces=4), (4, 0))
        # Dark first at the image surface (row 5) or at the object surface (row 0): stopped by no surface of the case.
        self.assertEqual(summary.rim_ray_counts(lit(5, 0, None, None), stop=2, surfaces=4), (2, 0))
        # Dark first at the case's surfaces 0 and 3 (rows 1 and 4): vignetted.
        self.assertEqual(summary.rim_ray_counts(lit(1, 4, 3, None), stop=2, surfaces=4), (3, 2))
        self.assertEqual(summary.rim_ray_counts(lit(None, None, None, None), stop=2, surfaces=4), (0, 0))

    def test_the_port_holds_an_answer_to_the_invariants_of_the_quantity(self) -> None:
        base = summary.answer_summary({"lines": [0, 1]}, TWO_LINES, steps=stand_in_steps([]))
        stated = copy.deepcopy(base)
        stated["lines"][1]["focalLengthMm"] = 50.0
        self.assertEqual([issue.path for issue in validate_summary_native("data", stated)], ["/lines/1"])
        reasonless = copy.deepcopy(base)
        del reasonless["lines"][1]["reason"]
        self.assertEqual([issue.path for issue in validate_summary_native("data", reasonless)], ["/lines/1"])
        twice = {"lines": [0, 0]}
        self.assertEqual([issue.path for issue in validate_summary_native("spec", twice)], ["/lines"])

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        request = summary_request(DOUBLE_GAUSS, SPEC)
        self.assertIn("summary.native", engine.describe()["capabilities"]["quantities"])
        with mock.patch("lvrtc_optiland.engine.answer_summary", side_effect=BuildMismatch("read-back fault")):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["error"]["code"]), ("error", "build-mismatch"))
        with mock.patch("lvrtc_optiland.engine.answer_summary", side_effect=TimeBudgetExceeded("too long")):
            self.assertEqual(engine.run(request, DOUBLE_GAUSS)["error"]["code"], "time-budget")
        stand_in = summary.answer_summary(SPEC, DOUBLE_GAUSS, steps=stand_in_steps([]))
        with mock.patch("lvrtc_optiland.engine.answer_summary", return_value=stand_in):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["diagnostics"]["counts"], {"surfaces": 11, "lines": 1, "ok": 1, "unavailable": 0})
        bad = {**request, "spec": {"lines": [0], "fieldAnglesDeg": [0.0]}}
        self.assertEqual(engine.run(bad, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        beyond = engine.run({**request, "spec": {"lines": [2]}}, DOUBLE_GAUSS)
        self.assertEqual((beyond["status"], beyond["unsupported"][0]["item"]), ("unsupported", "line"))
        # What optiland's paraxial model does not see is refused from the case, as for paraxial.first-order.
        quadratic = make_case([surface(0.0, asphere(50, 0, (2, 1e-3)), semi=STOP_RADIUS), surface(4.0, sphere(-50))])
        items = [item["item"] for item in refusals(summary_request(quadratic, SPEC), quadratic)]
        self.assertEqual(items, ["surface.asphere.quadratic-term"])
        self.assertEqual(refusals(request, DOUBLE_GAUSS), [])


# ── Expected values, derived ─────────────────────────────────────────────────────────────────────────────────────


def paraxial_working(case: dict[str, Any]) -> Fraction:
    """``1 / (2 |w'|)`` of the paraxial marginal ray of the case's axial object point, in exact rational arithmetic.

    At infinity the ray enters at the height of the entrance pupil's rim, parallel; from a finite object it leaves the
    axial point toward that rim, its angle the rim's height over the distance from the object to the pupil. ``w`` is
    the reduced angle ``n u``, carried as in ``test_first_order.exact``.
    """
    values = exact(case)
    surfaces = case["system"]["surfaces"]
    indices = [Fraction(value) for value in index_rows(case)[0]]
    vertices = [Fraction(entry["z"]) for entry in surfaces]
    curvatures = [
        Fraction(0) if entry["shape"].get("radius") is None else 1 / Fraction(entry["shape"]["radius"])
        for entry in surfaces
    ]
    rim = values["entrancePupilSemiDiameter"]
    placed = case["conditions"]["object"]
    if placed["kind"] == "infinity":
        y, w = rim, Fraction(0)
    else:
        w = rim / (values["entrancePupilZ"] - Fraction(placed["z"]))
        y = w * (vertices[0] - Fraction(placed["z"]))
    for number in range(len(surfaces)):
        before = Fraction(1) if number == 0 else indices[number - 1]
        w = w - y * (indices[number] - before) * curvatures[number]
        if number + 1 < len(surfaces):
            y = y + (vertices[number + 1] - vertices[number]) / indices[number] * w
    return 1 / (2 * abs(w))


def unclipped(case: dict[str, Any]) -> dict[str, Any]:
    """The case with no surface clipping: optiland traces a clipped ray on, with an intensity of 0, and
    ``get_working_FNO`` takes its angle where every rim ray is clipped."""
    free = copy.deepcopy(case)
    for entry in free["system"]["surfaces"]:
        entry["aperture"]["semiDiameter"] = None
    return free


Point = tuple[float, float, float]


def working_of(case: dict[str, Any], origin: Point, direction: Point) -> float:
    """``1 / (2 n' sin t')`` of one rim ray traced in 60 digits, ``t'`` its angle to the axis, the axial chief ray's.
    Every rim ray of these tests either meets the stop's clip radius or is clipped there, so none is clipped first."""
    traced = exact_trace(unclipped(case), origin, direction)
    d = traced.direction
    assert d is not None, "the rim ray reaches the image"
    sine = (d[0] * d[0] + d[1] * d[1]).sqrt() / (d[0] * d[0] + d[1] * d[1] + d[2] * d[2]).sqrt()
    return float(1 / (2 * Decimal(index_rows(case)[0][-1]) * sine))


def aimed_height(case: dict[str, Any], start_z: float) -> float:
    """The entrance height of the ray parallel to the axis that meets the stop at its clip radius, by bisection in 60
    digits on ``exact_trace``'s hit at the stop: what optiland's ``robust`` aiming solves for at infinity."""
    system = case["system"]
    stop = system["stopIndex"]
    clip = Decimal(system["surfaces"][stop]["aperture"]["semiDiameter"])
    low, high = Decimal(0), 2 * clip

    free = unclipped(case)

    def at_stop(height: Decimal) -> Decimal:
        return exact_trace(free, (0.0, float(height), start_z), (0.0, 0.0, 1.0)).hits[stop][1]

    for _ in range(80):
        middle = (low + high) / 2
        if at_stop(middle) < clip:
            low = middle
        else:
            high = middle
    return float((low + high) / 2)


@unittest.skipIf(MISSING, MISSING or "")
class RealSummaryTest(unittest.TestCase):
    """optiland's own summary of synthetic lenses, held to values derived here."""

    def answer(self, case: dict[str, Any]) -> dict[str, Any]:
        data = summary.answer_summary(SPEC, case)
        self.assertIsInstance(data, dict)
        assert isinstance(data, dict)
        self.assertEqual(validate_summary_native("data", data), [], data)
        self.notes = data["notes"]
        return data["lines"][0]

    def test_the_paraxial_values_are_the_exact_traces_and_the_working_f_number_is_the_rim_rays(self) -> None:
        for case in (CASE, FINITE):
            with self.subTest(object=case["conditions"]["object"]["kind"]):
                line = self.answer(case)
                expected = exact(case)
                rim = 2 * expected["entrancePupilSemiDiameter"]
                close = {
                    "rearFocalZ": expected["rearFocalZ"],
                    "focalLengthMm": expected["efl"],
                    "entrancePupilDiameterMm": rim,
                    "imageSpaceFNumber": abs(expected["efl"]) / rim,
                    "paraxialWorkingFNumber": paraxial_working(case),
                }
                for name, value in close.items():
                    scale = max(1.0, abs(float(value)))
                    self.assertAlmostEqual(line[name], float(value), delta=1e-12 * scale, msg=name)
                self.assertEqual(line["stopDiameterMm"], 2 * STOP_RADIUS)
                track = case["conditions"]["imageZ"] - case["system"]["surfaces"][0]["z"]
                self.assertEqual(line["totalTrackMm"], track)
                self.assertIsNone(line["nominalFNumber"])
                self.assertIsNone(line["halfFieldDeg"])
                # The real rim ray: on the first surface's rim, which is the stop's, from the axial object point.
                sag = float(exact_sag(case["system"]["surfaces"][0]["shape"], Decimal(STOP_RADIUS)))
                if case is CASE:
                    aimed = working_of(case, (0.0, STOP_RADIUS, -10.0), (0.0, 0.0, 1.0))
                    # The paraxial pupil's rim is the stop's: the unaimed ray is the same ray.
                    unaimed = aimed
                    self.assertEqual(line["paraxialWorkingFNumber"], line["imageSpaceFNumber"])
                else:
                    reach = sag + 200.0
                    aimed = working_of(case, (0.0, 0.0, -200.0), (0.0, STOP_RADIUS / reach, 1.0))
                    # Unaimed, optiland's ray leaves the object point for the rim of its paraxial pupil, on the vertex
                    # plane: another ray, which meets the curved surface below its rim.
                    unaimed = working_of(case, (0.0, 0.0, -200.0), (0.0, STOP_RADIUS / 200.0, 1.0))
                    magnification = float(expected["magnification"])
                    self.assertAlmostEqual(line["sampling"]["magnification"], magnification, delta=1e-12)
                    self.assertGreater(line["paraxialWorkingFNumber"], line["imageSpaceFNumber"])
                self.assertAlmostEqual(line["workingFNumber"], aimed, delta=1e-9)
                self.assertAlmostEqual(line["sampling"]["workingFNumberUnaimed"], unaimed, delta=1e-9)
                # Aimed, the rim rays meet the stop's clip radius and get through. Unaimed from a finite object they meet
                # the curved stop surface above its rim and are dark: optiland takes their angles all the same.
                self.assertEqual(line["sampling"]["workingRimRaysVignetted"], 0.0)
                self.assertEqual(line["sampling"]["unaimedRimRaysLost"], 0.0 if case is CASE else 4.0)
                self.assertEqual(self.notes, [])

    def test_behind_a_lens_the_aimed_rim_ray_meets_the_stop_the_unaimed_one_leaves_the_paraxial_pupil(self) -> None:
        line = self.answer(DOUBLE_GAUSS)
        expected = exact(DOUBLE_GAUSS)
        start = DOUBLE_GAUSS["system"]["surfaces"][0]["z"] - 10.0
        height = aimed_height(DOUBLE_GAUSS, start)
        aimed = working_of(DOUBLE_GAUSS, (0.0, height, start), (0.0, 0.0, 1.0))
        rim = float(expected["entrancePupilSemiDiameter"])
        unaimed = working_of(DOUBLE_GAUSS, (0.0, rim, start), (0.0, 0.0, 1.0))
        # The aimer settles to 1e-10 mm at the stop: the angle, and the f-number, to well within 1e-8.
        self.assertAlmostEqual(line["workingFNumber"], aimed, delta=1e-8)
        self.assertAlmostEqual(line["sampling"]["workingFNumberUnaimed"], unaimed, delta=1e-9)
        self.assertNotAlmostEqual(aimed, unaimed, delta=1e-4)
        image_space = float(abs(expected["efl"]) / (2 * expected["entrancePupilSemiDiameter"]))
        self.assertAlmostEqual(line["imageSpaceFNumber"], image_space, delta=1e-12)

    def test_each_setting_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from lvrtc_optiland.build import build_optic, optiland_api  # noqa: PLC0415
        from lvrtc_optiland.mtf import mtf_api  # noqa: PLC0415

        api = optiland_api()

        def built(case: dict[str, Any] = CASE) -> Any:
            return build_optic(case, 0, api)

        def aperture_type() -> Any:
            optic = built()
            optic.set_aperture("EPD", 2 * STOP_RADIUS)
            return optic

        def stop_value() -> Any:
            optic = built()
            optic.set_aperture("float_by_stop_size", 2 * STOP_RADIUS + 1e-9)
            return optic

        def wavelength() -> Any:
            optic = built()
            optic.wavelengths.add(value=0.5, is_primary=True)
            return optic

        def image_space() -> Any:
            other = copy.deepcopy(CASE)
            rows = index_rows(other)
            rows[0][-1] = 1.25
            from lvrtc_worker_kit.ndarray import encode_ndarray  # noqa: PLC0415

            other["conditions"]["indexAfterSurface"] = encode_ndarray("f8", rows[0], [1, len(rows[0])])
            return built(other)

        def marginal_start() -> Any:
            optic = built()
            heights, slopes = optic.paraxial.marginal_ray()
            optic.paraxial.marginal_ray = lambda: (heights * 1.5, slopes)
            return optic

        faults = {
            "aperture type": (aperture_type, "the type of the system aperture"),
            "stop diameter": (stop_value, "the stop diameter"),
            "wavelength": (wavelength, "the wavelength"),
            "image space": (image_space, "the index of the image space"),
            "marginal ray": (marginal_start, "where the marginal ray starts"),
        }
        for name, (make, said) in faults.items():
            with self.subTest(fault=name), self.assertRaisesRegex(BuildMismatch, said):
                summary.paraxial_step(CASE, 0, api, optic=make())
        # Unchanged, it passes.
        self.assertIn("focalLengthMm", summary.paraxial_step(CASE, 0, api, optic=built()))

        tools = mtf_api()

        def unaiming(optic: Any, field: Any, wavelength: float) -> Any:
            optic.ray_tracer.set_aiming("paraxial")
            return tools.get_working_FNO(optic, field, wavelength)

        with self.assertRaisesRegex(BuildMismatch, "the ray aiming"):
            summary.working_step(CASE, 0, api, dataclasses.replace(tools, get_working_FNO=unaiming))

        def aiming(optic: Any, field: Any, wavelength: float) -> Any:
            optic.ray_tracer.set_aiming("robust")
            return tools.get_working_FNO(optic, field, wavelength)

        with self.assertRaisesRegex(BuildMismatch, "the ray aiming after"):
            summary.unaimed_step(CASE, 0, api, dataclasses.replace(tools, get_working_FNO=aiming))

        def robust(case: dict[str, Any], line: int, given: Any) -> Any:
            optic = build_optic(case, line, given)
            optic.ray_tracer.set_aiming("robust")
            return optic

        with mock.patch("lvrtc_optiland.summary.build_optic", side_effect=robust):
            with self.assertRaisesRegex(BuildMismatch, "the ray aiming"):
                summary.unaimed_step(CASE, 0, api, tools)

    def test_rim_rays_clipped_behind_the_stop_are_counted_and_their_angles_taken_all_the_same(self) -> None:
        # The lens of CASE with its second surface clipped at 4.5 mm: the rim rays meet it near 4.9 mm and are dark
        # there. optiland's working f-number is then the mean of the four dark rays' angles, the unclipped value.
        narrow = lens_case()
        narrow["system"]["surfaces"][1]["aperture"]["semiDiameter"] = 4.5
        line = self.answer(narrow)
        self.assertEqual(line["sampling"]["workingRimRaysVignetted"], 4.0)
        unclipped = working_of(CASE, (0.0, STOP_RADIUS, -10.0), (0.0, 0.0, 1.0))
        self.assertAlmostEqual(line["workingFNumber"], unclipped, delta=1e-9)
        said = "line 0: 4 of the rim rays of optiland's workingFNumber are dark at a surface other than the stop, and "
        self.assertIn(said + "optiland takes their angles all the same", self.notes)

    def test_rim_rays_dark_only_at_the_stop_are_lost_and_not_vignetted(self) -> None:
        # optiland's own working f-number of the lens, the intensities of its traced rays then read dark from the stop on
        # (optiland's row 1, the case's surface 0) for the four rim rays: what an aimer that settled a rounding outside
        # the clip radius leaves. Read through the class's own property, so that the worker reads it as it would.
        import numpy as np  # noqa: PLC0415

        from lvrtc_optiland.build import optiland_api  # noqa: PLC0415
        from lvrtc_optiland.mtf import field_optic, mtf_api  # noqa: PLC0415

        api, tools = optiland_api(), mtf_api()
        optic = field_optic(CASE, 0, 0.0, api, tools)
        group = type(optic.surfaces)
        real = group.intensity

        def dark_at_the_stop(surfaces: Any) -> Any:
            intensity = np.array(real.fget(surfaces), dtype=np.float64)
            intensity[1:, 1:] = 0.0
            return intensity

        with mock.patch.object(group, "intensity", property(dark_at_the_stop)):
            working = summary._working(api, tools, optic, CASE)
        self.assertEqual((working.rim_rays_lost, working.rim_rays_vignetted), (4, 0))
        # The same rays read dark first at the second surface: vignetted.
        def dark_behind(surfaces: Any) -> Any:
            intensity = np.array(real.fget(surfaces), dtype=np.float64)
            intensity[2:, 1:] = 0.0
            return intensity

        with mock.patch.object(group, "intensity", property(dark_behind)):
            working = summary._working(api, tools, optic, CASE)
        self.assertEqual((working.rim_rays_lost, working.rim_rays_vignetted), (4, 4))

    def test_an_afocal_system_is_a_line_without_values(self) -> None:
        # A surface of radius 50 mm into glass of index 1.5 and one of radius -25 mm 225 mm behind it: the powers 0.01
        # and 0.02 cancel against 0.01 x 0.02 x 225 / 1.5, and parallel light leaves parallel (test_first_order).
        afocal = make_case(
            [surface(0.0, sphere(50), semi=STOP_RADIUS), surface(225.0, sphere(-25))],
            indices=[[1.5, 1.0]],
            stop_radius=STOP_RADIUS,
        )
        data = summary.answer_summary(SPEC, afocal)
        self.assertEqual(validate_summary_native("data", data), [])
        line = data["lines"][0]  # type: ignore[index]
        self.assertEqual((line["status"], line["reason"]), ("unavailable", "system.afocal"))


if __name__ == "__main__":
    unittest.main()
