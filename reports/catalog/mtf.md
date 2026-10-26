# MTF baseline of catalog

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
| Suite | catalog |
| Suite hash | 6f4820c82f506f07f16a016c6a5b59478524a9339dd7a33a93ecc8439147cb81 |
| Baseline hash | dde7ac5caff395dd5ab415fd7d16630c285f21c3e3edd463456565e72cd39c08 |
| Contract version | 1.6 |
| Policy | rungs v15 |
| Policy hash | 1db393cc152dc19e71ca79b07f474d3a837fa402f51632312a6fc5cbeb671524 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | c46cbf114de40a8df78d7a9fc63a54e47bd2d05d4185afdd9962742ed563878b | 49b68a617dc135ebdd70d5ff57dc2bce7f09ea74668dd1848e7d973bbcfac0b3 | commit 879c061024519be2b1acaf3cc082947235ea9760, dirty false, engineFileCount 177 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 965e1b3ac30f08fd7d583547cbdc43ccbfd9cf74f6e6bc7cd6af2a98927ca7e7 | backend numpy, commit 4e893f53aee1312f2d091680b93dd2279711e197, dirty true, distVersion 0.6.2.post117+g4e893f53, jit true, numba 0.65.1, numpy 2.3.5, precision float64, python 3.14.8, scipy 1.16.3, sourceFiles 534, sourceHash 279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38 |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 | sourceFiles 13 |
| replay | 1 | c46cbf114de40a8df78d7a9fc63a54e47bd2d05d4185afdd9962742ed563878b | f5389fa986ffe5ef5e2109535a761cd4106f3bab97c366e2cf4b322b8c5e2374 | commit 879c061024519be2b1acaf3cc082947235ea9760, dirty false, engineFileCount 177 |

| Run | Case |
|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | aa2d4aedeac8afc95be11e8dbdcb85e34ca36f2fd661c6c1a24196886e59322d |
| catalog-agfa-color-telinear-90mm-f4 | c35dc1f4b315976663237be25fecaacba78cfd71bcf5f9d679ba2413dd3d829b |
| catalog-agfa-solagon-50mm-f2 | 549605cef9be573cc1ea00ede119c0b6ead44f4516d4a3cffd26229a9ecf42ef |
| catalog-angenieux-dem-180mm-f23-apo | efba91bf42c9b913b2e7a6d0068c81216e9ca7cceefcd20c1e0aaba9190a85f5 |
| catalog-angenieux-retrofocus-r1-35mm-f25 | 3b4333bd6762b042610da358b4456603b248397b8dedd4396e08890e2259a6f3 |
| catalog-angenieux-retrofocus-r11-28mm-f35 | 18b09f91b18f4040bff87ba1b428cf2266ffc51eb2015445a2425e9495412f93 |
| catalog-apo-lanthar-50f2 | 36e2f6d1ef6eacfbd306197ba4899529691909edd64f78a569513384edec400f |
| catalog-apple-iphone-12-main-wide | f03fd8df293091159dc2a751ded1189179be28c22209287b4eee29f3d91adb5d |
| catalog-apple-iphone-7-wide-camera-lens | 6e23e7f7ecde6a3fc7c601108c4f9ccfd8bcc81c68d3155e113dd4453fb5396a |
| catalog-bertele-sonnar-50f2-scaled | 428193c8ff2197e63fd72dce707720f8284466f13e38a832edbd2009b37f830d |
| catalog-canon-50f12-1956 | a112e7883eaa1644b5b5424b7ce15bc00386d0f242e410e344270e675b3848e6 |
| catalog-canon-50mm-f095 | ceeb6d72bca8b17c2fc403c1bc0a87a87d752894aee991f4d4cfc50469102cd2 |
| catalog-canon-cine-servo-17-120-t295-39-ef-wide | 3208a8d052f12c2f43180146505363d7e088374b86bba2afbd8ceb1ccc3943c0 |
| catalog-canon-cine-servo-17-120-t295-39-ef-tele | 18d1b06c018c195abdbc77cfaa39b59343f9cceb757559883831bd3ba43889dd |
| catalog-canon-ef-100-300mm-f5-6-wide | dbe7cb05e8c9d2a184d63001961bb5d39e3520d75518dd277e0a6f0483202ada |
| catalog-canon-ef-100-300mm-f5-6-tele | 7639dff133a9f4564fa3d876e060054ba2094ccbe7c4ec2c16e2a94de904a4bf |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-wide | 74b85e6309dacbb8841beac873496dd172b5bde039213fa68addee204a878d91 |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-tele | a0e02617d4d46846c0930ea4ef31bddeedc6d055abd871ba216ce2c7b07d338e |
| catalog-canon-ef-100300mm-f4556-usm-wide | d7fc7cab25fbbeb1ce8d8a40a8d3d3512804eead1d4e9558eee53fd4d2adca84 |
| catalog-canon-ef-100300mm-f4556-usm-tele | 1b4bd37d3b6e1c532cfbb9099ae91fec5dc2912f013ded502db70cf53344380b |
| catalog-canon-ef-100400-f45-56l-is-usm-wide | 0c9d1bf372f65c07e6ada10f2aae3d9e802446e91b2e22a2bcaa1b578c4014be |
| catalog-canon-ef-100400-f45-56l-is-usm-tele | 50c0b5f1c7b0fea6e83b748844ae83cc0393772525933aa2097ea4865996cef4 |
| catalog-canon-ef-100mm-f28-macro | 77c70018d9a8cca505fa5c2c110f4a8a077446790bfab2f1e00a094512adf226 |
| catalog-canon-ef-100mm-f28l-is-macro | 630b556dbd939079822c0fbb600c67de674470fd9f8d8c6394383d5aaf32ed71 |
| catalog-canon-ef-11-24-f4l-usm-wide | 05a732675a0bc4401e04644e374864b768dfd55b0e83e721c913e8a605791417 |
| catalog-canon-ef-11-24-f4l-usm-tele | eae8acee440edd2cea821aec38e73bf89669948e13be0cb77274aa0998bd9192 |
| catalog-canon-ef-135-f2l-usm | 8f1f7d95653af82da64d44b73a272e7eb84232c67ee643e47207e067064ee070 |
| catalog-canon-ef-135mm-f28-soft-focus | 770db3282400e9d0a0724af376dd35b504dcace5d380960e7b271c87db7ff302 |
| catalog-canon-ef-14mm-f28-l | ed552365387c4763fea7db0daa22181347fd302e642703e321734a252e5e577b |
| catalog-canon-ef-15mm-f28-fisheye | 5ab37f164eab15ff475216cc36d81e9ddb880a32add21448d3a289d8157f557a |
| catalog-canon-ef-180mm-f35l-macro-usm | 1367390ef4727c5c969c105f872720ef4307f4cc7b8433d5dbb7847880cfaf51 |
| catalog-canon-ef-20-35mm-f28l-wide | 2a4789c7431fe3c8f172277fde0490f7a498c3f14dba0cf9036e942510cd5f00 |
| catalog-canon-ef-20-35mm-f28l-tele | cc1a3daec89c800a02298172c2e62def663deb715c133571999d509cee2255af |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-wide | e6d2480f8a24b4b40926c67252ac3416c15d093f5e145aca82d19f54051088e1 |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-tele | 2182acfe94fd4102c3d73f8ecd127eaa9219238bece212f3c4b2ece437a5ef4a |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-wide | 589023d89b28b0036eef17486d9a87f5b82ff90fde74adffc4825d10bd41bb3b |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-tele | 439c99bdf68141c7c7a4a23cef0e11a7a051b0780385347a58500c5675e1c79b |
| catalog-canon-ef-200mm-f1-8-l-usm | 5035b4b1bbf487bebe265419baecc64f24c89908ac97bf02c361d48f694c09df |
| catalog-canon-ef-200mm-f2l-is-usm | 27aae516405d8aeae02b9f81038ae743368f9eea1ba54cb774891927e8cba409 |
| catalog-canon-ef-20mm-f28-usm | 332ea620c2bc62b2f701999cdc5bd59b929947de8759957059a3d854f60b34ee |
| catalog-canon-ef-24-70-f28l-ii-wide | 80391f9f705b1f10bdd6d4fee90739c8b7ed587b4caf64aa15bb99c8a095ed97 |
| catalog-canon-ef-24-70-f28l-ii-tele | 4df623fc7d6a852f02e2b5b11ed847b55fa3e363b38383b34eb5f15f0c6774a1 |
| catalog-canon-ef-24-70mm-f28l-usm-wide | 47e201b253407a2708cffaa9d613dab0c9ea23f566188a975c47a8dcade70aaf |
| catalog-canon-ef-24-70mm-f28l-usm-tele | 176ee86a12589d0e1e9ea9504c6d5c22aaedc20eb239c4ef702836403c1c8fa1 |
| catalog-canon-ef-24mm-f14-l-ii-usm | 793edba06684f941a1e6b97f1251715981b4e9526841e036e0ec1f885044a7f3 |
| catalog-canon-ef-24mm-f14-l-usm | d533c600b8e5d632095756cfa665d58e18a3c6cd3cb220d234b3433cbb72efac |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-wide | 84f57e9ef405a377d713ef73f12081a8f855a0228c34476490634f3b32952499 |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-tele | e42f389328e7b69a71c3bf29d3a2fe8f1afb17247579e8e251446b47367bddba |
| catalog-canon-ef-28-105mm-f4-56-wide | e690ccdfd99178bd9aa1cc11ca83c9202caab6b10383d68d9c03da8f3cbaaeca |
| catalog-canon-ef-28-105mm-f4-56-tele | 1ac17d8d9ddd046c2f8ffaeeb5eec525afe4f91a2a5d57d0de1a6aeb1db0e183 |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-wide | d8cf7b60ce78044382f8b3dc9289cde4dba7ff368ca5bf70cda9347da8c064ae |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-tele | 4f12dbef6640786eef8f724513fbe32652ba59469a832750cc00d2e545278dbf |
| catalog-canon-ef-28-200mm-f35-56-usm-wide | 04d015a3333acba49f23f562cd15c8f83c03c0d58b2618900ed391f030b4a581 |
| catalog-canon-ef-28-200mm-f35-56-usm-tele | 701b2191bb03674a850481906b14219db74b11850d04530767b26fc184cb73a9 |
| catalog-canon-ef-28-70mm-f35-45-ii-wide | 701ee88a8c9196a15ed2fbc9968ad90d017a57fc93867b5fc7990898c418b87c |
| catalog-canon-ef-28-70mm-f35-45-ii-tele | 12727afdc014ddc4939a2d3249e23d6e254ae5f9610b1162e3059c17a420c46a |
| catalog-canon-ef-28-80mm-f35-56-ii-wide | fcfa60122feee49e21c7189c2955dbd73318f420c15c5d729a94adc751e8a1f4 |
| catalog-canon-ef-28-80mm-f35-56-ii-tele | aa830add7515bf8904b3d6c4975c97c307506180266c69d61e11f374bd980bb3 |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-wide | bc699ca6f4444af73d2de2c6c5bd132a4329d643025c049c01b6a4275eb0a6f2 |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-tele | 073ee1a2197c0452927beb959270ec0d4e4ddcd5dab78200ab3993b5b3898d7b |
| catalog-canon-ef-28mm-f2-8 | c12bf63b4fc0865d8fe29b94100d0c666e991e6bd3b0e2e205a58e93f13cfe8f |
| catalog-canon-ef-28mm-f28-is-usm | 25baf03ba4bbb3baf0bf0704c511cd3b76914b9c86d2b40cfb443f411a1bc19b |
| catalog-canon-ef-300mm-f28l-is-usm | 4d50be0b4b9f75fea9f2b0b12479d1f13fc9dfac5c35f7ea989a8bcb361d9c95 |
| catalog-canon-ef-35mm-f14l-ii-usm | 0a42d6c81daa5952b1b391cba801c82ee946b5341448eb9b6c8b8731d6e6685e |
| catalog-canon-ef-35mm-f14l-usm | d33acbdfe4b239cae4a94dae76b8757cee180f45bfda2f3c4abf2844a518321f |
| catalog-canon-ef-35mm-f2-is-usm | ba9e24559e9c63b52d2524da5f81cf199f3e520e1dd860c7df7aa928d39c6a30 |
| catalog-canon-ef-40-f28-stm | d50fea8b212a045ec7e966d0ac3aa7444faf7deaf2a57601136a6c023874a186 |
| catalog-canon-ef-400mm-f28-l-is-ii-usm | 7943457bcc48e40c3fbca50f26038272324bb784f37d968c04c2b13e70faca86 |
| catalog-canon-ef-400mm-f28l-is-iii-usm | 852d6632f7a07bd32221875ce15a9fa72239879073bedf3998aaa805c81b76a2 |
| catalog-canon-ef-400mm-f28l-is-usm | c1bd82f14f39d89419657ea6b067764c9ed81dbb288bf0fbbc988e27596bfef2 |
| catalog-canon-ef-400mm-f4-do-is-usm | 96325a6df5e2e5b9c38d490eb46125581c62e382b8cb066ab92e0ef435f42a62 |
| catalog-canon-ef-500mm-f4l-is-usm | f25873d949adc9e5285268c5ab52b2dd83453fb605a6ca731261aed81ba33758 |
| catalog-canon-ef-50f10l | 465268951b00f4b4aecd6a0c7f983daf65aaf48f92f19a770edb371f3eda6b69 |
| catalog-canon-ef-50mm-f1p2l-usm | 703723b8a161b8720edbb2a7a107f9fb61694b20040d1d36bb6573d1836e60c4 |
| catalog-canon-ef-600f4l-is-ii-usm | eccffa298f00da5c9a720bd9ba7f5c0443ae26bb70a1e1a376b11382d2b3dc6d |
| catalog-canon-ef-600f4l-is-iii-usm | 8581522070f5195632214893183b3a405ffe541ccb21d5371e9dddaadddc363a |
| catalog-canon-ef-600mm-f4l-is-usm | e118f4feced4d2fb0cfa3cb910d6f3f005c89353def0e7d837adff0761926ca8 |
| catalog-canon-ef-70-200f28l-is-usm-wide | cb7abd534b5e9c56ea89cfa2ccc063d469c758e42c5c48dead66e0fe28649480 |
| catalog-canon-ef-70-200f28l-is-usm-tele | db998e365522dc388271eab08ea2afdf06cf861089e01afb7403e71db790ffb7 |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-wide | 2cf4883d5c6111a66c333e2b74f37c11023bc66fa1d542d9b864ef5a288cd2fd |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-tele | e73ba411bc26b3d8e60aa8cbc8fcedea9279fc2e48ba8ffa77009a984dc793ca |
| catalog-canon-ef-70-200mm-f4-l-usm-wide | 72b89bf8669c96e6d86e1be7302b2b7b30e72d33c43125a86827b217a1f730bf |
| catalog-canon-ef-70-200mm-f4-l-usm-tele | 4d06eaa8de8ec11644537cce81742abc54805de6ef2d655038cd432205db021d |
| catalog-canon-ef-70-200mm-f4l-is-usm-wide | 0cc4ac5955629a2566cbbc7365032f4ba341ce5c6e01df294d044bc995195097 |
| catalog-canon-ef-70-200mm-f4l-is-usm-tele | 38478f860b6c4c72ee6cb83e84111b8d94e6c7cb089d5215b6d8c96a6734d2d6 |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-wide | cfda09df15b5921ff94955204d6b981eb8cb63066b7c8c1e0d0cc6b6bc45abd3 |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-tele | dfb9bbbe5041aadcdfbe531f89a8f352eb5930f2f458379d11a582b0c8dd7f39 |
| catalog-canon-ef-70-300mm-f4-56-is-usm-wide | 857ce93e5f0a0b2a4c7bdfddc78e3b29cea14ed67f2e5071494b7fffe67624b1 |
| catalog-canon-ef-70-300mm-f4-56-is-usm-tele | b53a2ab690c0bcbbf48e7d878fe715b97605c7df78ae0032ef571254d6fde633 |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-wide | 25b0a0163304775d4cfeb585ca9fa4aaacbe6e1b6eff0f9fb250b04e86caff42 |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-tele | 0be8112c84f48e4255652e5d82b3fa72317fb5253add4680e80bd861892b43bc |
| catalog-canon-ef-70-300mm-f45-56-do-is-usm-wide | fe08a6dece72e6929f4b7986075453ce68dbcf012f1dc49772660b0a51b96ad3 |
| catalog-canon-ef-70-300mm-f45-56-do-is-usm-tele | 3f999377c681817c44e19c81115ce5f57655615ce482aef22b726758a16fedb4 |
| catalog-canon-ef-75-300mm-f4-56-is-usm-wide | 9042ba97accba5f72cb18a07dda718daf78892c3d90bd9414caf2702eaa0b2fd |
| catalog-canon-ef-75-300mm-f4-56-is-usm-tele | 6d841b5a619cf701875b6cec1d49eea95599fe01d7222ed7793c25bda2d6ed57 |
| catalog-canon-ef-8-15mm-f4l-fisheye-usm-wide | 69c6af1a169d29659707d36232c74c8c12cd010a3f2a7a00effb8d25239805e8 |
| catalog-canon-ef-8-15mm-f4l-fisheye-usm-tele | 789a8b49ce3c94a0412926b01338e33a4257e21e2b5b09cec7c39639f3777b8f |
| catalog-canon-ef-85mm-f18-usm | 8424494e0d587cca42e4c7e82231394b93c5f103231772d29e4abbc4a064e9ec |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-wide | 257083b9edf08d2de74fe9782f16f75eaed7b979bbb690d34b5338b0ac6dfb9f |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-tele | 97df4cfb5d093db4c5e78ad7403e711d0a3066f6bc6eda4c6c4c8eb4e3883cea |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-wide | 9ce0243f1617758693c2e7674ba945398f446ca0231870b08b6e0d2813e74f0f |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-tele | 3dd0d9510f445e916a1d1101dfd5b38ada731be3d8c9bc22e9bd5e6ea18ad160 |
| catalog-canon-ef-m-18-55-f35-56-is-stm-wide | 2883577369be3930124fbe489d3e1b58f55b343f5949ae1a335c224a260ffead |
| catalog-canon-ef-m-18-55-f35-56-is-stm-tele | ff1a598ca643efe11e8ecc29256e90b457c84e8278d4cfaf32e41a62abbbb9a8 |
| catalog-canon-ef-m-32mm-f14-stm | 4a6d25a7e8c712a0fb562db701faf925cc7ed18008152e52e3481fcaf334868e |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-wide | 048f8e20074d35d17452bc3eab2cd9db0c2bb1069ae97e5618d0be029faf4af9 |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-tele | f54850072a3e235f190ed60b044ec28310a43c24cf91be8d9083d32c835ba70a |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-wide | fd8025db73e13ada11518d65b50dcd85c3c653109fa39261a37ad66ab352d00b |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-tele | e47162122694f3953251d00ffad1575f34d3d1a54d2fd54b93f838ebfff4cff6 |
| catalog-canon-ef-s-55-250-f4-56-is-wide | 7431d4033239af7f590d2ddb94ef2d0ee438d78576e7cb46c5e9f1cedb4df144 |
| catalog-canon-ef-s-55-250-f4-56-is-tele | 56512b6c96191eb0382a4837f93cc87e325078963d79fcc974c7bdb5544434e5 |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-wide | d5239f207156ed384b4150f9b7a57334909c0f0063ae7c57735bbf681910c86e |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-tele | eb05acc5d746cdca8e9a605a03bae947485abfae7b81d0066abc1ee1e9043fca |
| catalog-canon-efm-22mm-f2-stm | b1ebd78df215c7b6f7bb288a6adbe6d9fa3ef2eb13a5a9519bddc0d73580174e |
| catalog-canon-efm-28mm-f35-macro-is-stm | 0906ae3d18e6001be06087df3351220410153ae95c2a3b2c6ca9d2720ad96c88 |
| catalog-canon-efs-10-18-f4556-is-stm-wide | 13486ff289304b2dcf1a72e493362d3f6193e7909cc6181f4b3f89d00e82c8a8 |
| catalog-canon-efs-10-18-f4556-is-stm-tele | 373beab81783b4d522c6bc4a0f623bbf75b499a706afa02fc972330c09f29234 |
| catalog-canon-efs-10-22mm-f35-45-usm-wide | 9eda2b90d5e2760b35711b076b00b73870af0b0be821ae7c88897ad4be87086d |
| catalog-canon-efs-10-22mm-f35-45-usm-tele | 1fa785fcd4c0d319e0a41962075dd27b64880e323ef5fa3ec29fed59d83b21b1 |
| catalog-canon-efs-17-55-f28-is-wide | 0e07279c7dee4412462cec803cb2d729c0149d342a6ecc8acbb62a9cf154ff36 |
| catalog-canon-efs-17-55-f28-is-tele | 55bf9b5a77743e36e01a29ba9ee0488b83cb4b2526aff5ab4f461d693325e0b9 |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-wide | 5e7f9cd6068cccf733d61eeb5f0c3a93d6927d8acf35d2418571bffbfb497191 |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-tele | be9f03de42a53a953305f6e3fe254bbf91330138ede25461f32888da2d980611 |
| catalog-canon-efs-18-55mm-f35-56-is-wide | d62a181d84b4afddd6dc4c872fceedaf01b1202e224e3290634496beb92fd68e |
| catalog-canon-efs-18-55mm-f35-56-is-tele | fa177f97fa14cec0808de8e664267281e5e45007d66859562c1f573d9c31ac60 |
| catalog-canon-efs-24-f28-stm | 31ac5e1dc39a8da19c4eb3344e58fad325d84aa798446b4183c94db4262d9b97 |
| catalog-canon-fd-150-600mm-f56-l-wide | dee90e18a4eb4261fb2e1c31680105d26d22266b3cb13af71529fcea133b7b63 |
| catalog-canon-fd-150-600mm-f56-l-tele | a36ee72de5408bf2deb8265dc5a52b5ce431d7b17bb62d3dcb2e4aa794d8a4e2 |
| catalog-canon-fd-24mm-f28-ssc | 3341bc927730d4e16a4dcd7753e2463b088b9d80cd10ad0d96a0250c4511bc56 |
| catalog-canon-fd-28mm-f28 | 5838b46c70dc5e0fe82e93b1a0eeac1048a131f20b87f21e3d081970b0b78197 |
| catalog-canon-fd-300mm-f4-ssc | e53755e97e3b773ad5786d315cfd73ac90f81979f101911872aea7007d377563 |
| catalog-canon-fd-35-f2 | 4ade483530c0acf9fc109007008d474944b99a7edda733451e8301df5f5b83a1 |
| catalog-canon-fd-50f1p2-l | a35e91522683b900716f9e8eb31c458203959999b7d3b6d949cef9dac24412c4 |
| catalog-canon-fdn-50f12 | e20137848e869473c9976cb235dc26329e569140d41b7540113fe154cd09b2b0 |
| catalog-canon-fl-300mm-f28-ssc-fluorite | 45ce2e9fbc2ce7801aa3e89fa9324a0970f307ecc2e20bfda47594f36a1bef67 |
| catalog-canon-fl-85-300mm-f5-wide | 00295b6850d79898a3602e8338765ff13544c1181f1c6b94a679a8356ddda821 |
| catalog-canon-fl-85-300mm-f5-tele | 122656ed0a77f1f8a4a3b76fd2ea1e6683c428f68e78ec30b235a80d7f357474 |
| catalog-canon-new-fd-100mm-f2 | f3a3e28a16eb2d17b9c0566ebf206aa6c87d2ad0d9ae89cecb22467c546d4d87 |
| catalog-canon-new-fd-14mm-f28-l | b92389a112abfa802f3c65377121fc8dfe10d5e39c861ccdb737e751030cbac9 |
| catalog-canon-new-fd-35-105mm-f35-wide | 5d1ff90cd69515cfc2258a2b00aa0c7183cb47e6ffda671f4b6a5b6c025b511c |
| catalog-canon-new-fd-35-105mm-f35-tele | 5ec1fa2d12bd4696923f40b95a0049dc5522c7780be3b31e5c461aa3b2d7a991 |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-wide | 371983bca6fe3ca9d5046591478b8ce31362ad1db424db18a2fac2439c90a6a6 |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-tele | 1380aaa081cffe28bcc7ae1aa15517bd59c46ecec0c0bdb81f510525161db9ea |
| catalog-canon-powershot-g1x-1560-f28-wide | 6521f18f66bea8a59806774387425d622564629f5da1775ea9c071f93f99b871 |
| catalog-canon-powershot-g1x-1560-f28-tele | 91c5a177130e1cb5902ea4cb7af7e14039be1c53ace384a3dbe5f11ae8a757ae |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-wide | 83fe5cb53e329f7472b32848f5d67a00cc7a74dd3ca6e32e53101470478668e3 |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-tele | b39d89ecef13a15a4d3e18fd50b2955b4b3e4fd9a929a08c66cbf9d0fa15f2dc |
| catalog-canon-powershot-g3x-wide | 93f2c4d59896a4639307e1cd095027c07dd72642d31c0bb2dac44339132bf1f0 |
| catalog-canon-powershot-g3x-tele | 1ad7eba99db4bd24b591282fe6128bb88d2da327938b4d0f97c1f3895f652bba |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-wide | ceeef24f4e91a9d8e74321fb216f9dd846864874eed94458023cc1c9c1264a2c |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-tele | b6981a00a8d1ed7d5d596ceb8cc74b71f87b0647b7524660c8764ae7b6575f2b |
| catalog-canon-powershot-g9x-wide | 88481cf92b0f388da249e33853f83b005490694ae9fe869cd37886207266a1cc |
| catalog-canon-powershot-g9x-tele | f5a79b33db22c5cbdd4d766bbdbce9e4f7191514bc6df119597736ba88d330f1 |
| catalog-canon-r-58mm-f12 | 1ddd5de058986a25aadeb6e5456e55c1be2f8d9d72837cb2bd6534a0c5d1acd3 |
| catalog-canon-rf-10-20-f4-l-is-stm-wide | cd2af023809aba29b2c78e5d9e2733242b6e87b29ac61be4c81731ade31dcae4 |
| catalog-canon-rf-10-20-f4-l-is-stm-tele | f80582aa3a6d0d82e9594d07d3cfd30190517077aa7c2fc8a173a903dd871d75 |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-wide | d41f292ba7c9a95dba2de6301adb76b41b5289cb92364b5817089bce2c1a7ae5 |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-tele | e0cc66d3d4ed019b6c1d2a6757d79990c6cb1c33047938f95621e0c305ae5f46 |
| catalog-canon-rf-135f18 | c910229b8d83620f1fdad77d4d45f71f55f8d757aa20227a01999cab53aeee4d |
| catalog-canon-rf-14-35mm-f4-l-is-usm-wide | a0fbb62a93172dafa2adcb9aaed26081a9b56d218a9ae95aa4476e669d4e5d73 |
| catalog-canon-rf-14-35mm-f4-l-is-usm-tele | ba00fa33a9f8347a2517667a375ed78f5bd4ab374ef1bb0a9b2e05797c83ccbb |
| catalog-canon-rf-14mm-f14-l-vcm | 079622c059030db11bb339507fb87307bd958b9ef0d07594a0f32cba257ada31 |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-wide | 94ccecdb36b34f13492fccf59004f90ee86e1c26ea4abd0d3b5ebd35253dbab6 |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-tele | 48c536c1545d80b430af7339bbf7a468874d6e6dc29228e14be270c7c628310f |
| catalog-canon-rf-15-35-f28-wide | 4797952263f8dc01986fa6aff8c640f4cc846fdac406ea707239258f22046452 |
| catalog-canon-rf-15-35-f28-tele | eb9c463528140b1de35de46013a03344176023c4ec4a8293d470c49cbf349ea7 |
| catalog-canon-rf-16-28mm-f28-is-stm-wide | f5c86f4609b5f525b65d3623e14499b94a2b759e3fb6ebf302fbbcdaf0f3f697 |
| catalog-canon-rf-16-28mm-f28-is-stm-tele | 9ec12493e40924f44e691ba4240054eee0c6966c0890b338127e704f6fcd7d37 |
| catalog-canon-rf-16mm-f28-stm | 13dd94138291fb99847a30508a9f30247337ca23249d4dc59029c4b9c8e2d97b |
| catalog-canon-rf-200-800-f63-9-is-usm-wide | 99a5de87aae05b8cf337087580ac39a5c4ea0d5258dd7e423d7f14dc20934c72 |
| catalog-canon-rf-200-800-f63-9-is-usm-tele | 399d3407dba34ec5be45c90622bc762fa8f77edb27f77a294e6c4ecabb61b632 |
| catalog-canon-rf-20mm-f14-l-vcm | 67459ae7eb2a55bd6a76b3013a6fe7620d08e30b5ba0df5108e3a27d858e7f14 |
| catalog-canon-rf-24-105-f4-l-wide | de5e54e951bf530d88f8fd2c24090497c6bfab89a4b39b2c6ebe456abe934f49 |
| catalog-canon-rf-24-105-f4-l-tele | 87ce85d660491c8ad7ccdae8374566ab60a3f859c963405c8cd9944b8e34b2c6 |
| catalog-canon-rf-24-105mm-f4-71-is-stm-wide | f9866fbbc64d9e8d42b4d0cbee90c480767082f17bd9f58102828af610691fbb |
| catalog-canon-rf-24-105mm-f4-71-is-stm-tele | df151b18ea77b19d4458525ab808978c90f76c039518a767460237ed11feb7d6 |
| catalog-canon-rf-24-50-f45-63-wide | 98fd787d9c726eae38491ec1217309ec53cf17e620882b1504db5324bb9517b6 |
| catalog-canon-rf-24-50-f45-63-tele | adaef0f0483b50e965a1a9246dbb73bbfdba0c61e716c7244eb5ed1dd7b4c646 |
| catalog-canon-rf-24-70-f28-wide | 8eebbae15bfe866fdb61999be3c1b8eee4d8a7591ffa67960d872b065f9e9741 |
| catalog-canon-rf-24-70-f28-tele | a2088f6db374249f7208ea917b5a8d180cfeea492519ac28300f83a8cf2f9ee4 |
| catalog-canon-rf-24mm-f14-l-vcm | ee7f9538ba12a33d40c08980551a3a2e6933b3ee28a36db6f2901800b7c6323b |
| catalog-canon-rf-28-70-f2-wide | db315adfecadb70220e8cd76bb93460bf0e5dedf2fb8780f2efc1543fa8324dd |
| catalog-canon-rf-28-70-f2-tele | 04b40e79b28f1aba91d2669785976158f994cc3dbd96b5c9b5ace067d7ebd113 |
| catalog-canon-rf-28-70-f28-is-stm-wide | 10e36cf6d96659432731a7cc72964ee1d91bf1e9b3366b37ce62952ef9a7e9de |
| catalog-canon-rf-28-70-f28-is-stm-tele | 76f25f711b90af5684c17d366f4e4e28d212b8dc5573967ac18cf9eaff29f7de |
| catalog-canon-rf-35mm-f14-l-vcm | 92f361634b7373c6c5966ae075cd89a1a69f6ee7913b4d7875f56e642ce98bed |
| catalog-canon-rf-35mm-f18-macro-is-stm | 66988ce429752a2fdff2bfb417dc52788e841b0cfbfcaa6de474bf8e35227583 |
| catalog-canon-rf-50-f12-l | 4dd4727374b9ea8667be79c42e6babd8da4428a64228c0b622184f900aa07d65 |
| catalog-canon-rf-50mm-f1-8-stm | d8620d3d54256edca7c5080fe2dea520f7d6131960729afa5d32bb84ad93ea48 |
| catalog-canon-rf-50mm-f14-l-vcm | d169b2cf7686f4bd9a9ca2308db2fa5cda3b79cf0cd8dc822331296d39813c7b |
| catalog-canon-rf-70-200-f28-wide | 5b8a67d13772ff800c2f9bd71acd4489a4621015a0d34a13bef7d5a68e84dfe0 |
| catalog-canon-rf-70-200-f28-tele | 6645aaaffa5864ffe6a59e755cfca37361003fc3fd2b074f02a83e80faaf9830 |
| catalog-canon-rf-800mm-f11-is-stm | b63c07a15e9fdcb607f8718f678f9e3631616c8ffc5305fad1466048ff556627 |
| catalog-canon-rf-85f12l | 9c457cbe4453d0807c33d6ae15ad5a700f106084c76899467ef7cb89bf231517 |
| catalog-canon-rf-85f2-macro | 3bf73ec7a5ab24e4b470f50e3882cb8e74281c138cbbaf5e8c6a494788ab9008 |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-wide | 80c054affcfa2488a9f55222e247fb897a15640448c07925dea937a5f40e18b6 |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-tele | 844ae9978dc48f6357a9d290d9d63e3bdd37b639619ad97f4a00ddf6b8afb7a1 |
| catalog-canon-rf100f28-macro | 07a07b889d743a3840a322b0323de102ec4a83d4dcdee6fa54bef7ffee723299 |
| catalog-canon-rf24-105f28z-wide | b17f48055bce2767ea2a98df56178d9b1f15cea0e6c7a1789d1b750ad7626ce0 |
| catalog-canon-rf24-105f28z-tele | 56d4714c68bf52322ef2fa5ec9693aa14634386db836419a28ba6b9b198110c7 |
| catalog-canon-rf24-240-f4-63-wide | 3208836cb689e36a90c74af0a81b323df065675981273e1e702d003e5c180f76 |
| catalog-canon-rf24-240-f4-63-tele | 47ccaf21cbba0f2f0b957fc20f85dee709c7d409426d4f6b570386854f0d9862 |
| catalog-canon-rf600mmf11-is-stm | 34859d874485e9cc85261e1e97c810d087006b3e066c946eb915154d079ea4b4 |
| catalog-canon-rf70-200mm-f4-l-is-usm-wide | 8289710db2a9a3b377d7baf2bdc627a05943810ca6784ddd93b96be371bc2c26 |
| catalog-canon-rf70-200mm-f4-l-is-usm-tele | 13aed28b9f3ec54efb33a4385fbb6708d78d70cd0a7442073280b6c2d937f8ce |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-wide | b1c8e6929e912b1894c45c674d2ce0a94775fc5d2a3e4e27c110eecfa1bb6658 |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-tele | 674c5e5ccd05a34790a4815e6b4f827536cb5cbfc02381707ad4fbf04e84b8d1 |
| catalog-canon-s-50mm-f2-8 | a613847bfb9fcb5f45657dc047d9741a2820926eb3d15e3008057afe831c0e55 |
| catalog-canon-serenar-100mm-f35 | 66f0ef364edc960fdc99806262828d3f50b394ef19044bb2b793a763e2cd4d5b |
| catalog-canon-serenar-28f35 | bc42937e40ed134cfacf29b081807fba99f63ebd817478a046071f7f3bd941f3 |
| catalog-canon-serenar-35f32 | 3f320a7642bf062b5d03a11d5c7dc2addd3cbad476344c7a865c66beb3f9a010 |
| catalog-canon-serenar-50f18 | a73682322cdc0caeede66ba8fd8f6552f10126cd157995795c22112d19db69b2 |
| catalog-canon-serenar-85f15 | 7eeed717802594fb25cd615e0d910f73190642bc01679f95d237bf43c90d4a4d |
| catalog-canon-ts-e-24mm-f35l-ii | 17bb34b1ed75ccb6177e1db1a0e2e10d28c0781e13ac9e8ed9759b32d8f60cc4 |
| catalog-canon-tse-135mm-f4l | 0f5c6834a5ef87f298108883a53525abf0d7d265c0751bb5f136322734db6169 |
| catalog-canon-tse-50f28l-macro | f3b2551c235cfdfb64f4008ea68dc98d1d3dcf8050fa5339bea8f1a3f39a20e6 |
| catalog-canon-tse-90mm-f28l-macro | b9bb5971188d4b61c41a89c798cbd8ddd4bf5ccbfcf660c3515dee6097258fa2 |
| catalog-carl-zeiss-biogon-35f28-contax | a71ca82017c1c2e7065b5515e1c736ae3da93d8bfc1edc6ea4b97b864d5c9511 |
| catalog-carl-zeiss-contarex-planar-55f14 | d6e93e03c5a9ba3fe39e4ae2da4e9a348d96225a8b449b05981930d234da6af2 |
| catalog-carl-zeiss-distagon-t-25f28-contax | a8dc9bd4d3cf5cefa1c92261cfc96456aede6385e70313cc3ca8c83b95dd69dd |
| catalog-carl-zeiss-jena-biometar-120f28 | c96de2cae1f9143e54ddf57b1690cd2f625fcc28497ca85415a85dbb3b96af4a |
| catalog-carl-zeiss-jena-biometar-80f28 | b2c9e0a7e73e42887f5f6dbddfc2963a1fb51a4cb7d223917c14d8982dfa5972 |
| catalog-carl-zeiss-jena-pancolar-50f2 | 47069d3344b80a78bee12ecb509b6fc6e614778e8bdc7af2ec6752ff9e93db04 |
| catalog-carl-zeiss-jena-pi-flektogon-30mm-f28-printed-1975-eline | 1493eb076f11ed0b99b5fcac1c31061aeb0ece90360e8530c546613b702f8dc1 |
| catalog-carl-zeiss-mirotar-500f45 | — |
| catalog-carl-zeiss-planar-80mm-f28-graflex-xl | f05e8286bee3bc7c3e9621249edbe7e79487e784100d0bfd917e20aadbb9df7c |
| catalog-carl-zeiss-tele-tessar-500mm-f8-c | ec26cabbfe26d992087c532b7907423f24c5edef942bd6270dad408b1b32f23d |
| catalog-carl-zeiss-tessar-50f35 | 1c538e12e9b580f0d66c69c072f7557aa1d96e10906219d3c9e4d13768ceb6b4 |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-wide | c17498aebba59a554c9d07be008b521ea7f06e6d4b4a5c776515088f7ddc6488 |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-tele | 6e71d71bd95c0dbb44bc93efb7ab02314302759712b3b7d0556d8a63cf234464 |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-wide | e42cdce0065a2abf10abd0ee3ede1fd18a4e910af282c48959a532734e99eb41 |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-tele | 2c4efc6c8061d1183748effec9fcc62dc03486e3a9eb399b7ae301279357d310 |
| catalog-color-skopar-28f28 | 72118312375e87dbd3edfaabb841c29b96345cc3e19dd4451c7776d223f73fe1 |
| catalog-czj-flektogon-20-f4 | b7fe12c5896077d41bb22ac96b09aeaaed6d92e15ae5e5e6499daa68c41a1df6 |
| catalog-czj-tessar-50-f28 | 3a1f85bc7c66b13cb4e4efb95aed868ba84ceb4401f02e6e9757480e858cf48b |
| catalog-elmarit-r-28f28 | 63a394c0558e5216223f017b8a77e789f904d14107bd8e2f1d5b32bd087d08a4 |
| catalog-enna-munchen-lithagon-24mm-f4 | 1e4974fef74c007e17646b1d986680c6636d2a677408b9280236f4939ef1b98e |
| catalog-enna-munchen-lithagon-35mm-f35 | e55b26fa9d6600941f5314d894fd937bc5e715b11a135b35727962458259e08e |
| catalog-enna-munchen-ultra-lithagon-28mm-f35 | 64a4f7a83f90e2f8b5c95887d3ae7ef97a10508b26dc58328c63a1f11b042e0a |
| catalog-fuji-xf-16-55-f28-wide | 1169e08464a955877b7e9434c1c98a658439bd8a51813a91228e21a90b0bad87 |
| catalog-fuji-xf-16-55-f28-tele | 406600d991a02ab0afd4c2042441b34154ab4aeb00b84b504a0b893ea78e2ec5 |
| catalog-fuji-xf-50140mm-f28-wide | f098d660782c013745279dc923ab7b81976e7cf7ce35a6118930ed0c45c710eb |
| catalog-fuji-xf-50140mm-f28-tele | 4b94edc684cf7dbefa613bea2957b5d613fd32c6d715dd3a5080b9d3bde2e7da |
| catalog-fujifilm-fujinar-210mm-f45 | a56e6417b6f2365565616a6d29c22e17795da1b69325844065cdd8799e51a0eb |
| catalog-fujifilm-fujinon-85mm-f4-sf-ebc | cb9e3290eeb0a499f19e08c4b1f93e3f00d5545c666dbe1a4d3b58019ac32e65 |
| catalog-fujifilm-fujinon-gf-30mm-f35-r-wr | 50b2696534d51693a728fed396fdc5c34669ec65fabb1d226363273cb447e4c3 |
| catalog-fujifilm-fujinon-gf-500mm-f56-r-lm-ois-wr | 84c3078768d1ef518e9d89179d8f7d3f3c85b18ed9dd0f77000668cda08f8e29 |
| catalog-fujifilm-fujinon-gf-50mm-f35-r-lm-wr | ec9a1fa85b84dc26c148ff7af1dee5806e18b6735f7ac2934c4dd227ee77b45a |
| catalog-fujifilm-fujinon-gf-63mm-f28-r-wr | a878f44443376f43150577ade0fdbfbebd809fc9bd062250397b27b0ac3eeea6 |
| catalog-fujifilm-fujinon-sw-65f56 | f095d47c6b1f8f2cceb93ca513bf568f3f04dd85f8ad203123bddfb01f842db2 |
| catalog-fujifilm-fujinon-w-35mm-f19 | bbece9156fcec35fe85adc70580d6e3e5008c29ece05f0b297af6d70e1d38ba9 |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-wide | c943b6bed3eaa54c98b026cbeabbd1d6469aed95896e8c7c34d126e440c9e538 |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-tele | 1f0babedaae8214a48ab5de1664635caa16c72d4e650bb5b39c67d55845bd1b2 |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-wide | 42e27debae675e3561864bad003404d7199b4abee1d5f5f1b96235efc458c074 |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-tele | 7ed9f7bf332567413133311b83b41cd11ca5c7468322868bc432124fcdf9fae0 |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | 3603e36ab53312553839c4dd4cb55ca712d79e51122a522e873245c45dbd9b85 |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-tele | 7bb0a3d20ff70fd869159cd5de9cbd1ee0ced91a8caf50cbf9eca16fbfbe8269 |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-wide | 46d4ebc9170d0a7de545b42e80b6815ae27079fc17a1bbdb012485dd56f7a982 |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-tele | 1135a74f6b777d1720f47527852e4eb162da5e31ad11fa9f8971648eec850335 |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-wide | babcc8e7e2c768901b74b8ac4b47253988201aa27980a87c94ef378c50bd11e2 |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-tele | 8924757cb7666b22c9a6845529c82c560f1b066c14d3136add71142cca820d88 |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-wide | 189131f434fdf6a4bbf8b9e17fa8ce450bb14fd3c53566c0e111a51fc137254b |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-tele | 6d4a6a8d304c10b04858df833a350504fd5a62d60113d4548cad8617127a82e2 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | 29529ef4fd6d8fe96ae4e5b8c3eede82e497cf1a8356cb8fec3bbfae37d777b8 |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-wide | 977de5b85378f9deae819695b603a639fa3a4664f6d41b51517efcf3e403e823 |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-tele | 764b1238e19eb049e57bac14786edecb3cf7897b24f55635091e176688bd1f96 |
| catalog-fujifilm-fujinon-xf-16mm-f14-r-wr | e09cbb8752da7577fdd6e2abb1079d0cf69baa8ac3944eb0898582cab2f2a189 |
| catalog-fujifilm-fujinon-xf-16mm-f28-r-wr | e09b1d633fca8512ba7ca81a996a7ce07020ab0b353071c41d6b45d2a6047659 |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-wide | 06605a6fcdad6ffce8eee544223756b99ae2b30ad47647d6d9068e94f85c3a87 |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-tele | 4a8c18ba80fc1077d919e78e03ddd5ae71ba8f1dab91b65c0143b9763ef046ab |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-wide | 9ea3c6b4c08ac327194c914119fe26473fb01c01cd4b427b39600f00a4223645 |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-tele | 62994b016c9c0301486863cf152a74faa13ace23795ee07aa88ee63048c84acd |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-wide | 7793e48a899f9aa8360189ffec5431c612748e4128d6ca6865215b7c6ec2572f |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-tele | 4c6f8cfd2fe2f2f1c788886643fedaae09cee52da4760dfbdc2b4165da464d87 |
| catalog-fujifilm-fujinon-xf-18mm-f14-r-lm-wr | fe93d155820deed211a29d636448c22cb9b9c2aeceac1a248a62905cd7979056 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | 7a71bda35e1b1ba156621d46c8bdee8bbad5d575dbb71abd6da78d5a001810ab |
| catalog-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro | f16f0a8ebde7796c9cee134b96d2e9d3f88e47fabd83561118ce6ba01871ba26 |
| catalog-fujifilm-fujinon-xf-35mm-f2-r-wr | 0f82a7402219784d8c9d58ec8d61aaeddd68f3c2d7542802fb72188f47fca35a |
| catalog-fujifilm-fujinon-xf-50mm-f2-r-wr | ec430babb6c6feddc8c671883d28780e0b98206cba298e07955f82c4b26a1f11 |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-wide | d703695789ac36db73a77717c0463dcd4ad2d05264a5c14db47b70608448f089 |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-tele | 6bc6ee0973e169eba80fbc80f72a3b7e4c3fd649f486bcfb56cc661deb97cf62 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | 2fca69e1bc9a4e280dd91bcc6ac0ca396f90869a64cb327ae638c4ff281423ee |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-tele | 0bcafab8a6feebe3942a3b09478fdb7cfcdad9aa69090adca5aa7750881da1d5 |
| catalog-fujifilm-fujinon-xf-8mm-f35-r-wr | eb83d1c63c5a631b832da713c95d7b351d7a07e0aac2ba4741445ac86936c06b |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-wide | ab7de8914522055a41b11ca069744e74df4189861fb46ad04471ce9c53ff7f5c |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-tele | e3e920412e2dbbdcdbe683ab49c9803a7ed2a559b33b5874f88c28fbc8670c95 |
| catalog-fujifilm-ga645-pro-60mm-f4 | 2660017d7e3ad14be17e9bf5f831e201730ad98a0cdb1be6051c782d19c8886e |
| catalog-fujifilm-ga645widepro-45mm-f4 | 087d89f3e37496a09d889f015315ae13037a161b82a139c4e14448527035a822 |
| catalog-fujifilm-gf-100-200mm-f56-wide | 9dfd320fd3411110722ec2189b31775774da9da687d2a7ef8089c55eaa1e2d53 |
| catalog-fujifilm-gf-100-200mm-f56-tele | cccdafae82036653f67aece79e1e982aa2a433ed4cd013087600b60744a8aecc |
| catalog-fujifilm-gf-110mm-f2 | c1ff373cdd89c842b63e17a083f4b973edc841c1dbbe6e672afaf42db94f8dc7 |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-wide | e11bac70441d6edc84d11796a160afdd6f78e92f1292525abba27ef5933d2a8e |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-tele | ab92149a2150a230d2eecbf454487f122890d0d83819e18df636256372f2fdfc |
| catalog-fujifilm-gf-23mm-f4 | d74fd7aeb2c6b5e10e09790972ec12fb2b5f2a4d2959cf2083874557c73c01a9 |
| catalog-fujifilm-gf-30mm-f56-ts | 3f709f89f62ece50b271b487552961b792721e14dfcbae6bfd492b7d2758e875 |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-wide | 8d7f5dc920a8e251abd227f7fc335d0919e32ab221c723abf89f9dae6362e3f7 |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-tele | 678caaa1fd6f21bfbb4953211f0ab2a5cc9ec598db363612c884191363e1e12a |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-wide | 45bf4bc606aba8454fae4725378fcb05ffb2a0d4a9f0ca14e8bfb3e68985ad6b |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-tele | c372ef41818eb4ef7006d04db6da6fc98bd88c407c2cc20c481be21889b85bec |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-wide | 3759dbca3b2ed96705357b25ac2e2c49076d609259097c1d08687f791ad65db0 |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-tele | bcdc7be389a5311c3793763b2cdc576388bc2d177421a49ef4ffd636f901d0c4 |
| catalog-fujifilm-gf-45mm-f28-r-wr | b1a16457f0586ab144640338141afbacbcdae88599710d6eddf4ab7a254d83a8 |
| catalog-fujifilm-gf250mm-f4-r-lm-ois-wr | 7cb22c2cfb7bbb6d2f15293b517c0c9ef66663cbd0f85b102dd142442a7d03d2 |
| catalog-fujifilm-gf55mm-f17-r-wr | b67c00b1a0246fb746a1ece80b6f1bfae3ae4b7c659cc79e69e711418dceb80f |
| catalog-fujifilm-gf80-f17 | 7143bf84e0a904d1cbb74937939f771966c93ee6bd0afbe7f4406a6445a12996 |
| catalog-fujifilm-gfx100rf-35mm-f4 | a2a0cea9fc82e1b4468ae4db70ea0a2ac032b9a9a6aec7ddc499ef432a574387 |
| catalog-fujifilm-natura-s-24mm-f19 | df240a7d995004164003ba9809cf20adfc7a52082ce0123509d44bfe265ce2ac |
| catalog-fujifilm-x-fujinon-w-24mm-f28-dm-ebc | ebbf8f162f2c7204299c266241d93a0b49042939bc595c51f2d923b4644f7338 |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-wide | 6cd46659152f7299ff509e1742296569dd9b2f29e8b9d914e0b810e1e35a3f71 |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-tele | e973d9cd8ea5caaeee1cd7d2bea1b7a43259e9f75dda61ca8f952c3eb4e6cc49 |
| catalog-fujifilm-x100-23f2 | f46f6fcc93bc5a8d4677bf897b6497ab7b1d78be191f48d59debf62597bd60a6 |
| catalog-fujifilm-x100-tcl-x100 | 79cd18c989b0bf54ea90f528a4ce2332bff1012014f1f901510d60a8e99879d5 |
| catalog-fujifilm-x100v-23f2 | 9a6b36c13a8fcdcaab20f013a207283d8ea9c5284cd4a1350c1b2f3b58214bc4 |
| catalog-fujifilm-x70-18mm-f28 | ebcf577653b08cb77d79e63aab5e5cd43d475ff0dc25f6b449485024282b12e6 |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-wide | 645fd0f03a71de69fe01f4799c9f397cb05402c712426e65d33e0fd432a2d0b8 |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-tele | c2329de501f46416a681fedb27328b598af1e407cbb3bced489cbc909028320c |
| catalog-fujifilm-xf-16-80-f4-wide | 8a6e01116c74632a4b61222bdabdbff97cd503cde9a7f0e8d901da2f1f62dbca |
| catalog-fujifilm-xf-16-80-f4-tele | 260b07017f572b115ebf1720014fa867e3b0433edf2fc9c980f45bfb3ef39eab |
| catalog-fujifilm-xf-200-f2 | 765dc2ecef9c42ba577356b0160e7bc809647229f325d8e313d600d7a7355826 |
| catalog-fujifilm-xf-23mm-f14-r-lm-wr | 48521b9348e36a49e85f04b944f81e69ca342014a773012ed2ae4180dce6482a |
| catalog-fujifilm-xf-23mm-f2-r-wr | a00047834451deb6effd09e37f2cc5a685f831bb9ae06f3c6e5f3e50908d0ee3 |
| catalog-fujifilm-xf-23mm-f28-r-wr | 502b4a1cd12289ccb12b6990d49543aa623409cbfdffb97446990895bd620f26 |
| catalog-fujifilm-xf-33mm-f14-r-lm-wr | 08cdcf1f21fb63d032298e50bf4ae4f3c5a499f3b66a12c63917b1c149da1bf8 |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-wide | 4b75af17c82840753f3d52c6e7ab8b488fceef3feb4206a4434fa621f54690af |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-tele | 42ddb1310d503df1874f30b9ac64ba037488171532f9979fda970878dadcbf89 |
| catalog-fujifilm-xf18f2r | 991d76c5d9b80cab3d7b4f20e94eeed854acdc47b4c90e36f841bf1fcab4f1c1 |
| catalog-fujifilm-xf35-f14-r | 9c231b5f9713f6d44c2997b353b74a1cf6038097cec5f8fdf152af3a7aa2e8b8 |
| catalog-fujifilm-xf50-f1 | dff06cd5e80fc07b103b18162d1d9f4614c7aaee30ff24e80b7f9b9d8ac7a9b3 |
| catalog-fujifilm-xf56mm-f12-r-wr | 5ed8a4c5230c4e6aaede716048d8b2cfc9cca6ccbf7f825c587c38ba121bd294 |
| catalog-fujifilm-xf60-f24-r-macro | b28352d793123d9c4234d5482bca4ebeb856cf7eb49eb390d0a801ace1564175 |
| catalog-fujifilm-xf80-f28-macro | cfb87d8ead7522e61c4cbf0d7c646a0fc8cdf14bf4809c44d65aadb876eec8f4 |
| catalog-fujifilm-xf90f2 | 921093db88c357e2deeda4b430dfc5666e5a85b5b73d3e66bfb85fcc366d32e4 |
| catalog-fujinon-xf-23mm-f14-r | 04457e15430b65b63ffb901ea414946b391a8913f3366bd744de688ed4a9fd79 |
| catalog-fujinon-xf56f12r | b9d8267667fd4400ded90148406dde81975da5793f11f2e5e71a1fa0e6ce331a |
| catalog-gf-120f4-macro | e98a13820fd2945e0e2d2a5974dbf2d74eca092c4e25159e2c003063ee466e2c |
| catalog-hasselblad-hc-150-f32 | a141a384cfae8b8a801ccd03bde946903cb706796b1b6f6542caf288ddbf5666 |
| catalog-hasselblad-hc-210-f4 | 0d6aaabedb9afddb6b01650065137946e527fa2ba582ae00bf26712008a6f9d1 |
| catalog-hasselblad-hc-300-f4p5 | 9f105df471139eb7aa61c7a1e691d3442302ce70a7f6163b434ef6e87e6ff7db |
| catalog-hasselblad-hc-35mm-f35-fujinon | f4999200d8da735b96342a5e5737dee85d8741c3e52889c6085f298be1b43dfc |
| catalog-hasselblad-hc-50-f35 | fb12dd4d8702ecd2a383740a3ba60e834c593a24f1b9bc550c2c5e2550a6df8a |
| catalog-hasselblad-hc-50f35-ii | a7712a4250c12cc6dbe089203ce320f038aa28ac69bb470b5c55e7b987653897 |
| catalog-hasselblad-hc-80-f28 | d73ce81f51bd774ec99c0cde2772363dd46d5094c67cf859681338f39fca3d9a |
| catalog-hasselblad-hc-macro-4-120 | 8916a0053eca99a2abf141cf32297be0d05dfd7311c958c7d1efc78461e4a58e |
| catalog-hasselblad-xcd-120-f35-macro | 4f59592a2d8535a954bcc2d0aa73f52268473747a6c7b5a7965e885ac339208e |
| catalog-hasselblad-xcd-25mm-f25-v | be089e37947a16da5572da1eac518c4cd2ba5a0d64d130a8a3e0ebc54c5d3994 |
| catalog-hasselblad-xcd-30mm-f35 | 31f3c16792e3a5f2c7652bc99dee01987bbd0d04fc409ff21229d6390f1b526c |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-wide | cc45efa847269fd12827f69efe873f77202bd55f2871edd73905736ec68fa6e7 |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-tele | 71869f48f2d5edcdebbba3f76d8c25b0ea07e35b89a2659897c39a06e469715b |
| catalog-hasselblad-xcd-45f35 | 1e59f8aba70faab9deb88f0a41329c5b2ea60bee354cc443a98834e787c70181 |
| catalog-hasselblad-xcd-65-f28 | 986f342f4d1f9dbe6e8d997f958a4e5aaf89a5e79057b28326634cc9f6aecbdc |
| catalog-hasselblad-xcd-90-f25-v | fee099d0a33b2348fd5c64bea042bfba8d1a32bd79de147452d5b79bcdeba7ab |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-wide | 4010fa53360bbc3ce99842f96107c3a7d092771be1897aa885fe44f94402893a |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-tele | 46534ca13563bc9d82c8c60c20250e06dc90014dc8f377b756d69653c818ff69 |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-wide | 58e0579bf691350a1e5d04422095d88d84fc44994681964177d5b9f34141b86f |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-tele | bb7ae31e9a049f1c14f5767c866772b5632b15c17d2eb2f7ec6ba168e2053a2d |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-wide | 71c682a2e929bce8d5b42cb9401ddf4a8e70075d176c493e31fbad5a427603e8 |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-tele | d9c672cfa1f8064ac2627adfdb723b593b2662c69069d4b22a5e3ec385f443b7 |
| catalog-heliar-symmetric-1902 | 2b80ab3e014ebb99361ffdbcf75a7aa05aee2fd0040f25b46888d2653f214acf |
| catalog-industar-itmo2013-v2 | 0ff876b749d7b4f4fd2aab700af6d7c917c3f0ed80bb76412a6a2904ac3ac87c |
| catalog-kinoptik-super-tegea-19mm-f19-fisheye | 99da227e6bd69a14922e728cd8358347b16ae9425dfdae3475fe4d76c9d7d250 |
| catalog-kinoptik-tegea-57mm-f18 | 76be6f3124212a291325e0b41c2036523a6ba06daa031878b272f86b769664f0 |
| catalog-kinoptik-tegea-98mm-f18 | 9d9d0cda6b2e0eead24dddb4499eb1effa113634aedfc891a806aeb289885b1a |
| catalog-kodak-aero-ektar-6in-f35 | 1ab5b221195b45a9e7ad4e10858de9a242c244d44048132aa7c3842a2a311843 |
| catalog-kodak-ektar-50f35 | fd34f0d94a84cb570bb242f1d216dd4093a92bc48162e7293144640215fb3af8 |
| catalog-kodak-ektar-52f15 | fed2bdf68ba13e811a91ae60bce7658128ccfcc4a80ff30b5a588390b21c0b55 |
| catalog-kodak-enlarging-ektar-100mm-f45 | 19c9440c4aa3745f549c64150c2836114d789c876e0d5af891cd47582438de52 |
| catalog-kodak-wide-field-ektar-100f63 | 091c2984ad77cdc3e207bf386827d3ac85a171ade1b2b7f926cdd9ee5c953f20 |
| catalog-konica-fl-hexanon-ar-300mm-f63 | 2367d29de11ecb94f659f4ec385416fced3ed84d1f20f4eb500e3ef642560e49 |
| catalog-konica-hexanon-135mm-f35 | b0541f5ac6ad2eb02e4d01b0510585cfc39e5dd414e89da4ea661e4510df9998 |
| catalog-konica-hexanon-38mm-f28 | 3dbdf03346f13ec7b699e8d441d4f32ed52890c8d95f5cd84d9ef2180c8f0e19 |
| catalog-konica-hexanon-60f12 | b72924fd721581ebdbf9e0d3a3a078dfc1be3ac7d8692306805bfd62c59df95c |
| catalog-konica-hexanon-ar-135mm-f3-5 | cfe37a1393ee54264a19677ccf635574f009a7a243562293c5871d4134c67642 |
| catalog-konica-hexanon-ar-21mm-f2-8 | d0433184812b7ba46916c1eed37e0cb58067d7986345572ccf35c7bb219ba246 |
| catalog-konica-hexanon-ar-24mm-f2-8 | 1b23abc4735db1c4f1d50cddd92581ca277cc80316a6190215b678413bdfa835 |
| catalog-konica-hexanon-ar-35mm-f28 | a63308a109f8ddfc334e8cebe9ce1d4d0467507297e98717098b295089fd2596 |
| catalog-konica-hexanon-ar-40mm-f18 | 5e681acd4b7397df3bd047a4f863526f0eb0e674c7a82c5bf48a898984ddf7f7 |
| catalog-konica-hexanon-ar-50mm-f1-8 | d8f50335c45138cf1861f44322c46ef16f4a83e607ed9d6f8e056e12d4563511 |
| catalog-konica-hexar-35f2 | c2b6d5093e26db6847e8974d7b1cad61d66caa75f6908e9b15b2351e02eb881c |
| catalog-konica-uc-hexanon-ar-28mm-f1-8 | 432e54dfea39754c814c47737910b2386e2f5b7c2b1a1c13146161afcbdb02d0 |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-wide | b3bb3e1254871837e35ad1502f9aa9eceecfa4a6e4464fede0baaa3a2cd298eb |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-tele | 8a76cefb524c84d86c8f23072d53957307338a5e5142afd92d401b5273202159 |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-wide | 92beba3cc30abb58c84929c01d96ac5a7697d7e8a4736ec8dce9c1383cfca6bc |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-tele | 1136d009d911f5fa68a4f790dacf26c7204a3a3a3c23d207414e2ded742b3cf4 |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-wide | cb039a7ee175d81675e1d17af43ab4015ac4eddf8d2579af0c361001822f208f |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-tele | 78b94c39db19921529a61f8dd0024a41b0ea1df827490d141827fbbbbe0fa185 |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-wide | f412a1a6495593d82d640c8b6e88ba8abd8e8c5552808a72682abbbf3487839b |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-tele | a82144e9b8171e4eab1f3b669e7259506bb7606927b8b981bee99d9b870f5a63 |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-wide | 4380db40d5b09b90d9e4fa08cd1a0de04193bde945e9ef909bc97100d31f7add |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-tele | 8d43cbc24e809dec1f352842f1c993f0b61950a0f5adb51c0c9df86b2b705294 |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-wide | 918dec2d3c18474dc7c15fdc04fe02e7c4b5c65c1670c8f4e44a9dae6886676c |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-tele | 8d3a83f9cf8bb414497cd6b350a43b68f303033cb0dac6beef5163210f253ccb |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-wide | 9b11f38db97a53c50579bd0cc300d66801bd47502c25cfc0c6670b3fa0a25ea2 |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-tele | 2b2af4eb1659ace0f9b91513e78e32f29876462fa141ac2cd5b566a95a7e7afe |
| catalog-laowa-100mm-f28-tilt-shift-1x-macro | e260d4b6d0fe04cd60c35daaa5dbc38c896f1d04366ed9c68e9f98cb1d323e4d |
| catalog-laowa-105mm-f2-stf | 51ee4191d824f3edbfc65f55be0f4cdc28c823d53afdc68d6e023edd7ed0d7ee |
| catalog-laowa-12mm-f28-zero-d | 3dbb534775b306a55567972ab3b12cced648cef690ab4882ab54657ecbdd70ec |
| catalog-laowa-15f4-macro | 88ce73a7072ffc50ae2f890bdfa4f84a507c916092049a5d34d4d549c5f2d198 |
| catalog-laowa-15mm-f2-zero-d | 7c66699fc1dbfea9d762043bdf242d593d3dc3f63415a8402fbb0ff7e04e8ba0 |
| catalog-laowa-180mm-f45-ultra-macro-apo | fdd3de08570f5468586b5f073103d7a338c72e6e366bdd6849c771bd4deb5b61 |
| catalog-laowa-180mm-f45-ultra-macro-apo-af | fdd3de08570f5468586b5f073103d7a338c72e6e366bdd6849c771bd4deb5b61 |
| catalog-laowa-24f14-probe | 8d7ca0c6356e0ee78a0bff6eb1d6884d4ec8eb91fe88835c482382e20fd2137c |
| catalog-laowa-55mm-f28-tilt-shift-1x-macro | 23a884818ed15a8acb67ad79ca91969a18d4a0e88cd5f431a123c33d7dd581cc |
| catalog-laowa-58mm-f28-2x-macro-apo | f75ea0685586121fd2a49604dfd1d0c7a0bf9887afd2e35e72db09b9fb4b029e |
| catalog-laowa-65mm-f28-macro-apo | ea8bc631261abbefb41645814c764bcd2e288d8743b62165b97e94e74d29eeda |
| catalog-laowa-90mm-f28-ultra-macro-apo | 80d9ee45b82ec5a68d9db65b1c2125c5ea7618420df611b5c9d774e79b049836 |
| catalog-laowa-argus-45mm-f095-ff | 207337997d6aa2d41e7b89c3dc7d5f2ef45200d6e7ab860c13b5bc1b5cc0a250 |
| catalog-leica-apo-macro-elmarit-tl-60-f28 | 6f8248c4c53013f58edec16a31960985a653d9d2cbc718a02d581823d9f5039a |
| catalog-leica-apo-summicron-43f2 | 8efb0e970220c797546987aa52dd7345693806f150a669ebeff606f156e43d83 |
| catalog-leica-apo-summicron-m-35f2 | bc5c0d75575ebf0ea83b5ee331a5b9872cd887e9f68643495ceb4ba0685f6d18 |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-wide | 5f867924657b511bae5c354a4243f911799d93c3de2022afd485bf97ae83fc8d |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-tele | 3addf7bb36217d08e810e3f809f778fdba70927a5742ba2136a9cffe650e9091 |
| catalog-leica-colorplan-90mm-f25 | 46e57a37d711865ebb5a0c5b83c0ce32ec62eff9956b286c4c9898b680cd3870 |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-wide | 699c0b96c16cafb917fb4b7bf95c9cfe51fb0db0b76def4787ae250cdf0a0193 |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-tele | 601aae898101d70cd4644c5ebdabe730d8aa53124cc732beb002894bcb666f02 |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-wide | b5ef8898bc68a686f127cb465324bf7efd87d8deb33e3ba5b409574028fc7f84 |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-tele | ebb0b825b2ad820df5fddd4fc9c16606e57f342d4bf1bb25d49b2f3352c364c5 |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-wide | e5c8777f75f2d783f2c5b6f8f19c7c2ea2bf2d870d2b92da2a3c6a2e52b1a44a |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-tele | 8c6c94f48f04983d9cfaa6dd567bb043fa26c3ce81dd9ea7f34892c1b3f6725b |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-wide | b0af8f82c1c6597cc79f328a938b284a56686dcdcc8ccfde459b82ca8ab3265e |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-tele | 6ac78aa56cb83c741d77cf3a1014137ac1c93863378c56ca44aa8dc69eecf2c6 |
| catalog-leica-elcan-50f2 | a1f5acdf3680b184ce4239f5f983c74d733ed1673c4df2a378d1f1a399b222e1 |
| catalog-leica-elmar-35mm-f35-mini-ii | 37af3db394bec5f3cdb2ffcf7996595c3991a549a443f0cb31f4e55cdcc913d5 |
| catalog-leica-elmar-m-135mm-f4 | d27f7a96a3ee6eb8626911f32a6408d251dade903276d0cc70ea046ae182afa4 |
| catalog-leica-elmarit-28mm-f28-11801 | ef305926235e9ba2516cdabcb0fcd7d64508db79d51137aa2763e68116cefe36 |
| catalog-leica-elmarit-90f28 | 3af5583ecd990404431d1baf4b141ca78a2e528e23d7ba3556ffb26c6f7cb8c1 |
| catalog-leica-elmarit-m-135mm-f28 | b652f10779a7173f6e80f050c7cb7052180b617f409cac23d5a4500e72b4ed87 |
| catalog-leica-elmarit-r-35mm-f28 | 61b68741f0798f6c770e6be116dd90042e0e8e4609aff7702e46bdace9639d70 |
| catalog-leica-elmarit-tl-18mm-f28 | 4884d664a8c69a32d07db390b859f676f56425784f8ee798fe134c1108058d3c |
| catalog-leica-macro-elmar-m-90mm-f4 | 20040f4647fdb8a43ca0ce1751d655eebca291a93a39c1bfcad59bfd3c4e123e |
| catalog-leica-macro-elmarit-r-60mm-f28 | 2c8ecbeeee611df0f8014c418146ce97aeea4db071ec01ba2af7c0517f936f1b |
| catalog-leica-noctilux-50mm-f12 | 7e69153d6d6e51df0dc0ea93d1dadd4ea88a157a7667b395327b31e7c5761a2f |
| catalog-leica-noctilux-m-35mm-f12-asph | ad358970c56f40f7bfaea8367dcccaff9f750d0c734cc9c4efebf6de5a47ae08 |
| catalog-leica-summicron-35mm-f2-i | 5586bfb3dacbdbb1ee0413953a9bdff5f8b8fa9ef87a622c5a4f4e45b6181baa |
| catalog-leica-summicron-c-40mm-f2 | 787b4c41cdfb4331953d5e373c00ba56bf19ed289f60b87a063e7debb204ec54 |
| catalog-leica-summicron-m-50f2-v5 | 067419f3e1be2d3c7848c92251d521bcf2424d2fd11533c08e2dceb1a9fd22e2 |
| catalog-leica-summicron-r-50mm-f2 | 021488e3c97d3da6ddd836e0a267fa574f12ffb8b516d3b79c84169216999b73 |
| catalog-leica-summicron-sl-50mm-f2-asph | f11c416b2a30bbe0003b7ebfb00fa40b06a0dd691557664f8b677c0766cfd9c8 |
| catalog-leica-summilux-28f17 | 8aa17bc3f350a13f89ef3616bee21bb2afc79ccd555c229c905cc66b5be45b39 |
| catalog-leica-summilux-c-100mm-t14 | c879a462521687832dd12cf0be6578e1c119194c376b59e13b75ea20324014f2 |
| catalog-leica-summilux-c-18mm-t14 | 3ab0db29f7ab662093e57f0994e1f61cbf8685fb70c4075e8724387324c75ce5 |
| catalog-leica-summilux-c-40mm-t14 | 7292d247a9ce901dcccb24adda3892f3594eb3e88b5a1bde23e616a12df9d60a |
| catalog-leica-summilux-m-35f14 | f4c9d53f66e7ad36ecf86a9ad515b42024fb02bb157f935538030a005834577a |
| catalog-leica-summilux-m-35mm-f14-aspherical | 0df03f3dbd2e77498c274dabc6fac5d019278d07470907737417cb45e21a5bca |
| catalog-leica-summilux-m-50mm-f14-i | 13bc1de20202f91e209d936dbb54054a5b47a7ed7661d1cff030e29d3e0aca7e |
| catalog-leica-summilux-m-50mm-f14-ii | ba03a0f9dcd8856ec29741ccf9e3ccc54f085ce4aea800097d972964a12b8b73 |
| catalog-leica-summilux-sl-50mm-f14-asph-i | 0e910dc35b98700e5ec031ad7bef7ab4166b7d6148637a307d79a24c4913b6d2 |
| catalog-leica-summilux-tl-35mm-f14-asph | 9c2382f1adef7a4110e44d3df8e952edd5b54c5b03d0aaeb40104427e01b401d |
| catalog-leica-super-angulon-r-21mm-f4 | b4f5a4938cd6a774690f109c0abebd68d73a2ca9a407b87cd9f537d8be61b042 |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-wide | 162a5f3c8fbf5369f2bad352cb3b47724437ca946a439ec3d0729d254e9c63d2 |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-tele | 6742f70b47ebd4fb2eb1cb15cfb3180436b84eba8b9199624fb505b046fc46e4 |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-wide | acf18fb8dc6306d7cba1d83562ea157c6aed6fa1b45c68e1ff916037bab2fdf8 |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-tele | 28e92ace6b82740fac6041eca1107017370f280b06730f3550c463bb8120b1ac |
| catalog-leica-telyt-200mm-f4 | e3960191e2a1a085dd72dc2c93c913e644f3dad05125bc2191772126587daa5c |
| catalog-leica-telyt-s-800mm-f63 | 21d04d9aeb0e460f168f799fe9fb5b641abd5933000e738cbefc4ea084156e98 |
| catalog-lumix-s-20-60-f35-56-wide | bc02d4dca0bd4aea191ae102a9dff30b4c2ec0f6a291dc3ad1d02cae101ad45c |
| catalog-lumix-s-20-60-f35-56-tele | a5765ab3a1208d69aa35cde7f6573d75df700363ecd091c646cda4fcaabeb948 |
| catalog-mamiya-af-apo-300-f45-if | edaad3e1cebb38fe48243bbf416368dd97a86affe1734766dd2079a29bf90115 |
| catalog-mamiya-n-210mm-f8-l | 46e39790def96fa3dd5f986ee4732ed82ddbeb02db0d59f77ebe6238b5d3e3de |
| catalog-mamiya-sekor-af-150mm-f28-if-d | 437b832465baf251f2c0ae6e90746ffa8f4b87911a5a414866b36cf887730637 |
| catalog-mamiya-sekor-af-55mm-f28 | ae624f612d54e6ec3126229016ca46aa8225dd175ffe17d28273e315c51d0329 |
| catalog-mamiya-sekor-c-55mm-f2-8-n | d7977baf333838a3e55b4d8d502e2c26a497136ed84f88427984eb467f4322d0 |
| catalog-mamiya-sekor-cs-35mm-f2-8 | d32f09b8d6fc5e7a5a030f7493f697ff82dfda20a7c185a336a4b842a28e72de |
| catalog-mamiya-sekor-macro-c-80f4 | ee2881b6b7588b94e4280cf6a0e42b2592e98c75c9dc6e2b8d7c45497fcd4079 |
| catalog-mamiya-sekor-sfc-150f4-soft-focus | 00fff7ca43235fc6695a05e9b9d5c15d50db046d4f9655dea08a449c93dbe8f1 |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-wide | 16a24d2ea8578ff4f7c4eb9d905e137e04e9411e1be6f2c04d828b9154a89b3d |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-tele | c6781a6a8341ea99ec8242ed77132a221ad77c4efab0a2f0dfe7a28b6b00e3c8 |
| catalog-meyer-optik-gorlitz-double-plasmat-135mm-f45 | 5b3d45b701a8a68ca738fb5527ffa6f5fd62618b446c921d44aef667a89bb042 |
| catalog-meyer-optik-gorlitz-kino-plasmat-100-f2 | 71d26c632fe3fe59060cbecb4e63e86c9a3694700217bcc33a91ea6118022d75 |
| catalog-meyer-optik-gorlitz-lydith-30f35 | b722194cf2d7aeeeffa77795a773eefaabedd58f764d4dcdaca01c6a7dae4775 |
| catalog-meyer-optik-gorlitz-orestegor-500mm-f56 | 98a01a6912e94fb247ea7208b12027eb3799f6bc538a6c596daccc8db0decd54 |
| catalog-meyer-optik-gorlitz-orestor-135f28 | 7ef1caf1349057af633e4754da8c1b8a3661786f1b47007c021d9f3acc309a28 |
| catalog-meyer-optik-gorlitz-primagon-35f45 | bc9623f1599e5c046e9b9a312cd13008362e3383cc328542bd52012d6830e90b |
| catalog-minolta-250mm-f56-rf | — |
| catalog-minolta-af-100mm-f2 | c45353dd239571ad9c759581bbee81a112955aeef7a0213117f6da9b87d4137b |
| catalog-minolta-af-100mm-f28-macro | 7c84e8469a7da29e0911b3dd5c63c4fd54886ea61cb990a92fb7c92e292864e0 |
| catalog-minolta-af-200mm-f28 | 70c87021ab828a962e18ce86e0a567d29a5a279cba04660bb6cc41a5bfa7f702 |
| catalog-minolta-af-20mm-f28 | 6fe20136ec6fa2e39d9aa9de66945765915f36a410c815d07390efa6a20276ef |
| catalog-minolta-af-28-70mm-f28-g-wide | 3ab8c233b06d5cc0c715df955b1dcc75ea3e1ae1c9e31d2e5ad8a32f6f2d5dc7 |
| catalog-minolta-af-28-70mm-f28-g-tele | c0b4b7212733d40ea4784f2963023786be33f8a72901466baf81436ca3fec56e |
| catalog-minolta-af-28-75-f28-d-wide | 9a91b29b2d4b2350874c90b797b3468a41fabd6dc8fc4a354e0c78ff32cbef78 |
| catalog-minolta-af-28-75-f28-d-tele | 825cb45637cf557bdf2e55ce621424872ae844fc0f8d3dfbc8bf1e54d127e35b |
| catalog-minolta-af-28mm-f2 | cad7737aeeb00a61402468bf396b527d8dfebb7d6e6fe96e27dc2d62202be172 |
| catalog-minolta-af-300mm-f28 | efbd6bf2db5a0cce2d0518ac50e7713af7eac6b434eba675a200a564037f9bbe |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-wide | a4728045975c68626e5cae70b51f361f82301d7a5620265e8869e93279fdf3d2 |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-tele | fe2402631b12d8f5fe0c354cab1fc59e060b5f4a316d667837816ee8089d5a6b |
| catalog-minolta-af-35-70-f4-wide | 1c68d32d65b3e34a488c060cd5b2fdddd6e173677d67e5b6506abfe349894a4f |
| catalog-minolta-af-35-70-f4-tele | d30dd32c185b24640c2126abe63ddbc9e67c2d06f0b119848e685f1e4026a778 |
| catalog-minolta-af-35mm-f14 | 7070c7fa1d559d728493e7daa7300669a3f725bfe65681fb9c9a6d1cd830a44d |
| catalog-minolta-af-35mm-f2 | 4d25d0fc312473c9718775f2d04543e691c16b420874906a809c75e08dfa4c45 |
| catalog-minolta-af-400mm-f45-apo-g | 8d5b17a024b4d9b892b83b9c3f00ca8acffcbb28ad1ea41bad2dc4ae3e244f2d |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-wide | aba51217c4058d7a14ee98b329ac85214222d281bdcd2e302284ac4319a7c53c |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-tele | 29fbe46296f88d857bc5a3f865b563d7d304863b0938a446fcfeecbf513fd559 |
| catalog-minolta-af-80-200mm-f28-apo-wide | ccf75f20bb77f3afac01554c7f8669c01209872677d7e34f224cba9d04d2ddcd |
| catalog-minolta-af-80-200mm-f28-apo-tele | 8188190976ba8055090c57bc8e2e2e0d9133a28c3d1dd55e17d2483fc6a4f5d1 |
| catalog-minolta-af-reflex-500mm-f8 | c54ba9572ac4a26dcea4a6344c56e262ce20684c4ec681a2241801ccc4ab21f8 |
| catalog-minolta-auto-tele-rokkor-100f2 | 0ed03d62c255c34b4b1b42ce6acb45616aca421318bb2c9c0c26d4bbd038ca3c |
| catalog-minolta-mc-fish-eye-rokkor-ok-16mm-f28 | 11f08c5954fa90da5f200c7fca636a7ba6336349496971f2febe9d2a8c1107de |
| catalog-minolta-mc-w-rokkor-sg-28f35-v2 | efbce932b863faf3a0e854f068cf3fb710c081d9a127701baafe5d32bcf2de21 |
| catalog-minolta-md-135f28 | fe45e3e26469e761a435ec81b13f15161ce0ec7c80cfe106f69486463832b532 |
| catalog-minolta-md-28mm-f28-7-7 | 869d1c1fbc8873554b02c370d047238f922580253bbc0e57b194f4d50e96b00b |
| catalog-minolta-md-28mm-f28-v2 | caf5b3ac9990ad58f4f24c06b954d1e94774e6337690d6dbd2235c96948f9c50 |
| catalog-minolta-md-50f2 | c55d74ea5c77e868942455f2a265da45eaa9ffacaa46904ec588614f096c9bd9 |
| catalog-minolta-md-apo-tele-600mm-f63 | 8498448ae45551b3b411cdee15bdf0644c41ba4504caff2792a8714c81b483ee |
| catalog-minolta-md-fisheye-rokkor-x-75mm-f4 | 90b1c221ba232e43719a3adbd27ca3b6995552acdaaff2cd278020a645e62d95 |
| catalog-minolta-md-rokkor-45f2 | bd65c7cafff607a9102af98f1d571ac3371f17b195d47649ce2331ba8a1510aa |
| catalog-minolta-md-rokkor-50f14 | 833303e067da0e93c9e28efecdd6793ce7e1eefb15dd773022866944fd5c5037 |
| catalog-minolta-md-tele-rokkor-135mm-f28 | 3d7c79f458355bc6ba2380991b1c4b7ad6ca892befc8ffa13e8d2ea49b0721f1 |
| catalog-minolta-md-zoom-24-35-f35-wide | f17a223eb43257e2794e8e7d685a63b922becfdbd182db371b5849f1b6e73c11 |
| catalog-minolta-md-zoom-24-35-f35-tele | d330858e248970185a7bc96f94abdb3c6dc02689f967ca0d0c409b379b14feb9 |
| catalog-minolta-md-zoom-24-50-f4-wide | 23179897f521dfa0a9563831909eee312d45d43aa1f755fd6324c3d70e12035e |
| catalog-minolta-md-zoom-24-50-f4-tele | ad44c7b2943cd7fe826b1b26a93c41ad62d2c1bc27b75c0145335eb0632a1cc5 |
| catalog-minolta-md-zoom-28-85-f35-45-wide | caa585ef4ac5725f982586db3f7fb1e7099f7c0ac0426e798b3791affcf0e5f6 |
| catalog-minolta-md-zoom-28-85-f35-45-tele | 1ccc995ad0f2a8f38d1b4e4c22b99f5b679e18d3b9b66203641f72413475678f |
| catalog-minolta-md-zoom-35-135mm-f35-45-wide | adc093d1c09d690a1ddfd5c6df57ae0597a44529e6606113667c4ca02599f45a |
| catalog-minolta-md-zoom-35-135mm-f35-45-tele | 9ed6a54d7f7eeaab9bb5f1fdde3d5bd267c6223fc335e0e1ca48894038457c3e |
| catalog-minolta-md-zoom-50-135mm-f35-wide | ef529a64e7e7e3fa325ed999587172d64b8828dfc6a85689c7247bceddf92f2e |
| catalog-minolta-md-zoom-50-135mm-f35-tele | 2bfee2828a2b945166fd6f7baa54ab4b155786d6c8033eabf43a17d6a4fb3435 |
| catalog-minolta-md-zoom-75-150-f4-wide | 534c6a0061892d877ca49d51576f79406b0dab9a49d52f8dc1268482a82f7452 |
| catalog-minolta-md-zoom-75-150-f4-tele | db786ca07005bcf7bf2292d3e940e114aea0c98bbc719cb91b21da752fa51173 |
| catalog-minolta-stf-135f28-t45 | ec2016358dbafc1cec81609152851e31c133ced273c35021ea3e3f500880e6f6 |
| catalog-miranda-auto-e-50mm-f14 | dab3195bcd957b0aa943e848269d758eee22d2e5cedac4424373aa4d351bd87c |
| catalog-miranda-auto-ec-135mm-f28 | d26f27db92fe3d09bab2815ccd9845e7e6d78142651895b77571af8804cc2d54 |
| catalog-miranda-auto-ec-200mm-f35 | 751f094fa2e85a7d34d5df023fdd8e3307dba9e265dff5129f9658895376f79b |
| catalog-miranda-auto-ec-35mm-f28 | f4767123d9363716c5ce8041f989d5754f67cc4cc47e3ae3254c70f002e81134 |
| catalog-nikkor-105-f14e-ed | 44a4607a08a6d1adbbaa54adddaa2590142872af072e358ce0ff76615166b6bc |
| catalog-nikkor-24f28 | 5cad39d12de900e7a1d1f6ad252eeba29275e1a159bf0abfa53695fbdf8a71cf |
| catalog-nikkor-28f14d | 7ccbcbaaffded99da41f6e2de7d6cef129ede23e2648e44b5e649904853ec121 |
| catalog-nikkor-85f14-ais | 6fb5c510e0baff352e18e48061f8eb624fda9c9f24b6eeb2aad5cff070928733 |
| catalog-nikkor-85f14d | 938ad9762f84987054306f65281376e944aa71c2e5ea5511edd1828b2f986b05 |
| catalog-nikkor-85f14g | f2819b777c6b50fa7803a856c650d97ccda6e0daa214c7328e86213d4a83e317 |
| catalog-nikkor-af-28-200-f3556-g-if-ed-wide | 62fac04ce1ff82327720223441cfc87d5b6a69feafb716744ac610ce58d8cd13 |
| catalog-nikkor-af-28-200-f3556-g-if-ed-tele | b14697a9c0bf93eea029cd16ab8726fb9864e43c2bae2a7bd9539b976d9978cc |
| catalog-nikkor-af-s-58f14g | c35b34a15a0b04cc42b506f92350d1f1a3822d9254d29f70f4ac7bc7d7dda567 |
| catalog-nikkor-afs-120-300f28e-wide | c986da09325c5f48095b4bd60c7b65afb91ebbeb1d711ccf9853de9f12d8fbdd |
| catalog-nikkor-afs-120-300f28e-tele | 9f6ffd9c75c32ec767df1835d02908b05c6432e00ced2a10eae8d84f20d170cd |
| catalog-nikkor-afs-14-24f28-wide | e0e56ec9da26f890c6f75f9312b195101b3749530b56c9a5dc0724bd9073a63b |
| catalog-nikkor-afs-14-24f28-tele | f162c6fa15e8949801a03c8e4b56e1019969e3f9b6c92631f43e0e0a610bde5c |
| catalog-nikkor-afs-16-35f4-vr-wide | d5b3e9aa8517fc08a86da70f2d3f38f062b7ae3ec0886fe9ad58a0aa9978f736 |
| catalog-nikkor-afs-16-35f4-vr-tele | 4b90b3d93e8e161be2c6437f6fb7d102cb0aca7e15e970aa4d8013ee33a89940 |
| catalog-nikkor-afs-200-500f56e-wide | 1bd75bd4bbf75f01613002f70839f9fb987d5334c28f12a470956d5789e224be |
| catalog-nikkor-afs-200-500f56e-tele | 01a0a46ad715fed6380f99ed355864533e51862c8a364a33ee3a363a2a9764ed |
| catalog-nikkor-afs-24-70-f28e-vr-wide | 7358c153bfd8fc81703bb65eca405a01539523488e78fef5a459b1748d6960b4 |
| catalog-nikkor-afs-24-70-f28e-vr-tele | dcc94c677826801a8dbbebf98716dd23e6a3458d2f5f7acfbef7787f277fe6c0 |
| catalog-nikkor-n-28f2 | 697f6f41049815394fcd54449837fad6ffdc3498423851b075e05b5cc4d234aa |
| catalog-nikkor-s-auto-50mm-f14 | b63637359ff8d0519a15ca0ee808ffa9df3b27fbe025ad627588123b021c59c1 |
| catalog-nikkor-z-100-400-f4556-wide | 9e52e42dbfc0433421656926d56bfd4a949f5919463756d6d47897fb65317acf |
| catalog-nikkor-z-100-400-f4556-tele | df6ed99dea971e274436ba613549bcd6536ae785af386b4d197b4b85befb8353 |
| catalog-nikkor-z-14-30f4s-wide | 301ca62584582e26d54e86332bb0e477a393fbd5ea3f64795838d5be50cdabc9 |
| catalog-nikkor-z-14-30f4s-tele | f47df3ef390cbdabacfc1e0dff5d113cfdcdf0e43bc08496669efbcd00cb00ea |
| catalog-nikkor-z-24-120f4-wide | c163f4e799e0c8d02d6fe23a7628d0cf82716c1a4aaf879a863e53b7097eb315 |
| catalog-nikkor-z-24-120f4-tele | 5c814d458ca6dee4bc409619437c81270f86bd5530d267ac5c8238eaaf4206d8 |
| catalog-nikkor-z-24-200-f4-63-vr-wide | f379a2b47f66fb1751cf02e1c3d9fd74c0c6ac61ce7a25707ddc7af1fb783034 |
| catalog-nikkor-z-24-200-f4-63-vr-tele | aed848d52b04851edd41d7ebd68b3685b8928522e646f74cbd7f484a92b4babe |
| catalog-nikkor-z-24-50-f4-63-wide | 3d541fbe001366b41659d0906bcb232d0988bfdfa9bf937fdbea5569f96f32f7 |
| catalog-nikkor-z-24-50-f4-63-tele | 72936f2b512560955743ef7d60711bcddf215355b118b8560a26a99a8892137e |
| catalog-nikkor-z-24-70-f28-wide | 3113c7ea25500e910d0676f935cb67250fd9fee54293ca7b6fb03b1f860a0ef7 |
| catalog-nikkor-z-24-70-f28-tele | 26177ee3511adadb51df2129fbf090068b61d14e1b67ab76865ebe54e95aeece |
| catalog-nikkor-z-28f28 | 846e21ca7cbcb40d8c2995d372193299dd0cb4ec01716711e6c620cb0e810b76 |
| catalog-nikkor-z-35f18s | 97fe62cbb976f1283ff01ac56aaf75d4da428861ba839a0e85616c051a425863 |
| catalog-nikkor-z-40f2 | 06314c45636bf6701b193c96582cff19bb4a87ca22c6759ff44e8ac53da82995 |
| catalog-nikkor-z-50f18s | 3a86fede9ac302525a193fa89ecace13f8aa654ae6c117236be71f140cce1881 |
| catalog-nikkor-z-70-200f28-wide | 0a176171439bec16497dadc7aa66e28ed13c1f95bd594180d360325ed9fa9009 |
| catalog-nikkor-z-70-200f28-tele | 82587c4e2a326fa173c498c01ba09e89eeb7d718df5529e69bbff580951c49a8 |
| catalog-nikkor-z-70-200f28-vr-s-ii-wide | 6b7810a2702c8f362075f2920ff46c2aeaf70c71ffa6303dba263e166f4be12a |
| catalog-nikkor-z-70-200f28-vr-s-ii-tele | dcb330f8d9097af6daf3a34f026612cfb5355b0ec07f17c4c1b0d1fbe44b8086 |
| catalog-nikkor-z-85f18s | 06c7cf80e464454b350435ae8dfe894abf7862f5e9c3ccd9840d2e454e052eec |
| catalog-nikkor-z50f12 | 167e686b31a7497ca34af22c245b0c6cc3ddc6ccd060343c987f04ec18ae4c5f |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-wide | 677feb86fd41f3f5854a6c1c3129c4466049996cd866b948479fc8e14226ac3a |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-tele | 2e3a366880ebc58337f25455ad765efb8d83f0b3f30840e70d6a05ce473fbac0 |
| catalog-nikon-1-nikkor-10mm-f28 | 837ff4db7762894632f18b42fccdbb02008da5b0967db5497bced9779d8dad69 |
| catalog-nikon-1-nikkor-11-27p5-f35-56-wide | abf2747aa5ad0ebc994b1cfdefefce47016c69103826c65b3296b37881a842ef |
| catalog-nikon-1-nikkor-11-27p5-f35-56-tele | 395c8114997541849784e35b1e21438f353ef9c65536e198954e9cc441aa5a0c |
| catalog-nikon-1-nikkor-32mm-f12 | 161dc6ad461870a8db4924ea9c8dd98226d715622912bdea90e7e6722d5799d1 |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-wide | 8eb2a92e5f9b7dad64477b351824193c8171050757f5698bd64754a6c4df5dd1 |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-tele | a7b318543ab43e9853bd8305dc43fa55b6a1560ed61484f23ea479fc8165aceb |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-wide | 46a897db7b98594adf12164e7e508db180cefa7eea01185d456041360e0055a9 |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-tele | 1c6120c0e785476474203dd887268ef64d9173bc7aaa4ffc5e116d517c14f5cf |
| catalog-nikon-28ti-28f28 | 90e07471345d854c57cf80b1d7a478f7bd0b6bd4f56a0059f10c78bcc32e41a2 |
| catalog-nikon-35ti-35f28 | 176a4ee433f8cd01d189c4e34d3570d87b22561480990cb45ec4b93b1a3be818 |
| catalog-nikon-5cm-f11 | d0cfd97a962569d42d0f80728bf5f54dd06e574c52d3babcda1f8ccbddbff7ac |
| catalog-nikon-af-dc-nikkor-135mm-f2 | c270b8f7214b373d6f41c24e9b2b5274c175ef1f2eeb319760235994e410c2ac |
| catalog-nikon-af-fisheye-nikkor-16mm-f28d | 7ef3397c6a177bb4b5dd348929dba10f07a29062507112651cabe78300a3b3a6 |
| catalog-nikon-af-i-nikkor-300mm-f2-8d-if-ed | e9231a90c6c61abfbb92e8122386f3e56bb1b75d518e3e18d660524f211a83d7 |
| catalog-nikon-af-i-nikkor-400mm-f28d-if-ed | 7a2827e06ae1152a1b8084eaad552f08cb4b61297ff8a494ac966ce97a5b85b6 |
| catalog-nikon-af-i-nikkor-600mm-f4d-if-ed | f3e1899642b29eacc6693a1825808d6f7ca8c3e5c758987972960a782975eca6 |
| catalog-nikon-af-micro-nikkor-200mm-f4d | ff8e7bea6a100fe3a610a71328ac3dab645e86e7bbec9c2a1f191364af7a314d |
| catalog-nikon-af-micro-nikkor-60mm-f28d | 89aa4e65d5032bb54ce5fa9d6077e8420c0486bf9be3f0803b8630315e6b7446 |
| catalog-nikon-af-nikkor-20mm-f28d | f3244e8639c7d845210e1982ede84249798306681c870193ea2b37894dee1bfa |
| catalog-nikon-af-nikkor-28mm-f28d | 1385b96351d62eacb8ddd8847e701f5e91970fbb447403db197152735dc04f6c |
| catalog-nikon-af-nikkor-35mm-f2d | cdec616233b48b2b4d4e42586139b14661527af82354f862e4adeef37ee65b53 |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-wide | 995bf838b8d351c5b74067cb5ca69905adacee7a11bd8d83b95cac4851aa0bdb |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-tele | 16440aa182d71b37b1909fe4f439f51ba959f7448785c7e922f7434c3b8aaa82 |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-wide | 8190d968ba64734ada3b892b1123a39c0574918856048e74fdbd4bc8d20a7bd9 |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-tele | 049dcfdb67225311bcd0909c1c70da4c3998fb8c5c84de146694ba66d61d9296 |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-wide | 257264e726b7a799d85070aebef50ef6495402ec4edd3d81bd672939ab27ea06 |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-tele | 34154fd2c33247d37958f49ec3afd4782302a6eb38432c4daee09fd047628452 |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-wide | bc49c6222b9e40dab59b629ca9e447cd687ec5987356d2998cb69454bf2986ae |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-tele | 2de15afab6d4a4691b782e2cf20ea8d5db3e8f28b78a30b8f1a1156664451586 |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-wide | e4142adfccbcf9b09fd7de232adc1dfd7d05192ef9cabdee9598924574ee60cc |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-tele | 481e993fe34efdbc2b8fbd1ef63bd341f607618283c237d9a9bbb663de53a31d |
| catalog-nikon-af-s-dx-micro-nikkor-40mm-f28g | 520e862c9083c35a8ce6fa50c2fabefaeea8d42466121b5e61aa5177e784b166 |
| catalog-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr | c1511ee643b4c60bbb39206856ed0a760dfba2c5fe19bc28186df9e5c4f1b6b3 |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-wide | df8b5ebcc5f671b4c29dbcae22159fc3dd4fd8898d2162b7c60ebe4495e9f9e2 |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-tele | 9e8eb084ff450409ced5003bc0ec3bc2446d2c7c21b37eb6b7609bd2b9784a58 |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-wide | 93627a4f8071bc412cf0f0076bf0273e6de1a61d0cb25c54e699a463d50160c7 |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-tele | 1aa0a5a3bef725d31b3f39d760e7925cbf11b5dd4a8c4ee1661d6ec143ab29aa |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-wide | 65c43035aa56a471b4db5fd65f83fd06d3dabd5a7b8cd1fed22f1fef2cff26bc |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-tele | 317f7bc0569e0098a970006e7f4ffd5fbbe383d36598230a5247e0f039b9b168 |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | 98d1e462163251c8f4aa87b3f68c5c6c764af887f6ed3e5e979d41ad4899382e |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-tele | ba20efbc12d6ef394cf8056abcee526f8bee87c1e2e7a9209ee6f48bd66c5ae3 |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-wide | 5af87eff9146d0e1d5539e7a73800141acddd8b015f227a6f8638da240249202 |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-tele | bf3229e0360f85c18bca1551ac16e4485c5f953234247baa8944888c4956afc1 |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-wide | 8cb8d1a4fd091270f40ad460d577d7667417394bf8e5b11be16eb72cd9b29765 |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-tele | 09b946329107e9a80ad628d3ac3893477da2e360cf92e0a250afe9ecb9899f39 |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-wide | bd73a414474d5089875992f81e8086c82323ae7e4543dbe9878a39046faefd91 |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-tele | 9e662bd0bac69a341b8e2e11b8c8e49c4dffdada12bd1a594cf658995d6cd10c |
| catalog-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-wide | eeb2413070d9a314fa2eafcc5f740afae0e242a70dc6bfa1c548808908ceea93 |
| catalog-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-tele | 111a1a96ee93a437d1e12a0e2fcab9871b667ba6f63b0e6df1e28f3fa3db5588 |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-wide | 4af713a3311e15949477a707e923b1eb7f3998135ae6bfb968373418501df9f7 |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tele | ae10c87a5909186272b0227741708341d29137926e945caee46892728cf36a46 |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-wide | c76115212ea4041ccb18dd61e3d569180b35f4f8863a3475b1d1d6306c75ff4e |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-tele | b61cc2ba7e0af19328b2745ca9894e7c502aae0a9da12e7e6a2ec4087dfb90e7 |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-wide | 485cd2ccd2a499b1fd1e06c7f8b6f2eccd34c7da48005da62250385317fbd511 |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-tele | b4ce9cc4572be5622a855804a1b285310cd8ba26ac92affbedf8549e429bf47e |
| catalog-nikon-af-s-nikkor-24mm-f18g-ed | 93f312eef0acbae0742b2de4fe496e41ac0c6694cf43de112ad867480c77f076 |
| catalog-nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | 767018dd3ef5c4264a600ba12193142fbd76af2d49d1bf332b2cb19a57bccbbd |
| catalog-nikon-af-s-nikkor-400mm-f28e-fl-ed-vr | cb21b4342ec30d379e8048034eb969ebb8ea5de29db8c24e839249a0d6ed942e |
| catalog-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr | a4fba27752a401cae82ab5d29ab901413839bf2d567d027660c807c069f1b874 |
| catalog-nikon-af-s-nikkor-500mm-f4g-ed-vr | 5212efc60c958a9b4c690b2a8d59f38679571a74b371b70ccda7a3705765c76c |
| catalog-nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | cf3a028f1127a5495431edabe9af36e1f6c55ee3cdbd503af8ff8d9b3b0eb828 |
| catalog-nikon-af-s-nikkor-600mm-f4d-if-ed-ii | fb57d810d62f56167b3048fc5e25cc2d5b3b413c01420bb39e780ed94116a8c7 |
| catalog-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr | eb42d10cb9d7f33ec8bed99c8ff09ce8510087ce2a4f103b24af7c3707961f5d |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-wide | 00d991308265bf7fb716c8dbc1b4f3dd548322bc78b035a9249dee9cb18fef39 |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-tele | 3b88a3dbdf49cb6142f7583af0b07e73098d730d5189e2f1310b32f205fd34ab |
| catalog-nikon-af-s-nikkor-800f56e-fl-ed-vr | 8dd3b32dd2d230db583978ba12660cf20b095baba17b8d40ad0530624a5bab0c |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-wide | 3de90ca05d13447304fd2cdfcda9f9725b2e91ed5b071bfefc14dab53dc45446 |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-tele | 0237f776d89a4d893b7fb6b5c1cc2d017b3497883de8fdca4852f5ef2a20714d |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-wide | 6226ebf5c8cab3c46ac970477f66076c1b6832f2ad956e6922a0a0f2b654dc0e |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-tele | 1f03da8a137f906efc9b8e91384e7934ea4ca2ff28777a684772d7ca24e2de88 |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-wide | 64df8b5205c157211e6d02901d6657ee4eb137295fe0704902d508295841ad1a |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-tele | 4a19185348ace60bbba92e6de73b374b7da970fedbc15c3d53537b061e0bc7b0 |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-wide | da53ddabb0dbde97d542cca8911144362f7217e7a51d33a6103001bd79823fff |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-tele | 6bfb9b2ab308025f19ac257d63108e9e00eca1efd6720afdef306ab0bc4045c0 |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-wide | af6427af8abe12fa506456c783247bb921a46a1b67df4e5b345c1b096a3549b8 |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-tele | 04b74e4b2f80b6e539191e5fbc00069edc72851aca186e5f304e6416ec97c31b |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-wide | 720a2cbe0534d43eab771eace1d534606461b8487e3e20ea9505fa49a25d4dda |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-tele | 52b54e24123d87f6a7774c978077e4500055f8422afb81e3a6de35bb0003df1c |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-wide | 7145fc3e055760d5b5716a70d09a1faf032bbaabef43225dc4fc1b889b8a8a74 |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-tele | 968d6a16364f92743b120e7f7ebeed3705e8b599df075f6f58624b9f6168fc8c |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-wide | adaeaeb877505241d63ac76a37fa490d5fcb5ca8bc4960d8ba43a1f1b41ef073 |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-tele | 0a479545adb97afc839ea8b035066978410a00bb1386749fa359af882fc85207 |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-wide | 37823cb7dcc6aa4caceb301aba9c2b89f203c6bf34cf250d1c34002a8c221954 |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-tele | 616ea5713c84106c911276ac6d1c6a5342dfc39ca06870e2d7d11a34619c7efd |
| catalog-nikon-af600-28mm-f35 | 1558f0c8cc3768a07cf891433e72f37bbf4a56eb60427962379b9a91e00377ee |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-wide | fc803b355a5f4979072b762e6df13ebdd3f7ee798d5d59c9c95bcaa00deef443 |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-tele | 9ef1c27b07f2e213201d9b5750cf0223b5ff87f1344eac5567e0a3d871749b3e |
| catalog-nikon-afp-dx-70-300-f4563g-wide | cd5dd6f457235dc5ca3c560518ab8d8bba3de293aa08ce4ac235e181362c5184 |
| catalog-nikon-afp-dx-70-300-f4563g-tele | 6e40e019f0ea95f26f6c71aefc5dc9c091d2f10e77033e072211a0930f34f347 |
| catalog-nikon-afs-105f28-vr-micro | fd8c43727867768bc5f55462a22a2dfa0faa11563ee3a136f5ae6a4ebde84a76 |
| catalog-nikon-afs-24-120mm-f4g-wide | 9e59cdf0a2a993a5e21873ed32d17fa4adb3ef31041a209704de61b1b44718e6 |
| catalog-nikon-afs-24-120mm-f4g-tele | 3dcd636ddcd85b59de5f6cec1089146145c58d308a5852a783cc3e8f7d420292 |
| catalog-nikon-afs-24-70mm-f28g-wide | d6ef316569c182f3347208fad27574c1306d37f6a60e8dcf2b54d949df542d62 |
| catalog-nikon-afs-24-70mm-f28g-tele | b8d0944a75f6455a64a5c29635838bd3cd48a0dc231618a37437f9e1200b2a85 |
| catalog-nikon-afs-28f14e | b4e79f8e6ea72f091623fe6ebd400535f3f48c87c52091c28e6224a73d0e40ee |
| catalog-nikon-afs-70-200-f28e-fl-wide | bc0cfda938b0050b9702459812fcd0448b8b66aeee420cafa96ef5a1ab3a4194 |
| catalog-nikon-afs-70-200-f28e-fl-tele | 0a870e4c4808d7f9816d081024cae5c541c017ce18eb183d565882b4877cfc33 |
| catalog-nikon-afs-80-400-f45-56g-wide | 545b239bb2dbc97a7b176741c378ec01f63736f63afc468df0b431ca65639d4b |
| catalog-nikon-afs-80-400-f45-56g-tele | 8c72b1aff61c9efa7013863859ca82e22df2de98cf998ce2ea80f0aee178cde8 |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-wide | 23aa8bca5eba0bfaf7b77d18dbc658aef607133c79e51aee571c397387a54659 |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-tele | 5f3591cba9680b9bd47a4ee8b304d33a028ce037bc4a285366be8f7461ab01db |
| catalog-nikon-afs-vr-200400f4g-if-ed-wide | 125681b91629965f64a365f0ef48814945650775fcf0e2b1497dcffa7a586cef |
| catalog-nikon-afs-vr-200400f4g-if-ed-tele | f0184287978bd5bf9d5729cff1bf11bf13ba6fc2d5e2d82b443fecdc62a2c5f1 |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-wide | 9ba2593a1ccd0774a126b0ef7f4b9016fb949cf2ca55d490891e8d8388b05e24 |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-tele | 49faa0acd860494e5650dfcc63279afc6683a30630fcdf77fda2f83587c17810 |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-wide | 8d32c6e70b05017804a0b4bc0714c99c456b2599a74c5f3230cca8f24700b19c |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-tele | 6c23cfbd35807649a62a47a0a6bf05a00fc296a5d78e645c66ecb8999355aa84 |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-wide | 0d9a70e5b5b58a3cbe7d1b28ae2c2ce11c061c222d2b7a773a74757ad438f661 |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-tele | 006b6047cea40b4c3dc79fd24f044badf33bc8e77b6aede96ef81911023f5ccd |
| catalog-nikon-ai-28mm-f35 | eeb24bd3cad8ecc198a8b861f9523b8c32d26d8ce9ae25223ce56a58d54c989d |
| catalog-nikon-ai-af-dc-nikkor-105mm-f2d | 700ec411ee28f7ed1b4771d464cbef037a7c31fb8f75c122c75427e942d27b5f |
| catalog-nikon-ai-af-micro-nikkor-105mm-f28s | d8b9c400d2e7fdeb4fa42ebfff5cfe1b0b56c900fb671ac78880bf35bc6c74fa |
| catalog-nikon-ai-af-nikkor-85f18s | d5e0ad3143e197f2c4f8d5e31a87be94df89ed9755174b18f91a844b3accb89b |
| catalog-nikon-ai-af-s-nikkor-300mm-f28d-if-ed | 3f36aa41ec38a9ac7b90861886acf6789ecd26d64642adce7d6e787f4ded37bc |
| catalog-nikon-ai-af-s-nikkor-400mm-f28d-if-ed-ii | f2c59eb11c141bfa12b41cb4d8c66f5853b672dae8851fc6e0a926768cbdb276 |
| catalog-nikon-ai-af-s-nikkor-500mm-f4d-if-ed | ff1fda66933f015edc34e99ad52035c1e6e5e922cc63a5ea7aaac4248677eab7 |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-wide | 729232a9710de9419aa612d36a5cdc34cf22aa261db36ef25d11175ce0e13c33 |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-tele | 4b18bcaa24948df858f9a89d491093d2a6fa20a0ff7fbed53230081e092e8c52 |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-wide | 8e96d8ad66cc5e9d18cb4988d46924b1977cc2c5463dfaa9ca110c6f8e6c6376 |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-tele | cf572b1810ca7af6db24508ddc6f05727344d95429b83bc9d0d9351678317eb9 |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-wide | 0b7e22064b0aca73af4dbf2c3a13b6e47349ac296288d6ffafb9eb9bd8bc92bf |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-tele | 5d28ed62390e28d8b664352402e6e0a3b2de25b5c57b0160f4a6a3e8fd25ec22 |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-wide | 456cea6005ac2e55f589eabe3056ed9dc146191ab06d4e89d523650cce652306 |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-tele | 2c4e996fb883be7c9eb45d216f9c686806b0c55831ce6ff65b8ecdcc9f885210 |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-wide | 7ab25881ebd043a59bf5cfff6d277bed12584b325fa95da6c34091b973d20287 |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-tele | 315a2117a40ef20fcdf32f6e3224bbbb42135104ef9b0d0720bc44e6d31c22d1 |
| catalog-nikon-ai-micro-nikkor-105mm-f28s | 62174aa31c168648f13ffb29e0dc72a6b0cee7010b2c7941e89c1f3d55183a9f |
| catalog-nikon-ai-micro-nikkor-55f28 | adc28299da005c8a9436cce828efce51e379ad8ecff46d9a852efbb867309ef6 |
| catalog-nikon-ai-nikkor-135f2 | 94ef2c28d88c447633d4725143d34611bbd6d21e5486761113bb421d30caf804 |
| catalog-nikon-ai-nikkor-135f28 | 74f969e59084e25aa989da9487260b311343221101195374f91c1da47b0c24ce |
| catalog-nikon-ai-nikkor-180mm-f28-ed | 0bc41fd5936d8dd3a52282a09065aeda3cd31cbb9e8597334cc70c4ca86bdae7 |
| catalog-nikon-ai-nikkor-200mm-f2-if-ed | 96a7387cc33cf61bc7b0c8267edd20291ee27040b5abd815c6bbc5b7667df74c |
| catalog-nikon-ai-nikkor-24mm-f2 | 35f00360dd1495b7e1707300e254f3ab6c346336b6ddeff0d3a8cf9957d5b3d3 |
| catalog-nikon-ai-nikkor-28mm-f28s | a66e654386bf3a93c58813b4819dfce222e640816b8d71a98a54f84fdeb691ed |
| catalog-nikon-ai-nikkor-35mm-f14-s | dd3aac4d5d084aca061bbc4bf058c3695db08c66a275d5fadca52b6ad94d64e7 |
| catalog-nikon-ai-nikkor-35mm-f2 | 751e3ec14b73dd93c769ee5bcc7b5bbd7cfe60422a3c7b79e0883be033fa8c6f |
| catalog-nikon-ai-nikkor-45mm-f28-p | 75abea4bb5afae0adc825bce344fb84bd511a8e6a9cc69b689e4842c1b2efd6f |
| catalog-nikon-ai-nikkor-50f18s | fb736617014244fced1039822ceb12f5db6d1733320ad09e9055b6e2265b3c75 |
| catalog-nikon-ai-nikkor-600mm-f56-if-ed | 1114072395e80169af8b972d613771da2ef1b36234517b2c87671d9038e893d5 |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-wide | b6e3da29daee1297a3b678b357fa48c80564ff702fcc6e1d40221db302845ce1 |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | 9cc5c352cb0763b60c834057caf37dc27e2690b842b7c097a401f9caf49e63ea |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-wide | 63b7f83fc63975bbf3ba04ecc4554e51a952a074a0946360beecd6a4a8c959ce |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | 1f2667979b39588493a39e359eb17e971ee14706a1a1eae122341aa96e2e2df9 |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-wide | 3b1c669085fea94ffc71d750229d15aeceeb1548bb99f9c2ff582cb978d051bc |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-tele | 8c0c2e4dedfcc412021dda3cad70f575b7a2250d37fb5fa1d8d97ee2c4aa97b1 |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-wide | fba460cb12e13bb5b6b11b21f62df46174fb1b22df136d6123bf961631c79170 |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-tele | 0288b84894e3c934ec47e242a412b74335920c71aed089e2573339efed96e4df |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-wide | e9ea6016605d56dfbc6a51d7da6ea2be40eb970349fac9940ac9c0b31acbd51b |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-tele | 7167bf205a68f6d632ba5c542a0838141d63b0d3bbd12db29e185feed1e075cd |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-wide | 551e7b6f90a1cc9fd9f82a746af8b7c6482695e277ea7c5121f95a4e733f7243 |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-tele | d7a1bee0be14a354c33b1b7a6c0f52d628a36e5aafa2d530ecdedb5a174bb8ea |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-wide | 35ad8cc4c0224a94cc106ec0890d1d2516b98e8a2b69ae7780217c484f3f54cc |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-tele | 8091edf96ab11444e869acec44ef6f85de8f87841621c5d8797355ba1b0f107f |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-wide | 20c17973bda703a1afe3c3fb1623fe50f0fd584a58d112e30bc1a5e25482f6f6 |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-tele | 7515c7ace8df35da94f1e9d190254c5cfc0af45b6b45b03dedfac31c638d1d45 |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-wide | b17e0932ddaedd13cf83712b6fe70e6b95f8e520044d23e04ab41fc5bec737a0 |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-tele | 25b3a7a98bf82988a9d260418cbe2a7709fd6513eeec8537f6ad844aa27155cb |
| catalog-nikon-ais-nikkor-300mm-f2-if-ed | ab34182c864ed9087926d5389fa032bbe61d6ef0f3a7f1bee17783e453c90c96 |
| catalog-nikon-ais-nikkor-50mm-f12 | 289fa046814b83c588e9dfc32ad0256a645af7d7361d40ff5a2727a1fb5eaeef |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-wide | cb04af98fbe77de7d55142785fd14fecb0bac26d423309f85507bcbedd2be3d0 |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-tele | 420442736a607d7c08ba2b235ba3e0e981632cc0a8b972ef43ddc6eaa6ff4930 |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-wide | 10136c32060edb91c01501b57085da30c4bda621b57d57cf733fe03d23cbbfd4 |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-tele | 02841dd9ec244fad0f0ef3144a6b43b5de2c89dfe48ac42d73295230f041ff5e |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-wide | 5abec56455d8fac0aa288ce51a62857c40b96bc306e0695f7acea52d9b89fd12 |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-tele | 14998899e220d97c3fc0a3105a4a535a6f18c31414e6d84c8d1a912844c4fde3 |
| catalog-nikon-dodotto-400f8 | 056094b0a28eeee4cd506438336f5e83a0ff70a820e1a8dd18d6212136ae5b2d |
| catalog-nikon-fisheye-nikkor-105mm-f28g-ed | 4053bd2c6f4a1279c2fd5231fdfa8f7b5c82bb30ad6361aab4dab5e3d67583ce |
| catalog-nikon-fisheye-nikkor-6mm-f28 | 252a5bf8c8e4339f33f821e728cfa557c8bf286cbb1b871beb02ca2e7d73dd67 |
| catalog-nikon-fisheye-nikkor-6mm-f56 | 55e6dc2e114d313f9cbbdb5bdaf1e3e4734dd959c73ccc7cdf4f93a7fe4a6e60 |
| catalog-nikon-fuwatto-soft-90mm-f48 | 003db26ecb9a3dba060f2915e00fb1fae4b55bb401ed50c453ad2b4bddce2a81 |
| catalog-nikon-gugotto-120mm-f45 | fc1affdfaeabe29d548eb5f76b84ba11e6b4e2ed62777900c61d728e6b0d13d5 |
| catalog-nikon-gyogyotto-20mm-f8 | a61c8d7c97be20e7bdbe7bb57406addcea9bd89138991626a9cedaf82520d1fb |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-wide | 9d9eeaa753bec6ac29d37f1dc58b911dd1c12bb9690433d65aed0f77674b1bf3 |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-tele | 61b81a5f52713abc6170e93dc157c76dfbdaa3dcbc2cbc205090b4bda69d900c |
| catalog-nikon-l35af-35f28 | 1a845571b7181fa58cdea0da2f1ef43b7597e92caba74a7a98ce630a5aa8ccdd |
| catalog-nikon-lw-nikkor-28-f28 | 3bc59c21b12b376524270d9d5ce125f320cba5d69fae83f07d8b0537db1088ba |
| catalog-nikon-medical-nikkor-120mm-f4-if | d55298a1971d7b1273a9fa4b8c203b267f34bc940d42e68359f84d8b2ff49eaa |
| catalog-nikon-micro-60f28g | 03ffc3929a106b4c87cbb89c3a037451beca3869cb703459de703f9cfabfe112 |
| catalog-nikon-new-nikkor-auto-28mm-f28 | 7a26f9b6b2d28b11fdd4b508e8be2e86a7c6caf68991cae15b2ca24a60256374 |
| catalog-nikon-nikkor-15mm-f56 | 2446524d35ea50b94d6776b626c45492cbbd3cd233093ed40687170ea8014cc9 |
| catalog-nikon-nikkor-20mm-f4 | c28637275641e289b4bf522b724709bc920552f2d8cddc5dd2c321d34a32c09a |
| catalog-nikon-nikkor-300mm-f45-ed | 5b8615270617428df2045196c8810a22938c4d4a46a8bb50bada32b15a587882 |
| catalog-nikon-nikkor-35mm-f28 | e3a3ea5869acbb9adf8398d64fddcc9a17959b20d959ac5eab8db41eb505daba |
| catalog-nikon-nikkor-600mm-f56-ed | 47285d0c0028c432ab6bc1b58899670e93ef74f47b9e8ae99cbba8c78b0995bf |
| catalog-nikon-nikkor-800mm-f8-ed | 480c13a1885be2816383d8603873196c66f6647c7519a1a3a7b22541d4cdcd83 |
| catalog-nikon-nikkor-afs-20mm-f18g | 8d305127838e6a5623a33a80ab51c51fe44980c3579186b07aed9b6701526989 |
| catalog-nikon-nikkor-afs-24mm-f14g | 637fb276aa7cd8cd862c3fd123362e3c2df6ad7f1ba79069edffdc9fc729e215 |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-wide | c056cc6470be9ca27a7cacba799803dd7e036734767c6774789f9e16188a8784 |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-tele | 2bb8731b476edcc68c3661154d9a0082f99c5a8409d56e68ca3c100f16854b06 |
| catalog-nikon-nikkor-h-auto-28mm-f35 | a6ccc2394e79ad37fc63ec98bf757825bb1082d71848002aaec5a4614ffd969a |
| catalog-nikon-nikkor-o-21mm-f4 | eb8c29de5e93d9ab98cb28dd69ddc443b1506573a981ededb7ec73f4024da67c |
| catalog-nikon-nikkor-s-auto-50f2 | 21eaab788d7cc08f7b5361db3d6f2c92a068e33cd7cfb89e2339d293ed6e5cc7 |
| catalog-nikon-nikkor-s-auto-58mm-f1-4 | 0e323263ddf42d023760b801f23e049613a9c206c984dc27d331f60849707ef8 |
| catalog-nikon-nikkor-sw-75mm-f45 | 0341fd4b6aff3641b877fe29c6b435f2fc93f153e63c85ba603aa5e2a67fe7ef |
| catalog-nikon-nikkor-sw-90mm-f45 | f4a9768610088f693bf5f78ae3c9cd6f70494d5b4c07aa7fe22fa4025bc8b265 |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-wide | e08fa179abc114a9033b6d26c65aa56f0bfd8b358182a2756f597d3666ba5d0d |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-tele | d0824296da0fdd6484da311df5673eab0507eead25a8a42d6a1465fc9a7c2b2b |
| catalog-nikon-nikkor-z-20mm-f18-s | 858738a5c8321fd2de8c4245c1743c99245457256aa2022f79bba15ceca08f6d |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-wide | 1840eaecaa0476943c511b11c15645e795b6937d88ac24f6efcec63dcb28b1d1 |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-tele | 8dc53647d14d5dfdaf27101ea7ac6c65cd0c13699bf5b3a147afcd066e22b37e |
| catalog-nikon-nikkor-z-35f12s | 8416484bae29fe55fd574b6f10e0a18a650bda4f4d97abbe642db8d2532554a9 |
| catalog-nikon-nikkor-z-800mm-f63-vr-s | e4d8e5c6357c2c981a0c16e96470c979728144850b771ead3536930f363a937c |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-wide | 91f5ff960af3220ede968424890af72d0cb942392cefd9e25a5d33d52fc8f3dc |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-tele | 599186981c02032d8fe865cc711614556da24bd5b16b6cd7f544e698bbf635bb |
| catalog-nikon-pc-e-nikkor-24-f35d-ed | 84c186023f88c9782498f5a3bb6fcdd7ce47847b794a0ac10b8721d315c944f4 |
| catalog-nikon-pc-nikkor-19mm-f4e-ed | 3be12d3333211a16915f348e1393bbe4061e432a80bad87e43a7038895c42155 |
| catalog-nikon-pc-nikkor-35mm-f28 | 3edf6dbd3b1e38609d6a380828ccb5218b76c5b660e586c430b9243a4d2b0db2 |
| catalog-nikon-pce-micro-nikkor-45f28d | 033dfc4c8d22988cfd6edc9b325dc0f6b8f34ed7ba4d447d419da26e32c67667 |
| catalog-nikon-r-uw-af-fisheye-nikkor-13mm-f28 | 874d09e55d8c9e5e32ab817eaab35b7692facb93024a7dcbd2d7a8e77a3a6d79 |
| catalog-nikon-reflex-nikkor-1000mm-f11 | c08be7bedd64209471a367783e99476bd8a9ee19c9d99d4ef35f24e196af760e |
| catalog-nikon-reflex-nikkor-500mm-f8-new | 9790071a93c6e48cc7ac729a8083f0f9212d46d22f9da9ccb75296ff0170de56 |
| catalog-nikon-reflex-nikkor-c-500mm-f8 | 7656f93551c8a00083812e229545f99f12a9f96a316e82158682c35b783d72a9 |
| catalog-nikon-ruw-af-micro-nikkor-50f28 | 56e49187e6ea1df47db85c1f1dbe36f0a0383df6628d89ad81cc9b4d989ea0dd |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-wide | 20ca7b26380b42b02a832674b6d45535925a9021c304e3a2b1ae255a7b8985ff |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-tele | 13247e6f89852ce8acce599fc7fb2bba89ea4509c77e6934b254c90978ca54bb |
| catalog-nikon-series-e-100mm-f28 | 8f21d0d4774eb5cef669d1d911cbde392413736df2f157a082e6b6e3d9ea8728 |
| catalog-nikon-series-e-135mm-f28 | 0f831b1d89cd00c3fc9f00c678866f87ff74f4d95d7e936dd2c0f6a92f925370 |
| catalog-nikon-series-e-75-150mm-f35-wide | c516491abc0c59fb27f065a3d5fe2623aeb1a071404aa5ccedb5c543d66bd586 |
| catalog-nikon-series-e-75-150mm-f35-tele | 346dce193565176f5091adedaeee210136f60db53b72b2ceae526a1813863126 |
| catalog-nikon-series-e-zoom-36-72mm-f35-wide | 97aa2603b6551eee13cb8677f2499b5c4c48f13efee8becd62ec24936e1060a7 |
| catalog-nikon-series-e-zoom-36-72mm-f35-tele | 533c7866ca2b02ce9f80d6bad970aae38b797197bf19cee48fcf912cd3cc556c |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | 84309c3f72c3716140aabc40d8774e4cba3f0ac96dd330af8de5526d7b1e9a69 |
| catalog-nikon-tv-nikkor-115-69-f12-s100-tele | 6e9f2ebc470c3e09a6a69dfcff8b5daaa521390f3dce64fce2b9db04381a3c17 |
| catalog-nikon-ultra-micro-nikkor-295mm-f12 | b6de5a3d3b6d5d2f6163b42cab34b0ba9b6830f4d88efaeee2f99c79685342c7 |
| catalog-nikon-uv-nikkor-105mm-f45 | 94dfa292219dc73fa423f6202fd30ff11a5a0b10b947c0f246f5a344697b056d |
| catalog-nikon-uv-nikkor-55mm-f4 | 910dd83a521ec2b1891fbcd09698f9f7cccd844bda9ad4c0d16f242d3c85ea15 |
| catalog-nikon-w-nikkor-35mm-f18 | 8fcfcc1e295e3a4724829b5aea5b63defa91a5ab55eee8e4e07be6bd018bc616 |
| catalog-nikon-z-135f18-plena | 0403f9a540eed64c9b7aeed98d14bde823ac3dc2167b69b0ce5c8447d26227be |
| catalog-nikon-z-14-24f28-s-wide | 0d8427330737c92e8daafd9e576da678eb05a8b4a9b279273c142bc0ff5cc059 |
| catalog-nikon-z-14-24f28-s-tele | 0f9ec441f893355b7a1418a12081ad28646a1fdc639dc7490cd15b754f93f3c7 |
| catalog-nikon-z-24-70f4s-wide | 327403ce09e2fc94b6122c0799aba12156ffad3f9b726829aeccb18d31efd709 |
| catalog-nikon-z-24-70f4s-tele | ab9c8205a728d127b2ec6bf4b38f868de47d255de7807c917d0ba35ec4b8ca24 |
| catalog-nikon-z-26f28 | 8f3ba777ebeacfc4c560d25337ec58771b904172df335cb080c3f06622da4af5 |
| catalog-nikon-z-58f095-noct | 276a087125f859670e54fd370175749d6a70bd92ee31cc357fcbed85ec7abd05 |
| catalog-nikon-z-dx-16-50-f3563-vr-wide | b444bfcba8cd5e85de23dd32e7ce219f1248e5731c9288f7cdec845fcda375db |
| catalog-nikon-z-dx-16-50-f3563-vr-tele | 722faca1f8a6040f53f435a8eec06fa525b39d35de9310dd72af31d21d50ed77 |
| catalog-nikon-z-dx-18-140-f35-63-vr-wide | 329f8636366e46f1623cb14818fa2f62721fc0a25cc26296de74d1dd4dcd35a5 |
| catalog-nikon-z-dx-18-140-f35-63-vr-tele | 7bf0122f8ad353dd219a1e6700def6a1fb722e44706e8a4526b383438270d8c0 |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-wide | 037bbc82b2dc64e3b74344be915677a606abd413616e1dd558a45fef36782a24 |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-tele | 030441c42aebb8b3cf1fa4ed9f8cd8b249fc8f3d058551f5cc7284516fd5569d |
| catalog-nikon-z-mc-105f28 | b5caeb649af604b677236805c0045528ed083c75a1164f65a9148a11a7bfbc54 |
| catalog-nikon-zoom-nikkor-28-45f45-wide | bc9c98f67769835422105d6b16e640638854c9f3e19df37192a63c68dabf7153 |
| catalog-nikon-zoom-nikkor-28-45f45-tele | c8ca210d40a0731e2e9d61e5637f40d85ecd82bb4d96f836684a5005f740d3f8 |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-wide | e60d90f4ef13b0fd5073688c5a461ceaf57e34eb5b2f149f44fa0fe3cb417825 |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-tele | f2d8398e37deb0b589a87fac85ddfa4291c5e905d4cddf2d0f7367b942544301 |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-wide | 3883795af88e4eecac0ac43160507658610f599d4a89dd246b1fe1bbd419feea |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-tele | c8781930a3315b293b7956a8972cf9a12862684c1890be362dc0144220f41e89 |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-wide | a8e2772099bcf507124d7f4e1e632b2b9ae61199b591d70387ecf2cb811a080c |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-tele | 4209e05e5602d4bc795f403609facc77a9d580cde0b54b44e0a8f23b0ab638ae |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-wide | 5e122d66a8d2de5349bd6b1d5442297ee500d0be7b086150512f89cfecf47ccd |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-tele | 3f9d2a57c5673a2d7b5b18cd29dfac6f74417dad532c65eb5a7fa6b8d31fb709 |
| catalog-nokton-50f1 | c8a556a0aa3baef714ce6f55c97d16d04059037e367af7200673c0ff28faf622 |
| catalog-olympus-e-zuiko-auto-t-1000mm-f11 | 2471e74a6ad0d70c1c67a93d675b678a7c6d08cc03c8ca9986f1b33bf20a1af7 |
| catalog-olympus-g-zuiko-auto-w-21mm-f35 | a0c90aed2d5b594acca4f63869e83d9fcac0edb9eb9689aad8590cd7fdf22844 |
| catalog-olympus-mzuiko-12-40-f28-pro-wide | 2f4a75444e4f8803566c132337a529620ce5931a0bfd572a956f50a95aab43b3 |
| catalog-olympus-mzuiko-12-40-f28-pro-tele | cf85d13f752927a4a4759b46c0b85edc6442b8f864acee345c6079004e4176a2 |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-wide | f999fb1362f3cabbbab8dcc9216d0f2310749ce5960b72ec5d1e72d0c4c6d67f |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-tele | 717e447bbc86a6e75fdf83379e69a04b1eab135aedbd3e9f762a66b0194ef8a5 |
| catalog-olympus-mzuiko-12mm-f2 | d7422cb114bf1ce58c4efaf074ddc8464fc0841bfba88d80d915d11385d02d65 |
| catalog-olympus-mzuiko-14-42-3556-ii-wide | 7d7732459d6ed5b3e82931d3643bff44975b24bbda365e58c72adbd4dabc4a74 |
| catalog-olympus-mzuiko-14-42-3556-ii-tele | a122c5f4d3fd274d4992aa2a1da0a4710046d7f53bb05a92d40d81b9cc283544 |
| catalog-olympus-mzuiko-17mm-f18 | 5845a6738aa7e365ca9b6992fa0c586eecca642bdd0f9a44bc10c41b7e849de8 |
| catalog-olympus-mzuiko-17mm-f28 | 913d9032631732bf481b3dc5061c5d8d72ec7d2e36d46a77ad86becd1e2b81f2 |
| catalog-olympus-mzuiko-25mm-f18 | ede9463f2f8e2e2f3cd4a83c08e9860f22153bcd20b7494f5d316825656e0a00 |
| catalog-olympus-mzuiko-40-150-f28-pro-wide | 2413b6c025ae9a104a53420d0572d394a09dd282709c85ce34c447e0640b96a5 |
| catalog-olympus-mzuiko-40-150-f28-pro-tele | e7da85290217ec7c341c6d4c706cf329c5b96727f9029b728d6fe22496a2d112 |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-wide | a3b66825ad54e667db4c7a70ebe0c453ef4c7a6cfed87739b31a1d6e252d7540 |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-tele | fe288aa1e84f2c97457b772692eeeed954a947a01e1eada8381051282c2982f9 |
| catalog-olympus-mzuiko-75mm-f18 | 8b2ba95a0d77de1c8252495d5b8d7169ffc803216d16b3a1fd3e19019e2ad298 |
| catalog-olympus-mzuiko-8mm-f18-fisheye-pro | 689618f1bd1c2083694ac4cb4be3dae89e1a203b07bdb87515903c97ed3c3385 |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-wide | 2d022c6f58b515603cdf5b3d79dd53b0436c4e9e65b937fe33b4cfefe7bffcac |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-tele | 84a74cfaa86d6bfaef539ad2b397d63cc3180d58bc619c9ecc20f22ee3a21609 |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-wide | bdad1f1a7ab44281adb6e058de945579d79815608ed4af943e795f7cfb352874 |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-tele | 0bd1db5008fd2454d51a66b9ece53a74911162aaebd99197b7a32cf943757969 |
| catalog-olympus-mzuiko-digital-ed-17mm-f12-pro | 92c3df240a37847300873154a8ac204965cc90b67fe3c4f5fa1ba1d801c356fb |
| catalog-olympus-mzuiko-digital-ed-45mm-f12-pro | 5987c9974c231ef2f4fff36c20fae272ccf68b6fef8cd2db7d428a65f53a8e9d |
| catalog-olympus-pen-f-g-zuiko-auto-t-60mm-f15 | 410553d3d8c4cd7792d2c26b3ad37f7f00b503113393ffd3686ed65b2bd358a4 |
| catalog-olympus-pen-f-g-zuiko-auto-w-25mm-f28 | 5ec8a770572396ee0c28f827e6300a8e43765f512c9d906d9dd99a79ae9cbb58 |
| catalog-olympus-xa-zuiko-35-f28 | 752466bea86270cffd76d37bb5f2275f333b6e7a893a5b6420136772a211dab3 |
| catalog-olympus-zuiko-135-f35 | 9275c5a175dfcfc8d1f0fa05fdc999af2441244d6c3d90302af9c90ac892e0b8 |
| catalog-olympus-zuiko-16mmf35-fisheye | 7cfe78e4ef4f323eed53e48ca55e44c94848362e6959677e8d74dbac3de78195 |
| catalog-olympus-zuiko-24f2-j | 5a6c556d120ba4cba588fdb681bbea1e76d9edebf9146d9b0402ea11e3d4ddd0 |
| catalog-olympus-zuiko-28mm-f35 | 88e3b1ded85100d6ab51c09074f6291e8295311eb4ef5acbc86a666b8d852ccb |
| catalog-olympus-zuiko-600mm-f65 | 42a391e2ec5f106d441388537a0474dcb816400fc5994e87af121da29d759345 |
| catalog-olympus-zuiko-85mm-f2 | ba6cb5b23ec4c5538951968aa5c1f6e41856926bf907d75285e92c916b51cb6b |
| catalog-olympus-zuiko-9-36-f2-2p4-wide | b575cb0c543b1c19e195eaa85e1414c509cd12f6749cc4f76db53f891eda8104 |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | 05d24d921cd3aa2a9c30318779399c520251d95409b92375b1ae0750173e4855 |
| catalog-olympus-zuiko-auto-fisheye-8mm-f28 | d3232f5d6c1c822f34ba55375f64a727ee863046f84ff24635505af8fd24caeb |
| catalog-olympus-zuiko-auto-macro-50f2 | c74510b0707f94285b629d3acd81aef91c1470d957327354dc6275159f39bfce |
| catalog-olympus-zuiko-auto-macro-90f2 | 69f60b871aa251431bba632397c482368d6609eda444f499cd91b9f874f41c37 |
| catalog-olympus-zuiko-auto-s-50f12 | 8d87ea0bda984498065c637216aa473c7188e3723978f0e6017e4d41e3feca1f |
| catalog-olympus-zuiko-auto-s-50f14 | 8a950bb6739ae7a271e232b86490e780f972eaca686deb5d9296153df54ca88a |
| catalog-olympus-zuiko-auto-s-55-f12 | ddf5d6df3de5aa433be2ffa88f3a68e96d84742981434c7bea19e56319062581 |
| catalog-olympus-zuiko-auto-t-180mm-f2 | 9abaadbc5bfdd4ef8ca8ac403470978151561468f965ec3da77031e40b12e969 |
| catalog-olympus-zuiko-auto-t-200mm-f5 | 2352ca2a64a199e6254bb54a003152860c694d2b41a492b09e6569ba66b4699f |
| catalog-olympus-zuiko-auto-w-18f35 | 4952ca2bdc7bc9a4e06c809de52d1083d82b801b9a559dfcd84729bfce23e33e |
| catalog-olympus-zuiko-auto-w-21mm-f2 | cfd4183c63123bb95091fc8fdd0ef02c4aecd16dfd72a7c1efe34b4203a430f6 |
| catalog-olympus-zuiko-auto-w-24f28 | ed5c228371dc4fe6748961ed52831166e8a1c73556ce482e2969fde70e8980ec |
| catalog-olympus-zuiko-auto-w-24mm-f28 | f741da844e580ee6a6e65c8581760a778117ebd8132fbfe13157598f83821e10 |
| catalog-olympus-zuiko-auto-w-28mm-f2 | e30f6781dda7455af685896bc73e9783d709d9aeeb0709db0414904409396914 |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-wide | 1f7a03d859bb899682c34524e43eee9e7c2f112e321606375395dafc547ac775 |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-tele | 3432c54862f3894557209fe4ccc8d0ec8ebbbf611fff469e6fad15832aa00e7b |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-wide | 8e2eb431347188bc051280c4f7ac4fccaa0a061d646614e622c8a27fcbffb4cc |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-tele | dbe2b03b366a04b7e71a68b971064d4902bafcfc45e599d6398665d2e1bd9860 |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-wide | e7b404f9edc1090721941c2af7c17978e2e30e7c0678c195524d60ec947f3c44 |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-tele | 558764fdea8f4c197ed57c0c0db9a13fbddd118900747bb838b94194e5a489d9 |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-wide | 0c94184bd4e22f53c1f7d1e46794302b0573f13b95d1ccd034eb1ebee61d021e |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-tele | 29bb0ff8fe3178d12ea0f81a3fc35711214332f134536c2eed3128deecd07ab2 |
| catalog-olympus-zuiko-digital-ed-150mm-f2 | a2ebcad45421a46d0e85fd509cdd35b9a35e3c5f795469c551efd4503b21fb2e |
| catalog-olympus-zuiko-digital-ed-300mm-f28 | 2f6a842154a33c9c4f3115f055d3982212add281b77b08aa8f83fc6a9572264d |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-wide | 1df25a8a8095501c8cf94a56613b997cc98040b4cec9d5d4d25a8d5aea8a7df9 |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-tele | c778b4c003de5eae11fcf448e1129335ac9ff1427a4733fd5be662cbc3336a48 |
| catalog-olympus-zuiko-mc-auto-w-28mm-f28 | 127733a074ab19c244aa60e28f5d5b1dca07c8bd5cb344e8b1021006211580d1 |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-wide | 85729ef630e4ed2725f4318b8702a00532e740ec9a35b9f5ddda2efcd35adc74 |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-tele | 2f0ef95c823c6dad3c3bb6bd59d276eedf940044a2fc2d0ef3f097448c884604 |
| catalog-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro | 5626d7796a50d4d2a355126466d245fb4d7fd01d4fc15b5a7d0713e0de359933 |
| catalog-panasonic-dg-nocticron-42mm-f12 | cb6c587c3f3a4abffaffd87a871788e42e828ec110798250dbd1f802d6dc4d33 |
| catalog-panasonic-dg-summilux-12mm-f14 | d98302f5ef16a3fff18897dc31db42ac2281069ee860ee07a112dc3560da927a |
| catalog-panasonic-g-14mm-f25-ii | c96d6c41832951ad5987e592817b0baf7c383f9ff1557ba2e45a203137f3b789 |
| catalog-panasonic-leica-dg-15f17 | 895af39ab47125c70c7fac53fb5d0979696659fb973e1541fe993b5dedccec7f |
| catalog-panasonic-leica-dg-25f14 | 46e38c6a44bb55ad09093d02d90217392e37e4d9c919f5d29940beec961148a1 |
| catalog-panasonic-leica-dg-9f17 | 98bd55341c436bee9cbe68b367d10794125268e66b2eda139ace1b84560fc0f9 |
| catalog-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois | d41f96d2ad6c7d86e4840fd573281c6fd15203bd22bc8cace60c9f5e3fe5eb90 |
| catalog-panasonic-lumix-g-25mm-f17 | 0906ce1b93497e6a740d3afa6347d3d2e4abdfbfbb0296cc109d9a648850665c |
| catalog-panasonic-lumix-g-8mm-f35 | 091298b837d39403abd0b2e3eb4716c784d8b568ab1b106594966aac2c0154d7 |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-wide | bc2c115a30f8c55d5458ee494b74146168cfe99ab9148d28225ac9c633f1ea63 |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-tele | 23b469c6c100c1dc5de58a8b9704877154026a3ad20bb86f431e31c5fc844293 |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-wide | d754b23ac680ed36314136420974d3fd120bfef50289696e74c6cbf0a9546cc9 |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-tele | ffd4cd3abdcee6e1dd8479eec19083f6130bf8abd77b324b7a062495f40ff837 |
| catalog-panasonic-lumix-g-vario-7-14-f4-wide | 4a2e7b89859de969f650c73ef4089045c71f8404b74f82833399be04f11a2501 |
| catalog-panasonic-lumix-g-vario-7-14-f4-tele | 51229002a7f0389772cc7592afa1da39d72cded299a413f3347177a774c48c92 |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-wide | d756d7942b3bd6a0191ff1a49d6447754940c101548dc1c3c279e91079c859b5 |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-tele | ec01049743ee0103d76c04a06316b7e8b55df57772c34edd2ec36c0712bb95f3 |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-wide | 510d88fb5f789bb160d8ecd6b7ff22e49637f27e4f33b8c6e24882ba1f78793c |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-tele | 31fc662538af6b9602c55303076e57e5773969190e771a15a528df7dd78d3dca |
| catalog-panasonic-lumix-s-26mm-f8 | f67e6c7518a6d16d0e984b6b58058eb59f2c602177049ae2d020be0c1b22f557 |
| catalog-panasonic-lumix-s-35-f18 | c886e8142471639f8a1b760cdd5b22f4cf1221608176bbbd9d76101174b9fdd3 |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-wide | 58beefd3bfe336a4b39b90c1fbf70678e224c8c63ff14f15265c8c9d8aa80462 |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-tele | a21a9368f59a04c9a2a755c167778bc83eff70c144ddb67df5401a9d8984d1dc |
| catalog-panasonic-lumix-s-pro-16-35f4-wide | e592ea9ea916c6b93af4f0dba8f4867e74397a87f096ac33294562b8bfee89a8 |
| catalog-panasonic-lumix-s-pro-16-35f4-tele | e7d4daa20bb33304acc4103a58675fa2e63a84d5028c499337d45075d02e7744 |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-wide | fc124df8bc224d33c807f38f8ff8e9fdfd318b2f5ce845252b6ac669eee6bdd1 |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-tele | a9f4b09627697dfb7ed84de98c7ba54ae7a20daa1dae2ed5023e520ca13bde35 |
| catalog-panasonic-lumix-s-pro-50-f14 | 584afcee21599f70be4fd157014e670ceac03f8d3c7580078cc2c5da7724b269 |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-wide | 030b591333b96664cb8c83ee57d78ce4005dda35fa0ce17274670fd1a5ec5b22 |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-tele | bcc79d356af450daaa8b5caf8e9b436c701942018cfe4ed24ac7b6b0a4b1167f |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-wide | 7546dc5ca48c2f4aadb0851b88e8eb556ac82714c13b1e15340285591d48be67 |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-tele | c4ba2f4967d0a8160d9591161aaff98e14ce2da3b7bb67c56c90c553c67d1014 |
| catalog-pentax-02-standard-zoom-5-15-f28-45-wide | a041f421ab4e970dc5f1908856218ed3a5fcf82d2857a999cd4a456483b4d74e |
| catalog-pentax-02-standard-zoom-5-15-f28-45-tele | 77ef90b97a495e5792d551b901a1cc9d666ea1c747edc513705cbd77716c9aa4 |
| catalog-pentax-06-telephoto-zoom-15-45-f28-wide | 1eefadd6a89636a336ebacc3635a7b67af3d3a3b7c8ef77dd53604144d00f2ad |
| catalog-pentax-06-telephoto-zoom-15-45-f28-tele | d92e8657d4af03d093a524cdbdf3aad34fa48d4c411ddbbc07d6d85a6b327482 |
| catalog-pentax-110-24f28 | 5cbb7b14b9f1c9de3e531d00df4b777c8ddb12a53a4adb67a99aae20adf33dd5 |
| catalog-pentax-645-a-45mm-f28 | 528b11a0f89322c5e208dc02a61063f5e3e8f060bf59a28dfa6166aca032eaeb |
| catalog-pentax-645-fa-120mm-f4-macro | a6c14a24138abc4345336322b0a2eb4d4839f1cfdaf5f036c6b84ea70f2971db |
| catalog-pentax-a-200mm-f4-macro-ed | 4a27a70cf6f14d280e51b603d4a65f21dc5f7e3ae58fc8e5c5752576d08bcfd3 |
| catalog-pentax-a-35-70f4-wide | 2a000c9d611089387e386f9159cee466628519630dbfac52fa87766e00427614 |
| catalog-pentax-a-35-70f4-tele | 5f8940bf8c3fc01d078b2119c9a973c877e9c69bb105f31905235540e2d8f8d2 |
| catalog-pentax-a-star-135mm-f18 | f426feff5edd08a1c8e0bf8a21d64a576744b2e499bfb6caffabfca9d262f657 |
| catalog-pentax-da-11-18-f28-wide | 61a309b09fcefbc458a3610c54a7e112501d2f381526f35d59d428feeae59d52 |
| catalog-pentax-da-11-18-f28-tele | 40f07547aa44bc2b99ecb3d9f10e4d7fdcc4663b0173fa6c2fa803ce33ec5278 |
| catalog-pentax-da-16-50-f28-wide | 33068a0aa3226683cc6de5f0dd02dd8651ae861469c0c7add6abfe8229108128 |
| catalog-pentax-da-16-50-f28-tele | cd9d06d0c6c56aaad24727654dee0154f2aaf24f6ef2c2e4f1ee54ba00759cb8 |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-wide | 9b67a21436a535ac7880af9cc97859bbf461bfaba8db3c96a19ebe779372779c |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-tele | 87bfe370f0a79a290e0ef5ff9c4a15be86643e206c77536ba0db537ff662e409 |
| catalog-pentax-da-18-55mm-f35-56-al-wide | f0db5e3fb9d15220d5b76d40998090589476bc7ac0e684ce43e2f89a6d2ac8b6 |
| catalog-pentax-da-18-55mm-f35-56-al-tele | 2e0663d9e737d23f700fbf0b9eaa651bb08fd5072df70f805970b0c4a1feada2 |
| catalog-pentax-da-21mm-f32-limited | fb9df50fc8c6a48b9dad41ae9d58f37869d8046e2a232b76e0fba1c29604c5a5 |
| catalog-pentax-da-35mm-f28-macro-limited | e30d444cfd012f9a2d94e5de8222e08d3c2f2450848efb6fb29b64b70a605075 |
| catalog-pentax-da-50-135-f28-wide | 7057fa9db22dfd860c244b2c0e6b86c6d2494ed6f89e381400707cc80b3bbea5 |
| catalog-pentax-da-50-135-f28-tele | fda23c7a35347b5605095425e5ce1b58b8a32af884aaa5ccf8663db9f389b3ef |
| catalog-pentax-da-70mm-f24-limited | 0a0ecdfc0b972757e3859638bef02c82b165997a1267a02b46b31596356618cd |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-wide | 3fe5a80822e19e560476f4edf0bc73e3cc9417362b1e30629dbd22e49b9de974 |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-tele | 91a0c928ee5df21d2ba34b854a1d7f2ead61f5001074f7c2c150f0dfa3ec5357 |
| catalog-pentax-dfa-50mm-f14-sdm-aw | 7018e2b14e2b54f8770907c14e4989890d4432d1d9c64a621fa3db83f179ecb5 |
| catalog-pentax-dfa-85mm-f14 | 301ad051427561bfda3f0123aab5d2a5470079b518b191ccdc47e99d21f3bca2 |
| catalog-pentax-dfa645-25mm-f4-al-if-sdm-aw | 9523c64768caa90e878094e6bcbc30dfd251e7208081044cd2dc0e68f0487058 |
| catalog-pentax-dfa645-90f28-ed-aw-sr-macro | 63b88a3160eaf663ec1f031943e223b1164eb87682215739f9f3e0a1b70b9bbe |
| catalog-pentax-f-85-f28-soft | d66dd9ec75542efb39f5a4e56c32ddb40c64d383fb750cc3801f911c53ed8038 |
| catalog-pentax-fa-20-35mm-f4-al-wide | bc612f879766e3a4af651d1fd98a9b25a23bec4b0ef65f0adfe5d28abdcd2bd0 |
| catalog-pentax-fa-20-35mm-f4-al-tele | f201f43cec20910f1718da0a919f8f3a8db8c541d524b965712e31c4f8b0c528 |
| catalog-pentax-fa-28mm-f28-soft | 16100c45341c5054429ce267b35a6cfcde5b498eec27e533287364728acef763 |
| catalog-pentax-fa-31-f18-al-ltd | 2ebf58d627db948b753afde5492fb85035eeb36da13a4f0ef23c76005abcb18f |
| catalog-pentax-fa-star-300mm-f45-ed-if | 81ce253c872d666bcad8cdbceec997ccd3fd36918bec064b85fe60f3b5ff5eb2 |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-wide | b0ab3881aaa201c3b40e6c944054e65bd231703048e9d192c39d4f4a86e70833 |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-tele | 82443c75edce200858af6d066d04db46f5fe3a8258f991ef10b3e7ad485f256e |
| catalog-pentax-hd-d-fa645-35f35-al-if | 61dfdc6d1f3a8f7f2a503ab8002ea0af9f2f987ee15e27b21bcd30fad8b55cf5 |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-wide | 2154d429977afc61d78a8f17b3aaace70cb7c5fa1d4ea71e2bb4291e91b1858b |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-tele | 73decfcf453d0f1708ca060d7c0240df828cdce953e34c861aa6c136c62ac72e |
| catalog-pentax-hd-da-20-40-f28-4-limited-wide | 66919cd9f2378c27847575b233bc9278e4fc0b3b36eedb41e36a1b84c559414b |
| catalog-pentax-hd-da-20-40-f28-4-limited-tele | 5d77033f6a58bfad1bae9317216dcf19cf88c0f1e9cfb2958672470c08b0b6f1 |
| catalog-pentax-hd-dfa-21mm-f24-limited | 7cb8ddd8eb8cc395233afd4e2ace20aa84f43c46208a1866761dbd24c2437aca |
| catalog-pentax-smc-67-100mm-f4 | 2b9846d1275fdf1a54e4823fe3fefa2b1afa82820725b57c3c430c5d3dccf7e0 |
| catalog-pentax-smc-da-16-45-f4-ed-al-wide | 036678c35c3870dc0f113e08595474e877220df53a93759df7807684b4f5a3f8 |
| catalog-pentax-smc-da-16-45-f4-ed-al-tele | bf292181ba48742445cfd1b5cfd8c19cf146626944d0d8a672c29e62c71cd465 |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-wide | 405cdbc17ee75b61eb91de25dac2eae18eba8b2a141a5c917247496ca9a41fce |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-tele | c79f292ad63567612b2cd08360b07b582f8b911e665982ff1d973348447f6017 |
| catalog-pentax-super-takumar-135mm-f2-5 | 9894c9485c2a059a230d8c1d27a3445d948978075bbd6df294a0405057baa93c |
| catalog-pentax-super-takumar-28mm-f35 | db7aa39d7cf6bc389e2434ebadefa7452a67dc49e07696f77e463281c00f22b4 |
| catalog-pentax-super-takumar-35mm-f2 | 11ee9ea8dd86dbb7c641aa8e0df3682728ac5fe8e3d14a09b2a8a627de8c8a18 |
| catalog-pentax-ultra-achromatic-takumar-85f45 | 18dd86f0d2c23e7476fc5517e2a642d8e4c67d3684ad4094c868988dbc72221e |
| catalog-pentax110-50f28 | 39c26e839e5e729ee7f757a1a9ade72cb9fbdbf0b9b60cf9885d535c858dc9db |
| catalog-reference-annular-obscured-mirror | 2857542e5bdaa651e46e00fc573cdd2420dcd17557e9133fdc3b2b295e5bd7b5 |
| catalog-reference-annular-ring-blocker | — |
| catalog-reference-cassegrain-back-focus | — |
| catalog-reference-folded-diffractive-plate | — |
| catalog-reference-gregorian-secondary | 2b814ae9ca557303dd8b2067e7ccd592c16ab688a00125dfbc0d7878b19574d8 |
| catalog-reference-maksutov-cassegrain-meniscus | — |
| catalog-reference-mangin-second-surface-mirror | f858aa329995780c3c826ae88d881184b64b9ecf82cab8908a11d2995a5031a5 |
| catalog-reference-newtonian-side-focus | — |
| catalog-reference-spherical-primary-mirror | b4f7cd82f9493fd554ce2961e81e0b46b25ba5873dc247cffb87f19d5b003d86 |
| catalog-ricoh-gr-18p3-f2p8 | 9309df8183b37e4827d9979d68cf84edf8e29f1bcc991f1bff3d60c45422184f |
| catalog-ricoh-gr-digital-iii-6mm-f19 | ed94d0455c9113b1d1a65ea4a517ed6766bed381b22b6dd825791cf5115aa6f2 |
| catalog-ricoh-gr-lens-6mm-f19-gr-digital-iv | f247ed6b478b78e57179ba56ed2133bd4c2bc35158823406414db3c33b5b4782 |
| catalog-ricoh-gr1-28f28 | 6433aaebc26f8b356a182fbe4c3191a4411dac1cb76388be367b2cfaea079114 |
| catalog-ricoh-gr3-28f28 | dba17fd8e351c9743d4aaf898c71b928057d2ecc0e27c6b6bd217fe9e9f90591 |
| catalog-ricoh-gr3x-26f28 | b99d1637607369ef3904408c02cafba016c2aeababc5abd4a8eefc422b4ac257 |
| catalog-ricoh-gr4-28f28 | 0084151f0db4916cc7162beccdfe288f6cc8bc389d2f0b33a4b91e79acbde4cd |
| catalog-ricoh-gxr-a12-18f25 | 0a5b637c560c20e02c1f0b48ea497bf3774ca40beb36a2b859b9813bb9555ca9 |
| catalog-ricoh-lens-a16-24-85-f35-55-wide | 502142965ef8caa7a74722cfa1823b2466ed205bdf1066af76866da944fb8659 |
| catalog-ricoh-lens-a16-24-85-f35-55-tele | 7d8a651fd304a0f21b580c92b019cc413336fb3cb24128e59305353942943f30 |
| catalog-rodenstock-apo-sironar-w-150f56 | fb2ade9e5ff36144087a770ba06f6f3df9fdcfd6dde9a3206bb412f6603d782f |
| catalog-rodenstock-apo-sironar-w-150f56-a1-reconstruction | 0abaca85be0ac8b92d1ba89a7f734efab8797d59b90304969104db296f104ec5 |
| catalog-rodenstock-geronar-210mm-f68 | ad1a1eda65d6731bb7af90624a17504ecf28675161f50e518ba2a96812a742ec |
| catalog-rodenstock-geronar-wa-90mm-f8 | 44e9003f3b6682943612ee1e33adc3a941a5c39b13d3c6d46684849d43f5f218 |
| catalog-rodenstock-grandagon-n-65mm-f45 | ab03df84f6593b628b8d820a552da59ee245dc340f5dc391c7361ccf9401d985 |
| catalog-rodenstock-grandagon-n-75mm-f45 | ece47e9f960b5a72e49d917b2d82501ea98e2f29df48b539c12bcd4e5c0f45e0 |
| catalog-rodenstock-grandagon-n-75mm-f68 | 4d8bf5615da94d5e19b9e151013785d705b1be7fa90964d4a14da7654df82a0f |
| catalog-rodenstock-grandagon-n-90mm-f45 | 05c1c6246d0ee331bbabadf3348fd50a77eeb42421f2df37288f302f1ccaa0e9 |
| catalog-rodenstock-rodagon-wa-80mm-f4 | 5c7d798171d9f53ceccbc8beb13258200a5ea0f8d801aed835fed96165d373a1 |
| catalog-rodenstock-rogonar-s-50f28 | 031fe110c6b3031772c60ae10a0ea1c32bf0591db54a7ca744222b20c7902e3f |
| catalog-rodenstock-sironar-100mm-f56-convertible | ac6b582611c5747379ea246d231099865fdd09f1ffbcf821c5ce827d3d9f1398 |
| catalog-rodenstock-sironar-n-100mm-f56 | 3bd509ff67708581c8786a68dab370345aacc93299b8d2d156a891062a34c5df |
| catalog-russar-21-60f18 | 45a8491a7d1f700903c972e7fc679aebc4a02dbd7cf1ca9f9fef1eb6faef8d07 |
| catalog-russar-22-70f8 | 282391cb2ee76a23e65f8d5c7c4678c927b010b575652781b3e0a99a0893ff21 |
| catalog-samsung-30mm-f2 | 87817740d267e4aa9415e79b5fb162dcd15d81fd6153407ebc23294c2e68a3ef |
| catalog-samsung-galaxy-s9-main-wide | 9f54f6c30ba3a26286da9a1b16c6d620056f5579e771c55d701ee37e8f60fedd |
| catalog-samsung-nx-20mm-f28 | 432d97349e2c15d02124ad2b454683d5faa615fbc438aa0c58489f3108596fcc |
| catalog-samsung-nx-45mm-f18 | c037142634186852a5820d227b94ce5143915d2f5b9c0b1358fa8f7af77af06d |
| catalog-samyang-100mm-f28-ed-umc-macro | f0904d5d8f9ea9d44cb29669cc9074cf62933772ba9aa2eb10d70293b72a3618 |
| catalog-samyang-135mm-f2-ed-umc | 96d1fbca36627e93b1c7ccbc7dbb6d0467aa50254cc6cea6629b51a315f2c941 |
| catalog-samyang-af-14mm-f28-ef | 489ce87d15619964d166466f62a1fe4371115b6417ed5db9f779f46ee85842b7 |
| catalog-samyang-af-14mm-f2p8-fe | b91b670f60601d7a4050b09703cd22e94119e13b4eb383507862de5940d30217 |
| catalog-samyang-af-18mm-f28-fe | 44f693ae0dcfc7699ec846f90f505fc2de1fc16dafa4da0de3d9fd48ee1c8f6b |
| catalog-samyang-af-24mm-f1p8-fe | 4c4ab04630bd3a1d33afebd9906834439762b24a44f50933ec21e37ba193ebdb |
| catalog-samyang-af-24mm-f2p8-fe | 45a65745450130ef0766a0e32c3c6cabc0ff63a37240a967d91f229f20bfa1b3 |
| catalog-samyang-af-35-150mm-f2-28-wide | 9367183d7818947df3d4b7c5ada450ed336b11115fae419751e4d7ece0f467b4 |
| catalog-samyang-af-35-150mm-f2-28-tele | d07d7a45cd4a1a82583df58ee4033673b1c4e508ca890a8788d72cf716bf036e |
| catalog-samyang-af-35mm-f2p8-fe | — |
| catalog-samyang-af-50mm-f1p4-fe | 22b8cbc4f773d2cac0fa05f0abf413cb803882f37a4d8836fd8d85f1f7f0da49 |
| catalog-samyang-af-85mm-f14-fe | c49bf004964f4dbe8b8dc0dd1deadeb0c74f3c7870328a9ecdc77232f7c241d1 |
| catalog-samyang-xp-35mm-f1p2 | 9c6186fbc861e2eb03a6a4a9e807f9970e70715aefb28688570beeb9a8bc8aee |
| catalog-schacht-s-travenar-135f28 | 6dfd54c4c57eb68de6ccadb0616a0c347ccb2da578880e0e0bf9d7f23e328fd0 |
| catalog-schacht-travenar-135mm-f35 | 37b9d98fe7962d76e97c62f3666b6c1c1b804bfcf791b9484e2600c13a1d33c0 |
| catalog-schacht-travenar-90f28 | 9c24d0aac43ded328acf9ceaeba59abbb8d7e050330563d91c9ad105253e3f85 |
| catalog-schneider-apo-symmar-100-f56 | e08052cc479fc9724d128cf30540b58592cd5d18373feaa15ca9fb5895a95cf7 |
| catalog-schneider-cine-xenon-25f14 | b79d353fe2312d2fa75cbede22c5882cb215d4cc637f4192d0675c60272c56e6 |
| catalog-schneider-cinegon-10f18 | 3b7d75ffd43e187fbf74ab07002cdd022c0690e6df855cafa8a8f5cc1f29601e |
| catalog-schneider-cinegon-65f19 | ea7b45579c542c19e4e3def01fadf2b75de56d4211fb58d533e4971dec9e313a |
| catalog-schneider-curtagon-35mm-f28-gen2 | 3d705941666d619e40509eef92ae8385c78afa74601449a020721f7e8b6e2c9f |
| catalog-schneider-kreuznach-angulon-210-f68 | 67284c4ed9788df58e7afe406395c74e85e5d0ce64a0d54e161330b4f4f01381 |
| catalog-schneider-kreuznach-xenar-50f28 | c7da3db375beecebd537d4ca133952b9952c8d4593ea42629943455b029759ab |
| catalog-schneider-pa-curtagon-r-35f4 | 25805189607b99d6b1adc4c14931724e37a6f2583368d538540eabbdf75e9c6f |
| catalog-schneider-retina-curtagon-28f4 | 11a1df3556f6fa92a2d9b2c39a46b614fcc361933303bb84f4ce2390d37f7987 |
| catalog-schneider-retina-xenon-c-50f2 | 146f2c883db309a40267107521b216eb31a1880ef7011ce5c6378074eb3aad86 |
| catalog-schneider-super-angulon-75-f56 | e03b94c8ff5473cb1dc9b9e1ff6a272219dc18eb10efeafb07bd062ce94dc358 |
| catalog-schneider-super-angulon-90mm-f8 | 6699b03a2337397e418e4647d2dbfd49d0bb2977586815e9c3b99af0d1676e7d |
| catalog-schneider-super-symmar-hm-120f56 | 6bac2b4506c9caaa5da6d8a1e07eb952e3c6b8e8756b1238c4b33928991274b2 |
| catalog-schneider-super-symmar-xl-110-f56 | 4160233fae7f9b01ed3d5ac990336fde7b6f40937fbbdb893dc4f04fa550828a |
| catalog-schneider-technika-super-angulon-75mm-f8 | 7f3640b80fcaef8156a005bb23d3215d1ebe1e6f3c20ca95a31993c83e079d2c |
| catalog-schneider-tele-variogon-80-240-f4-wide | 6a337e6415a084720fb8283c00fd3f3da410e281ae54e412b2a31de936db1ec6 |
| catalog-schneider-tele-variogon-80-240-f4-tele | 694ab2c8a86cb25818c3c19512a12d53a0101296c56043e4a04b1a9957be7746 |
| catalog-schneider-tele-xenar-180f45 | 4a93ffae54003121173e179ffc6842864c8480be3ca885d4ecbb7d8110e6f9e6 |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | 51044593e326e7fac3ea827ebe88a917a013b5cc9cac444bf9651bda5129799b |
| catalog-schneider-tv-variogon-20-600-f21-66-tele | d93c665ccd9b563e3aeea833a41f698503b4a10752a8f5671369271d34cc9a5d |
| catalog-schneider-variogon-10-40-f28-wide | 9baf347911a2e4970a49c2aa76d719cb7098f1a0335bf6a87738417063e1b734 |
| catalog-schneider-variogon-10-40-f28-tele | 48c18668b02efea33398f02adc7d87c99013c1574845ef3792495c10132f4711 |
| catalog-schneider-variogon-45-100-f28-wide | de9aa8812740f892e494ec75f11ad5299ab3a93b6c43b8abc437420fa01449a3 |
| catalog-schneider-variogon-45-100-f28-tele | 4ee682ae41a9a97bc8a696ecaaf36950249b23c942f93849d0e9ac3c71ec9a67 |
| catalog-schneider-variogon-8-40-f18-wide | b5e4632d9934eaa8d66dcd7ccef62de9e8d87b8de0bf39cd5a7cad457db63d3e |
| catalog-schneider-variogon-8-40-f18-tele | 1ac1f9619e18d369cbb60e1f05cd14690deee1fa77814ab57e448a19fdeacc62 |
| catalog-schneider-xenon-50f19 | 486a26089d712c7cf6c8c321c0161f1c66769332770744c90b165ba4fbeecafb |
| catalog-sigma-10-18mm-f28-dc-dn-wide | 9aec3019ece495d61cbb944de7331c7ac810f565145ccbb3ba0043227b0829f3 |
| catalog-sigma-10-18mm-f28-dc-dn-tele | 147fabfd69672daed5220a93b89d982970c2dbbfdd7137add7b2bcc01e2c2bdc |
| catalog-sigma-105mm-f14-dg-hsm-art | f4cf8e463a2b4709318f90f4bd9792ce63cd43f15efd057fd4e5ae1c5615814c |
| catalog-sigma-105mm-f28-dg-dn-macro-art | e11ed3cae518f0c789667ce443bee69fbbe7fadd303e7a960b052999300848b1 |
| catalog-sigma-12mm-f14-dc-contemporary | 927c37c0ca67602f9291a0a72777acc8f6d547e5950327607e9bbfaf14471608 |
| catalog-sigma-135mm-f14-dg-art | f481feaf370ec82d322f5ec2a61a9c46ee95d9bd2abec573accdbfbce0d0cad2 |
| catalog-sigma-14-24-f28-dg-dn-art-wide | 6f9de0d554714d2a25115ac4ea64905efb8631b2f58f1adc6c3cbec65a53fe2d |
| catalog-sigma-14-24-f28-dg-dn-art-tele | 3766ce6e6504da184ee27fbe8621d5b3ece422b63032a9e99e7377d9c2a1b4b2 |
| catalog-sigma-14-24mm-f28-dg-hsm-art-wide | a2536e4980cc4c24d95792dc7f7891bacad483488994562cb5515cd4ab8ab21c |
| catalog-sigma-14-24mm-f28-dg-hsm-art-tele | 4ccfab6df20baae0fb6506368c944bbca08ef0ced9493629eac47286c331fd5b |
| catalog-sigma-15mm-f14-dg-dn-diagonal-fisheye-art | dd14012ad38cb9a2881fc65710560ebe02cc45057264031e93ef36f54dd3e9c2 |
| catalog-sigma-16mm-f14-dc-dn | a1cf2426bb4c1f3cb7bb083ace8480938fd22d3c87afd7063697be1c475c2b49 |
| catalog-sigma-17-40mm-f18-dc-art-wide | b8e1efc3b14fe51c258c1ad89b84ee1e26e46bb8034bc3508779c8723ccb8c8a |
| catalog-sigma-17-40mm-f18-dc-art-tele | f66d7cadec451f1845a6a75e7116c47c5729204fc318bbb224efbd057716241f |
| catalog-sigma-18-35-f18-dc-hsm-art-wide | ed206fab7300a51a1899d35b6bd1af3478345eab1d65a61017c99982bf050ce7 |
| catalog-sigma-18-35-f18-dc-hsm-art-tele | 2cdae2d4b01d5cecc6b9fa4bd3bbb72615eae64409cabaca7cba688e057d6108 |
| catalog-sigma-200mm-f2-dg-os-sports | ef09621c0446eb96effdb9233c1667998ced6e12f84355f5e7d9bc189b26ad25 |
| catalog-sigma-20mm-f14-dg-hsm-art | 361ecdf7c385bc051e8b7502a0916a742b29de807776b98521b60848fa8201fe |
| catalog-sigma-23mm-f14-dc-dn-c | 8920f93194f1f5f5692e22e712ef5a904ef8af1780ef4a2e86573425782eabd8 |
| catalog-sigma-24-105-f4-dg-os-hsm-art-wide | a3a8035eb435884d84564225caac365e2d3626c4d2e76e39186c8f0194be38bd |
| catalog-sigma-24-105-f4-dg-os-hsm-art-tele | d2f0876b88555fc4ed3d331746de4a741c17061234c0a7dd2daf152be205c30a |
| catalog-sigma-24-70-f28-dg-os-hsm-art-wide | 22a9cae81ce4ae61dd3f8b86afe6e5457a98cbce113ba6c7ac5b7d3bd8f4b7df |
| catalog-sigma-24-70-f28-dg-os-hsm-art-tele | 2bff0d7a6cbd587a818b1f09e10aebd85ad125484eae513f78d129d8e45f1fdb |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-wide | 314173bfe9d9b23be8977e575a0ec1f59055ca297e3d5342a87d71af658d996b |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-tele | 623d8404d034e44fbb1bb1965fac2b1104b30a955a088959d27f475d4bd510bf |
| catalog-sigma-24mm-f14-art-dn | bfe30676a3e6f72f5862a2a54f52eeffe15f03e0f31fc4948edb2f819e3185b3 |
| catalog-sigma-24mm-f18-ex-dg-aspherical-macro | 9d766b3c0d190d5d7b8a334242728775263cceb4aa88952ed901bbd0f8421470 |
| catalog-sigma-24mm-f2-dg-dn-contemporary | f380d071333a068f697a756567015577e27ccab6db8484ee1a19288b4f8f773e |
| catalog-sigma-24mm-f35-dg-dn | 60215f518c4675590e72fc4e5bec2de0e0676aacb05347f7b09134b987cffdc4 |
| catalog-sigma-28-105f28-dg-dn-art-wide | 8ea049bfbf079c949d330fb5b8214962f646d7443a5a6292641fdf6677de2db1 |
| catalog-sigma-28-105f28-dg-dn-art-tele | e51ce120233fc203556f66511395fd6aeed8c0b6a55d5a144a3404804c8aff01 |
| catalog-sigma-28-45mm-f18-dg-dn-wide | 7cf0e9ea2ffed74a06b2ffeb87d996475b4d7f3e8be05a59a42c56a5cbe5fc13 |
| catalog-sigma-28-45mm-f18-dg-dn-tele | 688bd093147e4b6a8726a42ad9f4339dc0f86b4bca46a681eff9f8759c28ffc3 |
| catalog-sigma-28mm-f14-dg-hsm-art | bf17a2eb986320ab0486688b5c95d9da9c13d5999dac38ec3a30e6e1b04a4767 |
| catalog-sigma-28mm-f18-ex-dg-aspherical-macro | 7d96271864d02183585f381303593cce3b2561ca548138363a0b299755bc084b |
| catalog-sigma-30mm-f14-dc-hsm-a | 37fed54be1c7e0310e9b4f9aa4b34f8dc130c1a048404cd3f9d186cad36943e4 |
| catalog-sigma-35-f14-dgdn-art | 28a559a5e4ba1ac5fbc48710e9e97ad6f6b61830182ea5857b8825201626c258 |
| catalog-sigma-35mm-f12-dg-ii-art | 87e092e584592d3e2b17a48a2a5880920e40f30c4ef5bb4d35e457941856cbd4 |
| catalog-sigma-35mm-f14-dg-hsm-a | ccc14e33b434a6ec5fa8af08a14217b9ff7dc32c9d4f8b92125186fa3a45c97b |
| catalog-sigma-4-5mm-f2-8-ex-dc-circular-fisheye-hsm | 7b740439920b6292838d4f380d6ed49ed8a1c359f979d545964c413fc9773d74 |
| catalog-sigma-45mm-f28-dg-dn-contemporary | de1fd91c6b96ca5484034ae48a27924000fb59f1e8f719f78e2ee193da29d561 |
| catalog-sigma-50f14-dg-hsm-a | 85b3b8209a63d35923af73f26cfd3445bd31b6408202ee638394cacd045e2e9e |
| catalog-sigma-50f14-dgdn-art | e498bcaa86012335b34155a1bcc6208c215f91b82dc2327ff6d48aa067195b60 |
| catalog-sigma-50mm-f12-dg-dn-art | 318a875ac95234f2e2fcb282c4bb075142978b2cf5213706d7497d2ffd417227 |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-wide | d6e4e9caabc985a3fe4456e4efd0ab3cf3facb6706336a2060e286e318e837ad |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-tele | 094034b64a0b85809c13ade58294555bcd7fbd016e5ea925d6db16f9539047ad |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-wide | 79ec67b04c302e22ec8fba8047d9dda7c64b76c4f81e218a68d0f2860c0e2754 |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-tele | de728187104111f6ec5bbfa038684c2da40f0246504b4a01e4c93db2efa5c1ec |
| catalog-sigma-60mm-f28-dn | 8866331206ff010db0623abe98183b4ce082bf9ef9a22c178eada89472e81120 |
| catalog-sigma-65mm-f2-dg-dn | 7ec4dabd2a2c1596d6bbd60f490430542221131e7971cb5403d37db4ae0e40cd |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-wide | c4bd01a6db3393d54ce5a445633cddfd90e1a6b08892a23ea56c91beb05e99cb |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-tele | 3716eeebdc91b2f652150478d5cb603462bf29d2ea73693b033343caee93773a |
| catalog-sigma-70-300mm-f4-56-dg-os-wide | e6b6ed3b9359c19d15a7dcd5e3777184aa907d733604ef5fe5bbd23a945c71aa |
| catalog-sigma-70-300mm-f4-56-dg-os-tele | 20bbe0e807dbcb474db520f7711c74690fe42298773d01ef9610a3c29de01fa6 |
| catalog-sigma-80-400mm-f45-56-ex-os-wide | 720e57ba84ffb74fc305346e3da89883c9a17fb8b3fd8201c0f3f3fb63a3069f |
| catalog-sigma-80-400mm-f45-56-ex-os-tele | 9f7dbcd12d21c3a05feabd4678e94fe5ac586eaa58252edc89823439b2fc73c2 |
| catalog-sigma-85f14-art | 84683790ce8ec2367077b1223c94db810db8671f4d6bfa23f14d057158729cca |
| catalog-sigma-85mm-f12-dg-art | ffe4cd80e8db6787b6fd23185c9991561eaad7b76d2f0b9d3a95dff913fdfe67 |
| catalog-sigma-85mm-f14-ex-dg-hsm | b335acc7dfe5b652134e45f74772abe7d7680774157ea3a208770cd4542bb9fc |
| catalog-sigma-90mm-f28-dg-dn-contemporary | 2765d3c83260c5529f68b1c2f1ca006db58818583b17d42869ff5c0c39875137 |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-wide | d3fe0738604dad18d743c97cac29c16fd5a911cd6d4bdbb2b8c2ce75655f7b0d |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-tele | e6bf8911a1606d898a600e6a6b21b3cb9a9e298b969f8cb8cb1ed150a26cd9bc |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-wide | ed8a1db0b2eedc33501a3edfa024bfce3d6c05503bbfbc90d3c9e92b096a49ce |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-tele | 0fd677dc039325bfdbb5a065034c1a31e5d3c737b77209d2f3144a0715064588 |
| catalog-sigma-apo-macro-105mm-f28-os-hsm | 29c90a7cbdc7e385bdba82bb5a825f5f552bb437a27db636ad80df982bce1986 |
| catalog-sigma-apo-macro-150mm-f28-os-hsm | 2f8ff6c04741b96b329b7009a62702f916df6c634da01bb16ce079a6ff78e1f1 |
| catalog-sigma-apo-macro-180mm-f28-os-hsm | 911ac2607f48acffbe63455b5ed2c9088a912d134aecb4dbd4f89f6fe5b311c5 |
| catalog-sigma-apo-macro-180mm-f56-uc | 26254d101179bf150e8efaa22a6e5d4aa22f65a849f4313823f1706a23cdcaee |
| catalog-sigma-art-40-f14 | 4e98b7b0cee6a28908f8e749f6e239965dc9bfe1dde4192e1ee2188acd07e625 |
| catalog-sigma-art-85mm-f14-dgdn | 4a8a452f13ea10591a082f6d9ad0cb15b8b210ed520042e6e69d55d935dc70a1 |
| catalog-sigma-dp0-quattro-14-f4 | d6d87ddbab68e59de68524af2f9b06a20299c1246bad1b7311fab0c81d1a253e |
| catalog-sigma-dp1x-16mm-f4 | aeea8d8d9396e652dac824806f67a14826fd44c2974964b77424d5250d6c3cf5 |
| catalog-sigma-dp2m-30f28 | 638a0765d97dc08207ee0e1bd3cb045bb181b825b790a524acaaf44bdf9302bb |
| catalog-sigma-dp2x-24mmf28 | 2cff53b99a7c90fa7bcad7c570f7d2a433c50998f447d2f5293ff52942496f1e |
| catalog-sigma-dp3m-50f28 | f017df4c14468402675b4ea05396c213da0d971e280cc1644f261b570ea7d15e |
| catalog-sigma-macro-70mm-f28-ex-dg | 85068ad313133a8f8e79c1b52cdf85bdf0c1cc10f0423c70ced32adc9263482f |
| catalog-sonnar-50f15 | 4065a400058243cd2b4397eaeefabbb6c6b633847bb8766b2a01e76544bedb4c |
| catalog-sonnar-e-24f18-za | 6233350d7e7426f68a92f13fa6ef83efd9cd3d9231340348f76e9fa69c4c8d9a |
| catalog-sony-dt-16-50mm-f28-ssm-wide | de8cab9d1d2de375f4de8ba65124157b2b7e09b0c8bb4b123636e00e9807d081 |
| catalog-sony-dt-16-50mm-f28-ssm-tele | 00f8654523e7ba30cc384e4290c2f00d2a3cdf97ce5b1a500b6289172d49baed |
| catalog-sony-e-18-200mm-f35-63-oss-le-wide | e8f25907821705263e701fbec6ac51c6b188feba0404f9929006fc77536eb2f9 |
| catalog-sony-e-18-200mm-f35-63-oss-le-tele | 89b3e2726a335a90d86e3aad9bb6822d6084085bf6ed88be71f7b6c9367400fe |
| catalog-sony-e-18-55mm-f35-56-oss-wide | 52bc393e07f7e0447038b8513470e9a529a60e121919db02a49708f523d631d7 |
| catalog-sony-e-18-55mm-f35-56-oss-tele | 93046a95a4c6957c02e438d5b7ba6380f887f5eaed057ea79c2559e264744a21 |
| catalog-sony-e-20f28 | c688eefa1e1541c0407a5fc7658935797146cbd89ba7d0f680a114238d9850c4 |
| catalog-sony-e-35mm-f18-oss | 9a2543ee688938798493bcfd443b62b894db841f238a0b3b51d0b05e152620c2 |
| catalog-sony-e-50mm-f18-oss | 4da3ff865593d49fe99f1d6fb38a666f8268c560478c16f4b2c201b7d79293a2 |
| catalog-sony-epz1650mmf3556oss-wide | 9feba2c13c505c83a2d776f7be629fee3f0d3d463c5db636f29a3756ff91773f |
| catalog-sony-epz1650mmf3556oss-tele | d5f1defcb56ea97662ae1b7c4386e640d07d19aa928f47d2cda8763da3bd0918 |
| catalog-sony-fe-1224f28-gm-wide | 9b41eca500e9e91af14404ee69924dc562df5c3d7bce68272aad538ef9285b64 |
| catalog-sony-fe-1224f28-gm-tele | c30a62398ebe9298252fbcf0e776abff222d91911239acaa8565f9ef5c56a358 |
| catalog-sony-fe-135-f18-gm | bf766cf229ef4620f6d61830a3bbb07ebad2b35477d8f4ea6fb2788b936522ff |
| catalog-sony-fe-14mm-f18-gm | 80ea04bc7985415b325cdf9f5164a8182566eed8aa02708d2e4650594a0accf4 |
| catalog-sony-fe-16-35mm-f28-gm-wide | e12f65869a7030524e5ab8c4171fbbcc105866a243bd609033625c8dcd3d0fb6 |
| catalog-sony-fe-16-35mm-f28-gm-tele | 2240a024b2a108f27f1b10a504e8181a9018e81334be09734e690f6f983dc7e7 |
| catalog-sony-fe-16-35mm-f28-gm-ii-wide | e1df7a0aaf7232b1cee3dd8530f63873145cffe30d87a10f98bf34d8a6fa04ca |
| catalog-sony-fe-16-35mm-f28-gm-ii-tele | 5819df8fe0f84398d61d4307055732206aceabd65a92384e538e7217b1613228 |
| catalog-sony-fe-20-70mm-f4-g-wide | ab99917e619cf57829d707b03786ad4b959a2204407199dcc4a91646e0d6da40 |
| catalog-sony-fe-20-70mm-f4-g-tele | 2a672e4532f1998c5717b88748d5bdb5a043dacf7b37e148f99208133bde3606 |
| catalog-sony-fe-20mm-f18-g | 2e2afa23bd756f5a1091b5d7f1e7f85e104c97472530f52a0ea0076b336b4cab |
| catalog-sony-fe-24-70mm-f28-gm-ii-wide | cb481cbe78e3231662a3c7673d646cf3d39df91bd723bd32aa32819684abd9f6 |
| catalog-sony-fe-24-70mm-f28-gm-ii-tele | a0ed87d2c1ad5b1cb60409447a4e6b784adacddd8082b9ca57ebe0f35fcdcc3e |
| catalog-sony-fe-24-f28-g | d08ffbefde92f3fe01e08f7f70ae059592f122c9eedc5436ef1a608342abc0dd |
| catalog-sony-fe-24mm-f14-gm | 1c65fc9c7e5715f299f8eb49db8c2c59087dddfa3c065df6bf508629da2c083c |
| catalog-sony-fe-28-70-f35-56-oss-wide | 5f76174aa70864aa43b38b5026069db7ab49dc672e1bce51c416ea30f653aa4b |
| catalog-sony-fe-28-70-f35-56-oss-tele | 9276042cb36f5f96c595caed5d8be2d185618ceb7cc8a4aedba36c0044b9adc0 |
| catalog-sony-fe-28-70mm-f2-gm-wide | 25f2f293ed6977e97341bc635fcb53c5bc52b7163c77cf4e94b3b71d9364c694 |
| catalog-sony-fe-28-70mm-f2-gm-tele | 517519308bb2e6d9c4f723ccf0f0e8d06c9d3a84a62c43d6289248b11546db96 |
| catalog-sony-fe-28mm-f2 | a83aa74595fe01cf21be4bb7750bac00e3811d3515480c8ecb8c9055461fd370 |
| catalog-sony-fe-400-800-f63-8-g-oss-wide | 234b40aaf50d471ea1bfbd7bdfd36c351eae7abfa7a2faa784cd7687b2b407d5 |
| catalog-sony-fe-400-800-f63-8-g-oss-tele | 7b70ecc9a6ddd2085d486da9677a977a4e8a6e99ead8ff78639e93e988f63175 |
| catalog-sony-fe-400mm-f28-gm-oss | f0819763fb3976af512ce84e17ce149008c06fed4c2f0280f03abc3fe7313fe8 |
| catalog-sony-fe-50-150mm-f2-gm-wide | 191ddee1ac4018e8ad96772f6ff2539ecf4028f7cad8cf5bf7f3c85e65dd089f |
| catalog-sony-fe-50-150mm-f2-gm-tele | 74f32e3cb5f845d5f6dc57991c80441ed98c191a0ea9c8475e9d33c038019e57 |
| catalog-sony-fe-50mm-f12-gm | dd3d57efa4713b8c7158dbde22e1e5584ce3c73ce0434940a57a1859418e4165 |
| catalog-sony-fe-50mm-f14-gm | a846996ae60d011b547bdbbe2d2d1a6eb6d74eb66d07b00d1d5acdbe0be46294 |
| catalog-sony-fe-600mm-f4-gm-oss | 18561c43b997c6493e7b0ad7da2c1d565b5316ccbfd0cb4d70b1eadb17d0286f |
| catalog-sony-fe-70-200-f28-gm-oss-wide | f5817977137dffd27f5a2440fb940b97cae6424096108f07566bd519572c20dd |
| catalog-sony-fe-70-200-f28-gm-oss-tele | b4bb6de4a24710fff6bbcf0e3254ca94bdf3e86e36e4b048f242737c9417c761 |
| catalog-sony-fe-70-200mm-f28-gm-ii-wide | f980bf777ff1232335f1f687a77e3154e916e0a63e5dbb2229962f929fac286f |
| catalog-sony-fe-70-200mm-f28-gm-ii-tele | 188fd362c0dac48d66a3510cc2aaf414925e0389c229d63a4e00245706fc369b |
| catalog-sony-fe-70-200mm-f4-g-oss-wide | 2d05a8d0f8c11aaaa5a1f005165a10799e05c7b64c02bdb7f19564b0543876ba |
| catalog-sony-fe-70-200mm-f4-g-oss-tele | 51b4c2df1e191ab32d8f2ec918adeffab5afde4ca74a7b3604646dd0e7a52813 |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-wide | 1781d3c08473875d8cb866da013766ade6b3115e8af46cce407b8183796cf743 |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | 3afe1c6f8b4102eb3d99fd44b54f08a61bd0a9f12ffb49852b2a8bb85ee84082 |
| catalog-sony-fe-8-14mm-f35-fisheye-g-wide | 1af7934979c31129fe0a41c22ec499956ccd36e4e58ce9cf52bdfeddc2be403e |
| catalog-sony-fe-8-14mm-f35-fisheye-g-tele | 032fd73a880f1ff4edb6ca3b1d131855e36ba8fcc87a23beb1c0052806ed07b6 |
| catalog-sony-fe-85-f14-gm-ii | e05bde2ca73879f942445b93685884ebb81c4e22e94a24f5346d8a0535affeb0 |
| catalog-sony-fe-85mm-f14-gm | f44b3596719dd0987db5a84ecdee4d4d4b85cc9083295266a4be1177821510bd |
| catalog-sony-fe-90mm-f2p8-macro | 48a313f1792a1dcc7aa6a45df40ee30ffabd2fb4934dc4e277e8691da4709dfe |
| catalog-sony-fe-pz-16-35-f4-g-wide | 3b51a84806163164319e044356b711d6e4f7ba238edd9f637fc773145356ee4b |
| catalog-sony-fe-pz-16-35-f4-g-tele | 6ef702413b0af24c5f7177a1839229fc8a8adc1917ffa8cdc380564411c3d41b |
| catalog-sony-planar-fe-50f14-za | b1bb28bd8c2385b96a3b480a99829e2a1723cc3a2634856a2d6e657a68c4b9b7 |
| catalog-sony-planar-t-50f14-za | 7cb215e35223f8c77cd42e31b32843ce6f3196fb11372b7f574bc189a76f2389 |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-wide | 051412673bebb7f2a32362a9963ef91fa220d413b71e02de62d2c892f32c8d2d |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-tele | 3781277bc6ba14f5feeea1cf01d624f453cf45c9743c680f91b203085aacd26f |
| catalog-sony-sal-70-400mm-f4-56-g-wide | 74f0fa8b369a0c02ea6216041aaf3e049e5571a1383e938feeacfcee45a6fb81 |
| catalog-sony-sal-70-400mm-f4-56-g-tele | beeea6862d9ede99fb3b3ca35b607043309fa78deb94a45170daeb8231575f2a |
| catalog-sony-sel30mmf35 | b728e1c4ace3f2d98483e67229e7dc91b666d1c01ea8d39ce25a07dac08ffe07 |
| catalog-sony-sonnar-fe-35-f28-za | c585c38e689c2df58d333fe15a5e655249e453e8afdd6ce59fa582b3f704fdba |
| catalog-sony-sonnar-fe-55f18-za | 3da2be31d0dee35e14357387aaf5687ebaadadd71d89c14be9672beaeb432da9 |
| catalog-sony-vario-sonnar-88-733f28-rx10-wide | d2b1e2d5ec0185647ab00b7ad061350e14fba6a4f25c2ad8d913e5bad89ffe1b |
| catalog-sony-vario-sonnar-88-733f28-rx10-tele | b3b3f63d910790e275ac599cb94963745da02535cc363695b950e05734b22790 |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-wide | 18d0d8d018a06434bc299a628cece945d3a6d87c0c592dcedd56ba3afff267d9 |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-tele | 24c7c884126d9e418f580169db34180ee162cb65c12fc2a3eb75058bbec935cd |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-wide | ded01dd0a4691231d4c67d4db256b732d76bf811b4cf00098084c40448a0d48c |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-tele | d638406ac1d49e2a500475b9486dceff6a7720d365bb996db0f0d9e3eafe62af |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-wide | 2600bddb538cf55752c5444071e55e434345bafd71d116ef32c2ba4d39984656 |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-tele | 73943efc8e0a86d4da73a0296adf104bfec7e0c0cb6ca062de5f90a2351db60f |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-wide | 697c45398b0db7e24b90b9413ed1232e747b75688b49f88ed65f6c52c84212ad |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-tele | f9102167a6802f809351f69f97a7fb268f61ab8a9450aa7f1d2cae9adc6a1cd0 |
| catalog-sony-vario-tessar-te-1670f4-za-oss-wide | a15235f8f60971ad88fa11b645feee377e39928fd6e628f4f1c8c38b3a639ac0 |
| catalog-sony-vario-tessar-te-1670f4-za-oss-tele | 96f6b963b8b955fe657d22f4f4bdd1bf984698104b15f093c7b7f1f3ec99a4c6 |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-wide | a6f79d3baba03d1b7fe7a9a9b3588e2a05c6d286f01dfbc9db5bad0758b7fb66 |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-tele | 64a16c2a6bfbbbe684021a7b17b919b5d58f8e9d9266e6b4c40c2eda7a508d61 |
| catalog-tamron-a001-70-200mm-f28-wide | 3448701cbadeb0a61c1b7f8aa5927a408aa000e1a341c83c71883141634558c8 |
| catalog-tamron-a001-70-200mm-f28-tele | 1cde304029759a34d5ce1eed2a6047efdf3f6c73598fb824ea39bfbe431b63e5 |
| catalog-tamron-a005-70-300-f4-5-6-vc-wide | d5ceae48c9e144e41f9c2d00f732bc9e8c78b8ee74ae5c1a516bb21336d8bc82 |
| catalog-tamron-a005-70-300-f4-5-6-vc-tele | f55bccb1c30107543e146337f5343132be0357dd5603bd8aa5b10801324e4d84 |
| catalog-tamron-a010-28-300-f35-63-wide | 5503fd824627c74f7ba24b33a54548bbc52c8f86b24443354a6d0fdeaaf281e6 |
| catalog-tamron-a010-28-300-f35-63-tele | 6b2c9de802078fbba173bd7a69af6017d6a9c43255d153f38cdb4f7221f4c406 |
| catalog-tamron-a03-28-200mm-f3p8-5p6-wide | 0f96dd57e800b0564a1ddaecd4a8382c73ed5c3fbea3bc3200e5ace0a84e9ea7 |
| catalog-tamron-a03-28-200mm-f3p8-5p6-tele | f07753088c19eeadf5e09671c864c09872642505d2f6ebb2ddb9c2be902d3403 |
| catalog-tamron-a056-70-180-f28-wide | 115ae20f518e5061f1e4a07eb3a25da7e4716e866d186500a2653def42147f42 |
| catalog-tamron-a056-70-180-f28-tele | da950ebba6c9b83f63438860f7569f0ed9ebda4fee4a6daa0649c42b0984c9ad |
| catalog-tamron-a061-28-300-f35-63-wide | 0c93cc2c383f3252fa02f41e4cb51f39173f0d4c2e3b7da6dd19d50a3a72438e |
| catalog-tamron-a061-28-300-f35-63-tele | 398af58d0f4cb5c4de0b7f058051878c13118a2618e015bbf81f25a46c152a8b |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-wide | 9dea625657dbf71626ef9bc158d4c13e251bc1d3fc5d35f11fb58cf5a0caf686 |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-tele | 6891c92425b964f337ccf0c58d24a50542393455dc52a09bfbc09d553814272a |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-wide | 007ac1ee20663f70629e8d900d25786241f6513505ce5275ac7cd3f827acb483 |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-tele | 8d891b4e3cba485ee7f398e34c6c906f9a60349cbcb06267e58a6469805f6e1f |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-wide | 541e5687d99df2c54a1c237e6e5581416ad78487587acc603aa439e9ba3def68 |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-tele | de440ebb83f26f6f9e71d119c58447aaf28bc70bd0e3b2ec4829c243a53b7d9b |
| catalog-tamron-a08-200500mm-f563-wide | 7b7bb9a02a5b402ac037b2893f34722ced8580b2114d81484f2dd3b472de85f6 |
| catalog-tamron-a08-200500mm-f563-tele | e4c464597552d51b6ba9bde475daea1662d14991ce666d696b6cd66c40b10972 |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-wide | ceb39d349426fb12191d69af4948459687c8b148e03a8073c8be3b3f9dcee4d2 |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-tele | 5565d1fe7675ca4ca9be1f9360a2e26ad316336d78618b798eeff788b355e3e5 |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-wide | 50c1abd18540d91b3fb648607a2e0ac7d7e2be683402080467e6796fa46bec5d |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-tele | 368cea217ad27894c466055fbb58c32972923856db703be3e86ec8990f92563e |
| catalog-tamron-b028-18-400-f35-63-wide | 1b3e0d6614457b63380951e9b199bf731b7cec4533b4e2f528db930d7cbe97ba |
| catalog-tamron-b028-18-400-f35-63-tele | 5f8027cfe07c974c60089d94a6016680827b7583fad4b1cab45b61fa65875fc1 |
| catalog-tamron-c001-14-150mm-f3p5-5p8-wide | f0e3f77b660b8ed888abbf5f7e8fc07c1bffd99c48ae1ff35dcf561d2cc2e86a |
| catalog-tamron-c001-14-150mm-f3p5-5p8-tele | 58a350a475fb279764be62888bd2ae8f15a740876c3f7a560fd8aed7328dffef |
| catalog-tamron-f072-90mm-f28-di-iii-macro-vxd | adeccb6d3d27938d9b18a9f2bd4a5009e29828a32661564f7925cb38b554b6e7 |
| catalog-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004 | 51f7598b1d9051fa6a529ba845cfc16830be012243262d5fd789e5ba64378a0e |
| catalog-tamron-sp-a007-24-70mm-f28-vc-wide | 26060b4da9e09cdadaaa8a80749b739f876e7841068ffdcf35714332d87afd53 |
| catalog-tamron-sp-a007-24-70mm-f28-vc-tele | 97302e16bf1b624a05307be276bf9fa166f388bdd3ae11d674d01bb0d17efcc0 |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-wide | 9260b70f0fbdaa4070c957cad040f80f7b9b90861708570a890466284e881381 |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-tele | 9c9605018ba4895be36ec6d47264f0c32681045ddfe3e5896bcf67f589ac5ab9 |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-wide | f7054d589a0d1e8ee5931dd4ea0bb96800fcd46a939bf23ad1c3f2296705543d |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-tele | 4490497a041d7eba8713838769ec20569bda57c057ef25eafd3b35edc756995b |
| catalog-tamron-sp-af-17-50mm-f28-a16-wide | 8b6b512ca058cfafeb34967570ac9f820e5547e422e1d023ed236db5188c8335 |
| catalog-tamron-sp-af-17-50mm-f28-a16-tele | ace7dd4e991989f132a0c9cb50362ae9a90caa71626df684739f7d8204702425 |
| catalog-tamron-sp-af-180mm-f35-di | 89cc6b7a136d6c4979fef0c748f823369ffc4054db3125213525a71a2e00663d |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-wide | 37f21e5e7d472cf383c55e76b89a3f51516f20ed87ececd6882fae7d7d699212 |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-tele | 2b65c60772ac9b547877f8fa32a73397c256cd96466b80e16beaba9574da7848 |
| catalog-tamron-sp-af-60mm-f2-di-ii-macro | af828bd49b1790f60fd9f57a8931f79e72e16e90fa7ef914a795e1536f961f5c |
| catalog-thypoch-ksana-21mm-f35 | 72278635a49edc72fd474edcc62c0b78105ddbdd812493435ab6882ab92a801d |
| catalog-thypoch-simera-50mm-f14 | 4ac23342ecf152b70fa4d013eb213a553b8bc2a2168d5887642b490573ad8b5a |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-wide | 8fa21eef9a0fee97839d7b2eac035211c82a48b172b47c42b6cc3af177d5bed5 |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-tele | 13afa0553437d83745163f69806aea603f092e65589650e5aa19262ee4630b95 |
| catalog-ultron-28f2-asph | bdade4fc699e186aa8f597a454e2d6f18a13dc6224ba7f819bf49a0ebdb33ece |
| catalog-ultron-50f2 | 412a5a06d27927ddee76ef4cb92f0b70ded061a6f5cd3471791a9305e18f6a9c |
| catalog-vario-prakticar-35-70mm-f27-35-wide | 40272020ac1b863f4048c8d9d12c0d250ac53127896e0bbd4886317916f2b16d |
| catalog-vario-prakticar-35-70mm-f27-35-tele | 90c7ecdc5f5c3976f995facefc70a22ced65e2f118d82f3b22918bf6f3698714 |
| catalog-varisoft-rokkor-85f28 | 9436a237c02623764d4462657137ebb5b34dc8dfc8db8d814c225f1191445924 |
| catalog-viltrox-af-14mm-f4-air | 5c1a20ec0b6e426d61f6e300ebb42af08a02bb54ae42265e1f4279f00899a828 |
| catalog-viltrox-af-23mm-f14 | d3ace553e3463e5151aa3471568808fdecbe6ef24f6c010c9e65a2a9367fbb4c |
| catalog-viltrox-af-27mm-f12-pro-xf | a72cf9b1b2ccab0ffbaf0f4f9f8101c196e5a8ec1a0e03b47806148bbc281efe |
| catalog-viltrox-af-33mm-f14-e | 9cd851fdf90dd37ec9391baa50d8e69d9cd6574599d46d3c5d8a64ed4d02a515 |
| catalog-viltrox-af-35f18-fe | 129b5f38ae92c1ce54e82df3ea465fe91505a6ddd471e2221a0a0eb08389d9f6 |
| catalog-viltrox-af-50mm-f14-pro | 395a9dc31fcd451300341bcdc15f527b36ea274153b26af45f68f29dab81f7f1 |
| catalog-viltrox-af-50mm-f18-fe | 7ffb665b06a8f6e72cb9c8416ff3d7ae5ea4fbcd8d0703eddbd8c5dd9843e78c |
| catalog-viltrox-af-56mm-f14-e | 429b1861575158e6eec9b100c85ce9f8adc88a3955364202322501d828d0dadb |
| catalog-viltrox-af-75mm-f12-pro | 54894c59565d81de15c446d7a1a92c452476fc9b7e24e952221878ab21dc9ca5 |
| catalog-viltrox-af-85mm-f14-pro | 6c2a08cb7ec340eed8f934595430d5829a1dadabe818b626bc2d0cf5d89cf8ef |
| catalog-viltrox-mf-20mm-f18-fe | 7f812af791ec0f8e0290771d61420da47d3d664464655245f636d302bf9812c8 |
| catalog-vivitar-s1-35-85-f28-wide | 9b37ae75cb1cd9de71f39b6122f27a9cd9f23d6da0a48272ff382c5f1d716be9 |
| catalog-vivitar-s1-35-85-f28-tele | d61305f692a9b8151269b619d57268c5cd3f604ee9b12e9cfa9da0bd5295d1bb |
| catalog-vivitar-s1-450-f45 | — |
| catalog-vivitar-s1-70-210-f28-4-wide | 18d9e9b422b60310947c284c76dc75f30cd7392484df1eddd00e1e32a84e107c |
| catalog-vivitar-s1-70-210-f28-4-tele | b431cbc5f511caba32b311d98c128c4d942c3de719d483f058e78643bad8da4c |
| catalog-vivitar-series-1-135mm-f2-3 | 6ce772b4872e2457e37fab309e56e516305788e3d54ee2acaf64d69df4f4d8d2 |
| catalog-vivitar-series-1-70-210-f35-wide | 08338e83b2d1089377910929424dd1efac0f23615eea4845b13137a6a047732c |
| catalog-vivitar-series-1-70-210-f35-tele | 323114a48b7ac2caaf6e83c8165db4cb3949d9469ce119d52c619cbda0587f82 |
| catalog-vivitar-series1-200f3 | 111558a53326b563ff2be80a35b2d7eae06c8c6d19127c23da156897852ce32c |
| catalog-voigtlander-apo-lanthar-180-f4 | 63cf324ff3d64bc5ea9b64c957de51c31ad4c66891d9bb14d96270bf0b34fe81 |
| catalog-voigtlander-apo-lanthar-210mm-f45 | f143cbf66e82fed8ab89353ffa541a291fde0154cbc74b038f3c6bede36317f3 |
| catalog-voigtlander-apo-lanthar-28mm-f2-aspherical-vm | 467cabc5966d9821d8e6841a31e93c0dd00871b69041854d01ae8baf0f6f92ea |
| catalog-voigtlander-apo-lanthar-50mm-f35-vm | f99173628927f44f07c3ff14b87792d4ce71c3caac0218cd12230faff5695e0f |
| catalog-voigtlander-apo-skopar-90f28 | ba090829ec3b7ee6931c3f88312a1ae0e1efd9374394d87b2eeda1e058cb89e3 |
| catalog-voigtlander-apo-ultron-vm-90mm-f2 | d6bcf69fd05fcdfa950cb65286596fae142def81d274624d32756498223da878 |
| catalog-voigtlander-cine-tele-anastigmat-100mm-f45 | e1ddd8a9ddf21f97280699d47c061567430f616a60c99e7494a4de9c10be4601 |
| catalog-voigtlander-color-heliar-105mm-f35 | 233ebbfa28b3e3c67304dce29cdb6ce9f669f6a592c68911b2afd726a5b89eb9 |
| catalog-voigtlander-color-skopar-105mm-f35 | 17cd8ed3d911811491a04921aa0a78a9a8766f31f4e9f3a5f2a9d7001aab36fc |
| catalog-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis | 3a4778d80dae67ce7225eca5500a2b35d7effed70c7516319dbd42d3774d38b8 |
| catalog-voigtlander-color-skopar-vm-35mm-f35-aspherical | d7e6f84d66195a94ea13956bf482a7c570b48d719b82b21d8de23a667349dadb |
| catalog-voigtlander-dynar-f6-normalized-fd100 | c2790a474cf058a61f5f6feb2aa512ac48f5cee50e29d7f32a7dc7c57079cfc1 |
| catalog-voigtlander-heliar-100mm-f4-5-second-asymmetric | 3ba27d5747129e21129f1195d2e227a13a825de68e4b0fd06ae3bfa730b3d0ad |
| catalog-voigtlander-macro-apo-lanthar-125-f25 | 367dfaa76d9b0d3b8eaac58e9f443bfdd327ac1443830dd7ec5321b7fb6f1a29 |
| catalog-voigtlander-nokton-35-f12 | 01c3c5c24359816a6cc8791d80a3d4f141cf5326d194d006d99239e0a65a8ee9 |
| catalog-voigtlander-nokton-50f15 | 102b570233e2e3e77954e322cc52dc67723b922fc2d3263e28d62f9b47f8c81e |
| catalog-voigtlander-nokton-50f15-aspherical-ii-vm | ad91cad8c1db8a07247f8cd31d001cbff068d6bdeee4234613ba36cbb5bff2ab |
| catalog-voigtlander-nokton-50mm-f15-aspherical-l39 | 65d3e5eb92c9123bc81260a2af8899f0bf563d4fb5492e904a9df57fab9f6add |
| catalog-voigtlander-nokton-60mm-f095-mft | cdc6d9416b9dbfc42bb0fa9aa22a7006222fbb3642e0b04317e3e52711c77686 |
| catalog-voigtlander-nokton-vintage-line-vm-75mm-f1-5-aspherical | fceb164f02b8229a367a61a71405d80abd519056abde618186ab3c9305939f25 |
| catalog-voigtlander-nokton-x-50f12 | cd095490972eef012de40669762c19b495758556eb7916867724b1c80202d76b |
| catalog-voigtlander-portrait-heliar-75f18 | 7e5ba32de7cbf7ea738b6d364b14de36a7ea24c48101c7f12b8eb04d50ddaf94 |
| catalog-voigtlander-skoparex-35f34-bessamatic | 4bb562fc2409cccf57315cd485fb4f539466ca28740097a10714ab062b6adb46 |
| catalog-voigtlander-super-dynarex-200mm-f4 | 4e3f5f0692d00416c7122f9adbe087c0d17c0a944c31963984841026b8321cc9 |
| catalog-voigtlander-super-wide-heliar-15mm-f45-aspherical-sl | abc8b082ccd25435539d1b3a00088f5b4b7f207dac24c70cde38a1c7b1cb0d7a |
| catalog-voigtlander-tele-dynar-100mm-f63 | 5580c52aa11bf2b1778f7e0f345a0d451df64098068fe2135805e204e15b2d78 |
| catalog-voigtlander-telomar-100mm-f55 | 2773eefe688f5150f9c642f9333278ac01849efc94d9105bf7967596b9929030 |
| catalog-voigtlander-telomar-180mm-f55 | a9da4686954c359b77b52948f92ed113faa1d3ad736e33a0599f9163c0f36034 |
| catalog-voigtlander-ultra-wide-heliar-12mm-f56-aspherical-l39 | a5ffcf233146edea3a894a7f3105a3f89ce915fc341d9364e6fde1696aaf6011 |
| catalog-voigtlander-ultron-27mm-f2 | edcca196776afbac45a9173901411d665fb989f78e33bd909d8d4804cbb9542b |
| catalog-voigtlander-ultron-35mm-f17-aspherical-l39 | 77c88b5715aa6067cea8c40e962a220d3384adddb00603a9a5935cac1aca853d |
| catalog-yashica-auto-yashinon-ds-20mm-f33 | fddb302e589f923c5aac79494663dd4c245044417cd5fb5fb59de5f18b5d5bce |
| catalog-yashica-ml-24mm-f2-8 | 28fa403c827ea1e84a983ac0207f4772ae2908a038a4c9f996a6a840dd378347 |
| catalog-yashica-ml-300mm-f56 | 84b0be2b3a1e8a3f64f35d8ec6a840f1125a6b58d20f3335b2ae98447c885011 |
| catalog-yashica-yashinon-dx-21mm-f3-3 | c8e38a5c201d5be00b8100b243358549595f8587d5e2b176b0051af0c70fa611 |
| catalog-zeiss-batis-18f28 | 9842ff420629d5147e095773e422810e4af1b15ed21fc5777afa5a811016a09f |
| catalog-zeiss-batis-40mm-f2-cf | ac86423f325eeb786b73c666b0278327bdecc7290a83115926e8e37a45e7b8da |
| catalog-zeiss-batis-85f18 | 5593813586488b057670b6ff0681595613fdea8dd9cbd6f3950296e34bd723b2 |
| catalog-zeiss-biogon-21-f45 | 60e95c0072698c13c66a0f6650145f7a405844aa5d5d92ca9fa66be643d23c0f |
| catalog-zeiss-biogon-35mm-f28-prewar | 64ef6b64f15d4c4ef1a1c805db99e644cac068c5b1d304884ffaa57f35cfc6dc |
| catalog-zeiss-biotar-50f14 | 3c1ac09443ce59b7f5531c6fb11887fb6c534d4e2618e1f575d5a78b07d80fd6 |
| catalog-zeiss-distagon-28mm-f2 | 297641ba7ae40b9ae08daba1bff0e43463e5b1a5cc55b8682bc34e33072023e7 |
| catalog-zeiss-distagon-35f14 | 76a07753556563b452f96f828bb1c598101799ba17bdd701dc82969dc64fdf43 |
| catalog-zeiss-distagon-35mm-f4-contarex | b1d3e8a24d8b69d043a61643ddd1f39625a41c7252a7d0c1596af21fdb009652 |
| catalog-zeiss-flektogon-50mm-f4 | f9f91345ee65d428e60458d7605c9c80aabbe83bd7ec037e86de459d5123b2b9 |
| catalog-zeiss-hologon-15f8 | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a |
| catalog-zeiss-jena-sonnar-50f15-us2186621 | 704595448c3e343d4640ded17c9dab6b415fad16070f92bb1d18319fb41912a7 |
| catalog-zeiss-olympia-sonnar-180f28-contarex | a7d53af06731ab2b4d57c8d7d04f8d430e16731edf3a55184eb29907950bc105 |
| catalog-zeiss-planar-50f14-praktica | 3ccf373f2b206a58eba499c9d60905ec40d946cd31f0f1888177be1195f2f586 |
| catalog-zeiss-planar-80f28 | 0733334573e36ed3d55dbbbd3b99d591c55f2dd09548d5b93a5ed640789cd1f6 |
| catalog-zeiss-planar-t-50f14 | 1a572caeb667e209d0d9f4a54a5a7db4cb3c6e391f21030c2579f1c91296a166 |
| catalog-zeiss-pro-tessar-35f32 | 9f0429841abf904fb384d0fd1508203a57252c7f526087a0c475656a875852a6 |
| catalog-zeiss-s-biogon-40f56 | cdbaa3dc49615ca5dbb15a082f40450c9bbd4a5dd42128a24c51823319b32dab |
| catalog-zeiss-sonnar-35f2-sony-rx1 | 3f9003ca528a2c99bd2cf272f731f2e25a2770738f49641d3bb79c576acca6ad |
| catalog-zeiss-sonnar-40f28-rollei | 3f6f1450de7831e95a9a99589832b57c49b0644db61eb098c2a334426161aa37 |
| catalog-zeiss-sonnar-superachromat-250f56 | 5a366babc43ccbc0bdd21006d98213cb00b9e4d11fbb2c885e30e441f87e1f00 |
| catalog-zeiss-tessar-144f55 | e4527eaafc5565ab1ee28a3c2ef3fe99ea8f418f52ce466123865c52fdc0ddef |
| catalog-zeiss-touit-50mm-f28-macro | d7eaaea7cad5c627b42d9936d1c639ca82a82f9f051ed4e53d4a5053496c8d58 |
| catalog-zeiss-ultra-prime-135-t19 | d4719b2ce1d180079691de3077861250f041a7cc88649d12895cf68dcc6de85a |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-wide | 905d9b1131089355e914df4df40583746ed1d7872671f9498631dce007746616 |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-tele | e92025e5bfe7c26fcc288f9fc0698846683e4b0c9a19aa72479aece79018d17a |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-wide | 867c5770746d61271cce94d21c1bbea14bd78c7c796364d07730697063959c78 |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-tele | 119f4658bd9c368886397699f3807355c4ba5d22ce96af144954835026b79940 |
| catalog-zeiss-zx1-distagon-35mm-f2 | 8a75c7bd1159c6a16fde8b0ed9efd02b601a739677890d94c710fd2c3aeddcdf |

## Run problems

| Run | Problem |
|---|---|
| catalog-carl-zeiss-mirotar-500f45 | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| catalog-minolta-250mm-f56-rf | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| catalog-reference-annular-ring-blocker | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| catalog-reference-cassegrain-back-focus | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| catalog-reference-folded-diffractive-plate | tilted-image-plane: the image plane is not perpendicular to the optical axis |
| catalog-reference-folded-diffractive-plate | off-axis-image-plane: the image plane is not centred on the optical axis |
| catalog-reference-folded-diffractive-plate | tilted-surface: surface FOLD has a tilted interaction normal |
| catalog-reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLD has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| catalog-reference-folded-diffractive-plate | surface-profile-unsupported: surface FOLDB has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| catalog-reference-maksutov-cassegrain-meniscus | folded-post-path-reflection: coarse set d089321cde385109b90970d0af69bf7f4b106ef39a10e9ffde755f8a0d11cd57, line 0, ray 76: it ended at step 5 of LV's 4 declared visits; LV continues its reflective-surface search past the declared path |
| catalog-reference-newtonian-side-focus | tilted-image-plane: the image plane is not perpendicular to the optical axis |
| catalog-reference-newtonian-side-focus | off-axis-image-plane: the image plane is not centred on the optical axis |
| catalog-reference-newtonian-side-focus | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |
| catalog-reference-newtonian-side-focus | surface-profile-unsupported: surface SEC has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| catalog-reference-newtonian-side-focus | surface-profile-unsupported: surface SECB has the LensVisualizer profile "tilted-plane", not the flat one its radius and asphere give |
| catalog-samyang-af-35mm-f2p8-fe | mixed-reference: Mixed d/e indices need physical wavelength data for every glass. |
| catalog-vivitar-s1-450-f45 | folded-auto-path: LV chooses the next surface per ray; contract 1.4 requires a fixed visit order and does not infer one from sample rays |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r4 | rays.trace | 1297 | 3835 | lv – optiland | 1297 PASS | 3835 PASS |
| r4 | rays.trace | 1297 | 3835 | lv – ref | 1297 PASS | 3835 PASS |
| r4 | rays.trace | 1297 | 3835 | optiland – ref | 1297 PASS | 3835 PASS |
| r4f | mtf.native | 1297 | 1297 | lv – replay | 1297 PASS | 1297 PASS |
| r6a | rays.trace | 1297 | 3835 | lv – optiland | 1297 PASS | 3835 PASS |
| r6a | rays.trace | 1297 | 3835 | lv – ref | 1297 PASS | 3835 PASS |
| r6a | rays.trace | 1297 | 3835 | optiland – ref | 1297 PASS | 3835 PASS |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r4 | lv | 1297 ok |
| r4 | optiland | 1297 ok |
| r4 | ref | 1297 ok |
| r4f | lv | 1297 ok |
| r4f | replay | 1297 ok |
| r6a | lv | 1297 ok |
| r6a | optiland | 1297 ok |
| r6a | ref | 1297 ok |

## r4

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | mtf.maxAbs (≤ 1.00e-7) | 1.86e-9 | 3833 of 3835 | catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | cut tangential, field 6.28e1, frequencyPerMm 94 |
| lv – optiland | rays.compared [rays] | 2548230 | 3835 of 3835 | — | — |
| lv – optiland | rays.dropped [rays] | 2817 | 3835 of 3835 | — | — |
| lv – optiland | lines.compared [lines] | 1 | 3835 of 3835 | catalog-agfa-color-magnolar-ii-100f45 | — |
| lv – ref | mtf.maxAbs (≤ 1.00e-7) | 1.78e-9 | 3835 of 3835 | catalog-fujifilm-fujinon-xf-27mm-f28 | cut tangential, field 2.76e1, frequencyPerMm 78 |
| lv – ref | rays.compared [rays] | 2549279 | 3835 of 3835 | — | — |
| lv – ref | rays.dropped [rays] | 1652 | 3835 of 3835 | — | — |
| lv – ref | lines.compared [lines] | 1 | 3835 of 3835 | catalog-agfa-color-magnolar-ii-100f45 | — |
| optiland – ref | mtf.maxAbs (≤ 1.00e-7) | 1.99e-9 | 3833 of 3835 | catalog-fujifilm-fujinon-xf-27mm-f28 | cut tangential, field 2.76e1, frequencyPerMm 86 |
| optiland – ref | rays.compared [rays] | 2549882 | 3835 of 3835 | — | — |
| optiland – ref | rays.dropped [rays] | 1165 | 3835 of 3835 | — | — |
| optiland – ref | lines.compared [lines] | 1 | 3835 of 3835 | catalog-agfa-color-magnolar-ii-100f45 | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | 3 | PASS: mtf.maxAbs 3.34e-12 (3 of 3) | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 2.37e-12 (3 of 3) |
| catalog-agfa-color-telinear-90mm-f4 | 3 | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 8.10e-13 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) |
| catalog-agfa-solagon-50mm-f2 | 3 | PASS: mtf.maxAbs 8.56e-13 (3 of 3) | PASS: mtf.maxAbs 7.53e-13 (3 of 3) | PASS: mtf.maxAbs 4.74e-13 (3 of 3) |
| catalog-angenieux-dem-180mm-f23-apo | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 1.52e-12 (3 of 3) |
| catalog-angenieux-retrofocus-r1-35mm-f25 | 3 | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 7.66e-13 (3 of 3) | PASS: mtf.maxAbs 6.88e-13 (3 of 3) |
| catalog-angenieux-retrofocus-r11-28mm-f35 | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 8.37e-13 (3 of 3) | PASS: mtf.maxAbs 7.73e-13 (3 of 3) |
| catalog-apo-lanthar-50f2 | 3 | PASS: mtf.maxAbs 9.42e-13 (3 of 3) | PASS: mtf.maxAbs 6.69e-12 (3 of 3) | PASS: mtf.maxAbs 5.80e-12 (3 of 3) |
| catalog-apple-iphone-12-main-wide | 3 | PASS: mtf.maxAbs 9.87e-12 (2 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 9.76e-12 (2 of 3) |
| catalog-apple-iphone-7-wide-camera-lens | 3 | PASS: mtf.maxAbs 6.95e-11 (2 of 3) | PASS: mtf.maxAbs 1.67e-11 (3 of 3) | PASS: mtf.maxAbs 7.46e-11 (2 of 3) |
| catalog-bertele-sonnar-50f2-scaled | 3 | PASS: mtf.maxAbs 8.37e-13 (3 of 3) | PASS: mtf.maxAbs 6.37e-13 (3 of 3) | PASS: mtf.maxAbs 9.24e-13 (3 of 3) |
| catalog-canon-50f12-1956 | 3 | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.44e-12 (3 of 3) |
| catalog-canon-50mm-f095 | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 1.94e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| catalog-canon-cine-servo-17-120-t295-39-ef-wide | 3 | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) |
| catalog-canon-cine-servo-17-120-t295-39-ef-tele | 3 | PASS: mtf.maxAbs 7.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) | PASS: mtf.maxAbs 7.29e-12 (3 of 3) |
| catalog-canon-ef-100-300mm-f5-6-wide | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 8.85e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| catalog-canon-ef-100-300mm-f5-6-tele | 3 | PASS: mtf.maxAbs 2.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 3.08e-12 (3 of 3) |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-wide | 3 | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 2.72e-12 (3 of 3) |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-tele | 3 | PASS: mtf.maxAbs 3.54e-12 (3 of 3) | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 3.48e-12 (3 of 3) |
| catalog-canon-ef-100300mm-f4556-usm-wide | 3 | PASS: mtf.maxAbs 2.79e-12 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) |
| catalog-canon-ef-100300mm-f4556-usm-tele | 3 | PASS: mtf.maxAbs 2.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| catalog-canon-ef-100400-f45-56l-is-usm-wide | 3 | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 9.06e-13 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) |
| catalog-canon-ef-100400-f45-56l-is-usm-tele | 3 | PASS: mtf.maxAbs 1.86e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) |
| catalog-canon-ef-100mm-f28-macro | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 2.37e-12 (3 of 3) |
| catalog-canon-ef-100mm-f28l-is-macro | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 3.27e-12 (3 of 3) |
| catalog-canon-ef-11-24-f4l-usm-wide | 3 | PASS: mtf.maxAbs 3.50e-12 (3 of 3) | PASS: mtf.maxAbs 4.50e-12 (3 of 3) | PASS: mtf.maxAbs 7.00e-12 (3 of 3) |
| catalog-canon-ef-11-24-f4l-usm-tele | 3 | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 6.55e-12 (3 of 3) | PASS: mtf.maxAbs 5.17e-12 (3 of 3) |
| catalog-canon-ef-135-f2l-usm | 3 | PASS: mtf.maxAbs 8.55e-13 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.39e-12 (3 of 3) |
| catalog-canon-ef-135mm-f28-soft-focus | 3 | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) |
| catalog-canon-ef-14mm-f28-l | 3 | PASS: mtf.maxAbs 5.68e-12 (3 of 3) | PASS: mtf.maxAbs 4.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) |
| catalog-canon-ef-180mm-f35l-macro-usm | 3 | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 4.86e-12 (3 of 3) |
| catalog-canon-ef-20-35mm-f28l-wide | 3 | PASS: mtf.maxAbs 3.99e-11 (3 of 3) | PASS: mtf.maxAbs 1.45e-11 (3 of 3) | PASS: mtf.maxAbs 2.72e-11 (3 of 3) |
| catalog-canon-ef-20-35mm-f28l-tele | 3 | PASS: mtf.maxAbs 9.17e-13 (3 of 3) | PASS: mtf.maxAbs 2.69e-12 (3 of 3) | PASS: mtf.maxAbs 2.58e-12 (3 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-wide | 3 | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 1.78e-12 (3 of 3) | PASS: mtf.maxAbs 2.69e-12 (3 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-tele | 3 | PASS: mtf.maxAbs 4.29e-12 (3 of 3) | PASS: mtf.maxAbs 2.78e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-wide | 3 | PASS: mtf.maxAbs 5.28e-12 (3 of 3) | PASS: mtf.maxAbs 3.47e-12 (3 of 3) | PASS: mtf.maxAbs 4.00e-12 (3 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-tele | 3 | PASS: mtf.maxAbs 4.31e-12 (3 of 3) | PASS: mtf.maxAbs 3.73e-12 (3 of 3) | PASS: mtf.maxAbs 5.06e-12 (3 of 3) |
| catalog-canon-ef-200mm-f1-8-l-usm | 3 | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 2.33e-12 (3 of 3) |
| catalog-canon-ef-200mm-f2l-is-usm | 3 | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) | PASS: mtf.maxAbs 2.78e-12 (3 of 3) |
| catalog-canon-ef-20mm-f28-usm | 3 | PASS: mtf.maxAbs 1.89e-12 (3 of 3) | PASS: mtf.maxAbs 9.21e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| catalog-canon-ef-24-70-f28l-ii-wide | 3 | PASS: mtf.maxAbs 2.02e-11 (3 of 3) | PASS: mtf.maxAbs 1.33e-11 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) |
| catalog-canon-ef-24-70-f28l-ii-tele | 3 | PASS: mtf.maxAbs 7.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-11 (3 of 3) | PASS: mtf.maxAbs 4.14e-12 (3 of 3) |
| catalog-canon-ef-24-70mm-f28l-usm-wide | 3 | PASS: mtf.maxAbs 4.36e-12 (3 of 3) | PASS: mtf.maxAbs 4.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| catalog-canon-ef-24-70mm-f28l-usm-tele | 3 | PASS: mtf.maxAbs 4.55e-12 (3 of 3) | PASS: mtf.maxAbs 2.94e-12 (3 of 3) | PASS: mtf.maxAbs 5.97e-12 (3 of 3) |
| catalog-canon-ef-24mm-f14-l-ii-usm | 3 | PASS: mtf.maxAbs 8.81e-13 (3 of 3) | PASS: mtf.maxAbs 3.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.15e-12 (3 of 3) |
| catalog-canon-ef-24mm-f14-l-usm | 3 | PASS: mtf.maxAbs 2.15e-12 (3 of 3) | PASS: mtf.maxAbs 4.05e-12 (3 of 3) | PASS: mtf.maxAbs 3.57e-12 (3 of 3) |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-wide | 3 | PASS: mtf.maxAbs 1.53e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-tele | 3 | PASS: mtf.maxAbs 2.02e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) |
| catalog-canon-ef-28-105mm-f4-56-wide | 3 | PASS: mtf.maxAbs 2.34e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) |
| catalog-canon-ef-28-105mm-f4-56-tele | 3 | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.73e-12 (3 of 3) |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-wide | 3 | PASS: mtf.maxAbs 9.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-11 (3 of 3) | PASS: mtf.maxAbs 7.93e-12 (3 of 3) |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-tele | 3 | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.99e-12 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) |
| catalog-canon-ef-28-200mm-f35-56-usm-wide | 3 | PASS: mtf.maxAbs 1.52e-12 (3 of 3) | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 3.67e-12 (3 of 3) |
| catalog-canon-ef-28-200mm-f35-56-usm-tele | 3 | PASS: mtf.maxAbs 2.35e-12 (3 of 3) | PASS: mtf.maxAbs 8.86e-12 (3 of 3) | PASS: mtf.maxAbs 6.51e-12 (3 of 3) |
| catalog-canon-ef-28-70mm-f35-45-ii-wide | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-canon-ef-28-70mm-f35-45-ii-tele | 3 | PASS: mtf.maxAbs 1.65e-12 (3 of 3) | PASS: mtf.maxAbs 1.65e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| catalog-canon-ef-28-80mm-f35-56-ii-wide | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 7.81e-13 (3 of 3) |
| catalog-canon-ef-28-80mm-f35-56-ii-tele | 3 | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.31e-12 (3 of 3) |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-wide | 3 | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-tele | 3 | PASS: mtf.maxAbs 1.62e-12 (3 of 3) | PASS: mtf.maxAbs 2.49e-12 (3 of 3) | PASS: mtf.maxAbs 2.67e-12 (3 of 3) |
| catalog-canon-ef-28mm-f2-8 | 3 | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 4.35e-12 (3 of 3) | PASS: mtf.maxAbs 4.65e-12 (3 of 3) |
| catalog-canon-ef-28mm-f28-is-usm | 3 | PASS: mtf.maxAbs 5.41e-13 (3 of 3) | PASS: mtf.maxAbs 3.39e-12 (3 of 3) | PASS: mtf.maxAbs 3.78e-12 (3 of 3) |
| catalog-canon-ef-300mm-f28l-is-usm | 3 | PASS: mtf.maxAbs 3.05e-12 (3 of 3) | PASS: mtf.maxAbs 5.21e-12 (3 of 3) | PASS: mtf.maxAbs 8.26e-12 (3 of 3) |
| catalog-canon-ef-35mm-f14l-ii-usm | 3 | PASS: mtf.maxAbs 2.56e-12 (3 of 3) | PASS: mtf.maxAbs 3.38e-12 (3 of 3) | PASS: mtf.maxAbs 2.84e-12 (3 of 3) |
| catalog-canon-ef-35mm-f14l-usm | 3 | PASS: mtf.maxAbs 9.95e-13 (3 of 3) | PASS: mtf.maxAbs 7.24e-12 (3 of 3) | PASS: mtf.maxAbs 7.96e-12 (3 of 3) |
| catalog-canon-ef-35mm-f2-is-usm | 3 | PASS: mtf.maxAbs 7.91e-13 (3 of 3) | PASS: mtf.maxAbs 4.16e-12 (3 of 3) | PASS: mtf.maxAbs 3.81e-12 (3 of 3) |
| catalog-canon-ef-40-f28-stm | 3 | PASS: mtf.maxAbs 7.06e-13 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) |
| catalog-canon-ef-400mm-f28-l-is-ii-usm | 3 | PASS: mtf.maxAbs 4.64e-12 (3 of 3) | PASS: mtf.maxAbs 2.64e-12 (3 of 3) | PASS: mtf.maxAbs 5.69e-12 (3 of 3) |
| catalog-canon-ef-400mm-f28l-is-iii-usm | 3 | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 1.52e-12 (3 of 3) | PASS: mtf.maxAbs 1.53e-12 (3 of 3) |
| catalog-canon-ef-400mm-f28l-is-usm | 3 | PASS: mtf.maxAbs 8.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 9.31e-12 (3 of 3) |
| catalog-canon-ef-500mm-f4l-is-usm | 3 | PASS: mtf.maxAbs 3.17e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) | PASS: mtf.maxAbs 3.43e-12 (3 of 3) |
| catalog-canon-ef-50f10l | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 3.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.93e-12 (3 of 3) |
| catalog-canon-ef-50mm-f1p2l-usm | 3 | PASS: mtf.maxAbs 9.93e-13 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 9.83e-13 (3 of 3) |
| catalog-canon-ef-600f4l-is-ii-usm | 3 | PASS: mtf.maxAbs 5.82e-12 (3 of 3) | PASS: mtf.maxAbs 6.64e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-11 (3 of 3) |
| catalog-canon-ef-600f4l-is-iii-usm | 3 | PASS: mtf.maxAbs 9.41e-12 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 7.28e-12 (3 of 3) |
| catalog-canon-ef-600mm-f4l-is-usm | 3 | PASS: mtf.maxAbs 4.13e-12 (3 of 3) | PASS: mtf.maxAbs 5.50e-12 (3 of 3) | PASS: mtf.maxAbs 6.44e-12 (3 of 3) |
| catalog-canon-ef-70-200f28l-is-usm-wide | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 9.00e-13 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) |
| catalog-canon-ef-70-200f28l-is-usm-tele | 3 | PASS: mtf.maxAbs 2.67e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-wide | 3 | PASS: mtf.maxAbs 2.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-tele | 3 | PASS: mtf.maxAbs 3.88e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| catalog-canon-ef-70-200mm-f4-l-usm-wide | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 9.39e-13 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) |
| catalog-canon-ef-70-200mm-f4-l-usm-tele | 3 | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| catalog-canon-ef-70-200mm-f4l-is-usm-wide | 3 | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 7.22e-13 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) |
| catalog-canon-ef-70-200mm-f4l-is-usm-tele | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-wide | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 8.45e-13 (3 of 3) | PASS: mtf.maxAbs 1.67e-12 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-tele | 3 | PASS: mtf.maxAbs 2.05e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-usm-wide | 3 | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 7.14e-13 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-usm-tele | 3 | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-wide | 3 | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-tele | 3 | PASS: mtf.maxAbs 3.57e-12 (3 of 3) | PASS: mtf.maxAbs 7.07e-13 (3 of 3) | PASS: mtf.maxAbs 3.49e-12 (3 of 3) |
| catalog-canon-ef-75-300mm-f4-56-is-usm-wide | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) |
| catalog-canon-ef-75-300mm-f4-56-is-usm-tele | 3 | PASS: mtf.maxAbs 2.65e-12 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) |
| catalog-canon-ef-85mm-f18-usm | 3 | PASS: mtf.maxAbs 7.86e-13 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-wide | 3 | PASS: mtf.maxAbs 2.19e-11 (3 of 3) | PASS: mtf.maxAbs 1.77e-11 (3 of 3) | PASS: mtf.maxAbs 1.89e-11 (3 of 3) |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-tele | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 6.26e-12 (3 of 3) | PASS: mtf.maxAbs 5.53e-12 (3 of 3) |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-wide | 3 | PASS: mtf.maxAbs 7.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-tele | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.65e-12 (3 of 3) | PASS: mtf.maxAbs 4.28e-12 (3 of 3) |
| catalog-canon-ef-m-18-55-f35-56-is-stm-wide | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 4.03e-12 (3 of 3) | PASS: mtf.maxAbs 4.54e-12 (3 of 3) |
| catalog-canon-ef-m-18-55-f35-56-is-stm-tele | 3 | PASS: mtf.maxAbs 8.69e-13 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) |
| catalog-canon-ef-m-32mm-f14-stm | 3 | PASS: mtf.maxAbs 7.26e-13 (3 of 3) | PASS: mtf.maxAbs 9.69e-13 (3 of 3) | PASS: mtf.maxAbs 1.69e-12 (3 of 3) |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-wide | 3 | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 9.57e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-tele | 3 | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 3.02e-12 (3 of 3) | PASS: mtf.maxAbs 5.27e-12 (3 of 3) |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-wide | 3 | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.55e-12 (3 of 3) |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-tele | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) |
| catalog-canon-ef-s-55-250-f4-56-is-wide | 3 | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 4.21e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| catalog-canon-ef-s-55-250-f4-56-is-tele | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 9.45e-13 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-wide | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 8.52e-13 (3 of 3) | PASS: mtf.maxAbs 6.03e-13 (3 of 3) |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-tele | 3 | PASS: mtf.maxAbs 1.52e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 8.18e-13 (3 of 3) |
| catalog-canon-efm-22mm-f2-stm | 3 | PASS: mtf.maxAbs 5.30e-13 (3 of 3) | PASS: mtf.maxAbs 2.10e-12 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) |
| catalog-canon-efm-28mm-f35-macro-is-stm | 3 | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 4.64e-12 (3 of 3) | PASS: mtf.maxAbs 4.61e-12 (3 of 3) |
| catalog-canon-efs-10-18-f4556-is-stm-wide | 3 | PASS: mtf.maxAbs 2.32e-12 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 4.41e-13 (3 of 3) |
| catalog-canon-efs-10-18-f4556-is-stm-tele | 3 | PASS: mtf.maxAbs 2.92e-13 (3 of 3) | PASS: mtf.maxAbs 5.45e-13 (3 of 3) | PASS: mtf.maxAbs 7.04e-13 (3 of 3) |
| catalog-canon-efs-10-22mm-f35-45-usm-wide | 3 | PASS: mtf.maxAbs 4.03e-12 (3 of 3) | PASS: mtf.maxAbs 7.65e-12 (3 of 3) | PASS: mtf.maxAbs 5.88e-12 (3 of 3) |
| catalog-canon-efs-10-22mm-f35-45-usm-tele | 3 | PASS: mtf.maxAbs 2.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-11 (3 of 3) | PASS: mtf.maxAbs 1.38e-11 (3 of 3) |
| catalog-canon-efs-17-55-f28-is-wide | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 6.34e-13 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) |
| catalog-canon-efs-17-55-f28-is-tele | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 2.54e-12 (3 of 3) |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-wide | 3 | PASS: mtf.maxAbs 5.34e-12 (3 of 3) | PASS: mtf.maxAbs 7.50e-12 (3 of 3) | PASS: mtf.maxAbs 8.46e-12 (3 of 3) |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-tele | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 4.03e-12 (3 of 3) | PASS: mtf.maxAbs 4.52e-12 (3 of 3) |
| catalog-canon-efs-18-55mm-f35-56-is-wide | 3 | PASS: mtf.maxAbs 9.72e-13 (3 of 3) | PASS: mtf.maxAbs 8.13e-13 (3 of 3) | PASS: mtf.maxAbs 6.66e-13 (3 of 3) |
| catalog-canon-efs-18-55mm-f35-56-is-tele | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) |
| catalog-canon-efs-24-f28-stm | 3 | PASS: mtf.maxAbs 8.51e-13 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) | PASS: mtf.maxAbs 2.88e-12 (3 of 3) |
| catalog-canon-fd-150-600mm-f56-l-wide | 3 | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 2.20e-12 (3 of 3) |
| catalog-canon-fd-150-600mm-f56-l-tele | 3 | PASS: mtf.maxAbs 4.05e-12 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 2.79e-12 (3 of 3) |
| catalog-canon-fd-24mm-f28-ssc | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 7.17e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-canon-fd-28mm-f28 | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 8.56e-13 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| catalog-canon-fd-300mm-f4-ssc | 3 | PASS: mtf.maxAbs 2.63e-12 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 2.88e-12 (3 of 3) |
| catalog-canon-fd-35-f2 | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 6.52e-13 (3 of 3) | PASS: mtf.maxAbs 9.84e-13 (3 of 3) |
| catalog-canon-fd-50f1p2-l | 3 | PASS: mtf.maxAbs 9.32e-13 (3 of 3) | PASS: mtf.maxAbs 3.88e-12 (3 of 3) | PASS: mtf.maxAbs 4.34e-12 (3 of 3) |
| catalog-canon-fdn-50f12 | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 8.41e-13 (3 of 3) | PASS: mtf.maxAbs 9.12e-13 (3 of 3) |
| catalog-canon-fl-300mm-f28-ssc-fluorite | 3 | PASS: mtf.maxAbs 3.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) | PASS: mtf.maxAbs 3.56e-12 (3 of 3) |
| catalog-canon-fl-85-300mm-f5-wide | 3 | PASS: mtf.maxAbs 3.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) | PASS: mtf.maxAbs 2.87e-12 (3 of 3) |
| catalog-canon-fl-85-300mm-f5-tele | 3 | PASS: mtf.maxAbs 3.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) |
| catalog-canon-new-fd-100mm-f2 | 3 | PASS: mtf.maxAbs 8.57e-13 (3 of 3) | PASS: mtf.maxAbs 9.15e-13 (3 of 3) | PASS: mtf.maxAbs 6.66e-13 (3 of 3) |
| catalog-canon-new-fd-14mm-f28-l | 3 | PASS: mtf.maxAbs 4.58e-11 (3 of 3) | PASS: mtf.maxAbs 1.62e-11 (3 of 3) | PASS: mtf.maxAbs 4.15e-11 (3 of 3) |
| catalog-canon-new-fd-35-105mm-f35-wide | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 4.64e-13 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) |
| catalog-canon-new-fd-35-105mm-f35-tele | 3 | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-wide | 2 | PASS: mtf.maxAbs 7.82e-13 (2 of 2) | PASS: mtf.maxAbs 2.39e-12 (2 of 2) | PASS: mtf.maxAbs 2.30e-12 (2 of 2) |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-tele | 3 | PASS: mtf.maxAbs 8.92e-13 (3 of 3) | PASS: mtf.maxAbs 3.56e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) |
| catalog-canon-powershot-g1x-1560-f28-wide | 2 | PASS: mtf.maxAbs 3.95e-13 (2 of 2) | PASS: mtf.maxAbs 2.34e-12 (2 of 2) | PASS: mtf.maxAbs 2.17e-12 (2 of 2) |
| catalog-canon-powershot-g1x-1560-f28-tele | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) | PASS: mtf.maxAbs 4.26e-12 (3 of 3) |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-wide | 3 | PASS: mtf.maxAbs 8.13e-13 (3 of 3) | PASS: mtf.maxAbs 7.06e-12 (3 of 3) | PASS: mtf.maxAbs 7.87e-12 (3 of 3) |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-tele | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 4.20e-12 (3 of 3) | PASS: mtf.maxAbs 4.10e-12 (3 of 3) |
| catalog-canon-powershot-g3x-wide | 2 | PASS: mtf.maxAbs 3.82e-13 (2 of 2) | PASS: mtf.maxAbs 2.78e-12 (2 of 2) | PASS: mtf.maxAbs 2.94e-12 (2 of 2) |
| catalog-canon-powershot-g3x-tele | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 4.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.53e-12 (3 of 3) |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-wide | 2 | PASS: mtf.maxAbs 1.75e-13 (2 of 2) | PASS: mtf.maxAbs 1.56e-12 (2 of 2) | PASS: mtf.maxAbs 1.53e-12 (2 of 2) |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-tele | 3 | PASS: mtf.maxAbs 5.03e-13 (3 of 3) | PASS: mtf.maxAbs 4.14e-12 (3 of 3) | PASS: mtf.maxAbs 3.86e-12 (3 of 3) |
| catalog-canon-powershot-g9x-wide | 3 | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 4.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.55e-12 (3 of 3) |
| catalog-canon-powershot-g9x-tele | 3 | PASS: mtf.maxAbs 2.63e-13 (3 of 3) | PASS: mtf.maxAbs 3.93e-12 (3 of 3) | PASS: mtf.maxAbs 3.73e-12 (3 of 3) |
| catalog-canon-r-58mm-f12 | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 5.50e-13 (3 of 3) | PASS: mtf.maxAbs 9.43e-13 (3 of 3) |
| catalog-canon-rf-10-20-f4-l-is-stm-wide | 3 | PASS: mtf.maxAbs 1.05e-11 (3 of 3) | PASS: mtf.maxAbs 9.91e-12 (3 of 3) | PASS: mtf.maxAbs 4.61e-12 (3 of 3) |
| catalog-canon-rf-10-20-f4-l-is-stm-tele | 3 | PASS: mtf.maxAbs 6.70e-12 (3 of 3) | PASS: mtf.maxAbs 7.45e-12 (3 of 3) | PASS: mtf.maxAbs 7.50e-12 (3 of 3) |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-wide | 3 | PASS: mtf.maxAbs 3.02e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 4.45e-12 (3 of 3) |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-tele | 3 | PASS: mtf.maxAbs 5.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.32e-12 (3 of 3) | PASS: mtf.maxAbs 5.93e-12 (3 of 3) |
| catalog-canon-rf-135f18 | 3 | PASS: mtf.maxAbs 2.95e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 4.36e-12 (3 of 3) |
| catalog-canon-rf-14-35mm-f4-l-is-usm-wide | 2 | PASS: mtf.maxAbs 4.38e-13 (2 of 2) | PASS: mtf.maxAbs 2.57e-12 (2 of 2) | PASS: mtf.maxAbs 2.38e-12 (2 of 2) |
| catalog-canon-rf-14-35mm-f4-l-is-usm-tele | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 7.28e-12 (3 of 3) | PASS: mtf.maxAbs 8.59e-12 (3 of 3) |
| catalog-canon-rf-14mm-f14-l-vcm | 3 | PASS: mtf.maxAbs 1.79e-11 (3 of 3) | PASS: mtf.maxAbs 1.75e-11 (3 of 3) | PASS: mtf.maxAbs 6.98e-12 (3 of 3) |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-wide | 2 | PASS: mtf.maxAbs 5.77e-13 (2 of 2) | PASS: mtf.maxAbs 9.86e-13 (2 of 2) | PASS: mtf.maxAbs 1.56e-12 (2 of 2) |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-tele | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 7.44e-13 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) |
| catalog-canon-rf-15-35-f28-wide | 3 | PASS: mtf.maxAbs 1.45e-11 (3 of 3) | PASS: mtf.maxAbs 1.68e-11 (3 of 3) | PASS: mtf.maxAbs 1.78e-11 (3 of 3) |
| catalog-canon-rf-15-35-f28-tele | 3 | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 2.96e-12 (3 of 3) | PASS: mtf.maxAbs 4.02e-12 (3 of 3) |
| catalog-canon-rf-16-28mm-f28-is-stm-wide | 2 | PASS: mtf.maxAbs 8.63e-13 (2 of 2) | PASS: mtf.maxAbs 7.19e-12 (2 of 2) | PASS: mtf.maxAbs 7.87e-12 (2 of 2) |
| catalog-canon-rf-16-28mm-f28-is-stm-tele | 3 | PASS: mtf.maxAbs 3.06e-12 (3 of 3) | PASS: mtf.maxAbs 5.67e-12 (3 of 3) | PASS: mtf.maxAbs 4.42e-12 (3 of 3) |
| catalog-canon-rf-16mm-f28-stm | 2 | PASS: mtf.maxAbs 4.45e-13 (2 of 2) | PASS: mtf.maxAbs 2.38e-13 (2 of 2) | PASS: mtf.maxAbs 3.19e-13 (2 of 2) |
| catalog-canon-rf-200-800-f63-9-is-usm-wide | 3 | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 2.80e-12 (3 of 3) |
| catalog-canon-rf-200-800-f63-9-is-usm-tele | 3 | PASS: mtf.maxAbs 2.63e-12 (3 of 3) | PASS: mtf.maxAbs 2.68e-12 (3 of 3) | PASS: mtf.maxAbs 4.42e-12 (3 of 3) |
| catalog-canon-rf-20mm-f14-l-vcm | 3 | PASS: mtf.maxAbs 8.98e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 7.69e-12 (3 of 3) |
| catalog-canon-rf-24-105-f4-l-wide | 3 | PASS: mtf.maxAbs 2.14e-11 (3 of 3) | PASS: mtf.maxAbs 1.54e-11 (3 of 3) | PASS: mtf.maxAbs 6.09e-12 (3 of 3) |
| catalog-canon-rf-24-105-f4-l-tele | 3 | PASS: mtf.maxAbs 2.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.37e-12 (3 of 3) | PASS: mtf.maxAbs 4.13e-12 (3 of 3) |
| catalog-canon-rf-24-105mm-f4-71-is-stm-wide | 2 | PASS: mtf.maxAbs 8.18e-13 (2 of 2) | PASS: mtf.maxAbs 1.27e-12 (2 of 2) | PASS: mtf.maxAbs 1.25e-12 (2 of 2) |
| catalog-canon-rf-24-105mm-f4-71-is-stm-tele | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) |
| catalog-canon-rf-24-50-f45-63-wide | 2 | PASS: mtf.maxAbs 3.49e-13 (2 of 2) | PASS: mtf.maxAbs 2.84e-12 (2 of 2) | PASS: mtf.maxAbs 3.07e-12 (2 of 2) |
| catalog-canon-rf-24-50-f45-63-tele | 3 | PASS: mtf.maxAbs 5.53e-13 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 2.00e-12 (3 of 3) |
| catalog-canon-rf-24-70-f28-wide | 3 | PASS: mtf.maxAbs 5.28e-12 (3 of 3) | PASS: mtf.maxAbs 8.58e-12 (3 of 3) | PASS: mtf.maxAbs 8.50e-12 (3 of 3) |
| catalog-canon-rf-24-70-f28-tele | 3 | PASS: mtf.maxAbs 3.96e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 1.28e-11 (3 of 3) |
| catalog-canon-rf-24mm-f14-l-vcm | 2 | PASS: mtf.maxAbs 7.66e-13 (2 of 2) | PASS: mtf.maxAbs 8.87e-13 (2 of 2) | PASS: mtf.maxAbs 1.30e-12 (2 of 2) |
| catalog-canon-rf-28-70-f2-wide | 3 | PASS: mtf.maxAbs 6.16e-12 (3 of 3) | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.78e-12 (3 of 3) |
| catalog-canon-rf-28-70-f2-tele | 3 | PASS: mtf.maxAbs 2.70e-12 (3 of 3) | PASS: mtf.maxAbs 3.17e-12 (3 of 3) | PASS: mtf.maxAbs 3.18e-12 (3 of 3) |
| catalog-canon-rf-28-70-f28-is-stm-wide | 3 | PASS: mtf.maxAbs 8.93e-13 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) |
| catalog-canon-rf-28-70-f28-is-stm-tele | 3 | PASS: mtf.maxAbs 1.46e-12 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) |
| catalog-canon-rf-35mm-f14-l-vcm | 3 | PASS: mtf.maxAbs 4.59e-12 (3 of 3) | PASS: mtf.maxAbs 2.36e-12 (3 of 3) | PASS: mtf.maxAbs 3.54e-12 (3 of 3) |
| catalog-canon-rf-35mm-f18-macro-is-stm | 3 | PASS: mtf.maxAbs 4.25e-13 (3 of 3) | PASS: mtf.maxAbs 5.95e-12 (3 of 3) | PASS: mtf.maxAbs 5.91e-12 (3 of 3) |
| catalog-canon-rf-50-f12-l | 3 | PASS: mtf.maxAbs 9.09e-13 (3 of 3) | PASS: mtf.maxAbs 2.39e-12 (3 of 3) | PASS: mtf.maxAbs 2.08e-12 (3 of 3) |
| catalog-canon-rf-50mm-f1-8-stm | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 3.65e-12 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) |
| catalog-canon-rf-50mm-f14-l-vcm | 3 | PASS: mtf.maxAbs 2.29e-12 (3 of 3) | PASS: mtf.maxAbs 3.96e-12 (3 of 3) | PASS: mtf.maxAbs 2.08e-12 (3 of 3) |
| catalog-canon-rf-70-200-f28-wide | 3 | PASS: mtf.maxAbs 4.83e-12 (3 of 3) | PASS: mtf.maxAbs 3.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) |
| catalog-canon-rf-70-200-f28-tele | 3 | PASS: mtf.maxAbs 6.48e-12 (3 of 3) | PASS: mtf.maxAbs 2.10e-12 (3 of 3) | PASS: mtf.maxAbs 7.65e-12 (3 of 3) |
| catalog-canon-rf-85f12l | 3 | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 2.86e-12 (3 of 3) | PASS: mtf.maxAbs 4.20e-12 (3 of 3) |
| catalog-canon-rf-85f2-macro | 3 | PASS: mtf.maxAbs 8.26e-13 (3 of 3) | PASS: mtf.maxAbs 8.54e-13 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-wide | 3 | PASS: mtf.maxAbs 9.90e-13 (3 of 3) | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 2.00e-12 (3 of 3) |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-tele | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.87e-12 (3 of 3) | PASS: mtf.maxAbs 2.89e-12 (3 of 3) |
| catalog-canon-rf100f28-macro | 3 | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) |
| catalog-canon-rf24-105f28z-wide | 3 | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 4.42e-12 (3 of 3) | PASS: mtf.maxAbs 2.31e-12 (3 of 3) |
| catalog-canon-rf24-105f28z-tele | 3 | PASS: mtf.maxAbs 1.96e-12 (3 of 3) | PASS: mtf.maxAbs 7.21e-12 (3 of 3) | PASS: mtf.maxAbs 5.76e-12 (3 of 3) |
| catalog-canon-rf24-240-f4-63-wide | 2 | PASS: mtf.maxAbs 5.60e-13 (2 of 2) | PASS: mtf.maxAbs 1.30e-12 (2 of 2) | PASS: mtf.maxAbs 1.08e-12 (2 of 2) |
| catalog-canon-rf24-240-f4-63-tele | 3 | PASS: mtf.maxAbs 4.22e-12 (3 of 3) | PASS: mtf.maxAbs 2.38e-12 (3 of 3) | PASS: mtf.maxAbs 5.82e-12 (3 of 3) |
| catalog-canon-rf70-200mm-f4-l-is-usm-wide | 3 | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 8.81e-13 (3 of 3) |
| catalog-canon-rf70-200mm-f4-l-is-usm-tele | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-wide | 2 | PASS: mtf.maxAbs 1.71e-13 (2 of 2) | PASS: mtf.maxAbs 1.81e-12 (2 of 2) | PASS: mtf.maxAbs 1.93e-12 (2 of 2) |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-tele | 3 | PASS: mtf.maxAbs 2.66e-13 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) |
| catalog-canon-s-50mm-f2-8 | 3 | PASS: mtf.maxAbs 4.43e-13 (3 of 3) | PASS: mtf.maxAbs 7.52e-13 (3 of 3) | PASS: mtf.maxAbs 4.88e-13 (3 of 3) |
| catalog-canon-serenar-100mm-f35 | 3 | PASS: mtf.maxAbs 7.96e-13 (3 of 3) | PASS: mtf.maxAbs 5.94e-13 (3 of 3) | PASS: mtf.maxAbs 7.13e-13 (3 of 3) |
| catalog-canon-serenar-28f35 | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.25e-13 (3 of 3) |
| catalog-canon-serenar-35f32 | 3 | PASS: mtf.maxAbs 7.60e-13 (3 of 3) | PASS: mtf.maxAbs 8.91e-13 (3 of 3) | PASS: mtf.maxAbs 8.01e-13 (3 of 3) |
| catalog-canon-serenar-50f18 | 3 | PASS: mtf.maxAbs 7.45e-13 (3 of 3) | PASS: mtf.maxAbs 8.73e-13 (3 of 3) | PASS: mtf.maxAbs 6.36e-13 (3 of 3) |
| catalog-canon-serenar-85f15 | 3 | PASS: mtf.maxAbs 9.09e-13 (3 of 3) | PASS: mtf.maxAbs 5.25e-13 (3 of 3) | PASS: mtf.maxAbs 6.21e-13 (3 of 3) |
| catalog-canon-ts-e-24mm-f35l-ii | 3 | PASS: mtf.maxAbs 1.41e-11 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-11 (3 of 3) |
| catalog-canon-tse-135mm-f4l | 3 | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 8.50e-13 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) |
| catalog-canon-tse-50f28l-macro | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 5.05e-13 (3 of 3) | PASS: mtf.maxAbs 9.12e-13 (3 of 3) |
| catalog-canon-tse-90mm-f28l-macro | 3 | PASS: mtf.maxAbs 9.49e-13 (3 of 3) | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 8.25e-13 (3 of 3) |
| catalog-carl-zeiss-biogon-35f28-contax | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 9.67e-13 (3 of 3) |
| catalog-carl-zeiss-contarex-planar-55f14 | 3 | PASS: mtf.maxAbs 8.61e-13 (3 of 3) | PASS: mtf.maxAbs 7.88e-13 (3 of 3) | PASS: mtf.maxAbs 6.86e-13 (3 of 3) |
| catalog-carl-zeiss-distagon-t-25f28-contax | 3 | PASS: mtf.maxAbs 8.81e-13 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 2.61e-12 (3 of 3) |
| catalog-carl-zeiss-jena-biometar-120f28 | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 8.63e-13 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) |
| catalog-carl-zeiss-jena-biometar-80f28 | 3 | PASS: mtf.maxAbs 8.17e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| catalog-carl-zeiss-jena-pancolar-50f2 | 3 | PASS: mtf.maxAbs 8.39e-13 (3 of 3) | PASS: mtf.maxAbs 6.50e-13 (3 of 3) | PASS: mtf.maxAbs 7.77e-13 (3 of 3) |
| catalog-carl-zeiss-jena-pi-flektogon-30mm-f28-printed-1975-eline | 3 | PASS: mtf.maxAbs 3.50e-13 (3 of 3) | PASS: mtf.maxAbs 2.75e-13 (3 of 3) | PASS: mtf.maxAbs 5.42e-13 (3 of 3) |
| catalog-carl-zeiss-planar-80mm-f28-graflex-xl | 3 | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) |
| catalog-carl-zeiss-tele-tessar-500mm-f8-c | 3 | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 2.20e-12 (3 of 3) |
| catalog-carl-zeiss-tessar-50f35 | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 9.42e-13 (3 of 3) | PASS: mtf.maxAbs 7.09e-13 (3 of 3) |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-wide | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 7.61e-13 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-tele | 3 | PASS: mtf.maxAbs 2.85e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.08e-12 (3 of 3) |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-wide | 3 | PASS: mtf.maxAbs 3.25e-13 (3 of 3) | PASS: mtf.maxAbs 4.87e-12 (3 of 3) | PASS: mtf.maxAbs 5.01e-12 (3 of 3) |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-tele | 3 | PASS: mtf.maxAbs 7.32e-13 (3 of 3) | PASS: mtf.maxAbs 2.51e-12 (3 of 3) | PASS: mtf.maxAbs 2.41e-12 (3 of 3) |
| catalog-color-skopar-28f28 | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-czj-flektogon-20-f4 | 3 | PASS: mtf.maxAbs 2.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 2.47e-12 (3 of 3) |
| catalog-czj-tessar-50-f28 | 3 | PASS: mtf.maxAbs 5.15e-13 (3 of 3) | PASS: mtf.maxAbs 4.69e-13 (3 of 3) | PASS: mtf.maxAbs 5.37e-13 (3 of 3) |
| catalog-elmarit-r-28f28 | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 6.16e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-enna-munchen-lithagon-24mm-f4 | 3 | PASS: mtf.maxAbs 2.91e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 2.43e-12 (3 of 3) |
| catalog-enna-munchen-lithagon-35mm-f35 | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 5.21e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-enna-munchen-ultra-lithagon-28mm-f35 | 3 | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 8.03e-13 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) |
| catalog-fuji-xf-16-55-f28-wide | 3 | PASS: mtf.maxAbs 9.88e-12 (3 of 3) | PASS: mtf.maxAbs 3.18e-12 (3 of 3) | PASS: mtf.maxAbs 8.97e-12 (3 of 3) |
| catalog-fuji-xf-16-55-f28-tele | 3 | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-11 (3 of 3) | PASS: mtf.maxAbs 1.57e-11 (3 of 3) |
| catalog-fuji-xf-50140mm-f28-wide | 3 | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) |
| catalog-fuji-xf-50140mm-f28-tele | 3 | PASS: mtf.maxAbs 2.70e-12 (3 of 3) | PASS: mtf.maxAbs 1.79e-12 (3 of 3) | PASS: mtf.maxAbs 4.40e-12 (3 of 3) |
| catalog-fujifilm-fujinar-210mm-f45 | 3 | PASS: mtf.maxAbs 7.38e-12 (3 of 3) | PASS: mtf.maxAbs 2.50e-11 (3 of 3) | PASS: mtf.maxAbs 2.85e-11 (3 of 3) |
| catalog-fujifilm-fujinon-85mm-f4-sf-ebc | 3 | PASS: mtf.maxAbs 8.32e-13 (3 of 3) | PASS: mtf.maxAbs 5.21e-13 (3 of 3) | PASS: mtf.maxAbs 7.93e-13 (3 of 3) |
| catalog-fujifilm-fujinon-gf-30mm-f35-r-wr | 3 | PASS: mtf.maxAbs 2.59e-11 (3 of 3) | PASS: mtf.maxAbs 1.31e-11 (3 of 3) | PASS: mtf.maxAbs 1.54e-11 (3 of 3) |
| catalog-fujifilm-fujinon-gf-500mm-f56-r-lm-ois-wr | 3 | PASS: mtf.maxAbs 3.43e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 4.55e-12 (3 of 3) |
| catalog-fujifilm-fujinon-gf-50mm-f35-r-lm-wr | 3 | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 3.42e-12 (3 of 3) | PASS: mtf.maxAbs 3.35e-12 (3 of 3) |
| catalog-fujifilm-fujinon-gf-63mm-f28-r-wr | 3 | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 6.74e-13 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) |
| catalog-fujifilm-fujinon-sw-65f56 | 3 | PASS: mtf.maxAbs 6.04e-13 (3 of 3) | PASS: mtf.maxAbs 9.20e-13 (3 of 3) | PASS: mtf.maxAbs 6.13e-13 (3 of 3) |
| catalog-fujifilm-fujinon-w-35mm-f19 | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 8.23e-13 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-wide | 3 | PASS: mtf.maxAbs 2.58e-11 (3 of 3) | PASS: mtf.maxAbs 3.04e-11 (3 of 3) | PASS: mtf.maxAbs 5.75e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-tele | 3 | PASS: mtf.maxAbs 1.21e-11 (3 of 3) | PASS: mtf.maxAbs 1.14e-11 (3 of 3) | PASS: mtf.maxAbs 3.19e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-wide | 3 | PASS: mtf.maxAbs 2.64e-11 (3 of 3) | PASS: mtf.maxAbs 1.32e-11 (3 of 3) | PASS: mtf.maxAbs 2.31e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-tele | 3 | PASS: mtf.maxAbs 4.80e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 5.56e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | 3 | PASS: mtf.maxAbs 3.00e-11 (3 of 3) | PASS: mtf.maxAbs 3.34e-11 (3 of 3) | PASS: mtf.maxAbs 4.48e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-tele | 3 | PASS: mtf.maxAbs 2.63e-11 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) | PASS: mtf.maxAbs 2.86e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-wide | 3 | PASS: mtf.maxAbs 8.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 8.82e-13 (3 of 3) |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-tele | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-wide | 3 | PASS: mtf.maxAbs 2.87e-12 (3 of 3) | PASS: mtf.maxAbs 2.77e-12 (3 of 3) | PASS: mtf.maxAbs 2.64e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-tele | 3 | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 3.88e-12 (3 of 3) | PASS: mtf.maxAbs 2.90e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-wide | 3 | PASS: mtf.maxAbs 2.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 3.01e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-tele | 3 | PASS: mtf.maxAbs 3.32e-12 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 4.30e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | 3 | PASS: mtf.maxAbs 3.28e-10 (3 of 3) | PASS: mtf.maxAbs 3.70e-10 (3 of 3) | PASS: mtf.maxAbs 2.58e-10 (3 of 3) |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-wide | 3 | PASS: mtf.maxAbs 8.84e-12 (3 of 3) | PASS: mtf.maxAbs 5.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-tele | 3 | PASS: mtf.maxAbs 7.18e-12 (3 of 3) | PASS: mtf.maxAbs 8.30e-12 (3 of 3) | PASS: mtf.maxAbs 6.32e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-16mm-f14-r-wr | 3 | PASS: mtf.maxAbs 7.39e-12 (3 of 3) | PASS: mtf.maxAbs 7.12e-12 (3 of 3) | PASS: mtf.maxAbs 3.07e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-16mm-f28-r-wr | 3 | PASS: mtf.maxAbs 1.09e-11 (3 of 3) | PASS: mtf.maxAbs 9.43e-12 (3 of 3) | PASS: mtf.maxAbs 6.53e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-wide | 3 | PASS: mtf.maxAbs 5.12e-12 (3 of 3) | PASS: mtf.maxAbs 4.49e-12 (3 of 3) | PASS: mtf.maxAbs 5.38e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-tele | 3 | PASS: mtf.maxAbs 1.23e-11 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-wide | 3 | PASS: mtf.maxAbs 9.49e-12 (3 of 3) | PASS: mtf.maxAbs 9.29e-12 (3 of 3) | PASS: mtf.maxAbs 6.33e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-tele | 3 | PASS: mtf.maxAbs 3.22e-12 (3 of 3) | PASS: mtf.maxAbs 7.28e-12 (3 of 3) | PASS: mtf.maxAbs 8.38e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-wide | 3 | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 3.76e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-tele | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 5.25e-12 (3 of 3) | PASS: mtf.maxAbs 5.41e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18mm-f14-r-lm-wr | 3 | PASS: mtf.maxAbs 5.98e-12 (3 of 3) | PASS: mtf.maxAbs 7.29e-12 (3 of 3) | PASS: mtf.maxAbs 4.33e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-27mm-f28 | 3 | PASS: mtf.maxAbs 1.77e-9 (3 of 3) | PASS: mtf.maxAbs 1.78e-9 (3 of 3) | PASS: mtf.maxAbs 1.99e-9 (3 of 3) |
| catalog-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro | 3 | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 6.06e-12 (3 of 3) | PASS: mtf.maxAbs 5.92e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-35mm-f2-r-wr | 3 | PASS: mtf.maxAbs 7.29e-11 (3 of 3) | PASS: mtf.maxAbs 2.25e-11 (3 of 3) | PASS: mtf.maxAbs 6.77e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-50mm-f2-r-wr | 3 | PASS: mtf.maxAbs 9.15e-13 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-wide | 3 | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 3.35e-12 (3 of 3) | PASS: mtf.maxAbs 2.53e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-tele | 3 | PASS: mtf.maxAbs 2.93e-12 (3 of 3) | PASS: mtf.maxAbs 9.93e-13 (3 of 3) | PASS: mtf.maxAbs 3.34e-12 (3 of 3) |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | 3 | PASS: mtf.maxAbs 1.86e-9 (3 of 3) | PASS: mtf.maxAbs 4.19e-10 (3 of 3) | PASS: mtf.maxAbs 1.88e-9 (3 of 3) |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-tele | 3 | PASS: mtf.maxAbs 1.06e-10 (3 of 3) | PASS: mtf.maxAbs 6.05e-11 (3 of 3) | PASS: mtf.maxAbs 8.15e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-8mm-f35-r-wr | 3 | PASS: mtf.maxAbs 1.05e-10 (3 of 3) | PASS: mtf.maxAbs 9.51e-11 (3 of 3) | PASS: mtf.maxAbs 3.96e-11 (3 of 3) |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-wide | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-tele | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 8.68e-13 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) |
| catalog-fujifilm-ga645-pro-60mm-f4 | 3 | PASS: mtf.maxAbs 8.60e-13 (3 of 3) | PASS: mtf.maxAbs 6.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) |
| catalog-fujifilm-ga645widepro-45mm-f4 | 3 | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 7.43e-13 (3 of 3) | PASS: mtf.maxAbs 1.72e-12 (3 of 3) |
| catalog-fujifilm-gf-100-200mm-f56-wide | 3 | PASS: mtf.maxAbs 5.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 5.52e-12 (3 of 3) |
| catalog-fujifilm-gf-100-200mm-f56-tele | 3 | PASS: mtf.maxAbs 5.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 5.46e-12 (3 of 3) |
| catalog-fujifilm-gf-110mm-f2 | 3 | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 2.76e-12 (3 of 3) |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-wide | 3 | PASS: mtf.maxAbs 3.95e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-11 (3 of 3) | PASS: mtf.maxAbs 1.19e-11 (3 of 3) |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-tele | 3 | PASS: mtf.maxAbs 2.85e-12 (3 of 3) | PASS: mtf.maxAbs 1.48e-11 (3 of 3) | PASS: mtf.maxAbs 1.55e-11 (3 of 3) |
| catalog-fujifilm-gf-23mm-f4 | 3 | PASS: mtf.maxAbs 1.38e-10 (3 of 3) | PASS: mtf.maxAbs 1.91e-10 (3 of 3) | PASS: mtf.maxAbs 6.73e-11 (3 of 3) |
| catalog-fujifilm-gf-30mm-f56-ts | 3 | PASS: mtf.maxAbs 4.56e-12 (3 of 3) | PASS: mtf.maxAbs 9.79e-12 (3 of 3) | PASS: mtf.maxAbs 9.58e-12 (3 of 3) |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-wide | 2 | PASS: mtf.maxAbs 7.09e-12 (2 of 2) | PASS: mtf.maxAbs 3.77e-12 (2 of 2) | PASS: mtf.maxAbs 3.34e-12 (2 of 2) |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-tele | 3 | PASS: mtf.maxAbs 3.82e-12 (3 of 3) | PASS: mtf.maxAbs 5.58e-12 (3 of 3) | PASS: mtf.maxAbs 5.75e-12 (3 of 3) |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-wide | 3 | PASS: mtf.maxAbs 6.27e-13 (3 of 3) | PASS: mtf.maxAbs 4.87e-12 (3 of 3) | PASS: mtf.maxAbs 5.01e-12 (3 of 3) |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-tele | 3 | PASS: mtf.maxAbs 8.92e-13 (3 of 3) | PASS: mtf.maxAbs 1.35e-11 (3 of 3) | PASS: mtf.maxAbs 1.28e-11 (3 of 3) |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-wide | 3 | PASS: mtf.maxAbs 3.28e-12 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-tele | 3 | PASS: mtf.maxAbs 2.84e-12 (3 of 3) | PASS: mtf.maxAbs 5.54e-12 (3 of 3) | PASS: mtf.maxAbs 8.38e-12 (3 of 3) |
| catalog-fujifilm-gf-45mm-f28-r-wr | 3 | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) | PASS: mtf.maxAbs 5.14e-12 (3 of 3) |
| catalog-fujifilm-gf250mm-f4-r-lm-ois-wr | 3 | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.47e-12 (3 of 3) |
| catalog-fujifilm-gf55mm-f17-r-wr | 3 | PASS: mtf.maxAbs 9.27e-12 (3 of 3) | PASS: mtf.maxAbs 8.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.66e-11 (3 of 3) |
| catalog-fujifilm-gf80-f17 | 2 | PASS: mtf.maxAbs 1.85e-12 (2 of 2) | PASS: mtf.maxAbs 2.98e-12 (2 of 2) | PASS: mtf.maxAbs 4.29e-12 (2 of 2) |
| catalog-fujifilm-gfx100rf-35mm-f4 | 3 | PASS: mtf.maxAbs 2.20e-11 (3 of 3) | PASS: mtf.maxAbs 1.97e-11 (3 of 3) | PASS: mtf.maxAbs 1.75e-11 (3 of 3) |
| catalog-fujifilm-natura-s-24mm-f19 | 3 | PASS: mtf.maxAbs 2.54e-11 (3 of 3) | PASS: mtf.maxAbs 3.02e-11 (3 of 3) | PASS: mtf.maxAbs 1.73e-11 (3 of 3) |
| catalog-fujifilm-x-fujinon-w-24mm-f28-dm-ebc | 3 | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 8.64e-13 (3 of 3) | PASS: mtf.maxAbs 8.13e-13 (3 of 3) |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-wide | 2 | PASS: mtf.maxAbs 3.43e-13 (2 of 2) | PASS: mtf.maxAbs 2.93e-12 (2 of 2) | PASS: mtf.maxAbs 2.83e-12 (2 of 2) |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-tele | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-11 (3 of 3) | PASS: mtf.maxAbs 1.90e-11 (3 of 3) |
| catalog-fujifilm-x100-23f2 | 3 | PASS: mtf.maxAbs 7.92e-11 (3 of 3) | PASS: mtf.maxAbs 5.38e-11 (3 of 3) | PASS: mtf.maxAbs 2.53e-11 (3 of 3) |
| catalog-fujifilm-x100-tcl-x100 | 3 | PASS: mtf.maxAbs 1.66e-10 (3 of 3) | PASS: mtf.maxAbs 1.50e-10 (3 of 3) | PASS: mtf.maxAbs 2.12e-11 (3 of 3) |
| catalog-fujifilm-x100v-23f2 | 3 | PASS: mtf.maxAbs 2.18e-11 (3 of 3) | PASS: mtf.maxAbs 2.25e-11 (3 of 3) | PASS: mtf.maxAbs 1.00e-11 (3 of 3) |
| catalog-fujifilm-x70-18mm-f28 | 3 | PASS: mtf.maxAbs 5.82e-11 (3 of 3) | PASS: mtf.maxAbs 4.67e-11 (3 of 3) | PASS: mtf.maxAbs 2.20e-11 (3 of 3) |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-wide | 3 | PASS: mtf.maxAbs 1.37e-11 (3 of 3) | PASS: mtf.maxAbs 5.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-11 (3 of 3) |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-tele | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 7.61e-12 (3 of 3) | PASS: mtf.maxAbs 7.05e-12 (3 of 3) |
| catalog-fujifilm-xf-16-80-f4-wide | 3 | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 1.31e-11 (3 of 3) | PASS: mtf.maxAbs 1.23e-11 (3 of 3) |
| catalog-fujifilm-xf-16-80-f4-tele | 3 | PASS: mtf.maxAbs 6.06e-12 (3 of 3) | PASS: mtf.maxAbs 4.08e-12 (3 of 3) | PASS: mtf.maxAbs 5.84e-12 (3 of 3) |
| catalog-fujifilm-xf-200-f2 | 3 | PASS: mtf.maxAbs 2.59e-12 (3 of 3) | PASS: mtf.maxAbs 2.40e-12 (3 of 3) | PASS: mtf.maxAbs 4.82e-12 (3 of 3) |
| catalog-fujifilm-xf-23mm-f14-r-lm-wr | 3 | PASS: mtf.maxAbs 5.31e-12 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) | PASS: mtf.maxAbs 4.26e-12 (3 of 3) |
| catalog-fujifilm-xf-23mm-f2-r-wr | 3 | PASS: mtf.maxAbs 1.80e-11 (3 of 3) | PASS: mtf.maxAbs 1.31e-11 (3 of 3) | PASS: mtf.maxAbs 9.50e-12 (3 of 3) |
| catalog-fujifilm-xf-23mm-f28-r-wr | 3 | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) | PASS: mtf.maxAbs 3.39e-12 (3 of 3) |
| catalog-fujifilm-xf-33mm-f14-r-lm-wr | 3 | PASS: mtf.maxAbs 2.50e-12 (3 of 3) | PASS: mtf.maxAbs 4.69e-12 (3 of 3) | PASS: mtf.maxAbs 4.34e-12 (3 of 3) |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-wide | 3 | PASS: mtf.maxAbs 9.28e-13 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-tele | 3 | PASS: mtf.maxAbs 1.46e-12 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) |
| catalog-fujifilm-xf18f2r | 3 | PASS: mtf.maxAbs 5.60e-12 (3 of 3) | PASS: mtf.maxAbs 6.85e-12 (3 of 3) | PASS: mtf.maxAbs 4.57e-12 (3 of 3) |
| catalog-fujifilm-xf35-f14-r | 3 | PASS: mtf.maxAbs 2.13e-10 (3 of 3) | PASS: mtf.maxAbs 1.02e-10 (3 of 3) | PASS: mtf.maxAbs 2.11e-10 (3 of 3) |
| catalog-fujifilm-xf50-f1 | 3 | PASS: mtf.maxAbs 7.97e-12 (3 of 3) | PASS: mtf.maxAbs 3.59e-12 (3 of 3) | PASS: mtf.maxAbs 7.54e-12 (3 of 3) |
| catalog-fujifilm-xf56mm-f12-r-wr | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 3.84e-12 (3 of 3) | PASS: mtf.maxAbs 4.30e-12 (3 of 3) |
| catalog-fujifilm-xf60-f24-r-macro | 3 | PASS: mtf.maxAbs 7.54e-13 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.84e-12 (3 of 3) |
| catalog-fujifilm-xf80-f28-macro | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 2.50e-12 (3 of 3) |
| catalog-fujifilm-xf90f2 | 3 | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.04e-12 (3 of 3) |
| catalog-fujinon-xf-23mm-f14-r | 3 | PASS: mtf.maxAbs 4.32e-11 (3 of 3) | PASS: mtf.maxAbs 3.26e-11 (3 of 3) | PASS: mtf.maxAbs 1.74e-11 (3 of 3) |
| catalog-fujinon-xf56f12r | 3 | PASS: mtf.maxAbs 4.17e-11 (3 of 3) | PASS: mtf.maxAbs 3.97e-11 (3 of 3) | PASS: mtf.maxAbs 4.93e-11 (3 of 3) |
| catalog-gf-120f4-macro | 3 | PASS: mtf.maxAbs 2.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 2.79e-12 (3 of 3) |
| catalog-hasselblad-hc-150-f32 | 3 | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 6.97e-13 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) |
| catalog-hasselblad-hc-210-f4 | 3 | PASS: mtf.maxAbs 3.63e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) |
| catalog-hasselblad-hc-300-f4p5 | 3 | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.69e-12 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) |
| catalog-hasselblad-hc-35mm-f35-fujinon | 3 | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 4.83e-13 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) |
| catalog-hasselblad-hc-50-f35 | 3 | PASS: mtf.maxAbs 7.55e-13 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) | PASS: mtf.maxAbs 2.51e-12 (3 of 3) |
| catalog-hasselblad-hc-50f35-ii | 3 | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 8.24e-13 (3 of 3) | PASS: mtf.maxAbs 1.72e-12 (3 of 3) |
| catalog-hasselblad-hc-80-f28 | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 9.69e-13 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-hasselblad-hc-macro-4-120 | 3 | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.41e-12 (3 of 3) |
| catalog-hasselblad-xcd-120-f35-macro | 3 | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) | PASS: mtf.maxAbs 1.72e-12 (3 of 3) |
| catalog-hasselblad-xcd-25mm-f25-v | 3 | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-11 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) |
| catalog-hasselblad-xcd-30mm-f35 | 3 | PASS: mtf.maxAbs 3.01e-12 (3 of 3) | PASS: mtf.maxAbs 5.00e-12 (3 of 3) | PASS: mtf.maxAbs 4.60e-12 (3 of 3) |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-wide | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 1.52e-11 (3 of 3) | PASS: mtf.maxAbs 1.47e-11 (3 of 3) |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-tele | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 3.84e-12 (3 of 3) | PASS: mtf.maxAbs 4.18e-12 (3 of 3) |
| catalog-hasselblad-xcd-45f35 | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) |
| catalog-hasselblad-xcd-65-f28 | 3 | PASS: mtf.maxAbs 8.51e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 6.32e-13 (3 of 3) |
| catalog-hasselblad-xcd-90-f25-v | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 5.37e-12 (3 of 3) | PASS: mtf.maxAbs 5.46e-12 (3 of 3) |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-wide | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-tele | 3 | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-wide | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 8.40e-13 (3 of 3) | PASS: mtf.maxAbs 9.90e-13 (3 of 3) |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-tele | 3 | PASS: mtf.maxAbs 3.70e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 4.33e-12 (3 of 3) |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-wide | 3 | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-tele | 3 | PASS: mtf.maxAbs 2.22e-12 (3 of 3) | PASS: mtf.maxAbs 4.49e-12 (3 of 3) | PASS: mtf.maxAbs 4.60e-12 (3 of 3) |
| catalog-heliar-symmetric-1902 | 3 | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) |
| catalog-industar-itmo2013-v2 | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 8.77e-13 (3 of 3) | PASS: mtf.maxAbs 9.77e-13 (3 of 3) |
| catalog-kinoptik-super-tegea-19mm-f19-fisheye | 2 | PASS: mtf.maxAbs 5.97e-13 (2 of 2) | PASS: mtf.maxAbs 8.17e-13 (2 of 2) | PASS: mtf.maxAbs 6.90e-13 (2 of 2) |
| catalog-kinoptik-tegea-57mm-f18 | 3 | PASS: mtf.maxAbs 7.59e-13 (3 of 3) | PASS: mtf.maxAbs 4.62e-13 (3 of 3) | PASS: mtf.maxAbs 6.03e-13 (3 of 3) |
| catalog-kinoptik-tegea-98mm-f18 | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 9.83e-13 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) |
| catalog-kodak-aero-ektar-6in-f35 | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 6.74e-13 (3 of 3) | PASS: mtf.maxAbs 7.05e-13 (3 of 3) |
| catalog-kodak-ektar-50f35 | 3 | PASS: mtf.maxAbs 7.84e-13 (3 of 3) | PASS: mtf.maxAbs 4.00e-13 (3 of 3) | PASS: mtf.maxAbs 6.87e-13 (3 of 3) |
| catalog-kodak-ektar-52f15 | 3 | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 7.72e-13 (3 of 3) | PASS: mtf.maxAbs 8.06e-13 (3 of 3) |
| catalog-kodak-enlarging-ektar-100mm-f45 | 3 | PASS: mtf.maxAbs 3.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 2.65e-12 (3 of 3) |
| catalog-kodak-wide-field-ektar-100f63 | 3 | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) |
| catalog-konica-fl-hexanon-ar-300mm-f63 | 3 | PASS: mtf.maxAbs 3.66e-12 (3 of 3) | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 3.08e-12 (3 of 3) |
| catalog-konica-hexanon-135mm-f35 | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) |
| catalog-konica-hexanon-38mm-f28 | 3 | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 6.50e-13 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| catalog-konica-hexanon-60f12 | 3 | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 8.44e-13 (3 of 3) | PASS: mtf.maxAbs 7.85e-13 (3 of 3) |
| catalog-konica-hexanon-ar-135mm-f3-5 | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 7.18e-13 (3 of 3) |
| catalog-konica-hexanon-ar-21mm-f2-8 | 3 | PASS: mtf.maxAbs 7.86e-13 (3 of 3) | PASS: mtf.maxAbs 8.11e-13 (3 of 3) | PASS: mtf.maxAbs 5.03e-13 (3 of 3) |
| catalog-konica-hexanon-ar-24mm-f2-8 | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 4.70e-13 (3 of 3) | PASS: mtf.maxAbs 8.70e-13 (3 of 3) |
| catalog-konica-hexanon-ar-35mm-f28 | 3 | PASS: mtf.maxAbs 6.98e-13 (3 of 3) | PASS: mtf.maxAbs 9.34e-13 (3 of 3) | PASS: mtf.maxAbs 5.95e-13 (3 of 3) |
| catalog-konica-hexanon-ar-40mm-f18 | 3 | PASS: mtf.maxAbs 9.41e-13 (3 of 3) | PASS: mtf.maxAbs 5.25e-13 (3 of 3) | PASS: mtf.maxAbs 6.48e-13 (3 of 3) |
| catalog-konica-hexanon-ar-50mm-f1-8 | 3 | PASS: mtf.maxAbs 9.27e-13 (3 of 3) | PASS: mtf.maxAbs 8.48e-13 (3 of 3) | PASS: mtf.maxAbs 4.96e-13 (3 of 3) |
| catalog-konica-hexar-35f2 | 3 | PASS: mtf.maxAbs 9.03e-13 (3 of 3) | PASS: mtf.maxAbs 6.58e-13 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) |
| catalog-konica-uc-hexanon-ar-28mm-f1-8 | 3 | PASS: mtf.maxAbs 6.13e-13 (3 of 3) | PASS: mtf.maxAbs 3.34e-13 (3 of 3) | PASS: mtf.maxAbs 6.48e-13 (3 of 3) |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-wide | 3 | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 8.45e-13 (3 of 3) |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-tele | 3 | PASS: mtf.maxAbs 9.92e-13 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-wide | 3 | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-tele | 3 | PASS: mtf.maxAbs 1.78e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-wide | 2 | PASS: mtf.maxAbs 1.06e-12 (2 of 2) | PASS: mtf.maxAbs 6.41e-13 (2 of 2) | PASS: mtf.maxAbs 7.92e-13 (2 of 2) |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-tele | 3 | PASS: mtf.maxAbs 2.62e-12 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.78e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-wide | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 8.99e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-tele | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-wide | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-tele | 3 | PASS: mtf.maxAbs 9.29e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-wide | 3 | PASS: mtf.maxAbs 8.48e-13 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.44e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-tele | 3 | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 2.27e-12 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-wide | 3 | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 9.41e-13 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-tele | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) |
| catalog-laowa-100mm-f28-tilt-shift-1x-macro | 3 | PASS: mtf.maxAbs 4.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| catalog-laowa-105mm-f2-stf | 3 | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 6.85e-13 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) |
| catalog-laowa-12mm-f28-zero-d | 3 | PASS: mtf.maxAbs 6.80e-12 (3 of 3) | PASS: mtf.maxAbs 7.88e-12 (3 of 3) | PASS: mtf.maxAbs 6.25e-12 (3 of 3) |
| catalog-laowa-15f4-macro | 3 | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) |
| catalog-laowa-15mm-f2-zero-d | 3 | PASS: mtf.maxAbs 8.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-11 (3 of 3) | PASS: mtf.maxAbs 1.29e-11 (3 of 3) |
| catalog-laowa-180mm-f45-ultra-macro-apo | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 6.91e-13 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| catalog-laowa-180mm-f45-ultra-macro-apo-af | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 6.91e-13 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| catalog-laowa-24f14-probe | 3 | PASS: mtf.maxAbs 6.58e-11 (3 of 3) | PASS: mtf.maxAbs 6.52e-12 (3 of 3) | PASS: mtf.maxAbs 6.42e-11 (3 of 3) |
| catalog-laowa-55mm-f28-tilt-shift-1x-macro | 3 | PASS: mtf.maxAbs 2.42e-12 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) |
| catalog-laowa-58mm-f28-2x-macro-apo | 2 | PASS: mtf.maxAbs 6.61e-13 (2 of 2) | PASS: mtf.maxAbs 5.22e-13 (2 of 2) | PASS: mtf.maxAbs 4.82e-13 (2 of 2) |
| catalog-laowa-65mm-f28-macro-apo | 2 | PASS: mtf.maxAbs 3.42e-13 (2 of 2) | PASS: mtf.maxAbs 6.14e-13 (2 of 2) | PASS: mtf.maxAbs 6.99e-13 (2 of 2) |
| catalog-laowa-90mm-f28-ultra-macro-apo | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 8.65e-13 (3 of 3) | PASS: mtf.maxAbs 6.76e-13 (3 of 3) |
| catalog-laowa-argus-45mm-f095-ff | 3 | PASS: mtf.maxAbs 5.11e-12 (3 of 3) | PASS: mtf.maxAbs 6.90e-12 (3 of 3) | PASS: mtf.maxAbs 4.94e-12 (3 of 3) |
| catalog-leica-apo-macro-elmarit-tl-60-f28 | 3 | PASS: mtf.maxAbs 9.87e-13 (3 of 3) | PASS: mtf.maxAbs 4.35e-12 (3 of 3) | PASS: mtf.maxAbs 5.34e-12 (3 of 3) |
| catalog-leica-apo-summicron-43f2 | 2 | PASS: mtf.maxAbs 4.67e-13 (2 of 2) | PASS: mtf.maxAbs 1.21e-12 (2 of 2) | PASS: mtf.maxAbs 1.02e-12 (2 of 2) |
| catalog-leica-apo-summicron-m-35f2 | 3 | PASS: mtf.maxAbs 2.23e-11 (3 of 3) | PASS: mtf.maxAbs 2.63e-11 (3 of 3) | PASS: mtf.maxAbs 4.28e-11 (3 of 3) |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-wide | 3 | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-tele | 3 | PASS: mtf.maxAbs 3.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) |
| catalog-leica-colorplan-90mm-f25 | 3 | PASS: mtf.maxAbs 6.55e-13 (3 of 3) | PASS: mtf.maxAbs 4.71e-13 (3 of 3) | PASS: mtf.maxAbs 5.75e-13 (3 of 3) |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-wide | 2 | PASS: mtf.maxAbs 6.56e-14 (2 of 2) | PASS: mtf.maxAbs 3.65e-12 (2 of 2) | PASS: mtf.maxAbs 3.62e-12 (2 of 2) |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-tele | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 4.44e-12 (3 of 3) | PASS: mtf.maxAbs 3.80e-12 (3 of 3) |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-wide | 2 | PASS: mtf.maxAbs 2.08e-12 (2 of 2) | PASS: mtf.maxAbs 8.47e-12 (2 of 2) | PASS: mtf.maxAbs 7.23e-12 (2 of 2) |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-tele | 3 | PASS: mtf.maxAbs 8.11e-13 (3 of 3) | PASS: mtf.maxAbs 3.24e-12 (3 of 3) | PASS: mtf.maxAbs 2.74e-12 (3 of 3) |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-wide | 2 | PASS: mtf.maxAbs 4.26e-13 (2 of 2) | PASS: mtf.maxAbs 6.05e-13 (2 of 2) | PASS: mtf.maxAbs 6.30e-13 (2 of 2) |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-tele | 2 | PASS: mtf.maxAbs 6.09e-13 (2 of 2) | PASS: mtf.maxAbs 2.29e-12 (2 of 2) | PASS: mtf.maxAbs 2.30e-12 (2 of 2) |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-wide | 2 | PASS: mtf.maxAbs 3.10e-13 (2 of 2) | PASS: mtf.maxAbs 3.87e-12 (2 of 2) | PASS: mtf.maxAbs 3.82e-12 (2 of 2) |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-tele | 3 | PASS: mtf.maxAbs 4.29e-13 (3 of 3) | PASS: mtf.maxAbs 5.17e-12 (3 of 3) | PASS: mtf.maxAbs 5.11e-12 (3 of 3) |
| catalog-leica-elcan-50f2 | 3 | PASS: mtf.maxAbs 6.50e-13 (3 of 3) | PASS: mtf.maxAbs 4.21e-13 (3 of 3) | PASS: mtf.maxAbs 5.31e-13 (3 of 3) |
| catalog-leica-elmar-35mm-f35-mini-ii | 3 | PASS: mtf.maxAbs 8.16e-13 (3 of 3) | PASS: mtf.maxAbs 7.13e-13 (3 of 3) | PASS: mtf.maxAbs 8.74e-13 (3 of 3) |
| catalog-leica-elmar-m-135mm-f4 | 3 | PASS: mtf.maxAbs 5.69e-13 (3 of 3) | PASS: mtf.maxAbs 3.86e-13 (3 of 3) | PASS: mtf.maxAbs 5.25e-13 (3 of 3) |
| catalog-leica-elmarit-28mm-f28-11801 | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) |
| catalog-leica-elmarit-90f28 | 3 | PASS: mtf.maxAbs 7.82e-13 (3 of 3) | PASS: mtf.maxAbs 6.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-leica-elmarit-m-135mm-f28 | 3 | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 7.07e-13 (3 of 3) | PASS: mtf.maxAbs 7.42e-13 (3 of 3) |
| catalog-leica-elmarit-r-35mm-f28 | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 8.77e-13 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) |
| catalog-leica-elmarit-tl-18mm-f28 | 3 | PASS: mtf.maxAbs 1.53e-12 (3 of 3) | PASS: mtf.maxAbs 6.77e-12 (3 of 3) | PASS: mtf.maxAbs 6.82e-12 (3 of 3) |
| catalog-leica-macro-elmar-m-90mm-f4 | 3 | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-13 (3 of 3) | PASS: mtf.maxAbs 7.00e-13 (3 of 3) |
| catalog-leica-macro-elmarit-r-60mm-f28 | 3 | PASS: mtf.maxAbs 6.55e-13 (3 of 3) | PASS: mtf.maxAbs 4.45e-13 (3 of 3) | PASS: mtf.maxAbs 5.87e-13 (3 of 3) |
| catalog-leica-noctilux-50mm-f12 | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 3.77e-12 (3 of 3) | PASS: mtf.maxAbs 4.07e-12 (3 of 3) |
| catalog-leica-noctilux-m-35mm-f12-asph | 3 | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 2.90e-12 (3 of 3) | PASS: mtf.maxAbs 3.63e-12 (3 of 3) |
| catalog-leica-summicron-35mm-f2-i | 3 | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 6.59e-13 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) |
| catalog-leica-summicron-c-40mm-f2 | 3 | PASS: mtf.maxAbs 7.46e-13 (3 of 3) | PASS: mtf.maxAbs 8.09e-13 (3 of 3) | PASS: mtf.maxAbs 6.74e-13 (3 of 3) |
| catalog-leica-summicron-m-50f2-v5 | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 3.15e-13 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) |
| catalog-leica-summicron-r-50mm-f2 | 3 | PASS: mtf.maxAbs 6.09e-13 (3 of 3) | PASS: mtf.maxAbs 7.72e-13 (3 of 3) | PASS: mtf.maxAbs 5.89e-13 (3 of 3) |
| catalog-leica-summicron-sl-50mm-f2-asph | 3 | PASS: mtf.maxAbs 9.57e-13 (3 of 3) | PASS: mtf.maxAbs 3.60e-12 (3 of 3) | PASS: mtf.maxAbs 3.19e-12 (3 of 3) |
| catalog-leica-summilux-28f17 | 2 | PASS: mtf.maxAbs 3.22e-13 (2 of 2) | PASS: mtf.maxAbs 3.35e-12 (2 of 2) | PASS: mtf.maxAbs 3.14e-12 (2 of 2) |
| catalog-leica-summilux-c-100mm-t14 | 3 | PASS: mtf.maxAbs 8.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| catalog-leica-summilux-c-18mm-t14 | 3 | PASS: mtf.maxAbs 3.74e-12 (3 of 3) | PASS: mtf.maxAbs 4.70e-12 (3 of 3) | PASS: mtf.maxAbs 8.26e-12 (3 of 3) |
| catalog-leica-summilux-c-40mm-t14 | 3 | PASS: mtf.maxAbs 5.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) | PASS: mtf.maxAbs 5.96e-12 (3 of 3) |
| catalog-leica-summilux-m-35f14 | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) |
| catalog-leica-summilux-m-35mm-f14-aspherical | 3 | PASS: mtf.maxAbs 1.65e-12 (3 of 3) | PASS: mtf.maxAbs 4.47e-12 (3 of 3) | PASS: mtf.maxAbs 4.91e-12 (3 of 3) |
| catalog-leica-summilux-m-50mm-f14-i | 3 | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 7.92e-13 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-leica-summilux-m-50mm-f14-ii | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 8.65e-13 (3 of 3) | PASS: mtf.maxAbs 7.98e-13 (3 of 3) |
| catalog-leica-summilux-sl-50mm-f14-asph-i | 3 | PASS: mtf.maxAbs 2.18e-12 (3 of 3) | PASS: mtf.maxAbs 2.94e-12 (3 of 3) | PASS: mtf.maxAbs 3.43e-12 (3 of 3) |
| catalog-leica-summilux-tl-35mm-f14-asph | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 3.10e-12 (3 of 3) | PASS: mtf.maxAbs 2.75e-12 (3 of 3) |
| catalog-leica-super-angulon-r-21mm-f4 | 3 | PASS: mtf.maxAbs 9.29e-13 (3 of 3) | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 8.58e-13 (3 of 3) |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-wide | 3 | PASS: mtf.maxAbs 2.44e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) | PASS: mtf.maxAbs 3.87e-12 (3 of 3) |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-tele | 3 | PASS: mtf.maxAbs 2.50e-12 (3 of 3) | PASS: mtf.maxAbs 3.17e-12 (3 of 3) | PASS: mtf.maxAbs 3.21e-12 (3 of 3) |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-wide | 2 | PASS: mtf.maxAbs 6.70e-13 (2 of 2) | PASS: mtf.maxAbs 2.05e-12 (2 of 2) | PASS: mtf.maxAbs 1.78e-12 (2 of 2) |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-tele | 3 | PASS: mtf.maxAbs 7.32e-13 (3 of 3) | PASS: mtf.maxAbs 2.82e-11 (3 of 3) | PASS: mtf.maxAbs 2.83e-11 (3 of 3) |
| catalog-leica-telyt-200mm-f4 | 3 | PASS: mtf.maxAbs 6.87e-13 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) |
| catalog-leica-telyt-s-800mm-f63 | 3 | PASS: mtf.maxAbs 3.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) |
| catalog-lumix-s-20-60-f35-56-wide | 3 | PASS: mtf.maxAbs 3.48e-12 (3 of 3) | PASS: mtf.maxAbs 6.22e-12 (3 of 3) | PASS: mtf.maxAbs 6.00e-12 (3 of 3) |
| catalog-lumix-s-20-60-f35-56-tele | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 3.67e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) |
| catalog-mamiya-af-apo-300-f45-if | 3 | PASS: mtf.maxAbs 3.47e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 3.21e-12 (3 of 3) |
| catalog-mamiya-n-210mm-f8-l | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 9.42e-13 (3 of 3) | PASS: mtf.maxAbs 2.49e-12 (3 of 3) |
| catalog-mamiya-sekor-af-150mm-f28-if-d | 3 | PASS: mtf.maxAbs 1.83e-12 (3 of 3) | PASS: mtf.maxAbs 8.91e-13 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) |
| catalog-mamiya-sekor-af-55mm-f28 | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| catalog-mamiya-sekor-c-55mm-f2-8-n | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) |
| catalog-mamiya-sekor-cs-35mm-f2-8 | 3 | PASS: mtf.maxAbs 8.78e-13 (3 of 3) | PASS: mtf.maxAbs 4.51e-13 (3 of 3) | PASS: mtf.maxAbs 6.87e-13 (3 of 3) |
| catalog-mamiya-sekor-macro-c-80f4 | 3 | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.29e-13 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) |
| catalog-mamiya-sekor-sfc-150f4-soft-focus | 3 | PASS: mtf.maxAbs 1.64e-12 (3 of 3) | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 1.64e-12 (3 of 3) |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-wide | 3 | PASS: mtf.maxAbs 1.86e-12 (3 of 3) | PASS: mtf.maxAbs 8.82e-13 (3 of 3) | PASS: mtf.maxAbs 9.94e-13 (3 of 3) |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-tele | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) |
| catalog-meyer-optik-gorlitz-double-plasmat-135mm-f45 | 3 | PASS: mtf.maxAbs 3.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.72e-12 (3 of 3) | PASS: mtf.maxAbs 2.05e-12 (3 of 3) |
| catalog-meyer-optik-gorlitz-kino-plasmat-100-f2 | 3 | PASS: mtf.maxAbs 3.98e-12 (3 of 3) | PASS: mtf.maxAbs 2.71e-12 (3 of 3) | PASS: mtf.maxAbs 3.56e-12 (3 of 3) |
| catalog-meyer-optik-gorlitz-lydith-30f35 | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 5.70e-13 (3 of 3) |
| catalog-meyer-optik-gorlitz-orestegor-500mm-f56 | 3 | PASS: mtf.maxAbs 2.60e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) |
| catalog-meyer-optik-gorlitz-orestor-135f28 | 3 | PASS: mtf.maxAbs 7.17e-13 (3 of 3) | PASS: mtf.maxAbs 6.15e-13 (3 of 3) | PASS: mtf.maxAbs 7.18e-13 (3 of 3) |
| catalog-meyer-optik-gorlitz-primagon-35f45 | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 4.94e-13 (3 of 3) | PASS: mtf.maxAbs 8.29e-13 (3 of 3) |
| catalog-minolta-af-100mm-f2 | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 6.66e-13 (3 of 3) | PASS: mtf.maxAbs 1.26e-12 (3 of 3) |
| catalog-minolta-af-100mm-f28-macro | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 9.25e-13 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) |
| catalog-minolta-af-200mm-f28 | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) |
| catalog-minolta-af-20mm-f28 | 3 | PASS: mtf.maxAbs 1.78e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.99e-12 (3 of 3) |
| catalog-minolta-af-28-70mm-f28-g-wide | 3 | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 4.61e-13 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) |
| catalog-minolta-af-28-70mm-f28-g-tele | 3 | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) |
| catalog-minolta-af-28-75-f28-d-wide | 3 | PASS: mtf.maxAbs 2.82e-12 (3 of 3) | PASS: mtf.maxAbs 5.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.30e-12 (3 of 3) |
| catalog-minolta-af-28-75-f28-d-tele | 3 | PASS: mtf.maxAbs 6.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.70e-12 (3 of 3) | PASS: mtf.maxAbs 4.10e-12 (3 of 3) |
| catalog-minolta-af-28mm-f2 | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 8.95e-13 (3 of 3) |
| catalog-minolta-af-300mm-f28 | 3 | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 5.68e-12 (3 of 3) |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-wide | 3 | PASS: mtf.maxAbs 5.00e-12 (3 of 3) | PASS: mtf.maxAbs 7.83e-12 (3 of 3) | PASS: mtf.maxAbs 7.00e-12 (3 of 3) |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-tele | 3 | PASS: mtf.maxAbs 4.18e-12 (3 of 3) | PASS: mtf.maxAbs 5.90e-12 (3 of 3) | PASS: mtf.maxAbs 6.69e-12 (3 of 3) |
| catalog-minolta-af-35-70-f4-wide | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.72e-12 (3 of 3) |
| catalog-minolta-af-35-70-f4-tele | 3 | PASS: mtf.maxAbs 8.20e-13 (3 of 3) | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 9.23e-13 (3 of 3) |
| catalog-minolta-af-35mm-f14 | 3 | PASS: mtf.maxAbs 9.07e-13 (3 of 3) | PASS: mtf.maxAbs 8.39e-13 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) |
| catalog-minolta-af-35mm-f2 | 3 | PASS: mtf.maxAbs 7.15e-13 (3 of 3) | PASS: mtf.maxAbs 5.40e-13 (3 of 3) | PASS: mtf.maxAbs 8.30e-13 (3 of 3) |
| catalog-minolta-af-400mm-f45-apo-g | 3 | PASS: mtf.maxAbs 3.08e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 3.74e-12 (3 of 3) |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-wide | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 8.23e-13 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-tele | 3 | PASS: mtf.maxAbs 4.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 6.03e-12 (3 of 3) |
| catalog-minolta-af-80-200mm-f28-apo-wide | 3 | PASS: mtf.maxAbs 1.65e-12 (3 of 3) | PASS: mtf.maxAbs 6.93e-13 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| catalog-minolta-af-80-200mm-f28-apo-tele | 3 | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.72e-12 (3 of 3) |
| catalog-minolta-auto-tele-rokkor-100f2 | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 9.57e-13 (3 of 3) |
| catalog-minolta-mc-w-rokkor-sg-28f35-v2 | 3 | PASS: mtf.maxAbs 9.15e-13 (3 of 3) | PASS: mtf.maxAbs 7.16e-13 (3 of 3) | PASS: mtf.maxAbs 6.22e-13 (3 of 3) |
| catalog-minolta-md-135f28 | 3 | PASS: mtf.maxAbs 8.17e-13 (3 of 3) | PASS: mtf.maxAbs 8.76e-13 (3 of 3) | PASS: mtf.maxAbs 9.73e-13 (3 of 3) |
| catalog-minolta-md-28mm-f28-7-7 | 3 | PASS: mtf.maxAbs 7.30e-13 (3 of 3) | PASS: mtf.maxAbs 4.13e-13 (3 of 3) | PASS: mtf.maxAbs 8.52e-13 (3 of 3) |
| catalog-minolta-md-28mm-f28-v2 | 3 | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 5.33e-13 (3 of 3) | PASS: mtf.maxAbs 1.00e-12 (3 of 3) |
| catalog-minolta-md-50f2 | 3 | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 5.36e-13 (3 of 3) | PASS: mtf.maxAbs 6.94e-13 (3 of 3) |
| catalog-minolta-md-apo-tele-600mm-f63 | 3 | PASS: mtf.maxAbs 3.08e-12 (3 of 3) | PASS: mtf.maxAbs 2.04e-12 (3 of 3) | PASS: mtf.maxAbs 3.36e-12 (3 of 3) |
| catalog-minolta-md-rokkor-45f2 | 3 | PASS: mtf.maxAbs 9.37e-13 (3 of 3) | PASS: mtf.maxAbs 4.57e-13 (3 of 3) | PASS: mtf.maxAbs 6.36e-13 (3 of 3) |
| catalog-minolta-md-rokkor-50f14 | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 9.72e-13 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) |
| catalog-minolta-md-tele-rokkor-135mm-f28 | 3 | PASS: mtf.maxAbs 8.01e-13 (3 of 3) | PASS: mtf.maxAbs 4.41e-13 (3 of 3) | PASS: mtf.maxAbs 9.07e-13 (3 of 3) |
| catalog-minolta-md-zoom-24-35-f35-wide | 3 | PASS: mtf.maxAbs 7.47e-13 (3 of 3) | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) |
| catalog-minolta-md-zoom-24-35-f35-tele | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 9.26e-13 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) |
| catalog-minolta-md-zoom-24-50-f4-wide | 3 | PASS: mtf.maxAbs 1.36e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-minolta-md-zoom-24-50-f4-tele | 3 | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| catalog-minolta-md-zoom-28-85-f35-45-wide | 3 | PASS: mtf.maxAbs 1.46e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 7.65e-13 (3 of 3) |
| catalog-minolta-md-zoom-28-85-f35-45-tele | 3 | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.93e-12 (3 of 3) |
| catalog-minolta-md-zoom-35-135mm-f35-45-wide | 3 | PASS: mtf.maxAbs 8.31e-13 (3 of 3) | PASS: mtf.maxAbs 4.60e-13 (3 of 3) | PASS: mtf.maxAbs 8.31e-13 (3 of 3) |
| catalog-minolta-md-zoom-35-135mm-f35-45-tele | 3 | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 8.67e-13 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| catalog-minolta-md-zoom-50-135mm-f35-wide | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) |
| catalog-minolta-md-zoom-50-135mm-f35-tele | 3 | PASS: mtf.maxAbs 1.86e-12 (3 of 3) | PASS: mtf.maxAbs 8.32e-13 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) |
| catalog-minolta-md-zoom-75-150-f4-wide | 3 | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) |
| catalog-minolta-md-zoom-75-150-f4-tele | 3 | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.94e-12 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) |
| catalog-minolta-stf-135f28-t45 | 3 | PASS: mtf.maxAbs 9.81e-13 (3 of 3) | PASS: mtf.maxAbs 9.41e-13 (3 of 3) | PASS: mtf.maxAbs 3.81e-13 (3 of 3) |
| catalog-miranda-auto-e-50mm-f14 | 3 | PASS: mtf.maxAbs 8.59e-13 (3 of 3) | PASS: mtf.maxAbs 7.40e-13 (3 of 3) | PASS: mtf.maxAbs 8.89e-13 (3 of 3) |
| catalog-miranda-auto-ec-135mm-f28 | 3 | PASS: mtf.maxAbs 7.48e-13 (3 of 3) | PASS: mtf.maxAbs 9.56e-13 (3 of 3) | PASS: mtf.maxAbs 7.17e-13 (3 of 3) |
| catalog-miranda-auto-ec-200mm-f35 | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| catalog-miranda-auto-ec-35mm-f28 | 3 | PASS: mtf.maxAbs 9.03e-13 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 7.71e-13 (3 of 3) |
| catalog-nikkor-105-f14e-ed | 3 | PASS: mtf.maxAbs 2.49e-12 (3 of 3) | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 2.20e-12 (3 of 3) |
| catalog-nikkor-24f28 | 3 | PASS: mtf.maxAbs 6.32e-13 (3 of 3) | PASS: mtf.maxAbs 5.09e-13 (3 of 3) | PASS: mtf.maxAbs 5.35e-13 (3 of 3) |
| catalog-nikkor-28f14d | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| catalog-nikkor-85f14-ais | 3 | PASS: mtf.maxAbs 7.46e-13 (3 of 3) | PASS: mtf.maxAbs 7.16e-13 (3 of 3) | PASS: mtf.maxAbs 7.63e-13 (3 of 3) |
| catalog-nikkor-85f14d | 3 | PASS: mtf.maxAbs 9.52e-13 (3 of 3) | PASS: mtf.maxAbs 5.89e-13 (3 of 3) | PASS: mtf.maxAbs 8.16e-13 (3 of 3) |
| catalog-nikkor-85f14g | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.17e-12 (3 of 3) |
| catalog-nikkor-af-28-200-f3556-g-if-ed-wide | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 4.37e-12 (3 of 3) | PASS: mtf.maxAbs 4.54e-12 (3 of 3) |
| catalog-nikkor-af-28-200-f3556-g-if-ed-tele | 3 | PASS: mtf.maxAbs 2.79e-12 (3 of 3) | PASS: mtf.maxAbs 2.46e-12 (3 of 3) | PASS: mtf.maxAbs 2.89e-12 (3 of 3) |
| catalog-nikkor-af-s-58f14g | 3 | PASS: mtf.maxAbs 7.43e-13 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) |
| catalog-nikkor-afs-120-300f28e-wide | 3 | PASS: mtf.maxAbs 6.33e-12 (3 of 3) | PASS: mtf.maxAbs 2.40e-12 (3 of 3) | PASS: mtf.maxAbs 8.73e-12 (3 of 3) |
| catalog-nikkor-afs-120-300f28e-tele | 3 | PASS: mtf.maxAbs 5.94e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 6.76e-12 (3 of 3) |
| catalog-nikkor-afs-14-24f28-wide | 3 | PASS: mtf.maxAbs 4.70e-12 (3 of 3) | PASS: mtf.maxAbs 3.81e-12 (3 of 3) | PASS: mtf.maxAbs 3.72e-12 (3 of 3) |
| catalog-nikkor-afs-14-24f28-tele | 3 | PASS: mtf.maxAbs 2.22e-12 (3 of 3) | PASS: mtf.maxAbs 3.29e-12 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) |
| catalog-nikkor-afs-16-35f4-vr-wide | 3 | PASS: mtf.maxAbs 4.98e-12 (3 of 3) | PASS: mtf.maxAbs 4.53e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) |
| catalog-nikkor-afs-16-35f4-vr-tele | 3 | PASS: mtf.maxAbs 4.61e-12 (3 of 3) | PASS: mtf.maxAbs 4.72e-12 (3 of 3) | PASS: mtf.maxAbs 9.04e-12 (3 of 3) |
| catalog-nikkor-afs-200-500f56e-wide | 3 | PASS: mtf.maxAbs 2.45e-12 (3 of 3) | PASS: mtf.maxAbs 7.65e-13 (3 of 3) | PASS: mtf.maxAbs 2.59e-12 (3 of 3) |
| catalog-nikkor-afs-200-500f56e-tele | 3 | PASS: mtf.maxAbs 3.72e-12 (3 of 3) | PASS: mtf.maxAbs 3.49e-12 (3 of 3) | PASS: mtf.maxAbs 7.21e-12 (3 of 3) |
| catalog-nikkor-afs-24-70-f28e-vr-wide | 3 | PASS: mtf.maxAbs 9.87e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 4.61e-12 (3 of 3) |
| catalog-nikkor-afs-24-70-f28e-vr-tele | 3 | PASS: mtf.maxAbs 2.72e-12 (3 of 3) | PASS: mtf.maxAbs 2.94e-12 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| catalog-nikkor-n-28f2 | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 8.18e-13 (3 of 3) |
| catalog-nikkor-s-auto-50mm-f14 | 3 | PASS: mtf.maxAbs 9.66e-13 (3 of 3) | PASS: mtf.maxAbs 6.04e-13 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) |
| catalog-nikkor-z-100-400-f4556-wide | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 2.45e-12 (3 of 3) |
| catalog-nikkor-z-100-400-f4556-tele | 3 | PASS: mtf.maxAbs 3.15e-12 (3 of 3) | PASS: mtf.maxAbs 4.04e-12 (3 of 3) | PASS: mtf.maxAbs 6.00e-12 (3 of 3) |
| catalog-nikkor-z-14-30f4s-wide | 3 | PASS: mtf.maxAbs 6.65e-12 (3 of 3) | PASS: mtf.maxAbs 6.31e-12 (3 of 3) | PASS: mtf.maxAbs 2.81e-12 (3 of 3) |
| catalog-nikkor-z-14-30f4s-tele | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 6.24e-12 (3 of 3) | PASS: mtf.maxAbs 6.52e-12 (3 of 3) |
| catalog-nikkor-z-24-120f4-wide | 3 | PASS: mtf.maxAbs 3.77e-12 (3 of 3) | PASS: mtf.maxAbs 4.69e-12 (3 of 3) | PASS: mtf.maxAbs 4.48e-12 (3 of 3) |
| catalog-nikkor-z-24-120f4-tele | 3 | PASS: mtf.maxAbs 9.87e-12 (3 of 3) | PASS: mtf.maxAbs 9.86e-12 (3 of 3) | PASS: mtf.maxAbs 6.72e-12 (3 of 3) |
| catalog-nikkor-z-24-200-f4-63-vr-wide | 3 | PASS: mtf.maxAbs 3.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 2.99e-12 (3 of 3) |
| catalog-nikkor-z-24-200-f4-63-vr-tele | 3 | PASS: mtf.maxAbs 2.34e-11 (3 of 3) | PASS: mtf.maxAbs 6.67e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-11 (3 of 3) |
| catalog-nikkor-z-24-50-f4-63-wide | 3 | PASS: mtf.maxAbs 2.96e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) | PASS: mtf.maxAbs 4.67e-12 (3 of 3) |
| catalog-nikkor-z-24-50-f4-63-tele | 3 | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 7.51e-12 (3 of 3) | PASS: mtf.maxAbs 7.55e-12 (3 of 3) |
| catalog-nikkor-z-24-70-f28-wide | 3 | PASS: mtf.maxAbs 9.91e-12 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-11 (3 of 3) |
| catalog-nikkor-z-24-70-f28-tele | 3 | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 4.48e-12 (3 of 3) | PASS: mtf.maxAbs 3.22e-12 (3 of 3) |
| catalog-nikkor-z-28f28 | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 3.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.26e-12 (3 of 3) |
| catalog-nikkor-z-35f18s | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.84e-12 (3 of 3) |
| catalog-nikkor-z-40f2 | 3 | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 8.37e-13 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) |
| catalog-nikkor-z-50f18s | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 4.99e-12 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) |
| catalog-nikkor-z-70-200f28-wide | 3 | PASS: mtf.maxAbs 3.27e-12 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) |
| catalog-nikkor-z-70-200f28-tele | 3 | PASS: mtf.maxAbs 3.18e-12 (3 of 3) | PASS: mtf.maxAbs 3.80e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) |
| catalog-nikkor-z-70-200f28-vr-s-ii-wide | 3 | PASS: mtf.maxAbs 6.38e-12 (3 of 3) | PASS: mtf.maxAbs 4.04e-12 (3 of 3) | PASS: mtf.maxAbs 6.35e-12 (3 of 3) |
| catalog-nikkor-z-70-200f28-vr-s-ii-tele | 3 | PASS: mtf.maxAbs 6.65e-12 (3 of 3) | PASS: mtf.maxAbs 6.43e-12 (3 of 3) | PASS: mtf.maxAbs 9.36e-12 (3 of 3) |
| catalog-nikkor-z-85f18s | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) |
| catalog-nikkor-z50f12 | 3 | PASS: mtf.maxAbs 4.73e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 4.24e-12 (3 of 3) |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-wide | 3 | PASS: mtf.maxAbs 4.88e-13 (3 of 3) | PASS: mtf.maxAbs 5.81e-13 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-tele | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 2.50e-12 (3 of 3) |
| catalog-nikon-1-nikkor-10mm-f28 | 3 | PASS: mtf.maxAbs 3.91e-13 (3 of 3) | PASS: mtf.maxAbs 2.22e-11 (3 of 3) | PASS: mtf.maxAbs 2.20e-11 (3 of 3) |
| catalog-nikon-1-nikkor-11-27p5-f35-56-wide | 3 | PASS: mtf.maxAbs 6.47e-13 (3 of 3) | PASS: mtf.maxAbs 3.88e-13 (3 of 3) | PASS: mtf.maxAbs 5.61e-13 (3 of 3) |
| catalog-nikon-1-nikkor-11-27p5-f35-56-tele | 3 | PASS: mtf.maxAbs 7.55e-13 (3 of 3) | PASS: mtf.maxAbs 4.07e-12 (3 of 3) | PASS: mtf.maxAbs 4.23e-12 (3 of 3) |
| catalog-nikon-1-nikkor-32mm-f12 | 3 | PASS: mtf.maxAbs 3.27e-13 (3 of 3) | PASS: mtf.maxAbs 4.61e-13 (3 of 3) | PASS: mtf.maxAbs 6.42e-13 (3 of 3) |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-wide | 3 | PASS: mtf.maxAbs 5.03e-13 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-tele | 3 | PASS: mtf.maxAbs 7.46e-13 (3 of 3) | PASS: mtf.maxAbs 5.90e-12 (3 of 3) | PASS: mtf.maxAbs 5.83e-12 (3 of 3) |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-wide | 3 | PASS: mtf.maxAbs 3.12e-13 (3 of 3) | PASS: mtf.maxAbs 3.73e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-tele | 3 | PASS: mtf.maxAbs 3.68e-13 (3 of 3) | PASS: mtf.maxAbs 8.41e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| catalog-nikon-28ti-28f28 | 3 | PASS: mtf.maxAbs 9.56e-13 (3 of 3) | PASS: mtf.maxAbs 5.15e-13 (3 of 3) | PASS: mtf.maxAbs 7.48e-13 (3 of 3) |
| catalog-nikon-35ti-35f28 | 3 | PASS: mtf.maxAbs 6.34e-13 (3 of 3) | PASS: mtf.maxAbs 3.93e-13 (3 of 3) | PASS: mtf.maxAbs 5.51e-13 (3 of 3) |
| catalog-nikon-5cm-f11 | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 7.53e-13 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) |
| catalog-nikon-af-dc-nikkor-135mm-f2 | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-nikon-af-i-nikkor-300mm-f2-8d-if-ed | 3 | PASS: mtf.maxAbs 4.09e-12 (3 of 3) | PASS: mtf.maxAbs 4.90e-12 (3 of 3) | PASS: mtf.maxAbs 7.44e-12 (3 of 3) |
| catalog-nikon-af-i-nikkor-400mm-f28d-if-ed | 3 | PASS: mtf.maxAbs 5.85e-12 (3 of 3) | PASS: mtf.maxAbs 5.34e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) |
| catalog-nikon-af-i-nikkor-600mm-f4d-if-ed | 3 | PASS: mtf.maxAbs 8.22e-12 (3 of 3) | PASS: mtf.maxAbs 7.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.53e-11 (3 of 3) |
| catalog-nikon-af-micro-nikkor-200mm-f4d | 3 | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) |
| catalog-nikon-af-micro-nikkor-60mm-f28d | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 7.92e-13 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) |
| catalog-nikon-af-nikkor-20mm-f28d | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 9.73e-13 (3 of 3) | PASS: mtf.maxAbs 8.85e-13 (3 of 3) |
| catalog-nikon-af-nikkor-28mm-f28d | 3 | PASS: mtf.maxAbs 8.57e-13 (3 of 3) | PASS: mtf.maxAbs 6.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) |
| catalog-nikon-af-nikkor-35mm-f2d | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 6.61e-13 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-wide | 3 | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 2.02e-12 (3 of 3) |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-tele | 3 | PASS: mtf.maxAbs 2.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 2.39e-12 (3 of 3) |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-wide | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 3.43e-12 (3 of 3) | PASS: mtf.maxAbs 3.24e-12 (3 of 3) |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-tele | 3 | PASS: mtf.maxAbs 8.22e-13 (3 of 3) | PASS: mtf.maxAbs 2.32e-12 (3 of 3) | PASS: mtf.maxAbs 2.64e-12 (3 of 3) |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-wide | 3 | PASS: mtf.maxAbs 2.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 2.87e-12 (3 of 3) |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-tele | 3 | PASS: mtf.maxAbs 2.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.99e-12 (3 of 3) |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-wide | 3 | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 6.21e-13 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-tele | 3 | PASS: mtf.maxAbs 9.54e-13 (3 of 3) | PASS: mtf.maxAbs 5.48e-13 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-wide | 3 | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 8.76e-13 (3 of 3) | PASS: mtf.maxAbs 9.76e-13 (3 of 3) |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-tele | 3 | PASS: mtf.maxAbs 3.34e-12 (3 of 3) | PASS: mtf.maxAbs 7.60e-13 (3 of 3) | PASS: mtf.maxAbs 2.95e-12 (3 of 3) |
| catalog-nikon-af-s-dx-micro-nikkor-40mm-f28g | 3 | PASS: mtf.maxAbs 7.18e-13 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) |
| catalog-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr | 3 | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 7.65e-13 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-wide | 3 | PASS: mtf.maxAbs 1.99e-11 (3 of 3) | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-11 (3 of 3) |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-tele | 3 | PASS: mtf.maxAbs 8.36e-13 (3 of 3) | PASS: mtf.maxAbs 9.71e-12 (3 of 3) | PASS: mtf.maxAbs 9.25e-12 (3 of 3) |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-wide | 3 | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 9.83e-13 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-tele | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-wide | 3 | PASS: mtf.maxAbs 8.68e-13 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-tele | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) | PASS: mtf.maxAbs 3.57e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | 3 | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 2.32e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-tele | 3 | PASS: mtf.maxAbs 8.63e-13 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) | PASS: mtf.maxAbs 2.80e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-wide | 3 | PASS: mtf.maxAbs 2.90e-12 (3 of 3) | PASS: mtf.maxAbs 4.46e-12 (3 of 3) | PASS: mtf.maxAbs 3.39e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-tele | 3 | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 2.68e-12 (3 of 3) | PASS: mtf.maxAbs 2.06e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-wide | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-tele | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 6.07e-12 (3 of 3) | PASS: mtf.maxAbs 5.71e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-wide | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-tele | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 7.57e-13 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-wide | 3 | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tele | 3 | PASS: mtf.maxAbs 6.88e-12 (3 of 3) | PASS: mtf.maxAbs 6.89e-12 (3 of 3) | PASS: mtf.maxAbs 1.38e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-wide | 3 | PASS: mtf.maxAbs 6.55e-12 (3 of 3) | PASS: mtf.maxAbs 3.29e-12 (3 of 3) | PASS: mtf.maxAbs 6.58e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-tele | 3 | PASS: mtf.maxAbs 6.27e-12 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) | PASS: mtf.maxAbs 8.89e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-wide | 3 | PASS: mtf.maxAbs 2.73e-12 (3 of 3) | PASS: mtf.maxAbs 6.49e-12 (3 of 3) | PASS: mtf.maxAbs 5.56e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-tele | 3 | PASS: mtf.maxAbs 8.41e-13 (3 of 3) | PASS: mtf.maxAbs 3.81e-12 (3 of 3) | PASS: mtf.maxAbs 3.93e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-24mm-f18g-ed | 3 | PASS: mtf.maxAbs 7.68e-13 (3 of 3) | PASS: mtf.maxAbs 5.34e-12 (3 of 3) | PASS: mtf.maxAbs 5.26e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-400mm-f28e-fl-ed-vr | 3 | PASS: mtf.maxAbs 5.91e-12 (3 of 3) | PASS: mtf.maxAbs 3.85e-12 (3 of 3) | PASS: mtf.maxAbs 9.45e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr | 3 | PASS: mtf.maxAbs 6.06e-12 (3 of 3) | PASS: mtf.maxAbs 5.40e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-500mm-f4g-ed-vr | 3 | PASS: mtf.maxAbs 5.59e-12 (3 of 3) | PASS: mtf.maxAbs 5.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-600mm-f4d-if-ed-ii | 3 | PASS: mtf.maxAbs 4.10e-12 (3 of 3) | PASS: mtf.maxAbs 2.56e-12 (3 of 3) | PASS: mtf.maxAbs 3.93e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr | 3 | PASS: mtf.maxAbs 8.89e-12 (3 of 3) | PASS: mtf.maxAbs 7.88e-12 (3 of 3) | PASS: mtf.maxAbs 1.26e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-wide | 3 | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 8.77e-13 (3 of 3) | PASS: mtf.maxAbs 3.24e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-tele | 3 | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-nikon-af-s-nikkor-800f56e-fl-ed-vr | 3 | PASS: mtf.maxAbs 9.49e-12 (3 of 3) | PASS: mtf.maxAbs 8.96e-12 (3 of 3) | PASS: mtf.maxAbs 1.55e-11 (3 of 3) |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-wide | 3 | PASS: mtf.maxAbs 3.68e-12 (3 of 3) | PASS: mtf.maxAbs 4.45e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-tele | 3 | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-wide | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.55e-12 (3 of 3) |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-tele | 3 | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-wide | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 8.31e-13 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-tele | 3 | PASS: mtf.maxAbs 3.72e-12 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-wide | 3 | PASS: mtf.maxAbs 1.46e-11 (3 of 3) | PASS: mtf.maxAbs 9.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-11 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-tele | 3 | PASS: mtf.maxAbs 7.37e-13 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-wide | 3 | PASS: mtf.maxAbs 1.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-tele | 3 | PASS: mtf.maxAbs 1.96e-12 (3 of 3) | PASS: mtf.maxAbs 4.49e-12 (3 of 3) | PASS: mtf.maxAbs 5.98e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-wide | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 9.74e-13 (3 of 3) | PASS: mtf.maxAbs 9.14e-13 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-tele | 3 | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 2.35e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-wide | 3 | PASS: mtf.maxAbs 7.70e-13 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-tele | 3 | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 2.40e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-wide | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.34e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-tele | 3 | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.93e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-wide | 3 | PASS: mtf.maxAbs 1.86e-12 (3 of 3) | PASS: mtf.maxAbs 6.76e-13 (3 of 3) | PASS: mtf.maxAbs 2.08e-12 (3 of 3) |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-tele | 3 | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| catalog-nikon-af600-28mm-f35 | 3 | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 7.34e-13 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-wide | 3 | PASS: mtf.maxAbs 7.97e-13 (3 of 3) | PASS: mtf.maxAbs 4.13e-12 (3 of 3) | PASS: mtf.maxAbs 4.35e-12 (3 of 3) |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-tele | 3 | PASS: mtf.maxAbs 1.64e-12 (3 of 3) | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) |
| catalog-nikon-afp-dx-70-300-f4563g-wide | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 6.11e-13 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| catalog-nikon-afp-dx-70-300-f4563g-tele | 3 | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 9.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) |
| catalog-nikon-afs-105f28-vr-micro | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 8.05e-13 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) |
| catalog-nikon-afs-24-120mm-f4g-wide | 2 | PASS: mtf.maxAbs 7.48e-13 (2 of 2) | PASS: mtf.maxAbs 9.21e-13 (2 of 2) | PASS: mtf.maxAbs 1.24e-12 (2 of 2) |
| catalog-nikon-afs-24-120mm-f4g-tele | 3 | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 3.48e-12 (3 of 3) | PASS: mtf.maxAbs 4.84e-12 (3 of 3) |
| catalog-nikon-afs-24-70mm-f28g-wide | 3 | PASS: mtf.maxAbs 9.21e-13 (3 of 3) | PASS: mtf.maxAbs 9.12e-13 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) |
| catalog-nikon-afs-24-70mm-f28g-tele | 3 | PASS: mtf.maxAbs 1.53e-12 (3 of 3) | PASS: mtf.maxAbs 2.53e-12 (3 of 3) | PASS: mtf.maxAbs 3.29e-12 (3 of 3) |
| catalog-nikon-afs-28f14e | 3 | PASS: mtf.maxAbs 3.15e-12 (3 of 3) | PASS: mtf.maxAbs 7.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-11 (3 of 3) |
| catalog-nikon-afs-70-200-f28e-fl-wide | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 2.35e-12 (3 of 3) |
| catalog-nikon-afs-70-200-f28e-fl-tele | 3 | PASS: mtf.maxAbs 2.93e-12 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.83e-12 (3 of 3) |
| catalog-nikon-afs-80-400-f45-56g-wide | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 7.86e-13 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) |
| catalog-nikon-afs-80-400-f45-56g-tele | 3 | PASS: mtf.maxAbs 4.25e-12 (3 of 3) | PASS: mtf.maxAbs 3.75e-12 (3 of 3) | PASS: mtf.maxAbs 5.55e-12 (3 of 3) |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-wide | 3 | PASS: mtf.maxAbs 4.92e-12 (3 of 3) | PASS: mtf.maxAbs 7.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-11 (3 of 3) |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-tele | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 8.15e-12 (3 of 3) | PASS: mtf.maxAbs 8.24e-12 (3 of 3) |
| catalog-nikon-afs-vr-200400f4g-if-ed-wide | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 2.43e-12 (3 of 3) | PASS: mtf.maxAbs 2.68e-12 (3 of 3) |
| catalog-nikon-afs-vr-200400f4g-if-ed-tele | 3 | PASS: mtf.maxAbs 4.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 3.41e-12 (3 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-wide | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-tele | 3 | PASS: mtf.maxAbs 2.06e-12 (3 of 3) | PASS: mtf.maxAbs 4.08e-12 (3 of 3) | PASS: mtf.maxAbs 3.94e-12 (3 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-wide | 3 | PASS: mtf.maxAbs 2.93e-12 (3 of 3) | PASS: mtf.maxAbs 9.30e-13 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-tele | 3 | PASS: mtf.maxAbs 2.92e-12 (3 of 3) | PASS: mtf.maxAbs 2.08e-12 (3 of 3) | PASS: mtf.maxAbs 4.08e-12 (3 of 3) |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-wide | 3 | PASS: mtf.maxAbs 2.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-tele | 3 | PASS: mtf.maxAbs 2.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 3.25e-12 (3 of 3) |
| catalog-nikon-ai-28mm-f35 | 3 | PASS: mtf.maxAbs 7.27e-13 (3 of 3) | PASS: mtf.maxAbs 9.39e-13 (3 of 3) | PASS: mtf.maxAbs 9.49e-13 (3 of 3) |
| catalog-nikon-ai-af-dc-nikkor-105mm-f2d | 3 | PASS: mtf.maxAbs 5.47e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.48e-12 (3 of 3) |
| catalog-nikon-ai-af-micro-nikkor-105mm-f28s | 3 | PASS: mtf.maxAbs 8.95e-13 (3 of 3) | PASS: mtf.maxAbs 2.73e-12 (3 of 3) | PASS: mtf.maxAbs 2.75e-12 (3 of 3) |
| catalog-nikon-ai-af-nikkor-85f18s | 3 | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 8.88e-13 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) |
| catalog-nikon-ai-af-s-nikkor-300mm-f28d-if-ed | 3 | PASS: mtf.maxAbs 4.36e-12 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) | PASS: mtf.maxAbs 8.07e-12 (3 of 3) |
| catalog-nikon-ai-af-s-nikkor-400mm-f28d-if-ed-ii | 3 | PASS: mtf.maxAbs 2.65e-12 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) | PASS: mtf.maxAbs 3.72e-12 (3 of 3) |
| catalog-nikon-ai-af-s-nikkor-500mm-f4d-if-ed | 3 | PASS: mtf.maxAbs 3.79e-12 (3 of 3) | PASS: mtf.maxAbs 4.16e-12 (3 of 3) | PASS: mtf.maxAbs 7.95e-12 (3 of 3) |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-wide | 3 | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-tele | 3 | PASS: mtf.maxAbs 4.71e-12 (3 of 3) | PASS: mtf.maxAbs 3.48e-12 (3 of 3) | PASS: mtf.maxAbs 4.10e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-wide | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 2.97e-12 (3 of 3) | PASS: mtf.maxAbs 2.54e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-tele | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 4.10e-12 (3 of 3) | PASS: mtf.maxAbs 4.13e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-wide | 3 | PASS: mtf.maxAbs 2.64e-12 (3 of 3) | PASS: mtf.maxAbs 3.41e-12 (3 of 3) | PASS: mtf.maxAbs 3.72e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-tele | 3 | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.86e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-wide | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 3.66e-12 (3 of 3) | PASS: mtf.maxAbs 3.85e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-tele | 3 | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) | PASS: mtf.maxAbs 1.07e-11 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-wide | 3 | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-tele | 3 | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) |
| catalog-nikon-ai-micro-nikkor-105mm-f28s | 3 | PASS: mtf.maxAbs 9.57e-13 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.86e-12 (3 of 3) |
| catalog-nikon-ai-micro-nikkor-55f28 | 3 | PASS: mtf.maxAbs 6.87e-13 (3 of 3) | PASS: mtf.maxAbs 3.91e-13 (3 of 3) | PASS: mtf.maxAbs 6.28e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-135f2 | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-12 (3 of 3) |
| catalog-nikon-ai-nikkor-135f28 | 3 | PASS: mtf.maxAbs 6.96e-13 (3 of 3) | PASS: mtf.maxAbs 5.28e-13 (3 of 3) | PASS: mtf.maxAbs 7.16e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-180mm-f28-ed | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 7.27e-13 (3 of 3) | PASS: mtf.maxAbs 9.60e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-200mm-f2-if-ed | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 2.10e-12 (3 of 3) |
| catalog-nikon-ai-nikkor-24mm-f2 | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 9.78e-13 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| catalog-nikon-ai-nikkor-28mm-f28s | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 4.48e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-35mm-f14-s | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.62e-12 (3 of 3) | PASS: mtf.maxAbs 8.52e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-35mm-f2 | 3 | PASS: mtf.maxAbs 7.24e-13 (3 of 3) | PASS: mtf.maxAbs 6.27e-13 (3 of 3) | PASS: mtf.maxAbs 6.29e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-45mm-f28-p | 3 | PASS: mtf.maxAbs 5.49e-13 (3 of 3) | PASS: mtf.maxAbs 4.86e-13 (3 of 3) | PASS: mtf.maxAbs 8.63e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-50f18s | 3 | PASS: mtf.maxAbs 7.67e-13 (3 of 3) | PASS: mtf.maxAbs 6.86e-13 (3 of 3) | PASS: mtf.maxAbs 6.81e-13 (3 of 3) |
| catalog-nikon-ai-nikkor-600mm-f56-if-ed | 3 | PASS: mtf.maxAbs 2.50e-12 (3 of 3) | PASS: mtf.maxAbs 6.01e-12 (3 of 3) | PASS: mtf.maxAbs 8.46e-12 (3 of 3) |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-wide | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 9.07e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 8.85e-13 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-wide | 3 | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 6.81e-13 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | 3 | PASS: mtf.maxAbs 8.83e-13 (3 of 3) | PASS: mtf.maxAbs 8.82e-13 (3 of 3) | PASS: mtf.maxAbs 8.75e-13 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-wide | 2 | PASS: mtf.maxAbs 1.07e-12 (2 of 2) | PASS: mtf.maxAbs 1.13e-12 (2 of 2) | PASS: mtf.maxAbs 1.21e-12 (2 of 2) |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-tele | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-wide | 3 | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.29e-12 (3 of 3) | PASS: mtf.maxAbs 9.33e-13 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-tele | 3 | PASS: mtf.maxAbs 2.99e-12 (3 of 3) | PASS: mtf.maxAbs 9.70e-13 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-wide | 3 | PASS: mtf.maxAbs 3.04e-12 (3 of 3) | PASS: mtf.maxAbs 3.90e-12 (3 of 3) | PASS: mtf.maxAbs 4.51e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-tele | 3 | PASS: mtf.maxAbs 5.59e-12 (3 of 3) | PASS: mtf.maxAbs 4.97e-12 (3 of 3) | PASS: mtf.maxAbs 6.48e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-wide | 3 | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 2.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-tele | 3 | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-wide | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 7.39e-13 (3 of 3) | PASS: mtf.maxAbs 9.40e-13 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-tele | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-wide | 3 | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 7.22e-13 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-tele | 3 | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-wide | 3 | PASS: mtf.maxAbs 4.53e-12 (3 of 3) | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 2.89e-12 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-tele | 3 | PASS: mtf.maxAbs 2.69e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.18e-12 (3 of 3) |
| catalog-nikon-ais-nikkor-300mm-f2-if-ed | 3 | PASS: mtf.maxAbs 3.29e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) | PASS: mtf.maxAbs 2.90e-12 (3 of 3) |
| catalog-nikon-ais-nikkor-50mm-f12 | 3 | PASS: mtf.maxAbs 8.87e-13 (3 of 3) | PASS: mtf.maxAbs 6.20e-13 (3 of 3) | PASS: mtf.maxAbs 9.54e-13 (3 of 3) |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-wide | 3 | PASS: mtf.maxAbs 9.14e-13 (3 of 3) | PASS: mtf.maxAbs 8.64e-13 (3 of 3) | PASS: mtf.maxAbs 1.31e-12 (3 of 3) |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-tele | 3 | PASS: mtf.maxAbs 2.98e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-wide | 3 | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 1.99e-12 (3 of 3) |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-tele | 3 | PASS: mtf.maxAbs 2.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.57e-12 (3 of 3) |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-wide | 3 | PASS: mtf.maxAbs 3.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 3.41e-12 (3 of 3) |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-tele | 3 | PASS: mtf.maxAbs 3.76e-12 (3 of 3) | PASS: mtf.maxAbs 3.05e-12 (3 of 3) | PASS: mtf.maxAbs 4.53e-12 (3 of 3) |
| catalog-nikon-dodotto-400f8 | 3 | PASS: mtf.maxAbs 1.89e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) |
| catalog-nikon-fuwatto-soft-90mm-f48 | 3 | PASS: mtf.maxAbs 6.40e-13 (3 of 3) | PASS: mtf.maxAbs 4.56e-13 (3 of 3) | PASS: mtf.maxAbs 6.51e-13 (3 of 3) |
| catalog-nikon-gugotto-120mm-f45 | 3 | PASS: mtf.maxAbs 6.48e-13 (3 of 3) | PASS: mtf.maxAbs 6.22e-13 (3 of 3) | PASS: mtf.maxAbs 4.34e-13 (3 of 3) |
| catalog-nikon-gyogyotto-20mm-f8 | 2 | PASS: mtf.maxAbs 4.89e-13 (2 of 2) | PASS: mtf.maxAbs 9.82e-14 (2 of 2) | PASS: mtf.maxAbs 5.41e-13 (2 of 2) |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-wide | 3 | PASS: mtf.maxAbs 7.41e-13 (3 of 3) | PASS: mtf.maxAbs 5.18e-13 (3 of 3) | PASS: mtf.maxAbs 9.00e-13 (3 of 3) |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-tele | 3 | PASS: mtf.maxAbs 9.20e-13 (3 of 3) | PASS: mtf.maxAbs 5.32e-13 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| catalog-nikon-l35af-35f28 | 3 | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 8.30e-13 (3 of 3) |
| catalog-nikon-lw-nikkor-28-f28 | 3 | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 5.47e-13 (3 of 3) | PASS: mtf.maxAbs 5.09e-13 (3 of 3) |
| catalog-nikon-medical-nikkor-120mm-f4-if | 3 | PASS: mtf.maxAbs 9.61e-13 (3 of 3) | PASS: mtf.maxAbs 9.29e-13 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-nikon-micro-60f28g | 3 | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 9.14e-12 (3 of 3) | PASS: mtf.maxAbs 9.69e-12 (3 of 3) |
| catalog-nikon-new-nikkor-auto-28mm-f28 | 3 | PASS: mtf.maxAbs 9.89e-13 (3 of 3) | PASS: mtf.maxAbs 8.24e-13 (3 of 3) | PASS: mtf.maxAbs 6.05e-13 (3 of 3) |
| catalog-nikon-nikkor-15mm-f56 | 3 | PASS: mtf.maxAbs 2.93e-12 (3 of 3) | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) |
| catalog-nikon-nikkor-20mm-f4 | 3 | PASS: mtf.maxAbs 1.27e-12 (3 of 3) | PASS: mtf.maxAbs 8.98e-13 (3 of 3) | PASS: mtf.maxAbs 8.50e-13 (3 of 3) |
| catalog-nikon-nikkor-300mm-f45-ed | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.80e-12 (3 of 3) |
| catalog-nikon-nikkor-35mm-f28 | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 8.47e-13 (3 of 3) | PASS: mtf.maxAbs 9.30e-13 (3 of 3) |
| catalog-nikon-nikkor-600mm-f56-ed | 3 | PASS: mtf.maxAbs 2.69e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) | PASS: mtf.maxAbs 4.81e-12 (3 of 3) |
| catalog-nikon-nikkor-800mm-f8-ed | 2 | PASS: mtf.maxAbs 2.22e-12 (2 of 2) | PASS: mtf.maxAbs 2.00e-12 (2 of 2) | PASS: mtf.maxAbs 2.59e-12 (2 of 2) |
| catalog-nikon-nikkor-afs-20mm-f18g | 3 | PASS: mtf.maxAbs 6.05e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-11 (3 of 3) | PASS: mtf.maxAbs 6.27e-12 (3 of 3) |
| catalog-nikon-nikkor-afs-24mm-f14g | 3 | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 3.06e-12 (3 of 3) | PASS: mtf.maxAbs 2.36e-12 (3 of 3) |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-wide | 2 | PASS: mtf.maxAbs 1.71e-12 (2 of 2) | PASS: mtf.maxAbs 1.16e-12 (2 of 2) | PASS: mtf.maxAbs 1.27e-12 (2 of 2) |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-tele | 3 | PASS: mtf.maxAbs 2.66e-12 (3 of 3) | PASS: mtf.maxAbs 4.73e-12 (3 of 3) | PASS: mtf.maxAbs 5.64e-12 (3 of 3) |
| catalog-nikon-nikkor-h-auto-28mm-f35 | 3 | PASS: mtf.maxAbs 5.78e-13 (3 of 3) | PASS: mtf.maxAbs 3.70e-13 (3 of 3) | PASS: mtf.maxAbs 6.61e-13 (3 of 3) |
| catalog-nikon-nikkor-o-21mm-f4 | 3 | PASS: mtf.maxAbs 8.02e-13 (3 of 3) | PASS: mtf.maxAbs 4.91e-13 (3 of 3) | PASS: mtf.maxAbs 8.77e-13 (3 of 3) |
| catalog-nikon-nikkor-s-auto-50f2 | 3 | PASS: mtf.maxAbs 8.41e-13 (3 of 3) | PASS: mtf.maxAbs 5.31e-13 (3 of 3) | PASS: mtf.maxAbs 9.12e-13 (3 of 3) |
| catalog-nikon-nikkor-s-auto-58mm-f1-4 | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 9.38e-13 (3 of 3) | PASS: mtf.maxAbs 8.42e-13 (3 of 3) |
| catalog-nikon-nikkor-sw-75mm-f45 | 3 | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 6.25e-12 (3 of 3) | PASS: mtf.maxAbs 8.96e-12 (3 of 3) |
| catalog-nikon-nikkor-sw-90mm-f45 | 3 | PASS: mtf.maxAbs 1.30e-11 (3 of 3) | PASS: mtf.maxAbs 7.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.53e-11 (3 of 3) |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-wide | 3 | PASS: mtf.maxAbs 4.08e-12 (3 of 3) | PASS: mtf.maxAbs 3.25e-12 (3 of 3) | PASS: mtf.maxAbs 5.95e-12 (3 of 3) |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-tele | 3 | PASS: mtf.maxAbs 1.71e-11 (3 of 3) | PASS: mtf.maxAbs 1.23e-11 (3 of 3) | PASS: mtf.maxAbs 2.27e-11 (3 of 3) |
| catalog-nikon-nikkor-z-20mm-f18-s | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-wide | 3 | PASS: mtf.maxAbs 4.69e-12 (3 of 3) | PASS: mtf.maxAbs 3.86e-12 (3 of 3) | PASS: mtf.maxAbs 4.10e-12 (3 of 3) |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-tele | 3 | PASS: mtf.maxAbs 2.65e-12 (3 of 3) | PASS: mtf.maxAbs 7.08e-12 (3 of 3) | PASS: mtf.maxAbs 5.00e-12 (3 of 3) |
| catalog-nikon-nikkor-z-35f12s | 3 | PASS: mtf.maxAbs 2.76e-12 (3 of 3) | PASS: mtf.maxAbs 5.35e-12 (3 of 3) | PASS: mtf.maxAbs 4.29e-12 (3 of 3) |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-wide | 3 | PASS: mtf.maxAbs 3.62e-12 (3 of 3) | PASS: mtf.maxAbs 3.97e-12 (3 of 3) | PASS: mtf.maxAbs 6.31e-12 (3 of 3) |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-tele | 3 | PASS: mtf.maxAbs 6.96e-13 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) |
| catalog-nikon-pc-e-nikkor-24-f35d-ed | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 9.71e-13 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) |
| catalog-nikon-pc-nikkor-19mm-f4e-ed | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 3.40e-12 (3 of 3) | PASS: mtf.maxAbs 4.88e-12 (3 of 3) |
| catalog-nikon-pc-nikkor-35mm-f28 | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 4.27e-13 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-nikon-pce-micro-nikkor-45f28d | 3 | PASS: mtf.maxAbs 6.92e-13 (3 of 3) | PASS: mtf.maxAbs 4.72e-13 (3 of 3) | PASS: mtf.maxAbs 5.35e-13 (3 of 3) |
| catalog-nikon-ruw-af-micro-nikkor-50f28 | 3 | PASS: mtf.maxAbs 1.94e-12 (3 of 3) | PASS: mtf.maxAbs 8.40e-13 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-wide | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 6.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.53e-12 (3 of 3) |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-tele | 3 | PASS: mtf.maxAbs 1.47e-12 (3 of 3) | PASS: mtf.maxAbs 7.89e-13 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| catalog-nikon-series-e-100mm-f28 | 3 | PASS: mtf.maxAbs 5.98e-13 (3 of 3) | PASS: mtf.maxAbs 5.07e-13 (3 of 3) | PASS: mtf.maxAbs 7.03e-13 (3 of 3) |
| catalog-nikon-series-e-135mm-f28 | 3 | PASS: mtf.maxAbs 6.87e-13 (3 of 3) | PASS: mtf.maxAbs 8.28e-13 (3 of 3) | PASS: mtf.maxAbs 6.65e-13 (3 of 3) |
| catalog-nikon-series-e-75-150mm-f35-wide | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 8.89e-13 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| catalog-nikon-series-e-75-150mm-f35-tele | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) |
| catalog-nikon-series-e-zoom-36-72mm-f35-wide | 3 | PASS: mtf.maxAbs 7.82e-13 (3 of 3) | PASS: mtf.maxAbs 5.49e-13 (3 of 3) | PASS: mtf.maxAbs 6.49e-13 (3 of 3) |
| catalog-nikon-series-e-zoom-36-72mm-f35-tele | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 7.74e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 4.34e-13 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) |
| catalog-nikon-tv-nikkor-115-69-f12-s100-tele | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 5.02e-13 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) |
| catalog-nikon-ultra-micro-nikkor-295mm-f12 | 3 | PASS: mtf.maxAbs 3.28e-13 (3 of 3) | PASS: mtf.maxAbs 3.37e-13 (3 of 3) | PASS: mtf.maxAbs 5.15e-13 (3 of 3) |
| catalog-nikon-uv-nikkor-105mm-f45 | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 7.55e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| catalog-nikon-uv-nikkor-55mm-f4 | 3 | PASS: mtf.maxAbs 8.76e-13 (3 of 3) | PASS: mtf.maxAbs 4.78e-13 (3 of 3) | PASS: mtf.maxAbs 4.26e-13 (3 of 3) |
| catalog-nikon-w-nikkor-35mm-f18 | 3 | PASS: mtf.maxAbs 7.06e-13 (3 of 3) | PASS: mtf.maxAbs 4.76e-13 (3 of 3) | PASS: mtf.maxAbs 6.51e-13 (3 of 3) |
| catalog-nikon-z-135f18-plena | 3 | PASS: mtf.maxAbs 2.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 3.48e-12 (3 of 3) |
| catalog-nikon-z-14-24f28-s-wide | 3 | PASS: mtf.maxAbs 5.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-11 (3 of 3) | PASS: mtf.maxAbs 1.15e-11 (3 of 3) |
| catalog-nikon-z-14-24f28-s-tele | 3 | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 7.12e-12 (3 of 3) | PASS: mtf.maxAbs 6.68e-12 (3 of 3) |
| catalog-nikon-z-24-70f4s-wide | 3 | PASS: mtf.maxAbs 8.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) |
| catalog-nikon-z-24-70f4s-tele | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 7.19e-12 (3 of 3) | PASS: mtf.maxAbs 7.58e-12 (3 of 3) |
| catalog-nikon-z-26f28 | 3 | PASS: mtf.maxAbs 7.02e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-11 (3 of 3) | PASS: mtf.maxAbs 1.25e-11 (3 of 3) |
| catalog-nikon-z-58f095-noct | 3 | PASS: mtf.maxAbs 7.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 6.96e-12 (3 of 3) |
| catalog-nikon-z-dx-16-50-f3563-vr-wide | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-11 (3 of 3) | PASS: mtf.maxAbs 2.14e-11 (3 of 3) |
| catalog-nikon-z-dx-16-50-f3563-vr-tele | 3 | PASS: mtf.maxAbs 7.85e-13 (3 of 3) | PASS: mtf.maxAbs 3.99e-12 (3 of 3) | PASS: mtf.maxAbs 4.37e-12 (3 of 3) |
| catalog-nikon-z-dx-18-140-f35-63-vr-wide | 3 | PASS: mtf.maxAbs 6.53e-13 (3 of 3) | PASS: mtf.maxAbs 4.92e-12 (3 of 3) | PASS: mtf.maxAbs 4.43e-12 (3 of 3) |
| catalog-nikon-z-dx-18-140-f35-63-vr-tele | 3 | PASS: mtf.maxAbs 2.51e-12 (3 of 3) | PASS: mtf.maxAbs 3.24e-12 (3 of 3) | PASS: mtf.maxAbs 3.36e-12 (3 of 3) |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-wide | 3 | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-tele | 3 | PASS: mtf.maxAbs 2.15e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| catalog-nikon-z-mc-105f28 | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) |
| catalog-nikon-zoom-nikkor-28-45f45-wide | 3 | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 7.79e-13 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) |
| catalog-nikon-zoom-nikkor-28-45f45-tele | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 6.70e-13 (3 of 3) | PASS: mtf.maxAbs 6.49e-13 (3 of 3) |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-wide | 3 | PASS: mtf.maxAbs 2.07e-13 (3 of 3) | PASS: mtf.maxAbs 5.77e-13 (3 of 3) | PASS: mtf.maxAbs 5.54e-13 (3 of 3) |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-tele | 3 | PASS: mtf.maxAbs 2.57e-13 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-wide | 3 | PASS: mtf.maxAbs 2.29e-13 (3 of 3) | PASS: mtf.maxAbs 2.91e-13 (3 of 3) | PASS: mtf.maxAbs 2.94e-13 (3 of 3) |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-tele | 3 | PASS: mtf.maxAbs 2.83e-13 (3 of 3) | PASS: mtf.maxAbs 7.46e-13 (3 of 3) | PASS: mtf.maxAbs 8.30e-13 (3 of 3) |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-wide | 3 | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-tele | 3 | PASS: mtf.maxAbs 7.15e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 6.84e-12 (3 of 3) |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-wide | 2 | PASS: mtf.maxAbs 1.03e-12 (2 of 2) | PASS: mtf.maxAbs 3.61e-13 (2 of 2) | PASS: mtf.maxAbs 1.39e-12 (2 of 2) |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-tele | 2 | PASS: mtf.maxAbs 3.13e-12 (2 of 2) | PASS: mtf.maxAbs 2.84e-12 (2 of 2) | PASS: mtf.maxAbs 5.97e-12 (2 of 2) |
| catalog-nokton-50f1 | 3 | PASS: mtf.maxAbs 4.20e-12 (3 of 3) | PASS: mtf.maxAbs 8.82e-12 (3 of 3) | PASS: mtf.maxAbs 6.70e-12 (3 of 3) |
| catalog-olympus-e-zuiko-auto-t-1000mm-f11 | 3 | PASS: mtf.maxAbs 4.47e-12 (3 of 3) | PASS: mtf.maxAbs 3.86e-12 (3 of 3) | PASS: mtf.maxAbs 3.42e-12 (3 of 3) |
| catalog-olympus-g-zuiko-auto-w-21mm-f35 | 3 | PASS: mtf.maxAbs 5.66e-13 (3 of 3) | PASS: mtf.maxAbs 4.01e-13 (3 of 3) | PASS: mtf.maxAbs 6.13e-13 (3 of 3) |
| catalog-olympus-mzuiko-12-40-f28-pro-wide | 3 | PASS: mtf.maxAbs 7.25e-12 (3 of 3) | PASS: mtf.maxAbs 7.85e-12 (3 of 3) | PASS: mtf.maxAbs 4.68e-12 (3 of 3) |
| catalog-olympus-mzuiko-12-40-f28-pro-tele | 3 | PASS: mtf.maxAbs 1.52e-12 (3 of 3) | PASS: mtf.maxAbs 8.73e-12 (3 of 3) | PASS: mtf.maxAbs 8.49e-12 (3 of 3) |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-wide | 3 | PASS: mtf.maxAbs 1.37e-11 (3 of 3) | PASS: mtf.maxAbs 1.35e-11 (3 of 3) | PASS: mtf.maxAbs 8.50e-12 (3 of 3) |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-tele | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 3.72e-12 (3 of 3) | PASS: mtf.maxAbs 4.94e-12 (3 of 3) |
| catalog-olympus-mzuiko-12mm-f2 | 3 | PASS: mtf.maxAbs 4.64e-13 (3 of 3) | PASS: mtf.maxAbs 1.30e-11 (3 of 3) | PASS: mtf.maxAbs 1.34e-11 (3 of 3) |
| catalog-olympus-mzuiko-14-42-3556-ii-wide | 3 | PASS: mtf.maxAbs 4.04e-13 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 2.06e-12 (3 of 3) |
| catalog-olympus-mzuiko-14-42-3556-ii-tele | 3 | PASS: mtf.maxAbs 7.15e-13 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) | PASS: mtf.maxAbs 2.65e-12 (3 of 3) |
| catalog-olympus-mzuiko-17mm-f18 | 3 | PASS: mtf.maxAbs 5.06e-13 (3 of 3) | PASS: mtf.maxAbs 3.71e-12 (3 of 3) | PASS: mtf.maxAbs 3.56e-12 (3 of 3) |
| catalog-olympus-mzuiko-17mm-f28 | 3 | PASS: mtf.maxAbs 3.08e-13 (3 of 3) | PASS: mtf.maxAbs 2.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) |
| catalog-olympus-mzuiko-25mm-f18 | 3 | PASS: mtf.maxAbs 3.38e-13 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) |
| catalog-olympus-mzuiko-40-150-f28-pro-wide | 3 | PASS: mtf.maxAbs 9.82e-13 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) |
| catalog-olympus-mzuiko-40-150-f28-pro-tele | 3 | PASS: mtf.maxAbs 2.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-wide | 3 | PASS: mtf.maxAbs 2.64e-12 (3 of 3) | PASS: mtf.maxAbs 5.93e-13 (3 of 3) | PASS: mtf.maxAbs 2.41e-12 (3 of 3) |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-tele | 3 | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-olympus-mzuiko-75mm-f18 | 3 | PASS: mtf.maxAbs 5.16e-13 (3 of 3) | PASS: mtf.maxAbs 3.15e-13 (3 of 3) | PASS: mtf.maxAbs 5.00e-13 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-wide | 3 | PASS: mtf.maxAbs 3.13e-13 (3 of 3) | PASS: mtf.maxAbs 9.14e-13 (3 of 3) | PASS: mtf.maxAbs 1.00e-12 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-tele | 3 | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 6.27e-12 (3 of 3) | PASS: mtf.maxAbs 6.99e-12 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-wide | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-tele | 3 | PASS: mtf.maxAbs 5.15e-13 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-17mm-f12-pro | 3 | PASS: mtf.maxAbs 6.97e-13 (3 of 3) | PASS: mtf.maxAbs 3.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.62e-12 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-45mm-f12-pro | 3 | PASS: mtf.maxAbs 5.79e-13 (3 of 3) | PASS: mtf.maxAbs 6.04e-13 (3 of 3) | PASS: mtf.maxAbs 9.80e-13 (3 of 3) |
| catalog-olympus-pen-f-g-zuiko-auto-t-60mm-f15 | 3 | PASS: mtf.maxAbs 5.75e-13 (3 of 3) | PASS: mtf.maxAbs 3.10e-13 (3 of 3) | PASS: mtf.maxAbs 7.87e-13 (3 of 3) |
| catalog-olympus-pen-f-g-zuiko-auto-w-25mm-f28 | 3 | PASS: mtf.maxAbs 8.91e-13 (3 of 3) | PASS: mtf.maxAbs 7.07e-13 (3 of 3) | PASS: mtf.maxAbs 4.80e-13 (3 of 3) |
| catalog-olympus-xa-zuiko-35-f28 | 2 | PASS: mtf.maxAbs 8.01e-13 (2 of 2) | PASS: mtf.maxAbs 2.72e-13 (2 of 2) | PASS: mtf.maxAbs 7.00e-13 (2 of 2) |
| catalog-olympus-zuiko-135-f35 | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 4.84e-13 (3 of 3) | PASS: mtf.maxAbs 9.84e-13 (3 of 3) |
| catalog-olympus-zuiko-16mmf35-fisheye | 2 | PASS: mtf.maxAbs 8.81e-13 (2 of 2) | PASS: mtf.maxAbs 7.84e-13 (2 of 2) | PASS: mtf.maxAbs 7.41e-13 (2 of 2) |
| catalog-olympus-zuiko-24f2-j | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 8.03e-13 (3 of 3) | PASS: mtf.maxAbs 1.24e-12 (3 of 3) |
| catalog-olympus-zuiko-28mm-f35 | 3 | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 5.70e-13 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-olympus-zuiko-600mm-f65 | 3 | PASS: mtf.maxAbs 2.34e-12 (3 of 3) | PASS: mtf.maxAbs 3.63e-12 (3 of 3) | PASS: mtf.maxAbs 5.98e-12 (3 of 3) |
| catalog-olympus-zuiko-85mm-f2 | 3 | PASS: mtf.maxAbs 6.41e-13 (3 of 3) | PASS: mtf.maxAbs 4.54e-13 (3 of 3) | PASS: mtf.maxAbs 7.78e-13 (3 of 3) |
| catalog-olympus-zuiko-9-36-f2-2p4-wide | 2 | PASS: mtf.maxAbs 4.81e-13 (2 of 2) | PASS: mtf.maxAbs 4.93e-13 (2 of 2) | PASS: mtf.maxAbs 7.74e-13 (2 of 2) |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | 3 | PASS: mtf.maxAbs 8.15e-13 (3 of 3) | PASS: mtf.maxAbs 4.31e-13 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-macro-50f2 | 3 | PASS: mtf.maxAbs 1.59e-12 (3 of 3) | PASS: mtf.maxAbs 7.20e-13 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-macro-90f2 | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 5.81e-13 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-s-50f12 | 3 | PASS: mtf.maxAbs 8.29e-13 (3 of 3) | PASS: mtf.maxAbs 6.77e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-s-50f14 | 3 | PASS: mtf.maxAbs 8.13e-13 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 7.43e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-s-55-f12 | 3 | PASS: mtf.maxAbs 7.46e-13 (3 of 3) | PASS: mtf.maxAbs 4.72e-13 (3 of 3) | PASS: mtf.maxAbs 7.59e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-t-180mm-f2 | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) | PASS: mtf.maxAbs 2.93e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-t-200mm-f5 | 3 | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 6.79e-13 (3 of 3) | PASS: mtf.maxAbs 9.43e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-w-18f35 | 2 | PASS: mtf.maxAbs 2.98e-13 (2 of 2) | PASS: mtf.maxAbs 4.20e-13 (2 of 2) | PASS: mtf.maxAbs 4.13e-13 (2 of 2) |
| catalog-olympus-zuiko-auto-w-21mm-f2 | 3 | PASS: mtf.maxAbs 9.40e-13 (3 of 3) | PASS: mtf.maxAbs 7.33e-13 (3 of 3) | PASS: mtf.maxAbs 9.52e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-w-24f28 | 3 | PASS: mtf.maxAbs 7.50e-13 (3 of 3) | PASS: mtf.maxAbs 8.18e-13 (3 of 3) | PASS: mtf.maxAbs 6.61e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-w-24mm-f28 | 3 | PASS: mtf.maxAbs 7.89e-13 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 9.90e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-w-28mm-f2 | 3 | PASS: mtf.maxAbs 6.91e-13 (3 of 3) | PASS: mtf.maxAbs 5.43e-13 (3 of 3) | PASS: mtf.maxAbs 6.52e-13 (3 of 3) |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-wide | 3 | PASS: mtf.maxAbs 1.91e-12 (3 of 3) | PASS: mtf.maxAbs 6.25e-13 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-tele | 3 | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 9.16e-13 (3 of 3) | PASS: mtf.maxAbs 1.86e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-wide | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 9.63e-13 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-tele | 3 | PASS: mtf.maxAbs 1.98e-12 (3 of 3) | PASS: mtf.maxAbs 3.26e-12 (3 of 3) | PASS: mtf.maxAbs 4.83e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-wide | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) | PASS: mtf.maxAbs 2.46e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-tele | 3 | PASS: mtf.maxAbs 3.51e-12 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 3.73e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-wide | 3 | PASS: mtf.maxAbs 5.80e-13 (3 of 3) | PASS: mtf.maxAbs 6.46e-13 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-tele | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 1.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.69e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-150mm-f2 | 3 | PASS: mtf.maxAbs 2.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 4.16e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-300mm-f28 | 3 | PASS: mtf.maxAbs 2.75e-12 (3 of 3) | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 3.40e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-wide | 3 | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 3.58e-12 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-tele | 3 | PASS: mtf.maxAbs 4.87e-12 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 5.27e-12 (3 of 3) |
| catalog-olympus-zuiko-mc-auto-w-28mm-f28 | 3 | PASS: mtf.maxAbs 8.43e-13 (3 of 3) | PASS: mtf.maxAbs 5.14e-13 (3 of 3) | PASS: mtf.maxAbs 8.65e-13 (3 of 3) |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-wide | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 6.10e-13 (3 of 3) | PASS: mtf.maxAbs 7.25e-13 (3 of 3) |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-tele | 3 | PASS: mtf.maxAbs 2.05e-12 (3 of 3) | PASS: mtf.maxAbs 7.60e-13 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) |
| catalog-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro | 3 | PASS: mtf.maxAbs 7.78e-13 (3 of 3) | PASS: mtf.maxAbs 6.58e-13 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| catalog-panasonic-dg-nocticron-42mm-f12 | 3 | PASS: mtf.maxAbs 7.77e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) | PASS: mtf.maxAbs 8.32e-13 (3 of 3) |
| catalog-panasonic-dg-summilux-12mm-f14 | 3 | PASS: mtf.maxAbs 7.17e-13 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) |
| catalog-panasonic-g-14mm-f25-ii | 3 | PASS: mtf.maxAbs 2.52e-13 (3 of 3) | PASS: mtf.maxAbs 7.37e-12 (3 of 3) | PASS: mtf.maxAbs 7.26e-12 (3 of 3) |
| catalog-panasonic-leica-dg-15f17 | 3 | PASS: mtf.maxAbs 6.92e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-11 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) |
| catalog-panasonic-leica-dg-25f14 | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 9.03e-13 (3 of 3) | PASS: mtf.maxAbs 1.84e-12 (3 of 3) |
| catalog-panasonic-leica-dg-9f17 | 3 | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 9.30e-13 (3 of 3) |
| catalog-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois | 3 | PASS: mtf.maxAbs 3.57e-13 (3 of 3) | PASS: mtf.maxAbs 5.78e-13 (3 of 3) | PASS: mtf.maxAbs 6.24e-13 (3 of 3) |
| catalog-panasonic-lumix-g-25mm-f17 | 3 | PASS: mtf.maxAbs 2.03e-11 (3 of 3) | PASS: mtf.maxAbs 1.66e-11 (3 of 3) | PASS: mtf.maxAbs 7.68e-12 (3 of 3) |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-wide | 3 | PASS: mtf.maxAbs 9.38e-13 (3 of 3) | PASS: mtf.maxAbs 3.70e-13 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-tele | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 7.29e-13 (3 of 3) | PASS: mtf.maxAbs 6.14e-13 (3 of 3) |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-wide | 3 | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 7.50e-13 (3 of 3) | PASS: mtf.maxAbs 1.15e-12 (3 of 3) |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-tele | 3 | PASS: mtf.maxAbs 6.54e-13 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 2.27e-12 (3 of 3) |
| catalog-panasonic-lumix-g-vario-7-14-f4-wide | 3 | PASS: mtf.maxAbs 2.06e-12 (3 of 3) | PASS: mtf.maxAbs 5.37e-12 (3 of 3) | PASS: mtf.maxAbs 5.54e-12 (3 of 3) |
| catalog-panasonic-lumix-g-vario-7-14-f4-tele | 3 | PASS: mtf.maxAbs 4.80e-13 (3 of 3) | PASS: mtf.maxAbs 5.22e-12 (3 of 3) | PASS: mtf.maxAbs 5.14e-12 (3 of 3) |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-wide | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 5.53e-12 (3 of 3) | PASS: mtf.maxAbs 5.89e-12 (3 of 3) |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-tele | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 7.91e-12 (3 of 3) | PASS: mtf.maxAbs 7.99e-12 (3 of 3) |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-wide | 3 | PASS: mtf.maxAbs 2.36e-11 (3 of 3) | PASS: mtf.maxAbs 2.64e-11 (3 of 3) | PASS: mtf.maxAbs 8.74e-12 (3 of 3) |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-tele | 3 | PASS: mtf.maxAbs 9.73e-12 (3 of 3) | PASS: mtf.maxAbs 4.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) |
| catalog-panasonic-lumix-s-26mm-f8 | 3 | PASS: mtf.maxAbs 1.68e-13 (3 of 3) | PASS: mtf.maxAbs 4.06e-13 (3 of 3) | PASS: mtf.maxAbs 2.89e-13 (3 of 3) |
| catalog-panasonic-lumix-s-35-f18 | 3 | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 5.42e-12 (3 of 3) | PASS: mtf.maxAbs 5.32e-12 (3 of 3) |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-wide | 3 | PASS: mtf.maxAbs 3.15e-12 (3 of 3) | PASS: mtf.maxAbs 9.59e-13 (3 of 3) | PASS: mtf.maxAbs 2.36e-12 (3 of 3) |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-tele | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-16-35f4-wide | 3 | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 5.17e-12 (3 of 3) | PASS: mtf.maxAbs 5.19e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-16-35f4-tele | 3 | PASS: mtf.maxAbs 2.68e-12 (3 of 3) | PASS: mtf.maxAbs 5.84e-12 (3 of 3) | PASS: mtf.maxAbs 7.90e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-wide | 2 | PASS: mtf.maxAbs 8.34e-13 (2 of 2) | PASS: mtf.maxAbs 1.09e-12 (2 of 2) | PASS: mtf.maxAbs 8.60e-13 (2 of 2) |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-tele | 3 | PASS: mtf.maxAbs 4.71e-12 (3 of 3) | PASS: mtf.maxAbs 9.32e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-11 (3 of 3) |
| catalog-panasonic-lumix-s-pro-50-f14 | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 3.05e-12 (3 of 3) | PASS: mtf.maxAbs 4.13e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-wide | 3 | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-tele | 3 | PASS: mtf.maxAbs 2.50e-12 (3 of 3) | PASS: mtf.maxAbs 2.05e-12 (3 of 3) | PASS: mtf.maxAbs 3.54e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-wide | 3 | PASS: mtf.maxAbs 7.52e-12 (3 of 3) | PASS: mtf.maxAbs 6.75e-12 (3 of 3) | PASS: mtf.maxAbs 4.46e-12 (3 of 3) |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-tele | 3 | PASS: mtf.maxAbs 6.76e-12 (3 of 3) | PASS: mtf.maxAbs 8.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) |
| catalog-pentax-02-standard-zoom-5-15-f28-45-wide | 3 | PASS: mtf.maxAbs 1.44e-13 (3 of 3) | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 1.53e-12 (3 of 3) |
| catalog-pentax-02-standard-zoom-5-15-f28-45-tele | 3 | PASS: mtf.maxAbs 4.48e-13 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.78e-12 (3 of 3) |
| catalog-pentax-06-telephoto-zoom-15-45-f28-wide | 3 | PASS: mtf.maxAbs 3.74e-13 (3 of 3) | PASS: mtf.maxAbs 1.66e-13 (3 of 3) | PASS: mtf.maxAbs 4.84e-13 (3 of 3) |
| catalog-pentax-06-telephoto-zoom-15-45-f28-tele | 3 | PASS: mtf.maxAbs 3.56e-13 (3 of 3) | PASS: mtf.maxAbs 2.98e-13 (3 of 3) | PASS: mtf.maxAbs 4.02e-13 (3 of 3) |
| catalog-pentax-110-24f28 | 3 | PASS: mtf.maxAbs 3.67e-13 (3 of 3) | PASS: mtf.maxAbs 3.21e-13 (3 of 3) | PASS: mtf.maxAbs 3.87e-13 (3 of 3) |
| catalog-pentax-645-a-45mm-f28 | 3 | PASS: mtf.maxAbs 3.34e-12 (3 of 3) | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) |
| catalog-pentax-645-fa-120mm-f4-macro | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) |
| catalog-pentax-a-200mm-f4-macro-ed | 3 | PASS: mtf.maxAbs 1.64e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) | PASS: mtf.maxAbs 3.08e-12 (3 of 3) |
| catalog-pentax-a-35-70f4-wide | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 4.81e-13 (3 of 3) | PASS: mtf.maxAbs 8.03e-13 (3 of 3) |
| catalog-pentax-a-35-70f4-tele | 3 | PASS: mtf.maxAbs 6.86e-13 (3 of 3) | PASS: mtf.maxAbs 8.00e-13 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) |
| catalog-pentax-a-star-135mm-f18 | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 9.36e-13 (3 of 3) |
| catalog-pentax-da-11-18-f28-wide | 3 | PASS: mtf.maxAbs 6.87e-12 (3 of 3) | PASS: mtf.maxAbs 7.06e-12 (3 of 3) | PASS: mtf.maxAbs 2.35e-12 (3 of 3) |
| catalog-pentax-da-11-18-f28-tele | 3 | PASS: mtf.maxAbs 9.26e-12 (3 of 3) | PASS: mtf.maxAbs 6.98e-12 (3 of 3) | PASS: mtf.maxAbs 4.17e-12 (3 of 3) |
| catalog-pentax-da-16-50-f28-wide | 3 | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) | PASS: mtf.maxAbs 2.65e-12 (3 of 3) |
| catalog-pentax-da-16-50-f28-tele | 3 | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 2.74e-12 (3 of 3) | PASS: mtf.maxAbs 3.70e-12 (3 of 3) |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-wide | 3 | PASS: mtf.maxAbs 3.84e-12 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.92e-12 (3 of 3) |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-tele | 3 | PASS: mtf.maxAbs 2.98e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) | PASS: mtf.maxAbs 3.19e-12 (3 of 3) |
| catalog-pentax-da-18-55mm-f35-56-al-wide | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) |
| catalog-pentax-da-18-55mm-f35-56-al-tele | 3 | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.22e-12 (3 of 3) | PASS: mtf.maxAbs 3.00e-12 (3 of 3) |
| catalog-pentax-da-21mm-f32-limited | 3 | PASS: mtf.maxAbs 6.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 9.57e-13 (3 of 3) |
| catalog-pentax-da-35mm-f28-macro-limited | 3 | PASS: mtf.maxAbs 5.54e-13 (3 of 3) | PASS: mtf.maxAbs 4.62e-13 (3 of 3) | PASS: mtf.maxAbs 4.16e-13 (3 of 3) |
| catalog-pentax-da-50-135-f28-wide | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 8.19e-13 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) |
| catalog-pentax-da-50-135-f28-tele | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.52e-12 (3 of 3) |
| catalog-pentax-da-70mm-f24-limited | 3 | PASS: mtf.maxAbs 5.42e-13 (3 of 3) | PASS: mtf.maxAbs 4.11e-13 (3 of 3) | PASS: mtf.maxAbs 4.32e-13 (3 of 3) |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-wide | 3 | PASS: mtf.maxAbs 9.56e-13 (3 of 3) | PASS: mtf.maxAbs 1.79e-12 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-tele | 3 | PASS: mtf.maxAbs 2.05e-12 (3 of 3) | PASS: mtf.maxAbs 2.78e-12 (3 of 3) | PASS: mtf.maxAbs 3.70e-12 (3 of 3) |
| catalog-pentax-dfa-50mm-f14-sdm-aw | 3 | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) |
| catalog-pentax-dfa-85mm-f14 | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 9.05e-13 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| catalog-pentax-dfa645-25mm-f4-al-if-sdm-aw | 3 | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.92e-12 (3 of 3) | PASS: mtf.maxAbs 2.74e-12 (3 of 3) |
| catalog-pentax-dfa645-90f28-ed-aw-sr-macro | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 4.01e-12 (3 of 3) | PASS: mtf.maxAbs 2.93e-12 (3 of 3) |
| catalog-pentax-f-85-f28-soft | 3 | PASS: mtf.maxAbs 1.63e-12 (3 of 3) | PASS: mtf.maxAbs 6.65e-13 (3 of 3) | PASS: mtf.maxAbs 1.09e-12 (3 of 3) |
| catalog-pentax-fa-20-35mm-f4-al-wide | 3 | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) |
| catalog-pentax-fa-20-35mm-f4-al-tele | 3 | PASS: mtf.maxAbs 7.11e-13 (3 of 3) | PASS: mtf.maxAbs 2.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) |
| catalog-pentax-fa-28mm-f28-soft | 3 | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 8.57e-13 (3 of 3) | PASS: mtf.maxAbs 6.50e-13 (3 of 3) |
| catalog-pentax-fa-31-f18-al-ltd | 3 | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) |
| catalog-pentax-fa-star-300mm-f45-ed-if | 3 | PASS: mtf.maxAbs 2.66e-12 (3 of 3) | PASS: mtf.maxAbs 1.20e-12 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-wide | 3 | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-tele | 3 | PASS: mtf.maxAbs 5.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.66e-12 (3 of 3) | PASS: mtf.maxAbs 5.37e-12 (3 of 3) |
| catalog-pentax-hd-d-fa645-35f35-al-if | 2 | PASS: mtf.maxAbs 1.57e-12 (2 of 2) | PASS: mtf.maxAbs 1.60e-12 (2 of 2) | PASS: mtf.maxAbs 1.89e-12 (2 of 2) |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-wide | 3 | PASS: mtf.maxAbs 4.95e-13 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-tele | 3 | PASS: mtf.maxAbs 1.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.96e-12 (3 of 3) | PASS: mtf.maxAbs 3.01e-12 (3 of 3) |
| catalog-pentax-hd-da-20-40-f28-4-limited-wide | 3 | PASS: mtf.maxAbs 5.06e-13 (3 of 3) | PASS: mtf.maxAbs 1.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) |
| catalog-pentax-hd-da-20-40-f28-4-limited-tele | 3 | PASS: mtf.maxAbs 8.16e-13 (3 of 3) | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) |
| catalog-pentax-hd-dfa-21mm-f24-limited | 3 | PASS: mtf.maxAbs 1.15e-12 (3 of 3) | PASS: mtf.maxAbs 3.61e-12 (3 of 3) | PASS: mtf.maxAbs 3.53e-12 (3 of 3) |
| catalog-pentax-smc-67-100mm-f4 | 3 | PASS: mtf.maxAbs 8.97e-13 (3 of 3) | PASS: mtf.maxAbs 9.08e-13 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) |
| catalog-pentax-smc-da-16-45-f4-ed-al-wide | 3 | PASS: mtf.maxAbs 1.01e-12 (3 of 3) | PASS: mtf.maxAbs 7.89e-13 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| catalog-pentax-smc-da-16-45-f4-ed-al-tele | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 7.62e-13 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-wide | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 8.81e-13 (3 of 3) |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-tele | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 2.07e-12 (3 of 3) |
| catalog-pentax-super-takumar-135mm-f2-5 | 3 | PASS: mtf.maxAbs 2.31e-12 (3 of 3) | PASS: mtf.maxAbs 6.95e-13 (3 of 3) | PASS: mtf.maxAbs 1.91e-12 (3 of 3) |
| catalog-pentax-super-takumar-28mm-f35 | 3 | PASS: mtf.maxAbs 7.99e-13 (3 of 3) | PASS: mtf.maxAbs 9.50e-13 (3 of 3) | PASS: mtf.maxAbs 8.45e-13 (3 of 3) |
| catalog-pentax-super-takumar-35mm-f2 | 3 | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 7.90e-13 (3 of 3) | PASS: mtf.maxAbs 7.96e-13 (3 of 3) |
| catalog-pentax-ultra-achromatic-takumar-85f45 | 3 | PASS: mtf.maxAbs 8.05e-13 (3 of 3) | PASS: mtf.maxAbs 7.96e-13 (3 of 3) | PASS: mtf.maxAbs 5.58e-13 (3 of 3) |
| catalog-pentax110-50f28 | 3 | PASS: mtf.maxAbs 2.79e-13 (3 of 3) | PASS: mtf.maxAbs 1.78e-13 (3 of 3) | PASS: mtf.maxAbs 2.90e-13 (3 of 3) |
| catalog-ricoh-gr-18p3-f2p8 | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 1.59e-11 (3 of 3) | PASS: mtf.maxAbs 1.69e-11 (3 of 3) |
| catalog-ricoh-gr-digital-iii-6mm-f19 | 3 | PASS: mtf.maxAbs 9.13e-14 (3 of 3) | PASS: mtf.maxAbs 5.88e-12 (3 of 3) | PASS: mtf.maxAbs 5.84e-12 (3 of 3) |
| catalog-ricoh-gr-lens-6mm-f19-gr-digital-iv | 3 | PASS: mtf.maxAbs 1.09e-13 (3 of 3) | PASS: mtf.maxAbs 2.78e-12 (3 of 3) | PASS: mtf.maxAbs 2.81e-12 (3 of 3) |
| catalog-ricoh-gr1-28f28 | 3 | PASS: mtf.maxAbs 6.91e-13 (3 of 3) | PASS: mtf.maxAbs 1.11e-11 (3 of 3) | PASS: mtf.maxAbs 1.07e-11 (3 of 3) |
| catalog-ricoh-gr3-28f28 | 3 | PASS: mtf.maxAbs 1.73e-11 (3 of 3) | PASS: mtf.maxAbs 2.28e-11 (3 of 3) | PASS: mtf.maxAbs 7.99e-12 (3 of 3) |
| catalog-ricoh-gr3x-26f28 | 3 | PASS: mtf.maxAbs 5.60e-13 (3 of 3) | PASS: mtf.maxAbs 2.72e-11 (3 of 3) | PASS: mtf.maxAbs 2.67e-11 (3 of 3) |
| catalog-ricoh-gr4-28f28 | 3 | PASS: mtf.maxAbs 9.17e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) |
| catalog-ricoh-gxr-a12-18f25 | 3 | PASS: mtf.maxAbs 4.85e-13 (3 of 3) | PASS: mtf.maxAbs 3.89e-12 (3 of 3) | PASS: mtf.maxAbs 4.02e-12 (3 of 3) |
| catalog-ricoh-lens-a16-24-85-f35-55-wide | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 6.27e-12 (3 of 3) | PASS: mtf.maxAbs 6.10e-12 (3 of 3) |
| catalog-ricoh-lens-a16-24-85-f35-55-tele | 3 | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 6.69e-12 (3 of 3) | PASS: mtf.maxAbs 6.60e-12 (3 of 3) |
| catalog-rodenstock-apo-sironar-w-150f56 | 3 | PASS: mtf.maxAbs 4.81e-12 (3 of 3) | PASS: mtf.maxAbs 4.66e-12 (3 of 3) | PASS: mtf.maxAbs 4.22e-12 (3 of 3) |
| catalog-rodenstock-apo-sironar-w-150f56-a1-reconstruction | 2 | PASS: mtf.maxAbs 3.32e-12 (2 of 2) | PASS: mtf.maxAbs 1.45e-12 (2 of 2) | PASS: mtf.maxAbs 3.35e-12 (2 of 2) |
| catalog-rodenstock-geronar-210mm-f68 | 3 | PASS: mtf.maxAbs 3.47e-12 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) | PASS: mtf.maxAbs 3.29e-12 (3 of 3) |
| catalog-rodenstock-geronar-wa-90mm-f8 | 3 | PASS: mtf.maxAbs 4.13e-12 (3 of 3) | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-rodenstock-grandagon-n-65mm-f45 | 2 | PASS: mtf.maxAbs 1.82e-12 (2 of 2) | PASS: mtf.maxAbs 1.09e-12 (2 of 2) | PASS: mtf.maxAbs 1.96e-12 (2 of 2) |
| catalog-rodenstock-grandagon-n-75mm-f45 | 2 | PASS: mtf.maxAbs 1.52e-12 (2 of 2) | PASS: mtf.maxAbs 1.32e-12 (2 of 2) | PASS: mtf.maxAbs 1.34e-12 (2 of 2) |
| catalog-rodenstock-grandagon-n-75mm-f68 | 3 | PASS: mtf.maxAbs 9.00e-12 (3 of 3) | PASS: mtf.maxAbs 5.08e-12 (3 of 3) | PASS: mtf.maxAbs 6.82e-12 (3 of 3) |
| catalog-rodenstock-grandagon-n-90mm-f45 | 2 | PASS: mtf.maxAbs 2.39e-12 (2 of 2) | PASS: mtf.maxAbs 1.24e-12 (2 of 2) | PASS: mtf.maxAbs 2.32e-12 (2 of 2) |
| catalog-rodenstock-rodagon-wa-80mm-f4 | 3 | PASS: mtf.maxAbs 1.42e-12 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 2.00e-12 (3 of 3) |
| catalog-rodenstock-rogonar-s-50f28 | 3 | PASS: mtf.maxAbs 5.88e-13 (3 of 3) | PASS: mtf.maxAbs 4.55e-13 (3 of 3) | PASS: mtf.maxAbs 5.69e-13 (3 of 3) |
| catalog-rodenstock-sironar-100mm-f56-convertible | 3 | PASS: mtf.maxAbs 3.47e-12 (3 of 3) | PASS: mtf.maxAbs 2.52e-12 (3 of 3) | PASS: mtf.maxAbs 4.54e-12 (3 of 3) |
| catalog-rodenstock-sironar-n-100mm-f56 | 3 | PASS: mtf.maxAbs 2.30e-12 (3 of 3) | PASS: mtf.maxAbs 9.35e-13 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) |
| catalog-russar-21-60f18 | 3 | PASS: mtf.maxAbs 6.12e-12 (3 of 3) | PASS: mtf.maxAbs 4.33e-12 (3 of 3) | PASS: mtf.maxAbs 9.00e-12 (3 of 3) |
| catalog-russar-22-70f8 | 3 | PASS: mtf.maxAbs 1.71e-9 (3 of 3) | PASS: mtf.maxAbs 1.18e-9 (3 of 3) | PASS: mtf.maxAbs 6.89e-10 (3 of 3) |
| catalog-samsung-30mm-f2 | 3 | PASS: mtf.maxAbs 3.91e-12 (3 of 3) | PASS: mtf.maxAbs 6.67e-12 (3 of 3) | PASS: mtf.maxAbs 7.27e-12 (3 of 3) |
| catalog-samsung-galaxy-s9-main-wide | 2 | PASS: mtf.maxAbs 1.86e-10 (2 of 2) | PASS: mtf.maxAbs 2.27e-11 (2 of 2) | PASS: mtf.maxAbs 2.07e-10 (2 of 2) |
| catalog-samsung-nx-20mm-f28 | 3 | PASS: mtf.maxAbs 8.80e-13 (3 of 3) | PASS: mtf.maxAbs 1.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| catalog-samsung-nx-45mm-f18 | 3 | PASS: mtf.maxAbs 6.47e-13 (3 of 3) | PASS: mtf.maxAbs 5.45e-13 (3 of 3) | PASS: mtf.maxAbs 4.91e-13 (3 of 3) |
| catalog-samyang-100mm-f28-ed-umc-macro | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 2.66e-12 (3 of 3) |
| catalog-samyang-135mm-f2-ed-umc | 3 | PASS: mtf.maxAbs 1.56e-12 (3 of 3) | PASS: mtf.maxAbs 4.53e-13 (3 of 3) | PASS: mtf.maxAbs 1.74e-12 (3 of 3) |
| catalog-samyang-af-14mm-f28-ef | 3 | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 5.52e-12 (3 of 3) | PASS: mtf.maxAbs 6.21e-12 (3 of 3) |
| catalog-samyang-af-14mm-f2p8-fe | 3 | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) |
| catalog-samyang-af-18mm-f28-fe | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 2.96e-11 (3 of 3) | PASS: mtf.maxAbs 2.99e-11 (3 of 3) |
| catalog-samyang-af-24mm-f1p8-fe | 3 | PASS: mtf.maxAbs 2.79e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-11 (3 of 3) | PASS: mtf.maxAbs 1.25e-11 (3 of 3) |
| catalog-samyang-af-24mm-f2p8-fe | 3 | PASS: mtf.maxAbs 8.42e-13 (3 of 3) | PASS: mtf.maxAbs 1.80e-11 (3 of 3) | PASS: mtf.maxAbs 1.82e-11 (3 of 3) |
| catalog-samyang-af-35-150mm-f2-28-wide | 2 | PASS: mtf.maxAbs 8.09e-12 (2 of 2) | PASS: mtf.maxAbs 3.44e-12 (2 of 2) | PASS: mtf.maxAbs 6.62e-12 (2 of 2) |
| catalog-samyang-af-35-150mm-f2-28-tele | 3 | PASS: mtf.maxAbs 1.35e-11 (3 of 3) | PASS: mtf.maxAbs 9.06e-12 (3 of 3) | PASS: mtf.maxAbs 7.30e-12 (3 of 3) |
| catalog-samyang-af-50mm-f1p4-fe | 3 | PASS: mtf.maxAbs 1.89e-12 (3 of 3) | PASS: mtf.maxAbs 5.71e-12 (3 of 3) | PASS: mtf.maxAbs 5.32e-12 (3 of 3) |
| catalog-samyang-af-85mm-f14-fe | 3 | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 7.69e-13 (3 of 3) | PASS: mtf.maxAbs 7.57e-13 (3 of 3) |
| catalog-samyang-xp-35mm-f1p2 | 3 | PASS: mtf.maxAbs 9.00e-12 (3 of 3) | PASS: mtf.maxAbs 9.67e-12 (3 of 3) | PASS: mtf.maxAbs 1.00e-11 (3 of 3) |
| catalog-schacht-s-travenar-135f28 | 3 | PASS: mtf.maxAbs 6.60e-13 (3 of 3) | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 8.31e-13 (3 of 3) |
| catalog-schacht-travenar-135mm-f35 | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 8.31e-13 (3 of 3) |
| catalog-schacht-travenar-90f28 | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 7.58e-13 (3 of 3) | PASS: mtf.maxAbs 8.81e-13 (3 of 3) |
| catalog-schneider-apo-symmar-100-f56 | 3 | PASS: mtf.maxAbs 4.74e-12 (3 of 3) | PASS: mtf.maxAbs 3.65e-12 (3 of 3) | PASS: mtf.maxAbs 4.63e-12 (3 of 3) |
| catalog-schneider-cine-xenon-25f14 | 3 | PASS: mtf.maxAbs 3.38e-13 (3 of 3) | PASS: mtf.maxAbs 1.75e-13 (3 of 3) | PASS: mtf.maxAbs 3.94e-13 (3 of 3) |
| catalog-schneider-cinegon-10f18 | 3 | PASS: mtf.maxAbs 4.25e-13 (3 of 3) | PASS: mtf.maxAbs 2.59e-13 (3 of 3) | PASS: mtf.maxAbs 4.96e-13 (3 of 3) |
| catalog-schneider-cinegon-65f19 | 3 | PASS: mtf.maxAbs 1.44e-13 (3 of 3) | PASS: mtf.maxAbs 1.43e-13 (3 of 3) | PASS: mtf.maxAbs 2.12e-13 (3 of 3) |
| catalog-schneider-curtagon-35mm-f28-gen2 | 3 | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.29e-12 (3 of 3) |
| catalog-schneider-kreuznach-angulon-210-f68 | 3 | PASS: mtf.maxAbs 9.03e-12 (3 of 3) | PASS: mtf.maxAbs 5.25e-12 (3 of 3) | PASS: mtf.maxAbs 6.79e-12 (3 of 3) |
| catalog-schneider-kreuznach-xenar-50f28 | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) |
| catalog-schneider-pa-curtagon-r-35f4 | 3 | PASS: mtf.maxAbs 9.06e-13 (3 of 3) | PASS: mtf.maxAbs 7.43e-13 (3 of 3) | PASS: mtf.maxAbs 9.64e-13 (3 of 3) |
| catalog-schneider-retina-curtagon-28f4 | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 1.05e-12 (3 of 3) |
| catalog-schneider-retina-xenon-c-50f2 | 3 | PASS: mtf.maxAbs 8.90e-13 (3 of 3) | PASS: mtf.maxAbs 6.30e-13 (3 of 3) | PASS: mtf.maxAbs 9.80e-13 (3 of 3) |
| catalog-schneider-super-angulon-75-f56 | 3 | PASS: mtf.maxAbs 1.15e-11 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 1.57e-11 (3 of 3) |
| catalog-schneider-super-angulon-90mm-f8 | 3 | PASS: mtf.maxAbs 1.10e-11 (3 of 3) | PASS: mtf.maxAbs 3.77e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) |
| catalog-schneider-super-symmar-hm-120f56 | 2 | PASS: mtf.maxAbs 4.25e-12 (2 of 2) | PASS: mtf.maxAbs 8.69e-13 (2 of 2) | PASS: mtf.maxAbs 3.52e-12 (2 of 2) |
| catalog-schneider-super-symmar-xl-110-f56 | 3 | PASS: mtf.maxAbs 1.27e-11 (3 of 3) | PASS: mtf.maxAbs 1.43e-11 (3 of 3) | PASS: mtf.maxAbs 1.29e-11 (3 of 3) |
| catalog-schneider-technika-super-angulon-75mm-f8 | 3 | PASS: mtf.maxAbs 7.86e-12 (3 of 3) | PASS: mtf.maxAbs 3.06e-12 (3 of 3) | PASS: mtf.maxAbs 8.11e-12 (3 of 3) |
| catalog-schneider-tele-variogon-80-240-f4-wide | 3 | PASS: mtf.maxAbs 2.44e-12 (3 of 3) | PASS: mtf.maxAbs 6.98e-13 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-schneider-tele-variogon-80-240-f4-tele | 2 | PASS: mtf.maxAbs 1.43e-12 (2 of 2) | PASS: mtf.maxAbs 9.23e-13 (2 of 2) | PASS: mtf.maxAbs 1.38e-12 (2 of 2) |
| catalog-schneider-tele-xenar-180f45 | 3 | PASS: mtf.maxAbs 2.79e-12 (3 of 3) | PASS: mtf.maxAbs 1.36e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | 2 | PASS: mtf.maxAbs 1.91e-12 (2 of 2) | PASS: mtf.maxAbs 6.43e-13 (2 of 2) | PASS: mtf.maxAbs 2.35e-12 (2 of 2) |
| catalog-schneider-tv-variogon-20-600-f21-66-tele | 3 | PASS: mtf.maxAbs 1.02e-11 (3 of 3) | PASS: mtf.maxAbs 5.83e-12 (3 of 3) | PASS: mtf.maxAbs 1.29e-11 (3 of 3) |
| catalog-schneider-variogon-10-40-f28-wide | 3 | PASS: mtf.maxAbs 2.86e-13 (3 of 3) | PASS: mtf.maxAbs 2.14e-13 (3 of 3) | PASS: mtf.maxAbs 4.16e-13 (3 of 3) |
| catalog-schneider-variogon-10-40-f28-tele | 3 | PASS: mtf.maxAbs 2.18e-13 (3 of 3) | PASS: mtf.maxAbs 1.57e-13 (3 of 3) | PASS: mtf.maxAbs 1.75e-13 (3 of 3) |
| catalog-schneider-variogon-45-100-f28-wide | 3 | PASS: mtf.maxAbs 1.25e-12 (3 of 3) | PASS: mtf.maxAbs 6.33e-13 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) |
| catalog-schneider-variogon-45-100-f28-tele | 3 | PASS: mtf.maxAbs 3.15e-12 (3 of 3) | PASS: mtf.maxAbs 2.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.58e-12 (3 of 3) |
| catalog-schneider-variogon-8-40-f18-wide | 3 | PASS: mtf.maxAbs 6.12e-13 (3 of 3) | PASS: mtf.maxAbs 2.52e-13 (3 of 3) | PASS: mtf.maxAbs 5.93e-13 (3 of 3) |
| catalog-schneider-variogon-8-40-f18-tele | 3 | PASS: mtf.maxAbs 4.62e-13 (3 of 3) | PASS: mtf.maxAbs 2.77e-13 (3 of 3) | PASS: mtf.maxAbs 4.33e-13 (3 of 3) |
| catalog-schneider-xenon-50f19 | 3 | PASS: mtf.maxAbs 9.74e-13 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 9.57e-13 (3 of 3) |
| catalog-sigma-10-18mm-f28-dc-dn-wide | 3 | PASS: mtf.maxAbs 1.04e-11 (3 of 3) | PASS: mtf.maxAbs 1.10e-11 (3 of 3) | PASS: mtf.maxAbs 2.51e-12 (3 of 3) |
| catalog-sigma-10-18mm-f28-dc-dn-tele | 3 | PASS: mtf.maxAbs 5.93e-13 (3 of 3) | PASS: mtf.maxAbs 3.07e-12 (3 of 3) | PASS: mtf.maxAbs 3.00e-12 (3 of 3) |
| catalog-sigma-105mm-f14-dg-hsm-art | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) |
| catalog-sigma-105mm-f28-dg-dn-macro-art | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 2.27e-12 (3 of 3) | PASS: mtf.maxAbs 3.51e-12 (3 of 3) |
| catalog-sigma-12mm-f14-dc-contemporary | 3 | PASS: mtf.maxAbs 3.33e-12 (3 of 3) | PASS: mtf.maxAbs 6.28e-12 (3 of 3) | PASS: mtf.maxAbs 7.86e-12 (3 of 3) |
| catalog-sigma-135mm-f14-dg-art | 3 | PASS: mtf.maxAbs 3.46e-12 (3 of 3) | PASS: mtf.maxAbs 5.28e-12 (3 of 3) | PASS: mtf.maxAbs 3.92e-12 (3 of 3) |
| catalog-sigma-14-24-f28-dg-dn-art-wide | 3 | PASS: mtf.maxAbs 6.83e-12 (3 of 3) | PASS: mtf.maxAbs 1.00e-11 (3 of 3) | PASS: mtf.maxAbs 3.18e-12 (3 of 3) |
| catalog-sigma-14-24-f28-dg-dn-art-tele | 3 | PASS: mtf.maxAbs 3.88e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) |
| catalog-sigma-14-24mm-f28-dg-hsm-art-wide | 3 | PASS: mtf.maxAbs 2.07e-11 (3 of 3) | PASS: mtf.maxAbs 1.41e-11 (3 of 3) | PASS: mtf.maxAbs 6.66e-12 (3 of 3) |
| catalog-sigma-14-24mm-f28-dg-hsm-art-tele | 3 | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 4.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-11 (3 of 3) |
| catalog-sigma-16mm-f14-dc-dn | 3 | PASS: mtf.maxAbs 4.86e-12 (3 of 3) | PASS: mtf.maxAbs 5.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) |
| catalog-sigma-17-40mm-f18-dc-art-wide | 3 | PASS: mtf.maxAbs 1.53e-12 (3 of 3) | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) |
| catalog-sigma-17-40mm-f18-dc-art-tele | 3 | PASS: mtf.maxAbs 1.04e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 1.97e-12 (3 of 3) |
| catalog-sigma-18-35-f18-dc-hsm-art-wide | 3 | PASS: mtf.maxAbs 9.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) |
| catalog-sigma-18-35-f18-dc-hsm-art-tele | 3 | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 3.40e-12 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) |
| catalog-sigma-200mm-f2-dg-os-sports | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 3.18e-12 (3 of 3) |
| catalog-sigma-20mm-f14-dg-hsm-art | 3 | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 4.99e-12 (3 of 3) | PASS: mtf.maxAbs 4.14e-12 (3 of 3) |
| catalog-sigma-23mm-f14-dc-dn-c | 3 | PASS: mtf.maxAbs 8.92e-13 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-12 (3 of 3) |
| catalog-sigma-24-105-f4-dg-os-hsm-art-wide | 3 | PASS: mtf.maxAbs 1.78e-12 (3 of 3) | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.85e-12 (3 of 3) |
| catalog-sigma-24-105-f4-dg-os-hsm-art-tele | 3 | PASS: mtf.maxAbs 3.00e-12 (3 of 3) | PASS: mtf.maxAbs 3.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.38e-12 (3 of 3) |
| catalog-sigma-24-70-f28-dg-os-hsm-art-wide | 3 | PASS: mtf.maxAbs 1.23e-11 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) | PASS: mtf.maxAbs 4.92e-12 (3 of 3) |
| catalog-sigma-24-70-f28-dg-os-hsm-art-tele | 3 | PASS: mtf.maxAbs 3.78e-12 (3 of 3) | PASS: mtf.maxAbs 4.12e-12 (3 of 3) | PASS: mtf.maxAbs 5.15e-12 (3 of 3) |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-wide | 3 | PASS: mtf.maxAbs 9.52e-13 (3 of 3) | PASS: mtf.maxAbs 2.57e-12 (3 of 3) | PASS: mtf.maxAbs 3.05e-12 (3 of 3) |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-tele | 3 | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) |
| catalog-sigma-24mm-f14-art-dn | 3 | PASS: mtf.maxAbs 4.59e-12 (3 of 3) | PASS: mtf.maxAbs 7.54e-12 (3 of 3) | PASS: mtf.maxAbs 6.21e-12 (3 of 3) |
| catalog-sigma-24mm-f18-ex-dg-aspherical-macro | 3 | PASS: mtf.maxAbs 3.76e-12 (3 of 3) | PASS: mtf.maxAbs 2.96e-12 (3 of 3) | PASS: mtf.maxAbs 2.89e-12 (3 of 3) |
| catalog-sigma-24mm-f2-dg-dn-contemporary | 3 | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 1.92e-11 (3 of 3) | PASS: mtf.maxAbs 1.86e-11 (3 of 3) |
| catalog-sigma-24mm-f35-dg-dn | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 4.81e-12 (3 of 3) | PASS: mtf.maxAbs 5.73e-12 (3 of 3) |
| catalog-sigma-28-105f28-dg-dn-art-wide | 3 | PASS: mtf.maxAbs 2.30e-11 (3 of 3) | PASS: mtf.maxAbs 1.37e-11 (3 of 3) | PASS: mtf.maxAbs 1.58e-11 (3 of 3) |
| catalog-sigma-28-105f28-dg-dn-art-tele | 3 | PASS: mtf.maxAbs 4.93e-12 (3 of 3) | PASS: mtf.maxAbs 2.37e-11 (3 of 3) | PASS: mtf.maxAbs 1.92e-11 (3 of 3) |
| catalog-sigma-28-45mm-f18-dg-dn-wide | 3 | PASS: mtf.maxAbs 9.56e-12 (3 of 3) | PASS: mtf.maxAbs 5.65e-12 (3 of 3) | PASS: mtf.maxAbs 4.55e-12 (3 of 3) |
| catalog-sigma-28-45mm-f18-dg-dn-tele | 3 | PASS: mtf.maxAbs 7.21e-12 (3 of 3) | PASS: mtf.maxAbs 4.46e-12 (3 of 3) | PASS: mtf.maxAbs 8.59e-12 (3 of 3) |
| catalog-sigma-28mm-f14-dg-hsm-art | 3 | PASS: mtf.maxAbs 9.95e-13 (3 of 3) | PASS: mtf.maxAbs 4.20e-12 (3 of 3) | PASS: mtf.maxAbs 4.03e-12 (3 of 3) |
| catalog-sigma-28mm-f18-ex-dg-aspherical-macro | 3 | PASS: mtf.maxAbs 3.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.70e-12 (3 of 3) | PASS: mtf.maxAbs 3.87e-12 (3 of 3) |
| catalog-sigma-30mm-f14-dc-hsm-a | 3 | PASS: mtf.maxAbs 9.36e-13 (3 of 3) | PASS: mtf.maxAbs 4.29e-13 (3 of 3) | PASS: mtf.maxAbs 8.86e-13 (3 of 3) |
| catalog-sigma-35-f14-dgdn-art | 3 | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 9.38e-12 (3 of 3) | PASS: mtf.maxAbs 8.12e-12 (3 of 3) |
| catalog-sigma-35mm-f12-dg-ii-art | 3 | PASS: mtf.maxAbs 2.89e-12 (3 of 3) | PASS: mtf.maxAbs 7.99e-12 (3 of 3) | PASS: mtf.maxAbs 5.74e-12 (3 of 3) |
| catalog-sigma-35mm-f14-dg-hsm-a | 3 | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 5.28e-12 (3 of 3) | PASS: mtf.maxAbs 5.29e-12 (3 of 3) |
| catalog-sigma-45mm-f28-dg-dn-contemporary | 3 | PASS: mtf.maxAbs 1.08e-11 (3 of 3) | PASS: mtf.maxAbs 3.87e-12 (3 of 3) | PASS: mtf.maxAbs 1.00e-11 (3 of 3) |
| catalog-sigma-50f14-dg-hsm-a | 3 | PASS: mtf.maxAbs 8.91e-13 (3 of 3) | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 2.18e-12 (3 of 3) |
| catalog-sigma-50f14-dgdn-art | 3 | PASS: mtf.maxAbs 5.61e-12 (3 of 3) | PASS: mtf.maxAbs 6.46e-12 (3 of 3) | PASS: mtf.maxAbs 5.55e-12 (3 of 3) |
| catalog-sigma-50mm-f12-dg-dn-art | 3 | PASS: mtf.maxAbs 1.99e-12 (3 of 3) | PASS: mtf.maxAbs 3.22e-12 (3 of 3) | PASS: mtf.maxAbs 4.83e-12 (3 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-wide | 3 | PASS: mtf.maxAbs 3.59e-12 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 4.42e-12 (3 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-tele | 3 | PASS: mtf.maxAbs 6.11e-12 (3 of 3) | PASS: mtf.maxAbs 2.32e-12 (3 of 3) | PASS: mtf.maxAbs 6.36e-12 (3 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-wide | 3 | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.83e-12 (3 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-tele | 3 | PASS: mtf.maxAbs 4.08e-12 (3 of 3) | PASS: mtf.maxAbs 3.06e-12 (3 of 3) | PASS: mtf.maxAbs 4.35e-12 (3 of 3) |
| catalog-sigma-60mm-f28-dn | 3 | PASS: mtf.maxAbs 3.38e-13 (3 of 3) | PASS: mtf.maxAbs 9.25e-13 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) |
| catalog-sigma-65mm-f2-dg-dn | 3 | PASS: mtf.maxAbs 8.08e-13 (3 of 3) | PASS: mtf.maxAbs 3.52e-12 (3 of 3) | PASS: mtf.maxAbs 3.40e-12 (3 of 3) |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-wide | 3 | PASS: mtf.maxAbs 6.58e-12 (3 of 3) | PASS: mtf.maxAbs 5.76e-12 (3 of 3) | PASS: mtf.maxAbs 4.94e-12 (3 of 3) |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-tele | 3 | PASS: mtf.maxAbs 1.14e-11 (3 of 3) | PASS: mtf.maxAbs 1.15e-11 (3 of 3) | PASS: mtf.maxAbs 3.89e-12 (3 of 3) |
| catalog-sigma-70-300mm-f4-56-dg-os-wide | 3 | PASS: mtf.maxAbs 1.83e-12 (3 of 3) | PASS: mtf.maxAbs 7.41e-13 (3 of 3) | PASS: mtf.maxAbs 2.53e-12 (3 of 3) |
| catalog-sigma-70-300mm-f4-56-dg-os-tele | 3 | PASS: mtf.maxAbs 3.58e-12 (3 of 3) | PASS: mtf.maxAbs 2.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.87e-12 (3 of 3) |
| catalog-sigma-80-400mm-f45-56-ex-os-wide | 3 | PASS: mtf.maxAbs 2.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 2.38e-12 (3 of 3) |
| catalog-sigma-80-400mm-f45-56-ex-os-tele | 3 | PASS: mtf.maxAbs 3.20e-12 (3 of 3) | PASS: mtf.maxAbs 3.63e-12 (3 of 3) | PASS: mtf.maxAbs 2.12e-12 (3 of 3) |
| catalog-sigma-85f14-art | 3 | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 3.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.43e-12 (3 of 3) |
| catalog-sigma-85mm-f12-dg-art | 3 | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 3.02e-12 (3 of 3) | PASS: mtf.maxAbs 3.49e-12 (3 of 3) |
| catalog-sigma-85mm-f14-ex-dg-hsm | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 2.05e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) |
| catalog-sigma-90mm-f28-dg-dn-contemporary | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.28e-12 (3 of 3) |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-wide | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 1.46e-12 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-tele | 3 | PASS: mtf.maxAbs 3.48e-12 (3 of 3) | PASS: mtf.maxAbs 2.48e-12 (3 of 3) | PASS: mtf.maxAbs 5.25e-12 (3 of 3) |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-wide | 3 | PASS: mtf.maxAbs 2.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.40e-12 (3 of 3) | PASS: mtf.maxAbs 2.50e-12 (3 of 3) |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-tele | 3 | PASS: mtf.maxAbs 3.94e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 3.66e-12 (3 of 3) |
| catalog-sigma-apo-macro-105mm-f28-os-hsm | 3 | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) |
| catalog-sigma-apo-macro-150mm-f28-os-hsm | 3 | PASS: mtf.maxAbs 3.67e-12 (3 of 3) | PASS: mtf.maxAbs 3.38e-12 (3 of 3) | PASS: mtf.maxAbs 7.04e-12 (3 of 3) |
| catalog-sigma-apo-macro-180mm-f28-os-hsm | 3 | PASS: mtf.maxAbs 2.74e-12 (3 of 3) | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 3.39e-12 (3 of 3) |
| catalog-sigma-apo-macro-180mm-f56-uc | 3 | PASS: mtf.maxAbs 9.40e-13 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.81e-12 (3 of 3) |
| catalog-sigma-art-40-f14 | 3 | PASS: mtf.maxAbs 8.95e-13 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-12 (3 of 3) |
| catalog-sigma-art-85mm-f14-dgdn | 3 | PASS: mtf.maxAbs 3.20e-12 (3 of 3) | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 2.67e-12 (3 of 3) |
| catalog-sigma-dp0-quattro-14-f4 | 3 | PASS: mtf.maxAbs 4.08e-12 (3 of 3) | PASS: mtf.maxAbs 4.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) |
| catalog-sigma-dp1x-16mm-f4 | 3 | PASS: mtf.maxAbs 4.25e-13 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) |
| catalog-sigma-dp2m-30f28 | 3 | PASS: mtf.maxAbs 2.58e-13 (3 of 3) | PASS: mtf.maxAbs 7.14e-13 (3 of 3) | PASS: mtf.maxAbs 6.64e-13 (3 of 3) |
| catalog-sigma-dp2x-24mmf28 | 3 | PASS: mtf.maxAbs 5.59e-13 (3 of 3) | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) |
| catalog-sigma-dp3m-50f28 | 3 | PASS: mtf.maxAbs 5.21e-13 (3 of 3) | PASS: mtf.maxAbs 3.96e-12 (3 of 3) | PASS: mtf.maxAbs 4.18e-12 (3 of 3) |
| catalog-sigma-macro-70mm-f28-ex-dg | 3 | PASS: mtf.maxAbs 8.29e-13 (3 of 3) | PASS: mtf.maxAbs 8.40e-13 (3 of 3) | PASS: mtf.maxAbs 4.65e-13 (3 of 3) |
| catalog-sonnar-50f15 | 3 | PASS: mtf.maxAbs 1.29e-12 (3 of 3) | PASS: mtf.maxAbs 7.66e-13 (3 of 3) | PASS: mtf.maxAbs 9.42e-13 (3 of 3) |
| catalog-sonnar-e-24f18-za | 3 | PASS: mtf.maxAbs 2.34e-12 (3 of 3) | PASS: mtf.maxAbs 8.44e-12 (3 of 3) | PASS: mtf.maxAbs 8.83e-12 (3 of 3) |
| catalog-sony-dt-16-50mm-f28-ssm-wide | 3 | PASS: mtf.maxAbs 1.51e-11 (3 of 3) | PASS: mtf.maxAbs 4.33e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-11 (3 of 3) |
| catalog-sony-dt-16-50mm-f28-ssm-tele | 3 | PASS: mtf.maxAbs 2.10e-12 (3 of 3) | PASS: mtf.maxAbs 2.47e-12 (3 of 3) | PASS: mtf.maxAbs 1.95e-12 (3 of 3) |
| catalog-sony-e-18-200mm-f35-63-oss-le-wide | 3 | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 9.35e-13 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) |
| catalog-sony-e-18-200mm-f35-63-oss-le-tele | 3 | PASS: mtf.maxAbs 1.46e-12 (3 of 3) | PASS: mtf.maxAbs 3.43e-12 (3 of 3) | PASS: mtf.maxAbs 4.02e-12 (3 of 3) |
| catalog-sony-e-18-55mm-f35-56-oss-wide | 3 | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 2.89e-12 (3 of 3) | PASS: mtf.maxAbs 2.83e-12 (3 of 3) |
| catalog-sony-e-18-55mm-f35-56-oss-tele | 3 | PASS: mtf.maxAbs 7.30e-13 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.47e-12 (3 of 3) |
| catalog-sony-e-20f28 | 3 | PASS: mtf.maxAbs 8.14e-13 (3 of 3) | PASS: mtf.maxAbs 8.28e-12 (3 of 3) | PASS: mtf.maxAbs 8.49e-12 (3 of 3) |
| catalog-sony-e-35mm-f18-oss | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.16e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-12 (3 of 3) |
| catalog-sony-e-50mm-f18-oss | 2 | PASS: mtf.maxAbs 2.49e-13 (2 of 2) | PASS: mtf.maxAbs 4.66e-13 (2 of 2) | PASS: mtf.maxAbs 4.67e-13 (2 of 2) |
| catalog-sony-epz1650mmf3556oss-wide | 3 | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 3.81e-12 (3 of 3) | PASS: mtf.maxAbs 3.09e-12 (3 of 3) |
| catalog-sony-epz1650mmf3556oss-tele | 3 | PASS: mtf.maxAbs 9.12e-13 (3 of 3) | PASS: mtf.maxAbs 1.09e-11 (3 of 3) | PASS: mtf.maxAbs 1.02e-11 (3 of 3) |
| catalog-sony-fe-1224f28-gm-wide | 3 | PASS: mtf.maxAbs 2.64e-11 (3 of 3) | PASS: mtf.maxAbs 2.40e-11 (3 of 3) | PASS: mtf.maxAbs 7.03e-12 (3 of 3) |
| catalog-sony-fe-1224f28-gm-tele | 3 | PASS: mtf.maxAbs 2.58e-12 (3 of 3) | PASS: mtf.maxAbs 8.52e-12 (3 of 3) | PASS: mtf.maxAbs 1.00e-11 (3 of 3) |
| catalog-sony-fe-135-f18-gm | 3 | PASS: mtf.maxAbs 9.86e-13 (3 of 3) | PASS: mtf.maxAbs 8.51e-13 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) |
| catalog-sony-fe-14mm-f18-gm | 3 | PASS: mtf.maxAbs 3.75e-12 (3 of 3) | PASS: mtf.maxAbs 7.82e-12 (3 of 3) | PASS: mtf.maxAbs 6.91e-12 (3 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-wide | 3 | PASS: mtf.maxAbs 5.53e-12 (3 of 3) | PASS: mtf.maxAbs 5.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.40e-12 (3 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-tele | 3 | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 7.19e-12 (3 of 3) | PASS: mtf.maxAbs 8.65e-12 (3 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-ii-wide | 3 | PASS: mtf.maxAbs 1.49e-11 (3 of 3) | PASS: mtf.maxAbs 5.26e-12 (3 of 3) | PASS: mtf.maxAbs 1.99e-11 (3 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-ii-tele | 3 | PASS: mtf.maxAbs 1.52e-12 (3 of 3) | PASS: mtf.maxAbs 8.41e-12 (3 of 3) | PASS: mtf.maxAbs 8.50e-12 (3 of 3) |
| catalog-sony-fe-20-70mm-f4-g-wide | 2 | PASS: mtf.maxAbs 4.75e-13 (2 of 2) | PASS: mtf.maxAbs 2.90e-12 (2 of 2) | PASS: mtf.maxAbs 3.32e-12 (2 of 2) |
| catalog-sony-fe-20-70mm-f4-g-tele | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.27e-11 (3 of 3) | PASS: mtf.maxAbs 1.16e-11 (3 of 3) |
| catalog-sony-fe-20mm-f18-g | 3 | PASS: mtf.maxAbs 2.33e-12 (3 of 3) | PASS: mtf.maxAbs 3.25e-12 (3 of 3) | PASS: mtf.maxAbs 2.68e-12 (3 of 3) |
| catalog-sony-fe-24-70mm-f28-gm-ii-wide | 3 | PASS: mtf.maxAbs 2.49e-12 (3 of 3) | PASS: mtf.maxAbs 6.36e-12 (3 of 3) | PASS: mtf.maxAbs 6.02e-12 (3 of 3) |
| catalog-sony-fe-24-70mm-f28-gm-ii-tele | 3 | PASS: mtf.maxAbs 5.72e-12 (3 of 3) | PASS: mtf.maxAbs 2.26e-11 (3 of 3) | PASS: mtf.maxAbs 1.72e-11 (3 of 3) |
| catalog-sony-fe-24-f28-g | 3 | PASS: mtf.maxAbs 8.04e-13 (3 of 3) | PASS: mtf.maxAbs 8.67e-12 (3 of 3) | PASS: mtf.maxAbs 8.09e-12 (3 of 3) |
| catalog-sony-fe-24mm-f14-gm | 3 | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.27e-12 (3 of 3) | PASS: mtf.maxAbs 5.36e-12 (3 of 3) |
| catalog-sony-fe-28-70-f35-56-oss-wide | 3 | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 3.35e-12 (3 of 3) | PASS: mtf.maxAbs 4.22e-12 (3 of 3) |
| catalog-sony-fe-28-70-f35-56-oss-tele | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.56e-12 (3 of 3) | PASS: mtf.maxAbs 1.88e-12 (3 of 3) |
| catalog-sony-fe-28-70mm-f2-gm-wide | 3 | PASS: mtf.maxAbs 3.70e-12 (3 of 3) | PASS: mtf.maxAbs 8.25e-12 (3 of 3) | PASS: mtf.maxAbs 7.18e-12 (3 of 3) |
| catalog-sony-fe-28-70mm-f2-gm-tele | 3 | PASS: mtf.maxAbs 3.65e-12 (3 of 3) | PASS: mtf.maxAbs 1.63e-11 (3 of 3) | PASS: mtf.maxAbs 1.69e-11 (3 of 3) |
| catalog-sony-fe-28mm-f2 | 3 | PASS: mtf.maxAbs 3.28e-12 (3 of 3) | PASS: mtf.maxAbs 9.74e-12 (3 of 3) | PASS: mtf.maxAbs 9.58e-12 (3 of 3) |
| catalog-sony-fe-400-800-f63-8-g-oss-wide | 3 | PASS: mtf.maxAbs 9.02e-12 (3 of 3) | PASS: mtf.maxAbs 4.58e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-11 (3 of 3) |
| catalog-sony-fe-400-800-f63-8-g-oss-tele | 3 | PASS: mtf.maxAbs 1.38e-11 (3 of 3) | PASS: mtf.maxAbs 5.19e-12 (3 of 3) | PASS: mtf.maxAbs 9.52e-12 (3 of 3) |
| catalog-sony-fe-400mm-f28-gm-oss | 3 | PASS: mtf.maxAbs 7.02e-12 (3 of 3) | PASS: mtf.maxAbs 3.15e-12 (3 of 3) | PASS: mtf.maxAbs 5.60e-12 (3 of 3) |
| catalog-sony-fe-50-150mm-f2-gm-wide | 3 | PASS: mtf.maxAbs 6.30e-12 (3 of 3) | PASS: mtf.maxAbs 4.07e-12 (3 of 3) | PASS: mtf.maxAbs 4.75e-12 (3 of 3) |
| catalog-sony-fe-50-150mm-f2-gm-tele | 3 | PASS: mtf.maxAbs 1.08e-11 (3 of 3) | PASS: mtf.maxAbs 1.65e-11 (3 of 3) | PASS: mtf.maxAbs 5.69e-12 (3 of 3) |
| catalog-sony-fe-50mm-f12-gm | 3 | PASS: mtf.maxAbs 2.54e-12 (3 of 3) | PASS: mtf.maxAbs 4.32e-12 (3 of 3) | PASS: mtf.maxAbs 6.01e-12 (3 of 3) |
| catalog-sony-fe-50mm-f14-gm | 3 | PASS: mtf.maxAbs 4.68e-12 (3 of 3) | PASS: mtf.maxAbs 5.24e-12 (3 of 3) | PASS: mtf.maxAbs 4.29e-12 (3 of 3) |
| catalog-sony-fe-600mm-f4-gm-oss | 3 | PASS: mtf.maxAbs 5.58e-12 (3 of 3) | PASS: mtf.maxAbs 4.65e-12 (3 of 3) | PASS: mtf.maxAbs 1.02e-11 (3 of 3) |
| catalog-sony-fe-70-200-f28-gm-oss-wide | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.43e-12 (3 of 3) |
| catalog-sony-fe-70-200-f28-gm-oss-tele | 3 | PASS: mtf.maxAbs 4.11e-12 (3 of 3) | PASS: mtf.maxAbs 3.39e-12 (3 of 3) | PASS: mtf.maxAbs 2.62e-12 (3 of 3) |
| catalog-sony-fe-70-200mm-f28-gm-ii-wide | 3 | PASS: mtf.maxAbs 1.81e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 2.70e-12 (3 of 3) |
| catalog-sony-fe-70-200mm-f28-gm-ii-tele | 3 | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 4.85e-12 (3 of 3) | PASS: mtf.maxAbs 6.25e-12 (3 of 3) |
| catalog-sony-fe-70-200mm-f4-g-oss-wide | 3 | PASS: mtf.maxAbs 2.13e-12 (3 of 3) | PASS: mtf.maxAbs 3.27e-12 (3 of 3) | PASS: mtf.maxAbs 4.28e-12 (3 of 3) |
| catalog-sony-fe-70-200mm-f4-g-oss-tele | 3 | PASS: mtf.maxAbs 2.79e-12 (3 of 3) | PASS: mtf.maxAbs 2.82e-12 (3 of 3) | PASS: mtf.maxAbs 2.97e-12 (3 of 3) |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-wide | 3 | PASS: mtf.maxAbs 8.97e-12 (3 of 3) | PASS: mtf.maxAbs 7.80e-12 (3 of 3) | PASS: mtf.maxAbs 1.65e-12 (3 of 3) |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | 3 | PASS: mtf.maxAbs 1.02e-11 (3 of 3) | PASS: mtf.maxAbs 1.00e-11 (3 of 3) | PASS: mtf.maxAbs 2.44e-12 (3 of 3) |
| catalog-sony-fe-85-f14-gm-ii | 3 | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 1.98e-12 (3 of 3) |
| catalog-sony-fe-85mm-f14-gm | 3 | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 6.15e-13 (3 of 3) | PASS: mtf.maxAbs 9.14e-13 (3 of 3) |
| catalog-sony-fe-90mm-f2p8-macro | 3 | PASS: mtf.maxAbs 4.92e-13 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) |
| catalog-sony-fe-pz-16-35-f4-g-wide | 3 | PASS: mtf.maxAbs 4.44e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) | PASS: mtf.maxAbs 1.49e-11 (3 of 3) |
| catalog-sony-fe-pz-16-35-f4-g-tele | 3 | PASS: mtf.maxAbs 1.32e-12 (3 of 3) | PASS: mtf.maxAbs 3.50e-12 (3 of 3) | PASS: mtf.maxAbs 3.54e-12 (3 of 3) |
| catalog-sony-planar-fe-50f14-za | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 3.61e-12 (3 of 3) | PASS: mtf.maxAbs 3.44e-12 (3 of 3) |
| catalog-sony-planar-t-50f14-za | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 5.17e-12 (3 of 3) | PASS: mtf.maxAbs 4.44e-12 (3 of 3) |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-wide | 3 | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 1.65e-12 (3 of 3) |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-tele | 3 | PASS: mtf.maxAbs 4.65e-12 (3 of 3) | PASS: mtf.maxAbs 2.60e-12 (3 of 3) | PASS: mtf.maxAbs 4.19e-12 (3 of 3) |
| catalog-sony-sal-70-400mm-f4-56-g-wide | 3 | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-12 (3 of 3) | PASS: mtf.maxAbs 2.50e-12 (3 of 3) |
| catalog-sony-sal-70-400mm-f4-56-g-tele | 3 | PASS: mtf.maxAbs 4.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.02e-12 (3 of 3) | PASS: mtf.maxAbs 2.82e-12 (3 of 3) |
| catalog-sony-sel30mmf35 | 3 | PASS: mtf.maxAbs 8.35e-13 (3 of 3) | PASS: mtf.maxAbs 1.51e-11 (3 of 3) | PASS: mtf.maxAbs 1.43e-11 (3 of 3) |
| catalog-sony-sonnar-fe-35-f28-za | 3 | PASS: mtf.maxAbs 5.18e-12 (3 of 3) | PASS: mtf.maxAbs 7.22e-12 (3 of 3) | PASS: mtf.maxAbs 9.58e-12 (3 of 3) |
| catalog-sony-sonnar-fe-55f18-za | 3 | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 6.47e-12 (3 of 3) | PASS: mtf.maxAbs 6.06e-12 (3 of 3) |
| catalog-sony-vario-sonnar-88-733f28-rx10-wide | 3 | PASS: mtf.maxAbs 4.93e-12 (3 of 3) | PASS: mtf.maxAbs 5.96e-12 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) |
| catalog-sony-vario-sonnar-88-733f28-rx10-tele | 3 | PASS: mtf.maxAbs 7.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.81e-11 (3 of 3) | PASS: mtf.maxAbs 2.48e-11 (3 of 3) |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-wide | 3 | PASS: mtf.maxAbs 1.82e-11 (3 of 3) | PASS: mtf.maxAbs 7.79e-12 (3 of 3) | PASS: mtf.maxAbs 1.08e-11 (3 of 3) |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-tele | 3 | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.19e-12 (3 of 3) |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-wide | 3 | PASS: mtf.maxAbs 1.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-11 (3 of 3) | PASS: mtf.maxAbs 1.36e-11 (3 of 3) |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-tele | 3 | PASS: mtf.maxAbs 3.38e-12 (3 of 3) | PASS: mtf.maxAbs 8.71e-12 (3 of 3) | PASS: mtf.maxAbs 1.10e-11 (3 of 3) |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-wide | 3 | PASS: mtf.maxAbs 2.06e-11 (3 of 3) | PASS: mtf.maxAbs 7.59e-12 (3 of 3) | PASS: mtf.maxAbs 1.93e-11 (3 of 3) |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-tele | 3 | PASS: mtf.maxAbs 1.93e-12 (3 of 3) | PASS: mtf.maxAbs 5.89e-12 (3 of 3) | PASS: mtf.maxAbs 5.31e-12 (3 of 3) |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-wide | 3 | PASS: mtf.maxAbs 2.87e-12 (3 of 3) | PASS: mtf.maxAbs 9.31e-12 (3 of 3) | PASS: mtf.maxAbs 8.77e-12 (3 of 3) |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-tele | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 9.24e-12 (3 of 3) | PASS: mtf.maxAbs 8.96e-12 (3 of 3) |
| catalog-sony-vario-tessar-te-1670f4-za-oss-wide | 3 | PASS: mtf.maxAbs 2.03e-11 (3 of 3) | PASS: mtf.maxAbs 7.41e-12 (3 of 3) | PASS: mtf.maxAbs 2.24e-11 (3 of 3) |
| catalog-sony-vario-tessar-te-1670f4-za-oss-tele | 3 | PASS: mtf.maxAbs 1.84e-12 (3 of 3) | PASS: mtf.maxAbs 4.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.11e-12 (3 of 3) |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-wide | 3 | PASS: mtf.maxAbs 4.95e-12 (3 of 3) | PASS: mtf.maxAbs 6.36e-12 (3 of 3) | PASS: mtf.maxAbs 4.59e-12 (3 of 3) |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-tele | 3 | PASS: mtf.maxAbs 1.21e-11 (3 of 3) | PASS: mtf.maxAbs 1.37e-11 (3 of 3) | PASS: mtf.maxAbs 8.98e-12 (3 of 3) |
| catalog-tamron-a001-70-200mm-f28-wide | 3 | PASS: mtf.maxAbs 2.41e-12 (3 of 3) | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 2.55e-12 (3 of 3) |
| catalog-tamron-a001-70-200mm-f28-tele | 3 | PASS: mtf.maxAbs 4.08e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) | PASS: mtf.maxAbs 4.22e-12 (3 of 3) |
| catalog-tamron-a005-70-300-f4-5-6-vc-wide | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 2.54e-12 (3 of 3) |
| catalog-tamron-a005-70-300-f4-5-6-vc-tele | 3 | PASS: mtf.maxAbs 2.25e-12 (3 of 3) | PASS: mtf.maxAbs 1.83e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) |
| catalog-tamron-a010-28-300-f35-63-wide | 3 | PASS: mtf.maxAbs 5.03e-12 (3 of 3) | PASS: mtf.maxAbs 3.63e-12 (3 of 3) | PASS: mtf.maxAbs 4.75e-12 (3 of 3) |
| catalog-tamron-a010-28-300-f35-63-tele | 3 | PASS: mtf.maxAbs 4.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.17e-11 (3 of 3) | PASS: mtf.maxAbs 9.27e-12 (3 of 3) |
| catalog-tamron-a03-28-200mm-f3p8-5p6-wide | 3 | PASS: mtf.maxAbs 2.10e-12 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) | PASS: mtf.maxAbs 3.13e-12 (3 of 3) |
| catalog-tamron-a03-28-200mm-f3p8-5p6-tele | 3 | PASS: mtf.maxAbs 2.53e-12 (3 of 3) | PASS: mtf.maxAbs 3.57e-12 (3 of 3) | PASS: mtf.maxAbs 1.89e-12 (3 of 3) |
| catalog-tamron-a056-70-180-f28-wide | 3 | PASS: mtf.maxAbs 4.47e-12 (3 of 3) | PASS: mtf.maxAbs 2.23e-12 (3 of 3) | PASS: mtf.maxAbs 5.25e-12 (3 of 3) |
| catalog-tamron-a056-70-180-f28-tele | 3 | PASS: mtf.maxAbs 4.89e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) | PASS: mtf.maxAbs 4.76e-12 (3 of 3) |
| catalog-tamron-a061-28-300-f35-63-wide | 3 | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) | PASS: mtf.maxAbs 4.01e-12 (3 of 3) |
| catalog-tamron-a061-28-300-f35-63-tele | 3 | PASS: mtf.maxAbs 2.99e-12 (3 of 3) | PASS: mtf.maxAbs 8.94e-12 (3 of 3) | PASS: mtf.maxAbs 6.62e-12 (3 of 3) |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-wide | 3 | PASS: mtf.maxAbs 2.61e-12 (3 of 3) | PASS: mtf.maxAbs 4.95e-12 (3 of 3) | PASS: mtf.maxAbs 3.68e-12 (3 of 3) |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-tele | 3 | PASS: mtf.maxAbs 1.22e-12 (3 of 3) | PASS: mtf.maxAbs 6.70e-12 (3 of 3) | PASS: mtf.maxAbs 6.46e-12 (3 of 3) |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-wide | 3 | PASS: mtf.maxAbs 6.60e-12 (3 of 3) | PASS: mtf.maxAbs 8.30e-12 (3 of 3) | PASS: mtf.maxAbs 7.53e-12 (3 of 3) |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-tele | 3 | PASS: mtf.maxAbs 1.08e-11 (3 of 3) | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 9.86e-12 (3 of 3) |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-wide | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 8.34e-13 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-tele | 3 | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) |
| catalog-tamron-a08-200500mm-f563-wide | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 8.51e-13 (3 of 3) | PASS: mtf.maxAbs 2.14e-12 (3 of 3) |
| catalog-tamron-a08-200500mm-f563-tele | 3 | PASS: mtf.maxAbs 1.60e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 2.08e-12 (3 of 3) |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-wide | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.38e-12 (3 of 3) | PASS: mtf.maxAbs 1.77e-12 (3 of 3) |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-tele | 3 | PASS: mtf.maxAbs 2.98e-12 (3 of 3) | PASS: mtf.maxAbs 3.63e-12 (3 of 3) | PASS: mtf.maxAbs 6.61e-12 (3 of 3) |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-wide | 3 | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 2.58e-12 (3 of 3) | PASS: mtf.maxAbs 2.11e-12 (3 of 3) |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-tele | 3 | PASS: mtf.maxAbs 1.88e-12 (3 of 3) | PASS: mtf.maxAbs 2.30e-12 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) |
| catalog-tamron-b028-18-400-f35-63-wide | 3 | PASS: mtf.maxAbs 1.44e-12 (3 of 3) | PASS: mtf.maxAbs 1.82e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) |
| catalog-tamron-b028-18-400-f35-63-tele | 3 | PASS: mtf.maxAbs 9.50e-12 (3 of 3) | PASS: mtf.maxAbs 1.28e-11 (3 of 3) | PASS: mtf.maxAbs 5.03e-12 (3 of 3) |
| catalog-tamron-c001-14-150mm-f3p5-5p8-wide | 3 | PASS: mtf.maxAbs 3.83e-13 (3 of 3) | PASS: mtf.maxAbs 2.07e-12 (3 of 3) | PASS: mtf.maxAbs 2.18e-12 (3 of 3) |
| catalog-tamron-c001-14-150mm-f3p5-5p8-tele | 3 | PASS: mtf.maxAbs 2.11e-12 (3 of 3) | PASS: mtf.maxAbs 6.52e-12 (3 of 3) | PASS: mtf.maxAbs 5.26e-12 (3 of 3) |
| catalog-tamron-f072-90mm-f28-di-iii-macro-vxd | 3 | PASS: mtf.maxAbs 1.24e-12 (3 of 3) | PASS: mtf.maxAbs 1.13e-12 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) |
| catalog-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004 | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 7.30e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| catalog-tamron-sp-a007-24-70mm-f28-vc-wide | 3 | PASS: mtf.maxAbs 1.13e-11 (3 of 3) | PASS: mtf.maxAbs 8.84e-12 (3 of 3) | PASS: mtf.maxAbs 1.10e-11 (3 of 3) |
| catalog-tamron-sp-a007-24-70mm-f28-vc-tele | 3 | PASS: mtf.maxAbs 3.32e-12 (3 of 3) | PASS: mtf.maxAbs 6.52e-12 (3 of 3) | PASS: mtf.maxAbs 8.06e-12 (3 of 3) |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-wide | 3 | PASS: mtf.maxAbs 4.17e-12 (3 of 3) | PASS: mtf.maxAbs 9.09e-13 (3 of 3) | PASS: mtf.maxAbs 3.69e-12 (3 of 3) |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-tele | 3 | PASS: mtf.maxAbs 4.69e-12 (3 of 3) | PASS: mtf.maxAbs 2.53e-12 (3 of 3) | PASS: mtf.maxAbs 4.55e-12 (3 of 3) |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-wide | 3 | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 1.55e-12 (3 of 3) |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-tele | 3 | PASS: mtf.maxAbs 4.17e-12 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) | PASS: mtf.maxAbs 5.02e-12 (3 of 3) |
| catalog-tamron-sp-af-17-50mm-f28-a16-wide | 3 | PASS: mtf.maxAbs 8.76e-13 (3 of 3) | PASS: mtf.maxAbs 5.31e-12 (3 of 3) | PASS: mtf.maxAbs 5.00e-12 (3 of 3) |
| catalog-tamron-sp-af-17-50mm-f28-a16-tele | 3 | PASS: mtf.maxAbs 2.68e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.76e-12 (3 of 3) |
| catalog-tamron-sp-af-180mm-f35-di | 3 | PASS: mtf.maxAbs 1.72e-12 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) | PASS: mtf.maxAbs 2.20e-12 (3 of 3) |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-wide | 3 | PASS: mtf.maxAbs 1.48e-11 (3 of 3) | PASS: mtf.maxAbs 8.71e-12 (3 of 3) | PASS: mtf.maxAbs 8.91e-12 (3 of 3) |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-tele | 3 | PASS: mtf.maxAbs 2.63e-12 (3 of 3) | PASS: mtf.maxAbs 6.04e-12 (3 of 3) | PASS: mtf.maxAbs 3.84e-12 (3 of 3) |
| catalog-tamron-sp-af-60mm-f2-di-ii-macro | 3 | PASS: mtf.maxAbs 9.72e-13 (3 of 3) | PASS: mtf.maxAbs 1.67e-12 (3 of 3) | PASS: mtf.maxAbs 2.51e-12 (3 of 3) |
| catalog-thypoch-ksana-21mm-f35 | 3 | PASS: mtf.maxAbs 2.80e-12 (3 of 3) | PASS: mtf.maxAbs 8.99e-12 (3 of 3) | PASS: mtf.maxAbs 9.63e-12 (3 of 3) |
| catalog-thypoch-simera-50mm-f14 | 3 | PASS: mtf.maxAbs 1.69e-12 (3 of 3) | PASS: mtf.maxAbs 8.12e-12 (3 of 3) | PASS: mtf.maxAbs 8.39e-12 (3 of 3) |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-wide | 3 | PASS: mtf.maxAbs 2.30e-12 (3 of 3) | PASS: mtf.maxAbs 3.11e-12 (3 of 3) | PASS: mtf.maxAbs 2.05e-12 (3 of 3) |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-tele | 3 | PASS: mtf.maxAbs 2.20e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) | PASS: mtf.maxAbs 1.67e-12 (3 of 3) |
| catalog-ultron-28f2-asph | 3 | PASS: mtf.maxAbs 8.30e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-11 (3 of 3) | PASS: mtf.maxAbs 1.21e-11 (3 of 3) |
| catalog-ultron-50f2 | 3 | PASS: mtf.maxAbs 8.84e-13 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 9.46e-13 (3 of 3) |
| catalog-vario-prakticar-35-70mm-f27-35-wide | 3 | PASS: mtf.maxAbs 1.85e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) |
| catalog-vario-prakticar-35-70mm-f27-35-tele | 3 | PASS: mtf.maxAbs 1.17e-12 (3 of 3) | PASS: mtf.maxAbs 8.28e-13 (3 of 3) | PASS: mtf.maxAbs 1.25e-12 (3 of 3) |
| catalog-varisoft-rokkor-85f28 | 3 | PASS: mtf.maxAbs 7.10e-13 (3 of 3) | PASS: mtf.maxAbs 6.80e-13 (3 of 3) | PASS: mtf.maxAbs 7.14e-13 (3 of 3) |
| catalog-viltrox-af-14mm-f4-air | 2 | PASS: mtf.maxAbs 8.44e-13 (2 of 2) | PASS: mtf.maxAbs 1.20e-12 (2 of 2) | PASS: mtf.maxAbs 1.02e-12 (2 of 2) |
| catalog-viltrox-af-23mm-f14 | 3 | PASS: mtf.maxAbs 6.82e-13 (3 of 3) | PASS: mtf.maxAbs 7.37e-13 (3 of 3) | PASS: mtf.maxAbs 8.77e-13 (3 of 3) |
| catalog-viltrox-af-27mm-f12-pro-xf | 3 | PASS: mtf.maxAbs 3.41e-12 (3 of 3) | PASS: mtf.maxAbs 5.65e-12 (3 of 3) | PASS: mtf.maxAbs 3.20e-12 (3 of 3) |
| catalog-viltrox-af-33mm-f14-e | 3 | PASS: mtf.maxAbs 9.41e-13 (3 of 3) | PASS: mtf.maxAbs 6.39e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) |
| catalog-viltrox-af-35f18-fe | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.62e-11 (3 of 3) | PASS: mtf.maxAbs 1.62e-11 (3 of 3) |
| catalog-viltrox-af-50mm-f14-pro | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 7.73e-13 (3 of 3) | PASS: mtf.maxAbs 1.76e-12 (3 of 3) |
| catalog-viltrox-af-50mm-f18-fe | 3 | PASS: mtf.maxAbs 1.92e-12 (3 of 3) | PASS: mtf.maxAbs 3.58e-12 (3 of 3) | PASS: mtf.maxAbs 5.50e-12 (3 of 3) |
| catalog-viltrox-af-56mm-f14-e | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 6.09e-13 (3 of 3) | PASS: mtf.maxAbs 1.49e-12 (3 of 3) |
| catalog-viltrox-af-75mm-f12-pro | 2 | PASS: mtf.maxAbs 1.17e-12 (2 of 2) | PASS: mtf.maxAbs 5.62e-13 (2 of 2) | PASS: mtf.maxAbs 9.42e-13 (2 of 2) |
| catalog-viltrox-af-85mm-f14-pro | 3 | PASS: mtf.maxAbs 2.12e-12 (3 of 3) | PASS: mtf.maxAbs 1.68e-12 (3 of 3) | PASS: mtf.maxAbs 1.69e-12 (3 of 3) |
| catalog-viltrox-mf-20mm-f18-fe | 3 | PASS: mtf.maxAbs 1.41e-12 (3 of 3) | PASS: mtf.maxAbs 1.31e-12 (3 of 3) | PASS: mtf.maxAbs 1.53e-12 (3 of 3) |
| catalog-vivitar-s1-35-85-f28-wide | 2 | PASS: mtf.maxAbs 1.47e-12 (2 of 2) | PASS: mtf.maxAbs 7.70e-13 (2 of 2) | PASS: mtf.maxAbs 1.46e-12 (2 of 2) |
| catalog-vivitar-s1-35-85-f28-tele | 3 | PASS: mtf.maxAbs 2.00e-12 (3 of 3) | PASS: mtf.maxAbs 1.57e-12 (3 of 3) | PASS: mtf.maxAbs 3.53e-12 (3 of 3) |
| catalog-vivitar-s1-70-210-f28-4-wide | 3 | PASS: mtf.maxAbs 1.80e-12 (3 of 3) | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.75e-12 (3 of 3) |
| catalog-vivitar-s1-70-210-f28-4-tele | 3 | PASS: mtf.maxAbs 2.49e-12 (3 of 3) | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 2.58e-12 (3 of 3) |
| catalog-vivitar-series-1-135mm-f2-3 | 3 | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 9.22e-13 (3 of 3) | PASS: mtf.maxAbs 1.31e-12 (3 of 3) |
| catalog-vivitar-series-1-70-210-f35-wide | 3 | PASS: mtf.maxAbs 2.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.87e-12 (3 of 3) | PASS: mtf.maxAbs 2.01e-12 (3 of 3) |
| catalog-vivitar-series-1-70-210-f35-tele | 3 | PASS: mtf.maxAbs 1.95e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) |
| catalog-vivitar-series1-200f3 | 3 | PASS: mtf.maxAbs 1.55e-12 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) | PASS: mtf.maxAbs 1.37e-12 (3 of 3) |
| catalog-voigtlander-apo-lanthar-180-f4 | 3 | PASS: mtf.maxAbs 2.50e-12 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) | PASS: mtf.maxAbs 3.46e-12 (3 of 3) |
| catalog-voigtlander-apo-lanthar-210mm-f45 | 3 | PASS: mtf.maxAbs 3.45e-12 (3 of 3) | PASS: mtf.maxAbs 2.03e-12 (3 of 3) | PASS: mtf.maxAbs 2.21e-12 (3 of 3) |
| catalog-voigtlander-apo-lanthar-28mm-f2-aspherical-vm | 3 | PASS: mtf.maxAbs 2.24e-12 (3 of 3) | PASS: mtf.maxAbs 6.08e-12 (3 of 3) | PASS: mtf.maxAbs 5.52e-12 (3 of 3) |
| catalog-voigtlander-apo-lanthar-50mm-f35-vm | 3 | PASS: mtf.maxAbs 7.38e-13 (3 of 3) | PASS: mtf.maxAbs 6.07e-13 (3 of 3) | PASS: mtf.maxAbs 5.46e-13 (3 of 3) |
| catalog-voigtlander-apo-skopar-90f28 | 3 | PASS: mtf.maxAbs 6.32e-13 (3 of 3) | PASS: mtf.maxAbs 4.53e-13 (3 of 3) | PASS: mtf.maxAbs 7.43e-13 (3 of 3) |
| catalog-voigtlander-apo-ultron-vm-90mm-f2 | 3 | PASS: mtf.maxAbs 1.10e-12 (3 of 3) | PASS: mtf.maxAbs 9.32e-13 (3 of 3) | PASS: mtf.maxAbs 1.84e-12 (3 of 3) |
| catalog-voigtlander-cine-tele-anastigmat-100mm-f45 | 3 | PASS: mtf.maxAbs 8.70e-12 (3 of 3) | PASS: mtf.maxAbs 9.59e-12 (3 of 3) | PASS: mtf.maxAbs 1.01e-11 (3 of 3) |
| catalog-voigtlander-color-heliar-105mm-f35 | 3 | PASS: mtf.maxAbs 1.34e-12 (3 of 3) | PASS: mtf.maxAbs 1.23e-12 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) |
| catalog-voigtlander-color-skopar-105mm-f35 | 3 | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.83e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) |
| catalog-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis | 3 | PASS: mtf.maxAbs 4.78e-13 (3 of 3) | PASS: mtf.maxAbs 3.29e-12 (3 of 3) | PASS: mtf.maxAbs 3.49e-12 (3 of 3) |
| catalog-voigtlander-color-skopar-vm-35mm-f35-aspherical | 3 | PASS: mtf.maxAbs 6.11e-12 (3 of 3) | PASS: mtf.maxAbs 4.44e-12 (3 of 3) | PASS: mtf.maxAbs 5.71e-12 (3 of 3) |
| catalog-voigtlander-dynar-f6-normalized-fd100 | 3 | PASS: mtf.maxAbs 3.88e-12 (3 of 3) | PASS: mtf.maxAbs 4.72e-12 (3 of 3) | PASS: mtf.maxAbs 4.04e-12 (3 of 3) |
| catalog-voigtlander-heliar-100mm-f4-5-second-asymmetric | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 1.73e-12 (3 of 3) | PASS: mtf.maxAbs 1.64e-12 (3 of 3) |
| catalog-voigtlander-macro-apo-lanthar-125-f25 | 3 | PASS: mtf.maxAbs 1.43e-12 (3 of 3) | PASS: mtf.maxAbs 7.45e-13 (3 of 3) | PASS: mtf.maxAbs 2.13e-12 (3 of 3) |
| catalog-voigtlander-nokton-35-f12 | 3 | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.04e-11 (3 of 3) | PASS: mtf.maxAbs 1.05e-11 (3 of 3) |
| catalog-voigtlander-nokton-50f15 | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 8.95e-13 (3 of 3) | PASS: mtf.maxAbs 8.06e-13 (3 of 3) |
| catalog-voigtlander-nokton-50f15-aspherical-ii-vm | 3 | PASS: mtf.maxAbs 6.15e-13 (3 of 3) | PASS: mtf.maxAbs 4.50e-12 (3 of 3) | PASS: mtf.maxAbs 3.95e-12 (3 of 3) |
| catalog-voigtlander-nokton-50mm-f15-aspherical-l39 | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 9.08e-12 (3 of 3) | PASS: mtf.maxAbs 8.31e-12 (3 of 3) |
| catalog-voigtlander-nokton-60mm-f095-mft | 3 | PASS: mtf.maxAbs 8.25e-13 (3 of 3) | PASS: mtf.maxAbs 5.22e-13 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) |
| catalog-voigtlander-nokton-vintage-line-vm-75mm-f1-5-aspherical | 3 | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 1.12e-12 (3 of 3) | PASS: mtf.maxAbs 8.73e-13 (3 of 3) |
| catalog-voigtlander-nokton-x-50f12 | 3 | PASS: mtf.maxAbs 6.10e-13 (3 of 3) | PASS: mtf.maxAbs 6.01e-13 (3 of 3) | PASS: mtf.maxAbs 6.51e-13 (3 of 3) |
| catalog-voigtlander-portrait-heliar-75f18 | 3 | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.14e-12 (3 of 3) | PASS: mtf.maxAbs 9.36e-13 (3 of 3) |
| catalog-voigtlander-skoparex-35f34-bessamatic | 3 | PASS: mtf.maxAbs 1.11e-12 (3 of 3) | PASS: mtf.maxAbs 7.95e-13 (3 of 3) | PASS: mtf.maxAbs 9.38e-13 (3 of 3) |
| catalog-voigtlander-super-dynarex-200mm-f4 | 3 | PASS: mtf.maxAbs 2.46e-12 (3 of 3) | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 1.99e-12 (3 of 3) |
| catalog-voigtlander-super-wide-heliar-15mm-f45-aspherical-sl | 3 | PASS: mtf.maxAbs 2.70e-12 (3 of 3) | PASS: mtf.maxAbs 8.36e-12 (3 of 3) | PASS: mtf.maxAbs 8.36e-12 (3 of 3) |
| catalog-voigtlander-tele-dynar-100mm-f63 | 3 | PASS: mtf.maxAbs 7.74e-12 (3 of 3) | PASS: mtf.maxAbs 3.79e-12 (3 of 3) | PASS: mtf.maxAbs 6.97e-12 (3 of 3) |
| catalog-voigtlander-telomar-100mm-f55 | 3 | PASS: mtf.maxAbs 1.51e-12 (3 of 3) | PASS: mtf.maxAbs 7.88e-13 (3 of 3) | PASS: mtf.maxAbs 9.36e-13 (3 of 3) |
| catalog-voigtlander-telomar-180mm-f55 | 3 | PASS: mtf.maxAbs 4.05e-12 (3 of 3) | PASS: mtf.maxAbs 3.09e-12 (3 of 3) | PASS: mtf.maxAbs 3.03e-12 (3 of 3) |
| catalog-voigtlander-ultra-wide-heliar-12mm-f56-aspherical-l39 | 3 | PASS: mtf.maxAbs 2.75e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 3.19e-12 (3 of 3) |
| catalog-voigtlander-ultron-27mm-f2 | 3 | PASS: mtf.maxAbs 1.00e-12 (3 of 3) | PASS: mtf.maxAbs 3.55e-13 (3 of 3) | PASS: mtf.maxAbs 7.54e-13 (3 of 3) |
| catalog-voigtlander-ultron-35mm-f17-aspherical-l39 | 3 | PASS: mtf.maxAbs 1.07e-12 (3 of 3) | PASS: mtf.maxAbs 3.06e-12 (3 of 3) | PASS: mtf.maxAbs 2.93e-12 (3 of 3) |
| catalog-yashica-auto-yashinon-ds-20mm-f33 | 3 | PASS: mtf.maxAbs 8.96e-13 (3 of 3) | PASS: mtf.maxAbs 8.78e-13 (3 of 3) | PASS: mtf.maxAbs 1.19e-12 (3 of 3) |
| catalog-yashica-ml-24mm-f2-8 | 3 | PASS: mtf.maxAbs 1.97e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| catalog-yashica-ml-300mm-f56 | 3 | PASS: mtf.maxAbs 1.48e-12 (3 of 3) | PASS: mtf.maxAbs 1.03e-12 (3 of 3) | PASS: mtf.maxAbs 1.60e-12 (3 of 3) |
| catalog-yashica-yashinon-dx-21mm-f3-3 | 3 | PASS: mtf.maxAbs 2.19e-12 (3 of 3) | PASS: mtf.maxAbs 1.90e-12 (3 of 3) | PASS: mtf.maxAbs 1.58e-12 (3 of 3) |
| catalog-zeiss-batis-18f28 | 3 | PASS: mtf.maxAbs 7.10e-13 (3 of 3) | PASS: mtf.maxAbs 1.57e-11 (3 of 3) | PASS: mtf.maxAbs 1.54e-11 (3 of 3) |
| catalog-zeiss-batis-40mm-f2-cf | 3 | PASS: mtf.maxAbs 2.04e-12 (3 of 3) | PASS: mtf.maxAbs 6.98e-12 (3 of 3) | PASS: mtf.maxAbs 5.22e-12 (3 of 3) |
| catalog-zeiss-batis-85f18 | 3 | PASS: mtf.maxAbs 1.02e-12 (3 of 3) | PASS: mtf.maxAbs 8.50e-13 (3 of 3) | PASS: mtf.maxAbs 4.92e-13 (3 of 3) |
| catalog-zeiss-biogon-21-f45 | 3 | PASS: mtf.maxAbs 1.06e-12 (3 of 3) | PASS: mtf.maxAbs 5.04e-13 (3 of 3) | PASS: mtf.maxAbs 8.95e-13 (3 of 3) |
| catalog-zeiss-biogon-35mm-f28-prewar | 3 | PASS: mtf.maxAbs 1.37e-12 (3 of 3) | PASS: mtf.maxAbs 3.52e-13 (3 of 3) | PASS: mtf.maxAbs 1.51e-12 (3 of 3) |
| catalog-zeiss-biotar-50f14 | 3 | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 7.59e-13 (3 of 3) | PASS: mtf.maxAbs 8.54e-13 (3 of 3) |
| catalog-zeiss-distagon-28mm-f2 | 3 | PASS: mtf.maxAbs 1.75e-12 (3 of 3) | PASS: mtf.maxAbs 1.45e-12 (3 of 3) | PASS: mtf.maxAbs 1.71e-12 (3 of 3) |
| catalog-zeiss-distagon-35f14 | 3 | PASS: mtf.maxAbs 2.01e-12 (3 of 3) | PASS: mtf.maxAbs 1.70e-12 (3 of 3) | PASS: mtf.maxAbs 3.70e-12 (3 of 3) |
| catalog-zeiss-distagon-35mm-f4-contarex | 3 | PASS: mtf.maxAbs 4.84e-13 (3 of 3) | PASS: mtf.maxAbs 5.43e-13 (3 of 3) | PASS: mtf.maxAbs 5.71e-13 (3 of 3) |
| catalog-zeiss-flektogon-50mm-f4 | 3 | PASS: mtf.maxAbs 2.28e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) |
| catalog-zeiss-hologon-15f8 | 3 | PASS: mtf.maxAbs 2.93e-12 (3 of 3) | PASS: mtf.maxAbs 5.83e-13 (3 of 3) | PASS: mtf.maxAbs 2.99e-12 (3 of 3) |
| catalog-zeiss-jena-sonnar-50f15-us2186621 | 3 | PASS: mtf.maxAbs 8.21e-13 (3 of 3) | PASS: mtf.maxAbs 1.35e-12 (3 of 3) | PASS: mtf.maxAbs 1.32e-12 (3 of 3) |
| catalog-zeiss-olympia-sonnar-180f28-contarex | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 7.55e-13 (3 of 3) | PASS: mtf.maxAbs 1.11e-12 (3 of 3) |
| catalog-zeiss-planar-50f14-praktica | 3 | PASS: mtf.maxAbs 1.09e-12 (3 of 3) | PASS: mtf.maxAbs 7.28e-13 (3 of 3) | PASS: mtf.maxAbs 1.27e-12 (3 of 3) |
| catalog-zeiss-planar-80f28 | 3 | PASS: mtf.maxAbs 1.76e-12 (3 of 3) | PASS: mtf.maxAbs 1.50e-12 (3 of 3) | PASS: mtf.maxAbs 1.16e-12 (3 of 3) |
| catalog-zeiss-planar-t-50f14 | 3 | PASS: mtf.maxAbs 7.90e-13 (3 of 3) | PASS: mtf.maxAbs 7.15e-13 (3 of 3) | PASS: mtf.maxAbs 8.66e-13 (3 of 3) |
| catalog-zeiss-pro-tessar-35f32 | 3 | PASS: mtf.maxAbs 8.79e-13 (3 of 3) | PASS: mtf.maxAbs 9.87e-13 (3 of 3) | PASS: mtf.maxAbs 1.33e-12 (3 of 3) |
| catalog-zeiss-s-biogon-40f56 | 3 | PASS: mtf.maxAbs 3.36e-12 (3 of 3) | PASS: mtf.maxAbs 1.21e-12 (3 of 3) | PASS: mtf.maxAbs 2.53e-12 (3 of 3) |
| catalog-zeiss-sonnar-35f2-sony-rx1 | 3 | PASS: mtf.maxAbs 4.27e-12 (3 of 3) | PASS: mtf.maxAbs 6.91e-12 (3 of 3) | PASS: mtf.maxAbs 4.09e-12 (3 of 3) |
| catalog-zeiss-sonnar-40f28-rollei | 3 | PASS: mtf.maxAbs 6.73e-13 (3 of 3) | PASS: mtf.maxAbs 7.01e-13 (3 of 3) | PASS: mtf.maxAbs 4.28e-13 (3 of 3) |
| catalog-zeiss-sonnar-superachromat-250f56 | 3 | PASS: mtf.maxAbs 4.50e-12 (3 of 3) | PASS: mtf.maxAbs 1.61e-12 (3 of 3) | PASS: mtf.maxAbs 5.01e-12 (3 of 3) |
| catalog-zeiss-tessar-144f55 | 3 | PASS: mtf.maxAbs 2.14e-12 (3 of 3) | PASS: mtf.maxAbs 2.26e-12 (3 of 3) | PASS: mtf.maxAbs 2.09e-12 (3 of 3) |
| catalog-zeiss-touit-50mm-f28-macro | 3 | PASS: mtf.maxAbs 9.94e-13 (3 of 3) | PASS: mtf.maxAbs 1.18e-12 (3 of 3) | PASS: mtf.maxAbs 1.39e-12 (3 of 3) |
| catalog-zeiss-ultra-prime-135-t19 | 3 | PASS: mtf.maxAbs 1.54e-12 (3 of 3) | PASS: mtf.maxAbs 6.78e-13 (3 of 3) | PASS: mtf.maxAbs 1.08e-12 (3 of 3) |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-wide | 3 | PASS: mtf.maxAbs 9.00e-13 (3 of 3) | PASS: mtf.maxAbs 3.01e-12 (3 of 3) | PASS: mtf.maxAbs 2.85e-12 (3 of 3) |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-tele | 3 | PASS: mtf.maxAbs 3.62e-13 (3 of 3) | PASS: mtf.maxAbs 3.66e-12 (3 of 3) | PASS: mtf.maxAbs 3.64e-12 (3 of 3) |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-wide | 2 | PASS: mtf.maxAbs 6.64e-13 (2 of 2) | PASS: mtf.maxAbs 1.30e-11 (2 of 2) | PASS: mtf.maxAbs 1.26e-11 (2 of 2) |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-tele | 3 | PASS: mtf.maxAbs 2.69e-12 (3 of 3) | PASS: mtf.maxAbs 4.75e-12 (3 of 3) | PASS: mtf.maxAbs 5.19e-12 (3 of 3) |
| catalog-zeiss-zx1-distagon-35mm-f2 | 3 | PASS: mtf.maxAbs 2.58e-12 (3 of 3) | PASS: mtf.maxAbs 6.65e-12 (3 of 3) | PASS: mtf.maxAbs 6.17e-12 (3 of 3) |

## r4f

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – replay | mtf.maxAbs (≤ 1.00e-9) | 1.80e-14 | 1297 of 1297 | catalog-laowa-105mm-f2-stf | cut tangential, field 0, frequencyPerMm 4 |
| lv – replay | sampling.mismatches (≤ 0 elements) | 0 | 1297 of 1297 | — | — |
| lv – replay | fields.mismatches (≤ 0 elements) | 0 | 1297 of 1297 | — | — |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-agfa-color-telinear-90mm-f4 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-agfa-solagon-50mm-f2 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-angenieux-dem-180mm-f23-apo | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-angenieux-retrofocus-r1-35mm-f25 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-angenieux-retrofocus-r11-28mm-f35 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-apo-lanthar-50f2 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-apple-iphone-12-main-wide | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-apple-iphone-7-wide-camera-lens | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| catalog-bertele-sonnar-50f2-scaled | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-canon-50f12-1956 | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-canon-50mm-f095 | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-canon-cine-servo-17-120-t295-39-ef-wide | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-canon-cine-servo-17-120-t295-39-ef-tele | 1 | PASS: mtf.maxAbs 1.36e-15 (1 of 1) |
| catalog-canon-ef-100-300mm-f5-6-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-canon-ef-100-300mm-f5-6-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-tele | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-canon-ef-100300mm-f4556-usm-wide | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| catalog-canon-ef-100300mm-f4556-usm-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-canon-ef-100400-f45-56l-is-usm-wide | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-canon-ef-100400-f45-56l-is-usm-tele | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-canon-ef-100mm-f28-macro | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-canon-ef-100mm-f28l-is-macro | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| catalog-canon-ef-11-24-f4l-usm-wide | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-canon-ef-11-24-f4l-usm-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-canon-ef-135-f2l-usm | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-canon-ef-135mm-f28-soft-focus | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-canon-ef-14mm-f28-l | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-canon-ef-180mm-f35l-macro-usm | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-canon-ef-20-35mm-f28l-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-canon-ef-20-35mm-f28l-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-tele | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-wide | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-tele | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-canon-ef-200mm-f1-8-l-usm | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-canon-ef-200mm-f2l-is-usm | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-canon-ef-20mm-f28-usm | 1 | PASS: mtf.maxAbs 1.43e-14 (1 of 1) |
| catalog-canon-ef-24-70-f28l-ii-wide | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-canon-ef-24-70-f28l-ii-tele | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-canon-ef-24-70mm-f28l-usm-wide | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-canon-ef-24-70mm-f28l-usm-tele | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| catalog-canon-ef-24mm-f14-l-ii-usm | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-canon-ef-24mm-f14-l-usm | 1 | PASS: mtf.maxAbs 1.28e-15 (1 of 1) |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-wide | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-tele | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-canon-ef-28-105mm-f4-56-wide | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-canon-ef-28-105mm-f4-56-tele | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-tele | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-canon-ef-28-200mm-f35-56-usm-wide | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-canon-ef-28-200mm-f35-56-usm-tele | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-canon-ef-28-70mm-f35-45-ii-wide | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-canon-ef-28-70mm-f35-45-ii-tele | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-canon-ef-28-80mm-f35-56-ii-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-canon-ef-28-80mm-f35-56-ii-tele | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-wide | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-tele | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-canon-ef-28mm-f2-8 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-canon-ef-28mm-f28-is-usm | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-canon-ef-300mm-f28l-is-usm | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-canon-ef-35mm-f14l-ii-usm | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| catalog-canon-ef-35mm-f14l-usm | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-canon-ef-35mm-f2-is-usm | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-canon-ef-40-f28-stm | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-canon-ef-400mm-f28-l-is-ii-usm | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-canon-ef-400mm-f28l-is-iii-usm | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-canon-ef-400mm-f28l-is-usm | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-canon-ef-500mm-f4l-is-usm | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| catalog-canon-ef-50f10l | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-canon-ef-50mm-f1p2l-usm | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| catalog-canon-ef-600f4l-is-ii-usm | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-canon-ef-600f4l-is-iii-usm | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-canon-ef-600mm-f4l-is-usm | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-canon-ef-70-200f28l-is-usm-wide | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-canon-ef-70-200f28l-is-usm-tele | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-tele | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-canon-ef-70-200mm-f4-l-usm-wide | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-canon-ef-70-200mm-f4-l-usm-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-canon-ef-70-200mm-f4l-is-usm-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-canon-ef-70-200mm-f4l-is-usm-tele | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-tele | 1 | PASS: mtf.maxAbs 1.17e-14 (1 of 1) |
| catalog-canon-ef-70-300mm-f4-56-is-usm-wide | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-canon-ef-70-300mm-f4-56-is-usm-tele | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-canon-ef-75-300mm-f4-56-is-usm-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-canon-ef-75-300mm-f4-56-is-usm-tele | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-canon-ef-85mm-f18-usm | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-wide | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-wide | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-canon-ef-m-18-55-f35-56-is-stm-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-canon-ef-m-18-55-f35-56-is-stm-tele | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-canon-ef-m-32mm-f14-stm | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-wide | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-tele | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-wide | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-tele | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-canon-ef-s-55-250-f4-56-is-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-canon-ef-s-55-250-f4-56-is-tele | 1 | PASS: mtf.maxAbs 1.17e-14 (1 of 1) |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-wide | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-canon-efm-22mm-f2-stm | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-canon-efm-28mm-f35-macro-is-stm | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-canon-efs-10-18-f4556-is-stm-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-canon-efs-10-18-f4556-is-stm-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-canon-efs-10-22mm-f35-45-usm-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-canon-efs-10-22mm-f35-45-usm-tele | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-canon-efs-17-55-f28-is-wide | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-canon-efs-17-55-f28-is-tele | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-tele | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-canon-efs-18-55mm-f35-56-is-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-canon-efs-18-55mm-f35-56-is-tele | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-canon-efs-24-f28-stm | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-canon-fd-150-600mm-f56-l-wide | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-canon-fd-150-600mm-f56-l-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-canon-fd-24mm-f28-ssc | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-canon-fd-28mm-f28 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-canon-fd-300mm-f4-ssc | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-canon-fd-35-f2 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-canon-fd-50f1p2-l | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-canon-fdn-50f12 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-canon-fl-300mm-f28-ssc-fluorite | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-canon-fl-85-300mm-f5-wide | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-canon-fl-85-300mm-f5-tele | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-canon-new-fd-100mm-f2 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-canon-new-fd-14mm-f28-l | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-canon-new-fd-35-105mm-f35-wide | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-canon-new-fd-35-105mm-f35-tele | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-wide | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-canon-powershot-g1x-1560-f28-wide | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-canon-powershot-g1x-1560-f28-tele | 1 | PASS: mtf.maxAbs 1.58e-14 (1 of 1) |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-wide | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-tele | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-canon-powershot-g3x-wide | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-canon-powershot-g3x-tele | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-wide | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-tele | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-canon-powershot-g9x-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-canon-powershot-g9x-tele | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-canon-r-58mm-f12 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-canon-rf-10-20-f4-l-is-stm-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-canon-rf-10-20-f4-l-is-stm-tele | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-wide | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-canon-rf-135f18 | 1 | PASS: mtf.maxAbs 1.58e-14 (1 of 1) |
| catalog-canon-rf-14-35mm-f4-l-is-usm-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-canon-rf-14-35mm-f4-l-is-usm-tele | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-canon-rf-14mm-f14-l-vcm | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-canon-rf-15-35-f28-wide | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-canon-rf-15-35-f28-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-canon-rf-16-28mm-f28-is-stm-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-canon-rf-16-28mm-f28-is-stm-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-canon-rf-16mm-f28-stm | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-canon-rf-200-800-f63-9-is-usm-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-canon-rf-200-800-f63-9-is-usm-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-canon-rf-20mm-f14-l-vcm | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-canon-rf-24-105-f4-l-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-canon-rf-24-105-f4-l-tele | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-canon-rf-24-105mm-f4-71-is-stm-wide | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-canon-rf-24-105mm-f4-71-is-stm-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-canon-rf-24-50-f45-63-wide | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-canon-rf-24-50-f45-63-tele | 1 | PASS: mtf.maxAbs 1.29e-14 (1 of 1) |
| catalog-canon-rf-24-70-f28-wide | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-canon-rf-24-70-f28-tele | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-canon-rf-24mm-f14-l-vcm | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-canon-rf-28-70-f2-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-canon-rf-28-70-f2-tele | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-canon-rf-28-70-f28-is-stm-wide | 1 | PASS: mtf.maxAbs 1.18e-14 (1 of 1) |
| catalog-canon-rf-28-70-f28-is-stm-tele | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| catalog-canon-rf-35mm-f14-l-vcm | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-canon-rf-35mm-f18-macro-is-stm | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-canon-rf-50-f12-l | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-canon-rf-50mm-f1-8-stm | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-canon-rf-50mm-f14-l-vcm | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-canon-rf-70-200-f28-wide | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| catalog-canon-rf-70-200-f28-tele | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-canon-rf-85f12l | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-canon-rf-85f2-macro | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-tele | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-canon-rf100f28-macro | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-canon-rf24-105f28z-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-canon-rf24-105f28z-tele | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-canon-rf24-240-f4-63-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-canon-rf24-240-f4-63-tele | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-canon-rf70-200mm-f4-l-is-usm-wide | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-canon-rf70-200mm-f4-l-is-usm-tele | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-wide | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-canon-s-50mm-f2-8 | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-canon-serenar-100mm-f35 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-canon-serenar-28f35 | 1 | PASS: mtf.maxAbs 4.94e-15 (1 of 1) |
| catalog-canon-serenar-35f32 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-canon-serenar-50f18 | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-canon-serenar-85f15 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-canon-ts-e-24mm-f35l-ii | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-canon-tse-135mm-f4l | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-canon-tse-50f28l-macro | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-canon-tse-90mm-f28l-macro | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-carl-zeiss-biogon-35f28-contax | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-carl-zeiss-contarex-planar-55f14 | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-carl-zeiss-distagon-t-25f28-contax | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-carl-zeiss-jena-biometar-120f28 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-carl-zeiss-jena-biometar-80f28 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-carl-zeiss-jena-pancolar-50f2 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-carl-zeiss-jena-pi-flektogon-30mm-f28-printed-1975-eline | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-carl-zeiss-planar-80mm-f28-graflex-xl | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-carl-zeiss-tele-tessar-500mm-f8-c | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-carl-zeiss-tessar-50f35 | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-wide | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-tele | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-wide | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-tele | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-color-skopar-28f28 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-czj-flektogon-20-f4 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-czj-tessar-50-f28 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-elmarit-r-28f28 | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-enna-munchen-lithagon-24mm-f4 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-enna-munchen-lithagon-35mm-f35 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-enna-munchen-ultra-lithagon-28mm-f35 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-fuji-xf-16-55-f28-wide | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-fuji-xf-16-55-f28-tele | 1 | PASS: mtf.maxAbs 1.27e-14 (1 of 1) |
| catalog-fuji-xf-50140mm-f28-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-fuji-xf-50140mm-f28-tele | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-fujifilm-fujinar-210mm-f45 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-fujifilm-fujinon-85mm-f4-sf-ebc | 1 | PASS: mtf.maxAbs 2.72e-15 (1 of 1) |
| catalog-fujifilm-fujinon-gf-30mm-f35-r-wr | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-fujifilm-fujinon-gf-500mm-f56-r-lm-ois-wr | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-fujifilm-fujinon-gf-50mm-f35-r-lm-wr | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-fujifilm-fujinon-gf-63mm-f28-r-wr | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-fujifilm-fujinon-sw-65f56 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-fujifilm-fujinon-w-35mm-f19 | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-wide | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-wide | 1 | PASS: mtf.maxAbs 1.31e-14 (1 of 1) |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | 1 | PASS: mtf.maxAbs 1.22e-14 (1 of 1) |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-tele | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-tele | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-tele | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-wide | 1 | PASS: mtf.maxAbs 1.18e-14 (1 of 1) |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-tele | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-wide | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-16mm-f14-r-wr | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-16mm-f28-r-wr | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-wide | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-tele | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-wide | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-tele | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-18mm-f14-r-lm-wr | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-27mm-f28 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-35mm-f2-r-wr | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-50mm-f2-r-wr | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-wide | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-tele | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-fujifilm-fujinon-xf-8mm-f35-r-wr | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-wide | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-tele | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-fujifilm-ga645-pro-60mm-f4 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-fujifilm-ga645widepro-45mm-f4 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-fujifilm-gf-100-200mm-f56-wide | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-fujifilm-gf-100-200mm-f56-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-fujifilm-gf-110mm-f2 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-tele | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-fujifilm-gf-23mm-f4 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-fujifilm-gf-30mm-f56-ts | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-wide | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-tele | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-wide | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-tele | 1 | PASS: mtf.maxAbs 1.17e-14 (1 of 1) |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-wide | 1 | PASS: mtf.maxAbs 1.23e-14 (1 of 1) |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-tele | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-fujifilm-gf-45mm-f28-r-wr | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-fujifilm-gf250mm-f4-r-lm-ois-wr | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-fujifilm-gf55mm-f17-r-wr | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-fujifilm-gf80-f17 | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-fujifilm-gfx100rf-35mm-f4 | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-fujifilm-natura-s-24mm-f19 | 1 | PASS: mtf.maxAbs 8.16e-15 (1 of 1) |
| catalog-fujifilm-x-fujinon-w-24mm-f28-dm-ebc | 1 | PASS: mtf.maxAbs 1.39e-14 (1 of 1) |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-tele | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| catalog-fujifilm-x100-23f2 | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-fujifilm-x100-tcl-x100 | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-fujifilm-x100v-23f2 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-fujifilm-x70-18mm-f28 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-wide | 1 | PASS: mtf.maxAbs 1.23e-14 (1 of 1) |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-tele | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-fujifilm-xf-16-80-f4-wide | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-fujifilm-xf-16-80-f4-tele | 1 | PASS: mtf.maxAbs 1.44e-14 (1 of 1) |
| catalog-fujifilm-xf-200-f2 | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-fujifilm-xf-23mm-f14-r-lm-wr | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-fujifilm-xf-23mm-f2-r-wr | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-fujifilm-xf-23mm-f28-r-wr | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-fujifilm-xf-33mm-f14-r-lm-wr | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-wide | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-fujifilm-xf18f2r | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-fujifilm-xf35-f14-r | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-fujifilm-xf50-f1 | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-fujifilm-xf56mm-f12-r-wr | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-fujifilm-xf60-f24-r-macro | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-fujifilm-xf80-f28-macro | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-fujifilm-xf90f2 | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-fujinon-xf-23mm-f14-r | 1 | PASS: mtf.maxAbs 5.45e-15 (1 of 1) |
| catalog-fujinon-xf56f12r | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-gf-120f4-macro | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-hasselblad-hc-150-f32 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-hasselblad-hc-210-f4 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-hasselblad-hc-300-f4p5 | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| catalog-hasselblad-hc-35mm-f35-fujinon | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| catalog-hasselblad-hc-50-f35 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-hasselblad-hc-50f35-ii | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-hasselblad-hc-80-f28 | 1 | PASS: mtf.maxAbs 1.62e-14 (1 of 1) |
| catalog-hasselblad-hc-macro-4-120 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-hasselblad-xcd-120-f35-macro | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| catalog-hasselblad-xcd-25mm-f25-v | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-hasselblad-xcd-30mm-f35 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-tele | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-hasselblad-xcd-45f35 | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| catalog-hasselblad-xcd-65-f28 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-hasselblad-xcd-90-f25-v | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-tele | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-tele | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-wide | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-tele | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-heliar-symmetric-1902 | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| catalog-industar-itmo2013-v2 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-kinoptik-super-tegea-19mm-f19-fisheye | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-kinoptik-tegea-57mm-f18 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-kinoptik-tegea-98mm-f18 | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-kodak-aero-ektar-6in-f35 | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-kodak-ektar-50f35 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-kodak-ektar-52f15 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-kodak-enlarging-ektar-100mm-f45 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-kodak-wide-field-ektar-100f63 | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-konica-fl-hexanon-ar-300mm-f63 | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-konica-hexanon-135mm-f35 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-konica-hexanon-38mm-f28 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-konica-hexanon-60f12 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-konica-hexanon-ar-135mm-f3-5 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-konica-hexanon-ar-21mm-f2-8 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-konica-hexanon-ar-24mm-f2-8 | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-konica-hexanon-ar-35mm-f28 | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-konica-hexanon-ar-40mm-f18 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-konica-hexanon-ar-50mm-f1-8 | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-konica-hexar-35f2 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-konica-uc-hexanon-ar-28mm-f1-8 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-wide | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-wide | 1 | PASS: mtf.maxAbs 1.34e-14 (1 of 1) |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-wide | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-tele | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-wide | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-tele | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-tele | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-laowa-100mm-f28-tilt-shift-1x-macro | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-laowa-105mm-f2-stf | 1 | PASS: mtf.maxAbs 1.80e-14 (1 of 1) |
| catalog-laowa-12mm-f28-zero-d | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-laowa-15f4-macro | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-laowa-15mm-f2-zero-d | 1 | PASS: mtf.maxAbs 2.50e-15 (1 of 1) |
| catalog-laowa-180mm-f45-ultra-macro-apo | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-laowa-180mm-f45-ultra-macro-apo-af | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-laowa-24f14-probe | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-laowa-55mm-f28-tilt-shift-1x-macro | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-laowa-58mm-f28-2x-macro-apo | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-laowa-65mm-f28-macro-apo | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-laowa-90mm-f28-ultra-macro-apo | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-laowa-argus-45mm-f095-ff | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-leica-apo-macro-elmarit-tl-60-f28 | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-leica-apo-summicron-43f2 | 1 | PASS: mtf.maxAbs 1.17e-14 (1 of 1) |
| catalog-leica-apo-summicron-m-35f2 | 1 | PASS: mtf.maxAbs 4.86e-15 (1 of 1) |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-wide | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-leica-colorplan-90mm-f25 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-wide | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-wide | 1 | PASS: mtf.maxAbs 1.22e-14 (1 of 1) |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-tele | 1 | PASS: mtf.maxAbs 1.12e-14 (1 of 1) |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-wide | 1 | PASS: mtf.maxAbs 1.70e-14 (1 of 1) |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-wide | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-tele | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-leica-elcan-50f2 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-leica-elmar-35mm-f35-mini-ii | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-leica-elmar-m-135mm-f4 | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-leica-elmarit-28mm-f28-11801 | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| catalog-leica-elmarit-90f28 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-leica-elmarit-m-135mm-f28 | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-leica-elmarit-r-35mm-f28 | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-leica-elmarit-tl-18mm-f28 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-leica-macro-elmar-m-90mm-f4 | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-leica-macro-elmarit-r-60mm-f28 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-leica-noctilux-50mm-f12 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-leica-noctilux-m-35mm-f12-asph | 1 | PASS: mtf.maxAbs 2.78e-15 (1 of 1) |
| catalog-leica-summicron-35mm-f2-i | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-leica-summicron-c-40mm-f2 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-leica-summicron-m-50f2-v5 | 1 | PASS: mtf.maxAbs 1.28e-14 (1 of 1) |
| catalog-leica-summicron-r-50mm-f2 | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-leica-summicron-sl-50mm-f2-asph | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-leica-summilux-28f17 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-leica-summilux-c-100mm-t14 | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-leica-summilux-c-18mm-t14 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-leica-summilux-c-40mm-t14 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-leica-summilux-m-35f14 | 1 | PASS: mtf.maxAbs 4.27e-15 (1 of 1) |
| catalog-leica-summilux-m-35mm-f14-aspherical | 1 | PASS: mtf.maxAbs 1.83e-15 (1 of 1) |
| catalog-leica-summilux-m-50mm-f14-i | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-leica-summilux-m-50mm-f14-ii | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-leica-summilux-sl-50mm-f14-asph-i | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-leica-summilux-tl-35mm-f14-asph | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-leica-super-angulon-r-21mm-f4 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-wide | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-tele | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-wide | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-tele | 1 | PASS: mtf.maxAbs 1.12e-14 (1 of 1) |
| catalog-leica-telyt-200mm-f4 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-leica-telyt-s-800mm-f63 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-lumix-s-20-60-f35-56-wide | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-lumix-s-20-60-f35-56-tele | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-mamiya-af-apo-300-f45-if | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-mamiya-n-210mm-f8-l | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-mamiya-sekor-af-150mm-f28-if-d | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-mamiya-sekor-af-55mm-f28 | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-mamiya-sekor-c-55mm-f2-8-n | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-mamiya-sekor-cs-35mm-f2-8 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-mamiya-sekor-macro-c-80f4 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-mamiya-sekor-sfc-150f4-soft-focus | 1 | PASS: mtf.maxAbs 1.94e-15 (1 of 1) |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-meyer-optik-gorlitz-double-plasmat-135mm-f45 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-meyer-optik-gorlitz-kino-plasmat-100-f2 | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| catalog-meyer-optik-gorlitz-lydith-30f35 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-meyer-optik-gorlitz-orestegor-500mm-f56 | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-meyer-optik-gorlitz-orestor-135f28 | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-meyer-optik-gorlitz-primagon-35f45 | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-minolta-af-100mm-f2 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-minolta-af-100mm-f28-macro | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-minolta-af-200mm-f28 | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-minolta-af-20mm-f28 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-minolta-af-28-70mm-f28-g-wide | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-minolta-af-28-70mm-f28-g-tele | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-minolta-af-28-75-f28-d-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-minolta-af-28-75-f28-d-tele | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-minolta-af-28mm-f2 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-minolta-af-300mm-f28 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-wide | 1 | PASS: mtf.maxAbs 1.28e-14 (1 of 1) |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-tele | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-minolta-af-35-70-f4-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-minolta-af-35-70-f4-tele | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-minolta-af-35mm-f14 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-minolta-af-35mm-f2 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-minolta-af-400mm-f45-apo-g | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-wide | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-tele | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-minolta-af-80-200mm-f28-apo-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-minolta-af-80-200mm-f28-apo-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-minolta-auto-tele-rokkor-100f2 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-minolta-mc-w-rokkor-sg-28f35-v2 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-minolta-md-135f28 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-minolta-md-28mm-f28-7-7 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-minolta-md-28mm-f28-v2 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-minolta-md-50f2 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-minolta-md-apo-tele-600mm-f63 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-minolta-md-rokkor-45f2 | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-minolta-md-rokkor-50f14 | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-minolta-md-tele-rokkor-135mm-f28 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-minolta-md-zoom-24-35-f35-wide | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-minolta-md-zoom-24-35-f35-tele | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-minolta-md-zoom-24-50-f4-wide | 1 | PASS: mtf.maxAbs 7.61e-15 (1 of 1) |
| catalog-minolta-md-zoom-24-50-f4-tele | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-minolta-md-zoom-28-85-f35-45-wide | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-minolta-md-zoom-28-85-f35-45-tele | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-minolta-md-zoom-35-135mm-f35-45-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-minolta-md-zoom-35-135mm-f35-45-tele | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-minolta-md-zoom-50-135mm-f35-wide | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-minolta-md-zoom-50-135mm-f35-tele | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-minolta-md-zoom-75-150-f4-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-minolta-md-zoom-75-150-f4-tele | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-minolta-stf-135f28-t45 | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-miranda-auto-e-50mm-f14 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-miranda-auto-ec-135mm-f28 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-miranda-auto-ec-200mm-f35 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-miranda-auto-ec-35mm-f28 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-nikkor-105-f14e-ed | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-nikkor-24f28 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-nikkor-28f14d | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-nikkor-85f14-ais | 1 | PASS: mtf.maxAbs 1.30e-14 (1 of 1) |
| catalog-nikkor-85f14d | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-nikkor-85f14g | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-nikkor-af-28-200-f3556-g-if-ed-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikkor-af-28-200-f3556-g-if-ed-tele | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-nikkor-af-s-58f14g | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-nikkor-afs-120-300f28e-wide | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-nikkor-afs-120-300f28e-tele | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-nikkor-afs-14-24f28-wide | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-nikkor-afs-14-24f28-tele | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-nikkor-afs-16-35f4-vr-wide | 1 | PASS: mtf.maxAbs 1.12e-14 (1 of 1) |
| catalog-nikkor-afs-16-35f4-vr-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-nikkor-afs-200-500f56e-wide | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikkor-afs-200-500f56e-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-nikkor-afs-24-70-f28e-vr-wide | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikkor-afs-24-70-f28e-vr-tele | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-nikkor-n-28f2 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-nikkor-s-auto-50mm-f14 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikkor-z-100-400-f4556-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-nikkor-z-100-400-f4556-tele | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-nikkor-z-14-30f4s-wide | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikkor-z-14-30f4s-tele | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-nikkor-z-24-120f4-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-nikkor-z-24-120f4-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikkor-z-24-200-f4-63-vr-wide | 1 | PASS: mtf.maxAbs 1.42e-14 (1 of 1) |
| catalog-nikkor-z-24-200-f4-63-vr-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikkor-z-24-50-f4-63-wide | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-nikkor-z-24-50-f4-63-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-nikkor-z-24-70-f28-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-nikkor-z-24-70-f28-tele | 1 | PASS: mtf.maxAbs 1.40e-14 (1 of 1) |
| catalog-nikkor-z-28f28 | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-nikkor-z-35f18s | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-nikkor-z-40f2 | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-nikkor-z-50f18s | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-nikkor-z-70-200f28-wide | 1 | PASS: mtf.maxAbs 3.05e-15 (1 of 1) |
| catalog-nikkor-z-70-200f28-tele | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| catalog-nikkor-z-70-200f28-vr-s-ii-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-nikkor-z-70-200f28-vr-s-ii-tele | 1 | PASS: mtf.maxAbs 3.22e-15 (1 of 1) |
| catalog-nikkor-z-85f18s | 1 | PASS: mtf.maxAbs 1.34e-14 (1 of 1) |
| catalog-nikkor-z50f12 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-wide | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-tele | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-nikon-1-nikkor-10mm-f28 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-nikon-1-nikkor-11-27p5-f35-56-wide | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-nikon-1-nikkor-11-27p5-f35-56-tele | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikon-1-nikkor-32mm-f12 | 1 | PASS: mtf.maxAbs 1.31e-14 (1 of 1) |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-tele | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-wide | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-tele | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikon-28ti-28f28 | 1 | PASS: mtf.maxAbs 1.43e-14 (1 of 1) |
| catalog-nikon-35ti-35f28 | 1 | PASS: mtf.maxAbs 1.11e-14 (1 of 1) |
| catalog-nikon-5cm-f11 | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-nikon-af-dc-nikkor-135mm-f2 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-nikon-af-i-nikkor-300mm-f2-8d-if-ed | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-af-i-nikkor-400mm-f28d-if-ed | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-nikon-af-i-nikkor-600mm-f4d-if-ed | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikon-af-micro-nikkor-200mm-f4d | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-nikon-af-micro-nikkor-60mm-f28d | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-nikon-af-nikkor-20mm-f28d | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-nikon-af-nikkor-28mm-f28d | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-nikon-af-nikkor-35mm-f2d | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-wide | 1 | PASS: mtf.maxAbs 1.22e-14 (1 of 1) |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-tele | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-tele | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-tele | 1 | PASS: mtf.maxAbs 1.39e-14 (1 of 1) |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-tele | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-nikon-af-s-dx-micro-nikkor-40mm-f28g | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-wide | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-tele | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-wide | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-tele | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-wide | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-tele | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-tele | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-tele | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-wide | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-tele | 1 | PASS: mtf.maxAbs 1.27e-14 (1 of 1) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-wide | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-wide | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-tele | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-wide | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-24mm-f18g-ed | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-400mm-f28e-fl-ed-vr | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-500mm-f4g-ed-vr | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-600mm-f4d-if-ed-ii | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-wide | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-nikon-af-s-nikkor-800f56e-fl-ed-vr | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-wide | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-tele | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-wide | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-wide | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-tele | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-wide | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-tele | 1 | PASS: mtf.maxAbs 1.45e-14 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-wide | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-tele | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-wide | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-wide | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-tele | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-wide | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-tele | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-nikon-af600-28mm-f35 | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-wide | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-tele | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-nikon-afp-dx-70-300-f4563g-wide | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-nikon-afp-dx-70-300-f4563g-tele | 1 | PASS: mtf.maxAbs 2.89e-15 (1 of 1) |
| catalog-nikon-afs-105f28-vr-micro | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| catalog-nikon-afs-24-120mm-f4g-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-nikon-afs-24-120mm-f4g-tele | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| catalog-nikon-afs-24-70mm-f28g-wide | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-nikon-afs-24-70mm-f28g-tele | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-nikon-afs-28f14e | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-nikon-afs-70-200-f28e-fl-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikon-afs-70-200-f28e-fl-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikon-afs-80-400-f45-56g-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-afs-80-400-f45-56g-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-wide | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-tele | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-nikon-afs-vr-200400f4g-if-ed-wide | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-nikon-afs-vr-200400f4g-if-ed-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-wide | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-tele | 1 | PASS: mtf.maxAbs 1.27e-14 (1 of 1) |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-wide | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-tele | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-nikon-ai-28mm-f35 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-nikon-ai-af-dc-nikkor-105mm-f2d | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-nikon-ai-af-micro-nikkor-105mm-f28s | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-nikon-ai-af-nikkor-85f18s | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-nikon-ai-af-s-nikkor-300mm-f28d-if-ed | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikon-ai-af-s-nikkor-400mm-f28d-if-ed-ii | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-nikon-ai-af-s-nikkor-500mm-f4d-if-ed | 1 | PASS: mtf.maxAbs 3.55e-15 (1 of 1) |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-wide | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-tele | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-wide | 1 | PASS: mtf.maxAbs 1.12e-14 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-wide | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-tele | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-wide | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-tele | 1 | PASS: mtf.maxAbs 1.28e-14 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-tele | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikon-ai-micro-nikkor-105mm-f28s | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-ai-micro-nikkor-55f28 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-135f2 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-135f28 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-180mm-f28-ed | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-200mm-f2-if-ed | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-24mm-f2 | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-28mm-f28s | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-35mm-f14-s | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| catalog-nikon-ai-nikkor-35mm-f2 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-45mm-f28-p | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-nikon-ai-nikkor-50f18s | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-nikon-ai-nikkor-600mm-f56-if-ed | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-wide | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-wide | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-tele | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-tele | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-wide | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-tele | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-tele | 1 | PASS: mtf.maxAbs 1.64e-14 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-wide | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-tele | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-wide | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-tele | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-wide | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-tele | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-nikon-ais-nikkor-300mm-f2-if-ed | 1 | PASS: mtf.maxAbs 1.29e-14 (1 of 1) |
| catalog-nikon-ais-nikkor-50mm-f12 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-wide | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-tele | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-tele | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikon-dodotto-400f8 | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikon-fuwatto-soft-90mm-f48 | 1 | PASS: mtf.maxAbs 1.55e-15 (1 of 1) |
| catalog-nikon-gugotto-120mm-f45 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikon-gyogyotto-20mm-f8 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-wide | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-nikon-l35af-35f28 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikon-lw-nikkor-28-f28 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-nikon-medical-nikkor-120mm-f4-if | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| catalog-nikon-micro-60f28g | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-nikon-new-nikkor-auto-28mm-f28 | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-nikon-nikkor-15mm-f56 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-nikon-nikkor-20mm-f4 | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-nikon-nikkor-300mm-f45-ed | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-nikon-nikkor-35mm-f28 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-nikon-nikkor-600mm-f56-ed | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikon-nikkor-800mm-f8-ed | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-nikon-nikkor-afs-20mm-f18g | 1 | PASS: mtf.maxAbs 1.51e-14 (1 of 1) |
| catalog-nikon-nikkor-afs-24mm-f14g | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-wide | 1 | PASS: mtf.maxAbs 3.94e-15 (1 of 1) |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-tele | 1 | PASS: mtf.maxAbs 2.55e-15 (1 of 1) |
| catalog-nikon-nikkor-h-auto-28mm-f35 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-nikon-nikkor-o-21mm-f4 | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-nikon-nikkor-s-auto-50f2 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-nikkor-s-auto-58mm-f1-4 | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-nikon-nikkor-sw-75mm-f45 | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-nikon-nikkor-sw-90mm-f45 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-wide | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-nikon-nikkor-z-20mm-f18-s | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-wide | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-tele | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-nikon-nikkor-z-35f12s | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-wide | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-tele | 1 | PASS: mtf.maxAbs 1.11e-14 (1 of 1) |
| catalog-nikon-pc-e-nikkor-24-f35d-ed | 1 | PASS: mtf.maxAbs 4.83e-15 (1 of 1) |
| catalog-nikon-pc-nikkor-19mm-f4e-ed | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-nikon-pc-nikkor-35mm-f28 | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| catalog-nikon-pce-micro-nikkor-45f28d | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-nikon-ruw-af-micro-nikkor-50f28 | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-tele | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-nikon-series-e-100mm-f28 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-series-e-135mm-f28 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-nikon-series-e-75-150mm-f35-wide | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-nikon-series-e-75-150mm-f35-tele | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-nikon-series-e-zoom-36-72mm-f35-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-nikon-series-e-zoom-36-72mm-f35-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-nikon-tv-nikkor-115-69-f12-s100-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-nikon-ultra-micro-nikkor-295mm-f12 | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-nikon-uv-nikkor-105mm-f45 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-uv-nikkor-55mm-f4 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-nikon-w-nikkor-35mm-f18 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-nikon-z-135f18-plena | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-nikon-z-14-24f28-s-wide | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-nikon-z-14-24f28-s-tele | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-nikon-z-24-70f4s-wide | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-nikon-z-24-70f4s-tele | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-nikon-z-26f28 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-nikon-z-58f095-noct | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-nikon-z-dx-16-50-f3563-vr-wide | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-nikon-z-dx-16-50-f3563-vr-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-nikon-z-dx-18-140-f35-63-vr-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-nikon-z-dx-18-140-f35-63-vr-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-tele | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| catalog-nikon-z-mc-105f28 | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-28-45f45-wide | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-28-45f45-tele | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-tele | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-wide | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-tele | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-wide | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-tele | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-wide | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-nokton-50f1 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-olympus-e-zuiko-auto-t-1000mm-f11 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-olympus-g-zuiko-auto-w-21mm-f35 | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| catalog-olympus-mzuiko-12-40-f28-pro-wide | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-olympus-mzuiko-12-40-f28-pro-tele | 1 | PASS: mtf.maxAbs 1.37e-14 (1 of 1) |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-tele | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-olympus-mzuiko-12mm-f2 | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-olympus-mzuiko-14-42-3556-ii-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-olympus-mzuiko-14-42-3556-ii-tele | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-olympus-mzuiko-17mm-f18 | 1 | PASS: mtf.maxAbs 1.59e-14 (1 of 1) |
| catalog-olympus-mzuiko-17mm-f28 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-olympus-mzuiko-25mm-f18 | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| catalog-olympus-mzuiko-40-150-f28-pro-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-olympus-mzuiko-40-150-f28-pro-tele | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-wide | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-olympus-mzuiko-75mm-f18 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-wide | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-tele | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-wide | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-tele | 1 | PASS: mtf.maxAbs 4.33e-15 (1 of 1) |
| catalog-olympus-mzuiko-digital-ed-17mm-f12-pro | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-olympus-mzuiko-digital-ed-45mm-f12-pro | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-olympus-pen-f-g-zuiko-auto-t-60mm-f15 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-olympus-pen-f-g-zuiko-auto-w-25mm-f28 | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-olympus-xa-zuiko-35-f28 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-olympus-zuiko-135-f35 | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-olympus-zuiko-16mmf35-fisheye | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-olympus-zuiko-24f2-j | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-olympus-zuiko-28mm-f35 | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-olympus-zuiko-600mm-f65 | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-olympus-zuiko-85mm-f2 | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-olympus-zuiko-9-36-f2-2p4-wide | 1 | PASS: mtf.maxAbs 1.18e-14 (1 of 1) |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-olympus-zuiko-auto-macro-50f2 | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-macro-90f2 | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-s-50f12 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-s-50f14 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-s-55-f12 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-t-180mm-f2 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-t-200mm-f5 | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-w-18f35 | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-w-21mm-f2 | 1 | PASS: mtf.maxAbs 1.14e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-w-24f28 | 1 | PASS: mtf.maxAbs 7.99e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-w-24mm-f28 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-w-28mm-f2 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-wide | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-tele | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-tele | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-wide | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-tele | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-150mm-f2 | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-300mm-f28 | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-tele | 1 | PASS: mtf.maxAbs 3.33e-15 (1 of 1) |
| catalog-olympus-zuiko-mc-auto-w-28mm-f28 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-wide | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-tele | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-panasonic-dg-nocticron-42mm-f12 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-panasonic-dg-summilux-12mm-f14 | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-panasonic-g-14mm-f25-ii | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-panasonic-leica-dg-15f17 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-panasonic-leica-dg-25f14 | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| catalog-panasonic-leica-dg-9f17 | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-panasonic-lumix-g-25mm-f17 | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-wide | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-tele | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-tele | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-panasonic-lumix-g-vario-7-14-f4-wide | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-panasonic-lumix-g-vario-7-14-f4-tele | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-wide | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-panasonic-lumix-s-26mm-f8 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-panasonic-lumix-s-35-f18 | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-wide | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-tele | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-panasonic-lumix-s-pro-16-35f4-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-panasonic-lumix-s-pro-16-35f4-tele | 1 | PASS: mtf.maxAbs 1.50e-14 (1 of 1) |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-tele | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-panasonic-lumix-s-pro-50-f14 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-wide | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-tele | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-wide | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-tele | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-pentax-02-standard-zoom-5-15-f28-45-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-pentax-02-standard-zoom-5-15-f28-45-tele | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-pentax-06-telephoto-zoom-15-45-f28-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-pentax-06-telephoto-zoom-15-45-f28-tele | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-pentax-110-24f28 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-pentax-645-a-45mm-f28 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-pentax-645-fa-120mm-f4-macro | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-pentax-a-200mm-f4-macro-ed | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-pentax-a-35-70f4-wide | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-pentax-a-35-70f4-tele | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-pentax-a-star-135mm-f18 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-pentax-da-11-18-f28-wide | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-pentax-da-11-18-f28-tele | 1 | PASS: mtf.maxAbs 1.38e-14 (1 of 1) |
| catalog-pentax-da-16-50-f28-wide | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-pentax-da-16-50-f28-tele | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-wide | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-tele | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-pentax-da-18-55mm-f35-56-al-wide | 1 | PASS: mtf.maxAbs 1.11e-14 (1 of 1) |
| catalog-pentax-da-18-55mm-f35-56-al-tele | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-pentax-da-21mm-f32-limited | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-pentax-da-35mm-f28-macro-limited | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-pentax-da-50-135-f28-wide | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-pentax-da-50-135-f28-tele | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-pentax-da-70mm-f24-limited | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-tele | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-pentax-dfa-50mm-f14-sdm-aw | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-pentax-dfa-85mm-f14 | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-pentax-dfa645-25mm-f4-al-if-sdm-aw | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-pentax-dfa645-90f28-ed-aw-sr-macro | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-pentax-f-85-f28-soft | 1 | PASS: mtf.maxAbs 1.75e-15 (1 of 1) |
| catalog-pentax-fa-20-35mm-f4-al-wide | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-pentax-fa-20-35mm-f4-al-tele | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-pentax-fa-28mm-f28-soft | 1 | PASS: mtf.maxAbs 1.83e-15 (1 of 1) |
| catalog-pentax-fa-31-f18-al-ltd | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-pentax-fa-star-300mm-f45-ed-if | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-wide | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-tele | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-pentax-hd-d-fa645-35f35-al-if | 1 | PASS: mtf.maxAbs 3.35e-15 (1 of 1) |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-tele | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-pentax-hd-da-20-40-f28-4-limited-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-pentax-hd-da-20-40-f28-4-limited-tele | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-pentax-hd-dfa-21mm-f24-limited | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-pentax-smc-67-100mm-f4 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-pentax-smc-da-16-45-f4-ed-al-wide | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-pentax-smc-da-16-45-f4-ed-al-tele | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-tele | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-pentax-super-takumar-135mm-f2-5 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-pentax-super-takumar-28mm-f35 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-pentax-super-takumar-35mm-f2 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-pentax-ultra-achromatic-takumar-85f45 | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-pentax110-50f28 | 1 | PASS: mtf.maxAbs 1.37e-14 (1 of 1) |
| catalog-ricoh-gr-18p3-f2p8 | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-ricoh-gr-digital-iii-6mm-f19 | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-ricoh-gr-lens-6mm-f19-gr-digital-iv | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-ricoh-gr1-28f28 | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-ricoh-gr3-28f28 | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-ricoh-gr3x-26f28 | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-ricoh-gr4-28f28 | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-ricoh-gxr-a12-18f25 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-ricoh-lens-a16-24-85-f35-55-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-ricoh-lens-a16-24-85-f35-55-tele | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-rodenstock-apo-sironar-w-150f56 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-rodenstock-apo-sironar-w-150f56-a1-reconstruction | 1 | PASS: mtf.maxAbs 1.25e-15 (1 of 1) |
| catalog-rodenstock-geronar-210mm-f68 | 1 | PASS: mtf.maxAbs 6.61e-15 (1 of 1) |
| catalog-rodenstock-geronar-wa-90mm-f8 | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-rodenstock-grandagon-n-65mm-f45 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-rodenstock-grandagon-n-75mm-f45 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-rodenstock-grandagon-n-75mm-f68 | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-rodenstock-grandagon-n-90mm-f45 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-rodenstock-rodagon-wa-80mm-f4 | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-rodenstock-rogonar-s-50f28 | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-rodenstock-sironar-100mm-f56-convertible | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-rodenstock-sironar-n-100mm-f56 | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-russar-21-60f18 | 1 | PASS: mtf.maxAbs 1.23e-14 (1 of 1) |
| catalog-russar-22-70f8 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-samsung-30mm-f2 | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-samsung-galaxy-s9-main-wide | 1 | PASS: mtf.maxAbs 1.54e-14 (1 of 1) |
| catalog-samsung-nx-20mm-f28 | 1 | PASS: mtf.maxAbs 1.05e-14 (1 of 1) |
| catalog-samsung-nx-45mm-f18 | 1 | PASS: mtf.maxAbs 1.15e-14 (1 of 1) |
| catalog-samyang-100mm-f28-ed-umc-macro | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-samyang-135mm-f2-ed-umc | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-samyang-af-14mm-f28-ef | 1 | PASS: mtf.maxAbs 1.37e-14 (1 of 1) |
| catalog-samyang-af-14mm-f2p8-fe | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-samyang-af-18mm-f28-fe | 1 | PASS: mtf.maxAbs 1.29e-14 (1 of 1) |
| catalog-samyang-af-24mm-f1p8-fe | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-samyang-af-24mm-f2p8-fe | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-samyang-af-35-150mm-f2-28-wide | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| catalog-samyang-af-35-150mm-f2-28-tele | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-samyang-af-50mm-f1p4-fe | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-samyang-af-85mm-f14-fe | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-samyang-xp-35mm-f1p2 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-schacht-s-travenar-135f28 | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| catalog-schacht-travenar-135mm-f35 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-schacht-travenar-90f28 | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-schneider-apo-symmar-100-f56 | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-schneider-cine-xenon-25f14 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-schneider-cinegon-10f18 | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-schneider-cinegon-65f19 | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-schneider-curtagon-35mm-f28-gen2 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-schneider-kreuznach-angulon-210-f68 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-schneider-kreuznach-xenar-50f28 | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-schneider-pa-curtagon-r-35f4 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-schneider-retina-curtagon-28f4 | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-schneider-retina-xenon-c-50f2 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-schneider-super-angulon-75-f56 | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-schneider-super-angulon-90mm-f8 | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-schneider-super-symmar-hm-120f56 | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-schneider-super-symmar-xl-110-f56 | 1 | PASS: mtf.maxAbs 9.53e-15 (1 of 1) |
| catalog-schneider-technika-super-angulon-75mm-f8 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-schneider-tele-variogon-80-240-f4-wide | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-schneider-tele-variogon-80-240-f4-tele | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-schneider-tele-xenar-180f45 | 1 | PASS: mtf.maxAbs 6.55e-15 (1 of 1) |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | 1 | PASS: mtf.maxAbs 2.44e-15 (1 of 1) |
| catalog-schneider-tv-variogon-20-600-f21-66-tele | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| catalog-schneider-variogon-10-40-f28-wide | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-schneider-variogon-10-40-f28-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-schneider-variogon-45-100-f28-wide | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-schneider-variogon-45-100-f28-tele | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-schneider-variogon-8-40-f18-wide | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-schneider-variogon-8-40-f18-tele | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-schneider-xenon-50f19 | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-sigma-10-18mm-f28-dc-dn-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-sigma-10-18mm-f28-dc-dn-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sigma-105mm-f14-dg-hsm-art | 1 | PASS: mtf.maxAbs 1.08e-14 (1 of 1) |
| catalog-sigma-105mm-f28-dg-dn-macro-art | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-sigma-12mm-f14-dc-contemporary | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sigma-135mm-f14-dg-art | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-sigma-14-24-f28-dg-dn-art-wide | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-sigma-14-24-f28-dg-dn-art-tele | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-sigma-14-24mm-f28-dg-hsm-art-wide | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-sigma-14-24mm-f28-dg-hsm-art-tele | 1 | PASS: mtf.maxAbs 7.77e-15 (1 of 1) |
| catalog-sigma-16mm-f14-dc-dn | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-sigma-17-40mm-f18-dc-art-wide | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-sigma-17-40mm-f18-dc-art-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-sigma-18-35-f18-dc-hsm-art-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sigma-18-35-f18-dc-hsm-art-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-sigma-200mm-f2-dg-os-sports | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-sigma-20mm-f14-dg-hsm-art | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-sigma-23mm-f14-dc-dn-c | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-sigma-24-105-f4-dg-os-hsm-art-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-sigma-24-105-f4-dg-os-hsm-art-tele | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-sigma-24-70-f28-dg-os-hsm-art-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-sigma-24-70-f28-dg-os-hsm-art-tele | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-wide | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-tele | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-sigma-24mm-f14-art-dn | 1 | PASS: mtf.maxAbs 1.83e-15 (1 of 1) |
| catalog-sigma-24mm-f18-ex-dg-aspherical-macro | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-sigma-24mm-f2-dg-dn-contemporary | 1 | PASS: mtf.maxAbs 1.19e-14 (1 of 1) |
| catalog-sigma-24mm-f35-dg-dn | 1 | PASS: mtf.maxAbs 1.35e-14 (1 of 1) |
| catalog-sigma-28-105f28-dg-dn-art-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-sigma-28-105f28-dg-dn-art-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-sigma-28-45mm-f18-dg-dn-wide | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-sigma-28-45mm-f18-dg-dn-tele | 1 | PASS: mtf.maxAbs 1.35e-14 (1 of 1) |
| catalog-sigma-28mm-f14-dg-hsm-art | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-sigma-28mm-f18-ex-dg-aspherical-macro | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-sigma-30mm-f14-dc-hsm-a | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-sigma-35-f14-dgdn-art | 1 | PASS: mtf.maxAbs 3.77e-15 (1 of 1) |
| catalog-sigma-35mm-f12-dg-ii-art | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-sigma-35mm-f14-dg-hsm-a | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-sigma-45mm-f28-dg-dn-contemporary | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-sigma-50f14-dg-hsm-a | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-sigma-50f14-dgdn-art | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-sigma-50mm-f12-dg-dn-art | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-wide | 1 | PASS: mtf.maxAbs 1.45e-14 (1 of 1) |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-tele | 1 | PASS: mtf.maxAbs 3.66e-15 (1 of 1) |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-wide | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-tele | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-sigma-60mm-f28-dn | 1 | PASS: mtf.maxAbs 3.89e-15 (1 of 1) |
| catalog-sigma-65mm-f2-dg-dn | 1 | PASS: mtf.maxAbs 1.50e-14 (1 of 1) |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-tele | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-sigma-70-300mm-f4-56-dg-os-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-sigma-70-300mm-f4-56-dg-os-tele | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-sigma-80-400mm-f45-56-ex-os-wide | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-sigma-80-400mm-f45-56-ex-os-tele | 1 | PASS: mtf.maxAbs 3.00e-15 (1 of 1) |
| catalog-sigma-85f14-art | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sigma-85mm-f12-dg-art | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-sigma-85mm-f14-ex-dg-hsm | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-sigma-90mm-f28-dg-dn-contemporary | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-tele | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-tele | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-sigma-apo-macro-105mm-f28-os-hsm | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-sigma-apo-macro-150mm-f28-os-hsm | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-sigma-apo-macro-180mm-f28-os-hsm | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-sigma-apo-macro-180mm-f56-uc | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-sigma-art-40-f14 | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| catalog-sigma-art-85mm-f14-dgdn | 1 | PASS: mtf.maxAbs 1.11e-14 (1 of 1) |
| catalog-sigma-dp0-quattro-14-f4 | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-sigma-dp1x-16mm-f4 | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-sigma-dp2m-30f28 | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-sigma-dp2x-24mmf28 | 1 | PASS: mtf.maxAbs 1.13e-14 (1 of 1) |
| catalog-sigma-dp3m-50f28 | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-sigma-macro-70mm-f28-ex-dg | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sonnar-50f15 | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-sonnar-e-24f18-za | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| catalog-sony-dt-16-50mm-f28-ssm-wide | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-sony-dt-16-50mm-f28-ssm-tele | 1 | PASS: mtf.maxAbs 5.00e-15 (1 of 1) |
| catalog-sony-e-18-200mm-f35-63-oss-le-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-sony-e-18-200mm-f35-63-oss-le-tele | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-sony-e-18-55mm-f35-56-oss-wide | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-sony-e-18-55mm-f35-56-oss-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-sony-e-20f28 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-sony-e-35mm-f18-oss | 1 | PASS: mtf.maxAbs 1.12e-14 (1 of 1) |
| catalog-sony-e-50mm-f18-oss | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-sony-epz1650mmf3556oss-wide | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-sony-epz1650mmf3556oss-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-sony-fe-1224f28-gm-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-sony-fe-1224f28-gm-tele | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-sony-fe-135-f18-gm | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-sony-fe-14mm-f18-gm | 1 | PASS: mtf.maxAbs 1.31e-14 (1 of 1) |
| catalog-sony-fe-16-35mm-f28-gm-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-sony-fe-16-35mm-f28-gm-tele | 1 | PASS: mtf.maxAbs 1.21e-14 (1 of 1) |
| catalog-sony-fe-16-35mm-f28-gm-ii-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sony-fe-16-35mm-f28-gm-ii-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sony-fe-20-70mm-f4-g-wide | 1 | PASS: mtf.maxAbs 2.66e-15 (1 of 1) |
| catalog-sony-fe-20-70mm-f4-g-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-sony-fe-20mm-f18-g | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-sony-fe-24-70mm-f28-gm-ii-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-sony-fe-24-70mm-f28-gm-ii-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-sony-fe-24-f28-g | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-sony-fe-24mm-f14-gm | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-sony-fe-28-70-f35-56-oss-wide | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-sony-fe-28-70-f35-56-oss-tele | 1 | PASS: mtf.maxAbs 1.27e-14 (1 of 1) |
| catalog-sony-fe-28-70mm-f2-gm-wide | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-sony-fe-28-70mm-f2-gm-tele | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-sony-fe-28mm-f2 | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-sony-fe-400-800-f63-8-g-oss-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-sony-fe-400-800-f63-8-g-oss-tele | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-sony-fe-400mm-f28-gm-oss | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-sony-fe-50-150mm-f2-gm-wide | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-sony-fe-50-150mm-f2-gm-tele | 1 | PASS: mtf.maxAbs 2.33e-15 (1 of 1) |
| catalog-sony-fe-50mm-f12-gm | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-sony-fe-50mm-f14-gm | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-sony-fe-600mm-f4-gm-oss | 1 | PASS: mtf.maxAbs 4.22e-15 (1 of 1) |
| catalog-sony-fe-70-200-f28-gm-oss-wide | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-sony-fe-70-200-f28-gm-oss-tele | 1 | PASS: mtf.maxAbs 1.20e-14 (1 of 1) |
| catalog-sony-fe-70-200mm-f28-gm-ii-wide | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| catalog-sony-fe-70-200mm-f28-gm-ii-tele | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-sony-fe-70-200mm-f4-g-oss-wide | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-sony-fe-70-200mm-f4-g-oss-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-wide | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | 1 | PASS: mtf.maxAbs 8.10e-15 (1 of 1) |
| catalog-sony-fe-85-f14-gm-ii | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-sony-fe-85mm-f14-gm | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-sony-fe-90mm-f2p8-macro | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-sony-fe-pz-16-35-f4-g-wide | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-sony-fe-pz-16-35-f4-g-tele | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-sony-planar-fe-50f14-za | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| catalog-sony-planar-t-50f14-za | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-wide | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-sony-sal-70-400mm-f4-56-g-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-sony-sal-70-400mm-f4-56-g-tele | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-sony-sel30mmf35 | 1 | PASS: mtf.maxAbs 8.66e-15 (1 of 1) |
| catalog-sony-sonnar-fe-35-f28-za | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-sony-sonnar-fe-55f18-za | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-sony-vario-sonnar-88-733f28-rx10-wide | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-sony-vario-sonnar-88-733f28-rx10-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-wide | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-tele | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-wide | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-tele | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-wide | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-tele | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-wide | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-tele | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-sony-vario-tessar-te-1670f4-za-oss-wide | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| catalog-sony-vario-tessar-te-1670f4-za-oss-tele | 1 | PASS: mtf.maxAbs 1.10e-14 (1 of 1) |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-wide | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-tele | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |
| catalog-tamron-a001-70-200mm-f28-wide | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-tamron-a001-70-200mm-f28-tele | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-tamron-a005-70-300-f4-5-6-vc-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-tamron-a005-70-300-f4-5-6-vc-tele | 1 | PASS: mtf.maxAbs 9.33e-15 (1 of 1) |
| catalog-tamron-a010-28-300-f35-63-wide | 1 | PASS: mtf.maxAbs 1.23e-14 (1 of 1) |
| catalog-tamron-a010-28-300-f35-63-tele | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-tamron-a03-28-200mm-f3p8-5p6-wide | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-tamron-a03-28-200mm-f3p8-5p6-tele | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-tamron-a056-70-180-f28-wide | 1 | PASS: mtf.maxAbs 3.11e-15 (1 of 1) |
| catalog-tamron-a056-70-180-f28-tele | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-tamron-a061-28-300-f35-63-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-tamron-a061-28-300-f35-63-tele | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-wide | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-tele | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-wide | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-tele | 1 | PASS: mtf.maxAbs 1.31e-14 (1 of 1) |
| catalog-tamron-a08-200500mm-f563-wide | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-tamron-a08-200500mm-f563-tele | 1 | PASS: mtf.maxAbs 4.00e-15 (1 of 1) |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-wide | 1 | PASS: mtf.maxAbs 1.17e-14 (1 of 1) |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-tele | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-wide | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-tele | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-tamron-b028-18-400-f35-63-wide | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-tamron-b028-18-400-f35-63-tele | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-tamron-c001-14-150mm-f3p5-5p8-wide | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-tamron-c001-14-150mm-f3p5-5p8-tele | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-tamron-f072-90mm-f28-di-iii-macro-vxd | 1 | PASS: mtf.maxAbs 9.99e-15 (1 of 1) |
| catalog-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004 | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-tamron-sp-a007-24-70mm-f28-vc-wide | 1 | PASS: mtf.maxAbs 9.88e-15 (1 of 1) |
| catalog-tamron-sp-a007-24-70mm-f28-vc-tele | 1 | PASS: mtf.maxAbs 4.50e-15 (1 of 1) |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-wide | 1 | PASS: mtf.maxAbs 6.72e-15 (1 of 1) |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-tele | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-wide | 1 | PASS: mtf.maxAbs 5.33e-15 (1 of 1) |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-tele | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-tamron-sp-af-17-50mm-f28-a16-wide | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-tamron-sp-af-17-50mm-f28-a16-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-tamron-sp-af-180mm-f35-di | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-wide | 1 | PASS: mtf.maxAbs 5.27e-15 (1 of 1) |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-tele | 1 | PASS: mtf.maxAbs 1.18e-15 (1 of 1) |
| catalog-tamron-sp-af-60mm-f2-di-ii-macro | 1 | PASS: mtf.maxAbs 3.44e-15 (1 of 1) |
| catalog-thypoch-ksana-21mm-f35 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-thypoch-simera-50mm-f14 | 1 | PASS: mtf.maxAbs 4.16e-15 (1 of 1) |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-wide | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-tele | 1 | PASS: mtf.maxAbs 4.44e-15 (1 of 1) |
| catalog-ultron-28f2-asph | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-ultron-50f2 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-vario-prakticar-35-70mm-f27-35-wide | 1 | PASS: mtf.maxAbs 5.88e-15 (1 of 1) |
| catalog-vario-prakticar-35-70mm-f27-35-tele | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-varisoft-rokkor-85f28 | 1 | PASS: mtf.maxAbs 1.14e-14 (1 of 1) |
| catalog-viltrox-af-14mm-f4-air | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-viltrox-af-23mm-f14 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-viltrox-af-27mm-f12-pro-xf | 1 | PASS: mtf.maxAbs 6.66e-15 (1 of 1) |
| catalog-viltrox-af-33mm-f14-e | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-viltrox-af-35f18-fe | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-viltrox-af-50mm-f14-pro | 1 | PASS: mtf.maxAbs 6.22e-15 (1 of 1) |
| catalog-viltrox-af-50mm-f18-fe | 1 | PASS: mtf.maxAbs 1.12e-15 (1 of 1) |
| catalog-viltrox-af-56mm-f14-e | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-viltrox-af-75mm-f12-pro | 1 | PASS: mtf.maxAbs 4.55e-15 (1 of 1) |
| catalog-viltrox-af-85mm-f14-pro | 1 | PASS: mtf.maxAbs 4.66e-15 (1 of 1) |
| catalog-viltrox-mf-20mm-f18-fe | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-vivitar-s1-35-85-f28-wide | 1 | PASS: mtf.maxAbs 5.77e-15 (1 of 1) |
| catalog-vivitar-s1-35-85-f28-tele | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-vivitar-s1-70-210-f28-4-wide | 1 | PASS: mtf.maxAbs 7.16e-15 (1 of 1) |
| catalog-vivitar-s1-70-210-f28-4-tele | 1 | PASS: mtf.maxAbs 4.88e-15 (1 of 1) |
| catalog-vivitar-series-1-135mm-f2-3 | 1 | PASS: mtf.maxAbs 6.44e-15 (1 of 1) |
| catalog-vivitar-series-1-70-210-f35-wide | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-vivitar-series-1-70-210-f35-tele | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-vivitar-series1-200f3 | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-voigtlander-apo-lanthar-180-f4 | 1 | PASS: mtf.maxAbs 1.25e-14 (1 of 1) |
| catalog-voigtlander-apo-lanthar-210mm-f45 | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-voigtlander-apo-lanthar-28mm-f2-aspherical-vm | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-voigtlander-apo-lanthar-50mm-f35-vm | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-voigtlander-apo-skopar-90f28 | 1 | PASS: mtf.maxAbs 6.33e-15 (1 of 1) |
| catalog-voigtlander-apo-ultron-vm-90mm-f2 | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-voigtlander-cine-tele-anastigmat-100mm-f45 | 1 | PASS: mtf.maxAbs 8.44e-15 (1 of 1) |
| catalog-voigtlander-color-heliar-105mm-f35 | 1 | PASS: mtf.maxAbs 8.55e-15 (1 of 1) |
| catalog-voigtlander-color-skopar-105mm-f35 | 1 | PASS: mtf.maxAbs 1.09e-14 (1 of 1) |
| catalog-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-voigtlander-color-skopar-vm-35mm-f35-aspherical | 1 | PASS: mtf.maxAbs 6.11e-15 (1 of 1) |
| catalog-voigtlander-dynar-f6-normalized-fd100 | 1 | PASS: mtf.maxAbs 1.04e-14 (1 of 1) |
| catalog-voigtlander-heliar-100mm-f4-5-second-asymmetric | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-voigtlander-macro-apo-lanthar-125-f25 | 1 | PASS: mtf.maxAbs 8.77e-15 (1 of 1) |
| catalog-voigtlander-nokton-35-f12 | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-voigtlander-nokton-50f15 | 1 | PASS: mtf.maxAbs 9.55e-15 (1 of 1) |
| catalog-voigtlander-nokton-50f15-aspherical-ii-vm | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-voigtlander-nokton-50mm-f15-aspherical-l39 | 1 | PASS: mtf.maxAbs 9.10e-15 (1 of 1) |
| catalog-voigtlander-nokton-60mm-f095-mft | 1 | PASS: mtf.maxAbs 1.03e-14 (1 of 1) |
| catalog-voigtlander-nokton-vintage-line-vm-75mm-f1-5-aspherical | 1 | PASS: mtf.maxAbs 7.55e-15 (1 of 1) |
| catalog-voigtlander-nokton-x-50f12 | 1 | PASS: mtf.maxAbs 7.33e-15 (1 of 1) |
| catalog-voigtlander-portrait-heliar-75f18 | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-voigtlander-skoparex-35f34-bessamatic | 1 | PASS: mtf.maxAbs 9.77e-15 (1 of 1) |
| catalog-voigtlander-super-dynarex-200mm-f4 | 1 | PASS: mtf.maxAbs 5.22e-15 (1 of 1) |
| catalog-voigtlander-super-wide-heliar-15mm-f45-aspherical-sl | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-voigtlander-tele-dynar-100mm-f63 | 1 | PASS: mtf.maxAbs 8.99e-15 (1 of 1) |
| catalog-voigtlander-telomar-100mm-f55 | 1 | PASS: mtf.maxAbs 1.07e-14 (1 of 1) |
| catalog-voigtlander-telomar-180mm-f55 | 1 | PASS: mtf.maxAbs 8.22e-15 (1 of 1) |
| catalog-voigtlander-ultra-wide-heliar-12mm-f56-aspherical-l39 | 1 | PASS: mtf.maxAbs 4.77e-15 (1 of 1) |
| catalog-voigtlander-ultron-27mm-f2 | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-voigtlander-ultron-35mm-f17-aspherical-l39 | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-yashica-auto-yashinon-ds-20mm-f33 | 1 | PASS: mtf.maxAbs 1.31e-14 (1 of 1) |
| catalog-yashica-ml-24mm-f2-8 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-yashica-ml-300mm-f56 | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-yashica-yashinon-dx-21mm-f3-3 | 1 | PASS: mtf.maxAbs 7.11e-15 (1 of 1) |
| catalog-zeiss-batis-18f28 | 1 | PASS: mtf.maxAbs 6.88e-15 (1 of 1) |
| catalog-zeiss-batis-40mm-f2-cf | 1 | PASS: mtf.maxAbs 6.00e-15 (1 of 1) |
| catalog-zeiss-batis-85f18 | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-zeiss-biogon-21-f45 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-zeiss-biogon-35mm-f28-prewar | 1 | PASS: mtf.maxAbs 7.66e-15 (1 of 1) |
| catalog-zeiss-biotar-50f14 | 1 | PASS: mtf.maxAbs 9.66e-15 (1 of 1) |
| catalog-zeiss-distagon-28mm-f2 | 1 | PASS: mtf.maxAbs 7.27e-15 (1 of 1) |
| catalog-zeiss-distagon-35f14 | 1 | PASS: mtf.maxAbs 9.44e-15 (1 of 1) |
| catalog-zeiss-distagon-35mm-f4-contarex | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-zeiss-flektogon-50mm-f4 | 1 | PASS: mtf.maxAbs 7.44e-15 (1 of 1) |
| catalog-zeiss-hologon-15f8 | 1 | PASS: mtf.maxAbs 8.88e-15 (1 of 1) |
| catalog-zeiss-jena-sonnar-50f15-us2186621 | 1 | PASS: mtf.maxAbs 7.22e-15 (1 of 1) |
| catalog-zeiss-olympia-sonnar-180f28-contarex | 1 | PASS: mtf.maxAbs 5.11e-15 (1 of 1) |
| catalog-zeiss-planar-50f14-praktica | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-zeiss-planar-80f28 | 1 | PASS: mtf.maxAbs 1.02e-14 (1 of 1) |
| catalog-zeiss-planar-t-50f14 | 1 | PASS: mtf.maxAbs 1.22e-14 (1 of 1) |
| catalog-zeiss-pro-tessar-35f32 | 1 | PASS: mtf.maxAbs 1.24e-14 (1 of 1) |
| catalog-zeiss-s-biogon-40f56 | 1 | PASS: mtf.maxAbs 4.11e-15 (1 of 1) |
| catalog-zeiss-sonnar-35f2-sony-rx1 | 1 | PASS: mtf.maxAbs 1.26e-15 (1 of 1) |
| catalog-zeiss-sonnar-40f28-rollei | 1 | PASS: mtf.maxAbs 9.21e-15 (1 of 1) |
| catalog-zeiss-sonnar-superachromat-250f56 | 1 | PASS: mtf.maxAbs 6.99e-15 (1 of 1) |
| catalog-zeiss-tessar-144f55 | 1 | PASS: mtf.maxAbs 5.55e-15 (1 of 1) |
| catalog-zeiss-touit-50mm-f28-macro | 1 | PASS: mtf.maxAbs 6.77e-15 (1 of 1) |
| catalog-zeiss-ultra-prime-135-t19 | 1 | PASS: mtf.maxAbs 7.88e-15 (1 of 1) |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-wide | 1 | PASS: mtf.maxAbs 1.35e-14 (1 of 1) |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-tele | 1 | PASS: mtf.maxAbs 8.33e-15 (1 of 1) |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-wide | 1 | PASS: mtf.maxAbs 1.01e-14 (1 of 1) |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-tele | 1 | PASS: mtf.maxAbs 5.66e-15 (1 of 1) |
| catalog-zeiss-zx1-distagon-35mm-f2 | 1 | PASS: mtf.maxAbs 5.44e-15 (1 of 1) |

## r6a

Quantity `rays.trace`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | waveMtf.flagged | 2.38e-9 | 2342 of 3835 | catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | cut sagittal, field 6.28e1, frequencyPerMm 60 |
| lv – optiland | phaseStep.waves [waves] | 6.77e3 | 3785 of 3835 | catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | field 4.48e1, line 0, ray 175 |
| lv – optiland | convergence.maxAbs | 4.65e-1 | 3783 of 3835 | catalog-canon-ef-24mm-f14-l-usm | cut sagittal, field 2.44e1, frequencyPerMm 30 |
| lv – optiland | lattice.columns [cells] | 128 | 3835 of 3835 | catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | — |
| lv – optiland | rays.compared [rays] | 10171034 | 3835 of 3835 | — | — |
| lv – optiland | rays.dropped [rays] | 11149 | 3835 of 3835 | — | — |
| lv – optiland | lines.compared [lines] | 1 | 3835 of 3835 | catalog-agfa-color-magnolar-ii-100f45 | — |
| lv – optiland | waveMtf.maxAbs (≤ 2.00e-8) | 1.24e-9 | 1443 of 3835 | catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | cut sagittal, field 5.98e0, frequencyPerMm 100 |
| lv – ref | waveMtf.flagged | 1.43e-9 | 2342 of 3835 | catalog-sony-fe-1224f28-gm-wide | cut tangential, field 4.17e1, frequencyPerMm 50 |
| lv – ref | phaseStep.waves [waves] | 6.77e3 | 3786 of 3835 | catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | field 4.48e1, line 0, ray 175 |
| lv – ref | convergence.maxAbs | 4.65e-1 | 3784 of 3835 | catalog-canon-ef-24mm-f14-l-usm | cut sagittal, field 2.44e1, frequencyPerMm 30 |
| lv – ref | lattice.columns [cells] | 128 | 3835 of 3835 | catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | — |
| lv – ref | rays.compared [rays] | 10175205 | 3835 of 3835 | — | — |
| lv – ref | rays.dropped [rays] | 6462 | 3835 of 3835 | — | — |
| lv – ref | lines.compared [lines] | 1 | 3835 of 3835 | catalog-agfa-color-magnolar-ii-100f45 | — |
| lv – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.27e-9 | 1444 of 3835 | catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | cut sagittal, field 5.98e0, frequencyPerMm 100 |
| optiland – ref | waveMtf.flagged | 1.73e-9 | 2342 of 3835 | catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | cut sagittal, field 6.28e1, frequencyPerMm 60 |
| optiland – ref | phaseStep.waves [waves] | 6.77e3 | 3785 of 3835 | catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | field 4.48e1, line 0, ray 175 |
| optiland – ref | convergence.maxAbs | 4.65e-1 | 3783 of 3835 | catalog-canon-ef-24mm-f14-l-usm | cut sagittal, field 2.44e1, frequencyPerMm 30 |
| optiland – ref | lattice.columns [cells] | 128 | 3835 of 3835 | catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | — |
| optiland – ref | rays.compared [rays] | 10177496 | 3835 of 3835 | — | — |
| optiland – ref | rays.dropped [rays] | 4687 | 3835 of 3835 | — | — |
| optiland – ref | lines.compared [lines] | 1 | 3835 of 3835 | catalog-agfa-color-magnolar-ii-100f45 | — |
| optiland – ref | waveMtf.maxAbs (≤ 2.00e-8) | 1.26e-9 | 1443 of 3835 | catalog-samyang-af-35-150mm-f2-28-tele | cut sagittal, field 8.21e0, frequencyPerMm 100 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – ref | optiland – ref |
|---|---|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-agfa-color-telinear-90mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-agfa-solagon-50mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-angenieux-dem-180mm-f23-apo | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-angenieux-retrofocus-r1-35mm-f25 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-angenieux-retrofocus-r11-28mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-apo-lanthar-50f2 | 3 | PASS: waveMtf.maxAbs 6.24e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.54e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.58e-10 (3 of 3) |
| catalog-apple-iphone-12-main-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-apple-iphone-7-wide-camera-lens | 3 | PASS: waveMtf.maxAbs 2.94e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.00e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.10e-11 (1 of 3) |
| catalog-bertele-sonnar-50f2-scaled | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-50f12-1956 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-50mm-f095 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-cine-servo-17-120-t295-39-ef-wide | 3 | PASS: waveMtf.maxAbs 4.36e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.38e-11 (1 of 3) |
| catalog-canon-cine-servo-17-120-t295-39-ef-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-100-300mm-f5-6-wide | 3 | PASS: waveMtf.maxAbs 4.63e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.13e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.86e-11 (2 of 3) |
| catalog-canon-ef-100-300mm-f5-6-tele | 3 | PASS: waveMtf.maxAbs 4.30e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.29e-11 (3 of 3) |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-wide | 3 | PASS: waveMtf.maxAbs 4.42e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.95e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.93e-11 (3 of 3) |
| catalog-canon-ef-100-400mm-f45-56l-is-ii-usm-tele | 3 | PASS: waveMtf.maxAbs 3.94e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.02e-11 (2 of 3) |
| catalog-canon-ef-100300mm-f4556-usm-wide | 3 | PASS: waveMtf.maxAbs 3.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.95e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.37e-11 (3 of 3) |
| catalog-canon-ef-100300mm-f4556-usm-tele | 3 | PASS: waveMtf.maxAbs 4.98e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.22e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.50e-11 (3 of 3) |
| catalog-canon-ef-100400-f45-56l-is-usm-wide | 3 | PASS: waveMtf.maxAbs 5.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.48e-11 (1 of 3) |
| catalog-canon-ef-100400-f45-56l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 5.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.56e-11 (3 of 3) |
| catalog-canon-ef-100mm-f28-macro | 3 | PASS: waveMtf.maxAbs 1.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.64e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.14e-11 (2 of 3) |
| catalog-canon-ef-100mm-f28l-is-macro | 3 | PASS: waveMtf.maxAbs 2.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.30e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.45e-11 (2 of 3) |
| catalog-canon-ef-11-24-f4l-usm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-11-24-f4l-usm-tele | 3 | PASS: waveMtf.maxAbs 2.13e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.65e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.65e-10 (2 of 3) |
| catalog-canon-ef-135-f2l-usm | 3 | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.11e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (3 of 3) |
| catalog-canon-ef-135mm-f28-soft-focus | 3 | PASS: waveMtf.maxAbs 2.27e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.28e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.66e-11 (1 of 3) |
| catalog-canon-ef-14mm-f28-l | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-180mm-f35l-macro-usm | 3 | PASS: waveMtf.maxAbs 1.24e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.32e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.58e-11 (2 of 3) |
| catalog-canon-ef-20-35mm-f28l-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-20-35mm-f28l-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-wide | 3 | PASS: waveMtf.maxAbs 5.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.52e-11 (3 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-tele | 3 | PASS: waveMtf.maxAbs 7.10e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.89e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.31e-11 (2 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-wide | 3 | PASS: waveMtf.maxAbs 1.18e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.36e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.58e-11 (3 of 3) |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-tele | 3 | PASS: waveMtf.maxAbs 6.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.56e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.25e-11 (2 of 3) |
| catalog-canon-ef-200mm-f1-8-l-usm | 3 | PASS: waveMtf.maxAbs 8.50e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.31e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.41e-11 (2 of 3) |
| catalog-canon-ef-200mm-f2l-is-usm | 3 | PASS: waveMtf.maxAbs 4.56e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.67e-11 (3 of 3) |
| catalog-canon-ef-20mm-f28-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-24-70-f28l-ii-wide | 3 | PASS: waveMtf.maxAbs 1.90e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.59e-10 (1 of 3) |
| catalog-canon-ef-24-70-f28l-ii-tele | 3 | PASS: waveMtf.maxAbs 4.18e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.60e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.56e-10 (1 of 3) |
| catalog-canon-ef-24-70mm-f28l-usm-wide | 3 | PASS: waveMtf.maxAbs 7.25e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.74e-10 (1 of 3) |
| catalog-canon-ef-24-70mm-f28l-usm-tele | 3 | PASS: waveMtf.maxAbs 1.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.01e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.15e-10 (2 of 3) |
| catalog-canon-ef-24mm-f14-l-ii-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-24mm-f14-l-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-105mm-f35-45-ii-usm-tele | 3 | PASS: waveMtf.maxAbs 2.86e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.01e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.17e-11 (2 of 3) |
| catalog-canon-ef-28-105mm-f4-56-wide | 3 | PASS: waveMtf.maxAbs 2.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.15e-10 (1 of 3) |
| catalog-canon-ef-28-105mm-f4-56-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-135mm-f3-5-5-6-is-usm-tele | 3 | PASS: waveMtf.maxAbs 1.09e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.42e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.52e-10 (1 of 3) |
| catalog-canon-ef-28-200mm-f35-56-usm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-200mm-f35-56-usm-tele | 3 | PASS: waveMtf.maxAbs 4.50e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.66e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.68e-10 (1 of 3) |
| catalog-canon-ef-28-70mm-f35-45-ii-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-70mm-f35-45-ii-tele | 3 | PASS: waveMtf.maxAbs 1.14e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.45e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.81e-11 (1 of 3) |
| catalog-canon-ef-28-80mm-f35-56-ii-wide | 3 | PASS: waveMtf.maxAbs 1.46e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.07e-11 (1 of 3) |
| catalog-canon-ef-28-80mm-f35-56-ii-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-wide | 3 | PASS: waveMtf.maxAbs 1.73e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.22e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.13e-11 (1 of 3) |
| catalog-canon-ef-28-90mm-f4-56-ii-usm-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-28mm-f2-8 | 3 | PASS: waveMtf.maxAbs 1.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.09e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.17e-10 (1 of 3) |
| catalog-canon-ef-28mm-f28-is-usm | 3 | PASS: waveMtf.maxAbs 1.17e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.51e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.52e-11 (1 of 3) |
| catalog-canon-ef-300mm-f28l-is-usm | 3 | PASS: waveMtf.maxAbs 4.92e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.38e-11 (3 of 3) |
| catalog-canon-ef-35mm-f14l-ii-usm | 3 | PASS: waveMtf.maxAbs 1.30e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.05e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.08e-10 (1 of 3) |
| catalog-canon-ef-35mm-f14l-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-35mm-f2-is-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-40-f28-stm | 3 | PASS: waveMtf.maxAbs 8.27e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.33e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.18e-11 (1 of 3) |
| catalog-canon-ef-400mm-f28-l-is-ii-usm | 3 | PASS: waveMtf.maxAbs 8.00e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.18e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.53e-11 (2 of 3) |
| catalog-canon-ef-400mm-f28l-is-iii-usm | 3 | PASS: waveMtf.maxAbs 6.83e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.99e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (3 of 3) |
| catalog-canon-ef-400mm-f28l-is-usm | 3 | PASS: waveMtf.maxAbs 8.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.17e-11 (3 of 3) |
| catalog-canon-ef-500mm-f4l-is-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-50f10l | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-50mm-f1p2l-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-600f4l-is-ii-usm | 3 | PASS: waveMtf.maxAbs 4.87e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.11e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.02e-11 (2 of 3) |
| catalog-canon-ef-600f4l-is-iii-usm | 3 | PASS: waveMtf.maxAbs 7.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.08e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) |
| catalog-canon-ef-600mm-f4l-is-usm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-70-200f28l-is-usm-wide | 3 | PASS: waveMtf.maxAbs 8.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.00e-11 (2 of 3) |
| catalog-canon-ef-70-200f28l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 4.51e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.24e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.40e-11 (1 of 3) |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ef-70-200mm-f28l-is-ii-usm-tele | 3 | PASS: waveMtf.maxAbs 3.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.49e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.17e-11 (3 of 3) |
| catalog-canon-ef-70-200mm-f4-l-usm-wide | 3 | PASS: waveMtf.maxAbs 1.43e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.84e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (1 of 3) |
| catalog-canon-ef-70-200mm-f4-l-usm-tele | 3 | PASS: waveMtf.maxAbs 2.46e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.50e-11 (3 of 3) |
| catalog-canon-ef-70-200mm-f4l-is-usm-wide | 3 | PASS: waveMtf.maxAbs 2.31e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.54e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.04e-11 (1 of 3) |
| catalog-canon-ef-70-200mm-f4l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 4.65e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.07e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.67e-11 (1 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-wide | 3 | PASS: waveMtf.maxAbs 6.59e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.94e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.20e-11 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-ii-usm-tele | 3 | PASS: waveMtf.maxAbs 2.52e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.68e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.80e-11 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-usm-wide | 3 | PASS: waveMtf.maxAbs 2.33e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.32e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.20e-11 (1 of 3) |
| catalog-canon-ef-70-300mm-f4-56-is-usm-tele | 3 | PASS: waveMtf.maxAbs 6.47e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.94e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.06e-11 (3 of 3) |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-wide | 3 | PASS: waveMtf.maxAbs 4.79e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.08e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.25e-11 (2 of 3) |
| catalog-canon-ef-70-300mm-f4-56l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 6.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.55e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.28e-11 (3 of 3) |
| catalog-canon-ef-75-300mm-f4-56-is-usm-wide | 3 | PASS: waveMtf.maxAbs 2.04e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.98e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.61e-11 (1 of 3) |
| catalog-canon-ef-75-300mm-f4-56-is-usm-tele | 3 | PASS: waveMtf.maxAbs 3.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.37e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.52e-11 (2 of 3) |
| catalog-canon-ef-85mm-f18-usm | 3 | PASS: waveMtf.maxAbs 7.11e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.48e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.07e-11 (1 of 3) |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-wide | 3 | PASS: waveMtf.maxAbs 6.37e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.14e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.23e-10 (2 of 3) |
| catalog-canon-ef-m-11-22mm-f4-5-6-is-stm-tele | 3 | PASS: waveMtf.maxAbs 1.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.22e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.32e-10 (2 of 3) |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-wide | 3 | PASS: waveMtf.maxAbs 3.82e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.20e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.16e-10 (1 of 3) |
| catalog-canon-ef-m-15-45mm-f35-63-is-stm-tele | 3 | PASS: waveMtf.maxAbs 5.36e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.85e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.89e-10 (2 of 3) |
| catalog-canon-ef-m-18-55-f35-56-is-stm-wide | 3 | PASS: waveMtf.maxAbs 7.35e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.56e-10 (1 of 3) |
| catalog-canon-ef-m-18-55-f35-56-is-stm-tele | 3 | PASS: waveMtf.maxAbs 3.34e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.87e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.18e-10 (3 of 3) |
| catalog-canon-ef-m-32mm-f14-stm | 3 | PASS: waveMtf.maxAbs 6.27e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.12e-11 (2 of 3) |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-wide | 3 | PASS: waveMtf.maxAbs 2.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.84e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.82e-10 (2 of 3) |
| catalog-canon-ef-s-18-135mm-f35-56-is-stm-tele | 3 | PASS: waveMtf.maxAbs 2.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.23e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.26e-10 (3 of 3) |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-wide | 3 | PASS: waveMtf.maxAbs 2.86e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (2 of 3) |
| catalog-canon-ef-s-18-55mm-f3p5-5p6-tele | 3 | PASS: waveMtf.maxAbs 1.70e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.15e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.10e-10 (2 of 3) |
| catalog-canon-ef-s-55-250-f4-56-is-wide | 3 | PASS: waveMtf.maxAbs 2.75e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.39e-11 (3 of 3) |
| catalog-canon-ef-s-55-250-f4-56-is-tele | 3 | PASS: waveMtf.maxAbs 1.24e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.67e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.17e-11 (2 of 3) |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-wide | 3 | PASS: waveMtf.maxAbs 2.50e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.30e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.80e-11 (2 of 3) |
| catalog-canon-ef-s-55-250mm-f4-5-6-is-stm-tele | 3 | PASS: waveMtf.maxAbs 3.14e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.88e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.41e-11 (2 of 3) |
| catalog-canon-efm-22mm-f2-stm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-efm-28mm-f35-macro-is-stm | 3 | PASS: waveMtf.maxAbs 9.85e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.47e-11 (1 of 3) |
| catalog-canon-efs-10-18-f4556-is-stm-wide | 3 | PASS: waveMtf.maxAbs 8.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.08e-11 (3 of 3) |
| catalog-canon-efs-10-18-f4556-is-stm-tele | 3 | PASS: waveMtf.maxAbs 5.95e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.56e-11 (3 of 3) |
| catalog-canon-efs-10-22mm-f35-45-usm-wide | 3 | PASS: waveMtf.maxAbs 1.55e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.37e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.38e-10 (1 of 3) |
| catalog-canon-efs-10-22mm-f35-45-usm-tele | 3 | PASS: waveMtf.maxAbs 2.67e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.32e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.31e-10 (1 of 3) |
| catalog-canon-efs-17-55-f28-is-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-efs-17-55-f28-is-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-efs-17-85mm-f4-5-6-is-usm-tele | 3 | PASS: waveMtf.maxAbs 5.90e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.26e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.75e-10 (2 of 3) |
| catalog-canon-efs-18-55mm-f35-56-is-wide | 3 | PASS: waveMtf.maxAbs 3.42e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.56e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.63e-10 (3 of 3) |
| catalog-canon-efs-18-55mm-f35-56-is-tele | 3 | PASS: waveMtf.maxAbs 8.19e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.66e-11 (1 of 3) |
| catalog-canon-efs-24-f28-stm | 3 | PASS: waveMtf.maxAbs 1.20e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.39e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.39e-10 (2 of 3) |
| catalog-canon-fd-150-600mm-f56-l-wide | 3 | PASS: waveMtf.maxAbs 4.31e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.01e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.88e-11 (2 of 3) |
| catalog-canon-fd-150-600mm-f56-l-tele | 3 | PASS: waveMtf.maxAbs 4.50e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.62e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.51e-11 (3 of 3) |
| catalog-canon-fd-24mm-f28-ssc | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-fd-28mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-fd-300mm-f4-ssc | 3 | PASS: waveMtf.maxAbs 1.09e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.08e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.49e-11 (1 of 3) |
| catalog-canon-fd-35-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-fd-50f1p2-l | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-fdn-50f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-fl-300mm-f28-ssc-fluorite | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-fl-85-300mm-f5-wide | 3 | PASS: waveMtf.maxAbs 3.98e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.24e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.88e-11 (1 of 3) |
| catalog-canon-fl-85-300mm-f5-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-new-fd-100mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-new-fd-14mm-f28-l | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-new-fd-35-105mm-f35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-new-fd-35-105mm-f35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-powershot-g1-x-mark-ii-125-625-f20-39-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-powershot-g1x-1560-f28-wide | 2 | PASS: waveMtf.maxAbs 1.81e-11 (1 of 2) | PASS: waveMtf.maxAbs 7.19e-10 (1 of 2) | PASS: waveMtf.maxAbs 7.31e-10 (1 of 2) |
| catalog-canon-powershot-g1x-1560-f28-tele | 3 | PASS: waveMtf.maxAbs 1.81e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.24e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.42e-10 (2 of 3) |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-wide | 3 | PASS: waveMtf.maxAbs 5.61e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.84e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.89e-10 (1 of 3) |
| catalog-canon-powershot-g1x-iii-15-45-f28-56-tele | 3 | PASS: waveMtf.maxAbs 1.53e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.60e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.56e-10 (2 of 3) |
| catalog-canon-powershot-g3x-wide | 2 | PASS: waveMtf.maxAbs 1.61e-11 (2 of 2) | PASS: waveMtf.maxAbs 3.37e-10 (2 of 2) | PASS: waveMtf.maxAbs 3.52e-10 (2 of 2) |
| catalog-canon-powershot-g3x-tele | 3 | PASS: waveMtf.maxAbs 2.71e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.98e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.04e-10 (3 of 3) |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-wide | 2 | PASS: waveMtf.maxAbs 1.32e-11 (2 of 2) | PASS: waveMtf.maxAbs 6.00e-10 (2 of 2) | PASS: waveMtf.maxAbs 6.13e-10 (2 of 2) |
| catalog-canon-powershot-g7x-8-8-36-8-f1-8-2-8-tele | 3 | PASS: waveMtf.maxAbs 4.65e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.43e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.47e-10 (3 of 3) |
| catalog-canon-powershot-g9x-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-powershot-g9x-tele | 3 | PASS: waveMtf.maxAbs 8.68e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.06e-10 (3 of 3) |
| catalog-canon-r-58mm-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-10-20-f4-l-is-stm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-10-20-f4-l-is-stm-tele | 3 | PASS: waveMtf.maxAbs 2.28e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.54e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.66e-10 (2 of 3) |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-wide | 3 | PASS: waveMtf.maxAbs 5.30e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.46e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.48e-11 (2 of 3) |
| catalog-canon-rf-100-500mm-f45-71-l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 2.85e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.82e-11 (3 of 3) |
| catalog-canon-rf-135f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-14-35mm-f4-l-is-usm-wide | 2 | PASS: waveMtf.maxAbs 2.79e-11 (2 of 2) | PASS: waveMtf.maxAbs 2.58e-10 (2 of 2) | PASS: waveMtf.maxAbs 2.30e-10 (2 of 2) |
| catalog-canon-rf-14-35mm-f4-l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 1.32e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.11e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (2 of 3) |
| catalog-canon-rf-14mm-f14-l-vcm | 3 | PASS: waveMtf.maxAbs 1.06e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.44e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.85e-11 (1 of 3) |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-wide | 2 | PASS: waveMtf.maxAbs 1.68e-11 (2 of 2) | PASS: waveMtf.maxAbs 2.88e-10 (2 of 2) | PASS: waveMtf.maxAbs 2.98e-10 (2 of 2) |
| catalog-canon-rf-15-30mm-f4-5-6-3-is-stm-tele | 3 | PASS: waveMtf.maxAbs 2.56e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.67e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.64e-10 (2 of 3) |
| catalog-canon-rf-15-35-f28-wide | 3 | PASS: waveMtf.maxAbs 4.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.49e-10 (2 of 3) |
| catalog-canon-rf-15-35-f28-tele | 3 | PASS: waveMtf.maxAbs 2.09e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.31e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.30e-10 (2 of 3) |
| catalog-canon-rf-16-28mm-f28-is-stm-wide | 2 | PASS: waveMtf.maxAbs 1.44e-11 (1 of 2) | PASS: waveMtf.maxAbs 3.05e-10 (1 of 2) | PASS: waveMtf.maxAbs 3.20e-10 (1 of 2) |
| catalog-canon-rf-16-28mm-f28-is-stm-tele | 3 | PASS: waveMtf.maxAbs 2.29e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.61e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.61e-10 (2 of 3) |
| catalog-canon-rf-16mm-f28-stm | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-200-800-f63-9-is-usm-wide | 3 | PASS: waveMtf.maxAbs 9.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.90e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.85e-11 (3 of 3) |
| catalog-canon-rf-200-800-f63-9-is-usm-tele | 3 | PASS: waveMtf.maxAbs 9.07e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.15e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.95e-11 (3 of 3) |
| catalog-canon-rf-20mm-f14-l-vcm | 3 | PASS: waveMtf.maxAbs 9.38e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.77e-12 (1 of 3) |
| catalog-canon-rf-24-105-f4-l-wide | 3 | PASS: waveMtf.maxAbs 1.19e-9 (2 of 3) | PASS: waveMtf.maxAbs 9.47e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.57e-10 (2 of 3) |
| catalog-canon-rf-24-105-f4-l-tele | 3 | PASS: waveMtf.maxAbs 1.11e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.28e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.73e-11 (1 of 3) |
| catalog-canon-rf-24-105mm-f4-71-is-stm-wide | 2 | PASS: waveMtf.maxAbs 2.44e-11 (2 of 2) | PASS: waveMtf.maxAbs 2.86e-10 (2 of 2) | PASS: waveMtf.maxAbs 2.91e-10 (2 of 2) |
| catalog-canon-rf-24-105mm-f4-71-is-stm-tele | 3 | PASS: waveMtf.maxAbs 1.73e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.16e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.75e-11 (1 of 3) |
| catalog-canon-rf-24-50-f45-63-wide | 2 | PASS: waveMtf.maxAbs 2.17e-11 (1 of 2) | PASS: waveMtf.maxAbs 5.08e-10 (1 of 2) | PASS: waveMtf.maxAbs 5.10e-10 (1 of 2) |
| catalog-canon-rf-24-50-f45-63-tele | 3 | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.93e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.94e-10 (3 of 3) |
| catalog-canon-rf-24-70-f28-wide | 3 | PASS: waveMtf.maxAbs 1.17e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.45e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.58e-10 (3 of 3) |
| catalog-canon-rf-24-70-f28-tele | 3 | PASS: waveMtf.maxAbs 8.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.65e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (3 of 3) |
| catalog-canon-rf-24mm-f14-l-vcm | 2 | PASS: waveMtf.maxAbs 8.97e-12 (1 of 2) | PASS: waveMtf.maxAbs 5.22e-11 (1 of 2) | PASS: waveMtf.maxAbs 5.28e-11 (1 of 2) |
| catalog-canon-rf-28-70-f2-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-28-70-f2-tele | 3 | PASS: waveMtf.maxAbs 4.16e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.29e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.90e-10 (1 of 3) |
| catalog-canon-rf-28-70-f28-is-stm-wide | 3 | PASS: waveMtf.maxAbs 1.74e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.97e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (1 of 3) |
| catalog-canon-rf-28-70-f28-is-stm-tele | 3 | PASS: waveMtf.maxAbs 2.42e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.59e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.82e-10 (2 of 3) |
| catalog-canon-rf-35mm-f14-l-vcm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-35mm-f18-macro-is-stm | 3 | PASS: waveMtf.maxAbs 7.85e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.54e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.97e-11 (1 of 3) |
| catalog-canon-rf-50-f12-l | 3 | PASS: waveMtf.maxAbs 9.12e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) |
| catalog-canon-rf-50mm-f1-8-stm | 3 | PASS: waveMtf.maxAbs 1.30e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.30e-10 (1 of 3) |
| catalog-canon-rf-50mm-f14-l-vcm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-70-200-f28-wide | 3 | PASS: waveMtf.maxAbs 2.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.56e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.29e-10 (3 of 3) |
| catalog-canon-rf-70-200-f28-tele | 3 | PASS: waveMtf.maxAbs 4.79e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.73e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.01e-10 (2 of 3) |
| catalog-canon-rf-85f12l | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-rf-85f2-macro | 3 | PASS: waveMtf.maxAbs 1.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.36e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (2 of 3) |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-wide | 3 | PASS: waveMtf.maxAbs 2.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.29e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.37e-10 (2 of 3) |
| catalog-canon-rf-s14-30f4-63-is-stm-pz-tele | 3 | PASS: waveMtf.maxAbs 7.52e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.48e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.52e-10 (2 of 3) |
| catalog-canon-rf100f28-macro | 3 | PASS: waveMtf.maxAbs 1.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.88e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.53e-11 (2 of 3) |
| catalog-canon-rf24-105f28z-wide | 3 | PASS: waveMtf.maxAbs 3.18e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.94e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (2 of 3) |
| catalog-canon-rf24-105f28z-tele | 3 | PASS: waveMtf.maxAbs 1.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.56e-10 (3 of 3) |
| catalog-canon-rf24-240-f4-63-wide | 2 | PASS: waveMtf.maxAbs 3.24e-11 (1 of 2) | PASS: waveMtf.maxAbs 6.36e-11 (1 of 2) | PASS: waveMtf.maxAbs 5.76e-11 (1 of 2) |
| catalog-canon-rf24-240-f4-63-tele | 3 | PASS: waveMtf.maxAbs 2.93e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.51e-11 (2 of 3) |
| catalog-canon-rf70-200mm-f4-l-is-usm-wide | 3 | PASS: waveMtf.maxAbs 3.75e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.68e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.93e-11 (2 of 3) |
| catalog-canon-rf70-200mm-f4-l-is-usm-tele | 3 | PASS: waveMtf.maxAbs 2.61e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.12e-11 (1 of 3) |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-wide | 2 | PASS: waveMtf.maxAbs 5.41e-12 (1 of 2) | PASS: waveMtf.maxAbs 8.77e-11 (1 of 2) | PASS: waveMtf.maxAbs 9.25e-11 (1 of 2) |
| catalog-canon-rfs-18-45mm-f45-63-is-stm-tele | 3 | PASS: waveMtf.maxAbs 4.77e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.20e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (3 of 3) |
| catalog-canon-s-50mm-f2-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-serenar-100mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-serenar-28f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-serenar-35f32 | 3 | PASS: waveMtf.maxAbs 4.96e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.53e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.26e-12 (1 of 3) |
| catalog-canon-serenar-50f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-serenar-85f15 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-canon-ts-e-24mm-f35l-ii | 3 | PASS: waveMtf.maxAbs 3.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.83e-10 (2 of 3) |
| catalog-canon-tse-135mm-f4l | 3 | PASS: waveMtf.maxAbs 1.95e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.75e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.41e-11 (3 of 3) |
| catalog-canon-tse-50f28l-macro | 3 | PASS: waveMtf.maxAbs 1.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.35e-11 (2 of 3) |
| catalog-canon-tse-90mm-f28l-macro | 3 | PASS: waveMtf.maxAbs 1.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.80e-11 (3 of 3) |
| catalog-carl-zeiss-biogon-35f28-contax | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-contarex-planar-55f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-distagon-t-25f28-contax | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-jena-biometar-120f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-jena-biometar-80f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-jena-pancolar-50f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-jena-pi-flektogon-30mm-f28-printed-1975-eline | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-planar-80mm-f28-graflex-xl | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-tele-tessar-500mm-f8-c | 3 | PASS: waveMtf.maxAbs 2.36e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.68e-11 (2 of 3) |
| catalog-carl-zeiss-tessar-50f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-wide | 3 | PASS: waveMtf.maxAbs 3.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.06e-11 (1 of 3) |
| catalog-carl-zeiss-vario-sonnar-70-210mm-f35-tele | 3 | PASS: waveMtf.maxAbs 4.86e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.34e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.73e-11 (1 of 3) |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-wide | 3 | PASS: waveMtf.maxAbs 1.61e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.62e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.79e-10 (1 of 3) |
| catalog-carl-zeiss-vario-sonnar-t-143-715mm-f28-48-sony-dsc-r1-tele | 3 | PASS: waveMtf.maxAbs 2.33e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.88e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.88e-10 (2 of 3) |
| catalog-color-skopar-28f28 | 3 | PASS: waveMtf.maxAbs 3.52e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.81e-10 (1 of 3) |
| catalog-czj-flektogon-20-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-czj-tessar-50-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-elmarit-r-28f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-enna-munchen-lithagon-24mm-f4 | 3 | PASS: waveMtf.maxAbs 6.83e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.44e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.71e-11 (1 of 3) |
| catalog-enna-munchen-lithagon-35mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-enna-munchen-ultra-lithagon-28mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fuji-xf-16-55-f28-wide | 3 | PASS: waveMtf.maxAbs 5.09e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.26e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.36e-10 (3 of 3) |
| catalog-fuji-xf-16-55-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fuji-xf-50140mm-f28-wide | 3 | PASS: waveMtf.maxAbs 2.58e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.30e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.01e-11 (1 of 3) |
| catalog-fuji-xf-50140mm-f28-tele | 3 | PASS: waveMtf.maxAbs 7.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.64e-11 (3 of 3) |
| catalog-fujifilm-fujinar-210mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-85mm-f4-sf-ebc | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-gf-30mm-f35-r-wr | 3 | PASS: waveMtf.maxAbs 1.83e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.16e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.55e-10 (2 of 3) |
| catalog-fujifilm-fujinon-gf-500mm-f56-r-lm-ois-wr | 3 | PASS: waveMtf.maxAbs 3.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.85e-11 (3 of 3) |
| catalog-fujifilm-fujinon-gf-50mm-f35-r-lm-wr | 3 | PASS: waveMtf.maxAbs 9.02e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.25e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.25e-10 (2 of 3) |
| catalog-fujifilm-fujinon-gf-63mm-f28-r-wr | 3 | PASS: waveMtf.maxAbs 8.81e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.22e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (1 of 3) |
| catalog-fujifilm-fujinon-sw-65f56 | 3 | PASS: waveMtf.maxAbs 1.17e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.98e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.29e-11 (2 of 3) |
| catalog-fujifilm-fujinon-w-35mm-f19 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-wide | 3 | PASS: waveMtf.maxAbs 2.83e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.18e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.75e-10 (1 of 3) |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-tele | 3 | PASS: waveMtf.maxAbs 1.53e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.76e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.68e-10 (3 of 3) |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-wide | 3 | PASS: waveMtf.maxAbs 1.63e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.12e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.27e-10 (1 of 3) |
| catalog-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-wide | 3 | PASS: waveMtf.maxAbs 1.23e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.07e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.12e-10 (1 of 3) |
| catalog-fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-wide | 3 | PASS: waveMtf.maxAbs 1.74e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.98e-11 (2 of 3) |
| catalog-fujifilm-fujinon-xc-50-230mm-f45-67-ois-ii-tele | 3 | PASS: waveMtf.maxAbs 5.08e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.50e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.93e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-wide | 3 | PASS: waveMtf.maxAbs 4.81e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.83e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.90e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-10-24mm-f4-r-ois-tele | 3 | PASS: waveMtf.maxAbs 2.67e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.52e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.26e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-wide | 3 | PASS: waveMtf.maxAbs 3.15e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.80e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.62e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-100-400mm-f45-56-r-lm-ois-wr-tele | 3 | PASS: waveMtf.maxAbs 3.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.83e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.43e-11 (3 of 3) |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | 3 | PASS: waveMtf.maxAbs 1.91e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.06e-10 (2 of 3) | PASS: waveMtf.maxAbs 9.73e-11 (2 of 3) |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-wide | 3 | PASS: waveMtf.maxAbs 7.33e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.26e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.10e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-16-50mm-f28-48-r-lm-wr-tele | 3 | PASS: waveMtf.maxAbs 5.35e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.44e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.31e-10 (3 of 3) |
| catalog-fujifilm-fujinon-xf-16mm-f14-r-wr | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xf-16mm-f28-r-wr | 3 | PASS: waveMtf.maxAbs 4.08e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.76e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.47e-11 (2 of 3) |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-wide | 3 | PASS: waveMtf.maxAbs 3.57e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.54e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-tele | 3 | PASS: waveMtf.maxAbs 1.64e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.19e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-wide | 3 | PASS: waveMtf.maxAbs 1.83e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.12e-9 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-9 (1 of 3) |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-tele | 3 | PASS: waveMtf.maxAbs 1.79e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.14e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.14e-10 (3 of 3) |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xf-18-55-f28-4-r-lm-ois-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xf-18mm-f14-r-lm-wr | 3 | PASS: waveMtf.maxAbs 2.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.20e-10 (1 of 3) |
| catalog-fujifilm-fujinon-xf-27mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro | 3 | PASS: waveMtf.maxAbs 3.88e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.00e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.96e-10 (1 of 3) |
| catalog-fujifilm-fujinon-xf-35mm-f2-r-wr | 3 | PASS: waveMtf.maxAbs 1.09e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.55e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.63e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-50mm-f2-r-wr | 3 | PASS: waveMtf.maxAbs 1.32e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.90e-11 (2 of 3) |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-wide | 3 | PASS: waveMtf.maxAbs 2.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.67e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.76e-11 (2 of 3) |
| catalog-fujifilm-fujinon-xf-70-300mm-f4-56-r-lm-ois-wr-tele | 3 | PASS: waveMtf.maxAbs 3.04e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.41e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.02e-11 (2 of 3) |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | 3 | PASS: waveMtf.maxAbs 1.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.89e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.38e-10 (2 of 3) |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-xf-8mm-f35-r-wr | 3 | PASS: waveMtf.maxAbs 6.23e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.48e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.76e-10 (2 of 3) |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-fujinon-z-43-75mm-f35-45-tele | 3 | PASS: waveMtf.maxAbs 1.12e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.17e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (1 of 3) |
| catalog-fujifilm-ga645-pro-60mm-f4 | 3 | PASS: waveMtf.maxAbs 7.54e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.35e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.10e-12 (2 of 3) |
| catalog-fujifilm-ga645widepro-45mm-f4 | 3 | PASS: waveMtf.maxAbs 8.90e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.61e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.76e-12 (1 of 3) |
| catalog-fujifilm-gf-100-200mm-f56-wide | 3 | PASS: waveMtf.maxAbs 1.74e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.00e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.60e-10 (2 of 3) |
| catalog-fujifilm-gf-100-200mm-f56-tele | 3 | PASS: waveMtf.maxAbs 1.85e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.30e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.58e-10 (2 of 3) |
| catalog-fujifilm-gf-110mm-f2 | 3 | PASS: waveMtf.maxAbs 4.22e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.32e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.94e-12 (1 of 3) |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-wide | 3 | PASS: waveMtf.maxAbs 4.42e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.99e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.33e-10 (3 of 3) |
| catalog-fujifilm-gf-20-35mm-f4-r-wr-tele | 3 | PASS: waveMtf.maxAbs 1.94e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.64e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.82e-10 (3 of 3) |
| catalog-fujifilm-gf-23mm-f4 | 3 | PASS: waveMtf.maxAbs 3.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.35e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.04e-10 (2 of 3) |
| catalog-fujifilm-gf-30mm-f56-ts | 3 | PASS: waveMtf.maxAbs 2.92e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.15e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.57e-10 (3 of 3) |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-wide | 2 | PASS: waveMtf.maxAbs 3.06e-10 (2 of 2) | PASS: waveMtf.maxAbs 3.62e-10 (2 of 2) | PASS: waveMtf.maxAbs 2.06e-10 (2 of 2) |
| catalog-fujifilm-gf-32-64mm-f4-r-lm-wr-tele | 3 | PASS: waveMtf.maxAbs 1.78e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.12e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (1 of 3) |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-gf-35-70mm-f45-56-wr-tele | 3 | PASS: waveMtf.maxAbs 1.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.11e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.11e-10 (2 of 3) |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-wide | 3 | PASS: waveMtf.maxAbs 4.03e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.68e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.48e-10 (2 of 3) |
| catalog-fujifilm-gf-45-100mm-f4-patent-example-1-tele | 3 | PASS: waveMtf.maxAbs 3.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.08e-10 (1 of 3) |
| catalog-fujifilm-gf-45mm-f28-r-wr | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-gf250mm-f4-r-lm-ois-wr | 3 | PASS: waveMtf.maxAbs 2.59e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.72e-11 (3 of 3) |
| catalog-fujifilm-gf55mm-f17-r-wr | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-gf80-f17 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-gfx100rf-35mm-f4 | 3 | PASS: waveMtf.maxAbs 4.47e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.27e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.22e-10 (2 of 3) |
| catalog-fujifilm-natura-s-24mm-f19 | 3 | PASS: waveMtf.maxAbs 4.63e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.60e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.17e-11 (1 of 3) |
| catalog-fujifilm-x-fujinon-w-24mm-f28-dm-ebc | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-wide | 2 | PASS: waveMtf.maxAbs 1.33e-11 (2 of 2) | PASS: waveMtf.maxAbs 3.18e-10 (2 of 2) | PASS: waveMtf.maxAbs 3.18e-10 (2 of 2) |
| catalog-fujifilm-x10-7-1-28-4-f2-2-8-tele | 3 | PASS: waveMtf.maxAbs 1.59e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.08e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.12e-10 (2 of 3) |
| catalog-fujifilm-x100-23f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-x100-tcl-x100 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-x100v-23f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-x70-18mm-f28 | 3 | PASS: waveMtf.maxAbs 8.20e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.37e-10 (1 of 3) | PASS: waveMtf.maxAbs 6.60e-10 (1 of 3) |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-wide | 3 | PASS: waveMtf.maxAbs 3.70e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.01e-9 (1 of 3) | PASS: waveMtf.maxAbs 9.68e-10 (1 of 3) |
| catalog-fujifilm-xf-16-55mm-f28-r-lm-wr-ii-tele | 3 | PASS: waveMtf.maxAbs 3.31e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.91e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.59e-10 (1 of 3) |
| catalog-fujifilm-xf-16-80-f4-wide | 3 | PASS: waveMtf.maxAbs 1.61e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.26e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.29e-10 (2 of 3) |
| catalog-fujifilm-xf-16-80-f4-tele | 3 | PASS: waveMtf.maxAbs 7.35e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.82e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.00e-10 (1 of 3) |
| catalog-fujifilm-xf-200-f2 | 3 | PASS: waveMtf.maxAbs 3.64e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.52e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.57e-11 (3 of 3) |
| catalog-fujifilm-xf-23mm-f14-r-lm-wr | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-xf-23mm-f2-r-wr | 3 | PASS: waveMtf.maxAbs 1.10e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.57e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.81e-10 (1 of 3) |
| catalog-fujifilm-xf-23mm-f28-r-wr | 3 | PASS: waveMtf.maxAbs 1.48e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.13e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (1 of 3) |
| catalog-fujifilm-xf-33mm-f14-r-lm-wr | 3 | PASS: waveMtf.maxAbs 4.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.16e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (1 of 3) |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-wide | 3 | PASS: waveMtf.maxAbs 2.65e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.10e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.80e-11 (2 of 3) |
| catalog-fujifilm-xf-55-200mm-f35-48-r-lm-ois-tele | 3 | PASS: waveMtf.maxAbs 2.42e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.10e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.00e-11 (2 of 3) |
| catalog-fujifilm-xf18f2r | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-xf35-f14-r | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-xf50-f1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-xf56mm-f12-r-wr | 3 | PASS: waveMtf.maxAbs 7.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.13e-10 (1 of 3) |
| catalog-fujifilm-xf60-f24-r-macro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujifilm-xf80-f28-macro | 3 | PASS: waveMtf.maxAbs 2.04e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.43e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.45e-10 (2 of 3) |
| catalog-fujifilm-xf90f2 | 3 | PASS: waveMtf.maxAbs 8.82e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.70e-11 (2 of 3) |
| catalog-fujinon-xf-23mm-f14-r | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-fujinon-xf56f12r | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-gf-120f4-macro | 3 | PASS: waveMtf.maxAbs 2.31e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.28e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (1 of 3) |
| catalog-hasselblad-hc-150-f32 | 3 | PASS: waveMtf.maxAbs 2.07e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.55e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.51e-11 (2 of 3) |
| catalog-hasselblad-hc-210-f4 | 3 | PASS: waveMtf.maxAbs 2.78e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.75e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.68e-11 (1 of 3) |
| catalog-hasselblad-hc-300-f4p5 | 3 | PASS: waveMtf.maxAbs 2.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.29e-11 (1 of 3) |
| catalog-hasselblad-hc-35mm-f35-fujinon | 3 | PASS: waveMtf.maxAbs 4.84e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.38e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.54e-11 (2 of 3) |
| catalog-hasselblad-hc-50-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-hasselblad-hc-50f35-ii | 3 | PASS: waveMtf.maxAbs 3.79e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.53e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.10e-11 (1 of 3) |
| catalog-hasselblad-hc-80-f28 | 3 | PASS: waveMtf.maxAbs 2.70e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.89e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.06e-11 (1 of 3) |
| catalog-hasselblad-hc-macro-4-120 | 3 | PASS: waveMtf.maxAbs 1.15e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.58e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.10e-11 (2 of 3) |
| catalog-hasselblad-xcd-120-f35-macro | 3 | PASS: waveMtf.maxAbs 2.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.10e-11 (3 of 3) |
| catalog-hasselblad-xcd-25mm-f25-v | 3 | PASS: waveMtf.maxAbs 4.50e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.48e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.26e-10 (3 of 3) |
| catalog-hasselblad-xcd-30mm-f35 | 3 | PASS: waveMtf.maxAbs 1.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.84e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.56e-11 (1 of 3) |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-wide | 3 | PASS: waveMtf.maxAbs 1.87e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.38e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.18e-10 (1 of 3) |
| catalog-hasselblad-xcd-35-100mm-f28-4-e-tele | 3 | PASS: waveMtf.maxAbs 4.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.78e-10 (3 of 3) |
| catalog-hasselblad-xcd-45f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-hasselblad-xcd-65-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-hasselblad-xcd-90-f25-v | 3 | PASS: waveMtf.maxAbs 1.31e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.75e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.92e-11 (1 of 3) |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-wide | 3 | PASS: waveMtf.maxAbs 7.33e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.16e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.86e-11 (2 of 3) |
| catalog-hd-pentax-d-fa-150-450-f45-56-ed-dc-aw-tele | 3 | PASS: waveMtf.maxAbs 2.64e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.86e-11 (2 of 3) |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-wide | 3 | PASS: waveMtf.maxAbs 1.81e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.76e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.88e-10 (3 of 3) |
| catalog-hd-pentax-da-16-85mm-f35-56-ed-dc-wr-tele | 3 | PASS: waveMtf.maxAbs 2.75e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.39e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.41e-10 (3 of 3) |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-wide | 3 | PASS: waveMtf.maxAbs 7.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.75e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.70e-11 (2 of 3) |
| catalog-hd-pentax-da645-28-45mm-f45-ed-aw-sr-tele | 3 | PASS: waveMtf.maxAbs 1.93e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.41e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.39e-10 (2 of 3) |
| catalog-heliar-symmetric-1902 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-industar-itmo2013-v2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-kinoptik-super-tegea-19mm-f19-fisheye | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-kinoptik-tegea-57mm-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-kinoptik-tegea-98mm-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-kodak-aero-ektar-6in-f35 | 3 | PASS: waveMtf.maxAbs 2.74e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.93e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.60e-11 (1 of 3) |
| catalog-kodak-ektar-50f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-kodak-ektar-52f15 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-kodak-enlarging-ektar-100mm-f45 | 3 | PASS: waveMtf.maxAbs 1.93e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.86e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.73e-11 (1 of 3) |
| catalog-kodak-wide-field-ektar-100f63 | 3 | PASS: waveMtf.maxAbs 5.55e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.96e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.11e-12 (1 of 3) |
| catalog-konica-fl-hexanon-ar-300mm-f63 | 3 | PASS: waveMtf.maxAbs 1.70e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.16e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.55e-12 (2 of 3) |
| catalog-konica-hexanon-135mm-f35 | 3 | PASS: waveMtf.maxAbs 1.75e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.80e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.12e-11 (1 of 3) |
| catalog-konica-hexanon-38mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexanon-60f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexanon-ar-135mm-f3-5 | 3 | PASS: waveMtf.maxAbs 7.70e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.37e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.75e-12 (1 of 3) |
| catalog-konica-hexanon-ar-21mm-f2-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexanon-ar-24mm-f2-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexanon-ar-35mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexanon-ar-40mm-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexanon-ar-50mm-f1-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-hexar-35f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-uc-hexanon-ar-28mm-f1-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-uc-zoom-hexanon-ar-45-100mm-f35-tele | 3 | PASS: waveMtf.maxAbs 1.92e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.92e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.55e-11 (1 of 3) |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-uc-zoom-hexanon-ar-80-200-f4-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-varifocal-hexanon-ar-35-100-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-wide | 3 | PASS: waveMtf.maxAbs 2.00e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.27e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.95e-11 (1 of 3) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f3-5-tele | 3 | PASS: waveMtf.maxAbs 1.51e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.58e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.73e-12 (1 of 3) |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-konica-zoom-hexanon-ar-35-70mm-f4-tele | 3 | PASS: waveMtf.maxAbs 5.14e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.41e-11 (1 of 3) |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-wide | 3 | PASS: waveMtf.maxAbs 2.34e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.87e-11 (3 of 3) |
| catalog-konica-zoom-hexanon-ar-65-135mm-f4-tele | 3 | PASS: waveMtf.maxAbs 1.73e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.35e-11 (2 of 3) |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-wide | 3 | PASS: waveMtf.maxAbs 9.71e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.49e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.24e-11 (1 of 3) |
| catalog-konica-zoom-hexanon-ar-70-150mm-f4-tele | 3 | PASS: waveMtf.maxAbs 2.23e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.26e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.75e-11 (2 of 3) |
| catalog-laowa-100mm-f28-tilt-shift-1x-macro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-laowa-105mm-f2-stf | 3 | PASS: waveMtf.maxAbs 2.59e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.56e-11 (1 of 3) |
| catalog-laowa-12mm-f28-zero-d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-laowa-15f4-macro | 3 | PASS: waveMtf.maxAbs 1.17e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.25e-12 (1 of 3) |
| catalog-laowa-15mm-f2-zero-d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-laowa-180mm-f45-ultra-macro-apo | 3 | PASS: waveMtf.maxAbs 3.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.26e-11 (3 of 3) |
| catalog-laowa-180mm-f45-ultra-macro-apo-af | 3 | PASS: waveMtf.maxAbs 3.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.26e-11 (3 of 3) |
| catalog-laowa-24f14-probe | 3 | PASS: waveMtf.maxAbs 2.44e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.84e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.62e-11 (1 of 3) |
| catalog-laowa-55mm-f28-tilt-shift-1x-macro | 3 | PASS: waveMtf.maxAbs 2.25e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.17e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.29e-11 (1 of 3) |
| catalog-laowa-58mm-f28-2x-macro-apo | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-laowa-65mm-f28-macro-apo | 2 | PASS: waveMtf.maxAbs 2.38e-11 (2 of 2) | PASS: waveMtf.maxAbs 2.10e-11 (2 of 2) | PASS: waveMtf.maxAbs 1.48e-11 (2 of 2) |
| catalog-laowa-90mm-f28-ultra-macro-apo | 3 | PASS: waveMtf.maxAbs 6.73e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.40e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-11 (1 of 3) |
| catalog-laowa-argus-45mm-f095-ff | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-apo-macro-elmarit-tl-60-f28 | 3 | PASS: waveMtf.maxAbs 2.97e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.19e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.14e-11 (2 of 3) |
| catalog-leica-apo-summicron-43f2 | 2 | PASS: waveMtf.maxAbs 8.51e-12 (1 of 2) | PASS: waveMtf.maxAbs 4.47e-11 (1 of 2) | PASS: waveMtf.maxAbs 5.21e-11 (1 of 2) |
| catalog-leica-apo-summicron-m-35f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-wide | 3 | PASS: waveMtf.maxAbs 1.15e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.69e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.18e-11 (1 of 3) |
| catalog-leica-apo-vario-elmarit-sl-90-280-f28-4-tele | 3 | PASS: waveMtf.maxAbs 2.07e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.23e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.50e-11 (2 of 3) |
| catalog-leica-colorplan-90mm-f25 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-wide | 2 | PASS: waveMtf.maxAbs 3.02e-12 (2 of 2) | PASS: waveMtf.maxAbs 2.17e-10 (2 of 2) | PASS: waveMtf.maxAbs 2.20e-10 (2 of 2) |
| catalog-leica-dc-vario-elmarit-4p5-108mm-f28-panasonic-fz300-tele | 3 | PASS: waveMtf.maxAbs 3.97e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.62e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.90e-10 (3 of 3) |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-dc-vario-elmarit-fz2500-fz2000-fzh1-tele | 3 | PASS: waveMtf.maxAbs 5.87e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.78e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.11e-10 (2 of 3) |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-wide | 2 | PASS: waveMtf.maxAbs 1.06e-12 (1 of 2) | PASS: waveMtf.maxAbs 1.83e-10 (1 of 2) | PASS: waveMtf.maxAbs 1.83e-10 (1 of 2) |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-tele | 2 | PASS: waveMtf.maxAbs 1.00e-11 (1 of 2) | PASS: waveMtf.maxAbs 7.09e-11 (1 of 2) | PASS: waveMtf.maxAbs 7.45e-11 (1 of 2) |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-dc-vario-summilux-47-177mm-f14-23-panasonic-lx7-tele | 3 | PASS: waveMtf.maxAbs 4.38e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.22e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.18e-10 (1 of 3) |
| catalog-leica-elcan-50f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-elmar-35mm-f35-mini-ii | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-elmar-m-135mm-f4 | 3 | PASS: waveMtf.maxAbs 7.48e-12 (2 of 3) | PASS: waveMtf.maxAbs 7.97e-12 (2 of 3) | PASS: waveMtf.maxAbs 8.38e-12 (2 of 3) |
| catalog-leica-elmarit-28mm-f28-11801 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-elmarit-90f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-elmarit-m-135mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-elmarit-r-35mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-elmarit-tl-18mm-f28 | 3 | PASS: waveMtf.maxAbs 3.07e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (2 of 3) |
| catalog-leica-macro-elmar-m-90mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-macro-elmarit-r-60mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-noctilux-50mm-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-noctilux-m-35mm-f12-asph | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summicron-35mm-f2-i | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summicron-c-40mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summicron-m-50f2-v5 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summicron-r-50mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summicron-sl-50mm-f2-asph | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summilux-28f17 | 2 | PASS: waveMtf.maxAbs 2.99e-12 (1 of 2) | PASS: waveMtf.maxAbs 1.66e-10 (1 of 2) | PASS: waveMtf.maxAbs 1.63e-10 (1 of 2) |
| catalog-leica-summilux-c-100mm-t14 | 3 | PASS: waveMtf.maxAbs 3.59e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.96e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.23e-11 (1 of 3) |
| catalog-leica-summilux-c-18mm-t14 | 3 | PASS: waveMtf.maxAbs 1.77e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.22e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.71e-10 (3 of 3) |
| catalog-leica-summilux-c-40mm-t14 | 3 | PASS: waveMtf.maxAbs 5.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.19e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.12e-10 (3 of 3) |
| catalog-leica-summilux-m-35f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summilux-m-35mm-f14-aspherical | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summilux-m-50mm-f14-i | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summilux-m-50mm-f14-ii | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summilux-sl-50mm-f14-asph-i | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-summilux-tl-35mm-f14-asph | 3 | PASS: waveMtf.maxAbs 1.56e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.12e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.16e-10 (1 of 3) |
| catalog-leica-super-angulon-r-21mm-f4 | 3 | PASS: waveMtf.maxAbs 7.84e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.43e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.55e-12 (1 of 3) |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-wide | 3 | PASS: waveMtf.maxAbs 1.19e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.80e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.89e-10 (1 of 3) |
| catalog-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-tele | 3 | PASS: waveMtf.maxAbs 4.08e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.96e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.87e-11 (1 of 3) |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-wide | 2 | PASS: waveMtf.maxAbs 1.31e-11 (2 of 2) | PASS: waveMtf.maxAbs 1.86e-10 (2 of 2) | PASS: waveMtf.maxAbs 1.87e-10 (2 of 2) |
| catalog-leica-super-vario-elmar-tl-11-23mm-f35-45-asph-tele | 3 | PASS: waveMtf.maxAbs 7.41e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (1 of 3) |
| catalog-leica-telyt-200mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-leica-telyt-s-800mm-f63 | 3 | PASS: waveMtf.maxAbs 5.39e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.94e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.05e-10 (2 of 3) |
| catalog-lumix-s-20-60-f35-56-wide | 3 | PASS: waveMtf.maxAbs 1.03e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.47e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (2 of 3) |
| catalog-lumix-s-20-60-f35-56-tele | 3 | PASS: waveMtf.maxAbs 7.73e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.14e-10 (1 of 3) |
| catalog-mamiya-af-apo-300-f45-if | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-mamiya-n-210mm-f8-l | 3 | PASS: waveMtf.maxAbs 2.36e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.67e-11 (3 of 3) |
| catalog-mamiya-sekor-af-150mm-f28-if-d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-mamiya-sekor-af-55mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-mamiya-sekor-c-55mm-f2-8-n | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-mamiya-sekor-cs-35mm-f2-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-mamiya-sekor-macro-c-80f4 | 3 | PASS: waveMtf.maxAbs 1.17e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.04e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.69e-12 (1 of 3) |
| catalog-mamiya-sekor-sfc-150f4-soft-focus | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-wide | 3 | PASS: waveMtf.maxAbs 1.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.80e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.24e-11 (1 of 3) |
| catalog-mamiya-sekor-zoom-e-28-50mm-f3-5-4-5-tele | 3 | PASS: waveMtf.maxAbs 5.95e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.55e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.46e-12 (1 of 3) |
| catalog-meyer-optik-gorlitz-double-plasmat-135mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-meyer-optik-gorlitz-kino-plasmat-100-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-meyer-optik-gorlitz-lydith-30f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-meyer-optik-gorlitz-orestegor-500mm-f56 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-meyer-optik-gorlitz-orestor-135f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-meyer-optik-gorlitz-primagon-35f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-100mm-f2 | 3 | PASS: waveMtf.maxAbs 2.00e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.30e-11 (1 of 3) |
| catalog-minolta-af-100mm-f28-macro | 3 | PASS: waveMtf.maxAbs 1.90e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.60e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.61e-11 (1 of 3) |
| catalog-minolta-af-200mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-20mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-28-70mm-f28-g-wide | 3 | PASS: waveMtf.maxAbs 2.69e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.16e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.50e-11 (1 of 3) |
| catalog-minolta-af-28-70mm-f28-g-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-28-75-f28-d-wide | 3 | PASS: waveMtf.maxAbs 4.41e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.48e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.15e-10 (2 of 3) |
| catalog-minolta-af-28-75-f28-d-tele | 3 | PASS: waveMtf.maxAbs 9.58e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.30e-11 (1 of 3) |
| catalog-minolta-af-28mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-300mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-35-105mm-f3-5-4-5-v2-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-35-70-f4-wide | 3 | PASS: waveMtf.maxAbs 1.02e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.00e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.39e-11 (1 of 3) |
| catalog-minolta-af-35-70-f4-tele | 3 | PASS: waveMtf.maxAbs 5.63e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.32e-10 (1 of 3) |
| catalog-minolta-af-35mm-f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-35mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-400mm-f45-apo-g | 3 | PASS: waveMtf.maxAbs 2.88e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.17e-11 (3 of 3) |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-70-200mm-f28-apo-g-d-ssm-tele | 3 | PASS: waveMtf.maxAbs 1.91e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.28e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.10e-11 (2 of 3) |
| catalog-minolta-af-80-200mm-f28-apo-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-af-80-200mm-f28-apo-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-auto-tele-rokkor-100f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-mc-w-rokkor-sg-28f35-v2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-135f28 | 3 | PASS: waveMtf.maxAbs 8.27e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.56e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.64e-11 (2 of 3) |
| catalog-minolta-md-28mm-f28-7-7 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-28mm-f28-v2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-50f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-apo-tele-600mm-f63 | 3 | PASS: waveMtf.maxAbs 3.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.88e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.99e-11 (2 of 3) |
| catalog-minolta-md-rokkor-45f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-rokkor-50f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-tele-rokkor-135mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-24-35-f35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-24-35-f35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-24-50-f4-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-24-50-f4-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-28-85-f35-45-wide | 3 | PASS: waveMtf.maxAbs 3.04e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.64e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.01e-11 (1 of 3) |
| catalog-minolta-md-zoom-28-85-f35-45-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-35-135mm-f35-45-wide | 3 | PASS: waveMtf.maxAbs 2.65e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.16e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.45e-11 (2 of 3) |
| catalog-minolta-md-zoom-35-135mm-f35-45-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-50-135mm-f35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-minolta-md-zoom-50-135mm-f35-tele | 3 | PASS: waveMtf.maxAbs 2.78e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.57e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.62e-11 (1 of 3) |
| catalog-minolta-md-zoom-75-150-f4-wide | 3 | PASS: waveMtf.maxAbs 1.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.81e-11 (1 of 3) |
| catalog-minolta-md-zoom-75-150-f4-tele | 3 | PASS: waveMtf.maxAbs 2.74e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.69e-11 (2 of 3) |
| catalog-minolta-stf-135f28-t45 | 3 | PASS: waveMtf.maxAbs 1.31e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.53e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.28e-12 (1 of 3) |
| catalog-miranda-auto-e-50mm-f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-miranda-auto-ec-135mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-miranda-auto-ec-200mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-miranda-auto-ec-35mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-105-f14e-ed | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-24f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-28f14d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-85f14-ais | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-85f14d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-85f14g | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-af-28-200-f3556-g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 1.46e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (1 of 3) |
| catalog-nikkor-af-28-200-f3556-g-if-ed-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-af-s-58f14g | 3 | PASS: waveMtf.maxAbs 8.55e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.02e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.21e-11 (1 of 3) |
| catalog-nikkor-afs-120-300f28e-wide | 3 | PASS: waveMtf.maxAbs 3.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.65e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.24e-11 (2 of 3) |
| catalog-nikkor-afs-120-300f28e-tele | 3 | PASS: waveMtf.maxAbs 6.77e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.65e-11 (3 of 3) |
| catalog-nikkor-afs-14-24f28-wide | 3 | PASS: waveMtf.maxAbs 2.73e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.33e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.61e-10 (1 of 3) |
| catalog-nikkor-afs-14-24f28-tele | 3 | PASS: waveMtf.maxAbs 9.34e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.47e-10 (1 of 3) |
| catalog-nikkor-afs-16-35f4-vr-wide | 3 | PASS: waveMtf.maxAbs 6.69e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.04e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.67e-10 (2 of 3) |
| catalog-nikkor-afs-16-35f4-vr-tele | 3 | PASS: waveMtf.maxAbs 3.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.58e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.33e-10 (2 of 3) |
| catalog-nikkor-afs-200-500f56e-wide | 3 | PASS: waveMtf.maxAbs 5.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.36e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.27e-11 (3 of 3) |
| catalog-nikkor-afs-200-500f56e-tele | 3 | PASS: waveMtf.maxAbs 3.82e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.46e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.42e-11 (3 of 3) |
| catalog-nikkor-afs-24-70-f28e-vr-wide | 3 | PASS: waveMtf.maxAbs 2.02e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.93e-10 (1 of 3) | PASS: waveMtf.maxAbs 9.72e-10 (1 of 3) |
| catalog-nikkor-afs-24-70-f28e-vr-tele | 3 | PASS: waveMtf.maxAbs 1.16e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.30e-10 (1 of 3) |
| catalog-nikkor-n-28f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-s-auto-50mm-f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z-100-400-f4556-wide | 3 | PASS: waveMtf.maxAbs 3.53e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.21e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.76e-11 (1 of 3) |
| catalog-nikkor-z-100-400-f4556-tele | 3 | PASS: waveMtf.maxAbs 5.70e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.07e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.67e-11 (2 of 3) |
| catalog-nikkor-z-14-30f4s-wide | 3 | PASS: waveMtf.maxAbs 2.18e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.31e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.38e-10 (1 of 3) |
| catalog-nikkor-z-14-30f4s-tele | 3 | PASS: waveMtf.maxAbs 8.96e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.32e-10 (2 of 3) |
| catalog-nikkor-z-24-120f4-wide | 3 | PASS: waveMtf.maxAbs 6.21e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.27e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.25e-10 (3 of 3) |
| catalog-nikkor-z-24-120f4-tele | 3 | PASS: waveMtf.maxAbs 3.98e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.84e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.23e-10 (3 of 3) |
| catalog-nikkor-z-24-200-f4-63-vr-wide | 3 | PASS: waveMtf.maxAbs 1.53e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.22e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.50e-11 (1 of 3) |
| catalog-nikkor-z-24-200-f4-63-vr-tele | 3 | PASS: waveMtf.maxAbs 7.76e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.96e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.05e-10 (3 of 3) |
| catalog-nikkor-z-24-50-f4-63-wide | 3 | PASS: waveMtf.maxAbs 1.58e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.18e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.24e-10 (2 of 3) |
| catalog-nikkor-z-24-50-f4-63-tele | 3 | PASS: waveMtf.maxAbs 8.38e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.46e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) |
| catalog-nikkor-z-24-70-f28-wide | 3 | PASS: waveMtf.maxAbs 8.29e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.10e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.85e-10 (3 of 3) |
| catalog-nikkor-z-24-70-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z-28f28 | 3 | PASS: waveMtf.maxAbs 1.44e-10 (1 of 3) | PASS: waveMtf.maxAbs 6.51e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (1 of 3) |
| catalog-nikkor-z-35f18s | 3 | PASS: waveMtf.maxAbs 1.64e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.67e-10 (1 of 3) |
| catalog-nikkor-z-40f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z-50f18s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z-70-200f28-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z-70-200f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z-70-200f28-vr-s-ii-wide | 3 | PASS: waveMtf.maxAbs 1.69e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.86e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.93e-10 (3 of 3) |
| catalog-nikkor-z-70-200f28-vr-s-ii-tele | 3 | PASS: waveMtf.maxAbs 4.91e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.34e-10 (2 of 3) |
| catalog-nikkor-z-85f18s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikkor-z50f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-wide | 3 | PASS: waveMtf.maxAbs 7.98e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.82e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.79e-10 (2 of 3) |
| catalog-nikon-1-nikkor-10-100-f4-56-vr-tele | 3 | PASS: waveMtf.maxAbs 1.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.15e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.12e-10 (2 of 3) |
| catalog-nikon-1-nikkor-10mm-f28 | 3 | PASS: waveMtf.maxAbs 4.11e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.76e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.06e-11 (1 of 3) |
| catalog-nikon-1-nikkor-11-27p5-f35-56-wide | 3 | PASS: waveMtf.maxAbs 8.33e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.24e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.02e-11 (1 of 3) |
| catalog-nikon-1-nikkor-11-27p5-f35-56-tele | 3 | PASS: waveMtf.maxAbs 3.31e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.48e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.51e-10 (2 of 3) |
| catalog-nikon-1-nikkor-32mm-f12 | 3 | PASS: waveMtf.maxAbs 8.24e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.07e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.14e-12 (1 of 3) |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-wide | 3 | PASS: waveMtf.maxAbs 1.41e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.79e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.70e-10 (2 of 3) |
| catalog-nikon-1-nikkor-vr-10-30-f35-56-tele | 3 | PASS: waveMtf.maxAbs 1.76e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.97e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.99e-10 (3 of 3) |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-wide | 3 | PASS: waveMtf.maxAbs 5.36e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.04e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.06e-10 (1 of 3) |
| catalog-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-tele | 3 | PASS: waveMtf.maxAbs 1.28e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.36e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.47e-10 (2 of 3) |
| catalog-nikon-28ti-28f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-35ti-35f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-5cm-f11 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-dc-nikkor-135mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-i-nikkor-300mm-f2-8d-if-ed | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-i-nikkor-400mm-f28d-if-ed | 3 | PASS: waveMtf.maxAbs 5.61e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.17e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.90e-11 (3 of 3) |
| catalog-nikon-af-i-nikkor-600mm-f4d-if-ed | 3 | PASS: waveMtf.maxAbs 3.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.77e-11 (3 of 3) |
| catalog-nikon-af-micro-nikkor-200mm-f4d | 3 | PASS: waveMtf.maxAbs 4.18e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.99e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.32e-11 (3 of 3) |
| catalog-nikon-af-micro-nikkor-60mm-f28d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-nikkor-20mm-f28d | 3 | PASS: waveMtf.maxAbs 1.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.31e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (1 of 3) |
| catalog-nikon-af-nikkor-28mm-f28d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-nikkor-35mm-f2d | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-wide | 3 | PASS: waveMtf.maxAbs 3.39e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.63e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.20e-11 (1 of 3) |
| catalog-nikon-af-p-70-300-f45-56e-ed-vr-tele | 3 | PASS: waveMtf.maxAbs 4.52e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.82e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.46e-11 (2 of 3) |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-wide | 3 | PASS: waveMtf.maxAbs 2.16e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.37e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.36e-10 (2 of 3) |
| catalog-nikon-af-p-dx-10-20mm-f45-56g-vr-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-wide | 3 | PASS: waveMtf.maxAbs 2.99e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.85e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.74e-11 (2 of 3) |
| catalog-nikon-af-s-70-200mm-f28g-vr-ii-tele | 3 | PASS: waveMtf.maxAbs 8.13e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.49e-11 (2 of 3) |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-wide | 3 | PASS: waveMtf.maxAbs 2.35e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.98e-11 (2 of 3) |
| catalog-nikon-af-s-dx-55-200-f4-5-6g-ed-vr-ii-tele | 3 | PASS: waveMtf.maxAbs 1.70e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.07e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-11 (3 of 3) |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-wide | 3 | PASS: waveMtf.maxAbs 2.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.18e-11 (2 of 3) |
| catalog-nikon-af-s-dx-55-300mm-f45-56g-ed-vr-tele | 3 | PASS: waveMtf.maxAbs 3.21e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.69e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.62e-11 (3 of 3) |
| catalog-nikon-af-s-dx-micro-nikkor-40mm-f28g | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr | 3 | PASS: waveMtf.maxAbs 8.40e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.18e-11 (2 of 3) |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-wide | 3 | PASS: waveMtf.maxAbs 9.82e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.79e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.79e-10 (2 of 3) |
| catalog-nikon-af-s-dx-nikkor-10-24mm-f35-45g-ed-tele | 3 | PASS: waveMtf.maxAbs 1.20e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.80e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.92e-10 (2 of 3) |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-tele | 3 | PASS: waveMtf.maxAbs 3.04e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.92e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.22e-10 (2 of 3) |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 5.40e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.62e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.58e-10 (2 of 3) |
| catalog-nikon-af-s-dx-vr-zoom-nikkor-18-200-f35-56g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 2.73e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.26e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.11e-10 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 1.78e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.87e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.00e-10 (2 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-12-24mm-f4g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 5.53e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.78e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.82e-10 (1 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 1.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.58e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.71e-10 (2 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-17-55mm-f28g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 1.30e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.85e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.01e-10 (3 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 1.62e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) |
| catalog-nikon-af-s-dx-zoom-nikkor-18-70-f35-45g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 2.65e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.64e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.87e-11 (2 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-wide | 3 | PASS: waveMtf.maxAbs 6.57e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.80e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.30e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tele | 3 | PASS: waveMtf.maxAbs 5.65e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.18e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.32e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-wide | 3 | PASS: waveMtf.maxAbs 1.59e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.28e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (2 of 3) |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-tele | 3 | PASS: waveMtf.maxAbs 1.04e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.46e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.23e-10 (2 of 3) |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-nikkor-24-85mm-f35-45g-ed-vr-tele | 3 | PASS: waveMtf.maxAbs 1.61e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.05e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.02e-10 (3 of 3) |
| catalog-nikon-af-s-nikkor-24mm-f18g-ed | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-nikkor-400mm-f28e-fl-ed-vr | 3 | PASS: waveMtf.maxAbs 6.64e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.71e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.27e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr | 3 | PASS: waveMtf.maxAbs 3.57e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.31e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.45e-11 (2 of 3) |
| catalog-nikon-af-s-nikkor-500mm-f4g-ed-vr | 3 | PASS: waveMtf.maxAbs 6.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.98e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.92e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-600mm-f4d-if-ed-ii | 3 | PASS: waveMtf.maxAbs 3.42e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.47e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.74e-11 (3 of 3) |
| catalog-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr | 3 | PASS: waveMtf.maxAbs 5.38e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.83e-11 (2 of 3) |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-wide | 3 | PASS: waveMtf.maxAbs 2.53e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.90e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.30e-11 (2 of 3) |
| catalog-nikon-af-s-nikkor-70-200mm-f4g-ed-vr-tele | 3 | PASS: waveMtf.maxAbs 7.85e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.53e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.30e-11 (2 of 3) |
| catalog-nikon-af-s-nikkor-800f56e-fl-ed-vr | 3 | PASS: waveMtf.maxAbs 6.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.61e-11 (3 of 3) |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-zoom-nikkor-17-35mm-f28d-if-ed-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-s-zoom-nikkor-24-85mm-f35-45g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 2.04e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.63e-11 (1 of 3) |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-micro-70-180mm-f45-56d-tele | 3 | PASS: waveMtf.maxAbs 2.42e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.91e-11 (1 of 3) |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-20-35mm-f28d-if-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-28-80mm-f33-56g-tele | 3 | PASS: waveMtf.maxAbs 1.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.03e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.07e-10 (2 of 3) |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-28-80mm-f35-56d-tele | 3 | PASS: waveMtf.maxAbs 3.36e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.66e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.12e-12 (1 of 3) |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-wide | 3 | PASS: waveMtf.maxAbs 2.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.76e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.61e-11 (1 of 3) |
| catalog-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-35-70mm-f28d-tele | 3 | PASS: waveMtf.maxAbs 7.63e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.82e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.84e-12 (1 of 3) |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-af-zoom-nikkor-80-200mm-f28-ed-tele | 3 | PASS: waveMtf.maxAbs 6.87e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.92e-11 (1 of 3) |
| catalog-nikon-af600-28mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-afp-dx-18-55mm-f35-56g-vr-tele | 3 | PASS: waveMtf.maxAbs 1.21e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.23e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.09e-11 (1 of 3) |
| catalog-nikon-afp-dx-70-300-f4563g-wide | 3 | PASS: waveMtf.maxAbs 1.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.26e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.35e-11 (2 of 3) |
| catalog-nikon-afp-dx-70-300-f4563g-tele | 3 | PASS: waveMtf.maxAbs 2.33e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.76e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.39e-11 (3 of 3) |
| catalog-nikon-afs-105f28-vr-micro | 3 | PASS: waveMtf.maxAbs 1.79e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.59e-11 (2 of 3) |
| catalog-nikon-afs-24-120mm-f4g-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-afs-24-120mm-f4g-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-afs-24-70mm-f28g-wide | 3 | PASS: waveMtf.maxAbs 6.07e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.40e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.79e-10 (1 of 3) |
| catalog-nikon-afs-24-70mm-f28g-tele | 3 | PASS: waveMtf.maxAbs 1.12e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.83e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.00e-11 (1 of 3) |
| catalog-nikon-afs-28f14e | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-afs-70-200-f28e-fl-wide | 3 | PASS: waveMtf.maxAbs 5.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.40e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.20e-11 (1 of 3) |
| catalog-nikon-afs-70-200-f28e-fl-tele | 3 | PASS: waveMtf.maxAbs 3.33e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.61e-11 (1 of 3) |
| catalog-nikon-afs-80-400-f45-56g-wide | 3 | PASS: waveMtf.maxAbs 1.93e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.89e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.07e-11 (1 of 3) |
| catalog-nikon-afs-80-400-f45-56g-tele | 3 | PASS: waveMtf.maxAbs 3.12e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.17e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.38e-11 (2 of 3) |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-wide | 3 | PASS: waveMtf.maxAbs 1.66e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.54e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.71e-10 (1 of 3) |
| catalog-nikon-afs-nikkor-18-35mm-f35-45g-ed-tele | 3 | PASS: waveMtf.maxAbs 1.96e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.81e-11 (2 of 3) |
| catalog-nikon-afs-vr-200400f4g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 4.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.41e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.98e-11 (2 of 3) |
| catalog-nikon-afs-vr-200400f4g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 8.99e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.69e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.00e-11 (2 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 2.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.58e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.05e-11 (1 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-24-120-f35-56g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 3.30e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.86e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.69e-10 (3 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-wide | 3 | PASS: waveMtf.maxAbs 3.05e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.72e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.49e-11 (1 of 3) |
| catalog-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-tele | 3 | PASS: waveMtf.maxAbs 2.38e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.25e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.43e-11 (1 of 3) |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-wide | 3 | PASS: waveMtf.maxAbs 3.42e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.99e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.79e-11 (1 of 3) |
| catalog-nikon-afs-zoom-nikkor-80-200mm-f28d-if-ed-tele | 3 | PASS: waveMtf.maxAbs 4.19e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.39e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.23e-11 (2 of 3) |
| catalog-nikon-ai-28mm-f35 | 3 | PASS: waveMtf.maxAbs 1.06e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.26e-11 (1 of 3) |
| catalog-nikon-ai-af-dc-nikkor-105mm-f2d | 3 | PASS: waveMtf.maxAbs 8.11e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.02e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.04e-11 (1 of 3) |
| catalog-nikon-ai-af-micro-nikkor-105mm-f28s | 3 | PASS: waveMtf.maxAbs 6.35e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.73e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.19e-11 (2 of 3) |
| catalog-nikon-ai-af-nikkor-85f18s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-af-s-nikkor-300mm-f28d-if-ed | 3 | PASS: waveMtf.maxAbs 2.32e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.54e-11 (2 of 3) |
| catalog-nikon-ai-af-s-nikkor-400mm-f28d-if-ed-ii | 3 | PASS: waveMtf.maxAbs 3.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.74e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.27e-11 (3 of 3) |
| catalog-nikon-ai-af-s-nikkor-500mm-f4d-if-ed | 3 | PASS: waveMtf.maxAbs 8.29e-12 (2 of 3) | PASS: waveMtf.maxAbs 8.53e-12 (2 of 3) | PASS: waveMtf.maxAbs 7.69e-12 (2 of 3) |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-wide | 3 | PASS: waveMtf.maxAbs 6.62e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.81e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.91e-11 (2 of 3) |
| catalog-nikon-ai-af-vr-zoom-nikkor-80-400mm-f45-56d-ed-tele | 3 | PASS: waveMtf.maxAbs 2.19e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.54e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.02e-11 (2 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-wide | 3 | PASS: waveMtf.maxAbs 1.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.48e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (1 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-tele | 3 | PASS: waveMtf.maxAbs 1.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.74e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.77e-11 (1 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-wide | 3 | PASS: waveMtf.maxAbs 2.00e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.38e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (1 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-120-f35-56d-tele | 3 | PASS: waveMtf.maxAbs 1.87e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.73e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.72e-10 (1 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-tele | 3 | PASS: waveMtf.maxAbs 1.94e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.73e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.72e-10 (1 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-wide | 3 | PASS: waveMtf.maxAbs 4.74e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.79e-11 (1 of 3) |
| catalog-nikon-ai-af-zoom-nikkor-80-200-f28d-ed-tele | 3 | PASS: waveMtf.maxAbs 6.89e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.54e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.41e-12 (1 of 3) |
| catalog-nikon-ai-micro-nikkor-105mm-f28s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-micro-nikkor-55f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-135f2 | 3 | PASS: waveMtf.maxAbs 1.14e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.28e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.78e-11 (1 of 3) |
| catalog-nikon-ai-nikkor-135f28 | 3 | PASS: waveMtf.maxAbs 1.75e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.83e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.74e-11 (2 of 3) |
| catalog-nikon-ai-nikkor-180mm-f28-ed | 3 | PASS: waveMtf.maxAbs 1.76e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.69e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.39e-11 (1 of 3) |
| catalog-nikon-ai-nikkor-200mm-f2-if-ed | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-24mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-28mm-f28s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-35mm-f14-s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-35mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-45mm-f28-p | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-50f18s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-nikkor-600mm-f56-if-ed | 3 | PASS: waveMtf.maxAbs 5.34e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.60e-11 (3 of 3) |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-wide | 3 | PASS: waveMtf.maxAbs 1.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.04e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.09e-11 (1 of 3) |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-wide | 3 | PASS: waveMtf.maxAbs 2.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.35e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.35e-11 (1 of 3) |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-35-105mm-f3-5-4-5s-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-wide | 3 | PASS: waveMtf.maxAbs 4.16e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.06e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.32e-11 (1 of 3) |
| catalog-nikon-ai-zoom-nikkor-35-200mm-f3-5-4-5s-tele | 3 | PASS: waveMtf.maxAbs 2.55e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.76e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.29e-11 (2 of 3) |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-wide | 3 | PASS: waveMtf.maxAbs 4.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.97e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.40e-11 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-tele | 3 | PASS: waveMtf.maxAbs 7.12e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.99e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.01e-11 (3 of 3) |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-wide | 3 | PASS: waveMtf.maxAbs 2.14e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.68e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.08e-11 (2 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f4-tele | 3 | PASS: waveMtf.maxAbs 1.21e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.38e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.15e-11 (1 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-wide | 3 | PASS: waveMtf.maxAbs 2.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.23e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.14e-11 (2 of 3) |
| catalog-nikon-ai-zoom-nikkor-80-200mm-f45-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-wide | 3 | PASS: waveMtf.maxAbs 4.80e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.26e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.75e-11 (2 of 3) |
| catalog-nikon-ai-zoom-nikkor-ed-50-300-f45-tele | 3 | PASS: waveMtf.maxAbs 2.59e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.27e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.75e-11 (1 of 3) |
| catalog-nikon-ais-nikkor-300mm-f2-if-ed | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ais-nikkor-50mm-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-wide | 3 | PASS: waveMtf.maxAbs 2.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.65e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.89e-11 (2 of 3) |
| catalog-nikon-ais-zoom-nikkor-100-300mm-f56-tele | 3 | PASS: waveMtf.maxAbs 1.47e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.38e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.53e-11 (1 of 3) |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ais-zoom-nikkor-80-200mm-f28-ed-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-wide | 3 | PASS: waveMtf.maxAbs 3.92e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.78e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.61e-11 (1 of 3) |
| catalog-nikon-ais-zoom-nikkor-ed-200-400mm-f4-tele | 3 | PASS: waveMtf.maxAbs 1.55e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.19e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.24e-11 (1 of 3) |
| catalog-nikon-dodotto-400f8 | 3 | PASS: waveMtf.maxAbs 1.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.18e-11 (2 of 3) |
| catalog-nikon-fuwatto-soft-90mm-f48 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-gugotto-120mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-gyogyotto-20mm-f8 | 2 | PASS: waveMtf.maxAbs 1.19e-11 (1 of 2) | PASS: waveMtf.maxAbs 1.50e-11 (1 of 2) | PASS: waveMtf.maxAbs 1.02e-11 (1 of 2) |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ix-nikkor-30-60mm-f4-56-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-l35af-35f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-lw-nikkor-28-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-medical-nikkor-120mm-f4-if | 3 | PASS: waveMtf.maxAbs 3.96e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.73e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.51e-11 (1 of 3) |
| catalog-nikon-micro-60f28g | 3 | PASS: waveMtf.maxAbs 5.40e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.38e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.39e-10 (1 of 3) |
| catalog-nikon-new-nikkor-auto-28mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-15mm-f56 | 3 | PASS: waveMtf.maxAbs 2.89e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.68e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.60e-11 (1 of 3) |
| catalog-nikon-nikkor-20mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-300mm-f45-ed | 3 | PASS: waveMtf.maxAbs 1.90e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.86e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.07e-11 (2 of 3) |
| catalog-nikon-nikkor-35mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-600mm-f56-ed | 3 | PASS: waveMtf.maxAbs 3.85e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.53e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.65e-11 (3 of 3) |
| catalog-nikon-nikkor-800mm-f8-ed | 2 | PASS: waveMtf.maxAbs 2.49e-11 (1 of 2) | PASS: waveMtf.maxAbs 3.64e-11 (1 of 2) | PASS: waveMtf.maxAbs 4.18e-11 (1 of 2) |
| catalog-nikon-nikkor-afs-20mm-f18g | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-afs-24mm-f14g | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-afs-28-300mm-f35-56g-ed-vr-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-h-auto-28mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-o-21mm-f4 | 3 | PASS: waveMtf.maxAbs 1.33e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.18e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.42e-12 (2 of 3) |
| catalog-nikon-nikkor-s-auto-50f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-s-auto-58mm-f1-4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-sw-75mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-sw-90mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-wide | 3 | PASS: waveMtf.maxAbs 1.57e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.42e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (3 of 3) |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-tele | 3 | PASS: waveMtf.maxAbs 3.77e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.30e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.49e-10 (2 of 3) |
| catalog-nikon-nikkor-z-20mm-f18-s | 3 | PASS: waveMtf.maxAbs 3.51e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.97e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.02e-9 (2 of 3) |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-wide | 3 | PASS: waveMtf.maxAbs 3.84e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.95e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.05e-10 (2 of 3) |
| catalog-nikon-nikkor-z-24-70mm-f28-s-ii-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-z-35f12s | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-wide | 3 | PASS: waveMtf.maxAbs 3.61e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.27e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.09e-10 (1 of 3) |
| catalog-nikon-nikkor-z-dx-12-28mm-f35-56-pz-vr-tele | 3 | PASS: waveMtf.maxAbs 1.45e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.68e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.62e-11 (2 of 3) |
| catalog-nikon-pc-e-nikkor-24-f35d-ed | 3 | PASS: waveMtf.maxAbs 7.60e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.45e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.23e-11 (1 of 3) |
| catalog-nikon-pc-nikkor-19mm-f4e-ed | 3 | PASS: waveMtf.maxAbs 8.09e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.57e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.65e-10 (1 of 3) |
| catalog-nikon-pc-nikkor-35mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-pce-micro-nikkor-45f28d | 3 | PASS: waveMtf.maxAbs 2.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.30e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.82e-11 (1 of 3) |
| catalog-nikon-ruw-af-micro-nikkor-50f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ruw-af-zoom-nikkor-20-35mm-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-series-e-100mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-series-e-135mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-series-e-75-150mm-f35-wide | 3 | PASS: waveMtf.maxAbs 1.89e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.19e-11 (1 of 3) |
| catalog-nikon-series-e-75-150mm-f35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-series-e-zoom-36-72mm-f35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-series-e-zoom-36-72mm-f35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-tv-nikkor-115-69-f12-s100-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-ultra-micro-nikkor-295mm-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-uv-nikkor-105mm-f45 | 3 | PASS: waveMtf.maxAbs 1.24e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.55e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-11 (1 of 3) |
| catalog-nikon-uv-nikkor-55mm-f4 | 3 | PASS: waveMtf.maxAbs 5.61e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.29e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.18e-12 (1 of 3) |
| catalog-nikon-w-nikkor-35mm-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-z-135f18-plena | 3 | PASS: waveMtf.maxAbs 1.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.95e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.15e-12 (1 of 3) |
| catalog-nikon-z-14-24f28-s-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-z-14-24f28-s-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-z-24-70f4s-wide | 3 | PASS: waveMtf.maxAbs 1.08e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.67e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.91e-10 (2 of 3) |
| catalog-nikon-z-24-70f4s-tele | 3 | PASS: waveMtf.maxAbs 2.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.96e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.73e-10 (2 of 3) |
| catalog-nikon-z-26f28 | 3 | PASS: waveMtf.maxAbs 4.15e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.41e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.37e-10 (1 of 3) |
| catalog-nikon-z-58f095-noct | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-z-dx-16-50-f3563-vr-wide | 3 | PASS: waveMtf.maxAbs 8.73e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.61e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.62e-10 (2 of 3) |
| catalog-nikon-z-dx-16-50-f3563-vr-tele | 3 | PASS: waveMtf.maxAbs 2.86e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.75e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.74e-10 (2 of 3) |
| catalog-nikon-z-dx-18-140-f35-63-vr-wide | 3 | PASS: waveMtf.maxAbs 3.95e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.07e-10 (3 of 3) |
| catalog-nikon-z-dx-18-140-f35-63-vr-tele | 3 | PASS: waveMtf.maxAbs 1.87e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.66e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.58e-10 (3 of 3) |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-wide | 3 | PASS: waveMtf.maxAbs 2.08e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.74e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.22e-11 (2 of 3) |
| catalog-nikon-z-dx-50-250mm-f45-63-vr-tele | 3 | PASS: waveMtf.maxAbs 2.71e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.26e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.34e-11 (3 of 3) |
| catalog-nikon-z-mc-105f28 | 3 | PASS: waveMtf.maxAbs 3.39e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.99e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.88e-11 (2 of 3) |
| catalog-nikon-zoom-nikkor-28-45f45-wide | 3 | PASS: waveMtf.maxAbs 1.94e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.81e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.01e-11 (1 of 3) |
| catalog-nikon-zoom-nikkor-28-45f45-tele | 3 | PASS: waveMtf.maxAbs 9.31e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.94e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.01e-12 (1 of 3) |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-wide | 3 | PASS: waveMtf.maxAbs 4.78e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.46e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.46e-10 (3 of 3) |
| catalog-nikon-zoom-nikkor-56-168-f27-48-coolpix-sq-tele | 3 | PASS: waveMtf.maxAbs 1.94e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.53e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.52e-10 (3 of 3) |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-wide | 3 | PASS: waveMtf.maxAbs 6.84e-12 (2 of 3) | PASS: waveMtf.maxAbs 8.36e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.21e-11 (2 of 3) |
| catalog-nikon-zoom-nikkor-8-24-f28-49-coolpix-4300-tele | 3 | PASS: waveMtf.maxAbs 6.38e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (3 of 3) |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-wide | 3 | PASS: waveMtf.maxAbs 2.54e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.88e-11 (2 of 3) |
| catalog-nikon-zoom-nikkor-auto-50-300mm-f45-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-wide | 2 | PASS: waveMtf.maxAbs 1.90e-11 (1 of 2) | PASS: waveMtf.maxAbs 1.24e-11 (1 of 2) | PASS: waveMtf.maxAbs 8.35e-12 (1 of 2) |
| catalog-nikon-zoom-nikkor-auto-80-200mm-f4-5-tele | 2 | PASS: waveMtf.maxAbs 1.43e-11 (1 of 2) | PASS: waveMtf.maxAbs 1.96e-11 (1 of 2) | PASS: waveMtf.maxAbs 2.49e-11 (1 of 2) |
| catalog-nokton-50f1 | 3 | PASS: waveMtf.maxAbs 5.18e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.59e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.64e-10 (1 of 3) |
| catalog-olympus-e-zuiko-auto-t-1000mm-f11 | 3 | PASS: waveMtf.maxAbs 3.30e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.29e-11 (2 of 3) |
| catalog-olympus-g-zuiko-auto-w-21mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-mzuiko-12-40-f28-pro-wide | 3 | PASS: waveMtf.maxAbs 1.29e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.90e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.85e-10 (2 of 3) |
| catalog-olympus-mzuiko-12-40-f28-pro-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-wide | 3 | PASS: waveMtf.maxAbs 1.18e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.76e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.69e-10 (2 of 3) |
| catalog-olympus-mzuiko-12100mm-f4-is-pro-tele | 3 | PASS: waveMtf.maxAbs 4.90e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.67e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.02e-10 (3 of 3) |
| catalog-olympus-mzuiko-12mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-mzuiko-14-42-3556-ii-wide | 3 | PASS: waveMtf.maxAbs 9.35e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.76e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (1 of 3) |
| catalog-olympus-mzuiko-14-42-3556-ii-tele | 3 | PASS: waveMtf.maxAbs 1.19e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.00e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.88e-10 (2 of 3) |
| catalog-olympus-mzuiko-17mm-f18 | 3 | PASS: waveMtf.maxAbs 1.79e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.93e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.95e-10 (1 of 3) |
| catalog-olympus-mzuiko-17mm-f28 | 3 | PASS: waveMtf.maxAbs 2.71e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.22e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.22e-10 (2 of 3) |
| catalog-olympus-mzuiko-25mm-f18 | 3 | PASS: waveMtf.maxAbs 9.58e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.46e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.55e-10 (1 of 3) |
| catalog-olympus-mzuiko-40-150-f28-pro-wide | 3 | PASS: waveMtf.maxAbs 2.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.78e-10 (2 of 3) | PASS: waveMtf.maxAbs 9.67e-11 (2 of 3) |
| catalog-olympus-mzuiko-40-150-f28-pro-tele | 3 | PASS: waveMtf.maxAbs 3.70e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.96e-10 (1 of 3) | PASS: waveMtf.maxAbs 7.35e-11 (1 of 3) |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-wide | 3 | PASS: waveMtf.maxAbs 1.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.88e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.43e-11 (3 of 3) |
| catalog-olympus-mzuiko-75-300mm-f48-67-original-tele | 3 | PASS: waveMtf.maxAbs 1.45e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.08e-11 (3 of 3) |
| catalog-olympus-mzuiko-75mm-f18 | 3 | PASS: waveMtf.maxAbs 2.90e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.82e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.49e-12 (2 of 3) |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-wide | 3 | PASS: waveMtf.maxAbs 1.12e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.59e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-tele | 3 | PASS: waveMtf.maxAbs 1.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.75e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.70e-10 (2 of 3) |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-wide | 3 | PASS: waveMtf.maxAbs 2.82e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.67e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.35e-10 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-14-42mm-f35-56-tele | 3 | PASS: waveMtf.maxAbs 1.27e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.13e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.20e-10 (3 of 3) |
| catalog-olympus-mzuiko-digital-ed-17mm-f12-pro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-mzuiko-digital-ed-45mm-f12-pro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-pen-f-g-zuiko-auto-t-60mm-f15 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-pen-f-g-zuiko-auto-w-25mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-xa-zuiko-35-f28 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-135-f35 | 3 | PASS: waveMtf.maxAbs 1.43e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.04e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.14e-11 (2 of 3) |
| catalog-olympus-zuiko-16mmf35-fisheye | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-24f2-j | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-28mm-f35 | 3 | PASS: waveMtf.maxAbs 4.43e-12 (2 of 3) | PASS: waveMtf.maxAbs 9.84e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.75e-12 (2 of 3) |
| catalog-olympus-zuiko-600mm-f65 | 3 | PASS: waveMtf.maxAbs 4.82e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.93e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.28e-11 (2 of 3) |
| catalog-olympus-zuiko-85mm-f2 | 3 | PASS: waveMtf.maxAbs 6.44e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.17e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.69e-12 (1 of 3) |
| catalog-olympus-zuiko-9-36-f2-2p4-wide | 2 | PASS: waveMtf.maxAbs 5.80e-12 (1 of 2) | PASS: waveMtf.maxAbs 9.21e-11 (1 of 2) | PASS: waveMtf.maxAbs 8.63e-11 (1 of 2) |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | 3 | PASS: waveMtf.maxAbs 1.44e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.80e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.66e-10 (1 of 3) |
| catalog-olympus-zuiko-auto-macro-50f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-macro-90f2 | 3 | PASS: waveMtf.maxAbs 3.24e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.90e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (2 of 3) |
| catalog-olympus-zuiko-auto-s-50f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-s-50f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-s-55-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-t-180mm-f2 | 3 | PASS: waveMtf.maxAbs 4.11e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.11e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.42e-11 (1 of 3) |
| catalog-olympus-zuiko-auto-t-200mm-f5 | 3 | PASS: waveMtf.maxAbs 8.22e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 9.96e-12 (3 of 3) |
| catalog-olympus-zuiko-auto-w-18f35 | 2 | PASS: waveMtf.maxAbs 1.23e-11 (1 of 2) | PASS: waveMtf.maxAbs 7.86e-12 (1 of 2) | PASS: waveMtf.maxAbs 1.10e-11 (1 of 2) |
| catalog-olympus-zuiko-auto-w-21mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-w-24f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-w-24mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-w-28mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-wide | 3 | PASS: waveMtf.maxAbs 2.39e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.98e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.50e-11 (1 of 3) |
| catalog-olympus-zuiko-auto-zoom-65-200mm-f4-tele | 3 | PASS: waveMtf.maxAbs 2.00e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.31e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.32e-11 (1 of 3) |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-wide | 3 | PASS: waveMtf.maxAbs 2.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.52e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.30e-11 (1 of 3) |
| catalog-olympus-zuiko-auto-zoom-85-250mm-f5-tele | 3 | PASS: waveMtf.maxAbs 5.81e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.36e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.03e-11 (2 of 3) |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-wide | 3 | PASS: waveMtf.maxAbs 2.35e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.22e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.19e-10 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-tele | 3 | PASS: waveMtf.maxAbs 2.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.97e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.00e-10 (2 of 3) |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-wide | 3 | PASS: waveMtf.maxAbs 1.55e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.66e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.77e-10 (1 of 3) |
| catalog-olympus-zuiko-digital-ed-14-35mm-f2-swd-tele | 3 | PASS: waveMtf.maxAbs 5.48e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.85e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (2 of 3) |
| catalog-olympus-zuiko-digital-ed-150mm-f2 | 3 | PASS: waveMtf.maxAbs 1.70e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.91e-11 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-300mm-f28 | 3 | PASS: waveMtf.maxAbs 5.07e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.19e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.15e-11 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-wide | 3 | PASS: waveMtf.maxAbs 5.50e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.83e-11 (3 of 3) |
| catalog-olympus-zuiko-digital-ed-90-250mm-f28-tele | 3 | PASS: waveMtf.maxAbs 4.63e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.90e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.85e-11 (3 of 3) |
| catalog-olympus-zuiko-mc-auto-w-28mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-olympus-zuiko-mc-auto-zoom-35-70mm-f36-tele | 3 | PASS: waveMtf.maxAbs 8.41e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.60e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.15e-11 (1 of 3) |
| catalog-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro | 3 | PASS: waveMtf.maxAbs 2.77e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.89e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.82e-11 (3 of 3) |
| catalog-panasonic-dg-nocticron-42mm-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-dg-summilux-12mm-f14 | 3 | PASS: waveMtf.maxAbs 7.00e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.10e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.89e-11 (2 of 3) |
| catalog-panasonic-g-14mm-f25-ii | 3 | PASS: waveMtf.maxAbs 4.33e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.51e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.52e-10 (1 of 3) |
| catalog-panasonic-leica-dg-15f17 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-leica-dg-25f14 | 3 | PASS: waveMtf.maxAbs 5.30e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.45e-10 (1 of 3) |
| catalog-panasonic-leica-dg-9f17 | 3 | PASS: waveMtf.maxAbs 2.20e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.44e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.63e-10 (2 of 3) |
| catalog-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois | 3 | PASS: waveMtf.maxAbs 1.04e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.87e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.76e-10 (3 of 3) |
| catalog-panasonic-lumix-g-25mm-f17 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-wide | 3 | PASS: waveMtf.maxAbs 3.01e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.82e-11 (3 of 3) |
| catalog-panasonic-lumix-g-vario-100-300mm-f4-56-mega-ois-tele | 3 | PASS: waveMtf.maxAbs 3.04e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-lumix-g-vario-12-60mm-f35-56-tele | 3 | PASS: waveMtf.maxAbs 1.04e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.42e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.33e-10 (1 of 3) |
| catalog-panasonic-lumix-g-vario-7-14-f4-wide | 3 | PASS: waveMtf.maxAbs 1.87e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.64e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.54e-10 (2 of 3) |
| catalog-panasonic-lumix-g-vario-7-14-f4-tele | 3 | PASS: waveMtf.maxAbs 1.28e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.71e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.67e-10 (3 of 3) |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-wide | 3 | PASS: waveMtf.maxAbs 3.91e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.49e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.32e-10 (2 of 3) |
| catalog-panasonic-lumix-s-14-28mm-f4-56-macro-tele | 3 | PASS: waveMtf.maxAbs 2.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.89e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.68e-10 (2 of 3) |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-wide | 3 | PASS: waveMtf.maxAbs 1.95e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.23e-10 (1 of 3) |
| catalog-panasonic-lumix-s-24-105-f4-macro-ois-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-lumix-s-26mm-f8 | 3 | PASS: waveMtf.maxAbs 2.49e-12 (3 of 3) | PASS: waveMtf.maxAbs 2.99e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.24e-12 (3 of 3) |
| catalog-panasonic-lumix-s-35-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-wide | 3 | PASS: waveMtf.maxAbs 9.46e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.41e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.05e-11 (1 of 3) |
| catalog-panasonic-lumix-s-70-300-f45-56-macro-ois-tele | 3 | PASS: waveMtf.maxAbs 1.71e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.64e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.65e-11 (1 of 3) |
| catalog-panasonic-lumix-s-pro-16-35f4-wide | 3 | PASS: waveMtf.maxAbs 2.55e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.76e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.97e-10 (1 of 3) |
| catalog-panasonic-lumix-s-pro-16-35f4-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-wide | 2 | PASS: waveMtf.maxAbs 1.93e-11 (2 of 2) | PASS: waveMtf.maxAbs 1.92e-10 (2 of 2) | PASS: waveMtf.maxAbs 1.72e-10 (2 of 2) |
| catalog-panasonic-lumix-s-pro-24-70mm-f28-tele | 3 | PASS: waveMtf.maxAbs 9.10e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.03e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.99e-10 (1 of 3) |
| catalog-panasonic-lumix-s-pro-50-f14 | 3 | PASS: waveMtf.maxAbs 9.32e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.60e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.29e-11 (1 of 3) |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-wide | 3 | PASS: waveMtf.maxAbs 1.59e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.36e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.81e-11 (1 of 3) |
| catalog-panasonic-lumix-s-pro-70-200-f4-ois-tele | 3 | PASS: waveMtf.maxAbs 1.25e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.44e-11 (1 of 3) |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-panasonic-lumix-s-pro-70-200mm-f2-8-ois-tele | 3 | PASS: waveMtf.maxAbs 1.04e-10 (1 of 3) | PASS: waveMtf.maxAbs 5.33e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.57e-10 (1 of 3) |
| catalog-pentax-02-standard-zoom-5-15-f28-45-wide | 3 | PASS: waveMtf.maxAbs 1.37e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.77e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.66e-10 (3 of 3) |
| catalog-pentax-02-standard-zoom-5-15-f28-45-tele | 3 | PASS: waveMtf.maxAbs 2.00e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.44e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.45e-10 (3 of 3) |
| catalog-pentax-06-telephoto-zoom-15-45-f28-wide | 3 | PASS: waveMtf.maxAbs 1.60e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.44e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.12e-11 (3 of 3) |
| catalog-pentax-06-telephoto-zoom-15-45-f28-tele | 3 | PASS: waveMtf.maxAbs 8.00e-12 (3 of 3) | PASS: waveMtf.maxAbs 8.61e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.65e-11 (3 of 3) |
| catalog-pentax-110-24f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-645-a-45mm-f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-645-fa-120mm-f4-macro | 3 | PASS: waveMtf.maxAbs 6.81e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.83e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.54e-12 (1 of 3) |
| catalog-pentax-a-200mm-f4-macro-ed | 3 | PASS: waveMtf.maxAbs 9.82e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.51e-11 (2 of 3) |
| catalog-pentax-a-35-70f4-wide | 3 | PASS: waveMtf.maxAbs 2.61e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.22e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.79e-11 (1 of 3) |
| catalog-pentax-a-35-70f4-tele | 3 | PASS: waveMtf.maxAbs 1.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.81e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.24e-11 (1 of 3) |
| catalog-pentax-a-star-135mm-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-da-11-18-f28-wide | 3 | PASS: waveMtf.maxAbs 1.66e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.48e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.07e-11 (1 of 3) |
| catalog-pentax-da-11-18-f28-tele | 3 | PASS: waveMtf.maxAbs 3.12e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.31e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.27e-10 (2 of 3) |
| catalog-pentax-da-16-50-f28-wide | 3 | PASS: waveMtf.maxAbs 1.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.27e-10 (1 of 3) | PASS: waveMtf.maxAbs 8.17e-10 (1 of 3) |
| catalog-pentax-da-16-50-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-wide | 3 | PASS: waveMtf.maxAbs 1.09e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.00e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.27e-10 (2 of 3) |
| catalog-pentax-da-17-70mm-f4-al-if-sdm-tele | 3 | PASS: waveMtf.maxAbs 3.44e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.45e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.34e-10 (2 of 3) |
| catalog-pentax-da-18-55mm-f35-56-al-wide | 3 | PASS: waveMtf.maxAbs 2.44e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.12e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.45e-11 (1 of 3) |
| catalog-pentax-da-18-55mm-f35-56-al-tele | 3 | PASS: waveMtf.maxAbs 7.84e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.28e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.11e-11 (2 of 3) |
| catalog-pentax-da-21mm-f32-limited | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-da-35mm-f28-macro-limited | 3 | PASS: waveMtf.maxAbs 3.43e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.86e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.13e-12 (2 of 3) |
| catalog-pentax-da-50-135-f28-wide | 3 | PASS: waveMtf.maxAbs 1.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.52e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.64e-11 (2 of 3) |
| catalog-pentax-da-50-135-f28-tele | 3 | PASS: waveMtf.maxAbs 2.68e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.18e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.86e-11 (2 of 3) |
| catalog-pentax-da-70mm-f24-limited | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-wide | 3 | PASS: waveMtf.maxAbs 2.99e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.92e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.21e-10 (2 of 3) |
| catalog-pentax-dfa-28-105-f3556-ed-dc-wr-tele | 3 | PASS: waveMtf.maxAbs 4.09e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.58e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.70e-10 (2 of 3) |
| catalog-pentax-dfa-50mm-f14-sdm-aw | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-dfa-85mm-f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-dfa645-25mm-f4-al-if-sdm-aw | 3 | PASS: waveMtf.maxAbs 2.84e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.93e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.71e-10 (1 of 3) |
| catalog-pentax-dfa645-90f28-ed-aw-sr-macro | 3 | PASS: waveMtf.maxAbs 6.14e-12 (1 of 3) | PASS: waveMtf.maxAbs 6.97e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.11e-11 (1 of 3) |
| catalog-pentax-f-85-f28-soft | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-fa-20-35mm-f4-al-wide | 3 | PASS: waveMtf.maxAbs 7.87e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.92e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.05e-11 (1 of 3) |
| catalog-pentax-fa-20-35mm-f4-al-tele | 3 | PASS: waveMtf.maxAbs 1.28e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.60e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.71e-10 (2 of 3) |
| catalog-pentax-fa-28mm-f28-soft | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-fa-31-f18-al-ltd | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-fa-star-300mm-f45-ed-if | 3 | PASS: waveMtf.maxAbs 1.72e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.05e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.32e-11 (1 of 3) |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-hd-d-fa-star-70-200mm-f28-ed-dc-aw-tele | 3 | PASS: waveMtf.maxAbs 4.10e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.97e-11 (2 of 3) |
| catalog-pentax-hd-d-fa645-35f35-al-if | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-wide | 3 | PASS: waveMtf.maxAbs 2.36e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.38e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.25e-10 (1 of 3) |
| catalog-pentax-hd-da-18-50-f4-56-dc-wr-re-tele | 3 | PASS: waveMtf.maxAbs 7.74e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.48e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.89e-11 (1 of 3) |
| catalog-pentax-hd-da-20-40-f28-4-limited-wide | 3 | PASS: waveMtf.maxAbs 1.23e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.80e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.81e-10 (2 of 3) |
| catalog-pentax-hd-da-20-40-f28-4-limited-tele | 3 | PASS: waveMtf.maxAbs 5.51e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.52e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.63e-11 (1 of 3) |
| catalog-pentax-hd-dfa-21mm-f24-limited | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-smc-67-100mm-f4 | 3 | PASS: waveMtf.maxAbs 6.21e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.75e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.19e-11 (1 of 3) |
| catalog-pentax-smc-da-16-45-f4-ed-al-wide | 3 | PASS: waveMtf.maxAbs 2.37e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.74e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.82e-11 (2 of 3) |
| catalog-pentax-smc-da-16-45-f4-ed-al-tele | 3 | PASS: waveMtf.maxAbs 1.61e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.63e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.50e-10 (2 of 3) |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-wide | 3 | PASS: waveMtf.maxAbs 1.82e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.09e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.72e-11 (1 of 3) |
| catalog-pentax-smc-fa-28-105mm-f4-56-power-zoom-tele | 3 | PASS: waveMtf.maxAbs 1.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.42e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.81e-11 (3 of 3) |
| catalog-pentax-super-takumar-135mm-f2-5 | 3 | PASS: waveMtf.maxAbs 1.50e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.82e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.14e-11 (1 of 3) |
| catalog-pentax-super-takumar-28mm-f35 | 3 | PASS: waveMtf.maxAbs 7.02e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.90e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.95e-11 (2 of 3) |
| catalog-pentax-super-takumar-35mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax-ultra-achromatic-takumar-85f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-pentax110-50f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-ricoh-gr-18p3-f2p8 | 3 | PASS: waveMtf.maxAbs 3.95e-12 (3 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (3 of 3) |
| catalog-ricoh-gr-digital-iii-6mm-f19 | 3 | PASS: waveMtf.maxAbs 3.30e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.76e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.46e-11 (1 of 3) |
| catalog-ricoh-gr-lens-6mm-f19-gr-digital-iv | 3 | PASS: waveMtf.maxAbs 7.48e-12 (3 of 3) | PASS: waveMtf.maxAbs 1.36e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.36e-10 (3 of 3) |
| catalog-ricoh-gr1-28f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-ricoh-gr3-28f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-ricoh-gr3x-26f28 | 3 | PASS: waveMtf.maxAbs 1.35e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.59e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.56e-10 (2 of 3) |
| catalog-ricoh-gr4-28f28 | 3 | PASS: waveMtf.maxAbs 5.15e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.13e-9 (2 of 3) | PASS: waveMtf.maxAbs 1.13e-9 (2 of 3) |
| catalog-ricoh-gxr-a12-18f25 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-ricoh-lens-a16-24-85-f35-55-wide | 3 | PASS: waveMtf.maxAbs 8.95e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.86e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.85e-10 (1 of 3) |
| catalog-ricoh-lens-a16-24-85-f35-55-tele | 3 | PASS: waveMtf.maxAbs 1.12e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.71e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.75e-10 (1 of 3) |
| catalog-rodenstock-apo-sironar-w-150f56 | 3 | PASS: waveMtf.maxAbs 1.59e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.22e-11 (2 of 3) |
| catalog-rodenstock-apo-sironar-w-150f56-a1-reconstruction | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-geronar-210mm-f68 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-geronar-wa-90mm-f8 | 3 | PASS: waveMtf.maxAbs 1.58e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.45e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.60e-12 (2 of 3) |
| catalog-rodenstock-grandagon-n-65mm-f45 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-grandagon-n-75mm-f45 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-grandagon-n-75mm-f68 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-grandagon-n-90mm-f45 | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-rodagon-wa-80mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-rogonar-s-50f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-rodenstock-sironar-100mm-f56-convertible | 3 | PASS: waveMtf.maxAbs 6.49e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.05e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.25e-12 (1 of 3) |
| catalog-rodenstock-sironar-n-100mm-f56 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-russar-21-60f18 | 3 | PASS: waveMtf.maxAbs 2.28e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.07e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.97e-11 (1 of 3) |
| catalog-russar-22-70f8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samsung-30mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samsung-galaxy-s9-main-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samsung-nx-20mm-f28 | 3 | PASS: waveMtf.maxAbs 3.70e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.56e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.59e-10 (1 of 3) |
| catalog-samsung-nx-45mm-f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samyang-100mm-f28-ed-umc-macro | 3 | PASS: waveMtf.maxAbs 3.90e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.31e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.03e-11 (3 of 3) |
| catalog-samyang-135mm-f2-ed-umc | 3 | PASS: waveMtf.maxAbs 1.48e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.36e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.36e-11 (1 of 3) |
| catalog-samyang-af-14mm-f28-ef | 3 | PASS: waveMtf.maxAbs 1.04e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.76e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.83e-10 (3 of 3) |
| catalog-samyang-af-14mm-f2p8-fe | 3 | PASS: waveMtf.maxAbs 5.33e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.35e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.17e-10 (2 of 3) |
| catalog-samyang-af-18mm-f28-fe | 3 | PASS: waveMtf.maxAbs 1.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.67e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.03e-12 (1 of 3) |
| catalog-samyang-af-24mm-f1p8-fe | 3 | PASS: waveMtf.maxAbs 2.57e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.79e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.53e-10 (1 of 3) |
| catalog-samyang-af-24mm-f2p8-fe | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samyang-af-35-150mm-f2-28-wide | 2 | PASS: waveMtf.maxAbs 2.68e-10 (1 of 2) | PASS: waveMtf.maxAbs 2.93e-10 (1 of 2) | PASS: waveMtf.maxAbs 2.46e-11 (1 of 2) |
| catalog-samyang-af-35-150mm-f2-28-tele | 3 | PASS: waveMtf.maxAbs 7.53e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.94e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.26e-9 (1 of 3) |
| catalog-samyang-af-50mm-f1p4-fe | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samyang-af-85mm-f14-fe | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-samyang-xp-35mm-f1p2 | 3 | PASS: waveMtf.maxAbs 9.25e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.58e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.17e-11 (1 of 3) |
| catalog-schacht-s-travenar-135f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schacht-travenar-135mm-f35 | 3 | PASS: waveMtf.maxAbs 1.39e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.16e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.02e-11 (3 of 3) |
| catalog-schacht-travenar-90f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-apo-symmar-100-f56 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-cine-xenon-25f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-cinegon-10f18 | 3 | PASS: waveMtf.maxAbs 1.60e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.39e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.20e-11 (1 of 3) |
| catalog-schneider-cinegon-65f19 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-curtagon-35mm-f28-gen2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-kreuznach-angulon-210-f68 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-kreuznach-xenar-50f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-pa-curtagon-r-35f4 | 3 | PASS: waveMtf.maxAbs 9.07e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.31e-11 (1 of 3) |
| catalog-schneider-retina-curtagon-28f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-retina-xenon-c-50f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-super-angulon-75-f56 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-super-angulon-90mm-f8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-super-symmar-hm-120f56 | 2 | PASS: waveMtf.maxAbs 2.54e-11 (2 of 2) | PASS: waveMtf.maxAbs 1.77e-11 (2 of 2) | PASS: waveMtf.maxAbs 2.04e-11 (2 of 2) |
| catalog-schneider-super-symmar-xl-110-f56 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-technika-super-angulon-75mm-f8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-tele-variogon-80-240-f4-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-tele-variogon-80-240-f4-tele | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-tele-xenar-180f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-tv-variogon-20-600-f21-66-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-variogon-10-40-f28-wide | 3 | PASS: waveMtf.maxAbs 1.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.63e-12 (2 of 3) |
| catalog-schneider-variogon-10-40-f28-tele | 3 | PASS: waveMtf.maxAbs 6.30e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.21e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.55e-11 (1 of 3) |
| catalog-schneider-variogon-45-100-f28-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-variogon-45-100-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-variogon-8-40-f18-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-variogon-8-40-f18-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-schneider-xenon-50f19 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-10-18mm-f28-dc-dn-wide | 3 | PASS: waveMtf.maxAbs 2.83e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.30e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.31e-10 (3 of 3) |
| catalog-sigma-10-18mm-f28-dc-dn-tele | 3 | PASS: waveMtf.maxAbs 9.18e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.85e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.88e-10 (2 of 3) |
| catalog-sigma-105mm-f14-dg-hsm-art | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-105mm-f28-dg-dn-macro-art | 3 | PASS: waveMtf.maxAbs 2.10e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.97e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.63e-11 (1 of 3) |
| catalog-sigma-12mm-f14-dc-contemporary | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-135mm-f14-dg-art | 3 | PASS: waveMtf.maxAbs 2.57e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.79e-10 (2 of 3) |
| catalog-sigma-14-24-f28-dg-dn-art-wide | 3 | PASS: waveMtf.maxAbs 2.93e-10 (3 of 3) | PASS: waveMtf.maxAbs 6.31e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.52e-10 (3 of 3) |
| catalog-sigma-14-24-f28-dg-dn-art-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-14-24mm-f28-dg-hsm-art-wide | 3 | PASS: waveMtf.maxAbs 3.95e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.93e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.88e-10 (2 of 3) |
| catalog-sigma-14-24mm-f28-dg-hsm-art-tele | 3 | PASS: waveMtf.maxAbs 1.73e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.97e-12 (1 of 3) |
| catalog-sigma-16mm-f14-dc-dn | 3 | PASS: waveMtf.maxAbs 8.67e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.67e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.55e-11 (1 of 3) |
| catalog-sigma-17-40mm-f18-dc-art-wide | 3 | PASS: waveMtf.maxAbs 7.47e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.55e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (2 of 3) |
| catalog-sigma-17-40mm-f18-dc-art-tele | 3 | PASS: waveMtf.maxAbs 1.08e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.80e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.15e-11 (1 of 3) |
| catalog-sigma-18-35-f18-dc-hsm-art-wide | 3 | PASS: waveMtf.maxAbs 5.74e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.01e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.02e-10 (2 of 3) |
| catalog-sigma-18-35-f18-dc-hsm-art-tele | 3 | PASS: waveMtf.maxAbs 1.69e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.17e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.16e-10 (2 of 3) |
| catalog-sigma-200mm-f2-dg-os-sports | 3 | PASS: waveMtf.maxAbs 3.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.41e-11 (3 of 3) |
| catalog-sigma-20mm-f14-dg-hsm-art | 3 | PASS: waveMtf.maxAbs 2.47e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.01e-10 (1 of 3) | PASS: waveMtf.maxAbs 9.83e-11 (1 of 3) |
| catalog-sigma-23mm-f14-dc-dn-c | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-24-105-f4-dg-os-hsm-art-wide | 3 | PASS: waveMtf.maxAbs 1.98e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.22e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.22e-10 (2 of 3) |
| catalog-sigma-24-105-f4-dg-os-hsm-art-tele | 3 | PASS: waveMtf.maxAbs 1.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.46e-10 (2 of 3) | PASS: waveMtf.maxAbs 7.53e-10 (2 of 3) |
| catalog-sigma-24-70-f28-dg-os-hsm-art-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-24-70-f28-dg-os-hsm-art-tele | 3 | PASS: waveMtf.maxAbs 4.09e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.87e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.37e-10 (2 of 3) |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-24-70mm-f35-56-aspherical-hf-tele | 3 | PASS: waveMtf.maxAbs 1.66e-11 (1 of 3) | PASS: waveMtf.maxAbs 7.50e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.98e-11 (1 of 3) |
| catalog-sigma-24mm-f14-art-dn | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-24mm-f18-ex-dg-aspherical-macro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-24mm-f2-dg-dn-contemporary | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-24mm-f35-dg-dn | 3 | PASS: waveMtf.maxAbs 1.84e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.27e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.43e-10 (2 of 3) |
| catalog-sigma-28-105f28-dg-dn-art-wide | 3 | PASS: waveMtf.maxAbs 8.95e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.28e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.80e-10 (2 of 3) |
| catalog-sigma-28-105f28-dg-dn-art-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-28-45mm-f18-dg-dn-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-28-45mm-f18-dg-dn-tele | 3 | PASS: waveMtf.maxAbs 3.47e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.62e-11 (1 of 3) |
| catalog-sigma-28mm-f14-dg-hsm-art | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-28mm-f18-ex-dg-aspherical-macro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-30mm-f14-dc-hsm-a | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-35-f14-dgdn-art | 3 | PASS: waveMtf.maxAbs 1.39e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.33e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.24e-11 (1 of 3) |
| catalog-sigma-35mm-f12-dg-ii-art | 3 | PASS: waveMtf.maxAbs 1.82e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.38e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.20e-11 (1 of 3) |
| catalog-sigma-35mm-f14-dg-hsm-a | 3 | PASS: waveMtf.maxAbs 5.66e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.58e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.52e-10 (1 of 3) |
| catalog-sigma-45mm-f28-dg-dn-contemporary | 3 | PASS: waveMtf.maxAbs 1.56e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.52e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.58e-10 (2 of 3) |
| catalog-sigma-50f14-dg-hsm-a | 3 | PASS: waveMtf.maxAbs 9.47e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.07e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.16e-10 (1 of 3) |
| catalog-sigma-50f14-dgdn-art | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-50mm-f12-dg-dn-art | 3 | PASS: waveMtf.maxAbs 7.97e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.41e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.09e-11 (1 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-wide | 3 | PASS: waveMtf.maxAbs 8.65e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.71e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.94e-11 (2 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-tele | 3 | PASS: waveMtf.maxAbs 5.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.78e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.33e-11 (3 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-wide | 3 | PASS: waveMtf.maxAbs 7.91e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.21e-11 (3 of 3) |
| catalog-sigma-60-600mm-f45-63-dg-os-hsm-sports-tele | 3 | PASS: waveMtf.maxAbs 6.69e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.24e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.90e-11 (2 of 3) |
| catalog-sigma-60mm-f28-dn | 3 | PASS: waveMtf.maxAbs 1.00e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.08e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.07e-10 (3 of 3) |
| catalog-sigma-65mm-f2-dg-dn | 3 | PASS: waveMtf.maxAbs 4.25e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.34e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.46e-11 (2 of 3) |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-wide | 3 | PASS: waveMtf.maxAbs 4.92e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.91e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.65e-10 (3 of 3) |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-tele | 3 | PASS: waveMtf.maxAbs 8.50e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.46e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.71e-10 (3 of 3) |
| catalog-sigma-70-300mm-f4-56-dg-os-wide | 3 | PASS: waveMtf.maxAbs 2.64e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.72e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.69e-11 (2 of 3) |
| catalog-sigma-70-300mm-f4-56-dg-os-tele | 3 | PASS: waveMtf.maxAbs 2.09e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.26e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.88e-11 (2 of 3) |
| catalog-sigma-80-400mm-f45-56-ex-os-wide | 3 | PASS: waveMtf.maxAbs 2.15e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.05e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.45e-11 (1 of 3) |
| catalog-sigma-80-400mm-f45-56-ex-os-tele | 3 | PASS: waveMtf.maxAbs 3.08e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.82e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.44e-11 (3 of 3) |
| catalog-sigma-85f14-art | 3 | PASS: waveMtf.maxAbs 1.53e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.57e-10 (2 of 3) |
| catalog-sigma-85mm-f12-dg-art | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-85mm-f14-ex-dg-hsm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-90mm-f28-dg-dn-contemporary | 3 | PASS: waveMtf.maxAbs 1.61e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.09e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.14e-10 (3 of 3) |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-wide | 3 | PASS: waveMtf.maxAbs 5.73e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.35e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.69e-11 (1 of 3) |
| catalog-sigma-apo-50-500mm-f4-63-ex-rf-hsm-tele | 3 | PASS: waveMtf.maxAbs 4.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.70e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.51e-11 (2 of 3) |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-wide | 3 | PASS: waveMtf.maxAbs 6.06e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.18e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.11e-11 (1 of 3) |
| catalog-sigma-apo-50-500mm-f45-63-dg-os-hsm-tele | 3 | PASS: waveMtf.maxAbs 2.38e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.03e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.04e-11 (3 of 3) |
| catalog-sigma-apo-macro-105mm-f28-os-hsm | 3 | PASS: waveMtf.maxAbs 1.41e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.46e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.23e-11 (2 of 3) |
| catalog-sigma-apo-macro-150mm-f28-os-hsm | 3 | PASS: waveMtf.maxAbs 2.16e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.88e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.83e-11 (2 of 3) |
| catalog-sigma-apo-macro-180mm-f28-os-hsm | 3 | PASS: waveMtf.maxAbs 5.17e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.74e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.10e-11 (2 of 3) |
| catalog-sigma-apo-macro-180mm-f56-uc | 3 | PASS: waveMtf.maxAbs 1.56e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.46e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.43e-11 (2 of 3) |
| catalog-sigma-art-40-f14 | 3 | PASS: waveMtf.maxAbs 9.63e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.03e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.76e-11 (3 of 3) |
| catalog-sigma-art-85mm-f14-dgdn | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-dp0-quattro-14-f4 | 3 | PASS: waveMtf.maxAbs 3.54e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.99e-10 (1 of 3) | PASS: waveMtf.maxAbs 6.01e-10 (1 of 3) |
| catalog-sigma-dp1x-16mm-f4 | 3 | PASS: waveMtf.maxAbs 5.02e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.26e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.84e-11 (1 of 3) |
| catalog-sigma-dp2m-30f28 | 3 | PASS: waveMtf.maxAbs 3.18e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.14e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.17e-10 (2 of 3) |
| catalog-sigma-dp2x-24mmf28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sigma-dp3m-50f28 | 3 | PASS: waveMtf.maxAbs 9.02e-12 (3 of 3) | PASS: waveMtf.maxAbs 5.22e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.28e-10 (3 of 3) |
| catalog-sigma-macro-70mm-f28-ex-dg | 3 | PASS: waveMtf.maxAbs 1.14e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.12e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.46e-11 (1 of 3) |
| catalog-sonnar-50f15 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sonnar-e-24f18-za | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-dt-16-50mm-f28-ssm-wide | 3 | PASS: waveMtf.maxAbs 6.47e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.86e-10 (1 of 3) | PASS: waveMtf.maxAbs 7.63e-10 (1 of 3) |
| catalog-sony-dt-16-50mm-f28-ssm-tele | 3 | PASS: waveMtf.maxAbs 8.07e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.66e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.71e-11 (1 of 3) |
| catalog-sony-e-18-200mm-f35-63-oss-le-wide | 3 | PASS: waveMtf.maxAbs 2.22e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.51e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.62e-10 (1 of 3) |
| catalog-sony-e-18-200mm-f35-63-oss-le-tele | 3 | PASS: waveMtf.maxAbs 4.62e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.67e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.27e-10 (1 of 3) |
| catalog-sony-e-18-55mm-f35-56-oss-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-e-18-55mm-f35-56-oss-tele | 3 | PASS: waveMtf.maxAbs 1.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.54e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.55e-10 (3 of 3) |
| catalog-sony-e-20f28 | 3 | PASS: waveMtf.maxAbs 7.90e-12 (2 of 3) | PASS: waveMtf.maxAbs 4.30e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.38e-10 (2 of 3) |
| catalog-sony-e-35mm-f18-oss | 3 | PASS: waveMtf.maxAbs 5.26e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.36e-11 (1 of 3) | PASS: waveMtf.maxAbs 9.42e-12 (1 of 3) |
| catalog-sony-e-50mm-f18-oss | 2 | PASS: waveMtf.maxAbs 7.13e-12 (2 of 2) | PASS: waveMtf.maxAbs 4.99e-12 (2 of 2) | PASS: waveMtf.maxAbs 1.19e-11 (2 of 2) |
| catalog-sony-epz1650mmf3556oss-wide | 3 | PASS: waveMtf.maxAbs 1.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.04e-9 (1 of 3) | PASS: waveMtf.maxAbs 1.03e-9 (1 of 3) |
| catalog-sony-epz1650mmf3556oss-tele | 3 | PASS: waveMtf.maxAbs 3.02e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.59e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.60e-10 (1 of 3) |
| catalog-sony-fe-1224f28-gm-wide | 3 | PASS: waveMtf.maxAbs 1.95e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.35e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.35e-10 (2 of 3) |
| catalog-sony-fe-1224f28-gm-tele | 3 | PASS: waveMtf.maxAbs 1.56e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.79e-10 (3 of 3) | PASS: waveMtf.maxAbs 8.73e-10 (3 of 3) |
| catalog-sony-fe-135-f18-gm | 3 | PASS: waveMtf.maxAbs 6.63e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.93e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.26e-11 (2 of 3) |
| catalog-sony-fe-14mm-f18-gm | 3 | PASS: waveMtf.maxAbs 2.66e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.50e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.47e-10 (2 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-wide | 3 | PASS: waveMtf.maxAbs 3.69e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.53e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.41e-10 (2 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-16-35mm-f28-gm-ii-wide | 3 | PASS: waveMtf.maxAbs 2.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.97e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.38e-10 (3 of 3) |
| catalog-sony-fe-16-35mm-f28-gm-ii-tele | 3 | PASS: waveMtf.maxAbs 1.42e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.11e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.11e-10 (2 of 3) |
| catalog-sony-fe-20-70mm-f4-g-wide | 2 | PASS: waveMtf.maxAbs 1.16e-11 (2 of 2) | PASS: waveMtf.maxAbs 5.09e-10 (2 of 2) | PASS: waveMtf.maxAbs 4.98e-10 (2 of 2) |
| catalog-sony-fe-20-70mm-f4-g-tele | 3 | PASS: waveMtf.maxAbs 2.77e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.31e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.34e-10 (2 of 3) |
| catalog-sony-fe-20mm-f18-g | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-24-70mm-f28-gm-ii-wide | 3 | PASS: waveMtf.maxAbs 2.38e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.70e-10 (2 of 3) |
| catalog-sony-fe-24-70mm-f28-gm-ii-tele | 3 | PASS: waveMtf.maxAbs 1.04e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.24e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.32e-10 (2 of 3) |
| catalog-sony-fe-24-f28-g | 3 | PASS: waveMtf.maxAbs 6.64e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.08e-10 (2 of 3) |
| catalog-sony-fe-24mm-f14-gm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-28-70-f35-56-oss-wide | 3 | PASS: waveMtf.maxAbs 1.90e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.90e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.98e-10 (1 of 3) |
| catalog-sony-fe-28-70-f35-56-oss-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-28-70mm-f2-gm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-28-70mm-f2-gm-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-28mm-f2 | 3 | PASS: waveMtf.maxAbs 1.32e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.35e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.36e-10 (1 of 3) |
| catalog-sony-fe-400-800-f63-8-g-oss-wide | 3 | PASS: waveMtf.maxAbs 2.56e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.62e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.24e-11 (1 of 3) |
| catalog-sony-fe-400-800-f63-8-g-oss-tele | 3 | PASS: waveMtf.maxAbs 7.84e-11 (3 of 3) | PASS: waveMtf.maxAbs 8.74e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.81e-11 (3 of 3) |
| catalog-sony-fe-400mm-f28-gm-oss | 3 | PASS: waveMtf.maxAbs 1.40e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.20e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.44e-10 (3 of 3) |
| catalog-sony-fe-50-150mm-f2-gm-wide | 3 | PASS: waveMtf.maxAbs 3.18e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.73e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.10e-10 (3 of 3) |
| catalog-sony-fe-50-150mm-f2-gm-tele | 3 | PASS: waveMtf.maxAbs 1.09e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.86e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.57e-10 (2 of 3) |
| catalog-sony-fe-50mm-f12-gm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-50mm-f14-gm | 3 | PASS: waveMtf.maxAbs 1.70e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.23e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.25e-10 (2 of 3) |
| catalog-sony-fe-600mm-f4-gm-oss | 3 | PASS: waveMtf.maxAbs 2.19e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.49e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.01e-11 (2 of 3) |
| catalog-sony-fe-70-200-f28-gm-oss-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-70-200-f28-gm-oss-tele | 3 | PASS: waveMtf.maxAbs 2.65e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.64e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.01e-10 (2 of 3) |
| catalog-sony-fe-70-200mm-f28-gm-ii-wide | 3 | PASS: waveMtf.maxAbs 5.13e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.36e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.63e-10 (1 of 3) |
| catalog-sony-fe-70-200mm-f28-gm-ii-tele | 3 | PASS: waveMtf.maxAbs 2.42e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.85e-10 (1 of 3) | PASS: waveMtf.maxAbs 3.91e-10 (1 of 3) |
| catalog-sony-fe-70-200mm-f4-g-oss-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-70-200mm-f4-g-oss-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-wide | 3 | PASS: waveMtf.maxAbs 7.94e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.15e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.25e-10 (2 of 3) |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | 3 | PASS: waveMtf.maxAbs 1.24e-9 (3 of 3) | PASS: waveMtf.maxAbs 1.27e-9 (3 of 3) | PASS: waveMtf.maxAbs 2.55e-10 (3 of 3) |
| catalog-sony-fe-85-f14-gm-ii | 3 | PASS: waveMtf.maxAbs 2.90e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.70e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.78e-11 (1 of 3) |
| catalog-sony-fe-85mm-f14-gm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-fe-90mm-f2p8-macro | 3 | PASS: waveMtf.maxAbs 8.90e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.29e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.35e-10 (1 of 3) |
| catalog-sony-fe-pz-16-35-f4-g-wide | 3 | PASS: waveMtf.maxAbs 4.92e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.69e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.65e-10 (1 of 3) |
| catalog-sony-fe-pz-16-35-f4-g-tele | 3 | PASS: waveMtf.maxAbs 9.52e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.06e-9 (2 of 3) | PASS: waveMtf.maxAbs 1.06e-9 (2 of 3) |
| catalog-sony-planar-fe-50f14-za | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-planar-t-50f14-za | 3 | PASS: waveMtf.maxAbs 4.44e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.11e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.07e-10 (1 of 3) |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-wide | 3 | PASS: waveMtf.maxAbs 3.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.49e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.20e-11 (3 of 3) |
| catalog-sony-sal-70-300mm-f45-56-g-ssm-tele | 3 | PASS: waveMtf.maxAbs 2.40e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.55e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.24e-11 (3 of 3) |
| catalog-sony-sal-70-400mm-f4-56-g-wide | 3 | PASS: waveMtf.maxAbs 3.89e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.16e-11 (2 of 3) |
| catalog-sony-sal-70-400mm-f4-56-g-tele | 3 | PASS: waveMtf.maxAbs 5.09e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.43e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.10e-11 (3 of 3) |
| catalog-sony-sel30mmf35 | 3 | PASS: waveMtf.maxAbs 1.44e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.36e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.44e-11 (1 of 3) |
| catalog-sony-sonnar-fe-35-f28-za | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-sonnar-fe-55f18-za | 3 | PASS: waveMtf.maxAbs 1.30e-11 (1 of 3) | PASS: waveMtf.maxAbs 4.17e-10 (1 of 3) | PASS: waveMtf.maxAbs 4.05e-10 (1 of 3) |
| catalog-sony-vario-sonnar-88-733f28-rx10-wide | 3 | PASS: waveMtf.maxAbs 2.02e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.32e-10 (3 of 3) | PASS: waveMtf.maxAbs 5.27e-10 (3 of 3) |
| catalog-sony-vario-sonnar-88-733f28-rx10-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-sony-vario-sonnar-t-24-70mm-f28-za-ssm-tele | 3 | PASS: waveMtf.maxAbs 2.17e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.04e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.00e-10 (1 of 3) |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-wide | 3 | PASS: waveMtf.maxAbs 1.62e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.81e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.86e-10 (2 of 3) |
| catalog-sony-vario-sonnar-t-dt-16-80-f3-5-4-5-za-tele | 3 | PASS: waveMtf.maxAbs 3.36e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.56e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.44e-10 (3 of 3) |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-wide | 3 | PASS: waveMtf.maxAbs 6.99e-10 (2 of 3) | PASS: waveMtf.maxAbs 5.87e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.24e-9 (2 of 3) |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-tele | 3 | PASS: waveMtf.maxAbs 5.87e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.84e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.78e-10 (1 of 3) |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-wide | 3 | PASS: waveMtf.maxAbs 2.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 7.84e-10 (2 of 3) | PASS: waveMtf.maxAbs 8.00e-10 (2 of 3) |
| catalog-sony-vario-tessar-t-fe-24-70-f4-za-oss-tele | 3 | PASS: waveMtf.maxAbs 2.10e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.13e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.32e-10 (2 of 3) |
| catalog-sony-vario-tessar-te-1670f4-za-oss-wide | 3 | PASS: waveMtf.maxAbs 1.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.49e-10 (1 of 3) |
| catalog-sony-vario-tessar-te-1670f4-za-oss-tele | 3 | PASS: waveMtf.maxAbs 6.91e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.57e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.60e-10 (1 of 3) |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-wide | 3 | PASS: waveMtf.maxAbs 3.33e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.77e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.25e-10 (2 of 3) |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-tele | 3 | PASS: waveMtf.maxAbs 4.67e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.90e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.76e-10 (2 of 3) |
| catalog-tamron-a001-70-200mm-f28-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-a001-70-200mm-f28-tele | 3 | PASS: waveMtf.maxAbs 1.74e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.69e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.68e-11 (2 of 3) |
| catalog-tamron-a005-70-300-f4-5-6-vc-wide | 3 | PASS: waveMtf.maxAbs 2.41e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.99e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.83e-11 (3 of 3) |
| catalog-tamron-a005-70-300-f4-5-6-vc-tele | 3 | PASS: waveMtf.maxAbs 3.48e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.18e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.82e-11 (1 of 3) |
| catalog-tamron-a010-28-300-f35-63-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-a010-28-300-f35-63-tele | 3 | PASS: waveMtf.maxAbs 3.01e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.08e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.03e-10 (1 of 3) |
| catalog-tamron-a03-28-200mm-f3p8-5p6-wide | 3 | PASS: waveMtf.maxAbs 2.18e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.40e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.43e-10 (1 of 3) |
| catalog-tamron-a03-28-200mm-f3p8-5p6-tele | 3 | PASS: waveMtf.maxAbs 2.58e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.76e-10 (3 of 3) | PASS: waveMtf.maxAbs 1.77e-10 (3 of 3) |
| catalog-tamron-a056-70-180-f28-wide | 3 | PASS: waveMtf.maxAbs 3.03e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.72e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.68e-10 (3 of 3) |
| catalog-tamron-a056-70-180-f28-tele | 3 | PASS: waveMtf.maxAbs 4.88e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.41e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.95e-10 (2 of 3) |
| catalog-tamron-a061-28-300-f35-63-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-a061-28-300-f35-63-tele | 3 | PASS: waveMtf.maxAbs 3.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 2.49e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.44e-10 (1 of 3) |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-wide | 3 | PASS: waveMtf.maxAbs 8.11e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.30e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.37e-10 (2 of 3) |
| catalog-tamron-a062-20-40mm-f28-di-iii-vxd-tele | 3 | PASS: waveMtf.maxAbs 1.64e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.26e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.18e-10 (2 of 3) |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-wide | 3 | PASS: waveMtf.maxAbs 4.57e-10 (3 of 3) | PASS: waveMtf.maxAbs 3.99e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.29e-10 (3 of 3) |
| catalog-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-tele | 3 | PASS: waveMtf.maxAbs 3.39e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.51e-10 (3 of 3) | PASS: waveMtf.maxAbs 2.64e-10 (3 of 3) |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-wide | 3 | PASS: waveMtf.maxAbs 1.02e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.10e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.35e-11 (2 of 3) |
| catalog-tamron-a069-50-300mm-f4-5-6-3-di-iii-vc-vxd-tele | 3 | PASS: waveMtf.maxAbs 4.06e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.63e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.46e-11 (2 of 3) |
| catalog-tamron-a08-200500mm-f563-wide | 3 | PASS: waveMtf.maxAbs 5.77e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.70e-11 (3 of 3) | PASS: waveMtf.maxAbs 5.22e-11 (3 of 3) |
| catalog-tamron-a08-200500mm-f563-tele | 3 | PASS: waveMtf.maxAbs 3.11e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.03e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.46e-11 (2 of 3) |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-wide | 3 | PASS: waveMtf.maxAbs 2.40e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.89e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.02e-10 (2 of 3) |
| catalog-tamron-b003-18-270mm-f35-63-di-ii-vc-tele | 3 | PASS: waveMtf.maxAbs 2.05e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.14e-10 (2 of 3) | PASS: waveMtf.maxAbs 9.40e-11 (2 of 3) |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-wide | 3 | PASS: waveMtf.maxAbs 4.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.43e-10 (1 of 3) | PASS: waveMtf.maxAbs 5.75e-10 (1 of 3) |
| catalog-tamron-b011-18-200mm-f35-63-di-iii-vc-tele | 3 | PASS: waveMtf.maxAbs 2.04e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.55e-10 (3 of 3) | PASS: waveMtf.maxAbs 7.60e-10 (3 of 3) |
| catalog-tamron-b028-18-400-f35-63-wide | 3 | PASS: waveMtf.maxAbs 3.75e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.72e-10 (2 of 3) | PASS: waveMtf.maxAbs 1.37e-10 (2 of 3) |
| catalog-tamron-b028-18-400-f35-63-tele | 3 | PASS: waveMtf.maxAbs 6.63e-10 (2 of 3) | PASS: waveMtf.maxAbs 6.84e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.52e-10 (2 of 3) |
| catalog-tamron-c001-14-150mm-f3p5-5p8-wide | 3 | PASS: waveMtf.maxAbs 2.29e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.16e-10 (2 of 3) | PASS: waveMtf.maxAbs 2.27e-10 (2 of 3) |
| catalog-tamron-c001-14-150mm-f3p5-5p8-tele | 3 | PASS: waveMtf.maxAbs 1.13e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.38e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.43e-10 (2 of 3) |
| catalog-tamron-f072-90mm-f28-di-iii-macro-vxd | 3 | PASS: waveMtf.maxAbs 1.74e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.17e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.21e-11 (1 of 3) |
| catalog-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-sp-a007-24-70mm-f28-vc-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-sp-a007-24-70mm-f28-vc-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-wide | 3 | PASS: waveMtf.maxAbs 7.37e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.11e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.85e-11 (1 of 3) |
| catalog-tamron-sp-a009-70-200mm-f28-vc-usd-tele | 3 | PASS: waveMtf.maxAbs 2.24e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.22e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.38e-11 (2 of 3) |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-wide | 3 | PASS: waveMtf.maxAbs 8.10e-11 (3 of 3) | PASS: waveMtf.maxAbs 7.32e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.69e-11 (3 of 3) |
| catalog-tamron-sp-a011-150-600mm-f5-63-vc-tele | 3 | PASS: waveMtf.maxAbs 4.58e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.98e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.20e-11 (2 of 3) |
| catalog-tamron-sp-af-17-50mm-f28-a16-wide | 3 | PASS: waveMtf.maxAbs 1.82e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.07e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.89e-10 (1 of 3) |
| catalog-tamron-sp-af-17-50mm-f28-a16-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-sp-af-180mm-f35-di | 3 | PASS: waveMtf.maxAbs 3.29e-11 (3 of 3) | PASS: waveMtf.maxAbs 2.78e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.84e-11 (3 of 3) |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-sp-af-28-75-f28-xr-di-a09-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tamron-sp-af-60mm-f2-di-ii-macro | 3 | PASS: waveMtf.maxAbs 1.24e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.06e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.32e-11 (3 of 3) |
| catalog-thypoch-ksana-21mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-thypoch-simera-50mm-f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-tokina-at-x-70-200mm-f4-pro-fx-vcm-s-tele | 3 | PASS: waveMtf.maxAbs 4.44e-11 (3 of 3) | PASS: waveMtf.maxAbs 4.25e-11 (3 of 3) | PASS: waveMtf.maxAbs 3.43e-11 (3 of 3) |
| catalog-ultron-28f2-asph | 3 | PASS: waveMtf.maxAbs 6.05e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.60e-10 (1 of 3) | PASS: waveMtf.maxAbs 2.55e-10 (1 of 3) |
| catalog-ultron-50f2 | 3 | PASS: waveMtf.maxAbs 1.17e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.60e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.00e-11 (1 of 3) |
| catalog-vario-prakticar-35-70mm-f27-35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vario-prakticar-35-70mm-f27-35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-varisoft-rokkor-85f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-14mm-f4-air | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-23mm-f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-27mm-f12-pro-xf | 3 | PASS: waveMtf.maxAbs 1.03e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.15e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.24e-10 (1 of 3) |
| catalog-viltrox-af-33mm-f14-e | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-35f18-fe | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-50mm-f14-pro | 3 | PASS: waveMtf.maxAbs 5.35e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.06e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.10e-10 (1 of 3) |
| catalog-viltrox-af-50mm-f18-fe | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-56mm-f14-e | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-75mm-f12-pro | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-af-85mm-f14-pro | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-viltrox-mf-20mm-f18-fe | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-s1-35-85-f28-wide | 2 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-s1-35-85-f28-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-s1-70-210-f28-4-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-s1-70-210-f28-4-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-series-1-135mm-f2-3 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-series-1-70-210-f35-wide | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-series-1-70-210-f35-tele | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-vivitar-series1-200f3 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-apo-lanthar-180-f4 | 3 | PASS: waveMtf.maxAbs 1.84e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.37e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.74e-11 (1 of 3) |
| catalog-voigtlander-apo-lanthar-210mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-apo-lanthar-28mm-f2-aspherical-vm | 3 | PASS: waveMtf.maxAbs 1.64e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.47e-10 (1 of 3) | PASS: waveMtf.maxAbs 1.50e-10 (1 of 3) |
| catalog-voigtlander-apo-lanthar-50mm-f35-vm | 3 | PASS: waveMtf.maxAbs 6.48e-12 (2 of 3) | PASS: waveMtf.maxAbs 5.89e-12 (2 of 3) | PASS: waveMtf.maxAbs 6.99e-12 (2 of 3) |
| catalog-voigtlander-apo-skopar-90f28 | 3 | PASS: waveMtf.maxAbs 1.07e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.92e-12 (2 of 3) | PASS: waveMtf.maxAbs 7.17e-12 (2 of 3) |
| catalog-voigtlander-apo-ultron-vm-90mm-f2 | 3 | PASS: waveMtf.maxAbs 4.57e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.31e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.69e-12 (1 of 3) |
| catalog-voigtlander-cine-tele-anastigmat-100mm-f45 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-color-heliar-105mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-color-skopar-105mm-f35 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis | 3 | PASS: waveMtf.maxAbs 8.30e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.56e-11 (1 of 3) | PASS: waveMtf.maxAbs 3.01e-11 (1 of 3) |
| catalog-voigtlander-color-skopar-vm-35mm-f35-aspherical | 3 | PASS: waveMtf.maxAbs 1.15e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.95e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.98e-11 (1 of 3) |
| catalog-voigtlander-dynar-f6-normalized-fd100 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-heliar-100mm-f4-5-second-asymmetric | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-macro-apo-lanthar-125-f25 | 3 | PASS: waveMtf.maxAbs 1.18e-11 (1 of 3) | PASS: waveMtf.maxAbs 6.40e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.22e-12 (1 of 3) |
| catalog-voigtlander-nokton-35-f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-nokton-50f15 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-nokton-50f15-aspherical-ii-vm | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-nokton-50mm-f15-aspherical-l39 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-nokton-60mm-f095-mft | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-nokton-vintage-line-vm-75mm-f1-5-aspherical | 3 | PASS: waveMtf.maxAbs 1.07e-12 (1 of 3) | PASS: waveMtf.maxAbs 8.20e-11 (1 of 3) | PASS: waveMtf.maxAbs 8.19e-11 (1 of 3) |
| catalog-voigtlander-nokton-x-50f12 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-portrait-heliar-75f18 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-skoparex-35f34-bessamatic | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-super-dynarex-200mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-voigtlander-super-wide-heliar-15mm-f45-aspherical-sl | 3 | PASS: waveMtf.maxAbs 1.02e-11 (2 of 3) | PASS: waveMtf.maxAbs 4.32e-10 (2 of 3) | PASS: waveMtf.maxAbs 4.38e-10 (2 of 3) |
| catalog-voigtlander-tele-dynar-100mm-f63 | 3 | PASS: waveMtf.maxAbs 2.78e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.70e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.27e-12 (1 of 3) |
| catalog-voigtlander-telomar-100mm-f55 | 3 | PASS: waveMtf.maxAbs 9.01e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.43e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.94e-12 (1 of 3) |
| catalog-voigtlander-telomar-180mm-f55 | 3 | PASS: waveMtf.maxAbs 7.12e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.36e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.42e-11 (1 of 3) |
| catalog-voigtlander-ultra-wide-heliar-12mm-f56-aspherical-l39 | 3 | PASS: waveMtf.maxAbs 2.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 8.83e-12 (2 of 3) | PASS: waveMtf.maxAbs 2.19e-11 (2 of 3) |
| catalog-voigtlander-ultron-27mm-f2 | 3 | PASS: waveMtf.maxAbs 2.70e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.78e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.82e-12 (1 of 3) |
| catalog-voigtlander-ultron-35mm-f17-aspherical-l39 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-yashica-auto-yashinon-ds-20mm-f33 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-yashica-ml-24mm-f2-8 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-yashica-ml-300mm-f56 | 3 | PASS: waveMtf.maxAbs 2.32e-11 (2 of 3) | PASS: waveMtf.maxAbs 1.66e-11 (2 of 3) | PASS: waveMtf.maxAbs 2.91e-11 (2 of 3) |
| catalog-yashica-yashinon-dx-21mm-f3-3 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-batis-18f28 | 3 | PASS: waveMtf.maxAbs 7.82e-12 (2 of 3) | PASS: waveMtf.maxAbs 3.25e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (2 of 3) |
| catalog-zeiss-batis-40mm-f2-cf | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-batis-85f18 | 3 | PASS: waveMtf.maxAbs 6.72e-12 (2 of 3) | PASS: waveMtf.maxAbs 1.47e-11 (2 of 3) | PASS: waveMtf.maxAbs 9.05e-12 (2 of 3) |
| catalog-zeiss-biogon-21-f45 | 3 | PASS: waveMtf.maxAbs 4.52e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.46e-12 (1 of 3) | PASS: waveMtf.maxAbs 4.78e-12 (1 of 3) |
| catalog-zeiss-biogon-35mm-f28-prewar | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-biotar-50f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-distagon-28mm-f2 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-distagon-35f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-distagon-35mm-f4-contarex | 3 | PASS: waveMtf.maxAbs 1.42e-11 (2 of 3) | PASS: waveMtf.maxAbs 6.51e-12 (2 of 3) | PASS: waveMtf.maxAbs 8.91e-12 (2 of 3) |
| catalog-zeiss-flektogon-50mm-f4 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-hologon-15f8 | 3 | PASS: waveMtf.maxAbs 1.90e-12 (1 of 3) | PASS: waveMtf.maxAbs 1.47e-12 (1 of 3) | PASS: waveMtf.maxAbs 2.09e-12 (1 of 3) |
| catalog-zeiss-jena-sonnar-50f15-us2186621 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-olympia-sonnar-180f28-contarex | 3 | PASS: waveMtf.maxAbs 2.23e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.62e-11 (1 of 3) | PASS: waveMtf.maxAbs 1.42e-11 (1 of 3) |
| catalog-zeiss-planar-50f14-praktica | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-planar-80f28 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-planar-t-50f14 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-pro-tessar-35f32 | 3 | PASS: waveMtf.maxAbs 8.44e-12 (1 of 3) | PASS: waveMtf.maxAbs 9.92e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.31e-12 (1 of 3) |
| catalog-zeiss-s-biogon-40f56 | 3 | PASS: waveMtf.maxAbs 1.27e-11 (2 of 3) | PASS: waveMtf.maxAbs 5.56e-12 (2 of 3) | PASS: waveMtf.maxAbs 8.89e-12 (2 of 3) |
| catalog-zeiss-sonnar-35f2-sony-rx1 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-sonnar-40f28-rollei | 3 | PASS: waveMtf.maxAbs 7.77e-12 (1 of 3) | PASS: waveMtf.maxAbs 3.06e-12 (1 of 3) | PASS: waveMtf.maxAbs 7.00e-12 (1 of 3) |
| catalog-zeiss-sonnar-superachromat-250f56 | 3 | PASS: waveMtf.maxAbs 4.83e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.55e-11 (3 of 3) | PASS: waveMtf.maxAbs 6.63e-11 (3 of 3) |
| catalog-zeiss-tessar-144f55 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-touit-50mm-f28-macro | 3 | PASS: waveMtf.maxAbs 1.35e-11 (3 of 3) | PASS: waveMtf.maxAbs 1.00e-10 (3 of 3) | PASS: waveMtf.maxAbs 9.06e-11 (3 of 3) |
| catalog-zeiss-ultra-prime-135-t19 | 3 | PASS: no judged figure | PASS: no judged figure | PASS: no judged figure |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-wide | 3 | PASS: waveMtf.maxAbs 5.04e-12 (1 of 3) | PASS: waveMtf.maxAbs 5.37e-10 (1 of 3) | PASS: waveMtf.maxAbs 5.42e-10 (1 of 3) |
| catalog-zeiss-vario-sonnar-t-104-371mm-f18-49-rx100m1-2-tele | 3 | PASS: waveMtf.maxAbs 5.04e-12 (3 of 3) | PASS: waveMtf.maxAbs 4.09e-10 (3 of 3) | PASS: waveMtf.maxAbs 4.07e-10 (3 of 3) |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-wide | 2 | PASS: waveMtf.maxAbs 1.78e-12 (1 of 2) | PASS: waveMtf.maxAbs 5.52e-10 (1 of 2) | PASS: waveMtf.maxAbs 5.51e-10 (1 of 2) |
| catalog-zeiss-vario-sonnar-t-9-72-f28-45-sony-rx100m6-m7-tele | 3 | PASS: waveMtf.maxAbs 1.19e-11 (1 of 3) | PASS: waveMtf.maxAbs 5.43e-10 (1 of 3) | PASS: waveMtf.maxAbs 5.37e-10 (1 of 3) |
| catalog-zeiss-zx1-distagon-35mm-f2 | 3 | PASS: waveMtf.maxAbs 1.17e-11 (2 of 3) | PASS: waveMtf.maxAbs 3.20e-10 (2 of 3) | PASS: waveMtf.maxAbs 3.21e-10 (2 of 3) |

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
