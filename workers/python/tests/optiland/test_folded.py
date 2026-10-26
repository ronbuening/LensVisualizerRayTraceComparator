"""Folded visits on native optiland; expectations derived from mirror geometry, never another engine."""

from __future__ import annotations

import math
import unittest
from unittest import mock

from lvrtc_optiland import build
from lvrtc_optiland.build import BuildMismatch, build_case, describe_optics
from lvrtc_optiland.trace import trace_rays
from lvrtc_worker_kit.ndarray import decode_ndarray
from .support import read_fixture, real_optiland_missing


@unittest.skipIf(real_optiland_missing() is not None, real_optiland_missing())
class FoldedTest(unittest.TestCase):
    def test_spherical_mirror_reflection_and_path(self):
        case = read_fixture("valid", "optical-case", "folded-spherical-mirror.json")
        optic = build_case(case).optics[0]
        data = describe_optics([optic], [0, 1])
        self.assertEqual(data["pathSurfaceIndices"], [0, 1])
        self.assertEqual(data["pathInteractions"], ["refract", "reflect"])
        api = build.optiland_api()
        h = 5.0
        traced, _ = trace_rays(
            optic._lvrtc_path_optic, api.np.array([[0.0, h, -10.0]]), api.np.array([[0.0, 0.0, 1.0]])
        )
        root = math.sqrt(10000 - h * h)
        # Circle centre at z=0; vector reflection at (h,root) gives the two components below.
        self.assertEqual(int(traced.status[0]), 0)
        self.assertAlmostEqual(float(traced.hits[1, 0, 2]), root, delta=2e-12)
        self.assertAlmostEqual(float(traced.exit_direction[0, 1]), -2 * h * root / 10000, delta=2e-14)
        self.assertAlmostEqual(float(traced.exit_direction[0, 2]), -1 + 2 * h * h / 10000, delta=2e-14)
        self.assertAlmostEqual(float(traced.optical_path[0]), root + 10, delta=2e-12)

    def test_mangin_repeated_surface_and_return_medium(self):
        case = read_fixture("valid", "optical-case", "folded-mangin.json")
        optic = build_case(case).optics[0]
        data = describe_optics([optic], [0])
        self.assertEqual(data["pathSurfaceIndices"], [0, 1, 0])
        self.assertEqual(decode_ndarray(data["pathIndexAfterSurface"]).values(), [1.5, 1.5, 1.0])
        api = build.optiland_api()
        h = 5.0
        root = math.sqrt(10000 - h * h)
        hit_z = 10 - 100 + root
        dy, dz = -2 * h * root / 10000, -1 + 2 * h * h / 10000
        t = -hit_z / dz
        traced, _ = trace_rays(
            optic._lvrtc_path_optic, api.np.array([[0.0, h, -10.0]]), api.np.array([[0.0, 0.0, 1.0]])
        )
        self.assertEqual(int(traced.status[0]), 0)
        self.assertAlmostEqual(float(traced.hits[2, 0, 1]), h + t * dy, delta=2e-12)
        self.assertAlmostEqual(float(traced.exit_direction[0, 1]), 1.5 * dy, delta=2e-14)
        self.assertAlmostEqual(float(traced.optical_path[0]), 10 + 1.5 * (hit_z + t), delta=2e-12)

    def test_each_new_readback_catches_its_deliberate_mistake(self):
        case = read_fixture("valid", "optical-case", "folded-mangin.json")
        real = build.surface_keywords
        faults = {
            "reflection": lambda kw, row: (
                {**kw, "is_reflective": True, "material": build.optiland_api().IdealMaterial(n=1.5)}
                if row.get("_interaction") == "reflect"
                else kw
            ),
            "identity": lambda kw, row: {**kw, "comment": "99:reflect"} if "_physical_index" in row else kw,
            "visit-position": lambda kw, row: {**kw, "z": kw["z"] + 1} if "_physical_index" in row else kw,
            "return-medium": lambda kw, row: (
                {**kw, "material": build.optiland_api().IdealMaterial(n=1.5)}
                if row.get("_physical_index") == 0
                and row.get("_interaction") == "refract"
                and kw["material"].n(0.55) == 1
                else kw
            ),
        }
        for name, fault in faults.items():
            with self.subTest(name=name):

                def changed(api, row, index_after, is_stop):
                    return fault(real(api, row, index_after, is_stop), row)

                with mock.patch.object(build, "surface_keywords", changed), self.assertRaises(BuildMismatch):
                    build_case(case)

    def test_first_order_is_native_and_matches_closed_mirror_formula(self):
        from lvrtc_optiland.first_order import first_order_of

        expected = {
            "folded-spherical-mirror": {
                "efl": -50.0,
                "frontFocalZ": 50.0,
                "rearFocalZ": 50.0,
                "frontPrincipalZ": 100.0,
                "rearPrincipalZ": 100.0,
                "exitPupilZ": 0.0,
                "exitPupilSemiDiameter": 25.0,
            },
            # Two glass transfers t/n=20/3 surround mirror power 2n/|R|=3/100.
            # A=D=4/5, B=12, C=-3/100; final signed index -1 gives these cardinals/pupils.
            "folded-mangin": {
                "efl": -100 / 3,
                "frontFocalZ": -80 / 3,
                "rearFocalZ": -80 / 3,
                "frontPrincipalZ": 20 / 3,
                "rearPrincipalZ": 20 / 3,
                "exitPupilZ": 15.0,
                "exitPupilSemiDiameter": 125 / 4,
            },
        }
        for name, values in expected.items():
            case = read_fixture("valid", "optical-case", name + ".json")
            optic = build_case(case).optics[0]._lvrtc_path_optic
            answer = first_order_of([optic], 1)
            self.assertIsNotNone(answer.data)
            for key, value in values.items():
                self.assertAlmostEqual(decode_ndarray(answer.data[key]).values()[0], value, delta=2e-12)

    def test_band_blocker_transmits_both_complements_and_mirror_hole_is_transparent(self):
        import copy
        from .support import make_case, surface, PLANE

        api = build.optiland_api()
        case = make_case([surface(0, PLANE, 20), surface(5, PLANE, 7)], image_z=10)
        case["contract"] = "1.4"
        case["system"]["surfaces"][1]["aperture"]["innerSemiDiameter"] = 3.0
        case["system"]["opticalPath"] = [
            {"surfaceIndex": 0, "interaction": "refract", "mediumAfter": 0},
            {"surfaceIndex": 1, "interaction": "block"},
        ]
        optic = build_case(case).optics[0]._lvrtc_path_optic
        heights = [0, 2.999, 3, 5, 7, 7.001, 10]
        origins = api.np.array([[0.0, h, -10.0] for h in heights])
        directions = api.np.array([[0.0, 0.0, 1.0]] * len(heights))
        traced, _ = trace_rays(optic, origins, directions)
        self.assertEqual(list(traced.status), [0, 0, 1, 1, 1, 0, 0])
        mirror = read_fixture("valid", "optical-case", "folded-spherical-mirror.json")
        mirror["system"]["surfaces"][1]["aperture"]["innerSemiDiameter"] = 6.0
        # A ray in the hole crosses the reference sheet unchanged and cannot reach an image behind it.
        optic = build_case(mirror).optics[0]._lvrtc_path_optic
        traced, _ = trace_rays(optic, api.np.array([[0.0, 2.0, -10.0]]), api.np.array([[0.0, 0.0, 1.0]]))
        self.assertEqual(float(traced.exit_direction[0, 2]), 1.0)
        self.assertEqual(int(traced.end_surface[0]), 2)

    def test_all_conditional_policy_readbacks_have_deliberate_faults(self):
        import types
        from lvrtc_optiland.folded import install

        case = read_fixture("valid", "optical-case", "folded-mangin.json")
        faults = {
            "step": lambda o: o.surfaces[1].interaction_model.step.update(incidentSide="rear"),
            "inactive-side": lambda o: o.surfaces[1].interaction_model.step.update(inactiveSide="block"),
            "outer": lambda o: setattr(o.surfaces[1].interaction_model, "outer", 99.0),
            "inner": lambda o: setattr(o.surfaces[1].interaction_model, "inner", 2.0),
            "front-index": lambda o: setattr(o.surfaces[1].interaction_model, "front_index", 1.2),
            "rear-index": lambda o: setattr(o.surfaces[1].interaction_model, "rear_index", 1.2),
            "reflection-enabled": lambda o: setattr(
                o.surfaces[1].interaction_model.reflection_native, "is_reflective", False
            ),
            "reflection-class": lambda o: setattr(
                o.surfaces[1].interaction_model, "reflection_native", types.SimpleNamespace(is_reflective=True)
            ),
            "paraxial-enabled": lambda o: setattr(
                o.surfaces[1].interaction_model.paraxial_native, "is_reflective", True
            ),
            "paraxial-class": lambda o: setattr(
                o.surfaces[1].interaction_model, "paraxial_native", types.SimpleNamespace(is_reflective=False)
            ),
            "native-aperture": lambda o: setattr(o.surfaces[1], "aperture", build.optiland_api().RadialAperture(100)),
            "image-policy": lambda o: o.surfaces[4].interaction_model.step.update(interaction="block"),
            "missing-policy": lambda o: setattr(
                o.surfaces[1], "interaction_model", o.surfaces[1].interaction_model.paraxial_native
            ),
        }
        for name, fault in faults.items():
            with self.subTest(name=name):

                def wrong(optic, stated, line, indices, np):
                    install(optic, stated, line, indices, np)
                    fault(optic)

                with mock.patch.object(build, "install_folded", wrong), self.assertRaises(BuildMismatch):
                    build_case(case)

    def test_native_curved_normals_are_reoriented_only_for_the_incident_side_policy(self):
        case = read_fixture("valid", "optical-case", "folded-spherical-mirror.json")
        case["system"]["opticalPath"][1].update(incidentSide="front", inactiveSide="block")
        api = build.optiland_api()
        optic = build_case(case).optics[0]._lvrtc_path_optic
        traced, _ = trace_rays(optic, api.np.array([[0.0, 5.0, -10.0]]), api.np.array([[0.0, 0.0, 1.0]]))
        self.assertEqual(int(traced.status[0]), 0)
        self.assertLess(float(traced.exit_direction[0, 2]), 0)
        # Native StandardGeometry normals have negative z; the source/contract side normal has positive z.
        point = api.RealRays(
            x=api.np.array([0.0]),
            y=api.np.array([5.0]),
            z=api.np.array([0.0]),
            L=api.np.array([0.0]),
            M=api.np.array([0.0]),
            N=api.np.array([1.0]),
            intensity=api.np.array([1.0]),
            wavelength=api.np.array([0.55]),
        )
        self.assertLess(float(optic.surfaces[2].geometry.surface_normal(point)[2][0]), 0)
