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
| Baseline hash | 6272a953ebfbc81093b8fd57da25658c7f311d68e66a96d41365d5b00e8f10ec |
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
| canon-ef-135-f2l-usm-f5.6-ref | fb6313aafaef4cc6341c86d507a91837b5deab4417ccdeb699274d5ec65de76f |
| canon-ef-135-f2l-usm-f5.6-photopic | b8452374e399797318f5bf31060a91fb510a16084a5afb3e6be6ef13063496e6 |
| canon-ef-135-f2l-usm-f5.6-best-ref | cfb40db60c1920a71df2e3577d416c7c11811ad983785f4a3d7c2d4f2ed45d2b |
| canon-ef-135-f2l-usm-f5.6-best-photopic | c24132ee4a6e88273a15fa7b038580d6af34b73039befbb7e08e041efa8d574e |
| canon-ef-135-f2l-usm-f11-ref | 3538c790a1ec7344597b37548aec69a2df46fcb828795c1bd678079a9ad78dc3 |
| canon-ef-135-f2l-usm-f11-photopic | 4b3888e3e44135a6341be52a170ef25e8f6613cfc09ea3338aff49182f2eb50f |
| canon-ef-135-f2l-usm-f11-best-ref | fde75efe0d80ad2af8615df46ff798a3e3bf044409d58bf1a3e6271068eb31a3 |
| canon-ef-135-f2l-usm-f11-best-photopic | 14847603e9b8882bc6969d619c27ff6639819038d8057f8c7863396cefdacad1 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 11fe04d53f56df0f4217bea7f1df0135e80ac3aa14b3ec6a13c163756b00c748 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 69f407ac3545cd29f360a84f86feb767647b5e08e0a6779f33da5e4b376d278e |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | fb61b013bd83b38b13284163754deed2b37a7d26ad84ca1fcc3db9ef49b1e0c4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 958bf2882dfe47a5c55bc24b117e7e75139fd4ade2540a30966e262c0ad79e11 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 7c3073c4e7dbedf0705593abf810e4d84fd34d97d7903728a421926d55fa4dc4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | f0f53b7a7c65c33fe10be69f5a2299f0490464845e77d681fb48f2bfcc10d3c6 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 8cec235dbb1353ecce18595c4106e7ca14174f1935bfc6ac081648abec9e23c8 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | df390f5440cda651600b10cad6ef60995d73c6561661120e2d5b08cd319ad60c |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | d697f32194b1ab48938fa6c330f96591bd77db9ac21e96e0c1ea8132c4c2ef3c |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 5b202930c7dda4b6795a60ebd2fad6f263e1c5e83b405c450763a7eb502201be |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | cf9ba22bb4b5f5bf556a3e643dbb2c6181e3e30f0c9926fc6500a9b95e649948 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 6520f64ae1c8802b4576f4ed4a716e119a6b2b0d14f972d490a2a35f44201181 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 40785d2e0c725183d5e2e44edc8b24972bc72b99c5c3d6e2c202d61530a13cb8 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | b27674ee8be7e06d18f990d3d541b8b636a5e100bf7d8db396bada22c5c0cb87 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 61ff3c8c2377dfd9a8075c75037b091e2d0a4da435126f81f12852a3f577b38c |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | ab907beab4a0590cad0157f85742779e5a7a3b3747964c85eaba7e49b694d70d |
| nikkor-z50f12-f5.6-ref | 93370aead6b9eb8def155ccf5f3a8780f977a3fda62560f1c44406cf3a1d7ceb |
| nikkor-z50f12-f5.6-photopic | 385c7c1d4e996fe30b06b3b3da60c5369b24e303e5504e9bf3a35a18c75b6116 |
| nikkor-z50f12-f5.6-best-ref | 40adc9d9360db7791e21a3b20e8c0c833654c32f19427a958dd20aced28d9ebf |
| nikkor-z50f12-f5.6-best-photopic | dfbc55f21b5bfdb94d025914183cf2ce81cae65921e142c50dc28881c41a97df |
| nikkor-z50f12-f11-ref | 1a34a84b12ddaa766ccc173f659f2b44483089c9560aed71cf85aad1528b9335 |
| nikkor-z50f12-f11-photopic | 54e397f8a3a165bf4289f3693de28a55d2d298c6b39859466d80e9c30bdba7e3 |
| nikkor-z50f12-f11-best-ref | e230a19defd0b95cada536016457031dac54e94566818a5c97cb2e8295bc18ac |
| nikkor-z50f12-f11-best-photopic | 00de2164a93bfc177a1e6b974b04656629fd4f9983b109f508a59969ef3209b8 |
| sony-fe-20mm-f18-g-f5.6-ref | 032904853c0718dd4654541b6a26e293c3d584c9cc75b880e3327126e0f62550 |
| sony-fe-20mm-f18-g-f5.6-photopic | 90768dd4f9cff94d6b4d1e8e89aa47b0fa795942082c1fcaa378b7e49c8c6b30 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 6a018b55d80117d42be3a4b4cd945b3c0930f9544519c314aaed262281e346a2 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | be213450ef3ba55cb97f2405f03cbe45eee22e9c339070562f09abfa44417bcb |
| sony-fe-20mm-f18-g-f11-ref | 66629bfed7b0cb8ab55ac7d50e6363ebefaa1922a52a3915db2e38f86de2b5be |
| sony-fe-20mm-f18-g-f11-photopic | f39722550d38b131d139e69c2e44e3e9dc81360822868e20e3019c23c2c64fff |
| sony-fe-20mm-f18-g-f11-best-ref | 14626b8ab553320b14dfa90cf59ba2bd7b6b433033a0db1169424e5e61cea556 |
| sony-fe-20mm-f18-g-f11-best-photopic | 91ab7e1b2e0a399a56c029c125fcf2ecb64abf78f33865037852fe9eab1f5dc3 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | cfd2f4b05ff511406ee2fcf6445bb368a1e65da0aef98100ce96e52afd7ee8cc |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 831d378e9ada52a0fce8d30676e13de4ca0529c0ae031a271b2f38a1348cbe92 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 7978e8b6317cb261a60c5258a804dc0819ed21ec238ced93389bbed06f7820c1 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 7d9377f6dfbb1db84d432d50fda201c28438d00c0c22b75a8c776e16e9e3b393 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1a94040d1d518dd6202eb3867b88ddfc677b2127c68f0e0c14e80f86628c70d7 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 0a597562d6a7ba2141c992046ef765f2ae5a0e8a3c5ab32309f274d58961e5ab |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | e8134f174ecafd2430ad50cfb2ba0d0166b13d1551f90aa9d8ac0ffddbb9a459 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 96bab879ff1b51208b31b3a7430f275fe19da370173d3ebbb626ff44879c27bd |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 83bc7aa668f82b6b22a13b1acc5b0f5af9ce2968947f11528dea3c0fbeef39e9 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | bee392758ecb32390004f98f6b12fd207c2819f3295a1c09572706c61e9f8a78 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | ace750e815937160ee6fb3ca0e4eb1171b25e239d6417acbed4fe523a22999d2 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | aab2ae39c1bde91b1bfd300d5a037d36ad1c6e728ef18aa1332875a69644862b |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 849578276ae0917f9e2215c51c30145952bb7126cce058be7687a974b9a8dd4a |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | e11209865b09b2ee83b249eeb30292b09385d4be43874895769ea5030815dd10 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 8216f33f93629b810fa907bef02c40e5bcd420baec4ce1d6c8a81dd3bb7cffd6 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | cad5d2b8147f295b805debf038e32279cd8034cf4c2f7e8fae16d195c0724c44 |
| nikon-z-24-70f4s-f5.6-ref-wide | ca4650a2f1cab8126617b31e5e196328c9e6047662925528c44d866fe77ec229 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | d6dd88710ac133d194348fdebe5810d09477eb6d54d7d92c5a43b78d42913ffc |
| nikon-z-24-70f4s-f5.6-ref-tele | 8b15e190d96badcfb4ffa2b7d3f4cdb4f140a3f73afd80711ce385e7b298967e |
| nikon-z-24-70f4s-f5.6-photopic-wide | e5c579f82819d0fd17bab9b165a0d68268e3277d38c601955fc2454ca897f119 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | f3c166adc1996382f804c64643c8cf33410c689ded36162fc394be6b97c998b9 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 931e283aaa42145afd364f3f3c3151db6f4d3fff9e17a11a221670001f510d17 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 534c54ca70f1030921493f470f9ee0d6a3d238dc3cd43dc509c0f8687e543ea7 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 672c59fea97eac2518485a560ed393242b1d93aea8dd8eb924af71026aad071b |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 44724094bec9dc249b2d0587cd4722285afa329dc7ed3247d80487c9bf044284 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 372038f23d287d7729c48ac2a25f7d3063cf9259c9373e3d3cd9634c822a03fd |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 2d5f17c805d756e7c3f19e592c2ce7579ff815aae1622cc5fcbaab7822011cbe |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | da4a032bcd346477d4a2b163b9649d4c74d1418c7e149a6dbdbea0522ee7b1f7 |
| nikon-z-24-70f4s-f11-ref-wide | a9fc28dc90bb6ec393151512c95cd9bbed404b4e7aeb6110aee02edda8728dfb |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | ee0b49410666fe2b115167d3da9eadc492967c802f4457c926b117aafe491428 |
| nikon-z-24-70f4s-f11-ref-tele | dc0cc7f4f4644e267e862cc6f513fefb957e91c401cd83910f1faafbba1851f1 |
| nikon-z-24-70f4s-f11-photopic-wide | f9c46dad3bd50217adca4144a3c1685011d2501a69a8bdb43d036d6159fdcb82 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | ef9cc2d09aabd8f2df0079079e7dacf171bf68a97c3c9fc282e70a956ebbc50b |
| nikon-z-24-70f4s-f11-photopic-tele | fce6bb24cd7ccf4a3348e9e142978fc681e2825120e5ffc4340b003c2396da9e |
| nikon-z-24-70f4s-f11-best-ref-wide | f286f2dfaa83049a3d5591572f3e47840cf0032e6287523202de250b62561b1f |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 43c74496798ae9506b5038882eb2fe2fc934ecc74286ea98fdea22129bc9db3f |
| nikon-z-24-70f4s-f11-best-ref-tele | 86e79118d05b624fe13b031ef8c4cd8440be28a8e1bff83babd4d8424dbcd0ac |
| nikon-z-24-70f4s-f11-best-photopic-wide | c9584523b47f693df0290b83b8b3ab63132e80dbe34e18a859114d18d4f42221 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | b618c6a4fc165f483f15a9ffe70b01d7c219b7bd22cbfe9a0e436fc6e275bb27 |
| nikon-z-24-70f4s-f11-best-photopic-tele | fb30f78b0ecd7ccb01891e21c74d1b182e1237ff34e092d8918217830fcea6f0 |
| nikon-z-mc-105f28-f5.6-ref | 817dcdb72789e4f19aeb0834fdf38f2df1f9981feeda0e849a6fbe878516246e |
| nikon-z-mc-105f28-f5.6-photopic | 84c9c5f86529a56eb59c98d9699d5ceabde325d4dfd0135ea13b231a7e19947f |
| nikon-z-mc-105f28-f5.6-best-ref | c083a9ad451157303b51e15cc837a6458e778df9940e23c2ef9b74bd6a6d67f9 |
| nikon-z-mc-105f28-f5.6-best-photopic | eca0ec2a6833ea0a6ff84fb4abb54d35c8f0884779586cd39085eeaf2d62a0dd |
| nikon-z-mc-105f28-f11-ref | c7f1b99704f56d90a1f686179860d380dced25c8cd033526fcecd4702519f9e4 |
| nikon-z-mc-105f28-f11-photopic | 89aff2fe03f9a0a39fb0c4bbc056824d10cf57309e3b559a660da10dee6a9f76 |
| nikon-z-mc-105f28-f11-best-ref | 731774161533fcf291c1c1269e0e88539a0dd9e65da2ae8f74753a0b5ca2b774 |
| nikon-z-mc-105f28-f11-best-photopic | ae84db3c87b9edba7b3828e4921efe3eb322811fd888ce54fe3f5a1d583abd10 |
| nikon-z-135f18-plena-f5.6-ref | 2f48866c86a5c78c9d9985591e3093550306be61ca1b1467ece2a6624837935b |
| nikon-z-135f18-plena-f5.6-photopic | 158e1ca33d4c80e41a7176d144ce4462055ecc078db8065a1e7efd3b541b9a4b |
| nikon-z-135f18-plena-f5.6-best-ref | 360b7b852f441111c8d5acb454934d8d59d4eca6b658012be793c9e01569543b |
| nikon-z-135f18-plena-f5.6-best-photopic | b0a31528f934800ab842ca760d487916e75db648fde6dd0283b9bd01be5f1863 |
| nikon-z-135f18-plena-f11-ref | 9370a359110296269721cb8c84b7071d063f75cc1e19f176fc6e2e3e747090cf |
| nikon-z-135f18-plena-f11-photopic | f7d5ed81109323d03e7cabbcec21709cb2ab62c8f37cde1fdbf26f38a7f0334b |
| nikon-z-135f18-plena-f11-best-ref | e6cc666f0c9c00122578523ed519d8b34a1e9dff2427209471960455699891ec |
| nikon-z-135f18-plena-f11-best-photopic | 074e0e4a6c56b4a12f20042d69bad4350e9e7dd8b535d60c0e0616a67be4f882 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 199c2510c32fa327ab1821e2fab7968e7ad6a4bb2b9a9298f59fa94887b06bb2 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3b787987b0523c174ae63e6af6a90b3d6dcfe4209652fd059e3648e5c37110d8 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 8471bafaa095d48e703f204c34d8b0f411aaa31d1f1d70865eb3772e019aacbe |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 0707769a9b97ca9e568da11158f9c6b0510d96d06b860c7348139034fa593d97 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | f3fcc3b63cd7c8c3a567b5f318c8a9dd3e469e78af15979fd5edb6778d604839 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1da493f139dea309fe55d78925e539663d88b123a25265afb55d8c454315f1d3 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | e8b060aaeb44cba02d576fc44c9725a7bd44cc6d4adb173931ddb86caf196c9b |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 2e4db53842a8d8cfe73ba2f2a6fa0dd5b6e72515eed989fa6f6bda3dac11d4b3 |
| nikon-z-24-70f4s-open-ref-wide | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 0c1e3e17b791b8b76cc5311d51e8dbd6ad9592081d1f4e853b775cf8253d1f53 |
| nikon-z-24-70f4s-open-ref-tele | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| nikon-z-24-70f4s-open-photopic-wide | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 7d159e41726968a2d56b1cdfce31279b854f316d34d0b1fcc3fb2603407882ae |
| nikon-z-24-70f4s-open-photopic-tele | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 |
| nikon-z-24-70f4s-open-best-ref-wide | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | e96a55399921f347d7e4cc74cfb6866870a4ce088279506abff48b416df2f370 |
| nikon-z-24-70f4s-open-best-ref-tele | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| nikon-z-24-70f4s-open-best-photopic-wide | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 167b20f99438e790211ba3b18cfc3484e6db92e7a3c4d3f83e3644d08704b87e |
| nikon-z-24-70f4s-open-best-photopic-tele | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 |
| nikon-z-24-70f4s-f8-ref-wide | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | cfe08daed58c95d06787698fb20876419f0d64aeda8b760fcb3c39f5892f1a89 |
| nikon-z-24-70f4s-f8-ref-tele | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| nikon-z-24-70f4s-f8-photopic-wide | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | e8dcb7a4c161cdf893e35068d743936e001736696a42d5ece8d19551c4d1d4f3 |
| nikon-z-24-70f4s-f8-photopic-tele | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf |
| nikon-z-24-70f4s-f8-best-ref-wide | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | c84d1fc5b9e9daa5909cc2530a508854046daba2153963653f5ff7f42ac3bdb5 |
| nikon-z-24-70f4s-f8-best-ref-tele | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 8466fba19f559cbb012fc31dd8927bce9a4cb7969288ac043407b4ba7104c28b |
| nikon-z-24-70f4s-f8-best-photopic-tele | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b |

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
| r7a | rays.trace | 128 | 3840 | lv – optiland | 128 PASS | 3840 PASS |
| r7a | rays.trace | 128 | 3840 | lv – ref | 128 PASS | 3840 PASS |
| r7a | rays.trace | 128 | 3840 | optiland – ref | 128 PASS | 3840 PASS |
| r8a | rays.trace | 128 | 832 | lv – optiland | 128 PASS | 832 PASS |
| r8a | rays.trace | 128 | 832 | lv – ref | 128 PASS | 832 PASS |
| r8a | rays.trace | 128 | 832 | optiland – ref | 128 PASS | 832 PASS |
| r9a | rays.trace | 128 | 512 | lv – optiland | 128 PASS | 512 PASS |
| r9a | rays.trace | 128 | 512 | lv – ref | 128 PASS | 512 PASS |
| r9a | rays.trace | 128 | 512 | optiland – ref | 128 PASS | 512 PASS |
| r10a | rays.trace | 128 | 768 | lv – optiland | 128 PASS | 768 PASS |
| r10a | rays.trace | 128 | 768 | lv – ref | 128 PASS | 768 PASS |
| r10a | rays.trace | 128 | 768 | optiland – ref | 128 PASS | 768 PASS |
| r11a | rays.trace | 128 | 384 | lv – optiland | 128 PASS | 384 PASS |
| r11a | rays.trace | 128 | 384 | lv – ref | 128 PASS | 384 PASS |
| r11a | rays.trace | 128 | 384 | optiland – ref | 128 PASS | 384 PASS |

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
| r7a | lv | 128 ok |
| r7a | optiland | 128 ok |
| r7a | ref | 128 ok |
| r8a | lv | 128 ok |
| r8a | optiland | 128 ok |
| r8a | ref | 128 ok |
| r9a | lv | 128 ok |
| r9a | optiland | 128 ok |
| r9a | ref | 128 ok |
| r10a | lv | 128 ok |
| r10a | optiland | 128 ok |
| r10a | ref | 128 ok |
| r11a | lv | 128 ok |
| r11a | optiland | 128 ok |
| r11a | ref | 128 ok |

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
| nikkor-z50f12-f5.6-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f5.6-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f5.6-best-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-best-ref | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
| nikkor-z50f12-f11-best-photopic | 1 | PASS: sag.maxScaled 3.54e-16 | PASS: sag.maxScaled 3.68e-16 | PASS: sag.maxScaled 3.54e-16 |
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
| nikon-z-mc-105f28-f5.6-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-best-ref | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-mc-105f28-f11-best-photopic | 1 | PASS: sag.maxScaled 2.71e-16 | PASS: sag.maxScaled 2.56e-16 | PASS: sag.maxScaled 3.77e-16 |
| nikon-z-135f18-plena-f5.6-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-best-ref | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
| nikon-z-135f18-plena-f11-best-photopic | 1 | PASS: sag.maxScaled 2.13e-16 | PASS: sag.maxScaled 2.02e-16 | PASS: sag.maxScaled 2.59e-16 |
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
| lv – optiland | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 2.13e-14 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, quantity entrancePupilSemiDiameter |
| lv – optiland | pupilRadius.maxAbs [mm] | 2.13e-14 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, quantity entrancePupilSemiDiameter |
| lv – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 2.05e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, quantity frontFocalZ |
| lv – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 3.41e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilZ.maxAbs [mm] | 3.41e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| lv – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 1.42e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, quantity entrancePupilSemiDiameter |
| lv – ref | pupilRadius.maxAbs [mm] | 1.42e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, quantity entrancePupilSemiDiameter |
| optiland – ref | firstOrder.maxAbs (≤ 1.00e-9 mm) | 3.87e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 0, quantity frontFocalZ |
| optiland – ref | pupilZ.maxScaled (≤ 1.00e-9 mm) | 1.02e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilZ.maxAbs [mm] | 1.02e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 3, quantity entrancePupilZ |
| optiland – ref | pupilRadius.maxScaled (≤ 1.00e-9 mm) | 2.13e-14 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, quantity entrancePupilSemiDiameter |
| optiland – ref | pupilRadius.maxAbs [mm] | 2.13e-14 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, quantity entrancePupilSemiDiameter |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f11-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm |
| canon-ef-135-f2l-usm-f11-photopic | 1 | PASS: firstOrder.maxAbs 2.42e-13 mm | PASS: firstOrder.maxAbs 1.14e-13 mm | PASS: firstOrder.maxAbs 1.85e-13 mm |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | PASS: firstOrder.maxAbs 2.91e-13 mm | PASS: firstOrder.maxAbs 2.70e-13 mm | PASS: pupilZ.maxScaled 8.53e-14 mm |
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
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: pupilZ.maxScaled 6.39e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 7.82e-14 mm | PASS: pupilZ.maxScaled 3.55e-14 mm |
| nikkor-z50f12-f5.6-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f11-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f11-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| nikkor-z50f12-f11-best-ref | 1 | PASS: firstOrder.maxAbs 4.26e-14 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm |
| nikkor-z50f12-f11-best-photopic | 1 | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 1.78e-14 mm |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | PASS: firstOrder.maxAbs 2.84e-14 mm | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 2.49e-14 mm |
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
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
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
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
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
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | PASS: firstOrder.maxAbs 2.13e-14 mm | PASS: firstOrder.maxAbs 1.42e-14 mm | PASS: firstOrder.maxAbs 7.11e-15 mm |
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
| nikon-z-24-70f4s-open-best-ref-wide | 1 | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.84e-14 mm | PASS: pupilZ.maxScaled 2.13e-14 mm |
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
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | PASS: firstOrder.maxAbs 3.55e-14 mm | PASS: firstOrder.maxAbs 5.68e-14 mm | PASS: firstOrder.maxAbs 2.84e-14 mm |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | PASS: firstOrder.maxAbs 1.55e-13 mm | PASS: firstOrder.maxAbs 7.11e-14 mm | PASS: firstOrder.maxAbs 1.08e-13 mm |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | PASS: firstOrder.maxAbs 2.38e-13 mm | PASS: firstOrder.maxAbs 1.42e-13 mm | PASS: firstOrder.maxAbs 1.90e-13 mm |

## r2

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | hits.maxDistance (≤ 1.00e-8 mm) | 1.17e-12 | nikon-z-24-70f4s-open-photopic-wide | field 4.33e1, line 4, ray 803, surface 20 |
| lv – optiland | direction.maxAbs (≤ 1.00e-9) | 1.04e-14 | sony-fe-20mm-f18-g-f5.6-photopic | field 4.75e1, line 1, ray 142 |
| lv – optiland | landing.maxDistance (≤ 1.00e-8 mm) | 7.18e-13 | nikon-z-24-70f4s-f8-photopic-zoom0.5 | field 2.40e1, line 3, ray 576 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 1144936 | — | — |
| lv – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.24e-12 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1, line 1, ray 548, surface 10 |
| lv – ref | direction.maxAbs (≤ 1.00e-9) | 1.50e-14 | nikon-z-24-70f4s-f11-photopic-wide | field 4.33e1, line 4, ray 365 |
| lv – ref | landing.maxDistance (≤ 1.00e-8 mm) | 7.63e-13 | nikon-z-24-70f4s-f5.6-ref-zoom0.5 | field 2.40e1, line 0, ray 513 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 1144936 | — | — |
| optiland – ref | hits.maxDistance (≤ 1.00e-8 mm) | 1.24e-12 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1, line 1, ray 548, surface 10 |
| optiland – ref | direction.maxAbs (≤ 1.00e-9) | 1.43e-14 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1, line 3, ray 399 |
| optiland – ref | landing.maxDistance (≤ 1.00e-8 mm) | 7.64e-13 | nikon-z-24-70f4s-f8-ref-zoom0.5 | field 2.40e1, line 0, ray 576 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 1144936 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 7.82e-14 mm | PASS: landing.maxDistance 1.17e-13 mm | 3009 / 66 / 0 | 3009 / 66 / 0 | 3009 / 66 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 15 | PASS: hits.maxDistance 1.29e-13 mm | PASS: landing.maxDistance 9.00e-14 mm | PASS: landing.maxDistance 1.46e-13 mm | 15043 / 332 / 0 | 15043 / 332 / 0 | 15043 / 332 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.21e-13 mm | PASS: landing.maxDistance 8.53e-14 mm | PASS: landing.maxDistance 1.17e-13 mm | 3009 / 66 / 0 | 3009 / 66 / 0 | 3009 / 66 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.29e-13 mm | PASS: landing.maxDistance 8.66e-14 mm | PASS: landing.maxDistance 1.49e-13 mm | 15043 / 332 / 0 | 15043 / 332 / 0 | 15043 / 332 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: hits.maxDistance 1.25e-13 mm | PASS: landing.maxDistance 7.82e-14 mm | PASS: hits.maxDistance 1.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 15 | PASS: hits.maxDistance 1.22e-13 mm | PASS: landing.maxDistance 9.95e-14 mm | PASS: hits.maxDistance 1.48e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: hits.maxDistance 1.25e-13 mm | PASS: landing.maxDistance 7.82e-14 mm | PASS: hits.maxDistance 1.04e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 15 | PASS: hits.maxDistance 1.22e-13 mm | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.48e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: hits.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 9.26e-14 mm | PASS: landing.maxDistance 9.95e-14 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 15 | PASS: landing.maxDistance 1.12e-13 mm | PASS: landing.maxDistance 8.89e-14 mm | PASS: hits.maxDistance 9.95e-14 mm | 15329 / 46 / 0 | 15329 / 46 / 0 | 15329 / 46 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 9.61e-14 mm | PASS: landing.maxDistance 9.95e-14 mm | 3067 / 8 / 0 | 3067 / 8 / 0 | 3067 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.12e-13 mm | PASS: landing.maxDistance 8.89e-14 mm | PASS: landing.maxDistance 9.95e-14 mm | 15329 / 46 / 0 | 15329 / 46 / 0 | 15329 / 46 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: landing.maxDistance 9.59e-14 mm | PASS: landing.maxDistance 6.76e-14 mm | PASS: landing.maxDistance 9.59e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 15 | PASS: landing.maxDistance 1.10e-13 mm | PASS: landing.maxDistance 9.95e-14 mm | PASS: landing.maxDistance 1.21e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: landing.maxDistance 9.95e-14 mm | PASS: landing.maxDistance 6.76e-14 mm | PASS: landing.maxDistance 9.95e-14 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 15 | PASS: landing.maxDistance 1.07e-13 mm | PASS: landing.maxDistance 1.03e-13 mm | PASS: landing.maxDistance 1.17e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: hits.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2687 / 388 / 0 | 2687 / 388 / 0 | 2687 / 388 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 13443 / 1932 / 0 | 13443 / 1932 / 0 | 13443 / 1932 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: hits.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 2687 / 388 / 0 | 2687 / 388 / 0 | 2687 / 388 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 13443 / 1932 / 0 | 13443 / 1932 / 0 | 13443 / 1932 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: hits.maxDistance 1.14e-13 mm | PASS: hits.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 1.44e-13 mm | 2713 / 362 / 0 | 2713 / 362 / 0 | 2713 / 362 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 15 | PASS: hits.maxDistance 1.40e-13 mm | PASS: hits.maxDistance 1.88e-13 mm | PASS: hits.maxDistance 2.02e-13 mm | 13591 / 1784 / 0 | 13591 / 1784 / 0 | 13591 / 1784 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: hits.maxDistance 1.14e-13 mm | PASS: hits.maxDistance 1.46e-13 mm | PASS: hits.maxDistance 1.44e-13 mm | 2713 / 362 / 0 | 2713 / 362 / 0 | 2713 / 362 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 15 | PASS: hits.maxDistance 1.40e-13 mm | PASS: hits.maxDistance 1.88e-13 mm | PASS: hits.maxDistance 2.02e-13 mm | 13591 / 1784 / 0 | 13591 / 1784 / 0 | 13591 / 1784 / 0 |
| nikkor-z50f12-f5.6-ref | 3 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 15 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikkor-z50f12-f11-ref | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 5.68e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 5.68e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikkor-z50f12-f11-best-ref | 3 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 5.68e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 5.68e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: landing.maxDistance 1.53e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 15 | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.53e-13 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: landing.maxDistance 1.63e-13 mm | PASS: hits.maxDistance 7.44e-13 mm | PASS: hits.maxDistance 7.47e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 15 | PASS: landing.maxDistance 1.81e-13 mm | PASS: hits.maxDistance 7.90e-13 mm | PASS: hits.maxDistance 7.91e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: landing.maxDistance 1.60e-13 mm | PASS: hits.maxDistance 7.44e-13 mm | PASS: hits.maxDistance 7.47e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 15 | PASS: landing.maxDistance 1.78e-13 mm | PASS: hits.maxDistance 7.90e-13 mm | PASS: hits.maxDistance 7.91e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: landing.maxDistance 3.92e-13 mm | PASS: landing.maxDistance 2.74e-13 mm | PASS: landing.maxDistance 3.27e-13 mm | 2965 / 110 / 0 | 2965 / 110 / 0 | 2965 / 110 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 15 | PASS: landing.maxDistance 3.84e-13 mm | PASS: landing.maxDistance 2.60e-13 mm | PASS: landing.maxDistance 3.87e-13 mm | 14817 / 558 / 0 | 14817 / 558 / 0 | 14817 / 558 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: landing.maxDistance 3.95e-13 mm | PASS: landing.maxDistance 2.74e-13 mm | PASS: landing.maxDistance 3.27e-13 mm | 2965 / 110 / 0 | 2965 / 110 / 0 | 2965 / 110 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 15 | PASS: landing.maxDistance 3.88e-13 mm | PASS: landing.maxDistance 2.60e-13 mm | PASS: landing.maxDistance 3.91e-13 mm | 14817 / 558 / 0 | 14817 / 558 / 0 | 14817 / 558 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: landing.maxDistance 2.88e-13 mm | PASS: landing.maxDistance 2.20e-13 mm | PASS: landing.maxDistance 3.45e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 15 | PASS: landing.maxDistance 3.86e-13 mm | PASS: landing.maxDistance 2.29e-13 mm | PASS: landing.maxDistance 3.63e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: landing.maxDistance 2.84e-13 mm | PASS: landing.maxDistance 2.20e-13 mm | PASS: landing.maxDistance 3.48e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 15 | PASS: landing.maxDistance 3.82e-13 mm | PASS: landing.maxDistance 2.29e-13 mm | PASS: landing.maxDistance 3.60e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: landing.maxDistance 1.43e-13 mm | PASS: landing.maxDistance 1.72e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 2855 / 220 / 0 | 2855 / 220 / 0 | 2855 / 220 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 15 | PASS: landing.maxDistance 1.92e-13 mm | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 2.03e-13 mm | 14265 / 1110 / 0 | 14265 / 1110 / 0 | 14265 / 1110 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.39e-13 mm | PASS: landing.maxDistance 1.68e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 2855 / 220 / 0 | 2855 / 220 / 0 | 2855 / 220 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.89e-13 mm | PASS: landing.maxDistance 1.39e-13 mm | PASS: landing.maxDistance 1.99e-13 mm | 14265 / 1110 / 0 | 14265 / 1110 / 0 | 14265 / 1110 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: landing.maxDistance 1.56e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 1.78e-13 mm | 3035 / 40 / 0 | 3035 / 40 / 0 | 3035 / 40 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 15 | PASS: landing.maxDistance 2.59e-13 mm | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 2.49e-13 mm | 15169 / 206 / 0 | 15169 / 206 / 0 | 15169 / 206 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: landing.maxDistance 1.60e-13 mm | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 1.78e-13 mm | 3035 / 40 / 0 | 3035 / 40 / 0 | 3035 / 40 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 15 | PASS: landing.maxDistance 2.59e-13 mm | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 2.49e-13 mm | 15169 / 206 / 0 | 15169 / 206 / 0 | 15169 / 206 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: hits.maxDistance 1.13e-12 mm | PASS: hits.maxDistance 1.13e-12 mm | PASS: hits.maxDistance 1.13e-12 mm | 3005 / 70 / 0 | 3005 / 70 / 0 | 3005 / 70 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2993 / 82 / 0 | 2993 / 82 / 0 | 2993 / 82 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.88e-13 mm | 2891 / 184 / 0 | 2891 / 184 / 0 | 2891 / 184 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | PASS: hits.maxDistance 1.17e-12 mm | 15045 / 330 / 0 | 15045 / 330 / 0 | 15045 / 330 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 14971 / 404 / 0 | 14971 / 404 / 0 | 14971 / 404 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 15 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 14459 / 916 / 0 | 14459 / 916 / 0 | 14459 / 916 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: hits.maxDistance 1.13e-12 mm | PASS: hits.maxDistance 1.13e-12 mm | PASS: hits.maxDistance 1.13e-12 mm | 3005 / 70 / 0 | 3005 / 70 / 0 | 3005 / 70 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 2993 / 82 / 0 | 2993 / 82 / 0 | 2993 / 82 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.88e-13 mm | 2891 / 184 / 0 | 2891 / 184 / 0 | 2891 / 184 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.14e-12 mm | PASS: hits.maxDistance 1.17e-12 mm | 15045 / 330 / 0 | 15045 / 330 / 0 | 15045 / 330 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 14971 / 404 / 0 | 14971 / 404 / 0 | 14971 / 404 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 15 | PASS: landing.maxDistance 1.32e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 14459 / 916 / 0 | 14459 / 916 / 0 | 14459 / 916 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: hits.maxDistance 9.06e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 15 | PASS: hits.maxDistance 9.42e-13 mm | PASS: hits.maxDistance 1.24e-12 mm | PASS: hits.maxDistance 1.24e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 15 | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: hits.maxDistance 9.06e-13 mm | PASS: hits.maxDistance 1.08e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 9.96e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 15 | PASS: hits.maxDistance 9.42e-13 mm | PASS: hits.maxDistance 1.24e-12 mm | PASS: hits.maxDistance 1.24e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.02e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 15 | PASS: hits.maxDistance 1.07e-12 mm | PASS: hits.maxDistance 1.06e-12 mm | PASS: hits.maxDistance 1.07e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: landing.maxDistance 1.60e-13 mm | PASS: hits.maxDistance 7.45e-13 mm | PASS: hits.maxDistance 7.43e-13 mm | 2951 / 124 / 0 | 2951 / 124 / 0 | 2951 / 124 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 15 | PASS: landing.maxDistance 1.74e-13 mm | PASS: hits.maxDistance 7.44e-13 mm | PASS: hits.maxDistance 7.44e-13 mm | 14761 / 614 / 0 | 14761 / 614 / 0 | 14761 / 614 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.64e-13 mm | PASS: hits.maxDistance 7.45e-13 mm | PASS: hits.maxDistance 7.43e-13 mm | 2951 / 124 / 0 | 2951 / 124 / 0 | 2951 / 124 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 15 | PASS: landing.maxDistance 1.74e-13 mm | PASS: hits.maxDistance 7.44e-13 mm | PASS: hits.maxDistance 7.44e-13 mm | 14761 / 614 / 0 | 14761 / 614 / 0 | 14761 / 614 / 0 |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 15 | PASS: hits.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: landing.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.28e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 15 | PASS: hits.maxDistance 1.35e-13 mm | PASS: landing.maxDistance 1.31e-13 mm | PASS: landing.maxDistance 1.46e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: landing.maxDistance 1.03e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: landing.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: landing.maxDistance 1.28e-13 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | PASS: hits.maxDistance 1.04e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: hits.maxDistance 3.93e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2811 / 264 / 0 | 2811 / 264 / 0 | 2811 / 264 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 14027 / 1348 / 0 | 14027 / 1348 / 0 | 14027 / 1348 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: hits.maxDistance 3.93e-13 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 2811 / 264 / 0 | 2811 / 264 / 0 | 2811 / 264 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.05e-12 mm | 14027 / 1348 / 0 | 14027 / 1348 / 0 | 14027 / 1348 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: landing.maxDistance 6.76e-14 mm | PASS: hits.maxDistance 9.98e-13 mm | PASS: hits.maxDistance 9.98e-13 mm | 2969 / 106 / 0 | 2969 / 106 / 0 | 2969 / 106 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 15 | PASS: landing.maxDistance 8.18e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 14763 / 612 / 0 | 14763 / 612 / 0 | 14763 / 612 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: landing.maxDistance 6.76e-14 mm | PASS: hits.maxDistance 9.98e-13 mm | PASS: hits.maxDistance 9.98e-13 mm | 2969 / 106 / 0 | 2969 / 106 / 0 | 2969 / 106 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 15 | PASS: landing.maxDistance 8.18e-14 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | 14763 / 612 / 0 | 14763 / 612 / 0 | 14763 / 612 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.17e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2853 / 222 / 0 | 2853 / 222 / 0 | 2853 / 222 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: landing.maxDistance 1.50e-13 mm | PASS: hits.maxDistance 9.87e-13 mm | PASS: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | 14061 / 1314 / 0 | 14061 / 1314 / 0 | 14061 / 1314 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 9.96e-13 mm | 14261 / 1114 / 0 | 14261 / 1114 / 0 | 14261 / 1114 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.88e-13 mm | 13043 / 2332 / 0 | 13043 / 2332 / 0 | 13043 / 2332 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: hits.maxDistance 9.97e-13 mm | PASS: hits.maxDistance 1.02e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | 2809 / 266 / 0 | 2809 / 266 / 0 | 2809 / 266 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.17e-13 mm | PASS: hits.maxDistance 1.00e-12 mm | 2853 / 222 / 0 | 2853 / 222 / 0 | 2853 / 222 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: landing.maxDistance 1.50e-13 mm | PASS: hits.maxDistance 9.87e-13 mm | PASS: hits.maxDistance 9.86e-13 mm | 2607 / 468 / 0 | 2607 / 468 / 0 | 2607 / 468 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 15 | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.03e-12 mm | PASS: hits.maxDistance 1.16e-12 mm | 14061 / 1314 / 0 | 14061 / 1314 / 0 | 14061 / 1314 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 9.96e-13 mm | 14261 / 1114 / 0 | 14261 / 1114 / 0 | 14261 / 1114 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.00e-12 mm | PASS: hits.maxDistance 9.88e-13 mm | 13043 / 2332 / 0 | 13043 / 2332 / 0 | 13043 / 2332 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.21e-12 mm | PASS: hits.maxDistance 1.19e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: hits.maxDistance 9.10e-13 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: hits.maxDistance 9.99e-13 mm | PASS: hits.maxDistance 1.21e-12 mm | PASS: hits.maxDistance 1.19e-12 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: landing.maxDistance 1.24e-13 mm | PASS: hits.maxDistance 9.81e-13 mm | PASS: hits.maxDistance 9.73e-13 mm | 3075 / 0 / 0 | 3075 / 0 / 0 | 3075 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 15 | PASS: hits.maxDistance 1.01e-12 mm | PASS: hits.maxDistance 1.10e-12 mm | PASS: hits.maxDistance 1.11e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 15 | PASS: hits.maxDistance 1.05e-12 mm | PASS: hits.maxDistance 1.17e-12 mm | PASS: hits.maxDistance 1.20e-12 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 15 | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | PASS: hits.maxDistance 9.95e-13 mm | 15375 / 0 / 0 | 15375 / 0 / 0 | 15375 / 0 / 0 |

## r3

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | opticalPath.maxAbs (≤ 2.00e-5 waves) | 1.94e-9 | nikon-z-24-70f4s-f5.6-photopic-wide | field 4.33e1, line 1, ray 1007 |
| lv – optiland | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.12e-9 | sony-fe-20mm-f18-g-f5.6-photopic | field 4.75e1, line 1, ray 142 |
| lv – optiland | opd.maxAbs (≤ 2.00e-5 waves) | 2.25e-9 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | field 3.15e0, line 0, ray 301 |
| lv – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 2.96e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 4.33e1, line 1, ray 365 |
| lv – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 2.96e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 4.33e1, line 1, ray 365 |
| lv – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.54e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1, line 1, ray 806 |
| optiland – ref | opticalPath.maxAbs (≤ 2.00e-5 waves) | 3.02e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1, line 1, ray 399 |
| optiland – ref | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 3.02e-9 | nikon-z-24-70f4s-f8-photopic-wide | field 4.33e1, line 1, ray 399 |
| optiland – ref | opd.maxAbs (≤ 2.00e-5 waves) | 2.60e-9 | nikon-z-24-70f4s-f11-photopic-wide | field 2.42e1, line 1, ray 644 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f5.6-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 3.34e-10 waves |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 15 | PASS: opd.maxAbs 3.07e-10 waves | PASS: opd.maxAbs 3.90e-10 waves | PASS: opd.maxAbs 3.34e-10 waves |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves |
| canon-ef-135-f2l-usm-f11-photopic | 15 | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 2.56e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opticalPathToImage.maxAbs 2.42e-10 waves |
| canon-ef-135-f2l-usm-f11-best-photopic | 15 | PASS: opd.maxAbs 3.34e-10 waves | PASS: opd.maxAbs 3.07e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 15 | PASS: opticalPathToImage.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 15 | PASS: opd.maxAbs 2.56e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 3.02e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: opticalPathToImage.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPathToImage.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 15 | PASS: opd.maxAbs 3.02e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: opd.maxAbs 1.93e-10 waves | PASS: opticalPath.maxAbs 1.45e-10 waves | PASS: opticalPathToImage.maxAbs 1.93e-10 waves |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 15 | PASS: opd.maxAbs 3.63e-10 waves | PASS: opd.maxAbs 2.42e-10 waves | PASS: opd.maxAbs 2.42e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: opd.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.16e-9 waves | PASS: opd.maxAbs 1.31e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves | PASS: opticalPath.maxAbs 1.57e-9 waves |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 15 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 3.63e-10 waves | PASS: opticalPath.maxAbs 4.23e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves | PASS: opticalPath.maxAbs 2.90e-10 waves |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 15 | PASS: opd.maxAbs 6.05e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| nikkor-z50f12-f5.6-ref | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opticalPath.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 1.84e-9 waves |
| nikkor-z50f12-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 1.13e-9 waves | PASS: opd.maxAbs 2.06e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: opd.maxAbs 9.67e-10 waves | PASS: opticalPath.maxAbs 1.74e-9 waves | PASS: opd.maxAbs 1.84e-9 waves |
| nikkor-z50f12-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.13e-9 waves | PASS: opd.maxAbs 2.18e-9 waves | PASS: opd.maxAbs 2.18e-9 waves |
| nikkor-z50f12-f11-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 7.74e-10 waves |
| nikkor-z50f12-f11-photopic | 15 | PASS: opticalPath.maxAbs 1.09e-9 waves | PASS: opticalPath.maxAbs 9.68e-10 waves | PASS: opd.maxAbs 7.80e-10 waves |
| nikkor-z50f12-f11-best-ref | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 7.74e-10 waves |
| nikkor-z50f12-f11-best-photopic | 15 | PASS: opticalPath.maxAbs 1.09e-9 waves | PASS: opticalPath.maxAbs 9.68e-10 waves | PASS: opd.maxAbs 7.80e-10 waves |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPathToImage.maxAbs 1.64e-9 waves |
| sony-fe-20mm-f18-g-f5.6-photopic | 15 | PASS: opticalPathToImage.maxAbs 2.12e-9 waves | PASS: opticalPathToImage.maxAbs 2.18e-9 waves | PASS: opticalPathToImage.maxAbs 2.18e-9 waves |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: opd.maxAbs 3.39e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 15 | PASS: opticalPathToImage.maxAbs 2.06e-9 waves | PASS: opticalPathToImage.maxAbs 2.12e-9 waves | PASS: opticalPathToImage.maxAbs 2.12e-9 waves |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.16e-9 waves | PASS: opticalPathToImage.maxAbs 1.16e-9 waves |
| sony-fe-20mm-f18-g-f11-photopic | 15 | PASS: opd.maxAbs 4.23e-10 waves | PASS: opticalPathToImage.maxAbs 1.23e-9 waves | PASS: opticalPathToImage.maxAbs 1.28e-9 waves |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPathToImage.maxAbs 1.16e-9 waves | PASS: opticalPathToImage.maxAbs 1.21e-9 waves |
| sony-fe-20mm-f18-g-f11-best-photopic | 15 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPathToImage.maxAbs 1.23e-9 waves | PASS: opticalPathToImage.maxAbs 1.27e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: opd.maxAbs 1.16e-9 waves | PASS: opticalPathToImage.maxAbs 9.67e-10 waves | PASS: opticalPathToImage.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 15 | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.78e-9 waves | PASS: opd.maxAbs 1.78e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: opd.maxAbs 1.35e-9 waves | PASS: opd.maxAbs 9.67e-10 waves | PASS: opticalPathToImage.maxAbs 1.35e-9 waves |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 15 | PASS: opd.maxAbs 1.69e-9 waves | PASS: opd.maxAbs 1.56e-9 waves | PASS: opd.maxAbs 2.01e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: opd.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.16e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 15 | PASS: opd.maxAbs 2.05e-9 waves | PASS: opd.maxAbs 1.84e-9 waves | PASS: opd.maxAbs 1.94e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.55e-9 waves |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 15 | PASS: opd.maxAbs 2.25e-9 waves | PASS: opd.maxAbs 1.84e-9 waves | PASS: opd.maxAbs 2.01e-9 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.35e-10 waves | PASS: opticalPathToImage.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 15 | PASS: opd.maxAbs 5.59e-10 waves | PASS: opd.maxAbs 3.90e-10 waves | PASS: opd.maxAbs 4.23e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 15 | PASS: opd.maxAbs 6.13e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 4.66e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opd.maxAbs 4.23e-10 waves | PASS: opd.maxAbs 5.02e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 3.39e-10 waves |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 15 | PASS: opd.maxAbs 6.69e-10 waves | PASS: opd.maxAbs 4.46e-10 waves | PASS: opticalPathToImage.maxAbs 4.46e-10 waves |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 2.18e-9 waves | PASS: opd.maxAbs 2.13e-9 waves |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.50e-9 waves |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.69e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-wide | 15 | PASS: opticalPath.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 2.48e-9 waves | PASS: opticalPath.maxAbs 2.48e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 2.12e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-f5.6-photopic-tele | 15 | PASS: opd.maxAbs 5.57e-10 waves | PASS: opticalPath.maxAbs 2.24e-9 waves | PASS: opticalPath.maxAbs 2.36e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 2.18e-9 waves | PASS: opd.maxAbs 2.13e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.64e-9 waves | PASS: opticalPath.maxAbs 1.50e-9 waves |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: opd.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.74e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 15 | PASS: opticalPath.maxAbs 1.94e-9 waves | PASS: opd.maxAbs 2.48e-9 waves | PASS: opticalPath.maxAbs 2.48e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opticalPath.maxAbs 2.12e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 15 | PASS: opd.maxAbs 5.57e-10 waves | PASS: opticalPath.maxAbs 2.24e-9 waves | PASS: opticalPath.maxAbs 2.36e-9 waves |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: opticalPath.maxAbs 1.11e-9 waves | PASS: opticalPath.maxAbs 2.37e-9 waves | PASS: opticalPath.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.69e-9 waves |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: opd.maxAbs 1.02e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f11-photopic-wide | 15 | PASS: opticalPath.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 2.96e-9 waves | PASS: opticalPath.maxAbs 2.90e-9 waves |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 15 | PASS: opd.maxAbs 1.08e-9 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPathToImage.maxAbs 2.12e-9 waves |
| nikon-z-24-70f4s-f11-photopic-tele | 15 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.87e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: opticalPath.maxAbs 1.11e-9 waves | PASS: opticalPath.maxAbs 2.37e-9 waves | PASS: opticalPath.maxAbs 2.27e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 9.19e-10 waves | PASS: opticalPath.maxAbs 1.60e-9 waves | PASS: opticalPath.maxAbs 1.69e-9 waves |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: opd.maxAbs 1.02e-9 waves | PASS: opticalPath.maxAbs 1.35e-9 waves | PASS: opticalPath.maxAbs 1.45e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-wide | 15 | PASS: opticalPath.maxAbs 1.23e-9 waves | PASS: opticalPath.maxAbs 2.96e-9 waves | PASS: opticalPath.maxAbs 2.90e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 15 | PASS: opd.maxAbs 1.08e-9 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| nikon-z-24-70f4s-f11-best-photopic-tele | 15 | PASS: opticalPath.maxAbs 1.45e-9 waves | PASS: opd.maxAbs 1.87e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 7.74e-10 waves |
| nikon-z-mc-105f28-f5.6-photopic | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.09e-9 waves | PASS: opd.maxAbs 1.15e-9 waves |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 7.74e-10 waves | PASS: opd.maxAbs 7.26e-10 waves |
| nikon-z-mc-105f28-f5.6-best-photopic | 15 | PASS: opd.maxAbs 7.26e-10 waves | PASS: opd.maxAbs 1.09e-9 waves | PASS: opd.maxAbs 1.15e-9 waves |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f11-photopic | 15 | PASS: opd.maxAbs 6.05e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 5.44e-10 waves |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: opticalPathToImage.maxAbs 3.39e-10 waves | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 3.39e-10 waves |
| nikon-z-mc-105f28-f11-best-photopic | 15 | PASS: opd.maxAbs 5.57e-10 waves | PASS: opd.maxAbs 4.84e-10 waves | PASS: opd.maxAbs 4.84e-10 waves |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.16e-9 waves |
| nikon-z-135f18-plena-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 9.73e-10 waves | PASS: opd.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: opd.maxAbs 5.32e-10 waves | PASS: opticalPath.maxAbs 1.06e-9 waves | PASS: opd.maxAbs 1.16e-9 waves |
| nikon-z-135f18-plena-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 9.73e-10 waves | PASS: opd.maxAbs 1.21e-9 waves | PASS: opticalPath.maxAbs 1.21e-9 waves |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: opticalPath.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f11-photopic | 15 | PASS: opticalPath.maxAbs 9.47e-10 waves | PASS: opticalPath.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: opd.maxAbs 4.84e-10 waves | PASS: opticalPath.maxAbs 9.67e-10 waves | PASS: opd.maxAbs 1.06e-9 waves |
| nikon-z-135f18-plena-f11-best-photopic | 15 | PASS: opticalPath.maxAbs 9.47e-10 waves | PASS: opticalPath.maxAbs 1.27e-9 waves | PASS: opticalPath.maxAbs 1.33e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: opd.maxAbs 8.47e-10 waves | PASS: opd.maxAbs 1.33e-9 waves | PASS: opd.maxAbs 1.31e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 15 | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: opd.maxAbs 8.47e-10 waves | PASS: opd.maxAbs 1.31e-9 waves | PASS: opd.maxAbs 1.31e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 15 | PASS: opticalPath.maxAbs 1.33e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves | PASS: opticalPath.maxAbs 1.63e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.33e-9 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 15 | PASS: opd.maxAbs 2.30e-10 waves | PASS: opticalPath.maxAbs 1.66e-9 waves | PASS: opticalPath.maxAbs 1.66e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: opd.maxAbs 1.93e-10 waves | PASS: opd.maxAbs 1.33e-9 waves | PASS: opd.maxAbs 1.35e-9 waves |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 15 | PASS: opd.maxAbs 2.05e-10 waves | PASS: opticalPath.maxAbs 1.66e-9 waves | PASS: opticalPathToImage.maxAbs 1.69e-9 waves |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opd.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 8.22e-10 waves | PASS: opticalPath.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 1.40e-9 waves |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-open-photopic-wide | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.17e-9 waves | PASS: opd.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 1.95e-9 waves |
| nikon-z-24-70f4s-open-photopic-tele | 15 | PASS: opd.maxAbs 1.01e-9 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opd.maxAbs 2.03e-9 waves | PASS: opd.maxAbs 2.03e-9 waves |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 8.22e-10 waves | PASS: opticalPath.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 1.40e-9 waves |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: opd.maxAbs 4.35e-10 waves | PASS: opd.maxAbs 1.64e-9 waves | PASS: opd.maxAbs 1.74e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-wide | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.18e-9 waves | PASS: opticalPath.maxAbs 2.42e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.17e-9 waves | PASS: opd.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 1.95e-9 waves |
| nikon-z-24-70f4s-open-best-photopic-tele | 15 | PASS: opd.maxAbs 1.01e-9 waves | PASS: opticalPath.maxAbs 1.89e-9 waves | PASS: opticalPath.maxAbs 1.94e-9 waves |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 2.27e-9 waves | PASS: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-f8-photopic-wide | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 3.02e-9 waves |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.72e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| nikon-z-24-70f4s-f8-photopic-tele | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: opd.maxAbs 1.40e-9 waves | PASS: opticalPath.maxAbs 2.27e-9 waves | PASS: opticalPath.maxAbs 2.56e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: opticalPath.maxAbs 8.71e-10 waves | PASS: opd.maxAbs 1.55e-9 waves | PASS: opticalPath.maxAbs 1.60e-9 waves |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: opd.maxAbs 3.87e-10 waves | PASS: opticalPath.maxAbs 1.26e-9 waves | PASS: opticalPath.maxAbs 1.26e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-wide | 15 | PASS: opd.maxAbs 1.84e-9 waves | PASS: opticalPath.maxAbs 2.66e-9 waves | PASS: opticalPath.maxAbs 3.02e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 15 | PASS: opticalPath.maxAbs 1.72e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves | PASS: opticalPath.maxAbs 2.06e-9 waves |
| nikon-z-24-70f4s-f8-best-photopic-tele | 15 | PASS: opd.maxAbs 1.23e-9 waves | PASS: opd.maxAbs 1.75e-9 waves | PASS: opd.maxAbs 1.75e-9 waves |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.10e-11 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | cut tangential, field 2.56e1, frequencyPerMm 100 |
| lv – optiland | rays.compared [rays] | 1144936 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.48e-11 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 92 |
| lv – ref | rays.compared [rays] | 1144936 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.43e-11 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 94 |
| optiland – ref | rays.compared [rays] | 1144936 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lines.compared [lines] | 5 | canon-ef-135-f2l-usm-f5.6-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: mtf.maxAbs 8.29e-13 | PASS: mtf.maxAbs 6.43e-13 | PASS: mtf.maxAbs 9.10e-13 |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | PASS: mtf.maxAbs 4.70e-13 | PASS: mtf.maxAbs 4.39e-13 | PASS: mtf.maxAbs 5.73e-13 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: mtf.maxAbs 6.97e-13 | PASS: mtf.maxAbs 5.98e-13 | PASS: mtf.maxAbs 9.78e-13 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.90e-13 | PASS: mtf.maxAbs 5.45e-13 | PASS: mtf.maxAbs 6.11e-13 |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: mtf.maxAbs 3.34e-13 | PASS: mtf.maxAbs 2.37e-13 | PASS: mtf.maxAbs 4.88e-13 |
| canon-ef-135-f2l-usm-f11-photopic | 3 | PASS: mtf.maxAbs 1.13e-12 | PASS: mtf.maxAbs 8.15e-13 | PASS: mtf.maxAbs 4.74e-13 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: mtf.maxAbs 3.53e-13 | PASS: mtf.maxAbs 2.25e-13 | PASS: mtf.maxAbs 5.00e-13 |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.10e-12 | PASS: mtf.maxAbs 7.10e-13 | PASS: mtf.maxAbs 4.66e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: mtf.maxAbs 4.27e-13 | PASS: mtf.maxAbs 6.20e-13 | PASS: mtf.maxAbs 1.05e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | PASS: mtf.maxAbs 4.42e-13 | PASS: mtf.maxAbs 6.27e-13 | PASS: mtf.maxAbs 1.07e-12 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: mtf.maxAbs 4.89e-13 | PASS: mtf.maxAbs 4.45e-13 | PASS: mtf.maxAbs 8.47e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.01e-13 | PASS: mtf.maxAbs 3.86e-13 | PASS: mtf.maxAbs 6.36e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: mtf.maxAbs 2.61e-13 | PASS: mtf.maxAbs 3.00e-13 | PASS: mtf.maxAbs 5.37e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | PASS: mtf.maxAbs 4.14e-13 | PASS: mtf.maxAbs 2.90e-13 | PASS: mtf.maxAbs 4.97e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: mtf.maxAbs 2.62e-13 | PASS: mtf.maxAbs 3.09e-13 | PASS: mtf.maxAbs 5.57e-13 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.40e-13 | PASS: mtf.maxAbs 3.08e-13 | PASS: mtf.maxAbs 5.17e-13 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: mtf.maxAbs 6.39e-13 | PASS: mtf.maxAbs 6.52e-12 | PASS: mtf.maxAbs 7.16e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | PASS: mtf.maxAbs 2.56e-13 | PASS: mtf.maxAbs 1.18e-12 | PASS: mtf.maxAbs 1.03e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: mtf.maxAbs 6.46e-13 | PASS: mtf.maxAbs 6.32e-12 | PASS: mtf.maxAbs 6.96e-12 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.95e-13 | PASS: mtf.maxAbs 2.90e-12 | PASS: mtf.maxAbs 2.80e-12 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: mtf.maxAbs 4.80e-13 | PASS: mtf.maxAbs 1.20e-12 | PASS: mtf.maxAbs 7.23e-13 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | PASS: mtf.maxAbs 2.59e-13 | PASS: mtf.maxAbs 4.15e-13 | PASS: mtf.maxAbs 5.27e-13 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: mtf.maxAbs 4.43e-13 | PASS: mtf.maxAbs 1.15e-12 | PASS: mtf.maxAbs 7.11e-13 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | PASS: mtf.maxAbs 2.56e-13 | PASS: mtf.maxAbs 5.26e-13 | PASS: mtf.maxAbs 7.59e-13 |
| nikkor-z50f12-f5.6-ref | 3 | PASS: mtf.maxAbs 3.12e-12 | PASS: mtf.maxAbs 7.45e-12 | PASS: mtf.maxAbs 7.39e-12 |
| nikkor-z50f12-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.89e-12 | PASS: mtf.maxAbs 5.89e-12 | PASS: mtf.maxAbs 7.10e-12 |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: mtf.maxAbs 3.08e-12 | PASS: mtf.maxAbs 7.34e-12 | PASS: mtf.maxAbs 7.31e-12 |
| nikkor-z50f12-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.82e-12 | PASS: mtf.maxAbs 5.74e-12 | PASS: mtf.maxAbs 7.17e-12 |
| nikkor-z50f12-f11-ref | 3 | PASS: mtf.maxAbs 9.58e-13 | PASS: mtf.maxAbs 6.61e-13 | PASS: mtf.maxAbs 1.62e-12 |
| nikkor-z50f12-f11-photopic | 3 | PASS: mtf.maxAbs 8.24e-13 | PASS: mtf.maxAbs 1.91e-13 | PASS: mtf.maxAbs 7.44e-13 |
| nikkor-z50f12-f11-best-ref | 3 | PASS: mtf.maxAbs 9.25e-13 | PASS: mtf.maxAbs 6.89e-13 | PASS: mtf.maxAbs 1.61e-12 |
| nikkor-z50f12-f11-best-photopic | 3 | PASS: mtf.maxAbs 9.26e-13 | PASS: mtf.maxAbs 1.33e-13 | PASS: mtf.maxAbs 8.38e-13 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: mtf.maxAbs 1.17e-12 | PASS: mtf.maxAbs 2.97e-12 | PASS: mtf.maxAbs 3.20e-12 |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.00e-12 | PASS: mtf.maxAbs 2.66e-12 | PASS: mtf.maxAbs 2.83e-12 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.17e-12 | PASS: mtf.maxAbs 3.03e-12 | PASS: mtf.maxAbs 3.26e-12 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.03e-12 | PASS: mtf.maxAbs 2.89e-12 | PASS: mtf.maxAbs 3.06e-12 |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: mtf.maxAbs 6.67e-13 | PASS: mtf.maxAbs 2.72e-12 | PASS: mtf.maxAbs 2.88e-12 |
| sony-fe-20mm-f18-g-f11-photopic | 3 | PASS: mtf.maxAbs 6.16e-13 | PASS: mtf.maxAbs 2.16e-12 | PASS: mtf.maxAbs 2.10e-12 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: mtf.maxAbs 6.94e-13 | PASS: mtf.maxAbs 2.64e-12 | PASS: mtf.maxAbs 2.82e-12 |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | PASS: mtf.maxAbs 5.87e-13 | PASS: mtf.maxAbs 2.15e-12 | PASS: mtf.maxAbs 2.10e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: mtf.maxAbs 5.13e-12 | PASS: mtf.maxAbs 3.78e-12 | PASS: mtf.maxAbs 6.99e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | PASS: mtf.maxAbs 2.98e-12 | PASS: mtf.maxAbs 3.26e-12 | PASS: mtf.maxAbs 5.86e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.43e-12 | PASS: mtf.maxAbs 6.59e-13 | PASS: mtf.maxAbs 1.56e-12 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.45e-12 | PASS: mtf.maxAbs 4.14e-13 | PASS: mtf.maxAbs 2.86e-12 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: mtf.maxAbs 1.57e-12 | PASS: mtf.maxAbs 1.89e-12 | PASS: mtf.maxAbs 3.30e-12 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | PASS: mtf.maxAbs 2.91e-12 | PASS: mtf.maxAbs 1.45e-12 | PASS: mtf.maxAbs 2.71e-12 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: mtf.maxAbs 2.13e-12 | PASS: mtf.maxAbs 7.77e-13 | PASS: mtf.maxAbs 2.44e-12 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | PASS: mtf.maxAbs 2.27e-12 | PASS: mtf.maxAbs 1.50e-12 | PASS: mtf.maxAbs 8.48e-13 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: mtf.maxAbs 1.22e-12 | PASS: mtf.maxAbs 1.95e-12 | PASS: mtf.maxAbs 3.05e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.76e-12 | PASS: mtf.maxAbs 1.82e-12 | PASS: mtf.maxAbs 3.34e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.14e-12 | PASS: mtf.maxAbs 1.82e-12 | PASS: mtf.maxAbs 2.86e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.83e-12 | PASS: mtf.maxAbs 1.89e-12 | PASS: mtf.maxAbs 3.46e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: mtf.maxAbs 9.12e-13 | PASS: mtf.maxAbs 1.95e-12 | PASS: mtf.maxAbs 1.82e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | PASS: mtf.maxAbs 1.55e-12 | PASS: mtf.maxAbs 1.05e-12 | PASS: mtf.maxAbs 2.60e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: mtf.maxAbs 9.17e-13 | PASS: mtf.maxAbs 1.97e-12 | PASS: mtf.maxAbs 1.76e-12 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.62e-12 | PASS: mtf.maxAbs 1.06e-12 | PASS: mtf.maxAbs 2.68e-12 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: mtf.maxAbs 7.64e-12 | PASS: mtf.maxAbs 4.98e-12 | PASS: mtf.maxAbs 6.38e-12 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 8.35e-13 | PASS: mtf.maxAbs 5.38e-12 | PASS: mtf.maxAbs 4.85e-12 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: mtf.maxAbs 6.31e-13 | PASS: mtf.maxAbs 1.35e-11 | PASS: mtf.maxAbs 1.34e-11 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | PASS: mtf.maxAbs 3.33e-12 | PASS: mtf.maxAbs 4.74e-12 | PASS: mtf.maxAbs 4.67e-12 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.60e-13 | PASS: mtf.maxAbs 4.80e-12 | PASS: mtf.maxAbs 4.88e-12 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | PASS: mtf.maxAbs 6.06e-13 | PASS: mtf.maxAbs 5.40e-12 | PASS: mtf.maxAbs 5.84e-12 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: mtf.maxAbs 6.83e-12 | PASS: mtf.maxAbs 1.21e-11 | PASS: mtf.maxAbs 1.21e-11 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 6.50e-13 | PASS: mtf.maxAbs 7.61e-12 | PASS: mtf.maxAbs 7.13e-12 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: mtf.maxAbs 6.66e-13 | PASS: mtf.maxAbs 1.48e-11 | PASS: mtf.maxAbs 1.43e-11 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | PASS: mtf.maxAbs 3.51e-12 | PASS: mtf.maxAbs 5.74e-12 | PASS: mtf.maxAbs 5.74e-12 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.43e-13 | PASS: mtf.maxAbs 3.89e-12 | PASS: mtf.maxAbs 3.88e-12 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | PASS: mtf.maxAbs 4.36e-13 | PASS: mtf.maxAbs 4.82e-12 | PASS: mtf.maxAbs 5.22e-12 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: mtf.maxAbs 1.54e-12 | PASS: mtf.maxAbs 6.63e-12 | PASS: mtf.maxAbs 6.35e-12 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 4.79e-13 | PASS: mtf.maxAbs 1.60e-12 | PASS: mtf.maxAbs 1.75e-12 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: mtf.maxAbs 7.35e-13 | PASS: mtf.maxAbs 6.93e-12 | PASS: mtf.maxAbs 7.67e-12 |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | PASS: mtf.maxAbs 6.17e-13 | PASS: mtf.maxAbs 4.41e-12 | PASS: mtf.maxAbs 4.43e-12 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.27e-13 | PASS: mtf.maxAbs 2.26e-12 | PASS: mtf.maxAbs 2.46e-12 |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | PASS: mtf.maxAbs 1.04e-12 | PASS: mtf.maxAbs 4.43e-12 | PASS: mtf.maxAbs 4.44e-12 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: mtf.maxAbs 1.41e-12 | PASS: mtf.maxAbs 1.01e-11 | PASS: mtf.maxAbs 9.77e-12 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 5.36e-13 | PASS: mtf.maxAbs 1.46e-12 | PASS: mtf.maxAbs 1.48e-12 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: mtf.maxAbs 6.77e-13 | PASS: mtf.maxAbs 7.34e-12 | PASS: mtf.maxAbs 8.01e-12 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | PASS: mtf.maxAbs 6.58e-13 | PASS: mtf.maxAbs 4.64e-12 | PASS: mtf.maxAbs 4.66e-12 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.68e-13 | PASS: mtf.maxAbs 2.07e-12 | PASS: mtf.maxAbs 2.28e-12 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | PASS: mtf.maxAbs 9.32e-13 | PASS: mtf.maxAbs 2.28e-12 | PASS: mtf.maxAbs 2.21e-12 |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: mtf.maxAbs 9.14e-13 | PASS: mtf.maxAbs 3.78e-12 | PASS: mtf.maxAbs 3.51e-12 |
| nikon-z-mc-105f28-f5.6-photopic | 3 | PASS: mtf.maxAbs 6.75e-13 | PASS: mtf.maxAbs 3.59e-12 | PASS: mtf.maxAbs 3.31e-12 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: mtf.maxAbs 9.35e-13 | PASS: mtf.maxAbs 8.77e-13 | PASS: mtf.maxAbs 8.64e-13 |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 6.41e-13 | PASS: mtf.maxAbs 6.38e-13 | PASS: mtf.maxAbs 6.36e-13 |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: mtf.maxAbs 5.42e-13 | PASS: mtf.maxAbs 4.66e-13 | PASS: mtf.maxAbs 7.85e-13 |
| nikon-z-mc-105f28-f11-photopic | 3 | PASS: mtf.maxAbs 3.29e-13 | PASS: mtf.maxAbs 7.52e-13 | PASS: mtf.maxAbs 6.62e-13 |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: mtf.maxAbs 5.81e-13 | PASS: mtf.maxAbs 4.49e-13 | PASS: mtf.maxAbs 7.34e-13 |
| nikon-z-mc-105f28-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.38e-13 | PASS: mtf.maxAbs 6.61e-13 | PASS: mtf.maxAbs 5.65e-13 |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: mtf.maxAbs 9.36e-13 | PASS: mtf.maxAbs 7.36e-13 | PASS: mtf.maxAbs 1.59e-12 |
| nikon-z-135f18-plena-f5.6-photopic | 3 | PASS: mtf.maxAbs 8.49e-13 | PASS: mtf.maxAbs 9.26e-13 | PASS: mtf.maxAbs 1.78e-12 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.08e-12 | PASS: mtf.maxAbs 9.74e-13 | PASS: mtf.maxAbs 1.83e-12 |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 9.37e-13 | PASS: mtf.maxAbs 8.93e-13 | PASS: mtf.maxAbs 1.71e-12 |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: mtf.maxAbs 6.08e-13 | PASS: mtf.maxAbs 2.81e-13 | PASS: mtf.maxAbs 3.73e-13 |
| nikon-z-135f18-plena-f11-photopic | 3 | PASS: mtf.maxAbs 7.80e-13 | PASS: mtf.maxAbs 5.40e-13 | PASS: mtf.maxAbs 1.32e-12 |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: mtf.maxAbs 6.42e-13 | PASS: mtf.maxAbs 2.88e-13 | PASS: mtf.maxAbs 3.82e-13 |
| nikon-z-135f18-plena-f11-best-photopic | 3 | PASS: mtf.maxAbs 7.60e-13 | PASS: mtf.maxAbs 5.37e-13 | PASS: mtf.maxAbs 1.30e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: mtf.maxAbs 8.64e-12 | PASS: mtf.maxAbs 4.91e-12 | PASS: mtf.maxAbs 9.83e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.65e-12 | PASS: mtf.maxAbs 3.85e-12 | PASS: mtf.maxAbs 6.15e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.10e-11 | PASS: mtf.maxAbs 7.54e-12 | PASS: mtf.maxAbs 9.22e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.86e-12 | PASS: mtf.maxAbs 3.03e-12 | PASS: mtf.maxAbs 6.79e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: mtf.maxAbs 5.82e-13 | PASS: mtf.maxAbs 6.06e-12 | PASS: mtf.maxAbs 6.42e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | PASS: mtf.maxAbs 3.37e-13 | PASS: mtf.maxAbs 2.44e-12 | PASS: mtf.maxAbs 2.77e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: mtf.maxAbs 5.79e-13 | PASS: mtf.maxAbs 7.62e-12 | PASS: mtf.maxAbs 7.95e-12 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.50e-13 | PASS: mtf.maxAbs 2.59e-12 | PASS: mtf.maxAbs 2.92e-12 |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: mtf.maxAbs 2.38e-12 | PASS: mtf.maxAbs 1.05e-11 | PASS: mtf.maxAbs 1.13e-11 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.11e-12 | PASS: mtf.maxAbs 3.11e-12 | PASS: mtf.maxAbs 3.40e-12 |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: mtf.maxAbs 1.23e-12 | PASS: mtf.maxAbs 1.23e-11 | PASS: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-open-photopic-wide | 3 | PASS: mtf.maxAbs 2.77e-12 | PASS: mtf.maxAbs 7.21e-12 | PASS: mtf.maxAbs 7.09e-12 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.27e-13 | PASS: mtf.maxAbs 2.31e-12 | PASS: mtf.maxAbs 2.06e-12 |
| nikon-z-24-70f4s-open-photopic-tele | 3 | PASS: mtf.maxAbs 8.84e-13 | PASS: mtf.maxAbs 7.74e-12 | PASS: mtf.maxAbs 7.60e-12 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: mtf.maxAbs 2.20e-12 | PASS: mtf.maxAbs 1.13e-11 | PASS: mtf.maxAbs 1.16e-11 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.22e-12 | PASS: mtf.maxAbs 7.05e-12 | PASS: mtf.maxAbs 6.42e-12 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: mtf.maxAbs 9.15e-13 | PASS: mtf.maxAbs 1.19e-11 | PASS: mtf.maxAbs 1.18e-11 |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | PASS: mtf.maxAbs 2.75e-12 | PASS: mtf.maxAbs 9.46e-12 | PASS: mtf.maxAbs 9.47e-12 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 7.39e-13 | PASS: mtf.maxAbs 3.55e-12 | PASS: mtf.maxAbs 3.79e-12 |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | PASS: mtf.maxAbs 8.29e-13 | PASS: mtf.maxAbs 7.92e-12 | PASS: mtf.maxAbs 7.80e-12 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: mtf.maxAbs 5.96e-13 | PASS: mtf.maxAbs 6.54e-12 | PASS: mtf.maxAbs 6.46e-12 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 7.67e-13 | PASS: mtf.maxAbs 3.25e-12 | PASS: mtf.maxAbs 3.34e-12 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: mtf.maxAbs 3.13e-13 | PASS: mtf.maxAbs 6.62e-12 | PASS: mtf.maxAbs 6.57e-12 |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | PASS: mtf.maxAbs 7.25e-13 | PASS: mtf.maxAbs 3.92e-12 | PASS: mtf.maxAbs 3.91e-12 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.30e-13 | PASS: mtf.maxAbs 2.42e-12 | PASS: mtf.maxAbs 2.47e-12 |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | PASS: mtf.maxAbs 3.95e-13 | PASS: mtf.maxAbs 8.65e-12 | PASS: mtf.maxAbs 8.39e-12 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: mtf.maxAbs 5.47e-13 | PASS: mtf.maxAbs 1.18e-11 | PASS: mtf.maxAbs 1.15e-11 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.04e-12 | PASS: mtf.maxAbs 4.90e-12 | PASS: mtf.maxAbs 5.85e-12 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: mtf.maxAbs 7.95e-13 | PASS: mtf.maxAbs 9.12e-12 | PASS: mtf.maxAbs 8.33e-12 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | PASS: mtf.maxAbs 6.24e-13 | PASS: mtf.maxAbs 4.54e-12 | PASS: mtf.maxAbs 4.30e-12 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.05e-13 | PASS: mtf.maxAbs 2.39e-12 | PASS: mtf.maxAbs 2.65e-12 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | PASS: mtf.maxAbs 5.08e-13 | PASS: mtf.maxAbs 3.46e-12 | PASS: mtf.maxAbs 2.95e-12 |

## r7a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | transverseError.maxAbs (≤ 1.00e-8 mm) | 3.55e-13 | nikon-z-24-70f4s-f8-photopic-wide | field 3.25e1, line 1, ray 63 |
| lv – optiland | centroid.maxAbs (≤ 1.00e-8 mm) | 1.07e-13 | sony-fe-400mm-f28-gm-oss-f11-photopic | field 2.36e0, line 1 |
| lv – optiland | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 3.62e-14 | nikon-z-24-70f4s-open-best-photopic-tele | field 0, line 0 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 739734 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 6.52e-13 | nikon-z-24-70f4s-f5.6-photopic-tele | field 1.25e1, line 4, ray 168 |
| lv – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.13e-13 | sony-fe-20mm-f18-g-f5.6-photopic | field 3.53e1, line 4 |
| lv – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 8.45e-14 | sony-fe-20mm-f18-g-f11-best-photopic | field 3.53e1, line 3 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 739734 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | transverseError.maxAbs (≤ 1.00e-8 mm) | 6.87e-13 | nikon-z-24-70f4s-f5.6-photopic-tele | field 1.25e1, line 1, ray 163 |
| optiland – ref | centroid.maxAbs (≤ 1.00e-8 mm) | 1.20e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | field 3.53e1, line 4 |
| optiland – ref | rmsRadius.maxAbs (≤ 1.00e-8 mm) | 8.36e-14 | sony-fe-20mm-f18-g-f11-best-photopic | field 3.53e1, line 4 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 739734 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 6.48e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 50 | PASS: transverseError.maxAbs 1.35e-13 mm | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 1.10e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 6.57e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 1.31e-13 mm | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 1.10e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 10 | PASS: transverseError.maxAbs 7.64e-14 mm | PASS: transverseError.maxAbs 5.15e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 50 | PASS: transverseError.maxAbs 1.21e-13 mm | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 9.95e-14 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 10 | PASS: transverseError.maxAbs 7.82e-14 mm | PASS: transverseError.maxAbs 5.33e-14 mm | PASS: transverseError.maxAbs 6.39e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 50 | PASS: transverseError.maxAbs 1.21e-13 mm | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 9.95e-14 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 10 | PASS: transverseError.maxAbs 6.39e-14 mm | PASS: transverseError.maxAbs 5.33e-14 mm | PASS: transverseError.maxAbs 5.68e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 50 | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 6.39e-14 mm | PASS: transverseError.maxAbs 7.82e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 5.33e-14 mm | PASS: transverseError.maxAbs 5.68e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 7.46e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 10 | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 4.62e-14 mm | PASS: transverseError.maxAbs 5.33e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 50 | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 9.95e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 10 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 4.97e-14 mm | PASS: transverseError.maxAbs 5.33e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 50 | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 9.59e-14 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 10 | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 2.38e-13 mm | PASS: transverseError.maxAbs 2.84e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 50 | PASS: transverseError.maxAbs 9.06e-14 mm | PASS: transverseError.maxAbs 2.42e-13 mm | PASS: transverseError.maxAbs 2.54e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 2.38e-13 mm | PASS: transverseError.maxAbs 2.86e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 2.42e-13 mm | PASS: transverseError.maxAbs 2.56e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 10 | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 2.31e-13 mm | PASS: transverseError.maxAbs 2.91e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 50 | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 2.58e-13 mm | PASS: transverseError.maxAbs 2.58e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 10 | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 2.29e-13 mm | PASS: transverseError.maxAbs 2.91e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 50 | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 2.59e-13 mm | PASS: transverseError.maxAbs 2.59e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| nikkor-z50f12-f5.6-ref | 10 | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 1.30e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 50 | PASS: transverseError.maxAbs 1.28e-13 mm | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 1.12e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikkor-z50f12-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 1.30e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 1.28e-13 mm | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 1.12e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikkor-z50f12-f11-ref | 10 | PASS: transverseError.maxAbs 1.33e-13 mm | PASS: transverseError.maxAbs 7.28e-14 mm | PASS: transverseError.maxAbs 8.88e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 50 | PASS: transverseError.maxAbs 1.42e-13 mm | PASS: transverseError.maxAbs 9.77e-14 mm | PASS: transverseError.maxAbs 1.42e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| nikkor-z50f12-f11-best-ref | 10 | PASS: transverseError.maxAbs 1.33e-13 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 9.06e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 50 | PASS: transverseError.maxAbs 1.44e-13 mm | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 1.42e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 10 | PASS: transverseError.maxAbs 5.68e-14 mm | PASS: transverseError.maxAbs 2.47e-13 mm | PASS: transverseError.maxAbs 2.58e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 50 | PASS: transverseError.maxAbs 2.24e-13 mm | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 3.14e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 5.51e-14 mm | PASS: transverseError.maxAbs 2.43e-13 mm | PASS: transverseError.maxAbs 2.58e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 2.24e-13 mm | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 3.18e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 10 | PASS: transverseError.maxAbs 6.04e-14 mm | PASS: transverseError.maxAbs 2.68e-13 mm | PASS: transverseError.maxAbs 2.82e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 50 | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 3.18e-13 mm | PASS: transverseError.maxAbs 3.13e-13 mm | 9690 / 30 / 0 | 9690 / 30 / 0 | 9690 / 30 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 10 | PASS: transverseError.maxAbs 6.22e-14 mm | PASS: transverseError.maxAbs 2.68e-13 mm | PASS: transverseError.maxAbs 2.82e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 50 | PASS: transverseError.maxAbs 1.12e-13 mm | PASS: transverseError.maxAbs 3.20e-13 mm | PASS: transverseError.maxAbs 3.11e-13 mm | 9690 / 30 / 0 | 9690 / 30 / 0 | 9690 / 30 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 10 | PASS: transverseError.maxAbs 2.66e-13 mm | PASS: transverseError.maxAbs 2.20e-13 mm | PASS: transverseError.maxAbs 2.20e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 50 | PASS: transverseError.maxAbs 3.23e-13 mm | PASS: transverseError.maxAbs 3.20e-13 mm | PASS: transverseError.maxAbs 3.13e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 2.66e-13 mm | PASS: transverseError.maxAbs 2.20e-13 mm | PASS: transverseError.maxAbs 2.20e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 3.23e-13 mm | PASS: transverseError.maxAbs 3.16e-13 mm | PASS: transverseError.maxAbs 3.16e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 10 | PASS: transverseError.maxAbs 2.45e-13 mm | PASS: transverseError.maxAbs 1.74e-13 mm | PASS: transverseError.maxAbs 2.81e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 50 | PASS: transverseError.maxAbs 2.84e-13 mm | PASS: transverseError.maxAbs 1.95e-13 mm | PASS: transverseError.maxAbs 2.81e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 10 | PASS: transverseError.maxAbs 2.49e-13 mm | PASS: transverseError.maxAbs 1.74e-13 mm | PASS: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 50 | PASS: transverseError.maxAbs 2.77e-13 mm | PASS: transverseError.maxAbs 1.92e-13 mm | PASS: transverseError.maxAbs 2.74e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 10 | PASS: transverseError.maxAbs 1.58e-13 mm | PASS: transverseError.maxAbs 9.59e-14 mm | PASS: transverseError.maxAbs 1.49e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 50 | PASS: transverseError.maxAbs 1.88e-13 mm | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 1.88e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 1.56e-13 mm | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 1.53e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 1.95e-13 mm | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 1.88e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 10 | PASS: transverseError.maxAbs 1.44e-13 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 1.44e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 50 | PASS: transverseError.maxAbs 1.81e-13 mm | PASS: transverseError.maxAbs 1.31e-13 mm | PASS: transverseError.maxAbs 1.49e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 10 | PASS: transverseError.maxAbs 1.46e-13 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 1.46e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 50 | PASS: transverseError.maxAbs 1.81e-13 mm | PASS: transverseError.maxAbs 1.28e-13 mm | PASS: transverseError.maxAbs 1.56e-13 mm | 9711 / 9 / 0 | 9711 / 9 / 0 | 9711 / 9 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 10 | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 3.11e-13 mm | PASS: transverseError.maxAbs 2.86e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 7.64e-14 mm | PASS: transverseError.maxAbs 4.16e-13 mm | PASS: transverseError.maxAbs 4.48e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 10 | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 6.11e-13 mm | PASS: transverseError.maxAbs 5.38e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 50 | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 3.64e-13 mm | PASS: transverseError.maxAbs 3.13e-13 mm | 9708 / 12 / 0 | 9708 / 12 / 0 | 9708 / 12 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 1.31e-13 mm | PASS: transverseError.maxAbs 4.65e-13 mm | PASS: transverseError.maxAbs 4.80e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 50 | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 6.52e-13 mm | PASS: transverseError.maxAbs 6.87e-13 mm | 9710 / 10 / 0 | 9710 / 10 / 0 | 9710 / 10 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 10 | PASS: transverseError.maxAbs 7.64e-14 mm | PASS: transverseError.maxAbs 3.11e-13 mm | PASS: transverseError.maxAbs 2.86e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 7.64e-14 mm | PASS: transverseError.maxAbs 4.17e-13 mm | PASS: transverseError.maxAbs 4.49e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 10 | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 6.13e-13 mm | PASS: transverseError.maxAbs 5.40e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 50 | PASS: transverseError.maxAbs 1.15e-13 mm | PASS: transverseError.maxAbs 3.66e-13 mm | PASS: transverseError.maxAbs 3.13e-13 mm | 9708 / 12 / 0 | 9708 / 12 / 0 | 9708 / 12 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 1.31e-13 mm | PASS: transverseError.maxAbs 4.67e-13 mm | PASS: transverseError.maxAbs 4.80e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 50 | PASS: transverseError.maxAbs 1.26e-13 mm | PASS: transverseError.maxAbs 6.52e-13 mm | PASS: transverseError.maxAbs 6.87e-13 mm | 9710 / 10 / 0 | 9710 / 10 / 0 | 9710 / 10 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 10 | PASS: transverseError.maxAbs 6.22e-14 mm | PASS: transverseError.maxAbs 3.09e-13 mm | PASS: transverseError.maxAbs 3.00e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.69e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 10 | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 4.41e-13 mm | PASS: transverseError.maxAbs 4.23e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 50 | PASS: transverseError.maxAbs 3.22e-13 mm | PASS: transverseError.maxAbs 3.84e-13 mm | PASS: transverseError.maxAbs 3.57e-13 mm | 9642 / 78 / 0 | 9642 / 78 / 0 | 9642 / 78 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 3.39e-13 mm | PASS: transverseError.maxAbs 3.87e-13 mm | PASS: transverseError.maxAbs 4.03e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 50 | PASS: transverseError.maxAbs 2.11e-13 mm | PASS: transverseError.maxAbs 4.51e-13 mm | PASS: transverseError.maxAbs 4.53e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 10 | PASS: transverseError.maxAbs 6.22e-14 mm | PASS: transverseError.maxAbs 3.09e-13 mm | PASS: transverseError.maxAbs 2.98e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 3.73e-13 mm | PASS: transverseError.maxAbs 3.68e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 10 | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 4.42e-13 mm | PASS: transverseError.maxAbs 4.25e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 50 | PASS: transverseError.maxAbs 3.20e-13 mm | PASS: transverseError.maxAbs 3.84e-13 mm | PASS: transverseError.maxAbs 3.57e-13 mm | 9642 / 78 / 0 | 9642 / 78 / 0 | 9642 / 78 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 3.39e-13 mm | PASS: transverseError.maxAbs 3.85e-13 mm | PASS: transverseError.maxAbs 4.05e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 50 | PASS: transverseError.maxAbs 2.12e-13 mm | PASS: transverseError.maxAbs 4.51e-13 mm | PASS: transverseError.maxAbs 4.55e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 10 | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 8.17e-14 mm | PASS: transverseError.maxAbs 1.28e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 50 | PASS: transverseError.maxAbs 1.39e-13 mm | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 1.31e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 1.24e-13 mm | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 1.31e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 1.42e-13 mm | PASS: transverseError.maxAbs 9.24e-14 mm | PASS: transverseError.maxAbs 1.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-f11-ref | 10 | PASS: transverseError.maxAbs 1.14e-13 mm | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 1.21e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 50 | PASS: transverseError.maxAbs 1.35e-13 mm | PASS: transverseError.maxAbs 9.95e-14 mm | PASS: transverseError.maxAbs 1.35e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 10 | PASS: transverseError.maxAbs 1.17e-13 mm | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 1.21e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 50 | PASS: transverseError.maxAbs 1.39e-13 mm | PASS: transverseError.maxAbs 9.77e-14 mm | PASS: transverseError.maxAbs 1.39e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 8.17e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 50 | PASS: transverseError.maxAbs 1.10e-13 mm | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 1.07e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 7.46e-14 mm | PASS: transverseError.maxAbs 8.53e-14 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 1.07e-13 mm | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 1.07e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-135f18-plena-f11-ref | 10 | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 1.07e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 50 | PASS: transverseError.maxAbs 9.95e-14 mm | PASS: transverseError.maxAbs 8.53e-14 mm | PASS: transverseError.maxAbs 9.95e-14 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 10 | PASS: transverseError.maxAbs 6.75e-14 mm | PASS: transverseError.maxAbs 7.11e-14 mm | PASS: transverseError.maxAbs 1.03e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 50 | PASS: transverseError.maxAbs 9.95e-14 mm | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 1.03e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 10 | PASS: transverseError.maxAbs 5.68e-14 mm | PASS: transverseError.maxAbs 2.47e-13 mm | PASS: transverseError.maxAbs 2.42e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 50 | PASS: transverseError.maxAbs 1.45e-13 mm | PASS: transverseError.maxAbs 2.31e-13 mm | PASS: transverseError.maxAbs 2.61e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 10 | PASS: transverseError.maxAbs 5.68e-14 mm | PASS: transverseError.maxAbs 2.45e-13 mm | PASS: transverseError.maxAbs 2.40e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 50 | PASS: transverseError.maxAbs 1.45e-13 mm | PASS: transverseError.maxAbs 2.29e-13 mm | PASS: transverseError.maxAbs 2.59e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 10 | PASS: transverseError.maxAbs 5.33e-14 mm | PASS: transverseError.maxAbs 2.49e-13 mm | PASS: transverseError.maxAbs 2.24e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 50 | PASS: transverseError.maxAbs 6.39e-14 mm | PASS: transverseError.maxAbs 2.52e-13 mm | PASS: transverseError.maxAbs 2.50e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 10 | PASS: transverseError.maxAbs 5.33e-14 mm | PASS: transverseError.maxAbs 2.45e-13 mm | PASS: transverseError.maxAbs 2.20e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 50 | PASS: transverseError.maxAbs 6.57e-14 mm | PASS: transverseError.maxAbs 2.52e-13 mm | PASS: transverseError.maxAbs 2.49e-13 mm | 9712 / 8 / 0 | 9712 / 8 / 0 | 9712 / 8 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 10 | PASS: transverseError.maxAbs 7.37e-14 mm | PASS: transverseError.maxAbs 3.07e-13 mm | PASS: transverseError.maxAbs 2.91e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 9.77e-14 mm | PASS: transverseError.maxAbs 4.01e-13 mm | PASS: transverseError.maxAbs 3.80e-13 mm | 1892 / 52 / 0 | 1892 / 52 / 0 | 1892 / 52 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 10 | PASS: transverseError.maxAbs 1.23e-13 mm | PASS: transverseError.maxAbs 3.87e-13 mm | PASS: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 50 | PASS: transverseError.maxAbs 3.07e-13 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.29e-13 mm | 9627 / 93 / 0 | 9627 / 93 / 0 | 9627 / 93 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 1.42e-13 mm | PASS: transverseError.maxAbs 4.16e-13 mm | PASS: transverseError.maxAbs 4.00e-13 mm | 9463 / 257 / 0 | 9463 / 257 / 0 | 9463 / 257 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 50 | PASS: transverseError.maxAbs 1.67e-13 mm | PASS: transverseError.maxAbs 3.98e-13 mm | PASS: transverseError.maxAbs 4.07e-13 mm | 9176 / 544 / 0 | 9176 / 544 / 0 | 9176 / 544 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 10 | PASS: transverseError.maxAbs 7.28e-14 mm | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 2.90e-13 mm | 1924 / 20 / 0 | 1924 / 20 / 0 | 1924 / 20 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 9.77e-14 mm | PASS: transverseError.maxAbs 4.00e-13 mm | PASS: transverseError.maxAbs 3.80e-13 mm | 1892 / 52 / 0 | 1892 / 52 / 0 | 1892 / 52 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 10 | PASS: transverseError.maxAbs 1.23e-13 mm | PASS: transverseError.maxAbs 3.87e-13 mm | PASS: transverseError.maxAbs 3.91e-13 mm | 1836 / 108 / 0 | 1836 / 108 / 0 | 1836 / 108 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 50 | PASS: transverseError.maxAbs 3.06e-13 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.29e-13 mm | 9627 / 93 / 0 | 9627 / 93 / 0 | 9627 / 93 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 1.42e-13 mm | PASS: transverseError.maxAbs 4.16e-13 mm | PASS: transverseError.maxAbs 3.98e-13 mm | 9463 / 257 / 0 | 9463 / 257 / 0 | 9463 / 257 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 50 | PASS: transverseError.maxAbs 1.69e-13 mm | PASS: transverseError.maxAbs 3.98e-13 mm | PASS: transverseError.maxAbs 4.07e-13 mm | 9176 / 544 / 0 | 9176 / 544 / 0 | 9176 / 544 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 10 | PASS: transverseError.maxAbs 5.86e-14 mm | PASS: transverseError.maxAbs 2.82e-13 mm | PASS: transverseError.maxAbs 2.75e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 6.57e-14 mm | PASS: transverseError.maxAbs 2.95e-13 mm | PASS: transverseError.maxAbs 2.84e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 3.69e-13 mm | PASS: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 50 | PASS: transverseError.maxAbs 3.55e-13 mm | PASS: transverseError.maxAbs 3.77e-13 mm | PASS: transverseError.maxAbs 3.46e-13 mm | 9687 / 33 / 0 | 9687 / 33 / 0 | 9687 / 33 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 1.40e-13 mm | PASS: transverseError.maxAbs 3.36e-13 mm | PASS: transverseError.maxAbs 3.18e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 50 | PASS: transverseError.maxAbs 2.13e-13 mm | PASS: transverseError.maxAbs 4.07e-13 mm | PASS: transverseError.maxAbs 4.28e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 10 | PASS: transverseError.maxAbs 5.86e-14 mm | PASS: transverseError.maxAbs 2.82e-13 mm | PASS: transverseError.maxAbs 2.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 10 | PASS: transverseError.maxAbs 6.57e-14 mm | PASS: transverseError.maxAbs 2.95e-13 mm | PASS: transverseError.maxAbs 2.82e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 10 | PASS: transverseError.maxAbs 8.88e-14 mm | PASS: transverseError.maxAbs 3.69e-13 mm | PASS: transverseError.maxAbs 3.77e-13 mm | 1944 / 0 / 0 | 1944 / 0 / 0 | 1944 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 50 | PASS: transverseError.maxAbs 3.55e-13 mm | PASS: transverseError.maxAbs 3.75e-13 mm | PASS: transverseError.maxAbs 3.46e-13 mm | 9687 / 33 / 0 | 9687 / 33 / 0 | 9687 / 33 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 50 | PASS: transverseError.maxAbs 1.40e-13 mm | PASS: transverseError.maxAbs 3.34e-13 mm | PASS: transverseError.maxAbs 3.18e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 50 | PASS: transverseError.maxAbs 2.15e-13 mm | PASS: transverseError.maxAbs 4.09e-13 mm | PASS: transverseError.maxAbs 4.30e-13 mm | 9709 / 11 / 0 | 9709 / 11 / 0 | 9709 / 11 / 0 |

## r8a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | intercept.maxScaled (≤ 1.00e-8 mm) | 2.66e-13 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 3, ray 36 |
| lv – optiland | intercept.maxAbs [mm] | 4.69e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 3, ray 36 |
| lv – optiland | focus.maxScaled (≤ 1.00e-8 mm) | 2.91e-14 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | field 0, line 4 |
| lv – optiland | focus.maxAbs [mm] | 5.68e-13 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 3 |
| lv – optiland | focusRms.maxAbs (≤ 1.00e-8 mm) | 3.04e-14 | nikon-z-24-70f4s-open-ref-zoom0.5 | field 0, line 0 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 22144 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 2.61e-13 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 3, ray 36 |
| lv – ref | intercept.maxAbs [mm] | 4.60e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 3, ray 36 |
| lv – ref | focus.maxScaled (≤ 1.00e-8 mm) | 7.47e-14 | nikon-z-24-70f4s-f8-ref-tele | field 0, line 0 |
| lv – ref | focus.maxAbs [mm] | 1.42e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 4 |
| lv – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 3.49e-14 | nikon-z-24-70f4s-f8-ref-tele | field 0, line 0 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 22144 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | intercept.maxScaled (≤ 1.00e-8 mm) | 2.66e-13 | nikon-z-24-70f4s-open-photopic-tele | field 0, line 3, ray 16 |
| optiland – ref | intercept.maxAbs [mm] | 4.75e-12 | nikon-z-24-70f4s-open-photopic-tele | field 0, line 3, ray 16 |
| optiland – ref | focus.maxScaled (≤ 1.00e-8 mm) | 6.82e-14 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 0 |
| optiland – ref | focus.maxAbs [mm] | 1.34e-12 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 0 |
| optiland – ref | focusRms.maxAbs (≤ 1.00e-8 mm) | 3.51e-14 | nikon-z-24-70f4s-f8-photopic-tele | field 0, line 4 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 22144 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: intercept.maxScaled 3.55e-14 mm | PASS: intercept.maxScaled 3.20e-14 mm | PASS: intercept.maxScaled 3.57e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 10 | PASS: intercept.maxScaled 4.43e-14 mm | PASS: intercept.maxScaled 3.65e-14 mm | PASS: intercept.maxScaled 3.73e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: intercept.maxScaled 3.55e-14 mm | PASS: intercept.maxScaled 3.20e-14 mm | PASS: intercept.maxScaled 3.57e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 4.43e-14 mm | PASS: intercept.maxScaled 3.65e-14 mm | PASS: intercept.maxScaled 3.73e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: intercept.maxScaled 1.41e-14 mm | PASS: intercept.maxScaled 5.49e-15 mm | PASS: intercept.maxScaled 1.41e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 10 | PASS: intercept.maxScaled 1.92e-14 mm | PASS: intercept.maxScaled 1.29e-14 mm | PASS: intercept.maxScaled 2.63e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: intercept.maxScaled 1.41e-14 mm | PASS: intercept.maxScaled 5.49e-15 mm | PASS: intercept.maxScaled 1.41e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 10 | PASS: intercept.maxScaled 1.92e-14 mm | PASS: intercept.maxScaled 1.29e-14 mm | PASS: intercept.maxScaled 2.63e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: intercept.maxScaled 1.57e-14 mm | PASS: intercept.maxScaled 1.53e-14 mm | PASS: intercept.maxScaled 1.48e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 10 | PASS: intercept.maxScaled 3.22e-14 mm | PASS: intercept.maxScaled 1.43e-14 mm | PASS: intercept.maxScaled 1.91e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: intercept.maxScaled 1.57e-14 mm | PASS: intercept.maxScaled 1.53e-14 mm | PASS: intercept.maxScaled 1.48e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 3.22e-14 mm | PASS: intercept.maxScaled 1.43e-14 mm | PASS: intercept.maxScaled 1.91e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: intercept.maxScaled 1.05e-14 mm | PASS: intercept.maxScaled 5.89e-15 mm | PASS: intercept.maxScaled 1.03e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 10 | PASS: intercept.maxScaled 1.14e-14 mm | PASS: intercept.maxScaled 8.73e-15 mm | PASS: intercept.maxScaled 1.08e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: intercept.maxScaled 1.05e-14 mm | PASS: intercept.maxScaled 5.89e-15 mm | PASS: intercept.maxScaled 1.03e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 10 | PASS: intercept.maxScaled 1.14e-14 mm | PASS: intercept.maxScaled 8.73e-15 mm | PASS: intercept.maxScaled 1.08e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: intercept.maxScaled 2.66e-14 mm | PASS: intercept.maxScaled 9.86e-15 mm | PASS: intercept.maxScaled 3.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 10 | PASS: intercept.maxScaled 3.13e-14 mm | PASS: intercept.maxScaled 1.21e-14 mm | PASS: intercept.maxScaled 2.69e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: intercept.maxScaled 2.66e-14 mm | PASS: intercept.maxScaled 9.86e-15 mm | PASS: intercept.maxScaled 3.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 3.13e-14 mm | PASS: intercept.maxScaled 1.21e-14 mm | PASS: intercept.maxScaled 2.69e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: intercept.maxScaled 9.41e-15 mm | PASS: intercept.maxScaled 5.82e-15 mm | PASS: intercept.maxScaled 1.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 10 | PASS: intercept.maxScaled 1.25e-14 mm | PASS: intercept.maxScaled 5.49e-15 mm | PASS: intercept.maxScaled 1.25e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: intercept.maxScaled 9.41e-15 mm | PASS: intercept.maxScaled 5.82e-15 mm | PASS: intercept.maxScaled 1.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 10 | PASS: intercept.maxScaled 1.25e-14 mm | PASS: intercept.maxScaled 5.49e-15 mm | PASS: intercept.maxScaled 1.25e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f5.6-ref | 3 | PASS: intercept.maxScaled 1.72e-14 mm | PASS: intercept.maxScaled 1.72e-14 mm | PASS: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 10 | PASS: intercept.maxScaled 3.70e-14 mm | PASS: intercept.maxScaled 1.71e-14 mm | PASS: intercept.maxScaled 3.47e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: intercept.maxScaled 1.72e-14 mm | PASS: intercept.maxScaled 1.72e-14 mm | PASS: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 3.70e-14 mm | PASS: intercept.maxScaled 1.71e-14 mm | PASS: intercept.maxScaled 3.47e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f11-ref | 3 | PASS: intercept.maxScaled 9.31e-15 mm | PASS: intercept.maxScaled 5.68e-15 mm | PASS: intercept.maxScaled 8.27e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 10 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 9.32e-15 mm | PASS: intercept.maxScaled 1.05e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikkor-z50f12-f11-best-ref | 3 | PASS: intercept.maxScaled 9.31e-15 mm | PASS: intercept.maxScaled 5.68e-15 mm | PASS: intercept.maxScaled 8.27e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 10 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 9.32e-15 mm | PASS: intercept.maxScaled 1.05e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: intercept.maxScaled 1.85e-14 mm | PASS: intercept.maxScaled 3.45e-14 mm | PASS: intercept.maxScaled 5.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 10 | PASS: intercept.maxScaled 2.43e-14 mm | PASS: intercept.maxScaled 4.67e-14 mm | PASS: intercept.maxScaled 5.54e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: intercept.maxScaled 1.85e-14 mm | PASS: intercept.maxScaled 3.45e-14 mm | PASS: intercept.maxScaled 5.29e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 2.43e-14 mm | PASS: intercept.maxScaled 4.67e-14 mm | PASS: intercept.maxScaled 5.54e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: intercept.maxScaled 5.64e-15 mm | PASS: intercept.maxScaled 4.39e-15 mm | PASS: intercept.maxScaled 8.59e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 10 | PASS: intercept.maxScaled 9.10e-15 mm | PASS: intercept.maxScaled 5.29e-15 mm | PASS: intercept.maxScaled 1.08e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: intercept.maxScaled 5.64e-15 mm | PASS: intercept.maxScaled 4.39e-15 mm | PASS: intercept.maxScaled 8.59e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 10 | PASS: intercept.maxScaled 9.10e-15 mm | PASS: intercept.maxScaled 5.29e-15 mm | PASS: intercept.maxScaled 1.08e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: intercept.maxScaled 4.62e-14 mm | PASS: intercept.maxScaled 7.59e-14 mm | PASS: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 10 | PASS: intercept.maxScaled 1.02e-13 mm | PASS: intercept.maxScaled 9.05e-14 mm | PASS: intercept.maxScaled 1.01e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: intercept.maxScaled 4.62e-14 mm | PASS: intercept.maxScaled 7.59e-14 mm | PASS: intercept.maxScaled 8.02e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 1.02e-13 mm | PASS: intercept.maxScaled 9.05e-14 mm | PASS: intercept.maxScaled 1.01e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: intercept.maxScaled 3.88e-14 mm | PASS: intercept.maxScaled 2.35e-14 mm | PASS: intercept.maxScaled 3.93e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 10 | PASS: intercept.maxScaled 5.06e-14 mm | PASS: intercept.maxScaled 4.65e-14 mm | PASS: intercept.maxScaled 5.77e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: intercept.maxScaled 3.88e-14 mm | PASS: intercept.maxScaled 2.35e-14 mm | PASS: intercept.maxScaled 3.93e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 10 | PASS: intercept.maxScaled 5.06e-14 mm | PASS: intercept.maxScaled 4.65e-14 mm | PASS: intercept.maxScaled 5.77e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: intercept.maxScaled 2.82e-14 mm | PASS: intercept.maxScaled 2.43e-14 mm | PASS: intercept.maxScaled 2.67e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 10 | PASS: intercept.maxScaled 4.33e-14 mm | PASS: intercept.maxScaled 2.95e-14 mm | PASS: intercept.maxScaled 4.42e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: intercept.maxScaled 2.82e-14 mm | PASS: intercept.maxScaled 2.43e-14 mm | PASS: intercept.maxScaled 2.67e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 4.33e-14 mm | PASS: intercept.maxScaled 2.95e-14 mm | PASS: intercept.maxScaled 4.42e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: intercept.maxScaled 1.59e-14 mm | PASS: intercept.maxScaled 1.28e-14 mm | PASS: intercept.maxScaled 1.26e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 10 | PASS: intercept.maxScaled 2.39e-14 mm | PASS: intercept.maxScaled 1.86e-14 mm | PASS: intercept.maxScaled 3.07e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: intercept.maxScaled 1.59e-14 mm | PASS: intercept.maxScaled 1.28e-14 mm | PASS: intercept.maxScaled 1.26e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 10 | PASS: intercept.maxScaled 2.39e-14 mm | PASS: intercept.maxScaled 1.86e-14 mm | PASS: intercept.maxScaled 3.07e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: intercept.maxScaled 2.97e-14 mm | PASS: intercept.maxScaled 4.87e-14 mm | PASS: intercept.maxScaled 5.20e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 2.84e-14 mm | PASS: intercept.maxScaled 2.03e-13 mm | PASS: intercept.maxScaled 1.86e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: intercept.maxScaled 4.08e-14 mm | PASS: intercept.maxScaled 1.34e-13 mm | PASS: intercept.maxScaled 1.66e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 10 | PASS: intercept.maxScaled 2.64e-14 mm | PASS: intercept.maxScaled 4.95e-14 mm | PASS: intercept.maxScaled 4.62e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 6.46e-14 mm | PASS: intercept.maxScaled 2.17e-13 mm | PASS: intercept.maxScaled 2.11e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 10 | PASS: intercept.maxScaled 7.09e-14 mm | PASS: intercept.maxScaled 1.31e-13 mm | PASS: intercept.maxScaled 1.49e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: intercept.maxScaled 2.97e-14 mm | PASS: intercept.maxScaled 4.87e-14 mm | PASS: intercept.maxScaled 5.20e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 2.84e-14 mm | PASS: intercept.maxScaled 2.03e-13 mm | PASS: intercept.maxScaled 1.86e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: intercept.maxScaled 4.08e-14 mm | PASS: intercept.maxScaled 1.34e-13 mm | PASS: intercept.maxScaled 1.66e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 10 | PASS: intercept.maxScaled 2.64e-14 mm | PASS: intercept.maxScaled 4.95e-14 mm | PASS: intercept.maxScaled 4.62e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 6.46e-14 mm | PASS: intercept.maxScaled 2.17e-13 mm | PASS: intercept.maxScaled 2.11e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 10 | PASS: intercept.maxScaled 7.09e-14 mm | PASS: intercept.maxScaled 1.31e-13 mm | PASS: intercept.maxScaled 1.49e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 3.49e-15 mm | PASS: intercept.maxScaled 1.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 1.76e-14 mm | PASS: intercept.maxScaled 3.86e-14 mm | PASS: intercept.maxScaled 4.09e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: intercept.maxScaled 2.00e-14 mm | PASS: intercept.maxScaled 3.58e-14 mm | PASS: intercept.maxScaled 3.68e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 10 | PASS: intercept.maxScaled 2.27e-14 mm | PASS: intercept.maxScaled 9.40e-15 mm | PASS: intercept.maxScaled 2.70e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 2.63e-14 mm | PASS: intercept.maxScaled 4.09e-14 mm | PASS: intercept.maxScaled 4.66e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 10 | PASS: intercept.maxScaled 2.70e-14 mm | PASS: intercept.maxScaled 4.16e-14 mm | PASS: intercept.maxScaled 4.45e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 3.49e-15 mm | PASS: intercept.maxScaled 1.38e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 1.76e-14 mm | PASS: intercept.maxScaled 3.86e-14 mm | PASS: intercept.maxScaled 4.09e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: intercept.maxScaled 2.00e-14 mm | PASS: intercept.maxScaled 3.58e-14 mm | PASS: intercept.maxScaled 3.68e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 10 | PASS: intercept.maxScaled 2.27e-14 mm | PASS: intercept.maxScaled 9.40e-15 mm | PASS: intercept.maxScaled 2.70e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 2.63e-14 mm | PASS: intercept.maxScaled 4.09e-14 mm | PASS: intercept.maxScaled 4.66e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 10 | PASS: intercept.maxScaled 2.70e-14 mm | PASS: intercept.maxScaled 4.16e-14 mm | PASS: intercept.maxScaled 4.45e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: intercept.maxScaled 3.45e-14 mm | PASS: intercept.maxScaled 4.68e-14 mm | PASS: intercept.maxScaled 3.69e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 10 | PASS: intercept.maxScaled 3.61e-14 mm | PASS: intercept.maxScaled 6.64e-14 mm | PASS: intercept.maxScaled 5.54e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: intercept.maxScaled 3.45e-14 mm | PASS: intercept.maxScaled 4.68e-14 mm | PASS: intercept.maxScaled 3.69e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 3.61e-14 mm | PASS: intercept.maxScaled 6.64e-14 mm | PASS: intercept.maxScaled 5.54e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: intercept.maxScaled 1.60e-14 mm | PASS: intercept.maxScaled 1.50e-14 mm | PASS: intercept.maxScaled 1.25e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 10 | PASS: intercept.maxScaled 2.33e-14 mm | PASS: intercept.maxScaled 1.84e-14 mm | PASS: intercept.maxScaled 1.92e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: intercept.maxScaled 1.60e-14 mm | PASS: intercept.maxScaled 1.50e-14 mm | PASS: intercept.maxScaled 1.25e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 10 | PASS: intercept.maxScaled 2.33e-14 mm | PASS: intercept.maxScaled 1.84e-14 mm | PASS: intercept.maxScaled 1.92e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: intercept.maxScaled 2.17e-14 mm | PASS: intercept.maxScaled 1.41e-14 mm | PASS: intercept.maxScaled 1.83e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 10 | PASS: intercept.maxScaled 3.07e-14 mm | PASS: intercept.maxScaled 2.31e-14 mm | PASS: intercept.maxScaled 3.45e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: intercept.maxScaled 2.17e-14 mm | PASS: intercept.maxScaled 1.41e-14 mm | PASS: intercept.maxScaled 1.83e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 3.07e-14 mm | PASS: intercept.maxScaled 2.31e-14 mm | PASS: intercept.maxScaled 3.45e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: intercept.maxScaled 2.09e-14 mm | PASS: intercept.maxScaled 1.14e-14 mm | PASS: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 10 | PASS: intercept.maxScaled 1.28e-14 mm | PASS: intercept.maxScaled 1.24e-14 mm | PASS: intercept.maxScaled 1.74e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: intercept.maxScaled 2.09e-14 mm | PASS: intercept.maxScaled 1.14e-14 mm | PASS: intercept.maxScaled 1.39e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 10 | PASS: intercept.maxScaled 1.28e-14 mm | PASS: intercept.maxScaled 1.24e-14 mm | PASS: intercept.maxScaled 1.74e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: intercept.maxScaled 1.48e-14 mm | PASS: intercept.maxScaled 1.17e-13 mm | PASS: intercept.maxScaled 1.12e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 10 | PASS: intercept.maxScaled 1.73e-14 mm | PASS: intercept.maxScaled 1.21e-13 mm | PASS: intercept.maxScaled 1.21e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: intercept.maxScaled 1.48e-14 mm | PASS: intercept.maxScaled 1.17e-13 mm | PASS: intercept.maxScaled 1.12e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 10 | PASS: intercept.maxScaled 1.73e-14 mm | PASS: intercept.maxScaled 1.21e-13 mm | PASS: intercept.maxScaled 1.21e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: intercept.maxScaled 9.02e-15 mm | PASS: intercept.maxScaled 3.42e-15 mm | PASS: intercept.maxScaled 5.72e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 10 | PASS: intercept.maxScaled 9.57e-15 mm | PASS: intercept.maxScaled 1.00e-14 mm | PASS: intercept.maxScaled 9.41e-15 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: intercept.maxScaled 9.02e-15 mm | PASS: intercept.maxScaled 3.42e-15 mm | PASS: intercept.maxScaled 5.72e-15 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 10 | PASS: intercept.maxScaled 9.57e-15 mm | PASS: intercept.maxScaled 1.00e-14 mm | PASS: intercept.maxScaled 9.41e-15 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: intercept.maxScaled 2.89e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | PASS: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 5.72e-14 mm | PASS: intercept.maxScaled 9.23e-14 mm | PASS: intercept.maxScaled 1.33e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: intercept.maxScaled 1.11e-13 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 10 | PASS: intercept.maxScaled 4.55e-14 mm | PASS: intercept.maxScaled 4.41e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 8.73e-14 mm | PASS: intercept.maxScaled 9.80e-14 mm | PASS: intercept.maxScaled 1.28e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 10 | PASS: intercept.maxScaled 9.68e-14 mm | PASS: intercept.maxScaled 2.36e-13 mm | PASS: intercept.maxScaled 2.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: intercept.maxScaled 2.89e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | PASS: intercept.maxScaled 4.81e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 5.72e-14 mm | PASS: intercept.maxScaled 9.23e-14 mm | PASS: intercept.maxScaled 1.33e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: intercept.maxScaled 1.11e-13 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.50e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 10 | PASS: intercept.maxScaled 4.55e-14 mm | PASS: intercept.maxScaled 4.41e-14 mm | PASS: intercept.maxScaled 5.21e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 8.73e-14 mm | PASS: intercept.maxScaled 9.80e-14 mm | PASS: intercept.maxScaled 1.28e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 10 | PASS: intercept.maxScaled 9.68e-14 mm | PASS: intercept.maxScaled 2.36e-13 mm | PASS: intercept.maxScaled 2.66e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 7.93e-14 mm | PASS: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 2.58e-14 mm | PASS: intercept.maxScaled 9.23e-14 mm | PASS: intercept.maxScaled 1.11e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: intercept.maxScaled 2.41e-14 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 10 | PASS: intercept.maxScaled 1.94e-14 mm | PASS: intercept.maxScaled 7.85e-14 mm | PASS: intercept.maxScaled 8.10e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 2.88e-14 mm | PASS: intercept.maxScaled 1.09e-13 mm | PASS: intercept.maxScaled 1.05e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 10 | PASS: intercept.maxScaled 2.66e-13 mm | PASS: intercept.maxScaled 2.61e-13 mm | PASS: intercept.maxScaled 2.43e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: intercept.maxScaled 1.38e-14 mm | PASS: intercept.maxScaled 7.93e-14 mm | PASS: intercept.maxScaled 6.55e-14 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: intercept.maxScaled 2.58e-14 mm | PASS: intercept.maxScaled 9.23e-14 mm | PASS: intercept.maxScaled 1.11e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: intercept.maxScaled 2.41e-14 mm | PASS: intercept.maxScaled 2.19e-13 mm | PASS: intercept.maxScaled 2.07e-13 mm | 66 / 0 / 0 | 66 / 0 / 0 | 66 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 10 | PASS: intercept.maxScaled 1.94e-14 mm | PASS: intercept.maxScaled 7.85e-14 mm | PASS: intercept.maxScaled 8.10e-14 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 10 | PASS: intercept.maxScaled 2.88e-14 mm | PASS: intercept.maxScaled 1.09e-13 mm | PASS: intercept.maxScaled 1.05e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 10 | PASS: intercept.maxScaled 2.66e-13 mm | PASS: intercept.maxScaled 2.61e-13 mm | PASS: intercept.maxScaled 2.43e-13 mm | 280 / 0 / 0 | 280 / 0 / 0 | 280 / 0 / 0 |

## r9a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 1.88e-13 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | line 1, ray 1 |
| lv – optiland | distortion.maxScaled (≤ 1.00e-8 mm) | 2.88e-13 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | line 1, ray 1 |
| lv – optiland | distortion.maxAbs [percent] | 1.48e-12 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 1, ray 7 |
| lv – optiland | exitPupil.maxScaled (≤ 1.00e-8 mm) | 3.20e-13 | nikon-z-mc-105f28-f5.6-ref | line 0, ray 30 |
| lv – optiland | exitPupil.maxAbs [mm] | 1.31e-12 | nikon-z-mc-105f28-f5.6-ref | line 0, ray 30 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 57216 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | lateralColour.maxAbs (≤ 1.00e-8 mm) | 2.56e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 2, ray 18 |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 3.48e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | line 1, ray 17 |
| lv – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.69e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | line 1, ray 17 |
| lv – ref | distortion.maxAbs [percent] | 2.18e-12 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | line 0, ray 7 |
| lv – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 4.83e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | line 1, ray 8 |
| lv – ref | exitPupil.maxAbs [mm] | 1.92e-12 | nikon-z-24-70f4s-f5.6-photopic-wide | line 1, ray 8 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 57216 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | lateralColour.maxAbs (≤ 1.00e-8 mm) | 3.77e-13 | sony-fe-20mm-f18-g-f5.6-best-photopic | line 1, ray 17 |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 3.66e-13 | sony-fe-20mm-f18-g-f11-best-photopic | line 1, ray 17 |
| optiland – ref | distortion.maxScaled (≤ 1.00e-8 mm) | 3.83e-13 | sony-fe-20mm-f18-g-f11-best-photopic | line 1, ray 17 |
| optiland – ref | distortion.maxAbs [percent] | 2.24e-12 | nikon-z-24-70f4s-open-best-photopic-wide | line 3, ray 11 |
| optiland – ref | exitPupil.maxScaled (≤ 1.00e-8 mm) | 4.82e-13 | nikon-z-24-70f4s-f5.6-photopic-wide | line 3, ray 8 |
| optiland – ref | exitPupil.maxAbs [mm] | 1.96e-12 | nikon-z-24-70f4s-f5.6-photopic-wide | line 3, ray 8 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 57216 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | lateralColour.maxAbs (≤ 1.00e-8 mm) | 4.09e-13 | sony-fe-20mm-f18-g-f11-best-photopic | line 1, ray 17 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 4 | PASS: exitPupil.maxScaled 9.05e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 8.70e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 4 | PASS: exitPupil.maxScaled 1.22e-13 mm | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: exitPupil.maxScaled 1.13e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 4 | PASS: distortion.maxScaled 8.28e-14 mm | PASS: distortion.maxScaled 4.95e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 4 | PASS: distortion.maxScaled 9.50e-14 mm | PASS: lateralColour.maxAbs 6.75e-14 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 4 | PASS: distortion.maxScaled 8.52e-14 mm | PASS: distortion.maxScaled 5.48e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 4 | PASS: distortion.maxScaled 9.51e-14 mm | PASS: lateralColour.maxAbs 6.75e-14 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 4 | PASS: distortion.maxScaled 8.28e-14 mm | PASS: distortion.maxScaled 4.95e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 4 | PASS: distortion.maxScaled 9.50e-14 mm | PASS: lateralColour.maxAbs 6.75e-14 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 4 | PASS: distortion.maxScaled 8.28e-14 mm | PASS: distortion.maxScaled 4.97e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 4 | PASS: distortion.maxScaled 9.87e-14 mm | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 4 | PASS: exitPupil.maxScaled 1.08e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.53e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 4 | PASS: landing.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 8.02e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 4 | PASS: exitPupil.maxScaled 1.10e-13 mm | PASS: exitPupil.maxScaled 9.15e-14 mm | PASS: exitPupil.maxScaled 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 4 | PASS: lateralColour.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-best-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.19e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 4 | PASS: lateralColour.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 4 | PASS: lateralColour.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-best-ref | 4 | PASS: exitPupil.maxScaled 9.81e-14 mm | PASS: distortion.maxScaled 1.16e-13 mm | PASS: exitPupil.maxScaled 1.47e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 4 | PASS: landing.maxAbs 1.10e-13 mm | PASS: exitPupil.maxScaled 1.39e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.73e-13 mm | PASS: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.46e-13 mm | PASS: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.77e-13 mm | PASS: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.68e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.73e-13 mm | PASS: lateralColour.maxAbs 4.05e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 4 | PASS: landing.maxAbs 6.39e-14 mm | PASS: distortion.maxScaled 2.42e-13 mm | PASS: distortion.maxScaled 2.70e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 4 | PASS: lateralColour.maxAbs 1.46e-13 mm | PASS: lateralColour.maxAbs 3.73e-13 mm | PASS: lateralColour.maxAbs 4.09e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 4 | PASS: distortion.maxScaled 1.57e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 4 | PASS: distortion.maxScaled 2.85e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 4 | PASS: distortion.maxScaled 1.54e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 4 | PASS: distortion.maxScaled 2.88e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 4 | PASS: distortion.maxScaled 1.57e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 4 | PASS: distortion.maxScaled 2.85e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 2.20e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 4 | PASS: distortion.maxScaled 1.56e-13 mm | PASS: landing.maxAbs 1.78e-13 mm | PASS: landing.maxAbs 1.56e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 4 | PASS: distortion.maxScaled 2.88e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 4 | PASS: distortion.maxScaled 1.88e-13 mm | PASS: lateralColour.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 4 | PASS: lateralColour.maxAbs 1.88e-13 mm | PASS: lateralColour.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.42e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 4 | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 4 | PASS: distortion.maxScaled 1.88e-13 mm | PASS: lateralColour.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 4 | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 4 | PASS: lateralColour.maxAbs 1.92e-13 mm | PASS: lateralColour.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 1.46e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.07e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.21e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.40e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.42e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.40e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 4 | PASS: exitPupil.maxScaled 3.20e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: exitPupil.maxScaled 3.16e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 4 | PASS: exitPupil.maxScaled 2.92e-13 mm | PASS: distortion.maxScaled 1.40e-13 mm | PASS: exitPupil.maxScaled 3.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.41e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 4 | PASS: exitPupil.maxScaled 8.08e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 4 | PASS: distortion.maxScaled 1.20e-13 mm | PASS: distortion.maxScaled 9.66e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 4 | PASS: distortion.maxScaled 5.29e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 4 | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 4 | PASS: distortion.maxScaled 4.67e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 4 | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 4 | PASS: distortion.maxScaled 5.29e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 4 | PASS: lateralColour.maxAbs 7.46e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 4 | PASS: distortion.maxScaled 4.93e-14 mm | PASS: exitPupil.maxScaled 2.73e-13 mm | PASS: exitPupil.maxScaled 2.74e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 4 | PASS: lateralColour.maxAbs 7.11e-14 mm | PASS: exitPupil.maxScaled 2.69e-13 mm | PASS: exitPupil.maxScaled 2.80e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.03e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 9.24e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 4 | PASS: landing.maxAbs 4.26e-14 mm | PASS: exitPupil.maxScaled 4.70e-13 mm | PASS: exitPupil.maxScaled 4.52e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 4 | PASS: exitPupil.maxScaled 5.92e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 4 | PASS: landing.maxAbs 8.53e-14 mm | PASS: distortion.maxScaled 6.02e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 4 | PASS: lateralColour.maxAbs 1.14e-13 mm | PASS: exitPupil.maxScaled 4.83e-13 mm | PASS: exitPupil.maxScaled 4.82e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 4 | PASS: lateralColour.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 4 | PASS: lateralColour.maxAbs 1.03e-13 mm | PASS: lateralColour.maxAbs 8.88e-14 mm | PASS: lateralColour.maxAbs 1.17e-13 mm | 149 / 0 / 0 | 149 / 0 / 0 | 149 / 0 / 0 |

## r10a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 6.54e-13 | nikon-z-24-70f4s-open-ref-wide | line 0, ray 1689 |
| lv – optiland | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.19e-13 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, ray 69 |
| lv – optiland | tangentialFocus.maxAbs [mm] | 4.43e-9 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, ray 69 |
| lv – optiland | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 3.16e-14 | nikon-z-mc-105f28-f5.6-photopic | line 0, ray 1441 |
| lv – optiland | sagittalFocus.maxAbs [mm] | 1.74e-12 | sony-fe-400mm-f28-gm-oss-f5.6-ref | line 0, ray 64 |
| lv – optiland | astigmatism.maxAbs [mm] | 4.43e-9 | sony-fe-400mm-f28-gm-oss-f5.6-photopic | line 4, ray 69 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 688838 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 13056 | — | — |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 7.32e-13 | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | line 0, ray 1700 |
| lv – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.10e-13 | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | line 0, ray 84 |
| lv – ref | tangentialFocus.maxAbs [mm] | 3.98e-9 | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | line 0, ray 84 |
| lv – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 8.92e-14 | nikon-z-24-70f4s-open-photopic-wide | line 1, ray 1750 |
| lv – ref | sagittalFocus.maxAbs [mm] | 2.27e-12 | nikon-z-24-70f4s-open-best-ref-zoom0.5 | line 0, ray 24 |
| lv – ref | astigmatism.maxAbs [mm] | 3.98e-9 | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | line 0, ray 84 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 688838 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 13056 | — | — |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 7.30e-13 | nikon-z-24-70f4s-open-photopic-tele | line 3, ray 1037 |
| optiland – ref | tangentialFocus.maxScaled (≤ 1.00e-8 mm) | 1.33e-13 | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | line 1, ray 79 |
| optiland – ref | tangentialFocus.maxAbs [mm] | 4.87e-9 | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | line 1, ray 79 |
| optiland – ref | sagittalFocus.maxScaled (≤ 1.00e-8 mm) | 8.98e-14 | nikon-z-24-70f4s-open-best-photopic-wide | line 1, ray 1750 |
| optiland – ref | sagittalFocus.maxAbs [mm] | 2.32e-12 | nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | line 1, ray 24 |
| optiland – ref | astigmatism.maxAbs [mm] | 4.87e-9 | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | line 1, ray 79 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 688838 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 13056 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 2 | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.21e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 10 | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 2 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 10 | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 2 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 1.03e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 10 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 9040 / 140 / 0 | 9040 / 140 / 0 | 9040 / 140 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 2 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 1.03e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 10 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 9040 / 140 / 0 | 9040 / 140 / 0 | 9040 / 140 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 2 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | 1834 / 2 / 0 | 1834 / 2 / 0 | 1834 / 2 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 10 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 9028 / 152 / 0 | 9028 / 152 / 0 | 9028 / 152 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 2 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 1834 / 2 / 0 | 1834 / 2 / 0 | 1834 / 2 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 10 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 8.17e-14 mm | PASS: landing.maxAbs 9.95e-14 mm | 9028 / 152 / 0 | 9028 / 152 / 0 | 9028 / 152 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 2 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 8.53e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 10 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | 9032 / 148 / 0 | 9032 / 148 / 0 | 9032 / 148 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 2 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 8.88e-14 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 10 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | 9032 / 148 / 0 | 9032 / 148 / 0 | 9032 / 148 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 2 | PASS: landing.maxAbs 1.05e-13 mm | PASS: landing.maxAbs 1.94e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 1791 / 45 / 0 | 1791 / 45 / 0 | 1791 / 45 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 10 | PASS: landing.maxAbs 2.45e-13 mm | PASS: landing.maxAbs 2.66e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 8817 / 363 / 0 | 8817 / 363 / 0 | 8817 / 363 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 2 | PASS: landing.maxAbs 1.01e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | PASS: landing.maxAbs 1.95e-13 mm | 1791 / 45 / 0 | 1791 / 45 / 0 | 1791 / 45 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 10 | PASS: landing.maxAbs 2.42e-13 mm | PASS: landing.maxAbs 2.66e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 8817 / 363 / 0 | 8817 / 363 / 0 | 8817 / 363 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 2 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 2.10e-13 mm | 1811 / 25 / 0 | 1811 / 25 / 0 | 1811 / 25 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 10 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 2.26e-13 mm | PASS: landing.maxAbs 2.29e-13 mm | 8908 / 272 / 0 | 8908 / 272 / 0 | 8908 / 272 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 2 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 2.10e-13 mm | 1811 / 25 / 0 | 1811 / 25 / 0 | 1811 / 25 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 10 | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 2.26e-13 mm | PASS: landing.maxAbs 2.31e-13 mm | 8908 / 272 / 0 | 8908 / 272 / 0 | 8908 / 272 / 0 |
| nikkor-z50f12-f5.6-ref | 2 | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 2.77e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 10 | PASS: landing.maxAbs 2.17e-13 mm | PASS: landing.maxAbs 2.98e-13 mm | PASS: landing.maxAbs 3.16e-13 mm | 9043 / 137 / 0 | 9043 / 137 / 0 | 9043 / 137 / 0 |
| nikkor-z50f12-f5.6-best-ref | 2 | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 2.77e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 10 | PASS: landing.maxAbs 2.17e-13 mm | PASS: landing.maxAbs 2.95e-13 mm | PASS: landing.maxAbs 3.13e-13 mm | 9043 / 137 / 0 | 9043 / 137 / 0 | 9043 / 137 / 0 |
| nikkor-z50f12-f11-ref | 2 | PASS: landing.maxAbs 2.38e-13 mm | PASS: landing.maxAbs 2.06e-13 mm | PASS: landing.maxAbs 2.38e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 10 | PASS: landing.maxAbs 2.56e-13 mm | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 2.70e-13 mm | 9027 / 153 / 0 | 9027 / 153 / 0 | 9027 / 153 / 0 |
| nikkor-z50f12-f11-best-ref | 2 | PASS: landing.maxAbs 2.38e-13 mm | PASS: landing.maxAbs 2.06e-13 mm | PASS: landing.maxAbs 2.42e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 10 | PASS: landing.maxAbs 2.56e-13 mm | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 2.70e-13 mm | 9027 / 153 / 0 | 9027 / 153 / 0 | 9027 / 153 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 2 | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 3.38e-13 mm | PASS: landing.maxAbs 3.48e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 10 | PASS: landing.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 3.68e-13 mm | PASS: landing.maxAbs 3.59e-13 mm | 8986 / 194 / 0 | 8986 / 194 / 0 | 8986 / 194 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 2 | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 3.38e-13 mm | PASS: landing.maxAbs 3.52e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 10 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 3.68e-13 mm | PASS: landing.maxAbs 3.59e-13 mm | 8986 / 194 / 0 | 8986 / 194 / 0 | 8986 / 194 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 2 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 3.62e-13 mm | PASS: landing.maxAbs 3.59e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 10 | PASS: landing.maxAbs 1.65e-13 mm | PASS: landing.maxAbs 3.98e-13 mm | PASS: landing.maxAbs 3.84e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 2 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 3.59e-13 mm | PASS: landing.maxAbs 3.59e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 10 | PASS: landing.maxAbs 1.67e-13 mm | PASS: landing.maxAbs 3.94e-13 mm | PASS: landing.maxAbs 3.84e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 2 | PASS: landing.maxAbs 2.70e-13 mm | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 3.09e-13 mm | 1815 / 21 / 0 | 1815 / 21 / 0 | 1815 / 21 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 10 | PASS: landing.maxAbs 4.55e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | PASS: landing.maxAbs 4.55e-13 mm | 8933 / 247 / 0 | 8933 / 247 / 0 | 8933 / 247 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 2 | PASS: landing.maxAbs 2.70e-13 mm | PASS: landing.maxAbs 2.13e-13 mm | PASS: landing.maxAbs 3.09e-13 mm | 1815 / 21 / 0 | 1815 / 21 / 0 | 1815 / 21 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 10 | PASS: landing.maxAbs 4.58e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | PASS: landing.maxAbs 4.58e-13 mm | 8933 / 247 / 0 | 8933 / 247 / 0 | 8933 / 247 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 2 | PASS: landing.maxAbs 2.20e-13 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 3.09e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 10 | PASS: landing.maxAbs 2.98e-13 mm | PASS: landing.maxAbs 2.52e-13 mm | PASS: landing.maxAbs 3.34e-13 mm | 9028 / 152 / 0 | 9028 / 152 / 0 | 9028 / 152 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 2 | PASS: landing.maxAbs 2.20e-13 mm | PASS: landing.maxAbs 2.10e-13 mm | PASS: landing.maxAbs 3.06e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 10 | PASS: landing.maxAbs 2.98e-13 mm | PASS: landing.maxAbs 2.49e-13 mm | PASS: landing.maxAbs 3.34e-13 mm | 9028 / 152 / 0 | 9028 / 152 / 0 | 9028 / 152 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 2 | PASS: landing.maxAbs 1.63e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.95e-13 mm | 1801 / 35 / 0 | 1801 / 35 / 0 | 1801 / 35 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 10 | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 1.67e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 8874 / 306 / 0 | 8874 / 306 / 0 | 8874 / 306 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 2 | PASS: landing.maxAbs 1.63e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.99e-13 mm | 1801 / 35 / 0 | 1801 / 35 / 0 | 1801 / 35 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 10 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.67e-13 mm | PASS: landing.maxAbs 2.13e-13 mm | 8874 / 306 / 0 | 8874 / 306 / 0 | 8874 / 306 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 2 | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.81e-13 mm | 1831 / 5 / 0 | 1831 / 5 / 0 | 1831 / 5 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 10 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.42e-13 mm | PASS: landing.maxAbs 2.27e-13 mm | 9012 / 168 / 0 | 9012 / 168 / 0 | 9012 / 168 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 2 | PASS: landing.maxAbs 1.53e-13 mm | PASS: landing.maxAbs 1.28e-13 mm | PASS: landing.maxAbs 1.85e-13 mm | 1831 / 5 / 0 | 1831 / 5 / 0 | 1831 / 5 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 10 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.42e-13 mm | PASS: landing.maxAbs 2.24e-13 mm | 9012 / 168 / 0 | 9012 / 168 / 0 | 9012 / 168 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 2 | PASS: landing.maxAbs 4.87e-13 mm | PASS: landing.maxAbs 4.62e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | 1825 / 11 / 0 | 1825 / 11 / 0 | 1825 / 11 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 2 | PASS: landing.maxAbs 2.73e-13 mm | PASS: landing.maxAbs 6.82e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | 1824 / 12 / 0 | 1824 / 12 / 0 | 1824 / 12 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 2 | PASS: landing.maxAbs 1.01e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.33e-13 mm | 1810 / 26 / 0 | 1810 / 26 / 0 | 1810 / 26 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 10 | PASS: landing.maxAbs 6.32e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 7.03e-13 mm | 8939 / 241 / 0 | 8939 / 241 / 0 | 8939 / 241 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 3.59e-13 mm | PASS: landing.maxAbs 7.32e-13 mm | PASS: landing.maxAbs 7.25e-13 mm | 8937 / 243 / 0 | 8937 / 243 / 0 | 8937 / 243 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 10 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 6.54e-13 mm | PASS: landing.maxAbs 6.22e-13 mm | 8877 / 303 / 0 | 8877 / 303 / 0 | 8877 / 303 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 2 | PASS: landing.maxAbs 4.87e-13 mm | PASS: landing.maxAbs 4.62e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | 1825 / 11 / 0 | 1825 / 11 / 0 | 1825 / 11 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 2 | PASS: landing.maxAbs 2.73e-13 mm | PASS: landing.maxAbs 6.82e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | 1824 / 12 / 0 | 1824 / 12 / 0 | 1824 / 12 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 2 | PASS: landing.maxAbs 1.01e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.33e-13 mm | 1810 / 26 / 0 | 1810 / 26 / 0 | 1810 / 26 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 10 | PASS: landing.maxAbs 6.32e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 7.03e-13 mm | 8939 / 241 / 0 | 8939 / 241 / 0 | 8939 / 241 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 3.55e-13 mm | PASS: landing.maxAbs 7.32e-13 mm | PASS: landing.maxAbs 7.25e-13 mm | 8937 / 243 / 0 | 8937 / 243 / 0 | 8937 / 243 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 10 | PASS: landing.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 6.54e-13 mm | PASS: landing.maxAbs 6.22e-13 mm | 8877 / 303 / 0 | 8877 / 303 / 0 | 8877 / 303 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 2 | PASS: landing.maxAbs 9.50e-14 mm | PASS: landing.maxAbs 5.04e-13 mm | PASS: landing.maxAbs 5.08e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 2 | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 6.47e-13 mm | PASS: landing.maxAbs 6.79e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 2 | PASS: landing.maxAbs 2.15e-13 mm | PASS: landing.maxAbs 4.01e-13 mm | PASS: landing.maxAbs 4.26e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 10 | PASS: landing.maxAbs 2.06e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.83e-13 mm | 8948 / 232 / 0 | 8948 / 232 / 0 | 8948 / 232 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 1.16e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | 8991 / 189 / 0 | 8991 / 189 / 0 | 8991 / 189 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 10 | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 4.83e-13 mm | PASS: landing.maxAbs 4.65e-13 mm | 8993 / 187 / 0 | 8993 / 187 / 0 | 8993 / 187 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 2 | PASS: landing.maxAbs 9.50e-14 mm | PASS: landing.maxAbs 5.04e-13 mm | PASS: landing.maxAbs 5.08e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 2 | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 6.47e-13 mm | PASS: landing.maxAbs 6.79e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 2 | PASS: landing.maxAbs 2.15e-13 mm | PASS: landing.maxAbs 4.01e-13 mm | PASS: landing.maxAbs 4.28e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 10 | PASS: landing.maxAbs 2.08e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.86e-13 mm | 8948 / 232 / 0 | 8948 / 232 / 0 | 8948 / 232 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 1.16e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | 8991 / 189 / 0 | 8991 / 189 / 0 | 8991 / 189 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 10 | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 4.83e-13 mm | PASS: landing.maxAbs 4.65e-13 mm | 8993 / 187 / 0 | 8993 / 187 / 0 | 8993 / 187 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 2 | PASS: landing.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.71e-13 mm | 1817 / 19 / 0 | 1817 / 19 / 0 | 1817 / 19 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 10 | PASS: landing.maxAbs 1.42e-13 mm | PASS: landing.maxAbs 1.39e-13 mm | PASS: landing.maxAbs 1.53e-13 mm | 8919 / 261 / 0 | 8919 / 261 / 0 | 8919 / 261 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 2 | PASS: landing.maxAbs 1.31e-13 mm | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.71e-13 mm | 1817 / 19 / 0 | 1817 / 19 / 0 | 1817 / 19 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 10 | PASS: landing.maxAbs 1.42e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.49e-13 mm | 8919 / 261 / 0 | 8919 / 261 / 0 | 8919 / 261 / 0 |
| nikon-z-mc-105f28-f11-ref | 2 | PASS: landing.maxAbs 1.46e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 10 | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 2 | PASS: landing.maxAbs 1.46e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 1.35e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 10 | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 8998 / 182 / 0 | 8998 / 182 / 0 | 8998 / 182 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 2 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 10 | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.63e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 2 | PASS: landing.maxAbs 9.95e-14 mm | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 10 | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.63e-13 mm | 9044 / 136 / 0 | 9044 / 136 / 0 | 9044 / 136 / 0 |
| nikon-z-135f18-plena-f11-ref | 2 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 10 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.42e-13 mm | 9039 / 141 / 0 | 9039 / 141 / 0 | 9039 / 141 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 2 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 1.07e-13 mm | PASS: landing.maxAbs 1.17e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 10 | PASS: landing.maxAbs 1.35e-13 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 1.39e-13 mm | 9039 / 141 / 0 | 9039 / 141 / 0 | 9039 / 141 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 2 | PASS: landing.maxAbs 3.62e-13 mm | PASS: landing.maxAbs 2.84e-13 mm | PASS: landing.maxAbs 3.66e-13 mm | 1794 / 42 / 0 | 1794 / 42 / 0 | 1794 / 42 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 10 | PASS: landing.maxAbs 3.84e-13 mm | PASS: landing.maxAbs 2.91e-13 mm | PASS: landing.maxAbs 3.98e-13 mm | 8841 / 339 / 0 | 8841 / 339 / 0 | 8841 / 339 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 2 | PASS: landing.maxAbs 3.66e-13 mm | PASS: landing.maxAbs 2.88e-13 mm | PASS: landing.maxAbs 3.69e-13 mm | 1794 / 42 / 0 | 1794 / 42 / 0 | 1794 / 42 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 10 | PASS: landing.maxAbs 3.87e-13 mm | PASS: landing.maxAbs 2.91e-13 mm | PASS: landing.maxAbs 3.98e-13 mm | 8841 / 339 / 0 | 8841 / 339 / 0 | 8841 / 339 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 2 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 3.91e-13 mm | PASS: landing.maxAbs 3.66e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 10 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 4.26e-13 mm | PASS: landing.maxAbs 3.84e-13 mm | 8993 / 187 / 0 | 8993 / 187 / 0 | 8993 / 187 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 2 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 3.94e-13 mm | PASS: landing.maxAbs 3.69e-13 mm | 1826 / 10 / 0 | 1826 / 10 / 0 | 1826 / 10 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 10 | PASS: landing.maxAbs 8.53e-14 mm | PASS: landing.maxAbs 4.26e-13 mm | PASS: landing.maxAbs 3.84e-13 mm | 8993 / 187 / 0 | 8993 / 187 / 0 | 8993 / 187 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 2 | PASS: landing.maxAbs 6.54e-13 mm | PASS: landing.maxAbs 4.48e-13 mm | PASS: landing.maxAbs 6.57e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 2 | PASS: landing.maxAbs 1.09e-13 mm | PASS: landing.maxAbs 6.89e-13 mm | PASS: landing.maxAbs 6.64e-13 mm | 1778 / 58 / 0 | 1778 / 58 / 0 | 1778 / 58 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 2 | PASS: landing.maxAbs 1.40e-13 mm | PASS: landing.maxAbs 5.99e-13 mm | PASS: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 10 | PASS: landing.maxAbs 6.39e-13 mm | PASS: landing.maxAbs 5.36e-13 mm | PASS: landing.maxAbs 6.36e-13 mm | 8768 / 412 / 0 | 8768 / 412 / 0 | 8768 / 412 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 2.64e-13 mm | PASS: landing.maxAbs 7.11e-13 mm | PASS: landing.maxAbs 7.21e-13 mm | 8716 / 464 / 0 | 8716 / 464 / 0 | 8716 / 464 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 10 | PASS: landing.maxAbs 5.26e-13 mm | PASS: landing.maxAbs 6.63e-13 mm | PASS: landing.maxAbs 7.30e-13 mm | 8500 / 680 / 0 | 8500 / 680 / 0 | 8500 / 680 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 2 | PASS: landing.maxAbs 6.50e-13 mm | PASS: landing.maxAbs 4.48e-13 mm | PASS: landing.maxAbs 6.54e-13 mm | 1787 / 49 / 0 | 1787 / 49 / 0 | 1787 / 49 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 2 | PASS: landing.maxAbs 1.09e-13 mm | PASS: landing.maxAbs 6.86e-13 mm | PASS: landing.maxAbs 6.61e-13 mm | 1778 / 58 / 0 | 1778 / 58 / 0 | 1778 / 58 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 2 | PASS: landing.maxAbs 1.40e-13 mm | PASS: landing.maxAbs 5.99e-13 mm | PASS: landing.maxAbs 6.08e-13 mm | 1727 / 109 / 0 | 1727 / 109 / 0 | 1727 / 109 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 10 | PASS: landing.maxAbs 6.39e-13 mm | PASS: landing.maxAbs 5.33e-13 mm | PASS: landing.maxAbs 6.36e-13 mm | 8768 / 412 / 0 | 8768 / 412 / 0 | 8768 / 412 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 2.64e-13 mm | PASS: landing.maxAbs 7.07e-13 mm | PASS: landing.maxAbs 7.21e-13 mm | 8716 / 464 / 0 | 8716 / 464 / 0 | 8716 / 464 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 10 | PASS: landing.maxAbs 5.26e-13 mm | PASS: landing.maxAbs 6.63e-13 mm | PASS: landing.maxAbs 7.30e-13 mm | 8500 / 680 / 0 | 8500 / 680 / 0 | 8500 / 680 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 2 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 4.69e-13 mm | PASS: landing.maxAbs 4.16e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 2 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 5.90e-13 mm | PASS: landing.maxAbs 6.04e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 2 | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 10 | PASS: landing.maxAbs 5.76e-13 mm | PASS: landing.maxAbs 5.54e-13 mm | PASS: landing.maxAbs 5.93e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 6.50e-13 mm | PASS: landing.maxAbs 6.39e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 10 | PASS: landing.maxAbs 3.87e-13 mm | PASS: landing.maxAbs 5.54e-13 mm | PASS: landing.maxAbs 5.97e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 2 | PASS: landing.maxAbs 1.10e-13 mm | PASS: landing.maxAbs 4.73e-13 mm | PASS: landing.maxAbs 4.19e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 2 | PASS: landing.maxAbs 1.03e-13 mm | PASS: landing.maxAbs 5.90e-13 mm | PASS: landing.maxAbs 6.04e-13 mm | 1836 / 0 / 0 | 1836 / 0 / 0 | 1836 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 2 | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.19e-13 mm | PASS: landing.maxAbs 5.58e-13 mm | 1835 / 1 / 0 | 1835 / 1 / 0 | 1835 / 1 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 10 | PASS: landing.maxAbs 5.76e-13 mm | PASS: landing.maxAbs 5.51e-13 mm | PASS: landing.maxAbs 5.90e-13 mm | 8969 / 211 / 0 | 8969 / 211 / 0 | 8969 / 211 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 10 | PASS: landing.maxAbs 1.24e-13 mm | PASS: landing.maxAbs 6.47e-13 mm | PASS: landing.maxAbs 6.43e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 10 | PASS: landing.maxAbs 3.87e-13 mm | PASS: landing.maxAbs 5.51e-13 mm | PASS: landing.maxAbs 5.97e-13 mm | 8990 / 190 / 0 | 8990 / 190 / 0 | 8990 / 190 / 0 |

## r11a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Run | Where |
|---|---|---|---|---|
| lv – optiland | illumination.maxAbs (≤ 1.00e-9) | 3.09e-14 | nikon-z-mc-105f28-f11-photopic | field 1.00e1, line 2 |
| lv – optiland | transmission.maxAbs (≤ 0) | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0, line 0 |
| lv – optiland | transmission.rimBandOrFailed | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0, line 0 |
| lv – optiland | landing.maxAbs (≤ 1.00e-8 mm) | 1.88e-13 | sony-fe-400mm-f28-gm-oss-f11-best-photopic | field 3.15e0, line 1, ray 2048 |
| lv – optiland | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – optiland | mask.rimBand [rays] | 0 | — | — |
| lv – optiland | rays.compared [rays] | 7588692 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | — | — |
| lv – optiland | fields.compared [elements] | 3768 | — | — |
| lv – ref | illumination.maxAbs (≤ 1.00e-9) | 1.12e-13 | nikon-z-24-70f4s-f11-ref-tele | field 5.54e0, line 0 |
| lv – ref | transmission.maxAbs (≤ 0) | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0, line 0 |
| lv – ref | transmission.rimBandOrFailed | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0, line 0 |
| lv – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.01e-13 | sigma-35mm-f14-dg-hsm-a-f5.6-photopic | field 2.32e1, line 0, ray 2048 |
| lv – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| lv – ref | mask.rimBand [rays] | 0 | — | — |
| lv – ref | rays.compared [rays] | 7588692 | — | — |
| lv – ref | rays.dropped [rays] | 0 | — | — |
| lv – ref | fields.compared [elements] | 3768 | — | — |
| optiland – ref | illumination.maxAbs (≤ 1.00e-9) | 1.14e-13 | nikon-z-24-70f4s-f11-photopic-tele | field 8.32e0, line 3 |
| optiland – ref | transmission.maxAbs (≤ 0) | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0, line 0 |
| optiland – ref | transmission.rimBandOrFailed | 0 | canon-ef-135-f2l-usm-f5.6-ref | field 0, line 0 |
| optiland – ref | landing.maxAbs (≤ 1.00e-8 mm) | 2.17e-13 | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | field 2.40e1, line 4, ray 2048 |
| optiland – ref | mask.mismatches (≤ 0 rays) | 0 | — | — |
| optiland – ref | mask.rimBand [rays] | 0 | — | — |
| optiland – ref | rays.compared [rays] | 7588692 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | — | — |
| optiland – ref | fields.compared [elements] | 3768 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance:

| Run | Requests | lv – optiland | lv – ref | optiland – ref | lv rays ok / blocked / failed | optiland rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 2.31e-14 mm | PASS: landing.maxAbs 3.91e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-photopic | 5 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 2.31e-14 mm | PASS: landing.maxAbs 4.26e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 5 | PASS: landing.maxAbs 8.88e-14 mm | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f11-ref | 1 | PASS: illumination.maxAbs 3.77e-15 | PASS: landing.maxAbs 2.31e-14 mm | PASS: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-photopic | 5 | PASS: landing.maxAbs 9.24e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | PASS: illumination.maxAbs 3.77e-15 | PASS: landing.maxAbs 2.49e-14 mm | PASS: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| canon-ef-135-f2l-usm-f11-best-photopic | 5 | PASS: landing.maxAbs 8.88e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 7.46e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | PASS: landing.maxAbs 1.78e-14 mm | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 5 | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | PASS: illumination.maxAbs 1.67e-15 | PASS: landing.maxAbs 2.66e-14 mm | PASS: landing.maxAbs 2.49e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 5 | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | PASS: illumination.maxAbs 4.33e-15 | PASS: landing.maxAbs 2.66e-14 mm | PASS: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 5 | PASS: illumination.maxAbs 6.22e-15 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 6.75e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | PASS: illumination.maxAbs 4.33e-15 | PASS: landing.maxAbs 2.66e-14 mm | PASS: illumination.maxAbs 4.11e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 5 | PASS: illumination.maxAbs 6.22e-15 | PASS: landing.maxAbs 5.68e-14 mm | PASS: landing.maxAbs 6.39e-14 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.58e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 5 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.72e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 5 | PASS: landing.maxAbs 7.82e-14 mm | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.58e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 5 | PASS: landing.maxAbs 7.46e-14 mm | PASS: landing.maxAbs 2.01e-13 mm | PASS: landing.maxAbs 1.88e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.74e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 5 | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.99e-13 mm | PASS: landing.maxAbs 1.87e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-f5.6-ref | 1 | PASS: illumination.maxAbs 7.66e-15 | PASS: illumination.maxAbs 1.75e-14 | PASS: illumination.maxAbs 9.88e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f5.6-photopic | 5 | PASS: illumination.maxAbs 1.23e-14 | PASS: illumination.maxAbs 2.25e-14 | PASS: landing.maxAbs 1.49e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: illumination.maxAbs 7.66e-15 | PASS: illumination.maxAbs 1.75e-14 | PASS: illumination.maxAbs 9.88e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f5.6-best-photopic | 5 | PASS: illumination.maxAbs 1.23e-14 | PASS: illumination.maxAbs 2.25e-14 | PASS: landing.maxAbs 1.49e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-f11-ref | 1 | PASS: illumination.maxAbs 7.44e-15 | PASS: illumination.maxAbs 2.00e-14 | PASS: illumination.maxAbs 2.35e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f11-photopic | 5 | PASS: illumination.maxAbs 9.21e-15 | PASS: illumination.maxAbs 2.79e-14 | PASS: illumination.maxAbs 2.84e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikkor-z50f12-f11-best-ref | 1 | PASS: illumination.maxAbs 7.44e-15 | PASS: illumination.maxAbs 2.00e-14 | PASS: illumination.maxAbs 2.35e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikkor-z50f12-f11-best-photopic | 5 | PASS: illumination.maxAbs 9.21e-15 | PASS: illumination.maxAbs 2.79e-14 | PASS: illumination.maxAbs 2.84e-14 | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | PASS: illumination.maxAbs 6.27e-15 | PASS: illumination.maxAbs 4.84e-14 | PASS: illumination.maxAbs 4.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-photopic | 5 | PASS: landing.maxAbs 5.68e-14 mm | PASS: illumination.maxAbs 4.83e-14 | PASS: illumination.maxAbs 4.97e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | PASS: illumination.maxAbs 6.27e-15 | PASS: illumination.maxAbs 4.84e-14 | PASS: illumination.maxAbs 4.95e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 5 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 4.83e-14 | PASS: illumination.maxAbs 4.97e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-20mm-f18-g-f11-ref | 1 | PASS: illumination.maxAbs 4.44e-15 | PASS: illumination.maxAbs 6.94e-14 | PASS: illumination.maxAbs 6.75e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-photopic | 5 | PASS: illumination.maxAbs 1.27e-14 | PASS: illumination.maxAbs 7.08e-14 | PASS: illumination.maxAbs 7.31e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | PASS: illumination.maxAbs 4.44e-15 | PASS: illumination.maxAbs 6.94e-14 | PASS: illumination.maxAbs 6.75e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-20mm-f18-g-f11-best-photopic | 5 | PASS: illumination.maxAbs 1.27e-14 | PASS: illumination.maxAbs 7.08e-14 | PASS: illumination.maxAbs 7.31e-14 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 5 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 5 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.17e-13 mm | PASS: landing.maxAbs 5.33e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 5 | PASS: landing.maxAbs 1.85e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | PASS: landing.maxAbs 4.97e-14 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 5 | PASS: landing.maxAbs 1.88e-13 mm | PASS: landing.maxAbs 1.21e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 5 | PASS: landing.maxAbs 9.77e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 5 | PASS: landing.maxAbs 9.59e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.10e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: landing.maxAbs 5.33e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 5 | PASS: landing.maxAbs 9.77e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 4.97e-14 mm | PASS: landing.maxAbs 1.14e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 5 | PASS: landing.maxAbs 9.77e-14 mm | PASS: landing.maxAbs 7.11e-14 mm | PASS: landing.maxAbs 1.12e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 1.95e-14 | PASS: illumination.maxAbs 1.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | PASS: illumination.maxAbs 3.55e-15 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 2.33e-14 | PASS: illumination.maxAbs 2.32e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-wide | 5 | PASS: illumination.maxAbs 6.00e-15 | PASS: illumination.maxAbs 1.93e-14 | PASS: illumination.maxAbs 2.00e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 5 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.95e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 10205 / 40 / 0 | 10205 / 40 / 0 | 10205 / 40 / 0 |
| nikon-z-24-70f4s-f5.6-photopic-tele | 5 | PASS: illumination.maxAbs 8.44e-15 | PASS: illumination.maxAbs 2.69e-14 | PASS: illumination.maxAbs 2.90e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | PASS: illumination.maxAbs 5.77e-15 | PASS: illumination.maxAbs 1.95e-14 | PASS: illumination.maxAbs 1.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | PASS: illumination.maxAbs 3.55e-15 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | PASS: landing.maxAbs 7.82e-14 mm | PASS: illumination.maxAbs 2.33e-14 | PASS: illumination.maxAbs 2.32e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 5 | PASS: illumination.maxAbs 6.00e-15 | PASS: illumination.maxAbs 1.93e-14 | PASS: illumination.maxAbs 2.00e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 5 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 1.92e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 10205 / 40 / 0 | 10205 / 40 / 0 | 10205 / 40 / 0 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 5 | PASS: illumination.maxAbs 8.44e-15 | PASS: illumination.maxAbs 2.69e-14 | PASS: illumination.maxAbs 2.90e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-f11-ref-wide | 1 | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 2.50e-14 | PASS: illumination.maxAbs 2.86e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | PASS: illumination.maxAbs 7.22e-15 | PASS: illumination.maxAbs 1.74e-14 | PASS: illumination.maxAbs 2.11e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.12e-13 | PASS: illumination.maxAbs 1.09e-13 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-photopic-wide | 5 | PASS: illumination.maxAbs 8.22e-15 | PASS: illumination.maxAbs 2.93e-14 | PASS: illumination.maxAbs 2.95e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 5 | PASS: illumination.maxAbs 8.77e-15 | PASS: landing.maxAbs 1.95e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 10205 / 40 / 0 | 10205 / 40 / 0 | 10205 / 40 / 0 |
| nikon-z-24-70f4s-f11-photopic-tele | 5 | PASS: illumination.maxAbs 7.66e-15 | PASS: illumination.maxAbs 1.09e-13 | PASS: illumination.maxAbs 1.14e-13 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 2.50e-14 | PASS: illumination.maxAbs 2.86e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | PASS: illumination.maxAbs 7.22e-15 | PASS: illumination.maxAbs 1.74e-14 | PASS: illumination.maxAbs 2.11e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.12e-13 | PASS: illumination.maxAbs 1.09e-13 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-wide | 5 | PASS: illumination.maxAbs 8.22e-15 | PASS: illumination.maxAbs 2.93e-14 | PASS: illumination.maxAbs 2.95e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 5 | PASS: illumination.maxAbs 8.77e-15 | PASS: landing.maxAbs 1.95e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 10205 / 40 / 0 | 10205 / 40 / 0 | 10205 / 40 / 0 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 5 | PASS: illumination.maxAbs 7.66e-15 | PASS: illumination.maxAbs 1.09e-13 | PASS: illumination.maxAbs 1.14e-13 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-mc-105f28-f5.6-ref | 1 | PASS: illumination.maxAbs 1.58e-14 | PASS: illumination.maxAbs 2.49e-14 | PASS: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-photopic | 5 | PASS: illumination.maxAbs 1.40e-14 | PASS: illumination.maxAbs 2.60e-14 | PASS: illumination.maxAbs 2.58e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | PASS: illumination.maxAbs 1.58e-14 | PASS: illumination.maxAbs 2.49e-14 | PASS: illumination.maxAbs 2.22e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f5.6-best-photopic | 5 | PASS: illumination.maxAbs 1.40e-14 | PASS: illumination.maxAbs 2.60e-14 | PASS: illumination.maxAbs 2.58e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f11-ref | 1 | PASS: illumination.maxAbs 2.15e-14 | PASS: landing.maxAbs 1.17e-13 mm | PASS: illumination.maxAbs 2.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f11-photopic | 5 | PASS: illumination.maxAbs 3.09e-14 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 2.78e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-ref | 1 | PASS: illumination.maxAbs 2.15e-14 | PASS: landing.maxAbs 1.21e-13 mm | PASS: illumination.maxAbs 2.24e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-mc-105f28-f11-best-photopic | 5 | PASS: illumination.maxAbs 3.09e-14 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 2.78e-14 | 10245 / 0 / 0 | 10245 / 0 / 0 | 10245 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-ref | 1 | PASS: illumination.maxAbs 4.55e-15 | PASS: illumination.maxAbs 3.00e-15 | PASS: illumination.maxAbs 4.66e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-photopic | 5 | PASS: illumination.maxAbs 4.22e-15 | PASS: landing.maxAbs 6.39e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | PASS: illumination.maxAbs 4.55e-15 | PASS: illumination.maxAbs 3.00e-15 | PASS: illumination.maxAbs 4.66e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f5.6-best-photopic | 5 | PASS: illumination.maxAbs 4.22e-15 | PASS: landing.maxAbs 6.75e-14 mm | PASS: landing.maxAbs 6.04e-14 mm | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f11-ref | 1 | PASS: illumination.maxAbs 4.77e-15 | PASS: illumination.maxAbs 5.33e-15 | PASS: illumination.maxAbs 8.10e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f11-photopic | 5 | PASS: illumination.maxAbs 6.44e-15 | PASS: illumination.maxAbs 7.22e-15 | PASS: illumination.maxAbs 7.33e-15 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| nikon-z-135f18-plena-f11-best-ref | 1 | PASS: illumination.maxAbs 4.77e-15 | PASS: illumination.maxAbs 5.33e-15 | PASS: illumination.maxAbs 8.10e-15 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-135f18-plena-f11-best-photopic | 5 | PASS: illumination.maxAbs 6.44e-15 | PASS: illumination.maxAbs 7.22e-15 | PASS: illumination.maxAbs 7.33e-15 | 10221 / 24 / 0 | 10221 / 24 / 0 | 10221 / 24 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | PASS: illumination.maxAbs 9.10e-15 | PASS: landing.maxAbs 1.60e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 5 | PASS: illumination.maxAbs 1.09e-14 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 1.95e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | PASS: illumination.maxAbs 9.10e-15 | PASS: landing.maxAbs 1.56e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 5 | PASS: illumination.maxAbs 1.09e-14 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | PASS: landing.maxAbs 3.91e-14 mm | PASS: landing.maxAbs 1.60e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 5 | PASS: illumination.maxAbs 5.66e-15 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 1.95e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | PASS: landing.maxAbs 3.55e-14 mm | PASS: landing.maxAbs 1.60e-13 mm | PASS: landing.maxAbs 1.92e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 5 | PASS: illumination.maxAbs 5.66e-15 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 1.95e-13 mm | 10237 / 8 / 0 | 10237 / 8 / 0 | 10237 / 8 / 0 |
| nikon-z-24-70f4s-open-ref-wide | 1 | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 1.40e-14 | PASS: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | PASS: illumination.maxAbs 1.12e-14 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.74e-14 | PASS: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-photopic-wide | 5 | PASS: illumination.maxAbs 6.55e-15 | PASS: illumination.maxAbs 1.62e-14 | PASS: illumination.maxAbs 1.53e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 5 | PASS: illumination.maxAbs 8.99e-15 | PASS: landing.maxAbs 1.95e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-open-photopic-tele | 5 | PASS: illumination.maxAbs 9.10e-15 | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.90e-14 | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | PASS: illumination.maxAbs 8.55e-15 | PASS: illumination.maxAbs 1.40e-14 | PASS: illumination.maxAbs 1.72e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | PASS: illumination.maxAbs 1.12e-14 | PASS: landing.maxAbs 1.71e-13 mm | PASS: landing.maxAbs 2.03e-13 mm | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.74e-14 | PASS: illumination.maxAbs 1.45e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-open-best-photopic-wide | 5 | PASS: illumination.maxAbs 6.55e-15 | PASS: illumination.maxAbs 1.62e-14 | PASS: illumination.maxAbs 1.53e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 5 | PASS: illumination.maxAbs 8.99e-15 | PASS: landing.maxAbs 1.92e-13 mm | PASS: landing.maxAbs 2.17e-13 mm | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-open-best-photopic-tele | 5 | PASS: illumination.maxAbs 9.10e-15 | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.90e-14 | 10195 / 50 / 0 | 10195 / 50 / 0 | 10195 / 50 / 0 |
| nikon-z-24-70f4s-f8-ref-wide | 1 | PASS: landing.maxAbs 6.04e-14 mm | PASS: illumination.maxAbs 4.88e-14 | PASS: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | PASS: landing.maxAbs 3.20e-14 mm | PASS: illumination.maxAbs 5.68e-14 | PASS: illumination.maxAbs 5.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-photopic-wide | 5 | PASS: illumination.maxAbs 7.33e-15 | PASS: illumination.maxAbs 7.05e-14 | PASS: illumination.maxAbs 7.17e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 5 | PASS: illumination.maxAbs 8.33e-15 | PASS: illumination.maxAbs 6.00e-14 | PASS: illumination.maxAbs 6.28e-14 | 10205 / 40 / 0 | 10205 / 40 / 0 | 10205 / 40 / 0 |
| nikon-z-24-70f4s-f8-photopic-tele | 5 | PASS: illumination.maxAbs 9.55e-15 | PASS: illumination.maxAbs 2.02e-14 | PASS: illumination.maxAbs 2.15e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | PASS: landing.maxAbs 5.68e-14 mm | PASS: illumination.maxAbs 4.88e-14 | PASS: illumination.maxAbs 5.14e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | PASS: landing.maxAbs 3.20e-14 mm | PASS: illumination.maxAbs 5.68e-14 | PASS: illumination.maxAbs 5.54e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | PASS: landing.maxAbs 7.46e-14 mm | PASS: illumination.maxAbs 1.90e-14 | PASS: illumination.maxAbs 1.83e-14 | 2049 / 0 / 0 | 2049 / 0 / 0 | 2049 / 0 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 5 | PASS: illumination.maxAbs 7.33e-15 | PASS: illumination.maxAbs 7.05e-14 | PASS: illumination.maxAbs 7.17e-14 | 10213 / 32 / 0 | 10213 / 32 / 0 | 10213 / 32 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 5 | PASS: illumination.maxAbs 8.33e-15 | PASS: illumination.maxAbs 6.00e-14 | PASS: illumination.maxAbs 6.28e-14 | 10205 / 40 / 0 | 10205 / 40 / 0 | 10205 / 40 / 0 |
| nikon-z-24-70f4s-f8-best-photopic-tele | 5 | PASS: illumination.maxAbs 9.55e-15 | PASS: illumination.maxAbs 2.02e-14 | PASS: illumination.maxAbs 2.15e-14 | 10201 / 44 / 0 | 10201 / 44 / 0 | 10201 / 44 / 0 |
