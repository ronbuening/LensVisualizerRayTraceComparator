# Baseline of features: the ray checks

This file is the committed record of the ray checks of the suite features, as its baseline holds them: for every
run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every
pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and
wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so
`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no
ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the
engines are still those of the baseline. How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | features |
| Limits file | v25 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 193 engine files |
| optiland | optiland | 0.6.2.post234+ga9e544a2 | backend numpy, clean checkout, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 611 source files |
| reference-tracer | Reference tracer | 1 | 13 source files |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 18 | 18 | lv – optiland | 18 Pass | 18 Pass |
| Built system — `built-system` | `system.describe` | 18 | 18 | lv – reference-tracer | 18 Pass | 18 Pass |
| Built system — `built-system` | `system.describe` | 18 | 18 | optiland – reference-tracer | 18 Pass | 18 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 18 | 18 | lv – optiland | 18 Pass | 18 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 18 | 18 | lv – reference-tracer | 18 Pass | 18 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 18 | 18 | optiland – reference-tracer | 18 Pass | 18 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 18 | 270 | lv – optiland | 18 Pass | 270 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 18 | 270 | lv – reference-tracer | 18 Pass | 270 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 18 | 270 | optiland – reference-tracer | 18 Pass | 270 Pass |
| Optical path — `optical-path` | `rays.trace` | 18 | 270 | lv – optiland | 18 Pass | 270 Pass |
| Optical path — `optical-path` | `rays.trace` | 18 | 270 | lv – reference-tracer | 18 Pass | 270 Pass |
| Optical path — `optical-path` | `rays.trace` | 18 | 270 | optiland – reference-tracer | 18 Pass | 270 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 18 | 54 | lv – optiland | 18 Pass | 54 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 18 | 54 | lv – reference-tracer | 18 Pass | 54 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 18 | 54 | optiland – reference-tracer | 18 Pass | 54 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 18 | 900 | lv – optiland | 18 Pass | 900 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 18 | 900 | lv – reference-tracer | 18 Pass | 900 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 18 | 900 | optiland – reference-tracer | 18 Pass | 900 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 18 | 189 | lv – optiland | 18 Pass | 189 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 18 | 189 | lv – reference-tracer | 18 Pass | 189 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 18 | 189 | optiland – reference-tracer | 18 Pass | 189 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 18 | 72 | lv – optiland | 18 Pass | 72 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 18 | 72 | lv – reference-tracer | 18 Pass | 72 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 18 | 72 | optiland – reference-tracer | 18 Pass | 72 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 18 | 180 | lv – optiland | 18 Pass | 180 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 18 | 180 | lv – reference-tracer | 18 Pass | 180 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 18 | 180 | optiland – reference-tracer | 18 Pass | 180 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 18 | 90 | lv – optiland | 18 Pass | 90 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 18 | 90 | lv – reference-tracer | 18 Pass | 90 Pass |
| Vignetting rays — `vignetting-rays` | `rays.trace` | 18 | 90 | optiland – reference-tracer | 18 Pass | 90 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 18 answered |
| Built system — `built-system` | optiland | 18 answered |
| Built system — `built-system` | reference-tracer | 18 answered |
| First-order data — `first-order` | lv | 18 answered |
| First-order data — `first-order` | optiland | 18 answered |
| First-order data — `first-order` | reference-tracer | 18 answered |
| Ray trace — `ray-trace` | lv | 18 answered |
| Ray trace — `ray-trace` | optiland | 18 answered |
| Ray trace — `ray-trace` | reference-tracer | 18 answered |
| Optical path — `optical-path` | lv | 18 answered |
| Optical path — `optical-path` | optiland | 18 answered |
| Optical path — `optical-path` | reference-tracer | 18 answered |
| Geometric MTF of the same rays — `geometric-mtf` | lv | 18 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 18 answered |
| Geometric MTF of the same rays — `geometric-mtf` | reference-tracer | 18 answered |
| Spot and fan rays — `spot-rays` | lv | 18 answered |
| Spot and fan rays — `spot-rays` | optiland | 18 answered |
| Spot and fan rays — `spot-rays` | reference-tracer | 18 answered |
| Spherical aberration and axial colour rays — `axial-rays` | lv | 18 answered |
| Spherical aberration and axial colour rays — `axial-rays` | optiland | 18 answered |
| Spherical aberration and axial colour rays — `axial-rays` | reference-tracer | 18 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | lv | 18 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | optiland | 18 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | reference-tracer | 18 answered |
| Field-curve rays — `field-curve-rays` | lv | 18 answered |
| Field-curve rays — `field-curve-rays` | optiland | 18 answered |
| Field-curve rays — `field-curve-rays` | reference-tracer | 18 answered |
| Vignetting rays — `vignetting-rays` | lv | 18 answered |
| Vignetting rays — `vignetting-rays` | optiland | 18 answered |
| Vignetting rays — `vignetting-rays` | reference-tracer | 18 answered |

## Built system — `built-system`

Compares: Built layout, shape, aperture, index and sampled sag. Kind: held to a limit. Quantity asked of the engines: the system as built (`system.describe`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.34e-16 | odd-asphere-ref | sample 5, surface 3 |
| lv – optiland | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 4.44e-15 | stop-inside-element-ref | sample 8, surface 6 |
| lv – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 2.69e-16 | odd-asphere-ref | sample 8, surface 1 |
| lv – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 3.55e-15 | zero-asphere-ref | sample 8, surface 1 |
| optiland – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.33e-16 | asphere-a20-ref | sample 6, surface 5 |
| optiland – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 4.44e-15 | stop-inside-element-ref | sample 8, surface 6 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| odd-asphere-ref | 1 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 2.69e-16 |
| odd-asphere-photopic | 1 | Pass: sag.maxScaled 3.34e-16 | Pass: sag.maxScaled 2.69e-16 | Pass: sag.maxScaled 2.69e-16 |
| e-line-ref | 1 | Pass: sag.maxScaled 1.70e-16 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 1.95e-16 |
| e-line-photopic | 1 | Pass: sag.maxScaled 1.70e-16 | Pass: sag.maxScaled 1.95e-16 | Pass: sag.maxScaled 1.95e-16 |
| asphere-a20-ref | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| asphere-a20-photopic | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 3.33e-16 |
| flat-base-asphere-ref | 1 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 2.53e-16 | Pass: sag.maxScaled 2.56e-16 |
| flat-base-asphere-photopic | 1 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 2.53e-16 | Pass: sag.maxScaled 2.56e-16 |
| rear-plate-rim-ref | 1 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 1.90e-16 | Pass: sag.maxScaled 3.11e-16 |
| rear-plate-rim-photopic | 1 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 1.90e-16 | Pass: sag.maxScaled 3.11e-16 |
| fixed-iris-zoom-ref-wide | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| fixed-iris-zoom-ref-tele | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| fixed-iris-zoom-photopic-wide | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| fixed-iris-zoom-photopic-tele | 1 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.38e-16 | Pass: sag.maxScaled 2.38e-16 |
| zero-asphere-ref | 1 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.78e-16 |
| zero-asphere-photopic | 1 | Pass: sag.maxScaled 2.06e-16 | Pass: sag.maxScaled 2.02e-16 | Pass: sag.maxScaled 2.78e-16 |
| stop-inside-element-ref | 1 | Pass: sag.maxScaled 1.66e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.17e-16 |
| stop-inside-element-photopic | 1 | Pass: sag.maxScaled 1.66e-16 | Pass: sag.maxScaled 2.37e-16 | Pass: sag.maxScaled 3.17e-16 |

## First-order data — `first-order`

Compares: First-order quantities and pupils. Kind: held to a limit. Quantity asked of the engines: first-order data (`paraxial.first-order`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 6.39e-14 | e-line-photopic | line 3, quantity frontFocalZ |
| lv – optiland | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.28e-13 | fixed-iris-zoom-photopic-tele | line 5, quantity exitPupilZ |
| lv – optiland | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.28e-13 | fixed-iris-zoom-photopic-tele | line 5, quantity exitPupilZ |
| lv – optiland | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 1.24e-14 | odd-asphere-photopic | line 1, quantity exitPupilSemiDiameter |
| lv – optiland | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 1.24e-14 | odd-asphere-photopic | line 1, quantity exitPupilSemiDiameter |
| lv – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 5.68e-14 | odd-asphere-photopic | line 0, quantity efl |
| lv – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 5, quantity exitPupilZ |
| lv – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 5, quantity exitPupilZ |
| lv – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 7.11e-15 | odd-asphere-photopic | line 0, quantity exitPupilSemiDiameter |
| lv – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 7.11e-15 | odd-asphere-photopic | line 0, quantity exitPupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 6.39e-14 | e-line-photopic | line 0, quantity frontFocalZ |
| optiland – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 1.14e-13 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| optiland – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 1.14e-13 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| optiland – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 1.07e-14 | rear-plate-rim-photopic | line 3, quantity exitPupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 1.07e-14 | rear-plate-rim-photopic | line 3, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| odd-asphere-ref | 1 | Pass: pupilZ.maxScaled 3.20e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: pupilZ.maxScaled 4.62e-14 mm |
| odd-asphere-photopic | 1 | Pass: firstOrder.maxAbs 4.97e-14 mm | Pass: firstOrder.maxAbs 5.68e-14 mm | Pass: firstOrder.maxAbs 5.33e-14 mm |
| e-line-ref | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 3.55e-14 mm |
| e-line-photopic | 1 | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 3.55e-14 mm | Pass: firstOrder.maxAbs 6.39e-14 mm |
| asphere-a20-ref | 1 | Pass: pupilZ.maxScaled 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| asphere-a20-photopic | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: pupilZ.maxScaled 3.20e-14 mm | Pass: firstOrder.maxAbs 2.68e-14 mm |
| flat-base-asphere-ref | 1 | Pass: firstOrder.maxAbs 8.88e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm |
| flat-base-asphere-photopic | 1 | Pass: firstOrder.maxAbs 6.39e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.97e-14 mm |
| rear-plate-rim-ref | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: pupilZ.maxScaled 2.13e-14 mm |
| rear-plate-rim-photopic | 1 | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 4.26e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| fixed-iris-zoom-ref-wide | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 3.55e-15 mm |
| fixed-iris-zoom-ref-tele | 1 | Pass: pupilZ.maxScaled 5.68e-14 mm | Pass: pupilZ.maxScaled 4.26e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |
| fixed-iris-zoom-photopic-wide | 1 | Pass: firstOrder.maxAbs 2.13e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.13e-14 mm |
| fixed-iris-zoom-photopic-tele | 1 | Pass: pupilZ.maxScaled 1.28e-13 mm | Pass: pupilZ.maxScaled 8.53e-14 mm | Pass: pupilZ.maxScaled 1.14e-13 mm |
| zero-asphere-ref | 1 | Pass: firstOrder.maxAbs 1.42e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| zero-asphere-photopic | 1 | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm | Pass: firstOrder.maxAbs 2.84e-14 mm |
| stop-inside-element-ref | 1 | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 7.11e-15 mm | Pass: firstOrder.maxAbs 3.55e-15 mm |
| stop-inside-element-photopic | 1 | Pass: firstOrder.maxAbs 1.07e-14 mm | Pass: firstOrder.maxAbs 1.35e-14 mm | Pass: firstOrder.maxAbs 1.42e-14 mm |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.06e-12 | rear-plate-rim-photopic | field 3.29e1 deg, line 0, ray 654, surface 17 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 9.69e-15 | fixed-iris-zoom-photopic-wide | field 3.93e1 deg, line 7, ray 398 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 3.77e-13 | rear-plate-rim-photopic | field 3.29e1 deg, line 0, ray 654 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 237404 | — | — |
| lv – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.23e-12 | asphere-a20-ref | field 4.06e1 deg, line 0, ray 911, surface 13 |
| lv – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.18e-14 | asphere-a20-photopic | field 4.06e1 deg, line 3, ray 877 |
| lv – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 4.26e-13 | asphere-a20-photopic | field 4.06e1 deg, line 3, ray 877 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 237404 | — | — |
| optiland – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.25e-12 | asphere-a20-photopic | field 4.06e1 deg, line 2, ray 911, surface 13 |
| optiland – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.22e-14 | asphere-a20-photopic | field 4.06e1 deg, line 5, ray 877 |
| optiland – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 4.82e-13 | asphere-a20-photopic | field 4.06e1 deg, line 0, ray 877 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 237404 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 3 | Pass: direction.maxAbs 5.66e-15 | Pass: hits.maxDistance 8.72e-13 mm | Pass: hits.maxDistance 8.72e-13 mm | 2425 / 650 / 0 | 2425 / 650 / 0 | 2425 / 650 / 0 |
| odd-asphere-photopic | 27 | Pass: hits.maxDistance 6.95e-13 mm | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.01e-12 mm | 21919 / 5756 / 0 | 21919 / 5756 / 0 | 21919 / 5756 / 0 |
| e-line-ref | 3 | Pass: landing.maxDistance 7.84e-14 mm | Pass: landing.maxDistance 4.63e-14 mm | Pass: landing.maxDistance 7.44e-14 mm | 2573 / 502 / 0 | 2573 / 502 / 0 | 2573 / 502 / 0 |
| e-line-photopic | 27 | Pass: landing.maxDistance 7.11e-14 mm | Pass: landing.maxDistance 6.47e-14 mm | Pass: hits.maxDistance 6.64e-14 mm | 23179 / 4496 / 0 | 23179 / 4496 / 0 | 23179 / 4496 / 0 |
| asphere-a20-ref | 3 | Pass: landing.maxDistance 1.15e-13 mm | Pass: hits.maxDistance 1.23e-12 mm | Pass: hits.maxDistance 1.24e-12 mm | 2583 / 492 / 0 | 2583 / 492 / 0 | 2583 / 492 / 0 |
| asphere-a20-photopic | 27 | Pass: hits.maxDistance 9.49e-13 mm | Pass: hits.maxDistance 1.22e-12 mm | Pass: hits.maxDistance 1.25e-12 mm | 23253 / 4422 / 0 | 23253 / 4422 / 0 | 23253 / 4422 / 0 |
| flat-base-asphere-ref | 3 | Pass: hits.maxDistance 2.43e-13 mm | Pass: hits.maxDistance 1.03e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 2427 / 648 / 0 | 2427 / 648 / 0 | 2427 / 648 / 0 |
| flat-base-asphere-photopic | 27 | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.05e-12 mm | 21891 / 5784 / 0 | 21891 / 5784 / 0 | 21891 / 5784 / 0 |
| rear-plate-rim-ref | 3 | Pass: hits.maxDistance 1.05e-12 mm | Pass: hits.maxDistance 1.04e-12 mm | Pass: hits.maxDistance 1.03e-12 mm | 2391 / 684 / 0 | 2391 / 684 / 0 | 2391 / 684 / 0 |
| rear-plate-rim-photopic | 27 | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.06e-12 mm | Pass: hits.maxDistance 1.07e-12 mm | 21529 / 6146 / 0 | 21529 / 6146 / 0 | 21529 / 6146 / 0 |
| fixed-iris-zoom-ref-wide | 3 | Pass: direction.maxAbs 3.33e-15 | Pass: hits.maxDistance 9.31e-13 mm | Pass: hits.maxDistance 9.31e-13 mm | 2436 / 639 / 0 | 2436 / 639 / 0 | 2436 / 639 / 0 |
| fixed-iris-zoom-ref-tele | 3 | Pass: landing.maxDistance 4.23e-14 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 2857 / 218 / 0 | 2857 / 218 / 0 | 2857 / 218 / 0 |
| fixed-iris-zoom-photopic-wide | 27 | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | Pass: hits.maxDistance 1.00e-12 mm | 21942 / 5733 / 0 | 21942 / 5733 / 0 | 21942 / 5733 / 0 |
| fixed-iris-zoom-photopic-tele | 27 | Pass: hits.maxDistance 1.01e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | Pass: hits.maxDistance 1.02e-12 mm | 25695 / 1980 / 0 | 25695 / 1980 / 0 | 25695 / 1980 / 0 |
| zero-asphere-ref | 3 | Pass: hits.maxDistance 1.27e-13 mm | Pass: hits.maxDistance 1.12e-13 mm | Pass: hits.maxDistance 1.26e-13 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| zero-asphere-photopic | 27 | Pass: hits.maxDistance 1.47e-13 mm | Pass: hits.maxDistance 1.51e-13 mm | Pass: hits.maxDistance 1.42e-13 mm | 26597 / 1078 / 0 | 26597 / 1078 / 0 | 26597 / 1078 / 0 |
| stop-inside-element-ref | 3 | Pass: landing.maxDistance 2.74e-13 mm | Pass: landing.maxDistance 1.03e-13 mm | Pass: landing.maxDistance 2.81e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| stop-inside-element-photopic | 27 | Pass: landing.maxDistance 3.55e-13 mm | Pass: landing.maxDistance 1.21e-13 mm | Pass: landing.maxDistance 2.95e-13 mm | 27675 / 0 / 0 | 27675 / 0 / 0 | 27675 / 0 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 2.95e-9 | fixed-iris-zoom-photopic-wide | field 3.93e1 deg, line 7, ray 398 |
| lv – optiland | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 1.31e-9 | asphere-a20-photopic | field 2.42e1 deg, line 1, ray 774 |
| lv – optiland | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 1.31e-9 | asphere-a20-photopic | field 2.42e1 deg, line 1, ray 774 |
| lv – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 3.16e-9 | fixed-iris-zoom-photopic-wide | field 0 deg, line 7, ray 206 |
| lv – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 3.04e-9 | asphere-a20-photopic | field 2.42e1 deg, line 7, ray 815 |
| lv – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 3.01e-9 | asphere-a20-photopic | field 2.42e1 deg, line 7, ray 815 |
| optiland – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 3.19e-9 | fixed-iris-zoom-photopic-wide | field 0 deg, line 7, ray 206 |
| optiland – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 3.04e-9 | asphere-a20-photopic | field 2.42e1 deg, line 7, ray 815 |
| optiland – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 3.04e-9 | asphere-a20-photopic | field 2.42e1 deg, line 7, ray 815 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| odd-asphere-ref | 3 | Pass: opd.maxAbs 2.42e-10 waves | Pass: opd.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.02e-9 waves |
| odd-asphere-photopic | 27 | Pass: opticalPathToImage.maxAbs 9.97e-10 waves | Pass: opticalPath.maxAbs 1.50e-9 waves | Pass: opticalPathToImage.maxAbs 1.58e-9 waves |
| e-line-ref | 3 | Pass: opticalPathToImage.maxAbs 1.30e-10 waves | Pass: opd.maxAbs 7.81e-11 waves | Pass: opticalPathToImage.maxAbs 1.04e-10 waves |
| e-line-photopic | 27 | Pass: opd.maxAbs 1.27e-10 waves | Pass: opd.maxAbs 1.13e-10 waves | Pass: opd.maxAbs 1.34e-10 waves |
| asphere-a20-ref | 3 | Pass: opticalPathToImage.maxAbs 1.45e-10 waves | Pass: opticalPathToImage.maxAbs 2.47e-9 waves | Pass: opticalPathToImage.maxAbs 2.47e-9 waves |
| asphere-a20-photopic | 27 | Pass: opticalPathToImage.maxAbs 1.31e-9 waves | Pass: opticalPathToImage.maxAbs 3.04e-9 waves | Pass: opticalPathToImage.maxAbs 3.04e-9 waves |
| flat-base-asphere-ref | 3 | Pass: opd.maxAbs 4.11e-10 waves | Pass: opticalPath.maxAbs 1.31e-9 waves | Pass: opticalPath.maxAbs 1.33e-9 waves |
| flat-base-asphere-photopic | 27 | Pass: opticalPath.maxAbs 1.17e-9 waves | Pass: opd.maxAbs 1.62e-9 waves | Pass: opticalPath.maxAbs 1.59e-9 waves |
| rear-plate-rim-ref | 3 | Pass: opticalPath.maxAbs 9.67e-10 waves | Pass: opd.maxAbs 1.89e-9 waves | Pass: opd.maxAbs 1.79e-9 waves |
| rear-plate-rim-photopic | 27 | Pass: opticalPath.maxAbs 1.20e-9 waves | Pass: opd.maxAbs 2.34e-9 waves | Pass: opd.maxAbs 2.35e-9 waves |
| fixed-iris-zoom-ref-wide | 3 | Pass: opticalPathToImage.maxAbs 1.21e-10 waves | Pass: opticalPath.maxAbs 2.39e-9 waves | Pass: opticalPath.maxAbs 2.44e-9 waves |
| fixed-iris-zoom-ref-tele | 3 | Pass: opd.maxAbs 1.21e-10 waves | Pass: opticalPath.maxAbs 1.55e-9 waves | Pass: opticalPath.maxAbs 1.52e-9 waves |
| fixed-iris-zoom-photopic-wide | 27 | Pass: opticalPath.maxAbs 2.95e-9 waves | Pass: opticalPath.maxAbs 3.16e-9 waves | Pass: opticalPath.maxAbs 3.19e-9 waves |
| fixed-iris-zoom-photopic-tele | 27 | Pass: opticalPath.maxAbs 1.11e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves | Pass: opticalPath.maxAbs 1.98e-9 waves |
| zero-asphere-ref | 3 | Pass: opticalPathToImage.maxAbs 4.84e-10 waves | Pass: opd.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 4.84e-10 waves |
| zero-asphere-photopic | 27 | Pass: opd.maxAbs 6.43e-10 waves | Pass: opd.maxAbs 4.82e-10 waves | Pass: opd.maxAbs 6.43e-10 waves |
| stop-inside-element-ref | 3 | Pass: opd.maxAbs 4.60e-10 waves | Pass: opd.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 4.35e-10 waves |
| stop-inside-element-photopic | 27 | Pass: opticalPathToImage.maxAbs 6.91e-10 waves | Pass: opd.maxAbs 2.35e-10 waves | Pass: opd.maxAbs 6.76e-10 waves |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.70e-12 | stop-inside-element-ref | cut tangential, field 5.53e1 deg, frequencyPerMm 56 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 237404 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | odd-asphere-photopic | — |
| lv – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 6.91e-12 | flat-base-asphere-ref | cut sagittal, field 0 deg, frequencyPerMm 100 |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 237404 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | odd-asphere-photopic | — |
| optiland – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 7.22e-12 | flat-base-asphere-ref | cut tangential, field 0 deg, frequencyPerMm 100 |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 237404 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| odd-asphere-ref | 3 | Pass: mtf.maxAbs 4.03e-13 | Pass: mtf.maxAbs 1.38e-12 | Pass: mtf.maxAbs 1.75e-12 |
| odd-asphere-photopic | 3 | Pass: mtf.maxAbs 7.41e-13 | Pass: mtf.maxAbs 6.95e-13 | Pass: mtf.maxAbs 6.29e-13 |
| e-line-ref | 3 | Pass: mtf.maxAbs 7.08e-13 | Pass: mtf.maxAbs 4.90e-13 | Pass: mtf.maxAbs 7.35e-13 |
| e-line-photopic | 3 | Pass: mtf.maxAbs 3.96e-13 | Pass: mtf.maxAbs 3.77e-13 | Pass: mtf.maxAbs 4.02e-13 |
| asphere-a20-ref | 3 | Pass: mtf.maxAbs 8.84e-13 | Pass: mtf.maxAbs 6.43e-12 | Pass: mtf.maxAbs 7.19e-12 |
| asphere-a20-photopic | 3 | Pass: mtf.maxAbs 5.19e-13 | Pass: mtf.maxAbs 5.12e-12 | Pass: mtf.maxAbs 5.01e-12 |
| flat-base-asphere-ref | 3 | Pass: mtf.maxAbs 1.12e-12 | Pass: mtf.maxAbs 6.91e-12 | Pass: mtf.maxAbs 7.22e-12 |
| flat-base-asphere-photopic | 3 | Pass: mtf.maxAbs 5.39e-13 | Pass: mtf.maxAbs 6.79e-12 | Pass: mtf.maxAbs 6.77e-12 |
| rear-plate-rim-ref | 3 | Pass: mtf.maxAbs 1.35e-12 | Pass: mtf.maxAbs 4.25e-12 | Pass: mtf.maxAbs 5.55e-12 |
| rear-plate-rim-photopic | 3 | Pass: mtf.maxAbs 1.02e-12 | Pass: mtf.maxAbs 1.93e-12 | Pass: mtf.maxAbs 2.18e-12 |
| fixed-iris-zoom-ref-wide | 3 | Pass: mtf.maxAbs 3.17e-13 | Pass: mtf.maxAbs 4.18e-12 | Pass: mtf.maxAbs 3.92e-12 |
| fixed-iris-zoom-ref-tele | 3 | Pass: mtf.maxAbs 4.73e-13 | Pass: mtf.maxAbs 9.72e-13 | Pass: mtf.maxAbs 1.20e-12 |
| fixed-iris-zoom-photopic-wide | 3 | Pass: mtf.maxAbs 2.01e-13 | Pass: mtf.maxAbs 2.51e-12 | Pass: mtf.maxAbs 2.40e-12 |
| fixed-iris-zoom-photopic-tele | 3 | Pass: mtf.maxAbs 3.53e-13 | Pass: mtf.maxAbs 9.34e-13 | Pass: mtf.maxAbs 1.04e-12 |
| zero-asphere-ref | 3 | Pass: mtf.maxAbs 9.61e-13 | Pass: mtf.maxAbs 3.46e-13 | Pass: mtf.maxAbs 1.14e-12 |
| zero-asphere-photopic | 3 | Pass: mtf.maxAbs 3.19e-13 | Pass: mtf.maxAbs 1.53e-13 | Pass: mtf.maxAbs 2.84e-13 |
| stop-inside-element-ref | 3 | Pass: mtf.maxAbs 1.70e-12 | Pass: mtf.maxAbs 6.00e-13 | Pass: mtf.maxAbs 1.11e-12 |
| stop-inside-element-photopic | 3 | Pass: mtf.maxAbs 4.19e-13 | Pass: mtf.maxAbs 2.04e-13 | Pass: mtf.maxAbs 4.61e-13 |

## Spot and fan rays — `spot-rays`

Compares: Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 3.63e-13 | rear-plate-rim-ref | field 8.24e0 deg, line 0, ray 93 |
| lv – optiland | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 7.41e-14 | rear-plate-rim-photopic | field 2.47e1 deg, line 4 |
| lv – optiland | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 2.61e-14 | rear-plate-rim-photopic | field 0 deg, line 6 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 162808 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.03e-13 | rear-plate-rim-ref | field 8.24e0 deg, line 0, ray 275 |
| lv – reference-tracer | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 3.63e-13 | asphere-a20-photopic | field 3.05e1 deg, line 5 |
| lv – reference-tracer | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 5.14e-14 | asphere-a20-ref | field 2.44e1 deg, line 0 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 162808 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 6.80e-13 | rear-plate-rim-photopic | field 8.24e0 deg, line 1, ray 275 |
| optiland – reference-tracer | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 3.68e-13 | asphere-a20-photopic | field 3.05e1 deg, line 3 |
| optiland – reference-tracer | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 5.65e-14 | asphere-a20-ref | field 2.44e1 deg, line 0 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 162808 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 10 | Pass: transverseError.maxAbs 1.40e-13 mm | Pass: transverseError.maxAbs 2.08e-13 mm | Pass: transverseError.maxAbs 2.22e-13 mm | 1657 / 287 / 0 | 1657 / 287 / 0 | 1657 / 287 / 0 |
| odd-asphere-photopic | 90 | Pass: transverseError.maxAbs 1.50e-13 mm | Pass: transverseError.maxAbs 2.38e-13 mm | Pass: transverseError.maxAbs 2.36e-13 mm | 14909 / 2587 / 0 | 14909 / 2587 / 0 | 14909 / 2587 / 0 |
| e-line-ref | 10 | Pass: transverseError.maxAbs 9.59e-14 mm | Pass: transverseError.maxAbs 4.80e-14 mm | Pass: transverseError.maxAbs 6.22e-14 mm | 1751 / 193 / 0 | 1751 / 193 / 0 | 1751 / 193 / 0 |
| e-line-photopic | 90 | Pass: transverseError.maxAbs 9.06e-14 mm | Pass: transverseError.maxAbs 6.22e-14 mm | Pass: transverseError.maxAbs 7.64e-14 mm | 15754 / 1742 / 0 | 15754 / 1742 / 0 | 15754 / 1742 / 0 |
| asphere-a20-ref | 10 | Pass: transverseError.maxAbs 6.04e-14 mm | Pass: transverseError.maxAbs 4.41e-13 mm | Pass: transverseError.maxAbs 4.41e-13 mm | 1932 / 12 / 0 | 1932 / 12 / 0 | 1932 / 12 / 0 |
| asphere-a20-photopic | 90 | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 4.62e-13 mm | Pass: transverseError.maxAbs 4.71e-13 mm | 17381 / 115 / 0 | 17381 / 115 / 0 | 17381 / 115 / 0 |
| flat-base-asphere-ref | 10 | Pass: transverseError.maxAbs 8.53e-14 mm | Pass: transverseError.maxAbs 2.01e-13 mm | Pass: transverseError.maxAbs 1.67e-13 mm | 1609 / 335 / 0 | 1609 / 335 / 0 | 1609 / 335 / 0 |
| flat-base-asphere-photopic | 90 | Pass: transverseError.maxAbs 1.63e-13 mm | Pass: transverseError.maxAbs 2.11e-13 mm | Pass: transverseError.maxAbs 2.29e-13 mm | 14489 / 3007 / 0 | 14489 / 3007 / 0 | 14489 / 3007 / 0 |
| rear-plate-rim-ref | 10 | Pass: transverseError.maxAbs 3.63e-13 mm | Pass: transverseError.maxAbs 6.03e-13 mm | Pass: transverseError.maxAbs 5.72e-13 mm | 1679 / 265 / 0 | 1679 / 265 / 0 | 1679 / 265 / 0 |
| rear-plate-rim-photopic | 90 | Pass: transverseError.maxAbs 3.20e-13 mm | Pass: transverseError.maxAbs 6.02e-13 mm | Pass: transverseError.maxAbs 6.80e-13 mm | 15098 / 2398 / 0 | 15098 / 2398 / 0 | 15098 / 2398 / 0 |
| fixed-iris-zoom-ref-wide | 10 | Pass: transverseError.maxAbs 4.55e-14 mm | Pass: transverseError.maxAbs 3.48e-13 mm | Pass: transverseError.maxAbs 3.65e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fixed-iris-zoom-ref-tele | 10 | Pass: transverseError.maxAbs 4.55e-14 mm | Pass: transverseError.maxAbs 2.57e-13 mm | Pass: transverseError.maxAbs 2.59e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 90 | Pass: transverseError.maxAbs 1.93e-13 mm | Pass: transverseError.maxAbs 3.55e-13 mm | Pass: transverseError.maxAbs 3.57e-13 mm | 17485 / 11 / 0 | 17485 / 11 / 0 | 17485 / 11 / 0 |
| fixed-iris-zoom-photopic-tele | 90 | Pass: transverseError.maxAbs 4.62e-14 mm | Pass: transverseError.maxAbs 2.70e-13 mm | Pass: transverseError.maxAbs 2.68e-13 mm | 17479 / 17 / 0 | 17479 / 17 / 0 | 17479 / 17 / 0 |
| zero-asphere-ref | 10 | Pass: transverseError.maxAbs 5.24e-14 mm | Pass: transverseError.maxAbs 2.75e-14 mm | Pass: transverseError.maxAbs 4.62e-14 mm | 1925 / 19 / 0 | 1925 / 19 / 0 | 1925 / 19 / 0 |
| zero-asphere-photopic | 90 | Pass: transverseError.maxAbs 7.37e-14 mm | Pass: transverseError.maxAbs 3.55e-14 mm | Pass: transverseError.maxAbs 6.71e-14 mm | 17248 / 248 / 0 | 17248 / 248 / 0 | 17248 / 248 / 0 |
| stop-inside-element-ref | 10 | Pass: transverseError.maxAbs 5.86e-14 mm | Pass: transverseError.maxAbs 3.73e-14 mm | Pass: transverseError.maxAbs 7.11e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| stop-inside-element-photopic | 90 | Pass: transverseError.maxAbs 7.28e-14 mm | Pass: transverseError.maxAbs 4.97e-14 mm | Pass: transverseError.maxAbs 7.64e-14 mm | 17480 / 16 / 0 | 17480 / 16 / 0 | 17480 / 16 / 0 |

## Spherical aberration and axial colour rays — `axial-rays`

Compares: Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 1.59e-13 | flat-base-asphere-photopic | field 0 deg, line 0, ray 20 |
| lv – optiland | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 1.16e-12 | flat-base-asphere-photopic | field 0 deg, line 0, ray 20 |
| lv – optiland | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 3.42e-14 | rear-plate-rim-ref | field 0 deg, line 0 |
| lv – optiland | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.42e-13 | rear-plate-rim-ref | field 0 deg, line 0 |
| lv – optiland | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 2.12e-14 | rear-plate-rim-photopic | field 0 deg, line 8 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 5130 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 1.82e-13 | rear-plate-rim-photopic | field 0 deg, line 3, ray 24 |
| lv – reference-tracer | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.93e-12 | fixed-iris-zoom-ref-tele | field 0 deg, line 0, ray 12 |
| lv – reference-tracer | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 4.69e-14 | rear-plate-rim-photopic | field 0 deg, line 0 |
| lv – reference-tracer | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 2.13e-13 | rear-plate-rim-photopic | field 0 deg, line 0 |
| lv – reference-tracer | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 4.47e-14 | flat-base-asphere-photopic | field 0 deg, line 6 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 5130 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.07e-13 | rear-plate-rim-photopic | field 0 deg, line 5, ray 24 |
| optiland – reference-tracer | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.91e-12 | fixed-iris-zoom-photopic-tele | field 0 deg, line 5, ray 12 |
| optiland – reference-tracer | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 5.47e-14 | rear-plate-rim-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 2.42e-13 | rear-plate-rim-photopic | field 0 deg, line 4 |
| optiland – reference-tracer | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 4.97e-14 | flat-base-asphere-photopic | field 0 deg, line 0 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 5130 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 3 | Pass: intercept.maxScaled 4.81e-14 mm | Pass: intercept.maxScaled 1.10e-13 mm | Pass: intercept.maxScaled 1.17e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| odd-asphere-photopic | 18 | Pass: intercept.maxScaled 5.96e-14 mm | Pass: intercept.maxScaled 1.07e-13 mm | Pass: intercept.maxScaled 1.12e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| e-line-ref | 3 | Pass: intercept.maxScaled 2.58e-14 mm | Pass: intercept.maxScaled 1.48e-14 mm | Pass: intercept.maxScaled 2.90e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| e-line-photopic | 18 | Pass: intercept.maxScaled 3.87e-14 mm | Pass: intercept.maxScaled 3.47e-14 mm | Pass: intercept.maxScaled 3.91e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| asphere-a20-ref | 3 | Pass: intercept.maxScaled 1.72e-14 mm | Pass: intercept.maxScaled 9.18e-14 mm | Pass: intercept.maxScaled 9.35e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| asphere-a20-photopic | 18 | Pass: intercept.maxScaled 2.37e-14 mm | Pass: intercept.maxScaled 1.01e-13 mm | Pass: intercept.maxScaled 1.00e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| flat-base-asphere-ref | 3 | Pass: intercept.maxScaled 3.86e-14 mm | Pass: intercept.maxScaled 1.39e-13 mm | Pass: intercept.maxScaled 1.27e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| flat-base-asphere-photopic | 18 | Pass: intercept.maxScaled 1.59e-13 mm | Pass: intercept.maxScaled 1.50e-13 mm | Pass: intercept.maxScaled 1.63e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| rear-plate-rim-ref | 3 | Pass: intercept.maxScaled 7.77e-14 mm | Pass: intercept.maxScaled 1.59e-13 mm | Pass: intercept.maxScaled 1.64e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| rear-plate-rim-photopic | 18 | Pass: intercept.maxScaled 8.52e-14 mm | Pass: intercept.maxScaled 1.82e-13 mm | Pass: intercept.maxScaled 2.07e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fixed-iris-zoom-ref-wide | 3 | Pass: intercept.maxScaled 9.17e-15 mm | Pass: intercept.maxScaled 7.68e-14 mm | Pass: intercept.maxScaled 7.74e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fixed-iris-zoom-ref-tele | 3 | Pass: intercept.maxScaled 2.07e-14 mm | Pass: intercept.maxScaled 1.62e-13 mm | Pass: intercept.maxScaled 1.58e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 18 | Pass: intercept.maxScaled 7.68e-14 mm | Pass: intercept.maxScaled 8.10e-14 mm | Pass: intercept.maxScaled 8.04e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| fixed-iris-zoom-photopic-tele | 18 | Pass: intercept.maxScaled 2.66e-14 mm | Pass: intercept.maxScaled 1.60e-13 mm | Pass: intercept.maxScaled 1.61e-13 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| zero-asphere-ref | 3 | Pass: intercept.maxScaled 2.84e-14 mm | Pass: intercept.maxScaled 1.39e-14 mm | Pass: intercept.maxScaled 2.13e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| zero-asphere-photopic | 18 | Pass: intercept.maxScaled 3.66e-14 mm | Pass: intercept.maxScaled 1.86e-14 mm | Pass: intercept.maxScaled 3.61e-14 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |
| stop-inside-element-ref | 3 | Pass: intercept.maxScaled 3.10e-15 mm | Pass: intercept.maxScaled 1.86e-15 mm | Pass: intercept.maxScaled 2.93e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| stop-inside-element-photopic | 18 | Pass: intercept.maxScaled 4.25e-15 mm | Pass: intercept.maxScaled 3.46e-15 mm | Pass: intercept.maxScaled 3.52e-15 mm | 504 / 0 / 0 | 504 / 0 / 0 | 504 / 0 / 0 |

## Chief rays (distortion, pupils, lateral colour) — `chief-rays`

Compares: Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.28e-13 | stop-inside-element-ref | line 0, ray 18 |
| lv – optiland | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 1.31e-13 | rear-plate-rim-photopic | line 1, ray 1 |
| lv – optiland | Largest difference of distortion — `distortion.maxAbs` | percent | — | 9.38e-13 | zero-asphere-photopic | line 5, ray 1 |
| lv – optiland | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 1.83e-13 | fixed-iris-zoom-photopic-tele | line 1, ray 6 |
| lv – optiland | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 7.52e-12 | fixed-iris-zoom-photopic-tele | line 1, ray 6 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 13328 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 1.31e-13 | rear-plate-rim-photopic | line 4, ray 11 |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 4.12e-13 | asphere-a20-photopic | line 8, ray 12 |
| lv – reference-tracer | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.65e-13 | fixed-iris-zoom-photopic-tele | line 5, ray 20 |
| lv – reference-tracer | Largest difference of distortion — `distortion.maxAbs` | percent | — | 4.99e-12 | fixed-iris-zoom-photopic-tele | line 5, ray 20 |
| lv – reference-tracer | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 5.67e-13 | fixed-iris-zoom-photopic-tele | line 3, ray 12 |
| lv – reference-tracer | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 7.17e-12 | fixed-iris-zoom-photopic-tele | line 5, ray 6 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 13328 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 1.31e-13 | flat-base-asphere-photopic | line 1, ray 16 |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.93e-13 | asphere-a20-photopic | line 8, ray 12 |
| optiland – reference-tracer | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.71e-13 | fixed-iris-zoom-photopic-tele | line 7, ray 20 |
| optiland – reference-tracer | Largest difference of distortion — `distortion.maxAbs` | percent | — | 5.08e-12 | fixed-iris-zoom-photopic-tele | line 7, ray 20 |
| optiland – reference-tracer | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 5.84e-13 | fixed-iris-zoom-photopic-tele | line 0, ray 12 |
| optiland – reference-tracer | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 6.98e-12 | fixed-iris-zoom-photopic-tele | line 5, ray 6 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 13328 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Largest difference of lateral colour — `lateralColour.maxAbs` | mm | ≤ 1.00e-8 | 1.56e-13 | rear-plate-rim-photopic | line 8, ray 11 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 4 | Pass: landing.maxAbs 3.55e-14 mm | Pass: landing.maxAbs 1.48e-13 mm | Pass: landing.maxAbs 1.43e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| odd-asphere-photopic | 4 | Pass: lateralColour.maxAbs 7.99e-14 mm | Pass: landing.maxAbs 1.55e-13 mm | Pass: landing.maxAbs 1.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| e-line-ref | 4 | Pass: distortion.maxScaled 4.16e-14 mm | Pass: landing.maxAbs 3.20e-14 mm | Pass: landing.maxAbs 5.68e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| e-line-photopic | 4 | Pass: lateralColour.maxAbs 8.53e-14 mm | Pass: lateralColour.maxAbs 5.33e-14 mm | Pass: distortion.maxScaled 8.85e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| asphere-a20-ref | 4 | Pass: landing.maxAbs 4.62e-14 mm | Pass: landing.maxAbs 3.68e-13 mm | Pass: landing.maxAbs 3.77e-13 mm | 147 / 2 / 0 | 147 / 2 / 0 | 147 / 2 / 0 |
| asphere-a20-photopic | 4 | Pass: lateralColour.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 4.12e-13 mm | Pass: landing.maxAbs 3.93e-13 mm | 148 / 1 / 0 | 148 / 1 / 0 | 148 / 1 / 0 |
| flat-base-asphere-ref | 4 | Pass: exitPupil.maxScaled 1.12e-13 mm | Pass: exitPupil.maxScaled 1.88e-13 mm | Pass: exitPupil.maxScaled 1.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| flat-base-asphere-photopic | 4 | Pass: exitPupil.maxScaled 1.47e-13 mm | Pass: exitPupil.maxScaled 2.04e-13 mm | Pass: exitPupil.maxScaled 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| rear-plate-rim-ref | 4 | Pass: landing.maxAbs 7.46e-14 mm | Pass: exitPupil.maxScaled 1.71e-13 mm | Pass: distortion.maxScaled 1.83e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| rear-plate-rim-photopic | 4 | Pass: exitPupil.maxScaled 1.64e-13 mm | Pass: distortion.maxScaled 1.85e-13 mm | Pass: distortion.maxScaled 2.60e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fixed-iris-zoom-ref-wide | 4 | Pass: exitPupil.maxScaled 2.08e-14 mm | Pass: exitPupil.maxScaled 2.09e-13 mm | Pass: exitPupil.maxScaled 2.05e-13 mm | 148 / 1 / 0 | 148 / 1 / 0 | 148 / 1 / 0 |
| fixed-iris-zoom-ref-tele | 4 | Pass: exitPupil.maxScaled 3.56e-14 mm | Pass: exitPupil.maxScaled 5.32e-13 mm | Pass: exitPupil.maxScaled 5.37e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 4 | Pass: distortion.maxScaled 2.84e-14 mm | Pass: exitPupil.maxScaled 2.20e-13 mm | Pass: exitPupil.maxScaled 2.22e-13 mm | 136 / 13 / 0 | 136 / 13 / 0 | 136 / 13 / 0 |
| fixed-iris-zoom-photopic-tele | 4 | Pass: exitPupil.maxScaled 1.83e-13 mm | Pass: exitPupil.maxScaled 5.67e-13 mm | Pass: exitPupil.maxScaled 5.84e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| zero-asphere-ref | 4 | Pass: exitPupil.maxScaled 6.87e-14 mm | Pass: exitPupil.maxScaled 6.28e-14 mm | Pass: exitPupil.maxScaled 6.69e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| zero-asphere-photopic | 4 | Pass: exitPupil.maxScaled 7.97e-14 mm | Pass: exitPupil.maxScaled 9.65e-14 mm | Pass: exitPupil.maxScaled 8.63e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| stop-inside-element-ref | 4 | Pass: landing.maxAbs 1.28e-13 mm | Pass: distortion.maxScaled 4.69e-14 mm | Pass: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| stop-inside-element-photopic | 4 | Pass: distortion.maxScaled 1.12e-13 mm | Pass: lateralColour.maxAbs 5.33e-14 mm | Pass: lateralColour.maxAbs 1.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## Field-curve rays — `field-curve-rays`

Compares: Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 5.95e-13 | rear-plate-rim-ref | line 0, ray 772 |
| lv – optiland | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 8.27e-14 | stop-inside-element-photopic | line 1, ray 84 |
| lv – optiland | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 2.63e-10 | odd-asphere-photopic | line 7, ray 24 |
| lv – optiland | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 4.24e-14 | rear-plate-rim-ref | line 0, ray 823 |
| lv – optiland | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 5.86e-13 | odd-asphere-photopic | line 0, ray 64 |
| lv – optiland | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 2.63e-10 | odd-asphere-photopic | line 7, ray 24 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 151961 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 3050 | — | — |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 7.00e-13 | fixed-iris-zoom-photopic-tele | line 2, ray 1552 |
| lv – reference-tracer | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.18e-13 | asphere-a20-photopic | line 5, ray 1750 |
| lv – reference-tracer | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 2.00e-10 | rear-plate-rim-photopic | line 6, ray 54 |
| lv – reference-tracer | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.22e-13 | asphere-a20-photopic | line 0, ray 1338 |
| lv – reference-tracer | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 3.79e-12 | fixed-iris-zoom-photopic-tele | line 7, ray 79 |
| lv – reference-tracer | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 2.00e-10 | rear-plate-rim-photopic | line 6, ray 54 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 151961 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Fields compared — `fields.compared` | elements | — | 3050 | — | — |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 6.87e-13 | fixed-iris-zoom-photopic-tele | line 6, ray 1552 |
| optiland – reference-tracer | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 9.01e-14 | asphere-a20-photopic | line 6, ray 1750 |
| optiland – reference-tracer | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 2.56e-10 | flat-base-asphere-photopic | line 3, ray 84 |
| optiland – reference-tracer | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.21e-13 | asphere-a20-photopic | line 1, ray 1338 |
| optiland – reference-tracer | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 3.84e-12 | fixed-iris-zoom-photopic-tele | line 5, ray 79 |
| optiland – reference-tracer | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 2.56e-10 | flat-base-asphere-photopic | line 3, ray 84 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 151961 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Fields compared — `fields.compared` | elements | — | 3050 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 2 | Pass: landing.maxAbs 9.24e-14 mm | Pass: landing.maxAbs 3.02e-13 mm | Pass: landing.maxAbs 3.23e-13 mm | 1585 / 251 / 0 | 1585 / 251 / 0 | 1585 / 251 / 0 |
| odd-asphere-photopic | 18 | Pass: landing.maxAbs 2.09e-13 mm | Pass: landing.maxAbs 3.78e-13 mm | Pass: landing.maxAbs 3.69e-13 mm | 14215 / 2309 / 0 | 14215 / 2309 / 0 | 14215 / 2309 / 0 |
| e-line-ref | 2 | Pass: landing.maxAbs 6.57e-14 mm | Pass: landing.maxAbs 4.62e-14 mm | Pass: landing.maxAbs 6.04e-14 mm | 1663 / 173 / 0 | 1663 / 173 / 0 | 1663 / 173 / 0 |
| e-line-photopic | 18 | Pass: landing.maxAbs 7.11e-14 mm | Pass: landing.maxAbs 5.68e-14 mm | Pass: landing.maxAbs 7.46e-14 mm | 14781 / 1743 / 0 | 14781 / 1743 / 0 | 14781 / 1743 / 0 |
| asphere-a20-ref | 2 | Pass: landing.maxAbs 8.17e-14 mm | Pass: landing.maxAbs 5.76e-13 mm | Pass: landing.maxAbs 5.58e-13 mm | 1719 / 117 / 0 | 1719 / 117 / 0 | 1719 / 117 / 0 |
| asphere-a20-photopic | 18 | Pass: landing.maxAbs 2.79e-13 mm | Pass: landing.maxAbs 5.83e-13 mm | Pass: landing.maxAbs 6.04e-13 mm | 15226 / 1298 / 0 | 15226 / 1298 / 0 | 15226 / 1298 / 0 |
| flat-base-asphere-ref | 2 | Pass: landing.maxAbs 2.06e-13 mm | Pass: landing.maxAbs 2.17e-13 mm | Pass: landing.maxAbs 2.20e-13 mm | 1598 / 238 / 0 | 1598 / 238 / 0 | 1598 / 238 / 0 |
| flat-base-asphere-photopic | 18 | Pass: landing.maxAbs 1.88e-13 mm | Pass: landing.maxAbs 2.31e-13 mm | Pass: landing.maxAbs 2.66e-13 mm | 14320 / 2204 / 0 | 14320 / 2204 / 0 | 14320 / 2204 / 0 |
| rear-plate-rim-ref | 2 | Pass: landing.maxAbs 5.95e-13 mm | Pass: landing.maxAbs 5.39e-13 mm | Pass: landing.maxAbs 5.81e-13 mm | 1625 / 211 / 0 | 1625 / 211 / 0 | 1625 / 211 / 0 |
| rear-plate-rim-photopic | 18 | Pass: landing.maxAbs 3.45e-13 mm | Pass: landing.maxAbs 5.74e-13 mm | Pass: landing.maxAbs 5.96e-13 mm | 14464 / 2060 / 0 | 14464 / 2060 / 0 | 14464 / 2060 / 0 |
| fixed-iris-zoom-ref-wide | 2 | Pass: landing.maxAbs 3.46e-14 mm | Pass: landing.maxAbs 2.76e-13 mm | Pass: landing.maxAbs 2.78e-13 mm | 1725 / 111 / 0 | 1725 / 111 / 0 | 1725 / 111 / 0 |
| fixed-iris-zoom-ref-tele | 2 | Pass: landing.maxAbs 4.82e-14 mm | Pass: landing.maxAbs 6.76e-13 mm | Pass: landing.maxAbs 6.71e-13 mm | 1819 / 17 / 0 | 1819 / 17 / 0 | 1819 / 17 / 0 |
| fixed-iris-zoom-photopic-wide | 18 | Pass: landing.maxAbs 7.70e-14 mm | Pass: landing.maxAbs 3.43e-13 mm | Pass: landing.maxAbs 3.36e-13 mm | 15318 / 1206 / 0 | 15318 / 1206 / 0 | 15318 / 1206 / 0 |
| fixed-iris-zoom-photopic-tele | 18 | Pass: landing.maxAbs 5.60e-14 mm | Pass: landing.maxAbs 7.00e-13 mm | Pass: landing.maxAbs 6.87e-13 mm | 16089 / 435 / 0 | 16089 / 435 / 0 | 16089 / 435 / 0 |
| zero-asphere-ref | 2 | Pass: landing.maxAbs 7.37e-14 mm | Pass: landing.maxAbs 3.33e-14 mm | Pass: landing.maxAbs 6.31e-14 mm | 1807 / 29 / 0 | 1807 / 29 / 0 | 1807 / 29 / 0 |
| zero-asphere-photopic | 18 | Pass: landing.maxAbs 9.06e-14 mm | Pass: landing.maxAbs 3.38e-14 mm | Pass: landing.maxAbs 8.88e-14 mm | 15919 / 605 / 0 | 15919 / 605 / 0 | 15919 / 605 / 0 |
| stop-inside-element-ref | 2 | Pass: landing.maxAbs 2.38e-13 mm | Pass: landing.maxAbs 7.46e-14 mm | Pass: landing.maxAbs 1.88e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| stop-inside-element-photopic | 18 | Pass: landing.maxAbs 2.52e-13 mm | Pass: landing.maxAbs 7.82e-14 mm | Pass: landing.maxAbs 2.56e-13 mm | 16252 / 272 / 0 | 16252 / 272 / 0 | 16252 / 272 / 0 |

## Vignetting rays — `vignetting-rays`

Compares: Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.75e-14 | asphere-a20-photopic | field 3.77e1 deg, line 0 |
| lv – optiland | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | odd-asphere-ref | field 0 deg, line 0 |
| lv – optiland | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | odd-asphere-ref | field 0 deg, line 0 |
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.14e-13 | rear-plate-rim-photopic | field 3.00e1 deg, line 0, ray 2048 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 2157834 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 1150 | — | — |
| lv – reference-tracer | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 3.09e-14 | fixed-iris-zoom-ref-wide | field 2.24e1 deg, line 0 |
| lv – reference-tracer | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | odd-asphere-ref | field 0 deg, line 0 |
| lv – reference-tracer | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | odd-asphere-ref | field 0 deg, line 0 |
| lv – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.81e-13 | rear-plate-rim-photopic | field 3.00e1 deg, line 0, ray 2048 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 2157834 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – reference-tracer | Fields compared — `fields.compared` | elements | — | 1150 | — | — |
| optiland – reference-tracer | Largest difference of a field's flux into the image, relative to the axis — `illumination.maxAbs` | (no unit) | ≤ 1.00e-9 | 3.20e-14 | fixed-iris-zoom-photopic-wide | field 2.24e1 deg, line 8 |
| optiland – reference-tracer | Share of the axis's flux carried by rays one engine passes and the other stops — `transmission.maxAbs` | (no unit) | ≤ 0 | 0 | odd-asphere-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Share of the axis's flux carried by rays at a rim, or that failed, that one engine passes and the other does not (shown, not judged) — `transmission.rimBandOrFailed` | (no unit) | — | 0 | odd-asphere-ref | field 0 deg, line 0 |
| optiland – reference-tracer | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 1.88e-13 | rear-plate-rim-photopic | field 3.00e1 deg, line 2, ray 2048 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 2157834 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – reference-tracer | Fields compared — `fields.compared` | elements | — | 1150 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 1 | Pass: landing.maxAbs 3.20e-14 mm | Pass: landing.maxAbs 2.66e-14 mm | Pass: landing.maxAbs 3.55e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| odd-asphere-photopic | 9 | Pass: landing.maxAbs 4.62e-14 mm | Pass: landing.maxAbs 3.38e-14 mm | Pass: landing.maxAbs 5.51e-14 mm | 18291 / 150 / 0 | 18291 / 150 / 0 | 18291 / 150 / 0 |
| e-line-ref | 1 | Pass: landing.maxAbs 3.02e-14 mm | Pass: landing.maxAbs 2.84e-14 mm | Pass: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| e-line-photopic | 9 | Pass: landing.maxAbs 4.62e-14 mm | Pass: landing.maxAbs 2.84e-14 mm | Pass: landing.maxAbs 4.26e-14 mm | 18393 / 48 / 0 | 18393 / 48 / 0 | 18393 / 48 / 0 |
| asphere-a20-ref | 1 | Pass: illumination.maxAbs 1.65e-14 | Pass: illumination.maxAbs 2.34e-14 | Pass: illumination.maxAbs 1.32e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| asphere-a20-photopic | 9 | Pass: illumination.maxAbs 1.75e-14 | Pass: illumination.maxAbs 2.31e-14 | Pass: illumination.maxAbs 1.52e-14 | 18417 / 24 / 0 | 18417 / 24 / 0 | 18417 / 24 / 0 |
| flat-base-asphere-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: illumination.maxAbs 8.55e-15 | Pass: illumination.maxAbs 9.44e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| flat-base-asphere-photopic | 9 | Pass: landing.maxAbs 8.88e-14 mm | Pass: landing.maxAbs 1.21e-13 mm | Pass: landing.maxAbs 1.28e-13 mm | 18361 / 80 / 0 | 18361 / 80 / 0 | 18361 / 80 / 0 |
| rear-plate-rim-ref | 1 | Pass: landing.maxAbs 7.46e-14 mm | Pass: illumination.maxAbs 2.91e-14 | Pass: illumination.maxAbs 2.78e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| rear-plate-rim-photopic | 9 | Pass: landing.maxAbs 1.14e-13 mm | Pass: illumination.maxAbs 3.02e-14 | Pass: illumination.maxAbs 3.08e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| fixed-iris-zoom-ref-wide | 1 | Pass: illumination.maxAbs 3.00e-15 | Pass: illumination.maxAbs 3.09e-14 | Pass: illumination.maxAbs 3.11e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fixed-iris-zoom-ref-tele | 1 | Pass: landing.maxAbs 1.95e-14 mm | Pass: illumination.maxAbs 1.77e-14 | Pass: illumination.maxAbs 1.90e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 9 | Pass: illumination.maxAbs 3.44e-15 | Pass: illumination.maxAbs 2.95e-14 | Pass: illumination.maxAbs 3.20e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| fixed-iris-zoom-photopic-tele | 9 | Pass: illumination.maxAbs 3.55e-15 | Pass: illumination.maxAbs 1.88e-14 | Pass: illumination.maxAbs 1.92e-14 | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |
| zero-asphere-ref | 1 | Pass: landing.maxAbs 3.29e-14 mm | Pass: illumination.maxAbs 1.55e-15 | Pass: landing.maxAbs 4.35e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| zero-asphere-photopic | 9 | Pass: illumination.maxAbs 5.33e-15 | Pass: illumination.maxAbs 2.33e-15 | Pass: illumination.maxAbs 5.44e-15 | 18401 / 40 / 0 | 18401 / 40 / 0 | 18401 / 40 / 0 |
| stop-inside-element-ref | 1 | Pass: landing.maxAbs 6.39e-14 mm | Pass: illumination.maxAbs 2.33e-15 | Pass: landing.maxAbs 4.62e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| stop-inside-element-photopic | 9 | Pass: landing.maxAbs 1.14e-13 mm | Pass: landing.maxAbs 4.26e-14 mm | Pass: landing.maxAbs 8.88e-14 mm | 18441 / 0 / 0 | 18441 / 0 / 0 | 18441 / 0 / 0 |

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
| `-wide, -tele` | a zoom lens at the short or the long end of its zoom range |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | aa823d9aab0a4315712625b81cb17b7a6db47656eaed465c5c3eb37a8c241077 |
| Baseline file | 643aa141cb56fd1810abf83e270a52dc19a5fae5e2674187461a1efa5f05f624 |
| Limits file | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61 | 674d26ffb708596a5462f6199b1cb2c28df679003651e53ebb4bbde0e590be9a | commit f5b456fec7b69184844078f6ec6b1ac132f8ec58 |
| optiland | 2ca0f73256d5e0ead64aa3695522bef399721276bf11d612db34b7bf19c5ee39 | 59039a7b219f2882f1e4cabf8f43bc07a9fdf66ecb95d26f4076feca4406d853 | commit a9e544a2e058f1c1b64606e9ce90e6dc103efee1, distribution version 0.6.2.post234+ga9e544a2, source hash 1d35bfa2f7a6addd60f2c1057cd17e65a710a6a7d4e3a277e8675647d0262131 |
| reference-tracer | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 | — |

| Run | Lens state |
|---|---|
| odd-asphere-ref | d24ce91f200b115d1ef919d9fdb14b4db87b5d67f8e38b63efca3cfd91ddf4af |
| odd-asphere-photopic | 23602f8f211374314f6aca3c06206a73cb862bf60596a9c91af736d5d904985f |
| e-line-ref | 0b0f82fadbb79be999e3bf439eb67044e620fd05941e7346e67e99d0a440171d |
| e-line-photopic | 11ab0d5042ca5dc4b00fd6f8e701516e359d2d61473d3dc9a8616f1ed73a5715 |
| asphere-a20-ref | b10db914a934de3a2a074ccd8d938e8f5a15df09bbbe41e90b3adfaec28de5b1 |
| asphere-a20-photopic | 4a9d1dc6968b423000c481555626b493e8e981f6b697448d2622958b5565fb06 |
| flat-base-asphere-ref | dcde783cdad5fd68c9aca52a808241a3d436c3f568576b791de8acdc0fd5f030 |
| flat-base-asphere-photopic | 02c8b825833f7787a9a89f8a2965581385c4f6f30ce76a7212ccb28d39d7fe07 |
| rear-plate-rim-ref | 31bf486acface061c777c104e2acb25e14f899a7dd2988b63d0838c8e46fba92 |
| rear-plate-rim-photopic | 20d2bce24646becd48944bc49d11181a1a7cf719757789ff15a63bbe19c3e9ff |
| fixed-iris-zoom-ref-wide | 4db46962ff43d333cab4430dc739c4afd7e77824ee7f7b12e37169b0be3111a3 |
| fixed-iris-zoom-ref-tele | 15567bb5f10f9c71fda356870eabbca30ac1c4c693c8e097521b2a4308432b72 |
| fixed-iris-zoom-photopic-wide | 657d721f00e4e7a2bb73dcf9e8ee7fef0d6dc7aea0445b6d30d5f3f1ffdf4514 |
| fixed-iris-zoom-photopic-tele | 816bafa86ff5cb14e956910bc94f377f02c31ebd5990ce11010aee245bc95bb4 |
| zero-asphere-ref | 7ecd42d1bcf433bc492fb0eafaae81190c604a9969bb0b9b867682ba13b421be |
| zero-asphere-photopic | e2a9fae8ddea306f59b9f7c6efdf336b32f235f7fa72ca555d0c992a8757d9a9 |
| stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a |
| stop-inside-element-photopic | 62a320eb14595b20780012fb759cf0ca701dbd2a599cd745025fd9abaaa9774d |
