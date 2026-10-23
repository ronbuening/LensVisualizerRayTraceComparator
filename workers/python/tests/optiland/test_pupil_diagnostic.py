"""Stage 4.2's diagnostic and the affine assumption of the real optiland frequency calibrator."""
from __future__ import annotations
import types
import unittest
from unittest import mock
from diagnostics.z50f12 import summary, fft_pupil
from .support import real_optiland_missing, read_fixture


class SummaryTest(unittest.TestCase):
    def test_a_clipped_mask_has_its_own_extents_and_no_pitch_across_a_gap(self):
        self.assertEqual(summary(2, [(0, -2., -.25), (2, -1., -.125), (6, 1., .25)]),
                         {"lit": 3, "stopY": [-2., 1.], "cosineY": [-.25, .25],
                          "pitchMinMaxMedian": [.125, .125, .125]})


@unittest.skipIf(real_optiland_missing(), real_optiland_missing() or "")
class CalibrationTest(unittest.TestCase):
    def test_the_real_calibrator_uses_unlit_rim_directions_and_keeps_the_same_bandwidth_on_doubling(self):
        # Synthetic pupil-to-cosine map u_y=.1*p_y+.05*p_y^3. The lit pupil is clipped to |p_y|<=1/2.
        # There is no one physical pitch: the central derivative is .1, the full-rim secant .15.
        # Call optiland's actual calibration function, without copying its implementation.
        from optiland.mtf import ScalarFFTMTF
        import numpy as np
        def trace(*args, **kw):
            px, py = kw['Px'], kw['Py']
            l, m = .1*px, .1*py+.05*py**3
            return types.SimpleNamespace(L=l, M=m, N=np.sqrt(1-l*l-m*m), i=(abs(py)<=.5).astype(float))
        optic = types.SimpleNamespace(trace_generic=trace, image_surface=types.SimpleNamespace(
            geometry=types.SimpleNamespace(cs=types.SimpleNamespace(localize=lambda rays: None),
                                           surface_normal=lambda rays: (np.zeros(5), np.zeros(5), np.ones(5))),
            material_post=types.SimpleNamespace(n=lambda wl: 1.)))
        for n in (128, 256, 512):
            analysis = types.SimpleNamespace(optic=optic, resolved_wavelength=.5, num_rays=n)
            tang, sag = ScalarFFTMTF._get_mtf_frequency_steps(analysis, (0., 1.))
            self.assertAlmostEqual(float(tang)*(n-1), 600., delta=1e-10)  # 2*.15 / .0005
            self.assertAlmostEqual(float(sag)*(n-1), 400., delta=1e-10)
            self.assertGreater(float(tang)*(n-1), 400.)  # the central pitch is not selected by more rays

    def test_fft_pupil_diagnostic_reads_the_real_clipped_mask_and_halves_the_coordinate_step(self):
        case = read_fixture('valid', 'optical-case', 'double-gauss.json')
        coarse, fine = fft_pupil(case, 14., 32), fft_pupil(case, 14., 64)
        self.assertEqual(coarse['stopStep'], 2/31)
        self.assertEqual(fine['stopStep'], 2/63)
        axis = [-1.+2*i/31 for i in range(32)]
        full_disc = sum(x*x+y*y <= 1. for x in axis for y in axis)
        self.assertLess(coarse['lit'], full_disc, 'a clipped mask is smaller than the actual sampled disc')
        self.assertGreater(fine['lit'], 3*coarse['lit'])
        self.assertLess(fine['pitchMinMaxMedian'][2], .6*coarse['pitchMinMaxMedian'][2])

    def test_fft_pupil_readback_refuses_each_deliberately_changed_analysis_setting(self):
        from optiland.psf.fft import ScalarFFTPSF
        from lvrtc_optiland.build import BuildMismatch
        case = read_fixture('valid', 'optical-case', 'double-gauss.json')
        faults = {
            'rays': lambda p: setattr(p, 'num_rays', 17),
            'grid': lambda p: setattr(p, 'grid_size', 33),
            'tilt': lambda p: setattr(p, 'remove_tilt', True),
            'optic': lambda p: setattr(p, 'optic', object()),
            'field': lambda p: setattr(p, 'fields', [types.SimpleNamespace(coord=(0., .5))]),
            'wavelength': lambda p: setattr(p, 'wavelengths', [types.SimpleNamespace(value=.5)]),
            'strategy': lambda p: setattr(p, 'strategy', object()),
            'distribution': lambda p: setattr(p.distribution, 'x', p.distribution.x[::-1]),
        }
        for name, fault in faults.items():
            def broken(*args, **kwargs):
                psf = ScalarFFTPSF(*args, **kwargs)
                fault(psf)
                return psf
            with self.subTest(name=name), mock.patch('optiland.psf.fft.ScalarFFTPSF', side_effect=broken):
                with self.assertRaises(BuildMismatch):
                    fft_pupil(case, 14., 16)
