# Baseline of features

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
| Suite | features |
| Suite hash | dffbfdd11f2bc3e6c9203e4afe99e207eb441a73417d2fd4ba3d1f95e2183b1e |
| Baseline hash | 8df91086e1ee651e4240f6aee760cbbc2d3ebffc8fcc29dfc53d464957e361d2 |
| Contract version | 1.0 |
| Policy | rungs v14 |
| Policy hash | 693c4a981e4c624693b3759c7b7d5d363a09bc00b2c4eeecfc77c3134437e120 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 7b756ee63bd252b76b978a1dbc18185a9c565c118ed662ec694def8ca72c6a56 | 842d3acb45d7d0bb2ac1adec106bd771ec5f68a5b92662bf76dc5cf887e04725 | commit ab0fd4cf94836492b28470953812ed4afc98c0c6, dirty false, engineFileCount 177 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 905727914f01561fe28be507b27f41e38792efa4cbb3d10e3d0c148b2f147015 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | d25c837015c1eddebcb47c6b1c8884452a07829480d52ab0fd1b2bd5b0bafcb6 | 15a954ff46c3b6c4b9f05371470b3b4f35f5edaea95d1a960e8ff021f1f38c07 | sourceFiles 11 |

| Run | Case |
|---|---|
| odd-asphere-ref | d7eaaea7cad5c627b42d9936d1c639ca82a82f9f051ed4e53d4a5053496c8d58 |
| odd-asphere-photopic | d7154b036a5aae7c7ec57ccf159839db4f7314a46399a3977c53708157d50c62 |
| e-line-ref | a1f5acdf3680b184ce4239f5f983c74d733ed1673c4df2a378d1f1a399b222e1 |
| e-line-photopic | 776244eced3709e34b3a8f6c152b34fa51cd85733f55829a3aca1b50794cfb00 |
| asphere-a20-ref | 60215f518c4675590e72fc4e5bec2de0e0676aacb05347f7b09134b987cffdc4 |
| asphere-a20-photopic | 6610f3acf1dd639a6caacd0296a222d175a0aa5b57946549dfdde60c8481da04 |
| flat-base-asphere-ref | 8a75c7bd1159c6a16fde8b0ed9efd02b601a739677890d94c710fd2c3aeddcdf |
| flat-base-asphere-photopic | 63332eacb501d1dab391f7b19f5da4697042781b9445c0659c0e65d1bcbcb02f |
| rear-plate-rim-ref | 97fe62cbb976f1283ff01ac56aaf75d4da428861ba839a0e85616c051a425863 |
| rear-plate-rim-photopic | d46065ab3b1323c5485c19053d6d972022ae4c0cf1ea58fb2f5a06fecde50ef2 |
| fixed-iris-zoom-ref-wide | 46a897db7b98594adf12164e7e508db180cefa7eea01185d456041360e0055a9 |
| fixed-iris-zoom-ref-tele | 1c6120c0e785476474203dd887268ef64d9173bc7aaa4ffc5e116d517c14f5cf |
| fixed-iris-zoom-photopic-wide | cb63cfac23b97c309c2892ddaa5b88184f1cc72f317d215563a13dce03a93ea6 |
| fixed-iris-zoom-photopic-tele | ba53849804b684d1eb6181ff4e8fa79dec012ea950bfffbf261cf35bc8326c35 |
| zero-asphere-ref | 76be6f3124212a291325e0b41c2036523a6ba06daa031878b272f86b769664f0 |
| zero-asphere-photopic | cffd3246c128549c906a9b974c792ad4823f92355e31478ed3ef9385f9c90a79 |
| stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a |
| stop-inside-element-photopic | f8181409b90487e9e7a2dd156ecc9ec1d021232fbd2a806a52ab5cefaff96377 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 18 | 18 | lv – optiland | 18 PASS | 18 PASS |
| r0 | system.describe | 18 | 18 | lv – ref | 18 PASS | 18 PASS |
| r0 | system.describe | 18 | 18 | optiland – ref | 18 PASS | 18 PASS |
| r1 | paraxial.first-order | 18 | 18 | lv – optiland | 18 PASS | 18 PASS |
| r1 | paraxial.first-order | 18 | 18 | lv – ref | 18 PASS | 18 PASS |
| r1 | paraxial.first-order | 18 | 18 | optiland – ref | 18 PASS | 18 PASS |
| r2 | rays.trace | 18 | 162 | lv – optiland | 18 PASS | 162 PASS |
| r2 | rays.trace | 18 | 162 | lv – ref | 18 PASS | 162 PASS |
| r2 | rays.trace | 18 | 162 | optiland – ref | 18 PASS | 162 PASS |
| r3 | rays.trace | 18 | 162 | lv – optiland | 18 PASS | 162 PASS |
| r3 | rays.trace | 18 | 162 | lv – ref | 18 PASS | 162 PASS |
| r3 | rays.trace | 18 | 162 | optiland – ref | 18 PASS | 162 PASS |
| r4 | rays.trace | 18 | 54 | lv – optiland | 18 PASS | 54 PASS |
| r4 | rays.trace | 18 | 54 | lv – ref | 18 PASS | 54 PASS |
| r4 | rays.trace | 18 | 54 | optiland – ref | 18 PASS | 54 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 18 ok |
| r0 | optiland | 18 ok |
| r0 | ref | 18 ok |
| r1 | lv | 18 ok |
| r1 | optiland | 18 ok |
| r1 | ref | 18 ok |
| r2 | lv | 18 ok |
| r2 | optiland | 18 ok |
| r2 | ref | 18 ok |
| r3 | lv | 18 ok |
| r3 | optiland | 18 ok |
| r3 | ref | 18 ok |
| r4 | lv | 18 ok |
| r4 | optiland | 18 ok |
| r4 | ref | 18 ok |

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 3.34e-16 | odd-asphere-ref | sample 5, surface 3 |
| lv – optiland | sag.maxAbs [mm] | 4.44e-15 | stop-inside-element-ref | sample 8, surface 6 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 2.69e-16 | odd-asphere-ref | sample 8, surface 1 |
| lv – ref | sag.maxAbs [mm] | 3.55e-15 | zero-asphere-ref | sample 8, surface 1 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 3.33e-16 | asphere-a20-ref | sample 6, surface 5 |
| optiland – ref | sag.maxAbs [mm] | 4.44e-15 | stop-inside-element-ref | sample 8, surface 6 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 1 | PASS: sag.maxScaled 3.34e-16 | PASS: sag.maxScaled 2.69e-16 | PASS: sag.maxScaled 2.69e-16 |
| odd-asphere-photopic | 1 | PASS: sag.maxScaled 3.34e-16 | PASS: sag.maxScaled 2.69e-16 | PASS: sag.maxScaled 2.69e-16 |
| e-line-ref | 1 | PASS: sag.maxScaled 1.70e-16 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 1.95e-16 |
| e-line-photopic | 1 | PASS: sag.maxScaled 1.70e-16 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 1.95e-16 |
| asphere-a20-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.33e-16 |
| asphere-a20-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.33e-16 |
| flat-base-asphere-ref | 1 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 2.53e-16 | PASS: sag.maxScaled 2.56e-16 |
| flat-base-asphere-photopic | 1 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 2.53e-16 | PASS: sag.maxScaled 2.56e-16 |
| rear-plate-rim-ref | 1 | PASS: sag.maxScaled 2.03e-16 | PASS: sag.maxScaled 1.90e-16 | PASS: sag.maxScaled 3.11e-16 |
| rear-plate-rim-photopic | 1 | PASS: sag.maxScaled 2.03e-16 | PASS: sag.maxScaled 1.90e-16 | PASS: sag.maxScaled 3.11e-16 |
| fixed-iris-zoom-ref-wide | 1 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.38e-16 | PASS: sag.maxScaled 2.38e-16 |
| fixed-iris-zoom-ref-tele | 1 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.38e-16 | PASS: sag.maxScaled 2.38e-16 |
| fixed-iris-zoom-photopic-wide | 1 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.38e-16 | PASS: sag.maxScaled 2.38e-16 |
| fixed-iris-zoom-photopic-tele | 1 | PASS: sag.maxScaled 2.30e-16 | PASS: sag.maxScaled 2.38e-16 | PASS: sag.maxScaled 2.38e-16 |
| zero-asphere-ref | 1 | PASS: sag.maxScaled 2.06e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.78e-16 |
| zero-asphere-photopic | 1 | PASS: sag.maxScaled 2.06e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.78e-16 |
| stop-inside-element-ref | 1 | PASS: sag.maxScaled 1.66e-16 | PASS: sag.maxScaled 2.37e-16 | PASS: sag.maxScaled 3.17e-16 |
| stop-inside-element-photopic | 1 | PASS: sag.maxScaled 1.66e-16 | PASS: sag.maxScaled 2.37e-16 | PASS: sag.maxScaled 3.17e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | firstOrder.maxAbs (≤ 1.00e-9 mm) | 6.04e-14 | odd-asphere-photopic | line 0, quantity frontFocalZ |
| lv – optiland | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.14e-13 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| lv – optiland | pupilZ.maxAbs [mm] | 1.14e-13 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 7.11e-15 | odd-asphere-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 7.11e-15 | odd-asphere-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 5.33e-14 | odd-asphere-photopic | line 3, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 7.11e-15 | e-line-photopic | line 3, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 7.11e-15 | e-line-photopic | line 3, quantity entrancePupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 4.97e-14 | odd-asphere-photopic | line 1, quantity frontPrincipalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 9.95e-14 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 9.95e-14 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.77e-15 | fixed-iris-zoom-photopic-tele | line 1, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 9.77e-15 | fixed-iris-zoom-photopic-tele | line 1, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 1 | PASS: pupilZ.maxScaled 3.20e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: pupilZ.maxScaled 4.62e-14 mm |
| odd-asphere-photopic | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm | PASS: firstOrder.maxAbs 4.97e-14 mm |
| e-line-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| e-line-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| asphere-a20-ref | 1 | PASS: pupilZ.maxScaled 2.13e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| asphere-a20-photopic | 1 | PASS: pupilZ.maxScaled 1.78e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| flat-base-asphere-ref | 1 | PASS: firstOrder.maxAbs 8.88e-15 mm | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| flat-base-asphere-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| rear-plate-rim-ref | 1 | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| rear-plate-rim-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm |
| fixed-iris-zoom-ref-wide | 1 | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 3.55e-15 mm |
| fixed-iris-zoom-ref-tele | 1 | PASS: pupilZ.maxScaled 5.68e-14 mm | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm |
| fixed-iris-zoom-photopic-wide | 1 | PASS: pupilZ.maxScaled 1.78e-14 mm | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm |
| fixed-iris-zoom-photopic-tele | 1 | PASS: pupilZ.maxScaled 1.14e-13 mm | PASS: pupilZ.maxScaled 8.53e-14 mm | PASS: pupilZ.maxScaled 9.95e-14 mm |
| zero-asphere-ref | 1 | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| zero-asphere-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm |
| stop-inside-element-ref | 1 | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 3.55e-15 mm |
| stop-inside-element-photopic | 1 | PASS: firstOrder.maxAbs 1.24e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 1.12e-12 | rear-plate-rim-photopic | field 3.29e1, line 2, ray 360, surface 10 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 1.26e-14 | flat-base-asphere-photopic | field 0, line 1, ray 197 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 4.12e-13 | asphere-a20-ref | field 4.06e1, line 0, ray 588 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 104846 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.07e-12 | asphere-a20-photopic | field 2.42e1, line 2, ray 970, surface 13 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.33e-14 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 0, ray 539 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 5.73e-13 | rear-plate-rim-photopic | field 1.77e1, line 2, ray 615 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 104846 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.11e-12 | rear-plate-rim-photopic | field 3.29e1, line 2, ray 360, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 1.32e-14 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 2, ray 736 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 6.15e-13 | rear-plate-rim-photopic | field 1.77e1, line 4, ray 615 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 104846 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: hits.maxDistance 8.17e-13 mm | PASS: hits.maxDistance 8.61e-13 mm | PASS: hits.maxDistance 8.59e-13 mm | 1763 / 1414 / 0 | 1763 / 1414 / 0 | 1763 / 1414 / 0 |
| odd-asphere-photopic | 15 | PASS: hits.maxDistance 8.31e-13 mm | PASS: hits.maxDistance 9.43e-13 mm | PASS: hits.maxDistance 9.42e-13 mm | 8815 / 7070 / 0 | 8815 / 7070 / 0 | 8815 / 7070 / 0 |
| e-line-ref | 3 | PASS: landing.maxDistance 6.22e-14 mm | PASS: landing.maxDistance 4.73e-14 mm | PASS: landing.maxDistance 7.11e-14 mm | 1931 / 1508 / 0 | 1931 / 1508 / 0 | 1931 / 1508 / 0 |
| e-line-photopic | 15 | PASS: hits.maxDistance 7.96e-14 mm | PASS: landing.maxDistance 6.88e-14 mm | PASS: landing.maxDistance 8.54e-14 mm | 9667 / 7528 / 0 | 9667 / 7528 / 0 | 9667 / 7528 / 0 |
| asphere-a20-ref | 3 | PASS: hits.maxDistance 9.34e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 1879 / 1292 / 0 | 1879 / 1292 / 0 | 1879 / 1292 / 0 |
| asphere-a20-photopic | 15 | PASS: landing.maxDistance 1.45e-13 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 9397 / 6458 / 0 | 9397 / 6458 / 0 | 9397 / 6458 / 0 |
| flat-base-asphere-ref | 3 | PASS: hits.maxDistance 7.49e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 1789 / 1448 / 0 | 1789 / 1448 / 0 | 1789 / 1448 / 0 |
| flat-base-asphere-photopic | 15 | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 8953 / 7232 / 0 | 8953 / 7232 / 0 | 8953 / 7232 / 0 |
| rear-plate-rim-ref | 3 | PASS: landing.maxDistance 1.30e-13 mm | PASS: hits.maxDistance 9.88e-13 mm | PASS: hits.maxDistance 9.76e-13 mm | 1715 / 1462 / 0 | 1715 / 1462 / 0 | 1715 / 1462 / 0 |
| rear-plate-rim-photopic | 15 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 8577 / 7308 / 0 | 8577 / 7308 / 0 | 8577 / 7308 / 0 |
| fixed-iris-zoom-ref-wide | 3 | PASS: landing.maxDistance 3.23e-14 mm | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 9.97e-13 mm | 2128 / 1675 / 0 | 2128 / 1675 / 0 | 2128 / 1675 / 0 |
| fixed-iris-zoom-ref-tele | 3 | PASS: hits.maxDistance 5.10e-14 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2179 / 1352 / 0 | 2179 / 1352 / 0 | 2179 / 1352 / 0 |
| fixed-iris-zoom-photopic-wide | 15 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 10666 / 8349 / 0 | 10666 / 8349 / 0 | 10666 / 8349 / 0 |
| fixed-iris-zoom-photopic-tele | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.96e-13 mm | 10877 / 6778 / 0 | 10877 / 6778 / 0 | 10877 / 6778 / 0 |
| zero-asphere-ref | 3 | PASS: hits.maxDistance 1.43e-13 mm | PASS: hits.maxDistance 1.22e-13 mm | PASS: hits.maxDistance 1.50e-13 mm | 2073 / 1864 / 0 | 2073 / 1864 / 0 | 2073 / 1864 / 0 |
| zero-asphere-photopic | 15 | PASS: hits.maxDistance 1.44e-13 mm | PASS: hits.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 1.46e-13 mm | 9809 / 9476 / 0 | 9809 / 9476 / 0 | 9809 / 9476 / 0 |
| stop-inside-element-ref | 3 | PASS: landing.maxDistance 2.38e-13 mm | PASS: landing.maxDistance 8.53e-14 mm | PASS: landing.maxDistance 2.31e-13 mm | 2105 / 1410 / 0 | 2105 / 1410 / 0 | 2105 / 1410 / 0 |
| stop-inside-element-photopic | 15 | PASS: landing.maxDistance 3.73e-13 mm | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 3.02e-13 mm | 10523 / 7052 / 0 | 10523 / 7052 / 0 | 10523 / 7052 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.02e-9 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 1, ray 899 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 1.54e-9 | flat-base-asphere-photopic | field 0, line 1, ray 197 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 1.54e-9 | flat-base-asphere-photopic | field 0, line 1, ray 197 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.05e-9 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 1, ray 970 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.11e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 878 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.39e-9 | rear-plate-rim-photopic | field 1.77e1, line 1, ray 399 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.02e-9 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 1, ray 989 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.08e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 878 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.39e-9 | rear-plate-rim-photopic | field 1.77e1, line 1, ray 399 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opticalPathToImage.maxAbs 1.55e-9 waves |
| odd-asphere-photopic | 15 | PASS: opticalPath.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.94e-9 waves |
| e-line-ref | 3 | PASS: opticalPathToImage.maxAbs 1.04e-10 waves | PASS: opd.maxAbs 7.81e-11 waves | PASS: opticalPathToImage.maxAbs 1.04e-10 waves |
| e-line-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.21e-10 waves | PASS: opticalPathToImage.maxAbs 9.07e-11 waves | PASS: opticalPathToImage.maxAbs 1.21e-10 waves |
| asphere-a20-ref | 3 | PASS: opticalPath.maxAbs 1.23e-9 waves | PASS: opticalPathToImage.maxAbs 2.39e-9 waves | PASS: opticalPathToImage.maxAbs 2.39e-9 waves |
| asphere-a20-photopic | 15 | PASS: opd.maxAbs 3.02e-10 waves | PASS: opticalPathToImage.maxAbs 3.11e-9 waves | PASS: opd.maxAbs 3.11e-9 waves |
| flat-base-asphere-ref | 3 | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opticalPath.maxAbs 1.31e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| flat-base-asphere-photopic | 15 | PASS: opticalPath.maxAbs 1.54e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opticalPath.maxAbs 1.66e-9 waves |
| rear-plate-rim-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.56e-9 waves | PASS: opd.maxAbs 2.56e-9 waves |
| rear-plate-rim-photopic | 15 | PASS: opticalPath.maxAbs 1.50e-9 waves | PASS: opd.maxAbs 3.39e-9 waves | PASS: opd.maxAbs 3.39e-9 waves |
| fixed-iris-zoom-ref-wide | 3 | PASS: opticalPathToImage.maxAbs 1.45e-10 waves | PASS: opticalPath.maxAbs 2.49e-9 waves | PASS: opticalPath.maxAbs 2.49e-9 waves |
| fixed-iris-zoom-ref-tele | 3 | PASS: opticalPathToImage.maxAbs 9.67e-11 waves | PASS: opticalPath.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 1.43e-9 waves |
| fixed-iris-zoom-photopic-wide | 15 | PASS: opticalPath.maxAbs 3.02e-9 waves | PASS: opticalPath.maxAbs 3.05e-9 waves | PASS: opticalPath.maxAbs 3.02e-9 waves |
| fixed-iris-zoom-photopic-tele | 15 | PASS: opticalPath.maxAbs 1.15e-9 waves | PASS: opticalPath.maxAbs 1.66e-9 waves | PASS: opticalPath.maxAbs 1.66e-9 waves |
| zero-asphere-ref | 3 | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 3.87e-10 waves |
| zero-asphere-photopic | 15 | PASS: opd.maxAbs 5.59e-10 waves | PASS: opticalPath.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 5.12e-10 waves |
| stop-inside-element-ref | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.69e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| stop-inside-element-photopic | 15 | PASS: opticalPathToImage.maxAbs 6.97e-10 waves | PASS: opticalPathToImage.maxAbs 1.81e-10 waves | PASS: opticalPathToImage.maxAbs 5.57e-10 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 2.93e-12 | stop-inside-element-ref | cut tangential, field 5.53e1, frequencyPerMm 76 |
| lv – optiland | rays.compared [rays] | 104846 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | odd-asphere-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 6.79e-12 | flat-base-asphere-photopic | cut sagittal, field 1.71e1, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 104846 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | odd-asphere-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 6.42e-12 | asphere-a20-photopic | cut tangential, field 4.06e1, frequencyPerMm 96 |
| optiland – ref | rays.compared [rays] | 104846 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: mtf.maxAbs 9.94e-13 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 1.39e-12 |
| odd-asphere-photopic | 3 | PASS: mtf.maxAbs 8.73e-13 | PASS: mtf.maxAbs 1.25e-12 | PASS: mtf.maxAbs 1.34e-12 |
| e-line-ref | 3 | PASS: mtf.maxAbs 6.50e-13 | PASS: mtf.maxAbs 4.21e-13 | PASS: mtf.maxAbs 5.31e-13 |
| e-line-photopic | 3 | PASS: mtf.maxAbs 4.86e-13 | PASS: mtf.maxAbs 4.50e-13 | PASS: mtf.maxAbs 3.41e-13 |
| asphere-a20-ref | 3 | PASS: mtf.maxAbs 1.06e-12 | PASS: mtf.maxAbs 4.81e-12 | PASS: mtf.maxAbs 5.73e-12 |
| asphere-a20-photopic | 3 | PASS: mtf.maxAbs 2.08e-12 | PASS: mtf.maxAbs 4.67e-12 | PASS: mtf.maxAbs 6.42e-12 |
| flat-base-asphere-ref | 3 | PASS: mtf.maxAbs 2.58e-12 | PASS: mtf.maxAbs 6.65e-12 | PASS: mtf.maxAbs 6.17e-12 |
| flat-base-asphere-photopic | 3 | PASS: mtf.maxAbs 1.84e-12 | PASS: mtf.maxAbs 6.79e-12 | PASS: mtf.maxAbs 6.01e-12 |
| rear-plate-rim-ref | 3 | PASS: mtf.maxAbs 1.08e-12 | PASS: mtf.maxAbs 3.62e-12 | PASS: mtf.maxAbs 3.84e-12 |
| rear-plate-rim-photopic | 3 | PASS: mtf.maxAbs 5.48e-13 | PASS: mtf.maxAbs 4.09e-12 | PASS: mtf.maxAbs 4.29e-12 |
| fixed-iris-zoom-ref-wide | 3 | PASS: mtf.maxAbs 3.12e-13 | PASS: mtf.maxAbs 3.73e-12 | PASS: mtf.maxAbs 3.52e-12 |
| fixed-iris-zoom-ref-tele | 3 | PASS: mtf.maxAbs 3.68e-13 | PASS: mtf.maxAbs 8.41e-13 | PASS: mtf.maxAbs 1.06e-12 |
| fixed-iris-zoom-photopic-wide | 3 | PASS: mtf.maxAbs 2.50e-13 | PASS: mtf.maxAbs 1.97e-12 | PASS: mtf.maxAbs 2.14e-12 |
| fixed-iris-zoom-photopic-tele | 3 | PASS: mtf.maxAbs 2.66e-13 | PASS: mtf.maxAbs 9.29e-13 | PASS: mtf.maxAbs 1.01e-12 |
| zero-asphere-ref | 3 | PASS: mtf.maxAbs 7.59e-13 | PASS: mtf.maxAbs 4.62e-13 | PASS: mtf.maxAbs 6.03e-13 |
| zero-asphere-photopic | 3 | PASS: mtf.maxAbs 3.55e-13 | PASS: mtf.maxAbs 1.51e-13 | PASS: mtf.maxAbs 2.94e-13 |
| stop-inside-element-ref | 3 | PASS: mtf.maxAbs 2.93e-12 | PASS: mtf.maxAbs 5.83e-13 | PASS: mtf.maxAbs 2.99e-12 |
| stop-inside-element-photopic | 3 | PASS: mtf.maxAbs 1.27e-12 | PASS: mtf.maxAbs 3.69e-13 | PASS: mtf.maxAbs 1.21e-12 |
