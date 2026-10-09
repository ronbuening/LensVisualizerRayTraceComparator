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
| Baseline hash | c2dea755cec5f87b42098577eb7493ecc86145830979da0a8cec50d659c955ea |
| Contract version | 1.0 |
| Policy | rungs v5 |
| Policy hash | a8f4e2615c842b14d14a4c49fe35c44ad6afdcece70151894393b84e2a79207c |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | 2efc32aeb7dbe2cd49ff21ac914be6ba22902b693cfdb581dd01c4de171c1cab | commit c05a2ab75b4aa5bcd8563a46e5c5a21a5d7f99a5, dirty false, engineFileCount 151 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 81fae6bce47637151e2c76ce9558c03cc7cc0153ba60ff68720656f018b90480 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | 149b5767ccdc11aa92a72f44fd4bdc9be81c59b6c22fa79b08cdddc7646b8655 | 80c13cacede1a68a60ac3576520818be5465c216290f4f966aea7fd803ea09c1 | sourceFiles 12 |

| Run | Case |
|---|---|
| odd-asphere-ref | baa73c60b06c75f8f6d76013761a35a0daa6950e75757bbf850777d8b0ee13e6 |
| odd-asphere-photopic | 20cd56c7ce61e03b99d23927711cc59a76ec71f1457e6ce252965ae7e7563d81 |
| e-line-ref | 570d96eae942cca2f3c8d3bd599229ff217a5bcaa4ffe51d3f0bc437e8e74a5f |
| e-line-photopic | c676b74f357f33279a32065c7e92a0018d471bc2e0bc784adb4c3d045742a82f |
| asphere-a20-ref | 2e2860597aac3e463f9d0d117c3588a6ca38d310047dc4737fbe2e5ab254696e |
| asphere-a20-photopic | 831b5e424ec277bcea8589d502ef7cb14ac20c565da6e05b28d663d134ad7b1b |
| flat-base-asphere-ref | e37e8c22640345c6fd346376540b31b206fcbffd6a6959c68c22ba1936b2ec66 |
| flat-base-asphere-photopic | a135c9720e381a6fec792a2393a0905d3dc50893fbce8d189594488a31a09d93 |
| rear-plate-rim-ref | 0eb3a9972535644347123ac0bf9d63f278b8a7bba4d12e51786fc31f50139cc0 |
| rear-plate-rim-photopic | dafc9b06c7e1cdaebc36682dbf17f54b754fbb7a96ef74c70362118832528856 |
| fixed-iris-zoom-ref-wide | c245f29ea2c59d08165ddb6ffc916051a82ba17d26d1a0cb2dd36119d3f95b4d |
| fixed-iris-zoom-ref-tele | 1f10167f637bf7d6934df790b915f13591cfd2cbcb9fde5d28a82d4e9b3be313 |
| fixed-iris-zoom-photopic-wide | ad0d4cacc26161ff7eea806e0c5267f7bc9df665e2fe0583ecc72565d8240b3f |
| fixed-iris-zoom-photopic-tele | 44e1c43d93bfb56f1bea7660f88439af5165244e8471d355d8f34431d6d250d1 |
| zero-asphere-ref | b508489969379794ca3d7a6bfc1a1a8487afa8fffa703a7c0d361ae0a2bb2663 |
| zero-asphere-photopic | 32faf32241aad020912527e8c5cea11861019cc71f8fe71a645acbaaf297170a |
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
| r2 | rays.trace | 18 | 162 | lv – optiland | 17 PASS, 1 FLOOR | 160 PASS, 2 FLOOR |
| r2 | rays.trace | 18 | 162 | lv – ref | 17 PASS, 1 FLOOR | 160 PASS, 2 FLOOR |
| r2 | rays.trace | 18 | 162 | optiland – ref | 18 PASS | 162 PASS |
| r3 | rays.trace | 18 | 162 | lv – optiland | 17 PASS, 1 FLOOR | 160 PASS, 2 FLOOR |
| r3 | rays.trace | 18 | 162 | lv – ref | 17 PASS, 1 FLOOR | 160 PASS, 2 FLOOR |
| r3 | rays.trace | 18 | 162 | optiland – ref | 18 PASS | 162 PASS |

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

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 2.30e-16 | fixed-iris-zoom-ref-wide | sample 6, surface 3 |
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
| odd-asphere-ref | 1 | PASS: sag.maxScaled 2.18e-16 | PASS: sag.maxScaled 2.69e-16 | PASS: sag.maxScaled 2.69e-16 |
| odd-asphere-photopic | 1 | PASS: sag.maxScaled 2.18e-16 | PASS: sag.maxScaled 2.69e-16 | PASS: sag.maxScaled 2.69e-16 |
| e-line-ref | 1 | PASS: sag.maxScaled 1.70e-16 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 1.95e-16 |
| e-line-photopic | 1 | PASS: sag.maxScaled 1.70e-16 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 1.95e-16 |
| asphere-a20-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.33e-16 |
| asphere-a20-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.33e-16 |
| flat-base-asphere-ref | 1 | PASS: sag.maxScaled 1.89e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 2.56e-16 |
| flat-base-asphere-photopic | 1 | PASS: sag.maxScaled 1.89e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 2.56e-16 |
| rear-plate-rim-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 1.90e-16 | PASS: sag.maxScaled 3.11e-16 |
| rear-plate-rim-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 1.90e-16 | PASS: sag.maxScaled 3.11e-16 |
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
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 1.07e-14 | rear-plate-rim-photopic | line 2, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 1.07e-14 | rear-plate-rim-photopic | line 2, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 5.33e-14 | odd-asphere-photopic | line 3, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 7.11e-15 | e-line-photopic | line 3, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 7.11e-15 | e-line-photopic | line 3, quantity entrancePupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 4.97e-14 | odd-asphere-photopic | line 1, quantity frontPrincipalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 9.95e-14 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 9.95e-14 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.77e-15 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 9.77e-15 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 1 | PASS: pupilZ.maxScaled 3.20e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: pupilZ.maxScaled 4.62e-14 mm |
| odd-asphere-photopic | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm | PASS: firstOrder.maxAbs 4.97e-14 mm |
| e-line-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| e-line-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| asphere-a20-ref | 1 | PASS: pupilZ.maxScaled 2.13e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| asphere-a20-photopic | 1 | PASS: pupilZ.maxScaled 2.49e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
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
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 2.30e-9 | e-line-photopic | field 2.34e1, line 1, ray 699, surface 7 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 2.07e-10 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 1.10e-8 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 104846 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 2.30e-9 | e-line-photopic | field 2.34e1, line 1, ray 699, surface 7 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 2.07e-10 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.10e-8 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 104846 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.10e-12 | rear-plate-rim-photopic | field 3.29e1, line 2, ray 360, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 1.35e-14 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 0, ray 539 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 5.90e-13 | rear-plate-rim-photopic | field 1.77e1, line 0, ray 615 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 104846 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 8.60e-13 mm | 1763 / 1414 / 0 | 1763 / 1414 / 0 | 1763 / 1414 / 0 |
| odd-asphere-photopic | 15 | PASS: hits.maxDistance 1.05e-9 mm | PASS: hits.maxDistance 1.05e-9 mm | PASS: hits.maxDistance 9.42e-13 mm | 8815 / 7070 / 0 | 8815 / 7070 / 0 | 8815 / 7070 / 0 |
| e-line-ref | 3 | PASS: hits.maxDistance 1.97e-9 mm | PASS: hits.maxDistance 1.97e-9 mm | PASS: landing.maxDistance 7.84e-14 mm | 1931 / 1508 / 0 | 1931 / 1508 / 0 | 1931 / 1508 / 0 |
| e-line-photopic | 15 | PASS: hits.maxDistance 2.30e-9 mm | PASS: hits.maxDistance 2.30e-9 mm | PASS: landing.maxDistance 7.83e-14 mm | 9667 / 7528 / 0 | 9667 / 7528 / 0 | 9667 / 7528 / 0 |
| asphere-a20-ref | 3 | PASS: landing.maxDistance 2.09e-9 mm | PASS: landing.maxDistance 2.09e-9 mm | PASS: hits.maxDistance 1.05e-12 mm | 1879 / 1292 / 0 | 1879 / 1292 / 0 | 1879 / 1292 / 0 |
| asphere-a20-photopic | 15 | PASS: landing.maxDistance 2.18e-9 mm | PASS: landing.maxDistance 2.18e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 9397 / 6458 / 0 | 9397 / 6458 / 0 | 9397 / 6458 / 0 |
| flat-base-asphere-ref | 3 | PASS: landing.maxDistance 1.46e-9 mm | PASS: landing.maxDistance 1.46e-9 mm | PASS: hits.maxDistance 1.01e-12 mm | 1789 / 1448 / 0 | 1789 / 1448 / 0 | 1789 / 1448 / 0 |
| flat-base-asphere-photopic | 15 | PASS: landing.maxDistance 1.47e-9 mm | PASS: landing.maxDistance 1.47e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 8953 / 7232 / 0 | 8953 / 7232 / 0 | 8953 / 7232 / 0 |
| rear-plate-rim-ref | 3 | PASS: hits.maxDistance 1.25e-9 mm | PASS: hits.maxDistance 1.25e-9 mm | PASS: hits.maxDistance 9.85e-13 mm | 1715 / 1462 / 0 | 1715 / 1462 / 0 | 1715 / 1462 / 0 |
| rear-plate-rim-photopic | 15 | PASS: hits.maxDistance 1.41e-9 mm | PASS: hits.maxDistance 1.41e-9 mm | PASS: hits.maxDistance 1.10e-12 mm | 8577 / 7308 / 0 | 8577 / 7308 / 0 | 8577 / 7308 / 0 |
| fixed-iris-zoom-ref-wide | 3 | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 9.97e-13 mm | 2128 / 1675 / 0 | 2128 / 1675 / 0 | 2128 / 1675 / 0 |
| fixed-iris-zoom-ref-tele | 3 | PASS: hits.maxDistance 1.09e-9 mm | PASS: hits.maxDistance 1.09e-9 mm | PASS: hits.maxDistance 1.01e-12 mm | 2179 / 1352 / 0 | 2179 / 1352 / 0 | 2179 / 1352 / 0 |
| fixed-iris-zoom-photopic-wide | 15 | PASS: hits.maxDistance 1.18e-9 mm | PASS: hits.maxDistance 1.18e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 10666 / 8349 / 0 | 10666 / 8349 / 0 | 10666 / 8349 / 0 |
| fixed-iris-zoom-photopic-tele | 15 | PASS: hits.maxDistance 1.10e-9 mm | PASS: hits.maxDistance 1.10e-9 mm | PASS: hits.maxDistance 9.97e-13 mm | 10877 / 6778 / 0 | 10877 / 6778 / 0 | 10877 / 6778 / 0 |
| zero-asphere-ref | 3 | PASS: hits.maxDistance 1.17e-9 mm | PASS: hits.maxDistance 1.17e-9 mm | PASS: hits.maxDistance 1.28e-13 mm | 2073 / 1864 / 0 | 2073 / 1864 / 0 | 2073 / 1864 / 0 |
| zero-asphere-photopic | 15 | PASS: hits.maxDistance 1.14e-9 mm | PASS: hits.maxDistance 1.14e-9 mm | PASS: hits.maxDistance 1.51e-13 mm | 9809 / 9476 / 0 | 9809 / 9476 / 0 | 9809 / 9476 / 0 |
| stop-inside-element-ref | 3 | PASS: landing.maxDistance 7.39e-9 mm | PASS: landing.maxDistance 7.39e-9 mm | PASS: landing.maxDistance 2.27e-13 mm | 2105 / 1410 / 0 | 2105 / 1410 / 0 | 2105 / 1410 / 0 |
| stop-inside-element-photopic | 15 | FLOOR: landing.maxDistance 1.10e-8 mm | FLOOR: landing.maxDistance 1.10e-8 mm | PASS: landing.maxDistance 2.77e-13 mm | 10523 / 7052 / 0 | 10523 / 7052 / 0 | 10523 / 7052 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.79e-6 | e-line-photopic | field 1.21e1, line 1, ray 956 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.07e-5 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.28e-5 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.79e-6 | e-line-photopic | field 1.21e1, line 1, ray 951 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.07e-5 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.28e-5 | stop-inside-element-photopic | field 5.53e1, line 1, ray 264 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.99e-9 | fixed-iris-zoom-photopic-wide | field 3.93e1, line 1, ray 899 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.14e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 878 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.51e-9 | rear-plate-rim-photopic | field 1.77e1, line 1, ray 399 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: opticalPathToImage.maxAbs 2.85e-6 waves | PASS: opticalPathToImage.maxAbs 2.85e-6 waves | PASS: opd.maxAbs 1.60e-9 waves |
| odd-asphere-photopic | 15 | PASS: opd.maxAbs 4.18e-6 waves | PASS: opd.maxAbs 4.18e-6 waves | PASS: opticalPathToImage.maxAbs 2.00e-9 waves |
| e-line-ref | 3 | PASS: opd.maxAbs 3.52e-6 waves | PASS: opd.maxAbs 3.52e-6 waves | PASS: opticalPathToImage.maxAbs 1.04e-10 waves |
| e-line-photopic | 15 | PASS: opd.maxAbs 4.63e-6 waves | PASS: opd.maxAbs 4.63e-6 waves | PASS: opd.maxAbs 1.54e-10 waves |
| asphere-a20-ref | 3 | PASS: opd.maxAbs 3.20e-6 waves | PASS: opd.maxAbs 3.20e-6 waves | PASS: opticalPathToImage.maxAbs 2.42e-9 waves |
| asphere-a20-photopic | 15 | PASS: opd.maxAbs 3.81e-6 waves | PASS: opd.maxAbs 3.81e-6 waves | PASS: opticalPathToImage.maxAbs 3.14e-9 waves |
| flat-base-asphere-ref | 3 | PASS: opd.maxAbs 2.69e-6 waves | PASS: opd.maxAbs 2.69e-6 waves | PASS: opticalPath.maxAbs 1.28e-9 waves |
| flat-base-asphere-photopic | 15 | PASS: opd.maxAbs 3.45e-6 waves | PASS: opd.maxAbs 3.45e-6 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |
| rear-plate-rim-ref | 3 | PASS: opd.maxAbs 3.07e-6 waves | PASS: opd.maxAbs 3.07e-6 waves | PASS: opd.maxAbs 2.52e-9 waves |
| rear-plate-rim-photopic | 15 | PASS: opd.maxAbs 4.07e-6 waves | PASS: opd.maxAbs 4.07e-6 waves | PASS: opd.maxAbs 3.51e-9 waves |
| fixed-iris-zoom-ref-wide | 3 | PASS: opticalPath.maxAbs 2.18e-6 waves | PASS: opticalPath.maxAbs 2.18e-6 waves | PASS: opticalPath.maxAbs 2.47e-9 waves |
| fixed-iris-zoom-ref-tele | 3 | PASS: opticalPath.maxAbs 2.51e-6 waves | PASS: opticalPath.maxAbs 2.51e-6 waves | PASS: opticalPath.maxAbs 1.40e-9 waves |
| fixed-iris-zoom-photopic-wide | 15 | PASS: opticalPath.maxAbs 2.85e-6 waves | PASS: opticalPath.maxAbs 2.85e-6 waves | PASS: opticalPath.maxAbs 2.99e-9 waves |
| fixed-iris-zoom-photopic-tele | 15 | PASS: opticalPath.maxAbs 2.52e-6 waves | PASS: opticalPath.maxAbs 2.52e-6 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| zero-asphere-ref | 3 | PASS: opd.maxAbs 3.00e-6 waves | PASS: opd.maxAbs 3.00e-6 waves | PASS: opticalPath.maxAbs 3.87e-10 waves |
| zero-asphere-photopic | 15 | PASS: opticalPath.maxAbs 3.58e-6 waves | PASS: opticalPath.maxAbs 3.58e-6 waves | PASS: opd.maxAbs 5.59e-10 waves |
| stop-inside-element-ref | 3 | PASS: opd.maxAbs 1.66e-5 waves | PASS: opd.maxAbs 1.66e-5 waves | PASS: opticalPathToImage.maxAbs 3.39e-10 waves |
| stop-inside-element-photopic | 15 | FLOOR: opd.maxAbs 2.28e-5 waves | FLOOR: opd.maxAbs 2.28e-5 waves | PASS: opticalPathToImage.maxAbs 4.74e-10 waves |
