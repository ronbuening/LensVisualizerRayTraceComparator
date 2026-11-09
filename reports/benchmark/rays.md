# Baseline of benchmark: the ray checks

This file is the committed record of the ray checks of the suite benchmark, as its baseline holds them: for every
run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every
pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and
wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so
`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no
ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the
engines are still those of the baseline. How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | benchmark |
| Limits file | v24 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 184 engine files |
| optiland | optiland | 0.6.2.post117+g4e893f53 | backend numpy, checkout with uncommitted changes, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 534 source files |
| ref | Reference tracer | 1 | 13 source files |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 96 | 96 | lv – optiland | 96 Pass | 96 Pass |
| Built system — `built-system` | `system.describe` | 96 | 96 | lv – ref | 96 Pass | 96 Pass |
| Built system — `built-system` | `system.describe` | 96 | 96 | optiland – ref | 96 Pass | 96 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 96 | 96 | lv – optiland | 96 Pass | 96 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 96 | 96 | lv – ref | 96 Pass | 96 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 96 | 96 | optiland – ref | 96 Pass | 96 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 96 | 864 | lv – optiland | 96 Pass | 864 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 96 | 864 | lv – ref | 96 Pass | 864 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 96 | 864 | optiland – ref | 96 Pass | 864 Pass |
| Optical path — `optical-path` | `rays.trace` | 96 | 864 | lv – optiland | 96 Pass | 864 Pass |
| Optical path — `optical-path` | `rays.trace` | 96 | 864 | lv – ref | 96 Pass | 864 Pass |
| Optical path — `optical-path` | `rays.trace` | 96 | 864 | optiland – ref | 96 Pass | 864 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 96 | 288 | lv – optiland | 96 Pass | 288 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 96 | 288 | lv – ref | 96 Pass | 288 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 96 | 288 | optiland – ref | 96 Pass | 288 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 96 | 2880 | lv – optiland | 96 Pass | 2880 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 96 | 2880 | lv – ref | 96 Pass | 2880 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 96 | 2880 | optiland – ref | 96 Pass | 2880 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 96 | 624 | lv – optiland | 96 Pass | 624 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 96 | 624 | lv – ref | 96 Pass | 624 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 96 | 624 | optiland – ref | 96 Pass | 624 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 96 | 384 | lv – optiland | 96 Pass | 384 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 96 | 384 | lv – ref | 96 Pass | 384 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 96 | 384 | optiland – ref | 96 Pass | 384 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 96 | 576 | lv – optiland | 96 Pass | 576 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 96 | 576 | lv – ref | 96 Pass | 576 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 96 | 576 | optiland – ref | 96 Pass | 576 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 96 | 288 | lv – optiland | 96 Pass | 288 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 96 | 288 | lv – ref | 96 Pass | 288 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 96 | 288 | optiland – ref | 96 Pass | 288 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 96 answered |
| Built system — `built-system` | optiland | 96 answered |
| Built system — `built-system` | ref | 96 answered |
| First-order data — `first-order` | lv | 96 answered |
| First-order data — `first-order` | optiland | 96 answered |
| First-order data — `first-order` | ref | 96 answered |
| Ray trace — `ray-trace` | lv | 96 answered |
| Ray trace — `ray-trace` | optiland | 96 answered |
| Ray trace — `ray-trace` | ref | 96 answered |
| Optical path — `optical-path` | lv | 96 answered |
| Optical path — `optical-path` | optiland | 96 answered |
| Optical path — `optical-path` | ref | 96 answered |
| Geometric MTF of the same rays — `geometric-mtf` | lv | 96 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 96 answered |
| Geometric MTF of the same rays — `geometric-mtf` | ref | 96 answered |
| Spot and fan rays — `spot-rays` | lv | 96 answered |
| Spot and fan rays — `spot-rays` | optiland | 96 answered |
| Spot and fan rays — `spot-rays` | ref | 96 answered |
| Spherical aberration and axial colour rays — `axial-rays` | lv | 96 answered |
| Spherical aberration and axial colour rays — `axial-rays` | optiland | 96 answered |
| Spherical aberration and axial colour rays — `axial-rays` | ref | 96 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | lv | 96 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | optiland | 96 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | ref | 96 answered |
| Field-curve rays — `field-curve-rays` | lv | 96 answered |
| Field-curve rays — `field-curve-rays` | optiland | 96 answered |
| Field-curve rays — `field-curve-rays` | ref | 96 answered |
| Vignetting rays — `vignetting-rays` | lv | 96 answered |
| Vignetting rays — `vignetting-rays` | optiland | 96 answered |
| Vignetting rays — `vignetting-rays` | ref | 96 answered |

## Built system — `built-system`

Compares: Built layout, shape, aperture, index and sampled sag. Kind: held to a limit. Quantity asked of the engines: the system as built (`system.describe`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.94e-16 | nikon-z-24-70f4s-wide-ref | sample 6, surface 10 |
| lv – optiland | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.55e-15 | sony-fe-400mm-f28-gm-oss-ref | sample 8, surface 13 |
| lv – ref | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.97e-16 | sony-fe-20mm-f18-g-ref | sample 8, surface 6 |
| lv – ref | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.55e-15 | sigma-35mm-f14-dg-hsm-a-ref | sample 8, surface 0 |
| optiland – ref | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 4.51e-16 | sony-fe-20mm-f18-g-ref | sample 6, surface 0 |
| optiland – ref | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 2.66e-15 | sigma-35mm-f14-dg-hsm-a-ref | sample 8, surface 13 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikkor-z50f12-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| sony-fe-20mm-f18-g-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| nikon-z-24-70f4s-wide-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-mc-105f28-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| canon-ef-135-f2l-usm-best-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-best-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikkor-z50f12-best-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-best-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-best-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-best-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| sony-fe-20mm-f18-g-best-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-best-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| nikon-z-24-70f4s-wide-best-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-best-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-best-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-best-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-mc-105f28-best-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-best-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-best-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-best-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-best-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-best-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |

## First-order data — `first-order`

Compares: First-order quantities and pupils. Kind: held to a limit. Quantity asked of the engines: first-order data (`paraxial.first-order`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 3.87e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity frontFocalZ |
| lv – optiland | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 7.96e-13 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 7.96e-13 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 4.97e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – optiland | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 4.97e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – ref | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.05e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity frontFocalZ |
| lv – ref | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 3.91e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 2, quantity exitPupilSemiDiameter |
| lv – ref | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 3.91e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 2, quantity exitPupilSemiDiameter |
| optiland – ref | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 3.87e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 0, quantity frontFocalZ |
| optiland – ref | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 4.26e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |
| optiland – ref | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 4.26e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-photopic | 1 | Pass: firstOrder.maxAbs 2.42e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| nikkor-z50f12-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-photopic | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-400mm-f28-gm-oss-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | Pass: firstOrder.maxAbs 3.87e-12 mm | Pass: firstOrder.maxAbs 2.05e-12 mm | Pass: firstOrder.maxAbs 3.87e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-wide-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-photopic | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-tele-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-photopic | 1 | Pass: firstOrder.maxAbs 2.38e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-mc-105f28-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-photopic | 1 | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-135f18-plena-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | Pass: firstOrder.maxAbs 8.17e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| canon-ef-135-f2l-usm-best-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-best-photopic | 1 | Pass: firstOrder.maxAbs 2.42e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f8-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-photopic | 1 | Pass: firstOrder.maxAbs 2.42e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 2.42e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikkor-z50f12-best-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-best-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f8-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f8-best-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-best-photopic | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f8-photopic | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 1.95e-14 mm |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | Pass: firstOrder.maxAbs 3.87e-12 mm | Pass: firstOrder.maxAbs 2.05e-12 mm | Pass: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | Pass: firstOrder.maxAbs 3.87e-12 mm | Pass: firstOrder.maxAbs 2.05e-12 mm | Pass: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 3.87e-12 mm | Pass: firstOrder.maxAbs 2.05e-12 mm | Pass: firstOrder.maxAbs 3.87e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-wide-best-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-best-photopic | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-tele-best-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-best-photopic | 1 | Pass: firstOrder.maxAbs 2.38e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-tele-f8-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | Pass: firstOrder.maxAbs 2.38e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 2.38e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-mc-105f28-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-best-photopic | 1 | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f8-photopic | 1 | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-135f18-plena-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-best-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f8-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | Pass: firstOrder.maxAbs 8.17e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | Pass: firstOrder.maxAbs 8.17e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 8.17e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.17e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1 deg, line 4, ray 803, surface 20 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 2.03e-14 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1 deg, line 0, ray 239 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 7.69e-13 | sigma-45mm-f28-dg-dn-contemporary-best-photopic | field 2.56e1 deg, line 2, ray 779 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 809500 | — | — |
| lv – ref | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.10e-12 | nikkor-z50f12-photopic | field 0 deg, line 1, ray 293, surface 31 |
| lv – ref | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 2.36e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 1, ray 173 |
| lv – ref | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 1.02e-12 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 1, ray 173 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 809500 | — | — |
| optiland – ref | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.16e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1 deg, line 2, ray 838, surface 20 |
| optiland – ref | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 2.47e-14 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1 deg, line 2, ray 265 |
| optiland – ref | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 1.03e-12 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 1, ray 173 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 809500 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | 2363 / 712 / 0 | 2363 / 712 / 0 | 2363 / 712 / 0 |
| canon-ef-135-f2l-usm-photopic | 15 | Pass: landing.maxDistance 1.91e-13 mm | Pass: landing.maxDistance 1.44e-13 mm | Pass: landing.maxDistance 1.74e-13 mm | 11817 / 3558 / 0 | 11817 / 3558 / 0 | 11817 / 3558 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: landing.maxDistance 1.06e-13 mm | Pass: landing.maxDistance 6.75e-14 mm | Pass: landing.maxDistance 1.04e-13 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | Pass: landing.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 8.55e-14 mm | Pass: landing.maxDistance 1.13e-13 mm | 13387 / 1988 / 0 | 13387 / 1988 / 0 | 13387 / 1988 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: landing.maxDistance 2.39e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2439 / 636 / 0 | 2439 / 636 / 0 | 2439 / 636 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | Pass: landing.maxDistance 5.58e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 12189 / 3186 / 0 | 12189 / 3186 / 0 | 12189 / 3186 / 0 |
| nikkor-z50f12-ref | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2381 / 694 / 0 | 2381 / 694 / 0 | 2381 / 694 / 0 |
| nikkor-z50f12-photopic | 15 | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | 11891 / 3484 / 0 | 11891 / 3484 / 0 | 11891 / 3484 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | Pass: hits.maxDistance 5.31e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2845 / 230 / 0 | 2845 / 230 / 0 | 2845 / 230 / 0 |
| sony-fe-20mm-f18-g-photopic | 15 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 14251 / 1124 / 0 | 14251 / 1124 / 0 | 14251 / 1124 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: landing.maxDistance 2.68e-13 mm | Pass: landing.maxDistance 2.63e-13 mm | Pass: landing.maxDistance 3.35e-13 mm | 2495 / 580 / 0 | 2495 / 580 / 0 | 2495 / 580 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | Pass: landing.maxDistance 3.59e-13 mm | Pass: landing.maxDistance 3.17e-13 mm | Pass: landing.maxDistance 4.16e-13 mm | 12463 / 2912 / 0 | 12463 / 2912 / 0 | 12463 / 2912 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 1.73e-13 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | Pass: landing.maxDistance 1.89e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 2.40e-13 mm | 13073 / 2302 / 0 | 13073 / 2302 / 0 | 13073 / 2302 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-wide-photopic | 15 | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 14061 / 1314 / 0 | 14061 / 1314 / 0 | 14061 / 1314 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-tele-photopic | 15 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.88e-13 mm | 13043 / 2332 / 0 | 13043 / 2332 / 0 | 13043 / 2332 / 0 |
| nikon-z-mc-105f28-ref | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 7.74e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| nikon-z-mc-105f28-photopic | 15 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 11705 / 3670 / 0 | 11705 / 3670 / 0 | 11705 / 3670 / 0 |
| nikon-z-135f18-plena-ref | 3 | Pass: landing.maxDistance 1.69e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| nikon-z-135f18-plena-photopic | 15 | Pass: landing.maxDistance 2.22e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | 14373 / 1002 / 0 | 14373 / 1002 / 0 | 14373 / 1002 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: hits.maxDistance 8.67e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | Pass: hits.maxDistance 9.45e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 12237 / 3138 / 0 | 12237 / 3138 / 0 | 12237 / 3138 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 1.14e-13 mm | Pass: landing.maxDistance 1.31e-13 mm | 2363 / 712 / 0 | 2363 / 712 / 0 | 2363 / 712 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 15 | Pass: landing.maxDistance 1.88e-13 mm | Pass: landing.maxDistance 1.42e-13 mm | Pass: landing.maxDistance 1.72e-13 mm | 11817 / 3558 / 0 | 11817 / 3558 / 0 | 11817 / 3558 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: hits.maxDistance 9.18e-14 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: hits.maxDistance 1.11e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 15 | Pass: hits.maxDistance 1.23e-13 mm | Pass: landing.maxDistance 9.34e-14 mm | Pass: hits.maxDistance 1.64e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: hits.maxDistance 9.18e-14 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: hits.maxDistance 1.11e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | Pass: hits.maxDistance 1.23e-13 mm | Pass: landing.maxDistance 9.24e-14 mm | Pass: hits.maxDistance 1.64e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: landing.maxDistance 1.06e-13 mm | Pass: landing.maxDistance 6.76e-14 mm | Pass: landing.maxDistance 1.04e-13 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | Pass: landing.maxDistance 1.03e-13 mm | Pass: landing.maxDistance 8.55e-14 mm | Pass: landing.maxDistance 1.13e-13 mm | 13387 / 1988 / 0 | 13387 / 1988 / 0 | 13387 / 1988 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: landing.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 7.11e-14 mm | Pass: landing.maxDistance 9.96e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 9.24e-14 mm | Pass: hits.maxDistance 1.07e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: landing.maxDistance 1.03e-13 mm | Pass: landing.maxDistance 7.11e-14 mm | Pass: landing.maxDistance 9.60e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: hits.maxDistance 1.07e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: landing.maxDistance 2.39e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2439 / 636 / 0 | 2439 / 636 / 0 | 2439 / 636 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | Pass: landing.maxDistance 5.58e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 12189 / 3186 / 0 | 12189 / 3186 / 0 | 12189 / 3186 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: hits.maxDistance 1.30e-13 mm | Pass: hits.maxDistance 8.09e-13 mm | Pass: hits.maxDistance 8.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 8.44e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: landing.maxDistance 1.31e-13 mm | Pass: hits.maxDistance 8.09e-13 mm | Pass: hits.maxDistance 8.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 8.44e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikkor-z50f12-best-ref | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2381 / 694 / 0 | 2381 / 694 / 0 | 2381 / 694 / 0 |
| nikkor-z50f12-best-photopic | 15 | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | 11891 / 3484 / 0 | 11891 / 3484 / 0 | 11891 / 3484 / 0 |
| nikkor-z50f12-f8-ref | 3 | Pass: hits.maxDistance 8.53e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 15 | Pass: hits.maxDistance 8.81e-13 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | Pass: hits.maxDistance 8.53e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 15 | Pass: hits.maxDistance 8.81e-13 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: hits.maxDistance 5.31e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2845 / 230 / 0 | 2845 / 230 / 0 | 2845 / 230 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 15 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 14251 / 1124 / 0 | 14251 / 1124 / 0 | 14251 / 1124 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: landing.maxDistance 1.46e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 15 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: landing.maxDistance 1.49e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: landing.maxDistance 2.69e-13 mm | Pass: landing.maxDistance 2.65e-13 mm | Pass: landing.maxDistance 3.33e-13 mm | 2495 / 580 / 0 | 2495 / 580 / 0 | 2495 / 580 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | Pass: landing.maxDistance 3.55e-13 mm | Pass: landing.maxDistance 3.18e-13 mm | Pass: landing.maxDistance 4.12e-13 mm | 12463 / 2912 / 0 | 12463 / 2912 / 0 | 12463 / 2912 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: landing.maxDistance 3.34e-13 mm | Pass: landing.maxDistance 3.10e-13 mm | Pass: landing.maxDistance 3.16e-13 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | Pass: landing.maxDistance 3.80e-13 mm | Pass: landing.maxDistance 2.64e-13 mm | Pass: landing.maxDistance 3.82e-13 mm | 15337 / 38 / 0 | 15337 / 38 / 0 | 15337 / 38 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: landing.maxDistance 3.30e-13 mm | Pass: landing.maxDistance 3.07e-13 mm | Pass: landing.maxDistance 3.13e-13 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | Pass: landing.maxDistance 3.80e-13 mm | Pass: landing.maxDistance 2.61e-13 mm | Pass: landing.maxDistance 3.85e-13 mm | 15337 / 38 / 0 | 15337 / 38 / 0 | 15337 / 38 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 1.73e-13 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | Pass: landing.maxDistance 1.93e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 2.36e-13 mm | 13073 / 2302 / 0 | 13073 / 2302 / 0 | 13073 / 2302 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: landing.maxDistance 1.81e-13 mm | Pass: landing.maxDistance 1.36e-13 mm | Pass: landing.maxDistance 1.89e-13 mm | 2943 / 132 / 0 | 2943 / 132 / 0 | 2943 / 132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | Pass: landing.maxDistance 1.92e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 2.13e-13 mm | 14703 / 672 / 0 | 14703 / 672 / 0 | 14703 / 672 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: landing.maxDistance 1.81e-13 mm | Pass: landing.maxDistance 1.36e-13 mm | Pass: landing.maxDistance 1.93e-13 mm | 2943 / 132 / 0 | 2943 / 132 / 0 | 2943 / 132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | Pass: landing.maxDistance 1.92e-13 mm | Pass: landing.maxDistance 1.42e-13 mm | Pass: landing.maxDistance 2.06e-13 mm | 14703 / 672 / 0 | 14703 / 672 / 0 | 14703 / 672 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 15 | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 14061 / 1314 / 0 | 14061 / 1314 / 0 | 14061 / 1314 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: hits.maxDistance 9.10e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: hits.maxDistance 9.10e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 15 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.88e-13 mm | 13043 / 2332 / 0 | 13043 / 2332 / 0 | 13043 / 2332 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 7.74e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| nikon-z-mc-105f28-best-photopic | 15 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 11705 / 3670 / 0 | 11705 / 3670 / 0 | 11705 / 3670 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: hits.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 15 | Pass: hits.maxDistance 1.51e-13 mm | Pass: landing.maxDistance 1.49e-13 mm | Pass: landing.maxDistance 1.92e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: hits.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 1.42e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 15 | Pass: hits.maxDistance 1.51e-13 mm | Pass: landing.maxDistance 1.53e-13 mm | Pass: landing.maxDistance 1.92e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | Pass: landing.maxDistance 1.69e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| nikon-z-135f18-plena-best-photopic | 15 | Pass: landing.maxDistance 2.22e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | 14373 / 1002 / 0 | 14373 / 1002 / 0 | 14373 / 1002 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: landing.maxDistance 9.59e-14 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 15 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: landing.maxDistance 9.59e-14 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 15 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: hits.maxDistance 8.67e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | Pass: hits.maxDistance 9.45e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 12237 / 3138 / 0 | 12237 / 3138 / 0 | 12237 / 3138 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: landing.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | Pass: hits.maxDistance 8.17e-14 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 14371 / 1004 / 0 | 14371 / 1004 / 0 | 14371 / 1004 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: landing.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | Pass: landing.maxDistance 8.53e-14 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 14371 / 1004 / 0 | 14371 / 1004 / 0 | 14371 / 1004 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.18e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1 deg, line 1, ray 779 |
| lv – optiland | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.18e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1 deg, line 1, ray 779 |
| lv – optiland | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.21e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1 deg, line 1, ray 779 |
| lv – ref | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.66e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 1, ray 399 |
| lv – ref | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.66e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 1, ray 399 |
| lv – ref | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.42e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1 deg, line 1, ray 778 |
| optiland – ref | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 3.02e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 1, ray 399 |
| optiland – ref | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 3.02e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 1, ray 399 |
| optiland – ref | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.48e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1 deg, line 1, ray 745 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-photopic | 15 | Pass: opticalPath.maxAbs 3.63e-10 waves | Pass: opd.maxAbs 3.34e-10 waves | Pass: opd.maxAbs 3.34e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | Pass: opd.maxAbs 3.58e-10 waves | Pass: opd.maxAbs 2.23e-10 waves | Pass: opd.maxAbs 3.02e-10 waves |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | Pass: opd.maxAbs 3.94e-10 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.51e-9 waves |
| nikkor-z50f12-ref | 3 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-photopic | 15 | Pass: opticalPath.maxAbs 1.81e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 2.06e-9 waves |
| sony-fe-20mm-f18-g-ref | 3 | Pass: opticalPath.maxAbs 6.29e-10 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-photopic | 15 | Pass: opticalPathToImage.maxAbs 1.59e-9 waves | Pass: opticalPathToImage.maxAbs 2.40e-9 waves | Pass: opticalPathToImage.maxAbs 2.51e-9 waves |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | Pass: opd.maxAbs 1.94e-9 waves | Pass: opd.maxAbs 1.69e-9 waves | Pass: opd.maxAbs 1.69e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | Pass: opd.maxAbs 5.44e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.23e-10 waves |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-wide-photopic | 15 | Pass: opd.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 2.18e-9 waves | Pass: opticalPath.maxAbs 2.42e-9 waves |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-tele-photopic | 15 | Pass: opd.maxAbs 1.01e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-mc-105f28-ref | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-photopic | 15 | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.09e-9 waves |
| nikon-z-135f18-plena-ref | 3 | Pass: opticalPathToImage.maxAbs 4.35e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves |
| nikon-z-135f18-plena-photopic | 15 | Pass: opd.maxAbs 6.69e-10 waves | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opticalPathToImage.maxAbs 1.11e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: opd.maxAbs 1.72e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | Pass: opd.maxAbs 2.21e-9 waves | Pass: opd.maxAbs 1.72e-9 waves | Pass: opticalPath.maxAbs 2.15e-9 waves |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-best-photopic | 15 | Pass: opticalPath.maxAbs 3.63e-10 waves | Pass: opd.maxAbs 3.90e-10 waves | Pass: opd.maxAbs 3.34e-10 waves |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f8-photopic | 15 | Pass: opd.maxAbs 5.02e-10 waves | Pass: opd.maxAbs 3.34e-10 waves | Pass: opd.maxAbs 5.02e-10 waves |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | Pass: opd.maxAbs 4.46e-10 waves | Pass: opd.maxAbs 2.79e-10 waves | Pass: opd.maxAbs 3.90e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | Pass: opd.maxAbs 3.07e-10 waves | Pass: opd.maxAbs 1.86e-10 waves | Pass: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | Pass: opd.maxAbs 3.07e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | Pass: opd.maxAbs 3.02e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.02e-10 waves |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | Pass: opd.maxAbs 4.37e-10 waves | Pass: opd.maxAbs 1.51e-9 waves | Pass: opd.maxAbs 1.63e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.02e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | Pass: opd.maxAbs 1.09e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.23e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.11e-9 waves | Pass: opd.maxAbs 1.06e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | Pass: opd.maxAbs 1.14e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.23e-9 waves |
| nikkor-z50f12-best-ref | 3 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-best-photopic | 15 | Pass: opticalPath.maxAbs 1.81e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 2.06e-9 waves |
| nikkor-z50f12-f8-ref | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-photopic | 15 | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.94e-9 waves | Pass: opd.maxAbs 2.06e-9 waves |
| nikkor-z50f12-f8-best-ref | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-best-photopic | 15 | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.94e-9 waves |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: opticalPath.maxAbs 6.29e-10 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-best-photopic | 15 | Pass: opticalPathToImage.maxAbs 1.59e-9 waves | Pass: opticalPathToImage.maxAbs 2.36e-9 waves | Pass: opticalPathToImage.maxAbs 2.51e-9 waves |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves |
| sony-fe-20mm-f18-g-f8-photopic | 15 | Pass: opticalPathToImage.maxAbs 1.63e-9 waves | Pass: opticalPathToImage.maxAbs 1.94e-9 waves | Pass: opticalPathToImage.maxAbs 1.87e-9 waves |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | Pass: opticalPathToImage.maxAbs 1.58e-9 waves | Pass: opticalPathToImage.maxAbs 1.94e-9 waves | Pass: opticalPathToImage.maxAbs 1.87e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | Pass: opd.maxAbs 1.94e-9 waves | Pass: opd.maxAbs 1.78e-9 waves | Pass: opd.maxAbs 1.69e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | Pass: opd.maxAbs 1.94e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.43e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | Pass: opd.maxAbs 5.44e-10 waves | Pass: opd.maxAbs 5.44e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | Pass: opd.maxAbs 5.63e-10 waves | Pass: opd.maxAbs 4.23e-10 waves | Pass: opd.maxAbs 5.63e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 5.32e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | Pass: opd.maxAbs 5.13e-10 waves | Pass: opd.maxAbs 4.23e-10 waves | Pass: opd.maxAbs 4.61e-10 waves |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-wide-best-photopic | 15 | Pass: opd.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 2.18e-9 waves | Pass: opticalPath.maxAbs 2.42e-9 waves |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | Pass: opd.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 2.66e-9 waves | Pass: opticalPath.maxAbs 3.02e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | Pass: opd.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 2.66e-9 waves | Pass: opticalPath.maxAbs 3.02e-9 waves |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-tele-best-photopic | 15 | Pass: opd.maxAbs 1.01e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | Pass: opd.maxAbs 1.23e-9 waves | Pass: opd.maxAbs 1.75e-9 waves | Pass: opd.maxAbs 1.75e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | Pass: opd.maxAbs 1.23e-9 waves | Pass: opd.maxAbs 1.75e-9 waves | Pass: opd.maxAbs 1.75e-9 waves |
| nikon-z-mc-105f28-best-ref | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-best-photopic | 15 | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.03e-9 waves |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f8-photopic | 15 | Pass: opticalPathToImage.maxAbs 5.02e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 6.05e-10 waves |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f8-best-photopic | 15 | Pass: opticalPathToImage.maxAbs 5.02e-10 waves | Pass: opd.maxAbs 4.23e-10 waves | Pass: opd.maxAbs 6.05e-10 waves |
| nikon-z-135f18-plena-best-ref | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves |
| nikon-z-135f18-plena-best-photopic | 15 | Pass: opd.maxAbs 6.69e-10 waves | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opticalPathToImage.maxAbs 1.09e-9 waves |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-f8-photopic | 15 | Pass: opd.maxAbs 6.05e-10 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-f8-best-photopic | 15 | Pass: opd.maxAbs 7.26e-10 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: opd.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.62e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | Pass: opd.maxAbs 2.21e-9 waves | Pass: opd.maxAbs 1.72e-9 waves | Pass: opticalPathToImage.maxAbs 2.18e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.43e-9 waves | Pass: opd.maxAbs 1.48e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | Pass: opd.maxAbs 1.86e-10 waves | Pass: opticalPath.maxAbs 1.78e-9 waves | Pass: opd.maxAbs 1.81e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.43e-9 waves | Pass: opd.maxAbs 1.48e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | Pass: opd.maxAbs 1.81e-10 waves | Pass: opticalPath.maxAbs 1.78e-9 waves | Pass: opd.maxAbs 1.81e-9 waves |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.07e-11 | sigma-45mm-f28-dg-dn-contemporary-ref | cut tangential, field 2.56e1 deg, frequencyPerMm 86 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 809500 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 5 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.23e-11 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1.66e1 deg, frequencyPerMm 100 |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 809500 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Wavelengths compared — `lines.compared` | wavelengths | — | 5 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.18e-11 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 1.66e1 deg, frequencyPerMm 100 |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 809500 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Wavelengths compared — `lines.compared` | wavelengths | — | 5 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: mtf.maxAbs 5.93e-13 | Pass: mtf.maxAbs 1.72e-12 | Pass: mtf.maxAbs 1.52e-12 |
| canon-ef-135-f2l-usm-photopic | 3 | Pass: mtf.maxAbs 1.40e-12 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 8.69e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: mtf.maxAbs 2.22e-12 | Pass: mtf.maxAbs 7.44e-13 | Pass: mtf.maxAbs 1.62e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | Pass: mtf.maxAbs 5.96e-13 | Pass: mtf.maxAbs 5.59e-13 | Pass: mtf.maxAbs 1.04e-12 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: mtf.maxAbs 3.54e-12 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 4.24e-12 |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 2.32e-12 | Pass: mtf.maxAbs 2.34e-12 |
| nikkor-z50f12-ref | 3 | Pass: mtf.maxAbs 3.92e-12 | Pass: mtf.maxAbs 2.54e-12 | Pass: mtf.maxAbs 4.42e-12 |
| nikkor-z50f12-photopic | 3 | Pass: mtf.maxAbs 2.87e-12 | Pass: mtf.maxAbs 5.24e-12 | Pass: mtf.maxAbs 4.31e-12 |
| sony-fe-20mm-f18-g-ref | 3 | Pass: mtf.maxAbs 1.78e-12 | Pass: mtf.maxAbs 4.39e-12 | Pass: mtf.maxAbs 3.47e-12 |
| sony-fe-20mm-f18-g-photopic | 3 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 2.41e-12 | Pass: mtf.maxAbs 3.02e-12 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: mtf.maxAbs 7.18e-12 | Pass: mtf.maxAbs 3.14e-12 | Pass: mtf.maxAbs 6.26e-12 |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | Pass: mtf.maxAbs 3.61e-12 | Pass: mtf.maxAbs 2.86e-12 | Pass: mtf.maxAbs 6.18e-12 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 3.07e-12 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 3.19e-12 |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 1.05e-11 | Pass: mtf.maxAbs 1.13e-11 |
| nikon-z-24-70f4s-wide-photopic | 3 | Pass: mtf.maxAbs 2.77e-12 | Pass: mtf.maxAbs 7.21e-12 | Pass: mtf.maxAbs 7.09e-12 |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: mtf.maxAbs 1.23e-12 | Pass: mtf.maxAbs 1.23e-11 | Pass: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-tele-photopic | 3 | Pass: mtf.maxAbs 8.84e-13 | Pass: mtf.maxAbs 7.74e-12 | Pass: mtf.maxAbs 7.60e-12 |
| nikon-z-mc-105f28-ref | 3 | Pass: mtf.maxAbs 1.44e-12 | Pass: mtf.maxAbs 2.99e-12 | Pass: mtf.maxAbs 1.80e-12 |
| nikon-z-mc-105f28-photopic | 3 | Pass: mtf.maxAbs 5.27e-13 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 1.24e-12 |
| nikon-z-135f18-plena-ref | 3 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 1.96e-12 | Pass: mtf.maxAbs 2.73e-12 |
| nikon-z-135f18-plena-photopic | 3 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.15e-12 | Pass: mtf.maxAbs 2.36e-12 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: mtf.maxAbs 1.07e-11 | Pass: mtf.maxAbs 5.18e-12 | Pass: mtf.maxAbs 1.03e-11 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | Pass: mtf.maxAbs 6.43e-12 | Pass: mtf.maxAbs 2.53e-12 | Pass: mtf.maxAbs 6.95e-12 |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: mtf.maxAbs 6.35e-13 | Pass: mtf.maxAbs 1.67e-12 | Pass: mtf.maxAbs 1.68e-12 |
| canon-ef-135-f2l-usm-best-photopic | 3 | Pass: mtf.maxAbs 7.05e-13 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 1.25e-12 |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: mtf.maxAbs 6.04e-13 | Pass: mtf.maxAbs 5.28e-13 | Pass: mtf.maxAbs 6.36e-13 |
| canon-ef-135-f2l-usm-f8-photopic | 3 | Pass: mtf.maxAbs 3.06e-13 | Pass: mtf.maxAbs 3.97e-13 | Pass: mtf.maxAbs 5.93e-13 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: mtf.maxAbs 5.85e-13 | Pass: mtf.maxAbs 5.21e-13 | Pass: mtf.maxAbs 6.29e-13 |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | Pass: mtf.maxAbs 2.65e-13 | Pass: mtf.maxAbs 4.27e-13 | Pass: mtf.maxAbs 5.86e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: mtf.maxAbs 7.94e-13 | Pass: mtf.maxAbs 6.78e-13 | Pass: mtf.maxAbs 1.09e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | Pass: mtf.maxAbs 4.49e-13 | Pass: mtf.maxAbs 5.14e-13 | Pass: mtf.maxAbs 6.61e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: mtf.maxAbs 4.36e-13 | Pass: mtf.maxAbs 3.76e-13 | Pass: mtf.maxAbs 6.08e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | Pass: mtf.maxAbs 3.40e-13 | Pass: mtf.maxAbs 2.87e-13 | Pass: mtf.maxAbs 5.21e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: mtf.maxAbs 6.28e-13 | Pass: mtf.maxAbs 3.77e-13 | Pass: mtf.maxAbs 7.35e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | Pass: mtf.maxAbs 3.31e-13 | Pass: mtf.maxAbs 2.88e-13 | Pass: mtf.maxAbs 6.15e-13 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: mtf.maxAbs 3.77e-12 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 4.66e-12 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | Pass: mtf.maxAbs 2.31e-12 | Pass: mtf.maxAbs 2.68e-12 | Pass: mtf.maxAbs 3.05e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: mtf.maxAbs 2.53e-13 | Pass: mtf.maxAbs 3.09e-12 | Pass: mtf.maxAbs 3.34e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | Pass: mtf.maxAbs 2.04e-13 | Pass: mtf.maxAbs 3.98e-13 | Pass: mtf.maxAbs 3.52e-13 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: mtf.maxAbs 2.30e-13 | Pass: mtf.maxAbs 3.03e-12 | Pass: mtf.maxAbs 3.26e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | Pass: mtf.maxAbs 2.17e-13 | Pass: mtf.maxAbs 9.49e-13 | Pass: mtf.maxAbs 1.06e-12 |
| nikkor-z50f12-best-ref | 3 | Pass: mtf.maxAbs 6.22e-12 | Pass: mtf.maxAbs 5.64e-12 | Pass: mtf.maxAbs 6.97e-12 |
| nikkor-z50f12-best-photopic | 3 | Pass: mtf.maxAbs 2.40e-12 | Pass: mtf.maxAbs 3.56e-12 | Pass: mtf.maxAbs 3.95e-12 |
| nikkor-z50f12-f8-ref | 3 | Pass: mtf.maxAbs 1.62e-12 | Pass: mtf.maxAbs 7.07e-13 | Pass: mtf.maxAbs 1.56e-12 |
| nikkor-z50f12-f8-photopic | 3 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 7.50e-13 | Pass: mtf.maxAbs 6.92e-13 |
| nikkor-z50f12-f8-best-ref | 3 | Pass: mtf.maxAbs 1.57e-12 | Pass: mtf.maxAbs 6.94e-13 | Pass: mtf.maxAbs 1.47e-12 |
| nikkor-z50f12-f8-best-photopic | 3 | Pass: mtf.maxAbs 1.43e-12 | Pass: mtf.maxAbs 6.48e-13 | Pass: mtf.maxAbs 7.97e-13 |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: mtf.maxAbs 2.12e-12 | Pass: mtf.maxAbs 4.56e-12 | Pass: mtf.maxAbs 3.66e-12 |
| sony-fe-20mm-f18-g-best-photopic | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 3.71e-12 | Pass: mtf.maxAbs 3.54e-12 |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: mtf.maxAbs 7.20e-13 | Pass: mtf.maxAbs 2.97e-12 | Pass: mtf.maxAbs 2.55e-12 |
| sony-fe-20mm-f18-g-f8-photopic | 3 | Pass: mtf.maxAbs 8.40e-13 | Pass: mtf.maxAbs 2.40e-12 | Pass: mtf.maxAbs 2.42e-12 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: mtf.maxAbs 6.66e-13 | Pass: mtf.maxAbs 2.96e-12 | Pass: mtf.maxAbs 2.57e-12 |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | Pass: mtf.maxAbs 8.68e-13 | Pass: mtf.maxAbs 2.60e-12 | Pass: mtf.maxAbs 2.61e-12 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: mtf.maxAbs 2.58e-12 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 4.71e-12 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | Pass: mtf.maxAbs 1.22e-12 | Pass: mtf.maxAbs 1.74e-12 | Pass: mtf.maxAbs 1.63e-12 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: mtf.maxAbs 2.14e-12 | Pass: mtf.maxAbs 2.62e-12 | Pass: mtf.maxAbs 4.76e-12 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | Pass: mtf.maxAbs 3.16e-12 | Pass: mtf.maxAbs 2.76e-12 | Pass: mtf.maxAbs 4.67e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: mtf.maxAbs 7.73e-13 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 1.87e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | Pass: mtf.maxAbs 8.33e-13 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 1.18e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: mtf.maxAbs 1.53e-12 | Pass: mtf.maxAbs 2.44e-12 | Pass: mtf.maxAbs 3.97e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 2.14e-12 | Pass: mtf.maxAbs 3.51e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: mtf.maxAbs 2.57e-12 | Pass: mtf.maxAbs 1.58e-12 | Pass: mtf.maxAbs 3.35e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 1.51e-12 | Pass: mtf.maxAbs 2.52e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: mtf.maxAbs 2.53e-12 | Pass: mtf.maxAbs 1.51e-12 | Pass: mtf.maxAbs 3.42e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 1.50e-12 | Pass: mtf.maxAbs 2.63e-12 |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: mtf.maxAbs 2.20e-12 | Pass: mtf.maxAbs 1.13e-11 | Pass: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-wide-best-photopic | 3 | Pass: mtf.maxAbs 2.75e-12 | Pass: mtf.maxAbs 9.46e-12 | Pass: mtf.maxAbs 9.47e-12 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: mtf.maxAbs 5.96e-13 | Pass: mtf.maxAbs 6.54e-12 | Pass: mtf.maxAbs 6.46e-12 |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | Pass: mtf.maxAbs 7.25e-13 | Pass: mtf.maxAbs 3.92e-12 | Pass: mtf.maxAbs 3.91e-12 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: mtf.maxAbs 5.47e-13 | Pass: mtf.maxAbs 1.18e-11 | Pass: mtf.maxAbs 1.15e-11 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | Pass: mtf.maxAbs 6.24e-13 | Pass: mtf.maxAbs 4.54e-12 | Pass: mtf.maxAbs 4.30e-12 |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: mtf.maxAbs 9.15e-13 | Pass: mtf.maxAbs 1.19e-11 | Pass: mtf.maxAbs 1.18e-11 |
| nikon-z-24-70f4s-tele-best-photopic | 3 | Pass: mtf.maxAbs 8.29e-13 | Pass: mtf.maxAbs 7.92e-12 | Pass: mtf.maxAbs 7.80e-12 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: mtf.maxAbs 3.13e-13 | Pass: mtf.maxAbs 6.62e-12 | Pass: mtf.maxAbs 6.57e-12 |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | Pass: mtf.maxAbs 3.95e-13 | Pass: mtf.maxAbs 8.65e-12 | Pass: mtf.maxAbs 8.39e-12 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: mtf.maxAbs 7.95e-13 | Pass: mtf.maxAbs 9.12e-12 | Pass: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | Pass: mtf.maxAbs 5.08e-13 | Pass: mtf.maxAbs 3.46e-12 | Pass: mtf.maxAbs 2.95e-12 |
| nikon-z-mc-105f28-best-ref | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.16e-12 |
| nikon-z-mc-105f28-best-photopic | 3 | Pass: mtf.maxAbs 3.74e-13 | Pass: mtf.maxAbs 8.69e-13 | Pass: mtf.maxAbs 7.17e-13 |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: mtf.maxAbs 1.05e-12 | Pass: mtf.maxAbs 6.47e-13 | Pass: mtf.maxAbs 5.71e-13 |
| nikon-z-mc-105f28-f8-photopic | 3 | Pass: mtf.maxAbs 3.38e-13 | Pass: mtf.maxAbs 5.03e-13 | Pass: mtf.maxAbs 5.66e-13 |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: mtf.maxAbs 9.20e-13 | Pass: mtf.maxAbs 5.83e-13 | Pass: mtf.maxAbs 5.03e-13 |
| nikon-z-mc-105f28-f8-best-photopic | 3 | Pass: mtf.maxAbs 2.88e-13 | Pass: mtf.maxAbs 4.43e-13 | Pass: mtf.maxAbs 5.18e-13 |
| nikon-z-135f18-plena-best-ref | 3 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 1.61e-12 | Pass: mtf.maxAbs 3.03e-12 |
| nikon-z-135f18-plena-best-photopic | 3 | Pass: mtf.maxAbs 1.68e-12 | Pass: mtf.maxAbs 9.13e-13 | Pass: mtf.maxAbs 2.39e-12 |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: mtf.maxAbs 4.28e-13 | Pass: mtf.maxAbs 6.13e-13 | Pass: mtf.maxAbs 8.76e-13 |
| nikon-z-135f18-plena-f8-photopic | 3 | Pass: mtf.maxAbs 1.40e-12 | Pass: mtf.maxAbs 5.57e-13 | Pass: mtf.maxAbs 1.47e-12 |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: mtf.maxAbs 4.84e-13 | Pass: mtf.maxAbs 6.20e-13 | Pass: mtf.maxAbs 9.40e-13 |
| nikon-z-135f18-plena-f8-best-photopic | 3 | Pass: mtf.maxAbs 1.41e-12 | Pass: mtf.maxAbs 5.61e-13 | Pass: mtf.maxAbs 1.46e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: mtf.maxAbs 1.00e-11 | Pass: mtf.maxAbs 4.56e-12 | Pass: mtf.maxAbs 1.01e-11 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | Pass: mtf.maxAbs 7.18e-12 | Pass: mtf.maxAbs 2.21e-12 | Pass: mtf.maxAbs 7.77e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: mtf.maxAbs 7.03e-13 | Pass: mtf.maxAbs 4.51e-12 | Pass: mtf.maxAbs 4.67e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | Pass: mtf.maxAbs 6.61e-13 | Pass: mtf.maxAbs 4.24e-12 | Pass: mtf.maxAbs 3.71e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: mtf.maxAbs 5.35e-13 | Pass: mtf.maxAbs 4.27e-12 | Pass: mtf.maxAbs 4.37e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | Pass: mtf.maxAbs 6.23e-13 | Pass: mtf.maxAbs 4.05e-12 | Pass: mtf.maxAbs 3.61e-12 |

## Spot and fan rays — `spot-rays`

Compares: Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 4.55e-13 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 1.92e1 deg, line 4, ray 263 |
| lv – optiland | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.02e-13 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | field 2.36e0 deg, line 1 |
| lv – optiland | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 5.39e-14 | sigma-45mm-f28-dg-dn-contemporary-best-ref | field 1.92e1 deg, line 0 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 531958 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.68e-13 | sony-fe-20mm-f18-g-best-ref | field 2.82e1 deg, line 0, ray 5 |
| lv – ref | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.46e-13 | sony-fe-20mm-f18-g-best-photopic | field 3.53e1 deg, line 4 |
| lv – ref | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 9.31e-14 | sony-fe-20mm-f18-g-photopic | field 2.82e1 deg, line 3 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 531958 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 7.55e-13 | sony-fe-20mm-f18-g-photopic | field 2.82e1 deg, line 3, ray 5 |
| optiland – ref | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.48e-13 | sony-fe-20mm-f18-g-best-photopic | field 3.53e1 deg, line 4 |
| optiland – ref | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 1.06e-13 | sony-fe-20mm-f18-g-ref | field 2.82e1 deg, line 0 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 531958 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 10 | Pass: transverseError.maxAbs 1.58e-13 mm | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 1.39e-13 mm | 1580 / 364 / 0 | 1580 / 364 / 0 | 1580 / 364 / 0 |
| canon-ef-135-f2l-usm-photopic | 50 | Pass: transverseError.maxAbs 1.67e-13 mm | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 1.68e-13 mm | 7910 / 1810 / 0 | 7910 / 1810 / 0 | 7910 / 1810 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 10 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 4.97e-14 mm | Pass: transverseError.maxAbs 6.66e-14 mm | 1854 / 90 / 0 | 1854 / 90 / 0 | 1854 / 90 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 50 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 7.28e-14 mm | Pass: transverseError.maxAbs 9.24e-14 mm | 9271 / 449 / 0 | 9271 / 449 / 0 | 9271 / 449 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 10 | Pass: transverseError.maxAbs 2.11e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | 1752 / 192 / 0 | 1752 / 192 / 0 | 1752 / 192 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 50 | Pass: transverseError.maxAbs 1.79e-13 mm | Pass: transverseError.maxAbs 2.36e-13 mm | Pass: transverseError.maxAbs 2.49e-13 mm | 8746 / 974 / 0 | 8746 / 974 / 0 | 8746 / 974 / 0 |
| nikkor-z50f12-ref | 10 | Pass: transverseError.maxAbs 2.96e-13 mm | Pass: transverseError.maxAbs 3.33e-13 mm | Pass: transverseError.maxAbs 2.60e-13 mm | 1667 / 277 / 0 | 1667 / 277 / 0 | 1667 / 277 / 0 |
| nikkor-z50f12-photopic | 50 | Pass: transverseError.maxAbs 3.63e-13 mm | Pass: transverseError.maxAbs 3.30e-13 mm | Pass: transverseError.maxAbs 3.05e-13 mm | 8335 / 1385 / 0 | 8335 / 1385 / 0 | 8335 / 1385 / 0 |
| sony-fe-20mm-f18-g-ref | 10 | Pass: transverseError.maxAbs 1.30e-13 mm | Pass: transverseError.maxAbs 6.66e-13 mm | Pass: transverseError.maxAbs 6.31e-13 mm | 1929 / 15 / 0 | 1929 / 15 / 0 | 1929 / 15 / 0 |
| sony-fe-20mm-f18-g-photopic | 50 | Pass: transverseError.maxAbs 1.83e-13 mm | Pass: transverseError.maxAbs 6.63e-13 mm | Pass: transverseError.maxAbs 7.55e-13 mm | 9644 / 76 / 0 | 9644 / 76 / 0 | 9644 / 76 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 10 | Pass: transverseError.maxAbs 2.95e-13 mm | Pass: transverseError.maxAbs 2.72e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 1708 / 236 / 0 | 1708 / 236 / 0 | 1708 / 236 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 50 | Pass: transverseError.maxAbs 3.43e-13 mm | Pass: transverseError.maxAbs 2.80e-13 mm | Pass: transverseError.maxAbs 3.44e-13 mm | 8536 / 1184 / 0 | 8536 / 1184 / 0 | 8536 / 1184 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 10 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 1.00e-13 mm | Pass: transverseError.maxAbs 1.65e-13 mm | 1771 / 173 / 0 | 1771 / 173 / 0 | 1771 / 173 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 50 | Pass: transverseError.maxAbs 1.46e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 1.81e-13 mm | 8857 / 863 / 0 | 8857 / 863 / 0 | 8857 / 863 / 0 |
| nikon-z-24-70f4s-wide-ref | 10 | Pass: transverseError.maxAbs 7.37e-14 mm | Pass: transverseError.maxAbs 3.07e-13 mm | Pass: transverseError.maxAbs 2.91e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-wide-photopic | 50 | Pass: transverseError.maxAbs 3.07e-13 mm | Pass: transverseError.maxAbs 3.75e-13 mm | Pass: transverseError.maxAbs 3.29e-13 mm | 9627 / 93 / 0 | 9627 / 93 / 0 | 9627 / 93 / 0 |
| nikon-z-24-70f4s-tele-ref | 10 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | Pass: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-tele-photopic | 50 | Pass: transverseError.maxAbs 1.67e-13 mm | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 4.07e-13 mm | 9176 / 544 / 0 | 9176 / 544 / 0 | 9176 / 544 / 0 |
| nikon-z-mc-105f28-ref | 10 | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 1.41e-13 mm | Pass: transverseError.maxAbs 1.34e-13 mm | 1614 / 330 / 0 | 1614 / 330 / 0 | 1614 / 330 / 0 |
| nikon-z-mc-105f28-photopic | 50 | Pass: transverseError.maxAbs 1.95e-13 mm | Pass: transverseError.maxAbs 1.93e-13 mm | Pass: transverseError.maxAbs 1.73e-13 mm | 8066 / 1654 / 0 | 8066 / 1654 / 0 | 8066 / 1654 / 0 |
| nikon-z-135f18-plena-ref | 10 | Pass: transverseError.maxAbs 1.51e-13 mm | Pass: transverseError.maxAbs 9.77e-14 mm | Pass: transverseError.maxAbs 1.50e-13 mm | 1935 / 9 / 0 | 1935 / 9 / 0 | 1935 / 9 / 0 |
| nikon-z-135f18-plena-photopic | 50 | Pass: transverseError.maxAbs 2.03e-13 mm | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 1.56e-13 mm | 9669 / 51 / 0 | 9669 / 51 / 0 | 9669 / 51 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 10 | Pass: transverseError.maxAbs 4.03e-13 mm | Pass: transverseError.maxAbs 5.72e-13 mm | Pass: transverseError.maxAbs 4.12e-13 mm | 1696 / 248 / 0 | 1696 / 248 / 0 | 1696 / 248 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 50 | Pass: transverseError.maxAbs 4.55e-13 mm | Pass: transverseError.maxAbs 6.11e-13 mm | Pass: transverseError.maxAbs 3.85e-13 mm | 8482 / 1238 / 0 | 8482 / 1238 / 0 | 8482 / 1238 / 0 |
| canon-ef-135-f2l-usm-best-ref | 10 | Pass: transverseError.maxAbs 1.58e-13 mm | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 1.37e-13 mm | 1580 / 364 / 0 | 1580 / 364 / 0 | 1580 / 364 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 50 | Pass: transverseError.maxAbs 1.65e-13 mm | Pass: transverseError.maxAbs 1.01e-13 mm | Pass: transverseError.maxAbs 1.71e-13 mm | 7910 / 1810 / 0 | 7910 / 1810 / 0 | 7910 / 1810 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 10 | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 50 | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.03e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 10 | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 50 | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.03e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 10 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 4.97e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | 1854 / 90 / 0 | 1854 / 90 / 0 | 1854 / 90 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 50 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 6.93e-14 mm | Pass: transverseError.maxAbs 9.24e-14 mm | 9271 / 449 / 0 | 9271 / 449 / 0 | 9271 / 449 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 50 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 6.39e-14 mm | Pass: transverseError.maxAbs 9.24e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 50 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | Pass: transverseError.maxAbs 9.24e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 10 | Pass: transverseError.maxAbs 2.11e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 2.08e-13 mm | 1752 / 192 / 0 | 1752 / 192 / 0 | 1752 / 192 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 50 | Pass: transverseError.maxAbs 1.78e-13 mm | Pass: transverseError.maxAbs 2.33e-13 mm | Pass: transverseError.maxAbs 2.47e-13 mm | 8746 / 974 / 0 | 8746 / 974 / 0 | 8746 / 974 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 10 | Pass: transverseError.maxAbs 8.70e-14 mm | Pass: transverseError.maxAbs 2.42e-13 mm | Pass: transverseError.maxAbs 2.56e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 50 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 2.49e-13 mm | Pass: transverseError.maxAbs 2.56e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 10 | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.56e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 50 | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 2.49e-13 mm | Pass: transverseError.maxAbs 2.58e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| nikkor-z50f12-best-ref | 10 | Pass: transverseError.maxAbs 2.96e-13 mm | Pass: transverseError.maxAbs 3.33e-13 mm | Pass: transverseError.maxAbs 2.59e-13 mm | 1667 / 277 / 0 | 1667 / 277 / 0 | 1667 / 277 / 0 |
| nikkor-z50f12-best-photopic | 50 | Pass: transverseError.maxAbs 3.62e-13 mm | Pass: transverseError.maxAbs 3.30e-13 mm | Pass: transverseError.maxAbs 3.05e-13 mm | 8335 / 1385 / 0 | 8335 / 1385 / 0 | 8335 / 1385 / 0 |
| nikkor-z50f12-f8-ref | 10 | Pass: transverseError.maxAbs 1.19e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 50 | Pass: transverseError.maxAbs 1.46e-13 mm | Pass: transverseError.maxAbs 1.05e-13 mm | Pass: transverseError.maxAbs 1.30e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikkor-z50f12-f8-best-ref | 10 | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 50 | Pass: transverseError.maxAbs 1.47e-13 mm | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sony-fe-20mm-f18-g-best-ref | 10 | Pass: transverseError.maxAbs 1.30e-13 mm | Pass: transverseError.maxAbs 6.68e-13 mm | Pass: transverseError.maxAbs 6.32e-13 mm | 1929 / 15 / 0 | 1929 / 15 / 0 | 1929 / 15 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 50 | Pass: transverseError.maxAbs 1.83e-13 mm | Pass: transverseError.maxAbs 6.61e-13 mm | Pass: transverseError.maxAbs 7.53e-13 mm | 9644 / 76 / 0 | 9644 / 76 / 0 | 9644 / 76 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 10 | Pass: transverseError.maxAbs 6.93e-14 mm | Pass: transverseError.maxAbs 2.52e-13 mm | Pass: transverseError.maxAbs 2.68e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 50 | Pass: transverseError.maxAbs 2.59e-13 mm | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 3.22e-13 mm | 9708 / 12 / 0 | 9708 / 12 / 0 | 9708 / 12 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 2.52e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 50 | Pass: transverseError.maxAbs 2.58e-13 mm | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 3.22e-13 mm | 9708 / 12 / 0 | 9708 / 12 / 0 | 9708 / 12 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 10 | Pass: transverseError.maxAbs 2.91e-13 mm | Pass: transverseError.maxAbs 2.74e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | 1708 / 236 / 0 | 1708 / 236 / 0 | 1708 / 236 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 50 | Pass: transverseError.maxAbs 3.43e-13 mm | Pass: transverseError.maxAbs 2.80e-13 mm | Pass: transverseError.maxAbs 3.44e-13 mm | 8536 / 1184 / 0 | 8536 / 1184 / 0 | 8536 / 1184 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 10 | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 1.67e-13 mm | Pass: transverseError.maxAbs 2.10e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 50 | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 10 | Pass: transverseError.maxAbs 2.49e-13 mm | Pass: transverseError.maxAbs 1.71e-13 mm | Pass: transverseError.maxAbs 2.13e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 50 | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 2.03e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 10 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 1.00e-13 mm | Pass: transverseError.maxAbs 1.65e-13 mm | 1771 / 173 / 0 | 1771 / 173 / 0 | 1771 / 173 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 50 | Pass: transverseError.maxAbs 1.42e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 1.82e-13 mm | 8857 / 863 / 0 | 8857 / 863 / 0 | 8857 / 863 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 10 | Pass: transverseError.maxAbs 1.87e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.62e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 50 | Pass: transverseError.maxAbs 1.60e-13 mm | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 10 | Pass: transverseError.maxAbs 1.88e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.63e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 50 | Pass: transverseError.maxAbs 1.63e-13 mm | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 1.99e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 10 | Pass: transverseError.maxAbs 7.28e-14 mm | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 2.90e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 50 | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 3.75e-13 mm | Pass: transverseError.maxAbs 3.29e-13 mm | 9627 / 93 / 0 | 9627 / 93 / 0 | 9627 / 93 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 2.82e-13 mm | Pass: transverseError.maxAbs 2.75e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 50 | Pass: transverseError.maxAbs 3.55e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | Pass: transverseError.maxAbs 3.46e-13 mm | 9687 / 33 / 0 | 9687 / 33 / 0 | 9687 / 33 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 2.82e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 50 | Pass: transverseError.maxAbs 3.55e-13 mm | Pass: transverseError.maxAbs 3.75e-13 mm | Pass: transverseError.maxAbs 3.46e-13 mm | 9687 / 33 / 0 | 9687 / 33 / 0 | 9687 / 33 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 10 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | Pass: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 50 | Pass: transverseError.maxAbs 1.69e-13 mm | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 4.07e-13 mm | 9176 / 544 / 0 | 9176 / 544 / 0 | 9176 / 544 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 50 | Pass: transverseError.maxAbs 2.13e-13 mm | Pass: transverseError.maxAbs 4.07e-13 mm | Pass: transverseError.maxAbs 4.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 50 | Pass: transverseError.maxAbs 2.15e-13 mm | Pass: transverseError.maxAbs 4.09e-13 mm | Pass: transverseError.maxAbs 4.30e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-best-ref | 10 | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 1.40e-13 mm | Pass: transverseError.maxAbs 1.34e-13 mm | 1614 / 330 / 0 | 1614 / 330 / 0 | 1614 / 330 / 0 |
| nikon-z-mc-105f28-best-photopic | 50 | Pass: transverseError.maxAbs 1.95e-13 mm | Pass: transverseError.maxAbs 1.94e-13 mm | Pass: transverseError.maxAbs 1.73e-13 mm | 8066 / 1654 / 0 | 8066 / 1654 / 0 | 8066 / 1654 / 0 |
| nikon-z-mc-105f28-f8-ref | 10 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 1.31e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 50 | Pass: transverseError.maxAbs 1.31e-13 mm | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 1.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 10 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 1.39e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 50 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 1.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-135f18-plena-best-ref | 10 | Pass: transverseError.maxAbs 1.49e-13 mm | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 1.50e-13 mm | 1935 / 9 / 0 | 1935 / 9 / 0 | 1935 / 9 / 0 |
| nikon-z-135f18-plena-best-photopic | 50 | Pass: transverseError.maxAbs 2.03e-13 mm | Pass: transverseError.maxAbs 1.26e-13 mm | Pass: transverseError.maxAbs 1.60e-13 mm | 9669 / 51 / 0 | 9669 / 51 / 0 | 9669 / 51 / 0 |
| nikon-z-135f18-plena-f8-ref | 10 | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 7.11e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 50 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 1.17e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 10 | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 50 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 1.10e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 10 | Pass: transverseError.maxAbs 4.05e-13 mm | Pass: transverseError.maxAbs 5.74e-13 mm | Pass: transverseError.maxAbs 4.12e-13 mm | 1696 / 248 / 0 | 1696 / 248 / 0 | 1696 / 248 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 50 | Pass: transverseError.maxAbs 4.55e-13 mm | Pass: transverseError.maxAbs 6.11e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | 8482 / 1238 / 0 | 8482 / 1238 / 0 | 8482 / 1238 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 10 | Pass: transverseError.maxAbs 4.80e-14 mm | Pass: transverseError.maxAbs 2.34e-13 mm | Pass: transverseError.maxAbs 2.26e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 50 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.59e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 10 | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 2.33e-13 mm | Pass: transverseError.maxAbs 2.24e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 50 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 2.47e-13 mm | Pass: transverseError.maxAbs 2.61e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |

## Spherical aberration and axial colour rays — `axial-rays`

Compares: Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.66e-13 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 3, ray 36 |
| lv – optiland | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 4.69e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 3, ray 36 |
| lv – optiland | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 8.77e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 3 |
| lv – optiland | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 6.25e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 3 |
| lv – optiland | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 6.39e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 3 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 16608 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.96e-13 | nikkor-z50f12-photopic | field 0 deg, line 1, ray 34 |
| lv – ref | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 4.60e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 3, ray 36 |
| lv – ref | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 7.47e-14 | nikon-z-24-70f4s-tele-f8-ref | field 0 deg, line 0 |
| lv – ref | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.42e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 4 |
| lv – ref | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 4.43e-14 | sony-fe-400mm-f28-gm-oss-ref | field 0 deg, line 0 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 16608 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 3.49e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 3, ray 42 |
| optiland – ref | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 4.75e-12 | nikon-z-24-70f4s-tele-photopic | field 0 deg, line 3, ray 16 |
| optiland – ref | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 1.20e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 3 |
| optiland – ref | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.34e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 0 |
| optiland – ref | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 1.02e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 3 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 16608 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: intercept.maxScaled 5.69e-14 mm | Pass: intercept.maxScaled 6.28e-14 mm | Pass: intercept.maxScaled 8.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 10 | Pass: intercept.maxScaled 1.74e-13 mm | Pass: intercept.maxScaled 7.05e-14 mm | Pass: intercept.maxScaled 1.07e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: intercept.maxScaled 2.49e-14 mm | Pass: intercept.maxScaled 2.11e-14 mm | Pass: intercept.maxScaled 3.40e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 10 | Pass: intercept.maxScaled 4.35e-14 mm | Pass: intercept.maxScaled 2.63e-14 mm | Pass: intercept.maxScaled 5.26e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: intercept.maxScaled 7.30e-14 mm | Pass: intercept.maxScaled 4.78e-14 mm | Pass: intercept.maxScaled 3.99e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 10 | Pass: intercept.maxScaled 1.53e-13 mm | Pass: intercept.maxScaled 5.74e-14 mm | Pass: intercept.maxScaled 1.32e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-ref | 3 | Pass: intercept.maxScaled 1.69e-13 mm | Pass: intercept.maxScaled 1.16e-13 mm | Pass: intercept.maxScaled 1.41e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-photopic | 10 | Pass: intercept.maxScaled 2.14e-13 mm | Pass: intercept.maxScaled 2.96e-13 mm | Pass: intercept.maxScaled 2.18e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | Pass: intercept.maxScaled 7.65e-14 mm | Pass: intercept.maxScaled 3.14e-14 mm | Pass: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 10 | Pass: intercept.maxScaled 6.98e-14 mm | Pass: intercept.maxScaled 4.01e-14 mm | Pass: intercept.maxScaled 6.42e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: intercept.maxScaled 1.68e-13 mm | Pass: intercept.maxScaled 1.51e-13 mm | Pass: intercept.maxScaled 1.94e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 10 | Pass: intercept.maxScaled 2.26e-13 mm | Pass: intercept.maxScaled 1.99e-13 mm | Pass: intercept.maxScaled 3.49e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 7.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 10 | Pass: intercept.maxScaled 9.41e-14 mm | Pass: intercept.maxScaled 5.87e-14 mm | Pass: intercept.maxScaled 9.48e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: intercept.maxScaled 2.89e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | Pass: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 10 | Pass: intercept.maxScaled 4.55e-14 mm | Pass: intercept.maxScaled 4.41e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: intercept.maxScaled 1.11e-13 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 10 | Pass: intercept.maxScaled 9.68e-14 mm | Pass: intercept.maxScaled 2.36e-13 mm | Pass: intercept.maxScaled 2.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-ref | 3 | Pass: intercept.maxScaled 5.61e-14 mm | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 8.36e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 10 | Pass: intercept.maxScaled 9.52e-14 mm | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 7.79e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-ref | 3 | Pass: intercept.maxScaled 6.94e-14 mm | Pass: intercept.maxScaled 5.97e-14 mm | Pass: intercept.maxScaled 8.32e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 10 | Pass: intercept.maxScaled 7.45e-14 mm | Pass: intercept.maxScaled 6.48e-14 mm | Pass: intercept.maxScaled 1.30e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: intercept.maxScaled 3.71e-14 mm | Pass: intercept.maxScaled 1.66e-13 mm | Pass: intercept.maxScaled 1.62e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 10 | Pass: intercept.maxScaled 2.87e-14 mm | Pass: intercept.maxScaled 1.63e-13 mm | Pass: intercept.maxScaled 1.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: intercept.maxScaled 5.69e-14 mm | Pass: intercept.maxScaled 6.28e-14 mm | Pass: intercept.maxScaled 8.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 10 | Pass: intercept.maxScaled 1.74e-13 mm | Pass: intercept.maxScaled 7.05e-14 mm | Pass: intercept.maxScaled 1.07e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: intercept.maxScaled 2.19e-14 mm | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.88e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 10 | Pass: intercept.maxScaled 3.13e-14 mm | Pass: intercept.maxScaled 1.96e-14 mm | Pass: intercept.maxScaled 2.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: intercept.maxScaled 2.19e-14 mm | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.88e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 10 | Pass: intercept.maxScaled 3.13e-14 mm | Pass: intercept.maxScaled 1.96e-14 mm | Pass: intercept.maxScaled 2.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: intercept.maxScaled 2.49e-14 mm | Pass: intercept.maxScaled 2.11e-14 mm | Pass: intercept.maxScaled 3.40e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 10 | Pass: intercept.maxScaled 4.35e-14 mm | Pass: intercept.maxScaled 2.63e-14 mm | Pass: intercept.maxScaled 5.26e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: intercept.maxScaled 1.99e-14 mm | Pass: intercept.maxScaled 8.54e-15 mm | Pass: intercept.maxScaled 1.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 10 | Pass: intercept.maxScaled 1.52e-14 mm | Pass: intercept.maxScaled 1.05e-14 mm | Pass: intercept.maxScaled 1.86e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: intercept.maxScaled 1.99e-14 mm | Pass: intercept.maxScaled 8.54e-15 mm | Pass: intercept.maxScaled 1.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 10 | Pass: intercept.maxScaled 1.52e-14 mm | Pass: intercept.maxScaled 1.05e-14 mm | Pass: intercept.maxScaled 1.86e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: intercept.maxScaled 7.30e-14 mm | Pass: intercept.maxScaled 4.78e-14 mm | Pass: intercept.maxScaled 3.99e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 10 | Pass: intercept.maxScaled 1.53e-13 mm | Pass: intercept.maxScaled 5.74e-14 mm | Pass: intercept.maxScaled 1.32e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: intercept.maxScaled 1.27e-14 mm | Pass: intercept.maxScaled 4.69e-15 mm | Pass: intercept.maxScaled 1.28e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 10 | Pass: intercept.maxScaled 1.73e-14 mm | Pass: intercept.maxScaled 8.26e-15 mm | Pass: intercept.maxScaled 1.92e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: intercept.maxScaled 1.27e-14 mm | Pass: intercept.maxScaled 4.69e-15 mm | Pass: intercept.maxScaled 1.28e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 10 | Pass: intercept.maxScaled 1.73e-14 mm | Pass: intercept.maxScaled 8.26e-15 mm | Pass: intercept.maxScaled 1.92e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-best-ref | 3 | Pass: intercept.maxScaled 1.69e-13 mm | Pass: intercept.maxScaled 1.16e-13 mm | Pass: intercept.maxScaled 1.41e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-best-photopic | 10 | Pass: intercept.maxScaled 2.14e-13 mm | Pass: intercept.maxScaled 2.96e-13 mm | Pass: intercept.maxScaled 2.18e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f8-ref | 3 | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.32e-14 mm | Pass: intercept.maxScaled 1.16e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 10 | Pass: intercept.maxScaled 1.57e-14 mm | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 1.72e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.32e-14 mm | Pass: intercept.maxScaled 1.16e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 10 | Pass: intercept.maxScaled 1.57e-14 mm | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 1.72e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: intercept.maxScaled 7.65e-14 mm | Pass: intercept.maxScaled 3.14e-14 mm | Pass: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 10 | Pass: intercept.maxScaled 6.98e-14 mm | Pass: intercept.maxScaled 4.01e-14 mm | Pass: intercept.maxScaled 6.42e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 4.97e-15 mm | Pass: intercept.maxScaled 7.11e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 10 | Pass: intercept.maxScaled 1.84e-14 mm | Pass: intercept.maxScaled 9.06e-15 mm | Pass: intercept.maxScaled 1.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 4.97e-15 mm | Pass: intercept.maxScaled 7.11e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 10 | Pass: intercept.maxScaled 1.84e-14 mm | Pass: intercept.maxScaled 9.06e-15 mm | Pass: intercept.maxScaled 1.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: intercept.maxScaled 1.68e-13 mm | Pass: intercept.maxScaled 1.51e-13 mm | Pass: intercept.maxScaled 1.94e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 10 | Pass: intercept.maxScaled 2.26e-13 mm | Pass: intercept.maxScaled 1.99e-13 mm | Pass: intercept.maxScaled 3.49e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 4.72e-14 mm | Pass: intercept.maxScaled 5.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 10 | Pass: intercept.maxScaled 7.27e-14 mm | Pass: intercept.maxScaled 6.61e-14 mm | Pass: intercept.maxScaled 6.07e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 4.72e-14 mm | Pass: intercept.maxScaled 5.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 10 | Pass: intercept.maxScaled 7.27e-14 mm | Pass: intercept.maxScaled 6.61e-14 mm | Pass: intercept.maxScaled 6.07e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 7.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 10 | Pass: intercept.maxScaled 9.41e-14 mm | Pass: intercept.maxScaled 5.87e-14 mm | Pass: intercept.maxScaled 9.48e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: intercept.maxScaled 2.06e-14 mm | Pass: intercept.maxScaled 1.81e-14 mm | Pass: intercept.maxScaled 2.24e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 10 | Pass: intercept.maxScaled 3.19e-14 mm | Pass: intercept.maxScaled 2.08e-14 mm | Pass: intercept.maxScaled 3.35e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: intercept.maxScaled 2.06e-14 mm | Pass: intercept.maxScaled 1.81e-14 mm | Pass: intercept.maxScaled 2.24e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 10 | Pass: intercept.maxScaled 3.19e-14 mm | Pass: intercept.maxScaled 2.08e-14 mm | Pass: intercept.maxScaled 3.35e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: intercept.maxScaled 2.89e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | Pass: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 10 | Pass: intercept.maxScaled 4.55e-14 mm | Pass: intercept.maxScaled 4.41e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 10 | Pass: intercept.maxScaled 1.94e-14 mm | Pass: intercept.maxScaled 7.85e-14 mm | Pass: intercept.maxScaled 8.10e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 10 | Pass: intercept.maxScaled 1.94e-14 mm | Pass: intercept.maxScaled 7.85e-14 mm | Pass: intercept.maxScaled 8.10e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: intercept.maxScaled 1.11e-13 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 10 | Pass: intercept.maxScaled 9.68e-14 mm | Pass: intercept.maxScaled 2.36e-13 mm | Pass: intercept.maxScaled 2.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: intercept.maxScaled 2.41e-14 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 10 | Pass: intercept.maxScaled 2.66e-13 mm | Pass: intercept.maxScaled 2.61e-13 mm | Pass: intercept.maxScaled 2.43e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: intercept.maxScaled 2.41e-14 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 10 | Pass: intercept.maxScaled 2.66e-13 mm | Pass: intercept.maxScaled 2.61e-13 mm | Pass: intercept.maxScaled 2.43e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | Pass: intercept.maxScaled 5.61e-14 mm | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 8.36e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 10 | Pass: intercept.maxScaled 9.52e-14 mm | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 7.79e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: intercept.maxScaled 3.21e-14 mm | Pass: intercept.maxScaled 1.65e-14 mm | Pass: intercept.maxScaled 2.19e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 10 | Pass: intercept.maxScaled 3.13e-14 mm | Pass: intercept.maxScaled 2.93e-14 mm | Pass: intercept.maxScaled 2.56e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: intercept.maxScaled 3.21e-14 mm | Pass: intercept.maxScaled 1.65e-14 mm | Pass: intercept.maxScaled 2.19e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 10 | Pass: intercept.maxScaled 3.13e-14 mm | Pass: intercept.maxScaled 2.93e-14 mm | Pass: intercept.maxScaled 2.56e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | Pass: intercept.maxScaled 6.94e-14 mm | Pass: intercept.maxScaled 5.97e-14 mm | Pass: intercept.maxScaled 8.32e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 10 | Pass: intercept.maxScaled 7.45e-14 mm | Pass: intercept.maxScaled 6.48e-14 mm | Pass: intercept.maxScaled 1.30e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: intercept.maxScaled 3.07e-14 mm | Pass: intercept.maxScaled 1.45e-14 mm | Pass: intercept.maxScaled 1.62e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 10 | Pass: intercept.maxScaled 2.19e-14 mm | Pass: intercept.maxScaled 1.55e-14 mm | Pass: intercept.maxScaled 2.24e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: intercept.maxScaled 3.07e-14 mm | Pass: intercept.maxScaled 1.45e-14 mm | Pass: intercept.maxScaled 1.62e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 10 | Pass: intercept.maxScaled 2.19e-14 mm | Pass: intercept.maxScaled 1.55e-14 mm | Pass: intercept.maxScaled 2.24e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: intercept.maxScaled 3.71e-14 mm | Pass: intercept.maxScaled 1.66e-13 mm | Pass: intercept.maxScaled 1.62e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 10 | Pass: intercept.maxScaled 2.87e-14 mm | Pass: intercept.maxScaled 1.63e-13 mm | Pass: intercept.maxScaled 1.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: intercept.maxScaled 1.06e-14 mm | Pass: intercept.maxScaled 3.63e-14 mm | Pass: intercept.maxScaled 4.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 10 | Pass: intercept.maxScaled 1.18e-14 mm | Pass: intercept.maxScaled 4.36e-14 mm | Pass: intercept.maxScaled 4.44e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: intercept.maxScaled 1.06e-14 mm | Pass: intercept.maxScaled 3.63e-14 mm | Pass: intercept.maxScaled 4.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 10 | Pass: intercept.maxScaled 1.18e-14 mm | Pass: intercept.maxScaled 4.36e-14 mm | Pass: intercept.maxScaled 4.44e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |

## Chief rays (distortion, pupils, lateral colour) — `chief-rays`

Compares: Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.88e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 1 |
| lv – optiland | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 2.88e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 1 |
| lv – optiland | Largest difference of distortion — `distortion.maxAbs` | percent | — | 1.48e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 1, ray 7 |
| lv – optiland | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 3.20e-13 | nikon-z-mc-105f28-ref | line 0, ray 30 |
| lv – optiland | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.31e-12 | nikon-z-mc-105f28-ref | line 0, ray 30 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 42912 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 2.56e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 2, ray 18 |
| lv – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.48e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| lv – ref | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.66e-13 | sony-fe-20mm-f18-g-f8-best-photopic | line 1, ray 17 |
| lv – ref | Largest difference of distortion — `distortion.maxAbs` | percent | — | 2.18e-12 | sigma-45mm-f28-dg-dn-contemporary-photopic | line 0, ray 7 |
| lv – ref | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 4.83e-13 | nikon-z-24-70f4s-wide-photopic | line 1, ray 8 |
| lv – ref | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.92e-12 | nikon-z-24-70f4s-wide-photopic | line 1, ray 8 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 42912 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 3.77e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| optiland – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.66e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| optiland – ref | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.86e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| optiland – ref | Largest difference of distortion — `distortion.maxAbs` | percent | — | 2.24e-12 | nikon-z-24-70f4s-wide-best-photopic | line 3, ray 11 |
| optiland – ref | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 4.82e-13 | nikon-z-24-70f4s-wide-photopic | line 3, ray 8 |
| optiland – ref | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.96e-12 | nikon-z-24-70f4s-wide-photopic | line 3, ray 8 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 42912 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 4.09e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 4 | Pass: exitPupil.maxScaled 1.22e-13 mm | Pass: lateralColour.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 4 | Pass: distortion.maxScaled 9.50e-14 mm | Pass: lateralColour.maxAbs 6.75e-14 mm | Pass: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 4 | Pass: distortion.maxScaled 1.14e-13 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | Pass: exitPupil.maxScaled 1.12e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-photopic | 4 | Pass: lateralColour.maxAbs 1.10e-13 mm | Pass: exitPupil.maxScaled 1.39e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 4 | Pass: lateralColour.maxAbs 1.46e-13 mm | Pass: lateralColour.maxAbs 3.73e-13 mm | Pass: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 4 | Pass: distortion.maxScaled 2.85e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 4 | Pass: distortion.maxScaled 1.88e-13 mm | Pass: lateralColour.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: exitPupil.maxScaled 4.83e-13 mm | Pass: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 4 | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 4 | Pass: exitPupil.maxScaled 2.92e-13 mm | Pass: distortion.maxScaled 1.40e-13 mm | Pass: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 4 | Pass: distortion.maxScaled 1.20e-13 mm | Pass: distortion.maxScaled 9.66e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 4 | Pass: distortion.maxScaled 5.29e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 4 | Pass: lateralColour.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 2.69e-13 mm | Pass: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-best-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 4 | Pass: exitPupil.maxScaled 1.22e-13 mm | Pass: lateralColour.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 4 | Pass: exitPupil.maxScaled 1.22e-13 mm | Pass: lateralColour.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 4 | Pass: exitPupil.maxScaled 1.22e-13 mm | Pass: lateralColour.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 4 | Pass: distortion.maxScaled 7.93e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 4 | Pass: distortion.maxScaled 9.50e-14 mm | Pass: lateralColour.maxAbs 6.75e-14 mm | Pass: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 4 | Pass: distortion.maxScaled 9.50e-14 mm | Pass: lateralColour.maxAbs 6.75e-14 mm | Pass: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 4 | Pass: distortion.maxScaled 7.93e-14 mm | Pass: distortion.maxScaled 5.14e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 4 | Pass: distortion.maxScaled 9.51e-14 mm | Pass: distortion.maxScaled 7.12e-14 mm | Pass: lateralColour.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 4 | Pass: distortion.maxScaled 1.38e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.49e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 4 | Pass: distortion.maxScaled 1.15e-13 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | Pass: exitPupil.maxScaled 1.12e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 4 | Pass: distortion.maxScaled 1.14e-13 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | Pass: exitPupil.maxScaled 1.12e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 4 | Pass: distortion.maxScaled 1.32e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 4 | Pass: distortion.maxScaled 1.18e-13 mm | Pass: exitPupil.maxScaled 1.13e-13 mm | Pass: exitPupil.maxScaled 1.12e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-best-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-best-photopic | 4 | Pass: lateralColour.maxAbs 1.10e-13 mm | Pass: exitPupil.maxScaled 1.39e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.10e-13 mm | Pass: exitPupil.maxScaled 1.39e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 4 | Pass: landing.maxAbs 1.07e-13 mm | Pass: distortion.maxScaled 1.40e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 4 | Pass: lateralColour.maxAbs 1.46e-13 mm | Pass: lateralColour.maxAbs 3.77e-13 mm | Pass: lateralColour.maxAbs 4.09e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.46e-13 mm | Pass: lateralColour.maxAbs 3.73e-13 mm | Pass: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.46e-13 mm | Pass: lateralColour.maxAbs 3.77e-13 mm | Pass: lateralColour.maxAbs 4.09e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 4 | Pass: distortion.maxScaled 1.56e-13 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 4 | Pass: distortion.maxScaled 2.88e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 4 | Pass: distortion.maxScaled 2.85e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 4 | Pass: distortion.maxScaled 2.85e-13 mm | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 4 | Pass: lateralColour.maxAbs 1.92e-13 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 4 | Pass: distortion.maxScaled 1.88e-13 mm | Pass: lateralColour.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.88e-13 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: exitPupil.maxScaled 4.83e-13 mm | Pass: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: exitPupil.maxScaled 4.83e-13 mm | Pass: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: exitPupil.maxScaled 4.83e-13 mm | Pass: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.03e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 4 | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: lateralColour.maxAbs 9.24e-14 mm | Pass: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 4 | Pass: exitPupil.maxScaled 2.92e-13 mm | Pass: distortion.maxScaled 1.46e-13 mm | Pass: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 4 | Pass: exitPupil.maxScaled 2.92e-13 mm | Pass: distortion.maxScaled 1.40e-13 mm | Pass: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 4 | Pass: exitPupil.maxScaled 2.92e-13 mm | Pass: distortion.maxScaled 1.46e-13 mm | Pass: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 4 | Pass: distortion.maxScaled 1.20e-13 mm | Pass: distortion.maxScaled 9.66e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 4 | Pass: distortion.maxScaled 1.20e-13 mm | Pass: distortion.maxScaled 9.66e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 4 | Pass: distortion.maxScaled 1.23e-13 mm | Pass: distortion.maxScaled 9.66e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 4 | Pass: distortion.maxScaled 4.93e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 4 | Pass: lateralColour.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 2.69e-13 mm | Pass: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 4 | Pass: distortion.maxScaled 5.29e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 4 | Pass: lateralColour.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 2.69e-13 mm | Pass: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 4 | Pass: distortion.maxScaled 4.67e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.69e-13 mm | Pass: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## Field-curve rays — `field-curve-rays`

Compares: Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.25e-13 | sony-fe-20mm-f18-g-photopic | line 4, ray 1592 |
| lv – optiland | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.19e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 69 |
| lv – optiland | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 4.43e-9 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 69 |
| lv – optiland | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 6.05e-14 | nikkor-z50f12-photopic | line 0, ray 308 |
| lv – optiland | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 1.74e-12 | sony-fe-400mm-f28-gm-oss-ref | line 0, ray 64 |
| lv – optiland | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 4.43e-9 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 69 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 500486 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 9792 | — | — |
| lv – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.85e-13 | sony-fe-20mm-f18-g-ref | line 0, ray 1688 |
| lv – ref | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.10e-13 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – ref | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 3.98e-9 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – ref | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.92e-14 | nikon-z-24-70f4s-wide-photopic | line 1, ray 1750 |
| lv – ref | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 1.47e-12 | nikon-z-24-70f4s-wide-f8-best-photopic | line 3, ray 4 |
| lv – ref | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 3.98e-9 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 500486 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Fields compared — `fields.compared` | elements | — | 9792 | — | — |
| optiland – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.85e-13 | sony-fe-20mm-f18-g-ref | line 0, ray 1491 |
| optiland – ref | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.33e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 79 |
| optiland – ref | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 4.87e-9 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 79 |
| optiland – ref | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.98e-14 | nikon-z-24-70f4s-wide-best-photopic | line 1, ray 1750 |
| optiland – ref | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 2.00e-12 | sony-fe-400mm-f28-gm-oss-ref | line 0, ray 64 |
| optiland – ref | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 4.87e-9 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 79 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 500486 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Fields compared — `fields.compared` | elements | — | 9792 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 1565 / 271 / 0 | 1565 / 271 / 0 | 1565 / 271 / 0 |
| canon-ef-135-f2l-usm-photopic | 10 | Pass: landing.maxAbs 1.97e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.76e-13 mm | 7795 / 1385 / 0 | 7795 / 1385 / 0 | 7795 / 1385 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 1733 / 103 / 0 | 1733 / 103 / 0 | 1733 / 103 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 10 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 9.59e-14 mm | 8566 / 614 / 0 | 8566 / 614 / 0 | 8566 / 614 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 2 | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | Pass: landing.maxAbs 2.77e-13 mm | 1665 / 171 / 0 | 1665 / 171 / 0 | 1665 / 171 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 10 | Pass: landing.maxAbs 1.90e-13 mm | Pass: landing.maxAbs 3.16e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | 8250 / 930 / 0 | 8250 / 930 / 0 | 8250 / 930 / 0 |
| nikkor-z50f12-ref | 2 | Pass: landing.maxAbs 3.51e-13 mm | Pass: landing.maxAbs 2.55e-13 mm | Pass: landing.maxAbs 3.53e-13 mm | 1617 / 219 / 0 | 1617 / 219 / 0 | 1617 / 219 / 0 |
| nikkor-z50f12-photopic | 10 | Pass: landing.maxAbs 4.32e-13 mm | Pass: landing.maxAbs 2.99e-13 mm | Pass: landing.maxAbs 3.64e-13 mm | 8017 / 1163 / 0 | 8017 / 1163 / 0 | 8017 / 1163 / 0 |
| sony-fe-20mm-f18-g-ref | 2 | Pass: landing.maxAbs 5.97e-13 mm | Pass: landing.maxAbs 7.85e-13 mm | Pass: landing.maxAbs 7.85e-13 mm | 1796 / 40 / 0 | 1796 / 40 / 0 | 1796 / 40 / 0 |
| sony-fe-20mm-f18-g-photopic | 10 | Pass: landing.maxAbs 7.25e-13 mm | Pass: landing.maxAbs 7.43e-13 mm | Pass: landing.maxAbs 7.35e-13 mm | 8820 / 360 / 0 | 8820 / 360 / 0 | 8820 / 360 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 2 | Pass: landing.maxAbs 3.34e-13 mm | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 3.03e-13 mm | 1635 / 201 / 0 | 1635 / 201 / 0 | 1635 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 10 | Pass: landing.maxAbs 3.55e-13 mm | Pass: landing.maxAbs 2.84e-13 mm | Pass: landing.maxAbs 3.59e-13 mm | 8100 / 1080 / 0 | 8100 / 1080 / 0 | 8100 / 1080 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 2 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 1684 / 152 / 0 | 1684 / 152 / 0 | 1684 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 10 | Pass: landing.maxAbs 2.13e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 2.17e-13 mm | 8334 / 846 / 0 | 8334 / 846 / 0 | 8334 / 846 / 0 |
| nikon-z-24-70f4s-wide-ref | 2 | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-wide-photopic | 10 | Pass: landing.maxAbs 6.39e-13 mm | Pass: landing.maxAbs 5.36e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | 8768 / 412 / 0 | 8768 / 412 / 0 | 8768 / 412 / 0 |
| nikon-z-24-70f4s-tele-ref | 2 | Pass: landing.maxAbs 1.40e-13 mm | Pass: landing.maxAbs 5.99e-13 mm | Pass: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-tele-photopic | 10 | Pass: landing.maxAbs 5.26e-13 mm | Pass: landing.maxAbs 6.63e-13 mm | Pass: landing.maxAbs 7.30e-13 mm | 8500 / 680 / 0 | 8500 / 680 / 0 | 8500 / 680 / 0 |
| nikon-z-mc-105f28-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.53e-13 mm | 1601 / 235 / 0 | 1601 / 235 / 0 | 1601 / 235 / 0 |
| nikon-z-mc-105f28-photopic | 10 | Pass: landing.maxAbs 1.48e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.55e-13 mm | 7927 / 1253 / 0 | 7927 / 1253 / 0 | 7927 / 1253 / 0 |
| nikon-z-135f18-plena-ref | 2 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | 1798 / 38 / 0 | 1798 / 38 / 0 | 1798 / 38 / 0 |
| nikon-z-135f18-plena-photopic | 10 | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | Pass: landing.maxAbs 1.83e-13 mm | 8877 / 303 / 0 | 8877 / 303 / 0 | 8877 / 303 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2 | Pass: landing.maxAbs 6.32e-13 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1616 / 220 / 0 | 1616 / 220 / 0 | 1616 / 220 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 10 | Pass: landing.maxAbs 6.82e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | Pass: landing.maxAbs 6.79e-13 mm | 8018 / 1162 / 0 | 8018 / 1162 / 0 | 8018 / 1162 / 0 |
| canon-ef-135-f2l-usm-best-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 1565 / 271 / 0 | 1565 / 271 / 0 | 1565 / 271 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 10 | Pass: landing.maxAbs 2.01e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.76e-13 mm | 7795 / 1385 / 0 | 7795 / 1385 / 0 | 7795 / 1385 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 2 | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 10 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 10 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 1733 / 103 / 0 | 1733 / 103 / 0 | 1733 / 103 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 10 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 8566 / 614 / 0 | 8566 / 614 / 0 | 8566 / 614 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 2 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 10 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 9.59e-14 mm | 9034 / 146 / 0 | 9034 / 146 / 0 | 9034 / 146 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 2 | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 10 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 9.59e-14 mm | 9034 / 146 / 0 | 9034 / 146 / 0 | 9034 / 146 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 2 | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | Pass: landing.maxAbs 2.77e-13 mm | 1665 / 171 / 0 | 1665 / 171 / 0 | 1665 / 171 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 10 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 3.13e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | 8250 / 930 / 0 | 8250 / 930 / 0 | 8250 / 930 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 2 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 10 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.45e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 9029 / 151 / 0 | 9029 / 151 / 0 | 9029 / 151 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 2 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 10 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.45e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 9029 / 151 / 0 | 9029 / 151 / 0 | 9029 / 151 / 0 |
| nikkor-z50f12-best-ref | 2 | Pass: landing.maxAbs 3.51e-13 mm | Pass: landing.maxAbs 2.55e-13 mm | Pass: landing.maxAbs 3.53e-13 mm | 1617 / 219 / 0 | 1617 / 219 / 0 | 1617 / 219 / 0 |
| nikkor-z50f12-best-photopic | 10 | Pass: landing.maxAbs 4.31e-13 mm | Pass: landing.maxAbs 2.99e-13 mm | Pass: landing.maxAbs 3.63e-13 mm | 8017 / 1163 / 0 | 8017 / 1163 / 0 | 8017 / 1163 / 0 |
| nikkor-z50f12-f8-ref | 2 | Pass: landing.maxAbs 2.24e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 10 | Pass: landing.maxAbs 2.91e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 9036 / 144 / 0 | 9036 / 144 / 0 | 9036 / 144 / 0 |
| nikkor-z50f12-f8-best-ref | 2 | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 10 | Pass: landing.maxAbs 2.91e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | 9036 / 144 / 0 | 9036 / 144 / 0 | 9036 / 144 / 0 |
| sony-fe-20mm-f18-g-best-ref | 2 | Pass: landing.maxAbs 5.90e-13 mm | Pass: landing.maxAbs 7.82e-13 mm | Pass: landing.maxAbs 7.82e-13 mm | 1796 / 40 / 0 | 1796 / 40 / 0 | 1796 / 40 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 10 | Pass: landing.maxAbs 7.25e-13 mm | Pass: landing.maxAbs 7.43e-13 mm | Pass: landing.maxAbs 7.32e-13 mm | 8820 / 360 / 0 | 8820 / 360 / 0 | 8820 / 360 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 3.55e-13 mm | Pass: landing.maxAbs 3.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 10 | Pass: landing.maxAbs 3.13e-13 mm | Pass: landing.maxAbs 3.69e-13 mm | Pass: landing.maxAbs 3.52e-13 mm | 8979 / 201 / 0 | 8979 / 201 / 0 | 8979 / 201 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 3.55e-13 mm | Pass: landing.maxAbs 3.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 10 | Pass: landing.maxAbs 3.16e-13 mm | Pass: landing.maxAbs 3.69e-13 mm | Pass: landing.maxAbs 3.48e-13 mm | 8979 / 201 / 0 | 8979 / 201 / 0 | 8979 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 2 | Pass: landing.maxAbs 3.35e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | Pass: landing.maxAbs 3.03e-13 mm | 1635 / 201 / 0 | 1635 / 201 / 0 | 1635 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 10 | Pass: landing.maxAbs 3.55e-13 mm | Pass: landing.maxAbs 2.88e-13 mm | Pass: landing.maxAbs 3.60e-13 mm | 8100 / 1080 / 0 | 8100 / 1080 / 0 | 8100 / 1080 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 2 | Pass: landing.maxAbs 3.27e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | Pass: landing.maxAbs 2.84e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 10 | Pass: landing.maxAbs 4.76e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | Pass: landing.maxAbs 4.44e-13 mm | 9025 / 155 / 0 | 9025 / 155 / 0 | 9025 / 155 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 2 | Pass: landing.maxAbs 3.27e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | Pass: landing.maxAbs 2.84e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 10 | Pass: landing.maxAbs 4.76e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | 9025 / 155 / 0 | 9025 / 155 / 0 | 9025 / 155 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 2 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1684 / 152 / 0 | 1684 / 152 / 0 | 1684 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 10 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 2.10e-13 mm | 8334 / 846 / 0 | 8334 / 846 / 0 | 8334 / 846 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 2 | Pass: landing.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1820 / 16 / 0 | 1820 / 16 / 0 | 1820 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 10 | Pass: landing.maxAbs 1.95e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 8961 / 219 / 0 | 8961 / 219 / 0 | 8961 / 219 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 2 | Pass: landing.maxAbs 1.42e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1820 / 16 / 0 | 1820 / 16 / 0 | 1820 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 10 | Pass: landing.maxAbs 1.95e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 8961 / 219 / 0 | 8961 / 219 / 0 | 8961 / 219 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 2 | Pass: landing.maxAbs 6.50e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 6.54e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 10 | Pass: landing.maxAbs 6.39e-13 mm | Pass: landing.maxAbs 5.33e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | 8768 / 412 / 0 | 8768 / 412 / 0 | 8768 / 412 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | Pass: landing.maxAbs 4.16e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 10 | Pass: landing.maxAbs 5.76e-13 mm | Pass: landing.maxAbs 5.54e-13 mm | Pass: landing.maxAbs 5.93e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 4.73e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 10 | Pass: landing.maxAbs 5.76e-13 mm | Pass: landing.maxAbs 5.51e-13 mm | Pass: landing.maxAbs 5.90e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 2 | Pass: landing.maxAbs 1.40e-13 mm | Pass: landing.maxAbs 5.99e-13 mm | Pass: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 10 | Pass: landing.maxAbs 5.26e-13 mm | Pass: landing.maxAbs 6.63e-13 mm | Pass: landing.maxAbs 7.30e-13 mm | 8500 / 680 / 0 | 8500 / 680 / 0 | 8500 / 680 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 2 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 10 | Pass: landing.maxAbs 3.87e-13 mm | Pass: landing.maxAbs 5.54e-13 mm | Pass: landing.maxAbs 5.97e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 2 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 10 | Pass: landing.maxAbs 3.87e-13 mm | Pass: landing.maxAbs 5.51e-13 mm | Pass: landing.maxAbs 5.97e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-mc-105f28-best-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 1601 / 235 / 0 | 1601 / 235 / 0 | 1601 / 235 / 0 |
| nikon-z-mc-105f28-best-photopic | 10 | Pass: landing.maxAbs 1.48e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.54e-13 mm | 7927 / 1253 / 0 | 7927 / 1253 / 0 | 7927 / 1253 / 0 |
| nikon-z-mc-105f28-f8-ref | 2 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 10 | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.67e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 2 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 10 | Pass: landing.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.71e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| nikon-z-135f18-plena-best-ref | 2 | Pass: landing.maxAbs 1.44e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 1.30e-13 mm | 1798 / 38 / 0 | 1798 / 38 / 0 | 1798 / 38 / 0 |
| nikon-z-135f18-plena-best-photopic | 10 | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.83e-13 mm | 8877 / 303 / 0 | 8877 / 303 / 0 | 8877 / 303 / 0 |
| nikon-z-135f18-plena-f8-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 10 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.35e-13 mm | 9043 / 137 / 0 | 9043 / 137 / 0 | 9043 / 137 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 10 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | 9043 / 137 / 0 | 9043 / 137 / 0 | 9043 / 137 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 2 | Pass: landing.maxAbs 6.32e-13 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1616 / 220 / 0 | 1616 / 220 / 0 | 1616 / 220 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 10 | Pass: landing.maxAbs 6.82e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | Pass: landing.maxAbs 6.75e-13 mm | 8018 / 1162 / 0 | 8018 / 1162 / 0 | 8018 / 1162 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 2 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 4.65e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | 1816 / 20 / 0 | 1816 / 20 / 0 | 1816 / 20 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 10 | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 4.58e-13 mm | Pass: landing.maxAbs 4.90e-13 mm | 8945 / 235 / 0 | 8945 / 235 / 0 | 8945 / 235 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 2 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 4.65e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | 1816 / 20 / 0 | 1816 / 20 / 0 | 1816 / 20 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 10 | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 4.55e-13 mm | Pass: landing.maxAbs 4.90e-13 mm | 8945 / 235 / 0 | 8945 / 235 / 0 | 8945 / 235 / 0 |

## Vignetting rays — `vignetting-rays`

Compares: Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 2.93e-14 | nikon-z-mc-105f28-f8-photopic | field 1.00e1 deg, line 3 |
| lv – optiland | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – optiland | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.88e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | field 3.15e0 deg, line 1, ray 2048 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 5364116 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 2784 | — | — |
| lv – ref | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 7.05e-14 | nikon-z-24-70f4s-wide-f8-photopic | field 2.02e1 deg, line 2 |
| lv – ref | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – ref | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.79e-13 | sigma-35mm-f14-dg-hsm-a-photopic | field 2.32e1 deg, line 2, ray 2048 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 5364116 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Fields compared — `fields.compared` | elements | — | 2784 | — | — |
| optiland – ref | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 7.17e-14 | nikon-z-24-70f4s-wide-f8-photopic | field 2.02e1 deg, line 2 |
| optiland – ref | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| optiland – ref | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| optiland – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.03e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 3.15e0 deg, line 3, ray 2048 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 5364116 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Fields compared — `fields.compared` | elements | — | 2784 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 5 | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | Pass: illumination.maxAbs 2.66e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 5 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 5 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.79e-13 mm | Pass: landing.maxAbs 2.01e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-ref | 1 | Pass: illumination.maxAbs 1.39e-14 | Pass: landing.maxAbs 5.33e-14 mm | Pass: illumination.maxAbs 1.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-photopic | 5 | Pass: illumination.maxAbs 1.49e-14 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | 10229 / 16 / 0 | 10229 / 16 / 0 | 10229 / 16 / 0 |
| sony-fe-20mm-f18-g-ref | 1 | Pass: illumination.maxAbs 6.83e-15 | Pass: illumination.maxAbs 2.39e-14 | Pass: illumination.maxAbs 2.52e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 5 | Pass: illumination.maxAbs 2.03e-14 | Pass: illumination.maxAbs 2.33e-14 | Pass: illumination.maxAbs 2.71e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 5 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 5 | Pass: landing.maxAbs 9.77e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikon-z-24-70f4s-wide-ref | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 5 | Pass: illumination.maxAbs 6.55e-15 | Pass: illumination.maxAbs 1.62e-14 | Pass: illumination.maxAbs 1.53e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-tele-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 5 | Pass: illumination.maxAbs 9.10e-15 | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.90e-14 | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| nikon-z-mc-105f28-ref | 1 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 5 | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-135f18-plena-ref | 1 | Pass: landing.maxAbs 2.13e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | Pass: landing.maxAbs 3.20e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 5 | Pass: illumination.maxAbs 4.44e-15 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | Pass: illumination.maxAbs 4.33e-15 | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 5 | Pass: illumination.maxAbs 6.00e-15 | Pass: landing.maxAbs 1.71e-13 mm | Pass: landing.maxAbs 1.95e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-best-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.55e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 5 | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 5 | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 5 | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | Pass: illumination.maxAbs 2.66e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 5 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | Pass: landing.maxAbs 1.78e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 5 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | Pass: landing.maxAbs 1.42e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 5 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 5 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.79e-13 mm | Pass: landing.maxAbs 2.01e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 5 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.79e-13 mm | Pass: landing.maxAbs 2.01e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 5 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-best-ref | 1 | Pass: illumination.maxAbs 1.39e-14 | Pass: landing.maxAbs 5.33e-14 mm | Pass: illumination.maxAbs 1.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-best-photopic | 5 | Pass: illumination.maxAbs 1.49e-14 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | 10229 / 16 / 0 | 10229 / 16 / 0 | 10229 / 16 / 0 |
| nikkor-z50f12-f8-ref | 1 | Pass: illumination.maxAbs 1.47e-14 | Pass: illumination.maxAbs 1.27e-14 | Pass: illumination.maxAbs 2.43e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 5 | Pass: illumination.maxAbs 1.18e-14 | Pass: illumination.maxAbs 1.23e-14 | Pass: illumination.maxAbs 2.14e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-f8-best-ref | 1 | Pass: illumination.maxAbs 1.47e-14 | Pass: illumination.maxAbs 1.27e-14 | Pass: illumination.maxAbs 2.43e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 5 | Pass: illumination.maxAbs 1.18e-14 | Pass: illumination.maxAbs 1.23e-14 | Pass: illumination.maxAbs 2.14e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-20mm-f18-g-best-ref | 1 | Pass: illumination.maxAbs 6.83e-15 | Pass: illumination.maxAbs 2.39e-14 | Pass: illumination.maxAbs 2.52e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 5 | Pass: illumination.maxAbs 2.03e-14 | Pass: illumination.maxAbs 2.33e-14 | Pass: illumination.maxAbs 2.71e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 1 | Pass: illumination.maxAbs 8.66e-15 | Pass: illumination.maxAbs 5.17e-14 | Pass: illumination.maxAbs 5.20e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 5 | Pass: illumination.maxAbs 6.94e-15 | Pass: illumination.maxAbs 5.62e-14 | Pass: illumination.maxAbs 5.70e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | Pass: illumination.maxAbs 8.66e-15 | Pass: illumination.maxAbs 5.17e-14 | Pass: illumination.maxAbs 5.20e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 5 | Pass: illumination.maxAbs 6.94e-15 | Pass: illumination.maxAbs 5.62e-14 | Pass: illumination.maxAbs 5.70e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 5 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 6.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 5 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 6.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 5 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 5 | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 5 | Pass: landing.maxAbs 9.77e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 5 | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 5 | Pass: illumination.maxAbs 6.55e-15 | Pass: illumination.maxAbs 1.62e-14 | Pass: illumination.maxAbs 1.53e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: illumination.maxAbs 4.88e-14 | Pass: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 5 | Pass: illumination.maxAbs 7.33e-15 | Pass: illumination.maxAbs 7.05e-14 | Pass: illumination.maxAbs 7.17e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: illumination.maxAbs 4.88e-14 | Pass: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 5 | Pass: illumination.maxAbs 7.33e-15 | Pass: illumination.maxAbs 7.05e-14 | Pass: illumination.maxAbs 7.17e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 5 | Pass: illumination.maxAbs 9.10e-15 | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.90e-14 | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 5 | Pass: illumination.maxAbs 9.55e-15 | Pass: illumination.maxAbs 2.02e-14 | Pass: illumination.maxAbs 2.15e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 5 | Pass: illumination.maxAbs 9.55e-15 | Pass: illumination.maxAbs 2.02e-14 | Pass: illumination.maxAbs 2.15e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-mc-105f28-best-ref | 1 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 5 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 8.88e-14 mm | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 1 | Pass: illumination.maxAbs 2.42e-14 | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 5 | Pass: illumination.maxAbs 2.93e-14 | Pass: landing.maxAbs 6.04e-14 mm | Pass: illumination.maxAbs 2.53e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 1 | Pass: illumination.maxAbs 2.42e-14 | Pass: landing.maxAbs 1.14e-13 mm | Pass: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 5 | Pass: illumination.maxAbs 2.93e-14 | Pass: landing.maxAbs 6.04e-14 mm | Pass: illumination.maxAbs 2.53e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 1 | Pass: landing.maxAbs 2.13e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 3.20e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 5 | Pass: illumination.maxAbs 4.44e-15 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f8-ref | 1 | Pass: illumination.maxAbs 4.55e-15 | Pass: illumination.maxAbs 3.55e-15 | Pass: illumination.maxAbs 4.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 5 | Pass: landing.maxAbs 4.09e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 1 | Pass: illumination.maxAbs 4.55e-15 | Pass: illumination.maxAbs 3.55e-15 | Pass: illumination.maxAbs 4.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 5 | Pass: landing.maxAbs 4.26e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | Pass: illumination.maxAbs 4.33e-15 | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 5 | Pass: illumination.maxAbs 6.00e-15 | Pass: landing.maxAbs 1.71e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | Pass: landing.maxAbs 3.91e-14 mm | Pass: illumination.maxAbs 3.04e-14 | Pass: illumination.maxAbs 2.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 5 | Pass: illumination.maxAbs 4.11e-15 | Pass: illumination.maxAbs 3.20e-14 | Pass: illumination.maxAbs 3.03e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | Pass: landing.maxAbs 3.91e-14 mm | Pass: illumination.maxAbs 3.04e-14 | Pass: illumination.maxAbs 2.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 5 | Pass: illumination.maxAbs 4.11e-15 | Pass: illumination.maxAbs 3.20e-14 | Pass: illumination.maxAbs 3.03e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |

## How to read this

### Verdicts

A verdict is of one pair of engines: of one request, or, in a table by run, the worst over the requests of the
run. A table shows the label; the stored value is what the baseline file holds.

| Label | Stored value | Meaning |
|---|---|---|
| Pass: within limit | `PASS` | A check held to a limit: every judged figure is at or below its limit. |

### Checks

A check held to a limit judges two engines' answers to the same input against the limits of the limits file. A
side-by-side check sets two methods beside each other with no limit, and fails nothing. A section of this file
is headed by a check's title, with the id the baseline file stores it under.

| Check | Id | Kind | Compares |
|---|---|---|---|
| Built system | `built-system` | held to a limit | Built layout, shape, aperture, index and sampled sag. |
| First-order data | `first-order` | held to a limit | First-order quantities and pupils. |
| Ray trace | `ray-trace` | held to a limit | Hits, directions, image landings and masks of identical rays. |
| Optical path | `optical-path` | held to a limit | Optical path, path to image and chief-relative OPD of identical rays. |
| Geometric MTF of the same rays | `geometric-mtf` | held to a limit | This tool's geometric MTF of identical rays, as each engine traces them. |
| Spot and fan rays | `spot-rays` | held to a limit | Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. |
| Spherical aberration and axial colour rays | `axial-rays` | held to a limit | Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. |
| Chief rays (distortion, pupils, lateral colour) | `chief-rays` | held to a limit | Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. |
| Field-curve rays | `field-curve-rays` | held to a limit | Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. |
| Vignetting rays | `vignetting-rays` | held to a limit | Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays. |

### Engines

A pair is named by the ids of its two engines:

| Id | Engine |
|---|---|
| `lv` | LensVisualizer itself, loaded from a local checkout, asked for each figure as its own tabs ask for it, and made to trace the very rays every engine is handed in the checks held to a limit. |
| `optiland` | optiland, an open-source optical design library in Python, run by this tool in a worker process of its own. |
| `ref` | The reference tracer: a small exact ray tracer written in this repository from the optics alone, never from LensVisualizer's or optiland's code. |

### Figures

A figure is named by its label, then the key the baseline file stores it under. The Limit column gives, for a
check held to a limit, the largest value a pair may have (`≤`); for a side-by-side check, the review band a
difference is set beside. A figure without either is shown and not judged; a chief-ray landing of a side-by-side
check is held to the sorting limit its tables state. Numbers have three significant digits, and a whole number,
such as a count, is written in full. `not finite` marks a number that is NaN or infinite, and `—` a place with
nothing to show.

Rays ok / blocked / failed: of the rays an engine was handed, added up over the requests of the run, how many reached the image plane, how many an aperture stopped, and how many the engine could not trace to an end.

### Where

The place of a figure's largest value, as the requests name it:

| Place | Meaning |
|---|---|
| `cut` | the sagittal or the tangential cut of an MTF |
| `field` | in a check of the ray-trace quantity: the field angle of the set of rays, in degrees (shown with deg) |
| `frequencyPerMm` | the spatial frequency, in cycles per millimetre |
| `line` | the index of a wavelength in the lens state's list of wavelengths, 0 being the first |
| `quantity` | the first-order quantity, by its name |
| `ray` | the index of a ray in its set |
| `sample` | the index of a sampled height on a surface |
| `surface` | the index of a surface of the lens state |

This baseline does not keep the wavelengths themselves: a place names a wavelength by its index in the lens state alone.

### Run names

A run's name is the name the suite gives it, usually a lens key (in the features suite, the feature it exercises; in the catalog, `catalog-` then the lens key), then the parts below that apply. They are the naming of the committed suites; a lens key may hold the same letters as a part of its own.

| Part | Meaning |
|---|---|
| `-ref` | the lens state at the lens's reference wavelength alone |
| `-photopic` | the lens state on several wavelengths, weighted by the eye's daylight (photopic) response |
| `-best` | focused on LensVisualizer's best axial focus for that stop and those wavelengths, in place of the lens's design image plane |
| `-f<N>` | at f/N, the stop LensVisualizer's own rule gives that f-number |
| `-wide, -tele` | a zoom lens at the short or the long end of its zoom range |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | ca12c885c2454c3cb1a8d0c54d51128a20c4919c2ceb84c3d03a7404cceb75fa |
| Baseline file | bc182fb3c2ab3c443fa0366454be22a7a71f26c4947db9fea03403ab531f953c |
| Limits file | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5 | commit 25f65d4b4213a21392cbae92680134906049b2ad |
| optiland | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb | commit 4e893f53aee1312f2d091680b93dd2279711e197, distribution version 0.6.2.post117+g4e893f53, source hash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | — |

| Run | Lens state |
|---|---|
| canon-ef-135-f2l-usm-ref | b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60 |
| canon-ef-135-f2l-usm-photopic | 5a1e4774772748058756cfcb4d918aedab000c3e4857e484254fe6688c651513 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | b241011c9681597d858ca830bb42493ed5d2719b1aa8782269e0f54cde52c35f |
| sigma-35mm-f14-dg-hsm-a-ref | 18ef72984fad20ad086ba18f8b839edb2d9d142a51397b4b7c1a3cdf1565d456 |
| sigma-35mm-f14-dg-hsm-a-photopic | 7ff423e8023923c0d2ce5797fab6e1acce05b4d12bfb3528765c4020ba4fd7c9 |
| nikkor-z50f12-ref | 861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22 |
| nikkor-z50f12-photopic | 25e839a37b367ed1c9f7298f4e44f9fdb017645f73647e4f965832cb1d28ede2 |
| sony-fe-20mm-f18-g-ref | b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5 |
| sony-fe-20mm-f18-g-photopic | 9bf71fcc2c01fb1e7c25546d8b6a2758be33c6bba8fe4742ebcd3fbac72405d7 |
| sony-fe-400mm-f28-gm-oss-ref | 75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5 |
| sony-fe-400mm-f28-gm-oss-photopic | 25a3d0697df2ed6fe2fd355a06ce5f7a89664142dadd6e7d5e049d3bbc636df7 |
| sigma-105mm-f28-dg-dn-macro-art-ref | e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | c5a507024e5ab43f94adcb83c67c948a9731a2af72fed96ac5515f6eb04f708e |
| nikon-z-24-70f4s-wide-ref | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| nikon-z-24-70f4s-wide-photopic | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc |
| nikon-z-24-70f4s-tele-ref | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| nikon-z-24-70f4s-tele-photopic | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 |
| nikon-z-mc-105f28-ref | 70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb |
| nikon-z-mc-105f28-photopic | e492101b147bcf0f0e156d83376aba617d1c24f20cfdcf0d82b48a03f8b4a92e |
| nikon-z-135f18-plena-ref | 449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab |
| nikon-z-135f18-plena-photopic | 9ac66541b918eea604fa81c70999f824029cc1d2d481851438f0d5d7e86d8224 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 6f62ee09c0c8b3a1cc345e3ed0e0e27aebea0ce5e96cdbee7664ffbab4914e73 |
| canon-ef-135-f2l-usm-best-ref | b4f341d96e9f6e711ecf326eeb3cdaf3602a856cdfba61ec965ecc71b89499de |
| canon-ef-135-f2l-usm-best-photopic | 69d4e5172b1877156ed6cc172c99847863dea3900c1a4bba283471c1e9e4d77a |
| canon-ef-135-f2l-usm-f8-ref | d1fd0633e961ca14b7e8a890140c4d184c21a53e0969e4179e2f142257180fc7 |
| canon-ef-135-f2l-usm-f8-photopic | 731871199792070410cbec4aca73816955e53384dc92b9d251361f507f9f85ac |
| canon-ef-135-f2l-usm-f8-best-ref | 9181a5e3a48bf546f4561ba7bb1b9fb5de2bdf85f2f1080c60230661b568ddca |
| canon-ef-135-f2l-usm-f8-best-photopic | 1edb8e349eae5cb693e7fd3aa842407d2fcfbaac26476210431b6eb4bec8fcad |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 52523bad0a00d71977e0eefafa46b9cda099b1324777dde14b699fab0c5b4b9b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | d86d998c5a70e9c1fa8f9878a114e0860ac1d0a2bb3794a556ed637b05f9061b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 30e4a4eec70f588e984e1210446b9eb671089990b41bdf7c6425457f870b4ebd |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0a789bcb488ae70bd153a4390f164cf24647a72b9508108f7a6635b81735cd3a |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | eb45ad15291d7f5e4556a8ab1655f8b325aa8433e5806470be1db9dbc663d1ae |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 8ed243d16650b84e33194bedae63bbe3b1baf12d708588a18f2ba2b3427735f7 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 130981bdd7a4989b64f69069a4346f2004bccb5f4e41fddc1b856bcd792c7d4d |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 2876a9d3614dc1293aa063abda65053216c2d0dbe8fda26b4e7335de9a935417 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | ce80398ec92f83206f4b4190f455665210292985b2b13c0bdc728983ac8ef72a |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 2576f1abc7847ff787cf741fc8afe2a29ae1d6639c6dad9f3497291f972ac074 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 53d98c230d539a2f9f241accb3d0f4ceaab1006e5601e8c391d9ccf38239f723 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 42379a5556180d78b6be5ba5e140298c72a186b55b8221749f0c91a6fdb8760a |
| nikkor-z50f12-best-ref | 13cd75d2e0891cf4ab4f2e8c006a7719cdd7721caa4dce11e1faa6ab1f70e8f5 |
| nikkor-z50f12-best-photopic | 6e335d456db27535278548bcc6d44f974db63b0f65ae8f9252f5ab3b2aaddc07 |
| nikkor-z50f12-f8-ref | b2e66abb6142cc758397469e55448599762d9712ba3d6cd768f8cea13b336b92 |
| nikkor-z50f12-f8-photopic | 97402aca20f0101b3bfcc039f1cd45547794bd302bc582f837cd86ea56658584 |
| nikkor-z50f12-f8-best-ref | 359dc743691cfd7a56b445301c5703d5ead4e6fc68863d5faf7c5d386acddfa5 |
| nikkor-z50f12-f8-best-photopic | c557755be3310618f79fba94e12eb3cae909f6784afb8b8d412dbeb156d35870 |
| sony-fe-20mm-f18-g-best-ref | 469d8f48aaac16ae2f6e2ce67f033e9eacff42111d6b3e1c1eb2c6450c40fb3a |
| sony-fe-20mm-f18-g-best-photopic | 8d1ccf9e5acdcf3be6daf5353b1f4b36ea8d1a2d317177447abaaa36bb9070ec |
| sony-fe-20mm-f18-g-f8-ref | cd2d5eb4481fbd7b01ae526b4808841fdcb6467f04d85b0cc0e040b2d2955ce0 |
| sony-fe-20mm-f18-g-f8-photopic | e989fae172bd203a3b2d51f1ddffbd17d364aadf4e801383aae83b5f778aae52 |
| sony-fe-20mm-f18-g-f8-best-ref | e169bad1480d89fff330c5fc66e0d06dcb23e767ffd4a9c0a14159caf68abb5e |
| sony-fe-20mm-f18-g-f8-best-photopic | cca38982ae4220225ccf9dec2ea690c58629a4334c81076b5626860f736d7ca1 |
| sony-fe-400mm-f28-gm-oss-best-ref | 321e4ba0ce5c220609a55b35ac8a33079ccf30c7e3258a67ec1463edf2554afb |
| sony-fe-400mm-f28-gm-oss-best-photopic | 432764ba66f320c6af37ef4906a016797499b5310599902028721d470024d9ea |
| sony-fe-400mm-f28-gm-oss-f8-ref | bdba0ea2e9d167e31d49a03bd99c873d71bc7945b8b646ac3cb48b4710a872f2 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 5f85630002361a665e23772e378113957d44c6359ea572fa01c761ae4d2fbf51 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 93e98f340fb7f23d10d90375c3c3953cd5c871e2867247ae73e24e3fa40b0e6d |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 2d91ab3ecb073567986f4cf5de5e83bbdcf61ccf8e9554cdc5e8e9f254947e4b |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | f74812129cc4c7918a44f8ec7cb6ce9882367b23bc0d991f04712a7e6cc9206e |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3b68693f0aed670f4c8b9e652233d6bd9a14812a7d9301ae9efa867558dbdc39 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 58eb582de9ad963ec75ab5f5009ec8889068ea50be5cdb6da32ac6d23f9c6698 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | dc4dfa9211345eb02410bab772dae7de3f2796998d617b94b0f727c9c7928c06 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 5285ea322b02f0fd436d12c9cd11c5e1abde75282625e1351b4d7c57d2f7cdd9 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 9206ace874fc53d400781e67b497a2f70ae09367beb54a55edd489cc8b012871 |
| nikon-z-24-70f4s-wide-best-ref | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| nikon-z-24-70f4s-wide-best-photopic | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 |
| nikon-z-24-70f4s-wide-f8-ref | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| nikon-z-24-70f4s-wide-f8-photopic | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 |
| nikon-z-24-70f4s-wide-f8-best-ref | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 |
| nikon-z-24-70f4s-tele-best-ref | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| nikon-z-24-70f4s-tele-best-photopic | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 |
| nikon-z-24-70f4s-tele-f8-ref | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| nikon-z-24-70f4s-tele-f8-photopic | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf |
| nikon-z-24-70f4s-tele-f8-best-ref | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b |
| nikon-z-mc-105f28-best-ref | c83e32a7f5c48ad358d471710d082e4a5fb745e7baae2c989ec4a957709a8bbb |
| nikon-z-mc-105f28-best-photopic | b97782bbacd99c048ee69ac0d41c84639999e363374ce87d570d501253b5d594 |
| nikon-z-mc-105f28-f8-ref | 904ae8663e1e238175e7d632b807c7b9efc4ab69381a92b0613675b2dbc891a9 |
| nikon-z-mc-105f28-f8-photopic | 56a7dca87fd84d7f382a68e33acdb1c4f58f4afcec119b09ae72a671b836ff83 |
| nikon-z-mc-105f28-f8-best-ref | d31b3e7efcdab37966e8b8135217738e6192f77faec1b974d94409d648accd72 |
| nikon-z-mc-105f28-f8-best-photopic | 05c8d34726e50ab941b4d2caa0a807a96d9077dc3777e4fbb0aa8989c5f6a476 |
| nikon-z-135f18-plena-best-ref | 0c9e2d7b9f2923c21fef404d7b86f7e31456364f77a5f300a13a06219d4add72 |
| nikon-z-135f18-plena-best-photopic | 45ff06bb22f2b3d5be84433c71a1a6e7c4851c4c4d88c3770a88edc0f7922998 |
| nikon-z-135f18-plena-f8-ref | 7f0c3394b7c516d1ac234599e678abe8497b7cf9931f1dd3887a7869e8a703a8 |
| nikon-z-135f18-plena-f8-photopic | f060b855c73e9fb5b18b34e4b1122c30b2beb3de00ca30c00aa4be509825b324 |
| nikon-z-135f18-plena-f8-best-ref | d4eca6fef5c902656e4eb45b1542385a3a1902907993d85a65365ff0d997f6ff |
| nikon-z-135f18-plena-f8-best-photopic | 95151953a4343500ecce7683fbc710f87c1192f0245ee6b6de4948dbc4608652 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0f2591032f4111cf837b08e5e70899199b943dfbe2e54ff2469d14fd9b70a7f0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 8a471dcefb12901a1bf45cd2083cf701fcd4c20f6f515944215f4427e7c2f5cf |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | e44ac8f3c84fa88e4f62f0acd044815be365d1791d98ad87744f5c12e8eabc52 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 34789d7b42b8949cf70123383a08237a20235661e5236fdbcd46d27bd2add967 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 952ae77f90fd93161c6e9e1d307c8b2289770285efe2d2c42c56dc5a5cf47c5a |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 055522122a4c925fdd18f5062abd08ad34585b1567e670ad9591473bdca1eb53 |
