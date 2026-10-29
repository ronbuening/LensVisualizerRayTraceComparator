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
| Baseline hash | 4d67c4c3607c3d179015fcd867942ce818bf525f6627a7bec4d91c730f00a37d |
| Contract version | 1.3 |
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
| r4 | rays.trace | 67 | 191 | lv – optiland | 67 PASS | 191 PASS |
| r4 | rays.trace | 67 | 191 | lv – ref | 67 PASS | 191 PASS |
| r4 | rays.trace | 67 | 191 | optiland – ref | 67 PASS | 191 PASS |
| r4f | mtf.native | 67 | 67 | lv – replay | 67 PASS | 67 PASS |
| r6a | rays.trace | 67 | 191 | lv – optiland | 67 PASS | 191 PASS |
| r6a | rays.trace | 67 | 191 | lv – ref | 67 PASS | 191 PASS |
| r6a | rays.trace | 67 | 191 | optiland – ref | 67 PASS | 191 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r4 | lv | 67 ok |
| r4 | optiland | 67 ok |
| r4 | ref | 67 ok |
| r4f | lv | 67 ok |
| r4f | replay | 67 ok |
| r6a | lv | 67 ok |
| r6a | optiland | 67 ok |
| r6a | ref | 67 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 7.43e-12 | 191 of 191 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | cut tangential, field 1.12e1, frequencyPerMm 98 |
| lv – optiland | rays.compared [rays] | 169684 | 191 of 191 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 191 of 191 | — | — |
| lv – optiland | lines.compared [lines] | 1 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 9.66e-12 | 191 of 191 | certified-samyang-af-14mm-f28-ef-zoom0-focus1 | cut tangential, field 5.93e1, frequencyPerMm 72 |
| lv – ref | rays.compared [rays] | 169684 | 191 of 191 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 191 of 191 | — | — |
| lv – ref | lines.compared [lines] | 1 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.01e-11 | 191 of 191 | certified-thypoch-ksana-21mm-f35-zoom0-focus1 | cut tangential, field 4.40e1, frequencyPerMm 96 |
| optiland – ref | rays.compared [rays] | 169684 | 191 of 191 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 191 of 191 | — | — |
| optiland – ref | lines.compared [lines] | 1 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | PASS: mtf.maxAbs 2.62e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.98e-12 (3 of 3) |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.02e-12 (3 of 3) | PASS: mtf.maxAbs 4.26e-12 (3 of 3) |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.42e-12 (3 of 3) | PASS: mtf.maxAbs 6.28e-12 (3 of 3) | PASS: mtf.maxAbs 5.76e-12 (3 of 3) |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 3.18e-12 (3 of 3) | PASS: mtf.maxAbs 2.25e-12 (3 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.39e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: mtf.maxAbs 9.81e-13 (2 of 2) | PASS: mtf.maxAbs 3.15e-12 (2 of 2) | PASS: mtf.maxAbs 2.87e-12 (2 of 2) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.63e-12 (3 of 3) | PASS: mtf.maxAbs 3.17e-12 (3 of 3) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 2.27e-12 (3 of 3) | PASS: mtf.maxAbs 2.54e-12 (3 of 3) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 9.48e-13 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 6.88e-13 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 3 | PASS: mtf.maxAbs 8.64e-13 (3 of 3) | PASS: mtf.maxAbs 6.71e-13 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 3 | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 3.59e-13 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 3 | PASS: mtf.maxAbs 9.68e-13 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.84e-13 (1 of 1) | PASS: mtf.maxAbs 5.87e-13 (1 of 1) | PASS: mtf.maxAbs 4.79e-13 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: mtf.maxAbs 5.14e-13 (1 of 1) | PASS: mtf.maxAbs 5.02e-13 (1 of 1) | PASS: mtf.maxAbs 1.02e-12 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: mtf.maxAbs 1.56e-12 (1 of 1) | PASS: mtf.maxAbs 9.13e-13 (1 of 1) | PASS: mtf.maxAbs 1.25e-12 (1 of 1) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 2.87e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 2.96e-12 (3 of 3) | PASS: mtf.maxAbs 3.32e-12 (3 of 3) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: mtf.maxAbs 2.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 2.02e-12 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: mtf.maxAbs 4.90e-13 (3 of 3) | PASS: mtf.maxAbs 6.45e-13 (3 of 3) | PASS: mtf.maxAbs 6.76e-13 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: mtf.maxAbs 6.52e-13 (2 of 2) | PASS: mtf.maxAbs 1.40e-12 (2 of 2) | PASS: mtf.maxAbs 1.51e-12 (2 of 2) |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.28e-13 (3 of 3) | PASS: mtf.maxAbs 4.12e-13 (3 of 3) | PASS: mtf.maxAbs 3.82e-13 (3 of 3) |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 9.66e-12 (3 of 3) | PASS: mtf.maxAbs 7.37e-12 (3 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: mtf.maxAbs 1.01e-12 (1 of 1) | PASS: mtf.maxAbs 4.31e-12 (1 of 1) | PASS: mtf.maxAbs 3.43e-12 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.44e-12 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) | PASS: mtf.maxAbs 4.71e-12 (3 of 3) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 3.22e-12 (3 of 3) | PASS: mtf.maxAbs 6.41e-12 (3 of 3) | PASS: mtf.maxAbs 6.80e-12 (3 of 3) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.15e-12 (3 of 3) | PASS: mtf.maxAbs 4.00e-12 (3 of 3) | PASS: mtf.maxAbs 4.46e-12 (3 of 3) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: mtf.maxAbs 2.43e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) | PASS: mtf.maxAbs 3.15e-12 (3 of 3) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.01e-12 (3 of 3) | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 3.98e-12 (3 of 3) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 1.98e-12 (3 of 3) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: mtf.maxAbs 1.86e-12 (3 of 3) | PASS: mtf.maxAbs 4.49e-12 (3 of 3) | PASS: mtf.maxAbs 4.47e-12 (3 of 3) |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.30e-12 (3 of 3) | PASS: mtf.maxAbs 5.08e-12 (3 of 3) |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 4.98e-12 (3 of 3) | PASS: mtf.maxAbs 5.59e-12 (3 of 3) |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.80e-12 (3 of 3) | PASS: mtf.maxAbs 5.17e-12 (3 of 3) | PASS: mtf.maxAbs 3.60e-12 (3 of 3) |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 5.63e-12 (3 of 3) | PASS: mtf.maxAbs 5.62e-12 (3 of 3) |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.71e-12 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) | PASS: mtf.maxAbs 4.14e-12 (3 of 3) |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) | PASS: mtf.maxAbs 3.93e-12 (3 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: mtf.maxAbs 6.02e-12 (3 of 3) | PASS: mtf.maxAbs 5.46e-12 (3 of 3) | PASS: mtf.maxAbs 3.42e-12 (3 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: mtf.maxAbs 6.57e-12 (3 of 3) | PASS: mtf.maxAbs 4.79e-12 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: mtf.maxAbs 2.76e-12 (3 of 3) | PASS: mtf.maxAbs 2.73e-12 (3 of 3) | PASS: mtf.maxAbs 2.77e-12 (3 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.02e-12 (3 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 2.33e-12 (3 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 2.05e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 3.21e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.26e-12 (3 of 3) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: mtf.maxAbs 2.52e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 2.96e-12 (3 of 3) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: mtf.maxAbs 1.94e-12 (3 of 3) | PASS: mtf.maxAbs 9.19e-13 (3 of 3) | PASS: mtf.maxAbs 2.07e-12 (3 of 3) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 2.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.35e-12 (3 of 3) |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: mtf.maxAbs 9.99e-13 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 3.42e-12 (3 of 3) | PASS: mtf.maxAbs 4.46e-12 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 2.05e-12 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: mtf.maxAbs 1.64e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: mtf.maxAbs 6.87e-12 (3 of 3) | PASS: mtf.maxAbs 7.67e-12 (3 of 3) | PASS: mtf.maxAbs 4.05e-12 (3 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: mtf.maxAbs 2.83e-12 (3 of 3) | PASS: mtf.maxAbs 9.64e-12 (3 of 3) | PASS: mtf.maxAbs 8.38e-12 (3 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: mtf.maxAbs 7.43e-12 (3 of 3) | PASS: mtf.maxAbs 5.45e-12 (3 of 3) | PASS: mtf.maxAbs 5.61e-12 (3 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: mtf.maxAbs 7.37e-12 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) | PASS: mtf.maxAbs 5.42e-12 (3 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 3 | PASS: mtf.maxAbs 4.75e-12 (3 of 3) | PASS: mtf.maxAbs 6.20e-12 (3 of 3) | PASS: mtf.maxAbs 5.46e-12 (3 of 3) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 3 | PASS: mtf.maxAbs 4.40e-12 (3 of 3) | PASS: mtf.maxAbs 5.21e-12 (3 of 3) | PASS: mtf.maxAbs 6.42e-12 (3 of 3) |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 2.31e-12 (3 of 3) |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 3 | PASS: mtf.maxAbs 4.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.88e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-11 (3 of 3) |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 3 | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 4.56e-12 (3 of 3) | PASS: mtf.maxAbs 5.79e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.58e-14 | 67 of 67 | certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | cut sagittal, field 7.50e-1, frequencyPerMm 2 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 67 of 67 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 67 of 67 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 1 | PASS: mtf.maxAbs 1.48e-14 (1 of 1) |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.58e-14 (1 of 1) |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.38e-14 (1 of 1) |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 1 | PASS: mtf.maxAbs 2.50e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.flagged | 6.40e-10 | 107 of 191 | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | cut sagittal, field 1.18e1, frequencyPerMm 60 |
| lv – optiland | phaseStep.waves [waves] | 1.05e1 | 190 of 191 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | field 1.05e1, line 0, ray 1856 |
| lv – optiland | convergence.maxAbs | 1.58e-1 | 190 of 191 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | cut tangential, field 2.01e1, frequencyPerMm 70 |
| lv – optiland | lattice.columns [cells] | 64 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| lv – optiland | rays.compared [rays] | 679662 | 191 of 191 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 191 of 191 | — | — |
| lv – optiland | lines.compared [lines] | 1 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 7.89e-10 | 83 of 191 | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | cut tangential, field 0, frequencyPerMm 100 |
| lv – ref | waveMtf.flagged | 1.00e-9 | 107 of 191 | certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | cut tangential, field 3.26e1, frequencyPerMm 70 |
| lv – ref | phaseStep.waves [waves] | 1.05e1 | 190 of 191 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | field 1.05e1, line 0, ray 1856 |
| lv – ref | convergence.maxAbs | 1.58e-1 | 190 of 191 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | cut tangential, field 2.01e1, frequencyPerMm 70 |
| lv – ref | lattice.columns [cells] | 64 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| lv – ref | rays.compared [rays] | 679662 | 191 of 191 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 191 of 191 | — | — |
| lv – ref | lines.compared [lines] | 1 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 8.92e-10 | 83 of 191 | certified-samyang-af-14mm-f28-ef-zoom0-focus2 | cut tangential, field 0, frequencyPerMm 90 |
| optiland – ref | waveMtf.flagged | 1.03e-9 | 107 of 191 | certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | cut tangential, field 3.26e1, frequencyPerMm 70 |
| optiland – ref | phaseStep.waves [waves] | 1.05e1 | 190 of 191 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | field 1.05e1, line 0, ray 1856 |
| optiland – ref | convergence.maxAbs | 1.58e-1 | 190 of 191 | certified-thypoch-simera-50mm-f14-zoom0-focus1 | cut tangential, field 2.01e1, frequencyPerMm 70 |
| optiland – ref | lattice.columns [cells] | 64 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| optiland – ref | rays.compared [rays] | 679662 | 191 of 191 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 191 of 191 | — | — |
| optiland – ref | lines.compared [lines] | 1 | 191 of 191 | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 8.79e-10 | 83 of 191 | certified-samyang-af-14mm-f28-ef-zoom0-focus2 | cut sagittal, field 0, frequencyPerMm 80 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | 3 | PASS: waveMtf.maxAbs 2.59e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.57e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.72e-11 (2 of 3) |
| certified-fujifilm-gf80-f17-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 9.00e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.04e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.53e-10 (3 of 3) |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 6.07e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.05e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.51e-11 (1 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 4.94e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.70e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.01e-10 (2 of 3) |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | 2 | PASS: waveMtf.maxAbs 1.90e-11 (1 of 2) | PASS: waveMtf.maxAbs 1.21e-10 (1 of 2) | PASS: waveMtf.maxAbs 1.19e-10 (1 of 2) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 4.55e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.92e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.27e-11 (1 of 3) |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 3 | PASS: waveMtf.maxAbs 1.19e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.53e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.63e-10 (1 of 3) |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.68e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.96e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.77e-11 (3 of 3) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | 3 | PASS: waveMtf.maxAbs 4.16e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.50e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.82e-11 (3 of 3) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 3 | PASS: waveMtf.maxAbs 2.86e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.15e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.57e-11 (3 of 3) |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | 3 | PASS: waveMtf.maxAbs 3.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.32e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.90e-11 (2 of 3) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 1 | PASS: waveMtf.maxAbs 2.75e-11 (1 of 1) | PASS: waveMtf.maxAbs 1.71e-10 (1 of 1) | PASS: waveMtf.maxAbs 1.51e-10 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 1 | PASS: waveMtf.maxAbs 1.40e-11 (1 of 1) | PASS: waveMtf.maxAbs 1.80e-10 (1 of 1) | PASS: waveMtf.maxAbs 1.82e-10 (1 of 1) |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 1 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 3 | PASS: waveMtf.maxAbs 1.07e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.15e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.73e-10 (3 of 3) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 3 | PASS: waveMtf.maxAbs 1.10e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.93e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.00e-11 (2 of 3) |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | 3 | PASS: waveMtf.maxAbs 6.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.55e-11 (3 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.94e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.99e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (1 of 3) |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.08e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.60e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.92e-12 (3 of 3) |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 3 | PASS: waveMtf.maxAbs 7.55e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.68e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.55e-11 (2 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 4.33e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.06e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.53e-10 (2 of 3) |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 1 | PASS: waveMtf.maxAbs 1.98e-11 (1 of 1) | PASS: waveMtf.maxAbs 8.92e-10 (1 of 1) | PASS: waveMtf.maxAbs 8.79e-10 (1 of 1) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 2.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.86e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.74e-11 (2 of 3) |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 3 | PASS: waveMtf.maxAbs 3.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.39e-11 (2 of 3) |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 2.08e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.69e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.92e-10 (2 of 3) |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.97e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.32e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.33e-10 (1 of 3) |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 5.47e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.61e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.07e-11 (1 of 3) |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.61e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.87e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.56e-10 (1 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 1.90e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.73e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.63e-10 (1 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 3 | PASS: waveMtf.maxAbs 2.97e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.79e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.25e-10 (2 of 3) |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 3 | PASS: waveMtf.maxAbs 5.88e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.04e-11 (1 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 3 | PASS: waveMtf.maxAbs 5.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.56e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.86e-11 (1 of 3) |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 3 | PASS: waveMtf.maxAbs 7.43e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.54e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.01e-10 (3 of 3) |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 4.83e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.54e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.54e-10 (3 of 3) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 3 | PASS: waveMtf.maxAbs 4.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.91e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.76e-11 (1 of 3) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 3 | PASS: waveMtf.maxAbs 1.63e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.64e-10 (3 of 3) |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 3 | PASS: waveMtf.maxAbs 1.52e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.94e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.38e-10 (3 of 3) |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.07e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.84e-11 (3 of 3) |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.65e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.25e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.07e-10 (1 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 3 | PASS: waveMtf.maxAbs 2.94e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.43e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.10e-11 (1 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 3 | PASS: waveMtf.maxAbs 3.96e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.12e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.18e-11 (3 of 3) |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | 3 | PASS: waveMtf.maxAbs 3.38e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.55e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.67e-11 (2 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 4.76e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.67e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (2 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 3 | PASS: waveMtf.maxAbs 7.89e-10 (1 of 3) | PASS: waveMtf.maxAbs 5.36e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.78e-10 (1 of 3) |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | 3 | PASS: waveMtf.maxAbs 3.06e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.99e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.92e-10 (2 of 3) |
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
- Zoom and focus positions other than the states a run names, and the catalog beyond these suites.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.
