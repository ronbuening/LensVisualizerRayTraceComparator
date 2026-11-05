# Baseline of diffractive

What the engines below agreed on, rung by rung, as the committed baseline of the suite records it: for every
run as it was run (a zoom at each end) and every pair of engines the verdict and the largest value of each
metric over the requests of the run (its fields and lines). A metric counted in rays or elements is added up.
This file is rendered from the baseline alone (`lvrtc verify` makes it anew and fails on a byte of difference):
it holds results, counts, names and hashes, and nothing an engine traced. The hash of a run's case says what
its figures are of; `lvrtc baseline check` says whether the case and the engines are still those.

FLOOR is a pass that is counted apart: a metric above its tolerance by the known numerical floor of one engine,
which is within the policy's floor limit of the arbiter while no other engine sides with it against the arbiter.

## Inputs

| Input | Value |
|---|---|
| Suite | diffractive |
| Suite hash | 9641803ac2132a78445530b795f878211e8b446ed4c8d4257f163c9c884d4ce2 |
| Baseline hash | c55b9b55b26882f89e87fc398cf3ccf4fe6d39dcc85e5ae43684ec54e1538ec3 |
| Contract version | 1.0 |
| Policy | rungs v24 |
| Policy hash | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5 | commit 25f65d4b4213a21392cbae92680134906049b2ad, dirty false, engineFileCount 184 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | sourceFiles 13 |

| Run | Case |
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

## Run problems

| Run | Problem |
|---|---|
| reference-folded-diffractive-plate | tilted-image-plane: the image plane is not perpendicular to the optical axis |
| reference-folded-diffractive-plate | off-axis-image-plane: the image plane is not centred on the optical axis |
| reference-folded-diffractive-plate | tilted-surface: surface FOLD has a tilted interaction normal |
| reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLD has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLDB has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 8 | 8 | lv – optiland | 8 PASS | 8 PASS |
| r0 | system.describe | 8 | 8 | lv – ref | 8 PASS | 8 PASS |
| r0 | system.describe | 8 | 8 | optiland – ref | 8 PASS | 8 PASS |
| r1 | paraxial.first-order | 8 | 8 | lv – optiland | 8 UNSUPPORTED | 8 UNSUPPORTED |
| r1 | paraxial.first-order | 8 | 8 | lv – ref | 8 PASS | 8 PASS |
| r1 | paraxial.first-order | 8 | 8 | optiland – ref | 8 UNSUPPORTED | 8 UNSUPPORTED |
| r2 | rays.trace | 8 | 16 | lv – optiland | 8 PASS | 16 PASS |
| r2 | rays.trace | 8 | 16 | lv – ref | 8 PASS | 16 PASS |
| r2 | rays.trace | 8 | 16 | optiland – ref | 8 PASS | 16 PASS |
| r3 | rays.trace | 8 | 16 | lv – optiland | 8 PASS | 16 PASS |
| r3 | rays.trace | 8 | 16 | lv – ref | 8 PASS | 16 PASS |
| r3 | rays.trace | 8 | 16 | optiland – ref | 8 PASS | 16 PASS |
| r7a | rays.trace | 8 | 80 | lv – optiland | 8 PASS | 80 PASS |
| r7a | rays.trace | 8 | 80 | lv – ref | 8 PASS | 80 PASS |
| r7a | rays.trace | 8 | 80 | optiland – ref | 8 PASS | 80 PASS |
| r8a | rays.trace | 8 | 24 | lv – optiland | 8 PASS | 24 PASS |
| r8a | rays.trace | 8 | 24 | lv – ref | 8 PASS | 24 PASS |
| r8a | rays.trace | 8 | 24 | optiland – ref | 8 PASS | 24 PASS |
| r9a | rays.trace | 8 | 32 | lv – optiland | 8 PASS | 32 PASS |
| r9a | rays.trace | 8 | 32 | lv – ref | 8 PASS | 32 PASS |
| r9a | rays.trace | 8 | 32 | optiland – ref | 8 PASS | 32 PASS |
| r10a | rays.trace | 8 | 16 | lv – optiland | 8 PASS | 16 PASS |
| r10a | rays.trace | 8 | 16 | lv – ref | 8 PASS | 16 PASS |
| r10a | rays.trace | 8 | 16 | optiland – ref | 8 PASS | 16 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 8 ok |
| r0 | optiland | 8 ok |
| r0 | ref | 8 ok |
| r1 | lv | 8 ok |
| r1 | optiland | 8 unsupported (feature optiland-phase-paraxial-unseen) |
| r1 | ref | 8 ok |
| r2 | lv | 8 ok |
| r2 | optiland | 8 ok |
| r2 | ref | 8 ok |
| r3 | lv | 8 ok |
| r3 | optiland | 8 ok |
| r3 | ref | 8 ok |
| r7a | lv | 8 ok |
| r7a | optiland | 8 ok |
| r7a | ref | 8 ok |
| r8a | lv | 8 ok |
| r8a | optiland | 8 ok |
| r8a | ref | 8 ok |
| r9a | lv | 8 ok |
| r9a | optiland | 8 ok |
| r9a | ref | 8 ok |
| r10a | lv | 8 ok |
| r10a | optiland | 8 ok |
| r10a | ref | 8 ok |

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 3.14e-16 | canon-ef-70-300mm-f45-56-do-is-usm-wide | sample 6, surface 10 |
| lv – optiland | sag.maxAbs [mm] | 1.78e-15 | canon-ef-400mm-f4-do-is-usm | sample 6, surface 0 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 3.54e-16 | canon-rf600mmf11-is-stm | sample 7, surface 12 |
| lv – ref | sag.maxAbs [mm] | 1.78e-15 | canon-ef-400mm-f4-do-is-usm | sample 7, surface 0 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 3.54e-16 | canon-rf600mmf11-is-stm | sample 7, surface 12 |
| optiland – ref | sag.maxAbs [mm] | 1.78e-15 | canon-ef-400mm-f4-do-is-usm | sample 6, surface 0 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 1 | PASS: sag.maxScaled 2.23e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 2.23e-16 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 1 | PASS: sag.maxScaled 3.14e-16 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.75e-16 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 1 | PASS: sag.maxScaled 3.14e-16 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.75e-16 |
| canon-rf-800mm-f11-is-stm | 1 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 1.84e-16 | PASS: sag.maxScaled 3.22e-16 |
| canon-rf600mmf11-is-stm | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.09e-16 | PASS: sag.maxScaled 3.13e-16 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.17e-16 | PASS: sag.maxScaled 2.27e-16 |
| nikon-nikkor-z-800mm-f63-vr-s | 1 | PASS: sag.maxScaled 2.46e-16 | PASS: sag.maxScaled 3.35e-16 | PASS: sag.maxScaled 2.77e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.27e-11 | canon-rf-800mm-f11-is-stm | line 0, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 2.39e-12 | canon-rf-800mm-f11-is-stm | line 0, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 2.39e-12 | canon-rf-800mm-f11-is-stm | line 0, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.24e-14 | canon-ef-400mm-f4-do-is-usm | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 9.24e-14 | canon-ef-400mm-f4-do-is-usm | line 0, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 1.93e-12 mm | UNSUPPORTED |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 6.39e-14 mm | UNSUPPORTED |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 9.66e-13 mm | UNSUPPORTED |
| canon-rf-800mm-f11-is-stm | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 2.27e-11 mm | UNSUPPORTED |
| canon-rf600mmf11-is-stm | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 3.41e-12 mm | UNSUPPORTED |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 9.09e-13 mm | UNSUPPORTED |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 6.82e-13 mm | UNSUPPORTED |
| nikon-nikkor-z-800mm-f63-vr-s | 1 | UNSUPPORTED | PASS: firstOrder.maxAbs 3.18e-12 mm | UNSUPPORTED |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 2.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 51, surface 37 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 6.88e-15 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 55 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 3.79e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 230 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 1766 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.83e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118, surface 10 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.43e-15 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | field 2.50e-1, line 0, ray 98 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 2.15e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 82 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1766 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.98e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 6.99e-15 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 55 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 3.93e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 147 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1766 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | PASS: landing.maxDistance 1.97e-13 mm | PASS: landing.maxDistance 1.93e-13 mm | PASS: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | PASS: landing.maxDistance 4.71e-14 mm | PASS: landing.maxDistance 2.05e-14 mm | PASS: landing.maxDistance 5.14e-14 mm | 25 / 488 / 0 | 25 / 488 / 0 | 25 / 488 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | PASS: landing.maxDistance 2.37e-13 mm | PASS: hits.maxDistance 4.83e-13 mm | PASS: hits.maxDistance 4.98e-13 mm | 255 / 258 / 0 | 255 / 258 / 0 | 255 / 258 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | PASS: landing.maxDistance 2.66e-13 mm | PASS: landing.maxDistance 1.76e-13 mm | PASS: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-rf600mmf11-is-stm | 2 | PASS: landing.maxDistance 2.40e-13 mm | PASS: landing.maxDistance 1.88e-13 mm | PASS: landing.maxDistance 2.01e-13 mm | 241 / 272 / 0 | 241 / 272 / 0 | 241 / 272 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | PASS: landing.maxDistance 2.07e-13 mm | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 255 / 258 / 0 | 255 / 258 / 0 | 255 / 258 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | PASS: landing.maxDistance 2.87e-13 mm | PASS: landing.maxDistance 1.97e-13 mm | PASS: landing.maxDistance 2.80e-13 mm | 223 / 290 / 0 | 223 / 290 / 0 | 223 / 290 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | PASS: landing.maxDistance 3.79e-13 mm | PASS: landing.maxDistance 2.15e-13 mm | PASS: landing.maxDistance 3.93e-13 mm | 293 / 220 / 0 | 293 / 220 / 0 | 293 / 220 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 51 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 39 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 7.74e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 39 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 179 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 179 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 4.84e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 23 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 5.80e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 38 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 5.80e-10 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 6.77e-10 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 69 |
| optiland – ref | phasePath.maxAbs (≤ 2.00e-5 waves) | 1.54e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 230, surface 6 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | PASS: opticalPath.maxAbs 9.67e-11 waves | PASS: opticalPath.maxAbs 9.67e-11 waves | PASS: opticalPath.maxAbs 9.67e-11 waves |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 5.80e-10 waves | PASS: opticalPathToImage.maxAbs 5.80e-10 waves |
| canon-rf-800mm-f11-is-stm | 2 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves |
| canon-rf600mmf11-is-stm | 2 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 2.90e-10 waves |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | PASS: opticalPath.maxAbs 2.42e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 4.84e-10 waves |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | PASS: opd.maxAbs 7.74e-10 waves | PASS: opticalPath.maxAbs 6.77e-10 waves | PASS: opd.maxAbs 6.77e-10 waves |

## r7a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | transverseError.maxAbs (≤ 1.00e-8 mm) | 5.19e-13 | canon-rf-800mm-f11-is-stm | field 7.90e-1, line 0, ray 133 |
| lv – optiland | centroid.maxAbs (≤ 1.00e-8 mm) | 1.00e-13 | canon-rf-800mm-f11-is-stm | field 7.90e-1, line 0 |
| lv – optiland | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 8.88e-14 | canon-rf600mmf11-is-stm | field 0, line 0 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 13776 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 3.69e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 1.18e0, line 0, ray 15 |
| lv – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 1.18e0, line 0 |
| lv – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 3.63e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 13776 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 4.30e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 288 |
| optiland – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.26e-13 | canon-rf-800mm-f11-is-stm | field 9.48e-1, line 0 |
| optiland – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 9.93e-14 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 13776 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 10 | PASS: transverseError.maxAbs 2.86e-13 mm | PASS: transverseError.maxAbs 3.16e-13 mm | PASS: transverseError.maxAbs 2.92e-13 mm | 1682 / 262 / 0 | 1682 / 262 / 0 | 1682 / 262 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 10 | PASS: transverseError.maxAbs 1.60e-13 mm | PASS: transverseError.maxAbs 2.06e-13 mm | PASS: transverseError.maxAbs 2.31e-13 mm | 1820 / 124 / 0 | 1820 / 124 / 0 | 1820 / 124 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 10 | PASS: transverseError.maxAbs 2.57e-13 mm | PASS: transverseError.maxAbs 1.99e-13 mm | PASS: transverseError.maxAbs 2.42e-13 mm | 1693 / 251 / 0 | 1693 / 251 / 0 | 1693 / 251 / 0 |
| canon-rf-800mm-f11-is-stm | 10 | PASS: transverseError.maxAbs 5.19e-13 mm | PASS: transverseError.maxAbs 3.62e-13 mm | PASS: transverseError.maxAbs 3.38e-13 mm | 1781 / 163 / 0 | 1781 / 163 / 0 | 1781 / 163 / 0 |
| canon-rf600mmf11-is-stm | 10 | PASS: transverseError.maxAbs 4.23e-13 mm | PASS: transverseError.maxAbs 2.70e-13 mm | PASS: transverseError.maxAbs 3.16e-13 mm | 1784 / 160 / 0 | 1784 / 160 / 0 | 1784 / 160 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 10 | PASS: transverseError.maxAbs 2.56e-13 mm | PASS: transverseError.maxAbs 2.42e-13 mm | PASS: transverseError.maxAbs 2.50e-13 mm | 1694 / 250 / 0 | 1694 / 250 / 0 | 1694 / 250 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 10 | PASS: transverseError.maxAbs 3.23e-13 mm | PASS: transverseError.maxAbs 2.81e-13 mm | PASS: transverseError.maxAbs 3.45e-13 mm | 1717 / 227 / 0 | 1717 / 227 / 0 | 1717 / 227 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 10 | PASS: transverseError.maxAbs 5.19e-13 mm | PASS: transverseError.maxAbs 3.69e-13 mm | PASS: transverseError.maxAbs 4.30e-13 mm | 1685 / 259 / 0 | 1685 / 259 / 0 | 1685 / 259 / 0 |

## r8a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | intercept.maxScaled (≤ 1.00e-8 mm) | 2.45e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 36 |
| lv – optiland | intercept.maxAbs [mm] | 5.23e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0, ray 6 |
| lv – optiland | focus.maxScaled (≤ 1.00e-8 mm) | 6.50e-14 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – optiland | focus.maxAbs [mm] | 1.65e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – optiland | focusRms.maxAbs (≤ 1.00e-8 mm) | 3.38e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 528 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 2.11e-13 | canon-ef-400mm-f4-do-is-usm | field 0, line 0, ray 34 |
| lv – ref | intercept.maxAbs [mm] | 5.85e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0, ray 16 |
| lv – ref | focus.maxScaled (≤ 1.00e-8 mm) | 5.15e-14 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – ref | focus.maxAbs [mm] | 1.31e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 9.01e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 528 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 3.73e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 36 |
| optiland – ref | intercept.maxAbs [mm] | 6.14e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0, ray 14 |
| optiland – ref | focus.maxScaled (≤ 1.00e-8 mm) | 1.16e-13 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| optiland – ref | focus.maxAbs [mm] | 2.96e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| optiland – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 5.64e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 528 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 3 | PASS: intercept.maxScaled 1.17e-13 mm | PASS: intercept.maxScaled 2.11e-13 mm | PASS: intercept.maxScaled 1.75e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 3 | PASS: intercept.maxScaled 1.05e-13 mm | PASS: intercept.maxScaled 5.36e-14 mm | PASS: intercept.maxScaled 9.92e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 3 | PASS: intercept.maxScaled 1.58e-13 mm | PASS: intercept.maxScaled 1.34e-13 mm | PASS: intercept.maxScaled 2.02e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-rf-800mm-f11-is-stm | 3 | PASS: intercept.maxScaled 1.66e-13 mm | PASS: intercept.maxScaled 1.16e-13 mm | PASS: intercept.maxScaled 2.36e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-rf600mmf11-is-stm | 3 | PASS: intercept.maxScaled 1.50e-13 mm | PASS: intercept.maxScaled 1.42e-13 mm | PASS: intercept.maxScaled 2.32e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 3 | PASS: intercept.maxScaled 1.18e-13 mm | PASS: intercept.maxScaled 7.22e-14 mm | PASS: intercept.maxScaled 1.67e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 3 | PASS: intercept.maxScaled 1.44e-13 mm | PASS: intercept.maxScaled 1.38e-13 mm | PASS: intercept.maxScaled 9.56e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 3 | PASS: intercept.maxScaled 2.45e-13 mm | PASS: intercept.maxScaled 2.09e-13 mm | PASS: intercept.maxScaled 3.73e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |

## r9a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 3.52e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 16 |
| lv – optiland | distortion.maxScaled (≤ 1.00e-8 mm) | 2.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 3 |
| lv – optiland | distortion.maxAbs [percent] | 1.40e-12 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 9 |
| lv – optiland | exitPupil.maxScaled (≤ 1.00e-8 mm) | 1.45e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| lv – optiland | exitPupil.maxAbs [mm] | 9.52e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 1192 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.34e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 18 |
| lv – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.14e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 30 |
| lv – ref | distortion.maxAbs [percent] | 1.69e-12 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 3 |
| lv – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 5.75e-14 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 16 |
| lv – ref | exitPupil.maxAbs [mm] | 6.82e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 7 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1192 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.42e-13 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | line 0, ray 13 |
| optiland – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 2.74e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 19 |
| optiland – ref | distortion.maxAbs [percent] | 1.49e-12 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 3 |
| optiland – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 9.55e-14 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| optiland – ref | exitPupil.maxAbs [mm] | 6.25e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1192 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 4 | PASS: landing.maxAbs 2.70e-13 mm | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 4 | PASS: landing.maxAbs 6.04e-14 mm | PASS: distortion.maxScaled 3.14e-13 mm | PASS: distortion.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 4 | PASS: distortion.maxScaled 1.85e-13 mm | PASS: distortion.maxScaled 1.60e-13 mm | PASS: landing.maxAbs 1.31e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-rf-800mm-f11-is-stm | 4 | PASS: distortion.maxScaled 1.59e-13 mm | PASS: distortion.maxScaled 2.14e-13 mm | PASS: distortion.maxScaled 2.53e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-rf600mmf11-is-stm | 4 | PASS: landing.maxAbs 1.63e-13 mm | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.95e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 4 | PASS: landing.maxAbs 1.92e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 2.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 4 | PASS: landing.maxAbs 2.03e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 2.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 4 | PASS: landing.maxAbs 3.52e-13 mm | PASS: landing.maxAbs 2.34e-13 mm | PASS: distortion.maxScaled 2.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## r10a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 5.04e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 1270 |
| lv – optiland | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.19e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 1235 |
| lv – optiland | tangentialFocus.maxAbs [mm] | 9.26e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| lv – optiland | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 5.95e-14 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 1544 |
| lv – optiland | sagittalFocus.maxAbs [mm] | 6.26e-12 | canon-rf-800mm-f11-is-stm | line 0, ray 4 |
| lv – optiland | astigmatism.maxAbs [mm] | 9.27e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 13283 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 272 | — | — |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 4.03e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 866 |
| lv – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.58e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 79 |
| lv – ref | tangentialFocus.maxAbs [mm] | 7.33e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 64 |
| lv – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 4.98e-14 | canon-rf600mmf11-is-stm | line 0, ray 102 |
| lv – ref | sagittalFocus.maxAbs [mm] | 3.81e-12 | canon-rf-800mm-f11-is-stm | line 0, ray 69 |
| lv – ref | astigmatism.maxAbs [mm] | 7.32e-9 | canon-rf-800mm-f11-is-stm | line 0, ray 64 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 13283 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 272 | — | — |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 4.88e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 669 |
| optiland – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.65e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 79 |
| optiland – ref | tangentialFocus.maxAbs [mm] | 1.20e-8 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| optiland – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 7.78e-14 | canon-rf-800mm-f11-is-stm | line 0, ray 617 |
| optiland – ref | sagittalFocus.maxAbs [mm] | 5.88e-12 | canon-rf-800mm-f11-is-stm | line 0, ray 4 |
| optiland – ref | astigmatism.maxAbs [mm] | 1.20e-8 | canon-rf-800mm-f11-is-stm | line 0, ray 84 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 13283 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 272 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | PASS: landing.maxAbs 3.51e-13 mm | PASS: landing.maxAbs 2.32e-13 mm | PASS: landing.maxAbs 3.02e-13 mm | 1615 / 221 / 0 | 1615 / 221 / 0 | 1615 / 221 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 2.70e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | 1722 / 114 / 0 | 1722 / 114 / 0 | 1722 / 114 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | PASS: landing.maxAbs 2.46e-13 mm | PASS: landing.maxAbs 1.65e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | 1632 / 204 / 0 | 1632 / 204 / 0 | 1632 / 204 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | PASS: landing.maxAbs 3.94e-13 mm | PASS: landing.maxAbs 3.61e-13 mm | PASS: landing.maxAbs 3.56e-13 mm | 1701 / 135 / 0 | 1701 / 135 / 0 | 1701 / 135 / 0 |
| canon-rf600mmf11-is-stm | 2 | PASS: landing.maxAbs 3.11e-13 mm | PASS: landing.maxAbs 2.26e-13 mm | PASS: landing.maxAbs 4.30e-13 mm | 1695 / 141 / 0 | 1695 / 141 / 0 | 1695 / 141 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | PASS: landing.maxAbs 2.47e-13 mm | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 2.47e-13 mm | 1609 / 227 / 0 | 1609 / 227 / 0 | 1609 / 227 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | PASS: landing.maxAbs 3.21e-13 mm | PASS: landing.maxAbs 3.09e-13 mm | PASS: landing.maxAbs 3.66e-13 mm | 1663 / 173 / 0 | 1663 / 173 / 0 | 1663 / 173 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | PASS: landing.maxAbs 5.04e-13 mm | PASS: landing.maxAbs 4.03e-13 mm | PASS: landing.maxAbs 4.88e-13 mm | 1646 / 190 / 0 | 1646 / 190 / 0 | 1646 / 190 / 0 |
