# Baseline of folded

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
| Suite | folded |
| Suite hash | f3d1c308f58ee05d6970be5e8be8730aea6a15759ede73ab439b59adfc5a6455 |
| Baseline hash | ad33cea5adb5b98d41aac21692f6414205f5b915f1327d07960203d1029bddf1 |
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

## Run problems

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

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 8 | 8 | lv – optiland | 8 PASS | 8 PASS |
| r0 | system.describe | 8 | 8 | lv – ref | 8 PASS | 8 PASS |
| r0 | system.describe | 8 | 8 | optiland – ref | 8 PASS | 8 PASS |
| r1 | paraxial.first-order | 8 | 8 | lv – optiland | 1 PASS, 7 UNSUPPORTED | 1 PASS, 7 UNSUPPORTED |
| r1 | paraxial.first-order | 8 | 8 | lv – ref | 1 PASS, 7 UNSUPPORTED | 1 PASS, 7 UNSUPPORTED |
| r1 | paraxial.first-order | 8 | 8 | optiland – ref | 7 PASS, 1 UNSUPPORTED | 7 PASS, 1 UNSUPPORTED |
| r2 | rays.trace | 8 | 16 | lv – optiland | 8 PASS | 16 PASS |
| r2 | rays.trace | 8 | 16 | lv – ref | 8 PASS | 16 PASS |
| r2 | rays.trace | 8 | 16 | optiland – ref | 8 PASS | 16 PASS |
| r3 | rays.trace | 8 | 16 | lv – optiland | 8 UNSUPPORTED | 16 UNSUPPORTED |
| r3 | rays.trace | 8 | 16 | lv – ref | 8 UNSUPPORTED | 16 UNSUPPORTED |
| r3 | rays.trace | 8 | 16 | optiland – ref | 8 PASS | 16 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 8 ok |
| r0 | optiland | 8 ok |
| r0 | ref | 8 ok |
| r1 | lv | 1 ok, 7 unsupported (feature folded-stop-not-visited; feature lv-folded-first-order-unavailable) |
| r1 | optiland | 7 ok, 1 unsupported (feature folded-stop-not-visited) |
| r1 | ref | 7 ok, 1 unsupported (feature folded-stop-not-visited) |
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
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 3.10e-16 | reference-mangin-second-surface-mirror | sample 8, surface 2 |
| lv – optiland | sag.maxAbs [mm] | 8.88e-16 | minolta-af-reflex-500mm-f8 | sample 8, surface 9 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 2.15e-16 | minolta-af-reflex-500mm-f8 | sample 6, surface 10 |
| lv – ref | sag.maxAbs [mm] | 8.88e-16 | nikon-reflex-nikkor-500mm-f8-new | sample 8, surface 7 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 3.10e-16 | reference-mangin-second-surface-mirror | sample 8, surface 2 |
| optiland – ref | sag.maxAbs [mm] | 8.88e-16 | minolta-af-reflex-500mm-f8 | sample 8, surface 9 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 1 | PASS: sag.maxScaled 2.03e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 2.15e-16 |
| nikon-reflex-nikkor-1000mm-f11 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.01e-16 | PASS: sag.maxScaled 2.01e-16 |
| nikon-reflex-nikkor-500mm-f8-new | 1 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 2.12e-16 | PASS: sag.maxScaled 2.67e-16 |
| nikon-reflex-nikkor-c-500mm-f8 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 1.66e-16 | PASS: sag.maxScaled 2.22e-16 |
| reference-annular-obscured-mirror | 1 | PASS: sag.maxScaled 1.74e-16 | PASS: layout.mismatches 0 elements | PASS: sag.maxScaled 1.74e-16 |
| reference-gregorian-secondary | 1 | PASS: sag.maxScaled 1.22e-16 | PASS: sag.maxScaled 1.11e-16 | PASS: sag.maxScaled 1.22e-16 |
| reference-mangin-second-surface-mirror | 1 | PASS: sag.maxScaled 3.10e-16 | PASS: layout.mismatches 0 elements | PASS: sag.maxScaled 3.10e-16 |
| reference-spherical-primary-mirror | 1 | PASS: sag.maxScaled 1.74e-16 | PASS: layout.mismatches 0 elements | PASS: sag.maxScaled 1.74e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | firstOrder.maxAbs (≤ 1.00e-9 mm) | 0 | reference-spherical-primary-mirror | line 0, quantity efl |
| lv – optiland | pupilZ.maxScaled (≤ 1.00e-9 mm) | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – optiland | pupilZ.maxAbs [mm] | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.08e-15 | reference-spherical-primary-mirror | line 0, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 0 | reference-spherical-primary-mirror | line 0, quantity entrancePupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 1.00e-11 | nikon-reflex-nikkor-c-500mm-f8 | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 5.68e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 5.68e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 1.42e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 1.42e-14 | reference-mangin-second-surface-mirror | line 0, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 1 | UNSUPPORTED | UNSUPPORTED | PASS: firstOrder.maxAbs 1.36e-12 mm |
| nikon-reflex-nikkor-1000mm-f11 | 1 | UNSUPPORTED | UNSUPPORTED | PASS: firstOrder.maxAbs 5.46e-12 mm |
| nikon-reflex-nikkor-500mm-f8-new | 1 | UNSUPPORTED | UNSUPPORTED | PASS: firstOrder.maxAbs 6.14e-12 mm |
| nikon-reflex-nikkor-c-500mm-f8 | 1 | UNSUPPORTED | UNSUPPORTED | PASS: firstOrder.maxAbs 1.00e-11 mm |
| reference-annular-obscured-mirror | 1 | UNSUPPORTED | UNSUPPORTED | PASS: firstOrder.maxAbs 3.47e-15 mm |
| reference-gregorian-secondary | 1 | UNSUPPORTED | UNSUPPORTED | UNSUPPORTED |
| reference-mangin-second-surface-mirror | 1 | UNSUPPORTED | UNSUPPORTED | PASS: pupilZ.maxScaled 5.68e-14 mm |
| reference-spherical-primary-mirror | 1 | PASS: firstOrder.maxAbs 0 mm | PASS: firstOrder.maxAbs 2.08e-15 mm | PASS: firstOrder.maxAbs 2.08e-15 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 9.50e-14 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1, line 0, ray 230, surface 13 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 4.00e-15 | nikon-reflex-nikkor-500mm-f8-new | field 2.50e-1, line 0, ray 54 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 1.86e-13 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1, line 0, ray 230 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 1976 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 9.08e-14 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1, line 0, ray 195, surface 13 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.30e-15 | nikon-reflex-nikkor-500mm-f8-new | field 2.50e-1, line 0, ray 22 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.75e-13 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1, line 0, ray 195 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1976 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.19e-13 | minolta-af-reflex-500mm-f8 | field 2.50e-1, line 0, ray 113, surface 17 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 4.11e-15 | nikon-reflex-nikkor-500mm-f8-new | field 2.50e-1, line 0, ray 54 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 2.27e-13 | minolta-af-reflex-500mm-f8 | field 2.50e-1, line 0, ray 231 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1976 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 2 | PASS: landing.maxDistance 1.74e-13 mm | PASS: landing.maxDistance 1.39e-13 mm | PASS: landing.maxDistance 2.27e-13 mm | 264 / 209 / 40 | 264 / 249 / 0 | 264 / 249 / 0 |
| nikon-reflex-nikkor-1000mm-f11 | 2 | PASS: landing.maxDistance 1.86e-13 mm | PASS: landing.maxDistance 1.75e-13 mm | PASS: landing.maxDistance 1.90e-13 mm | 268 / 233 / 12 | 268 / 245 / 0 | 268 / 245 / 0 |
| nikon-reflex-nikkor-500mm-f8-new | 2 | PASS: landing.maxDistance 1.68e-13 mm | PASS: landing.maxDistance 1.52e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 224 / 289 / 0 | 224 / 289 / 0 | 224 / 289 / 0 |
| nikon-reflex-nikkor-c-500mm-f8 | 2 | PASS: landing.maxDistance 1.17e-13 mm | PASS: landing.maxDistance 8.18e-14 mm | PASS: landing.maxDistance 1.31e-13 mm | 220 / 289 / 4 | 220 / 293 / 0 | 220 / 293 / 0 |
| reference-annular-obscured-mirror | 2 | PASS: hits.maxDistance 2.86e-14 mm | PASS: hits.maxDistance 2.86e-14 mm | PASS: landing.maxDistance 1.83e-14 mm | 316 / 197 / 0 | 316 / 197 / 0 | 316 / 197 / 0 |
| reference-gregorian-secondary | 2 | PASS: landing.maxDistance 2.39e-14 mm | PASS: landing.maxDistance 2.15e-14 mm | PASS: landing.maxDistance 1.99e-14 mm | 34 / 448 / 31 | 34 / 479 / 0 | 34 / 479 / 0 |
| reference-mangin-second-surface-mirror | 2 | PASS: landing.maxDistance 3.27e-14 mm | PASS: landing.maxDistance 1.51e-14 mm | PASS: landing.maxDistance 3.76e-14 mm | 325 / 188 / 0 | 325 / 188 / 0 | 325 / 188 / 0 |
| reference-spherical-primary-mirror | 2 | PASS: hits.maxDistance 2.85e-14 mm | PASS: landing.maxDistance 1.79e-14 mm | PASS: hits.maxDistance 2.84e-14 mm | 325 / 188 / 0 | 325 / 188 / 0 | 325 / 188 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 5.80e-10 | nikon-reflex-nikkor-1000mm-f11 | field 2.50e-1, line 0, ray 83 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.87e-10 | nikon-reflex-nikkor-1000mm-f11 | field 0, line 0, ray 71 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 1.45e-10 | reference-spherical-primary-mirror | field 0, line 0, ray 103 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| minolta-af-reflex-500mm-f8 | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| nikon-reflex-nikkor-1000mm-f11 | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPath.maxAbs 5.80e-10 waves |
| nikon-reflex-nikkor-500mm-f8-new | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| nikon-reflex-nikkor-c-500mm-f8 | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| reference-annular-obscured-mirror | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPathToImage.maxAbs 9.67e-11 waves |
| reference-gregorian-secondary | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPath.maxAbs 9.67e-11 waves |
| reference-mangin-second-surface-mirror | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPath.maxAbs 9.67e-11 waves |
| reference-spherical-primary-mirror | 2 | UNSUPPORTED | UNSUPPORTED | PASS: opticalPathToImage.maxAbs 1.45e-10 waves |
