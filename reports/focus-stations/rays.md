# Baseline of focus-stations

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
| Suite | focus-stations |
| Suite hash | 1e790649ed6c0737eceb4acd810e5bd33ba4f9b9373f8b27eb1f045fa0222092 |
| Baseline hash | a095b3d19ba5e826593c023438c6547755d0facb980ebb0e7abe92d257563cb2 |
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
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 61b10ec1e9b1f97c48595bb029e1dd87e711967e557ec890debf2d1b78be23bd |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 4796c91049d6d85a7a7ead5ad24ce0f0559f0cd29463bbd93c08d2526d84522b |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | bebc9392adca28c39136e0b93ef7dab17fc07529a3bf2d2329cb33d87370b203 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 10bbcde40490c2a5b6cb4fcdb237f2ce8a89a226b6b5c1c1074cc87df438b98f |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3960852d628118b47a9025ca29343cac422df54bcc12632ea5e9b231455d10e0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | eb7807b4cfcfd26953355cd6d2dc67b1e74c587de9d15e7e36dde33cd66d3c76 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 5f620f64d9e311902a46343054f2ad6864724f805cad14c855f707d8614d7c6a |
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
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 6c56c2c2c0d95b395b854cfaf466ccb5af0b6c17219d973cfb59e103c6812b24 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | ef02f7b2a5e99dbf32ab1bd453404e8ebe5457cad2c9ed81ee62022023eb2086 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 344ffcebce2fd7e171947a10bf1678c99337548f1b863f0bc642925b37958288 |
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
| r0 | system.describe | 60 | 60 | lv – optiland | 60 PASS | 60 PASS |
| r0 | system.describe | 60 | 60 | lv – ref | 60 PASS | 60 PASS |
| r0 | system.describe | 60 | 60 | optiland – ref | 60 PASS | 60 PASS |
| r1 | paraxial.first-order | 60 | 60 | lv – optiland | 60 PASS | 60 PASS |
| r1 | paraxial.first-order | 60 | 60 | lv – ref | 60 PASS | 60 PASS |
| r1 | paraxial.first-order | 60 | 60 | optiland – ref | 60 PASS | 60 PASS |
| r2 | rays.trace | 60 | 176 | lv – optiland | 60 PASS | 176 PASS |
| r2 | rays.trace | 60 | 176 | lv – ref | 60 PASS | 176 PASS |
| r2 | rays.trace | 60 | 176 | optiland – ref | 60 PASS | 176 PASS |
| r3 | rays.trace | 60 | 176 | lv – optiland | 60 PASS | 176 PASS |
| r3 | rays.trace | 60 | 176 | lv – ref | 60 PASS | 176 PASS |
| r3 | rays.trace | 60 | 176 | optiland – ref | 60 PASS | 176 PASS |
| r4 | rays.trace | 60 | 176 | lv – optiland | 60 PASS | 176 PASS |
| r4 | rays.trace | 60 | 176 | lv – ref | 60 PASS | 176 PASS |
| r4 | rays.trace | 60 | 176 | optiland – ref | 60 PASS | 176 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 60 ok |
| r0 | optiland | 60 ok |
| r0 | ref | 60 ok |
| r1 | lv | 60 ok |
| r1 | optiland | 60 ok |
| r1 | ref | 60 ok |
| r2 | lv | 60 ok |
| r2 | optiland | 60 ok |
| r2 | ref | 60 ok |
| r3 | lv | 60 ok |
| r3 | optiland | 60 ok |
| r3 | ref | 60 ok |
| r4 | lv | 60 ok |
| r4 | optiland | 60 ok |
| r4 | ref | 60 ok |

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 6.04e-16 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | sample 6, surface 28 |
| lv – optiland | sag.maxAbs [mm] | 4.00e-15 | certified-sigma-135mm-f14-dg-art-zoom0-focus1 | sample 8, surface 14 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 3.81e-16 | certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | sample 4, surface 14 |
| lv – ref | sag.maxAbs [mm] | 5.33e-15 | certified-sigma-85mm-f12-dg-art-zoom0-focus1 | sample 8, surface 2 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 6.04e-16 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | sample 6, surface 28 |
| optiland – ref | sag.maxAbs [mm] | 5.33e-15 | certified-sigma-85mm-f12-dg-art-zoom0-focus1 | sample 8, surface 2 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.20e-16 | PASS: sag.maxScaled 2.47e-16 | PASS: sag.maxScaled 2.22e-16 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.23e-16 | PASS: sag.maxScaled 3.50e-16 | PASS: sag.maxScaled 3.50e-16 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.77e-16 | PASS: sag.maxScaled 2.23e-16 | PASS: sag.maxScaled 3.39e-16 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.12e-16 | PASS: sag.maxScaled 2.66e-16 | PASS: sag.maxScaled 2.67e-16 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.12e-16 | PASS: sag.maxScaled 2.66e-16 | PASS: sag.maxScaled 2.67e-16 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.77e-16 | PASS: sag.maxScaled 3.60e-16 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.77e-16 | PASS: sag.maxScaled 3.60e-16 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.78e-16 | PASS: sag.maxScaled 2.94e-16 | PASS: sag.maxScaled 3.11e-16 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.78e-16 | PASS: sag.maxScaled 2.94e-16 | PASS: sag.maxScaled 3.11e-16 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.64e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.23e-16 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 2.39e-16 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 2.39e-16 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 2.39e-16 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 1.93e-16 | PASS: sag.maxScaled 2.93e-16 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 1.93e-16 | PASS: sag.maxScaled 2.93e-16 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 1.93e-16 | PASS: sag.maxScaled 2.93e-16 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 1.71e-16 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 1 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 2.53e-16 | PASS: sag.maxScaled 2.53e-16 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.31e-16 | PASS: sag.maxScaled 2.78e-16 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.31e-16 | PASS: sag.maxScaled 2.78e-16 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.49e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.61e-16 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.65e-16 | PASS: sag.maxScaled 3.30e-16 | PASS: sag.maxScaled 3.30e-16 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.65e-16 | PASS: sag.maxScaled 3.30e-16 | PASS: sag.maxScaled 3.30e-16 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.50e-16 | PASS: sag.maxScaled 2.33e-16 | PASS: sag.maxScaled 3.63e-16 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 1 | PASS: sag.maxScaled 2.50e-16 | PASS: sag.maxScaled 2.33e-16 | PASS: sag.maxScaled 3.63e-16 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 1 | PASS: sag.maxScaled 2.50e-16 | PASS: sag.maxScaled 2.33e-16 | PASS: sag.maxScaled 3.63e-16 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.09e-16 | PASS: sag.maxScaled 3.00e-16 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.08e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.89e-16 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.33e-16 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.60e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.61e-16 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.33e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.83e-16 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.40e-16 | PASS: sag.maxScaled 2.64e-16 | PASS: sag.maxScaled 3.58e-16 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.26e-16 | PASS: sag.maxScaled 3.81e-16 | PASS: sag.maxScaled 3.26e-16 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.63e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 5.45e-16 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 1 | PASS: sag.maxScaled 3.63e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 5.45e-16 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 1 | PASS: sag.maxScaled 3.63e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 5.45e-16 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 1 | PASS: sag.maxScaled 2.17e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 3.48e-16 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 1 | PASS: sag.maxScaled 2.17e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 3.48e-16 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 1 | PASS: sag.maxScaled 2.17e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 3.48e-16 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 2.67e-16 | PASS: sag.maxScaled 3.66e-16 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.91e-16 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.91e-16 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.35e-16 | PASS: sag.maxScaled 3.35e-16 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.35e-16 | PASS: sag.maxScaled 3.35e-16 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.35e-16 | PASS: sag.maxScaled 3.35e-16 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 1 | PASS: sag.maxScaled 1.85e-16 | PASS: sag.maxScaled 1.72e-16 | PASS: sag.maxScaled 2.46e-16 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.23e-16 | PASS: sag.maxScaled 3.37e-16 | PASS: sag.maxScaled 3.23e-16 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 1 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 2.99e-16 | PASS: sag.maxScaled 2.18e-16 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 1 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 2.99e-16 | PASS: sag.maxScaled 2.18e-16 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 1 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 2.99e-16 | PASS: sag.maxScaled 2.18e-16 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 1 | PASS: sag.maxScaled 6.04e-16 | PASS: sag.maxScaled 2.19e-16 | PASS: sag.maxScaled 6.04e-16 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 1 | PASS: sag.maxScaled 6.04e-16 | PASS: sag.maxScaled 2.19e-16 | PASS: sag.maxScaled 6.04e-16 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 1 | PASS: sag.maxScaled 6.04e-16 | PASS: sag.maxScaled 2.19e-16 | PASS: sag.maxScaled 6.04e-16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.99e-16 | PASS: sag.maxScaled 2.64e-16 | PASS: sag.maxScaled 3.99e-16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 1 | PASS: sag.maxScaled 2.99e-16 | PASS: sag.maxScaled 2.64e-16 | PASS: sag.maxScaled 3.99e-16 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 1 | PASS: sag.maxScaled 2.99e-16 | PASS: sag.maxScaled 2.64e-16 | PASS: sag.maxScaled 3.99e-16 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 1.94e-16 | PASS: sag.maxScaled 3.24e-16 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.92e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 2.92e-16 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.07e-16 | PASS: sag.maxScaled 2.22e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | firstOrder.maxAbs (≤ 1.00e-9 mm) | 4.09e-12 | certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | line 0, quantity frontFocalZ |
| lv – optiland | pupilZ.maxScaled (≤ 1.00e-9 mm) | 2.44e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilZ |
| lv – optiland | pupilZ.maxAbs [mm] | 2.44e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilZ |
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.81e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 9.81e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.27e-12 | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | line 0, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 2.61e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 2.61e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 1.01e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 1.01e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 4.32e-12 | certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.82e-12 | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | line 0, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.82e-12 | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | line 0, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 2.27e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | line 0, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 2.27e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | line 0, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm | PASS: firstOrder.maxAbs 1.60e-14 mm |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 4.44e-14 mm | PASS: pupilZ.maxScaled 1.42e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 2.22e-12 mm | PASS: pupilZ.maxScaled 1.71e-12 mm | PASS: pupilZ.maxScaled 5.12e-13 mm |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | PASS: pupilZ.maxScaled 2.44e-12 mm | PASS: pupilZ.maxScaled 2.61e-12 mm | PASS: pupilZ.maxScaled 1.71e-13 mm |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: pupilZ.maxScaled 1.42e-13 mm | PASS: pupilZ.maxScaled 9.95e-14 mm |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: pupilZ.maxScaled 5.68e-14 mm | PASS: firstOrder.maxAbs 2.13e-14 mm |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 9.95e-14 mm | PASS: pupilZ.maxScaled 7.11e-14 mm | PASS: pupilRadius.maxScaled 5.68e-14 mm |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | PASS: pupilZ.maxScaled 1.78e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 5.68e-13 mm | PASS: pupilZ.maxScaled 4.55e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 1 | PASS: firstOrder.maxAbs 1.99e-13 mm | PASS: pupilZ.maxScaled 5.68e-14 mm | PASS: firstOrder.maxAbs 1.99e-13 mm |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 1 | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 2.27e-13 mm |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 1 | PASS: pupilZ.maxScaled 1.42e-12 mm | PASS: pupilZ.maxScaled 6.82e-13 mm | PASS: pupilZ.maxScaled 7.39e-13 mm |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: pupilZ.maxScaled 8.53e-14 mm |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 1.78e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 1 | PASS: firstOrder.maxAbs 6.25e-13 mm | PASS: firstOrder.maxAbs 2.27e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: pupilZ.maxScaled 5.68e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 1.85e-13 mm | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.28e-13 mm |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 1 | PASS: pupilZ.maxScaled 1.71e-13 mm | PASS: pupilZ.maxScaled 1.99e-13 mm | PASS: firstOrder.maxAbs 4.26e-14 mm |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 3.55e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 9.95e-14 mm | PASS: firstOrder.maxAbs 9.95e-14 mm | PASS: pupilZ.maxScaled 7.11e-14 mm |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 1 | PASS: pupilZ.maxScaled 8.53e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: pupilZ.maxScaled 7.11e-14 mm |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 8.53e-14 mm | PASS: pupilZ.maxScaled 5.68e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: pupilZ.maxScaled 1.42e-14 mm |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: pupilZ.maxScaled 1.71e-13 mm | PASS: pupilZ.maxScaled 1.71e-13 mm |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 2.13e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 8.88e-15 mm | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: pupilZ.maxScaled 5.68e-14 mm | PASS: firstOrder.maxAbs 2.13e-14 mm |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | PASS: pupilRadius.maxScaled 1.78e-14 mm | PASS: firstOrder.maxAbs 2.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 3.91e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm | PASS: firstOrder.maxAbs 6.75e-14 mm |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 1 | PASS: firstOrder.maxAbs 1.39e-13 mm | PASS: firstOrder.maxAbs 1.23e-13 mm | PASS: pupilZ.maxScaled 5.68e-14 mm |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 4.69e-13 mm | PASS: firstOrder.maxAbs 2.44e-13 mm |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 1 | PASS: firstOrder.maxAbs 1.99e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.30e-13 mm |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 1 | PASS: firstOrder.maxAbs 3.69e-13 mm | PASS: firstOrder.maxAbs 3.13e-13 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 1 | PASS: firstOrder.maxAbs 1.59e-12 mm | PASS: firstOrder.maxAbs 3.98e-13 mm | PASS: firstOrder.maxAbs 1.25e-12 mm |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 8.53e-14 mm | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 1 | PASS: firstOrder.maxAbs 1.71e-13 mm | PASS: firstOrder.maxAbs 2.27e-13 mm | PASS: firstOrder.maxAbs 2.27e-13 mm |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: pupilZ.maxScaled 1.71e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 1 | PASS: firstOrder.maxAbs 1.36e-12 mm | PASS: firstOrder.maxAbs 2.27e-12 mm | PASS: pupilZ.maxScaled 1.82e-12 mm |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 1.71e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 4.09e-12 mm | PASS: pupilZ.maxScaled 6.82e-13 mm | PASS: firstOrder.maxAbs 4.32e-12 mm |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 1 | PASS: firstOrder.maxAbs 8.79e-14 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 2.27e-13 mm | PASS: firstOrder.maxAbs 2.42e-13 mm |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 1 | PASS: firstOrder.maxAbs 3.27e-13 mm | PASS: firstOrder.maxAbs 6.25e-13 mm | PASS: firstOrder.maxAbs 5.12e-13 mm |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 4.97e-14 mm |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 1 | PASS: firstOrder.maxAbs 7.82e-14 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.84e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 8.53e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 1 | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: pupilZ.maxScaled 8.53e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 1 | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 3.06e-13 mm | PASS: firstOrder.maxAbs 3.34e-13 mm |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 1 | PASS: pupilZ.maxScaled 3.55e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: pupilZ.maxScaled 7.11e-14 mm |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 7.11e-15 mm | PASS: firstOrder.maxAbs 1.07e-14 mm |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 4.37e-12 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 164, surface 23 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 6.63e-14 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 164 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 4.45e-12 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 164 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 122945 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 2.93e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 1231, surface 31 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 4.87e-14 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 1238 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.71e-12 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 9.26e0, line 0, ray 89 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 122945 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 4.18e-12 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 177, surface 23 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 6.36e-14 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 177 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 4.26e-12 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 177 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 122945 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: landing.maxDistance 4.45e-12 mm | PASS: landing.maxDistance 1.71e-12 mm | PASS: landing.maxDistance 4.26e-12 mm | 1636 / 1863 / 0 | 1636 / 1863 / 0 | 1636 / 1863 / 0 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: hits.maxDistance 7.82e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2201 / 2170 / 0 | 2201 / 2170 / 0 | 2201 / 2170 / 0 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.96e-13 mm | PASS: hits.maxDistance 1.11e-12 mm | PASS: hits.maxDistance 1.13e-12 mm | 2483 / 1624 / 0 | 2483 / 1624 / 0 | 2483 / 1624 / 0 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: hits.maxDistance 3.01e-12 mm | PASS: hits.maxDistance 2.93e-12 mm | PASS: hits.maxDistance 2.88e-12 mm | 2153 / 1954 / 0 | 2153 / 1954 / 0 | 2153 / 1954 / 0 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: landing.maxDistance 4.58e-13 mm | PASS: hits.maxDistance 9.68e-13 mm | PASS: hits.maxDistance 9.68e-13 mm | 1340 / 1702 / 0 | 1340 / 1702 / 0 | 1340 / 1702 / 0 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 2049 / 1564 / 0 | 2049 / 1564 / 0 | 2049 / 1564 / 0 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: landing.maxDistance 1.68e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 1881 / 2442 / 0 | 1881 / 2440 / 2 | 1881 / 2442 / 0 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.09e-13 mm | PASS: hits.maxDistance 8.23e-13 mm | PASS: hits.maxDistance 8.22e-13 mm | 1989 / 1326 / 0 | 1989 / 1326 / 0 | 1989 / 1326 / 0 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: landing.maxDistance 1.26e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 2099 / 1628 / 0 | 2099 / 1628 / 0 | 2099 / 1628 / 0 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: landing.maxDistance 3.18e-13 mm | PASS: landing.maxDistance 2.33e-13 mm | PASS: landing.maxDistance 2.90e-13 mm | 2389 / 2102 / 0 | 2389 / 2102 / 0 | 2389 / 2102 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: landing.maxDistance 2.61e-13 mm | PASS: landing.maxDistance 1.17e-13 mm | PASS: landing.maxDistance 2.53e-13 mm | 2263 / 1882 / 0 | 2263 / 1882 / 0 | 2263 / 1882 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: landing.maxDistance 2.34e-13 mm | PASS: hits.maxDistance 1.20e-13 mm | PASS: landing.maxDistance 2.36e-13 mm | 2529 / 1578 / 0 | 2529 / 1578 / 0 | 2529 / 1578 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: hits.maxDistance 2.55e-13 mm | PASS: hits.maxDistance 1.79e-13 mm | PASS: landing.maxDistance 2.36e-13 mm | 2389 / 1832 / 0 | 2389 / 1832 / 0 | 2389 / 1832 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: hits.maxDistance 2.59e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2007 / 1684 / 0 | 2007 / 1684 / 0 | 2007 / 1684 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.98e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2265 / 2138 / 0 | 2265 / 2138 / 0 | 2265 / 2138 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 1552 / 2234 / 0 | 1552 / 2234 / 0 | 1552 / 2234 / 0 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: landing.maxDistance 6.75e-14 mm | PASS: landing.maxDistance 3.91e-14 mm | PASS: landing.maxDistance 6.05e-14 mm | 2709 / 1512 / 0 | 2709 / 1512 / 0 | 2709 / 1512 / 0 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: landing.maxDistance 2.99e-13 mm | PASS: landing.maxDistance 2.13e-13 mm | PASS: landing.maxDistance 2.67e-13 mm | 2201 / 1754 / 0 | 2201 / 1754 / 0 | 2201 / 1754 / 0 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: hits.maxDistance 7.59e-13 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 2109 / 1892 / 0 | 2109 / 1892 / 0 | 2109 / 1892 / 0 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: landing.maxDistance 1.07e-13 mm | PASS: hits.maxDistance 9.98e-13 mm | PASS: hits.maxDistance 9.98e-13 mm | 757 / 1136 / 0 | 757 / 1136 / 0 | 757 / 1136 / 0 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.49e-13 mm | PASS: landing.maxDistance 1.25e-13 mm | PASS: landing.maxDistance 2.17e-13 mm | 2037 / 2286 / 0 | 2037 / 2286 / 0 | 2037 / 2286 / 0 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: landing.maxDistance 2.60e-13 mm | PASS: landing.maxDistance 1.72e-13 mm | PASS: landing.maxDistance 3.07e-13 mm | 2453 / 3574 / 0 | 2453 / 3574 / 0 | 2453 / 3574 / 0 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: hits.maxDistance 9.69e-13 mm | PASS: hits.maxDistance 1.18e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2183 / 1900 / 0 | 2183 / 1900 / 0 | 2183 / 1900 / 0 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2019 / 1518 / 0 | 2019 / 1518 / 0 | 2019 / 1518 / 0 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: hits.maxDistance 9.77e-13 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2329 / 1476 / 0 | 2329 / 1476 / 0 | 2329 / 1476 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.29e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.26e-12 mm | 2171 / 2440 / 0 | 2171 / 2440 / 0 | 2171 / 2440 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: hits.maxDistance 4.62e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2505 / 2954 / 0 | 2505 / 2954 / 0 | 2505 / 2954 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 1967 / 3008 / 0 | 1967 / 3008 / 0 | 1967 / 3008 / 0 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.70e-13 mm | PASS: landing.maxDistance 1.63e-13 mm | PASS: landing.maxDistance 2.77e-13 mm | 1857 / 1846 / 0 | 1857 / 1846 / 0 | 1857 / 1846 / 0 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.34e-13 mm | PASS: hits.maxDistance 1.21e-12 mm | PASS: hits.maxDistance 1.19e-12 mm | 1943 / 1860 / 0 | 1943 / 1860 / 0 | 1943 / 1860 / 0 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 1.15e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | 2771 / 2908 / 0 | 2771 / 2908 / 0 | 2771 / 2908 / 0 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 9.57e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 1979 / 1374 / 0 | 1979 / 1374 / 0 | 1979 / 1374 / 0 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | PASS: hits.maxDistance 1.13e-12 mm | 1921 / 1464 / 0 | 1921 / 1464 / 0 | 1921 / 1464 / 0 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.15e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2059 / 1704 / 0 | 2059 / 1704 / 0 | 2059 / 1704 / 0 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.64e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2057 / 1746 / 0 | 2057 / 1746 / 0 | 2057 / 1746 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 9.97e-13 mm | 2183 / 1506 / 0 | 2183 / 1506 / 0 | 2183 / 1506 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 9.65e-13 mm | 1927 / 1686 / 0 | 1927 / 1686 / 0 | 1927 / 1686 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 9.98e-13 mm | 1725 / 1858 / 0 | 1725 / 1858 / 0 | 1725 / 1858 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: landing.maxDistance 1.67e-13 mm | PASS: landing.maxDistance 9.41e-14 mm | PASS: landing.maxDistance 1.63e-13 mm | 1987 / 1524 / 0 | 1987 / 1524 / 0 | 1987 / 1524 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: landing.maxDistance 1.91e-13 mm | PASS: landing.maxDistance 1.30e-13 mm | PASS: landing.maxDistance 2.34e-13 mm | 1971 / 1344 / 0 | 1971 / 1344 / 0 | 1971 / 1344 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: landing.maxDistance 2.20e-13 mm | PASS: landing.maxDistance 2.39e-13 mm | PASS: landing.maxDistance 2.15e-13 mm | 1949 / 1366 / 0 | 1949 / 1366 / 0 | 1949 / 1366 / 0 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 1.27e-12 mm | PASS: hits.maxDistance 1.28e-12 mm | 1861 / 1722 / 0 | 1861 / 1722 / 0 | 1861 / 1722 / 0 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.49e-13 mm | PASS: hits.maxDistance 8.63e-13 mm | PASS: hits.maxDistance 8.63e-13 mm | 2019 / 1416 / 0 | 2019 / 1416 / 0 | 2019 / 1416 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: landing.maxDistance 2.08e-13 mm | PASS: hits.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 2.04e-13 mm | 1855 / 1606 / 0 | 1855 / 1606 / 0 | 1855 / 1606 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: landing.maxDistance 3.58e-13 mm | PASS: hits.maxDistance 1.63e-13 mm | PASS: landing.maxDistance 2.56e-13 mm | 2089 / 1372 / 0 | 2089 / 1372 / 0 | 2089 / 1372 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: landing.maxDistance 3.38e-13 mm | PASS: landing.maxDistance 2.50e-13 mm | PASS: landing.maxDistance 3.53e-13 mm | 1843 / 1584 / 0 | 1843 / 1584 / 0 | 1843 / 1584 / 0 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.46e-13 mm | PASS: landing.maxDistance 1.25e-13 mm | PASS: landing.maxDistance 1.76e-13 mm | 2003 / 1990 / 0 | 2003 / 1990 / 0 | 2003 / 1990 / 0 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: landing.maxDistance 3.00e-13 mm | PASS: landing.maxDistance 2.85e-13 mm | PASS: landing.maxDistance 3.70e-13 mm | 1837 / 2046 / 0 | 1837 / 2046 / 0 | 1837 / 2046 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: landing.maxDistance 1.68e-13 mm | PASS: landing.maxDistance 9.38e-14 mm | PASS: landing.maxDistance 1.65e-13 mm | 2027 / 1510 / 0 | 2027 / 1510 / 0 | 2027 / 1510 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: landing.maxDistance 1.93e-13 mm | PASS: landing.maxDistance 1.43e-13 mm | PASS: landing.maxDistance 2.67e-13 mm | 2237 / 1642 / 0 | 2237 / 1642 / 0 | 2237 / 1642 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: landing.maxDistance 2.36e-13 mm | PASS: landing.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 2.15e-13 mm | 1853 / 1722 / 0 | 1853 / 1722 / 0 | 1853 / 1722 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.24e-12 mm | PASS: hits.maxDistance 1.31e-12 mm | 2017 / 1558 / 0 | 2017 / 1558 / 0 | 2017 / 1558 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: hits.maxDistance 9.94e-13 mm | PASS: hits.maxDistance 1.28e-12 mm | PASS: hits.maxDistance 1.32e-12 mm | 2071 / 1732 / 0 | 2071 / 1732 / 0 | 2071 / 1732 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.29e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.26e-12 mm | 1943 / 1980 / 0 | 1943 / 1980 / 0 | 1943 / 1980 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | 2081 / 1572 / 0 | 2081 / 1572 / 0 | 2081 / 1572 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 1853 / 1760 / 0 | 1853 / 1760 / 0 | 1853 / 1760 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | 1721 / 1906 / 0 | 1721 / 1906 / 0 | 1721 / 1906 / 0 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.73e-13 mm | PASS: landing.maxDistance 1.40e-13 mm | PASS: landing.maxDistance 3.00e-13 mm | 2565 / 3966 / 0 | 2565 / 3966 / 0 | 2565 / 3966 / 0 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.49e-13 mm | PASS: hits.maxDistance 1.15e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | 2267 / 1446 / 0 | 2267 / 1446 / 0 | 2267 / 1446 / 0 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: landing.maxDistance 8.85e-14 mm | PASS: hits.maxDistance 9.92e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 1809 / 1652 / 0 | 1809 / 1652 / 0 | 1809 / 1652 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.34e-9 | certified-sigma-135mm-f14-dg-art-zoom0-focus1 | field 4.57e0, line 0, ray 199 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.19e-9 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 164 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.71e-9 | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | field 4.06e0, line 0, ray 919 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.87e-9 | certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | field 0, line 0, ray 1209 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.71e-9 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 9.26e0, line 0, ray 89 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.14e-9 | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | field 2.54e1, line 0, ray 394 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.92e-9 | certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | field 0, line 0, ray 1209 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.10e-9 | certified-fujifilm-gf80-f17-zoom0-focus1 | field 1.83e1, line 0, ray 236 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.05e-9 | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | field 2.54e1, line 0, ray 394 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 3.19e-9 waves | PASS: opd.maxAbs 2.76e-9 waves | PASS: opticalPathToImage.maxAbs 3.10e-9 waves |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPathToImage.maxAbs 1.84e-9 waves | PASS: opticalPathToImage.maxAbs 1.98e-9 waves |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 1.93e-9 waves | PASS: opticalPath.maxAbs 1.93e-9 waves |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.64e-9 waves |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.89e-9 waves |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 1.79e-9 waves | PASS: opd.maxAbs 1.93e-9 waves |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.35e-9 waves |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.13e-9 waves | PASS: opd.maxAbs 1.98e-9 waves |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 5.80e-10 waves | PASS: opticalPath.maxAbs 4.84e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: opticalPath.maxAbs 6.77e-10 waves | PASS: opd.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 8.71e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opticalPathToImage.maxAbs 5.80e-10 waves | PASS: opticalPath.maxAbs 5.80e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: opd.maxAbs 8.71e-10 waves | PASS: opticalPath.maxAbs 5.80e-10 waves | PASS: opd.maxAbs 8.71e-10 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 1.84e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opticalPathToImage.maxAbs 1.55e-9 waves | PASS: opticalPathToImage.maxAbs 2.47e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: opd.maxAbs 1.11e-9 waves | PASS: opd.maxAbs 1.79e-9 waves | PASS: opd.maxAbs 1.69e-9 waves |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: opd.maxAbs 9.67e-11 waves | PASS: opticalPath.maxAbs 4.84e-11 waves | PASS: opd.maxAbs 7.26e-11 waves |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.31e-9 waves | PASS: opd.maxAbs 1.31e-9 waves |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: opticalPath.maxAbs 2.42e-10 waves | PASS: opticalPath.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.79e-9 waves | PASS: opticalPath.maxAbs 3.43e-9 waves | PASS: opticalPath.maxAbs 3.10e-9 waves |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 3.34e-9 waves | PASS: opticalPath.maxAbs 3.39e-9 waves | PASS: opticalPath.maxAbs 3.39e-9 waves |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: opticalPath.maxAbs 2.61e-9 waves | PASS: opticalPath.maxAbs 3.24e-9 waves | PASS: opticalPath.maxAbs 3.43e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 3.29e-9 waves | PASS: opticalPath.maxAbs 2.90e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: opticalPath.maxAbs 8.22e-10 waves | PASS: opticalPath.maxAbs 3.24e-9 waves | PASS: opticalPath.maxAbs 2.90e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: opticalPathToImage.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 3.87e-9 waves | PASS: opticalPath.maxAbs 3.92e-9 waves |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: opd.maxAbs 6.77e-10 waves | PASS: opd.maxAbs 5.80e-10 waves | PASS: opd.maxAbs 6.77e-10 waves |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.74e-9 waves |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: opd.maxAbs 2.18e-10 waves | PASS: opticalPathToImage.maxAbs 1.91e-9 waves | PASS: opticalPathToImage.maxAbs 1.93e-9 waves |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.35e-9 waves | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 3.82e-9 waves | PASS: opticalPath.maxAbs 3.87e-9 waves |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 3.29e-9 waves | PASS: opticalPath.maxAbs 3.24e-9 waves |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.93e-9 waves | PASS: opticalPath.maxAbs 1.93e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: opd.maxAbs 2.32e-9 waves | PASS: opticalPath.maxAbs 2.13e-9 waves | PASS: opd.maxAbs 1.45e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: opd.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 2.13e-9 waves | PASS: opd.maxAbs 1.35e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: opd.maxAbs 2.71e-9 waves | PASS: opd.maxAbs 2.42e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: opd.maxAbs 5.80e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 3.87e-10 waves |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.50e-9 waves | PASS: opticalPath.maxAbs 2.95e-9 waves | PASS: opticalPath.maxAbs 3.10e-9 waves |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPathToImage.maxAbs 9.67e-10 waves | PASS: opticalPathToImage.maxAbs 8.71e-10 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 8.71e-10 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: opd.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opticalPathToImage.maxAbs 2.42e-10 waves |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.93e-9 waves | PASS: opd.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 2.13e-9 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: opticalPathToImage.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 2.13e-9 waves | PASS: opticalPath.maxAbs 1.74e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: opd.maxAbs 2.42e-9 waves | PASS: opd.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 1.84e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: opd.maxAbs 2.71e-9 waves | PASS: opd.maxAbs 2.42e-9 waves | PASS: opticalPathToImage.maxAbs 1.93e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.93e-9 waves | PASS: opd.maxAbs 1.84e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: opd.maxAbs 2.13e-9 waves | PASS: opd.maxAbs 2.42e-9 waves | PASS: opd.maxAbs 1.55e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: opticalPath.maxAbs 2.71e-9 waves | PASS: opticalPath.maxAbs 2.03e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 2.18e-10 waves | PASS: opd.maxAbs 9.92e-10 waves | PASS: opticalPath.maxAbs 9.92e-10 waves |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 3.95e-11 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1.83e1, frequencyPerMm 100 |
| lv – optiland | rays.compared [rays] | 122945 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 1 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.96e-11 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1.83e1, frequencyPerMm 84 |
| lv – ref | rays.compared [rays] | 122945 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 1 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 5.04e-11 | certified-fujifilm-gf80-f17-zoom0-focus1 | cut tangential, field 1.83e1, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 122945 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 1 | certified-fujifilm-gf80-f17-zoom0-focus1 | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.95e-11 | PASS: mtf.maxAbs 1.96e-11 | PASS: mtf.maxAbs 5.04e-11 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.58e-12 | PASS: mtf.maxAbs 7.85e-12 | PASS: mtf.maxAbs 8.94e-12 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.17e-12 | PASS: mtf.maxAbs 2.21e-12 | PASS: mtf.maxAbs 1.91e-12 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.12e-12 | PASS: mtf.maxAbs 4.34e-12 | PASS: mtf.maxAbs 2.37e-12 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: mtf.maxAbs 2.05e-12 | PASS: mtf.maxAbs 3.09e-12 | PASS: mtf.maxAbs 3.23e-12 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.45e-12 | PASS: mtf.maxAbs 2.57e-12 | PASS: mtf.maxAbs 2.85e-12 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 9.25e-13 | PASS: mtf.maxAbs 3.47e-12 | PASS: mtf.maxAbs 3.46e-12 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.96e-13 | PASS: mtf.maxAbs 4.19e-13 | PASS: mtf.maxAbs 1.01e-12 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 8.38e-13 | PASS: mtf.maxAbs 2.04e-12 | PASS: mtf.maxAbs 1.49e-12 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.48e-12 | PASS: mtf.maxAbs 2.19e-12 | PASS: mtf.maxAbs 1.59e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: mtf.maxAbs 1.80e-12 | PASS: mtf.maxAbs 1.43e-12 | PASS: mtf.maxAbs 2.13e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: mtf.maxAbs 4.91e-12 | PASS: mtf.maxAbs 2.81e-12 | PASS: mtf.maxAbs 7.72e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: mtf.maxAbs 2.83e-12 | PASS: mtf.maxAbs 9.55e-13 | PASS: mtf.maxAbs 2.44e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.27e-13 | PASS: mtf.maxAbs 1.74e-12 | PASS: mtf.maxAbs 1.52e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: mtf.maxAbs 7.02e-13 | PASS: mtf.maxAbs 8.47e-13 | PASS: mtf.maxAbs 1.15e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: mtf.maxAbs 5.58e-13 | PASS: mtf.maxAbs 1.63e-12 | PASS: mtf.maxAbs 1.58e-12 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.32e-13 | PASS: mtf.maxAbs 2.97e-13 | PASS: mtf.maxAbs 3.28e-13 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: mtf.maxAbs 1.97e-12 | PASS: mtf.maxAbs 1.90e-12 | PASS: mtf.maxAbs 1.90e-12 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.81e-12 | PASS: mtf.maxAbs 4.50e-12 | PASS: mtf.maxAbs 5.50e-12 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: mtf.maxAbs 7.42e-13 | PASS: mtf.maxAbs 4.15e-12 | PASS: mtf.maxAbs 3.41e-12 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.78e-12 | PASS: mtf.maxAbs 2.38e-12 | PASS: mtf.maxAbs 4.72e-12 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 2.52e-12 | PASS: mtf.maxAbs 1.67e-12 | PASS: mtf.maxAbs 2.96e-12 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.36e-12 | PASS: mtf.maxAbs 6.30e-12 | PASS: mtf.maxAbs 3.96e-12 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.63e-12 | PASS: mtf.maxAbs 3.64e-12 | PASS: mtf.maxAbs 3.35e-12 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 5.17e-12 | PASS: mtf.maxAbs 4.20e-12 | PASS: mtf.maxAbs 3.66e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.49e-12 | PASS: mtf.maxAbs 2.67e-12 | PASS: mtf.maxAbs 3.22e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: mtf.maxAbs 1.44e-12 | PASS: mtf.maxAbs 1.16e-12 | PASS: mtf.maxAbs 1.57e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: mtf.maxAbs 9.90e-13 | PASS: mtf.maxAbs 3.46e-12 | PASS: mtf.maxAbs 3.64e-12 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.92e-12 | PASS: mtf.maxAbs 2.00e-12 | PASS: mtf.maxAbs 3.13e-12 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.42e-12 | PASS: mtf.maxAbs 5.97e-12 | PASS: mtf.maxAbs 5.95e-12 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 9.48e-13 | PASS: mtf.maxAbs 3.10e-12 | PASS: mtf.maxAbs 3.15e-12 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 8.79e-13 | PASS: mtf.maxAbs 4.81e-12 | PASS: mtf.maxAbs 4.97e-12 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.20e-12 | PASS: mtf.maxAbs 5.00e-12 | PASS: mtf.maxAbs 5.67e-12 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.34e-12 | PASS: mtf.maxAbs 3.69e-12 | PASS: mtf.maxAbs 6.03e-12 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.03e-12 | PASS: mtf.maxAbs 2.43e-12 | PASS: mtf.maxAbs 3.83e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 6.17e-12 | PASS: mtf.maxAbs 5.07e-12 | PASS: mtf.maxAbs 2.74e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: mtf.maxAbs 5.42e-12 | PASS: mtf.maxAbs 4.29e-12 | PASS: mtf.maxAbs 2.04e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: mtf.maxAbs 3.57e-12 | PASS: mtf.maxAbs 2.52e-12 | PASS: mtf.maxAbs 2.91e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: mtf.maxAbs 2.16e-12 | PASS: mtf.maxAbs 7.50e-13 | PASS: mtf.maxAbs 1.67e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: mtf.maxAbs 2.33e-12 | PASS: mtf.maxAbs 1.34e-12 | PASS: mtf.maxAbs 2.17e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: mtf.maxAbs 2.99e-12 | PASS: mtf.maxAbs 2.25e-12 | PASS: mtf.maxAbs 1.57e-12 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.62e-12 | PASS: mtf.maxAbs 5.45e-12 | PASS: mtf.maxAbs 6.05e-12 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 9.32e-13 | PASS: mtf.maxAbs 1.54e-12 | PASS: mtf.maxAbs 1.73e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: mtf.maxAbs 2.34e-12 | PASS: mtf.maxAbs 1.75e-12 | PASS: mtf.maxAbs 2.16e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: mtf.maxAbs 2.55e-12 | PASS: mtf.maxAbs 1.43e-12 | PASS: mtf.maxAbs 2.59e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: mtf.maxAbs 5.70e-12 | PASS: mtf.maxAbs 1.31e-12 | PASS: mtf.maxAbs 6.89e-12 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.20e-12 | PASS: mtf.maxAbs 1.91e-12 | PASS: mtf.maxAbs 2.99e-12 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.33e-12 | PASS: mtf.maxAbs 2.34e-12 | PASS: mtf.maxAbs 3.32e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: mtf.maxAbs 1.74e-12 | PASS: mtf.maxAbs 1.49e-12 | PASS: mtf.maxAbs 1.74e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: mtf.maxAbs 2.86e-12 | PASS: mtf.maxAbs 2.18e-12 | PASS: mtf.maxAbs 9.10e-13 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: mtf.maxAbs 2.37e-12 | PASS: mtf.maxAbs 1.90e-12 | PASS: mtf.maxAbs 2.06e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.89e-12 | PASS: mtf.maxAbs 5.71e-12 | PASS: mtf.maxAbs 5.74e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: mtf.maxAbs 2.25e-12 | PASS: mtf.maxAbs 7.13e-12 | PASS: mtf.maxAbs 6.87e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: mtf.maxAbs 7.41e-12 | PASS: mtf.maxAbs 7.84e-12 | PASS: mtf.maxAbs 9.71e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: mtf.maxAbs 5.98e-12 | PASS: mtf.maxAbs 5.20e-12 | PASS: mtf.maxAbs 5.84e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: mtf.maxAbs 3.65e-12 | PASS: mtf.maxAbs 5.35e-12 | PASS: mtf.maxAbs 5.02e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: mtf.maxAbs 5.20e-12 | PASS: mtf.maxAbs 6.79e-12 | PASS: mtf.maxAbs 3.90e-12 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.41e-12 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 1.59e-12 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.88e-12 | PASS: mtf.maxAbs 6.53e-12 | PASS: mtf.maxAbs 7.41e-12 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 8.48e-13 | PASS: mtf.maxAbs 5.36e-12 | PASS: mtf.maxAbs 5.08e-12 |
