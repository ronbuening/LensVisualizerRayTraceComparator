# Baseline of states

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
| Suite | states |
| Suite hash | b45f25ba129d4c0d95ab44ec5084eca68742a36a55828fcdc3a08ae932ed45f2 |
| Baseline hash | 9ebc2724e7247b34a703f711eba88872a72a944f96d979a65e10161a7cef2b5e |
| Contract version | 1.0 |
| Policy | rungs v14 |
| Policy hash | 693c4a981e4c624693b3759c7b7d5d363a09bc00b2c4eeecfc77c3134437e120 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | 7b756ee63bd252b76b978a1dbc18185a9c565c118ed662ec694def8ca72c6a56 | 842d3acb45d7d0bb2ac1adec106bd771ec5f68a5b92662bf76dc5cf887e04725 | commit ab0fd4cf94836492b28470953812ed4afc98c0c6, dirty false, engineFileCount 177 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 905727914f01561fe28be507b27f41e38792efa4cbb3d10e3d0c148b2f147015 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | d25c837015c1eddebcb47c6b1c8884452a07829480d52ab0fd1b2bd5b0bafcb6 | 15a954ff46c3b6c4b9f05371470b3b4f35f5edaea95d1a960e8ff021f1f38c07 | sourceFiles 11 |

| Run | Case |
|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | c0e87372783bbd8a8fbb5b8abcf34ab264401ab47744cb64a61c3e49db0a1698 |
| canon-ef-135-f2l-usm-f5.6-photopic | 6e16cb41d3a1737e746cda1fabd1300b32e1b3a50b72e33ad3a5f14f1669a128 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 61bc40770280967851419083bffad65f35699994455895b9c378ae3442d977a5 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 2a0be2724fab8e1975fbbc3e5ea1c3fa7fd872cb97e8938f47094af1ec48226a |
| canon-ef-135-f2l-usm-f11-ref | 4bd6eac33e3d5a171eb5ef2270fb40e9dc9ab29ad224e71b8a960b3784bc2ebf |
| canon-ef-135-f2l-usm-f11-photopic | 46e839b123926690036f4477c1f8b6eab5fb57cc6b8398c54a525e0799591a35 |
| canon-ef-135-f2l-usm-f11-best-ref | 3e2a3041c3855da032385dab90ce1a5223bb9154df4827dcaad94bea4d56ae72 |
| canon-ef-135-f2l-usm-f11-best-photopic | 40f488bac07f13920a31f89daabe39542caf5c942934d16f403bd16d3f59f832 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | ac0c53a9e6287256a14bcb19610b924cd9ed9afa58911bd771112d8cad6c4092 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 6fa2b736847fc7b57d1dc4e1018f0b2e52565a65d7e79a0ceff749d24564db3d |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | cecfbcdb0d12a82be79efd0d244800de0b199f4c4345eceb90754a4f4f25f24e |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 7d9b4d1fb75a25becfc1d25a6a9d18f659f5ff53010f6968c05b221ebde32caf |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | d5bb8d6ca615f6e5915fa7b602f4ad13c17abca7f9a65a635e832793a275318b |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1e073ce15995cbf454326cb863293ff2563b111ffd36e48f10224a9595a83ad0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 42e040bd859dfa26cf5e6798c96c7542076a2ef26e2b5071d0574e57501ea00f |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | f7c923f583d9c3f7ea15cccd0bc1a49091b4df00370f561090db0425ee019e45 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | d7cb9811dd23d692fb8eec831f8f07effdac024692708297a55bfb20d83f9edc |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 26897873e891b58b82792c27fd4cf2866424a29fcdcd78c7b82ff9662fbdc43d |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | fece198ea407be993ca9bf2b8f884517cc0f70cc0a2bb9daeafb486fd1b5c467 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 718f9804619e8d99f21f9be8d273ef31843910a9c01caec7828ca849845d2da8 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 484c9d9c9b0574fa80df036c1f84ccf0cf8b6355b75eac27843753fba19c9901 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | ce5247479530f9f4298ae8bfd93a678a03ad5d597650d0c4e2e609e7c4a80642 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | ca87df8c11615b03da87ad26bcdf55d9f860792dfeb7d518b74ae56d53522020 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 2eff3fedeb25e680fa9e1bcd324fa38bbfe2ad21b282eaf175fe36622a37036c |
| nikkor-z50f12-f5.6-ref | 395bb2a10d84250b4d016e57f4cd64be0ff2acbf5af268663dfb1a03973be0a2 |
| nikkor-z50f12-f5.6-photopic | f70487954823beed0fef4592b3a73ad0a0bfbf5c3c4cd7b5a6b93e397b4fec7c |
| nikkor-z50f12-f5.6-best-ref | 2477f9de6a098db5439f3679fee665737d4bf9582fe7a51f9a98f282d2e892ef |
| nikkor-z50f12-f5.6-best-photopic | 53728fd1171f2edfb8b6a1ed5e9c434a033860bce8774651de787eea637745d5 |
| nikkor-z50f12-f11-ref | 504e25b011c410bf425e597b9489394367d812b96f8af1ef469f44d40b1ee2c5 |
| nikkor-z50f12-f11-photopic | 9d263f522abec6ef57362684f988b51fc6b98b6b59e93643db40996634a742d2 |
| nikkor-z50f12-f11-best-ref | 00898aa06f0679bdefe874945adc5520a234e04750ac24f24f8a52e86944102c |
| nikkor-z50f12-f11-best-photopic | a777af7634be32853fc468c91225d13e3b3995b6f526990e024a2663f33ec18d |
| sony-fe-20mm-f18-g-f5.6-ref | ca355ce3e19a7e6e41d293d0624df8b0477a45ec3d6ba89cb33dd9a65f67b5da |
| sony-fe-20mm-f18-g-f5.6-photopic | e8caf86b51b05e49385ff56ba1d2fd8e25327ea36f77785305cc9fde44a105bc |
| sony-fe-20mm-f18-g-f5.6-best-ref | 74a2416cb466a94854d8976b2f788097ce8387bd58a538997371b607135f83b7 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | fa585305f7b7dd8bd979b2361918e582ba9436968bfec7556c4c7009ffbb82c8 |
| sony-fe-20mm-f18-g-f11-ref | 72e4c5b839a2e628560e069e408341781e5e8dcb50ec7a18a65e1e01be8c35da |
| sony-fe-20mm-f18-g-f11-photopic | 54fc7ff455da62e417dbb43a3238fd29395efa6deaca8745626415146428cfe5 |
| sony-fe-20mm-f18-g-f11-best-ref | 5146d32441031213c3bc7aee41c0484572deda246eb0a3672189a9858f2481fb |
| sony-fe-20mm-f18-g-f11-best-photopic | 41d5fda136cd146c1a1ad49a97c6407de0f74403f5e17c108711369e3745f9b7 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 913940f673fca99b15d477593aa10e0932b7d55bd55abb45fc0efe4be43d76db |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 256f65678573fe0555d6a93eb2eee8bd1ed242d27c95589c84eccc63da23d2d3 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | b48685f5c0be5f13bbf272166f6b66c0f0f23ceab0fe0e492dd1935bab44d5ca |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 5995f5b6bb8a6b4323e972061e74f992cbe682f0011467b66c3b20a9b041a456 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 440403e6acb4f563e20e83d20f4bdf09894765e8a4dc080ead82aa5c0afa09ac |
| sony-fe-400mm-f28-gm-oss-f11-photopic | f7542d71ec7dec46c61fec30e604d10dc33893d5c245b97b60ce87f9c742ddc2 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 411d4c0c1f66a286e3d942ea91924a9a11e871638ac37906d27c89ba996de910 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 75f79a2c148806e1968a75123e111e8bc328c701eaf73f69bd59c63d7d24bdcc |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 7234624d9e180264e0f5e45552e8631fc1b8c9e41f86061a5aa6ae7d61d3161d |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 6e311d5232f60db6dd439c2b54ab26e31957c48547245c09854ee5bf51ee7176 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 4d250fa32976fa524f5be74807586a1fd85b5fdfb99821053b115c92b1b3ce9f |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 63f399c43a2cb8ad0e7af321dcadb60a4638bc1afb8fa93d9db21076f97ddd04 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | afa106a51bdec89d419dd8ae11a3bae3a0c0e41b1997ef77137b4b5d3509dfa4 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 847c169f18f40cc63f0cadded7c1ebde458a6b2a3285143d9e0266515330e3e8 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | cbe645ff996acb36602882677a89c3e22f05320d52b3c6afa56f4fa53472a2c2 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 4197a0931bd145c11f5e2fde6192ba7ed39f52bafa234ba9749125d9f1aebfba |
| nikon-z-24-70f4s-f5.6-ref-wide | 43d293e0d03b0d81ac731903ea7291eaf268ffb49de710bc7e70bbc1cba14609 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 5074f7ae6e0a91f3e61e4dd5decb985875b0449b66fe1c7824ae1f26a336cd09 |
| nikon-z-24-70f4s-f5.6-ref-tele | d146abd7b30bd4b6202661e89d3f2a6d12ce3a21a69296c31151a5d9203f1b8f |
| nikon-z-24-70f4s-f5.6-photopic-wide | bd7e3e810de56bda5c27fd1a29485bed6acff93eb8295cacb7accc9d93159e95 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | ebf5b2c2259fa9616f0a39916806ae42f44678a66735d79242e53fa349670b38 |
| nikon-z-24-70f4s-f5.6-photopic-tele | c46fe519bf959c6fdec85ad849b3926e89b9f3f1360aaa23e55d78436e7fefaf |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 4623f24f37c3ff3ee04b106af1c1c1f32c5021eff3e95ef756e16efa15f52e2e |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | ef7d7cd7188c5cdcbd6dab26d098fe0594e95365ade39ac9d69039a9e0f5e97c |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 631f2e8a60a61fcb0269953842a24aa45c23bb22f59da2864216f015e09fde62 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 59f1ea173aea03b0c488b26bdc049b72581318d81991c278e737a367795ebd9c |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 18f8f36f88edb46a5aa1c5eed1487fae139f0cdf4e3bf21a3fd7948029958d15 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | bff5282f4e28c431214b0b284850e83fafe7fd78f9ee8ed725aecf5d3f24962c |
| nikon-z-24-70f4s-f11-ref-wide | 21482843518999fe0dcbfe3267b92c6f40591d2491c58df828a770245defd9aa |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | a3f86b1b281dd0ad9e0aacacb290b65b8d99e112090a5f9fa40f6bf6cd265618 |
| nikon-z-24-70f4s-f11-ref-tele | b29ffec9f36b8adfe171446f19817942c84d38d5b4d11dc13c316e9a405500c3 |
| nikon-z-24-70f4s-f11-photopic-wide | 6eb129e3994f357248fde926dca0232eb4b23a6449f3855813dc8db8faa03a37 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | b1f1d5850e6a312d32215e16ba93a1878edf3dee4697cba64fe0a85b8856c873 |
| nikon-z-24-70f4s-f11-photopic-tele | 46b987a1461cdab4a5edd70b39eb90ae5c87393aeb96cc1947de21bc3fc74df8 |
| nikon-z-24-70f4s-f11-best-ref-wide | e28b742b29485ec7aadb5f1ca761b6a20835778f28768fb363a7f92c05f8d352 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | e7f9d2bf7379571ac1de0e31d6ab106e54dc1b55ffa50e2f5209d5669b9d0f5a |
| nikon-z-24-70f4s-f11-best-ref-tele | b0ad205f7abced19915254b04a91554059b5bbd599e4b57a495834f4434de6ab |
| nikon-z-24-70f4s-f11-best-photopic-wide | f8f8e0c2af46c911a7c88fc30a9a39fa4cd590519129b7e7e531f94b78426370 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 572b454fecdbc65fa7d8c7a5cd70fa2fab7bc9557f21038aaaec9bda0e505ebe |
| nikon-z-24-70f4s-f11-best-photopic-tele | 79277a774f5efb9a724d2732aec6a147be6a104bb19054f82160ad0d1d8923de |
| nikon-z-mc-105f28-f5.6-ref | 062545109261a8892b1d6430caad6d8c078b9ab526a5dee8834102ee243599c1 |
| nikon-z-mc-105f28-f5.6-photopic | a1773eb592532e21fd5adb73d617d6d31b555cc832107df8be56caf96d4d69dc |
| nikon-z-mc-105f28-f5.6-best-ref | ee3776a7aef5a826dda346d40320c50e8fd963e49d08fa5dd44c680701107a87 |
| nikon-z-mc-105f28-f5.6-best-photopic | dab98e82bdb584faa367a4288f7517f7f4a182767982a10401934951f9d2a996 |
| nikon-z-mc-105f28-f11-ref | b29a367787045441bf4b8d9eb6141a0ef1c60e62e74efd9e5070aced5fa89c7d |
| nikon-z-mc-105f28-f11-photopic | e89e56f141f3c8a559162e5965025b6d59e996da986c551fa16935b0c14306a9 |
| nikon-z-mc-105f28-f11-best-ref | 6d6d629ad6bdd902600b617c5b47b2d9fa6de48d5886f22b835a9a4ad6c52318 |
| nikon-z-mc-105f28-f11-best-photopic | 77e9760dcd80b1d050e34585fb4ece553d6dea57f57ff09b93c6d3345de869e4 |
| nikon-z-135f18-plena-f5.6-ref | 0e14dcf45d101f3ffc4f088aa9e195dd770df07b92ecd4547b3713741457072c |
| nikon-z-135f18-plena-f5.6-photopic | b13e7bef38fd640c35817c7bed1bf1001a8a4dbd1c472dbf548f5fa1aa212c44 |
| nikon-z-135f18-plena-f5.6-best-ref | 94c5f6e4885db9f33d61809c890835970e66a11058683d13e068d5436a29727d |
| nikon-z-135f18-plena-f5.6-best-photopic | 0820824abdf7085c717fad4d38120b817df7761c01e7456d589d5eed7ca699f5 |
| nikon-z-135f18-plena-f11-ref | 187718db3b86895a0664d0d39aaa844c1b356c072cfb0df871c09ec8b2f99de0 |
| nikon-z-135f18-plena-f11-photopic | 65f295b75a1af7635f36afad1dd2ea2338f902c9c91e16f0d156de8ce4449a7b |
| nikon-z-135f18-plena-f11-best-ref | db91461d9b73907a5a56ce65bfe94aa2fca85755f1ec738968b2e0a6fa40dead |
| nikon-z-135f18-plena-f11-best-photopic | ec9d4eb91ca6d40ad63a8b6caa7af24ed753672cef1c5105cb1b3a68b600758d |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | ac930dee61058699460a7a827a03cf9ff9b9c621a22a7ece17029a93d8989e8f |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1507e90fb8d06cc5bedafcfe3ac51ba3afb45f9b6c5f5f25d337933b2d4d0e44 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 268c5840d37ec93f9e47bb19527b04e2c7ea02ae5d9d4fb1bf4e180f53f74e19 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | c685d8297b0209846e3441db9960938ae1cb246f9030e6270e015c9d02f10b72 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 44edcde6e319adf1a5b2b0f0b8d9ddb7aec872990e4d61e2198bba8fbed1a832 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 501110ed0f4ed088579f6176df5bedeca1a303da7e50014d892a075b8206e08e |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | dbb16f8147e05b2d1232133b6ad8c92ecdc72f136450cd93efa139220a7718e8 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | e8fa3d07ee50d20e52941b113dbfd39ae157d7486832ec7f6bef1d3ff6f82cd9 |
| nikon-z-24-70f4s-open-ref-wide | 327403ce09e2fc94b6122c0799aba12156ffad3f9b726829aeccb18d31efd709 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 65305725fdb42f1b1ebc1517e989b060cf9412ff14921b29478818d7331fa746 |
| nikon-z-24-70f4s-open-ref-tele | ab9c8205a728d127b2ec6bf4b38f868de47d255de7807c917d0ba35ec4b8ca24 |
| nikon-z-24-70f4s-open-photopic-wide | 06eff99a7dc852d126aa09c9eea6d4e7b19d5fc77d79c520b5624c3211295979 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 683328e379b17b2a7147fc88d38fe28c131a7a4f8e917d3925fcb66684ebe748 |
| nikon-z-24-70f4s-open-photopic-tele | e7c0aa4bf2ee5a2b0afc8ac68e8a6115e586e7adcb01a741e880c320dba248bf |
| nikon-z-24-70f4s-open-best-ref-wide | 11939c22f49c3c0184e3620ffdb796a7bb13ecaf98c933f746a51d75f09488a4 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 821c70a576016f11658e60a31796a8de48e1c395be9d3e9c92fdb9a19c01e498 |
| nikon-z-24-70f4s-open-best-ref-tele | d8144040e169d3e83d1feaada545bce52371252135182e0436f63c9de0442f4b |
| nikon-z-24-70f4s-open-best-photopic-wide | 303e31f5ade720acd67d934169c6cc0f77527d54bb806e7c6d245723889ffbf9 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 972eff8a701d87e8063a84908b06e0303adea5dc94a821924e069940b1f92c5a |
| nikon-z-24-70f4s-open-best-photopic-tele | 07e3cb882e9dac1ec3f9ef22754ae4b0abbcddf4373de3e7a560a1cc23015abf |
| nikon-z-24-70f4s-f8-ref-wide | a5957b6f15c089d50c0a644948511de4052644c6c1fa3863d7d893f5fc53a63b |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 39044dfb4336cc45eb0293c50592f9c204393fafb2bb07a8d5c70d123fd390d5 |
| nikon-z-24-70f4s-f8-ref-tele | c1783e5c5de7f829e47a84352531ef6c6d2d9d938508504693b20ff52616db71 |
| nikon-z-24-70f4s-f8-photopic-wide | f849b03951a2a6d4ebd62a8f76d30086bd16d9f0b1782b7bca082f79f7b36ec9 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | d08722c2efdf07ab213db947c9fa7203c3054e1fa873d3a0050ea5397eb42166 |
| nikon-z-24-70f4s-f8-photopic-tele | 84b4c2f3410b8bce36fa7d5cf994d9a2d89c1d1aad226bcf3f920f3fa2faed12 |
| nikon-z-24-70f4s-f8-best-ref-wide | 61d7b43c1a213663dfc248e7d8a2c2238912e4ff623656745b2ad5fdf63f167b |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1543dbf071b51f3bd33c3d82a4b721040d6048370867e54c1091a4f83f2cfdf5 |
| nikon-z-24-70f4s-f8-best-ref-tele | 16592d7e0ff140de7ac9fe6d32bb7c40e27440d5b5896ce4b4d9d668fe4a3c6e |
| nikon-z-24-70f4s-f8-best-photopic-wide | 8091381339ef5c9edaa507b3a69a3a4ab2000d06d3cec8914839e09472796a4c |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | ba444ae31a6a3af20b7ec8bda42d41629564af7a67aa7b641c4d44f767ef899c |
| nikon-z-24-70f4s-f8-best-photopic-tele | 97efc252e05cc6507f706e85b7b58a11288c1466fa91949681772154821a0a3e |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r0 | system.describe | 128 | 128 | lv – optiland | 128 PASS | 128 PASS |
| r0 | system.describe | 128 | 128 | lv – ref | 128 PASS | 128 PASS |
| r0 | system.describe | 128 | 128 | optiland – ref | 128 PASS | 128 PASS |
| r1 | paraxial.first-order | 128 | 128 | lv – optiland | 128 PASS | 128 PASS |
| r1 | paraxial.first-order | 128 | 128 | lv – ref | 128 PASS | 128 PASS |
| r1 | paraxial.first-order | 128 | 128 | optiland – ref | 128 PASS | 128 PASS |
| r2 | rays.trace | 128 | 1152 | lv – optiland | 128 PASS | 1152 PASS |
| r2 | rays.trace | 128 | 1152 | lv – ref | 128 PASS | 1152 PASS |
| r2 | rays.trace | 128 | 1152 | optiland – ref | 128 PASS | 1152 PASS |
| r3 | rays.trace | 128 | 1152 | lv – optiland | 128 PASS | 1152 PASS |
| r3 | rays.trace | 128 | 1152 | lv – ref | 128 PASS | 1152 PASS |
| r3 | rays.trace | 128 | 1152 | optiland – ref | 128 PASS | 1152 PASS |
| r4 | rays.trace | 128 | 384 | lv – optiland | 128 PASS | 384 PASS |
| r4 | rays.trace | 128 | 384 | lv – ref | 128 PASS | 384 PASS |
| r4 | rays.trace | 128 | 384 | optiland – ref | 128 PASS | 384 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r0 | lv | 128 ok |
| r0 | optiland | 128 ok |
| r0 | ref | 128 ok |
| r1 | lv | 128 ok |
| r1 | optiland | 128 ok |
| r1 | ref | 128 ok |
| r2 | lv | 128 ok |
| r2 | optiland | 128 ok |
| r2 | ref | 128 ok |
| r3 | lv | 128 ok |
| r3 | optiland | 128 ok |
| r3 | ref | 128 ok |
| r4 | lv | 128 ok |
| r4 | optiland | 128 ok |
| r4 | ref | 128 ok |

## r0

Quantity `system.describe`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – optiland | sag.maxScaled (≤ 1.00e-12) | 3.94e-16 | nikon-z-24-70f4s-f5.6-ref-wide | sample 6, surface 10 |
| lv – optiland | sag.maxAbs [mm] | 3.55e-15 | sony-fe-400mm-f28-gm-oss-f5.6-ref | sample 8, surface 13 |
| lv – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| lv – ref | sag.maxScaled (≤ 1.00e-12) | 3.97e-16 | sony-fe-20mm-f18-g-f5.6-ref | sample 8, surface 6 |
| lv – ref | sag.maxAbs [mm] | 3.55e-15 | sony-fe-400mm-f28-gm-oss-f5.6-ref | sample 8, surface 13 |
| optiland – ref | layout.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | shape.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | aperture.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | index.mismatches (≤ 0 elements) | 0 | — | — |
| optiland – ref | sag.maxScaled (≤ 1.00e-12) | 4.51e-16 | sony-fe-20mm-f18-g-f5.6-ref | sample 6, surface 0 |
| optiland – ref | sag.maxAbs [mm] | 1.78e-15 | canon-ef-135-f2l-usm-f5.6-ref | sample 8, surface 8 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | PASS: sag.maxScaled 3.05e-16 | PASS: sag.maxScaled 2.51e-16 | PASS: sag.maxScaled 2.85e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | PASS: sag.maxScaled 2.16e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 2.47e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 3.29e-16 | PASS: sag.maxScaled 3.71e-16 |
| nikkor-z50f12-f5.6-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f5.6-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f5.6-best-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f11-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f11-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f11-best-ref | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| nikkor-z50f12-f11-best-photopic | 1 | PASS: sag.maxScaled 3.48e-16 | PASS: sag.maxScaled 3.90e-16 | PASS: sag.maxScaled 3.90e-16 |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | PASS: sag.maxScaled 3.86e-16 | PASS: sag.maxScaled 3.97e-16 | PASS: sag.maxScaled 4.51e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | PASS: sag.maxScaled 2.83e-16 | PASS: sag.maxScaled 2.25e-16 | PASS: sag.maxScaled 3.20e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.10e-16 | PASS: sag.maxScaled 4.00e-16 |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-mc-105f28-f5.6-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-best-ref | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-best-photopic | 1 | PASS: sag.maxScaled 1.95e-16 | PASS: sag.maxScaled 2.11e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-f5.6-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.74e-16 | PASS: sag.maxScaled 2.59e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | PASS: sag.maxScaled 2.22e-16 | PASS: sag.maxScaled 2.26e-16 | PASS: sag.maxScaled 3.33e-16 |
| nikon-z-24-70f4s-open-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | PASS: sag.maxScaled 3.94e-16 | PASS: sag.maxScaled 2.00e-16 | PASS: sag.maxScaled 3.94e-16 |

## r1

Quantity `paraxial.first-order`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | firstOrder.maxAbs (≤ 1.00e-9 mm) | 3.87e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity frontFocalZ |
| lv – optiland | pupilZ.maxScaled (≤ 1.00e-9 mm) | 7.96e-13 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, quantity entrancePupilZ |
| lv – optiland | pupilZ.maxAbs [mm] | 7.96e-13 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, quantity entrancePupilZ |
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 2.49e-14 | canon-ef-135-f2l-usm-f5.6-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 2.49e-14 | canon-ef-135-f2l-usm-f5.6-best-photopic | line 4, quantity exitPupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.05e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 3.41e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 3.41e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 2.13e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 2.13e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, quantity entrancePupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 3.87e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.02e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.02e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 2.84e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, quantity entrancePupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 2.84e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f11-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f11-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 5.33e-14 mm |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 6.04e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | PASS: pupilZ.maxScaled 7.11e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | PASS: pupilZ.maxScaled 8.53e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikkor-z50f12-f5.6-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 4.26e-14 mm |
| nikkor-z50f12-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f11-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f11-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f11-best-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 8.88e-15 mm |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 1.95e-14 mm |
| sony-fe-20mm-f18-g-f11-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f11-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 1.95e-14 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | PASS: firstOrder.maxAbs 1.71e-12 mm | PASS: pupilZ.maxScaled 2.27e-13 mm | PASS: firstOrder.maxAbs 1.71e-12 mm |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 3.87e-12 mm | PASS: firstOrder.maxAbs 2.05e-12 mm | PASS: firstOrder.maxAbs 3.87e-12 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | PASS: pupilZ.maxScaled 4.26e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 1.28e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 9.95e-14 mm |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 1.78e-14 mm |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-f11-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f11-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-mc-105f28-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f11-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f11-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-mc-105f28-f11-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 8.53e-14 mm |
| nikon-z-mc-105f28-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 2.13e-13 mm | PASS: firstOrder.maxAbs 1.71e-13 mm |
| nikon-z-135f18-plena-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f11-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f11-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| nikon-z-135f18-plena-f11-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| nikon-z-135f18-plena-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 3.41e-13 mm | PASS: firstOrder.maxAbs 2.84e-13 mm | PASS: firstOrder.maxAbs 3.98e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.49e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | PASS: firstOrder.maxAbs 8.17e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 1.07e-13 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 6.04e-14 mm | PASS: firstOrder.maxAbs 3.20e-14 mm | PASS: firstOrder.maxAbs 4.62e-14 mm |
| nikon-z-24-70f4s-open-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-open-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-open-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-open-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 1.78e-14 mm |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-f8-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f8-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.21e-13 mm | PASS: firstOrder.maxAbs 4.97e-14 mm | PASS: firstOrder.maxAbs 1.21e-13 mm |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.44e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 1.17e-12 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 1, ray 1023, surface 20 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 1.55e-14 | nikon-z-24-70f4s-open-ref-wide | field 4.33e1, line 0, ray 663 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 7.18e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | field 4.33e1, line 3, ray 1000 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 888164 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.19e-12 | nikon-z-24-70f4s-f8-photopic-wide | field 2.42e1, line 1, ray 552, surface 10 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.42e-14 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 1, ray 590 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 7.87e-13 | nikon-z-24-70f4s-open-photopic-zoom0.5 | field 2.40e1, line 1, ray 447 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 888164 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.20e-12 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 0, ray 977, surface 20 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 1.42e-14 | nikon-z-24-70f4s-f11-photopic-wide | field 4.33e1, line 1, ray 428 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 7.59e-13 | nikon-z-24-70f4s-open-photopic-zoom0.5 | field 2.40e1, line 1, ray 447 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 888164 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: landing.maxDistance 1.17e-13 mm | PASS: landing.maxDistance 8.61e-14 mm | PASS: hits.maxDistance 1.04e-13 mm | 2369 / 1378 / 0 | 2369 / 1378 / 0 | 2369 / 1378 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 15 | PASS: hits.maxDistance 1.36e-13 mm | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 1.50e-13 mm | 11865 / 6870 / 0 | 11865 / 6870 / 0 | 11865 / 6870 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 8.60e-14 mm | PASS: hits.maxDistance 1.04e-13 mm | 2369 / 1378 / 0 | 2369 / 1378 / 0 | 2369 / 1378 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.36e-13 mm | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 1.50e-13 mm | 11865 / 6870 / 0 | 11865 / 6870 / 0 | 11865 / 6870 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: hits.maxDistance 9.42e-14 mm | PASS: landing.maxDistance 9.24e-14 mm | PASS: hits.maxDistance 1.06e-13 mm | 2469 / 1422 / 0 | 2469 / 1422 / 0 | 2469 / 1422 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 15 | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | 12355 / 7100 / 0 | 12355 / 7100 / 0 | 12355 / 7100 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: hits.maxDistance 9.42e-14 mm | PASS: landing.maxDistance 8.88e-14 mm | PASS: hits.maxDistance 1.06e-13 mm | 2469 / 1422 / 0 | 2469 / 1422 / 0 | 2469 / 1422 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 15 | PASS: hits.maxDistance 1.29e-13 mm | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | 12355 / 7100 / 0 | 12355 / 7100 / 0 | 12355 / 7100 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: landing.maxDistance 1.15e-13 mm | PASS: landing.maxDistance 6.08e-14 mm | PASS: landing.maxDistance 1.07e-13 mm | 2415 / 1476 / 0 | 2415 / 1476 / 0 | 2415 / 1476 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 15 | PASS: landing.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 8.53e-14 mm | PASS: landing.maxDistance 1.10e-13 mm | 12101 / 7354 / 0 | 12101 / 7354 / 0 | 12101 / 7354 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.18e-13 mm | PASS: landing.maxDistance 6.05e-14 mm | PASS: landing.maxDistance 1.07e-13 mm | 2415 / 1476 / 0 | 2415 / 1476 / 0 | 2415 / 1476 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 8.53e-14 mm | PASS: landing.maxDistance 1.10e-13 mm | 12101 / 7354 / 0 | 12101 / 7354 / 0 | 12101 / 7354 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 7.11e-14 mm | PASS: hits.maxDistance 9.59e-14 mm | 2429 / 1462 / 0 | 2429 / 1462 / 0 | 2429 / 1462 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 15 | PASS: landing.maxDistance 9.96e-14 mm | PASS: landing.maxDistance 8.54e-14 mm | PASS: landing.maxDistance 1.10e-13 mm | 12155 / 7300 / 0 | 12155 / 7300 / 0 | 12155 / 7300 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 6.75e-14 mm | PASS: landing.maxDistance 9.95e-14 mm | 2429 / 1462 / 0 | 2429 / 1462 / 0 | 2429 / 1462 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 15 | PASS: landing.maxDistance 9.61e-14 mm | PASS: landing.maxDistance 8.54e-14 mm | PASS: landing.maxDistance 1.14e-13 mm | 12155 / 7300 / 0 | 12155 / 7300 / 0 | 12155 / 7300 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: hits.maxDistance 1.19e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2141 / 1430 / 0 | 2141 / 1430 / 0 | 2141 / 1430 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 10741 / 7114 / 0 | 10741 / 7114 / 0 | 10741 / 7114 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: hits.maxDistance 1.19e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2141 / 1430 / 0 | 2141 / 1430 / 0 | 2141 / 1430 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 10741 / 7114 / 0 | 10741 / 7114 / 0 | 10741 / 7114 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: hits.maxDistance 1.40e-13 mm | PASS: hits.maxDistance 1.84e-13 mm | PASS: hits.maxDistance 1.72e-13 mm | 2187 / 1544 / 0 | 2187 / 1544 / 0 | 2187 / 1544 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 15 | PASS: hits.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 2.03e-13 mm | PASS: hits.maxDistance 2.21e-13 mm | 11013 / 7642 / 0 | 11013 / 7642 / 0 | 11013 / 7642 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: hits.maxDistance 1.40e-13 mm | PASS: hits.maxDistance 1.84e-13 mm | PASS: hits.maxDistance 1.72e-13 mm | 2187 / 1544 / 0 | 2187 / 1544 / 0 | 2187 / 1544 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 15 | PASS: hits.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 2.03e-13 mm | PASS: hits.maxDistance 2.21e-13 mm | 11013 / 7642 / 0 | 11013 / 7642 / 0 | 11013 / 7642 / 0 |
| nikkor-z50f12-f5.6-ref | 3 | PASS: hits.maxDistance 8.45e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2457 / 1434 / 0 | 2457 / 1434 / 0 | 2457 / 1434 / 0 |
| nikkor-z50f12-f5.6-photopic | 15 | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 12283 / 7172 / 0 | 12283 / 7172 / 0 | 12283 / 7172 / 0 |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: hits.maxDistance 8.45e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 2457 / 1434 / 0 | 2457 / 1434 / 0 | 2457 / 1434 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 12283 / 7172 / 0 | 12283 / 7172 / 0 | 12283 / 7172 / 0 |
| nikkor-z50f12-f11-ref | 3 | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 6.25e-13 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikkor-z50f12-f11-photopic | 15 | PASS: hits.maxDistance 9.38e-13 mm | PASS: hits.maxDistance 9.38e-13 mm | PASS: hits.maxDistance 6.54e-13 mm | 12285 / 7170 / 0 | 12285 / 7170 / 0 | 12285 / 7170 / 0 |
| nikkor-z50f12-f11-best-ref | 3 | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 6.25e-13 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikkor-z50f12-f11-best-photopic | 15 | PASS: hits.maxDistance 9.38e-13 mm | PASS: hits.maxDistance 9.38e-13 mm | PASS: hits.maxDistance 6.54e-13 mm | 12285 / 7170 / 0 | 12285 / 7170 / 0 | 12285 / 7170 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: hits.maxDistance 2.98e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2239 / 1428 / 0 | 2239 / 1428 / 0 | 2239 / 1428 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 11153 / 7182 / 0 | 11153 / 7182 / 0 | 11153 / 7182 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: hits.maxDistance 2.98e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2239 / 1428 / 0 | 2239 / 1428 / 0 | 2239 / 1428 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 11153 / 7182 / 0 | 11153 / 7182 / 0 | 11153 / 7182 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: landing.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 7.98e-13 mm | PASS: hits.maxDistance 8.06e-13 mm | 2255 / 1412 / 0 | 2255 / 1412 / 0 | 2255 / 1412 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 15 | PASS: landing.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 8.34e-13 mm | PASS: hits.maxDistance 8.19e-13 mm | 11235 / 7100 / 0 | 11235 / 7100 / 0 | 11235 / 7100 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 7.98e-13 mm | PASS: hits.maxDistance 8.06e-13 mm | 2255 / 1412 / 0 | 2255 / 1412 / 0 | 2255 / 1412 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 15 | PASS: landing.maxDistance 1.49e-13 mm | PASS: hits.maxDistance 8.34e-13 mm | PASS: hits.maxDistance 8.19e-13 mm | 11235 / 7100 / 0 | 11235 / 7100 / 0 | 11235 / 7100 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: landing.maxDistance 2.92e-13 mm | PASS: landing.maxDistance 2.24e-13 mm | PASS: landing.maxDistance 3.12e-13 mm | 2293 / 1382 / 0 | 2293 / 1382 / 0 | 2293 / 1382 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 15 | PASS: landing.maxDistance 4.06e-13 mm | PASS: landing.maxDistance 2.98e-13 mm | PASS: landing.maxDistance 4.48e-13 mm | 11489 / 6886 / 0 | 11489 / 6886 / 0 | 11489 / 6886 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: landing.maxDistance 2.92e-13 mm | PASS: landing.maxDistance 2.24e-13 mm | PASS: landing.maxDistance 3.15e-13 mm | 2293 / 1382 / 0 | 2293 / 1382 / 0 | 2293 / 1382 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 15 | PASS: landing.maxDistance 4.06e-13 mm | PASS: landing.maxDistance 2.98e-13 mm | PASS: landing.maxDistance 4.51e-13 mm | 11489 / 6886 / 0 | 11489 / 6886 / 0 | 11489 / 6886 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: landing.maxDistance 2.87e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | PASS: landing.maxDistance 2.91e-13 mm | 2427 / 1464 / 0 | 2427 / 1464 / 0 | 2427 / 1464 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 15 | PASS: landing.maxDistance 3.58e-13 mm | PASS: landing.maxDistance 2.73e-13 mm | PASS: landing.maxDistance 3.52e-13 mm | 12143 / 7312 / 0 | 12143 / 7312 / 0 | 12143 / 7312 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: landing.maxDistance 2.87e-13 mm | PASS: landing.maxDistance 2.00e-13 mm | PASS: landing.maxDistance 2.88e-13 mm | 2427 / 1464 / 0 | 2427 / 1464 / 0 | 2427 / 1464 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 15 | PASS: landing.maxDistance 3.55e-13 mm | PASS: landing.maxDistance 2.77e-13 mm | PASS: landing.maxDistance 3.55e-13 mm | 12143 / 7312 / 0 | 12143 / 7312 / 0 | 12143 / 7312 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: landing.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 2.01e-13 mm | 2157 / 1374 / 0 | 2157 / 1374 / 0 | 2157 / 1374 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 15 | PASS: landing.maxDistance 1.94e-13 mm | PASS: landing.maxDistance 1.43e-13 mm | PASS: landing.maxDistance 2.13e-13 mm | 10843 / 6812 / 0 | 10843 / 6812 / 0 | 10843 / 6812 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.81e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 2.01e-13 mm | 2157 / 1374 / 0 | 2157 / 1374 / 0 | 2157 / 1374 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.93e-13 mm | PASS: landing.maxDistance 1.39e-13 mm | PASS: landing.maxDistance 2.13e-13 mm | 10843 / 6812 / 0 | 10843 / 6812 / 0 | 10843 / 6812 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: landing.maxDistance 1.57e-13 mm | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 1.96e-13 mm | 2359 / 1388 / 0 | 2359 / 1388 / 0 | 2359 / 1388 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 15 | PASS: landing.maxDistance 1.99e-13 mm | PASS: landing.maxDistance 1.53e-13 mm | PASS: landing.maxDistance 2.35e-13 mm | 11801 / 6934 / 0 | 11801 / 6934 / 0 | 11801 / 6934 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: landing.maxDistance 1.60e-13 mm | PASS: landing.maxDistance 1.24e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 2359 / 1388 / 0 | 2359 / 1388 / 0 | 2359 / 1388 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 15 | PASS: landing.maxDistance 1.99e-13 mm | PASS: landing.maxDistance 1.53e-13 mm | PASS: landing.maxDistance 2.35e-13 mm | 11801 / 6934 / 0 | 11801 / 6934 / 0 | 11801 / 6934 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2305 / 1394 / 0 | 2305 / 1394 / 0 | 2305 / 1394 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: landing.maxDistance 1.14e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 2499 / 1320 / 0 | 2499 / 1320 / 0 | 2499 / 1320 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: landing.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2263 / 1340 / 0 | 2263 / 1340 / 0 | 2263 / 1340 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 15 | PASS: hits.maxDistance 1.16e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | PASS: hits.maxDistance 1.18e-12 mm | 10829 / 7126 / 0 | 10829 / 7126 / 0 | 10829 / 7126 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12437 / 6658 / 0 | 12437 / 6658 / 0 | 12437 / 6658 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 15 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 11309 / 6706 / 0 | 11309 / 6706 / 0 | 11309 / 6706 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2305 / 1394 / 0 | 2305 / 1394 / 0 | 2305 / 1394 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: landing.maxDistance 1.14e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 2499 / 1320 / 0 | 2499 / 1320 / 0 | 2499 / 1320 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: landing.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2263 / 1340 / 0 | 2263 / 1340 / 0 | 2263 / 1340 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 15 | PASS: hits.maxDistance 1.16e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | PASS: hits.maxDistance 1.18e-12 mm | 10829 / 7126 / 0 | 10829 / 7126 / 0 | 10829 / 7126 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12437 / 6658 / 0 | 12437 / 6658 / 0 | 12437 / 6658 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 15 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 11309 / 6706 / 0 | 11309 / 6706 / 0 | 11309 / 6706 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 2121 / 1394 / 0 | 2121 / 1394 / 0 | 2121 / 1394 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 2407 / 1340 / 0 | 2407 / 1340 / 0 | 2407 / 1340 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.90e-13 mm | 2415 / 1404 / 0 | 2415 / 1404 / 0 | 2415 / 1404 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 15 | PASS: hits.maxDistance 9.41e-13 mm | PASS: hits.maxDistance 1.13e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | 10579 / 6996 / 0 | 10579 / 6996 / 0 | 10579 / 6996 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 12017 / 6718 / 0 | 12017 / 6718 / 0 | 12017 / 6718 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 15 | PASS: landing.maxDistance 1.37e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 12005 / 7090 / 0 | 12005 / 7090 / 0 | 12005 / 7090 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 2121 / 1394 / 0 | 2121 / 1394 / 0 | 2121 / 1394 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 2407 / 1340 / 0 | 2407 / 1340 / 0 | 2407 / 1340 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.90e-13 mm | 2415 / 1404 / 0 | 2415 / 1404 / 0 | 2415 / 1404 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 15 | PASS: hits.maxDistance 9.41e-13 mm | PASS: hits.maxDistance 1.13e-12 mm | PASS: hits.maxDistance 1.15e-12 mm | 10579 / 6996 / 0 | 10579 / 6996 / 0 | 10579 / 6996 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 12017 / 6718 / 0 | 12017 / 6718 / 0 | 12017 / 6718 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 15 | PASS: landing.maxDistance 1.37e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 12005 / 7090 / 0 | 12005 / 7090 / 0 | 12005 / 7090 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: hits.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 8.29e-13 mm | PASS: hits.maxDistance 8.30e-13 mm | 2349 / 1326 / 0 | 2349 / 1326 / 0 | 2349 / 1326 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 15 | PASS: landing.maxDistance 1.66e-13 mm | PASS: hits.maxDistance 8.58e-13 mm | PASS: hits.maxDistance 8.30e-13 mm | 11751 / 6624 / 0 | 11751 / 6624 / 0 | 11751 / 6624 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: hits.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 8.29e-13 mm | PASS: hits.maxDistance 8.30e-13 mm | 2349 / 1326 / 0 | 2349 / 1326 / 0 | 2349 / 1326 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.62e-13 mm | PASS: hits.maxDistance 8.58e-13 mm | PASS: hits.maxDistance 8.30e-13 mm | 11751 / 6624 / 0 | 11751 / 6624 / 0 | 11751 / 6624 / 0 |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: landing.maxDistance 1.53e-13 mm | PASS: landing.maxDistance 1.14e-13 mm | PASS: landing.maxDistance 1.42e-13 mm | 2313 / 1434 / 0 | 2313 / 1434 / 0 | 2313 / 1434 / 0 |
| nikon-z-mc-105f28-f11-photopic | 15 | PASS: hits.maxDistance 1.50e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 1.78e-13 mm | 11573 / 7162 / 0 | 11573 / 7162 / 0 | 11573 / 7162 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: landing.maxDistance 1.53e-13 mm | PASS: landing.maxDistance 1.11e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | 2313 / 1434 / 0 | 2313 / 1434 / 0 | 2313 / 1434 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 15 | PASS: hits.maxDistance 1.50e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 1.78e-13 mm | 11573 / 7162 / 0 | 11573 / 7162 / 0 | 11573 / 7162 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: landing.maxDistance 1.07e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2439 / 1452 / 0 | 2439 / 1452 / 0 | 2439 / 1452 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 15 | PASS: landing.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12217 / 7238 / 0 | 12217 / 7238 / 0 | 12217 / 7238 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.07e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2439 / 1452 / 0 | 2439 / 1452 / 0 | 2439 / 1452 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12217 / 7238 / 0 | 12217 / 7238 / 0 | 12217 / 7238 / 0 |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: landing.maxDistance 9.24e-14 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikon-z-135f18-plena-f11-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12303 / 7152 / 0 | 12303 / 7152 / 0 | 12303 / 7152 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: landing.maxDistance 8.88e-14 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2453 / 1438 / 0 | 2453 / 1438 / 0 | 2453 / 1438 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 12303 / 7152 / 0 | 12303 / 7152 / 0 | 12303 / 7152 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: hits.maxDistance 4.18e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2199 / 1332 / 0 | 2199 / 1332 / 0 | 2199 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 10983 / 6672 / 0 | 10983 / 6672 / 0 | 10983 / 6672 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: hits.maxDistance 4.18e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2199 / 1332 / 0 | 2199 / 1332 / 0 | 2199 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 10983 / 6672 / 0 | 10983 / 6672 / 0 | 10983 / 6672 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: landing.maxDistance 7.49e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2369 / 1306 / 0 | 2369 / 1306 / 0 | 2369 / 1306 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 15 | PASS: landing.maxDistance 7.82e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 11759 / 6616 / 0 | 11759 / 6616 / 0 | 11759 / 6616 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: landing.maxDistance 7.49e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2369 / 1306 / 0 | 2369 / 1306 / 0 | 2369 / 1306 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 15 | PASS: landing.maxDistance 7.82e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 11759 / 6616 / 0 | 11759 / 6616 / 0 | 11759 / 6616 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | 2215 / 1280 / 0 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: hits.maxDistance 9.28e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2311 / 1652 / 0 | 2311 / 1652 / 0 | 2311 / 1652 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.70e-13 mm | 1929 / 1242 / 0 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 11061 / 6774 / 0 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11551 / 8264 / 0 | 11551 / 8264 / 0 | 11551 / 8264 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 15 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 9631 / 6224 / 0 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: hits.maxDistance 1.12e-12 mm | PASS: hits.maxDistance 1.09e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | 2215 / 1280 / 0 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 9.28e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2311 / 1652 / 0 | 2311 / 1652 / 0 | 2311 / 1652 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.70e-13 mm | 1929 / 1242 / 0 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 11061 / 6774 / 0 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11551 / 8264 / 0 | 11551 / 8264 / 0 | 11551 / 8264 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 15 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 9631 / 6224 / 0 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: hits.maxDistance 1.08e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2117 / 1398 / 0 | 2117 / 1398 / 0 | 2117 / 1398 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.04e-13 mm | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 9.98e-13 mm | 2403 / 1344 / 0 | 2403 / 1344 / 0 | 2403 / 1344 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | 2391 / 1428 / 0 | 2391 / 1428 / 0 | 2391 / 1428 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 15 | PASS: hits.maxDistance 9.35e-13 mm | PASS: hits.maxDistance 1.19e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 10565 / 7010 / 0 | 10565 / 7010 / 0 | 10565 / 7010 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 9.38e-13 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 11981 / 6754 / 0 | 11981 / 6754 / 0 | 11981 / 6754 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 15 | PASS: landing.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11921 / 7174 / 0 | 11921 / 7174 / 0 | 11921 / 7174 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: hits.maxDistance 1.08e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 2117 / 1398 / 0 | 2117 / 1398 / 0 | 2117 / 1398 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.04e-13 mm | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 9.98e-13 mm | 2403 / 1344 / 0 | 2403 / 1344 / 0 | 2403 / 1344 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | 2391 / 1428 / 0 | 2391 / 1428 / 0 | 2391 / 1428 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 15 | PASS: hits.maxDistance 9.35e-13 mm | PASS: hits.maxDistance 1.19e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 10565 / 7010 / 0 | 10565 / 7010 / 0 | 10565 / 7010 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 9.38e-13 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 11981 / 6754 / 0 | 11981 / 6754 / 0 | 11981 / 6754 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 15 | PASS: landing.maxDistance 1.36e-13 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 11921 / 7174 / 0 | 11921 / 7174 / 0 | 11921 / 7174 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 1.89e-9 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 2, ray 978 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 1.89e-9 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 2, ray 978 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.06e-9 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 2, ray 978 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.67e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1, line 2, ray 458 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.67e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1, line 2, ray 458 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.84e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1, line 1, ray 645 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.72e-9 | nikon-z-24-70f4s-f5.6-photopic-wide | field 4.33e1, line 1, ray 491 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.72e-9 | nikon-z-24-70f4s-f5.6-photopic-wide | field 4.33e1, line 1, ray 491 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.60e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1, line 1, ray 613 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f5.6-photopic | 15 | PASS: opd.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.58e-10 waves |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opticalPathToImage.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 15 | PASS: opd.maxAbs 3.58e-10 waves | PASS: opd.maxAbs 2.80e-10 waves | PASS: opd.maxAbs 3.58e-10 waves |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f11-photopic | 15 | PASS: opticalPathToImage.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.58e-10 waves |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPathToImage.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f11-best-photopic | 15 | PASS: opd.maxAbs 3.26e-10 waves | PASS: opd.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.58e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPathToImage.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opticalPath.maxAbs 2.23e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPathToImage.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opticalPath.maxAbs 2.23e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 15 | PASS: opticalPath.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 2.33e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opd.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 15 | PASS: opticalPath.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 2.33e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 2.42e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 15 | PASS: opd.maxAbs 4.61e-10 waves | PASS: opd.maxAbs 4.46e-10 waves | PASS: opd.maxAbs 5.44e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPathToImage.maxAbs 2.90e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 15 | PASS: opd.maxAbs 4.46e-10 waves | PASS: opd.maxAbs 5.13e-10 waves | PASS: opd.maxAbs 6.05e-10 waves |
| nikkor-z50f12-f5.6-ref | 3 | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.94e-9 waves |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikkor-z50f12-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opd.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 1.94e-9 waves |
| nikkor-z50f12-f11-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 5.80e-10 waves |
| nikkor-z50f12-f11-photopic | 15 | PASS: opticalPath.maxAbs 1.00e-9 waves | PASS: opticalPath.maxAbs 9.68e-10 waves | PASS: opd.maxAbs 8.47e-10 waves |
| nikkor-z50f12-f11-best-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 5.80e-10 waves |
| nikkor-z50f12-f11-best-photopic | 15 | PASS: opticalPath.maxAbs 1.00e-9 waves | PASS: opticalPath.maxAbs 9.68e-10 waves | PASS: opd.maxAbs 8.47e-10 waves |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f5.6-photopic | 15 | PASS: opd.maxAbs 1.89e-9 waves | PASS: opticalPathToImage.maxAbs 1.94e-9 waves | PASS: opticalPathToImage.maxAbs 2.06e-9 waves |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves | PASS: opticalPathToImage.maxAbs 2.06e-9 waves |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.31e-9 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves |
| sony-fe-20mm-f18-g-f11-photopic | 15 | PASS: opd.maxAbs 4.61e-10 waves | PASS: opticalPathToImage.maxAbs 1.34e-9 waves | PASS: opticalPathToImage.maxAbs 1.39e-9 waves |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPathToImage.maxAbs 1.31e-9 waves | PASS: opticalPathToImage.maxAbs 1.26e-9 waves |
| sony-fe-20mm-f18-g-f11-best-photopic | 15 | PASS: opd.maxAbs 4.61e-10 waves | PASS: opticalPathToImage.maxAbs 1.33e-9 waves | PASS: opticalPathToImage.maxAbs 1.39e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 15 | PASS: opd.maxAbs 1.78e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.56e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 15 | PASS: opticalPath.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.56e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 15 | PASS: opticalPath.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.56e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 5.32e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 15 | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opticalPath.maxAbs 4.23e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 5.32e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 15 | PASS: opd.maxAbs 4.46e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 4.61e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 15 | PASS: opd.maxAbs 4.46e-10 waves | PASS: opd.maxAbs 5.44e-10 waves | PASS: opticalPathToImage.maxAbs 4.23e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 15 | PASS: opd.maxAbs 5.02e-10 waves | PASS: opd.maxAbs 6.05e-10 waves | PASS: opd.maxAbs 4.46e-10 waves |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-wide | 15 | PASS: opd.maxAbs 1.95e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 2.72e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-tele | 15 | PASS: opticalPath.maxAbs 9.18e-10 waves | PASS: opticalPath.maxAbs 2.24e-9 waves | PASS: opd.maxAbs 2.36e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.55e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 15 | PASS: opd.maxAbs 1.95e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 2.72e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 15 | PASS: opticalPath.maxAbs 9.18e-10 waves | PASS: opticalPath.maxAbs 2.24e-9 waves | PASS: opd.maxAbs 2.36e-9 waves |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 2.37e-9 waves | PASS: opticalPath.maxAbs 2.37e-9 waves |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: opd.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.40e-9 waves |
| nikon-z-24-70f4s-f11-photopic-wide | 15 | PASS: opd.maxAbs 1.21e-9 waves | PASS: opd.maxAbs 2.84e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 15 | PASS: opd.maxAbs 1.39e-9 waves | PASS: opd.maxAbs 2.30e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| nikon-z-24-70f4s-f11-photopic-tele | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.81e-9 waves | PASS: opticalPath.maxAbs 1.81e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 2.37e-9 waves | PASS: opticalPath.maxAbs 2.37e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: opd.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.40e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-wide | 15 | PASS: opd.maxAbs 1.21e-9 waves | PASS: opd.maxAbs 2.84e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 15 | PASS: opd.maxAbs 1.39e-9 waves | PASS: opd.maxAbs 2.30e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-tele | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.81e-9 waves | PASS: opticalPath.maxAbs 1.81e-9 waves |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 9.19e-10 waves |
| nikon-z-mc-105f28-f5.6-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 1.09e-9 waves | PASS: opd.maxAbs 1.09e-9 waves |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 9.19e-10 waves |
| nikon-z-mc-105f28-f5.6-best-photopic | 15 | PASS: opd.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 1.09e-9 waves | PASS: opd.maxAbs 1.09e-9 waves |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| nikon-z-mc-105f28-f11-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.44e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.23e-10 waves |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.87e-10 waves |
| nikon-z-mc-105f28-f11-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 5.44e-10 waves | PASS: opticalPath.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 4.23e-10 waves |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 9.67e-10 waves |
| nikon-z-135f18-plena-f5.6-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opd.maxAbs 1.34e-9 waves | PASS: opticalPath.maxAbs 1.27e-9 waves |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opd.maxAbs 9.67e-10 waves |
| nikon-z-135f18-plena-f5.6-best-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opd.maxAbs 1.34e-9 waves | PASS: opticalPath.maxAbs 1.27e-9 waves |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.11e-9 waves |
| nikon-z-135f18-plena-f11-photopic | 15 | PASS: opticalPath.maxAbs 1.03e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.39e-9 waves |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: opd.maxAbs 5.80e-10 waves | PASS: opticalPath.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.11e-9 waves |
| nikon-z-135f18-plena-f11-best-photopic | 15 | PASS: opticalPath.maxAbs 1.03e-9 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.39e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: opd.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.40e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opd.maxAbs 1.81e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: opd.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.43e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opd.maxAbs 1.81e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: opd.maxAbs 2.18e-10 waves | PASS: opd.maxAbs 1.43e-9 waves | PASS: opd.maxAbs 1.40e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 15 | PASS: opd.maxAbs 1.97e-10 waves | PASS: opd.maxAbs 1.72e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: opd.maxAbs 2.18e-10 waves | PASS: opd.maxAbs 1.43e-9 waves | PASS: opd.maxAbs 1.43e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 15 | PASS: opd.maxAbs 1.97e-10 waves | PASS: opd.maxAbs 1.72e-9 waves | PASS: opd.maxAbs 1.78e-9 waves |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 2.32e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: opd.maxAbs 1.11e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.98e-9 waves | PASS: opticalPath.maxAbs 1.84e-9 waves |
| nikon-z-24-70f4s-open-photopic-wide | 15 | PASS: opd.maxAbs 2.06e-9 waves | PASS: opd.maxAbs 2.62e-9 waves | PASS: opd.maxAbs 2.51e-9 waves |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.73e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 2.00e-9 waves |
| nikon-z-24-70f4s-open-photopic-tele | 15 | PASS: opd.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves | PASS: opd.maxAbs 2.12e-9 waves |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 2.32e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: opd.maxAbs 1.11e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.98e-9 waves | PASS: opticalPath.maxAbs 1.84e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-wide | 15 | PASS: opd.maxAbs 2.06e-9 waves | PASS: opd.maxAbs 2.62e-9 waves | PASS: opd.maxAbs 2.51e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.73e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 2.00e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-tele | 15 | PASS: opd.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.87e-9 waves | PASS: opd.maxAbs 2.12e-9 waves |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: opticalPath.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.31e-9 waves |
| nikon-z-24-70f4s-f8-photopic-wide | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 15 | PASS: opd.maxAbs 1.01e-9 waves | PASS: opd.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-f8-photopic-tele | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 1.75e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: opticalPath.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.23e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPath.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.31e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-wide | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves | PASS: opticalPath.maxAbs 2.67e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 15 | PASS: opd.maxAbs 1.01e-9 waves | PASS: opd.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-tele | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 1.75e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 9.38e-12 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | cut tangential, field 2.56e1, frequencyPerMm 100 |
| lv – optiland | rays.compared [rays] | 888164 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.50e-11 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 94 |
| lv – ref | rays.compared [rays] | 888164 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.45e-11 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 92 |
| optiland – ref | rays.compared [rays] | 888164 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-f5.6-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: mtf.maxAbs 6.16e-13 | PASS: mtf.maxAbs 5.68e-13 | PASS: mtf.maxAbs 5.40e-13 |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.09e-13 | PASS: mtf.maxAbs 7.96e-13 | PASS: mtf.maxAbs 6.59e-13 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: mtf.maxAbs 6.87e-13 | PASS: mtf.maxAbs 6.35e-13 | PASS: mtf.maxAbs 6.45e-13 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.39e-13 | PASS: mtf.maxAbs 6.10e-13 | PASS: mtf.maxAbs 6.04e-13 |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: mtf.maxAbs 3.65e-13 | PASS: mtf.maxAbs 4.72e-13 | PASS: mtf.maxAbs 4.08e-13 |
| canon-ef-135-f2l-usm-f11-photopic | 3 | PASS: mtf.maxAbs 2.43e-13 | PASS: mtf.maxAbs 3.60e-13 | PASS: mtf.maxAbs 5.08e-13 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: mtf.maxAbs 4.07e-13 | PASS: mtf.maxAbs 5.20e-13 | PASS: mtf.maxAbs 4.08e-13 |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | PASS: mtf.maxAbs 2.04e-13 | PASS: mtf.maxAbs 3.89e-13 | PASS: mtf.maxAbs 4.66e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: mtf.maxAbs 3.43e-13 | PASS: mtf.maxAbs 7.00e-13 | PASS: mtf.maxAbs 1.03e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | PASS: mtf.maxAbs 5.13e-13 | PASS: mtf.maxAbs 4.54e-13 | PASS: mtf.maxAbs 9.67e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: mtf.maxAbs 4.35e-13 | PASS: mtf.maxAbs 3.50e-13 | PASS: mtf.maxAbs 7.30e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 4.91e-13 | PASS: mtf.maxAbs 4.01e-13 | PASS: mtf.maxAbs 5.96e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: mtf.maxAbs 3.45e-13 | PASS: mtf.maxAbs 2.96e-13 | PASS: mtf.maxAbs 6.40e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | PASS: mtf.maxAbs 2.06e-13 | PASS: mtf.maxAbs 2.83e-13 | PASS: mtf.maxAbs 4.33e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: mtf.maxAbs 3.72e-13 | PASS: mtf.maxAbs 3.08e-13 | PASS: mtf.maxAbs 6.80e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.79e-13 | PASS: mtf.maxAbs 3.01e-13 | PASS: mtf.maxAbs 4.54e-13 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: mtf.maxAbs 1.76e-13 | PASS: mtf.maxAbs 7.27e-12 | PASS: mtf.maxAbs 7.45e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.68e-13 | PASS: mtf.maxAbs 1.15e-12 | PASS: mtf.maxAbs 1.05e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.85e-13 | PASS: mtf.maxAbs 7.09e-12 | PASS: mtf.maxAbs 7.28e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.96e-13 | PASS: mtf.maxAbs 2.75e-12 | PASS: mtf.maxAbs 2.97e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: mtf.maxAbs 3.02e-13 | PASS: mtf.maxAbs 2.16e-12 | PASS: mtf.maxAbs 1.86e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | PASS: mtf.maxAbs 8.53e-13 | PASS: mtf.maxAbs 7.96e-13 | PASS: mtf.maxAbs 2.40e-13 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: mtf.maxAbs 3.31e-13 | PASS: mtf.maxAbs 2.16e-12 | PASS: mtf.maxAbs 1.83e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | PASS: mtf.maxAbs 8.90e-13 | PASS: mtf.maxAbs 9.79e-13 | PASS: mtf.maxAbs 2.17e-13 |
| nikkor-z50f12-f5.6-ref | 3 | PASS: mtf.maxAbs 3.15e-12 | PASS: mtf.maxAbs 5.91e-12 | PASS: mtf.maxAbs 6.69e-12 |
| nikkor-z50f12-f5.6-photopic | 3 | PASS: mtf.maxAbs 2.09e-12 | PASS: mtf.maxAbs 4.67e-12 | PASS: mtf.maxAbs 5.55e-12 |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: mtf.maxAbs 3.12e-12 | PASS: mtf.maxAbs 5.83e-12 | PASS: mtf.maxAbs 6.56e-12 |
| nikkor-z50f12-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.20e-12 | PASS: mtf.maxAbs 4.66e-12 | PASS: mtf.maxAbs 5.65e-12 |
| nikkor-z50f12-f11-ref | 3 | PASS: mtf.maxAbs 7.38e-13 | PASS: mtf.maxAbs 4.58e-13 | PASS: mtf.maxAbs 6.20e-13 |
| nikkor-z50f12-f11-photopic | 3 | PASS: mtf.maxAbs 8.45e-13 | PASS: mtf.maxAbs 3.58e-13 | PASS: mtf.maxAbs 7.29e-13 |
| nikkor-z50f12-f11-best-ref | 3 | PASS: mtf.maxAbs 7.40e-13 | PASS: mtf.maxAbs 4.53e-13 | PASS: mtf.maxAbs 6.22e-13 |
| nikkor-z50f12-f11-best-photopic | 3 | PASS: mtf.maxAbs 9.58e-13 | PASS: mtf.maxAbs 2.47e-13 | PASS: mtf.maxAbs 8.25e-13 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: mtf.maxAbs 1.90e-12 | PASS: mtf.maxAbs 2.95e-12 | PASS: mtf.maxAbs 3.02e-12 |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | PASS: mtf.maxAbs 6.39e-13 | PASS: mtf.maxAbs 2.82e-12 | PASS: mtf.maxAbs 2.94e-12 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.92e-12 | PASS: mtf.maxAbs 3.00e-12 | PASS: mtf.maxAbs 3.07e-12 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 7.35e-13 | PASS: mtf.maxAbs 3.09e-12 | PASS: mtf.maxAbs 3.20e-12 |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: mtf.maxAbs 4.82e-13 | PASS: mtf.maxAbs 2.42e-12 | PASS: mtf.maxAbs 2.72e-12 |
| sony-fe-20mm-f18-g-f11-photopic | 3 | PASS: mtf.maxAbs 1.53e-12 | PASS: mtf.maxAbs 2.25e-12 | PASS: mtf.maxAbs 1.95e-12 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: mtf.maxAbs 5.54e-13 | PASS: mtf.maxAbs 2.44e-12 | PASS: mtf.maxAbs 2.74e-12 |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.60e-12 | PASS: mtf.maxAbs 2.24e-12 | PASS: mtf.maxAbs 1.97e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: mtf.maxAbs 5.14e-12 | PASS: mtf.maxAbs 3.23e-12 | PASS: mtf.maxAbs 7.93e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.53e-12 | PASS: mtf.maxAbs 3.91e-12 | PASS: mtf.maxAbs 6.33e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: mtf.maxAbs 7.02e-13 | PASS: mtf.maxAbs 8.34e-13 | PASS: mtf.maxAbs 1.47e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.75e-12 | PASS: mtf.maxAbs 6.21e-13 | PASS: mtf.maxAbs 1.32e-12 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: mtf.maxAbs 1.64e-12 | PASS: mtf.maxAbs 1.48e-12 | PASS: mtf.maxAbs 2.98e-12 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | PASS: mtf.maxAbs 3.37e-12 | PASS: mtf.maxAbs 1.55e-12 | PASS: mtf.maxAbs 3.74e-12 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: mtf.maxAbs 8.09e-13 | PASS: mtf.maxAbs 5.75e-13 | PASS: mtf.maxAbs 1.19e-12 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.51e-12 | PASS: mtf.maxAbs 1.47e-12 | PASS: mtf.maxAbs 2.04e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: mtf.maxAbs 1.39e-12 | PASS: mtf.maxAbs 2.14e-12 | PASS: mtf.maxAbs 3.04e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.67e-12 | PASS: mtf.maxAbs 1.86e-12 | PASS: mtf.maxAbs 3.26e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.52e-12 | PASS: mtf.maxAbs 1.98e-12 | PASS: mtf.maxAbs 2.84e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.73e-12 | PASS: mtf.maxAbs 1.92e-12 | PASS: mtf.maxAbs 3.37e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: mtf.maxAbs 1.17e-12 | PASS: mtf.maxAbs 2.34e-12 | PASS: mtf.maxAbs 3.51e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | PASS: mtf.maxAbs 9.94e-13 | PASS: mtf.maxAbs 1.76e-12 | PASS: mtf.maxAbs 2.23e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: mtf.maxAbs 1.09e-12 | PASS: mtf.maxAbs 2.42e-12 | PASS: mtf.maxAbs 3.50e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | PASS: mtf.maxAbs 9.96e-13 | PASS: mtf.maxAbs 1.73e-12 | PASS: mtf.maxAbs 2.16e-12 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: mtf.maxAbs 5.53e-12 | PASS: mtf.maxAbs 5.07e-12 | PASS: mtf.maxAbs 5.25e-12 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.30e-12 | PASS: mtf.maxAbs 4.51e-12 | PASS: mtf.maxAbs 5.81e-12 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 1.38e-11 | PASS: mtf.maxAbs 1.31e-11 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | PASS: mtf.maxAbs 3.32e-12 | PASS: mtf.maxAbs 4.80e-12 | PASS: mtf.maxAbs 4.82e-12 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 7.36e-13 | PASS: mtf.maxAbs 4.12e-12 | PASS: mtf.maxAbs 3.38e-12 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | PASS: mtf.maxAbs 4.74e-13 | PASS: mtf.maxAbs 7.65e-12 | PASS: mtf.maxAbs 7.21e-12 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: mtf.maxAbs 6.67e-12 | PASS: mtf.maxAbs 1.22e-11 | PASS: mtf.maxAbs 1.20e-11 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 7.52e-13 | PASS: mtf.maxAbs 5.32e-12 | PASS: mtf.maxAbs 5.54e-12 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: mtf.maxAbs 9.24e-13 | PASS: mtf.maxAbs 1.50e-11 | PASS: mtf.maxAbs 1.45e-11 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | PASS: mtf.maxAbs 3.01e-12 | PASS: mtf.maxAbs 5.88e-12 | PASS: mtf.maxAbs 5.92e-12 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.37e-13 | PASS: mtf.maxAbs 2.88e-12 | PASS: mtf.maxAbs 3.32e-12 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | PASS: mtf.maxAbs 6.48e-13 | PASS: mtf.maxAbs 6.27e-12 | PASS: mtf.maxAbs 5.97e-12 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: mtf.maxAbs 2.00e-13 | PASS: mtf.maxAbs 6.83e-12 | PASS: mtf.maxAbs 6.80e-12 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 3.26e-13 | PASS: mtf.maxAbs 1.82e-12 | PASS: mtf.maxAbs 1.61e-12 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: mtf.maxAbs 4.77e-13 | PASS: mtf.maxAbs 5.59e-12 | PASS: mtf.maxAbs 5.79e-12 |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | PASS: mtf.maxAbs 2.85e-13 | PASS: mtf.maxAbs 4.43e-12 | PASS: mtf.maxAbs 4.52e-12 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 5.77e-13 | PASS: mtf.maxAbs 1.77e-12 | PASS: mtf.maxAbs 2.22e-12 |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | PASS: mtf.maxAbs 4.87e-13 | PASS: mtf.maxAbs 3.96e-12 | PASS: mtf.maxAbs 3.83e-12 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: mtf.maxAbs 2.13e-13 | PASS: mtf.maxAbs 1.04e-11 | PASS: mtf.maxAbs 1.04e-11 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 4.12e-13 | PASS: mtf.maxAbs 1.55e-12 | PASS: mtf.maxAbs 1.32e-12 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: mtf.maxAbs 3.34e-13 | PASS: mtf.maxAbs 6.43e-12 | PASS: mtf.maxAbs 6.75e-12 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | PASS: mtf.maxAbs 2.38e-13 | PASS: mtf.maxAbs 4.67e-12 | PASS: mtf.maxAbs 4.76e-12 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 6.38e-13 | PASS: mtf.maxAbs 1.62e-12 | PASS: mtf.maxAbs 2.08e-12 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | PASS: mtf.maxAbs 5.80e-13 | PASS: mtf.maxAbs 2.26e-12 | PASS: mtf.maxAbs 2.80e-12 |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: mtf.maxAbs 7.41e-13 | PASS: mtf.maxAbs 4.36e-12 | PASS: mtf.maxAbs 5.03e-12 |
| nikon-z-mc-105f28-f5.6-photopic | 3 | PASS: mtf.maxAbs 5.47e-13 | PASS: mtf.maxAbs 3.92e-12 | PASS: mtf.maxAbs 3.54e-12 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.04e-12 | PASS: mtf.maxAbs 1.01e-12 | PASS: mtf.maxAbs 1.17e-12 |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 9.58e-13 | PASS: mtf.maxAbs 7.07e-13 | PASS: mtf.maxAbs 7.18e-13 |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: mtf.maxAbs 2.46e-13 | PASS: mtf.maxAbs 5.82e-13 | PASS: mtf.maxAbs 3.93e-13 |
| nikon-z-mc-105f28-f11-photopic | 3 | PASS: mtf.maxAbs 5.19e-13 | PASS: mtf.maxAbs 3.02e-13 | PASS: mtf.maxAbs 8.21e-13 |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: mtf.maxAbs 3.94e-13 | PASS: mtf.maxAbs 7.11e-13 | PASS: mtf.maxAbs 3.58e-13 |
| nikon-z-mc-105f28-f11-best-photopic | 3 | PASS: mtf.maxAbs 5.26e-13 | PASS: mtf.maxAbs 1.95e-13 | PASS: mtf.maxAbs 6.24e-13 |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: mtf.maxAbs 7.12e-13 | PASS: mtf.maxAbs 7.35e-13 | PASS: mtf.maxAbs 1.41e-12 |
| nikon-z-135f18-plena-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.49e-12 | PASS: mtf.maxAbs 8.40e-13 | PASS: mtf.maxAbs 1.79e-12 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: mtf.maxAbs 7.96e-13 | PASS: mtf.maxAbs 8.60e-13 | PASS: mtf.maxAbs 1.66e-12 |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.38e-12 | PASS: mtf.maxAbs 7.97e-13 | PASS: mtf.maxAbs 1.87e-12 |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: mtf.maxAbs 5.47e-13 | PASS: mtf.maxAbs 2.15e-13 | PASS: mtf.maxAbs 4.50e-13 |
| nikon-z-135f18-plena-f11-photopic | 3 | PASS: mtf.maxAbs 7.09e-13 | PASS: mtf.maxAbs 3.55e-13 | PASS: mtf.maxAbs 1.04e-12 |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: mtf.maxAbs 5.53e-13 | PASS: mtf.maxAbs 2.22e-13 | PASS: mtf.maxAbs 4.64e-13 |
| nikon-z-135f18-plena-f11-best-photopic | 3 | PASS: mtf.maxAbs 6.79e-13 | PASS: mtf.maxAbs 3.55e-13 | PASS: mtf.maxAbs 1.02e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: mtf.maxAbs 8.32e-12 | PASS: mtf.maxAbs 4.60e-12 | PASS: mtf.maxAbs 1.01e-11 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.14e-12 | PASS: mtf.maxAbs 3.73e-12 | PASS: mtf.maxAbs 6.50e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: mtf.maxAbs 9.38e-12 | PASS: mtf.maxAbs 6.51e-12 | PASS: mtf.maxAbs 9.21e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.38e-12 | PASS: mtf.maxAbs 3.75e-12 | PASS: mtf.maxAbs 6.96e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: mtf.maxAbs 4.81e-13 | PASS: mtf.maxAbs 6.49e-12 | PASS: mtf.maxAbs 6.97e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | PASS: mtf.maxAbs 3.59e-13 | PASS: mtf.maxAbs 2.57e-12 | PASS: mtf.maxAbs 2.21e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: mtf.maxAbs 5.32e-13 | PASS: mtf.maxAbs 8.14e-12 | PASS: mtf.maxAbs 8.67e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.58e-13 | PASS: mtf.maxAbs 2.65e-12 | PASS: mtf.maxAbs 2.33e-12 |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: mtf.maxAbs 8.82e-12 | PASS: mtf.maxAbs 1.12e-11 | PASS: mtf.maxAbs 1.17e-11 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 5.70e-13 | PASS: mtf.maxAbs 3.64e-12 | PASS: mtf.maxAbs 3.52e-12 |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: mtf.maxAbs 1.25e-12 | PASS: mtf.maxAbs 7.19e-12 | PASS: mtf.maxAbs 7.58e-12 |
| nikon-z-24-70f4s-open-photopic-wide | 3 | PASS: mtf.maxAbs 3.40e-12 | PASS: mtf.maxAbs 7.25e-12 | PASS: mtf.maxAbs 7.20e-12 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 5.70e-13 | PASS: mtf.maxAbs 2.27e-12 | PASS: mtf.maxAbs 2.66e-12 |
| nikon-z-24-70f4s-open-photopic-tele | 3 | PASS: mtf.maxAbs 6.94e-13 | PASS: mtf.maxAbs 7.47e-12 | PASS: mtf.maxAbs 7.17e-12 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: mtf.maxAbs 8.84e-12 | PASS: mtf.maxAbs 1.13e-11 | PASS: mtf.maxAbs 1.14e-11 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.66e-12 | PASS: mtf.maxAbs 3.36e-12 | PASS: mtf.maxAbs 5.01e-12 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: mtf.maxAbs 1.29e-12 | PASS: mtf.maxAbs 8.23e-12 | PASS: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | PASS: mtf.maxAbs 3.35e-12 | PASS: mtf.maxAbs 9.38e-12 | PASS: mtf.maxAbs 9.40e-12 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 2.73e-13 | PASS: mtf.maxAbs 2.52e-12 | PASS: mtf.maxAbs 2.66e-12 |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | PASS: mtf.maxAbs 7.62e-13 | PASS: mtf.maxAbs 7.79e-12 | PASS: mtf.maxAbs 7.47e-12 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: mtf.maxAbs 1.34e-12 | PASS: mtf.maxAbs 6.29e-12 | PASS: mtf.maxAbs 6.24e-12 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 7.94e-13 | PASS: mtf.maxAbs 3.79e-12 | PASS: mtf.maxAbs 4.46e-12 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: mtf.maxAbs 2.59e-13 | PASS: mtf.maxAbs 6.99e-12 | PASS: mtf.maxAbs 7.25e-12 |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | PASS: mtf.maxAbs 1.69e-12 | PASS: mtf.maxAbs 3.87e-12 | PASS: mtf.maxAbs 4.03e-12 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.21e-13 | PASS: mtf.maxAbs 4.26e-12 | PASS: mtf.maxAbs 4.27e-12 |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | PASS: mtf.maxAbs 5.38e-13 | PASS: mtf.maxAbs 7.94e-12 | PASS: mtf.maxAbs 7.45e-12 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: mtf.maxAbs 1.58e-12 | PASS: mtf.maxAbs 1.14e-11 | PASS: mtf.maxAbs 1.10e-11 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.04e-12 | PASS: mtf.maxAbs 5.76e-12 | PASS: mtf.maxAbs 6.81e-12 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: mtf.maxAbs 3.59e-13 | PASS: mtf.maxAbs 1.01e-11 | PASS: mtf.maxAbs 9.78e-12 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | PASS: mtf.maxAbs 1.77e-12 | PASS: mtf.maxAbs 4.28e-12 | PASS: mtf.maxAbs 4.40e-12 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.96e-13 | PASS: mtf.maxAbs 3.55e-12 | PASS: mtf.maxAbs 3.72e-12 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | PASS: mtf.maxAbs 4.20e-13 | PASS: mtf.maxAbs 3.07e-12 | PASS: mtf.maxAbs 3.25e-12 |
