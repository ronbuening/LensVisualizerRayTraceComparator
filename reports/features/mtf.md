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
| Baseline hash | 4b55071f1fe45dedbbe562d13f7dea697b496b093b13523f4df00c4fad29338d |
| Contract version | 1.1 |
| Policy | rungs v13 |
| Policy hash | aea1b9de7ff0dbf4892dd05110bac4e2725fec68f46cdb7b8f4391c9694e4505 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 94778d3d4f0bc86fb092cbc7391f13f1b76780816257d30b074ea41a8c7a119b | 6314b1ed647e5057a408a7a31d9c7c146ee92edb2158d033451a971b37264325 | commit ab0fd4cf94836492b28470953812ed4afc98c0c6, dirty false, engineFileCount 175 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 905727914f01561fe28be507b27f41e38792efa4cbb3d10e3d0c148b2f147015 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | d25c837015c1eddebcb47c6b1c8884452a07829480d52ab0fd1b2bd5b0bafcb6 | 2ed2afe63bbcf29a4a1b8fd09c72c015a5aef1ead3e75c97dd4bb9ef6965dc14 | sourceFiles 11 |
| replay | 1 | 94778d3d4f0bc86fb092cbc7391f13f1b76780816257d30b074ea41a8c7a119b | 83e43b635311d44b07fcd691b8169e962efe2fec6d61874aa1f144b51c4b23e7 | commit ab0fd4cf94836492b28470953812ed4afc98c0c6, dirty false, engineFileCount 175 |

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
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 2.93e-12 | 54 of 54 | stop-inside-element-ref | cut tangential, field 5.53e1, frequencyPerMm 76 |
| lv – optiland | rays.compared [rays] | 104846 | 54 of 54 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 6.79e-12 | 54 of 54 | flat-base-asphere-photopic | cut sagittal, field 1.71e1, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 104846 | 54 of 54 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 6.42e-12 | 54 of 54 | asphere-a20-photopic | cut tangential, field 4.06e1, frequencyPerMm 96 |
| optiland – ref | rays.compared [rays] | 104846 | 54 of 54 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| odd-asphere-photopic | 3 | PASS: mtf.maxAbs 8.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) |
| e-line-ref | 3 | PASS: mtf.maxAbs 6.50e-13 (3 of 3) | PASS: mtf.maxAbs 4.21e-13 (3 of 3) | PASS: mtf.maxAbs 5.31e-13 (3 of 3) |
| e-line-photopic | 3 | PASS: mtf.maxAbs 4.86e-13 (3 of 3) | PASS: mtf.maxAbs 4.50e-13 (3 of 3) | PASS: mtf.maxAbs 3.41e-13 (3 of 3) |
| asphere-a20-ref | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 4.81e-12 (3 of 3) | PASS: mtf.maxAbs 5.73e-12 (3 of 3) |
| asphere-a20-photopic | 3 | PASS: mtf.maxAbs 2.08e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) | PASS: mtf.maxAbs 6.42e-12 (3 of 3) |
| flat-base-asphere-ref | 3 | PASS: mtf.maxAbs 2.58e-12 (3 of 3) | PASS: mtf.maxAbs 6.65e-12 (3 of 3) | PASS: mtf.maxAbs 6.17e-12 (3 of 3) |
| flat-base-asphere-photopic | 3 | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 6.79e-12 (3 of 3) | PASS: mtf.maxAbs 6.01e-12 (3 of 3) |
| rear-plate-rim-ref | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.84e-12 (3 of 3) |
| rear-plate-rim-photopic | 3 | PASS: mtf.maxAbs 5.48e-13 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) | PASS: mtf.maxAbs 4.29e-12 (3 of 3) |
| fixed-iris-zoom-ref-wide | 3 | PASS: mtf.maxAbs 3.12e-13 (3 of 3) | PASS: mtf.maxAbs 3.73e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) |
| fixed-iris-zoom-ref-tele | 3 | PASS: mtf.maxAbs 3.68e-13 (3 of 3) | PASS: mtf.maxAbs 8.41e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | PASS: mtf.maxAbs 2.50e-13 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 2.14e-12 (3 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | PASS: mtf.maxAbs 2.66e-13 (3 of 3) | PASS: mtf.maxAbs 9.29e-13 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) |
| zero-asphere-ref | 3 | PASS: mtf.maxAbs 7.59e-13 (3 of 3) | PASS: mtf.maxAbs 4.62e-13 (3 of 3) | PASS: mtf.maxAbs 6.03e-13 (3 of 3) |
| zero-asphere-photopic | 3 | PASS: mtf.maxAbs 3.55e-13 (3 of 3) | PASS: mtf.maxAbs 1.51e-13 (3 of 3) | PASS: mtf.maxAbs 2.94e-13 (3 of 3) |
| stop-inside-element-ref | 3 | PASS: mtf.maxAbs 2.93e-12 (3 of 3) | PASS: mtf.maxAbs 5.83e-13 (3 of 3) | PASS: mtf.maxAbs 2.99e-12 (3 of 3) |
| stop-inside-element-photopic | 3 | PASS: mtf.maxAbs 1.27e-12 (3 of 3) | PASS: mtf.maxAbs 3.69e-13 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.35e-14 | 18 of 18 | asphere-a20-ref | cut sagittal, field 5.00e-1, frequencyPerMm 8 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 18 of 18 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 18 of 18 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| odd-asphere-ref | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| odd-asphere-photopic | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| e-line-ref | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| e-line-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| asphere-a20-ref | 1 | PASS: mtf.maxAbs 1.35e-14 (1 of 1) |
| asphere-a20-photopic | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| flat-base-asphere-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| flat-base-asphere-photopic | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| rear-plate-rim-ref | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| rear-plate-rim-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| fixed-iris-zoom-ref-wide | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| fixed-iris-zoom-ref-tele | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| fixed-iris-zoom-photopic-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| fixed-iris-zoom-photopic-tele | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| zero-asphere-ref | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| zero-asphere-photopic | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| stop-inside-element-ref | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| stop-inside-element-photopic | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 1.84e-11 | 24 of 54 | asphere-a20-ref | cut tangential, field 2.42e1, frequencyPerMm 60 |
| lv – optiland | phaseStep.waves [waves] | 6.14e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1483 |
| lv – optiland | convergence.maxAbs | 5.56e-2 | 54 of 54 | zero-asphere-ref | cut tangential, field 4.80e1, frequencyPerMm 50 |
| lv – optiland | lattice.columns [cells] | 80 | 54 of 54 | fixed-iris-zoom-ref-wide | — |
| lv – optiland | rays.compared [rays] | 419398 | 54 of 54 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – optiland | waveMtf.flagged | 3.09e-11 | 30 of 54 | zero-asphere-ref | cut sagittal, field 4.80e1, frequencyPerMm 40 |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 4.27e-10 | 24 of 54 | asphere-a20-ref | cut tangential, field 2.42e1, frequencyPerMm 80 |
| lv – ref | phaseStep.waves [waves] | 6.14e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1483 |
| lv – ref | convergence.maxAbs | 5.56e-2 | 54 of 54 | zero-asphere-ref | cut tangential, field 4.80e1, frequencyPerMm 50 |
| lv – ref | lattice.columns [cells] | 80 | 54 of 54 | fixed-iris-zoom-ref-wide | — |
| lv – ref | rays.compared [rays] | 419398 | 54 of 54 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| lv – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| lv – ref | waveMtf.flagged | 6.81e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1, frequencyPerMm 60 |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 4.43e-10 | 24 of 54 | asphere-a20-ref | cut tangential, field 2.42e1, frequencyPerMm 70 |
| optiland – ref | phaseStep.waves [waves] | 6.14e0 | 54 of 54 | e-line-photopic | field 2.34e1, line 1, ray 1483 |
| optiland – ref | convergence.maxAbs | 5.56e-2 | 54 of 54 | zero-asphere-ref | cut tangential, field 4.80e1, frequencyPerMm 50 |
| optiland – ref | lattice.columns [cells] | 80 | 54 of 54 | fixed-iris-zoom-ref-wide | — |
| optiland – ref | rays.compared [rays] | 419398 | 54 of 54 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 54 of 54 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 54 of 54 | odd-asphere-photopic | — |
| optiland – ref | waveMtf.flagged | 6.80e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1, frequencyPerMm 60 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| odd-asphere-ref | 3 | PASS: waveMtf.maxAbs 1.35e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.00e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.06e-11 (3 of 3) |
| odd-asphere-photopic | 3 | PASS: waveMtf.maxAbs 5.62e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.95e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.43e-11 (1 of 3) |
| e-line-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| e-line-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| asphere-a20-ref | 3 | PASS: waveMtf.maxAbs 1.84e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.27e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.43e-10 (2 of 3) |
| asphere-a20-photopic | 3 | PASS: waveMtf.maxAbs 4.41e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.58e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.58e-10 (2 of 3) |
| flat-base-asphere-ref | 3 | PASS: waveMtf.maxAbs 1.17e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.20e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (2 of 3) |
| flat-base-asphere-photopic | 3 | PASS: waveMtf.maxAbs 4.60e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.25e-10 (2 of 3) |
| rear-plate-rim-ref | 3 | PASS: waveMtf.maxAbs 1.64e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.67e-10 (1 of 3) |
| rear-plate-rim-photopic | 3 | PASS: waveMtf.maxAbs 9.05e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.45e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.48e-10 (1 of 3) |
| fixed-iris-zoom-ref-wide | 3 | PASS: waveMtf.maxAbs 5.36e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.04e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.06e-10 (1 of 3) |
| fixed-iris-zoom-ref-tele | 3 | PASS: waveMtf.maxAbs 1.28e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.36e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.47e-10 (2 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | PASS: waveMtf.maxAbs 7.64e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.91e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (2 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | PASS: waveMtf.maxAbs 2.69e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.40e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.39e-10 (2 of 3) |
| zero-asphere-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| zero-asphere-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| stop-inside-element-ref | 3 | PASS: waveMtf.maxAbs 1.90e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.47e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.09e-12 (1 of 3) |
| stop-inside-element-photopic | 3 | PASS: waveMtf.maxAbs 3.46e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.63e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.12e-12 (2 of 3) |

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
- Zoom positions between the two ends, and finite conjugates other than the states a run names.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.
