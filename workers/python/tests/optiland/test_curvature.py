"""``curvature.native`` of the worker: optiland's own field curves, one field and one line at a time.

The first half needs no optiland: the request is read, an answer is written from stand-in steps and is valid by the
contract's port, and the engine dispatches it. The second half is the real optiland and is skipped, with the reason,
under an interpreter that has none. Its expected values are derived here, in closed form: a refracting sphere that is
its own stop passes every chief ray through its vertex, refracted to ``asin(sin(theta) / n)``, and the foci of the
infinitesimal pencils about it are Coddington's, ``n' cos^2(theta') / t' = (n' cos(theta') - cos(theta)) / R`` for the
tangential one and ``n' / s' = (n' cos(theta') - cos(theta)) / R`` for the sagittal one, along the chief ray from the
vertex; the image plane is the paraxial focus, ``n R / (n - 1)``. Every setting the worker reads back is held to it with
the mistake made on purpose.
"""

from __future__ import annotations

import copy
import dataclasses
import math
import unittest
from collections.abc import Callable
from typing import Any
from unittest import mock

from lvrtc_optiland import curvature
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine, refusals
from lvrtc_optiland.mtf import TimeBudgetExceeded
from lvrtc_worker_kit.validate import validate_curvature_native

from .support import make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_mtf import IDENTITY

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")

# One sphere of radius 30 into glass, its own stop of radius 4, the image 90 mm behind it in the glass, the paraxial
# focus at the first line; at the second line the glass is of a higher index. Every chief ray passes through the vertex.
INDICES = (1.5, 1.52)
RADIUS = 30.0
IMAGE_Z = 90.0
CASE = make_case(
    [surface(0, sphere(RADIUS), semi=4.0)],
    indices=[[INDICES[0]], [INDICES[1]]],
    lines=(587.5618, 486.1327),
    image_z=IMAGE_Z,
    stop_radius=4.0,
)

SPEC = {"lines": [0, 1], "maxFieldDeg": 20.0, "fieldAnglesDeg": [0.0, 10.0, 20.0]}


def curvature_request(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    return {"contract": "1.0", "id": "d" * 64, "caseId": case["id"], "quantity": "curvature.native", "spec": spec}


class RequestTest(unittest.TestCase):
    def test_what_the_engine_does_not_answer_is_said_before_anything_is_built(self) -> None:
        def items(spec: dict[str, Any], case: dict[str, Any] = CASE) -> list[str]:
            asked = curvature.read_request(spec, case)
            return [item["item"] for item in asked] if isinstance(asked, list) else []

        self.assertEqual(items(SPEC), [])
        self.assertEqual(items({**SPEC, "lines": [0, 7]}), ["line"])
        finite = copy.deepcopy(CASE)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        self.assertEqual(items(SPEC, finite), ["object.finite"])
        asked = curvature.read_request(SPEC, CASE)
        self.assertIsInstance(asked, curvature.CurvatureRequest)
        self.assertEqual((asked.lines, asked.max_field_deg, asked.angles), ((0, 1), 20.0, (0.0, 10.0, 20.0)))


def stand_in_steps(calls: list[Any]) -> curvature.Steps:
    """Steps in optiland's frame, every call noted: a landing at the angle over two (optiland's y), foci of the angle
    over 512 and minus the angle over 1024. At the second line the 20 degree field has no landing, and at the first its
    foci are no numbers."""

    def landing(case: dict[str, Any], line: int, angle: float) -> tuple[float, float] | None:
        calls.append(("landing", line, angle))
        if angle == 20.0 and line == 1:
            return None
        return (0.0, angle / 2)

    def foci(case: dict[str, Any], line: int, angle: float) -> curvature.FieldFoci:
        calls.append(("curvature", line, angle))
        if angle == 20.0:
            raise ValueError(curvature.REASONS["focus"])
        return curvature.FieldFoci(tangential_mm=angle / 512, sagittal_mm=-angle / 1024)

    return curvature.Steps(landing=landing, curvature=foci)


class AnswerTest(unittest.TestCase):
    def test_each_line_and_field_states_optilands_foci_and_its_landing_mirrored(self) -> None:
        calls: list[Any] = []
        data = curvature.answer_curvature(SPEC, CASE, steps=stand_in_steps(calls))
        self.assertEqual(validate_curvature_native("data", data), [])
        # The identifying landing first, then the field curves, field by field and line by line.
        first = [("landing", 0, 0.0), ("curvature", 0, 0.0), ("landing", 0, 10.0), ("curvature", 0, 10.0)]
        self.assertEqual(calls[:4], first)
        self.assertEqual([field["line"] for field in data["fields"]], [0, 0, 0, 1, 1, 1])
        self.assertEqual([field["wavelengthNm"] for field in data["fields"]], [587.5618] * 3 + [486.1327] * 3)
        second = data["fields"][1]
        self.assertEqual(
            (second["chiefLandingMm"], second["tangentialShiftMm"], second["sagittalShiftMm"]),
            (-5.0, 10.0 / 512, -10.0 / 1024),
        )
        self.assertEqual([field["status"] for field in data["fields"]], ["ok", "ok", "unavailable"] * 2)
        self.assertEqual((data["fields"][2]["reason"], data["fields"][5]["reason"]), ("no-focus", "no-chief-landing"))
        # Where the identifying chief ray landed is still said of a field without foci.
        self.assertEqual(data["fields"][2]["chiefLandingMm"], -10.0)
        self.assertEqual(data["method"]["name"], curvature.METHOD)
        self.assertEqual(data["method"]["params"]["parabasalDelta"], 1e-5)
        self.assertEqual(data["method"]["params"]["aiming"], "robust")
        self.assertEqual(curvature.field_counts(data), {"fields": 6, "ok": 4, "unavailable": 2})

    def test_a_lost_parabasal_ray_is_its_own_reason_and_any_other_error_is_optilands_by_its_class(self) -> None:
        def lost(case: dict[str, Any], line: int, angle: float) -> curvature.FieldFoci:
            raise ValueError(curvature.REASONS["lost"])

        steps = dataclasses.replace(stand_in_steps([]), curvature=lost)
        data = curvature.answer_curvature(SPEC, CASE, steps=steps)
        self.assertEqual({field.get("reason") for field in data["fields"][:3]}, {"parabasal-ray-lost"})
        other = dataclasses.replace(steps, curvature=mock.Mock(side_effect=ValueError("another")))
        data = curvature.answer_curvature(SPEC, CASE, steps=other)
        self.assertEqual(data["fields"][0]["reason"], "optiland-raised-ValueError")

    def test_a_request_is_given_up_between_two_fields_after_its_budget_and_fatal_errors_are_no_fields(self) -> None:
        ticks = iter([0.0, 0.0, curvature.REQUEST_BUDGET_S + 1])
        with self.assertRaises(TimeBudgetExceeded):
            curvature.answer_curvature(SPEC, CASE, steps=stand_in_steps([]), clock=lambda: next(ticks))
        for fatal in (BuildMismatch("a read-back"), MemoryError(), ImportError("numba")):
            failing = dataclasses.replace(stand_in_steps([]), curvature=mock.Mock(side_effect=fatal))
            with self.subTest(fatal=type(fatal).__name__), self.assertRaises(type(fatal)):
                curvature.answer_curvature(SPEC, CASE, steps=failing)

    def test_the_port_holds_an_answer_to_the_invariants_of_the_quantity(self) -> None:
        base = curvature.answer_curvature(SPEC, CASE, steps=stand_in_steps([]))
        half = copy.deepcopy(base)
        half["fields"][0]["sagittalShiftMm"] = None
        self.assertEqual([issue.path for issue in validate_curvature_native("data", half)], ["/fields/0"])
        focused = copy.deepcopy(base)
        focused["fields"][2]["tangentialShiftMm"] = 0.5
        self.assertEqual([issue.path for issue in validate_curvature_native("data", focused)], ["/fields/2"])
        twice = {**SPEC, "lines": [0, 0]}
        self.assertEqual([issue.path for issue in validate_curvature_native("spec", twice)], ["/lines"])
        beyond = {**SPEC, "fieldAnglesDeg": [0.0, 25.0]}
        self.assertEqual([issue.path for issue in validate_curvature_native("spec", beyond)], ["/fieldAnglesDeg/1"])

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        spec = {"lines": [0], "maxFieldDeg": 14.0, "fieldAnglesDeg": [0.0, 7.0, 14.0]}
        request = curvature_request(DOUBLE_GAUSS, spec)
        self.assertIn("curvature.native", engine.describe()["capabilities"]["quantities"])
        with mock.patch("lvrtc_optiland.engine.answer_curvature", side_effect=BuildMismatch("read-back fault")):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["error"]["code"]), ("error", "build-mismatch"))
        with mock.patch("lvrtc_optiland.engine.answer_curvature", side_effect=TimeBudgetExceeded("too long")):
            self.assertEqual(engine.run(request, DOUBLE_GAUSS)["error"]["code"], "time-budget")
        two = {**spec, "fieldAnglesDeg": [0.0, 20.0]}
        stand_in = curvature.answer_curvature(two, DOUBLE_GAUSS, steps=stand_in_steps([]))
        with mock.patch("lvrtc_optiland.engine.answer_curvature", return_value=stand_in):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["diagnostics"]["counts"], {"surfaces": 11, "fields": 2, "ok": 1, "unavailable": 1})
        bad = {**request, "spec": {**spec, "fieldAnglesDeg": [0.0, 20.0]}}
        self.assertEqual(engine.run(bad, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        finite = copy.deepcopy(DOUBLE_GAUSS)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        result = engine.run(request, finite)
        self.assertEqual((result["status"], result["unsupported"][0]["item"]), ("unsupported", "object.finite"))
        # Of robust-aimed real rays, it is not refused where optiland's paraxial model sees no term of a case.
        self.assertEqual(refusals(request, DOUBLE_GAUSS), [])


def coddington(angle_deg: float, index: float) -> tuple[float, float]:
    """The tangential and sagittal foci of the sphere that is its own stop, at a field, as z less the image plane's:
    Coddington's equations along the chief ray from the vertex, for an object at infinity, projected on the axis."""
    theta = math.radians(angle_deg)
    refracted = math.asin(math.sin(theta) / index)
    power = (index * math.cos(refracted) - math.cos(theta)) / RADIUS
    tangential = index * math.cos(refracted) ** 2 / power
    sagittal = index / power
    return tangential * math.cos(refracted) - IMAGE_Z, sagittal * math.cos(refracted) - IMAGE_Z


def vertex_landing(angle_deg: float, index: float) -> float:
    """Where the chief ray of the sphere that is its own stop lands, in the contract frame."""
    refracted = math.asin(math.sin(math.radians(angle_deg)) / index)
    return -IMAGE_Z * math.tan(refracted)


@unittest.skipIf(MISSING, MISSING or "")
class RealCurvatureTest(unittest.TestCase):
    """optiland's own field curves of a refracting sphere, held to Coddington's closed forms."""

    def answer(self, spec: dict[str, Any], case: dict[str, Any] = CASE) -> dict[str, Any]:
        data = curvature.answer_curvature(spec, case)
        self.assertIsInstance(data, dict)
        assert isinstance(data, dict)
        self.assertEqual(validate_curvature_native("data", data), [], data)
        return data

    def test_the_field_curves_of_a_sphere_that_is_its_own_stop_are_coddingtons(self) -> None:
        data = self.answer(SPEC)
        self.assertEqual([field["status"] for field in data["fields"]], ["ok"] * 6)
        for field in data["fields"]:
            index = INDICES[field["line"]]
            tangential, sagittal = coddington(field["fieldAngleDeg"], index)
            # A pair of rays 4e-5 mm apart at the stop: their crossing is the pencil's focus to well within 1e-6 mm.
            self.assertAlmostEqual(field["tangentialShiftMm"], tangential, delta=1e-6)
            self.assertAlmostEqual(field["sagittalShiftMm"], sagittal, delta=1e-6)
            self.assertAlmostEqual(field["chiefLandingMm"], vertex_landing(field["fieldAngleDeg"], index), delta=1e-11)
        # On the axis at the first line the plane is the paraxial focus; the field curves inward, the tangential more.
        axis, edge = data["fields"][0], data["fields"][2]
        self.assertAlmostEqual(axis["tangentialShiftMm"], 0.0, delta=1e-6)
        self.assertLess(edge["tangentialShiftMm"], edge["sagittalShiftMm"])
        self.assertLess(edge["sagittalShiftMm"], 0.0)

    def test_each_setting_of_the_analysis_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from optiland.analysis import FieldCurvature as Real  # noqa: PLC0415
        from optiland.physical_apertures import RadialAperture  # noqa: PLC0415

        def wider(method: str) -> Callable[[Any], Any]:
            """optiland's class under its own name, the pairs of one of its methods at another delta."""

            def widened(self: Any, wavelength: float, delta: float = 2e-5) -> Any:
                return getattr(Real, method)(self, wavelength, delta)

            made = type("FieldCurvature", (Real,), {method: widened})
            return lambda optic: made(optic, wavelengths="primary", num_points=2)

        class Another(Real):
            pass

        def then(change: Callable[[Any, Any], None], **asked: Any) -> Callable[[Any], Any]:
            def made(optic: Any) -> Any:
                analysis = Real(optic, **{"wavelengths": "primary", "num_points": 2, **asked})
                change(analysis, optic)
                return analysis

            return made

        def nan(analysis: Any, optic: Any) -> None:
            analysis.data[0][0][1] = float("nan")

        def stop_the_chief(analysis: Any, optic: Any) -> None:
            optic.surfaces[1].aperture = RadialAperture(r_max=4.0, r_min=1e-3)

        faults: dict[str, tuple[Callable[[Any], Any], type[Exception], str]] = {
            "class": (lambda optic: Another(optic, wavelengths="primary", num_points=2), BuildMismatch, "class"),
            "points": (then(lambda a, o: None, num_points=3), BuildMismatch, "the points of the field"),
            "wavelength": (then(lambda a, o: None, wavelengths=[0.5]), BuildMismatch, "the wavelengths"),
            "tangential delta": (wider(curvature.PAIR_METHODS[0]), BuildMismatch, "delta.*tangential"),
            "sagittal delta": (wider(curvature.PAIR_METHODS[1]), BuildMismatch, "delta.*sagittal"),
            "values": (then(lambda a, o: setattr(a, "data", [a.data[0], a.data[0]])), BuildMismatch, "the values"),
            "aiming": (then(lambda a, o: o.ray_tracer.set_aiming("paraxial")), BuildMismatch, "the ray aiming"),
            "field": (then(lambda a, o: o.fields.add(y=3.0)), BuildMismatch, "the number of fields"),
            "no focus": (then(nan), ValueError, "^no-focus$"),
            "lost ray": (then(stop_the_chief), ValueError, "^parabasal-ray-lost$"),
        }
        for name, (analysis_of, error, said) in faults.items():
            with self.subTest(fault=name), self.assertRaisesRegex(error, said):
                curvature.curvature_step(CASE, 0, 10.0, analysis_of=analysis_of)
        # Unchanged, it passes.
        foci = curvature.curvature_step(CASE, 0, 10.0)
        self.assertAlmostEqual(foci.tangential_mm, coddington(10.0, INDICES[0])[0], delta=1e-6)

    def test_the_rays_traced_again_are_the_analysiss_own_bit_for_bit(self) -> None:
        import numpy as np  # noqa: PLC0415

        traced: list[tuple[Any, ...]] = []

        def recorded(optic: Any) -> Any:
            # Every trace of the optic noted, the analysis's and the worker's: the batch and the rows it left.
            original = optic.trace_generic

            def trace(*args: Any, **kwargs: Any) -> Any:
                result = original(*args, **kwargs)
                surfaces = optic.surfaces
                rows = [np.array(getattr(surfaces, name), dtype=np.float64) for name in ("x", "y", "z", "L", "M", "N")]
                rows.append(np.array(surfaces.intensity, dtype=np.float64))
                batch = [np.array(np.broadcast_to(value, (4,)), dtype=np.float64) for value in args[:4]]
                traced.append((batch, rows))
                return result

            optic.trace_generic = trace
            return Real(optic, wavelengths="primary", num_points=2)

        from optiland.analysis import FieldCurvature as Real  # noqa: PLC0415

        for case, angle in ((CASE, 20.0), (DOUBLE_GAUSS, 14.0)):
            traced.clear()
            with self.subTest(angle=angle):
                curvature.curvature_step(case, 0, angle, analysis_of=recorded)
                # The analysis's two batches, then the worker's two, each of the same rays and to the same rows.
                self.assertEqual(len(traced), 4)
                for (asked, rows), (again, rows_again) in zip(traced[:2], traced[2:], strict=True):
                    for one, other in zip(asked + rows, again + rows_again, strict=True):
                        self.assertTrue(np.array_equal(one, other, equal_nan=True))

    def test_the_double_gauss_answers_every_field(self) -> None:
        data = self.answer({"lines": [0], "maxFieldDeg": 14.0, "fieldAnglesDeg": [0.0, 7.0, 14.0]}, DOUBLE_GAUSS)
        self.assertTrue(all(field["status"] == "ok" for field in data["fields"]), data["notes"])
        axis = data["fields"][0]
        self.assertAlmostEqual(axis["tangentialShiftMm"], axis["sagittalShiftMm"], delta=1e-9, msg="one pencil")


if __name__ == "__main__":
    unittest.main()
