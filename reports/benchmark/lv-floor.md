# Numerical floor of lv against ref: benchmark

Every pair of `lv` and `ref` of the suite, rung by rung: the largest value of each metric
over the requests of a run (its fields and lines), the verdicts those pairs came to, and how the rays of each
engine ended. A metric counted in rays or elements is added up over the requests. Nothing here is traced or
authored data: only results, counts, run names and hashes. The hash of a run's case is that of the system and
the conditions that were traced: it says what the figures are of, whatever the lens files have become since.

## Inputs

| Input | Value |
|---|---|
| Suite | benchmark |
| Suite hash | 27333fa1ef567a2ac3310215fc3e886a6ba2aa55f30c5177c6d6d951fb067b09 |
| Contract version | 1.0 |
| Policy | rungs v3 |
| Policy hash | f410813933d1b8a408aaa2c0d912802e10b818c83940926b1d9b1516e98da902 |

| Engine | Fingerprint | Adapter revision | Details |
|---|---|---|---|
| lv | f6681074924b98ec737648984fc0b25fb6b538918c4e02e65619e9bbf3978144 | f301b8f2ae8f2d5c9a750f1e3c4d741fda5fb5cb13c901706c06c6e57a9a4ea3 | commit c3fc5a2d6dc16b0b0a8ec7923f47b171b157e9a4, dirty true, engineFileCount 142 |
| ref | 8f34b4024051313a54e487f265ee755bcc3778eb6422049d95d0765afd5d2486 | 7b80637836e8f618bdd91f200d8614d78b162716a22a6ace42deb63531fb5da3 | sourceFiles 12 |

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

## Worst figures

### r0

Quantity `system.describe`: 24 pairs, 24 PASS.

| Metric | Worst, or total | Run | Where |
|---|---|---|---|
| layout.mismatches (≤ 0 elements) | 0 | — | — |
| shape.mismatches (≤ 0 elements) | 0 | — | — |
| aperture.mismatches (≤ 0 elements) | 0 | — | — |
| index.mismatches (≤ 0 elements) | 0 | — | — |
| sag.maxScaled (≤ 1.00e-12) | 3.97e-16 | sony-fe-20mm-f18-g-ref | sample 8, surface 6 |
| sag.maxAbs [mm] | 3.55e-15 | sony-fe-400mm-f28-gm-oss-ref | sample 8, surface 13 |

### r1

Quantity `paraxial.first-order`: 24 pairs, 24 PASS.

| Metric | Worst, or total | Run | Where |
|---|---|---|---|
| firstOrder.maxAbs (≤ 1.00e-9 mm) | 1.59e-12 | sony-fe-400mm-f28-gm-oss-photopic | line 1, quantity frontFocalZ |
| pupilZ.maxScaled (≤ 1.00e-9 mm) | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |
| pupilZ.maxAbs [mm] | 3.41e-13 | sony-fe-400mm-f28-gm-oss-photopic | line 3, quantity entrancePupilZ |

### r2

Quantity `rays.trace`: 216 pairs, 216 PASS.

| Metric | Worst, or total | Run | Where |
|---|---|---|---|
| hits.maxDistance (≤ 1.00e-8 mm) | 6.77e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 177, surface 23 |
| direction.maxAbs (≤ 1.00e-9) | 3.13e-10 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| landing.maxDistance (≤ 1.00e-8 mm) | 9.12e-9 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 4, ray 164 |
| mask.mismatches (≤ 0 rays) | 0 | — | — |
| mask.rimBand [rays] | 0 | — | — |
| rays.compared [rays] | 137596 | — | — |

### r3

Quantity `rays.trace`: 216 pairs, 216 PASS.

| Metric | Worst, or total | Run | Where |
|---|---|---|---|
| opticalPath.maxAbs (≤ 2.00e-5 waves) | 6.00e-6 | sigma-35mm-f14-dg-hsm-a-photopic | field 3.19e1, line 2, ray 200 |
| opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | 5.33e-6 | sony-fe-20mm-f18-g-photopic | field 4.75e1, line 1, ray 579 |
| opd.maxAbs (≤ 2.00e-5 waves) | 5.52e-6 | nikon-z-24-70f4s-tele-photopic | field 1.66e1, line 1, ray 197 |

## By run

### r0

| Run | Requests | Verdicts | layout.mismatches (≤ 0 elements) | shape.mismatches (≤ 0 elements) | aperture.mismatches (≤ 0 elements) | index.mismatches (≤ 0 elements) | sag.maxScaled (≤ 1.00e-12) | sag.maxAbs [mm] |
|---|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.51e-16 | 1.78e-15 |
| canon-ef-135-f2l-usm-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.51e-16 | 1.78e-15 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.29e-16 | 8.88e-16 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.29e-16 | 8.88e-16 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.29e-16 | 8.88e-16 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.29e-16 | 8.88e-16 |
| nikkor-z50f12-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.90e-16 | 1.78e-15 |
| nikkor-z50f12-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.90e-16 | 1.78e-15 |
| sony-fe-20mm-f18-g-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.97e-16 | 1.78e-15 |
| sony-fe-20mm-f18-g-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 3.97e-16 | 1.78e-15 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.25e-16 | 3.55e-15 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.25e-16 | 3.55e-15 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.10e-16 | 4.44e-16 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.10e-16 | 4.44e-16 |
| nikon-z-24-70f4s-wide-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.00e-16 | 8.88e-16 |
| nikon-z-24-70f4s-wide-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.00e-16 | 8.88e-16 |
| nikon-z-24-70f4s-tele-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.00e-16 | 8.88e-16 |
| nikon-z-24-70f4s-tele-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.00e-16 | 8.88e-16 |
| nikon-z-mc-105f28-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.11e-16 | 8.88e-16 |
| nikon-z-mc-105f28-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.11e-16 | 8.88e-16 |
| nikon-z-135f18-plena-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.74e-16 | 1.78e-15 |
| nikon-z-135f18-plena-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.74e-16 | 1.78e-15 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.26e-16 | 4.44e-16 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | 1 PASS | 0 | 0 | 0 | 0 | 2.26e-16 | 4.44e-16 |

### r1

| Run | Requests | Verdicts | firstOrder.maxAbs (≤ 1.00e-9 mm) | pupilZ.maxScaled (≤ 1.00e-9 mm) | pupilZ.maxAbs [mm] |
|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 1 | 1 PASS | 2.70e-13 | 5.68e-14 | 5.68e-14 |
| canon-ef-135-f2l-usm-photopic | 1 | 1 PASS | 1.14e-13 | 7.11e-14 | 7.11e-14 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 1 | 1 PASS | 1.42e-14 | 1.42e-14 | 1.42e-14 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 1 | 1 PASS | 4.26e-14 | 4.26e-14 | 4.26e-14 |
| sigma-35mm-f14-dg-hsm-a-ref | 1 | 1 PASS | 3.55e-14 | 6.39e-14 | 6.39e-14 |
| sigma-35mm-f14-dg-hsm-a-photopic | 1 | 1 PASS | 4.26e-14 | 7.82e-14 | 7.82e-14 |
| nikkor-z50f12-ref | 1 | 1 PASS | 7.11e-14 | 1.42e-14 | 1.42e-14 |
| nikkor-z50f12-photopic | 1 | 1 PASS | 5.68e-14 | 3.55e-14 | 3.55e-14 |
| sony-fe-20mm-f18-g-ref | 1 | 1 PASS | 2.84e-14 | 7.11e-15 | 7.11e-15 |
| sony-fe-20mm-f18-g-photopic | 1 | 1 PASS | 3.55e-14 | 1.07e-14 | 1.07e-14 |
| sony-fe-400mm-f28-gm-oss-ref | 1 | 1 PASS | 5.68e-14 | 2.27e-13 | 2.27e-13 |
| sony-fe-400mm-f28-gm-oss-photopic | 1 | 1 PASS | 1.59e-12 | 3.41e-13 | 3.41e-13 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 1 | 1 PASS | 2.84e-14 | 2.84e-14 | 2.84e-14 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 1 | 1 PASS | 1.14e-13 | 7.11e-14 | 7.11e-14 |
| nikon-z-24-70f4s-wide-ref | 1 | 1 PASS | 1.42e-14 | 2.84e-14 | 2.84e-14 |
| nikon-z-24-70f4s-wide-photopic | 1 | 1 PASS | 5.68e-14 | 2.84e-14 | 2.84e-14 |
| nikon-z-24-70f4s-tele-ref | 1 | 1 PASS | 1.44e-13 | 4.26e-14 | 4.26e-14 |
| nikon-z-24-70f4s-tele-photopic | 1 | 1 PASS | 1.42e-13 | 5.68e-14 | 5.68e-14 |
| nikon-z-mc-105f28-ref | 1 | 1 PASS | 5.68e-14 | 2.84e-14 | 2.84e-14 |
| nikon-z-mc-105f28-photopic | 1 | 1 PASS | 2.13e-13 | 4.26e-14 | 4.26e-14 |
| nikon-z-135f18-plena-ref | 1 | 1 PASS | 5.68e-14 | 1.42e-14 | 1.42e-14 |
| nikon-z-135f18-plena-photopic | 1 | 1 PASS | 2.84e-13 | 4.26e-14 | 4.26e-14 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 1 | 1 PASS | 1.42e-14 | 7.11e-15 | 7.11e-15 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 1 | 1 PASS | 3.20e-14 | 2.13e-14 | 2.13e-14 |

### r2

| Run | Requests | Verdicts | hits.maxDistance (≤ 1.00e-8 mm) | direction.maxAbs (≤ 1.00e-9) | landing.maxDistance (≤ 1.00e-8 mm) | mask.mismatches (≤ 0 rays) | mask.rimBand [rays] | rays.compared [rays] | lv rays ok / blocked / failed | ref rays ok / blocked / failed |
|---|---|---|---|---|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | 3 PASS | 1.13e-9 | 5.80e-12 | 1.28e-9 | 0 | 0 | 1667 | 1667 / 1438 / 0 | 1667 / 1438 / 0 |
| canon-ef-135-f2l-usm-photopic | 15 | 15 PASS | 1.14e-9 | 5.87e-12 | 1.02e-9 | 0 | 0 | 8379 | 8379 / 7146 / 0 | 8379 / 7146 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | 3 PASS | 2.02e-9 | 1.16e-11 | 1.20e-9 | 0 | 0 | 2043 | 2043 / 1272 / 0 | 2043 / 1272 / 0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | 15 PASS | 2.00e-9 | 1.28e-11 | 1.22e-9 | 0 | 0 | 10239 | 10239 / 6336 / 0 | 10239 / 6336 / 0 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | 3 PASS | 3.40e-9 | 1.27e-10 | 3.95e-9 | 0 | 0 | 1721 | 1721 / 1452 / 0 | 1721 / 1452 / 0 |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | 15 PASS | 6.77e-9 | 3.13e-10 | 9.12e-9 | 0 | 0 | 8591 | 8591 / 7274 / 0 | 8591 / 7274 / 0 |
| nikkor-z50f12-ref | 3 | 3 PASS | 1.27e-9 | 1.08e-11 | 5.11e-10 | 0 | 0 | 1661 | 1661 / 1444 / 0 | 1661 / 1444 / 0 |
| nikkor-z50f12-photopic | 15 | 15 PASS | 1.30e-9 | 1.29e-11 | 5.79e-10 | 0 | 0 | 8341 | 8341 / 7184 / 0 | 8341 / 7184 / 0 |
| sony-fe-20mm-f18-g-ref | 3 | 3 PASS | 1.45e-9 | 5.19e-11 | 2.18e-9 | 0 | 0 | 2301 | 2301 / 1338 / 0 | 2301 / 1338 / 0 |
| sony-fe-20mm-f18-g-photopic | 15 | 15 PASS | 1.58e-9 | 5.76e-11 | 2.67e-9 | 0 | 0 | 11517 | 11517 / 6678 / 0 | 11517 / 6678 / 0 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | 3 PASS | 1.19e-9 | 9.19e-12 | 8.40e-10 | 0 | 0 | 1885 | 1885 / 1440 / 0 | 1885 / 1440 / 0 |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | 15 PASS | 1.19e-9 | 9.56e-12 | 9.18e-10 | 0 | 0 | 9471 | 9471 / 7154 / 0 | 9471 / 7154 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | 3 PASS | 1.32e-9 | 8.45e-12 | 8.40e-10 | 0 | 0 | 1901 | 1901 / 1414 / 0 | 1901 / 1414 / 0 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | 15 PASS | 1.33e-9 | 8.52e-12 | 8.44e-10 | 0 | 0 | 9487 | 9487 / 7088 / 0 | 9487 / 7088 / 0 |
| nikon-z-24-70f4s-wide-ref | 3 | 3 PASS | 3.07e-9 | 4.58e-11 | 1.23e-9 | 0 | 0 | 2215 | 2215 / 1280 / 0 | 2215 / 1280 / 0 |
| nikon-z-24-70f4s-wide-photopic | 15 | 15 PASS | 3.09e-9 | 4.87e-11 | 1.25e-9 | 0 | 0 | 11061 | 11061 / 6774 / 0 | 11061 / 6774 / 0 |
| nikon-z-24-70f4s-tele-ref | 3 | 3 PASS | 1.21e-9 | 1.64e-11 | 1.16e-9 | 0 | 0 | 1929 | 1929 / 1242 / 0 | 1929 / 1242 / 0 |
| nikon-z-24-70f4s-tele-photopic | 15 | 15 PASS | 1.24e-9 | 1.84e-11 | 1.24e-9 | 0 | 0 | 9631 | 9631 / 6224 / 0 | 9631 / 6224 / 0 |
| nikon-z-mc-105f28-ref | 3 | 3 PASS | 1.27e-9 | 1.06e-11 | 6.04e-10 | 0 | 0 | 1751 | 1751 / 1278 / 0 | 1751 / 1278 / 0 |
| nikon-z-mc-105f28-photopic | 15 | 15 PASS | 1.29e-9 | 1.08e-11 | 6.07e-10 | 0 | 0 | 8755 | 8755 / 6390 / 0 | 8755 / 6390 / 0 |
| nikon-z-135f18-plena-ref | 3 | 3 PASS | 1.29e-9 | 8.58e-12 | 7.79e-10 | 0 | 0 | 2005 | 2005 / 1454 / 0 | 2005 / 1454 / 0 |
| nikon-z-135f18-plena-photopic | 15 | 15 PASS | 1.27e-9 | 9.01e-12 | 8.28e-10 | 0 | 0 | 10021 | 10021 / 6914 / 0 | 10021 / 6914 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | 3 PASS | 1.16e-9 | 1.39e-11 | 9.19e-10 | 0 | 0 | 1839 | 1839 / 1332 / 0 | 1839 / 1332 / 0 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | 15 PASS | 1.22e-9 | 1.58e-11 | 9.38e-10 | 0 | 0 | 9185 | 9185 / 6670 / 0 | 9185 / 6670 / 0 |

### r3

| Run | Requests | Verdicts | opticalPath.maxAbs (≤ 2.00e-5 waves) | opticalPathToImage.maxAbs (≤ 2.00e-5 waves) | opd.maxAbs (≤ 2.00e-5 waves) |
|---|---|---|---|---|---|
| canon-ef-135-f2l-usm-ref | 3 | 3 PASS | 2.31e-6 | 2.33e-6 | 2.48e-6 |
| canon-ef-135-f2l-usm-photopic | 15 | 15 PASS | 4.71e-6 | 4.80e-6 | 4.99e-6 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 3 | 3 PASS | 4.41e-6 | 4.41e-6 | 4.47e-6 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 15 | 15 PASS | 4.72e-6 | 4.72e-6 | 4.80e-6 |
| sigma-35mm-f14-dg-hsm-a-ref | 3 | 3 PASS | 4.22e-6 | 3.28e-6 | 3.29e-6 |
| sigma-35mm-f14-dg-hsm-a-photopic | 15 | 15 PASS | 6.00e-6 | 4.85e-6 | 4.48e-6 |
| nikkor-z50f12-ref | 3 | 3 PASS | 3.38e-6 | 3.38e-6 | 3.38e-6 |
| nikkor-z50f12-photopic | 15 | 15 PASS | 3.64e-6 | 3.64e-6 | 3.61e-6 |
| sony-fe-20mm-f18-g-ref | 3 | 3 PASS | 3.25e-6 | 3.95e-6 | 3.99e-6 |
| sony-fe-20mm-f18-g-photopic | 15 | 15 PASS | 4.90e-6 | 5.33e-6 | 4.80e-6 |
| sony-fe-400mm-f28-gm-oss-ref | 3 | 3 PASS | 3.18e-6 | 2.71e-6 | 2.95e-6 |
| sony-fe-400mm-f28-gm-oss-photopic | 15 | 15 PASS | 4.13e-6 | 3.52e-6 | 4.05e-6 |
| sigma-105mm-f28-dg-dn-macro-art-ref | 3 | 3 PASS | 4.33e-6 | 2.85e-6 | 3.07e-6 |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 15 | 15 PASS | 5.39e-6 | 3.66e-6 | 4.80e-6 |
| nikon-z-24-70f4s-wide-ref | 3 | 3 PASS | 3.78e-6 | 3.78e-6 | 3.82e-6 |
| nikon-z-24-70f4s-wide-photopic | 15 | 15 PASS | 5.03e-6 | 5.04e-6 | 5.27e-6 |
| nikon-z-24-70f4s-tele-ref | 3 | 3 PASS | 3.05e-6 | 3.05e-6 | 4.89e-6 |
| nikon-z-24-70f4s-tele-photopic | 15 | 15 PASS | 4.13e-6 | 4.13e-6 | 5.52e-6 |
| nikon-z-mc-105f28-ref | 3 | 3 PASS | 2.94e-6 | 2.98e-6 | 2.53e-6 |
| nikon-z-mc-105f28-photopic | 15 | 15 PASS | 3.65e-6 | 3.70e-6 | 3.28e-6 |
| nikon-z-135f18-plena-ref | 3 | 3 PASS | 3.66e-6 | 3.67e-6 | 3.64e-6 |
| nikon-z-135f18-plena-photopic | 15 | 15 PASS | 4.33e-6 | 4.34e-6 | 4.33e-6 |
| sigma-45mm-f28-dg-dn-contemporary-ref | 3 | 3 PASS | 2.41e-6 | 2.41e-6 | 2.41e-6 |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 15 | 15 PASS | 3.01e-6 | 3.00e-6 | 2.69e-6 |
