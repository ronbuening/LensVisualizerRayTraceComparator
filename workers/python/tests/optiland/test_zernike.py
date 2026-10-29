"""``zernike.native`` of the worker: optiland's own Zernike fit of its wavefront, ``ZernikeOPD``'s two steps.

The first half needs no optiland: the orderings from their definitions, the request, an answer of stand-in steps valid
by the contract's port, a field of fewer valid samples than terms, the figures in exact fractions, and the engine's
dispatch. The second half is the real optiland and is skipped, with the reason, under an interpreter that has none. Its
expected values are derived here: the Fringe fit of the worker's own samples solved in exact fractions (the six first
polynomials are 1, x, y, 2 rho^2 - 1, x^2 - y^2 and 2 x y, rational at the grid's dyadic midpoints), the RMS and peak to
valley of the samples in fractions. optiland's behaviours the worker answers around are pinned: its 37th Fringe
polynomial is (6, 6), not OpticStudio's (12, 0); its ``"standard"`` is the OSA/ANSI ordering, not Noll's; ``OPD.rms()``
keeps the piston; ``remove_tilt`` keeps the fitted piston. Every setting the worker reads back is held to it with the
mistake made on purpose.
"""

from __future__ import annotations

import functools
import math
import unittest
from fractions import Fraction
from types import SimpleNamespace
from typing import Any
from unittest import mock

from lvrtc_optiland import zernike
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine
from lvrtc_optiland.mtf import REQUEST_BUDGET_S, TimeBudgetExceeded
from lvrtc_worker_kit.validate import validate_zernike_native

from .support import make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_mtf import IDENTITY

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")
SPEC = {"line": 0, "fieldAnglesDeg": [0, 10], "grid": 8, "ordering": "standard", "terms": 6}


def zernike_request(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    return {"contract": "1.0", "id": "d" * 64, "caseId": case["id"], "quantity": "zernike.native", "spec": spec}


def noll_by_rule(n: int, m: int) -> int:
    """Noll's index of (n, m) by the rule of his table: n (n + 1) / 2 + |m| + c, c = 0 for a cosine of n mod 4 in
    {0, 1} and a sine of n mod 4 in {2, 3}, 1 otherwise."""
    low = n % 4 <= 1
    return n * (n + 1) // 2 + abs(m) + (0 if (m > 0 and low) or (m < 0 and not low) else 1)


def stand_in(case: dict[str, Any], line: int, angle: float, grid: int, ordering: str, terms: int) -> dict[str, Any]:
    if angle == 10:
        raise ValueError("a ray missed")
    return {"imageHeightMm": 0.0, "coefficients": [0.125] * terms, "rmsToChiefWaves": 0.0625, "pvToChiefWaves": 0.25,
            "fitResidualRmsWaves": 2.0**-20, "fitCondition": 2.5, "validSamples": 52,
            "sampling": {"gridSize": float(grid)}}


class OrderingTest(unittest.TestCase):
    def test_the_standard_ordering_is_nolls_and_the_fringe_ordering_opticstudios(self) -> None:
        listed = sorted((noll_by_rule(n, m), (n, m)) for n in range(11) for m in range(-n, n + 1, 2))
        self.assertEqual([j for j, _ in listed], list(range(1, 67)))
        self.assertEqual(zernike.polynomials("standard", 66), [pair for _, pair in listed])
        # (1 + (n + |m|) / 2)^2 - 2 |m|, plus 1 for the sine, for the first 36; OpticStudio's 37th is (12, 0).
        fringe = {(1 + (n + abs(m)) // 2) ** 2 - 2 * abs(m) + (m < 0): (n, m) for n in range(11) for m in range(-n, n + 1, 2)}
        self.assertEqual(zernike.polynomials("fringe", 36), [fringe[j] for j in range(1, 37)])
        self.assertEqual(zernike.polynomials("fringe", 37)[36], (12, 0))


class RequestTest(unittest.TestCase):
    def test_a_fringe_fit_of_37_terms_a_line_the_case_does_not_have_and_a_finite_object_are_refused(self) -> None:
        refused = zernike.read_request({**SPEC, "ordering": "fringe", "terms": 37}, DOUBLE_GAUSS)
        self.assertEqual([item["item"] for item in refused], [zernike.FRINGE_TERM_37])  # type: ignore[index]
        self.assertFalse(isinstance(zernike.read_request({**SPEC, "ordering": "fringe", "terms": 36}, DOUBLE_GAUSS),
                                    list))
        self.assertEqual(zernike.read_request({**SPEC, "line": 3}, DOUBLE_GAUSS)[0]["item"], "line")  # type: ignore[index]
        finite = make_case([surface(0.0, sphere(50), semi=5.0)], stop_radius=5.0, object_z=-200.0)
        self.assertIsInstance(zernike.read_request(SPEC, finite), list)


class AnswerTest(unittest.TestCase):
    def test_each_field_is_a_row_and_one_optiland_raises_on_is_unavailable(self) -> None:
        data = zernike.answer_zernike(SPEC, DOUBLE_GAUSS, step=stand_in)
        self.assertEqual(validate_zernike_native("data", data), [])
        self.assertEqual([field["status"] for field in data["fields"]], ["ok", "unavailable"])
        self.assertEqual(data["fields"][1]["reason"], "optiland-raised-ValueError")
        self.assertEqual((data["ordering"], data["terms"], data["grid"]), ("standard", 6, 8))
        self.assertEqual(zernike.field_counts(data), {"fields": 2, "ok": 1, "unavailable": 1})
        for fatal in (BuildMismatch("a read-back"), MemoryError(), ImportError("numba")):
            with self.subTest(fatal=type(fatal).__name__), self.assertRaises(type(fatal)):
                zernike.answer_zernike(SPEC, DOUBLE_GAUSS, step=mock.Mock(side_effect=fatal))
        ticks = iter([0.0, 0.0, REQUEST_BUDGET_S + 1])
        with self.assertRaises(TimeBudgetExceeded):
            zernike.answer_zernike(SPEC, DOUBLE_GAUSS, step=stand_in, clock=lambda: next(ticks))

    def test_fewer_valid_samples_than_terms_are_too_few_samples_before_optiland_is_asked(self) -> None:
        # Five samples inside the circle, three of them lit: no fit of six terms. The worker says so, as optiland-wave
        # does, and asks optiland for nothing (a stand-in sample; any call of optiland would be another reason).
        raw = SimpleNamespace(inside=[0, 1, 2, 3, 4], valid=[1, 0, 1, 1, 0], x=[0.0, 0.25, 0.5, -0.25, 0.125],
                              y=[0.0, 0.125, -0.5, 0.25, 0.375], opd=[0.0, 0.5, 0.25, 0.125, 1.0], center=(0.0, 1.0))
        sample = mock.Mock(return_value=raw)
        with mock.patch.object(zernike, "optiland_api", side_effect=AssertionError("optiland was asked")):
            with self.assertRaises(zernike.TooFewSamples):
                zernike.zernike_field(DOUBLE_GAUSS, 0, 10.0, 8, "standard", 6, sample=sample)
            step = functools.partial(zernike.zernike_field, sample=sample)
            data = zernike.answer_zernike(SPEC, DOUBLE_GAUSS, step=step)
        self.assertEqual(validate_zernike_native("data", data), [])
        self.assertEqual([(field["status"], field["reason"]) for field in data["fields"]],
                         [("unavailable", "too-few-samples")] * 2)
        self.assertIn("3 valid samples cannot determine 6 coefficients", data["notes"][0])
        # Six lit samples are enough for six terms: then optiland is asked (here a stand-in that raises).
        enough = SimpleNamespace(inside=list(range(6)), valid=[1] * 6, x=[*raw.x, 0.5], y=[*raw.y, 0.5], opd=[0.0] * 6,
                                 center=(0.0, 1.0))
        asked = functools.partial(zernike.zernike_field, sample=mock.Mock(return_value=enough))
        with mock.patch.object(zernike, "optiland_api", side_effect=RuntimeError("optiland was asked")), \
                mock.patch.dict("sys.modules", {"optiland.zernike": SimpleNamespace(ZernikeFit=None)}):
            data = zernike.answer_zernike(SPEC, DOUBLE_GAUSS, step=asked)
        self.assertEqual([field["reason"] for field in data["fields"]], ["optiland-raised-RuntimeError"] * 2)

    def test_the_rms_about_the_mean_and_the_peak_to_valley_are_the_exact_ones(self) -> None:
        values = [0.25, -0.125, 0.5, 0.0625, 1.0 / 3.0]
        exact = [Fraction(value) for value in values]
        mean = sum(exact) / len(exact)
        variance = sum((value - mean) ** 2 for value in exact) / len(exact)
        rms, pv = zernike.rms_and_peak_to_valley(values)
        self.assertAlmostEqual(rms, math.sqrt(variance), delta=2 * math.ulp(rms))
        self.assertEqual(pv, 0.5 + 0.125)

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        request = zernike_request(DOUBLE_GAUSS, SPEC)
        self.assertIn("zernike.native", engine.describe()["capabilities"]["quantities"])
        for error, code in ((BuildMismatch("read-back fault"), "build-mismatch"), (TimeBudgetExceeded("long"), "time-budget")):
            with mock.patch("lvrtc_optiland.engine.answer_zernike", side_effect=error):
                self.assertEqual(engine.run(request, DOUBLE_GAUSS)["error"]["code"], code)
        stand_in_data = zernike.answer_zernike(SPEC, DOUBLE_GAUSS, step=stand_in)
        with mock.patch("lvrtc_optiland.engine.answer_zernike", return_value=stand_in_data):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["diagnostics"]["counts"]), ("ok", {"fields": 2, "ok": 1, "unavailable": 1}))
        self.assertEqual(engine.run({**request, "spec": {**SPEC, "grid": 9}}, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        refused = engine.run({**request, "spec": {**SPEC, "ordering": "fringe", "terms": 37}}, DOUBLE_GAUSS)
        self.assertEqual((refused["status"], refused["unsupported"][0]["item"]), ("unsupported", zernike.FRINGE_TERM_37))


# ── Expected values, derived ─────────────────────────────────────────────────────────────────────────────────────


def fringe_six(x: Fraction, y: Fraction) -> list[Fraction]:
    """The first six Fringe polynomials at (x, y): 1, rho cos, rho sin, 2 rho^2 - 1, rho^2 cos 2, rho^2 sin 2."""
    return [Fraction(1), x, y, 2 * (x * x + y * y) - 1, x * x - y * y, 2 * x * y]


def exact_least_squares(xs: list[float], ys: list[float], ws: list[float]) -> list[Fraction]:
    """The least-squares coefficients of the six Fringe polynomials, by the normal equations in exact fractions."""
    rows = [fringe_six(Fraction(x), Fraction(y)) for x, y in zip(xs, ys, strict=True)]
    gram = [[sum(row[j] * row[k] for row in rows) for k in range(6)] for j in range(6)]
    right = [sum(row[j] * Fraction(w) for row, w in zip(rows, ws, strict=True)) for j in range(6)]
    # Gauss-Jordan elimination of the augmented matrix, exact.
    matrix = [gram[j] + [right[j]] for j in range(6)]
    for column in range(6):
        pivot = next(row for row in range(column, 6) if matrix[row][column] != 0)
        matrix[column], matrix[pivot] = matrix[pivot], matrix[column]
        lead = matrix[column][column]
        matrix[column] = [value / lead for value in matrix[column]]
        for row in range(6):
            if row != column and matrix[row][column] != 0:
                factor = matrix[row][column]
                matrix[row] = [a - factor * b for a, b in zip(matrix[row], matrix[column], strict=True)]
    return [matrix[j][6] for j in range(6)]


@unittest.skipIf(MISSING, MISSING or "")
class RealZernikeTest(unittest.TestCase):
    """optiland's own fit of its wavefront, held to values derived here."""

    def test_the_fringe_fit_is_the_exact_least_squares_of_the_samples_and_the_figures_their_exact_ones(self) -> None:
        from lvrtc_optiland.wavefront import wavefront_sample  # noqa: PLC0415

        field = zernike.zernike_field(DOUBLE_GAUSS, 0, 10.0, 8, "fringe", 6)
        raw = wavefront_sample(DOUBLE_GAUSS, 0, 10.0, 8)
        cells = [cell for cell in raw.inside if raw.valid[cell] == 1]
        xs, ys, ws = ([getattr(raw, name)[cell] for cell in cells] for name in ("x", "y", "opd"))
        self.assertEqual(field["validSamples"], len(cells))
        exact = exact_least_squares(xs, ys, ws)
        scale = max(abs(float(value)) for value in exact)
        for term, (got, want) in enumerate(zip(field["coefficients"], exact, strict=True)):
            self.assertAlmostEqual(got, float(want), delta=1e-12 * scale, msg=f"term {term + 1}")
        mean = sum(Fraction(w) for w in ws) / len(ws)
        variance = sum((Fraction(w) - mean) ** 2 for w in ws) / len(ws)
        self.assertAlmostEqual(field["rmsToChiefWaves"], math.sqrt(variance), delta=4 * math.ulp(math.sqrt(variance)))
        self.assertEqual(field["pvToChiefWaves"], max(ws) - min(ws))
        # The figures and the samples are of one fresh optic each: the same bits as wavefront.native's.
        self.assertGreater(field["fitResidualRmsWaves"], 0.0)

    def test_the_standard_fit_is_zernike_opds_two_steps_whose_coefficients_are_optilands(self) -> None:
        import numpy as np  # noqa: PLC0415
        from optiland.wavefront import ZernikeOPD  # noqa: PLC0415
        from optiland.zernike import ZernikeFit  # noqa: PLC0415

        from lvrtc_optiland.mtf import field_optic  # noqa: PLC0415

        # On ZernikeOPD's own hexapolar grid, the worker's two steps give ZernikeOPD's coefficients bit for bit.
        optic = field_optic(DOUBLE_GAUSS, 0, 10.0)
        opd = ZernikeOPD(optic, field=(0.0, 1.0), wavelength=optic.primary_wavelength, num_rings=6,
                         zernike_type="noll", num_terms=15)
        data = opd.get_data(opd.fields[0], opd.wavelengths[0])
        mask = np.asarray(data.intensity) > 0
        fit = ZernikeFit(np.asarray(opd.distribution.x)[mask], np.asarray(opd.distribution.y)[mask],
                         np.asarray(data.opd)[mask], zernike_type="noll", num_terms=15)
        self.assertEqual(np.asarray(fit.coeffs).tolist(), np.asarray(opd.coeffs).tolist())

    def test_optilands_orderings_and_figures_are_pinned_where_they_are_not_opticstudios(self) -> None:
        import numpy as np  # noqa: PLC0415
        from optiland.wavefront import OPD, Wavefront  # noqa: PLC0415
        from optiland.zernike import ZernikeFringe, ZernikeNoll, ZernikeStandard  # noqa: PLC0415

        from lvrtc_optiland.mtf import field_optic  # noqa: PLC0415

        # Its 37th Fringe polynomial is rho^6 cos 6 theta; OpticStudio's is the radial polynomial of order 12.
        self.assertEqual(tuple(ZernikeFringe(np.ones(37)).indices[36].tolist()), (6, 6))
        # Its "standard" is the OSA/ANSI ordering: (1, -1) second, where Noll's (OpticStudio's Standard) has (1, 1).
        self.assertEqual([tuple(pair) for pair in ZernikeStandard(np.ones(3)).indices.tolist()], [(0, 0), (1, -1), (1, 1)])
        self.assertEqual([tuple(pair) for pair in ZernikeNoll(np.ones(3)).indices.tolist()], [(0, 0), (1, 1), (1, -1)])
        # OPD.rms() is the root mean square about the chief ray's path, the piston kept: not the RMS about the mean.
        optic = field_optic(DOUBLE_GAUSS, 0, 10.0)
        opd = OPD(optic, field=(0.0, 1.0), wavelength=optic.primary_wavelength, num_rays=6)
        data = opd.get_data(opd.fields[0], opd.wavelengths[0])
        values = [float(v) for v, i in zip(data.opd, data.intensity, strict=True) if i > 0]
        self.assertAlmostEqual(float(opd.rms()), math.sqrt(math.fsum(v * v for v in values) / len(values)), delta=1e-12)
        rms, _ = zernike.rms_and_peak_to_valley(values)
        self.assertGreater(abs(float(opd.rms()) - rms), 1e-3)
        # remove_tilt keeps the piston of the plane it fits, though its docstring says it removes piston and tilt.
        self.assertTrue(np.array_equal(Wavefront.fit_and_remove_tilt(data), Wavefront.fit_and_remove_tilt(data, False)))
        self.assertFalse(np.allclose(Wavefront.fit_and_remove_tilt(data), Wavefront.fit_and_remove_tilt(data, True)))

    def test_each_setting_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        import numpy as np  # noqa: PLC0415
        import optiland.zernike as module  # noqa: PLC0415
        from optiland.zernike import ZernikeFit, ZernikeStandard  # noqa: PLC0415

        def changing(mutate: Any) -> Any:
            def wrong(*args: Any, **kwargs: Any) -> Any:
                fit = ZernikeFit(*args, **kwargs)
                mutate(fit)
                return fit

            return wrong

        faults = {
            "type": (lambda fit: setattr(fit, "zernike_type", "standard"), "the type"),
            "class": (lambda fit: setattr(fit, "zernike", ZernikeStandard(fit.zernike.coeffs)), "the class"),
            "terms": (lambda fit: setattr(fit, "num_terms", fit.num_terms + 1), "the number of terms"),
            "points": (lambda fit: setattr(fit, "num_pts", fit.num_pts - 1), "the number of points"),
            "x": (lambda fit: setattr(fit, "x", fit.x + 0.125), "the x of the points"),
            "y": (lambda fit: setattr(fit, "y", fit.y[::-1]), "the y of the points"),
            "values": (lambda fit: setattr(fit, "z", fit.z * 2), "the values"),
            "polynomials": (lambda fit: setattr(fit.zernike, "indices", fit.zernike.indices[::-1]), "the polynomials"),
            "coefficients": (lambda fit: setattr(fit.zernike, "coeffs", np.asarray(fit.zernike.coeffs)[:-1]),
                             "the number of coefficients"),
        }
        for name, (mutate, said) in faults.items():
            with self.subTest(fault=name), mock.patch.object(module, "ZernikeFit", changing(mutate)):
                with self.assertRaisesRegex(BuildMismatch, said):
                    zernike.zernike_field(DOUBLE_GAUSS, 0, 10.0, 8, "standard", 6)
        # Unchanged, it passes.
        self.assertEqual(len(zernike.zernike_field(DOUBLE_GAUSS, 0, 10.0, 8, "standard", 6)["coefficients"]), 6)


if __name__ == "__main__":
    unittest.main()
