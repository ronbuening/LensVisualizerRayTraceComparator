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
| Baseline hash | 4b79f1d6d2409e512d7ded22cdd57173e1890b732108ed2083722dd2ea87b5eb |
| Contract version | 1.1 |
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
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.10e-11 | 384 of 384 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | cut tangential, field 2.56e1, frequencyPerMm 100 |
| lv – optiland | rays.compared [rays] | 1144936 | 384 of 384 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.48e-11 | 384 of 384 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 92 |
| lv – ref | rays.compared [rays] | 1144936 | 384 of 384 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.43e-11 | 384 of 384 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1, frequencyPerMm 94 |
| optiland – ref | rays.compared [rays] | 1144936 | 384 of 384 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: mtf.maxAbs 8.29e-13 (3 of 3) | PASS: mtf.maxAbs 6.43e-13 (3 of 3) | PASS: mtf.maxAbs 9.10e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | PASS: mtf.maxAbs 4.70e-13 (3 of 3) | PASS: mtf.maxAbs 4.39e-13 (3 of 3) | PASS: mtf.maxAbs 5.73e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: mtf.maxAbs 6.97e-13 (3 of 3) | PASS: mtf.maxAbs 5.98e-13 (3 of 3) | PASS: mtf.maxAbs 9.78e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.90e-13 (3 of 3) | PASS: mtf.maxAbs 5.45e-13 (3 of 3) | PASS: mtf.maxAbs 6.11e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: mtf.maxAbs 3.34e-13 (3 of 3) | PASS: mtf.maxAbs 2.37e-13 (3 of 3) | PASS: mtf.maxAbs 4.88e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-photopic | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 8.15e-13 (3 of 3) | PASS: mtf.maxAbs 4.74e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: mtf.maxAbs 3.53e-13 (3 of 3) | PASS: mtf.maxAbs 2.25e-13 (3 of 3) | PASS: mtf.maxAbs 5.00e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 7.10e-13 (3 of 3) | PASS: mtf.maxAbs 4.66e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: mtf.maxAbs 4.27e-13 (3 of 3) | PASS: mtf.maxAbs 6.20e-13 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | PASS: mtf.maxAbs 4.42e-13 (3 of 3) | PASS: mtf.maxAbs 6.27e-13 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: mtf.maxAbs 4.89e-13 (3 of 3) | PASS: mtf.maxAbs 4.45e-13 (3 of 3) | PASS: mtf.maxAbs 8.47e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.01e-13 (3 of 3) | PASS: mtf.maxAbs 3.86e-13 (3 of 3) | PASS: mtf.maxAbs 6.36e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: mtf.maxAbs 2.61e-13 (3 of 3) | PASS: mtf.maxAbs 3.00e-13 (3 of 3) | PASS: mtf.maxAbs 5.37e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | PASS: mtf.maxAbs 4.14e-13 (3 of 3) | PASS: mtf.maxAbs 2.90e-13 (3 of 3) | PASS: mtf.maxAbs 4.97e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: mtf.maxAbs 2.62e-13 (3 of 3) | PASS: mtf.maxAbs 3.09e-13 (3 of 3) | PASS: mtf.maxAbs 5.57e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.40e-13 (3 of 3) | PASS: mtf.maxAbs 3.08e-13 (3 of 3) | PASS: mtf.maxAbs 5.17e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 6.52e-12 (3 of 3) | PASS: mtf.maxAbs 7.16e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | PASS: mtf.maxAbs 2.56e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: mtf.maxAbs 6.46e-13 (3 of 3) | PASS: mtf.maxAbs 6.32e-12 (3 of 3) | PASS: mtf.maxAbs 6.96e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.95e-13 (3 of 3) | PASS: mtf.maxAbs 2.90e-12 (3 of 3) | PASS: mtf.maxAbs 2.80e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: mtf.maxAbs 4.80e-13 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 7.23e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | PASS: mtf.maxAbs 2.59e-13 (3 of 3) | PASS: mtf.maxAbs 4.15e-13 (3 of 3) | PASS: mtf.maxAbs 5.27e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: mtf.maxAbs 4.43e-13 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 7.11e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | PASS: mtf.maxAbs 2.56e-13 (3 of 3) | PASS: mtf.maxAbs 5.26e-13 (3 of 3) | PASS: mtf.maxAbs 7.59e-13 (3 of 3) |
| nikkor-z50f12-f5.6-ref | 3 | PASS: mtf.maxAbs 3.12e-12 (3 of 3) | PASS: mtf.maxAbs 7.45e-12 (3 of 3) | PASS: mtf.maxAbs 7.39e-12 (3 of 3) |
| nikkor-z50f12-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.89e-12 (3 of 3) | PASS: mtf.maxAbs 5.89e-12 (3 of 3) | PASS: mtf.maxAbs 7.10e-12 (3 of 3) |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: mtf.maxAbs 3.08e-12 (3 of 3) | PASS: mtf.maxAbs 7.34e-12 (3 of 3) | PASS: mtf.maxAbs 7.31e-12 (3 of 3) |
| nikkor-z50f12-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 5.74e-12 (3 of 3) | PASS: mtf.maxAbs 7.17e-12 (3 of 3) |
| nikkor-z50f12-f11-ref | 3 | PASS: mtf.maxAbs 9.58e-13 (3 of 3) | PASS: mtf.maxAbs 6.61e-13 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) |
| nikkor-z50f12-f11-photopic | 3 | PASS: mtf.maxAbs 8.24e-13 (3 of 3) | PASS: mtf.maxAbs 1.91e-13 (3 of 3) | PASS: mtf.maxAbs 7.44e-13 (3 of 3) |
| nikkor-z50f12-f11-best-ref | 3 | PASS: mtf.maxAbs 9.25e-13 (3 of 3) | PASS: mtf.maxAbs 6.89e-13 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) |
| nikkor-z50f12-f11-best-photopic | 3 | PASS: mtf.maxAbs 9.26e-13 (3 of 3) | PASS: mtf.maxAbs 1.33e-13 (3 of 3) | PASS: mtf.maxAbs 8.38e-13 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.97e-12 (3 of 3) | PASS: mtf.maxAbs 3.20e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) | PASS: mtf.maxAbs 3.26e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.89e-12 (3 of 3) | PASS: mtf.maxAbs 3.06e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: mtf.maxAbs 6.67e-13 (3 of 3) | PASS: mtf.maxAbs 2.72e-12 (3 of 3) | PASS: mtf.maxAbs 2.88e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-photopic | 3 | PASS: mtf.maxAbs 6.16e-13 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.10e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: mtf.maxAbs 6.94e-13 (3 of 3) | PASS: mtf.maxAbs 2.64e-12 (3 of 3) | PASS: mtf.maxAbs 2.82e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | PASS: mtf.maxAbs 5.87e-13 (3 of 3) | PASS: mtf.maxAbs 2.15e-12 (3 of 3) | PASS: mtf.maxAbs 2.10e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: mtf.maxAbs 5.13e-12 (3 of 3) | PASS: mtf.maxAbs 3.78e-12 (3 of 3) | PASS: mtf.maxAbs 6.99e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | PASS: mtf.maxAbs 2.98e-12 (3 of 3) | PASS: mtf.maxAbs 3.26e-12 (3 of 3) | PASS: mtf.maxAbs 5.86e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 6.59e-13 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 2.45e-12 (3 of 3) | PASS: mtf.maxAbs 4.14e-13 (3 of 3) | PASS: mtf.maxAbs 2.86e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) | PASS: mtf.maxAbs 3.30e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | PASS: mtf.maxAbs 2.91e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 2.71e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 7.77e-13 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | PASS: mtf.maxAbs 2.27e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 8.48e-13 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 3.05e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 3.34e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 2.86e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 1.83e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: mtf.maxAbs 9.12e-13 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: mtf.maxAbs 9.17e-13 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | PASS: mtf.maxAbs 1.62e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 2.68e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: mtf.maxAbs 7.64e-12 (3 of 3) | PASS: mtf.maxAbs 4.98e-12 (3 of 3) | PASS: mtf.maxAbs 6.38e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 5.38e-12 (3 of 3) | PASS: mtf.maxAbs 4.85e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: mtf.maxAbs 6.31e-13 (3 of 3) | PASS: mtf.maxAbs 1.35e-11 (3 of 3) | PASS: mtf.maxAbs 1.34e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | PASS: mtf.maxAbs 3.33e-12 (3 of 3) | PASS: mtf.maxAbs 4.74e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.60e-13 (3 of 3) | PASS: mtf.maxAbs 4.80e-12 (3 of 3) | PASS: mtf.maxAbs 4.88e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | PASS: mtf.maxAbs 6.06e-13 (3 of 3) | PASS: mtf.maxAbs 5.40e-12 (3 of 3) | PASS: mtf.maxAbs 5.84e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: mtf.maxAbs 6.83e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-11 (3 of 3) | PASS: mtf.maxAbs 1.21e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 6.50e-13 (3 of 3) | PASS: mtf.maxAbs 7.61e-12 (3 of 3) | PASS: mtf.maxAbs 7.13e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: mtf.maxAbs 6.66e-13 (3 of 3) | PASS: mtf.maxAbs 1.48e-11 (3 of 3) | PASS: mtf.maxAbs 1.43e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | PASS: mtf.maxAbs 3.51e-12 (3 of 3) | PASS: mtf.maxAbs 5.74e-12 (3 of 3) | PASS: mtf.maxAbs 5.74e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.43e-13 (3 of 3) | PASS: mtf.maxAbs 3.89e-12 (3 of 3) | PASS: mtf.maxAbs 3.88e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | PASS: mtf.maxAbs 4.36e-13 (3 of 3) | PASS: mtf.maxAbs 4.82e-12 (3 of 3) | PASS: mtf.maxAbs 5.22e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 6.63e-12 (3 of 3) | PASS: mtf.maxAbs 6.35e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 4.79e-13 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: mtf.maxAbs 7.35e-13 (3 of 3) | PASS: mtf.maxAbs 6.93e-12 (3 of 3) | PASS: mtf.maxAbs 7.67e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | PASS: mtf.maxAbs 6.17e-13 (3 of 3) | PASS: mtf.maxAbs 4.41e-12 (3 of 3) | PASS: mtf.maxAbs 4.43e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.27e-13 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) | PASS: mtf.maxAbs 2.46e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 4.43e-12 (3 of 3) | PASS: mtf.maxAbs 4.44e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-11 (3 of 3) | PASS: mtf.maxAbs 9.77e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 5.36e-13 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) | PASS: mtf.maxAbs 1.48e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: mtf.maxAbs 6.77e-13 (3 of 3) | PASS: mtf.maxAbs 7.34e-12 (3 of 3) | PASS: mtf.maxAbs 8.01e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | PASS: mtf.maxAbs 6.58e-13 (3 of 3) | PASS: mtf.maxAbs 4.64e-12 (3 of 3) | PASS: mtf.maxAbs 4.66e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.68e-13 (3 of 3) | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | PASS: mtf.maxAbs 9.32e-13 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: mtf.maxAbs 9.14e-13 (3 of 3) | PASS: mtf.maxAbs 3.78e-12 (3 of 3) | PASS: mtf.maxAbs 3.51e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-photopic | 3 | PASS: mtf.maxAbs 6.75e-13 (3 of 3) | PASS: mtf.maxAbs 3.59e-12 (3 of 3) | PASS: mtf.maxAbs 3.31e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: mtf.maxAbs 9.35e-13 (3 of 3) | PASS: mtf.maxAbs 8.77e-13 (3 of 3) | PASS: mtf.maxAbs 8.64e-13 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 6.41e-13 (3 of 3) | PASS: mtf.maxAbs 6.38e-13 (3 of 3) | PASS: mtf.maxAbs 6.36e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: mtf.maxAbs 5.42e-13 (3 of 3) | PASS: mtf.maxAbs 4.66e-13 (3 of 3) | PASS: mtf.maxAbs 7.85e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-photopic | 3 | PASS: mtf.maxAbs 3.29e-13 (3 of 3) | PASS: mtf.maxAbs 7.52e-13 (3 of 3) | PASS: mtf.maxAbs 6.62e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: mtf.maxAbs 5.81e-13 (3 of 3) | PASS: mtf.maxAbs 4.49e-13 (3 of 3) | PASS: mtf.maxAbs 7.34e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.38e-13 (3 of 3) | PASS: mtf.maxAbs 6.61e-13 (3 of 3) | PASS: mtf.maxAbs 5.65e-13 (3 of 3) |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: mtf.maxAbs 9.36e-13 (3 of 3) | PASS: mtf.maxAbs 7.36e-13 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-photopic | 3 | PASS: mtf.maxAbs 8.49e-13 (3 of 3) | PASS: mtf.maxAbs 9.26e-13 (3 of 3) | PASS: mtf.maxAbs 1.78e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 9.74e-13 (3 of 3) | PASS: mtf.maxAbs 1.83e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 9.37e-13 (3 of 3) | PASS: mtf.maxAbs 8.93e-13 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: mtf.maxAbs 6.08e-13 (3 of 3) | PASS: mtf.maxAbs 2.81e-13 (3 of 3) | PASS: mtf.maxAbs 3.73e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-photopic | 3 | PASS: mtf.maxAbs 7.80e-13 (3 of 3) | PASS: mtf.maxAbs 5.40e-13 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: mtf.maxAbs 6.42e-13 (3 of 3) | PASS: mtf.maxAbs 2.88e-13 (3 of 3) | PASS: mtf.maxAbs 3.82e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-best-photopic | 3 | PASS: mtf.maxAbs 7.60e-13 (3 of 3) | PASS: mtf.maxAbs 5.37e-13 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: mtf.maxAbs 8.64e-12 (3 of 3) | PASS: mtf.maxAbs 4.91e-12 (3 of 3) | PASS: mtf.maxAbs 9.83e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | PASS: mtf.maxAbs 3.65e-12 (3 of 3) | PASS: mtf.maxAbs 3.85e-12 (3 of 3) | PASS: mtf.maxAbs 6.15e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: mtf.maxAbs 1.10e-11 (3 of 3) | PASS: mtf.maxAbs 7.54e-12 (3 of 3) | PASS: mtf.maxAbs 9.22e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | PASS: mtf.maxAbs 3.86e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) | PASS: mtf.maxAbs 6.79e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: mtf.maxAbs 5.82e-13 (3 of 3) | PASS: mtf.maxAbs 6.06e-12 (3 of 3) | PASS: mtf.maxAbs 6.42e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | PASS: mtf.maxAbs 3.37e-13 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) | PASS: mtf.maxAbs 2.77e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: mtf.maxAbs 5.79e-13 (3 of 3) | PASS: mtf.maxAbs 7.62e-12 (3 of 3) | PASS: mtf.maxAbs 7.95e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | PASS: mtf.maxAbs 3.50e-13 (3 of 3) | PASS: mtf.maxAbs 2.59e-12 (3 of 3) | PASS: mtf.maxAbs 2.92e-12 (3 of 3) |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: mtf.maxAbs 2.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.40e-12 (3 of 3) |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-wide | 3 | PASS: mtf.maxAbs 2.77e-12 (3 of 3) | PASS: mtf.maxAbs 7.21e-12 (3 of 3) | PASS: mtf.maxAbs 7.09e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.27e-13 (3 of 3) | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 2.06e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-tele | 3 | PASS: mtf.maxAbs 8.84e-13 (3 of 3) | PASS: mtf.maxAbs 7.74e-12 (3 of 3) | PASS: mtf.maxAbs 7.60e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 7.05e-12 (3 of 3) | PASS: mtf.maxAbs 6.42e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: mtf.maxAbs 9.15e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-11 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | PASS: mtf.maxAbs 2.75e-12 (3 of 3) | PASS: mtf.maxAbs 9.46e-12 (3 of 3) | PASS: mtf.maxAbs 9.47e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 7.39e-13 (3 of 3) | PASS: mtf.maxAbs 3.55e-12 (3 of 3) | PASS: mtf.maxAbs 3.79e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | PASS: mtf.maxAbs 8.29e-13 (3 of 3) | PASS: mtf.maxAbs 7.92e-12 (3 of 3) | PASS: mtf.maxAbs 7.80e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: mtf.maxAbs 5.96e-13 (3 of 3) | PASS: mtf.maxAbs 6.54e-12 (3 of 3) | PASS: mtf.maxAbs 6.46e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 7.67e-13 (3 of 3) | PASS: mtf.maxAbs 3.25e-12 (3 of 3) | PASS: mtf.maxAbs 3.34e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: mtf.maxAbs 3.13e-13 (3 of 3) | PASS: mtf.maxAbs 6.62e-12 (3 of 3) | PASS: mtf.maxAbs 6.57e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | PASS: mtf.maxAbs 7.25e-13 (3 of 3) | PASS: mtf.maxAbs 3.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.91e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 3.30e-13 (3 of 3) | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 2.47e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | PASS: mtf.maxAbs 3.95e-13 (3 of 3) | PASS: mtf.maxAbs 8.65e-12 (3 of 3) | PASS: mtf.maxAbs 8.39e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: mtf.maxAbs 5.47e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) | PASS: mtf.maxAbs 1.15e-11 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 4.90e-12 (3 of 3) | PASS: mtf.maxAbs 5.85e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: mtf.maxAbs 7.95e-13 (3 of 3) | PASS: mtf.maxAbs 9.12e-12 (3 of 3) | PASS: mtf.maxAbs 8.33e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | PASS: mtf.maxAbs 6.24e-13 (3 of 3) | PASS: mtf.maxAbs 4.54e-12 (3 of 3) | PASS: mtf.maxAbs 4.30e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | PASS: mtf.maxAbs 4.05e-13 (3 of 3) | PASS: mtf.maxAbs 2.39e-12 (3 of 3) | PASS: mtf.maxAbs 2.65e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | PASS: mtf.maxAbs 5.08e-13 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) | PASS: mtf.maxAbs 2.95e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.23e-14 | 128 of 128 | nikon-z-24-70f4s-f5.6-ref-zoom0.5 | cut sagittal, field 1, frequencyPerMm 14 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 128 of 128 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 128 of 128 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 1.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-photopic | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 1.55e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikkor-z50f12-f5.6-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikkor-z50f12-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikkor-z50f12-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikkor-z50f12-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikkor-z50f12-f11-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikkor-z50f12-f11-photopic | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikkor-z50f12-f11-best-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikkor-z50f12-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-ref | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 1.23e-14 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-tele | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | PASS: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-ref | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-ref | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-best-ref | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-best-photopic | 1 | PASS: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-ref | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-ref | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-best-ref | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | PASS: mtf.maxAbs 1.89e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-wide | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-wide | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-tele | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-wide | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-tele | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | PASS: mtf.maxAbs 1.78e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 2.46e-10 | 362 of 384 | nikkor-z50f12-f5.6-photopic | cut sagittal, field 1.19e1, frequencyPerMm 100 |
| lv – optiland | phaseStep.waves [waves] | 4.07e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1, line 1, ray 2368 |
| lv – optiland | convergence.maxAbs | 1.68e-2 | 384 of 384 | nikon-z-24-70f4s-open-ref-tele | cut sagittal, field 1.66e1, frequencyPerMm 70 |
| lv – optiland | lattice.columns [cells] | 64 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-ref | — |
| lv – optiland | rays.compared [rays] | 4577224 | 384 of 384 | — | — |
| lv – optiland | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – optiland | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – optiland | waveMtf.flagged | 1.18e-10 | 22 of 384 | nikon-z-24-70f4s-open-photopic-wide | cut tangential, field 4.33e1, frequencyPerMm 10 |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.08e-9 | 362 of 384 | nikon-z-24-70f4s-f5.6-best-ref-wide | cut tangential, field 4.33e1, frequencyPerMm 50 |
| lv – ref | phaseStep.waves [waves] | 4.07e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1, line 1, ray 2368 |
| lv – ref | convergence.maxAbs | 1.68e-2 | 384 of 384 | nikon-z-24-70f4s-open-ref-tele | cut sagittal, field 1.66e1, frequencyPerMm 70 |
| lv – ref | lattice.columns [cells] | 64 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-ref | — |
| lv – ref | rays.compared [rays] | 4577224 | 384 of 384 | — | — |
| lv – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| lv – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – ref | waveMtf.flagged | 1.17e-9 | 22 of 384 | nikon-z-24-70f4s-open-best-ref-wide | cut tangential, field 4.33e1, frequencyPerMm 50 |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.05e-9 | 362 of 384 | nikon-z-24-70f4s-f5.6-best-ref-wide | cut tangential, field 4.33e1, frequencyPerMm 50 |
| optiland – ref | phaseStep.waves [waves] | 4.07e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1, line 1, ray 2368 |
| optiland – ref | convergence.maxAbs | 1.68e-2 | 384 of 384 | nikon-z-24-70f4s-open-ref-tele | cut sagittal, field 1.66e1, frequencyPerMm 70 |
| optiland – ref | lattice.columns [cells] | 64 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-ref | — |
| optiland – ref | rays.compared [rays] | 4577224 | 384 of 384 | — | — |
| optiland – ref | rays.dropped [rays] | 0 | 384 of 384 | — | — |
| optiland – ref | lines.compared [lines] | 5 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – ref | waveMtf.flagged | 1.16e-9 | 22 of 384 | nikon-z-24-70f4s-open-best-ref-wide | cut tangential, field 4.33e1, frequencyPerMm 50 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.71e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.73e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 8.03e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.52e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.28e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.75e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 6.13e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.15e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.48e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-ref | 3 | PASS: waveMtf.maxAbs 6.58e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.62e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.64e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-photopic | 3 | PASS: waveMtf.maxAbs 7.06e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.65e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.10e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | PASS: waveMtf.maxAbs 8.77e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.91e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.34e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 3.65e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.52e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.56e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | PASS: waveMtf.maxAbs 8.10e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.28e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 9.90e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.87e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 8.27e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.84e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 3.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.62e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.99e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | PASS: waveMtf.maxAbs 6.61e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.86e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.95e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | PASS: waveMtf.maxAbs 4.32e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.57e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.79e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | PASS: waveMtf.maxAbs 5.92e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.89e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.79e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 3.38e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.70e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.85e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | PASS: waveMtf.maxAbs 9.93e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.35e-11 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 7.37e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.19e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-10 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 9.57e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.99e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.96e-11 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 5.03e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.71e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | PASS: waveMtf.maxAbs 4.68e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.15e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.10e-12 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | PASS: waveMtf.maxAbs 4.49e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.65e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.32e-12 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | PASS: waveMtf.maxAbs 5.28e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.79e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.92e-12 (2 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 2.13e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.13e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.57e-12 (2 of 3) |
| nikkor-z50f12-f5.6-ref | 3 | PASS: waveMtf.maxAbs 2.11e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.55e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.27e-10 (3 of 3) |
| nikkor-z50f12-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 2.46e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.45e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.03e-10 (3 of 3) |
| nikkor-z50f12-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 2.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.46e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (3 of 3) |
| nikkor-z50f12-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.89e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.90e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.53e-10 (3 of 3) |
| nikkor-z50f12-f11-ref | 3 | PASS: waveMtf.maxAbs 1.20e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.86e-12 (3 of 3) |
| nikkor-z50f12-f11-photopic | 3 | PASS: waveMtf.maxAbs 3.76e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.20e-11 (3 of 3) |
| nikkor-z50f12-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.16e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.40e-12 (3 of 3) |
| nikkor-z50f12-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 1.14e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-11 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | PASS: waveMtf.maxAbs 3.36e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.04e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.07e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 2.34e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.11e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.08e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 2.78e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.10e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.01e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 2.25e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.08e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.06e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-ref | 3 | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.72e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.70e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-photopic | 3 | PASS: waveMtf.maxAbs 5.02e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.79e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.81e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.12e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.71e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 6.53e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.73e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.79e-10 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | PASS: waveMtf.maxAbs 4.67e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.92e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.62e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 2.36e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.64e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.00e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.63e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.14e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.21e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.99e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | PASS: waveMtf.maxAbs 2.13e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.99e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.79e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | PASS: waveMtf.maxAbs 1.19e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.88e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.34e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | PASS: waveMtf.maxAbs 9.73e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.27e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 2.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.52e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.17e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | PASS: waveMtf.maxAbs 4.22e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.70e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.46e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.33e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.31e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 4.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.22e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.20e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.55e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.87e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | PASS: waveMtf.maxAbs 8.42e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.90e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.25e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | PASS: waveMtf.maxAbs 6.43e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.50e-12 (3 of 3) | PASS: waveMtf.maxAbs 6.99e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.19e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.40e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.68e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 6.58e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.21e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.14e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | PASS: waveMtf.maxAbs 5.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.82e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.34e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 2.48e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.53e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.55e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | PASS: waveMtf.maxAbs 2.77e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.91e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | PASS: waveMtf.maxAbs 6.88e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.03e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.03e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.83e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.63e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.63e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | PASS: waveMtf.maxAbs 1.23e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.96e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | PASS: waveMtf.maxAbs 4.80e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.08e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-9 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.77e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.12e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.05e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | PASS: waveMtf.maxAbs 2.51e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.66e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.61e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 6.73e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.27e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.89e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 2.16e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.88e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.87e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 7.95e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.64e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.60e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-wide | 3 | PASS: waveMtf.maxAbs 2.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.22e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.16e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 8.49e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.28e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-tele | 3 | PASS: waveMtf.maxAbs 1.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.13e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.25e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | PASS: waveMtf.maxAbs 9.12e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.18e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.23e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.56e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.48e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | PASS: waveMtf.maxAbs 2.92e-12 (3 of 3) | PASS: waveMtf.maxAbs 7.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.45e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | PASS: waveMtf.maxAbs 1.95e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.74e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 7.97e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.57e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.57e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | PASS: waveMtf.maxAbs 1.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.83e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.73e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 8.48e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.08e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.08e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.32e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.42e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 4.43e-12 (3 of 3) | PASS: waveMtf.maxAbs 9.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.39e-11 (3 of 3) |
| nikon-z-mc-105f28-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.66e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.00e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.97e-10 (3 of 3) |
| nikon-z-mc-105f28-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.10e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.13e-10 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.67e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.71e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.63e-11 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 9.44e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.52e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-ref | 3 | PASS: waveMtf.maxAbs 7.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.56e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-photopic | 3 | PASS: waveMtf.maxAbs 1.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.98e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.42e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-best-ref | 3 | PASS: waveMtf.maxAbs 1.13e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.55e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 1.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.01e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.33e-11 (3 of 3) |
| nikon-z-135f18-plena-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.78e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.58e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.84e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.86e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.64e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.49e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.91e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.93e-10 (3 of 3) |
| nikon-z-135f18-plena-f11-ref | 3 | PASS: waveMtf.maxAbs 4.13e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.56e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.62e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-photopic | 3 | PASS: waveMtf.maxAbs 4.95e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.72e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.92e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-best-ref | 3 | PASS: waveMtf.maxAbs 4.01e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.72e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.56e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 5.57e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.70e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.87e-11 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | PASS: waveMtf.maxAbs 1.56e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.48e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.49e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | PASS: waveMtf.maxAbs 1.01e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.74e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.75e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | PASS: waveMtf.maxAbs 1.70e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.35e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.36e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | PASS: waveMtf.maxAbs 1.28e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.68e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.69e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | PASS: waveMtf.maxAbs 5.94e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.41e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.47e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | PASS: waveMtf.maxAbs 3.14e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.01e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | PASS: waveMtf.maxAbs 7.34e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.54e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.61e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | PASS: waveMtf.maxAbs 2.03e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.86e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.84e-10 (3 of 3) |
| nikon-z-24-70f4s-open-ref-wide | 3 | PASS: waveMtf.maxAbs 1.89e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.25e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.10e-10 (1 of 3) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.30e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.39e-10 (2 of 3) |
| nikon-z-24-70f4s-open-ref-tele | 3 | PASS: waveMtf.maxAbs 1.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.12e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.14e-10 (2 of 3) |
| nikon-z-24-70f4s-open-photopic-wide | 3 | PASS: waveMtf.maxAbs 5.22e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.11e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.64e-11 (1 of 3) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.26e-10 (1 of 3) |
| nikon-z-24-70f4s-open-photopic-tele | 3 | PASS: waveMtf.maxAbs 1.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.51e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (1 of 3) |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | PASS: waveMtf.maxAbs 2.64e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.01e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.92e-10 (2 of 3) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.62e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.67e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.67e-10 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | PASS: waveMtf.maxAbs 8.19e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.73e-11 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 8.61e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.37e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.41e-10 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.84e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 6.60e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.22e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.20e-10 (1 of 3) |
| nikon-z-24-70f4s-f8-ref-wide | 3 | PASS: waveMtf.maxAbs 3.86e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.02e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-9 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.89e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.85e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-tele | 3 | PASS: waveMtf.maxAbs 1.59e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | PASS: waveMtf.maxAbs 1.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.32e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.35e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 7.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.88e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | PASS: waveMtf.maxAbs 6.91e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | PASS: waveMtf.maxAbs 4.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.41e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.47e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | PASS: waveMtf.maxAbs 1.07e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.13e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | PASS: waveMtf.maxAbs 1.46e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.93e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | PASS: waveMtf.maxAbs 1.38e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.86e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | PASS: waveMtf.maxAbs 8.71e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.43e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.05e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (3 of 3) |

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
