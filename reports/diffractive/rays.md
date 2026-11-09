# Baseline of diffractive: the ray checks

This file is the committed record of the ray checks of the suite diffractive, as its baseline holds them: for every
run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every
pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and
wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so
`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no
ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the
engines are still those of the baseline. How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | diffractive |
| Limits file | v24 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 184 engine files |
| optiland | optiland | 0.6.2.post117+g4e893f53 | backend numpy, checkout with uncommitted changes, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 534 source files |
| ref | Reference tracer | 1 | 13 source files |

## Runs with a problem

| Run | Problem |
|---|---|
| reference-folded-diffractive-plate | tilted-image-plane: the image plane is not perpendicular to the optical axis |
| reference-folded-diffractive-plate | off-axis-image-plane: the image plane is not centred on the optical axis |
| reference-folded-diffractive-plate | tilted-surface: surface FOLD has a tilted interaction normal |
| reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLD has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLDB has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 8 | 8 | lv – optiland | 8 Pass | 8 Pass |
| Built system — `built-system` | `system.describe` | 8 | 8 | lv – ref | 8 Pass | 8 Pass |
| Built system — `built-system` | `system.describe` | 8 | 8 | optiland – ref | 8 Pass | 8 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 8 | 8 | lv – optiland | 8 Not computed | 8 Not computed |
| First-order data — `first-order` | `paraxial.first-order` | 8 | 8 | lv – ref | 8 Pass | 8 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 8 | 8 | optiland – ref | 8 Not computed | 8 Not computed |
| Ray trace — `ray-trace` | `rays.trace` | 8 | 16 | lv – optiland | 8 Pass | 16 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 8 | 16 | lv – ref | 8 Pass | 16 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 8 | 16 | optiland – ref | 8 Pass | 16 Pass |
| Optical path — `optical-path` | `rays.trace` | 8 | 16 | lv – optiland | 8 Pass | 16 Pass |
| Optical path — `optical-path` | `rays.trace` | 8 | 16 | lv – ref | 8 Pass | 16 Pass |
| Optical path — `optical-path` | `rays.trace` | 8 | 16 | optiland – ref | 8 Pass | 16 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 8 | 80 | lv – optiland | 8 Pass | 80 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 8 | 80 | lv – ref | 8 Pass | 80 Pass |
| Spot and fan rays — `spot-rays` | `rays.trace` | 8 | 80 | optiland – ref | 8 Pass | 80 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 8 | 24 | lv – optiland | 8 Pass | 24 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 8 | 24 | lv – ref | 8 Pass | 24 Pass |
| Spherical aberration and axial colour rays — `axial-rays` | `rays.trace` | 8 | 24 | optiland – ref | 8 Pass | 24 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 8 | 32 | lv – optiland | 8 Pass | 32 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 8 | 32 | lv – ref | 8 Pass | 32 Pass |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | `rays.trace` | 8 | 32 | optiland – ref | 8 Pass | 32 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 8 | 16 | lv – optiland | 8 Pass | 16 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 8 | 16 | lv – ref | 8 Pass | 16 Pass |
| Field-curve rays — `field-curve-rays` | `rays.trace` | 8 | 16 | optiland – ref | 8 Pass | 16 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 8 answered |
| Built system — `built-system` | optiland | 8 answered |
| Built system — `built-system` | ref | 8 answered |
| First-order data — `first-order` | lv | 8 answered |
| First-order data — `first-order` | optiland | 8 not computed (feature optiland-phase-paraxial-unseen) |
| First-order data — `first-order` | ref | 8 answered |
| Ray trace — `ray-trace` | lv | 8 answered |
| Ray trace — `ray-trace` | optiland | 8 answered |
| Ray trace — `ray-trace` | ref | 8 answered |
| Optical path — `optical-path` | lv | 8 answered |
| Optical path — `optical-path` | optiland | 8 answered |
| Optical path — `optical-path` | ref | 8 answered |
| Spot and fan rays — `spot-rays` | lv | 8 answered |
| Spot and fan rays — `spot-rays` | optiland | 8 answered |
| Spot and fan rays — `spot-rays` | ref | 8 answered |
| Spherical aberration and axial colour rays — `axial-rays` | lv | 8 answered |
| Spherical aberration and axial colour rays — `axial-rays` | optiland | 8 answered |
| Spherical aberration and axial colour rays — `axial-rays` | ref | 8 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | lv | 8 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | optiland | 8 answered |
| Chief rays (distortion, pupils, lateral colour) — `chief-rays` | ref | 8 answered |
| Field-curve rays — `field-curve-rays` | lv | 8 answered |
| Field-curve rays — `field-curve-rays` | optiland | 8 answered |
| Field-curve rays — `field-curve-rays` | ref | 8 answered |

## Built system — `built-system`

Compares: Built layout, shape, aperture, index and sampled sag. Kind: held to a limit. Quantity asked of the engines: the system as built (`system.describe`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.14e-16 | canon-ef-70-300mm-f45-56-do-is-usm-wide | sample 6, surface 10 |
| lv – optiland | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 1.78e-15 | canon-ef-400mm-f4-do-is-usm | sample 6, surface 0 |
| lv – ref | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – ref | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.54e-16 | canon-rf600mmf11-is-stm | sample 7, surface 12 |
| lv – ref | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 1.78e-15 | canon-ef-400mm-f4-do-is-usm | sample 7, surface 0 |
| optiland – ref | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – ref | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.54e-16 | canon-rf600mmf11-is-stm | sample 7, surface 12 |
| optiland – ref | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 1.78e-15 | canon-ef-400mm-f4-do-is-usm | sample 6, surface 0 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 1 | Pass: sag.maxScaled 2.23e-16 | Pass: sag.maxScaled 2.26e-16 | Pass: sag.maxScaled 2.23e-16 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.75e-16 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 1 | Pass: sag.maxScaled 3.14e-16 | Pass: sag.maxScaled 2.30e-16 | Pass: sag.maxScaled 2.75e-16 |
| canon-rf-800mm-f11-is-stm | 1 | Pass: sag.maxScaled 2.00e-16 | Pass: sag.maxScaled 1.84e-16 | Pass: sag.maxScaled 3.22e-16 |
| canon-rf600mmf11-is-stm | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 3.54e-16 | Pass: sag.maxScaled 3.54e-16 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 1 | Pass: sag.maxScaled 2.16e-16 | Pass: sag.maxScaled 3.09e-16 | Pass: sag.maxScaled 3.13e-16 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 1 | Pass: sag.maxScaled 2.13e-16 | Pass: sag.maxScaled 2.17e-16 | Pass: sag.maxScaled 2.27e-16 |
| nikon-nikkor-z-800mm-f63-vr-s | 1 | Pass: sag.maxScaled 2.46e-16 | Pass: sag.maxScaled 3.35e-16 | Pass: sag.maxScaled 2.77e-16 |

## First-order data — `first-order`

Compares: First-order quantities and pupils. Kind: held to a limit. Quantity asked of the engines: first-order data (`paraxial.first-order`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – ref | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.27e-11 | canon-rf-800mm-f11-is-stm | line 0, quantity frontFocalZ |
| lv – ref | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 2.39e-12 | canon-rf-800mm-f11-is-stm | line 0, quantity entrancePupilZ |
| lv – ref | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 2.39e-12 | canon-rf-800mm-f11-is-stm | line 0, quantity entrancePupilZ |
| lv – ref | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 9.24e-14 | canon-ef-400mm-f4-do-is-usm | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 9.24e-14 | canon-ef-400mm-f4-do-is-usm | line 0, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 1 | Not computed | Pass: firstOrder.maxAbs 1.93e-12 mm | Not computed |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 1 | Not computed | Pass: firstOrder.maxAbs 6.39e-14 mm | Not computed |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 1 | Not computed | Pass: firstOrder.maxAbs 9.66e-13 mm | Not computed |
| canon-rf-800mm-f11-is-stm | 1 | Not computed | Pass: firstOrder.maxAbs 2.27e-11 mm | Not computed |
| canon-rf600mmf11-is-stm | 1 | Not computed | Pass: firstOrder.maxAbs 3.41e-12 mm | Not computed |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 1 | Not computed | Pass: firstOrder.maxAbs 9.09e-13 mm | Not computed |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 1 | Not computed | Pass: firstOrder.maxAbs 6.82e-13 mm | Not computed |
| nikon-nikkor-z-800mm-f63-vr-s | 1 | Not computed | Pass: firstOrder.maxAbs 3.18e-12 mm | Not computed |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 2.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 51, surface 37 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 6.88e-15 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 55 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 3.79e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 230 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1766 | — | — |
| lv – ref | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 4.83e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1 deg, line 0, ray 118, surface 10 |
| lv – ref | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.43e-15 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | field 2.50e-1 deg, line 0, ray 98 |
| lv – ref | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 2.15e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 82 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 1766 | — | — |
| optiland – ref | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 4.98e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1 deg, line 0, ray 118, surface 10 |
| optiland – ref | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 6.99e-15 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 55 |
| optiland – ref | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 3.93e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 147 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 1766 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | Pass: landing.maxDistance 1.97e-13 mm | Pass: landing.maxDistance 1.93e-13 mm | Pass: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | Pass: landing.maxDistance 4.71e-14 mm | Pass: landing.maxDistance 2.05e-14 mm | Pass: landing.maxDistance 5.14e-14 mm | 25 / 488 / 0 | 25 / 488 / 0 | 25 / 488 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | Pass: landing.maxDistance 2.37e-13 mm | Pass: hits.maxDistance 4.83e-13 mm | Pass: hits.maxDistance 4.98e-13 mm | 255 / 258 / 0 | 255 / 258 / 0 | 255 / 258 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | Pass: landing.maxDistance 2.66e-13 mm | Pass: landing.maxDistance 1.76e-13 mm | Pass: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-rf600mmf11-is-stm | 2 | Pass: landing.maxDistance 2.40e-13 mm | Pass: landing.maxDistance 1.88e-13 mm | Pass: landing.maxDistance 2.01e-13 mm | 241 / 272 / 0 | 241 / 272 / 0 | 241 / 272 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | Pass: landing.maxDistance 2.07e-13 mm | Pass: landing.maxDistance 1.35e-13 mm | Pass: landing.maxDistance 1.99e-13 mm | 255 / 258 / 0 | 255 / 258 / 0 | 255 / 258 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | Pass: landing.maxDistance 2.87e-13 mm | Pass: landing.maxDistance 1.97e-13 mm | Pass: landing.maxDistance 2.80e-13 mm | 223 / 290 / 0 | 223 / 290 / 0 | 223 / 290 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | Pass: landing.maxDistance 3.79e-13 mm | Pass: landing.maxDistance 2.15e-13 mm | Pass: landing.maxDistance 3.93e-13 mm | 293 / 220 / 0 | 293 / 220 / 0 | 293 / 220 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 51 |
| lv – optiland | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 39 |
| lv – optiland | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 7.74e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 39 |
| lv – ref | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 179 |
| lv – ref | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 179 |
| lv – ref | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 4.84e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 23 |
| optiland – ref | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 5.80e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 38 |
| optiland – ref | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 5.80e-10 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1 deg, line 0, ray 118 |
| optiland – ref | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 69 |
| optiland – ref | Largest difference of the phase a diffractive surface adds to a ray — `phasePath.maxAbs` | waves | ≤ 2.00e-5 | 1.54e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1 deg, line 0, ray 230, surface 6 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 9.67e-11 waves | Pass: opticalPath.maxAbs 9.67e-11 waves |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | Pass: opticalPathToImage.maxAbs 3.39e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves | Pass: opticalPathToImage.maxAbs 5.80e-10 waves |
| canon-rf-800mm-f11-is-stm | 2 | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 2.90e-10 waves |
| canon-rf600mmf11-is-stm | 2 | Pass: opd.maxAbs 2.90e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opd.maxAbs 2.90e-10 waves |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | Pass: opticalPath.maxAbs 2.42e-10 waves | Pass: opticalPath.maxAbs 1.93e-10 waves | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | Pass: opticalPath.maxAbs 2.90e-10 waves | Pass: opticalPathToImage.maxAbs 3.87e-10 waves | Pass: opticalPath.maxAbs 4.84e-10 waves |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | Pass: opd.maxAbs 7.74e-10 waves | Pass: opticalPath.maxAbs 6.77e-10 waves | Pass: opd.maxAbs 6.77e-10 waves |

## Spot and fan rays — `spot-rays`

Compares: Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 5.19e-13 | canon-rf-800mm-f11-is-stm | field 7.90e-1 deg, line 0, ray 133 |
| lv – optiland | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.00e-13 | canon-rf-800mm-f11-is-stm | field 7.90e-1 deg, line 0 |
| lv – optiland | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 8.88e-14 | canon-rf600mmf11-is-stm | field 0 deg, line 0 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 13776 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 3.69e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 1.18e0 deg, line 0, ray 15 |
| lv – ref | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 1.18e0 deg, line 0 |
| lv – ref | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 3.63e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 13776 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Largest difference of a ray's landing relative to the chief ray — `transverseError.maxAbs` | mm | ≤ 1.00e-8 | 4.30e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 288 |
| optiland – ref | Largest difference of a spot centroid — `centroid.maxAbs` | mm | ≤ 1.00e-8 | 1.26e-13 | canon-rf-800mm-f11-is-stm | field 9.48e-1 deg, line 0 |
| optiland – ref | Largest difference of a spot's RMS radius — `rmsRadius.maxAbs` | mm | ≤ 1.00e-8 | 9.93e-14 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 13776 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 10 | Pass: transverseError.maxAbs 2.86e-13 mm | Pass: transverseError.maxAbs 3.16e-13 mm | Pass: transverseError.maxAbs 2.92e-13 mm | 1682 / 262 / 0 | 1682 / 262 / 0 | 1682 / 262 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 10 | Pass: transverseError.maxAbs 1.60e-13 mm | Pass: transverseError.maxAbs 2.06e-13 mm | Pass: transverseError.maxAbs 2.31e-13 mm | 1820 / 124 / 0 | 1820 / 124 / 0 | 1820 / 124 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 10 | Pass: transverseError.maxAbs 2.57e-13 mm | Pass: transverseError.maxAbs 1.99e-13 mm | Pass: transverseError.maxAbs 2.42e-13 mm | 1693 / 251 / 0 | 1693 / 251 / 0 | 1693 / 251 / 0 |
| canon-rf-800mm-f11-is-stm | 10 | Pass: transverseError.maxAbs 5.19e-13 mm | Pass: transverseError.maxAbs 3.62e-13 mm | Pass: transverseError.maxAbs 3.38e-13 mm | 1781 / 163 / 0 | 1781 / 163 / 0 | 1781 / 163 / 0 |
| canon-rf600mmf11-is-stm | 10 | Pass: transverseError.maxAbs 4.23e-13 mm | Pass: transverseError.maxAbs 2.70e-13 mm | Pass: transverseError.maxAbs 3.16e-13 mm | 1784 / 160 / 0 | 1784 / 160 / 0 | 1784 / 160 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 10 | Pass: transverseError.maxAbs 2.56e-13 mm | Pass: transverseError.maxAbs 2.42e-13 mm | Pass: transverseError.maxAbs 2.50e-13 mm | 1694 / 250 / 0 | 1694 / 250 / 0 | 1694 / 250 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 10 | Pass: transverseError.maxAbs 3.23e-13 mm | Pass: transverseError.maxAbs 2.81e-13 mm | Pass: transverseError.maxAbs 3.45e-13 mm | 1717 / 227 / 0 | 1717 / 227 / 0 | 1717 / 227 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 10 | Pass: transverseError.maxAbs 5.19e-13 mm | Pass: transverseError.maxAbs 3.69e-13 mm | Pass: transverseError.maxAbs 4.30e-13 mm | 1685 / 259 / 0 | 1685 / 259 / 0 | 1685 / 259 / 0 |

## Spherical aberration and axial colour rays — `axial-rays`

Compares: Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.45e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 36 |
| lv – optiland | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.23e-12 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0, ray 6 |
| lv – optiland | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 6.50e-14 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| lv – optiland | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.65e-12 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| lv – optiland | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 3.38e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 528 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 2.11e-13 | canon-ef-400mm-f4-do-is-usm | field 0 deg, line 0, ray 34 |
| lv – ref | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 5.85e-12 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0, ray 16 |
| lv – ref | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 5.15e-14 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| lv – ref | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 1.31e-12 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| lv – ref | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 9.01e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 528 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Largest difference of an axial crossing, times the larger of the two engines' slopes — `intercept.maxScaled` | mm | ≤ 1.00e-8 | 3.73e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0, ray 36 |
| optiland – ref | Largest difference of an axial crossing, along the axis — `intercept.maxAbs` | mm | — | 6.14e-12 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0, ray 14 |
| optiland – ref | Difference of the best focus, times the rays' RMS slope — `focus.maxScaled` | mm | ≤ 1.00e-8 | 1.16e-13 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| optiland – ref | Difference of the best focus, along the axis — `focus.maxAbs` | mm | — | 2.96e-12 | canon-rf-800mm-f11-is-stm | field 0 deg, line 0 |
| optiland – ref | Difference of the RMS spot size at best focus — `focusRms.maxAbs` | mm | ≤ 1.00e-8 | 5.64e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0 deg, line 0 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 528 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 3 | Pass: intercept.maxScaled 1.17e-13 mm | Pass: intercept.maxScaled 2.11e-13 mm | Pass: intercept.maxScaled 1.75e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 3 | Pass: intercept.maxScaled 1.05e-13 mm | Pass: intercept.maxScaled 5.36e-14 mm | Pass: intercept.maxScaled 9.92e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 3 | Pass: intercept.maxScaled 1.58e-13 mm | Pass: intercept.maxScaled 1.34e-13 mm | Pass: intercept.maxScaled 2.02e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-rf-800mm-f11-is-stm | 3 | Pass: intercept.maxScaled 1.66e-13 mm | Pass: intercept.maxScaled 1.16e-13 mm | Pass: intercept.maxScaled 2.36e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-rf600mmf11-is-stm | 3 | Pass: intercept.maxScaled 1.50e-13 mm | Pass: intercept.maxScaled 1.42e-13 mm | Pass: intercept.maxScaled 2.32e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 3 | Pass: intercept.maxScaled 1.18e-13 mm | Pass: intercept.maxScaled 7.22e-14 mm | Pass: intercept.maxScaled 1.67e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 3 | Pass: intercept.maxScaled 1.44e-13 mm | Pass: intercept.maxScaled 1.38e-13 mm | Pass: intercept.maxScaled 9.56e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 3 | Pass: intercept.maxScaled 2.45e-13 mm | Pass: intercept.maxScaled 2.09e-13 mm | Pass: intercept.maxScaled 3.73e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |

## Chief rays (distortion, pupils, lateral colour) — `chief-rays`

Compares: Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 3.52e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 16 |
| lv – optiland | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 2.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 3 |
| lv – optiland | Largest difference of distortion — `distortion.maxAbs` | percent | — | 1.40e-12 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 9 |
| lv – optiland | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 1.45e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| lv – optiland | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 9.52e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1192 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.34e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 18 |
| lv – ref | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 3.14e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 30 |
| lv – ref | Largest difference of distortion — `distortion.maxAbs` | percent | — | 1.69e-12 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 3 |
| lv – ref | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 5.75e-14 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 16 |
| lv – ref | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 6.82e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 7 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 1192 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 2.42e-13 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | line 0, ray 13 |
| optiland – ref | Largest difference of a ray's distance from its ideal image point — `distortion.maxScaled` | mm | ≤ 1.00e-8 | 2.74e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 19 |
| optiland – ref | Largest difference of distortion — `distortion.maxAbs` | percent | — | 1.49e-12 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 3 |
| optiland – ref | Largest difference of a chief ray's axial crossing, times its exit slope — `exitPupil.maxScaled` | mm | ≤ 1.00e-8 | 9.55e-14 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| optiland – ref | Largest difference of an exit pupil position — `exitPupil.maxAbs` | mm | — | 6.25e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 1192 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 4 | Pass: landing.maxAbs 2.70e-13 mm | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 2.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 4 | Pass: landing.maxAbs 6.04e-14 mm | Pass: distortion.maxScaled 3.14e-13 mm | Pass: distortion.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 4 | Pass: distortion.maxScaled 1.85e-13 mm | Pass: distortion.maxScaled 1.60e-13 mm | Pass: landing.maxAbs 1.31e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-rf-800mm-f11-is-stm | 4 | Pass: distortion.maxScaled 1.59e-13 mm | Pass: distortion.maxScaled 2.14e-13 mm | Pass: distortion.maxScaled 2.53e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-rf600mmf11-is-stm | 4 | Pass: landing.maxAbs 1.63e-13 mm | Pass: landing.maxAbs 9.95e-14 mm | Pass: landing.maxAbs 1.95e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 4 | Pass: landing.maxAbs 1.92e-13 mm | Pass: landing.maxAbs 1.17e-13 mm | Pass: landing.maxAbs 2.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 4 | Pass: landing.maxAbs 2.03e-13 mm | Pass: landing.maxAbs 1.35e-13 mm | Pass: landing.maxAbs 2.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 4 | Pass: landing.maxAbs 3.52e-13 mm | Pass: landing.maxAbs 2.34e-13 mm | Pass: distortion.maxScaled 2.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## Field-curve rays — `field-curve-rays`

Compares: Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 5.04e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 1270 |
| lv – optiland | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.19e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 1235 |
| lv – optiland | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 9.26e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| lv – optiland | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 5.95e-14 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 1544 |
| lv – optiland | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 6.26e-12 | canon-rf-800mm-f11-is-stm | line 0, ray 4 |
| lv – optiland | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 9.27e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 13283 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 272 | — | — |
| lv – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 4.03e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 866 |
| lv – ref | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.58e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 79 |
| lv – ref | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 7.33e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 64 |
| lv – ref | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 4.98e-14 | canon-rf600mmf11-is-stm | line 0, ray 102 |
| lv – ref | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 3.81e-12 | canon-rf-800mm-f11-is-stm | line 0, ray 69 |
| lv – ref | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 7.32e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 64 |
| lv – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – ref | Rays both engines traced through — `rays.compared` | rays | — | 13283 | — | — |
| lv – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| lv – ref | Fields compared — `fields.compared` | elements | — | 272 | — | — |
| optiland – ref | Largest difference, along x or y, of the two engines' landings of a chief or reference ray — `landing.maxAbs` | mm | ≤ 1.00e-8 | 4.88e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 669 |
| optiland – ref | Largest difference of a tangential focus, times the fan's RMS slope — `tangentialFocus.maxScaled` | mm | ≤ 1.00e-8 | 1.65e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 79 |
| optiland – ref | Largest difference of a tangential focus, along the axis — `tangentialFocus.maxAbs` | mm | — | 1.20e-8 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| optiland – ref | Largest difference of a sagittal focus, times the fan's RMS slope — `sagittalFocus.maxScaled` | mm | ≤ 1.00e-8 | 7.78e-14 | canon-rf-800mm-f11-is-stm | line 0, ray 617 |
| optiland – ref | Largest difference of a sagittal focus, along the axis — `sagittalFocus.maxAbs` | mm | — | 5.88e-12 | canon-rf-800mm-f11-is-stm | line 0, ray 4 |
| optiland – ref | Largest difference of astigmatism — `astigmatism.maxAbs` | mm | — | 1.20e-8 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| optiland – ref | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – ref | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – ref | Rays both engines traced through — `rays.compared` | rays | — | 13283 | — | — |
| optiland – ref | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | — | — |
| optiland – ref | Fields compared — `fields.compared` | elements | — | 272 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of ref: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | Pass: landing.maxAbs 3.51e-13 mm | Pass: landing.maxAbs 2.32e-13 mm | Pass: landing.maxAbs 3.02e-13 mm | 1615 / 221 / 0 | 1615 / 221 / 0 | 1615 / 221 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | Pass: landing.maxAbs 2.13e-13 mm | Pass: landing.maxAbs 2.70e-13 mm | Pass: landing.maxAbs 2.88e-13 mm | 1722 / 114 / 0 | 1722 / 114 / 0 | 1722 / 114 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | Pass: landing.maxAbs 2.46e-13 mm | Pass: landing.maxAbs 1.65e-13 mm | Pass: landing.maxAbs 2.88e-13 mm | 1632 / 204 / 0 | 1632 / 204 / 0 | 1632 / 204 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | Pass: landing.maxAbs 3.94e-13 mm | Pass: landing.maxAbs 3.61e-13 mm | Pass: landing.maxAbs 3.56e-13 mm | 1701 / 135 / 0 | 1701 / 135 / 0 | 1701 / 135 / 0 |
| canon-rf600mmf11-is-stm | 2 | Pass: landing.maxAbs 3.11e-13 mm | Pass: landing.maxAbs 2.26e-13 mm | Pass: landing.maxAbs 4.30e-13 mm | 1695 / 141 / 0 | 1695 / 141 / 0 | 1695 / 141 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | Pass: landing.maxAbs 2.47e-13 mm | Pass: landing.maxAbs 1.78e-13 mm | Pass: landing.maxAbs 2.47e-13 mm | 1609 / 227 / 0 | 1609 / 227 / 0 | 1609 / 227 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | Pass: landing.maxAbs 3.21e-13 mm | Pass: landing.maxAbs 3.09e-13 mm | Pass: landing.maxAbs 3.66e-13 mm | 1663 / 173 / 0 | 1663 / 173 / 0 | 1663 / 173 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | Pass: landing.maxAbs 5.04e-13 mm | Pass: landing.maxAbs 4.03e-13 mm | Pass: landing.maxAbs 4.88e-13 mm | 1646 / 190 / 0 | 1646 / 190 / 0 | 1646 / 190 / 0 |

## How to read this

### Verdicts

A verdict is of one pair of engines: of one request, or, in a table by run, the worst over the requests of the
run. A table shows the label; the stored value is what the baseline file holds.

| Label | Stored value | Meaning |
|---|---|---|
| Pass: within limit | `PASS` | A check held to a limit: every judged figure is at or below its limit. |
| Not computed | `UNSUPPORTED` | One of the two engines cannot compute what was asked. That is an answer, not a failure. |

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
| Spot and fan rays | `spot-rays` | held to a limit | Spot and fan figures of the coma and bokeh tabs' rays, on identical rays. |
| Spherical aberration and axial colour rays | `axial-rays` | held to a limit | Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays. |
| Chief rays (distortion, pupils, lateral colour) | `chief-rays` | held to a limit | Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays. |
| Field-curve rays | `field-curve-rays` | held to a limit | Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays. |

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
| `field` | in a check of the ray-trace quantity: the field angle of the set of rays, in degrees (shown with deg) |
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
| `-wide, -tele` | a zoom lens at the short or the long end of its zoom range |
| `reference-<design>` | one of LensVisualizer's reference designs, by its key (in the folded and diffractive suites a run's name is the lens key alone) |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | 9641803ac2132a78445530b795f878211e8b446ed4c8d4257f163c9c884d4ce2 |
| Baseline file | c55b9b55b26882f89e87fc398cf3ccf4fe6d39dcc85e5ae43684ec54e1538ec3 |
| Limits file | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5 | commit 25f65d4b4213a21392cbae92680134906049b2ad |
| optiland | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb | commit 4e893f53aee1312f2d091680b93dd2279711e197, distribution version 0.6.2.post117+g4e893f53, source hash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | — |

| Run | Lens state |
|---|---|
| canon-ef-400mm-f4-do-is-usm | 3d21e2bb2d14b95d68d4582f203148cc3457dee921d808daec81b4bffe092dab |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 45e0c2f29a19478fbd3eae5e9219866f8a2d0b74ec5d958774e3737f9e902602 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 1e3d53a15b39052b786ff71691edf0d343f47e379a022cb1c6f7ceb4ec7bc030 |
| canon-rf-800mm-f11-is-stm | 976293184c364a7e7dcc10b28ebd793bd1459e4abb7cfee50f686d08342713af |
| canon-rf600mmf11-is-stm | 91dcb014c8bbd75e645c8b5a82982c80254c6eecc84aeed824beeea86e360108 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 332f63a05f7c9edf58ec8ff9ebd04dabb09984c13aa9ec5477a4aeccdcdc517c |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | b5f5e48518f457bb049086e6da08115ed21da366dfe5ffcae366c096f65c6729 |
| nikon-nikkor-z-800mm-f63-vr-s | 6143cd80253692a9e9f57da6885878d427a65613cf1d30fdc14117e5dfa8b70b |
| reference-folded-diffractive-plate | — |
