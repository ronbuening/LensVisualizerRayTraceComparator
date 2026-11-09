# Baseline of folded: the ray checks

This file is the committed record of the ray checks of the suite folded, as its baseline holds them: for every
run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named) and every
pair of engines, the verdict, and the largest value of each figure over the requests of the run (its fields and
wavelengths). A figure counted in rays or elements is added up. The file is rendered from the baseline alone, so
`lvrtc verify` can render it anew and compare it byte for byte: it holds results, counts, names and hashes, and no
ray an engine traced. `lvrtc baseline check` runs the engines again and says whether the lens states and the
engines are still those of the baseline. How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | folded |
| Limits file | v24 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 184 engine files |
| optiland | optiland | 0.6.2.post117+g4e893f53 | backend numpy, checkout with uncommitted changes, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 534 source files |
| reference-tracer | Reference tracer | 1 | 13 source files |

## Runs with a problem

| Run | Problem |
|---|---|
| carl-zeiss-mirotar-500f45 | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| minolta-250mm-f56-rf | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| reference-annular-ring-blocker | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| reference-cassegrain-back-focus | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| reference-folded-diffractive-plate | tilted-image-plane: the image plane is not perpendicular to the optical axis |
| reference-folded-diffractive-plate | off-axis-image-plane: the image plane is not centred on the optical axis |
| reference-folded-diffractive-plate | tilted-surface: surface FOLD has a tilted interaction normal |
| reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLD has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLDB has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| reference-maksutov-cassegrain-meniscus | folded-post-path-reflection: coarse set 843a5d4eaa84a41fb3f758f923887b8ee4b34576805ff8707cf05d74a4bfe4b1, line 0, ray 21: it ended at step 5 of LV's 4 declared visits; LV continues its reflective-surface search past the declared path |
| reference-newtonian-side-focus | tilted-image-plane: the image plane is not perpendicular to the optical axis |
| reference-newtonian-side-focus | off-axis-image-plane: the image plane is not centred on the optical axis |
| reference-newtonian-side-focus | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| reference-newtonian-side-focus | surface-profile-unsupported: surface SEC has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| reference-newtonian-side-focus | surface-profile-unsupported: surface SECB has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| vivitar-s1-450-f45 | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Built system — `built-system` | `system.describe` | 8 | 8 | lv – optiland | 8 Pass | 8 Pass |
| Built system — `built-system` | `system.describe` | 8 | 8 | lv – reference-tracer | 8 Pass | 8 Pass |
| Built system — `built-system` | `system.describe` | 8 | 8 | optiland – reference-tracer | 8 Pass | 8 Pass |
| First-order data — `first-order` | `paraxial.first-order` | 8 | 8 | lv – optiland | 1 Pass; 7 Not computed | 1 Pass; 7 Not computed |
| First-order data — `first-order` | `paraxial.first-order` | 8 | 8 | lv – reference-tracer | 1 Pass; 7 Not computed | 1 Pass; 7 Not computed |
| First-order data — `first-order` | `paraxial.first-order` | 8 | 8 | optiland – reference-tracer | 7 Pass; 1 Not computed | 7 Pass; 1 Not computed |
| Ray trace — `ray-trace` | `rays.trace` | 8 | 16 | lv – optiland | 8 Pass | 16 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 8 | 16 | lv – reference-tracer | 8 Pass | 16 Pass |
| Ray trace — `ray-trace` | `rays.trace` | 8 | 16 | optiland – reference-tracer | 8 Pass | 16 Pass |
| Optical path — `optical-path` | `rays.trace` | 8 | 16 | lv – optiland | 8 Not computed | 16 Not computed |
| Optical path — `optical-path` | `rays.trace` | 8 | 16 | lv – reference-tracer | 8 Not computed | 16 Not computed |
| Optical path — `optical-path` | `rays.trace` | 8 | 16 | optiland – reference-tracer | 8 Pass | 16 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Built system — `built-system` | lv | 8 answered |
| Built system — `built-system` | optiland | 8 answered |
| Built system — `built-system` | reference-tracer | 8 answered |
| First-order data — `first-order` | lv | 1 answered, 7 not computed (feature folded-stop-not-visited; feature lv-folded-first-order-unavailable) |
| First-order data — `first-order` | optiland | 7 answered, 1 not computed (feature folded-stop-not-visited) |
| First-order data — `first-order` | reference-tracer | 7 answered, 1 not computed (feature folded-stop-not-visited) |
| Ray trace — `ray-trace` | lv | 8 answered |
| Ray trace — `ray-trace` | optiland | 8 answered |
| Ray trace — `ray-trace` | reference-tracer | 8 answered |
| Optical path — `optical-path` | lv | 8 answered |
| Optical path — `optical-path` | optiland | 8 answered |
| Optical path — `optical-path` | reference-tracer | 8 answered |

## Built system — `built-system`

Compares: Built layout, shape, aperture, index and sampled sag. Kind: held to a limit. Quantity asked of the engines: the system as built (`system.describe`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – optiland | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.10e-16 | reference-mangin-second-surface-mirror | sample 8, surface 2 |
| lv – optiland | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 8.88e-16 | minolta-af-reflex-500mm-f8 | sample 8, surface 9 |
| lv – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 2.15e-16 | minolta-af-reflex-500mm-f8 | sample 6, surface 10 |
| lv – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 8.88e-16 | nikon-reflex-nikkor-500mm-f8-new | sample 8, surface 7 |
| optiland – reference-tracer | Surfaces whose count or place differs — `layout.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Surfaces whose curvature, conic or asphere terms differ — `shape.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Stops and clear apertures that differ — `aperture.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Refractive indices that differ — `index.mismatches` | elements | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Largest sag difference at the sampled heights, over the size of a rounding there — `sag.maxScaled` | (no unit) | ≤ 1.00e-12 | 3.10e-16 | reference-mangin-second-surface-mirror | sample 8, surface 2 |
| optiland – reference-tracer | Largest sag difference at the sampled heights — `sag.maxAbs` | mm | — | 8.88e-16 | minolta-af-reflex-500mm-f8 | sample 8, surface 9 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 1 | Pass: sag.maxScaled 2.03e-16 | Pass: sag.maxScaled 2.15e-16 | Pass: sag.maxScaled 2.15e-16 |
| nikon-reflex-nikkor-1000mm-f11 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 2.01e-16 | Pass: sag.maxScaled 2.01e-16 |
| nikon-reflex-nikkor-500mm-f8-new | 1 | Pass: sag.maxScaled 2.56e-16 | Pass: sag.maxScaled 2.12e-16 | Pass: sag.maxScaled 2.67e-16 |
| nikon-reflex-nikkor-c-500mm-f8 | 1 | Pass: sag.maxScaled 2.22e-16 | Pass: sag.maxScaled 1.66e-16 | Pass: sag.maxScaled 2.22e-16 |
| reference-annular-obscured-mirror | 1 | Pass: sag.maxScaled 1.74e-16 | Pass: layout.mismatches 0 elements | Pass: sag.maxScaled 1.74e-16 |
| reference-gregorian-secondary | 1 | Pass: sag.maxScaled 1.22e-16 | Pass: sag.maxScaled 1.11e-16 | Pass: sag.maxScaled 1.22e-16 |
| reference-mangin-second-surface-mirror | 1 | Pass: sag.maxScaled 3.10e-16 | Pass: layout.mismatches 0 elements | Pass: sag.maxScaled 3.10e-16 |
| reference-spherical-primary-mirror | 1 | Pass: sag.maxScaled 1.74e-16 | Pass: layout.mismatches 0 elements | Pass: sag.maxScaled 1.74e-16 |

## First-order data — `first-order`

Compares: First-order quantities and pupils. Kind: held to a limit. Quantity asked of the engines: first-order data (`paraxial.first-order`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 0 | reference-spherical-primary-mirror | line 0, quantity efl |
| lv – optiland | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – optiland | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| lv – optiland | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 2.08e-15 | reference-spherical-primary-mirror | line 0, quantity frontFocalZ |
| lv – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| lv – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a focal length, focal point, principal point or back focus — `firstOrder.maxAbs` | mm | ≤ 1.00e-9 | 1.00e-11 | nikon-reflex-nikkor-c-500mm-f8 | line 0, quantity frontFocalZ |
| optiland – reference-tracer | Largest difference of a pupil position, scaled by its distance from the image plane — `pupilZ.maxScaled` | mm | ≤ 1.00e-9 | 5.68e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilZ |
| optiland – reference-tracer | Largest difference of a pupil position — `pupilZ.maxAbs` | mm | — | 5.68e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilZ |
| optiland – reference-tracer | Largest difference of a pupil radius, scaled by its pupil's distance from the image — `pupilRadius.maxScaled` | mm | ≤ 1.00e-9 | 1.42e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilSemiDiameter |
| optiland – reference-tracer | Largest difference of a pupil radius — `pupilRadius.maxAbs` | mm | — | 1.42e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 1 | Not computed | Not computed | Pass: firstOrder.maxAbs 1.36e-12 mm |
| nikon-reflex-nikkor-1000mm-f11 | 1 | Not computed | Not computed | Pass: firstOrder.maxAbs 5.46e-12 mm |
| nikon-reflex-nikkor-500mm-f8-new | 1 | Not computed | Not computed | Pass: firstOrder.maxAbs 6.14e-12 mm |
| nikon-reflex-nikkor-c-500mm-f8 | 1 | Not computed | Not computed | Pass: firstOrder.maxAbs 1.00e-11 mm |
| reference-annular-obscured-mirror | 1 | Not computed | Not computed | Pass: firstOrder.maxAbs 3.47e-15 mm |
| reference-gregorian-secondary | 1 | Not computed | Not computed | Not computed |
| reference-mangin-second-surface-mirror | 1 | Not computed | Not computed | Pass: pupilZ.maxScaled 5.68e-14 mm |
| reference-spherical-primary-mirror | 1 | Pass: firstOrder.maxAbs 0 mm | Pass: firstOrder.maxAbs 2.08e-15 mm | Pass: firstOrder.maxAbs 2.08e-15 mm |

## Ray trace — `ray-trace`

Compares: Hits, directions, image landings and masks of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 9.50e-14 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1 deg, line 0, ray 230, surface 13 |
| lv – optiland | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 4.00e-15 | nikon-reflex-nikkor-500mm-f8-new | field 2.50e-1 deg, line 0, ray 54 |
| lv – optiland | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 1.86e-13 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1 deg, line 0, ray 230 |
| lv – optiland | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – optiland | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1976 | — | — |
| lv – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 9.08e-14 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1 deg, line 0, ray 195, surface 13 |
| lv – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.30e-15 | nikon-reflex-nikkor-500mm-f8-new | field 2.50e-1 deg, line 0, ray 22 |
| lv – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 1.75e-13 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1 deg, line 0, ray 195 |
| lv – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| lv – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1976 | — | — |
| optiland – reference-tracer | Largest distance between the two engines' ray hits on a surface — `hits.maxDistance` | mm | ≤ 1.00e-8 | 1.19e-13 | minolta-af-reflex-500mm-f8 | field 2.50e-1 deg, line 0, ray 113, surface 17 |
| optiland – reference-tracer | Largest difference of a component of a ray's exit direction — `direction.maxAbs` | (no unit) | ≤ 1.00e-9 | 4.11e-15 | nikon-reflex-nikkor-500mm-f8-new | field 2.50e-1 deg, line 0, ray 54 |
| optiland – reference-tracer | Largest distance between the two engines' ray landings on the image plane — `landing.maxDistance` | mm | ≤ 1.00e-8 | 2.27e-13 | minolta-af-reflex-500mm-f8 | field 2.50e-1 deg, line 0, ray 231 |
| optiland – reference-tracer | Rays one engine stops and the other lets through — `mask.mismatches` | rays | ≤ 0 | 0 | — | — |
| optiland – reference-tracer | Rays one engine stops and the other lets through within 1e-8 mm of a rim or central obstruction (shown, not judged) — `mask.rimBand` | rays | — | 0 | — | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1976 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer | Rays of lv: ok / blocked / failed | Rays of optiland: ok / blocked / failed | Rays of reference-tracer: ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 2 | Pass: landing.maxDistance 1.74e-13 mm | Pass: landing.maxDistance 1.39e-13 mm | Pass: landing.maxDistance 2.27e-13 mm | 264 / 209 / 40 | 264 / 249 / 0 | 264 / 249 / 0 |
| nikon-reflex-nikkor-1000mm-f11 | 2 | Pass: landing.maxDistance 1.86e-13 mm | Pass: landing.maxDistance 1.75e-13 mm | Pass: landing.maxDistance 1.90e-13 mm | 268 / 233 / 12 | 268 / 245 / 0 | 268 / 245 / 0 |
| nikon-reflex-nikkor-500mm-f8-new | 2 | Pass: landing.maxDistance 1.68e-13 mm | Pass: landing.maxDistance 1.52e-13 mm | Pass: landing.maxDistance 1.99e-13 mm | 224 / 289 / 0 | 224 / 289 / 0 | 224 / 289 / 0 |
| nikon-reflex-nikkor-c-500mm-f8 | 2 | Pass: landing.maxDistance 1.17e-13 mm | Pass: landing.maxDistance 8.18e-14 mm | Pass: landing.maxDistance 1.31e-13 mm | 220 / 289 / 4 | 220 / 293 / 0 | 220 / 293 / 0 |
| reference-annular-obscured-mirror | 2 | Pass: hits.maxDistance 2.86e-14 mm | Pass: hits.maxDistance 2.86e-14 mm | Pass: landing.maxDistance 1.83e-14 mm | 316 / 197 / 0 | 316 / 197 / 0 | 316 / 197 / 0 |
| reference-gregorian-secondary | 2 | Pass: landing.maxDistance 2.39e-14 mm | Pass: landing.maxDistance 2.15e-14 mm | Pass: landing.maxDistance 1.99e-14 mm | 34 / 448 / 31 | 34 / 479 / 0 | 34 / 479 / 0 |
| reference-mangin-second-surface-mirror | 2 | Pass: landing.maxDistance 3.27e-14 mm | Pass: landing.maxDistance 1.51e-14 mm | Pass: landing.maxDistance 3.76e-14 mm | 325 / 188 / 0 | 325 / 188 / 0 | 325 / 188 / 0 |
| reference-spherical-primary-mirror | 2 | Pass: hits.maxDistance 2.85e-14 mm | Pass: landing.maxDistance 1.79e-14 mm | Pass: hits.maxDistance 2.84e-14 mm | 325 / 188 / 0 | 325 / 188 / 0 | 325 / 188 / 0 |

## Optical path — `optical-path`

Compares: Optical path, path to image and chief-relative OPD of identical rays. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Run | Where |
|---|---|---|---|---|---|---|
| optiland – reference-tracer | Largest difference of an optical path length to a surface — `opticalPath.maxAbs` | waves | ≤ 2.00e-5 | 5.80e-10 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1 deg, line 0, ray 83 |
| optiland – reference-tracer | Largest difference of an optical path length to the image plane — `opticalPathToImage.maxAbs` | waves | ≤ 2.00e-5 | 3.87e-10 | nikon-reflex-nikkor-1000mm-f11 | field 0 deg, line 0, ray 71 |
| optiland – reference-tracer | Largest difference of an optical path difference from the chief ray — `opd.maxAbs` | waves | ≤ 2.00e-5 | 1.45e-10 | reference-spherical-primary-mirror | field 0 deg, line 0, ray 103 |

By run, each pair with its verdict and the judged figure that is largest against its limit:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 2 | Not computed | Not computed | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| nikon-reflex-nikkor-1000mm-f11 | 2 | Not computed | Not computed | Pass: opticalPath.maxAbs 5.80e-10 waves |
| nikon-reflex-nikkor-500mm-f8-new | 2 | Not computed | Not computed | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| nikon-reflex-nikkor-c-500mm-f8 | 2 | Not computed | Not computed | Pass: opticalPathToImage.maxAbs 2.90e-10 waves |
| reference-annular-obscured-mirror | 2 | Not computed | Not computed | Pass: opticalPathToImage.maxAbs 9.67e-11 waves |
| reference-gregorian-secondary | 2 | Not computed | Not computed | Pass: opticalPath.maxAbs 9.67e-11 waves |
| reference-mangin-second-surface-mirror | 2 | Not computed | Not computed | Pass: opticalPath.maxAbs 9.67e-11 waves |
| reference-spherical-primary-mirror | 2 | Not computed | Not computed | Pass: opticalPathToImage.maxAbs 1.45e-10 waves |

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
| `reference-<design>` | one of LensVisualizer's reference designs, by its key (in the folded and diffractive suites a run's name is the lens key alone) |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | f3d1c308f58ee05d6970be5e8be8730aea6a15759ede73ab439b59adfc5a6455 |
| Baseline file | 612eb2f3a9be9b70404c17069736edc4c08d10079ed81db6188fb0e520b3669b |
| Limits file | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |
| Contract version of the baseline file | 1.0 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5 | commit 25f65d4b4213a21392cbae92680134906049b2ad |
| optiland | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb | commit 4e893f53aee1312f2d091680b93dd2279711e197, distribution version 0.6.2.post117+g4e893f53, source hash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| reference-tracer | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | — |

| Run | Lens state |
|---|---|
| carl-zeiss-mirotar-500f45 | — |
| minolta-250mm-f56-rf | — |
| minolta-af-reflex-500mm-f8 | c54ba9572ac4a26dcea4a6344c56e262ce20684c4ec681a2241801ccc4ab21f8 |
| nikon-reflex-nikkor-1000mm-f11 | c08be7bedd64209471a367783e99476bd8a9ee19c9d99d4ef35f24e196af760e |
| nikon-reflex-nikkor-500mm-f8-new | 9790071a93c6e48cc7ac729a8083f0f9212d46d22f9da9ccb75296ff0170de56 |
| nikon-reflex-nikkor-c-500mm-f8 | 7656f93551c8a00083812e229545f99f12a9f96a316e82158682c35b783d72a9 |
| reference-annular-obscured-mirror | 2857542e5bdaa651e46e00fc573cdd2420dcd17557e9133fdc3b2b295e5bd7b5 |
| reference-annular-ring-blocker | — |
| reference-cassegrain-back-focus | — |
| reference-folded-diffractive-plate | — |
| reference-gregorian-secondary | 2b814ae9ca557303dd8b2067e7ccd592c16ab688a00125dfbc0d7878b19574d8 |
| reference-maksutov-cassegrain-meniscus | — |
| reference-mangin-second-surface-mirror | f858aa329995780c3c826ae88d881184b64b9ecf82cab8908a11d2995a5031a5 |
| reference-newtonian-side-focus | — |
| reference-spherical-primary-mirror | b4f7cd82f9493fd554ce2961e81e0b46b25ba5873dc247cffb87f19d5b003d86 |
| vivitar-s1-450-f45 | — |
