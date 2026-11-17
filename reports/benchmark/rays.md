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
| Limits file | v25 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 193 engine files |
| optiland | optiland | 0.6.2.post234+ga9e544a2 | backend numpy, clean checkout, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 611 source files |
| reference-tracer | Reference tracer | 1 | 13 source files |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 96 | 96 | lv – optiland | 96 Pass | 96 Pass |
| Built system — `built-system` | `system.describe` | 96 | 96 | lv – reference-tracer | 96 Pass | 96 Pass |
| Built system — `built-system` | `system.describe` | 96 | 96 | optiland – reference-tracer | 96 Pass | 96 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 96 | 96 | lv – optiland | 96 Pass | 96 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 96 | 96 | lv – reference-tracer | 96 Pass | 96 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 96 | 96 | optiland – reference-tracer | 96 Pass | 96 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 96 | 1440 | lv – optiland | 96 Pass | 1440 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 96 | 1440 | lv – reference-tracer | 96 Pass | 1440 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 96 | 1440 | optiland – reference-tracer | 96 Pass | 1440 Pass |
| Optical path — `optical-path` | `rays.trace` | 96 | 1440 | lv – optiland | 96 Pass | 1440 Pass |
| Optical path — `optical-path` | `rays.trace` | 96 | 1440 | lv – reference-tracer | 96 Pass | 1440 Pass |
| Optical path — `optical-path` | `rays.trace` | 96 | 1440 | optiland – reference-tracer | 96 Pass | 1440 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 96 | 288 | lv – optiland | 96 Pass | 288 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 96 | 288 | lv – reference-tracer | 96 Pass | 288 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 96 | 288 | optiland – reference-tracer | 96 Pass | 288 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 96 | 4800 | lv – optiland | 96 Pass | 4800 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 96 | 4800 | lv – reference-tracer | 96 Pass | 4800 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 96 | 4800 | optiland – reference-tracer | 96 Pass | 4800 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 96 | 1008 | lv – optiland | 96 Pass | 1008 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 96 | 1008 | lv – reference-tracer | 96 Pass | 1008 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 96 | 1008 | optiland – reference-tracer | 96 Pass | 1008 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 96 | 384 | lv – optiland | 96 Pass | 384 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 96 | 384 | lv – reference-tracer | 96 Pass | 384 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 96 | 384 | optiland – reference-tracer | 96 Pass | 384 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 96 | 960 | lv – optiland | 96 Pass | 960 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 96 | 960 | lv – reference-tracer | 96 Pass | 960 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 96 | 960 | optiland – reference-tracer | 96 Pass | 960 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 96 | 480 | lv – optiland | 96 Pass | 480 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 96 | 480 | lv – reference-tracer | 96 Pass | 480 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 96 | 480 | optiland – reference-tracer | 96 Pass | 480 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 96 answered |
| Built system — `built-system` | optiland | 96 answered |
| Built system — `built-system` | reference-tracer | 96 answered |
| First-order data — `first-order` | lv | 96 answered |
| First-order data — `first-order` | optiland | 96 answered |
| First-order data — `first-order` | reference-tracer | 96 answered |
| Ray trace — `ray-trace` | lv | 96 answered |
| Ray trace — `ray-trace` | optiland | 96 answered |
| Ray trace — `ray-trace` | reference-tracer | 96 answered |
| Optical path — `optical-path` | lv | 96 answered |
| Optical path — `optical-path` | optiland | 96 answered |
| Optical path — `optical-path` | reference-tracer | 96 answered |
| Geometric MTF of the same rays — `geometric-mtf` | lv | 96 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 96 answered |
| Geometric MTF of the same rays — `geometric-mtf` | reference-tracer | 96 answered |
| Spot and fan rays — `spot-rays` | lv | 96 answered |
| Spot and fan rays — `spot-rays` | optiland | 96 answered |
| Spot and fan rays — `spot-rays` | reference-tracer | 96 answered |
| Spherical aberration and axial colour rays — `axial-rays` | lv | 96 answered |
| Spherical aberration and axial colour rays — `axial-rays` | optiland | 96 answered |
| Spherical aberration and axial colour rays — `axial-rays` | reference-tracer | 96 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | lv | 96 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | optiland | 96 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | reference-tracer | 96 answered |
| Field-curve rays — `field-curve-rays` | lv | 96 answered |
| Field-curve rays — `field-curve-rays` | optiland | 96 answered |
| Field-curve rays — `field-curve-rays` | reference-tracer | 96 answered |
| Vignetting rays — `vignetting-rays` | lv | 96 answered |
| Vignetting rays — `vignetting-rays` | optiland | 96 answered |
| Vignetting rays — `vignetting-rays` | reference-tracer | 96 answered |

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
| lv – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.97e-16 | sony-fe-20mm-f18-g-ref | sample 8, surface 6 |
| lv – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.55e-15 | sigma-35mm-f14-dg-hsm-a-ref | sample 8, surface 0 |
| optiland – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 4.51e-16 | sony-fe-20mm-f18-g-ref | sample 6, surface 0 |
| optiland – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 2.66e-15 | sigma-35mm-f14-dg-hsm-a-ref | sample 8, surface 13 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
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
| lv – optiland | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 5.91e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity frontFocalZ |
| lv – optiland | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 9.09e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 6, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 9.09e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 6, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 5.68e-14 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilSemiDiameter |
| lv – optiland | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 5.68e-14 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.96e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity frontFocalZ |
| lv – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.25e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.25e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 5.68e-14 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 5.68e-14 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 6.59e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity frontFocalZ |
| optiland – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.25e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilZ |
| optiland – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.25e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity entrancePupilZ |
| optiland – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 7.11e-14 | sony-fe-400mm-f28-gm-oss-photopic | line 5, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 7.11e-14 | sony-fe-400mm-f28-gm-oss-photopic | line 5, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| sony-fe-20mm-f18-g-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| sony-fe-400mm-f28-gm-oss-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-wide-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-tele-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-photopic | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-135f18-plena-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |
| canon-ef-135-f2l-usm-best-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| canon-ef-135-f2l-usm-f8-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-best-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-best-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikkor-z50f12-f8-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| nikkor-z50f12-f8-best-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| sony-fe-20mm-f18-g-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm |
| sony-fe-20mm-f18-g-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f8-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-wide-best-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-tele-best-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-best-photopic | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-tele-f8-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-mc-105f28-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f8-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-mc-105f28-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-135f18-plena-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-best-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| nikon-z-135f18-plena-f8-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f8-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| nikon-z-135f18-plena-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.13e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1 deg, line 0, ray 843, surface 20 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.17e-14 | sony-fe-20mm-f18-g-f8-photopic | field 4.75e1 deg, line 1, ray 15 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 7.65e-13 | sigma-45mm-f28-dg-dn-contemporary-best-photopic | field 2.56e1 deg, line 4, ray 744 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1349184 | — | — |
| lv – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.11e-12 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 6, ray 399, surface 10 |
| lv – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 2.35e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 1, ray 173 |
| lv – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 1.03e-12 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 1, ray 173 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1349184 | — | — |
| optiland – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.15e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1 deg, line 3, ray 839, surface 20 |
| optiland – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 2.25e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 7, ray 174 |
| optiland – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 9.92e-13 | sony-fe-20mm-f18-g-photopic | field 4.75e1 deg, line 1, ray 173 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1349184 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | 2363 / 712 / 0 | 2363 / 712 / 0 | 2363 / 712 / 0 |
| canon-ef-135-f2l-usm-photopic | 27 | Pass: landing.maxDistance 1.82e-13 mm | Pass: landing.maxDistance 1.37e-13 mm | Pass: hits.maxDistance 1.88e-13 mm | 21271 / 6404 / 0 | 21271 / 6404 / 0 | 21271 / 6404 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: landing.maxDistance 1.06e-13 mm | Pass: landing.maxDistance 6.75e-14 mm | Pass: landing.maxDistance 1.04e-13 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 27 | Pass: landing.maxDistance 1.31e-13 mm | Pass: landing.maxDistance 8.19e-14 mm | Pass: landing.maxDistance 1.10e-13 mm | 24099 / 3576 / 0 | 24099 / 3576 / 0 | 24099 / 3576 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: landing.maxDistance 2.39e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2439 / 636 / 0 | 2439 / 636 / 0 | 2439 / 636 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 21941 / 5734 / 0 | 21941 / 5734 / 0 | 21941 / 5734 / 0 |
| nikkor-z50f12-ref | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2381 / 694 / 0 | 2381 / 694 / 0 | 2381 / 694 / 0 |
| nikkor-z50f12-photopic | 27 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 21407 / 6268 / 0 | 21407 / 6268 / 0 | 21407 / 6268 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | Pass: hits.maxDistance 5.31e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2845 / 230 / 0 | 2845 / 230 / 0 | 2845 / 230 / 0 |
| sony-fe-20mm-f18-g-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 25649 / 2026 / 0 | 25649 / 2026 / 0 | 25649 / 2026 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: landing.maxDistance 2.68e-13 mm | Pass: landing.maxDistance 2.63e-13 mm | Pass: landing.maxDistance 3.35e-13 mm | 2495 / 580 / 0 | 2495 / 580 / 0 | 2495 / 580 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 27 | Pass: landing.maxDistance 3.63e-13 mm | Pass: landing.maxDistance 2.85e-13 mm | Pass: landing.maxDistance 4.04e-13 mm | 22441 / 5234 / 0 | 22441 / 5234 / 0 | 22441 / 5234 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 1.73e-13 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 27 | Pass: landing.maxDistance 2.03e-13 mm | Pass: landing.maxDistance 1.44e-13 mm | Pass: landing.maxDistance 2.18e-13 mm | 23533 / 4142 / 0 | 23533 / 4142 / 0 | 23533 / 4142 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-wide-photopic | 27 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 25309 / 2366 / 0 | 25309 / 2366 / 0 | 25309 / 2366 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-tele-photopic | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 23481 / 4194 / 0 | 23481 / 4194 / 0 | 23481 / 4194 / 0 |
| nikon-z-mc-105f28-ref | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 7.74e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| nikon-z-mc-105f28-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 21069 / 6606 / 0 | 21069 / 6606 / 0 | 21069 / 6606 / 0 |
| nikon-z-135f18-plena-ref | 3 | Pass: landing.maxDistance 1.69e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| nikon-z-135f18-plena-photopic | 27 | Pass: landing.maxDistance 1.76e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | Pass: hits.maxDistance 9.30e-13 mm | 25877 / 1798 / 0 | 25877 / 1798 / 0 | 25877 / 1798 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: hits.maxDistance 8.67e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 27 | Pass: hits.maxDistance 9.53e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 22025 / 5650 / 0 | 22025 / 5650 / 0 | 22025 / 5650 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 1.14e-13 mm | Pass: landing.maxDistance 1.31e-13 mm | 2363 / 712 / 0 | 2363 / 712 / 0 | 2363 / 712 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 27 | Pass: landing.maxDistance 1.82e-13 mm | Pass: landing.maxDistance 1.37e-13 mm | Pass: hits.maxDistance 1.88e-13 mm | 21271 / 6404 / 0 | 21271 / 6404 / 0 | 21271 / 6404 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: hits.maxDistance 9.18e-14 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: hits.maxDistance 1.11e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 27 | Pass: hits.maxDistance 1.48e-13 mm | Pass: landing.maxDistance 1.03e-13 mm | Pass: hits.maxDistance 1.45e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: hits.maxDistance 9.18e-14 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: hits.maxDistance 1.11e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 27 | Pass: hits.maxDistance 1.48e-13 mm | Pass: landing.maxDistance 1.03e-13 mm | Pass: hits.maxDistance 1.45e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: landing.maxDistance 1.06e-13 mm | Pass: landing.maxDistance 6.76e-14 mm | Pass: landing.maxDistance 1.04e-13 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 27 | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 8.19e-14 mm | Pass: landing.maxDistance 1.12e-13 mm | 24099 / 3576 / 0 | 24099 / 3576 / 0 | 24099 / 3576 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: landing.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 7.11e-14 mm | Pass: landing.maxDistance 9.96e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 27 | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 8.53e-14 mm | Pass: hits.maxDistance 1.10e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: landing.maxDistance 1.03e-13 mm | Pass: landing.maxDistance 7.11e-14 mm | Pass: landing.maxDistance 9.60e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 27 | Pass: hits.maxDistance 1.17e-13 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: hits.maxDistance 1.10e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: landing.maxDistance 2.39e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2439 / 636 / 0 | 2439 / 636 / 0 | 2439 / 636 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 21941 / 5734 / 0 | 21941 / 5734 / 0 | 21941 / 5734 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: hits.maxDistance 1.30e-13 mm | Pass: hits.maxDistance 8.09e-13 mm | Pass: hits.maxDistance 8.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 27 | Pass: hits.maxDistance 1.48e-13 mm | Pass: hits.maxDistance 8.52e-13 mm | Pass: hits.maxDistance 8.41e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: landing.maxDistance 1.31e-13 mm | Pass: hits.maxDistance 8.09e-13 mm | Pass: hits.maxDistance 8.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 27 | Pass: hits.maxDistance 1.48e-13 mm | Pass: hits.maxDistance 8.52e-13 mm | Pass: hits.maxDistance 8.41e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikkor-z50f12-best-ref | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2381 / 694 / 0 | 2381 / 694 / 0 | 2381 / 694 / 0 |
| nikkor-z50f12-best-photopic | 27 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 21407 / 6268 / 0 | 21407 / 6268 / 0 | 21407 / 6268 / 0 |
| nikkor-z50f12-f8-ref | 3 | Pass: hits.maxDistance 8.53e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 27 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | Pass: hits.maxDistance 8.53e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | Pass: hits.maxDistance 9.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 27 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: hits.maxDistance 5.31e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2845 / 230 / 0 | 2845 / 230 / 0 | 2845 / 230 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 25649 / 2026 / 0 | 25649 / 2026 / 0 | 25649 / 2026 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: landing.maxDistance 1.46e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: landing.maxDistance 1.49e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: landing.maxDistance 2.69e-13 mm | Pass: landing.maxDistance 2.65e-13 mm | Pass: landing.maxDistance 3.33e-13 mm | 2495 / 580 / 0 | 2495 / 580 / 0 | 2495 / 580 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 27 | Pass: landing.maxDistance 3.63e-13 mm | Pass: landing.maxDistance 2.85e-13 mm | Pass: landing.maxDistance 4.04e-13 mm | 22441 / 5234 / 0 | 22441 / 5234 / 0 | 22441 / 5234 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: landing.maxDistance 3.34e-13 mm | Pass: landing.maxDistance 3.10e-13 mm | Pass: landing.maxDistance 3.16e-13 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 27 | Pass: landing.maxDistance 3.84e-13 mm | Pass: landing.maxDistance 3.09e-13 mm | Pass: landing.maxDistance 3.70e-13 mm | 27611 / 64 / 0 | 27611 / 64 / 0 | 27611 / 64 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: landing.maxDistance 3.30e-13 mm | Pass: landing.maxDistance 3.07e-13 mm | Pass: landing.maxDistance 3.13e-13 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 27 | Pass: landing.maxDistance 3.80e-13 mm | Pass: landing.maxDistance 3.13e-13 mm | Pass: landing.maxDistance 3.70e-13 mm | 27611 / 64 / 0 | 27611 / 64 / 0 | 27611 / 64 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 1.73e-13 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 27 | Pass: landing.maxDistance 2.03e-13 mm | Pass: landing.maxDistance 1.43e-13 mm | Pass: landing.maxDistance 2.16e-13 mm | 23533 / 4142 / 0 | 23533 / 4142 / 0 | 23533 / 4142 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: landing.maxDistance 1.81e-13 mm | Pass: landing.maxDistance 1.36e-13 mm | Pass: landing.maxDistance 1.89e-13 mm | 2943 / 132 / 0 | 2943 / 132 / 0 | 2943 / 132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 27 | Pass: landing.maxDistance 2.24e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 2.45e-13 mm | 26465 / 1210 / 0 | 26465 / 1210 / 0 | 26465 / 1210 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: landing.maxDistance 1.81e-13 mm | Pass: landing.maxDistance 1.36e-13 mm | Pass: landing.maxDistance 1.93e-13 mm | 2943 / 132 / 0 | 2943 / 132 / 0 | 2943 / 132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 27 | Pass: landing.maxDistance 2.20e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 2.45e-13 mm | 26465 / 1210 / 0 | 26465 / 1210 / 0 | 26465 / 1210 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 27 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 25309 / 2366 / 0 | 25309 / 2366 / 0 | 25309 / 2366 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: hits.maxDistance 9.10e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 27 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 1.11e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: hits.maxDistance 9.10e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 27 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 1.11e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 23481 / 4194 / 0 | 23481 / 4194 / 0 | 23481 / 4194 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 7.74e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| nikon-z-mc-105f28-best-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 21069 / 6606 / 0 | 21069 / 6606 / 0 | 21069 / 6606 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: hits.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 27 | Pass: landing.maxDistance 1.71e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 1.60e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: hits.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 1.42e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 27 | Pass: landing.maxDistance 1.74e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 1.60e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | Pass: landing.maxDistance 1.69e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | Pass: hits.maxDistance 9.20e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| nikon-z-135f18-plena-best-photopic | 27 | Pass: landing.maxDistance 1.76e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | Pass: hits.maxDistance 9.30e-13 mm | 25877 / 1798 / 0 | 25877 / 1798 / 0 | 25877 / 1798 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: landing.maxDistance 9.59e-14 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 27 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: landing.maxDistance 9.59e-14 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 27 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: hits.maxDistance 8.67e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 27 | Pass: hits.maxDistance 9.53e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 22025 / 5650 / 0 | 22025 / 5650 / 0 | 22025 / 5650 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: landing.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 25865 / 1810 / 0 | 25865 / 1810 / 0 | 25865 / 1810 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: landing.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 25865 / 1810 / 0 | 25865 / 1810 / 0 | 25865 / 1810 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.08e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1 deg, line 5, ray 677 |
| lv – optiland | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.11e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1 deg, line 5, ray 677 |
| lv – optiland | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.17e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1 deg, line 5, ray 677 |
| lv – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 7, ray 399 |
| lv – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 7, ray 399 |
| lv – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.48e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1 deg, line 3, ray 745 |
| optiland – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 7, ray 399 |
| optiland – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1 deg, line 7, ray 399 |
| optiland – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.64e-9 | nikon-z-24-70f4s-wide-photopic | field 4.33e1 deg, line 7, ray 836 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-photopic | 27 | Pass: opd.maxAbs 3.52e-10 waves | Pass: opd.maxAbs 3.55e-10 waves | Pass: opd.maxAbs 3.75e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 27 | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 2.35e-10 waves | Pass: opd.maxAbs 3.05e-10 waves |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.44e-9 waves | Pass: opd.maxAbs 1.50e-9 waves | Pass: opticalPath.maxAbs 1.52e-9 waves |
| nikkor-z50f12-ref | 3 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-photopic | 27 | Pass: opd.maxAbs 1.92e-9 waves | Pass: opd.maxAbs 1.80e-9 waves | Pass: opticalPath.maxAbs 2.11e-9 waves |
| sony-fe-20mm-f18-g-ref | 3 | Pass: opticalPath.maxAbs 6.29e-10 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-photopic | 27 | Pass: opd.maxAbs 1.98e-9 waves | Pass: opticalPathToImage.maxAbs 2.42e-9 waves | Pass: opticalPathToImage.maxAbs 2.46e-9 waves |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-photopic | 27 | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.92e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 27 | Pass: opticalPathToImage.maxAbs 5.41e-10 waves | Pass: opd.maxAbs 4.81e-10 waves | Pass: opd.maxAbs 5.07e-10 waves |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-wide-photopic | 27 | Pass: opd.maxAbs 1.87e-9 waves | Pass: opd.maxAbs 2.34e-9 waves | Pass: opd.maxAbs 2.64e-9 waves |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-tele-photopic | 27 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 2.05e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| nikon-z-mc-105f28-ref | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-photopic | 27 | Pass: opticalPath.maxAbs 1.29e-9 waves | Pass: opticalPath.maxAbs 1.07e-9 waves | Pass: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-ref | 3 | Pass: opticalPathToImage.maxAbs 4.35e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves |
| nikon-z-135f18-plena-photopic | 27 | Pass: opd.maxAbs 6.01e-10 waves | Pass: opticalPath.maxAbs 1.08e-9 waves | Pass: opticalPath.maxAbs 1.08e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: opd.maxAbs 1.72e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 27 | Pass: opd.maxAbs 2.17e-9 waves | Pass: opticalPath.maxAbs 1.71e-9 waves | Pass: opticalPathToImage.maxAbs 2.19e-9 waves |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-best-photopic | 27 | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 3.55e-10 waves | Pass: opd.maxAbs 3.21e-10 waves |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f8-photopic | 27 | Pass: opd.maxAbs 4.69e-10 waves | Pass: opd.maxAbs 3.52e-10 waves | Pass: opd.maxAbs 3.75e-10 waves |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f8-best-photopic | 27 | Pass: opd.maxAbs 3.61e-10 waves | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 3.52e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 27 | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 2.35e-10 waves | Pass: opd.maxAbs 3.05e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 27 | Pass: opd.maxAbs 3.75e-10 waves | Pass: opd.maxAbs 2.82e-10 waves | Pass: opd.maxAbs 3.38e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 27 | Pass: opd.maxAbs 3.75e-10 waves | Pass: opd.maxAbs 2.40e-10 waves | Pass: opd.maxAbs 2.68e-10 waves |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.44e-9 waves | Pass: opticalPath.maxAbs 1.47e-9 waves | Pass: opticalPath.maxAbs 1.52e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.02e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 27 | Pass: opd.maxAbs 4.81e-10 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.41e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.11e-9 waves | Pass: opd.maxAbs 1.06e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 27 | Pass: opticalPath.maxAbs 4.21e-10 waves | Pass: opd.maxAbs 1.29e-9 waves | Pass: opticalPath.maxAbs 1.35e-9 waves |
| nikkor-z50f12-best-ref | 3 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-best-photopic | 27 | Pass: opd.maxAbs 2.04e-9 waves | Pass: opd.maxAbs 1.80e-9 waves | Pass: opticalPath.maxAbs 2.11e-9 waves |
| nikkor-z50f12-f8-ref | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-photopic | 27 | Pass: opticalPath.maxAbs 1.29e-9 waves | Pass: opd.maxAbs 2.16e-9 waves | Pass: opd.maxAbs 1.92e-9 waves |
| nikkor-z50f12-f8-best-ref | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-best-photopic | 27 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 2.16e-9 waves | Pass: opd.maxAbs 1.92e-9 waves |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: opticalPath.maxAbs 6.29e-10 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-best-photopic | 27 | Pass: opd.maxAbs 1.98e-9 waves | Pass: opticalPathToImage.maxAbs 2.42e-9 waves | Pass: opticalPathToImage.maxAbs 2.46e-9 waves |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves |
| sony-fe-20mm-f18-g-f8-photopic | 27 | Pass: opd.maxAbs 1.87e-9 waves | Pass: opticalPathToImage.maxAbs 2.05e-9 waves | Pass: opticalPathToImage.maxAbs 1.97e-9 waves |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f8-best-photopic | 27 | Pass: opd.maxAbs 1.93e-9 waves | Pass: opticalPathToImage.maxAbs 1.99e-9 waves | Pass: opticalPathToImage.maxAbs 1.97e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-photopic | 27 | Pass: opd.maxAbs 2.16e-9 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.92e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 27 | Pass: opd.maxAbs 1.44e-9 waves | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.68e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.58e-9 waves | Pass: opd.maxAbs 1.54e-9 waves | Pass: opd.maxAbs 1.43e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 27 | Pass: opd.maxAbs 5.37e-10 waves | Pass: opd.maxAbs 5.28e-10 waves | Pass: opd.maxAbs 6.01e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 27 | Pass: opd.maxAbs 6.01e-10 waves | Pass: opd.maxAbs 4.81e-10 waves | Pass: opd.maxAbs 5.41e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 5.32e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 27 | Pass: opd.maxAbs 6.01e-10 waves | Pass: opd.maxAbs 4.47e-10 waves | Pass: opd.maxAbs 5.41e-10 waves |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-wide-best-photopic | 27 | Pass: opd.maxAbs 1.87e-9 waves | Pass: opd.maxAbs 2.34e-9 waves | Pass: opd.maxAbs 2.64e-9 waves |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-wide-f8-photopic | 27 | Pass: opd.maxAbs 1.39e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-photopic | 27 | Pass: opd.maxAbs 1.39e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-tele-best-photopic | 27 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 2.05e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-photopic | 27 | Pass: opd.maxAbs 1.17e-9 waves | Pass: opd.maxAbs 1.56e-9 waves | Pass: opd.maxAbs 1.58e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-photopic | 27 | Pass: opd.maxAbs 1.17e-9 waves | Pass: opd.maxAbs 1.56e-9 waves | Pass: opd.maxAbs 1.58e-9 waves |
| nikon-z-mc-105f28-best-ref | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-best-photopic | 27 | Pass: opticalPath.maxAbs 1.29e-9 waves | Pass: opticalPath.maxAbs 1.07e-9 waves | Pass: opd.maxAbs 9.70e-10 waves |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f8-photopic | 27 | Pass: opd.maxAbs 5.28e-10 waves | Pass: opd.maxAbs 6.43e-10 waves | Pass: opd.maxAbs 5.28e-10 waves |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f8-best-photopic | 27 | Pass: opd.maxAbs 5.35e-10 waves | Pass: opd.maxAbs 5.35e-10 waves | Pass: opd.maxAbs 4.81e-10 waves |
| nikon-z-135f18-plena-best-ref | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves |
| nikon-z-135f18-plena-best-photopic | 27 | Pass: opd.maxAbs 5.63e-10 waves | Pass: opticalPath.maxAbs 1.08e-9 waves | Pass: opticalPath.maxAbs 1.08e-9 waves |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-f8-photopic | 27 | Pass: opd.maxAbs 6.01e-10 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.41e-9 waves |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-f8-best-photopic | 27 | Pass: opd.maxAbs 6.01e-10 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.47e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: opd.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.62e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 27 | Pass: opd.maxAbs 2.17e-9 waves | Pass: opticalPath.maxAbs 1.71e-9 waves | Pass: opticalPathToImage.maxAbs 2.19e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.43e-9 waves | Pass: opd.maxAbs 1.48e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 27 | Pass: opticalPath.maxAbs 9.62e-10 waves | Pass: opd.maxAbs 1.77e-9 waves | Pass: opd.maxAbs 1.80e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.43e-9 waves | Pass: opd.maxAbs 1.48e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 27 | Pass: opticalPath.maxAbs 9.62e-10 waves | Pass: opd.maxAbs 1.77e-9 waves | Pass: opd.maxAbs 1.80e-9 waves |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.07e-11 | sigma-45mm-f28-dg-dn-contemporary-ref | cut tangential, field 2.56e1 deg, frequencyPerMm 86 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1349184 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | canon-ef-135-f2l-usm-photopic | — |
| lv – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.23e-11 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1.66e1 deg, frequencyPerMm 100 |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1349184 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | canon-ef-135-f2l-usm-photopic | — |
| optiland – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.18e-11 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 1.66e1 deg, frequencyPerMm 100 |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1349184 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: mtf.maxAbs 5.93e-13 | Pass: mtf.maxAbs 1.72e-12 | Pass: mtf.maxAbs 1.52e-12 |
| canon-ef-135-f2l-usm-photopic | 3 | Pass: mtf.maxAbs 5.95e-13 | Pass: mtf.maxAbs 9.11e-13 | Pass: mtf.maxAbs 7.00e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: mtf.maxAbs 2.22e-12 | Pass: mtf.maxAbs 7.44e-13 | Pass: mtf.maxAbs 1.62e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | Pass: mtf.maxAbs 5.15e-13 | Pass: mtf.maxAbs 5.82e-13 | Pass: mtf.maxAbs 1.05e-12 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: mtf.maxAbs 3.54e-12 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 4.24e-12 |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | Pass: mtf.maxAbs 8.71e-13 | Pass: mtf.maxAbs 2.27e-12 | Pass: mtf.maxAbs 2.34e-12 |
| nikkor-z50f12-ref | 3 | Pass: mtf.maxAbs 3.92e-12 | Pass: mtf.maxAbs 2.54e-12 | Pass: mtf.maxAbs 4.42e-12 |
| nikkor-z50f12-photopic | 3 | Pass: mtf.maxAbs 2.84e-12 | Pass: mtf.maxAbs 4.49e-12 | Pass: mtf.maxAbs 3.14e-12 |
| sony-fe-20mm-f18-g-ref | 3 | Pass: mtf.maxAbs 1.78e-12 | Pass: mtf.maxAbs 4.39e-12 | Pass: mtf.maxAbs 3.47e-12 |
| sony-fe-20mm-f18-g-photopic | 3 | Pass: mtf.maxAbs 1.27e-12 | Pass: mtf.maxAbs 2.51e-12 | Pass: mtf.maxAbs 2.64e-12 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: mtf.maxAbs 7.18e-12 | Pass: mtf.maxAbs 3.14e-12 | Pass: mtf.maxAbs 6.26e-12 |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | Pass: mtf.maxAbs 3.27e-12 | Pass: mtf.maxAbs 2.96e-12 | Pass: mtf.maxAbs 6.20e-12 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 3.07e-12 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | Pass: mtf.maxAbs 1.95e-12 | Pass: mtf.maxAbs 1.73e-12 | Pass: mtf.maxAbs 3.16e-12 |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 1.05e-11 | Pass: mtf.maxAbs 1.13e-11 |
| nikon-z-24-70f4s-wide-photopic | 3 | Pass: mtf.maxAbs 2.77e-12 | Pass: mtf.maxAbs 7.71e-12 | Pass: mtf.maxAbs 7.93e-12 |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: mtf.maxAbs 1.23e-12 | Pass: mtf.maxAbs 1.23e-11 | Pass: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-tele-photopic | 3 | Pass: mtf.maxAbs 7.67e-13 | Pass: mtf.maxAbs 7.52e-12 | Pass: mtf.maxAbs 7.61e-12 |
| nikon-z-mc-105f28-ref | 3 | Pass: mtf.maxAbs 1.44e-12 | Pass: mtf.maxAbs 2.99e-12 | Pass: mtf.maxAbs 1.80e-12 |
| nikon-z-mc-105f28-photopic | 3 | Pass: mtf.maxAbs 5.29e-13 | Pass: mtf.maxAbs 1.74e-12 | Pass: mtf.maxAbs 1.63e-12 |
| nikon-z-135f18-plena-ref | 3 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 1.96e-12 | Pass: mtf.maxAbs 2.73e-12 |
| nikon-z-135f18-plena-photopic | 3 | Pass: mtf.maxAbs 1.04e-12 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 1.94e-12 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: mtf.maxAbs 1.07e-11 | Pass: mtf.maxAbs 5.18e-12 | Pass: mtf.maxAbs 1.03e-11 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | Pass: mtf.maxAbs 6.93e-12 | Pass: mtf.maxAbs 2.61e-12 | Pass: mtf.maxAbs 7.53e-12 |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: mtf.maxAbs 6.35e-13 | Pass: mtf.maxAbs 1.67e-12 | Pass: mtf.maxAbs 1.68e-12 |
| canon-ef-135-f2l-usm-best-photopic | 3 | Pass: mtf.maxAbs 4.98e-13 | Pass: mtf.maxAbs 5.67e-13 | Pass: mtf.maxAbs 5.30e-13 |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: mtf.maxAbs 6.04e-13 | Pass: mtf.maxAbs 5.28e-13 | Pass: mtf.maxAbs 6.36e-13 |
| canon-ef-135-f2l-usm-f8-photopic | 3 | Pass: mtf.maxAbs 3.33e-13 | Pass: mtf.maxAbs 4.52e-13 | Pass: mtf.maxAbs 5.10e-13 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: mtf.maxAbs 5.85e-13 | Pass: mtf.maxAbs 5.21e-13 | Pass: mtf.maxAbs 6.29e-13 |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | Pass: mtf.maxAbs 3.97e-13 | Pass: mtf.maxAbs 4.06e-13 | Pass: mtf.maxAbs 5.38e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: mtf.maxAbs 7.94e-13 | Pass: mtf.maxAbs 6.78e-13 | Pass: mtf.maxAbs 1.09e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | Pass: mtf.maxAbs 3.09e-13 | Pass: mtf.maxAbs 5.48e-13 | Pass: mtf.maxAbs 6.95e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: mtf.maxAbs 4.36e-13 | Pass: mtf.maxAbs 3.76e-13 | Pass: mtf.maxAbs 6.08e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | Pass: mtf.maxAbs 4.58e-13 | Pass: mtf.maxAbs 2.52e-13 | Pass: mtf.maxAbs 5.28e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: mtf.maxAbs 6.28e-13 | Pass: mtf.maxAbs 3.77e-13 | Pass: mtf.maxAbs 7.35e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | Pass: mtf.maxAbs 2.75e-13 | Pass: mtf.maxAbs 1.84e-13 | Pass: mtf.maxAbs 4.52e-13 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: mtf.maxAbs 3.77e-12 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 4.66e-12 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 2.33e-12 | Pass: mtf.maxAbs 2.14e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: mtf.maxAbs 2.53e-13 | Pass: mtf.maxAbs 3.09e-12 | Pass: mtf.maxAbs 3.34e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | Pass: mtf.maxAbs 3.51e-13 | Pass: mtf.maxAbs 3.21e-13 | Pass: mtf.maxAbs 5.95e-13 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: mtf.maxAbs 2.30e-13 | Pass: mtf.maxAbs 3.03e-12 | Pass: mtf.maxAbs 3.26e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | Pass: mtf.maxAbs 4.76e-13 | Pass: mtf.maxAbs 9.58e-13 | Pass: mtf.maxAbs 1.31e-12 |
| nikkor-z50f12-best-ref | 3 | Pass: mtf.maxAbs 6.22e-12 | Pass: mtf.maxAbs 5.64e-12 | Pass: mtf.maxAbs 6.97e-12 |
| nikkor-z50f12-best-photopic | 3 | Pass: mtf.maxAbs 2.67e-12 | Pass: mtf.maxAbs 1.52e-12 | Pass: mtf.maxAbs 2.92e-12 |
| nikkor-z50f12-f8-ref | 3 | Pass: mtf.maxAbs 1.62e-12 | Pass: mtf.maxAbs 7.07e-13 | Pass: mtf.maxAbs 1.56e-12 |
| nikkor-z50f12-f8-photopic | 3 | Pass: mtf.maxAbs 1.20e-12 | Pass: mtf.maxAbs 6.59e-13 | Pass: mtf.maxAbs 1.48e-12 |
| nikkor-z50f12-f8-best-ref | 3 | Pass: mtf.maxAbs 1.57e-12 | Pass: mtf.maxAbs 6.94e-13 | Pass: mtf.maxAbs 1.47e-12 |
| nikkor-z50f12-f8-best-photopic | 3 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 5.20e-13 | Pass: mtf.maxAbs 1.56e-12 |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: mtf.maxAbs 2.12e-12 | Pass: mtf.maxAbs 4.56e-12 | Pass: mtf.maxAbs 3.66e-12 |
| sony-fe-20mm-f18-g-best-photopic | 3 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 3.79e-12 | Pass: mtf.maxAbs 3.70e-12 |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: mtf.maxAbs 7.20e-13 | Pass: mtf.maxAbs 2.97e-12 | Pass: mtf.maxAbs 2.55e-12 |
| sony-fe-20mm-f18-g-f8-photopic | 3 | Pass: mtf.maxAbs 3.19e-13 | Pass: mtf.maxAbs 2.66e-12 | Pass: mtf.maxAbs 2.72e-12 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: mtf.maxAbs 6.66e-13 | Pass: mtf.maxAbs 2.96e-12 | Pass: mtf.maxAbs 2.57e-12 |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | Pass: mtf.maxAbs 3.27e-13 | Pass: mtf.maxAbs 2.90e-12 | Pass: mtf.maxAbs 2.97e-12 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: mtf.maxAbs 2.58e-12 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 4.71e-12 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 1.51e-12 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: mtf.maxAbs 2.14e-12 | Pass: mtf.maxAbs 2.62e-12 | Pass: mtf.maxAbs 4.76e-12 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 2.50e-12 | Pass: mtf.maxAbs 4.29e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: mtf.maxAbs 7.73e-13 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 1.87e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 3.81e-13 | Pass: mtf.maxAbs 1.75e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: mtf.maxAbs 1.53e-12 | Pass: mtf.maxAbs 2.44e-12 | Pass: mtf.maxAbs 3.97e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 2.30e-12 | Pass: mtf.maxAbs 3.44e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: mtf.maxAbs 2.57e-12 | Pass: mtf.maxAbs 1.58e-12 | Pass: mtf.maxAbs 3.35e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | Pass: mtf.maxAbs 1.62e-12 | Pass: mtf.maxAbs 1.43e-12 | Pass: mtf.maxAbs 2.93e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: mtf.maxAbs 2.53e-12 | Pass: mtf.maxAbs 1.51e-12 | Pass: mtf.maxAbs 3.42e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 3.07e-12 |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: mtf.maxAbs 2.20e-12 | Pass: mtf.maxAbs 1.13e-11 | Pass: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-wide-best-photopic | 3 | Pass: mtf.maxAbs 2.60e-12 | Pass: mtf.maxAbs 9.87e-12 | Pass: mtf.maxAbs 1.00e-11 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: mtf.maxAbs 5.96e-13 | Pass: mtf.maxAbs 6.54e-12 | Pass: mtf.maxAbs 6.46e-12 |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | Pass: mtf.maxAbs 7.11e-13 | Pass: mtf.maxAbs 4.06e-12 | Pass: mtf.maxAbs 4.06e-12 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: mtf.maxAbs 5.47e-13 | Pass: mtf.maxAbs 1.18e-11 | Pass: mtf.maxAbs 1.15e-11 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | Pass: mtf.maxAbs 6.94e-13 | Pass: mtf.maxAbs 4.23e-12 | Pass: mtf.maxAbs 4.27e-12 |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: mtf.maxAbs 9.15e-13 | Pass: mtf.maxAbs 1.19e-11 | Pass: mtf.maxAbs 1.18e-11 |
| nikon-z-24-70f4s-tele-best-photopic | 3 | Pass: mtf.maxAbs 7.40e-13 | Pass: mtf.maxAbs 7.81e-12 | Pass: mtf.maxAbs 7.90e-12 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: mtf.maxAbs 3.13e-13 | Pass: mtf.maxAbs 6.62e-12 | Pass: mtf.maxAbs 6.57e-12 |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | Pass: mtf.maxAbs 5.49e-13 | Pass: mtf.maxAbs 8.72e-12 | Pass: mtf.maxAbs 8.51e-12 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: mtf.maxAbs 7.95e-13 | Pass: mtf.maxAbs 9.12e-12 | Pass: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | Pass: mtf.maxAbs 4.88e-13 | Pass: mtf.maxAbs 2.50e-12 | Pass: mtf.maxAbs 2.43e-12 |
| nikon-z-mc-105f28-best-ref | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.16e-12 |
| nikon-z-mc-105f28-best-photopic | 3 | Pass: mtf.maxAbs 8.38e-13 | Pass: mtf.maxAbs 3.77e-13 | Pass: mtf.maxAbs 5.99e-13 |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: mtf.maxAbs 1.05e-12 | Pass: mtf.maxAbs 6.47e-13 | Pass: mtf.maxAbs 5.71e-13 |
| nikon-z-mc-105f28-f8-photopic | 3 | Pass: mtf.maxAbs 2.46e-13 | Pass: mtf.maxAbs 3.33e-13 | Pass: mtf.maxAbs 4.84e-13 |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: mtf.maxAbs 9.20e-13 | Pass: mtf.maxAbs 5.83e-13 | Pass: mtf.maxAbs 5.03e-13 |
| nikon-z-mc-105f28-f8-best-photopic | 3 | Pass: mtf.maxAbs 8.78e-13 | Pass: mtf.maxAbs 3.44e-13 | Pass: mtf.maxAbs 5.67e-13 |
| nikon-z-135f18-plena-best-ref | 3 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 1.61e-12 | Pass: mtf.maxAbs 3.03e-12 |
| nikon-z-135f18-plena-best-photopic | 3 | Pass: mtf.maxAbs 1.53e-12 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 2.73e-12 |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: mtf.maxAbs 4.28e-13 | Pass: mtf.maxAbs 6.13e-13 | Pass: mtf.maxAbs 8.76e-13 |
| nikon-z-135f18-plena-f8-photopic | 3 | Pass: mtf.maxAbs 4.75e-13 | Pass: mtf.maxAbs 6.31e-13 | Pass: mtf.maxAbs 1.11e-12 |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: mtf.maxAbs 4.84e-13 | Pass: mtf.maxAbs 6.20e-13 | Pass: mtf.maxAbs 9.40e-13 |
| nikon-z-135f18-plena-f8-best-photopic | 3 | Pass: mtf.maxAbs 4.77e-13 | Pass: mtf.maxAbs 6.33e-13 | Pass: mtf.maxAbs 1.11e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: mtf.maxAbs 1.00e-11 | Pass: mtf.maxAbs 4.56e-12 | Pass: mtf.maxAbs 1.01e-11 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | Pass: mtf.maxAbs 7.76e-12 | Pass: mtf.maxAbs 2.37e-12 | Pass: mtf.maxAbs 8.37e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: mtf.maxAbs 7.03e-13 | Pass: mtf.maxAbs 4.51e-12 | Pass: mtf.maxAbs 4.67e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | Pass: mtf.maxAbs 2.18e-13 | Pass: mtf.maxAbs 3.35e-12 | Pass: mtf.maxAbs 3.53e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: mtf.maxAbs 5.35e-13 | Pass: mtf.maxAbs 4.27e-12 | Pass: mtf.maxAbs 4.37e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | Pass: mtf.maxAbs 2.05e-13 | Pass: mtf.maxAbs 3.59e-12 | Pass: mtf.maxAbs 3.74e-12 |

## Spot and fan rays — `spot-rays`

Compares: Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 4.58e-13 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 1.92e1 deg, line 8, ray 263 |
| lv – optiland | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.07e-13 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | field 2.36e0 deg, line 7 |
| lv – optiland | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 8.32e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 5 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 886548 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.73e-13 | sony-fe-20mm-f18-g-photopic | field 2.82e1 deg, line 2, ray 5 |
| lv – reference-tracer | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.22e-13 | sony-fe-20mm-f18-g-photopic | field 3.53e1 deg, line 8 |
| lv – reference-tracer | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 9.22e-14 | sony-fe-20mm-f18-g-photopic | field 2.82e1 deg, line 8 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 886548 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.73e-13 | sony-fe-20mm-f18-g-photopic | field 2.82e1 deg, line 4, ray 5 |
| optiland – reference-tracer | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.31e-13 | sony-fe-20mm-f18-g-photopic | field 3.53e1 deg, line 7 |
| optiland – reference-tracer | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 1.06e-13 | sony-fe-20mm-f18-g-ref | field 2.82e1 deg, line 0 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 886548 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 10 | Pass: transverseError.maxAbs 1.58e-13 mm | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 1.39e-13 mm | 1580 / 364 / 0 | 1580 / 364 / 0 | 1580 / 364 / 0 |
| canon-ef-135-f2l-usm-photopic | 90 | Pass: transverseError.maxAbs 1.88e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 2.07e-13 mm | 14234 / 3262 / 0 | 14234 / 3262 / 0 | 14234 / 3262 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 10 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 4.97e-14 mm | Pass: transverseError.maxAbs 6.66e-14 mm | 1854 / 90 / 0 | 1854 / 90 / 0 | 1854 / 90 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 90 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.10e-13 mm | 16686 / 810 / 0 | 16686 / 810 / 0 | 16686 / 810 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 10 | Pass: transverseError.maxAbs 2.11e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | 1752 / 192 / 0 | 1752 / 192 / 0 | 1752 / 192 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 90 | Pass: transverseError.maxAbs 2.13e-13 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.52e-13 mm | 15746 / 1750 / 0 | 15746 / 1750 / 0 | 15746 / 1750 / 0 |
| nikkor-z50f12-ref | 10 | Pass: transverseError.maxAbs 2.96e-13 mm | Pass: transverseError.maxAbs 3.33e-13 mm | Pass: transverseError.maxAbs 2.60e-13 mm | 1667 / 277 / 0 | 1667 / 277 / 0 | 1667 / 277 / 0 |
| nikkor-z50f12-photopic | 90 | Pass: transverseError.maxAbs 3.62e-13 mm | Pass: transverseError.maxAbs 3.10e-13 mm | Pass: transverseError.maxAbs 3.14e-13 mm | 15003 / 2493 / 0 | 15003 / 2493 / 0 | 15003 / 2493 / 0 |
| sony-fe-20mm-f18-g-ref | 10 | Pass: transverseError.maxAbs 1.30e-13 mm | Pass: transverseError.maxAbs 6.66e-13 mm | Pass: transverseError.maxAbs 6.31e-13 mm | 1929 / 15 / 0 | 1929 / 15 / 0 | 1929 / 15 / 0 |
| sony-fe-20mm-f18-g-photopic | 90 | Pass: transverseError.maxAbs 3.80e-13 mm | Pass: transverseError.maxAbs 6.73e-13 mm | Pass: transverseError.maxAbs 6.73e-13 mm | 17360 / 136 / 0 | 17360 / 136 / 0 | 17360 / 136 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 10 | Pass: transverseError.maxAbs 2.95e-13 mm | Pass: transverseError.maxAbs 2.72e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 1708 / 236 / 0 | 1708 / 236 / 0 | 1708 / 236 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 90 | Pass: transverseError.maxAbs 3.93e-13 mm | Pass: transverseError.maxAbs 2.74e-13 mm | Pass: transverseError.maxAbs 3.96e-13 mm | 15364 / 2132 / 0 | 15364 / 2132 / 0 | 15364 / 2132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 10 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 1.00e-13 mm | Pass: transverseError.maxAbs 1.65e-13 mm | 1771 / 173 / 0 | 1771 / 173 / 0 | 1771 / 173 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 90 | Pass: transverseError.maxAbs 2.74e-13 mm | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 15943 / 1553 / 0 | 15943 / 1553 / 0 | 15943 / 1553 / 0 |
| nikon-z-24-70f4s-wide-ref | 10 | Pass: transverseError.maxAbs 7.37e-14 mm | Pass: transverseError.maxAbs 3.07e-13 mm | Pass: transverseError.maxAbs 2.91e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-wide-photopic | 90 | Pass: transverseError.maxAbs 1.12e-13 mm | Pass: transverseError.maxAbs 3.20e-13 mm | Pass: transverseError.maxAbs 3.59e-13 mm | 17329 / 167 / 0 | 17329 / 167 / 0 | 17329 / 167 / 0 |
| nikon-z-24-70f4s-tele-ref | 10 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | Pass: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-tele-photopic | 90 | Pass: transverseError.maxAbs 3.38e-13 mm | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 4.49e-13 mm | 16517 / 979 / 0 | 16517 / 979 / 0 | 16517 / 979 / 0 |
| nikon-z-mc-105f28-ref | 10 | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 1.41e-13 mm | Pass: transverseError.maxAbs 1.34e-13 mm | 1614 / 330 / 0 | 1614 / 330 / 0 | 1614 / 330 / 0 |
| nikon-z-mc-105f28-photopic | 90 | Pass: transverseError.maxAbs 1.57e-13 mm | Pass: transverseError.maxAbs 1.67e-13 mm | Pass: transverseError.maxAbs 1.77e-13 mm | 14518 / 2978 / 0 | 14518 / 2978 / 0 | 14518 / 2978 / 0 |
| nikon-z-135f18-plena-ref | 10 | Pass: transverseError.maxAbs 1.51e-13 mm | Pass: transverseError.maxAbs 9.77e-14 mm | Pass: transverseError.maxAbs 1.50e-13 mm | 1935 / 9 / 0 | 1935 / 9 / 0 | 1935 / 9 / 0 |
| nikon-z-135f18-plena-photopic | 90 | Pass: transverseError.maxAbs 1.74e-13 mm | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 1.64e-13 mm | 17403 / 93 / 0 | 17403 / 93 / 0 | 17403 / 93 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 10 | Pass: transverseError.maxAbs 4.03e-13 mm | Pass: transverseError.maxAbs 5.72e-13 mm | Pass: transverseError.maxAbs 4.12e-13 mm | 1696 / 248 / 0 | 1696 / 248 / 0 | 1696 / 248 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 90 | Pass: transverseError.maxAbs 4.58e-13 mm | Pass: transverseError.maxAbs 6.09e-13 mm | Pass: transverseError.maxAbs 3.89e-13 mm | 15267 / 2229 / 0 | 15267 / 2229 / 0 | 15267 / 2229 / 0 |
| canon-ef-135-f2l-usm-best-ref | 10 | Pass: transverseError.maxAbs 1.58e-13 mm | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 1.37e-13 mm | 1580 / 364 / 0 | 1580 / 364 / 0 | 1580 / 364 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 90 | Pass: transverseError.maxAbs 1.87e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 2.04e-13 mm | 14234 / 3262 / 0 | 14234 / 3262 / 0 | 14234 / 3262 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 10 | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 90 | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 9.41e-14 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 10 | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 90 | Pass: transverseError.maxAbs 1.10e-13 mm | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 9.41e-14 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 10 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 4.97e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | 1854 / 90 / 0 | 1854 / 90 / 0 | 1854 / 90 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 90 | Pass: transverseError.maxAbs 1.10e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.10e-13 mm | 16686 / 810 / 0 | 16686 / 810 / 0 | 16686 / 810 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 90 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 90 | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 10 | Pass: transverseError.maxAbs 2.11e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 2.08e-13 mm | 1752 / 192 / 0 | 1752 / 192 / 0 | 1752 / 192 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 90 | Pass: transverseError.maxAbs 2.15e-13 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.52e-13 mm | 15746 / 1750 / 0 | 15746 / 1750 / 0 | 15746 / 1750 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 10 | Pass: transverseError.maxAbs 8.70e-14 mm | Pass: transverseError.maxAbs 2.42e-13 mm | Pass: transverseError.maxAbs 2.56e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 90 | Pass: transverseError.maxAbs 1.42e-13 mm | Pass: transverseError.maxAbs 2.50e-13 mm | Pass: transverseError.maxAbs 2.86e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 10 | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.56e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 90 | Pass: transverseError.maxAbs 1.44e-13 mm | Pass: transverseError.maxAbs 2.54e-13 mm | Pass: transverseError.maxAbs 2.86e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| nikkor-z50f12-best-ref | 10 | Pass: transverseError.maxAbs 2.96e-13 mm | Pass: transverseError.maxAbs 3.33e-13 mm | Pass: transverseError.maxAbs 2.59e-13 mm | 1667 / 277 / 0 | 1667 / 277 / 0 | 1667 / 277 / 0 |
| nikkor-z50f12-best-photopic | 90 | Pass: transverseError.maxAbs 3.62e-13 mm | Pass: transverseError.maxAbs 3.10e-13 mm | Pass: transverseError.maxAbs 3.14e-13 mm | 15003 / 2493 / 0 | 15003 / 2493 / 0 | 15003 / 2493 / 0 |
| nikkor-z50f12-f8-ref | 10 | Pass: transverseError.maxAbs 1.19e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 90 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 1.10e-13 mm | Pass: transverseError.maxAbs 1.24e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikkor-z50f12-f8-best-ref | 10 | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 90 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 1.10e-13 mm | Pass: transverseError.maxAbs 1.23e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sony-fe-20mm-f18-g-best-ref | 10 | Pass: transverseError.maxAbs 1.30e-13 mm | Pass: transverseError.maxAbs 6.68e-13 mm | Pass: transverseError.maxAbs 6.32e-13 mm | 1929 / 15 / 0 | 1929 / 15 / 0 | 1929 / 15 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 90 | Pass: transverseError.maxAbs 3.80e-13 mm | Pass: transverseError.maxAbs 6.71e-13 mm | Pass: transverseError.maxAbs 6.73e-13 mm | 17360 / 136 / 0 | 17360 / 136 / 0 | 17360 / 136 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 10 | Pass: transverseError.maxAbs 6.93e-14 mm | Pass: transverseError.maxAbs 2.52e-13 mm | Pass: transverseError.maxAbs 2.68e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 90 | Pass: transverseError.maxAbs 2.13e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | Pass: transverseError.maxAbs 3.20e-13 mm | 17475 / 21 / 0 | 17475 / 21 / 0 | 17475 / 21 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 2.52e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 90 | Pass: transverseError.maxAbs 2.10e-13 mm | Pass: transverseError.maxAbs 2.86e-13 mm | Pass: transverseError.maxAbs 3.20e-13 mm | 17475 / 21 / 0 | 17475 / 21 / 0 | 17475 / 21 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 10 | Pass: transverseError.maxAbs 2.91e-13 mm | Pass: transverseError.maxAbs 2.74e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | 1708 / 236 / 0 | 1708 / 236 / 0 | 1708 / 236 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 90 | Pass: transverseError.maxAbs 3.93e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | Pass: transverseError.maxAbs 3.97e-13 mm | 15364 / 2132 / 0 | 15364 / 2132 / 0 | 15364 / 2132 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 10 | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 1.67e-13 mm | Pass: transverseError.maxAbs 2.10e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 90 | Pass: transverseError.maxAbs 3.30e-13 mm | Pass: transverseError.maxAbs 2.10e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 10 | Pass: transverseError.maxAbs 2.49e-13 mm | Pass: transverseError.maxAbs 1.71e-13 mm | Pass: transverseError.maxAbs 2.13e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 90 | Pass: transverseError.maxAbs 3.34e-13 mm | Pass: transverseError.maxAbs 2.10e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 10 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 1.00e-13 mm | Pass: transverseError.maxAbs 1.65e-13 mm | 1771 / 173 / 0 | 1771 / 173 / 0 | 1771 / 173 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 90 | Pass: transverseError.maxAbs 2.77e-13 mm | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 15943 / 1553 / 0 | 15943 / 1553 / 0 | 15943 / 1553 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 10 | Pass: transverseError.maxAbs 1.87e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.62e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 90 | Pass: transverseError.maxAbs 2.84e-13 mm | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 2.59e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 10 | Pass: transverseError.maxAbs 1.88e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.63e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 90 | Pass: transverseError.maxAbs 2.81e-13 mm | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 2.59e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 10 | Pass: transverseError.maxAbs 7.28e-14 mm | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 2.90e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 90 | Pass: transverseError.maxAbs 1.12e-13 mm | Pass: transverseError.maxAbs 3.20e-13 mm | Pass: transverseError.maxAbs 3.57e-13 mm | 17329 / 167 / 0 | 17329 / 167 / 0 | 17329 / 167 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 2.82e-13 mm | Pass: transverseError.maxAbs 2.75e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 90 | Pass: transverseError.maxAbs 3.78e-13 mm | Pass: transverseError.maxAbs 3.57e-13 mm | Pass: transverseError.maxAbs 3.71e-13 mm | 17444 / 52 / 0 | 17444 / 52 / 0 | 17444 / 52 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 2.82e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 90 | Pass: transverseError.maxAbs 3.78e-13 mm | Pass: transverseError.maxAbs 3.55e-13 mm | Pass: transverseError.maxAbs 3.71e-13 mm | 17444 / 52 / 0 | 17444 / 52 / 0 | 17444 / 52 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 10 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | Pass: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 90 | Pass: transverseError.maxAbs 3.38e-13 mm | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 4.49e-13 mm | 16517 / 979 / 0 | 16517 / 979 / 0 | 16517 / 979 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 90 | Pass: transverseError.maxAbs 2.03e-13 mm | Pass: transverseError.maxAbs 4.09e-13 mm | Pass: transverseError.maxAbs 4.23e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 90 | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 4.09e-13 mm | Pass: transverseError.maxAbs 4.25e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-mc-105f28-best-ref | 10 | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 1.40e-13 mm | Pass: transverseError.maxAbs 1.34e-13 mm | 1614 / 330 / 0 | 1614 / 330 / 0 | 1614 / 330 / 0 |
| nikon-z-mc-105f28-best-photopic | 90 | Pass: transverseError.maxAbs 1.57e-13 mm | Pass: transverseError.maxAbs 1.68e-13 mm | Pass: transverseError.maxAbs 1.78e-13 mm | 14518 / 2978 / 0 | 14518 / 2978 / 0 | 14518 / 2978 / 0 |
| nikon-z-mc-105f28-f8-ref | 10 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 1.31e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 90 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 1.53e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 10 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 1.39e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 90 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 1.49e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-135f18-plena-best-ref | 10 | Pass: transverseError.maxAbs 1.49e-13 mm | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 1.50e-13 mm | 1935 / 9 / 0 | 1935 / 9 / 0 | 1935 / 9 / 0 |
| nikon-z-135f18-plena-best-photopic | 90 | Pass: transverseError.maxAbs 1.78e-13 mm | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 1.64e-13 mm | 17403 / 93 / 0 | 17403 / 93 / 0 | 17403 / 93 / 0 |
| nikon-z-135f18-plena-f8-ref | 10 | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 7.11e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 90 | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 10 | Pass: transverseError.maxAbs 8.35e-14 mm | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 90 | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 10 | Pass: transverseError.maxAbs 4.05e-13 mm | Pass: transverseError.maxAbs 5.74e-13 mm | Pass: transverseError.maxAbs 4.12e-13 mm | 1696 / 248 / 0 | 1696 / 248 / 0 | 1696 / 248 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 90 | Pass: transverseError.maxAbs 4.58e-13 mm | Pass: transverseError.maxAbs 6.08e-13 mm | Pass: transverseError.maxAbs 3.89e-13 mm | 15267 / 2229 / 0 | 15267 / 2229 / 0 | 15267 / 2229 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 10 | Pass: transverseError.maxAbs 4.80e-14 mm | Pass: transverseError.maxAbs 2.34e-13 mm | Pass: transverseError.maxAbs 2.26e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 90 | Pass: transverseError.maxAbs 6.39e-14 mm | Pass: transverseError.maxAbs 2.72e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 10 | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 2.33e-13 mm | Pass: transverseError.maxAbs 2.24e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 90 | Pass: transverseError.maxAbs 6.39e-14 mm | Pass: transverseError.maxAbs 2.72e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |

## Spherical aberration and axial colour rays — `axial-rays`

Compares: Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.95e-13 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 1, ray 36 |
| lv – optiland | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.20e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 1, ray 36 |
| lv – optiland | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 6.91e-14 | nikkor-z50f12-photopic | field 0 deg, line 1 |
| lv – optiland | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 6.25e-13 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 1 |
| lv – optiland | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 7.94e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 4 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 27360 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.75e-13 | nikkor-z50f12-photopic | field 0 deg, line 7, ray 34 |
| lv – reference-tracer | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 4.46e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 6, ray 36 |
| lv – reference-tracer | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 7.97e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 2 |
| lv – reference-tracer | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.42e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 1 |
| lv – reference-tracer | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 7.94e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 7 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 27360 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.92e-13 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 1, ray 36 |
| optiland – reference-tracer | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.14e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 1, ray 36 |
| optiland – reference-tracer | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 1.12e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 6 |
| optiland – reference-tracer | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.62e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0 deg, line 2 |
| optiland – reference-tracer | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 8.35e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0 deg, line 7 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 27360 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | Pass: intercept.maxScaled 5.69e-14 mm | Pass: intercept.maxScaled 6.28e-14 mm | Pass: intercept.maxScaled 8.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 18 | Pass: intercept.maxScaled 1.15e-13 mm | Pass: intercept.maxScaled 9.36e-14 mm | Pass: intercept.maxScaled 1.24e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | Pass: intercept.maxScaled 2.49e-14 mm | Pass: intercept.maxScaled 2.11e-14 mm | Pass: intercept.maxScaled 3.40e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 18 | Pass: intercept.maxScaled 6.11e-14 mm | Pass: intercept.maxScaled 3.85e-14 mm | Pass: intercept.maxScaled 5.87e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | Pass: intercept.maxScaled 7.30e-14 mm | Pass: intercept.maxScaled 4.78e-14 mm | Pass: intercept.maxScaled 3.99e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 18 | Pass: intercept.maxScaled 1.31e-13 mm | Pass: intercept.maxScaled 7.65e-14 mm | Pass: intercept.maxScaled 1.46e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-ref | 3 | Pass: intercept.maxScaled 1.69e-13 mm | Pass: intercept.maxScaled 1.16e-13 mm | Pass: intercept.maxScaled 1.41e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-photopic | 18 | Pass: intercept.maxScaled 2.23e-13 mm | Pass: intercept.maxScaled 2.75e-13 mm | Pass: intercept.maxScaled 2.35e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | Pass: intercept.maxScaled 7.65e-14 mm | Pass: intercept.maxScaled 3.14e-14 mm | Pass: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 18 | Pass: intercept.maxScaled 1.06e-13 mm | Pass: intercept.maxScaled 4.46e-14 mm | Pass: intercept.maxScaled 9.83e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | Pass: intercept.maxScaled 1.68e-13 mm | Pass: intercept.maxScaled 1.51e-13 mm | Pass: intercept.maxScaled 1.94e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 18 | Pass: intercept.maxScaled 2.93e-13 mm | Pass: intercept.maxScaled 2.45e-13 mm | Pass: intercept.maxScaled 2.83e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 7.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 18 | Pass: intercept.maxScaled 7.07e-14 mm | Pass: intercept.maxScaled 6.19e-14 mm | Pass: intercept.maxScaled 1.01e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | Pass: intercept.maxScaled 2.89e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | Pass: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 18 | Pass: intercept.maxScaled 4.67e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | Pass: intercept.maxScaled 1.11e-13 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 18 | Pass: intercept.maxScaled 9.59e-14 mm | Pass: intercept.maxScaled 2.34e-13 mm | Pass: intercept.maxScaled 2.31e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-ref | 3 | Pass: intercept.maxScaled 5.61e-14 mm | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 8.36e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 18 | Pass: intercept.maxScaled 7.16e-14 mm | Pass: intercept.maxScaled 7.36e-14 mm | Pass: intercept.maxScaled 7.62e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-ref | 3 | Pass: intercept.maxScaled 6.94e-14 mm | Pass: intercept.maxScaled 5.97e-14 mm | Pass: intercept.maxScaled 8.32e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 18 | Pass: intercept.maxScaled 1.23e-13 mm | Pass: intercept.maxScaled 7.45e-14 mm | Pass: intercept.maxScaled 1.11e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | Pass: intercept.maxScaled 3.71e-14 mm | Pass: intercept.maxScaled 1.66e-13 mm | Pass: intercept.maxScaled 1.62e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 18 | Pass: intercept.maxScaled 4.02e-14 mm | Pass: intercept.maxScaled 1.63e-13 mm | Pass: intercept.maxScaled 1.77e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | Pass: intercept.maxScaled 5.69e-14 mm | Pass: intercept.maxScaled 6.28e-14 mm | Pass: intercept.maxScaled 8.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 18 | Pass: intercept.maxScaled 1.15e-13 mm | Pass: intercept.maxScaled 9.36e-14 mm | Pass: intercept.maxScaled 1.24e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | Pass: intercept.maxScaled 2.19e-14 mm | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.88e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 18 | Pass: intercept.maxScaled 3.21e-14 mm | Pass: intercept.maxScaled 2.34e-14 mm | Pass: intercept.maxScaled 3.47e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | Pass: intercept.maxScaled 2.19e-14 mm | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.88e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 18 | Pass: intercept.maxScaled 3.21e-14 mm | Pass: intercept.maxScaled 2.34e-14 mm | Pass: intercept.maxScaled 3.47e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | Pass: intercept.maxScaled 2.49e-14 mm | Pass: intercept.maxScaled 2.11e-14 mm | Pass: intercept.maxScaled 3.40e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 18 | Pass: intercept.maxScaled 6.11e-14 mm | Pass: intercept.maxScaled 3.85e-14 mm | Pass: intercept.maxScaled 5.87e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | Pass: intercept.maxScaled 1.99e-14 mm | Pass: intercept.maxScaled 8.54e-15 mm | Pass: intercept.maxScaled 1.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 18 | Pass: intercept.maxScaled 1.81e-14 mm | Pass: intercept.maxScaled 1.51e-14 mm | Pass: intercept.maxScaled 1.87e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | Pass: intercept.maxScaled 1.99e-14 mm | Pass: intercept.maxScaled 8.54e-15 mm | Pass: intercept.maxScaled 1.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 18 | Pass: intercept.maxScaled 1.81e-14 mm | Pass: intercept.maxScaled 1.51e-14 mm | Pass: intercept.maxScaled 1.87e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | Pass: intercept.maxScaled 7.30e-14 mm | Pass: intercept.maxScaled 4.78e-14 mm | Pass: intercept.maxScaled 3.99e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 18 | Pass: intercept.maxScaled 1.31e-13 mm | Pass: intercept.maxScaled 7.65e-14 mm | Pass: intercept.maxScaled 1.46e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | Pass: intercept.maxScaled 1.27e-14 mm | Pass: intercept.maxScaled 4.69e-15 mm | Pass: intercept.maxScaled 1.28e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 18 | Pass: intercept.maxScaled 2.15e-14 mm | Pass: intercept.maxScaled 8.62e-15 mm | Pass: intercept.maxScaled 1.99e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | Pass: intercept.maxScaled 1.27e-14 mm | Pass: intercept.maxScaled 4.69e-15 mm | Pass: intercept.maxScaled 1.28e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 18 | Pass: intercept.maxScaled 2.15e-14 mm | Pass: intercept.maxScaled 8.62e-15 mm | Pass: intercept.maxScaled 1.99e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-best-ref | 3 | Pass: intercept.maxScaled 1.69e-13 mm | Pass: intercept.maxScaled 1.16e-13 mm | Pass: intercept.maxScaled 1.41e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-best-photopic | 18 | Pass: intercept.maxScaled 2.23e-13 mm | Pass: intercept.maxScaled 2.75e-13 mm | Pass: intercept.maxScaled 2.35e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-f8-ref | 3 | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.32e-14 mm | Pass: intercept.maxScaled 1.16e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 18 | Pass: intercept.maxScaled 2.27e-14 mm | Pass: intercept.maxScaled 1.23e-14 mm | Pass: intercept.maxScaled 2.07e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | Pass: intercept.maxScaled 1.49e-14 mm | Pass: intercept.maxScaled 1.32e-14 mm | Pass: intercept.maxScaled 1.16e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 18 | Pass: intercept.maxScaled 2.27e-14 mm | Pass: intercept.maxScaled 1.23e-14 mm | Pass: intercept.maxScaled 2.07e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | Pass: intercept.maxScaled 7.65e-14 mm | Pass: intercept.maxScaled 3.14e-14 mm | Pass: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 18 | Pass: intercept.maxScaled 1.06e-13 mm | Pass: intercept.maxScaled 4.46e-14 mm | Pass: intercept.maxScaled 9.83e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 4.97e-15 mm | Pass: intercept.maxScaled 7.11e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 18 | Pass: intercept.maxScaled 1.36e-14 mm | Pass: intercept.maxScaled 1.12e-14 mm | Pass: intercept.maxScaled 1.40e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 4.97e-15 mm | Pass: intercept.maxScaled 7.11e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 18 | Pass: intercept.maxScaled 1.36e-14 mm | Pass: intercept.maxScaled 1.12e-14 mm | Pass: intercept.maxScaled 1.40e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | Pass: intercept.maxScaled 1.68e-13 mm | Pass: intercept.maxScaled 1.51e-13 mm | Pass: intercept.maxScaled 1.94e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 18 | Pass: intercept.maxScaled 2.93e-13 mm | Pass: intercept.maxScaled 2.45e-13 mm | Pass: intercept.maxScaled 2.83e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 4.72e-14 mm | Pass: intercept.maxScaled 5.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 18 | Pass: intercept.maxScaled 7.76e-14 mm | Pass: intercept.maxScaled 5.86e-14 mm | Pass: intercept.maxScaled 7.11e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 4.72e-14 mm | Pass: intercept.maxScaled 5.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 18 | Pass: intercept.maxScaled 7.76e-14 mm | Pass: intercept.maxScaled 5.86e-14 mm | Pass: intercept.maxScaled 7.11e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 4.28e-14 mm | Pass: intercept.maxScaled 7.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 18 | Pass: intercept.maxScaled 7.07e-14 mm | Pass: intercept.maxScaled 6.19e-14 mm | Pass: intercept.maxScaled 1.01e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | Pass: intercept.maxScaled 2.06e-14 mm | Pass: intercept.maxScaled 1.81e-14 mm | Pass: intercept.maxScaled 2.24e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 18 | Pass: intercept.maxScaled 3.67e-14 mm | Pass: intercept.maxScaled 2.26e-14 mm | Pass: intercept.maxScaled 3.51e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | Pass: intercept.maxScaled 2.06e-14 mm | Pass: intercept.maxScaled 1.81e-14 mm | Pass: intercept.maxScaled 2.24e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 18 | Pass: intercept.maxScaled 3.67e-14 mm | Pass: intercept.maxScaled 2.26e-14 mm | Pass: intercept.maxScaled 3.51e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | Pass: intercept.maxScaled 2.89e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | Pass: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 18 | Pass: intercept.maxScaled 4.67e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 18 | Pass: intercept.maxScaled 2.33e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 8.79e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 18 | Pass: intercept.maxScaled 2.33e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 8.79e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | Pass: intercept.maxScaled 1.11e-13 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 18 | Pass: intercept.maxScaled 9.59e-14 mm | Pass: intercept.maxScaled 2.34e-13 mm | Pass: intercept.maxScaled 2.31e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | Pass: intercept.maxScaled 2.41e-14 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 18 | Pass: intercept.maxScaled 2.95e-13 mm | Pass: intercept.maxScaled 2.53e-13 mm | Pass: intercept.maxScaled 2.92e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | Pass: intercept.maxScaled 2.41e-14 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 18 | Pass: intercept.maxScaled 2.95e-13 mm | Pass: intercept.maxScaled 2.53e-13 mm | Pass: intercept.maxScaled 2.92e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | Pass: intercept.maxScaled 5.61e-14 mm | Pass: intercept.maxScaled 6.39e-14 mm | Pass: intercept.maxScaled 8.36e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 18 | Pass: intercept.maxScaled 7.16e-14 mm | Pass: intercept.maxScaled 7.36e-14 mm | Pass: intercept.maxScaled 7.62e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | Pass: intercept.maxScaled 3.21e-14 mm | Pass: intercept.maxScaled 1.65e-14 mm | Pass: intercept.maxScaled 2.19e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 18 | Pass: intercept.maxScaled 2.48e-14 mm | Pass: intercept.maxScaled 2.42e-14 mm | Pass: intercept.maxScaled 3.30e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | Pass: intercept.maxScaled 3.21e-14 mm | Pass: intercept.maxScaled 1.65e-14 mm | Pass: intercept.maxScaled 2.19e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 18 | Pass: intercept.maxScaled 2.48e-14 mm | Pass: intercept.maxScaled 2.42e-14 mm | Pass: intercept.maxScaled 3.30e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | Pass: intercept.maxScaled 6.94e-14 mm | Pass: intercept.maxScaled 5.97e-14 mm | Pass: intercept.maxScaled 8.32e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 18 | Pass: intercept.maxScaled 1.23e-13 mm | Pass: intercept.maxScaled 7.45e-14 mm | Pass: intercept.maxScaled 1.11e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | Pass: intercept.maxScaled 3.07e-14 mm | Pass: intercept.maxScaled 1.45e-14 mm | Pass: intercept.maxScaled 1.62e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 18 | Pass: intercept.maxScaled 2.27e-14 mm | Pass: intercept.maxScaled 1.92e-14 mm | Pass: intercept.maxScaled 2.26e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | Pass: intercept.maxScaled 3.07e-14 mm | Pass: intercept.maxScaled 1.45e-14 mm | Pass: intercept.maxScaled 1.62e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 18 | Pass: intercept.maxScaled 2.27e-14 mm | Pass: intercept.maxScaled 1.92e-14 mm | Pass: intercept.maxScaled 2.26e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | Pass: intercept.maxScaled 3.71e-14 mm | Pass: intercept.maxScaled 1.66e-13 mm | Pass: intercept.maxScaled 1.62e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 18 | Pass: intercept.maxScaled 4.02e-14 mm | Pass: intercept.maxScaled 1.63e-13 mm | Pass: intercept.maxScaled 1.77e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | Pass: intercept.maxScaled 1.06e-14 mm | Pass: intercept.maxScaled 3.63e-14 mm | Pass: intercept.maxScaled 4.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 18 | Pass: intercept.maxScaled 1.06e-14 mm | Pass: intercept.maxScaled 4.10e-14 mm | Pass: intercept.maxScaled 4.49e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | Pass: intercept.maxScaled 1.06e-14 mm | Pass: intercept.maxScaled 3.63e-14 mm | Pass: intercept.maxScaled 4.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 18 | Pass: intercept.maxScaled 1.06e-14 mm | Pass: intercept.maxScaled 4.10e-14 mm | Pass: intercept.maxScaled 4.49e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |

## Chief rays (distortion, pupils, lateral colour) — `chief-rays`

Compares: Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.99e-13 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | line 5, ray 16 |
| lv – optiland | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 2.30e-13 | sigma-105mm-f28-dg-dn-macro-art-best-photopic | line 4, ray 30 |
| lv – optiland | Largest difference of distortion — `distortion.maxAbs` | percent | — | 1.47e-12 | sony-fe-400mm-f28-gm-oss-best-photopic | line 7, ray 9 |
| lv – optiland | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 3.23e-13 | nikon-z-mc-105f28-photopic | line 8, ray 30 |
| lv – optiland | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.32e-12 | nikon-z-mc-105f28-photopic | line 8, ray 30 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 71520 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 2.49e-13 | sigma-105mm-f28-dg-dn-macro-art-photopic | line 5, ray 20 |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.23e-13 | sony-fe-20mm-f18-g-photopic | line 5, ray 17 |
| lv – reference-tracer | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.53e-13 | sony-fe-20mm-f18-g-photopic | line 5, ray 17 |
| lv – reference-tracer | Largest difference of distortion — `distortion.maxAbs` | percent | — | 2.28e-12 | nikon-z-24-70f4s-wide-best-photopic | line 0, ray 11 |
| lv – reference-tracer | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 4.92e-13 | nikon-z-24-70f4s-wide-photopic | line 5, ray 8 |
| lv – reference-tracer | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.96e-12 | nikon-z-24-70f4s-wide-photopic | line 5, ray 8 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 71520 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 3.38e-13 | sony-fe-20mm-f18-g-photopic | line 5, ray 17 |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.23e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 18 |
| optiland – reference-tracer | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.41e-13 | sony-fe-20mm-f18-g-photopic | line 7, ray 17 |
| optiland – reference-tracer | Largest difference of distortion — `distortion.maxAbs` | percent | — | 2.24e-12 | nikon-z-24-70f4s-wide-best-photopic | line 1, ray 11 |
| optiland – reference-tracer | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 4.81e-13 | nikon-z-24-70f4s-wide-photopic | line 6, ray 8 |
| optiland – reference-tracer | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.96e-12 | nikon-z-24-70f4s-wide-photopic | line 6, ray 8 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 71520 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 3.41e-13 | sony-fe-20mm-f18-g-photopic | line 7, ray 17 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 4 | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-photopic | 4 | Pass: distortion.maxScaled 1.29e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.76e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.53e-13 mm | Pass: distortion.maxScaled 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 4 | Pass: lateralColour.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 4 | Pass: lateralColour.maxAbs 2.49e-13 mm | Pass: distortion.maxScaled 1.37e-13 mm | Pass: lateralColour.maxAbs 2.03e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 4 | Pass: distortion.maxScaled 5.29e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-best-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 8.53e-14 mm | Pass: lateralColour.maxAbs 1.35e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: lateralColour.maxAbs 1.35e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 4 | Pass: distortion.maxScaled 7.93e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 4 | Pass: distortion.maxScaled 8.75e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 4 | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 4 | Pass: distortion.maxScaled 7.93e-14 mm | Pass: distortion.maxScaled 5.14e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 4 | Pass: distortion.maxScaled 8.75e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: distortion.maxScaled 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 4 | Pass: distortion.maxScaled 1.38e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.49e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 4 | Pass: distortion.maxScaled 1.32e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-best-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-best-photopic | 4 | Pass: distortion.maxScaled 1.29e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.76e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 4 | Pass: distortion.maxScaled 1.29e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.76e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 4 | Pass: distortion.maxScaled 1.33e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.53e-13 mm | Pass: distortion.maxScaled 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.53e-13 mm | Pass: distortion.maxScaled 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.53e-13 mm | Pass: lateralColour.maxAbs 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 4 | Pass: distortion.maxScaled 1.56e-13 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 4 | Pass: lateralColour.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 4 | Pass: lateralColour.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 4 | Pass: lateralColour.maxAbs 2.49e-13 mm | Pass: distortion.maxScaled 1.38e-13 mm | Pass: lateralColour.maxAbs 2.03e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 4 | Pass: lateralColour.maxAbs 2.49e-13 mm | Pass: distortion.maxScaled 1.37e-13 mm | Pass: lateralColour.maxAbs 2.03e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 2.42e-13 mm | Pass: distortion.maxScaled 1.38e-13 mm | Pass: lateralColour.maxAbs 2.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 4 | Pass: distortion.maxScaled 8.10e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 4 | Pass: distortion.maxScaled 8.10e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.03e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.07e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.07e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 4 | Pass: distortion.maxScaled 4.93e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 4 | Pass: distortion.maxScaled 5.29e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 4 | Pass: distortion.maxScaled 4.67e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## Field-curve rays — `field-curve-rays`

Compares: Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.18e-13 | sony-fe-20mm-f18-g-photopic | line 6, ray 1592 |
| lv – optiland | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.49e-13 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | line 2, ray 74 |
| lv – optiland | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 5.51e-9 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | line 2, ray 74 |
| lv – optiland | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 6.25e-14 | nikkor-z50f12-best-photopic | line 7, ray 205 |
| lv – optiland | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 1.89e-12 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | line 8, ray 44 |
| lv – optiland | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 5.51e-9 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | line 2, ray 74 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 833028 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 16320 | — | — |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.99e-13 | sony-fe-20mm-f18-g-photopic | line 2, ray 1491 |
| lv – reference-tracer | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.15e-13 | sony-fe-20mm-f18-g-photopic | line 2, ray 1750 |
| lv – reference-tracer | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 3.98e-9 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – reference-tracer | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.58e-14 | nikon-z-24-70f4s-wide-photopic | line 7, ray 1750 |
| lv – reference-tracer | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 1.51e-12 | nikon-z-24-70f4s-wide-f8-best-photopic | line 2, ray 4 |
| lv – reference-tracer | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 3.98e-9 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 833028 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Fields compared — `fields.compared` | elements | — | 16320 | — | — |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.85e-13 | sony-fe-20mm-f18-g-ref | line 0, ray 1491 |
| optiland – reference-tracer | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.49e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 7, ray 84 |
| optiland – reference-tracer | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 5.40e-9 | sony-fe-400mm-f28-gm-oss-photopic | line 7, ray 84 |
| optiland – reference-tracer | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.53e-14 | nikon-z-24-70f4s-wide-best-photopic | line 3, ray 1750 |
| optiland – reference-tracer | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 2.00e-12 | sony-fe-400mm-f28-gm-oss-ref | line 0, ray 64 |
| optiland – reference-tracer | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 5.40e-9 | sony-fe-400mm-f28-gm-oss-photopic | line 7, ray 84 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 833028 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Fields compared — `fields.compared` | elements | — | 16320 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 1565 / 271 / 0 | 1565 / 271 / 0 | 1565 / 271 / 0 |
| canon-ef-135-f2l-usm-photopic | 18 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.76e-13 mm | 14023 / 2501 / 0 | 14023 / 2501 / 0 | 14023 / 2501 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 1733 / 103 / 0 | 1733 / 103 / 0 | 1733 / 103 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 18 | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 9.59e-14 mm | 15400 / 1124 / 0 | 15400 / 1124 / 0 | 15400 / 1124 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 2 | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | Pass: landing.maxAbs 2.77e-13 mm | 1665 / 171 / 0 | 1665 / 171 / 0 | 1665 / 171 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 18 | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 2.98e-13 mm | Pass: landing.maxAbs 7.74e-13 mm | 14835 / 1689 / 0 | 14835 / 1689 / 0 | 14835 / 1689 / 0 |
| nikkor-z50f12-ref | 2 | Pass: landing.maxAbs 3.51e-13 mm | Pass: landing.maxAbs 2.55e-13 mm | Pass: landing.maxAbs 3.53e-13 mm | 1617 / 219 / 0 | 1617 / 219 / 0 | 1617 / 219 / 0 |
| nikkor-z50f12-photopic | 18 | Pass: landing.maxAbs 4.79e-13 mm | Pass: landing.maxAbs 3.44e-13 mm | Pass: landing.maxAbs 4.86e-13 mm | 14421 / 2103 / 0 | 14421 / 2103 / 0 | 14421 / 2103 / 0 |
| sony-fe-20mm-f18-g-ref | 2 | Pass: landing.maxAbs 5.97e-13 mm | Pass: landing.maxAbs 7.85e-13 mm | Pass: landing.maxAbs 7.85e-13 mm | 1796 / 40 / 0 | 1796 / 40 / 0 | 1796 / 40 / 0 |
| sony-fe-20mm-f18-g-photopic | 18 | Pass: landing.maxAbs 7.18e-13 mm | Pass: landing.maxAbs 7.99e-13 mm | Pass: landing.maxAbs 7.67e-13 mm | 15895 / 629 / 0 | 15895 / 629 / 0 | 15895 / 629 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 2 | Pass: landing.maxAbs 3.34e-13 mm | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 3.03e-13 mm | 1635 / 201 / 0 | 1635 / 201 / 0 | 1635 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 18 | Pass: landing.maxAbs 3.86e-13 mm | Pass: landing.maxAbs 3.87e-13 mm | Pass: landing.maxAbs 4.37e-13 mm | 14572 / 1952 / 0 | 14572 / 1952 / 0 | 14572 / 1952 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 2 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 1684 / 152 / 0 | 1684 / 152 / 0 | 1684 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 18 | Pass: landing.maxAbs 1.92e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 14984 / 1540 / 0 | 14984 / 1540 / 0 | 14984 / 1540 / 0 |
| nikon-z-24-70f4s-wide-ref | 2 | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-wide-photopic | 18 | Pass: landing.maxAbs 6.47e-13 mm | Pass: landing.maxAbs 5.65e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | 15804 / 720 / 0 | 15804 / 720 / 0 | 15804 / 720 / 0 |
| nikon-z-24-70f4s-tele-ref | 2 | Pass: landing.maxAbs 1.40e-13 mm | Pass: landing.maxAbs 5.99e-13 mm | Pass: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-tele-photopic | 18 | Pass: landing.maxAbs 4.90e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | Pass: landing.maxAbs 6.70e-13 mm | 15318 / 1206 / 0 | 15318 / 1206 / 0 | 15318 / 1206 / 0 |
| nikon-z-mc-105f28-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.53e-13 mm | 1601 / 235 / 0 | 1601 / 235 / 0 | 1601 / 235 / 0 |
| nikon-z-mc-105f28-photopic | 18 | Pass: landing.maxAbs 1.57e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | 14278 / 2246 / 0 | 14278 / 2246 / 0 | 14278 / 2246 / 0 |
| nikon-z-135f18-plena-ref | 2 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | 1798 / 38 / 0 | 1798 / 38 / 0 | 1798 / 38 / 0 |
| nikon-z-135f18-plena-photopic | 18 | Pass: landing.maxAbs 1.81e-13 mm | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 15957 / 567 / 0 | 15957 / 567 / 0 | 15957 / 567 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2 | Pass: landing.maxAbs 6.32e-13 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1616 / 220 / 0 | 1616 / 220 / 0 | 1616 / 220 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 18 | Pass: landing.maxAbs 6.71e-13 mm | Pass: landing.maxAbs 4.23e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 14420 / 2104 / 0 | 14420 / 2104 / 0 | 14420 / 2104 / 0 |
| canon-ef-135-f2l-usm-best-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 1565 / 271 / 0 | 1565 / 271 / 0 | 1565 / 271 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 18 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | 14023 / 2501 / 0 | 14023 / 2501 / 0 | 14023 / 2501 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 2 | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.49e-13 mm | 16252 / 272 / 0 | 16252 / 272 / 0 | 16252 / 272 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.49e-13 mm | 16252 / 272 / 0 | 16252 / 272 / 0 | 16252 / 272 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 1733 / 103 / 0 | 1733 / 103 / 0 | 1733 / 103 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 9.59e-14 mm | 15400 / 1124 / 0 | 15400 / 1124 / 0 | 15400 / 1124 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 2 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | 16242 / 282 / 0 | 16242 / 282 / 0 | 16242 / 282 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 2 | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | 16242 / 282 / 0 | 16242 / 282 / 0 | 16242 / 282 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 2 | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | Pass: landing.maxAbs 2.77e-13 mm | 1665 / 171 / 0 | 1665 / 171 / 0 | 1665 / 171 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 18 | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 2.91e-13 mm | Pass: landing.maxAbs 7.74e-13 mm | 14835 / 1689 / 0 | 14835 / 1689 / 0 | 14835 / 1689 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 2 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 18 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 2.49e-13 mm | Pass: landing.maxAbs 2.45e-13 mm | 16237 / 287 / 0 | 16237 / 287 / 0 | 16237 / 287 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 2 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 18 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 2.45e-13 mm | Pass: landing.maxAbs 2.45e-13 mm | 16237 / 287 / 0 | 16237 / 287 / 0 | 16237 / 287 / 0 |
| nikkor-z50f12-best-ref | 2 | Pass: landing.maxAbs 3.51e-13 mm | Pass: landing.maxAbs 2.55e-13 mm | Pass: landing.maxAbs 3.53e-13 mm | 1617 / 219 / 0 | 1617 / 219 / 0 | 1617 / 219 / 0 |
| nikkor-z50f12-best-photopic | 18 | Pass: landing.maxAbs 4.78e-13 mm | Pass: landing.maxAbs 3.44e-13 mm | Pass: landing.maxAbs 4.86e-13 mm | 14421 / 2103 / 0 | 14421 / 2103 / 0 | 14421 / 2103 / 0 |
| nikkor-z50f12-f8-ref | 2 | Pass: landing.maxAbs 2.24e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 18 | Pass: landing.maxAbs 2.84e-13 mm | Pass: landing.maxAbs 2.56e-13 mm | Pass: landing.maxAbs 2.70e-13 mm | 16241 / 283 / 0 | 16241 / 283 / 0 | 16241 / 283 / 0 |
| nikkor-z50f12-f8-best-ref | 2 | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 18 | Pass: landing.maxAbs 2.84e-13 mm | Pass: landing.maxAbs 2.56e-13 mm | Pass: landing.maxAbs 2.66e-13 mm | 16241 / 283 / 0 | 16241 / 283 / 0 | 16241 / 283 / 0 |
| sony-fe-20mm-f18-g-best-ref | 2 | Pass: landing.maxAbs 5.90e-13 mm | Pass: landing.maxAbs 7.82e-13 mm | Pass: landing.maxAbs 7.82e-13 mm | 1796 / 40 / 0 | 1796 / 40 / 0 | 1796 / 40 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 18 | Pass: landing.maxAbs 7.14e-13 mm | Pass: landing.maxAbs 7.99e-13 mm | Pass: landing.maxAbs 7.64e-13 mm | 15895 / 629 / 0 | 15895 / 629 / 0 | 15895 / 629 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 3.55e-13 mm | Pass: landing.maxAbs 3.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 18 | Pass: landing.maxAbs 3.73e-13 mm | Pass: landing.maxAbs 3.80e-13 mm | Pass: landing.maxAbs 3.59e-13 mm | 16181 / 343 / 0 | 16181 / 343 / 0 | 16181 / 343 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 3.55e-13 mm | Pass: landing.maxAbs 3.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 18 | Pass: landing.maxAbs 3.73e-13 mm | Pass: landing.maxAbs 3.84e-13 mm | Pass: landing.maxAbs 3.59e-13 mm | 16181 / 343 / 0 | 16181 / 343 / 0 | 16181 / 343 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 2 | Pass: landing.maxAbs 3.35e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | Pass: landing.maxAbs 3.03e-13 mm | 1635 / 201 / 0 | 1635 / 201 / 0 | 1635 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 18 | Pass: landing.maxAbs 3.87e-13 mm | Pass: landing.maxAbs 3.86e-13 mm | Pass: landing.maxAbs 4.37e-13 mm | 14572 / 1952 / 0 | 14572 / 1952 / 0 | 14572 / 1952 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 2 | Pass: landing.maxAbs 3.27e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | Pass: landing.maxAbs 2.84e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 18 | Pass: landing.maxAbs 3.23e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 3.84e-13 mm | 16231 / 293 / 0 | 16231 / 293 / 0 | 16231 / 293 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 2 | Pass: landing.maxAbs 3.27e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | Pass: landing.maxAbs 2.84e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 18 | Pass: landing.maxAbs 3.23e-13 mm | Pass: landing.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 3.84e-13 mm | 16231 / 293 / 0 | 16231 / 293 / 0 | 16231 / 293 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 2 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1684 / 152 / 0 | 1684 / 152 / 0 | 1684 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 18 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 1.37e-13 mm | Pass: landing.maxAbs 2.17e-13 mm | 14984 / 1540 / 0 | 14984 / 1540 / 0 | 14984 / 1540 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 2 | Pass: landing.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1820 / 16 / 0 | 1820 / 16 / 0 | 1820 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 18 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 16109 / 415 / 0 | 16109 / 415 / 0 | 16109 / 415 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 2 | Pass: landing.maxAbs 1.42e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1820 / 16 / 0 | 1820 / 16 / 0 | 1820 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 18 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 16109 / 415 / 0 | 16109 / 415 / 0 | 16109 / 415 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 2 | Pass: landing.maxAbs 6.50e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 6.54e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 18 | Pass: landing.maxAbs 6.47e-13 mm | Pass: landing.maxAbs 5.65e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | 15804 / 720 / 0 | 15804 / 720 / 0 | 15804 / 720 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | Pass: landing.maxAbs 4.16e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 18 | Pass: landing.maxAbs 2.77e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | Pass: landing.maxAbs 5.44e-13 mm | 16164 / 360 / 0 | 16164 / 360 / 0 | 16164 / 360 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 4.73e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 18 | Pass: landing.maxAbs 2.77e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | Pass: landing.maxAbs 5.44e-13 mm | 16164 / 360 / 0 | 16164 / 360 / 0 | 16164 / 360 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 2 | Pass: landing.maxAbs 1.40e-13 mm | Pass: landing.maxAbs 5.99e-13 mm | Pass: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 18 | Pass: landing.maxAbs 4.90e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | Pass: landing.maxAbs 6.70e-13 mm | 15318 / 1206 / 0 | 15318 / 1206 / 0 | 15318 / 1206 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 2 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 18 | Pass: landing.maxAbs 4.90e-13 mm | Pass: landing.maxAbs 6.22e-13 mm | Pass: landing.maxAbs 5.93e-13 mm | 16201 / 323 / 0 | 16201 / 323 / 0 | 16201 / 323 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 2 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 18 | Pass: landing.maxAbs 4.94e-13 mm | Pass: landing.maxAbs 6.25e-13 mm | Pass: landing.maxAbs 5.97e-13 mm | 16201 / 323 / 0 | 16201 / 323 / 0 | 16201 / 323 / 0 |
| nikon-z-mc-105f28-best-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 1601 / 235 / 0 | 1601 / 235 / 0 | 1601 / 235 / 0 |
| nikon-z-mc-105f28-best-photopic | 18 | Pass: landing.maxAbs 1.57e-13 mm | Pass: landing.maxAbs 1.23e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | 14278 / 2246 / 0 | 14278 / 2246 / 0 | 14278 / 2246 / 0 |
| nikon-z-mc-105f28-f8-ref | 2 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 18 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 1.63e-13 mm | 16206 / 318 / 0 | 16206 / 318 / 0 | 16206 / 318 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 2 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 18 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | 16206 / 318 / 0 | 16206 / 318 / 0 | 16206 / 318 / 0 |
| nikon-z-135f18-plena-best-ref | 2 | Pass: landing.maxAbs 1.44e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 1.30e-13 mm | 1798 / 38 / 0 | 1798 / 38 / 0 | 1798 / 38 / 0 |
| nikon-z-135f18-plena-best-photopic | 18 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 15957 / 567 / 0 | 15957 / 567 / 0 | 15957 / 567 / 0 |
| nikon-z-135f18-plena-f8-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | 16251 / 273 / 0 | 16251 / 273 / 0 | 16251 / 273 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.49e-13 mm | 16251 / 273 / 0 | 16251 / 273 / 0 | 16251 / 273 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 2 | Pass: landing.maxAbs 6.32e-13 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1616 / 220 / 0 | 1616 / 220 / 0 | 1616 / 220 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 18 | Pass: landing.maxAbs 6.71e-13 mm | Pass: landing.maxAbs 4.23e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 14420 / 2104 / 0 | 14420 / 2104 / 0 | 14420 / 2104 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 2 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 4.65e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | 1816 / 20 / 0 | 1816 / 20 / 0 | 1816 / 20 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 18 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 4.73e-13 mm | 16074 / 450 / 0 | 16074 / 450 / 0 | 16074 / 450 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 2 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 4.65e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | 1816 / 20 / 0 | 1816 / 20 / 0 | 1816 / 20 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 18 | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 4.73e-13 mm | 16074 / 450 / 0 | 16074 / 450 / 0 | 16074 / 450 / 0 |

## Vignetting rays — `vignetting-rays`

Compares: Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 3.29e-14 | nikon-z-mc-105f28-f8-photopic | field 1.00e1 deg, line 6 |
| lv – optiland | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – optiland | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.53e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 3.15e0 deg, line 7, ray 2048 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 8940176 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 4640 | — | — |
| lv – reference-tracer | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 7.11e-14 | nikon-z-24-70f4s-wide-f8-photopic | field 2.02e1 deg, line 5 |
| lv – reference-tracer | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – reference-tracer | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.03e-13 | sigma-35mm-f14-dg-hsm-a-photopic | field 2.32e1 deg, line 6, ray 2048 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 8940176 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Fields compared — `fields.compared` | elements | — | 4640 | — | — |
| optiland – reference-tracer | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 7.45e-14 | nikon-z-24-70f4s-wide-f8-photopic | field 2.02e1 deg, line 3 |
| optiland – reference-tracer | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.38e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 3.15e0 deg, line 7, ray 2048 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 8940176 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Fields compared — `fields.compared` | elements | — | 4640 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | Pass: illumination.maxAbs 2.66e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 9 | Pass: illumination.maxAbs 6.83e-15 | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.87e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| nikkor-z50f12-ref | 1 | Pass: illumination.maxAbs 1.39e-14 | Pass: landing.maxAbs 5.33e-14 mm | Pass: illumination.maxAbs 1.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-photopic | 9 | Pass: illumination.maxAbs 1.48e-14 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.42e-13 mm | 18409 / 32 / 0 | 18409 / 32 / 0 | 18409 / 32 / 0 |
| sony-fe-20mm-f18-g-ref | 1 | Pass: illumination.maxAbs 6.83e-15 | Pass: illumination.maxAbs 2.39e-14 | Pass: illumination.maxAbs 2.52e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 9 | Pass: illumination.maxAbs 1.93e-14 | Pass: illumination.maxAbs 2.40e-14 | Pass: illumination.maxAbs 2.91e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 9 | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.67e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| nikon-z-24-70f4s-wide-ref | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.67e-14 | Pass: illumination.maxAbs 1.61e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-tele-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.70e-14 | Pass: illumination.maxAbs 1.83e-14 | 18355 / 86 / 0 | 18355 / 86 / 0 | 18355 / 86 / 0 |
| nikon-z-mc-105f28-ref | 1 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 9 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.49e-13 mm | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-135f18-plena-ref | 1 | Pass: landing.maxAbs 2.13e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | Pass: landing.maxAbs 3.20e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 9 | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | Pass: illumination.maxAbs 4.33e-15 | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 9 | Pass: illumination.maxAbs 6.44e-15 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| canon-ef-135-f2l-usm-best-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.55e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | Pass: illumination.maxAbs 2.66e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | Pass: landing.maxAbs 1.78e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | Pass: landing.maxAbs 1.42e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 9 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 9 | Pass: illumination.maxAbs 6.83e-15 | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 9 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.87e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 9 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.87e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| nikkor-z50f12-best-ref | 1 | Pass: illumination.maxAbs 1.39e-14 | Pass: landing.maxAbs 5.33e-14 mm | Pass: illumination.maxAbs 1.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-best-photopic | 9 | Pass: illumination.maxAbs 1.48e-14 | Pass: landing.maxAbs 1.42e-13 mm | Pass: landing.maxAbs 1.39e-13 mm | 18409 / 32 / 0 | 18409 / 32 / 0 | 18409 / 32 / 0 |
| nikkor-z50f12-f8-ref | 1 | Pass: illumination.maxAbs 1.47e-14 | Pass: illumination.maxAbs 1.27e-14 | Pass: illumination.maxAbs 2.43e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 9 | Pass: illumination.maxAbs 1.41e-14 | Pass: illumination.maxAbs 1.58e-14 | Pass: illumination.maxAbs 2.36e-14 | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| nikkor-z50f12-f8-best-ref | 1 | Pass: illumination.maxAbs 1.47e-14 | Pass: illumination.maxAbs 1.27e-14 | Pass: illumination.maxAbs 2.43e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 9 | Pass: illumination.maxAbs 1.41e-14 | Pass: illumination.maxAbs 1.58e-14 | Pass: illumination.maxAbs 2.36e-14 | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| sony-fe-20mm-f18-g-best-ref | 1 | Pass: illumination.maxAbs 6.83e-15 | Pass: illumination.maxAbs 2.39e-14 | Pass: illumination.maxAbs 2.52e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 9 | Pass: illumination.maxAbs 1.93e-14 | Pass: illumination.maxAbs 2.40e-14 | Pass: illumination.maxAbs 2.91e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 1 | Pass: illumination.maxAbs 8.66e-15 | Pass: illumination.maxAbs 5.17e-14 | Pass: illumination.maxAbs 5.20e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 9 | Pass: landing.maxAbs 8.53e-14 mm | Pass: illumination.maxAbs 5.82e-14 | Pass: illumination.maxAbs 6.00e-14 | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | Pass: illumination.maxAbs 8.66e-15 | Pass: illumination.maxAbs 5.17e-14 | Pass: illumination.maxAbs 5.20e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 9 | Pass: landing.maxAbs 8.53e-14 mm | Pass: illumination.maxAbs 5.82e-14 | Pass: illumination.maxAbs 6.00e-14 | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 9 | Pass: landing.maxAbs 1.49e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 6.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 9 | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 6.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 9 | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.67e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.67e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.67e-14 | Pass: illumination.maxAbs 1.61e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: illumination.maxAbs 4.88e-14 | Pass: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 9 | Pass: illumination.maxAbs 1.07e-14 | Pass: illumination.maxAbs 7.11e-14 | Pass: illumination.maxAbs 7.45e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: illumination.maxAbs 4.88e-14 | Pass: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 9 | Pass: illumination.maxAbs 1.07e-14 | Pass: illumination.maxAbs 7.11e-14 | Pass: illumination.maxAbs 7.45e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.70e-14 | Pass: illumination.maxAbs 1.83e-14 | 18355 / 86 / 0 | 18355 / 86 / 0 | 18355 / 86 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 9 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 2.94e-14 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 9 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 2.94e-14 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-mc-105f28-best-ref | 1 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 9 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 1.49e-13 mm | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 1 | Pass: illumination.maxAbs 2.42e-14 | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 9 | Pass: illumination.maxAbs 3.29e-14 | Pass: landing.maxAbs 7.11e-14 mm | Pass: illumination.maxAbs 2.71e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 1 | Pass: illumination.maxAbs 2.42e-14 | Pass: landing.maxAbs 1.14e-13 mm | Pass: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 9 | Pass: illumination.maxAbs 3.29e-14 | Pass: landing.maxAbs 6.75e-14 mm | Pass: illumination.maxAbs 2.71e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 1 | Pass: landing.maxAbs 2.13e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 3.20e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 9 | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| nikon-z-135f18-plena-f8-ref | 1 | Pass: illumination.maxAbs 4.55e-15 | Pass: illumination.maxAbs 3.55e-15 | Pass: illumination.maxAbs 4.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 9 | Pass: illumination.maxAbs 6.33e-15 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 1 | Pass: illumination.maxAbs 4.55e-15 | Pass: illumination.maxAbs 3.55e-15 | Pass: illumination.maxAbs 4.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 9 | Pass: illumination.maxAbs 6.33e-15 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | Pass: illumination.maxAbs 4.33e-15 | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 9 | Pass: illumination.maxAbs 6.44e-15 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | Pass: landing.maxAbs 3.91e-14 mm | Pass: illumination.maxAbs 3.04e-14 | Pass: illumination.maxAbs 2.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 9 | Pass: illumination.maxAbs 6.11e-15 | Pass: illumination.maxAbs 3.14e-14 | Pass: illumination.maxAbs 3.23e-14 | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | Pass: landing.maxAbs 3.91e-14 mm | Pass: illumination.maxAbs 3.04e-14 | Pass: illumination.maxAbs 2.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 9 | Pass: illumination.maxAbs 6.11e-15 | Pass: illumination.maxAbs 3.14e-14 | Pass: illumination.maxAbs 3.23e-14 | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |

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
| `reference-tracer` | The reference tracer: a small exact ray tracer written in this repository from the optics alone, never from LensVisualizer's or optiland's code. |

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
| Suite file | 5b24c3c2a4bf39f011e05d38a4c2c56196b55eca62fd01ba9d45466d8b353c02 |
| Baseline file | 101a96f10122fcb7ec2244a389d79ef0979c34cefce9675ba702e8b4b7665906 |
| Limits file | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61 | 674d26ffb708596a5462f6199b1cb2c28df679003651e53ebb4bbde0e590be9a | commit f5b456fec7b69184844078f6ec6b1ac132f8ec58 |
| optiland | 2ca0f73256d5e0ead64aa3695522bef399721276bf11d612db34b7bf19c5ee39 | 59039a7b219f2882f1e4cabf8f43bc07a9fdf66ecb95d26f4076feca4406d853 | commit a9e544a2e058f1c1b64606e9ce90e6dc103efee1, distribution version 0.6.2.post234+ga9e544a2, source hash 1d35bfa2f7a6addd60f2c1057cd17e65a710a6a7d4e3a277e8675647d0262131 |
| reference-tracer | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 | — |

| Run | Lens state |
|---|---|
| canon-ef-135-f2l-usm-ref | b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60 |
| canon-ef-135-f2l-usm-photopic | b5db810e50204c2dc4f40c8720eec2acc118a3f5ba43ad7718e8e361f62c9a8c |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 45f1fc0b454f809de9f793d565d6aa7bd8ca0460ea03e89c675039251c296a60 |
| sigma-35mm-f14-dg-hsm-a-ref | 18ef72984fad20ad086ba18f8b839edb2d9d142a51397b4b7c1a3cdf1565d456 |
| sigma-35mm-f14-dg-hsm-a-photopic | 49eae83980d3a2b089251ac79188e8e6f11910bfd72f33cb245397531e11cf16 |
| nikkor-z50f12-ref | 861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22 |
| nikkor-z50f12-photopic | 84400e63b4de00e35171d3bd0bf8df3aa8e940f3d5dade0ee298761249c637e2 |
| sony-fe-20mm-f18-g-ref | b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5 |
| sony-fe-20mm-f18-g-photopic | 3ef2cff569dc2714ff638c58f6b0ca0c1a10f180c31a8cf76095e96b3648dbda |
| sony-fe-400mm-f28-gm-oss-ref | 75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5 |
| sony-fe-400mm-f28-gm-oss-photopic | a58e00887093c8578107118a6f861e957b3ba012781c0061a213fc938268fd6d |
| sigma-105mm-f28-dg-dn-macro-art-ref | e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | a164cd6b31901aed41e804b10704df98977ca3559bc547c2f876eefea0af010f |
| nikon-z-24-70f4s-wide-ref | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| nikon-z-24-70f4s-wide-photopic | 392526a2d4fb6800be21455fb7097f75e53156a130b490f79830e62460359a12 |
| nikon-z-24-70f4s-tele-ref | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| nikon-z-24-70f4s-tele-photopic | 9e3b47006624814732c91d238b73f183b938f21c947092003915ea16b13a4827 |
| nikon-z-mc-105f28-ref | 70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb |
| nikon-z-mc-105f28-photopic | ceaed4b7737a40f115bd46b8c7fff24f61a9b7586604a0c02db850a74702fc97 |
| nikon-z-135f18-plena-ref | 449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab |
| nikon-z-135f18-plena-photopic | 47a027ecb521ce8e8589f9605124d6b966785de4024b1793e9961dbcfcc75afa |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | e88166a19b0d185b63ed16ca4c493102684d84578284592096743da5fd9f8bdd |
| canon-ef-135-f2l-usm-best-ref | b4f341d96e9f6e711ecf326eeb3cdaf3602a856cdfba61ec965ecc71b89499de |
| canon-ef-135-f2l-usm-best-photopic | d022d1d09ec0c3f1f97aaeda79bbf7bac8382354750cc39f1f61c85c5bd39551 |
| canon-ef-135-f2l-usm-f8-ref | d1fd0633e961ca14b7e8a890140c4d184c21a53e0969e4179e2f142257180fc7 |
| canon-ef-135-f2l-usm-f8-photopic | 5624c31ade8c2dce2d418842c932156c9908c45e56ae5f54e37fffde325eeadd |
| canon-ef-135-f2l-usm-f8-best-ref | 9181a5e3a48bf546f4561ba7bb1b9fb5de2bdf85f2f1080c60230661b568ddca |
| canon-ef-135-f2l-usm-f8-best-photopic | 190ba213f4cd3382515a63166c31a1022e87db7e6e988a7b5429ee08ec16e04f |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 52523bad0a00d71977e0eefafa46b9cda099b1324777dde14b699fab0c5b4b9b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0f3003ead057d91b53fc9e415c3042ce341b94a92d1f9842bf5f349485ed230b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 30e4a4eec70f588e984e1210446b9eb671089990b41bdf7c6425457f870b4ebd |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 97c17da6ba9d72f3117c31a581a0c80352297b0b981491838b96343093a6d15b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | eb45ad15291d7f5e4556a8ab1655f8b325aa8433e5806470be1db9dbc663d1ae |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 21e0d632969768033832d4878a7ce45a0fbcd1eeba10c3646191b546e2b5f2ff |
| sigma-35mm-f14-dg-hsm-a-best-ref | 130981bdd7a4989b64f69069a4346f2004bccb5f4e41fddc1b856bcd792c7d4d |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 5913d6d21d5f2d295c681137b6de9ac9913a595fee807f1c0f181a0d92e90605 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | ce80398ec92f83206f4b4190f455665210292985b2b13c0bdc728983ac8ef72a |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 83204a76045d1fdc54c881aec747fc8a5061647e0801e76e5a3c1ce92cd7d596 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 53d98c230d539a2f9f241accb3d0f4ceaab1006e5601e8c391d9ccf38239f723 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | fa6d44f03608ba916462eaf59e8bd91ab5acc13fe89d57fffd93de00397d1ed3 |
| nikkor-z50f12-best-ref | 13cd75d2e0891cf4ab4f2e8c006a7719cdd7721caa4dce11e1faa6ab1f70e8f5 |
| nikkor-z50f12-best-photopic | 06428079dd39a6f0571a0c620e76b836a7c1784e3cb93a5df740c7d484e9c620 |
| nikkor-z50f12-f8-ref | b2e66abb6142cc758397469e55448599762d9712ba3d6cd768f8cea13b336b92 |
| nikkor-z50f12-f8-photopic | 9e42b1517ecef299400be6273e4c29bd0584e1bdd4b1ff3f914d0641cd76591e |
| nikkor-z50f12-f8-best-ref | 359dc743691cfd7a56b445301c5703d5ead4e6fc68863d5faf7c5d386acddfa5 |
| nikkor-z50f12-f8-best-photopic | 7fae8fab9b7bbc5309fe77fee83fa5d2e22a2a8aeea3ae4afa56205a2ef83d58 |
| sony-fe-20mm-f18-g-best-ref | 469d8f48aaac16ae2f6e2ce67f033e9eacff42111d6b3e1c1eb2c6450c40fb3a |
| sony-fe-20mm-f18-g-best-photopic | 6c51a18fd8c3931a460501e3795f1a7d4c01b1b06bc3dc154bd2eb2049a1916a |
| sony-fe-20mm-f18-g-f8-ref | cd2d5eb4481fbd7b01ae526b4808841fdcb6467f04d85b0cc0e040b2d2955ce0 |
| sony-fe-20mm-f18-g-f8-photopic | bb94daaffcbff69694b9bdef6e69175a11092f05cd1c46d56a1fcac3b16dfa90 |
| sony-fe-20mm-f18-g-f8-best-ref | e169bad1480d89fff330c5fc66e0d06dcb23e767ffd4a9c0a14159caf68abb5e |
| sony-fe-20mm-f18-g-f8-best-photopic | 37d59ff1e5b1edbaa1a43845368a9a99c43aaa1b08a62a09a7caa3e123c828ea |
| sony-fe-400mm-f28-gm-oss-best-ref | 321e4ba0ce5c220609a55b35ac8a33079ccf30c7e3258a67ec1463edf2554afb |
| sony-fe-400mm-f28-gm-oss-best-photopic | 423a43df1a994c6b8e2e7e24e7caf046c25f6d888d7aaa51e07074d67a9606c3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | bdba0ea2e9d167e31d49a03bd99c873d71bc7945b8b646ac3cb48b4710a872f2 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 014750f1a6b31e976edcb5312a7ad64f02e45477eae8aa655544e97fa2b3f9cc |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 93e98f340fb7f23d10d90375c3c3953cd5c871e2867247ae73e24e3fa40b0e6d |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | dd791f47eb36f29f371173696ad51e168a7ad96f6d04741433d3fe3afafc3663 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | f74812129cc4c7918a44f8ec7cb6ce9882367b23bc0d991f04712a7e6cc9206e |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 2be793c1d19d2cd1f39ce7b5629143de2d6fb5053fff65bf733d8d6794b6377f |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 58eb582de9ad963ec75ab5f5009ec8889068ea50be5cdb6da32ac6d23f9c6698 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 7d5feaed48371fe19a27c2449deec812ccb7c4578866ce23a45d25b9decc9bdf |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 5285ea322b02f0fd436d12c9cd11c5e1abde75282625e1351b4d7c57d2f7cdd9 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | b60f32c9e4e8e4a4a34d3a521ec4dda3455189bbe244cf42e4b2580fd91685ad |
| nikon-z-24-70f4s-wide-best-ref | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| nikon-z-24-70f4s-wide-best-photopic | c3e2ff5ca8846d295ca192a631c924ad89fac42eca1b4c18770d8f5617b8c506 |
| nikon-z-24-70f4s-wide-f8-ref | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| nikon-z-24-70f4s-wide-f8-photopic | ab3760654d94804e8278e5cad2c61fac6237577dc6f556f1840b1c720c67ccc2 |
| nikon-z-24-70f4s-wide-f8-best-ref | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 6882783f3706c89459ea475b03c5097f00f8e10b8f38f8c7a912789db7f9c183 |
| nikon-z-24-70f4s-tele-best-ref | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| nikon-z-24-70f4s-tele-best-photopic | 744b809865d1a1116492bfbf856ab119ea41ab803108f9c981f69923f41cf76e |
| nikon-z-24-70f4s-tele-f8-ref | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| nikon-z-24-70f4s-tele-f8-photopic | 3880b49fc9097685272f3f5f6b9410a3c721798228c33fa69503e366e3a28067 |
| nikon-z-24-70f4s-tele-f8-best-ref | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| nikon-z-24-70f4s-tele-f8-best-photopic | b3e22a7473a909ad089f72ea18ecbbea131ebcc8d3093090ae20e82ef40a8794 |
| nikon-z-mc-105f28-best-ref | c83e32a7f5c48ad358d471710d082e4a5fb745e7baae2c989ec4a957709a8bbb |
| nikon-z-mc-105f28-best-photopic | 7c836d3d9dac81afeef7ad9444282493a845677a40599b9ba868c0acb520fae6 |
| nikon-z-mc-105f28-f8-ref | 904ae8663e1e238175e7d632b807c7b9efc4ab69381a92b0613675b2dbc891a9 |
| nikon-z-mc-105f28-f8-photopic | babaeb332392e6e0d1d45fbc2ddb1d5225905c121b66eedbd07a508a9984e4d2 |
| nikon-z-mc-105f28-f8-best-ref | d31b3e7efcdab37966e8b8135217738e6192f77faec1b974d94409d648accd72 |
| nikon-z-mc-105f28-f8-best-photopic | 934e7354019aa488588a6855231337d044fa478ac607c7c0459df78d234f5c07 |
| nikon-z-135f18-plena-best-ref | 0c9e2d7b9f2923c21fef404d7b86f7e31456364f77a5f300a13a06219d4add72 |
| nikon-z-135f18-plena-best-photopic | d75a8ef4644486a1e3ffa0378794fea65884e3cc705489a31a15bf100b02861a |
| nikon-z-135f18-plena-f8-ref | 7f0c3394b7c516d1ac234599e678abe8497b7cf9931f1dd3887a7869e8a703a8 |
| nikon-z-135f18-plena-f8-photopic | e1359ab0d31fe8f96ca995c658970ee98ec85e4542b4656093a8fbebbc06304f |
| nikon-z-135f18-plena-f8-best-ref | d4eca6fef5c902656e4eb45b1542385a3a1902907993d85a65365ff0d997f6ff |
| nikon-z-135f18-plena-f8-best-photopic | cfc7ddb3dae7b25cbab97c42e1da02c7847f0e7e7e0a6155067cb837b6473ee9 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0f2591032f4111cf837b08e5e70899199b943dfbe2e54ff2469d14fd9b70a7f0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | d505d5fe50407a200e223ebc26ae6af48c259efcbb71efc5c2447b622f74be50 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | e44ac8f3c84fa88e4f62f0acd044815be365d1791d98ad87744f5c12e8eabc52 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 7ade382558ccb747559665a351a3dff604cebd252fb6931651bce86af87aa04e |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 952ae77f90fd93161c6e9e1d307c8b2289770285efe2d2c42c56dc5a5cf47c5a |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 9200ca05a3c79f360cd2c0fc468bcd275d95a424a5e68946f7b8590091f678a5 |
