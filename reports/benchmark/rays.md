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
| Suite hash | ca12c885c2454c3cb1a8d0c54d51128a20c4919c2ceb84c3d03a7404cceb75fa |
| Baseline hash | bc70b1162a11c50c547b1e5b8cb1278823901ec440270d983592f3f22b6227ee |
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
| canon-ef-135-f2l-usm-ref | 8f1f7d95653af82da64d44b73a272e7eb84232c67ee643e47207e067064ee070 |
| canon-ef-135-f2l-usm-photopic | e9e741608e3f5f054625e1189a93c16f57e44893080a8ee4a9451df894df4c60 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | a878f44443376f43150577ade0fdbfbebd809fc9bd062250397b27b0ac3eeea6 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | a193bba6b71293a0b4bac4f7d5a5aff691fc23bc2499284e1c033ad238daec10 |
| sigma-35mm-f14-dg-hsm-a-ref | ccc14e33b434a6ec5fa8af08a14217b9ff7dc32c9d4f8b92125186fa3a45c97b |
| sigma-35mm-f14-dg-hsm-a-photopic | ecd0befffe5b28039511a637f8bd5c08c0932c526a143b07acfdc6e88c6c1ffa |
| nikkor-z50f12-ref | 167e686b31a7497ca34af22c245b0c6cc3ddc6ccd060343c987f04ec18ae4c5f |
| nikkor-z50f12-photopic | 6981c5efa2e0f14d167c0ff9b3465552a294ef75eece6e3af725cabc027843c2 |
| sony-fe-20mm-f18-g-ref | 2e2afa23bd756f5a1091b5d7f1e7f85e104c97472530f52a0ea0076b336b4cab |
| sony-fe-20mm-f18-g-photopic | 23b051950216b1004d67e9984a3181b877a25e5c1f50e7588fe868ade50fed35 |
| sony-fe-400mm-f28-gm-oss-ref | f0819763fb3976af512ce84e17ce149008c06fed4c2f0280f03abc3fe7313fe8 |
| sony-fe-400mm-f28-gm-oss-photopic | e3fb8ca13685378d51194b1fdc6cc573018861b1913f5e65407774b352c9b811 |
| sigma-105mm-f28-dg-dn-macro-art-ref | e11ed3cae518f0c789667ce443bee69fbbe7fadd303e7a960b052999300848b1 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 50d94ea9ff30e0960b74dae45269cecd622dd75af41ca41a945e4761f1839d66 |
| nikon-z-24-70f4s-wide-ref | 327403ce09e2fc94b6122c0799aba12156ffad3f9b726829aeccb18d31efd709 |
| nikon-z-24-70f4s-wide-photopic | 06eff99a7dc852d126aa09c9eea6d4e7b19d5fc77d79c520b5624c3211295979 |
| nikon-z-24-70f4s-tele-ref | ab9c8205a728d127b2ec6bf4b38f868de47d255de7807c917d0ba35ec4b8ca24 |
| nikon-z-24-70f4s-tele-photopic | e7c0aa4bf2ee5a2b0afc8ac68e8a6115e586e7adcb01a741e880c320dba248bf |
| nikon-z-mc-105f28-ref | b5caeb649af604b677236805c0045528ed083c75a1164f65a9148a11a7bfbc54 |
| nikon-z-mc-105f28-photopic | 98d1037760a2c357308bccbe8a4ca815d8c9cce422e54b913d74275645db123d |
| nikon-z-135f18-plena-ref | 0403f9a540eed64c9b7aeed98d14bde823ac3dc2167b69b0ce5c8447d26227be |
| nikon-z-135f18-plena-photopic | d99ccec01961ff60514d1ae14ec6b29e59a96d0d11e3f02ea70dbd82169e30d3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | de1fd91c6b96ca5484034ae48a27924000fb59f1e8f719f78e2ee193da29d561 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3a3ae023a4365a29b0c93a8c939aa2f8c31db5cc4786aa230701c72effd5aac4 |
| canon-ef-135-f2l-usm-best-ref | 2052f579b97c15dd9e0edc1bf94089632145f94a37f8b462e0afe398f4ec6e31 |
| canon-ef-135-f2l-usm-best-photopic | 79b7e9b31278c2f402a92f81eafb628841d74ac037fd6376fecd5eed21970735 |
| canon-ef-135-f2l-usm-f8-ref | 0d53a895f4385bf5e902ed19f86387d900c5d086bad060e2dac454ecec9da88b |
| canon-ef-135-f2l-usm-f8-photopic | 521d837bca954736bc2d2667e116e7660775e964d9da682a90f0fd735af7113c |
| canon-ef-135-f2l-usm-f8-best-ref | 7e0fd832eff94a9e934ed36c2576006b521bbc0ef6fd6621b822ebed3fc15a65 |
| canon-ef-135-f2l-usm-f8-best-photopic | fe9314915a7f093ca6a8a3c784378ac00c0fcb7bef1a29b6a379da47561c4b76 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 34c53d2a6b58c93e8d5f5c57ba61802d9179eb35bfde6c9e7a55cdf50ad005b4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | e91d1d7e689eb46a225d1bb0aef06dc8500e6d6228e3d0157c2d1e5581d591f3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 8c21e5ccda69543a8a81500f39647479c9a40c1995aef338554cfba5eb00a1a7 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | b746236350485ae9ec195f9783db73acfacb6232e538e3d5ce5570c1d0a2aa0e |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | e36a5fb0b20d0e796468d1e12f3989ecca7c61f42968766ae6bca649e6108f64 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 8939436b32b8a852e78246831cef5b59133de1560b018fa59a62ab1d38b8f3f5 |
| sigma-35mm-f14-dg-hsm-a-best-ref | b3ae10efe5903ebb30fb98cc8d7c90d6a40959a98be1811abec29ae491c860cc |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 703b866bdd7097d4dd79329c4d4a36e183dfdc4239a8f21a611906cba18504cf |
| sigma-35mm-f14-dg-hsm-a-f8-ref | be7f2899b89eed48461903c0cec43bfc3cf7d03e3e98f77199f75cd4db37b1d5 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3795d592417d44294806bbd205307932cb56ff1001f51b9af77cdfdc084cde37 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 00aa3e485403fa90dab9eec10a4e5b0f0a131d47180b3b1425f906ec587ae225 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | ff081659525a48c5c301acff34b0765663d1637b594f8dd238cd4456f235d634 |
| nikkor-z50f12-best-ref | f496edb177f4ddadcffa9730961c52de0907f1845d15d09f97ed0a390ae69d94 |
| nikkor-z50f12-best-photopic | 784a2618eede167340d3e9221b8c297d46bbbaed2e06d55e39c311264f0a4a5f |
| nikkor-z50f12-f8-ref | db7f14bc7e96feab83fe3411ec36ce3f40dc835a1510fc3802f22bdd58e0dcde |
| nikkor-z50f12-f8-photopic | 7b40a699ed2c88f9a10f3f39646bd27e3513e325e6c4940a92fa1d8b3c1a2f17 |
| nikkor-z50f12-f8-best-ref | 45163bea58b70cf6a56acf4e4f5c0d7161cf49ab9bd3e9bed690d1cb9990a011 |
| nikkor-z50f12-f8-best-photopic | fe1468edaf95d81d4c1ab8c6e982a77d15ba6e20cebd466b1866a6042174a464 |
| sony-fe-20mm-f18-g-best-ref | d114031a9182fea934944b37136c68f65598238801f0361ff04c8be9dbe9a9ed |
| sony-fe-20mm-f18-g-best-photopic | 03770d45a5e3146819c912958891def321c830ee51586e7342b0ae05a7ee227d |
| sony-fe-20mm-f18-g-f8-ref | 49fed327bafd03598896526d87ec7171f5e4e726f6512ee032a170dafe6ba3c1 |
| sony-fe-20mm-f18-g-f8-photopic | a212a2923f8ffd8470f0b1f6836e63d8db8c73205bfbfcbde61d702fe2023cb6 |
| sony-fe-20mm-f18-g-f8-best-ref | deef77babf0cfbb33b79cdcc8ed6f380b9ef5be6359fc5304a2de7ce9fa6d98d |
| sony-fe-20mm-f18-g-f8-best-photopic | 9dd6d0700dce02b99851ff84e785d9dac1ec496f6d4f0e5f4fe9f7c0520f5cdc |
| sony-fe-400mm-f28-gm-oss-best-ref | c22815ddf3731a9489acd86fa7865bbe3ab8e23609c67d611c4ff086fa2bb109 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 68bbf55c713c5470bd5a49e58c3d3e117d22ae4ce66b02be75405bf7d92e3881 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0974cc94e4d04caae55743254e1d71af9c01019abac16573fff95a27c7ecbe20 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 640804ab2f8ad70507a85ee22ddf73f82e2341b0ef7eb422c35765ad92560e0d |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 7fd76e9812af145629f497f05cb198333354a147d9fcec9268db43a0b03349f7 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 184503ee6849951e105915674c915986959061bad57dac7c65df997cf83b8610 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 88fbfda5fc25f83643f694be062f52357d36912ce4a6ba7fe75aa29011f39730 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 50df9f26ab69012743f173096e93babca09f19edda3d554f0d2cf43010030299 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 4fb64909817675acffa82d0047fd92df80c77bf6db471d516a8623eada7e36f0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 691e1e76fc5cd3bb185ff15911063f7495e3a4faa4420063eff2ceade93b378a |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 77c7bb8587a65f1728bc5dcbc6e10d5da0e9d31bf5af19f6ae9f66e960898b8b |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 30e3597f67e2d564108a2585c616908903e32a3c88a37e313e3e7796768dae65 |
| nikon-z-24-70f4s-wide-best-ref | 11939c22f49c3c0184e3620ffdb796a7bb13ecaf98c933f746a51d75f09488a4 |
| nikon-z-24-70f4s-wide-best-photopic | 303e31f5ade720acd67d934169c6cc0f77527d54bb806e7c6d245723889ffbf9 |
| nikon-z-24-70f4s-wide-f8-ref | a5957b6f15c089d50c0a644948511de4052644c6c1fa3863d7d893f5fc53a63b |
| nikon-z-24-70f4s-wide-f8-photopic | f849b03951a2a6d4ebd62a8f76d30086bd16d9f0b1782b7bca082f79f7b36ec9 |
| nikon-z-24-70f4s-wide-f8-best-ref | 61d7b43c1a213663dfc248e7d8a2c2238912e4ff623656745b2ad5fdf63f167b |
| nikon-z-24-70f4s-wide-f8-best-photopic | 8091381339ef5c9edaa507b3a69a3a4ab2000d06d3cec8914839e09472796a4c |
| nikon-z-24-70f4s-tele-best-ref | d8144040e169d3e83d1feaada545bce52371252135182e0436f63c9de0442f4b |
| nikon-z-24-70f4s-tele-best-photopic | 07e3cb882e9dac1ec3f9ef22754ae4b0abbcddf4373de3e7a560a1cc23015abf |
| nikon-z-24-70f4s-tele-f8-ref | c1783e5c5de7f829e47a84352531ef6c6d2d9d938508504693b20ff52616db71 |
| nikon-z-24-70f4s-tele-f8-photopic | 84b4c2f3410b8bce36fa7d5cf994d9a2d89c1d1aad226bcf3f920f3fa2faed12 |
| nikon-z-24-70f4s-tele-f8-best-ref | 16592d7e0ff140de7ac9fe6d32bb7c40e27440d5b5896ce4b4d9d668fe4a3c6e |
| nikon-z-24-70f4s-tele-f8-best-photopic | 97efc252e05cc6507f706e85b7b58a11288c1466fa91949681772154821a0a3e |
| nikon-z-mc-105f28-best-ref | 4b318ecdbd32caf730fe8066144391e67b7bc5f9503dcc700954333558f8e3db |
| nikon-z-mc-105f28-best-photopic | 94582f866f3c4332793b12998189edbdf7fae5c3b8f38589254305d34bf3086a |
| nikon-z-mc-105f28-f8-ref | 62626b3e8f2320cf56f9fed2217e9f1248c669c90987341dfa64f45dc22aca56 |
| nikon-z-mc-105f28-f8-photopic | e27b43865a3dc776d6e7196faa75f5cca81b8bec759c7efc68a6c277175c99a1 |
| nikon-z-mc-105f28-f8-best-ref | 7baef182ca68de51405f2b7bc5e5d97e626ec54ab84995a91c6f7019f81a03c2 |
| nikon-z-mc-105f28-f8-best-photopic | 3239fe69619fbf39c2ceadd16a180cfd411bacb8f076a49d9d3eed449eb87e7b |
| nikon-z-135f18-plena-best-ref | ecf6d1df4e79a7b3fd94b55822542023ceae396b307bc6b6a55cb1dc0ff24cf9 |
| nikon-z-135f18-plena-best-photopic | 3dea04cb1d5f72c01368ee35c83d37fb993b412a0e3810bc61891172be599297 |
| nikon-z-135f18-plena-f8-ref | c2318d538a784c5ec070fc31ac10b4dfcb0d64744f784760c11124e9bc61b371 |
| nikon-z-135f18-plena-f8-photopic | 09a66de0b38248a185a941cb3b8a194df9e8ba1037a5e1da82a4c869f55ab6af |
| nikon-z-135f18-plena-f8-best-ref | 99f3a1e02611f619f54733f2d6db59a720b170b77cf55c282ce050386f153a72 |
| nikon-z-135f18-plena-f8-best-photopic | b76bdcfea59510911fe8caaec568909f077df90a008cd8cba1b9e2574f9cbada |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 04595615c306969731e362b49ac82b2debaf9a1030bab29de8a5b6357ef43fa2 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 9939f2aacfa472a85b96d54fb7a06cb3c296fcc8d36a81d0569244885ea8672b |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 54a6b4fd4493aa1cc466027ab57b9edc61cfd31e57c8f5ad89b66a55baf684e1 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | ad771ed160d2a9cf74878737b195f2eed26c222b29933be25e748eff74c626b7 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1c0b103789ba44369ba3dff3a1d8a9776422c96a9dac30ae1eaffc6346cd327a |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | bec35fe3ac9cf33f43e39cd4db57188b197f9a75ae9e2842ca3a6432dffc9022 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 96 | 96 | lv – optiland | 96 PASS | 96 PASS |
| r0 | system.describe | 96 | 96 | lv – ref | 96 PASS | 96 PASS |
| r0 | system.describe | 96 | 96 | optiland – ref | 96 PASS | 96 PASS |
| r1 | paraxial.first-order | 96 | 96 | lv – optiland | 96 PASS | 96 PASS |
| r1 | paraxial.first-order | 96 | 96 | lv – ref | 96 PASS | 96 PASS |
| r1 | paraxial.first-order | 96 | 96 | optiland – ref | 96 PASS | 96 PASS |
| r2 | rays.trace | 96 | 864 | lv – optiland | 96 PASS | 864 PASS |
| r2 | rays.trace | 96 | 864 | lv – ref | 96 PASS | 864 PASS |
| r2 | rays.trace | 96 | 864 | optiland – ref | 96 PASS | 864 PASS |
| r3 | rays.trace | 96 | 864 | lv – optiland | 96 PASS | 864 PASS |
| r3 | rays.trace | 96 | 864 | lv – ref | 96 PASS | 864 PASS |
| r3 | rays.trace | 96 | 864 | optiland – ref | 96 PASS | 864 PASS |
| r4 | rays.trace | 96 | 288 | lv – optiland | 96 PASS | 288 PASS |
| r4 | rays.trace | 96 | 288 | lv – ref | 96 PASS | 288 PASS |
| r4 | rays.trace | 96 | 288 | optiland – ref | 96 PASS | 288 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 96 ok |
| r0 | optiland | 96 ok |
| r0 | ref | 96 ok |
| r1 | lv | 96 ok |
| r1 | optiland | 96 ok |
| r1 | ref | 96 ok |
| r2 | lv | 96 ok |
| r2 | optiland | 96 ok |
| r2 | ref | 96 ok |
| r3 | lv | 96 ok |
| r3 | optiland | 96 ok |
| r3 | ref | 96 ok |
| r4 | lv | 96 ok |
| r4 | optiland | 96 ok |
| r4 | ref | 96 ok |

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
| canon-ef-135-f2l-usm-best-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-best-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| nikkor-z50f12-best-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-best-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f8-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f8-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f8-best-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f8-best-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-best-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-best-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-best-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-best-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-mc-105f28-best-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-best-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-best-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | firstOrder.maxAbs (≤ 1.00e-9 mm) | 3.87e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity frontFocalZ |
| lv – optiland | pupilZ.maxScaled (≤ 1.00e-9 mm) | 7.96e-13 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilZ |
| lv – optiland | pupilZ.maxAbs [mm] | 7.96e-13 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilZ |
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 7.11e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 7.11e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.05e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 3.91e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 1, quantity exitPupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 3.91e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 1, quantity exitPupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 3.87e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 4.97e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 4.97e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |

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
| sony-fe-400mm-f28-gm-oss-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
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
| canon-ef-135-f2l-usm-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f8-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: pupilZ.maxScaled 8.53e-14 mm |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | PASS: pupilZ.maxScaled 7.11e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikkor-z50f12-best-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f8-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f8-best-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 1.95e-14 mm |
| sony-fe-20mm-f18-g-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f8-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 1.95e-14 mm |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 1.78e-14 mm |
| nikon-z-24-70f4s-wide-best-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-tele-best-ref | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-best-photopic | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-tele-f8-ref | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-mc-105f28-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-best-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f8-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-135f18-plena-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-best-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f8-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 4.62e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 1.17e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 1, ray 1023, surface 20 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 3.82e-14 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 3, ray 132 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 1.04e-12 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 3, ray 132 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 611140 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.19e-12 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1, line 1, ray 552, surface 10 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 2.06e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 2, ray 88 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 8.96e-13 | sony-fe-20mm-f18-g-best-photopic | field 4.75e1, line 2, ray 88 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 611140 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.20e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 0, ray 977, surface 20 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 4.67e-14 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 3, ray 132 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.25e-12 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 3, ray 132 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 611140 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: landing.maxDistance 1.49e-13 mm | PASS: landing.maxDistance 1.11e-13 mm | PASS: landing.maxDistance 1.56e-13 mm | 1667 / 1438 / 0 | 1667 / 1438 / 0 | 1667 / 1438 / 0 |
| canon-ef-135-f2l-usm-photopic | 15 | PASS: landing.maxDistance 1.75e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | PASS: landing.maxDistance 1.82e-13 mm | 8379 / 7146 / 0 | 8379 / 7146 / 0 | 8379 / 7146 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 6.78e-14 mm | PASS: landing.maxDistance 9.96e-14 mm | 2043 / 1272 / 0 | 2043 / 1272 / 0 | 2043 / 1272 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | PASS: landing.maxDistance 1.03e-13 mm | PASS: landing.maxDistance 8.17e-14 mm | PASS: landing.maxDistance 1.17e-13 mm | 10239 / 6336 / 0 | 10239 / 6336 / 0 | 10239 / 6336 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: landing.maxDistance 1.98e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 1721 / 1452 / 0 | 1721 / 1452 / 0 | 1721 / 1452 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | PASS: landing.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: landing.maxDistance 1.25e-12 mm | 8591 / 7274 / 0 | 8591 / 7274 / 0 | 8591 / 7274 / 0 |
| nikkor-z50f12-ref | 3 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 1661 / 1444 / 0 | 1661 / 1444 / 0 | 1661 / 1444 / 0 |
| nikkor-z50f12-photopic | 15 | PASS: hits.maxDistance 1.11e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 8341 / 7184 / 0 | 8341 / 7184 / 0 | 8341 / 7184 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2301 / 1338 / 0 | 2301 / 1338 / 0 | 2301 / 1338 / 0 |
| sony-fe-20mm-f18-g-photopic | 15 | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | 11517 / 6678 / 0 | 11517 / 6678 / 0 | 11517 / 6678 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: landing.maxDistance 3.55e-13 mm | PASS: landing.maxDistance 2.29e-13 mm | PASS: landing.maxDistance 3.88e-13 mm | 1885 / 1440 / 0 | 1885 / 1440 / 0 | 1885 / 1440 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | PASS: landing.maxDistance 5.18e-13 mm | PASS: landing.maxDistance 3.06e-13 mm | PASS: landing.maxDistance 5.17e-13 mm | 9471 / 7154 / 0 | 9471 / 7154 / 0 | 9471 / 7154 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: landing.maxDistance 2.06e-13 mm | PASS: landing.maxDistance 1.32e-13 mm | PASS: landing.maxDistance 2.03e-13 mm | 1901 / 1414 / 0 | 1901 / 1414 / 0 | 1901 / 1414 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | PASS: landing.maxDistance 1.99e-13 mm | PASS: landing.maxDistance 1.63e-13 mm | PASS: landing.maxDistance 2.47e-13 mm | 9487 / 7088 / 0 | 9487 / 7088 / 0 | 9487 / 7088 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | 2215 / 1280 / 0 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-wide-photopic | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 11061 / 6774 / 0 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.70e-13 mm | 1929 / 1242 / 0 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-tele-photopic | 15 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 9631 / 6224 / 0 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-mc-105f28-ref | 3 | PASS: landing.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 9.16e-13 mm | PASS: hits.maxDistance 9.18e-13 mm | 1751 / 1278 / 0 | 1751 / 1278 / 0 | 1751 / 1278 / 0 |
| nikon-z-mc-105f28-photopic | 15 | PASS: landing.maxDistance 1.64e-13 mm | PASS: hits.maxDistance 9.45e-13 mm | PASS: hits.maxDistance 9.17e-13 mm | 8755 / 6390 / 0 | 8755 / 6390 / 0 | 8755 / 6390 / 0 |
| nikon-z-135f18-plena-ref | 3 | PASS: landing.maxDistance 1.99e-13 mm | PASS: hits.maxDistance 9.24e-13 mm | PASS: hits.maxDistance 9.30e-13 mm | 2005 / 1454 / 0 | 2005 / 1454 / 0 | 2005 / 1454 / 0 |
| nikon-z-135f18-plena-photopic | 15 | PASS: landing.maxDistance 1.96e-13 mm | PASS: hits.maxDistance 9.76e-13 mm | PASS: hits.maxDistance 9.75e-13 mm | 10021 / 6914 / 0 | 10021 / 6914 / 0 | 10021 / 6914 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: hits.maxDistance 9.14e-13 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 1839 / 1332 / 0 | 1839 / 1332 / 0 | 1839 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | PASS: hits.maxDistance 9.18e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 9185 / 6670 / 0 | 9185 / 6670 / 0 | 9185 / 6670 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: landing.maxDistance 1.49e-13 mm | PASS: landing.maxDistance 1.13e-13 mm | PASS: landing.maxDistance 1.56e-13 mm | 1667 / 1438 / 0 | 1667 / 1438 / 0 | 1667 / 1438 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 15 | PASS: landing.maxDistance 1.75e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | PASS: landing.maxDistance 1.85e-13 mm | 8379 / 7146 / 0 | 8379 / 7146 / 0 | 8379 / 7146 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: hits.maxDistance 1.18e-13 mm | PASS: landing.maxDistance 8.21e-14 mm | PASS: landing.maxDistance 1.32e-13 mm | 2465 / 1426 / 0 | 2465 / 1426 / 0 | 2465 / 1426 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 15 | PASS: hits.maxDistance 1.31e-13 mm | PASS: hits.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 1.36e-13 mm | 12323 / 7132 / 0 | 12323 / 7132 / 0 | 12323 / 7132 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: hits.maxDistance 1.18e-13 mm | PASS: landing.maxDistance 8.21e-14 mm | PASS: landing.maxDistance 1.32e-13 mm | 2465 / 1426 / 0 | 2465 / 1426 / 0 | 2465 / 1426 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | PASS: hits.maxDistance 1.31e-13 mm | PASS: hits.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 1.36e-13 mm | 12323 / 7132 / 0 | 12323 / 7132 / 0 | 12323 / 7132 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 6.78e-14 mm | PASS: landing.maxDistance 9.96e-14 mm | 2043 / 1272 / 0 | 2043 / 1272 / 0 | 2043 / 1272 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | PASS: landing.maxDistance 1.03e-13 mm | PASS: landing.maxDistance 7.82e-14 mm | PASS: landing.maxDistance 1.17e-13 mm | 10239 / 6336 / 0 | 10239 / 6336 / 0 | 10239 / 6336 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 7.48e-14 mm | PASS: landing.maxDistance 1.04e-13 mm | 2429 / 1462 / 0 | 2429 / 1462 / 0 | 2429 / 1462 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 8.17e-14 mm | PASS: landing.maxDistance 1.24e-13 mm | 12151 / 7304 / 0 | 12151 / 7304 / 0 | 12151 / 7304 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 7.48e-14 mm | PASS: landing.maxDistance 1.07e-13 mm | 2429 / 1462 / 0 | 2429 / 1462 / 0 | 2429 / 1462 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 8.17e-14 mm | PASS: landing.maxDistance 1.24e-13 mm | 12151 / 7304 / 0 | 12151 / 7304 / 0 | 12151 / 7304 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: landing.maxDistance 1.96e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 1721 / 1452 / 0 | 1721 / 1452 / 0 | 1721 / 1452 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | PASS: landing.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: landing.maxDistance 1.25e-12 mm | 8591 / 7274 / 0 | 8591 / 7274 / 0 | 8591 / 7274 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 9.57e-13 mm | PASS: hits.maxDistance 9.67e-13 mm | 2157 / 1414 / 0 | 2157 / 1414 / 0 | 2157 / 1414 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | PASS: hits.maxDistance 1.31e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 10833 / 7022 / 0 | 10833 / 7022 / 0 | 10833 / 7022 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 9.57e-13 mm | PASS: hits.maxDistance 9.67e-13 mm | 2157 / 1414 / 0 | 2157 / 1414 / 0 | 2157 / 1414 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | PASS: hits.maxDistance 1.31e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 10833 / 7022 / 0 | 10833 / 7022 / 0 | 10833 / 7022 / 0 |
| nikkor-z50f12-best-ref | 3 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 1661 / 1444 / 0 | 1661 / 1444 / 0 | 1661 / 1444 / 0 |
| nikkor-z50f12-best-photopic | 15 | PASS: hits.maxDistance 1.11e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 8341 / 7184 / 0 | 8341 / 7184 / 0 | 8341 / 7184 / 0 |
| nikkor-z50f12-f8-ref | 3 | PASS: hits.maxDistance 8.24e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2455 / 1436 / 0 | 2455 / 1436 / 0 | 2455 / 1436 / 0 |
| nikkor-z50f12-f8-photopic | 15 | PASS: hits.maxDistance 8.24e-13 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 12283 / 7172 / 0 | 12283 / 7172 / 0 | 12283 / 7172 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: hits.maxDistance 8.24e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2455 / 1436 / 0 | 2455 / 1436 / 0 | 2455 / 1436 / 0 |
| nikkor-z50f12-f8-best-photopic | 15 | PASS: hits.maxDistance 8.24e-13 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 12283 / 7172 / 0 | 12283 / 7172 / 0 | 12283 / 7172 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2301 / 1338 / 0 | 2301 / 1338 / 0 | 2301 / 1338 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 15 | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | 11517 / 6678 / 0 | 11517 / 6678 / 0 | 11517 / 6678 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: landing.maxDistance 1.63e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2253 / 1414 / 0 | 2253 / 1414 / 0 | 2253 / 1414 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 15 | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 11219 / 7116 / 0 | 11219 / 7116 / 0 | 11219 / 7116 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: landing.maxDistance 1.63e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2253 / 1414 / 0 | 2253 / 1414 / 0 | 2253 / 1414 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 11219 / 7116 / 0 | 11219 / 7116 / 0 | 11219 / 7116 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: landing.maxDistance 3.58e-13 mm | PASS: landing.maxDistance 2.29e-13 mm | PASS: landing.maxDistance 3.92e-13 mm | 1885 / 1440 / 0 | 1885 / 1440 / 0 | 1885 / 1440 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | PASS: landing.maxDistance 5.15e-13 mm | PASS: landing.maxDistance 3.06e-13 mm | PASS: landing.maxDistance 5.16e-13 mm | 9471 / 7154 / 0 | 9471 / 7154 / 0 | 9471 / 7154 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: landing.maxDistance 2.88e-13 mm | PASS: landing.maxDistance 2.51e-13 mm | PASS: landing.maxDistance 3.16e-13 mm | 2417 / 1402 / 0 | 2417 / 1402 / 0 | 2417 / 1402 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | PASS: landing.maxDistance 3.27e-13 mm | PASS: landing.maxDistance 2.59e-13 mm | PASS: landing.maxDistance 3.78e-13 mm | 12077 / 7018 / 0 | 12077 / 7018 / 0 | 12077 / 7018 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: landing.maxDistance 2.84e-13 mm | PASS: landing.maxDistance 2.51e-13 mm | PASS: landing.maxDistance 3.19e-13 mm | 2417 / 1402 / 0 | 2417 / 1402 / 0 | 2417 / 1402 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | PASS: landing.maxDistance 3.27e-13 mm | PASS: landing.maxDistance 2.56e-13 mm | PASS: landing.maxDistance 3.78e-13 mm | 12077 / 7018 / 0 | 12077 / 7018 / 0 | 12077 / 7018 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: landing.maxDistance 2.03e-13 mm | PASS: landing.maxDistance 1.32e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 1901 / 1414 / 0 | 1901 / 1414 / 0 | 1901 / 1414 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | PASS: landing.maxDistance 1.99e-13 mm | PASS: landing.maxDistance 1.67e-13 mm | PASS: landing.maxDistance 2.47e-13 mm | 9487 / 7088 / 0 | 9487 / 7088 / 0 | 9487 / 7088 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: landing.maxDistance 2.10e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | PASS: landing.maxDistance 2.46e-13 mm | 2271 / 1332 / 0 | 2271 / 1332 / 0 | 2271 / 1332 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | PASS: landing.maxDistance 1.92e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | PASS: landing.maxDistance 2.42e-13 mm | 11387 / 6628 / 0 | 11387 / 6628 / 0 | 11387 / 6628 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: landing.maxDistance 2.07e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | PASS: landing.maxDistance 2.46e-13 mm | 2271 / 1332 / 0 | 2271 / 1332 / 0 | 2271 / 1332 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | PASS: landing.maxDistance 1.92e-13 mm | PASS: landing.maxDistance 1.49e-13 mm | PASS: landing.maxDistance 2.42e-13 mm | 11387 / 6628 / 0 | 11387 / 6628 / 0 | 11387 / 6628 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | 2215 / 1280 / 0 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 11061 / 6774 / 0 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: hits.maxDistance 1.08e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2117 / 1398 / 0 | 2117 / 1398 / 0 | 2117 / 1398 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | PASS: hits.maxDistance 9.35e-13 mm | PASS: hits.maxDistance 1.19e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 10565 / 7010 / 0 | 10565 / 7010 / 0 | 10565 / 7010 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: hits.maxDistance 1.08e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2117 / 1398 / 0 | 2117 / 1398 / 0 | 2117 / 1398 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | PASS: hits.maxDistance 9.35e-13 mm | PASS: hits.maxDistance 1.19e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 10565 / 7010 / 0 | 10565 / 7010 / 0 | 10565 / 7010 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.70e-13 mm | 1929 / 1242 / 0 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 15 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 9631 / 6224 / 0 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | 2391 / 1428 / 0 | 2391 / 1428 / 0 | 2391 / 1428 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | PASS: landing.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11921 / 7174 / 0 | 11921 / 7174 / 0 | 11921 / 7174 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | 2391 / 1428 / 0 | 2391 / 1428 / 0 | 2391 / 1428 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | PASS: landing.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11921 / 7174 / 0 | 11921 / 7174 / 0 | 11921 / 7174 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: landing.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 9.16e-13 mm | PASS: hits.maxDistance 9.18e-13 mm | 1751 / 1278 / 0 | 1751 / 1278 / 0 | 1751 / 1278 / 0 |
| nikon-z-mc-105f28-best-photopic | 15 | PASS: landing.maxDistance 1.61e-13 mm | PASS: hits.maxDistance 9.45e-13 mm | PASS: hits.maxDistance 9.17e-13 mm | 8755 / 6390 / 0 | 8755 / 6390 / 0 | 8755 / 6390 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: hits.maxDistance 1.41e-13 mm | PASS: landing.maxDistance 1.17e-13 mm | PASS: hits.maxDistance 1.37e-13 mm | 2311 / 1436 / 0 | 2311 / 1436 / 0 | 2311 / 1436 / 0 |
| nikon-z-mc-105f28-f8-photopic | 15 | PASS: hits.maxDistance 1.71e-13 mm | PASS: landing.maxDistance 1.49e-13 mm | PASS: hits.maxDistance 1.71e-13 mm | 11559 / 7176 / 0 | 11559 / 7176 / 0 | 11559 / 7176 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: hits.maxDistance 1.41e-13 mm | PASS: landing.maxDistance 1.17e-13 mm | PASS: landing.maxDistance 1.39e-13 mm | 2311 / 1436 / 0 | 2311 / 1436 / 0 | 2311 / 1436 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 15 | PASS: hits.maxDistance 1.71e-13 mm | PASS: landing.maxDistance 1.49e-13 mm | PASS: hits.maxDistance 1.71e-13 mm | 11559 / 7176 / 0 | 11559 / 7176 / 0 | 11559 / 7176 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: landing.maxDistance 1.99e-13 mm | PASS: hits.maxDistance 9.24e-13 mm | PASS: hits.maxDistance 9.30e-13 mm | 2005 / 1454 / 0 | 2005 / 1454 / 0 | 2005 / 1454 / 0 |
| nikon-z-135f18-plena-best-photopic | 15 | PASS: landing.maxDistance 1.99e-13 mm | PASS: hits.maxDistance 9.76e-13 mm | PASS: hits.maxDistance 9.75e-13 mm | 10021 / 6914 / 0 | 10021 / 6914 / 0 | 10021 / 6914 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikon-z-135f18-plena-f8-photopic | 15 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12275 / 7180 / 0 | 12275 / 7180 / 0 | 12275 / 7180 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 15 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12275 / 7180 / 0 | 12275 / 7180 / 0 | 12275 / 7180 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: hits.maxDistance 9.14e-13 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 1839 / 1332 / 0 | 1839 / 1332 / 0 | 1839 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | PASS: hits.maxDistance 9.18e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 9185 / 6670 / 0 | 9185 / 6670 / 0 | 9185 / 6670 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: landing.maxDistance 7.46e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2287 / 1316 / 0 | 2287 / 1316 / 0 | 2287 / 1316 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | PASS: landing.maxDistance 8.53e-14 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 11375 / 6640 / 0 | 11375 / 6640 / 0 | 11375 / 6640 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: landing.maxDistance 7.46e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2287 / 1316 / 0 | 2287 / 1316 / 0 | 2287 / 1316 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | PASS: landing.maxDistance 8.53e-14 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 11375 / 6640 / 0 | 11375 / 6640 / 0 | 11375 / 6640 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.78e-9 | nikkor-z50f12-photopic | field 1.19e1, line 1, ray 168 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.78e-9 | nikkor-z50f12-photopic | field 1.19e1, line 1, ray 168 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.78e-9 | nikkor-z50f12-photopic | field 1.19e1, line 1, ray 168 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.67e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 2, ray 458 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.67e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 2, ray 458 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.66e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1, line 1, ray 648 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.67e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 2, ray 436 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.67e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 2, ray 436 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.54e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1, line 1, ray 648 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-photopic | 15 | PASS: opd.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 3.58e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | PASS: opticalPathToImage.maxAbs 3.02e-10 waves | PASS: opticalPath.maxAbs 2.05e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | PASS: opd.maxAbs 5.57e-10 waves | PASS: opd.maxAbs 1.50e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves |
| nikkor-z50f12-ref | 3 | PASS: opticalPath.maxAbs 2.03e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| nikkor-z50f12-photopic | 15 | PASS: opticalPath.maxAbs 2.78e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| sony-fe-20mm-f18-g-ref | 3 | PASS: opd.maxAbs 1.60e-9 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves | PASS: opticalPathToImage.maxAbs 1.55e-9 waves |
| sony-fe-20mm-f18-g-photopic | 15 | PASS: opd.maxAbs 1.36e-9 waves | PASS: opticalPathToImage.maxAbs 1.94e-9 waves | PASS: opticalPathToImage.maxAbs 2.12e-9 waves |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.35e-9 waves | PASS: opticalPathToImage.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.64e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | PASS: opd.maxAbs 6.05e-10 waves | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 5.02e-10 waves |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 2.32e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikon-z-24-70f4s-wide-photopic | 15 | PASS: opd.maxAbs 2.06e-9 waves | PASS: opd.maxAbs 2.62e-9 waves | PASS: opd.maxAbs 2.51e-9 waves |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.98e-9 waves | PASS: opticalPath.maxAbs 1.84e-9 waves |
| nikon-z-24-70f4s-tele-photopic | 15 | PASS: opd.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves | PASS: opd.maxAbs 2.12e-9 waves |
| nikon-z-mc-105f28-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 8.22e-10 waves | PASS: opd.maxAbs 8.71e-10 waves |
| nikon-z-mc-105f28-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 1.39e-9 waves | PASS: opd.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-ref | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opd.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 1.06e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | PASS: opd.maxAbs 2.27e-9 waves | PASS: opd.maxAbs 1.78e-9 waves | PASS: opd.maxAbs 2.24e-9 waves |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-best-photopic | 15 | PASS: opd.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 3.63e-10 waves |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f8-photopic | 15 | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 3.07e-10 waves |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | PASS: opd.maxAbs 4.23e-10 waves | PASS: opticalPath.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.07e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | PASS: opd.maxAbs 2.62e-10 waves | PASS: opticalPath.maxAbs 2.05e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opd.maxAbs 2.33e-10 waves | PASS: opd.maxAbs 2.56e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: opd.maxAbs 2.42e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | PASS: opd.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 2.56e-10 waves |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | PASS: opd.maxAbs 5.57e-10 waves | PASS: opd.maxAbs 1.56e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | PASS: opd.maxAbs 4.61e-10 waves | PASS: opd.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | PASS: opd.maxAbs 4.10e-10 waves | PASS: opd.maxAbs 1.34e-9 waves | PASS: opticalPathToImage.maxAbs 1.27e-9 waves |
| nikkor-z50f12-best-ref | 3 | PASS: opticalPath.maxAbs 2.03e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| nikkor-z50f12-best-photopic | 15 | PASS: opticalPath.maxAbs 2.78e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| nikkor-z50f12-f8-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-photopic | 15 | PASS: opticalPath.maxAbs 1.00e-9 waves | PASS: opd.maxAbs 2.30e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikkor-z50f12-f8-best-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 1.00e-9 waves | PASS: opd.maxAbs 2.30e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: opd.maxAbs 1.60e-9 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.55e-9 waves |
| sony-fe-20mm-f18-g-best-photopic | 15 | PASS: opd.maxAbs 1.36e-9 waves | PASS: opticalPathToImage.maxAbs 1.94e-9 waves | PASS: opticalPathToImage.maxAbs 2.06e-9 waves |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves | PASS: opticalPathToImage.maxAbs 1.79e-9 waves |
| sony-fe-20mm-f18-g-f8-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.78e-9 waves | PASS: opticalPathToImage.maxAbs 2.18e-9 waves | PASS: opticalPathToImage.maxAbs 2.30e-9 waves |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves | PASS: opticalPathToImage.maxAbs 1.79e-9 waves |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.78e-9 waves | PASS: opticalPathToImage.maxAbs 2.12e-9 waves | PASS: opticalPathToImage.maxAbs 2.24e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.35e-9 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.64e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: opd.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | PASS: opd.maxAbs 1.56e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.34e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | PASS: opd.maxAbs 1.78e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.56e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | PASS: opd.maxAbs 6.65e-10 waves | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 4.46e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | PASS: opd.maxAbs 5.02e-10 waves | PASS: opd.maxAbs 5.44e-10 waves | PASS: opticalPath.maxAbs 4.23e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 5.32e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | PASS: opd.maxAbs 5.02e-10 waves | PASS: opd.maxAbs 5.44e-10 waves | PASS: opticalPath.maxAbs 4.23e-10 waves |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 2.32e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikon-z-24-70f4s-wide-best-photopic | 15 | PASS: opd.maxAbs 2.06e-9 waves | PASS: opd.maxAbs 2.62e-9 waves | PASS: opd.maxAbs 2.51e-9 waves |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: opticalPath.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: opticalPath.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.98e-9 waves | PASS: opticalPath.maxAbs 1.84e-9 waves |
| nikon-z-24-70f4s-tele-best-photopic | 15 | PASS: opd.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves | PASS: opd.maxAbs 2.12e-9 waves |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.31e-9 waves |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 1.75e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.31e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 1.75e-9 waves |
| nikon-z-mc-105f28-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 8.22e-10 waves | PASS: opd.maxAbs 8.71e-10 waves |
| nikon-z-mc-105f28-best-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 1.39e-9 waves | PASS: opd.maxAbs 1.39e-9 waves |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 4.35e-10 waves |
| nikon-z-mc-105f28-f8-photopic | 15 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 5.02e-10 waves |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| nikon-z-mc-105f28-f8-best-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 5.57e-10 waves |
| nikon-z-135f18-plena-best-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-best-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opd.maxAbs 1.33e-9 waves | PASS: opticalPathToImage.maxAbs 1.11e-9 waves |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f8-photopic | 15 | PASS: opd.maxAbs 7.80e-10 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f8-best-photopic | 15 | PASS: opd.maxAbs 7.80e-10 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | PASS: opd.maxAbs 2.27e-9 waves | PASS: opd.maxAbs 1.81e-9 waves | PASS: opd.maxAbs 2.24e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: opd.maxAbs 2.18e-10 waves | PASS: opticalPath.maxAbs 1.28e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | PASS: opd.maxAbs 2.23e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: opd.maxAbs 2.18e-10 waves | PASS: opticalPath.maxAbs 1.28e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | PASS: opd.maxAbs 2.23e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.08e-11 | sigma-45mm-f28-dg-dn-contemporary-ref | cut tangential, field 2.56e1, frequencyPerMm 74 |
| lv – optiland | rays.compared [rays] | 611140 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.14e-11 | nikon-z-24-70f4s-wide-f8-best-ref | cut tangential, field 2.42e1, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 611140 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.17e-11 | nikon-z-24-70f4s-wide-ref | cut sagittal, field 4.33e1, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 611140 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: mtf.maxAbs 8.55e-13 | PASS: mtf.maxAbs 2.21e-12 | PASS: mtf.maxAbs 2.39e-12 |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: mtf.maxAbs 6.36e-13 | PASS: mtf.maxAbs 4.99e-13 | PASS: mtf.maxAbs 7.54e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: mtf.maxAbs 1.35e-12 | PASS: mtf.maxAbs 6.74e-13 | PASS: mtf.maxAbs 1.37e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: mtf.maxAbs 3.11e-13 | PASS: mtf.maxAbs 5.57e-13 | PASS: mtf.maxAbs 8.38e-13 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: mtf.maxAbs 1.84e-12 | PASS: mtf.maxAbs 5.28e-12 | PASS: mtf.maxAbs 5.29e-12 |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: mtf.maxAbs 1.78e-12 | PASS: mtf.maxAbs 2.92e-12 | PASS: mtf.maxAbs 2.39e-12 |
| nikkor-z50f12-ref | 3 | PASS: mtf.maxAbs 4.73e-12 | PASS: mtf.maxAbs 2.12e-12 | PASS: mtf.maxAbs 4.24e-12 |
| nikkor-z50f12-photopic | 3 | PASS: mtf.maxAbs 3.81e-12 | PASS: mtf.maxAbs 4.58e-12 | PASS: mtf.maxAbs 3.22e-12 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: mtf.maxAbs 2.33e-12 | PASS: mtf.maxAbs 3.25e-12 | PASS: mtf.maxAbs 2.68e-12 |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: mtf.maxAbs 8.21e-13 | PASS: mtf.maxAbs 2.57e-12 | PASS: mtf.maxAbs 2.70e-12 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: mtf.maxAbs 7.02e-12 | PASS: mtf.maxAbs 3.15e-12 | PASS: mtf.maxAbs 5.60e-12 |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: mtf.maxAbs 2.93e-12 | PASS: mtf.maxAbs 3.71e-12 | PASS: mtf.maxAbs 6.54e-12 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: mtf.maxAbs 1.24e-12 | PASS: mtf.maxAbs 2.27e-12 | PASS: mtf.maxAbs 3.51e-12 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: mtf.maxAbs 1.83e-12 | PASS: mtf.maxAbs 1.75e-12 | PASS: mtf.maxAbs 2.98e-12 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: mtf.maxAbs 8.82e-12 | PASS: mtf.maxAbs 1.12e-11 | PASS: mtf.maxAbs 1.17e-11 |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: mtf.maxAbs 3.40e-12 | PASS: mtf.maxAbs 7.25e-12 | PASS: mtf.maxAbs 7.20e-12 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: mtf.maxAbs 1.25e-12 | PASS: mtf.maxAbs 7.19e-12 | PASS: mtf.maxAbs 7.58e-12 |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: mtf.maxAbs 6.94e-13 | PASS: mtf.maxAbs 7.47e-12 | PASS: mtf.maxAbs 7.17e-12 |
| nikon-z-mc-105f28-ref | 3 | PASS: mtf.maxAbs 1.02e-12 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 1.45e-12 |
| nikon-z-mc-105f28-photopic | 3 | PASS: mtf.maxAbs 3.97e-13 | PASS: mtf.maxAbs 1.47e-12 | PASS: mtf.maxAbs 1.27e-12 |
| nikon-z-135f18-plena-ref | 3 | PASS: mtf.maxAbs 2.30e-12 | PASS: mtf.maxAbs 1.20e-12 | PASS: mtf.maxAbs 3.48e-12 |
| nikon-z-135f18-plena-photopic | 3 | PASS: mtf.maxAbs 1.33e-12 | PASS: mtf.maxAbs 1.03e-12 | PASS: mtf.maxAbs 2.25e-12 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: mtf.maxAbs 1.08e-11 | PASS: mtf.maxAbs 3.87e-12 | PASS: mtf.maxAbs 1.00e-11 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: mtf.maxAbs 5.84e-12 | PASS: mtf.maxAbs 3.07e-12 | PASS: mtf.maxAbs 6.50e-12 |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: mtf.maxAbs 7.73e-13 | PASS: mtf.maxAbs 2.28e-12 | PASS: mtf.maxAbs 2.48e-12 |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: mtf.maxAbs 9.21e-13 | PASS: mtf.maxAbs 1.09e-12 | PASS: mtf.maxAbs 8.71e-13 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: mtf.maxAbs 6.08e-13 | PASS: mtf.maxAbs 5.69e-13 | PASS: mtf.maxAbs 7.35e-13 |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: mtf.maxAbs 6.13e-13 | PASS: mtf.maxAbs 3.91e-13 | PASS: mtf.maxAbs 6.30e-13 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: mtf.maxAbs 6.76e-13 | PASS: mtf.maxAbs 5.53e-13 | PASS: mtf.maxAbs 7.41e-13 |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: mtf.maxAbs 7.91e-13 | PASS: mtf.maxAbs 4.90e-13 | PASS: mtf.maxAbs 7.44e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: mtf.maxAbs 6.44e-13 | PASS: mtf.maxAbs 6.01e-13 | PASS: mtf.maxAbs 8.04e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: mtf.maxAbs 5.47e-13 | PASS: mtf.maxAbs 4.51e-13 | PASS: mtf.maxAbs 8.00e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: mtf.maxAbs 4.37e-13 | PASS: mtf.maxAbs 1.04e-12 | PASS: mtf.maxAbs 6.04e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: mtf.maxAbs 6.10e-13 | PASS: mtf.maxAbs 3.30e-13 | PASS: mtf.maxAbs 7.31e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: mtf.maxAbs 3.65e-13 | PASS: mtf.maxAbs 1.09e-12 | PASS: mtf.maxAbs 8.39e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: mtf.maxAbs 3.97e-13 | PASS: mtf.maxAbs 3.06e-13 | PASS: mtf.maxAbs 5.37e-13 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: mtf.maxAbs 1.76e-12 | PASS: mtf.maxAbs 5.18e-12 | PASS: mtf.maxAbs 5.57e-12 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: mtf.maxAbs 1.63e-12 | PASS: mtf.maxAbs 3.16e-12 | PASS: mtf.maxAbs 3.41e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: mtf.maxAbs 8.61e-13 | PASS: mtf.maxAbs 4.61e-12 | PASS: mtf.maxAbs 3.75e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: mtf.maxAbs 3.45e-13 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 1.16e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: mtf.maxAbs 9.42e-13 | PASS: mtf.maxAbs 4.67e-12 | PASS: mtf.maxAbs 3.73e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: mtf.maxAbs 3.74e-13 | PASS: mtf.maxAbs 2.27e-12 | PASS: mtf.maxAbs 2.06e-12 |
| nikkor-z50f12-best-ref | 3 | PASS: mtf.maxAbs 9.07e-12 | PASS: mtf.maxAbs 4.24e-12 | PASS: mtf.maxAbs 1.05e-11 |
| nikkor-z50f12-best-photopic | 3 | PASS: mtf.maxAbs 3.56e-12 | PASS: mtf.maxAbs 1.07e-12 | PASS: mtf.maxAbs 4.63e-12 |
| nikkor-z50f12-f8-ref | 3 | PASS: mtf.maxAbs 1.15e-12 | PASS: mtf.maxAbs 1.77e-12 | PASS: mtf.maxAbs 2.92e-12 |
| nikkor-z50f12-f8-photopic | 3 | PASS: mtf.maxAbs 9.14e-13 | PASS: mtf.maxAbs 1.24e-12 | PASS: mtf.maxAbs 2.04e-12 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: mtf.maxAbs 1.13e-12 | PASS: mtf.maxAbs 1.79e-12 | PASS: mtf.maxAbs 2.91e-12 |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.06e-12 | PASS: mtf.maxAbs 1.47e-12 | PASS: mtf.maxAbs 2.22e-12 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: mtf.maxAbs 1.67e-12 | PASS: mtf.maxAbs 3.90e-12 | PASS: mtf.maxAbs 4.17e-12 |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: mtf.maxAbs 1.02e-12 | PASS: mtf.maxAbs 3.83e-12 | PASS: mtf.maxAbs 3.94e-12 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: mtf.maxAbs 1.16e-12 | PASS: mtf.maxAbs 2.50e-12 | PASS: mtf.maxAbs 3.04e-12 |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: mtf.maxAbs 7.83e-13 | PASS: mtf.maxAbs 2.61e-12 | PASS: mtf.maxAbs 2.48e-12 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 2.50e-12 | PASS: mtf.maxAbs 3.03e-12 |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: mtf.maxAbs 8.09e-13 | PASS: mtf.maxAbs 2.81e-12 | PASS: mtf.maxAbs 2.70e-12 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: mtf.maxAbs 2.24e-12 | PASS: mtf.maxAbs 3.19e-12 | PASS: mtf.maxAbs 4.29e-12 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: mtf.maxAbs 1.06e-12 | PASS: mtf.maxAbs 8.71e-13 | PASS: mtf.maxAbs 1.70e-12 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: mtf.maxAbs 2.42e-12 | PASS: mtf.maxAbs 2.98e-12 | PASS: mtf.maxAbs 5.41e-12 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: mtf.maxAbs 2.41e-12 | PASS: mtf.maxAbs 2.38e-12 | PASS: mtf.maxAbs 4.19e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: mtf.maxAbs 5.55e-13 | PASS: mtf.maxAbs 7.52e-13 | PASS: mtf.maxAbs 1.31e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.90e-12 | PASS: mtf.maxAbs 6.85e-13 | PASS: mtf.maxAbs 1.22e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: mtf.maxAbs 1.51e-12 | PASS: mtf.maxAbs 2.82e-12 | PASS: mtf.maxAbs 4.33e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: mtf.maxAbs 1.10e-12 | PASS: mtf.maxAbs 2.31e-12 | PASS: mtf.maxAbs 3.03e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: mtf.maxAbs 2.08e-12 | PASS: mtf.maxAbs 2.92e-12 | PASS: mtf.maxAbs 2.11e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: mtf.maxAbs 1.19e-12 | PASS: mtf.maxAbs 1.52e-12 | PASS: mtf.maxAbs 2.42e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: mtf.maxAbs 2.06e-12 | PASS: mtf.maxAbs 2.96e-12 | PASS: mtf.maxAbs 2.10e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.26e-12 | PASS: mtf.maxAbs 1.53e-12 | PASS: mtf.maxAbs 2.54e-12 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: mtf.maxAbs 8.84e-12 | PASS: mtf.maxAbs 1.13e-11 | PASS: mtf.maxAbs 1.14e-11 |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: mtf.maxAbs 3.35e-12 | PASS: mtf.maxAbs 9.38e-12 | PASS: mtf.maxAbs 9.40e-12 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: mtf.maxAbs 1.34e-12 | PASS: mtf.maxAbs 6.29e-12 | PASS: mtf.maxAbs 6.24e-12 |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: mtf.maxAbs 1.69e-12 | PASS: mtf.maxAbs 3.87e-12 | PASS: mtf.maxAbs 4.03e-12 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: mtf.maxAbs 1.58e-12 | PASS: mtf.maxAbs 1.14e-11 | PASS: mtf.maxAbs 1.10e-11 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.77e-12 | PASS: mtf.maxAbs 4.28e-12 | PASS: mtf.maxAbs 4.40e-12 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: mtf.maxAbs 1.29e-12 | PASS: mtf.maxAbs 8.23e-12 | PASS: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: mtf.maxAbs 7.62e-13 | PASS: mtf.maxAbs 7.79e-12 | PASS: mtf.maxAbs 7.47e-12 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: mtf.maxAbs 2.59e-13 | PASS: mtf.maxAbs 6.99e-12 | PASS: mtf.maxAbs 7.25e-12 |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: mtf.maxAbs 5.38e-13 | PASS: mtf.maxAbs 7.94e-12 | PASS: mtf.maxAbs 7.45e-12 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: mtf.maxAbs 3.59e-13 | PASS: mtf.maxAbs 1.01e-11 | PASS: mtf.maxAbs 9.78e-12 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: mtf.maxAbs 4.20e-13 | PASS: mtf.maxAbs 3.07e-12 | PASS: mtf.maxAbs 3.25e-12 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: mtf.maxAbs 1.16e-12 | PASS: mtf.maxAbs 8.32e-13 | PASS: mtf.maxAbs 1.47e-12 |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: mtf.maxAbs 2.87e-13 | PASS: mtf.maxAbs 6.78e-13 | PASS: mtf.maxAbs 7.77e-13 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: mtf.maxAbs 4.45e-13 | PASS: mtf.maxAbs 8.56e-13 | PASS: mtf.maxAbs 1.11e-12 |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: mtf.maxAbs 2.84e-13 | PASS: mtf.maxAbs 3.31e-13 | PASS: mtf.maxAbs 5.44e-13 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: mtf.maxAbs 3.54e-13 | PASS: mtf.maxAbs 1.13e-12 | PASS: mtf.maxAbs 1.28e-12 |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: mtf.maxAbs 9.14e-13 | PASS: mtf.maxAbs 7.22e-13 | PASS: mtf.maxAbs 4.30e-13 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: mtf.maxAbs 1.02e-12 | PASS: mtf.maxAbs 1.61e-12 | PASS: mtf.maxAbs 2.53e-12 |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: mtf.maxAbs 1.82e-12 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 3.20e-12 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: mtf.maxAbs 4.19e-13 | PASS: mtf.maxAbs 4.41e-13 | PASS: mtf.maxAbs 8.42e-13 |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: mtf.maxAbs 7.40e-13 | PASS: mtf.maxAbs 5.92e-13 | PASS: mtf.maxAbs 1.33e-12 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: mtf.maxAbs 4.54e-13 | PASS: mtf.maxAbs 4.81e-13 | PASS: mtf.maxAbs 9.11e-13 |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: mtf.maxAbs 7.44e-13 | PASS: mtf.maxAbs 5.95e-13 | PASS: mtf.maxAbs 1.34e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: mtf.maxAbs 1.07e-11 | PASS: mtf.maxAbs 5.04e-12 | PASS: mtf.maxAbs 8.66e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: mtf.maxAbs 6.63e-12 | PASS: mtf.maxAbs 2.17e-12 | PASS: mtf.maxAbs 7.39e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: mtf.maxAbs 9.83e-13 | PASS: mtf.maxAbs 7.12e-12 | PASS: mtf.maxAbs 7.29e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: mtf.maxAbs 3.18e-13 | PASS: mtf.maxAbs 3.66e-12 | PASS: mtf.maxAbs 3.45e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: mtf.maxAbs 9.50e-13 | PASS: mtf.maxAbs 6.51e-12 | PASS: mtf.maxAbs 6.65e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: mtf.maxAbs 3.10e-13 | PASS: mtf.maxAbs 3.78e-12 | PASS: mtf.maxAbs 3.55e-12 |
