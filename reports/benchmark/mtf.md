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
| Baseline hash | 1fc8cc6959bbd0dfe6da5ffb9d023822ed61426426fa00a69d995a7cf69ef739 |
| Contract version | 1.1 |
| Policy | rungs v24 |
| Policy hash | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59 | d950739f06bc44c8bff898a823224e9f267dc69aaa6c2029c315298487048a1e | commit 6287f4393ffbc2fd951c7d61f9bc6a024e30591f, dirty false, engineFileCount 184 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 846c50e378e2ebe9f678d9f52ef8594f20cbb96ed773f1e042437710ae947773 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| optiland-wave | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 7d3a5ee7f261a8ae691a0ebf8262e4d58dad54ac8287c3b33dbe94e9a6233d62 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | sourceFiles 13 |
| replay | 1 | fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59 | 7b9996fda36eb76f315491268b845e0dae54d65660bbb0d03e4289f80e497f05 | commit 6287f4393ffbc2fd951c7d61f9bc6a024e30591f, dirty false, engineFileCount 184 |
| wave | 1 | fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59 | 56bd2816660c9ae5a9432632f10739f3503302bf65a5215c2d9d1381260b3ad3 | commit 6287f4393ffbc2fd951c7d61f9bc6a024e30591f, dirty false, engineFileCount 184 |

| Run | Case |
|---|---|
| canon-ef-135-f2l-usm-ref | b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60 |
| canon-ef-135-f2l-usm-photopic | 5a1e4774772748058756cfcb4d918aedab000c3e4857e484254fe6688c651513 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | b241011c9681597d858ca830bb42493ed5d2719b1aa8782269e0f54cde52c35f |
| sigma-35mm-f14-dg-hsm-a-ref | 998482d4e947545c167134a7dabe3f522863dc7d7a70aac77c25a969b4b4cb5e |
| sigma-35mm-f14-dg-hsm-a-photopic | c14175c93aaf26b52e4fc4beda725340d2a3ad3e16d0f5c089800fdb3fb965ae |
| nikkor-z50f12-ref | 861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22 |
| nikkor-z50f12-photopic | 25e839a37b367ed1c9f7298f4e44f9fdb017645f73647e4f965832cb1d28ede2 |
| sony-fe-20mm-f18-g-ref | b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5 |
| sony-fe-20mm-f18-g-photopic | 9bf71fcc2c01fb1e7c25546d8b6a2758be33c6bba8fe4742ebcd3fbac72405d7 |
| sony-fe-400mm-f28-gm-oss-ref | 75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5 |
| sony-fe-400mm-f28-gm-oss-photopic | 25a3d0697df2ed6fe2fd355a06ce5f7a89664142dadd6e7d5e049d3bbc636df7 |
| sigma-105mm-f28-dg-dn-macro-art-ref | e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | c5a507024e5ab43f94adcb83c67c948a9731a2af72fed96ac5515f6eb04f708e |
| nikon-z-24-70f4s-wide-ref | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| nikon-z-24-70f4s-wide-photopic | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc |
| nikon-z-24-70f4s-tele-ref | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| nikon-z-24-70f4s-tele-photopic | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 |
| nikon-z-mc-105f28-ref | 70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb |
| nikon-z-mc-105f28-photopic | e492101b147bcf0f0e156d83376aba617d1c24f20cfdcf0d82b48a03f8b4a92e |
| nikon-z-135f18-plena-ref | 449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab |
| nikon-z-135f18-plena-photopic | 9ac66541b918eea604fa81c70999f824029cc1d2d481851438f0d5d7e86d8224 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 6f62ee09c0c8b3a1cc345e3ed0e0e27aebea0ce5e96cdbee7664ffbab4914e73 |
| canon-ef-135-f2l-usm-best-ref | b4f341d96e9f6e711ecf326eeb3cdaf3602a856cdfba61ec965ecc71b89499de |
| canon-ef-135-f2l-usm-best-photopic | 69d4e5172b1877156ed6cc172c99847863dea3900c1a4bba283471c1e9e4d77a |
| canon-ef-135-f2l-usm-f8-ref | d1fd0633e961ca14b7e8a890140c4d184c21a53e0969e4179e2f142257180fc7 |
| canon-ef-135-f2l-usm-f8-photopic | 731871199792070410cbec4aca73816955e53384dc92b9d251361f507f9f85ac |
| canon-ef-135-f2l-usm-f8-best-ref | 9181a5e3a48bf546f4561ba7bb1b9fb5de2bdf85f2f1080c60230661b568ddca |
| canon-ef-135-f2l-usm-f8-best-photopic | 1edb8e349eae5cb693e7fd3aa842407d2fcfbaac26476210431b6eb4bec8fcad |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 52523bad0a00d71977e0eefafa46b9cda099b1324777dde14b699fab0c5b4b9b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | d86d998c5a70e9c1fa8f9878a114e0860ac1d0a2bb3794a556ed637b05f9061b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 30e4a4eec70f588e984e1210446b9eb671089990b41bdf7c6425457f870b4ebd |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0a789bcb488ae70bd153a4390f164cf24647a72b9508108f7a6635b81735cd3a |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | eb45ad15291d7f5e4556a8ab1655f8b325aa8433e5806470be1db9dbc663d1ae |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 8ed243d16650b84e33194bedae63bbe3b1baf12d708588a18f2ba2b3427735f7 |
| sigma-35mm-f14-dg-hsm-a-best-ref | b4a6f51c4fa23fafe13e4831599380720723bdf259d0a718ab99a9448fe12aaa |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0b3e9ccf74b09ec83e23522124fa0542fb27466441b4bddd5179ac95a29d268d |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 739496a530c13d6dc687e54df4e26ed81c7ad18ebfbfbd15cecdb6588bc9a26a |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 431366dc2d1dbc2767592aecce4cce8c6e3ebe9ae457d488afd0ab39e901c0eb |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | c043b8a737c3aa1ea98906f50cb49cfa2859223b634c2641a55a8410507da665 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 6cdcf10137f8cd397d51d00afe1f5cb89a6f997a542cea149d48c8f4a47e243c |
| nikkor-z50f12-best-ref | 13cd75d2e0891cf4ab4f2e8c006a7719cdd7721caa4dce11e1faa6ab1f70e8f5 |
| nikkor-z50f12-best-photopic | 6e335d456db27535278548bcc6d44f974db63b0f65ae8f9252f5ab3b2aaddc07 |
| nikkor-z50f12-f8-ref | b2e66abb6142cc758397469e55448599762d9712ba3d6cd768f8cea13b336b92 |
| nikkor-z50f12-f8-photopic | 97402aca20f0101b3bfcc039f1cd45547794bd302bc582f837cd86ea56658584 |
| nikkor-z50f12-f8-best-ref | 359dc743691cfd7a56b445301c5703d5ead4e6fc68863d5faf7c5d386acddfa5 |
| nikkor-z50f12-f8-best-photopic | c557755be3310618f79fba94e12eb3cae909f6784afb8b8d412dbeb156d35870 |
| sony-fe-20mm-f18-g-best-ref | 469d8f48aaac16ae2f6e2ce67f033e9eacff42111d6b3e1c1eb2c6450c40fb3a |
| sony-fe-20mm-f18-g-best-photopic | 8d1ccf9e5acdcf3be6daf5353b1f4b36ea8d1a2d317177447abaaa36bb9070ec |
| sony-fe-20mm-f18-g-f8-ref | cd2d5eb4481fbd7b01ae526b4808841fdcb6467f04d85b0cc0e040b2d2955ce0 |
| sony-fe-20mm-f18-g-f8-photopic | e989fae172bd203a3b2d51f1ddffbd17d364aadf4e801383aae83b5f778aae52 |
| sony-fe-20mm-f18-g-f8-best-ref | e169bad1480d89fff330c5fc66e0d06dcb23e767ffd4a9c0a14159caf68abb5e |
| sony-fe-20mm-f18-g-f8-best-photopic | cca38982ae4220225ccf9dec2ea690c58629a4334c81076b5626860f736d7ca1 |
| sony-fe-400mm-f28-gm-oss-best-ref | 321e4ba0ce5c220609a55b35ac8a33079ccf30c7e3258a67ec1463edf2554afb |
| sony-fe-400mm-f28-gm-oss-best-photopic | 432764ba66f320c6af37ef4906a016797499b5310599902028721d470024d9ea |
| sony-fe-400mm-f28-gm-oss-f8-ref | bdba0ea2e9d167e31d49a03bd99c873d71bc7945b8b646ac3cb48b4710a872f2 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 5f85630002361a665e23772e378113957d44c6359ea572fa01c761ae4d2fbf51 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 93e98f340fb7f23d10d90375c3c3953cd5c871e2867247ae73e24e3fa40b0e6d |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 2d91ab3ecb073567986f4cf5de5e83bbdcf61ccf8e9554cdc5e8e9f254947e4b |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | f74812129cc4c7918a44f8ec7cb6ce9882367b23bc0d991f04712a7e6cc9206e |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3b68693f0aed670f4c8b9e652233d6bd9a14812a7d9301ae9efa867558dbdc39 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 58eb582de9ad963ec75ab5f5009ec8889068ea50be5cdb6da32ac6d23f9c6698 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | dc4dfa9211345eb02410bab772dae7de3f2796998d617b94b0f727c9c7928c06 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 5285ea322b02f0fd436d12c9cd11c5e1abde75282625e1351b4d7c57d2f7cdd9 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 9206ace874fc53d400781e67b497a2f70ae09367beb54a55edd489cc8b012871 |
| nikon-z-24-70f4s-wide-best-ref | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| nikon-z-24-70f4s-wide-best-photopic | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 |
| nikon-z-24-70f4s-wide-f8-ref | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| nikon-z-24-70f4s-wide-f8-photopic | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 |
| nikon-z-24-70f4s-wide-f8-best-ref | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 |
| nikon-z-24-70f4s-tele-best-ref | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| nikon-z-24-70f4s-tele-best-photopic | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 |
| nikon-z-24-70f4s-tele-f8-ref | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| nikon-z-24-70f4s-tele-f8-photopic | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf |
| nikon-z-24-70f4s-tele-f8-best-ref | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b |
| nikon-z-mc-105f28-best-ref | c83e32a7f5c48ad358d471710d082e4a5fb745e7baae2c989ec4a957709a8bbb |
| nikon-z-mc-105f28-best-photopic | b97782bbacd99c048ee69ac0d41c84639999e363374ce87d570d501253b5d594 |
| nikon-z-mc-105f28-f8-ref | 904ae8663e1e238175e7d632b807c7b9efc4ab69381a92b0613675b2dbc891a9 |
| nikon-z-mc-105f28-f8-photopic | 56a7dca87fd84d7f382a68e33acdb1c4f58f4afcec119b09ae72a671b836ff83 |
| nikon-z-mc-105f28-f8-best-ref | d31b3e7efcdab37966e8b8135217738e6192f77faec1b974d94409d648accd72 |
| nikon-z-mc-105f28-f8-best-photopic | 05c8d34726e50ab941b4d2caa0a807a96d9077dc3777e4fbb0aa8989c5f6a476 |
| nikon-z-135f18-plena-best-ref | 0c9e2d7b9f2923c21fef404d7b86f7e31456364f77a5f300a13a06219d4add72 |
| nikon-z-135f18-plena-best-photopic | 45ff06bb22f2b3d5be84433c71a1a6e7c4851c4c4d88c3770a88edc0f7922998 |
| nikon-z-135f18-plena-f8-ref | 7f0c3394b7c516d1ac234599e678abe8497b7cf9931f1dd3887a7869e8a703a8 |
| nikon-z-135f18-plena-f8-photopic | f060b855c73e9fb5b18b34e4b1122c30b2beb3de00ca30c00aa4be509825b324 |
| nikon-z-135f18-plena-f8-best-ref | d4eca6fef5c902656e4eb45b1542385a3a1902907993d85a65365ff0d997f6ff |
| nikon-z-135f18-plena-f8-best-photopic | 95151953a4343500ecce7683fbc710f87c1192f0245ee6b6de4948dbc4608652 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0f2591032f4111cf837b08e5e70899199b943dfbe2e54ff2469d14fd9b70a7f0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 8a471dcefb12901a1bf45cd2083cf701fcd4c20f6f515944215f4427e7c2f5cf |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | e44ac8f3c84fa88e4f62f0acd044815be365d1791d98ad87744f5c12e8eabc52 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 34789d7b42b8949cf70123383a08237a20235661e5236fdbcd46d27bd2add967 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 952ae77f90fd93161c6e9e1d307c8b2289770285efe2d2c42c56dc5a5cf47c5a |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 055522122a4c925fdd18f5062abd08ad34585b1567e670ad9591473bdca1eb53 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r4 | rays.trace | 96 | 288 | lv – optiland | 96 PASS | 288 PASS |
| r4 | rays.trace | 96 | 288 | lv – ref | 96 PASS | 288 PASS |
| r4 | rays.trace | 96 | 288 | optiland – ref | 96 PASS | 288 PASS |
| r4f | mtf.native | 96 | 96 | lv – replay | 96 PASS | 96 PASS |
| r5 | mtf.native | 96 | 96 | lv – optiland | 30 RECORDED, 18 ATTENTION, 48 UNSUPPORTED | 30 RECORDED, 18 ATTENTION, 48 UNSUPPORTED |
| r5 | mtf.native | 96 | 96 | lv – wave | 95 RECORDED, 1 ATTENTION | 95 RECORDED, 1 ATTENTION |
| r5 | mtf.native | 96 | 96 | optiland – wave | 36 RECORDED, 12 ATTENTION, 48 UNSUPPORTED | 36 RECORDED, 12 ATTENTION, 48 UNSUPPORTED |
| r5g | mtf.native | 96 | 288 | lv – optiland | 85 RECORDED, 11 ATTENTION | 277 RECORDED, 11 ATTENTION |
| r5g | mtf.native | 96 | 288 | lv – replay | 96 RECORDED | 288 RECORDED |
| r5g | mtf.native | 96 | 288 | optiland – replay | 85 RECORDED, 11 ATTENTION | 277 RECORDED, 11 ATTENTION |
| r6a | rays.trace | 96 | 288 | lv – optiland | 96 PASS | 288 PASS |
| r6a | rays.trace | 96 | 288 | lv – ref | 96 PASS | 288 PASS |
| r6a | rays.trace | 96 | 288 | optiland – ref | 96 PASS | 288 PASS |
| r6b | mtf.native | 96 | 96 | lv – wave | 95 RECORDED, 1 ATTENTION | 95 RECORDED, 1 ATTENTION |
| r6c | mtf.native | 96 | 96 | lv – optiland | 30 RECORDED, 18 ATTENTION, 48 UNSUPPORTED | 30 RECORDED, 18 ATTENTION, 48 UNSUPPORTED |
| r6c | mtf.native | 96 | 96 | lv – optiland-wave | 92 RECORDED, 4 ATTENTION | 92 RECORDED, 4 ATTENTION |
| r6c | mtf.native | 96 | 96 | lv – wave | 95 RECORDED, 1 ATTENTION | 95 RECORDED, 1 ATTENTION |
| r6c | mtf.native | 96 | 96 | optiland – optiland-wave | 32 RECORDED, 16 ATTENTION, 48 UNSUPPORTED | 32 RECORDED, 16 ATTENTION, 48 UNSUPPORTED |
| r6c | mtf.native | 96 | 96 | optiland – wave | 36 RECORDED, 12 ATTENTION, 48 UNSUPPORTED | 36 RECORDED, 12 ATTENTION, 48 UNSUPPORTED |
| r6c | mtf.native | 96 | 96 | optiland-wave – wave | 96 RECORDED | 96 RECORDED |

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
| r6c | lv | 96 ok |
| r6c | optiland | 48 ok, 48 unsupported (feature lines.polychromatic) |
| r6c | optiland-wave | 96 ok |
| r6c | wave | 96 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.07e-11 | 288 of 288 | sigma-45mm-f28-dg-dn-contemporary-ref | cut tangential, field 2.56e1, frequencyPerMm 86 |
| lv – optiland | rays.compared [rays] | 803472 | 288 of 288 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.23e-11 | 288 of 288 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1.66e1, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 803472 | 288 of 288 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.18e-11 | 288 of 288 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 1.66e1, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 803472 | 288 of 288 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: mtf.maxAbs 5.93e-13 (3 of 3) | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.52e-12 (3 of 3) |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 8.69e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: mtf.maxAbs 2.22e-12 (3 of 3) | PASS: mtf.maxAbs 7.44e-13 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: mtf.maxAbs 5.96e-13 (3 of 3) | PASS: mtf.maxAbs 5.59e-13 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: mtf.maxAbs 2.55e-12 (3 of 3) | PASS: mtf.maxAbs 5.51e-12 (3 of 3) | PASS: mtf.maxAbs 8.06e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: mtf.maxAbs 3.04e-12 (3 of 3) | PASS: mtf.maxAbs 2.37e-12 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) |
| nikkor-z50f12-ref | 3 | PASS: mtf.maxAbs 3.92e-12 (3 of 3) | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 4.42e-12 (3 of 3) |
| nikkor-z50f12-photopic | 3 | PASS: mtf.maxAbs 2.87e-12 (3 of 3) | PASS: mtf.maxAbs 5.24e-12 (3 of 3) | PASS: mtf.maxAbs 4.31e-12 (3 of 3) |
| sony-fe-20mm-f18-g-ref | 3 | PASS: mtf.maxAbs 1.78e-12 (3 of 3) | PASS: mtf.maxAbs 4.39e-12 (3 of 3) | PASS: mtf.maxAbs 3.47e-12 (3 of 3) |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 2.41e-12 (3 of 3) | PASS: mtf.maxAbs 3.02e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: mtf.maxAbs 7.18e-12 (3 of 3) | PASS: mtf.maxAbs 3.14e-12 (3 of 3) | PASS: mtf.maxAbs 6.26e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: mtf.maxAbs 3.61e-12 (3 of 3) | PASS: mtf.maxAbs 2.86e-12 (3 of 3) | PASS: mtf.maxAbs 6.18e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 3.07e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 3.19e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: mtf.maxAbs 2.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: mtf.maxAbs 2.77e-12 (3 of 3) | PASS: mtf.maxAbs 7.21e-12 (3 of 3) | PASS: mtf.maxAbs 7.09e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: mtf.maxAbs 8.84e-13 (3 of 3) | PASS: mtf.maxAbs 7.74e-12 (3 of 3) | PASS: mtf.maxAbs 7.60e-12 (3 of 3) |
| nikon-z-mc-105f28-ref | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 2.99e-12 (3 of 3) | PASS: mtf.maxAbs 1.80e-12 (3 of 3) |
| nikon-z-mc-105f28-photopic | 3 | PASS: mtf.maxAbs 5.27e-13 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| nikon-z-135f18-plena-ref | 3 | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) | PASS: mtf.maxAbs 2.73e-12 (3 of 3) |
| nikon-z-135f18-plena-photopic | 3 | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 2.36e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: mtf.maxAbs 1.07e-11 (3 of 3) | PASS: mtf.maxAbs 5.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-11 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: mtf.maxAbs 6.43e-12 (3 of 3) | PASS: mtf.maxAbs 2.53e-12 (3 of 3) | PASS: mtf.maxAbs 6.95e-12 (3 of 3) |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: mtf.maxAbs 6.35e-13 (3 of 3) | PASS: mtf.maxAbs 1.67e-12 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: mtf.maxAbs 7.05e-13 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: mtf.maxAbs 6.04e-13 (3 of 3) | PASS: mtf.maxAbs 5.28e-13 (3 of 3) | PASS: mtf.maxAbs 6.36e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: mtf.maxAbs 3.06e-13 (3 of 3) | PASS: mtf.maxAbs 3.97e-13 (3 of 3) | PASS: mtf.maxAbs 5.93e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: mtf.maxAbs 5.85e-13 (3 of 3) | PASS: mtf.maxAbs 5.21e-13 (3 of 3) | PASS: mtf.maxAbs 6.29e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.65e-13 (3 of 3) | PASS: mtf.maxAbs 4.27e-13 (3 of 3) | PASS: mtf.maxAbs 5.86e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: mtf.maxAbs 7.94e-13 (3 of 3) | PASS: mtf.maxAbs 6.78e-13 (3 of 3) | PASS: mtf.maxAbs 1.09e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: mtf.maxAbs 4.49e-13 (3 of 3) | PASS: mtf.maxAbs 5.14e-13 (3 of 3) | PASS: mtf.maxAbs 6.61e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: mtf.maxAbs 4.36e-13 (3 of 3) | PASS: mtf.maxAbs 3.76e-13 (3 of 3) | PASS: mtf.maxAbs 6.08e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: mtf.maxAbs 3.40e-13 (3 of 3) | PASS: mtf.maxAbs 2.87e-13 (3 of 3) | PASS: mtf.maxAbs 5.21e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: mtf.maxAbs 6.28e-13 (3 of 3) | PASS: mtf.maxAbs 3.77e-13 (3 of 3) | PASS: mtf.maxAbs 7.35e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: mtf.maxAbs 3.31e-13 (3 of 3) | PASS: mtf.maxAbs 2.88e-13 (3 of 3) | PASS: mtf.maxAbs 6.15e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: mtf.maxAbs 3.21e-12 (3 of 3) | PASS: mtf.maxAbs 5.55e-12 (3 of 3) | PASS: mtf.maxAbs 8.76e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: mtf.maxAbs 2.80e-12 (3 of 3) | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 2.87e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 3.90e-12 (3 of 3) | PASS: mtf.maxAbs 5.77e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: mtf.maxAbs 3.69e-13 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 9.69e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 3.80e-12 (3 of 3) | PASS: mtf.maxAbs 5.60e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: mtf.maxAbs 4.22e-13 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) |
| nikkor-z50f12-best-ref | 3 | PASS: mtf.maxAbs 6.22e-12 (3 of 3) | PASS: mtf.maxAbs 5.64e-12 (3 of 3) | PASS: mtf.maxAbs 6.97e-12 (3 of 3) |
| nikkor-z50f12-best-photopic | 3 | PASS: mtf.maxAbs 2.40e-12 (3 of 3) | PASS: mtf.maxAbs 3.56e-12 (3 of 3) | PASS: mtf.maxAbs 3.95e-12 (3 of 3) |
| nikkor-z50f12-f8-ref | 3 | PASS: mtf.maxAbs 1.62e-12 (3 of 3) | PASS: mtf.maxAbs 7.07e-13 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| nikkor-z50f12-f8-photopic | 3 | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 7.50e-13 (3 of 3) | PASS: mtf.maxAbs 6.92e-13 (3 of 3) |
| nikkor-z50f12-f8-best-ref | 3 | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 6.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 6.48e-13 (3 of 3) | PASS: mtf.maxAbs 7.97e-13 (3 of 3) |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 4.56e-12 (3 of 3) | PASS: mtf.maxAbs 3.66e-12 (3 of 3) |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) | PASS: mtf.maxAbs 3.54e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: mtf.maxAbs 7.20e-13 (3 of 3) | PASS: mtf.maxAbs 2.97e-12 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: mtf.maxAbs 8.40e-13 (3 of 3) | PASS: mtf.maxAbs 2.40e-12 (3 of 3) | PASS: mtf.maxAbs 2.42e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: mtf.maxAbs 6.66e-13 (3 of 3) | PASS: mtf.maxAbs 2.96e-12 (3 of 3) | PASS: mtf.maxAbs 2.57e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: mtf.maxAbs 8.68e-13 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) | PASS: mtf.maxAbs 2.61e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: mtf.maxAbs 2.58e-12 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 4.71e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) | PASS: mtf.maxAbs 4.76e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: mtf.maxAbs 3.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.76e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: mtf.maxAbs 7.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.87e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: mtf.maxAbs 8.33e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: mtf.maxAbs 1.53e-12 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) | PASS: mtf.maxAbs 3.97e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 3.51e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 3.35e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: mtf.maxAbs 2.53e-12 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 3.42e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 2.63e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: mtf.maxAbs 2.75e-12 (3 of 3) | PASS: mtf.maxAbs 9.46e-12 (3 of 3) | PASS: mtf.maxAbs 9.47e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: mtf.maxAbs 5.96e-13 (3 of 3) | PASS: mtf.maxAbs 6.54e-12 (3 of 3) | PASS: mtf.maxAbs 6.46e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: mtf.maxAbs 7.25e-13 (3 of 3) | PASS: mtf.maxAbs 3.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.91e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: mtf.maxAbs 5.47e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) | PASS: mtf.maxAbs 1.15e-11 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: mtf.maxAbs 6.24e-13 (3 of 3) | PASS: mtf.maxAbs 4.54e-12 (3 of 3) | PASS: mtf.maxAbs 4.30e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: mtf.maxAbs 9.15e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-11 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: mtf.maxAbs 8.29e-13 (3 of 3) | PASS: mtf.maxAbs 7.92e-12 (3 of 3) | PASS: mtf.maxAbs 7.80e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: mtf.maxAbs 3.13e-13 (3 of 3) | PASS: mtf.maxAbs 6.62e-12 (3 of 3) | PASS: mtf.maxAbs 6.57e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: mtf.maxAbs 3.95e-13 (3 of 3) | PASS: mtf.maxAbs 8.65e-12 (3 of 3) | PASS: mtf.maxAbs 8.39e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: mtf.maxAbs 7.95e-13 (3 of 3) | PASS: mtf.maxAbs 9.12e-12 (3 of 3) | PASS: mtf.maxAbs 8.33e-12 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: mtf.maxAbs 5.08e-13 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) | PASS: mtf.maxAbs 2.95e-12 (3 of 3) |
| nikon-z-mc-105f28-best-ref | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: mtf.maxAbs 3.74e-13 (3 of 3) | PASS: mtf.maxAbs 8.69e-13 (3 of 3) | PASS: mtf.maxAbs 7.17e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 6.47e-13 (3 of 3) | PASS: mtf.maxAbs 5.71e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: mtf.maxAbs 3.38e-13 (3 of 3) | PASS: mtf.maxAbs 5.03e-13 (3 of 3) | PASS: mtf.maxAbs 5.66e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: mtf.maxAbs 9.20e-13 (3 of 3) | PASS: mtf.maxAbs 5.83e-13 (3 of 3) | PASS: mtf.maxAbs 5.03e-13 (3 of 3) |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.88e-13 (3 of 3) | PASS: mtf.maxAbs 4.43e-13 (3 of 3) | PASS: mtf.maxAbs 5.18e-13 (3 of 3) |
| nikon-z-135f18-plena-best-ref | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 9.13e-13 (3 of 3) | PASS: mtf.maxAbs 2.39e-12 (3 of 3) |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: mtf.maxAbs 4.28e-13 (3 of 3) | PASS: mtf.maxAbs 6.13e-13 (3 of 3) | PASS: mtf.maxAbs 8.76e-13 (3 of 3) |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 5.57e-13 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: mtf.maxAbs 4.84e-13 (3 of 3) | PASS: mtf.maxAbs 6.20e-13 (3 of 3) | PASS: mtf.maxAbs 9.40e-13 (3 of 3) |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 5.61e-13 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: mtf.maxAbs 1.00e-11 (3 of 3) | PASS: mtf.maxAbs 4.56e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-11 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: mtf.maxAbs 7.18e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 7.77e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: mtf.maxAbs 7.03e-13 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: mtf.maxAbs 6.61e-13 (3 of 3) | PASS: mtf.maxAbs 4.24e-12 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: mtf.maxAbs 5.35e-13 (3 of 3) | PASS: mtf.maxAbs 4.27e-12 (3 of 3) | PASS: mtf.maxAbs 4.37e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: mtf.maxAbs 6.23e-13 (3 of 3) | PASS: mtf.maxAbs 4.05e-12 (3 of 3) | PASS: mtf.maxAbs 3.61e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.30e-14 | 96 of 96 | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | cut tangential, field 5.00e-1, frequencyPerMm 4 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 96 of 96 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 96 of 96 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| canon-ef-135-f2l-usm-photopic | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | PASS: mtf.maxAbs 1.30e-14 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikkor-z50f12-ref | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| nikkor-z50f12-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| sony-fe-20mm-f18-g-ref | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| sony-fe-20mm-f18-g-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-ref | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-photopic | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-photopic | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikon-z-mc-105f28-ref | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| nikon-z-mc-105f28-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-135f18-plena-ref | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| nikon-z-135f18-plena-photopic | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| canon-ef-135-f2l-usm-best-ref | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-best-photopic | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikkor-z50f12-best-ref | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| nikkor-z50f12-best-photopic | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikkor-z50f12-f8-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikkor-z50f12-f8-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikkor-z50f12-f8-best-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikkor-z50f12-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| sony-fe-20mm-f18-g-best-photopic | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-best-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-best-ref | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-best-photopic | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-ref | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-mc-105f28-best-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| nikon-z-mc-105f28-best-photopic | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-best-ref | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-mc-105f28-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-135f18-plena-best-ref | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| nikon-z-135f18-plena-best-photopic | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-ref | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-best-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-135f18-plena-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |

## r5

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | chiefLanding.maxAbs [mm] | 1.52e-10 | 48 of 96 | nikon-z-mc-105f28-best-ref | field 1 |
| lv – optiland | mtfOnAxis.maxAbs | 2.58e-2 | 47 of 96 | sony-fe-20mm-f18-g-ref | cut tangential, field 0, frequencyPerMm 30 |
| lv – optiland | mtfOffAxis.maxAbs | 4.91e-1 | 45 of 96 | sony-fe-20mm-f18-g-best-ref | cut tangential, field 1, frequencyPerMm 10 |
| lv – optiland | mtfOnAxis.firstStepMaxAbs | 2.62e-2 | 18 of 96 | sony-fe-20mm-f18-g-ref | cut tangential, field 0, frequencyPerMm 30 |
| lv – optiland | mtfOffAxis.firstStepMaxAbs | 2.75e-1 | 15 of 96 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1, frequencyPerMm 50 |
| lv – optiland | fields.compared [elements] | 131 | 48 of 96 | — | — |
| lv – optiland | fields.flagged [elements] | 3 | 48 of 96 | — | — |
| lv – optiland | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| lv – optiland | fields.data [elements] | 0 | 48 of 96 | — | — |
| lv – optiland | fields.unavailable [elements] | 10 | 48 of 96 | — | — |
| lv – optiland | mtfFlagged.maxAbs | 4.59e-1 | 2 of 96 | sony-fe-20mm-f18-g-ref | cut tangential, field 1, frequencyPerMm 10 |
| lv – wave | chiefLanding.maxAbs [mm] | 0 | 96 of 96 | canon-ef-135-f2l-usm-ref | field 0 |
| lv – wave | mtfOnAxis.maxAbs | 5.42e-3 | 82 of 96 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 80 |
| lv – wave | mtfOffAxis.maxAbs | 5.75e-3 | 75 of 96 | nikon-z-24-70f4s-tele-ref | cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| lv – wave | mtfFlagged.maxAbs | 2.47e-2 | 42 of 96 | sigma-35mm-f14-dg-hsm-a-best-ref | cut tangential, field 1, frequencyPerMm 30 |
| lv – wave | fields.compared [elements] | 211 | 96 of 96 | — | — |
| lv – wave | fields.flagged [elements] | 77 | 96 of 96 | — | — |
| lv – wave | fields.rimLost [elements] | 0 | 96 of 96 | — | — |
| lv – wave | fields.data [elements] | 0 | 96 of 96 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |
| optiland – wave | chiefLanding.maxAbs [mm] | 1.52e-10 | 48 of 96 | nikon-z-mc-105f28-best-ref | field 1 |
| optiland – wave | mtfOnAxis.maxAbs | 9.92e-3 | 42 of 96 | sony-fe-400mm-f28-gm-oss-ref | cut tangential, field 0, frequencyPerMm 40 |
| optiland – wave | mtfOffAxis.maxAbs | 4.03e-2 | 40 of 96 | sigma-105mm-f28-dg-dn-macro-art-ref | cut tangential, field 1, frequencyPerMm 30 |
| optiland – wave | mtfOnAxis.firstStepMaxAbs | 1.02e-2 | 15 of 96 | sony-fe-400mm-f28-gm-oss-ref | cut tangential, field 0, frequencyPerMm 40 |
| optiland – wave | mtfOffAxis.firstStepMaxAbs | 3.98e-2 | 12 of 96 | sigma-105mm-f28-dg-dn-macro-art-ref | cut tangential, field 1, frequencyPerMm 30 |
| optiland – wave | mtfFlagged.maxAbs | 4.92e-1 | 19 of 96 | sony-fe-20mm-f18-g-best-ref | cut tangential, field 1, frequencyPerMm 10 |
| optiland – wave | fields.compared [elements] | 107 | 48 of 96 | — | — |
| optiland – wave | fields.flagged [elements] | 27 | 48 of 96 | — | — |
| optiland – wave | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| optiland – wave | fields.data [elements] | 0 | 48 of 96 | — | — |
| optiland – wave | fields.unavailable [elements] | 10 | 48 of 96 | — | — |

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

Rows by status: 224 RECORDED, 38 ATTENTION, 6 SET ASIDE, 20 UNSUPPORTED.

| Run | Field | Cut | lv | optiland | wave | Class | Status | All | lv 10 | optiland 10 | wave 10 | Δ 10 | lv 30 | optiland 30 | wave 30 | Δ 30 | lv 50 | optiland 50 | wave 50 | Δ 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9826 | 0.9830 | 0.9821 | -4.15e-4 | 0.9417 | 0.9430 | 0.9400 | -1.24e-3 | 0.8956 | 0.8978 | 0.8930 | -2.11e-3 |
| canon-ef-135-f2l-usm-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9826 | 0.9830 | 0.9821 | -4.15e-4 | 0.9417 | 0.9430 | 0.9400 | -1.24e-3 | 0.8956 | 0.8978 | 0.8930 | -2.11e-3 |
| canon-ef-135-f2l-usm-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9693 | 0.9693 | 0.9689 | -3.87e-5 | 0.8342 | 0.8333 | 0.8330 | 9.24e-4 | 0.6310 | 0.6279 | 0.6281 | 3.11e-3 |
| canon-ef-135-f2l-usm-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9707 | 0.9707 | 0.9703 | -7.89e-6 | 0.8710 | 0.8689 | 0.8695 | 2.10e-3 | 0.7315 | 0.7255 | 0.7276 | 6.03e-3 |
| canon-ef-135-f2l-usm-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9362 | 0.9374 | 0.9357 | -1.23e-3 | 0.6753 | 0.6758 | 0.6748 | -4.81e-4 | 0.4140 | 0.4085 | 0.4146 | 5.46e-3 |
| canon-ef-135-f2l-usm-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9390 | 0.9391 | 0.9383 | -1.07e-4 | 0.7123 | 0.7142 | 0.7127 | -1.92e-3 | 0.4392 | 0.4409 | 0.4403 | -1.70e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9468 | 0.9462 | 0.9467 | 6.56e-4 | 0.6830 | 0.6793 | 0.6825 | 3.70e-3 | 0.3474 | 0.3417 | 0.3461 | 5.75e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9468 | 0.9462 | 0.9467 | 6.56e-4 | 0.6830 | 0.6793 | 0.6825 | 3.70e-3 | 0.3474 | 0.3417 | 0.3461 | 5.75e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8802 | 0.8793 | 0.8808 | 8.97e-4 | 0.3360 | 0.3320 | 0.3363 | 4.08e-3 | 0.0985 | 0.1028 | 0.0990 | -4.39e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8684 | 0.8671 | 0.8690 | 1.37e-3 | 0.6145 | 0.6142 | 0.6153 | 3.49e-4 | 0.4293 | 0.4235 | 0.4288 | 5.77e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6656 | 0.6677 | 0.6640 | -2.03e-3 | 0.4615 | 0.4630 | 0.4601 | -1.49e-3 | 0.3497 | 0.3502 | 0.3497 | -4.61e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8970 | 0.9016 | 0.8997 | -4.56e-3 | 0.6206 | 0.6349 | 0.6233 | -1.43e-2 | 0.3799 | 0.4035 | 0.3793 | -2.36e-2 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9868 | 0.9871 | 0.9865 | -3.13e-4 | 0.9502 | 0.9515 | 0.9491 | -1.39e-3 | 0.9020 | 0.9049 | 0.9002 | -2.85e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9868 | 0.9871 | 0.9865 | -3.13e-4 | 0.9502 | 0.9515 | 0.9491 | -1.39e-3 | 0.9020 | 0.9049 | 0.9002 | -2.85e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | sagittal | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.9242 | — | 0.9265 | — | 0.6266 | — | 0.6281 | — | 0.3205 | — | 0.3229 | — |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | tangential | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.9579 | — | 0.9589 | — | 0.7855 | — | 0.7908 | — | 0.6140 | — | 0.6170 | — |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | sagittal | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.5121 | — | 0.5014 | — | 0.3724 | — | 0.3648 | — | 0.3211 | — | 0.3205 | — |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | tangential | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.6748 | — | 0.6703 | — | 0.4795 | — | 0.4559 | — | 0.3591 | — | 0.3426 | — |
| nikkor-z50f12-ref | 0 | sagittal | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8192 | 0.8301 | 0.8195 | -1.09e-2 | 0.1877 | 0.2058 | 0.1881 | -1.81e-2 | 0.1753 | 0.1488 | 0.1753 | 2.65e-2 |
| nikkor-z50f12-ref | 0 | tangential | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8192 | 0.8301 | 0.8195 | -1.09e-2 | 0.1877 | 0.2058 | 0.1881 | -1.81e-2 | 0.1753 | 0.1488 | 0.1753 | 2.65e-2 |
| nikkor-z50f12-ref | 0.5 | sagittal | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8718 | 0.8732 | 0.8728 | -1.39e-3 | 0.2335 | 0.2428 | 0.2334 | -9.30e-3 | 0.1923 | 0.1928 | 0.1925 | -5.79e-4 |
| nikkor-z50f12-ref | 0.5 | tangential | ok | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.8021 | 0.8343 | 0.8049 | -3.23e-2 | 0.3993 | 0.4319 | 0.3994 | -3.26e-2 | 0.2971 | 0.3257 | 0.2975 | -2.86e-2 |
| nikkor-z50f12-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8116 | — | 0.8118 | — | 0.1590 | — | 0.1606 | — | 0.1408 | — | 0.1396 | — |
| nikkor-z50f12-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8590 | — | 0.8628 | — | 0.5697 | — | 0.5697 | — | 0.3563 | — | 0.3535 | — |
| sony-fe-20mm-f18-g-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9240 | 0.9323 | 0.9245 | -8.35e-3 | 0.6291 | 0.6549 | 0.6304 | -2.58e-2 | 0.4321 | 0.4444 | 0.4327 | -1.23e-2 |
| sony-fe-20mm-f18-g-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9240 | 0.9323 | 0.9245 | -8.35e-3 | 0.6291 | 0.6549 | 0.6304 | -2.58e-2 | 0.4321 | 0.4444 | 0.4327 | -1.23e-2 |
| sony-fe-20mm-f18-g-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.6973 | 0.7178 | 0.6979 | -2.06e-2 | 0.0039 | 0.0133 | 0.0041 | -9.32e-3 | 0.0076 | 0.0067 | 0.0080 | 8.70e-4 |
| sony-fe-20mm-f18-g-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.4886 | 0.5031 | 0.4870 | -1.45e-2 | 0.1357 | 0.1620 | 0.1372 | -2.63e-2 | 0.1064 | 0.1238 | 0.1070 | -1.74e-2 |
| sony-fe-20mm-f18-g-ref | 1 | sagittal | ok | unconverged (fft512) | unconverged | numerical: unconverged | SET ASIDE | ATTENTION | 0.3134 | 0.3373 | 0.3137 | -2.39e-2 | 0.1255 | 0.1768 | 0.1269 | -5.13e-2 | 0.0666 | 0.1004 | 0.0687 | -3.38e-2 |
| sony-fe-20mm-f18-g-ref | 1 | tangential | ok | unconverged (fft512) | unconverged | numerical: unconverged | SET ASIDE | ATTENTION | 0.1436 | 0.6024 | 0.1435 | -4.59e-1 | 0.1025 | 0.2356 | 0.1047 | -1.33e-1 | 0.0642 | 0.1159 | 0.0624 | -5.17e-2 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9312 | 0.9332 | 0.9310 | -2.04e-3 | 0.6094 | 0.6185 | 0.6093 | -9.03e-3 | 0.2586 | 0.2671 | 0.2590 | -8.55e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9312 | 0.9332 | 0.9310 | -2.04e-3 | 0.6094 | 0.6185 | 0.6093 | -9.03e-3 | 0.2586 | 0.2671 | 0.2590 | -8.55e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9254 | 0.9270 | 0.9252 | -1.55e-3 | 0.5830 | 0.5891 | 0.5829 | -6.11e-3 | 0.2389 | 0.2424 | 0.2393 | -3.48e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9301 | 0.9302 | 0.9298 | -1.76e-4 | 0.6260 | 0.6259 | 0.6257 | 7.30e-5 | 0.3207 | 0.3202 | 0.3208 | 5.38e-4 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9319 | 0.9319 | 0.9316 | 3.92e-5 | 0.6347 | 0.6337 | 0.6348 | 9.71e-4 | 0.3394 | 0.3338 | 0.3403 | 5.59e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9421 | 0.9416 | 0.9419 | 5.32e-4 | 0.7915 | 0.7897 | 0.7910 | 1.77e-3 | 0.6362 | 0.6327 | 0.6358 | 3.43e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9714 | 0.9727 | 0.9712 | -1.29e-3 | 0.9029 | 0.9076 | 0.9027 | -4.67e-3 | 0.8409 | 0.8473 | 0.8406 | -6.39e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9714 | 0.9727 | 0.9712 | -1.29e-3 | 0.9029 | 0.9076 | 0.9027 | -4.67e-3 | 0.8409 | 0.8473 | 0.8406 | -6.39e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9430 | 0.9459 | 0.9429 | -2.86e-3 | 0.7025 | 0.7136 | 0.7025 | -1.12e-2 | 0.4217 | 0.4329 | 0.4222 | -1.12e-2 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8948 | 0.8977 | 0.8947 | -2.95e-3 | 0.4602 | 0.4617 | 0.4607 | -1.45e-3 | 0.1327 | 0.1149 | 0.1336 | 1.78e-2 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9519 | 0.9516 | 0.9516 | 3.06e-4 | 0.7763 | 0.7714 | 0.7758 | 4.92e-3 | 0.5706 | 0.5569 | 0.5697 | 1.38e-2 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9042 | 0.8914 | 0.9040 | 1.28e-2 | 0.5662 | 0.5261 | 0.5665 | 4.00e-2 | 0.3438 | 0.3253 | 0.3442 | 1.85e-2 |
| nikon-z-24-70f4s-wide-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9223 | 0.9240 | 0.9223 | -1.74e-3 | 0.6439 | 0.6508 | 0.6442 | -6.95e-3 | 0.4126 | 0.4198 | 0.4129 | -7.12e-3 |
| nikon-z-24-70f4s-wide-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9223 | 0.9240 | 0.9223 | -1.74e-3 | 0.6439 | 0.6508 | 0.6442 | -6.95e-3 | 0.4126 | 0.4198 | 0.4129 | -7.12e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9280 | 0.9288 | 0.9280 | -7.76e-4 | 0.6660 | 0.6692 | 0.6663 | -3.22e-3 | 0.4306 | 0.4337 | 0.4309 | -3.12e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9476 | 0.9480 | 0.9474 | -3.73e-4 | 0.7947 | 0.7969 | 0.7949 | -2.15e-3 | 0.6520 | 0.6541 | 0.6510 | -2.15e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.7893 | 0.7901 | 0.7893 | -7.58e-4 | 0.0302 | 0.0291 | 0.0308 | 1.12e-3 | 0.2673 | 0.2712 | 0.2668 | -3.86e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.6935 | 0.7513 | 0.6931 | -5.78e-2 | 0.2432 | 0.3025 | 0.2435 | -5.94e-2 | 0.1207 | 0.1616 | 0.1205 | -4.09e-2 |
| nikon-z-24-70f4s-tele-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9660 | 0.9673 | 0.9654 | -1.32e-3 | 0.8910 | 0.8938 | 0.8895 | -2.80e-3 | 0.8080 | 0.8112 | 0.8054 | -3.13e-3 |
| nikon-z-24-70f4s-tele-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9660 | 0.9673 | 0.9654 | -1.32e-3 | 0.8910 | 0.8938 | 0.8895 | -2.80e-3 | 0.8080 | 0.8112 | 0.8054 | -3.13e-3 |
| nikon-z-24-70f4s-tele-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9065 | 0.9140 | 0.9094 | -7.51e-3 | 0.6461 | 0.6569 | 0.6519 | -1.07e-2 | 0.4874 | 0.4876 | 0.4884 | -1.76e-4 |
| nikon-z-24-70f4s-tele-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9393 | 0.9404 | 0.9374 | -1.05e-3 | 0.7477 | 0.7484 | 0.7436 | -6.93e-4 | 0.5361 | 0.5366 | 0.5334 | -5.75e-4 |
| nikon-z-24-70f4s-tele-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6353 | 0.6346 | 0.6324 | 6.68e-4 | 0.4403 | 0.4366 | 0.4382 | 3.64e-3 | 0.3541 | 0.3489 | 0.3557 | 5.18e-3 |
| nikon-z-24-70f4s-tele-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8886 | 0.9364 | 0.8877 | -4.79e-2 | 0.5803 | 0.7707 | 0.5782 | -1.90e-1 | 0.3120 | 0.5871 | 0.3129 | -2.75e-1 |
| nikon-z-mc-105f28-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9632 | 0.9637 | 0.9630 | -4.75e-4 | 0.8135 | 0.8159 | 0.8129 | -2.47e-3 | 0.6080 | 0.6122 | 0.6072 | -4.15e-3 |
| nikon-z-mc-105f28-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9632 | 0.9637 | 0.9630 | -4.75e-4 | 0.8135 | 0.8159 | 0.8129 | -2.47e-3 | 0.6080 | 0.6122 | 0.6072 | -4.15e-3 |
| nikon-z-mc-105f28-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9648 | 0.9649 | 0.9640 | -7.39e-5 | 0.8367 | 0.8379 | 0.8345 | -1.13e-3 | 0.6846 | 0.6872 | 0.6822 | -2.61e-3 |
| nikon-z-mc-105f28-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9691 | 0.9691 | 0.9688 | 3.78e-5 | 0.8953 | 0.8951 | 0.8942 | 1.47e-4 | 0.8120 | 0.8122 | 0.8108 | -1.94e-4 |
| nikon-z-mc-105f28-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8376 | 0.8370 | 0.8399 | 6.43e-4 | 0.4241 | 0.4177 | 0.4273 | 6.41e-3 | 0.3301 | 0.3252 | 0.3292 | 4.86e-3 |
| nikon-z-mc-105f28-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9069 | 0.9057 | 0.9079 | 1.25e-3 | 0.6268 | 0.6232 | 0.6326 | 3.67e-3 | 0.3902 | 0.3858 | 0.3968 | 4.41e-3 |
| nikon-z-135f18-plena-ref | 0 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9744 | 0.9766 | 0.9740 | -2.23e-3 | 0.8847 | 0.8951 | 0.8841 | -1.03e-2 | 0.7852 | 0.8009 | 0.7850 | -1.57e-2 |
| nikon-z-135f18-plena-ref | 0 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9744 | 0.9766 | 0.9740 | -2.23e-3 | 0.8847 | 0.8951 | 0.8841 | -1.03e-2 | 0.7852 | 0.8009 | 0.7850 | -1.57e-2 |
| nikon-z-135f18-plena-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9602 | 0.9637 | 0.9599 | -3.52e-3 | 0.7863 | 0.8024 | 0.7861 | -1.61e-2 | 0.5880 | 0.6076 | 0.5884 | -1.96e-2 |
| nikon-z-135f18-plena-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9716 | 0.9746 | 0.9714 | -2.97e-3 | 0.8779 | 0.8897 | 0.8775 | -1.18e-2 | 0.7866 | 0.8019 | 0.7863 | -1.53e-2 |
| nikon-z-135f18-plena-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9199 | 0.9285 | 0.9201 | -8.59e-3 | 0.5464 | 0.5769 | 0.5477 | -3.06e-2 | 0.2023 | 0.2162 | 0.2031 | -1.39e-2 |
| nikon-z-135f18-plena-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8476 | 0.8558 | 0.8491 | -8.15e-3 | 0.4480 | 0.4512 | 0.4481 | -3.17e-3 | 0.3105 | 0.3071 | 0.3100 | 3.42e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9222 | 0.9233 | 0.9217 | -1.10e-3 | 0.7307 | 0.7346 | 0.7285 | -3.94e-3 | 0.6279 | 0.6308 | 0.6263 | -2.88e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9222 | 0.9233 | 0.9217 | -1.10e-3 | 0.7307 | 0.7346 | 0.7285 | -3.94e-3 | 0.6279 | 0.6308 | 0.6263 | -2.88e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9185 | 0.9196 | 0.9194 | -1.05e-3 | 0.6226 | 0.6264 | 0.6227 | -3.83e-3 | 0.3330 | 0.3364 | 0.3323 | -3.38e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9438 | 0.9440 | 0.9445 | -2.03e-4 | 0.7805 | 0.7806 | 0.7809 | -1.15e-4 | 0.6031 | 0.6014 | 0.6028 | 1.66e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8052 | — | 0.8051 | — | 0.4085 | — | 0.4083 | — | 0.3744 | — | 0.3749 | — |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8237 | — | 0.8241 | — | 0.3754 | — | 0.3761 | — | 0.1457 | — | 0.1456 | — |
| canon-ef-135-f2l-usm-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9831 | 0.9835 | 0.9826 | -3.73e-4 | 0.9459 | 0.9468 | 0.9444 | -9.21e-4 | 0.9051 | 0.9062 | 0.9025 | -1.03e-3 |
| canon-ef-135-f2l-usm-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9831 | 0.9835 | 0.9826 | -3.73e-4 | 0.9459 | 0.9468 | 0.9444 | -9.21e-4 | 0.9051 | 0.9062 | 0.9025 | -1.03e-3 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9652 | 0.9652 | 0.9648 | -6.31e-5 | 0.8009 | 0.8002 | 0.7996 | 6.92e-4 | 0.5541 | 0.5516 | 0.5512 | 2.48e-3 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9690 | 0.9689 | 0.9686 | 8.00e-5 | 0.8567 | 0.8540 | 0.8551 | 2.78e-3 | 0.6969 | 0.6901 | 0.6934 | 6.81e-3 |
| canon-ef-135-f2l-usm-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9379 | 0.9389 | 0.9375 | -9.67e-4 | 0.6764 | 0.6762 | 0.6758 | 1.81e-4 | 0.4026 | 0.3971 | 0.4031 | 5.55e-3 |
| canon-ef-135-f2l-usm-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9380 | 0.9379 | 0.9373 | 7.22e-5 | 0.7050 | 0.7060 | 0.7053 | -9.32e-4 | 0.4237 | 0.4240 | 0.4245 | -3.25e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.44e-4 | 0.8213 | 0.8206 | 0.8200 | 7.07e-4 | 0.7022 | 0.7026 | 0.7021 | -3.91e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.44e-4 | 0.8213 | 0.8206 | 0.8200 | 7.07e-4 | 0.7022 | 0.7026 | 0.7021 | -3.91e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9352 | 0.9350 | 0.9348 | 1.68e-4 | 0.7888 | 0.7886 | 0.7879 | 1.54e-4 | 0.6423 | 0.6438 | 0.6429 | -1.54e-3 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9350 | 0.9348 | 0.9346 | 1.87e-4 | 0.7883 | 0.7881 | 0.7874 | 2.33e-4 | 0.6417 | 0.6431 | 0.6422 | -1.45e-3 |
| canon-ef-135-f2l-usm-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9262 | 0.9261 | 0.9258 | 6.19e-5 | 0.7330 | 0.7337 | 0.7325 | -6.50e-4 | 0.5427 | 0.5459 | 0.5443 | -3.13e-3 |
| canon-ef-135-f2l-usm-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9188 | 0.9187 | 0.9184 | 7.97e-5 | 0.6899 | 0.6907 | 0.6896 | -7.91e-4 | 0.4697 | 0.4732 | 0.4716 | -3.47e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.45e-4 | 0.8216 | 0.8209 | 0.8203 | 7.13e-4 | 0.7027 | 0.7031 | 0.7026 | -3.78e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.45e-4 | 0.8216 | 0.8209 | 0.8203 | 7.13e-4 | 0.7027 | 0.7031 | 0.7026 | -3.78e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9362 | 0.9360 | 0.9358 | 1.83e-4 | 0.7947 | 0.7945 | 0.7937 | 2.58e-4 | 0.6531 | 0.6544 | 0.6536 | -1.33e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9360 | 0.9358 | 0.9355 | 1.99e-4 | 0.7942 | 0.7939 | 0.7932 | 3.27e-4 | 0.6523 | 0.6536 | 0.6528 | -1.26e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9278 | 0.9277 | 0.9274 | 8.49e-5 | 0.7426 | 0.7431 | 0.7420 | -4.92e-4 | 0.5592 | 0.5620 | 0.5606 | -2.86e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9208 | 0.9207 | 0.9204 | 1.03e-4 | 0.7014 | 0.7021 | 0.7010 | -6.23e-4 | 0.4886 | 0.4918 | 0.4903 | -3.21e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9727 | 0.9729 | 0.9729 | -2.10e-4 | 0.9038 | 0.9050 | 0.9048 | -1.27e-3 | 0.8317 | 0.8326 | 0.8326 | -9.11e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9727 | 0.9729 | 0.9729 | -2.10e-4 | 0.9038 | 0.9050 | 0.9048 | -1.27e-3 | 0.8317 | 0.8326 | 0.8326 | -9.11e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9088 | 0.9082 | 0.9096 | 5.53e-4 | 0.6168 | 0.6142 | 0.6161 | 2.54e-3 | 0.3285 | 0.3248 | 0.3276 | 3.67e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8606 | 0.8586 | 0.8609 | 1.95e-3 | 0.7213 | 0.7228 | 0.7222 | -1.48e-3 | 0.6275 | 0.6266 | 0.6268 | 8.69e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6080 | 0.6101 | 0.6058 | -2.15e-3 | 0.3761 | 0.3785 | 0.3765 | -2.42e-3 | 0.2755 | 0.2763 | 0.2773 | -8.50e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9049 | 0.9091 | 0.9068 | -4.20e-3 | 0.6087 | 0.6271 | 0.6116 | -1.84e-2 | 0.3256 | 0.3546 | 0.3271 | -2.89e-2 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9402 | 0.9398 | 0.9399 | 3.99e-4 | 0.8194 | 0.8185 | 0.8185 | 9.23e-4 | 0.6994 | 0.6996 | 0.6997 | -2.09e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9402 | 0.9398 | 0.9399 | 3.99e-4 | 0.8194 | 0.8185 | 0.8185 | 9.23e-4 | 0.6994 | 0.6996 | 0.6997 | -2.09e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9219 | 0.9217 | 0.9217 | 1.89e-4 | 0.7131 | 0.7140 | 0.7132 | -8.42e-4 | 0.5149 | 0.5186 | 0.5171 | -3.65e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9363 | 0.9359 | 0.9359 | 4.37e-4 | 0.8056 | 0.8048 | 0.8047 | 8.82e-4 | 0.6771 | 0.6776 | 0.6776 | -4.85e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9335 | 0.9331 | 0.9331 | 3.83e-4 | 0.7901 | 0.7894 | 0.7892 | 6.70e-4 | 0.6495 | 0.6504 | 0.6503 | -9.26e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9226 | 0.9221 | 0.9220 | 4.48e-4 | 0.7464 | 0.7460 | 0.7452 | 4.84e-4 | 0.5745 | 0.5743 | 0.5738 | 2.50e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9408 | 0.9403 | 0.9404 | 4.22e-4 | 0.8220 | 0.8209 | 0.8210 | 1.07e-3 | 0.7031 | 0.7030 | 0.7032 | 4.32e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9408 | 0.9403 | 0.9404 | 4.22e-4 | 0.8220 | 0.8209 | 0.8210 | 1.07e-3 | 0.7031 | 0.7030 | 0.7032 | 4.32e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9279 | 0.9276 | 0.9276 | 2.72e-4 | 0.7478 | 0.7480 | 0.7476 | -2.23e-4 | 0.5732 | 0.5758 | 0.5748 | -2.57e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9371 | 0.9367 | 0.9367 | 4.34e-4 | 0.8096 | 0.8086 | 0.8085 | 9.39e-4 | 0.6831 | 0.6835 | 0.6836 | -3.66e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9338 | 0.9334 | 0.9334 | 3.17e-4 | 0.7929 | 0.7925 | 0.7921 | 3.44e-4 | 0.6555 | 0.6568 | 0.6564 | -1.27e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9192 | 0.9188 | 0.9187 | 3.96e-4 | 0.7253 | 0.7251 | 0.7241 | 1.85e-4 | 0.5385 | 0.5388 | 0.5380 | -3.77e-4 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9884 | 0.9887 | 0.9881 | -2.51e-4 | 0.9644 | 0.9651 | 0.9635 | -7.47e-4 | 0.9392 | 0.9404 | 0.9378 | -1.15e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9884 | 0.9887 | 0.9881 | -2.51e-4 | 0.9644 | 0.9651 | 0.9635 | -7.47e-4 | 0.9392 | 0.9404 | 0.9378 | -1.15e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.9220 | — | 0.9243 | — | 0.6518 | — | 0.6532 | — | 0.4058 | — | 0.4099 | — |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.9510 | — | 0.9520 | — | 0.7464 | — | 0.7517 | — | 0.5450 | — | 0.5484 | — |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.5033 | — | 0.4928 | — | 0.3601 | — | 0.3525 | — | 0.3072 | — | 0.3076 | — |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.6747 | — | 0.6706 | — | 0.4831 | — | 0.4584 | — | 0.3675 | — | 0.3499 | — |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.04e-4 | 0.8218 | 0.8210 | 0.8206 | 8.29e-4 | 0.7031 | 0.7034 | 0.7031 | -2.44e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.04e-4 | 0.8218 | 0.8210 | 0.8206 | 8.29e-4 | 0.7031 | 0.7034 | 0.7031 | -2.44e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9318 | 0.9316 | 0.9314 | 2.04e-4 | 0.7691 | 0.7691 | 0.7683 | -2.26e-6 | 0.6070 | 0.6090 | 0.6080 | -1.99e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9378 | 0.9374 | 0.9373 | 3.19e-4 | 0.8123 | 0.8115 | 0.8111 | 7.85e-4 | 0.6870 | 0.6876 | 0.6873 | -5.20e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9366 | 0.9368 | 2.15e-4 | 0.8085 | 0.8080 | 0.8085 | 4.96e-4 | 0.6822 | 0.6808 | 0.6821 | 1.37e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8686 | 0.8688 | 0.8685 | -1.45e-4 | 0.6092 | 0.6098 | 0.6089 | -5.83e-4 | 0.3726 | 0.3720 | 0.3723 | 6.07e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.04e-4 | 0.8218 | 0.8210 | 0.8207 | 8.29e-4 | 0.7031 | 0.7034 | 0.7031 | -2.44e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.04e-4 | 0.8218 | 0.8210 | 0.8207 | 8.29e-4 | 0.7031 | 0.7034 | 0.7031 | -2.44e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9316 | 0.9314 | 0.9312 | 2.01e-4 | 0.7679 | 0.7679 | 0.7672 | -2.28e-5 | 0.6049 | 0.6070 | 0.6060 | -2.02e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9378 | 0.9375 | 0.9374 | 3.19e-4 | 0.8125 | 0.8117 | 0.8113 | 7.88e-4 | 0.6874 | 0.6879 | 0.6877 | -5.14e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9366 | 0.9368 | 2.14e-4 | 0.8082 | 0.8077 | 0.8082 | 4.94e-4 | 0.6816 | 0.6803 | 0.6816 | 1.37e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8686 | 0.8688 | 0.8685 | -1.45e-4 | 0.6093 | 0.6099 | 0.6090 | -5.84e-4 | 0.3727 | 0.3721 | 0.3724 | 6.07e-4 |
| nikkor-z50f12-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9823 | 0.9824 | 0.9820 | -1.10e-4 | 0.9036 | 0.9032 | 0.9024 | 4.42e-4 | 0.7822 | 0.7800 | 0.7796 | 2.13e-3 |
| nikkor-z50f12-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9823 | 0.9824 | 0.9820 | -1.10e-4 | 0.9036 | 0.9032 | 0.9024 | 4.42e-4 | 0.7822 | 0.7800 | 0.7796 | 2.13e-3 |
| nikkor-z50f12-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9368 | 0.9408 | 0.9371 | -4.04e-3 | 0.7247 | 0.7295 | 0.7253 | -4.79e-3 | 0.6263 | 0.6236 | 0.6268 | 2.62e-3 |
| nikkor-z50f12-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9438 | 0.9530 | 0.9466 | -9.19e-3 | 0.7486 | 0.7793 | 0.7481 | -3.07e-2 | 0.5751 | 0.6145 | 0.5728 | -3.94e-2 |
| nikkor-z50f12-best-ref | 1 | sagittal | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.7899 | — | 0.7904 | — | 0.5257 | — | 0.5249 | — | 0.3059 | — | 0.3065 | — |
| nikkor-z50f12-best-ref | 1 | tangential | ok | no curve (fft512) | unconverged | unsupported: no-curve | UNSUPPORTED | ATTENTION | 0.8738 | — | 0.8794 | — | 0.5325 | — | 0.5357 | — | 0.2545 | — | 0.2548 | — |
| nikkor-z50f12-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.19e-4 | 0.8219 | 0.8211 | 0.8207 | 8.57e-4 | 0.7032 | 0.7035 | 0.7032 | -2.12e-4 |
| nikkor-z50f12-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.19e-4 | 0.8219 | 0.8211 | 0.8207 | 8.57e-4 | 0.7032 | 0.7035 | 0.7032 | -2.12e-4 |
| nikkor-z50f12-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9379 | 0.9376 | 0.9376 | 3.09e-4 | 0.8087 | 0.8080 | 0.8076 | 6.77e-4 | 0.6796 | 0.6803 | 0.6800 | -6.58e-4 |
| nikkor-z50f12-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9372 | 0.9369 | 0.9368 | 3.44e-4 | 0.8117 | 0.8108 | 0.8104 | 8.44e-4 | 0.6862 | 0.6867 | 0.6866 | -4.81e-4 |
| nikkor-z50f12-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9189 | 0.9189 | 0.9186 | 5.94e-5 | 0.7053 | 0.7065 | 0.7051 | -1.22e-3 | 0.5037 | 0.5074 | 0.5056 | -3.67e-3 |
| nikkor-z50f12-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9207 | 0.9205 | 0.9201 | 2.07e-4 | 0.7513 | 0.7511 | 0.7499 | 1.92e-4 | 0.5898 | 0.5888 | 0.5881 | 1.05e-3 |
| nikkor-z50f12-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.19e-4 | 0.8219 | 0.8211 | 0.8207 | 8.57e-4 | 0.7032 | 0.7035 | 0.7032 | -2.11e-4 |
| nikkor-z50f12-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 3.19e-4 | 0.8219 | 0.8211 | 0.8207 | 8.57e-4 | 0.7032 | 0.7035 | 0.7032 | -2.11e-4 |
| nikkor-z50f12-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9380 | 0.9377 | 0.9376 | 3.10e-4 | 0.8092 | 0.8085 | 0.8082 | 6.87e-4 | 0.6806 | 0.6812 | 0.6810 | -6.38e-4 |
| nikkor-z50f12-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9372 | 0.9369 | 0.9368 | 3.44e-4 | 0.8117 | 0.8108 | 0.8105 | 8.45e-4 | 0.6862 | 0.6867 | 0.6866 | -4.80e-4 |
| nikkor-z50f12-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9192 | 0.9191 | 0.9189 | 6.45e-5 | 0.7070 | 0.7081 | 0.7067 | -1.19e-3 | 0.5064 | 0.5100 | 0.5083 | -3.63e-3 |
| nikkor-z50f12-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9208 | 0.9206 | 0.9202 | 2.09e-4 | 0.7520 | 0.7518 | 0.7505 | 1.99e-4 | 0.5910 | 0.5899 | 0.5892 | 1.07e-3 |
| sony-fe-20mm-f18-g-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9716 | 0.9735 | 0.9716 | -1.94e-3 | 0.8654 | 0.8725 | 0.8655 | -7.15e-3 | 0.7314 | 0.7398 | 0.7315 | -8.43e-3 |
| sony-fe-20mm-f18-g-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9716 | 0.9735 | 0.9716 | -1.94e-3 | 0.8654 | 0.8725 | 0.8655 | -7.15e-3 | 0.7314 | 0.7398 | 0.7315 | -8.43e-3 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8490 | 0.8608 | 0.8497 | -1.19e-2 | 0.3156 | 0.3324 | 0.3150 | -1.69e-2 | 0.1650 | 0.1452 | 0.1649 | 1.98e-2 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6513 | 0.6611 | 0.6503 | -9.86e-3 | 0.2821 | 0.2901 | 0.2834 | -8.00e-3 | 0.1219 | 0.1270 | 0.1225 | -5.08e-3 |
| sony-fe-20mm-f18-g-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.5104 | 0.5302 | 0.5097 | -1.98e-2 | 0.2968 | 0.3339 | 0.2967 | -3.71e-2 | 0.0052 | 0.0115 | 0.0065 | -6.22e-3 |
| sony-fe-20mm-f18-g-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.1516 | 0.6428 | 0.1508 | -4.91e-1 | 0.1307 | 0.2302 | 0.1340 | -9.96e-2 | 0.0752 | 0.1056 | 0.0735 | -3.04e-2 |
| sony-fe-20mm-f18-g-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.49e-4 | 0.8216 | 0.8209 | 0.8203 | 7.21e-4 | 0.7028 | 0.7031 | 0.7027 | -3.70e-4 |
| sony-fe-20mm-f18-g-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.49e-4 | 0.8216 | 0.8209 | 0.8203 | 7.21e-4 | 0.7028 | 0.7031 | 0.7027 | -3.70e-4 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9296 | 0.9295 | 0.9292 | 1.62e-4 | 0.7677 | 0.7678 | 0.7669 | -1.76e-4 | 0.6093 | 0.6112 | 0.6103 | -1.90e-3 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9156 | 0.9155 | 0.9152 | 1.23e-4 | 0.7163 | 0.7171 | 0.7157 | -8.44e-4 | 0.5342 | 0.5361 | 0.5345 | -1.89e-3 |
| sony-fe-20mm-f18-g-f8-ref | 1 | sagittal | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8665 | — | 0.8665 | — | 0.4811 | — | 0.4813 | — | 0.2163 | — | 0.2168 | — |
| sony-fe-20mm-f18-g-f8-ref | 1 | tangential | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.7720 | — | 0.7720 | — | 0.3132 | — | 0.3132 | — | 0.1462 | — | 0.1465 | — |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.49e-4 | 0.8216 | 0.8209 | 0.8203 | 7.21e-4 | 0.7028 | 0.7031 | 0.7027 | -3.70e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.49e-4 | 0.8216 | 0.8209 | 0.8203 | 7.21e-4 | 0.7028 | 0.7031 | 0.7027 | -3.70e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9297 | 0.9295 | 0.9293 | 1.63e-4 | 0.7681 | 0.7683 | 0.7673 | -1.67e-4 | 0.6101 | 0.6119 | 0.6111 | -1.88e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9157 | 0.9156 | 0.9153 | 1.25e-4 | 0.7168 | 0.7176 | 0.7162 | -8.34e-4 | 0.5349 | 0.5368 | 0.5352 | -1.88e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | sagittal | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8667 | — | 0.8666 | — | 0.4819 | — | 0.4821 | — | 0.2173 | — | 0.2177 | — |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | tangential | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.7722 | — | 0.7721 | — | 0.3136 | — | 0.3136 | — | 0.1465 | — | 0.1468 | — |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9775 | 0.9778 | 0.9771 | -2.95e-4 | 0.9322 | 0.9330 | 0.9310 | -8.62e-4 | 0.8867 | 0.8879 | 0.8848 | -1.17e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9775 | 0.9778 | 0.9771 | -2.95e-4 | 0.9322 | 0.9330 | 0.9310 | -8.62e-4 | 0.8867 | 0.8879 | 0.8848 | -1.17e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9755 | 0.9762 | 0.9757 | -6.70e-4 | 0.9220 | 0.9242 | 0.9227 | -2.17e-3 | 0.8665 | 0.8703 | 0.8682 | -3.81e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9718 | 0.9720 | 0.9715 | -1.87e-4 | 0.9081 | 0.9085 | 0.9075 | -4.02e-4 | 0.8402 | 0.8409 | 0.8395 | -7.08e-4 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9728 | 0.9725 | 0.9725 | 2.89e-4 | 0.9108 | 0.9099 | 0.9103 | 8.18e-4 | 0.8462 | 0.8448 | 0.8454 | 1.43e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9485 | 0.9479 | 0.9483 | 5.95e-4 | 0.8379 | 0.8365 | 0.8376 | 1.43e-3 | 0.7306 | 0.7279 | 0.7299 | 2.67e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9356 | 0.9355 | 0.9352 | 1.43e-4 | 0.7912 | 0.7910 | 0.7902 | 1.68e-4 | 0.6466 | 0.6481 | 0.6472 | -1.43e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9356 | 0.9355 | 0.9352 | 1.43e-4 | 0.7912 | 0.7910 | 0.7902 | 1.68e-4 | 0.6466 | 0.6481 | 0.6472 | -1.43e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9365 | 0.9364 | 0.9361 | 1.46e-4 | 0.7984 | 0.7982 | 0.7973 | 2.15e-4 | 0.6606 | 0.6619 | 0.6610 | -1.30e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9367 | 0.9363 | 1.23e-4 | 0.8027 | 0.8025 | 0.8016 | 1.59e-4 | 0.6698 | 0.6711 | 0.6701 | -1.29e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9361 | 0.9357 | 7.18e-4 | 0.7992 | 0.7974 | 0.7963 | 1.77e-3 | 0.6636 | 0.6618 | 0.6600 | 1.82e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9338 | 0.9340 | 0.9335 | -2.03e-4 | 0.7931 | 0.7938 | 0.7922 | -6.45e-4 | 0.6567 | 0.6587 | 0.6573 | -1.94e-3 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.10e-4 | 0.8214 | 0.8208 | 0.8201 | 6.46e-4 | 0.7025 | 0.7030 | 0.7024 | -4.56e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.10e-4 | 0.8214 | 0.8208 | 0.8201 | 6.46e-4 | 0.7025 | 0.7030 | 0.7024 | -4.56e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9400 | 0.9398 | 0.9396 | 2.06e-4 | 0.8199 | 0.8192 | 0.8185 | 6.26e-4 | 0.6997 | 0.7002 | 0.6996 | -5.15e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9392 | 0.9390 | 0.9387 | 1.98e-4 | 0.8162 | 0.8156 | 0.8148 | 6.05e-4 | 0.6930 | 0.6936 | 0.6929 | -6.05e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9394 | 0.9396 | 0.9393 | -1.92e-4 | 0.8173 | 0.8178 | 0.8171 | -5.14e-4 | 0.6962 | 0.6972 | 0.6959 | -9.47e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9368 | 0.9370 | 0.9366 | -2.18e-4 | 0.8084 | 0.8089 | 0.8080 | -5.77e-4 | 0.6821 | 0.6823 | 0.6815 | -1.49e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9739 | 0.9748 | 0.9737 | -8.89e-4 | 0.9119 | 0.9147 | 0.9115 | -2.88e-3 | 0.8432 | 0.8480 | 0.8437 | -4.85e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9739 | 0.9748 | 0.9737 | -8.89e-4 | 0.9119 | 0.9147 | 0.9115 | -2.88e-3 | 0.8432 | 0.8480 | 0.8437 | -4.85e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9585 | 0.9606 | 0.9583 | -2.05e-3 | 0.8061 | 0.8147 | 0.8059 | -8.53e-3 | 0.6215 | 0.6328 | 0.6218 | -1.13e-2 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9178 | 0.9203 | 0.9177 | -2.49e-3 | 0.5785 | 0.5819 | 0.5789 | -3.33e-3 | 0.2651 | 0.2561 | 0.2666 | 9.04e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9487 | 0.9488 | 0.9484 | -1.28e-4 | 0.7785 | 0.7759 | 0.7780 | 2.64e-3 | 0.6165 | 0.6075 | 0.6158 | 8.97e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | tangential | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9179 | 0.9073 | 0.9177 | 1.06e-2 | 0.6330 | 0.5957 | 0.6332 | 3.73e-2 | 0.4125 | 0.3848 | 0.4128 | 2.78e-2 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9403 | 0.9401 | 0.9398 | 1.52e-4 | 0.8211 | 0.8205 | 0.8197 | 5.28e-4 | 0.7020 | 0.7026 | 0.7018 | -5.95e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9403 | 0.9401 | 0.9398 | 1.52e-4 | 0.8211 | 0.8205 | 0.8197 | 5.28e-4 | 0.7020 | 0.7026 | 0.7018 | -5.95e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9341 | 0.9340 | 0.9336 | 6.72e-5 | 0.7840 | 0.7841 | 0.7829 | -9.00e-5 | 0.6338 | 0.6357 | 0.6344 | -1.84e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9287 | 0.9287 | 0.9281 | -1.46e-5 | 0.7571 | 0.7578 | 0.7563 | -6.76e-4 | 0.5896 | 0.5923 | 0.5905 | -2.72e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9285 | 0.9295 | 0.9294 | -9.68e-4 | 0.7476 | 0.7499 | 0.7499 | -2.30e-3 | 0.5709 | 0.5726 | 0.5726 | -1.72e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9156 | 0.9149 | 0.9152 | 6.18e-4 | 0.7313 | 0.7296 | 0.7313 | 1.77e-3 | 0.5598 | 0.5582 | 0.5615 | 1.57e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9403 | 0.9401 | 0.9398 | 1.52e-4 | 0.8211 | 0.8206 | 0.8197 | 5.31e-4 | 0.7021 | 0.7027 | 0.7019 | -5.91e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9403 | 0.9401 | 0.9398 | 1.52e-4 | 0.8211 | 0.8206 | 0.8197 | 5.31e-4 | 0.7021 | 0.7027 | 0.7019 | -5.91e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9335 | 0.9335 | 0.9331 | 5.78e-5 | 0.7807 | 0.7808 | 0.7796 | -1.55e-4 | 0.6279 | 0.6298 | 0.6285 | -1.96e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9280 | 0.9280 | 0.9274 | -2.77e-5 | 0.7530 | 0.7537 | 0.7522 | -7.63e-4 | 0.5824 | 0.5852 | 0.5834 | -2.86e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9277 | 0.9287 | 0.9286 | -9.77e-4 | 0.7427 | 0.7451 | 0.7450 | -2.38e-3 | 0.5624 | 0.5642 | 0.5641 | -1.86e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9151 | 0.9144 | 0.9147 | 6.28e-4 | 0.7286 | 0.7268 | 0.7287 | 1.79e-3 | 0.5557 | 0.5542 | 0.5575 | 1.58e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9648 | 0.9650 | 0.9647 | -1.08e-4 | 0.8739 | 0.8741 | 0.8734 | -1.36e-4 | 0.7672 | 0.7670 | 0.7663 | 1.26e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9648 | 0.9650 | 0.9647 | -1.08e-4 | 0.8739 | 0.8741 | 0.8734 | -1.36e-4 | 0.7672 | 0.7670 | 0.7663 | 1.26e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9605 | 0.9607 | 0.9604 | -2.03e-4 | 0.8502 | 0.8509 | 0.8502 | -7.32e-4 | 0.7262 | 0.7272 | 0.7262 | -9.83e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9499 | 0.9499 | 0.9497 | 6.77e-5 | 0.7658 | 0.7653 | 0.7654 | 5.52e-4 | 0.5259 | 0.5258 | 0.5260 | 1.03e-4 |
| nikon-z-24-70f4s-wide-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.9210 | 0.9209 | 0.9209 | 9.28e-5 | 0.5760 | 0.5757 | 0.5755 | 3.23e-4 | 0.1869 | 0.1867 | 0.1852 | 1.62e-4 |
| nikon-z-24-70f4s-wide-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.7767 | 0.8179 | 0.7764 | -4.11e-2 | 0.4055 | 0.4648 | 0.4043 | -5.92e-2 | 0.2421 | 0.2983 | 0.2386 | -5.62e-2 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9399 | 0.9396 | 0.9395 | 2.79e-4 | 0.8184 | 0.8177 | 0.8173 | 6.65e-4 | 0.6980 | 0.6985 | 0.6981 | -5.14e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9399 | 0.9396 | 0.9395 | 2.79e-4 | 0.8184 | 0.8177 | 0.8173 | 6.65e-4 | 0.6980 | 0.6985 | 0.6981 | -5.14e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9354 | 0.9352 | 0.9351 | 2.55e-4 | 0.7975 | 0.7971 | 0.7966 | 3.96e-4 | 0.6611 | 0.6622 | 0.6617 | -1.11e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9335 | 0.9331 | 0.9330 | 3.59e-4 | 0.7994 | 0.7986 | 0.7981 | 7.90e-4 | 0.6671 | 0.6670 | 0.6669 | 1.71e-5 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8811 | 0.8817 | 0.8812 | -6.53e-4 | 0.5207 | 0.5241 | 0.5209 | -3.35e-3 | 0.2456 | 0.2499 | 0.2460 | -4.27e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8517 | 0.8530 | 0.8517 | -1.30e-3 | 0.5673 | 0.5731 | 0.5662 | -5.78e-3 | 0.3691 | 0.3766 | 0.3670 | -7.50e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9401 | 3.12e-4 | 0.8214 | 0.8205 | 0.8202 | 8.51e-4 | 0.7021 | 0.7023 | 0.7021 | -2.01e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9401 | 3.12e-4 | 0.8214 | 0.8205 | 0.8202 | 8.51e-4 | 0.7021 | 0.7023 | 0.7021 | -2.01e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9377 | 0.9374 | 0.9373 | 2.95e-4 | 0.8110 | 0.8103 | 0.8099 | 6.98e-4 | 0.6850 | 0.6856 | 0.6854 | -5.92e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9326 | 0.9322 | 0.9321 | 3.75e-4 | 0.7935 | 0.7927 | 0.7923 | 8.14e-4 | 0.6560 | 0.6561 | 0.6559 | -5.40e-5 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8921 | 0.8926 | 0.8922 | -4.90e-4 | 0.5750 | 0.5777 | 0.5752 | -2.65e-3 | 0.3174 | 0.3209 | 0.3177 | -3.54e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8608 | 0.8618 | 0.8609 | -9.93e-4 | 0.5976 | 0.6025 | 0.5966 | -4.91e-3 | 0.4044 | 0.4112 | 0.4027 | -6.82e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9678 | 0.9688 | 0.9669 | -9.39e-4 | 0.9030 | 0.9043 | 0.9000 | -1.29e-3 | 0.8376 | 0.8405 | 0.8351 | -2.88e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9678 | 0.9688 | 0.9669 | -9.39e-4 | 0.9030 | 0.9043 | 0.9000 | -1.29e-3 | 0.8376 | 0.8405 | 0.8351 | -2.88e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9251 | 0.9292 | 0.9251 | -4.08e-3 | 0.7190 | 0.7253 | 0.7195 | -6.29e-3 | 0.5740 | 0.5759 | 0.5739 | -1.82e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9395 | 0.9425 | 0.9390 | -2.96e-3 | 0.7749 | 0.7807 | 0.7746 | -5.88e-3 | 0.6154 | 0.6202 | 0.6156 | -4.79e-3 |
| nikon-z-24-70f4s-tele-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.6544 | 0.6575 | 0.6545 | -3.09e-3 | 0.4565 | 0.4556 | 0.4571 | 9.04e-4 | 0.3649 | 0.3578 | 0.3651 | 7.03e-3 |
| nikon-z-24-70f4s-tele-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.8863 | 0.9352 | 0.8858 | -4.89e-2 | 0.5768 | 0.7661 | 0.5756 | -1.89e-1 | 0.3142 | 0.5815 | 0.3157 | -2.67e-1 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9395 | 0.9394 | 0.9390 | 4.82e-5 | 0.8172 | 0.8170 | 0.8158 | 2.34e-4 | 0.6961 | 0.6971 | 0.6959 | -1.00e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9395 | 0.9394 | 0.9390 | 4.82e-5 | 0.8172 | 0.8170 | 0.8158 | 2.34e-4 | 0.6961 | 0.6971 | 0.6959 | -1.00e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9378 | 0.9378 | 0.9373 | -2.07e-5 | 0.8126 | 0.8126 | 0.8112 | 6.38e-5 | 0.6892 | 0.6903 | 0.6891 | -1.14e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9317 | 0.9317 | 0.9310 | -1.13e-5 | 0.7830 | 0.7834 | 0.7817 | -4.79e-4 | 0.6381 | 0.6400 | 0.6382 | -1.90e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9257 | 0.9260 | 0.9253 | -3.06e-4 | 0.7605 | 0.7615 | 0.7601 | -1.01e-3 | 0.6098 | 0.6118 | 0.6107 | -2.01e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9141 | 0.9146 | 0.9134 | -5.70e-4 | 0.7238 | 0.7269 | 0.7227 | -3.10e-3 | 0.5443 | 0.5478 | 0.5438 | -3.45e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9401 | 0.9400 | 0.9396 | 7.32e-5 | 0.8204 | 0.8201 | 0.8189 | 3.83e-4 | 0.7009 | 0.7017 | 0.7006 | -7.50e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9401 | 0.9400 | 0.9396 | 7.32e-5 | 0.8204 | 0.8201 | 0.8189 | 3.83e-4 | 0.7009 | 0.7017 | 0.7006 | -7.50e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9379 | 0.9379 | 0.9373 | 4.45e-5 | 0.8107 | 0.8103 | 0.8091 | 4.05e-4 | 0.6825 | 0.6833 | 0.6822 | -7.58e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9342 | 0.9342 | 0.9335 | 2.97e-5 | 0.7980 | 0.7981 | 0.7965 | -1.21e-4 | 0.6641 | 0.6654 | 0.6638 | -1.25e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9262 | 0.9263 | 0.9258 | -1.05e-4 | 0.7588 | 0.7589 | 0.7580 | -7.11e-5 | 0.6021 | 0.6033 | 0.6026 | -1.15e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9146 | 0.9151 | 0.9140 | -5.29e-4 | 0.7325 | 0.7350 | 0.7316 | -2.55e-3 | 0.5605 | 0.5631 | 0.5600 | -2.61e-3 |
| nikon-z-mc-105f28-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9768 | 0.9771 | 0.9766 | -3.18e-4 | 0.9274 | 0.9283 | 0.9268 | -8.84e-4 | 0.8759 | 0.8769 | 0.8748 | -1.05e-3 |
| nikon-z-mc-105f28-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9768 | 0.9771 | 0.9766 | -3.18e-4 | 0.9274 | 0.9283 | 0.9268 | -8.84e-4 | 0.8759 | 0.8769 | 0.8748 | -1.05e-3 |
| nikon-z-mc-105f28-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9754 | 0.9752 | 0.9747 | 2.01e-4 | 0.9143 | 0.9136 | 0.9122 | 7.45e-4 | 0.8424 | 0.8408 | 0.8387 | 1.51e-3 |
| nikon-z-mc-105f28-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9661 | 0.9660 | 0.9656 | 6.54e-5 | 0.8802 | 0.8799 | 0.8787 | 2.90e-4 | 0.7898 | 0.7902 | 0.7886 | -4.25e-4 |
| nikon-z-mc-105f28-best-ref | 1 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.8898 | 0.8890 | 0.8915 | 7.38e-4 | 0.5641 | 0.5594 | 0.5689 | 4.66e-3 | 0.4442 | 0.4382 | 0.4462 | 5.99e-3 |
| nikon-z-mc-105f28-best-ref | 1 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.8894 | 0.8877 | 0.8908 | 1.71e-3 | 0.5420 | 0.5377 | 0.5482 | 4.23e-3 | 0.2922 | 0.2881 | 0.2951 | 4.08e-3 |
| nikon-z-mc-105f28-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9402 | 0.9400 | 0.9398 | 2.33e-4 | 0.8203 | 0.8196 | 0.8190 | 6.52e-4 | 0.7007 | 0.7012 | 0.7007 | -4.78e-4 |
| nikon-z-mc-105f28-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9402 | 0.9400 | 0.9398 | 2.33e-4 | 0.8203 | 0.8196 | 0.8190 | 6.52e-4 | 0.7007 | 0.7012 | 0.7007 | -4.78e-4 |
| nikon-z-mc-105f28-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.47e-4 | 0.8209 | 0.8202 | 0.8196 | 7.30e-4 | 0.7011 | 0.7015 | 0.7010 | -3.47e-4 |
| nikon-z-mc-105f28-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9406 | 0.9403 | 0.9402 | 2.54e-4 | 0.8214 | 0.8207 | 0.8201 | 7.12e-4 | 0.7024 | 0.7027 | 0.7023 | -3.83e-4 |
| nikon-z-mc-105f28-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9365 | 0.9364 | 0.9361 | 1.41e-4 | 0.7987 | 0.7986 | 0.7980 | 1.39e-4 | 0.6642 | 0.6656 | 0.6650 | -1.39e-3 |
| nikon-z-mc-105f28-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9150 | 0.9154 | 0.9149 | -3.35e-4 | 0.6702 | 0.6726 | 0.6706 | -2.45e-3 | 0.4480 | 0.4532 | 0.4507 | -5.21e-3 |
| nikon-z-mc-105f28-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.42e-4 | 0.8214 | 0.8207 | 0.8202 | 7.07e-4 | 0.7025 | 0.7028 | 0.7023 | -3.83e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9405 | 0.9402 | 0.9400 | 2.42e-4 | 0.8214 | 0.8207 | 0.8202 | 7.07e-4 | 0.7025 | 0.7028 | 0.7023 | -3.83e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9399 | 0.9396 | 0.9394 | 2.47e-4 | 0.8169 | 0.8162 | 0.8156 | 7.08e-4 | 0.6932 | 0.6936 | 0.6931 | -4.23e-4 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9407 | 0.9405 | 0.9403 | 2.57e-4 | 0.8222 | 0.8215 | 0.8210 | 7.37e-4 | 0.7038 | 0.7041 | 0.7036 | -3.36e-4 |
| nikon-z-mc-105f28-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9382 | 0.9381 | 0.9379 | 1.74e-4 | 0.8088 | 0.8084 | 0.8078 | 3.47e-4 | 0.6817 | 0.6827 | 0.6822 | -9.95e-4 |
| nikon-z-mc-105f28-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9089 | 0.9094 | 0.9088 | -4.59e-4 | 0.6372 | 0.6402 | 0.6380 | -3.00e-3 | 0.3989 | 0.4046 | 0.4018 | -5.70e-3 |
| nikon-z-135f18-plena-best-ref | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9797 | 0.9807 | 0.9792 | -9.90e-4 | 0.9145 | 0.9183 | 0.9135 | -3.88e-3 | 0.8300 | 0.8347 | 0.8279 | -4.77e-3 |
| nikon-z-135f18-plena-best-ref | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9797 | 0.9807 | 0.9792 | -9.90e-4 | 0.9145 | 0.9183 | 0.9135 | -3.88e-3 | 0.8300 | 0.8347 | 0.8279 | -4.77e-3 |
| nikon-z-135f18-plena-best-ref | 0.5 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.9764 | 0.9783 | 0.9760 | -1.85e-3 | 0.8984 | 0.9063 | 0.8977 | -7.92e-3 | 0.8104 | 0.8222 | 0.8099 | -1.17e-2 |
| nikon-z-135f18-plena-best-ref | 0.5 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9786 | 0.9803 | 0.9783 | -1.72e-3 | 0.9185 | 0.9246 | 0.9178 | -6.08e-3 | 0.8557 | 0.8633 | 0.8546 | -7.66e-3 |
| nikon-z-135f18-plena-best-ref | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | ATTENTION | ATTENTION | 0.9513 | 0.9569 | 0.9513 | -5.59e-3 | 0.7347 | 0.7587 | 0.7357 | -2.40e-2 | 0.5062 | 0.5301 | 0.5074 | -2.39e-2 |
| nikon-z-135f18-plena-best-ref | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8806 | 0.8869 | 0.8819 | -6.37e-3 | 0.5472 | 0.5525 | 0.5478 | -5.23e-3 | 0.4152 | 0.4116 | 0.4148 | 3.55e-3 |
| nikon-z-135f18-plena-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.14e-4 | 0.8214 | 0.8207 | 0.8201 | 6.51e-4 | 0.7025 | 0.7029 | 0.7023 | -4.52e-4 |
| nikon-z-135f18-plena-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.14e-4 | 0.8214 | 0.8207 | 0.8201 | 6.51e-4 | 0.7025 | 0.7029 | 0.7023 | -4.52e-4 |
| nikon-z-135f18-plena-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9391 | 0.9388 | 0.9386 | 2.02e-4 | 0.8135 | 0.8129 | 0.8122 | 5.50e-4 | 0.6876 | 0.6883 | 0.6876 | -6.96e-4 |
| nikon-z-135f18-plena-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9390 | 0.9388 | 0.9385 | 2.09e-4 | 0.8152 | 0.8146 | 0.8139 | 5.97e-4 | 0.6913 | 0.6919 | 0.6912 | -6.35e-4 |
| nikon-z-135f18-plena-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9344 | 0.9342 | 0.9339 | 1.55e-4 | 0.7864 | 0.7863 | 0.7854 | 1.50e-4 | 0.6381 | 0.6397 | 0.6387 | -1.54e-3 |
| nikon-z-135f18-plena-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9349 | 0.9347 | 0.9344 | 2.05e-4 | 0.7970 | 0.7967 | 0.7958 | 3.67e-4 | 0.6597 | 0.6608 | 0.6600 | -1.10e-3 |
| nikon-z-135f18-plena-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.14e-4 | 0.8214 | 0.8208 | 0.8201 | 6.53e-4 | 0.7025 | 0.7030 | 0.7024 | -4.48e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9404 | 0.9402 | 0.9400 | 2.14e-4 | 0.8214 | 0.8208 | 0.8201 | 6.53e-4 | 0.7025 | 0.7030 | 0.7024 | -4.48e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9389 | 0.9387 | 0.9384 | 1.99e-4 | 0.8122 | 0.8117 | 0.8110 | 5.30e-4 | 0.6852 | 0.6860 | 0.6853 | -7.39e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9388 | 0.9386 | 0.9384 | 2.08e-4 | 0.8143 | 0.8137 | 0.8130 | 5.84e-4 | 0.6895 | 0.6902 | 0.6895 | -6.64e-4 |
| nikon-z-135f18-plena-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9340 | 0.9338 | 0.9335 | 1.48e-4 | 0.7838 | 0.7837 | 0.7828 | 1.03e-4 | 0.6334 | 0.6350 | 0.6340 | -1.63e-3 |
| nikon-z-135f18-plena-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9346 | 0.9344 | 0.9341 | 2.01e-4 | 0.7951 | 0.7948 | 0.7939 | 3.30e-4 | 0.6563 | 0.6574 | 0.6566 | -1.17e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | sagittal | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9450 | 0.9457 | 0.9447 | -7.05e-4 | 0.8070 | 0.8107 | 0.8051 | -3.68e-3 | 0.7155 | 0.7198 | 0.7128 | -4.31e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | tangential | ok | ok | unconverged | method: two-methods | RECORDED | RECORDED | 0.9450 | 0.9457 | 0.9447 | -7.05e-4 | 0.8070 | 0.8107 | 0.8051 | -3.68e-3 | 0.7155 | 0.7198 | 0.7128 | -4.31e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9495 | 0.9502 | 0.9502 | -7.29e-4 | 0.7924 | 0.7958 | 0.7935 | -3.36e-3 | 0.6400 | 0.6435 | 0.6401 | -3.48e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9386 | 0.9384 | 0.9392 | 2.14e-4 | 0.7034 | 0.7024 | 0.7043 | 9.42e-4 | 0.4081 | 0.4034 | 0.4073 | 4.62e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | sagittal | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.7513 | — | 0.7512 | — | 0.3608 | — | 0.3606 | — | 0.2988 | — | 0.2990 | — |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | tangential | ok | no curve | unconverged | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8198 | — | 0.8202 | — | 0.3471 | — | 0.3479 | — | 0.1197 | — | 0.1196 | — |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9391 | 0.9388 | 0.9388 | 3.41e-4 | 0.8130 | 0.8123 | 0.8121 | 7.23e-4 | 0.6887 | 0.6893 | 0.6891 | -5.66e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9391 | 0.9388 | 0.9388 | 3.41e-4 | 0.8130 | 0.8123 | 0.8121 | 7.23e-4 | 0.6887 | 0.6893 | 0.6891 | -5.66e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9288 | 0.9285 | 0.9285 | 2.63e-4 | 0.7528 | 0.7529 | 0.7522 | -7.67e-5 | 0.5789 | 0.5812 | 0.5801 | -2.33e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9293 | 0.9290 | 0.9290 | 3.69e-4 | 0.7721 | 0.7718 | 0.7713 | 3.02e-4 | 0.6210 | 0.6222 | 0.6219 | -1.23e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9329 | 0.9330 | 0.9329 | -1.37e-4 | 0.7885 | 0.7891 | 0.7888 | -5.76e-4 | 0.6462 | 0.6475 | 0.6465 | -1.24e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8549 | 0.8540 | 0.8548 | 8.38e-4 | 0.5432 | 0.5423 | 0.5431 | 9.15e-4 | 0.3290 | 0.3286 | 0.3292 | 3.61e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9407 | 0.9403 | 0.9403 | 3.74e-4 | 0.8218 | 0.8208 | 0.8207 | 9.96e-4 | 0.7028 | 0.7028 | 0.7029 | -7.69e-6 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9407 | 0.9403 | 0.9403 | 3.74e-4 | 0.8218 | 0.8208 | 0.8207 | 9.96e-4 | 0.7028 | 0.7028 | 0.7029 | -7.76e-6 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9352 | 0.9349 | 0.9349 | 3.38e-4 | 0.7927 | 0.7921 | 0.7917 | 6.04e-4 | 0.6497 | 0.6507 | 0.6504 | -1.01e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9220 | 0.9217 | 0.9217 | 3.11e-4 | 0.7298 | 0.7301 | 0.7296 | -2.77e-4 | 0.5508 | 0.5530 | 0.5524 | -2.18e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9338 | 0.9339 | 0.9338 | -1.35e-4 | 0.7965 | 0.7970 | 0.7967 | -5.28e-4 | 0.6630 | 0.6641 | 0.6633 | -1.10e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8474 | 0.8465 | 0.8473 | 9.14e-4 | 0.5167 | 0.5157 | 0.5165 | 1.01e-3 | 0.3062 | 0.3061 | 0.3065 | 1.04e-4 |

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
| lv – optiland | chiefLanding.maxAbs [mm] | 1.52e-10 | 288 of 288 | nikon-z-mc-105f28-best-ref | field 1 |
| lv – optiland | mtfOnAxis.maxAbs | 8.84e-3 | 96 of 288 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| lv – optiland | fields.compared [elements] | 284 | 288 of 288 | — | — |
| lv – optiland | fields.flagged [elements] | 4 | 288 of 288 | — | — |
| lv – optiland | fields.rimLost [elements] | 0 | 288 of 288 | — | — |
| lv – optiland | fields.data [elements] | 0 | 288 of 288 | — | — |
| lv – optiland | fields.unavailable [elements] | 0 | 288 of 288 | — | — |
| lv – optiland | mtfOffAxis.maxAbs | 1.22e-2 | 188 of 288 | sony-fe-400mm-f28-gm-oss-best-ref | cut sagittal, field 1, frequencyPerMm 100 |
| lv – optiland | mtfFlagged.maxAbs | 8.99e-3 | 4 of 288 | sigma-35mm-f14-dg-hsm-a-best-photopic | cut tangential, field 1, frequencyPerMm 100 |
| lv – optiland | mtfOnAxis.firstStepMaxAbs | 9.00e-3 | 5 of 288 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| lv – optiland | mtfOffAxis.firstStepMaxAbs | 1.19e-2 | 1 of 288 | sony-fe-400mm-f28-gm-oss-best-ref | cut sagittal, field 1, frequencyPerMm 100 |
| lv – replay | chiefLanding.maxAbs [mm] | 0 | 288 of 288 | canon-ef-135-f2l-usm-ref | field 0 |
| lv – replay | mtfOnAxis.maxAbs | 4.88e-15 | 96 of 288 | sony-fe-20mm-f18-g-ref | cut tangential, field 0, frequencyPerMm 10 |
| lv – replay | fields.compared [elements] | 286 | 288 of 288 | — | — |
| lv – replay | fields.flagged [elements] | 2 | 288 of 288 | — | — |
| lv – replay | fields.rimLost [elements] | 0 | 288 of 288 | — | — |
| lv – replay | fields.data [elements] | 0 | 288 of 288 | — | — |
| lv – replay | fields.unavailable [elements] | 0 | 288 of 288 | — | — |
| lv – replay | mtfOffAxis.maxAbs | 6.99e-15 | 190 of 288 | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | cut sagittal, field 1, frequencyPerMm 30 |
| lv – replay | mtfFlagged.maxAbs | 5.33e-15 | 2 of 288 | sigma-35mm-f14-dg-hsm-a-best-ref | cut tangential, field 1, frequencyPerMm 10 |
| optiland – replay | chiefLanding.maxAbs [mm] | 1.52e-10 | 288 of 288 | nikon-z-mc-105f28-best-ref | field 1 |
| optiland – replay | mtfOnAxis.maxAbs | 8.84e-3 | 96 of 288 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| optiland – replay | fields.compared [elements] | 284 | 288 of 288 | — | — |
| optiland – replay | fields.flagged [elements] | 4 | 288 of 288 | — | — |
| optiland – replay | fields.rimLost [elements] | 0 | 288 of 288 | — | — |
| optiland – replay | fields.data [elements] | 0 | 288 of 288 | — | — |
| optiland – replay | fields.unavailable [elements] | 0 | 288 of 288 | — | — |
| optiland – replay | mtfOffAxis.maxAbs | 1.22e-2 | 188 of 288 | sony-fe-400mm-f28-gm-oss-best-ref | cut sagittal, field 1, frequencyPerMm 100 |
| optiland – replay | mtfFlagged.maxAbs | 8.99e-3 | 4 of 288 | sigma-35mm-f14-dg-hsm-a-best-photopic | cut tangential, field 1, frequencyPerMm 100 |
| optiland – replay | mtfOnAxis.firstStepMaxAbs | 9.00e-3 | 5 of 288 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| optiland – replay | mtfOffAxis.firstStepMaxAbs | 1.19e-2 | 1 of 288 | sony-fe-400mm-f28-gm-oss-best-ref | cut sagittal, field 1, frequencyPerMm 100 |

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

Rows by status: 568 RECORDED, 8 SET ASIDE.

| Run | Field | Cut | lv | optiland | replay | Class | Status | All | lv 10 | optiland 10 | replay 10 | Δ 10 | lv 30 | optiland 30 | replay 30 | Δ 30 | lv 50 | optiland 50 | replay 50 | Δ 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | 9.79e-6 | 0.9891 | 0.9890 | 0.9891 | 8.73e-5 | 0.9700 | 0.9698 | 0.9700 | 2.38e-4 |
| canon-ef-135-f2l-usm-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | 9.79e-6 | 0.9891 | 0.9890 | 0.9891 | 8.73e-5 | 0.9700 | 0.9698 | 0.9700 | 2.38e-4 |
| canon-ef-135-f2l-usm-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9861 | 0.9861 | 0.9861 | -1.20e-5 | 0.8802 | 0.8803 | 0.8802 | -8.27e-5 | 0.6961 | 0.6962 | 0.6961 | -9.58e-5 |
| canon-ef-135-f2l-usm-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9921 | 0.9920 | 0.9921 | 7.33e-5 | 0.9311 | 0.9305 | 0.9311 | 6.27e-4 | 0.8206 | 0.8191 | 0.8206 | 1.58e-3 |
| canon-ef-135-f2l-usm-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9518 | 0.9516 | 0.9518 | 2.29e-4 | 0.6727 | 0.6719 | 0.6727 | 7.34e-4 | 0.3998 | 0.3988 | 0.3998 | 9.15e-4 |
| canon-ef-135-f2l-usm-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9748 | 0.9748 | 0.9748 | -7.51e-5 | 0.7883 | 0.7889 | 0.7883 | -5.86e-4 | 0.4893 | 0.4905 | 0.4893 | -1.22e-3 |
| canon-ef-135-f2l-usm-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9604 | 0.9606 | 0.9604 | -2.13e-4 | 0.7045 | 0.7057 | 0.7045 | -1.17e-3 | 0.3974 | 0.3986 | 0.3974 | -1.15e-3 |
| canon-ef-135-f2l-usm-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9604 | 0.9606 | 0.9604 | -2.13e-4 | 0.7045 | 0.7057 | 0.7045 | -1.17e-3 | 0.3974 | 0.3986 | 0.3974 | -1.15e-3 |
| canon-ef-135-f2l-usm-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9373 | 0.9373 | 0.9373 | 2.63e-5 | 0.5445 | 0.5442 | 0.5445 | 3.21e-4 | 0.1519 | 0.1513 | 0.1519 | 5.77e-4 |
| canon-ef-135-f2l-usm-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9526 | 0.9525 | 0.9526 | 7.52e-5 | 0.6536 | 0.6534 | 0.6536 | 2.78e-4 | 0.3235 | 0.3234 | 0.3235 | 5.96e-5 |
| canon-ef-135-f2l-usm-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9453 | 0.9456 | 0.9453 | -2.97e-4 | 0.6442 | 0.6440 | 0.6442 | 1.24e-4 | 0.3368 | 0.3349 | 0.3368 | 1.95e-3 |
| canon-ef-135-f2l-usm-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9659 | 0.9661 | 0.9659 | -1.69e-4 | 0.7231 | 0.7243 | 0.7231 | -1.18e-3 | 0.3702 | 0.3720 | 0.3702 | -1.88e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9678 | 0.9677 | 0.9678 | 1.16e-4 | 0.7395 | 0.7385 | 0.7395 | 9.26e-4 | 0.4151 | 0.4131 | 0.4151 | 2.02e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9678 | 0.9677 | 0.9678 | 1.16e-4 | 0.7395 | 0.7385 | 0.7395 | 9.26e-4 | 0.4151 | 0.4131 | 0.4151 | 2.02e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8927 | 0.8934 | 0.8927 | -6.43e-4 | 0.3236 | 0.3244 | 0.3236 | -8.90e-4 | 0.1147 | 0.1147 | 0.1147 | -9.05e-6 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8726 | 0.8739 | 0.8726 | -1.24e-3 | 0.6041 | 0.6046 | 0.6041 | -5.23e-4 | 0.4263 | 0.4264 | 0.4263 | -9.96e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6724 | 0.6728 | 0.6724 | -3.96e-4 | 0.4704 | 0.4715 | 0.4704 | -1.11e-3 | 0.3572 | 0.3578 | 0.3572 | -5.77e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9296 | 0.9299 | 0.9296 | -2.29e-4 | 0.6835 | 0.6839 | 0.6835 | -3.78e-4 | 0.4598 | 0.4603 | 0.4598 | -4.84e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9663 | 0.9663 | 0.9663 | 7.12e-5 | 0.7324 | 0.7317 | 0.7324 | 6.15e-4 | 0.4177 | 0.4163 | 0.4177 | 1.46e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9663 | 0.9663 | 0.9663 | 7.12e-5 | 0.7324 | 0.7317 | 0.7324 | 6.15e-4 | 0.4177 | 0.4163 | 0.4177 | 1.46e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8914 | 0.8925 | 0.8914 | -1.06e-3 | 0.3328 | 0.3341 | 0.3328 | -1.37e-3 | 0.0807 | 0.0799 | 0.0807 | 7.95e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8677 | 0.8695 | 0.8677 | -1.84e-3 | 0.5489 | 0.5486 | 0.5489 | 2.55e-4 | 0.3451 | 0.3460 | 0.3451 | -9.18e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6701 | 0.6704 | 0.6701 | -2.99e-4 | 0.4644 | 0.4653 | 0.4644 | -9.44e-4 | 0.3477 | 0.3478 | 0.3477 | -1.04e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8652 | 0.8655 | 0.8652 | -3.18e-4 | 0.4498 | 0.4497 | 0.4498 | 9.59e-5 | 0.1587 | 0.1594 | 0.1587 | -6.79e-4 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | 3.54e-6 | 0.9834 | 0.9834 | 0.9834 | 3.11e-5 | 0.9544 | 0.9543 | 0.9544 | 8.28e-5 |
| sigma-35mm-f14-dg-hsm-a-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | 3.54e-6 | 0.9834 | 0.9834 | 0.9834 | 3.11e-5 | 0.9544 | 0.9543 | 0.9544 | 8.28e-5 |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9317 | 0.9325 | 0.9317 | -7.96e-4 | 0.6303 | 0.6317 | 0.6303 | -1.45e-3 | 0.3136 | 0.3151 | 0.3136 | -1.49e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9688 | 0.9684 | 0.9688 | 4.19e-4 | 0.7868 | 0.7860 | 0.7868 | 7.65e-4 | 0.6113 | 0.6127 | 0.6113 | -1.42e-3 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | sagittal | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.5156 | 0.5155 | 0.5156 | 5.72e-5 | 0.3755 | 0.3764 | 0.3755 | -9.03e-4 | 0.3284 | 0.3285 | 0.3284 | -1.35e-4 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | tangential | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.6933 | 0.6957 | 0.6933 | -2.34e-3 | 0.5305 | 0.5286 | 0.5305 | 1.93e-3 | 0.4313 | 0.4304 | 0.4313 | 8.57e-4 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9488 | 0.9491 | 0.9488 | -2.75e-4 | 0.6341 | 0.6355 | 0.6341 | -1.35e-3 | 0.3267 | 0.3277 | 0.3267 | -9.56e-4 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9488 | 0.9491 | 0.9488 | -2.75e-4 | 0.6341 | 0.6355 | 0.6341 | -1.35e-3 | 0.3267 | 0.3277 | 0.3267 | -9.56e-4 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8925 | 0.8929 | 0.8925 | -3.55e-4 | 0.4597 | 0.4610 | 0.4597 | -1.33e-3 | 0.1029 | 0.1024 | 0.1029 | 4.54e-4 |
| sigma-35mm-f14-dg-hsm-a-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9370 | 0.9366 | 0.9370 | 4.13e-4 | 0.6597 | 0.6609 | 0.6597 | -1.24e-3 | 0.4488 | 0.4502 | 0.4488 | -1.34e-3 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | sagittal | ok | unconverged | ok | numerical: unconverged | SET ASIDE | RECORDED | 0.5111 | 0.5112 | 0.5111 | -1.69e-4 | 0.3679 | 0.3675 | 0.3679 | 3.82e-4 | 0.3198 | 0.3196 | 0.3198 | 1.52e-4 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | tangential | ok | unconverged | ok | numerical: unconverged | SET ASIDE | RECORDED | 0.6648 | 0.6639 | 0.6648 | 8.85e-4 | 0.3989 | 0.3986 | 0.3989 | 2.50e-4 | 0.2345 | 0.2347 | 0.2345 | -1.31e-4 |
| nikkor-z50f12-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8233 | 0.8244 | 0.8233 | -1.06e-3 | 0.1693 | 0.1704 | 0.1693 | -1.12e-3 | 0.1996 | 0.1980 | 0.1996 | 1.60e-3 |
| nikkor-z50f12-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8233 | 0.8244 | 0.8233 | -1.06e-3 | 0.1693 | 0.1704 | 0.1693 | -1.12e-3 | 0.1996 | 0.1980 | 0.1996 | 1.60e-3 |
| nikkor-z50f12-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8790 | 0.8779 | 0.8790 | 1.12e-3 | 0.2347 | 0.2328 | 0.2347 | 1.91e-3 | 0.1874 | 0.1879 | 0.1874 | -4.98e-4 |
| nikkor-z50f12-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8020 | 0.8002 | 0.8020 | 1.83e-3 | 0.4032 | 0.4032 | 0.4032 | -4.64e-5 | 0.2987 | 0.3002 | 0.2987 | -1.50e-3 |
| nikkor-z50f12-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8161 | 0.8163 | 0.8161 | -1.41e-4 | 0.1532 | 0.1529 | 0.1532 | 2.89e-4 | 0.1469 | 0.1472 | 0.1469 | -2.21e-4 |
| nikkor-z50f12-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8663 | 0.8666 | 0.8663 | -3.82e-4 | 0.5456 | 0.5459 | 0.5456 | -3.15e-4 | 0.3269 | 0.3269 | 0.3269 | -7.44e-5 |
| nikkor-z50f12-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7918 | 0.7930 | 0.7918 | -1.15e-3 | 0.1275 | 0.1277 | 0.1275 | -1.61e-4 | 0.1484 | 0.1478 | 0.1484 | 5.60e-4 |
| nikkor-z50f12-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7918 | 0.7930 | 0.7918 | -1.15e-3 | 0.1275 | 0.1277 | 0.1275 | -1.61e-4 | 0.1484 | 0.1478 | 0.1484 | 5.60e-4 |
| nikkor-z50f12-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8515 | 0.8513 | 0.8515 | 2.12e-4 | 0.1268 | 0.1260 | 0.1268 | 8.28e-4 | 0.1706 | 0.1713 | 0.1706 | -7.12e-4 |
| nikkor-z50f12-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7664 | 0.7666 | 0.7664 | -2.26e-4 | 0.3382 | 0.3391 | 0.3382 | -9.00e-4 | 0.1840 | 0.1858 | 0.1840 | -1.72e-3 |
| nikkor-z50f12-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8047 | 0.8049 | 0.8047 | -1.88e-4 | 0.1077 | 0.1064 | 0.1077 | 1.26e-3 | 0.1447 | 0.1461 | 0.1447 | -1.38e-3 |
| nikkor-z50f12-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8314 | 0.8318 | 0.8314 | -4.02e-4 | 0.4557 | 0.4553 | 0.4557 | 3.84e-4 | 0.2632 | 0.2628 | 0.2632 | 4.31e-4 |
| sony-fe-20mm-f18-g-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9322 | 0.9335 | 0.9322 | -1.23e-3 | 0.5999 | 0.6031 | 0.5999 | -3.24e-3 | 0.4382 | 0.4374 | 0.4382 | 7.73e-4 |
| sony-fe-20mm-f18-g-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9322 | 0.9335 | 0.9322 | -1.23e-3 | 0.5999 | 0.6031 | 0.5999 | -3.24e-3 | 0.4382 | 0.4374 | 0.4382 | 7.73e-4 |
| sony-fe-20mm-f18-g-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6945 | 0.6960 | 0.6945 | -1.48e-3 | 0.0144 | 0.0139 | 0.0144 | 4.80e-4 | 0.0019 | 0.0016 | 0.0019 | 3.19e-4 |
| sony-fe-20mm-f18-g-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.4871 | 0.4881 | 0.4871 | -9.63e-4 | 0.1283 | 0.1285 | 0.1283 | -1.71e-4 | 0.0906 | 0.0915 | 0.0906 | -8.20e-4 |
| sony-fe-20mm-f18-g-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.3111 | 0.3117 | 0.3111 | -5.58e-4 | 0.1140 | 0.1153 | 0.1140 | -1.34e-3 | 0.0513 | 0.0526 | 0.0513 | -1.34e-3 |
| sony-fe-20mm-f18-g-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.1521 | 0.1522 | 0.1521 | -6.26e-5 | 0.0834 | 0.0848 | 0.0834 | -1.45e-3 | 0.0756 | 0.0734 | 0.0756 | 2.22e-3 |
| sony-fe-20mm-f18-g-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9230 | 0.9243 | 0.9230 | -1.34e-3 | 0.5620 | 0.5648 | 0.5620 | -2.81e-3 | 0.3872 | 0.3864 | 0.3872 | 7.32e-4 |
| sony-fe-20mm-f18-g-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9230 | 0.9243 | 0.9230 | -1.34e-3 | 0.5620 | 0.5648 | 0.5620 | -2.81e-3 | 0.3872 | 0.3864 | 0.3872 | 7.32e-4 |
| sony-fe-20mm-f18-g-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6753 | 0.6777 | 0.6753 | -2.40e-3 | 0.0071 | 0.0062 | 0.0071 | 9.57e-4 | 0.0205 | 0.0189 | 0.0205 | 1.58e-3 |
| sony-fe-20mm-f18-g-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.4715 | 0.4726 | 0.4715 | -1.07e-3 | 0.1090 | 0.1103 | 0.1090 | -1.33e-3 | 0.0911 | 0.0913 | 0.0911 | -2.16e-4 |
| sony-fe-20mm-f18-g-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.3018 | 0.3028 | 0.3018 | -1.05e-3 | 0.1169 | 0.1171 | 0.1169 | -1.83e-4 | 0.0676 | 0.0674 | 0.0676 | 1.84e-4 |
| sony-fe-20mm-f18-g-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.1489 | 0.1487 | 0.1489 | 2.31e-4 | 0.0646 | 0.0642 | 0.0646 | 4.41e-4 | 0.0385 | 0.0383 | 0.0385 | 1.65e-4 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9509 | 0.9511 | 0.9509 | -1.76e-4 | 0.6159 | 0.6171 | 0.6159 | -1.15e-3 | 0.1910 | 0.1925 | 0.1910 | -1.46e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9509 | 0.9511 | 0.9509 | -1.76e-4 | 0.6159 | 0.6171 | 0.6159 | -1.15e-3 | 0.1910 | 0.1925 | 0.1910 | -1.46e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9450 | 0.9453 | 0.9450 | -2.75e-4 | 0.5836 | 0.5854 | 0.5836 | -1.79e-3 | 0.1747 | 0.1770 | 0.1747 | -2.32e-3 |
| sony-fe-400mm-f28-gm-oss-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9537 | 0.9538 | 0.9537 | -5.31e-5 | 0.6401 | 0.6405 | 0.6401 | -3.74e-4 | 0.2679 | 0.2683 | 0.2679 | -3.99e-4 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9541 | 0.9541 | 0.9541 | -5.25e-5 | 0.6502 | 0.6506 | 0.6502 | -3.74e-4 | 0.2980 | 0.2987 | 0.2980 | -6.43e-4 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9890 | 0.9890 | 0.9890 | 2.90e-5 | 0.9044 | 0.9042 | 0.9044 | 2.41e-4 | 0.7511 | 0.7505 | 0.7511 | 5.67e-4 |
| sony-fe-400mm-f28-gm-oss-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9604 | 0.9605 | 0.9604 | -1.47e-4 | 0.6873 | 0.6883 | 0.6873 | -1.00e-3 | 0.3270 | 0.3285 | 0.3270 | -1.47e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9604 | 0.9605 | 0.9604 | -1.47e-4 | 0.6873 | 0.6883 | 0.6873 | -1.00e-3 | 0.3270 | 0.3285 | 0.3270 | -1.47e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9568 | 0.9570 | 0.9568 | -1.63e-4 | 0.6705 | 0.6715 | 0.6705 | -1.04e-3 | 0.3291 | 0.3304 | 0.3291 | -1.27e-3 |
| sony-fe-400mm-f28-gm-oss-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9626 | 0.9627 | 0.9626 | -6.40e-5 | 0.7068 | 0.7072 | 0.7068 | -3.97e-4 | 0.3746 | 0.3751 | 0.3746 | -4.51e-4 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9648 | 0.9646 | 0.9648 | 1.40e-4 | 0.7310 | 0.7302 | 0.7310 | 7.99e-4 | 0.4513 | 0.4507 | 0.4513 | 6.07e-4 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9858 | 0.9858 | 0.9858 | 2.04e-5 | 0.8796 | 0.8794 | 0.8796 | 1.66e-4 | 0.7003 | 0.6999 | 0.7003 | 3.85e-4 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9925 | 0.9927 | 0.9925 | -2.46e-4 | 0.9373 | 0.9392 | 0.9373 | -1.87e-3 | 0.8507 | 0.8544 | 0.8507 | -3.66e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9925 | 0.9927 | 0.9925 | -2.46e-4 | 0.9373 | 0.9392 | 0.9373 | -1.87e-3 | 0.8507 | 0.8544 | 0.8507 | -3.66e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9631 | 0.9634 | 0.9631 | -3.06e-4 | 0.7164 | 0.7181 | 0.7164 | -1.74e-3 | 0.4064 | 0.4077 | 0.4064 | -1.31e-3 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9136 | 0.9138 | 0.9136 | -2.00e-4 | 0.4429 | 0.4437 | 0.4429 | -8.32e-4 | 0.1697 | 0.1700 | 0.1697 | -2.33e-4 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9736 | 0.9736 | 0.9736 | 5.31e-5 | 0.7937 | 0.7933 | 0.7937 | 3.25e-4 | 0.5509 | 0.5505 | 0.5509 | 4.27e-4 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9376 | 0.9383 | 0.9376 | -6.78e-4 | 0.5885 | 0.5907 | 0.5885 | -2.20e-3 | 0.3913 | 0.3912 | 0.3913 | 9.64e-5 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9884 | 0.9881 | -3.25e-4 | 0.9051 | 0.9073 | 0.9051 | -2.23e-3 | 0.7891 | 0.7926 | 0.7891 | -3.53e-3 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9884 | 0.9881 | -3.25e-4 | 0.9051 | 0.9073 | 0.9051 | -2.23e-3 | 0.7891 | 0.7926 | 0.7891 | -3.53e-3 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9582 | 0.9586 | 0.9582 | -3.90e-4 | 0.6884 | 0.6904 | 0.6884 | -1.98e-3 | 0.3719 | 0.3728 | 0.3719 | -9.59e-4 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9065 | 0.9069 | 0.9065 | -3.84e-4 | 0.4208 | 0.4218 | 0.4208 | -9.86e-4 | 0.1491 | 0.1493 | 0.1491 | -2.06e-4 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9726 | 0.9726 | 0.9726 | 6.49e-6 | 0.7899 | 0.7900 | 0.7899 | -2.77e-5 | 0.5571 | 0.5574 | 0.5571 | -2.67e-4 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9326 | 0.9333 | 0.9326 | -6.90e-4 | 0.5618 | 0.5639 | 0.5618 | -2.08e-3 | 0.3554 | 0.3553 | 0.3554 | 5.04e-5 |
| nikon-z-24-70f4s-wide-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9447 | 0.9453 | 0.9447 | -6.02e-4 | 0.6130 | 0.6158 | 0.6130 | -2.88e-3 | 0.3299 | 0.3311 | 0.3299 | -1.22e-3 |
| nikon-z-24-70f4s-wide-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9447 | 0.9453 | 0.9447 | -6.02e-4 | 0.6130 | 0.6158 | 0.6130 | -2.88e-3 | 0.3299 | 0.3311 | 0.3299 | -1.22e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9538 | 0.9541 | 0.9538 | -3.32e-4 | 0.6712 | 0.6729 | 0.6712 | -1.75e-3 | 0.4039 | 0.4052 | 0.4039 | -1.36e-3 |
| nikon-z-24-70f4s-wide-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9765 | 0.9769 | 0.9765 | -4.00e-4 | 0.8168 | 0.8193 | 0.8168 | -2.54e-3 | 0.6152 | 0.6184 | 0.6152 | -3.23e-3 |
| nikon-z-24-70f4s-wide-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8077 | 0.8079 | 0.8077 | -1.89e-4 | 0.1085 | 0.1079 | 0.1085 | 5.55e-4 | 0.2884 | 0.2883 | 0.2884 | 1.09e-4 |
| nikon-z-24-70f4s-wide-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6692 | 0.6696 | 0.6692 | -4.58e-4 | 0.3071 | 0.3079 | 0.3071 | -7.63e-4 | 0.2006 | 0.2006 | 0.2006 | -4.55e-5 |
| nikon-z-24-70f4s-wide-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9533 | 0.9538 | 0.9533 | -5.16e-4 | 0.6636 | 0.6663 | 0.6636 | -2.68e-3 | 0.3855 | 0.3873 | 0.3855 | -1.81e-3 |
| nikon-z-24-70f4s-wide-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9533 | 0.9538 | 0.9533 | -5.16e-4 | 0.6636 | 0.6663 | 0.6636 | -2.68e-3 | 0.3855 | 0.3873 | 0.3855 | -1.81e-3 |
| nikon-z-24-70f4s-wide-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9592 | 0.9595 | 0.9592 | -2.84e-4 | 0.7084 | 0.7099 | 0.7084 | -1.51e-3 | 0.4667 | 0.4680 | 0.4667 | -1.30e-3 |
| nikon-z-24-70f4s-wide-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9727 | 0.9730 | 0.9727 | -3.33e-4 | 0.7861 | 0.7882 | 0.7861 | -2.06e-3 | 0.5465 | 0.5489 | 0.5465 | -2.35e-3 |
| nikon-z-24-70f4s-wide-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8333 | 0.8334 | 0.8333 | -1.44e-4 | 0.0084 | 0.0080 | 0.0084 | 3.98e-4 | 0.3053 | 0.3051 | 0.3053 | 1.64e-4 |
| nikon-z-24-70f4s-wide-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6446 | 0.6453 | 0.6446 | -6.95e-4 | 0.2098 | 0.2097 | 0.2098 | 5.76e-5 | 0.1034 | 0.1050 | 0.1034 | -1.60e-3 |
| nikon-z-24-70f4s-tele-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9964 | 0.9966 | 0.9964 | -1.73e-4 | 0.9686 | 0.9700 | 0.9686 | -1.40e-3 | 0.9183 | 0.9215 | 0.9183 | -3.14e-3 |
| nikon-z-24-70f4s-tele-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9964 | 0.9966 | 0.9964 | -1.73e-4 | 0.9686 | 0.9700 | 0.9686 | -1.40e-3 | 0.9183 | 0.9215 | 0.9183 | -3.14e-3 |
| nikon-z-24-70f4s-tele-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9263 | 0.9282 | 0.9263 | -1.91e-3 | 0.6570 | 0.6571 | 0.6570 | -1.18e-4 | 0.5182 | 0.5211 | 0.5182 | -2.90e-3 |
| nikon-z-24-70f4s-tele-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9679 | 0.9684 | 0.9679 | -4.87e-4 | 0.7825 | 0.7839 | 0.7825 | -1.43e-3 | 0.5759 | 0.5764 | 0.5759 | -4.13e-4 |
| nikon-z-24-70f4s-tele-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6308 | 0.6307 | 0.6308 | 9.56e-5 | 0.4516 | 0.4507 | 0.4516 | 9.36e-4 | 0.3669 | 0.3665 | 0.3669 | 4.05e-4 |
| nikon-z-24-70f4s-tele-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9501 | 0.9501 | 0.9501 | -4.46e-5 | 0.6526 | 0.6527 | 0.6526 | -8.66e-5 | 0.3607 | 0.3603 | 0.3607 | 3.49e-4 |
| nikon-z-24-70f4s-tele-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9962 | 0.9964 | 0.9962 | -2.05e-4 | 0.9669 | 0.9686 | 0.9669 | -1.72e-3 | 0.9132 | 0.9174 | 0.9132 | -4.16e-3 |
| nikon-z-24-70f4s-tele-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9962 | 0.9964 | 0.9962 | -2.05e-4 | 0.9669 | 0.9686 | 0.9669 | -1.72e-3 | 0.9132 | 0.9174 | 0.9132 | -4.16e-3 |
| nikon-z-24-70f4s-tele-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9316 | 0.9333 | 0.9316 | -1.70e-3 | 0.6588 | 0.6594 | 0.6588 | -6.29e-4 | 0.5064 | 0.5082 | 0.5064 | -1.77e-3 |
| nikon-z-24-70f4s-tele-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9557 | 0.9559 | 0.9557 | -2.25e-4 | 0.7625 | 0.7631 | 0.7625 | -5.62e-4 | 0.5565 | 0.5568 | 0.5565 | -3.32e-4 |
| nikon-z-24-70f4s-tele-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6466 | 0.6467 | 0.6466 | -2.84e-5 | 0.4663 | 0.4664 | 0.4663 | -1.12e-4 | 0.3886 | 0.3884 | 0.3886 | 1.24e-4 |
| nikon-z-24-70f4s-tele-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9189 | 0.9190 | 0.9189 | -1.19e-4 | 0.5626 | 0.5627 | 0.5626 | -1.05e-4 | 0.2722 | 0.2722 | 0.2722 | 1.97e-5 |
| nikon-z-mc-105f28-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9853 | 0.9852 | 0.9853 | 1.18e-4 | 0.8732 | 0.8722 | 0.8732 | 1.01e-3 | 0.6780 | 0.6755 | 0.6780 | 2.50e-3 |
| nikon-z-mc-105f28-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9853 | 0.9852 | 0.9853 | 1.18e-4 | 0.8732 | 0.8722 | 0.8732 | 1.01e-3 | 0.6780 | 0.6755 | 0.6780 | 2.50e-3 |
| nikon-z-mc-105f28-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9863 | 0.9864 | 0.9863 | -1.14e-4 | 0.8846 | 0.8856 | 0.8846 | -9.96e-4 | 0.7185 | 0.7211 | 0.7185 | -2.59e-3 |
| nikon-z-mc-105f28-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9970 | 0.9968 | 0.9970 | 1.43e-4 | 0.9729 | 0.9717 | 0.9729 | 1.20e-3 | 0.9260 | 0.9231 | 0.9260 | 2.88e-3 |
| nikon-z-mc-105f28-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8490 | 0.8481 | 0.8490 | 9.82e-4 | 0.4192 | 0.4179 | 0.4192 | 1.29e-3 | 0.3503 | 0.3504 | 0.3503 | -6.78e-5 |
| nikon-z-mc-105f28-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9579 | 0.9579 | 0.9579 | -5.70e-5 | 0.6884 | 0.6886 | 0.6884 | -2.16e-4 | 0.4373 | 0.4368 | 0.4373 | 5.71e-4 |
| nikon-z-mc-105f28-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9835 | 0.9834 | 0.9835 | 1.10e-4 | 0.8591 | 0.8582 | 0.8591 | 9.58e-4 | 0.6465 | 0.6440 | 0.6465 | 2.47e-3 |
| nikon-z-mc-105f28-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9835 | 0.9834 | 0.9835 | 1.10e-4 | 0.8591 | 0.8582 | 0.8591 | 9.58e-4 | 0.6465 | 0.6440 | 0.6465 | 2.47e-3 |
| nikon-z-mc-105f28-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9859 | 0.9860 | 0.9859 | -7.27e-5 | 0.8804 | 0.8810 | 0.8804 | -6.27e-4 | 0.7055 | 0.7071 | 0.7055 | -1.60e-3 |
| nikon-z-mc-105f28-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9929 | 0.9927 | 0.9929 | 2.09e-4 | 0.9381 | 0.9365 | 0.9381 | 1.61e-3 | 0.8370 | 0.8337 | 0.8370 | 3.29e-3 |
| nikon-z-mc-105f28-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8505 | 0.8499 | 0.8505 | 6.61e-4 | 0.3917 | 0.3912 | 0.3917 | 5.54e-4 | 0.3229 | 0.3232 | 0.3229 | -3.29e-4 |
| nikon-z-mc-105f28-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9356 | 0.9357 | 0.9356 | -1.11e-4 | 0.5638 | 0.5641 | 0.5638 | -3.92e-4 | 0.2825 | 0.2821 | 0.2825 | 4.53e-4 |
| nikon-z-135f18-plena-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9885 | 0.9887 | 0.9885 | -1.95e-4 | 0.9037 | 0.9052 | 0.9037 | -1.51e-3 | 0.7698 | 0.7728 | 0.7698 | -3.02e-3 |
| nikon-z-135f18-plena-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9885 | 0.9887 | 0.9885 | -1.95e-4 | 0.9037 | 0.9052 | 0.9037 | -1.51e-3 | 0.7698 | 0.7728 | 0.7698 | -3.02e-3 |
| nikon-z-135f18-plena-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9734 | 0.9738 | 0.9734 | -3.09e-4 | 0.7907 | 0.7927 | 0.7907 | -2.03e-3 | 0.5496 | 0.5523 | 0.5496 | -2.75e-3 |
| nikon-z-135f18-plena-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9852 | 0.9855 | 0.9852 | -2.65e-4 | 0.8933 | 0.8946 | 0.8933 | -1.31e-3 | 0.8032 | 0.8039 | 0.8032 | -7.25e-4 |
| nikon-z-135f18-plena-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9298 | 0.9308 | 0.9298 | -9.73e-4 | 0.5206 | 0.5254 | 0.5206 | -4.75e-3 | 0.1714 | 0.1744 | 0.1714 | -3.02e-3 |
| nikon-z-135f18-plena-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8510 | 0.8492 | 0.8510 | 1.85e-3 | 0.4381 | 0.4365 | 0.4381 | 1.57e-3 | 0.3204 | 0.3210 | 0.3204 | -5.94e-4 |
| nikon-z-135f18-plena-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9915 | 0.9917 | 0.9915 | -1.42e-4 | 0.9283 | 0.9295 | 0.9283 | -1.13e-3 | 0.8231 | 0.8255 | 0.8231 | -2.41e-3 |
| nikon-z-135f18-plena-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9915 | 0.9917 | 0.9915 | -1.42e-4 | 0.9283 | 0.9295 | 0.9283 | -1.13e-3 | 0.8231 | 0.8255 | 0.8231 | -2.41e-3 |
| nikon-z-135f18-plena-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9788 | 0.9791 | 0.9788 | -2.60e-4 | 0.8316 | 0.8333 | 0.8316 | -1.74e-3 | 0.6301 | 0.6326 | 0.6301 | -2.49e-3 |
| nikon-z-135f18-plena-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9858 | 0.9859 | 0.9858 | -8.48e-5 | 0.8997 | 0.9002 | 0.8997 | -4.88e-4 | 0.8195 | 0.8202 | 0.8195 | -6.76e-4 |
| nikon-z-135f18-plena-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9351 | 0.9355 | 0.9351 | -3.91e-4 | 0.5615 | 0.5640 | 0.5615 | -2.55e-3 | 0.2472 | 0.2502 | 0.2472 | -2.97e-3 |
| nikon-z-135f18-plena-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8347 | 0.8336 | 0.8347 | 1.14e-3 | 0.4319 | 0.4306 | 0.4319 | 1.33e-3 | 0.3168 | 0.3182 | 0.3168 | -1.43e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9256 | 0.9280 | 0.9256 | -2.40e-3 | 0.7076 | 0.7089 | 0.7076 | -1.35e-3 | 0.6539 | 0.6565 | 0.6539 | -2.59e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9256 | 0.9280 | 0.9256 | -2.40e-3 | 0.7076 | 0.7089 | 0.7076 | -1.35e-3 | 0.6539 | 0.6565 | 0.6539 | -2.59e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9297 | 0.9304 | 0.9297 | -6.25e-4 | 0.5984 | 0.5985 | 0.5984 | -1.02e-5 | 0.3359 | 0.3373 | 0.3359 | -1.35e-3 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9643 | 0.9645 | 0.9643 | -2.25e-4 | 0.7997 | 0.7991 | 0.7997 | 6.16e-4 | 0.6548 | 0.6552 | 0.6548 | -4.68e-4 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8209 | 0.8208 | 0.8209 | 1.33e-4 | 0.4183 | 0.4175 | 0.4183 | 8.37e-4 | 0.4034 | 0.4030 | 0.4034 | 4.05e-4 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8617 | 0.8626 | 0.8617 | -9.77e-4 | 0.3288 | 0.3303 | 0.3288 | -1.52e-3 | 0.0846 | 0.0835 | 0.0846 | 1.12e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9087 | 0.9113 | 0.9087 | -2.60e-3 | 0.6750 | 0.6759 | 0.6750 | -8.68e-4 | 0.5861 | 0.5883 | 0.5861 | -2.19e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9087 | 0.9113 | 0.9087 | -2.60e-3 | 0.6750 | 0.6759 | 0.6750 | -8.68e-4 | 0.5861 | 0.5883 | 0.5861 | -2.19e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9125 | 0.9131 | 0.9125 | -5.84e-4 | 0.5411 | 0.5409 | 0.5411 | 1.46e-4 | 0.2624 | 0.2642 | 0.2624 | -1.76e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9536 | 0.9535 | 0.9536 | 1.68e-4 | 0.7617 | 0.7602 | 0.7617 | 1.45e-3 | 0.5896 | 0.5894 | 0.5896 | 2.11e-4 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8258 | 0.8272 | 0.8258 | -1.46e-3 | 0.4075 | 0.4111 | 0.4075 | -3.66e-3 | 0.4070 | 0.4055 | 0.4070 | 1.50e-3 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8401 | 0.8424 | 0.8401 | -2.23e-3 | 0.3381 | 0.3402 | 0.3381 | -2.10e-3 | 0.1051 | 0.1059 | 0.1051 | -8.09e-4 |
| canon-ef-135-f2l-usm-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9993 | 0.9993 | 6.37e-6 | 0.9941 | 0.9940 | 0.9941 | 5.72e-5 | 0.9836 | 0.9835 | 0.9836 | 1.58e-4 |
| canon-ef-135-f2l-usm-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9993 | 0.9993 | 6.37e-6 | 0.9941 | 0.9940 | 0.9941 | 5.72e-5 | 0.9836 | 0.9835 | 0.9836 | 1.58e-4 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9819 | 0.9820 | 0.9819 | -4.47e-5 | 0.8461 | 0.8464 | 0.8461 | -3.64e-4 | 0.6160 | 0.6168 | 0.6160 | -8.10e-4 |
| canon-ef-135-f2l-usm-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9904 | 0.9904 | 0.9904 | 4.55e-5 | 0.9173 | 0.9169 | 0.9173 | 3.89e-4 | 0.7884 | 0.7875 | 0.7884 | 9.76e-4 |
| canon-ef-135-f2l-usm-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9540 | 0.9538 | 0.9540 | 2.14e-4 | 0.6760 | 0.6752 | 0.6760 | 7.52e-4 | 0.3838 | 0.3830 | 0.3838 | 8.04e-4 |
| canon-ef-135-f2l-usm-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9738 | 0.9739 | 0.9738 | -8.41e-5 | 0.7802 | 0.7809 | 0.7802 | -6.49e-4 | 0.4712 | 0.4725 | 0.4712 | -1.32e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9629 | 0.9633 | 0.9629 | -3.71e-4 | 0.7766 | 0.7783 | 0.7766 | -1.65e-3 | 0.6355 | 0.6375 | 0.6355 | -2.04e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9629 | 0.9633 | 0.9629 | -3.71e-4 | 0.7766 | 0.7783 | 0.7766 | -1.65e-3 | 0.6355 | 0.6375 | 0.6355 | -2.04e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9650 | 0.9647 | 0.9650 | 2.65e-4 | 0.7478 | 0.7462 | 0.7478 | 1.60e-3 | 0.4839 | 0.4821 | 0.4839 | 1.82e-3 |
| canon-ef-135-f2l-usm-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9652 | 0.9649 | 0.9652 | 2.54e-4 | 0.7598 | 0.7583 | 0.7598 | 1.48e-3 | 0.5406 | 0.5385 | 0.5406 | 2.07e-3 |
| canon-ef-135-f2l-usm-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9304 | 0.9308 | 0.9304 | -3.66e-4 | 0.6431 | 0.6420 | 0.6431 | 1.10e-3 | 0.4265 | 0.4247 | 0.4265 | 1.78e-3 |
| canon-ef-135-f2l-usm-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9718 | 0.9719 | 0.9718 | -8.39e-5 | 0.7735 | 0.7741 | 0.7735 | -5.29e-4 | 0.4889 | 0.4895 | 0.4889 | -6.54e-4 |
| canon-ef-135-f2l-usm-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -7.71e-7 | 0.9995 | 0.9995 | 0.9995 | -6.94e-6 | 0.9985 | 0.9985 | 0.9985 | -1.93e-5 |
| canon-ef-135-f2l-usm-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -7.71e-7 | 0.9995 | 0.9995 | 0.9995 | -6.94e-6 | 0.9985 | 0.9985 | 0.9985 | -1.93e-5 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9940 | 0.9940 | -5.58e-5 | 0.9465 | 0.9470 | 0.9465 | -4.86e-4 | 0.8562 | 0.8575 | 0.8562 | -1.26e-3 |
| canon-ef-135-f2l-usm-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9941 | 0.9940 | -5.34e-5 | 0.9471 | 0.9475 | 0.9471 | -4.63e-4 | 0.8580 | 0.8592 | 0.8580 | -1.19e-3 |
| canon-ef-135-f2l-usm-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9838 | 0.9840 | 0.9838 | -1.25e-4 | 0.8607 | 0.8617 | 0.8607 | -1.03e-3 | 0.6454 | 0.6478 | 0.6454 | -2.36e-3 |
| canon-ef-135-f2l-usm-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9760 | 0.9762 | 0.9760 | -1.70e-4 | 0.7970 | 0.7984 | 0.7970 | -1.35e-3 | 0.5020 | 0.5049 | 0.5020 | -2.84e-3 |
| canon-ef-135-f2l-usm-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9971 | 0.9971 | 0.9971 | -2.95e-5 | 0.9741 | 0.9744 | 0.9741 | -2.59e-4 | 0.9298 | 0.9305 | 0.9298 | -6.83e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9971 | 0.9971 | 0.9971 | -2.95e-5 | 0.9741 | 0.9744 | 0.9741 | -2.59e-4 | 0.9298 | 0.9305 | 0.9298 | -6.83e-4 |
| canon-ef-135-f2l-usm-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9885 | 0.9886 | 0.9885 | -1.08e-4 | 0.9007 | 0.9016 | 0.9007 | -8.92e-4 | 0.7457 | 0.7477 | 0.7457 | -2.07e-3 |
| canon-ef-135-f2l-usm-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9868 | 0.9869 | 0.9868 | -1.05e-4 | 0.8868 | 0.8877 | 0.8868 | -8.57e-4 | 0.7132 | 0.7151 | 0.7132 | -1.96e-3 |
| canon-ef-135-f2l-usm-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9789 | 0.9790 | 0.9789 | -1.69e-4 | 0.8217 | 0.8230 | 0.8217 | -1.33e-3 | 0.5646 | 0.5673 | 0.5646 | -2.75e-3 |
| canon-ef-135-f2l-usm-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9690 | 0.9692 | 0.9690 | -2.18e-4 | 0.7453 | 0.7470 | 0.7453 | -1.62e-3 | 0.4124 | 0.4153 | 0.4124 | -2.91e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -5.20e-9 | 1.0000 | 1.0000 | 1.0000 | -4.68e-8 | 1.0000 | 1.0000 | 1.0000 | -1.30e-7 |
| canon-ef-135-f2l-usm-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -5.20e-9 | 1.0000 | 1.0000 | 1.0000 | -4.68e-8 | 1.0000 | 1.0000 | 1.0000 | -1.30e-7 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9951 | 0.9951 | 0.9951 | -4.53e-5 | 0.9563 | 0.9567 | 0.9563 | -3.97e-4 | 0.8818 | 0.8828 | 0.8818 | -1.04e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9951 | 0.9952 | 0.9951 | -4.34e-5 | 0.9567 | 0.9571 | 0.9567 | -3.79e-4 | 0.8831 | 0.8841 | 0.8831 | -9.86e-4 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9857 | 0.9858 | 0.9857 | -1.10e-4 | 0.8761 | 0.8770 | 0.8761 | -9.09e-4 | 0.6814 | 0.6836 | 0.6814 | -2.13e-3 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9783 | 0.9785 | 0.9783 | -1.51e-4 | 0.8153 | 0.8166 | 0.8153 | -1.22e-3 | 0.5414 | 0.5440 | 0.5414 | -2.64e-3 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | -1.91e-5 | 0.9828 | 0.9830 | 0.9828 | -1.66e-4 | 0.9539 | 0.9543 | 0.9539 | -4.30e-4 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | -1.91e-5 | 0.9828 | 0.9830 | 0.9828 | -1.66e-4 | 0.9539 | 0.9543 | 0.9539 | -4.30e-4 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9938 | 0.9939 | 0.9938 | -5.80e-5 | 0.9455 | 0.9460 | 0.9455 | -4.97e-4 | 0.8556 | 0.8568 | 0.8556 | -1.25e-3 |
| canon-ef-135-f2l-usm-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9920 | 0.9921 | 0.9920 | -5.72e-5 | 0.9302 | 0.9307 | 0.9302 | -4.85e-4 | 0.8173 | 0.8185 | 0.8173 | -1.19e-3 |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9868 | 0.9869 | 0.9868 | -1.01e-4 | 0.8863 | 0.8871 | 0.8863 | -8.30e-4 | 0.7098 | 0.7117 | 0.7098 | -1.91e-3 |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9789 | 0.9790 | 0.9789 | -1.37e-4 | 0.8214 | 0.8225 | 0.8214 | -1.08e-3 | 0.5647 | 0.5670 | 0.5647 | -2.24e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9920 | 0.9923 | 0.9920 | -3.19e-4 | 0.9331 | 0.9354 | 0.9331 | -2.33e-3 | 0.8395 | 0.8436 | 0.8395 | -4.12e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9920 | 0.9923 | 0.9920 | -3.19e-4 | 0.9331 | 0.9354 | 0.9331 | -2.33e-3 | 0.8395 | 0.8436 | 0.8395 | -4.12e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9166 | 0.9185 | 0.9166 | -1.91e-3 | 0.6218 | 0.6238 | 0.6218 | -2.00e-3 | 0.3257 | 0.3272 | 0.3257 | -1.48e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8655 | 0.8675 | 0.8655 | -1.95e-3 | 0.7322 | 0.7320 | 0.7322 | 2.31e-4 | 0.6276 | 0.6285 | 0.6276 | -8.69e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6122 | 0.6130 | 0.6122 | -7.64e-4 | 0.3813 | 0.3814 | 0.3813 | -1.16e-4 | 0.2844 | 0.2844 | 0.2844 | 2.79e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9407 | 0.9409 | 0.9407 | -1.83e-4 | 0.6526 | 0.6530 | 0.6526 | -4.27e-4 | 0.3664 | 0.3669 | 0.3664 | -4.45e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9871 | 0.9875 | 0.9871 | -3.82e-4 | 0.9010 | 0.9034 | 0.9010 | -2.37e-3 | 0.7820 | 0.7856 | 0.7820 | -3.52e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9871 | 0.9875 | 0.9871 | -3.82e-4 | 0.9010 | 0.9034 | 0.9010 | -2.37e-3 | 0.7820 | 0.7856 | 0.7820 | -3.52e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9131 | 0.9150 | 0.9131 | -1.95e-3 | 0.6103 | 0.6121 | 0.6103 | -1.84e-3 | 0.3171 | 0.3185 | 0.3171 | -1.45e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8688 | 0.8708 | 0.8688 | -1.95e-3 | 0.6983 | 0.6984 | 0.6983 | -1.09e-4 | 0.5513 | 0.5509 | 0.5513 | 3.74e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6118 | 0.6123 | 0.6118 | -5.41e-4 | 0.3808 | 0.3806 | 0.3808 | 1.60e-4 | 0.2817 | 0.2816 | 0.2817 | 8.52e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8907 | 0.8910 | 0.8907 | -3.45e-4 | 0.4905 | 0.4904 | 0.4905 | 6.71e-5 | 0.2222 | 0.2222 | 0.2222 | -6.75e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -2.18e-5 | 0.9926 | 0.9928 | 0.9926 | -1.95e-4 | 0.9796 | 0.9801 | 0.9796 | -5.34e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -2.18e-5 | 0.9926 | 0.9928 | 0.9926 | -1.95e-4 | 0.9796 | 0.9801 | 0.9796 | -5.34e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9788 | 0.9789 | 0.9788 | -9.33e-5 | 0.8204 | 0.8211 | 0.8204 | -7.29e-4 | 0.5584 | 0.5598 | 0.5584 | -1.49e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | -1.70e-5 | 0.9830 | 0.9832 | 0.9830 | -1.48e-4 | 0.9540 | 0.9544 | 0.9540 | -3.88e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9960 | 0.9959 | -4.56e-5 | 0.9640 | 0.9644 | 0.9640 | -3.99e-4 | 0.9035 | 0.9045 | 0.9035 | -1.05e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9939 | 0.9939 | 0.9939 | -3.12e-6 | 0.9463 | 0.9463 | 0.9463 | -2.49e-5 | 0.8550 | 0.8550 | 0.8550 | -5.12e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9986 | 0.9985 | -2.84e-5 | 0.9870 | 0.9873 | 0.9870 | -2.52e-4 | 0.9644 | 0.9651 | 0.9644 | -6.80e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9986 | 0.9985 | -2.84e-5 | 0.9870 | 0.9873 | 0.9870 | -2.52e-4 | 0.9644 | 0.9651 | 0.9644 | -6.80e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9778 | 0.9779 | 0.9778 | -9.60e-5 | 0.8133 | 0.8140 | 0.8133 | -7.37e-4 | 0.5468 | 0.5482 | 0.5468 | -1.45e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9949 | 0.9950 | 0.9949 | -2.98e-5 | 0.9559 | 0.9562 | 0.9559 | -2.48e-4 | 0.8852 | 0.8858 | 0.8852 | -5.82e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9953 | 0.9953 | 0.9953 | -5.30e-5 | 0.9583 | 0.9587 | 0.9583 | -4.60e-4 | 0.8890 | 0.8902 | 0.8890 | -1.19e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9709 | 0.9711 | 0.9709 | -1.57e-4 | 0.7805 | 0.7815 | 0.7805 | -9.80e-4 | 0.5599 | 0.5614 | 0.5599 | -1.45e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.91e-6 | 0.9993 | 0.9993 | 0.9993 | -1.72e-5 | 0.9979 | 0.9980 | 0.9979 | -4.76e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.91e-6 | 0.9993 | 0.9993 | 0.9993 | -1.72e-5 | 0.9979 | 0.9980 | 0.9979 | -4.76e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9857 | 0.9859 | 0.9857 | -1.63e-4 | 0.8765 | 0.8779 | 0.8765 | -1.35e-3 | 0.6848 | 0.6879 | 0.6848 | -3.12e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | -1.64e-5 | 0.9918 | 0.9919 | 0.9918 | -1.46e-4 | 0.9773 | 0.9777 | 0.9773 | -3.97e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9962 | 0.9962 | 0.9962 | -6.00e-5 | 0.9659 | 0.9664 | 0.9659 | -5.25e-4 | 0.9077 | 0.9091 | 0.9077 | -1.38e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9902 | 0.9902 | 0.9902 | -2.66e-6 | 0.9139 | 0.9139 | 0.9139 | -2.22e-5 | 0.7709 | 0.7710 | 0.7709 | -5.19e-5 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -6.37e-6 | 0.9949 | 0.9950 | 0.9949 | -5.71e-5 | 0.9861 | 0.9862 | 0.9861 | -1.57e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -6.37e-6 | 0.9949 | 0.9950 | 0.9949 | -5.71e-5 | 0.9861 | 0.9862 | 0.9861 | -1.57e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9854 | 0.9856 | 0.9854 | -1.64e-4 | 0.8748 | 0.8761 | 0.8748 | -1.34e-3 | 0.6831 | 0.6861 | 0.6831 | -3.05e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9968 | 0.9969 | 0.9968 | -3.77e-5 | 0.9720 | 0.9723 | 0.9720 | -3.24e-4 | 0.9254 | 0.9263 | 0.9254 | -8.19e-4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9954 | 0.9955 | 0.9954 | -6.95e-5 | 0.9598 | 0.9604 | 0.9598 | -6.02e-4 | 0.8926 | 0.8942 | 0.8926 | -1.55e-3 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9705 | 0.9707 | 0.9705 | -1.21e-4 | 0.7798 | 0.7805 | 0.7798 | -7.35e-4 | 0.5709 | 0.5720 | 0.5709 | -1.02e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -1.68e-6 | 0.9984 | 0.9984 | 0.9984 | -1.51e-5 | 0.9955 | 0.9955 | 0.9955 | -4.20e-5 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -1.68e-6 | 0.9984 | 0.9984 | 0.9984 | -1.51e-5 | 0.9955 | 0.9955 | 0.9955 | -4.20e-5 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9291 | 0.9301 | 0.9291 | -9.26e-4 | 0.6583 | 0.6593 | 0.6583 | -1.00e-3 | 0.3998 | 0.4015 | 0.3998 | -1.71e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9613 | 0.9609 | 0.9613 | 4.41e-4 | 0.7454 | 0.7453 | 0.7454 | 1.27e-4 | 0.5480 | 0.5500 | 0.5480 | -1.99e-3 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | sagittal | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.5069 | 0.5069 | 0.5069 | 7.88e-6 | 0.3628 | 0.3638 | 0.3628 | -1.01e-3 | 0.3142 | 0.3150 | 0.3142 | -8.81e-4 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | tangential | unconverged | unconverged | unconverged | numerical: unconverged | SET ASIDE | RECORDED | 0.6932 | 0.6955 | 0.6932 | -2.28e-3 | 0.5342 | 0.5326 | 0.5342 | 1.63e-3 | 0.4411 | 0.4404 | 0.4411 | 7.63e-4 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9661 | 0.9665 | 0.9661 | -4.82e-4 | 0.7835 | 0.7854 | 0.7835 | -1.87e-3 | 0.6263 | 0.6280 | 0.6263 | -1.70e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9661 | 0.9665 | 0.9661 | -4.82e-4 | 0.7835 | 0.7854 | 0.7835 | -1.87e-3 | 0.6263 | 0.6280 | 0.6263 | -1.70e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8851 | 0.8883 | 0.8851 | -3.14e-3 | 0.5919 | 0.5988 | 0.5919 | -6.87e-3 | 0.3930 | 0.3970 | 0.3930 | -4.01e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9163 | 0.9160 | 0.9163 | 2.85e-4 | 0.5771 | 0.5785 | 0.5771 | -1.41e-3 | 0.3467 | 0.3505 | 0.3467 | -3.78e-3 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | sagittal | ok | unconverged | ok | numerical: unconverged | SET ASIDE | RECORDED | 0.4670 | 0.4671 | 0.4670 | -1.20e-4 | 0.3022 | 0.3018 | 0.3022 | 3.85e-4 | 0.2444 | 0.2453 | 0.2444 | -9.47e-4 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | tangential | ok | unconverged | ok | numerical: unconverged | SET ASIDE | RECORDED | 0.6664 | 0.6653 | 0.6664 | 1.09e-3 | 0.4157 | 0.4131 | 0.4157 | 2.53e-3 | 0.2561 | 0.2560 | 0.2561 | 5.11e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.05e-9 | 1.0000 | 1.0000 | 1.0000 | -8.15e-8 | 1.0000 | 1.0000 | 1.0000 | -2.26e-7 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.05e-9 | 1.0000 | 1.0000 | 1.0000 | -8.15e-8 | 1.0000 | 1.0000 | 1.0000 | -2.26e-7 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9906 | 0.9907 | 0.9906 | -8.21e-5 | 0.9174 | 0.9181 | 0.9174 | -7.03e-4 | 0.7814 | 0.7832 | 0.7814 | -1.76e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -4.71e-6 | 0.9964 | 0.9964 | 0.9964 | -4.23e-5 | 0.9899 | 0.9900 | 0.9899 | -1.17e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -4.99e-6 | 0.9951 | 0.9951 | 0.9951 | -4.48e-5 | 0.9864 | 0.9865 | 0.9864 | -1.24e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | 4.51e-6 | 0.9894 | 0.9894 | 0.9894 | 3.99e-5 | 0.9707 | 0.9706 | 0.9707 | 1.08e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9989 | 0.9989 | -1.11e-5 | 0.9899 | 0.9900 | 0.9899 | -9.86e-5 | 0.9721 | 0.9724 | 0.9721 | -2.68e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9989 | 0.9989 | -1.11e-5 | 0.9899 | 0.9900 | 0.9899 | -9.86e-5 | 0.9721 | 0.9724 | 0.9721 | -2.68e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9882 | 0.9881 | -1.06e-4 | 0.8962 | 0.8970 | 0.8962 | -8.87e-4 | 0.7306 | 0.7328 | 0.7306 | -2.12e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9923 | 0.9923 | 0.9923 | -6.80e-6 | 0.9334 | 0.9334 | 0.9334 | -5.09e-5 | 0.8288 | 0.8289 | 0.8288 | -9.23e-5 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -4.58e-6 | 0.9953 | 0.9953 | 0.9953 | -4.07e-5 | 0.9871 | 0.9872 | 0.9871 | -1.10e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9864 | 0.9864 | 0.9864 | 2.52e-5 | 0.8864 | 0.8862 | 0.8864 | 1.84e-4 | 0.7291 | 0.7288 | 0.7291 | 3.13e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.84e-11 | 1.0000 | 1.0000 | 1.0000 | -8.86e-10 | 1.0000 | 1.0000 | 1.0000 | -2.46e-9 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.84e-11 | 1.0000 | 1.0000 | 1.0000 | -8.86e-10 | 1.0000 | 1.0000 | 1.0000 | -2.46e-9 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9904 | 0.9905 | 0.9904 | -8.44e-5 | 0.9155 | 0.9162 | 0.9155 | -7.22e-4 | 0.7767 | 0.7785 | 0.7767 | -1.80e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -4.31e-6 | 0.9967 | 0.9968 | 0.9967 | -3.87e-5 | 0.9909 | 0.9910 | 0.9909 | -1.07e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -5.62e-6 | 0.9946 | 0.9947 | 0.9946 | -5.05e-5 | 0.9851 | 0.9853 | 0.9851 | -1.40e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9989 | 0.9989 | 4.63e-6 | 0.9898 | 0.9897 | 0.9898 | 4.11e-5 | 0.9717 | 0.9716 | 0.9717 | 1.11e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -8.26e-6 | 0.9924 | 0.9925 | 0.9924 | -7.34e-5 | 0.9792 | 0.9794 | 0.9792 | -1.99e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -8.26e-6 | 0.9924 | 0.9925 | 0.9924 | -7.34e-5 | 0.9792 | 0.9794 | 0.9792 | -1.99e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9914 | 0.9915 | 0.9914 | -7.49e-5 | 0.9247 | 0.9253 | 0.9247 | -6.39e-4 | 0.8011 | 0.8027 | 0.8011 | -1.59e-3 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9916 | 0.9917 | 0.9916 | -1.33e-5 | 0.9281 | 0.9282 | 0.9281 | -1.01e-4 | 0.8179 | 0.8181 | 0.8179 | -1.90e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -4.51e-6 | 0.9964 | 0.9965 | 0.9964 | -3.95e-5 | 0.9904 | 0.9905 | 0.9904 | -1.04e-4 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9858 | 0.9858 | 0.9858 | 4.63e-5 | 0.8818 | 0.8814 | 0.8818 | 3.61e-4 | 0.7193 | 0.7186 | 0.7193 | 7.46e-4 |
| nikkor-z50f12-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9919 | 0.9919 | 0.9919 | 4.89e-6 | 0.9298 | 0.9297 | 0.9298 | 2.99e-5 | 0.8174 | 0.8174 | 0.8174 | 1.27e-5 |
| nikkor-z50f12-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9919 | 0.9919 | 0.9919 | 4.89e-6 | 0.9298 | 0.9297 | 0.9298 | 2.99e-5 | 0.8174 | 0.8174 | 0.8174 | 1.27e-5 |
| nikkor-z50f12-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9433 | 0.9436 | 0.9433 | -2.97e-4 | 0.7226 | 0.7227 | 0.7226 | -8.82e-5 | 0.6329 | 0.6340 | 0.6329 | -1.14e-3 |
| nikkor-z50f12-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9508 | 0.9498 | 0.9508 | 1.03e-3 | 0.7482 | 0.7472 | 0.7482 | 9.90e-4 | 0.5732 | 0.5724 | 0.5732 | 7.53e-4 |
| nikkor-z50f12-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7932 | 0.7932 | 0.7932 | 2.50e-5 | 0.5233 | 0.5234 | 0.5233 | -1.24e-4 | 0.2972 | 0.2975 | 0.2972 | -3.36e-4 |
| nikkor-z50f12-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8843 | 0.8849 | 0.8843 | -5.34e-4 | 0.5230 | 0.5221 | 0.5230 | 9.35e-4 | 0.2665 | 0.2675 | 0.2665 | -1.02e-3 |
| nikkor-z50f12-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9846 | 0.9847 | 0.9846 | -9.33e-5 | 0.8745 | 0.8753 | 0.8745 | -7.77e-4 | 0.7100 | 0.7119 | 0.7100 | -1.88e-3 |
| nikkor-z50f12-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9846 | 0.9847 | 0.9846 | -9.33e-5 | 0.8745 | 0.8753 | 0.8745 | -7.77e-4 | 0.7100 | 0.7119 | 0.7100 | -1.88e-3 |
| nikkor-z50f12-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9275 | 0.9301 | 0.9275 | -2.60e-3 | 0.6760 | 0.6778 | 0.6760 | -1.83e-3 | 0.5459 | 0.5443 | 0.5459 | 1.56e-3 |
| nikkor-z50f12-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9415 | 0.9364 | 0.9415 | 5.19e-3 | 0.6816 | 0.6787 | 0.6816 | 2.89e-3 | 0.4886 | 0.4870 | 0.4886 | 1.60e-3 |
| nikkor-z50f12-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7848 | 0.7849 | 0.7848 | -1.68e-4 | 0.5116 | 0.5119 | 0.5116 | -2.34e-4 | 0.2890 | 0.2877 | 0.2890 | 1.27e-3 |
| nikkor-z50f12-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8678 | 0.8681 | 0.8678 | -3.09e-4 | 0.5175 | 0.5176 | 0.5175 | -8.04e-5 | 0.3090 | 0.3098 | 0.3090 | -8.69e-4 |
| nikkor-z50f12-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -6.05e-8 | 1.0000 | 1.0000 | 1.0000 | -5.45e-7 | 1.0000 | 1.0000 | 1.0000 | -1.51e-6 |
| nikkor-z50f12-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -6.05e-8 | 1.0000 | 1.0000 | 1.0000 | -5.45e-7 | 1.0000 | 1.0000 | 1.0000 | -1.51e-6 |
| nikkor-z50f12-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | -2.12e-5 | 0.9827 | 0.9828 | 0.9827 | -1.89e-4 | 0.9523 | 0.9529 | 0.9523 | -5.12e-4 |
| nikkor-z50f12-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -1.00e-6 | 0.9995 | 0.9995 | 0.9995 | -9.03e-6 | 0.9987 | 0.9987 | 0.9987 | -2.51e-5 |
| nikkor-z50f12-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9796 | 0.9798 | 0.9796 | -1.81e-4 | 0.8265 | 0.8279 | 0.8265 | -1.45e-3 | 0.5674 | 0.5705 | 0.5674 | -3.16e-3 |
| nikkor-z50f12-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9960 | 0.9960 | 0.9960 | -1.35e-5 | 0.9644 | 0.9645 | 0.9644 | -1.19e-4 | 0.9030 | 0.9033 | 0.9030 | -3.18e-4 |
| nikkor-z50f12-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9986 | 0.9986 | 0.9986 | -1.37e-5 | 0.9874 | 0.9876 | 0.9874 | -1.22e-4 | 0.9656 | 0.9659 | 0.9656 | -3.29e-4 |
| nikkor-z50f12-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9986 | 0.9986 | 0.9986 | -1.37e-5 | 0.9874 | 0.9876 | 0.9874 | -1.22e-4 | 0.9656 | 0.9659 | 0.9656 | -3.29e-4 |
| nikkor-z50f12-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9961 | 0.9962 | 0.9961 | -4.00e-5 | 0.9658 | 0.9662 | 0.9658 | -3.49e-4 | 0.9077 | 0.9086 | 0.9077 | -9.16e-4 |
| nikkor-z50f12-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9870 | 0.9870 | 0.9870 | -4.03e-6 | 0.8879 | 0.8879 | 0.8879 | -3.09e-5 | 0.7160 | 0.7160 | 0.7160 | -6.24e-5 |
| nikkor-z50f12-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9773 | 0.9775 | 0.9773 | -2.02e-4 | 0.8078 | 0.8094 | 0.8078 | -1.59e-3 | 0.5290 | 0.5323 | 0.5290 | -3.32e-3 |
| nikkor-z50f12-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9840 | 0.9841 | 0.9840 | -3.96e-5 | 0.8630 | 0.8634 | 0.8630 | -3.17e-4 | 0.6541 | 0.6548 | 0.6541 | -7.06e-4 |
| nikkor-z50f12-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -8.55e-9 | 1.0000 | 1.0000 | 1.0000 | -7.69e-8 | 1.0000 | 1.0000 | 1.0000 | -2.14e-7 |
| nikkor-z50f12-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -8.55e-9 | 1.0000 | 1.0000 | 1.0000 | -7.69e-8 | 1.0000 | 1.0000 | 1.0000 | -2.14e-7 |
| nikkor-z50f12-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9982 | 0.9982 | 0.9982 | -2.01e-5 | 0.9836 | 0.9838 | 0.9836 | -1.79e-4 | 0.9549 | 0.9554 | 0.9549 | -4.88e-4 |
| nikkor-z50f12-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -9.08e-7 | 0.9996 | 0.9996 | 0.9996 | -8.18e-6 | 0.9988 | 0.9988 | 0.9988 | -2.27e-5 |
| nikkor-z50f12-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9800 | 0.9802 | 0.9800 | -1.77e-4 | 0.8292 | 0.8306 | 0.8292 | -1.43e-3 | 0.5735 | 0.5766 | 0.5735 | -3.12e-3 |
| nikkor-z50f12-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9961 | 0.9961 | 0.9961 | -1.32e-5 | 0.9655 | 0.9656 | 0.9655 | -1.17e-4 | 0.9060 | 0.9063 | 0.9060 | -3.13e-4 |
| nikkor-z50f12-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -8.97e-6 | 0.9914 | 0.9915 | 0.9914 | -7.97e-5 | 0.9764 | 0.9767 | 0.9764 | -2.16e-4 |
| nikkor-z50f12-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -8.97e-6 | 0.9914 | 0.9915 | 0.9914 | -7.97e-5 | 0.9764 | 0.9767 | 0.9764 | -2.16e-4 |
| nikkor-z50f12-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9982 | 0.9981 | -1.96e-5 | 0.9834 | 0.9835 | 0.9834 | -1.74e-4 | 0.9545 | 0.9549 | 0.9545 | -4.68e-4 |
| nikkor-z50f12-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9870 | 0.9870 | 0.9870 | -2.98e-6 | 0.8890 | 0.8890 | 0.8890 | -1.82e-5 | 0.7213 | 0.7213 | 0.7213 | -1.02e-5 |
| nikkor-z50f12-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9831 | 0.9833 | 0.9831 | -1.48e-4 | 0.8550 | 0.8562 | 0.8550 | -1.21e-3 | 0.6332 | 0.6359 | 0.6332 | -2.72e-3 |
| nikkor-z50f12-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9868 | 0.9868 | 0.9868 | -2.88e-5 | 0.8867 | 0.8869 | 0.8867 | -2.21e-4 | 0.7121 | 0.7125 | 0.7121 | -4.49e-4 |
| sony-fe-20mm-f18-g-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9847 | 0.9850 | 0.9847 | -3.91e-4 | 0.8738 | 0.8764 | 0.8738 | -2.63e-3 | 0.7033 | 0.7071 | 0.7033 | -3.81e-3 |
| sony-fe-20mm-f18-g-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9847 | 0.9850 | 0.9847 | -3.91e-4 | 0.8738 | 0.8764 | 0.8738 | -2.63e-3 | 0.7033 | 0.7071 | 0.7033 | -3.81e-3 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8531 | 0.8541 | 0.8531 | -9.84e-4 | 0.2888 | 0.2902 | 0.2888 | -1.38e-3 | 0.1908 | 0.1902 | 0.1908 | 6.61e-4 |
| sony-fe-20mm-f18-g-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6525 | 0.6532 | 0.6525 | -7.58e-4 | 0.3071 | 0.3067 | 0.3071 | 4.75e-4 | 0.1437 | 0.1434 | 0.1437 | 3.61e-4 |
| sony-fe-20mm-f18-g-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.5120 | 0.5124 | 0.5120 | -4.61e-4 | 0.3069 | 0.3082 | 0.3069 | -1.27e-3 | 0.0158 | 0.0151 | 0.0158 | 6.49e-4 |
| sony-fe-20mm-f18-g-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.1444 | 0.1446 | 0.1444 | -2.48e-4 | 0.1219 | 0.1232 | 0.1219 | -1.29e-3 | 0.1102 | 0.1097 | 0.1102 | 5.66e-4 |
| sony-fe-20mm-f18-g-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9838 | 0.9843 | 0.9838 | -4.24e-4 | 0.8702 | 0.8729 | 0.8702 | -2.69e-3 | 0.7069 | 0.7104 | 0.7069 | -3.46e-3 |
| sony-fe-20mm-f18-g-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9838 | 0.9843 | 0.9838 | -4.24e-4 | 0.8702 | 0.8729 | 0.8702 | -2.69e-3 | 0.7069 | 0.7104 | 0.7069 | -3.46e-3 |
| sony-fe-20mm-f18-g-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8471 | 0.8488 | 0.8471 | -1.64e-3 | 0.3007 | 0.3030 | 0.3007 | -2.35e-3 | 0.1937 | 0.1928 | 0.1937 | 8.92e-4 |
| sony-fe-20mm-f18-g-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6471 | 0.6481 | 0.6471 | -1.03e-3 | 0.2860 | 0.2862 | 0.2860 | -1.54e-4 | 0.1270 | 0.1257 | 0.1270 | 1.31e-3 |
| sony-fe-20mm-f18-g-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.5153 | 0.5163 | 0.5153 | -1.04e-3 | 0.2969 | 0.2971 | 0.2969 | -1.11e-4 | 0.0208 | 0.0207 | 0.0208 | 6.30e-5 |
| sony-fe-20mm-f18-g-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.1371 | 0.1370 | 0.1371 | 1.86e-4 | 0.0806 | 0.0807 | 0.0806 | -6.91e-5 | 0.0509 | 0.0496 | 0.0509 | 1.33e-3 |
| sony-fe-20mm-f18-g-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.04e-8 | 1.0000 | 1.0000 | 1.0000 | -9.37e-8 | 1.0000 | 1.0000 | 1.0000 | -2.60e-7 |
| sony-fe-20mm-f18-g-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.04e-8 | 1.0000 | 1.0000 | 1.0000 | -9.37e-8 | 1.0000 | 1.0000 | 1.0000 | -2.60e-7 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9916 | 0.9917 | 0.9916 | -8.73e-5 | 0.9262 | 0.9269 | 0.9262 | -7.50e-4 | 0.8038 | 0.8057 | 0.8038 | -1.90e-3 |
| sony-fe-20mm-f18-g-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9852 | 0.9854 | 0.9852 | -1.61e-4 | 0.8725 | 0.8738 | 0.8725 | -1.33e-3 | 0.6736 | 0.6766 | 0.6736 | -3.07e-3 |
| sony-fe-20mm-f18-g-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9293 | 0.9295 | 0.9293 | -2.54e-4 | 0.4721 | 0.4735 | 0.4721 | -1.41e-3 | 0.0108 | 0.0099 | 0.0108 | 9.20e-4 |
| sony-fe-20mm-f18-g-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8601 | 0.8607 | 0.8601 | -5.48e-4 | 0.1519 | 0.1534 | 0.1519 | -1.45e-3 | 0.1170 | 0.1189 | 0.1170 | -1.85e-3 |
| sony-fe-20mm-f18-g-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -5.26e-6 | 0.9949 | 0.9949 | 0.9949 | -4.71e-5 | 0.9858 | 0.9860 | 0.9858 | -1.29e-4 |
| sony-fe-20mm-f18-g-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -5.26e-6 | 0.9949 | 0.9949 | 0.9949 | -4.71e-5 | 0.9858 | 0.9860 | 0.9858 | -1.29e-4 |
| sony-fe-20mm-f18-g-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9900 | 0.9901 | 0.9900 | -1.02e-4 | 0.9124 | 0.9133 | 0.9124 | -8.68e-4 | 0.7700 | 0.7721 | 0.7700 | -2.14e-3 |
| sony-fe-20mm-f18-g-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9828 | 0.9830 | 0.9828 | -1.71e-4 | 0.8530 | 0.8544 | 0.8530 | -1.38e-3 | 0.6315 | 0.6346 | 0.6315 | -3.08e-3 |
| sony-fe-20mm-f18-g-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9283 | 0.9286 | 0.9283 | -2.56e-4 | 0.4666 | 0.4680 | 0.4666 | -1.41e-3 | 0.0157 | 0.0148 | 0.0157 | 8.75e-4 |
| sony-fe-20mm-f18-g-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8489 | 0.8495 | 0.8489 | -5.59e-4 | 0.1269 | 0.1282 | 0.1269 | -1.30e-3 | 0.0934 | 0.0951 | 0.0934 | -1.67e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.76e-9 | 1.0000 | 1.0000 | 1.0000 | -1.58e-8 | 1.0000 | 1.0000 | 1.0000 | -4.40e-8 |
| sony-fe-20mm-f18-g-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.76e-9 | 1.0000 | 1.0000 | 1.0000 | -1.58e-8 | 1.0000 | 1.0000 | 1.0000 | -4.40e-8 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9917 | 0.9918 | 0.9917 | -8.65e-5 | 0.9269 | 0.9276 | 0.9269 | -7.44e-4 | 0.8056 | 0.8075 | 0.8056 | -1.88e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9853 | 0.9855 | 0.9853 | -1.59e-4 | 0.8733 | 0.8746 | 0.8733 | -1.32e-3 | 0.6756 | 0.6786 | 0.6756 | -3.06e-3 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9295 | 0.9298 | 0.9295 | -2.53e-4 | 0.4734 | 0.4748 | 0.4734 | -1.41e-3 | 0.0094 | 0.0085 | 0.0094 | 9.23e-4 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8604 | 0.8609 | 0.8604 | -5.47e-4 | 0.1527 | 0.1542 | 0.1527 | -1.45e-3 | 0.1172 | 0.1190 | 0.1172 | -1.84e-3 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.58e-6 | 0.9964 | 0.9964 | 0.9964 | -3.20e-5 | 0.9901 | 0.9902 | 0.9901 | -8.80e-5 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.58e-6 | 0.9964 | 0.9964 | 0.9964 | -3.20e-5 | 0.9901 | 0.9902 | 0.9901 | -8.80e-5 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9923 | 0.9924 | 0.9923 | -7.88e-5 | 0.9325 | 0.9332 | 0.9325 | -6.78e-4 | 0.8205 | 0.8222 | 0.8205 | -1.72e-3 |
| sony-fe-20mm-f18-g-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9856 | 0.9857 | 0.9856 | -1.42e-4 | 0.8760 | 0.8771 | 0.8760 | -1.17e-3 | 0.6844 | 0.6871 | 0.6844 | -2.71e-3 |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9344 | 0.9346 | 0.9344 | -2.34e-4 | 0.5034 | 0.5048 | 0.5034 | -1.35e-3 | 0.0232 | 0.0242 | 0.0232 | -1.07e-3 |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8552 | 0.8558 | 0.8552 | -5.37e-4 | 0.1479 | 0.1492 | 0.1479 | -1.36e-3 | 0.0974 | 0.0989 | 0.0974 | -1.52e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 8.66e-7 | 0.9993 | 0.9993 | 0.9993 | 7.79e-6 | 0.9980 | 0.9980 | 0.9980 | 2.16e-5 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 8.66e-7 | 0.9993 | 0.9993 | 0.9993 | 7.79e-6 | 0.9980 | 0.9980 | 0.9980 | 2.16e-5 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9987 | 0.9987 | 0.9987 | -7.73e-8 | 0.9885 | 0.9885 | 0.9885 | 1.66e-6 | 0.9685 | 0.9685 | 0.9685 | 1.75e-5 |
| sony-fe-400mm-f28-gm-oss-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9983 | 0.9983 | 0.9983 | -9.54e-6 | 0.9849 | 0.9850 | 0.9849 | -8.53e-5 | 0.9586 | 0.9588 | 0.9586 | -2.34e-4 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9976 | 0.9975 | 0.9976 | 1.50e-4 | 0.9788 | 0.9775 | 0.9788 | 1.33e-3 | 0.9428 | 0.9392 | 0.9428 | 3.57e-3 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9959 | 0.9958 | 0.9959 | 1.25e-4 | 0.9645 | 0.9634 | 0.9645 | 1.06e-3 | 0.9089 | 0.9063 | 0.9089 | 2.57e-3 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -6.04e-6 | 0.9825 | 0.9826 | 0.9825 | -5.28e-5 | 0.9525 | 0.9527 | 0.9525 | -1.38e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -6.04e-6 | 0.9825 | 0.9826 | 0.9825 | -5.28e-5 | 0.9525 | 0.9527 | 0.9525 | -1.38e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9964 | 0.9964 | 0.9964 | -4.52e-5 | 0.9686 | 0.9690 | 0.9686 | -3.76e-4 | 0.9183 | 0.9191 | 0.9183 | -8.95e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9965 | 0.9966 | 0.9965 | -6.28e-5 | 0.9699 | 0.9704 | 0.9699 | -5.21e-4 | 0.9218 | 0.9230 | 0.9218 | -1.23e-3 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9936 | 0.9937 | 0.9936 | -6.02e-5 | 0.9458 | 0.9462 | 0.9458 | -4.22e-4 | 0.8644 | 0.8652 | 0.8644 | -7.27e-4 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9920 | 0.9920 | 0.9920 | -3.30e-5 | 0.9306 | 0.9308 | 0.9306 | -2.42e-4 | 0.8219 | 0.8223 | 0.8219 | -4.04e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9944 | 0.9944 | 0.9944 | -5.35e-5 | 0.9500 | 0.9505 | 0.9500 | -4.67e-4 | 0.8653 | 0.8665 | 0.8653 | -1.22e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9944 | 0.9944 | 0.9944 | -5.35e-5 | 0.9500 | 0.9505 | 0.9500 | -4.67e-4 | 0.8653 | 0.8665 | 0.8653 | -1.22e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9957 | 0.9958 | 0.9957 | -4.67e-5 | 0.9621 | 0.9625 | 0.9621 | -4.11e-4 | 0.8970 | 0.8981 | 0.8970 | -1.09e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9966 | 0.9967 | 0.9966 | -4.74e-5 | 0.9701 | 0.9705 | 0.9701 | -4.17e-4 | 0.9188 | 0.9199 | 0.9188 | -1.11e-3 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9953 | 0.9953 | 0.9953 | -2.44e-5 | 0.9580 | 0.9582 | 0.9580 | -2.13e-4 | 0.8867 | 0.8873 | 0.8867 | -5.50e-4 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9953 | 0.9953 | 0.9953 | -2.62e-5 | 0.9585 | 0.9587 | 0.9585 | -2.27e-4 | 0.8889 | 0.8895 | 0.8889 | -5.80e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9955 | 0.9956 | 0.9955 | -4.24e-5 | 0.9605 | 0.9609 | 0.9605 | -3.68e-4 | 0.8938 | 0.8948 | 0.8938 | -9.55e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9955 | 0.9956 | 0.9955 | -4.24e-5 | 0.9605 | 0.9609 | 0.9605 | -3.68e-4 | 0.8938 | 0.8948 | 0.8938 | -9.55e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9967 | 0.9967 | 0.9967 | -3.69e-5 | 0.9703 | 0.9706 | 0.9703 | -3.23e-4 | 0.9195 | 0.9204 | 0.9195 | -8.51e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9955 | 0.9955 | 0.9955 | -3.88e-5 | 0.9603 | 0.9606 | 0.9603 | -3.36e-4 | 0.8944 | 0.8953 | 0.8944 | -8.63e-4 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9963 | 0.9964 | 0.9963 | -6.04e-5 | 0.9672 | 0.9677 | 0.9672 | -5.27e-4 | 0.9118 | 0.9132 | 0.9118 | -1.38e-3 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9918 | 0.9917 | 0.9918 | 4.41e-5 | 0.9289 | 0.9286 | 0.9289 | 3.70e-4 | 0.8189 | 0.8181 | 0.8189 | 8.61e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -2.76e-9 | 1.0000 | 1.0000 | 1.0000 | -2.48e-8 | 1.0000 | 1.0000 | 1.0000 | -6.89e-8 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -2.76e-9 | 1.0000 | 1.0000 | 1.0000 | -2.48e-8 | 1.0000 | 1.0000 | 1.0000 | -6.89e-8 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -4.04e-7 | 0.9990 | 0.9990 | 0.9990 | -3.63e-6 | 0.9971 | 0.9972 | 0.9971 | -1.01e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | 1.09e-7 | 0.9964 | 0.9964 | 0.9964 | 9.62e-7 | 0.9899 | 0.9899 | 0.9899 | 2.67e-6 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9997 | 0.9997 | 0.9997 | -2.85e-6 | 0.9970 | 0.9970 | 0.9970 | -2.56e-5 | 0.9916 | 0.9916 | 0.9916 | -7.09e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | 2.35e-6 | 0.9945 | 0.9945 | 0.9945 | 2.10e-5 | 0.9848 | 0.9847 | 0.9848 | 5.82e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.39e-6 | 0.9967 | 0.9967 | 0.9967 | -3.03e-5 | 0.9908 | 0.9909 | 0.9908 | -8.33e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.39e-6 | 0.9967 | 0.9967 | 0.9967 | -3.03e-5 | 0.9908 | 0.9909 | 0.9908 | -8.33e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.59e-6 | 0.9960 | 0.9961 | 0.9960 | -3.21e-5 | 0.9890 | 0.9891 | 0.9890 | -8.85e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9981 | 0.9981 | 2.07e-6 | 0.9830 | 0.9830 | 0.9830 | 1.86e-5 | 0.9534 | 0.9534 | 0.9534 | 5.13e-5 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9993 | 0.9993 | -6.58e-6 | 0.9939 | 0.9940 | 0.9939 | -5.89e-5 | 0.9832 | 0.9833 | 0.9832 | -1.62e-4 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9948 | 0.9947 | 0.9948 | 5.51e-6 | 0.9538 | 0.9538 | 0.9538 | 5.43e-5 | 0.8773 | 0.8771 | 0.8773 | 1.72e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9960 | 0.9959 | -1.21e-4 | 0.9641 | 0.9651 | 0.9641 | -1.01e-3 | 0.9056 | 0.9080 | 0.9056 | -2.36e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9960 | 0.9959 | -1.21e-4 | 0.9641 | 0.9651 | 0.9641 | -1.01e-3 | 0.9056 | 0.9080 | 0.9056 | -2.36e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9798 | 0.9800 | 0.9798 | -2.07e-4 | 0.8372 | 0.8386 | 0.8372 | -1.39e-3 | 0.6328 | 0.6347 | 0.6328 | -1.96e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9384 | 0.9386 | 0.9384 | -1.50e-4 | 0.5721 | 0.5729 | 0.5721 | -7.41e-4 | 0.2809 | 0.2812 | 0.2809 | -3.27e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9690 | 0.9690 | 0.9690 | 2.12e-5 | 0.7820 | 0.7820 | 0.7820 | -3.82e-5 | 0.6012 | 0.6017 | 0.6012 | -4.70e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9528 | 0.9534 | 0.9528 | -5.50e-4 | 0.6704 | 0.6726 | 0.6704 | -2.25e-3 | 0.4634 | 0.4631 | 0.4634 | 2.69e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9942 | 0.9940 | -1.51e-4 | 0.9489 | 0.9501 | 0.9489 | -1.17e-3 | 0.8716 | 0.8740 | 0.8716 | -2.43e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9942 | 0.9940 | -1.51e-4 | 0.9489 | 0.9501 | 0.9489 | -1.17e-3 | 0.8716 | 0.8740 | 0.8716 | -2.43e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9801 | 0.9804 | 0.9801 | -2.49e-4 | 0.8427 | 0.8443 | 0.8427 | -1.59e-3 | 0.6529 | 0.6550 | 0.6529 | -2.04e-3 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9385 | 0.9388 | 0.9385 | -2.89e-4 | 0.5810 | 0.5821 | 0.5810 | -1.04e-3 | 0.2924 | 0.2924 | 0.2924 | -8.98e-5 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9639 | 0.9639 | 0.9639 | -3.62e-5 | 0.7613 | 0.7617 | 0.7613 | -4.26e-4 | 0.6069 | 0.6078 | 0.6069 | -9.40e-4 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9524 | 0.9529 | 0.9524 | -5.33e-4 | 0.6651 | 0.6673 | 0.6651 | -2.19e-3 | 0.4409 | 0.4406 | 0.4409 | 2.81e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -3.29e-7 | 0.9999 | 0.9999 | 0.9999 | -2.96e-6 | 0.9996 | 0.9996 | 0.9996 | -8.23e-6 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -3.29e-7 | 0.9999 | 0.9999 | 0.9999 | -2.96e-6 | 0.9996 | 0.9996 | 0.9996 | -8.23e-6 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9935 | 0.9936 | 0.9935 | -5.40e-5 | 0.9428 | 0.9433 | 0.9428 | -4.70e-4 | 0.8462 | 0.8474 | 0.8462 | -1.22e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9886 | 0.9887 | 0.9886 | -1.21e-4 | 0.9006 | 0.9017 | 0.9006 | -1.02e-3 | 0.7411 | 0.7435 | 0.7411 | -2.46e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9868 | 0.9869 | 0.9868 | -9.54e-5 | 0.8850 | 0.8858 | 0.8850 | -8.14e-4 | 0.6990 | 0.7010 | 0.6990 | -2.02e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9912 | 0.9912 | 0.9912 | 1.94e-5 | 0.9226 | 0.9224 | 0.9226 | 1.70e-4 | 0.7954 | 0.7949 | 0.7954 | 4.47e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -2.80e-6 | 0.9965 | 0.9965 | 0.9965 | -2.51e-5 | 0.9902 | 0.9903 | 0.9902 | -6.89e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -2.80e-6 | 0.9965 | 0.9965 | 0.9965 | -2.51e-5 | 0.9902 | 0.9903 | 0.9902 | -6.89e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9925 | 0.9926 | 0.9925 | -6.11e-5 | 0.9341 | 0.9347 | 0.9341 | -5.28e-4 | 0.8243 | 0.8257 | 0.8243 | -1.35e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9834 | 0.9835 | 0.9834 | -1.17e-4 | 0.8580 | 0.8589 | 0.8580 | -9.54e-4 | 0.6424 | 0.6445 | 0.6424 | -2.16e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9881 | 0.9881 | -2.38e-5 | 0.8958 | 0.8960 | 0.8958 | -2.01e-4 | 0.7259 | 0.7264 | 0.7259 | -4.90e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9872 | 0.9872 | 0.9872 | -3.69e-5 | 0.8897 | 0.8900 | 0.8897 | -3.02e-4 | 0.7188 | 0.7195 | 0.7188 | -6.89e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.66e-8 | 1.0000 | 1.0000 | 1.0000 | -1.49e-7 | 1.0000 | 1.0000 | 1.0000 | -4.15e-7 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -1.66e-8 | 1.0000 | 1.0000 | 1.0000 | -1.49e-7 | 1.0000 | 1.0000 | 1.0000 | -4.15e-7 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9929 | 0.9930 | 0.9929 | -5.97e-5 | 0.9373 | 0.9379 | 0.9373 | -5.18e-4 | 0.8321 | 0.8334 | 0.8321 | -1.34e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9878 | 0.9879 | 0.9878 | -1.30e-4 | 0.8936 | 0.8947 | 0.8936 | -1.09e-3 | 0.7240 | 0.7266 | 0.7240 | -2.59e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9859 | 0.9860 | 0.9859 | -1.04e-4 | 0.8771 | 0.8780 | 0.8771 | -8.79e-4 | 0.6799 | 0.6821 | 0.6799 | -2.16e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9905 | 0.9905 | 0.9905 | 1.94e-5 | 0.9171 | 0.9169 | 0.9171 | 1.70e-4 | 0.7816 | 0.7812 | 0.7816 | 4.47e-4 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -2.89e-6 | 0.9967 | 0.9968 | 0.9967 | -2.58e-5 | 0.9910 | 0.9911 | 0.9910 | -7.07e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -2.89e-6 | 0.9967 | 0.9968 | 0.9967 | -2.58e-5 | 0.9910 | 0.9911 | 0.9910 | -7.07e-5 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9935 | 0.9935 | 0.9935 | -5.25e-5 | 0.9425 | 0.9429 | 0.9425 | -4.56e-4 | 0.8458 | 0.8470 | 0.8458 | -1.18e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9846 | 0.9847 | 0.9846 | -1.05e-4 | 0.8680 | 0.8688 | 0.8680 | -8.60e-4 | 0.6652 | 0.6671 | 0.6652 | -1.98e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9893 | 0.9894 | 0.9893 | -1.04e-4 | 0.9060 | 0.9069 | 0.9060 | -8.99e-4 | 0.7513 | 0.7536 | 0.7513 | -2.31e-3 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9883 | 0.9881 | 0.9883 | 1.72e-4 | 0.8990 | 0.8976 | 0.8990 | 1.42e-3 | 0.7408 | 0.7375 | 0.7408 | 3.27e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9940 | 0.9941 | 0.9940 | -1.44e-4 | 0.9470 | 0.9483 | 0.9470 | -1.24e-3 | 0.8587 | 0.8618 | 0.8587 | -3.11e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9940 | 0.9941 | 0.9940 | -1.44e-4 | 0.9470 | 0.9483 | 0.9470 | -1.24e-3 | 0.8587 | 0.8618 | 0.8587 | -3.11e-3 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9905 | 0.9905 | 0.9905 | -5.79e-5 | 0.9179 | 0.9184 | 0.9179 | -4.43e-4 | 0.7899 | 0.7907 | 0.7899 | -8.73e-4 |
| nikon-z-24-70f4s-wide-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9828 | 0.9828 | 0.9828 | 6.30e-6 | 0.8540 | 0.8539 | 0.8540 | 7.68e-5 | 0.6423 | 0.6420 | 0.6423 | 3.27e-4 |
| nikon-z-24-70f4s-wide-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9495 | 0.9495 | 0.9495 | -1.60e-5 | 0.6027 | 0.6026 | 0.6027 | 4.56e-5 | 0.1434 | 0.1428 | 0.1434 | 5.41e-4 |
| nikon-z-24-70f4s-wide-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7678 | 0.7685 | 0.7678 | -6.71e-4 | 0.3938 | 0.3945 | 0.3938 | -6.29e-4 | 0.3643 | 0.3646 | 0.3643 | -2.43e-4 |
| nikon-z-24-70f4s-wide-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9940 | 0.9942 | 0.9940 | -1.48e-4 | 0.9473 | 0.9486 | 0.9473 | -1.25e-3 | 0.8606 | 0.8636 | 0.8606 | -3.04e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9940 | 0.9942 | 0.9940 | -1.48e-4 | 0.9473 | 0.9486 | 0.9473 | -1.25e-3 | 0.8606 | 0.8636 | 0.8606 | -3.04e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9855 | 0.9856 | 0.9855 | -8.85e-5 | 0.8807 | 0.8814 | 0.8807 | -6.38e-4 | 0.7190 | 0.7202 | 0.7190 | -1.12e-3 |
| nikon-z-24-70f4s-wide-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9690 | 0.9690 | 0.9690 | -2.39e-5 | 0.7541 | 0.7542 | 0.7541 | -6.96e-5 | 0.4563 | 0.4561 | 0.4563 | 1.90e-4 |
| nikon-z-24-70f4s-wide-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9518 | 0.9518 | 0.9518 | 4.57e-6 | 0.6211 | 0.6209 | 0.6211 | 1.78e-4 | 0.1856 | 0.1849 | 0.1856 | 7.17e-4 |
| nikon-z-24-70f4s-wide-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7277 | 0.7285 | 0.7277 | -8.38e-4 | 0.2509 | 0.2515 | 0.2509 | -5.80e-4 | 0.1627 | 0.1651 | 0.1627 | -2.44e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -2.77e-5 | 0.9911 | 0.9914 | 0.9911 | -2.47e-4 | 0.9755 | 0.9762 | 0.9755 | -6.73e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -2.77e-5 | 0.9911 | 0.9914 | 0.9911 | -2.47e-4 | 0.9755 | 0.9762 | 0.9755 | -6.73e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9963 | 0.9963 | 0.9963 | -5.10e-5 | 0.9667 | 0.9671 | 0.9667 | -4.49e-4 | 0.9095 | 0.9107 | 0.9095 | -1.19e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -8.54e-6 | 0.9952 | 0.9953 | 0.9952 | -7.65e-5 | 0.9868 | 0.9870 | 0.9868 | -2.11e-4 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9399 | 0.9401 | 0.9399 | -1.90e-4 | 0.5336 | 0.5348 | 0.5336 | -1.20e-3 | 0.0378 | 0.0391 | 0.0378 | -1.33e-3 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9075 | 0.9088 | 0.9075 | -1.31e-3 | 0.5801 | 0.5813 | 0.5801 | -1.15e-3 | 0.4266 | 0.4281 | 0.4266 | -1.49e-3 |
| nikon-z-24-70f4s-wide-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9993 | 0.9992 | -2.20e-5 | 0.9931 | 0.9933 | 0.9931 | -1.97e-4 | 0.9811 | 0.9816 | 0.9811 | -5.38e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9993 | 0.9992 | -2.20e-5 | 0.9931 | 0.9933 | 0.9931 | -1.97e-4 | 0.9811 | 0.9816 | 0.9811 | -5.38e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9970 | 0.9971 | 0.9970 | -4.11e-5 | 0.9734 | 0.9738 | 0.9734 | -3.62e-4 | 0.9276 | 0.9285 | 0.9276 | -9.65e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9866 | 0.9866 | 0.9866 | 1.67e-5 | 0.8861 | 0.8860 | 0.8861 | 1.38e-4 | 0.7199 | 0.7196 | 0.7199 | 3.11e-4 |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9467 | 0.9469 | 0.9467 | -1.63e-4 | 0.5807 | 0.5818 | 0.5807 | -1.07e-3 | 0.1091 | 0.1105 | 0.1091 | -1.36e-3 |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8635 | 0.8646 | 0.8635 | -1.15e-3 | 0.3762 | 0.3768 | 0.3762 | -6.26e-4 | 0.2332 | 0.2342 | 0.2332 | -1.03e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -2.72e-6 | 0.9990 | 0.9990 | 0.9990 | -2.45e-5 | 0.9973 | 0.9973 | 0.9973 | -6.79e-5 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -2.72e-6 | 0.9990 | 0.9990 | 0.9990 | -2.45e-5 | 0.9973 | 0.9973 | 0.9973 | -6.79e-5 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -1.79e-5 | 0.9907 | 0.9909 | 0.9907 | -1.60e-4 | 0.9745 | 0.9749 | 0.9745 | -4.38e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -8.22e-6 | 0.9867 | 0.9868 | 0.9867 | -7.32e-5 | 0.9635 | 0.9637 | 0.9635 | -1.99e-4 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9531 | 0.9532 | 0.9531 | -1.45e-4 | 0.6231 | 0.6241 | 0.6231 | -1.00e-3 | 0.1670 | 0.1685 | 0.1670 | -1.48e-3 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9204 | 0.9217 | 0.9204 | -1.22e-3 | 0.6276 | 0.6288 | 0.6276 | -1.24e-3 | 0.4777 | 0.4797 | 0.4777 | -1.99e-3 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -3.14e-6 | 0.9987 | 0.9987 | 0.9987 | -2.82e-5 | 0.9964 | 0.9964 | 0.9964 | -7.81e-5 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -3.14e-6 | 0.9987 | 0.9987 | 0.9987 | -2.82e-5 | 0.9964 | 0.9964 | 0.9964 | -7.81e-5 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -1.72e-5 | 0.9909 | 0.9911 | 0.9909 | -1.53e-4 | 0.9749 | 0.9754 | 0.9749 | -4.19e-4 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9853 | 0.9853 | 0.9853 | 1.18e-5 | 0.8755 | 0.8754 | 0.8755 | 9.55e-5 | 0.6950 | 0.6948 | 0.6950 | 2.04e-4 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9572 | 0.9573 | 0.9572 | -1.28e-4 | 0.6535 | 0.6544 | 0.6535 | -9.01e-4 | 0.2231 | 0.2245 | 0.2231 | -1.40e-3 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8727 | 0.8738 | 0.8727 | -1.08e-3 | 0.3971 | 0.3978 | 0.3971 | -6.80e-4 | 0.2514 | 0.2525 | 0.2514 | -1.08e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9986 | 0.9987 | 0.9986 | -1.13e-4 | 0.9879 | 0.9889 | 0.9879 | -1.00e-3 | 0.9673 | 0.9700 | 0.9673 | -2.67e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9986 | 0.9987 | 0.9986 | -1.13e-4 | 0.9879 | 0.9889 | 0.9879 | -1.00e-3 | 0.9673 | 0.9700 | 0.9673 | -2.67e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9443 | 0.9460 | 0.9443 | -1.73e-3 | 0.7269 | 0.7277 | 0.7269 | -8.03e-4 | 0.6074 | 0.6095 | 0.6074 | -2.05e-3 |
| nikon-z-24-70f4s-tele-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9684 | 0.9690 | 0.9684 | -5.84e-4 | 0.8140 | 0.8155 | 0.8140 | -1.43e-3 | 0.6845 | 0.6854 | 0.6845 | -9.29e-4 |
| nikon-z-24-70f4s-tele-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6526 | 0.6526 | 0.6526 | -4.37e-5 | 0.4690 | 0.4679 | 0.4690 | 1.02e-3 | 0.3748 | 0.3744 | 0.3748 | 4.59e-4 |
| nikon-z-24-70f4s-tele-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9467 | 0.9468 | 0.9467 | -3.96e-5 | 0.6408 | 0.6408 | 0.6408 | -2.45e-5 | 0.3620 | 0.3617 | 0.3620 | 3.29e-4 |
| nikon-z-24-70f4s-tele-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9982 | 0.9981 | -8.21e-5 | 0.9830 | 0.9837 | 0.9830 | -7.09e-4 | 0.9544 | 0.9562 | 0.9544 | -1.81e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9981 | 0.9982 | 0.9981 | -8.21e-5 | 0.9830 | 0.9837 | 0.9830 | -7.09e-4 | 0.9544 | 0.9562 | 0.9544 | -1.81e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9457 | 0.9488 | 0.9457 | -3.18e-3 | 0.7199 | 0.7256 | 0.7199 | -5.69e-3 | 0.5883 | 0.5884 | 0.5883 | -1.69e-4 |
| nikon-z-24-70f4s-tele-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9579 | 0.9552 | 0.9579 | 2.68e-3 | 0.7926 | 0.7921 | 0.7926 | 5.12e-4 | 0.6494 | 0.6477 | 0.6494 | 1.69e-3 |
| nikon-z-24-70f4s-tele-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.6665 | 0.6666 | 0.6665 | -1.10e-4 | 0.4821 | 0.4822 | 0.4821 | -1.05e-4 | 0.3963 | 0.3963 | 0.3963 | -1.03e-5 |
| nikon-z-24-70f4s-tele-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9135 | 0.9136 | 0.9135 | -1.16e-4 | 0.5438 | 0.5439 | 0.5438 | -5.30e-5 | 0.2477 | 0.2476 | 0.2477 | 9.10e-5 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | -1.87e-5 | 0.9921 | 0.9923 | 0.9921 | -1.67e-4 | 0.9782 | 0.9786 | 0.9782 | -4.58e-4 |
| nikon-z-24-70f4s-tele-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | -1.87e-5 | 0.9921 | 0.9923 | 0.9921 | -1.67e-4 | 0.9782 | 0.9786 | 0.9782 | -4.58e-4 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9987 | 0.9987 | 0.9987 | -4.39e-5 | 0.9882 | 0.9886 | 0.9882 | -3.88e-4 | 0.9679 | 0.9689 | 0.9679 | -1.04e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9949 | 0.9949 | 0.9949 | -6.17e-5 | 0.9547 | 0.9552 | 0.9547 | -5.36e-4 | 0.8779 | 0.8793 | 0.8779 | -1.38e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9879 | 0.9882 | 0.9879 | -2.96e-4 | 0.8980 | 0.9003 | 0.8980 | -2.29e-3 | 0.7486 | 0.7533 | 0.7486 | -4.66e-3 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9855 | 0.9862 | 0.9855 | -6.58e-4 | 0.8906 | 0.8944 | 0.8906 | -3.76e-3 | 0.7669 | 0.7705 | 0.7669 | -3.61e-3 |
| nikon-z-24-70f4s-tele-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9984 | 0.9985 | 0.9984 | -2.62e-5 | 0.9860 | 0.9862 | 0.9860 | -2.33e-4 | 0.9617 | 0.9623 | 0.9617 | -6.30e-4 |
| nikon-z-24-70f4s-tele-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9984 | 0.9985 | 0.9984 | -2.62e-5 | 0.9860 | 0.9862 | 0.9860 | -2.33e-4 | 0.9617 | 0.9623 | 0.9617 | -6.30e-4 |
| nikon-z-24-70f4s-tele-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9986 | 0.9985 | -5.01e-5 | 0.9867 | 0.9871 | 0.9867 | -4.42e-4 | 0.9638 | 0.9650 | 0.9638 | -1.18e-3 |
| nikon-z-24-70f4s-tele-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9946 | 0.9946 | 0.9946 | -5.98e-5 | 0.9521 | 0.9526 | 0.9521 | -5.15e-4 | 0.8723 | 0.8736 | 0.8723 | -1.31e-3 |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9896 | 0.9899 | 0.9896 | -2.60e-4 | 0.9117 | 0.9138 | 0.9117 | -2.04e-3 | 0.7805 | 0.7848 | 0.7805 | -4.29e-3 |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9590 | 0.9603 | 0.9590 | -1.21e-3 | 0.7472 | 0.7507 | 0.7472 | -3.46e-3 | 0.5305 | 0.5329 | 0.5305 | -2.40e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -8.84e-7 | 0.9995 | 0.9995 | 0.9995 | -7.95e-6 | 0.9985 | 0.9985 | 0.9985 | -2.21e-5 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -8.84e-7 | 0.9995 | 0.9995 | 0.9995 | -7.95e-6 | 0.9985 | 0.9985 | 0.9985 | -2.21e-5 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9991 | 0.9990 | -7.04e-6 | 0.9914 | 0.9915 | 0.9914 | -6.29e-5 | 0.9764 | 0.9765 | 0.9764 | -1.72e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9979 | 0.9979 | 0.9979 | -3.40e-5 | 0.9808 | 0.9811 | 0.9808 | -3.01e-4 | 0.9476 | 0.9484 | 0.9476 | -8.07e-4 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9892 | 0.9894 | 0.9892 | -2.15e-4 | 0.9071 | 0.9088 | 0.9071 | -1.74e-3 | 0.7636 | 0.7674 | 0.7636 | -3.83e-3 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9851 | 0.9859 | 0.9851 | -7.75e-4 | 0.8936 | 0.8978 | 0.8936 | -4.14e-3 | 0.7895 | 0.7931 | 0.7895 | -3.62e-3 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -1.25e-6 | 0.9985 | 0.9985 | 0.9985 | -1.11e-5 | 0.9958 | 0.9959 | 0.9958 | -3.06e-5 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -1.25e-6 | 0.9985 | 0.9985 | 0.9985 | -1.11e-5 | 0.9958 | 0.9959 | 0.9958 | -3.06e-5 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9991 | 0.9991 | 0.9991 | -2.96e-6 | 0.9916 | 0.9917 | 0.9916 | -2.65e-5 | 0.9769 | 0.9770 | 0.9769 | -7.25e-5 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9976 | 0.9977 | 0.9976 | -3.39e-5 | 0.9789 | 0.9792 | 0.9789 | -2.99e-4 | 0.9428 | 0.9436 | 0.9428 | -7.94e-4 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9905 | 0.9907 | 0.9905 | -1.65e-4 | 0.9176 | 0.9190 | 0.9176 | -1.35e-3 | 0.7880 | 0.7911 | 0.7880 | -3.10e-3 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9540 | 0.9554 | 0.9540 | -1.38e-3 | 0.7255 | 0.7290 | 0.7255 | -3.54e-3 | 0.4928 | 0.4952 | 0.4928 | -2.42e-3 |
| nikon-z-mc-105f28-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9986 | 0.9987 | 0.9986 | -9.72e-5 | 0.9871 | 0.9880 | 0.9871 | -8.57e-4 | 0.9650 | 0.9673 | 0.9650 | -2.28e-3 |
| nikon-z-mc-105f28-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9986 | 0.9987 | 0.9986 | -9.72e-5 | 0.9871 | 0.9880 | 0.9871 | -8.57e-4 | 0.9650 | 0.9673 | 0.9650 | -2.28e-3 |
| nikon-z-mc-105f28-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9975 | 0.9975 | 0.9975 | 2.10e-5 | 0.9779 | 0.9777 | 0.9779 | 1.86e-4 | 0.9395 | 0.9390 | 0.9395 | 5.01e-4 |
| nikon-z-mc-105f28-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9927 | 0.9927 | 0.9927 | 5.06e-5 | 0.9394 | 0.9390 | 0.9394 | 4.51e-4 | 0.8554 | 0.8542 | 0.8554 | 1.17e-3 |
| nikon-z-mc-105f28-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9058 | 0.9051 | 0.9058 | 7.16e-4 | 0.5517 | 0.5497 | 0.5517 | 2.02e-3 | 0.4838 | 0.4835 | 0.4838 | 3.01e-4 |
| nikon-z-mc-105f28-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9376 | 0.9377 | 0.9376 | -1.08e-4 | 0.5719 | 0.5722 | 0.5719 | -3.16e-4 | 0.3486 | 0.3478 | 0.3486 | 7.99e-4 |
| nikon-z-mc-105f28-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9961 | 0.9959 | -1.28e-4 | 0.9663 | 0.9672 | 0.9663 | -9.50e-4 | 0.9178 | 0.9197 | 0.9178 | -1.92e-3 |
| nikon-z-mc-105f28-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9961 | 0.9959 | -1.28e-4 | 0.9663 | 0.9672 | 0.9663 | -9.50e-4 | 0.9178 | 0.9197 | 0.9178 | -1.92e-3 |
| nikon-z-mc-105f28-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9969 | 0.9969 | 0.9969 | 8.08e-7 | 0.9731 | 0.9730 | 0.9731 | 5.03e-5 | 0.9305 | 0.9302 | 0.9305 | 2.68e-4 |
| nikon-z-mc-105f28-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9874 | 0.9874 | 0.9874 | 1.20e-5 | 0.8973 | 0.8970 | 0.8973 | 2.61e-4 | 0.7623 | 0.7613 | 0.7623 | 1.04e-3 |
| nikon-z-mc-105f28-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9082 | 0.9077 | 0.9082 | 4.80e-4 | 0.5383 | 0.5371 | 0.5383 | 1.18e-3 | 0.4482 | 0.4485 | 0.4482 | -2.28e-4 |
| nikon-z-mc-105f28-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9115 | 0.9117 | 0.9115 | -1.70e-4 | 0.4508 | 0.4513 | 0.4508 | -4.73e-4 | 0.2220 | 0.2217 | 0.2220 | 2.56e-4 |
| nikon-z-mc-105f28-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9997 | 0.9997 | 0.9997 | -7.97e-6 | 0.9970 | 0.9971 | 0.9970 | -7.15e-5 | 0.9918 | 0.9920 | 0.9918 | -1.98e-4 |
| nikon-z-mc-105f28-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9997 | 0.9997 | 0.9997 | -7.97e-6 | 0.9970 | 0.9971 | 0.9970 | -7.15e-5 | 0.9918 | 0.9920 | 0.9918 | -1.98e-4 |
| nikon-z-mc-105f28-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 1.07e-6 | 0.9989 | 0.9989 | 0.9989 | 9.58e-6 | 0.9971 | 0.9970 | 0.9971 | 2.66e-5 |
| nikon-z-mc-105f28-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9998 | 0.9998 | 0.9998 | -3.92e-6 | 0.9979 | 0.9980 | 0.9979 | -3.52e-5 | 0.9943 | 0.9944 | 0.9943 | -9.74e-5 |
| nikon-z-mc-105f28-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9945 | 0.9946 | 0.9945 | -1.02e-4 | 0.9520 | 0.9529 | 0.9520 | -8.75e-4 | 0.8730 | 0.8752 | 0.8730 | -2.20e-3 |
| nikon-z-mc-105f28-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9675 | 0.9679 | 0.9675 | -4.02e-4 | 0.7418 | 0.7445 | 0.7418 | -2.63e-3 | 0.4536 | 0.4562 | 0.4536 | -2.66e-3 |
| nikon-z-mc-105f28-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9983 | 0.9983 | 0.9983 | -2.29e-5 | 0.9847 | 0.9849 | 0.9847 | -2.03e-4 | 0.9583 | 0.9589 | 0.9583 | -5.44e-4 |
| nikon-z-mc-105f28-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9983 | 0.9983 | 0.9983 | -2.29e-5 | 0.9847 | 0.9849 | 0.9847 | -2.03e-4 | 0.9583 | 0.9589 | 0.9583 | -5.44e-4 |
| nikon-z-mc-105f28-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -6.59e-6 | 0.9951 | 0.9952 | 0.9951 | -5.89e-5 | 0.9865 | 0.9866 | 0.9865 | -1.61e-4 |
| nikon-z-mc-105f28-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9958 | 0.9958 | 0.9958 | -7.97e-6 | 0.9624 | 0.9625 | 0.9624 | -7.03e-5 | 0.8985 | 0.8986 | 0.8985 | -1.88e-4 |
| nikon-z-mc-105f28-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9929 | 0.9931 | 0.9929 | -1.18e-4 | 0.9384 | 0.9394 | 0.9384 | -9.97e-4 | 0.8390 | 0.8415 | 0.8390 | -2.44e-3 |
| nikon-z-mc-105f28-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9494 | 0.9500 | 0.9494 | -5.85e-4 | 0.6262 | 0.6294 | 0.6262 | -3.16e-3 | 0.2888 | 0.2906 | 0.2888 | -1.83e-3 |
| nikon-z-mc-105f28-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -5.66e-7 | 0.9998 | 0.9998 | 0.9998 | -5.10e-6 | 0.9994 | 0.9994 | 0.9994 | -1.41e-5 |
| nikon-z-mc-105f28-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -5.66e-7 | 0.9998 | 0.9998 | 0.9998 | -5.10e-6 | 0.9994 | 0.9994 | 0.9994 | -1.41e-5 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9993 | 0.9993 | 0.9993 | 6.29e-7 | 0.9933 | 0.9933 | 0.9933 | 5.60e-6 | 0.9815 | 0.9815 | 0.9815 | 1.54e-5 |
| nikon-z-mc-105f28-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -3.28e-7 | 0.9997 | 0.9997 | 0.9997 | -2.95e-6 | 0.9991 | 0.9991 | 0.9991 | -8.20e-6 |
| nikon-z-mc-105f28-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9967 | 0.9967 | 0.9967 | -7.01e-5 | 0.9705 | 0.9711 | 0.9705 | -6.10e-4 | 0.9207 | 0.9223 | 0.9207 | -1.58e-3 |
| nikon-z-mc-105f28-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9603 | 0.9608 | 0.9603 | -4.75e-4 | 0.6916 | 0.6945 | 0.6916 | -2.93e-3 | 0.3804 | 0.3824 | 0.3804 | -2.06e-3 |
| nikon-z-mc-105f28-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -4.10e-6 | 0.9953 | 0.9953 | 0.9953 | -3.67e-5 | 0.9870 | 0.9871 | 0.9870 | -1.01e-4 |
| nikon-z-mc-105f28-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9995 | 0.9995 | 0.9995 | -4.10e-6 | 0.9953 | 0.9953 | 0.9953 | -3.67e-5 | 0.9870 | 0.9871 | 0.9870 | -1.01e-4 |
| nikon-z-mc-105f28-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | -3.87e-6 | 0.9888 | 0.9889 | 0.9888 | -3.44e-5 | 0.9693 | 0.9694 | 0.9693 | -9.29e-5 |
| nikon-z-mc-105f28-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9963 | 0.9963 | 0.9963 | -1.54e-6 | 0.9674 | 0.9674 | 0.9674 | -1.26e-5 | 0.9124 | 0.9124 | 0.9124 | -2.83e-5 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9972 | 0.9973 | 0.9972 | -5.58e-5 | 0.9755 | 0.9760 | 0.9755 | -4.88e-4 | 0.9341 | 0.9354 | 0.9341 | -1.28e-3 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9322 | 0.9329 | 0.9322 | -7.59e-4 | 0.5252 | 0.5287 | 0.5252 | -3.50e-3 | 0.1954 | 0.1956 | 0.1954 | -2.16e-4 |
| nikon-z-135f18-plena-best-ref | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9944 | 0.9945 | 0.9944 | -1.28e-4 | 0.9502 | 0.9513 | 0.9502 | -1.10e-3 | 0.8669 | 0.8697 | 0.8669 | -2.78e-3 |
| nikon-z-135f18-plena-best-ref | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.9944 | 0.9945 | 0.9944 | -1.28e-4 | 0.9502 | 0.9513 | 0.9502 | -1.10e-3 | 0.8669 | 0.8697 | 0.8669 | -2.78e-3 |
| nikon-z-135f18-plena-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9908 | 0.9909 | 0.9908 | -1.55e-4 | 0.9227 | 0.9239 | 0.9227 | -1.21e-3 | 0.8125 | 0.8150 | 0.8125 | -2.48e-3 |
| nikon-z-135f18-plena-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9930 | 0.9932 | 0.9930 | -1.64e-4 | 0.9446 | 0.9457 | 0.9446 | -1.07e-3 | 0.8780 | 0.8795 | 0.8780 | -1.47e-3 |
| nikon-z-135f18-plena-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9630 | 0.9636 | 0.9630 | -5.86e-4 | 0.7262 | 0.7297 | 0.7262 | -3.51e-3 | 0.4647 | 0.4688 | 0.4647 | -4.08e-3 |
| nikon-z-135f18-plena-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8865 | 0.8849 | 0.8865 | 1.58e-3 | 0.5285 | 0.5274 | 0.5285 | 1.11e-3 | 0.4262 | 0.4238 | 0.4262 | 2.45e-3 |
| nikon-z-135f18-plena-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9944 | 0.9945 | 0.9944 | -1.33e-4 | 0.9505 | 0.9516 | 0.9505 | -1.13e-3 | 0.8689 | 0.8717 | 0.8689 | -2.79e-3 |
| nikon-z-135f18-plena-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.9944 | 0.9945 | 0.9944 | -1.33e-4 | 0.9505 | 0.9516 | 0.9505 | -1.13e-3 | 0.8689 | 0.8717 | 0.8689 | -2.79e-3 |
| nikon-z-135f18-plena-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9895 | 0.9897 | 0.9895 | -1.61e-4 | 0.9133 | 0.9145 | 0.9133 | -1.20e-3 | 0.7946 | 0.7968 | 0.7946 | -2.26e-3 |
| nikon-z-135f18-plena-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9900 | 0.9901 | 0.9900 | -7.31e-5 | 0.9234 | 0.9239 | 0.9234 | -4.94e-4 | 0.8407 | 0.8416 | 0.8407 | -8.80e-4 |
| nikon-z-135f18-plena-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9574 | 0.9576 | 0.9574 | -2.32e-4 | 0.6954 | 0.6973 | 0.6954 | -1.82e-3 | 0.4346 | 0.4378 | 0.4346 | -3.16e-3 |
| nikon-z-135f18-plena-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8597 | 0.8587 | 0.8597 | 1.01e-3 | 0.4892 | 0.4877 | 0.4892 | 1.50e-3 | 0.3775 | 0.3787 | 0.3775 | -1.21e-3 |
| nikon-z-135f18-plena-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -3.86e-7 | 0.9999 | 0.9999 | 0.9999 | -3.47e-6 | 0.9997 | 0.9997 | 0.9997 | -9.64e-6 |
| nikon-z-135f18-plena-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -3.86e-7 | 0.9999 | 0.9999 | 0.9999 | -3.47e-6 | 0.9997 | 0.9997 | 0.9997 | -9.64e-6 |
| nikon-z-135f18-plena-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | -8.47e-6 | 0.9889 | 0.9889 | 0.9889 | -7.58e-5 | 0.9693 | 0.9695 | 0.9693 | -2.08e-4 |
| nikon-z-135f18-plena-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9994 | 0.9994 | 0.9994 | -3.00e-6 | 0.9947 | 0.9947 | 0.9947 | -2.69e-5 | 0.9852 | 0.9853 | 0.9852 | -7.44e-5 |
| nikon-z-135f18-plena-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9943 | 0.9943 | 0.9943 | -4.35e-5 | 0.9490 | 0.9494 | 0.9490 | -3.80e-4 | 0.8624 | 0.8634 | 0.8624 | -9.95e-4 |
| nikon-z-135f18-plena-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9972 | 0.9972 | 0.9972 | -2.61e-5 | 0.9747 | 0.9749 | 0.9747 | -2.31e-4 | 0.9307 | 0.9313 | 0.9307 | -6.19e-4 |
| nikon-z-135f18-plena-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -7.43e-7 | 0.9995 | 0.9995 | 0.9995 | -6.67e-6 | 0.9985 | 0.9985 | 0.9985 | -1.84e-5 |
| nikon-z-135f18-plena-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -7.43e-7 | 0.9995 | 0.9995 | 0.9995 | -6.67e-6 | 0.9985 | 0.9985 | 0.9985 | -1.84e-5 |
| nikon-z-135f18-plena-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9988 | 0.9988 | 0.9988 | -8.24e-6 | 0.9888 | 0.9889 | 0.9888 | -7.36e-5 | 0.9692 | 0.9694 | 0.9692 | -2.02e-4 |
| nikon-z-135f18-plena-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9990 | 0.9990 | 0.9990 | -2.83e-6 | 0.9913 | 0.9914 | 0.9913 | -2.53e-5 | 0.9761 | 0.9762 | 0.9761 | -6.97e-5 |
| nikon-z-135f18-plena-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9948 | 0.9949 | 0.9948 | -3.83e-5 | 0.9540 | 0.9544 | 0.9540 | -3.36e-4 | 0.8756 | 0.8765 | 0.8756 | -8.83e-4 |
| nikon-z-135f18-plena-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9953 | 0.9953 | 0.9953 | -2.23e-5 | 0.9584 | 0.9586 | 0.9584 | -1.96e-4 | 0.8878 | 0.8883 | 0.8878 | -5.18e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -5.12e-8 | 1.0000 | 1.0000 | 1.0000 | -4.61e-7 | 0.9999 | 0.9999 | 0.9999 | -1.28e-6 |
| nikon-z-135f18-plena-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 1.0000 | 1.0000 | 1.0000 | -5.12e-8 | 1.0000 | 1.0000 | 1.0000 | -4.61e-7 | 0.9999 | 0.9999 | 0.9999 | -1.28e-6 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9985 | 0.9985 | 0.9985 | -1.04e-5 | 0.9868 | 0.9869 | 0.9868 | -9.25e-5 | 0.9637 | 0.9639 | 0.9637 | -2.53e-4 |
| nikon-z-135f18-plena-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9992 | 0.9992 | 0.9992 | -4.20e-6 | 0.9932 | 0.9932 | 0.9932 | -3.77e-5 | 0.9812 | 0.9813 | 0.9812 | -1.04e-4 |
| nikon-z-135f18-plena-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9938 | 0.9938 | 0.9938 | -4.77e-5 | 0.9447 | 0.9451 | 0.9447 | -4.16e-4 | 0.8512 | 0.8523 | 0.8512 | -1.08e-3 |
| nikon-z-135f18-plena-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9968 | 0.9968 | 0.9968 | -2.95e-5 | 0.9714 | 0.9717 | 0.9714 | -2.61e-4 | 0.9220 | 0.9227 | 0.9220 | -6.96e-4 |
| nikon-z-135f18-plena-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -5.11e-7 | 0.9995 | 0.9995 | 0.9995 | -4.59e-6 | 0.9986 | 0.9987 | 0.9986 | -1.27e-5 |
| nikon-z-135f18-plena-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | -5.11e-7 | 0.9995 | 0.9995 | 0.9995 | -4.59e-6 | 0.9986 | 0.9987 | 0.9986 | -1.27e-5 |
| nikon-z-135f18-plena-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9986 | 0.9986 | 0.9986 | -9.49e-6 | 0.9875 | 0.9876 | 0.9875 | -8.47e-5 | 0.9655 | 0.9657 | 0.9655 | -2.32e-4 |
| nikon-z-135f18-plena-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9989 | 0.9989 | 0.9989 | -3.52e-6 | 0.9904 | 0.9905 | 0.9904 | -3.15e-5 | 0.9737 | 0.9738 | 0.9737 | -8.65e-5 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9945 | 0.9945 | 0.9945 | -4.10e-5 | 0.9512 | 0.9516 | 0.9512 | -3.59e-4 | 0.8683 | 0.8693 | 0.8683 | -9.41e-4 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9951 | 0.9951 | 0.9951 | -2.46e-5 | 0.9564 | 0.9566 | 0.9564 | -2.15e-4 | 0.8825 | 0.8830 | 0.8825 | -5.68e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9529 | 0.9547 | 0.9529 | -1.87e-3 | 0.7692 | 0.7723 | 0.7692 | -3.10e-3 | 0.7054 | 0.7061 | 0.7054 | -6.75e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9529 | 0.9547 | 0.9529 | -1.87e-3 | 0.7692 | 0.7723 | 0.7692 | -3.10e-3 | 0.7054 | 0.7061 | 0.7054 | -6.75e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9643 | 0.9647 | 0.9643 | -4.30e-4 | 0.7769 | 0.7775 | 0.7769 | -5.05e-4 | 0.6312 | 0.6306 | 0.6312 | 5.92e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9613 | 0.9615 | 0.9613 | -1.93e-4 | 0.7239 | 0.7235 | 0.7239 | 3.60e-4 | 0.4337 | 0.4334 | 0.4337 | 3.43e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7636 | 0.7634 | 0.7636 | 1.87e-4 | 0.3832 | 0.3822 | 0.3832 | 9.34e-4 | 0.2910 | 0.2906 | 0.2910 | 3.66e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8587 | 0.8597 | 0.8587 | -1.02e-3 | 0.2913 | 0.2924 | 0.2913 | -1.06e-3 | 0.0840 | 0.0829 | 0.0840 | 1.12e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9441 | 0.9461 | 0.9441 | -1.99e-3 | 0.7464 | 0.7489 | 0.7464 | -2.43e-3 | 0.6609 | 0.6626 | 0.6609 | -1.66e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9441 | 0.9461 | 0.9441 | -1.99e-3 | 0.7464 | 0.7489 | 0.7464 | -2.43e-3 | 0.6609 | 0.6626 | 0.6609 | -1.66e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9569 | 0.9573 | 0.9569 | -3.78e-4 | 0.7448 | 0.7449 | 0.7448 | -6.76e-5 | 0.5763 | 0.5771 | 0.5763 | -8.30e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9565 | 0.9564 | 0.9565 | 9.33e-5 | 0.7132 | 0.7119 | 0.7132 | 1.37e-3 | 0.4506 | 0.4503 | 0.4506 | 2.99e-4 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.7564 | 0.7584 | 0.7564 | -2.00e-3 | 0.3614 | 0.3628 | 0.3614 | -1.41e-3 | 0.2916 | 0.2904 | 0.2916 | 1.16e-3 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8418 | 0.8437 | 0.8418 | -1.97e-3 | 0.2991 | 0.3015 | 0.2991 | -2.44e-3 | 0.0594 | 0.0604 | 0.0594 | -9.65e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -2.96e-5 | 0.9819 | 0.9821 | 0.9819 | -2.64e-4 | 0.9503 | 0.9510 | 0.9503 | -7.13e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9980 | 0.9980 | 0.9980 | -2.96e-5 | 0.9819 | 0.9821 | 0.9819 | -2.64e-4 | 0.9503 | 0.9510 | 0.9503 | -7.13e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9881 | 0.9882 | 0.9881 | -8.65e-5 | 0.8965 | 0.8972 | 0.8965 | -7.30e-4 | 0.7304 | 0.7322 | 0.7304 | -1.77e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9930 | 0.9931 | 0.9930 | -7.93e-5 | 0.9382 | 0.9389 | 0.9382 | -6.84e-4 | 0.8357 | 0.8374 | 0.8357 | -1.73e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9967 | 0.9967 | 0.9967 | -9.70e-7 | 0.9710 | 0.9710 | 0.9710 | -9.10e-6 | 0.9225 | 0.9225 | 0.9225 | -2.63e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9637 | 0.9635 | 0.9637 | 1.83e-4 | 0.7054 | 0.7041 | 0.7054 | 1.36e-3 | 0.3544 | 0.3521 | 0.3544 | 2.23e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9973 | 0.9973 | 0.9973 | -3.79e-5 | 0.9760 | 0.9763 | 0.9760 | -3.34e-4 | 0.9348 | 0.9357 | 0.9348 | -8.89e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9973 | 0.9973 | 0.9973 | -3.79e-5 | 0.9760 | 0.9763 | 0.9760 | -3.34e-4 | 0.9348 | 0.9357 | 0.9348 | -8.89e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9867 | 0.9868 | 0.9867 | -1.01e-4 | 0.8848 | 0.8856 | 0.8848 | -8.38e-4 | 0.7044 | 0.7063 | 0.7044 | -1.96e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9940 | 0.9941 | 0.9940 | -6.50e-5 | 0.9478 | 0.9484 | 0.9478 | -5.50e-4 | 0.8639 | 0.8652 | 0.8639 | -1.35e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9959 | 0.9958 | 0.9959 | 6.50e-5 | 0.9639 | 0.9633 | 0.9639 | 5.40e-4 | 0.9044 | 0.9031 | 0.9044 | 1.27e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9711 | 0.9705 | 0.9711 | 5.63e-4 | 0.7779 | 0.7749 | 0.7779 | 2.96e-3 | 0.5438 | 0.5426 | 0.5438 | 1.27e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 7.12e-8 | 0.9993 | 0.9993 | 0.9993 | 6.36e-7 | 0.9980 | 0.9980 | 0.9980 | 1.76e-6 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9999 | 0.9999 | 0.9999 | 7.12e-8 | 0.9993 | 0.9993 | 0.9993 | 6.36e-7 | 0.9980 | 0.9980 | 0.9980 | 1.76e-6 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9957 | 0.9957 | 0.9957 | -2.59e-5 | 0.9613 | 0.9616 | 0.9613 | -2.27e-4 | 0.8952 | 0.8958 | 0.8952 | -6.00e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9842 | 0.9844 | 0.9842 | -1.68e-4 | 0.8642 | 0.8655 | 0.8642 | -1.38e-3 | 0.6561 | 0.6592 | 0.6561 | -3.13e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9975 | 0.9975 | 0.9975 | -1.03e-5 | 0.9776 | 0.9776 | 0.9776 | -9.09e-5 | 0.9389 | 0.9391 | 0.9389 | -2.44e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9535 | 0.9533 | 0.9535 | 2.18e-4 | 0.6326 | 0.6310 | 0.6326 | 1.54e-3 | 0.2516 | 0.2498 | 0.2516 | 1.77e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.42e-6 | 0.9963 | 0.9963 | 0.9963 | -3.07e-5 | 0.9898 | 0.9899 | 0.9898 | -8.46e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9996 | 0.9996 | 0.9996 | -3.42e-6 | 0.9963 | 0.9963 | 0.9963 | -3.07e-5 | 0.9898 | 0.9899 | 0.9898 | -8.46e-5 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9951 | 0.9951 | 0.9951 | -3.26e-5 | 0.9567 | 0.9570 | 0.9567 | -2.83e-4 | 0.8836 | 0.8843 | 0.8836 | -7.31e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9860 | 0.9861 | 0.9860 | -1.46e-4 | 0.8803 | 0.8815 | 0.8803 | -1.17e-3 | 0.7015 | 0.7041 | 0.7015 | -2.59e-3 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9968 | 0.9968 | 0.9968 | -1.94e-5 | 0.9717 | 0.9719 | 0.9717 | -1.69e-4 | 0.9238 | 0.9243 | 0.9238 | -4.45e-4 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.9629 | 0.9622 | 0.9629 | 6.17e-4 | 0.7197 | 0.7169 | 0.7197 | 2.84e-3 | 0.4462 | 0.4463 | 0.4462 | -5.38e-5 |

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
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 1.47e-10 | 211 of 288 | nikkor-z50f12-best-ref | cut tangential, field 0, frequencyPerMm 100 |
| lv – optiland | phaseStep.waves [waves] | 2.48e1 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 987 |
| lv – optiland | convergence.maxAbs | 8.18e-2 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-ref | cut sagittal, field 3.19e1, frequencyPerMm 100 |
| lv – optiland | lattice.columns [cells] | 64 | 288 of 288 | canon-ef-135-f2l-usm-ref | — |
| lv – optiland | rays.compared [rays] | 3215828 | 288 of 288 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| lv – optiland | waveMtf.flagged | 4.02e-10 | 77 of 288 | nikkor-z50f12-best-ref | cut sagittal, field 2.29e1, frequencyPerMm 60 |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.02e-9 | 211 of 288 | nikon-z-24-70f4s-wide-f8-ref | cut tangential, field 4.33e1, frequencyPerMm 50 |
| lv – ref | phaseStep.waves [waves] | 2.48e1 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 987 |
| lv – ref | convergence.maxAbs | 8.18e-2 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-ref | cut sagittal, field 3.19e1, frequencyPerMm 100 |
| lv – ref | lattice.columns [cells] | 64 | 288 of 288 | canon-ef-135-f2l-usm-ref | — |
| lv – ref | rays.compared [rays] | 3215828 | 288 of 288 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| lv – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | waveMtf.flagged | 1.17e-9 | 77 of 288 | nikon-z-24-70f4s-wide-best-ref | cut tangential, field 4.33e1, frequencyPerMm 50 |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.03e-9 | 211 of 288 | nikon-z-24-70f4s-wide-f8-ref | cut tangential, field 4.33e1, frequencyPerMm 50 |
| optiland – ref | phaseStep.waves [waves] | 2.48e1 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 987 |
| optiland – ref | convergence.maxAbs | 8.18e-2 | 288 of 288 | sigma-35mm-f14-dg-hsm-a-ref | cut sagittal, field 3.19e1, frequencyPerMm 100 |
| optiland – ref | lattice.columns [cells] | 64 | 288 of 288 | canon-ef-135-f2l-usm-ref | — |
| optiland – ref | rays.compared [rays] | 3215828 | 288 of 288 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 288 of 288 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 288 of 288 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | waveMtf.flagged | 1.16e-9 | 77 of 288 | nikon-z-24-70f4s-wide-best-ref | cut tangential, field 4.33e1, frequencyPerMm 50 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: waveMtf.maxAbs 5.07e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.68e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.45e-12 (2 of 3) |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: waveMtf.maxAbs 3.18e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.94e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.46e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: waveMtf.maxAbs 6.37e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.78e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.23e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: waveMtf.maxAbs 1.04e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.59e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.42e-12 (1 of 3) |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: waveMtf.maxAbs 1.46e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.25e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (1 of 3) |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| nikkor-z50f12-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| nikkor-z50f12-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-20mm-f18-g-ref | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: waveMtf.maxAbs 8.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.22e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.11e-10 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: waveMtf.maxAbs 7.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.55e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: waveMtf.maxAbs 2.46e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.78e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: waveMtf.maxAbs 1.88e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.33e-11 (2 of 3) |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: waveMtf.maxAbs 1.89e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.25e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.10e-10 (1 of 3) |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: waveMtf.maxAbs 5.22e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.11e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.64e-11 (1 of 3) |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: waveMtf.maxAbs 1.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.12e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.14e-10 (2 of 3) |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: waveMtf.maxAbs 1.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.51e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (1 of 3) |
| nikon-z-mc-105f28-ref | 3 | PASS: waveMtf.maxAbs 2.79e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.52e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.39e-10 (2 of 3) |
| nikon-z-mc-105f28-photopic | 3 | PASS: waveMtf.maxAbs 1.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.13e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.16e-10 (2 of 3) |
| nikon-z-135f18-plena-ref | 3 | PASS: waveMtf.maxAbs 1.56e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.95e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.53e-11 (1 of 3) |
| nikon-z-135f18-plena-photopic | 3 | PASS: waveMtf.maxAbs 7.62e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.88e-11 (2 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: waveMtf.maxAbs 7.28e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.84e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.88e-10 (1 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: waveMtf.maxAbs 7.41e-12 (2 of 3) | PASS: waveMtf.maxAbs 8.67e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (2 of 3) |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: waveMtf.maxAbs 7.31e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.82e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.11e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: waveMtf.maxAbs 5.48e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.19e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: waveMtf.maxAbs 9.18e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.91e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 6.61e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.22e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.23e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: waveMtf.maxAbs 6.57e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.88e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.90e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: waveMtf.maxAbs 6.29e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.83e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.13e-12 (1 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: waveMtf.maxAbs 5.55e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.70e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.68e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: waveMtf.maxAbs 8.97e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.66e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.22e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: waveMtf.maxAbs 5.02e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.02e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.92e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 8.88e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.64e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.90e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: waveMtf.maxAbs 5.44e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.63e-11 (1 of 3) |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: waveMtf.maxAbs 9.66e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.22e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.40e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: waveMtf.maxAbs 6.70e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.01e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.07e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: waveMtf.maxAbs 7.93e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.15e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.41e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 5.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.33e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.90e-11 (3 of 3) |
| nikkor-z50f12-best-ref | 3 | PASS: waveMtf.maxAbs 1.47e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.77e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (1 of 3) |
| nikkor-z50f12-best-photopic | 3 | PASS: waveMtf.maxAbs 9.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.18e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.51e-10 (1 of 3) |
| nikkor-z50f12-f8-ref | 3 | PASS: waveMtf.maxAbs 5.75e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.82e-11 (3 of 3) |
| nikkor-z50f12-f8-photopic | 3 | PASS: waveMtf.maxAbs 5.54e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.27e-10 (3 of 3) |
| nikkor-z50f12-f8-best-ref | 3 | PASS: waveMtf.maxAbs 6.81e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.85e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.27e-11 (3 of 3) |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 3.34e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.22e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.65e-11 (3 of 3) |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: waveMtf.maxAbs 1.19e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.89e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.01e-10 (1 of 3) |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: waveMtf.maxAbs 4.46e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.43e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.41e-10 (1 of 3) |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: waveMtf.maxAbs 3.28e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.97e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.91e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.16e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.23e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.22e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: waveMtf.maxAbs 3.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.07e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.94e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.54e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.17e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.15e-10 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: waveMtf.maxAbs 2.40e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.12e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.24e-11 (2 of 3) |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: waveMtf.maxAbs 2.94e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.85e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.63e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: waveMtf.maxAbs 4.35e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.52e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.54e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: waveMtf.maxAbs 1.93e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.82e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.25e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.44e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: waveMtf.maxAbs 1.28e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.43e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: waveMtf.maxAbs 1.81e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.72e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: waveMtf.maxAbs 1.53e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.51e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.49e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.24e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.47e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: waveMtf.maxAbs 1.21e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.17e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.63e-12 (3 of 3) |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: waveMtf.maxAbs 2.64e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.01e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.92e-10 (2 of 3) |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: waveMtf.maxAbs 8.61e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.37e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.41e-10 (2 of 3) |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: waveMtf.maxAbs 3.86e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.02e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-9 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.32e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.35e-10 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: waveMtf.maxAbs 4.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.41e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.47e-10 (3 of 3) |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.38e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.86e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: waveMtf.maxAbs 8.19e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.73e-11 (2 of 3) |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: waveMtf.maxAbs 6.60e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.22e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.20e-10 (1 of 3) |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: waveMtf.maxAbs 1.59e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: waveMtf.maxAbs 6.91e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: waveMtf.maxAbs 1.46e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.93e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (3 of 3) |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (3 of 3) |
| nikon-z-mc-105f28-best-ref | 3 | PASS: waveMtf.maxAbs 5.56e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.23e-10 (2 of 3) |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: waveMtf.maxAbs 6.77e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.43e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.48e-10 (2 of 3) |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: waveMtf.maxAbs 1.54e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.13e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.42e-11 (3 of 3) |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.05e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.66e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-11 (3 of 3) |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: waveMtf.maxAbs 1.78e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.53e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.56e-12 (3 of 3) |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 1.28e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.23e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.70e-12 (3 of 3) |
| nikon-z-135f18-plena-best-ref | 3 | PASS: waveMtf.maxAbs 1.99e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.84e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.85e-11 (2 of 3) |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: waveMtf.maxAbs 2.79e-12 (2 of 3) | PASS: waveMtf.maxAbs 9.23e-12 (2 of 3) | PASS: waveMtf.maxAbs 7.39e-12 (2 of 3) |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: waveMtf.maxAbs 1.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.32e-10 (3 of 3) |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: waveMtf.maxAbs 1.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.38e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-10 (3 of 3) |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: waveMtf.maxAbs 8.48e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 9.54e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.39e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: waveMtf.maxAbs 7.33e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.05e-10 (1 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: waveMtf.maxAbs 3.12e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.69e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.67e-10 (1 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: waveMtf.maxAbs 6.72e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.64e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.64e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: waveMtf.maxAbs 3.61e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.65e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.63e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: waveMtf.maxAbs 5.98e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.60e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.59e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: waveMtf.maxAbs 4.72e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.97e-10 (3 of 3) |

## r6b

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – wave | mtfOnAxis.maxAbs | 5.42e-3 | 82 of 96 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 80 |
| lv – wave | mtfOffAxis.maxAbs | 5.75e-3 | 75 of 96 | nikon-z-24-70f4s-tele-ref | cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| lv – wave | mtfFlagged.maxAbs | 2.47e-2 | 42 of 96 | sigma-35mm-f14-dg-hsm-a-best-ref | cut tangential, field 1, frequencyPerMm 30 |
| lv – wave | fields.compared [elements] | 211 | 96 of 96 | — | — |
| lv – wave | fields.flagged [elements] | 77 | 96 of 96 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – wave |
|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | RECORDED: no judged figure |
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
| nikon-z-24-70f4s-tele-ref | 1 | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-photopic | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-ref | 1 | RECORDED: no judged figure |
| nikon-z-mc-105f28-photopic | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-ref | 1 | RECORDED: no judged figure |
| nikon-z-135f18-plena-photopic | 1 | RECORDED: no judged figure |
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
| nikon-z-24-70f4s-tele-best-ref | 1 | ATTENTION: no judged figure |
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

## r6c

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | chiefLanding.maxAbs [mm] | 1.52e-10 | 48 of 96 | nikon-z-mc-105f28-best-ref | field 1 |
| lv – optiland | mtfOnAxis.maxAbs | 2.62e-2 | 47 of 96 | sony-fe-20mm-f18-g-ref | cut tangential, field 0, frequencyPerMm 30 |
| lv – optiland | mtfOffAxis.maxAbs | 2.75e-1 | 43 of 96 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1, frequencyPerMm 50 |
| lv – optiland | fields.compared [elements] | 128 | 48 of 96 | — | — |
| lv – optiland | fields.flagged [elements] | 6 | 48 of 96 | — | — |
| lv – optiland | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| lv – optiland | fields.data [elements] | 0 | 48 of 96 | — | — |
| lv – optiland | fields.unavailable [elements] | 10 | 48 of 96 | — | — |
| lv – optiland | mtfFlagged.maxAbs | 4.91e-1 | 3 of 96 | sony-fe-20mm-f18-g-best-ref | cut tangential, field 1, frequencyPerMm 10 |
| lv – optiland-wave | chiefLanding.maxAbs [mm] | 1.52e-10 | 96 of 96 | nikon-z-mc-105f28-best-ref | field 1 |
| lv – optiland-wave | mtfOnAxis.maxAbs | 6.94e-3 | 96 of 96 | nikon-z-135f18-plena-ref | cut tangential, field 0, frequencyPerMm 100 |
| lv – optiland-wave | mtfOffAxis.maxAbs | 8.14e-3 | 91 of 96 | sigma-35mm-f14-dg-hsm-a-ref | cut sagittal, field 5.00e-1, frequencyPerMm 100 |
| lv – optiland-wave | fields.compared [elements] | 267 | 96 of 96 | — | — |
| lv – optiland-wave | fields.flagged [elements] | 21 | 96 of 96 | — | — |
| lv – optiland-wave | fields.rimLost [elements] | 0 | 96 of 96 | — | — |
| lv – optiland-wave | fields.data [elements] | 0 | 96 of 96 | — | — |
| lv – optiland-wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |
| lv – optiland-wave | mtfFlagged.maxAbs | 7.96e-3 | 16 of 96 | nikkor-z50f12-photopic | cut tangential, field 1, frequencyPerMm 20 |
| lv – wave | chiefLanding.maxAbs [mm] | 0 | 96 of 96 | canon-ef-135-f2l-usm-ref | field 0 |
| lv – wave | mtfOnAxis.maxAbs | 5.42e-3 | 82 of 96 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 0, frequencyPerMm 80 |
| lv – wave | mtfOffAxis.maxAbs | 5.75e-3 | 75 of 96 | nikon-z-24-70f4s-tele-ref | cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| lv – wave | mtfFlagged.maxAbs | 2.47e-2 | 42 of 96 | sigma-35mm-f14-dg-hsm-a-best-ref | cut tangential, field 1, frequencyPerMm 30 |
| lv – wave | fields.compared [elements] | 211 | 96 of 96 | — | — |
| lv – wave | fields.flagged [elements] | 77 | 96 of 96 | — | — |
| lv – wave | fields.rimLost [elements] | 0 | 96 of 96 | — | — |
| lv – wave | fields.data [elements] | 0 | 96 of 96 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |
| optiland – optiland-wave | chiefLanding.maxAbs [mm] | 0 | 48 of 96 | canon-ef-135-f2l-usm-ref | field 0 |
| optiland – optiland-wave | mtfOnAxis.maxAbs | 2.11e-2 | 47 of 96 | sony-fe-20mm-f18-g-ref | cut tangential, field 0, frequencyPerMm 30 |
| optiland – optiland-wave | mtfOffAxis.maxAbs | 2.75e-1 | 43 of 96 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1, frequencyPerMm 50 |
| optiland – optiland-wave | fields.compared [elements] | 126 | 48 of 96 | — | — |
| optiland – optiland-wave | fields.flagged [elements] | 8 | 48 of 96 | — | — |
| optiland – optiland-wave | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| optiland – optiland-wave | fields.data [elements] | 0 | 48 of 96 | — | — |
| optiland – optiland-wave | fields.unavailable [elements] | 10 | 48 of 96 | — | — |
| optiland – optiland-wave | mtfFlagged.maxAbs | 4.90e-1 | 5 of 96 | sony-fe-20mm-f18-g-best-ref | cut tangential, field 1, frequencyPerMm 10 |
| optiland – wave | chiefLanding.maxAbs [mm] | 1.52e-10 | 48 of 96 | nikon-z-mc-105f28-best-ref | field 1 |
| optiland – wave | mtfOnAxis.maxAbs | 1.02e-2 | 42 of 96 | sony-fe-400mm-f28-gm-oss-ref | cut tangential, field 0, frequencyPerMm 40 |
| optiland – wave | mtfOffAxis.maxAbs | 3.98e-2 | 40 of 96 | sigma-105mm-f28-dg-dn-macro-art-ref | cut tangential, field 1, frequencyPerMm 30 |
| optiland – wave | mtfFlagged.maxAbs | 4.91e-1 | 19 of 96 | sony-fe-20mm-f18-g-best-ref | cut tangential, field 1, frequencyPerMm 10 |
| optiland – wave | fields.compared [elements] | 107 | 48 of 96 | — | — |
| optiland – wave | fields.flagged [elements] | 27 | 48 of 96 | — | — |
| optiland – wave | fields.rimLost [elements] | 0 | 48 of 96 | — | — |
| optiland – wave | fields.data [elements] | 0 | 48 of 96 | — | — |
| optiland – wave | fields.unavailable [elements] | 10 | 48 of 96 | — | — |
| optiland-wave – wave | chiefLanding.maxAbs [mm] | 1.52e-10 | 96 of 96 | nikon-z-mc-105f28-best-ref | field 1 |
| optiland-wave – wave | mtfOnAxis.maxAbs | 3.24e-3 | 82 of 96 | sigma-105mm-f28-dg-dn-macro-art-photopic | cut sagittal, field 0, frequencyPerMm 100 |
| optiland-wave – wave | mtfOffAxis.maxAbs | 4.32e-3 | 75 of 96 | sony-fe-20mm-f18-g-f8-ref | cut tangential, field 1, frequencyPerMm 90 |
| optiland-wave – wave | mtfFlagged.maxAbs | 2.20e-2 | 42 of 96 | sigma-35mm-f14-dg-hsm-a-ref | cut sagittal, field 1, frequencyPerMm 100 |
| optiland-wave – wave | fields.compared [elements] | 211 | 96 of 96 | — | — |
| optiland-wave – wave | fields.flagged [elements] | 77 | 96 of 96 | — | — |
| optiland-wave – wave | fields.rimLost [elements] | 0 | 96 of 96 | — | — |
| optiland-wave – wave | fields.data [elements] | 0 | 96 of 96 | — | — |
| optiland-wave – wave | fields.unavailable [elements] | 0 | 96 of 96 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – optiland-wave | lv – wave | optiland – optiland-wave | optiland – wave | optiland-wave – wave |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-ref | 1 | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-ref | 1 | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-best-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-best-ref | 1 | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikkor-z50f12-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-best-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sony-fe-20mm-f18-g-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-best-ref | 1 | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-wide-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-best-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-24-70f4s-tele-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-mc-105f28-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-best-ref | 1 | ATTENTION: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| nikon-z-135f18-plena-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | UNSUPPORTED: no judged figure | RECORDED: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | RECORDED: no judged figure |

#### canon-ef-135-f2l-usm-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.629 | ok | ok | ok | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.170 | ok | unconverged | ok | ok | 1.85e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9826 | 0.9821 | 0.9830 | 0.9820 | 6.15e-4 | RECORDED | method | 1.02e-4 | RECORDED | method | 1.05e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.9417 | 0.9400 | 0.9430 | 0.9397 | 1.99e-3 | RECORDED | method | 2.95e-4 | RECORDED | method | 3.30e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8956 | 0.8930 | 0.8979 | 0.8926 | 3.00e-3 | RECORDED | method | 3.94e-4 | RECORDED | method | 5.26e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9826 | 0.9821 | 0.9830 | 0.9820 | 6.15e-4 | RECORDED | method | 1.02e-4 | RECORDED | method | 1.05e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.9417 | 0.9400 | 0.9430 | 0.9397 | 1.99e-3 | RECORDED | method | 2.95e-4 | RECORDED | method | 3.30e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8956 | 0.8930 | 0.8979 | 0.8926 | 3.00e-3 | RECORDED | method | 3.94e-4 | RECORDED | method | 5.26e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9693 | 0.9689 | 0.9692 | 0.9687 | 5.92e-4 | RECORDED | method | 2.62e-4 | RECORDED | method | 5.21e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8342 | 0.8330 | 0.8331 | 0.8325 | 1.79e-3 | RECORDED | method | 5.92e-4 | RECORDED | method | 6.76e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6310 | 0.6281 | 0.6278 | 0.6275 | 3.45e-3 | RECORDED | method | 6.08e-4 | RECORDED | method | 2.77e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9707 | 0.9703 | 0.9706 | 0.9703 | 3.46e-4 | RECORDED | method | 3.59e-6 | RECORDED | method | 3.21e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8710 | 0.8695 | 0.8688 | 0.8695 | 1.49e-3 | RECORDED | method | -6.98e-5 | RECORDED | method | -7.31e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.7315 | 0.7276 | 0.7255 | 0.7281 | 3.45e-3 | RECORDED | method | -4.50e-4 | RECORDED | method | -2.57e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9362 | 0.9357 | 0.9371 | 0.9360 | 1.67e-4 | RECORDED | method | -2.75e-4 | SET ASIDE | numerical | 1.12e-3 | RECORDED | method |
| 1 | sagittal | 30 | 0.6753 | 0.6748 | 0.6757 | 0.6752 | 1.14e-4 | RECORDED | method | -4.23e-4 | SET ASIDE | numerical | 4.90e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.4140 | 0.4146 | 0.4084 | 0.4140 | -6.61e-5 | RECORDED | method | 5.88e-4 | SET ASIDE | numerical | -5.63e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9390 | 0.9383 | 0.9389 | 0.9387 | 2.72e-4 | RECORDED | method | -3.80e-4 | SET ASIDE | numerical | 2.35e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7123 | 0.7127 | 0.7142 | 0.7125 | -2.47e-4 | RECORDED | method | 1.76e-4 | SET ASIDE | numerical | 1.62e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.4392 | 0.4403 | 0.4410 | 0.4402 | -9.68e-4 | RECORDED | method | 9.48e-5 | SET ASIDE | numerical | 8.13e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.629 | ok | unconverged | — | ok | 2.31e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.170 | ok | unconverged | — | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9467 | 0.9465 | — | 0.9465 | 1.35e-4 | RECORDED | method | -2.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.6916 | 0.6915 | — | 0.6922 | -5.87e-4 | RECORDED | method | -7.73e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.4092 | 0.4092 | — | 0.4101 | -8.26e-4 | RECORDED | method | -9.00e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9467 | 0.9465 | — | 0.9465 | 1.35e-4 | RECORDED | method | -2.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.6916 | 0.6915 | — | 0.6922 | -5.87e-4 | RECORDED | method | -7.73e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.4092 | 0.4092 | — | 0.4101 | -8.26e-4 | RECORDED | method | -9.00e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9230 | 0.9226 | — | 0.9225 | 4.75e-4 | RECORDED | method | 9.35e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.5303 | 0.5284 | — | 0.5286 | 1.70e-3 | RECORDED | method | -1.49e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.1588 | 0.1555 | — | 0.1552 | 3.63e-3 | RECORDED | method | 2.45e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9338 | 0.9338 | — | 0.9336 | 2.25e-4 | RECORDED | method | 1.64e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6243 | 0.6240 | — | 0.6239 | 4.82e-4 | RECORDED | method | 1.74e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.3040 | 0.3024 | — | 0.3028 | 1.13e-3 | RECORDED | method | -4.10e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9303 | 0.9298 | — | 0.9301 | 1.30e-4 | RECORDED | method | -3.45e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.6342 | 0.6337 | — | 0.6341 | 8.30e-6 | RECORDED | method | -4.76e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3429 | 0.3434 | — | 0.3429 | -3.01e-5 | RECORDED | method | 4.67e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9325 | 0.9321 | — | 0.9323 | 2.29e-4 | RECORDED | method | -1.90e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6630 | 0.6628 | — | 0.6633 | -3.34e-4 | RECORDED | method | -5.26e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3501 | 0.3495 | — | 0.3508 | -7.11e-4 | RECORDED | method | -1.31e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 12.519 | ok | unconverged | ok | ok | 3.91e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 1 | 24.433 | ok | unconverged | ok | unconverged | 8.53e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | numerical | unconverged |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9468 | 0.9467 | 0.9460 | 0.9467 | 1.29e-4 | RECORDED | method | 4.56e-5 | RECORDED | method | -7.26e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.6830 | 0.6825 | 0.6794 | 0.6814 | 1.68e-3 | RECORDED | method | 1.11e-3 | RECORDED | method | -2.00e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.3474 | 0.3461 | 0.3420 | 0.3441 | 3.33e-3 | RECORDED | method | 2.03e-3 | RECORDED | method | -2.08e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9468 | 0.9467 | 0.9460 | 0.9467 | 1.29e-4 | RECORDED | method | 4.56e-5 | RECORDED | method | -7.26e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.6830 | 0.6825 | 0.6794 | 0.6814 | 1.68e-3 | RECORDED | method | 1.11e-3 | RECORDED | method | -2.00e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.3474 | 0.3461 | 0.3420 | 0.3441 | 3.33e-3 | RECORDED | method | 2.03e-3 | RECORDED | method | -2.08e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.8802 | 0.8808 | 0.8787 | 0.8814 | -1.13e-3 | RECORDED | method | -5.89e-4 | SET ASIDE | numerical | -2.68e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.3360 | 0.3363 | 0.3317 | 0.3358 | 2.38e-4 | RECORDED | method | 4.62e-4 | SET ASIDE | numerical | -4.06e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.0985 | 0.0990 | 0.1029 | 0.1013 | -2.84e-3 | RECORDED | method | -2.32e-3 | SET ASIDE | numerical | 1.56e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.8684 | 0.8690 | 0.8674 | 0.8705 | -2.09e-3 | RECORDED | method | -1.48e-3 | SET ASIDE | numerical | -3.11e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.6145 | 0.6153 | 0.6142 | 0.6151 | -5.64e-4 | RECORDED | method | 2.43e-4 | SET ASIDE | numerical | -8.61e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.4293 | 0.4288 | 0.4237 | 0.4287 | 5.71e-4 | RECORDED | method | 1.40e-4 | SET ASIDE | numerical | -4.97e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.6656 | 0.6640 | 0.6677 | 0.6660 | -3.65e-4 | SET ASIDE | numerical | -2.01e-3 | SET ASIDE | numerical | 1.69e-3 | SET ASIDE | numerical |
| 1 | sagittal | 30 | 0.4615 | 0.4601 | 0.4631 | 0.4623 | -7.49e-4 | SET ASIDE | numerical | -2.17e-3 | SET ASIDE | numerical | 8.17e-4 | SET ASIDE | numerical |
| 1 | sagittal | 50 | 0.3497 | 0.3497 | 0.3503 | 0.3502 | -5.22e-4 | SET ASIDE | numerical | -5.03e-4 | SET ASIDE | numerical | 7.41e-5 | SET ASIDE | numerical |
| 1 | tangential | 10 | 0.8970 | 0.8997 | 0.9015 | 0.8972 | -2.26e-4 | SET ASIDE | numerical | 2.44e-3 | SET ASIDE | numerical | 4.24e-3 | SET ASIDE | numerical |
| 1 | tangential | 30 | 0.6206 | 0.6233 | 0.6349 | 0.6211 | -4.62e-4 | SET ASIDE | numerical | 2.19e-3 | SET ASIDE | numerical | 1.39e-2 | SET ASIDE | numerical |
| 1 | tangential | 50 | 0.3799 | 0.3793 | 0.4035 | 0.3802 | -3.39e-4 | SET ASIDE | numerical | -9.68e-4 | SET ASIDE | numerical | 2.33e-2 | SET ASIDE | numerical |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 12.519 | ok | unconverged | — | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 24.433 | ok | unconverged | — | unconverged | 0 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9467 | 0.9466 | — | 0.9466 | 7.15e-5 | RECORDED | method | 7.22e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.6829 | 0.6822 | — | 0.6815 | 1.47e-3 | RECORDED | method | 7.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.3610 | 0.3596 | — | 0.3582 | 2.78e-3 | RECORDED | method | 1.37e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9467 | 0.9466 | — | 0.9466 | 7.15e-5 | RECORDED | method | 7.22e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.6829 | 0.6822 | — | 0.6815 | 1.47e-3 | RECORDED | method | 7.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.3610 | 0.3596 | — | 0.3582 | 2.78e-3 | RECORDED | method | 1.37e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8802 | 0.8807 | — | 0.8814 | -1.22e-3 | RECORDED | method | -6.82e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.3434 | 0.3435 | — | 0.3434 | 5.68e-5 | RECORDED | method | 6.60e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.0679 | 0.0683 | — | 0.0701 | -2.24e-3 | RECORDED | method | -1.80e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.8640 | 0.8646 | — | 0.8660 | -2.02e-3 | RECORDED | method | -1.37e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.5560 | 0.5558 | — | 0.5554 | 5.82e-4 | RECORDED | method | 3.22e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.3427 | 0.3434 | — | 0.3430 | -3.44e-4 | RECORDED | method | 3.53e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.6637 | 0.6618 | — | 0.6639 | -1.84e-4 | SET ASIDE | numerical | -2.07e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4568 | 0.4560 | — | 0.4571 | -3.22e-4 | SET ASIDE | numerical | -1.14e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3416 | 0.3420 | — | 0.3418 | -2.54e-4 | SET ASIDE | numerical | 1.76e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8412 | 0.8442 | — | 0.8413 | -1.75e-4 | SET ASIDE | numerical | 2.81e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4238 | 0.4248 | — | 0.4235 | 2.85e-4 | SET ASIDE | numerical | 1.35e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1581 | 0.1592 | — | 0.1579 | 1.92e-4 | SET ASIDE | numerical | 1.29e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 17.190 | ok | unconverged | no curve | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | no-curve |
| 1 | 31.948 | ok | unconverged | no curve | unconverged | 6.50e-13 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9868 | 0.9865 | 0.9871 | 0.9864 | 3.43e-4 | RECORDED | method | 4.44e-5 | RECORDED | method | 6.35e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9502 | 0.9491 | 0.9516 | 0.9490 | 1.16e-3 | RECORDED | method | 1.28e-4 | RECORDED | method | 2.57e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.9020 | 0.9002 | 0.9049 | 0.9000 | 1.98e-3 | RECORDED | method | 1.44e-4 | RECORDED | method | 4.92e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9868 | 0.9865 | 0.9871 | 0.9864 | 3.43e-4 | RECORDED | method | 4.44e-5 | RECORDED | method | 6.35e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9502 | 0.9491 | 0.9516 | 0.9490 | 1.16e-3 | RECORDED | method | 1.28e-4 | RECORDED | method | 2.57e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.9020 | 0.9002 | 0.9049 | 0.9000 | 1.98e-3 | RECORDED | method | 1.44e-4 | RECORDED | method | 4.92e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9242 | 0.9265 | — | 0.9264 | -2.24e-3 | RECORDED | method | 7.34e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6266 | 0.6281 | — | 0.6296 | -2.98e-3 | RECORDED | method | -1.48e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.3205 | 0.3229 | — | 0.3226 | -2.07e-3 | RECORDED | method | 3.23e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9579 | 0.9589 | — | 0.9576 | 2.42e-4 | RECORDED | method | 1.27e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7855 | 0.7908 | — | 0.7887 | -3.19e-3 | RECORDED | method | 2.13e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6140 | 0.6170 | — | 0.6175 | -3.46e-3 | RECORDED | method | -5.24e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.5121 | 0.5014 | — | 0.5071 | 4.96e-3 | SET ASIDE | numerical | -5.66e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3724 | 0.3648 | — | 0.3704 | 2.08e-3 | SET ASIDE | numerical | -5.53e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3211 | 0.3205 | — | 0.3204 | 7.37e-4 | SET ASIDE | numerical | 8.51e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.6748 | 0.6703 | — | 0.6753 | -4.46e-4 | SET ASIDE | numerical | -4.92e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4795 | 0.4559 | — | 0.4766 | 2.87e-3 | SET ASIDE | numerical | -2.08e-2 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3591 | 0.3426 | — | 0.3572 | 1.94e-3 | SET ASIDE | numerical | -1.46e-2 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 17.190 | ok | unconverged | — | unconverged | 1.78e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 31.948 | ok | unconverged | — | unconverged | 2.84e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9395 | 0.9395 | — | 0.9396 | -7.44e-5 | RECORDED | method | -1.06e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.6311 | 0.6311 | — | 0.6322 | -1.10e-3 | RECORDED | method | -1.10e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.3403 | 0.3407 | — | 0.3417 | -1.37e-3 | RECORDED | method | -1.06e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9395 | 0.9395 | — | 0.9396 | -7.44e-5 | RECORDED | method | -1.06e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.6311 | 0.6311 | — | 0.6322 | -1.10e-3 | RECORDED | method | -1.10e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.3403 | 0.3407 | — | 0.3417 | -1.37e-3 | RECORDED | method | -1.06e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8879 | 0.8894 | — | 0.8887 | -8.38e-4 | SET ASIDE | numerical | 6.91e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.4590 | 0.4587 | — | 0.4600 | -9.81e-4 | SET ASIDE | numerical | -1.32e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.1004 | 0.0991 | — | 0.0995 | 9.63e-4 | SET ASIDE | numerical | -3.55e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9284 | 0.9297 | — | 0.9284 | -3.87e-5 | SET ASIDE | numerical | 1.27e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6597 | 0.6603 | — | 0.6608 | -1.06e-3 | SET ASIDE | numerical | -4.97e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.4476 | 0.4476 | — | 0.4492 | -1.52e-3 | SET ASIDE | numerical | -1.57e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.5078 | 0.4947 | — | 0.5031 | 4.75e-3 | SET ASIDE | numerical | -8.41e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3649 | 0.3569 | — | 0.3641 | 7.54e-4 | SET ASIDE | numerical | -7.22e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3130 | 0.3047 | — | 0.3131 | -8.49e-5 | SET ASIDE | numerical | -8.40e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.6476 | 0.6441 | — | 0.6475 | 6.98e-5 | SET ASIDE | numerical | -3.36e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3631 | 0.3689 | — | 0.3631 | -5.86e-5 | SET ASIDE | numerical | 5.75e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1953 | 0.1984 | — | 0.1960 | -7.17e-4 | SET ASIDE | numerical | 2.37e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | unconverged | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | numerical | unconverged |
| 0.5 | 11.924 | ok | unconverged | unconverged | ok | 4.71e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | numerical | unconverged |
| 1 | 22.852 | ok | unconverged | no curve | unconverged | 7.46e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8192 | 0.8195 | 0.8301 | 0.8201 | -8.94e-4 | RECORDED | method | -5.67e-4 | SET ASIDE | numerical | 1.00e-2 | SET ASIDE | numerical |
| 0 | sagittal | 30 | 0.1877 | 0.1881 | 0.2058 | 0.1898 | -2.12e-3 | RECORDED | method | -1.75e-3 | SET ASIDE | numerical | 1.60e-2 | SET ASIDE | numerical |
| 0 | sagittal | 50 | 0.1753 | 0.1753 | 0.1488 | 0.1744 | 8.83e-4 | RECORDED | method | 9.69e-4 | SET ASIDE | numerical | -2.56e-2 | SET ASIDE | numerical |
| 0 | tangential | 10 | 0.8192 | 0.8195 | 0.8301 | 0.8201 | -8.94e-4 | RECORDED | method | -5.67e-4 | SET ASIDE | numerical | 1.00e-2 | SET ASIDE | numerical |
| 0 | tangential | 30 | 0.1877 | 0.1881 | 0.2058 | 0.1898 | -2.12e-3 | RECORDED | method | -1.75e-3 | SET ASIDE | numerical | 1.60e-2 | SET ASIDE | numerical |
| 0 | tangential | 50 | 0.1753 | 0.1753 | 0.1488 | 0.1744 | 8.83e-4 | RECORDED | method | 9.69e-4 | SET ASIDE | numerical | -2.56e-2 | SET ASIDE | numerical |
| 0.5 | sagittal | 10 | 0.8718 | 0.8728 | 0.8732 | 0.8707 | 1.06e-3 | RECORDED | method | 2.10e-3 | SET ASIDE | numerical | 2.46e-3 | SET ASIDE | numerical |
| 0.5 | sagittal | 30 | 0.2335 | 0.2334 | 0.2428 | 0.2303 | 3.16e-3 | RECORDED | method | 3.04e-3 | SET ASIDE | numerical | 1.25e-2 | SET ASIDE | numerical |
| 0.5 | sagittal | 50 | 0.1923 | 0.1925 | 0.1928 | 0.1931 | -8.31e-4 | RECORDED | method | -5.91e-4 | SET ASIDE | numerical | -2.51e-4 | SET ASIDE | numerical |
| 0.5 | tangential | 10 | 0.8021 | 0.8049 | 0.8343 | 0.8017 | 4.26e-4 | RECORDED | method | 3.24e-3 | SET ASIDE | numerical | 3.27e-2 | SET ASIDE | numerical |
| 0.5 | tangential | 30 | 0.3993 | 0.3994 | 0.4319 | 0.3987 | 5.70e-4 | RECORDED | method | 6.47e-4 | SET ASIDE | numerical | 3.32e-2 | SET ASIDE | numerical |
| 0.5 | tangential | 50 | 0.2971 | 0.2975 | 0.3257 | 0.2995 | -2.42e-3 | RECORDED | method | -2.00e-3 | SET ASIDE | numerical | 2.62e-2 | SET ASIDE | numerical |
| 1 | sagittal | 10 | 0.8116 | 0.8118 | — | 0.8114 | 2.54e-4 | SET ASIDE | numerical | 3.70e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.1590 | 0.1606 | — | 0.1578 | 1.23e-3 | SET ASIDE | numerical | 2.84e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.1408 | 0.1396 | — | 0.1425 | -1.75e-3 | SET ASIDE | numerical | -2.89e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8590 | 0.8628 | — | 0.8622 | -3.22e-3 | SET ASIDE | numerical | 5.49e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5697 | 0.5697 | — | 0.5730 | -3.23e-3 | SET ASIDE | numerical | -3.31e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3563 | 0.3535 | — | 0.3555 | 7.63e-4 | SET ASIDE | numerical | -1.99e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 11.924 | ok | unconverged | — | unconverged | 5.33e-15 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 22.852 | ok | unconverged | — | unconverged | 7.11e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.7884 | 0.7889 | — | 0.7894 | -1.05e-3 | RECORDED | method | -5.48e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.1384 | 0.1385 | — | 0.1394 | -9.71e-4 | RECORDED | method | -9.44e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.1419 | 0.1422 | — | 0.1416 | 2.99e-4 | RECORDED | method | 6.60e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.7884 | 0.7889 | — | 0.7894 | -1.05e-3 | RECORDED | method | -5.48e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.1384 | 0.1385 | — | 0.1394 | -9.71e-4 | RECORDED | method | -9.44e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.1419 | 0.1422 | — | 0.1416 | 2.99e-4 | RECORDED | method | 6.60e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8451 | 0.8463 | — | 0.8451 | -2.18e-5 | SET ASIDE | numerical | 1.22e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.1279 | 0.1278 | — | 0.1268 | 1.11e-3 | SET ASIDE | numerical | 9.56e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.1747 | 0.1747 | — | 0.1756 | -9.75e-4 | SET ASIDE | numerical | -9.42e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.7672 | 0.7700 | — | 0.7689 | -1.64e-3 | SET ASIDE | numerical | 1.13e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.3359 | 0.3365 | — | 0.3371 | -1.28e-3 | SET ASIDE | numerical | -6.29e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.1832 | 0.1829 | — | 0.1833 | -1.01e-4 | SET ASIDE | numerical | -4.71e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8006 | 0.8013 | — | 0.8004 | 1.81e-4 | SET ASIDE | numerical | 9.01e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.1106 | 0.1102 | — | 0.1109 | -3.48e-4 | SET ASIDE | numerical | -6.76e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.1455 | 0.1460 | — | 0.1459 | -3.55e-4 | SET ASIDE | numerical | 1.59e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8249 | 0.8314 | — | 0.8298 | -4.99e-3 | SET ASIDE | numerical | 1.55e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4677 | 0.4685 | — | 0.4729 | -5.23e-3 | SET ASIDE | numerical | -4.38e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2567 | 0.2529 | — | 0.2552 | 1.49e-3 | SET ASIDE | numerical | -2.26e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 0.5 | 28.763 | ok | unconverged | unconverged | ok | 9.94e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | numerical | unconverged |
| 1 | 47.512 | ok | unconverged | unconverged | unconverged | 4.26e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | numerical | unconverged |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9240 | 0.9245 | 0.9321 | 0.9251 | -1.08e-3 | RECORDED | method | -5.55e-4 | SET ASIDE | numerical | 7.06e-3 | ATTENTION | method |
| 0 | sagittal | 30 | 0.6291 | 0.6304 | 0.6553 | 0.6343 | -5.15e-3 | ATTENTION | method | -3.93e-3 | SET ASIDE | numerical | 2.11e-2 | ATTENTION | method |
| 0 | sagittal | 50 | 0.4321 | 0.4327 | 0.4447 | 0.4349 | -2.82e-3 | RECORDED | method | -2.14e-3 | SET ASIDE | numerical | 9.81e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9240 | 0.9245 | 0.9321 | 0.9251 | -1.08e-3 | RECORDED | method | -5.55e-4 | SET ASIDE | numerical | 7.06e-3 | ATTENTION | method |
| 0 | tangential | 30 | 0.6291 | 0.6304 | 0.6553 | 0.6343 | -5.15e-3 | ATTENTION | method | -3.93e-3 | SET ASIDE | numerical | 2.11e-2 | ATTENTION | method |
| 0 | tangential | 50 | 0.4321 | 0.4327 | 0.4447 | 0.4349 | -2.82e-3 | RECORDED | method | -2.14e-3 | SET ASIDE | numerical | 9.81e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.6973 | 0.6979 | 0.7176 | 0.6989 | -1.68e-3 | RECORDED | method | -1.05e-3 | SET ASIDE | numerical | 1.87e-2 | SET ASIDE | numerical |
| 0.5 | sagittal | 30 | 0.0039 | 0.0041 | 0.0120 | 0.0036 | 3.61e-4 | RECORDED | method | 5.14e-4 | SET ASIDE | numerical | 8.41e-3 | SET ASIDE | numerical |
| 0.5 | sagittal | 50 | 0.0076 | 0.0080 | 0.0058 | 0.0070 | 5.88e-4 | RECORDED | method | 9.75e-4 | SET ASIDE | numerical | -1.17e-3 | SET ASIDE | numerical |
| 0.5 | tangential | 10 | 0.4886 | 0.4870 | 0.5052 | 0.4896 | -1.05e-3 | RECORDED | method | -2.67e-3 | SET ASIDE | numerical | 1.56e-2 | SET ASIDE | numerical |
| 0.5 | tangential | 30 | 0.1357 | 0.1372 | 0.1627 | 0.1369 | -1.20e-3 | RECORDED | method | 2.60e-4 | SET ASIDE | numerical | 2.58e-2 | SET ASIDE | numerical |
| 0.5 | tangential | 50 | 0.1064 | 0.1070 | 0.1247 | 0.1073 | -8.62e-4 | RECORDED | method | -2.52e-4 | SET ASIDE | numerical | 1.74e-2 | SET ASIDE | numerical |
| 1 | sagittal | 10 | 0.3134 | 0.3137 | 0.3373 | 0.3138 | -3.74e-4 | SET ASIDE | numerical | -7.38e-5 | SET ASIDE | numerical | 2.35e-2 | SET ASIDE | numerical |
| 1 | sagittal | 30 | 0.1255 | 0.1269 | 0.1763 | 0.1295 | -3.95e-3 | SET ASIDE | numerical | -2.52e-3 | SET ASIDE | numerical | 4.69e-2 | SET ASIDE | numerical |
| 1 | sagittal | 50 | 0.0666 | 0.0687 | 0.1006 | 0.0680 | -1.38e-3 | SET ASIDE | numerical | 7.36e-4 | SET ASIDE | numerical | 3.26e-2 | SET ASIDE | numerical |
| 1 | tangential | 10 | 0.1436 | 0.1435 | 0.6018 | 0.1434 | 2.46e-4 | SET ASIDE | numerical | 1.41e-4 | SET ASIDE | numerical | 4.58e-1 | SET ASIDE | numerical |
| 1 | tangential | 30 | 0.1025 | 0.1047 | 0.2319 | 0.1026 | -6.85e-5 | SET ASIDE | numerical | 2.17e-3 | SET ASIDE | numerical | 1.29e-1 | SET ASIDE | numerical |
| 1 | tangential | 50 | 0.0642 | 0.0624 | 0.1159 | 0.0651 | -8.86e-4 | SET ASIDE | numerical | -2.72e-3 | SET ASIDE | numerical | 5.07e-2 | SET ASIDE | numerical |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 28.763 | ok | unconverged | — | unconverged | 1.60e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 47.512 | ok | unconverged | — | unconverged | 2.84e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9157 | 0.9164 | — | 0.9169 | -1.25e-3 | RECORDED | method | -5.57e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.5877 | 0.5890 | — | 0.5926 | -4.91e-3 | RECORDED | method | -3.64e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.3773 | 0.3774 | — | 0.3785 | -1.21e-3 | RECORDED | method | -1.09e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9157 | 0.9164 | — | 0.9169 | -1.25e-3 | RECORDED | method | -5.57e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.5877 | 0.5890 | — | 0.5926 | -4.91e-3 | RECORDED | method | -3.64e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.3773 | 0.3774 | — | 0.3785 | -1.21e-3 | RECORDED | method | -1.09e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.6782 | 0.6798 | — | 0.6815 | -3.30e-3 | SET ASIDE | numerical | -1.70e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.0020 | 0.0030 | — | 0.0034 | -1.37e-3 | SET ASIDE | numerical | -4.41e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.0062 | 0.0059 | — | 0.0064 | -2.11e-4 | SET ASIDE | numerical | -5.46e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.4736 | 0.4733 | — | 0.4752 | -1.66e-3 | SET ASIDE | numerical | -1.97e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.1155 | 0.1159 | — | 0.1171 | -1.54e-3 | SET ASIDE | numerical | -1.17e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.0932 | 0.0933 | — | 0.0938 | -6.40e-4 | SET ASIDE | numerical | -5.43e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.3051 | 0.3056 | — | 0.3065 | -1.39e-3 | SET ASIDE | numerical | -8.91e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.1272 | 0.1267 | — | 0.1290 | -1.79e-3 | SET ASIDE | numerical | -2.33e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.0743 | 0.0736 | — | 0.0758 | -1.45e-3 | SET ASIDE | numerical | -2.15e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.1374 | 0.1363 | — | 0.1372 | 2.06e-4 | SET ASIDE | numerical | -9.26e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.0642 | 0.0628 | — | 0.0635 | 6.84e-4 | SET ASIDE | numerical | -6.98e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.0260 | 0.0249 | — | 0.0259 | 1.40e-4 | SET ASIDE | numerical | -9.72e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 1.591 | ok | ok | ok | ok | 2.31e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 3.148 | ok | ok | ok | ok | 8.66e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9312 | 0.9310 | 0.9329 | 0.9310 | 1.95e-4 | RECORDED | method | -4.55e-5 | RECORDED | method | 1.88e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.6094 | 0.6093 | 0.6186 | 0.6102 | -7.05e-4 | RECORDED | method | -8.65e-4 | RECORDED | method | 8.48e-3 | ATTENTION | method |
| 0 | sagittal | 50 | 0.2586 | 0.2590 | 0.2675 | 0.2605 | -1.86e-3 | RECORDED | method | -1.42e-3 | RECORDED | method | 7.02e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9312 | 0.9310 | 0.9329 | 0.9310 | 1.95e-4 | RECORDED | method | -4.56e-5 | RECORDED | method | 1.88e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.6094 | 0.6093 | 0.6186 | 0.6102 | -7.05e-4 | RECORDED | method | -8.65e-4 | RECORDED | method | 8.48e-3 | ATTENTION | method |
| 0 | tangential | 50 | 0.2586 | 0.2590 | 0.2675 | 0.2605 | -1.86e-3 | RECORDED | method | -1.42e-3 | RECORDED | method | 7.02e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9254 | 0.9252 | 0.9265 | 0.9253 | 1.80e-4 | RECORDED | method | -5.44e-5 | RECORDED | method | 1.29e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.5830 | 0.5829 | 0.5893 | 0.5840 | -9.56e-4 | RECORDED | method | -1.12e-3 | RECORDED | method | 5.31e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.2389 | 0.2393 | 0.2428 | 0.2408 | -1.91e-3 | RECORDED | method | -1.49e-3 | RECORDED | method | 1.94e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9301 | 0.9298 | 0.9299 | 0.9298 | 2.89e-4 | RECORDED | method | 1.78e-5 | RECORDED | method | 9.79e-5 | RECORDED | method |
| 0.5 | tangential | 30 | 0.6260 | 0.6257 | 0.6261 | 0.6260 | -2.01e-5 | RECORDED | method | -2.66e-4 | RECORDED | method | 3.91e-5 | RECORDED | method |
| 0.5 | tangential | 50 | 0.3207 | 0.3208 | 0.3205 | 0.3214 | -6.22e-4 | RECORDED | method | -5.30e-4 | RECORDED | method | -8.26e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9319 | 0.9316 | 0.9315 | 0.9313 | 6.77e-4 | RECORDED | method | 3.46e-4 | RECORDED | method | 2.66e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.6347 | 0.6348 | 0.6335 | 0.6336 | 1.09e-3 | RECORDED | method | 1.24e-3 | RECORDED | method | -1.11e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.3394 | 0.3403 | 0.3338 | 0.3391 | 3.03e-4 | RECORDED | method | 1.22e-3 | RECORDED | method | -5.32e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9421 | 0.9419 | 0.9415 | 0.9419 | 1.91e-4 | RECORDED | method | -3.65e-5 | RECORDED | method | -4.36e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7915 | 0.7910 | 0.7896 | 0.7914 | 1.04e-4 | RECORDED | method | -3.75e-4 | RECORDED | method | -1.77e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.6362 | 0.6358 | 0.6327 | 0.6359 | 2.73e-4 | RECORDED | method | -8.53e-5 | RECORDED | method | -3.24e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 1.591 | ok | ok | — | ok | 5.86e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 3.148 | ok | ok | — | ok | 8.17e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9412 | 0.9410 | — | 0.9410 | 2.06e-4 | RECORDED | method | -2.95e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.6727 | 0.6725 | — | 0.6732 | -4.99e-4 | RECORDED | method | -7.17e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.3721 | 0.3724 | — | 0.3737 | -1.62e-3 | RECORDED | method | -1.30e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9412 | 0.9410 | — | 0.9410 | 2.06e-4 | RECORDED | method | -2.95e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.6727 | 0.6725 | — | 0.6732 | -4.99e-4 | RECORDED | method | -7.17e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.3721 | 0.3724 | — | 0.3737 | -1.62e-3 | RECORDED | method | -1.30e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9376 | 0.9373 | — | 0.9373 | 2.56e-4 | RECORDED | method | 2.44e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6583 | 0.6581 | — | 0.6585 | -1.64e-4 | RECORDED | method | -4.23e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.3677 | 0.3679 | — | 0.3684 | -6.98e-4 | RECORDED | method | -4.62e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9395 | 0.9392 | — | 0.9392 | 2.75e-4 | RECORDED | method | 4.33e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6810 | 0.6806 | — | 0.6810 | 5.07e-5 | RECORDED | method | -3.73e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.4034 | 0.4034 | — | 0.4042 | -8.07e-4 | RECORDED | method | -8.13e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9431 | 0.9428 | — | 0.9424 | 6.69e-4 | RECORDED | method | 3.44e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7048 | 0.7047 | — | 0.7033 | 1.51e-3 | RECORDED | method | 1.49e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.4626 | 0.4633 | — | 0.4615 | 1.16e-3 | RECORDED | method | 1.85e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9413 | 0.9411 | — | 0.9411 | 2.21e-4 | RECORDED | method | -2.74e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7751 | 0.7745 | — | 0.7746 | 4.30e-4 | RECORDED | method | -1.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.5963 | 0.5960 | — | 0.5953 | 9.57e-4 | RECORDED | method | 6.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 5.938 | ok | ok | ok | ok | 4.92e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.651 | ok | ok | ok | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9714 | 0.9712 | 0.9728 | 0.9712 | 2.70e-4 | RECORDED | method | 8.16e-5 | RECORDED | method | 1.58e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.9029 | 0.9027 | 0.9078 | 0.9034 | -4.26e-4 | RECORDED | method | -6.56e-4 | RECORDED | method | 4.41e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8409 | 0.8406 | 0.8475 | 0.8419 | -1.01e-3 | RECORDED | method | -1.26e-3 | RECORDED | method | 5.63e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9714 | 0.9712 | 0.9728 | 0.9712 | 2.70e-4 | RECORDED | method | 8.16e-5 | RECORDED | method | 1.58e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.9029 | 0.9027 | 0.9078 | 0.9034 | -4.26e-4 | RECORDED | method | -6.56e-4 | RECORDED | method | 4.41e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8409 | 0.8406 | 0.8475 | 0.8419 | -1.01e-3 | RECORDED | method | -1.26e-3 | RECORDED | method | 5.63e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9430 | 0.9429 | 0.9457 | 0.9430 | 9.23e-5 | RECORDED | method | -8.77e-5 | RECORDED | method | 2.74e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7025 | 0.7025 | 0.7140 | 0.7037 | -1.18e-3 | RECORDED | method | -1.16e-3 | RECORDED | method | 1.03e-2 | ATTENTION | method |
| 0.5 | sagittal | 50 | 0.4217 | 0.4222 | 0.4336 | 0.4238 | -2.13e-3 | RECORDED | method | -1.56e-3 | RECORDED | method | 9.77e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.8948 | 0.8947 | 0.8973 | 0.8948 | -4.45e-6 | RECORDED | method | -1.16e-4 | RECORDED | method | 2.51e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.4602 | 0.4607 | 0.4620 | 0.4619 | -1.68e-3 | RECORDED | method | -1.21e-3 | RECORDED | method | 8.72e-5 | RECORDED | method |
| 0.5 | tangential | 50 | 0.1327 | 0.1336 | 0.1152 | 0.1342 | -1.48e-3 | RECORDED | method | -5.52e-4 | RECORDED | method | -1.90e-2 | ATTENTION | method |
| 1 | sagittal | 10 | 0.9519 | 0.9516 | 0.9514 | 0.9515 | 3.86e-4 | RECORDED | method | 9.44e-5 | RECORDED | method | -1.13e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7763 | 0.7758 | 0.7715 | 0.7753 | 1.05e-3 | RECORDED | method | 5.23e-4 | RECORDED | method | -3.80e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.5706 | 0.5697 | 0.5571 | 0.5683 | 2.33e-3 | RECORDED | method | 1.36e-3 | RECORDED | method | -1.12e-2 | ATTENTION | method |
| 1 | tangential | 10 | 0.9042 | 0.9040 | 0.8914 | 0.9041 | 1.83e-5 | RECORDED | method | -1.45e-4 | RECORDED | method | -1.28e-2 | ATTENTION | method |
| 1 | tangential | 30 | 0.5662 | 0.5665 | 0.5267 | 0.5678 | -1.68e-3 | RECORDED | method | -1.38e-3 | RECORDED | method | -4.12e-2 | ATTENTION | method |
| 1 | tangential | 50 | 0.3438 | 0.3442 | 0.3253 | 0.3441 | -3.06e-4 | RECORDED | method | 9.01e-5 | RECORDED | method | -1.88e-2 | ATTENTION | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 5.938 | ok | unconverged | — | ok | 5.33e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.650 | ok | ok | — | ok | 8.17e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9687 | 0.9686 | — | 0.9685 | 1.37e-4 | RECORDED | method | 1.47e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8811 | 0.8814 | — | 0.8823 | -1.24e-3 | RECORDED | method | -9.51e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7955 | 0.7959 | — | 0.7978 | -2.32e-3 | RECORDED | method | -1.84e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9687 | 0.9686 | — | 0.9685 | 1.37e-4 | RECORDED | method | 1.47e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8811 | 0.8814 | — | 0.8823 | -1.24e-3 | RECORDED | method | -9.51e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7955 | 0.7959 | — | 0.7978 | -2.32e-3 | RECORDED | method | -1.84e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9396 | 0.9395 | — | 0.9396 | -2.60e-5 | RECORDED | method | -1.51e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6789 | 0.6791 | — | 0.6805 | -1.62e-3 | RECORDED | method | -1.35e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.3836 | 0.3841 | — | 0.3857 | -2.12e-3 | RECORDED | method | -1.65e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.8891 | 0.8890 | — | 0.8893 | -1.96e-4 | RECORDED | method | -2.50e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.4344 | 0.4347 | — | 0.4362 | -1.82e-3 | RECORDED | method | -1.44e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.1178 | 0.1184 | — | 0.1183 | -5.05e-4 | RECORDED | method | 2.65e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9522 | 0.9519 | — | 0.9519 | 2.62e-4 | RECORDED | method | -1.56e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7764 | 0.7760 | — | 0.7760 | 4.83e-4 | RECORDED | method | 3.51e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5767 | 0.5759 | — | 0.5753 | 1.41e-3 | RECORDED | method | 5.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9011 | 0.9010 | — | 0.9012 | -8.21e-5 | RECORDED | method | -2.23e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5429 | 0.5433 | — | 0.5448 | -1.92e-3 | RECORDED | method | -1.46e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3109 | 0.3112 | — | 0.3114 | -5.51e-4 | RECORDED | method | -1.86e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 0.5 | 24.232 | ok | ok | ok | ok | 8.61e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 43.275 | ok | unconverged | ok | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9223 | 0.9223 | 0.9241 | 0.9225 | -2.65e-4 | RECORDED | method | -2.15e-4 | SET ASIDE | numerical | 1.55e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.6439 | 0.6442 | 0.6511 | 0.6467 | -2.78e-3 | RECORDED | method | -2.48e-3 | SET ASIDE | numerical | 4.44e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.4126 | 0.4129 | 0.4199 | 0.4166 | -3.97e-3 | RECORDED | method | -3.73e-3 | SET ASIDE | numerical | 3.33e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9223 | 0.9223 | 0.9241 | 0.9225 | -2.65e-4 | RECORDED | method | -2.15e-4 | SET ASIDE | numerical | 1.55e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.6439 | 0.6442 | 0.6511 | 0.6467 | -2.78e-3 | RECORDED | method | -2.48e-3 | SET ASIDE | numerical | 4.44e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.4126 | 0.4129 | 0.4199 | 0.4166 | -3.97e-3 | RECORDED | method | -3.73e-3 | SET ASIDE | numerical | 3.33e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9280 | 0.9280 | 0.9287 | 0.9281 | -1.25e-4 | RECORDED | method | -1.03e-4 | RECORDED | method | 6.27e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.6660 | 0.6663 | 0.6694 | 0.6678 | -1.85e-3 | RECORDED | method | -1.50e-3 | RECORDED | method | 1.57e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.4306 | 0.4309 | 0.4339 | 0.4331 | -2.48e-3 | RECORDED | method | -2.17e-3 | RECORDED | method | 8.46e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9476 | 0.9474 | 0.9480 | 0.9475 | 3.78e-5 | RECORDED | method | -1.15e-4 | RECORDED | method | 4.55e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7947 | 0.7949 | 0.7971 | 0.7961 | -1.43e-3 | RECORDED | method | -1.27e-3 | RECORDED | method | 9.81e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6520 | 0.6510 | 0.6544 | 0.6540 | -2.05e-3 | RECORDED | method | -2.97e-3 | RECORDED | method | 3.74e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.7893 | 0.7893 | 0.7900 | 0.7894 | -1.06e-4 | RECORDED | method | -1.42e-4 | SET ASIDE | numerical | 6.35e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.0302 | 0.0308 | 0.0323 | 0.0300 | 2.57e-4 | RECORDED | method | 8.01e-4 | SET ASIDE | numerical | 2.33e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.2673 | 0.2668 | 0.2707 | 0.2671 | 2.73e-4 | RECORDED | method | -2.60e-4 | SET ASIDE | numerical | 3.63e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.6935 | 0.6931 | 0.7514 | 0.6959 | -2.39e-3 | RECORDED | method | -2.74e-3 | SET ASIDE | numerical | 5.55e-2 | ATTENTION | method |
| 1 | tangential | 30 | 0.2432 | 0.2435 | 0.3025 | 0.2455 | -2.28e-3 | RECORDED | method | -2.01e-3 | SET ASIDE | numerical | 5.71e-2 | ATTENTION | method |
| 1 | tangential | 50 | 0.1207 | 0.1205 | 0.1618 | 0.1202 | 4.72e-4 | RECORDED | method | 2.34e-4 | SET ASIDE | numerical | 4.16e-2 | ATTENTION | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 24.232 | ok | ok | — | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 43.275 | ok | unconverged | — | ok | 5.33e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9309 | 0.9310 | — | 0.9311 | -1.92e-4 | RECORDED | method | -1.56e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.6827 | 0.6829 | — | 0.6849 | -2.24e-3 | RECORDED | method | -2.05e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.4643 | 0.4649 | — | 0.4682 | -3.91e-3 | RECORDED | method | -3.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9309 | 0.9310 | — | 0.9311 | -1.92e-4 | RECORDED | method | -1.56e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.6827 | 0.6829 | — | 0.6849 | -2.24e-3 | RECORDED | method | -2.05e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.4643 | 0.4649 | — | 0.4682 | -3.91e-3 | RECORDED | method | -3.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9342 | 0.9342 | — | 0.9343 | -1.10e-4 | RECORDED | method | -9.33e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6962 | 0.6965 | — | 0.6978 | -1.57e-3 | RECORDED | method | -1.32e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.4801 | 0.4805 | — | 0.4825 | -2.39e-3 | RECORDED | method | -2.01e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9448 | 0.9446 | — | 0.9447 | 5.71e-5 | RECORDED | method | -9.73e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7565 | 0.7563 | — | 0.7575 | -9.16e-4 | RECORDED | method | -1.13e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5511 | 0.5504 | — | 0.5524 | -1.30e-3 | RECORDED | method | -2.02e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8138 | 0.8140 | — | 0.8140 | -2.06e-4 | RECORDED | method | -3.02e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.0524 | 0.0520 | — | 0.0529 | -4.82e-4 | RECORDED | method | -9.01e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2602 | 0.2597 | — | 0.2597 | 5.26e-4 | RECORDED | method | -1.96e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.6667 | 0.6659 | — | 0.6682 | -1.49e-3 | RECORDED | method | -2.33e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.1657 | 0.1642 | — | 0.1662 | -5.04e-4 | RECORDED | method | -2.04e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.0836 | 0.0847 | — | 0.0830 | 6.39e-4 | RECORDED | method | 1.75e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 8.914 | ok | ok | ok | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 16.633 | ok | unconverged | ok | ok | 1.00e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9660 | 0.9654 | 0.9673 | 0.9657 | 3.08e-4 | RECORDED | method | -2.97e-4 | RECORDED | method | 1.68e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.8910 | 0.8895 | 0.8940 | 0.8899 | 1.11e-3 | RECORDED | method | -4.80e-4 | RECORDED | method | 4.06e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8080 | 0.8054 | 0.8113 | 0.8060 | 2.05e-3 | RECORDED | method | -5.90e-4 | RECORDED | method | 5.29e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9660 | 0.9654 | 0.9673 | 0.9657 | 3.08e-4 | RECORDED | method | -2.97e-4 | RECORDED | method | 1.68e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.8910 | 0.8895 | 0.8940 | 0.8899 | 1.11e-3 | RECORDED | method | -4.80e-4 | RECORDED | method | 4.06e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8080 | 0.8054 | 0.8113 | 0.8060 | 2.05e-3 | RECORDED | method | -5.90e-4 | RECORDED | method | 5.29e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9065 | 0.9094 | 0.9141 | 0.9106 | -4.11e-3 | RECORDED | method | -1.17e-3 | RECORDED | method | 3.54e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.6461 | 0.6519 | 0.6572 | 0.6535 | -7.36e-3 | RECORDED | method | -1.60e-3 | RECORDED | method | 3.74e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.4874 | 0.4884 | 0.4877 | 0.4891 | -1.69e-3 | RECORDED | method | -6.85e-4 | RECORDED | method | -1.44e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9393 | 0.9374 | 0.9404 | 0.9377 | 1.60e-3 | RECORDED | method | -2.84e-4 | RECORDED | method | 2.64e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7477 | 0.7436 | 0.7485 | 0.7448 | 2.83e-3 | RECORDED | method | -1.24e-3 | RECORDED | method | 3.68e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5361 | 0.5334 | 0.5368 | 0.5350 | 1.12e-3 | RECORDED | method | -1.59e-3 | RECORDED | method | 1.81e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.6353 | 0.6324 | 0.6354 | 0.6348 | 4.79e-4 | RECORDED | method | -2.36e-3 | SET ASIDE | numerical | 5.79e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.4403 | 0.4382 | 0.4364 | 0.4396 | 6.77e-4 | RECORDED | method | -1.36e-3 | SET ASIDE | numerical | -3.23e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.3541 | 0.3557 | 0.3489 | 0.3536 | 4.80e-4 | RECORDED | method | 2.01e-3 | SET ASIDE | numerical | -4.77e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.8886 | 0.8877 | 0.9364 | 0.8877 | 8.83e-4 | RECORDED | method | -1.17e-6 | SET ASIDE | numerical | 4.87e-2 | ATTENTION | method |
| 1 | tangential | 30 | 0.5803 | 0.5782 | 0.7707 | 0.5789 | 1.42e-3 | RECORDED | method | -6.74e-4 | SET ASIDE | numerical | 1.92e-1 | ATTENTION | method |
| 1 | tangential | 50 | 0.3120 | 0.3129 | 0.5873 | 0.3127 | -7.25e-4 | RECORDED | method | 1.53e-4 | SET ASIDE | numerical | 2.75e-1 | ATTENTION | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 8.914 | ok | unconverged | — | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 16.631 | ok | unconverged | — | ok | 2.13e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9672 | 0.9665 | — | 0.9668 | 4.71e-4 | RECORDED | method | -2.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8913 | 0.8893 | — | 0.8895 | 1.75e-3 | RECORDED | method | -1.84e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8040 | 0.8010 | — | 0.8012 | 2.82e-3 | RECORDED | method | -1.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9672 | 0.9665 | — | 0.9668 | 4.71e-4 | RECORDED | method | -2.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8913 | 0.8893 | — | 0.8895 | 1.75e-3 | RECORDED | method | -1.84e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8040 | 0.8010 | — | 0.8012 | 2.82e-3 | RECORDED | method | -1.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9116 | 0.9143 | — | 0.9154 | -3.74e-3 | RECORDED | method | -1.08e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6504 | 0.6562 | — | 0.6578 | -7.41e-3 | RECORDED | method | -1.63e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.4791 | 0.4803 | — | 0.4810 | -1.85e-3 | RECORDED | method | -6.13e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9315 | 0.9292 | — | 0.9293 | 2.19e-3 | RECORDED | method | -1.14e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7261 | 0.7220 | — | 0.7226 | 3.58e-3 | RECORDED | method | -5.87e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5158 | 0.5131 | — | 0.5136 | 2.17e-3 | RECORDED | method | -5.01e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.6480 | 0.6481 | — | 0.6508 | -2.76e-3 | RECORDED | method | -2.70e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4552 | 0.4556 | — | 0.4565 | -1.35e-3 | RECORDED | method | -8.81e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3743 | 0.3746 | — | 0.3733 | 9.97e-4 | RECORDED | method | 1.31e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8696 | 0.8694 | — | 0.8692 | 4.34e-4 | RECORDED | method | 2.23e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5223 | 0.5215 | — | 0.5225 | -1.95e-4 | RECORDED | method | -9.95e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2554 | 0.2557 | — | 0.2569 | -1.52e-3 | RECORDED | method | -1.22e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 6.022 | ok | ok | ok | ok | 1.95e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.999 | ok | unconverged | ok | ok | 1.17e-10 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9632 | 0.9630 | 0.9636 | 0.9628 | 4.49e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | 8.21e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8135 | 0.8129 | 0.8160 | 0.8121 | 1.41e-3 | RECORDED | method | 8.16e-4 | RECORDED | method | 3.96e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.6080 | 0.6072 | 0.6124 | 0.6062 | 1.82e-3 | RECORDED | method | 9.57e-4 | RECORDED | method | 6.19e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9632 | 0.9630 | 0.9636 | 0.9628 | 4.49e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | 8.21e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8135 | 0.8129 | 0.8160 | 0.8121 | 1.41e-3 | RECORDED | method | 8.16e-4 | RECORDED | method | 3.96e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.6080 | 0.6072 | 0.6124 | 0.6062 | 1.82e-3 | RECORDED | method | 9.57e-4 | RECORDED | method | 6.19e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9648 | 0.9640 | 0.9648 | 0.9642 | 6.36e-4 | RECORDED | method | -1.57e-4 | RECORDED | method | 5.71e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8367 | 0.8345 | 0.8379 | 0.8353 | 1.47e-3 | RECORDED | method | -7.94e-4 | RECORDED | method | 2.61e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6846 | 0.6822 | 0.6874 | 0.6841 | 5.24e-4 | RECORDED | method | -1.87e-3 | RECORDED | method | 3.30e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9691 | 0.9688 | 0.9691 | 0.9687 | 4.71e-4 | RECORDED | method | 1.27e-4 | RECORDED | method | 4.61e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8953 | 0.8942 | 0.8952 | 0.8939 | 1.31e-3 | RECORDED | method | 2.25e-4 | RECORDED | method | 1.31e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.8120 | 0.8108 | 0.8125 | 0.8106 | 1.43e-3 | RECORDED | method | 1.71e-4 | RECORDED | method | 1.87e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.8376 | 0.8399 | 0.8363 | 0.8367 | 9.45e-4 | RECORDED | method | 3.19e-3 | SET ASIDE | numerical | -3.39e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.4241 | 0.4273 | 0.4175 | 0.4220 | 2.05e-3 | RECORDED | method | 5.30e-3 | SET ASIDE | numerical | -4.57e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.3301 | 0.3292 | 0.3252 | 0.3297 | 3.82e-4 | RECORDED | method | -4.67e-4 | SET ASIDE | numerical | -4.47e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9069 | 0.9079 | 0.9054 | 0.9067 | 2.13e-4 | RECORDED | method | 1.17e-3 | SET ASIDE | numerical | -1.25e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.6268 | 0.6326 | 0.6228 | 0.6273 | -4.83e-4 | RECORDED | method | 5.27e-3 | SET ASIDE | numerical | -4.51e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.3902 | 0.3968 | 0.3854 | 0.3913 | -1.04e-3 | RECORDED | method | 5.58e-3 | SET ASIDE | numerical | -5.85e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 6.022 | ok | ok | — | ok | 2.49e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.999 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9627 | 0.9625 | — | 0.9622 | 4.29e-4 | RECORDED | method | 2.34e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8027 | 0.8020 | — | 0.8011 | 1.53e-3 | RECORDED | method | 8.76e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.5766 | 0.5755 | — | 0.5742 | 2.43e-3 | RECORDED | method | 1.32e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9627 | 0.9625 | — | 0.9622 | 4.29e-4 | RECORDED | method | 2.34e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8027 | 0.8020 | — | 0.8011 | 1.53e-3 | RECORDED | method | 8.76e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.5766 | 0.5755 | — | 0.5742 | 2.43e-3 | RECORDED | method | 1.32e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9654 | 0.9646 | — | 0.9647 | 6.51e-4 | RECORDED | method | -1.08e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8321 | 0.8295 | — | 0.8301 | 2.06e-3 | RECORDED | method | -5.45e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6626 | 0.6590 | — | 0.6603 | 2.29e-3 | RECORDED | method | -1.31e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9667 | 0.9664 | — | 0.9663 | 4.60e-4 | RECORDED | method | 1.25e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8701 | 0.8691 | — | 0.8689 | 1.20e-3 | RECORDED | method | 1.61e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.7490 | 0.7476 | — | 0.7475 | 1.44e-3 | RECORDED | method | 8.41e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8390 | 0.8414 | — | 0.8383 | 7.34e-4 | RECORDED | method | 3.11e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4010 | 0.4056 | — | 0.3997 | 1.32e-3 | RECORDED | method | 5.86e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2995 | 0.2995 | — | 0.2996 | -1.11e-4 | RECORDED | method | -1.76e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8900 | 0.8914 | — | 0.8899 | 1.75e-4 | RECORDED | method | 1.56e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5352 | 0.5410 | — | 0.5360 | -7.80e-4 | RECORDED | method | 4.97e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2646 | 0.2682 | — | 0.2657 | -1.03e-3 | RECORDED | method | 2.53e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 0.5 | 4.659 | ok | ok | ok | ok | 1.95e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.159 | ok | unconverged | ok | ok | 1.71e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9744 | 0.9740 | 0.9766 | 0.9740 | 3.69e-4 | RECORDED | method | -5.70e-6 | SET ASIDE | numerical | 2.59e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.8847 | 0.8841 | 0.8952 | 0.8850 | -3.25e-4 | RECORDED | method | -9.14e-4 | SET ASIDE | numerical | 1.01e-2 | ATTENTION | method |
| 0 | sagittal | 50 | 0.7852 | 0.7850 | 0.8012 | 0.7870 | -1.85e-3 | RECORDED | method | -2.00e-3 | SET ASIDE | numerical | 1.42e-2 | ATTENTION | method |
| 0 | tangential | 10 | 0.9744 | 0.9740 | 0.9766 | 0.9740 | 3.69e-4 | RECORDED | method | -5.70e-6 | SET ASIDE | numerical | 2.59e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.8847 | 0.8841 | 0.8952 | 0.8850 | -3.25e-4 | RECORDED | method | -9.14e-4 | SET ASIDE | numerical | 1.01e-2 | ATTENTION | method |
| 0 | tangential | 50 | 0.7852 | 0.7850 | 0.8012 | 0.7870 | -1.85e-3 | RECORDED | method | -2.00e-3 | SET ASIDE | numerical | 1.42e-2 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9602 | 0.9599 | 0.9636 | 0.9600 | 1.68e-4 | RECORDED | method | -1.43e-4 | RECORDED | method | 3.60e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7863 | 0.7861 | 0.8025 | 0.7878 | -1.51e-3 | RECORDED | method | -1.68e-3 | RECORDED | method | 1.46e-2 | ATTENTION | method |
| 0.5 | sagittal | 50 | 0.5880 | 0.5884 | 0.6079 | 0.5912 | -3.23e-3 | RECORDED | method | -2.78e-3 | RECORDED | method | 1.67e-2 | ATTENTION | method |
| 0.5 | tangential | 10 | 0.9716 | 0.9714 | 0.9746 | 0.9715 | 9.32e-5 | RECORDED | method | -1.50e-4 | RECORDED | method | 3.02e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8779 | 0.8775 | 0.8895 | 0.8792 | -1.32e-3 | RECORDED | method | -1.66e-3 | RECORDED | method | 1.04e-2 | ATTENTION | method |
| 0.5 | tangential | 50 | 0.7866 | 0.7863 | 0.8018 | 0.7885 | -1.85e-3 | RECORDED | method | -2.20e-3 | RECORDED | method | 1.33e-2 | ATTENTION | method |
| 1 | sagittal | 10 | 0.9199 | 0.9201 | 0.9284 | 0.9206 | -6.81e-4 | RECORDED | method | -5.22e-4 | SET ASIDE | numerical | 7.80e-3 | RECORDED | method |
| 1 | sagittal | 30 | 0.5464 | 0.5477 | 0.5772 | 0.5519 | -5.54e-3 | RECORDED | method | -4.24e-3 | SET ASIDE | numerical | 2.53e-2 | ATTENTION | method |
| 1 | sagittal | 50 | 0.2023 | 0.2031 | 0.2167 | 0.2080 | -5.76e-3 | RECORDED | method | -4.88e-3 | SET ASIDE | numerical | 8.68e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.8476 | 0.8491 | 0.8557 | 0.8470 | 6.02e-4 | RECORDED | method | 2.05e-3 | SET ASIDE | numerical | 8.70e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.4480 | 0.4481 | 0.4512 | 0.4476 | 4.81e-4 | RECORDED | method | 5.46e-4 | SET ASIDE | numerical | 3.62e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.3105 | 0.3100 | 0.3071 | 0.3078 | 2.65e-3 | RECORDED | method | 2.12e-3 | SET ASIDE | numerical | -7.17e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.659 | ok | ok | — | ok | 1.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.159 | ok | unconverged | — | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9779 | 0.9775 | — | 0.9775 | 4.09e-4 | RECORDED | method | 3.76e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.9042 | 0.9035 | — | 0.9041 | 1.85e-4 | RECORDED | method | -5.77e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8193 | 0.8188 | — | 0.8203 | -1.04e-3 | RECORDED | method | -1.46e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9779 | 0.9775 | — | 0.9775 | 4.09e-4 | RECORDED | method | 3.76e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.9042 | 0.9035 | — | 0.9041 | 1.85e-4 | RECORDED | method | -5.77e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8193 | 0.8188 | — | 0.8203 | -1.04e-3 | RECORDED | method | -1.46e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9660 | 0.9657 | — | 0.9658 | 2.01e-4 | RECORDED | method | -8.04e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8223 | 0.8220 | — | 0.8234 | -1.14e-3 | RECORDED | method | -1.42e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6550 | 0.6553 | — | 0.6580 | -2.97e-3 | RECORDED | method | -2.65e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9730 | 0.9728 | — | 0.9727 | 2.68e-4 | RECORDED | method | 1.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8850 | 0.8847 | — | 0.8853 | -2.65e-4 | RECORDED | method | -5.98e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.8011 | 0.8006 | — | 0.8016 | -5.40e-4 | RECORDED | method | -1.01e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9258 | 0.9261 | — | 0.9260 | -1.20e-4 | RECORDED | method | 1.51e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5849 | 0.5862 | — | 0.5881 | -3.18e-3 | RECORDED | method | -1.91e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2750 | 0.2755 | — | 0.2784 | -3.38e-3 | RECORDED | method | -2.82e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8329 | 0.8345 | — | 0.8330 | -1.13e-4 | RECORDED | method | 1.57e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4388 | 0.4392 | — | 0.4378 | 9.79e-4 | RECORDED | method | 1.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3039 | 0.3035 | — | 0.3037 | 2.10e-4 | RECORDED | method | -1.49e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 0.5 | 13.797 | ok | ok | ok | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 25.567 | ok | unconverged | no curve | ok | 3.55e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9222 | 0.9217 | 0.9233 | 0.9233 | -1.07e-3 | RECORDED | method | -1.58e-3 | SET ASIDE | numerical | 3.38e-5 | RECORDED | method |
| 0 | sagittal | 30 | 0.7307 | 0.7285 | 0.7346 | 0.7341 | -3.43e-3 | RECORDED | method | -5.65e-3 | SET ASIDE | numerical | 5.05e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.6279 | 0.6263 | 0.6308 | 0.6300 | -2.13e-3 | RECORDED | method | -3.70e-3 | SET ASIDE | numerical | 7.47e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9222 | 0.9217 | 0.9233 | 0.9233 | -1.07e-3 | RECORDED | method | -1.58e-3 | SET ASIDE | numerical | 3.38e-5 | RECORDED | method |
| 0 | tangential | 30 | 0.7307 | 0.7285 | 0.7346 | 0.7341 | -3.43e-3 | RECORDED | method | -5.65e-3 | SET ASIDE | numerical | 5.05e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.6279 | 0.6263 | 0.6308 | 0.6300 | -2.13e-3 | RECORDED | method | -3.70e-3 | SET ASIDE | numerical | 7.47e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9185 | 0.9194 | 0.9196 | 0.9196 | -1.07e-3 | RECORDED | method | -1.87e-4 | RECORDED | method | -1.74e-5 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.6226 | 0.6227 | 0.6264 | 0.6247 | -2.11e-3 | RECORDED | method | -1.97e-3 | RECORDED | method | 1.72e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.3330 | 0.3323 | 0.3364 | 0.3340 | -9.51e-4 | RECORDED | method | -1.72e-3 | RECORDED | method | 2.43e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9438 | 0.9445 | 0.9440 | 0.9446 | -8.35e-4 | RECORDED | method | -1.46e-4 | RECORDED | method | -6.32e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7805 | 0.7809 | 0.7806 | 0.7824 | -1.88e-3 | RECORDED | method | -1.45e-3 | RECORDED | method | -1.76e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6031 | 0.6028 | 0.6014 | 0.6042 | -1.12e-3 | RECORDED | method | -1.41e-3 | RECORDED | method | -2.78e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.8052 | 0.8051 | — | 0.8066 | -1.43e-3 | RECORDED | method | -1.57e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4085 | 0.4083 | — | 0.4118 | -3.40e-3 | RECORDED | method | -3.57e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3744 | 0.3749 | — | 0.3752 | -7.26e-4 | RECORDED | method | -3.03e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8237 | 0.8241 | — | 0.8240 | -2.58e-4 | RECORDED | method | 1.74e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3754 | 0.3761 | — | 0.3756 | -2.37e-4 | RECORDED | method | 5.22e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1457 | 0.1456 | — | 0.1454 | 3.84e-4 | RECORDED | method | 2.82e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 13.797 | ok | unconverged | — | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 25.567 | ok | unconverged | — | ok | 3.55e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9073 | 0.9068 | — | 0.9086 | -1.24e-3 | RECORDED | method | -1.78e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.6840 | 0.6825 | — | 0.6868 | -2.77e-3 | RECORDED | method | -4.25e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.5715 | 0.5713 | — | 0.5726 | -1.09e-3 | RECORDED | method | -1.29e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9073 | 0.9068 | — | 0.9086 | -1.24e-3 | RECORDED | method | -1.78e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.6840 | 0.6825 | — | 0.6868 | -2.77e-3 | RECORDED | method | -4.25e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.5715 | 0.5713 | — | 0.5726 | -1.09e-3 | RECORDED | method | -1.29e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9033 | 0.9043 | — | 0.9045 | -1.11e-3 | RECORDED | method | -1.24e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.5579 | 0.5577 | — | 0.5591 | -1.19e-3 | RECORDED | method | -1.36e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.2623 | 0.2611 | — | 0.2619 | 3.70e-4 | RECORDED | method | -8.18e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9359 | 0.9367 | — | 0.9365 | -5.94e-4 | RECORDED | method | 1.72e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7506 | 0.7509 | — | 0.7510 | -3.46e-4 | RECORDED | method | -7.79e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5769 | 0.5763 | — | 0.5758 | 1.07e-3 | RECORDED | method | 4.81e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8120 | 0.8119 | — | 0.8131 | -1.07e-3 | RECORDED | method | -1.24e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4065 | 0.4065 | — | 0.4101 | -3.62e-3 | RECORDED | method | -3.59e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3698 | 0.3702 | — | 0.3709 | -1.06e-3 | RECORDED | method | -6.29e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8076 | 0.8081 | — | 0.8100 | -2.41e-3 | RECORDED | method | -1.85e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3564 | 0.3563 | — | 0.3575 | -1.10e-3 | RECORDED | method | -1.15e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1328 | 0.1325 | — | 0.1316 | 1.15e-3 | RECORDED | method | 8.16e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.629 | ok | ok | ok | ok | 1.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.170 | ok | unconverged | ok | ok | 1.91e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9831 | 0.9826 | 0.9835 | 0.9825 | 5.92e-4 | RECORDED | method | 1.05e-4 | RECORDED | method | 9.86e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9459 | 0.9444 | 0.9469 | 0.9441 | 1.81e-3 | RECORDED | method | 2.94e-4 | RECORDED | method | 2.80e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.9051 | 0.9025 | 0.9063 | 0.9020 | 3.12e-3 | RECORDED | method | 5.07e-4 | RECORDED | method | 4.28e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9831 | 0.9826 | 0.9835 | 0.9825 | 5.92e-4 | RECORDED | method | 1.05e-4 | RECORDED | method | 9.86e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9459 | 0.9444 | 0.9469 | 0.9441 | 1.81e-3 | RECORDED | method | 2.94e-4 | RECORDED | method | 2.80e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.9051 | 0.9025 | 0.9063 | 0.9020 | 3.12e-3 | RECORDED | method | 5.07e-4 | RECORDED | method | 4.28e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9652 | 0.9648 | 0.9651 | 0.9646 | 5.73e-4 | RECORDED | method | 2.42e-4 | RECORDED | method | 4.95e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8009 | 0.7996 | 0.8000 | 0.7991 | 1.76e-3 | RECORDED | method | 4.87e-4 | RECORDED | method | 8.48e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.5541 | 0.5512 | 0.5515 | 0.5507 | 3.34e-3 | RECORDED | method | 4.13e-4 | RECORDED | method | 8.06e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9690 | 0.9686 | 0.9689 | 0.9687 | 3.37e-4 | RECORDED | method | -1.21e-5 | RECORDED | method | 2.09e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8567 | 0.8551 | 0.8538 | 0.8552 | 1.50e-3 | RECORDED | method | -1.27e-4 | RECORDED | method | -1.42e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6969 | 0.6934 | 0.6901 | 0.6940 | 2.98e-3 | RECORDED | method | -5.83e-4 | RECORDED | method | -3.82e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9379 | 0.9375 | 0.9386 | 0.9377 | 1.67e-4 | RECORDED | method | -2.59e-4 | SET ASIDE | numerical | 8.61e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.6764 | 0.6758 | 0.6761 | 0.6762 | 1.59e-4 | RECORDED | method | -4.26e-4 | SET ASIDE | numerical | -1.41e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.4026 | 0.4031 | 0.3969 | 0.4027 | -5.26e-5 | RECORDED | method | 4.21e-4 | SET ASIDE | numerical | -5.73e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9380 | 0.9373 | 0.9378 | 0.9377 | 2.70e-4 | RECORDED | method | -3.94e-4 | SET ASIDE | numerical | 4.73e-5 | RECORDED | method |
| 1 | tangential | 30 | 0.7050 | 0.7053 | 0.7059 | 0.7052 | -2.29e-4 | RECORDED | method | 9.01e-5 | SET ASIDE | numerical | 6.76e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.4237 | 0.4245 | 0.4241 | 0.4246 | -8.81e-4 | RECORDED | method | -4.85e-5 | SET ASIDE | numerical | -4.46e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.629 | ok | unconverged | — | ok | 1.95e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.170 | ok | unconverged | — | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9492 | 0.9490 | — | 0.9490 | 1.72e-4 | RECORDED | method | -1.82e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.7546 | 0.7551 | — | 0.7554 | -8.91e-4 | RECORDED | method | -3.17e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6098 | 0.6105 | — | 0.6108 | -1.07e-3 | RECORDED | method | -3.64e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9492 | 0.9490 | — | 0.9490 | 1.72e-4 | RECORDED | method | -1.82e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.7546 | 0.7551 | — | 0.7554 | -8.91e-4 | RECORDED | method | -3.17e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6098 | 0.6105 | — | 0.6108 | -1.07e-3 | RECORDED | method | -3.64e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9504 | 0.9499 | — | 0.9497 | 6.59e-4 | RECORDED | method | 1.88e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7249 | 0.7232 | — | 0.7229 | 2.02e-3 | RECORDED | method | 2.46e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.4657 | 0.4623 | — | 0.4622 | 3.51e-3 | RECORDED | method | 1.14e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9465 | 0.9463 | — | 0.9462 | 3.26e-4 | RECORDED | method | 1.35e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7288 | 0.7288 | — | 0.7288 | 7.42e-5 | RECORDED | method | 6.72e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5119 | 0.5105 | — | 0.5108 | 1.07e-3 | RECORDED | method | -2.37e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9174 | 0.9175 | — | 0.9179 | -4.97e-4 | RECORDED | method | -3.90e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.6423 | 0.6422 | — | 0.6421 | 1.64e-4 | RECORDED | method | 4.57e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.4299 | 0.4300 | — | 0.4288 | 1.03e-3 | RECORDED | method | 1.19e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9383 | 0.9379 | — | 0.9380 | 2.79e-4 | RECORDED | method | -9.62e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7083 | 0.7084 | — | 0.7083 | 4.82e-5 | RECORDED | method | 9.33e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4449 | 0.4457 | — | 0.4459 | -1.05e-3 | RECORDED | method | -2.61e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.629 | ok | ok | ok | ok | 1.60e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.170 | ok | ok | ok | ok | 1.85e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9398 | 6.55e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 4.11e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8213 | 0.8200 | 0.8206 | 0.8199 | 1.37e-3 | RECORDED | method | 1.01e-4 | RECORDED | method | 6.60e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7022 | 0.7021 | 0.7026 | 0.7018 | 3.94e-4 | RECORDED | method | 2.95e-4 | RECORDED | method | 7.85e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9398 | 6.55e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 4.11e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8213 | 0.8200 | 0.8206 | 0.8199 | 1.37e-3 | RECORDED | method | 1.01e-4 | RECORDED | method | 6.60e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7022 | 0.7021 | 0.7026 | 0.7018 | 3.94e-4 | RECORDED | method | 2.95e-4 | RECORDED | method | 7.85e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9352 | 0.9348 | 0.9350 | 0.9346 | 6.18e-4 | RECORDED | method | 2.18e-4 | RECORDED | method | 4.50e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7888 | 0.7879 | 0.7886 | 0.7879 | 9.40e-4 | RECORDED | method | 3.38e-6 | RECORDED | method | 7.86e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6423 | 0.6429 | 0.6438 | 0.6429 | -5.99e-4 | RECORDED | method | 3.70e-5 | RECORDED | method | 9.41e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9350 | 0.9346 | 0.9348 | 0.9344 | 6.32e-4 | RECORDED | method | 1.95e-4 | RECORDED | method | 4.45e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7883 | 0.7874 | 0.7881 | 0.7874 | 9.74e-4 | RECORDED | method | -1.46e-5 | RECORDED | method | 7.41e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6417 | 0.6422 | 0.6431 | 0.6422 | -5.70e-4 | RECORDED | method | -3.30e-6 | RECORDED | method | 8.79e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9262 | 0.9258 | 0.9261 | 0.9256 | 5.60e-4 | RECORDED | method | 1.97e-4 | RECORDED | method | 4.98e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7330 | 0.7325 | 0.7337 | 0.7327 | 3.21e-4 | RECORDED | method | -1.96e-4 | RECORDED | method | 9.71e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.5427 | 0.5443 | 0.5459 | 0.5447 | -1.98e-3 | RECORDED | method | -4.22e-4 | RECORDED | method | 1.16e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9188 | 0.9184 | 0.9187 | 0.9183 | 5.52e-4 | RECORDED | method | 1.38e-4 | RECORDED | method | 4.73e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.6899 | 0.6896 | 0.6907 | 0.6899 | -1.06e-5 | RECORDED | method | -3.69e-4 | RECORDED | method | 7.81e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.4697 | 0.4716 | 0.4732 | 0.4724 | -2.64e-3 | RECORDED | method | -7.98e-4 | RECORDED | method | 8.34e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.629 | ok | ok | — | ok | 5.33e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.170 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9410 | 0.9406 | — | 0.9404 | 6.01e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8144 | 0.8134 | — | 0.8133 | 1.13e-3 | RECORDED | method | 6.20e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6869 | 0.6867 | — | 0.6868 | 9.59e-5 | RECORDED | method | -6.24e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9410 | 0.9406 | — | 0.9404 | 6.01e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8144 | 0.8134 | — | 0.8133 | 1.13e-3 | RECORDED | method | 6.20e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6869 | 0.6867 | — | 0.6868 | 9.59e-5 | RECORDED | method | -6.23e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9334 | 0.9331 | — | 0.9329 | 5.36e-4 | RECORDED | method | 1.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7669 | 0.7662 | — | 0.7663 | 5.82e-4 | RECORDED | method | -1.11e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5984 | 0.5993 | — | 0.5997 | -1.30e-3 | RECORDED | method | -4.68e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9316 | 0.9312 | — | 0.9311 | 5.49e-4 | RECORDED | method | 1.64e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7543 | 0.7536 | — | 0.7538 | 5.86e-4 | RECORDED | method | -1.28e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5718 | 0.5725 | — | 0.5730 | -1.24e-3 | RECORDED | method | -4.62e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9247 | 0.9244 | — | 0.9242 | 4.84e-4 | RECORDED | method | 1.68e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7133 | 0.7129 | — | 0.7132 | 7.11e-5 | RECORDED | method | -2.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5039 | 0.5055 | — | 0.5063 | -2.39e-3 | RECORDED | method | -8.39e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9155 | 0.9151 | — | 0.9150 | 4.71e-4 | RECORDED | method | 1.06e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6582 | 0.6580 | — | 0.6584 | -2.27e-4 | RECORDED | method | -4.52e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4118 | 0.4136 | — | 0.4147 | -2.83e-3 | RECORDED | method | -1.08e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.629 | ok | ok | ok | ok | 1.60e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.170 | ok | ok | ok | ok | 1.77e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.53e-4 | RECORDED | method | 2.17e-4 | RECORDED | method | 4.08e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8216 | 0.8203 | 0.8209 | 0.8202 | 1.37e-3 | RECORDED | method | 9.59e-5 | RECORDED | method | 6.53e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7027 | 0.7026 | 0.7031 | 0.7023 | 3.96e-4 | RECORDED | method | 2.88e-4 | RECORDED | method | 7.74e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.53e-4 | RECORDED | method | 2.17e-4 | RECORDED | method | 4.08e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8216 | 0.8203 | 0.8209 | 0.8202 | 1.37e-3 | RECORDED | method | 9.59e-5 | RECORDED | method | 6.53e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7027 | 0.7026 | 0.7031 | 0.7023 | 3.96e-4 | RECORDED | method | 2.88e-4 | RECORDED | method | 7.74e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9362 | 0.9358 | 0.9360 | 0.9355 | 6.27e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 4.44e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7947 | 0.7937 | 0.7945 | 0.7937 | 1.02e-3 | RECORDED | method | 2.49e-5 | RECORDED | method | 7.66e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6531 | 0.6536 | 0.6544 | 0.6535 | -4.15e-4 | RECORDED | method | 9.08e-5 | RECORDED | method | 9.19e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9360 | 0.9355 | 0.9358 | 0.9353 | 6.40e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | 4.40e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7942 | 0.7932 | 0.7939 | 0.7932 | 1.05e-3 | RECORDED | method | 6.05e-6 | RECORDED | method | 7.27e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6523 | 0.6528 | 0.6536 | 0.6527 | -3.95e-4 | RECORDED | method | 4.91e-5 | RECORDED | method | 8.62e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9278 | 0.9274 | 0.9277 | 0.9272 | 5.74e-4 | RECORDED | method | 2.00e-4 | RECORDED | method | 4.89e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7426 | 0.7420 | 0.7431 | 0.7422 | 4.46e-4 | RECORDED | method | -1.60e-4 | RECORDED | method | 9.39e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.5592 | 0.5606 | 0.5620 | 0.5609 | -1.73e-3 | RECORDED | method | -3.41e-4 | RECORDED | method | 1.13e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9208 | 0.9204 | 0.9207 | 0.9202 | 5.69e-4 | RECORDED | method | 1.42e-4 | RECORDED | method | 4.66e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7014 | 0.7010 | 0.7021 | 0.7013 | 1.33e-4 | RECORDED | method | -3.25e-4 | RECORDED | method | 7.56e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.4886 | 0.4903 | 0.4918 | 0.4910 | -2.39e-3 | RECORDED | method | -7.08e-4 | RECORDED | method | 8.16e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### canon-ef-135-f2l-usm-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.629 | ok | ok | — | ok | 1.78e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.170 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9418 | 0.9414 | — | 0.9412 | 6.03e-4 | RECORDED | method | 1.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8203 | 0.8192 | — | 0.8191 | 1.17e-3 | RECORDED | method | 6.65e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6990 | 0.6986 | — | 0.6986 | 3.07e-4 | RECORDED | method | -2.96e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9418 | 0.9414 | — | 0.9412 | 6.03e-4 | RECORDED | method | 1.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8203 | 0.8192 | — | 0.8191 | 1.17e-3 | RECORDED | method | 6.65e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6990 | 0.6986 | — | 0.6986 | 3.07e-4 | RECORDED | method | -2.96e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9380 | 0.9376 | — | 0.9374 | 5.80e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7955 | 0.7946 | — | 0.7946 | 9.30e-4 | RECORDED | method | -1.09e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6507 | 0.6510 | — | 0.6512 | -4.69e-4 | RECORDED | method | -2.18e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9361 | 0.9357 | — | 0.9355 | 5.90e-4 | RECORDED | method | 1.72e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7821 | 0.7812 | — | 0.7812 | 9.12e-4 | RECORDED | method | -2.44e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6213 | 0.6215 | — | 0.6217 | -4.59e-4 | RECORDED | method | -2.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9316 | 0.9312 | — | 0.9311 | 5.46e-4 | RECORDED | method | 1.83e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7551 | 0.7544 | — | 0.7545 | 5.55e-4 | RECORDED | method | -1.31e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5761 | 0.5770 | — | 0.5775 | -1.39e-3 | RECORDED | method | -5.14e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9240 | 0.9236 | — | 0.9234 | 5.44e-4 | RECORDED | method | 1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7079 | 0.7073 | — | 0.7076 | 3.25e-4 | RECORDED | method | -2.71e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4913 | 0.4924 | — | 0.4932 | -1.88e-3 | RECORDED | method | -7.49e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 12.519 | ok | unconverged | ok | ok | 2.33e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 1 | 24.433 | ok | unconverged | ok | unconverged | 1.14e-13 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | numerical | unconverged |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9727 | 0.9729 | 0.9729 | 0.9732 | -4.80e-4 | RECORDED | method | -2.61e-4 | RECORDED | method | -2.41e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9038 | 0.9048 | 0.9052 | 0.9057 | -1.91e-3 | RECORDED | method | -8.66e-4 | RECORDED | method | -5.09e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.8317 | 0.8326 | 0.8328 | 0.8335 | -1.80e-3 | RECORDED | method | -8.60e-4 | RECORDED | method | -7.13e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9727 | 0.9729 | 0.9729 | 0.9732 | -4.80e-4 | RECORDED | method | -2.61e-4 | RECORDED | method | -2.41e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9038 | 0.9048 | 0.9052 | 0.9057 | -1.91e-3 | RECORDED | method | -8.66e-4 | RECORDED | method | -5.09e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.8317 | 0.8326 | 0.8328 | 0.8335 | -1.80e-3 | RECORDED | method | -8.60e-4 | RECORDED | method | -7.13e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9088 | 0.9096 | 0.9081 | 0.9109 | -2.11e-3 | RECORDED | method | -1.26e-3 | SET ASIDE | numerical | -2.83e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.6168 | 0.6161 | 0.6144 | 0.6175 | -6.99e-4 | RECORDED | method | -1.35e-3 | SET ASIDE | numerical | -3.04e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.3285 | 0.3276 | 0.3251 | 0.3270 | 1.47e-3 | RECORDED | method | 6.03e-4 | SET ASIDE | numerical | -1.87e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.8606 | 0.8609 | 0.8596 | 0.8627 | -2.15e-3 | RECORDED | method | -1.85e-3 | SET ASIDE | numerical | -3.14e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7213 | 0.7222 | 0.7230 | 0.7230 | -1.68e-3 | RECORDED | method | -7.52e-4 | SET ASIDE | numerical | 1.70e-5 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6275 | 0.6268 | 0.6267 | 0.6269 | 6.02e-4 | RECORDED | method | -5.60e-5 | SET ASIDE | numerical | -1.21e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.6080 | 0.6058 | 0.6097 | 0.6085 | -5.93e-4 | SET ASIDE | numerical | -2.73e-3 | SET ASIDE | numerical | 1.13e-3 | SET ASIDE | numerical |
| 1 | sagittal | 30 | 0.3761 | 0.3765 | 0.3783 | 0.3768 | -7.06e-4 | SET ASIDE | numerical | -3.18e-4 | SET ASIDE | numerical | 1.50e-3 | SET ASIDE | numerical |
| 1 | sagittal | 50 | 0.2755 | 0.2773 | 0.2765 | 0.2757 | -1.88e-4 | SET ASIDE | numerical | 1.60e-3 | SET ASIDE | numerical | 8.63e-4 | SET ASIDE | numerical |
| 1 | tangential | 10 | 0.9049 | 0.9068 | 0.9090 | 0.9050 | -8.55e-5 | SET ASIDE | numerical | 1.82e-3 | SET ASIDE | numerical | 4.04e-3 | SET ASIDE | numerical |
| 1 | tangential | 30 | 0.6087 | 0.6116 | 0.6271 | 0.6091 | -4.10e-4 | SET ASIDE | numerical | 2.41e-3 | SET ASIDE | numerical | 1.80e-2 | SET ASIDE | numerical |
| 1 | tangential | 50 | 0.3256 | 0.3271 | 0.3546 | 0.3265 | -9.05e-4 | SET ASIDE | numerical | 5.17e-4 | SET ASIDE | numerical | 2.80e-2 | SET ASIDE | numerical |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 12.519 | ok | unconverged | — | ok | 2.13e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 24.433 | ok | unconverged | — | unconverged | 6.75e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9693 | 0.9696 | — | 0.9699 | -5.53e-4 | RECORDED | method | -3.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8786 | 0.8796 | — | 0.8807 | -2.06e-3 | RECORDED | method | -1.10e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7789 | 0.7796 | — | 0.7807 | -1.73e-3 | RECORDED | method | -1.05e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9693 | 0.9696 | — | 0.9699 | -5.53e-4 | RECORDED | method | -3.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8786 | 0.8796 | — | 0.8807 | -2.06e-3 | RECORDED | method | -1.10e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7789 | 0.7796 | — | 0.7807 | -1.73e-3 | RECORDED | method | -1.05e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9060 | 0.9068 | — | 0.9081 | -2.17e-3 | RECORDED | method | -1.32e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6053 | 0.6046 | — | 0.6061 | -7.49e-4 | RECORDED | method | -1.46e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.3179 | 0.3167 | — | 0.3167 | 1.25e-3 | RECORDED | method | 5.12e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.8640 | 0.8644 | — | 0.8662 | -2.15e-3 | RECORDED | method | -1.75e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6904 | 0.6915 | — | 0.6918 | -1.33e-3 | RECORDED | method | -2.87e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5544 | 0.5539 | — | 0.5541 | 3.32e-4 | RECORDED | method | -2.42e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.6077 | 0.6051 | — | 0.6079 | -1.61e-4 | SET ASIDE | numerical | -2.74e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3763 | 0.3765 | — | 0.3767 | -4.71e-4 | SET ASIDE | numerical | -2.39e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2735 | 0.2742 | — | 0.2739 | -4.00e-4 | SET ASIDE | numerical | 3.47e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8629 | 0.8655 | — | 0.8631 | -1.21e-4 | SET ASIDE | numerical | 2.42e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4665 | 0.4685 | — | 0.4664 | 1.29e-4 | SET ASIDE | numerical | 2.11e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2098 | 0.2102 | — | 0.2096 | 1.53e-4 | SET ASIDE | numerical | 5.66e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 12.519 | ok | ok | ok | ok | 1.60e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 24.433 | ok | ok | ok | ok | 7.82e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9402 | 0.9399 | 0.9398 | 0.9396 | 5.78e-4 | RECORDED | method | 2.53e-4 | RECORDED | method | 1.79e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8194 | 0.8185 | 0.8185 | 0.8183 | 1.11e-3 | RECORDED | method | 1.80e-4 | RECORDED | method | 1.89e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.6994 | 0.6997 | 0.6996 | 0.6993 | 1.02e-4 | RECORDED | method | 3.84e-4 | RECORDED | method | 3.11e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9402 | 0.9399 | 0.9398 | 0.9396 | 5.78e-4 | RECORDED | method | 2.53e-4 | RECORDED | method | 1.79e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8194 | 0.8185 | 0.8185 | 0.8183 | 1.11e-3 | RECORDED | method | 1.80e-4 | RECORDED | method | 1.89e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.6994 | 0.6997 | 0.6996 | 0.6993 | 1.02e-4 | RECORDED | method | 3.84e-4 | RECORDED | method | 3.11e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9219 | 0.9217 | 0.9217 | 0.9215 | 4.14e-4 | RECORDED | method | 2.20e-4 | RECORDED | method | 2.25e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7131 | 0.7132 | 0.7140 | 0.7135 | -4.02e-4 | RECORDED | method | -2.84e-4 | RECORDED | method | 4.40e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.5149 | 0.5171 | 0.5186 | 0.5178 | -2.87e-3 | RECORDED | method | -6.84e-4 | RECORDED | method | 7.80e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9363 | 0.9359 | 0.9359 | 0.9357 | 6.11e-4 | RECORDED | method | 2.28e-4 | RECORDED | method | 1.74e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8056 | 0.8047 | 0.8048 | 0.8046 | 1.02e-3 | RECORDED | method | 6.67e-5 | RECORDED | method | 1.37e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6771 | 0.6776 | 0.6776 | 0.6774 | -2.90e-4 | RECORDED | method | 2.77e-4 | RECORDED | method | 1.94e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9335 | 0.9331 | 0.9331 | 0.9330 | 4.97e-4 | RECORDED | method | 1.61e-4 | RECORDED | method | 1.14e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7901 | 0.7892 | 0.7894 | 0.7893 | 7.50e-4 | RECORDED | method | -1.21e-4 | RECORDED | method | 7.98e-5 | RECORDED | method |
| 1 | sagittal | 50 | 0.6495 | 0.6503 | 0.6504 | 0.6503 | -7.60e-4 | RECORDED | method | 5.36e-5 | RECORDED | method | 1.66e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9226 | 0.9220 | 0.9221 | 0.9218 | 8.07e-4 | RECORDED | method | 2.77e-4 | RECORDED | method | 3.59e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7464 | 0.7452 | 0.7460 | 0.7453 | 1.19e-3 | RECORDED | method | -5.65e-5 | RECORDED | method | 7.05e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.5745 | 0.5738 | 0.5743 | 0.5736 | 9.28e-4 | RECORDED | method | 1.95e-4 | RECORDED | method | 6.78e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 12.519 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 24.433 | ok | ok | — | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9426 | 0.9423 | — | 0.9421 | 5.39e-4 | RECORDED | method | 2.38e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8247 | 0.8239 | — | 0.8237 | 1.07e-3 | RECORDED | method | 1.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7072 | 0.7072 | — | 0.7071 | 1.23e-4 | RECORDED | method | 1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9426 | 0.9423 | — | 0.9421 | 5.39e-4 | RECORDED | method | 2.38e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8247 | 0.8239 | — | 0.8237 | 1.07e-3 | RECORDED | method | 1.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7072 | 0.7072 | — | 0.7071 | 1.23e-4 | RECORDED | method | 1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9239 | 0.9237 | — | 0.9235 | 3.68e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7138 | 0.7138 | — | 0.7141 | -3.35e-4 | RECORDED | method | -3.01e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5109 | 0.5129 | — | 0.5138 | -2.90e-3 | RECORDED | method | -9.33e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9367 | 0.9364 | — | 0.9361 | 5.47e-4 | RECORDED | method | 2.12e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7969 | 0.7961 | — | 0.7960 | 8.61e-4 | RECORDED | method | 5.01e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6567 | 0.6571 | — | 0.6571 | -4.53e-4 | RECORDED | method | -3.75e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9360 | 0.9357 | — | 0.9356 | 4.62e-4 | RECORDED | method | 1.48e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7954 | 0.7946 | — | 0.7947 | 6.81e-4 | RECORDED | method | -1.05e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6568 | 0.6571 | — | 0.6572 | -4.91e-4 | RECORDED | method | -1.02e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9059 | 0.9055 | — | 0.9053 | 6.29e-4 | RECORDED | method | 2.35e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6380 | 0.6372 | — | 0.6375 | 4.89e-4 | RECORDED | method | -2.56e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3973 | 0.3967 | — | 0.3968 | 5.53e-4 | RECORDED | method | -8.14e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 12.519 | ok | ok | ok | ok | 9.41e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 24.433 | ok | ok | ok | ok | 9.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9408 | 0.9404 | 0.9403 | 0.9402 | 5.85e-4 | RECORDED | method | 2.43e-4 | RECORDED | method | 1.62e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8220 | 0.8210 | 0.8209 | 0.8208 | 1.20e-3 | RECORDED | method | 1.69e-4 | RECORDED | method | 1.37e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7031 | 0.7032 | 0.7030 | 0.7028 | 2.69e-4 | RECORDED | method | 3.72e-4 | RECORDED | method | 2.26e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9408 | 0.9404 | 0.9403 | 0.9402 | 5.85e-4 | RECORDED | method | 2.43e-4 | RECORDED | method | 1.62e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8220 | 0.8210 | 0.8209 | 0.8208 | 1.20e-3 | RECORDED | method | 1.69e-4 | RECORDED | method | 1.37e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7031 | 0.7032 | 0.7030 | 0.7028 | 2.69e-4 | RECORDED | method | 3.72e-4 | RECORDED | method | 2.26e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9279 | 0.9276 | 0.9276 | 0.9274 | 4.75e-4 | RECORDED | method | 2.31e-4 | RECORDED | method | 2.03e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7478 | 0.7476 | 0.7480 | 0.7477 | 1.02e-4 | RECORDED | method | -1.28e-4 | RECORDED | method | 3.25e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.5732 | 0.5748 | 0.5758 | 0.5752 | -1.97e-3 | RECORDED | method | -3.30e-4 | RECORDED | method | 6.01e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9371 | 0.9367 | 0.9367 | 0.9365 | 6.19e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 1.85e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8096 | 0.8085 | 0.8086 | 0.8084 | 1.13e-3 | RECORDED | method | 7.19e-5 | RECORDED | method | 1.89e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6831 | 0.6836 | 0.6835 | 0.6833 | -1.61e-4 | RECORDED | method | 3.05e-4 | RECORDED | method | 2.05e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9338 | 0.9334 | 0.9334 | 0.9333 | 4.62e-4 | RECORDED | method | 1.41e-4 | RECORDED | method | 1.45e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7929 | 0.7921 | 0.7925 | 0.7923 | 5.84e-4 | RECORDED | method | -1.78e-4 | RECORDED | method | 2.40e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6555 | 0.6564 | 0.6568 | 0.6564 | -9.31e-4 | RECORDED | method | 2.57e-6 | RECORDED | method | 3.36e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9192 | 0.9187 | 0.9188 | 0.9184 | 7.91e-4 | RECORDED | method | 2.58e-4 | RECORDED | method | 3.96e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7253 | 0.7241 | 0.7251 | 0.7242 | 1.04e-3 | RECORDED | method | -1.54e-4 | RECORDED | method | 8.55e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.5385 | 0.5380 | 0.5388 | 0.5380 | 4.23e-4 | RECORDED | method | -1.91e-5 | RECORDED | method | 8.00e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 12.519 | ok | ok | — | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 24.433 | ok | ok | — | ok | 4.26e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9433 | 0.9430 | — | 0.9428 | 5.48e-4 | RECORDED | method | 2.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8283 | 0.8274 | — | 0.8272 | 1.15e-3 | RECORDED | method | 1.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7131 | 0.7129 | — | 0.7127 | 3.63e-4 | RECORDED | method | 1.37e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9433 | 0.9430 | — | 0.9428 | 5.48e-4 | RECORDED | method | 2.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8283 | 0.8274 | — | 0.8272 | 1.15e-3 | RECORDED | method | 1.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7131 | 0.7129 | — | 0.7127 | 3.63e-4 | RECORDED | method | 1.37e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9305 | 0.9303 | — | 0.9301 | 4.36e-4 | RECORDED | method | 2.12e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7530 | 0.7527 | — | 0.7528 | 1.72e-4 | RECORDED | method | -1.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5777 | 0.5790 | — | 0.5796 | -1.92e-3 | RECORDED | method | -5.53e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9383 | 0.9379 | — | 0.9377 | 5.65e-4 | RECORDED | method | 2.06e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8059 | 0.8050 | — | 0.8049 | 1.02e-3 | RECORDED | method | 8.02e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6726 | 0.6728 | — | 0.6727 | -1.15e-4 | RECORDED | method | 8.74e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9363 | 0.9360 | — | 0.9359 | 4.23e-4 | RECORDED | method | 1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7984 | 0.7977 | — | 0.7979 | 5.13e-4 | RECORDED | method | -1.61e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6633 | 0.6639 | — | 0.6641 | -7.61e-4 | RECORDED | method | -1.62e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9053 | 0.9049 | — | 0.9047 | 6.51e-4 | RECORDED | method | 2.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6356 | 0.6347 | — | 0.6350 | 6.36e-4 | RECORDED | method | -2.36e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4001 | 0.3994 | — | 0.3994 | 6.21e-4 | RECORDED | method | -4.04e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 17.190 | ok | unconverged | no curve | ok | 2.49e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | no-curve |
| 1 | 31.948 | ok | unconverged | no curve | unconverged | 7.11e-13 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9884 | 0.9881 | 0.9887 | 0.9881 | 3.28e-4 | RECORDED | method | 4.62e-5 | RECORDED | method | 5.79e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9644 | 0.9635 | 0.9651 | 0.9634 | 9.60e-4 | RECORDED | method | 1.13e-4 | RECORDED | method | 1.71e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.9392 | 0.9378 | 0.9404 | 0.9376 | 1.61e-3 | RECORDED | method | 1.74e-4 | RECORDED | method | 2.76e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9884 | 0.9881 | 0.9887 | 0.9881 | 3.28e-4 | RECORDED | method | 4.62e-5 | RECORDED | method | 5.79e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9644 | 0.9635 | 0.9651 | 0.9634 | 9.60e-4 | RECORDED | method | 1.13e-4 | RECORDED | method | 1.71e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.9392 | 0.9378 | 0.9404 | 0.9376 | 1.61e-3 | RECORDED | method | 1.74e-4 | RECORDED | method | 2.76e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9220 | 0.9243 | — | 0.9243 | -2.34e-3 | RECORDED | method | -4.67e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6518 | 0.6532 | — | 0.6544 | -2.63e-3 | RECORDED | method | -1.21e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.4058 | 0.4099 | — | 0.4090 | -3.21e-3 | RECORDED | method | 9.82e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9510 | 0.9520 | — | 0.9506 | 3.48e-4 | RECORDED | method | 1.38e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7464 | 0.7517 | — | 0.7501 | -3.65e-3 | RECORDED | method | 1.64e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5450 | 0.5484 | — | 0.5500 | -4.96e-3 | RECORDED | method | -1.61e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.5033 | 0.4928 | — | 0.4984 | 4.97e-3 | SET ASIDE | numerical | -5.56e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3601 | 0.3525 | — | 0.3579 | 2.24e-3 | SET ASIDE | numerical | -5.33e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3072 | 0.3076 | — | 0.3064 | 8.88e-4 | SET ASIDE | numerical | 1.24e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.6747 | 0.6706 | — | 0.6752 | -5.00e-4 | SET ASIDE | numerical | -4.66e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4831 | 0.4584 | — | 0.4801 | 2.98e-3 | SET ASIDE | numerical | -2.17e-2 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3675 | 0.3499 | — | 0.3654 | 2.07e-3 | SET ASIDE | numerical | -1.55e-2 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 17.190 | ok | unconverged | — | unconverged | 1.07e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 31.948 | ok | unconverged | — | unconverged | 3.20e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9564 | 0.9566 | — | 0.9567 | -2.42e-4 | RECORDED | method | -5.97e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.7684 | 0.7695 | — | 0.7700 | -1.65e-3 | RECORDED | method | -5.02e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6092 | 0.6100 | — | 0.6104 | -1.20e-3 | RECORDED | method | -3.97e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9564 | 0.9566 | — | 0.9567 | -2.42e-4 | RECORDED | method | -5.97e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.7684 | 0.7695 | — | 0.7700 | -1.65e-3 | RECORDED | method | -5.02e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6092 | 0.6100 | — | 0.6104 | -1.20e-3 | RECORDED | method | -3.97e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8839 | 0.8853 | — | 0.8853 | -1.45e-3 | SET ASIDE | numerical | -3.31e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.5954 | 0.5952 | — | 0.5962 | -7.91e-4 | SET ASIDE | numerical | -9.76e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.3991 | 0.3994 | — | 0.3994 | -3.33e-4 | SET ASIDE | numerical | 4.08e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9088 | 0.9105 | — | 0.9092 | -4.03e-4 | SET ASIDE | numerical | 1.34e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.5835 | 0.5849 | — | 0.5852 | -1.69e-3 | SET ASIDE | numerical | -3.35e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.3589 | 0.3594 | — | 0.3590 | -5.20e-5 | SET ASIDE | numerical | 4.39e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.4639 | 0.4514 | — | 0.4590 | 4.86e-3 | SET ASIDE | numerical | -7.57e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3002 | 0.2887 | — | 0.2989 | 1.29e-3 | SET ASIDE | numerical | -1.02e-2 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2388 | 0.2355 | — | 0.2387 | 6.22e-5 | SET ASIDE | numerical | -3.20e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.6491 | 0.6457 | — | 0.6491 | 4.34e-5 | SET ASIDE | numerical | -3.41e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3778 | 0.3864 | — | 0.3765 | 1.25e-3 | SET ASIDE | numerical | 9.86e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2124 | 0.2187 | — | 0.2140 | -1.61e-3 | SET ASIDE | numerical | 4.69e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 17.190 | ok | ok | ok | ok | 2.13e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 31.948 | ok | ok | ok | ok | 5.72e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.16e-4 | RECORDED | method | 2.12e-4 | RECORDED | method | 3.12e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8218 | 0.8206 | 0.8210 | 0.8206 | 1.28e-3 | RECORDED | method | 8.48e-5 | RECORDED | method | 4.48e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7031 | 0.7031 | 0.7034 | 0.7028 | 3.05e-4 | RECORDED | method | 2.70e-4 | RECORDED | method | 5.49e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.16e-4 | RECORDED | method | 2.12e-4 | RECORDED | method | 3.12e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8218 | 0.8206 | 0.8210 | 0.8206 | 1.28e-3 | RECORDED | method | 8.48e-5 | RECORDED | method | 4.48e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7031 | 0.7031 | 0.7034 | 0.7028 | 3.05e-4 | RECORDED | method | 2.70e-4 | RECORDED | method | 5.49e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9318 | 0.9314 | 0.9316 | 0.9312 | 5.91e-4 | RECORDED | method | 2.35e-4 | RECORDED | method | 3.86e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7691 | 0.7683 | 0.7691 | 0.7684 | 7.05e-4 | RECORDED | method | -1.39e-5 | RECORDED | method | 7.08e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6070 | 0.6080 | 0.6090 | 0.6081 | -1.10e-3 | RECORDED | method | -5.25e-5 | RECORDED | method | 8.86e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9378 | 0.9373 | 0.9374 | 0.9371 | 6.27e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | 3.08e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8123 | 0.8111 | 0.8115 | 0.8111 | 1.22e-3 | RECORDED | method | -7.53e-6 | RECORDED | method | 4.31e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6870 | 0.6873 | 0.6876 | 0.6871 | -9.24e-5 | RECORDED | method | 2.00e-4 | RECORDED | method | 4.28e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9368 | 0.9368 | 0.9366 | 0.9363 | 5.46e-4 | RECORDED | method | 5.26e-4 | RECORDED | method | 3.31e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.8085 | 0.8085 | 0.8080 | 0.8075 | 1.04e-3 | RECORDED | method | 1.00e-3 | RECORDED | method | 5.46e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6822 | 0.6821 | 0.6808 | 0.6802 | 1.98e-3 | RECORDED | method | 1.92e-3 | RECORDED | method | 6.08e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.8686 | 0.8685 | 0.8688 | 0.8684 | 2.16e-4 | RECORDED | method | 1.06e-4 | RECORDED | method | 3.61e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.6092 | 0.6089 | 0.6098 | 0.6098 | -5.96e-4 | RECORDED | method | -9.05e-4 | RECORDED | method | -1.26e-5 | RECORDED | method |
| 1 | tangential | 50 | 0.3726 | 0.3723 | 0.3720 | 0.3726 | 1.61e-5 | RECORDED | method | -2.19e-4 | RECORDED | method | -5.91e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 17.190 | ok | ok | — | ok | 3.55e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 31.948 | ok | ok | — | ok | 3.91e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9426 | 0.9422 | — | 0.9420 | 5.84e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8245 | 0.8234 | — | 0.8233 | 1.19e-3 | RECORDED | method | 1.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7059 | 0.7056 | — | 0.7055 | 3.62e-4 | RECORDED | method | 3.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9426 | 0.9422 | — | 0.9420 | 5.84e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8245 | 0.8234 | — | 0.8233 | 1.19e-3 | RECORDED | method | 1.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7059 | 0.7056 | — | 0.7055 | 3.62e-4 | RECORDED | method | 3.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9325 | 0.9322 | — | 0.9320 | 5.37e-4 | RECORDED | method | 2.15e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7627 | 0.7621 | — | 0.7621 | 5.63e-4 | RECORDED | method | -5.22e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5911 | 0.5920 | — | 0.5924 | -1.33e-3 | RECORDED | method | -3.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9341 | 0.9337 | — | 0.9335 | 5.94e-4 | RECORDED | method | 1.88e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7707 | 0.7696 | — | 0.7696 | 1.11e-3 | RECORDED | method | 3.99e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5912 | 0.5909 | — | 0.5908 | 3.19e-4 | RECORDED | method | 8.20e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9394 | 0.9394 | — | 0.9395 | -1.25e-4 | RECORDED | method | -1.44e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8173 | 0.8172 | — | 0.8175 | -2.39e-4 | RECORDED | method | -2.77e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6974 | 0.6973 | — | 0.6970 | 4.20e-4 | RECORDED | method | 3.61e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8656 | 0.8655 | — | 0.8653 | 2.99e-4 | RECORDED | method | 1.97e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5675 | 0.5672 | — | 0.5679 | -3.85e-4 | RECORDED | method | -6.35e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3135 | 0.3133 | — | 0.3137 | -2.04e-4 | RECORDED | method | -4.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 17.190 | ok | ok | ok | ok | 1.95e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 31.948 | ok | ok | ok | ok | 5.61e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.17e-4 | RECORDED | method | 2.13e-4 | RECORDED | method | 3.13e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8218 | 0.8207 | 0.8210 | 0.8206 | 1.28e-3 | RECORDED | method | 8.68e-5 | RECORDED | method | 4.50e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7031 | 0.7031 | 0.7034 | 0.7028 | 3.08e-4 | RECORDED | method | 2.74e-4 | RECORDED | method | 5.53e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.17e-4 | RECORDED | method | 2.13e-4 | RECORDED | method | 3.13e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8218 | 0.8207 | 0.8210 | 0.8206 | 1.28e-3 | RECORDED | method | 8.68e-5 | RECORDED | method | 4.50e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7031 | 0.7031 | 0.7034 | 0.7028 | 3.08e-4 | RECORDED | method | 2.74e-4 | RECORDED | method | 5.53e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9316 | 0.9312 | 0.9314 | 0.9310 | 5.89e-4 | RECORDED | method | 2.35e-4 | RECORDED | method | 3.88e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7679 | 0.7672 | 0.7679 | 0.7672 | 6.90e-4 | RECORDED | method | -1.78e-5 | RECORDED | method | 7.13e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6049 | 0.6060 | 0.6070 | 0.6061 | -1.13e-3 | RECORDED | method | -6.30e-5 | RECORDED | method | 8.93e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9378 | 0.9374 | 0.9375 | 0.9372 | 6.28e-4 | RECORDED | method | 2.00e-4 | RECORDED | method | 3.09e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8125 | 0.8113 | 0.8117 | 0.8113 | 1.22e-3 | RECORDED | method | -4.44e-6 | RECORDED | method | 4.33e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6874 | 0.6877 | 0.6879 | 0.6875 | -8.28e-5 | RECORDED | method | 2.06e-4 | RECORDED | method | 4.31e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9368 | 0.9368 | 0.9366 | 0.9362 | 5.46e-4 | RECORDED | method | 5.27e-4 | RECORDED | method | 3.32e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.8082 | 0.8082 | 0.8077 | 0.8072 | 1.04e-3 | RECORDED | method | 1.00e-3 | RECORDED | method | 5.49e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6816 | 0.6816 | 0.6803 | 0.6797 | 1.98e-3 | RECORDED | method | 1.92e-3 | RECORDED | method | 6.13e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.8686 | 0.8685 | 0.8688 | 0.8684 | 2.17e-4 | RECORDED | method | 1.07e-4 | RECORDED | method | 3.63e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.6093 | 0.6090 | 0.6099 | 0.6099 | -5.92e-4 | RECORDED | method | -9.01e-4 | RECORDED | method | -7.84e-6 | RECORDED | method |
| 1 | tangential | 50 | 0.3727 | 0.3724 | 0.3721 | 0.3726 | 2.19e-5 | RECORDED | method | -2.14e-4 | RECORDED | method | -5.85e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-35mm-f14-dg-hsm-a-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 17.190 | ok | ok | — | ok | 2.31e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 31.948 | ok | ok | — | ok | 4.26e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9429 | 0.9425 | — | 0.9423 | 5.78e-4 | RECORDED | method | 1.95e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8263 | 0.8252 | — | 0.8251 | 1.18e-3 | RECORDED | method | 9.12e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7097 | 0.7093 | — | 0.7093 | 3.91e-4 | RECORDED | method | 1.53e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9429 | 0.9425 | — | 0.9423 | 5.78e-4 | RECORDED | method | 1.95e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8263 | 0.8252 | — | 0.8251 | 1.18e-3 | RECORDED | method | 9.12e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7097 | 0.7093 | — | 0.7093 | 3.91e-4 | RECORDED | method | 1.53e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9354 | 0.9351 | — | 0.9349 | 5.59e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7807 | 0.7799 | — | 0.7799 | 7.77e-4 | RECORDED | method | 1.04e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6236 | 0.6242 | — | 0.6245 | -8.24e-4 | RECORDED | method | -2.27e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9335 | 0.9331 | — | 0.9329 | 5.78e-4 | RECORDED | method | 1.76e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7676 | 0.7665 | — | 0.7665 | 1.04e-3 | RECORDED | method | -1.13e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5867 | 0.5866 | — | 0.5865 | 2.04e-4 | RECORDED | method | 1.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9395 | 0.9395 | — | 0.9397 | -1.37e-4 | RECORDED | method | -1.56e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8184 | 0.8184 | — | 0.8187 | -2.76e-4 | RECORDED | method | -3.13e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6999 | 0.6998 | — | 0.6995 | 3.67e-4 | RECORDED | method | 3.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8651 | 0.8650 | — | 0.8648 | 2.79e-4 | RECORDED | method | 1.78e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5658 | 0.5655 | — | 0.5662 | -4.36e-4 | RECORDED | method | -6.85e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3121 | 0.3119 | — | 0.3123 | -2.77e-4 | RECORDED | method | -4.72e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 11.924 | ok | unconverged | ok | ok | 3.27e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 1 | 22.852 | ok | unconverged | no curve | unconverged | 4.62e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9823 | 0.9820 | 0.9823 | 0.9819 | 4.06e-4 | RECORDED | method | 9.34e-5 | RECORDED | method | 4.27e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9036 | 0.9024 | 0.9030 | 0.9021 | 1.49e-3 | RECORDED | method | 3.11e-4 | RECORDED | method | 8.70e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7822 | 0.7796 | 0.7799 | 0.7790 | 3.18e-3 | RECORDED | method | 6.05e-4 | RECORDED | method | 9.57e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9823 | 0.9820 | 0.9823 | 0.9819 | 4.06e-4 | RECORDED | method | 9.34e-5 | RECORDED | method | 4.27e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9036 | 0.9024 | 0.9030 | 0.9021 | 1.49e-3 | RECORDED | method | 3.11e-4 | RECORDED | method | 8.70e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7822 | 0.7796 | 0.7799 | 0.7790 | 3.18e-3 | RECORDED | method | 6.05e-4 | RECORDED | method | 9.57e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9368 | 0.9371 | 0.9407 | 0.9366 | 1.47e-4 | RECORDED | method | 5.09e-4 | SET ASIDE | numerical | 4.05e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7247 | 0.7253 | 0.7305 | 0.7242 | 4.98e-4 | RECORDED | method | 1.05e-3 | SET ASIDE | numerical | 6.30e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6263 | 0.6268 | 0.6239 | 0.6256 | 6.72e-4 | RECORDED | method | 1.26e-3 | SET ASIDE | numerical | -1.70e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9438 | 0.9466 | 0.9523 | 0.9440 | -2.23e-4 | RECORDED | method | 2.55e-3 | SET ASIDE | numerical | 8.27e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7486 | 0.7481 | 0.7795 | 0.7471 | 1.54e-3 | RECORDED | method | 1.02e-3 | SET ASIDE | numerical | 3.24e-2 | ATTENTION | method |
| 0.5 | tangential | 50 | 0.5751 | 0.5728 | 0.6146 | 0.5712 | 3.92e-3 | RECORDED | method | 1.61e-3 | SET ASIDE | numerical | 4.34e-2 | ATTENTION | method |
| 1 | sagittal | 10 | 0.7899 | 0.7904 | — | 0.7899 | -2.93e-5 | SET ASIDE | numerical | 5.09e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5257 | 0.5249 | — | 0.5264 | -6.77e-4 | SET ASIDE | numerical | -1.49e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3059 | 0.3065 | — | 0.3061 | -2.30e-4 | SET ASIDE | numerical | 3.81e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8738 | 0.8794 | — | 0.8763 | -2.48e-3 | SET ASIDE | numerical | 3.04e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5325 | 0.5357 | — | 0.5336 | -1.07e-3 | SET ASIDE | numerical | 2.08e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2545 | 0.2548 | — | 0.2551 | -6.44e-4 | SET ASIDE | numerical | -3.50e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 11.924 | ok | unconverged | — | ok | 5.33e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 22.852 | ok | unconverged | — | unconverged | 4.62e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9756 | 0.9755 | — | 0.9754 | 2.53e-4 | RECORDED | method | 8.60e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8540 | 0.8540 | — | 0.8540 | -3.80e-5 | RECORDED | method | -1.69e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6911 | 0.6916 | — | 0.6918 | -6.96e-4 | RECORDED | method | -1.94e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9756 | 0.9755 | — | 0.9754 | 2.53e-4 | RECORDED | method | 8.60e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8540 | 0.8540 | — | 0.8540 | -3.80e-5 | RECORDED | method | -1.69e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6911 | 0.6916 | — | 0.6918 | -6.96e-4 | RECORDED | method | -1.94e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9214 | 0.9238 | — | 0.9237 | -2.28e-3 | RECORDED | method | 1.19e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.6743 | 0.6780 | — | 0.6781 | -3.84e-3 | RECORDED | method | -1.02e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5399 | 0.5417 | — | 0.5415 | -1.59e-3 | RECORDED | method | 1.67e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9336 | 0.9326 | — | 0.9311 | 2.50e-3 | RECORDED | method | 1.54e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6824 | 0.6770 | — | 0.6780 | 4.38e-3 | RECORDED | method | -9.96e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.4826 | 0.4817 | — | 0.4815 | 1.08e-3 | RECORDED | method | 2.75e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.7819 | 0.7812 | — | 0.7818 | 1.66e-4 | SET ASIDE | numerical | -5.60e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5144 | 0.5170 | — | 0.5138 | 6.49e-4 | SET ASIDE | numerical | 3.25e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2938 | 0.2933 | — | 0.2932 | 5.91e-4 | SET ASIDE | numerical | 8.35e-5 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8608 | 0.8668 | — | 0.8619 | -1.04e-3 | SET ASIDE | numerical | 4.89e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5282 | 0.5282 | — | 0.5292 | -9.17e-4 | SET ASIDE | numerical | -9.24e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3129 | 0.3145 | — | 0.3120 | 8.38e-4 | SET ASIDE | numerical | 2.50e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 11.924 | ok | ok | ok | ok | 4.88e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 22.852 | ok | ok | ok | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.12e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | 2.93e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8219 | 0.8207 | 0.8211 | 0.8206 | 1.27e-3 | RECORDED | method | 9.41e-5 | RECORDED | method | 4.09e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7032 | 0.7032 | 0.7035 | 0.7029 | 2.99e-4 | RECORDED | method | 2.83e-4 | RECORDED | method | 5.11e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.12e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | 2.93e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8219 | 0.8207 | 0.8211 | 0.8206 | 1.27e-3 | RECORDED | method | 9.41e-5 | RECORDED | method | 4.09e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7032 | 0.7032 | 0.7035 | 0.7029 | 2.99e-4 | RECORDED | method | 2.83e-4 | RECORDED | method | 5.11e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9379 | 0.9376 | 0.9376 | 0.9373 | 6.26e-4 | RECORDED | method | 2.41e-4 | RECORDED | method | 3.17e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8087 | 0.8076 | 0.8080 | 0.8075 | 1.17e-3 | RECORDED | method | 1.15e-4 | RECORDED | method | 4.94e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6796 | 0.6800 | 0.6803 | 0.6797 | -5.15e-5 | RECORDED | method | 3.09e-4 | RECORDED | method | 6.07e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9372 | 0.9368 | 0.9369 | 0.9366 | 6.44e-4 | RECORDED | method | 2.20e-4 | RECORDED | method | 3.00e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8117 | 0.8104 | 0.8108 | 0.8104 | 1.27e-3 | RECORDED | method | 4.11e-5 | RECORDED | method | 4.23e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6862 | 0.6866 | 0.6867 | 0.6863 | -6.06e-5 | RECORDED | method | 3.22e-4 | RECORDED | method | 4.21e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9189 | 0.9186 | 0.9189 | 0.9183 | 5.76e-4 | RECORDED | method | 2.41e-4 | RECORDED | method | 5.16e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7053 | 0.7051 | 0.7065 | 0.7053 | -3.44e-5 | RECORDED | method | -2.66e-4 | RECORDED | method | 1.19e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.5037 | 0.5056 | 0.5074 | 0.5061 | -2.30e-3 | RECORDED | method | -4.39e-4 | RECORDED | method | 1.37e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9207 | 0.9201 | 0.9205 | 0.9199 | 7.45e-4 | RECORDED | method | 1.89e-4 | RECORDED | method | 5.38e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7513 | 0.7499 | 0.7511 | 0.7503 | 9.76e-4 | RECORDED | method | -4.48e-4 | RECORDED | method | 7.84e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.5898 | 0.5881 | 0.5888 | 0.5881 | 1.71e-3 | RECORDED | method | -1.65e-5 | RECORDED | method | 6.56e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 11.924 | ok | ok | — | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 22.852 | ok | ok | — | ok | 7.46e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9424 | 0.9421 | — | 0.9419 | 5.78e-4 | RECORDED | method | 2.08e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8230 | 0.8220 | — | 0.8219 | 1.17e-3 | RECORDED | method | 1.17e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7029 | 0.7026 | — | 0.7026 | 3.09e-4 | RECORDED | method | 3.84e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9424 | 0.9421 | — | 0.9419 | 5.78e-4 | RECORDED | method | 2.08e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8230 | 0.8220 | — | 0.8219 | 1.17e-3 | RECORDED | method | 1.17e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7029 | 0.7026 | — | 0.7026 | 3.09e-4 | RECORDED | method | 3.84e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9393 | 0.9390 | — | 0.9388 | 5.80e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8068 | 0.8059 | — | 0.8057 | 1.03e-3 | RECORDED | method | 1.06e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6729 | 0.6731 | — | 0.6731 | -1.64e-4 | RECORDED | method | 2.27e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9283 | 0.9279 | — | 0.9277 | 6.04e-4 | RECORDED | method | 2.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7308 | 0.7298 | — | 0.7297 | 1.13e-3 | RECORDED | method | 9.25e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5084 | 0.5083 | — | 0.5081 | 2.82e-4 | RECORDED | method | 1.64e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9199 | 0.9196 | — | 0.9194 | 5.15e-4 | RECORDED | method | 2.20e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.6995 | 0.6994 | — | 0.6997 | -1.41e-4 | RECORDED | method | -2.84e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.4882 | 0.4902 | — | 0.4908 | -2.65e-3 | RECORDED | method | -6.81e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9138 | 0.9132 | — | 0.9130 | 7.09e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6897 | 0.6886 | — | 0.6889 | 8.58e-4 | RECORDED | method | -2.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4658 | 0.4654 | — | 0.4654 | 3.74e-4 | RECORDED | method | -2.70e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 11.924 | ok | ok | ok | ok | 1.40e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 22.852 | ok | ok | ok | ok | 2.13e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.11e-4 | RECORDED | method | 2.15e-4 | RECORDED | method | 2.92e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8219 | 0.8207 | 0.8211 | 0.8206 | 1.26e-3 | RECORDED | method | 9.18e-5 | RECORDED | method | 4.07e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7032 | 0.7032 | 0.7035 | 0.7029 | 2.95e-4 | RECORDED | method | 2.79e-4 | RECORDED | method | 5.07e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.11e-4 | RECORDED | method | 2.15e-4 | RECORDED | method | 2.92e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8219 | 0.8207 | 0.8211 | 0.8206 | 1.26e-3 | RECORDED | method | 9.18e-5 | RECORDED | method | 4.07e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7032 | 0.7032 | 0.7035 | 0.7029 | 2.95e-4 | RECORDED | method | 2.79e-4 | RECORDED | method | 5.07e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9380 | 0.9376 | 0.9377 | 0.9374 | 6.26e-4 | RECORDED | method | 2.41e-4 | RECORDED | method | 3.16e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8092 | 0.8082 | 0.8085 | 0.8081 | 1.18e-3 | RECORDED | method | 1.15e-4 | RECORDED | method | 4.90e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6806 | 0.6810 | 0.6812 | 0.6806 | -3.63e-5 | RECORDED | method | 3.13e-4 | RECORDED | method | 6.01e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9372 | 0.9368 | 0.9369 | 0.9366 | 6.44e-4 | RECORDED | method | 2.20e-4 | RECORDED | method | 2.99e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8117 | 0.8105 | 0.8108 | 0.8104 | 1.27e-3 | RECORDED | method | 3.88e-5 | RECORDED | method | 4.21e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6862 | 0.6866 | 0.6867 | 0.6863 | -6.34e-5 | RECORDED | method | 3.18e-4 | RECORDED | method | 4.17e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9192 | 0.9189 | 0.9191 | 0.9186 | 5.78e-4 | RECORDED | method | 2.41e-4 | RECORDED | method | 5.13e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7070 | 0.7067 | 0.7081 | 0.7070 | -1.07e-5 | RECORDED | method | -2.59e-4 | RECORDED | method | 1.18e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.5064 | 0.5083 | 0.5100 | 0.5087 | -2.26e-3 | RECORDED | method | -4.24e-4 | RECORDED | method | 1.36e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9208 | 0.9202 | 0.9206 | 0.9200 | 7.44e-4 | RECORDED | method | 1.88e-4 | RECORDED | method | 5.35e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7520 | 0.7505 | 0.7518 | 0.7510 | 9.77e-4 | RECORDED | method | -4.49e-4 | RECORDED | method | 7.78e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.5910 | 0.5892 | 0.5899 | 0.5892 | 1.72e-3 | RECORDED | method | -1.49e-5 | RECORDED | method | 6.50e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikkor-z50f12-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 11.924 | ok | ok | — | ok | 1.95e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 22.852 | ok | ok | — | ok | 5.33e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9428 | 0.9425 | — | 0.9423 | 5.70e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8257 | 0.8247 | — | 0.8246 | 1.16e-3 | RECORDED | method | 9.27e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7085 | 0.7082 | — | 0.7082 | 3.56e-4 | RECORDED | method | 8.75e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9428 | 0.9425 | — | 0.9423 | 5.70e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8257 | 0.8247 | — | 0.8246 | 1.16e-3 | RECORDED | method | 9.27e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7085 | 0.7082 | — | 0.7082 | 3.56e-4 | RECORDED | method | 8.75e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9410 | 0.9407 | — | 0.9405 | 5.88e-4 | RECORDED | method | 2.20e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8177 | 0.8166 | — | 0.8165 | 1.15e-3 | RECORDED | method | 1.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6935 | 0.6934 | — | 0.6933 | 1.63e-4 | RECORDED | method | 9.59e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9283 | 0.9279 | — | 0.9277 | 5.92e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7316 | 0.7305 | — | 0.7305 | 1.10e-3 | RECORDED | method | 5.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5109 | 0.5107 | — | 0.5106 | 2.86e-4 | RECORDED | method | 1.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9249 | 0.9246 | — | 0.9244 | 5.57e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7287 | 0.7283 | — | 0.7285 | 2.42e-4 | RECORDED | method | -1.70e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5367 | 0.5382 | — | 0.5386 | -1.92e-3 | RECORDED | method | -4.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9162 | 0.9157 | — | 0.9155 | 7.01e-4 | RECORDED | method | 1.83e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7044 | 0.7031 | — | 0.7034 | 9.56e-4 | RECORDED | method | -2.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4892 | 0.4885 | — | 0.4885 | 6.95e-4 | RECORDED | method | 4.55e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 28.763 | ok | unconverged | unconverged | ok | 5.96e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | numerical | unconverged |
| 1 | 47.512 | ok | unconverged | unconverged | unconverged | 3.91e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | numerical | unconverged |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9716 | 0.9716 | 0.9735 | 0.9715 | 4.63e-5 | RECORDED | method | 6.23e-5 | RECORDED | method | 1.96e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.8654 | 0.8655 | 0.8726 | 0.8668 | -1.42e-3 | RECORDED | method | -1.24e-3 | RECORDED | method | 5.78e-3 | ATTENTION | method |
| 0 | sagittal | 50 | 0.7314 | 0.7315 | 0.7400 | 0.7335 | -2.13e-3 | RECORDED | method | -2.02e-3 | RECORDED | method | 6.45e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9716 | 0.9716 | 0.9735 | 0.9715 | 4.63e-5 | RECORDED | method | 6.23e-5 | RECORDED | method | 1.96e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.8654 | 0.8655 | 0.8726 | 0.8668 | -1.42e-3 | RECORDED | method | -1.24e-3 | RECORDED | method | 5.78e-3 | ATTENTION | method |
| 0 | tangential | 50 | 0.7314 | 0.7315 | 0.7400 | 0.7335 | -2.13e-3 | RECORDED | method | -2.02e-3 | RECORDED | method | 6.45e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.8490 | 0.8497 | 0.8606 | 0.8499 | -9.76e-4 | RECORDED | method | -2.53e-4 | SET ASIDE | numerical | 1.06e-2 | SET ASIDE | numerical |
| 0.5 | sagittal | 30 | 0.3156 | 0.3150 | 0.3331 | 0.3182 | -2.66e-3 | RECORDED | method | -3.20e-3 | SET ASIDE | numerical | 1.48e-2 | SET ASIDE | numerical |
| 0.5 | sagittal | 50 | 0.1650 | 0.1649 | 0.1457 | 0.1646 | 3.93e-4 | RECORDED | method | 3.03e-4 | SET ASIDE | numerical | -1.89e-2 | SET ASIDE | numerical |
| 0.5 | tangential | 10 | 0.6513 | 0.6503 | 0.6608 | 0.6521 | -8.76e-4 | RECORDED | method | -1.86e-3 | SET ASIDE | numerical | 8.63e-3 | SET ASIDE | numerical |
| 0.5 | tangential | 30 | 0.2821 | 0.2834 | 0.2884 | 0.2827 | -5.78e-4 | RECORDED | method | 7.51e-4 | SET ASIDE | numerical | 5.66e-3 | SET ASIDE | numerical |
| 0.5 | tangential | 50 | 0.1219 | 0.1225 | 0.1271 | 0.1228 | -9.29e-4 | RECORDED | method | -3.38e-4 | SET ASIDE | numerical | 4.26e-3 | SET ASIDE | numerical |
| 1 | sagittal | 10 | 0.5104 | 0.5097 | 0.5290 | 0.5105 | -1.23e-4 | SET ASIDE | numerical | -8.27e-4 | SET ASIDE | numerical | 1.85e-2 | SET ASIDE | numerical |
| 1 | sagittal | 30 | 0.2968 | 0.2967 | 0.3328 | 0.2990 | -2.24e-3 | SET ASIDE | numerical | -2.33e-3 | SET ASIDE | numerical | 3.38e-2 | SET ASIDE | numerical |
| 1 | sagittal | 50 | 0.0052 | 0.0065 | 0.0111 | 0.0041 | 1.11e-3 | SET ASIDE | numerical | 2.39e-3 | SET ASIDE | numerical | 6.99e-3 | SET ASIDE | numerical |
| 1 | tangential | 10 | 0.1516 | 0.1508 | 0.6422 | 0.1524 | -7.36e-4 | SET ASIDE | numerical | -1.62e-3 | SET ASIDE | numerical | 4.90e-1 | SET ASIDE | numerical |
| 1 | tangential | 30 | 0.1307 | 0.1340 | 0.2272 | 0.1305 | 1.71e-4 | SET ASIDE | numerical | 3.49e-3 | SET ASIDE | numerical | 9.67e-2 | SET ASIDE | numerical |
| 1 | tangential | 50 | 0.0752 | 0.0735 | 0.1052 | 0.0747 | 4.74e-4 | SET ASIDE | numerical | -1.22e-3 | SET ASIDE | numerical | 3.05e-2 | SET ASIDE | numerical |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 28.763 | ok | unconverged | — | unconverged | 1.60e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 47.512 | ok | unconverged | — | unconverged | 3.20e-14 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9715 | 0.9716 | — | 0.9715 | -1.92e-5 | RECORDED | method | 9.36e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8630 | 0.8632 | — | 0.8644 | -1.40e-3 | RECORDED | method | -1.21e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7284 | 0.7290 | — | 0.7313 | -2.95e-3 | RECORDED | method | -2.34e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9715 | 0.9716 | — | 0.9715 | -1.92e-5 | RECORDED | method | 9.36e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8630 | 0.8632 | — | 0.8644 | -1.40e-3 | RECORDED | method | -1.21e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7284 | 0.7290 | — | 0.7313 | -2.95e-3 | RECORDED | method | -2.34e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8433 | 0.8447 | — | 0.8456 | -2.28e-3 | SET ASIDE | numerical | -8.20e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.3227 | 0.3236 | — | 0.3267 | -3.98e-3 | SET ASIDE | numerical | -3.11e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.1723 | 0.1715 | — | 0.1718 | 4.65e-4 | SET ASIDE | numerical | -3.05e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.6456 | 0.6450 | — | 0.6469 | -1.32e-3 | SET ASIDE | numerical | -1.98e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.2655 | 0.2658 | — | 0.2661 | -6.06e-4 | SET ASIDE | numerical | -2.76e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.1113 | 0.1113 | — | 0.1118 | -5.16e-4 | SET ASIDE | numerical | -5.23e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.5138 | 0.5147 | — | 0.5159 | -2.11e-3 | SET ASIDE | numerical | -1.16e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.2878 | 0.2883 | — | 0.2897 | -1.83e-3 | SET ASIDE | numerical | -1.35e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.0253 | 0.0238 | — | 0.0257 | -4.02e-4 | SET ASIDE | numerical | -1.91e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.1352 | 0.1356 | — | 0.1373 | -2.02e-3 | SET ASIDE | numerical | -1.63e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.0859 | 0.0832 | — | 0.0845 | 1.39e-3 | SET ASIDE | numerical | -1.27e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.0344 | 0.0350 | — | 0.0347 | -3.58e-4 | SET ASIDE | numerical | 2.09e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 28.763 | ok | ok | ok | ok | 9.94e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 47.512 | ok | ok | no curve | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.53e-4 | RECORDED | method | 2.18e-4 | RECORDED | method | 4.04e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8216 | 0.8203 | 0.8209 | 0.8202 | 1.36e-3 | RECORDED | method | 9.87e-5 | RECORDED | method | 6.43e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7028 | 0.7027 | 0.7031 | 0.7024 | 3.94e-4 | RECORDED | method | 2.91e-4 | RECORDED | method | 7.64e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.53e-4 | RECORDED | method | 2.18e-4 | RECORDED | method | 4.04e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8216 | 0.8203 | 0.8209 | 0.8202 | 1.36e-3 | RECORDED | method | 9.87e-5 | RECORDED | method | 6.43e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7028 | 0.7027 | 0.7031 | 0.7024 | 3.94e-4 | RECORDED | method | 2.91e-4 | RECORDED | method | 7.64e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9296 | 0.9292 | 0.9295 | 0.9289 | 6.94e-4 | RECORDED | method | 3.06e-4 | RECORDED | method | 5.32e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7677 | 0.7669 | 0.7678 | 0.7668 | 8.65e-4 | RECORDED | method | 7.22e-5 | RECORDED | method | 1.04e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6093 | 0.6103 | 0.6112 | 0.6101 | -7.54e-4 | RECORDED | method | 2.60e-4 | RECORDED | method | 1.14e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9156 | 0.9152 | 0.9155 | 0.9149 | 7.86e-4 | RECORDED | method | 3.25e-4 | RECORDED | method | 6.63e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7163 | 0.7157 | 0.7171 | 0.7159 | 4.16e-4 | RECORDED | method | -1.72e-4 | RECORDED | method | 1.26e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5342 | 0.5345 | 0.5361 | 0.5346 | -3.80e-4 | RECORDED | method | -4.35e-5 | RECORDED | method | 1.51e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.8665 | 0.8665 | — | 0.8661 | 3.48e-4 | RECORDED | method | 3.42e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4811 | 0.4813 | — | 0.4828 | -1.64e-3 | RECORDED | method | -1.50e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2163 | 0.2168 | — | 0.2192 | -2.91e-3 | RECORDED | method | -2.43e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.7720 | 0.7720 | — | 0.7713 | 6.96e-4 | RECORDED | method | 6.34e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3132 | 0.3132 | — | 0.3152 | -2.06e-3 | RECORDED | method | -2.08e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1462 | 0.1465 | — | 0.1486 | -2.32e-3 | RECORDED | method | -2.09e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 28.763 | ok | ok | — | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 47.512 | ok | ok | — | ok | 4.62e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9429 | 0.9425 | — | 0.9423 | 6.26e-4 | RECORDED | method | 2.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8271 | 0.8259 | — | 0.8258 | 1.31e-3 | RECORDED | method | 1.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7110 | 0.7105 | — | 0.7105 | 5.64e-4 | RECORDED | method | 8.99e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9429 | 0.9425 | — | 0.9423 | 6.26e-4 | RECORDED | method | 2.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8271 | 0.8259 | — | 0.8258 | 1.31e-3 | RECORDED | method | 1.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7110 | 0.7105 | — | 0.7105 | 5.64e-4 | RECORDED | method | 8.99e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9313 | 0.9309 | — | 0.9306 | 6.42e-4 | RECORDED | method | 2.86e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7668 | 0.7661 | — | 0.7660 | 7.63e-4 | RECORDED | method | 7.73e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6037 | 0.6046 | — | 0.6046 | -9.30e-4 | RECORDED | method | 5.54e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9169 | 0.9164 | — | 0.9161 | 7.28e-4 | RECORDED | method | 3.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7101 | 0.7096 | — | 0.7098 | 3.01e-4 | RECORDED | method | -1.81e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5163 | 0.5171 | — | 0.5172 | -9.46e-4 | RECORDED | method | -1.32e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8688 | 0.8687 | — | 0.8684 | 3.94e-4 | RECORDED | method | 3.12e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4770 | 0.4784 | — | 0.4797 | -2.72e-3 | RECORDED | method | -1.34e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2015 | 0.2045 | — | 0.2068 | -5.36e-3 | RECORDED | method | -2.38e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.7668 | 0.7670 | — | 0.7664 | 4.02e-4 | RECORDED | method | 5.97e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.2786 | 0.2805 | — | 0.2825 | -3.92e-3 | RECORDED | method | -2.01e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1057 | 0.1075 | — | 0.1100 | -4.30e-3 | RECORDED | method | -2.43e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 28.763 | ok | ok | ok | ok | 9.90e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 47.512 | ok | ok | no curve | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.52e-4 | RECORDED | method | 2.18e-4 | RECORDED | method | 4.03e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8216 | 0.8203 | 0.8209 | 0.8202 | 1.36e-3 | RECORDED | method | 9.74e-5 | RECORDED | method | 6.42e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7028 | 0.7027 | 0.7031 | 0.7024 | 3.92e-4 | RECORDED | method | 2.89e-4 | RECORDED | method | 7.62e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.52e-4 | RECORDED | method | 2.18e-4 | RECORDED | method | 4.03e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8216 | 0.8203 | 0.8209 | 0.8202 | 1.36e-3 | RECORDED | method | 9.74e-5 | RECORDED | method | 6.42e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7028 | 0.7027 | 0.7031 | 0.7024 | 3.92e-4 | RECORDED | method | 2.89e-4 | RECORDED | method | 7.62e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9297 | 0.9293 | 0.9295 | 0.9290 | 6.94e-4 | RECORDED | method | 3.06e-4 | RECORDED | method | 5.31e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7681 | 0.7673 | 0.7683 | 0.7672 | 8.71e-4 | RECORDED | method | 7.35e-5 | RECORDED | method | 1.04e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6101 | 0.6111 | 0.6119 | 0.6108 | -7.43e-4 | RECORDED | method | 2.63e-4 | RECORDED | method | 1.14e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9157 | 0.9153 | 0.9156 | 0.9149 | 7.86e-4 | RECORDED | method | 3.25e-4 | RECORDED | method | 6.62e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7168 | 0.7162 | 0.7176 | 0.7163 | 4.23e-4 | RECORDED | method | -1.71e-4 | RECORDED | method | 1.26e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5349 | 0.5352 | 0.5368 | 0.5353 | -3.65e-4 | RECORDED | method | -3.85e-5 | RECORDED | method | 1.51e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.8667 | 0.8666 | — | 0.8663 | 3.48e-4 | RECORDED | method | 3.42e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4819 | 0.4821 | — | 0.4835 | -1.63e-3 | RECORDED | method | -1.50e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2173 | 0.2177 | — | 0.2202 | -2.90e-3 | RECORDED | method | -2.42e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.7722 | 0.7721 | — | 0.7715 | 6.97e-4 | RECORDED | method | 6.35e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3136 | 0.3136 | — | 0.3156 | -2.06e-3 | RECORDED | method | -2.07e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1465 | 0.1468 | — | 0.1488 | -2.31e-3 | RECORDED | method | -2.09e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-20mm-f18-g-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 28.763 | ok | ok | — | ok | 1.78e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 47.512 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9431 | 0.9427 | — | 0.9425 | 6.17e-4 | RECORDED | method | 1.98e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8281 | 0.8270 | — | 0.8269 | 1.29e-3 | RECORDED | method | 1.01e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7133 | 0.7128 | — | 0.7127 | 5.53e-4 | RECORDED | method | 4.93e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9431 | 0.9427 | — | 0.9425 | 6.17e-4 | RECORDED | method | 1.98e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8281 | 0.8270 | — | 0.8269 | 1.29e-3 | RECORDED | method | 1.01e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7133 | 0.7128 | — | 0.7127 | 5.53e-4 | RECORDED | method | 4.94e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9332 | 0.9329 | — | 0.9326 | 6.55e-4 | RECORDED | method | 2.82e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7789 | 0.7781 | — | 0.7780 | 9.26e-4 | RECORDED | method | 1.14e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6253 | 0.6259 | — | 0.6258 | -5.59e-4 | RECORDED | method | 1.15e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9192 | 0.9187 | — | 0.9184 | 7.43e-4 | RECORDED | method | 3.01e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7229 | 0.7223 | — | 0.7224 | 4.93e-4 | RECORDED | method | -1.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5365 | 0.5371 | — | 0.5371 | -5.74e-4 | RECORDED | method | 1.54e-7 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8739 | 0.8737 | — | 0.8734 | 4.38e-4 | RECORDED | method | 3.23e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4997 | 0.5009 | — | 0.5021 | -2.43e-3 | RECORDED | method | -1.21e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2282 | 0.2311 | — | 0.2333 | -5.09e-3 | RECORDED | method | -2.20e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.7714 | 0.7715 | — | 0.7709 | 4.61e-4 | RECORDED | method | 6.13e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.2899 | 0.2917 | — | 0.2936 | -3.70e-3 | RECORDED | method | -1.86e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1129 | 0.1147 | — | 0.1169 | -4.09e-3 | RECORDED | method | -2.26e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 1.591 | ok | ok | ok | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 3.148 | ok | unconverged | ok | ok | 1.53e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9775 | 0.9771 | 0.9778 | 0.9770 | 5.62e-4 | RECORDED | method | 1.19e-4 | RECORDED | method | 8.57e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9322 | 0.9310 | 0.9330 | 0.9307 | 1.47e-3 | RECORDED | method | 3.06e-4 | RECORDED | method | 2.33e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8867 | 0.8848 | 0.8879 | 0.8844 | 2.30e-3 | RECORDED | method | 4.14e-4 | RECORDED | method | 3.47e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9775 | 0.9771 | 0.9778 | 0.9770 | 5.62e-4 | RECORDED | method | 1.19e-4 | RECORDED | method | 8.57e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9322 | 0.9310 | 0.9330 | 0.9307 | 1.47e-3 | RECORDED | method | 3.06e-4 | RECORDED | method | 2.33e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8867 | 0.8848 | 0.8879 | 0.8844 | 2.30e-3 | RECORDED | method | 4.14e-4 | RECORDED | method | 3.47e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9755 | 0.9757 | 0.9762 | 0.9755 | 3.20e-5 | RECORDED | method | 1.89e-4 | RECORDED | method | 7.02e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.9220 | 0.9227 | 0.9242 | 0.9223 | -2.90e-4 | RECORDED | method | 4.56e-4 | RECORDED | method | 1.88e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.8665 | 0.8682 | 0.8703 | 0.8676 | -1.10e-3 | RECORDED | method | 5.98e-4 | RECORDED | method | 2.71e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9718 | 0.9715 | 0.9720 | 0.9714 | 3.43e-4 | RECORDED | method | 7.59e-5 | RECORDED | method | 5.30e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.9081 | 0.9075 | 0.9085 | 0.9074 | 7.13e-4 | RECORDED | method | 9.55e-5 | RECORDED | method | 1.12e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.8402 | 0.8395 | 0.8409 | 0.8396 | 5.56e-4 | RECORDED | method | -9.29e-5 | RECORDED | method | 1.26e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9728 | 0.9725 | 0.9725 | 0.9722 | 6.21e-4 | RECORDED | method | 3.06e-4 | SET ASIDE | numerical | 3.32e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.9108 | 0.9103 | 0.9099 | 0.9091 | 1.62e-3 | RECORDED | method | 1.14e-3 | SET ASIDE | numerical | 7.98e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.8462 | 0.8454 | 0.8448 | 0.8437 | 2.45e-3 | RECORDED | method | 1.70e-3 | SET ASIDE | numerical | 1.02e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9485 | 0.9483 | 0.9479 | 0.9483 | 1.62e-4 | RECORDED | method | -9.00e-6 | SET ASIDE | numerical | -4.33e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.8379 | 0.8376 | 0.8365 | 0.8380 | -5.48e-5 | RECORDED | method | -4.36e-4 | SET ASIDE | numerical | -1.48e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.7306 | 0.7299 | 0.7279 | 0.7305 | 3.34e-5 | RECORDED | method | -5.94e-4 | SET ASIDE | numerical | -2.63e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 1.591 | ok | ok | — | ok | 5.15e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 3.148 | ok | ok | — | ok | 8.17e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9768 | 0.9764 | — | 0.9763 | 5.31e-4 | RECORDED | method | 1.08e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.9209 | 0.9198 | — | 0.9195 | 1.33e-3 | RECORDED | method | 2.45e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8563 | 0.8547 | — | 0.8544 | 1.94e-3 | RECORDED | method | 2.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9768 | 0.9764 | — | 0.9763 | 5.31e-4 | RECORDED | method | 1.08e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.9209 | 0.9198 | — | 0.9195 | 1.33e-3 | RECORDED | method | 2.45e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8563 | 0.8547 | — | 0.8544 | 1.94e-3 | RECORDED | method | 2.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9745 | 0.9746 | — | 0.9745 | 1.26e-5 | RECORDED | method | 1.56e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.9082 | 0.9090 | — | 0.9087 | -4.55e-4 | RECORDED | method | 3.33e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.8317 | 0.8333 | — | 0.8329 | -1.19e-3 | RECORDED | method | 4.01e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9715 | 0.9712 | — | 0.9712 | 2.88e-4 | RECORDED | method | 6.85e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.9003 | 0.9000 | — | 0.8999 | 3.71e-4 | RECORDED | method | 5.61e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.8210 | 0.8208 | — | 0.8209 | 1.04e-4 | RECORDED | method | -4.89e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9705 | 0.9702 | — | 0.9700 | 4.74e-4 | RECORDED | method | 1.86e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8889 | 0.8886 | — | 0.8880 | 9.35e-4 | RECORDED | method | 5.89e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.7965 | 0.7959 | — | 0.7951 | 1.45e-3 | RECORDED | method | 8.42e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9472 | 0.9470 | — | 0.9470 | 1.22e-4 | RECORDED | method | -3.41e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.8172 | 0.8169 | — | 0.8175 | -2.35e-4 | RECORDED | method | -5.30e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.6785 | 0.6781 | — | 0.6785 | -3.49e-5 | RECORDED | method | -3.95e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 1.591 | ok | ok | ok | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 3.148 | ok | ok | ok | ok | 8.69e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9356 | 0.9352 | 0.9355 | 0.9350 | 5.79e-4 | RECORDED | method | 1.60e-4 | RECORDED | method | 4.35e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.7912 | 0.7902 | 0.7910 | 0.7904 | 8.42e-4 | RECORDED | method | -1.49e-4 | RECORDED | method | 6.74e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.6466 | 0.6472 | 0.6481 | 0.6474 | -7.34e-4 | RECORDED | method | -1.80e-4 | RECORDED | method | 6.98e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9356 | 0.9352 | 0.9355 | 0.9350 | 5.79e-4 | RECORDED | method | 1.60e-4 | RECORDED | method | 4.35e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.7912 | 0.7902 | 0.7910 | 0.7904 | 8.42e-4 | RECORDED | method | -1.49e-4 | RECORDED | method | 6.74e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.6466 | 0.6472 | 0.6481 | 0.6474 | -7.34e-4 | RECORDED | method | -1.80e-4 | RECORDED | method | 6.98e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9365 | 0.9361 | 0.9364 | 0.9359 | 5.90e-4 | RECORDED | method | 1.57e-4 | RECORDED | method | 4.45e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7984 | 0.7973 | 0.7982 | 0.7974 | 9.22e-4 | RECORDED | method | -1.43e-4 | RECORDED | method | 7.07e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6606 | 0.6610 | 0.6619 | 0.6612 | -5.61e-4 | RECORDED | method | -1.36e-4 | RECORDED | method | 7.41e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9368 | 0.9363 | 0.9367 | 0.9362 | 6.03e-4 | RECORDED | method | 1.17e-4 | RECORDED | method | 4.80e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8027 | 0.8016 | 0.8025 | 0.8018 | 9.37e-4 | RECORDED | method | -1.90e-4 | RECORDED | method | 7.78e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6698 | 0.6701 | 0.6711 | 0.6703 | -5.06e-4 | RECORDED | method | -2.01e-4 | RECORDED | method | 7.86e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9368 | 0.9357 | 0.9361 | 0.9358 | 9.88e-4 | RECORDED | method | -9.98e-5 | RECORDED | method | 2.70e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7992 | 0.7963 | 0.7974 | 0.7970 | 2.25e-3 | RECORDED | method | -6.22e-4 | RECORDED | method | 4.81e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6636 | 0.6600 | 0.6618 | 0.6612 | 2.41e-3 | RECORDED | method | -1.20e-3 | RECORDED | method | 5.84e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9338 | 0.9335 | 0.9340 | 0.9334 | 4.30e-4 | RECORDED | method | 4.89e-5 | RECORDED | method | 6.33e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7931 | 0.7922 | 0.7938 | 0.7926 | 5.06e-4 | RECORDED | method | -3.84e-4 | RECORDED | method | 1.15e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.6567 | 0.6573 | 0.6587 | 0.6576 | -9.03e-4 | RECORDED | method | -3.58e-4 | RECORDED | method | 1.03e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 1.591 | ok | ok | — | ok | 7.99e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 3.148 | ok | ok | — | ok | 1.78e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9396 | 0.9392 | — | 0.9390 | 5.67e-4 | RECORDED | method | 1.53e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8064 | 0.8053 | — | 0.8054 | 9.30e-4 | RECORDED | method | -9.03e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6730 | 0.6729 | — | 0.6732 | -2.32e-4 | RECORDED | method | -3.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9396 | 0.9392 | — | 0.9390 | 5.67e-4 | RECORDED | method | 1.53e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8064 | 0.8053 | — | 0.8054 | 9.30e-4 | RECORDED | method | -9.03e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6730 | 0.6729 | — | 0.6732 | -2.32e-4 | RECORDED | method | -3.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9403 | 0.9399 | — | 0.9397 | 5.77e-4 | RECORDED | method | 1.50e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8121 | 0.8110 | — | 0.8111 | 9.93e-4 | RECORDED | method | -8.77e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6843 | 0.6842 | — | 0.6844 | -9.40e-5 | RECORDED | method | -2.66e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9387 | 0.9382 | — | 0.9381 | 5.85e-4 | RECORDED | method | 1.07e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8022 | 0.8010 | — | 0.8011 | 1.01e-3 | RECORDED | method | -1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6617 | 0.6615 | — | 0.6618 | -7.01e-5 | RECORDED | method | -2.67e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9406 | 0.9397 | — | 0.9398 | 7.87e-4 | RECORDED | method | -1.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8132 | 0.8109 | — | 0.8114 | 1.79e-3 | RECORDED | method | -4.62e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6875 | 0.6853 | — | 0.6856 | 1.94e-3 | RECORDED | method | -2.22e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9335 | 0.9330 | — | 0.9330 | 5.18e-4 | RECORDED | method | 3.13e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7761 | 0.7750 | — | 0.7752 | 9.02e-4 | RECORDED | method | -2.42e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.6129 | 0.6126 | — | 0.6130 | -1.78e-4 | RECORDED | method | -4.15e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 1.591 | ok | ok | ok | ok | 3.20e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 3.148 | ok | ok | ok | ok | 1.34e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9397 | 6.75e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 4.64e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8214 | 0.8201 | 0.8208 | 0.8200 | 1.42e-3 | RECORDED | method | 1.01e-4 | RECORDED | method | 7.72e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7025 | 0.7024 | 0.7030 | 0.7021 | 4.48e-4 | RECORDED | method | 2.97e-4 | RECORDED | method | 9.04e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9397 | 6.75e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 4.64e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8214 | 0.8201 | 0.8208 | 0.8200 | 1.42e-3 | RECORDED | method | 1.01e-4 | RECORDED | method | 7.72e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7025 | 0.7024 | 0.7030 | 0.7021 | 4.48e-4 | RECORDED | method | 2.97e-4 | RECORDED | method | 9.04e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9400 | 0.9396 | 0.9398 | 0.9393 | 6.81e-4 | RECORDED | method | 2.13e-4 | RECORDED | method | 4.75e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8199 | 0.8185 | 0.8192 | 0.8184 | 1.43e-3 | RECORDED | method | 8.46e-5 | RECORDED | method | 8.02e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6997 | 0.6996 | 0.7002 | 0.6993 | 4.23e-4 | RECORDED | method | 2.88e-4 | RECORDED | method | 9.38e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9392 | 0.9387 | 0.9390 | 0.9385 | 6.96e-4 | RECORDED | method | 1.74e-4 | RECORDED | method | 4.98e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8162 | 0.8148 | 0.8156 | 0.8148 | 1.43e-3 | RECORDED | method | 3.18e-5 | RECORDED | method | 8.22e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6930 | 0.6929 | 0.6936 | 0.6927 | 3.22e-4 | RECORDED | method | 1.87e-4 | RECORDED | method | 9.27e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9394 | 0.9393 | 0.9396 | 0.9393 | 6.96e-5 | RECORDED | method | -4.05e-5 | RECORDED | method | 2.61e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.8173 | 0.8171 | 0.8178 | 0.8174 | -1.23e-4 | RECORDED | method | -3.76e-4 | RECORDED | method | 3.91e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6962 | 0.6959 | 0.6972 | 0.6966 | -3.95e-4 | RECORDED | method | -7.45e-4 | RECORDED | method | 5.52e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9368 | 0.9366 | 0.9370 | 0.9365 | 3.37e-4 | RECORDED | method | 1.23e-4 | RECORDED | method | 5.55e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.8084 | 0.8080 | 0.8089 | 0.8081 | 2.71e-4 | RECORDED | method | -7.37e-5 | RECORDED | method | 8.48e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.6821 | 0.6815 | 0.6823 | 0.6814 | 7.47e-4 | RECORDED | method | 1.47e-4 | RECORDED | method | 8.95e-4 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sony-fe-400mm-f28-gm-oss-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 1.591 | ok | ok | — | ok | 6.75e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 3.148 | ok | ok | — | ok | 1.78e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9431 | 0.9426 | — | 0.9424 | 6.40e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8283 | 0.8271 | — | 0.8270 | 1.35e-3 | RECORDED | method | 1.06e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7137 | 0.7132 | — | 0.7131 | 6.29e-4 | RECORDED | method | 5.77e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9431 | 0.9426 | — | 0.9424 | 6.40e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8283 | 0.8271 | — | 0.8270 | 1.35e-3 | RECORDED | method | 1.06e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7137 | 0.7132 | — | 0.7131 | 6.29e-4 | RECORDED | method | 5.77e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9428 | 0.9423 | — | 0.9421 | 6.46e-4 | RECORDED | method | 1.94e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8270 | 0.8257 | — | 0.8257 | 1.36e-3 | RECORDED | method | 8.96e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7112 | 0.7106 | — | 0.7106 | 6.17e-4 | RECORDED | method | 5.17e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9408 | 0.9403 | — | 0.9401 | 6.64e-4 | RECORDED | method | 1.54e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8140 | 0.8127 | — | 0.8126 | 1.40e-3 | RECORDED | method | 5.90e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6813 | 0.6807 | — | 0.6806 | 6.93e-4 | RECORDED | method | 5.59e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9431 | 0.9421 | — | 0.9422 | 8.78e-4 | RECORDED | method | -5.54e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8272 | 0.8246 | — | 0.8249 | 2.28e-3 | RECORDED | method | -2.65e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.7112 | 0.7084 | — | 0.7083 | 2.87e-3 | RECORDED | method | 1.20e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9358 | 0.9354 | — | 0.9353 | 5.35e-4 | RECORDED | method | 8.28e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7871 | 0.7862 | — | 0.7862 | 8.97e-4 | RECORDED | method | -4.93e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.6276 | 0.6277 | — | 0.6279 | -2.31e-4 | RECORDED | method | -1.07e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 5.938 | ok | ok | ok | ok | 3.98e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.651 | ok | ok | ok | ok | 2.13e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9739 | 0.9737 | 0.9748 | 0.9735 | 4.03e-4 | RECORDED | method | 1.79e-4 | RECORDED | method | 1.31e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.9119 | 0.9115 | 0.9148 | 0.9114 | 4.80e-4 | RECORDED | method | 1.74e-4 | RECORDED | method | 3.48e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8432 | 0.8437 | 0.8482 | 0.8434 | -1.69e-4 | RECORDED | method | 3.28e-4 | RECORDED | method | 4.87e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9739 | 0.9737 | 0.9748 | 0.9735 | 4.03e-4 | RECORDED | method | 1.79e-4 | RECORDED | method | 1.31e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.9119 | 0.9115 | 0.9148 | 0.9114 | 4.80e-4 | RECORDED | method | 1.74e-4 | RECORDED | method | 3.48e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8432 | 0.8437 | 0.8482 | 0.8434 | -1.69e-4 | RECORDED | method | 3.28e-4 | RECORDED | method | 4.87e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9585 | 0.9583 | 0.9605 | 0.9583 | 1.93e-4 | RECORDED | method | -3.45e-5 | RECORDED | method | 2.14e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8061 | 0.8059 | 0.8149 | 0.8068 | -6.48e-4 | RECORDED | method | -8.37e-4 | RECORDED | method | 8.12e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6215 | 0.6218 | 0.6334 | 0.6231 | -1.64e-3 | RECORDED | method | -1.36e-3 | RECORDED | method | 1.03e-2 | ATTENTION | method |
| 0.5 | tangential | 10 | 0.9178 | 0.9177 | 0.9200 | 0.9177 | 9.61e-5 | RECORDED | method | -6.23e-5 | RECORDED | method | 2.28e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.5785 | 0.5789 | 0.5821 | 0.5799 | -1.40e-3 | RECORDED | method | -1.09e-3 | RECORDED | method | 2.17e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.2651 | 0.2666 | 0.2564 | 0.2677 | -2.57e-3 | RECORDED | method | -1.11e-3 | RECORDED | method | -1.12e-2 | ATTENTION | method |
| 1 | sagittal | 10 | 0.9487 | 0.9484 | 0.9486 | 0.9484 | 2.95e-4 | RECORDED | method | 5.10e-5 | RECORDED | method | 2.29e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7785 | 0.7780 | 0.7759 | 0.7778 | 6.90e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | -1.90e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.6165 | 0.6158 | 0.6077 | 0.6150 | 1.45e-3 | RECORDED | method | 7.69e-4 | RECORDED | method | -7.30e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9179 | 0.9177 | 0.9073 | 0.9178 | 1.32e-4 | RECORDED | method | -6.29e-5 | RECORDED | method | -1.04e-2 | ATTENTION | method |
| 1 | tangential | 30 | 0.6330 | 0.6332 | 0.5961 | 0.6344 | -1.47e-3 | RECORDED | method | -1.21e-3 | RECORDED | method | -3.83e-2 | ATTENTION | method |
| 1 | tangential | 50 | 0.4125 | 0.4128 | 0.3848 | 0.4132 | -6.93e-4 | RECORDED | method | -3.81e-4 | RECORDED | method | -2.84e-2 | ATTENTION | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 5.938 | ok | ok | — | ok | 5.33e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.650 | ok | ok | — | ok | 8.17e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9733 | 0.9732 | — | 0.9730 | 2.79e-4 | RECORDED | method | 1.51e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.9023 | 0.9029 | — | 0.9028 | -4.46e-4 | RECORDED | method | 6.57e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8220 | 0.8234 | — | 0.8233 | -1.29e-3 | RECORDED | method | 4.91e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9733 | 0.9732 | — | 0.9730 | 2.79e-4 | RECORDED | method | 1.51e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.9023 | 0.9029 | — | 0.9028 | -4.46e-4 | RECORDED | method | 6.57e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8220 | 0.8234 | — | 0.8233 | -1.29e-3 | RECORDED | method | 4.91e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9600 | 0.9598 | — | 0.9599 | 1.25e-4 | RECORDED | method | -6.73e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8133 | 0.8134 | — | 0.8143 | -9.77e-4 | RECORDED | method | -9.36e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6376 | 0.6380 | — | 0.6396 | -1.92e-3 | RECORDED | method | -1.59e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9189 | 0.9188 | — | 0.9189 | -4.16e-5 | RECORDED | method | -1.56e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.5823 | 0.5826 | — | 0.5840 | -1.68e-3 | RECORDED | method | -1.35e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.2744 | 0.2752 | — | 0.2762 | -1.79e-3 | RECORDED | method | -9.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9452 | 0.9450 | — | 0.9451 | 1.33e-4 | RECORDED | method | -7.88e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7640 | 0.7637 | — | 0.7641 | -1.29e-4 | RECORDED | method | -4.48e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6133 | 0.6127 | — | 0.6131 | 1.56e-4 | RECORDED | method | -4.42e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9191 | 0.9189 | — | 0.9190 | 6.50e-5 | RECORDED | method | -1.18e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6285 | 0.6289 | — | 0.6301 | -1.66e-3 | RECORDED | method | -1.26e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3933 | 0.3936 | — | 0.3944 | -1.03e-3 | RECORDED | method | -7.35e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 5.938 | ok | ok | ok | ok | 4.92e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.651 | ok | ok | ok | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9403 | 0.9398 | 0.9401 | 0.9396 | 7.01e-4 | RECORDED | method | 2.13e-4 | RECORDED | method | 5.49e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8211 | 0.8197 | 0.8205 | 0.8196 | 1.48e-3 | RECORDED | method | 8.44e-5 | RECORDED | method | 9.50e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7020 | 0.7018 | 0.7026 | 0.7015 | 4.95e-4 | RECORDED | method | 2.75e-4 | RECORDED | method | 1.09e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9403 | 0.9398 | 0.9401 | 0.9396 | 7.01e-4 | RECORDED | method | 2.13e-4 | RECORDED | method | 5.49e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8211 | 0.8197 | 0.8205 | 0.8196 | 1.48e-3 | RECORDED | method | 8.44e-5 | RECORDED | method | 9.50e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7020 | 0.7018 | 0.7026 | 0.7015 | 4.95e-4 | RECORDED | method | 2.75e-4 | RECORDED | method | 1.09e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9341 | 0.9336 | 0.9340 | 0.9334 | 7.18e-4 | RECORDED | method | 2.51e-4 | RECORDED | method | 6.50e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7840 | 0.7829 | 0.7841 | 0.7828 | 1.16e-3 | RECORDED | method | 7.75e-5 | RECORDED | method | 1.25e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6338 | 0.6344 | 0.6357 | 0.6343 | -4.21e-4 | RECORDED | method | 1.41e-4 | RECORDED | method | 1.42e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9287 | 0.9281 | 0.9287 | 0.9279 | 7.22e-4 | RECORDED | method | 2.01e-4 | RECORDED | method | 7.36e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7571 | 0.7563 | 0.7578 | 0.7564 | 7.09e-4 | RECORDED | method | -1.06e-4 | RECORDED | method | 1.38e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5896 | 0.5905 | 0.5923 | 0.5908 | -1.21e-3 | RECORDED | method | -2.31e-4 | RECORDED | method | 1.51e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9285 | 0.9294 | 0.9295 | 0.9292 | -7.17e-4 | RECORDED | method | 2.06e-4 | RECORDED | method | 2.51e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7476 | 0.7499 | 0.7499 | 0.7497 | -2.15e-3 | RECORDED | method | 1.33e-4 | RECORDED | method | 1.49e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.5709 | 0.5726 | 0.5726 | 0.5727 | -1.79e-3 | RECORDED | method | -1.25e-4 | RECORDED | method | -6.56e-5 | RECORDED | method |
| 1 | tangential | 10 | 0.9156 | 0.9152 | 0.9149 | 0.9150 | 5.21e-4 | RECORDED | method | 1.63e-4 | RECORDED | method | -9.77e-5 | RECORDED | method |
| 1 | tangential | 30 | 0.7313 | 0.7313 | 0.7296 | 0.7313 | 4.34e-5 | RECORDED | method | 3.81e-5 | RECORDED | method | -1.72e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.5598 | 0.5615 | 0.5582 | 0.5615 | -1.76e-3 | RECORDED | method | 2.35e-6 | RECORDED | method | -3.33e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 5.938 | ok | ok | — | ok | 5.33e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.650 | ok | ok | — | ok | 4.26e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9430 | 0.9425 | — | 0.9423 | 6.72e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8278 | 0.8265 | — | 0.8264 | 1.42e-3 | RECORDED | method | 9.70e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7127 | 0.7120 | — | 0.7119 | 7.21e-4 | RECORDED | method | 5.44e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9430 | 0.9425 | — | 0.9423 | 6.72e-4 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8278 | 0.8265 | — | 0.8264 | 1.42e-3 | RECORDED | method | 9.70e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7127 | 0.7120 | — | 0.7119 | 7.21e-4 | RECORDED | method | 5.44e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9362 | 0.9357 | — | 0.9355 | 6.77e-4 | RECORDED | method | 2.27e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7861 | 0.7850 | — | 0.7850 | 1.09e-3 | RECORDED | method | 5.98e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6336 | 0.6338 | — | 0.6340 | -3.57e-4 | RECORDED | method | -1.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9268 | 0.9263 | — | 0.9261 | 6.76e-4 | RECORDED | method | 1.80e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7285 | 0.7277 | — | 0.7277 | 7.56e-4 | RECORDED | method | -4.40e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5215 | 0.5222 | — | 0.5225 | -9.25e-4 | RECORDED | method | -2.83e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9338 | 0.9333 | — | 0.9332 | 6.20e-4 | RECORDED | method | 1.56e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7640 | 0.7633 | — | 0.7633 | 7.71e-4 | RECORDED | method | 5.77e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5925 | 0.5919 | — | 0.5923 | 2.16e-4 | RECORDED | method | -3.39e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9156 | 0.9153 | — | 0.9152 | 4.40e-4 | RECORDED | method | 1.78e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7155 | 0.7149 | — | 0.7150 | 4.96e-4 | RECORDED | method | -1.70e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.5202 | 0.5211 | — | 0.5211 | -9.17e-4 | RECORDED | method | -2.24e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 5.938 | ok | ok | ok | ok | 5.13e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.651 | ok | ok | ok | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9403 | 0.9398 | 0.9401 | 0.9396 | 7.04e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | 5.52e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8211 | 0.8197 | 0.8206 | 0.8196 | 1.49e-3 | RECORDED | method | 9.32e-5 | RECORDED | method | 9.58e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7021 | 0.7019 | 0.7027 | 0.7016 | 5.13e-4 | RECORDED | method | 2.89e-4 | RECORDED | method | 1.10e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9403 | 0.9398 | 0.9401 | 0.9396 | 7.04e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | 5.52e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8211 | 0.8197 | 0.8206 | 0.8196 | 1.49e-3 | RECORDED | method | 9.32e-5 | RECORDED | method | 9.58e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7021 | 0.7019 | 0.7027 | 0.7016 | 5.13e-4 | RECORDED | method | 2.89e-4 | RECORDED | method | 1.10e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9335 | 0.9331 | 0.9335 | 0.9328 | 7.15e-4 | RECORDED | method | 2.52e-4 | RECORDED | method | 6.57e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7807 | 0.7796 | 0.7808 | 0.7795 | 1.12e-3 | RECORDED | method | 6.85e-5 | RECORDED | method | 1.27e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6279 | 0.6285 | 0.6298 | 0.6284 | -5.18e-4 | RECORDED | method | 1.13e-4 | RECORDED | method | 1.45e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9280 | 0.9274 | 0.9280 | 0.9272 | 7.16e-4 | RECORDED | method | 2.01e-4 | RECORDED | method | 7.43e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7530 | 0.7522 | 0.7537 | 0.7523 | 6.44e-4 | RECORDED | method | -1.23e-4 | RECORDED | method | 1.41e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5824 | 0.5834 | 0.5852 | 0.5837 | -1.33e-3 | RECORDED | method | -2.71e-4 | RECORDED | method | 1.53e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9277 | 0.9286 | 0.9287 | 0.9284 | -7.22e-4 | RECORDED | method | 2.06e-4 | RECORDED | method | 2.55e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7427 | 0.7450 | 0.7451 | 0.7449 | -2.22e-3 | RECORDED | method | 1.20e-4 | RECORDED | method | 1.61e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.5624 | 0.5641 | 0.5642 | 0.5643 | -1.92e-3 | RECORDED | method | -1.61e-4 | RECORDED | method | -5.67e-5 | RECORDED | method |
| 1 | tangential | 10 | 0.9151 | 0.9147 | 0.9144 | 0.9145 | 5.22e-4 | RECORDED | method | 1.65e-4 | RECORDED | method | -1.06e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7286 | 0.7287 | 0.7268 | 0.7286 | 2.18e-5 | RECORDED | method | 3.05e-5 | RECORDED | method | -1.77e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.5557 | 0.5575 | 0.5542 | 0.5575 | -1.79e-3 | RECORDED | method | -1.53e-5 | RECORDED | method | -3.37e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 5.938 | ok | ok | — | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.650 | ok | ok | — | ok | 4.26e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9430 | 0.9425 | — | 0.9423 | 6.68e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8281 | 0.8267 | — | 0.8267 | 1.41e-3 | RECORDED | method | 8.55e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7133 | 0.7126 | — | 0.7126 | 7.08e-4 | RECORDED | method | 3.74e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9430 | 0.9425 | — | 0.9423 | 6.68e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8281 | 0.8267 | — | 0.8267 | 1.41e-3 | RECORDED | method | 8.55e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7133 | 0.7126 | — | 0.7126 | 7.08e-4 | RECORDED | method | 3.74e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9370 | 0.9365 | — | 0.9363 | 6.82e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7913 | 0.7902 | — | 0.7902 | 1.15e-3 | RECORDED | method | 7.37e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6433 | 0.6435 | — | 0.6435 | -2.01e-4 | RECORDED | method | -8.13e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9278 | 0.9273 | — | 0.9271 | 6.85e-4 | RECORDED | method | 1.80e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7346 | 0.7337 | — | 0.7337 | 8.42e-4 | RECORDED | method | -2.02e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5316 | 0.5322 | — | 0.5324 | -7.47e-4 | RECORDED | method | -2.27e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9349 | 0.9344 | — | 0.9343 | 6.29e-4 | RECORDED | method | 1.55e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7711 | 0.7703 | — | 0.7702 | 8.76e-4 | RECORDED | method | 7.23e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6053 | 0.6046 | — | 0.6049 | 4.57e-4 | RECORDED | method | -2.91e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9163 | 0.9161 | — | 0.9159 | 4.28e-4 | RECORDED | method | 1.77e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7192 | 0.7188 | — | 0.7188 | 4.58e-4 | RECORDED | method | -1.20e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.5257 | 0.5268 | — | 0.5267 | -9.95e-4 | RECORDED | method | 1.49e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 24.232 | ok | ok | ok | ok | 5.90e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 43.275 | ok | unconverged | ok | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9648 | 0.9647 | 0.9650 | 0.9645 | 3.88e-4 | RECORDED | method | 2.31e-4 | RECORDED | method | 5.50e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8739 | 0.8734 | 0.8742 | 0.8728 | 1.09e-3 | RECORDED | method | 5.41e-4 | RECORDED | method | 1.38e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.7672 | 0.7663 | 0.7671 | 0.7656 | 1.56e-3 | RECORDED | method | 7.18e-4 | RECORDED | method | 1.54e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9648 | 0.9647 | 0.9650 | 0.9645 | 3.88e-4 | RECORDED | method | 2.31e-4 | RECORDED | method | 5.50e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8739 | 0.8734 | 0.8742 | 0.8728 | 1.09e-3 | RECORDED | method | 5.41e-4 | RECORDED | method | 1.38e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.7672 | 0.7663 | 0.7671 | 0.7656 | 1.56e-3 | RECORDED | method | 7.18e-4 | RECORDED | method | 1.54e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9605 | 0.9604 | 0.9607 | 0.9603 | 1.61e-4 | RECORDED | method | 1.17e-4 | RECORDED | method | 3.90e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8502 | 0.8502 | 0.8510 | 0.8502 | -2.80e-6 | RECORDED | method | -2.03e-5 | RECORDED | method | 8.21e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.7262 | 0.7262 | 0.7272 | 0.7268 | -5.41e-4 | RECORDED | method | -5.71e-4 | RECORDED | method | 4.36e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9499 | 0.9497 | 0.9499 | 0.9495 | 4.05e-4 | RECORDED | method | 1.74e-4 | RECORDED | method | 3.37e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7658 | 0.7654 | 0.7654 | 0.7647 | 1.11e-3 | RECORDED | method | 6.96e-4 | RECORDED | method | 6.83e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5259 | 0.5260 | 0.5259 | 0.5250 | 8.89e-4 | RECORDED | method | 9.86e-4 | RECORDED | method | 8.78e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9210 | 0.9209 | 0.9209 | 0.9211 | -8.18e-5 | RECORDED | method | -2.27e-4 | SET ASIDE | numerical | -1.72e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.5760 | 0.5755 | 0.5757 | 0.5759 | 1.30e-4 | RECORDED | method | -3.67e-4 | SET ASIDE | numerical | -1.12e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.1869 | 0.1852 | 0.1867 | 0.1867 | 1.61e-4 | RECORDED | method | -1.52e-3 | SET ASIDE | numerical | 3.78e-5 | RECORDED | method |
| 1 | tangential | 10 | 0.7767 | 0.7764 | 0.8180 | 0.7784 | -1.71e-3 | RECORDED | method | -2.09e-3 | SET ASIDE | numerical | 3.96e-2 | ATTENTION | method |
| 1 | tangential | 30 | 0.4055 | 0.4043 | 0.4649 | 0.4092 | -3.71e-3 | RECORDED | method | -4.96e-3 | SET ASIDE | numerical | 5.56e-2 | ATTENTION | method |
| 1 | tangential | 50 | 0.2421 | 0.2386 | 0.2983 | 0.2431 | -9.78e-4 | RECORDED | method | -4.46e-3 | SET ASIDE | numerical | 5.53e-2 | ATTENTION | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 24.232 | ok | ok | — | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 43.275 | ok | unconverged | — | ok | 5.33e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9663 | 0.9662 | — | 0.9659 | 3.57e-4 | RECORDED | method | 2.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8785 | 0.8780 | — | 0.8776 | 8.98e-4 | RECORDED | method | 4.48e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7759 | 0.7752 | — | 0.7746 | 1.28e-3 | RECORDED | method | 5.85e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9663 | 0.9662 | — | 0.9659 | 3.57e-4 | RECORDED | method | 2.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8785 | 0.8780 | — | 0.8776 | 8.98e-4 | RECORDED | method | 4.48e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7759 | 0.7752 | — | 0.7746 | 1.28e-3 | RECORDED | method | 5.85e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9574 | 0.9574 | — | 0.9574 | 1.21e-5 | RECORDED | method | 6.53e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8250 | 0.8260 | — | 0.8263 | -1.31e-3 | RECORDED | method | -2.46e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6806 | 0.6827 | — | 0.6835 | -2.98e-3 | RECORDED | method | -8.56e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9387 | 0.9383 | — | 0.9382 | 5.30e-4 | RECORDED | method | 1.23e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6854 | 0.6840 | — | 0.6834 | 2.06e-3 | RECORDED | method | 5.98e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.3815 | 0.3802 | — | 0.3794 | 2.07e-3 | RECORDED | method | 8.19e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9245 | 0.9246 | — | 0.9246 | -1.73e-4 | RECORDED | method | -8.28e-7 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5930 | 0.5933 | — | 0.5931 | -6.94e-5 | RECORDED | method | 1.94e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2201 | 0.2200 | — | 0.2204 | -2.98e-4 | RECORDED | method | -3.90e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.7372 | 0.7364 | — | 0.7381 | -9.54e-4 | RECORDED | method | -1.72e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.2516 | 0.2494 | — | 0.2533 | -1.68e-3 | RECORDED | method | -3.88e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1224 | 0.1202 | — | 0.1218 | 5.81e-4 | RECORDED | method | -1.66e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 24.232 | ok | ok | ok | ok | 8.63e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 43.275 | ok | ok | ok | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9399 | 0.9395 | 0.9396 | 0.9392 | 6.91e-4 | RECORDED | method | 3.15e-4 | RECORDED | method | 4.12e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8184 | 0.8173 | 0.8177 | 0.8170 | 1.36e-3 | RECORDED | method | 3.09e-4 | RECORDED | method | 6.97e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.6980 | 0.6981 | 0.6985 | 0.6976 | 3.71e-4 | RECORDED | method | 5.53e-4 | RECORDED | method | 8.85e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9399 | 0.9395 | 0.9396 | 0.9392 | 6.91e-4 | RECORDED | method | 3.15e-4 | RECORDED | method | 4.12e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8184 | 0.8173 | 0.8177 | 0.8170 | 1.36e-3 | RECORDED | method | 3.09e-4 | RECORDED | method | 6.97e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.6980 | 0.6981 | 0.6985 | 0.6976 | 3.71e-4 | RECORDED | method | 5.53e-4 | RECORDED | method | 8.85e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9354 | 0.9351 | 0.9352 | 0.9348 | 6.76e-4 | RECORDED | method | 2.99e-4 | RECORDED | method | 4.21e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7975 | 0.7966 | 0.7971 | 0.7964 | 1.12e-3 | RECORDED | method | 1.81e-4 | RECORDED | method | 7.25e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6611 | 0.6617 | 0.6622 | 0.6613 | -2.68e-4 | RECORDED | method | 3.84e-4 | RECORDED | method | 8.42e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9335 | 0.9330 | 0.9331 | 0.9327 | 7.40e-4 | RECORDED | method | 2.25e-4 | RECORDED | method | 3.81e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7994 | 0.7981 | 0.7986 | 0.7981 | 1.33e-3 | RECORDED | method | 6.95e-5 | RECORDED | method | 5.45e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6671 | 0.6669 | 0.6670 | 0.6665 | 5.65e-4 | RECORDED | method | 3.58e-4 | RECORDED | method | 5.48e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.8811 | 0.8812 | 0.8817 | 0.8808 | 2.28e-4 | RECORDED | method | 3.29e-4 | RECORDED | method | 8.82e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.5207 | 0.5209 | 0.5241 | 0.5219 | -1.15e-3 | RECORDED | method | -9.66e-4 | RECORDED | method | 2.20e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.2456 | 0.2460 | 0.2499 | 0.2479 | -2.30e-3 | RECORDED | method | -1.94e-3 | RECORDED | method | 1.97e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.8517 | 0.8517 | 0.8530 | 0.8514 | 2.35e-4 | RECORDED | method | 2.71e-4 | RECORDED | method | 1.53e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.5673 | 0.5662 | 0.5731 | 0.5689 | -1.58e-3 | RECORDED | method | -2.68e-3 | RECORDED | method | 4.20e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.3691 | 0.3670 | 0.3766 | 0.3701 | -1.01e-3 | RECORDED | method | -3.09e-3 | RECORDED | method | 6.49e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 24.232 | ok | ok | — | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 43.275 | ok | ok | — | ok | 4.26e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9430 | 0.9426 | — | 0.9423 | 6.58e-4 | RECORDED | method | 2.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8279 | 0.8268 | — | 0.8265 | 1.36e-3 | RECORDED | method | 3.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7137 | 0.7134 | — | 0.7131 | 6.09e-4 | RECORDED | method | 3.22e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9430 | 0.9426 | — | 0.9423 | 6.58e-4 | RECORDED | method | 2.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8279 | 0.8268 | — | 0.8265 | 1.36e-3 | RECORDED | method | 3.10e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7137 | 0.7134 | — | 0.7131 | 6.09e-4 | RECORDED | method | 3.22e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9391 | 0.9387 | — | 0.9384 | 6.42e-4 | RECORDED | method | 2.71e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8100 | 0.8090 | — | 0.8088 | 1.16e-3 | RECORDED | method | 1.96e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6817 | 0.6818 | — | 0.6816 | 1.17e-4 | RECORDED | method | 2.42e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9245 | 0.9240 | — | 0.9238 | 7.10e-4 | RECORDED | method | 1.98e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7179 | 0.7167 | — | 0.7166 | 1.35e-3 | RECORDED | method | 9.26e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.4936 | 0.4934 | — | 0.4931 | 4.54e-4 | RECORDED | method | 2.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8899 | 0.8898 | — | 0.8895 | 3.58e-4 | RECORDED | method | 3.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5515 | 0.5528 | — | 0.5535 | -1.95e-3 | RECORDED | method | -7.50e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2776 | 0.2812 | — | 0.2829 | -5.29e-3 | RECORDED | method | -1.75e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8102 | 0.8111 | — | 0.8108 | -5.95e-4 | RECORDED | method | 3.15e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3637 | 0.3655 | — | 0.3669 | -3.22e-3 | RECORDED | method | -1.41e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2023 | 0.2026 | — | 0.2038 | -1.49e-3 | RECORDED | method | -1.22e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 24.232 | ok | ok | ok | ok | 2.19e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 43.275 | ok | ok | ok | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9405 | 0.9401 | 0.9402 | 0.9398 | 6.92e-4 | RECORDED | method | 2.94e-4 | RECORDED | method | 3.80e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8214 | 0.8202 | 0.8205 | 0.8199 | 1.45e-3 | RECORDED | method | 2.74e-4 | RECORDED | method | 6.02e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7021 | 0.7021 | 0.7023 | 0.7016 | 5.38e-4 | RECORDED | method | 5.03e-4 | RECORDED | method | 7.40e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9405 | 0.9401 | 0.9402 | 0.9398 | 6.92e-4 | RECORDED | method | 2.94e-4 | RECORDED | method | 3.80e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8214 | 0.8202 | 0.8205 | 0.8199 | 1.45e-3 | RECORDED | method | 2.74e-4 | RECORDED | method | 6.02e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7021 | 0.7021 | 0.7023 | 0.7016 | 5.38e-4 | RECORDED | method | 5.03e-4 | RECORDED | method | 7.40e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9377 | 0.9373 | 0.9374 | 0.9370 | 6.83e-4 | RECORDED | method | 2.82e-4 | RECORDED | method | 3.88e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8110 | 0.8099 | 0.8103 | 0.8097 | 1.32e-3 | RECORDED | method | 1.90e-4 | RECORDED | method | 6.20e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6850 | 0.6854 | 0.6856 | 0.6849 | 9.96e-5 | RECORDED | method | 4.57e-4 | RECORDED | method | 6.92e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9326 | 0.9321 | 0.9322 | 0.9319 | 7.11e-4 | RECORDED | method | 1.94e-4 | RECORDED | method | 3.37e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7935 | 0.7923 | 0.7927 | 0.7923 | 1.23e-3 | RECORDED | method | -3.06e-5 | RECORDED | method | 4.16e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6560 | 0.6559 | 0.6561 | 0.6557 | 3.42e-4 | RECORDED | method | 1.75e-4 | RECORDED | method | 3.96e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.8921 | 0.8922 | 0.8926 | 0.8918 | 2.51e-4 | RECORDED | method | 3.48e-4 | RECORDED | method | 7.41e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.5750 | 0.5752 | 0.5777 | 0.5759 | -8.47e-4 | RECORDED | method | -6.62e-4 | RECORDED | method | 1.80e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.3174 | 0.3177 | 0.3209 | 0.3192 | -1.78e-3 | RECORDED | method | -1.41e-3 | RECORDED | method | 1.77e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.8608 | 0.8609 | 0.8618 | 0.8605 | 3.70e-4 | RECORDED | method | 4.04e-4 | RECORDED | method | 1.36e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.5976 | 0.5966 | 0.6025 | 0.5987 | -1.15e-3 | RECORDED | method | -2.11e-3 | RECORDED | method | 3.76e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.4044 | 0.4027 | 0.4112 | 0.4051 | -6.73e-4 | RECORDED | method | -2.35e-3 | RECORDED | method | 6.15e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-wide-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 24.232 | ok | ok | — | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 43.275 | ok | ok | — | ok | 4.26e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9434 | 0.9430 | — | 0.9427 | 6.58e-4 | RECORDED | method | 2.74e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8299 | 0.8288 | — | 0.8285 | 1.41e-3 | RECORDED | method | 2.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7163 | 0.7158 | — | 0.7155 | 7.49e-4 | RECORDED | method | 2.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9434 | 0.9430 | — | 0.9427 | 6.58e-4 | RECORDED | method | 2.74e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8299 | 0.8288 | — | 0.8285 | 1.41e-3 | RECORDED | method | 2.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7163 | 0.7158 | — | 0.7155 | 7.49e-4 | RECORDED | method | 2.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9407 | 0.9403 | — | 0.9401 | 6.45e-4 | RECORDED | method | 2.57e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8200 | 0.8189 | — | 0.8187 | 1.29e-3 | RECORDED | method | 1.95e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6999 | 0.6997 | — | 0.6995 | 4.30e-4 | RECORDED | method | 2.84e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9233 | 0.9228 | — | 0.9226 | 6.82e-4 | RECORDED | method | 1.72e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7108 | 0.7096 | — | 0.7096 | 1.23e-3 | RECORDED | method | 3.30e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.4818 | 0.4816 | — | 0.4816 | 1.99e-4 | RECORDED | method | 7.67e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8987 | 0.8986 | — | 0.8983 | 4.29e-4 | RECORDED | method | 3.22e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5970 | 0.5978 | — | 0.5983 | -1.36e-3 | RECORDED | method | -5.19e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3405 | 0.3437 | — | 0.3450 | -4.49e-3 | RECORDED | method | -1.32e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8168 | 0.8175 | — | 0.8171 | -3.72e-4 | RECORDED | method | 4.12e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3770 | 0.3786 | — | 0.3798 | -2.79e-3 | RECORDED | method | -1.13e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2148 | 0.2151 | — | 0.2160 | -1.16e-3 | RECORDED | method | -9.12e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 8.914 | ok | ok | ok | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 16.633 | ok | unconverged | ok | ok | 8.30e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9678 | 0.9669 | 0.9688 | 0.9672 | 6.85e-4 | RECORDED | method | -2.38e-4 | RECORDED | method | 1.68e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.9030 | 0.9000 | 0.9044 | 0.9003 | 2.67e-3 | RECORDED | method | -2.82e-4 | RECORDED | method | 4.11e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8376 | 0.8351 | 0.8406 | 0.8355 | 2.13e-3 | RECORDED | method | -4.56e-4 | RECORDED | method | 5.12e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9678 | 0.9669 | 0.9688 | 0.9672 | 6.85e-4 | RECORDED | method | -2.38e-4 | RECORDED | method | 1.68e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.9030 | 0.9000 | 0.9044 | 0.9003 | 2.67e-3 | RECORDED | method | -2.82e-4 | RECORDED | method | 4.11e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8376 | 0.8351 | 0.8406 | 0.8355 | 2.13e-3 | RECORDED | method | -4.56e-4 | RECORDED | method | 5.12e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9251 | 0.9251 | 0.9293 | 0.9262 | -1.07e-3 | RECORDED | method | -1.05e-3 | RECORDED | method | 3.16e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7190 | 0.7195 | 0.7257 | 0.7212 | -2.21e-3 | RECORDED | method | -1.70e-3 | RECORDED | method | 4.48e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.5740 | 0.5739 | 0.5761 | 0.5751 | -1.10e-3 | RECORDED | method | -1.22e-3 | RECORDED | method | 9.55e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9395 | 0.9390 | 0.9425 | 0.9394 | 1.38e-4 | RECORDED | method | -3.87e-4 | RECORDED | method | 3.12e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7749 | 0.7746 | 0.7809 | 0.7762 | -1.29e-3 | RECORDED | method | -1.55e-3 | RECORDED | method | 4.77e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6154 | 0.6156 | 0.6203 | 0.6173 | -1.97e-3 | RECORDED | method | -1.72e-3 | RECORDED | method | 2.94e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.6544 | 0.6545 | 0.6582 | 0.6571 | -2.70e-3 | RECORDED | method | -2.56e-3 | SET ASIDE | numerical | 1.07e-3 | RECORDED | method |
| 1 | sagittal | 30 | 0.4565 | 0.4571 | 0.4553 | 0.4589 | -2.39e-3 | RECORDED | method | -1.85e-3 | SET ASIDE | numerical | -3.59e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.3649 | 0.3651 | 0.3577 | 0.3635 | 1.38e-3 | RECORDED | method | 1.57e-3 | SET ASIDE | numerical | -5.80e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.8863 | 0.8858 | 0.9352 | 0.8859 | 4.76e-4 | RECORDED | method | -2.83e-5 | SET ASIDE | numerical | 4.94e-2 | ATTENTION | method |
| 1 | tangential | 30 | 0.5768 | 0.5756 | 0.7661 | 0.5764 | 3.19e-4 | RECORDED | method | -8.65e-4 | SET ASIDE | numerical | 1.90e-1 | ATTENTION | method |
| 1 | tangential | 50 | 0.3142 | 0.3157 | 0.5816 | 0.3156 | -1.41e-3 | RECORDED | method | 1.20e-4 | SET ASIDE | numerical | 2.66e-1 | ATTENTION | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 8.914 | ok | unconverged | — | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 16.631 | ok | unconverged | — | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9688 | 0.9678 | — | 0.9680 | 7.53e-4 | RECORDED | method | -1.83e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.9024 | 0.8996 | — | 0.8997 | 2.74e-3 | RECORDED | method | -8.24e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8350 | 0.8320 | — | 0.8320 | 3.00e-3 | RECORDED | method | -6.28e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9688 | 0.9678 | — | 0.9680 | 7.53e-4 | RECORDED | method | -1.83e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.9024 | 0.8996 | — | 0.8997 | 2.74e-3 | RECORDED | method | -8.24e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8350 | 0.8320 | — | 0.8320 | 3.00e-3 | RECORDED | method | -6.28e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9281 | 0.9281 | — | 0.9291 | -1.00e-3 | RECORDED | method | -9.71e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7187 | 0.7188 | — | 0.7205 | -1.78e-3 | RECORDED | method | -1.72e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5614 | 0.5612 | — | 0.5623 | -9.36e-4 | RECORDED | method | -1.07e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9298 | 0.9294 | — | 0.9296 | 2.37e-4 | RECORDED | method | -1.81e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7486 | 0.7483 | — | 0.7490 | -4.38e-4 | RECORDED | method | -7.61e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5841 | 0.5841 | — | 0.5847 | -5.50e-4 | RECORDED | method | -5.21e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.6680 | 0.6681 | — | 0.6709 | -2.92e-3 | RECORDED | method | -2.81e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.4724 | 0.4730 | — | 0.4743 | -1.93e-3 | RECORDED | method | -1.29e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.3839 | 0.3840 | — | 0.3827 | 1.26e-3 | RECORDED | method | 1.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8658 | 0.8656 | — | 0.8654 | 3.93e-4 | RECORDED | method | 2.18e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5098 | 0.5090 | — | 0.5100 | -2.66e-4 | RECORDED | method | -1.08e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2402 | 0.2405 | — | 0.2418 | -1.56e-3 | RECORDED | method | -1.30e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 8.914 | ok | ok | ok | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 16.633 | ok | ok | ok | ok | 1.00e-11 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9395 | 0.9390 | 0.9394 | 0.9388 | 6.93e-4 | RECORDED | method | 1.76e-4 | RECORDED | method | 6.45e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8172 | 0.8158 | 0.8170 | 0.8159 | 1.35e-3 | RECORDED | method | -4.37e-5 | RECORDED | method | 1.12e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.6961 | 0.6959 | 0.6971 | 0.6959 | 2.24e-4 | RECORDED | method | 7.70e-5 | RECORDED | method | 1.22e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9395 | 0.9390 | 0.9394 | 0.9388 | 6.93e-4 | RECORDED | method | 1.76e-4 | RECORDED | method | 6.45e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8172 | 0.8158 | 0.8170 | 0.8159 | 1.35e-3 | RECORDED | method | -4.37e-5 | RECORDED | method | 1.12e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.6961 | 0.6959 | 0.6971 | 0.6959 | 2.24e-4 | RECORDED | method | 7.70e-5 | RECORDED | method | 1.22e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9378 | 0.9373 | 0.9378 | 0.9372 | 6.47e-4 | RECORDED | method | 1.13e-4 | RECORDED | method | 6.68e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8126 | 0.8112 | 0.8126 | 0.8114 | 1.20e-3 | RECORDED | method | -2.33e-4 | RECORDED | method | 1.14e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6892 | 0.6891 | 0.6903 | 0.6892 | 5.67e-7 | RECORDED | method | -1.05e-4 | RECORDED | method | 1.14e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9317 | 0.9310 | 0.9317 | 0.9310 | 7.43e-4 | RECORDED | method | 6.02e-5 | RECORDED | method | 7.54e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7830 | 0.7817 | 0.7834 | 0.7820 | 9.44e-4 | RECORDED | method | -3.58e-4 | RECORDED | method | 1.42e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6381 | 0.6382 | 0.6400 | 0.6386 | -4.50e-4 | RECORDED | method | -3.84e-4 | RECORDED | method | 1.45e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9257 | 0.9253 | 0.9260 | 0.9253 | 3.75e-4 | RECORDED | method | -2.12e-5 | RECORDED | method | 6.80e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7605 | 0.7601 | 0.7615 | 0.7607 | -2.42e-4 | RECORDED | method | -6.43e-4 | RECORDED | method | 7.65e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6098 | 0.6107 | 0.6118 | 0.6112 | -1.44e-3 | RECORDED | method | -5.49e-4 | RECORDED | method | 5.63e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9141 | 0.9134 | 0.9146 | 0.9128 | 1.23e-3 | RECORDED | method | 5.25e-4 | RECORDED | method | 1.80e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.7238 | 0.7227 | 0.7269 | 0.7222 | 1.56e-3 | RECORDED | method | 4.65e-4 | RECORDED | method | 4.66e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.5443 | 0.5438 | 0.5478 | 0.5429 | 1.47e-3 | RECORDED | method | 9.82e-4 | RECORDED | method | 4.91e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 8.914 | ok | ok | — | ok | 1.78e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 16.631 | ok | ok | — | ok | 3.20e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9418 | 0.9413 | — | 0.9411 | 6.56e-4 | RECORDED | method | 1.52e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8220 | 0.8207 | — | 0.8208 | 1.25e-3 | RECORDED | method | -6.91e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7030 | 0.7025 | — | 0.7027 | 3.01e-4 | RECORDED | method | -2.02e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9418 | 0.9413 | — | 0.9411 | 6.56e-4 | RECORDED | method | 1.52e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8220 | 0.8207 | — | 0.8208 | 1.25e-3 | RECORDED | method | -6.91e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7030 | 0.7025 | — | 0.7027 | 3.01e-4 | RECORDED | method | -2.02e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9407 | 0.9401 | — | 0.9401 | 6.12e-4 | RECORDED | method | 9.11e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8209 | 0.8195 | — | 0.8198 | 1.17e-3 | RECORDED | method | -2.24e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7034 | 0.7028 | — | 0.7031 | 2.72e-4 | RECORDED | method | -2.83e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9345 | 0.9338 | — | 0.9338 | 7.28e-4 | RECORDED | method | 7.24e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7887 | 0.7874 | — | 0.7876 | 1.09e-3 | RECORDED | method | -2.16e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6429 | 0.6428 | — | 0.6431 | -1.85e-4 | RECORDED | method | -3.20e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9300 | 0.9297 | — | 0.9297 | 3.88e-4 | RECORDED | method | 4.11e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7750 | 0.7744 | — | 0.7750 | 5.20e-5 | RECORDED | method | -5.71e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6308 | 0.6314 | — | 0.6320 | -1.14e-3 | RECORDED | method | -5.43e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8974 | 0.8972 | — | 0.8969 | 4.99e-4 | RECORDED | method | 2.52e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6373 | 0.6374 | — | 0.6377 | -4.74e-4 | RECORDED | method | -3.86e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.4057 | 0.4051 | — | 0.4053 | 3.56e-4 | RECORDED | method | -2.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 8.914 | ok | ok | ok | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 16.633 | ok | ok | ok | ok | 7.92e-12 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9401 | 0.9396 | 0.9400 | 0.9394 | 7.30e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | 6.57e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8204 | 0.8189 | 0.8201 | 0.8189 | 1.54e-3 | RECORDED | method | 4.31e-5 | RECORDED | method | 1.16e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.7009 | 0.7006 | 0.7017 | 0.7003 | 5.57e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | 1.31e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9401 | 0.9396 | 0.9400 | 0.9394 | 7.30e-4 | RECORDED | method | 1.99e-4 | RECORDED | method | 6.57e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8204 | 0.8189 | 0.8201 | 0.8189 | 1.54e-3 | RECORDED | method | 4.31e-5 | RECORDED | method | 1.16e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.7009 | 0.7006 | 0.7017 | 0.7003 | 5.57e-4 | RECORDED | method | 2.26e-4 | RECORDED | method | 1.31e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9379 | 0.9373 | 0.9379 | 0.9372 | 7.07e-4 | RECORDED | method | 1.41e-4 | RECORDED | method | 6.62e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8107 | 0.8091 | 0.8103 | 0.8092 | 1.50e-3 | RECORDED | method | -1.19e-4 | RECORDED | method | 1.10e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6825 | 0.6822 | 0.6833 | 0.6822 | 3.47e-4 | RECORDED | method | 6.80e-5 | RECORDED | method | 1.10e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9342 | 0.9335 | 0.9342 | 0.9334 | 7.89e-4 | RECORDED | method | 8.75e-5 | RECORDED | method | 7.59e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7980 | 0.7965 | 0.7981 | 0.7967 | 1.26e-3 | RECORDED | method | -2.31e-4 | RECORDED | method | 1.38e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6641 | 0.6638 | 0.6654 | 0.6640 | 1.54e-4 | RECORDED | method | -1.58e-4 | RECORDED | method | 1.41e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9262 | 0.9258 | 0.9263 | 0.9257 | 4.79e-4 | RECORDED | method | 2.12e-5 | RECORDED | method | 5.84e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7588 | 0.7580 | 0.7589 | 0.7585 | 3.04e-4 | RECORDED | method | -5.30e-4 | RECORDED | method | 3.75e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6021 | 0.6026 | 0.6033 | 0.6030 | -8.99e-4 | RECORDED | method | -3.92e-4 | RECORDED | method | 2.54e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9146 | 0.9140 | 0.9151 | 0.9135 | 1.13e-3 | RECORDED | method | 5.00e-4 | RECORDED | method | 1.66e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.7325 | 0.7316 | 0.7350 | 0.7312 | 1.25e-3 | RECORDED | method | 3.43e-4 | RECORDED | method | 3.81e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.5605 | 0.5600 | 0.5631 | 0.5591 | 1.39e-3 | RECORDED | method | 9.03e-4 | RECORDED | method | 4.01e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-24-70f4s-tele-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 8.914 | ok | ok | — | ok | 3.55e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 16.631 | ok | ok | — | ok | 3.20e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9429 | 0.9424 | — | 0.9422 | 7.05e-4 | RECORDED | method | 1.82e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8284 | 0.8270 | — | 0.8269 | 1.49e-3 | RECORDED | method | 5.07e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7141 | 0.7133 | — | 0.7133 | 8.16e-4 | RECORDED | method | 1.25e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9429 | 0.9424 | — | 0.9422 | 7.05e-4 | RECORDED | method | 1.82e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8284 | 0.8270 | — | 0.8269 | 1.49e-3 | RECORDED | method | 5.07e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7141 | 0.7133 | — | 0.7133 | 8.16e-4 | RECORDED | method | 1.26e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9409 | 0.9403 | — | 0.9402 | 6.89e-4 | RECORDED | method | 1.28e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8193 | 0.8177 | — | 0.8178 | 1.52e-3 | RECORDED | method | -8.20e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6965 | 0.6955 | — | 0.6956 | 8.67e-4 | RECORDED | method | -5.77e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9371 | 0.9364 | — | 0.9363 | 7.76e-4 | RECORDED | method | 1.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8047 | 0.8032 | — | 0.8033 | 1.40e-3 | RECORDED | method | -8.68e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6707 | 0.6702 | — | 0.6703 | 4.75e-4 | RECORDED | method | -7.41e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9302 | 0.9297 | — | 0.9296 | 5.16e-4 | RECORDED | method | 5.41e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7694 | 0.7683 | — | 0.7687 | 6.48e-4 | RECORDED | method | -4.00e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6144 | 0.6144 | — | 0.6148 | -4.09e-4 | RECORDED | method | -3.39e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8941 | 0.8940 | — | 0.8938 | 3.03e-4 | RECORDED | method | 1.85e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.6266 | 0.6271 | — | 0.6277 | -1.11e-3 | RECORDED | method | -6.64e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3869 | 0.3867 | — | 0.3873 | -3.32e-4 | RECORDED | method | -5.73e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 6.022 | ok | ok | ok | ok | 1.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.999 | ok | unconverged | ok | ok | 1.52e-10 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9768 | 0.9766 | 0.9771 | 0.9765 | 3.75e-4 | RECORDED | method | 1.65e-4 | RECORDED | method | 6.93e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.9274 | 0.9268 | 0.9283 | 0.9264 | 1.01e-3 | RECORDED | method | 3.91e-4 | RECORDED | method | 1.89e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8759 | 0.8748 | 0.8769 | 0.8741 | 1.77e-3 | RECORDED | method | 6.68e-4 | RECORDED | method | 2.83e-3 | RECORDED | method |
| 0 | tangential | 10 | 0.9768 | 0.9766 | 0.9771 | 0.9765 | 3.75e-4 | RECORDED | method | 1.65e-4 | RECORDED | method | 6.93e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.9274 | 0.9268 | 0.9283 | 0.9264 | 1.01e-3 | RECORDED | method | 3.91e-4 | RECORDED | method | 1.89e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8759 | 0.8748 | 0.8769 | 0.8741 | 1.77e-3 | RECORDED | method | 6.68e-4 | RECORDED | method | 2.83e-3 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9754 | 0.9747 | 0.9752 | 0.9748 | 6.20e-4 | RECORDED | method | -8.76e-5 | RECORDED | method | 4.19e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.9143 | 0.9122 | 0.9136 | 0.9124 | 1.90e-3 | RECORDED | method | -2.44e-4 | RECORDED | method | 1.16e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.8424 | 0.8387 | 0.8408 | 0.8392 | 3.15e-3 | RECORDED | method | -4.60e-4 | RECORDED | method | 1.64e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9661 | 0.9656 | 0.9660 | 0.9655 | 5.83e-4 | RECORDED | method | 1.52e-4 | RECORDED | method | 5.18e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8802 | 0.8787 | 0.8799 | 0.8785 | 1.72e-3 | RECORDED | method | 1.90e-4 | RECORDED | method | 1.43e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.7898 | 0.7886 | 0.7902 | 0.7885 | 1.29e-3 | RECORDED | method | 8.60e-5 | RECORDED | method | 1.72e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.8898 | 0.8915 | 0.8890 | 0.8891 | 6.96e-4 | RECORDED | method | 2.39e-3 | SET ASIDE | numerical | -4.21e-5 | RECORDED | method |
| 1 | sagittal | 30 | 0.5641 | 0.5689 | 0.5594 | 0.5618 | 2.25e-3 | RECORDED | method | 7.05e-3 | SET ASIDE | numerical | -2.40e-3 | RECORDED | method |
| 1 | sagittal | 50 | 0.4442 | 0.4462 | 0.4382 | 0.4424 | 1.72e-3 | RECORDED | method | 3.78e-3 | SET ASIDE | numerical | -4.27e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.8894 | 0.8908 | 0.8877 | 0.8893 | 1.49e-4 | RECORDED | method | 1.53e-3 | SET ASIDE | numerical | -1.56e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.5420 | 0.5482 | 0.5377 | 0.5428 | -8.25e-4 | RECORDED | method | 5.36e-3 | SET ASIDE | numerical | -5.06e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.2922 | 0.2951 | 0.2881 | 0.2930 | -8.81e-4 | RECORDED | method | 2.08e-3 | SET ASIDE | numerical | -4.96e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 6.022 | ok | ok | — | ok | 3.55e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.999 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9756 | 0.9756 | — | 0.9755 | 1.25e-4 | RECORDED | method | 1.22e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.9167 | 0.9172 | — | 0.9171 | -4.36e-4 | RECORDED | method | 1.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8541 | 0.8546 | — | 0.8544 | -2.97e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9756 | 0.9756 | — | 0.9755 | 1.25e-4 | RECORDED | method | 1.22e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.9167 | 0.9172 | — | 0.9171 | -4.36e-4 | RECORDED | method | 1.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8541 | 0.8546 | — | 0.8544 | -2.97e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9760 | 0.9754 | — | 0.9755 | 4.55e-4 | RECORDED | method | -6.68e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.9161 | 0.9149 | — | 0.9152 | 9.48e-4 | RECORDED | method | -2.18e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.8485 | 0.8464 | — | 0.8468 | 1.71e-3 | RECORDED | method | -4.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9627 | 0.9623 | — | 0.9622 | 5.28e-4 | RECORDED | method | 1.21e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8511 | 0.8501 | — | 0.8501 | 9.77e-4 | RECORDED | method | 1.79e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.7254 | 0.7252 | — | 0.7254 | 3.27e-5 | RECORDED | method | -1.41e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8923 | 0.8941 | — | 0.8918 | 5.50e-4 | RECORDED | method | 2.30e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.5523 | 0.5581 | — | 0.5507 | 1.62e-3 | RECORDED | method | 7.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.4147 | 0.4181 | — | 0.4138 | 9.22e-4 | RECORDED | method | 4.32e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8690 | 0.8709 | — | 0.8689 | 9.58e-5 | RECORDED | method | 1.94e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.4464 | 0.4519 | — | 0.4474 | -1.03e-3 | RECORDED | method | 4.47e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1863 | 0.1855 | — | 0.1869 | -6.34e-4 | RECORDED | method | -1.36e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 6.022 | ok | ok | ok | ok | 1.95e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.999 | ok | ok | ok | ok | 1.17e-10 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9402 | 0.9398 | 0.9400 | 0.9396 | 6.09e-4 | RECORDED | method | 1.77e-4 | RECORDED | method | 3.76e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8203 | 0.8190 | 0.8196 | 0.8190 | 1.22e-3 | RECORDED | method | -1.07e-5 | RECORDED | method | 5.72e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7007 | 0.7007 | 0.7012 | 0.7005 | 1.82e-4 | RECORDED | method | 1.37e-4 | RECORDED | method | 6.60e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9402 | 0.9398 | 0.9400 | 0.9396 | 6.09e-4 | RECORDED | method | 1.77e-4 | RECORDED | method | 3.76e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8203 | 0.8190 | 0.8196 | 0.8190 | 1.22e-3 | RECORDED | method | -1.07e-5 | RECORDED | method | 5.72e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7007 | 0.7007 | 0.7012 | 0.7005 | 1.82e-4 | RECORDED | method | 1.37e-4 | RECORDED | method | 6.60e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9398 | 6.25e-4 | RECORDED | method | 1.93e-4 | RECORDED | method | 3.78e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8209 | 0.8196 | 0.8202 | 0.8196 | 1.31e-3 | RECORDED | method | 4.79e-5 | RECORDED | method | 5.85e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.7011 | 0.7010 | 0.7015 | 0.7008 | 3.49e-4 | RECORDED | method | 2.33e-4 | RECORDED | method | 6.95e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9406 | 0.9402 | 0.9403 | 0.9400 | 6.21e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | 3.67e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8214 | 0.8201 | 0.8207 | 0.8201 | 1.27e-3 | RECORDED | method | 2.62e-5 | RECORDED | method | 5.56e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.7024 | 0.7023 | 0.7027 | 0.7021 | 2.76e-4 | RECORDED | method | 1.69e-4 | RECORDED | method | 6.59e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9365 | 0.9361 | 0.9364 | 0.9361 | 4.51e-4 | RECORDED | method | 9.66e-5 | RECORDED | method | 3.10e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7987 | 0.7980 | 0.7986 | 0.7982 | 4.62e-4 | RECORDED | method | -2.88e-4 | RECORDED | method | 3.23e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6642 | 0.6650 | 0.6656 | 0.6653 | -1.14e-3 | RECORDED | method | -3.38e-4 | RECORDED | method | 2.54e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9150 | 0.9149 | 0.9154 | 0.9147 | 3.02e-4 | RECORDED | method | 1.64e-4 | RECORDED | method | 6.37e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.6702 | 0.6706 | 0.6726 | 0.6713 | -1.08e-3 | RECORDED | method | -6.15e-4 | RECORDED | method | 1.37e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.4480 | 0.4507 | 0.4532 | 0.4520 | -3.93e-3 | RECORDED | method | -1.25e-3 | RECORDED | method | 1.28e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 6.022 | ok | ok | — | ok | 5.33e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.999 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9420 | 0.9416 | — | 0.9414 | 5.58e-4 | RECORDED | method | 1.53e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8213 | 0.8202 | — | 0.8202 | 1.07e-3 | RECORDED | method | -4.31e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7002 | 0.7000 | — | 0.7001 | 8.79e-5 | RECORDED | method | -1.81e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9420 | 0.9416 | — | 0.9414 | 5.58e-4 | RECORDED | method | 1.53e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8213 | 0.8202 | — | 0.8202 | 1.07e-3 | RECORDED | method | -4.31e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7002 | 0.7000 | — | 0.7001 | 8.79e-5 | RECORDED | method | -1.81e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9430 | 0.9426 | — | 0.9425 | 5.82e-4 | RECORDED | method | 1.71e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8277 | 0.8265 | — | 0.8264 | 1.21e-3 | RECORDED | method | 3.71e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7122 | 0.7118 | — | 0.7118 | 4.27e-4 | RECORDED | method | -3.50e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9398 | 0.9394 | — | 0.9392 | 5.84e-4 | RECORDED | method | 1.76e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8017 | 0.8006 | — | 0.8006 | 1.15e-3 | RECORDED | method | 3.76e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6523 | 0.6519 | — | 0.6520 | 3.53e-4 | RECORDED | method | -7.73e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9380 | 0.9377 | — | 0.9376 | 4.04e-4 | RECORDED | method | 7.57e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7978 | 0.7971 | — | 0.7974 | 3.79e-4 | RECORDED | method | -3.29e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6593 | 0.6599 | — | 0.6605 | -1.27e-3 | RECORDED | method | -6.34e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9018 | 0.9018 | — | 0.9017 | 6.39e-5 | RECORDED | method | 9.38e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5899 | 0.5907 | — | 0.5916 | -1.76e-3 | RECORDED | method | -8.95e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3227 | 0.3253 | — | 0.3269 | -4.23e-3 | RECORDED | method | -1.61e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 6.022 | ok | ok | ok | ok | 1.78e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 11.999 | ok | ok | ok | ok | 1.31e-10 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.28e-4 | RECORDED | method | 1.90e-4 | RECORDED | method | 3.87e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8214 | 0.8202 | 0.8207 | 0.8201 | 1.31e-3 | RECORDED | method | 3.52e-5 | RECORDED | method | 6.03e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7025 | 0.7023 | 0.7028 | 0.7021 | 3.28e-4 | RECORDED | method | 2.14e-4 | RECORDED | method | 7.11e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9405 | 0.9400 | 0.9402 | 0.9398 | 6.28e-4 | RECORDED | method | 1.90e-4 | RECORDED | method | 3.87e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8214 | 0.8202 | 0.8207 | 0.8201 | 1.31e-3 | RECORDED | method | 3.52e-5 | RECORDED | method | 6.03e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7025 | 0.7023 | 0.7028 | 0.7021 | 3.28e-4 | RECORDED | method | 2.14e-4 | RECORDED | method | 7.11e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9399 | 0.9394 | 0.9396 | 0.9392 | 6.37e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | 3.90e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8169 | 0.8156 | 0.8162 | 0.8156 | 1.33e-3 | RECORDED | method | 7.28e-5 | RECORDED | method | 6.21e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6932 | 0.6931 | 0.6936 | 0.6929 | 3.27e-4 | RECORDED | method | 2.59e-4 | RECORDED | method | 7.50e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9407 | 0.9403 | 0.9405 | 0.9401 | 6.36e-4 | RECORDED | method | 2.04e-4 | RECORDED | method | 3.79e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8222 | 0.8210 | 0.8215 | 0.8209 | 1.33e-3 | RECORDED | method | 6.58e-5 | RECORDED | method | 5.92e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.7038 | 0.7036 | 0.7041 | 0.7034 | 3.83e-4 | RECORDED | method | 2.36e-4 | RECORDED | method | 7.19e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9382 | 0.9379 | 0.9381 | 0.9377 | 4.96e-4 | RECORDED | method | 1.16e-4 | RECORDED | method | 3.22e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.8088 | 0.8078 | 0.8084 | 0.8080 | 7.17e-4 | RECORDED | method | -2.05e-4 | RECORDED | method | 3.70e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6817 | 0.6822 | 0.6827 | 0.6824 | -6.60e-4 | RECORDED | method | -1.98e-4 | RECORDED | method | 3.35e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.9089 | 0.9088 | 0.9094 | 0.9087 | 2.31e-4 | RECORDED | method | 1.47e-4 | RECORDED | method | 6.90e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.6372 | 0.6380 | 0.6402 | 0.6387 | -1.48e-3 | RECORDED | method | -7.58e-4 | RECORDED | method | 1.51e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.3989 | 0.4018 | 0.4046 | 0.4033 | -4.39e-3 | RECORDED | method | -1.44e-3 | RECORDED | method | 1.30e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-mc-105f28-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 6.022 | ok | ok | — | ok | 6.22e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 11.999 | ok | ok | — | ok | 3.55e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9430 | 0.9425 | — | 0.9424 | 6.00e-4 | RECORDED | method | 1.79e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8274 | 0.8262 | — | 0.8261 | 1.26e-3 | RECORDED | method | 5.92e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7117 | 0.7112 | — | 0.7112 | 4.88e-4 | RECORDED | method | -3.69e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9430 | 0.9425 | — | 0.9424 | 6.00e-4 | RECORDED | method | 1.79e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8274 | 0.8262 | — | 0.8261 | 1.26e-3 | RECORDED | method | 5.92e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7117 | 0.7112 | — | 0.7112 | 4.88e-4 | RECORDED | method | -3.68e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9424 | 0.9420 | — | 0.9418 | 6.08e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8231 | 0.8219 | — | 0.8218 | 1.26e-3 | RECORDED | method | 9.65e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7032 | 0.7028 | — | 0.7027 | 4.93e-4 | RECORDED | method | 4.15e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9403 | 0.9399 | — | 0.9397 | 6.11e-4 | RECORDED | method | 1.98e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8049 | 0.8037 | — | 0.8036 | 1.26e-3 | RECORDED | method | 1.13e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6588 | 0.6582 | — | 0.6582 | 5.74e-4 | RECORDED | method | 4.87e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9416 | 0.9412 | — | 0.9411 | 4.91e-4 | RECORDED | method | 1.16e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8191 | 0.8181 | — | 0.8182 | 8.37e-4 | RECORDED | method | -1.48e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6977 | 0.6977 | — | 0.6980 | -3.08e-4 | RECORDED | method | -3.32e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8869 | 0.8871 | — | 0.8870 | -1.13e-4 | RECORDED | method | 4.35e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5185 | 0.5197 | — | 0.5209 | -2.44e-3 | RECORDED | method | -1.16e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.2351 | 0.2377 | — | 0.2394 | -4.35e-3 | RECORDED | method | -1.74e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.659 | ok | ok | ok | ok | 2.13e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.159 | ok | unconverged | ok | ok | 1.10e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9797 | 0.9792 | 0.9807 | 0.9791 | 6.31e-4 | RECORDED | method | 9.60e-5 | RECORDED | method | 1.62e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.9145 | 0.9135 | 0.9184 | 0.9134 | 1.01e-3 | RECORDED | method | 3.62e-5 | RECORDED | method | 4.93e-3 | RECORDED | method |
| 0 | sagittal | 50 | 0.8300 | 0.8279 | 0.8348 | 0.8279 | 2.02e-3 | RECORDED | method | -7.77e-5 | RECORDED | method | 6.89e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.9797 | 0.9792 | 0.9807 | 0.9791 | 6.31e-4 | RECORDED | method | 9.60e-5 | RECORDED | method | 1.62e-3 | RECORDED | method |
| 0 | tangential | 30 | 0.9145 | 0.9135 | 0.9184 | 0.9134 | 1.01e-3 | RECORDED | method | 3.62e-5 | RECORDED | method | 4.93e-3 | RECORDED | method |
| 0 | tangential | 50 | 0.8300 | 0.8279 | 0.8348 | 0.8279 | 2.02e-3 | RECORDED | method | -7.77e-5 | RECORDED | method | 6.89e-3 | ATTENTION | method |
| 0.5 | sagittal | 10 | 0.9764 | 0.9760 | 0.9782 | 0.9761 | 3.44e-4 | RECORDED | method | -3.35e-5 | RECORDED | method | 2.17e-3 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8984 | 0.8977 | 0.9063 | 0.8985 | -1.70e-4 | RECORDED | method | -8.64e-4 | RECORDED | method | 7.77e-3 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.8104 | 0.8099 | 0.8223 | 0.8117 | -1.30e-3 | RECORDED | method | -1.85e-3 | RECORDED | method | 1.05e-2 | ATTENTION | method |
| 0.5 | tangential | 10 | 0.9786 | 0.9783 | 0.9803 | 0.9783 | 2.96e-4 | RECORDED | method | -1.70e-5 | RECORDED | method | 2.00e-3 | RECORDED | method |
| 0.5 | tangential | 30 | 0.9185 | 0.9178 | 0.9245 | 0.9187 | -2.10e-4 | RECORDED | method | -8.83e-4 | RECORDED | method | 5.82e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.8557 | 0.8546 | 0.8633 | 0.8559 | -1.87e-4 | RECORDED | method | -1.29e-3 | RECORDED | method | 7.41e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.9513 | 0.9513 | 0.9569 | 0.9516 | -2.71e-4 | RECORDED | method | -2.53e-4 | SET ASIDE | numerical | 5.25e-3 | RECORDED | method |
| 1 | sagittal | 30 | 0.7347 | 0.7357 | 0.7587 | 0.7386 | -3.87e-3 | RECORDED | method | -2.86e-3 | SET ASIDE | numerical | 2.02e-2 | ATTENTION | method |
| 1 | sagittal | 50 | 0.5062 | 0.5074 | 0.5303 | 0.5118 | -5.68e-3 | RECORDED | method | -4.46e-3 | SET ASIDE | numerical | 1.85e-2 | ATTENTION | method |
| 1 | tangential | 10 | 0.8806 | 0.8819 | 0.8869 | 0.8801 | 4.97e-4 | RECORDED | method | 1.80e-3 | SET ASIDE | numerical | 6.83e-3 | RECORDED | method |
| 1 | tangential | 30 | 0.5472 | 0.5478 | 0.5525 | 0.5474 | -1.39e-4 | RECORDED | method | 3.79e-4 | SET ASIDE | numerical | 5.08e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.4152 | 0.4148 | 0.4117 | 0.4132 | 1.94e-3 | RECORDED | method | 1.55e-3 | SET ASIDE | numerical | -1.58e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.659 | ok | ok | — | ok | 1.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.159 | ok | unconverged | — | ok | 1.42e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9804 | 0.9799 | — | 0.9798 | 5.96e-4 | RECORDED | method | 9.80e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.9167 | 0.9158 | — | 0.9158 | 8.43e-4 | RECORDED | method | 4.46e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.8341 | 0.8325 | — | 0.8327 | 1.45e-3 | RECORDED | method | -1.58e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9804 | 0.9799 | — | 0.9798 | 5.96e-4 | RECORDED | method | 9.80e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.9167 | 0.9158 | — | 0.9158 | 8.43e-4 | RECORDED | method | 4.47e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.8341 | 0.8325 | — | 0.8327 | 1.45e-3 | RECORDED | method | -1.58e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9760 | 0.9757 | — | 0.9757 | 3.18e-4 | RECORDED | method | -9.26e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8919 | 0.8913 | — | 0.8922 | -2.77e-4 | RECORDED | method | -8.77e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7947 | 0.7945 | — | 0.7964 | -1.73e-3 | RECORDED | method | -1.97e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9766 | 0.9764 | — | 0.9763 | 3.36e-4 | RECORDED | method | 1.23e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.9035 | 0.9030 | — | 0.9034 | 1.49e-4 | RECORDED | method | -3.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.8258 | 0.8252 | — | 0.8260 | -1.79e-4 | RECORDED | method | -8.16e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9469 | 0.9471 | — | 0.9468 | 8.54e-5 | RECORDED | method | 2.49e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7085 | 0.7096 | — | 0.7108 | -2.25e-3 | RECORDED | method | -1.17e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.4704 | 0.4714 | — | 0.4738 | -3.43e-3 | RECORDED | method | -2.42e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8562 | 0.8579 | — | 0.8564 | -1.47e-4 | RECORDED | method | 1.46e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5001 | 0.5007 | — | 0.4994 | 6.98e-4 | RECORDED | method | 1.31e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3685 | 0.3682 | — | 0.3678 | 7.02e-4 | RECORDED | method | 4.28e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.659 | ok | ok | ok | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.159 | ok | ok | ok | ok | 1.39e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9397 | 6.61e-4 | RECORDED | method | 2.08e-4 | RECORDED | method | 4.47e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8214 | 0.8201 | 0.8207 | 0.8200 | 1.38e-3 | RECORDED | method | 7.25e-5 | RECORDED | method | 7.31e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7025 | 0.7023 | 0.7029 | 0.7021 | 4.01e-4 | RECORDED | method | 2.58e-4 | RECORDED | method | 8.53e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9397 | 6.61e-4 | RECORDED | method | 2.08e-4 | RECORDED | method | 4.47e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8214 | 0.8201 | 0.8207 | 0.8200 | 1.38e-3 | RECORDED | method | 7.25e-5 | RECORDED | method | 7.31e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7025 | 0.7023 | 0.7029 | 0.7021 | 4.01e-4 | RECORDED | method | 2.58e-4 | RECORDED | method | 8.53e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9391 | 0.9386 | 0.9388 | 0.9384 | 6.80e-4 | RECORDED | method | 2.27e-4 | RECORDED | method | 4.78e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8135 | 0.8122 | 0.8129 | 0.8121 | 1.38e-3 | RECORDED | method | 1.09e-4 | RECORDED | method | 8.25e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6876 | 0.6876 | 0.6883 | 0.6873 | 2.85e-4 | RECORDED | method | 3.05e-4 | RECORDED | method | 9.81e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9390 | 0.9385 | 0.9388 | 0.9383 | 6.91e-4 | RECORDED | method | 2.05e-4 | RECORDED | method | 4.82e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8152 | 0.8139 | 0.8146 | 0.8138 | 1.41e-3 | RECORDED | method | 7.44e-5 | RECORDED | method | 8.15e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6913 | 0.6912 | 0.6919 | 0.6910 | 2.94e-4 | RECORDED | method | 2.63e-4 | RECORDED | method | 9.29e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9344 | 0.9339 | 0.9342 | 0.9337 | 6.72e-4 | RECORDED | method | 2.39e-4 | RECORDED | method | 5.18e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7864 | 0.7854 | 0.7863 | 0.7853 | 1.10e-3 | RECORDED | method | 4.96e-5 | RECORDED | method | 9.53e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6381 | 0.6387 | 0.6397 | 0.6386 | -4.44e-4 | RECORDED | method | 1.39e-4 | RECORDED | method | 1.09e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9349 | 0.9344 | 0.9347 | 0.9342 | 7.22e-4 | RECORDED | method | 2.08e-4 | RECORDED | method | 5.16e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7970 | 0.7958 | 0.7967 | 0.7958 | 1.28e-3 | RECORDED | method | 1.28e-5 | RECORDED | method | 9.09e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.6597 | 0.6600 | 0.6608 | 0.6598 | -8.69e-5 | RECORDED | method | 2.32e-4 | RECORDED | method | 1.02e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.659 | ok | ok | — | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.159 | ok | ok | — | ok | 2.49e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9434 | 0.9430 | — | 0.9428 | 6.30e-4 | RECORDED | method | 1.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8303 | 0.8290 | — | 0.8289 | 1.34e-3 | RECORDED | method | 8.97e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7173 | 0.7167 | — | 0.7166 | 6.51e-4 | RECORDED | method | 4.33e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9434 | 0.9430 | — | 0.9428 | 6.30e-4 | RECORDED | method | 1.90e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8303 | 0.8290 | — | 0.8289 | 1.34e-3 | RECORDED | method | 8.97e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7173 | 0.7167 | — | 0.7166 | 6.51e-4 | RECORDED | method | 4.33e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9421 | 0.9417 | — | 0.9415 | 6.47e-4 | RECORDED | method | 2.08e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8224 | 0.8212 | — | 0.8211 | 1.34e-3 | RECORDED | method | 1.21e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7020 | 0.7015 | — | 0.7015 | 5.33e-4 | RECORDED | method | 7.90e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9417 | 0.9413 | — | 0.9411 | 6.57e-4 | RECORDED | method | 1.86e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8215 | 0.8202 | — | 0.8201 | 1.37e-3 | RECORDED | method | 8.86e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6993 | 0.6988 | — | 0.6987 | 5.89e-4 | RECORDED | method | 8.97e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9379 | 0.9375 | — | 0.9373 | 6.41e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7980 | 0.7970 | — | 0.7969 | 1.12e-3 | RECORDED | method | 7.26e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6564 | 0.6565 | — | 0.6565 | -8.71e-5 | RECORDED | method | -2.39e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9363 | 0.9358 | — | 0.9356 | 6.84e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7924 | 0.7912 | — | 0.7911 | 1.27e-3 | RECORDED | method | 7.89e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.6422 | 0.6420 | — | 0.6419 | 3.21e-4 | RECORDED | method | 1.20e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.659 | ok | ok | ok | ok | 1.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 9.159 | ok | ok | ok | ok | 1.49e-13 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9398 | 6.63e-4 | RECORDED | method | 2.10e-4 | RECORDED | method | 4.49e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8214 | 0.8201 | 0.8208 | 0.8200 | 1.39e-3 | RECORDED | method | 7.91e-5 | RECORDED | method | 7.37e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7025 | 0.7024 | 0.7030 | 0.7021 | 4.15e-4 | RECORDED | method | 2.69e-4 | RECORDED | method | 8.63e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9404 | 0.9400 | 0.9402 | 0.9398 | 6.63e-4 | RECORDED | method | 2.10e-4 | RECORDED | method | 4.49e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8214 | 0.8201 | 0.8208 | 0.8200 | 1.39e-3 | RECORDED | method | 7.91e-5 | RECORDED | method | 7.37e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7025 | 0.7024 | 0.7030 | 0.7021 | 4.15e-4 | RECORDED | method | 2.69e-4 | RECORDED | method | 8.63e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9389 | 0.9384 | 0.9387 | 0.9382 | 6.80e-4 | RECORDED | method | 2.29e-4 | RECORDED | method | 4.81e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.8122 | 0.8110 | 0.8117 | 0.8109 | 1.36e-3 | RECORDED | method | 1.09e-4 | RECORDED | method | 8.34e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6852 | 0.6853 | 0.6860 | 0.6850 | 2.54e-4 | RECORDED | method | 3.01e-4 | RECORDED | method | 9.93e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9388 | 0.9384 | 0.9386 | 0.9382 | 6.92e-4 | RECORDED | method | 2.07e-4 | RECORDED | method | 4.84e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.8143 | 0.8130 | 0.8137 | 0.8129 | 1.41e-3 | RECORDED | method | 7.67e-5 | RECORDED | method | 8.23e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6895 | 0.6895 | 0.6902 | 0.6893 | 2.77e-4 | RECORDED | method | 2.63e-4 | RECORDED | method | 9.40e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9340 | 0.9335 | 0.9338 | 0.9333 | 6.70e-4 | RECORDED | method | 2.40e-4 | RECORDED | method | 5.22e-4 | RECORDED | method |
| 1 | sagittal | 30 | 0.7838 | 0.7828 | 0.7837 | 0.7827 | 1.07e-3 | RECORDED | method | 4.27e-5 | RECORDED | method | 9.67e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6334 | 0.6340 | 0.6350 | 0.6339 | -5.16e-4 | RECORDED | method | 1.17e-4 | RECORDED | method | 1.11e-3 | RECORDED | method |
| 1 | tangential | 10 | 0.9346 | 0.9341 | 0.9344 | 0.9339 | 7.20e-4 | RECORDED | method | 2.09e-4 | RECORDED | method | 5.20e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.7951 | 0.7939 | 0.7948 | 0.7939 | 1.25e-3 | RECORDED | method | 9.00e-6 | RECORDED | method | 9.20e-4 | RECORDED | method |
| 1 | tangential | 50 | 0.6563 | 0.6566 | 0.6574 | 0.6564 | -1.34e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | 1.03e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### nikon-z-135f18-plena-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.659 | ok | ok | — | ok | 8.88e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 9.159 | ok | ok | — | ok | 2.84e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9434 | 0.9430 | — | 0.9428 | 6.31e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8303 | 0.8290 | — | 0.8289 | 1.35e-3 | RECORDED | method | 9.40e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7173 | 0.7167 | — | 0.7166 | 6.60e-4 | RECORDED | method | 5.03e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9434 | 0.9430 | — | 0.9428 | 6.31e-4 | RECORDED | method | 1.92e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8303 | 0.8290 | — | 0.8289 | 1.35e-3 | RECORDED | method | 9.40e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7173 | 0.7167 | — | 0.7166 | 6.60e-4 | RECORDED | method | 5.03e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9420 | 0.9415 | — | 0.9413 | 6.47e-4 | RECORDED | method | 2.09e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.8215 | 0.8203 | — | 0.8202 | 1.33e-3 | RECORDED | method | 1.21e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.7003 | 0.6999 | — | 0.6998 | 5.11e-4 | RECORDED | method | 7.60e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9416 | 0.9412 | — | 0.9410 | 6.58e-4 | RECORDED | method | 1.87e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.8209 | 0.8196 | — | 0.8195 | 1.37e-3 | RECORDED | method | 9.04e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6982 | 0.6977 | — | 0.6976 | 5.78e-4 | RECORDED | method | 9.04e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9377 | 0.9372 | — | 0.9370 | 6.39e-4 | RECORDED | method | 2.19e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7963 | 0.7953 | — | 0.7952 | 1.10e-3 | RECORDED | method | 6.83e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6532 | 0.6533 | — | 0.6533 | -1.37e-4 | RECORDED | method | -3.73e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.9361 | 0.9356 | — | 0.9354 | 6.83e-4 | RECORDED | method | 1.93e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7912 | 0.7900 | — | 0.7899 | 1.26e-3 | RECORDED | method | 7.66e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.6400 | 0.6398 | — | 0.6397 | 2.85e-4 | RECORDED | method | 1.11e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | method | two-methods |
| 0.5 | 13.797 | ok | ok | ok | ok | 3.55e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 25.567 | ok | unconverged | no curve | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | no-curve |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9450 | 0.9447 | 0.9457 | 0.9457 | -6.86e-4 | RECORDED | method | -1.00e-3 | SET ASIDE | numerical | 1.95e-5 | RECORDED | method |
| 0 | sagittal | 30 | 0.8070 | 0.8051 | 0.8107 | 0.8102 | -3.21e-3 | RECORDED | method | -5.14e-3 | SET ASIDE | numerical | 4.62e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7155 | 0.7128 | 0.7198 | 0.7189 | -3.41e-3 | RECORDED | method | -6.11e-3 | SET ASIDE | numerical | 9.01e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9450 | 0.9447 | 0.9457 | 0.9457 | -6.86e-4 | RECORDED | method | -1.00e-3 | SET ASIDE | numerical | 1.95e-5 | RECORDED | method |
| 0 | tangential | 30 | 0.8070 | 0.8051 | 0.8107 | 0.8102 | -3.21e-3 | RECORDED | method | -5.14e-3 | SET ASIDE | numerical | 4.62e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7155 | 0.7128 | 0.7198 | 0.7189 | -3.41e-3 | RECORDED | method | -6.11e-3 | SET ASIDE | numerical | 9.01e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9495 | 0.9502 | 0.9502 | 0.9502 | -7.45e-4 | RECORDED | method | -2.55e-5 | RECORDED | method | -1.56e-5 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7924 | 0.7935 | 0.7958 | 0.7948 | -2.45e-3 | RECORDED | method | -1.35e-3 | RECORDED | method | 9.17e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6400 | 0.6401 | 0.6435 | 0.6421 | -2.08e-3 | RECORDED | method | -1.96e-3 | RECORDED | method | 1.39e-3 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9386 | 0.9392 | 0.9384 | 0.9391 | -5.25e-4 | RECORDED | method | 2.86e-5 | RECORDED | method | -7.40e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7034 | 0.7043 | 0.7024 | 0.7050 | -1.60e-3 | RECORDED | method | -6.55e-4 | RECORDED | method | -2.54e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.4081 | 0.4073 | 0.4034 | 0.4076 | 4.68e-4 | RECORDED | method | -2.76e-4 | RECORDED | method | -4.16e-3 | RECORDED | method |
| 1 | sagittal | 10 | 0.7513 | 0.7512 | — | 0.7532 | -1.90e-3 | RECORDED | method | -2.04e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3608 | 0.3606 | — | 0.3625 | -1.69e-3 | RECORDED | method | -1.90e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2988 | 0.2990 | — | 0.2976 | 1.26e-3 | RECORDED | method | 1.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8198 | 0.8202 | — | 0.8197 | 1.09e-4 | RECORDED | method | 4.80e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3471 | 0.3479 | — | 0.3474 | -2.53e-4 | RECORDED | method | 5.68e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.1197 | 0.1196 | — | 0.1213 | -1.58e-3 | RECORDED | method | -1.69e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | unconverged | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 13.797 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 25.567 | ok | unconverged | — | ok | 3.55e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | numerical | unconverged | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9376 | 0.9373 | — | 0.9384 | -7.85e-4 | RECORDED | method | -1.12e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.7729 | 0.7713 | — | 0.7757 | -2.86e-3 | RECORDED | method | -4.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6618 | 0.6604 | — | 0.6641 | -2.33e-3 | RECORDED | method | -3.70e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9376 | 0.9373 | — | 0.9384 | -7.85e-4 | RECORDED | method | -1.12e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.7729 | 0.7713 | — | 0.7757 | -2.86e-3 | RECORDED | method | -4.39e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6618 | 0.6604 | — | 0.6641 | -2.33e-3 | RECORDED | method | -3.70e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9435 | 0.9443 | — | 0.9443 | -7.44e-4 | RECORDED | method | 4.32e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7576 | 0.7588 | — | 0.7597 | -2.07e-3 | RECORDED | method | -8.52e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5800 | 0.5795 | — | 0.5808 | -8.57e-4 | RECORDED | method | -1.29e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9359 | 0.9365 | — | 0.9363 | -3.53e-4 | RECORDED | method | 2.45e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.6989 | 0.6999 | — | 0.6997 | -8.05e-4 | RECORDED | method | 2.13e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.4356 | 0.4354 | — | 0.4347 | 9.09e-4 | RECORDED | method | 6.91e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.7472 | 0.7470 | — | 0.7488 | -1.59e-3 | RECORDED | method | -1.75e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.3462 | 0.3462 | — | 0.3483 | -2.11e-3 | RECORDED | method | -2.11e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.2885 | 0.2887 | — | 0.2873 | 1.24e-3 | RECORDED | method | 1.36e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8075 | 0.8080 | — | 0.8095 | -1.95e-3 | RECORDED | method | -1.44e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.3285 | 0.3285 | — | 0.3298 | -1.31e-3 | RECORDED | method | -1.30e-3 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.0914 | 0.0911 | — | 0.0908 | 5.74e-4 | RECORDED | method | 2.38e-4 | SET ASIDE | numerical | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-f8-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 13.797 | ok | ok | ok | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 25.567 | ok | ok | ok | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9391 | 0.9388 | 0.9388 | 0.9385 | 5.89e-4 | RECORDED | method | 2.41e-4 | RECORDED | method | 2.48e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8130 | 0.8121 | 0.8123 | 0.8120 | 1.08e-3 | RECORDED | method | 1.56e-4 | RECORDED | method | 3.60e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.6887 | 0.6891 | 0.6893 | 0.6887 | -3.55e-5 | RECORDED | method | 3.63e-4 | RECORDED | method | 5.31e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9391 | 0.9388 | 0.9388 | 0.9385 | 5.89e-4 | RECORDED | method | 2.41e-4 | RECORDED | method | 2.48e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8130 | 0.8121 | 0.8123 | 0.8120 | 1.08e-3 | RECORDED | method | 1.56e-4 | RECORDED | method | 3.60e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.6887 | 0.6891 | 0.6893 | 0.6887 | -3.56e-5 | RECORDED | method | 3.63e-4 | RECORDED | method | 5.31e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9288 | 0.9285 | 0.9285 | 0.9282 | 5.63e-4 | RECORDED | method | 2.35e-4 | RECORDED | method | 3.01e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7528 | 0.7522 | 0.7529 | 0.7522 | 5.63e-4 | RECORDED | method | -4.58e-5 | RECORDED | method | 6.40e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.5789 | 0.5801 | 0.5812 | 0.5802 | -1.39e-3 | RECORDED | method | -1.11e-4 | RECORDED | method | 9.34e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9293 | 0.9290 | 0.9290 | 0.9289 | 4.94e-4 | RECORDED | method | 1.17e-4 | RECORDED | method | 1.25e-4 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7721 | 0.7713 | 0.7718 | 0.7717 | 3.20e-4 | RECORDED | method | -4.12e-4 | RECORDED | method | 1.78e-5 | RECORDED | method |
| 0.5 | tangential | 50 | 0.6210 | 0.6219 | 0.6222 | 0.6223 | -1.33e-3 | RECORDED | method | -4.37e-4 | RECORDED | method | -1.08e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9329 | 0.9329 | 0.9330 | 0.9330 | -1.41e-4 | RECORDED | method | -1.10e-4 | RECORDED | method | -3.97e-6 | RECORDED | method |
| 1 | sagittal | 30 | 0.7885 | 0.7888 | 0.7891 | 0.7893 | -7.75e-4 | RECORDED | method | -5.58e-4 | RECORDED | method | -1.99e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6462 | 0.6465 | 0.6475 | 0.6471 | -9.01e-4 | RECORDED | method | -6.67e-4 | RECORDED | method | 3.41e-4 | RECORDED | method |
| 1 | tangential | 10 | 0.8549 | 0.8548 | 0.8540 | 0.8548 | 7.53e-5 | RECORDED | method | 1.09e-6 | RECORDED | method | -7.63e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.5432 | 0.5431 | 0.5423 | 0.5450 | -1.73e-3 | RECORDED | method | -1.90e-3 | RECORDED | method | -2.65e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.3290 | 0.3292 | 0.3286 | 0.3315 | -2.47e-3 | RECORDED | method | -2.22e-3 | RECORDED | method | -2.84e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-f8-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 13.797 | ok | ok | — | ok | 3.55e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 25.567 | ok | ok | — | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9415 | 0.9412 | — | 0.9409 | 5.52e-4 | RECORDED | method | 2.27e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8180 | 0.8171 | — | 0.8170 | 1.02e-3 | RECORDED | method | 1.59e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.6956 | 0.6957 | — | 0.6956 | -3.33e-5 | RECORDED | method | 9.10e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9415 | 0.9412 | — | 0.9409 | 5.52e-4 | RECORDED | method | 2.27e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8180 | 0.8171 | — | 0.8170 | 1.02e-3 | RECORDED | method | 1.59e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.6956 | 0.6957 | — | 0.6956 | -3.33e-5 | RECORDED | method | 9.10e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9305 | 0.9302 | — | 0.9300 | 5.17e-4 | RECORDED | method | 2.18e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7526 | 0.7520 | — | 0.7521 | 4.91e-4 | RECORDED | method | -4.97e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5742 | 0.5753 | — | 0.5756 | -1.45e-3 | RECORDED | method | -3.59e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9334 | 0.9331 | — | 0.9330 | 4.93e-4 | RECORDED | method | 1.30e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7864 | 0.7856 | — | 0.7859 | 4.90e-4 | RECORDED | method | -3.04e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.6434 | 0.6439 | — | 0.6443 | -8.65e-4 | RECORDED | method | -3.41e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9358 | 0.9358 | — | 0.9356 | 1.68e-4 | RECORDED | method | 1.78e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7940 | 0.7941 | — | 0.7939 | 6.80e-5 | RECORDED | method | 1.84e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6527 | 0.6528 | — | 0.6524 | 2.97e-4 | RECORDED | method | 4.20e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8646 | 0.8645 | — | 0.8645 | 9.99e-5 | RECORDED | method | 6.66e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5755 | 0.5754 | — | 0.5766 | -1.11e-3 | RECORDED | method | -1.18e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3607 | 0.3606 | — | 0.3620 | -1.28e-3 | RECORDED | method | -1.36e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-f8-best-ref

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-7 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 13.797 | ok | ok | ok | ok | 1.24e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 1 | 25.567 | ok | ok | ok | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9407 | 0.9403 | 0.9403 | 0.9401 | 5.84e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | 2.09e-4 | RECORDED | method |
| 0 | sagittal | 30 | 0.8218 | 0.8207 | 0.8208 | 0.8206 | 1.23e-3 | RECORDED | method | 1.27e-4 | RECORDED | method | 2.34e-4 | RECORDED | method |
| 0 | sagittal | 50 | 0.7028 | 0.7029 | 0.7028 | 0.7025 | 3.19e-4 | RECORDED | method | 3.51e-4 | RECORDED | method | 3.27e-4 | RECORDED | method |
| 0 | tangential | 10 | 0.9407 | 0.9403 | 0.9403 | 0.9401 | 5.84e-4 | RECORDED | method | 2.16e-4 | RECORDED | method | 2.09e-4 | RECORDED | method |
| 0 | tangential | 30 | 0.8218 | 0.8207 | 0.8208 | 0.8206 | 1.23e-3 | RECORDED | method | 1.27e-4 | RECORDED | method | 2.34e-4 | RECORDED | method |
| 0 | tangential | 50 | 0.7028 | 0.7029 | 0.7028 | 0.7025 | 3.19e-4 | RECORDED | method | 3.51e-4 | RECORDED | method | 3.27e-4 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.9352 | 0.9349 | 0.9349 | 0.9347 | 5.85e-4 | RECORDED | method | 2.20e-4 | RECORDED | method | 2.47e-4 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7927 | 0.7917 | 0.7921 | 0.7917 | 1.01e-3 | RECORDED | method | 4.50e-5 | RECORDED | method | 4.03e-4 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.6497 | 0.6504 | 0.6507 | 0.6502 | -4.35e-4 | RECORDED | method | 2.00e-4 | RECORDED | method | 5.70e-4 | RECORDED | method |
| 0.5 | tangential | 10 | 0.9220 | 0.9217 | 0.9217 | 0.9216 | 3.73e-4 | RECORDED | method | 5.09e-5 | RECORDED | method | 6.21e-5 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7298 | 0.7296 | 0.7301 | 0.7302 | -4.46e-4 | RECORDED | method | -6.73e-4 | RECORDED | method | -1.69e-4 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5508 | 0.5524 | 0.5530 | 0.5533 | -2.49e-3 | RECORDED | method | -8.68e-4 | RECORDED | method | -3.10e-4 | RECORDED | method |
| 1 | sagittal | 10 | 0.9338 | 0.9338 | 0.9339 | 0.9340 | -1.93e-4 | RECORDED | method | -1.60e-4 | RECORDED | method | -5.81e-5 | RECORDED | method |
| 1 | sagittal | 30 | 0.7965 | 0.7967 | 0.7970 | 0.7974 | -9.38e-4 | RECORDED | method | -6.93e-4 | RECORDED | method | -4.10e-4 | RECORDED | method |
| 1 | sagittal | 50 | 0.6630 | 0.6633 | 0.6641 | 0.6641 | -1.12e-3 | RECORDED | method | -7.99e-4 | RECORDED | method | -2.34e-5 | RECORDED | method |
| 1 | tangential | 10 | 0.8474 | 0.8473 | 0.8465 | 0.8475 | -4.66e-5 | RECORDED | method | -1.16e-4 | RECORDED | method | -9.61e-4 | RECORDED | method |
| 1 | tangential | 30 | 0.5167 | 0.5165 | 0.5157 | 0.5187 | -2.00e-3 | RECORDED | method | -2.19e-3 | RECORDED | method | -3.01e-3 | RECORDED | method |
| 1 | tangential | 50 | 0.3062 | 0.3065 | 0.3061 | 0.3090 | -2.78e-3 | RECORDED | method | -2.51e-3 | RECORDED | method | -2.88e-3 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 5.00e-3 on the axis, 1.00e-2 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 13.797 | ok | ok | — | ok | 1.07e-14 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 25.567 | ok | ok | — | ok | 7.11e-15 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.9434 | 0.9430 | — | 0.9428 | 5.51e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.8289 | 0.8279 | — | 0.8277 | 1.18e-3 | RECORDED | method | 1.51e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.7144 | 0.7140 | — | 0.7139 | 4.58e-4 | RECORDED | method | 1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.9434 | 0.9430 | — | 0.9428 | 5.51e-4 | RECORDED | method | 2.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.8289 | 0.8279 | — | 0.8277 | 1.18e-3 | RECORDED | method | 1.51e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.7144 | 0.7140 | — | 0.7139 | 4.58e-4 | RECORDED | method | 1.26e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.9378 | 0.9375 | — | 0.9373 | 5.48e-4 | RECORDED | method | 2.05e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7982 | 0.7973 | — | 0.7972 | 9.52e-4 | RECORDED | method | 6.09e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.6568 | 0.6571 | — | 0.6571 | -2.90e-4 | RECORDED | method | -5.09e-6 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.9267 | 0.9264 | — | 0.9263 | 3.79e-4 | RECORDED | method | 6.52e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7471 | 0.7467 | — | 0.7473 | -2.01e-4 | RECORDED | method | -5.66e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5774 | 0.5788 | — | 0.5795 | -2.06e-3 | RECORDED | method | -7.58e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.9369 | 0.9369 | — | 0.9368 | 1.22e-4 | RECORDED | method | 1.35e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.8038 | 0.8039 | — | 0.8038 | -3.76e-5 | RECORDED | method | 1.03e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.6737 | 0.6739 | — | 0.6735 | 2.29e-4 | RECORDED | method | 4.01e-4 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8586 | 0.8585 | — | 0.8585 | 3.54e-5 | RECORDED | method | -5.39e-5 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.5544 | 0.5543 | — | 0.5555 | -1.14e-3 | RECORDED | method | -1.20e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.3430 | 0.3429 | — | 0.3442 | -1.23e-3 | RECORDED | method | -1.34e-3 | RECORDED | method | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

## Later steps

An engine that was asked a request once more, with a finer sampling, because of what its first answer came to.
Its first answer is what the support counts; the step is what its row of a table is of.

| Rung | Engine | Step | Runs | Requests asked again | Not ok |
|---|---|---|---|---|---|
| r5 | optiland | fft512 | 18 | 18 | — |
| r5g | optiland | geo512 | 6 | 6 | — |

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

| Rung | Run | Field | Pair | Figures above their bands |
|---|---|---|---|---|
| r5 | canon-ef-135-f2l-usm-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.07e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5 | canon-ef-135-f2l-usm-ref | — | optiland – wave | mtfOnAxis.maxAbs 6.64e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6c | canon-ef-135-f2l-usm-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.21e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r6c | canon-ef-135-f2l-usm-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 6.78e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 90 |
| r6c | canon-ef-135-f2l-usm-ref | — | optiland – wave | mtfOnAxis.maxAbs 6.79e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5 | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.75e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 50; mtfOffAxis.maxAbs 2.64e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 60 |
| r6c | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.40e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 50; mtfOffAxis.maxAbs 2.63e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 60 |
| r5 | sigma-35mm-f14-dg-hsm-a-ref | — | lv – optiland | mtfOnAxis.maxAbs 6.59e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5 | sigma-35mm-f14-dg-hsm-a-ref | — | optiland – wave | mtfOnAxis.maxAbs 9.40e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6c | sigma-35mm-f14-dg-hsm-a-ref | — | lv – optiland | mtfOnAxis.maxAbs 6.83e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r6c | sigma-35mm-f14-dg-hsm-a-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 9.72e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r6c | sigma-35mm-f14-dg-hsm-a-ref | — | optiland – wave | mtfOnAxis.maxAbs 9.63e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5 | sony-fe-20mm-f18-g-ref | — | lv – optiland | mtfOnAxis.maxAbs 2.58e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30; mtfOffAxis.maxAbs 2.63e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 30 |
| r6c | sony-fe-20mm-f18-g-ref | — | lv – optiland | mtfOnAxis.maxAbs 2.62e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r6c | sony-fe-20mm-f18-g-ref | — | lv – optiland-wave | mtfOnAxis.maxAbs 5.15e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r6c | sony-fe-20mm-f18-g-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 2.11e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 30 |
| r5 | sony-fe-400mm-f28-gm-oss-ref | — | lv – optiland | mtfOnAxis.maxAbs 1.01e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 1.01e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 80 |
| r5 | sony-fe-400mm-f28-gm-oss-ref | — | optiland – wave | mtfOnAxis.maxAbs 9.92e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 1.10e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 80 |
| r6c | sony-fe-400mm-f28-gm-oss-ref | — | lv – optiland | mtfOnAxis.maxAbs 1.04e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 1.01e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 80 |
| r6c | sony-fe-400mm-f28-gm-oss-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 8.93e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 1.05e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 80 |
| r6c | sony-fe-400mm-f28-gm-oss-ref | — | optiland – wave | mtfOnAxis.maxAbs 1.02e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 1.11e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 80 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-ref | — | lv – optiland | mtfOnAxis.maxAbs 8.58e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 4.00e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-ref | — | optiland – wave | mtfOnAxis.maxAbs 8.42e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 4.03e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r6c | sigma-105mm-f28-dg-dn-macro-art-ref | — | lv – optiland | mtfOnAxis.maxAbs 8.73e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 3.95e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r6c | sigma-105mm-f28-dg-dn-macro-art-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 5.91e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 90; mtfOffAxis.maxAbs 4.12e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r6c | sigma-105mm-f28-dg-dn-macro-art-ref | — | optiland – wave | mtfOnAxis.maxAbs 8.57e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 3.98e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r5 | nikon-z-24-70f4s-wide-ref | — | lv – optiland | mtfOnAxis.maxAbs 7.49e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 7.49e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 20 |
| r6c | nikon-z-24-70f4s-wide-ref | — | lv – optiland | mtfOnAxis.maxAbs 7.78e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 40; mtfOffAxis.maxAbs 7.49e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 20 |
| r6c | nikon-z-24-70f4s-wide-ref | — | optiland – optiland-wave | mtfOffAxis.maxAbs 7.12e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 20 |
| r5 | nikon-z-24-70f4s-tele-ref | — | lv – optiland | mtfOffAxis.maxAbs 2.75e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5 | nikon-z-24-70f4s-tele-ref | — | optiland – wave | mtfOnAxis.maxAbs 6.68e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80; mtfOffAxis.maxAbs 1.03e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r6c | nikon-z-24-70f4s-tele-ref | — | lv – optiland | mtfOffAxis.maxAbs 2.75e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r6c | nikon-z-24-70f4s-tele-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 5.83e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 70; mtfOffAxis.maxAbs 2.75e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r6c | nikon-z-24-70f4s-tele-ref | — | optiland – wave | mtfOnAxis.maxAbs 6.87e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80; mtfOffAxis.maxAbs 1.05e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 8.65e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 8.65e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5 | nikon-z-mc-105f28-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.45e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 70 |
| r5 | nikon-z-mc-105f28-ref | — | optiland – wave | mtfOnAxis.maxAbs 5.44e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r5g | nikon-z-mc-105f28-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 5.66e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 5.66e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6c | nikon-z-mc-105f28-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.68e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 70 |
| r6c | nikon-z-mc-105f28-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 6.24e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r6c | nikon-z-mc-105f28-ref | — | optiland – wave | mtfOnAxis.maxAbs 5.70e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r5g | nikon-z-mc-105f28-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 6.38e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 6.38e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5 | nikon-z-135f18-plena-ref | — | lv – optiland | mtfOnAxis.maxAbs 1.80e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 70; mtfOffAxis.maxAbs 3.06e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r5 | nikon-z-135f18-plena-ref | — | optiland – wave | mtfOffAxis.maxAbs 1.93e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 40 |
| r6c | nikon-z-135f18-plena-ref | — | lv – optiland | mtfOnAxis.maxAbs 1.83e-2 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 70; mtfOffAxis.maxAbs 3.08e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 30 |
| r6c | nikon-z-135f18-plena-ref | — | lv – optiland-wave | mtfOnAxis.maxAbs 6.94e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6c | nikon-z-135f18-plena-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 1.44e-2 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60; mtfOffAxis.maxAbs 2.65e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r6c | nikon-z-135f18-plena-ref | — | optiland – wave | mtfOffAxis.maxAbs 1.94e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 50 |
| r5 | canon-ef-135-f2l-usm-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 1.03e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 70 |
| r5 | canon-ef-135-f2l-usm-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 5.22e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6c | canon-ef-135-f2l-usm-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 1.02e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 70 |
| r6c | canon-ef-135-f2l-usm-best-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 5.79e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r6c | canon-ef-135-f2l-usm-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 5.31e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5 | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 3.06e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 60 |
| r6c | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 3.07e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 60 |
| r5g | sigma-35mm-f14-dg-hsm-a-best-photopic | 0.5 | lv – optiland | mtfOffAxis.maxAbs 1.21e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5g | sigma-35mm-f14-dg-hsm-a-best-photopic | 0.5 | optiland – replay | mtfOffAxis.maxAbs 1.21e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 90 |
| r5 | nikkor-z50f12-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 6.02e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r6c | nikkor-z50f12-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 6.02e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r6c | nikkor-z50f12-best-ref | — | lv – optiland-wave | mtfOnAxis.maxAbs 5.80e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r6c | nikkor-z50f12-best-ref | — | optiland – optiland-wave | mtfOffAxis.maxAbs 5.99e-2 (band 1.00e-2) at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r5 | sony-fe-20mm-f18-g-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 9.48e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60; mtfOffAxis.maxAbs 4.91e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 10 |
| r5 | sony-fe-20mm-f18-g-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 8.41e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r6c | sony-fe-20mm-f18-g-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 9.67e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 60 |
| r6c | sony-fe-20mm-f18-g-best-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 6.45e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r6c | sony-fe-20mm-f18-g-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 8.60e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60 |
| r5g | sony-fe-400mm-f28-gm-oss-best-ref | 1 | lv – optiland | mtfOffAxis.maxAbs 1.22e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5g | sony-fe-400mm-f28-gm-oss-best-ref | 1 | optiland – replay | mtfOffAxis.maxAbs 1.22e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 100 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 3.73e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r5 | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 5.47e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 3.76e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r6c | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 5.05e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 60; mtfOffAxis.maxAbs 3.69e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r6c | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 6.19e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 3.83e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r6c | sigma-105mm-f28-dg-dn-macro-art-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 5.54e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100; mtfOffAxis.maxAbs 3.71e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 30 |
| r5 | nikon-z-24-70f4s-wide-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 6.44e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 70 |
| r5g | nikon-z-24-70f4s-wide-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 7.43e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-wide-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 7.43e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r6c | nikon-z-24-70f4s-wide-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 6.45e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 70 |
| r6c | nikon-z-24-70f4s-wide-best-ref | — | lv – optiland-wave | mtfOnAxis.maxAbs 5.16e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r6c | nikon-z-24-70f4s-wide-best-ref | — | optiland – optiland-wave | mtfOffAxis.maxAbs 6.45e-2 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 80 |
| r5g | nikon-z-24-70f4s-wide-best-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 6.17e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-wide-best-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 6.17e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 100 |
| r5 | nikon-z-24-70f4s-tele-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 2.67e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r5 | nikon-z-24-70f4s-tele-best-ref | — | lv – wave | mtfOnAxis.maxAbs 5.42e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 80 |
| r5 | nikon-z-24-70f4s-tele-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 6.27e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 8.84e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-24-70f4s-tele-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 8.84e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6b | nikon-z-24-70f4s-tele-best-ref | — | lv – wave | mtfOnAxis.maxAbs 5.42e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 80 |
| r6c | nikon-z-24-70f4s-tele-best-ref | — | lv – optiland | mtfOffAxis.maxAbs 2.67e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r6c | nikon-z-24-70f4s-tele-best-ref | — | lv – wave | mtfOnAxis.maxAbs 5.42e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 80 |
| r6c | nikon-z-24-70f4s-tele-best-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 5.74e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80; mtfOffAxis.maxAbs 2.66e-1 (band 1.00e-2) at cut tangential, field 1, frequencyPerMm 50 |
| r6c | nikon-z-24-70f4s-tele-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 6.43e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80 |
| r5g | nikon-z-mc-105f28-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 7.48e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-mc-105f28-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 7.48e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5 | nikon-z-135f18-plena-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 7.33e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80; mtfOffAxis.maxAbs 2.71e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r5 | nikon-z-135f18-plena-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 7.50e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 70; mtfOffAxis.maxAbs 1.29e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 60 |
| r5g | nikon-z-135f18-plena-best-ref | 0 | lv – optiland | mtfOnAxis.maxAbs 6.96e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-135f18-plena-best-ref | 0 | optiland – replay | mtfOnAxis.maxAbs 6.96e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r6c | nikon-z-135f18-plena-best-ref | — | lv – optiland | mtfOnAxis.maxAbs 7.52e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 80; mtfOffAxis.maxAbs 2.72e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r6c | nikon-z-135f18-plena-best-ref | — | optiland – optiland-wave | mtfOnAxis.maxAbs 7.51e-3 (band 5.00e-3) at cut sagittal, field 0, frequencyPerMm 70; mtfOffAxis.maxAbs 2.16e-2 (band 1.00e-2) at cut sagittal, field 1, frequencyPerMm 40 |
| r6c | nikon-z-135f18-plena-best-ref | — | optiland – wave | mtfOnAxis.maxAbs 7.68e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 70; mtfOffAxis.maxAbs 1.31e-2 (band 1.00e-2) at cut sagittal, field 5.00e-1, frequencyPerMm 60 |
| r5g | nikon-z-135f18-plena-best-photopic | 0 | lv – optiland | mtfOnAxis.maxAbs 6.21e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |
| r5g | nikon-z-135f18-plena-best-photopic | 0 | optiland – replay | mtfOnAxis.maxAbs 6.21e-3 (band 5.00e-3) at cut tangential, field 0, frequencyPerMm 100 |

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
