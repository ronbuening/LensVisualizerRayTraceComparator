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
| Baseline hash | 84ca8243f4df7910de8c8607ca3b3948cbe0f668f05ba9e80cc8db40de27a9b3 |
| Contract version | 1.1 |
| Policy | rungs v10 |
| Policy hash | 239a222c5dfcfcad8847826fcd136bfec8d42663cda84f3b26febae191a79c62 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | cdbbbce9025d6af6c839748efb360b839b88c77226660dc39202113aeb1084ce | commit 33ebdb30b619a02edcf03f6d930bc1ef5e4e6905, dirty false, engineFileCount 151 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | e505ad9abe7ea56e6e985a4a98ee5b06602adb3e3bd2532941314fb7ba940712 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | cf9f034646e8fb811815bc6335e461ce69caf5da94a7b39b428c0146c996fe38 | d94e3fcb4a6cdf6e79745d1a432a75827bfdf20010c163ca7573fcfdf5a7b950 | sourceFiles 11 |
| replay | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | d8e91ec07971c1e99e4d2c259411473eaf0c9f47aef7728936a2f263fc368389 | commit 33ebdb30b619a02edcf03f6d930bc1ef5e4e6905, dirty false, engineFileCount 151 |

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
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 4.79e-8 | 54 of 54 | stop-inside-element-ref | cut tangential, field 5.53e1, frequencyPerMm 94 |
| lv – optiland | rays.compared [rays] | 104846 | 54 of 54 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 4.79e-8 | 54 of 54 | stop-inside-element-ref | cut tangential, field 5.53e1, frequencyPerMm 94 |
| lv – ref | rays.compared [rays] | 104846 | 54 of 54 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 6.70e-12 | 54 of 54 | flat-base-asphere-ref | cut sagittal, field 0, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 104846 | 54 of 54 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: mtf.maxAbs 1.15e-8 (3 of 3) | PASS: mtf.maxAbs 1.15e-8 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) |
| odd-asphere-photopic | 3 | PASS: mtf.maxAbs 7.07e-9 (3 of 3) | PASS: mtf.maxAbs 7.07e-9 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) |
| e-line-ref | 3 | PASS: mtf.maxAbs 1.40e-8 (3 of 3) | PASS: mtf.maxAbs 1.40e-8 (3 of 3) | PASS: mtf.maxAbs 7.44e-13 (3 of 3) |
| e-line-photopic | 3 | PASS: mtf.maxAbs 1.11e-8 (3 of 3) | PASS: mtf.maxAbs 1.11e-8 (3 of 3) | PASS: mtf.maxAbs 3.87e-13 (3 of 3) |
| asphere-a20-ref | 3 | PASS: mtf.maxAbs 3.08e-8 (3 of 3) | PASS: mtf.maxAbs 3.08e-8 (3 of 3) | PASS: mtf.maxAbs 5.50e-12 (3 of 3) |
| asphere-a20-photopic | 3 | PASS: mtf.maxAbs 1.08e-8 (3 of 3) | PASS: mtf.maxAbs 1.08e-8 (3 of 3) | PASS: mtf.maxAbs 5.25e-12 (3 of 3) |
| flat-base-asphere-ref | 3 | PASS: mtf.maxAbs 2.11e-8 (3 of 3) | PASS: mtf.maxAbs 2.11e-8 (3 of 3) | PASS: mtf.maxAbs 6.70e-12 (3 of 3) |
| flat-base-asphere-photopic | 3 | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 6.31e-12 (3 of 3) |
| rear-plate-rim-ref | 3 | PASS: mtf.maxAbs 9.72e-9 (3 of 3) | PASS: mtf.maxAbs 9.72e-9 (3 of 3) | PASS: mtf.maxAbs 4.85e-12 (3 of 3) |
| rear-plate-rim-photopic | 3 | PASS: mtf.maxAbs 4.12e-9 (3 of 3) | PASS: mtf.maxAbs 4.12e-9 (3 of 3) | PASS: mtf.maxAbs 4.31e-12 (3 of 3) |
| fixed-iris-zoom-ref-wide | 3 | PASS: mtf.maxAbs 3.93e-9 (3 of 3) | PASS: mtf.maxAbs 3.93e-9 (3 of 3) | PASS: mtf.maxAbs 3.37e-12 (3 of 3) |
| fixed-iris-zoom-ref-tele | 3 | PASS: mtf.maxAbs 1.22e-8 (3 of 3) | PASS: mtf.maxAbs 1.22e-8 (3 of 3) | PASS: mtf.maxAbs 1.26e-12 (3 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | PASS: mtf.maxAbs 3.37e-9 (3 of 3) | PASS: mtf.maxAbs 3.37e-9 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | PASS: mtf.maxAbs 1.22e-8 (3 of 3) | PASS: mtf.maxAbs 1.22e-8 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) |
| zero-asphere-ref | 3 | PASS: mtf.maxAbs 2.59e-9 (3 of 3) | PASS: mtf.maxAbs 2.59e-9 (3 of 3) | PASS: mtf.maxAbs 4.32e-13 (3 of 3) |
| zero-asphere-photopic | 3 | PASS: mtf.maxAbs 1.88e-9 (3 of 3) | PASS: mtf.maxAbs 1.88e-9 (3 of 3) | PASS: mtf.maxAbs 4.95e-13 (3 of 3) |
| stop-inside-element-ref | 3 | PASS: mtf.maxAbs 4.79e-8 (3 of 3) | PASS: mtf.maxAbs 4.79e-8 (3 of 3) | PASS: mtf.maxAbs 4.19e-12 (3 of 3) |
| stop-inside-element-photopic | 3 | PASS: mtf.maxAbs 3.31e-8 (3 of 3) | PASS: mtf.maxAbs 3.31e-8 (3 of 3) | PASS: mtf.maxAbs 9.85e-13 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.21e-14 | 18 of 18 | fixed-iris-zoom-ref-tele | cut sagittal, field 7.50e-1, frequencyPerMm 36 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 18 of 18 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 18 of 18 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| odd-asphere-ref | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| odd-asphere-photopic | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| e-line-ref | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| e-line-photopic | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| asphere-a20-ref | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| asphere-a20-photopic | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| flat-base-asphere-ref | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| flat-base-asphere-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| rear-plate-rim-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| rear-plate-rim-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| fixed-iris-zoom-ref-wide | 1 | PASS: mtf.maxAbs 1.11e-14 (1 of 1) |
| fixed-iris-zoom-ref-tele | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| fixed-iris-zoom-photopic-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| fixed-iris-zoom-photopic-tele | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| zero-asphere-ref | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| zero-asphere-photopic | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| stop-inside-element-ref | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| stop-inside-element-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.maxAbs (≤ 4.00e-5) | 1.45e-6 | 24 of 54 | odd-asphere-ref | cut sagittal, field 1.53e1, frequencyPerMm 100 |
| lv – optiland | phaseStep.waves [waves] | 6.14e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1549 |
| lv – optiland | convergence.maxAbs | 5.56e-2 | 54 of 54 | zero-asphere-ref | cut tangential, field 4.80e1, frequencyPerMm 50 |
| lv – optiland | lattice.columns [cells] | 80 | 54 of 54 | fixed-iris-zoom-ref-wide | — |
| lv – optiland | rays.compared [rays] | 419398 | 54 of 54 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – optiland | waveMtf.flagged | 1.18e-6 | 30 of 54 | fixed-iris-zoom-ref-wide | cut sagittal, field 0, frequencyPerMm 100 |
| lv – ref | waveMtf.maxAbs (≤ 4.00e-5) | 1.45e-6 | 24 of 54 | odd-asphere-ref | cut sagittal, field 1.53e1, frequencyPerMm 100 |
| lv – ref | phaseStep.waves [waves] | 6.14e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1483 |
| lv – ref | convergence.maxAbs | 5.56e-2 | 54 of 54 | zero-asphere-ref | cut tangential, field 4.80e1, frequencyPerMm 50 |
| lv – ref | lattice.columns [cells] | 80 | 54 of 54 | fixed-iris-zoom-ref-wide | — |
| lv – ref | rays.compared [rays] | 419398 | 54 of 54 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – ref | waveMtf.flagged | 1.18e-6 | 30 of 54 | fixed-iris-zoom-ref-wide | cut sagittal, field 0, frequencyPerMm 100 |
| optiland – ref | waveMtf.maxAbs (≤ 4.00e-5) | 4.41e-10 | 24 of 54 | asphere-a20-ref | cut tangential, field 2.42e1, frequencyPerMm 70 |
| optiland – ref | phaseStep.waves [waves] | 6.14e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1549 |
| optiland – ref | convergence.maxAbs | 5.56e-2 | 54 of 54 | zero-asphere-ref | cut tangential, field 4.80e1, frequencyPerMm 50 |
| optiland – ref | lattice.columns [cells] | 80 | 54 of 54 | fixed-iris-zoom-ref-wide | — |
| optiland – ref | rays.compared [rays] | 419398 | 54 of 54 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| optiland – ref | waveMtf.flagged | 6.83e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1, frequencyPerMm 60 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: waveMtf.maxAbs 1.45e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.45e-6 (3 of 3) | PASS: waveMtf.maxAbs 8.47e-11 (3 of 3) |
| odd-asphere-photopic | 3 | PASS: waveMtf.maxAbs 2.22e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.22e-7 (1 of 3) | PASS: waveMtf.maxAbs 7.61e-11 (1 of 3) |
| e-line-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| e-line-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| asphere-a20-ref | 3 | PASS: waveMtf.maxAbs 2.73e-7 (2 of 3) | PASS: waveMtf.maxAbs 2.73e-7 (2 of 3) | PASS: waveMtf.maxAbs 4.41e-10 (2 of 3) |
| asphere-a20-photopic | 3 | PASS: waveMtf.maxAbs 6.93e-7 (2 of 3) | PASS: waveMtf.maxAbs 6.93e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.57e-10 (2 of 3) |
| flat-base-asphere-ref | 3 | PASS: waveMtf.maxAbs 8.75e-7 (2 of 3) | PASS: waveMtf.maxAbs 8.75e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.30e-10 (2 of 3) |
| flat-base-asphere-photopic | 3 | PASS: waveMtf.maxAbs 6.97e-7 (2 of 3) | PASS: waveMtf.maxAbs 6.97e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.30e-10 (2 of 3) |
| rear-plate-rim-ref | 3 | PASS: waveMtf.maxAbs 3.05e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.05e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.66e-10 (1 of 3) |
| rear-plate-rim-photopic | 3 | PASS: waveMtf.maxAbs 2.90e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.90e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.55e-10 (1 of 3) |
| fixed-iris-zoom-ref-wide | 3 | PASS: waveMtf.maxAbs 3.26e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.26e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.07e-10 (1 of 3) |
| fixed-iris-zoom-ref-tele | 3 | PASS: waveMtf.maxAbs 3.85e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.85e-7 (2 of 3) | PASS: waveMtf.maxAbs 2.52e-10 (2 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | PASS: waveMtf.maxAbs 1.44e-6 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-6 (2 of 3) | PASS: waveMtf.maxAbs 1.91e-10 (2 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | PASS: waveMtf.maxAbs 4.29e-7 (2 of 3) | PASS: waveMtf.maxAbs 4.29e-7 (2 of 3) | PASS: waveMtf.maxAbs 2.35e-10 (2 of 3) |
| zero-asphere-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| zero-asphere-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| stop-inside-element-ref | 3 | PASS: waveMtf.maxAbs 1.91e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.91e-7 (1 of 3) | PASS: waveMtf.maxAbs 6.97e-12 (1 of 3) |
| stop-inside-element-photopic | 3 | PASS: waveMtf.maxAbs 3.53e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.53e-7 (2 of 3) | PASS: waveMtf.maxAbs 5.85e-12 (2 of 3) |

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

No request is marked.

## Not covered

What this comparison does not show, whatever its verdicts:

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.
- The formation of a polychromatic MTF. optiland's FFT MTF is of one line and gives a modulus, so a run on several lines has no optiland row in rung R5; its external counterpart is the comparator's estimator on optiland's wavefront, which is a later stage.
- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Rung R5g is recorded and never gated: a difference of the two pupil samplings is written down, not explained.
- The bins of optiland's geometric MTF. On one line optiland's curve is of landings counted into bins, and a field whose bins move a value by more than a band has no optiland curve. On several lines the sum over optiland's landings is the worker's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.
- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom positions between the two ends, and finite conjugates other than the states a run names.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.
