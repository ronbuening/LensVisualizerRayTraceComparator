# Baseline of focus-stations: the ray checks

This file is the committed record of the ray checks of the suite focus-stations, as its baseline holds them: for every
run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every
pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and
wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so
`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no
ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the
engines are still those of the baseline. How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | focus-stations |
| Limits file | v25 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 193 engine files |
| optiland | optiland | 0.6.2.post234+ga9e544a2 | backend numpy, clean checkout, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 611 source files |
| reference-tracer | Reference tracer | 1 | 13 source files |

## Runs with a problem

| Run | Problem |
|---|---|
| certified-nikon-af-fisheye-nikkor-16mm-f28d-zoom0-focus1 | finite-conjugate-unavailable: focus position 0.44646544064147803 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom1-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0.5 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom2-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 1 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-panasonic-lumix-g-8mm-f35-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 511 | 511 | lv – optiland | 511 Pass | 511 Pass |
| Built system — `built-system` | `system.describe` | 511 | 511 | lv – reference-tracer | 511 Pass | 511 Pass |
| Built system — `built-system` | `system.describe` | 511 | 511 | optiland – reference-tracer | 511 Pass | 511 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 511 | 511 | lv – optiland | 511 Pass | 511 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 511 | 511 | lv – reference-tracer | 511 Pass | 511 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 511 | 511 | optiland – reference-tracer | 511 Pass | 511 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 510 | 1459 | lv – optiland | 508 Pass; 2 Fail | 1457 Pass; 2 Fail |
| Ray trace — `ray-trace` | `rays.trace` | 510 | 1459 | lv – reference-tracer | 510 Pass | 1459 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 510 | 1459 | optiland – reference-tracer | 508 Pass; 2 Fail | 1457 Pass; 2 Fail |
| Optical path — `optical-path` | `rays.trace` | 510 | 1459 | lv – optiland | 510 Pass | 1459 Pass |
| Optical path — `optical-path` | `rays.trace` | 510 | 1459 | lv – reference-tracer | 510 Pass | 1459 Pass |
| Optical path — `optical-path` | `rays.trace` | 510 | 1459 | optiland – reference-tracer | 510 Pass | 1459 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 510 | 1459 | lv – optiland | 510 Pass | 1459 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 510 | 1459 | lv – reference-tracer | 510 Pass | 1459 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 510 | 1459 | optiland – reference-tracer | 510 Pass | 1459 Pass |

## Failures, classified

A listed failure keeps its verdict, Fail; each failing figure keeps its class, the hash of its evidence, the entry of docs/gotchas.md that explains it and a command that reproduces it in one run.

| Run | Check | Engines | Figure | Class | Gotcha | Reproducer |
|---|---|---|---|---|---|---|
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | Ray trace — `ray-trace` | lv / optiland | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | Ray trace — `ray-trace` | optiland / reference-tracer | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | Ray trace — `ray-trace` | lv / optiland | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | Ray trace — `ray-trace` | optiland / reference-tracer | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 511 answered |
| Built system — `built-system` | optiland | 511 answered |
| Built system — `built-system` | reference-tracer | 511 answered |
| First-order data — `first-order` | lv | 511 answered |
| First-order data — `first-order` | optiland | 511 answered |
| First-order data — `first-order` | reference-tracer | 511 answered |
| Ray trace — `ray-trace` | lv | 510 answered |
| Ray trace — `ray-trace` | optiland | 510 answered |
| Ray trace — `ray-trace` | reference-tracer | 510 answered |
| Optical path — `optical-path` | lv | 510 answered |
| Optical path — `optical-path` | optiland | 510 answered |
| Optical path — `optical-path` | reference-tracer | 510 answered |
| Geometric MTF of the same rays — `geometric-mtf` | lv | 510 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 510 answered |
| Geometric MTF of the same rays — `geometric-mtf` | reference-tracer | 510 answered |

## Built system — `built-system`

Compares: Built layout, shape, aperture, index and sampled sag. Kind: held to a limit. Quantity asked of the engines: the system as built (`system.describe`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 6.04e-16 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | sample 6, surface 28 |
| lv – optiland | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 2.50e-12 | certified-fujifilm-gf-23mm-f4-zoom0-focus1 | sample 8, surface 17 |
| lv – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 4.32e-16 | certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | sample 7, surface 9 |
| lv – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.57e-12 | certified-fujifilm-gf-23mm-f4-zoom0-focus1 | sample 8, surface 17 |
| optiland – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 6.04e-16 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | sample 6, surface 28 |
| optiland – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 1.37e-12 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | sample 8, surface 26 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.53e-16 |
| certified-apo-lanthar-50f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.42e-16 | Pass: sag.maxScaled 3.20e-16 | Pass: sag.maxScaled 3.32e-16 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 3.51e-16 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 3.51e-16 |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.73e-16 |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.05e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.85e-16 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.06e-16 | Pass: sag.maxScaled 3.23e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.06e-16 | Pass: sag.maxScaled 3.23e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 1 | Pass: sag.maxScaled 3.06e-16 | Pass: sag.maxScaled 3.23e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.46e-16 | Pass: sag.maxScaled 2.38e-16 |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.99e-16 |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.21e-16 |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.45e-16 |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.75e-16 | Pass: sag.maxScaled 2.75e-16 | Pass: sag.maxScaled 3.95e-16 |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 3.28e-16 |
| certified-canon-fd-35-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 3.39e-16 | Pass: sag.maxScaled 2.12e-16 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 3.93e-16 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 3.93e-16 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 1 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 3.93e-16 |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.78e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-canon-rf-50-f12-l-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.22e-16 |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.89e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-canon-rf-85f2-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 2.21e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-canon-rf-85f2-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 2.21e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.30e-16 |
| certified-canon-rf100f28-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.82e-16 | Pass: sag.maxScaled 2.52e-16 |
| certified-canon-rf100f28-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.82e-16 | Pass: sag.maxScaled 2.52e-16 |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.39e-16 | Pass: sag.maxScaled 2.46e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.48e-16 | Pass: sag.maxScaled 3.96e-16 | Pass: sag.maxScaled 3.72e-16 |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 4.46e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 4.46e-16 |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.95e-16 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.58e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.58e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.58e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.02e-16 | Pass: sag.maxScaled 3.28e-16 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.02e-16 | Pass: sag.maxScaled 3.28e-16 |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.23e-16 | Pass: sag.maxScaled 2.23e-16 |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.23e-16 | Pass: sag.maxScaled 2.23e-16 |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 1.92e-16 |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 2.64e-16 |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.70e-16 | Pass: sag.maxScaled 2.63e-16 | Pass: sag.maxScaled 2.67e-16 |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.12e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 2.39e-16 | Pass: sag.maxScaled 2.39e-16 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.87e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.87e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 1 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 4.03e-16 | Pass: sag.maxScaled 5.92e-16 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.31e-16 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.31e-16 |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.57e-16 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 3.65e-16 |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.74e-16 | Pass: sag.maxScaled 3.74e-16 | Pass: sag.maxScaled 3.74e-16 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.20e-16 | Pass: sag.maxScaled 2.47e-16 | Pass: sag.maxScaled 2.90e-16 |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 2.84e-16 |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 3.76e-16 |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.78e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 1.65e-16 | Pass: sag.maxScaled 2.69e-16 |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.48e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 2.48e-16 |
| certified-fujifilm-xf50-f1-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.08e-16 | Pass: sag.maxScaled 2.99e-16 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.92e-16 | Pass: sag.maxScaled 1.64e-16 | Pass: sag.maxScaled 2.44e-16 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.92e-16 | Pass: sag.maxScaled 1.64e-16 | Pass: sag.maxScaled 2.44e-16 |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.83e-16 |
| certified-fujifilm-xf90f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-gf-120f4-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.64e-16 |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 3.46e-16 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.44e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.44e-16 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.44e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.44e-16 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.23e-16 | Pass: sag.maxScaled 3.50e-16 | Pass: sag.maxScaled 3.50e-16 |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 1.83e-16 | Pass: sag.maxScaled 3.21e-16 |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 1.83e-16 | Pass: sag.maxScaled 3.21e-16 |
| certified-konica-hexanon-60f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.68e-16 | Pass: sag.maxScaled 2.44e-16 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.92e-16 | Pass: sag.maxScaled 4.32e-16 | Pass: sag.maxScaled 2.92e-16 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.92e-16 | Pass: sag.maxScaled 4.32e-16 | Pass: sag.maxScaled 2.92e-16 |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 3.29e-16 |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.53e-16 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 3.67e-16 |
| certified-laowa-15f4-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.27e-16 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 2.30e-16 |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 3.60e-16 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.17e-16 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.17e-16 |
| certified-laowa-24f14-probe-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 2.56e-16 |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.25e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.44e-16 |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.25e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.44e-16 |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.94e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 2.10e-16 |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.23e-16 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.73e-16 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 2.73e-16 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.73e-16 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 2.73e-16 |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.45e-16 |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 1.69e-16 | Pass: sag.maxScaled 2.51e-16 |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.77e-16 | Pass: sag.maxScaled 2.23e-16 | Pass: sag.maxScaled 3.39e-16 |
| certified-leica-summilux-28f17-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.58e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.99e-16 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.66e-16 | Pass: sag.maxScaled 2.67e-16 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.66e-16 | Pass: sag.maxScaled 2.67e-16 |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.68e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 2.68e-16 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.14e-16 | Pass: sag.maxScaled 2.07e-16 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.14e-16 | Pass: sag.maxScaled 2.07e-16 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.14e-16 | Pass: sag.maxScaled 2.07e-16 |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 3.29e-16 |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.13e-16 | Pass: sag.maxScaled 2.29e-16 | Pass: sag.maxScaled 3.41e-16 |
| certified-minolta-af-100mm-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.17e-16 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 3.80e-16 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 3.80e-16 |
| certified-minolta-af-135mm-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.32e-16 | Pass: sag.maxScaled 2.32e-16 | Pass: sag.maxScaled 2.93e-16 |
| certified-minolta-af-20mm-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.29e-16 |
| certified-minolta-af-24mm-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.20e-16 | Pass: sag.maxScaled 3.42e-16 | Pass: sag.maxScaled 3.42e-16 |
| certified-minolta-af-300mm-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.32e-16 | Pass: sag.maxScaled 1.92e-16 | Pass: sag.maxScaled 3.84e-16 |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 4.39e-16 |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 3.21e-16 |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.41e-16 | Pass: sag.maxScaled 1.91e-16 | Pass: sag.maxScaled 3.41e-16 |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.89e-16 | Pass: sag.maxScaled 2.89e-16 | Pass: sag.maxScaled 2.27e-16 |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.15e-16 |
| certified-nikkor-28f14d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.45e-16 | Pass: sag.maxScaled 2.88e-16 |
| certified-nikkor-85f14d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.39e-16 | Pass: sag.maxScaled 4.18e-16 | Pass: sag.maxScaled 2.58e-16 |
| certified-nikkor-85f14g-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.86e-16 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.09e-16 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.09e-16 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.09e-16 |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.82e-16 |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.82e-16 |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.82e-16 |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.82e-16 |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.82e-16 |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 2.82e-16 |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.65e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.72e-16 |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.65e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.72e-16 |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.65e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.72e-16 |
| certified-nikkor-n-28f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 3.87e-16 |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.95e-16 |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.95e-16 |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 1.87e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 1.87e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 1.87e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 1.87e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-nikkor-z-28f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.98e-16 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 2.98e-16 |
| certified-nikkor-z-50f18s-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.00e-16 | Pass: sag.maxScaled 3.94e-16 | Pass: sag.maxScaled 3.28e-16 |
| certified-nikkor-z-70-200f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.95e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 3.18e-16 |
| certified-nikkor-z-70-200f28-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.95e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 3.18e-16 |
| certified-nikkor-z-70-200f28-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.95e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 3.18e-16 |
| certified-nikkor-z-85f18s-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.41e-16 | Pass: sag.maxScaled 2.04e-16 | Pass: sag.maxScaled 2.41e-16 |
| certified-nikkor-z50f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.54e-16 |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.93e-16 | Pass: sag.maxScaled 1.46e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 3.35e-16 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 3.35e-16 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.44e-16 | Pass: sag.maxScaled 2.12e-16 |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 1.99e-16 | Pass: sag.maxScaled 2.33e-16 |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 4.04e-16 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 3.69e-16 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 3.69e-16 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 1.99e-16 | Pass: sag.maxScaled 2.11e-16 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 1.99e-16 | Pass: sag.maxScaled 2.11e-16 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.85e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.50e-16 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.85e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.50e-16 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.50e-16 | Pass: sag.maxScaled 1.85e-16 | Pass: sag.maxScaled 2.79e-16 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.50e-16 | Pass: sag.maxScaled 1.85e-16 | Pass: sag.maxScaled 2.79e-16 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.12e-16 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.12e-16 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.33e-16 | Pass: sag.maxScaled 3.89e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.33e-16 | Pass: sag.maxScaled 3.89e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.33e-16 | Pass: sag.maxScaled 3.89e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.91e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.91e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.91e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 4.12e-16 | Pass: sag.maxScaled 2.17e-16 |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.61e-16 | Pass: sag.maxScaled 2.02e-16 |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.96e-16 | Pass: sag.maxScaled 2.10e-16 |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.96e-16 | Pass: sag.maxScaled 2.10e-16 |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.93e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 2.93e-16 |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.20e-16 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.20e-16 |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.73e-16 |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.88e-16 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.39e-16 | Pass: sag.maxScaled 3.77e-16 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.39e-16 | Pass: sag.maxScaled 3.77e-16 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.39e-16 | Pass: sag.maxScaled 3.77e-16 |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.03e-16 | Pass: sag.maxScaled 2.59e-16 | Pass: sag.maxScaled 3.03e-16 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.41e-16 | Pass: sag.maxScaled 2.41e-16 | Pass: sag.maxScaled 4.81e-16 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.41e-16 | Pass: sag.maxScaled 2.41e-16 | Pass: sag.maxScaled 4.81e-16 |
| certified-nikon-afs-28f14e-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 2.79e-16 | Pass: sag.maxScaled 4.33e-16 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.83e-16 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.83e-16 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.83e-16 |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.10e-16 | Pass: sag.maxScaled 2.33e-16 | Pass: sag.maxScaled 3.10e-16 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.37e-16 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.37e-16 |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.00e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.14e-16 |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 3.59e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 1.60e-16 | Pass: sag.maxScaled 2.11e-16 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 1.60e-16 | Pass: sag.maxScaled 2.11e-16 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 1.60e-16 | Pass: sag.maxScaled 2.11e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.16e-16 |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.13e-16 |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 3.87e-16 |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.53e-16 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.72e-16 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.84e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.84e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-micro-60f28g-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.78e-16 |
| certified-nikon-micro-60f28g-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.78e-16 |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.44e-16 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.99e-16 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.24e-16 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.24e-16 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.24e-16 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.25e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.25e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 4.10e-16 | Pass: sag.maxScaled 3.56e-16 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 4.10e-16 | Pass: sag.maxScaled 3.56e-16 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 4.10e-16 | Pass: sag.maxScaled 3.56e-16 |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.64e-16 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 3.64e-16 |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.22e-16 | Pass: sag.maxScaled 3.04e-16 | Pass: sag.maxScaled 4.11e-16 |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.31e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.48e-16 |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-nikon-z-58f095-noct-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 3.57e-16 | Pass: sag.maxScaled 3.57e-16 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.29e-16 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-nikon-z-mc-105f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| certified-nikon-z-mc-105f28-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.71e-16 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 3.77e-16 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.98e-16 | Pass: sag.maxScaled 3.14e-16 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.98e-16 | Pass: sag.maxScaled 3.14e-16 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.98e-16 | Pass: sag.maxScaled 3.14e-16 |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.59e-16 | Pass: sag.maxScaled 2.73e-16 | Pass: sag.maxScaled 3.65e-16 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.22e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.22e-16 | Pass: sag.maxScaled 2.28e-16 | Pass: sag.maxScaled 2.28e-16 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.22e-16 | Pass: sag.maxScaled 2.28e-16 | Pass: sag.maxScaled 2.28e-16 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.22e-16 | Pass: sag.maxScaled 2.28e-16 | Pass: sag.maxScaled 2.28e-16 |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.78e-16 | Pass: sag.maxScaled 2.78e-16 | Pass: sag.maxScaled 2.54e-16 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 3.58e-16 | Pass: sag.maxScaled 3.68e-16 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 1 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 3.58e-16 | Pass: sag.maxScaled 3.68e-16 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 1 | Pass: sag.maxScaled 2.86e-16 | Pass: sag.maxScaled 3.58e-16 | Pass: sag.maxScaled 3.68e-16 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.77e-16 | Pass: sag.maxScaled 3.60e-16 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.77e-16 | Pass: sag.maxScaled 3.60e-16 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.78e-16 | Pass: sag.maxScaled 2.94e-16 | Pass: sag.maxScaled 3.11e-16 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.78e-16 | Pass: sag.maxScaled 2.94e-16 | Pass: sag.maxScaled 3.11e-16 |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.47e-16 | Pass: sag.maxScaled 1.83e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.28e-16 | Pass: sag.maxScaled 2.28e-16 | Pass: sag.maxScaled 2.12e-16 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.16e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.74e-16 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.16e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.74e-16 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.16e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.74e-16 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.11e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.31e-16 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.11e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.31e-16 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.11e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.31e-16 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.23e-16 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | 1 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 1 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | 1 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.60e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.71e-16 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | Pass: sag.maxScaled 2.60e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.71e-16 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | Pass: sag.maxScaled 2.60e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.71e-16 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.39e-16 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.39e-16 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.39e-16 |
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.51e-16 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 3.21e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 3.21e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 1 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 3.21e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.48e-16 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 3.71e-16 |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.93e-16 | Pass: sag.maxScaled 2.93e-16 |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.57e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.57e-16 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 1.93e-16 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.97e-16 | Pass: sag.maxScaled 1.93e-16 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.93e-16 | Pass: sag.maxScaled 2.93e-16 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.93e-16 | Pass: sag.maxScaled 2.93e-16 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.93e-16 | Pass: sag.maxScaled 2.93e-16 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.42e-16 | Pass: sag.maxScaled 3.42e-16 | Pass: sag.maxScaled 2.42e-16 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.42e-16 | Pass: sag.maxScaled 3.42e-16 | Pass: sag.maxScaled 2.42e-16 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.42e-16 | Pass: sag.maxScaled 3.42e-16 | Pass: sag.maxScaled 2.42e-16 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 1.71e-16 |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.62e-16 | Pass: sag.maxScaled 2.81e-16 | Pass: sag.maxScaled 3.09e-16 |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.40e-16 | Pass: sag.maxScaled 4.25e-16 | Pass: sag.maxScaled 4.25e-16 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.40e-16 | Pass: sag.maxScaled 4.25e-16 | Pass: sag.maxScaled 4.25e-16 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.40e-16 | Pass: sag.maxScaled 4.25e-16 | Pass: sag.maxScaled 4.25e-16 |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 1.61e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.85e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.76e-16 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.50e-16 | Pass: sag.maxScaled 3.50e-16 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.50e-16 | Pass: sag.maxScaled 3.50e-16 |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.90e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 3.32e-16 |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 2.35e-16 |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.35e-16 |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 3.67e-16 |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 2.23e-16 | Pass: sag.maxScaled 2.61e-16 |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 3.23e-16 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.53e-16 | Pass: sag.maxScaled 2.53e-16 |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.36e-16 | Pass: sag.maxScaled 1.67e-16 | Pass: sag.maxScaled 2.50e-16 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.80e-16 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.80e-16 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.80e-16 |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.29e-16 | Pass: sag.maxScaled 2.29e-16 | Pass: sag.maxScaled 3.16e-16 |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.45e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.60e-16 |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.46e-16 | Pass: sag.maxScaled 3.34e-16 |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.46e-16 | Pass: sag.maxScaled 3.34e-16 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.89e-16 | Pass: sag.maxScaled 2.47e-16 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.89e-16 | Pass: sag.maxScaled 2.47e-16 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.89e-16 | Pass: sag.maxScaled 2.47e-16 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.74e-16 | Pass: sag.maxScaled 2.31e-16 | Pass: sag.maxScaled 2.78e-16 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.74e-16 | Pass: sag.maxScaled 2.31e-16 | Pass: sag.maxScaled 2.78e-16 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.72e-16 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.72e-16 |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.72e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 4.09e-16 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.59e-16 | Pass: sag.maxScaled 2.71e-16 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.59e-16 | Pass: sag.maxScaled 2.71e-16 |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.92e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.92e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.77e-16 | Pass: sag.maxScaled 3.93e-16 |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.77e-16 | Pass: sag.maxScaled 3.93e-16 |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 2.77e-16 | Pass: sag.maxScaled 3.93e-16 |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.47e-16 | Pass: sag.maxScaled 2.80e-16 | Pass: sag.maxScaled 2.47e-16 |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.23e-16 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 2.52e-16 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 4.00e-16 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.49e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.61e-16 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.65e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.30e-16 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.65e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.30e-16 |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.21e-16 | Pass: sag.maxScaled 2.41e-16 | Pass: sag.maxScaled 2.85e-16 |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.50e-16 | Pass: sag.maxScaled 2.33e-16 | Pass: sag.maxScaled 3.63e-16 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.50e-16 | Pass: sag.maxScaled 2.33e-16 | Pass: sag.maxScaled 3.63e-16 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.50e-16 | Pass: sag.maxScaled 2.33e-16 | Pass: sag.maxScaled 3.63e-16 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 3.00e-16 |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.61e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.95e-16 |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.10e-16 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 3.89e-16 |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.47e-16 | Pass: sag.maxScaled 3.15e-16 |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | 1 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 3.54e-16 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.08e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.89e-16 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.60e-16 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 3.61e-16 |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.51e-16 |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.42e-16 | Pass: sag.maxScaled 1.47e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.88e-16 | Pass: sag.maxScaled 3.60e-16 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.33e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.83e-16 |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 3.36e-16 | Pass: sag.maxScaled 3.94e-16 |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.32e-16 |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.26e-16 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.72e-16 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 4.22e-16 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.72e-16 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 4.22e-16 |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 1.99e-16 | Pass: sag.maxScaled 3.35e-16 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.40e-16 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 3.58e-16 |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 1 | Pass: sag.maxScaled 1.65e-16 | Pass: sag.maxScaled 2.04e-16 | Pass: sag.maxScaled 2.31e-16 |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.77e-16 | Pass: sag.maxScaled 1.77e-16 | Pass: sag.maxScaled 1.71e-16 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.26e-16 | Pass: sag.maxScaled 3.81e-16 | Pass: sag.maxScaled 3.26e-16 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.63e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 5.45e-16 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.63e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 5.45e-16 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.63e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 5.45e-16 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.48e-16 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.48e-16 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 1 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 3.48e-16 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | 1 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 1 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 1 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-sigma-85f14-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 4.12e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 4.12e-16 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.67e-16 | Pass: sag.maxScaled 3.66e-16 |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.11e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.91e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.91e-16 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 4.21e-16 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 4.21e-16 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 4.21e-16 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 2.32e-16 | Pass: sag.maxScaled 3.66e-16 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 2.32e-16 | Pass: sag.maxScaled 3.66e-16 |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.44e-16 | Pass: sag.maxScaled 2.77e-16 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.44e-16 | Pass: sag.maxScaled 2.77e-16 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.85e-16 | Pass: sag.maxScaled 1.72e-16 | Pass: sag.maxScaled 2.46e-16 |
| certified-sigma-art-40-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.82e-16 | Pass: sag.maxScaled 3.15e-16 | Pass: sag.maxScaled 3.15e-16 |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.83e-16 | Pass: sag.maxScaled 3.55e-16 |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.99e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 1.99e-16 |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 1.73e-16 | Pass: sag.maxScaled 1.54e-16 |
| certified-sigma-dp2m-30f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sonnar-e-24f18-za-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 2.09e-16 | Pass: sag.maxScaled 2.94e-16 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.04e-16 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.10e-16 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.04e-16 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.10e-16 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.04e-16 | Pass: sag.maxScaled 2.11e-16 | Pass: sag.maxScaled 3.10e-16 |
| certified-sony-e-20f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.87e-16 | Pass: sag.maxScaled 2.80e-16 | Pass: sag.maxScaled 2.87e-16 |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 2.80e-16 | Pass: sag.maxScaled 2.80e-16 |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.24e-16 | Pass: sag.maxScaled 2.80e-16 | Pass: sag.maxScaled 2.80e-16 |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.70e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.70e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.68e-16 | Pass: sag.maxScaled 2.79e-16 | Pass: sag.maxScaled 3.25e-16 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.61e-16 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.61e-16 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.61e-16 |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 1 | Pass: sag.maxScaled 4.10e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 3.19e-16 |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | 1 | Pass: sag.maxScaled 4.10e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 3.19e-16 |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 1 | Pass: sag.maxScaled 4.10e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 3.19e-16 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 4.13e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 4.13e-16 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 4.13e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 4.13e-16 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 4.13e-16 | Pass: sag.maxScaled 2.05e-16 | Pass: sag.maxScaled 4.13e-16 |
| certified-sony-fe-24-f28-g-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.52e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.30e-16 |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.61e-16 | Pass: sag.maxScaled 2.34e-16 | Pass: sag.maxScaled 2.49e-16 |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.53e-16 | Pass: sag.maxScaled 3.98e-16 | Pass: sag.maxScaled 3.97e-16 |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.53e-16 | Pass: sag.maxScaled 3.98e-16 | Pass: sag.maxScaled 3.97e-16 |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.53e-16 | Pass: sag.maxScaled 3.98e-16 | Pass: sag.maxScaled 3.97e-16 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.73e-16 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.73e-16 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.30e-16 | Pass: sag.maxScaled 3.73e-16 |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.25e-16 | Pass: sag.maxScaled 3.20e-16 |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.79e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 3.79e-16 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.23e-16 | Pass: sag.maxScaled 3.37e-16 | Pass: sag.maxScaled 3.23e-16 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 5.54e-16 | Pass: sag.maxScaled 3.69e-16 | Pass: sag.maxScaled 3.85e-16 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 5.54e-16 | Pass: sag.maxScaled 3.69e-16 | Pass: sag.maxScaled 3.85e-16 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 5.54e-16 | Pass: sag.maxScaled 3.69e-16 | Pass: sag.maxScaled 3.85e-16 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 2.03e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 2.03e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.35e-16 | Pass: sag.maxScaled 2.03e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.59e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 3.23e-16 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.59e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 3.23e-16 |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.26e-16 | Pass: sag.maxScaled 3.28e-16 | Pass: sag.maxScaled 3.26e-16 |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.26e-16 | Pass: sag.maxScaled 3.28e-16 | Pass: sag.maxScaled 3.26e-16 |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.26e-16 | Pass: sag.maxScaled 3.28e-16 | Pass: sag.maxScaled 3.26e-16 |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.90e-16 |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.90e-16 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.18e-16 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.18e-16 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.18e-16 |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.68e-16 | Pass: sag.maxScaled 1.19e-16 | Pass: sag.maxScaled 3.68e-16 |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 1 | Pass: sag.maxScaled 6.04e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 6.04e-16 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 1 | Pass: sag.maxScaled 6.04e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 6.04e-16 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 1 | Pass: sag.maxScaled 6.04e-16 | Pass: sag.maxScaled 2.19e-16 | Pass: sag.maxScaled 6.04e-16 |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.21e-16 | Pass: sag.maxScaled 2.73e-16 |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.21e-16 | Pass: sag.maxScaled 2.73e-16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 3.99e-16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 1 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 3.99e-16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 1 | Pass: sag.maxScaled 2.99e-16 | Pass: sag.maxScaled 2.64e-16 | Pass: sag.maxScaled 3.99e-16 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 1.94e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.76e-16 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.51e-16 | Pass: sag.maxScaled 3.76e-16 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 4.01e-16 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 2.08e-16 | Pass: sag.maxScaled 4.01e-16 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 3.51e-16 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 3.51e-16 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | 1 | Pass: sag.maxScaled 3.51e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 3.51e-16 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.31e-16 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.86e-16 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.31e-16 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.86e-16 |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.52e-16 | Pass: sag.maxScaled 2.51e-16 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.92e-16 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 2.92e-16 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-ultron-28f2-asph-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.79e-16 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 3.06e-16 |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 4.05e-16 | Pass: sag.maxScaled 4.05e-16 |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.06e-16 | Pass: sag.maxScaled 3.06e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.33e-16 | Pass: sag.maxScaled 1.92e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.03e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.74e-16 |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 2.15e-16 |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.31e-16 | Pass: sag.maxScaled 3.03e-16 | Pass: sag.maxScaled 3.03e-16 |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 1.84e-16 | Pass: sag.maxScaled 2.69e-16 |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.74e-16 | Pass: sag.maxScaled 2.50e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.88e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.99e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.88e-16 |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.18e-16 | Pass: sag.maxScaled 2.14e-16 | Pass: sag.maxScaled 3.18e-16 |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.18e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.11e-16 | Pass: sag.maxScaled 3.11e-16 |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.54e-16 | Pass: sag.maxScaled 2.54e-16 | Pass: sag.maxScaled 2.01e-16 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.13e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.13e-16 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.13e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.13e-16 |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.27e-16 |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.27e-16 |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 3.54e-16 |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.98e-16 | Pass: sag.maxScaled 2.32e-16 | Pass: sag.maxScaled 2.32e-16 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.17e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.17e-16 | Pass: sag.maxScaled 3.33e-16 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 4.14e-16 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.24e-16 | Pass: sag.maxScaled 2.07e-16 | Pass: sag.maxScaled 4.14e-16 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.21e-16 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.21e-16 | Pass: sag.maxScaled 3.27e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 1.87e-16 | Pass: sag.maxScaled 2.22e-16 |
| certified-zeiss-batis-18f28-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.10e-16 | Pass: sag.maxScaled 2.76e-16 | Pass: sag.maxScaled 2.45e-16 |
| certified-zeiss-batis-85f18-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.83e-16 | Pass: sag.maxScaled 2.83e-16 |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 1 | Pass: sag.maxScaled 2.68e-16 | Pass: sag.maxScaled 2.66e-16 | Pass: sag.maxScaled 3.37e-16 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | 1 | Pass: sag.maxScaled 1.91e-16 | Pass: sag.maxScaled 1.91e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | 1 | Pass: sag.maxScaled 1.91e-16 | Pass: sag.maxScaled 1.91e-16 | Pass: sag.maxScaled 3.24e-16 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | 1 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 2.69e-16 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 1 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 2.69e-16 |

## First-order data — `first-order`

Compares: First-order quantities and pupils. Kind: held to a limit. Quantity asked of the engines: first-order data (`paraxial.first-order`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.86e-11 | certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | line 0, quantity frontFocalZ |
| lv – optiland | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 5.98e-11 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 3.47e-10 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 7.58e-12 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilSemiDiameter |
| lv – optiland | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 4.40e-11 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 5.46e-12 | certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | line 0, quantity frontFocalZ |
| lv – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 2.69e-11 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.56e-10 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 3.56e-12 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 2.07e-11 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.86e-11 | certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | line 0, quantity frontFocalZ |
| optiland – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 3.29e-11 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilZ |
| optiland – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.91e-10 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilZ |
| optiland – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 4.01e-12 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 2.33e-11 | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | line 0, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm |
| certified-apo-lanthar-50f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.99e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 6.57e-14 mm |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 3.23e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.97e-13 mm | Pass: pupilZ.maxScaled 3.98e-13 mm | Pass: pupilZ.maxScaled 1.99e-13 mm |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 1.56e-13 mm | Pass: pupilZ.maxScaled 2.27e-13 mm |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 6.25e-13 mm | Pass: pupilZ.maxScaled 2.84e-13 mm | Pass: pupilZ.maxScaled 9.09e-13 mm |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 1 | Pass: pupilZ.maxScaled 7.96e-13 mm | Pass: pupilZ.maxScaled 1.25e-12 mm | Pass: pupilZ.maxScaled 2.05e-12 mm |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-13 mm | Pass: firstOrder.maxAbs 3.55e-13 mm | Pass: pupilZ.maxScaled 1.02e-12 mm |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 2.66e-15 mm |
| certified-canon-fd-35-f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilRadius.maxScaled 1.07e-14 mm |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 1 | Pass: pupilRadius.maxScaled 1.78e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 1.33e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-canon-rf-50-f12-l-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.62e-14 mm |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.09e-14 mm | Pass: firstOrder.maxAbs 1.47e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-canon-rf-85f2-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.23e-14 mm | Pass: firstOrder.maxAbs 3.60e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-canon-rf-85f2-macro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.82e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 9.24e-14 mm |
| certified-canon-rf100f28-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-canon-rf100f28-macro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 4.17e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 4.55e-13 mm | Pass: firstOrder.maxAbs 4.26e-13 mm |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | 1 | Pass: firstOrder.maxAbs 2.05e-12 mm | Pass: firstOrder.maxAbs 4.77e-12 mm | Pass: firstOrder.maxAbs 2.73e-12 mm |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 3.13e-13 mm | Pass: firstOrder.maxAbs 5.12e-13 mm | Pass: firstOrder.maxAbs 1.99e-13 mm |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.53e-14 mm | Pass: firstOrder.maxAbs 1.52e-14 mm |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.99e-13 mm |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm | Pass: pupilZ.maxScaled 1.14e-13 mm |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 3.91e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-fujifilm-xf50-f1-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.12e-13 mm | Pass: pupilZ.maxScaled 3.13e-13 mm | Pass: pupilZ.maxScaled 1.99e-13 mm |
| certified-fujifilm-xf90f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| certified-gf-120f4-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: pupilZ.maxScaled 1.14e-13 mm |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 1.60e-14 mm |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 3.91e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-konica-hexanon-60f12-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 1.99e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 3.91e-13 mm |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |
| certified-laowa-15f4-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 7.11e-15 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-laowa-24f14-probe-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.55e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 2.47e-13 mm |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.87e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.33e-14 mm | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | 1 | Pass: pupilRadius.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilRadius.maxScaled 3.55e-14 mm |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 2.56e-13 mm | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 3.41e-13 mm | Pass: firstOrder.maxAbs 6.82e-13 mm | Pass: firstOrder.maxAbs 7.39e-13 mm |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.44e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-leica-summilux-28f17-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: firstOrder.maxAbs 1.24e-14 mm |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.22e-12 mm | Pass: pupilZ.maxScaled 1.71e-12 mm | Pass: pupilZ.maxScaled 5.12e-13 mm |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 2.44e-12 mm | Pass: pupilZ.maxScaled 2.61e-12 mm | Pass: pupilZ.maxScaled 1.71e-13 mm |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.38e-14 mm | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.49e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-minolta-af-100mm-f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 9.59e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 8.81e-13 mm | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: pupilZ.maxScaled 1.02e-12 mm |
| certified-minolta-af-135mm-f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.93e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-minolta-af-20mm-f28-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-minolta-af-24mm-f28-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: pupilZ.maxScaled 2.49e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-minolta-af-300mm-f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.09e-13 mm | Pass: firstOrder.maxAbs 5.68e-13 mm | Pass: firstOrder.maxAbs 3.41e-13 mm |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.09e-13 mm | Pass: firstOrder.maxAbs 1.36e-12 mm | Pass: firstOrder.maxAbs 2.27e-12 mm |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-13 mm |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-13 mm | Pass: firstOrder.maxAbs 1.07e-13 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-nikkor-28f14d-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikkor-85f14d-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-nikkor-85f14g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 2.03e-13 mm |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | 1 | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: firstOrder.maxAbs 5.12e-13 mm | Pass: firstOrder.maxAbs 8.53e-13 mm |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 1.02e-12 mm | Pass: pupilZ.maxScaled 9.09e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-nikkor-n-28f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.58e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 5.83e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.95e-13 mm | Pass: firstOrder.maxAbs 2.04e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | 1 | Pass: firstOrder.maxAbs 7.82e-13 mm | Pass: firstOrder.maxAbs 6.39e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm |
| certified-nikkor-z-28f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.24e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-nikkor-z-50f18s-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.33e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikkor-z-70-200f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-nikkor-z-70-200f28-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 7.73e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-nikkor-z-70-200f28-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 2.42e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm |
| certified-nikkor-z-85f18s-zoom0-focus1 | 1 | Pass: pupilRadius.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikkor-z50f12-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.24e-14 mm |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.16e-12 mm | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: pupilZ.maxScaled 2.16e-12 mm |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.09e-12 mm | Pass: pupilZ.maxScaled 1.14e-12 mm | Pass: pupilZ.maxScaled 2.96e-12 mm |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.13e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 5.15e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: firstOrder.maxAbs 9.10e-15 mm |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 2.49e-14 mm | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: firstOrder.maxAbs 9.10e-15 mm |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 3.91e-14 mm |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.99e-13 mm | Pass: firstOrder.maxAbs 7.19e-14 mm | Pass: pupilZ.maxScaled 1.99e-13 mm |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.48e-12 mm | Pass: firstOrder.maxAbs 3.98e-13 mm | Pass: firstOrder.maxAbs 1.25e-12 mm |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 5.68e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 4.55e-13 mm |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.09e-13 mm | Pass: pupilZ.maxScaled 1.59e-12 mm | Pass: pupilZ.maxScaled 2.27e-12 mm |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.32e-12 mm | Pass: firstOrder.maxAbs 6.82e-13 mm | Pass: pupilZ.maxScaled 4.32e-12 mm |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-12 mm | Pass: pupilZ.maxScaled 1.33e-12 mm | Pass: firstOrder.maxAbs 4.55e-13 mm |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.46e-11 mm | Pass: firstOrder.maxAbs 5.00e-12 mm | Pass: firstOrder.maxAbs 9.55e-12 mm |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 6.82e-12 mm | Pass: pupilZ.maxScaled 2.89e-12 mm | Pass: firstOrder.maxAbs 7.28e-12 mm |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.55e-13 mm | Pass: pupilZ.maxScaled 2.84e-13 mm | Pass: pupilZ.maxScaled 7.39e-13 mm |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 3.41e-13 mm | Pass: pupilZ.maxScaled 2.84e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm |
| certified-nikon-afs-28f14e-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.02e-12 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: pupilZ.maxScaled 1.02e-12 mm |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 5.00e-12 mm | Pass: firstOrder.maxAbs 5.61e-13 mm | Pass: pupilZ.maxScaled 4.77e-12 mm |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 4.13e-12 mm | Pass: firstOrder.maxAbs 1.69e-12 mm | Pass: pupilZ.maxScaled 2.68e-12 mm |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 7.96e-13 mm | Pass: firstOrder.maxAbs 5.68e-13 mm | Pass: pupilZ.maxScaled 6.25e-13 mm |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.55e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: pupilZ.maxScaled 4.55e-13 mm |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 1.28e-13 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | 1 | Pass: firstOrder.maxAbs 9.24e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.02e-12 mm | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: pupilZ.maxScaled 9.09e-13 mm |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilRadius.maxScaled 4.26e-14 mm |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 1.28e-13 mm |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 2.84e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 2.27e-13 mm |
| certified-nikon-micro-60f28g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-nikon-micro-60f28g-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.50e-12 mm | Pass: firstOrder.maxAbs 9.09e-13 mm | Pass: firstOrder.maxAbs 7.25e-13 mm |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 3.24e-12 mm | Pass: firstOrder.maxAbs 2.05e-12 mm | Pass: firstOrder.maxAbs 1.19e-12 mm |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-12 mm | Pass: firstOrder.maxAbs 5.46e-12 mm | Pass: pupilZ.maxScaled 3.98e-13 mm |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.53e-14 mm |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.62e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.95e-14 mm |
| certified-nikon-z-58f095-noct-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 3.02e-14 mm | Pass: firstOrder.maxAbs 3.73e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 5.95e-13 mm | Pass: firstOrder.maxAbs 1.90e-13 mm | Pass: firstOrder.maxAbs 4.05e-13 mm |
| certified-nikon-z-mc-105f28-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.80e-14 mm |
| certified-nikon-z-mc-105f28-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: pupilZ.maxScaled 1.42e-13 mm |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 1.56e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 7.11e-15 mm |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 3.27e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 1 | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 1.14e-13 mm |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: pupilZ.maxScaled 9.95e-14 mm |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 9.95e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: pupilRadius.maxScaled 5.68e-14 mm |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.62e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.28e-13 mm | Pass: pupilZ.maxScaled 1.56e-13 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 6.82e-13 mm | Pass: pupilZ.maxScaled 4.55e-13 mm | Pass: pupilZ.maxScaled 2.27e-13 mm |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 5.26e-13 mm | Pass: pupilZ.maxScaled 3.27e-13 mm | Pass: pupilZ.maxScaled 1.99e-13 mm |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 1 | Pass: pupilZ.maxScaled 5.26e-13 mm | Pass: pupilZ.maxScaled 3.27e-13 mm | Pass: pupilZ.maxScaled 1.99e-13 mm |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-13 mm | Pass: pupilZ.maxScaled 4.55e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.96e-14 mm | Pass: firstOrder.maxAbs 1.60e-14 mm |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 1 | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 2.56e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.88e-15 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 3.38e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 1.99e-13 mm |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 1 | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 1 | Pass: pupilZ.maxScaled 1.42e-12 mm | Pass: pupilZ.maxScaled 6.82e-13 mm | Pass: pupilZ.maxScaled 7.39e-13 mm |
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.24e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 5.33e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 1 | Pass: pupilZ.maxScaled 3.98e-13 mm | Pass: pupilZ.maxScaled 2.56e-13 mm | Pass: pupilZ.maxScaled 1.42e-13 mm |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilRadius.maxScaled 1.42e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.79e-14 mm |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.82e-14 mm |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 7.82e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm | Pass: pupilZ.maxScaled 9.95e-14 mm |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 4.50e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-13 mm | Pass: firstOrder.maxAbs 1.85e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 7.39e-13 mm | Pass: firstOrder.maxAbs 6.54e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.28e-13 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 5.98e-11 mm | Pass: pupilZ.maxScaled 2.69e-11 mm | Pass: pupilZ.maxScaled 3.29e-11 mm |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.72e-14 mm | Pass: firstOrder.maxAbs 2.15e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: firstOrder.maxAbs 2.04e-14 mm |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.63e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 1 | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 1 | Pass: firstOrder.maxAbs 6.25e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.99e-13 mm | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: pupilZ.maxScaled 1.28e-13 mm |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 2.98e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 1.51e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 8.88e-15 mm |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm | Pass: firstOrder.maxAbs 1.51e-14 mm |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 8.88e-14 mm |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 7.03e-13 mm | Pass: firstOrder.maxAbs 4.55e-13 mm | Pass: firstOrder.maxAbs 2.49e-13 mm |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilRadius.maxScaled 2.13e-14 mm |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 1.42e-13 mm |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.85e-13 mm | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 1.28e-13 mm |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: pupilZ.maxScaled 1.99e-13 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: pupilZ.maxScaled 1.71e-13 mm |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: pupilZ.maxScaled 2.56e-13 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.88e-15 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 7.82e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.88e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 6.82e-13 mm | Pass: pupilZ.maxScaled 1.36e-12 mm | Pass: pupilZ.maxScaled 6.82e-13 mm |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.86e-11 mm | Pass: pupilZ.maxScaled 5.68e-13 mm | Pass: firstOrder.maxAbs 2.86e-11 mm |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.59e-12 mm | Pass: firstOrder.maxAbs 3.18e-12 mm | Pass: firstOrder.maxAbs 1.59e-12 mm |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.15e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | Pass: pupilRadius.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.04e-14 mm | Pass: pupilRadius.maxScaled 1.78e-14 mm |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.91e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm | Pass: firstOrder.maxAbs 6.75e-14 mm |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.39e-13 mm | Pass: firstOrder.maxAbs 1.23e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 4.69e-13 mm | Pass: firstOrder.maxAbs 2.44e-13 mm |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: firstOrder.maxAbs 2.13e-13 mm | Pass: firstOrder.maxAbs 1.30e-13 mm |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 1 | Pass: firstOrder.maxAbs 3.69e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 1 | Pass: firstOrder.maxAbs 1.59e-12 mm | Pass: firstOrder.maxAbs 3.98e-13 mm | Pass: firstOrder.maxAbs 1.25e-12 mm |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | 1 | Pass: firstOrder.maxAbs 8.17e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 1 | Pass: firstOrder.maxAbs 1.23e-13 mm | Pass: firstOrder.maxAbs 8.35e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | 1 | Pass: pupilZ.maxScaled 3.13e-13 mm | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 1 | Pass: firstOrder.maxAbs 7.39e-13 mm | Pass: firstOrder.maxAbs 1.82e-12 mm | Pass: firstOrder.maxAbs 2.56e-12 mm |
| certified-sigma-85f14-art-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 3.60e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 2.27e-13 mm |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 1 | Pass: firstOrder.maxAbs 3.41e-13 mm | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 1 | Pass: firstOrder.maxAbs 1.36e-12 mm | Pass: firstOrder.maxAbs 2.27e-12 mm | Pass: pupilZ.maxScaled 1.82e-12 mm |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 2.13e-13 mm | Pass: pupilZ.maxScaled 2.42e-13 mm |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: firstOrder.maxAbs 9.95e-14 mm |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: pupilZ.maxScaled 2.84e-13 mm |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.93e-12 mm | Pass: pupilZ.maxScaled 1.48e-12 mm | Pass: pupilZ.maxScaled 4.55e-13 mm |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.31e-12 mm | Pass: pupilZ.maxScaled 2.46e-12 mm | Pass: pupilZ.maxScaled 3.78e-12 mm |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-sigma-art-40-f14-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 3.55e-15 mm |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-sigma-dp2m-30f28-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.60e-14 mm | Pass: firstOrder.maxAbs 2.31e-14 mm |
| certified-sonnar-e-24f18-za-zoom0-focus1 | 1 | Pass: pupilRadius.maxScaled 1.78e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilRadius.maxScaled 1.07e-14 mm |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.35e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 2.63e-13 mm |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 5.06e-13 mm | Pass: firstOrder.maxAbs 4.65e-13 mm | Pass: pupilZ.maxScaled 3.41e-13 mm |
| certified-sony-e-20f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 3.55e-15 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 1.71e-13 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.91e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 3.42e-14 mm |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 4.62e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 9.24e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-sony-fe-24-f28-g-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.15e-14 mm |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.19e-12 mm | Pass: firstOrder.maxAbs 3.41e-12 mm | Pass: firstOrder.maxAbs 4.77e-12 mm |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.27e-12 mm | Pass: firstOrder.maxAbs 4.55e-12 mm | Pass: firstOrder.maxAbs 2.27e-12 mm |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 7.73e-12 mm | Pass: firstOrder.maxAbs 1.59e-12 mm | Pass: firstOrder.maxAbs 6.37e-12 mm |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-12 mm | Pass: firstOrder.maxAbs 4.55e-13 mm | Pass: firstOrder.maxAbs 1.25e-12 mm |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.09e-12 mm | Pass: pupilZ.maxScaled 6.82e-13 mm | Pass: firstOrder.maxAbs 4.32e-12 mm |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.02e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.21e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.81e-13 mm |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.21e-13 mm |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 4.41e-13 mm | Pass: firstOrder.maxAbs 4.69e-13 mm | Pass: firstOrder.maxAbs 1.56e-13 mm |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 4.83e-13 mm | Pass: firstOrder.maxAbs 3.98e-13 mm | Pass: pupilZ.maxScaled 1.42e-13 mm |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 1.14e-13 mm |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 3.98e-13 mm | Pass: pupilZ.maxScaled 4.55e-13 mm |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 7.11e-15 mm |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 1 | Pass: firstOrder.maxAbs 8.79e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.14e-13 mm |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 2.42e-13 mm |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 1 | Pass: firstOrder.maxAbs 3.27e-13 mm | Pass: firstOrder.maxAbs 6.25e-13 mm | Pass: firstOrder.maxAbs 5.12e-13 mm |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 6.04e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 7.82e-14 mm | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-13 mm | Pass: firstOrder.maxAbs 3.84e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | 1 | Pass: pupilZ.maxScaled 1.28e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: pupilZ.maxScaled 6.39e-14 mm |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 3.06e-13 mm | Pass: firstOrder.maxAbs 3.34e-13 mm |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 7.11e-14 mm |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 1.49e-13 mm |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: pupilZ.maxScaled 1.71e-13 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 5.68e-14 mm |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 2.27e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 1.42e-13 mm | Pass: firstOrder.maxAbs 2.84e-13 mm |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-13 mm | Pass: firstOrder.maxAbs 3.06e-13 mm | Pass: firstOrder.maxAbs 3.13e-13 mm |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | 1 | Pass: firstOrder.maxAbs 1.48e-12 mm | Pass: firstOrder.maxAbs 2.84e-12 mm | Pass: firstOrder.maxAbs 1.36e-12 mm |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.99e-13 mm | Pass: pupilZ.maxScaled 5.12e-13 mm | Pass: pupilZ.maxScaled 5.68e-13 mm |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 4.32e-12 mm | Pass: pupilZ.maxScaled 4.55e-13 mm | Pass: pupilZ.maxScaled 4.77e-12 mm |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 2.27e-13 mm | Pass: pupilZ.maxScaled 1.42e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.20e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 3.20e-14 mm |
| certified-ultron-28f2-asph-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 1.07e-13 mm |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 3.91e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.97e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.99e-15 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 4.44e-15 mm | Pass: firstOrder.maxAbs 5.33e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 3.20e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.24e-14 mm | Pass: firstOrder.maxAbs 1.28e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.07e-14 mm | Pass: firstOrder.maxAbs 7.99e-15 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.14e-13 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.14e-13 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 1.71e-13 mm |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 1 | Pass: pupilZ.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilRadius.maxScaled 1.07e-14 mm |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.49e-14 mm | Pass: pupilZ.maxScaled 7.11e-15 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 1 | Pass: pupilZ.maxScaled 1.78e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 3.02e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 1 | Pass: pupilRadius.maxScaled 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilRadius.maxScaled 2.13e-14 mm |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 3.75e-14 mm | Pass: firstOrder.maxAbs 4.11e-14 mm |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 2.84e-14 mm |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| certified-zeiss-batis-18f28-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 7.11e-14 mm | Pass: firstOrder.maxAbs 8.53e-14 mm | Pass: firstOrder.maxAbs 2.49e-14 mm |
| certified-zeiss-batis-85f18-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 9.95e-14 mm | Pass: firstOrder.maxAbs 7.11e-14 mm |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 1.24e-14 mm | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 1.78e-14 mm |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 3.55e-15 mm | Pass: firstOrder.maxAbs 1.07e-14 mm |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 3.55e-14 mm | Pass: pupilZ.maxScaled 5.68e-14 mm |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: pupilZ.maxScaled 4.97e-14 mm |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 2.51e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323, surface 35 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 9.98e-12 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 267 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 2.62e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 28 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1295597 | — | — |
| lv – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.45e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323, surface 35 |
| lv – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 5.03e-12 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 1.51e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1295597 | — | — |
| optiland – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 3.96e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323, surface 35 |
| optiland – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.38e-11 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| optiland – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 4.13e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 28 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1295597 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.78e-13 mm | Pass: landing.maxDistance 1.54e-13 mm | Pass: landing.maxDistance 1.95e-13 mm | 2849 / 226 / 0 | 2849 / 226 / 0 | 2849 / 226 / 0 |
| certified-apo-lanthar-50f2-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.49e-13 mm | 2669 / 406 / 0 | 2669 / 406 / 0 | 2669 / 406 / 0 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.75e-13 mm | Pass: landing.maxDistance 9.30e-14 mm | Pass: landing.maxDistance 1.71e-13 mm | 2823 / 252 / 0 | 2823 / 252 / 0 | 2823 / 252 / 0 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.91e-13 mm | Pass: landing.maxDistance 9.95e-14 mm | Pass: landing.maxDistance 1.56e-13 mm | 2841 / 234 / 0 | 2841 / 234 / 0 | 2841 / 234 / 0 |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.31e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 1.31e-13 mm | 2261 / 814 / 0 | 2261 / 814 / 0 | 2261 / 814 / 0 |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.41e-13 mm | Pass: landing.maxDistance 1.36e-13 mm | Pass: landing.maxDistance 1.40e-13 mm | 2749 / 326 / 0 | 2749 / 326 / 0 | 2749 / 326 / 0 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.74e-13 mm | Pass: landing.maxDistance 1.63e-13 mm | Pass: landing.maxDistance 1.99e-13 mm | 2307 / 768 / 0 | 2307 / 768 / 0 | 2307 / 768 / 0 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.26e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 2.98e-13 mm | 1975 / 1100 / 0 | 1975 / 1100 / 0 | 1975 / 1100 / 0 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 2 | Pass: landing.maxDistance 2.88e-13 mm | Pass: landing.maxDistance 1.81e-13 mm | Pass: landing.maxDistance 2.67e-13 mm | 1160 / 890 / 0 | 1160 / 890 / 0 | 1160 / 890 / 0 |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.92e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 1.70e-13 mm | 2315 / 760 / 0 | 2315 / 760 / 0 | 2315 / 760 / 0 |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.89e-13 mm | Pass: hits.maxDistance 9.43e-13 mm | Pass: hits.maxDistance 9.45e-13 mm | 2553 / 522 / 0 | 2553 / 522 / 0 | 2553 / 522 / 0 |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.37e-13 mm | Pass: landing.maxDistance 9.77e-14 mm | Pass: landing.maxDistance 1.36e-13 mm | 2555 / 520 / 0 | 2555 / 520 / 0 | 2555 / 520 / 0 |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.39e-14 mm | Pass: hits.maxDistance 9.05e-13 mm | Pass: hits.maxDistance 9.06e-13 mm | 1951 / 1124 / 0 | 1951 / 1124 / 0 | 1951 / 1124 / 0 |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.29e-13 mm | Pass: landing.maxDistance 6.95e-14 mm | Pass: landing.maxDistance 1.11e-13 mm | 2727 / 348 / 0 | 2727 / 348 / 0 | 2727 / 348 / 0 |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.62e-14 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2945 / 130 / 0 | 2945 / 130 / 0 | 2945 / 130 / 0 |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.59e-13 mm | Pass: hits.maxDistance 9.57e-13 mm | Pass: hits.maxDistance 9.58e-13 mm | 2877 / 198 / 0 | 2877 / 198 / 0 | 2877 / 198 / 0 |
| certified-canon-fd-35-f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.93e-14 mm | Pass: landing.maxDistance 8.15e-14 mm | Pass: landing.maxDistance 1.11e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 8.53e-13 mm | Pass: hits.maxDistance 8.53e-13 mm | 1798 / 252 / 0 | 1798 / 252 / 0 | 1798 / 252 / 0 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 2 | Pass: landing.maxDistance 1.09e-13 mm | Pass: hits.maxDistance 8.02e-13 mm | Pass: hits.maxDistance 8.00e-13 mm | 1786 / 264 / 0 | 1786 / 264 / 0 | 1786 / 264 / 0 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 2 | Pass: landing.maxDistance 1.66e-13 mm | Pass: hits.maxDistance 8.94e-13 mm | Pass: hits.maxDistance 8.91e-13 mm | 1780 / 270 / 0 | 1780 / 270 / 0 | 1780 / 270 / 0 |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.00e-14 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 2291 / 784 / 0 | 2291 / 784 / 0 | 2291 / 784 / 0 |
| certified-canon-rf-50-f12-l-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.70e-13 mm | Pass: hits.maxDistance 9.71e-13 mm | 2349 / 726 / 0 | 2349 / 726 / 0 | 2349 / 726 / 0 |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.69e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2293 / 782 / 0 | 2293 / 782 / 0 | 2293 / 782 / 0 |
| certified-canon-rf-85f2-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.06e-14 mm | Pass: landing.maxDistance 8.68e-14 mm | Pass: hits.maxDistance 1.01e-13 mm | 2635 / 440 / 0 | 2635 / 440 / 0 | 2635 / 440 / 0 |
| certified-canon-rf-85f2-macro-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 7.84e-14 mm | Pass: hits.maxDistance 1.28e-13 mm | 2833 / 242 / 0 | 2833 / 242 / 0 | 2833 / 242 / 0 |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.16e-13 mm | Pass: hits.maxDistance 1.19e-12 mm | Pass: hits.maxDistance 1.20e-12 mm | 2511 / 564 / 0 | 2511 / 564 / 0 | 2511 / 564 / 0 |
| certified-canon-rf100f28-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.09e-13 mm | Pass: landing.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 2.42e-13 mm | 2633 / 442 / 0 | 2633 / 442 / 0 | 2633 / 442 / 0 |
| certified-canon-rf100f28-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.70e-13 mm | Pass: landing.maxDistance 1.85e-13 mm | Pass: landing.maxDistance 2.74e-13 mm | 3003 / 72 / 0 | 3003 / 72 / 0 | 3003 / 72 / 0 |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.75e-13 mm | Pass: landing.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 1.89e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.32e-13 mm | Pass: landing.maxDistance 1.40e-13 mm | Pass: landing.maxDistance 1.87e-13 mm | 2621 / 454 / 0 | 2621 / 454 / 0 | 2621 / 454 / 0 |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.61e-12 mm | Pass: landing.maxDistance 1.68e-12 mm | Pass: landing.maxDistance 1.78e-12 mm | 2675 / 400 / 0 | 2675 / 400 / 0 | 2675 / 400 / 0 |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.89e-13 mm | Pass: hits.maxDistance 9.61e-13 mm | Pass: hits.maxDistance 9.61e-13 mm | 2717 / 358 / 0 | 2717 / 358 / 0 | 2717 / 358 / 0 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.15e-11 mm | Pass: landing.maxDistance 1.15e-11 mm | Pass: hits.maxDistance 1.29e-12 mm | 2226 / 849 / 0 | 2226 / 849 / 0 | 2226 / 849 / 0 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.05e-12 mm | Pass: landing.maxDistance 1.19e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 3 | Pass: landing.maxDistance 2.91e-12 mm | Pass: landing.maxDistance 3.01e-12 mm | Pass: landing.maxDistance 2.10e-12 mm | 2973 / 102 / 0 | 2973 / 102 / 0 | 2973 / 102 / 0 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.49e-13 mm | Pass: landing.maxDistance 2.24e-13 mm | Pass: landing.maxDistance 3.33e-13 mm | 2875 / 200 / 0 | 2875 / 200 / 0 | 2875 / 200 / 0 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | 3 | Pass: landing.maxDistance 3.85e-13 mm | Pass: landing.maxDistance 3.07e-13 mm | Pass: landing.maxDistance 3.62e-13 mm | 3041 / 34 / 0 | 3041 / 34 / 0 | 3041 / 34 / 0 |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 9.65e-13 mm | 2385 / 690 / 0 | 2385 / 690 / 0 | 2385 / 690 / 0 |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.25e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.27e-12 mm | 2489 / 586 / 0 | 2489 / 586 / 0 | 2489 / 586 / 0 |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.59e-13 mm | Pass: hits.maxDistance 9.88e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | 2759 / 316 / 0 | 2759 / 316 / 0 | 2759 / 316 / 0 |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 3 | Pass: landing.maxDistance 4.97e-12 mm | Pass: landing.maxDistance 3.47e-12 mm | Pass: landing.maxDistance 2.98e-12 mm | 2689 / 386 / 0 | 2689 / 386 / 0 | 2689 / 386 / 0 |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2425 / 650 / 0 | 2425 / 650 / 0 | 2425 / 650 / 0 |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | 3 | Pass: hits.maxDistance 3.23e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 1971 / 1104 / 0 | 1971 / 1104 / 0 | 1971 / 1104 / 0 |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.21e-13 mm | Pass: hits.maxDistance 9.52e-13 mm | Pass: hits.maxDistance 9.52e-13 mm | 2589 / 486 / 0 | 2589 / 486 / 0 | 2589 / 486 / 0 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 3 | Fail: mask.mismatches 26 rays | Pass: landing.maxDistance 1.51e-10 mm | Fail: mask.mismatches 26 rays | 2773 / 302 / 0 | 2773 / 288 / 14 | 2773 / 302 / 0 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 3 | Pass: landing.maxDistance 2.07e-11 mm | Pass: landing.maxDistance 1.50e-11 mm | Pass: landing.maxDistance 3.18e-11 mm | 2811 / 264 / 0 | 2811 / 264 / 0 | 2811 / 264 / 0 |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | Pass: landing.maxDistance 2.04e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | 2853 / 222 / 0 | 2853 / 222 / 0 | 2853 / 222 / 0 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.57e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2417 / 658 / 0 | 2417 / 658 / 0 | 2417 / 658 / 0 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2405 / 670 / 0 | 2405 / 670 / 0 | 2405 / 670 / 0 |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.53e-11 mm | Pass: hits.maxDistance 1.11e-11 mm | Pass: hits.maxDistance 7.63e-12 mm | 2356 / 719 / 0 | 2356 / 719 / 0 | 2356 / 719 / 0 |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | Pass: hits.maxDistance 5.86e-13 mm | Pass: hits.maxDistance 8.28e-13 mm | Pass: hits.maxDistance 8.34e-13 mm | 2082 / 993 / 0 | 2082 / 993 / 0 | 2082 / 993 / 0 |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.62e-13 mm | Pass: landing.maxDistance 1.48e-13 mm | Pass: hits.maxDistance 1.85e-13 mm | 2711 / 364 / 0 | 2711 / 364 / 0 | 2711 / 364 / 0 |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2533 / 542 / 0 | 2533 / 542 / 0 | 2533 / 542 / 0 |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | 3 | Fail: mask.mismatches 2 rays | Pass: landing.maxDistance 3.52e-12 mm | Fail: mask.mismatches 2 rays | 2535 / 540 / 0 | 2535 / 520 / 20 | 2535 / 540 / 0 |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.20e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.20e-12 mm | 2477 / 598 / 0 | 2477 / 596 / 2 | 2477 / 598 / 0 |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | 2537 / 538 / 0 | 2537 / 538 / 0 | 2537 / 538 / 0 |
| certified-fujifilm-xf50-f1-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.08e-12 mm | Pass: hits.maxDistance 1.31e-12 mm | Pass: landing.maxDistance 2.16e-12 mm | 2325 / 750 / 0 | 2325 / 750 / 0 | 2325 / 750 / 0 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 9.89e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | 2905 / 170 / 0 | 2905 / 170 / 0 | 2905 / 170 / 0 |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.22e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2821 / 254 / 0 | 2821 / 254 / 0 | 2821 / 254 / 0 |
| certified-fujifilm-xf90f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.93e-14 mm | Pass: landing.maxDistance 7.93e-14 mm | Pass: landing.maxDistance 8.86e-14 mm | 2919 / 156 / 0 | 2919 / 156 / 0 | 2919 / 156 / 0 |
| certified-gf-120f4-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.34e-13 mm | Pass: landing.maxDistance 1.29e-13 mm | Pass: landing.maxDistance 1.82e-13 mm | 2207 / 868 / 0 | 2207 / 868 / 0 | 2207 / 868 / 0 |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.91e-13 mm | Pass: landing.maxDistance 2.01e-13 mm | Pass: landing.maxDistance 2.77e-13 mm | 2651 / 424 / 0 | 2651 / 424 / 0 | 2651 / 424 / 0 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.86e-14 mm | Pass: landing.maxDistance 7.62e-14 mm | Pass: landing.maxDistance 1.08e-13 mm | 2451 / 624 / 0 | 2451 / 624 / 0 | 2451 / 624 / 0 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 1.18e-13 mm | Pass: landing.maxDistance 1.61e-13 mm | 2733 / 342 / 0 | 2733 / 342 / 0 | 2733 / 342 / 0 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.21e-13 mm | Pass: landing.maxDistance 1.11e-12 mm | Pass: landing.maxDistance 1.20e-12 mm | 2751 / 324 / 0 | 2751 / 324 / 0 | 2751 / 324 / 0 |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.78e-14 mm | Pass: hits.maxDistance 6.04e-14 mm | Pass: hits.maxDistance 7.82e-14 mm | 2489 / 586 / 0 | 2489 / 586 / 0 | 2489 / 586 / 0 |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | 3 | Pass: hits.maxDistance 8.53e-14 mm | Pass: hits.maxDistance 6.78e-14 mm | Pass: hits.maxDistance 9.24e-14 mm | 2653 / 422 / 0 | 2653 / 422 / 0 | 2653 / 422 / 0 |
| certified-konica-hexanon-60f12-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.27e-14 mm | Pass: landing.maxDistance 7.15e-14 mm | Pass: landing.maxDistance 8.82e-14 mm | 2445 / 630 / 0 | 2445 / 630 / 0 | 2445 / 630 / 0 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.05e-13 mm | Pass: landing.maxDistance 7.83e-14 mm | Pass: landing.maxDistance 1.25e-13 mm | 2563 / 512 / 0 | 2563 / 512 / 0 | 2563 / 512 / 0 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | 2 | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 9.46e-14 mm | Pass: landing.maxDistance 1.35e-13 mm | 1464 / 586 / 0 | 1464 / 586 / 0 | 1464 / 586 / 0 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.08e-13 mm | Pass: landing.maxDistance 1.35e-13 mm | Pass: landing.maxDistance 2.16e-13 mm | 2833 / 242 / 0 | 2833 / 242 / 0 | 2833 / 242 / 0 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.56e-13 mm | Pass: landing.maxDistance 1.97e-13 mm | Pass: landing.maxDistance 3.00e-13 mm | 2859 / 216 / 0 | 2859 / 216 / 0 | 2859 / 216 / 0 |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.61e-13 mm | Pass: landing.maxDistance 1.02e-13 mm | Pass: landing.maxDistance 1.56e-13 mm | 2815 / 260 / 0 | 2815 / 260 / 0 | 2815 / 260 / 0 |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | 2140 / 935 / 0 | 2140 / 935 / 0 | 2140 / 935 / 0 |
| certified-laowa-15f4-macro-zoom0-focus1 | 1 | Pass: landing.maxDistance 8.19e-14 mm | Pass: landing.maxDistance 4.74e-14 mm | Pass: landing.maxDistance 1.07e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.98e-13 mm | Pass: landing.maxDistance 1.54e-12 mm | Pass: landing.maxDistance 1.73e-12 mm | 2135 / 940 / 0 | 2135 / 934 / 6 | 2135 / 940 / 0 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.96e-13 mm | Pass: landing.maxDistance 1.54e-13 mm | Pass: landing.maxDistance 2.07e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.99e-13 mm | Pass: landing.maxDistance 1.98e-13 mm | Pass: landing.maxDistance 2.10e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-laowa-24f14-probe-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.02e-12 mm | Pass: landing.maxDistance 2.32e-13 mm | Pass: landing.maxDistance 9.89e-13 mm | 2395 / 680 / 0 | 2395 / 680 / 0 | 2395 / 680 / 0 |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.44e-13 mm | Pass: landing.maxDistance 1.49e-13 mm | Pass: landing.maxDistance 2.20e-13 mm | 2697 / 378 / 0 | 2697 / 378 / 0 | 2697 / 378 / 0 |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.51e-13 mm | Pass: landing.maxDistance 1.43e-13 mm | Pass: landing.maxDistance 3.43e-13 mm | 2863 / 212 / 0 | 2863 / 212 / 0 | 2863 / 212 / 0 |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.27e-13 mm | Pass: landing.maxDistance 1.04e-13 mm | Pass: landing.maxDistance 1.29e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.64e-13 mm | Pass: landing.maxDistance 1.59e-13 mm | Pass: landing.maxDistance 1.63e-13 mm | 2965 / 110 / 0 | 2965 / 110 / 0 | 2965 / 110 / 0 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 3 | Pass: hits.maxDistance 2.02e-13 mm | Pass: landing.maxDistance 1.47e-13 mm | Pass: hits.maxDistance 1.71e-13 mm | 2829 / 246 / 0 | 2829 / 246 / 0 | 2829 / 246 / 0 |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.36e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: landing.maxDistance 1.33e-12 mm | 2251 / 824 / 0 | 2251 / 824 / 0 | 2251 / 824 / 0 |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.90e-13 mm | Pass: hits.maxDistance 9.90e-13 mm | 2433 / 642 / 0 | 2433 / 642 / 0 | 2433 / 642 / 0 |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | 2 | Pass: landing.maxDistance 5.58e-14 mm | Pass: hits.maxDistance 9.33e-13 mm | Pass: hits.maxDistance 9.30e-13 mm | 1970 / 80 / 0 | 1970 / 80 / 0 | 1970 / 80 / 0 |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | 2 | Pass: landing.maxDistance 6.31e-14 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 1976 / 74 / 0 | 1976 / 74 / 0 | 1976 / 74 / 0 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.06e-13 mm | Pass: hits.maxDistance 1.70e-13 mm | Pass: landing.maxDistance 1.95e-13 mm | 2335 / 740 / 0 | 2335 / 740 / 0 | 2335 / 740 / 0 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | 3 | Pass: hits.maxDistance 2.46e-13 mm | Pass: landing.maxDistance 1.52e-13 mm | Pass: landing.maxDistance 2.35e-13 mm | 2677 / 398 / 0 | 2677 / 398 / 0 | 2677 / 398 / 0 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 3 | Pass: landing.maxDistance 2.42e-13 mm | Pass: landing.maxDistance 2.15e-13 mm | Pass: landing.maxDistance 2.86e-13 mm | 2897 / 178 / 0 | 2897 / 178 / 0 | 2897 / 178 / 0 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 2947 / 128 / 0 | 2947 / 128 / 0 | 2947 / 128 / 0 |
| certified-leica-summilux-28f17-zoom0-focus1 | 3 | Pass: landing.maxDistance 6.43e-14 mm | Pass: hits.maxDistance 9.69e-13 mm | Pass: hits.maxDistance 9.74e-13 mm | 2074 / 1001 / 0 | 2074 / 1001 / 0 | 2074 / 1001 / 0 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | Pass: hits.maxDistance 2.70e-12 mm | Pass: hits.maxDistance 1.98e-12 mm | Pass: hits.maxDistance 2.66e-12 mm | 2531 / 544 / 0 | 2531 / 544 / 0 | 2531 / 544 / 0 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | Pass: landing.maxDistance 2.84e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 1918 / 132 / 0 | 1918 / 132 / 0 | 1918 / 132 / 0 |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.78e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2209 / 866 / 0 | 2209 / 866 / 0 | 2209 / 866 / 0 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.53e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2517 / 558 / 0 | 2517 / 558 / 0 | 2517 / 558 / 0 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 3 | Pass: landing.maxDistance 2.56e-13 mm | Pass: hits.maxDistance 9.93e-13 mm | Pass: hits.maxDistance 9.79e-13 mm | 2973 / 102 / 0 | 2973 / 102 / 0 | 2973 / 102 / 0 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | 3 | Pass: landing.maxDistance 3.42e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 9.84e-13 mm | 3021 / 54 / 0 | 3021 / 54 / 0 | 3021 / 54 / 0 |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.71e-13 mm | Pass: landing.maxDistance 1.30e-13 mm | Pass: landing.maxDistance 1.85e-13 mm | 2795 / 280 / 0 | 2795 / 280 / 0 | 2795 / 280 / 0 |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.35e-13 mm | Pass: landing.maxDistance 9.97e-14 mm | Pass: landing.maxDistance 1.30e-13 mm | 2883 / 192 / 0 | 2883 / 192 / 0 | 2883 / 192 / 0 |
| certified-minolta-af-100mm-f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.00e-13 mm | Pass: landing.maxDistance 8.71e-14 mm | Pass: landing.maxDistance 1.10e-13 mm | 2549 / 526 / 0 | 2549 / 526 / 0 | 2549 / 526 / 0 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 7.89e-14 mm | Pass: landing.maxDistance 1.45e-13 mm | 2317 / 758 / 0 | 2317 / 758 / 0 | 2317 / 758 / 0 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.02e-13 mm | Pass: landing.maxDistance 1.67e-13 mm | Pass: landing.maxDistance 1.87e-13 mm | 2393 / 682 / 0 | 2393 / 682 / 0 | 2393 / 682 / 0 |
| certified-minolta-af-135mm-f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.60e-13 mm | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 1.64e-13 mm | 2895 / 180 / 0 | 2895 / 180 / 0 | 2895 / 180 / 0 |
| certified-minolta-af-20mm-f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.59e-14 mm | Pass: landing.maxDistance 9.24e-14 mm | Pass: landing.maxDistance 1.28e-13 mm | 2761 / 314 / 0 | 2761 / 314 / 0 | 2761 / 314 / 0 |
| certified-minolta-af-24mm-f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.24e-14 mm | Pass: landing.maxDistance 5.72e-14 mm | Pass: landing.maxDistance 7.82e-14 mm | 2487 / 588 / 0 | 2487 / 588 / 0 | 2487 / 588 / 0 |
| certified-minolta-af-300mm-f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.31e-13 mm | Pass: landing.maxDistance 2.03e-13 mm | Pass: landing.maxDistance 2.78e-13 mm | 2783 / 292 / 0 | 2783 / 292 / 0 | 2783 / 292 / 0 |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.00e-13 mm | Pass: landing.maxDistance 2.77e-13 mm | Pass: landing.maxDistance 2.64e-13 mm | 2775 / 300 / 0 | 2775 / 300 / 0 | 2775 / 300 / 0 |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.80e-14 mm | Pass: landing.maxDistance 5.71e-14 mm | Pass: landing.maxDistance 9.98e-14 mm | 2143 / 932 / 0 | 2143 / 932 / 0 | 2143 / 932 / 0 |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.47e-13 mm | Pass: landing.maxDistance 3.56e-13 mm | Pass: landing.maxDistance 3.19e-13 mm | 2779 / 296 / 0 | 2779 / 296 / 0 | 2779 / 296 / 0 |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.38e-13 mm | Pass: landing.maxDistance 1.38e-13 mm | Pass: landing.maxDistance 1.45e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.41e-13 mm | Pass: landing.maxDistance 1.13e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | 2083 / 992 / 0 | 2083 / 992 / 0 | 2083 / 992 / 0 |
| certified-nikkor-28f14d-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.59e-13 mm | Pass: hits.maxDistance 8.24e-13 mm | Pass: hits.maxDistance 8.38e-13 mm | 2455 / 620 / 0 | 2455 / 620 / 0 | 2455 / 620 / 0 |
| certified-nikkor-85f14d-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: landing.maxDistance 8.02e-14 mm | Pass: landing.maxDistance 1.40e-13 mm | 2877 / 198 / 0 | 2877 / 198 / 0 | 2877 / 198 / 0 |
| certified-nikkor-85f14g-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.49e-13 mm | Pass: landing.maxDistance 8.69e-14 mm | Pass: landing.maxDistance 1.49e-13 mm | 2633 / 442 / 0 | 2633 / 442 / 0 | 2633 / 442 / 0 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.50e-13 mm | Pass: hits.maxDistance 9.03e-13 mm | Pass: hits.maxDistance 9.19e-13 mm | 2016 / 34 / 0 | 2016 / 34 / 0 | 2016 / 34 / 0 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.44e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2907 / 168 / 0 | 2907 / 168 / 0 | 2907 / 168 / 0 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 2 | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | 2020 / 30 / 0 | 2020 / 30 / 0 | 2020 / 30 / 0 |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | 2 | Pass: hits.maxDistance 8.00e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | Pass: hits.maxDistance 9.28e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | 1 | Pass: hits.maxDistance 7.39e-13 mm | Pass: hits.maxDistance 9.49e-13 mm | Pass: hits.maxDistance 9.49e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | 3 | Pass: hits.maxDistance 9.47e-13 mm | Pass: hits.maxDistance 8.74e-13 mm | Pass: hits.maxDistance 9.44e-13 mm | 2933 / 142 / 0 | 2933 / 142 / 0 | 2933 / 142 / 0 |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | 2 | Pass: hits.maxDistance 9.36e-13 mm | Pass: hits.maxDistance 8.10e-13 mm | Pass: hits.maxDistance 9.40e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | 3 | Pass: hits.maxDistance 3.58e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2875 / 200 / 0 | 2875 / 200 / 0 | 2875 / 200 / 0 |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | 3 | Pass: hits.maxDistance 2.12e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | 2877 / 198 / 0 | 2877 / 198 / 0 | 2877 / 198 / 0 |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.22e-13 mm | Pass: landing.maxDistance 2.00e-13 mm | Pass: landing.maxDistance 3.40e-13 mm | 2773 / 302 / 0 | 2773 / 302 / 0 | 2773 / 302 / 0 |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | 3 | Pass: landing.maxDistance 4.08e-13 mm | Pass: landing.maxDistance 2.34e-13 mm | Pass: landing.maxDistance 4.55e-13 mm | 2865 / 210 / 0 | 2865 / 210 / 0 | 2865 / 210 / 0 |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | 3 | Pass: landing.maxDistance 4.34e-13 mm | Pass: landing.maxDistance 2.06e-13 mm | Pass: landing.maxDistance 3.91e-13 mm | 2927 / 148 / 0 | 2927 / 148 / 0 | 2927 / 148 / 0 |
| certified-nikkor-n-28f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 6.24e-14 mm | Pass: landing.maxDistance 1.14e-13 mm | 2569 / 506 / 0 | 2569 / 506 / 0 | 2569 / 506 / 0 |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | 3 | Pass: hits.maxDistance 2.56e-13 mm | Pass: hits.maxDistance 1.54e-13 mm | Pass: hits.maxDistance 2.97e-13 mm | 2775 / 300 / 0 | 2775 / 300 / 0 | 2775 / 300 / 0 |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | 3 | Pass: hits.maxDistance 3.35e-13 mm | Pass: hits.maxDistance 1.75e-13 mm | Pass: hits.maxDistance 2.86e-13 mm | 2749 / 326 / 0 | 2749 / 326 / 0 | 2749 / 326 / 0 |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.34e-13 mm | Pass: hits.maxDistance 9.69e-13 mm | Pass: hits.maxDistance 9.83e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | 3 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.91e-13 mm | 3059 / 16 / 0 | 3059 / 16 / 0 | 3059 / 16 / 0 |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 3 | Pass: hits.maxDistance 8.95e-13 mm | Pass: hits.maxDistance 9.57e-13 mm | Pass: hits.maxDistance 9.72e-13 mm | 3035 / 40 / 0 | 3035 / 40 / 0 | 3035 / 40 / 0 |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | 3 | Pass: hits.maxDistance 9.74e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 9.97e-13 mm | 2877 / 198 / 0 | 2877 / 198 / 0 | 2877 / 198 / 0 |
| certified-nikkor-z-28f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.01e-13 mm | Pass: hits.maxDistance 9.62e-13 mm | Pass: hits.maxDistance 9.59e-13 mm | 2797 / 278 / 0 | 2797 / 278 / 0 | 2797 / 278 / 0 |
| certified-nikkor-z-50f18s-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.38e-13 mm | Pass: hits.maxDistance 9.30e-13 mm | Pass: hits.maxDistance 9.23e-13 mm | 2805 / 270 / 0 | 2805 / 270 / 0 | 2805 / 270 / 0 |
| certified-nikkor-z-70-200f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 9.45e-13 mm | 2631 / 444 / 0 | 2631 / 444 / 0 | 2631 / 444 / 0 |
| certified-nikkor-z-70-200f28-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 9.53e-13 mm | 2587 / 488 / 0 | 2587 / 488 / 0 | 2587 / 488 / 0 |
| certified-nikkor-z-70-200f28-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2531 / 544 / 0 | 2531 / 544 / 0 | 2531 / 544 / 0 |
| certified-nikkor-z-85f18s-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 9.26e-14 mm | Pass: landing.maxDistance 1.21e-13 mm | 2869 / 206 / 0 | 2869 / 206 / 0 | 2869 / 206 / 0 |
| certified-nikkor-z50f12-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2395 / 680 / 0 | 2395 / 680 / 0 | 2395 / 680 / 0 |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | 3 | Pass: direction.maxAbs 3.22e-15 | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | 2589 / 486 / 0 | 2589 / 486 / 0 | 2589 / 486 / 0 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.92e-14 mm | Pass: landing.maxDistance 4.20e-14 mm | Pass: landing.maxDistance 5.43e-14 mm | 2831 / 244 / 0 | 2831 / 244 / 0 | 2831 / 244 / 0 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 3 | Pass: landing.maxDistance 5.44e-14 mm | Pass: landing.maxDistance 4.64e-14 mm | Pass: landing.maxDistance 4.92e-14 mm | 2873 / 202 / 0 | 2873 / 202 / 0 | 2873 / 202 / 0 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 3 | Pass: landing.maxDistance 5.15e-14 mm | Pass: hits.maxDistance 9.93e-13 mm | Pass: hits.maxDistance 9.93e-13 mm | 3065 / 10 / 0 | 3065 / 10 / 0 | 3065 / 10 / 0 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 3 | Pass: direction.maxAbs 4.77e-15 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 3043 / 32 / 0 | 3043 / 32 / 0 | 3043 / 32 / 0 |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 1.08e-13 mm | Pass: landing.maxDistance 1.47e-13 mm | 2641 / 434 / 0 | 2641 / 434 / 0 | 2641 / 434 / 0 |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.02e-13 mm | Pass: landing.maxDistance 2.25e-13 mm | Pass: landing.maxDistance 3.04e-13 mm | 2245 / 830 / 0 | 2245 / 830 / 0 | 2245 / 830 / 0 |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.02e-13 mm | Pass: landing.maxDistance 2.37e-13 mm | Pass: landing.maxDistance 4.06e-13 mm | 2393 / 682 / 0 | 2393 / 682 / 0 | 2393 / 682 / 0 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.14e-13 mm | Pass: landing.maxDistance 1.38e-13 mm | Pass: landing.maxDistance 1.90e-13 mm | 2951 / 124 / 0 | 2951 / 124 / 0 | 2951 / 124 / 0 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.03e-13 mm | Pass: landing.maxDistance 1.53e-13 mm | Pass: landing.maxDistance 2.46e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 7.47e-14 mm | Pass: landing.maxDistance 1.01e-13 mm | 2763 / 312 / 0 | 2763 / 312 / 0 | 2763 / 312 / 0 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 3 | Pass: landing.maxDistance 8.74e-14 mm | Pass: landing.maxDistance 8.26e-14 mm | Pass: landing.maxDistance 1.04e-13 mm | 2555 / 520 / 0 | 2555 / 520 / 0 | 2555 / 520 / 0 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | 3 | Pass: landing.maxDistance 7.96e-14 mm | Pass: landing.maxDistance 6.41e-14 mm | Pass: landing.maxDistance 7.55e-14 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 3 | Pass: landing.maxDistance 8.96e-14 mm | Pass: landing.maxDistance 7.12e-14 mm | Pass: landing.maxDistance 8.48e-14 mm | 2739 / 336 / 0 | 2739 / 336 / 0 | 2739 / 336 / 0 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.02e-14 mm | Pass: hits.maxDistance 9.90e-13 mm | Pass: hits.maxDistance 9.98e-13 mm | 2675 / 400 / 0 | 2675 / 400 / 0 | 2675 / 400 / 0 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: hits.maxDistance 9.88e-13 mm | Pass: hits.maxDistance 9.88e-13 mm | 2553 / 522 / 0 | 2553 / 522 / 0 | 2553 / 522 / 0 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.45e-14 mm | Pass: landing.maxDistance 7.26e-14 mm | Pass: landing.maxDistance 9.09e-14 mm | 2377 / 698 / 0 | 2377 / 698 / 0 | 2377 / 698 / 0 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 6.42e-14 mm | Pass: landing.maxDistance 1.32e-13 mm | 2399 / 676 / 0 | 2399 / 676 / 0 | 2399 / 676 / 0 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.09e-13 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 2028 / 22 / 0 | 2028 / 22 / 0 | 2028 / 22 / 0 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | 2 | Pass: landing.maxDistance 1.35e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2030 / 20 / 0 | 2030 / 20 / 0 | 2030 / 20 / 0 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 2 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.71e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | 2030 / 20 / 0 | 2030 / 20 / 0 | 2030 / 20 / 0 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 2 | Pass: hits.maxDistance 5.69e-14 mm | Pass: hits.maxDistance 3.20e-13 mm | Pass: hits.maxDistance 3.20e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | 3 | Pass: landing.maxDistance 7.34e-14 mm | Pass: hits.maxDistance 9.45e-13 mm | Pass: hits.maxDistance 9.45e-13 mm | 3037 / 38 / 0 | 3037 / 38 / 0 | 3037 / 38 / 0 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 3 | Pass: landing.maxDistance 8.95e-14 mm | Pass: hits.maxDistance 9.77e-13 mm | Pass: hits.maxDistance 9.77e-13 mm | 3053 / 22 / 0 | 3053 / 22 / 0 | 3053 / 22 / 0 |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2471 / 604 / 0 | 2471 / 604 / 0 | 2471 / 604 / 0 |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.26e-13 mm | Pass: hits.maxDistance 9.35e-13 mm | Pass: hits.maxDistance 9.33e-13 mm | 2549 / 526 / 0 | 2549 / 526 / 0 | 2549 / 526 / 0 |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.46e-13 mm | Pass: landing.maxDistance 2.51e-13 mm | Pass: landing.maxDistance 3.09e-13 mm | 2635 / 440 / 0 | 2635 / 440 / 0 | 2635 / 440 / 0 |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.92e-13 mm | Pass: landing.maxDistance 2.86e-13 mm | Pass: landing.maxDistance 2.74e-13 mm | 2631 / 444 / 0 | 2631 / 444 / 0 | 2631 / 444 / 0 |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.27e-13 mm | Pass: landing.maxDistance 3.10e-13 mm | Pass: landing.maxDistance 3.55e-13 mm | 2229 / 846 / 0 | 2229 / 846 / 0 | 2229 / 846 / 0 |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 3 | Pass: landing.maxDistance 5.54e-13 mm | Pass: landing.maxDistance 3.81e-13 mm | Pass: landing.maxDistance 4.47e-13 mm | 2627 / 448 / 0 | 2627 / 448 / 0 | 2627 / 448 / 0 |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.07e-13 mm | Pass: landing.maxDistance 2.84e-13 mm | Pass: landing.maxDistance 4.10e-13 mm | 2521 / 554 / 0 | 2521 / 554 / 0 | 2521 / 554 / 0 |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 3 | Pass: landing.maxDistance 5.03e-13 mm | Pass: landing.maxDistance 4.62e-13 mm | Pass: landing.maxDistance 6.44e-13 mm | 2561 / 514 / 0 | 2561 / 514 / 0 | 2561 / 514 / 0 |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | 3 | Pass: landing.maxDistance 4.49e-13 mm | Pass: landing.maxDistance 3.89e-13 mm | Pass: landing.maxDistance 7.16e-13 mm | 2445 / 630 / 0 | 2445 / 630 / 0 | 2445 / 630 / 0 |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.74e-13 mm | Pass: landing.maxDistance 2.47e-13 mm | Pass: landing.maxDistance 2.09e-13 mm | 2321 / 754 / 0 | 2321 / 754 / 0 | 2321 / 754 / 0 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 2 | Pass: landing.maxDistance 2.95e-13 mm | Pass: landing.maxDistance 1.11e-13 mm | Pass: landing.maxDistance 3.23e-13 mm | 2048 / 2 / 0 | 2048 / 2 / 0 | 2048 / 2 / 0 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | 3 | Pass: landing.maxDistance 3.16e-13 mm | Pass: landing.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 3.58e-13 mm | 2995 / 80 / 0 | 2995 / 80 / 0 | 2995 / 80 / 0 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 3 | Pass: landing.maxDistance 5.03e-13 mm | Pass: landing.maxDistance 2.10e-13 mm | Pass: landing.maxDistance 5.13e-13 mm | 2871 / 204 / 0 | 2871 / 204 / 0 | 2871 / 204 / 0 |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.01e-13 mm | Pass: landing.maxDistance 6.08e-14 mm | Pass: landing.maxDistance 1.00e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.25e-13 mm | Pass: landing.maxDistance 1.10e-13 mm | Pass: landing.maxDistance 2.44e-13 mm | 2707 / 368 / 0 | 2707 / 368 / 0 | 2707 / 368 / 0 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 3 | Pass: landing.maxDistance 2.28e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 2.39e-13 mm | 2477 / 598 / 0 | 2477 / 598 / 0 | 2477 / 598 / 0 |
| certified-nikon-afs-28f14e-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.07e-13 mm | Pass: hits.maxDistance 9.77e-13 mm | Pass: landing.maxDistance 1.01e-12 mm | 2737 / 338 / 0 | 2737 / 338 / 0 | 2737 / 338 / 0 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | 3 | Pass: hits.maxDistance 3.17e-13 mm | Pass: hits.maxDistance 2.08e-13 mm | Pass: landing.maxDistance 3.00e-13 mm | 2457 / 618 / 0 | 2457 / 618 / 0 | 2457 / 618 / 0 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 3 | Pass: landing.maxDistance 3.33e-13 mm | Pass: hits.maxDistance 1.80e-13 mm | Pass: landing.maxDistance 3.34e-13 mm | 2331 / 744 / 0 | 2331 / 744 / 0 | 2331 / 744 / 0 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 3 | Pass: landing.maxDistance 3.86e-13 mm | Pass: landing.maxDistance 2.32e-13 mm | Pass: landing.maxDistance 4.25e-13 mm | 2129 / 946 / 0 | 2129 / 946 / 0 | 2129 / 946 / 0 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | 3 | Pass: hits.maxDistance 2.12e-13 mm | Pass: hits.maxDistance 1.48e-13 mm | Pass: landing.maxDistance 1.92e-13 mm | 2395 / 680 / 0 | 2395 / 680 / 0 | 2395 / 680 / 0 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 2 | Pass: hits.maxDistance 2.27e-13 mm | Pass: hits.maxDistance 1.23e-13 mm | Pass: landing.maxDistance 2.27e-13 mm | 1982 / 68 / 0 | 1982 / 68 / 0 | 1982 / 68 / 0 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 3 | Pass: landing.maxDistance 2.34e-13 mm | Pass: landing.maxDistance 1.85e-13 mm | Pass: landing.maxDistance 2.47e-13 mm | 1877 / 1198 / 0 | 1877 / 1198 / 0 | 1877 / 1198 / 0 |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.54e-14 mm | Pass: landing.maxDistance 6.94e-14 mm | Pass: landing.maxDistance 1.05e-13 mm | 2567 / 508 / 0 | 2567 / 508 / 0 | 2567 / 508 / 0 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.42e-13 mm | Pass: landing.maxDistance 1.43e-13 mm | Pass: landing.maxDistance 1.55e-13 mm | 2931 / 144 / 0 | 2931 / 144 / 0 | 2931 / 144 / 0 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.83e-13 mm | Pass: landing.maxDistance 1.20e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | 2917 / 158 / 0 | 2917 / 158 / 0 | 2917 / 158 / 0 |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.15e-13 mm | Pass: landing.maxDistance 8.11e-14 mm | Pass: landing.maxDistance 1.18e-13 mm | 2655 / 420 / 0 | 2655 / 420 / 0 | 2655 / 420 / 0 |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.62e-13 mm | Pass: landing.maxDistance 2.20e-13 mm | Pass: landing.maxDistance 2.59e-13 mm | 2147 / 928 / 0 | 2147 / 928 / 0 | 2147 / 928 / 0 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | 2042 / 8 / 0 | 2042 / 8 / 0 | 2042 / 8 / 0 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.18e-13 mm | Pass: hits.maxDistance 9.09e-13 mm | Pass: hits.maxDistance 9.09e-13 mm | 2979 / 96 / 0 | 2979 / 96 / 0 | 2979 / 96 / 0 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.35e-13 mm | Pass: hits.maxDistance 9.91e-13 mm | Pass: hits.maxDistance 9.92e-13 mm | 2967 / 108 / 0 | 2967 / 108 / 0 | 2967 / 108 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 3 | Pass: hits.maxDistance 2.02e-12 mm | Pass: hits.maxDistance 2.01e-12 mm | Pass: hits.maxDistance 1.91e-12 mm | 2397 / 678 / 0 | 2397 / 678 / 0 | 2397 / 678 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | 3 | Pass: hits.maxDistance 2.42e-12 mm | Pass: hits.maxDistance 1.79e-12 mm | Pass: hits.maxDistance 2.48e-12 mm | 2389 / 686 / 0 | 2389 / 686 / 0 | 2389 / 686 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | 3 | Pass: landing.maxDistance 1.83e-13 mm | Pass: hits.maxDistance 1.22e-12 mm | Pass: hits.maxDistance 1.23e-12 mm | 2815 / 260 / 0 | 2815 / 260 / 0 | 2815 / 260 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | 3 | Pass: landing.maxDistance 1.26e-12 mm | Pass: landing.maxDistance 1.31e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | 2831 / 244 / 0 | 2831 / 244 / 0 | 2831 / 244 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 1 | Pass: landing.maxDistance 1.58e-13 mm | Pass: hits.maxDistance 9.91e-13 mm | Pass: hits.maxDistance 9.92e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | 3 | Pass: landing.maxDistance 2.42e-13 mm | Pass: landing.maxDistance 1.24e-12 mm | Pass: landing.maxDistance 1.28e-12 mm | 2727 / 348 / 0 | 2727 / 348 / 0 | 2727 / 348 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 3 | Pass: hits.maxDistance 1.06e-12 mm | Pass: landing.maxDistance 1.27e-12 mm | Pass: landing.maxDistance 1.39e-12 mm | 2769 / 306 / 0 | 2769 / 306 / 0 | 2769 / 306 / 0 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | 1 | Pass: landing.maxDistance 2.72e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.49e-13 mm | Pass: landing.maxDistance 1.62e-13 mm | Pass: landing.maxDistance 2.10e-13 mm | 3073 / 2 / 0 | 3073 / 2 / 0 | 3073 / 2 / 0 |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.54e-13 mm | Pass: landing.maxDistance 1.77e-13 mm | Pass: landing.maxDistance 1.72e-13 mm | 2519 / 556 / 0 | 2519 / 556 / 0 | 2519 / 556 / 0 |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.49e-13 mm | Pass: landing.maxDistance 7.05e-14 mm | Pass: landing.maxDistance 1.95e-13 mm | 2235 / 840 / 0 | 2235 / 840 / 0 | 2235 / 840 / 0 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.37e-13 mm | Pass: landing.maxDistance 1.04e-13 mm | Pass: landing.maxDistance 1.14e-13 mm | 2725 / 350 / 0 | 2725 / 350 / 0 | 2725 / 350 / 0 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.52e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | 2745 / 330 / 0 | 2745 / 330 / 0 | 2745 / 330 / 0 |
| certified-nikon-micro-60f28g-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.39e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.84e-13 mm | 2599 / 476 / 0 | 2599 / 476 / 0 | 2599 / 476 / 0 |
| certified-nikon-micro-60f28g-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.51e-13 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.90e-13 mm | 2903 / 172 / 0 | 2903 / 172 / 0 | 2903 / 172 / 0 |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.14e-13 mm | Pass: landing.maxDistance 7.85e-14 mm | Pass: landing.maxDistance 9.60e-14 mm | 2565 / 510 / 0 | 2565 / 510 / 0 | 2565 / 510 / 0 |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.55e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 2385 / 690 / 0 | 2385 / 690 / 0 | 2385 / 690 / 0 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.84e-13 mm | Pass: hits.maxDistance 9.80e-13 mm | Pass: hits.maxDistance 9.67e-13 mm | 2905 / 170 / 0 | 2905 / 170 / 0 | 2905 / 170 / 0 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 3 | Pass: hits.maxDistance 9.80e-13 mm | Pass: hits.maxDistance 9.70e-13 mm | Pass: hits.maxDistance 9.75e-13 mm | 3029 / 46 / 0 | 3029 / 46 / 0 | 3029 / 46 / 0 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 9.96e-13 mm | 3047 / 28 / 0 | 3047 / 28 / 0 | 3047 / 28 / 0 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.43e-14 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2109 / 966 / 0 | 2109 / 966 / 0 | 2109 / 966 / 0 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.17e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | Pass: hits.maxDistance 9.73e-13 mm | 2169 / 906 / 0 | 2169 / 906 / 0 | 2169 / 906 / 0 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.71e-13 mm | Pass: hits.maxDistance 9.79e-13 mm | Pass: hits.maxDistance 9.84e-13 mm | 2765 / 310 / 0 | 2765 / 310 / 0 | 2765 / 310 / 0 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 2829 / 246 / 0 | 2829 / 246 / 0 | 2829 / 246 / 0 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.84e-13 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2669 / 406 / 0 | 2669 / 406 / 0 | 2669 / 406 / 0 |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 2383 / 692 / 0 | 2383 / 692 / 0 | 2383 / 692 / 0 |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 1 | Pass: landing.maxDistance 1.25e-13 mm | Pass: hits.maxDistance 9.67e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.43e-13 mm | Pass: landing.maxDistance 7.47e-14 mm | Pass: landing.maxDistance 1.29e-13 mm | 2975 / 100 / 0 | 2975 / 100 / 0 | 2975 / 100 / 0 |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | 3 | Pass: hits.maxDistance 1.22e-12 mm | Pass: hits.maxDistance 1.26e-12 mm | Pass: hits.maxDistance 1.29e-12 mm | 2723 / 352 / 0 | 2723 / 352 / 0 | 2723 / 352 / 0 |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | 2 | Pass: landing.maxDistance 1.31e-13 mm | Pass: hits.maxDistance 9.40e-13 mm | Pass: hits.maxDistance 9.40e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | 3 | Pass: hits.maxDistance 9.09e-13 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2945 / 130 / 0 | 2945 / 130 / 0 | 2945 / 130 / 0 |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | 3 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 2985 / 90 / 0 | 2985 / 90 / 0 | 2985 / 90 / 0 |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | 3 | Pass: hits.maxDistance 1.18e-12 mm | Pass: hits.maxDistance 1.19e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2947 / 128 / 0 | 2947 / 128 / 0 | 2947 / 128 / 0 |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2983 / 92 / 0 | 2983 / 92 / 0 | 2983 / 92 / 0 |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | 3 | Pass: hits.maxDistance 3.82e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2913 / 162 / 0 | 2913 / 162 / 0 | 2913 / 162 / 0 |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 9.73e-13 mm | 2951 / 124 / 0 | 2951 / 124 / 0 | 2951 / 124 / 0 |
| certified-nikon-z-58f095-noct-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 9.58e-13 mm | 2535 / 540 / 0 | 2535 / 540 / 0 | 2535 / 540 / 0 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.12e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 1826 / 224 / 0 | 1826 / 224 / 0 | 1826 / 224 / 0 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | 3 | Pass: hits.maxDistance 5.79e-13 mm | Pass: hits.maxDistance 1.19e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | 2875 / 200 / 0 | 2875 / 200 / 0 | 2875 / 200 / 0 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.99e-13 mm | Pass: hits.maxDistance 1.14e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | 2647 / 428 / 0 | 2647 / 428 / 0 | 2647 / 428 / 0 |
| certified-nikon-z-mc-105f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.16e-13 mm | 2513 / 562 / 0 | 2513 / 562 / 0 | 2513 / 562 / 0 |
| certified-nikon-z-mc-105f28-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 8.30e-13 mm | 2697 / 378 / 0 | 2697 / 378 / 0 | 2697 / 378 / 0 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.27e-12 mm | Pass: hits.maxDistance 1.29e-12 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.11e-13 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.95e-13 mm | Pass: hits.maxDistance 1.77e-12 mm | Pass: hits.maxDistance 1.84e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 3 | Pass: hits.maxDistance 4.16e-14 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 2363 / 712 / 0 | 2363 / 700 / 12 | 2363 / 712 / 0 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 3 | Pass: landing.maxDistance 6.04e-14 mm | Pass: hits.maxDistance 1.18e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | 2915 / 160 / 0 | 2915 / 160 / 0 | 2915 / 160 / 0 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 3 | Pass: landing.maxDistance 6.62e-14 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 3065 / 10 / 0 | 3065 / 10 / 0 | 3065 / 10 / 0 |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 1.28e-12 mm | Pass: hits.maxDistance 1.29e-12 mm | 2929 / 146 / 0 | 2929 / 146 / 0 | 2929 / 146 / 0 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 9.87e-13 mm | 2655 / 420 / 0 | 2655 / 420 / 0 | 2655 / 420 / 0 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 9.95e-13 mm | 2627 / 448 / 0 | 2627 / 448 / 0 | 2627 / 448 / 0 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2485 / 590 / 0 | 2485 / 590 / 0 | 2485 / 590 / 0 |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | 3 | Pass: landing.maxDistance 6.64e-14 mm | Pass: landing.maxDistance 5.68e-14 mm | Pass: landing.maxDistance 7.95e-14 mm | 3033 / 42 / 0 | 3033 / 42 / 0 | 3033 / 42 / 0 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | 3 | Pass: hits.maxDistance 8.64e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2875 / 200 / 0 | 2875 / 200 / 0 | 2875 / 200 / 0 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 3 | Pass: landing.maxDistance 6.74e-14 mm | Pass: hits.maxDistance 9.67e-13 mm | Pass: hits.maxDistance 9.52e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.28e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2559 / 516 / 0 | 2559 / 512 / 4 | 2559 / 516 / 0 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.18e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2621 / 454 / 0 | 2621 / 444 / 10 | 2621 / 454 / 0 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.17e-13 mm | Pass: hits.maxDistance 9.05e-13 mm | Pass: hits.maxDistance 9.06e-13 mm | 2571 / 504 / 0 | 2571 / 504 / 0 | 2571 / 504 / 0 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.20e-13 mm | Pass: hits.maxDistance 8.35e-13 mm | Pass: hits.maxDistance 8.35e-13 mm | 2589 / 486 / 0 | 2589 / 486 / 0 | 2589 / 486 / 0 |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.01e-14 mm | Pass: landing.maxDistance 5.78e-14 mm | Pass: landing.maxDistance 9.82e-14 mm | 2265 / 810 / 0 | 2265 / 810 / 0 | 2265 / 810 / 0 |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.88e-14 mm | Pass: landing.maxDistance 9.60e-14 mm | Pass: landing.maxDistance 9.25e-14 mm | 1820 / 1255 / 0 | 1820 / 1255 / 0 | 1820 / 1255 / 0 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 2 | Pass: landing.maxDistance 8.44e-14 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 2 | Pass: landing.maxDistance 1.00e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 1 | Pass: landing.maxDistance 1.24e-13 mm | Pass: hits.maxDistance 9.66e-13 mm | Pass: hits.maxDistance 9.66e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 2 | Pass: landing.maxDistance 8.90e-14 mm | Pass: hits.maxDistance 9.18e-13 mm | Pass: hits.maxDistance 9.11e-13 mm | 1978 / 72 / 0 | 1978 / 72 / 0 | 1978 / 72 / 0 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.48e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.96e-13 mm | 2567 / 508 / 0 | 2567 / 508 / 0 | 2567 / 508 / 0 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 2 | Pass: landing.maxDistance 1.21e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 1670 / 380 / 0 | 1670 / 380 / 0 | 1670 / 380 / 0 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.28e-13 mm | Pass: landing.maxDistance 2.96e-13 mm | Pass: landing.maxDistance 3.00e-13 mm | 2701 / 374 / 0 | 2701 / 374 / 0 | 2701 / 374 / 0 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | 3 | Pass: landing.maxDistance 9.20e-14 mm | Pass: landing.maxDistance 3.81e-14 mm | Pass: landing.maxDistance 9.18e-14 mm | 2929 / 146 / 0 | 2929 / 146 / 0 | 2929 / 146 / 0 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 3 | Pass: landing.maxDistance 8.35e-14 mm | Pass: landing.maxDistance 5.70e-14 mm | Pass: landing.maxDistance 8.64e-14 mm | 2909 / 166 / 0 | 2909 / 166 / 0 | 2909 / 166 / 0 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | 3 | Pass: landing.maxDistance 1.31e-13 mm | Pass: landing.maxDistance 8.26e-14 mm | Pass: landing.maxDistance 1.51e-13 mm | 3015 / 60 / 0 | 3015 / 60 / 0 | 3015 / 60 / 0 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | Pass: landing.maxDistance 6.33e-14 mm | Pass: hits.maxDistance 9.66e-13 mm | Pass: hits.maxDistance 9.66e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | Pass: landing.maxDistance 7.85e-14 mm | Pass: hits.maxDistance 8.10e-13 mm | Pass: hits.maxDistance 7.96e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | Pass: landing.maxDistance 1.29e-13 mm | Pass: hits.maxDistance 8.67e-13 mm | Pass: hits.maxDistance 8.53e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | Pass: landing.maxDistance 2.27e-13 mm | Pass: hits.maxDistance 1.57e-13 mm | Pass: landing.maxDistance 2.34e-13 mm | 2979 / 96 / 0 | 2979 / 96 / 0 | 2979 / 96 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | Pass: hits.maxDistance 2.12e-13 mm | Pass: landing.maxDistance 1.08e-13 mm | Pass: hits.maxDistance 2.16e-13 mm | 3021 / 54 / 0 | 3021 / 54 / 0 | 3021 / 54 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | Pass: landing.maxDistance 2.22e-13 mm | Pass: hits.maxDistance 2.06e-13 mm | Pass: hits.maxDistance 2.69e-13 mm | 2995 / 80 / 0 | 2995 / 80 / 0 | 2995 / 80 / 0 |
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.35e-14 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2687 / 388 / 0 | 2687 / 388 / 0 | 2687 / 388 / 0 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.37e-13 mm | Pass: landing.maxDistance 8.20e-14 mm | Pass: landing.maxDistance 1.54e-13 mm | 2729 / 346 / 0 | 2729 / 346 / 0 | 2729 / 346 / 0 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.33e-13 mm | Pass: landing.maxDistance 8.03e-14 mm | Pass: landing.maxDistance 1.31e-13 mm | 2779 / 296 / 0 | 2779 / 296 / 0 | 2779 / 296 / 0 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 3 | Pass: landing.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.44e-13 mm | Pass: landing.maxDistance 1.48e-13 mm | 2623 / 452 / 0 | 2623 / 452 / 0 | 2623 / 452 / 0 |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.69e-14 mm | Pass: hits.maxDistance 9.84e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2835 / 240 / 0 | 2835 / 240 / 0 | 2835 / 240 / 0 |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 9.00e-13 mm | Pass: hits.maxDistance 8.99e-13 mm | 2539 / 536 / 0 | 2539 / 536 / 0 | 2539 / 536 / 0 |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.30e-13 mm | Pass: hits.maxDistance 9.66e-13 mm | Pass: hits.maxDistance 9.74e-13 mm | 1769 / 1306 / 0 | 1769 / 1306 / 0 | 1769 / 1306 / 0 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 3 | Pass: landing.maxDistance 6.77e-14 mm | Pass: hits.maxDistance 9.17e-13 mm | Pass: hits.maxDistance 9.16e-13 mm | 2751 / 324 / 0 | 2751 / 324 / 0 | 2751 / 324 / 0 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 3 | Pass: landing.maxDistance 7.29e-14 mm | Pass: hits.maxDistance 9.93e-13 mm | Pass: hits.maxDistance 9.93e-13 mm | 2745 / 330 / 0 | 2745 / 330 / 0 | 2745 / 330 / 0 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | 2545 / 530 / 0 | 2545 / 530 / 0 | 2545 / 530 / 0 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.21e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.20e-12 mm | 2759 / 316 / 0 | 2759 / 316 / 0 | 2759 / 316 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.17e-13 mm | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | 2669 / 406 / 0 | 2669 / 406 / 0 | 2669 / 406 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.35e-13 mm | Pass: hits.maxDistance 9.72e-13 mm | Pass: hits.maxDistance 9.72e-13 mm | 2953 / 122 / 0 | 2953 / 122 / 0 | 2953 / 122 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | Pass: landing.maxDistance 7.84e-14 mm | Pass: hits.maxDistance 9.86e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 3 | Pass: landing.maxDistance 7.67e-14 mm | Pass: hits.maxDistance 9.79e-13 mm | Pass: hits.maxDistance 9.77e-13 mm | 2757 / 318 / 0 | 2757 / 318 / 0 | 2757 / 318 / 0 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | 3 | Pass: landing.maxDistance 8.82e-14 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2925 / 150 / 0 | 2925 / 150 / 0 | 2925 / 150 / 0 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | 3 | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 9.85e-13 mm | 2745 / 330 / 0 | 2745 / 330 / 0 | 2745 / 330 / 0 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.62e-14 mm | Pass: landing.maxDistance 4.62e-14 mm | Pass: landing.maxDistance 4.27e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | 2279 / 796 / 0 | 2279 / 796 / 0 | 2279 / 796 / 0 |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | 2485 / 590 / 0 | 2485 / 590 / 0 | 2485 / 590 / 0 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 8.25e-13 mm | 2739 / 336 / 0 | 2739 / 336 / 0 | 2739 / 336 / 0 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 9.10e-13 mm | 2835 / 240 / 0 | 2835 / 240 / 0 | 2835 / 240 / 0 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 3 | Pass: hits.maxDistance 9.67e-13 mm | Pass: hits.maxDistance 9.49e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 2859 / 216 / 0 | 2859 / 216 / 0 | 2859 / 216 / 0 |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.04e-13 mm | Pass: landing.maxDistance 1.70e-13 mm | Pass: landing.maxDistance 3.37e-13 mm | 2987 / 88 / 0 | 2987 / 88 / 0 | 2987 / 88 / 0 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.13e-13 mm | Pass: landing.maxDistance 6.93e-14 mm | Pass: landing.maxDistance 8.54e-14 mm | 3043 / 32 / 0 | 3043 / 32 / 0 | 3043 / 32 / 0 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | 3 | Pass: landing.maxDistance 9.42e-14 mm | Pass: landing.maxDistance 5.34e-14 mm | Pass: landing.maxDistance 9.24e-14 mm | 3033 / 42 / 0 | 3033 / 42 / 0 | 3033 / 42 / 0 |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.19e-13 mm | Pass: landing.maxDistance 1.45e-13 mm | Pass: landing.maxDistance 2.28e-13 mm | 3073 / 2 / 0 | 3073 / 2 / 0 | 3073 / 2 / 0 |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.63e-13 mm | Pass: hits.maxDistance 6.16e-14 mm | Pass: hits.maxDistance 1.56e-13 mm | 2517 / 558 / 0 | 2517 / 558 / 0 | 2517 / 558 / 0 |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.13e-13 mm | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.24e-12 mm | 2795 / 280 / 0 | 2795 / 280 / 0 | 2795 / 280 / 0 |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.49e-13 mm | Pass: hits.maxDistance 9.83e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | 2863 / 212 / 0 | 2863 / 212 / 0 | 2863 / 212 / 0 |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.45e-13 mm | Pass: landing.maxDistance 1.33e-13 mm | Pass: landing.maxDistance 1.51e-13 mm | 2849 / 226 / 0 | 2849 / 226 / 0 | 2849 / 226 / 0 |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.22e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2691 / 384 / 0 | 2691 / 384 / 0 | 2691 / 384 / 0 |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 3 | Pass: landing.maxDistance 2.45e-13 mm | Pass: landing.maxDistance 2.09e-13 mm | Pass: landing.maxDistance 2.52e-13 mm | 2941 / 134 / 0 | 2941 / 134 / 0 | 2941 / 134 / 0 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | Pass: landing.maxDistance 2.39e-13 mm | Pass: landing.maxDistance 2.94e-13 mm | Pass: landing.maxDistance 2.45e-13 mm | 2937 / 138 / 0 | 2937 / 138 / 0 | 2937 / 138 / 0 |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.94e-13 mm | Pass: hits.maxDistance 9.21e-13 mm | Pass: hits.maxDistance 9.21e-13 mm | 2597 / 478 / 0 | 2597 / 478 / 0 | 2597 / 478 / 0 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.76e-14 mm | Pass: hits.maxDistance 9.68e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | 2679 / 396 / 0 | 2679 / 396 / 0 | 2679 / 396 / 0 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.19e-13 mm | Pass: hits.maxDistance 9.56e-13 mm | Pass: hits.maxDistance 9.56e-13 mm | 3053 / 22 / 0 | 3053 / 22 / 0 | 3053 / 22 / 0 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 9.63e-13 mm | Pass: hits.maxDistance 9.63e-13 mm | 3009 / 66 / 0 | 3009 / 66 / 0 | 3009 / 66 / 0 |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | 2 | Pass: landing.maxDistance 7.08e-14 mm | Pass: hits.maxDistance 4.76e-14 mm | Pass: landing.maxDistance 7.15e-14 mm | 2000 / 50 / 0 | 2000 / 50 / 0 | 2000 / 50 / 0 |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 3 | Pass: direction.maxAbs 3.11e-15 | Pass: hits.maxDistance 9.47e-13 mm | Pass: hits.maxDistance 9.48e-13 mm | 2463 / 612 / 0 | 2463 / 612 / 0 | 2463 / 612 / 0 |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | 3 | Pass: landing.maxDistance 6.23e-14 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 3 | Pass: landing.maxDistance 7.20e-14 mm | Pass: hits.maxDistance 9.78e-13 mm | Pass: hits.maxDistance 9.77e-13 mm | 2625 / 450 / 0 | 2625 / 450 / 0 | 2625 / 450 / 0 |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.12e-13 mm | Pass: hits.maxDistance 8.71e-13 mm | Pass: hits.maxDistance 8.71e-13 mm | 2639 / 436 / 0 | 2639 / 436 / 0 | 2639 / 436 / 0 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.67e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 2465 / 610 / 0 | 2465 / 610 / 0 | 2465 / 610 / 0 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.73e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 2791 / 284 / 0 | 2791 / 284 / 0 | 2791 / 284 / 0 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | 3 | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.29e-13 mm | 2047 / 1028 / 0 | 2047 / 1028 / 0 | 2047 / 1028 / 0 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.40e-13 mm | Pass: hits.maxDistance 9.89e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | 2275 / 800 / 0 | 2275 / 800 / 0 | 2275 / 800 / 0 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 9.56e-13 mm | Pass: hits.maxDistance 9.56e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.12e-13 mm | Pass: landing.maxDistance 1.47e-12 mm | Pass: landing.maxDistance 1.53e-12 mm | 2465 / 610 / 0 | 2465 / 610 / 0 | 2465 / 610 / 0 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | 2 | Pass: hits.maxDistance 1.22e-13 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 1952 / 98 / 0 | 1952 / 98 / 0 | 1952 / 98 / 0 |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.42e-13 mm | Pass: landing.maxDistance 2.42e-12 mm | Pass: landing.maxDistance 2.39e-12 mm | 2609 / 466 / 0 | 2609 / 466 / 0 | 2609 / 466 / 0 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.18e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | Pass: hits.maxDistance 1.24e-12 mm | 2587 / 488 / 0 | 2587 / 488 / 0 | 2587 / 488 / 0 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | 2609 / 466 / 0 | 2609 / 466 / 0 | 2609 / 466 / 0 |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.29e-13 mm | Pass: landing.maxDistance 1.49e-12 mm | Pass: landing.maxDistance 1.46e-12 mm | 2797 / 278 / 0 | 2797 / 278 / 0 | 2797 / 278 / 0 |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.46e-13 mm | Pass: landing.maxDistance 1.51e-12 mm | Pass: landing.maxDistance 1.58e-12 mm | 2869 / 206 / 0 | 2869 / 206 / 0 | 2869 / 206 / 0 |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | 1878 / 172 / 0 | 1878 / 172 / 0 | 1878 / 172 / 0 |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 2329 / 746 / 0 | 2329 / 746 / 0 | 2329 / 746 / 0 |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.28e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.29e-12 mm | 2367 / 708 / 0 | 2367 / 708 / 0 | 2367 / 708 / 0 |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.72e-12 mm | Pass: landing.maxDistance 3.04e-12 mm | Pass: landing.maxDistance 2.85e-12 mm | 2331 / 744 / 0 | 2331 / 744 / 0 | 2331 / 744 / 0 |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.39e-13 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 2933 / 142 / 0 | 2933 / 142 / 0 | 2933 / 142 / 0 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.80e-13 mm | Pass: landing.maxDistance 1.29e-13 mm | Pass: landing.maxDistance 2.53e-13 mm | 2639 / 436 / 0 | 2639 / 436 / 0 | 2639 / 436 / 0 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.38e-13 mm | Pass: landing.maxDistance 1.22e-13 mm | Pass: landing.maxDistance 2.11e-13 mm | 2427 / 648 / 0 | 2427 / 648 / 0 | 2427 / 648 / 0 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | Pass: hits.maxDistance 8.71e-13 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 2479 / 596 / 0 | 2479 / 596 / 0 | 2479 / 596 / 0 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2719 / 356 / 0 | 2719 / 356 / 0 | 2719 / 356 / 0 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | Pass: hits.maxDistance 9.58e-13 mm | Pass: hits.maxDistance 9.67e-13 mm | Pass: hits.maxDistance 9.70e-13 mm | 2819 / 256 / 0 | 2819 / 256 / 0 | 2819 / 256 / 0 |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.62e-13 mm | Pass: hits.maxDistance 9.40e-13 mm | Pass: hits.maxDistance 9.40e-13 mm | 2485 / 590 / 0 | 2485 / 590 / 0 | 2485 / 590 / 0 |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 1.34e-12 mm | Pass: hits.maxDistance 1.34e-12 mm | 3029 / 46 / 0 | 3029 / 46 / 0 | 3029 / 46 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.26e-12 mm | 2589 / 486 / 0 | 2589 / 486 / 0 | 2589 / 486 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | Pass: hits.maxDistance 3.81e-13 mm | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 2657 / 418 / 0 | 2657 / 418 / 0 | 2657 / 418 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | Pass: landing.maxDistance 2.24e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 2521 / 554 / 0 | 2521 / 554 / 0 | 2521 / 554 / 0 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.45e-13 mm | Pass: landing.maxDistance 1.59e-13 mm | Pass: landing.maxDistance 2.21e-13 mm | 2539 / 536 / 0 | 2539 / 536 / 0 | 2539 / 536 / 0 |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 1984 / 66 / 0 | 1984 / 66 / 0 | 1984 / 66 / 0 |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: hits.maxDistance 8.88e-13 mm | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | 2179 / 896 / 0 | 2179 / 896 / 0 | 2179 / 896 / 0 |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.27e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | 2685 / 390 / 0 | 2685 / 390 / 0 | 2685 / 390 / 0 |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | 3 | Pass: landing.maxDistance 1.62e-13 mm | Pass: hits.maxDistance 1.20e-12 mm | Pass: hits.maxDistance 1.21e-12 mm | 2423 / 652 / 0 | 2423 / 652 / 0 | 2423 / 652 / 0 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.07e-13 mm | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | 2689 / 386 / 0 | 2689 / 386 / 0 | 2689 / 386 / 0 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2941 / 134 / 0 | 2941 / 134 / 0 | 2941 / 134 / 0 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 2431 / 644 / 0 | 2431 / 644 / 0 | 2431 / 644 / 0 |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2515 / 560 / 0 | 2515 / 560 / 0 | 2515 / 560 / 0 |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.14e-14 mm | Pass: hits.maxDistance 9.78e-13 mm | Pass: hits.maxDistance 9.78e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.35e-13 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 2018 / 1057 / 0 | 2018 / 1057 / 0 | 2018 / 1057 / 0 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.60e-13 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | 2471 / 604 / 0 | 2471 / 604 / 0 | 2471 / 604 / 0 |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.89e-13 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2683 / 392 / 0 | 2683 / 392 / 0 | 2683 / 392 / 0 |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 2695 / 380 / 0 | 2695 / 380 / 0 | 2695 / 380 / 0 |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: hits.maxDistance 8.92e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2663 / 412 / 0 | 2663 / 412 / 0 | 2663 / 412 / 0 |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | 3 | Pass: landing.maxDistance 3.99e-13 mm | Pass: landing.maxDistance 2.98e-13 mm | Pass: landing.maxDistance 4.67e-13 mm | 2675 / 400 / 0 | 2675 / 400 / 0 | 2675 / 400 / 0 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.86e-13 mm | Pass: landing.maxDistance 3.63e-13 mm | Pass: landing.maxDistance 5.20e-13 mm | 2665 / 410 / 0 | 2665 / 410 / 0 | 2665 / 410 / 0 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 3 | Pass: landing.maxDistance 4.45e-13 mm | Pass: landing.maxDistance 3.51e-13 mm | Pass: landing.maxDistance 4.01e-13 mm | 2703 / 372 / 0 | 2703 / 372 / 0 | 2703 / 372 / 0 |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.48e-13 mm | Pass: hits.maxDistance 9.67e-13 mm | Pass: hits.maxDistance 9.81e-13 mm | 2859 / 216 / 0 | 2859 / 216 / 0 | 2859 / 216 / 0 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.13e-13 mm | Pass: hits.maxDistance 9.88e-13 mm | Pass: hits.maxDistance 9.80e-13 mm | 2369 / 706 / 0 | 2369 / 706 / 0 | 2369 / 706 / 0 |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 3 | Pass: landing.maxDistance 1.23e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 2675 / 400 / 0 | 2675 / 400 / 0 | 2675 / 400 / 0 |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | 3 | Pass: landing.maxDistance 5.12e-14 mm | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 9.95e-13 mm | 2953 / 122 / 0 | 2953 / 122 / 0 | 2953 / 122 / 0 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.55e-13 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | 2871 / 204 / 0 | 2871 / 204 / 0 | 2871 / 204 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 2619 / 456 / 0 | 2619 / 456 / 0 | 2619 / 456 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 2571 / 504 / 0 | 2571 / 504 / 0 | 2571 / 504 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 9.95e-13 mm | 2493 / 582 / 0 | 2493 / 582 / 0 | 2493 / 582 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 3 | Pass: landing.maxDistance 1.95e-13 mm | Pass: landing.maxDistance 1.14e-13 mm | Pass: landing.maxDistance 2.13e-13 mm | 2735 / 340 / 0 | 2735 / 340 / 0 | 2735 / 340 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 3 | Pass: landing.maxDistance 2.34e-13 mm | Pass: landing.maxDistance 1.16e-13 mm | Pass: landing.maxDistance 2.19e-13 mm | 2793 / 282 / 0 | 2793 / 282 / 0 | 2793 / 282 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 3 | Pass: landing.maxDistance 2.74e-13 mm | Pass: landing.maxDistance 1.63e-13 mm | Pass: landing.maxDistance 2.09e-13 mm | 2707 / 368 / 0 | 2707 / 368 / 0 | 2707 / 368 / 0 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | 3 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.99e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | 2733 / 342 / 0 | 2733 / 342 / 0 | 2733 / 342 / 0 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 3 | Pass: hits.maxDistance 3.94e-13 mm | Pass: hits.maxDistance 9.97e-13 mm | Pass: hits.maxDistance 9.99e-13 mm | 2749 / 326 / 0 | 2749 / 326 / 0 | 2749 / 326 / 0 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 3 | Pass: landing.maxDistance 1.71e-13 mm | Pass: landing.maxDistance 1.08e-13 mm | Pass: landing.maxDistance 1.79e-13 mm | 2661 / 414 / 0 | 2661 / 414 / 0 | 2661 / 414 / 0 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | 3 | Pass: landing.maxDistance 2.52e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 2.41e-13 mm | 2865 / 210 / 0 | 2865 / 210 / 0 | 2865 / 210 / 0 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 3 | Pass: landing.maxDistance 3.02e-13 mm | Pass: landing.maxDistance 1.84e-13 mm | Pass: landing.maxDistance 2.50e-13 mm | 2599 / 476 / 0 | 2599 / 476 / 0 | 2599 / 476 / 0 |
| certified-sigma-85f14-art-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.32e-13 mm | Pass: hits.maxDistance 1.19e-12 mm | Pass: hits.maxDistance 1.19e-12 mm | 2677 / 398 / 0 | 2677 / 398 / 0 | 2677 / 398 / 0 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.50e-13 mm | Pass: hits.maxDistance 1.18e-12 mm | Pass: hits.maxDistance 1.23e-12 mm | 2405 / 670 / 0 | 2405 / 670 / 0 | 2405 / 670 / 0 |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.39e-13 mm | Pass: hits.maxDistance 9.36e-13 mm | Pass: hits.maxDistance 9.48e-13 mm | 2935 / 140 / 0 | 2935 / 140 / 0 | 2935 / 140 / 0 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.32e-13 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | Pass: hits.maxDistance 2.86e-13 mm | Pass: hits.maxDistance 1.55e-13 mm | Pass: landing.maxDistance 2.53e-13 mm | 2615 / 460 / 0 | 2615 / 460 / 0 | 2615 / 460 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | Pass: landing.maxDistance 3.06e-13 mm | Pass: landing.maxDistance 1.67e-13 mm | Pass: landing.maxDistance 3.06e-13 mm | 2683 / 392 / 0 | 2683 / 392 / 0 | 2683 / 392 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | Pass: landing.maxDistance 3.47e-13 mm | Pass: landing.maxDistance 2.88e-13 mm | Pass: landing.maxDistance 4.54e-13 mm | 2485 / 590 / 0 | 2485 / 590 / 0 | 2485 / 590 / 0 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.59e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 1.79e-13 mm | 2717 / 358 / 0 | 2717 / 358 / 0 | 2717 / 358 / 0 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.86e-13 mm | Pass: landing.maxDistance 1.17e-13 mm | Pass: landing.maxDistance 2.10e-13 mm | 2671 / 404 / 0 | 2671 / 404 / 0 | 2671 / 404 / 0 |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.24e-13 mm | Pass: landing.maxDistance 1.34e-13 mm | Pass: landing.maxDistance 2.66e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.46e-13 mm | Pass: landing.maxDistance 1.48e-13 mm | Pass: landing.maxDistance 2.41e-13 mm | 2457 / 618 / 0 | 2457 / 618 / 0 | 2457 / 618 / 0 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.75e-13 mm | Pass: landing.maxDistance 1.26e-13 mm | Pass: landing.maxDistance 3.15e-13 mm | 2355 / 720 / 0 | 2355 / 720 / 0 | 2355 / 720 / 0 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 2 | Pass: landing.maxDistance 2.37e-13 mm | Pass: landing.maxDistance 1.64e-13 mm | Pass: landing.maxDistance 2.94e-13 mm | 1352 / 698 / 0 | 1352 / 698 / 0 | 1352 / 698 / 0 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.58e-13 mm | Pass: landing.maxDistance 1.19e-13 mm | Pass: landing.maxDistance 1.63e-13 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| certified-sigma-art-40-f14-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 9.73e-13 mm | 2525 / 550 / 0 | 2525 / 550 / 0 | 2525 / 550 / 0 |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.42e-13 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2761 / 314 / 0 | 2761 / 314 / 0 | 2761 / 314 / 0 |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 9.95e-13 mm | 2977 / 98 / 0 | 2977 / 98 / 0 | 2977 / 98 / 0 |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.49e-14 mm | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 9.88e-13 mm | 2889 / 186 / 0 | 2889 / 186 / 0 | 2889 / 186 / 0 |
| certified-sigma-dp2m-30f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 5.91e-14 mm | Pass: hits.maxDistance 9.63e-13 mm | Pass: hits.maxDistance 9.60e-13 mm | 2675 / 400 / 0 | 2675 / 400 / 0 | 2675 / 400 / 0 |
| certified-sonnar-e-24f18-za-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.81e-14 mm | Pass: hits.maxDistance 1.33e-12 mm | Pass: hits.maxDistance 1.33e-12 mm | 2585 / 490 / 0 | 2585 / 490 / 0 | 2585 / 490 / 0 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.95e-13 mm | Pass: hits.maxDistance 1.16e-12 mm | Pass: hits.maxDistance 1.18e-12 mm | 2148 / 927 / 0 | 2148 / 927 / 0 | 2148 / 927 / 0 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 3 | Pass: landing.maxDistance 1.86e-13 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | 3049 / 26 / 0 | 3049 / 26 / 0 | 3049 / 26 / 0 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | 3 | Pass: hits.maxDistance 9.96e-13 mm | Pass: landing.maxDistance 1.28e-12 mm | Pass: landing.maxDistance 1.28e-12 mm | 3025 / 50 / 0 | 3025 / 50 / 0 | 3025 / 50 / 0 |
| certified-sony-e-20f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.48e-13 mm | Pass: landing.maxDistance 1.37e-12 mm | Pass: landing.maxDistance 1.38e-12 mm | 2687 / 388 / 0 | 2687 / 388 / 0 | 2687 / 388 / 0 |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | 2 | Pass: landing.maxDistance 4.80e-14 mm | Pass: landing.maxDistance 3.58e-14 mm | Pass: landing.maxDistance 4.35e-14 mm | 1316 / 734 / 0 | 1316 / 734 / 0 | 1316 / 734 / 0 |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | 3 | Pass: landing.maxDistance 4.35e-14 mm | Pass: landing.maxDistance 4.37e-14 mm | Pass: landing.maxDistance 5.10e-14 mm | 1470 / 1605 / 0 | 1470 / 1605 / 0 | 1470 / 1605 / 0 |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.27e-12 mm | Pass: hits.maxDistance 1.27e-12 mm | 2018 / 32 / 0 | 2018 / 32 / 0 | 2018 / 32 / 0 |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.21e-12 mm | Pass: hits.maxDistance 1.51e-12 mm | Pass: hits.maxDistance 1.32e-12 mm | 2749 / 326 / 0 | 2749 / 326 / 0 | 2749 / 326 / 0 |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.20e-12 mm | Pass: hits.maxDistance 1.20e-12 mm | 2585 / 490 / 0 | 2585 / 490 / 0 | 2585 / 490 / 0 |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.57e-13 mm | Pass: hits.maxDistance 9.80e-13 mm | Pass: hits.maxDistance 9.80e-13 mm | 2191 / 884 / 0 | 2191 / 884 / 0 | 2191 / 884 / 0 |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.87e-13 mm | Pass: hits.maxDistance 9.47e-13 mm | Pass: hits.maxDistance 9.47e-13 mm | 2211 / 864 / 0 | 2211 / 864 / 0 | 2211 / 864 / 0 |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.10e-12 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | 2833 / 242 / 0 | 2833 / 242 / 0 | 2833 / 242 / 0 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.71e-13 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 2729 / 346 / 0 | 2729 / 346 / 0 | 2729 / 346 / 0 |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 2 | Pass: landing.maxDistance 8.81e-14 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | 2 | Pass: landing.maxDistance 1.27e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2036 / 14 / 0 | 2036 / 14 / 0 | 2036 / 14 / 0 |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 2 | Pass: landing.maxDistance 1.94e-13 mm | Pass: hits.maxDistance 9.84e-13 mm | Pass: hits.maxDistance 9.83e-13 mm | 1930 / 120 / 0 | 1930 / 120 / 0 | 1930 / 120 / 0 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.14e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.18e-12 mm | 2030 / 20 / 0 | 2030 / 20 / 0 | 2030 / 20 / 0 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 2 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 2012 / 38 / 0 | 2012 / 38 / 0 | 2012 / 38 / 0 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | 2 | Pass: landing.maxDistance 6.13e-13 mm | Pass: landing.maxDistance 1.27e-12 mm | Pass: landing.maxDistance 1.47e-12 mm | 1842 / 208 / 0 | 1842 / 208 / 0 | 1842 / 208 / 0 |
| certified-sony-fe-24-f28-g-zoom0-focus1 | 3 | Pass: hits.maxDistance 5.20e-13 mm | Pass: hits.maxDistance 1.15e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 2229 / 846 / 0 | 2229 / 846 / 0 | 2229 / 846 / 0 |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 2 | Pass: landing.maxDistance 1.49e-13 mm | Pass: hits.maxDistance 9.84e-13 mm | Pass: hits.maxDistance 1.00e-12 mm | 2042 / 8 / 0 | 2042 / 8 / 0 | 2042 / 8 / 0 |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 2 | Pass: hits.maxDistance 1.55e-13 mm | Pass: hits.maxDistance 1.20e-12 mm | Pass: hits.maxDistance 1.18e-12 mm | 1996 / 54 / 0 | 1996 / 54 / 0 | 1996 / 54 / 0 |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 2 | Pass: hits.maxDistance 1.94e-13 mm | Pass: hits.maxDistance 1.14e-12 mm | Pass: hits.maxDistance 1.13e-12 mm | 1942 / 108 / 0 | 1942 / 108 / 0 | 1942 / 108 / 0 |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 2 | Pass: hits.maxDistance 2.68e-13 mm | Pass: hits.maxDistance 1.18e-12 mm | Pass: hits.maxDistance 1.18e-12 mm | 1770 / 280 / 0 | 1770 / 280 / 0 | 1770 / 280 / 0 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 3 | Pass: landing.maxDistance 7.38e-13 mm | Pass: landing.maxDistance 3.84e-13 mm | Pass: landing.maxDistance 7.75e-13 mm | 2647 / 428 / 0 | 2647 / 428 / 0 | 2647 / 428 / 0 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | 3 | Pass: landing.maxDistance 7.63e-13 mm | Pass: landing.maxDistance 4.23e-13 mm | Pass: landing.maxDistance 6.37e-13 mm | 2741 / 334 / 0 | 2741 / 334 / 0 | 2741 / 334 / 0 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 3 | Pass: landing.maxDistance 7.80e-13 mm | Pass: landing.maxDistance 4.66e-13 mm | Pass: landing.maxDistance 8.11e-13 mm | 2491 / 584 / 0 | 2491 / 584 / 0 | 2491 / 584 / 0 |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 3 | Pass: landing.maxDistance 4.14e-13 mm | Pass: landing.maxDistance 2.13e-13 mm | Pass: landing.maxDistance 3.96e-13 mm | 2309 / 766 / 0 | 2309 / 766 / 0 | 2309 / 766 / 0 |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | Pass: hits.maxDistance 1.15e-12 mm | 2471 / 604 / 0 | 2471 / 604 / 0 | 2471 / 604 / 0 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.74e-13 mm | Pass: landing.maxDistance 2.35e-13 mm | Pass: landing.maxDistance 3.30e-13 mm | 2063 / 1012 / 0 | 2063 / 1012 / 0 | 2063 / 1012 / 0 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 3 | Pass: hits.maxDistance 8.39e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | Pass: hits.maxDistance 9.96e-13 mm | 2471 / 604 / 0 | 2471 / 604 / 0 | 2471 / 604 / 0 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 3 | Pass: hits.maxDistance 8.19e-13 mm | Pass: hits.maxDistance 9.75e-13 mm | Pass: hits.maxDistance 9.72e-13 mm | 2609 / 466 / 0 | 2609 / 466 / 0 | 2609 / 466 / 0 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 3 | Pass: hits.maxDistance 9.60e-13 mm | Pass: hits.maxDistance 9.74e-13 mm | Pass: hits.maxDistance 9.52e-13 mm | 2497 / 578 / 0 | 2497 / 578 / 0 | 2497 / 578 / 0 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 9.96e-13 mm | 2737 / 338 / 0 | 2737 / 338 / 0 | 2737 / 338 / 0 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 9.96e-13 mm | 2771 / 304 / 0 | 2771 / 304 / 0 | 2771 / 304 / 0 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 8.56e-13 mm | 2509 / 566 / 0 | 2509 / 566 / 0 | 2509 / 566 / 0 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.11e-13 mm | Pass: hits.maxDistance 8.49e-13 mm | Pass: hits.maxDistance 8.46e-13 mm | 2093 / 982 / 0 | 2093 / 982 / 0 | 2093 / 982 / 0 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 2 | Pass: landing.maxDistance 1.69e-13 mm | Pass: hits.maxDistance 9.56e-13 mm | Pass: hits.maxDistance 9.56e-13 mm | 1608 / 442 / 0 | 1608 / 442 / 0 | 1608 / 442 / 0 |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 2 | Pass: landing.maxDistance 7.19e-14 mm | Pass: hits.maxDistance 9.98e-13 mm | Pass: hits.maxDistance 9.97e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2721 / 354 / 0 | 2721 / 354 / 0 | 2721 / 354 / 0 |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 3 | Pass: landing.maxDistance 1.28e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 2519 / 556 / 0 | 2519 / 556 / 0 | 2519 / 556 / 0 |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2146 / 929 / 0 | 2146 / 929 / 0 | 2146 / 929 / 0 |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.38e-13 mm | Pass: hits.maxDistance 9.91e-13 mm | Pass: hits.maxDistance 9.86e-13 mm | 2220 / 855 / 0 | 2220 / 855 / 0 | 2220 / 855 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | Pass: landing.maxDistance 2.01e-13 mm | Pass: landing.maxDistance 9.53e-14 mm | Pass: landing.maxDistance 1.98e-13 mm | 2457 / 618 / 0 | 2457 / 618 / 0 | 2457 / 618 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | Pass: landing.maxDistance 2.12e-13 mm | Pass: landing.maxDistance 1.28e-13 mm | Pass: landing.maxDistance 2.03e-13 mm | 2789 / 286 / 0 | 2789 / 286 / 0 | 2789 / 286 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | Pass: landing.maxDistance 2.24e-13 mm | Pass: landing.maxDistance 1.83e-13 mm | Pass: landing.maxDistance 2.16e-13 mm | 2545 / 530 / 0 | 2545 / 530 / 0 | 2545 / 530 / 0 |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.73e-13 mm | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | 2370 / 705 / 0 | 2370 / 705 / 0 | 2370 / 705 / 0 |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.38e-13 mm | Pass: landing.maxDistance 1.23e-12 mm | Pass: landing.maxDistance 1.29e-12 mm | 2807 / 268 / 0 | 2807 / 268 / 0 | 2807 / 268 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.19e-12 mm | Pass: hits.maxDistance 1.22e-12 mm | 2431 / 644 / 0 | 2431 / 644 / 0 | 2431 / 644 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.28e-12 mm | Pass: hits.maxDistance 1.31e-12 mm | 2715 / 360 / 0 | 2715 / 360 / 0 | 2715 / 360 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.25e-12 mm | 2591 / 484 / 0 | 2591 / 484 / 0 | 2591 / 484 / 0 |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.11e-12 mm | 2687 / 388 / 0 | 2687 / 388 / 0 | 2687 / 388 / 0 |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 2727 / 348 / 0 | 2727 / 348 / 0 | 2727 / 348 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.09e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 2631 / 444 / 0 | 2631 / 444 / 0 | 2631 / 444 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | Pass: hits.maxDistance 1.08e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 2577 / 498 / 0 | 2577 / 498 / 0 | 2577 / 498 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.08e-12 mm | 2491 / 584 / 0 | 2491 / 584 / 0 | 2491 / 584 / 0 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.09e-13 mm | Pass: landing.maxDistance 1.56e-13 mm | Pass: landing.maxDistance 2.16e-13 mm | 2743 / 332 / 0 | 2743 / 332 / 0 | 2743 / 332 / 0 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.83e-13 mm | Pass: landing.maxDistance 1.15e-13 mm | Pass: landing.maxDistance 1.88e-13 mm | 2719 / 356 / 0 | 2719 / 356 / 0 | 2719 / 356 / 0 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.60e-13 mm | Pass: landing.maxDistance 1.37e-13 mm | Pass: landing.maxDistance 1.70e-13 mm | 2703 / 372 / 0 | 2703 / 372 / 0 | 2703 / 372 / 0 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.56e-13 mm | Pass: landing.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 3.00e-13 mm | 2605 / 470 / 0 | 2605 / 470 / 0 | 2605 / 470 / 0 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 3 | Pass: landing.maxDistance 2.50e-13 mm | Pass: landing.maxDistance 1.75e-13 mm | Pass: landing.maxDistance 3.12e-13 mm | 2631 / 444 / 0 | 2631 / 444 / 0 | 2631 / 444 / 0 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.99e-13 mm | Pass: landing.maxDistance 1.53e-13 mm | Pass: landing.maxDistance 3.60e-13 mm | 2829 / 246 / 0 | 2829 / 246 / 0 | 2829 / 246 / 0 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | 3 | Pass: landing.maxDistance 3.07e-13 mm | Pass: landing.maxDistance 1.72e-13 mm | Pass: landing.maxDistance 3.47e-13 mm | 2937 / 138 / 0 | 2937 / 138 / 0 | 2937 / 138 / 0 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | 3 | Pass: landing.maxDistance 4.16e-13 mm | Pass: landing.maxDistance 2.26e-13 mm | Pass: landing.maxDistance 4.15e-13 mm | 2879 / 196 / 0 | 2879 / 196 / 0 | 2879 / 196 / 0 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 3 | Pass: landing.maxDistance 2.15e-13 mm | Pass: landing.maxDistance 1.65e-13 mm | Pass: landing.maxDistance 1.90e-13 mm | 2205 / 870 / 0 | 2205 / 870 / 0 | 2205 / 870 / 0 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 3 | Pass: landing.maxDistance 2.05e-13 mm | Pass: landing.maxDistance 1.45e-13 mm | Pass: landing.maxDistance 2.46e-13 mm | 2087 / 988 / 0 | 2087 / 988 / 0 | 2087 / 988 / 0 |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 7.99e-14 mm | Pass: landing.maxDistance 1.14e-13 mm | 2179 / 896 / 0 | 2179 / 896 / 0 | 2179 / 896 / 0 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.66e-13 mm | Pass: hits.maxDistance 1.16e-12 mm | Pass: hits.maxDistance 1.16e-12 mm | 2933 / 142 / 0 | 2933 / 142 / 0 | 2933 / 142 / 0 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.32e-14 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 9.96e-13 mm | 2431 / 644 / 0 | 2431 / 644 / 0 | 2431 / 644 / 0 |
| certified-ultron-28f2-asph-zoom0-focus1 | 3 | Pass: hits.maxDistance 6.55e-13 mm | Pass: hits.maxDistance 9.49e-13 mm | Pass: hits.maxDistance 9.48e-13 mm | 2567 / 508 / 0 | 2567 / 508 / 0 | 2567 / 508 / 0 |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.00e-13 mm | Pass: landing.maxDistance 7.98e-14 mm | Pass: landing.maxDistance 1.07e-13 mm | 3011 / 64 / 0 | 3011 / 64 / 0 | 3011 / 64 / 0 |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.11e-13 mm | Pass: landing.maxDistance 5.28e-14 mm | Pass: landing.maxDistance 9.49e-14 mm | 2217 / 858 / 0 | 2217 / 858 / 0 | 2217 / 858 / 0 |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.10e-13 mm | Pass: hits.maxDistance 1.36e-12 mm | Pass: hits.maxDistance 1.35e-12 mm | 2269 / 806 / 0 | 2269 / 806 / 0 | 2269 / 806 / 0 |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.03e-13 mm | Pass: landing.maxDistance 7.57e-14 mm | Pass: landing.maxDistance 8.33e-14 mm | 2505 / 570 / 0 | 2505 / 570 / 0 | 2505 / 570 / 0 |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.37e-13 mm | Pass: landing.maxDistance 8.18e-14 mm | Pass: landing.maxDistance 1.32e-13 mm | 3023 / 52 / 0 | 3023 / 52 / 0 | 3023 / 52 / 0 |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.92e-13 mm | Pass: hits.maxDistance 9.92e-13 mm | Pass: hits.maxDistance 9.92e-13 mm | 2261 / 814 / 0 | 2261 / 814 / 0 | 2261 / 814 / 0 |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.29e-13 mm | Pass: landing.maxDistance 7.82e-14 mm | Pass: landing.maxDistance 1.17e-13 mm | 2977 / 98 / 0 | 2977 / 98 / 0 | 2977 / 98 / 0 |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.16e-13 mm | Pass: landing.maxDistance 9.66e-14 mm | Pass: landing.maxDistance 1.34e-13 mm | 2701 / 374 / 0 | 2701 / 374 / 0 | 2701 / 374 / 0 |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.87e-13 mm | Pass: hits.maxDistance 1.16e-12 mm | Pass: hits.maxDistance 1.17e-12 mm | 2685 / 390 / 0 | 2685 / 390 / 0 | 2685 / 390 / 0 |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 3 | Pass: landing.maxDistance 7.22e-14 mm | Pass: hits.maxDistance 9.92e-13 mm | Pass: hits.maxDistance 9.93e-13 mm | 2727 / 348 / 0 | 2727 / 348 / 0 | 2727 / 348 / 0 |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.53e-14 mm | Pass: landing.maxDistance 6.53e-14 mm | Pass: landing.maxDistance 7.16e-14 mm | 2591 / 484 / 0 | 2591 / 484 / 0 | 2591 / 484 / 0 |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.96e-13 mm | Pass: landing.maxDistance 1.93e-13 mm | Pass: landing.maxDistance 1.67e-13 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 5.60e-14 mm | Pass: landing.maxDistance 4.83e-14 mm | Pass: landing.maxDistance 6.06e-14 mm | 2635 / 440 / 0 | 2635 / 440 / 0 | 2635 / 440 / 0 |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.28e-13 mm | Pass: hits.maxDistance 1.13e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | 2639 / 436 / 0 | 2639 / 436 / 0 | 2639 / 436 / 0 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.29e-13 mm | Pass: hits.maxDistance 7.55e-14 mm | Pass: hits.maxDistance 1.21e-13 mm | 2699 / 376 / 0 | 2699 / 376 / 0 | 2699 / 376 / 0 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.37e-13 mm | Pass: hits.maxDistance 8.46e-14 mm | Pass: hits.maxDistance 1.32e-13 mm | 2629 / 446 / 0 | 2629 / 446 / 0 | 2629 / 446 / 0 |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 3 | Pass: hits.maxDistance 7.68e-14 mm | Pass: landing.maxDistance 3.95e-14 mm | Pass: landing.maxDistance 5.65e-14 mm | 2389 / 686 / 0 | 2389 / 686 / 0 | 2389 / 686 / 0 |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 3 | Pass: landing.maxDistance 7.47e-14 mm | Pass: landing.maxDistance 5.15e-14 mm | Pass: landing.maxDistance 7.45e-14 mm | 2643 / 432 / 0 | 2643 / 432 / 0 | 2643 / 432 / 0 |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | 3 | Pass: landing.maxDistance 9.27e-14 mm | Pass: landing.maxDistance 6.61e-14 mm | Pass: landing.maxDistance 8.22e-14 mm | 2553 / 522 / 0 | 2553 / 522 / 0 | 2553 / 522 / 0 |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | 3 | Pass: landing.maxDistance 5.01e-14 mm | Pass: landing.maxDistance 3.64e-14 mm | Pass: landing.maxDistance 5.20e-14 mm | 2755 / 320 / 0 | 2755 / 320 / 0 | 2755 / 320 / 0 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.45e-13 mm | Pass: landing.maxDistance 8.29e-14 mm | Pass: landing.maxDistance 1.42e-13 mm | 2353 / 722 / 0 | 2353 / 722 / 0 | 2353 / 722 / 0 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.30e-13 mm | Pass: hits.maxDistance 7.61e-14 mm | Pass: hits.maxDistance 1.28e-13 mm | 2461 / 614 / 0 | 2461 / 614 / 0 | 2461 / 614 / 0 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.48e-13 mm | Pass: hits.maxDistance 7.82e-14 mm | Pass: landing.maxDistance 9.65e-14 mm | 2297 / 778 / 0 | 2297 / 778 / 0 | 2297 / 778 / 0 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.24e-13 mm | Pass: landing.maxDistance 7.00e-14 mm | Pass: landing.maxDistance 1.10e-13 mm | 2263 / 812 / 0 | 2263 / 812 / 0 | 2263 / 812 / 0 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.43e-14 mm | Pass: landing.maxDistance 6.17e-14 mm | Pass: landing.maxDistance 8.19e-14 mm | 2445 / 630 / 0 | 2445 / 630 / 0 | 2445 / 630 / 0 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 3 | Pass: hits.maxDistance 7.07e-14 mm | Pass: landing.maxDistance 9.15e-14 mm | Pass: landing.maxDistance 7.60e-14 mm | 2545 / 530 / 0 | 2545 / 530 / 0 | 2545 / 530 / 0 |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.64e-13 mm | Pass: landing.maxDistance 1.06e-13 mm | Pass: landing.maxDistance 1.57e-13 mm | 2447 / 628 / 0 | 2447 / 628 / 0 | 2447 / 628 / 0 |
| certified-zeiss-batis-18f28-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.12e-12 mm | Pass: landing.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.14e-12 mm | 2729 / 346 / 0 | 2729 / 346 / 0 | 2729 / 346 / 0 |
| certified-zeiss-batis-85f18-zoom0-focus1 | 3 | Pass: landing.maxDistance 8.62e-14 mm | Pass: landing.maxDistance 8.58e-14 mm | Pass: landing.maxDistance 9.65e-14 mm | 2243 / 832 / 0 | 2243 / 832 / 0 | 2243 / 832 / 0 |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 3 | Pass: landing.maxDistance 1.56e-13 mm | Pass: hits.maxDistance 9.42e-13 mm | Pass: hits.maxDistance 9.42e-13 mm | 2279 / 796 / 0 | 2279 / 796 / 0 | 2279 / 796 / 0 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | 3 | Pass: hits.maxDistance 1.10e-12 mm | Pass: hits.maxDistance 1.12e-12 mm | Pass: hits.maxDistance 1.18e-12 mm | 2887 / 188 / 0 | 2887 / 188 / 0 | 2887 / 188 / 0 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | 3 | Pass: hits.maxDistance 1.07e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2887 / 188 / 0 | 2887 / 188 / 0 | 2887 / 188 / 0 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | 3 | Pass: hits.maxDistance 9.26e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | Pass: hits.maxDistance 9.68e-13 mm | 2631 / 444 / 0 | 2631 / 444 / 0 | 2631 / 444 / 0 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 3 | Pass: landing.maxDistance 1.07e-13 mm | Pass: hits.maxDistance 9.22e-13 mm | Pass: hits.maxDistance 9.22e-13 mm | 2715 / 360 / 0 | 2715 / 354 / 6 | 2715 / 360 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 1.41e-7 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – optiland | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 1.48e-7 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – optiland | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 1.50e-7 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 8.21e-8 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 8.57e-8 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| lv – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 8.67e-8 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| optiland – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.23e-7 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| optiland – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 2.33e-7 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |
| optiland – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 2.37e-7 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | field 6.42e1 deg, line 0, ray 323 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-apo-lanthar-50f2-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.59e-9 waves | Pass: opticalPath.maxAbs 2.61e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 2.42e-10 waves |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 3.87e-10 waves |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 2 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 5.80e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 2.52e-9 waves | Pass: opticalPath.maxAbs 2.50e-9 waves |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.04e-9 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-canon-fd-35-f2-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 2 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 2 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 1.16e-9 waves |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 2 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 1.60e-9 waves |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 9.19e-10 waves |
| certified-canon-rf-50-f12-l-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 3.05e-9 waves | Pass: opticalPath.maxAbs 3.05e-9 waves |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves |
| certified-canon-rf-85f2-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-canon-rf-85f2-macro-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| certified-canon-rf100f28-macro-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-canon-rf100f28-macro-zoom0-focus2 | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.18e-9 waves | Pass: opd.maxAbs 2.47e-9 waves | Pass: opd.maxAbs 2.47e-9 waves |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.04e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves | Pass: opticalPath.maxAbs 2.27e-9 waves |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 4.06e-9 waves | Pass: opticalPathToImage.maxAbs 4.11e-9 waves | Pass: opticalPath.maxAbs 1.21e-9 waves |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.43e-9 waves | Pass: opd.maxAbs 1.91e-9 waves | Pass: opd.maxAbs 1.84e-9 waves |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 1.52e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.45e-9 waves |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | 3 | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opd.maxAbs 1.40e-9 waves |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 3 | Pass: opd.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.84e-9 waves |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.19e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.21e-9 waves |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.11e-9 waves | Pass: opd.maxAbs 2.18e-9 waves | Pass: opd.maxAbs 2.32e-9 waves |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.52e-9 waves | Pass: opticalPath.maxAbs 1.48e-9 waves |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 7.50e-10 waves | Pass: opticalPath.maxAbs 7.98e-10 waves | Pass: opticalPath.maxAbs 8.47e-10 waves |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.50e-7 waves | Pass: opd.maxAbs 8.67e-8 waves | Pass: opd.maxAbs 2.37e-7 waves |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 3 | Pass: opd.maxAbs 6.43e-9 waves | Pass: opticalPathToImage.maxAbs 3.72e-9 waves | Pass: opd.maxAbs 9.29e-9 waves |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 2.61e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.45e-9 waves |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.84e-9 waves | Pass: opticalPathToImage.maxAbs 1.89e-9 waves |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 7.69e-9 waves | Pass: opticalPath.maxAbs 5.66e-9 waves | Pass: opticalPath.maxAbs 3.82e-9 waves |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.11e-9 waves | Pass: opd.maxAbs 1.31e-9 waves | Pass: opticalPath.maxAbs 1.21e-9 waves |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.52e-9 waves | Pass: opd.maxAbs 2.13e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 2.35e-9 waves | Pass: opd.maxAbs 2.27e-9 waves |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 2.87e-9 waves | Pass: opticalPath.maxAbs 3.27e-9 waves |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 2.42e-9 waves |
| certified-fujifilm-xf50-f1-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.18e-9 waves | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.79e-9 waves |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.38e-9 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.40e-9 waves |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 1.79e-9 waves |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.11e-9 waves |
| certified-fujifilm-xf90f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-gf-120f4-macro-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 2.42e-9 waves | Pass: opticalPath.maxAbs 2.32e-9 waves |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-konica-hexanon-60f12-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | 2 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 2.42e-10 waves |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves | Pass: opticalPath.maxAbs 2.81e-9 waves |
| certified-laowa-15f4-macro-zoom0-focus1 | 1 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-laowa-24f14-probe-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 2 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | 2 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 3.19e-9 waves | Pass: opticalPath.maxAbs 3.29e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 9.19e-10 waves |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | 2 | Pass: opd.maxAbs 1.69e-10 waves | Pass: opticalPath.maxAbs 1.38e-9 waves | Pass: opticalPath.maxAbs 1.35e-9 waves |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | 2 | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.60e-9 waves |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 8.71e-10 waves |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | 3 | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 6.77e-10 waves |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opticalPathToImage.maxAbs 8.71e-10 waves |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves |
| certified-leica-summilux-28f17-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.48e-9 waves |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 1.79e-9 waves | Pass: opd.maxAbs 1.79e-9 waves |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-minolta-af-100mm-f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-minolta-af-135mm-f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-minolta-af-20mm-f28-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 2.42e-10 waves |
| certified-minolta-af-24mm-f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-minolta-af-300mm-f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-nikkor-28f14d-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opticalPath.maxAbs 1.21e-9 waves |
| certified-nikkor-85f14d-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-nikkor-85f14g-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 2 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 9.19e-10 waves |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 1.02e-9 waves |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 2 | Pass: opticalPathToImage.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opticalPathToImage.maxAbs 1.69e-9 waves |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | 2 | Pass: opticalPath.maxAbs 2.08e-9 waves | Pass: opticalPath.maxAbs 2.32e-9 waves | Pass: opticalPath.maxAbs 2.42e-9 waves |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | 1 | Pass: opticalPath.maxAbs 2.03e-9 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 2.71e-9 waves | Pass: opticalPath.maxAbs 2.13e-9 waves |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | 2 | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 2.23e-9 waves | Pass: opticalPath.maxAbs 2.23e-9 waves |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 2.56e-9 waves | Pass: opticalPath.maxAbs 2.81e-9 waves |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | 3 | Pass: opticalPathToImage.maxAbs 5.80e-10 waves | Pass: opticalPath.maxAbs 2.61e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | 3 | Pass: opd.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 8.71e-10 waves |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves |
| certified-nikkor-n-28f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 8.71e-10 waves |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | 2 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.60e-9 waves | Pass: opd.maxAbs 1.50e-9 waves |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | 3 | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-nikkor-z-28f28-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opticalPath.maxAbs 1.33e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-nikkor-z-50f18s-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opticalPath.maxAbs 1.31e-9 waves | Pass: opd.maxAbs 1.21e-9 waves |
| certified-nikkor-z-70-200f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| certified-nikkor-z-70-200f28-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-nikkor-z-70-200f28-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPathToImage.maxAbs 1.16e-9 waves |
| certified-nikkor-z-85f18s-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves |
| certified-nikkor-z50f12-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 7.26e-11 waves | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.04e-9 waves |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 3 | Pass: opd.maxAbs 1.69e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.21e-10 waves |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.44e-9 waves | Pass: opticalPath.maxAbs 2.49e-9 waves | Pass: opticalPath.maxAbs 2.47e-9 waves |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 2.52e-9 waves | Pass: opticalPath.maxAbs 2.49e-9 waves |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 2.39e-9 waves | Pass: opd.maxAbs 2.42e-9 waves |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | 3 | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 7.74e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.04e-9 waves |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 1.06e-9 waves | Pass: opticalPathToImage.maxAbs 1.11e-9 waves |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 2 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opticalPath.maxAbs 2.56e-9 waves | Pass: opticalPath.maxAbs 2.42e-9 waves |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | 2 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 3.05e-9 waves | Pass: opticalPath.maxAbs 2.90e-9 waves |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 2 | Pass: opticalPath.maxAbs 4.35e-10 waves | Pass: opticalPath.maxAbs 3.10e-9 waves | Pass: opticalPath.maxAbs 3.19e-9 waves |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 9.19e-10 waves |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.02e-9 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opticalPathToImage.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 3 | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.55e-9 waves |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.35e-9 waves |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 2 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | 3 | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opticalPathToImage.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 2 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-nikon-afs-28f14e-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.08e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves | Pass: opticalPath.maxAbs 3.39e-9 waves |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 7.74e-10 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 2 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 3 | Pass: opticalPathToImage.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 4.84e-10 waves |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | 3 | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.06e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 1.02e-9 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 3 | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.60e-9 waves | Pass: opd.maxAbs 1.69e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | 3 | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.26e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | 3 | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opd.maxAbs 1.84e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 1 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opticalPath.maxAbs 1.16e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves | Pass: opticalPathToImage.maxAbs 1.45e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 3 | Pass: opticalPathToImage.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 2.13e-9 waves | Pass: opticalPathToImage.maxAbs 2.13e-9 waves |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | 1 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.11e-9 waves |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 3.87e-10 waves |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-nikon-micro-60f28g-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.50e-9 waves |
| certified-nikon-micro-60f28g-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPathToImage.maxAbs 1.40e-9 waves |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.21e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.55e-9 waves |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 3.19e-9 waves | Pass: opticalPath.maxAbs 3.24e-9 waves |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.43e-9 waves | Pass: opticalPath.maxAbs 3.43e-9 waves |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.52e-9 waves | Pass: opticalPath.maxAbs 2.23e-9 waves | Pass: opticalPath.maxAbs 2.32e-9 waves |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 2.03e-9 waves |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.47e-9 waves | Pass: opticalPath.maxAbs 2.47e-9 waves |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 1 | Pass: opticalPath.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.26e-9 waves |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-9 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves | Pass: opticalPathToImage.maxAbs 1.55e-9 waves |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | 2 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPathToImage.maxAbs 1.50e-9 waves |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | 3 | Pass: opticalPathToImage.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.89e-9 waves | Pass: opd.maxAbs 1.79e-9 waves |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | 3 | Pass: opticalPathToImage.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.69e-9 waves |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | 3 | Pass: opticalPathToImage.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 2.13e-9 waves | Pass: opticalPathToImage.maxAbs 2.37e-9 waves |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | 3 | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 2.18e-9 waves | Pass: opticalPath.maxAbs 2.18e-9 waves |
| certified-nikon-z-58f095-noct-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.45e-9 waves |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | 2 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 1.06e-9 waves |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 5.32e-10 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.55e-9 waves |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.45e-9 waves |
| certified-nikon-z-mc-105f28-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 9.19e-10 waves |
| certified-nikon-z-mc-105f28-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 7.74e-10 waves |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.93e-9 waves |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 2.13e-9 waves |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 1.62e-9 waves | Pass: opticalPath.maxAbs 1.62e-9 waves |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPathToImage.maxAbs 1.45e-9 waves |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opd.maxAbs 2.61e-9 waves | Pass: opd.maxAbs 2.71e-9 waves |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.23e-9 waves | Pass: opticalPath.maxAbs 2.06e-9 waves | Pass: opticalPath.maxAbs 2.06e-9 waves |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.55e-9 waves |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves | Pass: opd.maxAbs 1.55e-9 waves |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 1.35e-9 waves |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 2.13e-9 waves |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 1.45e-9 waves |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 1.89e-9 waves | Pass: opd.maxAbs 1.98e-9 waves |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.31e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 2 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 2.37e-9 waves | Pass: opd.maxAbs 2.71e-9 waves |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 1 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.06e-9 waves |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 2 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPathToImage.maxAbs 1.26e-9 waves |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 2 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 6.77e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPathToImage.maxAbs 8.71e-10 waves | Pass: opticalPathToImage.maxAbs 8.22e-10 waves |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 7.74e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | Pass: opticalPath.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | Pass: opd.maxAbs 8.71e-10 waves | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 2.03e-9 waves | Pass: opticalPath.maxAbs 2.08e-9 waves |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 4.35e-10 waves |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 3 | Pass: opticalPath.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 4.35e-10 waves |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.06e-9 waves |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.38e-9 waves | Pass: opticalPath.maxAbs 1.43e-9 waves |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.21e-9 waves | Pass: opticalPathToImage.maxAbs 1.26e-9 waves |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.31e-9 waves | Pass: opticalPathToImage.maxAbs 1.40e-9 waves |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.28e-9 waves | Pass: opticalPathToImage.maxAbs 1.33e-9 waves |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 1.14e-9 waves | Pass: opticalPath.maxAbs 1.14e-9 waves | Pass: opticalPath.maxAbs 1.21e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 1.60e-9 waves | Pass: opticalPathToImage.maxAbs 1.69e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 2.08e-9 waves | Pass: opticalPath.maxAbs 1.93e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 1.60e-9 waves | Pass: opd.maxAbs 1.60e-9 waves |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.60e-9 waves |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.18e-9 waves | Pass: opticalPathToImage.maxAbs 2.13e-9 waves |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 4.84e-11 waves | Pass: opticalPath.maxAbs 7.26e-11 waves |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.79e-9 waves | Pass: opd.maxAbs 1.55e-9 waves |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.16e-9 waves |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.16e-9 waves |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | 3 | Pass: opd.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 3 | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 4.84e-10 waves |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 2.52e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 9.19e-10 waves |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 8.71e-10 waves |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPathToImage.maxAbs 8.22e-10 waves |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | 2 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 8.47e-10 waves |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.69e-10 waves | Pass: opticalPath.maxAbs 1.67e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.31e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 1.26e-9 waves | Pass: opticalPathToImage.maxAbs 1.21e-9 waves |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.89e-9 waves |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | 3 | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.35e-9 waves |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 1.93e-9 waves | Pass: opd.maxAbs 2.18e-9 waves |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | 2 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 1.50e-9 waves |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 3.43e-9 waves | Pass: opticalPathToImage.maxAbs 3.48e-9 waves |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.35e-9 waves |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 1.69e-9 waves | Pass: opticalPathToImage.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.69e-10 waves | Pass: opticalPathToImage.maxAbs 1.79e-9 waves | Pass: opd.maxAbs 1.86e-9 waves |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.98e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.93e-9 waves | Pass: opd.maxAbs 2.61e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | 3 | Pass: opd.maxAbs 2.42e-9 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 2.32e-9 waves | Pass: opd.maxAbs 2.42e-9 waves |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.79e-9 waves | Pass: opticalPath.maxAbs 3.63e-9 waves | Pass: opticalPath.maxAbs 3.14e-9 waves |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.76e-9 waves | Pass: opticalPath.maxAbs 3.29e-9 waves | Pass: opticalPath.maxAbs 3.48e-9 waves |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 2.81e-9 waves | Pass: opticalPath.maxAbs 3.19e-9 waves | Pass: opticalPath.maxAbs 3.14e-9 waves |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.69e-9 waves | Pass: opd.maxAbs 2.37e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 3.29e-9 waves | Pass: opticalPath.maxAbs 3.24e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 5.80e-10 waves | Pass: opticalPath.maxAbs 3.05e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.58e-9 waves | Pass: opticalPath.maxAbs 3.43e-9 waves |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 2 | Pass: opticalPathToImage.maxAbs 1.21e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves | Pass: opticalPath.maxAbs 3.05e-9 waves |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.06e-9 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.74e-9 waves |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 2.90e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 3.19e-9 waves | Pass: opticalPath.maxAbs 3.19e-9 waves |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 1.64e-9 waves | Pass: opticalPathToImage.maxAbs 1.69e-9 waves |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.72e-9 waves | Pass: opticalPathToImage.maxAbs 1.69e-9 waves | Pass: opticalPathToImage.maxAbs 1.57e-9 waves |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.84e-9 waves | Pass: opd.maxAbs 2.13e-9 waves |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 2.56e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 2.94e-9 waves | Pass: opticalPath.maxAbs 2.94e-9 waves |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 3.00e-9 waves | Pass: opticalPath.maxAbs 3.19e-9 waves |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.26e-9 waves | Pass: opticalPath.maxAbs 1.31e-9 waves |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.69e-9 waves | Pass: opticalPath.maxAbs 1.81e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.77e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 9.67e-10 waves |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 3 | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 1.06e-9 waves |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 3.10e-9 waves | Pass: opticalPath.maxAbs 3.10e-9 waves |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 3.24e-9 waves | Pass: opticalPath.maxAbs 3.29e-9 waves |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 1.28e-9 waves |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 2.13e-9 waves | Pass: opticalPath.maxAbs 2.13e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.23e-9 waves | Pass: opticalPath.maxAbs 2.03e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | Pass: opd.maxAbs 2.81e-9 waves | Pass: opd.maxAbs 2.71e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | Pass: opd.maxAbs 2.42e-9 waves | Pass: opd.maxAbs 2.42e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 3 | Pass: opticalPath.maxAbs 4.35e-10 waves | Pass: opticalPathToImage.maxAbs 4.84e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | 3 | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 2.08e-9 waves | Pass: opd.maxAbs 2.03e-9 waves |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 2.13e-9 waves | Pass: opticalPath.maxAbs 2.13e-9 waves |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 3 | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 5.80e-10 waves | Pass: opticalPath.maxAbs 5.80e-10 waves |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 8.71e-10 waves | Pass: opticalPath.maxAbs 5.80e-10 waves |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 3 | Pass: opd.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 8.71e-10 waves | Pass: opd.maxAbs 8.71e-10 waves |
| certified-sigma-85f14-art-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.02e-9 waves | Pass: opticalPath.maxAbs 3.14e-9 waves | Pass: opticalPath.maxAbs 3.05e-9 waves |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 8.22e-10 waves | Pass: opticalPath.maxAbs 9.19e-10 waves |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.40e-9 waves | Pass: opticalPathToImage.maxAbs 1.35e-9 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: opd.maxAbs 6.77e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves | Pass: opd.maxAbs 5.80e-10 waves |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 2 | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 6.77e-10 waves |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-sigma-art-40-f14-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.66e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves | Pass: opticalPath.maxAbs 2.90e-9 waves |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 2.90e-9 waves | Pass: opticalPath.maxAbs 2.95e-9 waves |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.21e-9 waves | Pass: opticalPath.maxAbs 3.05e-9 waves | Pass: opticalPath.maxAbs 3.14e-9 waves |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.38e-9 waves | Pass: opd.maxAbs 1.28e-9 waves |
| certified-sigma-dp2m-30f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 1.28e-9 waves | Pass: opticalPath.maxAbs 1.28e-9 waves |
| certified-sonnar-e-24f18-za-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 2.06e-9 waves | Pass: opd.maxAbs 2.06e-9 waves |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 1.79e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 2.03e-9 waves | Pass: opticalPathToImage.maxAbs 2.08e-9 waves |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 9.19e-10 waves | Pass: opd.maxAbs 2.13e-9 waves | Pass: opd.maxAbs 2.23e-9 waves |
| certified-sony-e-20f28-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 7.50e-10 waves | Pass: opticalPathToImage.maxAbs 1.97e-9 waves | Pass: opticalPathToImage.maxAbs 1.95e-9 waves |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | 2 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 1.21e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | 2 | Pass: opd.maxAbs 1.21e-9 waves | Pass: opd.maxAbs 2.23e-9 waves | Pass: opd.maxAbs 2.37e-9 waves |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 2.52e-9 waves | Pass: opd.maxAbs 2.32e-9 waves |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | 3 | Pass: opd.maxAbs 2.23e-9 waves | Pass: opd.maxAbs 2.71e-9 waves | Pass: opticalPathToImage.maxAbs 2.71e-9 waves |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.16e-9 waves |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 1.06e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.72e-9 waves | Pass: opd.maxAbs 1.82e-9 waves | Pass: opd.maxAbs 1.87e-9 waves |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 1.40e-9 waves | Pass: opd.maxAbs 2.52e-9 waves | Pass: opd.maxAbs 2.61e-9 waves |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 3.72e-9 waves | Pass: opticalPath.maxAbs 3.63e-9 waves |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 2 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | 2 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.08e-9 waves | Pass: opd.maxAbs 2.13e-9 waves |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 2 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.68e-9 waves | Pass: opd.maxAbs 3.58e-9 waves |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 2 | Pass: opticalPath.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 1.69e-9 waves | Pass: opd.maxAbs 1.79e-9 waves |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 2 | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opd.maxAbs 1.84e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | 2 | Pass: opticalPathToImage.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 2.90e-9 waves | Pass: opticalPath.maxAbs 2.90e-9 waves |
| certified-sony-fe-24-f28-g-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 3.39e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-9 waves | Pass: opticalPathToImage.maxAbs 1.52e-9 waves |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 2 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.64e-9 waves | Pass: opd.maxAbs 1.69e-9 waves |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 2 | Pass: opd.maxAbs 5.20e-10 waves | Pass: opd.maxAbs 2.91e-9 waves | Pass: opticalPath.maxAbs 2.91e-9 waves |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 2 | Pass: opd.maxAbs 6.25e-10 waves | Pass: opd.maxAbs 2.39e-9 waves | Pass: opticalPath.maxAbs 2.39e-9 waves |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 2 | Pass: opd.maxAbs 7.29e-10 waves | Pass: opd.maxAbs 2.29e-9 waves | Pass: opticalPath.maxAbs 2.19e-9 waves |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.35e-9 waves | Pass: opticalPathToImage.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 3 | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opticalPathToImage.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.55e-9 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opd.maxAbs 1.16e-9 waves |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.79e-9 waves | Pass: opd.maxAbs 2.66e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-9 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opd.maxAbs 1.93e-9 waves |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.04e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 1.25e-9 waves | Pass: opd.maxAbs 2.08e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 1.04e-9 waves | Pass: opticalPath.maxAbs 1.67e-9 waves | Pass: opticalPath.maxAbs 1.67e-9 waves |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 3.54e-9 waves | Pass: opticalPath.maxAbs 3.64e-9 waves | Pass: opticalPath.maxAbs 2.91e-9 waves |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 3.75e-9 waves | Pass: opticalPath.maxAbs 3.75e-9 waves | Pass: opticalPath.maxAbs 2.81e-9 waves |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 3.33e-9 waves | Pass: opticalPath.maxAbs 3.33e-9 waves | Pass: opticalPath.maxAbs 2.91e-9 waves |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.16e-9 waves |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 2 | Pass: opticalPath.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 1.35e-9 waves | Pass: opticalPath.maxAbs 1.26e-9 waves |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 2 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.60e-9 waves | Pass: opticalPath.maxAbs 2.23e-9 waves | Pass: opd.maxAbs 2.23e-9 waves |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 2.23e-9 waves | Pass: opticalPath.maxAbs 2.18e-9 waves |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.81e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | 3 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 2.71e-9 waves | Pass: opticalPath.maxAbs 2.76e-9 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPath.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.71e-9 waves | Pass: opticalPath.maxAbs 3.37e-9 waves | Pass: opticalPath.maxAbs 3.37e-9 waves |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 2.23e-9 waves | Pass: opticalPath.maxAbs 1.45e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | Pass: opd.maxAbs 2.61e-9 waves | Pass: opd.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | Pass: opd.maxAbs 2.90e-9 waves | Pass: opd.maxAbs 2.61e-9 waves | Pass: opd.maxAbs 2.13e-9 waves |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 1.74e-9 waves | Pass: opticalPath.maxAbs 1.74e-9 waves |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | 3 | Pass: opd.maxAbs 2.13e-9 waves | Pass: opticalPath.maxAbs 1.84e-9 waves | Pass: opticalPath.maxAbs 2.03e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opd.maxAbs 1.93e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | Pass: opticalPath.maxAbs 1.74e-9 waves | Pass: opd.maxAbs 2.32e-9 waves | Pass: opd.maxAbs 1.64e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | Pass: opd.maxAbs 2.23e-9 waves | Pass: opticalPath.maxAbs 2.13e-9 waves | Pass: opticalPath.maxAbs 1.55e-9 waves |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 5.80e-10 waves | Pass: opticalPath.maxAbs 5.80e-10 waves |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 3 | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 6.77e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 8.71e-10 waves |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | 3 | Pass: opd.maxAbs 9.67e-10 waves | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 9.67e-10 waves |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | 3 | Pass: opticalPath.maxAbs 7.74e-10 waves | Pass: opd.maxAbs 1.16e-9 waves | Pass: opticalPath.maxAbs 7.74e-10 waves |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 4.84e-10 waves |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 3 | Pass: opd.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opd.maxAbs 3.87e-10 waves |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPathToImage.maxAbs 2.42e-10 waves |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.18e-10 waves | Pass: opticalPath.maxAbs 8.71e-10 waves | Pass: opticalPath.maxAbs 8.47e-10 waves |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.18e-10 waves | Pass: opticalPathToImage.maxAbs 1.21e-9 waves | Pass: opticalPathToImage.maxAbs 1.21e-9 waves |
| certified-ultron-28f2-asph-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.03e-9 waves | Pass: opticalPath.maxAbs 2.83e-9 waves | Pass: opticalPath.maxAbs 2.81e-9 waves |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 2.47e-9 waves | Pass: opd.maxAbs 2.52e-9 waves |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 1.93e-10 waves |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 3.02e-9 waves | Pass: opticalPath.maxAbs 3.00e-9 waves |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 1.93e-10 waves |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.66e-9 waves | Pass: opticalPath.maxAbs 2.41e-9 waves | Pass: opticalPath.maxAbs 2.66e-9 waves |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.21e-10 waves | Pass: opticalPath.maxAbs 2.56e-9 waves | Pass: opticalPath.maxAbs 2.59e-9 waves |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.45e-10 waves | Pass: opd.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.21e-10 waves |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 2.90e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | 3 | Pass: opticalPathToImage.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.21e-10 waves | Pass: opticalPathToImage.maxAbs 1.21e-10 waves |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.69e-10 waves | Pass: opticalPath.maxAbs 2.85e-9 waves | Pass: opticalPath.maxAbs 2.85e-9 waves |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.21e-10 waves |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 1.21e-10 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 1.45e-10 waves |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | 3 | Pass: opd.maxAbs 9.67e-11 waves | Pass: opd.maxAbs 7.26e-11 waves | Pass: opticalPathToImage.maxAbs 7.26e-11 waves |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | 3 | Pass: opd.maxAbs 3.39e-10 waves | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 2.42e-10 waves |
| certified-zeiss-batis-18f28-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.26e-9 waves | Pass: opd.maxAbs 1.89e-9 waves | Pass: opticalPath.maxAbs 1.79e-9 waves |
| certified-zeiss-batis-85f18-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 3 | Pass: opd.maxAbs 4.35e-10 waves | Pass: opd.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 1.40e-9 waves |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | 3 | Pass: opticalPath.maxAbs 1.45e-9 waves | Pass: opticalPath.maxAbs 2.59e-9 waves | Pass: opticalPath.maxAbs 2.52e-9 waves |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | 3 | Pass: opticalPath.maxAbs 1.09e-9 waves | Pass: opticalPath.maxAbs 2.54e-9 waves | Pass: opticalPath.maxAbs 2.56e-9 waves |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | 3 | Pass: opd.maxAbs 1.06e-9 waves | Pass: opticalPathToImage.maxAbs 1.93e-9 waves | Pass: opticalPathToImage.maxAbs 1.89e-9 waves |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.91e-9 waves | Pass: opticalPathToImage.maxAbs 1.93e-9 waves |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.35e-9 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | cut tangential, field 6.42e1 deg, frequencyPerMm 96 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1295597 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 1 | certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | — |
| lv – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 4.37e-10 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | cut tangential, field 6.42e1 deg, frequencyPerMm 52 |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1295597 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 1 | certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | — |
| optiland – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.58e-9 | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | cut tangential, field 6.42e1 deg, frequencyPerMm 96 |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1295597 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 1 | certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.47e-12 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 2.37e-12 |
| certified-apo-lanthar-50f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.37e-13 | Pass: mtf.maxAbs 3.30e-12 | Pass: mtf.maxAbs 3.04e-12 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.63e-12 | Pass: mtf.maxAbs 6.68e-13 | Pass: mtf.maxAbs 1.70e-12 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.33e-12 | Pass: mtf.maxAbs 8.44e-13 | Pass: mtf.maxAbs 1.45e-12 |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.44e-12 | Pass: mtf.maxAbs 1.59e-12 | Pass: mtf.maxAbs 1.12e-12 |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 1.35e-12 | Pass: mtf.maxAbs 9.61e-13 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.36e-12 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 1.71e-12 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.37e-12 | Pass: mtf.maxAbs 1.96e-12 | Pass: mtf.maxAbs 3.20e-12 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 2 | Pass: mtf.maxAbs 2.54e-12 | Pass: mtf.maxAbs 2.14e-12 | Pass: mtf.maxAbs 2.94e-12 |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.16e-12 | Pass: mtf.maxAbs 1.34e-12 | Pass: mtf.maxAbs 2.00e-12 |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.53e-12 | Pass: mtf.maxAbs 2.64e-12 | Pass: mtf.maxAbs 2.81e-12 |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.92e-12 | Pass: mtf.maxAbs 1.47e-12 | Pass: mtf.maxAbs 1.33e-12 |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.21e-13 | Pass: mtf.maxAbs 6.62e-13 | Pass: mtf.maxAbs 1.11e-12 |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.75e-12 | Pass: mtf.maxAbs 8.67e-13 | Pass: mtf.maxAbs 1.27e-12 |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.67e-13 | Pass: mtf.maxAbs 2.32e-12 | Pass: mtf.maxAbs 2.23e-12 |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 5.03e-12 | Pass: mtf.maxAbs 5.27e-12 |
| certified-canon-fd-35-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 7.52e-13 | Pass: mtf.maxAbs 1.29e-12 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 2 | Pass: mtf.maxAbs 8.75e-13 | Pass: mtf.maxAbs 1.26e-12 | Pass: mtf.maxAbs 2.14e-12 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 2 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 8.41e-13 | Pass: mtf.maxAbs 1.14e-12 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 2 | Pass: mtf.maxAbs 8.14e-13 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 1.18e-12 |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 3.38e-12 | Pass: mtf.maxAbs 3.48e-12 |
| certified-canon-rf-50-f12-l-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 1.70e-12 |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.15e-12 | Pass: mtf.maxAbs 3.46e-12 | Pass: mtf.maxAbs 2.52e-12 |
| certified-canon-rf-85f2-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 8.85e-13 | Pass: mtf.maxAbs 1.81e-12 |
| certified-canon-rf-85f2-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 9.74e-13 | Pass: mtf.maxAbs 5.85e-13 | Pass: mtf.maxAbs 7.86e-13 |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 5.94e-12 | Pass: mtf.maxAbs 5.56e-12 |
| certified-canon-rf100f28-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.12e-12 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 2.32e-12 |
| certified-canon-rf100f28-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.64e-12 | Pass: mtf.maxAbs 2.28e-12 | Pass: mtf.maxAbs 2.56e-12 |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.51e-12 | Pass: mtf.maxAbs 1.04e-12 | Pass: mtf.maxAbs 1.28e-12 |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.74e-12 | Pass: mtf.maxAbs 8.18e-13 | Pass: mtf.maxAbs 2.15e-12 |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.47e-11 | Pass: mtf.maxAbs 3.61e-11 | Pass: mtf.maxAbs 2.25e-11 |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 1.05e-11 | Pass: mtf.maxAbs 9.56e-12 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.31e-11 | Pass: mtf.maxAbs 7.43e-11 | Pass: mtf.maxAbs 1.34e-11 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.55e-12 | Pass: mtf.maxAbs 6.70e-12 | Pass: mtf.maxAbs 6.35e-12 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 3 | Pass: mtf.maxAbs 6.27e-12 | Pass: mtf.maxAbs 5.37e-12 | Pass: mtf.maxAbs 8.27e-12 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.62e-12 | Pass: mtf.maxAbs 2.32e-12 | Pass: mtf.maxAbs 3.14e-12 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | 3 | Pass: mtf.maxAbs 2.26e-12 | Pass: mtf.maxAbs 6.96e-12 | Pass: mtf.maxAbs 8.15e-12 |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.72e-12 | Pass: mtf.maxAbs 3.87e-12 | Pass: mtf.maxAbs 6.06e-12 |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 3 | Pass: mtf.maxAbs 4.43e-12 | Pass: mtf.maxAbs 4.07e-12 | Pass: mtf.maxAbs 6.61e-12 |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.13e-11 | Pass: mtf.maxAbs 9.44e-12 | Pass: mtf.maxAbs 5.13e-12 |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.34e-11 | Pass: mtf.maxAbs 1.28e-11 | Pass: mtf.maxAbs 1.15e-11 |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.07e-12 | Pass: mtf.maxAbs 7.76e-12 | Pass: mtf.maxAbs 9.28e-12 |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 6.43e-12 | Pass: mtf.maxAbs 6.81e-12 |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 1.46e-12 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.35e-9 | Pass: mtf.maxAbs 4.37e-10 | Pass: mtf.maxAbs 1.58e-9 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.53e-10 | Pass: mtf.maxAbs 1.93e-10 | Pass: mtf.maxAbs 2.78e-10 |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | Pass: mtf.maxAbs 2.62e-12 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 1.98e-12 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.13e-11 | Pass: mtf.maxAbs 1.74e-11 | Pass: mtf.maxAbs 1.67e-11 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 1.41e-11 | Pass: mtf.maxAbs 1.46e-11 |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.19e-10 | Pass: mtf.maxAbs 3.39e-10 | Pass: mtf.maxAbs 1.15e-10 |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.76e-12 | Pass: mtf.maxAbs 4.89e-12 | Pass: mtf.maxAbs 4.36e-12 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.62e-12 | Pass: mtf.maxAbs 3.02e-12 | Pass: mtf.maxAbs 4.26e-12 |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.63e-12 | Pass: mtf.maxAbs 3.09e-12 | Pass: mtf.maxAbs 4.72e-12 |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.91e-12 | Pass: mtf.maxAbs 3.53e-12 | Pass: mtf.maxAbs 5.73e-12 |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.53e-11 | Pass: mtf.maxAbs 1.38e-11 | Pass: mtf.maxAbs 1.41e-11 |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 6.07e-12 | Pass: mtf.maxAbs 6.05e-12 |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.75e-12 | Pass: mtf.maxAbs 4.37e-12 | Pass: mtf.maxAbs 5.43e-12 |
| certified-fujifilm-xf50-f1-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.05e-11 | Pass: mtf.maxAbs 4.32e-12 | Pass: mtf.maxAbs 1.98e-11 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.25e-13 | Pass: mtf.maxAbs 1.41e-12 | Pass: mtf.maxAbs 1.34e-12 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.22e-12 | Pass: mtf.maxAbs 8.96e-13 | Pass: mtf.maxAbs 1.41e-12 |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.90e-12 | Pass: mtf.maxAbs 5.93e-12 | Pass: mtf.maxAbs 6.92e-12 |
| certified-fujifilm-xf90f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 1.35e-12 | Pass: mtf.maxAbs 2.38e-12 |
| certified-gf-120f4-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 1.47e-12 | Pass: mtf.maxAbs 2.19e-12 |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.47e-12 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.69e-12 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.52e-12 | Pass: mtf.maxAbs 1.26e-12 | Pass: mtf.maxAbs 2.78e-12 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 3.45e-13 | Pass: mtf.maxAbs 1.06e-12 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.42e-12 | Pass: mtf.maxAbs 6.28e-12 | Pass: mtf.maxAbs 5.76e-12 |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.05e-12 | Pass: mtf.maxAbs 5.37e-13 | Pass: mtf.maxAbs 6.41e-13 |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 5.41e-13 | Pass: mtf.maxAbs 9.64e-13 |
| certified-konica-hexanon-60f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.08e-12 | Pass: mtf.maxAbs 9.28e-13 | Pass: mtf.maxAbs 1.75e-12 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.40e-12 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 2.10e-12 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | 2 | Pass: mtf.maxAbs 1.54e-12 | Pass: mtf.maxAbs 1.32e-12 | Pass: mtf.maxAbs 2.53e-12 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.17e-12 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 1.96e-12 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.89e-12 | Pass: mtf.maxAbs 1.75e-12 | Pass: mtf.maxAbs 2.12e-12 |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 1.22e-12 |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.43e-12 | Pass: mtf.maxAbs 8.48e-12 | Pass: mtf.maxAbs 8.42e-12 |
| certified-laowa-15f4-macro-zoom0-focus1 | 1 | Pass: mtf.maxAbs 4.46e-13 | Pass: mtf.maxAbs 4.29e-13 | Pass: mtf.maxAbs 5.33e-13 |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.53e-11 | Pass: mtf.maxAbs 1.34e-11 | Pass: mtf.maxAbs 1.31e-11 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.83e-12 | Pass: mtf.maxAbs 2.12e-12 | Pass: mtf.maxAbs 1.54e-12 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.86e-12 | Pass: mtf.maxAbs 1.77e-12 | Pass: mtf.maxAbs 1.90e-12 |
| certified-laowa-24f14-probe-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.17e-12 | Pass: mtf.maxAbs 2.47e-12 | Pass: mtf.maxAbs 4.45e-12 |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.27e-12 | Pass: mtf.maxAbs 1.78e-12 | Pass: mtf.maxAbs 5.73e-12 |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.22e-12 | Pass: mtf.maxAbs 1.63e-12 | Pass: mtf.maxAbs 2.04e-12 |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 2 | Pass: mtf.maxAbs 9.85e-13 | Pass: mtf.maxAbs 7.78e-13 | Pass: mtf.maxAbs 1.23e-12 |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | 2 | Pass: mtf.maxAbs 1.51e-12 | Pass: mtf.maxAbs 1.03e-12 | Pass: mtf.maxAbs 2.07e-12 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.98e-13 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 8.03e-13 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 1.99e-12 | Pass: mtf.maxAbs 1.95e-12 |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.90e-12 | Pass: mtf.maxAbs 5.32e-12 | Pass: mtf.maxAbs 7.10e-12 |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.45e-12 | Pass: mtf.maxAbs 1.98e-12 |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | 2 | Pass: mtf.maxAbs 3.70e-13 | Pass: mtf.maxAbs 3.71e-12 | Pass: mtf.maxAbs 4.01e-12 |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | 2 | Pass: mtf.maxAbs 4.98e-13 | Pass: mtf.maxAbs 1.53e-12 | Pass: mtf.maxAbs 1.75e-12 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.87e-12 | Pass: mtf.maxAbs 9.47e-13 | Pass: mtf.maxAbs 2.15e-12 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.51e-12 | Pass: mtf.maxAbs 1.23e-12 | Pass: mtf.maxAbs 1.66e-12 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.05e-12 | Pass: mtf.maxAbs 2.41e-12 | Pass: mtf.maxAbs 2.18e-12 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.39e-12 | Pass: mtf.maxAbs 3.18e-12 | Pass: mtf.maxAbs 2.25e-12 |
| certified-leica-summilux-28f17-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.87e-12 | Pass: mtf.maxAbs 1.37e-11 | Pass: mtf.maxAbs 1.49e-11 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.39e-12 | Pass: mtf.maxAbs 3.52e-12 | Pass: mtf.maxAbs 4.51e-12 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | Pass: mtf.maxAbs 9.81e-13 | Pass: mtf.maxAbs 3.15e-12 | Pass: mtf.maxAbs 2.87e-12 |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.80e-13 | Pass: mtf.maxAbs 3.22e-12 | Pass: mtf.maxAbs 3.60e-12 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.89e-12 | Pass: mtf.maxAbs 4.18e-12 | Pass: mtf.maxAbs 4.14e-12 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 4.26e-12 | Pass: mtf.maxAbs 4.50e-12 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | 3 | Pass: mtf.maxAbs 3.21e-12 | Pass: mtf.maxAbs 3.41e-12 | Pass: mtf.maxAbs 5.84e-12 |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.99e-12 |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.23e-12 | Pass: mtf.maxAbs 7.66e-13 | Pass: mtf.maxAbs 1.27e-12 |
| certified-minolta-af-100mm-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.24e-12 | Pass: mtf.maxAbs 9.86e-13 | Pass: mtf.maxAbs 1.26e-12 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.27e-12 | Pass: mtf.maxAbs 1.34e-12 | Pass: mtf.maxAbs 1.40e-12 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.44e-12 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 1.75e-12 |
| certified-minolta-af-135mm-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.47e-12 | Pass: mtf.maxAbs 1.08e-12 | Pass: mtf.maxAbs 1.66e-12 |
| certified-minolta-af-20mm-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.86e-12 | Pass: mtf.maxAbs 9.80e-13 | Pass: mtf.maxAbs 1.68e-12 |
| certified-minolta-af-24mm-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.17e-12 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 1.20e-12 |
| certified-minolta-af-300mm-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.30e-12 | Pass: mtf.maxAbs 2.05e-12 | Pass: mtf.maxAbs 2.48e-12 |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.32e-12 | Pass: mtf.maxAbs 2.77e-12 | Pass: mtf.maxAbs 3.90e-12 |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.17e-12 | Pass: mtf.maxAbs 8.73e-13 | Pass: mtf.maxAbs 1.30e-12 |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.20e-12 | Pass: mtf.maxAbs 2.73e-12 | Pass: mtf.maxAbs 2.10e-12 |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 1.44e-12 | Pass: mtf.maxAbs 1.85e-12 |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.16e-12 | Pass: mtf.maxAbs 1.50e-12 | Pass: mtf.maxAbs 1.59e-12 |
| certified-nikkor-28f14d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.72e-12 |
| certified-nikkor-85f14d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.41e-12 | Pass: mtf.maxAbs 7.93e-13 | Pass: mtf.maxAbs 1.51e-12 |
| certified-nikkor-85f14g-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.79e-12 | Pass: mtf.maxAbs 1.08e-12 | Pass: mtf.maxAbs 1.37e-12 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 2 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 5.73e-13 | Pass: mtf.maxAbs 9.60e-13 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.19e-12 | Pass: mtf.maxAbs 1.40e-12 | Pass: mtf.maxAbs 2.65e-12 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 2 | Pass: mtf.maxAbs 1.94e-12 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 2.08e-12 |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | 2 | Pass: mtf.maxAbs 2.21e-12 | Pass: mtf.maxAbs 4.67e-12 | Pass: mtf.maxAbs 5.23e-12 |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | 1 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 7.78e-13 | Pass: mtf.maxAbs 1.06e-12 |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | 3 | Pass: mtf.maxAbs 4.54e-12 | Pass: mtf.maxAbs 2.17e-12 | Pass: mtf.maxAbs 2.94e-12 |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | 2 | Pass: mtf.maxAbs 1.40e-12 | Pass: mtf.maxAbs 8.38e-13 | Pass: mtf.maxAbs 1.75e-12 |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.28e-12 | Pass: mtf.maxAbs 7.30e-12 | Pass: mtf.maxAbs 8.20e-12 |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | 3 | Pass: mtf.maxAbs 1.72e-12 | Pass: mtf.maxAbs 1.93e-12 | Pass: mtf.maxAbs 2.49e-12 |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.18e-12 | Pass: mtf.maxAbs 1.35e-12 | Pass: mtf.maxAbs 4.06e-12 |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | 3 | Pass: mtf.maxAbs 5.59e-12 | Pass: mtf.maxAbs 2.35e-12 | Pass: mtf.maxAbs 3.70e-12 |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | 3 | Pass: mtf.maxAbs 3.30e-12 | Pass: mtf.maxAbs 2.22e-12 | Pass: mtf.maxAbs 3.05e-12 |
| certified-nikkor-n-28f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.65e-12 |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 2.07e-12 | Pass: mtf.maxAbs 1.88e-12 |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | 3 | Pass: mtf.maxAbs 4.84e-12 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 3.25e-12 |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | 2 | Pass: mtf.maxAbs 8.00e-13 | Pass: mtf.maxAbs 7.38e-13 | Pass: mtf.maxAbs 1.48e-12 |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | 3 | Pass: mtf.maxAbs 8.96e-13 | Pass: mtf.maxAbs 3.52e-12 | Pass: mtf.maxAbs 3.42e-12 |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 3 | Pass: mtf.maxAbs 5.73e-12 | Pass: mtf.maxAbs 4.03e-12 | Pass: mtf.maxAbs 3.79e-12 |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | 3 | Pass: mtf.maxAbs 6.89e-12 | Pass: mtf.maxAbs 7.22e-12 | Pass: mtf.maxAbs 7.54e-12 |
| certified-nikkor-z-28f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.09e-12 | Pass: mtf.maxAbs 3.56e-12 | Pass: mtf.maxAbs 3.27e-12 |
| certified-nikkor-z-50f18s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.49e-12 | Pass: mtf.maxAbs 1.96e-12 | Pass: mtf.maxAbs 4.36e-12 |
| certified-nikkor-z-70-200f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.96e-12 | Pass: mtf.maxAbs 2.42e-12 | Pass: mtf.maxAbs 2.46e-12 |
| certified-nikkor-z-70-200f28-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.99e-12 | Pass: mtf.maxAbs 3.12e-12 | Pass: mtf.maxAbs 2.89e-12 |
| certified-nikkor-z-70-200f28-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.54e-12 | Pass: mtf.maxAbs 3.02e-12 | Pass: mtf.maxAbs 3.37e-12 |
| certified-nikkor-z-85f18s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.80e-13 | Pass: mtf.maxAbs 7.22e-13 | Pass: mtf.maxAbs 1.08e-12 |
| certified-nikkor-z50f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.66e-12 | Pass: mtf.maxAbs 3.91e-12 | Pass: mtf.maxAbs 5.03e-12 |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.74e-13 | Pass: mtf.maxAbs 2.16e-11 | Pass: mtf.maxAbs 2.15e-11 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.30e-13 | Pass: mtf.maxAbs 3.24e-13 | Pass: mtf.maxAbs 6.12e-13 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 3 | Pass: mtf.maxAbs 4.53e-13 | Pass: mtf.maxAbs 4.18e-13 | Pass: mtf.maxAbs 6.43e-13 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.94e-13 | Pass: mtf.maxAbs 5.36e-12 | Pass: mtf.maxAbs 5.34e-12 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.88e-13 | Pass: mtf.maxAbs 1.68e-12 | Pass: mtf.maxAbs 1.86e-12 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 3 | Pass: mtf.maxAbs 6.11e-13 | Pass: mtf.maxAbs 2.14e-12 | Pass: mtf.maxAbs 1.88e-12 |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.81e-13 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.22e-12 |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.58e-12 | Pass: mtf.maxAbs 1.69e-12 | Pass: mtf.maxAbs 3.83e-12 |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.61e-12 | Pass: mtf.maxAbs 2.84e-12 | Pass: mtf.maxAbs 3.34e-12 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.89e-12 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 1.65e-12 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.36e-12 | Pass: mtf.maxAbs 1.38e-12 | Pass: mtf.maxAbs 2.14e-12 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.78e-13 | Pass: mtf.maxAbs 1.67e-12 | Pass: mtf.maxAbs 1.64e-12 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.06e-12 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 1.24e-12 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.36e-13 | Pass: mtf.maxAbs 7.51e-13 | Pass: mtf.maxAbs 6.29e-13 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.13e-12 | Pass: mtf.maxAbs 8.03e-13 | Pass: mtf.maxAbs 9.88e-13 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.07e-13 | Pass: mtf.maxAbs 1.91e-12 | Pass: mtf.maxAbs 2.22e-12 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 1.62e-12 | Pass: mtf.maxAbs 1.56e-12 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.44e-13 | Pass: mtf.maxAbs 7.93e-13 | Pass: mtf.maxAbs 1.34e-12 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.04e-12 | Pass: mtf.maxAbs 1.24e-12 | Pass: mtf.maxAbs 1.82e-12 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 2 | Pass: mtf.maxAbs 1.24e-12 | Pass: mtf.maxAbs 1.31e-12 | Pass: mtf.maxAbs 1.97e-12 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | 2 | Pass: mtf.maxAbs 9.17e-13 | Pass: mtf.maxAbs 6.99e-13 | Pass: mtf.maxAbs 1.26e-12 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 2 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 1.48e-12 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 2 | Pass: mtf.maxAbs 6.59e-13 | Pass: mtf.maxAbs 6.30e-13 | Pass: mtf.maxAbs 9.41e-13 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | 3 | Pass: mtf.maxAbs 7.81e-13 | Pass: mtf.maxAbs 3.20e-12 | Pass: mtf.maxAbs 3.20e-12 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 3 | Pass: mtf.maxAbs 8.39e-13 | Pass: mtf.maxAbs 3.28e-12 | Pass: mtf.maxAbs 3.24e-12 |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.62e-12 | Pass: mtf.maxAbs 3.03e-12 | Pass: mtf.maxAbs 3.06e-12 |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.66e-12 | Pass: mtf.maxAbs 2.48e-12 |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.70e-12 | Pass: mtf.maxAbs 2.03e-12 | Pass: mtf.maxAbs 8.87e-12 |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.18e-12 | Pass: mtf.maxAbs 2.81e-12 | Pass: mtf.maxAbs 3.90e-12 |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.72e-12 | Pass: mtf.maxAbs 2.86e-12 | Pass: mtf.maxAbs 4.78e-12 |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.39e-12 | Pass: mtf.maxAbs 4.26e-12 | Pass: mtf.maxAbs 4.86e-12 |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.48e-12 | Pass: mtf.maxAbs 3.46e-12 | Pass: mtf.maxAbs 4.23e-12 |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.09e-12 | Pass: mtf.maxAbs 6.62e-12 | Pass: mtf.maxAbs 1.36e-11 |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | 3 | Pass: mtf.maxAbs 4.29e-12 | Pass: mtf.maxAbs 4.24e-12 | Pass: mtf.maxAbs 5.57e-12 |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.62e-12 | Pass: mtf.maxAbs 2.28e-12 | Pass: mtf.maxAbs 2.13e-12 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 2 | Pass: mtf.maxAbs 2.50e-12 | Pass: mtf.maxAbs 7.47e-13 | Pass: mtf.maxAbs 1.97e-12 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.39e-12 | Pass: mtf.maxAbs 1.69e-12 | Pass: mtf.maxAbs 2.20e-12 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 3 | Pass: mtf.maxAbs 3.15e-12 | Pass: mtf.maxAbs 1.60e-12 | Pass: mtf.maxAbs 3.59e-12 |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 2 | Pass: mtf.maxAbs 1.03e-12 | Pass: mtf.maxAbs 6.57e-13 | Pass: mtf.maxAbs 7.33e-13 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.66e-12 | Pass: mtf.maxAbs 7.36e-13 | Pass: mtf.maxAbs 1.26e-12 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.46e-12 | Pass: mtf.maxAbs 1.56e-12 | Pass: mtf.maxAbs 3.25e-12 |
| certified-nikon-afs-28f14e-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.83e-12 | Pass: mtf.maxAbs 9.39e-12 | Pass: mtf.maxAbs 6.55e-12 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.60e-12 | Pass: mtf.maxAbs 2.20e-12 | Pass: mtf.maxAbs 2.65e-12 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.81e-12 | Pass: mtf.maxAbs 1.81e-12 | Pass: mtf.maxAbs 2.82e-12 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 3 | Pass: mtf.maxAbs 6.59e-12 | Pass: mtf.maxAbs 3.98e-12 | Pass: mtf.maxAbs 6.76e-12 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.58e-12 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 1.63e-12 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 2 | Pass: mtf.maxAbs 1.79e-12 | Pass: mtf.maxAbs 9.28e-13 | Pass: mtf.maxAbs 1.93e-12 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.01e-11 | Pass: mtf.maxAbs 6.45e-12 | Pass: mtf.maxAbs 8.50e-12 |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 7.43e-13 | Pass: mtf.maxAbs 8.08e-13 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 8.66e-13 | Pass: mtf.maxAbs 1.52e-12 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 1.06e-12 | Pass: mtf.maxAbs 1.18e-12 |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 8.47e-13 | Pass: mtf.maxAbs 1.41e-12 |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.51e-12 | Pass: mtf.maxAbs 1.66e-12 | Pass: mtf.maxAbs 3.40e-12 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 2 | Pass: mtf.maxAbs 8.16e-13 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 1.52e-12 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.33e-12 | Pass: mtf.maxAbs 2.00e-12 | Pass: mtf.maxAbs 1.79e-12 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 2.09e-12 | Pass: mtf.maxAbs 2.85e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 3 | Pass: mtf.maxAbs 2.26e-12 | Pass: mtf.maxAbs 6.99e-12 | Pass: mtf.maxAbs 7.29e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | 3 | Pass: mtf.maxAbs 2.94e-12 | Pass: mtf.maxAbs 7.69e-12 | Pass: mtf.maxAbs 8.20e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | 3 | Pass: mtf.maxAbs 1.92e-12 | Pass: mtf.maxAbs 8.85e-12 | Pass: mtf.maxAbs 1.04e-11 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | 3 | Pass: mtf.maxAbs 2.22e-12 | Pass: mtf.maxAbs 6.31e-12 | Pass: mtf.maxAbs 7.89e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 1 | Pass: mtf.maxAbs 1.91e-12 | Pass: mtf.maxAbs 4.34e-12 | Pass: mtf.maxAbs 4.91e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | 3 | Pass: mtf.maxAbs 2.02e-12 | Pass: mtf.maxAbs 8.67e-12 | Pass: mtf.maxAbs 8.52e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 3 | Pass: mtf.maxAbs 3.06e-12 | Pass: mtf.maxAbs 7.98e-12 | Pass: mtf.maxAbs 7.50e-12 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | 1 | Pass: mtf.maxAbs 1.88e-12 | Pass: mtf.maxAbs 3.85e-12 | Pass: mtf.maxAbs 3.29e-12 |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.57e-12 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 1.37e-12 |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.11e-12 | Pass: mtf.maxAbs 1.52e-12 | Pass: mtf.maxAbs 1.55e-12 |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 9.16e-13 | Pass: mtf.maxAbs 1.37e-12 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 1.34e-12 | Pass: mtf.maxAbs 1.45e-12 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.66e-12 | Pass: mtf.maxAbs 2.14e-12 | Pass: mtf.maxAbs 1.38e-12 |
| certified-nikon-micro-60f28g-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 6.48e-12 | Pass: mtf.maxAbs 6.26e-12 |
| certified-nikon-micro-60f28g-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.61e-12 | Pass: mtf.maxAbs 3.72e-12 | Pass: mtf.maxAbs 4.44e-12 |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.81e-12 | Pass: mtf.maxAbs 1.09e-12 | Pass: mtf.maxAbs 2.02e-12 |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.28e-12 | Pass: mtf.maxAbs 2.62e-12 | Pass: mtf.maxAbs 2.40e-12 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.26e-12 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 5.77e-12 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.71e-12 | Pass: mtf.maxAbs 1.91e-12 | Pass: mtf.maxAbs 3.52e-12 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | 3 | Pass: mtf.maxAbs 4.76e-12 | Pass: mtf.maxAbs 5.36e-12 | Pass: mtf.maxAbs 6.55e-12 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.24e-12 | Pass: mtf.maxAbs 1.61e-11 | Pass: mtf.maxAbs 1.49e-11 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | 3 | Pass: mtf.maxAbs 5.47e-12 | Pass: mtf.maxAbs 7.35e-12 | Pass: mtf.maxAbs 6.52e-12 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.67e-12 | Pass: mtf.maxAbs 3.22e-12 | Pass: mtf.maxAbs 3.80e-12 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.56e-12 | Pass: mtf.maxAbs 3.65e-12 | Pass: mtf.maxAbs 5.05e-12 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 3.27e-12 | Pass: mtf.maxAbs 2.99e-12 |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.76e-12 | Pass: mtf.maxAbs 5.69e-12 | Pass: mtf.maxAbs 5.36e-12 |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 1 | Pass: mtf.maxAbs 9.36e-13 | Pass: mtf.maxAbs 1.31e-13 | Pass: mtf.maxAbs 8.05e-13 |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.91e-13 | Pass: mtf.maxAbs 5.61e-13 | Pass: mtf.maxAbs 1.02e-12 |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | 3 | Pass: mtf.maxAbs 8.93e-12 | Pass: mtf.maxAbs 8.92e-12 | Pass: mtf.maxAbs 7.92e-12 |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | 2 | Pass: mtf.maxAbs 8.26e-13 | Pass: mtf.maxAbs 1.83e-12 | Pass: mtf.maxAbs 2.29e-12 |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | 3 | Pass: mtf.maxAbs 7.16e-12 | Pass: mtf.maxAbs 1.37e-11 | Pass: mtf.maxAbs 8.76e-12 |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | 3 | Pass: mtf.maxAbs 4.83e-12 | Pass: mtf.maxAbs 1.51e-11 | Pass: mtf.maxAbs 1.16e-11 |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | 3 | Pass: mtf.maxAbs 2.25e-12 | Pass: mtf.maxAbs 1.14e-11 | Pass: mtf.maxAbs 1.20e-11 |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | 3 | Pass: mtf.maxAbs 3.72e-12 | Pass: mtf.maxAbs 8.92e-12 | Pass: mtf.maxAbs 8.93e-12 |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | 3 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 8.32e-12 | Pass: mtf.maxAbs 8.14e-12 |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | 3 | Pass: mtf.maxAbs 2.48e-12 | Pass: mtf.maxAbs 4.17e-12 | Pass: mtf.maxAbs 5.04e-12 |
| certified-nikon-z-58f095-noct-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.43e-12 | Pass: mtf.maxAbs 1.30e-12 | Pass: mtf.maxAbs 3.52e-12 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | 2 | Pass: mtf.maxAbs 9.29e-13 | Pass: mtf.maxAbs 4.90e-13 | Pass: mtf.maxAbs 1.02e-12 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.50e-12 | Pass: mtf.maxAbs 1.69e-12 | Pass: mtf.maxAbs 2.71e-12 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.61e-12 | Pass: mtf.maxAbs 6.35e-12 | Pass: mtf.maxAbs 6.02e-12 |
| certified-nikon-z-mc-105f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 2.16e-12 |
| certified-nikon-z-mc-105f28-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.16e-12 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 1.43e-12 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | 2 | Pass: mtf.maxAbs 3.41e-13 | Pass: mtf.maxAbs 7.64e-12 | Pass: mtf.maxAbs 7.59e-12 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 3 | Pass: mtf.maxAbs 7.76e-13 | Pass: mtf.maxAbs 7.69e-12 | Pass: mtf.maxAbs 8.32e-12 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.52e-12 | Pass: mtf.maxAbs 5.38e-12 | Pass: mtf.maxAbs 5.35e-12 |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.25e-12 | Pass: mtf.maxAbs 4.66e-12 | Pass: mtf.maxAbs 4.80e-12 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.43e-13 | Pass: mtf.maxAbs 2.21e-12 | Pass: mtf.maxAbs 2.22e-12 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.14e-13 | Pass: mtf.maxAbs 2.03e-12 | Pass: mtf.maxAbs 1.93e-12 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.16e-12 | Pass: mtf.maxAbs 1.74e-12 | Pass: mtf.maxAbs 1.75e-12 |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.12e-13 | Pass: mtf.maxAbs 7.52e-12 | Pass: mtf.maxAbs 7.96e-12 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 1.47e-12 | Pass: mtf.maxAbs 1.57e-12 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.84e-12 | Pass: mtf.maxAbs 1.81e-12 | Pass: mtf.maxAbs 1.41e-12 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.21e-12 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 1.64e-12 |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.43e-13 | Pass: mtf.maxAbs 3.99e-13 | Pass: mtf.maxAbs 6.01e-13 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 8.45e-13 | Pass: mtf.maxAbs 1.06e-12 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 3 | Pass: mtf.maxAbs 9.07e-13 | Pass: mtf.maxAbs 9.23e-13 | Pass: mtf.maxAbs 1.58e-12 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 3 | Pass: mtf.maxAbs 9.99e-13 | Pass: mtf.maxAbs 4.52e-12 | Pass: mtf.maxAbs 4.15e-12 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.20e-12 | Pass: mtf.maxAbs 2.63e-12 | Pass: mtf.maxAbs 3.17e-12 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 2.27e-12 | Pass: mtf.maxAbs 2.54e-12 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 9.48e-13 | Pass: mtf.maxAbs 1.12e-12 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 6.88e-13 | Pass: mtf.maxAbs 1.56e-12 |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.38e-12 | Pass: mtf.maxAbs 6.59e-13 | Pass: mtf.maxAbs 1.46e-12 |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.07e-12 | Pass: mtf.maxAbs 9.20e-13 | Pass: mtf.maxAbs 3.36e-12 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 2 | Pass: mtf.maxAbs 4.13e-13 | Pass: mtf.maxAbs 5.35e-13 | Pass: mtf.maxAbs 5.49e-13 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 2 | Pass: mtf.maxAbs 6.82e-13 | Pass: mtf.maxAbs 5.94e-13 | Pass: mtf.maxAbs 6.04e-13 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 1 | Pass: mtf.maxAbs 5.12e-13 | Pass: mtf.maxAbs 6.38e-13 | Pass: mtf.maxAbs 8.88e-13 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 2 | Pass: mtf.maxAbs 1.06e-12 | Pass: mtf.maxAbs 6.15e-13 | Pass: mtf.maxAbs 1.12e-12 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.14e-12 | Pass: mtf.maxAbs 8.71e-13 | Pass: mtf.maxAbs 1.45e-12 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 2 | Pass: mtf.maxAbs 1.10e-12 | Pass: mtf.maxAbs 1.38e-12 | Pass: mtf.maxAbs 1.22e-12 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 1.41e-12 | Pass: mtf.maxAbs 1.66e-12 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | 3 | Pass: mtf.maxAbs 8.64e-13 | Pass: mtf.maxAbs 6.71e-13 | Pass: mtf.maxAbs 1.04e-12 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 3 | Pass: mtf.maxAbs 1.16e-12 | Pass: mtf.maxAbs 3.59e-13 | Pass: mtf.maxAbs 1.43e-12 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | 3 | Pass: mtf.maxAbs 9.68e-13 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 1.20e-12 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | Pass: mtf.maxAbs 5.84e-13 | Pass: mtf.maxAbs 5.87e-13 | Pass: mtf.maxAbs 4.79e-13 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | Pass: mtf.maxAbs 5.14e-13 | Pass: mtf.maxAbs 5.02e-13 | Pass: mtf.maxAbs 1.02e-12 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | Pass: mtf.maxAbs 1.56e-12 | Pass: mtf.maxAbs 9.13e-13 | Pass: mtf.maxAbs 1.25e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | Pass: mtf.maxAbs 3.11e-12 | Pass: mtf.maxAbs 1.13e-12 | Pass: mtf.maxAbs 2.87e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | Pass: mtf.maxAbs 1.69e-12 | Pass: mtf.maxAbs 2.96e-12 | Pass: mtf.maxAbs 3.32e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | Pass: mtf.maxAbs 2.18e-12 | Pass: mtf.maxAbs 1.22e-12 | Pass: mtf.maxAbs 2.62e-12 |
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.13e-12 | Pass: mtf.maxAbs 1.93e-12 | Pass: mtf.maxAbs 1.90e-12 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.42e-13 | Pass: mtf.maxAbs 8.84e-13 | Pass: mtf.maxAbs 1.02e-12 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 7.54e-13 | Pass: mtf.maxAbs 1.42e-12 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 3 | Pass: mtf.maxAbs 1.73e-12 | Pass: mtf.maxAbs 9.71e-13 | Pass: mtf.maxAbs 1.48e-12 |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.68e-13 | Pass: mtf.maxAbs 9.94e-13 | Pass: mtf.maxAbs 1.48e-12 |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.61e-12 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 1.45e-12 |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.69e-12 | Pass: mtf.maxAbs 8.61e-12 | Pass: mtf.maxAbs 8.14e-12 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.87e-13 | Pass: mtf.maxAbs 4.99e-13 | Pass: mtf.maxAbs 8.52e-13 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 3 | Pass: mtf.maxAbs 9.70e-13 | Pass: mtf.maxAbs 2.00e-12 | Pass: mtf.maxAbs 1.70e-12 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.44e-13 | Pass: mtf.maxAbs 2.46e-12 | Pass: mtf.maxAbs 2.60e-12 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.07e-12 | Pass: mtf.maxAbs 2.81e-12 | Pass: mtf.maxAbs 3.88e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.00e-12 | Pass: mtf.maxAbs 1.88e-12 | Pass: mtf.maxAbs 2.02e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | Pass: mtf.maxAbs 4.90e-13 | Pass: mtf.maxAbs 6.45e-13 | Pass: mtf.maxAbs 6.76e-13 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | Pass: mtf.maxAbs 6.52e-13 | Pass: mtf.maxAbs 1.40e-12 | Pass: mtf.maxAbs 1.51e-12 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.60e-13 | Pass: mtf.maxAbs 2.50e-12 | Pass: mtf.maxAbs 2.86e-12 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.43e-13 | Pass: mtf.maxAbs 5.42e-13 | Pass: mtf.maxAbs 6.60e-13 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.03e-12 | Pass: mtf.maxAbs 1.25e-12 | Pass: mtf.maxAbs 1.26e-12 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.28e-13 | Pass: mtf.maxAbs 4.12e-13 | Pass: mtf.maxAbs 3.82e-13 |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.37e-12 | Pass: mtf.maxAbs 6.08e-12 | Pass: mtf.maxAbs 6.73e-12 |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.65e-12 | Pass: mtf.maxAbs 3.33e-12 | Pass: mtf.maxAbs 3.11e-12 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.22e-12 | Pass: mtf.maxAbs 7.96e-13 | Pass: mtf.maxAbs 1.11e-12 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 8.54e-13 | Pass: mtf.maxAbs 1.46e-12 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.75e-12 | Pass: mtf.maxAbs 1.65e-12 | Pass: mtf.maxAbs 2.18e-12 |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 1.32e-12 | Pass: mtf.maxAbs 1.92e-12 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.06e-13 | Pass: mtf.maxAbs 3.90e-13 | Pass: mtf.maxAbs 6.67e-13 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | 3 | Pass: mtf.maxAbs 7.61e-13 | Pass: mtf.maxAbs 5.75e-13 | Pass: mtf.maxAbs 9.19e-13 |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.04e-13 | Pass: mtf.maxAbs 1.26e-12 | Pass: mtf.maxAbs 1.78e-12 |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 7.82e-13 | Pass: mtf.maxAbs 1.50e-12 |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 2.48e-12 | Pass: mtf.maxAbs 2.83e-12 |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.80e-12 | Pass: mtf.maxAbs 3.10e-12 | Pass: mtf.maxAbs 2.57e-12 |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.47e-12 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 1.39e-12 |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.84e-12 | Pass: mtf.maxAbs 1.15e-12 | Pass: mtf.maxAbs 1.26e-12 |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 3 | Pass: mtf.maxAbs 1.74e-12 | Pass: mtf.maxAbs 1.77e-12 | Pass: mtf.maxAbs 2.42e-12 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 1.39e-12 | Pass: mtf.maxAbs 1.96e-12 |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.83e-12 | Pass: mtf.maxAbs 2.44e-12 | Pass: mtf.maxAbs 4.11e-12 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.97e-13 | Pass: mtf.maxAbs 1.17e-12 | Pass: mtf.maxAbs 1.15e-12 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | 3 | Pass: mtf.maxAbs 8.21e-13 | Pass: mtf.maxAbs 1.38e-12 | Pass: mtf.maxAbs 1.38e-12 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 3 | Pass: mtf.maxAbs 7.71e-13 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.09e-12 |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | 2 | Pass: mtf.maxAbs 5.31e-13 | Pass: mtf.maxAbs 3.21e-13 | Pass: mtf.maxAbs 4.76e-13 |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.89e-13 | Pass: mtf.maxAbs 4.69e-12 | Pass: mtf.maxAbs 4.64e-12 |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.18e-13 | Pass: mtf.maxAbs 3.44e-12 | Pass: mtf.maxAbs 3.80e-12 |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.58e-13 | Pass: mtf.maxAbs 2.58e-12 | Pass: mtf.maxAbs 3.16e-12 |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.13e-12 | Pass: mtf.maxAbs 9.33e-13 | Pass: mtf.maxAbs 1.45e-12 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.04e-13 | Pass: mtf.maxAbs 1.58e-12 | Pass: mtf.maxAbs 1.66e-12 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.32e-12 | Pass: mtf.maxAbs 7.63e-13 | Pass: mtf.maxAbs 1.20e-12 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.75e-12 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 2.45e-12 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.62e-12 | Pass: mtf.maxAbs 9.66e-12 | Pass: mtf.maxAbs 7.37e-12 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 4.31e-12 | Pass: mtf.maxAbs 3.43e-12 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.22e-12 | Pass: mtf.maxAbs 1.66e-11 | Pass: mtf.maxAbs 1.75e-11 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | 2 | Pass: mtf.maxAbs 3.91e-13 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 1.99e-12 |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 2.23e-11 | Pass: mtf.maxAbs 2.25e-11 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.39e-12 | Pass: mtf.maxAbs 1.28e-11 | Pass: mtf.maxAbs 1.24e-11 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 3 | Pass: mtf.maxAbs 4.93e-12 | Pass: mtf.maxAbs 1.26e-11 | Pass: mtf.maxAbs 1.09e-11 |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 1.23e-11 | Pass: mtf.maxAbs 1.18e-11 |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.53e-12 | Pass: mtf.maxAbs 1.46e-11 | Pass: mtf.maxAbs 1.39e-11 |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 2 | Pass: mtf.maxAbs 2.84e-12 | Pass: mtf.maxAbs 3.66e-12 | Pass: mtf.maxAbs 1.73e-12 |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 3 | Pass: mtf.maxAbs 6.10e-12 | Pass: mtf.maxAbs 4.25e-12 | Pass: mtf.maxAbs 4.32e-12 |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | 3 | Pass: mtf.maxAbs 9.19e-12 | Pass: mtf.maxAbs 5.24e-12 | Pass: mtf.maxAbs 7.57e-12 |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.30e-11 | Pass: mtf.maxAbs 1.90e-11 | Pass: mtf.maxAbs 2.20e-11 |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.99e-12 | Pass: mtf.maxAbs 1.73e-12 | Pass: mtf.maxAbs 1.38e-12 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.44e-12 | Pass: mtf.maxAbs 2.55e-12 | Pass: mtf.maxAbs 4.71e-12 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.31e-12 | Pass: mtf.maxAbs 1.36e-12 | Pass: mtf.maxAbs 1.56e-12 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.22e-12 | Pass: mtf.maxAbs 6.41e-12 | Pass: mtf.maxAbs 6.80e-12 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.15e-12 | Pass: mtf.maxAbs 4.00e-12 | Pass: mtf.maxAbs 4.46e-12 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.43e-12 | Pass: mtf.maxAbs 3.03e-12 | Pass: mtf.maxAbs 3.15e-12 |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.16e-12 | Pass: mtf.maxAbs 5.27e-12 | Pass: mtf.maxAbs 2.97e-12 |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.86e-12 | Pass: mtf.maxAbs 3.47e-12 | Pass: mtf.maxAbs 9.67e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.01e-12 | Pass: mtf.maxAbs 2.33e-12 | Pass: mtf.maxAbs 3.98e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.73e-12 | Pass: mtf.maxAbs 1.77e-12 | Pass: mtf.maxAbs 1.98e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.86e-12 | Pass: mtf.maxAbs 4.49e-12 | Pass: mtf.maxAbs 4.47e-12 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.57e-12 | Pass: mtf.maxAbs 2.09e-12 | Pass: mtf.maxAbs 2.52e-12 |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 2 | Pass: mtf.maxAbs 8.92e-13 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 1.96e-12 |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.00e-12 | Pass: mtf.maxAbs 1.01e-11 | Pass: mtf.maxAbs 6.92e-12 |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.14e-12 | Pass: mtf.maxAbs 1.72e-12 | Pass: mtf.maxAbs 2.39e-12 |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | 3 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 2.13e-12 | Pass: mtf.maxAbs 2.09e-12 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.61e-12 | Pass: mtf.maxAbs 5.30e-12 | Pass: mtf.maxAbs 5.08e-12 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.31e-12 | Pass: mtf.maxAbs 4.98e-12 | Pass: mtf.maxAbs 5.59e-12 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.80e-12 | Pass: mtf.maxAbs 5.17e-12 | Pass: mtf.maxAbs 3.60e-12 |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 1.03e-12 | Pass: mtf.maxAbs 1.16e-12 |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.09e-13 | Pass: mtf.maxAbs 1.25e-12 | Pass: mtf.maxAbs 1.35e-12 |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.12e-12 | Pass: mtf.maxAbs 6.96e-12 | Pass: mtf.maxAbs 6.37e-12 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.42e-12 | Pass: mtf.maxAbs 5.63e-12 | Pass: mtf.maxAbs 5.62e-12 |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.80e-12 | Pass: mtf.maxAbs 2.21e-12 | Pass: mtf.maxAbs 3.29e-12 |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.32e-12 | Pass: mtf.maxAbs 1.37e-11 | Pass: mtf.maxAbs 1.44e-11 |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.04e-11 | Pass: mtf.maxAbs 3.71e-12 | Pass: mtf.maxAbs 1.12e-11 |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.48e-12 | Pass: mtf.maxAbs 2.80e-12 | Pass: mtf.maxAbs 4.48e-12 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.73e-12 | Pass: mtf.maxAbs 2.39e-12 | Pass: mtf.maxAbs 3.89e-12 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 3 | Pass: mtf.maxAbs 3.98e-12 | Pass: mtf.maxAbs 4.07e-12 | Pass: mtf.maxAbs 2.94e-12 |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.73e-12 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 2.68e-12 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.71e-12 | Pass: mtf.maxAbs 4.09e-12 | Pass: mtf.maxAbs 4.14e-12 |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 3 | Pass: mtf.maxAbs 6.16e-13 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 9.77e-13 |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.65e-13 | Pass: mtf.maxAbs 7.59e-13 | Pass: mtf.maxAbs 6.06e-13 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.84e-12 | Pass: mtf.maxAbs 2.23e-12 | Pass: mtf.maxAbs 3.93e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.02e-12 | Pass: mtf.maxAbs 5.46e-12 | Pass: mtf.maxAbs 3.42e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | Pass: mtf.maxAbs 6.57e-12 | Pass: mtf.maxAbs 4.79e-12 | Pass: mtf.maxAbs 1.96e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.76e-12 | Pass: mtf.maxAbs 2.73e-12 | Pass: mtf.maxAbs 2.77e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 3 | Pass: mtf.maxAbs 1.73e-12 | Pass: mtf.maxAbs 1.21e-12 | Pass: mtf.maxAbs 2.02e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 3 | Pass: mtf.maxAbs 2.03e-12 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 2.33e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 3 | Pass: mtf.maxAbs 1.90e-12 | Pass: mtf.maxAbs 2.05e-12 | Pass: mtf.maxAbs 2.16e-12 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | 3 | Pass: mtf.maxAbs 1.68e-12 | Pass: mtf.maxAbs 2.37e-12 | Pass: mtf.maxAbs 2.76e-12 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 3 | Pass: mtf.maxAbs 1.29e-12 | Pass: mtf.maxAbs 2.12e-12 | Pass: mtf.maxAbs 2.26e-12 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 3 | Pass: mtf.maxAbs 1.93e-12 | Pass: mtf.maxAbs 1.92e-12 | Pass: mtf.maxAbs 1.51e-12 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | 3 | Pass: mtf.maxAbs 1.95e-12 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 1.98e-12 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 3 | Pass: mtf.maxAbs 3.57e-12 | Pass: mtf.maxAbs 2.23e-12 | Pass: mtf.maxAbs 4.24e-12 |
| certified-sigma-85f14-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.76e-12 | Pass: mtf.maxAbs 2.73e-12 | Pass: mtf.maxAbs 2.32e-12 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.68e-12 | Pass: mtf.maxAbs 3.21e-12 | Pass: mtf.maxAbs 3.62e-12 |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.13e-12 | Pass: mtf.maxAbs 3.80e-12 | Pass: mtf.maxAbs 3.29e-12 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.77e-12 | Pass: mtf.maxAbs 1.40e-12 | Pass: mtf.maxAbs 1.26e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | Pass: mtf.maxAbs 2.31e-12 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 2.37e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | Pass: mtf.maxAbs 2.21e-12 | Pass: mtf.maxAbs 1.63e-12 | Pass: mtf.maxAbs 2.07e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | Pass: mtf.maxAbs 5.34e-12 | Pass: mtf.maxAbs 1.80e-12 | Pass: mtf.maxAbs 4.66e-12 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.36e-12 | Pass: mtf.maxAbs 1.25e-12 | Pass: mtf.maxAbs 2.41e-12 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.90e-12 | Pass: mtf.maxAbs 1.09e-12 | Pass: mtf.maxAbs 2.70e-12 |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.16e-12 | Pass: mtf.maxAbs 2.19e-12 | Pass: mtf.maxAbs 4.70e-12 |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 3 | Pass: mtf.maxAbs 6.11e-12 | Pass: mtf.maxAbs 1.39e-12 | Pass: mtf.maxAbs 6.92e-12 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.43e-12 | Pass: mtf.maxAbs 1.23e-12 | Pass: mtf.maxAbs 2.58e-12 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 2 | Pass: mtf.maxAbs 3.05e-12 | Pass: mtf.maxAbs 2.37e-12 | Pass: mtf.maxAbs 2.77e-12 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.99e-13 | Pass: mtf.maxAbs 2.24e-12 | Pass: mtf.maxAbs 2.26e-12 |
| certified-sigma-art-40-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.00e-12 | Pass: mtf.maxAbs 2.68e-12 | Pass: mtf.maxAbs 3.51e-12 |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.03e-13 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 1.56e-12 |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.92e-12 | Pass: mtf.maxAbs 5.42e-12 | Pass: mtf.maxAbs 5.26e-12 |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | 3 | Pass: mtf.maxAbs 5.95e-13 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 1.46e-12 |
| certified-sigma-dp2m-30f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.47e-13 | Pass: mtf.maxAbs 1.03e-12 | Pass: mtf.maxAbs 1.04e-12 |
| certified-sonnar-e-24f18-za-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.60e-13 | Pass: mtf.maxAbs 6.97e-12 | Pass: mtf.maxAbs 7.25e-12 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.83e-12 | Pass: mtf.maxAbs 1.46e-12 | Pass: mtf.maxAbs 2.82e-12 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.63e-12 | Pass: mtf.maxAbs 2.09e-12 | Pass: mtf.maxAbs 2.83e-12 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.78e-12 | Pass: mtf.maxAbs 5.61e-12 | Pass: mtf.maxAbs 7.26e-12 |
| certified-sony-e-20f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.10e-13 | Pass: mtf.maxAbs 1.04e-11 | Pass: mtf.maxAbs 1.01e-11 |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | 2 | Pass: mtf.maxAbs 2.97e-13 | Pass: mtf.maxAbs 3.43e-13 | Pass: mtf.maxAbs 4.02e-13 |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | 3 | Pass: mtf.maxAbs 6.74e-12 | Pass: mtf.maxAbs 1.69e-12 | Pass: mtf.maxAbs 8.43e-12 |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | 2 | Pass: mtf.maxAbs 4.18e-12 | Pass: mtf.maxAbs 5.70e-12 | Pass: mtf.maxAbs 2.06e-12 |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | 3 | Pass: mtf.maxAbs 5.88e-12 | Pass: mtf.maxAbs 9.06e-12 | Pass: mtf.maxAbs 8.95e-12 |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | 3 | Pass: mtf.maxAbs 8.77e-12 | Pass: mtf.maxAbs 1.17e-11 | Pass: mtf.maxAbs 3.74e-12 |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 8.94e-13 | Pass: mtf.maxAbs 2.39e-12 |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.46e-12 | Pass: mtf.maxAbs 1.68e-12 | Pass: mtf.maxAbs 1.86e-12 |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.22e-12 | Pass: mtf.maxAbs 5.97e-12 | Pass: mtf.maxAbs 9.38e-12 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | 2 | Pass: mtf.maxAbs 4.28e-13 | Pass: mtf.maxAbs 7.70e-12 | Pass: mtf.maxAbs 7.66e-12 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | 3 | Pass: mtf.maxAbs 4.56e-12 | Pass: mtf.maxAbs 8.32e-12 | Pass: mtf.maxAbs 3.86e-12 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.72e-12 | Pass: mtf.maxAbs 7.77e-12 | Pass: mtf.maxAbs 7.99e-12 |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 2 | Pass: mtf.maxAbs 3.54e-13 | Pass: mtf.maxAbs 6.12e-13 | Pass: mtf.maxAbs 6.02e-13 |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | 2 | Pass: mtf.maxAbs 9.93e-13 | Pass: mtf.maxAbs 1.35e-11 | Pass: mtf.maxAbs 1.43e-11 |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 2 | Pass: mtf.maxAbs 1.60e-12 | Pass: mtf.maxAbs 7.49e-12 | Pass: mtf.maxAbs 6.83e-12 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 2 | Pass: mtf.maxAbs 2.24e-12 | Pass: mtf.maxAbs 5.17e-12 | Pass: mtf.maxAbs 6.40e-12 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 2 | Pass: mtf.maxAbs 1.67e-12 | Pass: mtf.maxAbs 4.92e-12 | Pass: mtf.maxAbs 4.31e-12 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | 2 | Pass: mtf.maxAbs 2.34e-12 | Pass: mtf.maxAbs 5.27e-11 | Pass: mtf.maxAbs 5.04e-11 |
| certified-sony-fe-24-f28-g-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.35e-12 | Pass: mtf.maxAbs 3.34e-11 | Pass: mtf.maxAbs 3.33e-11 |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 2 | Pass: mtf.maxAbs 9.05e-13 | Pass: mtf.maxAbs 2.24e-12 | Pass: mtf.maxAbs 2.90e-12 |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 2 | Pass: mtf.maxAbs 2.18e-12 | Pass: mtf.maxAbs 3.51e-12 | Pass: mtf.maxAbs 3.73e-12 |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 2 | Pass: mtf.maxAbs 1.88e-12 | Pass: mtf.maxAbs 6.01e-12 | Pass: mtf.maxAbs 6.63e-12 |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 2 | Pass: mtf.maxAbs 3.90e-12 | Pass: mtf.maxAbs 3.85e-12 | Pass: mtf.maxAbs 5.31e-12 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.82e-12 | Pass: mtf.maxAbs 3.97e-12 | Pass: mtf.maxAbs 7.49e-12 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | 3 | Pass: mtf.maxAbs 9.85e-12 | Pass: mtf.maxAbs 2.04e-12 | Pass: mtf.maxAbs 1.04e-11 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 3 | Pass: mtf.maxAbs 6.58e-12 | Pass: mtf.maxAbs 2.20e-12 | Pass: mtf.maxAbs 6.93e-12 |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.72e-12 | Pass: mtf.maxAbs 2.91e-12 | Pass: mtf.maxAbs 4.26e-12 |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.79e-12 | Pass: mtf.maxAbs 2.80e-12 | Pass: mtf.maxAbs 3.19e-12 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.57e-12 | Pass: mtf.maxAbs 3.42e-12 | Pass: mtf.maxAbs 4.46e-12 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.32e-12 | Pass: mtf.maxAbs 2.55e-12 | Pass: mtf.maxAbs 2.39e-12 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.37e-12 | Pass: mtf.maxAbs 2.61e-12 | Pass: mtf.maxAbs 3.74e-12 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.76e-12 | Pass: mtf.maxAbs 2.63e-12 | Pass: mtf.maxAbs 3.13e-12 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.60e-12 | Pass: mtf.maxAbs 4.65e-12 | Pass: mtf.maxAbs 2.94e-12 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 3 | Pass: mtf.maxAbs 3.70e-12 | Pass: mtf.maxAbs 3.16e-12 | Pass: mtf.maxAbs 1.41e-12 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | 3 | Pass: mtf.maxAbs 5.61e-12 | Pass: mtf.maxAbs 6.13e-12 | Pass: mtf.maxAbs 1.67e-12 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.79e-12 | Pass: mtf.maxAbs 9.99e-13 | Pass: mtf.maxAbs 1.78e-12 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 2 | Pass: mtf.maxAbs 1.20e-12 | Pass: mtf.maxAbs 8.47e-13 | Pass: mtf.maxAbs 1.32e-12 |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 2 | Pass: mtf.maxAbs 5.01e-13 | Pass: mtf.maxAbs 2.41e-12 | Pass: mtf.maxAbs 2.56e-12 |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 3 | Pass: mtf.maxAbs 1.11e-12 | Pass: mtf.maxAbs 9.99e-12 | Pass: mtf.maxAbs 9.89e-12 |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 3 | Pass: mtf.maxAbs 1.28e-12 | Pass: mtf.maxAbs 9.48e-12 | Pass: mtf.maxAbs 1.01e-11 |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.15e-12 | Pass: mtf.maxAbs 2.74e-12 | Pass: mtf.maxAbs 2.76e-12 |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | 3 | Pass: mtf.maxAbs 3.07e-12 | Pass: mtf.maxAbs 3.70e-12 | Pass: mtf.maxAbs 4.79e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | Pass: mtf.maxAbs 1.93e-12 | Pass: mtf.maxAbs 1.15e-12 | Pass: mtf.maxAbs 2.05e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 1.80e-12 | Pass: mtf.maxAbs 1.39e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | Pass: mtf.maxAbs 1.64e-12 | Pass: mtf.maxAbs 1.17e-12 | Pass: mtf.maxAbs 1.91e-12 |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.11e-11 | Pass: mtf.maxAbs 2.35e-11 | Pass: mtf.maxAbs 1.51e-11 |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.85e-13 | Pass: mtf.maxAbs 5.10e-12 | Pass: mtf.maxAbs 4.52e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.87e-12 | Pass: mtf.maxAbs 7.67e-12 | Pass: mtf.maxAbs 4.05e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.83e-12 | Pass: mtf.maxAbs 9.64e-12 | Pass: mtf.maxAbs 8.38e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | Pass: mtf.maxAbs 7.43e-12 | Pass: mtf.maxAbs 5.45e-12 | Pass: mtf.maxAbs 5.61e-12 |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.51e-12 | Pass: mtf.maxAbs 2.91e-12 | Pass: mtf.maxAbs 4.26e-12 |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | 3 | Pass: mtf.maxAbs 4.83e-12 | Pass: mtf.maxAbs 4.13e-12 | Pass: mtf.maxAbs 4.04e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.37e-12 | Pass: mtf.maxAbs 4.51e-12 | Pass: mtf.maxAbs 5.42e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | Pass: mtf.maxAbs 4.75e-12 | Pass: mtf.maxAbs 6.20e-12 | Pass: mtf.maxAbs 5.46e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | Pass: mtf.maxAbs 4.40e-12 | Pass: mtf.maxAbs 5.21e-12 | Pass: mtf.maxAbs 6.42e-12 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.09e-12 | Pass: mtf.maxAbs 1.71e-12 | Pass: mtf.maxAbs 2.31e-12 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 1.39e-12 | Pass: mtf.maxAbs 1.33e-12 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.95e-12 | Pass: mtf.maxAbs 1.31e-12 | Pass: mtf.maxAbs 1.76e-12 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.25e-12 | Pass: mtf.maxAbs 2.38e-12 | Pass: mtf.maxAbs 2.58e-12 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.56e-12 | Pass: mtf.maxAbs 2.45e-12 | Pass: mtf.maxAbs 4.66e-12 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.28e-12 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 2.91e-12 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | 3 | Pass: mtf.maxAbs 2.11e-12 | Pass: mtf.maxAbs 1.94e-12 | Pass: mtf.maxAbs 2.27e-12 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | 3 | Pass: mtf.maxAbs 2.57e-12 | Pass: mtf.maxAbs 1.57e-12 | Pass: mtf.maxAbs 3.26e-12 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.55e-12 | Pass: mtf.maxAbs 1.67e-12 | Pass: mtf.maxAbs 2.05e-12 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.56e-12 | Pass: mtf.maxAbs 2.81e-12 | Pass: mtf.maxAbs 2.38e-12 |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 2.26e-12 | Pass: mtf.maxAbs 8.98e-13 | Pass: mtf.maxAbs 2.47e-12 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.16e-12 | Pass: mtf.maxAbs 1.37e-11 | Pass: mtf.maxAbs 1.46e-11 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.88e-12 | Pass: mtf.maxAbs 4.56e-12 | Pass: mtf.maxAbs 5.79e-12 |
| certified-ultron-28f2-asph-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.33e-12 | Pass: mtf.maxAbs 3.45e-12 | Pass: mtf.maxAbs 3.49e-12 |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.81e-12 | Pass: mtf.maxAbs 1.49e-12 | Pass: mtf.maxAbs 1.14e-12 |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.79e-12 | Pass: mtf.maxAbs 1.41e-12 | Pass: mtf.maxAbs 7.86e-13 |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.09e-12 | Pass: mtf.maxAbs 1.56e-11 | Pass: mtf.maxAbs 1.57e-11 |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.37e-12 | Pass: mtf.maxAbs 5.95e-13 | Pass: mtf.maxAbs 8.80e-13 |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.15e-12 | Pass: mtf.maxAbs 7.96e-13 | Pass: mtf.maxAbs 6.91e-13 |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 2.46e-12 | Pass: mtf.maxAbs 5.15e-12 | Pass: mtf.maxAbs 5.60e-12 |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.19e-12 | Pass: mtf.maxAbs 6.72e-13 | Pass: mtf.maxAbs 1.35e-12 |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.32e-12 | Pass: mtf.maxAbs 9.29e-13 | Pass: mtf.maxAbs 2.11e-12 |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 7.55e-13 | Pass: mtf.maxAbs 8.84e-13 |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.03e-12 | Pass: mtf.maxAbs 1.85e-12 | Pass: mtf.maxAbs 1.62e-12 |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.97e-12 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 1.16e-12 |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.74e-12 | Pass: mtf.maxAbs 1.83e-12 | Pass: mtf.maxAbs 1.85e-12 |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 7.88e-13 | Pass: mtf.maxAbs 5.90e-13 | Pass: mtf.maxAbs 6.25e-13 |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 2.27e-12 | Pass: mtf.maxAbs 2.95e-12 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.82e-13 | Pass: mtf.maxAbs 4.82e-13 | Pass: mtf.maxAbs 9.33e-13 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.33e-12 | Pass: mtf.maxAbs 5.66e-13 | Pass: mtf.maxAbs 1.26e-12 |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.44e-13 | Pass: mtf.maxAbs 5.61e-13 | Pass: mtf.maxAbs 7.40e-13 |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.55e-13 | Pass: mtf.maxAbs 5.92e-13 | Pass: mtf.maxAbs 6.82e-13 |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.62e-12 | Pass: mtf.maxAbs 1.13e-12 | Pass: mtf.maxAbs 1.09e-12 |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.37e-13 | Pass: mtf.maxAbs 4.19e-13 | Pass: mtf.maxAbs 4.56e-13 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 9.18e-13 | Pass: mtf.maxAbs 8.72e-13 | Pass: mtf.maxAbs 1.03e-12 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 9.77e-13 | Pass: mtf.maxAbs 6.11e-13 | Pass: mtf.maxAbs 1.07e-12 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.57e-12 | Pass: mtf.maxAbs 1.01e-12 | Pass: mtf.maxAbs 1.47e-12 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.77e-12 | Pass: mtf.maxAbs 1.18e-12 | Pass: mtf.maxAbs 1.85e-12 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 8.26e-13 | Pass: mtf.maxAbs 7.26e-13 | Pass: mtf.maxAbs 9.71e-13 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 9.70e-13 | Pass: mtf.maxAbs 8.01e-13 | Pass: mtf.maxAbs 8.90e-13 |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | 3 | Pass: mtf.maxAbs 3.37e-12 | Pass: mtf.maxAbs 1.33e-12 | Pass: mtf.maxAbs 3.51e-12 |
| certified-zeiss-batis-18f28-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.52e-12 | Pass: mtf.maxAbs 1.06e-11 | Pass: mtf.maxAbs 1.06e-11 |
| certified-zeiss-batis-85f18-zoom0-focus1 | 3 | Pass: mtf.maxAbs 6.71e-13 | Pass: mtf.maxAbs 1.88e-12 | Pass: mtf.maxAbs 1.56e-12 |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.34e-12 | Pass: mtf.maxAbs 1.48e-12 | Pass: mtf.maxAbs 1.51e-12 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | 3 | Pass: mtf.maxAbs 4.22e-12 | Pass: mtf.maxAbs 6.64e-12 | Pass: mtf.maxAbs 4.50e-12 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | 3 | Pass: mtf.maxAbs 4.64e-12 | Pass: mtf.maxAbs 4.11e-12 | Pass: mtf.maxAbs 6.72e-12 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | 3 | Pass: mtf.maxAbs 1.00e-12 | Pass: mtf.maxAbs 9.61e-13 | Pass: mtf.maxAbs 8.45e-13 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 3 | Pass: mtf.maxAbs 1.05e-12 | Pass: mtf.maxAbs 9.64e-13 | Pass: mtf.maxAbs 1.40e-12 |

## How to read this

### Verdicts

A verdict is of one pair of engines: of one request, or, in a table by run, the worst over the requests of the
run. A table shows the label; the stored value is what the baseline file holds.

| Label | Stored value | Meaning |
|---|---|---|
| Pass: within limit | `PASS` | A check held to a limit: every judged figure is at or below its limit. |
| Fail: beyond limit | `FAIL` | A check held to a limit: a judged figure is above its limit, or is not a number. |

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

In the table of failures, Class says where a difference comes from, decided in the order unsupported, data, convention, numerical, method (method: the two engines' methods differ), and not that an engine is right; Gotcha is the entry of docs/gotchas.md that explains the difference, and Reproducer the command that reproduces it in one run:

| Class | Stored value |
|---|---|
| the methods differ | `method` |

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
| `certified-<lens>-zoom<s>-focus<k>` | a focus station LensVisualizer declares for the lens, at a finite object distance: s is its zoom station and k its focus keyframe, as LensVisualizer numbers them |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | 541344759bd41170539a36234429e8572da34a31e62671f06c6e11b1a9ddb6a5 |
| Baseline file | f2f586a37b1c7ee7894060af1f52935fd0149de7128f97f6a9e57febc12d1d94 |
| Limits file | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61 | 674d26ffb708596a5462f6199b1cb2c28df679003651e53ebb4bbde0e590be9a | commit f5b456fec7b69184844078f6ec6b1ac132f8ec58 |
| optiland | 2ca0f73256d5e0ead64aa3695522bef399721276bf11d612db34b7bf19c5ee39 | 59039a7b219f2882f1e4cabf8f43bc07a9fdf66ecb95d26f4076feca4406d853 | commit a9e544a2e058f1c1b64606e9ce90e6dc103efee1, distribution version 0.6.2.post234+ga9e544a2, source hash 1d35bfa2f7a6addd60f2c1057cd17e65a710a6a7d4e3a277e8675647d0262131 |
| reference-tracer | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 | — |

| Run | Lens state |
|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 5c34668074f689cf9183b6a6ac660a212014d2d9ba321f86d31abd8c76361b05 |
| certified-apo-lanthar-50f2-zoom0-focus1 | 6c952bd3bd5ed38d9c7a712150c178a559f076534d48d19af61f79c4b914fd71 |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | ce27fcfe8f43af2f6846d9d2c2ce285d58ff162d3f21dde89898a39250b5627e |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 8962fef3413f982ac033b09ea61d32c378fe3330278dcbd457db4b822388956b |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | ad9124aebcc56a18d38a95b1813fc58f42219065d1397e953fb1ce3a6aefe852 |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | fc812ae448306763774a27a0e676b3ea9241f95c5c05f7151cfab5257e4b1689 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 0faacc06e86dae577571e68817af23fc42ecb3b4b3842bb238826f0bfeb071b3 |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | f8829f88dc97382f4008e1e3a9855b639ac2a3fceafe2309119aebaf3f6d316a |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 564ff7cc88206b522ad7fa827176d1ad80967727027a1977d8eb318bb384265a |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 7651d8630259c429808b018e6022e4d037ca0c71f0ad067ac43420908f6170f4 |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 0bd69baad92b2cae1e5ea4edd1c5de7490750dac922f57d49bc36778d83354c3 |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | daf6cfe868bd42ca006571c9c7eb3060b3d1f1c73b0f73c9044cc0c17275d0ce |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 6b5f11f070ec176f69e8f4879536e2d7ca1dc7f99430aa40e97a906b0a40504d |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 2115b237f50b56564aceed71f4d7423eb4180095d0c1576af0e5a44771f28522 |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 802d70438fb54dc5b8ccd30187489ae97681a0aef9ce2626d778fab7d7fe6731 |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 8ff2779f4dbf10dc395d44543f671ff84d75d24b608e71475ff67d14097089fe |
| certified-canon-fd-35-f2-zoom0-focus1 | e5c81ba6fc286de1d990bbf5aa8d48ac577ed03d51ba7f8463f90f4afc6b0d4d |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 01a6b6dbbf2ba0bbac49350703e4072f13d72e6bed5ec8338747b68053090605 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 42a23f2a0ae6b263e4dc0a4cf8433d90e050bc7f13ac37bb36cc2b358cb34312 |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 58a5c1eeaa94dbf9e838a8e4d150fcd3a73fe3b0f2396b75083e28e1143b1b80 |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | a50e4d560132582eb61000485f8e268bc8b21298eb5246e20d0412fee4c33cdc |
| certified-canon-rf-50-f12-l-zoom0-focus1 | 5076dcdc32e65c5825a272fbbe9dbcbddedc054fb38849730bc562c3a87e11bd |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 83609a5e72d9ce6600a90586fc0c9ad3f0eafc438662cce0216bbdc70915c1d7 |
| certified-canon-rf-85f2-macro-zoom0-focus1 | 789c8f3bec5cd171a0d7519d6aeaaf4eb7ae1a6e6a4675c202de04f79316dddb |
| certified-canon-rf-85f2-macro-zoom0-focus2 | 3adadad88e3f9e78189b4419e26e83620c9424e9600d2469fb5de84df1e9c1f4 |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | e37ca0c74deea030f61f876c281a78f1cbc105778198524c9f2678d67f5e30c8 |
| certified-canon-rf100f28-macro-zoom0-focus1 | 684850d3964d47a1480b350ca39439926b57e1d3b6ed13dcf1845c455cf5995c |
| certified-canon-rf100f28-macro-zoom0-focus2 | 7eb9c1747c30cca2eae96fe1f9f6976cdbb0c5159acc5387881b5d68ff10ad82 |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | c2f5f0cae70fe4f0125dcf9a968cf3a9215a3ed30aa89ff785ebfe6c1099e50a |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | c462eae2e34a6ff934b715aee222cda98ba4ca6a3e9da3bf98d680b0f8df260c |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 867e8c02e2e51290f19169455473f0736cdf6c334f34ddcbb5437a5def18cc59 |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | bedbeafbd8b76df390fb93c567b5ff9a50dc5ed24fad7a554408134e8cb33470 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | fd45e49d468ba67fe404352aa54fd9489ef2d9ad21065112a48a04de84e93b33 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | cf514c08dccef216facc5fb22e0ee7e375e6cc1bee1a0d34d02a6118666c5c79 |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 90cf96e171022d27d56197f06bbec28a229a0737c081de58196bd98eb987d823 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 49c345c2e52f3954ef6986a110f49f8e4c16ca608087aa8c51dde5d7494030e1 |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | a54061eb49a7332abfe3e4a0732282f2637c2f836da33e62f7ccc9082c00890d |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 2b4eb17aff35f9e790fbabf2e17c4542cc0101cfffe01df8a67f140fdbe5d55d |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 1ad0d9cd4d627a5e5def4ab799f8b462de0b2ec322bd2ec3d4cd4a394d5e543c |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 4c574d45acf293c2731a0bdcfd114708e3a55bc7e52fa41fd2d5854133c79429 |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 8d3e9c7edae6b2c2c43cf2f4870f3d225129fbbc9cd3c85b3214086b44fcc380 |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 56fd1537e25aeb09bebd48943fcf9e0571ec5683888626bf403e8e920a3a116f |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | c3f6ab9a4c36016c5c215fb17f596e6b8feac444d5ab4b14da7c6dab40a05c2b |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 3707ec6d0b2b18c597ad86b2aa5bbeb4e03f3ae280e5c404cdf94178cd009b36 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 112ec19c8e3e4419181223f7737bfdbc44f148a0c3f275de324d86a747d032d9 |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 584b729ce84978745a04dc3bf8b39b8ab7b2d3e8e416c2df213450f5fbfd3f39 |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | fc71d244aec38864b73ef8750cc52141357ae769fe4d7ea80b387b46ff1a8e55 |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | f446a92e6cb96c11f590282a6f6ed6b5ca5b0d374e864ff67315d3e156beacba |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | acac46175d88ebc33f9f3d8f5b3a29855dd9e92dcfa802b5cd0d0d2be7515c97 |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | ea2d44532a8c91e0d04294e0a1d84a51603275e9d54021b212453fb3086522f2 |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | a7e01309afe588ac573e98d860dc9bb1928ada5d412d937c5865d1830f5a784d |
| certified-fujifilm-gf80-f17-zoom0-focus1 | bbd4687c1f32e2819c4015cfb440908f2747d442e89dd218858a35f71743bad9 |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | 57eede7a4660658d78f10f7e5bdef31c201856a8e0a702eaa374714616e2df37 |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | ec7291d15103b514c588bbc7450886dbd0ca0371058a36dbfb1c300bce29de9f |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | e70a5e6c2523ef1c5f15237c1add4bee16418c22c401974c8888efac0485347f |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 9cfb82047b41aaa73dc6c299e5251eca9b4b3de5c1cc85c7314c4e363c213994 |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 29be9da4bd581c2f6df4c0628a59cb9ba36e538547f522b427d26bddb2967c86 |
| certified-fujifilm-xf50-f1-zoom0-focus1 | 1a721be0c40439c6c12162e7a8daeab551d19ebce4bb52ef3497fee4b64ac58c |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | a2d47f36c6de6e38a4587c95aa6ed65b72be5153667bdc794342635066589fa6 |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 9517919343753afb358267f8ee6c8c9638631d9ebf0e3bb14c73d221ccd22392 |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | f4348412d8ada6b5e7244cc40e22fee41ebf5bec08950a8a3461a8d6c32602ce |
| certified-fujifilm-xf90f2-zoom0-focus1 | ea751965cfb356c705cae11ac5df50ede63180ce02a7f7e8d22088f789eda135 |
| certified-gf-120f4-macro-zoom0-focus1 | 859e2d8473c4047712d2e3d259adbc5c06cdea3c8afc8b20c2c7a60f52764f2a |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 99ab56e036398a2f560410acc8d4c3ed53e558490392fda9f65cd08829bdefc3 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 9e41b5bf7c9d9808da24ed16dc969e7c9570ec20a98b4af03a0b087a25e2f969 |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 461df00281f0e7638d84e1fa536dfab7606024c56617883370749ebae5878686 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | e92c44ff169ec871c921b962020b502aabf40e71a8bfa6b0e41956ea10f0b00e |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | dc6964ddf994f4ff59e6739e9c8ddb0745dd481eb8a2e0559af59b59c69adf04 |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | c976f174252a57c034fcaab963c138cde01387cb928d2dbee26765819b3be3d6 |
| certified-konica-hexanon-60f12-zoom0-focus1 | 45a7fba1662ebb81adbf73fcaa61108fd6bcf75dce5a34b8168a312c33930fdf |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 61dff6ad0f8653a79d6bce2c5f1777c068de81acdbf808a2145ce9ff8c717a49 |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | ac88de07818d1997c7418aa3cd92c853bdd8819517bde1bc9ac520549d2fda32 |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 84a8304e46408c1118c65f5873247775294406f17184073ab22adc63414883bd |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | a6d17bd47a0871f57871bdd232f694596904922b047bfbe76c82b4c0ceb5f56f |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | 44def313f172415f3368de89eb79ff998e5ebc47c5aa8fae6ff5009b4acfdd15 |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | ae8bf10ab266a2ce09d1693beef4448f13f6a5ad8d43f4a4c367976aa280a808 |
| certified-laowa-15f4-macro-zoom0-focus1 | b61d935c9cf0e675d74beeded4eaf8b84d6aa5c4786e49d2fb656c4b07fec22b |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 23fc42411d1d3b37e418cea07c7d64edb7009922a7158d95492f0e84d1beaa04 |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | d4ffbc92564c8a7e7b1456a195ee466b4f660eb3baf89bf0565c2227c58c999d |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | e2bc6480c13ead2bc2124b518424eb048d6fbafad22781be6ce4076f9de788d4 |
| certified-laowa-24f14-probe-zoom0-focus1 | 435a3d3755ba07489dcd0e004b5af11fbfd6a7784a3d4eded8b180dc21483aab |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | b93af58a7695e8198c4a583a3c451ee155a8862c92cbf3595ac1fbf795769e3e |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 5233b189f5f1d6b28aa84b45f067f8986a3b2a19b165ebb2eb3284679fa02b10 |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 0c81bb5f0f5c7ba1831ab7955b0cd3d5f5584a06f7a3c7068ac360f5e7a1e150 |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | ebbe710591c2d156bf4f366ea244fd2da9d3bede664bece5a0504777483a4202 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | d78bb4326af3a9d09e130d7a3ba8b28713fefa30cf56b1af3cc062c33ae5ee41 |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 0506040b61fb5dcab42a625912f31be67a8ff0625d68dc8dc399880f29bf7bb7 |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | deef946578878a59f48320117d3658a4f9b2355db5194fe7a367c47f57bee64e |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 4e6d38646aa0a759ab9c82f5d3b93f301fea34b8a39da430419f3f8da422e906 |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | 159888aa342c8ae987618fe1fc993a266153bd589007d5bf1e5878268d4dcae3 |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | 1c088bb3ca6f4b6288a6958596862d388b6e6cf1e06dfb908c3faf021708f1a8 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 2ce4c6b72c0f592dfaf6a0d973bf9466b62ababa7d57dfb852b2a7cacc0f129a |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | e47656015310f4c2dce28192a28f357da8b3a88f74420af373a43d7c937b3784 |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 32d0f419c0c6019ae461fe8cff61f55752cb1dca77d69c08ddb1f4f14493603c |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | ce632d6fe72f4ec5daa7775f71f8298fe22684b6c3b9829f1acd927901c5e613 |
| certified-leica-summilux-28f17-zoom0-focus1 | af344b9a7e77fe21f87dc08e240e83850814f44186e469096a8f555e50685326 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | b0f8f5466dfaa4f6b686d4163d2df66174f23018b6842d90c6c4ce65e012e360 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | e05ac48d6f62767ab2991094e24729bdc873f47fc38773f94ca29503318d786e |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | ea900cc01fb5f407c9df388e5f1ee4bc61a650b6c8e3d23aadb90c257e54235e |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 4152f2b7c34b5f44882aa905cf8362f99b02f71f7b5eb15dc1d3b867059d8671 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 24e7b94a60cf8c68b6afa7dcbcfc55acceb4a52b9f70d87cf907dc3844b0ac86 |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | d75d7b205f0834fbbd345842d876cb443851246b7ccac0a0618364ac049e12eb |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 9ba05d040ce805b201d30a537c87477839cfcfce29b201297aa94ade05efb061 |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 790aa5cecdcc610c7703d2ec5fb82f096955126195ae9f8a4458848d21d6975e |
| certified-minolta-af-100mm-f2-zoom0-focus1 | d3ae321dda0827021e59b859ea1470b060efeb927637e5316ceecb3c8456938b |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 6804416e4035b07ac8a46a0c4e8e959f444e6d364a333dd8d6906259882a2ef9 |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | ade62a3814335cd59e35295ead89860c6be9ced44eaa2fa567afa1462a3fdc9c |
| certified-minolta-af-135mm-f28-zoom0-focus1 | 0f5f76a6967b584cb0217d85be3182f3a3b6ba69893e5ca75df30dcc26471a12 |
| certified-minolta-af-20mm-f28-zoom0-focus1 | 44d2f549841a23ea61f6c2b269973282ab3644126bab86b07998223903dea325 |
| certified-minolta-af-24mm-f28-zoom0-focus1 | cd0f69521e93cd744caf91590f827f422feab575099fa15d19a6795cfbb4ed9e |
| certified-minolta-af-300mm-f28-zoom0-focus1 | fb95d667fc58d585e4ee3283905b5c9fdc381829713cb7c0912f6bef91297370 |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 06387ad2a565df2c99eef1a4babe47b93816102bdfb86beb6489a33d59d1a5e4 |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | f70e7ed164b5b5614d535e162bfff0764f4b40e8a98e7c572aa00d4feaf47231 |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 8ce40609635aa0258c55da1680d4b0c057a98356d3f3d54cd6e8d46b8859411f |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | 8572bf9def6e604f31ef06a63324a095be4c009ef0c0f32c71da007f499654de |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | 4072db5bde9aaa4067c28a6cdef44ff4bd4cb7f55a8b9e8e853f9f20e8810626 |
| certified-nikkor-28f14d-zoom0-focus1 | 7a388e1ded3da7693342e85f2c73d6ab62e1dfcaf0724ef1474d00af7b11f257 |
| certified-nikkor-85f14d-zoom0-focus1 | 1e645acc20ab05c697006ad18ed89fb398ece259eb2a306bf554f1978ca78ba7 |
| certified-nikkor-85f14g-zoom0-focus1 | 9a99b242cacc763c1f2189d1dab865bde0be00249260bce057db3570e4cff2d1 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 4a09d3a8f987ad3b67713a668d4dc7faf0878d79e1275e7b3e8ccf69f1b923e5 |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | d424d68bbbd3e55009ba493fdb2d949dae372a2431e535cff19d51e4cf70af0c |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 931a2fd406cad9279fe0be0b778ebb691009d8acbe924901c543d1b24a7e3b8d |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | 392f7858dd1be58882ba67d49e70feb6d13c622cec51514288e1c72753a7f8ec |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | b9a9bc31d71e1800696c7f45ef090afdb33969fe49498187abb129640f999853 |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | 79efb42674743a70db13c40e9af06c5258ce138b33a8513d796aa9aa7581ee79 |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | f86c8e0d4e6f836c6eceb96817fe944fb1e88d9f3f473fbed86f8123604164c6 |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | bbc4882e5753115eae9288813c62156932b7e08f7273cbc489af085560cb8f45 |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | 6039d74b62d6fb47924f399e32fe99d771442f7215057ae531927dbfc2fd2a13 |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | d348a69fbaf62f115cce098cda966176b59d8d6c3d0b3e82f8d055c6d7ce4076 |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | 60ef1083ef5b277ed576e61a7e97773680882fbce4f418839d3f11385a6dd204 |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | a68b6e65c29807b2fe639ccf5ad4794d83e6dca34b3b887e873dfbcea618fc9d |
| certified-nikkor-n-28f2-zoom0-focus1 | 0df0a12e8bcd714c17d3df70457b5479c7805cb8dec96ecbcdff9dbc16d33825 |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | 8c8c77f96c10b8eacfbd3fc1e56b42548ff65f1d507af7c29925de173b8531ef |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | 09d642275bc71fbef0bafaed8683443df9b9d29c38cb04620f663cbb81d12660 |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | f9ea0af71ddd36e4a8c184e9753c762e1a4c25ef6bea6045f6022a3dcc7aa109 |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | d48d25aa87a341c43ff15b465cdeb06e7da694344187c0b3aab4393893ff92cf |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 8684236b453c59e49443cbcc8c070933a39d6c9dcf563dfeed3d9be14df4760f |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | a0a15a83d3ed7673d0e78b1d8d3eb9fbc50185bdbe96fd181dcbb769e0c9618f |
| certified-nikkor-z-28f28-zoom0-focus1 | dc3580db5fed108703eca8fafda5af1ba45fe600857db72c7bf7ede8557039fd |
| certified-nikkor-z-50f18s-zoom0-focus1 | 21897a227bbb853bcd4cc71dd8eba6a16953d97145f6750aac38e544fa979faf |
| certified-nikkor-z-70-200f28-zoom0-focus1 | 33128ead666fb36d8e6fe9329ca957fcb2f0eb586da24b0eeec01792acf85dea |
| certified-nikkor-z-70-200f28-zoom1-focus1 | dedd97fdf238f1a66a0057a63076c7f33b88c1dd15f431bb435c2ecee8e0fe7d |
| certified-nikkor-z-70-200f28-zoom2-focus1 | 4e6a5b989dbe8b3ffc25404215469e94cf53d3a9bbc63c1af9443c130820dbe3 |
| certified-nikkor-z-85f18s-zoom0-focus1 | edbb96ac1dd518cf805a8d5918f02b104d12ecbb91052f3dcd123783fe425e3f |
| certified-nikkor-z50f12-zoom0-focus1 | bd29ef5fd591536de10c988994966313d1f28a5d2b580eaa6d90f2c60bde5e01 |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | e53f27ceace560d73991e9bcb96a0e7c70156dd42b6e19adb344d32605b8ea94 |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 8aa5a1903fcbabfa7435996b009b84d7b4412c3c722b51aa242b779ad61e362e |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 99e6158c59a3c4448b2768a9ed22658dd48644a90db276e47c716c867ba52e73 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 605fcb3a60139187b3776a0e58308810a95317a0b0d6bf68c844279cca636741 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 08560a0361261e6deb8f7e763613d0cb430b3f3cba49e953710bac48b6a99c52 |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 8f9101aff121f6577afce3809663558ac9b08832d2dbeb42ce4038e1b946a3d3 |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 835a3f4894190eac341511338e078eeb3679f3b38cdd713851417969644f2c51 |
| certified-nikon-af-fisheye-nikkor-16mm-f28d-zoom0-focus1 | — |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | bdc2ecb131b7c5c3d361bcd23f2307c4dbeee03f278c8c3cec6686c00eded124 |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 8b2d93d21f7961354203e2e5179b8fd4c504aa7712e12ea8db662e55e105b285 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | e4534f9312bc71161e4fc6a6295497a8f1fc7d7f1609fd55f3f921521c1cef73 |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 0221da5b5bb203d882f689b59cad1f8b909f611dd942c9b5d0ec4c123daac840 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 31f53066dea2c6294cf28daea0e136feea6d0369cab2f702984e11db76a88256 |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 686e71c6302d225076c5993924fdc61918fcca5ea56bf9af4f164a1d24546c90 |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | fd2e77883f35206d2112c05382a7b376a6de21ebf2f015b79f54d7fe388cca8c |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 9da7115b90a353e739ecde0ff5c2b0a2120c7edaa4c67c74df35751ac0f0ac83 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | d97afe6603d4b63f38496846a3db634609e81c65d1eac93fae1a998bbd7e4468 |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | b24bae37c1ae83dcbe69c816172616509bef7ec9c1acf8984bc153301497b5c6 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 42f1dbbc8e8b0605718fa1fa1a369870a73d4e32087ff416ae4daaa871afe681 |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 19b0b409c1d099a41bc27e3f89500fb13005c2233cf91e0d475e9e4abceb3395 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 2d5162a5955e30832987cd06e2fcc89a985b0b930167b3a7ad0adc59d0ada6b5 |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | bb27c7072ea9bd024c22bbb01ae0aa0c797eaa25f5a4c0eff344f378cc36cfda |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 8f061a078ebc5c4139307303a8e911d3d89bad7533b0400bf313567d680cdf88 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 64c5132b877b8ca83b66f8846d27670a1806acdc717364ad151c5b952990a025 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | dad35d019b2439ac9de2aa890ed216fdf0e40886d82a26f7e0b1c65b2d631589 |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 68b35565f88f91744b6636132ae821ba2f72073e8204c7085f9b83cce487f99d |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom0-focus1 | — |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom1-focus1 | — |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom2-focus1 | — |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | fe2bc2c4bbffc728042ba19ce5fbe014a847a21e7d67b0cf0ce66f219f880451 |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 0939568662f6e63e80886d326d78d8fedbeee8e4f90c910c6c141108ad86d65f |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | cf4bb2d23fa88ce9734d46fc7dc4988a4d3144f5bf3061bf06a7f909f10a5abb |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 975c342338c09237be950c661a8b3fe9046b524c65b4065f5af161c8e5178cc3 |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | ad75bc6dbf8cb4e245db332c69d0c30e7c089425c579c21fecb06fcfad54f5a4 |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 2a320d30f30f6b02c0aa34758c9777a6810d207ebc9538f22751951b7dff87f0 |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 02820cf1696e9889fbed1432ad5fceb8cf546a806561e79598facb41f96e4e8b |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 22c3ce3c7b92bc226a9dd3a41e1076faf8806db04739a46e8c9f9a799129db7a |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | c969a54e33addead73d39b6ba802c7b520ebcadf442d59e40e6367d1c17f07ff |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 6e692a0e199cabf63729ba05688dc2f5833a0bacaebd09a209711188ee722af9 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 3f67f17d8ce11038ee0c7d939f2c993d193ee11f42aec6fb402eb138501a9438 |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | ee5585114d371991ee9805ad2efb944874c8064340e69f81736cfdd8fc66226b |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 367abc6436ca566810cd4ca1274edd659501866e6bc71e31ce98dffd71db5a43 |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 12cac0eecbb93d1a4878ac957929943ec9188893db8f81df3760e559f9ff2bb7 |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | bd1f4b506bafaa6bd9ce207d0267b310efb4480df403374f8c389bd8b93316fd |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 8dc43e61563490593705f21fc90e6c0e4120fb645f8f3889474b71f3a3bf0409 |
| certified-nikon-afs-28f14e-zoom0-focus1 | bcb4e0d9695ea9a187fd996263abb0657bf1809cc9109e6b993e331c3f99cc39 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | e82d9f1b13e2dfec5d0621aee24d83152d93c7765485eaf71ed34f5621767ea9 |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 647232257bbf24ae9b5cee87edaf7dc3011d38dc5e1d79d5842e47e2f584cabd |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 917aabd708bd0c3accb0b48be8282879c5fe76098b7aa89b07a03838ad083993 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | fdbd44e4a0309a7ba3368115d96baaed6270bdd4a1a2610a0afe62f9da0b23d4 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 5ac566e7a358c1f238cf99f403c375a05ddc0377abe5f92b19ece1e2bd37e9a2 |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 9fa80a8f8b76373a5794eff64645fe4f5462d09c5dbd8457e271d8db4df647f5 |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | da13641599ed3385532694b0792b9ad2edb8b38aa4a548a67dc952a3ad0437d0 |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | b86c34c5d24a108feee173a4d89330720ac39c31317a5bc9908c95ea413633cb |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | a0fab34e925d88be12032221e721629fbd894e25c501c1562684efdbf8290220 |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | e130c3836ae82e58719e196787dbde814c8e72b34a421b8ad2572133478abf12 |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | cc4c40bbff38b43f3dc01ff889fb2b9ad0f862dd8200a344767621ca9447c90d |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 5ba1047765a6aae7848cbde785c501e32aed194f3ceb2962ddcb926db43bced0 |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | e2f043f6aa82be4c267e3cdd6c294df9419ef866cf538714084f10999919182d |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 0c773c72ec1ce58d1c6755d4a43f04b90caff072d99a86ed7d01f5482aae6bb3 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 831d890fac38889e8c6c6ec9cdeaad4bfd18e09c32982387c59c12270ecdac49 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | e5652d1c3daaad6f4a3ed9892ab11741a8f932f5dc2458c9f5fa565aca69db71 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | d18f229aef311b3ae7ae235af9ce3d7d161cd142e543ada2c6085b8aac418dfd |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | bdb7bb2ffb29388eb18c6099c797fa10e73f9af0dfa0fd9785bdc47f34b7512a |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 8781ecb5ed087385d4dd3497a43a4c4041229ecc849d43564f1b7bf57f281a1b |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | e46f7fc23b6b81b9504d692f07a02509514fcf459b419bc18052f6571ac35d54 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 5b3114cea89417170a1af721f200b365cc6c403951cdc1c0cd8a9f5182e8fc77 |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | bac47355d7cb929f0fde951b81b8b91696e2d8c9474d977e06fdc1c226ccefcf |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 8e11925aa8e83363701522ca4785766eff807ebdf055a286100f3110c4e9dd45 |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 5d99c73aca6f15ba28ad8ee882bed261c100c449bf79bb5b638770941af19ef2 |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 297a610a898bffb766f10ca2859678016eb7b8b86311a4532cc8614ba766fea5 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 524c077c583638b3a216c227157a7b731729c8a28584e14e63b25f53b3f43c51 |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 1ce1424fcf14f48f9f60b894b00a0d269c4c96f6ecbe033e1d0528ae2a4f71ef |
| certified-nikon-micro-60f28g-zoom0-focus1 | e737912bcbff82b3d03bf32a448d9a965048e88f7bcfae2e13e2727efa3dcecd |
| certified-nikon-micro-60f28g-zoom0-focus2 | fec31ee7ac04ef6725d33f94c1acf20fcdbaa4ff1ac7e0592f7d0de5eb1a3558 |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 1954d56c9b208d2c2d2dc27f6e9c5f893304b2966e92cfdcceb4c6ba34a63fc7 |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | cc40fbe56d554487389b2ca5930a912620bdeba2e8b3fde8b60d4f1f56a9950c |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 2b44b4e897fbc575ef933b6a0b8668362129faaf2f305dff38fb31276bab59cd |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 64b6f1847543465f6f9d0dbdc6f3296b084088aebe953e046ce687895bef4855 |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | be30e882d556f3c9cd9181ee1be6cdd92d44ef1762adc320a498f1116425d1d6 |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | df2e8df023f90e806a021f669c5474e7863544e43d0a46448289fe0e20e1a2ef |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | ef717536eccebb3ced3319170b138e78f6822a9fe881c49ac4e49fae5b5c0fb2 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 425064aee516a775452de790cf0baa53090d54ee8846b04a293e5450f555e3f3 |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 3185e3128845048ffb7ce63c19bff71a3cb3283180dd21716c820d9bdde7872e |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 7b74926af86c489cbe255c6b24f5b1467b6fdc6774ab846c7f68bd6d16346192 |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 9ef266fd9a3fabdbad66080a68b52e494be33aeeb7ae2b0bc1811a1b379f5250 |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 0542c0c0ef9c981052107f2272c1b5a9979004cd06350b57d3f233088f20c21e |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | e476455a4bdc2b934087e7a0866848570fd751339a2bbca151316fc938166d57 |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | b0898bf3156193b3f5cac2fc1caeb92ba7c40ade3688afbd7bb62f0fd9c7f203 |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | 491592747df511322f3377e9573bde82967cdba2493f2d50ba87dfdd89c26e23 |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | ee99cc711bbba025a1862608b512cfa8f24d1e357b4ec3535044733c8be43955 |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | 41e4575aed432625ea38fbbda36e9b06d2d2ef8c7f1ef057e794f0a5606f36d3 |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | 007b3f60ef64e98cfb38b310e7f255d4095c9c75b092030c348c99081ee964e4 |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | 34e849567f7c80922f96328e21d6d27b028f76c875c61258e73e21f123655a3d |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | f5314d24ac520723d63e4cf5fd8e66610c222e2d39a5b7a03d602386fa8818f7 |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | f3176f9fcc81f8ee2345a84be6d6e9873147b54e3bc20340df67b30387514489 |
| certified-nikon-z-58f095-noct-zoom0-focus1 | 4da47b6461b25174c335ddccb114b7cc411de6c427c70b3730989ece3f033668 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | ba658fb5ff0e02c4574f08acaad929a6eda4417d2edb03e30dd8e68062b75ac1 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | a29affd282fc032939fa63bc117b7bf43c16a988542a73197e3ff2e5a8b6e158 |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 74ba94d182bf9f3405647ee873889eab05d0562854bcfffffb331b0d79a7b4b3 |
| certified-nikon-z-mc-105f28-zoom0-focus1 | 9908419e0a2a982a12934f9dc2b6fc3360baf585a0bebbb50b50d8baf6aaead0 |
| certified-nikon-z-mc-105f28-zoom0-focus2 | 3089070b40af08c3893b79ec4543fdccf629723e6d354fdd7deb57da3e83b22f |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | ac23c5b2dc605591d5ff9ec441fe63f32f33a0ed14c5d85e440896a2cccda722 |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 728d6eb879bdd4c65c32aa6beb1993a31f0dde88a015a755df4e06f3ee82411a |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | f0a449e22ef95a6b481a3d6196366274aa5116641dfe7e6e4b94c43d1a1aa703 |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 349ab1eb303865b9790456e6431af93dcd1b5141ec29259293e417545db8f0c4 |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 93952c999c082df5001435e1e592161f39288f8a75fc66c3b90a5bce37f8dc7d |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 058eb38708f0ab99e773d2dbf62a53778c8c53ebbfa4678459e7c62c9cb5319b |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 6acf99c154fb65f1b0cc9f36eed9106075a70a8eb6b094848dcc502fef15df0e |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 6e70c91e6d7cc6e326d65e1ab7155615dcab0bb5f82daea56d0eb630868ed0bf |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 941b9f3552c170857c8232c9b301baf6ea76d1cdf7058e85e01a19a52c95c3ee |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 2e81f5a8166158b3919e164b17de6bce6ac6637b6d0657d1784ac1108069bae7 |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 01f43956285ddda07c90fa9ad3671fb6b9b71c730d3b98675295fbc704ada1ac |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | a4dfa43e5f2ab8425d9f654988bd8df4a576d80e56b7c70924fe63ffcc95b051 |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | — |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | f725438a5cbe874b4adfb4a833671aba7a31022b552c94b4d013287b25072996 |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 02f5edeb04aa2f481168802e81a76451206f894ee349bd7610e2d6f0fcf5b44b |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 0ca515278e703e89c0f596874883afce28d3931771b45221d4e06ab4f00cbb59 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1ffeed7214f4c219837b85a1116192fabb1e72ff66cd098ede5710dd840281a8 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 9276015f4a09ae0df05099a0725962e7d7fa25e98db611b456bf45264207fc15 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 8270906e01b3faca8ae4a642653a0f2f6bbf6c56f6ed124c25e85fe787091421 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | e2778a011e81560e6271e675f6844482a66b7f3ad247d8746d3215ec4c08e3fe |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 6615a48be75c6f6fa26b1a42130ea364669c46fedd33e9128f6de7524d51d98b |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 2ee3771ab72d0c281fed76de402171bd9b2b19b5dcb62ad4a10905b0ec6a4035 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 9ddf0f72e741c0ab7d7f8dfc4d2c99d27b9e09da69b40936d860cca598cb4c36 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 34ad44c5ea41864211b6a0feaab96c3cf004eb0a38cf0cb8b870313e9f008ca7 |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 0af7d9da80c52f9d62cdea55966cc8f62d6058f7bc31172ba91d1b80e4dbbd0f |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 2a8da6053f22442e37c2a321504feda0419b9091ab263023537afc6ece714d55 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 3f8466490daa40222c36e81edfacdb296bb64c3714ba96760520b6c5964fd039 |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 8f8a78031bf7e8fc806be774f4bf08e9c42a725268ebc74d5236420614c58a62 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 673095cfc1f5665f4aa891be77f7cdb2eeef2dd706ea2d7769ea0e15425e4eec |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | b3794c6c5924cee466179682391e442c92d6fd70b1e0ab0b6ac97082d0b72852 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 0659c248d82dbf06c5521831ad34250a06d1f1b22c927cf1597770b0b227815d |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | f2ba46d7a8b2499a6bc7da15228827704f359e024db844b8fabb06c81d014ef9 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 874854625cf1dd589f47f331895c0b49532f902a20bbe796f268e2024ce7d9e3 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 99b6b35e6ae7faa9b94ac06d2c115bb160911667f256de438f8697ea9233b9cc |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 568f93341d119dcc2a9f1949c2dcfcc3d63f99dc26c391280a71e591244fa8d6 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 72842c3de154ccbb801450d8cbfb7800f0ec613c5773ac45f72186384e60381a |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 617deed34e0bc25befb3e30cb9c900e56525459a0186c7ec769967343f4edf14 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | db455dd71151e3a29c1df1c0c947b229ff79eee1068aece790b732b3c16f3979 |
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 15ce45a11fb8c25e4f30394cd0155697b0547473df2d1d13fb12a80f9fab8421 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 601393a3044f1793e2d2545b95bb2f69d0a00cb5a06a312f32f8e744efe5afc2 |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | a4c88b2daaa7bc52746dddefefd46aac59efe96b3430ab84a4e4b38d4c98bc5b |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 7c8acc3119b2e7ada9a7f95058f8096ef93e4cdc675484e32c4d62b439d43eb5 |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | ac19c63d75ccb57c5527937bc59f8cca9420f82978f5d6a63cd8fbadbaf570aa |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 34f712da6c8468a7c6ca58975f4a683a0883fd0826d06cdf3dca8a32a3571159 |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | 80efd11805c2f43e0fd79754d7442df6295341e7f1f9dd1d44c754640bf75da0 |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 5acffd255bd16dec38ec7bf59a63e15fa10c945e5f08321db0295f5d929e4e0d |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 01204c554aa6d3bdeb06a16826df2de8e1ba36f9872344a1ed008efa3c6624a7 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 3d5a20b1376dd20de3a83345ef6c2da070da30cd40724d7103c3f967518f0708 |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | d3441b94626128cabc8c5c29da20b912bb44299052020a329efda011d4872ccc |
| certified-panasonic-lumix-g-8mm-f35-zoom0-focus1 | — |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | cfdaf3f52ab425d4ee0490bd4bf40d7a91a37615f02c23c3749d3fce68b4622d |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 9876f2f2d40b032687ef30fd0b77d64b7a3d678c0010822ca3458e440d0d8955 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 53c5ca7e688cbf9f0983edcc98da88609e0868a5b88deef5ce559d2fa68766d5 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 1d1a13beb4b3fdde736e2b84dbf482de67ca20bc8dc21fa0214b2e72b10752b6 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | f57b92aba3b70ab8b91cfc624927040d5f86724eed27a742d5afa9274e2738c7 |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | dc7021dbc6deaddcb9df19913c9f755a79c14a608a808c8785586f2f0d05a489 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | bc33e93ab5f2c875b4f60667c1a5bcda0c1ae567f82d2b9eae6b0dcee7453aa0 |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | b4df0a69dc5cf7804243f87351e43e1006d0ce188717783759ff6ebb4cb4448e |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 9e3671b68b403840708c861b293eab4466718217ad6e235927ac961fa04cde56 |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 120f80d3effbe7e6ac8a0a96ee1abe43d1df8eed74f92f19bc9d1f713779d25f |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 68fd449102898daf1bf701b95f2946eaf6e9e77554f86c4890c4211607243b57 |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 761065a107d93181d4d5ed66e89c7bd83b4d441a4474a14246ca40d8b4440385 |
| certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | 2ce77b8c8478f44cf1301affd94fe1adf0353306e0804bebd70549913277aa15 |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 081479b0cc17e7ccdabaf6955249c9932596d27eb50874b44a27822670d8891c |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | eafde4b337d5f55855eaf110fc1cc9235363cf6a392cf06a776b5f759af11c8c |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | ab34a3ff91510c89cb19e8c441094423985bf1408cfc596aa5b003e214040111 |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | 6d49ddfb2101e97394dfb91d4857a9426b2950b62cde091db0dba711b1cc5687 |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | ccc15ae0dac7f791bb0ba97ce6ad703661508306683fcfa30ec8ec41db2cc383 |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | e812e383aefbf1378280012ca45313a098abf095b100503697336ceb47e9770f |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | a38d1660058fbc6279070839a7dc66cac1f49f705602936a3eb5cc5a2286a2b1 |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | ac18424133a2877c2a9ccfe9a1461027dfe1744e7bc33821de795c5c99fabad4 |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 8ee6b705de575b517031b3a81dac81eef3cb50c44acdb598629ac6b209d12f9a |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | bb47082c2e9124e55765678231442de72d55ad3b834333c85b8837cf7f9ca5aa |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 388cdbbd809ed76758c5305f5d30f99650d41f8a3c9788a8adb85dec99cf5420 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 87a4bd600ffd221c1d1f783cd9c114be47a31885a42a60661415550efbcdb540 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | f7393efc5b8bfd9654922f69bcafd6fdcc4f210cffafc82157f543fe16a794f4 |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 36e163b6e545a541bf5d9bc90364f042d16505a5f3eb5ea2295f5b72e1a97b63 |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | fa1f47fa266f2a3b734acfc5875c2cf9a0da214158a05baeba3828f068c03bd3 |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 85ef91b49c1fa0423ac07ee414f94cdf040b66ef9d240477cb1a803f56390510 |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | ce59e97f80de480fbe56c5d266ec68ba77bf15ba53b00d1df1e9de8f066fc1ef |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 473324337d1790b344feed7a92ba1f4ff05512853c904712e397db44a66c039e |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 353273b2752db6c3d95d49004937352b55c054170e4341ebc0e18808cde3a9b4 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | a4839027e563f13d61a31e229062869ba6eaa7282129c0aa694e96538d5ef2a4 |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 4709c8f33a736a0d5b0ce18089555ea8f27c78e57101c596a52d5203a59a099a |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | a686006fbdc209c320c50f5cc0797233ece3248a37bbb2815c937e3172d6de54 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | f738c7fd1c6b1e0119057b5dce8dd097ac9e1e924d461103f9b9821fd323025c |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 26cb89d09f607ed33c3dd367d9c8c05290608b97283f3a53140ceda948b6726e |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | c1cc4adf97b7f0c66c8bf07884777b902c2fdf5272a85c7eacf53a1719e98c79 |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | aae9784dbc44048cead30c8deddf34f02d016f0662ca2bb2cc5b631bd49a2b57 |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | f032558f1e6a2c97026c9779f1f75b487587b87d66c754a952d3b835f3b36022 |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 14740286e1d8e6a61b0fcbc191ef101ef695bc4517d87b50926b31c61fc042ed |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 1fc23e9a256680d7ddc6cbe08d15501270f9922017435939abcc2625200066bb |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | baf2330f967ed007a6cae2f177ef374e66b462a73849f5d41111de6c4f36541a |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | bc450fda457115ba846d86598e3b69822f687d4db0c498104d66da8c39b215e5 |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 5014298c052103c067414f21e7f30770ce9394aa999f7e69749824f03d2e0ef3 |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 1ce110eb2269e161e845b12826cd2ef8764a483cd98ce8bbda5855b1c35efa3a |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | c75804344ae15f0b57f5c700da4bb7594c342c32c5814e792b877b93e7553466 |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 664a578c48b550979b0ed87a15f3d2c0360c9a069919cceab3e6d5568747213a |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 7da5afc39f4d2091c09c8c36255771cd94b5b59f91c86f4cd1676794eb201690 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 77240b3249fc2f96cae82d1c5932f50dcef934088dc2120589ed64b46daa3b0f |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 02dd902ccabd7e9efddefd7cf52710bb38253debd4b731f861f8cc74e4fef217 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 22f573c4dcca9f77d238821d35ca62ce41661714c27dafce162fe79e5c759f23 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | eeb1536ebab034372569abe5359886111aae56eca2050eb0801d93c8c1e67dab |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | b549e5c3c090d253532f2bad999fb5293fb98117f7a7588ef80b18423f0e66a2 |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | — |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 1f15f45d7800074e6b2c6895949fbe2c9903dc6d2bdf85639826c560bcf95606 |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 927d7b116e4613a1de27ec09b6727035206cf5b199e82dacf4255d0b24b68a92 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 894debefc6fdb16f1ab38c6055c2fb104509070cfe07cd49d9ad4f8bc92fbd76 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | e3c1b9c0842d88e4bb1ea57ece875089e1a6de335469b227438334a9f4a6016f |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | acd7822027052cc1952f100f7114f829f03335fe258f4f7cec4b41880210e964 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 11e8a91c1e7e9666e6214e8dfa9a071aa95c30b044aa47782b4e7f85afc12bae |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 1e6042680d6d2e5a8da8202abe64e21fa0d2815229524bd3ad0d2ee01452790f |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 83f213e2d7558446acf42627da06560785c15e5b892331d12c7b48c3c7f96548 |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 67db6e012a0d70a8776e14237adab3e38dc06e3d5776dbe8f257feecee7dd0a9 |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | acd45c4d3d13b956da700f7ef03591b83ccd3e342545ada1ebe2d9d82af37a2a |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | b0be2f20e5b95353f9377fd656f14c691282d42c2e611dd69986cfcecb4b85e2 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 9aee102182725025ed61069c4cf367e7cebed4d547743098cb34574dfd66eaff |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | cf90a40810f02e10d4a3f936a8edef233b88ecbd3a6ee545eaf703df4560b90b |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 4d0027fc761e6ab1e6c4a1bb5f0a0b1ff90dd4840f686a536eab37f6abfff3bf |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | e251d77e7e9131f98e06713188eefd153ae215d1871161ee44cbc12719e3f642 |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 14041d465f783f711d167232e489aee39e28a20545e8bd03cf4c804363e15e52 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 17d8f3a57a99e1785f48b4b99a93338c1fe926853d879f06d38255370f1d221a |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 09c166a3940fa77c549513afef51aa55f9ca23a0bfaf697d02ea3d87596a9e5a |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 848e096ac814bc7eaa4915672cfce036c27f85ceea89254fe905572d130790ce |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 1dc8e1fdfc7b7c7704c42de95252b44e647cd6bbde66dac35bd9e53db525d699 |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | fb063dc8a16a740e133c1a53d3e2a7d7a83b2a37b4f39b913ffc2a92f91f3a8b |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 644f8b54712f2e8e04d19e5cc291fca1a671d65e6459308809abb27e7b525280 |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 10dabd24f0793d136c68bb0bebe5c05bedad47ed5b0d4a6c5ec2e08a2abc3d10 |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | a8ca108087cb40470949c9d789c08b901afad730407cc38ab272e50a29a30aec |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 851b25697188fac9d7e726bebd0f012893d277d9551e858f7d1dca682ecd9736 |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 0e48e496478c8c822adf0593b386dded544594b0ad9e8a52ee2df544dfd07851 |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | 495e025cf111be7936c652fc8924ab3695e6f26fd67715bf663984ab58b65860 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 62d4f5600679b10f237e8aa57b30967f59bb7bfb16b5a7a4d351fb64dc84f4eb |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3a6c0b2f69addb626038c0990440dde5ddee0abfcb44a8e595df75e5589fe065 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 18b137c95a0dea4adf0bc6590a8f3de81c6d67565837d10fce7c60af1a18a2f3 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | b4a9bef13532c7161f7793a1ecf28c9cafd8b539699dd9d40995b0a468bb9631 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 4c007de74973def2a32965907541cdd909b081ff8036fef4dde69926c5498cfa |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 827ce23a9b1f784a4b5c4dd72bd345210bc4f7ae826b576e158c4b22bfb38ac4 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 88fee4e84777e7181151c3b0a912d70efc6652ccbc666ad44e1fff00ce7865de |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | bf2ae8d971feac5f443b981f14fa33957883b73d39ebc168f1c7cd0fcf0e46a5 |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 803b931ecef50d7dda14551d145463bb9d9f1b1973a4337dfd22bbc794d6bc72 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 32df41682ad6ae1d40d27c62b3c23257cff59bbeda72184810f245cecd13493d |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | b095f288ed25fe8811fa91dd9e7d4fb3d56cb6600479580147e3c47c574ebba9 |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 5fc447c1c97b82af66fdc84fa82ed93e9aba571bf7dbee8900b81a0579470d98 |
| certified-sigma-85f14-art-zoom0-focus1 | aa15565b6f8e0b8a19a8e9de0abd602df7b15519aaac747627a2d2bb3d425aee |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 10bff0b1d82d13878aac8613719bc9056478c7706a675c17b4e2cd8e7f9de763 |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 4e764b10904167610e81d01347a3757bd2104c01fc094d8a36b371e333dbc5aa |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 22198c5be871fa98cbbb32e8975a4030730a7894a5e8eb7bfe84328a92f0e7bb |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | d3c8e53174c6be102245c0f585610a5113b69023d529bc4a8ef903ed7dab1b81 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | e3494e8829f8776277b876a310757be1c87ad3383f203625023abbde92f0401e |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 84e21a2ef03892e1c5b23daa5313ab4e43886ee541e31976e7cc56e6e12a3a67 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 7a92eb0b2623d19d04ac0bbdd7e48ac7cf8450c1b86206acc2de837ac97f7166 |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | d1ad44f0f8712fa04fac2430a80cafefe0168d1eb04e9afe3970c1cb4fa942bf |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | f1071f7701d9544665ca1b8cba89b6298fe21e31f40eaecf48871ea13984541e |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 30adae30e309e63fe7f79aa0defa55431ba9f3dcbeb8c07add95aae76d033ff0 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 35ac75877ed19b347d55310611871ab060af15e1e0aad8d5f459f267d78e2002 |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 5bca6fc27b2fd6d1feede4f149f3b430b050e36bb3f46d7c0cb05369c7da3944 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | e66d7ce98eb7ba9e080cb5247736616f8a44ddb243f3336b537bdb9343b9346f |
| certified-sigma-art-40-f14-zoom0-focus1 | 6c1a72f1e69116d071ef97afb36c586b5984eb87a0601ff1717c251359ba6615 |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | c85c649ac9839fedd1d3bf57fc34380f2e10f992fa6b86b651701e301f00e666 |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 31df4fbca3db4ce1a7d0789c03342c9eb3cc00ad6df044875139468bad49f815 |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | e3073666315beed79ff59e2c692bfec2152164eab2826f940a3fc334d202a70e |
| certified-sigma-dp2m-30f28-zoom0-focus1 | cc8c28a93b9097140973bdac266cdd57da7b0670a4279e5295a5a281af075147 |
| certified-sonnar-e-24f18-za-zoom0-focus1 | 2f06f9bcbc1887e65bf6b4fc2eb2180f2a0d3169df951cc0c433569458660692 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 7a9028a0badf2cac69afe2330c58a585f0dca4f99afc5fad55bb354f04e73df1 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 22ace4eee4599b1f771d37fb1bcbe14a6b8e4182cbf3fcbd9be8115e94ed16b8 |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | f0e136e0d546b163221d5095f4f17e380886e39a352cc59e873e23fb8aa9285b |
| certified-sony-e-20f28-zoom0-focus1 | 1a0c0bc7d2d51d2fbb56aa8b555260fcb3c772b5ae9616bbb136a2578c361a36 |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | 27b663a5615d91fe77edd777f05b721c0ad540f510d8bf2cbbb9e6101cda4e41 |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | adaa2817d924e9cf327ba688b20b67043249829c0ad93dcdb2b62ec075a65bc4 |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | b33aa5339bb9ddeb33d3c9ce6d639e6c864883c1c53664bebd259ab074b952fe |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | 4e0f4450b3b158005ce99056ae0577dde01c3629be13c955237ab60f321a8478 |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | 69867866857b24110b9845b805103797226d22377578c66bdb5acc68be8a17d4 |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | 4687cf6f28faea869a03d74a28d106b6720c326f6ba8cce91a7630208f2f9815 |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | df218c15a379cb447f964dd42c3fd68d1ee49e972b54a1d14bfcbccb6ff0cbdb |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 2de250f4482f403846ab240ce79473ce30f060ee2ca7e096a26c087a498d67b3 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | e170a27bf0f04b35a07de0bd67b90b4650035a5fc506fa0cef4af6e64f8f56ac |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | bed3f4d42fa7546b3c173cb7141670e8fd1dbfd356fcf52aa5a874c11ec089c3 |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 3a0e80a04ef80a6eca71853aade877480cd1a2db78f5b0c99001b256c714dd22 |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 61a18f7079152b91baa90009f0f51c3d1d2153a4547413069e3e86227eca49ae |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | beba7c04a0ef502b737e829015f66df740c6776662da94153a2c451775f54e6b |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 4bace493f4664aa07f715fb1fb8012792bdc6b80b1566961cfabaa68dc5648e7 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 07decfcb265dc340c54a16d3dc1183066b08f738d32d31be88671082753b7239 |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 3d8ef6eae263508bd3535d283e9303bb9689ed1b6c6c8ca98bb44517d621dc1d |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | da0779f5c87036d8a52d726e1479c819a17d1bff8620f46cb711690553419ec1 |
| certified-sony-fe-24-f28-g-zoom0-focus1 | ff0673bd6d7835fca1ba2aac41f3f304bd21797344087881fbbe029d72ce63eb |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 7485fec643f9963ecef1b5ce3dd755a997fff9dd65a24e0940ee6d856fa975d5 |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 1fd3e0cb6537e5c04f6822ee06ba6f077accee2c4f048da2743c79ca5ee81cb4 |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 6b2555e7c9c4874fba7bcd91cbcd97283594ed6252b2d4f5508aba1a1187200e |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 5b2b3db5b33e53d26a56f798e4aafcae5762eb19479cdcd8e844c80c20797837 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 6e2c35ab174efbaaadda6de665623c33a25f59f57dff9253128d1c9e253859b7 |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | afd88c2a4303eb95ab8b0aad955b161a9d870fdf5e208375d233d2247b01466b |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 96317fcb0a131f9a546f9099feff2afbc17cf45bb0107ced1808690dcdc1d74f |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 7345ce6b72b8f9b2a1bc62ec4e662576889c3d21bfd53949b26a2608acde241d |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | f1649607a56464466650649403af2b9ad05c94f5acce89f1be347910be7fc2b0 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 8fb59498f29e1c7a00d63c2bb0f3985e3c4c6ef6ce6ee1e93433addae809ff90 |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 999ac964b757f064eec7244e64e523dd6afa72d0807596d6ebbf45e9628e9d4d |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 44f1e51b55435c93932e8d9736e3764c21b6bbe140735eea3214b4166181d329 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | bde4a846cf5bd611100323ac4d8a3d417090282f743da51362336f88c273fc01 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 633723a1dc2769db9a0666da391db2494b78a19dd4e12c609efa5305da712fc4 |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | d7fd59e8546239bf71a9aeff0fc2ab86112bb5595cd143046c9870821836b781 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 5db1210c3a0639a822a4880f6f0de09018c8ff71d84ed0d51239a04f19e8eaa7 |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 16a485abb255681261aa49d6a97d95e273551d5a7890cb72178deae00b3907f5 |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 62c7c33f9322b26227c793e8d710a762a8dfce67c4e8ec59e932d9da73f23d70 |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 48875681410df43cf81628bd6a6939b87d37bbc0c201667ad8ca313a419a31b9 |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 072a6f509735e1345e75bc95430534bba1fbc0caa3676a0146c83fd39d6355c8 |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | 772babd6c9a9365f0c06a1be386c4b200c88d252ec58af695adc5373ef5ef674 |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | 492bc1ba7a17250067e06c3e6cc842178a6435cc801c84a36ecab033294d3246 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | c4cafe389ff19f2b3ac144e21ca3a2ece14048ff1d29f1bb6524fe0babf56aab |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 7cdedfe0afa1f9483af937f9046fbb2ab00c5bc46d01efdccf884970dcd7f325 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | e29835a068866e0eb6f0b139d64a7097729dbf772bb0e5a01721d000d453e978 |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 7633bba353a8983bc790a2dc68ae352491a18b16adeb06c176d3ca00980bf411 |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | c59e472ec4b0a756f36635847d9a5d8a007cb1335beba2848dca7f4cdfadaecc |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | e9ad1a503946236f045733f560103e3933bd81639f95378052623200c2cfcc6b |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 994c354dbc1f23b34155f96356c86d66c874b96fc93a767ae4b11094eb343fc3 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 20423bc3d2cf0c94f92962d1a19b5c88df68a1182f58d8c4698435db7afac44a |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | aaff9815c508484df48e929f734b02614f2ad1da679248c81ac9264b2be40f9f |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | 30fb79f1d45ba3d665b716bf0001edb65e2c9637cd46cad2a0e304e078ea92eb |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | cf5bfc19bb19d9416ec8d7cb6d06d35602e9e22a6555ab611425d7cab311ca16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 25da8f06a8d3bdf2628ebb6d3ca7332233ad2a86a1f534cd812ccffcca269b8c |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | ccbca3c4799d7e3c75230c6a96457fd805507f1aeb1485390433f3b99e2be175 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 4556b24f2345c91fef9e2df87e3544a6fc6a852e9a89c849d0fb11af035c1b97 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | b79ae4124a45de47ebfee73fc4b4689acae2c77197bfac0a952f98759e9fdd03 |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 4b0c13af1b80402be0e38c1f4c97d98ec385ad8e0cbf10c7bbe16fa4d91e06cb |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | bb7e2824a128470069319c02fc1aa5491069b9f35000cd2e3379f930ce99c1f3 |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 1658ead4b9b8a6945d4f886fd6b4f2358e432cb0db14597a18f655eeb1496d6f |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 61c16fa7a19d167d2216f0758ae107781ddd314d445f87854dc9803e03163749 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | db842ef619ba37a5a545e1d0ebe5fccb8d48e5901a671d6c881d8d200248d751 |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | d2b22ff17294de53a18a34fd782a74e7cac93e8877e75f80dfa972469fe3dad1 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 6bf046b2fca4fea51917e94fc1959015cc4f4437cfd5c2ade1428793816e54d7 |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 809dced0ccd1d74476ab9fd7caff0414696cac4b08bb964a88c013d09c3b5c8b |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | a15a42e1725b3dfd44c739569624831b2e4ba525d66fd6b2685c72c86c3a7a2c |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | f8e388d76b003371215471c21196c27490b0cbf74082366abf7113a8667555cb |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | ae188d3eb305c52019797e5d4b2b534ffaa03c876c648707567624a3b8f9a0fe |
| certified-ultron-28f2-asph-zoom0-focus1 | 36985dc667666fea51dd82482db70d8c6342354bcfea60439580f20ea2cd242f |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | d74acafd5f1a120a23f631f49dec57a7a2776329f3cf0f04c3cf345bd0ddc0b4 |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | 0ba1f8b7b11f3795ec893388432585a3e30850604a4933257082908e0cc2a15f |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | 131790e53beabbc8535281b6d646b42ef96ab2214d7d0e5a475582ca50191163 |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | d1d8b2bd8829d3adf76a6865164044a0c481b1c3cdac2fdc327ce297bbe050cb |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | 7654996fb632089dfd29c6b2245c17ee96b17824d4e33ee0e3bae8ced3dab74c |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 54b85cd00d5757df1a7690834189a7539471ae96a6408a318ea39d051b37d27d |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | d718e729027e34c4a1644e690e48fcace48ac2f88c50b47471f79e66f38d4c44 |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | bf3a63249af567f91a1696b7ae9c36ce814a205b37e3e6f1f75a8ca4db0810fc |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | db4a7601df91386311957c60ac6633bb85d43ac337a51216a887e1bb583f92c1 |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 5b10afde2e0e4c2bfa5e5f389329a82778beb4076c4a6e3c9a4f419e27f354ba |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | b3211d4baf264bbb33b984948e282ee7ecc999ded6b2e2b6d6425a5d19a329c5 |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 2e2275a5128c4ac0016656618a81699baea677bab35f9252203cdd51e4556ea2 |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | f3b6869f0d15a83f79189993426a2d5fa8dfaeb48872cb8b441be70b99fb23a4 |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | bb2f07710783da47c173f000668231a798035d49e782f65753a19920c493d949 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 8335a5251045d2e93cd6afaa9dbb63a6ee8e82a7d176d59a2122424454f99b57 |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | efa48c25e865d81a950205af366e4d5250f287bd11f60f4676e4097d6c02c147 |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 5af3e685a9cdeb32482328a03ce9567a90ef46f80de5f95541f88b2419f1ee9b |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 05dd837665b76e8d1d9ffe7ab7e0437d99f7452c4abb7fda31694106915f6389 |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | bec4e1245fa65a0c61b712caa096ba28e5c2b8c83bdd9bb12c3c85c8207b87f1 |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | c1d668465d6f4597b9711c5a5352ef1d0e3d2609373e70238596ca492463c4e9 |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 699a701d3a494ca103a19ab20b0af40b4d6b2442eb7ad76bebc9ae4f3187027e |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 6977feb12c003abef29cffa6f8a5111330f51d2dbe8f526b5c32ecd6cf4ba8fd |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | ed6e459641a35aade871406359f2ebcab7bc1390fefef6c0ee392a9d517c3735 |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 2ff0526dedc1d039188ca6f063ddfbe899a27232ca9c07f4de8fac3f4e87c2cf |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 393954eeb4eba0528f30c818a623a629ef1e6939dc121a8da99c53ee21fc0a08 |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 7b1b24be56aa9ef6b569f6cf213e08b7f11003d965438e58bf31602ac182064a |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | c76e47f2877fc163b73ec7fbd77c17cce03f9214b2e9ed32eba9a1ec9a870f08 |
| certified-zeiss-batis-18f28-zoom0-focus1 | 9c98d0c2b41e30c63dc471bd0e5a187c972f53d8e3377f489e73d7164eff5f71 |
| certified-zeiss-batis-85f18-zoom0-focus1 | a331ea4d3d83ed0b5901de80966bae3218b9c21d088e71130b34d74497f7cf89 |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 1e3c3ef09f59892c59b86d22c0d7e2ba112c942371d076a7e747e44839323325 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | a2f8c45732b7b0e74e295ac1cb3c8224682babff8adc93ad0da91963b42ad430 |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | adb398c00f907f3e52fa9ac9f80ee320518e5543ea7a10b56a02f40519cd13f3 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | ffd2647be8fcac307519aaa69a04776a7fc608a46c4b2d6bfeab3bbe5bd7f6e9 |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 754f2b025e25a0d6f94032965861cba8f085b662c0266e0148d87060343c8095 |
