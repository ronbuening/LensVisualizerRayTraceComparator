# MTF baseline of benchmark

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
| Suite | benchmark |
| Suite hash | ca12c885c2454c3cb1a8d0c54d51128a20c4919c2ceb84c3d03a7404cceb75fa |
| Baseline hash | d818fcc0825b997e2ab2f156a0fe022dc4c64f0108c54374c6264f85595d1996 |
| Contract version | 1.1 |
| Policy | rungs v10 |
| Policy hash | 239a222c5dfcfcad8847826fcd136bfec8d42663cda84f3b26febae191a79c62 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | cdbbbce9025d6af6c839748efb360b839b88c77226660dc39202113aeb1084ce | commit 33ebdb30b619a02edcf03f6d930bc1ef5e4e6905, dirty false, engineFileCount 151 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | e505ad9abe7ea56e6e985a4a98ee5b06602adb3e3bd2532941314fb7ba940712 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | cf9f034646e8fb811815bc6335e461ce69caf5da94a7b39b428c0146c996fe38 | d94e3fcb4a6cdf6e79745d1a432a75827bfdf20010c163ca7573fcfdf5a7b950 | sourceFiles 11 |
| replay | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | d8e91ec07971c1e99e4d2c259411473eaf0c9f47aef7728936a2f263fc368389 | commit 33ebdb30b619a02edcf03f6d930bc1ef5e4e6905, dirty false, engineFileCount 151 |
| wave | 1 | 78215d72e89d092a9c325a17ef9dd1e083d6855fa2a511df61d5a8b7f7e6f322 | e60becaf375b6894abd2ef79dbd27e7ae0f7a7bfe2145eb56ff525901baabf3c | commit 33ebdb30b619a02edcf03f6d930bc1ef5e4e6905, dirty false, engineFileCount 151 |

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
| r4 | rays.trace | 96 | 288 | lv – optiland | 96 PASS | 288 PASS |
| r4 | rays.trace | 96 | 288 | lv – ref | 96 PASS | 288 PASS |
| r4 | rays.trace | 96 | 288 | optiland – ref | 96 PASS | 288 PASS |
| r4f | mtf.native | 96 | 96 | lv – replay | 96 PASS | 96 PASS |
| r5 | mtf.native | 96 | 96 | lv – optiland | 33 RECORDED, 15 ATTENTION, 48 UNSUPPORTED | 33 RECORDED, 15 ATTENTION, 48 UNSUPPORTED |
| r5 | mtf.native | 96 | 96 | lv – wave | 91 RECORDED, 5 ATTENTION | 91 RECORDED, 5 ATTENTION |
| r5 | mtf.native | 96 | 96 | optiland – wave | 37 RECORDED, 11 ATTENTION, 48 UNSUPPORTED | 37 RECORDED, 11 ATTENTION, 48 UNSUPPORTED |
| r5g | mtf.native | 96 | 288 | lv – optiland | 56 RECORDED, 40 ATTENTION | 212 RECORDED, 76 ATTENTION |
| r5g | mtf.native | 96 | 288 | lv – replay | 96 RECORDED | 288 RECORDED |
| r5g | mtf.native | 96 | 288 | optiland – replay | 56 RECORDED, 40 ATTENTION | 212 RECORDED, 76 ATTENTION |
| r6a | rays.trace | 96 | 288 | lv – optiland | 96 PASS | 288 PASS |
| r6a | rays.trace | 96 | 288 | lv – ref | 96 PASS | 288 PASS |
| r6a | rays.trace | 96 | 288 | optiland – ref | 96 PASS | 288 PASS |
| r6b | mtf.native | 96 | 96 | lv – wave | 91 RECORDED, 5 ATTENTION | 91 RECORDED, 5 ATTENTION |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r4 | lv | 96 ok |
| r4 | optiland | 96 ok |
| r4 | ref | 96 ok |
| r4f | lv | 96 ok |
| r4f | replay | 96 ok |
| r5 | lv | 96 ok |
| r5 | optiland | 48 ok, 48 unsupported (feature lines.polychromatic) |
| r5 | wave | 96 ok |
| r5g | lv | 96 ok |
| r5g | optiland | 96 ok |
| r5g | replay | 96 ok |
| r6a | lv | 96 ok |
| r6a | optiland | 96 ok |
| r6a | ref | 96 ok |
| r6b | lv | 96 ok |
| r6b | wave | 96 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 5.39e-8 | 288 of 288 | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | cut tangential, field 2.56e1, frequencyPerMm 98 |
| lv – optiland | rays.compared [rays] | 611140 | 288 of 288 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 5.39e-8 | 288 of 288 | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | cut tangential, field 2.56e1, frequencyPerMm 98 |
| lv – ref | rays.compared [rays] | 611140 | 288 of 288 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.20e-11 | 288 of 288 | nikon-z-24-70f4s-wide-best-ref | cut sagittal, field 4.33e1, frequencyPerMm 68 |
| optiland – ref | rays.compared [rays] | 611140 | 288 of 288 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: mtf.maxAbs 9.23e-9 (3 of 3) | PASS: mtf.maxAbs 9.23e-9 (3 of 3) | PASS: mtf.maxAbs 1.84e-12 (3 of 3) |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: mtf.maxAbs 5.08e-9 (3 of 3) | PASS: mtf.maxAbs 5.08e-9 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: mtf.maxAbs 2.76e-8 (3 of 3) | PASS: mtf.maxAbs 2.76e-8 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: mtf.maxAbs 1.98e-8 (3 of 3) | PASS: mtf.maxAbs 1.98e-8 (3 of 3) | PASS: mtf.maxAbs 9.86e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: mtf.maxAbs 2.96e-8 (3 of 3) | PASS: mtf.maxAbs 2.96e-8 (3 of 3) | PASS: mtf.maxAbs 5.77e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: mtf.maxAbs 2.69e-8 (3 of 3) | PASS: mtf.maxAbs 2.69e-8 (3 of 3) | PASS: mtf.maxAbs 2.95e-12 (3 of 3) |
| nikkor-z50f12-ref | 3 | PASS: mtf.maxAbs 1.57e-8 (3 of 3) | PASS: mtf.maxAbs 1.57e-8 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) |
| nikkor-z50f12-photopic | 3 | PASS: mtf.maxAbs 6.07e-9 (3 of 3) | PASS: mtf.maxAbs 6.07e-9 (3 of 3) | PASS: mtf.maxAbs 2.59e-12 (3 of 3) |
| sony-fe-20mm-f18-g-ref | 3 | PASS: mtf.maxAbs 1.34e-8 (3 of 3) | PASS: mtf.maxAbs 1.34e-8 (3 of 3) | PASS: mtf.maxAbs 3.51e-12 (3 of 3) |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: mtf.maxAbs 1.07e-8 (3 of 3) | PASS: mtf.maxAbs 1.07e-8 (3 of 3) | PASS: mtf.maxAbs 2.71e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: mtf.maxAbs 3.37e-8 (3 of 3) | PASS: mtf.maxAbs 3.37e-8 (3 of 3) | PASS: mtf.maxAbs 5.02e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: mtf.maxAbs 2.29e-8 (3 of 3) | PASS: mtf.maxAbs 2.29e-8 (3 of 3) | PASS: mtf.maxAbs 6.32e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: mtf.maxAbs 9.24e-9 (3 of 3) | PASS: mtf.maxAbs 9.24e-9 (3 of 3) | PASS: mtf.maxAbs 3.16e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: mtf.maxAbs 5.94e-9 (3 of 3) | PASS: mtf.maxAbs 5.94e-9 (3 of 3) | PASS: mtf.maxAbs 2.48e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: mtf.maxAbs 8.82e-9 (3 of 3) | PASS: mtf.maxAbs 8.83e-9 (3 of 3) | PASS: mtf.maxAbs 1.19e-11 (3 of 3) |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: mtf.maxAbs 9.74e-9 (3 of 3) | PASS: mtf.maxAbs 9.74e-9 (3 of 3) | PASS: mtf.maxAbs 7.32e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: mtf.maxAbs 3.09e-8 (3 of 3) | PASS: mtf.maxAbs 3.09e-8 (3 of 3) | PASS: mtf.maxAbs 7.68e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: mtf.maxAbs 1.61e-8 (3 of 3) | PASS: mtf.maxAbs 1.61e-8 (3 of 3) | PASS: mtf.maxAbs 7.92e-12 (3 of 3) |
| nikon-z-mc-105f28-ref | 3 | PASS: mtf.maxAbs 1.85e-8 (3 of 3) | PASS: mtf.maxAbs 1.85e-8 (3 of 3) | PASS: mtf.maxAbs 1.98e-12 (3 of 3) |
| nikon-z-mc-105f28-photopic | 3 | PASS: mtf.maxAbs 1.55e-8 (3 of 3) | PASS: mtf.maxAbs 1.55e-8 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) |
| nikon-z-135f18-plena-ref | 3 | PASS: mtf.maxAbs 1.25e-8 (3 of 3) | PASS: mtf.maxAbs 1.25e-8 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) |
| nikon-z-135f18-plena-photopic | 3 | PASS: mtf.maxAbs 8.69e-9 (3 of 3) | PASS: mtf.maxAbs 8.69e-9 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: mtf.maxAbs 2.18e-8 (3 of 3) | PASS: mtf.maxAbs 2.18e-8 (3 of 3) | PASS: mtf.maxAbs 9.71e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: mtf.maxAbs 1.81e-8 (3 of 3) | PASS: mtf.maxAbs 1.81e-8 (3 of 3) | PASS: mtf.maxAbs 6.49e-12 (3 of 3) |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: mtf.maxAbs 8.06e-9 (3 of 3) | PASS: mtf.maxAbs 8.06e-9 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: mtf.maxAbs 5.66e-9 (3 of 3) | PASS: mtf.maxAbs 5.66e-9 (3 of 3) | PASS: mtf.maxAbs 4.95e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: mtf.maxAbs 4.46e-9 (3 of 3) | PASS: mtf.maxAbs 4.46e-9 (3 of 3) | PASS: mtf.maxAbs 3.92e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: mtf.maxAbs 3.63e-9 (3 of 3) | PASS: mtf.maxAbs 3.63e-9 (3 of 3) | PASS: mtf.maxAbs 5.93e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: mtf.maxAbs 4.71e-9 (3 of 3) | PASS: mtf.maxAbs 4.71e-9 (3 of 3) | PASS: mtf.maxAbs 3.93e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: mtf.maxAbs 4.29e-9 (3 of 3) | PASS: mtf.maxAbs 4.29e-9 (3 of 3) | PASS: mtf.maxAbs 7.10e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: mtf.maxAbs 2.61e-8 (3 of 3) | PASS: mtf.maxAbs 2.61e-8 (3 of 3) | PASS: mtf.maxAbs 9.01e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: mtf.maxAbs 1.03e-8 (3 of 3) | PASS: mtf.maxAbs 1.03e-8 (3 of 3) | PASS: mtf.maxAbs 7.50e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: mtf.maxAbs 3.19e-8 (3 of 3) | PASS: mtf.maxAbs 3.19e-8 (3 of 3) | PASS: mtf.maxAbs 8.62e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: mtf.maxAbs 1.39e-8 (3 of 3) | PASS: mtf.maxAbs 1.39e-8 (3 of 3) | PASS: mtf.maxAbs 5.77e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: mtf.maxAbs 3.51e-8 (3 of 3) | PASS: mtf.maxAbs 3.51e-8 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: mtf.maxAbs 5.39e-9 (3 of 3) | PASS: mtf.maxAbs 5.39e-9 (3 of 3) | PASS: mtf.maxAbs 6.91e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: mtf.maxAbs 3.04e-8 (3 of 3) | PASS: mtf.maxAbs 3.04e-8 (3 of 3) | PASS: mtf.maxAbs 5.59e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: mtf.maxAbs 2.76e-8 (3 of 3) | PASS: mtf.maxAbs 2.76e-8 (3 of 3) | PASS: mtf.maxAbs 3.01e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: mtf.maxAbs 3.27e-8 (3 of 3) | PASS: mtf.maxAbs 3.27e-8 (3 of 3) | PASS: mtf.maxAbs 4.65e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: mtf.maxAbs 1.06e-8 (3 of 3) | PASS: mtf.maxAbs 1.06e-8 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: mtf.maxAbs 3.21e-8 (3 of 3) | PASS: mtf.maxAbs 3.21e-8 (3 of 3) | PASS: mtf.maxAbs 4.52e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) |
| nikkor-z50f12-best-ref | 3 | PASS: mtf.maxAbs 2.03e-8 (3 of 3) | PASS: mtf.maxAbs 2.03e-8 (3 of 3) | PASS: mtf.maxAbs 9.29e-12 (3 of 3) |
| nikkor-z50f12-best-photopic | 3 | PASS: mtf.maxAbs 1.02e-8 (3 of 3) | PASS: mtf.maxAbs 1.02e-8 (3 of 3) | PASS: mtf.maxAbs 3.55e-12 (3 of 3) |
| nikkor-z50f12-f8-ref | 3 | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 3.14e-12 (3 of 3) |
| nikkor-z50f12-f8-photopic | 3 | PASS: mtf.maxAbs 1.30e-8 (3 of 3) | PASS: mtf.maxAbs 1.30e-8 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) |
| nikkor-z50f12-f8-best-ref | 3 | PASS: mtf.maxAbs 1.67e-8 (3 of 3) | PASS: mtf.maxAbs 1.66e-8 (3 of 3) | PASS: mtf.maxAbs 3.17e-12 (3 of 3) |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.31e-8 (3 of 3) | PASS: mtf.maxAbs 1.31e-8 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: mtf.maxAbs 1.47e-8 (3 of 3) | PASS: mtf.maxAbs 1.47e-8 (3 of 3) | PASS: mtf.maxAbs 3.36e-12 (3 of 3) |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: mtf.maxAbs 9.20e-9 (3 of 3) | PASS: mtf.maxAbs 9.20e-9 (3 of 3) | PASS: mtf.maxAbs 3.91e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: mtf.maxAbs 5.17e-8 (3 of 3) | PASS: mtf.maxAbs 5.17e-8 (3 of 3) | PASS: mtf.maxAbs 3.10e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: mtf.maxAbs 2.83e-8 (3 of 3) | PASS: mtf.maxAbs 2.83e-8 (3 of 3) | PASS: mtf.maxAbs 2.27e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: mtf.maxAbs 5.18e-8 (3 of 3) | PASS: mtf.maxAbs 5.18e-8 (3 of 3) | PASS: mtf.maxAbs 3.14e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.89e-8 (3 of 3) | PASS: mtf.maxAbs 2.89e-8 (3 of 3) | PASS: mtf.maxAbs 2.35e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: mtf.maxAbs 2.92e-8 (3 of 3) | PASS: mtf.maxAbs 2.92e-8 (3 of 3) | PASS: mtf.maxAbs 3.70e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: mtf.maxAbs 9.52e-9 (3 of 3) | PASS: mtf.maxAbs 9.52e-9 (3 of 3) | PASS: mtf.maxAbs 9.92e-13 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: mtf.maxAbs 3.95e-8 (3 of 3) | PASS: mtf.maxAbs 3.95e-8 (3 of 3) | PASS: mtf.maxAbs 6.29e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: mtf.maxAbs 2.24e-8 (3 of 3) | PASS: mtf.maxAbs 2.24e-8 (3 of 3) | PASS: mtf.maxAbs 4.63e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: mtf.maxAbs 2.07e-8 (3 of 3) | PASS: mtf.maxAbs 2.07e-8 (3 of 3) | PASS: mtf.maxAbs 2.34e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.09e-8 (3 of 3) | PASS: mtf.maxAbs 1.09e-8 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: mtf.maxAbs 1.18e-8 (3 of 3) | PASS: mtf.maxAbs 1.18e-8 (3 of 3) | PASS: mtf.maxAbs 3.07e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: mtf.maxAbs 9.25e-9 (3 of 3) | PASS: mtf.maxAbs 9.25e-9 (3 of 3) | PASS: mtf.maxAbs 3.17e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: mtf.maxAbs 1.82e-8 (3 of 3) | PASS: mtf.maxAbs 1.82e-8 (3 of 3) | PASS: mtf.maxAbs 3.39e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: mtf.maxAbs 1.06e-8 (3 of 3) | PASS: mtf.maxAbs 1.06e-8 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: mtf.maxAbs 1.78e-8 (3 of 3) | PASS: mtf.maxAbs 1.78e-8 (3 of 3) | PASS: mtf.maxAbs 3.27e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.07e-8 (3 of 3) | PASS: mtf.maxAbs 1.07e-8 (3 of 3) | PASS: mtf.maxAbs 2.56e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: mtf.maxAbs 1.19e-8 (3 of 3) | PASS: mtf.maxAbs 1.19e-8 (3 of 3) | PASS: mtf.maxAbs 1.20e-11 (3 of 3) |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: mtf.maxAbs 4.89e-9 (3 of 3) | PASS: mtf.maxAbs 4.90e-9 (3 of 3) | PASS: mtf.maxAbs 9.49e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: mtf.maxAbs 1.64e-8 (3 of 3) | PASS: mtf.maxAbs 1.64e-8 (3 of 3) | PASS: mtf.maxAbs 6.38e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: mtf.maxAbs 9.36e-9 (3 of 3) | PASS: mtf.maxAbs 9.36e-9 (3 of 3) | PASS: mtf.maxAbs 3.94e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: mtf.maxAbs 2.01e-8 (3 of 3) | PASS: mtf.maxAbs 2.01e-8 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: mtf.maxAbs 9.04e-9 (3 of 3) | PASS: mtf.maxAbs 9.04e-9 (3 of 3) | PASS: mtf.maxAbs 4.42e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: mtf.maxAbs 2.63e-8 (3 of 3) | PASS: mtf.maxAbs 2.63e-8 (3 of 3) | PASS: mtf.maxAbs 8.49e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: mtf.maxAbs 2.18e-8 (3 of 3) | PASS: mtf.maxAbs 2.18e-8 (3 of 3) | PASS: mtf.maxAbs 8.17e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: mtf.maxAbs 2.12e-8 (3 of 3) | PASS: mtf.maxAbs 2.12e-8 (3 of 3) | PASS: mtf.maxAbs 6.05e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: mtf.maxAbs 1.69e-8 (3 of 3) | PASS: mtf.maxAbs 1.69e-8 (3 of 3) | PASS: mtf.maxAbs 7.61e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: mtf.maxAbs 1.58e-8 (3 of 3) | PASS: mtf.maxAbs 1.58e-8 (3 of 3) | PASS: mtf.maxAbs 9.14e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.79e-8 (3 of 3) | PASS: mtf.maxAbs 1.79e-8 (3 of 3) | PASS: mtf.maxAbs 3.95e-12 (3 of 3) |
| nikon-z-mc-105f28-best-ref | 3 | PASS: mtf.maxAbs 1.59e-8 (3 of 3) | PASS: mtf.maxAbs 1.59e-8 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: mtf.maxAbs 1.03e-8 (3 of 3) | PASS: mtf.maxAbs 1.03e-8 (3 of 3) | PASS: mtf.maxAbs 5.45e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: mtf.maxAbs 2.44e-8 (3 of 3) | PASS: mtf.maxAbs 2.44e-8 (3 of 3) | PASS: mtf.maxAbs 9.60e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: mtf.maxAbs 2.11e-8 (3 of 3) | PASS: mtf.maxAbs 2.11e-8 (3 of 3) | PASS: mtf.maxAbs 6.50e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: mtf.maxAbs 2.13e-8 (3 of 3) | PASS: mtf.maxAbs 2.13e-8 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.29e-8 (3 of 3) | PASS: mtf.maxAbs 2.29e-8 (3 of 3) | PASS: mtf.maxAbs 5.62e-13 (3 of 3) |
| nikon-z-135f18-plena-best-ref | 3 | PASS: mtf.maxAbs 1.45e-8 (3 of 3) | PASS: mtf.maxAbs 1.45e-8 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: mtf.maxAbs 1.13e-8 (3 of 3) | PASS: mtf.maxAbs 1.13e-8 (3 of 3) | PASS: mtf.maxAbs 2.34e-12 (3 of 3) |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: mtf.maxAbs 7.63e-9 (3 of 3) | PASS: mtf.maxAbs 7.63e-9 (3 of 3) | PASS: mtf.maxAbs 8.29e-13 (3 of 3) |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: mtf.maxAbs 7.58e-9 (3 of 3) | PASS: mtf.maxAbs 7.57e-9 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: mtf.maxAbs 7.69e-9 (3 of 3) | PASS: mtf.maxAbs 7.69e-9 (3 of 3) | PASS: mtf.maxAbs 9.42e-13 (3 of 3) |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: mtf.maxAbs 7.66e-9 (3 of 3) | PASS: mtf.maxAbs 7.66e-9 (3 of 3) | PASS: mtf.maxAbs 1.52e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: mtf.maxAbs 1.73e-8 (3 of 3) | PASS: mtf.maxAbs 1.73e-8 (3 of 3) | PASS: mtf.maxAbs 8.47e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: mtf.maxAbs 1.41e-8 (3 of 3) | PASS: mtf.maxAbs 1.41e-8 (3 of 3) | PASS: mtf.maxAbs 7.32e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: mtf.maxAbs 4.73e-8 (3 of 3) | PASS: mtf.maxAbs 4.73e-8 (3 of 3) | PASS: mtf.maxAbs 7.08e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: mtf.maxAbs 1.53e-8 (3 of 3) | PASS: mtf.maxAbs 1.52e-8 (3 of 3) | PASS: mtf.maxAbs 3.77e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: mtf.maxAbs 5.39e-8 (3 of 3) | PASS: mtf.maxAbs 5.39e-8 (3 of 3) | PASS: mtf.maxAbs 6.51e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.60e-8 (3 of 3) | PASS: mtf.maxAbs 2.60e-8 (3 of 3) | PASS: mtf.maxAbs 3.98e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.25e-14 | 96 of 96 | nikkor-z50f12-best-ref | cut sagittal, field 5.00e-1, frequencyPerMm 6 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 96 of 96 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 96 of 96 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| canon-ef-135-f2l-usm-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| nikkor-z50f12-ref | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| nikkor-z50f12-photopic | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| sony-fe-20mm-f18-g-ref | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| sony-fe-20mm-f18-g-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-ref | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-ref | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| nikon-z-24-70f4s-wide-photopic | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-ref | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-photopic | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| nikon-z-mc-105f28-ref | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| nikon-z-mc-105f28-photopic | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-135f18-plena-ref | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| nikon-z-135f18-plena-photopic | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| canon-ef-135-f2l-usm-best-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| canon-ef-135-f2l-usm-best-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-ref | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikkor-z50f12-best-ref | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| nikkor-z50f12-best-photopic | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikkor-z50f12-f8-ref | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| nikkor-z50f12-f8-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikkor-z50f12-f8-best-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikkor-z50f12-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| sony-fe-20mm-f18-g-best-photopic | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-ref | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-best-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-best-ref | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-best-photopic | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-ref | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-mc-105f28-best-ref | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| nikon-z-mc-105f28-best-photopic | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-ref | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-best-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-135f18-plena-best-ref | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| nikon-z-135f18-plena-best-photopic | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-best-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |

## r5

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | chiefLanding.maxAbs [mm] | 8.83e-10 | 48 of 96 | sony-fe-20mm-f18-g-f8-best-ref | field 1 |
| lv – optiland | mtfOnAxis.maxAbs | 2.74e-2 | 47 of 96 | sony-fe-20mm-f18-g-ref | cut sagittal, field 0, frequencyPerMm 60 |
| lv – optiland | mtfOffAxis.maxAbs | 3.14e-1 | 45 of 96 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1, frequencyPerMm 50 |
| lv – optiland | mtfOnAxis.firstStepMaxAbs | 2.73e-2 | 15 of 96 | sony-fe-20mm-f18-g-ref | cut sagittal, field 0, frequencyPerMm 60 |
| lv – optiland | mtfOffAxis.firstStepMaxAbs | 3.14e-1 | 13 of 96 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1, frequencyPerMm 50 |
| lv – optiland | fields.compared [elements] | 132 | 48 of 96 | — | — |
| lv – optiland | fields.flagged [elements] | 2 | 48 of 96 | — | — |
| lv – optiland | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| lv – optiland | fields.data [elements] | 0 | 48 of 96 | — | — |
| lv – optiland | fields.unavailable [elements] | 10 | 48 of 96 | — | — |
| lv – optiland | mtfFlagged.maxAbs | 7.38e-2 | 1 of 96 | nikkor-z50f12-ref | cut tangential, field 5.00e-1, frequencyPerMm 20 |
| lv – wave | chiefLanding.maxAbs [mm] | 0 | 96 of 96 | canon-ef-135-f2l-usm-ref | field 0 |
| lv – wave | mtfOnAxis.maxAbs | 7.54e-3 | 74 of 96 | nikon-z-24-70f4s-tele-ref | cut sagittal, field 0, frequencyPerMm 40 |
| lv – wave | mtfOffAxis.maxAbs | 7.88e-3 | 75 of 96 | canon-ef-135-f2l-usm-ref | cut tangential, field 5.00e-1, frequencyPerMm 100 |
| lv – wave | fields.compared [elements] | 208 | 96 of 96 | — | — |
| lv – wave | fields.flagged [elements] | 80 | 96 of 96 | — | — |
| lv – wave | fields.rimLost [elements] | 0 | 96 of 96 | — | — |
| lv – wave | fields.data [elements] | 0 | 96 of 96 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |
| lv – wave | mtfFlagged.maxAbs | 1.67e-2 | 41 of 96 | sigma-35mm-f14-dg-hsm-a-photopic | cut tangential, field 1, frequencyPerMm 60 |
| optiland – wave | chiefLanding.maxAbs [mm] | 8.83e-10 | 48 of 96 | sony-fe-20mm-f18-g-f8-best-ref | field 1 |
| optiland – wave | mtfOnAxis.maxAbs | 1.33e-2 | 38 of 96 | nikkor-z50f12-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| optiland – wave | mtfOffAxis.maxAbs | 8.06e-2 | 40 of 96 | nikon-z-24-70f4s-wide-ref | cut tangential, field 1, frequencyPerMm 20 |
| optiland – wave | mtfOnAxis.firstStepMaxAbs | 1.37e-2 | 9 of 96 | nikkor-z50f12-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| optiland – wave | mtfOffAxis.firstStepMaxAbs | 8.06e-2 | 10 of 96 | nikon-z-24-70f4s-wide-ref | cut tangential, field 1, frequencyPerMm 20 |
| optiland – wave | fields.compared [elements] | 108 | 48 of 96 | — | — |
| optiland – wave | fields.flagged [elements] | 26 | 48 of 96 | — | — |
| optiland – wave | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| optiland – wave | fields.data [elements] | 0 | 48 of 96 | — | — |
| optiland – wave | fields.unavailable [elements] | 10 | 48 of 96 | — | — |
| optiland – wave | mtfFlagged.maxAbs | 3.14e-1 | 18 of 96 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1, frequencyPerMm 50 |

The engines' own MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a tolerance.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Requests without a table, by what the two engines came to:

| Verdict | Requests | Runs | Reason |
|---|---|---|---|
| UNSUPPORTED | 48 | 48 | optiland is unsupported (feature lines.polychromatic) |

A row is one field and cut of one run, at 10, 30, 50 cycles/mm. Under each engine is what it says of the field
(`optiland` with the step its row is of, where it was asked again); the third estimate is the comparator's
(`wave`). The status is the gravest of the row's frequencies; "all" is what the two engines came to over
every frequency of the request.

Rows by status: 231 RECORDED, 33 ATTENTION, 4 SET ASIDE, 20 UNSUPPORTED.

| Run | Field | Cut | lv | optiland | wave | Class | Status | All | lv 10 | optiland 10 | wave 10 | Δ 10 | lv 30 | optiland 30 | wave 30 | Δ 30 | lv 50 | optiland 50 | wave 50 | Δ 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9837 | 0.9835 | 0.9835 | 1.30e-4 | 0.9452 | 0.9445 | 0.9442 | 6.41e-4 | 0.9011 | 0.8995 | 0.8989 | 1.66e-3 |
| canon-ef-135-f2l-usm-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9837 | 0.9835 | 0.9835 | 1.30e-4 | 0.9452 | 0.9445 | 0.9442 | 6.41e-4 | 0.9011 | 0.8995 | 0.8989 | 1.66e-3 |
| canon-ef-135-f2l-usm-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9694 | 0.9693 | 0.9692 | 8.97e-5 | 0.8333 | 0.8329 | 0.8326 | 4.31e-4 | 0.6278 | 0.6270 | 0.6260 | 8.65e-4 |
| canon-ef-135-f2l-usm-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9709 | 0.9706 | 0.9711 | 3.09e-4 | 0.8700 | 0.8684 | 0.8704 | 1.58e-3 | 0.7281 | 0.7246 | 0.7274 | 3.46e-3 |
| canon-ef-135-f2l-usm-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9375 | 0.9372 | 0.9377 | 2.87e-4 | 0.6792 | 0.6750 | 0.6794 | 4.17e-3 | 0.4171 | 0.4075 | 0.4171 | 9.54e-3 |
| canon-ef-135-f2l-usm-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9396 | 0.9389 | 0.9396 | 6.82e-4 | 0.7145 | 0.7133 | 0.7146 | 1.28e-3 | 0.4420 | 0.4394 | 0.4423 | 2.64e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9462 | 0.9457 | 0.9460 | 4.51e-4 | 0.6797 | 0.6770 | 0.6790 | 2.71e-3 | 0.3433 | 0.3389 | 0.3420 | 4.39e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9462 | 0.9457 | 0.9460 | 4.51e-4 | 0.6797 | 0.6770 | 0.6790 | 2.71e-3 | 0.3433 | 0.3389 | 0.3420 | 4.39e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8820 | 0.8815 | 0.8825 | 4.48e-4 | 0.3400 | 0.3354 | 0.3406 | 4.56e-3 | 0.0955 | 0.1021 | 0.0957 | -6.60e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8702 | 0.8722 | 0.8709 | -1.98e-3 | 0.6117 | 0.6155 | 0.6122 | -3.76e-3 | 0.4297 | 0.4260 | 0.4296 | 3.76e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6622 | 0.6675 | 0.6640 | -5.33e-3 | 0.4611 | 0.4629 | 0.4575 | -1.77e-3 | 0.3479 | 0.3498 | 0.3447 | -1.85e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8985 | 0.9017 | 0.8983 | -3.15e-3 | 0.6239 | 0.6353 | 0.6239 | -1.14e-2 | 0.3820 | 0.4039 | 0.3854 | -2.19e-2 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9872 | 0.9871 | 0.9871 | 1.28e-4 | 0.9518 | 0.9516 | 0.9513 | 1.94e-4 | 0.9051 | 0.9049 | 0.9040 | 1.99e-4 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9872 | 0.9871 | 0.9871 | 1.28e-4 | 0.9518 | 0.9516 | 0.9513 | 1.94e-4 | 0.9051 | 0.9049 | 0.9040 | 1.99e-4 |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.9212 | — | 0.9225 | — | 0.6323 | — | 0.6322 | — | 0.3233 | — | 0.3236 | — |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.9576 | — | 0.9586 | — | 0.7875 | — | 0.7881 | — | 0.6168 | — | 0.6164 | — |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.5213 | — | 0.5195 | — | 0.3797 | — | 0.3779 | — | 0.3269 | — | 0.3234 | — |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.6838 | — | 0.6795 | — | 0.4873 | — | 0.4808 | — | 0.3636 | — | 0.3592 | — |
| nikkor-z50f12-ref | 0 | sagittal | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8061 | 0.8097 | 0.8064 | -3.57e-3 | 0.1714 | 0.1657 | 0.1722 | 5.71e-3 | 0.1915 | 0.1558 | 0.1924 | 3.57e-2 |
| nikkor-z50f12-ref | 0 | tangential | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8061 | 0.8097 | 0.8064 | -3.57e-3 | 0.1714 | 0.1657 | 0.1722 | 5.71e-3 | 0.1915 | 0.1558 | 0.1924 | 3.57e-2 |
| nikkor-z50f12-ref | 0.5 | sagittal | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8733 | 0.8719 | 0.8747 | 1.43e-3 | 0.2426 | 0.2457 | 0.2425 | -3.10e-3 | 0.1799 | 0.1873 | 0.1803 | -7.42e-3 |
| nikkor-z50f12-ref | 0.5 | tangential | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8068 | 0.8486 | 0.8101 | -4.19e-2 | 0.4069 | 0.4495 | 0.4068 | -4.26e-2 | 0.3036 | 0.3356 | 0.3050 | -3.20e-2 |
| nikkor-z50f12-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8157 | — | 0.8155 | — | 0.1692 | — | 0.1667 | — | 0.1388 | — | 0.1357 | — |
| nikkor-z50f12-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8607 | — | 0.8614 | — | 0.5754 | — | 0.5716 | — | 0.3594 | — | 0.3624 | — |
| sony-fe-20mm-f18-g-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8995 | 0.9055 | 0.9012 | -6.07e-3 | 0.5678 | 0.5666 | 0.5686 | 1.12e-3 | 0.4194 | 0.3934 | 0.4183 | 2.60e-2 |
| sony-fe-20mm-f18-g-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8995 | 0.9055 | 0.9012 | -6.07e-3 | 0.5678 | 0.5666 | 0.5686 | 1.12e-3 | 0.4194 | 0.3934 | 0.4183 | 2.60e-2 |
| sony-fe-20mm-f18-g-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.6544 | 0.6669 | 0.6596 | -1.25e-2 | 0.0221 | 0.0137 | 0.0203 | 8.39e-3 | 0.0088 | 0.0221 | 0.0094 | -1.32e-2 |
| sony-fe-20mm-f18-g-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.4619 | 0.4728 | 0.4612 | -1.09e-2 | 0.1194 | 0.1575 | 0.1227 | -3.81e-2 | 0.0808 | 0.1101 | 0.0796 | -2.94e-2 |
| sony-fe-20mm-f18-g-ref | 1 | sagittal | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.3041 | — | 0.3052 | — | 0.1107 | — | 0.1118 | — | 0.0463 | — | 0.0468 | — |
| sony-fe-20mm-f18-g-ref | 1 | tangential | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.1314 | — | 0.1333 | — | 0.0925 | — | 0.0930 | — | 0.0612 | — | 0.0623 | — |
| sony-fe-400mm-f28-gm-oss-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9307 | 0.9320 | 0.9314 | -1.26e-3 | 0.6036 | 0.6078 | 0.6053 | -4.15e-3 | 0.2470 | 0.2488 | 0.2498 | -1.80e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9307 | 0.9320 | 0.9314 | -1.26e-3 | 0.6036 | 0.6078 | 0.6053 | -4.15e-3 | 0.2470 | 0.2488 | 0.2498 | -1.80e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9248 | 0.9250 | 0.9248 | -2.67e-4 | 0.5768 | 0.5762 | 0.5769 | 5.84e-4 | 0.2312 | 0.2251 | 0.2312 | 6.06e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9302 | 0.9293 | 0.9301 | 9.08e-4 | 0.6218 | 0.6185 | 0.6218 | 3.30e-3 | 0.3107 | 0.3072 | 0.3107 | 3.45e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9330 | 0.9319 | 0.9329 | 1.10e-3 | 0.6424 | 0.6328 | 0.6406 | 9.66e-3 | 0.3510 | 0.3317 | 0.3477 | 1.92e-2 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9424 | 0.9410 | 0.9419 | 1.39e-3 | 0.7914 | 0.7887 | 0.7917 | 2.71e-3 | 0.6353 | 0.6320 | 0.6364 | 3.29e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9702 | 0.9704 | 0.9702 | -1.83e-4 | 0.8938 | 0.8940 | 0.8938 | -2.79e-4 | 0.8254 | 0.8248 | 0.8252 | 6.79e-4 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9702 | 0.9704 | 0.9702 | -1.83e-4 | 0.8938 | 0.8940 | 0.8938 | -2.79e-4 | 0.8254 | 0.8248 | 0.8252 | 6.79e-4 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9430 | 0.9455 | 0.9454 | -2.50e-3 | 0.7022 | 0.7117 | 0.7131 | -9.48e-3 | 0.4257 | 0.4311 | 0.4384 | -5.34e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8958 | 0.8980 | 0.8981 | -2.14e-3 | 0.4657 | 0.4612 | 0.4728 | 4.55e-3 | 0.1491 | 0.1156 | 0.1498 | 3.35e-2 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9492 | 0.9485 | 0.9503 | 7.19e-4 | 0.7651 | 0.7577 | 0.7679 | 7.45e-3 | 0.5596 | 0.5430 | 0.5636 | 1.66e-2 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8994 | 0.8861 | 0.8997 | 1.32e-2 | 0.5391 | 0.5069 | 0.5429 | 3.22e-2 | 0.3264 | 0.3230 | 0.3264 | 3.39e-3 |
| nikon-z-24-70f4s-wide-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9218 | 0.9227 | 0.9219 | -8.88e-4 | 0.6415 | 0.6437 | 0.6415 | -2.20e-3 | 0.4102 | 0.4104 | 0.4095 | -1.53e-4 |
| nikon-z-24-70f4s-wide-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9218 | 0.9227 | 0.9219 | -8.88e-4 | 0.6415 | 0.6437 | 0.6415 | -2.20e-3 | 0.4102 | 0.4104 | 0.4095 | -1.53e-4 |
| nikon-z-24-70f4s-wide-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9267 | 0.9278 | 0.9277 | -1.10e-3 | 0.6596 | 0.6643 | 0.6633 | -4.79e-3 | 0.4227 | 0.4280 | 0.4267 | -5.27e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9460 | 0.9472 | 0.9479 | -1.27e-3 | 0.7887 | 0.7927 | 0.7949 | -4.00e-3 | 0.6486 | 0.6473 | 0.6509 | 1.29e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.7899 | 0.7893 | 0.7900 | 6.09e-4 | 0.0297 | 0.0330 | 0.0309 | -3.34e-3 | 0.2656 | 0.2721 | 0.2655 | -6.49e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.6920 | 0.7528 | 0.6929 | -6.08e-2 | 0.2399 | 0.3034 | 0.2383 | -6.35e-2 | 0.1210 | 0.1617 | 0.1191 | -4.07e-2 |
| nikon-z-24-70f4s-tele-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9645 | 0.9667 | 0.9664 | -2.15e-3 | 0.8885 | 0.8933 | 0.8930 | -4.83e-3 | 0.8051 | 0.8120 | 0.8118 | -6.95e-3 |
| nikon-z-24-70f4s-tele-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9645 | 0.9667 | 0.9664 | -2.15e-3 | 0.8885 | 0.8933 | 0.8930 | -4.83e-3 | 0.8051 | 0.8120 | 0.8118 | -6.95e-3 |
| nikon-z-24-70f4s-tele-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9060 | 0.9058 | 0.9067 | 2.00e-4 | 0.6488 | 0.6402 | 0.6490 | 8.59e-3 | 0.4928 | 0.4800 | 0.4925 | 1.28e-2 |
| nikon-z-24-70f4s-tele-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9399 | 0.9407 | 0.9399 | -8.83e-4 | 0.7507 | 0.7498 | 0.7508 | 8.40e-4 | 0.5381 | 0.5364 | 0.5379 | 1.73e-3 |
| nikon-z-24-70f4s-tele-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.6332 | 0.6239 | 0.6330 | 9.31e-3 | 0.4409 | 0.4283 | 0.4405 | 1.25e-2 | 0.3555 | 0.3472 | 0.3559 | 8.33e-3 |
| nikon-z-24-70f4s-tele-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8876 | 0.9426 | 0.8879 | -5.50e-2 | 0.5752 | 0.7932 | 0.5756 | -2.18e-1 | 0.3120 | 0.6261 | 0.3124 | -3.14e-1 |
| nikon-z-mc-105f28-ref | 0 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9642 | 0.9642 | 0.9638 | 7.90e-6 | 0.8186 | 0.8182 | 0.8158 | 3.89e-4 | 0.6156 | 0.6138 | 0.6110 | 1.77e-3 |
| nikon-z-mc-105f28-ref | 0 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9642 | 0.9642 | 0.9638 | 7.90e-6 | 0.8186 | 0.8182 | 0.8158 | 3.89e-4 | 0.6156 | 0.6138 | 0.6110 | 1.77e-3 |
| nikon-z-mc-105f28-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9652 | 0.9648 | 0.9645 | 3.46e-4 | 0.8386 | 0.8371 | 0.8364 | 1.48e-3 | 0.6870 | 0.6846 | 0.6850 | 2.37e-3 |
| nikon-z-mc-105f28-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9687 | 0.9688 | 0.9686 | -1.30e-4 | 0.8941 | 0.8944 | 0.8938 | -3.63e-4 | 0.8103 | 0.8111 | 0.8101 | -8.43e-4 |
| nikon-z-mc-105f28-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8388 | 0.8363 | 0.8389 | 2.47e-3 | 0.4273 | 0.4174 | 0.4271 | 9.89e-3 | 0.3315 | 0.3255 | 0.3317 | 5.93e-3 |
| nikon-z-mc-105f28-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9068 | 0.9055 | 0.9069 | 1.36e-3 | 0.6272 | 0.6228 | 0.6272 | 4.35e-3 | 0.3902 | 0.3853 | 0.3903 | 4.86e-3 |
| nikon-z-135f18-plena-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9718 | 0.9729 | 0.9722 | -1.06e-3 | 0.8588 | 0.8654 | 0.8616 | -6.59e-3 | 0.7325 | 0.7392 | 0.7371 | -6.65e-3 |
| nikon-z-135f18-plena-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9718 | 0.9729 | 0.9722 | -1.06e-3 | 0.8588 | 0.8654 | 0.8616 | -6.59e-3 | 0.7325 | 0.7392 | 0.7371 | -6.65e-3 |
| nikon-z-135f18-plena-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9559 | 0.9581 | 0.9567 | -2.21e-3 | 0.7555 | 0.7647 | 0.7602 | -9.28e-3 | 0.5449 | 0.5450 | 0.5491 | -8.50e-5 |
| nikon-z-135f18-plena-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9736 | 0.9741 | 0.9730 | -4.96e-4 | 0.8814 | 0.8848 | 0.8805 | -3.43e-3 | 0.7894 | 0.7915 | 0.7878 | -2.06e-3 |
| nikon-z-135f18-plena-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9178 | 0.9215 | 0.9180 | -3.68e-3 | 0.5368 | 0.5411 | 0.5361 | -4.36e-3 | 0.2016 | 0.1795 | 0.2010 | 2.21e-2 |
| nikon-z-135f18-plena-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8479 | 0.8498 | 0.8500 | -1.88e-3 | 0.4539 | 0.4413 | 0.4540 | 1.26e-2 | 0.3133 | 0.3025 | 0.3125 | 1.08e-2 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9236 | 0.9243 | 0.9234 | -6.91e-4 | 0.7343 | 0.7372 | 0.7326 | -2.94e-3 | 0.6307 | 0.6330 | 0.6294 | -2.27e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9236 | 0.9243 | 0.9234 | -6.91e-4 | 0.7343 | 0.7372 | 0.7326 | -2.94e-3 | 0.6307 | 0.6330 | 0.6294 | -2.27e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9185 | 0.9201 | 0.9194 | -1.59e-3 | 0.6214 | 0.6278 | 0.6217 | -6.39e-3 | 0.3308 | 0.3374 | 0.3303 | -6.58e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9434 | 0.9442 | 0.9441 | -7.77e-4 | 0.7794 | 0.7812 | 0.7797 | -1.82e-3 | 0.6022 | 0.6020 | 0.6019 | 1.34e-4 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | sagittal | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8068 | — | 0.8051 | — | 0.4126 | — | 0.4072 | — | 0.3744 | — | 0.3731 | — |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | tangential | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8239 | — | 0.8250 | — | 0.3750 | — | 0.3738 | — | 0.1458 | — | 0.1428 | — |
| canon-ef-135-f2l-usm-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9841 | 0.9840 | 0.9839 | 1.33e-4 | 0.9489 | 0.9485 | 0.9483 | 4.21e-4 | 0.9102 | 0.9092 | 0.9088 | 9.96e-4 |
| canon-ef-135-f2l-usm-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9841 | 0.9840 | 0.9839 | 1.33e-4 | 0.9489 | 0.9485 | 0.9483 | 4.21e-4 | 0.9102 | 0.9092 | 0.9088 | 9.96e-4 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9659 | 0.9659 | 0.9659 | 4.80e-5 | 0.8058 | 0.8057 | 0.8057 | 9.77e-5 | 0.5635 | 0.5646 | 0.5637 | -1.07e-3 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9698 | 0.9691 | 0.9698 | 7.01e-4 | 0.8588 | 0.8563 | 0.8586 | 2.53e-3 | 0.6991 | 0.6959 | 0.6992 | 3.12e-3 |
| canon-ef-135-f2l-usm-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9388 | 0.9383 | 0.9389 | 4.50e-4 | 0.6791 | 0.6753 | 0.6794 | 3.88e-3 | 0.4061 | 0.3981 | 0.4061 | 8.03e-3 |
| canon-ef-135-f2l-usm-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9388 | 0.9377 | 0.9387 | 1.03e-3 | 0.7083 | 0.7063 | 0.7083 | 1.98e-3 | 0.4287 | 0.4256 | 0.4290 | 3.17e-3 |
| canon-ef-135-f2l-usm-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9425 | 0.9420 | 0.9416 | 4.89e-4 | 0.8274 | 0.8260 | 0.8246 | 1.34e-3 | 0.7122 | 0.7115 | 0.7104 | 6.75e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9425 | 0.9420 | 0.9416 | 4.89e-4 | 0.8274 | 0.8260 | 0.8246 | 1.34e-3 | 0.7122 | 0.7115 | 0.7104 | 6.75e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9365 | 0.9368 | 2.76e-4 | 0.7920 | 0.7916 | 0.7920 | 4.16e-4 | 0.6461 | 0.6473 | 0.6473 | -1.19e-3 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9364 | 0.9364 | 0.9364 | 5.37e-5 | 0.7913 | 0.7912 | 0.7910 | 8.60e-5 | 0.6452 | 0.6467 | 0.6465 | -1.49e-3 |
| canon-ef-135-f2l-usm-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9269 | 0.9272 | 0.9270 | -2.67e-4 | 0.7322 | 0.7333 | 0.7325 | -1.09e-3 | 0.5416 | 0.5422 | 0.5411 | -5.65e-4 |
| canon-ef-135-f2l-usm-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9199 | 0.9195 | 0.9198 | 3.31e-4 | 0.6888 | 0.6880 | 0.6884 | 7.39e-4 | 0.4647 | 0.4649 | 0.4644 | -1.50e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9426 | 0.9421 | 0.9416 | 4.90e-4 | 0.8277 | 0.8263 | 0.8249 | 1.35e-3 | 0.7128 | 0.7121 | 0.7110 | 6.96e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9426 | 0.9421 | 0.9416 | 4.90e-4 | 0.8277 | 0.8263 | 0.8249 | 1.35e-3 | 0.7128 | 0.7121 | 0.7110 | 6.96e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9379 | 0.9376 | 0.9378 | 2.88e-4 | 0.7985 | 0.7980 | 0.7985 | 5.09e-4 | 0.6580 | 0.6590 | 0.6591 | -9.80e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9374 | 0.9374 | 0.9374 | 5.09e-5 | 0.7975 | 0.7974 | 0.7973 | 7.79e-5 | 0.6568 | 0.6583 | 0.6581 | -1.50e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9286 | 0.9288 | 0.9287 | -2.50e-4 | 0.7425 | 0.7435 | 0.7427 | -9.64e-4 | 0.5595 | 0.5598 | 0.5587 | -3.51e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9219 | 0.9216 | 0.9219 | 3.30e-4 | 0.7010 | 0.7003 | 0.7007 | 7.43e-4 | 0.4849 | 0.4850 | 0.4847 | -1.81e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9731 | 0.9733 | 0.9732 | -2.18e-4 | 0.9059 | 0.9071 | 0.9066 | -1.19e-3 | 0.8349 | 0.8359 | 0.8354 | -9.98e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9731 | 0.9733 | 0.9732 | -2.18e-4 | 0.9059 | 0.9071 | 0.9066 | -1.19e-3 | 0.8349 | 0.8359 | 0.8354 | -9.98e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9118 | 0.9124 | 0.9126 | -6.28e-4 | 0.6227 | 0.6227 | 0.6227 | 2.79e-5 | 0.3346 | 0.3319 | 0.3340 | 2.71e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8612 | 0.8639 | 0.8617 | -2.65e-3 | 0.7185 | 0.7268 | 0.7192 | -8.29e-3 | 0.6257 | 0.6310 | 0.6260 | -5.30e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6050 | 0.6095 | 0.6071 | -4.49e-3 | 0.3740 | 0.3770 | 0.3720 | -3.00e-3 | 0.2774 | 0.2762 | 0.2777 | 1.20e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9059 | 0.9093 | 0.9060 | -3.43e-3 | 0.6101 | 0.6271 | 0.6105 | -1.70e-2 | 0.3254 | 0.3537 | 0.3285 | -2.82e-2 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9399 | 0.9395 | 0.9396 | 3.54e-4 | 0.8185 | 0.8177 | 0.8176 | 8.13e-4 | 0.6980 | 0.6984 | 0.6983 | -3.79e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9399 | 0.9395 | 0.9396 | 3.54e-4 | 0.8185 | 0.8177 | 0.8176 | 8.13e-4 | 0.6980 | 0.6984 | 0.6983 | -3.79e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9216 | 0.9217 | 0.9216 | -6.02e-5 | 0.7133 | 0.7145 | 0.7137 | -1.19e-3 | 0.5158 | 0.5198 | 0.5184 | -3.97e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9357 | 0.9356 | 0.9356 | 8.02e-5 | 0.8040 | 0.8040 | 0.8038 | -4.48e-5 | 0.6744 | 0.6764 | 0.6764 | -1.95e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9327 | 0.9328 | 0.9324 | -1.32e-4 | 0.7881 | 0.7888 | 0.7888 | -6.76e-4 | 0.6491 | 0.6496 | 0.6490 | -5.04e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9218 | 0.9218 | 0.9214 | 2.36e-5 | 0.7445 | 0.7451 | 0.7436 | -6.16e-4 | 0.5721 | 0.5732 | 0.5723 | -1.17e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9401 | 0.9401 | 3.76e-4 | 0.8210 | 0.8201 | 0.8200 | 9.46e-4 | 0.7015 | 0.7017 | 0.7016 | -1.50e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9401 | 0.9401 | 3.76e-4 | 0.8210 | 0.8201 | 0.8200 | 9.46e-4 | 0.7015 | 0.7017 | 0.7016 | -1.50e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9274 | 0.9274 | 0.9274 | -1.68e-5 | 0.7470 | 0.7478 | 0.7474 | -8.05e-4 | 0.5724 | 0.5758 | 0.5750 | -3.35e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9364 | 0.9364 | 0.9364 | 5.14e-5 | 0.8076 | 0.8078 | 0.8076 | -1.53e-4 | 0.6800 | 0.6821 | 0.6822 | -2.18e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9330 | 0.9332 | 0.9327 | -1.92e-4 | 0.7910 | 0.7920 | 0.7920 | -9.82e-4 | 0.6551 | 0.6559 | 0.6555 | -8.60e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9185 | 0.9185 | 0.9182 | -1.45e-5 | 0.7238 | 0.7246 | 0.7230 | -7.94e-4 | 0.5370 | 0.5385 | 0.5376 | -1.53e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9888 | 0.9887 | 0.9887 | 1.30e-4 | 0.9656 | 0.9652 | 0.9653 | 3.89e-4 | 0.9413 | 0.9405 | 0.9407 | 7.13e-4 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9888 | 0.9887 | 0.9887 | 1.30e-4 | 0.9656 | 0.9652 | 0.9653 | 3.89e-4 | 0.9413 | 0.9405 | 0.9407 | 7.13e-4 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.9209 | — | 0.9202 | — | 0.6584 | — | 0.6587 | — | 0.4093 | — | 0.4089 | — |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.9508 | — | 0.9518 | — | 0.7502 | — | 0.7496 | — | 0.5514 | — | 0.5485 | — |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.5125 | — | 0.5107 | — | 0.3671 | — | 0.3653 | — | 0.3131 | — | 0.3093 | — |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.6838 | — | 0.6795 | — | 0.4909 | — | 0.4836 | — | 0.3721 | — | 0.3650 | — |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9425 | 0.9421 | 0.9419 | 4.30e-4 | 0.8276 | 0.8264 | 0.8257 | 1.18e-3 | 0.7127 | 0.7123 | 0.7123 | 4.03e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9425 | 0.9421 | 0.9419 | 4.30e-4 | 0.8276 | 0.8264 | 0.8257 | 1.18e-3 | 0.7127 | 0.7123 | 0.7123 | 4.03e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9326 | 0.9329 | 0.9326 | -2.86e-4 | 0.7698 | 0.7708 | 0.7698 | -9.89e-4 | 0.6090 | 0.6098 | 0.6090 | -8.36e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9396 | 0.9393 | 0.9396 | 3.05e-4 | 0.8177 | 0.8170 | 0.8177 | 7.38e-4 | 0.6964 | 0.6964 | 0.6964 | -2.84e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9383 | 0.9383 | 0.9382 | -7.76e-5 | 0.8129 | 0.8131 | 0.8126 | -1.70e-4 | 0.6888 | 0.6891 | 0.6886 | -3.12e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.8719 | 0.8724 | 0.8731 | -4.46e-4 | 0.6202 | 0.6203 | 0.6212 | -1.32e-4 | 0.3882 | 0.3879 | 0.3893 | 3.21e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9425 | 0.9421 | 0.9419 | 4.30e-4 | 0.8276 | 0.8264 | 0.8257 | 1.18e-3 | 0.7127 | 0.7123 | 0.7123 | 4.03e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9425 | 0.9421 | 0.9419 | 4.30e-4 | 0.8276 | 0.8264 | 0.8257 | 1.18e-3 | 0.7127 | 0.7123 | 0.7123 | 4.03e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9324 | 0.9327 | 0.9324 | -2.86e-4 | 0.7686 | 0.7696 | 0.7686 | -9.91e-4 | 0.6068 | 0.6077 | 0.6068 | -8.41e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9397 | 0.9393 | 0.9396 | 3.05e-4 | 0.8180 | 0.8172 | 0.8179 | 7.40e-4 | 0.6968 | 0.6968 | 0.6968 | -2.55e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9382 | 0.9383 | 0.9381 | -7.77e-5 | 0.8126 | 0.8128 | 0.8123 | -1.71e-4 | 0.6882 | 0.6885 | 0.6880 | -3.14e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.8720 | 0.8724 | 0.8731 | -4.46e-4 | 0.6203 | 0.6205 | 0.6214 | -1.32e-4 | 0.3883 | 0.3880 | 0.3894 | 3.20e-4 |
| nikkor-z50f12-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9825 | 0.9824 | 0.9824 | 1.04e-4 | 0.9022 | 0.9031 | 0.9018 | -8.37e-4 | 0.7774 | 0.7801 | 0.7767 | -2.66e-3 |
| nikkor-z50f12-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9825 | 0.9824 | 0.9824 | 1.04e-4 | 0.9022 | 0.9031 | 0.9018 | -8.37e-4 | 0.7774 | 0.7801 | 0.7767 | -2.66e-3 |
| nikkor-z50f12-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9346 | 0.9351 | 0.9349 | -4.80e-4 | 0.7234 | 0.7157 | 0.7242 | 7.74e-3 | 0.6374 | 0.6229 | 0.6383 | 1.46e-2 |
| nikkor-z50f12-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9455 | 0.9577 | 0.9487 | -1.23e-2 | 0.7513 | 0.7961 | 0.7511 | -4.48e-2 | 0.5699 | 0.6342 | 0.5676 | -6.42e-2 |
| nikkor-z50f12-best-ref | 1 | sagittal | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.7957 | — | 0.7939 | — | 0.5379 | — | 0.5405 | — | 0.3250 | — | 0.3235 | — |
| nikkor-z50f12-best-ref | 1 | tangential | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.8747 | — | 0.8764 | — | 0.5306 | — | 0.5302 | — | 0.2508 | — | 0.2527 | — |
| nikkor-z50f12-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9428 | 0.9424 | 0.9422 | 4.02e-4 | 0.8284 | 0.8273 | 0.8265 | 1.10e-3 | 0.7141 | 0.7138 | 0.7137 | 3.15e-4 |
| nikkor-z50f12-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9428 | 0.9424 | 0.9422 | 4.02e-4 | 0.8284 | 0.8273 | 0.8265 | 1.10e-3 | 0.7141 | 0.7138 | 0.7137 | 3.15e-4 |
| nikkor-z50f12-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9400 | 0.9396 | 0.9399 | 3.76e-4 | 0.8143 | 0.8133 | 0.8140 | 9.25e-4 | 0.6884 | 0.6885 | 0.6891 | -1.48e-4 |
| nikkor-z50f12-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9392 | 0.9391 | 0.9391 | 6.00e-5 | 0.8174 | 0.8174 | 0.8171 | -1.05e-5 | 0.6957 | 0.6975 | 0.6973 | -1.80e-3 |
| nikkor-z50f12-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9207 | 0.9199 | 0.9199 | 8.77e-4 | 0.7065 | 0.7044 | 0.7041 | 2.12e-3 | 0.5028 | 0.5005 | 0.4999 | 2.34e-3 |
| nikkor-z50f12-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9231 | 0.9231 | 0.9232 | 4.53e-5 | 0.7578 | 0.7580 | 0.7583 | -1.67e-4 | 0.5970 | 0.5989 | 0.5995 | -1.91e-3 |
| nikkor-z50f12-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9428 | 0.9424 | 0.9422 | 4.02e-4 | 0.8284 | 0.8273 | 0.8265 | 1.11e-3 | 0.7141 | 0.7138 | 0.7137 | 3.16e-4 |
| nikkor-z50f12-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9428 | 0.9424 | 0.9422 | 4.02e-4 | 0.8284 | 0.8273 | 0.8265 | 1.11e-3 | 0.7141 | 0.7138 | 0.7137 | 3.16e-4 |
| nikkor-z50f12-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9401 | 0.9397 | 0.9400 | 3.77e-4 | 0.8149 | 0.8140 | 0.8147 | 9.32e-4 | 0.6896 | 0.6897 | 0.6903 | -1.33e-4 |
| nikkor-z50f12-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9392 | 0.9391 | 0.9391 | 6.00e-5 | 0.8174 | 0.8175 | 0.8171 | -1.00e-5 | 0.6958 | 0.6976 | 0.6973 | -1.80e-3 |
| nikkor-z50f12-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9211 | 0.9202 | 0.9202 | 8.78e-4 | 0.7085 | 0.7063 | 0.7060 | 2.14e-3 | 0.5060 | 0.5036 | 0.5030 | 2.35e-3 |
| nikkor-z50f12-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9232 | 0.9232 | 0.9233 | 4.65e-5 | 0.7586 | 0.7588 | 0.7591 | -1.65e-4 | 0.5983 | 0.6002 | 0.6008 | -1.91e-3 |
| sony-fe-20mm-f18-g-best-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9626 | 0.9645 | 0.9636 | -1.99e-3 | 0.8219 | 0.8266 | 0.8230 | -4.75e-3 | 0.6655 | 0.6690 | 0.6662 | -3.44e-3 |
| sony-fe-20mm-f18-g-best-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9626 | 0.9645 | 0.9636 | -1.99e-3 | 0.8219 | 0.8266 | 0.8230 | -4.75e-3 | 0.6655 | 0.6690 | 0.6662 | -3.44e-3 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8188 | 0.8267 | 0.8235 | -7.86e-3 | 0.2790 | 0.2800 | 0.2830 | -9.57e-4 | 0.1764 | 0.1442 | 0.1749 | 3.22e-2 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6327 | 0.6374 | 0.6333 | -4.69e-3 | 0.2852 | 0.2949 | 0.2866 | -9.70e-3 | 0.1064 | 0.1092 | 0.1049 | -2.82e-3 |
| sony-fe-20mm-f18-g-best-ref | 1 | sagittal | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.5038 | — | 0.5048 | — | 0.2925 | — | 0.2927 | — | 0.0101 | — | 0.0090 | — |
| sony-fe-20mm-f18-g-best-ref | 1 | tangential | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.1353 | — | 0.1374 | — | 0.1229 | — | 0.1233 | — | 0.0728 | — | 0.0739 | — |
| sony-fe-20mm-f18-g-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9433 | 0.9428 | 0.9423 | 5.03e-4 | 0.8298 | 0.8284 | 0.8270 | 1.40e-3 | 0.7163 | 0.7155 | 0.7144 | 8.13e-4 |
| sony-fe-20mm-f18-g-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9433 | 0.9428 | 0.9423 | 5.03e-4 | 0.8298 | 0.8284 | 0.8270 | 1.40e-3 | 0.7163 | 0.7155 | 0.7144 | 8.13e-4 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9312 | 0.9314 | 0.9312 | -2.14e-4 | 0.7705 | 0.7707 | 0.7706 | -1.42e-4 | 0.6130 | 0.6137 | 0.6130 | -6.49e-4 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9169 | 0.9173 | 0.9169 | -3.87e-4 | 0.7159 | 0.7178 | 0.7161 | -1.82e-3 | 0.5329 | 0.5345 | 0.5329 | -1.68e-3 |
| sony-fe-20mm-f18-g-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8644 | 0.8651 | 0.8645 | -7.22e-4 | 0.4613 | 0.4644 | 0.4615 | -3.12e-3 | 0.1869 | 0.1897 | 0.1869 | -2.79e-3 |
| sony-fe-20mm-f18-g-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7660 | 0.7694 | 0.7661 | -3.43e-3 | 0.2893 | 0.2958 | 0.2892 | -6.52e-3 | 0.1232 | 0.1284 | 0.1231 | -5.16e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9433 | 0.9428 | 0.9423 | 5.03e-4 | 0.8298 | 0.8284 | 0.8270 | 1.40e-3 | 0.7163 | 0.7155 | 0.7144 | 8.13e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9433 | 0.9428 | 0.9423 | 5.03e-4 | 0.8298 | 0.8284 | 0.8270 | 1.40e-3 | 0.7163 | 0.7155 | 0.7144 | 8.13e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9313 | 0.9315 | 0.9313 | -2.13e-4 | 0.7711 | 0.7712 | 0.7711 | -1.39e-4 | 0.6139 | 0.6146 | 0.6140 | -6.43e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9170 | 0.9174 | 0.9170 | -3.86e-4 | 0.7165 | 0.7183 | 0.7166 | -1.81e-3 | 0.5338 | 0.5354 | 0.5338 | -1.67e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8646 | 0.8654 | 0.8648 | -7.18e-4 | 0.4623 | 0.4654 | 0.4624 | -3.11e-3 | 0.1880 | 0.1908 | 0.1880 | -2.78e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7662 | 0.7696 | 0.7663 | -3.42e-3 | 0.2898 | 0.2963 | 0.2897 | -6.51e-3 | 0.1236 | 0.1287 | 0.1234 | -5.15e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9777 | 0.9782 | 0.9784 | -5.55e-4 | 0.9326 | 0.9343 | 0.9347 | -1.64e-3 | 0.8872 | 0.8899 | 0.8906 | -2.70e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9777 | 0.9782 | 0.9784 | -5.55e-4 | 0.9326 | 0.9343 | 0.9347 | -1.64e-3 | 0.8872 | 0.8899 | 0.8906 | -2.70e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9766 | 0.9764 | 0.9764 | 2.42e-4 | 0.9249 | 0.9241 | 0.9241 | 8.48e-4 | 0.8707 | 0.8694 | 0.8693 | 1.29e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9719 | 0.9719 | 0.9725 | -1.91e-5 | 0.9077 | 0.9076 | 0.9094 | 1.11e-4 | 0.8385 | 0.8385 | 0.8414 | -9.72e-5 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9732 | 0.9724 | 0.9728 | 7.75e-4 | 0.9123 | 0.9099 | 0.9108 | 2.38e-3 | 0.8479 | 0.8447 | 0.8460 | 3.15e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9490 | 0.9473 | 0.9483 | 1.70e-3 | 0.8389 | 0.8354 | 0.8390 | 3.52e-3 | 0.7299 | 0.7271 | 0.7326 | 2.80e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9364 | 0.9360 | 4.32e-4 | 0.7937 | 0.7930 | 0.7916 | 7.70e-4 | 0.6498 | 0.6505 | 0.6496 | -7.05e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9364 | 0.9360 | 4.32e-4 | 0.7937 | 0.7930 | 0.7916 | 7.70e-4 | 0.6498 | 0.6505 | 0.6496 | -7.05e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9372 | 0.9374 | 0.9371 | -1.34e-4 | 0.7995 | 0.8003 | 0.8003 | -8.13e-4 | 0.6634 | 0.6649 | 0.6648 | -1.48e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9376 | 0.9377 | 0.9374 | -1.02e-4 | 0.8044 | 0.8049 | 0.8038 | -4.61e-4 | 0.6722 | 0.6746 | 0.6743 | -2.41e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9376 | 0.9372 | 0.9368 | 3.54e-4 | 0.8007 | 0.8003 | 0.7997 | 4.18e-4 | 0.6654 | 0.6658 | 0.6651 | -3.49e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9346 | 0.9348 | 0.9345 | -2.24e-4 | 0.7942 | 0.7955 | 0.7944 | -1.29e-3 | 0.6577 | 0.6613 | 0.6607 | -3.64e-3 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9419 | 0.9413 | 0.9409 | 5.21e-4 | 0.8256 | 0.8241 | 0.8227 | 1.43e-3 | 0.7093 | 0.7085 | 0.7075 | 7.68e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9419 | 0.9413 | 0.9409 | 5.21e-4 | 0.8256 | 0.8241 | 0.8227 | 1.43e-3 | 0.7093 | 0.7085 | 0.7075 | 7.68e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9409 | 0.9410 | 0.9407 | -7.02e-5 | 0.8222 | 0.8226 | 0.8226 | -3.54e-4 | 0.7053 | 0.7058 | 0.7056 | -4.75e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9401 | 0.9401 | 0.9399 | -8.09e-5 | 0.8186 | 0.8190 | 0.8181 | -3.75e-4 | 0.6968 | 0.6991 | 0.6989 | -2.30e-3 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9414 | 0.9410 | 0.9406 | 4.31e-4 | 0.8231 | 0.8223 | 0.8218 | 8.33e-4 | 0.7046 | 0.7042 | 0.7038 | 3.28e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9379 | 0.9379 | 0.9377 | -1.96e-6 | 0.8115 | 0.8116 | 0.8108 | -9.83e-5 | 0.6846 | 0.6865 | 0.6860 | -1.94e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9727 | 0.9740 | 0.9740 | -1.29e-3 | 0.9034 | 0.9085 | 0.9086 | -5.10e-3 | 0.8273 | 0.8356 | 0.8355 | -8.29e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9727 | 0.9740 | 0.9740 | -1.29e-3 | 0.9034 | 0.9085 | 0.9086 | -5.10e-3 | 0.8273 | 0.8356 | 0.8355 | -8.29e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9609 | 0.9626 | 0.9626 | -1.71e-3 | 0.8209 | 0.8287 | 0.8296 | -7.85e-3 | 0.6538 | 0.6636 | 0.6674 | -9.81e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9224 | 0.9243 | 0.9244 | -1.88e-3 | 0.6033 | 0.6032 | 0.6105 | 1.81e-4 | 0.3045 | 0.2853 | 0.3094 | 1.92e-2 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9429 | 0.9426 | 0.9444 | 2.33e-4 | 0.7565 | 0.7519 | 0.7616 | 4.64e-3 | 0.6016 | 0.5894 | 0.6075 | 1.21e-2 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9166 | 0.9057 | 0.9165 | 1.09e-2 | 0.6197 | 0.5881 | 0.6233 | 3.17e-2 | 0.4009 | 0.3859 | 0.4023 | 1.50e-2 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9417 | 0.9417 | 0.9413 | -3.77e-6 | 0.8250 | 0.8252 | 0.8239 | -1.34e-4 | 0.7084 | 0.7102 | 0.7095 | -1.81e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9417 | 0.9417 | 0.9413 | -3.77e-6 | 0.8250 | 0.8252 | 0.8239 | -1.34e-4 | 0.7084 | 0.7102 | 0.7095 | -1.81e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9348 | 0.9353 | 0.9357 | -4.64e-4 | 0.7853 | 0.7866 | 0.7874 | -1.25e-3 | 0.6379 | 0.6385 | 0.6386 | -5.92e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9294 | 0.9297 | 0.9293 | -3.40e-4 | 0.7571 | 0.7585 | 0.7573 | -1.41e-3 | 0.5891 | 0.5917 | 0.5918 | -2.59e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9312 | 0.9305 | 0.9308 | 7.01e-4 | 0.7520 | 0.7503 | 0.7511 | 1.69e-3 | 0.5715 | 0.5707 | 0.5707 | 7.92e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9168 | 0.9159 | 0.9165 | 9.14e-4 | 0.7338 | 0.7317 | 0.7344 | 2.08e-3 | 0.5647 | 0.5612 | 0.5667 | 3.54e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9417 | 0.9417 | 0.9413 | -3.41e-6 | 0.8251 | 0.8252 | 0.8240 | -1.32e-4 | 0.7085 | 0.7103 | 0.7096 | -1.80e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9417 | 0.9417 | 0.9413 | -3.41e-6 | 0.8251 | 0.8252 | 0.8240 | -1.32e-4 | 0.7085 | 0.7103 | 0.7096 | -1.80e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9343 | 0.9347 | 0.9351 | -4.72e-4 | 0.7817 | 0.7830 | 0.7837 | -1.31e-3 | 0.6313 | 0.6320 | 0.6320 | -6.93e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9286 | 0.9289 | 0.9285 | -3.46e-4 | 0.7525 | 0.7540 | 0.7528 | -1.44e-3 | 0.5812 | 0.5839 | 0.5840 | -2.65e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9303 | 0.9296 | 0.9299 | 6.97e-4 | 0.7467 | 0.7450 | 0.7458 | 1.64e-3 | 0.5621 | 0.5614 | 0.5614 | 6.97e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9163 | 0.9154 | 0.9159 | 9.17e-4 | 0.7308 | 0.7288 | 0.7315 | 2.06e-3 | 0.5603 | 0.5568 | 0.5623 | 3.49e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9649 | 0.9650 | 0.9648 | -9.94e-5 | 0.8736 | 0.8738 | 0.8731 | -2.20e-4 | 0.7665 | 0.7667 | 0.7654 | -1.97e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9649 | 0.9650 | 0.9648 | -9.94e-5 | 0.8736 | 0.8738 | 0.8731 | -2.20e-4 | 0.7665 | 0.7667 | 0.7654 | -1.97e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9606 | 0.9605 | 0.9607 | 1.25e-4 | 0.8501 | 0.8493 | 0.8502 | 8.70e-4 | 0.7256 | 0.7238 | 0.7260 | 1.83e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9501 | 0.9499 | 0.9501 | 1.51e-4 | 0.7645 | 0.7649 | 0.7645 | -4.08e-4 | 0.5218 | 0.5248 | 0.5221 | -2.97e-3 |
| nikon-z-24-70f4s-wide-best-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9219 | 0.9214 | 0.9222 | 5.30e-4 | 0.5793 | 0.5778 | 0.5788 | 1.53e-3 | 0.1901 | 0.1891 | 0.1885 | 1.00e-3 |
| nikon-z-24-70f4s-wide-best-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.7762 | 0.8192 | 0.7772 | -4.29e-2 | 0.4033 | 0.4664 | 0.4014 | -6.31e-2 | 0.2393 | 0.2994 | 0.2353 | -6.02e-2 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9399 | 0.9398 | 4.44e-4 | 0.8197 | 0.8186 | 0.8179 | 1.06e-3 | 0.7000 | 0.6999 | 0.7001 | 5.75e-5 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9399 | 0.9398 | 4.44e-4 | 0.8197 | 0.8186 | 0.8179 | 1.06e-3 | 0.7000 | 0.6999 | 0.7001 | 5.75e-5 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9355 | 0.9355 | 0.9355 | -4.23e-5 | 0.7976 | 0.7978 | 0.7976 | -2.79e-4 | 0.6625 | 0.6632 | 0.6625 | -7.41e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9337 | 0.9335 | 0.9337 | 2.16e-4 | 0.8000 | 0.7997 | 0.8000 | 2.99e-4 | 0.6685 | 0.6688 | 0.6685 | -3.36e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8806 | 0.8815 | 0.8808 | -8.74e-4 | 0.5181 | 0.5215 | 0.5184 | -3.41e-3 | 0.2406 | 0.2457 | 0.2409 | -5.14e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8502 | 0.8515 | 0.8503 | -1.37e-3 | 0.5665 | 0.5696 | 0.5657 | -3.08e-3 | 0.3684 | 0.3735 | 0.3664 | -5.02e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9410 | 0.9406 | 0.9404 | 4.83e-4 | 0.8228 | 0.8215 | 0.8209 | 1.28e-3 | 0.7044 | 0.7039 | 0.7042 | 4.43e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9410 | 0.9406 | 0.9404 | 4.83e-4 | 0.8228 | 0.8215 | 0.8209 | 1.28e-3 | 0.7044 | 0.7039 | 0.7042 | 4.43e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9377 | 0.9378 | 0.9377 | -4.95e-5 | 0.8110 | 0.8114 | 0.8111 | -3.35e-4 | 0.6864 | 0.6873 | 0.6865 | -8.87e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9328 | 0.9326 | 0.9328 | 2.26e-4 | 0.7940 | 0.7937 | 0.7941 | 3.30e-4 | 0.6572 | 0.6576 | 0.6573 | -3.23e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8919 | 0.8926 | 0.8920 | -6.60e-4 | 0.5738 | 0.5763 | 0.5741 | -2.44e-3 | 0.3140 | 0.3181 | 0.3144 | -4.10e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8595 | 0.8607 | 0.8596 | -1.14e-3 | 0.5975 | 0.5998 | 0.5968 | -2.24e-3 | 0.4047 | 0.4090 | 0.4030 | -4.37e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9673 | 0.9688 | 0.9685 | -1.52e-3 | 0.9028 | 0.9048 | 0.9046 | -2.08e-3 | 0.8380 | 0.8418 | 0.8422 | -3.86e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9673 | 0.9688 | 0.9685 | -1.52e-3 | 0.9028 | 0.9048 | 0.9046 | -2.08e-3 | 0.8380 | 0.8418 | 0.8422 | -3.86e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9244 | 0.9244 | 0.9250 | -6.96e-6 | 0.7248 | 0.7186 | 0.7252 | 6.20e-3 | 0.5876 | 0.5768 | 0.5875 | 1.08e-2 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9418 | 0.9429 | 0.9419 | -1.07e-3 | 0.7874 | 0.7861 | 0.7875 | 1.31e-3 | 0.6372 | 0.6333 | 0.6369 | 3.83e-3 |
| nikon-z-24-70f4s-tele-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.6588 | 0.6495 | 0.6574 | 9.26e-3 | 0.4610 | 0.4500 | 0.4622 | 1.10e-2 | 0.3686 | 0.3575 | 0.3668 | 1.11e-2 |
| nikon-z-24-70f4s-tele-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8855 | 0.9414 | 0.8858 | -5.59e-2 | 0.5725 | 0.7878 | 0.5728 | -2.15e-1 | 0.3164 | 0.6189 | 0.3160 | -3.02e-1 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9406 | 0.9403 | 9.80e-6 | 0.8202 | 0.8204 | 0.8192 | -1.61e-4 | 0.7007 | 0.7026 | 0.7020 | -1.91e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9406 | 0.9403 | 9.80e-6 | 0.8202 | 0.8204 | 0.8192 | -1.61e-4 | 0.7007 | 0.7026 | 0.7020 | -1.91e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9396 | 0.9390 | 0.9386 | 6.42e-4 | 0.8177 | 0.8159 | 0.8146 | 1.78e-3 | 0.6974 | 0.6960 | 0.6948 | 1.39e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9328 | 0.9328 | 0.9326 | -5.15e-6 | 0.7851 | 0.7857 | 0.7847 | -5.57e-4 | 0.6405 | 0.6430 | 0.6420 | -2.55e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9276 | 0.9274 | 0.9264 | 2.78e-4 | 0.7645 | 0.7637 | 0.7621 | 7.83e-4 | 0.6155 | 0.6144 | 0.6131 | 1.12e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9162 | 0.9152 | 0.9144 | 1.04e-3 | 0.7275 | 0.7289 | 0.7265 | -1.31e-3 | 0.5451 | 0.5507 | 0.5477 | -5.62e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9413 | 0.9413 | 0.9410 | 3.24e-5 | 0.8238 | 0.8238 | 0.8227 | -2.99e-5 | 0.7062 | 0.7078 | 0.7073 | -1.65e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9413 | 0.9413 | 0.9410 | 3.24e-5 | 0.8238 | 0.8238 | 0.8227 | -2.99e-5 | 0.7062 | 0.7078 | 0.7073 | -1.65e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9398 | 0.9391 | 0.9387 | 6.71e-4 | 0.8160 | 0.8141 | 0.8127 | 1.92e-3 | 0.6910 | 0.6894 | 0.6880 | 1.57e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9355 | 0.9355 | 0.9353 | -1.51e-6 | 0.8012 | 0.8016 | 0.8008 | -4.22e-4 | 0.6684 | 0.6708 | 0.6700 | -2.41e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9270 | 0.9279 | 0.9270 | -9.60e-4 | 0.7601 | 0.7620 | 0.7602 | -1.87e-3 | 0.6048 | 0.6067 | 0.6049 | -1.93e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9148 | 0.9155 | 0.9149 | -6.49e-4 | 0.7350 | 0.7365 | 0.7352 | -1.53e-3 | 0.5635 | 0.5658 | 0.5641 | -2.26e-3 |
| nikon-z-mc-105f28-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9768 | 0.9772 | 0.9768 | -4.07e-4 | 0.9265 | 0.9278 | 0.9267 | -1.29e-3 | 0.8742 | 0.8759 | 0.8749 | -1.73e-3 |
| nikon-z-mc-105f28-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9768 | 0.9772 | 0.9768 | -4.07e-4 | 0.9265 | 0.9278 | 0.9267 | -1.29e-3 | 0.8742 | 0.8759 | 0.8749 | -1.73e-3 |
| nikon-z-mc-105f28-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9755 | 0.9755 | 0.9750 | 6.27e-5 | 0.9151 | 0.9147 | 0.9137 | 4.79e-4 | 0.8442 | 0.8431 | 0.8422 | 1.16e-3 |
| nikon-z-mc-105f28-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9659 | 0.9661 | 0.9659 | -2.24e-4 | 0.8804 | 0.8816 | 0.8809 | -1.18e-3 | 0.7909 | 0.7940 | 0.7929 | -3.12e-3 |
| nikon-z-mc-105f28-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8890 | 0.8876 | 0.8891 | 1.43e-3 | 0.5624 | 0.5548 | 0.5623 | 7.66e-3 | 0.4430 | 0.4347 | 0.4431 | 8.27e-3 |
| nikon-z-mc-105f28-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8899 | 0.8883 | 0.8900 | 1.53e-3 | 0.5447 | 0.5406 | 0.5448 | 4.10e-3 | 0.2938 | 0.2907 | 0.2939 | 3.19e-3 |
| nikon-z-mc-105f28-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9412 | 0.9408 | 0.9403 | 4.43e-4 | 0.8231 | 0.8219 | 0.8203 | 1.18e-3 | 0.7053 | 0.7050 | 0.7037 | 3.31e-4 |
| nikon-z-mc-105f28-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9412 | 0.9408 | 0.9403 | 4.43e-4 | 0.8231 | 0.8219 | 0.8203 | 1.18e-3 | 0.7053 | 0.7050 | 0.7037 | 3.31e-4 |
| nikon-z-mc-105f28-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9415 | 0.9410 | 0.9415 | 4.99e-4 | 0.8240 | 0.8226 | 0.8238 | 1.38e-3 | 0.7061 | 0.7054 | 0.7062 | 6.93e-4 |
| nikon-z-mc-105f28-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9411 | 0.9411 | 0.9411 | -9.33e-6 | 0.8228 | 0.8230 | 0.8227 | -1.60e-4 | 0.7047 | 0.7066 | 0.7063 | -1.88e-3 |
| nikon-z-mc-105f28-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9367 | 0.9369 | 0.9372 | -1.93e-4 | 0.7997 | 0.7995 | 0.8004 | 1.79e-4 | 0.6653 | 0.6669 | 0.6667 | -1.65e-3 |
| nikon-z-mc-105f28-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9159 | 0.9152 | 0.9146 | 7.06e-4 | 0.6715 | 0.6694 | 0.6679 | 2.14e-3 | 0.4490 | 0.4475 | 0.4468 | 1.50e-3 |
| nikon-z-mc-105f28-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9415 | 0.9410 | 0.9405 | 4.55e-4 | 0.8244 | 0.8231 | 0.8215 | 1.25e-3 | 0.7073 | 0.7068 | 0.7055 | 4.62e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9415 | 0.9410 | 0.9405 | 4.55e-4 | 0.8244 | 0.8231 | 0.8215 | 1.25e-3 | 0.7073 | 0.7068 | 0.7055 | 4.62e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9409 | 0.9404 | 0.9409 | 5.01e-4 | 0.8198 | 0.8185 | 0.8197 | 1.38e-3 | 0.6979 | 0.6972 | 0.6979 | 6.80e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9413 | 0.9413 | 0.9412 | -9.97e-6 | 0.8237 | 0.8239 | 0.8236 | -1.62e-4 | 0.7061 | 0.7080 | 0.7077 | -1.89e-3 |
| nikon-z-mc-105f28-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9385 | 0.9387 | 0.9390 | -2.63e-4 | 0.8097 | 0.8100 | 0.8107 | -3.42e-4 | 0.6828 | 0.6852 | 0.6849 | -2.46e-3 |
| nikon-z-mc-105f28-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9095 | 0.9089 | 0.9083 | 6.55e-4 | 0.6375 | 0.6355 | 0.6341 | 1.98e-3 | 0.3984 | 0.3970 | 0.3963 | 1.41e-3 |
| nikon-z-135f18-plena-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9801 | 0.9801 | 0.9801 | -4.78e-5 | 0.9091 | 0.9102 | 0.9091 | -1.12e-3 | 0.8121 | 0.8132 | 0.8114 | -1.19e-3 |
| nikon-z-135f18-plena-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9801 | 0.9801 | 0.9801 | -4.78e-5 | 0.9091 | 0.9102 | 0.9091 | -1.12e-3 | 0.8121 | 0.8132 | 0.8114 | -1.19e-3 |
| nikon-z-135f18-plena-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9773 | 0.9779 | 0.9774 | -5.32e-4 | 0.8997 | 0.9013 | 0.8997 | -1.56e-3 | 0.8125 | 0.8123 | 0.8128 | 1.59e-4 |
| nikon-z-135f18-plena-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9792 | 0.9799 | 0.9795 | -6.60e-4 | 0.9176 | 0.9193 | 0.9178 | -1.77e-3 | 0.8470 | 0.8490 | 0.8480 | -1.99e-3 |
| nikon-z-135f18-plena-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9554 | 0.9577 | 0.9557 | -2.25e-3 | 0.7585 | 0.7654 | 0.7584 | -6.90e-3 | 0.5525 | 0.5506 | 0.5529 | 1.87e-3 |
| nikon-z-135f18-plena-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8859 | 0.8867 | 0.8876 | -8.14e-4 | 0.5697 | 0.5585 | 0.5702 | 1.12e-2 | 0.4403 | 0.4242 | 0.4391 | 1.62e-2 |
| nikon-z-135f18-plena-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9436 | 0.9431 | 0.9427 | 5.03e-4 | 0.8307 | 0.8293 | 0.8280 | 1.42e-3 | 0.7179 | 0.7170 | 0.7160 | 8.92e-4 |
| nikon-z-135f18-plena-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9436 | 0.9431 | 0.9427 | 5.03e-4 | 0.8307 | 0.8293 | 0.8280 | 1.42e-3 | 0.7179 | 0.7170 | 0.7160 | 8.92e-4 |
| nikon-z-135f18-plena-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9420 | 0.9417 | 0.9418 | 3.67e-4 | 0.8218 | 0.8209 | 0.8212 | 9.43e-4 | 0.7007 | 0.7007 | 0.7007 | -8.20e-6 |
| nikon-z-135f18-plena-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9418 | 0.9417 | 0.9416 | 1.22e-4 | 0.8233 | 0.8231 | 0.8226 | 2.59e-4 | 0.7043 | 0.7055 | 0.7055 | -1.11e-3 |
| nikon-z-135f18-plena-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9377 | 0.9367 | 0.9361 | 9.49e-4 | 0.7942 | 0.7916 | 0.7906 | 2.59e-3 | 0.6487 | 0.6460 | 0.6449 | 2.67e-3 |
| nikon-z-135f18-plena-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9374 | 0.9375 | 0.9376 | -5.27e-5 | 0.8036 | 0.8039 | 0.8040 | -2.71e-4 | 0.6695 | 0.6716 | 0.6709 | -2.03e-3 |
| nikon-z-135f18-plena-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9436 | 0.9431 | 0.9427 | 5.04e-4 | 0.8308 | 0.8293 | 0.8280 | 1.42e-3 | 0.7180 | 0.7171 | 0.7161 | 9.01e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9436 | 0.9431 | 0.9427 | 5.04e-4 | 0.8308 | 0.8293 | 0.8280 | 1.42e-3 | 0.7180 | 0.7171 | 0.7161 | 9.01e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9418 | 0.9414 | 0.9416 | 3.64e-4 | 0.8202 | 0.8193 | 0.8196 | 9.18e-4 | 0.6977 | 0.6977 | 0.6977 | -6.81e-5 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9416 | 0.9415 | 0.9414 | 1.22e-4 | 0.8222 | 0.8219 | 0.8215 | 2.56e-4 | 0.7021 | 0.7033 | 0.7033 | -1.12e-3 |
| nikon-z-135f18-plena-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9372 | 0.9362 | 0.9356 | 9.45e-4 | 0.7909 | 0.7883 | 0.7873 | 2.56e-3 | 0.6426 | 0.6400 | 0.6389 | 2.62e-3 |
| nikon-z-135f18-plena-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9370 | 0.9371 | 0.9372 | -5.04e-5 | 0.8012 | 0.8015 | 0.8016 | -2.55e-4 | 0.6652 | 0.6671 | 0.6665 | -1.98e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9461 | 0.9465 | 0.9460 | -3.97e-4 | 0.8105 | 0.8131 | 0.8091 | -2.60e-3 | 0.7193 | 0.7225 | 0.7173 | -3.12e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9461 | 0.9465 | 0.9460 | -3.97e-4 | 0.8105 | 0.8131 | 0.8091 | -2.60e-3 | 0.7193 | 0.7225 | 0.7173 | -3.12e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9494 | 0.9506 | 0.9501 | -1.18e-3 | 0.7916 | 0.7971 | 0.7926 | -5.56e-3 | 0.6381 | 0.6451 | 0.6384 | -6.98e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9384 | 0.9385 | 0.9390 | -7.73e-5 | 0.7031 | 0.7026 | 0.7038 | 4.03e-4 | 0.4085 | 0.4034 | 0.4076 | 5.09e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.7513 | — | 0.7512 | — | 0.3586 | — | 0.3584 | — | 0.2965 | — | 0.2967 | — |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8204 | — | 0.8206 | — | 0.3449 | — | 0.3461 | — | 0.1203 | — | 0.1203 | — |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9391 | 0.9387 | 0.9387 | 3.45e-4 | 0.8129 | 0.8122 | 0.8120 | 7.25e-4 | 0.6885 | 0.6890 | 0.6889 | -5.72e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9391 | 0.9387 | 0.9387 | 3.45e-4 | 0.8129 | 0.8122 | 0.8120 | 7.25e-4 | 0.6885 | 0.6890 | 0.6889 | -5.72e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9288 | 0.9285 | 0.9288 | 2.82e-4 | 0.7532 | 0.7528 | 0.7536 | 3.22e-4 | 0.5798 | 0.5812 | 0.5809 | -1.36e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9289 | 0.9289 | 0.9290 | -5.09e-5 | 0.7712 | 0.7717 | 0.7715 | -4.77e-4 | 0.6200 | 0.6221 | 0.6224 | -2.11e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9318 | 0.9330 | 0.9336 | -1.23e-3 | 0.7870 | 0.7890 | 0.7908 | -2.02e-3 | 0.6459 | 0.6471 | 0.6493 | -1.21e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8559 | 0.8540 | 0.8556 | 1.95e-3 | 0.5430 | 0.5422 | 0.5459 | 8.58e-4 | 0.3285 | 0.3285 | 0.3322 | 2.86e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9403 | 3.78e-4 | 0.8216 | 0.8206 | 0.8205 | 9.96e-4 | 0.7025 | 0.7025 | 0.7025 | -2.08e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9403 | 3.78e-4 | 0.8216 | 0.8206 | 0.8205 | 9.96e-4 | 0.7025 | 0.7025 | 0.7025 | -2.08e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9351 | 0.9348 | 0.9352 | 3.07e-4 | 0.7926 | 0.7919 | 0.7929 | 6.32e-4 | 0.6497 | 0.6505 | 0.6508 | -8.33e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9217 | 0.9217 | 0.9217 | 1.76e-5 | 0.7299 | 0.7301 | 0.7302 | -2.18e-4 | 0.5516 | 0.5531 | 0.5539 | -1.53e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9327 | 0.9339 | 0.9345 | -1.24e-3 | 0.7948 | 0.7969 | 0.7987 | -2.16e-3 | 0.6623 | 0.6637 | 0.6659 | -1.41e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8483 | 0.8464 | 0.8483 | 1.90e-3 | 0.5159 | 0.5156 | 0.5201 | 2.85e-4 | 0.3052 | 0.3060 | 0.3105 | -8.03e-4 |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

| Reason | Meaning |
|---|---|
| no-curve | an engine has no curve of the field |
| two-methods | both engines stand by their curves; the difference is held to the attention band |
| unconverged | a sampling did not settle; the difference is shown apart, in no band |

## r5g

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | chiefLanding.maxAbs [mm] | 3.00e-4 | 288 of 288 | sony-fe-20mm-f18-g-photopic | field 1 |
| lv – optiland | mtfOnAxis.maxAbs | 2.66e-2 | 96 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 0, frequencyPerMm 80 |
| lv – optiland | fields.compared [elements] | 284 | 288 of 288 | — | — |
| lv – optiland | fields.flagged [elements] | 4 | 288 of 288 | — | — |
| lv – optiland | fields.rimLost [elements] | 0 | 288 of 288 | — | — |
| lv – optiland | fields.data [elements] | 0 | 288 of 288 | — | — |
| lv – optiland | fields.unavailable [elements] | 0 | 288 of 288 | — | — |
| lv – optiland | mtfOffAxis.maxAbs | 2.82e-2 | 188 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 1, frequencyPerMm 40 |
| lv – optiland | mtfOffAxis.firstStepMaxAbs | 2.81e-2 | 27 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 1, frequencyPerMm 40 |
| lv – optiland | mtfFlagged.maxAbs | 1.63e-2 | 4 of 288 | sigma-35mm-f14-dg-hsm-a-ref | cut tangential, field 1, frequencyPerMm 50 |
| lv – optiland | mtfOnAxis.firstStepMaxAbs | 2.67e-2 | 13 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 0, frequencyPerMm 80 |
| lv – replay | chiefLanding.maxAbs [mm] | 0 | 288 of 288 | canon-ef-135-f2l-usm-ref | field 0 |
| lv – replay | mtfOnAxis.maxAbs | 4.33e-15 | 96 of 288 | nikon-z-mc-105f28-f8-best-ref | cut tangential, field 0, frequencyPerMm 50 |
| lv – replay | fields.compared [elements] | 284 | 288 of 288 | — | — |
| lv – replay | fields.flagged [elements] | 4 | 288 of 288 | — | — |
| lv – replay | fields.rimLost [elements] | 0 | 288 of 288 | — | — |
| lv – replay | fields.data [elements] | 0 | 288 of 288 | — | — |
| lv – replay | fields.unavailable [elements] | 0 | 288 of 288 | — | — |
| lv – replay | mtfOffAxis.maxAbs | 7.88e-15 | 188 of 288 | sony-fe-20mm-f18-g-best-ref | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| lv – replay | mtfFlagged.maxAbs | 2.66e-15 | 4 of 288 | sigma-35mm-f14-dg-hsm-a-best-ref | cut sagittal, field 1, frequencyPerMm 10 |
| optiland – replay | chiefLanding.maxAbs [mm] | 3.00e-4 | 288 of 288 | sony-fe-20mm-f18-g-photopic | field 1 |
| optiland – replay | mtfOnAxis.maxAbs | 2.66e-2 | 96 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 0, frequencyPerMm 80 |
| optiland – replay | fields.compared [elements] | 284 | 288 of 288 | — | — |
| optiland – replay | fields.flagged [elements] | 4 | 288 of 288 | — | — |
| optiland – replay | fields.rimLost [elements] | 0 | 288 of 288 | — | — |
| optiland – replay | fields.data [elements] | 0 | 288 of 288 | — | — |
| optiland – replay | fields.unavailable [elements] | 0 | 288 of 288 | — | — |
| optiland – replay | mtfOffAxis.maxAbs | 2.82e-2 | 188 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 1, frequencyPerMm 40 |
| optiland – replay | mtfOffAxis.firstStepMaxAbs | 2.81e-2 | 27 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 1, frequencyPerMm 40 |
| optiland – replay | mtfFlagged.maxAbs | 1.63e-2 | 4 of 288 | sigma-35mm-f14-dg-hsm-a-ref | cut tangential, field 1, frequencyPerMm 50 |
| optiland – replay | mtfOnAxis.firstStepMaxAbs | 2.67e-2 | 13 of 288 | nikon-z-135f18-plena-ref | cut sagittal, field 0, frequencyPerMm 80 |

The engines' own geometric MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the
pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a
tolerance.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice
across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. On one line
optiland counts its landings into bins, and gives a curve only where the bins move it by less than a band.
Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its
curves moved between its last two samplings, which is that engine's own measure and judges no other.

On several lines the column of optiland is not a curve of optiland's own class, which is of one line: the rays
and their landings are optiland's, a line a call, and the sum over them, the lines added as complex numbers with
their weights before the modulus is taken, is the worker's.

A row is one field and cut of one run, at 10, 30, 50 cycles/mm. Under each engine is what it says of the field
(`optiland` with the step its row is of, where it was asked again); the third estimate is the comparator's
(`replay`). The status is the gravest of the row's frequencies; "all" is what the two engines came to over
every frequency of the request.

Rows by status: 494 RECORDED, 74 ATTENTION, 8 SET ASIDE.

| Run | Field | Cut | lv | optiland | replay | Class | Status | All | lv 10 | optiland 10 | replay 10 | Δ 10 | lv 30 | optiland 30 | replay 30 | Δ 30 | lv 50 | optiland 50 | replay 50 | Δ 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | 1.32e-5 | 0.9896 | 0.9895 | 0.9896 | 1.18e-4 | 0.9714 | 0.9711 | 0.9714 | 3.22e-4 |
| canon-ef-135-f2l-usm-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | 1.32e-5 | 0.9896 | 0.9895 | 0.9896 | 1.18e-4 | 0.9714 | 0.9711 | 0.9714 | 3.22e-4 |
| canon-ef-135-f2l-usm-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9859 | 0.9861 | 0.9859 | -2.39e-4 | 0.8783 | 0.8803 | 0.8783 | -2.01e-3 | 0.6914 | 0.6963 | 0.6914 | -4.90e-3 |
| canon-ef-135-f2l-usm-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9917 | 0.9920 | 0.9917 | -3.23e-4 | 0.9278 | 0.9306 | 0.9278 | -2.80e-3 | 0.8120 | 0.8192 | 0.8120 | -7.19e-3 |
| canon-ef-135-f2l-usm-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9526 | 0.9515 | 0.9526 | 1.06e-3 | 0.6766 | 0.6718 | 0.6766 | 4.83e-3 | 0.4023 | 0.3987 | 0.4023 | 3.61e-3 |
| canon-ef-135-f2l-usm-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9749 | 0.9748 | 0.9749 | 2.21e-5 | 0.7888 | 0.7887 | 0.7888 | 9.70e-5 | 0.4900 | 0.4902 | 0.4900 | -2.35e-4 |
| canon-ef-135-f2l-usm-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9580 | 0.9567 | 0.9580 | 1.23e-3 | 0.6919 | 0.6834 | 0.6919 | 8.52e-3 | 0.3876 | 0.3737 | 0.3876 | 1.38e-2 |
| canon-ef-135-f2l-usm-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9580 | 0.9567 | 0.9580 | 1.23e-3 | 0.6919 | 0.6834 | 0.6919 | 8.52e-3 | 0.3876 | 0.3737 | 0.3876 | 1.38e-2 |
| canon-ef-135-f2l-usm-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9381 | 0.9373 | 0.9381 | 8.62e-4 | 0.5490 | 0.5438 | 0.5490 | 5.15e-3 | 0.1565 | 0.1509 | 0.1565 | 5.54e-3 |
| canon-ef-135-f2l-usm-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9544 | 0.9525 | 0.9544 | 1.89e-3 | 0.6630 | 0.6535 | 0.6630 | 9.55e-3 | 0.3325 | 0.3233 | 0.3325 | 9.24e-3 |
| canon-ef-135-f2l-usm-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9460 | 0.9455 | 0.9460 | 4.98e-4 | 0.6441 | 0.6440 | 0.6441 | 1.09e-4 | 0.3302 | 0.3349 | 0.3302 | -4.75e-3 |
| canon-ef-135-f2l-usm-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9661 | 0.9660 | 0.9661 | 1.64e-5 | 0.7241 | 0.7241 | 0.7241 | -1.02e-5 | 0.3714 | 0.3718 | 0.3714 | -3.98e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9674 | 0.9674 | 0.9674 | 3.49e-5 | 0.7366 | 0.7363 | 0.7366 | 2.86e-4 | 0.4088 | 0.4081 | 0.4088 | 6.70e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9674 | 0.9674 | 0.9674 | 3.49e-5 | 0.7366 | 0.7363 | 0.7366 | 2.86e-4 | 0.4088 | 0.4081 | 0.4088 | 6.70e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8953 | 0.8963 | 0.8953 | -9.76e-4 | 0.3277 | 0.3270 | 0.3277 | 6.56e-4 | 0.1127 | 0.1160 | 0.1127 | -3.29e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8733 | 0.8792 | 0.8733 | -5.82e-3 | 0.6047 | 0.6076 | 0.6047 | -2.98e-3 | 0.4283 | 0.4274 | 0.4283 | 9.74e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6702 | 0.6732 | 0.6702 | -2.96e-3 | 0.4708 | 0.4728 | 0.4708 | -2.08e-3 | 0.3560 | 0.3579 | 0.3560 | -1.87e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9317 | 0.9297 | 0.9317 | 2.04e-3 | 0.6883 | 0.6839 | 0.6883 | 4.43e-3 | 0.4633 | 0.4603 | 0.4633 | 3.03e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9661 | 0.9661 | 0.9661 | 2.09e-5 | 0.7304 | 0.7302 | 0.7304 | 1.61e-4 | 0.4131 | 0.4128 | 0.4131 | 3.39e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9661 | 0.9661 | 0.9661 | 2.09e-5 | 0.7304 | 0.7302 | 0.7304 | 1.61e-4 | 0.4131 | 0.4128 | 0.4131 | 3.39e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8945 | 0.8954 | 0.8945 | -9.76e-4 | 0.3368 | 0.3368 | 0.3368 | -4.43e-6 | 0.0787 | 0.0810 | 0.0787 | -2.32e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8694 | 0.8745 | 0.8694 | -5.12e-3 | 0.5475 | 0.5512 | 0.5475 | -3.76e-3 | 0.3436 | 0.3472 | 0.3436 | -3.61e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6677 | 0.6708 | 0.6677 | -3.10e-3 | 0.4641 | 0.4665 | 0.4641 | -2.36e-3 | 0.3458 | 0.3480 | 0.3458 | -2.24e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8674 | 0.8653 | 0.8674 | 2.14e-3 | 0.4501 | 0.4497 | 0.4501 | 4.56e-4 | 0.1567 | 0.1594 | 0.1567 | -2.70e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9982 | 0.9981 | 0.9982 | 4.37e-5 | 0.9838 | 0.9834 | 0.9838 | 3.90e-4 | 0.9555 | 0.9545 | 0.9555 | 1.07e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9982 | 0.9981 | 0.9982 | 4.37e-5 | 0.9838 | 0.9834 | 0.9838 | 3.90e-4 | 0.9555 | 0.9545 | 0.9555 | 1.07e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9267 | 0.9266 | 0.9267 | 8.51e-5 | 0.6352 | 0.6319 | 0.6352 | 3.26e-3 | 0.3137 | 0.3138 | 0.3137 | -1.69e-4 |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9680 | 0.9671 | 0.9680 | 8.62e-4 | 0.7847 | 0.7799 | 0.7847 | 4.78e-3 | 0.6154 | 0.6081 | 0.6154 | 7.28e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | sagittal | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.5237 | 0.5150 | 0.5237 | 8.68e-3 | 0.3818 | 0.3754 | 0.3818 | 6.44e-3 | 0.3341 | 0.3289 | 0.3341 | 5.15e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | tangential | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.7029 | 0.6969 | 0.7029 | 5.93e-3 | 0.5373 | 0.5279 | 0.5373 | 9.37e-3 | 0.4471 | 0.4308 | 0.4471 | 1.63e-2 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9491 | 0.9485 | 0.9491 | 5.91e-4 | 0.6358 | 0.6323 | 0.6358 | 3.43e-3 | 0.3289 | 0.3244 | 0.3289 | 4.49e-3 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9491 | 0.9485 | 0.9491 | 5.91e-4 | 0.6358 | 0.6323 | 0.6358 | 3.43e-3 | 0.3289 | 0.3244 | 0.3289 | 4.49e-3 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8900 | 0.8882 | 0.8900 | 1.81e-3 | 0.4628 | 0.4599 | 0.4628 | 2.88e-3 | 0.1017 | 0.1019 | 0.1017 | -2.59e-4 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9367 | 0.9357 | 0.9367 | 1.02e-3 | 0.6622 | 0.6561 | 0.6622 | 6.17e-3 | 0.4544 | 0.4467 | 0.4544 | 7.63e-3 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | sagittal | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.5192 | 0.5115 | 0.5192 | 7.77e-3 | 0.3732 | 0.3674 | 0.3732 | 5.81e-3 | 0.3247 | 0.3199 | 0.3247 | 4.85e-3 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | tangential | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.6691 | 0.6636 | 0.6691 | 5.50e-3 | 0.4055 | 0.3993 | 0.4055 | 6.28e-3 | 0.2376 | 0.2340 | 0.2376 | 3.63e-3 |
| nikkor-z50f12-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8091 | 0.8026 | 0.8091 | 6.57e-3 | 0.1583 | 0.1366 | 0.1583 | 2.17e-2 | 0.2111 | 0.2026 | 0.2111 | 8.57e-3 |
| nikkor-z50f12-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8091 | 0.8026 | 0.8091 | 6.57e-3 | 0.1583 | 0.1366 | 0.1583 | 2.17e-2 | 0.2111 | 0.2026 | 0.2111 | 8.57e-3 |
| nikkor-z50f12-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8800 | 0.8783 | 0.8800 | 1.69e-3 | 0.2431 | 0.2357 | 0.2431 | 7.36e-3 | 0.1776 | 0.1847 | 0.1776 | -7.18e-3 |
| nikkor-z50f12-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8059 | 0.8011 | 0.8059 | 4.72e-3 | 0.4125 | 0.4033 | 0.4125 | 9.17e-3 | 0.3057 | 0.2975 | 0.3057 | 8.26e-3 |
| nikkor-z50f12-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8201 | 0.8163 | 0.8201 | 3.81e-3 | 0.1646 | 0.1535 | 0.1646 | 1.11e-2 | 0.1435 | 0.1465 | 0.1435 | -2.93e-3 |
| nikkor-z50f12-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.8643 | 0.8658 | 0.8643 | -1.51e-3 | 0.5508 | 0.5460 | 0.5508 | 4.80e-3 | 0.3265 | 0.3262 | 0.3265 | 2.80e-4 |
| nikkor-z50f12-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.7757 | 0.7685 | 0.7757 | 7.19e-3 | 0.1289 | 0.1106 | 0.1289 | 1.83e-2 | 0.1428 | 0.1358 | 0.1428 | 7.03e-3 |
| nikkor-z50f12-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.7757 | 0.7685 | 0.7757 | 7.19e-3 | 0.1289 | 0.1106 | 0.1289 | 1.83e-2 | 0.1428 | 0.1358 | 0.1428 | 7.03e-3 |
| nikkor-z50f12-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8534 | 0.8516 | 0.8534 | 1.72e-3 | 0.1341 | 0.1274 | 0.1341 | 6.73e-3 | 0.1662 | 0.1697 | 0.1662 | -3.48e-3 |
| nikkor-z50f12-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7733 | 0.7676 | 0.7733 | 5.71e-3 | 0.3457 | 0.3397 | 0.3457 | 6.06e-3 | 0.1882 | 0.1845 | 0.1882 | 3.64e-3 |
| nikkor-z50f12-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.8088 | 0.8049 | 0.8088 | 3.85e-3 | 0.1171 | 0.1070 | 0.1171 | 1.01e-2 | 0.1458 | 0.1450 | 0.1458 | 8.37e-4 |
| nikkor-z50f12-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8300 | 0.8312 | 0.8300 | -1.18e-3 | 0.4589 | 0.4549 | 0.4589 | 3.99e-3 | 0.2645 | 0.2624 | 0.2645 | 2.15e-3 |
| sony-fe-20mm-f18-g-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9039 | 0.8981 | 0.9039 | 5.73e-3 | 0.5531 | 0.5281 | 0.5531 | 2.49e-2 | 0.4427 | 0.4198 | 0.4427 | 2.29e-2 |
| sony-fe-20mm-f18-g-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9039 | 0.8981 | 0.9039 | 5.73e-3 | 0.5531 | 0.5281 | 0.5531 | 2.49e-2 | 0.4427 | 0.4198 | 0.4427 | 2.29e-2 |
| sony-fe-20mm-f18-g-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.6492 | 0.6377 | 0.6492 | 1.15e-2 | 0.0321 | 0.0258 | 0.0321 | 6.22e-3 | 0.0115 | 0.0154 | 0.0115 | -3.88e-3 |
| sony-fe-20mm-f18-g-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.4638 | 0.4546 | 0.4638 | 9.21e-3 | 0.1217 | 0.1230 | 0.1217 | -1.26e-3 | 0.0718 | 0.0766 | 0.0718 | -4.79e-3 |
| sony-fe-20mm-f18-g-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.3024 | 0.2903 | 0.3024 | 1.21e-2 | 0.1026 | 0.1015 | 0.1026 | 1.06e-3 | 0.0396 | 0.0418 | 0.0396 | -2.25e-3 |
| sony-fe-20mm-f18-g-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.1402 | 0.1488 | 0.1402 | -8.62e-3 | 0.0752 | 0.0779 | 0.0752 | -2.73e-3 | 0.0667 | 0.0655 | 0.0667 | 1.22e-3 |
| sony-fe-20mm-f18-g-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.8926 | 0.8857 | 0.8926 | 6.98e-3 | 0.5255 | 0.5002 | 0.5255 | 2.53e-2 | 0.3871 | 0.3637 | 0.3871 | 2.35e-2 |
| sony-fe-20mm-f18-g-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.8926 | 0.8857 | 0.8926 | 6.98e-3 | 0.5255 | 0.5002 | 0.5255 | 2.53e-2 | 0.3871 | 0.3637 | 0.3871 | 2.35e-2 |
| sony-fe-20mm-f18-g-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.6338 | 0.6195 | 0.6338 | 1.43e-2 | 0.0235 | 0.0189 | 0.0235 | 4.54e-3 | 0.0260 | 0.0293 | 0.0260 | -3.33e-3 |
| sony-fe-20mm-f18-g-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.4455 | 0.4375 | 0.4455 | 8.04e-3 | 0.0975 | 0.0981 | 0.0975 | -6.46e-4 | 0.0735 | 0.0775 | 0.0735 | -4.04e-3 |
| sony-fe-20mm-f18-g-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.2945 | 0.2811 | 0.2945 | 1.33e-2 | 0.1048 | 0.1041 | 0.1048 | 6.41e-4 | 0.0614 | 0.0609 | 0.0614 | 5.01e-4 |
| sony-fe-20mm-f18-g-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.1442 | 0.1474 | 0.1442 | -3.15e-3 | 0.0615 | 0.0616 | 0.0615 | -1.06e-4 | 0.0382 | 0.0365 | 0.0382 | 1.68e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9503 | 0.9495 | 0.9503 | 7.72e-4 | 0.6114 | 0.6056 | 0.6114 | 5.72e-3 | 0.1851 | 0.1746 | 0.1851 | 1.05e-2 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9503 | 0.9495 | 0.9503 | 7.72e-4 | 0.6114 | 0.6056 | 0.6114 | 5.72e-3 | 0.1851 | 0.1746 | 0.1851 | 1.05e-2 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9437 | 0.9430 | 0.9437 | 7.85e-4 | 0.5766 | 0.5711 | 0.5766 | 5.44e-3 | 0.1696 | 0.1609 | 0.1696 | 8.72e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9531 | 0.9529 | 0.9531 | 1.93e-4 | 0.6345 | 0.6334 | 0.6345 | 1.05e-3 | 0.2539 | 0.2545 | 0.2539 | -5.63e-4 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9558 | 0.9541 | 0.9558 | 1.67e-3 | 0.6622 | 0.6505 | 0.6622 | 1.17e-2 | 0.3174 | 0.2981 | 0.3174 | 1.93e-2 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9889 | 0.9889 | 0.9889 | -5.00e-6 | 0.9035 | 0.9035 | 0.9035 | -1.24e-7 | 0.7492 | 0.7489 | 0.7492 | 2.22e-4 |
| sony-fe-400mm-f28-gm-oss-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9597 | 0.9591 | 0.9597 | 6.02e-4 | 0.6826 | 0.6783 | 0.6826 | 4.38e-3 | 0.3186 | 0.3108 | 0.3186 | 7.81e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9597 | 0.9591 | 0.9597 | 6.02e-4 | 0.6826 | 0.6783 | 0.6826 | 4.38e-3 | 0.3186 | 0.3108 | 0.3186 | 7.81e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9559 | 0.9552 | 0.9559 | 6.98e-4 | 0.6655 | 0.6605 | 0.6655 | 5.01e-3 | 0.3247 | 0.3159 | 0.3247 | 8.86e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9623 | 0.9621 | 0.9623 | 2.10e-4 | 0.7045 | 0.7030 | 0.7045 | 1.53e-3 | 0.3703 | 0.3675 | 0.3703 | 2.77e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9660 | 0.9646 | 0.9660 | 1.35e-3 | 0.7394 | 0.7298 | 0.7394 | 9.59e-3 | 0.4661 | 0.4496 | 0.4661 | 1.65e-2 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9857 | 0.9857 | 0.9857 | 1.54e-5 | 0.8786 | 0.8784 | 0.8786 | 2.00e-4 | 0.6984 | 0.6977 | 0.6984 | 7.86e-4 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9877 | 0.9886 | 0.9877 | -8.95e-4 | 0.9033 | 0.9088 | 0.9033 | -5.48e-3 | 0.7920 | 0.7975 | 0.7920 | -5.54e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9877 | 0.9886 | 0.9877 | -8.95e-4 | 0.9033 | 0.9088 | 0.9033 | -5.48e-3 | 0.7920 | 0.7975 | 0.7920 | -5.54e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9625 | 0.9624 | 0.9625 | 9.40e-5 | 0.7157 | 0.7127 | 0.7157 | 2.97e-3 | 0.4181 | 0.4056 | 0.4181 | 1.25e-2 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9152 | 0.9141 | 0.9152 | 1.09e-3 | 0.4555 | 0.4465 | 0.4555 | 8.99e-3 | 0.1834 | 0.1741 | 0.1834 | 9.30e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9701 | 0.9693 | 0.9701 | 7.70e-4 | 0.7763 | 0.7710 | 0.7763 | 5.34e-3 | 0.5443 | 0.5354 | 0.5443 | 8.88e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9317 | 0.9330 | 0.9317 | -1.39e-3 | 0.5579 | 0.5703 | 0.5579 | -1.24e-2 | 0.3758 | 0.3913 | 0.3758 | -1.55e-2 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9823 | 0.9831 | 0.9823 | -8.18e-4 | 0.8680 | 0.8718 | 0.8680 | -3.78e-3 | 0.7379 | 0.7382 | 0.7379 | -2.18e-4 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9823 | 0.9831 | 0.9823 | -8.18e-4 | 0.8680 | 0.8718 | 0.8680 | -3.78e-3 | 0.7379 | 0.7382 | 0.7379 | -2.18e-4 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9595 | 0.9574 | 0.9595 | 2.13e-3 | 0.6975 | 0.6848 | 0.6975 | 1.27e-2 | 0.3883 | 0.3720 | 0.3883 | 1.63e-2 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9097 | 0.9072 | 0.9097 | 2.56e-3 | 0.4403 | 0.4249 | 0.4403 | 1.54e-2 | 0.1651 | 0.1543 | 0.1651 | 1.09e-2 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9688 | 0.9680 | 0.9688 | 8.56e-4 | 0.7718 | 0.7661 | 0.7718 | 5.65e-3 | 0.5509 | 0.5423 | 0.5509 | 8.57e-3 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9265 | 0.9280 | 0.9265 | -1.51e-3 | 0.5313 | 0.5443 | 0.5313 | -1.30e-2 | 0.3420 | 0.3562 | 0.3420 | -1.42e-2 |
| nikon-z-24-70f4s-wide-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9441 | 0.9435 | 0.9441 | 5.52e-4 | 0.6105 | 0.6065 | 0.6105 | 3.98e-3 | 0.3309 | 0.3245 | 0.3309 | 6.39e-3 |
| nikon-z-24-70f4s-wide-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9441 | 0.9435 | 0.9441 | 5.52e-4 | 0.6105 | 0.6065 | 0.6105 | 3.98e-3 | 0.3309 | 0.3245 | 0.3309 | 6.39e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9530 | 0.9528 | 0.9530 | 1.04e-4 | 0.6665 | 0.6668 | 0.6665 | -2.66e-4 | 0.3988 | 0.4015 | 0.3988 | -2.72e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9762 | 0.9757 | 0.9762 | 4.15e-4 | 0.8147 | 0.8122 | 0.8147 | 2.51e-3 | 0.6118 | 0.6090 | 0.6118 | 2.77e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8082 | 0.8070 | 0.8082 | 1.22e-3 | 0.1070 | 0.1112 | 0.1070 | -4.23e-3 | 0.2859 | 0.2878 | 0.2859 | -1.88e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6689 | 0.6693 | 0.6689 | -4.28e-4 | 0.2995 | 0.3058 | 0.2995 | -6.30e-3 | 0.1946 | 0.1993 | 0.1946 | -4.71e-3 |
| nikon-z-24-70f4s-wide-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9524 | 0.9523 | 0.9524 | 9.96e-5 | 0.6593 | 0.6578 | 0.6593 | 1.51e-3 | 0.3838 | 0.3793 | 0.3838 | 4.52e-3 |
| nikon-z-24-70f4s-wide-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9524 | 0.9523 | 0.9524 | 9.96e-5 | 0.6593 | 0.6578 | 0.6593 | 1.51e-3 | 0.3838 | 0.3793 | 0.3838 | 4.52e-3 |
| nikon-z-24-70f4s-wide-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9581 | 0.9584 | 0.9581 | -2.45e-4 | 0.7021 | 0.7040 | 0.7021 | -1.90e-3 | 0.4603 | 0.4639 | 0.4603 | -3.58e-3 |
| nikon-z-24-70f4s-wide-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9719 | 0.9721 | 0.9719 | -1.91e-4 | 0.7812 | 0.7824 | 0.7812 | -1.24e-3 | 0.5403 | 0.5422 | 0.5403 | -1.92e-3 |
| nikon-z-24-70f4s-wide-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8330 | 0.8327 | 0.8330 | 2.70e-4 | 0.0100 | 0.0110 | 0.0100 | -9.90e-4 | 0.3042 | 0.3054 | 0.3042 | -1.27e-3 |
| nikon-z-24-70f4s-wide-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6456 | 0.6451 | 0.6456 | 4.24e-4 | 0.2049 | 0.2085 | 0.2049 | -3.53e-3 | 0.1019 | 0.1041 | 0.1019 | -2.22e-3 |
| nikon-z-24-70f4s-tele-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9930 | 0.9934 | 0.9930 | -3.77e-4 | 0.9438 | 0.9460 | 0.9438 | -2.17e-3 | 0.8740 | 0.8750 | 0.8740 | -9.97e-4 |
| nikon-z-24-70f4s-tele-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9930 | 0.9934 | 0.9930 | -3.77e-4 | 0.9438 | 0.9460 | 0.9438 | -2.17e-3 | 0.8740 | 0.8750 | 0.8740 | -9.97e-4 |
| nikon-z-24-70f4s-tele-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9206 | 0.9158 | 0.9206 | 4.72e-3 | 0.6611 | 0.6518 | 0.6611 | 9.26e-3 | 0.5217 | 0.5115 | 0.5217 | 1.02e-2 |
| nikon-z-24-70f4s-tele-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9699 | 0.9687 | 0.9699 | 1.20e-3 | 0.7919 | 0.7850 | 0.7919 | 6.82e-3 | 0.5817 | 0.5760 | 0.5817 | 5.66e-3 |
| nikon-z-24-70f4s-tele-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6344 | 0.6252 | 0.6344 | 9.18e-3 | 0.4552 | 0.4470 | 0.4552 | 8.22e-3 | 0.3712 | 0.3643 | 0.3712 | 6.84e-3 |
| nikon-z-24-70f4s-tele-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9499 | 0.9485 | 0.9499 | 1.42e-3 | 0.6508 | 0.6428 | 0.6508 | 8.01e-3 | 0.3621 | 0.3522 | 0.3621 | 9.93e-3 |
| nikon-z-24-70f4s-tele-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9936 | 0.9940 | 0.9936 | -4.50e-4 | 0.9475 | 0.9505 | 0.9475 | -3.04e-3 | 0.8773 | 0.8815 | 0.8773 | -4.23e-3 |
| nikon-z-24-70f4s-tele-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9936 | 0.9940 | 0.9936 | -4.50e-4 | 0.9475 | 0.9505 | 0.9475 | -3.04e-3 | 0.8773 | 0.8815 | 0.8773 | -4.23e-3 |
| nikon-z-24-70f4s-tele-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9261 | 0.9219 | 0.9261 | 4.23e-3 | 0.6592 | 0.6516 | 0.6592 | 7.61e-3 | 0.5096 | 0.4993 | 0.5096 | 1.02e-2 |
| nikon-z-24-70f4s-tele-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9589 | 0.9566 | 0.9589 | 2.28e-3 | 0.7729 | 0.7652 | 0.7729 | 7.67e-3 | 0.5624 | 0.5579 | 0.5624 | 4.51e-3 |
| nikon-z-24-70f4s-tele-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6488 | 0.6400 | 0.6488 | 8.80e-3 | 0.4713 | 0.4634 | 0.4713 | 7.88e-3 | 0.3916 | 0.3853 | 0.3916 | 6.26e-3 |
| nikon-z-24-70f4s-tele-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9201 | 0.9174 | 0.9201 | 2.64e-3 | 0.5621 | 0.5549 | 0.5621 | 7.19e-3 | 0.2673 | 0.2636 | 0.2673 | 3.70e-3 |
| nikon-z-mc-105f28-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9857 | 0.9855 | 0.9857 | 1.88e-4 | 0.8770 | 0.8754 | 0.8770 | 1.61e-3 | 0.6875 | 0.6835 | 0.6875 | 4.07e-3 |
| nikon-z-mc-105f28-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9857 | 0.9855 | 0.9857 | 1.88e-4 | 0.8770 | 0.8754 | 0.8770 | 1.61e-3 | 0.6875 | 0.6835 | 0.6875 | 4.07e-3 |
| nikon-z-mc-105f28-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9867 | 0.9863 | 0.9867 | 3.34e-4 | 0.8876 | 0.8849 | 0.8876 | 2.75e-3 | 0.7256 | 0.7192 | 0.7256 | 6.40e-3 |
| nikon-z-mc-105f28-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9969 | 0.9968 | 0.9969 | 8.64e-5 | 0.9726 | 0.9719 | 0.9726 | 7.25e-4 | 0.9253 | 0.9236 | 0.9253 | 1.74e-3 |
| nikon-z-mc-105f28-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8508 | 0.8479 | 0.8508 | 2.87e-3 | 0.4237 | 0.4176 | 0.4237 | 6.04e-3 | 0.3521 | 0.3503 | 0.3521 | 1.83e-3 |
| nikon-z-mc-105f28-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9579 | 0.9580 | 0.9579 | -9.99e-5 | 0.6878 | 0.6889 | 0.6878 | -1.12e-3 | 0.4340 | 0.4367 | 0.4340 | -2.72e-3 |
| nikon-z-mc-105f28-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9838 | 0.9837 | 0.9838 | 1.09e-4 | 0.8613 | 0.8603 | 0.8613 | 9.82e-4 | 0.6526 | 0.6499 | 0.6526 | 2.65e-3 |
| nikon-z-mc-105f28-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9838 | 0.9837 | 0.9838 | 1.09e-4 | 0.8613 | 0.8603 | 0.8613 | 9.82e-4 | 0.6526 | 0.6499 | 0.6526 | 2.65e-3 |
| nikon-z-mc-105f28-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9862 | 0.9859 | 0.9862 | 2.68e-4 | 0.8828 | 0.8806 | 0.8828 | 2.27e-3 | 0.7116 | 0.7061 | 0.7116 | 5.53e-3 |
| nikon-z-mc-105f28-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9929 | 0.9928 | 0.9929 | 1.22e-4 | 0.9377 | 0.9367 | 0.9377 | 9.43e-4 | 0.8362 | 0.8343 | 0.8362 | 1.92e-3 |
| nikon-z-mc-105f28-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8526 | 0.8498 | 0.8526 | 2.79e-3 | 0.3976 | 0.3908 | 0.3976 | 6.79e-3 | 0.3247 | 0.3227 | 0.3247 | 1.97e-3 |
| nikon-z-mc-105f28-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9357 | 0.9358 | 0.9357 | -1.58e-4 | 0.5632 | 0.5643 | 0.5632 | -1.19e-3 | 0.2808 | 0.2822 | 0.2808 | -1.40e-3 |
| nikon-z-135f18-plena-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9844 | 0.9833 | 0.9844 | 1.13e-3 | 0.8726 | 0.8636 | 0.8726 | 8.93e-3 | 0.7082 | 0.6890 | 0.7082 | 1.92e-2 |
| nikon-z-135f18-plena-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9844 | 0.9833 | 0.9844 | 1.13e-3 | 0.8726 | 0.8636 | 0.8726 | 8.93e-3 | 0.7082 | 0.6890 | 0.7082 | 1.92e-2 |
| nikon-z-135f18-plena-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9682 | 0.9663 | 0.9682 | 1.92e-3 | 0.7604 | 0.7463 | 0.7604 | 1.41e-2 | 0.5223 | 0.4967 | 0.5223 | 2.56e-2 |
| nikon-z-135f18-plena-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9855 | 0.9845 | 0.9855 | 1.01e-3 | 0.8944 | 0.8871 | 0.8944 | 7.32e-3 | 0.8037 | 0.7912 | 0.8037 | 1.25e-2 |
| nikon-z-135f18-plena-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9262 | 0.9218 | 0.9262 | 4.38e-3 | 0.5087 | 0.4844 | 0.5087 | 2.43e-2 | 0.1807 | 0.1557 | 0.1807 | 2.51e-2 |
| nikon-z-135f18-plena-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8504 | 0.8439 | 0.8504 | 6.54e-3 | 0.4437 | 0.4296 | 0.4437 | 1.40e-2 | 0.3223 | 0.3120 | 0.3223 | 1.03e-2 |
| nikon-z-135f18-plena-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9887 | 0.9877 | 0.9887 | 9.46e-4 | 0.9056 | 0.8979 | 0.9056 | 7.63e-3 | 0.7749 | 0.7579 | 0.7749 | 1.70e-2 |
| nikon-z-135f18-plena-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9887 | 0.9877 | 0.9887 | 9.46e-4 | 0.9056 | 0.8979 | 0.9056 | 7.63e-3 | 0.7749 | 0.7579 | 0.7749 | 1.70e-2 |
| nikon-z-135f18-plena-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9735 | 0.9727 | 0.9735 | 8.21e-4 | 0.8012 | 0.7934 | 0.8012 | 7.88e-3 | 0.6026 | 0.5826 | 0.6026 | 2.00e-2 |
| nikon-z-135f18-plena-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9866 | 0.9848 | 0.9866 | 1.79e-3 | 0.9005 | 0.8912 | 0.9005 | 9.28e-3 | 0.8095 | 0.8019 | 0.8095 | 7.69e-3 |
| nikon-z-135f18-plena-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9310 | 0.9271 | 0.9310 | 3.95e-3 | 0.5467 | 0.5248 | 0.5467 | 2.19e-2 | 0.2529 | 0.2293 | 0.2529 | 2.37e-2 |
| nikon-z-135f18-plena-photopic | 1 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.8350 | 0.8280 | 0.8350 | 6.98e-3 | 0.4367 | 0.4233 | 0.4367 | 1.33e-2 | 0.3198 | 0.3090 | 0.3198 | 1.08e-2 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9278 | 0.9292 | 0.9278 | -1.42e-3 | 0.7092 | 0.7104 | 0.7092 | -1.20e-3 | 0.6563 | 0.6582 | 0.6563 | -1.88e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9278 | 0.9292 | 0.9278 | -1.42e-3 | 0.7092 | 0.7104 | 0.7092 | -1.20e-3 | 0.6563 | 0.6582 | 0.6563 | -1.88e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9300 | 0.9310 | 0.9300 | -1.03e-3 | 0.5964 | 0.5993 | 0.5964 | -2.88e-3 | 0.3365 | 0.3372 | 0.3365 | -7.37e-4 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9636 | 0.9647 | 0.9636 | -1.15e-3 | 0.7978 | 0.7998 | 0.7978 | -1.96e-3 | 0.6550 | 0.6556 | 0.6550 | -6.10e-4 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8207 | 0.8205 | 0.8207 | 1.37e-4 | 0.4173 | 0.4169 | 0.4173 | 4.41e-4 | 0.4013 | 0.4028 | 0.4013 | -1.50e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8625 | 0.8628 | 0.8625 | -2.46e-4 | 0.3293 | 0.3300 | 0.3293 | -6.57e-4 | 0.0839 | 0.0834 | 0.0839 | 4.41e-4 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9101 | 0.9127 | 0.9101 | -2.65e-3 | 0.6747 | 0.6771 | 0.6747 | -2.36e-3 | 0.5861 | 0.5898 | 0.5861 | -3.71e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9101 | 0.9127 | 0.9101 | -2.65e-3 | 0.6747 | 0.6771 | 0.6747 | -2.36e-3 | 0.5861 | 0.5898 | 0.5861 | -3.71e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9129 | 0.9138 | 0.9129 | -9.03e-4 | 0.5388 | 0.5412 | 0.5388 | -2.43e-3 | 0.2635 | 0.2646 | 0.2635 | -1.04e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9524 | 0.9536 | 0.9524 | -1.18e-3 | 0.7590 | 0.7607 | 0.7590 | -1.79e-3 | 0.5882 | 0.5898 | 0.5882 | -1.54e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8256 | 0.8271 | 0.8256 | -1.49e-3 | 0.4068 | 0.4109 | 0.4068 | -4.01e-3 | 0.4053 | 0.4054 | 0.4053 | -9.22e-5 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8421 | 0.8424 | 0.8421 | -3.34e-4 | 0.3394 | 0.3398 | 0.3394 | -4.60e-4 | 0.1082 | 0.1058 | 0.1082 | 2.38e-3 |
| canon-ef-135-f2l-usm-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9992 | 0.9993 | 4.45e-5 | 0.9936 | 0.9932 | 0.9936 | 3.98e-4 | 0.9824 | 0.9813 | 0.9824 | 1.09e-3 |
| canon-ef-135-f2l-usm-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9992 | 0.9993 | 4.45e-5 | 0.9936 | 0.9932 | 0.9936 | 3.98e-4 | 0.9824 | 0.9813 | 0.9824 | 1.09e-3 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9826 | 0.9828 | 0.9826 | -1.99e-4 | 0.8513 | 0.8529 | 0.8513 | -1.64e-3 | 0.6281 | 0.6319 | 0.6281 | -3.75e-3 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9904 | 0.9907 | 0.9904 | -3.45e-4 | 0.9168 | 0.9198 | 0.9168 | -2.98e-3 | 0.7864 | 0.7940 | 0.7864 | -7.62e-3 |
| canon-ef-135-f2l-usm-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9542 | 0.9534 | 0.9542 | 8.21e-4 | 0.6782 | 0.6747 | 0.6782 | 3.54e-3 | 0.3876 | 0.3857 | 0.3876 | 1.89e-3 |
| canon-ef-135-f2l-usm-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9740 | 0.9740 | 0.9740 | -4.28e-5 | 0.7819 | 0.7823 | 0.7819 | -4.11e-4 | 0.4744 | 0.4757 | 0.4744 | -1.28e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9616 | 0.9602 | 0.9616 | 1.40e-3 | 0.7706 | 0.7646 | 0.7706 | 6.08e-3 | 0.6293 | 0.6229 | 0.6293 | 6.40e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9616 | 0.9602 | 0.9616 | 1.40e-3 | 0.7706 | 0.7646 | 0.7706 | 6.08e-3 | 0.6293 | 0.6229 | 0.6293 | 6.40e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9657 | 0.9650 | 0.9657 | 6.49e-4 | 0.7545 | 0.7506 | 0.7545 | 3.98e-3 | 0.4995 | 0.4938 | 0.4995 | 5.65e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9666 | 0.9650 | 0.9666 | 1.70e-3 | 0.7685 | 0.7599 | 0.7685 | 8.62e-3 | 0.5527 | 0.5443 | 0.5527 | 8.39e-3 |
| canon-ef-135-f2l-usm-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9321 | 0.9296 | 0.9321 | 2.57e-3 | 0.6520 | 0.6403 | 0.6520 | 1.17e-2 | 0.4330 | 0.4269 | 0.4330 | 6.17e-3 |
| canon-ef-135-f2l-usm-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9723 | 0.9719 | 0.9723 | 4.14e-4 | 0.7772 | 0.7746 | 0.7772 | 2.67e-3 | 0.4951 | 0.4919 | 0.4951 | 3.22e-3 |
| canon-ef-135-f2l-usm-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.11e-6 | 0.9994 | 0.9994 | 0.9994 | -1.00e-5 | 0.9984 | 0.9984 | 0.9984 | -2.78e-5 |
| canon-ef-135-f2l-usm-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.11e-6 | 0.9994 | 0.9994 | 0.9994 | -1.00e-5 | 0.9984 | 0.9984 | 0.9984 | -2.78e-5 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9936 | 0.9936 | 0.9936 | -3.99e-5 | 0.9435 | 0.9438 | 0.9435 | -3.46e-4 | 0.8483 | 0.8492 | 0.8483 | -8.92e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9938 | 0.9937 | 0.9938 | 4.00e-5 | 0.9449 | 0.9445 | 0.9449 | 3.46e-4 | 0.8523 | 0.8514 | 0.8523 | 8.88e-4 |
| canon-ef-135-f2l-usm-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9831 | 0.9831 | 0.9831 | -1.45e-5 | 0.8550 | 0.8551 | 0.8550 | -1.23e-4 | 0.6322 | 0.6325 | 0.6322 | -2.97e-4 |
| canon-ef-135-f2l-usm-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9750 | 0.9751 | 0.9750 | -6.04e-5 | 0.7891 | 0.7897 | 0.7891 | -5.36e-4 | 0.4847 | 0.4862 | 0.4847 | -1.51e-3 |
| canon-ef-135-f2l-usm-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9969 | 0.9969 | 0.9969 | -2.84e-5 | 0.9724 | 0.9727 | 0.9724 | -2.49e-4 | 0.9253 | 0.9260 | 0.9253 | -6.54e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9969 | 0.9969 | 0.9969 | -2.84e-5 | 0.9724 | 0.9727 | 0.9724 | -2.49e-4 | 0.9253 | 0.9260 | 0.9253 | -6.54e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9879 | 0.9879 | 0.9879 | -4.51e-5 | 0.8954 | 0.8958 | 0.8954 | -3.68e-4 | 0.7333 | 0.7341 | 0.7333 | -8.35e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9863 | 0.9863 | 0.9863 | 1.17e-6 | 0.8821 | 0.8821 | 0.8821 | 2.22e-5 | 0.7023 | 0.7022 | 0.7023 | 1.14e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9779 | 0.9779 | 0.9779 | -3.22e-5 | 0.8142 | 0.8145 | 0.8142 | -2.67e-4 | 0.5488 | 0.5494 | 0.5488 | -6.25e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9677 | 0.9678 | 0.9677 | -9.78e-5 | 0.7356 | 0.7364 | 0.7356 | -8.65e-4 | 0.3935 | 0.3960 | 0.3935 | -2.46e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.19e-9 | 1.0000 | 1.0000 | 1.0000 | -8.27e-8 | 1.0000 | 1.0000 | 1.0000 | -2.30e-7 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.19e-9 | 1.0000 | 1.0000 | 1.0000 | -8.27e-8 | 1.0000 | 1.0000 | 1.0000 | -2.30e-7 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9948 | 0.9948 | 0.9948 | -3.17e-5 | 0.9539 | 0.9542 | 0.9539 | -2.77e-4 | 0.8756 | 0.8763 | 0.8756 | -7.24e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9949 | 0.9949 | 0.9949 | 3.41e-5 | 0.9550 | 0.9547 | 0.9550 | 2.97e-4 | 0.8787 | 0.8779 | 0.8787 | 7.72e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9851 | 0.9851 | 0.9851 | -1.66e-5 | 0.8711 | 0.8713 | 0.8711 | -1.42e-4 | 0.6698 | 0.6702 | 0.6698 | -3.48e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9775 | 0.9775 | 0.9775 | -5.64e-5 | 0.8084 | 0.8089 | 0.8084 | -5.02e-4 | 0.5258 | 0.5272 | 0.5258 | -1.41e-3 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9979 | 0.9980 | 0.9979 | -1.36e-5 | 0.9818 | 0.9819 | 0.9818 | -1.18e-4 | 0.9512 | 0.9515 | 0.9512 | -3.05e-4 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9979 | 0.9980 | 0.9979 | -1.36e-5 | 0.9818 | 0.9819 | 0.9818 | -1.18e-4 | 0.9512 | 0.9515 | 0.9512 | -3.05e-4 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9935 | 0.9935 | 0.9935 | -2.37e-5 | 0.9430 | 0.9432 | 0.9430 | -2.02e-4 | 0.8493 | 0.8498 | 0.8493 | -5.05e-4 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9917 | 0.9917 | 0.9917 | -4.91e-7 | 0.9279 | 0.9279 | 0.9279 | -4.71e-7 | 0.8117 | 0.8117 | 0.8117 | 1.73e-5 |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9863 | 0.9864 | 0.9863 | -3.11e-5 | 0.8822 | 0.8825 | 0.8822 | -2.64e-4 | 0.7004 | 0.7010 | 0.7004 | -6.51e-4 |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9781 | 0.9782 | 0.9781 | -7.93e-5 | 0.8157 | 0.8164 | 0.8157 | -7.05e-4 | 0.5521 | 0.5541 | 0.5521 | -1.95e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9928 | 0.9930 | 0.9928 | -1.50e-4 | 0.9394 | 0.9407 | 0.9394 | -1.30e-3 | 0.8510 | 0.8543 | 0.8510 | -3.22e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9928 | 0.9930 | 0.9928 | -1.50e-4 | 0.9394 | 0.9407 | 0.9394 | -1.30e-3 | 0.8510 | 0.8543 | 0.8510 | -3.22e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9215 | 0.9234 | 0.9215 | -1.91e-3 | 0.6252 | 0.6296 | 0.6252 | -4.45e-3 | 0.3343 | 0.3373 | 0.3343 | -3.03e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8664 | 0.8726 | 0.8664 | -6.21e-3 | 0.7290 | 0.7352 | 0.7290 | -6.19e-3 | 0.6275 | 0.6324 | 0.6275 | -4.88e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6108 | 0.6132 | 0.6108 | -2.36e-3 | 0.3797 | 0.3803 | 0.3797 | -5.66e-4 | 0.2849 | 0.2841 | 0.2849 | 7.75e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9421 | 0.9408 | 0.9421 | 1.33e-3 | 0.6549 | 0.6520 | 0.6549 | 2.87e-3 | 0.3662 | 0.3649 | 0.3662 | 1.35e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9883 | 0.9881 | -2.12e-4 | 0.9073 | 0.9089 | 0.9073 | -1.62e-3 | 0.7921 | 0.7953 | 0.7921 | -3.25e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9883 | 0.9881 | -2.12e-4 | 0.9073 | 0.9089 | 0.9073 | -1.62e-3 | 0.7921 | 0.7953 | 0.7921 | -3.25e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9176 | 0.9199 | 0.9176 | -2.36e-3 | 0.6138 | 0.6179 | 0.6138 | -4.05e-3 | 0.3238 | 0.3277 | 0.3238 | -3.91e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8694 | 0.8759 | 0.8694 | -6.50e-3 | 0.6962 | 0.7027 | 0.6962 | -6.51e-3 | 0.5507 | 0.5550 | 0.5507 | -4.27e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6096 | 0.6123 | 0.6096 | -2.70e-3 | 0.3791 | 0.3795 | 0.3791 | -4.15e-4 | 0.2810 | 0.2810 | 0.2810 | -6.62e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8926 | 0.8911 | 0.8926 | 1.52e-3 | 0.4912 | 0.4908 | 0.4912 | 4.49e-4 | 0.2214 | 0.2228 | 0.2214 | -1.42e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -1.99e-5 | 0.9928 | 0.9930 | 0.9928 | -1.78e-4 | 0.9802 | 0.9807 | 0.9802 | -4.87e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -1.99e-5 | 0.9928 | 0.9930 | 0.9928 | -1.78e-4 | 0.9802 | 0.9807 | 0.9802 | -4.87e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9789 | 0.9791 | 0.9789 | -1.61e-4 | 0.8217 | 0.8230 | 0.8217 | -1.29e-3 | 0.5610 | 0.5638 | 0.5610 | -2.80e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | -2.09e-5 | 0.9833 | 0.9835 | 0.9833 | -1.87e-4 | 0.9548 | 0.9553 | 0.9548 | -5.12e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9960 | 0.9960 | 0.9960 | -2.19e-5 | 0.9647 | 0.9649 | 0.9647 | -2.01e-4 | 0.9053 | 0.9058 | 0.9053 | -5.77e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9939 | 0.9940 | 0.9939 | -8.13e-6 | 0.9463 | 0.9463 | 0.9463 | -6.92e-5 | 0.8550 | 0.8552 | 0.8550 | -1.69e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9986 | 0.9986 | 0.9986 | -1.95e-5 | 0.9873 | 0.9875 | 0.9873 | -1.73e-4 | 0.9653 | 0.9658 | 0.9653 | -4.67e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9986 | 0.9986 | 0.9986 | -1.95e-5 | 0.9873 | 0.9875 | 0.9873 | -1.73e-4 | 0.9653 | 0.9658 | 0.9653 | -4.67e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9780 | 0.9781 | 0.9780 | -1.54e-4 | 0.8147 | 0.8159 | 0.8147 | -1.22e-3 | 0.5495 | 0.5521 | 0.5495 | -2.61e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9950 | 0.9950 | 0.9950 | 9.38e-7 | 0.9567 | 0.9567 | 0.9567 | -3.92e-6 | 0.8871 | 0.8871 | 0.8871 | -7.41e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9954 | 0.9954 | 0.9954 | -2.86e-5 | 0.9591 | 0.9593 | 0.9591 | -2.55e-4 | 0.8909 | 0.8916 | 0.8909 | -6.94e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9708 | 0.9712 | 0.9708 | -4.08e-4 | 0.7797 | 0.7824 | 0.7797 | -2.72e-3 | 0.5584 | 0.5627 | 0.5584 | -4.34e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.70e-6 | 0.9993 | 0.9993 | 0.9993 | -1.53e-5 | 0.9980 | 0.9980 | 0.9980 | -4.24e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.70e-6 | 0.9993 | 0.9993 | 0.9993 | -1.53e-5 | 0.9980 | 0.9980 | 0.9980 | -4.24e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9859 | 0.9860 | 0.9859 | -7.39e-5 | 0.8781 | 0.8787 | 0.8781 | -6.03e-4 | 0.6886 | 0.6899 | 0.6886 | -1.36e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | 5.85e-6 | 0.9921 | 0.9920 | 0.9921 | 5.16e-5 | 0.9782 | 0.9780 | 0.9782 | 1.38e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9963 | 0.9963 | 0.9963 | -2.92e-5 | 0.9668 | 0.9670 | 0.9668 | -2.58e-4 | 0.9101 | 0.9108 | 0.9101 | -6.86e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9903 | 0.9903 | 0.9903 | 4.04e-6 | 0.9144 | 0.9143 | 0.9144 | 4.12e-5 | 0.7722 | 0.7721 | 0.7722 | 1.45e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -4.11e-6 | 0.9950 | 0.9951 | 0.9950 | -3.68e-5 | 0.9863 | 0.9864 | 0.9863 | -1.01e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -4.11e-6 | 0.9950 | 0.9951 | 0.9950 | -3.68e-5 | 0.9863 | 0.9864 | 0.9863 | -1.01e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9856 | 0.9857 | 0.9856 | -1.02e-4 | 0.8761 | 0.8770 | 0.8761 | -8.47e-4 | 0.6861 | 0.6881 | 0.6861 | -2.00e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9969 | 0.9969 | 0.9969 | 3.85e-6 | 0.9726 | 0.9726 | 0.9726 | 3.05e-5 | 0.9269 | 0.9269 | 0.9269 | 6.33e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9956 | 0.9956 | 0.9956 | -1.26e-5 | 0.9610 | 0.9611 | 0.9610 | -1.13e-4 | 0.8957 | 0.8960 | 0.8957 | -3.10e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9704 | 0.9708 | 0.9704 | -3.50e-4 | 0.7789 | 0.7813 | 0.7789 | -2.39e-3 | 0.5689 | 0.5729 | 0.5689 | -3.98e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -2.02e-6 | 0.9983 | 0.9984 | 0.9983 | -1.82e-5 | 0.9954 | 0.9954 | 0.9954 | -5.06e-5 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -2.02e-6 | 0.9983 | 0.9984 | 0.9983 | -1.82e-5 | 0.9954 | 0.9954 | 0.9954 | -5.06e-5 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9242 | 0.9237 | 0.9242 | 4.65e-4 | 0.6632 | 0.6590 | 0.6632 | 4.21e-3 | 0.4008 | 0.3998 | 0.4008 | 9.90e-4 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9606 | 0.9596 | 0.9606 | 1.05e-3 | 0.7446 | 0.7394 | 0.7446 | 5.20e-3 | 0.5534 | 0.5461 | 0.5534 | 7.33e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | sagittal | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.5149 | 0.5064 | 0.5149 | 8.52e-3 | 0.3690 | 0.3629 | 0.3690 | 6.14e-3 | 0.3202 | 0.3154 | 0.3202 | 4.86e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | tangential | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.7029 | 0.6968 | 0.7029 | 6.07e-3 | 0.5411 | 0.5314 | 0.5411 | 9.70e-3 | 0.4565 | 0.4407 | 0.4565 | 1.59e-2 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9664 | 0.9659 | 0.9664 | 4.95e-4 | 0.7850 | 0.7828 | 0.7850 | 2.21e-3 | 0.6280 | 0.6254 | 0.6280 | 2.62e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9664 | 0.9659 | 0.9664 | 4.95e-4 | 0.7850 | 0.7828 | 0.7850 | 2.21e-3 | 0.6280 | 0.6254 | 0.6280 | 2.62e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8857 | 0.8823 | 0.8857 | 3.49e-3 | 0.6044 | 0.5969 | 0.6044 | 7.55e-3 | 0.3999 | 0.3948 | 0.3999 | 5.16e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9163 | 0.9151 | 0.9163 | 1.24e-3 | 0.5802 | 0.5741 | 0.5802 | 6.11e-3 | 0.3569 | 0.3502 | 0.3569 | 6.64e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | sagittal | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.4748 | 0.4675 | 0.4748 | 7.32e-3 | 0.3068 | 0.3019 | 0.3068 | 4.88e-3 | 0.2492 | 0.2450 | 0.2492 | 4.21e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | tangential | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.6701 | 0.6648 | 0.6701 | 5.33e-3 | 0.4208 | 0.4141 | 0.4208 | 6.72e-3 | 0.2602 | 0.2566 | 0.2602 | 3.65e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.03e-8 | 1.0000 | 1.0000 | 1.0000 | -9.30e-8 | 1.0000 | 1.0000 | 1.0000 | -2.58e-7 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.03e-8 | 1.0000 | 1.0000 | 1.0000 | -9.30e-8 | 1.0000 | 1.0000 | 1.0000 | -2.58e-7 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9900 | 0.9901 | 0.9900 | -1.91e-4 | 0.9119 | 0.9135 | 0.9119 | -1.65e-3 | 0.7675 | 0.7717 | 0.7675 | -4.23e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9996 | 0.9996 | 0.9996 | 5.73e-6 | 0.9962 | 0.9961 | 0.9962 | 5.12e-5 | 0.9894 | 0.9893 | 0.9894 | 1.41e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -6.49e-7 | 0.9951 | 0.9951 | 0.9951 | -5.86e-6 | 0.9865 | 0.9865 | 0.9865 | -1.63e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9988 | 0.9989 | 4.02e-5 | 0.9898 | 0.9895 | 0.9898 | 3.59e-4 | 0.9719 | 0.9709 | 0.9719 | 9.84e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | -1.10e-5 | 0.9892 | 0.9893 | 0.9892 | -9.80e-5 | 0.9704 | 0.9707 | 0.9704 | -2.66e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | -1.10e-5 | 0.9892 | 0.9893 | 0.9892 | -9.80e-5 | 0.9704 | 0.9707 | 0.9704 | -2.66e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9875 | 0.9875 | 0.9875 | -2.07e-6 | 0.8913 | 0.8913 | 0.8913 | -1.61e-5 | 0.7189 | 0.7189 | 0.7189 | -3.16e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9923 | 0.9923 | 0.9923 | 6.22e-6 | 0.9331 | 0.9331 | 0.9331 | 6.10e-5 | 0.8285 | 0.8283 | 0.8285 | 1.92e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -6.07e-6 | 0.9951 | 0.9952 | 0.9951 | -5.31e-5 | 0.9867 | 0.9868 | 0.9867 | -1.39e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9863 | 0.9863 | 0.9863 | 4.52e-5 | 0.8859 | 0.8855 | 0.8859 | 4.14e-4 | 0.7286 | 0.7274 | 0.7286 | 1.17e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.62e-10 | 1.0000 | 1.0000 | 1.0000 | -1.46e-9 | 1.0000 | 1.0000 | 1.0000 | -4.06e-9 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.62e-10 | 1.0000 | 1.0000 | 1.0000 | -1.46e-9 | 1.0000 | 1.0000 | 1.0000 | -4.06e-9 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9897 | 0.9899 | 0.9897 | -1.95e-4 | 0.9099 | 0.9116 | 0.9099 | -1.69e-3 | 0.7625 | 0.7668 | 0.7625 | -4.32e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9996 | 0.9996 | 0.9996 | 5.30e-6 | 0.9965 | 0.9965 | 0.9965 | 4.74e-5 | 0.9904 | 0.9903 | 0.9904 | 1.30e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -1.08e-6 | 0.9947 | 0.9947 | 0.9947 | -9.70e-6 | 0.9852 | 0.9853 | 0.9852 | -2.69e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9989 | 0.9989 | 3.91e-5 | 0.9902 | 0.9898 | 0.9902 | 3.50e-4 | 0.9728 | 0.9719 | 0.9728 | 9.58e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | -9.81e-6 | 0.9919 | 0.9920 | 0.9919 | -8.69e-5 | 0.9779 | 0.9781 | 0.9779 | -2.34e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | -9.81e-6 | 0.9919 | 0.9920 | 0.9919 | -8.69e-5 | 0.9779 | 0.9781 | 0.9779 | -2.34e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9909 | 0.9910 | 0.9909 | -9.21e-5 | 0.9206 | 0.9214 | 0.9206 | -7.92e-4 | 0.7908 | 0.7928 | 0.7908 | -2.00e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9916 | 0.9916 | 0.9916 | 1.95e-5 | 0.9277 | 0.9275 | 0.9277 | 1.59e-4 | 0.8171 | 0.8167 | 0.8171 | 3.61e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9996 | 0.9995 | -1.33e-5 | 0.9960 | 0.9961 | 0.9960 | -1.16e-4 | 0.9892 | 0.9895 | 0.9892 | -3.04e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9857 | 0.9857 | 0.9857 | 6.96e-5 | 0.8812 | 0.8806 | 0.8812 | 6.15e-4 | 0.7187 | 0.7171 | 0.7187 | 1.62e-3 |
| nikkor-z50f12-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9915 | 0.9916 | 0.9915 | -4.20e-5 | 0.9266 | 0.9269 | 0.9266 | -3.21e-4 | 0.8102 | 0.8109 | 0.8102 | -6.04e-4 |
| nikkor-z50f12-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9915 | 0.9916 | 0.9915 | -4.20e-5 | 0.9266 | 0.9269 | 0.9266 | -3.21e-4 | 0.8102 | 0.8109 | 0.8102 | -6.04e-4 |
| nikkor-z50f12-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9408 | 0.9376 | 0.9408 | 3.20e-3 | 0.7230 | 0.7109 | 0.7230 | 1.21e-2 | 0.6409 | 0.6305 | 0.6409 | 1.04e-2 |
| nikkor-z50f12-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9524 | 0.9510 | 0.9524 | 1.45e-3 | 0.7496 | 0.7476 | 0.7496 | 2.08e-3 | 0.5674 | 0.5646 | 0.5674 | 2.76e-3 |
| nikkor-z50f12-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.7988 | 0.7915 | 0.7988 | 7.33e-3 | 0.5346 | 0.5261 | 0.5346 | 8.51e-3 | 0.3166 | 0.3051 | 0.3166 | 1.14e-2 |
| nikkor-z50f12-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.8821 | 0.8841 | 0.8821 | -1.92e-3 | 0.5197 | 0.5195 | 0.5197 | 2.26e-4 | 0.2635 | 0.2664 | 0.2635 | -2.85e-3 |
| nikkor-z50f12-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9836 | 0.9831 | 0.9836 | 4.66e-4 | 0.8669 | 0.8633 | 0.8669 | 3.61e-3 | 0.6961 | 0.6886 | 0.6961 | 7.43e-3 |
| nikkor-z50f12-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9836 | 0.9831 | 0.9836 | 4.66e-4 | 0.8669 | 0.8633 | 0.8669 | 3.61e-3 | 0.6961 | 0.6886 | 0.6961 | 7.43e-3 |
| nikkor-z50f12-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9279 | 0.9244 | 0.9279 | 3.52e-3 | 0.6804 | 0.6692 | 0.6804 | 1.12e-2 | 0.5542 | 0.5436 | 0.5542 | 1.06e-2 |
| nikkor-z50f12-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9389 | 0.9373 | 0.9389 | 1.59e-3 | 0.6822 | 0.6799 | 0.6822 | 2.24e-3 | 0.4838 | 0.4842 | 0.4838 | -3.51e-4 |
| nikkor-z50f12-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.7906 | 0.7833 | 0.7906 | 7.34e-3 | 0.5226 | 0.5139 | 0.5226 | 8.68e-3 | 0.3051 | 0.2947 | 0.3051 | 1.04e-2 |
| nikkor-z50f12-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8661 | 0.8679 | 0.8661 | -1.73e-3 | 0.5187 | 0.5161 | 0.5187 | 2.65e-3 | 0.3086 | 0.3077 | 0.3086 | 8.81e-4 |
| nikkor-z50f12-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -8.92e-8 | 1.0000 | 1.0000 | 1.0000 | -8.03e-7 | 0.9999 | 0.9999 | 0.9999 | -2.23e-6 |
| nikkor-z50f12-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -8.92e-8 | 1.0000 | 1.0000 | 1.0000 | -8.03e-7 | 0.9999 | 0.9999 | 0.9999 | -2.23e-6 |
| nikkor-z50f12-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9979 | 0.9979 | 0.9979 | -7.92e-6 | 0.9813 | 0.9814 | 0.9813 | -7.02e-5 | 0.9487 | 0.9489 | 0.9487 | -1.89e-4 |
| nikkor-z50f12-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -4.69e-7 | 0.9995 | 0.9995 | 0.9995 | -4.23e-6 | 0.9985 | 0.9985 | 0.9985 | -1.17e-5 |
| nikkor-z50f12-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9785 | 0.9785 | 0.9785 | 7.05e-5 | 0.8176 | 0.8170 | 0.8176 | 5.65e-4 | 0.5479 | 0.5466 | 0.5479 | 1.23e-3 |
| nikkor-z50f12-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9959 | 0.9959 | 2.57e-5 | 0.9637 | 0.9635 | 0.9637 | 2.32e-4 | 0.9013 | 0.9006 | 0.9013 | 6.51e-4 |
| nikkor-z50f12-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -9.10e-6 | 0.9866 | 0.9866 | 0.9866 | -8.09e-5 | 0.9632 | 0.9634 | 0.9632 | -2.19e-4 |
| nikkor-z50f12-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -9.10e-6 | 0.9866 | 0.9866 | 0.9866 | -8.09e-5 | 0.9632 | 0.9634 | 0.9632 | -2.19e-4 |
| nikkor-z50f12-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9959 | 0.9959 | 5.76e-6 | 0.9635 | 0.9635 | 0.9635 | 5.06e-5 | 0.9017 | 0.9015 | 0.9017 | 1.34e-4 |
| nikkor-z50f12-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9869 | 0.9869 | 0.9869 | -1.14e-5 | 0.8876 | 0.8877 | 0.8876 | -9.28e-5 | 0.7154 | 0.7156 | 0.7154 | -2.05e-4 |
| nikkor-z50f12-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9760 | 0.9760 | 0.9760 | 8.36e-5 | 0.7981 | 0.7975 | 0.7981 | 6.56e-4 | 0.5084 | 0.5071 | 0.5084 | 1.36e-3 |
| nikkor-z50f12-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9837 | 0.9837 | 0.9837 | 3.26e-6 | 0.8609 | 0.8609 | 0.8609 | -6.51e-6 | 0.6491 | 0.6493 | 0.6491 | -1.53e-4 |
| nikkor-z50f12-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.32e-8 | 1.0000 | 1.0000 | 1.0000 | -1.19e-7 | 1.0000 | 1.0000 | 1.0000 | -3.30e-7 |
| nikkor-z50f12-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.32e-8 | 1.0000 | 1.0000 | 1.0000 | -1.19e-7 | 1.0000 | 1.0000 | 1.0000 | -3.30e-7 |
| nikkor-z50f12-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -7.47e-6 | 0.9824 | 0.9825 | 0.9824 | -6.63e-5 | 0.9517 | 0.9519 | 0.9517 | -1.79e-4 |
| nikkor-z50f12-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -3.96e-7 | 0.9995 | 0.9995 | 0.9995 | -3.57e-6 | 0.9987 | 0.9987 | 0.9987 | -9.90e-6 |
| nikkor-z50f12-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9789 | 0.9789 | 0.9789 | 6.98e-5 | 0.8208 | 0.8202 | 0.8208 | 5.61e-4 | 0.5548 | 0.5536 | 0.5548 | 1.22e-3 |
| nikkor-z50f12-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9961 | 0.9960 | 0.9961 | 2.55e-5 | 0.9649 | 0.9647 | 0.9649 | 2.30e-4 | 0.9046 | 0.9039 | 0.9046 | 6.44e-4 |
| nikkor-z50f12-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -9.02e-6 | 0.9908 | 0.9909 | 0.9908 | -7.98e-5 | 0.9748 | 0.9750 | 0.9748 | -2.14e-4 |
| nikkor-z50f12-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -9.02e-6 | 0.9908 | 0.9909 | 0.9908 | -7.98e-5 | 0.9748 | 0.9750 | 0.9748 | -2.14e-4 |
| nikkor-z50f12-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | 3.77e-6 | 0.9824 | 0.9824 | 0.9824 | 3.34e-5 | 0.9519 | 0.9518 | 0.9519 | 9.01e-5 |
| nikkor-z50f12-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9870 | 0.9870 | 0.9870 | -1.09e-5 | 0.8888 | 0.8889 | 0.8888 | -8.67e-5 | 0.7210 | 0.7212 | 0.7210 | -1.85e-4 |
| nikkor-z50f12-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9823 | 0.9822 | 0.9823 | 6.65e-5 | 0.8482 | 0.8477 | 0.8482 | 5.42e-4 | 0.6179 | 0.6167 | 0.6179 | 1.22e-3 |
| nikkor-z50f12-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9866 | 0.9866 | 0.9866 | -6.95e-6 | 0.8853 | 0.8854 | 0.8853 | -1.04e-4 | 0.7091 | 0.7096 | 0.7091 | -4.20e-4 |
| sony-fe-20mm-f18-g-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9726 | 0.9714 | 0.9726 | 1.20e-3 | 0.8061 | 0.7976 | 0.8061 | 8.48e-3 | 0.6343 | 0.6215 | 0.6343 | 1.28e-2 |
| sony-fe-20mm-f18-g-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9726 | 0.9714 | 0.9726 | 1.20e-3 | 0.8061 | 0.7976 | 0.8061 | 8.48e-3 | 0.6343 | 0.6215 | 0.6343 | 1.28e-2 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.8186 | 0.8113 | 0.8186 | 7.24e-3 | 0.2656 | 0.2557 | 0.2656 | 9.88e-3 | 0.2042 | 0.2019 | 0.2042 | 2.31e-3 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.6374 | 0.6280 | 0.6374 | 9.34e-3 | 0.3088 | 0.3122 | 0.3088 | -3.34e-3 | 0.1146 | 0.1238 | 0.1146 | -9.21e-3 |
| sony-fe-20mm-f18-g-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.5061 | 0.4965 | 0.5061 | 9.60e-3 | 0.2993 | 0.3040 | 0.2993 | -4.70e-3 | 0.0180 | 0.0194 | 0.0180 | -1.40e-3 |
| sony-fe-20mm-f18-g-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.1270 | 0.1350 | 0.1270 | -7.97e-3 | 0.1147 | 0.1166 | 0.1147 | -1.92e-3 | 0.1117 | 0.1120 | 0.1117 | -3.77e-4 |
| sony-fe-20mm-f18-g-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9708 | 0.9691 | 0.9708 | 1.69e-3 | 0.8038 | 0.7934 | 0.8038 | 1.04e-2 | 0.6476 | 0.6341 | 0.6476 | 1.35e-2 |
| sony-fe-20mm-f18-g-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9708 | 0.9691 | 0.9708 | 1.69e-3 | 0.8038 | 0.7934 | 0.8038 | 1.04e-2 | 0.6476 | 0.6341 | 0.6476 | 1.35e-2 |
| sony-fe-20mm-f18-g-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8139 | 0.8042 | 0.8139 | 9.67e-3 | 0.2776 | 0.2681 | 0.2776 | 9.52e-3 | 0.2025 | 0.1994 | 0.2025 | 3.05e-3 |
| sony-fe-20mm-f18-g-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.6299 | 0.6213 | 0.6299 | 8.55e-3 | 0.2882 | 0.2878 | 0.2882 | 3.70e-4 | 0.1066 | 0.1144 | 0.1066 | -7.81e-3 |
| sony-fe-20mm-f18-g-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.5089 | 0.4986 | 0.5089 | 1.02e-2 | 0.2863 | 0.2902 | 0.2863 | -3.93e-3 | 0.0219 | 0.0207 | 0.0219 | 1.19e-3 |
| sony-fe-20mm-f18-g-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.1236 | 0.1304 | 0.1236 | -6.79e-3 | 0.0761 | 0.0763 | 0.0761 | -1.71e-4 | 0.0478 | 0.0482 | 0.0478 | -4.73e-4 |
| sony-fe-20mm-f18-g-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -2.15e-8 | 1.0000 | 1.0000 | 1.0000 | -1.93e-7 | 1.0000 | 1.0000 | 1.0000 | -5.36e-7 |
| sony-fe-20mm-f18-g-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -2.15e-8 | 1.0000 | 1.0000 | 1.0000 | -1.93e-7 | 1.0000 | 1.0000 | 1.0000 | -5.36e-7 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9909 | 0.9909 | 0.9909 | 1.29e-6 | 0.9199 | 0.9198 | 0.9199 | 1.42e-5 | 0.7879 | 0.7879 | 0.7879 | 5.48e-5 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9838 | 0.9839 | 0.9838 | -5.66e-5 | 0.8610 | 0.8614 | 0.8610 | -4.34e-4 | 0.6471 | 0.6479 | 0.6471 | -8.31e-4 |
| sony-fe-20mm-f18-g-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9236 | 0.9235 | 0.9236 | 4.63e-5 | 0.4379 | 0.4374 | 0.4379 | 4.84e-4 | 0.0448 | 0.0461 | 0.0448 | -1.32e-3 |
| sony-fe-20mm-f18-g-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8474 | 0.8479 | 0.8474 | -5.51e-4 | 0.1087 | 0.1103 | 0.1087 | -1.63e-3 | 0.1052 | 0.1068 | 0.1052 | -1.61e-3 |
| sony-fe-20mm-f18-g-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -2.82e-6 | 0.9945 | 0.9945 | 0.9945 | -2.51e-5 | 0.9847 | 0.9848 | 0.9847 | -6.84e-5 |
| sony-fe-20mm-f18-g-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -2.82e-6 | 0.9945 | 0.9945 | 0.9945 | -2.51e-5 | 0.9847 | 0.9848 | 0.9847 | -6.84e-5 |
| sony-fe-20mm-f18-g-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9892 | 0.9891 | 0.9892 | 4.48e-5 | 0.9055 | 0.9051 | 0.9055 | 3.80e-4 | 0.7530 | 0.7520 | 0.7530 | 9.31e-4 |
| sony-fe-20mm-f18-g-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9813 | 0.9814 | 0.9813 | -3.90e-5 | 0.8412 | 0.8415 | 0.8412 | -3.08e-4 | 0.6052 | 0.6058 | 0.6052 | -6.37e-4 |
| sony-fe-20mm-f18-g-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9236 | 0.9225 | 0.9236 | 1.04e-3 | 0.4378 | 0.4319 | 0.4378 | 5.92e-3 | 0.0456 | 0.0505 | 0.0456 | -4.99e-3 |
| sony-fe-20mm-f18-g-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8351 | 0.8365 | 0.8351 | -1.39e-3 | 0.0838 | 0.0888 | 0.0838 | -4.97e-3 | 0.0845 | 0.0827 | 0.0845 | 1.71e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -4.12e-9 | 1.0000 | 1.0000 | 1.0000 | -3.71e-8 | 1.0000 | 1.0000 | 1.0000 | -1.03e-7 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -4.12e-9 | 1.0000 | 1.0000 | 1.0000 | -3.71e-8 | 1.0000 | 1.0000 | 1.0000 | -1.03e-7 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9910 | 0.9910 | 0.9910 | 1.23e-6 | 0.9207 | 0.9207 | 0.9207 | 1.37e-5 | 0.7901 | 0.7901 | 0.7901 | 5.31e-5 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9840 | 0.9840 | 0.9840 | -5.61e-5 | 0.8620 | 0.8625 | 0.8620 | -4.30e-4 | 0.6495 | 0.6503 | 0.6495 | -8.26e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9238 | 0.9238 | 0.9238 | 4.61e-5 | 0.4395 | 0.4390 | 0.4395 | 4.82e-4 | 0.0434 | 0.0447 | 0.0434 | -1.32e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8477 | 0.8482 | 0.8477 | -5.50e-4 | 0.1096 | 0.1112 | 0.1096 | -1.63e-3 | 0.1055 | 0.1071 | 0.1055 | -1.60e-3 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.26e-6 | 0.9961 | 0.9962 | 0.9961 | -2.91e-5 | 0.9893 | 0.9894 | 0.9893 | -7.95e-5 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.26e-6 | 0.9961 | 0.9962 | 0.9961 | -2.91e-5 | 0.9893 | 0.9894 | 0.9893 | -7.95e-5 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9917 | 0.9917 | 0.9917 | 3.42e-5 | 0.9271 | 0.9268 | 0.9271 | 2.94e-4 | 0.8069 | 0.8061 | 0.8069 | 7.41e-4 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9844 | 0.9844 | 0.9844 | -2.96e-5 | 0.8660 | 0.8662 | 0.8660 | -2.37e-4 | 0.6613 | 0.6618 | 0.6613 | -5.10e-4 |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9300 | 0.9291 | 0.9300 | 9.52e-4 | 0.4760 | 0.4704 | 0.4760 | 5.66e-3 | 0.0087 | 0.0142 | 0.0087 | -5.56e-3 |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8419 | 0.8433 | 0.8419 | -1.34e-3 | 0.1042 | 0.1091 | 0.1042 | -4.93e-3 | 0.0911 | 0.0893 | 0.0911 | 1.82e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -5.05e-7 | 0.9993 | 0.9993 | 0.9993 | -4.55e-6 | 0.9980 | 0.9980 | 0.9980 | -1.27e-5 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -5.05e-7 | 0.9993 | 0.9993 | 0.9993 | -4.55e-6 | 0.9980 | 0.9980 | 0.9980 | -1.27e-5 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9986 | 0.9986 | 0.9986 | 3.50e-5 | 0.9876 | 0.9873 | 0.9876 | 3.09e-4 | 0.9661 | 0.9653 | 0.9661 | 8.23e-4 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9982 | 0.9982 | 0.9982 | -2.13e-5 | 0.9841 | 0.9843 | 0.9841 | -1.91e-4 | 0.9564 | 0.9569 | 0.9564 | -5.30e-4 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9975 | 0.9974 | 0.9975 | 1.11e-4 | 0.9780 | 0.9770 | 0.9780 | 9.81e-4 | 0.9406 | 0.9380 | 0.9406 | 2.62e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9957 | 0.9957 | 0.9957 | 6.97e-5 | 0.9631 | 0.9626 | 0.9631 | 5.38e-4 | 0.9058 | 0.9047 | 0.9058 | 1.03e-3 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9980 | 0.9981 | 1.71e-5 | 0.9828 | 0.9826 | 0.9828 | 1.53e-4 | 0.9532 | 0.9528 | 0.9532 | 4.21e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9980 | 0.9981 | 1.71e-5 | 0.9828 | 0.9826 | 0.9828 | 1.53e-4 | 0.9532 | 0.9528 | 0.9532 | 4.21e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9963 | 0.9963 | 0.9963 | 4.75e-5 | 0.9678 | 0.9674 | 0.9678 | 3.91e-4 | 0.9163 | 0.9154 | 0.9163 | 9.06e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9964 | 0.9964 | 0.9964 | -7.51e-5 | 0.9684 | 0.9690 | 0.9684 | -6.09e-4 | 0.9183 | 0.9196 | 0.9183 | -1.37e-3 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9938 | 0.9936 | 0.9938 | 1.77e-4 | 0.9471 | 0.9458 | 0.9471 | 1.27e-3 | 0.8670 | 0.8646 | 0.8670 | 2.41e-3 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9919 | 0.9918 | 0.9919 | 2.51e-5 | 0.9298 | 0.9296 | 0.9298 | 2.02e-4 | 0.8201 | 0.8197 | 0.8201 | 4.12e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9941 | 0.9942 | 0.9941 | -7.57e-5 | 0.9480 | 0.9486 | 0.9480 | -6.60e-4 | 0.8600 | 0.8617 | 0.8600 | -1.71e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9941 | 0.9942 | 0.9941 | -7.57e-5 | 0.9480 | 0.9486 | 0.9480 | -6.60e-4 | 0.8600 | 0.8617 | 0.8600 | -1.71e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9955 | 0.9956 | 0.9955 | -4.78e-5 | 0.9604 | 0.9608 | 0.9604 | -4.18e-4 | 0.8926 | 0.8937 | 0.8926 | -1.09e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9965 | 0.9965 | 0.9965 | 2.43e-5 | 0.9691 | 0.9689 | 0.9691 | 2.17e-4 | 0.9161 | 0.9155 | 0.9161 | 5.96e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9950 | 0.9950 | 0.9950 | 2.45e-5 | 0.9559 | 0.9556 | 0.9559 | 2.20e-4 | 0.8813 | 0.8807 | 0.8813 | 6.06e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9952 | 0.9951 | 0.9952 | 6.58e-5 | 0.9576 | 0.9570 | 0.9576 | 5.88e-4 | 0.8867 | 0.8851 | 0.8867 | 1.61e-3 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9954 | 0.9954 | 0.9954 | -2.40e-5 | 0.9592 | 0.9594 | 0.9592 | -2.06e-4 | 0.8905 | 0.8910 | 0.8905 | -5.20e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9954 | 0.9954 | 0.9954 | -2.40e-5 | 0.9592 | 0.9594 | 0.9592 | -2.06e-4 | 0.8905 | 0.8910 | 0.8905 | -5.20e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9965 | 0.9965 | 0.9965 | -1.24e-5 | 0.9692 | 0.9693 | 0.9692 | -1.06e-4 | 0.9167 | 0.9169 | 0.9167 | -2.67e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9954 | 0.9954 | 0.9954 | 5.00e-7 | 0.9592 | 0.9592 | 0.9592 | 1.06e-5 | 0.8916 | 0.8916 | 0.8916 | 5.93e-5 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9962 | 0.9961 | 0.9962 | 3.26e-5 | 0.9660 | 0.9658 | 0.9660 | 2.87e-4 | 0.9088 | 0.9080 | 0.9088 | 7.64e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9914 | 0.9915 | 0.9914 | -4.04e-5 | 0.9264 | 0.9267 | 0.9264 | -2.83e-4 | 0.8133 | 0.8137 | 0.8133 | -4.20e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -4.66e-9 | 1.0000 | 1.0000 | 1.0000 | -4.19e-8 | 1.0000 | 1.0000 | 1.0000 | -1.17e-7 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -4.66e-9 | 1.0000 | 1.0000 | 1.0000 | -4.19e-8 | 1.0000 | 1.0000 | 1.0000 | -1.17e-7 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.20e-6 | 0.9990 | 0.9990 | 0.9990 | -1.08e-5 | 0.9971 | 0.9971 | 0.9971 | -2.99e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | 2.08e-7 | 0.9964 | 0.9964 | 0.9964 | 1.83e-6 | 0.9900 | 0.9900 | 0.9900 | 4.99e-6 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9997 | 0.9997 | 0.9997 | -2.39e-6 | 0.9969 | 0.9969 | 0.9969 | -2.15e-5 | 0.9913 | 0.9914 | 0.9913 | -5.94e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -3.54e-6 | 0.9945 | 0.9945 | 0.9945 | -3.18e-5 | 0.9847 | 0.9848 | 0.9847 | -8.79e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -8.89e-7 | 0.9966 | 0.9966 | 0.9966 | -7.89e-6 | 0.9906 | 0.9907 | 0.9906 | -2.13e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -8.89e-7 | 0.9966 | 0.9966 | 0.9966 | -7.89e-6 | 0.9906 | 0.9907 | 0.9906 | -2.13e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9996 | 0.9995 | -4.45e-6 | 0.9960 | 0.9960 | 0.9960 | -3.99e-5 | 0.9888 | 0.9889 | 0.9888 | -1.10e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | 1.26e-5 | 0.9831 | 0.9830 | 0.9831 | 1.12e-4 | 0.9537 | 0.9534 | 0.9537 | 3.06e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9993 | 0.9993 | -3.60e-6 | 0.9938 | 0.9938 | 0.9938 | -3.23e-5 | 0.9828 | 0.9828 | 0.9828 | -8.90e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9947 | 0.9947 | 0.9947 | 3.80e-5 | 0.9537 | 0.9534 | 0.9537 | 3.41e-4 | 0.8771 | 0.8762 | 0.8771 | 9.43e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9935 | 0.9941 | 0.9935 | -5.88e-4 | 0.9443 | 0.9487 | 0.9443 | -4.46e-3 | 0.8604 | 0.8690 | 0.8604 | -8.57e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9935 | 0.9941 | 0.9935 | -5.88e-4 | 0.9443 | 0.9487 | 0.9443 | -4.46e-3 | 0.8604 | 0.8690 | 0.8604 | -8.57e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9815 | 0.9817 | 0.9815 | -1.13e-4 | 0.8524 | 0.8523 | 0.8524 | 1.49e-4 | 0.6707 | 0.6662 | 0.6707 | 4.58e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9437 | 0.9429 | 0.9437 | 7.53e-4 | 0.6057 | 0.5989 | 0.6057 | 6.81e-3 | 0.3224 | 0.3108 | 0.3224 | 1.16e-2 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9625 | 0.9612 | 0.9625 | 1.24e-3 | 0.7570 | 0.7495 | 0.7570 | 7.43e-3 | 0.6050 | 0.5957 | 0.6050 | 9.37e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9503 | 0.9515 | 0.9503 | -1.21e-3 | 0.6549 | 0.6654 | 0.6549 | -1.06e-2 | 0.4531 | 0.4705 | 0.4531 | -1.74e-2 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9912 | 0.9917 | 0.9912 | -5.39e-4 | 0.9275 | 0.9312 | 0.9275 | -3.66e-3 | 0.8283 | 0.8338 | 0.8283 | -5.55e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9912 | 0.9917 | 0.9912 | -5.39e-4 | 0.9275 | 0.9312 | 0.9275 | -3.66e-3 | 0.8283 | 0.8338 | 0.8283 | -5.55e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9816 | 0.9818 | 0.9816 | -1.65e-4 | 0.8560 | 0.8561 | 0.8560 | -1.07e-4 | 0.6865 | 0.6824 | 0.6865 | 4.11e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9441 | 0.9429 | 0.9441 | 1.21e-3 | 0.6146 | 0.6065 | 0.6146 | 8.16e-3 | 0.3319 | 0.3221 | 0.3319 | 9.77e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9562 | 0.9547 | 0.9562 | 1.52e-3 | 0.7343 | 0.7261 | 0.7343 | 8.23e-3 | 0.6100 | 0.6015 | 0.6100 | 8.57e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9497 | 0.9510 | 0.9497 | -1.24e-3 | 0.6492 | 0.6597 | 0.6492 | -1.05e-2 | 0.4299 | 0.4466 | 0.4299 | -1.67e-2 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -2.13e-7 | 0.9998 | 0.9998 | 0.9998 | -1.92e-6 | 0.9996 | 0.9996 | 0.9996 | -5.32e-6 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -2.13e-7 | 0.9998 | 0.9998 | 0.9998 | -1.92e-6 | 0.9996 | 0.9996 | 0.9996 | -5.32e-6 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9933 | 0.9933 | 0.9933 | -2.87e-5 | 0.9404 | 0.9407 | 0.9404 | -2.50e-4 | 0.8399 | 0.8406 | 0.8399 | -6.45e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9881 | 0.9881 | 1.70e-5 | 0.8962 | 0.8960 | 0.8962 | 1.41e-4 | 0.7303 | 0.7299 | 0.7303 | 3.32e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9865 | 0.9864 | 0.9865 | 1.01e-5 | 0.8817 | 0.8817 | 0.8817 | 9.44e-5 | 0.6910 | 0.6907 | 0.6910 | 2.80e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9910 | 0.9909 | 0.9910 | 2.74e-5 | 0.9207 | 0.9205 | 0.9207 | 2.56e-4 | 0.7909 | 0.7901 | 0.7909 | 7.72e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -1.62e-6 | 0.9963 | 0.9963 | 0.9963 | -1.45e-5 | 0.9898 | 0.9899 | 0.9898 | -3.96e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -1.62e-6 | 0.9963 | 0.9963 | 0.9963 | -1.45e-5 | 0.9898 | 0.9899 | 0.9898 | -3.96e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9922 | 0.9923 | 0.9922 | -5.12e-5 | 0.9313 | 0.9317 | 0.9313 | -4.38e-4 | 0.8170 | 0.8181 | 0.8170 | -1.10e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9829 | 0.9829 | 0.9829 | -9.01e-6 | 0.8536 | 0.8537 | 0.8536 | -5.59e-5 | 0.6326 | 0.6326 | 0.6326 | -4.09e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9877 | 0.9877 | 0.9877 | 1.61e-5 | 0.8925 | 0.8923 | 0.8925 | 1.45e-4 | 0.7175 | 0.7171 | 0.7175 | 4.01e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9871 | 0.9870 | 0.9871 | 5.54e-5 | 0.8888 | 0.8883 | 0.8888 | 4.84e-4 | 0.7168 | 0.7156 | 0.7168 | 1.27e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.46e-8 | 1.0000 | 1.0000 | 1.0000 | -1.32e-7 | 1.0000 | 1.0000 | 1.0000 | -3.66e-7 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.46e-8 | 1.0000 | 1.0000 | 1.0000 | -1.32e-7 | 1.0000 | 1.0000 | 1.0000 | -3.66e-7 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9926 | 0.9926 | 0.9926 | -3.14e-5 | 0.9345 | 0.9348 | 0.9345 | -2.72e-4 | 0.8248 | 0.8255 | 0.8248 | -6.97e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9872 | 0.9872 | 0.9872 | 1.83e-5 | 0.8886 | 0.8885 | 0.8886 | 1.52e-4 | 0.7121 | 0.7117 | 0.7121 | 3.54e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9855 | 0.9855 | 0.9855 | 1.06e-5 | 0.8734 | 0.8733 | 0.8734 | 9.91e-5 | 0.6708 | 0.6705 | 0.6708 | 2.97e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9903 | 0.9903 | 0.9903 | 2.77e-5 | 0.9149 | 0.9147 | 0.9149 | 2.61e-4 | 0.7764 | 0.7756 | 0.7764 | 7.91e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -4.91e-7 | 0.9966 | 0.9966 | 0.9966 | -4.25e-6 | 0.9907 | 0.9907 | 0.9907 | -1.09e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -4.91e-7 | 0.9966 | 0.9966 | 0.9966 | -4.25e-6 | 0.9907 | 0.9907 | 0.9907 | -1.09e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9932 | 0.9932 | 0.9932 | -4.50e-5 | 0.9398 | 0.9402 | 0.9398 | -3.88e-4 | 0.8388 | 0.8398 | 0.8388 | -9.86e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9841 | 0.9841 | 0.9841 | -7.15e-6 | 0.8638 | 0.8638 | 0.8638 | -4.41e-5 | 0.6556 | 0.6556 | 0.6556 | -2.92e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9890 | 0.9890 | 0.9890 | 1.41e-5 | 0.9035 | 0.9034 | 0.9035 | 1.27e-4 | 0.7450 | 0.7446 | 0.7450 | 3.51e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9880 | 0.9880 | 0.9880 | 5.45e-5 | 0.8964 | 0.8959 | 0.8964 | 4.75e-4 | 0.7348 | 0.7335 | 0.7348 | 1.24e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9940 | 0.9940 | 1.77e-5 | 0.9468 | 0.9467 | 0.9468 | 1.60e-4 | 0.8581 | 0.8577 | 0.8581 | 4.50e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9940 | 0.9940 | 1.77e-5 | 0.9468 | 0.9467 | 0.9468 | 1.60e-4 | 0.8581 | 0.8577 | 0.8581 | 4.50e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9901 | 0.9902 | 0.9901 | -4.83e-5 | 0.9148 | 0.9152 | 0.9148 | -3.40e-4 | 0.7829 | 0.7834 | 0.7829 | -4.87e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9824 | 0.9826 | 0.9824 | -2.10e-4 | 0.8508 | 0.8527 | 0.8508 | -1.85e-3 | 0.6348 | 0.6397 | 0.6348 | -4.93e-3 |
| nikon-z-24-70f4s-wide-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9502 | 0.9499 | 0.9502 | 2.80e-4 | 0.6071 | 0.6054 | 0.6071 | 1.74e-3 | 0.1495 | 0.1476 | 0.1495 | 1.95e-3 |
| nikon-z-24-70f4s-wide-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7698 | 0.7685 | 0.7698 | 1.24e-3 | 0.3867 | 0.3927 | 0.3867 | -6.00e-3 | 0.3617 | 0.3638 | 0.3617 | -2.11e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9939 | 0.9940 | 0.9939 | -1.79e-5 | 0.9469 | 0.9470 | 0.9469 | -1.34e-4 | 0.8594 | 0.8597 | 0.8594 | -2.41e-4 |
| nikon-z-24-70f4s-wide-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9939 | 0.9940 | 0.9939 | -1.79e-5 | 0.9469 | 0.9470 | 0.9469 | -1.34e-4 | 0.8594 | 0.8597 | 0.8594 | -2.41e-4 |
| nikon-z-24-70f4s-wide-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9849 | 0.9850 | 0.9849 | -1.13e-4 | 0.8763 | 0.8771 | 0.8763 | -7.71e-4 | 0.7105 | 0.7115 | 0.7105 | -1.04e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9684 | 0.9687 | 0.9684 | -2.55e-4 | 0.7499 | 0.7517 | 0.7499 | -1.84e-3 | 0.4480 | 0.4524 | 0.4480 | -4.42e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9523 | 0.9522 | 0.9523 | 7.34e-5 | 0.6242 | 0.6242 | 0.6242 | 6.28e-5 | 0.1889 | 0.1905 | 0.1889 | -1.63e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7299 | 0.7289 | 0.7299 | 1.03e-3 | 0.2456 | 0.2505 | 0.2456 | -4.93e-3 | 0.1630 | 0.1651 | 0.1630 | -2.11e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -3.56e-5 | 0.9907 | 0.9911 | 0.9907 | -3.17e-4 | 0.9745 | 0.9754 | 0.9745 | -8.65e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -3.56e-5 | 0.9907 | 0.9911 | 0.9907 | -3.17e-4 | 0.9745 | 0.9754 | 0.9745 | -8.65e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9962 | 0.9962 | 0.9962 | -3.95e-5 | 0.9662 | 0.9666 | 0.9662 | -3.49e-4 | 0.9083 | 0.9092 | 0.9083 | -9.33e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | 1.41e-5 | 0.9953 | 0.9952 | 0.9953 | 1.26e-4 | 0.9871 | 0.9868 | 0.9871 | 3.43e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9391 | 0.9394 | 0.9391 | -3.94e-4 | 0.5278 | 0.5304 | 0.5278 | -2.52e-3 | 0.0299 | 0.0329 | 0.0299 | -2.98e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9082 | 0.9056 | 0.9082 | 2.55e-3 | 0.5772 | 0.5767 | 0.5772 | 5.02e-4 | 0.4282 | 0.4244 | 0.4282 | 3.79e-3 |
| nikon-z-24-70f4s-wide-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -2.83e-5 | 0.9928 | 0.9931 | 0.9928 | -2.53e-4 | 0.9803 | 0.9809 | 0.9803 | -6.90e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -2.83e-5 | 0.9928 | 0.9931 | 0.9928 | -2.53e-4 | 0.9803 | 0.9809 | 0.9803 | -6.90e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9970 | 0.9970 | 0.9970 | -3.37e-5 | 0.9730 | 0.9733 | 0.9730 | -2.97e-4 | 0.9266 | 0.9274 | 0.9266 | -7.87e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9866 | 0.9866 | 0.9866 | -2.47e-5 | 0.8859 | 0.8861 | 0.8859 | -2.06e-4 | 0.7195 | 0.7200 | 0.7195 | -4.97e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9463 | 0.9463 | 0.9463 | -2.46e-5 | 0.5777 | 0.5778 | 0.5777 | -2.71e-5 | 0.1050 | 0.1043 | 0.1050 | 6.09e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8622 | 0.8619 | 0.8622 | 3.44e-4 | 0.3744 | 0.3740 | 0.3744 | 3.94e-4 | 0.2305 | 0.2322 | 0.2305 | -1.70e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -3.83e-6 | 0.9990 | 0.9990 | 0.9990 | -3.44e-5 | 0.9972 | 0.9973 | 0.9972 | -9.54e-5 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -3.83e-6 | 0.9990 | 0.9990 | 0.9990 | -3.44e-5 | 0.9972 | 0.9973 | 0.9972 | -9.54e-5 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -1.19e-5 | 0.9907 | 0.9909 | 0.9907 | -1.06e-4 | 0.9745 | 0.9748 | 0.9745 | -2.92e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -2.13e-5 | 0.9864 | 0.9866 | 0.9864 | -1.91e-4 | 0.9626 | 0.9632 | 0.9626 | -5.21e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9525 | 0.9528 | 0.9525 | -3.00e-4 | 0.6190 | 0.6211 | 0.6190 | -2.09e-3 | 0.1602 | 0.1634 | 0.1602 | -3.21e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9213 | 0.9189 | 0.9213 | 2.44e-3 | 0.6247 | 0.6244 | 0.6247 | 2.50e-4 | 0.4804 | 0.4756 | 0.4804 | 4.72e-3 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9999 | 0.9998 | -4.43e-6 | 0.9986 | 0.9987 | 0.9986 | -3.98e-5 | 0.9962 | 0.9963 | 0.9962 | -1.10e-4 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9999 | 0.9998 | -4.43e-6 | 0.9986 | 0.9987 | 0.9986 | -3.98e-5 | 0.9962 | 0.9963 | 0.9962 | -1.10e-4 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -1.53e-5 | 0.9908 | 0.9910 | 0.9908 | -1.37e-4 | 0.9747 | 0.9751 | 0.9747 | -3.73e-4 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9853 | 0.9853 | 0.9853 | -4.52e-6 | 0.8754 | 0.8754 | 0.8754 | -2.66e-5 | 0.6948 | 0.6948 | 0.6948 | -4.83e-6 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9569 | 0.9569 | 0.9569 | -1.59e-5 | 0.6515 | 0.6515 | 0.6515 | -3.15e-5 | 0.2197 | 0.2194 | 0.2197 | 3.49e-4 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8716 | 0.8713 | 0.8716 | 3.14e-4 | 0.3956 | 0.3951 | 0.3956 | 5.71e-4 | 0.2487 | 0.2504 | 0.2487 | -1.69e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9967 | 0.9970 | 0.9967 | -2.84e-4 | 0.9721 | 0.9743 | 0.9721 | -2.12e-3 | 0.9324 | 0.9362 | 0.9324 | -3.79e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9967 | 0.9970 | 0.9967 | -2.84e-4 | 0.9721 | 0.9743 | 0.9721 | -2.12e-3 | 0.9324 | 0.9362 | 0.9324 | -3.79e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9415 | 0.9376 | 0.9415 | 3.93e-3 | 0.7389 | 0.7301 | 0.7389 | 8.80e-3 | 0.6222 | 0.6114 | 0.6222 | 1.08e-2 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9707 | 0.9690 | 0.9707 | 1.66e-3 | 0.8283 | 0.8194 | 0.8283 | 8.85e-3 | 0.7044 | 0.6969 | 0.7044 | 7.49e-3 |
| nikon-z-24-70f4s-tele-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.6581 | 0.6494 | 0.6581 | 8.70e-3 | 0.4748 | 0.4673 | 0.4748 | 7.43e-3 | 0.3781 | 0.3734 | 0.3781 | 4.72e-3 |
| nikon-z-24-70f4s-tele-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9461 | 0.9444 | 0.9461 | 1.65e-3 | 0.6374 | 0.6283 | 0.6374 | 9.10e-3 | 0.3643 | 0.3540 | 0.3643 | 1.03e-2 |
| nikon-z-24-70f4s-tele-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9965 | 0.9968 | 0.9965 | -2.75e-4 | 0.9706 | 0.9728 | 0.9706 | -2.12e-3 | 0.9272 | 0.9314 | 0.9272 | -4.19e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9965 | 0.9968 | 0.9965 | -2.75e-4 | 0.9706 | 0.9728 | 0.9706 | -2.12e-3 | 0.9272 | 0.9314 | 0.9272 | -4.19e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9448 | 0.9412 | 0.9448 | 3.62e-3 | 0.7333 | 0.7257 | 0.7333 | 7.54e-3 | 0.6041 | 0.5931 | 0.6041 | 1.10e-2 |
| nikon-z-24-70f4s-tele-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9584 | 0.9556 | 0.9584 | 2.84e-3 | 0.8069 | 0.7977 | 0.8069 | 9.29e-3 | 0.6680 | 0.6609 | 0.6680 | 7.18e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6707 | 0.6624 | 0.6707 | 8.34e-3 | 0.4895 | 0.4822 | 0.4895 | 7.33e-3 | 0.3987 | 0.3939 | 0.3987 | 4.77e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9139 | 0.9110 | 0.9139 | 2.93e-3 | 0.5401 | 0.5322 | 0.5401 | 7.83e-3 | 0.2389 | 0.2352 | 0.2389 | 3.69e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9991 | 0.9990 | -1.37e-5 | 0.9914 | 0.9915 | 0.9914 | -1.22e-4 | 0.9762 | 0.9765 | 0.9762 | -3.32e-4 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9991 | 0.9990 | -1.37e-5 | 0.9914 | 0.9915 | 0.9914 | -1.22e-4 | 0.9762 | 0.9765 | 0.9762 | -3.32e-4 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -6.09e-7 | 0.9868 | 0.9868 | 0.9868 | -1.90e-6 | 0.9642 | 0.9641 | 0.9642 | 1.42e-5 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9947 | 0.9947 | 0.9947 | 1.67e-6 | 0.9526 | 0.9526 | 0.9526 | 4.19e-6 | 0.8726 | 0.8727 | 0.8726 | -4.55e-5 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9868 | 0.9869 | 0.9868 | -9.78e-5 | 0.8888 | 0.8896 | 0.8888 | -7.99e-4 | 0.7300 | 0.7319 | 0.7300 | -1.87e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9848 | 0.9841 | 0.9848 | 7.75e-4 | 0.8885 | 0.8835 | 0.8885 | 5.07e-3 | 0.7670 | 0.7601 | 0.7670 | 6.81e-3 |
| nikon-z-24-70f4s-tele-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9983 | 0.9983 | 0.9983 | 3.49e-6 | 0.9852 | 0.9852 | 0.9852 | 3.09e-5 | 0.9595 | 0.9594 | 0.9595 | 8.35e-5 |
| nikon-z-24-70f4s-tele-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9983 | 0.9983 | 0.9983 | 3.49e-6 | 0.9852 | 0.9852 | 0.9852 | 3.09e-5 | 0.9595 | 0.9594 | 0.9595 | 8.35e-5 |
| nikon-z-24-70f4s-tele-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9983 | 0.9983 | 0.9983 | -1.29e-5 | 0.9850 | 0.9851 | 0.9850 | -1.09e-4 | 0.9594 | 0.9597 | 0.9594 | -2.63e-4 |
| nikon-z-24-70f4s-tele-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9943 | 0.9943 | 0.9943 | -9.72e-6 | 0.9501 | 0.9501 | 0.9501 | -8.60e-5 | 0.8671 | 0.8674 | 0.8671 | -2.35e-4 |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9888 | 0.9887 | 0.9888 | 1.26e-4 | 0.9053 | 0.9045 | 0.9053 | 8.47e-4 | 0.7667 | 0.7657 | 0.7667 | 1.04e-3 |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9591 | 0.9559 | 0.9591 | 3.28e-3 | 0.7454 | 0.7398 | 0.7454 | 5.54e-3 | 0.5246 | 0.5231 | 0.5246 | 1.51e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -8.95e-7 | 0.9994 | 0.9994 | 0.9994 | -8.05e-6 | 0.9984 | 0.9984 | 0.9984 | -2.23e-5 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -8.95e-7 | 0.9994 | 0.9994 | 0.9994 | -8.05e-6 | 0.9984 | 0.9984 | 0.9984 | -2.23e-5 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -1.56e-5 | 0.9909 | 0.9911 | 0.9909 | -1.40e-4 | 0.9750 | 0.9754 | 0.9750 | -3.84e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9978 | 0.9978 | 0.9978 | -6.99e-6 | 0.9801 | 0.9802 | 0.9801 | -6.40e-5 | 0.9457 | 0.9458 | 0.9457 | -1.83e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9881 | 0.9884 | 0.9881 | -2.30e-4 | 0.8985 | 0.9004 | 0.8985 | -1.97e-3 | 0.7440 | 0.7489 | 0.7440 | -4.94e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9843 | 0.9834 | 0.9843 | 8.73e-4 | 0.8910 | 0.8857 | 0.8910 | 5.37e-3 | 0.7882 | 0.7821 | 0.7882 | 6.10e-3 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | 2.37e-6 | 0.9985 | 0.9985 | 0.9985 | 2.13e-5 | 0.9958 | 0.9957 | 0.9958 | 5.89e-5 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | 2.37e-6 | 0.9985 | 0.9985 | 0.9985 | 2.13e-5 | 0.9958 | 0.9957 | 0.9958 | 5.89e-5 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -1.95e-5 | 0.9912 | 0.9914 | 0.9912 | -1.74e-4 | 0.9758 | 0.9763 | 0.9758 | -4.79e-4 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9975 | 0.9975 | 0.9975 | -2.89e-5 | 0.9778 | 0.9781 | 0.9778 | -2.53e-4 | 0.9399 | 0.9406 | 0.9399 | -6.67e-4 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9897 | 0.9898 | 0.9897 | -1.36e-4 | 0.9111 | 0.9123 | 0.9111 | -1.23e-3 | 0.7725 | 0.7759 | 0.7725 | -3.46e-3 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9540 | 0.9503 | 0.9540 | 3.76e-3 | 0.7230 | 0.7171 | 0.7230 | 5.87e-3 | 0.4856 | 0.4837 | 0.4856 | 1.96e-3 |
| nikon-z-mc-105f28-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9981 | 0.9982 | 0.9981 | -1.04e-4 | 0.9835 | 0.9844 | 0.9835 | -8.96e-4 | 0.9555 | 0.9578 | 0.9555 | -2.29e-3 |
| nikon-z-mc-105f28-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9981 | 0.9982 | 0.9981 | -1.04e-4 | 0.9835 | 0.9844 | 0.9835 | -8.96e-4 | 0.9555 | 0.9578 | 0.9555 | -2.29e-3 |
| nikon-z-mc-105f28-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9976 | 0.9976 | 0.9976 | -2.31e-5 | 0.9781 | 0.9783 | 0.9781 | -2.04e-4 | 0.9400 | 0.9406 | 0.9400 | -5.46e-4 |
| nikon-z-mc-105f28-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9934 | 0.9932 | 0.9934 | 2.59e-4 | 0.9445 | 0.9427 | 0.9445 | 1.77e-3 | 0.8649 | 0.8625 | 0.8649 | 2.41e-3 |
| nikon-z-mc-105f28-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9054 | 0.9034 | 0.9054 | 2.00e-3 | 0.5517 | 0.5448 | 0.5517 | 6.87e-3 | 0.4823 | 0.4796 | 0.4823 | 2.73e-3 |
| nikon-z-mc-105f28-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9383 | 0.9385 | 0.9383 | -1.96e-4 | 0.5743 | 0.5763 | 0.5743 | -1.93e-3 | 0.3472 | 0.3498 | 0.3472 | -2.60e-3 |
| nikon-z-mc-105f28-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9952 | 0.9951 | 0.9952 | 5.79e-5 | 0.9603 | 0.9599 | 0.9603 | 4.93e-4 | 0.9052 | 0.9041 | 0.9052 | 1.18e-3 |
| nikon-z-mc-105f28-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9952 | 0.9951 | 0.9952 | 5.79e-5 | 0.9603 | 0.9599 | 0.9603 | 4.93e-4 | 0.9052 | 0.9041 | 0.9052 | 1.18e-3 |
| nikon-z-mc-105f28-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9967 | 0.9968 | 0.9967 | -1.95e-4 | 0.9715 | 0.9729 | 0.9715 | -1.41e-3 | 0.9276 | 0.9303 | 0.9276 | -2.67e-3 |
| nikon-z-mc-105f28-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9883 | 0.9880 | 0.9883 | 3.32e-4 | 0.9032 | 0.9012 | 0.9032 | 2.04e-3 | 0.7713 | 0.7692 | 0.7713 | 2.12e-3 |
| nikon-z-mc-105f28-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9078 | 0.9059 | 0.9078 | 1.90e-3 | 0.5387 | 0.5314 | 0.5387 | 7.29e-3 | 0.4476 | 0.4441 | 0.4476 | 3.52e-3 |
| nikon-z-mc-105f28-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9124 | 0.9127 | 0.9124 | -2.66e-4 | 0.4534 | 0.4552 | 0.4534 | -1.84e-3 | 0.2226 | 0.2235 | 0.2226 | -8.54e-4 |
| nikon-z-mc-105f28-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9997 | 0.9996 | -1.11e-5 | 0.9968 | 0.9969 | 0.9968 | -1.00e-4 | 0.9911 | 0.9914 | 0.9911 | -2.76e-4 |
| nikon-z-mc-105f28-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9997 | 0.9996 | -1.11e-5 | 0.9968 | 0.9969 | 0.9968 | -1.00e-4 | 0.9911 | 0.9914 | 0.9911 | -2.76e-4 |
| nikon-z-mc-105f28-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 8.72e-8 | 0.9990 | 0.9990 | 0.9990 | 7.79e-7 | 0.9971 | 0.9971 | 0.9971 | 2.16e-6 |
| nikon-z-mc-105f28-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | 1.10e-6 | 0.9979 | 0.9979 | 0.9979 | 9.89e-6 | 0.9941 | 0.9941 | 0.9941 | 2.74e-5 |
| nikon-z-mc-105f28-f8-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9946 | 0.9943 | 0.9946 | 2.74e-4 | 0.9527 | 0.9503 | 0.9527 | 2.34e-3 | 0.8748 | 0.8689 | 0.8748 | 5.88e-3 |
| nikon-z-mc-105f28-f8-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9669 | 0.9668 | 0.9669 | 1.32e-4 | 0.7379 | 0.7372 | 0.7379 | 6.82e-4 | 0.4480 | 0.4482 | 0.4480 | -2.26e-4 |
| nikon-z-mc-105f28-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9982 | 0.9982 | 0.9982 | -3.10e-5 | 0.9841 | 0.9843 | 0.9841 | -2.74e-4 | 0.9566 | 0.9573 | 0.9566 | -7.33e-4 |
| nikon-z-mc-105f28-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9982 | 0.9982 | 0.9982 | -3.10e-5 | 0.9841 | 0.9843 | 0.9841 | -2.74e-4 | 0.9566 | 0.9573 | 0.9566 | -7.33e-4 |
| nikon-z-mc-105f28-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -1.14e-6 | 0.9950 | 0.9950 | 0.9950 | -1.01e-5 | 0.9862 | 0.9862 | 0.9862 | -2.73e-5 |
| nikon-z-mc-105f28-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9958 | 0.9957 | 0.9958 | 4.35e-6 | 0.9623 | 0.9623 | 0.9623 | 3.80e-5 | 0.8982 | 0.8981 | 0.8982 | 9.94e-5 |
| nikon-z-mc-105f28-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9930 | 0.9927 | 0.9930 | 2.96e-4 | 0.9391 | 0.9366 | 0.9391 | 2.50e-3 | 0.8407 | 0.8346 | 0.8407 | 6.11e-3 |
| nikon-z-mc-105f28-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9485 | 0.9484 | 0.9485 | 1.27e-4 | 0.6211 | 0.6206 | 0.6211 | 5.45e-4 | 0.2837 | 0.2842 | 0.2837 | -5.25e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.08e-7 | 0.9998 | 0.9998 | 0.9998 | -8.17e-6 | 0.9993 | 0.9994 | 0.9993 | -2.27e-5 |
| nikon-z-mc-105f28-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.08e-7 | 0.9998 | 0.9998 | 0.9998 | -8.17e-6 | 0.9993 | 0.9994 | 0.9993 | -2.27e-5 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | 8.37e-7 | 0.9932 | 0.9932 | 0.9932 | 7.49e-6 | 0.9812 | 0.9812 | 0.9812 | 2.07e-5 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.79e-7 | 0.9996 | 0.9996 | 0.9996 | -1.61e-6 | 0.9990 | 0.9990 | 0.9990 | -4.48e-6 |
| nikon-z-mc-105f28-f8-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9967 | 0.9966 | 0.9967 | 1.82e-4 | 0.9711 | 0.9695 | 0.9711 | 1.59e-3 | 0.9225 | 0.9184 | 0.9225 | 4.12e-3 |
| nikon-z-mc-105f28-f8-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9595 | 0.9594 | 0.9595 | 1.46e-4 | 0.6862 | 0.6855 | 0.6862 | 6.49e-4 | 0.3738 | 0.3747 | 0.3738 | -8.82e-4 |
| nikon-z-mc-105f28-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -5.30e-6 | 0.9952 | 0.9952 | 0.9952 | -4.75e-5 | 0.9867 | 0.9868 | 0.9867 | -1.30e-4 |
| nikon-z-mc-105f28-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -5.30e-6 | 0.9952 | 0.9952 | 0.9952 | -4.75e-5 | 0.9867 | 0.9868 | 0.9867 | -1.30e-4 |
| nikon-z-mc-105f28-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9987 | 0.9987 | 0.9987 | -9.29e-8 | 0.9886 | 0.9886 | 0.9886 | -7.36e-7 | 0.9688 | 0.9688 | 0.9688 | -1.50e-6 |
| nikon-z-mc-105f28-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9963 | 0.9963 | 0.9963 | -1.26e-6 | 0.9673 | 0.9673 | 0.9673 | -1.13e-5 | 0.9122 | 0.9122 | 0.9122 | -3.12e-5 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9973 | 0.9972 | 0.9973 | 1.35e-4 | 0.9760 | 0.9748 | 0.9760 | 1.18e-3 | 0.9352 | 0.9321 | 0.9352 | 3.08e-3 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9309 | 0.9307 | 0.9309 | 1.62e-4 | 0.5186 | 0.5181 | 0.5186 | 4.76e-4 | 0.1911 | 0.1928 | 0.1911 | -1.68e-3 |
| nikon-z-135f18-plena-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9932 | 0.9932 | 0.9932 | 2.27e-5 | 0.9403 | 0.9401 | 0.9403 | 1.84e-4 | 0.8411 | 0.8407 | 0.8411 | 4.11e-4 |
| nikon-z-135f18-plena-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9932 | 0.9932 | 0.9932 | 2.27e-5 | 0.9403 | 0.9401 | 0.9403 | 1.84e-4 | 0.8411 | 0.8407 | 0.8411 | 4.11e-4 |
| nikon-z-135f18-plena-best-ref | 0.5 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9903 | 0.9896 | 0.9903 | 6.76e-4 | 0.9204 | 0.9147 | 0.9204 | 5.64e-3 | 0.8159 | 0.8025 | 0.8159 | 1.34e-2 |
| nikon-z-135f18-plena-best-ref | 0.5 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9928 | 0.9924 | 0.9928 | 3.84e-4 | 0.9405 | 0.9374 | 0.9405 | 3.10e-3 | 0.8593 | 0.8525 | 0.8593 | 6.86e-3 |
| nikon-z-135f18-plena-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9659 | 0.9636 | 0.9659 | 2.28e-3 | 0.7485 | 0.7331 | 0.7485 | 1.54e-2 | 0.5108 | 0.4860 | 0.5108 | 2.48e-2 |
| nikon-z-135f18-plena-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8913 | 0.8860 | 0.8913 | 5.31e-3 | 0.5503 | 0.5346 | 0.5503 | 1.57e-2 | 0.4451 | 0.4328 | 0.4451 | 1.24e-2 |
| nikon-z-135f18-plena-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9932 | 0.9932 | 0.9932 | 9.37e-5 | 0.9409 | 0.9401 | 0.9409 | 7.93e-4 | 0.8445 | 0.8425 | 0.8445 | 1.94e-3 |
| nikon-z-135f18-plena-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9932 | 0.9932 | 0.9932 | 9.37e-5 | 0.9409 | 0.9401 | 0.9409 | 7.93e-4 | 0.8445 | 0.8425 | 0.8445 | 1.94e-3 |
| nikon-z-135f18-plena-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9880 | 0.9878 | 0.9880 | 2.18e-4 | 0.9047 | 0.9019 | 0.9047 | 2.78e-3 | 0.7899 | 0.7800 | 0.7899 | 9.97e-3 |
| nikon-z-135f18-plena-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9900 | 0.9889 | 0.9900 | 1.12e-3 | 0.9197 | 0.9124 | 0.9197 | 7.31e-3 | 0.8196 | 0.8093 | 0.8196 | 1.03e-2 |
| nikon-z-135f18-plena-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.9592 | 0.9567 | 0.9592 | 2.54e-3 | 0.7108 | 0.6946 | 0.7108 | 1.62e-2 | 0.4707 | 0.4474 | 0.4707 | 2.33e-2 |
| nikon-z-135f18-plena-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.8651 | 0.8590 | 0.8651 | 6.10e-3 | 0.5069 | 0.4924 | 0.5069 | 1.45e-2 | 0.3950 | 0.3828 | 0.3950 | 1.22e-2 |
| nikon-z-135f18-plena-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -7.67e-7 | 0.9998 | 0.9999 | 0.9998 | -6.90e-6 | 0.9996 | 0.9996 | 0.9996 | -1.92e-5 |
| nikon-z-135f18-plena-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -7.67e-7 | 0.9998 | 0.9999 | 0.9998 | -6.90e-6 | 0.9996 | 0.9996 | 0.9996 | -1.92e-5 |
| nikon-z-135f18-plena-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9987 | 0.9987 | 0.9987 | -7.93e-6 | 0.9881 | 0.9882 | 0.9881 | -7.09e-5 | 0.9672 | 0.9674 | 0.9672 | -1.94e-4 |
| nikon-z-135f18-plena-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | 2.11e-6 | 0.9944 | 0.9944 | 0.9944 | 1.90e-5 | 0.9846 | 0.9846 | 0.9846 | 5.24e-5 |
| nikon-z-135f18-plena-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9938 | 0.9938 | 0.9938 | -1.13e-5 | 0.9454 | 0.9455 | 0.9454 | -9.99e-5 | 0.8528 | 0.8531 | 0.8528 | -2.64e-4 |
| nikon-z-135f18-plena-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9969 | 0.9969 | 0.9969 | 2.94e-5 | 0.9728 | 0.9725 | 0.9728 | 2.58e-4 | 0.9257 | 0.9250 | 0.9257 | 6.79e-4 |
| nikon-z-135f18-plena-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -2.15e-7 | 0.9994 | 0.9994 | 0.9994 | -1.92e-6 | 0.9983 | 0.9983 | 0.9983 | -5.22e-6 |
| nikon-z-135f18-plena-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -2.15e-7 | 0.9994 | 0.9994 | 0.9994 | -1.92e-6 | 0.9983 | 0.9983 | 0.9983 | -5.22e-6 |
| nikon-z-135f18-plena-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9987 | 0.9987 | 0.9987 | -4.39e-6 | 0.9881 | 0.9882 | 0.9881 | -3.92e-5 | 0.9673 | 0.9674 | 0.9673 | -1.07e-4 |
| nikon-z-135f18-plena-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -2.99e-7 | 0.9911 | 0.9911 | 0.9911 | -2.67e-6 | 0.9755 | 0.9755 | 0.9755 | -7.32e-6 |
| nikon-z-135f18-plena-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9945 | 0.9945 | 0.9945 | 3.13e-6 | 0.9509 | 0.9509 | 0.9509 | 2.63e-5 | 0.8674 | 0.8673 | 0.8674 | 6.32e-5 |
| nikon-z-135f18-plena-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9951 | 0.9951 | 0.9951 | 4.18e-5 | 0.9570 | 0.9566 | 0.9570 | 3.65e-4 | 0.8840 | 0.8830 | 0.8840 | 9.51e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.10e-7 | 1.0000 | 1.0000 | 1.0000 | -9.90e-7 | 0.9999 | 0.9999 | 0.9999 | -2.75e-6 |
| nikon-z-135f18-plena-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.10e-7 | 1.0000 | 1.0000 | 1.0000 | -9.90e-7 | 0.9999 | 0.9999 | 0.9999 | -2.75e-6 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9984 | 0.9984 | 0.9984 | -1.00e-5 | 0.9856 | 0.9857 | 0.9856 | -8.96e-5 | 0.9603 | 0.9605 | 0.9603 | -2.45e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | 2.47e-6 | 0.9927 | 0.9927 | 0.9927 | 2.21e-5 | 0.9797 | 0.9797 | 0.9797 | 6.11e-5 |
| nikon-z-135f18-plena-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9932 | 0.9932 | 0.9932 | -1.24e-5 | 0.9401 | 0.9402 | 0.9401 | -1.09e-4 | 0.8392 | 0.8395 | 0.8392 | -2.87e-4 |
| nikon-z-135f18-plena-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9965 | 0.9965 | 0.9965 | 3.44e-5 | 0.9688 | 0.9685 | 0.9688 | 3.01e-4 | 0.9151 | 0.9143 | 0.9151 | 7.87e-4 |
| nikon-z-135f18-plena-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.38e-7 | 0.9995 | 0.9995 | 0.9995 | -1.23e-6 | 0.9985 | 0.9985 | 0.9985 | -3.36e-6 |
| nikon-z-135f18-plena-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.38e-7 | 0.9995 | 0.9995 | 0.9995 | -1.23e-6 | 0.9985 | 0.9985 | 0.9985 | -3.36e-6 |
| nikon-z-135f18-plena-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -5.17e-6 | 0.9863 | 0.9864 | 0.9863 | -4.61e-5 | 0.9624 | 0.9625 | 0.9624 | -1.26e-4 |
| nikon-z-135f18-plena-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9989 | 0.9989 | -3.36e-7 | 0.9900 | 0.9900 | 0.9900 | -2.97e-6 | 0.9723 | 0.9724 | 0.9723 | -7.95e-6 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9941 | 0.9941 | 0.9941 | 3.54e-6 | 0.9473 | 0.9473 | 0.9473 | 2.97e-5 | 0.8579 | 0.8579 | 0.8579 | 7.07e-5 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9948 | 0.9948 | 0.9948 | 4.58e-5 | 0.9543 | 0.9539 | 0.9543 | 3.99e-4 | 0.8770 | 0.8760 | 0.8770 | 1.04e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9547 | 0.9557 | 0.9547 | -1.06e-3 | 0.7725 | 0.7746 | 0.7725 | -2.03e-3 | 0.7065 | 0.7070 | 0.7065 | -4.85e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9547 | 0.9557 | 0.9547 | -1.06e-3 | 0.7725 | 0.7746 | 0.7725 | -2.03e-3 | 0.7065 | 0.7070 | 0.7065 | -4.85e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9645 | 0.9653 | 0.9645 | -7.21e-4 | 0.7759 | 0.7790 | 0.7759 | -3.06e-3 | 0.6292 | 0.6306 | 0.6292 | -1.47e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9608 | 0.9616 | 0.9608 | -7.76e-4 | 0.7220 | 0.7240 | 0.7220 | -1.99e-3 | 0.4344 | 0.4332 | 0.4344 | 1.25e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7632 | 0.7630 | 0.7632 | 2.10e-4 | 0.3818 | 0.3818 | 0.3818 | 3.37e-5 | 0.2892 | 0.2902 | 0.2892 | -9.72e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8596 | 0.8598 | 0.8596 | -2.66e-4 | 0.2913 | 0.2920 | 0.2913 | -7.51e-4 | 0.0838 | 0.0827 | 0.0838 | 1.17e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9453 | 0.9472 | 0.9453 | -1.95e-3 | 0.7474 | 0.7508 | 0.7474 | -3.47e-3 | 0.6609 | 0.6638 | 0.6609 | -2.88e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9453 | 0.9472 | 0.9453 | -1.95e-3 | 0.7474 | 0.7508 | 0.7474 | -3.47e-3 | 0.6609 | 0.6638 | 0.6609 | -2.88e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9572 | 0.9578 | 0.9572 | -5.87e-4 | 0.7436 | 0.7461 | 0.7436 | -2.57e-3 | 0.5764 | 0.5777 | 0.5764 | -1.30e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9557 | 0.9565 | 0.9557 | -7.63e-4 | 0.7103 | 0.7120 | 0.7103 | -1.76e-3 | 0.4501 | 0.4500 | 0.4501 | 1.39e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7560 | 0.7581 | 0.7560 | -2.06e-3 | 0.3597 | 0.3625 | 0.3597 | -2.73e-3 | 0.2904 | 0.2902 | 0.2904 | 2.03e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8436 | 0.8438 | 0.8436 | -2.11e-4 | 0.3018 | 0.3010 | 0.3018 | 7.61e-4 | 0.0620 | 0.0604 | 0.0620 | 1.65e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -2.94e-5 | 0.9819 | 0.9822 | 0.9819 | -2.61e-4 | 0.9505 | 0.9512 | 0.9505 | -7.07e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -2.94e-5 | 0.9819 | 0.9822 | 0.9819 | -2.61e-4 | 0.9505 | 0.9512 | 0.9505 | -7.07e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9882 | 0.9882 | 0.9882 | -9.20e-6 | 0.8973 | 0.8973 | 0.8973 | -7.66e-5 | 0.7324 | 0.7326 | 0.7324 | -1.79e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9931 | 0.9931 | 0.9931 | 4.90e-5 | 0.9394 | 0.9390 | 0.9394 | 4.24e-4 | 0.8389 | 0.8378 | 0.8389 | 1.08e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9967 | 0.9967 | 0.9967 | -2.89e-6 | 0.9710 | 0.9710 | 0.9710 | -3.05e-5 | 0.9224 | 0.9225 | 0.9224 | -1.09e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9627 | 0.9635 | 0.9627 | -7.85e-4 | 0.6983 | 0.7040 | 0.6983 | -5.76e-3 | 0.3432 | 0.3519 | 0.3432 | -8.67e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9973 | 0.9973 | 0.9973 | -3.19e-5 | 0.9761 | 0.9764 | 0.9761 | -2.81e-4 | 0.9351 | 0.9359 | 0.9351 | -7.49e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9973 | 0.9973 | 0.9973 | -3.19e-5 | 0.9761 | 0.9764 | 0.9761 | -2.81e-4 | 0.9351 | 0.9359 | 0.9351 | -7.49e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9868 | 0.9868 | 0.9868 | 1.12e-5 | 0.8859 | 0.8858 | 0.8859 | 9.62e-5 | 0.7070 | 0.7068 | 0.7070 | 2.43e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9941 | 0.9941 | 0.9941 | 3.68e-5 | 0.9488 | 0.9485 | 0.9488 | 3.16e-4 | 0.8663 | 0.8655 | 0.8663 | 7.95e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9958 | 0.9958 | 0.9958 | -1.98e-5 | 0.9632 | 0.9634 | 0.9632 | -1.74e-4 | 0.9027 | 0.9032 | 0.9027 | -4.61e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9705 | 0.9705 | 0.9705 | -5.10e-5 | 0.7744 | 0.7749 | 0.7744 | -5.19e-4 | 0.5408 | 0.5426 | 0.5408 | -1.75e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 6.30e-8 | 0.9993 | 0.9993 | 0.9993 | 5.63e-7 | 0.9980 | 0.9980 | 0.9980 | 1.56e-6 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 6.30e-8 | 0.9993 | 0.9993 | 0.9993 | 5.63e-7 | 0.9980 | 0.9980 | 0.9980 | 1.56e-6 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9957 | 0.9957 | 0.9957 | -1.03e-6 | 0.9616 | 0.9616 | 0.9616 | -9.49e-6 | 0.8959 | 0.8959 | 0.8959 | -2.67e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9845 | 0.9844 | 0.9845 | 9.67e-5 | 0.8667 | 0.8659 | 0.8667 | 8.01e-4 | 0.6619 | 0.6600 | 0.6619 | 1.87e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9975 | 0.9975 | 0.9975 | -1.68e-5 | 0.9776 | 0.9777 | 0.9776 | -1.49e-4 | 0.9390 | 0.9394 | 0.9390 | -4.00e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9523 | 0.9533 | 0.9523 | -9.88e-4 | 0.6243 | 0.6311 | 0.6243 | -6.81e-3 | 0.2428 | 0.2496 | 0.2428 | -6.81e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -2.97e-6 | 0.9963 | 0.9963 | 0.9963 | -2.67e-5 | 0.9898 | 0.9899 | 0.9898 | -7.34e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -2.97e-6 | 0.9963 | 0.9963 | 0.9963 | -2.67e-5 | 0.9898 | 0.9899 | 0.9898 | -7.34e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9951 | 0.9951 | 0.9951 | 6.84e-6 | 0.9570 | 0.9570 | 0.9570 | 5.93e-5 | 0.8846 | 0.8844 | 0.8846 | 1.53e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9862 | 0.9861 | 0.9862 | 7.79e-5 | 0.8824 | 0.8818 | 0.8824 | 6.41e-4 | 0.7063 | 0.7048 | 0.7063 | 1.48e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9968 | 0.9968 | 0.9968 | -1.63e-5 | 0.9718 | 0.9720 | 0.9718 | -1.43e-4 | 0.9242 | 0.9245 | 0.9242 | -3.78e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9622 | 0.9623 | 0.9622 | -8.29e-5 | 0.7161 | 0.7169 | 0.7161 | -8.15e-4 | 0.4439 | 0.4463 | 0.4439 | -2.40e-3 |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

| Reason | Meaning |
|---|---|
| two-methods | both engines stand by their curves; the difference is held to the attention band |
| unconverged | a sampling did not settle; the difference is shown apart, in no band |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.maxAbs (≤ 4.00e-5) | 3.11e-6 | 208 of 288 | sony-fe-20mm-f18-g-f8-ref | cut tangential, field 4.75e1, frequencyPerMm 30 |
| lv – optiland | phaseStep.waves [waves] | 5.13e1 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 1, ray 552 |
| lv – optiland | convergence.maxAbs | 5.28e-2 | 288 of 288 | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | cut sagittal, field 2.44e1, frequencyPerMm 70 |
| lv – optiland | lattice.columns [cells] | 80 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-f8-ref | — |
| lv – optiland | rays.compared [rays] | 2437812 | 288 of 288 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| lv – optiland | waveMtf.flagged | 1.84e-6 | 80 of 288 | sigma-105mm-f28-dg-dn-macro-art-best-ref | cut sagittal, field 5.94e0, frequencyPerMm 100 |
| lv – ref | waveMtf.maxAbs (≤ 4.00e-5) | 3.12e-6 | 208 of 288 | sony-fe-20mm-f18-g-f8-ref | cut tangential, field 4.75e1, frequencyPerMm 30 |
| lv – ref | phaseStep.waves [waves] | 5.13e1 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 1, ray 552 |
| lv – ref | convergence.maxAbs | 5.28e-2 | 288 of 288 | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | cut sagittal, field 2.44e1, frequencyPerMm 70 |
| lv – ref | lattice.columns [cells] | 80 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-f8-ref | — |
| lv – ref | rays.compared [rays] | 2437812 | 288 of 288 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | waveMtf.flagged | 1.84e-6 | 80 of 288 | sigma-105mm-f28-dg-dn-macro-art-best-ref | cut sagittal, field 5.94e0, frequencyPerMm 100 |
| optiland – ref | waveMtf.maxAbs (≤ 4.00e-5) | 1.15e-9 | 208 of 288 | nikon-z-24-70f4s-wide-best-ref | cut tangential, field 4.33e1, frequencyPerMm 50 |
| optiland – ref | phaseStep.waves [waves] | 5.13e1 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 1, ray 552 |
| optiland – ref | convergence.maxAbs | 5.28e-2 | 288 of 288 | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | cut sagittal, field 2.44e1, frequencyPerMm 70 |
| optiland – ref | lattice.columns [cells] | 80 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-f8-ref | — |
| optiland – ref | rays.compared [rays] | 2437812 | 288 of 288 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | waveMtf.flagged | 6.56e-10 | 80 of 288 | sony-fe-20mm-f18-g-ref | cut tangential, field 4.75e1, frequencyPerMm 30 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: waveMtf.maxAbs 5.94e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.94e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-11 (3 of 3) |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: waveMtf.maxAbs 1.69e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.69e-7 (1 of 3) | PASS: waveMtf.maxAbs 4.59e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: waveMtf.maxAbs 3.55e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.55e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.06e-11 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: waveMtf.maxAbs 4.09e-7 (1 of 3) | PASS: waveMtf.maxAbs 4.09e-7 (1 of 3) | PASS: waveMtf.maxAbs 6.54e-12 (1 of 3) |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: waveMtf.maxAbs 3.42e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.42e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (1 of 3) |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| nikkor-z50f12-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| nikkor-z50f12-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-20mm-f18-g-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: waveMtf.maxAbs 1.09e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-6 (3 of 3) | PASS: waveMtf.maxAbs 6.69e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: waveMtf.maxAbs 9.25e-7 (2 of 3) | PASS: waveMtf.maxAbs 9.25e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.14e-11 (2 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: waveMtf.maxAbs 1.55e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.55e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (1 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: waveMtf.maxAbs 1.53e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.53e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.20e-11 (1 of 3) |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: waveMtf.maxAbs 2.74e-6 (2 of 3) | PASS: waveMtf.maxAbs 2.74e-6 (2 of 3) | PASS: waveMtf.maxAbs 7.80e-10 (2 of 3) |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: waveMtf.maxAbs 1.62e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.61e-6 (3 of 3) | PASS: waveMtf.maxAbs 5.06e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: waveMtf.maxAbs 9.82e-7 (2 of 3) | PASS: waveMtf.maxAbs 9.82e-7 (2 of 3) | PASS: waveMtf.maxAbs 1.84e-10 (2 of 3) |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: waveMtf.maxAbs 7.09e-7 (1 of 3) | PASS: waveMtf.maxAbs 7.09e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.07e-10 (1 of 3) |
| nikon-z-mc-105f28-ref | 3 | PASS: waveMtf.maxAbs 8.89e-7 (2 of 3) | PASS: waveMtf.maxAbs 8.89e-7 (2 of 3) | PASS: waveMtf.maxAbs 1.25e-11 (2 of 3) |
| nikon-z-mc-105f28-photopic | 3 | PASS: waveMtf.maxAbs 1.44e-6 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-6 (2 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (2 of 3) |
| nikon-z-135f18-plena-ref | 3 | PASS: waveMtf.maxAbs 5.94e-7 (1 of 3) | PASS: waveMtf.maxAbs 5.94e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.11e-11 (1 of 3) |
| nikon-z-135f18-plena-photopic | 3 | PASS: waveMtf.maxAbs 5.27e-7 (2 of 3) | PASS: waveMtf.maxAbs 5.27e-7 (2 of 3) | PASS: waveMtf.maxAbs 9.92e-12 (2 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: waveMtf.maxAbs 1.16e-6 (2 of 3) | PASS: waveMtf.maxAbs 1.16e-6 (2 of 3) | PASS: waveMtf.maxAbs 3.50e-10 (2 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: waveMtf.maxAbs 5.35e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.35e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.17e-11 (3 of 3) |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: waveMtf.maxAbs 6.57e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.57e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: waveMtf.maxAbs 5.39e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.39e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.36e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: waveMtf.maxAbs 6.58e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.58e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.18e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 4.87e-7 (3 of 3) | PASS: waveMtf.maxAbs 4.87e-7 (3 of 3) | PASS: waveMtf.maxAbs 8.59e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: waveMtf.maxAbs 6.80e-7 (1 of 3) | PASS: waveMtf.maxAbs 6.80e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.26e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: waveMtf.maxAbs 3.42e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.42e-7 (1 of 3) | PASS: waveMtf.maxAbs 3.92e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: waveMtf.maxAbs 8.22e-7 (3 of 3) | PASS: waveMtf.maxAbs 8.22e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.10e-11 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: waveMtf.maxAbs 7.67e-7 (3 of 3) | PASS: waveMtf.maxAbs 7.67e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.44e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: waveMtf.maxAbs 9.80e-7 (3 of 3) | PASS: waveMtf.maxAbs 9.80e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.22e-11 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 4.66e-7 (3 of 3) | PASS: waveMtf.maxAbs 4.66e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.11e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: waveMtf.maxAbs 9.02e-8 (1 of 3) | PASS: waveMtf.maxAbs 9.02e-8 (1 of 3) | PASS: waveMtf.maxAbs 2.08e-11 (1 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: waveMtf.maxAbs 3.05e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.05e-7 (2 of 3) | PASS: waveMtf.maxAbs 2.58e-11 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: waveMtf.maxAbs 2.85e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.85e-7 (3 of 3) | PASS: waveMtf.maxAbs 4.22e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: waveMtf.maxAbs 3.07e-7 (2 of 3) | PASS: waveMtf.maxAbs 3.07e-7 (2 of 3) | PASS: waveMtf.maxAbs 2.56e-11 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 2.66e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.66e-7 (3 of 3) | PASS: waveMtf.maxAbs 3.99e-11 (3 of 3) |
| nikkor-z50f12-best-ref | 3 | PASS: waveMtf.maxAbs 1.39e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.39e-6 (1 of 3) | PASS: waveMtf.maxAbs 3.05e-10 (1 of 3) |
| nikkor-z50f12-best-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| nikkor-z50f12-f8-ref | 3 | PASS: waveMtf.maxAbs 8.77e-7 (3 of 3) | PASS: waveMtf.maxAbs 8.77e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.93e-11 (3 of 3) |
| nikkor-z50f12-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.16e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.16e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.53e-10 (3 of 3) |
| nikkor-z50f12-f8-best-ref | 3 | PASS: waveMtf.maxAbs 8.60e-7 (3 of 3) | PASS: waveMtf.maxAbs 8.60e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.59e-11 (3 of 3) |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 9.69e-7 (3 of 3) | PASS: waveMtf.maxAbs 9.69e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.28e-11 (3 of 3) |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: waveMtf.maxAbs 3.11e-6 (3 of 3) | PASS: waveMtf.maxAbs 3.12e-6 (3 of 3) | PASS: waveMtf.maxAbs 6.08e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: waveMtf.maxAbs 2.17e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.17e-6 (3 of 3) | PASS: waveMtf.maxAbs 5.99e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: waveMtf.maxAbs 3.11e-6 (3 of 3) | PASS: waveMtf.maxAbs 3.11e-6 (3 of 3) | PASS: waveMtf.maxAbs 6.10e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 2.16e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.16e-6 (3 of 3) | PASS: waveMtf.maxAbs 5.95e-10 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: waveMtf.maxAbs 3.98e-7 (3 of 3) | PASS: waveMtf.maxAbs 3.98e-7 (3 of 3) | PASS: waveMtf.maxAbs 3.35e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: waveMtf.maxAbs 3.05e-7 (3 of 3) | PASS: waveMtf.maxAbs 3.05e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.98e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: waveMtf.maxAbs 1.36e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.36e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.78e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.09e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: waveMtf.maxAbs 6.94e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.94e-7 (3 of 3) | PASS: waveMtf.maxAbs 9.33e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 5.26e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.26e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.50e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: waveMtf.maxAbs 1.20e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.20e-6 (1 of 3) | PASS: waveMtf.maxAbs 1.42e-11 (1 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: waveMtf.maxAbs 9.33e-7 (1 of 3) | PASS: waveMtf.maxAbs 9.33e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.70e-11 (1 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: waveMtf.maxAbs 1.12e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.04e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.15e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.15e-6 (3 of 3) | PASS: waveMtf.maxAbs 7.51e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: waveMtf.maxAbs 1.14e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.14e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.11e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.11e-6 (3 of 3) | PASS: waveMtf.maxAbs 3.25e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: waveMtf.maxAbs 2.84e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.84e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.15e-9 (3 of 3) |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: waveMtf.maxAbs 1.31e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-6 (3 of 3) | PASS: waveMtf.maxAbs 4.18e-10 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: waveMtf.maxAbs 2.61e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.61e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-9 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.06e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-6 (3 of 3) | PASS: waveMtf.maxAbs 4.43e-10 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: waveMtf.maxAbs 2.39e-6 (3 of 3) | PASS: waveMtf.maxAbs 2.39e-6 (3 of 3) | PASS: waveMtf.maxAbs 9.65e-10 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 9.52e-7 (3 of 3) | PASS: waveMtf.maxAbs 9.51e-7 (3 of 3) | PASS: waveMtf.maxAbs 3.95e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: waveMtf.maxAbs 8.41e-7 (2 of 3) | PASS: waveMtf.maxAbs 8.41e-7 (2 of 3) | PASS: waveMtf.maxAbs 8.92e-11 (2 of 3) |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: waveMtf.maxAbs 2.06e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.06e-7 (1 of 3) | PASS: waveMtf.maxAbs 7.88e-11 (1 of 3) |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: waveMtf.maxAbs 1.39e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.39e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: waveMtf.maxAbs 7.89e-7 (3 of 3) | PASS: waveMtf.maxAbs 7.89e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.27e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: waveMtf.maxAbs 8.87e-7 (3 of 3) | PASS: waveMtf.maxAbs 8.87e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.10e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.10e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (3 of 3) |
| nikon-z-mc-105f28-best-ref | 3 | PASS: waveMtf.maxAbs 6.78e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.78e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.28e-10 (3 of 3) |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: waveMtf.maxAbs 5.93e-7 (2 of 3) | PASS: waveMtf.maxAbs 5.92e-7 (2 of 3) | PASS: waveMtf.maxAbs 1.45e-10 (2 of 3) |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: waveMtf.maxAbs 1.26e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.26e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-11 (3 of 3) |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.24e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.24e-6 (3 of 3) | PASS: waveMtf.maxAbs 5.69e-12 (3 of 3) |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: waveMtf.maxAbs 1.21e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-6 (3 of 3) | PASS: waveMtf.maxAbs 5.60e-12 (3 of 3) |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.20e-6 (3 of 3) | PASS: waveMtf.maxAbs 1.20e-6 (3 of 3) | PASS: waveMtf.maxAbs 6.51e-12 (3 of 3) |
| nikon-z-135f18-plena-best-ref | 3 | PASS: waveMtf.maxAbs 5.53e-7 (2 of 3) | PASS: waveMtf.maxAbs 5.53e-7 (2 of 3) | PASS: waveMtf.maxAbs 2.12e-11 (2 of 3) |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: waveMtf.maxAbs 5.65e-7 (2 of 3) | PASS: waveMtf.maxAbs 5.65e-7 (2 of 3) | PASS: waveMtf.maxAbs 8.92e-12 (2 of 3) |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: waveMtf.maxAbs 2.10e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.42e-10 (3 of 3) |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: waveMtf.maxAbs 2.13e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.12e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.55e-10 (3 of 3) |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: waveMtf.maxAbs 2.35e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.35e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (3 of 3) |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 2.18e-7 (3 of 3) | PASS: waveMtf.maxAbs 2.18e-7 (3 of 3) | PASS: waveMtf.maxAbs 1.58e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: waveMtf.maxAbs 9.54e-7 (1 of 3) | PASS: waveMtf.maxAbs 9.54e-7 (1 of 3) | PASS: waveMtf.maxAbs 1.93e-10 (1 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: waveMtf.maxAbs 6.00e-7 (1 of 3) | PASS: waveMtf.maxAbs 6.00e-7 (1 of 3) | PASS: waveMtf.maxAbs 2.63e-10 (1 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: waveMtf.maxAbs 7.06e-7 (3 of 3) | PASS: waveMtf.maxAbs 7.06e-7 (3 of 3) | PASS: waveMtf.maxAbs 5.64e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: waveMtf.maxAbs 8.32e-7 (3 of 3) | PASS: waveMtf.maxAbs 8.32e-7 (3 of 3) | PASS: waveMtf.maxAbs 4.67e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: waveMtf.maxAbs 6.88e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.89e-7 (3 of 3) | PASS: waveMtf.maxAbs 7.61e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 6.03e-7 (3 of 3) | PASS: waveMtf.maxAbs 6.03e-7 (3 of 3) | PASS: waveMtf.maxAbs 7.05e-10 (3 of 3) |

## r6b

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – wave | mtfOnAxis.maxAbs | 7.54e-3 | 74 of 96 | nikon-z-24-70f4s-tele-ref | cut sagittal, field 0, frequencyPerMm 40 |
| lv – wave | mtfOffAxis.maxAbs | 7.88e-3 | 75 of 96 | canon-ef-135-f2l-usm-ref | cut tangential, field 5.00e-1, frequencyPerMm 100 |
| lv – wave | fields.compared [elements] | 208 | 96 of 96 | — | — |
| lv – wave | fields.flagged [elements] | 80 | 96 of 96 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |
| lv – wave | mtfFlagged.maxAbs | 1.67e-2 | 41 of 96 | sigma-35mm-f14-dg-hsm-a-photopic | cut tangential, field 1, frequencyPerMm 60 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – wave |
|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | ATTENTION: no judged figure |
| canon-ef-135-f2l-usm-photopic | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | RECORDED: no judged figure |
| nikkor-z50f12-ref | 1 | RECORDED: no judged figure |
| nikkor-z50f12-photopic | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-ref | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-photopic | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-ref | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-ref | 1 | ATTENTION: no judged figure |
| nikon-z-24-70f4s-tele-photopic | 1 | ATTENTION: no judged figure |
| nikon-z-mc-105f28-ref | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-photopic | 1 | ATTENTION: no judged figure |
| nikon-z-135f18-plena-ref | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-photopic | 1 | ATTENTION: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-best-ref | 1 | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-best-photopic | 1 | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-ref | 1 | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-photopic | 1 | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | RECORDED: no judged figure |
| nikkor-z50f12-best-ref | 1 | RECORDED: no judged figure |
| nikkor-z50f12-best-photopic | 1 | RECORDED: no judged figure |
| nikkor-z50f12-f8-ref | 1 | RECORDED: no judged figure |
| nikkor-z50f12-f8-photopic | 1 | RECORDED: no judged figure |
| nikkor-z50f12-f8-best-ref | 1 | RECORDED: no judged figure |
| nikkor-z50f12-f8-best-photopic | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-best-ref | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-best-photopic | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-ref | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-photopic | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-ref | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-photopic | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-best-photopic | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-ref | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-photopic | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-best-ref | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-best-photopic | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | RECORDED: no judged figure |

## Later steps

An engine that was asked a request once more, with a finer sampling, because of what its first answer came to.
Its first answer is what the support counts; the step is what its row of a table is of.

| Rung | Engine | Step | Runs | Requests asked again | Not ok |
|---|---|---|---|---|---|
| r5 | optiland | fft512 | 15 | 15 | — |
| r5g | optiland | geo512 | 23 | 40 | — |

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

| Rung | Run | Field | Pair | Figures above their bands |
|---|---|---|---|---|
| r5 | canon-ef-135-f2l-usm-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.14e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 90; mtfOffAxis.maxAbs 1.06e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5 | canon-ef-135-f2l-usm-ref | — | lv – wave | mtfOnAxis.maxAbs 5.45e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r5 | canon-ef-135-f2l-usm-ref | — | optiland – wave | mtfOffAxis.maxAbs 1.03e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 90 |
| r5g | canon-ef-135-f2l-usm-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.95e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | canon-ef-135-f2l-usm-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.95e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r6b | canon-ef-135-f2l-usm-ref | — | lv – wave | mtfOnAxis.maxAbs 5.45e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r5g | canon-ef-135-f2l-usm-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 1.38e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | canon-ef-135-f2l-usm-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 1.38e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | canon-ef-135-f2l-usm-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.04e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 40 |
| r5g | canon-ef-135-f2l-usm-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.04e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 40 |
| r5 | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | — | lv – optiland | mtfOffAxis.maxAbs 2.55e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 60 |
| r5g | sigma-35mm-f14-dg-hsm-a-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.12e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | sigma-35mm-f14-dg-hsm-a-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.12e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikkor-z50f12-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 2.17e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r5g | nikkor-z50f12-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 2.17e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r5g | nikkor-z50f12-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.11e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5g | nikkor-z50f12-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.11e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5g | nikkor-z50f12-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 1.83e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r5g | nikkor-z50f12-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 1.83e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r5g | nikkor-z50f12-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.01e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5g | nikkor-z50f12-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.01e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5 | sony-fe-20mm-f18-g-ref | — | lv – optiland | mtfOnAxis.maxAbs 2.74e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60; mtfOffAxis.maxAbs 3.81e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 30 |
| r5g | sony-fe-20mm-f18-g-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 2.49e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 30 |
| r5g | sony-fe-20mm-f18-g-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 2.49e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 30 |
| r5g | sony-fe-20mm-f18-g-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.36e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 20 |
| r5g | sony-fe-20mm-f18-g-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.36e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 20 |
| r5g | sony-fe-20mm-f18-g-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.21e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 10 |
| r5g | sony-fe-20mm-f18-g-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.21e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 10 |
| r5g | sony-fe-20mm-f18-g-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 2.53e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r5g | sony-fe-20mm-f18-g-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 2.53e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 30 |
| r5g | sony-fe-20mm-f18-g-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.43e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| r5g | sony-fe-20mm-f18-g-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.43e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| r5g | sony-fe-20mm-f18-g-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.33e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 10 |
| r5g | sony-fe-20mm-f18-g-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.33e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 10 |
| r5 | sony-fe-400mm-f28-gm-oss-ref | — | lv – optiland | mtfOnAxis.maxAbs 9.95e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 2.17e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 70 |
| r5 | sony-fe-400mm-f28-gm-oss-ref | — | optiland – wave | mtfOnAxis.maxAbs 8.12e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 90; mtfOffAxis.maxAbs 1.84e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 70 |
| r5g | sony-fe-400mm-f28-gm-oss-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 1.12e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r5g | sony-fe-400mm-f28-gm-oss-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 1.12e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r5g | sony-fe-400mm-f28-gm-oss-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.93e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 50 |
| r5g | sony-fe-400mm-f28-gm-oss-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.93e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 50 |
| r5g | sony-fe-400mm-f28-gm-oss-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 8.16e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r5g | sony-fe-400mm-f28-gm-oss-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 8.16e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r5g | sony-fe-400mm-f28-gm-oss-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.71e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5g | sony-fe-400mm-f28-gm-oss-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.71e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-ref | — | lv – optiland | mtfOffAxis.maxAbs 3.44e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-ref | — | optiland – wave | mtfOffAxis.maxAbs 3.59e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 1.02e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 1.02e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.98e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 70 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.98e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 70 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.72e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 40 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.72e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 40 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 9.40e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 90 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 9.40e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 90 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.63e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.63e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.71e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 40 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.71e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 40 |
| r5 | nikon-z-24-70f4s-wide-ref | — | lv – optiland | mtfOffAxis.maxAbs 8.01e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 20 |
| r5 | nikon-z-24-70f4s-wide-ref | — | optiland – wave | mtfOffAxis.maxAbs 8.06e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 20 |
| r5g | nikon-z-24-70f4s-wide-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 6.39e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-wide-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 6.39e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-wide-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 5.33e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r5g | nikon-z-24-70f4s-wide-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 5.33e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r5 | nikon-z-24-70f4s-tele-ref | — | lv – optiland | mtfOnAxis.maxAbs 7.72e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 3.14e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5 | nikon-z-24-70f4s-tele-ref | — | lv – wave | mtfOnAxis.maxAbs 7.54e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 40 |
| r5 | nikon-z-24-70f4s-tele-ref | — | optiland – wave | mtfOffAxis.maxAbs 1.40e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 1.78e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 1.78e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.30e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.30e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r6b | nikon-z-24-70f4s-tele-ref | — | lv – wave | mtfOnAxis.maxAbs 7.54e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 40 |
| r5 | nikon-z-24-70f4s-tele-photopic | — | lv – wave | mtfOnAxis.maxAbs 5.53e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40 |
| r5g | nikon-z-24-70f4s-tele-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 7.89e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 7.89e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.02e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-tele-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.02e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r6b | nikon-z-24-70f4s-tele-photopic | — | lv – wave | mtfOnAxis.maxAbs 5.53e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40 |
| r5g | nikon-z-mc-105f28-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 1.04e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 1.04e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.03e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5g | nikon-z-mc-105f28-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.03e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5 | nikon-z-mc-105f28-photopic | — | lv – wave | mtfOnAxis.maxAbs 5.80e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | nikon-z-mc-105f28-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 6.82e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 6.82e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.09e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.09e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r6b | nikon-z-mc-105f28-photopic | — | lv – wave | mtfOnAxis.maxAbs 5.80e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5 | nikon-z-135f18-plena-ref | — | lv – optiland | mtfOnAxis.maxAbs 8.76e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 3.86e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 80 |
| r5 | nikon-z-135f18-plena-ref | — | optiland – wave | mtfOffAxis.maxAbs 2.93e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-135f18-plena-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 2.66e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r5g | nikon-z-135f18-plena-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 2.66e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r5g | nikon-z-135f18-plena-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 2.74e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 60 |
| r5g | nikon-z-135f18-plena-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 2.74e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 60 |
| r5g | nikon-z-135f18-plena-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 2.82e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r5g | nikon-z-135f18-plena-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 2.82e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r5 | nikon-z-135f18-plena-photopic | — | lv – wave | mtfOnAxis.maxAbs 6.57e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 80 |
| r5g | nikon-z-135f18-plena-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 2.58e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 90 |
| r5g | nikon-z-135f18-plena-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 2.58e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 90 |
| r5g | nikon-z-135f18-plena-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 2.60e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 70 |
| r5g | nikon-z-135f18-plena-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 2.60e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 70 |
| r5g | nikon-z-135f18-plena-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 2.56e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r5g | nikon-z-135f18-plena-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 2.56e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r6b | nikon-z-135f18-plena-photopic | — | lv – wave | mtfOnAxis.maxAbs 6.57e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 80 |
| r5g | canon-ef-135-f2l-usm-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.95e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | canon-ef-135-f2l-usm-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.95e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | canon-ef-135-f2l-usm-best-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 6.59e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40 |
| r5g | canon-ef-135-f2l-usm-best-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 6.59e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40 |
| r5g | canon-ef-135-f2l-usm-best-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.17e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5g | canon-ef-135-f2l-usm-best-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.17e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5 | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 3.03e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 60 |
| r5g | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 5.46e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 90 |
| r5g | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 5.46e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 90 |
| r5g | sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.15e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.15e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.16e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.16e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5 | nikkor-z50f12-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 1.28e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 9.86e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5 | nikkor-z50f12-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 1.33e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikkor-z50f12-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.36e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikkor-z50f12-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.36e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikkor-z50f12-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.18e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5g | nikkor-z50f12-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.18e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5g | nikkor-z50f12-best-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 9.28e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 70 |
| r5g | nikkor-z50f12-best-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 9.28e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 70 |
| r5g | nikkor-z50f12-best-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.12e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| r5g | nikkor-z50f12-best-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.12e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| r5g | nikkor-z50f12-best-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.09e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r5g | nikkor-z50f12-best-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.09e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r5 | sony-fe-20mm-f18-g-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.84e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 3.22e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | sony-fe-20mm-f18-g-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 1.28e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | sony-fe-20mm-f18-g-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 1.28e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | sony-fe-20mm-f18-g-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.17e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 20 |
| r5g | sony-fe-20mm-f18-g-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.17e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 20 |
| r5g | sony-fe-20mm-f18-g-best-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 1.35e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | sony-fe-20mm-f18-g-best-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 1.35e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | sony-fe-20mm-f18-g-best-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.41e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 20 |
| r5g | sony-fe-20mm-f18-g-best-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.41e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 20 |
| r5g | sony-fe-20mm-f18-g-best-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.02e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 10 |
| r5g | sony-fe-20mm-f18-g-best-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.02e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 10 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 9.53e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60; mtfOffAxis.maxAbs 3.24e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 70 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | optiland – wave | mtfOffAxis.maxAbs 3.52e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 9.30e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 9.30e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 2.07e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 2.07e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.74e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.74e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 5.55e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 5.55e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.62e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.62e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.67e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5g | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.67e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5 | nikon-z-24-70f4s-wide-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 6.89e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 70 |
| r5 | nikon-z-24-70f4s-wide-best-ref | — | optiland – wave | mtfOffAxis.maxAbs 7.16e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 70 |
| r5 | nikon-z-24-70f4s-tele-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 3.02e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5 | nikon-z-24-70f4s-tele-best-ref | — | optiland – wave | mtfOffAxis.maxAbs 1.13e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 60 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 8.07e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 8.07e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.08e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.08e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.05e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 40 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.05e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 40 |
| r5g | nikon-z-24-70f4s-tele-best-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.10e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-tele-best-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.10e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5g | nikon-z-24-70f4s-tele-f8-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.28e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-f8-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.28e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-f8-best-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.30e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-f8-best-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.30e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 5.85e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 5.85e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-f8-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.41e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-f8-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.41e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-f8-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 1.26e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-f8-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 1.26e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-f8-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.19e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-f8-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.19e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5 | nikon-z-135f18-plena-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.45e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 2.42e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5 | nikon-z-135f18-plena-best-ref | — | optiland – wave | mtfOffAxis.maxAbs 1.16e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-135f18-plena-best-ref | 0.5 | lv – optiland | mtfOffAxis.maxAbs 2.49e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-135f18-plena-best-ref | 0.5 | optiland – replay | mtfOffAxis.maxAbs 2.49e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-135f18-plena-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 2.51e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5g | nikon-z-135f18-plena-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 2.51e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 60 |
| r5g | nikon-z-135f18-plena-best-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 2.42e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5g | nikon-z-135f18-plena-best-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 2.42e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5g | nikon-z-135f18-plena-best-photopic | 1 | lv – optiland | mtfOffAxis.maxAbs 2.33e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 50 |
| r5g | nikon-z-135f18-plena-best-photopic | 1 | optiland – replay | mtfOffAxis.maxAbs 2.33e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 50 |

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

### The engines' own MTF

A row of such a table is one field, cut and frequency, and has a status of its own:

| Status | Meaning |
|---|---|
| RECORDED | the difference is inside the attention band and was written down |
| ATTENTION | the difference is outside the attention band: worth a look, and not a failure |
| SET ASIDE | the row is in no band, and its class and reason say why |
| UNSUPPORTED | an engine has no curve of the field, so there is no difference |
| ERROR | an engine gave no result, or the two results cannot be set against each other |

A field has the class of its difference, decided in this order, and the reason beside it:

| Class | Meaning |
|---|---|
| unsupported | an engine has no answer |
| data | the two answers are not of the same input |
| convention | a declared transform is missing; this comparison has none to miss and never gives the class |
| numerical | an engine says that its own sampling did not settle |
| method | two methods, each standing by its own curves |
