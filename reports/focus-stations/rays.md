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
| Baseline hash | 5be19925fc6e4ee594e85a708155060a6d6a274217783dc65be7d61e75be4106 |
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
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | fc71d244aec38864b73ef8750cc52141357ae769fe4d7ea80b387b46ff1a8e55 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | bbd4687c1f32e2819c4015cfb440908f2747d442e89dd218858a35f71743bad9 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | e92c44ff169ec871c921b962020b502aabf40e71a8bfa6b0e41956ea10f0b00e |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | ce632d6fe72f4ec5daa7775f71f8298fe22684b6c3b9829f1acd927901c5e613 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | b0f8f5466dfaa4f6b686d4163d2df66174f23018b6842d90c6c4ce65e012e360 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | e05ac48d6f62767ab2991094e24729bdc873f47fc38773f94ca29503318d786e |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | — |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1ffeed7214f4c219837b85a1116192fabb1e72ff66cd098ede5710dd840281a8 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 9276015f4a09ae0df05099a0725962e7d7fa25e98db611b456bf45264207fc15 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 8270906e01b3faca8ae4a642653a0f2f6bbf6c56f6ed124c25e85fe787091421 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | e2778a011e81560e6271e675f6844482a66b7f3ad247d8746d3215ec4c08e3fe |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 673095cfc1f5665f4aa891be77f7cdb2eeef2dd706ea2d7769ea0e15425e4eec |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | b3794c6c5924cee466179682391e442c92d6fd70b1e0ab0b6ac97082d0b72852 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 0659c248d82dbf06c5521831ad34250a06d1f1b22c927cf1597770b0b227815d |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | f2ba46d7a8b2499a6bc7da15228827704f359e024db844b8fabb06c81d014ef9 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 874854625cf1dd589f47f331895c0b49532f902a20bbe796f268e2024ce7d9e3 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 99b6b35e6ae7faa9b94ac06d2c115bb160911667f256de438f8697ea9233b9cc |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 568f93341d119dcc2a9f1949c2dcfcc3d63f99dc26c391280a71e591244fa8d6 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 72842c3de154ccbb801450d8cbfb7800f0ec613c5773ac45f72186384e60381a |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 617deed34e0bc25befb3e30cb9c900e56525459a0186c7ec769967343f4edf14 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | db455dd71151e3a29c1df1c0c947b229ff79eee1068aece790b732b3c16f3979 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | cfdaf3f52ab425d4ee0490bd4bf40d7a91a37615f02c23c3749d3fce68b4622d |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 9876f2f2d40b032687ef30fd0b77d64b7a3d678c0010822ca3458e440d0d8955 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 53c5ca7e688cbf9f0983edcc98da88609e0868a5b88deef5ce559d2fa68766d5 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | bb47082c2e9124e55765678231442de72d55ad3b834333c85b8837cf7f9ca5aa |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1cf221df7808f788a07cd99f50581d1a29e85ab0147605229fcdb98755391574 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 73f942b93db286a48d6488b9326160e626b44540779630c68107f2ccdecdcdbe |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 77240b3249fc2f96cae82d1c5932f50dcef934088dc2120589ed64b46daa3b0f |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 02dd902ccabd7e9efddefd7cf52710bb38253debd4b731f861f8cc74e4fef217 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 22f573c4dcca9f77d238821d35ca62ce41661714c27dafce162fe79e5c759f23 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | eeb1536ebab034372569abe5359886111aae56eca2050eb0801d93c8c1e67dab |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | b549e5c3c090d253532f2bad999fb5293fb98117f7a7588ef80b18423f0e66a2 |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | — |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 894debefc6fdb16f1ab38c6055c2fb104509070cfe07cd49d9ad4f8bc92fbd76 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | e3c1b9c0842d88e4bb1ea57ece875089e1a6de335469b227438334a9f4a6016f |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | acd7822027052cc1952f100f7114f829f03335fe258f4f7cec4b41880210e964 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 11e8a91c1e7e9666e6214e8dfa9a071aa95c30b044aa47782b4e7f85afc12bae |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | b0be2f20e5b95353f9377fd656f14c691282d42c2e611dd69986cfcecb4b85e2 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 9aee102182725025ed61069c4cf367e7cebed4d547743098cb34574dfd66eaff |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | cf90a40810f02e10d4a3f936a8edef233b88ecbd3a6ee545eaf703df4560b90b |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 17d8f3a57a99e1785f48b4b99a93338c1fe926853d879f06d38255370f1d221a |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 851b25697188fac9d7e726bebd0f012893d277d9551e858f7d1dca682ecd9736 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 62d4f5600679b10f237e8aa57b30967f59bb7bfb16b5a7a4d351fb64dc84f4eb |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3a6c0b2f69addb626038c0990440dde5ddee0abfcb44a8e595df75e5589fe065 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 18b137c95a0dea4adf0bc6590a8f3de81c6d67565837d10fce7c60af1a18a2f3 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | b4a9bef13532c7161f7793a1ecf28c9cafd8b539699dd9d40995b0a468bb9631 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 4c007de74973def2a32965907541cdd909b081ff8036fef4dde69926c5498cfa |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 827ce23a9b1f784a4b5c4dd72bd345210bc4f7ae826b576e158c4b22bfb38ac4 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 88fee4e84777e7181151c3b0a912d70efc6652ccbc666ad44e1fff00ce7865de |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 10bff0b1d82d13878aac8613719bc9056478c7706a675c17b4e2cd8e7f9de763 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 22198c5be871fa98cbbb32e8975a4030730a7894a5e8eb7bfe84328a92f0e7bb |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 412e617abaf928fcecb490c55b259bf98ca4e1182f4e19387b828932e214cf6e |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 2e6f278dd2f1ec94b8db751221aa4ac992b55806dbb29b96094acb085c3b4e11 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 61751a849d977beb5339e3ab0862718565f1ddf41ccb909140895b7cfe0037fd |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | e66d7ce98eb7ba9e080cb5247736616f8a44ddb243f3336b537bdb9343b9346f |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | c4cafe389ff19f2b3ac144e21ca3a2ece14048ff1d29f1bb6524fe0babf56aab |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 7cdedfe0afa1f9483af937f9046fbb2ab00c5bc46d01efdccf884970dcd7f325 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | e29835a068866e0eb6f0b139d64a7097729dbf772bb0e5a01721d000d453e978 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | a6a31446c8e77964319cfd9e664e1bc596c7dcf7d071707a5f2e609934b6492c |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 2d27265e6b0031b00246d0f1424a01e4261bcadbe57dbe32dd1a87eecbb79c04 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 5eb9db0466b9fe7137222fdbd30b1101ea26c50826f0dada18c5fc30bda6983d |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | ca2990fbd67f5671e0311331ed51997faa7843d6507d351fe6e33adeb6e19ea7 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 6fcf69c5570573dca2d419e83ee9a1671bd2ff98fac1e81bc881aa436a6a1995 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 9ff925fa82ee6749b885459fb3e46177f1b31d4f7db5abce230e8c6460a16a33 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 32256a3f62cfc695eeda0d0a9a8d2fedd4bfc7a90553caf2fe35d12c853e02d8 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 22234d65f21f2d91cbc3daa3c10f0584e73c9750c4ac1485b555741ea544d96f |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | ae188d3eb305c52019797e5d4b2b534ffaa03c876c648707567624a3b8f9a0fe |

## Run problems

| Run | Problem |
|---|---|
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable: focus position 1 at zoom 0 is not a station whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 67 | 67 | lv – optiland | 67 PASS | 67 PASS |
| r0 | system.describe | 67 | 67 | lv – ref | 67 PASS | 67 PASS |
| r0 | system.describe | 67 | 67 | optiland – ref | 67 PASS | 67 PASS |
| r1 | paraxial.first-order | 67 | 67 | lv – optiland | 67 PASS | 67 PASS |
| r1 | paraxial.first-order | 67 | 67 | lv – ref | 67 PASS | 67 PASS |
| r1 | paraxial.first-order | 67 | 67 | optiland – ref | 67 PASS | 67 PASS |
| r2 | rays.trace | 67 | 191 | lv – optiland | 67 PASS | 191 PASS |
| r2 | rays.trace | 67 | 191 | lv – ref | 67 PASS | 191 PASS |
| r2 | rays.trace | 67 | 191 | optiland – ref | 67 PASS | 191 PASS |
| r3 | rays.trace | 67 | 191 | lv – optiland | 67 PASS | 191 PASS |
| r3 | rays.trace | 67 | 191 | lv – ref | 67 PASS | 191 PASS |
| r3 | rays.trace | 67 | 191 | optiland – ref | 67 PASS | 191 PASS |
| r4 | rays.trace | 67 | 191 | lv – optiland | 67 PASS | 191 PASS |
| r4 | rays.trace | 67 | 191 | lv – ref | 67 PASS | 191 PASS |
| r4 | rays.trace | 67 | 191 | optiland – ref | 67 PASS | 191 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 67 ok |
| r0 | optiland | 67 ok |
| r0 | ref | 67 ok |
| r1 | lv | 67 ok |
| r1 | optiland | 67 ok |
| r1 | ref | 67 ok |
| r2 | lv | 67 ok |
| r2 | optiland | 67 ok |
| r2 | ref | 67 ok |
| r3 | lv | 67 ok |
| r3 | optiland | 67 ok |
| r3 | ref | 67 ok |
| r4 | lv | 67 ok |
| r4 | optiland | 67 ok |
| r4 | ref | 67 ok |

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 6.04e-16 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | sample 6, surface 28 |
| lv – optiland | sag.maxAbs [mm] | 8.88e-15 | certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | sample 8, surface 3 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 4.03e-16 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | sample 6, surface 10 |
| lv – ref | sag.maxAbs [mm] | 5.33e-15 | certified-sigma-85mm-f12-dg-art-zoom0-focus1 | sample 8, surface 2 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 6.04e-16 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | sample 6, surface 28 |
| optiland – ref | sag.maxAbs [mm] | 5.33e-15 | certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | sample 8, surface 3 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 4.03e-16 | PASS: sag.maxScaled 5.92e-16 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.20e-16 | PASS: sag.maxScaled 2.47e-16 | PASS: sag.maxScaled 2.90e-16 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | PASS: sag.maxScaled 3.23e-16 | PASS: sag.maxScaled 3.50e-16 | PASS: sag.maxScaled 3.50e-16 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.77e-16 | PASS: sag.maxScaled 2.23e-16 | PASS: sag.maxScaled 3.39e-16 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.12e-16 | PASS: sag.maxScaled 2.66e-16 | PASS: sag.maxScaled 2.67e-16 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.12e-16 | PASS: sag.maxScaled 2.66e-16 | PASS: sag.maxScaled 2.67e-16 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.77e-16 | PASS: sag.maxScaled 3.60e-16 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.77e-16 | PASS: sag.maxScaled 3.60e-16 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.78e-16 | PASS: sag.maxScaled 2.94e-16 | PASS: sag.maxScaled 3.11e-16 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | PASS: sag.maxScaled 2.78e-16 | PASS: sag.maxScaled 2.94e-16 | PASS: sag.maxScaled 3.11e-16 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.64e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.23e-16 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 1 | PASS: sag.maxScaled 1.98e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 1 | PASS: sag.maxScaled 1.98e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 1 | PASS: sag.maxScaled 1.98e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 3.55e-16 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: sag.maxScaled 2.60e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 3.71e-16 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: sag.maxScaled 2.60e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 3.71e-16 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: sag.maxScaled 2.60e-16 | PASS: sag.maxScaled 2.15e-16 | PASS: sag.maxScaled 3.71e-16 |
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
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.66e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 9.66e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.27e-12 | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | line 0, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 2.61e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 2.61e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 9.81e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 9.81e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | line 0, quantity exitPupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 4.32e-12 | certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.82e-12 | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | line 0, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.82e-12 | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | line 0, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 1.99e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | line 0, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 1.99e-13 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | line 0, quantity exitPupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 1 | PASS: firstOrder.maxAbs 1.71e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.99e-13 mm |
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
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 2.96e-14 mm | PASS: firstOrder.maxAbs 1.60e-14 mm |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 1 | PASS: firstOrder.maxAbs 6.39e-14 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 1 | PASS: firstOrder.maxAbs 1.71e-13 mm | PASS: firstOrder.maxAbs 2.56e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 8.88e-15 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 3.38e-14 mm | PASS: pupilZ.maxScaled 1.42e-14 mm |
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
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | PASS: pupilRadius.maxScaled 2.84e-14 mm | PASS: firstOrder.maxAbs 2.04e-14 mm | PASS: pupilRadius.maxScaled 1.78e-14 mm |
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
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 2.70e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 745, surface 32 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 4.46e-14 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 745 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 1.04e-12 | certified-thypoch-ksana-21mm-f35-zoom0-focus1 | field 4.40e1, line 0, ray 516 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 169684 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.98e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 615, surface 32 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 3.18e-14 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 615 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.12e-12 | certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | field 4.45e1, line 0, ray 449 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 169684 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 2.66e-12 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 745, surface 32 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 4.38e-14 | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | field 4.07e1, line 0, ray 745 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.20e-12 | certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | field 4.99e1, line 0, ray 812 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 169684 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | PASS: landing.maxDistance 2.04e-13 mm | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 9.96e-13 mm | 2853 / 222 / 0 | 2853 / 222 / 0 | 2853 / 222 / 0 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: hits.maxDistance 5.86e-13 mm | PASS: hits.maxDistance 8.28e-13 mm | PASS: hits.maxDistance 8.34e-13 mm | 2082 / 993 / 0 | 2082 / 993 / 0 | 2082 / 993 / 0 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: hits.maxDistance 7.21e-13 mm | PASS: landing.maxDistance 1.11e-12 mm | PASS: landing.maxDistance 1.20e-12 mm | 2751 / 324 / 0 | 2751 / 324 / 0 | 2751 / 324 / 0 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | 2947 / 128 / 0 | 2947 / 128 / 0 | 2947 / 128 / 0 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: hits.maxDistance 2.70e-12 mm | PASS: hits.maxDistance 1.98e-12 mm | PASS: hits.maxDistance 2.66e-12 mm | 2531 / 544 / 0 | 2531 / 544 / 0 | 2531 / 544 / 0 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: landing.maxDistance 2.84e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 1918 / 132 / 0 | 1918 / 132 / 0 | 1918 / 132 / 0 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2559 / 516 / 0 | 2559 / 512 / 4 | 2559 / 516 / 0 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: landing.maxDistance 1.18e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2621 / 454 / 0 | 2621 / 444 / 10 | 2621 / 454 / 0 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.17e-13 mm | PASS: hits.maxDistance 9.05e-13 mm | PASS: hits.maxDistance 9.06e-13 mm | 2571 / 504 / 0 | 2571 / 504 / 0 | 2571 / 504 / 0 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: landing.maxDistance 1.20e-13 mm | PASS: hits.maxDistance 8.35e-13 mm | PASS: hits.maxDistance 8.35e-13 mm | 2589 / 486 / 0 | 2589 / 486 / 0 | 2589 / 486 / 0 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: landing.maxDistance 3.28e-13 mm | PASS: landing.maxDistance 2.96e-13 mm | PASS: landing.maxDistance 3.00e-13 mm | 2701 / 374 / 0 | 2701 / 374 / 0 | 2701 / 374 / 0 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 3 | PASS: landing.maxDistance 9.20e-14 mm | PASS: landing.maxDistance 3.81e-14 mm | PASS: landing.maxDistance 9.18e-14 mm | 2929 / 146 / 0 | 2929 / 146 / 0 | 2929 / 146 / 0 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 3 | PASS: landing.maxDistance 8.35e-14 mm | PASS: landing.maxDistance 5.70e-14 mm | PASS: landing.maxDistance 8.64e-14 mm | 2909 / 166 / 0 | 2909 / 166 / 0 | 2909 / 166 / 0 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 3 | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 8.26e-14 mm | PASS: landing.maxDistance 1.51e-13 mm | 3015 / 60 / 0 | 3015 / 60 / 0 | 3015 / 60 / 0 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: landing.maxDistance 6.33e-14 mm | PASS: hits.maxDistance 9.66e-13 mm | PASS: hits.maxDistance 9.66e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: landing.maxDistance 7.85e-14 mm | PASS: hits.maxDistance 8.10e-13 mm | PASS: hits.maxDistance 7.96e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: landing.maxDistance 1.29e-13 mm | PASS: hits.maxDistance 8.67e-13 mm | PASS: hits.maxDistance 8.53e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: landing.maxDistance 2.27e-13 mm | PASS: hits.maxDistance 1.57e-13 mm | PASS: landing.maxDistance 2.34e-13 mm | 2979 / 96 / 0 | 2979 / 96 / 0 | 2979 / 96 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: hits.maxDistance 2.12e-13 mm | PASS: landing.maxDistance 1.08e-13 mm | PASS: hits.maxDistance 2.16e-13 mm | 3021 / 54 / 0 | 3021 / 54 / 0 | 3021 / 54 / 0 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: landing.maxDistance 2.22e-13 mm | PASS: hits.maxDistance 2.06e-13 mm | PASS: hits.maxDistance 2.69e-13 mm | 2995 / 80 / 0 | 2995 / 80 / 0 | 2995 / 80 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.17e-13 mm | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2669 / 406 / 0 | 2669 / 406 / 0 | 2669 / 406 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: hits.maxDistance 1.35e-13 mm | PASS: hits.maxDistance 9.72e-13 mm | PASS: hits.maxDistance 9.72e-13 mm | 2953 / 122 / 0 | 2953 / 122 / 0 | 2953 / 122 / 0 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: landing.maxDistance 7.84e-14 mm | PASS: hits.maxDistance 9.86e-13 mm | PASS: hits.maxDistance 9.86e-13 mm | 2050 / 0 / 0 | 2050 / 0 / 0 | 2050 / 0 / 0 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: landing.maxDistance 4.62e-14 mm | PASS: landing.maxDistance 4.62e-14 mm | PASS: landing.maxDistance 4.27e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: landing.maxDistance 2.39e-13 mm | PASS: landing.maxDistance 2.94e-13 mm | PASS: landing.maxDistance 2.45e-13 mm | 2937 / 138 / 0 | 2937 / 138 / 0 | 2937 / 138 / 0 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: hits.maxDistance 7.40e-13 mm | PASS: hits.maxDistance 9.89e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2275 / 800 / 0 | 2275 / 800 / 0 | 2275 / 800 / 0 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: landing.maxDistance 1.15e-13 mm | PASS: hits.maxDistance 9.56e-13 mm | PASS: hits.maxDistance 9.56e-13 mm | 1025 / 0 / 0 | 1025 / 0 / 0 | 1025 / 0 / 0 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.80e-13 mm | PASS: landing.maxDistance 1.29e-13 mm | PASS: landing.maxDistance 2.53e-13 mm | 2639 / 436 / 0 | 2639 / 436 / 0 | 2639 / 436 / 0 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: landing.maxDistance 2.38e-13 mm | PASS: landing.maxDistance 1.22e-13 mm | PASS: landing.maxDistance 2.11e-13 mm | 2427 / 648 / 0 | 2427 / 648 / 0 | 2427 / 648 / 0 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: hits.maxDistance 8.71e-13 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | 2479 / 596 / 0 | 2479 / 596 / 0 | 2479 / 596 / 0 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2719 / 356 / 0 | 2719 / 356 / 0 | 2719 / 356 / 0 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: hits.maxDistance 9.58e-13 mm | PASS: hits.maxDistance 9.67e-13 mm | PASS: hits.maxDistance 9.70e-13 mm | 2819 / 256 / 0 | 2819 / 256 / 0 | 2819 / 256 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.23e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.26e-12 mm | 2589 / 486 / 0 | 2589 / 486 / 0 | 2589 / 486 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: hits.maxDistance 3.81e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2657 / 418 / 0 | 2657 / 418 / 0 | 2657 / 418 / 0 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: landing.maxDistance 2.24e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 2521 / 554 / 0 | 2521 / 554 / 0 | 2521 / 554 / 0 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.45e-13 mm | PASS: landing.maxDistance 1.59e-13 mm | PASS: landing.maxDistance 2.21e-13 mm | 2539 / 536 / 0 | 2539 / 536 / 0 | 2539 / 536 / 0 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.07e-13 mm | PASS: hits.maxDistance 1.23e-12 mm | PASS: hits.maxDistance 1.22e-12 mm | 2689 / 386 / 0 | 2689 / 386 / 0 | 2689 / 386 / 0 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2941 / 134 / 0 | 2941 / 134 / 0 | 2941 / 134 / 0 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 2431 / 644 / 0 | 2431 / 644 / 0 | 2431 / 644 / 0 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 9.60e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.12e-12 mm | 2471 / 604 / 0 | 2471 / 604 / 0 | 2471 / 604 / 0 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.13e-13 mm | PASS: hits.maxDistance 9.88e-13 mm | PASS: hits.maxDistance 9.80e-13 mm | 2369 / 706 / 0 | 2369 / 706 / 0 | 2369 / 706 / 0 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.55e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2871 / 204 / 0 | 2871 / 204 / 0 | 2871 / 204 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2619 / 456 / 0 | 2619 / 456 / 0 | 2619 / 456 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 2571 / 504 / 0 | 2571 / 504 / 0 | 2571 / 504 / 0 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 9.95e-13 mm | 2493 / 582 / 0 | 2493 / 582 / 0 | 2493 / 582 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: landing.maxDistance 1.95e-13 mm | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 2.13e-13 mm | 2735 / 340 / 0 | 2735 / 340 / 0 | 2735 / 340 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: landing.maxDistance 2.34e-13 mm | PASS: landing.maxDistance 1.16e-13 mm | PASS: landing.maxDistance 2.19e-13 mm | 2793 / 282 / 0 | 2793 / 282 / 0 | 2793 / 282 / 0 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: landing.maxDistance 2.74e-13 mm | PASS: landing.maxDistance 1.63e-13 mm | PASS: landing.maxDistance 2.09e-13 mm | 2707 / 368 / 0 | 2707 / 368 / 0 | 2707 / 368 / 0 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: hits.maxDistance 6.50e-13 mm | PASS: hits.maxDistance 1.18e-12 mm | PASS: hits.maxDistance 1.23e-12 mm | 2405 / 670 / 0 | 2405 / 670 / 0 | 2405 / 670 / 0 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: landing.maxDistance 2.27e-13 mm | PASS: hits.maxDistance 1.55e-13 mm | PASS: landing.maxDistance 2.15e-13 mm | 2391 / 684 / 0 | 2391 / 684 / 0 | 2391 / 684 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: landing.maxDistance 2.36e-13 mm | PASS: hits.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 2.64e-13 mm | 2511 / 564 / 0 | 2511 / 564 / 0 | 2511 / 564 / 0 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: landing.maxDistance 3.00e-13 mm | PASS: landing.maxDistance 2.23e-13 mm | PASS: landing.maxDistance 4.54e-13 mm | 2315 / 760 / 0 | 2315 / 760 / 0 | 2315 / 760 / 0 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: landing.maxDistance 1.58e-13 mm | PASS: landing.maxDistance 1.19e-13 mm | PASS: landing.maxDistance 1.63e-13 mm | 2957 / 118 / 0 | 2957 / 118 / 0 | 2957 / 118 / 0 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.74e-13 mm | PASS: landing.maxDistance 2.35e-13 mm | PASS: landing.maxDistance 3.30e-13 mm | 2063 / 1012 / 0 | 2063 / 1012 / 0 | 2063 / 1012 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: landing.maxDistance 2.01e-13 mm | PASS: landing.maxDistance 9.53e-14 mm | PASS: landing.maxDistance 1.98e-13 mm | 2457 / 618 / 0 | 2457 / 618 / 0 | 2457 / 618 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: landing.maxDistance 2.12e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 2.03e-13 mm | 2789 / 286 / 0 | 2789 / 286 / 0 | 2789 / 286 / 0 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: landing.maxDistance 2.24e-13 mm | PASS: landing.maxDistance 1.83e-13 mm | PASS: landing.maxDistance 2.16e-13 mm | 2545 / 530 / 0 | 2545 / 530 / 0 | 2545 / 530 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.19e-12 mm | PASS: hits.maxDistance 1.22e-12 mm | 2431 / 644 / 0 | 2431 / 644 / 0 | 2431 / 644 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.28e-12 mm | PASS: hits.maxDistance 1.31e-12 mm | 2715 / 360 / 0 | 2715 / 360 / 0 | 2715 / 360 / 0 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.23e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.25e-12 mm | 2591 / 484 / 0 | 2591 / 484 / 0 | 2591 / 484 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2631 / 444 / 0 | 2631 / 444 / 0 | 2631 / 444 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | 2577 / 498 / 0 | 2577 / 498 / 0 | 2577 / 498 / 0 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | 2491 / 584 / 0 | 2491 / 584 / 0 | 2491 / 584 / 0 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: landing.maxDistance 2.09e-13 mm | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 2.16e-13 mm | 2743 / 332 / 0 | 2743 / 332 / 0 | 2743 / 332 / 0 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: hits.maxDistance 1.15e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | 2925 / 150 / 0 | 2925 / 150 / 0 | 2925 / 150 / 0 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: landing.maxDistance 8.32e-14 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.96e-13 mm | 2431 / 644 / 0 | 2431 / 644 / 0 | 2431 / 644 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.81e-9 | certified-sigma-135mm-f14-dg-art-zoom0-focus2 | field 8.49e0, line 0, ray 551 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.32e-9 | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | field 6.15e0, line 0, ray 803 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.90e-9 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | field 1.12e1, line 0, ray 267 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.63e-9 | certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | field 5.72e1, line 0, ray 513 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.42e-9 | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | field 6.15e0, line 0, ray 803 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.90e-9 | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | field 2.54e1, line 0, ray 546 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.48e-9 | certified-sigma-135mm-f14-dg-art-zoom0-focus1 | field 8.83e0, line 0, ray 481 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.47e-9 | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | field 2.54e1, line 0, ray 546 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 3.14e-9 | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | field 2.54e1, line 0, ray 546 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.61e-9 waves | PASS: opticalPath.maxAbs 2.56e-9 waves |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.11e-9 waves | PASS: opd.maxAbs 1.31e-9 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 2.42e-9 waves | PASS: opticalPath.maxAbs 2.32e-9 waves |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 8.22e-10 waves | PASS: opticalPath.maxAbs 1.40e-9 waves | PASS: opticalPathToImage.maxAbs 1.35e-9 waves |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.64e-9 waves |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: opticalPath.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.74e-9 waves |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 2.13e-9 waves |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.74e-9 waves |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 1.40e-9 waves | PASS: opd.maxAbs 1.45e-9 waves |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 1.89e-9 waves | PASS: opd.maxAbs 1.98e-9 waves |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 6.77e-10 waves | PASS: opticalPathToImage.maxAbs 5.80e-10 waves | PASS: opd.maxAbs 6.77e-10 waves |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 2.90e-10 waves |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 9.19e-10 waves | PASS: opticalPath.maxAbs 9.67e-10 waves |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 8.71e-10 waves | PASS: opticalPathToImage.maxAbs 8.22e-10 waves |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: opticalPathToImage.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opticalPath.maxAbs 8.22e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 6.77e-10 waves | PASS: opd.maxAbs 7.74e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: opticalPath.maxAbs 6.77e-10 waves | PASS: opticalPath.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 6.77e-10 waves |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: opd.maxAbs 8.71e-10 waves | PASS: opticalPath.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 6.77e-10 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: opd.maxAbs 2.42e-10 waves | PASS: opticalPathToImage.maxAbs 2.08e-9 waves | PASS: opticalPath.maxAbs 1.93e-9 waves |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 1.60e-9 waves | PASS: opd.maxAbs 1.60e-9 waves |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: opd.maxAbs 9.67e-11 waves | PASS: opticalPath.maxAbs 4.84e-11 waves | PASS: opticalPath.maxAbs 7.26e-11 waves |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 2.42e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.50e-9 waves |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: opticalPath.maxAbs 2.42e-10 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.79e-9 waves | PASS: opticalPath.maxAbs 3.63e-9 waves | PASS: opticalPath.maxAbs 3.14e-9 waves |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 2.76e-9 waves | PASS: opticalPath.maxAbs 3.29e-9 waves | PASS: opticalPath.maxAbs 3.48e-9 waves |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: opticalPath.maxAbs 2.81e-9 waves | PASS: opticalPath.maxAbs 3.19e-9 waves | PASS: opticalPath.maxAbs 3.14e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 3.29e-9 waves | PASS: opticalPath.maxAbs 3.24e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: opticalPath.maxAbs 5.80e-10 waves | PASS: opticalPath.maxAbs 3.05e-9 waves | PASS: opticalPath.maxAbs 2.85e-9 waves |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 3.58e-9 waves | PASS: opticalPath.maxAbs 3.43e-9 waves |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 6.77e-10 waves | PASS: opd.maxAbs 6.77e-10 waves | PASS: opd.maxAbs 6.77e-10 waves |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 1.72e-9 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves | PASS: opticalPathToImage.maxAbs 1.57e-9 waves |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opd.maxAbs 1.84e-9 waves | PASS: opd.maxAbs 2.13e-9 waves |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 3.00e-9 waves | PASS: opticalPath.maxAbs 3.19e-9 waves |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 3.24e-9 waves | PASS: opticalPath.maxAbs 3.29e-9 waves |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 2.42e-10 waves | PASS: opticalPath.maxAbs 2.13e-9 waves | PASS: opticalPath.maxAbs 2.13e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: opd.maxAbs 2.23e-9 waves | PASS: opticalPath.maxAbs 2.03e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: opd.maxAbs 2.81e-9 waves | PASS: opd.maxAbs 2.71e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: opd.maxAbs 2.42e-9 waves | PASS: opd.maxAbs 2.42e-9 waves | PASS: opd.maxAbs 1.93e-9 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 5.80e-10 waves |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: opticalPath.maxAbs 4.35e-10 waves | PASS: opticalPathToImage.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.02e-9 waves | PASS: opticalPath.maxAbs 3.14e-9 waves | PASS: opticalPath.maxAbs 3.05e-9 waves |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.40e-9 waves | PASS: opticalPathToImage.maxAbs 1.35e-9 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 1.16e-9 waves |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 9.67e-10 waves |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: opticalPathToImage.maxAbs 2.42e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: opd.maxAbs 1.93e-9 waves | PASS: opd.maxAbs 1.93e-9 waves | PASS: opd.maxAbs 1.93e-9 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 3.87e-10 waves |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: opd.maxAbs 2.61e-9 waves | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 1.74e-9 waves |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: opd.maxAbs 2.90e-9 waves | PASS: opd.maxAbs 2.61e-9 waves | PASS: opd.maxAbs 2.13e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.93e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: opticalPath.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 2.32e-9 waves | PASS: opd.maxAbs 1.64e-9 waves |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: opd.maxAbs 2.23e-9 waves | PASS: opticalPath.maxAbs 2.13e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: opd.maxAbs 3.14e-10 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.02e-9 waves |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: opd.maxAbs 2.18e-10 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 7.43e-12 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | cut tangential, field 1.12e1, frequencyPerMm 98 |
| lv – optiland | rays.compared [rays] | 169684 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 1 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 9.66e-12 | certified-samyang-af-14mm-f28-ef-zoom0-focus1 | cut tangential, field 5.93e1, frequencyPerMm 72 |
| lv – ref | rays.compared [rays] | 169684 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 1 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.01e-11 | certified-thypoch-ksana-21mm-f35-zoom0-focus1 | cut tangential, field 4.40e1, frequencyPerMm 96 |
| optiland – ref | rays.compared [rays] | 169684 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 1 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | PASS: mtf.maxAbs 2.62e-12 | PASS: mtf.maxAbs 1.30e-12 | PASS: mtf.maxAbs 1.98e-12 |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.62e-12 | PASS: mtf.maxAbs 3.02e-12 | PASS: mtf.maxAbs 4.26e-12 |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.42e-12 | PASS: mtf.maxAbs 6.28e-12 | PASS: mtf.maxAbs 5.76e-12 |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.39e-12 | PASS: mtf.maxAbs 3.18e-12 | PASS: mtf.maxAbs 2.25e-12 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.39e-12 | PASS: mtf.maxAbs 3.52e-12 | PASS: mtf.maxAbs 4.51e-12 |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: mtf.maxAbs 9.81e-13 | PASS: mtf.maxAbs 3.15e-12 | PASS: mtf.maxAbs 2.87e-12 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.20e-12 | PASS: mtf.maxAbs 2.63e-12 | PASS: mtf.maxAbs 3.17e-12 |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 2.27e-12 | PASS: mtf.maxAbs 2.54e-12 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.10e-12 | PASS: mtf.maxAbs 9.48e-13 | PASS: mtf.maxAbs 1.12e-12 |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 1.48e-12 | PASS: mtf.maxAbs 6.88e-13 | PASS: mtf.maxAbs 1.56e-12 |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 1.41e-12 | PASS: mtf.maxAbs 1.66e-12 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 3 | PASS: mtf.maxAbs 8.64e-13 | PASS: mtf.maxAbs 6.71e-13 | PASS: mtf.maxAbs 1.04e-12 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 3 | PASS: mtf.maxAbs 1.16e-12 | PASS: mtf.maxAbs 3.59e-13 | PASS: mtf.maxAbs 1.43e-12 |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 3 | PASS: mtf.maxAbs 9.68e-13 | PASS: mtf.maxAbs 1.01e-12 | PASS: mtf.maxAbs 1.20e-12 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.84e-13 | PASS: mtf.maxAbs 5.87e-13 | PASS: mtf.maxAbs 4.79e-13 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: mtf.maxAbs 5.14e-13 | PASS: mtf.maxAbs 5.02e-13 | PASS: mtf.maxAbs 1.02e-12 |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: mtf.maxAbs 1.56e-12 | PASS: mtf.maxAbs 9.13e-13 | PASS: mtf.maxAbs 1.25e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: mtf.maxAbs 3.11e-12 | PASS: mtf.maxAbs 1.13e-12 | PASS: mtf.maxAbs 2.87e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: mtf.maxAbs 1.69e-12 | PASS: mtf.maxAbs 2.96e-12 | PASS: mtf.maxAbs 3.32e-12 |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: mtf.maxAbs 2.18e-12 | PASS: mtf.maxAbs 1.22e-12 | PASS: mtf.maxAbs 2.62e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.00e-12 | PASS: mtf.maxAbs 1.88e-12 | PASS: mtf.maxAbs 2.02e-12 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: mtf.maxAbs 4.90e-13 | PASS: mtf.maxAbs 6.45e-13 | PASS: mtf.maxAbs 6.76e-13 |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: mtf.maxAbs 6.52e-13 | PASS: mtf.maxAbs 1.40e-12 | PASS: mtf.maxAbs 1.51e-12 |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.28e-13 | PASS: mtf.maxAbs 4.12e-13 | PASS: mtf.maxAbs 3.82e-13 |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: mtf.maxAbs 1.97e-12 | PASS: mtf.maxAbs 1.39e-12 | PASS: mtf.maxAbs 1.96e-12 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.62e-12 | PASS: mtf.maxAbs 9.66e-12 | PASS: mtf.maxAbs 7.37e-12 |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: mtf.maxAbs 1.01e-12 | PASS: mtf.maxAbs 4.31e-12 | PASS: mtf.maxAbs 3.43e-12 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.44e-12 | PASS: mtf.maxAbs 2.55e-12 | PASS: mtf.maxAbs 4.71e-12 |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 2.31e-12 | PASS: mtf.maxAbs 1.36e-12 | PASS: mtf.maxAbs 1.56e-12 |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.22e-12 | PASS: mtf.maxAbs 6.41e-12 | PASS: mtf.maxAbs 6.80e-12 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.15e-12 | PASS: mtf.maxAbs 4.00e-12 | PASS: mtf.maxAbs 4.46e-12 |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 2.43e-12 | PASS: mtf.maxAbs 3.03e-12 | PASS: mtf.maxAbs 3.15e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.01e-12 | PASS: mtf.maxAbs 2.33e-12 | PASS: mtf.maxAbs 3.98e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: mtf.maxAbs 1.73e-12 | PASS: mtf.maxAbs 1.77e-12 | PASS: mtf.maxAbs 1.98e-12 |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: mtf.maxAbs 1.86e-12 | PASS: mtf.maxAbs 4.49e-12 | PASS: mtf.maxAbs 4.47e-12 |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.57e-12 | PASS: mtf.maxAbs 2.09e-12 | PASS: mtf.maxAbs 2.52e-12 |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.61e-12 | PASS: mtf.maxAbs 5.30e-12 | PASS: mtf.maxAbs 5.08e-12 |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.31e-12 | PASS: mtf.maxAbs 4.98e-12 | PASS: mtf.maxAbs 5.59e-12 |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.80e-12 | PASS: mtf.maxAbs 5.17e-12 | PASS: mtf.maxAbs 3.60e-12 |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.42e-12 | PASS: mtf.maxAbs 5.63e-12 | PASS: mtf.maxAbs 5.62e-12 |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.71e-12 | PASS: mtf.maxAbs 4.09e-12 | PASS: mtf.maxAbs 4.14e-12 |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.84e-12 | PASS: mtf.maxAbs 2.23e-12 | PASS: mtf.maxAbs 3.93e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 6.02e-12 | PASS: mtf.maxAbs 5.46e-12 | PASS: mtf.maxAbs 3.42e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: mtf.maxAbs 6.57e-12 | PASS: mtf.maxAbs 4.79e-12 | PASS: mtf.maxAbs 1.96e-12 |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: mtf.maxAbs 2.76e-12 | PASS: mtf.maxAbs 2.73e-12 | PASS: mtf.maxAbs 2.77e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: mtf.maxAbs 1.73e-12 | PASS: mtf.maxAbs 1.21e-12 | PASS: mtf.maxAbs 2.02e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: mtf.maxAbs 2.03e-12 | PASS: mtf.maxAbs 1.01e-12 | PASS: mtf.maxAbs 2.33e-12 |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: mtf.maxAbs 1.90e-12 | PASS: mtf.maxAbs 2.05e-12 | PASS: mtf.maxAbs 2.16e-12 |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.68e-12 | PASS: mtf.maxAbs 3.21e-12 | PASS: mtf.maxAbs 3.62e-12 |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.77e-12 | PASS: mtf.maxAbs 1.40e-12 | PASS: mtf.maxAbs 1.26e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: mtf.maxAbs 2.52e-12 | PASS: mtf.maxAbs 1.43e-12 | PASS: mtf.maxAbs 2.96e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: mtf.maxAbs 1.94e-12 | PASS: mtf.maxAbs 9.19e-13 | PASS: mtf.maxAbs 2.07e-12 |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: mtf.maxAbs 2.54e-12 | PASS: mtf.maxAbs 2.02e-12 | PASS: mtf.maxAbs 2.35e-12 |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: mtf.maxAbs 9.99e-13 | PASS: mtf.maxAbs 2.24e-12 | PASS: mtf.maxAbs 2.26e-12 |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.57e-12 | PASS: mtf.maxAbs 3.42e-12 | PASS: mtf.maxAbs 4.46e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: mtf.maxAbs 1.93e-12 | PASS: mtf.maxAbs 1.15e-12 | PASS: mtf.maxAbs 2.05e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: mtf.maxAbs 1.97e-12 | PASS: mtf.maxAbs 1.80e-12 | PASS: mtf.maxAbs 1.39e-12 |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: mtf.maxAbs 1.64e-12 | PASS: mtf.maxAbs 1.17e-12 | PASS: mtf.maxAbs 1.91e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: mtf.maxAbs 6.87e-12 | PASS: mtf.maxAbs 7.67e-12 | PASS: mtf.maxAbs 4.05e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: mtf.maxAbs 2.83e-12 | PASS: mtf.maxAbs 9.64e-12 | PASS: mtf.maxAbs 8.38e-12 |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: mtf.maxAbs 7.43e-12 | PASS: mtf.maxAbs 5.45e-12 | PASS: mtf.maxAbs 5.61e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: mtf.maxAbs 7.37e-12 | PASS: mtf.maxAbs 4.51e-12 | PASS: mtf.maxAbs 5.42e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: mtf.maxAbs 4.75e-12 | PASS: mtf.maxAbs 6.20e-12 | PASS: mtf.maxAbs 5.46e-12 |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: mtf.maxAbs 4.40e-12 | PASS: mtf.maxAbs 5.21e-12 | PASS: mtf.maxAbs 6.42e-12 |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.80e-12 | PASS: mtf.maxAbs 1.71e-12 | PASS: mtf.maxAbs 2.31e-12 |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.61e-12 | PASS: mtf.maxAbs 5.88e-12 | PASS: mtf.maxAbs 1.01e-11 |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.88e-12 | PASS: mtf.maxAbs 4.56e-12 | PASS: mtf.maxAbs 5.79e-12 |
