"""``spot.native`` of the worker: optiland's SpotDiagram and RayFan, a line and a field at a time.

The first half needs no optiland: the request is read, a field gets its status from stand-in steps, the answer is
valid by the contract's port, and the engine dispatches it. The second half is the real optiland and is skipped,
with the reason, under an interpreter that has none. Its expected values are derived here, by the 60-digit trace of
``exact.py`` of the rays optiland's pupil coordinates stand for, never read from an engine's output; and every
setting the worker reads back is held to it with the mistake made on purpose.
"""

from __future__ import annotations

import copy
import math
import unittest
from decimal import Decimal
from typing import Any
from unittest import mock

from lvrtc_optiland import spot
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine
from lvrtc_optiland.mtf import REQUEST_BUDGET_S, TimeBudgetExceeded, field_coordinate, field_optic
from lvrtc_worker_kit.ndarray import decode_ndarray
from lvrtc_worker_kit.validate import validate_spot_native

from .exact import exact_trace
from .support import make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_mtf import IDENTITY

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")

RINGS = {"kind": "rings", "rings": [1, 8, 16, 24, 32, 40], "weighting": "area"}
FAN = {"kind": "fan", "axis": "tangential", "samples": 11}


def spec_of(pupil: dict[str, Any], values: list[float], kind: str = "angles-deg") -> dict[str, Any]:
    return {"line": 0, "fields": {"kind": kind, "values": values}, "pupil": pupil}


def figures(centroid: tuple[float, float] = (0.0, 0.5), rms: float = 0.25) -> spot.SpotFigures:
    return spot.SpotFigures(centroid_mm=centroid, rms_radius_mm=rms, launched=127, landed=120)


def fan_figures() -> spot.FanFigures:
    return spot.FanFigures(pupil=(-1.0, 0.0, 1.0), error_mm=(-0.25, 0.0, math.nan), landed=2)


class RequestTest(unittest.TestCase):
    def test_hexapolar_rings_are_the_nearest_count_of_rays(self) -> None:
        # 1 + 3k(k + 1): 7, 19, 37, 61, 91, 127, ... ; LensVisualizer's coma pattern is 121 rays, its bokeh 337.
        self.assertEqual([spot.hexapolar_count(k) for k in range(1, 7)], [7, 19, 37, 61, 91, 127])
        self.assertEqual(spot.hexapolar_rings([1, 8, 16, 24, 32, 40]), 6)
        self.assertEqual(spot.hexapolar_rings([1, 12, 24, 36, 48, 60, 72, 84]), 10)
        # A tie goes to the smaller number of rings: 13 lies 6 from 7 and from 19.
        self.assertEqual(spot.hexapolar_rings([13]), 1)

    def test_what_the_engine_does_not_answer_is_said_before_anything_is_built(self) -> None:
        def items(spec: dict[str, Any], options: dict[str, Any], case: dict[str, Any] = DOUBLE_GAUSS) -> list[str]:
            asked = spot.read_request(spec, options, case)
            return [item["item"] for item in asked] if isinstance(asked, list) else []

        self.assertEqual(items(spec_of(RINGS, [0, 10]), {}), [])
        self.assertEqual(items({**spec_of(RINGS, [0]), "line": 3}, {}), ["line"])
        fractions = spec_of(RINGS, [0, 0.5], "half-field-fractions")
        self.assertEqual(items(fractions, {}), ["fields.half-field-fractions"])
        self.assertEqual(items(fractions, {"fieldAnglesDeg": [0]}), ["option.fieldAnglesDeg"])
        self.assertEqual(items(fractions, {"fieldAnglesDeg": [0, True]}), ["option.fieldAnglesDeg"])
        self.assertEqual(items(fractions, {"fieldAnglesDeg": [0, 7.5]}), [])
        finite = copy.deepcopy(DOUBLE_GAUSS)
        finite["conditions"]["object"] = {"kind": "finite", "z": -500.0}
        self.assertEqual(items(spec_of(FAN, [5]), {}, finite), ["object.finite"])
        asked = spot.read_request(fractions, {"fieldAnglesDeg": [0, 7.5]}, DOUBLE_GAUSS)
        self.assertEqual((asked.angles, asked.fractions, asked.rings), ((0.0, 7.5), (0.0, 0.5), 6))
        asked = spot.read_request(spec_of(FAN, [5]), {}, DOUBLE_GAUSS)
        self.assertEqual((asked.pattern, asked.axis, asked.samples), ("fan", "tangential", 11))


class AnswerTest(unittest.TestCase):
    def steps(self, **more: Any) -> dict[str, Any]:
        stand_in = {
            "chief": lambda case, line, angle: (0.0, -2.0 * angle),
            "spot": lambda case, line, angle, rings, chief: figures(),
            "fan": lambda case, line, angle, axis, samples: fan_figures(),
        }
        stand_in.update(more)
        return stand_in

    def test_a_spot_and_a_fan_are_written_as_the_contract_states_them(self) -> None:
        asked = spec_of(RINGS, [0.0, 0.5], "half-field-fractions")
        data = spot.answer_spot(asked, {"fieldAnglesDeg": [0.0, 10.0]}, DOUBLE_GAUSS, steps=self.steps())
        self.assertEqual(validate_spot_native("data", data), [])
        self.assertEqual([field["field"] for field in data["fields"]], [0.0, 0.5])
        self.assertEqual([field["fieldAngleDeg"] for field in data["fields"]], [0.0, 10.0])
        self.assertEqual([field["imageHeightMm"] for field in data["fields"]], [0.0, 20.0])
        self.assertEqual(data["fields"][1]["spot"], {"centroidMm": [0.0, 0.5], "rmsRadiusMm": 0.25})
        self.assertEqual(data["method"]["params"]["numRings"], 6)
        self.assertEqual(data["lines"], [{"wavelengthNm": 587.5618, "weight": 1}])
        fan = spot.answer_spot(spec_of(FAN, [10.0]), {}, DOUBLE_GAUSS, steps=self.steps())
        self.assertEqual(validate_spot_native("data", fan), [])
        held = fan["fields"][0]["fan"]
        self.assertEqual(decode_ndarray(held["pupil"]).values(), [-1.0, 0.0, 1.0])
        self.assertTrue(math.isnan(decode_ndarray(held["errorMm"]).values()[2]))
        self.assertEqual(fan["method"]["params"]["distribution"], "line_y")

    def test_a_field_optiland_cannot_compute_is_a_row_and_the_others_survive(self) -> None:
        def chief(case: dict[str, Any], line: int, angle: float) -> tuple[float, float] | None:
            return None if angle == 5.0 else (0.0, 1.0)

        def failing_spot(case: dict[str, Any], line: int, angle: float, rings: int, landing: Any) -> Any:
            if angle == 10.0:
                raise ValueError("optiland could not")
            if angle == 12.0:
                raise ValueError(spot.REASONS["rays"])
            return figures()

        asked = spec_of(RINGS, [0.0, 5.0, 10.0, 12.0])
        data = spot.answer_spot(asked, {}, DOUBLE_GAUSS, steps=self.steps(chief=chief, spot=failing_spot))
        self.assertEqual(validate_spot_native("data", data), [])
        self.assertEqual(
            [(field["status"], field.get("reason")) for field in data["fields"]],
            [
                ("ok", None),
                ("unavailable", "no-chief-landing"),
                ("unavailable", "optiland-raised-ValueError"),
                ("unavailable", "no-rays"),
            ],
        )
        # Where the chief ray landed is still said of a field whose spot optiland could not compute.
        self.assertEqual(data["fields"][2]["imageHeightMm"], 1.0)

        def lost(*args: Any) -> Any:
            raise spot.FanCentreLost(spot.REASONS["centre"])

        fan = spot.answer_spot(spec_of(FAN, [10.0]), {}, DOUBLE_GAUSS, steps=self.steps(fan=lost))
        self.assertEqual(fan["fields"][0]["reason"], "fan-centre-lost")
        for error in (BuildMismatch("fault"), MemoryError("memory"), ImportError("install")):
            with self.subTest(error=type(error).__name__), self.assertRaises(type(error)):
                spot.answer_spot(asked, {}, DOUBLE_GAUSS, steps=self.steps(spot=mock.Mock(side_effect=error)))

    def test_the_request_is_given_up_between_two_fields_after_its_budget(self) -> None:
        clock = mock.Mock(side_effect=[0.0, 0.0, REQUEST_BUDGET_S + 1])
        with self.assertRaises(TimeBudgetExceeded):
            spot.answer_spot(spec_of(RINGS, [0.0, 5.0]), {}, DOUBLE_GAUSS, steps=self.steps(), clock=clock)

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        request = {
            "contract": "1.0",
            "id": "d" * 64,
            "caseId": DOUBLE_GAUSS["id"],
            "quantity": "spot.native",
            "spec": spec_of(RINGS, [0.0]),
        }
        self.assertIn("spot.native", engine.describe()["capabilities"]["quantities"])
        for error, code in (
            (BuildMismatch("read-back fault"), "build-mismatch"),
            (TimeBudgetExceeded("long"), "time-budget"),
        ):
            with mock.patch("lvrtc_optiland.engine.answer_spot", side_effect=error):
                result = engine.run(request, DOUBLE_GAUSS)
            self.assertEqual((result["status"], result["error"]["code"]), ("error", code))
        bad = {**request, "spec": spec_of({**FAN, "samples": 10}, [0.0])}
        self.assertEqual(engine.run(bad, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        refused = {**request, "spec": spec_of(RINGS, [0.5], "half-field-fractions")}
        result = engine.run(refused, DOUBLE_GAUSS)
        self.assertEqual(
            (result["status"], result["unsupported"][0]["item"]), ("unsupported", "fields.half-field-fractions")
        )


def contract_ray(case: dict[str, Any], angle_deg: float, stop_point: tuple[float, float]) -> Any:
    """The contract's exact trace of the collimated ray of a field that crosses the stop surface at a height.

    The stop is the first surface of these cases: the ray is launched 10 mm before its point on the surface's sag,
    along the field's direction, which for an object toward +y descends: (0, -sin, cos). A point on the rim of the
    stop is a double whose height may be a rounding above the clip radius: the exact trace is of a copy of the case
    whose stop clips 1e-9 mm further out, which stops no ray the case lets through and lets the rim through.
    """
    from .exact import exact_sag  # noqa: PLC0415

    case = copy.deepcopy(case)
    rim = case["system"]["surfaces"][0]["aperture"]
    rim["semiDiameter"] = rim["semiDiameter"] + 1e-9
    shape = case["system"]["surfaces"][0]["shape"]
    x, y = stop_point
    z = float(exact_sag(shape, Decimal(math.hypot(x, y))))
    radians = math.radians(angle_deg)
    direction = (0.0, -math.sin(radians), math.cos(radians))
    origin = (x - 10 * direction[0], y - 10 * direction[1], z - 10 * direction[2])
    return exact_trace(case, origin, direction)


@unittest.skipIf(MISSING, MISSING or "")
class RealSpotTest(unittest.TestCase):
    """optiland's SpotDiagram and RayFan on a refracting sphere that is its own stop, held to exact traces."""

    # One sphere of index 3/2 and radius 30, its own stop of radius 4: its paraxial focus is 90 mm behind it.
    CASE = make_case([surface(0, sphere(30), semi=4.0)], indices=[[1.5]], image_z=90.0, stop_radius=4.0)

    def test_the_spot_on_the_axis_is_the_exact_rays_of_its_pupil_points_about_their_centroid(self) -> None:
        from optiland.distribution import create_distribution  # noqa: PLC0415

        rings = 3
        landing = spot.chief_landing(self.CASE, 0, 0.0)
        figures = spot.spot_step(self.CASE, 0, 0.0, rings, landing)
        # The hexapolar points of optiland's own distribution, on the stop at its radius 4.
        points = create_distribution("hexapolar")
        points.generate_points(rings)
        xs = [float(value) * 4 for value in points.x]
        ys = [float(value) * 4 for value in points.y]
        # A ray of the outer ring lies on the rim of the stop: optiland and the contract may each stop it by a
        # rounding. The spot is either of all 37 rays or of the 19 inside the rim, and nothing else.
        self.assertEqual(figures.launched, 37)
        self.assertIn(figures.landed, (37, 19))
        inside = [(x, y) for x, y in zip(xs, ys, strict=True) if figures.landed == 37 or math.hypot(x, y) < 3.999]
        landed = [contract_ray(self.CASE, 0.0, point).image for point in inside]
        self.assertTrue(all(point is not None for point in landed) and len(landed) == figures.landed)
        count = Decimal(len(landed))
        cx = sum(point[0] for point in landed) / count
        cy = sum(point[1] for point in landed) / count
        rms = (sum((p[0] - cx) ** 2 + (p[1] - cy) ** 2 for p in landed) / count).sqrt()
        # The aimer places a ray on the stop within 1e-10 mm; the sphere magnifies that by less than 2 at the image.
        self.assertAlmostEqual(figures.rms_radius_mm, float(rms), delta=1e-9)
        self.assertAlmostEqual(figures.centroid_mm[0], float(cx), delta=1e-9)
        self.assertAlmostEqual(figures.centroid_mm[1], -float(cy), delta=1e-9)

    def test_an_oblique_spot_is_the_exact_rays_about_their_centroid_relative_to_the_chief_ray(self) -> None:
        from optiland.distribution import create_distribution  # noqa: PLC0415

        # Off the axis the spot's centroid is off the chief ray (coma), so the worker's two steps show: optiland's y
        # mirrored into the contract's, and the centroid taken relative to where the chief ray lands.
        angle, rings = 6.0, 3
        landing = spot.chief_landing(self.CASE, 0, angle)
        figures = spot.spot_step(self.CASE, 0, angle, rings, landing)
        points = create_distribution("hexapolar")
        points.generate_points(rings)
        self.assertEqual(figures.launched, 37)
        # A ray of the outer ring lies on the rim of the stop, which a rounding of the aimer may stop: which ones,
        # optiland's own trace of the same rays on a fresh optic of the field says (its intensity at the image).
        optic = field_optic(self.CASE, 0, angle)
        optic.trace(*field_coordinate(angle), optic.primary_wavelength, rings, "hexapolar")
        lit = [float(value) > 0 for value in optic.surfaces.intensity[-1]]
        self.assertEqual(sum(lit), figures.landed)
        self.assertTrue(all(lit[: 1 + 3 * 2 * 3]), "a ray inside the rim was stopped")
        # optiland's pupil point (px, py) on the stop of radius 4 is the contract's (4 px, -4 py): y is mirrored.
        stop = [(float(x) * 4, -float(y) * 4) for x, y in zip(points.x, points.y, strict=True)]
        inside = [point for point, kept in zip(stop, lit, strict=True) if kept]
        chief = contract_ray(self.CASE, angle, (0.0, 0.0)).image
        landed = [contract_ray(self.CASE, angle, point).image for point in inside]
        self.assertTrue(chief is not None and all(point is not None for point in landed))
        self.assertEqual(len(landed), figures.landed)
        count = Decimal(len(landed))
        cx = sum(point[0] for point in landed) / count
        cy = sum(point[1] for point in landed) / count
        rms = (sum((p[0] - cx) ** 2 + (p[1] - cy) ** 2 for p in landed) / count).sqrt()
        # In the contract's frame, relative to the chief ray: the field lies along y, and the coma moves the centroid
        # along it by far more than the tolerance, so a sign or a missing subtraction cannot pass.
        relative = (float(cx - chief[0]), float(cy - chief[1]))
        self.assertLess(abs(relative[0]), 1e-12)
        self.assertGreater(abs(relative[1]), 1e-4)
        self.assertGreater(abs(float(chief[1])), 1.0)
        self.assertAlmostEqual(figures.centroid_mm[0], relative[0], delta=1e-9)
        self.assertAlmostEqual(figures.centroid_mm[1], relative[1], delta=1e-9)
        self.assertAlmostEqual(figures.rms_radius_mm, float(rms), delta=1e-9)

    def test_an_oblique_fan_is_the_contracts_frame_point_by_point(self) -> None:
        angle = 6.0
        for axis in ("tangential", "sagittal"):
            with self.subTest(axis=axis):
                fan = spot.fan_step(self.CASE, 0, angle, axis, 7)
                chief = contract_ray(self.CASE, angle, (0.0, 0.0)).image
                compared = 0
                for at, p in enumerate(fan.pupil):
                    self.assertAlmostEqual(p, -1 + at / 3, delta=1e-15)
                    # The contract's pupil point p on the stop: along y for a tangential fan, along x for a sagittal.
                    point = (0.0, 4 * p) if axis == "tangential" else (4 * p, 0.0)
                    image = contract_ray(self.CASE, angle, point).image
                    if abs(p) == 1 and (image is None or math.isnan(fan.error_mm[at])):
                        # A sample on the rim of the stop may be stopped by a rounding, by optiland or the contract.
                        continue
                    expected = image[1] - chief[1] if axis == "tangential" else image[0] - chief[0]
                    self.assertAlmostEqual(fan.error_mm[at], float(expected), delta=1e-9)
                    compared += 1
                self.assertGreaterEqual(compared, 5)

    def test_each_setting_of_the_spot_diagram_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from optiland import analysis  # noqa: PLC0415

        original = analysis.SpotDiagram

        def retrace(diagram: Any) -> None:
            diagram.optic.trace(0.0, 0.0, diagram.optic.primary_wavelength, 2, "hexapolar")

        faults = {
            "optic": lambda d: setattr(d, "optic", None),
            "fields": lambda d: setattr(d, "fields", []),
            "wavelengths": lambda d: setattr(d, "wavelengths", []),
            "reference wavelength": lambda d: setattr(d, "_analysis_ref_wavelength_index", 1),
            "rings": lambda d: setattr(d, "num_rings", d.num_rings + 1),
            "distribution": lambda d: setattr(d, "distribution", "uniform"),
            "coordinates": lambda d: setattr(d, "coordinates", "local"),
            "reference": lambda d: setattr(d, "_reference_strategy", object()),
            "launched": retrace,
            "data": lambda d: d.data.append(d.data[0]),
            "counted": lambda d: setattr(d.data[0][0], "intensity", d.data[0][0].intensity[:-1]),
        }
        landing = spot.chief_landing(self.CASE, 0, 0.0)
        for name, mutate in faults.items():

            def wrong(*args: Any, mutate: Any = mutate, **kwargs: Any) -> Any:
                diagram = original(*args, **kwargs)
                mutate(diagram)
                return diagram

            with self.subTest(fault=name), mock.patch.object(analysis, "SpotDiagram", wrong):
                with self.assertRaises(BuildMismatch):
                    spot.spot_step(self.CASE, 0, 0.0, 3, landing)
        # Unchanged, it passes.
        spot.spot_step(self.CASE, 0, 0.0, 3, landing)

    def test_each_setting_of_the_ray_fan_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from optiland import analysis  # noqa: PLC0415

        original = analysis.RayFan
        np = __import__("numpy")

        def key(fan: Any) -> Any:
            field = f"{tuple(float(v) for v in fan.fields[0].coord)}"
            return fan.data[field][f"{float(fan.wavelengths[0].value)}"]

        faults = {
            "optic": lambda f: setattr(f, "optic", None),
            "fields": lambda f: setattr(f, "fields", []),
            "wavelengths": lambda f: setattr(f, "wavelengths", []),
            "points": lambda f: setattr(f, "num_points", f.num_points + 2),
            "launched": lambda f: f.optic.trace(0.0, 0.0, f.optic.primary_wavelength, 3, "line_y"),
            "pupil": lambda f: f.data.update(Py=f.data["Py"] * 0.5),
            "centre": lambda f: f.data.update(Py=np.concatenate([f.data["Py"][:3], [0.25], f.data["Py"][4:]])),
            "samples": lambda f: key(f).update(y=key(f)["y"][:-1]),
        }
        for name, mutate in faults.items():

            def wrong(*args: Any, mutate: Any = mutate, **kwargs: Any) -> Any:
                fan = original(*args, **kwargs)
                mutate(fan)
                return fan

            with self.subTest(fault=name), mock.patch.object(analysis, "RayFan", wrong):
                with self.assertRaises(BuildMismatch):
                    spot.fan_step(self.CASE, 0, 6.0, "tangential", 7)
        spot.fan_step(self.CASE, 0, 6.0, "tangential", 7)

    def test_optilands_spot_radius_is_about_the_chief_ray_unless_it_is_asked_about_the_centroid(self) -> None:
        # docs/gotchas.md: optiland's default reference is the chief ray, and its RMS radius is then the RMS distance
        # from the chief ray's landing, which is the radius about the centroid and the centroid's offset together.
        from optiland.analysis import SpotDiagram  # noqa: PLC0415

        from lvrtc_optiland.mtf import field_coordinate, field_optic  # noqa: PLC0415

        coordinate = field_coordinate(6.0)
        optic = field_optic(self.CASE, 0, 6.0)
        wavelength = float(optic.primary_wavelength)
        default = SpotDiagram(optic, fields=[coordinate], wavelengths=[wavelength], num_rings=4)
        self.assertEqual(type(default._reference_strategy).__name__, "ChiefRayReference")
        held = default.data[0][0]
        x, y = [float(v) for v in held.x], [float(v) for v in held.y]
        chief = [float(v) for v in default.generate_chief_rays_centers(wavelength)[0]]
        mean = (math.fsum(x) / len(x), math.fsum(y) / len(y))
        about_centroid = math.sqrt(math.fsum((a - mean[0]) ** 2 + (b - mean[1]) ** 2 for a, b in zip(x, y)) / len(x))
        offset = math.hypot(mean[0] - chief[0], mean[1] - chief[1])
        self.assertGreater(offset, 1e-3)
        self.assertAlmostEqual(float(default.rms_spot_radius()[0][0]), math.hypot(about_centroid, offset), delta=1e-12)
        centred = SpotDiagram(
            field_optic(self.CASE, 0, 6.0),
            fields=[coordinate],
            wavelengths=[wavelength],
            num_rings=4,
            reference="centroid",
        )
        self.assertAlmostEqual(float(centred.rms_spot_radius()[0][0]), about_centroid, delta=1e-12)

    def test_a_fan_whose_middle_ray_is_dark_is_referred_to_the_mean_and_the_worker_says_so(self) -> None:
        # docs/gotchas.md: RayFan subtracts its middle ray's landing, and the mean of the rays it counts where that
        # ray has no intensity. A stop with a central obstruction darkens the middle ray of every fan.
        from optiland.analysis import RayFan  # noqa: PLC0415

        from lvrtc_optiland.mtf import field_coordinate, field_optic  # noqa: PLC0415

        annular = make_case(
            [surface(0, sphere(30), semi=4.0, inner=1.0)], indices=[[1.5]], image_z=90.0, stop_radius=4.0
        )
        annular["features"] = ["aperture.annular"]
        coordinate = field_coordinate(6.0)
        optic = field_optic(annular, 0, 6.0)
        wavelength = float(optic.primary_wavelength)
        fan = RayFan(optic, fields=[coordinate], wavelengths=[wavelength], num_points=7)
        held = fan.data[f"{coordinate}"][f"{wavelength}"]
        lit = [float(e) for e, i in zip(held["y"], held["intensity_y"], strict=True) if float(i) > 0]
        self.assertEqual(float(held["intensity_y"][3]), 0.0)
        self.assertAlmostEqual(math.fsum(lit), 0.0, delta=1e-12)
        with self.assertRaises(spot.FanCentreLost):
            spot.fan_step(annular, 0, 6.0, "tangential", 7)

    def test_the_double_gauss_answers_every_field_and_both_fans_in_the_contracts_frame(self) -> None:
        rings = spot.answer_spot(spec_of(RINGS, [0.0, 10.0]), {}, DOUBLE_GAUSS)
        fans = [
            spot.answer_spot(spec_of({**FAN, "axis": axis}, [10.0]), {}, DOUBLE_GAUSS)
            for axis in ("tangential", "sagittal")
        ]
        for data in (rings, *fans):
            self.assertEqual(validate_spot_native("data", data), [])
            self.assertTrue(all(field["status"] == "ok" for field in data["fields"]))
        # On the axis the spot is centred on the chief ray, to the roundings of a hexapolar sum.
        self.assertLess(max(abs(value) for value in rings["fields"][0]["spot"]["centroidMm"]), 1e-12)
        # A sagittal fan is odd in its pupil coordinate: the lens is symmetric about the meridional plane.
        sagittal = decode_ndarray(fans[1]["fields"][0]["fan"]["errorMm"]).values()
        for at in range(len(sagittal)):
            self.assertAlmostEqual(sagittal[at], -sagittal[-1 - at], delta=1e-12)


if __name__ == "__main__":
    unittest.main()
