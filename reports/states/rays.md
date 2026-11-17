# Baseline of states: the ray checks

This file is the committed record of the ray checks of the suite states, as its baseline holds them: for every
run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every
pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and
wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so
`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no
ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the
engines are still those of the baseline. How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | states |
| Limits file | v25 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 193 engine files |
| optiland | optiland | 0.6.2.post234+ga9e544a2 | backend numpy, clean checkout, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 611 source files |
| reference-tracer | Reference tracer | 1 | 13 source files |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 128 | 128 | lv – optiland | 128 Pass | 128 Pass |
| Built system — `built-system` | `system.describe` | 128 | 128 | lv – reference-tracer | 128 Pass | 128 Pass |
| Built system — `built-system` | `system.describe` | 128 | 128 | optiland – reference-tracer | 128 Pass | 128 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 128 | 128 | lv – optiland | 128 Pass | 128 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 128 | 128 | lv – reference-tracer | 128 Pass | 128 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 128 | 128 | optiland – reference-tracer | 128 Pass | 128 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 128 | 1920 | lv – optiland | 128 Pass | 1920 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 128 | 1920 | lv – reference-tracer | 128 Pass | 1920 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 128 | 1920 | optiland – reference-tracer | 128 Pass | 1920 Pass |
| Optical path — `optical-path` | `rays.trace` | 128 | 1920 | lv – optiland | 128 Pass | 1920 Pass |
| Optical path — `optical-path` | `rays.trace` | 128 | 1920 | lv – reference-tracer | 128 Pass | 1920 Pass |
| Optical path — `optical-path` | `rays.trace` | 128 | 1920 | optiland – reference-tracer | 128 Pass | 1920 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 128 | 384 | lv – optiland | 128 Pass | 384 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 128 | 384 | lv – reference-tracer | 128 Pass | 384 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 128 | 384 | optiland – reference-tracer | 128 Pass | 384 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 128 | 6400 | lv – optiland | 128 Pass | 6400 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 128 | 6400 | lv – reference-tracer | 128 Pass | 6400 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 128 | 6400 | optiland – reference-tracer | 128 Pass | 6400 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 128 | 1344 | lv – optiland | 128 Pass | 1344 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 128 | 1344 | lv – reference-tracer | 128 Pass | 1344 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 128 | 1344 | optiland – reference-tracer | 128 Pass | 1344 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 128 | 512 | lv – optiland | 128 Pass | 512 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 128 | 512 | lv – reference-tracer | 128 Pass | 512 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 128 | 512 | optiland – reference-tracer | 128 Pass | 512 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 128 | 1280 | lv – optiland | 128 Pass | 1280 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 128 | 1280 | lv – reference-tracer | 128 Pass | 1280 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 128 | 1280 | optiland – reference-tracer | 128 Pass | 1280 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 128 | 640 | lv – optiland | 128 Pass | 640 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 128 | 640 | lv – reference-tracer | 128 Pass | 640 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 128 | 640 | optiland – reference-tracer | 128 Pass | 640 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 128 answered |
| Built system — `built-system` | optiland | 128 answered |
| Built system — `built-system` | reference-tracer | 128 answered |
| First-order data — `first-order` | lv | 128 answered |
| First-order data — `first-order` | optiland | 128 answered |
| First-order data — `first-order` | reference-tracer | 128 answered |
| Ray trace — `ray-trace` | lv | 128 answered |
| Ray trace — `ray-trace` | optiland | 128 answered |
| Ray trace — `ray-trace` | reference-tracer | 128 answered |
| Optical path — `optical-path` | lv | 128 answered |
| Optical path — `optical-path` | optiland | 128 answered |
| Optical path — `optical-path` | reference-tracer | 128 answered |
| Geometric MTF of the same rays — `geometric-mtf` | lv | 128 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 128 answered |
| Geometric MTF of the same rays — `geometric-mtf` | reference-tracer | 128 answered |
| Spot and fan rays — `spot-rays` | lv | 128 answered |
| Spot and fan rays — `spot-rays` | optiland | 128 answered |
| Spot and fan rays — `spot-rays` | reference-tracer | 128 answered |
| Spherical aberration and axial colour rays — `axial-rays` | lv | 128 answered |
| Spherical aberration and axial colour rays — `axial-rays` | optiland | 128 answered |
| Spherical aberration and axial colour rays — `axial-rays` | reference-tracer | 128 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | lv | 128 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | optiland | 128 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | reference-tracer | 128 answered |
| Field-curve rays — `field-curve-rays` | lv | 128 answered |
| Field-curve rays — `field-curve-rays` | optiland | 128 answered |
| Field-curve rays — `field-curve-rays` | reference-tracer | 128 answered |
| Vignetting rays — `vignetting-rays` | lv | 128 answered |
| Vignetting rays — `vignetting-rays` | optiland | 128 answered |
| Vignetting rays — `vignetting-rays` | reference-tracer | 128 answered |

## Built system — `built-system`

Compares: Built layout, shape, aperture, index and sampled sag. Kind: held to a limit. Quantity asked of the engines: the system as built (`system.describe`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.94e-16 | nikon-z-24-70f4s-f5.6-ref-wide | sample 6, surface 10 |
| lv – optiland | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.55e-15 | sony-fe-400mm-f28-gm-oss-f5.6-ref | sample 8, surface 13 |
| lv – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.97e-16 | sony-fe-20mm-f18-g-f5.6-ref | sample 8, surface 6 |
| lv – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.55e-15 | sigma-35mm-f14-dg-hsm-a-f5.6-ref | sample 8, surface 0 |
| optiland – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 4.51e-16 | sony-fe-20mm-f18-g-f5.6-ref | sample 6, surface 0 |
| optiland – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 2.66e-15 | sigma-35mm-f14-dg-hsm-a-f5.6-ref | sample 8, surface 13 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.47e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikkor-z50f12-f5.6-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f5.6-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f5.6-best-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f5.6-best-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-best-ref | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-best-photopic | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | Pass: sag.maxScaled 3.86e-16 | Pass: sag.maxScaled 3.97e-16 | Pass: sag.maxScaled 4.51e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-mc-105f28-f5.6-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-best-ref | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-best-photopic | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-f5.6-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-best-ref | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-best-photopic | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.59e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| nikon-z-24-70f4s-open-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.94e-16 |

## First-order data — `first-order`

Compares: First-order quantities and pupils. Kind: held to a limit. Quantity asked of the engines: first-order data (`paraxial.first-order`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 5.91e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity frontFocalZ |
| lv – optiland | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 9.09e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 6, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 9.09e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 6, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 3.55e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilSemiDiameter |
| lv – optiland | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 3.55e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.96e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity frontFocalZ |
| lv – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.25e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.25e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 3.55e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 3.55e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 6.59e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity frontFocalZ |
| optiland – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.25e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilZ |
| optiland – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.25e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity entrancePupilZ |
| optiland – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 4.26e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 5, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 4.26e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 5, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| canon-ef-135-f2l-usm-f11-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f11-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | Pass: firstOrder.maxAbs 2.91e-13 mm | Pass: firstOrder.maxAbs 2.70e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.92e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f5.6-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| nikkor-z50f12-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| nikkor-z50f12-f11-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f11-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| nikkor-z50f12-f11-best-ref | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| sony-fe-20mm-f18-g-f11-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f11-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | Pass: firstOrder.maxAbs 1.71e-12 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 5.91e-12 mm | Pass: firstOrder.maxAbs 2.96e-12 mm | Pass: firstOrder.maxAbs 6.59e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.10e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-f11-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f11-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f5.6-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-mc-105f28-f11-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f11-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-mc-105f28-f11-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm |
| nikon-z-135f18-plena-f5.6-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| nikon-z-135f18-plena-f11-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f11-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| nikon-z-135f18-plena-f11-best-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| nikon-z-24-70f4s-open-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-open-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-open-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-open-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-f8-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f8-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.44e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | Pass: firstOrder.maxAbs 1.72e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | Pass: firstOrder.maxAbs 1.83e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.17e-12 | nikon-z-24-70f4s-f5.6-photopic-wide | field 4.33e1 deg, line 4, ray 972, surface 20 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.17e-14 | sony-fe-20mm-f18-g-f5.6-photopic | field 4.75e1 deg, line 0, ray 171 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 7.50e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | field 4.33e1 deg, line 4, ray 974 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | — | — |
| lv – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.25e-12 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1 deg, line 7, ray 548, surface 10 |
| lv – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.45e-14 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1 deg, line 4, ray 399 |
| lv – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 7.89e-13 | nikon-z-24-70f4s-open-photopic-zoom0.5 | field 2.40e1 deg, line 5, ray 449 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | — | — |
| optiland – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.25e-12 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1 deg, line 5, ray 548, surface 10 |
| optiland – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.42e-14 | nikon-z-24-70f4s-f11-photopic-wide | field 4.33e1 deg, line 4, ray 582 |
| optiland – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 7.64e-13 | nikon-z-24-70f4s-f8-ref-zoom0.5 | field 2.40e1 deg, line 0, ray 576 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 7.82e-14 mm | Pass: landing.maxDistance 1.17e-13 mm | 3009 / 66 / 0 | 3009 / 66 / 0 | 3009 / 66 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 27 | Pass: landing.maxDistance 1.51e-13 mm | Pass: landing.maxDistance 1.17e-13 mm | Pass: hits.maxDistance 1.56e-13 mm | 27077 / 598 / 0 | 27077 / 598 / 0 | 27077 / 598 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 8.53e-14 mm | Pass: landing.maxDistance 1.17e-13 mm | 3009 / 66 / 0 | 3009 / 66 / 0 | 3009 / 66 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 27 | Pass: landing.maxDistance 1.50e-13 mm | Pass: landing.maxDistance 1.20e-13 mm | Pass: hits.maxDistance 1.56e-13 mm | 27077 / 598 / 0 | 27077 / 598 / 0 | 27077 / 598 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 3 | Pass: hits.maxDistance 1.25e-13 mm | Pass: landing.maxDistance 7.82e-14 mm | Pass: hits.maxDistance 1.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 27 | Pass: hits.maxDistance 1.31e-13 mm | Pass: landing.maxDistance 9.59e-14 mm | Pass: hits.maxDistance 1.48e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | Pass: hits.maxDistance 1.25e-13 mm | Pass: landing.maxDistance 7.82e-14 mm | Pass: hits.maxDistance 1.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 27 | Pass: hits.maxDistance 1.31e-13 mm | Pass: landing.maxDistance 9.25e-14 mm | Pass: hits.maxDistance 1.48e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | Pass: hits.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 9.26e-14 mm | Pass: landing.maxDistance 9.95e-14 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 27 | Pass: landing.maxDistance 1.14e-13 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: landing.maxDistance 1.10e-13 mm | 27595 / 80 / 0 | 27595 / 80 / 0 | 27595 / 80 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 9.61e-14 mm | Pass: landing.maxDistance 9.95e-14 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 27 | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 8.88e-14 mm | Pass: landing.maxDistance 1.14e-13 mm | 27595 / 80 / 0 | 27595 / 80 / 0 | 27595 / 80 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | Pass: landing.maxDistance 9.59e-14 mm | Pass: landing.maxDistance 6.76e-14 mm | Pass: landing.maxDistance 9.59e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 27 | Pass: landing.maxDistance 1.07e-13 mm | Pass: landing.maxDistance 9.60e-14 mm | Pass: landing.maxDistance 1.07e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | Pass: landing.maxDistance 9.95e-14 mm | Pass: landing.maxDistance 6.76e-14 mm | Pass: landing.maxDistance 9.95e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 27 | Pass: hits.maxDistance 1.03e-13 mm | Pass: landing.maxDistance 9.60e-14 mm | Pass: landing.maxDistance 1.07e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | Pass: hits.maxDistance 1.34e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 27 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | Pass: hits.maxDistance 1.34e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 27 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | Pass: landing.maxDistance 1.17e-13 mm | Pass: hits.maxDistance 1.58e-13 mm | Pass: hits.maxDistance 1.76e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 27 | Pass: landing.maxDistance 1.81e-13 mm | Pass: hits.maxDistance 1.92e-13 mm | Pass: hits.maxDistance 1.79e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | Pass: landing.maxDistance 1.17e-13 mm | Pass: hits.maxDistance 1.58e-13 mm | Pass: hits.maxDistance 1.76e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 27 | Pass: landing.maxDistance 1.78e-13 mm | Pass: hits.maxDistance 1.92e-13 mm | Pass: hits.maxDistance 1.79e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikkor-z50f12-f5.6-ref | 3 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 27 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikkor-z50f12-f5.6-best-ref | 3 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 27 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikkor-z50f12-f11-ref | 3 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 5.68e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 27 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 5.68e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikkor-z50f12-f11-best-ref | 3 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 5.68e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 27 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 5.68e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | Pass: landing.maxDistance 1.53e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | Pass: landing.maxDistance 1.53e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 3 | Pass: landing.maxDistance 1.63e-13 mm | Pass: hits.maxDistance 7.44e-13 mm | Pass: hits.maxDistance 7.47e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 27 | Pass: landing.maxDistance 1.92e-13 mm | Pass: hits.maxDistance 7.89e-13 mm | Pass: hits.maxDistance 7.92e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | Pass: landing.maxDistance 1.60e-13 mm | Pass: hits.maxDistance 7.44e-13 mm | Pass: hits.maxDistance 7.47e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 27 | Pass: landing.maxDistance 1.92e-13 mm | Pass: hits.maxDistance 7.89e-13 mm | Pass: hits.maxDistance 7.92e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | Pass: landing.maxDistance 3.92e-13 mm | Pass: landing.maxDistance 2.74e-13 mm | Pass: landing.maxDistance 3.27e-13 mm | 2965 / 110 / 0 | 2965 / 110 / 0 | 2965 / 110 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 27 | Pass: landing.maxDistance 3.72e-13 mm | Pass: landing.maxDistance 2.70e-13 mm | Pass: landing.maxDistance 4.26e-13 mm | 26669 / 1006 / 0 | 26669 / 1006 / 0 | 26669 / 1006 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | Pass: landing.maxDistance 3.95e-13 mm | Pass: landing.maxDistance 2.74e-13 mm | Pass: landing.maxDistance 3.27e-13 mm | 2965 / 110 / 0 | 2965 / 110 / 0 | 2965 / 110 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 27 | Pass: landing.maxDistance 3.72e-13 mm | Pass: landing.maxDistance 2.63e-13 mm | Pass: landing.maxDistance 4.26e-13 mm | 26669 / 1006 / 0 | 26669 / 1006 / 0 | 26669 / 1006 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | Pass: landing.maxDistance 2.88e-13 mm | Pass: landing.maxDistance 2.20e-13 mm | Pass: landing.maxDistance 3.45e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 27 | Pass: landing.maxDistance 3.38e-13 mm | Pass: landing.maxDistance 2.98e-13 mm | Pass: landing.maxDistance 3.56e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | Pass: landing.maxDistance 2.84e-13 mm | Pass: landing.maxDistance 2.20e-13 mm | Pass: landing.maxDistance 3.48e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 27 | Pass: landing.maxDistance 3.38e-13 mm | Pass: landing.maxDistance 2.98e-13 mm | Pass: landing.maxDistance 3.56e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | Pass: landing.maxDistance 1.43e-13 mm | Pass: landing.maxDistance 1.72e-13 mm | Pass: landing.maxDistance 1.99e-13 mm | 2855 / 220 / 0 | 2855 / 220 / 0 | 2855 / 220 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 27 | Pass: landing.maxDistance 2.14e-13 mm | Pass: landing.maxDistance 1.51e-13 mm | Pass: landing.maxDistance 2.36e-13 mm | 25675 / 2000 / 0 | 25675 / 2000 / 0 | 25675 / 2000 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 1.68e-13 mm | Pass: landing.maxDistance 1.99e-13 mm | 2855 / 220 / 0 | 2855 / 220 / 0 | 2855 / 220 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 27 | Pass: landing.maxDistance 2.14e-13 mm | Pass: landing.maxDistance 1.51e-13 mm | Pass: landing.maxDistance 2.39e-13 mm | 25675 / 2000 / 0 | 25675 / 2000 / 0 | 25675 / 2000 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | Pass: landing.maxDistance 1.56e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 1.78e-13 mm | 3035 / 40 / 0 | 3035 / 40 / 0 | 3035 / 40 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 27 | Pass: landing.maxDistance 2.25e-13 mm | Pass: landing.maxDistance 1.64e-13 mm | Pass: landing.maxDistance 2.64e-13 mm | 27309 / 366 / 0 | 27309 / 366 / 0 | 27309 / 366 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | Pass: landing.maxDistance 1.60e-13 mm | Pass: landing.maxDistance 1.31e-13 mm | Pass: landing.maxDistance 1.78e-13 mm | 3035 / 40 / 0 | 3035 / 40 / 0 | 3035 / 40 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 27 | Pass: landing.maxDistance 2.21e-13 mm | Pass: landing.maxDistance 1.61e-13 mm | Pass: landing.maxDistance 2.64e-13 mm | 27309 / 366 / 0 | 27309 / 366 / 0 | 27309 / 366 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | 3005 / 70 / 0 | 3005 / 70 / 0 | 3005 / 70 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | Pass: hits.maxDistance 1.03e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2993 / 82 / 0 | 2993 / 82 / 0 | 2993 / 82 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.88e-13 mm | 2891 / 184 / 0 | 2891 / 184 / 0 | 2891 / 184 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 27 | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 27077 / 598 / 0 | 27077 / 598 / 0 | 27077 / 598 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 26951 / 724 / 0 | 26951 / 724 / 0 | 26951 / 724 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 26023 / 1652 / 0 | 26023 / 1652 / 0 | 26023 / 1652 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | 3005 / 70 / 0 | 3005 / 70 / 0 | 3005 / 70 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | Pass: hits.maxDistance 1.03e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2993 / 82 / 0 | 2993 / 82 / 0 | 2993 / 82 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.88e-13 mm | 2891 / 184 / 0 | 2891 / 184 / 0 | 2891 / 184 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 27 | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 27077 / 598 / 0 | 27077 / 598 / 0 | 27077 / 598 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 26951 / 724 / 0 | 26951 / 724 / 0 | 26951 / 724 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 26023 / 1652 / 0 | 26023 / 1652 / 0 | 26023 / 1652 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | Pass: hits.maxDistance 9.06e-13 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.25e-12 mm | Pass: hits.maxDistance 1.25e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | Pass: hits.maxDistance 9.06e-13 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.25e-12 mm | Pass: hits.maxDistance 1.25e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 3 | Pass: landing.maxDistance 1.60e-13 mm | Pass: hits.maxDistance 7.45e-13 mm | Pass: hits.maxDistance 7.43e-13 mm | 2951 / 124 / 0 | 2951 / 124 / 0 | 2951 / 124 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 27 | Pass: hits.maxDistance 1.52e-13 mm | Pass: hits.maxDistance 7.44e-13 mm | Pass: hits.maxDistance 7.47e-13 mm | 26569 / 1106 / 0 | 26569 / 1106 / 0 | 26569 / 1106 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | Pass: landing.maxDistance 1.64e-13 mm | Pass: hits.maxDistance 7.45e-13 mm | Pass: hits.maxDistance 7.43e-13 mm | 2951 / 124 / 0 | 2951 / 124 / 0 | 2951 / 124 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 27 | Pass: hits.maxDistance 1.52e-13 mm | Pass: hits.maxDistance 7.44e-13 mm | Pass: hits.maxDistance 7.47e-13 mm | 26569 / 1106 / 0 | 26569 / 1106 / 0 | 26569 / 1106 / 0 |
| nikon-z-mc-105f28-f11-ref | 3 | Pass: landing.maxDistance 1.35e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 1.46e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 27 | Pass: hits.maxDistance 1.63e-13 mm | Pass: landing.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.64e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 3 | Pass: landing.maxDistance 1.35e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 1.46e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 27 | Pass: hits.maxDistance 1.63e-13 mm | Pass: landing.maxDistance 1.49e-13 mm | Pass: landing.maxDistance 1.60e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 3 | Pass: landing.maxDistance 1.03e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | Pass: landing.maxDistance 1.03e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-135f18-plena-f11-ref | 3 | Pass: landing.maxDistance 1.28e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 27 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 3 | Pass: landing.maxDistance 1.28e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 27 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | Pass: hits.maxDistance 3.93e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2811 / 264 / 0 | 2811 / 264 / 0 | 2811 / 264 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 27 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 25247 / 2428 / 0 | 25247 / 2428 / 0 | 25247 / 2428 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | Pass: hits.maxDistance 3.93e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2811 / 264 / 0 | 2811 / 264 / 0 | 2811 / 264 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 27 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 25247 / 2428 / 0 | 25247 / 2428 / 0 | 25247 / 2428 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | Pass: landing.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | 2969 / 106 / 0 | 2969 / 106 / 0 | 2969 / 106 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 27 | Pass: landing.maxDistance 9.24e-14 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 26573 / 1102 / 0 | 26573 / 1102 / 0 | 26573 / 1102 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | Pass: landing.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | 2969 / 106 / 0 | 2969 / 106 / 0 | 2969 / 106 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 27 | Pass: landing.maxDistance 9.24e-14 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 26573 / 1102 / 0 | 26573 / 1102 / 0 | 26573 / 1102 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.17e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | 2853 / 222 / 0 | 2853 / 222 / 0 | 2853 / 222 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 27 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 25309 / 2366 / 0 | 25309 / 2366 / 0 | 25309 / 2366 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 25667 / 2008 / 0 | 25667 / 2008 / 0 | 25667 / 2008 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 23481 / 4194 / 0 | 23481 / 4194 / 0 | 23481 / 4194 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.17e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | 2853 / 222 / 0 | 2853 / 222 / 0 | 2853 / 222 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 27 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 25309 / 2366 / 0 | 25309 / 2366 / 0 | 25309 / 2366 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 25667 / 2008 / 0 | 25667 / 2008 / 0 | 25667 / 2008 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 23481 / 4194 / 0 | 23481 / 4194 / 0 | 23481 / 4194 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | Pass: hits.maxDistance 9.10e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.21e-12 mm | Pass: hits.maxDistance 1.19e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 27 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 1.11e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.21e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | Pass: hits.maxDistance 9.10e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.21e-12 mm | Pass: hits.maxDistance 1.19e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 27 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 1.11e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 27 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.21e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.08e-9 | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | field 2.40e1 deg, line 3, ray 621 |
| lv – optiland | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.08e-9 | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | field 2.40e1 deg, line 3, ray 621 |
| lv – optiland | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.16e-9 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | field 3.15e0 deg, line 7, ray 621 |
| lv – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1 deg, line 7, ray 399 |
| lv – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1 deg, line 7, ray 399 |
| lv – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.52e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1 deg, line 5, ray 580 |
| optiland – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1 deg, line 7, ray 399 |
| optiland – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1 deg, line 7, ray 399 |
| optiland – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.64e-9 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1 deg, line 7, ray 836 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f5.6-photopic | 27 | Pass: opd.maxAbs 3.61e-10 waves | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 3.55e-10 waves |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 27 | Pass: opd.maxAbs 4.06e-10 waves | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 4.06e-10 waves |
| canon-ef-135-f2l-usm-f11-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f11-photopic | 27 | Pass: opd.maxAbs 4.10e-10 waves | Pass: opd.maxAbs 3.61e-10 waves | Pass: opd.maxAbs 3.52e-10 waves |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f11-best-photopic | 27 | Pass: opd.maxAbs 4.28e-10 waves | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 3.52e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 27 | Pass: opd.maxAbs 3.21e-10 waves | Pass: opd.maxAbs 2.82e-10 waves | Pass: opd.maxAbs 3.38e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 27 | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 2.82e-10 waves | Pass: opd.maxAbs 2.82e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 27 | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 3.01e-10 waves | Pass: opd.maxAbs 3.38e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 27 | Pass: opd.maxAbs 3.38e-10 waves | Pass: opd.maxAbs 3.01e-10 waves | Pass: opd.maxAbs 2.93e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 27 | Pass: opticalPath.maxAbs 1.56e-9 waves | Pass: opticalPath.maxAbs 1.62e-9 waves | Pass: opticalPath.maxAbs 1.52e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.31e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 27 | Pass: opticalPath.maxAbs 1.56e-9 waves | Pass: opd.maxAbs 1.63e-9 waves | Pass: opticalPath.maxAbs 1.52e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 27 | Pass: opticalPathToImage.maxAbs 4.69e-10 waves | Pass: opd.maxAbs 5.63e-10 waves | Pass: opticalPathToImage.maxAbs 4.69e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 27 | Pass: opticalPathToImage.maxAbs 4.69e-10 waves | Pass: opd.maxAbs 5.63e-10 waves | Pass: opd.maxAbs 5.07e-10 waves |
| nikkor-z50f12-f5.6-ref | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.84e-9 waves |
| nikkor-z50f12-f5.6-photopic | 27 | Pass: opticalPath.maxAbs 1.80e-9 waves | Pass: opd.maxAbs 2.40e-9 waves | Pass: opd.maxAbs 2.16e-9 waves |
| nikkor-z50f12-f5.6-best-ref | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.84e-9 waves |
| nikkor-z50f12-f5.6-best-photopic | 27 | Pass: opticalPath.maxAbs 1.80e-9 waves | Pass: opd.maxAbs 2.40e-9 waves | Pass: opd.maxAbs 2.04e-9 waves |
| nikkor-z50f12-f11-ref | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikkor-z50f12-f11-photopic | 27 | Pass: opticalPath.maxAbs 1.20e-9 waves | Pass: opd.maxAbs 1.13e-9 waves | Pass: opd.maxAbs 8.57e-10 waves |
| nikkor-z50f12-f11-best-ref | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikkor-z50f12-f11-best-photopic | 27 | Pass: opticalPath.maxAbs 1.20e-9 waves | Pass: opd.maxAbs 1.13e-9 waves | Pass: opd.maxAbs 8.57e-10 waves |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves |
| sony-fe-20mm-f18-g-f5.6-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.92e-9 waves | Pass: opticalPathToImage.maxAbs 1.98e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.86e-9 waves | Pass: opticalPathToImage.maxAbs 1.98e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| sony-fe-20mm-f18-g-f11-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.16e-9 waves | Pass: opticalPathToImage.maxAbs 1.16e-9 waves |
| sony-fe-20mm-f18-g-f11-photopic | 27 | Pass: opd.maxAbs 4.28e-10 waves | Pass: opticalPathToImage.maxAbs 1.29e-9 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.16e-9 waves | Pass: opticalPathToImage.maxAbs 1.21e-9 waves |
| sony-fe-20mm-f18-g-f11-best-photopic | 27 | Pass: opd.maxAbs 4.28e-10 waves | Pass: opticalPathToImage.maxAbs 1.29e-9 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 27 | Pass: opd.maxAbs 1.92e-9 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opd.maxAbs 1.68e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.68e-9 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opd.maxAbs 1.62e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 27 | Pass: opd.maxAbs 1.92e-9 waves | Pass: opd.maxAbs 1.41e-9 waves | Pass: opd.maxAbs 1.92e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.55e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 27 | Pass: opd.maxAbs 2.16e-9 waves | Pass: opd.maxAbs 1.50e-9 waves | Pass: opd.maxAbs 1.92e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.35e-10 waves | Pass: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 27 | Pass: opd.maxAbs 5.07e-10 waves | Pass: opd.maxAbs 4.69e-10 waves | Pass: opd.maxAbs 4.82e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 27 | Pass: opd.maxAbs 5.28e-10 waves | Pass: opd.maxAbs 4.10e-10 waves | Pass: opd.maxAbs 4.81e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 27 | Pass: opd.maxAbs 5.86e-10 waves | Pass: opd.maxAbs 4.81e-10 waves | Pass: opd.maxAbs 5.41e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 27 | Pass: opd.maxAbs 5.28e-10 waves | Pass: opd.maxAbs 4.81e-10 waves | Pass: opd.maxAbs 4.81e-10 waves |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 2.18e-9 waves | Pass: opd.maxAbs 2.13e-9 waves |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-wide | 27 | Pass: opd.maxAbs 2.04e-9 waves | Pass: opd.maxAbs 2.42e-9 waves | Pass: opd.maxAbs 2.53e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 27 | Pass: opticalPath.maxAbs 2.08e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opticalPathToImage.maxAbs 1.99e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-tele | 27 | Pass: opticalPath.maxAbs 1.19e-9 waves | Pass: opd.maxAbs 2.36e-9 waves | Pass: opd.maxAbs 2.40e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 2.18e-9 waves | Pass: opd.maxAbs 2.13e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 27 | Pass: opd.maxAbs 2.04e-9 waves | Pass: opd.maxAbs 2.42e-9 waves | Pass: opd.maxAbs 2.53e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 27 | Pass: opticalPath.maxAbs 2.08e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 27 | Pass: opticalPath.maxAbs 1.19e-9 waves | Pass: opd.maxAbs 2.36e-9 waves | Pass: opd.maxAbs 2.40e-9 waves |
| nikon-z-24-70f4s-f11-ref-wide | 3 | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 2.37e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves |
| nikon-z-24-70f4s-f11-ref-tele | 3 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f11-photopic-wide | 27 | Pass: opd.maxAbs 1.25e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 27 | Pass: opd.maxAbs 1.52e-9 waves | Pass: opticalPath.maxAbs 2.04e-9 waves | Pass: opticalPath.maxAbs 2.04e-9 waves |
| nikon-z-24-70f4s-f11-photopic-tele | 27 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.80e-9 waves | Pass: opticalPath.maxAbs 1.63e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 2.37e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-wide | 27 | Pass: opd.maxAbs 1.25e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 27 | Pass: opd.maxAbs 1.52e-9 waves | Pass: opticalPath.maxAbs 2.04e-9 waves | Pass: opticalPath.maxAbs 2.04e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-tele | 27 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.80e-9 waves | Pass: opticalPath.maxAbs 1.63e-9 waves |
| nikon-z-mc-105f28-f5.6-ref | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-f5.6-photopic | 27 | Pass: opd.maxAbs 8.41e-10 waves | Pass: opd.maxAbs 9.38e-10 waves | Pass: opd.maxAbs 1.01e-9 waves |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 7.26e-10 waves |
| nikon-z-mc-105f28-f5.6-best-photopic | 27 | Pass: opd.maxAbs 8.41e-10 waves | Pass: opd.maxAbs 9.38e-10 waves | Pass: opd.maxAbs 1.01e-9 waves |
| nikon-z-mc-105f28-f11-ref | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f11-photopic | 27 | Pass: opd.maxAbs 6.61e-10 waves | Pass: opd.maxAbs 5.41e-10 waves | Pass: opd.maxAbs 4.81e-10 waves |
| nikon-z-mc-105f28-f11-best-ref | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f11-best-photopic | 27 | Pass: opd.maxAbs 6.61e-10 waves | Pass: opd.maxAbs 4.81e-10 waves | Pass: opd.maxAbs 5.41e-10 waves |
| nikon-z-135f18-plena-f5.6-ref | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| nikon-z-135f18-plena-f5.6-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.46e-9 waves | Pass: opticalPath.maxAbs 1.24e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | Pass: opd.maxAbs 5.32e-10 waves | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| nikon-z-135f18-plena-f5.6-best-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.46e-9 waves | Pass: opticalPath.maxAbs 1.24e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| nikon-z-135f18-plena-f11-ref | 3 | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f11-photopic | 27 | Pass: opd.maxAbs 1.20e-9 waves | Pass: opticalPath.maxAbs 1.32e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| nikon-z-135f18-plena-f11-best-ref | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f11-best-photopic | 27 | Pass: opd.maxAbs 1.20e-9 waves | Pass: opticalPath.maxAbs 1.32e-9 waves | Pass: opd.maxAbs 1.41e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | Pass: opd.maxAbs 8.47e-10 waves | Pass: opd.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.31e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 27 | Pass: opd.maxAbs 1.27e-9 waves | Pass: opd.maxAbs 1.65e-9 waves | Pass: opd.maxAbs 1.65e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | Pass: opd.maxAbs 8.47e-10 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.31e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 27 | Pass: opd.maxAbs 1.27e-9 waves | Pass: opd.maxAbs 1.65e-9 waves | Pass: opd.maxAbs 1.65e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 27 | Pass: opd.maxAbs 2.10e-10 waves | Pass: opd.maxAbs 1.71e-9 waves | Pass: opticalPath.maxAbs 1.68e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.33e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 27 | Pass: opd.maxAbs 2.10e-10 waves | Pass: opd.maxAbs 1.71e-9 waves | Pass: opticalPath.maxAbs 1.68e-9 waves |
| nikon-z-24-70f4s-open-ref-wide | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves |
| nikon-z-24-70f4s-open-ref-tele | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-open-photopic-wide | 27 | Pass: opd.maxAbs 1.87e-9 waves | Pass: opd.maxAbs 2.34e-9 waves | Pass: opd.maxAbs 2.64e-9 waves |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 27 | Pass: opticalPath.maxAbs 1.32e-9 waves | Pass: opticalPath.maxAbs 1.80e-9 waves | Pass: opticalPath.maxAbs 1.82e-9 waves |
| nikon-z-24-70f4s-open-photopic-tele | 27 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 2.05e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-wide | 27 | Pass: opd.maxAbs 1.87e-9 waves | Pass: opd.maxAbs 2.34e-9 waves | Pass: opd.maxAbs 2.64e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 27 | Pass: opticalPath.maxAbs 1.32e-9 waves | Pass: opticalPath.maxAbs 1.80e-9 waves | Pass: opticalPath.maxAbs 1.82e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-tele | 27 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 2.05e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| nikon-z-24-70f4s-f8-ref-wide | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f8-ref-tele | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-f8-photopic-wide | 27 | Pass: opd.maxAbs 1.39e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 27 | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 2.04e-9 waves | Pass: opticalPath.maxAbs 2.16e-9 waves |
| nikon-z-24-70f4s-f8-photopic-tele | 27 | Pass: opd.maxAbs 1.17e-9 waves | Pass: opd.maxAbs 1.56e-9 waves | Pass: opd.maxAbs 1.58e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-wide | 27 | Pass: opd.maxAbs 1.39e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 27 | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 2.04e-9 waves | Pass: opticalPath.maxAbs 2.16e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-tele | 27 | Pass: opd.maxAbs 1.17e-9 waves | Pass: opd.maxAbs 1.56e-9 waves | Pass: opd.maxAbs 1.58e-9 waves |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.10e-11 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | cut tangential, field 2.56e1 deg, frequencyPerMm 100 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.48e-11 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1 deg, frequencyPerMm 92 |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.43e-11 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1 deg, frequencyPerMm 94 |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | canon-ef-135-f2l-usm-f5.6-photopic | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | Pass: mtf.maxAbs 8.29e-13 | Pass: mtf.maxAbs 6.43e-13 | Pass: mtf.maxAbs 9.10e-13 |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | Pass: mtf.maxAbs 3.54e-13 | Pass: mtf.maxAbs 4.99e-13 | Pass: mtf.maxAbs 8.03e-13 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | Pass: mtf.maxAbs 6.97e-13 | Pass: mtf.maxAbs 5.98e-13 | Pass: mtf.maxAbs 9.78e-13 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 3.21e-13 | Pass: mtf.maxAbs 5.87e-13 | Pass: mtf.maxAbs 8.46e-13 |
| canon-ef-135-f2l-usm-f11-ref | 3 | Pass: mtf.maxAbs 3.34e-13 | Pass: mtf.maxAbs 2.37e-13 | Pass: mtf.maxAbs 4.88e-13 |
| canon-ef-135-f2l-usm-f11-photopic | 3 | Pass: mtf.maxAbs 8.58e-13 | Pass: mtf.maxAbs 3.65e-13 | Pass: mtf.maxAbs 6.93e-13 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | Pass: mtf.maxAbs 3.53e-13 | Pass: mtf.maxAbs 2.25e-13 | Pass: mtf.maxAbs 5.00e-13 |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.59e-13 | Pass: mtf.maxAbs 4.33e-13 | Pass: mtf.maxAbs 5.10e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | Pass: mtf.maxAbs 4.27e-13 | Pass: mtf.maxAbs 6.20e-13 | Pass: mtf.maxAbs 1.05e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | Pass: mtf.maxAbs 3.90e-13 | Pass: mtf.maxAbs 5.55e-13 | Pass: mtf.maxAbs 9.34e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | Pass: mtf.maxAbs 4.89e-13 | Pass: mtf.maxAbs 4.45e-13 | Pass: mtf.maxAbs 8.47e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 6.05e-13 | Pass: mtf.maxAbs 2.36e-13 | Pass: mtf.maxAbs 6.29e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | Pass: mtf.maxAbs 2.61e-13 | Pass: mtf.maxAbs 3.00e-13 | Pass: mtf.maxAbs 5.37e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | Pass: mtf.maxAbs 5.50e-13 | Pass: mtf.maxAbs 2.45e-13 | Pass: mtf.maxAbs 4.03e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | Pass: mtf.maxAbs 2.62e-13 | Pass: mtf.maxAbs 3.09e-13 | Pass: mtf.maxAbs 5.57e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.37e-13 | Pass: mtf.maxAbs 2.39e-13 | Pass: mtf.maxAbs 4.40e-13 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | Pass: mtf.maxAbs 4.36e-13 | Pass: mtf.maxAbs 4.28e-12 | Pass: mtf.maxAbs 4.29e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | Pass: mtf.maxAbs 2.89e-13 | Pass: mtf.maxAbs 3.57e-13 | Pass: mtf.maxAbs 3.60e-13 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | Pass: mtf.maxAbs 4.23e-13 | Pass: mtf.maxAbs 4.01e-12 | Pass: mtf.maxAbs 4.14e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 3.38e-13 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 1.70e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | Pass: mtf.maxAbs 1.55e-13 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 1.72e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | Pass: mtf.maxAbs 4.81e-13 | Pass: mtf.maxAbs 7.51e-14 | Pass: mtf.maxAbs 5.29e-13 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | Pass: mtf.maxAbs 1.57e-13 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 1.63e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.86e-13 | Pass: mtf.maxAbs 2.27e-13 | Pass: mtf.maxAbs 8.01e-13 |
| nikkor-z50f12-f5.6-ref | 3 | Pass: mtf.maxAbs 3.12e-12 | Pass: mtf.maxAbs 7.45e-12 | Pass: mtf.maxAbs 7.39e-12 |
| nikkor-z50f12-f5.6-photopic | 3 | Pass: mtf.maxAbs 2.66e-12 | Pass: mtf.maxAbs 6.00e-12 | Pass: mtf.maxAbs 7.09e-12 |
| nikkor-z50f12-f5.6-best-ref | 3 | Pass: mtf.maxAbs 3.08e-12 | Pass: mtf.maxAbs 7.34e-12 | Pass: mtf.maxAbs 7.31e-12 |
| nikkor-z50f12-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 2.62e-12 | Pass: mtf.maxAbs 5.96e-12 | Pass: mtf.maxAbs 6.77e-12 |
| nikkor-z50f12-f11-ref | 3 | Pass: mtf.maxAbs 9.58e-13 | Pass: mtf.maxAbs 6.61e-13 | Pass: mtf.maxAbs 1.62e-12 |
| nikkor-z50f12-f11-photopic | 3 | Pass: mtf.maxAbs 7.38e-13 | Pass: mtf.maxAbs 2.41e-13 | Pass: mtf.maxAbs 8.51e-13 |
| nikkor-z50f12-f11-best-ref | 3 | Pass: mtf.maxAbs 9.25e-13 | Pass: mtf.maxAbs 6.89e-13 | Pass: mtf.maxAbs 1.61e-12 |
| nikkor-z50f12-f11-best-photopic | 3 | Pass: mtf.maxAbs 8.32e-13 | Pass: mtf.maxAbs 2.51e-13 | Pass: mtf.maxAbs 8.68e-13 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | Pass: mtf.maxAbs 1.17e-12 | Pass: mtf.maxAbs 2.97e-12 | Pass: mtf.maxAbs 3.20e-12 |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | Pass: mtf.maxAbs 6.29e-13 | Pass: mtf.maxAbs 2.86e-12 | Pass: mtf.maxAbs 2.66e-12 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.17e-12 | Pass: mtf.maxAbs 3.03e-12 | Pass: mtf.maxAbs 3.26e-12 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 6.56e-13 | Pass: mtf.maxAbs 3.13e-12 | Pass: mtf.maxAbs 2.89e-12 |
| sony-fe-20mm-f18-g-f11-ref | 3 | Pass: mtf.maxAbs 6.67e-13 | Pass: mtf.maxAbs 2.72e-12 | Pass: mtf.maxAbs 2.88e-12 |
| sony-fe-20mm-f18-g-f11-photopic | 3 | Pass: mtf.maxAbs 2.76e-13 | Pass: mtf.maxAbs 2.05e-12 | Pass: mtf.maxAbs 1.93e-12 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | Pass: mtf.maxAbs 6.94e-13 | Pass: mtf.maxAbs 2.64e-12 | Pass: mtf.maxAbs 2.82e-12 |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | Pass: mtf.maxAbs 2.96e-13 | Pass: mtf.maxAbs 2.10e-12 | Pass: mtf.maxAbs 1.96e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | Pass: mtf.maxAbs 5.13e-12 | Pass: mtf.maxAbs 3.78e-12 | Pass: mtf.maxAbs 6.99e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | Pass: mtf.maxAbs 3.59e-12 | Pass: mtf.maxAbs 3.46e-12 | Pass: mtf.maxAbs 6.71e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.43e-12 | Pass: mtf.maxAbs 6.59e-13 | Pass: mtf.maxAbs 1.56e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 3.06e-12 | Pass: mtf.maxAbs 1.06e-12 | Pass: mtf.maxAbs 2.00e-12 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | Pass: mtf.maxAbs 1.57e-12 | Pass: mtf.maxAbs 1.89e-12 | Pass: mtf.maxAbs 3.30e-12 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | Pass: mtf.maxAbs 2.36e-12 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 2.89e-12 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 7.77e-13 | Pass: mtf.maxAbs 2.44e-12 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 3.36e-13 | Pass: mtf.maxAbs 1.27e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | Pass: mtf.maxAbs 1.22e-12 | Pass: mtf.maxAbs 1.95e-12 | Pass: mtf.maxAbs 3.05e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | Pass: mtf.maxAbs 1.77e-12 | Pass: mtf.maxAbs 1.78e-12 | Pass: mtf.maxAbs 3.34e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.14e-12 | Pass: mtf.maxAbs 1.82e-12 | Pass: mtf.maxAbs 2.86e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 1.83e-12 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 3.46e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | Pass: mtf.maxAbs 9.12e-13 | Pass: mtf.maxAbs 1.95e-12 | Pass: mtf.maxAbs 1.82e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | Pass: mtf.maxAbs 1.20e-12 | Pass: mtf.maxAbs 9.78e-13 | Pass: mtf.maxAbs 2.17e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | Pass: mtf.maxAbs 9.17e-13 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 1.76e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | Pass: mtf.maxAbs 1.20e-12 | Pass: mtf.maxAbs 9.64e-13 | Pass: mtf.maxAbs 2.16e-12 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | Pass: mtf.maxAbs 7.64e-12 | Pass: mtf.maxAbs 4.98e-12 | Pass: mtf.maxAbs 6.38e-12 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 8.35e-13 | Pass: mtf.maxAbs 5.38e-12 | Pass: mtf.maxAbs 4.85e-12 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | Pass: mtf.maxAbs 6.31e-13 | Pass: mtf.maxAbs 1.35e-11 | Pass: mtf.maxAbs 1.34e-11 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | Pass: mtf.maxAbs 1.33e-12 | Pass: mtf.maxAbs 4.79e-12 | Pass: mtf.maxAbs 4.87e-12 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 3.35e-13 | Pass: mtf.maxAbs 4.39e-12 | Pass: mtf.maxAbs 4.40e-12 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | Pass: mtf.maxAbs 5.34e-13 | Pass: mtf.maxAbs 5.28e-12 | Pass: mtf.maxAbs 5.30e-12 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | Pass: mtf.maxAbs 6.83e-12 | Pass: mtf.maxAbs 1.21e-11 | Pass: mtf.maxAbs 1.21e-11 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 6.50e-13 | Pass: mtf.maxAbs 7.61e-12 | Pass: mtf.maxAbs 7.13e-12 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | Pass: mtf.maxAbs 6.66e-13 | Pass: mtf.maxAbs 1.48e-11 | Pass: mtf.maxAbs 1.43e-11 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 5.99e-12 | Pass: mtf.maxAbs 6.06e-12 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 5.30e-13 | Pass: mtf.maxAbs 4.17e-12 | Pass: mtf.maxAbs 4.35e-12 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | Pass: mtf.maxAbs 5.95e-13 | Pass: mtf.maxAbs 5.42e-12 | Pass: mtf.maxAbs 5.26e-12 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | Pass: mtf.maxAbs 1.54e-12 | Pass: mtf.maxAbs 6.63e-12 | Pass: mtf.maxAbs 6.35e-12 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 4.79e-13 | Pass: mtf.maxAbs 1.60e-12 | Pass: mtf.maxAbs 1.75e-12 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | Pass: mtf.maxAbs 7.35e-13 | Pass: mtf.maxAbs 6.93e-12 | Pass: mtf.maxAbs 7.67e-12 |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | Pass: mtf.maxAbs 7.66e-13 | Pass: mtf.maxAbs 4.37e-12 | Pass: mtf.maxAbs 4.41e-12 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 2.67e-13 | Pass: mtf.maxAbs 2.32e-12 | Pass: mtf.maxAbs 2.31e-12 |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | Pass: mtf.maxAbs 4.65e-13 | Pass: mtf.maxAbs 4.75e-12 | Pass: mtf.maxAbs 5.05e-12 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | Pass: mtf.maxAbs 1.41e-12 | Pass: mtf.maxAbs 1.01e-11 | Pass: mtf.maxAbs 9.77e-12 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 5.36e-13 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 1.48e-12 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | Pass: mtf.maxAbs 6.77e-13 | Pass: mtf.maxAbs 7.34e-12 | Pass: mtf.maxAbs 8.01e-12 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | Pass: mtf.maxAbs 7.43e-13 | Pass: mtf.maxAbs 4.62e-12 | Pass: mtf.maxAbs 4.66e-12 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 2.79e-13 | Pass: mtf.maxAbs 2.10e-12 | Pass: mtf.maxAbs 2.11e-12 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | Pass: mtf.maxAbs 3.63e-13 | Pass: mtf.maxAbs 2.63e-12 | Pass: mtf.maxAbs 2.82e-12 |
| nikon-z-mc-105f28-f5.6-ref | 3 | Pass: mtf.maxAbs 9.14e-13 | Pass: mtf.maxAbs 3.78e-12 | Pass: mtf.maxAbs 3.51e-12 |
| nikon-z-mc-105f28-f5.6-photopic | 3 | Pass: mtf.maxAbs 4.30e-13 | Pass: mtf.maxAbs 3.67e-12 | Pass: mtf.maxAbs 3.46e-12 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | Pass: mtf.maxAbs 9.35e-13 | Pass: mtf.maxAbs 8.77e-13 | Pass: mtf.maxAbs 8.64e-13 |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 4.02e-13 | Pass: mtf.maxAbs 6.29e-13 | Pass: mtf.maxAbs 6.66e-13 |
| nikon-z-mc-105f28-f11-ref | 3 | Pass: mtf.maxAbs 5.42e-13 | Pass: mtf.maxAbs 4.66e-13 | Pass: mtf.maxAbs 7.85e-13 |
| nikon-z-mc-105f28-f11-photopic | 3 | Pass: mtf.maxAbs 5.98e-13 | Pass: mtf.maxAbs 4.26e-13 | Pass: mtf.maxAbs 6.65e-13 |
| nikon-z-mc-105f28-f11-best-ref | 3 | Pass: mtf.maxAbs 5.81e-13 | Pass: mtf.maxAbs 4.49e-13 | Pass: mtf.maxAbs 7.34e-13 |
| nikon-z-mc-105f28-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.38e-13 | Pass: mtf.maxAbs 3.87e-13 | Pass: mtf.maxAbs 5.96e-13 |
| nikon-z-135f18-plena-f5.6-ref | 3 | Pass: mtf.maxAbs 9.36e-13 | Pass: mtf.maxAbs 7.36e-13 | Pass: mtf.maxAbs 1.59e-12 |
| nikon-z-135f18-plena-f5.6-photopic | 3 | Pass: mtf.maxAbs 6.91e-13 | Pass: mtf.maxAbs 8.87e-13 | Pass: mtf.maxAbs 1.58e-12 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.08e-12 | Pass: mtf.maxAbs 9.74e-13 | Pass: mtf.maxAbs 1.83e-12 |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 6.80e-13 | Pass: mtf.maxAbs 8.59e-13 | Pass: mtf.maxAbs 1.53e-12 |
| nikon-z-135f18-plena-f11-ref | 3 | Pass: mtf.maxAbs 6.08e-13 | Pass: mtf.maxAbs 2.81e-13 | Pass: mtf.maxAbs 3.73e-13 |
| nikon-z-135f18-plena-f11-photopic | 3 | Pass: mtf.maxAbs 2.75e-13 | Pass: mtf.maxAbs 9.29e-13 | Pass: mtf.maxAbs 6.56e-13 |
| nikon-z-135f18-plena-f11-best-ref | 3 | Pass: mtf.maxAbs 6.42e-13 | Pass: mtf.maxAbs 2.88e-13 | Pass: mtf.maxAbs 3.82e-13 |
| nikon-z-135f18-plena-f11-best-photopic | 3 | Pass: mtf.maxAbs 2.75e-13 | Pass: mtf.maxAbs 9.19e-13 | Pass: mtf.maxAbs 6.44e-13 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | Pass: mtf.maxAbs 8.64e-12 | Pass: mtf.maxAbs 4.91e-12 | Pass: mtf.maxAbs 9.83e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | Pass: mtf.maxAbs 4.23e-12 | Pass: mtf.maxAbs 4.10e-12 | Pass: mtf.maxAbs 7.14e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.10e-11 | Pass: mtf.maxAbs 7.54e-12 | Pass: mtf.maxAbs 9.22e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 4.39e-12 | Pass: mtf.maxAbs 3.18e-12 | Pass: mtf.maxAbs 7.57e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | Pass: mtf.maxAbs 5.82e-13 | Pass: mtf.maxAbs 6.06e-12 | Pass: mtf.maxAbs 6.42e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | Pass: mtf.maxAbs 1.76e-13 | Pass: mtf.maxAbs 2.07e-12 | Pass: mtf.maxAbs 1.98e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | Pass: mtf.maxAbs 5.79e-13 | Pass: mtf.maxAbs 7.62e-12 | Pass: mtf.maxAbs 7.95e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | Pass: mtf.maxAbs 1.69e-13 | Pass: mtf.maxAbs 2.61e-12 | Pass: mtf.maxAbs 2.49e-12 |
| nikon-z-24-70f4s-open-ref-wide | 3 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 1.05e-11 | Pass: mtf.maxAbs 1.13e-11 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 1.11e-12 | Pass: mtf.maxAbs 3.11e-12 | Pass: mtf.maxAbs 3.40e-12 |
| nikon-z-24-70f4s-open-ref-tele | 3 | Pass: mtf.maxAbs 1.23e-12 | Pass: mtf.maxAbs 1.23e-11 | Pass: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-open-photopic-wide | 3 | Pass: mtf.maxAbs 2.77e-12 | Pass: mtf.maxAbs 7.71e-12 | Pass: mtf.maxAbs 7.93e-12 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 4.90e-13 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 2.25e-12 |
| nikon-z-24-70f4s-open-photopic-tele | 3 | Pass: mtf.maxAbs 7.67e-13 | Pass: mtf.maxAbs 7.52e-12 | Pass: mtf.maxAbs 7.61e-12 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | Pass: mtf.maxAbs 2.20e-12 | Pass: mtf.maxAbs 1.13e-11 | Pass: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 1.22e-12 | Pass: mtf.maxAbs 7.05e-12 | Pass: mtf.maxAbs 6.42e-12 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | Pass: mtf.maxAbs 9.15e-13 | Pass: mtf.maxAbs 1.19e-11 | Pass: mtf.maxAbs 1.18e-11 |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | Pass: mtf.maxAbs 2.60e-12 | Pass: mtf.maxAbs 9.87e-12 | Pass: mtf.maxAbs 1.00e-11 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 7.13e-13 | Pass: mtf.maxAbs 3.52e-12 | Pass: mtf.maxAbs 3.84e-12 |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | Pass: mtf.maxAbs 7.40e-13 | Pass: mtf.maxAbs 7.81e-12 | Pass: mtf.maxAbs 7.90e-12 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | Pass: mtf.maxAbs 5.96e-13 | Pass: mtf.maxAbs 6.54e-12 | Pass: mtf.maxAbs 6.46e-12 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 7.67e-13 | Pass: mtf.maxAbs 3.25e-12 | Pass: mtf.maxAbs 3.34e-12 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | Pass: mtf.maxAbs 3.13e-13 | Pass: mtf.maxAbs 6.62e-12 | Pass: mtf.maxAbs 6.57e-12 |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | Pass: mtf.maxAbs 7.11e-13 | Pass: mtf.maxAbs 4.06e-12 | Pass: mtf.maxAbs 4.06e-12 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 8.47e-13 | Pass: mtf.maxAbs 2.55e-12 | Pass: mtf.maxAbs 2.53e-12 |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | Pass: mtf.maxAbs 5.49e-13 | Pass: mtf.maxAbs 8.72e-12 | Pass: mtf.maxAbs 8.51e-12 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | Pass: mtf.maxAbs 5.47e-13 | Pass: mtf.maxAbs 1.18e-11 | Pass: mtf.maxAbs 1.15e-11 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 1.04e-12 | Pass: mtf.maxAbs 4.90e-12 | Pass: mtf.maxAbs 5.85e-12 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | Pass: mtf.maxAbs 7.95e-13 | Pass: mtf.maxAbs 9.12e-12 | Pass: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | Pass: mtf.maxAbs 6.94e-13 | Pass: mtf.maxAbs 4.23e-12 | Pass: mtf.maxAbs 4.27e-12 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 9.43e-13 | Pass: mtf.maxAbs 2.72e-12 | Pass: mtf.maxAbs 2.28e-12 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | Pass: mtf.maxAbs 4.88e-13 | Pass: mtf.maxAbs 2.50e-12 | Pass: mtf.maxAbs 2.43e-12 |

## Spot and fan rays — `spot-rays`

Compares: Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 4.01e-13 | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | field 2.36e0 deg, line 7, ray 266 |
| lv – optiland | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.06e-13 | sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | field 8.74e0 deg, line 4 |
| lv – optiland | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 4.80e-14 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 7 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1232814 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.55e-13 | nikon-z-24-70f4s-f5.6-best-photopic-tele | field 1.25e1 deg, line 3, ray 163 |
| lv – reference-tracer | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.17e-13 | sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | field 1.92e1 deg, line 5 |
| lv – reference-tracer | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 8.49e-14 | sony-fe-20mm-f18-g-f11-best-photopic | field 3.53e1 deg, line 8 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1232814 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.41e-13 | nikon-z-24-70f4s-f5.6-best-photopic-tele | field 1.25e1 deg, line 6, ray 163 |
| optiland – reference-tracer | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.17e-13 | sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | field 1.92e1 deg, line 5 |
| optiland – reference-tracer | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 8.61e-14 | sony-fe-20mm-f18-g-f11-best-photopic | field 3.53e1 deg, line 6 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1232814 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | Pass: transverseError.maxAbs 6.48e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 90 | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | Pass: transverseError.maxAbs 6.57e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 1.21e-13 mm | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 10 | Pass: transverseError.maxAbs 7.64e-14 mm | Pass: transverseError.maxAbs 5.15e-14 mm | Pass: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 90 | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 10 | Pass: transverseError.maxAbs 7.82e-14 mm | Pass: transverseError.maxAbs 5.33e-14 mm | Pass: transverseError.maxAbs 6.39e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 90 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 10 | Pass: transverseError.maxAbs 6.39e-14 mm | Pass: transverseError.maxAbs 5.33e-14 mm | Pass: transverseError.maxAbs 5.68e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 90 | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 5.33e-14 mm | Pass: transverseError.maxAbs 5.68e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 5.33e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 90 | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 9.95e-14 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 4.97e-14 mm | Pass: transverseError.maxAbs 5.33e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 90 | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 1.03e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 2.42e-13 mm | Pass: transverseError.maxAbs 2.40e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 90 | Pass: transverseError.maxAbs 1.31e-13 mm | Pass: transverseError.maxAbs 2.63e-13 mm | Pass: transverseError.maxAbs 2.88e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 7.64e-14 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.42e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 1.37e-13 mm | Pass: transverseError.maxAbs 2.61e-13 mm | Pass: transverseError.maxAbs 2.88e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 10 | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 2.61e-13 mm | Pass: transverseError.maxAbs 2.56e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 90 | Pass: transverseError.maxAbs 1.47e-13 mm | Pass: transverseError.maxAbs 2.66e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 10 | Pass: transverseError.maxAbs 9.95e-14 mm | Pass: transverseError.maxAbs 2.59e-13 mm | Pass: transverseError.maxAbs 2.54e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 90 | Pass: transverseError.maxAbs 1.49e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| nikkor-z50f12-f5.6-ref | 10 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 1.30e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 90 | Pass: transverseError.maxAbs 1.31e-13 mm | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 1.35e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikkor-z50f12-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 1.10e-13 mm | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 1.30e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 1.30e-13 mm | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 1.35e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikkor-z50f12-f11-ref | 10 | Pass: transverseError.maxAbs 1.33e-13 mm | Pass: transverseError.maxAbs 7.28e-14 mm | Pass: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 90 | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 1.08e-13 mm | Pass: transverseError.maxAbs 1.24e-13 mm | 17478 / 18 / 0 | 17478 / 18 / 0 | 17478 / 18 / 0 |
| nikkor-z50f12-f11-best-ref | 10 | Pass: transverseError.maxAbs 1.33e-13 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 9.06e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 90 | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 1.23e-13 mm | 17478 / 18 / 0 | 17478 / 18 / 0 | 17478 / 18 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 10 | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 2.47e-13 mm | Pass: transverseError.maxAbs 2.58e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 90 | Pass: transverseError.maxAbs 2.13e-13 mm | Pass: transverseError.maxAbs 2.74e-13 mm | Pass: transverseError.maxAbs 3.06e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 5.51e-14 mm | Pass: transverseError.maxAbs 2.43e-13 mm | Pass: transverseError.maxAbs 2.58e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 2.10e-13 mm | Pass: transverseError.maxAbs 2.75e-13 mm | Pass: transverseError.maxAbs 3.06e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 10 | Pass: transverseError.maxAbs 6.04e-14 mm | Pass: transverseError.maxAbs 2.68e-13 mm | Pass: transverseError.maxAbs 2.82e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 90 | Pass: transverseError.maxAbs 9.77e-14 mm | Pass: transverseError.maxAbs 2.84e-13 mm | Pass: transverseError.maxAbs 3.23e-13 mm | 17446 / 50 / 0 | 17446 / 50 / 0 | 17446 / 50 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 10 | Pass: transverseError.maxAbs 6.22e-14 mm | Pass: transverseError.maxAbs 2.68e-13 mm | Pass: transverseError.maxAbs 2.82e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 90 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 2.84e-13 mm | Pass: transverseError.maxAbs 3.22e-13 mm | 17446 / 50 / 0 | 17446 / 50 / 0 | 17446 / 50 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 10 | Pass: transverseError.maxAbs 2.66e-13 mm | Pass: transverseError.maxAbs 2.20e-13 mm | Pass: transverseError.maxAbs 2.20e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 90 | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 2.47e-13 mm | Pass: transverseError.maxAbs 3.45e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 2.66e-13 mm | Pass: transverseError.maxAbs 2.20e-13 mm | Pass: transverseError.maxAbs 2.20e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 4.01e-13 mm | Pass: transverseError.maxAbs 2.43e-13 mm | Pass: transverseError.maxAbs 3.45e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 10 | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 1.74e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 90 | Pass: transverseError.maxAbs 2.88e-13 mm | Pass: transverseError.maxAbs 2.27e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 10 | Pass: transverseError.maxAbs 2.49e-13 mm | Pass: transverseError.maxAbs 1.74e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 90 | Pass: transverseError.maxAbs 2.88e-13 mm | Pass: transverseError.maxAbs 2.20e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 10 | Pass: transverseError.maxAbs 1.58e-13 mm | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 1.49e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 90 | Pass: transverseError.maxAbs 2.27e-13 mm | Pass: transverseError.maxAbs 1.31e-13 mm | Pass: transverseError.maxAbs 1.99e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 1.56e-13 mm | Pass: transverseError.maxAbs 9.24e-14 mm | Pass: transverseError.maxAbs 1.53e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 2.34e-13 mm | Pass: transverseError.maxAbs 1.35e-13 mm | Pass: transverseError.maxAbs 1.95e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 10 | Pass: transverseError.maxAbs 1.44e-13 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 1.44e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 90 | Pass: transverseError.maxAbs 1.99e-13 mm | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 2.10e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 10 | Pass: transverseError.maxAbs 1.46e-13 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 1.46e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 90 | Pass: transverseError.maxAbs 1.99e-13 mm | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 2.13e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 10 | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 3.11e-13 mm | Pass: transverseError.maxAbs 2.86e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 7.64e-14 mm | Pass: transverseError.maxAbs 4.16e-13 mm | Pass: transverseError.maxAbs 4.48e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 10 | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 6.11e-13 mm | Pass: transverseError.maxAbs 5.38e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 90 | Pass: transverseError.maxAbs 3.34e-13 mm | Pass: transverseError.maxAbs 3.30e-13 mm | Pass: transverseError.maxAbs 3.71e-13 mm | 17475 / 21 / 0 | 17475 / 21 / 0 | 17475 / 21 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 2.90e-13 mm | Pass: transverseError.maxAbs 4.71e-13 mm | Pass: transverseError.maxAbs 4.73e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 90 | Pass: transverseError.maxAbs 3.71e-13 mm | Pass: transverseError.maxAbs 6.54e-13 mm | Pass: transverseError.maxAbs 6.39e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 10 | Pass: transverseError.maxAbs 7.64e-14 mm | Pass: transverseError.maxAbs 3.11e-13 mm | Pass: transverseError.maxAbs 2.86e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 7.64e-14 mm | Pass: transverseError.maxAbs 4.17e-13 mm | Pass: transverseError.maxAbs 4.49e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 10 | Pass: transverseError.maxAbs 1.15e-13 mm | Pass: transverseError.maxAbs 6.13e-13 mm | Pass: transverseError.maxAbs 5.40e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 90 | Pass: transverseError.maxAbs 3.34e-13 mm | Pass: transverseError.maxAbs 3.30e-13 mm | Pass: transverseError.maxAbs 3.71e-13 mm | 17475 / 21 / 0 | 17475 / 21 / 0 | 17475 / 21 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 2.90e-13 mm | Pass: transverseError.maxAbs 4.69e-13 mm | Pass: transverseError.maxAbs 4.73e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 90 | Pass: transverseError.maxAbs 3.73e-13 mm | Pass: transverseError.maxAbs 6.55e-13 mm | Pass: transverseError.maxAbs 6.41e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 10 | Pass: transverseError.maxAbs 6.22e-14 mm | Pass: transverseError.maxAbs 3.09e-13 mm | Pass: transverseError.maxAbs 3.00e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 3.75e-13 mm | Pass: transverseError.maxAbs 3.69e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 4.41e-13 mm | Pass: transverseError.maxAbs 4.23e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 90 | Pass: transverseError.maxAbs 3.68e-13 mm | Pass: transverseError.maxAbs 3.52e-13 mm | Pass: transverseError.maxAbs 3.68e-13 mm | 17369 / 127 / 0 | 17369 / 127 / 0 | 17369 / 127 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 1.08e-13 mm | Pass: transverseError.maxAbs 3.68e-13 mm | Pass: transverseError.maxAbs 4.00e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 90 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 4.73e-13 mm | Pass: transverseError.maxAbs 4.73e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 10 | Pass: transverseError.maxAbs 6.22e-14 mm | Pass: transverseError.maxAbs 3.09e-13 mm | Pass: transverseError.maxAbs 2.98e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 3.73e-13 mm | Pass: transverseError.maxAbs 3.68e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 4.42e-13 mm | Pass: transverseError.maxAbs 4.25e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 90 | Pass: transverseError.maxAbs 3.68e-13 mm | Pass: transverseError.maxAbs 3.52e-13 mm | Pass: transverseError.maxAbs 3.68e-13 mm | 17369 / 127 / 0 | 17369 / 127 / 0 | 17369 / 127 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 1.08e-13 mm | Pass: transverseError.maxAbs 3.66e-13 mm | Pass: transverseError.maxAbs 4.00e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 90 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 4.73e-13 mm | Pass: transverseError.maxAbs 4.73e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 10 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.28e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 90 | Pass: transverseError.maxAbs 1.42e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 1.78e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 1.24e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 1.31e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 1.42e-13 mm | Pass: transverseError.maxAbs 1.28e-13 mm | Pass: transverseError.maxAbs 1.74e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-mc-105f28-f11-ref | 10 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 1.21e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 90 | Pass: transverseError.maxAbs 1.39e-13 mm | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 1.56e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 10 | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 1.21e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 90 | Pass: transverseError.maxAbs 1.42e-13 mm | Pass: transverseError.maxAbs 1.17e-13 mm | Pass: transverseError.maxAbs 1.56e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 8.17e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 90 | Pass: transverseError.maxAbs 1.10e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.24e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 7.46e-14 mm | Pass: transverseError.maxAbs 8.53e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 1.14e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 1.24e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-135f18-plena-f11-ref | 10 | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 1.07e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 90 | Pass: transverseError.maxAbs 1.07e-13 mm | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 9.59e-14 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 10 | Pass: transverseError.maxAbs 6.75e-14 mm | Pass: transverseError.maxAbs 7.11e-14 mm | Pass: transverseError.maxAbs 1.03e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 90 | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 8.17e-14 mm | Pass: transverseError.maxAbs 9.24e-14 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 10 | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 2.47e-13 mm | Pass: transverseError.maxAbs 2.42e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 90 | Pass: transverseError.maxAbs 1.01e-13 mm | Pass: transverseError.maxAbs 2.79e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 10 | Pass: transverseError.maxAbs 5.68e-14 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.40e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 90 | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 10 | Pass: transverseError.maxAbs 5.33e-14 mm | Pass: transverseError.maxAbs 2.49e-13 mm | Pass: transverseError.maxAbs 2.24e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 90 | Pass: transverseError.maxAbs 6.39e-14 mm | Pass: transverseError.maxAbs 2.56e-13 mm | Pass: transverseError.maxAbs 2.45e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 10 | Pass: transverseError.maxAbs 5.33e-14 mm | Pass: transverseError.maxAbs 2.45e-13 mm | Pass: transverseError.maxAbs 2.20e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 90 | Pass: transverseError.maxAbs 6.39e-14 mm | Pass: transverseError.maxAbs 2.54e-13 mm | Pass: transverseError.maxAbs 2.43e-13 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 10 | Pass: transverseError.maxAbs 7.37e-14 mm | Pass: transverseError.maxAbs 3.07e-13 mm | Pass: transverseError.maxAbs 2.91e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 9.77e-14 mm | Pass: transverseError.maxAbs 4.01e-13 mm | Pass: transverseError.maxAbs 3.80e-13 mm | 1892 / 52 / 0 | 1892 / 52 / 0 | 1892 / 52 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 10 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | Pass: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 90 | Pass: transverseError.maxAbs 1.12e-13 mm | Pass: transverseError.maxAbs 3.20e-13 mm | Pass: transverseError.maxAbs 3.59e-13 mm | 17329 / 167 / 0 | 17329 / 167 / 0 | 17329 / 167 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 4.00e-13 mm | Pass: transverseError.maxAbs 4.12e-13 mm | Pass: transverseError.maxAbs 4.39e-13 mm | 17032 / 464 / 0 | 17032 / 464 / 0 | 17032 / 464 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 90 | Pass: transverseError.maxAbs 3.38e-13 mm | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 4.49e-13 mm | 16517 / 979 / 0 | 16517 / 979 / 0 | 16517 / 979 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 10 | Pass: transverseError.maxAbs 7.28e-14 mm | Pass: transverseError.maxAbs 3.06e-13 mm | Pass: transverseError.maxAbs 2.90e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 9.77e-14 mm | Pass: transverseError.maxAbs 4.00e-13 mm | Pass: transverseError.maxAbs 3.80e-13 mm | 1892 / 52 / 0 | 1892 / 52 / 0 | 1892 / 52 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 10 | Pass: transverseError.maxAbs 1.23e-13 mm | Pass: transverseError.maxAbs 3.87e-13 mm | Pass: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 90 | Pass: transverseError.maxAbs 1.12e-13 mm | Pass: transverseError.maxAbs 3.20e-13 mm | Pass: transverseError.maxAbs 3.57e-13 mm | 17329 / 167 / 0 | 17329 / 167 / 0 | 17329 / 167 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 4.00e-13 mm | Pass: transverseError.maxAbs 4.10e-13 mm | Pass: transverseError.maxAbs 4.39e-13 mm | 17032 / 464 / 0 | 17032 / 464 / 0 | 17032 / 464 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 90 | Pass: transverseError.maxAbs 3.38e-13 mm | Pass: transverseError.maxAbs 3.98e-13 mm | Pass: transverseError.maxAbs 4.49e-13 mm | 16517 / 979 / 0 | 16517 / 979 / 0 | 16517 / 979 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 2.82e-13 mm | Pass: transverseError.maxAbs 2.75e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 6.57e-14 mm | Pass: transverseError.maxAbs 2.95e-13 mm | Pass: transverseError.maxAbs 2.84e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 90 | Pass: transverseError.maxAbs 3.78e-13 mm | Pass: transverseError.maxAbs 3.57e-13 mm | Pass: transverseError.maxAbs 3.71e-13 mm | 17444 / 52 / 0 | 17444 / 52 / 0 | 17444 / 52 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 2.88e-13 mm | Pass: transverseError.maxAbs 3.23e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 90 | Pass: transverseError.maxAbs 2.03e-13 mm | Pass: transverseError.maxAbs 4.09e-13 mm | Pass: transverseError.maxAbs 4.23e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 2.82e-13 mm | Pass: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 10 | Pass: transverseError.maxAbs 6.57e-14 mm | Pass: transverseError.maxAbs 2.95e-13 mm | Pass: transverseError.maxAbs 2.82e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 10 | Pass: transverseError.maxAbs 8.88e-14 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 90 | Pass: transverseError.maxAbs 3.78e-13 mm | Pass: transverseError.maxAbs 3.55e-13 mm | Pass: transverseError.maxAbs 3.71e-13 mm | 17444 / 52 / 0 | 17444 / 52 / 0 | 17444 / 52 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 90 | Pass: transverseError.maxAbs 1.03e-13 mm | Pass: transverseError.maxAbs 2.88e-13 mm | Pass: transverseError.maxAbs 3.23e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 90 | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 4.09e-13 mm | Pass: transverseError.maxAbs 4.25e-13 mm | 17477 / 19 / 0 | 17477 / 19 / 0 | 17477 / 19 / 0 |

## Spherical aberration and axial colour rays — `axial-rays`

Compares: Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.95e-13 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 1, ray 36 |
| lv – optiland | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.20e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 1, ray 36 |
| lv – optiland | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 3.46e-14 | nikon-z-24-70f4s-open-photopic-tele | field 0 deg, line 0 |
| lv – optiland | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 6.25e-13 | sony-fe-400mm-f28-gm-oss-f11-photopic | field 0 deg, line 7 |
| lv – optiland | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 4.31e-14 | nikon-z-24-70f4s-open-photopic-tele | field 0 deg, line 2 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 36480 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.53e-13 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 6, ray 36 |
| lv – reference-tracer | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 4.46e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 6, ray 36 |
| lv – reference-tracer | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 7.47e-14 | nikon-z-24-70f4s-f8-ref-tele | field 0 deg, line 0 |
| lv – reference-tracer | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.42e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 1 |
| lv – reference-tracer | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 3.49e-14 | nikon-z-24-70f4s-f8-ref-tele | field 0 deg, line 0 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 36480 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.92e-13 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 1, ray 36 |
| optiland – reference-tracer | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.14e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 1, ray 36 |
| optiland – reference-tracer | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 8.28e-14 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 2 |
| optiland – reference-tracer | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.62e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0 deg, line 2 |
| optiland – reference-tracer | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 4.12e-14 | nikon-z-24-70f4s-open-photopic-tele | field 0 deg, line 2 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 36480 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | Pass: intercept.maxScaled 3.55e-14 mm | Pass: intercept.maxScaled 3.20e-14 mm | Pass: intercept.maxScaled 3.57e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 18 | Pass: intercept.maxScaled 5.54e-14 mm | Pass: intercept.maxScaled 2.74e-14 mm | Pass: intercept.maxScaled 4.62e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | Pass: intercept.maxScaled 3.55e-14 mm | Pass: intercept.maxScaled 3.20e-14 mm | Pass: intercept.maxScaled 3.57e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 5.54e-14 mm | Pass: intercept.maxScaled 2.74e-14 mm | Pass: intercept.maxScaled 4.62e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 3 | Pass: intercept.maxScaled 1.41e-14 mm | Pass: intercept.maxScaled 5.49e-15 mm | Pass: intercept.maxScaled 1.41e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 18 | Pass: intercept.maxScaled 2.28e-14 mm | Pass: intercept.maxScaled 1.76e-14 mm | Pass: intercept.maxScaled 2.59e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | Pass: intercept.maxScaled 1.41e-14 mm | Pass: intercept.maxScaled 5.49e-15 mm | Pass: intercept.maxScaled 1.41e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 18 | Pass: intercept.maxScaled 2.28e-14 mm | Pass: intercept.maxScaled 1.76e-14 mm | Pass: intercept.maxScaled 2.59e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | Pass: intercept.maxScaled 1.57e-14 mm | Pass: intercept.maxScaled 1.53e-14 mm | Pass: intercept.maxScaled 1.48e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 18 | Pass: intercept.maxScaled 2.13e-14 mm | Pass: intercept.maxScaled 2.66e-14 mm | Pass: intercept.maxScaled 2.25e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | Pass: intercept.maxScaled 1.57e-14 mm | Pass: intercept.maxScaled 1.53e-14 mm | Pass: intercept.maxScaled 1.48e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 2.13e-14 mm | Pass: intercept.maxScaled 2.66e-14 mm | Pass: intercept.maxScaled 2.25e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | Pass: intercept.maxScaled 1.05e-14 mm | Pass: intercept.maxScaled 5.89e-15 mm | Pass: intercept.maxScaled 1.03e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 18 | Pass: intercept.maxScaled 1.54e-14 mm | Pass: intercept.maxScaled 8.14e-15 mm | Pass: intercept.maxScaled 1.50e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | Pass: intercept.maxScaled 1.05e-14 mm | Pass: intercept.maxScaled 5.89e-15 mm | Pass: intercept.maxScaled 1.03e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 18 | Pass: intercept.maxScaled 1.54e-14 mm | Pass: intercept.maxScaled 8.14e-15 mm | Pass: intercept.maxScaled 1.50e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | Pass: intercept.maxScaled 2.66e-14 mm | Pass: intercept.maxScaled 9.86e-15 mm | Pass: intercept.maxScaled 3.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 18 | Pass: intercept.maxScaled 3.14e-14 mm | Pass: intercept.maxScaled 1.33e-14 mm | Pass: intercept.maxScaled 3.14e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | Pass: intercept.maxScaled 2.66e-14 mm | Pass: intercept.maxScaled 9.86e-15 mm | Pass: intercept.maxScaled 3.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 3.14e-14 mm | Pass: intercept.maxScaled 1.33e-14 mm | Pass: intercept.maxScaled 3.14e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | Pass: intercept.maxScaled 9.41e-15 mm | Pass: intercept.maxScaled 5.82e-15 mm | Pass: intercept.maxScaled 1.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 18 | Pass: intercept.maxScaled 1.54e-14 mm | Pass: intercept.maxScaled 5.81e-15 mm | Pass: intercept.maxScaled 1.43e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | Pass: intercept.maxScaled 9.41e-15 mm | Pass: intercept.maxScaled 5.82e-15 mm | Pass: intercept.maxScaled 1.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 18 | Pass: intercept.maxScaled 1.54e-14 mm | Pass: intercept.maxScaled 5.81e-15 mm | Pass: intercept.maxScaled 1.43e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-f5.6-ref | 3 | Pass: intercept.maxScaled 1.72e-14 mm | Pass: intercept.maxScaled 1.72e-14 mm | Pass: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 18 | Pass: intercept.maxScaled 3.78e-14 mm | Pass: intercept.maxScaled 2.09e-14 mm | Pass: intercept.maxScaled 2.90e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-f5.6-best-ref | 3 | Pass: intercept.maxScaled 1.72e-14 mm | Pass: intercept.maxScaled 1.72e-14 mm | Pass: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 3.78e-14 mm | Pass: intercept.maxScaled 2.09e-14 mm | Pass: intercept.maxScaled 2.90e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-f11-ref | 3 | Pass: intercept.maxScaled 9.31e-15 mm | Pass: intercept.maxScaled 5.68e-15 mm | Pass: intercept.maxScaled 8.27e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 18 | Pass: intercept.maxScaled 1.53e-14 mm | Pass: intercept.maxScaled 1.03e-14 mm | Pass: intercept.maxScaled 1.45e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikkor-z50f12-f11-best-ref | 3 | Pass: intercept.maxScaled 9.31e-15 mm | Pass: intercept.maxScaled 5.68e-15 mm | Pass: intercept.maxScaled 8.27e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 18 | Pass: intercept.maxScaled 1.53e-14 mm | Pass: intercept.maxScaled 1.03e-14 mm | Pass: intercept.maxScaled 1.45e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | Pass: intercept.maxScaled 1.85e-14 mm | Pass: intercept.maxScaled 3.45e-14 mm | Pass: intercept.maxScaled 5.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 18 | Pass: intercept.maxScaled 2.46e-14 mm | Pass: intercept.maxScaled 4.80e-14 mm | Pass: intercept.maxScaled 6.28e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | Pass: intercept.maxScaled 1.85e-14 mm | Pass: intercept.maxScaled 3.45e-14 mm | Pass: intercept.maxScaled 5.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 2.46e-14 mm | Pass: intercept.maxScaled 4.80e-14 mm | Pass: intercept.maxScaled 6.28e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 3 | Pass: intercept.maxScaled 5.64e-15 mm | Pass: intercept.maxScaled 4.39e-15 mm | Pass: intercept.maxScaled 8.59e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 18 | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 8.14e-15 mm | Pass: intercept.maxScaled 8.78e-15 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | Pass: intercept.maxScaled 5.64e-15 mm | Pass: intercept.maxScaled 4.39e-15 mm | Pass: intercept.maxScaled 8.59e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 18 | Pass: intercept.maxScaled 1.21e-14 mm | Pass: intercept.maxScaled 8.14e-15 mm | Pass: intercept.maxScaled 8.78e-15 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | Pass: intercept.maxScaled 4.62e-14 mm | Pass: intercept.maxScaled 7.59e-14 mm | Pass: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 18 | Pass: intercept.maxScaled 1.17e-13 mm | Pass: intercept.maxScaled 7.71e-14 mm | Pass: intercept.maxScaled 1.34e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | Pass: intercept.maxScaled 4.62e-14 mm | Pass: intercept.maxScaled 7.59e-14 mm | Pass: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 1.17e-13 mm | Pass: intercept.maxScaled 7.71e-14 mm | Pass: intercept.maxScaled 1.34e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | Pass: intercept.maxScaled 3.88e-14 mm | Pass: intercept.maxScaled 2.35e-14 mm | Pass: intercept.maxScaled 3.93e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 18 | Pass: intercept.maxScaled 6.15e-14 mm | Pass: intercept.maxScaled 4.80e-14 mm | Pass: intercept.maxScaled 5.58e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | Pass: intercept.maxScaled 3.88e-14 mm | Pass: intercept.maxScaled 2.35e-14 mm | Pass: intercept.maxScaled 3.93e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 18 | Pass: intercept.maxScaled 6.15e-14 mm | Pass: intercept.maxScaled 4.80e-14 mm | Pass: intercept.maxScaled 5.58e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | Pass: intercept.maxScaled 2.82e-14 mm | Pass: intercept.maxScaled 2.43e-14 mm | Pass: intercept.maxScaled 2.67e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 18 | Pass: intercept.maxScaled 4.61e-14 mm | Pass: intercept.maxScaled 3.85e-14 mm | Pass: intercept.maxScaled 4.24e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | Pass: intercept.maxScaled 2.82e-14 mm | Pass: intercept.maxScaled 2.43e-14 mm | Pass: intercept.maxScaled 2.67e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 4.61e-14 mm | Pass: intercept.maxScaled 3.85e-14 mm | Pass: intercept.maxScaled 4.24e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | Pass: intercept.maxScaled 1.59e-14 mm | Pass: intercept.maxScaled 1.28e-14 mm | Pass: intercept.maxScaled 1.26e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 18 | Pass: intercept.maxScaled 1.96e-14 mm | Pass: intercept.maxScaled 1.55e-14 mm | Pass: intercept.maxScaled 2.38e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | Pass: intercept.maxScaled 1.59e-14 mm | Pass: intercept.maxScaled 1.28e-14 mm | Pass: intercept.maxScaled 1.26e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 18 | Pass: intercept.maxScaled 1.96e-14 mm | Pass: intercept.maxScaled 1.55e-14 mm | Pass: intercept.maxScaled 2.38e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | Pass: intercept.maxScaled 2.97e-14 mm | Pass: intercept.maxScaled 4.87e-14 mm | Pass: intercept.maxScaled 5.20e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 2.84e-14 mm | Pass: intercept.maxScaled 2.03e-13 mm | Pass: intercept.maxScaled 1.86e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | Pass: intercept.maxScaled 4.08e-14 mm | Pass: intercept.maxScaled 1.34e-13 mm | Pass: intercept.maxScaled 1.66e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 18 | Pass: intercept.maxScaled 3.74e-14 mm | Pass: intercept.maxScaled 5.04e-14 mm | Pass: intercept.maxScaled 6.60e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 7.37e-14 mm | Pass: intercept.maxScaled 2.28e-13 mm | Pass: intercept.maxScaled 2.21e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 18 | Pass: intercept.maxScaled 6.81e-14 mm | Pass: intercept.maxScaled 1.32e-13 mm | Pass: intercept.maxScaled 1.34e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | Pass: intercept.maxScaled 2.97e-14 mm | Pass: intercept.maxScaled 4.87e-14 mm | Pass: intercept.maxScaled 5.20e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 2.84e-14 mm | Pass: intercept.maxScaled 2.03e-13 mm | Pass: intercept.maxScaled 1.86e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | Pass: intercept.maxScaled 4.08e-14 mm | Pass: intercept.maxScaled 1.34e-13 mm | Pass: intercept.maxScaled 1.66e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 18 | Pass: intercept.maxScaled 3.74e-14 mm | Pass: intercept.maxScaled 5.04e-14 mm | Pass: intercept.maxScaled 6.60e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 7.37e-14 mm | Pass: intercept.maxScaled 2.28e-13 mm | Pass: intercept.maxScaled 2.21e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 18 | Pass: intercept.maxScaled 6.81e-14 mm | Pass: intercept.maxScaled 1.32e-13 mm | Pass: intercept.maxScaled 1.34e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 3.49e-15 mm | Pass: intercept.maxScaled 1.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 1.76e-14 mm | Pass: intercept.maxScaled 3.86e-14 mm | Pass: intercept.maxScaled 4.09e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | Pass: intercept.maxScaled 2.00e-14 mm | Pass: intercept.maxScaled 3.58e-14 mm | Pass: intercept.maxScaled 3.68e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 18 | Pass: intercept.maxScaled 1.94e-14 mm | Pass: intercept.maxScaled 7.52e-15 mm | Pass: intercept.maxScaled 1.59e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 3.30e-14 mm | Pass: intercept.maxScaled 5.23e-14 mm | Pass: intercept.maxScaled 5.57e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 18 | Pass: intercept.maxScaled 3.25e-14 mm | Pass: intercept.maxScaled 4.07e-14 mm | Pass: intercept.maxScaled 5.04e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 3.49e-15 mm | Pass: intercept.maxScaled 1.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 1.76e-14 mm | Pass: intercept.maxScaled 3.86e-14 mm | Pass: intercept.maxScaled 4.09e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | Pass: intercept.maxScaled 2.00e-14 mm | Pass: intercept.maxScaled 3.58e-14 mm | Pass: intercept.maxScaled 3.68e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 18 | Pass: intercept.maxScaled 1.94e-14 mm | Pass: intercept.maxScaled 7.52e-15 mm | Pass: intercept.maxScaled 1.59e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 3.30e-14 mm | Pass: intercept.maxScaled 5.23e-14 mm | Pass: intercept.maxScaled 5.57e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 18 | Pass: intercept.maxScaled 3.25e-14 mm | Pass: intercept.maxScaled 4.07e-14 mm | Pass: intercept.maxScaled 5.04e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 3 | Pass: intercept.maxScaled 3.45e-14 mm | Pass: intercept.maxScaled 4.68e-14 mm | Pass: intercept.maxScaled 3.69e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 18 | Pass: intercept.maxScaled 5.31e-14 mm | Pass: intercept.maxScaled 6.89e-14 mm | Pass: intercept.maxScaled 6.40e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | Pass: intercept.maxScaled 3.45e-14 mm | Pass: intercept.maxScaled 4.68e-14 mm | Pass: intercept.maxScaled 3.69e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 5.31e-14 mm | Pass: intercept.maxScaled 6.89e-14 mm | Pass: intercept.maxScaled 6.40e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-f11-ref | 3 | Pass: intercept.maxScaled 1.60e-14 mm | Pass: intercept.maxScaled 1.50e-14 mm | Pass: intercept.maxScaled 1.25e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 18 | Pass: intercept.maxScaled 1.98e-14 mm | Pass: intercept.maxScaled 1.50e-14 mm | Pass: intercept.maxScaled 2.21e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 3 | Pass: intercept.maxScaled 1.60e-14 mm | Pass: intercept.maxScaled 1.50e-14 mm | Pass: intercept.maxScaled 1.25e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 18 | Pass: intercept.maxScaled 1.98e-14 mm | Pass: intercept.maxScaled 1.50e-14 mm | Pass: intercept.maxScaled 2.21e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 3 | Pass: intercept.maxScaled 2.17e-14 mm | Pass: intercept.maxScaled 1.41e-14 mm | Pass: intercept.maxScaled 1.83e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 18 | Pass: intercept.maxScaled 4.53e-14 mm | Pass: intercept.maxScaled 2.51e-14 mm | Pass: intercept.maxScaled 4.31e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | Pass: intercept.maxScaled 2.17e-14 mm | Pass: intercept.maxScaled 1.41e-14 mm | Pass: intercept.maxScaled 1.83e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 4.53e-14 mm | Pass: intercept.maxScaled 2.51e-14 mm | Pass: intercept.maxScaled 4.31e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-f11-ref | 3 | Pass: intercept.maxScaled 2.09e-14 mm | Pass: intercept.maxScaled 1.14e-14 mm | Pass: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 18 | Pass: intercept.maxScaled 2.27e-14 mm | Pass: intercept.maxScaled 1.03e-14 mm | Pass: intercept.maxScaled 1.43e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 3 | Pass: intercept.maxScaled 2.09e-14 mm | Pass: intercept.maxScaled 1.14e-14 mm | Pass: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 18 | Pass: intercept.maxScaled 2.27e-14 mm | Pass: intercept.maxScaled 1.03e-14 mm | Pass: intercept.maxScaled 1.43e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | Pass: intercept.maxScaled 1.48e-14 mm | Pass: intercept.maxScaled 1.17e-13 mm | Pass: intercept.maxScaled 1.12e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 18 | Pass: intercept.maxScaled 2.55e-14 mm | Pass: intercept.maxScaled 1.19e-13 mm | Pass: intercept.maxScaled 1.27e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | Pass: intercept.maxScaled 1.48e-14 mm | Pass: intercept.maxScaled 1.17e-13 mm | Pass: intercept.maxScaled 1.12e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 18 | Pass: intercept.maxScaled 2.55e-14 mm | Pass: intercept.maxScaled 1.19e-13 mm | Pass: intercept.maxScaled 1.27e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | Pass: intercept.maxScaled 9.02e-15 mm | Pass: intercept.maxScaled 3.42e-15 mm | Pass: intercept.maxScaled 5.72e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 18 | Pass: intercept.maxScaled 9.95e-15 mm | Pass: intercept.maxScaled 7.84e-15 mm | Pass: intercept.maxScaled 7.68e-15 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | Pass: intercept.maxScaled 9.02e-15 mm | Pass: intercept.maxScaled 3.42e-15 mm | Pass: intercept.maxScaled 5.72e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 18 | Pass: intercept.maxScaled 9.95e-15 mm | Pass: intercept.maxScaled 7.84e-15 mm | Pass: intercept.maxScaled 7.68e-15 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 3 | Pass: intercept.maxScaled 2.89e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | Pass: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 5.72e-14 mm | Pass: intercept.maxScaled 9.23e-14 mm | Pass: intercept.maxScaled 1.33e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 3 | Pass: intercept.maxScaled 1.11e-13 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 18 | Pass: intercept.maxScaled 4.67e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 8.74e-14 mm | Pass: intercept.maxScaled 1.04e-13 mm | Pass: intercept.maxScaled 1.10e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 18 | Pass: intercept.maxScaled 9.59e-14 mm | Pass: intercept.maxScaled 2.34e-13 mm | Pass: intercept.maxScaled 2.31e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | Pass: intercept.maxScaled 2.89e-14 mm | Pass: intercept.maxScaled 5.21e-14 mm | Pass: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 5.72e-14 mm | Pass: intercept.maxScaled 9.23e-14 mm | Pass: intercept.maxScaled 1.33e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | Pass: intercept.maxScaled 1.11e-13 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 18 | Pass: intercept.maxScaled 4.67e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | Pass: intercept.maxScaled 5.74e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 8.74e-14 mm | Pass: intercept.maxScaled 1.04e-13 mm | Pass: intercept.maxScaled 1.10e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 18 | Pass: intercept.maxScaled 9.59e-14 mm | Pass: intercept.maxScaled 2.34e-13 mm | Pass: intercept.maxScaled 2.31e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 2.58e-14 mm | Pass: intercept.maxScaled 9.23e-14 mm | Pass: intercept.maxScaled 1.11e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | Pass: intercept.maxScaled 2.41e-14 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 18 | Pass: intercept.maxScaled 2.33e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 8.79e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 4.30e-14 mm | Pass: intercept.maxScaled 1.14e-13 mm | Pass: intercept.maxScaled 9.80e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 18 | Pass: intercept.maxScaled 2.95e-13 mm | Pass: intercept.maxScaled 2.53e-13 mm | Pass: intercept.maxScaled 2.92e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | Pass: intercept.maxScaled 1.38e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | Pass: intercept.maxScaled 2.58e-14 mm | Pass: intercept.maxScaled 9.23e-14 mm | Pass: intercept.maxScaled 1.11e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | Pass: intercept.maxScaled 2.41e-14 mm | Pass: intercept.maxScaled 2.19e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 18 | Pass: intercept.maxScaled 2.33e-14 mm | Pass: intercept.maxScaled 7.93e-14 mm | Pass: intercept.maxScaled 8.79e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 18 | Pass: intercept.maxScaled 4.30e-14 mm | Pass: intercept.maxScaled 1.14e-13 mm | Pass: intercept.maxScaled 9.80e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 18 | Pass: intercept.maxScaled 2.95e-13 mm | Pass: intercept.maxScaled 2.53e-13 mm | Pass: intercept.maxScaled 2.92e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |

## Chief rays (distortion, pupils, lateral colour) — `chief-rays`

Compares: Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.99e-13 | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | line 5, ray 16 |
| lv – optiland | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 2.27e-13 | sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | line 4, ray 30 |
| lv – optiland | Largest difference of distortion — `distortion.maxAbs` | percent | — | 1.47e-12 | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | line 7, ray 9 |
| lv – optiland | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 3.23e-13 | nikon-z-mc-105f28-f5.6-photopic | line 8, ray 30 |
| lv – optiland | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.32e-12 | nikon-z-mc-105f28-f5.6-photopic | line 8, ray 30 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 95360 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 2.49e-13 | sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | line 5, ray 20 |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.27e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | line 5, ray 17 |
| lv – reference-tracer | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.56e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | line 5, ray 17 |
| lv – reference-tracer | Largest difference of distortion — `distortion.maxAbs` | percent | — | 2.28e-12 | nikon-z-24-70f4s-open-best-photopic-wide | line 0, ray 11 |
| lv – reference-tracer | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 4.92e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | line 5, ray 8 |
| lv – reference-tracer | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.96e-12 | nikon-z-24-70f4s-f5.6-photopic-wide | line 5, ray 8 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 95360 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 3.41e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | line 5, ray 17 |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.23e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, ray 18 |
| optiland – reference-tracer | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.41e-13 | sony-fe-20mm-f18-g-f5.6-photopic | line 7, ray 17 |
| optiland – reference-tracer | Largest difference of distortion — `distortion.maxAbs` | percent | — | 2.26e-12 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | line 4, ray 7 |
| optiland – reference-tracer | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 4.81e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | line 6, ray 8 |
| optiland – reference-tracer | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 1.96e-12 | nikon-z-24-70f4s-f5.6-photopic-wide | line 6, ray 8 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 95360 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 3.45e-13 | sony-fe-20mm-f18-g-f11-best-photopic | line 7, ray 17 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 7.82e-14 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 4 | Pass: exitPupil.maxScaled 9.05e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 4 | Pass: exitPupil.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 7.82e-14 mm | Pass: lateralColour.maxAbs 1.39e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 4 | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 4 | Pass: distortion.maxScaled 8.52e-14 mm | Pass: distortion.maxScaled 5.48e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 4 | Pass: distortion.maxScaled 8.74e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: distortion.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.95e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 4 | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 4 | Pass: distortion.maxScaled 8.28e-14 mm | Pass: distortion.maxScaled 4.97e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 4 | Pass: lateralColour.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 4 | Pass: distortion.maxScaled 1.32e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.45e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 4 | Pass: distortion.maxScaled 1.35e-13 mm | Pass: exitPupil.maxScaled 6.42e-14 mm | Pass: distortion.maxScaled 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 4 | Pass: exitPupil.maxScaled 1.09e-13 mm | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: exitPupil.maxScaled 1.15e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 4 | Pass: distortion.maxScaled 1.29e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.76e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-best-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.19e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 4 | Pass: distortion.maxScaled 1.32e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.79e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 4 | Pass: distortion.maxScaled 1.29e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.76e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-best-ref | 4 | Pass: exitPupil.maxScaled 9.81e-14 mm | Pass: distortion.maxScaled 1.16e-13 mm | Pass: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 4 | Pass: distortion.maxScaled 1.33e-13 mm | Pass: exitPupil.maxScaled 1.51e-13 mm | Pass: distortion.maxScaled 1.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.53e-13 mm | Pass: distortion.maxScaled 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.46e-13 mm | Pass: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.56e-13 mm | Pass: distortion.maxScaled 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 4 | Pass: lateralColour.maxAbs 1.49e-13 mm | Pass: distortion.maxScaled 3.53e-13 mm | Pass: distortion.maxScaled 3.41e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 4 | Pass: landing.maxAbs 6.39e-14 mm | Pass: distortion.maxScaled 2.42e-13 mm | Pass: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 4 | Pass: lateralColour.maxAbs 1.53e-13 mm | Pass: distortion.maxScaled 3.55e-13 mm | Pass: lateralColour.maxAbs 3.45e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 4 | Pass: lateralColour.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 4 | Pass: distortion.maxScaled 1.54e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 4 | Pass: lateralColour.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 4 | Pass: distortion.maxScaled 1.57e-13 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 4 | Pass: lateralColour.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 4 | Pass: distortion.maxScaled 1.56e-13 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 4 | Pass: lateralColour.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 4 | Pass: lateralColour.maxAbs 2.49e-13 mm | Pass: distortion.maxScaled 1.37e-13 mm | Pass: lateralColour.maxAbs 2.03e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 4 | Pass: lateralColour.maxAbs 2.45e-13 mm | Pass: distortion.maxScaled 1.44e-13 mm | Pass: lateralColour.maxAbs 2.06e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 4 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 4 | Pass: lateralColour.maxAbs 2.49e-13 mm | Pass: distortion.maxScaled 1.37e-13 mm | Pass: lateralColour.maxAbs 2.03e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 4 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 4 | Pass: lateralColour.maxAbs 2.45e-13 mm | Pass: distortion.maxScaled 1.41e-13 mm | Pass: lateralColour.maxAbs 2.06e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 4 | Pass: exitPupil.maxScaled 3.20e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 4 | Pass: exitPupil.maxScaled 3.23e-13 mm | Pass: lateralColour.maxAbs 1.03e-13 mm | Pass: exitPupil.maxScaled 3.08e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 4 | Pass: lateralColour.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 4 | Pass: exitPupil.maxScaled 8.08e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 4 | Pass: lateralColour.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 4 | Pass: distortion.maxScaled 5.29e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 4 | Pass: distortion.maxScaled 4.67e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 4 | Pass: lateralColour.maxAbs 6.75e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 4 | Pass: distortion.maxScaled 5.29e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 4 | Pass: lateralColour.maxAbs 7.11e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 4 | Pass: distortion.maxScaled 4.93e-14 mm | Pass: exitPupil.maxScaled 2.73e-13 mm | Pass: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 4 | Pass: lateralColour.maxAbs 6.75e-14 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | Pass: exitPupil.maxScaled 2.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.03e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 4 | Pass: distortion.maxScaled 8.10e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 4 | Pass: distortion.maxScaled 8.13e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 4 | Pass: landing.maxAbs 4.26e-14 mm | Pass: exitPupil.maxScaled 4.70e-13 mm | Pass: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 4 | Pass: exitPupil.maxScaled 5.92e-14 mm | Pass: landing.maxAbs 1.99e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 4 | Pass: landing.maxAbs 8.53e-14 mm | Pass: distortion.maxScaled 6.02e-14 mm | Pass: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 4 | Pass: distortion.maxScaled 8.10e-14 mm | Pass: exitPupil.maxScaled 4.92e-13 mm | Pass: exitPupil.maxScaled 4.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 4 | Pass: lateralColour.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 4 | Pass: lateralColour.maxAbs 1.39e-13 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: distortion.maxScaled 1.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## Field-curve rays — `field-curve-rays`

Compares: Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.00e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | line 8, ray 1696 |
| lv – optiland | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.49e-13 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | line 2, ray 74 |
| lv – optiland | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 5.51e-9 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | line 2, ray 74 |
| lv – optiland | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 3.30e-14 | nikon-z-mc-105f28-f5.6-photopic | line 1, ray 1441 |
| lv – optiland | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 1.89e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 8, ray 44 |
| lv – optiland | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 5.51e-9 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | line 2, ray 74 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1147872 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 21760 | — | — |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 6.89e-13 | nikon-z-24-70f4s-open-ref-zoom0.5 | line 0, ray 1707 |
| lv – reference-tracer | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.10e-13 | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | line 0, ray 84 |
| lv – reference-tracer | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 3.98e-9 | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | line 0, ray 84 |
| lv – reference-tracer | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.58e-14 | nikon-z-24-70f4s-open-photopic-wide | line 7, ray 1750 |
| lv – reference-tracer | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 2.27e-12 | nikon-z-24-70f4s-open-best-ref-zoom0.5 | line 0, ray 24 |
| lv – reference-tracer | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 3.98e-9 | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | line 0, ray 84 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1147872 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Fields compared — `fields.compared` | elements | — | 21760 | — | — |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.67e-13 | nikon-z-24-70f4s-open-photopic-zoom0.5 | line 4, ray 1707 |
| optiland – reference-tracer | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.49e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 7, ray 84 |
| optiland – reference-tracer | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 5.40e-9 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 7, ray 84 |
| optiland – reference-tracer | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.53e-14 | nikon-z-24-70f4s-open-best-photopic-wide | line 3, ray 1750 |
| optiland – reference-tracer | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 2.40e-12 | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | line 6, ray 24 |
| optiland – reference-tracer | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 5.40e-9 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 7, ray 84 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1147872 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Fields compared — `fields.compared` | elements | — | 21760 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 2 | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.21e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.39e-13 mm | 16170 / 354 / 0 | 16170 / 354 / 0 | 16170 / 354 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.42e-13 mm | 16170 / 354 / 0 | 16170 / 354 / 0 | 16170 / 354 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 18 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.24e-13 mm | 16248 / 276 / 0 | 16248 / 276 / 0 | 16248 / 276 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 2 | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 18 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.24e-13 mm | 16248 / 276 / 0 | 16248 / 276 / 0 | 16248 / 276 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | 1834 / 2 / 0 | 1834 / 2 / 0 | 1834 / 2 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 18 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | 16229 / 295 / 0 | 16229 / 295 / 0 | 16229 / 295 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 8.88e-14 mm | 1834 / 2 / 0 | 1834 / 2 / 0 | 1834 / 2 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 18 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.03e-13 mm | 16229 / 295 / 0 | 16229 / 295 / 0 | 16229 / 295 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 8.53e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 16240 / 284 / 0 | 16240 / 284 / 0 | 16240 / 284 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 2 | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 8.88e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 18 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 16240 / 284 / 0 | 16240 / 284 / 0 | 16240 / 284 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 2 | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 18 | Pass: landing.maxAbs 2.81e-13 mm | Pass: landing.maxAbs 2.49e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 16237 / 287 / 0 | 16237 / 287 / 0 | 16237 / 287 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 2 | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 18 | Pass: landing.maxAbs 2.81e-13 mm | Pass: landing.maxAbs 2.49e-13 mm | Pass: landing.maxAbs 2.33e-13 mm | 16237 / 287 / 0 | 16237 / 287 / 0 | 16237 / 287 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | Pass: landing.maxAbs 2.18e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.26e-13 mm | Pass: landing.maxAbs 2.18e-13 mm | 16234 / 290 / 0 | 16234 / 290 / 0 | 16234 / 290 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 2 | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 2.26e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | Pass: landing.maxAbs 2.17e-13 mm | 16234 / 290 / 0 | 16234 / 290 / 0 | 16234 / 290 / 0 |
| nikkor-z50f12-f5.6-ref | 2 | Pass: landing.maxAbs 2.52e-13 mm | Pass: landing.maxAbs 2.77e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 18 | Pass: landing.maxAbs 2.81e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | Pass: landing.maxAbs 3.27e-13 mm | 16251 / 273 / 0 | 16251 / 273 / 0 | 16251 / 273 / 0 |
| nikkor-z50f12-f5.6-best-ref | 2 | Pass: landing.maxAbs 2.52e-13 mm | Pass: landing.maxAbs 2.77e-13 mm | Pass: landing.maxAbs 2.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 18 | Pass: landing.maxAbs 2.81e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | Pass: landing.maxAbs 3.27e-13 mm | 16251 / 273 / 0 | 16251 / 273 / 0 | 16251 / 273 / 0 |
| nikkor-z50f12-f11-ref | 2 | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.06e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 18 | Pass: landing.maxAbs 2.56e-13 mm | Pass: landing.maxAbs 2.52e-13 mm | Pass: landing.maxAbs 2.52e-13 mm | 16225 / 299 / 0 | 16225 / 299 / 0 | 16225 / 299 / 0 |
| nikkor-z50f12-f11-best-ref | 2 | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 2.06e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 18 | Pass: landing.maxAbs 2.56e-13 mm | Pass: landing.maxAbs 2.52e-13 mm | Pass: landing.maxAbs 2.49e-13 mm | 16225 / 299 / 0 | 16225 / 299 / 0 | 16225 / 299 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 2 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 3.38e-13 mm | Pass: landing.maxAbs 3.48e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 18 | Pass: landing.maxAbs 1.42e-13 mm | Pass: landing.maxAbs 3.84e-13 mm | Pass: landing.maxAbs 3.98e-13 mm | 16192 / 332 / 0 | 16192 / 332 / 0 | 16192 / 332 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 2 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 3.38e-13 mm | Pass: landing.maxAbs 3.52e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 18 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 3.84e-13 mm | Pass: landing.maxAbs 3.94e-13 mm | 16192 / 332 / 0 | 16192 / 332 / 0 | 16192 / 332 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 3.62e-13 mm | Pass: landing.maxAbs 3.59e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 18 | Pass: landing.maxAbs 3.48e-13 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | 16164 / 360 / 0 | 16164 / 360 / 0 | 16164 / 360 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 3.59e-13 mm | Pass: landing.maxAbs 3.59e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 18 | Pass: landing.maxAbs 3.48e-13 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | 16164 / 360 / 0 | 16164 / 360 / 0 | 16164 / 360 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 2 | Pass: landing.maxAbs 2.70e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | Pass: landing.maxAbs 3.09e-13 mm | 1815 / 21 / 0 | 1815 / 21 / 0 | 1815 / 21 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 18 | Pass: landing.maxAbs 3.34e-13 mm | Pass: landing.maxAbs 3.20e-13 mm | Pass: landing.maxAbs 3.73e-13 mm | 16065 / 459 / 0 | 16065 / 459 / 0 | 16065 / 459 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 2 | Pass: landing.maxAbs 2.70e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | Pass: landing.maxAbs 3.09e-13 mm | 1815 / 21 / 0 | 1815 / 21 / 0 | 1815 / 21 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 18 | Pass: landing.maxAbs 3.34e-13 mm | Pass: landing.maxAbs 3.20e-13 mm | Pass: landing.maxAbs 3.69e-13 mm | 16065 / 459 / 0 | 16065 / 459 / 0 | 16065 / 459 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 2 | Pass: landing.maxAbs 2.20e-13 mm | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 3.09e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 18 | Pass: landing.maxAbs 3.45e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | Pass: landing.maxAbs 3.52e-13 mm | 16237 / 287 / 0 | 16237 / 287 / 0 | 16237 / 287 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 2 | Pass: landing.maxAbs 2.20e-13 mm | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 3.06e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 18 | Pass: landing.maxAbs 3.45e-13 mm | Pass: landing.maxAbs 2.45e-13 mm | Pass: landing.maxAbs 3.55e-13 mm | 16237 / 287 / 0 | 16237 / 287 / 0 | 16237 / 287 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 2 | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.95e-13 mm | 1801 / 35 / 0 | 1801 / 35 / 0 | 1801 / 35 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 18 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 15950 / 574 / 0 | 15950 / 574 / 0 | 15950 / 574 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 2 | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 1.99e-13 mm | 1801 / 35 / 0 | 1801 / 35 / 0 | 1801 / 35 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 18 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 15950 / 574 / 0 | 15950 / 574 / 0 | 15950 / 574 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 2 | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.81e-13 mm | 1831 / 5 / 0 | 1831 / 5 / 0 | 1831 / 5 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 18 | Pass: landing.maxAbs 2.06e-13 mm | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 2.56e-13 mm | 16202 / 322 / 0 | 16202 / 322 / 0 | 16202 / 322 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 2 | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.85e-13 mm | 1831 / 5 / 0 | 1831 / 5 / 0 | 1831 / 5 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 18 | Pass: landing.maxAbs 2.06e-13 mm | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 2.56e-13 mm | 16202 / 322 / 0 | 16202 / 322 / 0 | 16202 / 322 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 2 | Pass: landing.maxAbs 4.87e-13 mm | Pass: landing.maxAbs 4.62e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | 1825 / 11 / 0 | 1825 / 11 / 0 | 1825 / 11 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 2 | Pass: landing.maxAbs 2.73e-13 mm | Pass: landing.maxAbs 6.82e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | 1824 / 12 / 0 | 1824 / 12 / 0 | 1824 / 12 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 2 | Pass: landing.maxAbs 1.01e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.33e-13 mm | 1810 / 26 / 0 | 1810 / 26 / 0 | 1810 / 26 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 18 | Pass: landing.maxAbs 7.00e-13 mm | Pass: landing.maxAbs 5.44e-13 mm | Pass: landing.maxAbs 7.07e-13 mm | 16107 / 417 / 0 | 16107 / 417 / 0 | 16107 / 417 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 3.14e-13 mm | Pass: landing.maxAbs 6.82e-13 mm | Pass: landing.maxAbs 7.03e-13 mm | 16103 / 421 / 0 | 16103 / 421 / 0 | 16103 / 421 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 18 | Pass: landing.maxAbs 2.70e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | Pass: landing.maxAbs 6.22e-13 mm | 16001 / 523 / 0 | 16001 / 523 / 0 | 16001 / 523 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 2 | Pass: landing.maxAbs 4.87e-13 mm | Pass: landing.maxAbs 4.62e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | 1825 / 11 / 0 | 1825 / 11 / 0 | 1825 / 11 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 2 | Pass: landing.maxAbs 2.73e-13 mm | Pass: landing.maxAbs 6.82e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | 1824 / 12 / 0 | 1824 / 12 / 0 | 1824 / 12 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 2 | Pass: landing.maxAbs 1.01e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.33e-13 mm | 1810 / 26 / 0 | 1810 / 26 / 0 | 1810 / 26 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 18 | Pass: landing.maxAbs 7.00e-13 mm | Pass: landing.maxAbs 5.47e-13 mm | Pass: landing.maxAbs 7.07e-13 mm | 16107 / 417 / 0 | 16107 / 417 / 0 | 16107 / 417 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 3.14e-13 mm | Pass: landing.maxAbs 6.82e-13 mm | Pass: landing.maxAbs 7.03e-13 mm | 16103 / 421 / 0 | 16103 / 421 / 0 | 16103 / 421 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 18 | Pass: landing.maxAbs 2.70e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | Pass: landing.maxAbs 6.22e-13 mm | 16001 / 523 / 0 | 16001 / 523 / 0 | 16001 / 523 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 2 | Pass: landing.maxAbs 9.50e-14 mm | Pass: landing.maxAbs 5.04e-13 mm | Pass: landing.maxAbs 5.08e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 2 | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 6.47e-13 mm | Pass: landing.maxAbs 6.79e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 2 | Pass: landing.maxAbs 2.15e-13 mm | Pass: landing.maxAbs 4.01e-13 mm | Pass: landing.maxAbs 4.26e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 18 | Pass: landing.maxAbs 2.65e-13 mm | Pass: landing.maxAbs 6.00e-13 mm | Pass: landing.maxAbs 5.47e-13 mm | 16126 / 398 / 0 | 16126 / 398 / 0 | 16126 / 398 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 2.17e-13 mm | Pass: landing.maxAbs 6.64e-13 mm | Pass: landing.maxAbs 7.03e-13 mm | 16199 / 325 / 0 | 16199 / 325 / 0 | 16199 / 325 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 18 | Pass: landing.maxAbs 2.52e-13 mm | Pass: landing.maxAbs 5.47e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 16203 / 321 / 0 | 16203 / 321 / 0 | 16203 / 321 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 2 | Pass: landing.maxAbs 9.50e-14 mm | Pass: landing.maxAbs 5.04e-13 mm | Pass: landing.maxAbs 5.08e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 2 | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 6.47e-13 mm | Pass: landing.maxAbs 6.79e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 2 | Pass: landing.maxAbs 2.15e-13 mm | Pass: landing.maxAbs 4.01e-13 mm | Pass: landing.maxAbs 4.28e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 18 | Pass: landing.maxAbs 2.65e-13 mm | Pass: landing.maxAbs 6.00e-13 mm | Pass: landing.maxAbs 5.51e-13 mm | 16126 / 398 / 0 | 16126 / 398 / 0 | 16126 / 398 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 2.17e-13 mm | Pass: landing.maxAbs 6.61e-13 mm | Pass: landing.maxAbs 7.07e-13 mm | 16199 / 325 / 0 | 16199 / 325 / 0 | 16199 / 325 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 18 | Pass: landing.maxAbs 2.54e-13 mm | Pass: landing.maxAbs 5.47e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 16203 / 321 / 0 | 16203 / 321 / 0 | 16203 / 321 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 2 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.71e-13 mm | 1817 / 19 / 0 | 1817 / 19 / 0 | 1817 / 19 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 18 | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 16062 / 462 / 0 | 16062 / 462 / 0 | 16062 / 462 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 2 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.71e-13 mm | 1817 / 19 / 0 | 1817 / 19 / 0 | 1817 / 19 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 18 | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 16062 / 462 / 0 | 16062 / 462 / 0 | 16062 / 462 / 0 |
| nikon-z-mc-105f28-f11-ref | 2 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 18 | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | 16204 / 320 / 0 | 16204 / 320 / 0 | 16204 / 320 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 2 | Pass: landing.maxAbs 1.46e-13 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 18 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.60e-13 mm | 16204 / 320 / 0 | 16204 / 320 / 0 | 16204 / 320 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 18 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 16252 / 272 / 0 | 16252 / 272 / 0 | 16252 / 272 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 2 | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 16252 / 272 / 0 | 16252 / 272 / 0 | 16252 / 272 / 0 |
| nikon-z-135f18-plena-f11-ref | 2 | Pass: landing.maxAbs 9.59e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 18 | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.42e-13 mm | 16247 / 277 / 0 | 16247 / 277 / 0 | 16247 / 277 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 2 | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 18 | Pass: landing.maxAbs 1.24e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 1.46e-13 mm | 16247 / 277 / 0 | 16247 / 277 / 0 | 16247 / 277 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 2 | Pass: landing.maxAbs 3.62e-13 mm | Pass: landing.maxAbs 2.84e-13 mm | Pass: landing.maxAbs 3.66e-13 mm | 1794 / 42 / 0 | 1794 / 42 / 0 | 1794 / 42 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 18 | Pass: landing.maxAbs 3.80e-13 mm | Pass: landing.maxAbs 2.88e-13 mm | Pass: landing.maxAbs 3.73e-13 mm | 15889 / 635 / 0 | 15889 / 635 / 0 | 15889 / 635 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 2 | Pass: landing.maxAbs 3.66e-13 mm | Pass: landing.maxAbs 2.88e-13 mm | Pass: landing.maxAbs 3.69e-13 mm | 1794 / 42 / 0 | 1794 / 42 / 0 | 1794 / 42 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 18 | Pass: landing.maxAbs 3.80e-13 mm | Pass: landing.maxAbs 2.88e-13 mm | Pass: landing.maxAbs 3.77e-13 mm | 15889 / 635 / 0 | 15889 / 635 / 0 | 15889 / 635 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 2 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 3.91e-13 mm | Pass: landing.maxAbs 3.66e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 18 | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 4.19e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | 16161 / 363 / 0 | 16161 / 363 / 0 | 16161 / 363 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 2 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 3.94e-13 mm | Pass: landing.maxAbs 3.69e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 18 | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 4.16e-13 mm | Pass: landing.maxAbs 4.16e-13 mm | 16161 / 363 / 0 | 16161 / 363 / 0 | 16161 / 363 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 2 | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 2 | Pass: landing.maxAbs 1.09e-13 mm | Pass: landing.maxAbs 6.89e-13 mm | Pass: landing.maxAbs 6.64e-13 mm | 1778 / 58 / 0 | 1778 / 58 / 0 | 1778 / 58 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 2 | Pass: landing.maxAbs 1.40e-13 mm | Pass: landing.maxAbs 5.99e-13 mm | Pass: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 18 | Pass: landing.maxAbs 6.47e-13 mm | Pass: landing.maxAbs 5.65e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | 15804 / 720 / 0 | 15804 / 720 / 0 | 15804 / 720 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 2.50e-13 mm | Pass: landing.maxAbs 6.75e-13 mm | Pass: landing.maxAbs 7.67e-13 mm | 15711 / 813 / 0 | 15711 / 813 / 0 | 15711 / 813 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 18 | Pass: landing.maxAbs 4.90e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | Pass: landing.maxAbs 6.70e-13 mm | 15318 / 1206 / 0 | 15318 / 1206 / 0 | 15318 / 1206 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 2 | Pass: landing.maxAbs 6.50e-13 mm | Pass: landing.maxAbs 4.48e-13 mm | Pass: landing.maxAbs 6.54e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 2 | Pass: landing.maxAbs 1.09e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | Pass: landing.maxAbs 6.61e-13 mm | 1778 / 58 / 0 | 1778 / 58 / 0 | 1778 / 58 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 2 | Pass: landing.maxAbs 1.40e-13 mm | Pass: landing.maxAbs 5.99e-13 mm | Pass: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 18 | Pass: landing.maxAbs 6.47e-13 mm | Pass: landing.maxAbs 5.65e-13 mm | Pass: landing.maxAbs 6.86e-13 mm | 15804 / 720 / 0 | 15804 / 720 / 0 | 15804 / 720 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 2.50e-13 mm | Pass: landing.maxAbs 6.75e-13 mm | Pass: landing.maxAbs 7.67e-13 mm | 15711 / 813 / 0 | 15711 / 813 / 0 | 15711 / 813 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 18 | Pass: landing.maxAbs 4.90e-13 mm | Pass: landing.maxAbs 6.36e-13 mm | Pass: landing.maxAbs 6.70e-13 mm | 15318 / 1206 / 0 | 15318 / 1206 / 0 | 15318 / 1206 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 4.69e-13 mm | Pass: landing.maxAbs 4.16e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 5.90e-13 mm | Pass: landing.maxAbs 6.04e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 2 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 18 | Pass: landing.maxAbs 2.77e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | Pass: landing.maxAbs 5.44e-13 mm | 16164 / 360 / 0 | 16164 / 360 / 0 | 16164 / 360 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 2.95e-13 mm | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 16198 / 326 / 0 | 16198 / 326 / 0 | 16198 / 326 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 18 | Pass: landing.maxAbs 4.90e-13 mm | Pass: landing.maxAbs 6.22e-13 mm | Pass: landing.maxAbs 5.93e-13 mm | 16201 / 323 / 0 | 16201 / 323 / 0 | 16201 / 323 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 2 | Pass: landing.maxAbs 1.10e-13 mm | Pass: landing.maxAbs 4.73e-13 mm | Pass: landing.maxAbs 4.19e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 2 | Pass: landing.maxAbs 1.03e-13 mm | Pass: landing.maxAbs 5.90e-13 mm | Pass: landing.maxAbs 6.04e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 2 | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.19e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 18 | Pass: landing.maxAbs 2.77e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | Pass: landing.maxAbs 5.44e-13 mm | 16164 / 360 / 0 | 16164 / 360 / 0 | 16164 / 360 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 18 | Pass: landing.maxAbs 2.97e-13 mm | Pass: landing.maxAbs 6.54e-13 mm | Pass: landing.maxAbs 6.57e-13 mm | 16198 / 326 / 0 | 16198 / 326 / 0 | 16198 / 326 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 18 | Pass: landing.maxAbs 4.94e-13 mm | Pass: landing.maxAbs 6.25e-13 mm | Pass: landing.maxAbs 5.97e-13 mm | 16201 / 323 / 0 | 16201 / 323 / 0 | 16201 / 323 / 0 |

## Vignetting rays — `vignetting-rays`

Compares: Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 3.18e-14 | nikon-z-mc-105f28-f11-photopic | field 1.00e1 deg, line 5 |
| lv – optiland | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0 deg, line 0 |
| lv – optiland | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0 deg, line 0 |
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.53e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | field 3.15e0 deg, line 7, ray 2048 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 12680830 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 6280 | — | — |
| lv – reference-tracer | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.12e-13 | nikon-z-24-70f4s-f11-ref-tele | field 5.54e0 deg, line 0 |
| lv – reference-tracer | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0 deg, line 0 |
| lv – reference-tracer | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0 deg, line 0 |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.10e-13 | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | field 2.40e1 deg, line 1, ray 2048 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 12680830 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Fields compared — `fields.compared` | elements | — | 6280 | — | — |
| optiland – reference-tracer | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.14e-13 | nikon-z-24-70f4s-f11-photopic-tele | field 5.54e0 deg, line 2 |
| optiland – reference-tracer | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.38e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | field 3.15e0 deg, line 7, ray 2048 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 12680830 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Fields compared — `fields.compared` | elements | — | 6280 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 2.31e-14 mm | Pass: landing.maxAbs 4.26e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 6.39e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 1 | Pass: illumination.maxAbs 3.77e-15 | Pass: landing.maxAbs 2.31e-14 mm | Pass: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | Pass: illumination.maxAbs 3.77e-15 | Pass: landing.maxAbs 2.49e-14 mm | Pass: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 9 | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | Pass: landing.maxAbs 1.78e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | Pass: illumination.maxAbs 1.67e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | Pass: illumination.maxAbs 4.33e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | Pass: illumination.maxAbs 4.33e-15 | Pass: landing.maxAbs 2.66e-14 mm | Pass: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 6.75e-14 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 9 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.87e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 9 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.85e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | Pass: illumination.maxAbs 7.11e-15 | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 9 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.87e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | Pass: illumination.maxAbs 7.11e-15 | Pass: landing.maxAbs 1.74e-13 mm | Pass: landing.maxAbs 1.58e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 9 | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| nikkor-z50f12-f5.6-ref | 1 | Pass: illumination.maxAbs 7.66e-15 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 9.88e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 9 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 2.42e-14 | Pass: landing.maxAbs 1.42e-13 mm | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| nikkor-z50f12-f5.6-best-ref | 1 | Pass: illumination.maxAbs 7.66e-15 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 9.88e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 9 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 2.42e-14 | Pass: landing.maxAbs 1.39e-13 mm | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| nikkor-z50f12-f11-ref | 1 | Pass: illumination.maxAbs 7.44e-15 | Pass: illumination.maxAbs 2.00e-14 | Pass: illumination.maxAbs 2.35e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 9 | Pass: illumination.maxAbs 1.52e-14 | Pass: illumination.maxAbs 2.74e-14 | Pass: illumination.maxAbs 3.18e-14 | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| nikkor-z50f12-f11-best-ref | 1 | Pass: illumination.maxAbs 7.44e-15 | Pass: illumination.maxAbs 2.00e-14 | Pass: illumination.maxAbs 2.35e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 9 | Pass: illumination.maxAbs 1.52e-14 | Pass: illumination.maxAbs 2.74e-14 | Pass: illumination.maxAbs 3.18e-14 | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | Pass: illumination.maxAbs 6.27e-15 | Pass: illumination.maxAbs 4.84e-14 | Pass: illumination.maxAbs 4.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 9 | Pass: landing.maxAbs 8.53e-14 mm | Pass: illumination.maxAbs 4.82e-14 | Pass: illumination.maxAbs 5.07e-14 | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | Pass: illumination.maxAbs 6.27e-15 | Pass: illumination.maxAbs 4.84e-14 | Pass: illumination.maxAbs 4.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 9 | Pass: landing.maxAbs 8.53e-14 mm | Pass: illumination.maxAbs 4.82e-14 | Pass: illumination.maxAbs 5.07e-14 | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 1 | Pass: illumination.maxAbs 4.44e-15 | Pass: illumination.maxAbs 6.94e-14 | Pass: illumination.maxAbs 6.75e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 9 | Pass: landing.maxAbs 8.53e-14 mm | Pass: illumination.maxAbs 7.06e-14 | Pass: illumination.maxAbs 7.47e-14 | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | Pass: illumination.maxAbs 4.44e-15 | Pass: illumination.maxAbs 6.94e-14 | Pass: illumination.maxAbs 6.75e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 9 | Pass: landing.maxAbs 8.53e-14 mm | Pass: illumination.maxAbs 7.06e-14 | Pass: illumination.maxAbs 7.47e-14 | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 9 | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 9 | Pass: landing.maxAbs 1.49e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 9 | Pass: landing.maxAbs 1.53e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.38e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 9 | Pass: landing.maxAbs 1.49e-13 mm | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.67e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 1.10e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 9 | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.71e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: landing.maxAbs 5.33e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.67e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 4.97e-14 mm | Pass: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 9 | Pass: landing.maxAbs 1.31e-13 mm | Pass: landing.maxAbs 8.53e-14 mm | Pass: landing.maxAbs 1.71e-13 mm | 18425 / 16 / 0 | 18425 / 16 / 0 | 18425 / 16 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: illumination.maxAbs 1.95e-14 | Pass: illumination.maxAbs 1.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | Pass: illumination.maxAbs 3.55e-15 | Pass: landing.maxAbs 1.71e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 2.33e-14 | Pass: illumination.maxAbs 2.32e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 9 | Pass: illumination.maxAbs 1.01e-14 | Pass: illumination.maxAbs 2.18e-14 | Pass: illumination.maxAbs 2.18e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 9.99e-15 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 18377 / 64 / 0 | 18377 / 64 / 0 | 18377 / 64 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 2.66e-14 | Pass: illumination.maxAbs 2.78e-14 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | Pass: illumination.maxAbs 5.77e-15 | Pass: illumination.maxAbs 1.95e-14 | Pass: illumination.maxAbs 1.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | Pass: illumination.maxAbs 3.55e-15 | Pass: landing.maxAbs 1.71e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | Pass: landing.maxAbs 7.82e-14 mm | Pass: illumination.maxAbs 2.33e-14 | Pass: illumination.maxAbs 2.32e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 9 | Pass: illumination.maxAbs 1.01e-14 | Pass: illumination.maxAbs 2.18e-14 | Pass: illumination.maxAbs 2.18e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 9.99e-15 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 18377 / 64 / 0 | 18377 / 64 / 0 | 18377 / 64 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 2.66e-14 | Pass: illumination.maxAbs 2.78e-14 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 2.50e-14 | Pass: illumination.maxAbs 2.86e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | Pass: illumination.maxAbs 7.22e-15 | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 2.11e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.12e-13 | Pass: illumination.maxAbs 1.09e-13 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 9 | Pass: illumination.maxAbs 1.11e-14 | Pass: illumination.maxAbs 3.46e-14 | Pass: illumination.maxAbs 2.88e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 9.21e-15 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 9 | Pass: illumination.maxAbs 1.13e-14 | Pass: illumination.maxAbs 1.10e-13 | Pass: illumination.maxAbs 1.14e-13 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 2.50e-14 | Pass: illumination.maxAbs 2.86e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | Pass: illumination.maxAbs 7.22e-15 | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 2.11e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.12e-13 | Pass: illumination.maxAbs 1.09e-13 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 9 | Pass: illumination.maxAbs 1.11e-14 | Pass: illumination.maxAbs 3.46e-14 | Pass: illumination.maxAbs 2.88e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 9.21e-15 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 9 | Pass: illumination.maxAbs 1.13e-14 | Pass: illumination.maxAbs 1.10e-13 | Pass: illumination.maxAbs 1.14e-13 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 1 | Pass: illumination.maxAbs 1.58e-14 | Pass: illumination.maxAbs 2.49e-14 | Pass: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 9 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 2.80e-14 | Pass: illumination.maxAbs 2.69e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | Pass: illumination.maxAbs 1.58e-14 | Pass: illumination.maxAbs 2.49e-14 | Pass: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 9 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 2.80e-14 | Pass: illumination.maxAbs 2.69e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-mc-105f28-f11-ref | 1 | Pass: illumination.maxAbs 2.15e-14 | Pass: landing.maxAbs 1.17e-13 mm | Pass: illumination.maxAbs 2.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 9 | Pass: illumination.maxAbs 3.18e-14 | Pass: landing.maxAbs 7.11e-14 mm | Pass: illumination.maxAbs 3.09e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 1 | Pass: illumination.maxAbs 2.15e-14 | Pass: landing.maxAbs 1.21e-13 mm | Pass: illumination.maxAbs 2.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 9 | Pass: illumination.maxAbs 3.18e-14 | Pass: landing.maxAbs 7.11e-14 mm | Pass: illumination.maxAbs 3.09e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 1 | Pass: illumination.maxAbs 4.55e-15 | Pass: illumination.maxAbs 3.00e-15 | Pass: illumination.maxAbs 4.66e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 9 | Pass: illumination.maxAbs 5.55e-15 | Pass: landing.maxAbs 6.75e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | Pass: illumination.maxAbs 4.55e-15 | Pass: illumination.maxAbs 3.00e-15 | Pass: illumination.maxAbs 4.66e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 9 | Pass: illumination.maxAbs 5.55e-15 | Pass: landing.maxAbs 6.39e-14 mm | Pass: landing.maxAbs 7.82e-14 mm | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| nikon-z-135f18-plena-f11-ref | 1 | Pass: illumination.maxAbs 4.77e-15 | Pass: illumination.maxAbs 5.33e-15 | Pass: illumination.maxAbs 8.10e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 9 | Pass: illumination.maxAbs 9.10e-15 | Pass: illumination.maxAbs 8.22e-15 | Pass: illumination.maxAbs 1.11e-14 | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 1 | Pass: illumination.maxAbs 4.77e-15 | Pass: illumination.maxAbs 5.33e-15 | Pass: illumination.maxAbs 8.10e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 9 | Pass: illumination.maxAbs 9.10e-15 | Pass: illumination.maxAbs 8.22e-15 | Pass: illumination.maxAbs 1.11e-14 | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | Pass: illumination.maxAbs 9.10e-15 | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 9 | Pass: illumination.maxAbs 1.29e-14 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | Pass: illumination.maxAbs 9.10e-15 | Pass: landing.maxAbs 1.56e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 9 | Pass: illumination.maxAbs 1.29e-14 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | Pass: landing.maxAbs 3.91e-14 mm | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 9 | Pass: illumination.maxAbs 4.22e-15 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 1.60e-13 mm | Pass: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 9 | Pass: illumination.maxAbs 4.22e-15 | Pass: landing.maxAbs 1.85e-13 mm | Pass: landing.maxAbs 1.88e-13 mm | 18433 / 8 / 0 | 18433 / 8 / 0 | 18433 / 8 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | Pass: illumination.maxAbs 1.12e-14 | Pass: landing.maxAbs 1.71e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.67e-14 | Pass: illumination.maxAbs 1.61e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 9.10e-15 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 18369 / 72 / 0 | 18369 / 72 / 0 | 18369 / 72 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.70e-14 | Pass: illumination.maxAbs 1.83e-14 | 18355 / 86 / 0 | 18355 / 86 / 0 | 18355 / 86 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | Pass: illumination.maxAbs 1.12e-14 | Pass: landing.maxAbs 1.71e-13 mm | Pass: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.74e-14 | Pass: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.67e-14 | Pass: illumination.maxAbs 1.61e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 9.10e-15 | Pass: landing.maxAbs 2.10e-13 mm | Pass: landing.maxAbs 2.24e-13 mm | 18369 / 72 / 0 | 18369 / 72 / 0 | 18369 / 72 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 9 | Pass: landing.maxAbs 8.17e-14 mm | Pass: illumination.maxAbs 1.70e-14 | Pass: illumination.maxAbs 1.83e-14 | 18355 / 86 / 0 | 18355 / 86 / 0 | 18355 / 86 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 1 | Pass: landing.maxAbs 6.04e-14 mm | Pass: illumination.maxAbs 4.88e-14 | Pass: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | Pass: landing.maxAbs 3.20e-14 mm | Pass: illumination.maxAbs 5.68e-14 | Pass: illumination.maxAbs 5.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 9 | Pass: illumination.maxAbs 1.07e-14 | Pass: illumination.maxAbs 7.11e-14 | Pass: illumination.maxAbs 7.45e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 1.01e-14 | Pass: illumination.maxAbs 5.95e-14 | Pass: illumination.maxAbs 6.21e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 9 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 2.94e-14 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | Pass: landing.maxAbs 5.68e-14 mm | Pass: illumination.maxAbs 4.88e-14 | Pass: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | Pass: landing.maxAbs 3.20e-14 mm | Pass: illumination.maxAbs 5.68e-14 | Pass: illumination.maxAbs 5.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 9 | Pass: illumination.maxAbs 1.07e-14 | Pass: illumination.maxAbs 7.11e-14 | Pass: illumination.maxAbs 7.45e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 9 | Pass: illumination.maxAbs 1.01e-14 | Pass: illumination.maxAbs 5.95e-14 | Pass: illumination.maxAbs 6.21e-14 | 18385 / 56 / 0 | 18385 / 56 / 0 | 18385 / 56 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 9 | Pass: illumination.maxAbs 1.40e-14 | Pass: illumination.maxAbs 1.90e-14 | Pass: illumination.maxAbs 2.94e-14 | 18365 / 76 / 0 | 18365 / 76 / 0 | 18365 / 76 / 0 |

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
| `-zoom<T>` | a zoom lens at a zoom position LensVisualizer publishes: T runs from 0 at the short end of the range to 1 at the long end |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | 5485e0da47df4eacfeda987196b4a38dc66e5997d129600c55b0c76692b99f29 |
| Baseline file | 03ba76735de737e9fcee937bc869362c66cb7674fa1a24cd33bb78c739a47581 |
| Limits file | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61 | 674d26ffb708596a5462f6199b1cb2c28df679003651e53ebb4bbde0e590be9a | commit f5b456fec7b69184844078f6ec6b1ac132f8ec58 |
| optiland | 2ca0f73256d5e0ead64aa3695522bef399721276bf11d612db34b7bf19c5ee39 | 59039a7b219f2882f1e4cabf8f43bc07a9fdf66ecb95d26f4076feca4406d853 | commit a9e544a2e058f1c1b64606e9ce90e6dc103efee1, distribution version 0.6.2.post234+ga9e544a2, source hash 1d35bfa2f7a6addd60f2c1057cd17e65a710a6a7d4e3a277e8675647d0262131 |
| reference-tracer | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 | — |

| Run | Lens state |
|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | fb6313aafaef4cc6341c86d507a91837b5deab4417ccdeb699274d5ec65de76f |
| canon-ef-135-f2l-usm-f5.6-photopic | 0bb244ad3b91ebc1fcc8832ac3ff03c078403191a944eabb6d10f461477df3d1 |
| canon-ef-135-f2l-usm-f5.6-best-ref | cfb40db60c1920a71df2e3577d416c7c11811ad983785f4a3d7c2d4f2ed45d2b |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 6f6a675260eaedb832bcd186ebc30233a62418137d8c7a022507cfb1c2f2f769 |
| canon-ef-135-f2l-usm-f11-ref | 3538c790a1ec7344597b37548aec69a2df46fcb828795c1bd678079a9ad78dc3 |
| canon-ef-135-f2l-usm-f11-photopic | b359219bb1416175a36043e267ed01226e18656fd692086a7bceff9700f917a5 |
| canon-ef-135-f2l-usm-f11-best-ref | fde75efe0d80ad2af8615df46ff798a3e3bf044409d58bf1a3e6271068eb31a3 |
| canon-ef-135-f2l-usm-f11-best-photopic | dd93d62ab085fac35f27ed48e997e93820bc52a1d53a87365835edaf5f003bce |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 11fe04d53f56df0f4217bea7f1df0135e80ac3aa14b3ec6a13c163756b00c748 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 527c4ba128c41cae2c4c564a71b48eaf20e50c257ba0d39b308978129d8e8766 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | fb61b013bd83b38b13284163754deed2b37a7d26ad84ca1fcc3db9ef49b1e0c4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3db636c9403c6cd8b18d681856ddfaf0b7876d1fa113477592e1b33611911480 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 7c3073c4e7dbedf0705593abf810e4d84fd34d97d7903728a421926d55fa4dc4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 2a721f0fb1532b9d5ffd33fc93a62c16dce316fd6158db9976215f6e1e0dc8b0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 8cec235dbb1353ecce18595c4106e7ca14174f1935bfc6ac081648abec9e23c8 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | bd9145a0004d2ce2bd9a18e00f62f853263438016b3ed71d7cd8d67d43fdb5d2 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 63c31b9a55e5f68d962ae0d5a47e737b4d5df1301a900eb50af363001d160a75 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | c0b2ed818ce7b917f1f78d4687f40197b16b4179c60fe5f9af41e4f78ec3a473 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 049584b5191a4fd43509da6d422906e44e14697e68119403dd03ccb064f8b1cb |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 141995a92146307173e9b585842fa7fff2746eeeb285335bfc035c9efba5a576 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 02b1e001699f7823e93b41eef21cfbf7c3a7090a93803ba41f9b46d97b1b68b2 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | c1d3b6b6b7d1cb58e51a7b709b2aeb9f9f1018a777a5506e8d92f7f305bb8f6c |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1409655514e43351da977a690ec1a2a38ed6ea92bb6e65758dbabe5775a6f5d7 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | f35e1467099875249f65562c5ed70bb947478465455ff5f61f83489e2010e004 |
| nikkor-z50f12-f5.6-ref | 93370aead6b9eb8def155ccf5f3a8780f977a3fda62560f1c44406cf3a1d7ceb |
| nikkor-z50f12-f5.6-photopic | 57df07f9ba1f3a042ee7e6fa6be30fc29de381148b021881249dbd60a47b8ebd |
| nikkor-z50f12-f5.6-best-ref | 40adc9d9360db7791e21a3b20e8c0c833654c32f19427a958dd20aced28d9ebf |
| nikkor-z50f12-f5.6-best-photopic | 5cda22433713055d2b77d6b86285cdd3d09f2f2e56abb9afb53b32c6d3ac51ab |
| nikkor-z50f12-f11-ref | 1a34a84b12ddaa766ccc173f659f2b44483089c9560aed71cf85aad1528b9335 |
| nikkor-z50f12-f11-photopic | 728b764ddf0eb1965a740c412d8a5ba04a7e9afedf9d5b3da418fa0395279529 |
| nikkor-z50f12-f11-best-ref | e230a19defd0b95cada536016457031dac54e94566818a5c97cb2e8295bc18ac |
| nikkor-z50f12-f11-best-photopic | 9409e03e1d8bb38c55d22e4b8e2db3580fba792241a42761745caa1b1ca20816 |
| sony-fe-20mm-f18-g-f5.6-ref | 032904853c0718dd4654541b6a26e293c3d584c9cc75b880e3327126e0f62550 |
| sony-fe-20mm-f18-g-f5.6-photopic | 7ffad7e07b4ab08be425b0f506835465f1b401e006cf3f60cc4a462eacb8a17e |
| sony-fe-20mm-f18-g-f5.6-best-ref | 6a018b55d80117d42be3a4b4cd945b3c0930f9544519c314aaed262281e346a2 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 7402bb519a0b3c238c15b9883b7986762130247590b55437c6f64ce3a86a7630 |
| sony-fe-20mm-f18-g-f11-ref | 66629bfed7b0cb8ab55ac7d50e6363ebefaa1922a52a3915db2e38f86de2b5be |
| sony-fe-20mm-f18-g-f11-photopic | da5535831a1823aeb9676680c2ea18d9571477d8a44cef460ac0ce541691ed0a |
| sony-fe-20mm-f18-g-f11-best-ref | 14626b8ab553320b14dfa90cf59ba2bd7b6b433033a0db1169424e5e61cea556 |
| sony-fe-20mm-f18-g-f11-best-photopic | ebd85cee697d657cdd866e95c41833268d97db7cec0e76ccc07d3c9f73784496 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | cfd2f4b05ff511406ee2fcf6445bb368a1e65da0aef98100ce96e52afd7ee8cc |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 90e47ed96ae48b31a549611cfa8d20f8cba6e6a256fc2177231bdb56d89e02ae |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 7978e8b6317cb261a60c5258a804dc0819ed21ec238ced93389bbed06f7820c1 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | f0b2fce6bdc5cfb52e92925ea7e26fea510ba8896ce41b523670055347ea72b6 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1a94040d1d518dd6202eb3867b88ddfc677b2127c68f0e0c14e80f86628c70d7 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | e39d025209a0474bbbfcfa56b371f03857285eeaf1bb7aac2c795a327dd16267 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | e8134f174ecafd2430ad50cfb2ba0d0166b13d1551f90aa9d8ac0ffddbb9a459 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 6e35d1af49b71d869f74f02f4cc85dfb0559cdf3b3ca0f1e7035267465090e09 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 83bc7aa668f82b6b22a13b1acc5b0f5af9ce2968947f11528dea3c0fbeef39e9 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 06ea3987a51a1f4fb802733e5da21eabe412cbaea93831e7a7f156e7f4ca12c9 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | ace750e815937160ee6fb3ca0e4eb1171b25e239d6417acbed4fe523a22999d2 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | ea8f3c035915125e5bc1fb703a3fb652d17204f3124b91e6ff45f0eb424938d9 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 849578276ae0917f9e2215c51c30145952bb7126cce058be7687a974b9a8dd4a |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 527fa6221c4f06288b21f4dd259313adea27de6c14cbb43703d3571412cf967b |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 8216f33f93629b810fa907bef02c40e5bcd420baec4ce1d6c8a81dd3bb7cffd6 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 71f5b1c10ac609ada5b900504422eb1e96f85f025a966a8454bde43267080c56 |
| nikon-z-24-70f4s-f5.6-ref-wide | ca4650a2f1cab8126617b31e5e196328c9e6047662925528c44d866fe77ec229 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | d6dd88710ac133d194348fdebe5810d09477eb6d54d7d92c5a43b78d42913ffc |
| nikon-z-24-70f4s-f5.6-ref-tele | 8b15e190d96badcfb4ffa2b7d3f4cdb4f140a3f73afd80711ce385e7b298967e |
| nikon-z-24-70f4s-f5.6-photopic-wide | 2510573456570987e5d44b6aa597d4b9a6521aa366516ccb26c50d4de6e746a9 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 984d5ef2391c973845a56a31608a036b988a3c088a4e187ed8dbe9d2d89cdf4e |
| nikon-z-24-70f4s-f5.6-photopic-tele | e8c82d27951c440cc1f88df20ba83f966a6c5ca34bd98f16f51d25af697bf0df |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 534c54ca70f1030921493f470f9ee0d6a3d238dc3cd43dc509c0f8687e543ea7 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 672c59fea97eac2518485a560ed393242b1d93aea8dd8eb924af71026aad071b |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 44724094bec9dc249b2d0587cd4722285afa329dc7ed3247d80487c9bf044284 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | c4350a7ae66a7c5d1636779198a6836b1d53a2eb1e95aafe0f500ec64ae45200 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | d270caa263c2905c8932495abc7d758bfb2b1667a41b4ebe112febd62c701ee1 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | aadb6362aadf68ffb639570a84368f0c679ad673dc9d9cc424405ba8089a11e8 |
| nikon-z-24-70f4s-f11-ref-wide | a9fc28dc90bb6ec393151512c95cd9bbed404b4e7aeb6110aee02edda8728dfb |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | ee0b49410666fe2b115167d3da9eadc492967c802f4457c926b117aafe491428 |
| nikon-z-24-70f4s-f11-ref-tele | dc0cc7f4f4644e267e862cc6f513fefb957e91c401cd83910f1faafbba1851f1 |
| nikon-z-24-70f4s-f11-photopic-wide | c206eaf79209e5ec699430cdc0f5923ba2d445f39f590303bcc3c31d3e145403 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | d0eeb6571d07edf32c0707c8f24cc801818361e470ce1fa8db1b20d3a5b7e715 |
| nikon-z-24-70f4s-f11-photopic-tele | 31131a9c3a5064a17fa061ed66bbb17d1974c17f8df3d11c86435b060550e15a |
| nikon-z-24-70f4s-f11-best-ref-wide | f286f2dfaa83049a3d5591572f3e47840cf0032e6287523202de250b62561b1f |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 43c74496798ae9506b5038882eb2fe2fc934ecc74286ea98fdea22129bc9db3f |
| nikon-z-24-70f4s-f11-best-ref-tele | 86e79118d05b624fe13b031ef8c4cd8440be28a8e1bff83babd4d8424dbcd0ac |
| nikon-z-24-70f4s-f11-best-photopic-wide | ca0315a31df48b28a8ee654c39f2f02ba437e67d31827c1f66952c6a59f2a195 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | fc43f4c21ab2e5e37fcc04116fa881dbc610d1f88b9565f6b5c8e17e5a315587 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 8531011372f3b6c16e25c9c91fa49e878b0a28d9c8d0b56739e42136bacad768 |
| nikon-z-mc-105f28-f5.6-ref | 817dcdb72789e4f19aeb0834fdf38f2df1f9981feeda0e849a6fbe878516246e |
| nikon-z-mc-105f28-f5.6-photopic | 1954ed6aa33432e181f9fd106f948530837acf3981c484de154a624c9498c51f |
| nikon-z-mc-105f28-f5.6-best-ref | c083a9ad451157303b51e15cc837a6458e778df9940e23c2ef9b74bd6a6d67f9 |
| nikon-z-mc-105f28-f5.6-best-photopic | 78b7b0222e6524bef7d55aee358b93d5363d600153e44d6d8af4cc3fdd37c665 |
| nikon-z-mc-105f28-f11-ref | c7f1b99704f56d90a1f686179860d380dced25c8cd033526fcecd4702519f9e4 |
| nikon-z-mc-105f28-f11-photopic | 66c219236a3dab53372e71ec0933249c1f3a0cb1d7ceafa34405dbf42544a103 |
| nikon-z-mc-105f28-f11-best-ref | 731774161533fcf291c1c1269e0e88539a0dd9e65da2ae8f74753a0b5ca2b774 |
| nikon-z-mc-105f28-f11-best-photopic | 7c36e2f71e511338791089c2160a0f0729bebb1d35521a01e99f81628e3a4655 |
| nikon-z-135f18-plena-f5.6-ref | 2f48866c86a5c78c9d9985591e3093550306be61ca1b1467ece2a6624837935b |
| nikon-z-135f18-plena-f5.6-photopic | d3405bf3cc1609ad7ad77300cfc39b172ddc595ed32c4a7626c66cd7353d6fde |
| nikon-z-135f18-plena-f5.6-best-ref | 360b7b852f441111c8d5acb454934d8d59d4eca6b658012be793c9e01569543b |
| nikon-z-135f18-plena-f5.6-best-photopic | cf84ceaabd4254ec2fc9096ce284edbf9776b072cf55de2525e4164ea2c39914 |
| nikon-z-135f18-plena-f11-ref | 9370a359110296269721cb8c84b7071d063f75cc1e19f176fc6e2e3e747090cf |
| nikon-z-135f18-plena-f11-photopic | a6664a204e5bf0ca48289e51350f5c0e606260a662d0b29334b24c34c03ab468 |
| nikon-z-135f18-plena-f11-best-ref | e6cc666f0c9c00122578523ed519d8b34a1e9dff2427209471960455699891ec |
| nikon-z-135f18-plena-f11-best-photopic | 93e46690ec176b9d2633393b625aaf006e059e11893e23d34d82fc88b75b4084 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 199c2510c32fa327ab1821e2fab7968e7ad6a4bb2b9a9298f59fa94887b06bb2 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 4cf6d7133ad5498fa5397bb6e8998034b7d8882c33d66a5680e260f1f2363e85 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 8471bafaa095d48e703f204c34d8b0f411aaa31d1f1d70865eb3772e019aacbe |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 47a5da31cb8fe84438f6dc3d443dffceaa2edbe0025572c8875b9ebbb8a83ff1 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | f3fcc3b63cd7c8c3a567b5f318c8a9dd3e469e78af15979fd5edb6778d604839 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 767aa6f20ae7d3f4801e196910ff99f05e24ca2ed20524b0e6e626f82ba5af85 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | e8b060aaeb44cba02d576fc44c9725a7bd44cc6d4adb173931ddb86caf196c9b |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 4178d8f26ba49800c75581368bca19314aa614248502ad7f4ac8a59f57da305a |
| nikon-z-24-70f4s-open-ref-wide | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 0c1e3e17b791b8b76cc5311d51e8dbd6ad9592081d1f4e853b775cf8253d1f53 |
| nikon-z-24-70f4s-open-ref-tele | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| nikon-z-24-70f4s-open-photopic-wide | 392526a2d4fb6800be21455fb7097f75e53156a130b490f79830e62460359a12 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 88a749d4f75279b33492f61035d826b4688f7c9e5ccf3d92dbc7f9c9549ca91e |
| nikon-z-24-70f4s-open-photopic-tele | 9e3b47006624814732c91d238b73f183b938f21c947092003915ea16b13a4827 |
| nikon-z-24-70f4s-open-best-ref-wide | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | e96a55399921f347d7e4cc74cfb6866870a4ce088279506abff48b416df2f370 |
| nikon-z-24-70f4s-open-best-ref-tele | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| nikon-z-24-70f4s-open-best-photopic-wide | c3e2ff5ca8846d295ca192a631c924ad89fac42eca1b4c18770d8f5617b8c506 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | dde35e9fddfe63b8cad5485f93c17dae02b028d2da4dd0f847b5aecb6eb4202f |
| nikon-z-24-70f4s-open-best-photopic-tele | 744b809865d1a1116492bfbf856ab119ea41ab803108f9c981f69923f41cf76e |
| nikon-z-24-70f4s-f8-ref-wide | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | cfe08daed58c95d06787698fb20876419f0d64aeda8b760fcb3c39f5892f1a89 |
| nikon-z-24-70f4s-f8-ref-tele | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| nikon-z-24-70f4s-f8-photopic-wide | ab3760654d94804e8278e5cad2c61fac6237577dc6f556f1840b1c720c67ccc2 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | ea8482dd9fbeb8c91ac688c1229a4abd30e352a2e55818abc1e5ea30fae8a5a8 |
| nikon-z-24-70f4s-f8-photopic-tele | 3880b49fc9097685272f3f5f6b9410a3c721798228c33fa69503e366e3a28067 |
| nikon-z-24-70f4s-f8-best-ref-wide | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | c84d1fc5b9e9daa5909cc2530a508854046daba2153963653f5ff7f42ac3bdb5 |
| nikon-z-24-70f4s-f8-best-ref-tele | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 6882783f3706c89459ea475b03c5097f00f8e10b8f38f8c7a912789db7f9c183 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | b0a60930819cad6639b046939da301d87a82fd845e4c3aca8951a40bf4fdddb1 |
| nikon-z-24-70f4s-f8-best-photopic-tele | b3e22a7473a909ad089f72ea18ecbbea131ebcc8d3093090ae20e82ef40a8794 |
