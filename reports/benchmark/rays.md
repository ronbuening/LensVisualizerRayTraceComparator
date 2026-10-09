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
| Baseline hash | ecf344915f8e29d914e1b82904d49cf0d66e37dc4af2f198b94755286f9b0823 |
| Contract version | 1.0 |
| Policy | rungs v8 |
| Policy hash | 5087f29f8584b921294cbf524c4b67e129af644887deae0551d52bff3f1ad72b |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | 26f4fdf03497bf33532d4ecb9a6a153103ad2691ae16df7d7fe33e39c433efba | commit 33ebdb30b619a02edcf03f6d930bc1ef5e4e6905, dirty false, engineFileCount 151 |
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
| canon-ef-135-f2l-usm-best-ref | 50e232445f61be20c6801cc35887ada30b19c5252831aea6641d18aa11d84663 |
| canon-ef-135-f2l-usm-best-photopic | b2a1d66580d42d8227500ff7b225b8f53a84411802602ebb8c9330859d9f1525 |
| canon-ef-135-f2l-usm-f8-ref | c552816b95a48901f0e89410185b726d86b0abf66c4b60f1a4a98b4f256e7267 |
| canon-ef-135-f2l-usm-f8-photopic | d52bd27357fd43a6764f4d120f0d31aa110c3cce9c9cd3e26190ef21afa902ec |
| canon-ef-135-f2l-usm-f8-best-ref | 8cd5390931d73b7a6d99e5a557aa1aa1bba01599229dbb73c696b6818e6cb8f5 |
| canon-ef-135-f2l-usm-f8-best-photopic | 351cbaad4887d72a4131a6f99974b92b696bf1ea87e0100c451195865390fec1 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3c954897aa675efdc86c930e563ecca1a8e726ee3281b9dd77c6baa143522276 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | d3307687ea35388704c406b0ca1cf760103ebe4d7a3b0779bb9af75d55906dea |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | c50337fdb2ecb3d72450827697c6871483937dc032a0012e41634f591537e3ed |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 77c67005ea22d6bfa6c3351ad14aedbf17af1657bb6e478df0c0357e32a64257 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 2608f266df11a9ae9cb47cc857bbcafc0fba8ddeacf324ce8ea6754ef2668e15 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | e3a2dd9fe7470ee5b67579bf89b18d70f8c639a6e401480de250714845655ea5 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 6a0cc42c71b24dadd62cbe06440cdaf970db1c61f7c4c6bf97540bf3d266264f |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 9b90308f0979f409d3b3138a5f5a2590f58075d71ff497a2717c482178f744c7 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | e3a24e94e1c4fe337caab5a6beeaa42ef02a49767c2b8ae29b5a55bb414f27fb |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | c02f75348993a1fba2b6d23710438c1fa77718427d67406bdc4bb9d026f0fcef |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | e15c60611ba2a78ac49ee90006e91754a730b423dac9b5f3aa92f909b4528b3e |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 79f2fa6f561fe97b48884ece1bbea77778c6075d2429d219b270912343cc7ec5 |
| nikkor-z50f12-best-ref | e790d749c64ab6eac18a5ff96b4d2de0548e1ed60da7384a18a63fb2f5f33d45 |
| nikkor-z50f12-best-photopic | 3ddf17afb79529c3c2ec222eae5c6b1b9f8009469d13b67cae977123aafa70ed |
| nikkor-z50f12-f8-ref | 9c35bae84f6a0f2db6df3b0473926141384733449289a56b3839b37db64c6b55 |
| nikkor-z50f12-f8-photopic | dbf8a669b212fb6abd79aca7e875db2ffc869d7fc851ddc7e161929a5bea539d |
| nikkor-z50f12-f8-best-ref | 17e6442e2b39491df15928ee660e98b50ffe7d7d982246fd57ff1cfddf20bf67 |
| nikkor-z50f12-f8-best-photopic | c761e2bc59e33dbc3d3fefc97b07d1154f07af8ba9ebee9743fc65046ef00b0e |
| sony-fe-20mm-f18-g-best-ref | 89f37e84d1e4d9f4e16c36d5973b94d4b983db493b18a076def977a4e59537a9 |
| sony-fe-20mm-f18-g-best-photopic | 3f078dc3e3aff951128b23bd16681a9d4689a195be7e1ddad4588bb19d835c7c |
| sony-fe-20mm-f18-g-f8-ref | 8d0044b21ba063321f4a204969c342dd0f174002e0c1662862503aecbfd7bf32 |
| sony-fe-20mm-f18-g-f8-photopic | 9e9712b3e72aa79c5987d303416789c152973ab2f2b11cc6cf0d0f219cf773f1 |
| sony-fe-20mm-f18-g-f8-best-ref | 75ef01af09757125daa4b5146fc584230dfb078248e795f39411c68e3a1e1f0a |
| sony-fe-20mm-f18-g-f8-best-photopic | 97457b2b18be6074fe3e2e7932aabeb1eb31d425ac2a2131a8f92bf1e1c062a3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 7350225d6be563c044a4bb9e3dc0b464e328b70c8c4667f3af5ecfc076e30e8d |
| sony-fe-400mm-f28-gm-oss-best-photopic | f8cd718dc53ab2076c10d40af57efdb8509c741ae86090593a4b5ca03859bc63 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 03e58f98588ef2f60c19a9486c7e043228f5a5697ea227b5993f1ba4e3a89bef |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 446e35145ed94622ec025bf78757ad33e36c7884d3e6f8dce52a60c3e67d30f3 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 09a8d508ec14bb38a4005edb411ac1336dba8cf583f87ccba3ad97daa310c01b |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 293df962b7449d49cef5c95f2fec2b07c2664d405ad61858bfd215a45372e635 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | a8ad26bbe87ee4917dc37a01e7309909e92fca549ec86f7056d34324bd91e836 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 28c4943781f869f59ef638a13bf4f28e00946a79c205892cec0ca9402f9f1228 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | f4dc97d07f8e2080632f674d26acc2506bdb5e42aafcf9c4722911da4de17114 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 88218e450e69650af0a8de10aa278e2e1181aca919a444a9309dad60070f7489 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 832d300fde3f0c78c717a1c32993aaac18d63e43d2b1e625affb1180584ac091 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | a2b3966b9cec10d8106715a915f0993a62a76fa36bfaac874f96a9b9dedfeedb |
| nikon-z-24-70f4s-wide-best-ref | aaa0271a6a43149d7ad8ec282a2ed5a7a0395c5a483d48a8589062c0c4b31c50 |
| nikon-z-24-70f4s-wide-best-photopic | 8c47123ea2a18494de5a3e3c20bbe59fda088efbcf4458720f14837286cf97fc |
| nikon-z-24-70f4s-wide-f8-ref | f75712de83ace455739d9e986f2243b0d31d2eb390f8a969e64c77dcea5d0208 |
| nikon-z-24-70f4s-wide-f8-photopic | 8a41bc027b1e261eee985a22f759b557b968ccd548b62fdb89017741361fb3c2 |
| nikon-z-24-70f4s-wide-f8-best-ref | 305dd4147ba55a479ea315271fb089494fddbb94f880c660591a214278905cb8 |
| nikon-z-24-70f4s-wide-f8-best-photopic | ee2e030dac1bdaac267ab343e5c05d89dd8224cca8616ea0e63cd3b6894fb2e0 |
| nikon-z-24-70f4s-tele-best-ref | a35e7c387aadd2a0f8476b1d7e87531d7d86cc63366f0cfaf705eb47ab16ba35 |
| nikon-z-24-70f4s-tele-best-photopic | 2497c76f581d5a99261156e38d24fff05534222ce9564afb293d31b8df2dd20e |
| nikon-z-24-70f4s-tele-f8-ref | 41f5d8aee996a616aba40c3d031bba0d5d25276dc5739d22c4516a839aaf1c7e |
| nikon-z-24-70f4s-tele-f8-photopic | a990bca2de759f2bf214d1d8b6e512237fbee2e78b8baa8bb28c865c7a0eb068 |
| nikon-z-24-70f4s-tele-f8-best-ref | cb8247c1351311dcf45d2d9961ac6483399a8f10ed9bac8f8b22e670e6a466f1 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 590c5f1432a18bd94f4b71220b8b251291b80997d8d529d1091d90234e04cb83 |
| nikon-z-mc-105f28-best-ref | 6b3aaa07a4702ccf191b148f16a5e4a86290711f7c3ada5a4a89530710dcbbf6 |
| nikon-z-mc-105f28-best-photopic | 64272e0b07e1578d676f1dd7e5c6914bae8139ba506472c8ae9147e1db03fb13 |
| nikon-z-mc-105f28-f8-ref | cf96e42059a21b2adb93ef98666f496dfb5a3358ff2549beb99dd2c68f2268e6 |
| nikon-z-mc-105f28-f8-photopic | 3ef20296ceaf97571e7f48d4adee73257fbca1c2cb007b19ab3f02cfad84480c |
| nikon-z-mc-105f28-f8-best-ref | 5cd7fefad139f1c586ef30094519250514b7ebc328511e05bddbca8b5673b2d3 |
| nikon-z-mc-105f28-f8-best-photopic | e200b3ae9e01665283d19c6b6585398e80d4cbce760aaced5a6e955e0e34c3a8 |
| nikon-z-135f18-plena-best-ref | 7d7aca25641963b5e55875c9ac5443787585bcc74677a318e43eb17148e4e438 |
| nikon-z-135f18-plena-best-photopic | 139792ea6abc5423ce45b6b12eed1860820576cd330a43fe4f1b2ff80fbec4d3 |
| nikon-z-135f18-plena-f8-ref | 226d4ad8c00ae751c0cc17b972ac7f81e680e70bac98c87ead370748648e08c6 |
| nikon-z-135f18-plena-f8-photopic | 9efa50e63fc4d547cd4134e7dd57356f0115bba58a5da7944aba9aa43183d732 |
| nikon-z-135f18-plena-f8-best-ref | c4b627c8b8ffeba95157788f23e2f0f18f771fc715a6877dad0cdc2d46ea3f23 |
| nikon-z-135f18-plena-f8-best-photopic | eb538244071b930f2fcf993f4f91e3d613b233ae8aead065376e2361753f7513 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3d2e9462c215a29b23d40840ee3dc8a8db740280ff8ea3b0ca5c6d75ad4cc3f1 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | b659eaea048609cfd97bdf5311f6bbfd97e5d432cffc99ddf888aaee9bb3cc66 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 99e3bfcf1d7471d36aa70dc052851991fd39c855025d7d536f26d9994a6b278c |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 09aa2a339f4924290f36617ac91320c19416e3bfcf7c9107780dabab4e64da0d |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 207876ed6157d71ad3f7497a5b6c0ddb60270e16a3de8f48360e59134ba52c76 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 6f2c9bdbb6eea372bc0eafa7498c712896bf49369b8d241fe086aa75bdcd2a98 |

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
| canon-ef-135-f2l-usm-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f8-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| nikkor-z50f12-best-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f8-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f8-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm |
| nikkor-z50f12-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 1.95e-14 mm |
| sony-fe-20mm-f18-g-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f8-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | PASS: firstOrder.maxAbs 1.82e-12 mm | PASS: firstOrder.maxAbs 1.59e-12 mm | PASS: firstOrder.maxAbs 1.82e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | PASS: firstOrder.maxAbs 1.82e-12 mm | PASS: firstOrder.maxAbs 1.59e-12 mm | PASS: firstOrder.maxAbs 1.82e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 1.82e-12 mm | PASS: firstOrder.maxAbs 1.59e-12 mm | PASS: firstOrder.maxAbs 1.82e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 1.78e-14 mm |
| nikon-z-24-70f4s-wide-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 1.78e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
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
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | PASS: firstOrder.maxAbs 2.49e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 4.62e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.49e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 4.62e-14 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 6.77e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164, surface 23 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 3.13e-10 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 9.12e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 611140 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 6.77e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164, surface 23 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 3.13e-10 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 9.12e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 611140 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.20e-12 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1, line 1, ray 567, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 2.07e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 2, ray 89 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 8.89e-13 | sony-fe-20mm-f18-g-ref | field 4.75e1, line 0, ray 88 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 611140 | — | — |

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
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: landing.maxDistance 1.28e-9 mm | PASS: landing.maxDistance 1.28e-9 mm | PASS: landing.maxDistance 1.67e-13 mm | 1667 / 1438 / 0 | 1667 / 1438 / 0 | 1667 / 1438 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 15 | PASS: hits.maxDistance 1.14e-9 mm | PASS: hits.maxDistance 1.14e-9 mm | PASS: landing.maxDistance 1.92e-13 mm | 8379 / 7146 / 0 | 8379 / 7146 / 0 | 8379 / 7146 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.34e-13 mm | 2465 / 1426 / 0 | 2465 / 1426 / 0 | 2465 / 1426 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 15 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: landing.maxDistance 1.31e-13 mm | 12323 / 7132 / 0 | 12323 / 7132 / 0 | 12323 / 7132 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.34e-13 mm | 2465 / 1426 / 0 | 2465 / 1426 / 0 | 2465 / 1426 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: landing.maxDistance 1.31e-13 mm | 12323 / 7132 / 0 | 12323 / 7132 / 0 | 12323 / 7132 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: hits.maxDistance 2.02e-9 mm | PASS: hits.maxDistance 2.02e-9 mm | PASS: landing.maxDistance 9.36e-14 mm | 2043 / 1272 / 0 | 2043 / 1272 / 0 | 2043 / 1272 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | PASS: hits.maxDistance 2.00e-9 mm | PASS: hits.maxDistance 2.00e-9 mm | PASS: landing.maxDistance 1.25e-13 mm | 10239 / 6336 / 0 | 10239 / 6336 / 0 | 10239 / 6336 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: hits.maxDistance 1.14e-9 mm | PASS: hits.maxDistance 1.14e-9 mm | PASS: landing.maxDistance 1.07e-13 mm | 2429 / 1462 / 0 | 2429 / 1462 / 0 | 2429 / 1462 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.16e-9 mm | PASS: landing.maxDistance 1.28e-13 mm | 12151 / 7304 / 0 | 12151 / 7304 / 0 | 12151 / 7304 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: hits.maxDistance 1.14e-9 mm | PASS: hits.maxDistance 1.14e-9 mm | PASS: landing.maxDistance 1.07e-13 mm | 2429 / 1462 / 0 | 2429 / 1462 / 0 | 2429 / 1462 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.16e-9 mm | PASS: landing.maxDistance 1.25e-13 mm | 12151 / 7304 / 0 | 12151 / 7304 / 0 | 12151 / 7304 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: landing.maxDistance 3.95e-9 mm | PASS: landing.maxDistance 3.95e-9 mm | PASS: hits.maxDistance 1.02e-12 mm | 1721 / 1452 / 0 | 1721 / 1452 / 0 | 1721 / 1452 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | PASS: landing.maxDistance 9.11e-9 mm | PASS: landing.maxDistance 9.11e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 8591 / 7274 / 0 | 8591 / 7274 / 0 | 8591 / 7274 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: hits.maxDistance 1.31e-9 mm | PASS: hits.maxDistance 1.31e-9 mm | PASS: hits.maxDistance 9.63e-13 mm | 2157 / 1414 / 0 | 2157 / 1414 / 0 | 2157 / 1414 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | PASS: hits.maxDistance 1.33e-9 mm | PASS: hits.maxDistance 1.33e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 10833 / 7022 / 0 | 10833 / 7022 / 0 | 10833 / 7022 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: hits.maxDistance 1.31e-9 mm | PASS: hits.maxDistance 1.31e-9 mm | PASS: hits.maxDistance 9.63e-13 mm | 2157 / 1414 / 0 | 2157 / 1414 / 0 | 2157 / 1414 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | PASS: hits.maxDistance 1.33e-9 mm | PASS: hits.maxDistance 1.33e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 10833 / 7022 / 0 | 10833 / 7022 / 0 | 10833 / 7022 / 0 |
| nikkor-z50f12-best-ref | 3 | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 1661 / 1444 / 0 | 1661 / 1444 / 0 | 1661 / 1444 / 0 |
| nikkor-z50f12-best-photopic | 15 | PASS: hits.maxDistance 1.30e-9 mm | PASS: hits.maxDistance 1.30e-9 mm | PASS: hits.maxDistance 1.05e-12 mm | 8341 / 7184 / 0 | 8341 / 7184 / 0 | 8341 / 7184 / 0 |
| nikkor-z50f12-f8-ref | 3 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 2455 / 1436 / 0 | 2455 / 1436 / 0 | 2455 / 1436 / 0 |
| nikkor-z50f12-f8-photopic | 15 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.08e-12 mm | 12283 / 7172 / 0 | 12283 / 7172 / 0 | 12283 / 7172 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 2455 / 1436 / 0 | 2455 / 1436 / 0 | 2455 / 1436 / 0 |
| nikkor-z50f12-f8-best-photopic | 15 | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.00e-9 mm | PASS: hits.maxDistance 1.08e-12 mm | 12283 / 7172 / 0 | 12283 / 7172 / 0 | 12283 / 7172 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: landing.maxDistance 2.18e-9 mm | PASS: landing.maxDistance 2.18e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 2301 / 1338 / 0 | 2301 / 1338 / 0 | 2301 / 1338 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 15 | PASS: landing.maxDistance 2.66e-9 mm | PASS: landing.maxDistance 2.66e-9 mm | PASS: hits.maxDistance 1.11e-12 mm | 11517 / 6678 / 0 | 11517 / 6678 / 0 | 11517 / 6678 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: hits.maxDistance 1.77e-9 mm | PASS: hits.maxDistance 1.77e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 2253 / 1414 / 0 | 2253 / 1414 / 0 | 2253 / 1414 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 15 | PASS: landing.maxDistance 2.02e-9 mm | PASS: landing.maxDistance 2.02e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 11219 / 7116 / 0 | 11219 / 7116 / 0 | 11219 / 7116 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: hits.maxDistance 1.77e-9 mm | PASS: hits.maxDistance 1.77e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 2253 / 1414 / 0 | 2253 / 1414 / 0 | 2253 / 1414 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | PASS: landing.maxDistance 2.02e-9 mm | PASS: landing.maxDistance 2.02e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 11219 / 7116 / 0 | 11219 / 7116 / 0 | 11219 / 7116 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: hits.maxDistance 1.19e-9 mm | PASS: hits.maxDistance 1.19e-9 mm | PASS: landing.maxDistance 3.48e-13 mm | 1885 / 1440 / 0 | 1885 / 1440 / 0 | 1885 / 1440 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | PASS: hits.maxDistance 1.19e-9 mm | PASS: hits.maxDistance 1.19e-9 mm | PASS: landing.maxDistance 4.40e-13 mm | 9471 / 7154 / 0 | 9471 / 7154 / 0 | 9471 / 7154 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: hits.maxDistance 1.15e-9 mm | PASS: hits.maxDistance 1.15e-9 mm | PASS: landing.maxDistance 3.59e-13 mm | 2417 / 1402 / 0 | 2417 / 1402 / 0 | 2417 / 1402 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | PASS: hits.maxDistance 1.18e-9 mm | PASS: hits.maxDistance 1.18e-9 mm | PASS: landing.maxDistance 4.46e-13 mm | 12077 / 7018 / 0 | 12077 / 7018 / 0 | 12077 / 7018 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: hits.maxDistance 1.15e-9 mm | PASS: hits.maxDistance 1.15e-9 mm | PASS: landing.maxDistance 3.59e-13 mm | 2417 / 1402 / 0 | 2417 / 1402 / 0 | 2417 / 1402 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | PASS: hits.maxDistance 1.18e-9 mm | PASS: hits.maxDistance 1.18e-9 mm | PASS: landing.maxDistance 4.46e-13 mm | 12077 / 7018 / 0 | 12077 / 7018 / 0 | 12077 / 7018 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: hits.maxDistance 1.32e-9 mm | PASS: hits.maxDistance 1.32e-9 mm | PASS: landing.maxDistance 1.99e-13 mm | 1901 / 1414 / 0 | 1901 / 1414 / 0 | 1901 / 1414 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | PASS: hits.maxDistance 1.33e-9 mm | PASS: hits.maxDistance 1.33e-9 mm | PASS: landing.maxDistance 1.82e-13 mm | 9487 / 7088 / 0 | 9487 / 7088 / 0 | 9487 / 7088 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: hits.maxDistance 1.03e-9 mm | PASS: hits.maxDistance 1.03e-9 mm | PASS: landing.maxDistance 2.28e-13 mm | 2271 / 1332 / 0 | 2271 / 1332 / 0 | 2271 / 1332 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | PASS: hits.maxDistance 1.04e-9 mm | PASS: hits.maxDistance 1.04e-9 mm | PASS: landing.maxDistance 2.28e-13 mm | 11387 / 6628 / 0 | 11387 / 6628 / 0 | 11387 / 6628 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: hits.maxDistance 1.03e-9 mm | PASS: hits.maxDistance 1.03e-9 mm | PASS: landing.maxDistance 2.28e-13 mm | 2271 / 1332 / 0 | 2271 / 1332 / 0 | 2271 / 1332 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | PASS: hits.maxDistance 1.04e-9 mm | PASS: hits.maxDistance 1.04e-9 mm | PASS: landing.maxDistance 2.25e-13 mm | 11387 / 6628 / 0 | 11387 / 6628 / 0 | 11387 / 6628 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: hits.maxDistance 3.07e-9 mm | PASS: hits.maxDistance 3.07e-9 mm | PASS: hits.maxDistance 1.12e-12 mm | 2215 / 1280 / 0 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 15 | PASS: hits.maxDistance 3.09e-9 mm | PASS: hits.maxDistance 3.09e-9 mm | PASS: hits.maxDistance 1.19e-12 mm | 11061 / 6774 / 0 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: hits.maxDistance 2.29e-9 mm | PASS: hits.maxDistance 2.29e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 2117 / 1398 / 0 | 2117 / 1398 / 0 | 2117 / 1398 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | PASS: hits.maxDistance 2.31e-9 mm | PASS: hits.maxDistance 2.31e-9 mm | PASS: hits.maxDistance 1.20e-12 mm | 10565 / 7010 / 0 | 10565 / 7010 / 0 | 10565 / 7010 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: hits.maxDistance 2.29e-9 mm | PASS: hits.maxDistance 2.29e-9 mm | PASS: hits.maxDistance 1.03e-12 mm | 2117 / 1398 / 0 | 2117 / 1398 / 0 | 2117 / 1398 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | PASS: hits.maxDistance 2.31e-9 mm | PASS: hits.maxDistance 2.31e-9 mm | PASS: hits.maxDistance 1.20e-12 mm | 10565 / 7010 / 0 | 10565 / 7010 / 0 | 10565 / 7010 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: hits.maxDistance 1.21e-9 mm | PASS: hits.maxDistance 1.21e-9 mm | PASS: hits.maxDistance 9.71e-13 mm | 1929 / 1242 / 0 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 15 | PASS: landing.maxDistance 1.24e-9 mm | PASS: landing.maxDistance 1.24e-9 mm | PASS: hits.maxDistance 1.00e-12 mm | 9631 / 6224 / 0 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: hits.maxDistance 1.34e-9 mm | PASS: hits.maxDistance 1.34e-9 mm | PASS: hits.maxDistance 9.82e-13 mm | 2391 / 1428 / 0 | 2391 / 1428 / 0 | 2391 / 1428 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | PASS: hits.maxDistance 1.41e-9 mm | PASS: hits.maxDistance 1.41e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 11921 / 7174 / 0 | 11921 / 7174 / 0 | 11921 / 7174 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: hits.maxDistance 1.34e-9 mm | PASS: hits.maxDistance 1.34e-9 mm | PASS: hits.maxDistance 9.82e-13 mm | 2391 / 1428 / 0 | 2391 / 1428 / 0 | 2391 / 1428 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | PASS: hits.maxDistance 1.41e-9 mm | PASS: hits.maxDistance 1.41e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 11921 / 7174 / 0 | 11921 / 7174 / 0 | 11921 / 7174 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 9.17e-13 mm | 1751 / 1278 / 0 | 1751 / 1278 / 0 | 1751 / 1278 / 0 |
| nikon-z-mc-105f28-best-photopic | 15 | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 9.16e-13 mm | 8755 / 6390 / 0 | 8755 / 6390 / 0 | 8755 / 6390 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: hits.maxDistance 1.20e-9 mm | PASS: hits.maxDistance 1.20e-9 mm | PASS: landing.maxDistance 1.53e-13 mm | 2311 / 1436 / 0 | 2311 / 1436 / 0 | 2311 / 1436 / 0 |
| nikon-z-mc-105f28-f8-photopic | 15 | PASS: hits.maxDistance 1.34e-9 mm | PASS: hits.maxDistance 1.34e-9 mm | PASS: landing.maxDistance 1.71e-13 mm | 11559 / 7176 / 0 | 11559 / 7176 / 0 | 11559 / 7176 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: hits.maxDistance 1.20e-9 mm | PASS: hits.maxDistance 1.20e-9 mm | PASS: landing.maxDistance 1.53e-13 mm | 2311 / 1436 / 0 | 2311 / 1436 / 0 | 2311 / 1436 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 15 | PASS: hits.maxDistance 1.34e-9 mm | PASS: hits.maxDistance 1.34e-9 mm | PASS: landing.maxDistance 1.67e-13 mm | 11559 / 7176 / 0 | 11559 / 7176 / 0 | 11559 / 7176 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 1.29e-9 mm | PASS: hits.maxDistance 9.34e-13 mm | 2005 / 1454 / 0 | 2005 / 1454 / 0 | 2005 / 1454 / 0 |
| nikon-z-135f18-plena-best-photopic | 15 | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 1.27e-9 mm | PASS: hits.maxDistance 9.79e-13 mm | 10021 / 6914 / 0 | 10021 / 6914 / 0 | 10021 / 6914 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: hits.maxDistance 1.17e-9 mm | PASS: hits.maxDistance 1.17e-9 mm | PASS: hits.maxDistance 1.02e-12 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikon-z-135f18-plena-f8-photopic | 15 | PASS: hits.maxDistance 1.24e-9 mm | PASS: hits.maxDistance 1.24e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 12275 / 7180 / 0 | 12275 / 7180 / 0 | 12275 / 7180 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: hits.maxDistance 1.17e-9 mm | PASS: hits.maxDistance 1.17e-9 mm | PASS: hits.maxDistance 1.02e-12 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 15 | PASS: hits.maxDistance 1.24e-9 mm | PASS: hits.maxDistance 1.24e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 12275 / 7180 / 0 | 12275 / 7180 / 0 | 12275 / 7180 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.16e-9 mm | PASS: hits.maxDistance 1.06e-12 mm | 1839 / 1332 / 0 | 1839 / 1332 / 0 | 1839 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.05e-12 mm | 9185 / 6670 / 0 | 9185 / 6670 / 0 | 9185 / 6670 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.01e-12 mm | 2287 / 1316 / 0 | 2287 / 1316 / 0 | 2287 / 1316 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | PASS: hits.maxDistance 1.20e-9 mm | PASS: hits.maxDistance 1.20e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 11375 / 6640 / 0 | 11375 / 6640 / 0 | 11375 / 6640 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.22e-9 mm | PASS: hits.maxDistance 1.01e-12 mm | 2287 / 1316 / 0 | 2287 / 1316 / 0 | 2287 / 1316 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | PASS: hits.maxDistance 1.20e-9 mm | PASS: hits.maxDistance 1.20e-9 mm | PASS: hits.maxDistance 1.04e-12 mm | 11375 / 6640 / 0 | 11375 / 6640 / 0 | 11375 / 6640 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.12e-6 | sigma-105mm-f28-dg-dn-macro-art-f8-photopic | field 0, line 1, ray 372 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 5.87e-6 | sony-fe-20mm-f18-g-f8-ref | field 4.75e1, line 0, ray 559 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 7.37e-6 | nikon-z-24-70f4s-tele-f8-best-photopic | field 1.66e1, line 1, ray 287 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.12e-6 | sigma-105mm-f28-dg-dn-macro-art-f8-photopic | field 0, line 1, ray 372 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 5.87e-6 | sony-fe-20mm-f18-g-f8-ref | field 4.75e1, line 0, ray 559 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 7.37e-6 | nikon-z-24-70f4s-tele-f8-best-photopic | field 1.66e1, line 1, ray 287 |
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
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: opd.maxAbs 2.48e-6 waves | PASS: opd.maxAbs 2.48e-6 waves | PASS: opticalPathToImage.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-best-photopic | 15 | PASS: opd.maxAbs 4.98e-6 waves | PASS: opd.maxAbs 4.98e-6 waves | PASS: opd.maxAbs 4.23e-10 waves |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: opticalPath.maxAbs 2.90e-6 waves | PASS: opticalPath.maxAbs 2.90e-6 waves | PASS: opd.maxAbs 3.39e-10 waves |
| canon-ef-135-f2l-usm-f8-photopic | 15 | PASS: opticalPath.maxAbs 3.84e-6 waves | PASS: opticalPath.maxAbs 3.84e-6 waves | PASS: opd.maxAbs 3.63e-10 waves |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: opticalPath.maxAbs 2.90e-6 waves | PASS: opticalPath.maxAbs 2.90e-6 waves | PASS: opd.maxAbs 3.39e-10 waves |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 3.84e-6 waves | PASS: opticalPath.maxAbs 3.84e-6 waves | PASS: opd.maxAbs 3.63e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: opd.maxAbs 4.47e-6 waves | PASS: opd.maxAbs 4.47e-6 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | PASS: opd.maxAbs 4.80e-6 waves | PASS: opd.maxAbs 4.80e-6 waves | PASS: opd.maxAbs 2.79e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: opticalPathToImage.maxAbs 3.25e-6 waves | PASS: opticalPathToImage.maxAbs 3.25e-6 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | PASS: opticalPathToImage.maxAbs 4.16e-6 waves | PASS: opticalPathToImage.maxAbs 4.16e-6 waves | PASS: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.25e-6 waves | PASS: opticalPathToImage.maxAbs 3.25e-6 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 4.16e-6 waves | PASS: opticalPathToImage.maxAbs 4.16e-6 waves | PASS: opd.maxAbs 2.79e-10 waves |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: opticalPath.maxAbs 4.22e-6 waves | PASS: opticalPath.maxAbs 4.22e-6 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | PASS: opticalPath.maxAbs 6.00e-6 waves | PASS: opticalPath.maxAbs 6.00e-6 waves | PASS: opticalPath.maxAbs 1.57e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: opticalPath.maxAbs 4.41e-6 waves | PASS: opticalPath.maxAbs 4.41e-6 waves | PASS: opd.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | PASS: opticalPath.maxAbs 5.05e-6 waves | PASS: opticalPath.maxAbs 5.05e-6 waves | PASS: opd.maxAbs 1.33e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: opticalPath.maxAbs 4.41e-6 waves | PASS: opticalPath.maxAbs 4.41e-6 waves | PASS: opticalPath.maxAbs 1.11e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 5.05e-6 waves | PASS: opticalPath.maxAbs 5.05e-6 waves | PASS: opd.maxAbs 1.33e-9 waves |
| nikkor-z50f12-best-ref | 3 | PASS: opticalPath.maxAbs 3.38e-6 waves | PASS: opticalPath.maxAbs 3.38e-6 waves | PASS: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-best-photopic | 15 | PASS: opticalPath.maxAbs 3.64e-6 waves | PASS: opticalPath.maxAbs 3.64e-6 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| nikkor-z50f12-f8-ref | 3 | PASS: opticalPath.maxAbs 3.60e-6 waves | PASS: opticalPath.maxAbs 3.60e-6 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-photopic | 15 | PASS: opticalPath.maxAbs 4.52e-6 waves | PASS: opd.maxAbs 4.52e-6 waves | PASS: opd.maxAbs 2.30e-9 waves |
| nikkor-z50f12-f8-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.60e-6 waves | PASS: opticalPathToImage.maxAbs 3.60e-6 waves | PASS: opd.maxAbs 1.64e-9 waves |
| nikkor-z50f12-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 4.52e-6 waves | PASS: opd.maxAbs 4.52e-6 waves | PASS: opd.maxAbs 2.30e-9 waves |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: opd.maxAbs 3.99e-6 waves | PASS: opd.maxAbs 3.99e-6 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.33e-6 waves | PASS: opticalPathToImage.maxAbs 5.33e-6 waves | PASS: opticalPathToImage.maxAbs 2.06e-9 waves |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: opticalPathToImage.maxAbs 5.87e-6 waves | PASS: opticalPathToImage.maxAbs 5.87e-6 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f8-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.39e-6 waves | PASS: opticalPathToImage.maxAbs 5.39e-6 waves | PASS: opticalPathToImage.maxAbs 2.18e-9 waves |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: opticalPathToImage.maxAbs 5.87e-6 waves | PASS: opticalPathToImage.maxAbs 5.87e-6 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.39e-6 waves | PASS: opticalPathToImage.maxAbs 5.38e-6 waves | PASS: opticalPathToImage.maxAbs 2.18e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: opticalPath.maxAbs 3.18e-6 waves | PASS: opticalPath.maxAbs 3.18e-6 waves | PASS: opticalPath.maxAbs 9.67e-10 waves |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | PASS: opticalPath.maxAbs 4.13e-6 waves | PASS: opticalPath.maxAbs 4.13e-6 waves | PASS: opd.maxAbs 1.94e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: opticalPathToImage.maxAbs 2.92e-6 waves | PASS: opticalPathToImage.maxAbs 2.92e-6 waves | PASS: opd.maxAbs 1.55e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | PASS: opd.maxAbs 4.59e-6 waves | PASS: opd.maxAbs 4.59e-6 waves | PASS: opd.maxAbs 2.18e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: opticalPathToImage.maxAbs 2.92e-6 waves | PASS: opticalPathToImage.maxAbs 2.92e-6 waves | PASS: opd.maxAbs 1.55e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | PASS: opd.maxAbs 4.59e-6 waves | PASS: opd.maxAbs 4.59e-6 waves | PASS: opd.maxAbs 1.94e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: opticalPath.maxAbs 4.33e-6 waves | PASS: opticalPath.maxAbs 4.33e-6 waves | PASS: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | PASS: opticalPath.maxAbs 5.39e-6 waves | PASS: opticalPath.maxAbs 5.39e-6 waves | PASS: opd.maxAbs 4.66e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: opticalPath.maxAbs 4.83e-6 waves | PASS: opticalPath.maxAbs 4.83e-6 waves | PASS: opticalPath.maxAbs 2.90e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | PASS: opticalPath.maxAbs 6.12e-6 waves | PASS: opticalPath.maxAbs 6.12e-6 waves | PASS: opd.maxAbs 4.61e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: opticalPath.maxAbs 4.83e-6 waves | PASS: opticalPath.maxAbs 4.83e-6 waves | PASS: opticalPath.maxAbs 2.90e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 6.12e-6 waves | PASS: opticalPath.maxAbs 6.12e-6 waves | PASS: opd.maxAbs 5.12e-10 waves |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: opd.maxAbs 3.82e-6 waves | PASS: opd.maxAbs 3.82e-6 waves | PASS: opticalPath.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-wide-best-photopic | 15 | PASS: opd.maxAbs 5.26e-6 waves | PASS: opd.maxAbs 5.26e-6 waves | PASS: opticalPath.maxAbs 2.72e-9 waves |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: opd.maxAbs 3.35e-6 waves | PASS: opd.maxAbs 3.35e-6 waves | PASS: opd.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | PASS: opd.maxAbs 3.97e-6 waves | PASS: opticalPath.maxAbs 3.97e-6 waves | PASS: opd.maxAbs 2.72e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: opticalPath.maxAbs 3.35e-6 waves | PASS: opticalPath.maxAbs 3.35e-6 waves | PASS: opd.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | PASS: opd.maxAbs 3.97e-6 waves | PASS: opticalPath.maxAbs 3.97e-6 waves | PASS: opd.maxAbs 2.72e-9 waves |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: opd.maxAbs 4.89e-6 waves | PASS: opd.maxAbs 4.89e-6 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-tele-best-photopic | 15 | PASS: opd.maxAbs 5.52e-6 waves | PASS: opd.maxAbs 5.52e-6 waves | PASS: opticalPath.maxAbs 1.89e-9 waves |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: opd.maxAbs 5.21e-6 waves | PASS: opd.maxAbs 5.21e-6 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | PASS: opd.maxAbs 7.37e-6 waves | PASS: opd.maxAbs 7.36e-6 waves | PASS: opd.maxAbs 1.62e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: opd.maxAbs 5.21e-6 waves | PASS: opd.maxAbs 5.21e-6 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | PASS: opd.maxAbs 7.37e-6 waves | PASS: opd.maxAbs 7.37e-6 waves | PASS: opd.maxAbs 1.62e-9 waves |
| nikon-z-mc-105f28-best-ref | 3 | PASS: opticalPathToImage.maxAbs 2.98e-6 waves | PASS: opticalPathToImage.maxAbs 2.98e-6 waves | PASS: opd.maxAbs 8.71e-10 waves |
| nikon-z-mc-105f28-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 3.70e-6 waves | PASS: opticalPathToImage.maxAbs 3.70e-6 waves | PASS: opd.maxAbs 1.27e-9 waves |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: opticalPathToImage.maxAbs 3.13e-6 waves | PASS: opticalPathToImage.maxAbs 3.13e-6 waves | PASS: opd.maxAbs 4.84e-10 waves |
| nikon-z-mc-105f28-f8-photopic | 15 | PASS: opticalPath.maxAbs 4.53e-6 waves | PASS: opticalPath.maxAbs 4.53e-6 waves | PASS: opd.maxAbs 5.02e-10 waves |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.13e-6 waves | PASS: opticalPathToImage.maxAbs 3.13e-6 waves | PASS: opd.maxAbs 4.84e-10 waves |
| nikon-z-mc-105f28-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 4.53e-6 waves | PASS: opticalPath.maxAbs 4.53e-6 waves | PASS: opd.maxAbs 4.84e-10 waves |
| nikon-z-135f18-plena-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.67e-6 waves | PASS: opticalPathToImage.maxAbs 3.67e-6 waves | PASS: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 4.34e-6 waves | PASS: opticalPathToImage.maxAbs 4.34e-6 waves | PASS: opticalPath.maxAbs 1.00e-9 waves |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: opd.maxAbs 3.16e-6 waves | PASS: opd.maxAbs 3.16e-6 waves | PASS: opd.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f8-photopic | 15 | PASS: opd.maxAbs 3.59e-6 waves | PASS: opd.maxAbs 3.59e-6 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: opd.maxAbs 3.16e-6 waves | PASS: opd.maxAbs 3.16e-6 waves | PASS: opd.maxAbs 1.16e-9 waves |
| nikon-z-135f18-plena-f8-best-photopic | 15 | PASS: opd.maxAbs 3.59e-6 waves | PASS: opd.maxAbs 3.59e-6 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: opd.maxAbs 2.41e-6 waves | PASS: opticalPathToImage.maxAbs 2.41e-6 waves | PASS: opticalPath.maxAbs 1.77e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | PASS: opticalPath.maxAbs 3.01e-6 waves | PASS: opticalPath.maxAbs 3.01e-6 waves | PASS: opd.maxAbs 2.27e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: opd.maxAbs 2.63e-6 waves | PASS: opd.maxAbs 2.63e-6 waves | PASS: opticalPath.maxAbs 1.31e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | PASS: opticalPath.maxAbs 3.03e-6 waves | PASS: opticalPath.maxAbs 3.03e-6 waves | PASS: opticalPath.maxAbs 1.66e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: opd.maxAbs 2.63e-6 waves | PASS: opd.maxAbs 2.63e-6 waves | PASS: opticalPath.maxAbs 1.31e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 3.03e-6 waves | PASS: opticalPath.maxAbs 3.03e-6 waves | PASS: opticalPath.maxAbs 1.66e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 5.39e-8 | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | cut tangential, field 2.56e1, frequencyPerMm 98 |
| lv – optiland | rays.compared [rays] | 611140 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 5.39e-8 | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | cut tangential, field 2.56e1, frequencyPerMm 98 |
| lv – ref | rays.compared [rays] | 611140 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.20e-11 | nikon-z-24-70f4s-wide-best-ref | cut sagittal, field 4.33e1, frequencyPerMm 68 |
| optiland – ref | rays.compared [rays] | 611140 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: mtf.maxAbs 9.23e-9 | PASS: mtf.maxAbs 9.23e-9 | PASS: mtf.maxAbs 1.84e-12 |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: mtf.maxAbs 5.08e-9 | PASS: mtf.maxAbs 5.08e-9 | PASS: mtf.maxAbs 1.27e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: mtf.maxAbs 2.76e-8 | PASS: mtf.maxAbs 2.76e-8 | PASS: mtf.maxAbs 1.22e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: mtf.maxAbs 1.98e-8 | PASS: mtf.maxAbs 1.98e-8 | PASS: mtf.maxAbs 9.86e-13 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: mtf.maxAbs 2.96e-8 | PASS: mtf.maxAbs 2.96e-8 | PASS: mtf.maxAbs 5.77e-12 |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: mtf.maxAbs 2.69e-8 | PASS: mtf.maxAbs 2.69e-8 | PASS: mtf.maxAbs 2.95e-12 |
| nikkor-z50f12-ref | 3 | PASS: mtf.maxAbs 1.57e-8 | PASS: mtf.maxAbs 1.57e-8 | PASS: mtf.maxAbs 3.64e-12 |
| nikkor-z50f12-photopic | 3 | PASS: mtf.maxAbs 6.07e-9 | PASS: mtf.maxAbs 6.07e-9 | PASS: mtf.maxAbs 2.59e-12 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: mtf.maxAbs 1.34e-8 | PASS: mtf.maxAbs 1.34e-8 | PASS: mtf.maxAbs 3.51e-12 |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: mtf.maxAbs 1.07e-8 | PASS: mtf.maxAbs 1.07e-8 | PASS: mtf.maxAbs 2.71e-12 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: mtf.maxAbs 3.37e-8 | PASS: mtf.maxAbs 3.37e-8 | PASS: mtf.maxAbs 5.02e-12 |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: mtf.maxAbs 2.29e-8 | PASS: mtf.maxAbs 2.29e-8 | PASS: mtf.maxAbs 6.32e-12 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: mtf.maxAbs 9.24e-9 | PASS: mtf.maxAbs 9.24e-9 | PASS: mtf.maxAbs 3.16e-12 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: mtf.maxAbs 5.94e-9 | PASS: mtf.maxAbs 5.94e-9 | PASS: mtf.maxAbs 2.48e-12 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: mtf.maxAbs 8.82e-9 | PASS: mtf.maxAbs 8.83e-9 | PASS: mtf.maxAbs 1.19e-11 |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: mtf.maxAbs 9.74e-9 | PASS: mtf.maxAbs 9.74e-9 | PASS: mtf.maxAbs 7.32e-12 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: mtf.maxAbs 3.09e-8 | PASS: mtf.maxAbs 3.09e-8 | PASS: mtf.maxAbs 7.68e-12 |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: mtf.maxAbs 1.61e-8 | PASS: mtf.maxAbs 1.61e-8 | PASS: mtf.maxAbs 7.92e-12 |
| nikon-z-mc-105f28-ref | 3 | PASS: mtf.maxAbs 1.85e-8 | PASS: mtf.maxAbs 1.85e-8 | PASS: mtf.maxAbs 1.98e-12 |
| nikon-z-mc-105f28-photopic | 3 | PASS: mtf.maxAbs 1.55e-8 | PASS: mtf.maxAbs 1.55e-8 | PASS: mtf.maxAbs 1.14e-12 |
| nikon-z-135f18-plena-ref | 3 | PASS: mtf.maxAbs 1.25e-8 | PASS: mtf.maxAbs 1.25e-8 | PASS: mtf.maxAbs 1.77e-12 |
| nikon-z-135f18-plena-photopic | 3 | PASS: mtf.maxAbs 8.69e-9 | PASS: mtf.maxAbs 8.69e-9 | PASS: mtf.maxAbs 1.92e-12 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: mtf.maxAbs 2.18e-8 | PASS: mtf.maxAbs 2.18e-8 | PASS: mtf.maxAbs 9.71e-12 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: mtf.maxAbs 1.81e-8 | PASS: mtf.maxAbs 1.81e-8 | PASS: mtf.maxAbs 6.49e-12 |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: mtf.maxAbs 8.06e-9 | PASS: mtf.maxAbs 8.06e-9 | PASS: mtf.maxAbs 1.60e-12 |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: mtf.maxAbs 5.66e-9 | PASS: mtf.maxAbs 5.66e-9 | PASS: mtf.maxAbs 4.95e-13 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: mtf.maxAbs 4.46e-9 | PASS: mtf.maxAbs 4.46e-9 | PASS: mtf.maxAbs 3.92e-13 |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: mtf.maxAbs 3.63e-9 | PASS: mtf.maxAbs 3.63e-9 | PASS: mtf.maxAbs 5.93e-13 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: mtf.maxAbs 4.71e-9 | PASS: mtf.maxAbs 4.71e-9 | PASS: mtf.maxAbs 3.93e-13 |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: mtf.maxAbs 4.29e-9 | PASS: mtf.maxAbs 4.29e-9 | PASS: mtf.maxAbs 7.10e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: mtf.maxAbs 2.61e-8 | PASS: mtf.maxAbs 2.61e-8 | PASS: mtf.maxAbs 9.01e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: mtf.maxAbs 1.03e-8 | PASS: mtf.maxAbs 1.03e-8 | PASS: mtf.maxAbs 7.50e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: mtf.maxAbs 3.19e-8 | PASS: mtf.maxAbs 3.19e-8 | PASS: mtf.maxAbs 8.62e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: mtf.maxAbs 1.39e-8 | PASS: mtf.maxAbs 1.39e-8 | PASS: mtf.maxAbs 5.77e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: mtf.maxAbs 3.51e-8 | PASS: mtf.maxAbs 3.51e-8 | PASS: mtf.maxAbs 1.11e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: mtf.maxAbs 5.39e-9 | PASS: mtf.maxAbs 5.39e-9 | PASS: mtf.maxAbs 6.91e-13 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: mtf.maxAbs 3.04e-8 | PASS: mtf.maxAbs 3.04e-8 | PASS: mtf.maxAbs 5.59e-12 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: mtf.maxAbs 2.76e-8 | PASS: mtf.maxAbs 2.76e-8 | PASS: mtf.maxAbs 3.01e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: mtf.maxAbs 3.27e-8 | PASS: mtf.maxAbs 3.27e-8 | PASS: mtf.maxAbs 4.65e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: mtf.maxAbs 1.06e-8 | PASS: mtf.maxAbs 1.06e-8 | PASS: mtf.maxAbs 1.41e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: mtf.maxAbs 3.21e-8 | PASS: mtf.maxAbs 3.21e-8 | PASS: mtf.maxAbs 4.52e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.66e-8 | PASS: mtf.maxAbs 1.66e-8 | PASS: mtf.maxAbs 2.21e-12 |
| nikkor-z50f12-best-ref | 3 | PASS: mtf.maxAbs 2.03e-8 | PASS: mtf.maxAbs 2.03e-8 | PASS: mtf.maxAbs 9.29e-12 |
| nikkor-z50f12-best-photopic | 3 | PASS: mtf.maxAbs 1.02e-8 | PASS: mtf.maxAbs 1.02e-8 | PASS: mtf.maxAbs 3.55e-12 |
| nikkor-z50f12-f8-ref | 3 | PASS: mtf.maxAbs 1.66e-8 | PASS: mtf.maxAbs 1.66e-8 | PASS: mtf.maxAbs 3.14e-12 |
| nikkor-z50f12-f8-photopic | 3 | PASS: mtf.maxAbs 1.30e-8 | PASS: mtf.maxAbs 1.30e-8 | PASS: mtf.maxAbs 1.92e-12 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: mtf.maxAbs 1.67e-8 | PASS: mtf.maxAbs 1.66e-8 | PASS: mtf.maxAbs 3.17e-12 |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.31e-8 | PASS: mtf.maxAbs 1.31e-8 | PASS: mtf.maxAbs 2.28e-12 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: mtf.maxAbs 1.47e-8 | PASS: mtf.maxAbs 1.47e-8 | PASS: mtf.maxAbs 3.36e-12 |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: mtf.maxAbs 9.20e-9 | PASS: mtf.maxAbs 9.20e-9 | PASS: mtf.maxAbs 3.91e-12 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: mtf.maxAbs 5.17e-8 | PASS: mtf.maxAbs 5.17e-8 | PASS: mtf.maxAbs 3.10e-12 |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: mtf.maxAbs 2.83e-8 | PASS: mtf.maxAbs 2.83e-8 | PASS: mtf.maxAbs 2.27e-12 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: mtf.maxAbs 5.18e-8 | PASS: mtf.maxAbs 5.18e-8 | PASS: mtf.maxAbs 3.14e-12 |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.89e-8 | PASS: mtf.maxAbs 2.89e-8 | PASS: mtf.maxAbs 2.35e-12 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: mtf.maxAbs 2.92e-8 | PASS: mtf.maxAbs 2.92e-8 | PASS: mtf.maxAbs 3.70e-12 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: mtf.maxAbs 9.52e-9 | PASS: mtf.maxAbs 9.52e-9 | PASS: mtf.maxAbs 9.92e-13 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: mtf.maxAbs 3.95e-8 | PASS: mtf.maxAbs 3.95e-8 | PASS: mtf.maxAbs 6.29e-12 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: mtf.maxAbs 2.24e-8 | PASS: mtf.maxAbs 2.24e-8 | PASS: mtf.maxAbs 4.63e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: mtf.maxAbs 2.07e-8 | PASS: mtf.maxAbs 2.07e-8 | PASS: mtf.maxAbs 2.34e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.09e-8 | PASS: mtf.maxAbs 1.09e-8 | PASS: mtf.maxAbs 1.39e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: mtf.maxAbs 1.18e-8 | PASS: mtf.maxAbs 1.18e-8 | PASS: mtf.maxAbs 3.07e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: mtf.maxAbs 9.25e-9 | PASS: mtf.maxAbs 9.25e-9 | PASS: mtf.maxAbs 3.17e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: mtf.maxAbs 1.82e-8 | PASS: mtf.maxAbs 1.82e-8 | PASS: mtf.maxAbs 3.39e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: mtf.maxAbs 1.06e-8 | PASS: mtf.maxAbs 1.06e-8 | PASS: mtf.maxAbs 2.55e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: mtf.maxAbs 1.78e-8 | PASS: mtf.maxAbs 1.78e-8 | PASS: mtf.maxAbs 3.27e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.07e-8 | PASS: mtf.maxAbs 1.07e-8 | PASS: mtf.maxAbs 2.56e-12 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: mtf.maxAbs 1.19e-8 | PASS: mtf.maxAbs 1.19e-8 | PASS: mtf.maxAbs 1.20e-11 |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: mtf.maxAbs 4.89e-9 | PASS: mtf.maxAbs 4.90e-9 | PASS: mtf.maxAbs 9.49e-12 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: mtf.maxAbs 1.64e-8 | PASS: mtf.maxAbs 1.64e-8 | PASS: mtf.maxAbs 6.38e-12 |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: mtf.maxAbs 9.36e-9 | PASS: mtf.maxAbs 9.36e-9 | PASS: mtf.maxAbs 3.94e-12 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: mtf.maxAbs 2.01e-8 | PASS: mtf.maxAbs 2.01e-8 | PASS: mtf.maxAbs 1.12e-11 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: mtf.maxAbs 9.04e-9 | PASS: mtf.maxAbs 9.04e-9 | PASS: mtf.maxAbs 4.42e-12 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: mtf.maxAbs 2.63e-8 | PASS: mtf.maxAbs 2.63e-8 | PASS: mtf.maxAbs 8.49e-12 |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: mtf.maxAbs 2.18e-8 | PASS: mtf.maxAbs 2.18e-8 | PASS: mtf.maxAbs 8.17e-12 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: mtf.maxAbs 2.12e-8 | PASS: mtf.maxAbs 2.12e-8 | PASS: mtf.maxAbs 6.05e-12 |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: mtf.maxAbs 1.69e-8 | PASS: mtf.maxAbs 1.69e-8 | PASS: mtf.maxAbs 7.61e-12 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: mtf.maxAbs 1.58e-8 | PASS: mtf.maxAbs 1.58e-8 | PASS: mtf.maxAbs 9.14e-12 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.79e-8 | PASS: mtf.maxAbs 1.79e-8 | PASS: mtf.maxAbs 3.95e-12 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: mtf.maxAbs 1.59e-8 | PASS: mtf.maxAbs 1.59e-8 | PASS: mtf.maxAbs 1.89e-12 |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: mtf.maxAbs 1.03e-8 | PASS: mtf.maxAbs 1.03e-8 | PASS: mtf.maxAbs 5.45e-13 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: mtf.maxAbs 2.44e-8 | PASS: mtf.maxAbs 2.44e-8 | PASS: mtf.maxAbs 9.60e-13 |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: mtf.maxAbs 2.11e-8 | PASS: mtf.maxAbs 2.11e-8 | PASS: mtf.maxAbs 6.50e-13 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: mtf.maxAbs 2.13e-8 | PASS: mtf.maxAbs 2.13e-8 | PASS: mtf.maxAbs 1.05e-12 |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.29e-8 | PASS: mtf.maxAbs 2.29e-8 | PASS: mtf.maxAbs 5.62e-13 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: mtf.maxAbs 1.45e-8 | PASS: mtf.maxAbs 1.45e-8 | PASS: mtf.maxAbs 1.74e-12 |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: mtf.maxAbs 1.13e-8 | PASS: mtf.maxAbs 1.13e-8 | PASS: mtf.maxAbs 2.34e-12 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: mtf.maxAbs 7.63e-9 | PASS: mtf.maxAbs 7.63e-9 | PASS: mtf.maxAbs 8.29e-13 |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: mtf.maxAbs 7.58e-9 | PASS: mtf.maxAbs 7.57e-9 | PASS: mtf.maxAbs 1.54e-12 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: mtf.maxAbs 7.69e-9 | PASS: mtf.maxAbs 7.69e-9 | PASS: mtf.maxAbs 9.42e-13 |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: mtf.maxAbs 7.66e-9 | PASS: mtf.maxAbs 7.66e-9 | PASS: mtf.maxAbs 1.52e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: mtf.maxAbs 1.73e-8 | PASS: mtf.maxAbs 1.73e-8 | PASS: mtf.maxAbs 8.47e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: mtf.maxAbs 1.41e-8 | PASS: mtf.maxAbs 1.41e-8 | PASS: mtf.maxAbs 7.32e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: mtf.maxAbs 4.73e-8 | PASS: mtf.maxAbs 4.73e-8 | PASS: mtf.maxAbs 7.08e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: mtf.maxAbs 1.53e-8 | PASS: mtf.maxAbs 1.52e-8 | PASS: mtf.maxAbs 3.77e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: mtf.maxAbs 5.39e-8 | PASS: mtf.maxAbs 5.39e-8 | PASS: mtf.maxAbs 6.51e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.60e-8 | PASS: mtf.maxAbs 2.60e-8 | PASS: mtf.maxAbs 3.98e-12 |
