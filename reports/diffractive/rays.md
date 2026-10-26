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
| Baseline hash | 3e58493a8b111a4a91875c23e3bbe095ebcf4c04ff0e87359b887954062298c8 |
| Contract version | 1.0 |
| Policy | rungs v15 |
| Policy hash | 1db393cc152dc19e71ca79b07f474d3a837fa402f51632312a6fc5cbeb671524 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | c46cbf114de40a8df78d7a9fc63a54e47bd2d05d4185afdd9962742ed563878b | 49b68a617dc135ebdd70d5ff57dc2bce7f09ea74668dd1848e7d973bbcfac0b3 | commit 879c061024519be2b1acaf3cc082947235ea9760, dirty false, engineFileCount 177 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 965e1b3ac30f08fd7d583547cbdc43ccbfd9cf74f6e6bc7cd6af2a98927ca7e7 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | sourceFiles 13 |

| Run | Case |
|---|---|
| canon-ef-400mm-f4-do-is-usm | 96325a6df5e2e5b9c38d490eb46125581c62e382b8cb066ab92e0ef435f42a62 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | fe08a6dece72e6929f4b7986075453ce68dbcf012f1dc49772660b0a51b96ad3 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 3f999377c681817c44e19c81115ce5f57655615ce482aef22b726758a16fedb4 |
| canon-rf-800mm-f11-is-stm | b63c07a15e9fdcb607f8718f678f9e3631616c8ffc5305fad1466048ff556627 |
| canon-rf600mmf11-is-stm | 34859d874485e9cc85261e1e97c810d087006b3e066c946eb915154d079ea4b4 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 767018dd3ef5c4264a600ba12193142fbd76af2d49d1bf332b2cb19a57bccbbd |
| nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | cf3a028f1127a5495431edabe9af36e1f6c55ee3cdbd503af8ff8d9b3b0eb828 |
| nikon-nikkor-z-800mm-f63-vr-s | e4d8e5c6357c2c981a0c16e96470c979728144850b771ead3536930f363a937c |
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
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.95e-14 | canon-ef-400mm-f4-do-is-usm | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 9.95e-14 | canon-ef-400mm-f4-do-is-usm | line 0, quantity entrancePupilSemiDiameter |

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
| lv – optiland | rays.compared [rays] | 1760 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.83e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118, surface 10 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.25e-15 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 98 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 2.15e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 82 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1760 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.98e-13 | canon-ef-70-300mm-f45-56-do-is-usm-tele | field 2.50e-1, line 0, ray 118, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 6.99e-15 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 55 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 3.93e-13 | nikon-nikkor-z-800mm-f63-vr-s | field 2.50e-1, line 0, ray 147 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1760 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-400mm-f4-do-is-usm | 2 | PASS: landing.maxDistance 1.97e-13 mm | PASS: landing.maxDistance 1.93e-13 mm | PASS: landing.maxDistance 3.08e-13 mm | 239 / 274 / 0 | 239 / 274 / 0 | 239 / 274 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-wide | 2 | PASS: landing.maxDistance 4.71e-14 mm | PASS: landing.maxDistance 2.05e-14 mm | PASS: landing.maxDistance 5.14e-14 mm | 25 / 488 / 0 | 25 / 488 / 0 | 25 / 488 / 0 |
| canon-ef-70-300mm-f45-56-do-is-usm-tele | 2 | PASS: landing.maxDistance 2.45e-13 mm | PASS: hits.maxDistance 4.83e-13 mm | PASS: hits.maxDistance 4.98e-13 mm | 271 / 242 / 0 | 271 / 242 / 0 | 271 / 242 / 0 |
| canon-rf-800mm-f11-is-stm | 2 | PASS: landing.maxDistance 2.66e-13 mm | PASS: landing.maxDistance 1.76e-13 mm | PASS: landing.maxDistance 3.08e-13 mm | 237 / 276 / 0 | 237 / 276 / 0 | 237 / 276 / 0 |
| canon-rf600mmf11-is-stm | 2 | PASS: landing.maxDistance 2.40e-13 mm | PASS: landing.maxDistance 1.88e-13 mm | PASS: landing.maxDistance 2.01e-13 mm | 241 / 272 / 0 | 241 / 272 / 0 | 241 / 272 / 0 |
| nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 2 | PASS: landing.maxDistance 2.07e-13 mm | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 277 / 236 / 0 | 277 / 236 / 0 | 277 / 236 / 0 |
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
