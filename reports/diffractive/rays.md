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
| Baseline hash | cedaf1a0b4e7768a057ec9c30c1979fdceae6fb2ce5489821c480d8d273c54b4 |
| Contract version | 1.0 |
| Policy | rungs v24 |
| Policy hash | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59 | d950739f06bc44c8bff898a823224e9f267dc69aaa6c2029c315298487048a1e | commit 6287f4393ffbc2fd951c7d61f9bc6a024e30591f, dirty false, engineFileCount 184 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 846c50e378e2ebe9f678d9f52ef8594f20cbb96ed773f1e042437710ae947773 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | sourceFiles 13 |

| Run | Case |
|---|---|
| canon-ef-400mm-f4-do-is-usm | 11931c70258ee6bfd8d76caedae224e404b95cecb122836893409468cb50e19c |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 29d0d97deca0d536d7e7c336af94976458bb342112a2764e9124ee9a6a694fc5 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | ea1e57a4d1cd516cb8ac3106b786aedd806b158cb856630b52100b9f33d37d21 |
| canon-rf-800mm-f11-is-stm | 976293184c364a7e7dcc10b28ebd793bd1459e4abb7cfee50f686d08342713af |
| canon-rf600mmf11-is-stm | 91dcb014c8bbd75e645c8b5a82982c80254c6eecc84aeed824beeea86e360108 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | c7da0529501a363fab563cace7c1d5348adfed094290c61a563c75522d74932b |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 00b019a795aec1d3e4b1a419ceb19a0103770196f130e823135af35cca21c775 |
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
| lv – optiland | sag.maxAbs [mm] | 3.55e-15 | canon-ef-400mm-f4-do-is-usm | sample 8, surface 10 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 3.54e-16 | canon-rf600mmf11-is-stm | sample 7, surface 12 |
| lv – ref | sag.maxAbs [mm] | 3.55e-15 | canon-ef-400mm-f4-do-is-usm | sample 7, surface 10 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 3.54e-16 | canon-rf600mmf11-is-stm | sample 7, surface 12 |
| optiland – ref | sag.maxAbs [mm] | 3.55e-15 | canon-ef-400mm-f4-do-is-usm | sample 7, surface 10 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 1 | PASS: sag.maxScaled 2.23e-16 | PASS: sag.maxScaled 2.48e-16 | PASS: sag.maxScaled 2.48e-16 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 1 | PASS: sag.maxScaled 3.14e-16 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.75e-16 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 1 | PASS: sag.maxScaled 3.14e-16 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.75e-16 |
| canon-rf-800mm-f11-is-stm | 1 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 1.84e-16 | PASS: sag.maxScaled 3.22e-16 |
| canon-rf600mmf11-is-stm | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.09e-16 | PASS: sag.maxScaled 3.13e-16 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.17e-16 | PASS: sag.maxScaled 2.33e-16 |
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
| lv – optiland | rays.compared [rays] | 1718 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.83e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118, surface 10 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.25e-15 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 98 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 2.15e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 82 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1718 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.98e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 6.99e-15 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 55 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 3.93e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 147 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1718 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | PASS: landing.maxDistance 1.97e-13 mm | PASS: landing.maxDistance 1.93e-13 mm | PASS: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | PASS: landing.maxDistance 4.71e-14 mm | PASS: landing.maxDistance 2.05e-14 mm | PASS: landing.maxDistance 5.14e-14 mm | 25 / 488 / 0 | 25 / 488 / 0 | 25 / 488 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | PASS: landing.maxDistance 2.37e-13 mm | PASS: hits.maxDistance 4.83e-13 mm | PASS: hits.maxDistance 4.98e-13 mm | 253 / 260 / 0 | 253 / 260 / 0 | 253 / 260 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | PASS: landing.maxDistance 2.66e-13 mm | PASS: landing.maxDistance 1.76e-13 mm | PASS: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-rf600mmf11-is-stm | 2 | PASS: landing.maxDistance 2.40e-13 mm | PASS: landing.maxDistance 1.88e-13 mm | PASS: landing.maxDistance 2.01e-13 mm | 241 / 272 / 0 | 241 / 272 / 0 | 241 / 272 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | PASS: landing.maxDistance 2.07e-13 mm | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 255 / 258 / 0 | 255 / 258 / 0 | 255 / 258 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | PASS: landing.maxDistance 2.50e-13 mm | PASS: landing.maxDistance 1.52e-13 mm | PASS: landing.maxDistance 1.57e-13 mm | 177 / 336 / 0 | 177 / 336 / 0 | 177 / 336 / 0 |
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
| lv – optiland | rays.compared [rays] | 13355 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 3.69e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 1.18e0, line 0, ray 15 |
| lv – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 1.18e0, line 0 |
| lv – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 3.63e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 13355 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 4.30e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 288 |
| optiland – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.26e-13 | canon-rf-800mm-f11-is-stm | field 9.48e-1, line 0 |
| optiland – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 9.93e-14 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 13355 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 10 | PASS: transverseError.maxAbs 2.86e-13 mm | PASS: transverseError.maxAbs 3.16e-13 mm | PASS: transverseError.maxAbs 2.92e-13 mm | 1676 / 268 / 0 | 1676 / 268 / 0 | 1676 / 268 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 10 | PASS: transverseError.maxAbs 1.60e-13 mm | PASS: transverseError.maxAbs 2.06e-13 mm | PASS: transverseError.maxAbs 2.31e-13 mm | 1772 / 172 / 0 | 1772 / 172 / 0 | 1772 / 172 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 10 | PASS: transverseError.maxAbs 2.57e-13 mm | PASS: transverseError.maxAbs 1.92e-13 mm | PASS: transverseError.maxAbs 2.13e-13 mm | 1607 / 337 / 0 | 1607 / 337 / 0 | 1607 / 337 / 0 |
| canon-rf-800mm-f11-is-stm | 10 | PASS: transverseError.maxAbs 5.19e-13 mm | PASS: transverseError.maxAbs 3.62e-13 mm | PASS: transverseError.maxAbs 3.38e-13 mm | 1781 / 163 / 0 | 1781 / 163 / 0 | 1781 / 163 / 0 |
| canon-rf600mmf11-is-stm | 10 | PASS: transverseError.maxAbs 4.23e-13 mm | PASS: transverseError.maxAbs 2.70e-13 mm | PASS: transverseError.maxAbs 3.16e-13 mm | 1784 / 160 / 0 | 1784 / 160 / 0 | 1784 / 160 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 10 | PASS: transverseError.maxAbs 2.56e-13 mm | PASS: transverseError.maxAbs 2.42e-13 mm | PASS: transverseError.maxAbs 2.50e-13 mm | 1694 / 250 / 0 | 1694 / 250 / 0 | 1694 / 250 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 10 | PASS: transverseError.maxAbs 3.21e-13 mm | PASS: transverseError.maxAbs 2.25e-13 mm | PASS: transverseError.maxAbs 3.46e-13 mm | 1436 / 508 / 0 | 1436 / 508 / 0 | 1436 / 508 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 10 | PASS: transverseError.maxAbs 5.19e-13 mm | PASS: transverseError.maxAbs 3.69e-13 mm | PASS: transverseError.maxAbs 4.30e-13 mm | 1685 / 259 / 0 | 1685 / 259 / 0 | 1685 / 259 / 0 |

## r8a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | intercept.maxScaled (≤ 1.00e-8 mm) | 2.45e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 36 |
| lv – optiland | intercept.maxAbs [mm] | 5.23e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0, ray 6 |
| lv – optiland | focus.maxScaled (≤ 1.00e-8 mm) | 6.50e-14 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – optiland | focus.maxAbs [mm] | 1.65e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – optiland | focusRms.maxAbs (≤ 1.00e-8 mm) | 7.28e-14 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | field 0, line 0 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 508 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 2.11e-13 | canon-ef-400mm-f4-do-is-usm | field 0, line 0, ray 34 |
| lv – ref | intercept.maxAbs [mm] | 5.85e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0, ray 16 |
| lv – ref | focus.maxScaled (≤ 1.00e-8 mm) | 5.15e-14 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – ref | focus.maxAbs [mm] | 1.31e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| lv – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 9.01e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 508 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 3.73e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0, ray 36 |
| optiland – ref | intercept.maxAbs [mm] | 6.14e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0, ray 14 |
| optiland – ref | focus.maxScaled (≤ 1.00e-8 mm) | 1.16e-13 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| optiland – ref | focus.maxAbs [mm] | 2.96e-12 | canon-rf-800mm-f11-is-stm | field 0, line 0 |
| optiland – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 5.64e-14 | nikon-nikkor-z-800mm-f63-vr-s | field 0, line 0 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 508 | — | — |
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
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 3 | PASS: intercept.maxScaled 1.44e-13 mm | PASS: intercept.maxScaled 1.38e-13 mm | PASS: intercept.maxScaled 9.21e-14 mm | 46 / 20 / 0 | 46 / 20 / 0 | 46 / 20 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 3 | PASS: intercept.maxScaled 2.45e-13 mm | PASS: intercept.maxScaled 2.09e-13 mm | PASS: intercept.maxScaled 3.73e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |

## r9a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 2.98e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 18 |
| lv – optiland | distortion.maxScaled (≤ 1.00e-8 mm) | 2.22e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 3 |
| lv – optiland | distortion.maxAbs [percent] | 1.40e-12 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 9 |
| lv – optiland | exitPupil.maxScaled (≤ 1.00e-8 mm) | 1.45e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| lv – optiland | exitPupil.maxAbs [mm] | 9.52e-13 | canon-ef-400mm-f4-do-is-usm | line 0, ray 18 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 1192 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.24e-13 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | line 0, ray 18 |
| lv – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.14e-13 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 30 |
| lv – ref | distortion.maxAbs [percent] | 1.69e-12 | canon-ef-70-300mm-f45-56-do-is-usm-wide | line 0, ray 3 |
| lv – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 6.74e-14 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 18 |
| lv – ref | exitPupil.maxAbs [mm] | 4.55e-13 | nikon-nikkor-z-800mm-f63-vr-s | line 0, ray 6 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1192 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.49e-13 | nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | line 0, ray 18 |
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
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 4 | PASS: landing.maxAbs 1.14e-13 mm | PASS: distortion.maxScaled 8.33e-14 mm | PASS: landing.maxAbs 1.67e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-rf-800mm-f11-is-stm | 4 | PASS: distortion.maxScaled 1.59e-13 mm | PASS: distortion.maxScaled 2.14e-13 mm | PASS: distortion.maxScaled 2.53e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-rf600mmf11-is-stm | 4 | PASS: landing.maxAbs 1.63e-13 mm | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.95e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 4 | PASS: landing.maxAbs 2.06e-13 mm | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.95e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 4 | PASS: landing.maxAbs 2.03e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | PASS: landing.maxAbs 2.49e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 4 | PASS: landing.maxAbs 2.98e-13 mm | PASS: distortion.maxScaled 2.02e-13 mm | PASS: landing.maxAbs 2.31e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

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
| lv – optiland | rays.compared [rays] | 13015 | — | — |
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
| lv – ref | rays.compared [rays] | 13015 | — | — |
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
| optiland – ref | rays.compared [rays] | 13015 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 272 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | PASS: landing.maxAbs 3.51e-13 mm | PASS: landing.maxAbs 2.32e-13 mm | PASS: landing.maxAbs 3.02e-13 mm | 1608 / 228 / 0 | 1608 / 228 / 0 | 1608 / 228 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 2.70e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | 1683 / 153 / 0 | 1683 / 153 / 0 | 1683 / 153 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 2.66e-13 mm | 1555 / 281 / 0 | 1555 / 281 / 0 | 1555 / 281 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | PASS: landing.maxAbs 3.94e-13 mm | PASS: landing.maxAbs 3.61e-13 mm | PASS: landing.maxAbs 3.56e-13 mm | 1701 / 135 / 0 | 1701 / 135 / 0 | 1701 / 135 / 0 |
| canon-rf600mmf11-is-stm | 2 | PASS: landing.maxAbs 3.11e-13 mm | PASS: landing.maxAbs 2.26e-13 mm | PASS: landing.maxAbs 4.30e-13 mm | 1695 / 141 / 0 | 1695 / 141 / 0 | 1695 / 141 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | PASS: landing.maxAbs 2.47e-13 mm | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 2.47e-13 mm | 1609 / 227 / 0 | 1609 / 227 / 0 | 1609 / 227 / 0 |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | 2 | PASS: landing.maxAbs 3.16e-13 mm | PASS: landing.maxAbs 2.86e-13 mm | PASS: landing.maxAbs 4.17e-13 mm | 1518 / 318 / 0 | 1518 / 318 / 0 | 1518 / 318 / 0 |
| nikon-nikkor-z-800mm-f63-vr-s | 2 | PASS: landing.maxAbs 5.04e-13 mm | PASS: landing.maxAbs 4.03e-13 mm | PASS: landing.maxAbs 4.88e-13 mm | 1646 / 190 / 0 | 1646 / 190 / 0 | 1646 / 190 / 0 |
