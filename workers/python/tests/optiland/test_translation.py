"""The translation of a case into optiland's keywords, and what the engine says it can do. No optiland is needed.

What is tested here is the part of the builder that is arithmetic and layout: how a shape becomes the keywords of
``surfaces.add``, how a coefficient list is laid out and read again, the contract's sag the builder probes a built
surface with, and the engine's own negotiation. That optiland does with the keywords what the builder expects is
``test_build.py``'s to show, on the real optiland.
"""

from __future__ import annotations

import math
import unittest
from typing import Any

from lvrtc_optiland.build import (
    ASPHERE_MAX_ITERATIONS,
    ASPHERE_TOLERANCE_MM,
    BuildMismatch,
    coefficient_list,
    contract_sag,
    index_rows,
    nonzero_terms,
    sag_scale,
    shape_keywords,
    stated_terms,
    terms_of,
    wavelength_um,
)
from lvrtc_optiland.engine import DEFAULT_SAG_FRACTIONS, QUANTITIES, SUPPORTED_FEATURES, OptilandEngine, refusals
from lvrtc_worker_kit.fake_engine import FEATURE_FLAGS
from lvrtc_worker_kit.validate import validate_kind

from .support import describe_request, read_fixture

SINGLET = read_fixture("valid", "optical-case", "singlet.json")
DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")
ALL_FEATURES = read_fixture("valid", "optical-case", "all-features.json")

IDENTITY: dict[str, Any] = {
    "id": "optiland",
    "version": "0.0.0+test",
    "fingerprint": "f" * 64,
    "adapterRevision": "a" * 64,
    "details": {"jit": True},
}


def asphere(radius: float | None, conic: float, *terms: tuple[int, float]) -> dict[str, Any]:
    stated = [{"power": power, "coeff": coeff} for power, coeff in terms]
    return {"kind": "asphere", "radius": radius, "conic": conic, "terms": stated}


class CoefficientListTest(unittest.TestCase):
    def test_an_even_asphere_starts_at_the_term_of_power_2_not_of_power_4(self) -> None:
        self.assertEqual(coefficient_list([(4, 1.5e-6), (6, -2.5e-9)]), ("even_asphere", [0.0, 1.5e-6, -2.5e-9]))
        self.assertEqual(coefficient_list([(2, 1e-3)]), ("even_asphere", [1e-3]))
        # The order the case states its terms in changes nothing, and a power it skips is a 0.
        self.assertEqual(coefficient_list([(10, 5.0), (4, 2.0)]), ("even_asphere", [0.0, 2.0, 0.0, 0.0, 5.0]))

    def test_every_even_power_up_to_20_has_its_own_place(self) -> None:
        terms = [(power, float(power)) for power in range(4, 21, 2)]
        kind, coefficients = coefficient_list(terms)
        self.assertEqual(kind, "even_asphere")
        self.assertEqual(coefficients, [0.0, 4.0, 6.0, 8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0])
        for power, coeff in terms:
            self.assertEqual(coefficients[power // 2 - 1], coeff)

    def test_one_odd_power_makes_the_list_an_odd_aspheres_which_starts_at_power_1(self) -> None:
        self.assertEqual(coefficient_list([(3, 2e-5), (4, -1e-6)]), ("odd_asphere", [0.0, 0.0, 2e-5, -1e-6]))
        self.assertEqual(coefficient_list([(1, 0.25)]), ("odd_asphere", [0.25]))
        kind, coefficients = coefficient_list([(4, 4.0), (19, 19.0), (6, 6.0)])
        self.assertEqual((kind, len(coefficients)), ("odd_asphere", 19))
        self.assertEqual(
            [(at + 1, value) for at, value in enumerate(coefficients) if value], [(4, 4.0), (6, 6.0), (19, 19.0)]
        )

    def test_whether_a_list_is_even_is_asked_of_the_powers_stated_whatever_their_coefficients(self) -> None:
        # As the feature flags of a case are: a term of odd power with the coefficient 0 is an odd asphere's.
        self.assertEqual(coefficient_list([(4, 1.0), (5, 0.0)]), ("odd_asphere", [0.0, 0.0, 0.0, 1.0, 0.0]))
        self.assertEqual(coefficient_list([(4, 0.0)]), ("even_asphere", [0.0, 0.0]))

    def test_a_list_is_read_back_by_optilands_own_rule_and_only_what_is_not_0_is_a_term(self) -> None:
        self.assertEqual(terms_of(False, [0.0, 1.5e-6, -2.5e-9]), [(4, 1.5e-6), (6, -2.5e-9)])
        self.assertEqual(terms_of(True, [0.0, 0.0, 2e-5, -1e-6]), [(3, 2e-5), (4, -1e-6)])
        self.assertEqual(terms_of(False, [1e-3]), [(2, 1e-3)])
        self.assertEqual(terms_of(True, [0.25]), [(1, 0.25)])
        self.assertEqual(terms_of(False, []), [])
        self.assertEqual(terms_of(True, [0.0, -0.0]), [])
        # The same list is other terms for the other asphere: one place off is another surface.
        shifted = [1.5e-6, -2.5e-9]
        self.assertEqual(terms_of(False, shifted), [(2, 1.5e-6), (4, -2.5e-9)])
        self.assertEqual(terms_of(True, shifted), [(1, 1.5e-6), (2, -2.5e-9)])

    def test_laying_out_and_reading_back_give_the_terms_again(self) -> None:
        for terms in (
            [(4, 1.2e-6), (6, -3.4e-9)],
            [(2, 1e-3), (20, 9.5e-30)],
            [(3, 2e-5), (4, -1e-6)],
            [(1, 1e-2), (2, 1e-3), (7, 1e-9), (19, -2e-27)],
            [(30, 1e-40)],
        ):
            kind, coefficients = coefficient_list(terms)
            self.assertEqual(terms_of(kind == "odd_asphere", coefficients), terms, kind)

    def test_no_term_and_a_power_below_1_are_refused(self) -> None:
        with self.assertRaises(ValueError):
            coefficient_list([])
        with self.assertRaises(ValueError):
            coefficient_list([(0, 1.0)])


class ShapeKeywordsTest(unittest.TestCase):
    def test_a_plane_is_a_standard_surface_of_infinite_radius(self) -> None:
        self.assertEqual(shape_keywords({"kind": "plane"}), {"surface_type": "standard", "radius": math.inf})

    def test_a_conic_is_a_standard_surface_with_its_radius_and_conic_constant(self) -> None:
        keywords = shape_keywords({"kind": "conic", "radius": -120, "conic": 0})
        self.assertEqual(keywords, {"surface_type": "standard", "radius": -120.0, "conic": 0.0})
        self.assertIs(type(keywords["radius"]), float, "a whole number of the case is handed over as a float")
        self.assertEqual(shape_keywords({"kind": "conic", "radius": 40.5, "conic": -1})["conic"], -1.0)

    def test_an_asphere_states_its_tolerance_and_its_iterations_which_the_factory_would_not(self) -> None:
        keywords = shape_keywords(asphere(40, -0.8, (4, 1.2e-6), (6, -3.4e-9)))
        self.assertEqual(
            keywords,
            {
                "surface_type": "even_asphere",
                "radius": 40.0,
                "conic": -0.8,
                "coefficients": [0.0, 1.2e-6, -3.4e-9],
                "tol": 1e-12,
                "max_iter": 100,
            },
        )
        self.assertEqual((ASPHERE_TOLERANCE_MM, ASPHERE_MAX_ITERATIONS), (1e-12, 100))

    def test_a_flat_base_is_an_asphere_of_infinite_radius_and_keeps_its_conic_constant(self) -> None:
        keywords = shape_keywords(asphere(None, 0.5, (3, 2e-5), (4, -1e-6)))
        self.assertEqual(
            (keywords["surface_type"], keywords["radius"], keywords["conic"]), ("odd_asphere", math.inf, 0.5)
        )
        self.assertEqual(keywords["coefficients"], [0.0, 0.0, 2e-5, -1e-6])

    def test_an_asphere_whose_coefficients_are_all_0_stays_an_asphere(self) -> None:
        # So that optiland keeps the conic constant the case states, which a plane would not have.
        keywords = shape_keywords(asphere(None, -1, (4, 0.0)))
        self.assertEqual(
            (keywords["surface_type"], keywords["coefficients"], keywords["conic"]), ("even_asphere", [0.0, 0.0], -1.0)
        )
        self.assertEqual(nonzero_terms(asphere(None, -1, (4, 0.0))), [])
        self.assertEqual(stated_terms(asphere(None, -1, (4, 0.0))), [(4, 0.0)])

    def test_every_shape_of_the_contracts_cases_has_keywords(self) -> None:
        kinds = []
        for case in (SINGLET, DOUBLE_GAUSS, ALL_FEATURES):
            for surface in case["system"]["surfaces"]:
                keywords = shape_keywords(surface["shape"])
                kinds.append(keywords["surface_type"])
                if "coefficients" in keywords:
                    self.assertEqual((keywords["tol"], keywords["max_iter"]), (1e-12, 100))
        self.assertEqual(set(kinds), {"standard", "even_asphere", "odd_asphere"})

    def test_the_terms_that_add_something_ascend_in_power(self) -> None:
        shape = asphere(10, 0, (6, 1e-9), (4, 0.0), (3, 1e-5))
        self.assertEqual(stated_terms(shape), [(6, 1e-9), (4, 0.0), (3, 1e-5)])
        self.assertEqual(nonzero_terms(shape), [(3, 1e-5), (6, 1e-9)])
        self.assertEqual(nonzero_terms({"kind": "conic", "radius": 5, "conic": 0}), [])


class CaseNumbersTest(unittest.TestCase):
    def test_the_index_table_is_read_row_by_row_and_a_wavelength_is_one_division(self) -> None:
        rows = index_rows(ALL_FEATURES)
        self.assertEqual([len(row) for row in rows], [7, 7])
        self.assertEqual(rows[0][:2], [1.58913, 1.0])
        self.assertEqual(rows[1][0], 1.59581)
        self.assertEqual(index_rows(SINGLET), [[1.5168, 1.0]])
        self.assertEqual(wavelength_um({"wavelengthNm": 587.5618}), 587.5618 / 1000.0)
        self.assertEqual(wavelength_um({"wavelengthNm": 550}), 0.55)


class ContractSagTest(unittest.TestCase):
    def test_a_sphere_a_paraboloid_and_a_polynomial_are_their_closed_forms(self) -> None:
        # A sphere of radius 50 at 10 mm: R - sqrt(R^2 - r^2).
        self.assertAlmostEqual(contract_sag(1 / 50, 0.0, (), 10.0), 50 - math.sqrt(2500 - 100), delta=1e-15)
        self.assertAlmostEqual(contract_sag(1 / -50, 0.0, (), 10.0), -(50 - math.sqrt(2400)), delta=1e-15)
        # A paraboloid's sag is c r^2 / 2: its root is 1.
        self.assertAlmostEqual(contract_sag(0.025, -1.0, (), 6.0), 0.0125 * 36, delta=1e-15)
        self.assertEqual(contract_sag(0.25, -1.0, (), 4.0), 2.0)
        # A flat base is its terms alone.
        self.assertEqual(contract_sag(0.0, 0.0, ((3, 2e-5), (4, -1e-6)), 2.0), math.fsum([2e-5 * 8, -1e-6 * 16]))
        self.assertEqual(contract_sag(0.0, 5.0, (), 3.0), 0.0)
        self.assertEqual(contract_sag(1 / 50, 0.0, (), 0.0), 0.0)

    def test_beyond_the_end_of_a_conic_there_is_no_sag(self) -> None:
        self.assertTrue(math.isnan(contract_sag(1 / -6, 0.0, (), 8.0)))
        self.assertEqual(contract_sag(1 / 6, 0.0, (), 6.0), 6.0)
        # A hyperboloid and a paraboloid never end.
        self.assertTrue(math.isfinite(contract_sag(1 / 6, -2.0, (), 600.0)))
        self.assertTrue(math.isfinite(contract_sag(1 / 6, -1.0, (), 600.0)))

    def test_the_scale_is_the_size_of_what_is_summed_and_grows_where_the_conic_ends(self) -> None:
        # Terms that cancel to nothing still have their own size.
        self.assertEqual(sag_scale(0.0, 0.0, ((4, 1.0), (6, -0.25)), 2.0), 16.0 + 16.0)
        self.assertEqual(contract_sag(0.0, 0.0, ((4, 1.0), (6, -0.25)), 2.0), 0.0)
        near_axis = sag_scale(1 / 50, 0.0, (), 5.0)
        self.assertAlmostEqual(near_axis, contract_sag(1 / 50, 0.0, (), 5.0), delta=1e-2)
        # A thousandth of a millimetre short of the equator the root magnifies a rounding 150 times.
        self.assertGreater(sag_scale(1 / 50, 0.0, (), 49.999), 150 * 50)
        self.assertEqual(sag_scale(1 / 50, 0.0, (), 50.0), math.inf)
        self.assertEqual(sag_scale(0.0, 0.0, (), 9.0), 0.0)


class DeclarationTest(unittest.TestCase):
    def test_the_engine_declares_every_feature_flag_no_limit_the_built_system_echo_and_first_order_data(self) -> None:
        descriptor = OptilandEngine(IDENTITY).describe()
        self.assertEqual(validate_kind("engine-descriptor", descriptor), [])
        capabilities = descriptor["capabilities"]
        self.assertEqual(capabilities["features"], {"supported": list(FEATURE_FLAGS), "limits": {}})
        self.assertEqual(tuple(capabilities["features"]["supported"]), SUPPORTED_FEATURES)
        self.assertEqual(
            capabilities["quantities"], {"system.describe": {"version": 2}, "paraxial.first-order": {"version": 1}}
        )
        self.assertEqual(QUANTITIES, capabilities["quantities"])
        self.assertIs(capabilities["deterministic"], True)

    def test_the_fractions_of_a_spec_that_names_none_are_the_contracts_nine(self) -> None:
        # The contract's fixture of them is written from the comparator's own constant (test/contract/corpus.ts), which
        # is what `ref` and `lv` fall back to: a request without fractions asks every engine for the same heights.
        nine = read_fixture("valid", "quantities", "system.describe.spec", "nine-fractions.json")["sagFractions"]
        self.assertEqual(list(DEFAULT_SAG_FRACTIONS), nine)
        self.assertEqual(len(DEFAULT_SAG_FRACTIONS), 9)

    def test_nothing_keeps_it_from_describing_the_contracts_cases(self) -> None:
        for case in (SINGLET, DOUBLE_GAUSS, ALL_FEATURES):
            self.assertEqual(refusals(describe_request(case), case), [], case["label"]["name"])
        self.assertEqual(set(ALL_FEATURES["features"]), set(SUPPORTED_FEATURES), "the case that has every feature")

    def test_what_its_descriptor_rules_out_is_refused_in_the_order_of_the_comparators_negotiation(self) -> None:
        request = {**describe_request(SINGLET), "quantity": "rays.trace", "contract": "2.0"}
        case = {**SINGLET, "contract": "1.1", "features": ["lines.multiple", "surface.grating", "object.finite", "x.y"]}
        self.assertEqual(
            refusals(request, case),
            [
                {
                    "code": "contract",
                    "item": "1.1",
                    "message": "the engine speaks contract 1.0 to 1.0; the case is written to 1.1",
                },
                {
                    "code": "contract",
                    "item": "2.0",
                    "message": "the engine speaks contract 1.0 to 1.0; the request is written to 2.0",
                },
                {"code": "quantity", "item": "rays.trace", "message": "the engine does not offer rays.trace"},
                {
                    "code": "feature",
                    "item": "surface.grating",
                    "message": "the engine does not support surface.grating",
                },
                {"code": "feature", "item": "x.y", "message": "the engine does not support x.y"},
            ],
        )
        both = refusals({**describe_request(SINGLET), "contract": "1.1"}, {**SINGLET, "contract": "1.1"})
        self.assertEqual(
            [item["message"] for item in both],
            ["the engine speaks contract 1.0 to 1.0; the case and the request are written to 1.1"],
        )


class RunTest(unittest.TestCase):
    """The engine's ``run`` up to the point where optiland is needed: the builder is a stand-in here."""

    def engine(self, outcome: Exception | None = None) -> tuple[OptilandEngine, list[Any]]:
        built: list[Any] = []

        def build(case: dict[str, Any]) -> Any:
            built.append(case["id"])
            if outcome is not None:
                raise outcome
            raise AssertionError("no test here describes an optic")

        return OptilandEngine(IDENTITY, build=build), built

    def test_an_unsupported_request_and_a_bad_spec_are_answered_before_anything_is_built(self) -> None:
        engine, built = self.engine()
        refused = engine.run({**describe_request(SINGLET), "quantity": "mtf.native"}, SINGLET)
        self.assertEqual(validate_kind("result", refused), [])
        self.assertEqual(refused["status"], "unsupported")
        self.assertEqual([item["item"] for item in refused["unsupported"]], ["mtf.native"])

        for spec, said in (
            (
                {"sagFractions": [0, 0.5, 0.25]},
                "/sagFractions/2 [invariant] the fractions must ascend: 0.25 follows 0.5",
            ),
            ({"sagFractions": [1.5]}, "/sagFractions/0 [maximum]"),
            ({"fractions": [1]}, "[additionalProperties]"),
        ):
            answered = engine.run(describe_request(SINGLET, spec), SINGLET)
            self.assertEqual(validate_kind("result", answered), [])
            self.assertEqual((answered["status"], answered["error"]["code"]), ("error", "bad-spec"), spec)
            self.assertIn(said, answered["error"]["message"])
        self.assertEqual(built, [])

    def test_an_optic_that_is_not_the_case_is_an_error_that_says_which_surface_and_nothing_is_described(self) -> None:
        said = (
            "surface 3 (4): aperture.r_max is 4.5 in the optic optiland built and 9.0 in the case (line 0, 587.5618 nm)"
        )
        engine, built = self.engine(BuildMismatch(said))
        answered = engine.run(describe_request(ALL_FEATURES), ALL_FEATURES)
        self.assertEqual(validate_kind("result", answered), [])
        self.assertEqual(answered["status"], "error")
        self.assertEqual(answered["error"], {"code": "build-mismatch", "message": said})
        self.assertNotIn("data", answered)
        self.assertEqual(built, [ALL_FEATURES["id"]])
        self.assertEqual(answered["engine"]["fingerprint"], IDENTITY["fingerprint"])

    def test_any_other_failure_of_the_builder_is_raised_for_the_protocol_loop_to_answer(self) -> None:
        engine, _ = self.engine(ModuleNotFoundError("No module named 'optiland.geometries'"))
        with self.assertRaises(ModuleNotFoundError):
            engine.run(describe_request(SINGLET), SINGLET)


if __name__ == "__main__":
    unittest.main()
