"""``seidel.native`` of the worker: optiland's own third-order sums, in OpticStudio's sign.

The first half needs no optiland: the request is read, the refusals are decided from the case, an answer is written
from a stand-in step and is valid by the contract's port, and the engine dispatches it. The second half is the real
optiland and is skipped, with the reason, under an interpreter that has none. Its expected values are derived here, as
closed forms of a single refracting surface that is its own stop (S1 = y^4 c^3 (n - 1) / n^2, each next sum the one
before times the eccentricity ubar / (y c), S4 = H^2 c (n - 1) / n, S5 = (ubar / (y c))(S3 + S4), H = ubar y), whose
sign is OpticStudio's: a positive surface converging a collimated beam is undercorrected, S1 > 0. optiland's own
``seidels()`` is held to the negative of them (docs/gotchas.md), and to the same sums with and without a term of power
4 (which it does not read). Every setting the worker reads back is held to it with the mistake made on purpose.
"""

from __future__ import annotations

import copy
import math
import unittest
from typing import Any
from unittest import mock

from lvrtc_optiland import seidel
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine, refusals
from lvrtc_worker_kit.validate import validate_seidel_native

from .support import asphere, make_case, read_fixture, real_optiland_missing, sphere, surface
from .test_mtf import IDENTITY

MISSING = real_optiland_missing()

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")

# A sphere of radius 50 mm from air into glass of index 1.5 that is its own stop, of radius 5 mm.
RADIUS, INDEX, STOP = 50.0, 1.5, 5.0
FIELD = 5.0
CASE = make_case([surface(0.0, sphere(RADIUS), semi=STOP)], stop_radius=STOP, image_z=150.0, indices=[[INDEX]])
SPEC = {"line": 0, "maxFieldDeg": FIELD}


def seidel_request(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    return {"contract": "1.0", "id": "d" * 64, "caseId": case["id"], "quantity": "seidel.native", "spec": spec}


def closed_forms(field: float = FIELD) -> dict[str, float]:
    """The sums of ``CASE`` in OpticStudio's sign, from the closed forms of the module's documentation."""
    y, c, n = STOP, 1.0 / RADIUS, INDEX
    ubar = math.tan(math.radians(field))
    s1 = y**4 * c**3 * (n - 1) / n**2
    e = ubar / (y * c)
    s4 = (ubar * y) ** 2 * c * (n - 1) / n
    return {"SPHA": s1, "COMA": e * s1, "ASTI": e * e * s1, "FCUR": s4, "DIST": e * (e * e * s1 + s4)}


def stand_in(case: dict[str, Any], line: int, angle: float) -> seidel.Sums:
    """optiland's sums of two surfaces, as a step states them: binary fractions."""
    surfaces = [dict.fromkeys(seidel.SUMS, 0.25), dict.fromkeys(seidel.SUMS, -0.125)]
    return seidel.Sums(total=dict.fromkeys(seidel.SUMS, 0.125), surfaces=surfaces, invariant=0.5,
                       sampling={"marginalSlopeImageSpace": -0.0625, "chiefHeightAtImageMm": 4.5})


class RequestTest(unittest.TestCase):
    def test_lines_the_case_does_not_have_are_said_before_anything_is_built(self) -> None:
        for spec in ({"line": 1, "maxFieldDeg": 5}, {"line": 0, "maxFieldDeg": 5, "dispersionLines": [0, 3]}):
            refused = seidel.read_request(spec, CASE)
            self.assertEqual([item["item"] for item in refused], ["line"])  # type: ignore[index]
        self.assertEqual(seidel.read_request(SPEC, CASE), seidel.SeidelRequest(line=0, max_field_deg=5.0, dispersion=None))

    def test_terms_optilands_sums_do_not_read_are_refused_from_the_case(self) -> None:
        for power, item in ((1, "surface.asphere.linear-term"), (2, "surface.asphere.quadratic-term"),
                            (3, "surface.asphere.cubic-term"), (4, "surface.asphere.quartic-term")):
            case = make_case([surface(0.0, asphere(RADIUS, 0, (power, 1e-6)), semi=STOP)], stop_radius=STOP)
            with self.subTest(power=power):
                self.assertEqual([entry["item"] for entry in seidel.term_refusals(case)], [item])
                items = [entry["item"] for entry in refusals(seidel_request(case, SPEC), case)]
                self.assertEqual(items, [item])
        # A conic, and a term of power 6, are read or of higher order: nothing is refused.
        conic = make_case([surface(0.0, asphere(RADIUS, -0.5, (6, 1e-9)), semi=STOP)], stop_radius=STOP)
        self.assertEqual(seidel.term_refusals(conic), [])


class AnswerTest(unittest.TestCase):
    def test_an_answer_states_optilands_sums_and_no_colour_and_says_so_where_colour_was_asked(self) -> None:
        two = make_case([surface(0.0, sphere(RADIUS), semi=STOP)], stop_radius=STOP, lines=(587.5618, 486.1327))
        data = seidel.answer_seidel({**SPEC, "dispersionLines": [1, 0]}, two, step=stand_in)
        self.assertEqual(validate_seidel_native("data", data), [])
        self.assertEqual((data["status"], data["invariant"], data["dispersionLines"]), ("ok", 0.5, [1, 0]))
        self.assertEqual(data["total"], {**dict.fromkeys(seidel.SUMS, 0.125), "CLA": None, "CTR": None})
        self.assertEqual([entry["surface"] for entry in data["surfaces"]], [0, 1])
        self.assertTrue(all(entry["CLA"] is None and entry["CTR"] is None for entry in data["surfaces"]))
        self.assertTrue(any("states no chromatic sum" in note for note in data["notes"]))
        self.assertEqual(seidel.answer_counts(data), {"surfaces": 2, "ok": 1})

    def test_what_optiland_has_no_sums_of_is_unavailable_and_fatal_errors_are_no_answers(self) -> None:
        def afocal(case: dict[str, Any], line: int, angle: float) -> seidel.Sums:
            raise seidel.AnswerUnavailable("system.afocal", "optiland's f2() is inf mm")

        data = seidel.answer_seidel(SPEC, CASE, step=afocal)
        self.assertEqual(validate_seidel_native("data", data), [])
        self.assertEqual((data["status"], data["reason"], data["invariant"]), ("unavailable", "system.afocal", None))
        raising = seidel.answer_seidel(SPEC, CASE, step=mock.Mock(side_effect=ValueError("no ray")))
        self.assertEqual(raising["reason"], "optiland-raised-ValueError")
        for fatal in (BuildMismatch("a read-back"), MemoryError(), ImportError("numba")):
            with self.subTest(fatal=type(fatal).__name__), self.assertRaises(type(fatal)):
                seidel.answer_seidel(SPEC, CASE, step=mock.Mock(side_effect=fatal))

    def test_the_engine_dispatches_errors_refusals_and_bad_specs(self) -> None:
        engine = OptilandEngine(IDENTITY)
        request = seidel_request(DOUBLE_GAUSS, {"line": 0, "maxFieldDeg": 14})
        self.assertIn("seidel.native", engine.describe()["capabilities"]["quantities"])
        with mock.patch("lvrtc_optiland.engine.answer_seidel", side_effect=BuildMismatch("read-back fault")):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["error"]["code"]), ("error", "build-mismatch"))
        stand_in_data = seidel.answer_seidel(request["spec"], DOUBLE_GAUSS, step=stand_in)
        with mock.patch("lvrtc_optiland.engine.answer_seidel", return_value=stand_in_data):
            result = engine.run(request, DOUBLE_GAUSS)
        self.assertEqual((result["status"], result["diagnostics"]["counts"]), ("ok", {"surfaces": 2, "ok": 1}))
        bad = {**request, "spec": {"line": 0, "maxFieldDeg": 14, "dispersionLines": [0, 0]}}
        self.assertEqual(engine.run(bad, DOUBLE_GAUSS)["error"]["code"], "bad-spec")
        beyond = engine.run({**request, "spec": {"line": 2, "maxFieldDeg": 14}}, DOUBLE_GAUSS)
        self.assertEqual((beyond["status"], beyond["unsupported"][0]["item"]), ("unsupported", "line"))
        self.assertEqual(refusals(request, DOUBLE_GAUSS), [])


@unittest.skipIf(MISSING, MISSING or "")
class RealSeidelTest(unittest.TestCase):
    """optiland's own sums of synthetic lenses, held to values derived here."""

    def test_a_single_surface_has_the_closed_forms_in_opticstudios_sign_and_optiland_states_their_negative(self) -> None:
        from lvrtc_optiland.mtf import field_optic  # noqa: PLC0415

        data = seidel.answer_seidel(SPEC, CASE)
        self.assertEqual(validate_seidel_native("data", data), [], data)
        self.assertEqual(data["status"], "ok", data)
        expected = closed_forms()
        for name, value in expected.items():
            self.assertAlmostEqual(data["total"][name], value, delta=1e-14 * abs(value), msg=name)
            self.assertAlmostEqual(data["surfaces"][0][name], value, delta=1e-14 * abs(value), msg=name)
        # The invariant ubar y, positive with the marginal ray at +y and the chief ray of positive slope.
        self.assertAlmostEqual(data["invariant"], math.tan(math.radians(FIELD)) * STOP, delta=1e-15)
        self.assertGreater(data["total"]["SPHA"], 0.0)
        # optiland's own seidels() is the negative of OpticStudio's on all five.
        raw = [float(value) for value in field_optic(CASE, 0, FIELD).aberrations.seidels()]
        for at, name in enumerate(seidel.SUMS):
            self.assertAlmostEqual(raw[at], -expected[name], delta=1e-14 * abs(expected[name]), msg=name)

    def test_optilands_sums_do_not_read_a_term_of_power_4_so_the_worker_refuses_one(self) -> None:
        from lvrtc_optiland.mtf import field_optic  # noqa: PLC0415

        quartic = make_case([surface(0.0, asphere(RADIUS, 0, (4, 1e-5)), semi=STOP)], stop_radius=STOP,
                            image_z=150.0, indices=[[INDEX]])
        # A term of power 4 adds 8 a4 (n' - n) y^4 = 2.5e-2 mm to S1 (Welford); optiland's sums are those of the sphere.
        plain = [float(value) for value in field_optic(CASE, 0, FIELD).aberrations.seidels()]
        termed = [float(value) for value in field_optic(quartic, 0, FIELD).aberrations.seidels()]
        self.assertEqual(termed, plain)
        self.assertEqual([item["item"] for item in seidel.term_refusals(quartic)], ["surface.asphere.quartic-term"])

    def test_the_double_gauss_surfaces_add_up_to_optilands_total(self) -> None:
        data = seidel.answer_seidel({"line": 0, "maxFieldDeg": 14}, DOUBLE_GAUSS)
        self.assertEqual((data["status"], validate_seidel_native("data", data)), ("ok", []))
        self.assertEqual(len(data["surfaces"]), len(DOUBLE_GAUSS["system"]["surfaces"]))
        for name in seidel.SUMS:
            terms = [entry[name] for entry in data["surfaces"]]
            self.assertLessEqual(abs(math.fsum(terms) - data["total"][name]),
                                 seidel.SURFACE_SUM_TOLERANCE * math.fsum(abs(term) for term in terms))

    def test_each_setting_is_read_back_with_the_mistake_made_on_purpose(self) -> None:
        from lvrtc_optiland.build import optiland_api  # noqa: PLC0415
        from lvrtc_optiland.mtf import field_optic  # noqa: PLC0415

        api = optiland_api()

        def built() -> Any:
            return field_optic(CASE, 0, FIELD, api)

        def aperture_type(optic: Any) -> None:
            optic.set_aperture("EPD", 2 * STOP)

        def stop_value(optic: Any) -> None:
            optic.set_aperture("float_by_stop_size", 2 * STOP + 1e-9)

        def wavelength(optic: Any) -> None:
            optic.wavelengths.add(value=0.5, is_primary=True)

        def field(optic: Any) -> None:
            optic.fields.add(y=FIELD + 1.0)

        def surfaces(optic: Any) -> None:
            optic.surfaces.add(index=1, z=-1.0)

        def marginal(optic: Any) -> None:
            heights, slopes = optic.paraxial.marginal_ray()
            optic.paraxial.marginal_ray = lambda: (heights * 1.5, slopes)

        def chief_slope(optic: Any) -> None:
            heights, slopes = optic.paraxial.chief_ray()
            optic.paraxial.chief_ray = lambda: (heights, slopes * (1 + 1e-12))

        def chief_height(optic: Any) -> None:
            heights, slopes = optic.paraxial.chief_ray()
            optic.paraxial.chief_ray = lambda: (heights + 1e-6, slopes)

        def total(optic: Any) -> None:
            original = optic.aberrations.third_order
            optic.aberrations.third_order = lambda: (*original()[:-1], original()[-1] * 2)

        def terms(optic: Any) -> None:
            original = optic.aberrations.third_order
            optic.aberrations.third_order = lambda: (original()[0] * 2, *original()[1:])

        faults = {
            "aperture type": (aperture_type, "the type of the system aperture"),
            "stop diameter": (stop_value, "the stop diameter"),
            "wavelength": (wavelength, "the wavelength"),
            "largest field": (field, "the largest field"),
            "surfaces": (surfaces, "the number of surfaces"),
            "marginal ray": (marginal, "where the marginal ray starts"),
            "chief slope": (chief_slope, "the chief ray's slope"),
            "chief height": (chief_height, "the chief ray's height at the stop"),
            "total": (total, "third_order"),
            "terms": (terms, "the surfaces' SPHA added up"),
        }
        for name, (mistake, said) in faults.items():
            optic = built()
            mistake(optic)
            with self.subTest(fault=name), self.assertRaisesRegex(BuildMismatch, said):
                seidel.seidel_step(CASE, 0, FIELD, api, optic=optic)
        # The image space's index: the case says another than optiland holds.
        other = copy.deepcopy(CASE)
        from lvrtc_worker_kit.ndarray import encode_ndarray  # noqa: PLC0415

        other["conditions"]["indexAfterSurface"] = encode_ndarray("f8", [1.25], [1, 1])
        with self.assertRaisesRegex(BuildMismatch, "the index of the image space"):
            seidel.seidel_step(other, 0, FIELD, api, optic=built())
        # Unchanged, it passes.
        self.assertEqual(set(seidel.seidel_step(CASE, 0, FIELD, api, optic=built()).total), set(seidel.SUMS))


if __name__ == "__main__":
    unittest.main()
