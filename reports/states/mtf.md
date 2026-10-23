# MTF baseline of states

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
| Suite | states |
| Suite hash | b45f25ba129d4c0d95ab44ec5084eca68742a36a55828fcdc3a08ae932ed45f2 |
| Baseline hash | cb416ba26650ea1206bbf6d21f32dbd9abcc896c9459dcb9489d57662c93f55f |
| Contract version | 1.1 |
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
| r4 | rays.trace | 128 | 384 | lv – optiland | 128 PASS | 384 PASS |
| r4 | rays.trace | 128 | 384 | lv – ref | 128 PASS | 384 PASS |
| r4 | rays.trace | 128 | 384 | optiland – ref | 128 PASS | 384 PASS |
| r4f | mtf.native | 128 | 128 | lv – replay | 128 PASS | 128 PASS |
| r6a | rays.trace | 128 | 384 | lv – optiland | 128 PASS | 384 PASS |
| r6a | rays.trace | 128 | 384 | lv – ref | 128 PASS | 384 PASS |
| r6a | rays.trace | 128 | 384 | optiland – ref | 128 PASS | 384 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r4 | lv | 128 ok |
| r4 | optiland | 128 ok |
| r4 | ref | 128 ok |
| r4f | lv | 128 ok |
| r4f | replay | 128 ok |
| r6a | lv | 128 ok |
| r6a | optiland | 128 ok |
| r6a | ref | 128 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 9.38e-12 | 384 of 384 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | cut tangential, field 2.56e1, frequencyPerMm 100 |
| lv – optiland | rays.compared [rays] | 888164 | 384 of 384 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.50e-11 | 384 of 384 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 94 |
| lv – ref | rays.compared [rays] | 888164 | 384 of 384 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.45e-11 | 384 of 384 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 92 |
| optiland – ref | rays.compared [rays] | 888164 | 384 of 384 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: mtf.maxAbs 6.16e-13 (3 of 3) | PASS: mtf.maxAbs 5.68e-13 (3 of 3) | PASS: mtf.maxAbs 5.40e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.09e-13 (3 of 3) | PASS: mtf.maxAbs 7.96e-13 (3 of 3) | PASS: mtf.maxAbs 6.59e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: mtf.maxAbs 6.87e-13 (3 of 3) | PASS: mtf.maxAbs 6.35e-13 (3 of 3) | PASS: mtf.maxAbs 6.45e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.39e-13 (3 of 3) | PASS: mtf.maxAbs 6.10e-13 (3 of 3) | PASS: mtf.maxAbs 6.04e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: mtf.maxAbs 3.65e-13 (3 of 3) | PASS: mtf.maxAbs 4.72e-13 (3 of 3) | PASS: mtf.maxAbs 4.08e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-photopic | 3 | PASS: mtf.maxAbs 2.43e-13 (3 of 3) | PASS: mtf.maxAbs 3.60e-13 (3 of 3) | PASS: mtf.maxAbs 5.08e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: mtf.maxAbs 4.07e-13 (3 of 3) | PASS: mtf.maxAbs 5.20e-13 (3 of 3) | PASS: mtf.maxAbs 4.08e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | PASS: mtf.maxAbs 2.04e-13 (3 of 3) | PASS: mtf.maxAbs 3.89e-13 (3 of 3) | PASS: mtf.maxAbs 4.66e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: mtf.maxAbs 3.43e-13 (3 of 3) | PASS: mtf.maxAbs 7.00e-13 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | PASS: mtf.maxAbs 5.13e-13 (3 of 3) | PASS: mtf.maxAbs 4.54e-13 (3 of 3) | PASS: mtf.maxAbs 9.67e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: mtf.maxAbs 4.35e-13 (3 of 3) | PASS: mtf.maxAbs 3.50e-13 (3 of 3) | PASS: mtf.maxAbs 7.30e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 4.91e-13 (3 of 3) | PASS: mtf.maxAbs 4.01e-13 (3 of 3) | PASS: mtf.maxAbs 5.96e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: mtf.maxAbs 3.45e-13 (3 of 3) | PASS: mtf.maxAbs 2.96e-13 (3 of 3) | PASS: mtf.maxAbs 6.40e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | PASS: mtf.maxAbs 2.06e-13 (3 of 3) | PASS: mtf.maxAbs 2.83e-13 (3 of 3) | PASS: mtf.maxAbs 4.33e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: mtf.maxAbs 3.72e-13 (3 of 3) | PASS: mtf.maxAbs 3.08e-13 (3 of 3) | PASS: mtf.maxAbs 6.80e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.79e-13 (3 of 3) | PASS: mtf.maxAbs 3.01e-13 (3 of 3) | PASS: mtf.maxAbs 4.54e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: mtf.maxAbs 1.76e-13 (3 of 3) | PASS: mtf.maxAbs 7.27e-12 (3 of 3) | PASS: mtf.maxAbs 7.45e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.68e-13 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.85e-13 (3 of 3) | PASS: mtf.maxAbs 7.09e-12 (3 of 3) | PASS: mtf.maxAbs 7.28e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.96e-13 (3 of 3) | PASS: mtf.maxAbs 2.75e-12 (3 of 3) | PASS: mtf.maxAbs 2.97e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: mtf.maxAbs 3.02e-13 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 1.86e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | PASS: mtf.maxAbs 8.53e-13 (3 of 3) | PASS: mtf.maxAbs 7.96e-13 (3 of 3) | PASS: mtf.maxAbs 2.40e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: mtf.maxAbs 3.31e-13 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 1.83e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | PASS: mtf.maxAbs 8.90e-13 (3 of 3) | PASS: mtf.maxAbs 9.79e-13 (3 of 3) | PASS: mtf.maxAbs 2.17e-13 (3 of 3) |
| nikkor-z50f12-f5.6-ref | 3 | PASS: mtf.maxAbs 3.15e-12 (3 of 3) | PASS: mtf.maxAbs 5.91e-12 (3 of 3) | PASS: mtf.maxAbs 6.69e-12 (3 of 3) |
| nikkor-z50f12-f5.6-photopic | 3 | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) | PASS: mtf.maxAbs 5.55e-12 (3 of 3) |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: mtf.maxAbs 3.12e-12 (3 of 3) | PASS: mtf.maxAbs 5.83e-12 (3 of 3) | PASS: mtf.maxAbs 6.56e-12 (3 of 3) |
| nikkor-z50f12-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 4.66e-12 (3 of 3) | PASS: mtf.maxAbs 5.65e-12 (3 of 3) |
| nikkor-z50f12-f11-ref | 3 | PASS: mtf.maxAbs 7.38e-13 (3 of 3) | PASS: mtf.maxAbs 4.58e-13 (3 of 3) | PASS: mtf.maxAbs 6.20e-13 (3 of 3) |
| nikkor-z50f12-f11-photopic | 3 | PASS: mtf.maxAbs 8.45e-13 (3 of 3) | PASS: mtf.maxAbs 3.58e-13 (3 of 3) | PASS: mtf.maxAbs 7.29e-13 (3 of 3) |
| nikkor-z50f12-f11-best-ref | 3 | PASS: mtf.maxAbs 7.40e-13 (3 of 3) | PASS: mtf.maxAbs 4.53e-13 (3 of 3) | PASS: mtf.maxAbs 6.22e-13 (3 of 3) |
| nikkor-z50f12-f11-best-photopic | 3 | PASS: mtf.maxAbs 9.58e-13 (3 of 3) | PASS: mtf.maxAbs 2.47e-13 (3 of 3) | PASS: mtf.maxAbs 8.25e-13 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 2.95e-12 (3 of 3) | PASS: mtf.maxAbs 3.02e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 2.82e-12 (3 of 3) | PASS: mtf.maxAbs 2.94e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.00e-12 (3 of 3) | PASS: mtf.maxAbs 3.07e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 7.35e-13 (3 of 3) | PASS: mtf.maxAbs 3.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.20e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: mtf.maxAbs 4.82e-13 (3 of 3) | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 2.72e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-photopic | 3 | PASS: mtf.maxAbs 1.53e-12 (3 of 3) | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: mtf.maxAbs 5.54e-13 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) | PASS: mtf.maxAbs 2.74e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: mtf.maxAbs 5.14e-12 (3 of 3) | PASS: mtf.maxAbs 3.23e-12 (3 of 3) | PASS: mtf.maxAbs 7.93e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.53e-12 (3 of 3) | PASS: mtf.maxAbs 3.91e-12 (3 of 3) | PASS: mtf.maxAbs 6.33e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: mtf.maxAbs 7.02e-13 (3 of 3) | PASS: mtf.maxAbs 8.34e-13 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 6.21e-13 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: mtf.maxAbs 1.64e-12 (3 of 3) | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 2.98e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | PASS: mtf.maxAbs 3.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 3.74e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: mtf.maxAbs 8.09e-13 (3 of 3) | PASS: mtf.maxAbs 5.75e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 2.04e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 3.04e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.67e-12 (3 of 3) | PASS: mtf.maxAbs 1.86e-12 (3 of 3) | PASS: mtf.maxAbs 3.26e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.52e-12 (3 of 3) | PASS: mtf.maxAbs 1.98e-12 (3 of 3) | PASS: mtf.maxAbs 2.84e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.37e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.51e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 3.50e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | PASS: mtf.maxAbs 9.96e-13 (3 of 3) | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: mtf.maxAbs 5.53e-12 (3 of 3) | PASS: mtf.maxAbs 5.07e-12 (3 of 3) | PASS: mtf.maxAbs 5.25e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) | PASS: mtf.maxAbs 5.81e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.38e-11 (3 of 3) | PASS: mtf.maxAbs 1.31e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | PASS: mtf.maxAbs 3.32e-12 (3 of 3) | PASS: mtf.maxAbs 4.80e-12 (3 of 3) | PASS: mtf.maxAbs 4.82e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 7.36e-13 (3 of 3) | PASS: mtf.maxAbs 4.12e-12 (3 of 3) | PASS: mtf.maxAbs 3.38e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | PASS: mtf.maxAbs 4.74e-13 (3 of 3) | PASS: mtf.maxAbs 7.65e-12 (3 of 3) | PASS: mtf.maxAbs 7.21e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: mtf.maxAbs 6.67e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-11 (3 of 3) | PASS: mtf.maxAbs 1.20e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 7.52e-13 (3 of 3) | PASS: mtf.maxAbs 5.32e-12 (3 of 3) | PASS: mtf.maxAbs 5.54e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: mtf.maxAbs 9.24e-13 (3 of 3) | PASS: mtf.maxAbs 1.50e-11 (3 of 3) | PASS: mtf.maxAbs 1.45e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | PASS: mtf.maxAbs 3.01e-12 (3 of 3) | PASS: mtf.maxAbs 5.88e-12 (3 of 3) | PASS: mtf.maxAbs 5.92e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.37e-13 (3 of 3) | PASS: mtf.maxAbs 2.88e-12 (3 of 3) | PASS: mtf.maxAbs 3.32e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | PASS: mtf.maxAbs 6.48e-13 (3 of 3) | PASS: mtf.maxAbs 6.27e-12 (3 of 3) | PASS: mtf.maxAbs 5.97e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: mtf.maxAbs 2.00e-13 (3 of 3) | PASS: mtf.maxAbs 6.83e-12 (3 of 3) | PASS: mtf.maxAbs 6.80e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 3.26e-13 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: mtf.maxAbs 4.77e-13 (3 of 3) | PASS: mtf.maxAbs 5.59e-12 (3 of 3) | PASS: mtf.maxAbs 5.79e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | PASS: mtf.maxAbs 2.85e-13 (3 of 3) | PASS: mtf.maxAbs 4.43e-12 (3 of 3) | PASS: mtf.maxAbs 4.52e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 5.77e-13 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | PASS: mtf.maxAbs 4.87e-13 (3 of 3) | PASS: mtf.maxAbs 3.96e-12 (3 of 3) | PASS: mtf.maxAbs 3.83e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: mtf.maxAbs 2.13e-13 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 4.12e-13 (3 of 3) | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: mtf.maxAbs 3.34e-13 (3 of 3) | PASS: mtf.maxAbs 6.43e-12 (3 of 3) | PASS: mtf.maxAbs 6.75e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | PASS: mtf.maxAbs 2.38e-13 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) | PASS: mtf.maxAbs 4.76e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 6.38e-13 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) | PASS: mtf.maxAbs 2.08e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | PASS: mtf.maxAbs 5.80e-13 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) | PASS: mtf.maxAbs 2.80e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: mtf.maxAbs 7.41e-13 (3 of 3) | PASS: mtf.maxAbs 4.36e-12 (3 of 3) | PASS: mtf.maxAbs 5.03e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-photopic | 3 | PASS: mtf.maxAbs 5.47e-13 (3 of 3) | PASS: mtf.maxAbs 3.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.54e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 9.58e-13 (3 of 3) | PASS: mtf.maxAbs 7.07e-13 (3 of 3) | PASS: mtf.maxAbs 7.18e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: mtf.maxAbs 2.46e-13 (3 of 3) | PASS: mtf.maxAbs 5.82e-13 (3 of 3) | PASS: mtf.maxAbs 3.93e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-photopic | 3 | PASS: mtf.maxAbs 5.19e-13 (3 of 3) | PASS: mtf.maxAbs 3.02e-13 (3 of 3) | PASS: mtf.maxAbs 8.21e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: mtf.maxAbs 3.94e-13 (3 of 3) | PASS: mtf.maxAbs 7.11e-13 (3 of 3) | PASS: mtf.maxAbs 3.58e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-best-photopic | 3 | PASS: mtf.maxAbs 5.26e-13 (3 of 3) | PASS: mtf.maxAbs 1.95e-13 (3 of 3) | PASS: mtf.maxAbs 6.24e-13 (3 of 3) |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: mtf.maxAbs 7.12e-13 (3 of 3) | PASS: mtf.maxAbs 7.35e-13 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 8.40e-13 (3 of 3) | PASS: mtf.maxAbs 1.79e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: mtf.maxAbs 7.96e-13 (3 of 3) | PASS: mtf.maxAbs 8.60e-13 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 7.97e-13 (3 of 3) | PASS: mtf.maxAbs 1.87e-12 (3 of 3) |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: mtf.maxAbs 5.47e-13 (3 of 3) | PASS: mtf.maxAbs 2.15e-13 (3 of 3) | PASS: mtf.maxAbs 4.50e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-photopic | 3 | PASS: mtf.maxAbs 7.09e-13 (3 of 3) | PASS: mtf.maxAbs 3.55e-13 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: mtf.maxAbs 5.53e-13 (3 of 3) | PASS: mtf.maxAbs 2.22e-13 (3 of 3) | PASS: mtf.maxAbs 4.64e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-best-photopic | 3 | PASS: mtf.maxAbs 6.79e-13 (3 of 3) | PASS: mtf.maxAbs 3.55e-13 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: mtf.maxAbs 8.32e-12 (3 of 3) | PASS: mtf.maxAbs 4.60e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-11 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.14e-12 (3 of 3) | PASS: mtf.maxAbs 3.73e-12 (3 of 3) | PASS: mtf.maxAbs 6.50e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: mtf.maxAbs 9.38e-12 (3 of 3) | PASS: mtf.maxAbs 6.51e-12 (3 of 3) | PASS: mtf.maxAbs 9.21e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.38e-12 (3 of 3) | PASS: mtf.maxAbs 3.75e-12 (3 of 3) | PASS: mtf.maxAbs 6.96e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: mtf.maxAbs 4.81e-13 (3 of 3) | PASS: mtf.maxAbs 6.49e-12 (3 of 3) | PASS: mtf.maxAbs 6.97e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | PASS: mtf.maxAbs 3.59e-13 (3 of 3) | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: mtf.maxAbs 5.32e-13 (3 of 3) | PASS: mtf.maxAbs 8.14e-12 (3 of 3) | PASS: mtf.maxAbs 8.67e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.58e-13 (3 of 3) | PASS: mtf.maxAbs 2.65e-12 (3 of 3) | PASS: mtf.maxAbs 2.33e-12 (3 of 3) |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: mtf.maxAbs 8.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 5.70e-13 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 7.19e-12 (3 of 3) | PASS: mtf.maxAbs 7.58e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-wide | 3 | PASS: mtf.maxAbs 3.40e-12 (3 of 3) | PASS: mtf.maxAbs 7.25e-12 (3 of 3) | PASS: mtf.maxAbs 7.20e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 5.70e-13 (3 of 3) | PASS: mtf.maxAbs 2.27e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-tele | 3 | PASS: mtf.maxAbs 6.94e-13 (3 of 3) | PASS: mtf.maxAbs 7.47e-12 (3 of 3) | PASS: mtf.maxAbs 7.17e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: mtf.maxAbs 8.84e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 1.14e-11 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 3.36e-12 (3 of 3) | PASS: mtf.maxAbs 5.01e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 8.23e-12 (3 of 3) | PASS: mtf.maxAbs 8.33e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | PASS: mtf.maxAbs 3.35e-12 (3 of 3) | PASS: mtf.maxAbs 9.38e-12 (3 of 3) | PASS: mtf.maxAbs 9.40e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 2.73e-13 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | PASS: mtf.maxAbs 7.62e-13 (3 of 3) | PASS: mtf.maxAbs 7.79e-12 (3 of 3) | PASS: mtf.maxAbs 7.47e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 6.29e-12 (3 of 3) | PASS: mtf.maxAbs 6.24e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 7.94e-13 (3 of 3) | PASS: mtf.maxAbs 3.79e-12 (3 of 3) | PASS: mtf.maxAbs 4.46e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: mtf.maxAbs 2.59e-13 (3 of 3) | PASS: mtf.maxAbs 6.99e-12 (3 of 3) | PASS: mtf.maxAbs 7.25e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 3.87e-12 (3 of 3) | PASS: mtf.maxAbs 4.03e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.21e-13 (3 of 3) | PASS: mtf.maxAbs 4.26e-12 (3 of 3) | PASS: mtf.maxAbs 4.27e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | PASS: mtf.maxAbs 5.38e-13 (3 of 3) | PASS: mtf.maxAbs 7.94e-12 (3 of 3) | PASS: mtf.maxAbs 7.45e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 1.14e-11 (3 of 3) | PASS: mtf.maxAbs 1.10e-11 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 5.76e-12 (3 of 3) | PASS: mtf.maxAbs 6.81e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: mtf.maxAbs 3.59e-13 (3 of 3) | PASS: mtf.maxAbs 1.01e-11 (3 of 3) | PASS: mtf.maxAbs 9.78e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 4.28e-12 (3 of 3) | PASS: mtf.maxAbs 4.40e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.96e-13 (3 of 3) | PASS: mtf.maxAbs 3.55e-12 (3 of 3) | PASS: mtf.maxAbs 3.72e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | PASS: mtf.maxAbs 4.20e-13 (3 of 3) | PASS: mtf.maxAbs 3.07e-12 (3 of 3) | PASS: mtf.maxAbs 3.25e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.69e-14 | 128 of 128 | nikon-z-24-70f4s-open-best-ref-tele | cut tangential, field 5.00e-1, frequencyPerMm 16 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 128 of 128 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 128 of 128 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-photopic | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikkor-z50f12-f5.6-ref | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| nikkor-z50f12-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikkor-z50f12-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikkor-z50f12-f11-ref | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikkor-z50f12-f11-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikkor-z50f12-f11-best-ref | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikkor-z50f12-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-ref | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-photopic | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-wide | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-tele | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-ref | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-best-ref | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-best-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-wide | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 1.55e-14 (1 of 1) |
| nikon-z-24-70f4s-open-ref-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-wide | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | PASS: mtf.maxAbs 1.69e-14 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-wide | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-tele | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 3.06e-10 | 370 of 384 | nikkor-z50f12-f5.6-photopic | cut sagittal, field 1.19e1, frequencyPerMm 100 |
| lv – optiland | phaseStep.waves [waves] | 4.63e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1, line 1, ray 1876 |
| lv – optiland | convergence.maxAbs | 1.33e-2 | 384 of 384 | nikon-z-24-70f4s-open-best-ref-zoom0.5 | cut sagittal, field 2.40e1, frequencyPerMm 20 |
| lv – optiland | lattice.columns [cells] | 80 | 384 of 384 | sigma-35mm-f14-dg-hsm-a-f5.6-ref | — |
| lv – optiland | rays.compared [rays] | 3539384 | 384 of 384 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – optiland | waveMtf.flagged | 3.70e-11 | 14 of 384 | nikon-z-24-70f4s-open-best-ref-zoom0.5 | cut tangential, field 2.40e1, frequencyPerMm 70 |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.18e-9 | 370 of 384 | nikon-z-24-70f4s-open-best-ref-wide | cut tangential, field 4.33e1, frequencyPerMm 50 |
| lv – ref | phaseStep.waves [waves] | 4.63e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1, line 1, ray 1876 |
| lv – ref | convergence.maxAbs | 1.33e-2 | 384 of 384 | nikon-z-24-70f4s-open-best-ref-zoom0.5 | cut sagittal, field 2.40e1, frequencyPerMm 20 |
| lv – ref | lattice.columns [cells] | 80 | 384 of 384 | sigma-35mm-f14-dg-hsm-a-f5.6-ref | — |
| lv – ref | rays.compared [rays] | 3539384 | 384 of 384 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – ref | waveMtf.flagged | 3.14e-10 | 14 of 384 | nikon-z-24-70f4s-open-ref-wide | cut tangential, field 0, frequencyPerMm 80 |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.16e-9 | 370 of 384 | nikon-z-24-70f4s-open-best-ref-wide | cut tangential, field 4.33e1, frequencyPerMm 50 |
| optiland – ref | phaseStep.waves [waves] | 4.63e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1, line 1, ray 1876 |
| optiland – ref | convergence.maxAbs | 1.33e-2 | 384 of 384 | nikon-z-24-70f4s-open-best-ref-zoom0.5 | cut sagittal, field 2.40e1, frequencyPerMm 20 |
| optiland – ref | lattice.columns [cells] | 80 | 384 of 384 | sigma-35mm-f14-dg-hsm-a-f5.6-ref | — |
| optiland – ref | rays.compared [rays] | 3539384 | 384 of 384 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – ref | waveMtf.flagged | 3.15e-10 | 14 of 384 | nikon-z-24-70f4s-open-ref-zoom0.5 | cut tangential, field 2.40e1, frequencyPerMm 80 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: waveMtf.maxAbs 2.59e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.62e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.73e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.20e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.01e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.76e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.31e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.47e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.75e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: waveMtf.maxAbs 5.51e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.89e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.46e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-photopic | 3 | PASS: waveMtf.maxAbs 1.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.14e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.41e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: waveMtf.maxAbs 7.61e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.62e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.89e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 1.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.29e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.46e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.34e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.73e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.86e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 7.93e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.00e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.33e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.34e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.01e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 6.21e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.44e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.46e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: waveMtf.maxAbs 5.56e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.47e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.79e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | PASS: waveMtf.maxAbs 3.06e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.24e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.21e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: waveMtf.maxAbs 6.40e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.97e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.98e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 2.54e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.03e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: waveMtf.maxAbs 5.09e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.48e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.81e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 9.67e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 6.68e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.65e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.91e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.51e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.14e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: waveMtf.maxAbs 4.14e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.74e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | PASS: waveMtf.maxAbs 3.80e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.98e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: waveMtf.maxAbs 3.06e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.07e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.42e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 4.28e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.13e-11 (3 of 3) |
| nikkor-z50f12-f5.6-ref | 3 | PASS: waveMtf.maxAbs 2.40e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.13e-10 (3 of 3) |
| nikkor-z50f12-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 3.06e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.70e-10 (3 of 3) |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 2.30e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.33e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.05e-10 (3 of 3) |
| nikkor-z50f12-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 2.35e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.39e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.19e-10 (3 of 3) |
| nikkor-z50f12-f11-ref | 3 | PASS: waveMtf.maxAbs 1.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) |
| nikkor-z50f12-f11-photopic | 3 | PASS: waveMtf.maxAbs 4.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.77e-11 (3 of 3) |
| nikkor-z50f12-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.14e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.30e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.96e-11 (3 of 3) |
| nikkor-z50f12-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 2.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.38e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.77e-11 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: waveMtf.maxAbs 2.05e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-9 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-9 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-9 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.28e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.98e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.00e-9 (3 of 3) |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: waveMtf.maxAbs 1.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.24e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.28e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-photopic | 3 | PASS: waveMtf.maxAbs 7.96e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.17e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.19e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.31e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 8.61e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.19e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.11e-10 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: waveMtf.maxAbs 8.56e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.25e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.30e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 2.53e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.20e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.56e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.38e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.61e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.49e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: waveMtf.maxAbs 2.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.73e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.19e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | PASS: waveMtf.maxAbs 1.28e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.70e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.97e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 2.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.63e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.55e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: waveMtf.maxAbs 2.30e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.97e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.63e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 2.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.40e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 2.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.96e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.49e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 2.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.92e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: waveMtf.maxAbs 5.18e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.46e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | PASS: waveMtf.maxAbs 8.10e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.59e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.28e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: waveMtf.maxAbs 6.53e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.55e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 7.59e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.16e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.51e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: waveMtf.maxAbs 9.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.56e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.83e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 2.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.42e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.41e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: waveMtf.maxAbs 1.98e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.89e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | PASS: waveMtf.maxAbs 5.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.31e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.28e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 2.13e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.69e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.62e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | PASS: waveMtf.maxAbs 1.07e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.11e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: waveMtf.maxAbs 8.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-9 (3 of 3) | PASS: waveMtf.maxAbs 9.89e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.80e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.89e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: waveMtf.maxAbs 1.49e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.66e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 5.96e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.23e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.82e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.88e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.70e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.69e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 1.26e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.58e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: waveMtf.maxAbs 1.78e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.19e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.18e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.30e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.39e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: waveMtf.maxAbs 1.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.20e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.05e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | PASS: waveMtf.maxAbs 9.28e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.23e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 9.08e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.52e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.54e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | PASS: waveMtf.maxAbs 6.00e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.82e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.09e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: waveMtf.maxAbs 1.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.72e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.71e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 9.15e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.61e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.64e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: waveMtf.maxAbs 1.49e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.38e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 9.14e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 7.65e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.47e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.51e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 5.00e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.98e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.11e-11 (3 of 3) |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.23e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.24e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.26e-10 (3 of 3) |
| nikon-z-mc-105f28-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 8.23e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.60e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.54e-10 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 2.08e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.19e-11 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 7.47e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.50e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.74e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: waveMtf.maxAbs 1.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.30e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-photopic | 3 | PASS: waveMtf.maxAbs 1.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.78e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.44e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: waveMtf.maxAbs 2.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.32e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.31e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 1.65e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.13e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.23e-11 (3 of 3) |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.15e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.94e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.97e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.00e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.59e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.68e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.33e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.01e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.65e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.75e-10 (3 of 3) |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: waveMtf.maxAbs 1.19e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.33e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-photopic | 3 | PASS: waveMtf.maxAbs 2.78e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.71e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.83e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.42e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.40e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 3.17e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.66e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.69e-11 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.52e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.79e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 9.04e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.86e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.90e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.67e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.64e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.59e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.20e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.86e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.91e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: waveMtf.maxAbs 3.89e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.36e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.40e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | PASS: waveMtf.maxAbs 8.69e-13 (3 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: waveMtf.maxAbs 4.10e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.48e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.52e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 1.18e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.80e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-10 (3 of 3) |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: waveMtf.maxAbs 1.08e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.67e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.91e-10 (2 of 3) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.00e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (1 of 3) |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: waveMtf.maxAbs 2.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.96e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.73e-10 (2 of 3) |
| nikon-z-24-70f4s-open-photopic-wide | 3 | PASS: waveMtf.maxAbs 1.29e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.52e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.07e-10 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 6.81e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.21e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.16e-10 (1 of 3) |
| nikon-z-24-70f4s-open-photopic-tele | 3 | PASS: waveMtf.maxAbs 5.02e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.08e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.04e-10 (1 of 3) |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: waveMtf.maxAbs 1.31e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.18e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.16e-9 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 7.00e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (1 of 3) |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: waveMtf.maxAbs 2.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.55e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.82e-11 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 1.20e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.93e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.20e-10 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 9.02e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 2.97e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.26e-11 (1 of 3) |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: waveMtf.maxAbs 2.72e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.02e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.04e-9 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 2.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.77e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.84e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: waveMtf.maxAbs 9.17e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.38e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | PASS: waveMtf.maxAbs 9.54e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.30e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.22e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.05e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.04e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | PASS: waveMtf.maxAbs 5.68e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.23e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: waveMtf.maxAbs 2.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.32e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.56e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 2.30e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.03e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.08e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: waveMtf.maxAbs 8.13e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.22e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.81e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.81e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.49e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.46e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 4.66e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.36e-10 (3 of 3) |

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
