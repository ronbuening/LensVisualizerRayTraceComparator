"""``chief.native`` of the worker: optiland's own distortion model, its chief rays across the field, its paraxial
pupils.

The first half needs no optiland: the request is read, an answer is written from stand-in steps and is valid by the
contract's port, and the engine dispatches it. The second half is the real optiland and is skipped, with the reason,
under an interpreter that has none. Its expected values are derived here, in closed form: a refracting sphere that is
its own stop passes every chief ray through its vertex, refracted to ``asin(sin(theta) / n)``, so its landing, its
paraxial scale and its percent distortion are formulas of the angle and the index; a sphere with its stop 10 mm behind
it in the glass has the paraxial entrance pupil ``10 / (n - 10 (n - 1) / R)`` and a real chief ray found here by
bisection of its own exact refraction. Every setting the worker reads back is held to it with the mistake made on
purpose, and the behaviour of optiland's robust aimer that keeps the worker off it for distortion is pinned.
"""

from __future__ import annotations

import copy
import dataclasses
import math
import unittest
from collections.abc import Callable
from typing import Any
from unittest import mock

from lvrtc_optiland import chief
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine, refusals
from lvrtc_optiland.first_order import LINEAR_SAG_TERM, QUADRATIC_SAG_TERM
from lvrtc_optiland.mtf import TimeBudgetExceeded
from lvrtc_worker_kit.validate import validate_chief_native

from .support import PLANE, asphere, make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_mtf import IDENTITY

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")

# One sphere of radius 30 into glass, its own stop of radius 4, the image 90 mm behind it in the glass; at the second
# line the glass is of a higher index. Every chief ray passes through the vertex.
INDICES = (1.5, 1.52)
CASE = make_case(
    [surface(0, sphere(30), semi=4.0)],
    indices=[[INDICES[0]], [INDICES[1]]],
    lines=(587.5618, 486.1327),
    image_z=90.0,
    stop_radius=4.0,
)

# The same sphere with its stop 10 mm behind it in the glass, the last surface.
PUPILS = make_case(
    [surface(0, sphere(30), semi=6.0), surface(10, PLANE, semi=4.0)],
    stop=1,
    indices=[[1.5, 1.5], [1.52, 1.52]],
    lines=(587.5618, 486.1327),
    image_z=90.0,
    stop_radius=4.0,
)

# A lens whose first surface has a term of power 2 and one with a term of power 1.
CURVED = make_case([surface(0.0, asphere(50, 0, (2, 1e-3))), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]])
CONE = make_case([surface(0.0, asphere(50, 0, (1, 1e-3))), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]])

DISTORTION = {"kind": "distortion", "lines": [0], "maxFieldDeg": 20.0, "fieldAnglesDeg": [5.0, 10.0, 20.0]}
LATERAL = {"kind": "lateral-colour", "lines": [0, 1], "maxFieldDeg": 20.0, "fieldAnglesDeg": [0.0, 10.0, 20.0]}
PUPIL_SPEC = {"kind": "pupils", "lines": [0], "maxFieldDeg": 20.0, "fieldAnglesDeg": [10.0, 20.0]}


def chief_request(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    return {"contract": "1.0", "id": "d" * 64, "caseId": case["id"], "quantity": "chief.native", "spec": spec}


class RequestTest(unittest.TestCase):
    def test_what_the_engine_does_not_answer_is_said_before_anything_is_built(self) -> None:
        def items(spec: dict[str, Any], case: dict[str, Any] = CASE) -> list[str]:
            asked = chief.read_request(spec, case)
            return [item["item"] for item in asked] if isinstance(asked, list) else []

        self.assertEqual(items(DISTORTION), [])
        self.assertEqual(items({**LATERAL, "lines": [0, 7]}), ["line"])
        finite = copy.deepcopy(CASE)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        self.assertEqual(items(PUPIL_SPEC, finite), ["object.finite"])
        asked = chief.read_request(LATERAL, CASE)
        self.assertIsInstance(asked, chief.ChiefRequest)
        self.assertEqual(
            (asked.kind, asked.lines, asked.max_field_deg, asked.angles),
            ("lateral-colour", (0, 1), 20.0, (0.0, 10.0, 20.0)),
        )


def stand_in_steps(calls: list[Any]) -> chief.Steps:
    """Steps in optiland's frame, every call noted: a landing at the angle over two (optiland's y), a distortion of
    -0.775 percent, a chief ray, paraxial pupils at 7.5 and 10. The 20 degree field fails in each step but the pupils.
    """

    def landing(case: dict[str, Any], line: int, angle: float) -> tuple[float, float] | None:
        calls.append(("landing", line, angle))
        if angle == 20.0 and line == 1:
            return None
        return (0.0, angle / 2)

    def distortion(case: dict[str, Any], line: int, max_field: float, angle: float) -> chief.DistortionFigures:
        calls.append(("distortion", line, max_field, angle))
        if angle == 20.0:
            raise ValueError(chief.REASONS["scale"])
        return chief.DistortionFigures(
            real_mm=-angle / 2,
            ideal_mm=-angle / 2 * 1.0078125,
            percent=-0.775,
            landing_mm=-angle / 2 - 0.25,
            scale_mm=57.25,
        )

    def chief_ray(case: dict[str, Any], line: int, angle: float) -> chief.ChiefRay:
        calls.append(("chief", line, angle))
        if angle == 20.0:
            raise ZeroDivisionError("a stand-in fault")
        return chief.ChiefRay((0.0, 2.0, 0.0), (0.0, -0.25, 1.0), (0.0, -1.0, 50.0), (0.0, -0.125, 1.0), -5.0)

    def pupils(case: dict[str, Any], line: int) -> tuple[float, float] | None:
        calls.append(("pupils", line))
        return (7.5, 10.0)

    return chief.Steps(distortion=distortion, landing=landing, chief_ray=chief_ray, pupils=pupils)


class AnswerTest(unittest.TestCase):
    def test_distortion_states_optilands_figures_and_its_landing_mirrored_and_a_field_without_a_scale(self) -> None:
        calls: list[Any] = []
        data = chief.answer_chief(DISTORTION, CASE, steps=stand_in_steps(calls))
        self.assertEqual(validate_chief_native("data", data), [])
        # The identifying landing first, then the model, field by field.
        self.assertEqual(calls[:2], [("landing", 0, 5.0), ("distortion", 0, 20.0, 5.0)])
        first = data["fields"][0]
        self.assertEqual(first["chiefLandingMm"], -2.5)
        self.assertEqual(first["figures"]["realHeightMm"], -2.5)
        self.assertEqual(first["figures"]["idealHeightMm"], -2.5 * 1.0078125)
        self.assertEqual(first["figures"]["percent"], -0.775)
        self.assertEqual(first["sampling"], {"focalScaleMm": 57.25, "distortionLandingMm": -2.75})
        self.assertEqual([field["status"] for field in data["fields"]], ["ok", "ok", "unavailable"])
        self.assertEqual(data["fields"][2]["reason"], "no-scale")
        # Where the identifying chief ray landed is still said of a field without a scale.
        self.assertEqual(data["fields"][2]["chiefLandingMm"], -10.0)
        self.assertEqual(data["reference"]["focalScaleMm"], 57.25)
        self.assertEqual(data["reference"]["probeAngleDeg"], chief.NEAR_AXIS * 20.0)
        self.assertEqual(data["method"]["name"], chief.DISTORTION_METHOD)
        self.assertEqual(data["method"]["params"]["aiming"], "paraxial")
        self.assertEqual(chief.field_counts(data), {"fields": 3, "ok": 2, "unavailable": 1})

    def test_reference_scales_that_differ_between_fields_are_noted(self) -> None:
        steps = stand_in_steps([])

        def distortion(case: dict[str, Any], line: int, max_field: float, angle: float) -> chief.DistortionFigures:
            figures = steps.distortion(case, line, max_field, angle)
            return dataclasses.replace(figures, scale_mm=figures.scale_mm + angle)

        data = chief.answer_chief(DISTORTION, CASE, steps=dataclasses.replace(steps, distortion=distortion))
        self.assertEqual(data["reference"]["focalScaleMm"], 62.25)
        self.assertIn("the fields' optics gave the reference scales that differ", data["notes"])

    def test_lateral_colour_states_each_lines_landings_and_a_field_without_one(self) -> None:
        calls: list[Any] = []
        data = chief.answer_chief(LATERAL, CASE, steps=stand_in_steps(calls))
        self.assertEqual(validate_chief_native("data", data), [])
        self.assertEqual([field["line"] for field in data["fields"]], [0, 0, 0, 1, 1, 1])
        self.assertEqual([field["wavelengthNm"] for field in data["fields"]], [587.5618] * 3 + [486.1327] * 3)
        self.assertEqual([field["chiefLandingMm"] for field in data["fields"]], [-0.0, -5.0, -10.0, -0.0, -5.0, None])
        last = data["fields"][5]
        self.assertEqual((last["status"], last["reason"]), ("unavailable", "no-chief-landing"))
        self.assertTrue(all(field["figures"] is None and field["chiefRay"] is None for field in data["fields"]))
        self.assertEqual(data["method"]["name"], chief.CHIEF_METHOD)
        self.assertFalse(any(call[0] == "distortion" for call in calls))

    def test_pupils_state_the_chief_ray_and_the_paraxial_pupils_and_a_field_optiland_raised_on(self) -> None:
        calls: list[Any] = []
        data = chief.answer_chief(PUPIL_SPEC, CASE, steps=stand_in_steps(calls))
        self.assertEqual(validate_chief_native("data", data), [])
        self.assertEqual(
            data["fields"][0]["chiefRay"],
            {
                "entryPoint": [0.0, 2.0, 0.0],
                "entryDirection": [0.0, -0.25, 1.0],
                "exitPoint": [0.0, -1.0, 50.0],
                "exitDirection": [0.0, -0.125, 1.0],
            },
        )
        self.assertEqual(data["fields"][0]["chiefLandingMm"], -5.0)
        failed = data["fields"][1]
        self.assertEqual((failed["status"], failed["reason"]), ("unavailable", "optiland-raised-ZeroDivisionError"))
        self.assertEqual(data["reference"]["paraxialEntrancePupilZ"], 7.5)
        self.assertEqual(data["reference"]["paraxialExitPupilZ"], 10.0)
        self.assertNotIn(("landing", 0, 10.0), calls, "a field of pupils is identified by its own chief ray")
        none = dataclasses.replace(stand_in_steps([]), pupils=lambda case, line: None)
        data = chief.answer_chief(PUPIL_SPEC, CASE, steps=none)
        reference = data["reference"]
        self.assertEqual((reference["paraxialEntrancePupilZ"], reference["paraxialExitPupilZ"]), (None, None))
        self.assertTrue(any(note.startswith("no-paraxial-pupils") for note in data["notes"]))

    def test_a_chief_ray_that_does_not_arrive_is_its_own_reason(self) -> None:
        def lost(case: dict[str, Any], line: int, angle: float) -> chief.ChiefRay:
            raise ValueError(chief.REASONS["ray"])

        steps = dataclasses.replace(stand_in_steps([]), chief_ray=lost)
        data = chief.answer_chief(PUPIL_SPEC, CASE, steps=steps)
        self.assertEqual({field["reason"] for field in data["fields"]}, {"no-chief-ray"})
        # Any other ValueError is optiland's, by its class.
        other = dataclasses.replace(steps, chief_ray=mock.Mock(side_effect=ValueError("another")))
        data = chief.answer_chief(PUPIL_SPEC, CASE, steps=other)
        self.assertEqual({field["reason"] for field in data["fields"]}, {"optiland-raised-ValueError"})

    def test_a_request_is_given_up_between_two_fields_after_its_budget_and_fatal_errors_are_no_fields(self) -> None:
        ticks = iter([0.0, 0.0, chief.REQUEST_BUDGET_S + 1])
        with self.assertRaises(TimeBudgetExceeded):
            chief.answer_chief(DISTORTION, CASE, steps=stand_in_steps([]), clock=lambda: next(ticks))
        for fatal in (BuildMismatch("a read-back"), MemoryError(), ImportError("numba")):
            failing = dataclasses.replace(stand_in_steps([]), landing=mock.Mock(side_effect=fatal))
            with self.subTest(fatal=type(fatal).__name__), self.assertRaises(type(fatal)):
                chief.answer_chief(DISTORTION, CASE, steps=failing)

    def test_the_port_holds_an_answer_to_the_invariants_of_the_quantity(self) -> None:
        base = chief.answer_chief(PUPIL_SPEC, CASE, steps=stand_in_steps([]))
        both = copy.deepcopy(base)
        both["fields"][0]["figures"] = {**chief.NO_FIGURES, "entrancePupilZ": 8.0, "exitPupilZ": 42.0}
        self.assertEqual([issue.path for issue in validate_chief_native("data", both)], ["/fields/0"])
        twice = {**LATERAL, "lines": [0, 0]}
        self.assertEqual([issue.path for issue in validate_chief_native("spec", twice)], ["/lines"])
        axis = {**PUPIL_SPEC, "fieldAnglesDeg": [0.0, 10.0]}
        self.assertEqual([issue.path for issue in validate_chief_native("spec", axis)], ["/fieldAnglesDeg/0"])

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        request = chief_request(DOUBLE_GAUSS, DISTORTION)
        self.assertIn("chief.native", engine.describe()["capabilities"]["quantities"])
        with mock.patch("lvrtc_optiland.engine.answer_chief", side_effect=BuildMismatch("read-back fault")):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["error"]["code"]), ("error", "build-mismatch"))
        with mock.patch("lvrtc_optiland.engine.answer_chief", side_effect=TimeBudgetExceeded("too long")):
            self.assertEqual(engine.run(request, DOUBLE_GAUSS)["error"]["code"], "time-budget")
        stand_in = chief.answer_chief(DISTORTION, DOUBLE_GAUSS, steps=stand_in_steps([]))
        with mock.patch("lvrtc_optiland.engine.answer_chief", return_value=stand_in):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["diagnostics"]["counts"], {"surfaces": 11, "fields": 3, "ok": 2, "unavailable": 1})
        bad = {**request, "spec": {**DISTORTION, "lines": [0, 1]}}
        self.assertEqual(engine.run(bad, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        finite = copy.deepcopy(DOUBLE_GAUSS)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        result = engine.run(request, finite)
        self.assertEqual((result["status"], result["unsupported"][0]["item"]), ("unsupported", "object.finite"))

    def test_distortion_and_pupils_of_a_case_whose_first_order_data_optiland_does_not_see_are_refused(self) -> None:
        # Distortion is asked under optiland's paraxial aiming and pupils state its paraxial pupils: a term of power 1
        # or 2 is refused as for paraxial.first-order, from the case alone. Lateral colour, of robust-aimed chief rays,
        # is not.
        def items(case: dict[str, Any], spec: dict[str, Any]) -> list[str]:
            return [item["item"] for item in refusals(chief_request(case, spec), case)]

        for spec in (DISTORTION, PUPIL_SPEC):
            self.assertEqual(items(CURVED, spec), [QUADRATIC_SAG_TERM])
            self.assertEqual(items(CONE, spec), [LINEAR_SAG_TERM])
        self.assertEqual(items(CURVED, {**LATERAL, "lines": [0]}), [])
        self.assertEqual(items(CASE, DISTORTION), [])
        engine = OptilandEngine(IDENTITY)
        with mock.patch("lvrtc_optiland.engine.answer_chief", side_effect=AssertionError("an optic was built")):
            result = engine.run(chief_request(CURVED, PUPIL_SPEC), CURVED)
        self.assertEqual([each["item"] for each in result["unsupported"]], [QUADRATIC_SAG_TERM])


def vertex_landing(angle_deg: float, index: float) -> float:
    """Where the chief ray of the sphere that is its own stop lands, in the contract frame: through the vertex,
    refracted to asin(sin(theta) / n), 90 mm on in the glass, below the axis for an object above it."""
    refracted = math.asin(math.sin(math.radians(angle_deg)) / index)
    return -90.0 * math.tan(refracted)


def stop_centre_chief(
    angle_deg: float, index: float, radius: float = 30.0, stop_z: float = 10.0
) -> tuple[float, float]:
    """The real chief ray of ``PUPILS`` at a field, found by bisection of its own exact refraction at the sphere: the
    height ``h`` at which a ray of direction (0, -sin, cos) meets the sphere and, refracted, crosses the stop's centre;
    and where that ray's line in front of the sphere crosses the axis, the real entrance pupil."""
    theta = math.radians(angle_deg)
    incoming = (-math.sin(theta), math.cos(theta))

    def at_stop(h: float) -> float:
        z = radius - math.sqrt(radius * radius - h * h)
        # The unit normal of the sphere at (h, z), toward its centre (0, radius), and Snell's law in vector form.
        normal = (-h / radius, (radius - z) / radius)
        cosine = incoming[0] * normal[0] + incoming[1] * normal[1]
        ratio = 1.0 / index
        root = math.sqrt(1 - ratio * ratio * (1 - cosine * cosine))
        out = tuple(ratio * incoming[k] + (root - ratio * cosine) * normal[k] for k in range(2))
        return h + (stop_z - z) * out[0] / out[1]

    lo, hi = 0.0, 6.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if (at_stop(lo) < 0) == (at_stop(mid) < 0):
            lo = mid
        else:
            hi = mid
    h = (lo + hi) / 2
    z = radius - math.sqrt(radius * radius - h * h)
    return h, z - h * incoming[1] / incoming[0]


@unittest.skipIf(MISSING, MISSING or "")
class RealChiefTest(unittest.TestCase):
    """optiland's own distortion and chief rays on refracting spheres, held to their closed forms."""

    def answer(self, spec: dict[str, Any], case: dict[str, Any] = CASE) -> dict[str, Any]:
        data = chief.answer_chief(spec, case)
        self.assertIsInstance(data, dict)
        assert isinstance(data, dict)
        self.assertEqual(validate_chief_native("data", data), [], data)
        return data

    def test_the_distortion_of_a_sphere_that_is_its_own_stop_is_its_closed_form(self) -> None:
        data = self.answer(DISTORTION)
        index = INDICES[0]
        # The paraxial scale: a chief ray of slope u leaves the vertex at u / n and lands 90 u / n mm off the axis.
        self.assertAlmostEqual(data["reference"]["focalScaleMm"], 90.0 / index, delta=1e-9)
        self.assertEqual(data["reference"]["probeAngleDeg"], chief.NEAR_AXIS * 20.0)
        for asked, field in zip(DISTORTION["fieldAnglesDeg"], data["fields"], strict=True):
            self.assertEqual(field["status"], "ok")
            angle = field["fieldAngleDeg"]
            self.assertEqual(angle, asked, "the field is stated at the angle asked")
            real = vertex_landing(angle, index)
            ideal = -(90.0 / index) * math.tan(math.radians(angle))
            figures = field["figures"]
            self.assertAlmostEqual(figures["realHeightMm"], real, delta=1e-11)
            self.assertAlmostEqual(figures["idealHeightMm"], ideal, delta=1e-9)
            self.assertAlmostEqual(figures["percent"], 100 * (real - ideal) / ideal, delta=1e-8)
            # Through the vertex, the paraxial chief ray is the real one: the robust landing is the same, and the
            # model's own landing too, the axis's chief ray landing on the axis.
            self.assertAlmostEqual(field["chiefLandingMm"], real, delta=1e-11)
            self.assertAlmostEqual(field["sampling"]["distortionLandingMm"], real, delta=1e-11)
            self.assertAlmostEqual(field["sampling"]["focalScaleMm"], 90.0 / index, delta=1e-9)
        self.assertLess(data["fields"][-1]["figures"]["percent"], -1.0, "a sphere at its own stop is a barrel")

    def test_optilands_robust_aimer_launches_the_near_axis_probe_along_the_axis_and_gives_no_scale(self) -> None:
        # Pinned (docs/gotchas.md): under the robust aiming of the worker's other analyses, the chief ray at 1e-10 of
        # the half field is launched along the axis and lands on it, and the model's scale is 0. Under optiland's
        # default aiming, the worker's, it is the paraxial scale.
        from lvrtc_optiland.build import optiland_api  # noqa: PLC0415

        api = optiland_api()
        np = api.np
        robust = chief.field_optic(CASE, 0, 20.0)
        self.assertEqual(str(robust.ray_tracer.ray_aiming_config["mode"]), "robust")
        model = chief.distortion_model()
        model.compute(robust, np.array([0.0]), np.array([0.5]), float(robust.primary_wavelength))
        self.assertEqual(float(model._scale), 0.0)
        default = chief.distortion_optic(CASE, 0, 20.0)
        model = chief.distortion_model()
        model.compute(default, np.array([0.0]), np.array([0.5]), float(default.primary_wavelength))
        self.assertAlmostEqual(float(model._scale), 90.0 / INDICES[0], delta=1e-9)

    def test_each_setting_of_the_distortion_model_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from optiland.analysis.distortion_strategies import (  # noqa: PLC0415
            ChiefRayReferencePoint,
            RotationalDistortionModel,
            create_distortion_model,
        )

        class AnotherModel(RotationalDistortionModel):
            pass

        class AnotherPoint(ChiefRayReferencePoint):
            pass

        def after_fit(change: Callable[[Any, Any], None]) -> Callable[[], Any]:
            def made() -> Any:
                model = chief.distortion_model()
                fit = model.fit

                def changed(optic: Any, wavelength: float) -> None:
                    fit(optic, wavelength)
                    change(model, optic)

                model.fit = changed
                return model

            return made

        def near_axis() -> Any:
            model = chief.distortion_model()
            model._NEAR_AXIS = 1e-8
            return model

        def two_values() -> Any:
            model = chief.distortion_model()
            evaluate = model.evaluate

            def twice(optic: Any, Hx: Any, Hy: Any, wavelength: float) -> Any:
                return evaluate(optic, np.concatenate([Hx, Hx]), np.concatenate([Hy, Hy]), wavelength)

            model.evaluate = twice
            return model

        from lvrtc_optiland.build import optiland_api  # noqa: PLC0415

        np = optiland_api().np
        faults: dict[str, tuple[Callable[[], Any], str]] = {
            "class": (lambda: AnotherModel(), "the class of the distortion model"),
            "distortion type": (lambda: create_distortion_model("paraxial", distortion_type="f-theta"), "type"),
            "reference point": (lambda: RotationalDistortionModel(reference_point=AnotherPoint()), "reference point"),
            "near-axis probe": (near_axis, "near-axis probe"),
            "half field": (
                after_fit(lambda model, optic: setattr(model, "_max_field_rad", model._max_field_rad * (1 + 2**-52))),
                "half field the model normalised by",
            ),
            "aiming": (after_fit(lambda model, optic: optic.ray_tracer.set_aiming("robust")), "aiming of the model"),
            "values": (two_values, "the values the model gave"),
        }
        for name, (model_of, said) in faults.items():
            with self.subTest(fault=name), self.assertRaisesRegex(BuildMismatch, said):
                chief.distortion_step(CASE, 0, 20.0, 10.0, model_of=model_of)
        # A scale of 0 is no scale, and the field's reason.
        with self.assertRaisesRegex(ValueError, "^no-scale$"):
            zero = after_fit(lambda model, optic: setattr(model, "_scale", 0.0 * model._scale))
            chief.distortion_step(CASE, 0, 20.0, 10.0, model_of=zero)
        # Unchanged, it passes.
        figures = chief.distortion_step(CASE, 0, 20.0, 10.0)
        self.assertAlmostEqual(figures.real_mm, vertex_landing(10.0, INDICES[0]), delta=1e-11)

    def test_each_setting_of_the_distortion_optic_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from optiland.fields.field_group import FieldGroup  # noqa: PLC0415

        from lvrtc_optiland.build import build_optic  # noqa: PLC0415

        def changed(change: Callable[[Any, Any], None]) -> Callable[..., Any]:
            """The builder's optic, changed once the worker has added its field."""

            def build(case: dict[str, Any], line: int, api: Any = None) -> Any:
                optic = build_optic(case, line, api)
                add = optic.fields.add

                def added(*args: Any, **kwargs: Any) -> None:
                    add(*args, **kwargs)
                    change(optic, add)

                optic.fields.add = added
                return optic

            return build

        def field(optic: Any) -> Any:
            return optic.fields.fields[0]

        faults: dict[str, tuple[Callable[[Any, Any], None], str]] = {
            "fields": (lambda optic, add: add(y=3.0), "the number of fields"),
            "type": (lambda optic, add: optic.fields.set_type("object_height"), "the type of the field"),
            "angle y": (lambda optic, add: setattr(field(optic), "y", 19.0), "along y"),
            "angle x": (lambda optic, add: setattr(field(optic), "x", 1e-9), "along x"),
            "vignetting": (lambda optic, add: setattr(field(optic), "vy", 0.25), "the vignetting factors"),
            "weight": (lambda optic, add: setattr(field(optic), "weight", 0.5), "the weight"),
            "aiming": (lambda optic, add: optic.ray_tracer.set_aiming("robust"), "the ray aiming"),
        }
        for name, (change, said) in faults.items():
            with (
                self.subTest(fault=name),
                mock.patch.object(chief, "build_optic", changed(change)),
                self.assertRaisesRegex(BuildMismatch, said),
            ):
                chief.distortion_optic(CASE, 0, 20.0)
        with (
            mock.patch.object(FieldGroup, "max_field", property(lambda group: 19.0)),
            self.assertRaisesRegex(BuildMismatch, "the half field the model normalises by"),
        ):
            chief.distortion_optic(CASE, 0, 20.0)

    def test_the_lateral_colour_of_the_sphere_is_each_lines_refraction_through_the_vertex(self) -> None:
        data = self.answer(LATERAL)
        self.assertEqual([field["status"] for field in data["fields"]], ["ok"] * 6)
        for field in data["fields"]:
            expected = vertex_landing(field["fieldAngleDeg"], INDICES[field["line"]])
            self.assertAlmostEqual(field["chiefLandingMm"], expected, delta=1e-11)

    def test_the_pupils_of_a_sphere_with_its_stop_behind_it_are_the_exact_chief_rays_and_the_paraxial_images(
        self,
    ) -> None:
        data = self.answer(PUPIL_SPEC, PUPILS)
        # The paraxial entrance pupil: a ray from the stop's centre at the slope u in the glass meets the vertex plane
        # at -10 u and leaves into air at u (n - 10 (n - 1) / R) / 1: it crosses the axis 10 / (n - 10 (n - 1) / 30)
        # mm behind the vertex, 7.5 at n = 3/2. The stop is the last surface: the exit pupil is the stop.
        self.assertAlmostEqual(data["reference"]["paraxialEntrancePupilZ"], 10 / (1.5 - 10 * 0.5 / 30), delta=1e-10)
        self.assertAlmostEqual(data["reference"]["paraxialExitPupilZ"], 10.0, delta=1e-10)
        for field in data["fields"]:
            self.assertEqual(field["status"], "ok")
            ray = field["chiefRay"]
            h, entrance = stop_centre_chief(field["fieldAngleDeg"], 1.5)
            # Where the real chief ray meets the sphere, coming from above the axis; it crosses the stop at its centre.
            self.assertAlmostEqual(ray["entryPoint"][1], h, delta=1e-8)
            self.assertGreater(ray["entryPoint"][1], 0.0)
            theta = math.radians(field["fieldAngleDeg"])
            for got, want in zip(ray["entryDirection"], (0.0, -math.sin(theta), math.cos(theta)), strict=True):
                self.assertAlmostEqual(got, want, delta=1e-12)
            self.assertAlmostEqual(ray["exitPoint"][1], 0.0, delta=1e-8)
            self.assertAlmostEqual(ray["exitPoint"][2], 10.0, delta=1e-12)
            # The line of the entry crosses the axis at the real entrance pupil, which aberration moves off the
            # paraxial one.
            y, z = ray["entryPoint"][1], ray["entryPoint"][2]
            m, n = ray["entryDirection"][1], ray["entryDirection"][2]
            self.assertAlmostEqual(z - y * n / m, entrance, delta=1e-6)
            self.assertGreater(abs(entrance - data["reference"]["paraxialEntrancePupilZ"]), 1e-3, "pupil aberration")
            # Behind the stop, in the glass, the chief ray goes on to land below the axis, as the frame says.
            self.assertLess(field["chiefLandingMm"], 0.0)

    def test_each_setting_of_the_chief_ray_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        real_optic = chief.field_optic

        def paraxial(case: dict[str, Any], line: int, angle: float, api: Any = None, tools: Any = None) -> Any:
            optic = real_optic(case, line, angle, api, tools)
            optic.ray_tracer.set_aiming("paraxial")
            return optic

        def elsewhere(case: dict[str, Any], line: int, angle: float, api: Any = None, tools: Any = None) -> Any:
            shifted = copy.deepcopy(case)
            shifted["conditions"]["imageZ"] = 91.0
            return real_optic(shifted, line, angle, api, tools)

        def tilted(case: dict[str, Any], line: int, angle: float, api: Any = None, tools: Any = None) -> Any:
            optic = real_optic(case, line, angle, api, tools)
            generator = optic.ray_tracer.ray_generator
            generate = generator.generate_rays

            def turned(*args: Any, **kwargs: Any) -> Any:
                rays = generate(*args, **kwargs)
                rays.M = rays.M * (1 + 1e-9)
                return rays

            generator.generate_rays = turned
            return optic

        # An optic of one surface more than the case: its trace has a row more.
        extra = make_case(
            [surface(0, sphere(30), semi=6.0), surface(10, PLANE, semi=4.0), surface(50, PLANE, semi=10.0)],
            stop=1,
            indices=[[1.5, 1.5, 1.5], [1.52, 1.52, 1.52]],
            lines=(587.5618, 486.1327),
            image_z=90.0,
            stop_radius=4.0,
        )

        def another(case: dict[str, Any], line: int, angle: float, api: Any = None, tools: Any = None) -> Any:
            return real_optic(extra, line, angle, api, tools)

        for name, optic_of, said in (
            ("aimer", paraxial, "the aimer that launched the chief ray"),
            ("rows", another, "the rows of the chief ray's trace"),
            ("image plane", elsewhere, "lands at z"),
            ("launch", tilted, "it is launched along"),
        ):
            with (
                self.subTest(fault=name),
                mock.patch.object(chief, "field_optic", optic_of),
                self.assertRaisesRegex(BuildMismatch, said),
            ):
                chief.chief_ray_step(PUPILS, 0, 10.0)
        # Unchanged, it passes.
        self.assertAlmostEqual(chief.chief_ray_step(PUPILS, 0, 10.0).exit_point[1], 0.0, delta=1e-8)

    def test_the_double_gauss_answers_every_kind(self) -> None:
        for spec in (
            {**DISTORTION, "maxFieldDeg": 14.0, "fieldAnglesDeg": [7.0, 14.0]},
            {**LATERAL, "lines": [0], "maxFieldDeg": 14.0, "fieldAnglesDeg": [0.0, 14.0]},
            {**PUPIL_SPEC, "maxFieldDeg": 14.0, "fieldAnglesDeg": [7.0, 14.0]},
        ):
            data = self.answer(spec, DOUBLE_GAUSS)
            self.assertTrue(all(field["status"] == "ok" for field in data["fields"]), data["notes"])


if __name__ == "__main__":
    unittest.main()
