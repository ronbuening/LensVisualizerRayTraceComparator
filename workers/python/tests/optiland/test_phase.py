"""Native phase behavior and every new builder check; real tier only via npm run test:optiland."""
import copy
import math
import unittest
from types import SimpleNamespace
from unittest import mock
from lvrtc_optiland.build import build_case, build_optic, verify_optic, describe_optics, BuildMismatch, optiland_api
from lvrtc_optiland.trace import trace_rays, encode_trace
from lvrtc_optiland.first_order import term_refusals
from lvrtc_optiland.phase import verify_phase
from .support import read_fixture, f8, real_optiland_missing

@unittest.skipIf(real_optiland_missing() is not None, real_optiland_missing())
class PhaseTest(unittest.TestCase):
    def case(self):
        return read_fixture("valid", "optical-case", "diffractive-kinoform.json")

    def test_native_real_ray_grating_and_separate_paths(self):
        case = self.case()
        optic = build_case(case).optics[0]
        api = optiland_api()
        origins = api.np.array([[0., 2., -3.], [0., 0., -3.]])
        directions = api.np.array([[0., 0., 1.], [0., 0., 1.]])
        traced, _ = trace_rays(optic, origins, directions, max_batch=1)
        data = encode_trace(traced)
        self.assertEqual(f8(data["opticalPath"]), [3., 3.])
        self.assertAlmostEqual(f8(data["phasePath"])[0], -.02, delta=1e-16)
        self.assertEqual(f8(data["phasePath"])[1], 0.)
        self.assertAlmostEqual(f8(data["exitDirection"])[1], -.02, delta=1e-16)
        self.assertAlmostEqual(f8(data["opticalPathToImage"])[0], 3 + 100/math.sqrt(1-.02**2), delta=1e-12)
        self.assertEqual(describe_optics([optic], [0, 1])["diffractive"], [case["system"]["surfaces"][0]["diffractive"]])

    def test_native_accessor_bypasses_phase_and_direct_model_has_opposite_paraxial_sign(self):
        optic = build_case(self.case()).optics[0]
        api = optiland_api()
        # trace_generic constructs refractive powers from radius/index and never dispatches the phase model.
        # A phase-only plane therefore has zero native accessor power, whereas its real-ray focus is +100 mm.
        with api.np.errstate(all="ignore"):
            self.assertTrue(math.isinf(float(optic.paraxial.f2())))
        self.assertEqual(term_refusals(self.case())[0]["item"], "optiland-phase-paraxial-unseen")
        from optiland.rays import ParaxialRays
        rays = ParaxialRays(api.np.array([2.]), api.np.array([0.]), api.np.array([0.]), .5)
        optic.surfaces[1].interaction_model.interact_paraxial_rays(rays)
        # Native direct model subtracts gradient/k0 rather than adding it, giving +h/f instead of -h/f.
        self.assertAlmostEqual(float(rays.u[0]), .02, delta=1e-16)

    def test_curved_substrate_native_surface_gradient_is_projected(self):
        case = self.case()
        case["system"]["surfaces"][0]["shape"] = {"kind": "conic", "radius": 50., "conic": 0.}
        optic = build_case(case).optics[0]
        api = optiland_api()
        traced, _ = trace_rays(optic, api.np.array([[0., 2., -3.]]), api.np.array([[0., 0., 1.]]))
        direction = traced.exit_direction[0]
        # Same index on both sides: tangential outgoing momentum is incoming tangent plus
        # projection of grad W=(0,-h/100,0). Project to the spherical sheet tangent explicitly.
        h=2.; nz=math.sqrt(1-(h/50)**2); normal=api.np.array([0., -h/50, nz])
        d=api.np.array([0.,0.,1.]); g=api.np.array([0.,-h/100,0.])
        tangent=d-api.np.dot(d,normal)*normal+g-api.np.dot(g,normal)*normal
        expected=tangent+math.sqrt(1-float(api.np.dot(tangent,tangent)))*normal
        self.assertLess(float(api.np.max(api.np.abs(direction-expected))), 1e-14)

    def test_every_new_readback_rejects_deliberate_mistakes(self):
        case=self.case(); phase=case["system"]["surfaces"][0]["diffractive"]
        faults = {
            "phase profile class": lambda s: setattr(s.interaction_model, "phase_profile", object()),
            "phase model class": lambda s: setattr(s, "interaction_model", SimpleNamespace(phase_profile=s.interaction_model.phase_profile)),
            "phase parent": lambda s: setattr(s.interaction_model, "_parent_surface", None),
            "phase profile parent": lambda s: setattr(s.interaction_model.phase_profile, "parent_surface", None),
            "phase reflection": lambda s: setattr(s.interaction_model, "is_reflective", True),
            "phase referenceWavelengthNm": lambda s: setattr(s.interaction_model.phase_profile, "reference_wavelength_nm", 600),
            "phase diffractionOrder": lambda s: setattr(s.interaction_model.phase_profile, "diffraction_order", -1),
            "phase terms": lambda s: s.interaction_model.phase_profile.design_terms[0].update(coefficient=0),
            "phase radian coefficients": lambda s: s.interaction_model.phase_profile.coefficients.__setitem__(0, 0),
        }
        def hold(where, name, actual, expected):
            if actual != expected: raise BuildMismatch(name)
        for name, fault in faults.items():
            with self.subTest(name=name):
                optic=build_optic(case, 0); surface=optic.surfaces[1]; fault(surface)
                with self.assertRaisesRegex(BuildMismatch, name): verify_phase(surface, phase, hold, "surface 0")
        optic=build_optic(case,0)
        with mock.patch("optiland.phase.radial.RadialPhaseProfile.efficiency", new_callable=mock.PropertyMock, return_value=.5):
            with self.assertRaisesRegex(BuildMismatch, "phase efficiency"): verify_optic(optic,case,0)
        # A missing profile on an ordinary surface is checked as well.
        with self.assertRaisesRegex(BuildMismatch, "phase profile"):
            verify_phase(optic.surfaces[1], None, hold, "surface 0")

    def test_signed_order_and_wavelength_use_the_native_radian_profile(self):
        api=optiland_api()
        for order in (-2, 0, 1):
            for wavelength in (400., 600.):
                with self.subTest(order=order,wavelength=wavelength):
                    case=self.case(); case["system"]["surfaces"][0]["diffractive"]["diffractionOrder"]=order
                    case["conditions"]["lines"][0]["wavelengthNm"]=wavelength
                    optic=build_case(case).optics[0]
                    traced,_=trace_rays(optic,api.np.array([[0.,2.,-3.]]),api.np.array([[0.,0.,1.]]))
                    self.assertAlmostEqual(float(traced.exit_direction[0,1]),-.02*order*wavelength/500,delta=1e-15)
                    self.assertAlmostEqual(float(traced.phase_path[0,0]),-.02*order*wavelength/500,delta=1e-15)

    def test_quartic_term_takes_the_native_r4_slot(self):
        # W = C4 r^4 alone at m = 1, lambda = lambda0: at h = 2 the kick is 4 C4 h^3 and the phase path C4 h^4,
        # derived here. A term placed in the r^2 (or r^6) slot changes both.
        case = self.case()
        case["system"]["surfaces"][0]["diffractive"]["terms"] = [{"radialPower": 4, "coefficient": -1e-4}]
        api = optiland_api()
        optic = build_case(case).optics[0]
        traced, _ = trace_rays(optic, api.np.array([[0.0, 2.0, -3.0]]), api.np.array([[0.0, 0.0, 1.0]]))
        self.assertAlmostEqual(float(traced.exit_direction[0, 1]), 4 * -1e-4 * 2**3, delta=1e-15)
        self.assertAlmostEqual(float(traced.phase_path[0, 0]), -1e-4 * 2**4, delta=1e-16)
        self.assertEqual(optic.surfaces[1].interaction_model.phase_profile.coefficients[0], 0.0)
