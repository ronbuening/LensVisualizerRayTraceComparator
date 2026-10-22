# Question: ScalarFFTMTF frequency calibration on a vignetted, non-affine pupil

Draft for the owner to file; **held by the owner on 2026-10-22, not filed.**
This asks about the method's supported domain, not an asserted implementation defect or a proposed replacement
frequency scale.

## Environment

- optiland `4e893f53aee1312f2d091680b93dd2279711e197`, stated `0.6.2.post117+g4e893f53`, source hash
  `279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38`. Checkout supplied dirty in
  `pyproject.toml` / `uv.lock`; Python sources unchanged.
- Python 3.14.8, numpy 2.3.5, scipy 1.16.3, numba 0.65.1; numpy backend, float64, JIT on.
- Comparator Stage 4.1 `8f930f3` plus Stage 4.2 diagnostics, Node 24.15.0, policy 12 unchanged.
- LensVisualizer `ab0fd4cf94836492b28470953812ed4afc98c0c6`, clean; engine closure
  `94778d3d4f0bc86fb092cbc7391f13f1b76780816257d30b074ea41a8c7a119b`.

## Reproduction with optiland alone

This needs only optiland and numpy. It hands `ScalarFFTMTF._get_mtf_frequency_steps` (the calibration whose
docstring in `optiland/mtf/fft.py` states that it "assumes approximately affine pupil-to-cosine mapping") a
stub optic whose pupil-to-cosine map is not affine and whose rim carries no light:

```python
# u_y(p_y) = 0.1 p_y + 0.05 p_y^3 (slope 0.1 at the centre, full-rim secant 0.15); u_x = 0.1 p_x;
# light only where |p_y| <= 0.5; image index 1; wavelength 0.5 um.
import types
import numpy as np
from optiland.mtf import ScalarFFTMTF

def trace_generic(*field, Px, Py, wavelength):
    L, M = 0.1 * Px, 0.1 * Py + 0.05 * Py**3
    return types.SimpleNamespace(L=L, M=M, N=np.sqrt(1 - L * L - M * M), i=(abs(Py) <= 0.5).astype(float))

image = types.SimpleNamespace(
    geometry=types.SimpleNamespace(
        cs=types.SimpleNamespace(localize=lambda rays: None),
        surface_normal=lambda rays: (np.zeros(5), np.zeros(5), np.ones(5)),
    ),
    material_post=types.SimpleNamespace(n=lambda wavelength: 1.0),
)
optic = types.SimpleNamespace(trace_generic=trace_generic, image_surface=image)
for n in (128, 256, 512):
    stub = types.SimpleNamespace(optic=optic, resolved_wavelength=0.5, num_rays=n)
    tang, sag = ScalarFFTMTF._get_mtf_frequency_steps(stub, (0.0, 1.0))
    print(n, float(tang) * (n - 1), float(sag) * (n - 1))
```

**Observed**: `(N-1) * step` is 600 cycles/mm tangential and 400 sagittal at N = 128, 256 and 512
(to the last digit or two): the tangential bandwidth is the secant through the two unlit rim rays,
2 x 0.15 / 0.0005. **Expected under the documented assumption**: one bandwidth fits every lag only when the
map is affine; here the slope across the lit band `|p_y| <= 0.5` runs from 0.1 to 0.1375, which corresponds
to 400 to 550 cycles/mm, and no grid size moves the calibration into that range. This isolates the
assumption; it does not by itself show the size of an MTF error.

## Reproduction on a real lens (needs the comparator and LensVisualizer)

The case is identified **only by the LensVisualizer key `nikkor-z50f12`**. Its prescription is not included,
so this part is not runnable by optiland's maintainers as it stands, and the case is not shared: the standalone
reproduction above is the one offered (the owner's decision of 2026-10-22).
With the comparator and that read-only LV checkout available, its configured
optiland interpreter, and caches outside optiland, run this one-condition, one-field reproduction from the
comparator root:

```sh
INV=$(mktemp -d /tmp/lvrtc-z50-question.XXXXXX)
node --input-type=module - "$INV" <<'JS'
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const benchmark = JSON.parse(readFileSync('suites/benchmark.json', 'utf8'));
const source = benchmark.runs.find(r => r.name === 'nikkor-z50f12-best-ref');
if (!source) throw new Error('benchmark run missing');
writeFileSync(join(process.argv[2], 'minimal.json'), JSON.stringify({
  contract: '1.0', kind: 'suite', name: 'z50f12-minimal', defaults: benchmark.defaults,
  runs: [{ ...source, name: 'best-half',
    fields: { kind: 'image-height-fractions', values: [0.5] }, rungs: ['r6c'],
    sampling: { engines: {
      optiland: { fftRays: 512 }, wave: { bundleGrid: 128 },
      'optiland-wave': { wavefrontGrids: [256, 512] }
    } }
  }]
}));
JS
LVRTC_RUNS_DIR="$INV/runs" node bin/lvrtc.mjs run "$INV/minimal.json"
LVRTC_RUNS_DIR="$INV/runs" node bin/lvrtc.mjs compare z50f12-minimal
LVRTC_RUNS_DIR="$INV/runs" node bin/lvrtc.mjs report z50f12-minimal
```

The exported case remains under the temporary runs directory and must not be attached or committed.
The worker creates a verified fresh optic for each field and grid: robust aiming (50 iterations,
1e-10 mm), actual stop clip radius, angle field, `chief_ray`, no tilt removal, no vignetting factors,
`num_rays=256/512`, `grid_size=2*num_rays`. The same line, surfaces, indices, apertures and image plane
are used for all methods. The field angle is 11.923949406168223°, line 587.5618 nm, wide open, at LV's
best axial plane. Its chief landing agrees across methods to within 3.35e-11 mm.

For all three resolutions and both off-axis fields at both apertures/planes, follow the commands in
[the evidence note](../z50f12-investigation.md#identity-and-reproduction).

## Observed

Tangential MTF at half field, best axial plane:

| Method | Grid | 30 cycles/mm | 100 cycles/mm |
|---|---|---:|---:|
| LV sheared product | adaptive 64 | 0.751331 | 0.203097 |
| LV sheared fixed grid | 128 / 256 | 0.750618 / 0.750065 | 0.202506 / 0.202370 |
| Comparator OTF, LV traced rays | 128 / 256 | 0.750556 / 0.749936 | 0.202685 / 0.202284 |
| ScalarFFTMTF | 128 / 256 / 512 | 0.796120 / 0.796216 / 0.796080 | 0.303374 / 0.301839 / 0.301717 |
| Comparator OTF, optiland raw wavefront | 128 / 256 / 512 | 0.747284 / 0.747834 / 0.747479 | 0.205024 / 0.204600 / 0.204518 |

The fine best-focus half-field estimates pass their existing sampling checks. Fine FFT's maximum change over
both cuts is 0.001444; its T value at 100 moves only 0.000122. The roughly 0.10 difference persists.
The separate wide-open design-plane FFT field is still unconverged at 512, and full-field FFT raises; these
are not used to claim a settled method discrepancy. At f/8 the last T moves of all four methods are below
0.00046 over the sampled frequencies.

`_get_mtf_frequency_steps` uses the four rim rays irrespective of intensity. At this half field all four
have zero intensity; one continues through mathematical surfaces and lands 4.964223 mm from the chief ray
at best focus (4.990835 mm at the design plane).
The T frequency steps at 128/256/512 are 12.270777 / 6.111328 / 3.049684 cycles/mm: the same full-rim
bandwidth, 1558.3886945 cycles/mm, at every size. The FFT array is uniform on the stop; the transmitted
stop-to-image-cosine map is not affine. Doubling the grid reduces its discretization error but does not
change that assumption.

## Expected / question

**Expected**: an FFT MTF that has settled under grid doubling agrees, within its sampling, with an MTF of
the same optic's own `Wavefront.get_data` taken by pupil autocorrelation in image-space direction cosines.
**Observed**: at T 100 cycles/mm they differ by 0.097 (0.301717 against 0.204518), while each moves by
less than 0.0002 on its last doubling; two estimates on LensVisualizer's independently traced rays sit
within 0.003 of the wavefront one.

The method documents an approximately affine pupil-to-cosine mapping. Is this fast, strongly vignetted
case outside that supported approximation? Would a warning or documented validity diagnostic be appropriate
when the calibration rays are stopped and their secant differs from pitches across the lit pupil?

A clipped mask alone does not invalidate the full-stop pitch: an affine map still has that pitch in every
lit cell. We are **not** proposing scaling by the surviving pupil width, filtering the rim rays without a
replacement model, or asserting that the comparator's radial reference-sphere OTF is the exact answer.
The reference-sphere model and ray model retain a small difference of their own. The evidence supports a
method limitation, not a missing comparator transform or a proven optiland implementation defect.

## Where this is pinned

The optiland-only reproduction above is the comparator's test `CalibrationTest` in
`workers/python/tests/optiland/test_pupil_diagnostic.py`; a second test there measures the vignetted FFT
mask of a synthetic Double-Gauss fixture and its halved pitch. The full numerical evidence, flags and pupil
extents are in [docs/z50f12-investigation.md](../z50f12-investigation.md).
