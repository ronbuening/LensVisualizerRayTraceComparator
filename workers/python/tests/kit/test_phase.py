"""Hermetic version/phase row and case guards, using the same corpus as TypeScript."""
import copy
import unittest
from pathlib import Path
from lvrtc_worker_kit.protocol import parse_json, case_array_problems
from lvrtc_worker_kit.validate import validate_kind, validate_rays_trace_data
from lvrtc_worker_kit.ndarray import encode_ndarray

FIXTURES = Path(__file__).resolve().parents[4] / "contract/fixtures/v1"
def fixture(*parts):
    return parse_json(FIXTURES.joinpath(*parts).read_bytes())

class PhaseValidationTest(unittest.TestCase):
    def test_versions_and_phase_shapes(self):
        data=fixture("valid", "quantities", "rays.trace.data", "diffractive-v3-quadratic.json")
        self.assertEqual(validate_rays_trace_data(data, 3), [])
        self.assertTrue(validate_rays_trace_data(data, 2))
        missing=copy.deepcopy(data); del missing["phasePath"]
        self.assertTrue(validate_rays_trace_data(missing, 3))
        wrong=copy.deepcopy(data); wrong["phasePath"]=encode_ndarray("f8", [0, 0], [2, 1])
        self.assertTrue(validate_rays_trace_data(wrong, 3))
        unavailable=fixture("valid", "quantities", "rays.trace.data", "diffractive-v3-phase-unavailable.json")
        self.assertEqual(validate_rays_trace_data(unavailable, 3), [])
        unavailable["phasePath"]=data["phasePath"]
        self.assertTrue(validate_rays_trace_data(unavailable, 3))

    def test_request_and_case_minor_guards(self):
        for name in ("diffractive-trace-v3", "diffractive-first-order-v2"):
            request=fixture("valid", "request", name+".json")
            self.assertEqual(validate_kind("request", request), [])
            request["contract"]="1.4"
            self.assertTrue(validate_kind("request", request))
        case=fixture("valid", "optical-case", "diffractive-kinoform.json")
        self.assertEqual(case_array_problems(case), [])
        case["contract"]="1.4"
        self.assertTrue(case_array_problems(case))
        case["contract"]="1.5"; case["system"]["surfaces"][0]["diffractive"]["terms"] *= 2
        self.assertTrue(case_array_problems(case))

    def test_odd_profiles_are_valid_but_native_even_only_model_refuses_them(self):
        case=fixture("valid", "optical-case", "diffractive-kinoform.json")
        case["system"]["surfaces"][0]["diffractive"]["terms"][0]["radialPower"]=3
        self.assertEqual(validate_kind("optical-case",case),[])
        self.assertEqual(case_array_problems(case),[])
        from lvrtc_optiland.engine import refusals
        request=fixture("valid","request","diffractive-trace-v3.json")
        self.assertIn("optiland-odd-radial-phase",[item["item"] for item in refusals(request,case)])

    def test_only_the_two_phase_definitions_select_minor_5(self):
        from lvrtc_worker_kit import phase_definition
        from lvrtc_worker_kit.protocol import make_result
        self.assertTrue(phase_definition("rays.trace", 3))
        self.assertTrue(phase_definition("paraxial.first-order", 2))
        for quantity, version in (("rays.trace", None), ("rays.trace", 2), ("paraxial.first-order", None),
                                  ("paraxial.first-order", 1), ("selftest.echo", None), ("mtf.native", 1)):
            self.assertFalse(phase_definition(quantity, version), (quantity, version))
        request = {"id": "a" * 64, "caseId": "b" * 64, "quantity": "selftest.echo"}
        self.assertEqual(make_result(request, {"id": "e"}, "unsupported", unsupported=[])["contract"], "1.0")
