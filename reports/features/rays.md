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
| Baseline hash | 88137cefd70ceeb9744bb25182038ef40e860fa1fe57969dc0cf6b164b00cd54 |
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
| odd-asphere-ref | d24ce91f200b115d1ef919d9fdb14b4db87b5d67f8e38b63efca3cfd91ddf4af |
| odd-asphere-photopic | 7806b61397ee501f285caf4f1cee9bf1c6520ae4c3d7c7ed0d00d64d1330b84c |
| e-line-ref | 0b0f82fadbb79be999e3bf439eb67044e620fd05941e7346e67e99d0a440171d |
| e-line-photopic | 147b9a91fd1155441f1c4bda4f92a0ca16457f7b650bf341c21516c9ec0f2085 |
| asphere-a20-ref | b10db914a934de3a2a074ccd8d938e8f5a15df09bbbe41e90b3adfaec28de5b1 |
| asphere-a20-photopic | bf3df7707349812ee033cd33587c2f90c050c99a1001e2839d5c2888f974af03 |
| flat-base-asphere-ref | dcde783cdad5fd68c9aca52a808241a3d436c3f568576b791de8acdc0fd5f030 |
| flat-base-asphere-photopic | fcdcf3abb8bca96c84790765c8597cb12447c677ef816fea1dbb4791acc9283f |
| rear-plate-rim-ref | 31bf486acface061c777c104e2acb25e14f899a7dd2988b63d0838c8e46fba92 |
| rear-plate-rim-photopic | 1c3b599816216a48f77fdca17950cc1778f026df247f0e841775a49f3f5ba71b |
| fixed-iris-zoom-ref-wide | 4db46962ff43d333cab4430dc739c4afd7e77824ee7f7b12e37169b0be3111a3 |
| fixed-iris-zoom-ref-tele | 15567bb5f10f9c71fda356870eabbca30ac1c4c693c8e097521b2a4308432b72 |
| fixed-iris-zoom-photopic-wide | ef0e8df77391e0901a3d905eb1ba9da7390eae43bfdb4b7f94075ab244e0163d |
| fixed-iris-zoom-photopic-tele | 203606c1bf1df23c8dc24ff146e9f31034a62bf5d1d627df8122ee51163641ee |
| zero-asphere-ref | 7ecd42d1bcf433bc492fb0eafaae81190c604a9969bb0b9b867682ba13b421be |
| zero-asphere-photopic | 82a3b8c74b22a95f865dccbbc82d17404a7b7cd6724f9071ccd2b0c31d629bd1 |
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
| r7a | rays.trace | 18 | 540 | lv – optiland | 18 PASS | 540 PASS |
| r7a | rays.trace | 18 | 540 | lv – ref | 18 PASS | 540 PASS |
| r7a | rays.trace | 18 | 540 | optiland – ref | 18 PASS | 540 PASS |
| r8a | rays.trace | 18 | 117 | lv – optiland | 18 PASS | 117 PASS |
| r8a | rays.trace | 18 | 117 | lv – ref | 18 PASS | 117 PASS |
| r8a | rays.trace | 18 | 117 | optiland – ref | 18 PASS | 117 PASS |
| r9a | rays.trace | 18 | 72 | lv – optiland | 18 PASS | 72 PASS |
| r9a | rays.trace | 18 | 72 | lv – ref | 18 PASS | 72 PASS |
| r9a | rays.trace | 18 | 72 | optiland – ref | 18 PASS | 72 PASS |
| r10a | rays.trace | 18 | 108 | lv – optiland | 18 PASS | 108 PASS |
| r10a | rays.trace | 18 | 108 | lv – ref | 18 PASS | 108 PASS |
| r10a | rays.trace | 18 | 108 | optiland – ref | 18 PASS | 108 PASS |
| r11a | rays.trace | 18 | 54 | lv – optiland | 18 PASS | 54 PASS |
| r11a | rays.trace | 18 | 54 | lv – ref | 18 PASS | 54 PASS |
| r11a | rays.trace | 18 | 54 | optiland – ref | 18 PASS | 54 PASS |

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
| r7a | lv | 18 ok |
| r7a | optiland | 18 ok |
| r7a | ref | 18 ok |
| r8a | lv | 18 ok |
| r8a | optiland | 18 ok |
| r8a | ref | 18 ok |
| r9a | lv | 18 ok |
| r9a | optiland | 18 ok |
| r9a | ref | 18 ok |
| r10a | lv | 18 ok |
| r10a | optiland | 18 ok |
| r10a | ref | 18 ok |
| r11a | lv | 18 ok |
| r11a | optiland | 18 ok |
| r11a | ref | 18 ok |

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
| rear-plate-rim-ref | 1 | PASS: sag.maxScaled 2.01e-16 | PASS: sag.maxScaled 1.90e-16 | PASS: sag.maxScaled 3.11e-16 |
| rear-plate-rim-photopic | 1 | PASS: sag.maxScaled 2.01e-16 | PASS: sag.maxScaled 1.90e-16 | PASS: sag.maxScaled 3.11e-16 |
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
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 1.07e-14 | rear-plate-rim-ref | line 0, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 1.07e-14 | rear-plate-rim-ref | line 0, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 5.33e-14 | odd-asphere-photopic | line 3, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 8.53e-14 | fixed-iris-zoom-photopic-tele | line 3, quantity exitPupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 7.11e-15 | e-line-photopic | line 3, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 7.11e-15 | e-line-photopic | line 3, quantity entrancePupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 4.97e-14 | odd-asphere-photopic | line 1, quantity frontPrincipalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 9.95e-14 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 9.95e-14 | fixed-iris-zoom-photopic-tele | line 2, quantity exitPupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 8.88e-15 | rear-plate-rim-ref | line 0, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 8.88e-15 | rear-plate-rim-ref | line 0, quantity exitPupilSemiDiameter |

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
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 1.05e-12 | flat-base-asphere-photopic | field 0, line 0, ray 907, surface 13 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 1.12e-14 | flat-base-asphere-photopic | field 0, line 0, ray 907 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 3.65e-13 | asphere-a20-photopic | field 2.42e1, line 2, ray 811 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 142434 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.23e-12 | asphere-a20-ref | field 4.06e1, line 0, ray 911, surface 13 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.20e-14 | asphere-a20-photopic | field 4.06e1, line 0, ray 877 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 4.37e-13 | asphere-a20-photopic | field 4.06e1, line 0, ray 877 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 142434 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.24e-12 | asphere-a20-ref | field 4.06e1, line 0, ray 911, surface 13 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 1.19e-14 | asphere-a20-ref | field 4.06e1, line 0, ray 877 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 4.85e-13 | asphere-a20-photopic | field 4.06e1, line 2, ray 878 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 142434 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: direction.maxAbs 5.66e-15 | PASS: hits.maxDistance 8.72e-13 mm | PASS: hits.maxDistance 8.72e-13 mm | 2425 / 650 / 0 | 2425 / 650 / 0 | 2425 / 650 / 0 |
| odd-asphere-photopic | 15 | PASS: hits.maxDistance 7.03e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 12177 / 3198 / 0 | 12177 / 3198 / 0 | 12177 / 3198 / 0 |
| e-line-ref | 3 | PASS: landing.maxDistance 7.84e-14 mm | PASS: landing.maxDistance 4.63e-14 mm | PASS: landing.maxDistance 7.44e-14 mm | 2573 / 502 / 0 | 2573 / 502 / 0 | 2573 / 502 / 0 |
| e-line-photopic | 15 | PASS: landing.maxDistance 7.37e-14 mm | PASS: landing.maxDistance 5.69e-14 mm | PASS: landing.maxDistance 9.41e-14 mm | 12875 / 2500 / 0 | 12875 / 2500 / 0 | 12875 / 2500 / 0 |
| asphere-a20-ref | 3 | PASS: landing.maxDistance 1.15e-13 mm | PASS: hits.maxDistance 1.23e-12 mm | PASS: hits.maxDistance 1.24e-12 mm | 2583 / 492 / 0 | 2583 / 492 / 0 | 2583 / 492 / 0 |
| asphere-a20-photopic | 15 | PASS: hits.maxDistance 9.42e-13 mm | PASS: hits.maxDistance 9.66e-13 mm | PASS: hits.maxDistance 9.64e-13 mm | 12919 / 2456 / 0 | 12919 / 2456 / 0 | 12919 / 2456 / 0 |
| flat-base-asphere-ref | 3 | PASS: hits.maxDistance 2.43e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2427 / 648 / 0 | 2427 / 648 / 0 | 2427 / 648 / 0 |
| flat-base-asphere-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 12163 / 3212 / 0 | 12163 / 3212 / 0 | 12163 / 3212 / 0 |
| rear-plate-rim-ref | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2391 / 684 / 0 | 2391 / 684 / 0 | 2391 / 684 / 0 |
| rear-plate-rim-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 11957 / 3418 / 0 | 11957 / 3418 / 0 | 11957 / 3418 / 0 |
| fixed-iris-zoom-ref-wide | 3 | PASS: direction.maxAbs 3.33e-15 | PASS: hits.maxDistance 9.31e-13 mm | PASS: hits.maxDistance 9.31e-13 mm | 2436 / 639 / 0 | 2436 / 639 / 0 | 2436 / 639 / 0 |
| fixed-iris-zoom-ref-tele | 3 | PASS: landing.maxDistance 4.23e-14 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 2857 / 218 / 0 | 2857 / 218 / 0 | 2857 / 218 / 0 |
| fixed-iris-zoom-photopic-wide | 15 | PASS: direction.maxAbs 4.00e-15 | PASS: hits.maxDistance 9.88e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 12192 / 3183 / 0 | 12192 / 3183 / 0 | 12192 / 3183 / 0 |
| fixed-iris-zoom-photopic-tele | 15 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 14275 / 1100 / 0 | 14275 / 1100 / 0 | 14275 / 1100 / 0 |
| zero-asphere-ref | 3 | PASS: hits.maxDistance 1.27e-13 mm | PASS: hits.maxDistance 1.12e-13 mm | PASS: hits.maxDistance 1.26e-13 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| zero-asphere-photopic | 15 | PASS: hits.maxDistance 1.51e-13 mm | PASS: hits.maxDistance 1.58e-13 mm | PASS: hits.maxDistance 1.43e-13 mm | 14777 / 598 / 0 | 14777 / 598 / 0 | 14777 / 598 / 0 |
| stop-inside-element-ref | 3 | PASS: landing.maxDistance 2.74e-13 mm | PASS: landing.maxDistance 1.03e-13 mm | PASS: landing.maxDistance 2.81e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| stop-inside-element-photopic | 15 | PASS: landing.maxDistance 3.20e-13 mm | PASS: landing.maxDistance 9.95e-14 mm | PASS: landing.maxDistance 3.45e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 1.28e-9 | flat-base-asphere-photopic | field 0, line 0, ray 107 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 1.28e-9 | asphere-a20-photopic | field 2.42e1, line 2, ray 811 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 1.31e-9 | asphere-a20-photopic | field 2.42e1, line 2, ray 811 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.24e-9 | fixed-iris-zoom-photopic-wide | field 0, line 1, ray 235 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.08e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 815 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.11e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 815 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.17e-9 | fixed-iris-zoom-photopic-wide | field 0, line 1, ray 235 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.11e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 815 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.08e-9 | asphere-a20-photopic | field 2.42e1, line 1, ray 815 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 1.11e-9 waves | PASS: opticalPath.maxAbs 1.02e-9 waves |
| odd-asphere-photopic | 15 | PASS: opticalPathToImage.maxAbs 9.47e-10 waves | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.69e-9 waves |
| e-line-ref | 3 | PASS: opticalPathToImage.maxAbs 1.30e-10 waves | PASS: opd.maxAbs 7.81e-11 waves | PASS: opticalPathToImage.maxAbs 1.04e-10 waves |
| e-line-photopic | 15 | PASS: opd.maxAbs 1.28e-10 waves | PASS: opd.maxAbs 9.07e-11 waves | PASS: opticalPathToImage.maxAbs 1.21e-10 waves |
| asphere-a20-ref | 3 | PASS: opticalPathToImage.maxAbs 1.45e-10 waves | PASS: opticalPathToImage.maxAbs 2.47e-9 waves | PASS: opticalPathToImage.maxAbs 2.47e-9 waves |
| asphere-a20-photopic | 15 | PASS: opd.maxAbs 1.31e-9 waves | PASS: opd.maxAbs 3.11e-9 waves | PASS: opticalPathToImage.maxAbs 3.11e-9 waves |
| flat-base-asphere-ref | 3 | PASS: opd.maxAbs 4.11e-10 waves | PASS: opticalPath.maxAbs 1.31e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| flat-base-asphere-photopic | 15 | PASS: opticalPath.maxAbs 1.28e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| rear-plate-rim-ref | 3 | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.89e-9 waves | PASS: opd.maxAbs 1.79e-9 waves |
| rear-plate-rim-photopic | 15 | PASS: opd.maxAbs 1.07e-9 waves | PASS: opd.maxAbs 2.30e-9 waves | PASS: opd.maxAbs 2.30e-9 waves |
| fixed-iris-zoom-ref-wide | 3 | PASS: opticalPathToImage.maxAbs 1.21e-10 waves | PASS: opticalPath.maxAbs 2.39e-9 waves | PASS: opticalPath.maxAbs 2.44e-9 waves |
| fixed-iris-zoom-ref-tele | 3 | PASS: opd.maxAbs 1.21e-10 waves | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 1.52e-9 waves |
| fixed-iris-zoom-photopic-wide | 15 | PASS: opd.maxAbs 1.81e-10 waves | PASS: opticalPath.maxAbs 3.24e-9 waves | PASS: opticalPath.maxAbs 3.17e-9 waves |
| fixed-iris-zoom-photopic-tele | 15 | PASS: opticalPathToImage.maxAbs 8.31e-10 waves | PASS: opticalPath.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 1.97e-9 waves |
| zero-asphere-ref | 3 | PASS: opticalPathToImage.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 4.84e-10 waves |
| zero-asphere-photopic | 15 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 6.15e-10 waves | PASS: opd.maxAbs 6.15e-10 waves |
| stop-inside-element-ref | 3 | PASS: opd.maxAbs 4.60e-10 waves | PASS: opd.maxAbs 1.93e-10 waves | PASS: opticalPathToImage.maxAbs 4.35e-10 waves |
| stop-inside-element-photopic | 15 | PASS: opd.maxAbs 6.40e-10 waves | PASS: opd.maxAbs 2.23e-10 waves | PASS: opticalPathToImage.maxAbs 6.35e-10 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.70e-12 | stop-inside-element-ref | cut tangential, field 5.53e1, frequencyPerMm 56 |
| lv – optiland | rays.compared [rays] | 142434 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | odd-asphere-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 6.91e-12 | flat-base-asphere-ref | cut sagittal, field 0, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 142434 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | odd-asphere-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 7.22e-12 | flat-base-asphere-ref | cut tangential, field 0, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 142434 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: mtf.maxAbs 4.03e-13 | PASS: mtf.maxAbs 1.38e-12 | PASS: mtf.maxAbs 1.75e-12 |
| odd-asphere-photopic | 3 | PASS: mtf.maxAbs 5.54e-13 | PASS: mtf.maxAbs 7.99e-13 | PASS: mtf.maxAbs 9.57e-13 |
| e-line-ref | 3 | PASS: mtf.maxAbs 7.08e-13 | PASS: mtf.maxAbs 4.90e-13 | PASS: mtf.maxAbs 7.35e-13 |
| e-line-photopic | 3 | PASS: mtf.maxAbs 5.16e-13 | PASS: mtf.maxAbs 7.05e-13 | PASS: mtf.maxAbs 5.18e-13 |
| asphere-a20-ref | 3 | PASS: mtf.maxAbs 8.84e-13 | PASS: mtf.maxAbs 6.43e-12 | PASS: mtf.maxAbs 7.19e-12 |
| asphere-a20-photopic | 3 | PASS: mtf.maxAbs 1.29e-12 | PASS: mtf.maxAbs 5.40e-12 | PASS: mtf.maxAbs 6.25e-12 |
| flat-base-asphere-ref | 3 | PASS: mtf.maxAbs 1.12e-12 | PASS: mtf.maxAbs 6.91e-12 | PASS: mtf.maxAbs 7.22e-12 |
| flat-base-asphere-photopic | 3 | PASS: mtf.maxAbs 4.60e-13 | PASS: mtf.maxAbs 6.80e-12 | PASS: mtf.maxAbs 6.48e-12 |
| rear-plate-rim-ref | 3 | PASS: mtf.maxAbs 1.35e-12 | PASS: mtf.maxAbs 4.25e-12 | PASS: mtf.maxAbs 5.55e-12 |
| rear-plate-rim-photopic | 3 | PASS: mtf.maxAbs 7.40e-13 | PASS: mtf.maxAbs 3.24e-12 | PASS: mtf.maxAbs 3.77e-12 |
| fixed-iris-zoom-ref-wide | 3 | PASS: mtf.maxAbs 3.17e-13 | PASS: mtf.maxAbs 4.18e-12 | PASS: mtf.maxAbs 3.92e-12 |
| fixed-iris-zoom-ref-tele | 3 | PASS: mtf.maxAbs 4.73e-13 | PASS: mtf.maxAbs 9.72e-13 | PASS: mtf.maxAbs 1.20e-12 |
| fixed-iris-zoom-photopic-wide | 3 | PASS: mtf.maxAbs 2.07e-13 | PASS: mtf.maxAbs 2.17e-12 | PASS: mtf.maxAbs 2.10e-12 |
| fixed-iris-zoom-photopic-tele | 3 | PASS: mtf.maxAbs 2.61e-13 | PASS: mtf.maxAbs 9.45e-13 | PASS: mtf.maxAbs 7.93e-13 |
| zero-asphere-ref | 3 | PASS: mtf.maxAbs 9.61e-13 | PASS: mtf.maxAbs 3.46e-13 | PASS: mtf.maxAbs 1.14e-12 |
| zero-asphere-photopic | 3 | PASS: mtf.maxAbs 3.43e-13 | PASS: mtf.maxAbs 1.36e-13 | PASS: mtf.maxAbs 2.94e-13 |
| stop-inside-element-ref | 3 | PASS: mtf.maxAbs 1.70e-12 | PASS: mtf.maxAbs 6.00e-13 | PASS: mtf.maxAbs 1.11e-12 |
| stop-inside-element-photopic | 3 | PASS: mtf.maxAbs 8.78e-13 | PASS: mtf.maxAbs 5.89e-13 | PASS: mtf.maxAbs 7.69e-13 |

## r7a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | transverseError.maxAbs (≤ 1.00e-8 mm) | 4.45e-13 | asphere-a20-photopic | field 3.05e1, line 3, ray 336 |
| lv – optiland | centroid.maxAbs (≤ 1.00e-8 mm) | 4.66e-14 | rear-plate-rim-photopic | field 1.65e1, line 4 |
| lv – optiland | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 2.27e-14 | rear-plate-rim-photopic | field 0, line 2 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 97680 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 6.19e-13 | rear-plate-rim-photopic | field 8.24e0, line 1, ray 275 |
| lv – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 3.52e-13 | asphere-a20-photopic | field 3.05e1, line 3 |
| lv – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 5.14e-14 | asphere-a20-ref | field 2.44e1, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 97680 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 6.31e-13 | rear-plate-rim-photopic | field 8.24e0, line 1, ray 275 |
| optiland – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 3.64e-13 | asphere-a20-photopic | field 3.05e1, line 3 |
| optiland – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 5.65e-14 | asphere-a20-ref | field 2.44e1, line 0 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 97680 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 10 | PASS: transverseError.maxAbs 1.40e-13 mm | PASS: transverseError.maxAbs 2.08e-13 mm | PASS: transverseError.maxAbs 2.22e-13 mm | 1657 / 287 / 0 | 1657 / 287 / 0 | 1657 / 287 / 0 |
| odd-asphere-photopic | 50 | PASS: transverseError.maxAbs 1.54e-13 mm | PASS: transverseError.maxAbs 2.36e-13 mm | PASS: transverseError.maxAbs 2.43e-13 mm | 8283 / 1437 / 0 | 8283 / 1437 / 0 | 8283 / 1437 / 0 |
| e-line-ref | 10 | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 4.80e-14 mm | PASS: transverseError.maxAbs 6.22e-14 mm | 1751 / 193 / 0 | 1751 / 193 / 0 | 1751 / 193 / 0 |
| e-line-photopic | 50 | PASS: transverseError.maxAbs 8.17e-14 mm | PASS: transverseError.maxAbs 7.64e-14 mm | PASS: transverseError.maxAbs 6.22e-14 mm | 8752 / 968 / 0 | 8752 / 968 / 0 | 8752 / 968 / 0 |
| asphere-a20-ref | 10 | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 4.41e-13 mm | PASS: transverseError.maxAbs 4.41e-13 mm | 1932 / 12 / 0 | 1932 / 12 / 0 | 1932 / 12 / 0 |
| asphere-a20-photopic | 50 | PASS: transverseError.maxAbs 4.45e-13 mm | PASS: transverseError.maxAbs 4.60e-13 mm | PASS: transverseError.maxAbs 4.80e-13 mm | 9657 / 63 / 0 | 9657 / 63 / 0 | 9657 / 63 / 0 |
| flat-base-asphere-ref | 10 | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 2.01e-13 mm | PASS: transverseError.maxAbs 1.67e-13 mm | 1609 / 335 / 0 | 1609 / 335 / 0 | 1609 / 335 / 0 |
| flat-base-asphere-photopic | 50 | PASS: transverseError.maxAbs 1.88e-13 mm | PASS: transverseError.maxAbs 1.97e-13 mm | PASS: transverseError.maxAbs 2.27e-13 mm | 8049 / 1671 / 0 | 8049 / 1671 / 0 | 8049 / 1671 / 0 |
| rear-plate-rim-ref | 10 | PASS: transverseError.maxAbs 3.63e-13 mm | PASS: transverseError.maxAbs 6.03e-13 mm | PASS: transverseError.maxAbs 5.72e-13 mm | 1679 / 265 / 0 | 1679 / 265 / 0 | 1679 / 265 / 0 |
| rear-plate-rim-photopic | 50 | PASS: transverseError.maxAbs 4.14e-13 mm | PASS: transverseError.maxAbs 6.19e-13 mm | PASS: transverseError.maxAbs 6.31e-13 mm | 8389 / 1331 / 0 | 8389 / 1331 / 0 | 8389 / 1331 / 0 |
| fixed-iris-zoom-ref-wide | 10 | PASS: transverseError.maxAbs 4.55e-14 mm | PASS: transverseError.maxAbs 3.48e-13 mm | PASS: transverseError.maxAbs 3.65e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fixed-iris-zoom-ref-tele | 10 | PASS: transverseError.maxAbs 4.55e-14 mm | PASS: transverseError.maxAbs 2.57e-13 mm | PASS: transverseError.maxAbs 2.59e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 50 | PASS: transverseError.maxAbs 8.79e-14 mm | PASS: transverseError.maxAbs 3.73e-13 mm | PASS: transverseError.maxAbs 3.65e-13 mm | 9713 / 7 / 0 | 9713 / 7 / 0 | 9713 / 7 / 0 |
| fixed-iris-zoom-photopic-tele | 50 | PASS: transverseError.maxAbs 9.37e-14 mm | PASS: transverseError.maxAbs 2.71e-13 mm | PASS: transverseError.maxAbs 2.68e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| zero-asphere-ref | 10 | PASS: transverseError.maxAbs 5.24e-14 mm | PASS: transverseError.maxAbs 2.75e-14 mm | PASS: transverseError.maxAbs 4.62e-14 mm | 1925 / 19 / 0 | 1925 / 19 / 0 | 1925 / 19 / 0 |
| zero-asphere-photopic | 50 | PASS: transverseError.maxAbs 6.57e-14 mm | PASS: transverseError.maxAbs 3.29e-14 mm | PASS: transverseError.maxAbs 7.02e-14 mm | 9569 / 151 / 0 | 9569 / 151 / 0 | 9569 / 151 / 0 |
| stop-inside-element-ref | 10 | PASS: transverseError.maxAbs 5.86e-14 mm | PASS: transverseError.maxAbs 3.73e-14 mm | PASS: transverseError.maxAbs 7.11e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| stop-inside-element-photopic | 50 | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 4.26e-14 mm | PASS: transverseError.maxAbs 6.93e-14 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |

## r8a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | intercept.maxScaled (≤ 1.00e-8 mm) | 1.49e-13 | flat-base-asphere-photopic | field 0, line 0, ray 20 |
| lv – optiland | intercept.maxAbs [mm] | 1.09e-12 | flat-base-asphere-photopic | field 0, line 0, ray 20 |
| lv – optiland | focus.maxScaled (≤ 1.00e-8 mm) | 3.42e-14 | rear-plate-rim-ref | field 0, line 0 |
| lv – optiland | focus.maxAbs [mm] | 1.42e-13 | rear-plate-rim-ref | field 0, line 0 |
| lv – optiland | focusRms.maxAbs (≤ 1.00e-8 mm) | 1.38e-14 | rear-plate-rim-photopic | field 0, line 1 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 3114 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 1.87e-13 | rear-plate-rim-photopic | field 0, line 3, ray 24 |
| lv – ref | intercept.maxAbs [mm] | 5.99e-12 | fixed-iris-zoom-photopic-tele | field 0, line 3, ray 12 |
| lv – ref | focus.maxScaled (≤ 1.00e-8 mm) | 3.83e-14 | odd-asphere-photopic | field 0, line 1 |
| lv – ref | focus.maxAbs [mm] | 2.70e-13 | odd-asphere-photopic | field 0, line 1 |
| lv – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 4.94e-14 | flat-base-asphere-photopic | field 0, line 2 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 3114 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 1.98e-13 | odd-asphere-photopic | field 0, line 1, ray 42 |
| optiland – ref | intercept.maxAbs [mm] | 5.89e-12 | fixed-iris-zoom-photopic-tele | field 0, line 3, ray 12 |
| optiland – ref | focus.maxScaled (≤ 1.00e-8 mm) | 5.47e-14 | rear-plate-rim-ref | field 0, line 0 |
| optiland – ref | focus.maxAbs [mm] | 2.27e-13 | rear-plate-rim-ref | field 0, line 0 |
| optiland – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 5.47e-14 | odd-asphere-photopic | field 0, line 1 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 3114 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: intercept.maxScaled 4.81e-14 mm | PASS: intercept.maxScaled 1.10e-13 mm | PASS: intercept.maxScaled 1.17e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| odd-asphere-photopic | 10 | PASS: intercept.maxScaled 6.07e-14 mm | PASS: intercept.maxScaled 1.86e-13 mm | PASS: intercept.maxScaled 1.98e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| e-line-ref | 3 | PASS: intercept.maxScaled 2.58e-14 mm | PASS: intercept.maxScaled 1.48e-14 mm | PASS: intercept.maxScaled 2.90e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| e-line-photopic | 10 | PASS: intercept.maxScaled 4.51e-14 mm | PASS: intercept.maxScaled 3.47e-14 mm | PASS: intercept.maxScaled 4.35e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| asphere-a20-ref | 3 | PASS: intercept.maxScaled 1.72e-14 mm | PASS: intercept.maxScaled 9.18e-14 mm | PASS: intercept.maxScaled 9.35e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| asphere-a20-photopic | 10 | PASS: intercept.maxScaled 3.54e-14 mm | PASS: intercept.maxScaled 1.04e-13 mm | PASS: intercept.maxScaled 1.01e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| flat-base-asphere-ref | 3 | PASS: intercept.maxScaled 3.86e-14 mm | PASS: intercept.maxScaled 1.39e-13 mm | PASS: intercept.maxScaled 1.27e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| flat-base-asphere-photopic | 10 | PASS: intercept.maxScaled 1.49e-13 mm | PASS: intercept.maxScaled 1.64e-13 mm | PASS: intercept.maxScaled 1.77e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| rear-plate-rim-ref | 3 | PASS: intercept.maxScaled 7.77e-14 mm | PASS: intercept.maxScaled 1.59e-13 mm | PASS: intercept.maxScaled 1.64e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| rear-plate-rim-photopic | 10 | PASS: intercept.maxScaled 1.03e-13 mm | PASS: intercept.maxScaled 1.87e-13 mm | PASS: intercept.maxScaled 1.79e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fixed-iris-zoom-ref-wide | 3 | PASS: intercept.maxScaled 9.17e-15 mm | PASS: intercept.maxScaled 7.68e-14 mm | PASS: intercept.maxScaled 7.74e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fixed-iris-zoom-ref-tele | 3 | PASS: intercept.maxScaled 2.07e-14 mm | PASS: intercept.maxScaled 1.62e-13 mm | PASS: intercept.maxScaled 1.58e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 10 | PASS: intercept.maxScaled 1.70e-14 mm | PASS: intercept.maxScaled 7.74e-14 mm | PASS: intercept.maxScaled 7.62e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fixed-iris-zoom-photopic-tele | 10 | PASS: intercept.maxScaled 2.30e-14 mm | PASS: intercept.maxScaled 1.63e-13 mm | PASS: intercept.maxScaled 1.61e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| zero-asphere-ref | 3 | PASS: intercept.maxScaled 2.84e-14 mm | PASS: intercept.maxScaled 1.39e-14 mm | PASS: intercept.maxScaled 2.13e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| zero-asphere-photopic | 10 | PASS: intercept.maxScaled 3.46e-14 mm | PASS: intercept.maxScaled 1.46e-14 mm | PASS: intercept.maxScaled 2.95e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| stop-inside-element-ref | 3 | PASS: intercept.maxScaled 3.10e-15 mm | PASS: intercept.maxScaled 1.86e-15 mm | PASS: intercept.maxScaled 2.93e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| stop-inside-element-photopic | 10 | PASS: intercept.maxScaled 4.79e-15 mm | PASS: intercept.maxScaled 3.53e-15 mm | PASS: intercept.maxScaled 4.02e-15 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |

## r9a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 1.35e-13 | stop-inside-element-photopic | line 4, ray 18 |
| lv – optiland | distortion.maxScaled (≤ 1.00e-8 mm) | 1.20e-13 | stop-inside-element-photopic | line 0, ray 19 |
| lv – optiland | distortion.maxAbs [percent] | 8.03e-13 | zero-asphere-photopic | line 1, ray 19 |
| lv – optiland | exitPupil.maxScaled (≤ 1.00e-8 mm) | 1.94e-13 | fixed-iris-zoom-photopic-tele | line 2, ray 6 |
| lv – optiland | exitPupil.maxAbs [mm] | 7.98e-12 | fixed-iris-zoom-photopic-tele | line 2, ray 6 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 7996 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lateralColour.maxAbs (≤ 1.00e-8 mm) | 1.10e-13 | flat-base-asphere-photopic | line 3, ray 30 |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 4.01e-13 | asphere-a20-photopic | line 2, ray 12 |
| lv – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.81e-13 | fixed-iris-zoom-photopic-tele | line 1, ray 20 |
| lv – ref | distortion.maxAbs [percent] | 5.22e-12 | fixed-iris-zoom-photopic-tele | line 1, ray 20 |
| lv – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 5.77e-13 | fixed-iris-zoom-photopic-tele | line 2, ray 12 |
| lv – ref | exitPupil.maxAbs [mm] | 6.85e-12 | fixed-iris-zoom-photopic-tele | line 1, ray 6 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 7996 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lateralColour.maxAbs (≤ 1.00e-8 mm) | 1.31e-13 | fixed-iris-zoom-photopic-wide | line 3, ray 8 |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 4.09e-13 | asphere-a20-photopic | line 2, ray 12 |
| optiland – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.79e-13 | fixed-iris-zoom-photopic-tele | line 1, ray 20 |
| optiland – ref | distortion.maxAbs [percent] | 5.19e-12 | fixed-iris-zoom-photopic-tele | line 1, ray 20 |
| optiland – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 5.97e-13 | fixed-iris-zoom-photopic-tele | line 2, ray 12 |
| optiland – ref | exitPupil.maxAbs [mm] | 7.08e-12 | fixed-iris-zoom-photopic-tele | line 1, ray 6 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 7996 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lateralColour.maxAbs (≤ 1.00e-8 mm) | 1.32e-13 | fixed-iris-zoom-photopic-wide | line 3, ray 8 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 4 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 1.48e-13 mm | PASS: landing.maxAbs 1.43e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| odd-asphere-photopic | 4 | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 1.53e-13 mm | PASS: landing.maxAbs 1.54e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| e-line-ref | 4 | PASS: distortion.maxScaled 4.16e-14 mm | PASS: landing.maxAbs 3.20e-14 mm | PASS: landing.maxAbs 5.68e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| e-line-photopic | 4 | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: lateralColour.maxAbs 6.04e-14 mm | PASS: distortion.maxScaled 6.32e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| asphere-a20-ref | 4 | PASS: landing.maxAbs 4.62e-14 mm | PASS: landing.maxAbs 3.68e-13 mm | PASS: landing.maxAbs 3.77e-13 mm | 147 / 2 / 0 | 147 / 2 / 0 | 147 / 2 / 0 |
| asphere-a20-photopic | 4 | PASS: lateralColour.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 4.01e-13 mm | PASS: landing.maxAbs 4.09e-13 mm | 148 / 1 / 0 | 148 / 1 / 0 | 148 / 1 / 0 |
| flat-base-asphere-ref | 4 | PASS: exitPupil.maxScaled 1.12e-13 mm | PASS: exitPupil.maxScaled 1.88e-13 mm | PASS: exitPupil.maxScaled 1.81e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| flat-base-asphere-photopic | 4 | PASS: exitPupil.maxScaled 1.20e-13 mm | PASS: exitPupil.maxScaled 2.06e-13 mm | PASS: exitPupil.maxScaled 2.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| rear-plate-rim-ref | 4 | PASS: landing.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 1.71e-13 mm | PASS: distortion.maxScaled 1.83e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| rear-plate-rim-photopic | 4 | PASS: landing.maxAbs 8.88e-14 mm | PASS: distortion.maxScaled 1.88e-13 mm | PASS: distortion.maxScaled 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fixed-iris-zoom-ref-wide | 4 | PASS: exitPupil.maxScaled 2.08e-14 mm | PASS: exitPupil.maxScaled 2.09e-13 mm | PASS: exitPupil.maxScaled 2.05e-13 mm | 148 / 1 / 0 | 148 / 1 / 0 | 148 / 1 / 0 |
| fixed-iris-zoom-ref-tele | 4 | PASS: exitPupil.maxScaled 3.56e-14 mm | PASS: exitPupil.maxScaled 5.32e-13 mm | PASS: exitPupil.maxScaled 5.37e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 4 | PASS: lateralColour.maxAbs 2.75e-14 mm | PASS: exitPupil.maxScaled 2.04e-13 mm | PASS: exitPupil.maxScaled 2.06e-13 mm | 136 / 13 / 0 | 136 / 13 / 0 | 136 / 13 / 0 |
| fixed-iris-zoom-photopic-tele | 4 | PASS: exitPupil.maxScaled 1.94e-13 mm | PASS: exitPupil.maxScaled 5.77e-13 mm | PASS: exitPupil.maxScaled 5.97e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| zero-asphere-ref | 4 | PASS: exitPupil.maxScaled 6.87e-14 mm | PASS: exitPupil.maxScaled 6.28e-14 mm | PASS: exitPupil.maxScaled 6.69e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| zero-asphere-photopic | 4 | PASS: exitPupil.maxScaled 1.01e-13 mm | PASS: exitPupil.maxScaled 8.45e-14 mm | PASS: exitPupil.maxScaled 9.18e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| stop-inside-element-ref | 4 | PASS: landing.maxAbs 1.28e-13 mm | PASS: distortion.maxScaled 4.69e-14 mm | PASS: landing.maxAbs 1.07e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| stop-inside-element-photopic | 4 | PASS: landing.maxAbs 1.35e-13 mm | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.21e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## r10a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 5.95e-13 | rear-plate-rim-ref | line 0, ray 772 |
| lv – optiland | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 9.15e-14 | stop-inside-element-photopic | line 4, ray 84 |
| lv – optiland | tangentialFocus.maxAbs [mm] | 1.97e-10 | asphere-a20-photopic | line 3, ray 79 |
| lv – optiland | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 4.24e-14 | rear-plate-rim-ref | line 0, ray 823 |
| lv – optiland | sagittalFocus.maxAbs [mm] | 5.49e-13 | fixed-iris-zoom-photopic-tele | line 3, ray 19 |
| lv – optiland | astigmatism.maxAbs [mm] | 1.97e-10 | asphere-a20-photopic | line 3, ray 79 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 91258 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 1830 | — | — |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 6.76e-13 | fixed-iris-zoom-ref-tele | line 0, ray 1552 |
| lv – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.24e-13 | asphere-a20-photopic | line 2, ray 1750 |
| lv – ref | tangentialFocus.maxAbs [mm] | 2.72e-10 | odd-asphere-photopic | line 1, ray 24 |
| lv – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 1.22e-13 | asphere-a20-photopic | line 0, ray 1338 |
| lv – ref | sagittalFocus.maxAbs [mm] | 3.68e-12 | fixed-iris-zoom-photopic-tele | line 1, ray 79 |
| lv – ref | astigmatism.maxAbs [mm] | 2.73e-10 | odd-asphere-photopic | line 1, ray 24 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 91258 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 1830 | — | — |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 6.75e-13 | fixed-iris-zoom-photopic-tele | line 3, ray 1552 |
| optiland – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.13e-13 | asphere-a20-photopic | line 2, ray 1750 |
| optiland – ref | tangentialFocus.maxAbs [mm] | 2.79e-10 | flat-base-asphere-photopic | line 2, ray 84 |
| optiland – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 1.19e-13 | asphere-a20-photopic | line 4, ray 1338 |
| optiland – ref | sagittalFocus.maxAbs [mm] | 3.56e-12 | fixed-iris-zoom-photopic-tele | line 3, ray 79 |
| optiland – ref | astigmatism.maxAbs [mm] | 2.79e-10 | flat-base-asphere-photopic | line 2, ray 84 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 91258 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 1830 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 2 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 3.02e-13 mm | PASS: landing.maxAbs 3.23e-13 mm | 1585 / 251 / 0 | 1585 / 251 / 0 | 1585 / 251 / 0 |
| odd-asphere-photopic | 10 | PASS: landing.maxAbs 1.94e-13 mm | PASS: landing.maxAbs 3.62e-13 mm | PASS: landing.maxAbs 3.87e-13 mm | 7895 / 1285 / 0 | 7895 / 1285 / 0 | 7895 / 1285 / 0 |
| e-line-ref | 2 | PASS: landing.maxAbs 6.57e-14 mm | PASS: landing.maxAbs 4.62e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 1663 / 173 / 0 | 1663 / 173 / 0 | 1663 / 173 / 0 |
| e-line-photopic | 10 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | 8205 / 975 / 0 | 8205 / 975 / 0 | 8205 / 975 / 0 |
| asphere-a20-ref | 2 | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 5.76e-13 mm | PASS: landing.maxAbs 5.58e-13 mm | 1719 / 117 / 0 | 1719 / 117 / 0 | 1719 / 117 / 0 |
| asphere-a20-photopic | 10 | PASS: landing.maxAbs 1.49e-13 mm | PASS: landing.maxAbs 5.65e-13 mm | PASS: landing.maxAbs 5.97e-13 mm | 8450 / 730 / 0 | 8450 / 730 / 0 | 8450 / 730 / 0 |
| flat-base-asphere-ref | 2 | PASS: landing.maxAbs 2.06e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 1598 / 238 / 0 | 1598 / 238 / 0 | 1598 / 238 / 0 |
| flat-base-asphere-photopic | 10 | PASS: landing.maxAbs 2.17e-13 mm | PASS: landing.maxAbs 2.38e-13 mm | PASS: landing.maxAbs 2.63e-13 mm | 7952 / 1228 / 0 | 7952 / 1228 / 0 | 7952 / 1228 / 0 |
| rear-plate-rim-ref | 2 | PASS: landing.maxAbs 5.95e-13 mm | PASS: landing.maxAbs 5.39e-13 mm | PASS: landing.maxAbs 5.81e-13 mm | 1625 / 211 / 0 | 1625 / 211 / 0 | 1625 / 211 / 0 |
| rear-plate-rim-photopic | 10 | PASS: landing.maxAbs 3.55e-13 mm | PASS: landing.maxAbs 5.87e-13 mm | PASS: landing.maxAbs 5.74e-13 mm | 8033 / 1147 / 0 | 8033 / 1147 / 0 | 8033 / 1147 / 0 |
| fixed-iris-zoom-ref-wide | 2 | PASS: landing.maxAbs 3.46e-14 mm | PASS: landing.maxAbs 2.76e-13 mm | PASS: landing.maxAbs 2.78e-13 mm | 1725 / 111 / 0 | 1725 / 111 / 0 | 1725 / 111 / 0 |
| fixed-iris-zoom-ref-tele | 2 | PASS: landing.maxAbs 4.82e-14 mm | PASS: landing.maxAbs 6.76e-13 mm | PASS: landing.maxAbs 6.71e-13 mm | 1819 / 17 / 0 | 1819 / 17 / 0 | 1819 / 17 / 0 |
| fixed-iris-zoom-photopic-wide | 10 | PASS: landing.maxAbs 8.79e-14 mm | PASS: landing.maxAbs 2.97e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | 8503 / 677 / 0 | 8503 / 677 / 0 | 8503 / 677 / 0 |
| fixed-iris-zoom-photopic-tele | 10 | PASS: landing.maxAbs 8.90e-14 mm | PASS: landing.maxAbs 6.75e-13 mm | PASS: landing.maxAbs 6.75e-13 mm | 8945 / 235 / 0 | 8945 / 235 / 0 | 8945 / 235 / 0 |
| zero-asphere-ref | 2 | PASS: landing.maxAbs 7.37e-14 mm | PASS: landing.maxAbs 3.33e-14 mm | PASS: landing.maxAbs 6.31e-14 mm | 1807 / 29 / 0 | 1807 / 29 / 0 | 1807 / 29 / 0 |
| zero-asphere-photopic | 10 | PASS: landing.maxAbs 7.64e-14 mm | PASS: landing.maxAbs 3.73e-14 mm | PASS: landing.maxAbs 5.60e-14 mm | 8854 / 326 / 0 | 8854 / 326 / 0 | 8854 / 326 / 0 |
| stop-inside-element-ref | 2 | PASS: landing.maxAbs 2.38e-13 mm | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 1.88e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| stop-inside-element-photopic | 10 | PASS: landing.maxAbs 2.42e-13 mm | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 2.24e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |

## r11a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | illumination.maxAbs (≤ 1.00e-9) | 1.66e-14 | asphere-a20-photopic | field 3.77e1, line 0 |
| lv – optiland | transmission.maxAbs (≤ 0) | 0 | odd-asphere-ref | field 0, line 0 |
| lv – optiland | transmission.rimBandOrFailed | 0 | odd-asphere-ref | field 0, line 0 |
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 1.46e-13 | stop-inside-element-photopic | field 5.24e1, line 4, ray 2048 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 1294662 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 690 | — | — |
| lv – ref | illumination.maxAbs (≤ 1.00e-9) | 3.13e-14 | fixed-iris-zoom-photopic-wide | field 2.24e1, line 4 |
| lv – ref | transmission.maxAbs (≤ 0) | 0 | odd-asphere-ref | field 0, line 0 |
| lv – ref | transmission.rimBandOrFailed | 0 | odd-asphere-ref | field 0, line 0 |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 1.35e-13 | rear-plate-rim-photopic | field 3.00e1, line 4, ray 2048 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1294662 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 690 | — | — |
| optiland – ref | illumination.maxAbs (≤ 1.00e-9) | 3.38e-14 | fixed-iris-zoom-photopic-wide | field 2.24e1, line 4 |
| optiland – ref | transmission.maxAbs (≤ 0) | 0 | odd-asphere-ref | field 0, line 0 |
| optiland – ref | transmission.rimBandOrFailed | 0 | odd-asphere-ref | field 0, line 0 |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 1.35e-13 | rear-plate-rim-ref | field 3.00e1, line 0, ray 2048 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1294662 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 690 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| odd-asphere-ref | 1 | PASS: landing.maxAbs 3.20e-14 mm | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 3.55e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| odd-asphere-photopic | 5 | PASS: landing.maxAbs 4.62e-14 mm | PASS: landing.maxAbs 3.91e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | 10157 / 88 / 0 | 10157 / 88 / 0 | 10157 / 88 / 0 |
| e-line-ref | 1 | PASS: landing.maxAbs 3.02e-14 mm | PASS: landing.maxAbs 2.84e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| e-line-photopic | 5 | PASS: landing.maxAbs 4.26e-14 mm | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 4.26e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| asphere-a20-ref | 1 | PASS: illumination.maxAbs 1.65e-14 | PASS: illumination.maxAbs 2.34e-14 | PASS: illumination.maxAbs 1.32e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| asphere-a20-photopic | 5 | PASS: illumination.maxAbs 1.66e-14 | PASS: illumination.maxAbs 2.46e-14 | PASS: illumination.maxAbs 1.75e-14 | 10229 / 16 / 0 | 10229 / 16 / 0 | 10229 / 16 / 0 |
| flat-base-asphere-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 9.44e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| flat-base-asphere-photopic | 5 | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| rear-plate-rim-ref | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 2.91e-14 | PASS: illumination.maxAbs 2.78e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| rear-plate-rim-photopic | 5 | PASS: landing.maxAbs 6.75e-14 mm | PASS: illumination.maxAbs 3.12e-14 | PASS: illumination.maxAbs 3.10e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| fixed-iris-zoom-ref-wide | 1 | PASS: illumination.maxAbs 3.00e-15 | PASS: illumination.maxAbs 3.09e-14 | PASS: illumination.maxAbs 3.11e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fixed-iris-zoom-ref-tele | 1 | PASS: landing.maxAbs 1.95e-14 mm | PASS: illumination.maxAbs 1.77e-14 | PASS: illumination.maxAbs 1.90e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fixed-iris-zoom-photopic-wide | 5 | PASS: illumination.maxAbs 3.55e-15 | PASS: illumination.maxAbs 3.13e-14 | PASS: illumination.maxAbs 3.38e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| fixed-iris-zoom-photopic-tele | 5 | PASS: illumination.maxAbs 3.55e-15 | PASS: illumination.maxAbs 1.82e-14 | PASS: illumination.maxAbs 2.04e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| zero-asphere-ref | 1 | PASS: landing.maxAbs 3.29e-14 mm | PASS: illumination.maxAbs 1.55e-15 | PASS: landing.maxAbs 4.35e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| zero-asphere-photopic | 5 | PASS: illumination.maxAbs 4.88e-15 | PASS: illumination.maxAbs 1.89e-15 | PASS: illumination.maxAbs 5.33e-15 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| stop-inside-element-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: illumination.maxAbs 2.33e-15 | PASS: landing.maxAbs 4.62e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| stop-inside-element-photopic | 5 | PASS: landing.maxAbs 1.46e-13 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 1.28e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
