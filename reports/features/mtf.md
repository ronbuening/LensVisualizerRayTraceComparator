# MTF baseline of features

What the committed MTF baseline of the suite holds, rung by rung, for every run as it was run (a zoom at
each end). A gated rung has a tolerance: for every pair of engines the verdict and the largest value of each
metric over the requests of the run, with the number of requests the metric was measured in, since a rung
measures a figure only where its sampling can arbitrate. A rung of two methods has no tolerance: its figures
are written down beside an attention band, and its tables set the estimates side by side.

This file is rendered from the baseline alone (`lvrtc verify` makes it anew and fails on a byte of
difference): it holds results, counts, names and hashes, and nothing an engine traced. The hash of a run's
case says what its figures are of; `lvrtc baseline check --mtf` says whether the case and the engines are
still those, and what moved.

## Inputs

| Input | Value |
|---|---|
| Suite | features |
| Suite hash | dffbfdd11f2bc3e6c9203e4afe99e207eb441a73417d2fd4ba3d1f95e2183b1e |
| Baseline hash | 3e9f22e63d5227d837837e6feab8135fd239da477864f3c9f355239e30bbdd04 |
| Contract version | 1.1 |
| Policy | rungs v24 |
| Policy hash | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59 | d950739f06bc44c8bff898a823224e9f267dc69aaa6c2029c315298487048a1e | commit 6287f4393ffbc2fd951c7d61f9bc6a024e30591f, dirty false, engineFileCount 184 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 846c50e378e2ebe9f678d9f52ef8594f20cbb96ed773f1e042437710ae947773 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | sourceFiles 13 |
| replay | 1 | fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59 | 7b9996fda36eb76f315491268b845e0dae54d65660bbb0d03e4289f80e497f05 | commit 6287f4393ffbc2fd951c7d61f9bc6a024e30591f, dirty false, engineFileCount 184 |

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
| r4 | rays.trace | 18 | 54 | lv – optiland | 18 PASS | 54 PASS |
| r4 | rays.trace | 18 | 54 | lv – ref | 18 PASS | 54 PASS |
| r4 | rays.trace | 18 | 54 | optiland – ref | 18 PASS | 54 PASS |
| r4f | mtf.native | 18 | 18 | lv – replay | 18 PASS | 18 PASS |
| r6a | rays.trace | 18 | 54 | lv – optiland | 18 PASS | 54 PASS |
| r6a | rays.trace | 18 | 54 | lv – ref | 18 PASS | 54 PASS |
| r6a | rays.trace | 18 | 54 | optiland – ref | 18 PASS | 54 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r4 | lv | 18 ok |
| r4 | optiland | 18 ok |
| r4 | ref | 18 ok |
| r4f | lv | 18 ok |
| r4f | replay | 18 ok |
| r6a | lv | 18 ok |
| r6a | optiland | 18 ok |
| r6a | ref | 18 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.70e-12 | 54 of 54 | stop-inside-element-ref | cut tangential, field 5.53e1, frequencyPerMm 56 |
| lv – optiland | rays.compared [rays] | 142434 | 54 of 54 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 6.91e-12 | 54 of 54 | flat-base-asphere-ref | cut sagittal, field 0, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 142434 | 54 of 54 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 7.22e-12 | 54 of 54 | flat-base-asphere-ref | cut tangential, field 0, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 142434 | 54 of 54 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: mtf.maxAbs 4.03e-13 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) |
| odd-asphere-photopic | 3 | PASS: mtf.maxAbs 5.54e-13 (3 of 3) | PASS: mtf.maxAbs 7.99e-13 (3 of 3) | PASS: mtf.maxAbs 9.57e-13 (3 of 3) |
| e-line-ref | 3 | PASS: mtf.maxAbs 7.08e-13 (3 of 3) | PASS: mtf.maxAbs 4.90e-13 (3 of 3) | PASS: mtf.maxAbs 7.35e-13 (3 of 3) |
| e-line-photopic | 3 | PASS: mtf.maxAbs 5.16e-13 (3 of 3) | PASS: mtf.maxAbs 7.05e-13 (3 of 3) | PASS: mtf.maxAbs 5.18e-13 (3 of 3) |
| asphere-a20-ref | 3 | PASS: mtf.maxAbs 8.84e-13 (3 of 3) | PASS: mtf.maxAbs 6.43e-12 (3 of 3) | PASS: mtf.maxAbs 7.19e-12 (3 of 3) |
| asphere-a20-photopic | 3 | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 5.40e-12 (3 of 3) | PASS: mtf.maxAbs 6.25e-12 (3 of 3) |
| flat-base-asphere-ref | 3 | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 6.91e-12 (3 of 3) | PASS: mtf.maxAbs 7.22e-12 (3 of 3) |
| flat-base-asphere-photopic | 3 | PASS: mtf.maxAbs 4.60e-13 (3 of 3) | PASS: mtf.maxAbs 6.80e-12 (3 of 3) | PASS: mtf.maxAbs 6.48e-12 (3 of 3) |
| rear-plate-rim-ref | 3 | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 4.25e-12 (3 of 3) | PASS: mtf.maxAbs 5.55e-12 (3 of 3) |
| rear-plate-rim-photopic | 3 | PASS: mtf.maxAbs 7.40e-13 (3 of 3) | PASS: mtf.maxAbs 3.24e-12 (3 of 3) | PASS: mtf.maxAbs 3.77e-12 (3 of 3) |
| fixed-iris-zoom-ref-wide | 3 | PASS: mtf.maxAbs 3.17e-13 (3 of 3) | PASS: mtf.maxAbs 4.18e-12 (3 of 3) | PASS: mtf.maxAbs 3.92e-12 (3 of 3) |
| fixed-iris-zoom-ref-tele | 3 | PASS: mtf.maxAbs 4.73e-13 (3 of 3) | PASS: mtf.maxAbs 9.72e-13 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | PASS: mtf.maxAbs 2.07e-13 (3 of 3) | PASS: mtf.maxAbs 2.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.10e-12 (3 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | PASS: mtf.maxAbs 2.61e-13 (3 of 3) | PASS: mtf.maxAbs 9.45e-13 (3 of 3) | PASS: mtf.maxAbs 7.93e-13 (3 of 3) |
| zero-asphere-ref | 3 | PASS: mtf.maxAbs 9.61e-13 (3 of 3) | PASS: mtf.maxAbs 3.46e-13 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) |
| zero-asphere-photopic | 3 | PASS: mtf.maxAbs 3.43e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-13 (3 of 3) | PASS: mtf.maxAbs 2.94e-13 (3 of 3) |
| stop-inside-element-ref | 3 | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 6.00e-13 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) |
| stop-inside-element-photopic | 3 | PASS: mtf.maxAbs 8.78e-13 (3 of 3) | PASS: mtf.maxAbs 5.89e-13 (3 of 3) | PASS: mtf.maxAbs 7.69e-13 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.19e-14 | 18 of 18 | zero-asphere-ref | cut sagittal, field 1, frequencyPerMm 8 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 18 of 18 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 18 of 18 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| odd-asphere-ref | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| odd-asphere-photopic | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| e-line-ref | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| e-line-photopic | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| asphere-a20-ref | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| asphere-a20-photopic | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| flat-base-asphere-ref | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| flat-base-asphere-photopic | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| rear-plate-rim-ref | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| rear-plate-rim-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| fixed-iris-zoom-ref-wide | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| fixed-iris-zoom-ref-tele | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| fixed-iris-zoom-photopic-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| fixed-iris-zoom-photopic-tele | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| zero-asphere-ref | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| zero-asphere-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| stop-inside-element-ref | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| stop-inside-element-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 8.00e-11 | 30 of 54 | flat-base-asphere-ref | cut tangential, field 3.17e1, frequencyPerMm 70 |
| lv – optiland | phaseStep.waves [waves] | 6.37e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1091 |
| lv – optiland | convergence.maxAbs | 7.18e-2 | 54 of 54 | e-line-ref | cut tangential, field 2.34e1, frequencyPerMm 90 |
| lv – optiland | lattice.columns [cells] | 64 | 54 of 54 | odd-asphere-ref | — |
| lv – optiland | rays.compared [rays] | 569990 | 54 of 54 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – optiland | waveMtf.flagged | 9.74e-11 | 24 of 54 | flat-base-asphere-photopic | cut tangential, field 3.17e1, frequencyPerMm 70 |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 6.94e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1, frequencyPerMm 60 |
| lv – ref | phaseStep.waves [waves] | 6.37e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1091 |
| lv – ref | convergence.maxAbs | 7.18e-2 | 54 of 54 | e-line-ref | cut tangential, field 2.34e1, frequencyPerMm 90 |
| lv – ref | lattice.columns [cells] | 64 | 54 of 54 | odd-asphere-ref | — |
| lv – ref | rays.compared [rays] | 569990 | 54 of 54 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – ref | waveMtf.flagged | 4.00e-10 | 24 of 54 | flat-base-asphere-ref | cut tangential, field 0, frequencyPerMm 60 |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 6.97e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1, frequencyPerMm 60 |
| optiland – ref | phaseStep.waves [waves] | 6.37e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1091 |
| optiland – ref | convergence.maxAbs | 7.18e-2 | 54 of 54 | e-line-ref | cut tangential, field 2.34e1, frequencyPerMm 90 |
| optiland – ref | lattice.columns [cells] | 64 | 54 of 54 | odd-asphere-ref | — |
| optiland – ref | rays.compared [rays] | 569990 | 54 of 54 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| optiland – ref | waveMtf.flagged | 4.03e-10 | 24 of 54 | flat-base-asphere-ref | cut tangential, field 0, frequencyPerMm 60 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: waveMtf.maxAbs 3.74e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.51e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.07e-11 (3 of 3) |
| odd-asphere-photopic | 3 | PASS: waveMtf.maxAbs 3.06e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.66e-11 (1 of 3) |
| e-line-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| e-line-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| asphere-a20-ref | 3 | PASS: waveMtf.maxAbs 3.80e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.25e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.28e-10 (2 of 3) |
| asphere-a20-photopic | 3 | PASS: waveMtf.maxAbs 4.43e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.48e-10 (2 of 3) |
| flat-base-asphere-ref | 3 | PASS: waveMtf.maxAbs 8.00e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.26e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.33e-10 (2 of 3) |
| flat-base-asphere-photopic | 3 | PASS: waveMtf.maxAbs 4.37e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.31e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (2 of 3) |
| rear-plate-rim-ref | 3 | PASS: waveMtf.maxAbs 1.37e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.46e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.38e-10 (2 of 3) |
| rear-plate-rim-photopic | 3 | PASS: waveMtf.maxAbs 6.92e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.51e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.51e-10 (2 of 3) |
| fixed-iris-zoom-ref-wide | 3 | PASS: waveMtf.maxAbs 9.36e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.07e-10 (2 of 3) |
| fixed-iris-zoom-ref-tele | 3 | PASS: waveMtf.maxAbs 1.14e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.55e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.62e-10 (3 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | PASS: waveMtf.maxAbs 6.47e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.86e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.82e-10 (2 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | PASS: waveMtf.maxAbs 5.51e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.94e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.97e-10 (3 of 3) |
| zero-asphere-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| zero-asphere-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| stop-inside-element-ref | 3 | PASS: waveMtf.maxAbs 4.17e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.26e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.88e-12 (2 of 3) |
| stop-inside-element-photopic | 3 | PASS: waveMtf.maxAbs 1.65e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.41e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.80e-12 (2 of 3) |

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

No request is marked.

## Not covered

What this comparison does not show, whatever its verdicts:

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.
- A polychromatic curve of optiland's FFT class. It gives a one-line modulus, so several lines have no FFT row in R5 or R6c. R6c's external counterpart is the comparator's complex sum of optiland's raw wavefronts; its synthetic sum proof checks the declared weighting and phase convention, not physical spectral fidelity.
- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Rung R5g is recorded and never gated: a difference of the two pupil samplings is written down, not explained.
- The bins of optiland's geometric MTF. On one line optiland's curve is of landings counted into bins, and a field whose bins move a value by more than a band has no optiland curve. On several lines the sum over optiland's landings is the worker's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.
- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom and focus positions other than the states a run names, and the catalog beyond these suites.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.
