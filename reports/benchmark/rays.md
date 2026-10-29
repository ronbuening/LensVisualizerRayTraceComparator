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
| Baseline hash | 1959dbedb724189ce0470a8bcef61b2c494acd11a77df1ce9869d38fe788481f |
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
| r7a | rays.trace | 96 | 2880 | lv – optiland | 96 PASS | 2880 PASS |
| r7a | rays.trace | 96 | 2880 | lv – ref | 96 PASS | 2880 PASS |
| r7a | rays.trace | 96 | 2880 | optiland – ref | 96 PASS | 2880 PASS |
| r8a | rays.trace | 96 | 624 | lv – optiland | 96 PASS | 624 PASS |
| r8a | rays.trace | 96 | 624 | lv – ref | 96 PASS | 624 PASS |
| r8a | rays.trace | 96 | 624 | optiland – ref | 96 PASS | 624 PASS |
| r9a | rays.trace | 96 | 384 | lv – optiland | 96 PASS | 384 PASS |
| r9a | rays.trace | 96 | 384 | lv – ref | 96 PASS | 384 PASS |
| r9a | rays.trace | 96 | 384 | optiland – ref | 96 PASS | 384 PASS |
| r10a | rays.trace | 96 | 576 | lv – optiland | 96 PASS | 576 PASS |
| r10a | rays.trace | 96 | 576 | lv – ref | 96 PASS | 576 PASS |
| r10a | rays.trace | 96 | 576 | optiland – ref | 96 PASS | 576 PASS |
| r11a | rays.trace | 96 | 288 | lv – optiland | 96 PASS | 288 PASS |
| r11a | rays.trace | 96 | 288 | lv – ref | 96 PASS | 288 PASS |
| r11a | rays.trace | 96 | 288 | optiland – ref | 96 PASS | 288 PASS |

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
| r7a | lv | 96 ok |
| r7a | optiland | 96 ok |
| r7a | ref | 96 ok |
| r8a | lv | 96 ok |
| r8a | optiland | 96 ok |
| r8a | ref | 96 ok |
| r9a | lv | 96 ok |
| r9a | optiland | 96 ok |
| r9a | ref | 96 ok |
| r10a | lv | 96 ok |
| r10a | optiland | 96 ok |
| r10a | ref | 96 ok |
| r11a | lv | 96 ok |
| r11a | optiland | 96 ok |
| r11a | ref | 96 ok |

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
| nikkor-z50f12-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
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
| nikon-z-mc-105f28-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
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
| nikkor-z50f12-best-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-best-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-best-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f8-best-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
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
| nikon-z-mc-105f28-best-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-best-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-best-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f8-best-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f8-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
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
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 4.97e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 4.97e-14 | canon-ef-135-f2l-usm-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.05e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 4, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 3.91e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 2, quantity exitPupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 3.91e-14 | sigma-35mm-f14-dg-hsm-a-photopic | line 2, quantity exitPupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 3.87e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.02e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 4.26e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 4.26e-14 | sony-fe-400mm-f28-gm-oss-ref | line 0, quantity entrancePupilSemiDiameter |

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
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
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
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
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
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-best-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-wide-f8-photopic | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
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
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 1.17e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 4, ray 803, surface 20 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 2.43e-14 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 265 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 7.69e-13 | sigma-45mm-f28-dg-dn-contemporary-best-photopic | field 2.56e1, line 2, ray 779 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 803472 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.10e-12 | nikkor-z50f12-photopic | field 0, line 1, ray 293, surface 31 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 2.36e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 173 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.02e-12 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 173 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 803472 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.16e-12 | nikon-z-24-70f4s-wide-photopic | field 4.33e1, line 2, ray 838, surface 20 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 2.43e-14 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 173 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 1.03e-12 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 173 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 803472 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: landing.maxDistance 1.34e-13 mm | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | 2363 / 712 / 0 | 2363 / 712 / 0 | 2363 / 712 / 0 |
| canon-ef-135-f2l-usm-photopic | 15 | PASS: landing.maxDistance 1.91e-13 mm | PASS: landing.maxDistance 1.44e-13 mm | PASS: landing.maxDistance 1.74e-13 mm | 11817 / 3558 / 0 | 11817 / 3558 / 0 | 11817 / 3558 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: landing.maxDistance 1.06e-13 mm | PASS: landing.maxDistance 6.75e-14 mm | PASS: landing.maxDistance 1.04e-13 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 8.55e-14 mm | PASS: landing.maxDistance 1.13e-13 mm | 13387 / 1988 / 0 | 13387 / 1988 / 0 | 13387 / 1988 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: landing.maxDistance 2.13e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 2311 / 764 / 0 | 2311 / 764 / 0 | 2311 / 764 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11543 / 3832 / 0 | 11543 / 3832 / 0 | 11543 / 3832 / 0 |
| nikkor-z50f12-ref | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2381 / 694 / 0 | 2381 / 694 / 0 | 2381 / 694 / 0 |
| nikkor-z50f12-photopic | 15 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | 11891 / 3484 / 0 | 11891 / 3484 / 0 | 11891 / 3484 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: hits.maxDistance 5.31e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2845 / 230 / 0 | 2845 / 230 / 0 | 2845 / 230 / 0 |
| sony-fe-20mm-f18-g-photopic | 15 | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 14251 / 1124 / 0 | 14251 / 1124 / 0 | 14251 / 1124 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: landing.maxDistance 2.68e-13 mm | PASS: landing.maxDistance 2.63e-13 mm | PASS: landing.maxDistance 3.35e-13 mm | 2495 / 580 / 0 | 2495 / 580 / 0 | 2495 / 580 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | PASS: landing.maxDistance 3.59e-13 mm | PASS: landing.maxDistance 3.17e-13 mm | PASS: landing.maxDistance 4.16e-13 mm | 12463 / 2912 / 0 | 12463 / 2912 / 0 | 12463 / 2912 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: landing.maxDistance 1.58e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 1.73e-13 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | PASS: landing.maxDistance 1.89e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 2.40e-13 mm | 13073 / 2302 / 0 | 13073 / 2302 / 0 | 13073 / 2302 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-wide-photopic | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | 14061 / 1314 / 0 | 14061 / 1314 / 0 | 14061 / 1314 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: landing.maxDistance 1.50e-13 mm | PASS: hits.maxDistance 9.87e-13 mm | PASS: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-tele-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.88e-13 mm | 13043 / 2332 / 0 | 13043 / 2332 / 0 | 13043 / 2332 / 0 |
| nikon-z-mc-105f28-ref | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 7.74e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| nikon-z-mc-105f28-photopic | 15 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 11705 / 3670 / 0 | 11705 / 3670 / 0 | 11705 / 3670 / 0 |
| nikon-z-135f18-plena-ref | 3 | PASS: landing.maxDistance 1.69e-13 mm | PASS: hits.maxDistance 9.20e-13 mm | PASS: hits.maxDistance 9.20e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| nikon-z-135f18-plena-photopic | 15 | PASS: landing.maxDistance 2.22e-13 mm | PASS: hits.maxDistance 9.29e-13 mm | PASS: hits.maxDistance 9.29e-13 mm | 14373 / 1002 / 0 | 14373 / 1002 / 0 | 14373 / 1002 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: hits.maxDistance 8.67e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | PASS: hits.maxDistance 9.45e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 12237 / 3138 / 0 | 12237 / 3138 / 0 | 12237 / 3138 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: landing.maxDistance 1.34e-13 mm | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 1.31e-13 mm | 2363 / 712 / 0 | 2363 / 712 / 0 | 2363 / 712 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 15 | PASS: landing.maxDistance 1.88e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | PASS: landing.maxDistance 1.72e-13 mm | 11817 / 3558 / 0 | 11817 / 3558 / 0 | 11817 / 3558 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: hits.maxDistance 9.18e-14 mm | PASS: landing.maxDistance 8.88e-14 mm | PASS: hits.maxDistance 1.11e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 15 | PASS: hits.maxDistance 1.23e-13 mm | PASS: landing.maxDistance 9.34e-14 mm | PASS: hits.maxDistance 1.64e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: hits.maxDistance 9.18e-14 mm | PASS: landing.maxDistance 8.88e-14 mm | PASS: hits.maxDistance 1.11e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | PASS: hits.maxDistance 1.23e-13 mm | PASS: landing.maxDistance 9.24e-14 mm | PASS: hits.maxDistance 1.64e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: landing.maxDistance 1.06e-13 mm | PASS: landing.maxDistance 6.76e-14 mm | PASS: landing.maxDistance 1.04e-13 mm | 2681 / 394 / 0 | 2681 / 394 / 0 | 2681 / 394 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | PASS: landing.maxDistance 1.03e-13 mm | PASS: landing.maxDistance 8.55e-14 mm | PASS: landing.maxDistance 1.13e-13 mm | 13387 / 1988 / 0 | 13387 / 1988 / 0 | 13387 / 1988 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 7.11e-14 mm | PASS: landing.maxDistance 9.96e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 9.24e-14 mm | PASS: hits.maxDistance 1.07e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: landing.maxDistance 1.03e-13 mm | PASS: landing.maxDistance 7.11e-14 mm | PASS: landing.maxDistance 9.60e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 8.88e-14 mm | PASS: hits.maxDistance 1.07e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: landing.maxDistance 2.13e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 2311 / 764 / 0 | 2311 / 764 / 0 | 2311 / 764 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11543 / 3832 / 0 | 11543 / 3832 / 0 | 11543 / 3832 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: hits.maxDistance 1.29e-13 mm | PASS: hits.maxDistance 7.90e-13 mm | PASS: hits.maxDistance 7.99e-13 mm | 2699 / 376 / 0 | 2699 / 376 / 0 | 2699 / 376 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | PASS: hits.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 8.37e-13 mm | PASS: hits.maxDistance 8.38e-13 mm | 13511 / 1864 / 0 | 13511 / 1864 / 0 | 13511 / 1864 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: hits.maxDistance 1.29e-13 mm | PASS: hits.maxDistance 7.90e-13 mm | PASS: hits.maxDistance 7.99e-13 mm | 2699 / 376 / 0 | 2699 / 376 / 0 | 2699 / 376 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | PASS: hits.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 8.37e-13 mm | PASS: hits.maxDistance 8.38e-13 mm | 13511 / 1864 / 0 | 13511 / 1864 / 0 | 13511 / 1864 / 0 |
| nikkor-z50f12-best-ref | 3 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2381 / 694 / 0 | 2381 / 694 / 0 | 2381 / 694 / 0 |
| nikkor-z50f12-best-photopic | 15 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | 11891 / 3484 / 0 | 11891 / 3484 / 0 | 11891 / 3484 / 0 |
| nikkor-z50f12-f8-ref | 3 | PASS: hits.maxDistance 8.53e-13 mm | PASS: hits.maxDistance 9.39e-13 mm | PASS: hits.maxDistance 9.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 15 | PASS: hits.maxDistance 8.81e-13 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: hits.maxDistance 8.53e-13 mm | PASS: hits.maxDistance 9.39e-13 mm | PASS: hits.maxDistance 9.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 15 | PASS: hits.maxDistance 8.81e-13 mm | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: hits.maxDistance 5.31e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2845 / 230 / 0 | 2845 / 230 / 0 | 2845 / 230 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 15 | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 14251 / 1124 / 0 | 14251 / 1124 / 0 | 14251 / 1124 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: landing.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: landing.maxDistance 1.49e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: landing.maxDistance 2.69e-13 mm | PASS: landing.maxDistance 2.65e-13 mm | PASS: landing.maxDistance 3.33e-13 mm | 2495 / 580 / 0 | 2495 / 580 / 0 | 2495 / 580 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | PASS: landing.maxDistance 3.55e-13 mm | PASS: landing.maxDistance 3.18e-13 mm | PASS: landing.maxDistance 4.12e-13 mm | 12463 / 2912 / 0 | 12463 / 2912 / 0 | 12463 / 2912 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: landing.maxDistance 3.34e-13 mm | PASS: landing.maxDistance 3.10e-13 mm | PASS: landing.maxDistance 3.16e-13 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | PASS: landing.maxDistance 3.80e-13 mm | PASS: landing.maxDistance 2.64e-13 mm | PASS: landing.maxDistance 3.82e-13 mm | 15337 / 38 / 0 | 15337 / 38 / 0 | 15337 / 38 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: landing.maxDistance 3.30e-13 mm | PASS: landing.maxDistance 3.07e-13 mm | PASS: landing.maxDistance 3.13e-13 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | PASS: landing.maxDistance 3.80e-13 mm | PASS: landing.maxDistance 2.61e-13 mm | PASS: landing.maxDistance 3.85e-13 mm | 15337 / 38 / 0 | 15337 / 38 / 0 | 15337 / 38 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: landing.maxDistance 1.58e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 1.73e-13 mm | 2617 / 458 / 0 | 2617 / 458 / 0 | 2617 / 458 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | PASS: landing.maxDistance 1.93e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 2.36e-13 mm | 13073 / 2302 / 0 | 13073 / 2302 / 0 | 13073 / 2302 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: landing.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 1.36e-13 mm | PASS: landing.maxDistance 1.89e-13 mm | 2943 / 132 / 0 | 2943 / 132 / 0 | 2943 / 132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | PASS: landing.maxDistance 1.92e-13 mm | PASS: landing.maxDistance 1.39e-13 mm | PASS: landing.maxDistance 2.13e-13 mm | 14703 / 672 / 0 | 14703 / 672 / 0 | 14703 / 672 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: landing.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 1.36e-13 mm | PASS: landing.maxDistance 1.93e-13 mm | 2943 / 132 / 0 | 2943 / 132 / 0 | 2943 / 132 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | PASS: landing.maxDistance 1.92e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | PASS: landing.maxDistance 2.06e-13 mm | 14703 / 672 / 0 | 14703 / 672 / 0 | 14703 / 672 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | 14061 / 1314 / 0 | 14061 / 1314 / 0 | 14061 / 1314 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: landing.maxDistance 1.50e-13 mm | PASS: hits.maxDistance 9.87e-13 mm | PASS: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.88e-13 mm | 13043 / 2332 / 0 | 13043 / 2332 / 0 | 13043 / 2332 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 7.74e-13 mm | 2341 / 734 / 0 | 2341 / 734 / 0 | 2341 / 734 / 0 |
| nikon-z-mc-105f28-best-photopic | 15 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 11705 / 3670 / 0 | 11705 / 3670 / 0 | 11705 / 3670 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: hits.maxDistance 1.46e-13 mm | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 1.39e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 15 | PASS: hits.maxDistance 1.51e-13 mm | PASS: landing.maxDistance 1.49e-13 mm | PASS: landing.maxDistance 1.92e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: hits.maxDistance 1.46e-13 mm | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 15 | PASS: hits.maxDistance 1.51e-13 mm | PASS: landing.maxDistance 1.53e-13 mm | PASS: landing.maxDistance 1.92e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: landing.maxDistance 1.69e-13 mm | PASS: hits.maxDistance 9.20e-13 mm | PASS: hits.maxDistance 9.20e-13 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| nikon-z-135f18-plena-best-photopic | 15 | PASS: landing.maxDistance 2.22e-13 mm | PASS: hits.maxDistance 9.29e-13 mm | PASS: hits.maxDistance 9.29e-13 mm | 14373 / 1002 / 0 | 14373 / 1002 / 0 | 14373 / 1002 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: landing.maxDistance 9.59e-14 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 15 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: landing.maxDistance 9.59e-14 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 15 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: hits.maxDistance 8.67e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2449 / 626 / 0 | 2449 / 626 / 0 | 2449 / 626 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | PASS: hits.maxDistance 9.45e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 12237 / 3138 / 0 | 12237 / 3138 / 0 | 12237 / 3138 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: landing.maxDistance 6.76e-14 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | PASS: hits.maxDistance 8.17e-14 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 14371 / 1004 / 0 | 14371 / 1004 / 0 | 14371 / 1004 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: landing.maxDistance 6.76e-14 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2881 / 194 / 0 | 2881 / 194 / 0 | 2881 / 194 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | PASS: landing.maxDistance 8.53e-14 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 14371 / 1004 / 0 | 14371 / 1004 / 0 | 14371 / 1004 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.18e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1, line 1, ray 779 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.18e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1, line 1, ray 779 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.21e-9 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 2.56e1, line 1, ray 779 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.66e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 1, ray 399 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.66e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 1, ray 399 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.42e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1, line 1, ray 778 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.02e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 1, ray 399 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.02e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 4.33e1, line 1, ray 399 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.48e-9 | nikon-z-24-70f4s-wide-f8-photopic | field 2.42e1, line 1, ray 745 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-photopic | 15 | PASS: opticalPath.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 3.34e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: opticalPathToImage.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | PASS: opd.maxAbs 3.58e-10 waves | PASS: opd.maxAbs 2.23e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.51e-9 waves | PASS: opd.maxAbs 1.63e-9 waves | PASS: opticalPathToImage.maxAbs 1.51e-9 waves |
| nikkor-z50f12-ref | 3 | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-photopic | 15 | PASS: opticalPath.maxAbs 1.81e-9 waves | PASS: opticalPath.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| sony-fe-20mm-f18-g-ref | 3 | PASS: opticalPath.maxAbs 6.29e-10 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.59e-9 waves | PASS: opticalPathToImage.maxAbs 2.40e-9 waves | PASS: opticalPathToImage.maxAbs 2.51e-9 waves |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.69e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.23e-10 waves |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opd.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-wide-photopic | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-tele-photopic | 15 | PASS: opd.maxAbs 1.01e-9 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-mc-105f28-ref | 3 | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-photopic | 15 | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.09e-9 waves |
| nikon-z-135f18-plena-ref | 3 | PASS: opticalPathToImage.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 8.22e-10 waves | PASS: opticalPath.maxAbs 8.22e-10 waves |
| nikon-z-135f18-plena-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPathToImage.maxAbs 1.11e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: opd.maxAbs 1.72e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opd.maxAbs 1.64e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | PASS: opd.maxAbs 2.21e-9 waves | PASS: opd.maxAbs 1.72e-9 waves | PASS: opticalPath.maxAbs 2.15e-9 waves |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-best-photopic | 15 | PASS: opticalPath.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 3.90e-10 waves | PASS: opd.maxAbs 3.34e-10 waves |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f8-photopic | 15 | PASS: opd.maxAbs 5.02e-10 waves | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 5.02e-10 waves |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f8-best-photopic | 15 | PASS: opd.maxAbs 4.46e-10 waves | PASS: opd.maxAbs 2.79e-10 waves | PASS: opd.maxAbs 3.90e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: opticalPathToImage.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opd.maxAbs 1.86e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 15 | PASS: opd.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opticalPathToImage.maxAbs 1.51e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opticalPath.maxAbs 8.71e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 15 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.27e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opticalPath.maxAbs 8.71e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 15 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 1.39e-9 waves | PASS: opticalPath.maxAbs 1.27e-9 waves |
| nikkor-z50f12-best-ref | 3 | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.64e-9 waves |
| nikkor-z50f12-best-photopic | 15 | PASS: opticalPath.maxAbs 1.81e-9 waves | PASS: opticalPath.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| nikkor-z50f12-f8-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-photopic | 15 | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 2.06e-9 waves |
| nikkor-z50f12-f8-best-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f8-best-photopic | 15 | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: opticalPath.maxAbs 6.29e-10 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.59e-9 waves | PASS: opticalPathToImage.maxAbs 2.36e-9 waves | PASS: opticalPathToImage.maxAbs 2.51e-9 waves |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.55e-9 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves |
| sony-fe-20mm-f18-g-f8-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.63e-9 waves | PASS: opticalPathToImage.maxAbs 1.94e-9 waves | PASS: opticalPathToImage.maxAbs 1.87e-9 waves |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.55e-9 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f8-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 1.58e-9 waves | PASS: opticalPathToImage.maxAbs 1.94e-9 waves | PASS: opticalPathToImage.maxAbs 1.87e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-best-photopic | 15 | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.78e-9 waves | PASS: opd.maxAbs 1.69e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: opd.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 15 | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.64e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 15 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.43e-9 waves | PASS: opd.maxAbs 1.64e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: opd.maxAbs 5.80e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 15 | PASS: opd.maxAbs 5.63e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 5.63e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: opd.maxAbs 5.80e-10 waves | PASS: opd.maxAbs 5.32e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 15 | PASS: opd.maxAbs 5.13e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 4.61e-10 waves |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opd.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-wide-best-photopic | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 2.27e-9 waves | PASS: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-wide-f8-photopic | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 3.02e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 2.27e-9 waves | PASS: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-wide-f8-best-photopic | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 3.02e-9 waves |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-tele-best-photopic | 15 | PASS: opd.maxAbs 1.01e-9 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-photopic | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-tele-f8-best-photopic | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |
| nikon-z-mc-105f28-best-ref | 3 | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-best-photopic | 15 | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.03e-9 waves |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f8-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.02e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 6.05e-10 waves |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f8-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.02e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 6.05e-10 waves |
| nikon-z-135f18-plena-best-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 8.22e-10 waves | PASS: opticalPath.maxAbs 8.22e-10 waves |
| nikon-z-135f18-plena-best-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPathToImage.maxAbs 1.09e-9 waves |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.02e-9 waves | PASS: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-f8-photopic | 15 | PASS: opd.maxAbs 6.05e-10 waves | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.02e-9 waves | PASS: opd.maxAbs 1.02e-9 waves |
| nikon-z-135f18-plena-f8-best-photopic | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opd.maxAbs 1.62e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 15 | PASS: opd.maxAbs 2.21e-9 waves | PASS: opd.maxAbs 1.72e-9 waves | PASS: opticalPathToImage.maxAbs 2.18e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.43e-9 waves | PASS: opd.maxAbs 1.48e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 15 | PASS: opd.maxAbs 1.86e-10 waves | PASS: opticalPath.maxAbs 1.78e-9 waves | PASS: opd.maxAbs 1.81e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.43e-9 waves | PASS: opd.maxAbs 1.48e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 15 | PASS: opd.maxAbs 1.81e-10 waves | PASS: opticalPath.maxAbs 1.78e-9 waves | PASS: opd.maxAbs 1.81e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.07e-11 | sigma-45mm-f28-dg-dn-contemporary-ref | cut tangential, field 2.56e1, frequencyPerMm 86 |
| lv – optiland | rays.compared [rays] | 803472 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.23e-11 | nikon-z-24-70f4s-tele-ref | cut tangential, field 1.66e1, frequencyPerMm 100 |
| lv – ref | rays.compared [rays] | 803472 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.18e-11 | nikon-z-24-70f4s-tele-best-ref | cut tangential, field 1.66e1, frequencyPerMm 100 |
| optiland – ref | rays.compared [rays] | 803472 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: mtf.maxAbs 5.93e-13 | PASS: mtf.maxAbs 1.72e-12 | PASS: mtf.maxAbs 1.52e-12 |
| canon-ef-135-f2l-usm-photopic | 3 | PASS: mtf.maxAbs 1.40e-12 | PASS: mtf.maxAbs 1.29e-12 | PASS: mtf.maxAbs 8.69e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: mtf.maxAbs 2.22e-12 | PASS: mtf.maxAbs 7.44e-13 | PASS: mtf.maxAbs 1.62e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 3 | PASS: mtf.maxAbs 5.96e-13 | PASS: mtf.maxAbs 5.59e-13 | PASS: mtf.maxAbs 1.04e-12 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: mtf.maxAbs 2.55e-12 | PASS: mtf.maxAbs 5.51e-12 | PASS: mtf.maxAbs 8.06e-12 |
| sigma-35mm-f14-dg-hsm-a-photopic | 3 | PASS: mtf.maxAbs 3.04e-12 | PASS: mtf.maxAbs 2.37e-12 | PASS: mtf.maxAbs 2.44e-12 |
| nikkor-z50f12-ref | 3 | PASS: mtf.maxAbs 3.92e-12 | PASS: mtf.maxAbs 2.54e-12 | PASS: mtf.maxAbs 4.42e-12 |
| nikkor-z50f12-photopic | 3 | PASS: mtf.maxAbs 2.87e-12 | PASS: mtf.maxAbs 5.24e-12 | PASS: mtf.maxAbs 4.31e-12 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: mtf.maxAbs 1.78e-12 | PASS: mtf.maxAbs 4.39e-12 | PASS: mtf.maxAbs 3.47e-12 |
| sony-fe-20mm-f18-g-photopic | 3 | PASS: mtf.maxAbs 1.71e-12 | PASS: mtf.maxAbs 2.41e-12 | PASS: mtf.maxAbs 3.02e-12 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: mtf.maxAbs 7.18e-12 | PASS: mtf.maxAbs 3.14e-12 | PASS: mtf.maxAbs 6.26e-12 |
| sony-fe-400mm-f28-gm-oss-photopic | 3 | PASS: mtf.maxAbs 3.61e-12 | PASS: mtf.maxAbs 2.86e-12 | PASS: mtf.maxAbs 6.18e-12 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: mtf.maxAbs 1.48e-12 | PASS: mtf.maxAbs 1.76e-12 | PASS: mtf.maxAbs 3.07e-12 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 3 | PASS: mtf.maxAbs 1.85e-12 | PASS: mtf.maxAbs 1.70e-12 | PASS: mtf.maxAbs 3.19e-12 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: mtf.maxAbs 2.38e-12 | PASS: mtf.maxAbs 1.05e-11 | PASS: mtf.maxAbs 1.13e-11 |
| nikon-z-24-70f4s-wide-photopic | 3 | PASS: mtf.maxAbs 2.77e-12 | PASS: mtf.maxAbs 7.21e-12 | PASS: mtf.maxAbs 7.09e-12 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: mtf.maxAbs 1.23e-12 | PASS: mtf.maxAbs 1.23e-11 | PASS: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-tele-photopic | 3 | PASS: mtf.maxAbs 8.84e-13 | PASS: mtf.maxAbs 7.74e-12 | PASS: mtf.maxAbs 7.60e-12 |
| nikon-z-mc-105f28-ref | 3 | PASS: mtf.maxAbs 1.44e-12 | PASS: mtf.maxAbs 2.99e-12 | PASS: mtf.maxAbs 1.80e-12 |
| nikon-z-mc-105f28-photopic | 3 | PASS: mtf.maxAbs 5.27e-13 | PASS: mtf.maxAbs 1.71e-12 | PASS: mtf.maxAbs 1.24e-12 |
| nikon-z-135f18-plena-ref | 3 | PASS: mtf.maxAbs 1.76e-12 | PASS: mtf.maxAbs 1.96e-12 | PASS: mtf.maxAbs 2.73e-12 |
| nikon-z-135f18-plena-photopic | 3 | PASS: mtf.maxAbs 1.28e-12 | PASS: mtf.maxAbs 1.15e-12 | PASS: mtf.maxAbs 2.36e-12 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: mtf.maxAbs 1.07e-11 | PASS: mtf.maxAbs 5.18e-12 | PASS: mtf.maxAbs 1.03e-11 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3 | PASS: mtf.maxAbs 6.43e-12 | PASS: mtf.maxAbs 2.53e-12 | PASS: mtf.maxAbs 6.95e-12 |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: mtf.maxAbs 6.35e-13 | PASS: mtf.maxAbs 1.67e-12 | PASS: mtf.maxAbs 1.68e-12 |
| canon-ef-135-f2l-usm-best-photopic | 3 | PASS: mtf.maxAbs 7.05e-13 | PASS: mtf.maxAbs 1.42e-12 | PASS: mtf.maxAbs 1.25e-12 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: mtf.maxAbs 6.04e-13 | PASS: mtf.maxAbs 5.28e-13 | PASS: mtf.maxAbs 6.36e-13 |
| canon-ef-135-f2l-usm-f8-photopic | 3 | PASS: mtf.maxAbs 3.06e-13 | PASS: mtf.maxAbs 3.97e-13 | PASS: mtf.maxAbs 5.93e-13 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: mtf.maxAbs 5.85e-13 | PASS: mtf.maxAbs 5.21e-13 | PASS: mtf.maxAbs 6.29e-13 |
| canon-ef-135-f2l-usm-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.65e-13 | PASS: mtf.maxAbs 4.27e-13 | PASS: mtf.maxAbs 5.86e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: mtf.maxAbs 7.94e-13 | PASS: mtf.maxAbs 6.78e-13 | PASS: mtf.maxAbs 1.09e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 3 | PASS: mtf.maxAbs 4.49e-13 | PASS: mtf.maxAbs 5.14e-13 | PASS: mtf.maxAbs 6.61e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: mtf.maxAbs 4.36e-13 | PASS: mtf.maxAbs 3.76e-13 | PASS: mtf.maxAbs 6.08e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 3 | PASS: mtf.maxAbs 3.40e-13 | PASS: mtf.maxAbs 2.87e-13 | PASS: mtf.maxAbs 5.21e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: mtf.maxAbs 6.28e-13 | PASS: mtf.maxAbs 3.77e-13 | PASS: mtf.maxAbs 7.35e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 3 | PASS: mtf.maxAbs 3.31e-13 | PASS: mtf.maxAbs 2.88e-13 | PASS: mtf.maxAbs 6.15e-13 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: mtf.maxAbs 3.21e-12 | PASS: mtf.maxAbs 5.55e-12 | PASS: mtf.maxAbs 8.76e-12 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 3 | PASS: mtf.maxAbs 2.80e-12 | PASS: mtf.maxAbs 2.54e-12 | PASS: mtf.maxAbs 2.87e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: mtf.maxAbs 1.87e-12 | PASS: mtf.maxAbs 3.90e-12 | PASS: mtf.maxAbs 5.77e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3 | PASS: mtf.maxAbs 3.69e-13 | PASS: mtf.maxAbs 1.16e-12 | PASS: mtf.maxAbs 9.69e-13 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: mtf.maxAbs 1.80e-12 | PASS: mtf.maxAbs 3.80e-12 | PASS: mtf.maxAbs 5.60e-12 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 3 | PASS: mtf.maxAbs 4.22e-13 | PASS: mtf.maxAbs 1.85e-12 | PASS: mtf.maxAbs 1.62e-12 |
| nikkor-z50f12-best-ref | 3 | PASS: mtf.maxAbs 6.22e-12 | PASS: mtf.maxAbs 5.64e-12 | PASS: mtf.maxAbs 6.97e-12 |
| nikkor-z50f12-best-photopic | 3 | PASS: mtf.maxAbs 2.40e-12 | PASS: mtf.maxAbs 3.56e-12 | PASS: mtf.maxAbs 3.95e-12 |
| nikkor-z50f12-f8-ref | 3 | PASS: mtf.maxAbs 1.62e-12 | PASS: mtf.maxAbs 7.07e-13 | PASS: mtf.maxAbs 1.56e-12 |
| nikkor-z50f12-f8-photopic | 3 | PASS: mtf.maxAbs 1.19e-12 | PASS: mtf.maxAbs 7.50e-13 | PASS: mtf.maxAbs 6.92e-13 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: mtf.maxAbs 1.57e-12 | PASS: mtf.maxAbs 6.94e-13 | PASS: mtf.maxAbs 1.47e-12 |
| nikkor-z50f12-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.43e-12 | PASS: mtf.maxAbs 6.48e-13 | PASS: mtf.maxAbs 7.97e-13 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: mtf.maxAbs 2.12e-12 | PASS: mtf.maxAbs 4.56e-12 | PASS: mtf.maxAbs 3.66e-12 |
| sony-fe-20mm-f18-g-best-photopic | 3 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 3.71e-12 | PASS: mtf.maxAbs 3.54e-12 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: mtf.maxAbs 7.20e-13 | PASS: mtf.maxAbs 2.97e-12 | PASS: mtf.maxAbs 2.55e-12 |
| sony-fe-20mm-f18-g-f8-photopic | 3 | PASS: mtf.maxAbs 8.40e-13 | PASS: mtf.maxAbs 2.40e-12 | PASS: mtf.maxAbs 2.42e-12 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: mtf.maxAbs 6.66e-13 | PASS: mtf.maxAbs 2.96e-12 | PASS: mtf.maxAbs 2.57e-12 |
| sony-fe-20mm-f18-g-f8-best-photopic | 3 | PASS: mtf.maxAbs 8.68e-13 | PASS: mtf.maxAbs 2.60e-12 | PASS: mtf.maxAbs 2.61e-12 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: mtf.maxAbs 2.58e-12 | PASS: mtf.maxAbs 2.13e-12 | PASS: mtf.maxAbs 4.71e-12 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 3 | PASS: mtf.maxAbs 1.22e-12 | PASS: mtf.maxAbs 1.74e-12 | PASS: mtf.maxAbs 1.63e-12 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: mtf.maxAbs 2.14e-12 | PASS: mtf.maxAbs 2.62e-12 | PASS: mtf.maxAbs 4.76e-12 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 3 | PASS: mtf.maxAbs 3.16e-12 | PASS: mtf.maxAbs 2.76e-12 | PASS: mtf.maxAbs 4.67e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: mtf.maxAbs 7.73e-13 | PASS: mtf.maxAbs 1.10e-12 | PASS: mtf.maxAbs 1.87e-12 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 3 | PASS: mtf.maxAbs 8.33e-13 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 1.18e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: mtf.maxAbs 1.53e-12 | PASS: mtf.maxAbs 2.44e-12 | PASS: mtf.maxAbs 3.97e-12 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 2.14e-12 | PASS: mtf.maxAbs 3.51e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: mtf.maxAbs 2.57e-12 | PASS: mtf.maxAbs 1.58e-12 | PASS: mtf.maxAbs 3.35e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 3 | PASS: mtf.maxAbs 1.30e-12 | PASS: mtf.maxAbs 1.51e-12 | PASS: mtf.maxAbs 2.52e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: mtf.maxAbs 2.53e-12 | PASS: mtf.maxAbs 1.51e-12 | PASS: mtf.maxAbs 3.42e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 1.50e-12 | PASS: mtf.maxAbs 2.63e-12 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: mtf.maxAbs 2.20e-12 | PASS: mtf.maxAbs 1.13e-11 | PASS: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-wide-best-photopic | 3 | PASS: mtf.maxAbs 2.75e-12 | PASS: mtf.maxAbs 9.46e-12 | PASS: mtf.maxAbs 9.47e-12 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: mtf.maxAbs 5.96e-13 | PASS: mtf.maxAbs 6.54e-12 | PASS: mtf.maxAbs 6.46e-12 |
| nikon-z-24-70f4s-wide-f8-photopic | 3 | PASS: mtf.maxAbs 7.25e-13 | PASS: mtf.maxAbs 3.92e-12 | PASS: mtf.maxAbs 3.91e-12 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: mtf.maxAbs 5.47e-13 | PASS: mtf.maxAbs 1.18e-11 | PASS: mtf.maxAbs 1.15e-11 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 3 | PASS: mtf.maxAbs 6.24e-13 | PASS: mtf.maxAbs 4.54e-12 | PASS: mtf.maxAbs 4.30e-12 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: mtf.maxAbs 9.15e-13 | PASS: mtf.maxAbs 1.19e-11 | PASS: mtf.maxAbs 1.18e-11 |
| nikon-z-24-70f4s-tele-best-photopic | 3 | PASS: mtf.maxAbs 8.29e-13 | PASS: mtf.maxAbs 7.92e-12 | PASS: mtf.maxAbs 7.80e-12 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: mtf.maxAbs 3.13e-13 | PASS: mtf.maxAbs 6.62e-12 | PASS: mtf.maxAbs 6.57e-12 |
| nikon-z-24-70f4s-tele-f8-photopic | 3 | PASS: mtf.maxAbs 3.95e-13 | PASS: mtf.maxAbs 8.65e-12 | PASS: mtf.maxAbs 8.39e-12 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: mtf.maxAbs 7.95e-13 | PASS: mtf.maxAbs 9.12e-12 | PASS: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 3 | PASS: mtf.maxAbs 5.08e-13 | PASS: mtf.maxAbs 3.46e-12 | PASS: mtf.maxAbs 2.95e-12 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: mtf.maxAbs 1.37e-12 | PASS: mtf.maxAbs 1.02e-12 | PASS: mtf.maxAbs 1.16e-12 |
| nikon-z-mc-105f28-best-photopic | 3 | PASS: mtf.maxAbs 3.74e-13 | PASS: mtf.maxAbs 8.69e-13 | PASS: mtf.maxAbs 7.17e-13 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: mtf.maxAbs 1.05e-12 | PASS: mtf.maxAbs 6.47e-13 | PASS: mtf.maxAbs 5.71e-13 |
| nikon-z-mc-105f28-f8-photopic | 3 | PASS: mtf.maxAbs 3.38e-13 | PASS: mtf.maxAbs 5.03e-13 | PASS: mtf.maxAbs 5.66e-13 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: mtf.maxAbs 9.20e-13 | PASS: mtf.maxAbs 5.83e-13 | PASS: mtf.maxAbs 5.03e-13 |
| nikon-z-mc-105f28-f8-best-photopic | 3 | PASS: mtf.maxAbs 2.88e-13 | PASS: mtf.maxAbs 4.43e-13 | PASS: mtf.maxAbs 5.18e-13 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: mtf.maxAbs 1.42e-12 | PASS: mtf.maxAbs 1.61e-12 | PASS: mtf.maxAbs 3.03e-12 |
| nikon-z-135f18-plena-best-photopic | 3 | PASS: mtf.maxAbs 1.68e-12 | PASS: mtf.maxAbs 9.13e-13 | PASS: mtf.maxAbs 2.39e-12 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: mtf.maxAbs 4.28e-13 | PASS: mtf.maxAbs 6.13e-13 | PASS: mtf.maxAbs 8.76e-13 |
| nikon-z-135f18-plena-f8-photopic | 3 | PASS: mtf.maxAbs 1.40e-12 | PASS: mtf.maxAbs 5.57e-13 | PASS: mtf.maxAbs 1.47e-12 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: mtf.maxAbs 4.84e-13 | PASS: mtf.maxAbs 6.20e-13 | PASS: mtf.maxAbs 9.40e-13 |
| nikon-z-135f18-plena-f8-best-photopic | 3 | PASS: mtf.maxAbs 1.41e-12 | PASS: mtf.maxAbs 5.61e-13 | PASS: mtf.maxAbs 1.46e-12 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: mtf.maxAbs 1.00e-11 | PASS: mtf.maxAbs 4.56e-12 | PASS: mtf.maxAbs 1.01e-11 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 3 | PASS: mtf.maxAbs 7.18e-12 | PASS: mtf.maxAbs 2.21e-12 | PASS: mtf.maxAbs 7.77e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: mtf.maxAbs 7.03e-13 | PASS: mtf.maxAbs 4.51e-12 | PASS: mtf.maxAbs 4.67e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 3 | PASS: mtf.maxAbs 6.61e-13 | PASS: mtf.maxAbs 4.24e-12 | PASS: mtf.maxAbs 3.71e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: mtf.maxAbs 5.35e-13 | PASS: mtf.maxAbs 4.27e-12 | PASS: mtf.maxAbs 4.37e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 3 | PASS: mtf.maxAbs 6.23e-13 | PASS: mtf.maxAbs 4.05e-12 | PASS: mtf.maxAbs 3.61e-12 |

## r7a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | transverseError.maxAbs (≤ 1.00e-8 mm) | 4.55e-13 | sigma-45mm-f28-dg-dn-contemporary-photopic | field 1.92e1, line 4, ray 263 |
| lv – optiland | centroid.maxAbs (≤ 1.00e-8 mm) | 1.02e-13 | sony-fe-400mm-f28-gm-oss-f8-best-photopic | field 2.36e0, line 1 |
| lv – optiland | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 5.39e-14 | sigma-45mm-f28-dg-dn-contemporary-best-ref | field 1.92e1, line 0 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 531418 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 6.68e-13 | sony-fe-20mm-f18-g-best-ref | field 2.82e1, line 0, ray 5 |
| lv – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.46e-13 | sony-fe-20mm-f18-g-best-photopic | field 3.53e1, line 4 |
| lv – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 9.31e-14 | sony-fe-20mm-f18-g-photopic | field 2.82e1, line 3 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 531418 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 7.55e-13 | sony-fe-20mm-f18-g-photopic | field 2.82e1, line 3, ray 5 |
| optiland – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.48e-13 | sony-fe-20mm-f18-g-best-photopic | field 3.53e1, line 4 |
| optiland – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 1.06e-13 | sony-fe-20mm-f18-g-ref | field 2.82e1, line 0 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 531418 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 10 | PASS: transverseError.maxAbs 1.58e-13 mm | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 1.39e-13 mm | 1580 / 364 / 0 | 1580 / 364 / 0 | 1580 / 364 / 0 |
| canon-ef-135-f2l-usm-photopic | 50 | PASS: transverseError.maxAbs 1.67e-13 mm | PASS: transverseError.maxAbs 1.03e-13 mm | PASS: transverseError.maxAbs 1.68e-13 mm | 7910 / 1810 / 0 | 7910 / 1810 / 0 | 7910 / 1810 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 10 | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 4.97e-14 mm | PASS: transverseError.maxAbs 6.66e-14 mm | 1854 / 90 / 0 | 1854 / 90 / 0 | 1854 / 90 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 50 | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 7.28e-14 mm | PASS: transverseError.maxAbs 9.24e-14 mm | 9271 / 449 / 0 | 9271 / 449 / 0 | 9271 / 449 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 10 | PASS: transverseError.maxAbs 1.71e-13 mm | PASS: transverseError.maxAbs 2.03e-13 mm | PASS: transverseError.maxAbs 2.45e-13 mm | 1703 / 241 / 0 | 1703 / 241 / 0 | 1703 / 241 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 50 | PASS: transverseError.maxAbs 1.60e-13 mm | PASS: transverseError.maxAbs 2.36e-13 mm | PASS: transverseError.maxAbs 2.43e-13 mm | 8525 / 1195 / 0 | 8525 / 1195 / 0 | 8525 / 1195 / 0 |
| nikkor-z50f12-ref | 10 | PASS: transverseError.maxAbs 2.96e-13 mm | PASS: transverseError.maxAbs 3.33e-13 mm | PASS: transverseError.maxAbs 2.60e-13 mm | 1667 / 277 / 0 | 1667 / 277 / 0 | 1667 / 277 / 0 |
| nikkor-z50f12-photopic | 50 | PASS: transverseError.maxAbs 3.63e-13 mm | PASS: transverseError.maxAbs 3.30e-13 mm | PASS: transverseError.maxAbs 3.05e-13 mm | 8335 / 1385 / 0 | 8335 / 1385 / 0 | 8335 / 1385 / 0 |
| sony-fe-20mm-f18-g-ref | 10 | PASS: transverseError.maxAbs 1.30e-13 mm | PASS: transverseError.maxAbs 6.66e-13 mm | PASS: transverseError.maxAbs 6.31e-13 mm | 1929 / 15 / 0 | 1929 / 15 / 0 | 1929 / 15 / 0 |
| sony-fe-20mm-f18-g-photopic | 50 | PASS: transverseError.maxAbs 1.83e-13 mm | PASS: transverseError.maxAbs 6.63e-13 mm | PASS: transverseError.maxAbs 7.55e-13 mm | 9644 / 76 / 0 | 9644 / 76 / 0 | 9644 / 76 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 10 | PASS: transverseError.maxAbs 2.95e-13 mm | PASS: transverseError.maxAbs 2.72e-13 mm | PASS: transverseError.maxAbs 2.84e-13 mm | 1708 / 236 / 0 | 1708 / 236 / 0 | 1708 / 236 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 50 | PASS: transverseError.maxAbs 3.43e-13 mm | PASS: transverseError.maxAbs 2.80e-13 mm | PASS: transverseError.maxAbs 3.44e-13 mm | 8536 / 1184 / 0 | 8536 / 1184 / 0 | 8536 / 1184 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 10 | PASS: transverseError.maxAbs 1.56e-13 mm | PASS: transverseError.maxAbs 1.00e-13 mm | PASS: transverseError.maxAbs 1.65e-13 mm | 1771 / 173 / 0 | 1771 / 173 / 0 | 1771 / 173 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 50 | PASS: transverseError.maxAbs 1.46e-13 mm | PASS: transverseError.maxAbs 1.28e-13 mm | PASS: transverseError.maxAbs 1.81e-13 mm | 8857 / 863 / 0 | 8857 / 863 / 0 | 8857 / 863 / 0 |
| nikon-z-24-70f4s-wide-ref | 10 | PASS: transverseError.maxAbs 7.37e-14 mm | PASS: transverseError.maxAbs 3.07e-13 mm | PASS: transverseError.maxAbs 2.91e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-wide-photopic | 50 | PASS: transverseError.maxAbs 3.07e-13 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.29e-13 mm | 9627 / 93 / 0 | 9627 / 93 / 0 | 9627 / 93 / 0 |
| nikon-z-24-70f4s-tele-ref | 10 | PASS: transverseError.maxAbs 1.23e-13 mm | PASS: transverseError.maxAbs 3.87e-13 mm | PASS: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-tele-photopic | 50 | PASS: transverseError.maxAbs 1.67e-13 mm | PASS: transverseError.maxAbs 3.98e-13 mm | PASS: transverseError.maxAbs 4.07e-13 mm | 9176 / 544 / 0 | 9176 / 544 / 0 | 9176 / 544 / 0 |
| nikon-z-mc-105f28-ref | 10 | PASS: transverseError.maxAbs 1.21e-13 mm | PASS: transverseError.maxAbs 1.41e-13 mm | PASS: transverseError.maxAbs 1.34e-13 mm | 1614 / 330 / 0 | 1614 / 330 / 0 | 1614 / 330 / 0 |
| nikon-z-mc-105f28-photopic | 50 | PASS: transverseError.maxAbs 1.95e-13 mm | PASS: transverseError.maxAbs 1.93e-13 mm | PASS: transverseError.maxAbs 1.73e-13 mm | 8066 / 1654 / 0 | 8066 / 1654 / 0 | 8066 / 1654 / 0 |
| nikon-z-135f18-plena-ref | 10 | PASS: transverseError.maxAbs 1.51e-13 mm | PASS: transverseError.maxAbs 9.77e-14 mm | PASS: transverseError.maxAbs 1.50e-13 mm | 1935 / 9 / 0 | 1935 / 9 / 0 | 1935 / 9 / 0 |
| nikon-z-135f18-plena-photopic | 50 | PASS: transverseError.maxAbs 2.03e-13 mm | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 1.56e-13 mm | 9669 / 51 / 0 | 9669 / 51 / 0 | 9669 / 51 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 10 | PASS: transverseError.maxAbs 4.03e-13 mm | PASS: transverseError.maxAbs 5.72e-13 mm | PASS: transverseError.maxAbs 4.12e-13 mm | 1696 / 248 / 0 | 1696 / 248 / 0 | 1696 / 248 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 50 | PASS: transverseError.maxAbs 4.55e-13 mm | PASS: transverseError.maxAbs 6.11e-13 mm | PASS: transverseError.maxAbs 3.85e-13 mm | 8482 / 1238 / 0 | 8482 / 1238 / 0 | 8482 / 1238 / 0 |
| canon-ef-135-f2l-usm-best-ref | 10 | PASS: transverseError.maxAbs 1.58e-13 mm | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 1.37e-13 mm | 1580 / 364 / 0 | 1580 / 364 / 0 | 1580 / 364 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 50 | PASS: transverseError.maxAbs 1.65e-13 mm | PASS: transverseError.maxAbs 1.01e-13 mm | PASS: transverseError.maxAbs 1.71e-13 mm | 7910 / 1810 / 0 | 7910 / 1810 / 0 | 7910 / 1810 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 10 | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 7.46e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 50 | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 1.03e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 10 | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 7.46e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 50 | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 1.03e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 10 | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 4.97e-14 mm | PASS: transverseError.maxAbs 6.75e-14 mm | 1854 / 90 / 0 | 1854 / 90 / 0 | 1854 / 90 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 50 | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 6.93e-14 mm | PASS: transverseError.maxAbs 9.24e-14 mm | 9271 / 449 / 0 | 9271 / 449 / 0 | 9271 / 449 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 10 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 4.62e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 50 | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 6.39e-14 mm | PASS: transverseError.maxAbs 9.24e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 10 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 4.62e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 50 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 9.24e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 10 | PASS: transverseError.maxAbs 1.71e-13 mm | PASS: transverseError.maxAbs 2.08e-13 mm | PASS: transverseError.maxAbs 2.49e-13 mm | 1703 / 241 / 0 | 1703 / 241 / 0 | 1703 / 241 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 50 | PASS: transverseError.maxAbs 1.60e-13 mm | PASS: transverseError.maxAbs 2.33e-13 mm | PASS: transverseError.maxAbs 2.42e-13 mm | 8525 / 1195 / 0 | 8525 / 1195 / 0 | 8525 / 1195 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 10 | PASS: transverseError.maxAbs 1.08e-13 mm | PASS: transverseError.maxAbs 2.26e-13 mm | PASS: transverseError.maxAbs 2.65e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 50 | PASS: transverseError.maxAbs 1.05e-13 mm | PASS: transverseError.maxAbs 2.45e-13 mm | PASS: transverseError.maxAbs 2.47e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 10 | PASS: transverseError.maxAbs 1.07e-13 mm | PASS: transverseError.maxAbs 2.29e-13 mm | PASS: transverseError.maxAbs 2.66e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 50 | PASS: transverseError.maxAbs 1.03e-13 mm | PASS: transverseError.maxAbs 2.42e-13 mm | PASS: transverseError.maxAbs 2.50e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| nikkor-z50f12-best-ref | 10 | PASS: transverseError.maxAbs 2.96e-13 mm | PASS: transverseError.maxAbs 3.33e-13 mm | PASS: transverseError.maxAbs 2.59e-13 mm | 1667 / 277 / 0 | 1667 / 277 / 0 | 1667 / 277 / 0 |
| nikkor-z50f12-best-photopic | 50 | PASS: transverseError.maxAbs 3.62e-13 mm | PASS: transverseError.maxAbs 3.30e-13 mm | PASS: transverseError.maxAbs 3.05e-13 mm | 8335 / 1385 / 0 | 8335 / 1385 / 0 | 8335 / 1385 / 0 |
| nikkor-z50f12-f8-ref | 10 | PASS: transverseError.maxAbs 1.19e-13 mm | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 50 | PASS: transverseError.maxAbs 1.46e-13 mm | PASS: transverseError.maxAbs 1.05e-13 mm | PASS: transverseError.maxAbs 1.30e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikkor-z50f12-f8-best-ref | 10 | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 8.35e-14 mm | PASS: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 50 | PASS: transverseError.maxAbs 1.47e-13 mm | PASS: transverseError.maxAbs 1.03e-13 mm | PASS: transverseError.maxAbs 1.28e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sony-fe-20mm-f18-g-best-ref | 10 | PASS: transverseError.maxAbs 1.30e-13 mm | PASS: transverseError.maxAbs 6.68e-13 mm | PASS: transverseError.maxAbs 6.32e-13 mm | 1929 / 15 / 0 | 1929 / 15 / 0 | 1929 / 15 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 50 | PASS: transverseError.maxAbs 1.83e-13 mm | PASS: transverseError.maxAbs 6.61e-13 mm | PASS: transverseError.maxAbs 7.53e-13 mm | 9644 / 76 / 0 | 9644 / 76 / 0 | 9644 / 76 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 10 | PASS: transverseError.maxAbs 6.93e-14 mm | PASS: transverseError.maxAbs 2.52e-13 mm | PASS: transverseError.maxAbs 2.68e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 50 | PASS: transverseError.maxAbs 2.59e-13 mm | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 3.22e-13 mm | 9708 / 12 / 0 | 9708 / 12 / 0 | 9708 / 12 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 10 | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 2.52e-13 mm | PASS: transverseError.maxAbs 2.70e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 50 | PASS: transverseError.maxAbs 2.58e-13 mm | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 3.22e-13 mm | 9708 / 12 / 0 | 9708 / 12 / 0 | 9708 / 12 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 10 | PASS: transverseError.maxAbs 2.91e-13 mm | PASS: transverseError.maxAbs 2.74e-13 mm | PASS: transverseError.maxAbs 2.81e-13 mm | 1708 / 236 / 0 | 1708 / 236 / 0 | 1708 / 236 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 50 | PASS: transverseError.maxAbs 3.43e-13 mm | PASS: transverseError.maxAbs 2.80e-13 mm | PASS: transverseError.maxAbs 3.44e-13 mm | 8536 / 1184 / 0 | 8536 / 1184 / 0 | 8536 / 1184 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 10 | PASS: transverseError.maxAbs 2.45e-13 mm | PASS: transverseError.maxAbs 1.67e-13 mm | PASS: transverseError.maxAbs 2.10e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 50 | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 2.06e-13 mm | PASS: transverseError.maxAbs 2.77e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 10 | PASS: transverseError.maxAbs 2.49e-13 mm | PASS: transverseError.maxAbs 1.71e-13 mm | PASS: transverseError.maxAbs 2.13e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 50 | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 2.03e-13 mm | PASS: transverseError.maxAbs 2.77e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 10 | PASS: transverseError.maxAbs 1.56e-13 mm | PASS: transverseError.maxAbs 1.00e-13 mm | PASS: transverseError.maxAbs 1.65e-13 mm | 1771 / 173 / 0 | 1771 / 173 / 0 | 1771 / 173 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 50 | PASS: transverseError.maxAbs 1.42e-13 mm | PASS: transverseError.maxAbs 1.28e-13 mm | PASS: transverseError.maxAbs 1.82e-13 mm | 8857 / 863 / 0 | 8857 / 863 / 0 | 8857 / 863 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 10 | PASS: transverseError.maxAbs 1.87e-13 mm | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 1.62e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 50 | PASS: transverseError.maxAbs 1.60e-13 mm | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 2.06e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 10 | PASS: transverseError.maxAbs 1.88e-13 mm | PASS: transverseError.maxAbs 8.17e-14 mm | PASS: transverseError.maxAbs 1.63e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 50 | PASS: transverseError.maxAbs 1.63e-13 mm | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 1.99e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 10 | PASS: transverseError.maxAbs 7.28e-14 mm | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 2.90e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 50 | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.29e-13 mm | 9627 / 93 / 0 | 9627 / 93 / 0 | 9627 / 93 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 10 | PASS: transverseError.maxAbs 5.86e-14 mm | PASS: transverseError.maxAbs 2.82e-13 mm | PASS: transverseError.maxAbs 2.75e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 50 | PASS: transverseError.maxAbs 3.55e-13 mm | PASS: transverseError.maxAbs 3.77e-13 mm | PASS: transverseError.maxAbs 3.46e-13 mm | 9687 / 33 / 0 | 9687 / 33 / 0 | 9687 / 33 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 10 | PASS: transverseError.maxAbs 5.86e-14 mm | PASS: transverseError.maxAbs 2.82e-13 mm | PASS: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 50 | PASS: transverseError.maxAbs 3.55e-13 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.46e-13 mm | 9687 / 33 / 0 | 9687 / 33 / 0 | 9687 / 33 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 10 | PASS: transverseError.maxAbs 1.23e-13 mm | PASS: transverseError.maxAbs 3.87e-13 mm | PASS: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 50 | PASS: transverseError.maxAbs 1.69e-13 mm | PASS: transverseError.maxAbs 3.98e-13 mm | PASS: transverseError.maxAbs 4.07e-13 mm | 9176 / 544 / 0 | 9176 / 544 / 0 | 9176 / 544 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 3.69e-13 mm | PASS: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 50 | PASS: transverseError.maxAbs 2.13e-13 mm | PASS: transverseError.maxAbs 4.07e-13 mm | PASS: transverseError.maxAbs 4.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 3.69e-13 mm | PASS: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 50 | PASS: transverseError.maxAbs 2.15e-13 mm | PASS: transverseError.maxAbs 4.09e-13 mm | PASS: transverseError.maxAbs 4.30e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-best-ref | 10 | PASS: transverseError.maxAbs 1.21e-13 mm | PASS: transverseError.maxAbs 1.40e-13 mm | PASS: transverseError.maxAbs 1.34e-13 mm | 1614 / 330 / 0 | 1614 / 330 / 0 | 1614 / 330 / 0 |
| nikon-z-mc-105f28-best-photopic | 50 | PASS: transverseError.maxAbs 1.95e-13 mm | PASS: transverseError.maxAbs 1.94e-13 mm | PASS: transverseError.maxAbs 1.73e-13 mm | 8066 / 1654 / 0 | 8066 / 1654 / 0 | 8066 / 1654 / 0 |
| nikon-z-mc-105f28-f8-ref | 10 | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 1.03e-13 mm | PASS: transverseError.maxAbs 1.31e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 50 | PASS: transverseError.maxAbs 1.31e-13 mm | PASS: transverseError.maxAbs 9.95e-14 mm | PASS: transverseError.maxAbs 1.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 10 | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 1.07e-13 mm | PASS: transverseError.maxAbs 1.39e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 50 | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 9.95e-14 mm | PASS: transverseError.maxAbs 1.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-135f18-plena-best-ref | 10 | PASS: transverseError.maxAbs 1.49e-13 mm | PASS: transverseError.maxAbs 9.95e-14 mm | PASS: transverseError.maxAbs 1.50e-13 mm | 1935 / 9 / 0 | 1935 / 9 / 0 | 1935 / 9 / 0 |
| nikon-z-135f18-plena-best-photopic | 50 | PASS: transverseError.maxAbs 2.03e-13 mm | PASS: transverseError.maxAbs 1.26e-13 mm | PASS: transverseError.maxAbs 1.60e-13 mm | 9669 / 51 / 0 | 9669 / 51 / 0 | 9669 / 51 / 0 |
| nikon-z-135f18-plena-f8-ref | 10 | PASS: transverseError.maxAbs 8.35e-14 mm | PASS: transverseError.maxAbs 5.68e-14 mm | PASS: transverseError.maxAbs 7.11e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 50 | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 1.17e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 10 | PASS: transverseError.maxAbs 8.35e-14 mm | PASS: transverseError.maxAbs 5.68e-14 mm | PASS: transverseError.maxAbs 6.75e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 50 | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 1.10e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 10 | PASS: transverseError.maxAbs 4.05e-13 mm | PASS: transverseError.maxAbs 5.74e-13 mm | PASS: transverseError.maxAbs 4.12e-13 mm | 1696 / 248 / 0 | 1696 / 248 / 0 | 1696 / 248 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 50 | PASS: transverseError.maxAbs 4.55e-13 mm | PASS: transverseError.maxAbs 6.11e-13 mm | PASS: transverseError.maxAbs 3.87e-13 mm | 8482 / 1238 / 0 | 8482 / 1238 / 0 | 8482 / 1238 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 10 | PASS: transverseError.maxAbs 4.80e-14 mm | PASS: transverseError.maxAbs 2.34e-13 mm | PASS: transverseError.maxAbs 2.26e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 50 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 2.45e-13 mm | PASS: transverseError.maxAbs 2.59e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 10 | PASS: transverseError.maxAbs 4.62e-14 mm | PASS: transverseError.maxAbs 2.33e-13 mm | PASS: transverseError.maxAbs 2.24e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 50 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 2.47e-13 mm | PASS: transverseError.maxAbs 2.61e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |

## r8a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | intercept.maxScaled (≤ 1.00e-8 mm) | 2.66e-13 | nikon-z-24-70f4s-tele-f8-photopic | field 0, line 3, ray 36 |
| lv – optiland | intercept.maxAbs [mm] | 4.69e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0, line 3, ray 36 |
| lv – optiland | focus.maxScaled (≤ 1.00e-8 mm) | 8.77e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0, line 3 |
| lv – optiland | focus.maxAbs [mm] | 6.25e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0, line 3 |
| lv – optiland | focusRms.maxAbs (≤ 1.00e-8 mm) | 6.39e-14 | sony-fe-400mm-f28-gm-oss-photopic | field 0, line 3 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 16608 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 2.96e-13 | nikkor-z50f12-photopic | field 0, line 1, ray 34 |
| lv – ref | intercept.maxAbs [mm] | 4.60e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0, line 3, ray 36 |
| lv – ref | focus.maxScaled (≤ 1.00e-8 mm) | 7.47e-14 | nikon-z-24-70f4s-tele-f8-ref | field 0, line 0 |
| lv – ref | focus.maxAbs [mm] | 1.42e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0, line 4 |
| lv – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 4.43e-14 | sony-fe-400mm-f28-gm-oss-ref | field 0, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 16608 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 3.49e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0, line 3, ray 42 |
| optiland – ref | intercept.maxAbs [mm] | 4.75e-12 | nikon-z-24-70f4s-tele-photopic | field 0, line 3, ray 16 |
| optiland – ref | focus.maxScaled (≤ 1.00e-8 mm) | 1.20e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0, line 3 |
| optiland – ref | focus.maxAbs [mm] | 1.34e-12 | nikon-z-24-70f4s-tele-f8-photopic | field 0, line 0 |
| optiland – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 1.02e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 0, line 3 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 16608 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | PASS: intercept.maxScaled 5.69e-14 mm | PASS: intercept.maxScaled 6.28e-14 mm | PASS: intercept.maxScaled 8.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 10 | PASS: intercept.maxScaled 1.74e-13 mm | PASS: intercept.maxScaled 7.05e-14 mm | PASS: intercept.maxScaled 1.07e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | PASS: intercept.maxScaled 2.49e-14 mm | PASS: intercept.maxScaled 2.11e-14 mm | PASS: intercept.maxScaled 3.40e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 10 | PASS: intercept.maxScaled 4.35e-14 mm | PASS: intercept.maxScaled 2.63e-14 mm | PASS: intercept.maxScaled 5.26e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | PASS: intercept.maxScaled 7.30e-14 mm | PASS: intercept.maxScaled 4.78e-14 mm | PASS: intercept.maxScaled 3.99e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 10 | PASS: intercept.maxScaled 1.53e-13 mm | PASS: intercept.maxScaled 5.74e-14 mm | PASS: intercept.maxScaled 1.32e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-ref | 3 | PASS: intercept.maxScaled 1.69e-13 mm | PASS: intercept.maxScaled 1.16e-13 mm | PASS: intercept.maxScaled 1.41e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-photopic | 10 | PASS: intercept.maxScaled 2.14e-13 mm | PASS: intercept.maxScaled 2.96e-13 mm | PASS: intercept.maxScaled 2.18e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | PASS: intercept.maxScaled 7.65e-14 mm | PASS: intercept.maxScaled 3.14e-14 mm | PASS: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 10 | PASS: intercept.maxScaled 6.98e-14 mm | PASS: intercept.maxScaled 4.01e-14 mm | PASS: intercept.maxScaled 6.42e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | PASS: intercept.maxScaled 1.68e-13 mm | PASS: intercept.maxScaled 1.51e-13 mm | PASS: intercept.maxScaled 1.94e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 10 | PASS: intercept.maxScaled 2.26e-13 mm | PASS: intercept.maxScaled 1.99e-13 mm | PASS: intercept.maxScaled 3.49e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | PASS: intercept.maxScaled 4.28e-14 mm | PASS: intercept.maxScaled 4.28e-14 mm | PASS: intercept.maxScaled 7.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 10 | PASS: intercept.maxScaled 9.41e-14 mm | PASS: intercept.maxScaled 5.87e-14 mm | PASS: intercept.maxScaled 9.48e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | PASS: intercept.maxScaled 2.89e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | PASS: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 10 | PASS: intercept.maxScaled 4.55e-14 mm | PASS: intercept.maxScaled 4.41e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | PASS: intercept.maxScaled 1.11e-13 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 10 | PASS: intercept.maxScaled 9.68e-14 mm | PASS: intercept.maxScaled 2.36e-13 mm | PASS: intercept.maxScaled 2.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-ref | 3 | PASS: intercept.maxScaled 5.61e-14 mm | PASS: intercept.maxScaled 6.39e-14 mm | PASS: intercept.maxScaled 8.36e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 10 | PASS: intercept.maxScaled 9.52e-14 mm | PASS: intercept.maxScaled 6.39e-14 mm | PASS: intercept.maxScaled 7.79e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-ref | 3 | PASS: intercept.maxScaled 6.94e-14 mm | PASS: intercept.maxScaled 5.97e-14 mm | PASS: intercept.maxScaled 8.32e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 10 | PASS: intercept.maxScaled 7.45e-14 mm | PASS: intercept.maxScaled 6.48e-14 mm | PASS: intercept.maxScaled 1.30e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | PASS: intercept.maxScaled 3.71e-14 mm | PASS: intercept.maxScaled 1.66e-13 mm | PASS: intercept.maxScaled 1.62e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 10 | PASS: intercept.maxScaled 2.87e-14 mm | PASS: intercept.maxScaled 1.63e-13 mm | PASS: intercept.maxScaled 1.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-best-ref | 3 | PASS: intercept.maxScaled 5.69e-14 mm | PASS: intercept.maxScaled 6.28e-14 mm | PASS: intercept.maxScaled 8.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 10 | PASS: intercept.maxScaled 1.74e-13 mm | PASS: intercept.maxScaled 7.05e-14 mm | PASS: intercept.maxScaled 1.07e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 3 | PASS: intercept.maxScaled 2.19e-14 mm | PASS: intercept.maxScaled 1.49e-14 mm | PASS: intercept.maxScaled 1.88e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 10 | PASS: intercept.maxScaled 3.13e-14 mm | PASS: intercept.maxScaled 1.96e-14 mm | PASS: intercept.maxScaled 2.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 3 | PASS: intercept.maxScaled 2.19e-14 mm | PASS: intercept.maxScaled 1.49e-14 mm | PASS: intercept.maxScaled 1.88e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 10 | PASS: intercept.maxScaled 3.13e-14 mm | PASS: intercept.maxScaled 1.96e-14 mm | PASS: intercept.maxScaled 2.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 3 | PASS: intercept.maxScaled 2.49e-14 mm | PASS: intercept.maxScaled 2.11e-14 mm | PASS: intercept.maxScaled 3.40e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 10 | PASS: intercept.maxScaled 4.35e-14 mm | PASS: intercept.maxScaled 2.63e-14 mm | PASS: intercept.maxScaled 5.26e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 3 | PASS: intercept.maxScaled 1.99e-14 mm | PASS: intercept.maxScaled 8.54e-15 mm | PASS: intercept.maxScaled 1.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 10 | PASS: intercept.maxScaled 1.52e-14 mm | PASS: intercept.maxScaled 1.05e-14 mm | PASS: intercept.maxScaled 1.86e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 3 | PASS: intercept.maxScaled 1.99e-14 mm | PASS: intercept.maxScaled 8.54e-15 mm | PASS: intercept.maxScaled 1.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 10 | PASS: intercept.maxScaled 1.52e-14 mm | PASS: intercept.maxScaled 1.05e-14 mm | PASS: intercept.maxScaled 1.86e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 3 | PASS: intercept.maxScaled 7.30e-14 mm | PASS: intercept.maxScaled 4.78e-14 mm | PASS: intercept.maxScaled 3.99e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 10 | PASS: intercept.maxScaled 1.53e-13 mm | PASS: intercept.maxScaled 5.74e-14 mm | PASS: intercept.maxScaled 1.32e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 3 | PASS: intercept.maxScaled 1.27e-14 mm | PASS: intercept.maxScaled 4.69e-15 mm | PASS: intercept.maxScaled 1.28e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 10 | PASS: intercept.maxScaled 1.73e-14 mm | PASS: intercept.maxScaled 8.26e-15 mm | PASS: intercept.maxScaled 1.92e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 3 | PASS: intercept.maxScaled 1.27e-14 mm | PASS: intercept.maxScaled 4.69e-15 mm | PASS: intercept.maxScaled 1.28e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 10 | PASS: intercept.maxScaled 1.73e-14 mm | PASS: intercept.maxScaled 8.26e-15 mm | PASS: intercept.maxScaled 1.92e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-best-ref | 3 | PASS: intercept.maxScaled 1.69e-13 mm | PASS: intercept.maxScaled 1.16e-13 mm | PASS: intercept.maxScaled 1.41e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-best-photopic | 10 | PASS: intercept.maxScaled 2.14e-13 mm | PASS: intercept.maxScaled 2.96e-13 mm | PASS: intercept.maxScaled 2.18e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f8-ref | 3 | PASS: intercept.maxScaled 1.49e-14 mm | PASS: intercept.maxScaled 1.32e-14 mm | PASS: intercept.maxScaled 1.16e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 10 | PASS: intercept.maxScaled 1.57e-14 mm | PASS: intercept.maxScaled 1.21e-14 mm | PASS: intercept.maxScaled 1.72e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 3 | PASS: intercept.maxScaled 1.49e-14 mm | PASS: intercept.maxScaled 1.32e-14 mm | PASS: intercept.maxScaled 1.16e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 10 | PASS: intercept.maxScaled 1.57e-14 mm | PASS: intercept.maxScaled 1.21e-14 mm | PASS: intercept.maxScaled 1.72e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 3 | PASS: intercept.maxScaled 7.65e-14 mm | PASS: intercept.maxScaled 3.14e-14 mm | PASS: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 10 | PASS: intercept.maxScaled 6.98e-14 mm | PASS: intercept.maxScaled 4.01e-14 mm | PASS: intercept.maxScaled 6.42e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 3 | PASS: intercept.maxScaled 1.21e-14 mm | PASS: intercept.maxScaled 4.97e-15 mm | PASS: intercept.maxScaled 7.11e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 10 | PASS: intercept.maxScaled 1.84e-14 mm | PASS: intercept.maxScaled 9.06e-15 mm | PASS: intercept.maxScaled 1.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 3 | PASS: intercept.maxScaled 1.21e-14 mm | PASS: intercept.maxScaled 4.97e-15 mm | PASS: intercept.maxScaled 7.11e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 10 | PASS: intercept.maxScaled 1.84e-14 mm | PASS: intercept.maxScaled 9.06e-15 mm | PASS: intercept.maxScaled 1.76e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 3 | PASS: intercept.maxScaled 1.68e-13 mm | PASS: intercept.maxScaled 1.51e-13 mm | PASS: intercept.maxScaled 1.94e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 10 | PASS: intercept.maxScaled 2.26e-13 mm | PASS: intercept.maxScaled 1.99e-13 mm | PASS: intercept.maxScaled 3.49e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 3 | PASS: intercept.maxScaled 6.39e-14 mm | PASS: intercept.maxScaled 4.72e-14 mm | PASS: intercept.maxScaled 5.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 10 | PASS: intercept.maxScaled 7.27e-14 mm | PASS: intercept.maxScaled 6.61e-14 mm | PASS: intercept.maxScaled 6.07e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 3 | PASS: intercept.maxScaled 6.39e-14 mm | PASS: intercept.maxScaled 4.72e-14 mm | PASS: intercept.maxScaled 5.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 10 | PASS: intercept.maxScaled 7.27e-14 mm | PASS: intercept.maxScaled 6.61e-14 mm | PASS: intercept.maxScaled 6.07e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 3 | PASS: intercept.maxScaled 4.28e-14 mm | PASS: intercept.maxScaled 4.28e-14 mm | PASS: intercept.maxScaled 7.07e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 10 | PASS: intercept.maxScaled 9.41e-14 mm | PASS: intercept.maxScaled 5.87e-14 mm | PASS: intercept.maxScaled 9.48e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 3 | PASS: intercept.maxScaled 2.06e-14 mm | PASS: intercept.maxScaled 1.81e-14 mm | PASS: intercept.maxScaled 2.24e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 10 | PASS: intercept.maxScaled 3.19e-14 mm | PASS: intercept.maxScaled 2.08e-14 mm | PASS: intercept.maxScaled 3.35e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 3 | PASS: intercept.maxScaled 2.06e-14 mm | PASS: intercept.maxScaled 1.81e-14 mm | PASS: intercept.maxScaled 2.24e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 10 | PASS: intercept.maxScaled 3.19e-14 mm | PASS: intercept.maxScaled 2.08e-14 mm | PASS: intercept.maxScaled 3.35e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 3 | PASS: intercept.maxScaled 2.89e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | PASS: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 10 | PASS: intercept.maxScaled 4.55e-14 mm | PASS: intercept.maxScaled 4.41e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 3 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 7.93e-14 mm | PASS: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 10 | PASS: intercept.maxScaled 1.94e-14 mm | PASS: intercept.maxScaled 7.85e-14 mm | PASS: intercept.maxScaled 8.10e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 3 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 7.93e-14 mm | PASS: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 10 | PASS: intercept.maxScaled 1.94e-14 mm | PASS: intercept.maxScaled 7.85e-14 mm | PASS: intercept.maxScaled 8.10e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 3 | PASS: intercept.maxScaled 1.11e-13 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 10 | PASS: intercept.maxScaled 9.68e-14 mm | PASS: intercept.maxScaled 2.36e-13 mm | PASS: intercept.maxScaled 2.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 3 | PASS: intercept.maxScaled 2.41e-14 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 10 | PASS: intercept.maxScaled 2.66e-13 mm | PASS: intercept.maxScaled 2.61e-13 mm | PASS: intercept.maxScaled 2.43e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 3 | PASS: intercept.maxScaled 2.41e-14 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 10 | PASS: intercept.maxScaled 2.66e-13 mm | PASS: intercept.maxScaled 2.61e-13 mm | PASS: intercept.maxScaled 2.43e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 3 | PASS: intercept.maxScaled 5.61e-14 mm | PASS: intercept.maxScaled 6.39e-14 mm | PASS: intercept.maxScaled 8.36e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 10 | PASS: intercept.maxScaled 9.52e-14 mm | PASS: intercept.maxScaled 6.39e-14 mm | PASS: intercept.maxScaled 7.79e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 3 | PASS: intercept.maxScaled 3.21e-14 mm | PASS: intercept.maxScaled 1.65e-14 mm | PASS: intercept.maxScaled 2.19e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 10 | PASS: intercept.maxScaled 3.13e-14 mm | PASS: intercept.maxScaled 2.93e-14 mm | PASS: intercept.maxScaled 2.56e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 3 | PASS: intercept.maxScaled 3.21e-14 mm | PASS: intercept.maxScaled 1.65e-14 mm | PASS: intercept.maxScaled 2.19e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 10 | PASS: intercept.maxScaled 3.13e-14 mm | PASS: intercept.maxScaled 2.93e-14 mm | PASS: intercept.maxScaled 2.56e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 3 | PASS: intercept.maxScaled 6.94e-14 mm | PASS: intercept.maxScaled 5.97e-14 mm | PASS: intercept.maxScaled 8.32e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 10 | PASS: intercept.maxScaled 7.45e-14 mm | PASS: intercept.maxScaled 6.48e-14 mm | PASS: intercept.maxScaled 1.30e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f8-ref | 3 | PASS: intercept.maxScaled 3.07e-14 mm | PASS: intercept.maxScaled 1.45e-14 mm | PASS: intercept.maxScaled 1.62e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 10 | PASS: intercept.maxScaled 2.19e-14 mm | PASS: intercept.maxScaled 1.55e-14 mm | PASS: intercept.maxScaled 2.24e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 3 | PASS: intercept.maxScaled 3.07e-14 mm | PASS: intercept.maxScaled 1.45e-14 mm | PASS: intercept.maxScaled 1.62e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 10 | PASS: intercept.maxScaled 2.19e-14 mm | PASS: intercept.maxScaled 1.55e-14 mm | PASS: intercept.maxScaled 2.24e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 3 | PASS: intercept.maxScaled 3.71e-14 mm | PASS: intercept.maxScaled 1.66e-13 mm | PASS: intercept.maxScaled 1.62e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 10 | PASS: intercept.maxScaled 2.87e-14 mm | PASS: intercept.maxScaled 1.63e-13 mm | PASS: intercept.maxScaled 1.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 3 | PASS: intercept.maxScaled 1.06e-14 mm | PASS: intercept.maxScaled 3.63e-14 mm | PASS: intercept.maxScaled 4.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 10 | PASS: intercept.maxScaled 1.18e-14 mm | PASS: intercept.maxScaled 4.36e-14 mm | PASS: intercept.maxScaled 4.44e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 3 | PASS: intercept.maxScaled 1.06e-14 mm | PASS: intercept.maxScaled 3.63e-14 mm | PASS: intercept.maxScaled 4.06e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 10 | PASS: intercept.maxScaled 1.18e-14 mm | PASS: intercept.maxScaled 4.36e-14 mm | PASS: intercept.maxScaled 4.44e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |

## r9a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 1.88e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 1 |
| lv – optiland | distortion.maxScaled (≤ 1.00e-8 mm) | 2.88e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 1 |
| lv – optiland | distortion.maxAbs [percent] | 1.48e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 1, ray 7 |
| lv – optiland | exitPupil.maxScaled (≤ 1.00e-8 mm) | 3.20e-13 | nikon-z-mc-105f28-ref | line 0, ray 30 |
| lv – optiland | exitPupil.maxAbs [mm] | 1.31e-12 | nikon-z-mc-105f28-ref | line 0, ray 30 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 42912 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lateralColour.maxAbs (≤ 1.00e-8 mm) | 2.56e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 2, ray 18 |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 3.48e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| lv – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.66e-13 | sony-fe-20mm-f18-g-f8-best-photopic | line 1, ray 17 |
| lv – ref | distortion.maxAbs [percent] | 2.18e-12 | sigma-45mm-f28-dg-dn-contemporary-photopic | line 0, ray 7 |
| lv – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 4.83e-13 | nikon-z-24-70f4s-wide-photopic | line 1, ray 8 |
| lv – ref | exitPupil.maxAbs [mm] | 1.92e-12 | nikon-z-24-70f4s-wide-photopic | line 1, ray 8 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 42912 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lateralColour.maxAbs (≤ 1.00e-8 mm) | 3.77e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 3.66e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| optiland – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.86e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |
| optiland – ref | distortion.maxAbs [percent] | 2.24e-12 | nikon-z-24-70f4s-wide-best-photopic | line 3, ray 11 |
| optiland – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 4.82e-13 | nikon-z-24-70f4s-wide-photopic | line 3, ray 8 |
| optiland – ref | exitPupil.maxAbs [mm] | 1.96e-12 | nikon-z-24-70f4s-wide-photopic | line 3, ray 8 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 42912 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lateralColour.maxAbs (≤ 1.00e-8 mm) | 4.09e-13 | sony-fe-20mm-f18-g-best-photopic | line 1, ray 17 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 4 | PASS: distortion.maxScaled 8.28e-14 mm | PASS: distortion.maxScaled 4.95e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 4 | PASS: distortion.maxScaled 9.50e-14 mm | PASS: lateralColour.maxAbs 6.75e-14 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-photopic | 4 | PASS: lateralColour.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.73e-13 mm | PASS: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 4 | PASS: distortion.maxScaled 1.57e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 4 | PASS: distortion.maxScaled 2.85e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 4 | PASS: distortion.maxScaled 1.88e-13 mm | PASS: lateralColour.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-ref | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-ref | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.40e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 4 | PASS: distortion.maxScaled 5.29e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 4 | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-best-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 4 | PASS: distortion.maxScaled 7.93e-14 mm | PASS: distortion.maxScaled 4.95e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 4 | PASS: distortion.maxScaled 9.50e-14 mm | PASS: lateralColour.maxAbs 6.75e-14 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 4 | PASS: distortion.maxScaled 8.28e-14 mm | PASS: distortion.maxScaled 4.95e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 4 | PASS: distortion.maxScaled 9.50e-14 mm | PASS: lateralColour.maxAbs 6.75e-14 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 4 | PASS: distortion.maxScaled 7.93e-14 mm | PASS: distortion.maxScaled 5.14e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 4 | PASS: distortion.maxScaled 9.51e-14 mm | PASS: distortion.maxScaled 7.12e-14 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-best-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-best-photopic | 4 | PASS: lateralColour.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 4 | PASS: lateralColour.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-best-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 4 | PASS: landing.maxAbs 1.07e-13 mm | PASS: distortion.maxScaled 1.40e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-best-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.77e-13 mm | PASS: lateralColour.maxAbs 4.09e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.73e-13 mm | PASS: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.77e-13 mm | PASS: lateralColour.maxAbs 4.09e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 4 | PASS: distortion.maxScaled 1.56e-13 mm | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 4 | PASS: distortion.maxScaled 2.88e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 4 | PASS: distortion.maxScaled 1.57e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 4 | PASS: distortion.maxScaled 2.85e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 4 | PASS: distortion.maxScaled 1.57e-13 mm | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 4 | PASS: distortion.maxScaled 2.85e-13 mm | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.31e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 4 | PASS: lateralColour.maxAbs 1.92e-13 mm | PASS: lateralColour.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 4 | PASS: distortion.maxScaled 1.88e-13 mm | PASS: lateralColour.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 4 | PASS: lateralColour.maxAbs 1.88e-13 mm | PASS: lateralColour.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.03e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-best-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.46e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.40e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.46e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 4 | PASS: distortion.maxScaled 1.23e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 4 | PASS: distortion.maxScaled 4.93e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 4 | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 4 | PASS: distortion.maxScaled 5.29e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 4 | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 4 | PASS: distortion.maxScaled 4.67e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 4 | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## r10a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 7.25e-13 | sony-fe-20mm-f18-g-photopic | line 4, ray 1592 |
| lv – optiland | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.19e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 69 |
| lv – optiland | tangentialFocus.maxAbs [mm] | 4.43e-9 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 69 |
| lv – optiland | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 6.05e-14 | nikkor-z50f12-photopic | line 0, ray 308 |
| lv – optiland | sagittalFocus.maxAbs [mm] | 1.74e-12 | sony-fe-400mm-f28-gm-oss-ref | line 0, ray 64 |
| lv – optiland | astigmatism.maxAbs [mm] | 4.43e-9 | sony-fe-400mm-f28-gm-oss-photopic | line 4, ray 69 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 498906 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 9792 | — | — |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 7.85e-13 | sony-fe-20mm-f18-g-ref | line 0, ray 1688 |
| lv – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.10e-13 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – ref | tangentialFocus.maxAbs [mm] | 3.98e-9 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 8.92e-14 | nikon-z-24-70f4s-wide-photopic | line 1, ray 1750 |
| lv – ref | sagittalFocus.maxAbs [mm] | 1.47e-12 | nikon-z-24-70f4s-wide-f8-best-photopic | line 3, ray 4 |
| lv – ref | astigmatism.maxAbs [mm] | 3.98e-9 | sony-fe-400mm-f28-gm-oss-best-ref | line 0, ray 84 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 498906 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 9792 | — | — |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 7.85e-13 | sony-fe-20mm-f18-g-ref | line 0, ray 1491 |
| optiland – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.33e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 79 |
| optiland – ref | tangentialFocus.maxAbs [mm] | 4.87e-9 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 79 |
| optiland – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 8.98e-14 | nikon-z-24-70f4s-wide-best-photopic | line 1, ray 1750 |
| optiland – ref | sagittalFocus.maxAbs [mm] | 2.00e-12 | sony-fe-400mm-f28-gm-oss-ref | line 0, ray 64 |
| optiland – ref | astigmatism.maxAbs [mm] | 4.87e-9 | sony-fe-400mm-f28-gm-oss-best-photopic | line 1, ray 79 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 498906 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 9792 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 2 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 1565 / 271 / 0 | 1565 / 271 / 0 | 1565 / 271 / 0 |
| canon-ef-135-f2l-usm-photopic | 10 | PASS: landing.maxAbs 1.97e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.76e-13 mm | 7795 / 1385 / 0 | 7795 / 1385 / 0 | 7795 / 1385 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 2 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 1733 / 103 / 0 | 1733 / 103 / 0 | 1733 / 103 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 10 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | 8566 / 614 / 0 | 8566 / 614 / 0 | 8566 / 614 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 2 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 2.59e-13 mm | PASS: landing.maxAbs 2.56e-13 mm | 1558 / 278 / 0 | 1558 / 278 / 0 | 1558 / 278 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 10 | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | PASS: landing.maxAbs 2.77e-13 mm | 7753 / 1427 / 0 | 7753 / 1427 / 0 | 7753 / 1427 / 0 |
| nikkor-z50f12-ref | 2 | PASS: landing.maxAbs 3.51e-13 mm | PASS: landing.maxAbs 2.55e-13 mm | PASS: landing.maxAbs 3.53e-13 mm | 1617 / 219 / 0 | 1617 / 219 / 0 | 1617 / 219 / 0 |
| nikkor-z50f12-photopic | 10 | PASS: landing.maxAbs 4.32e-13 mm | PASS: landing.maxAbs 2.99e-13 mm | PASS: landing.maxAbs 3.64e-13 mm | 8017 / 1163 / 0 | 8017 / 1163 / 0 | 8017 / 1163 / 0 |
| sony-fe-20mm-f18-g-ref | 2 | PASS: landing.maxAbs 5.97e-13 mm | PASS: landing.maxAbs 7.85e-13 mm | PASS: landing.maxAbs 7.85e-13 mm | 1796 / 40 / 0 | 1796 / 40 / 0 | 1796 / 40 / 0 |
| sony-fe-20mm-f18-g-photopic | 10 | PASS: landing.maxAbs 7.25e-13 mm | PASS: landing.maxAbs 7.43e-13 mm | PASS: landing.maxAbs 7.35e-13 mm | 8820 / 360 / 0 | 8820 / 360 / 0 | 8820 / 360 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 2 | PASS: landing.maxAbs 3.34e-13 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 3.03e-13 mm | 1635 / 201 / 0 | 1635 / 201 / 0 | 1635 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 10 | PASS: landing.maxAbs 3.55e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | PASS: landing.maxAbs 3.59e-13 mm | 8100 / 1080 / 0 | 8100 / 1080 / 0 | 8100 / 1080 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 2 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 1684 / 152 / 0 | 1684 / 152 / 0 | 1684 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 10 | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 8334 / 846 / 0 | 8334 / 846 / 0 | 8334 / 846 / 0 |
| nikon-z-24-70f4s-wide-ref | 2 | PASS: landing.maxAbs 6.54e-13 mm | PASS: landing.maxAbs 4.48e-13 mm | PASS: landing.maxAbs 6.57e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-wide-photopic | 10 | PASS: landing.maxAbs 6.39e-13 mm | PASS: landing.maxAbs 5.36e-13 mm | PASS: landing.maxAbs 6.36e-13 mm | 8768 / 412 / 0 | 8768 / 412 / 0 | 8768 / 412 / 0 |
| nikon-z-24-70f4s-tele-ref | 2 | PASS: landing.maxAbs 1.40e-13 mm | PASS: landing.maxAbs 5.99e-13 mm | PASS: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-tele-photopic | 10 | PASS: landing.maxAbs 5.26e-13 mm | PASS: landing.maxAbs 6.63e-13 mm | PASS: landing.maxAbs 7.30e-13 mm | 8500 / 680 / 0 | 8500 / 680 / 0 | 8500 / 680 / 0 |
| nikon-z-mc-105f28-ref | 2 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.53e-13 mm | 1601 / 235 / 0 | 1601 / 235 / 0 | 1601 / 235 / 0 |
| nikon-z-mc-105f28-photopic | 10 | PASS: landing.maxAbs 1.48e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.55e-13 mm | 7927 / 1253 / 0 | 7927 / 1253 / 0 | 7927 / 1253 / 0 |
| nikon-z-135f18-plena-ref | 2 | PASS: landing.maxAbs 1.46e-13 mm | PASS: landing.maxAbs 1.60e-13 mm | PASS: landing.maxAbs 1.31e-13 mm | 1798 / 38 / 0 | 1798 / 38 / 0 | 1798 / 38 / 0 |
| nikon-z-135f18-plena-photopic | 10 | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 1.49e-13 mm | PASS: landing.maxAbs 1.83e-13 mm | 8877 / 303 / 0 | 8877 / 303 / 0 | 8877 / 303 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2 | PASS: landing.maxAbs 6.32e-13 mm | PASS: landing.maxAbs 3.91e-13 mm | PASS: landing.maxAbs 6.57e-13 mm | 1616 / 220 / 0 | 1616 / 220 / 0 | 1616 / 220 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 10 | PASS: landing.maxAbs 6.82e-13 mm | PASS: landing.maxAbs 4.19e-13 mm | PASS: landing.maxAbs 6.79e-13 mm | 8018 / 1162 / 0 | 8018 / 1162 / 0 | 8018 / 1162 / 0 |
| canon-ef-135-f2l-usm-best-ref | 2 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 1565 / 271 / 0 | 1565 / 271 / 0 | 1565 / 271 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 10 | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.76e-13 mm | 7795 / 1385 / 0 | 7795 / 1385 / 0 | 7795 / 1385 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 2 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 10 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 2 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 8.88e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 10 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 2 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 1.07e-13 mm | 1733 / 103 / 0 | 1733 / 103 / 0 | 1733 / 103 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 10 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 8566 / 614 / 0 | 8566 / 614 / 0 | 8566 / 614 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 2 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 8.17e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 10 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | 9034 / 146 / 0 | 9034 / 146 / 0 | 9034 / 146 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 2 | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 8.17e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 10 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | 9034 / 146 / 0 | 9034 / 146 / 0 | 9034 / 146 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 2 | PASS: landing.maxAbs 1.33e-13 mm | PASS: landing.maxAbs 2.59e-13 mm | PASS: landing.maxAbs 2.52e-13 mm | 1558 / 278 / 0 | 1558 / 278 / 0 | 1558 / 278 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 10 | PASS: landing.maxAbs 1.74e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | PASS: landing.maxAbs 2.77e-13 mm | 7753 / 1427 / 0 | 7753 / 1427 / 0 | 7753 / 1427 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 2 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 1804 / 32 / 0 | 1804 / 32 / 0 | 1804 / 32 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 10 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 2.08e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 8875 / 305 / 0 | 8875 / 305 / 0 | 8875 / 305 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 2 | PASS: landing.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 1804 / 32 / 0 | 1804 / 32 / 0 | 1804 / 32 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 10 | PASS: landing.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 2.08e-13 mm | PASS: landing.maxAbs 2.15e-13 mm | 8875 / 305 / 0 | 8875 / 305 / 0 | 8875 / 305 / 0 |
| nikkor-z50f12-best-ref | 2 | PASS: landing.maxAbs 3.51e-13 mm | PASS: landing.maxAbs 2.55e-13 mm | PASS: landing.maxAbs 3.53e-13 mm | 1617 / 219 / 0 | 1617 / 219 / 0 | 1617 / 219 / 0 |
| nikkor-z50f12-best-photopic | 10 | PASS: landing.maxAbs 4.31e-13 mm | PASS: landing.maxAbs 2.99e-13 mm | PASS: landing.maxAbs 3.63e-13 mm | 8017 / 1163 / 0 | 8017 / 1163 / 0 | 8017 / 1163 / 0 |
| nikkor-z50f12-f8-ref | 2 | PASS: landing.maxAbs 2.24e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 10 | PASS: landing.maxAbs 2.91e-13 mm | PASS: landing.maxAbs 2.38e-13 mm | PASS: landing.maxAbs 2.38e-13 mm | 9036 / 144 / 0 | 9036 / 144 / 0 | 9036 / 144 / 0 |
| nikkor-z50f12-f8-best-ref | 2 | PASS: landing.maxAbs 2.27e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 10 | PASS: landing.maxAbs 2.91e-13 mm | PASS: landing.maxAbs 2.38e-13 mm | PASS: landing.maxAbs 2.42e-13 mm | 9036 / 144 / 0 | 9036 / 144 / 0 | 9036 / 144 / 0 |
| sony-fe-20mm-f18-g-best-ref | 2 | PASS: landing.maxAbs 5.90e-13 mm | PASS: landing.maxAbs 7.82e-13 mm | PASS: landing.maxAbs 7.82e-13 mm | 1796 / 40 / 0 | 1796 / 40 / 0 | 1796 / 40 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 10 | PASS: landing.maxAbs 7.25e-13 mm | PASS: landing.maxAbs 7.43e-13 mm | PASS: landing.maxAbs 7.32e-13 mm | 8820 / 360 / 0 | 8820 / 360 / 0 | 8820 / 360 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 2 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 3.55e-13 mm | PASS: landing.maxAbs 3.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 10 | PASS: landing.maxAbs 3.13e-13 mm | PASS: landing.maxAbs 3.69e-13 mm | PASS: landing.maxAbs 3.52e-13 mm | 8979 / 201 / 0 | 8979 / 201 / 0 | 8979 / 201 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 2 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 3.55e-13 mm | PASS: landing.maxAbs 3.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 10 | PASS: landing.maxAbs 3.16e-13 mm | PASS: landing.maxAbs 3.69e-13 mm | PASS: landing.maxAbs 3.48e-13 mm | 8979 / 201 / 0 | 8979 / 201 / 0 | 8979 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 2 | PASS: landing.maxAbs 3.35e-13 mm | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 3.03e-13 mm | 1635 / 201 / 0 | 1635 / 201 / 0 | 1635 / 201 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 10 | PASS: landing.maxAbs 3.55e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | PASS: landing.maxAbs 3.60e-13 mm | 8100 / 1080 / 0 | 8100 / 1080 / 0 | 8100 / 1080 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 2 | PASS: landing.maxAbs 3.27e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 10 | PASS: landing.maxAbs 4.76e-13 mm | PASS: landing.maxAbs 2.42e-13 mm | PASS: landing.maxAbs 4.44e-13 mm | 9025 / 155 / 0 | 9025 / 155 / 0 | 9025 / 155 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 2 | PASS: landing.maxAbs 3.27e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 10 | PASS: landing.maxAbs 4.76e-13 mm | PASS: landing.maxAbs 2.42e-13 mm | PASS: landing.maxAbs 4.48e-13 mm | 9025 / 155 / 0 | 9025 / 155 / 0 | 9025 / 155 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 2 | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.99e-13 mm | 1684 / 152 / 0 | 1684 / 152 / 0 | 1684 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 10 | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 2.10e-13 mm | 8334 / 846 / 0 | 8334 / 846 / 0 | 8334 / 846 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 2 | PASS: landing.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.99e-13 mm | 1820 / 16 / 0 | 1820 / 16 / 0 | 1820 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 10 | PASS: landing.maxAbs 1.95e-13 mm | PASS: landing.maxAbs 1.49e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 8961 / 219 / 0 | 8961 / 219 / 0 | 8961 / 219 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 2 | PASS: landing.maxAbs 1.42e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.99e-13 mm | 1820 / 16 / 0 | 1820 / 16 / 0 | 1820 / 16 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 10 | PASS: landing.maxAbs 1.95e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 8961 / 219 / 0 | 8961 / 219 / 0 | 8961 / 219 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 2 | PASS: landing.maxAbs 6.50e-13 mm | PASS: landing.maxAbs 4.48e-13 mm | PASS: landing.maxAbs 6.54e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 10 | PASS: landing.maxAbs 6.39e-13 mm | PASS: landing.maxAbs 5.33e-13 mm | PASS: landing.maxAbs 6.36e-13 mm | 8768 / 412 / 0 | 8768 / 412 / 0 | 8768 / 412 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 2 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 4.69e-13 mm | PASS: landing.maxAbs 4.16e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 10 | PASS: landing.maxAbs 5.76e-13 mm | PASS: landing.maxAbs 5.54e-13 mm | PASS: landing.maxAbs 5.93e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 2 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 4.73e-13 mm | PASS: landing.maxAbs 4.19e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 10 | PASS: landing.maxAbs 5.76e-13 mm | PASS: landing.maxAbs 5.51e-13 mm | PASS: landing.maxAbs 5.90e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 2 | PASS: landing.maxAbs 1.40e-13 mm | PASS: landing.maxAbs 5.99e-13 mm | PASS: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 10 | PASS: landing.maxAbs 5.26e-13 mm | PASS: landing.maxAbs 6.63e-13 mm | PASS: landing.maxAbs 7.30e-13 mm | 8500 / 680 / 0 | 8500 / 680 / 0 | 8500 / 680 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 2 | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 10 | PASS: landing.maxAbs 3.87e-13 mm | PASS: landing.maxAbs 5.54e-13 mm | PASS: landing.maxAbs 5.97e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 2 | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 10 | PASS: landing.maxAbs 3.87e-13 mm | PASS: landing.maxAbs 5.51e-13 mm | PASS: landing.maxAbs 5.97e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-mc-105f28-best-ref | 2 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 1601 / 235 / 0 | 1601 / 235 / 0 | 1601 / 235 / 0 |
| nikon-z-mc-105f28-best-photopic | 10 | PASS: landing.maxAbs 1.48e-13 mm | PASS: landing.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.54e-13 mm | 7927 / 1253 / 0 | 7927 / 1253 / 0 | 7927 / 1253 / 0 |
| nikon-z-mc-105f28-f8-ref | 2 | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 10 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.67e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 2 | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 10 | PASS: landing.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.71e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| nikon-z-135f18-plena-best-ref | 2 | PASS: landing.maxAbs 1.44e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.30e-13 mm | 1798 / 38 / 0 | 1798 / 38 / 0 | 1798 / 38 / 0 |
| nikon-z-135f18-plena-best-photopic | 10 | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 1.53e-13 mm | PASS: landing.maxAbs 1.83e-13 mm | 8877 / 303 / 0 | 8877 / 303 / 0 | 8877 / 303 / 0 |
| nikon-z-135f18-plena-f8-ref | 2 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 10 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.35e-13 mm | 9043 / 137 / 0 | 9043 / 137 / 0 | 9043 / 137 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 2 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 10 | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | 9043 / 137 / 0 | 9043 / 137 / 0 | 9043 / 137 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 2 | PASS: landing.maxAbs 6.32e-13 mm | PASS: landing.maxAbs 3.91e-13 mm | PASS: landing.maxAbs 6.57e-13 mm | 1616 / 220 / 0 | 1616 / 220 / 0 | 1616 / 220 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 10 | PASS: landing.maxAbs 6.82e-13 mm | PASS: landing.maxAbs 4.19e-13 mm | PASS: landing.maxAbs 6.75e-13 mm | 8018 / 1162 / 0 | 8018 / 1162 / 0 | 8018 / 1162 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 2 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 4.65e-13 mm | PASS: landing.maxAbs 4.69e-13 mm | 1816 / 20 / 0 | 1816 / 20 / 0 | 1816 / 20 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 10 | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 4.58e-13 mm | PASS: landing.maxAbs 4.90e-13 mm | 8945 / 235 / 0 | 8945 / 235 / 0 | 8945 / 235 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 2 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 4.65e-13 mm | PASS: landing.maxAbs 4.69e-13 mm | 1816 / 20 / 0 | 1816 / 20 / 0 | 1816 / 20 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 10 | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 4.55e-13 mm | PASS: landing.maxAbs 4.90e-13 mm | 8945 / 235 / 0 | 8945 / 235 / 0 | 8945 / 235 / 0 |

## r11a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | illumination.maxAbs (≤ 1.00e-9) | 2.93e-14 | nikon-z-mc-105f28-f8-photopic | field 1.00e1, line 3 |
| lv – optiland | transmission.maxAbs (≤ 0) | 0 | canon-ef-135-f2l-usm-ref | field 0, line 0 |
| lv – optiland | transmission.rimBandOrFailed | 0 | canon-ef-135-f2l-usm-ref | field 0, line 0 |
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 1.88e-13 | sony-fe-400mm-f28-gm-oss-best-photopic | field 3.15e0, line 1, ray 2048 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 5342446 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 2784 | — | — |
| lv – ref | illumination.maxAbs (≤ 1.00e-9) | 7.05e-14 | nikon-z-24-70f4s-wide-f8-photopic | field 2.02e1, line 2 |
| lv – ref | transmission.maxAbs (≤ 0) | 0 | canon-ef-135-f2l-usm-ref | field 0, line 0 |
| lv – ref | transmission.rimBandOrFailed | 0 | canon-ef-135-f2l-usm-ref | field 0, line 0 |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.01e-13 | sigma-35mm-f14-dg-hsm-a-photopic | field 2.32e1, line 0, ray 2048 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 5342446 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 2784 | — | — |
| optiland – ref | illumination.maxAbs (≤ 1.00e-9) | 7.17e-14 | nikon-z-24-70f4s-wide-f8-photopic | field 2.02e1, line 2 |
| optiland – ref | transmission.maxAbs (≤ 0) | 0 | canon-ef-135-f2l-usm-ref | field 0, line 0 |
| optiland – ref | transmission.rimBandOrFailed | 0 | canon-ef-135-f2l-usm-ref | field 0, line 0 |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.03e-13 | sony-fe-400mm-f28-gm-oss-photopic | field 3.15e0, line 3, ray 2048 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 5342446 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 2784 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 2.31e-14 mm | PASS: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-photopic | 5 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | PASS: illumination.maxAbs 2.66e-15 | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 5 | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.58e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 5 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-ref | 1 | PASS: illumination.maxAbs 1.39e-14 | PASS: landing.maxAbs 5.33e-14 mm | PASS: illumination.maxAbs 1.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-photopic | 5 | PASS: illumination.maxAbs 1.49e-14 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.49e-13 mm | 10229 / 16 / 0 | 10229 / 16 / 0 | 10229 / 16 / 0 |
| sony-fe-20mm-f18-g-ref | 1 | PASS: illumination.maxAbs 6.83e-15 | PASS: illumination.maxAbs 2.39e-14 | PASS: illumination.maxAbs 2.52e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-photopic | 5 | PASS: illumination.maxAbs 2.03e-14 | PASS: illumination.maxAbs 2.33e-14 | PASS: illumination.maxAbs 2.71e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 5 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 5 | PASS: landing.maxAbs 9.77e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikon-z-24-70f4s-wide-ref | 1 | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 1.40e-14 | PASS: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-photopic | 5 | PASS: illumination.maxAbs 6.55e-15 | PASS: illumination.maxAbs 1.62e-14 | PASS: illumination.maxAbs 1.53e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-tele-ref | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.74e-14 | PASS: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-photopic | 5 | PASS: illumination.maxAbs 9.10e-15 | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.90e-14 | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| nikon-z-mc-105f28-ref | 1 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-photopic | 5 | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-135f18-plena-ref | 1 | PASS: landing.maxAbs 2.13e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | PASS: landing.maxAbs 3.20e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-photopic | 5 | PASS: illumination.maxAbs 4.44e-15 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | PASS: illumination.maxAbs 4.33e-15 | PASS: landing.maxAbs 1.60e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 5 | PASS: illumination.maxAbs 6.00e-15 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 1.95e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-best-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 2.31e-14 mm | PASS: landing.maxAbs 3.55e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-best-photopic | 5 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f8-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 2.31e-14 mm | PASS: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-photopic | 5 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f8-best-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 2.31e-14 mm | PASS: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f8-best-photopic | 5 | PASS: landing.maxAbs 8.88e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 1 | PASS: illumination.maxAbs 2.66e-15 | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 5 | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 1 | PASS: landing.maxAbs 1.78e-14 mm | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 5 | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | 1 | PASS: landing.maxAbs 1.42e-14 mm | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 5 | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.58e-13 mm | PASS: landing.maxAbs 1.76e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 5 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 1 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.58e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 5 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.58e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 5 | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.97e-13 mm | PASS: landing.maxAbs 1.87e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-best-ref | 1 | PASS: illumination.maxAbs 1.39e-14 | PASS: landing.maxAbs 5.33e-14 mm | PASS: illumination.maxAbs 1.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-best-photopic | 5 | PASS: illumination.maxAbs 1.49e-14 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.49e-13 mm | 10229 / 16 / 0 | 10229 / 16 / 0 | 10229 / 16 / 0 |
| nikkor-z50f12-f8-ref | 1 | PASS: illumination.maxAbs 1.47e-14 | PASS: illumination.maxAbs 1.27e-14 | PASS: illumination.maxAbs 2.43e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f8-photopic | 5 | PASS: illumination.maxAbs 1.18e-14 | PASS: illumination.maxAbs 1.23e-14 | PASS: illumination.maxAbs 2.14e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-f8-best-ref | 1 | PASS: illumination.maxAbs 1.47e-14 | PASS: illumination.maxAbs 1.27e-14 | PASS: illumination.maxAbs 2.43e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f8-best-photopic | 5 | PASS: illumination.maxAbs 1.18e-14 | PASS: illumination.maxAbs 1.23e-14 | PASS: illumination.maxAbs 2.14e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-20mm-f18-g-best-ref | 1 | PASS: illumination.maxAbs 6.83e-15 | PASS: illumination.maxAbs 2.39e-14 | PASS: illumination.maxAbs 2.52e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-best-photopic | 5 | PASS: illumination.maxAbs 2.03e-14 | PASS: illumination.maxAbs 2.33e-14 | PASS: illumination.maxAbs 2.71e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| sony-fe-20mm-f18-g-f8-ref | 1 | PASS: illumination.maxAbs 8.66e-15 | PASS: illumination.maxAbs 5.17e-14 | PASS: illumination.maxAbs 5.20e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-photopic | 5 | PASS: illumination.maxAbs 6.94e-15 | PASS: illumination.maxAbs 5.62e-14 | PASS: illumination.maxAbs 5.70e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-20mm-f18-g-f8-best-ref | 1 | PASS: illumination.maxAbs 8.66e-15 | PASS: illumination.maxAbs 5.17e-14 | PASS: illumination.maxAbs 5.20e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f8-best-photopic | 5 | PASS: illumination.maxAbs 6.94e-15 | PASS: illumination.maxAbs 5.62e-14 | PASS: illumination.maxAbs 5.70e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-400mm-f28-gm-oss-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-best-photopic | 5 | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: illumination.maxAbs 6.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 5 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: illumination.maxAbs 6.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 5 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 1.99e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 1 | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 5 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 5 | PASS: landing.maxAbs 9.77e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 1 | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 5 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikon-z-24-70f4s-wide-best-ref | 1 | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 1.40e-14 | PASS: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-best-photopic | 5 | PASS: illumination.maxAbs 6.55e-15 | PASS: illumination.maxAbs 1.62e-14 | PASS: illumination.maxAbs 1.53e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-wide-f8-ref | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 4.88e-14 | PASS: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-photopic | 5 | PASS: illumination.maxAbs 7.33e-15 | PASS: illumination.maxAbs 7.05e-14 | PASS: illumination.maxAbs 7.17e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-wide-f8-best-ref | 1 | PASS: landing.maxAbs 5.68e-14 mm | PASS: illumination.maxAbs 4.88e-14 | PASS: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-wide-f8-best-photopic | 5 | PASS: illumination.maxAbs 7.33e-15 | PASS: illumination.maxAbs 7.05e-14 | PASS: illumination.maxAbs 7.17e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-tele-best-ref | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.74e-14 | PASS: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-best-photopic | 5 | PASS: illumination.maxAbs 9.10e-15 | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.90e-14 | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| nikon-z-24-70f4s-tele-f8-ref | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-photopic | 5 | PASS: illumination.maxAbs 9.55e-15 | PASS: illumination.maxAbs 2.02e-14 | PASS: illumination.maxAbs 2.15e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-tele-f8-best-ref | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-tele-f8-best-photopic | 5 | PASS: illumination.maxAbs 9.55e-15 | PASS: illumination.maxAbs 2.02e-14 | PASS: illumination.maxAbs 2.15e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-mc-105f28-best-ref | 1 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-best-photopic | 5 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f8-ref | 1 | PASS: illumination.maxAbs 2.42e-14 | PASS: landing.maxAbs 1.17e-13 mm | PASS: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f8-photopic | 5 | PASS: illumination.maxAbs 2.93e-14 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 2.53e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-ref | 1 | PASS: illumination.maxAbs 2.42e-14 | PASS: landing.maxAbs 1.14e-13 mm | PASS: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f8-best-photopic | 5 | PASS: illumination.maxAbs 2.93e-14 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 2.53e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-135f18-plena-best-ref | 1 | PASS: landing.maxAbs 2.13e-14 mm | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 3.20e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-best-photopic | 5 | PASS: illumination.maxAbs 4.44e-15 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f8-ref | 1 | PASS: illumination.maxAbs 4.55e-15 | PASS: illumination.maxAbs 3.55e-15 | PASS: illumination.maxAbs 4.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f8-photopic | 5 | PASS: landing.maxAbs 4.09e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f8-best-ref | 1 | PASS: illumination.maxAbs 4.55e-15 | PASS: illumination.maxAbs 3.55e-15 | PASS: illumination.maxAbs 4.00e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f8-best-photopic | 5 | PASS: landing.maxAbs 4.26e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 1 | PASS: illumination.maxAbs 4.33e-15 | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 5 | PASS: illumination.maxAbs 6.00e-15 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 1 | PASS: landing.maxAbs 3.91e-14 mm | PASS: illumination.maxAbs 3.04e-14 | PASS: illumination.maxAbs 2.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 5 | PASS: illumination.maxAbs 4.11e-15 | PASS: illumination.maxAbs 3.20e-14 | PASS: illumination.maxAbs 3.03e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1 | PASS: landing.maxAbs 3.91e-14 mm | PASS: illumination.maxAbs 3.04e-14 | PASS: illumination.maxAbs 2.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 5 | PASS: illumination.maxAbs 4.11e-15 | PASS: illumination.maxAbs 3.20e-14 | PASS: illumination.maxAbs 3.03e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
