"""Raw wavefront contracts, failures, read-back faults, and a sphere intersection in 60 digits."""
from __future__ import annotations
import copy
import math
import types
import unittest
from decimal import Decimal as D
from unittest import mock

from lvrtc_optiland import wavefront as wf
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.mtf import REQUEST_BUDGET_S, TimeBudgetExceeded
from lvrtc_worker_kit.ndarray import decode_ndarray
from lvrtc_worker_kit.validate import validate_wavefront_native
from .support import read_fixture, real_optiland_missing, make_case, surface, sphere
from .exact import exact_trace

CASE = read_fixture("valid", "optical-case", "double-gauss.json")
DATA = read_fixture("valid", "quantities/wavefront.native.data", "sphere-and-unavailable.json")
SPEC = {"line": 0, "fields": {"kind": "angles-deg", "values": [0, 10, 14]}, "grids": [4, 8]}


class RawTest(unittest.TestCase):
    def test_midpoints_strictly_inside_edge_and_row_major(self):
        for n in (4, 8, 128):
            x, y, inside = wf.grid_points(n)
            self.assertEqual(x[:n], [(2*c+1)/n-1 for c in range(n)])
            self.assertEqual(y[0], -1+1/n)
            self.assertTrue(all(x[i]*x[i]+y[i]*y[i] < 1 for i in inside))
            self.assertEqual(inside, sorted(inside))
            self.assertNotIn(-1, x)
            self.assertNotIn(1, x)

    def test_one_field_failure_is_a_row_and_later_fields_survive(self):
        def step(case, line, angle, n):
            if angle == 10: raise ValueError("a field failed")
            sample = copy.deepcopy(DATA["fields"][0]["samples"][0])
            return sample
        data = wf.answer_wavefront(SPEC, {}, CASE, step=step)
        self.assertEqual([f["status"] for f in data["fields"]], ["ok", "unavailable", "ok"])
        self.assertEqual(data["fields"][1]["reason"], "optiland-raised-ValueError")
        self.assertEqual(data["fields"][1]["samples"], [])
        for error in (BuildMismatch("fault"), MemoryError("memory"), ImportError("install")):
            with self.subTest(error=type(error).__name__), self.assertRaises(type(error)):
                wf.answer_wavefront(SPEC, {}, CASE, step=mock.Mock(side_effect=error))

    def test_request_budget_and_refusals(self):
        sample = DATA["fields"][0]["samples"][0]
        with self.assertRaises(TimeBudgetExceeded):
            wf.answer_wavefront(SPEC, {}, CASE, step=lambda *a: sample,
                                clock=mock.Mock(side_effect=[0, 0, REQUEST_BUDGET_S+1]))
        self.assertEqual(wf.read_request({**SPEC, "line": 2}, {}, CASE)[0]["item"], "line")
        fractions = {**SPEC, "fields": {"kind": "image-height-fractions", "values": [0, 1]}}
        self.assertEqual(wf.read_request(fractions, {}, CASE)[0]["item"], "fields.image-height-fractions")
        self.assertFalse(isinstance(wf.read_request(fractions, {"fieldAnglesDeg": [0, 14]}, CASE), list))
        self.assertTrue(validate_wavefront_native("spec", {**SPEC, "grids": [7]}))
        self.assertFalse(isinstance(wf.read_request({**SPEC, "line": 0.0}, {}, CASE), list))

    def test_validator_port_shapes_validity_and_missing_reasons(self):
        self.assertEqual(validate_wavefront_native("data", DATA), [])
        broken = copy.deepcopy(DATA)
        broken["fields"][1].pop("reason")
        self.assertEqual(validate_wavefront_native("data", broken)[0].path, "/fields/1")
        broken = copy.deepcopy(DATA)
        broken["fields"][0]["samples"][0]["gridSize"] = 6
        self.assertTrue(validate_wavefront_native("data", broken))

    def test_worker_dispatch_build_mismatch_budget_and_bad_spec(self):
        from lvrtc_optiland.engine import OptilandEngine
        from .test_mtf import IDENTITY
        engine = OptilandEngine(IDENTITY)
        request = {"contract": "1.0", "id": "d"*64, "caseId": CASE["id"], "quantity": "wavefront.native", "spec": SPEC}
        for error, code in ((BuildMismatch("read-back fault"), "build-mismatch"),
                            (TimeBudgetExceeded("too long"), "time-budget")):
            with mock.patch('lvrtc_optiland.engine.answer_wavefront', side_effect=error):
                result = engine.run(request, CASE)
            self.assertEqual(result['status'], 'error')
            self.assertEqual(result['error']['code'], code)
        for error in (MemoryError("memory"), ImportError("installation")):
            with mock.patch('lvrtc_optiland.engine.answer_wavefront', side_effect=error):
                with self.assertRaises(type(error)):
                    engine.run(request, CASE)
        bad = {**request, "spec": {**SPEC, "grids": [7]}}
        result = engine.run(bad, CASE)
        self.assertEqual(result['error']['code'], 'bad-spec')



@unittest.skipIf(real_optiland_missing(), real_optiland_missing() or "")
class RealWavefrontTest(unittest.TestCase):
    def test_get_data_is_raw_and_fresh_and_bad_field_is_a_row(self):
        from optiland.wavefront import Wavefront
        from lvrtc_optiland.build import optiland_api
        original = Wavefront.get_data
        seen, requested = [], []
        def get_data(analysis, field, wl):
            seen.append(analysis.optic)
            requested.append((field, wl))
            return original(analysis, field, wl)
        spec = {**SPEC, "fields": {"kind": "angles-deg", "values": [0, 14, 40]}}
        with mock.patch.object(Wavefront, "get_data", get_data):
            data = wf.answer_wavefront(spec, {}, CASE)
        self.assertEqual(validate_wavefront_native("data", data), [])
        self.assertEqual([f["status"] for f in data["fields"]], ["ok", "ok", "unavailable"])
        self.assertEqual(len({id(o) for o in seen}), 4)
        self.assertEqual([p[0] for p in requested], [(0., 0.), (0., 0.), (0., 1.), (0., 1.)])
        first = wf.wavefront_step(CASE, 0, 14., 8)
        self.assertEqual(first, data["fields"][1]["samples"][1])
        # get_data masks nonfinite coordinates to zero and intensity to zero; zero OPD is not validity.
        valid = decode_ndarray(first["valid"]).values()
        self.assertTrue(any(valid))
        self.assertTrue(any(v == 0 for v in valid))
        self.assertEqual(optiland_api().np.dtype('float64').itemsize, 8)

    def test_each_analysis_setting_is_read_back_with_the_mistake_made_on_purpose(self):
        from optiland.wavefront import Wavefront
        from lvrtc_optiland.mtf import mtf_api
        mtf_api()  # load subclasses before replacing their base class at the package export
        def attr(name, value):
            return lambda a: setattr(a, name, value)
        def strategy(name, value):
            return lambda a: setattr(a.strategy, name, value)
        def dist(side, axis):
            def change(a):
                d = getattr(a if side == 'analysis' else a.strategy, 'distribution')
                d = copy.copy(d)
                if side == 'strategy': a.strategy.distribution = d
                else: a.distribution = d
                setattr(d, axis, getattr(d, axis) + 0.125)
            return change
        def chief_plane(analysis):
            # Keep the sphere radius consistent, so only the explicit image-plane check can find this fault.
            analysis.strategy._chief_ray.z += 1.
            next(iter(analysis.data.values())).radius += 1.
        faults = {
            'optic': attr('optic', None), 'strategy optic': strategy('optic', None),
            'num_rays': lambda a: setattr(a, 'num_rays', a.num_rays+2),
            'fields': attr('fields', []), 'wavelengths': attr('wavelengths', []),
            'strategy': attr('strategy', types.SimpleNamespace()),
            'reference type': strategy('reference_type', 'plane'),
            'remove tilt': attr('remove_tilt', True), 'index': strategy('n_image', 1.125),
            'exit pupil': strategy('exit_pupil_point', (0., 0., 999.)),
            'analysis distribution x': dist('analysis', 'x'), 'analysis distribution y': dist('analysis', 'y'),
            'strategy distribution x': dist('strategy', 'x'), 'strategy distribution y': dist('strategy', 'y'),
            'data keys': lambda a: a.data.update({((1., 0.), 0.5): next(iter(a.data.values()))}),
            'get_data selection': lambda a: setattr(
                a, 'get_data', lambda *args: copy.copy(next(iter(a.data.values())))),
            'polarization E': lambda a: setattr(next(iter(a.data.values())), 'E_exits', []),
            'polarization matrix': lambda a: setattr(next(iter(a.data.values())), 'prt_matrix', []),
            'reference radius': lambda a: setattr(next(iter(a.data.values())), 'radius', 1.),
            'chief plane': chief_plane,
        }
        for name in ('pupil_x', 'pupil_y', 'pupil_z', 'opd', 'intensity'):
            faults['rows '+name] = lambda a, key=name: setattr(next(iter(a.data.values())), key, [])
        for name, mutate in faults.items():
            def wrong(*args, **kwargs):
                a = Wavefront(*args, **kwargs)
                mutate(a)
                return a
            with self.subTest(fault=name), mock.patch('optiland.wavefront.Wavefront', wrong):
                with self.assertRaises(BuildMismatch):
                    wf.wavefront_step(CASE, 0, 0., 8)

    def test_opd_sign_units_and_sphere_coordinates_from_an_exact_refracting_surface(self):
        # One sphere, n=3/2, R=30: image-side paraxial focal length nR/(n-1)=90;
        # the stop is that surface, so the exit pupil vertex is z=0. No number below is an engine expectation.
        case = make_case([surface(0, sphere(30), semi=3)], indices=[[1.5]], image_z=90., stop_radius=3.)
        sample = wf.wavefront_step(case, 0, 0., 8)
        ref = sample['reference']
        self.assertEqual(ref['sphereCenterMm'], [0., 0., 90.])
        for value in ref['exitPupilMm']: self.assertAlmostEqual(value, 0., delta=2e-13)
        self.assertAlmostEqual(ref['radiusMm'], 90., delta=2e-13)
        normalized = decode_ndarray(sample['normalizedPupil']).values()
        pupil, opd = decode_ndarray(sample['pupilMm']).values(), decode_ndarray(sample['opdWaves']).values()
        # The stop is curved; at field 0 its coordinate is the exact ray's x,y on the stop.
        cell = 3*8+5
        x, y = normalized[2*cell]*3, normalized[2*cell+1]*3
        ray = exact_trace(case, (x, y, -10.), (0., 0., 1.))
        chief = exact_trace(case, (0., 0., -10.), (0., 0., 1.))
        q, d = ray.image, ray.direction
        v = (q[0], q[1], q[2]-90)
        dot = sum(a*b for a,b in zip(v,d))
        # Intersection going backwards from image: |q-t d-C|^2=R^2, positive t.
        t = dot + (dot*dot - sum(a*a for a in v) + D(90)**2).sqrt()
        sphere_point = [q[i]-t*d[i] for i in range(3)]
        path_sphere = ray.path_image-D('1.5')*t
        chief_sphere = chief.path_image-D('1.5')*90
        wavelength = D(case['conditions']['lines'][0]['wavelengthNm'])*D('0.000001')
        expected = (chief_sphere-path_sphere)/wavelength
        self.assertAlmostEqual(opd[cell], float(expected), delta=2e-8)
        self.assertGreater(opd[cell], 0.)
        for i in range(3): self.assertAlmostEqual(pupil[3*cell+i], float(sphere_point[i]), delta=2e-11)

    def test_raw_wavefront_restores_oblique_infinite_launch_phase(self):
        from optiland.wavefront.strategy import ChiefRayStrategy
        from lvrtc_optiland.build import optiland_api
        from lvrtc_optiland.mtf import field_optic
        np = optiland_api().np
        strategy = object.__new__(ChiefRayStrategy)
        strategy.optic = field_optic(CASE, 0, 10.)
        launch = types.SimpleNamespace(x=np.array([0., .25]), y=np.array([0., .5]), z=np.zeros(2),
                                       L=np.zeros(2), M=np.full(2, .6), N=np.full(2, .8))
        rays = types.SimpleNamespace(_launch_state=launch)
        reference = types.SimpleNamespace(
            _launch_state=types.SimpleNamespace(x=np.zeros(1), y=np.zeros(1), z=np.zeros(1)))
        result = strategy._restore_launch_phase(rays, np.full(2, 5.), .5, reference)
        self.assertEqual(list(result), [5., 5.3])  # n_object d dot (origin - chief_origin), n_object=1

    def test_launch_read_back_faults(self):
        from lvrtc_optiland.build import optiland_api
        from lvrtc_optiland.mtf import field_optic
        api = optiland_api()
        optic = field_optic(CASE, 0, 10.)
        generator = optic.ray_tracer.ray_generator
        original = generator.generate_rays
        def wrong(*args, **kwargs):
            ray = original(*args, **kwargs)
            ray.L = api.np.ones_like(ray.L)
            return ray
        with mock.patch.object(generator, 'generate_rays', wrong), self.assertRaises(BuildMismatch):
            wf.verify_launch(optic, 10., api)
        # A generator that silently falls back to a different aimer is not the one requested.
        with mock.patch.object(generator, 'aimer', types.SimpleNamespace()):
            with mock.patch.object(generator, 'generate_rays', lambda *a: types.SimpleNamespace()):
                with self.assertRaises(BuildMismatch): wf.verify_launch(optic, 10., api)

    def test_get_data_zero_fills_a_nonfinite_sample_including_its_intensity(self):
        from lvrtc_optiland.build import optiland_api
        api = optiland_api()
        original = api.Optic.trace
        def broken(optic, *args, **kwargs):
            rays = original(optic, *args, **kwargs)
            rays.x[0] = math.nan
            return rays
        with mock.patch.object(api.Optic, 'trace', broken):
            sample = wf.wavefront_step(CASE, 0, 0., 8)
        _, _, inside = wf.grid_points(8)
        first = inside[0]
        self.assertEqual(decode_ndarray(sample['opdWaves']).values()[first], 0.)
        self.assertEqual(decode_ndarray(sample['pupilMm']).values()[3*first:3*first+3], [0., 0., 0.])
        self.assertEqual(decode_ndarray(sample['intensity']).values()[first], 0.)
        self.assertEqual(decode_ndarray(sample['valid']).values()[first], 0)

    def test_nonfinite_reference_is_an_unavailable_field_not_a_build_failure(self):
        from optiland.wavefront import Wavefront
        original = Wavefront.get_data
        def infinite(analysis, field, wavelength):
            data = original(analysis, field, wavelength)
            data.radius = math.inf
            return data
        with mock.patch.object(Wavefront, 'get_data', infinite):
            data = wf.answer_wavefront({"line": 0, "fields": {"kind": "angles-deg", "values": [0]},
                                        "grids": [8]}, {}, CASE)
        self.assertEqual(data['fields'][0]['status'], 'unavailable')
        self.assertEqual(data['fields'][0]['reason'], 'optiland-raised-ValueError')
