# Baseline of benchmark

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
| Suite | benchmark |
| Suite hash | 27333fa1ef567a2ac3310215fc3e886a6ba2aa55f30c5177c6d6d951fb067b09 |
| Baseline hash | 776cad8200d9289512c1c102e15e6bcc8d5410fd2cb49fea721d205237a86748 |
| Contract version | 1.0 |
| Policy | rungs v5 |
| Policy hash | a8f4e2615c842b14d14a4c49fe35c44ad6afdcece70151894393b84e2a79207c |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | 51202ba5f582611402f303c0ddfd045ddf6be8fde4f6b6a1ad7bd5e6a014f331 | commit c05a2ab75b4aa5bcd8563a46e5c5a21a5d7f99a5, dirty false, engineFileCount 151 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 81fae6bce47637151e2c76ce9558c03cc7cc0153ba60ff68720656f018b90480 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | cf9f034646e8fb811815bc6335e461ce69caf5da94a7b39b428c0146c996fe38 | 8e98f6976845a9bcd8794386f7e74ea2af13ebc647eaddb24dc0cf6f01d05b39 | sourceFiles 11 |

| Run | Case |
|---|---|
| canon-ef-135-f2l-usm-ref | a6d48ab35a2b156dfd289972da3c241235e5719e4f44394dba994b88ef855811 |
| canon-ef-135-f2l-usm-photopic | 7546b205d77d460b81f5677e6f68df4e9dd48411a4daf40ae81d369241376dfb |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0def626662ce8a5a044699cc91f10cdfc2451c31abcd493d9937ea5bdc45c0ec |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | b8f48f28bf24a2f9c1b3a21a1bc99860d4e459b20d1281ec2af3069c9a3111c6 |
| sigma-35mm-f14-dg-hsm-a-ref | cdac8e4c2106aa6698e08404431909cc479c67ce822c7ec38f4c42fe8c072a4e |
| sigma-35mm-f14-dg-hsm-a-photopic | 1c6f0b1cef5938e7761eb57799b4c1a56426c888a5cd008ac534ec3aed4bc295 |
| nikkor-z50f12-ref | e1be649bb890ed1a95b7b63fa4aa669de231ce9fb83905644a5845e327992132 |
| nikkor-z50f12-photopic | a48cd12c268fce7f40073f4073332978ffe6aa0b31c3df5430eda49655dc8743 |
| sony-fe-20mm-f18-g-ref | 50516f089be0c4b129c64debab14519ba562b703940872ad3a5ec7347087014f |
| sony-fe-20mm-f18-g-photopic | 578066dcc4d993c9e2998eed77b34361e33cb29701fa3bfa8ff2c694db137b3c |
| sony-fe-400mm-f28-gm-oss-ref | 6c7a2ee7b7e696475bf459c1e274cb8ab63631b0662c947d03c3b185a1babfb4 |
| sony-fe-400mm-f28-gm-oss-photopic | 2a0ec3806b69968108caa7beaf501604584cfad203f842420a3fb7aefa4c6828 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 2c260cf3bcac5229f06ba783a895a8a2d1764c7160a4db212fa8fc82b3b080b4 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 8894694fd3bae9f442610f1015ab84b93b6e4e002d18d38b39ac103232f48f85 |
| nikon-z-24-70f4s-wide-ref | 674bf87ee00a2855de1cc25379ed3059c489c6dbce8d3217c4d1569ac61001a9 |
| nikon-z-24-70f4s-wide-photopic | 028766236f660e50f5758c50196a3781bb32d228d8d7b9536f143cdad27d83c4 |
| nikon-z-24-70f4s-tele-ref | 7a9c860bd996825e31a09fd968074bbe7b78fd6e0751b9f24a5f078654aaeada |
| nikon-z-24-70f4s-tele-photopic | b59d35d7c806b2049983b82296e1bd9c09410a057c81fcc475e497554e09b6aa |
| nikon-z-mc-105f28-ref | 49213d8444e9b7728378948db9623f6ab5c3224c3b423aa3d49a397150931851 |
| nikon-z-mc-105f28-photopic | 4f58ff165467b6c0b7bfccdbd29cf02ede1979a7978f3be4737ac4b0a29d05b1 |
| nikon-z-135f18-plena-ref | d793020832ec36218155ce810f9a12833e80ffdb25c3a8fa5f1ff9365e4a288d |
| nikon-z-135f18-plena-photopic | 783c198b65d92ad17c8fd60a0b2ebf6db6bb170fe7cecbe9ff5c1d72b5da4cdd |
| sigma-45mm-f28-dg-dn-contemporary-ref | 35e161a10718741831dac37bbd61a43e14e8850254481ddaeba9e5411e27bab4 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0d6bf53241b18117397d8e5ed7e0ea2c198ce050f6af301e88ae5e0fffbf2ea7 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 24 | 24 | lv – optiland | 24 PASS | 24 PASS |
| r0 | system.describe | 24 | 24 | lv – ref | 24 PASS | 24 PASS |
| r0 | system.describe | 24 | 24 | optiland – ref | 24 PASS | 24 PASS |
| r1 | paraxial.first-order | 24 | 24 | lv – optiland | 24 PASS | 24 PASS |
| r1 | paraxial.first-order | 24 | 24 | lv – ref | 24 PASS | 24 PASS |
| r1 | paraxial.first-order | 24 | 24 | optiland – ref | 24 PASS | 24 PASS |
| r2 | rays.trace | 24 | 216 | lv – optiland | 24 PASS | 216 PASS |
| r2 | rays.trace | 24 | 216 | lv – ref | 24 PASS | 216 PASS |
| r2 | rays.trace | 24 | 216 | optiland – ref | 24 PASS | 216 PASS |
| r3 | rays.trace | 24 | 216 | lv – optiland | 24 PASS | 216 PASS |
| r3 | rays.trace | 24 | 216 | lv – ref | 24 PASS | 216 PASS |
| r3 | rays.trace | 24 | 216 | optiland – ref | 24 PASS | 216 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 24 ok |
| r0 | optiland | 24 ok |
| r0 | ref | 24 ok |
| r1 | lv | 24 ok |
| r1 | optiland | 24 ok |
| r1 | ref | 24 ok |
| r2 | lv | 24 ok |
| r2 | optiland | 24 ok |
| r2 | ref | 24 ok |
| r3 | lv | 24 ok |
| r3 | optiland | 24 ok |
| r3 | ref | 24 ok |

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 3.94e-16 | nikon-z-24-70f4s-wide-ref | sample 6, surface 10 |
| lv – optiland | sag.maxAbs [mm] | 3.55e-15 | sony-fe-400mm-f28-gm-oss-ref | sample 8, surface 13 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 3.97e-16 | sony-fe-20mm-f18-g-ref | sample 8, surface 6 |
| lv – ref | sag.maxAbs [mm] | 3.55e-15 | sony-fe-400mm-f28-gm-oss-ref | sample 8, surface 13 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 4.51e-16 | sony-fe-20mm-f18-g-ref | sample 6, surface 0 |
| optiland – ref | sag.maxAbs [mm] | 1.78e-15 | canon-ef-135-f2l-usm-ref | sample 8, surface 8 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| nikkor-z50f12-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| sony-fe-20mm-f18-g-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| nikon-z-24-70f4s-wide-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-mc-105f28-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | firstOrder.maxAbs (≤ 1.00e-9 mm) | 1.82e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 1, quantity frontFocalZ |
| lv – optiland | pupilZ.maxScaled (≤ 1.00e-9 mm) | 7.96e-13 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilZ |
| lv – optiland | pupilZ.maxAbs [mm] | 7.96e-13 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilZ |
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 5.68e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 5.68e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 1.59e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 1, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 4.26e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 2, quantity exitPupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 4.26e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 2, quantity exitPupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 1.82e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 5.68e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 5.68e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| nikkor-z50f12-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-400mm-f28-gm-oss-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | PASS: firstOrder.maxAbs 1.82e-12 mm | PASS: firstOrder.maxAbs 1.59e-12 mm | PASS: firstOrder.maxAbs 1.82e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-wide-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-tele-ref | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-photopic | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-mc-105f28-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-135f18-plena-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 6.77e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164, surface 23 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 3.13e-10 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 9.12e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 137596 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 6.77e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164, surface 23 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 3.13e-10 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 9.12e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 137596 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.19e-12 | nikon-z-24-70f4s-wide-photopic | field 2.42e1, line 4, ray 556, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 2.07e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 2, ray 89 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 8.89e-13 | sony-fe-20mm-f18-g-ref | field 4.75e1, line 0, ray 88 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 137596 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: landing.maxDistance 1.28e-9 mm | PASS: landing.maxDistance 1.28e-9 mm | PASS: landing.maxDistance 1.71e-13 mm | 1667 / 1438 / 0 | 1667 / 1438 / 0 | 1667 / 1438 / 0 |
| canon-ef-135-f2l-usm-photopic | 15 | PASS: hits.maxDistance 1.14e-9 mm | PASS: hits.maxDistance 1.14e-9 mm | PASS: landing.maxDistance 1.92e-13 mm | 8379 / 7146 / 0 | 8379 / 7146 / 0 | 8379 / 7146 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: hits.maxDistance 2.02e-9 mm | PASS: hits.maxDistance 2.02e-9 mm | PASS: landing.maxDistance 9.36e-14 mm | 2043 / 1272 / 0 | 2043 / 1272 / 0 | 2043 / 1272 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | PASS: hits.maxDistance 2.00e-9 mm | PASS: hits.maxDistance 2.00e-9 mm | PASS: landing.maxDistance 1.25e-13 mm | 10239 / 6336 / 0 | 10239 / 6336 / 0 | 10239 / 6336 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: landing.maxDistance 3.95e-9 mm | PASS: landing.maxDistance 3.95e-9 mm | PASS: hits.maxDistance 1.02e-12 mm | 1721 / 1452 / 0 | 1721 / 1452 / 0 | 1721 / 1452 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | PASS: landing.maxDistance 9.12e-9 mm | PASS: landing.maxDistance 9.12e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 8591 / 7274 / 0 | 8591 / 7274 / 0 | 8591 / 7274 / 0 |
| nikkor-z50f12-ref | 3 | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 1661 / 1444 / 0 | 1661 / 1444 / 0 | 1661 / 1444 / 0 |
| nikkor-z50f12-photopic | 15 | PASS: hits.maxDistance 1.30e-9 mm | PASS: hits.maxDistance 1.30e-9 mm | PASS: hits.maxDistance 1.05e-12 mm | 8341 / 7184 / 0 | 8341 / 7184 / 0 | 8341 / 7184 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: landing.maxDistance 2.18e-9 mm | PASS: landing.maxDistance 2.18e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 2301 / 1338 / 0 | 2301 / 1338 / 0 | 2301 / 1338 / 0 |
| sony-fe-20mm-f18-g-photopic | 15 | PASS: landing.maxDistance 2.67e-9 mm | PASS: landing.maxDistance 2.67e-9 mm | PASS: hits.maxDistance 1.11e-12 mm | 11517 / 6678 / 0 | 11517 / 6678 / 0 | 11517 / 6678 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: hits.maxDistance 1.19e-9 mm | PASS: hits.maxDistance 1.19e-9 mm | PASS: landing.maxDistance 3.48e-13 mm | 1885 / 1440 / 0 | 1885 / 1440 / 0 | 1885 / 1440 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | PASS: hits.maxDistance 1.19e-9 mm | PASS: hits.maxDistance 1.19e-9 mm | PASS: landing.maxDistance 4.43e-13 mm | 9471 / 7154 / 0 | 9471 / 7154 / 0 | 9471 / 7154 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: hits.maxDistance 1.32e-9 mm | PASS: hits.maxDistance 1.32e-9 mm | PASS: landing.maxDistance 1.99e-13 mm | 1901 / 1414 / 0 | 1901 / 1414 / 0 | 1901 / 1414 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | PASS: hits.maxDistance 1.33e-9 mm | PASS: hits.maxDistance 1.33e-9 mm | PASS: landing.maxDistance 1.84e-13 mm | 9487 / 7088 / 0 | 9487 / 7088 / 0 | 9487 / 7088 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: hits.maxDistance 3.07e-9 mm | PASS: hits.maxDistance 3.07e-9 mm | PASS: hits.maxDistance 1.12e-12 mm | 2215 / 1280 / 0 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-wide-photopic | 15 | PASS: hits.maxDistance 3.09e-9 mm | PASS: hits.maxDistance 3.09e-9 mm | PASS: hits.maxDistance 1.19e-12 mm | 11061 / 6774 / 0 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: hits.maxDistance 1.21e-9 mm | PASS: hits.maxDistance 1.21e-9 mm | PASS: hits.maxDistance 9.71e-13 mm | 1929 / 1242 / 0 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-tele-photopic | 15 | PASS: landing.maxDistance 1.24e-9 mm | PASS: landing.maxDistance 1.24e-9 mm | PASS: hits.maxDistance 1.00e-12 mm | 9631 / 6224 / 0 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-mc-105f28-ref | 3 | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 9.17e-13 mm | 1751 / 1278 / 0 | 1751 / 1278 / 0 | 1751 / 1278 / 0 |
| nikon-z-mc-105f28-photopic | 15 | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 9.16e-13 mm | 8755 / 6390 / 0 | 8755 / 6390 / 0 | 8755 / 6390 / 0 |
| nikon-z-135f18-plena-ref | 3 | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 9.34e-13 mm | 2005 / 1454 / 0 | 2005 / 1454 / 0 | 2005 / 1454 / 0 |
| nikon-z-135f18-plena-photopic | 15 | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 9.79e-13 mm | 10021 / 6914 / 0 | 10021 / 6914 / 0 | 10021 / 6914 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 1839 / 1332 / 0 | 1839 / 1332 / 0 | 1839 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.05e-12 mm | 9185 / 6670 / 0 | 9185 / 6670 / 0 | 9185 / 6670 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.00e-6 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 200 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 5.33e-6 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 579 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 5.52e-6 | nikon-z-24-70f4s-tele-photopic | field 1.66e1, line 1, ray 197 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.00e-6 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 200 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 5.33e-6 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 579 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 5.52e-6 | nikon-z-24-70f4s-tele-photopic | field 1.66e1, line 1, ray 197 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.72e-9 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 1, ray 413 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.72e-9 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 1, ray 413 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.72e-9 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 1, ray 1024 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: opd.maxAbs 2.48e-6 waves | PASS: opd.maxAbs 2.48e-6 waves | PASS: opticalPathToImage.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-photopic | 15 | PASS: opd.maxAbs 4.99e-6 waves | PASS: opd.maxAbs 4.98e-6 waves | PASS: opd.maxAbs 3.63e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: opd.maxAbs 4.47e-6 waves | PASS: opd.maxAbs 4.47e-6 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | PASS: opd.maxAbs 4.80e-6 waves | PASS: opd.maxAbs 4.80e-6 waves | PASS: opticalPathToImage.maxAbs 3.02e-10 waves |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: opticalPath.maxAbs 4.22e-6 waves | PASS: opticalPath.maxAbs 4.22e-6 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | PASS: opticalPath.maxAbs 6.00e-6 waves | PASS: opticalPath.maxAbs 6.00e-6 waves | PASS: opticalPath.maxAbs 1.57e-9 waves |
| nikkor-z50f12-ref | 3 | PASS: opticalPath.maxAbs 3.38e-6 waves | PASS: opticalPath.maxAbs 3.38e-6 waves | PASS: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-photopic | 15 | PASS: opticalPath.maxAbs 3.64e-6 waves | PASS: opticalPath.maxAbs 3.64e-6 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| sony-fe-20mm-f18-g-ref | 3 | PASS: opd.maxAbs 3.99e-6 waves | PASS: opd.maxAbs 3.99e-6 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.33e-6 waves | PASS: opticalPathToImage.maxAbs 5.33e-6 waves | PASS: opticalPathToImage.maxAbs 2.00e-9 waves |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: opticalPath.maxAbs 3.18e-6 waves | PASS: opticalPath.maxAbs 3.18e-6 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | PASS: opticalPath.maxAbs 4.13e-6 waves | PASS: opticalPath.maxAbs 4.13e-6 waves | PASS: opd.maxAbs 1.94e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: opticalPath.maxAbs 4.33e-6 waves | PASS: opticalPath.maxAbs 4.33e-6 waves | PASS: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | PASS: opticalPath.maxAbs 5.39e-6 waves | PASS: opticalPath.maxAbs 5.39e-6 waves | PASS: opd.maxAbs 4.61e-10 waves |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: opd.maxAbs 3.82e-6 waves | PASS: opd.maxAbs 3.82e-6 waves | PASS: opticalPath.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-wide-photopic | 15 | PASS: opd.maxAbs 5.27e-6 waves | PASS: opd.maxAbs 5.27e-6 waves | PASS: opticalPath.maxAbs 2.72e-9 waves |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: opd.maxAbs 4.89e-6 waves | PASS: opd.maxAbs 4.89e-6 waves | PASS: opd.maxAbs 1.64e-9 waves |
| nikon-z-24-70f4s-tele-photopic | 15 | PASS: opd.maxAbs 5.52e-6 waves | PASS: opd.maxAbs 5.52e-6 waves | PASS: opticalPath.maxAbs 1.89e-9 waves |
| nikon-z-mc-105f28-ref | 3 | PASS: opticalPathToImage.maxAbs 2.98e-6 waves | PASS: opticalPathToImage.maxAbs 2.98e-6 waves | PASS: opd.maxAbs 8.71e-10 waves |
| nikon-z-mc-105f28-photopic | 15 | PASS: opticalPathToImage.maxAbs 3.70e-6 waves | PASS: opticalPathToImage.maxAbs 3.70e-6 waves | PASS: opd.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-ref | 3 | PASS: opticalPathToImage.maxAbs 3.67e-6 waves | PASS: opticalPathToImage.maxAbs 3.67e-6 waves | PASS: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-photopic | 15 | PASS: opticalPathToImage.maxAbs 4.34e-6 waves | PASS: opticalPathToImage.maxAbs 4.34e-6 waves | PASS: opd.maxAbs 1.02e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: opd.maxAbs 2.41e-6 waves | PASS: opd.maxAbs 2.41e-6 waves | PASS: opticalPath.maxAbs 1.77e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | PASS: opticalPath.maxAbs 3.01e-6 waves | PASS: opticalPath.maxAbs 3.01e-6 waves | PASS: opd.maxAbs 2.27e-9 waves |
