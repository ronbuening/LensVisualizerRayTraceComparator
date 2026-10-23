# MTF baseline of focus-stations

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
| Suite | focus-stations |
| Suite hash | 1e790649ed6c0737eceb4acd810e5bd33ba4f9b9373f8b27eb1f045fa0222092 |
| Baseline hash | 11cf154d7885ddd097d3da410af3723370e9eb69a6784bd19698ccabcb01aa1d |
| Contract version | 1.3 |
| Policy | rungs v14 |
| Policy hash | 693c4a981e4c624693b3759c7b7d5d363a09bc00b2c4eeecfc77c3134437e120 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 7b756ee63bd252b76b978a1dbc18185a9c565c118ed662ec694def8ca72c6a56 | 842d3acb45d7d0bb2ac1adec106bd771ec5f68a5b92662bf76dc5cf887e04725 | commit ab0fd4cf94836492b28470953812ed4afc98c0c6, dirty false, engineFileCount 177 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 905727914f01561fe28be507b27f41e38792efa4cbb3d10e3d0c148b2f147015 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | d25c837015c1eddebcb47c6b1c8884452a07829480d52ab0fd1b2bd5b0bafcb6 | 15a954ff46c3b6c4b9f05371470b3b4f35f5edaea95d1a960e8ff021f1f38c07 | sourceFiles 11 |
| replay | 1 | 7b756ee63bd252b76b978a1dbc18185a9c565c118ed662ec694def8ca72c6a56 | 48a9f01030b9996d1a413adf23b5723f7ecd9ed538dcc2e2d4e5f187366751fc | commit ab0fd4cf94836492b28470953812ed4afc98c0c6, dirty false, engineFileCount 177 |

| Run | Case |
|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | fc151b4a7fce9eb6bd7cc921ae0aac90889a0a0ce32ce45a29a1e82ee4829163 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 60619bd4baf81548766df4c3116e5e242c60b6e76eb91b5ba7b529d5bf98da43 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 132b9c776877d26b52cfee3c52c84222bd3ea592c01750c9c8343657878d8e01 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 595902c51920e15a684e43442f525e782c5fd37cf04988fd37cecc8a37c3831a |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | f68826b235dcdb9b1a080ce6c6dce150615f139b9183dd3caf27f8730843c71e |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | — |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1164cee682861c41cdaee67a2c90276d64d5de2fe42e604e3ebae359cff863c3 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 20ee691a337d6dc6bab309e9198c10c7374a1a91d265b6e6a974b68ee81b201c |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | bf047195927f492dbe4747fb624b130c606b392e3f16ff70286deb608dfc2341 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 302349c7dd8c39bf7c9bab45e376a3645ef723aafa50f3d4b15c3b8502fab4ea |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 5ee5d6fc109ea15cef91551aff548035327ae5028efaec01df78fcc2b6608bbc |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 10bbcde40490c2a5b6cb4fcdb237f2ce8a89a226b6b5c1c1074cc87df438b98f |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3960852d628118b47a9025ca29343cac422df54bcc12632ea5e9b231455d10e0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | eb7807b4cfcfd26953355cd6d2dc67b1e74c587de9d15e7e36dde33cd66d3c76 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 558d181f7fe332e3f23e8fdfad4450baebad65a414c4ccc62804034611b56743 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | d444984ee236770b2f9ba0d4e1d135c698f24dc9c636595cbc35310d6a2bca6d |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 09377d60ff786893e1adbe31707a39fe50cde373b16ee745d20b4a98cbc63314 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | af803a345eceb552147d179153ef223bf8679379eded36910c955aae8ab2253b |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3836e9fa92a4a9bdd7ce5c136193abc660dbba9fcd4384eb7eb9588500b08bcd |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 162fbfc11fb7a78c9127dcf04561dcb3cf52f09c723c8bd9ac0f5ee0a2464aa8 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | d6a1a73811dcd0b316bb34898cdd039502942c39a69062a8ab2c377aa0e2e84c |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | — |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1477f4fdb398fd9b71a31f246c2837fd16fb7c5f91bf6bf2879b16dc9932223a |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 66c1a2eaf12c6eeb84ccb9824fdb009ec3f7e7ada17037d8deb5c1958cbe12d8 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 9533eca7053a8bc10f4eeae48eea4464ded9c10af7ff2d87ee539c6b915c4550 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | a4833d79d00d382fa390dd019c9723f000a3e9c1293d8d966da9bf5fed7e6afc |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 8babe67e5197b131e65d73cdc653dcf3c192383218cb2e476f3b9aa47014ba70 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | a89f33e9185b8cf898740610c762695af016674daf383c23a6dcee5201a37cd4 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 94333a4c6df8cc43a470b47e022a04a53db3e1d7d79a5ba80c6e56f98fca6528 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | a8647fae8029be2bbb735502f3904d6bff855c77571825ed21fd270d131b91be |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3e0050bebabe2ef394e5d2a37f4207cc23cec8692ccaaa1e5a1680f556ea3161 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | c80693a543423dc3f2f66317ac902f03c0a2b95cbae540c9246886a7829a9f41 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1f2050f3ba63d37649fbe6d3b5bc5c9500708235a6e230e074cbb0cb0b823f8b |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 9861b90fd6db9b9f3a48574414fc54db4bb3d35e4305fd3501d3c01b90867182 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | ad86753053be0d5553e0ac77582552827499aa8854a085dfaff6deeec538ef67 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 84abefd3a467f7e971f22f378b13ad510daf83064a76ac598db4b54a71bdec5d |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | b1088647562098bff4d5314279289015235d449bf6e6ca512b103bbfceb4c6fd |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 42d45f93538e8180fad99717955a3b213beb7e8f041199719684fe202799fa7d |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | e30f376ef3f6eb25645b36ba5d2ab1ced553a01076092487ebd631db3ad217da |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | c722c7755ca07f86f1eb5ec78d0147a3efa415ac37bb1ab9c2ee06c98dab7c87 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 5cf10d8c8b6422ed2e37591a15107cc7364b74bc8d8c9565670743267f111297 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 81be87b898b8d464108529510c67cb301efc5ba64aa33e87df9a55c8c44afea8 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 43123fa14ee4fbc8974b977b8ef3e55b0ade560f6b4f136fcde4b12a1c0360af |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | fcc388dfb093202522dfc6b38721670eb337a04168b81f3e1a97b7bb38160e29 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | e843015bc39fa4c39ce7c8ee808652256e83bf19b0c46c3a1074d790c9acc203 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | efa493ba8bf49dc60ce7a5f9297c0dd1865cc5c83a70aaf84053b6bc44f90838 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 42e0f9ef38bebc0d0a65967ef4c188c024c3c1964ffba9aaed6289e786797581 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | d8b0395277a164fdd227d1d0fc214a6f43ed5b8ee699a36d8a8f923b693cf311 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 79b9a2dd1a1f4b9e1a61920049b945fa20db71aa2baaba82caf74bd42428ac8a |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 32e225863877c36beae5121e98e5190eb46496cb423de153b18086ae78704334 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | c7bd0cc65d8af8e0d38aae675c665c2fe627eec3a9b13e2c23be2f32a7a8908f |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 8f0d0bb5ce374c8c4e68ad7d302e4e21e8a42db7797f81d01f0b836a3cf2c378 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 0521f47cf726e1b8d53848d880a02b94f32fb78ec6c9a9326f58926990146863 |

## Run problems

| Run | Problem |
|---|---|
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r4 | rays.trace | 53 | 155 | lv – optiland | 53 PASS | 155 PASS |
| r4 | rays.trace | 53 | 155 | lv – ref | 53 PASS | 155 PASS |
| r4 | rays.trace | 53 | 155 | optiland – ref | 53 PASS | 155 PASS |
| r4f | mtf.native | 53 | 53 | lv – replay | 53 PASS | 53 PASS |
| r6a | rays.trace | 53 | 155 | lv – optiland | 53 PASS | 155 PASS |
| r6a | rays.trace | 53 | 155 | lv – ref | 53 PASS | 155 PASS |
| r6a | rays.trace | 53 | 155 | optiland – ref | 53 PASS | 155 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r4 | lv | 53 ok |
| r4 | optiland | 53 ok |
| r4 | ref | 53 ok |
| r4f | lv | 53 ok |
| r4f | replay | 53 ok |
| r6a | lv | 53 ok |
| r6a | optiland | 53 ok |
| r6a | ref | 53 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 3.95e-11 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1.83e1, frequencyPerMm 100 |
| lv – optiland | rays.compared [rays] | 107776 | 155 of 155 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 155 of 155 | — | — |
| lv – optiland | lines.compared [lines] | 1 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.96e-11 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1.83e1, frequencyPerMm 84 |
| lv – ref | rays.compared [rays] | 107776 | 155 of 155 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 155 of 155 | — | — |
| lv – ref | lines.compared [lines] | 1 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 5.04e-11 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1.83e1, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 107776 | 155 of 155 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 155 of 155 | — | — |
| optiland – ref | lines.compared [lines] | 1 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.95e-11 (3 of 3) | PASS: mtf.maxAbs 1.96e-11 (3 of 3) | PASS: mtf.maxAbs 5.04e-11 (3 of 3) |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.58e-12 (3 of 3) | PASS: mtf.maxAbs 7.85e-12 (3 of 3) | PASS: mtf.maxAbs 8.94e-12 (3 of 3) |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.12e-12 (3 of 3) | PASS: mtf.maxAbs 4.34e-12 (3 of 3) | PASS: mtf.maxAbs 2.37e-12 (3 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: mtf.maxAbs 2.05e-12 (2 of 2) | PASS: mtf.maxAbs 3.09e-12 (2 of 2) | PASS: mtf.maxAbs 3.23e-12 (2 of 2) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 9.25e-13 (3 of 3) | PASS: mtf.maxAbs 3.47e-12 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.96e-13 (3 of 3) | PASS: mtf.maxAbs 4.19e-13 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 8.38e-13 (3 of 3) | PASS: mtf.maxAbs 2.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.27e-13 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) | PASS: mtf.maxAbs 1.52e-12 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: mtf.maxAbs 7.02e-13 (3 of 3) | PASS: mtf.maxAbs 8.47e-13 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: mtf.maxAbs 5.58e-13 (2 of 2) | PASS: mtf.maxAbs 1.63e-12 (2 of 2) | PASS: mtf.maxAbs 1.58e-12 (2 of 2) |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.32e-13 (3 of 3) | PASS: mtf.maxAbs 2.97e-13 (3 of 3) | PASS: mtf.maxAbs 3.28e-13 (3 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 4.50e-12 (3 of 3) | PASS: mtf.maxAbs 5.50e-12 (3 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: mtf.maxAbs 7.42e-13 (1 of 1) | PASS: mtf.maxAbs 4.15e-12 (1 of 1) | PASS: mtf.maxAbs 3.41e-12 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.78e-12 (3 of 3) | PASS: mtf.maxAbs 2.38e-12 (3 of 3) | PASS: mtf.maxAbs 4.72e-12 (3 of 3) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 2.52e-12 (3 of 3) | PASS: mtf.maxAbs 1.67e-12 (3 of 3) | PASS: mtf.maxAbs 2.96e-12 (3 of 3) |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.36e-12 (3 of 3) | PASS: mtf.maxAbs 6.30e-12 (3 of 3) | PASS: mtf.maxAbs 3.96e-12 (3 of 3) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.63e-12 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) | PASS: mtf.maxAbs 3.35e-12 (3 of 3) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 5.17e-12 (3 of 3) | PASS: mtf.maxAbs 4.20e-12 (3 of 3) | PASS: mtf.maxAbs 3.66e-12 (3 of 3) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.49e-12 (3 of 3) | PASS: mtf.maxAbs 2.67e-12 (3 of 3) | PASS: mtf.maxAbs 3.22e-12 (3 of 3) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: mtf.maxAbs 9.90e-13 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 5.97e-12 (3 of 3) | PASS: mtf.maxAbs 5.95e-12 (3 of 3) |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 9.48e-13 (3 of 3) | PASS: mtf.maxAbs 3.10e-12 (3 of 3) | PASS: mtf.maxAbs 3.15e-12 (3 of 3) |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 8.79e-13 (3 of 3) | PASS: mtf.maxAbs 4.81e-12 (3 of 3) | PASS: mtf.maxAbs 4.97e-12 (3 of 3) |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.20e-12 (3 of 3) | PASS: mtf.maxAbs 5.00e-12 (3 of 3) | PASS: mtf.maxAbs 5.67e-12 (3 of 3) |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.69e-12 (3 of 3) | PASS: mtf.maxAbs 6.03e-12 (3 of 3) |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.43e-12 (3 of 3) | PASS: mtf.maxAbs 3.83e-12 (3 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 6.17e-12 (3 of 3) | PASS: mtf.maxAbs 5.07e-12 (3 of 3) | PASS: mtf.maxAbs 2.74e-12 (3 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: mtf.maxAbs 5.42e-12 (3 of 3) | PASS: mtf.maxAbs 4.29e-12 (3 of 3) | PASS: mtf.maxAbs 2.04e-12 (3 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: mtf.maxAbs 3.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) | PASS: mtf.maxAbs 2.91e-12 (3 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 7.50e-13 (3 of 3) | PASS: mtf.maxAbs 1.67e-12 (3 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 2.17e-12 (3 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: mtf.maxAbs 2.99e-12 (3 of 3) | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.62e-12 (3 of 3) | PASS: mtf.maxAbs 5.45e-12 (3 of 3) | PASS: mtf.maxAbs 6.05e-12 (3 of 3) |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 9.32e-13 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 1.73e-12 (3 of 3) |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) | PASS: mtf.maxAbs 2.99e-12 (3 of 3) |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.33e-12 (3 of 3) | PASS: mtf.maxAbs 2.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.32e-12 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: mtf.maxAbs 1.74e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: mtf.maxAbs 2.86e-12 (3 of 3) | PASS: mtf.maxAbs 2.18e-12 (3 of 3) | PASS: mtf.maxAbs 9.10e-13 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: mtf.maxAbs 2.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 2.06e-12 (3 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.89e-12 (3 of 3) | PASS: mtf.maxAbs 5.71e-12 (3 of 3) | PASS: mtf.maxAbs 5.74e-12 (3 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 7.13e-12 (3 of 3) | PASS: mtf.maxAbs 6.87e-12 (3 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: mtf.maxAbs 7.41e-12 (3 of 3) | PASS: mtf.maxAbs 7.84e-12 (3 of 3) | PASS: mtf.maxAbs 9.71e-12 (3 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.98e-12 (3 of 3) | PASS: mtf.maxAbs 5.20e-12 (3 of 3) | PASS: mtf.maxAbs 5.84e-12 (3 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: mtf.maxAbs 3.65e-12 (3 of 3) | PASS: mtf.maxAbs 5.35e-12 (3 of 3) | PASS: mtf.maxAbs 5.02e-12 (3 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: mtf.maxAbs 5.20e-12 (3 of 3) | PASS: mtf.maxAbs 6.79e-12 (3 of 3) | PASS: mtf.maxAbs 3.90e-12 (3 of 3) |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 6.53e-12 (3 of 3) | PASS: mtf.maxAbs 7.41e-12 (3 of 3) |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 8.48e-13 (3 of 3) | PASS: mtf.maxAbs 5.36e-12 (3 of 3) | PASS: mtf.maxAbs 5.08e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 2.10e-14 | 53 of 53 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1, frequencyPerMm 98 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 53 of 53 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 53 of 53 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | PASS: mtf.maxAbs 2.10e-14 (1 of 1) |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.41e-14 (1 of 1) |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.42e-14 (1 of 1) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.39e-14 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | PASS: mtf.maxAbs 1.45e-14 (1 of 1) |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 1 | PASS: mtf.maxAbs 1.50e-14 (1 of 1) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 1 | PASS: mtf.maxAbs 1.12e-14 (1 of 1) |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.30e-14 (1 of 1) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: mtf.maxAbs 1.81e-14 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.23e-14 (1 of 1) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.44e-14 (1 of 1) |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.44e-14 (1 of 1) |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.55e-14 (1 of 1) |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.18e-14 (1 of 1) |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.22e-14 (1 of 1) |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.31e-14 (1 of 1) |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.67e-14 (1 of 1) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 1 | PASS: mtf.maxAbs 1.18e-14 (1 of 1) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 1 | PASS: mtf.maxAbs 1.74e-14 (1 of 1) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 1 | PASS: mtf.maxAbs 2.01e-14 (1 of 1) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.55e-14 (1 of 1) |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.61e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.flagged | 8.49e-10 | 109 of 155 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | cut sagittal, field 0, frequencyPerMm 100 |
| lv – optiland | phaseStep.waves [waves] | 3.89e2 | 153 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 0, line 0, ray 474 |
| lv – optiland | convergence.maxAbs | 1.03e-1 | 153 of 155 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | cut sagittal, field 1.05e1, frequencyPerMm 90 |
| lv – optiland | lattice.columns [cells] | 96 | 155 of 155 | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | — |
| lv – optiland | rays.compared [rays] | 430262 | 155 of 155 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 155 of 155 | — | — |
| lv – optiland | lines.compared [lines] | 1 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 5.03e-10 | 44 of 155 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | cut tangential, field 0, frequencyPerMm 100 |
| lv – ref | waveMtf.flagged | 1.11e-9 | 109 of 155 | certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | cut tangential, field 3.26e1, frequencyPerMm 70 |
| lv – ref | phaseStep.waves [waves] | 3.89e2 | 153 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 0, line 0, ray 474 |
| lv – ref | convergence.maxAbs | 1.03e-1 | 153 of 155 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | cut sagittal, field 1.05e1, frequencyPerMm 90 |
| lv – ref | lattice.columns [cells] | 96 | 155 of 155 | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | — |
| lv – ref | rays.compared [rays] | 430262 | 155 of 155 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 155 of 155 | — | — |
| lv – ref | lines.compared [lines] | 1 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 4.54e-10 | 44 of 155 | certified-samyang-af-14mm-f28-ef-zoom0-focus1 | cut tangential, field 3.94e1, frequencyPerMm 80 |
| optiland – ref | waveMtf.flagged | 1.06e-9 | 109 of 155 | certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | cut tangential, field 3.26e1, frequencyPerMm 70 |
| optiland – ref | phaseStep.waves [waves] | 3.89e2 | 153 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 0, line 0, ray 474 |
| optiland – ref | convergence.maxAbs | 1.03e-1 | 153 of 155 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | cut sagittal, field 1.05e1, frequencyPerMm 90 |
| optiland – ref | lattice.columns [cells] | 96 | 155 of 155 | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | — |
| optiland – ref | rays.compared [rays] | 430262 | 155 of 155 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 155 of 155 | — | — |
| optiland – ref | lines.compared [lines] | 1 | 155 of 155 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 4.33e-10 | 44 of 155 | certified-samyang-af-14mm-f28-ef-zoom0-focus1 | cut tangential, field 3.94e1, frequencyPerMm 80 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 2.24e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.19e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.26e-10 (2 of 3) |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.92e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.14e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (1 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.54e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.91e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.56e-11 (1 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 7.33e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.35e-11 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 2.34e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.43e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.46e-10 (2 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: waveMtf.maxAbs 1.60e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.20e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.25e-10 (2 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: waveMtf.maxAbs 1.08e-11 (1 of 2) | PASS: waveMtf.maxAbs 1.80e-10 (1 of 2) | PASS: waveMtf.maxAbs 1.87e-10 (1 of 2) |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 5.34e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.08e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.97e-12 (2 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.39e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.54e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.33e-10 (2 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.12e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.00e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-11 (2 of 3) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: waveMtf.maxAbs 2.93e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.95e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.97e-11 (2 of 3) |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 2.88e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.00e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.88e-10 (2 of 3) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.30e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.73e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.71e-10 (1 of 3) |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 5.75e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.65e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.07e-11 (1 of 3) |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: waveMtf.maxAbs 3.01e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.43e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (1 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: waveMtf.maxAbs 5.08e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.32e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.98e-11 (1 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: waveMtf.maxAbs 1.26e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.11e-10 (3 of 3) |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.76e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.28e-10 (3 of 3) |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 2.35e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.80e-11 (3 of 3) |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.89e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.20e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.65e-10 (1 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: waveMtf.maxAbs 4.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.08e-11 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: waveMtf.maxAbs 6.82e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.39e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.86e-11 (1 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 5.03e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.01e-10 (2 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.23e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.85e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.12e-10 (2 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |

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
