# Catalog statistics

Both catalog baselines are present; duplicate R4 pairs are counted once.

State statuses use the gravest pair verdict; pair counts use one aggregate per run, rung and engine pair, with feature groups overlapping.

## Status counts

| Scope | States | State statuses | Pair statuses |
|---|---|---|---|
| catalog | 1341 | {"FAIL":12,"PASS":1304,"UNSUPPORTED":25} | {"FAIL":24,"PASS":24878,"UNSUPPORTED":47} |
| Feature: aperture.annular | 6 | {"UNSUPPORTED":6} | {"PASS":47,"UNSUPPORTED":25} |
| Feature: aperture.unclipped | 263 | {"FAIL":2,"PASS":261} | {"FAIL":4,"PASS":4967} |
| Feature: path.folded | 8 | {"UNSUPPORTED":8} | {"PASS":65,"UNSUPPORTED":31} |
| Feature: surface.asphere.even | 648 | {"FAIL":6,"PASS":640,"UNSUPPORTED":2} | {"FAIL":12,"PASS":12178,"UNSUPPORTED":4} |
| Feature: surface.asphere.flat-base | 2 | {"PASS":2} | {"PASS":38} |
| Feature: surface.asphere.odd | 83 | {"FAIL":2,"PASS":81} | {"FAIL":4,"PASS":1573} |
| Feature: surface.conic | 305 | {"FAIL":4,"PASS":301} | {"FAIL":8,"PASS":5787} |
| Feature: surface.diffractive | 8 | {"UNSUPPORTED":8} | {"PASS":80,"UNSUPPORTED":16} |
| Census reason: field-fraction-unresolved | 17 | {"UNSUPPORTED":17} | {"PASS":145,"UNSUPPORTED":47} |
| Census reason: folded-auto-path | 6 | {"UNSUPPORTED":6} | {} |
| Census reason: folded-post-path-reflection | 1 | {"UNSUPPORTED":1} | {} |
| Census reason: mixed-reference | 1 | {"UNSUPPORTED":1} | {} |
| Census reason: off-axis-image-plane | 2 | {"UNSUPPORTED":2} | {} |
| Census reason: outside-modeled-field | 56 | {"PASS":56} | {"PASS":1064} |
| Census reason: surface-profile-unsupported | 2 | {"UNSUPPORTED":2} | {} |
| Census reason: tilted-image-plane | 2 | {"UNSUPPORTED":2} | {} |
| Census reason: tilted-surface | 1 | {"UNSUPPORTED":1} | {} |
| Census reason: unsupported-path | 35 | {"PASS":19,"UNSUPPORTED":16} | {"PASS":259,"UNSUPPORTED":47} |

## Unsupported census

Source codes count distinct states; engine codes count distinct run, rung and engine refusals.

| Code | Source states | Engine rungs |
|---|---|---|
| feature folded-stop-not-visited | 0 | 3 |
| feature lv-folded-first-order-unavailable | 0 | 6 |
| feature optiland-phase-paraxial-unseen | 0 | 8 |
| field-fraction-unresolved | 17 | 0 |
| folded-auto-path | 6 | 0 |
| folded-post-path-reflection | 1 | 0 |
| mixed-reference | 1 | 0 |
| off-axis-image-plane | 2 | 0 |
| outside-modeled-field | 56 | 0 |
| surface-profile-unsupported | 2 | 0 |
| tilted-image-plane | 2 | 0 |
| tilted-surface | 1 | 0 |
| unsupported-path | 35 | 0 |

## Gated pair figures

Quantiles interpolate linearly at (n - 1)p over finite gated pair figures; nonfinite figures are counted separately and ranked first in each worst-ten list.

### r0 / aperture.mismatches (elements)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3996 | 0 | 0 | 0 | 0 | 0 | 0 |

| Run | Engines | Value |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | lv / optiland | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | lv / ref | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | optiland / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / optiland | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | optiland / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / optiland | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | optiland / ref | 0 |
| catalog-angenieux-dem-180mm-f23-apo | lv / optiland | 0 |

### r0 / index.mismatches (elements)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3996 | 0 | 0 | 0 | 0 | 0 | 0 |

| Run | Engines | Value |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | lv / optiland | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | lv / ref | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | optiland / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / optiland | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | optiland / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / optiland | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | optiland / ref | 0 |
| catalog-angenieux-dem-180mm-f23-apo | lv / optiland | 0 |

### r0 / layout.mismatches (elements)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3996 | 0 | 0 | 0 | 0 | 0 | 0 |

| Run | Engines | Value |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | lv / optiland | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | lv / ref | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | optiland / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / optiland | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | optiland / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / optiland | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | optiland / ref | 0 |
| catalog-angenieux-dem-180mm-f23-apo | lv / optiland | 0 |

### r0 / sag.maxScaled (1)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3996 | 0 | 0 | 2.366780245165288e-16 | 3.5910853961160744e-16 | 4.2955779145094114e-16 | 6.651645067245058e-16 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-tele | lv / optiland | 6.651645067245058e-16 |
| catalog-fujifilm-fujinon-xc-13-33mm-f35-63-ois-wide | lv / optiland | 6.651645067245058e-16 |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-tele | lv / optiland | 6.043562295274641e-16 |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-tele | optiland / ref | 6.043562295274641e-16 |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-wide | lv / optiland | 6.043562295274641e-16 |
| catalog-tamron-35-150mm-f2-28-di-iii-vxd-a058-wide | optiland / ref | 6.043562295274641e-16 |
| catalog-sony-fe-70-200mm-f28-gm-ii-tele | lv / optiland | 5.535626618896523e-16 |
| catalog-sony-fe-70-200mm-f28-gm-ii-wide | lv / optiland | 5.535626618896523e-16 |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-tele | optiland / ref | 5.450879944546598e-16 |
| catalog-sigma-70-200mm-f28-dg-dn-os-sports-wide | optiland / ref | 5.450879944546598e-16 |

### r0 / shape.mismatches (elements)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3996 | 0 | 0 | 0 | 0 | 0 | 0 |

| Run | Engines | Value |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | lv / optiland | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | lv / ref | 0 |
| catalog-agfa-color-magnolar-ii-100f45 | optiland / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / optiland | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / ref | 0 |
| catalog-agfa-color-telinear-90mm-f4 | optiland / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / optiland | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / ref | 0 |
| catalog-agfa-solagon-50mm-f2 | optiland / ref | 0 |
| catalog-angenieux-dem-180mm-f23-apo | lv / optiland | 0 |

### r1 / firstOrder.maxAbs (mm)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3965 | 0 | 0 | 3.552713678800501e-14 | 3.694822225952521e-13 | 4.8157744458876695e-12 | 4.729372449219227e-11 |

| Run | Engines | Value |
|---|---|---|
| catalog-sony-fe-400-800-f63-8-g-oss-tele | optiland / ref | 4.729372449219227e-11 |
| catalog-sony-fe-400-800-f63-8-g-oss-tele | lv / optiland | 3.728928277269006e-11 |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-tele | lv / optiland | 3.319655661471188e-11 |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-tele | lv / optiland | 3.092281986027956e-11 |
| catalog-sigma-60-600mm-f45-63-dg-dn-os-sports-tele | lv / ref | 3.0468072509393096e-11 |
| catalog-nikon-af-s-nikkor-180-400mm-f4e-tc14-fl-ed-vr-tc-in-tele | optiland / ref | 3.001332515850663e-11 |
| catalog-canon-rf-800mm-f11-is-stm | lv / ref | 2.2737367544323206e-11 |
| catalog-nikon-nikkor-z-180-600mm-f56-63-vr-tele | lv / ref | 2.2282620193436742e-11 |
| catalog-nikon-ai-zoom-nikkor-360-1200mm-f11-ed-tele | optiland / ref | 1.8189894035458565e-11 |
| catalog-canon-ef-200400-f4l-is-usm-extender-14x-in-tele | lv / ref | 1.659827830735594e-11 |

### r1 / pupilRadius.maxScaled (mm)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3965 | 0 | 0 | 3.552713678800501e-15 | 1.7763568394002505e-14 | 1.1368683772161603e-13 | 6.33959193075498e-11 |

| Run | Engines | Value |
|---|---|---|
| catalog-viltrox-af-75mm-f12-pro | lv / ref | 6.33959193075498e-11 |
| catalog-viltrox-af-75mm-f12-pro | optiland / ref | 6.054131881340122e-11 |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | lv / optiland | 7.386413217090261e-12 |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | lv / ref | 6.9265586977383505e-12 |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | lv / ref | 4.064304448547773e-12 |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | lv / optiland | 3.069544618483633e-12 |
| catalog-viltrox-af-75mm-f12-pro | lv / optiland | 2.8546004941489705e-12 |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | lv / ref | 2.7284841053187847e-12 |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | lv / optiland | 2.6147972675971687e-12 |
| catalog-nikon-tv-nikkor-115-69-f12-s100-tele | lv / ref | 2.5863755581667647e-12 |

### r1 / pupilZ.maxScaled (mm)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3965 | 0 | 0 | 1.4210854715202004e-14 | 1.3642420526593794e-13 | 1.8189894035458565e-12 | 1.424921413329168e-10 |

| Run | Engines | Value |
|---|---|---|
| catalog-viltrox-af-75mm-f12-pro | lv / ref | 1.424921413329168e-10 |
| catalog-viltrox-af-75mm-f12-pro | optiland / ref | 1.3547458178480154e-10 |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | lv / optiland | 3.425916169171826e-11 |
| catalog-olympus-zuiko-9-36-f2-2p4-tele | lv / ref | 3.25347072441486e-11 |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | lv / ref | 1.864464138634503e-11 |
| catalog-schneider-tv-variogon-20-600-f21-66-wide | lv / optiland | 1.432454155292362e-11 |
| catalog-viltrox-af-75mm-f12-pro | lv / optiland | 7.017559548116219e-12 |
| catalog-canon-ef-400mm-f28l-is-usm | lv / optiland | 6.366462912410498e-12 |
| catalog-nikon-tv-nikkor-115-69-f12-s100-tele | lv / ref | 6.0254023992456496e-12 |
| catalog-nikon-tv-nikkor-115-69-f12-s100-wide | lv / ref | 6.0254023992456496e-12 |

### r2 / direction.maxAbs (1)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3939 | 0 | 2.220446049250313e-16 | 4.6629367034256575e-15 | 1.6586731987899843e-14 | 1.8395174272711654e-13 | 2.045452696108896e-11 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 2.045452696108896e-11 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 2.0223211993908308e-11 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 1.6891099630100825e-11 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 1.495916585048107e-11 |
| catalog-apple-iphone-7-wide-camera-lens | optiland / ref | 1.262304150095872e-11 |
| catalog-apple-iphone-7-wide-camera-lens | lv / optiland | 1.2603307286696008e-11 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 7.083333919410961e-12 |
| catalog-samsung-galaxy-s9-main-wide | lv / optiland | 3.6813885273545566e-12 |
| catalog-samsung-galaxy-s9-main-wide | optiland / ref | 3.593458863804244e-12 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / ref | 3.456311625793518e-12 |

### r2 / hits.maxDistance (mm)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3939 | 0 | 0 | 1.6500289822270631e-13 | 1.1557862675897628e-12 | 6.979542688226601e-12 | 5.65747569560608e-10 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 5.65747569560608e-10 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 5.592757515591847e-10 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 4.2931457694959243e-10 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 3.999384345585486e-10 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 2.8509862937335446e-10 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / ref | 7.811380826214896e-11 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | lv / optiland | 5.868854556428912e-11 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-tele | lv / optiland | 3.864406036200798e-11 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | optiland / ref | 3.687196356532563e-11 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-tele | optiland / ref | 3.218467112809489e-11 |

### r2 / landing.maxDistance (mm)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3939 | 0 | 1.1374233532693354e-14 | 1.9077082118786527e-13 | 7.278258669200484e-13 | 8.294919077856132e-12 | 5.903148477621695e-10 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 5.903148477621695e-10 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 5.835651694732379e-10 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 4.954189832708589e-10 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 4.628051336678519e-10 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 3.229345284476206e-10 |
| catalog-russar-22-70f8 | lv / optiland | 8.50946063087503e-11 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / ref | 8.186568754228079e-11 |
| catalog-russar-22-70f8 | optiland / ref | 6.286887165573063e-11 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | lv / optiland | 5.868854556428912e-11 |
| catalog-russar-22-70f8 | lv / ref | 4.828848859639943e-11 |

### r2 / mask.mismatches (rays)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3939 | 0 | 0 | 0 | 0 | 0 | 1078 |

| Run | Engines | Value |
|---|---|---|
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | lv / optiland | 1078 |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | lv / ref | 1078 |
| catalog-leica-elmarit-90f28 | lv / optiland | 498 |
| catalog-leica-elmarit-90f28 | lv / ref | 498 |
| catalog-olympus-zuiko-auto-s-50f14 | lv / optiland | 356 |
| catalog-olympus-zuiko-auto-s-50f14 | lv / ref | 356 |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | lv / optiland | 146 |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | lv / ref | 146 |
| catalog-russar-22-70f8 | lv / optiland | 120 |
| catalog-russar-22-70f8 | optiland / ref | 120 |

### r3 / opd.maxAbs (waves)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3917 | 0 | 4.837228940071327e-11 | 6.772120516099858e-10 | 1.9348915760285307e-9 | 4.250956792534731e-9 | 4.327626871234813e-7 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 4.327626871234813e-7 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 3.375418354381772e-7 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 3.328013510769073e-7 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 3.02060761162754e-7 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 2.9361979666232953e-7 |
| catalog-russar-22-70f8 | lv / optiland | 1.330237958519615e-7 |
| catalog-russar-22-70f8 | optiland / ref | 9.509992096180228e-8 |
| catalog-russar-22-70f8 | lv / ref | 7.5073793149907e-8 |
| catalog-russar-21-60f18 | lv / optiland | 3.008756400724365e-8 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | lv / optiland | 2.51535904883709e-8 |

### r3 / opticalPath.maxAbs (waves)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3923 | 0 | 1.8139608525267477e-11 | 4.837228940071327e-10 | 2.2734976018335237e-9 | 3.8107689589881794e-9 | 3.750787320131307e-7 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 3.750787320131307e-7 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 3.2244968114515465e-7 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 3.1857989799309757e-7 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 2.673294573730419e-7 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 2.514875325943083e-7 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | lv / optiland | 2.558894109297732e-8 |
| catalog-samsung-galaxy-s9-main-wide | lv / optiland | 2.1803809447371505e-8 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | optiland / ref | 2.162241336211883e-8 |
| catalog-samsung-galaxy-s9-main-wide | optiland / ref | 2.1371482110852633e-8 |
| catalog-fujifilm-fujinon-xf-8mm-f35-r-wr | lv / optiland | 2.118706275751241e-8 |

### r3 / opticalPathToImage.maxAbs (waves)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3923 | 0 | 4.837228940071327e-11 | 5.804674728085593e-10 | 1.8865192866278177e-9 | 5.403184726059488e-9 | 4.3160175217786414e-7 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 4.3160175217786414e-7 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 3.364776450713615e-7 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 3.324143727617016e-7 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 3.025202979120608e-7 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 2.9199932496740565e-7 |
| catalog-russar-22-70f8 | lv / optiland | 1.308954151183301e-7 |
| catalog-russar-22-70f8 | optiland / ref | 9.635760048622083e-8 |
| catalog-russar-22-70f8 | lv / ref | 7.420309194069415e-8 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | lv / optiland | 2.558894109297732e-8 |
| catalog-fujifilm-fujinon-xf-8mm-f35-r-wr | lv / optiland | 2.2686603728934524e-8 |

### r3 / phasePath.maxAbs (waves)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 8 | 0 | 5.166717923049818e-15 | 5.904820483485506e-14 | 1.1219158918622461e-13 | 1.493919582321833e-13 | 1.5352533257062316e-13 |

| Run | Engines | Value |
|---|---|---|
| catalog-nikon-nikkor-z-800mm-f63-vr-s | optiland / ref | 1.5352533257062316e-13 |
| catalog-nikon-af-s-nikkor-500mm-f56e-pf-ed-vr | optiland / ref | 9.44771277357681e-14 |
| catalog-nikon-af-s-nikkor-300mm-f4e-pf-ed-vr | optiland / ref | 8.266748676879709e-14 |
| catalog-canon-ef-400mm-f4-do-is-usm | optiland / ref | 7.085784580182608e-14 |
| catalog-canon-ef-70-300mm-f45-56-do-is-usm-tele | optiland / ref | 4.723856386788405e-14 |
| catalog-canon-rf-800mm-f11-is-stm | optiland / ref | 4.723856386788405e-14 |
| catalog-canon-rf600mmf11-is-stm | optiland / ref | 2.3619281933942026e-14 |
| catalog-canon-ef-70-300mm-f45-56-do-is-usm-wide | optiland / ref | 5.166717923049818e-15 |

### r4 / mtf.maxAbs (1)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 3891 | 0 | 6.561418075534675e-14 | 1.860379905682663e-12 | 8.497869075085873e-12 | 4.48888717863304e-11 | 1.985938941073684e-9 |

| Run | Engines | Value |
|---|---|---|
| catalog-fujifilm-fujinon-xf-27mm-f28 | optiland / ref | 1.985938941073684e-9 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | optiland / ref | 1.880873151671736e-9 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / optiland | 1.8618001307313392e-9 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / ref | 1.7848593714120398e-9 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | lv / optiland | 1.7685360120811566e-9 |
| catalog-russar-22-70f8 | lv / optiland | 1.7083816097884785e-9 |
| catalog-russar-22-70f8 | lv / ref | 1.180451320026421e-9 |
| catalog-russar-22-70f8 | optiland / ref | 6.889900594497789e-10 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | lv / ref | 4.1855702237469927e-10 |
| catalog-fujifilm-fujinon-xf-14mm-f28-r | lv / ref | 3.6986025353513696e-10 |

### r4f / fields.mismatches (elements)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 1297 | 0 | 0 | 0 | 0 | 0 | 0 |

| Run | Engines | Value |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | lv / replay | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / replay | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / replay | 0 |
| catalog-angenieux-dem-180mm-f23-apo | lv / replay | 0 |
| catalog-angenieux-retrofocus-r1-35mm-f25 | lv / replay | 0 |
| catalog-angenieux-retrofocus-r11-28mm-f35 | lv / replay | 0 |
| catalog-apo-lanthar-50f2 | lv / replay | 0 |
| catalog-apple-iphone-12-main-wide | lv / replay | 0 |
| catalog-apple-iphone-7-wide-camera-lens | lv / replay | 0 |
| catalog-bertele-sonnar-50f2-scaled | lv / replay | 0 |

### r4f / mtf.maxAbs (1)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 1297 | 0 | 1.124100812432971e-15 | 7.216449660063518e-15 | 1.1213252548714081e-14 | 1.4437340212225532e-14 | 1.7985612998927536e-14 |

| Run | Engines | Value |
|---|---|---|
| catalog-laowa-105mm-f2-stf | lv / replay | 1.7985612998927536e-14 |
| catalog-leica-dc-vario-summilux-10934-f1728-lx100m2-wide | lv / replay | 1.6986412276764895e-14 |
| catalog-nikon-ai-zoom-nikkor-50-135mm-f35s-tele | lv / replay | 1.6431300764452317e-14 |
| catalog-hasselblad-hc-80-f28 | lv / replay | 1.6209256159527285e-14 |
| catalog-olympus-mzuiko-17mm-f18 | lv / replay | 1.587618925213974e-14 |
| catalog-canon-powershot-g1x-1560-f28-tele | lv / replay | 1.5765166949677223e-14 |
| catalog-canon-rf-135f18 | lv / replay | 1.5765166949677223e-14 |
| catalog-samsung-galaxy-s9-main-wide | lv / replay | 1.5432100042289676e-14 |
| catalog-nikon-nikkor-afs-20mm-f18g | lv / replay | 1.509903313490213e-14 |
| catalog-panasonic-lumix-s-pro-16-35f4-tele | lv / replay | 1.4988010832439613e-14 |

### r4f / sampling.mismatches (elements)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 1297 | 0 | 0 | 0 | 0 | 0 | 0 |

| Run | Engines | Value |
|---|---|---|
| catalog-agfa-color-magnolar-ii-100f45 | lv / replay | 0 |
| catalog-agfa-color-telinear-90mm-f4 | lv / replay | 0 |
| catalog-agfa-solagon-50mm-f2 | lv / replay | 0 |
| catalog-angenieux-dem-180mm-f23-apo | lv / replay | 0 |
| catalog-angenieux-retrofocus-r1-35mm-f25 | lv / replay | 0 |
| catalog-angenieux-retrofocus-r11-28mm-f35 | lv / replay | 0 |
| catalog-apo-lanthar-50f2 | lv / replay | 0 |
| catalog-apple-iphone-12-main-wide | lv / replay | 0 |
| catalog-apple-iphone-7-wide-camera-lens | lv / replay | 0 |
| catalog-bertele-sonnar-50f2-scaled | lv / replay | 0 |

### r6a / waveMtf.maxAbs (1)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 2400 | 0 | 1.0624834345662748e-12 | 4.0146150293018934e-11 | 3.81931247739331e-10 | 8.726096564076729e-10 | 1.272838057175818e-9 |

| Run | Engines | Value |
|---|---|---|
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | lv / ref | 1.272838057175818e-9 |
| catalog-samyang-af-35-150mm-f2-28-tele | optiland / ref | 1.2558842611698484e-9 |
| catalog-sony-fe-70-200mm-f4-macro-g-oss-ii-tele | lv / optiland | 1.2409817062852824e-9 |
| catalog-sony-vario-tessar-t-fe-16-35-f4-za-oss-jp2015166834-ex1-wide | optiland / ref | 1.2387597891905244e-9 |
| catalog-canon-rf-24-105-f4-l-wide | lv / optiland | 1.1872136607138373e-9 |
| catalog-ricoh-gr4-28f28 | optiland / ref | 1.1281011402797247e-9 |
| catalog-ricoh-gr4-28f28 | lv / ref | 1.1278494943534056e-9 |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-wide | lv / ref | 1.122356207972075e-9 |
| catalog-fujifilm-fujinon-xf-18-135mm-f35-56-r-lm-ois-wr-wide | optiland / ref | 1.1024095525336008e-9 |
| catalog-sony-fe-pz-16-35-f4-g-tele | optiland / ref | 1.0601600153314905e-9 |

## Classified FAILs

Listed failures remain FAIL; each failing metric retains its class, evidence hash, gotcha and one-run reproducer.

| Run | Rung | Engines | Metric | Class | Gotcha | Reproducer |
|---|---|---|---|---|---|---|
| catalog-bertele-sonnar-50f2-scaled | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-bertele-sonnar-50f2-scaled.json --rungs r2 --jobs 4 |
| catalog-bertele-sonnar-50f2-scaled | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-bertele-sonnar-50f2-scaled.json --rungs r2 --jobs 4 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-fujifilm-fujinon-xf-27mm-f28.json --rungs r2 --jobs 4 |
| catalog-fujifilm-fujinon-xf-27mm-f28 | r2 | optiland / ref | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-fujifilm-fujinon-xf-27mm-f28.json --rungs r2 --jobs 4 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide.json --rungs r2 --jobs 4 |
| catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide | r2 | optiland / ref | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-wide.json --rungs r2 --jobs 4 |
| catalog-leica-elmarit-90f28 | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-leica-elmarit-90f28.json --rungs r2 --jobs 4 |
| catalog-leica-elmarit-90f28 | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-leica-elmarit-90f28.json --rungs r2 --jobs 4 |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele.json --rungs r2 --jobs 4 |
| catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nikon-ai-s-zoom-nikkor-35-70mm-f35-tele.json --rungs r2 --jobs 4 |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele.json --rungs r2 --jobs 4 |
| catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nikon-ai-zoom-nikkor-25-50mm-f4-tele.json --rungs r2 --jobs 4 |
| catalog-nikon-z-dx-16-50-f3563-vr-wide | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nikon-z-dx-16-50-f3563-vr-wide.json --rungs r2 --jobs 4 |
| catalog-nikon-z-dx-16-50-f3563-vr-wide | r2 | optiland / ref | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nikon-z-dx-16-50-f3563-vr-wide.json --rungs r2 --jobs 4 |
| catalog-nokton-50f1 | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nokton-50f1.json --rungs r2 --jobs 4 |
| catalog-nokton-50f1 | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-nokton-50f1.json --rungs r2 --jobs 4 |
| catalog-olympus-zuiko-auto-s-50f14 | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-olympus-zuiko-auto-s-50f14.json --rungs r2 --jobs 4 |
| catalog-olympus-zuiko-auto-s-50f14 | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-olympus-zuiko-auto-s-50f14.json --rungs r2 --jobs 4 |
| catalog-pentax-da-18-55mm-f35-56-al-wide | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-pentax-da-18-55mm-f35-56-al-wide.json --rungs r2 --jobs 4 |
| catalog-pentax-da-18-55mm-f35-56-al-wide | r2 | lv / ref | mask.mismatches | method | docs/gotchas.md#where-two-neighbouring-surfaces-cross-the-ray-is-lost | node bin/lvrtc.mjs run suites/catalog-repro/catalog-pentax-da-18-55mm-f35-56-al-wide.json --rungs r2 --jobs 4 |
| catalog-ricoh-gr1-28f28 | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-ricoh-gr1-28f28.json --rungs r2 --jobs 4 |
| catalog-ricoh-gr1-28f28 | r2 | optiland / ref | mask.mismatches | method | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/catalog-repro/catalog-ricoh-gr1-28f28.json --rungs r2 --jobs 4 |
| catalog-russar-22-70f8 | r2 | lv / optiland | mask.mismatches | method | docs/gotchas.md#a-conic-is-met-in-front-of-the-ray-inside-the-aperture-or-else-on-its-far-side | node bin/lvrtc.mjs run suites/catalog-repro/catalog-russar-22-70f8.json --rungs r2 --jobs 4 |
| catalog-russar-22-70f8 | r2 | optiland / ref | mask.mismatches | method | docs/gotchas.md#a-conic-is-met-in-front-of-the-ray-inside-the-aperture-or-else-on-its-far-side | node bin/lvrtc.mjs run suites/catalog-repro/catalog-russar-22-70f8.json --rungs r2 --jobs 4 |

## Sources

- baselines/catalog.json: 3c0b12e2415347a3f48a68212d69b172b1ddc2de76c0b6b9d630985e4db1211c
- baselines/catalog.mtf.json: dde7ac5caff395dd5ab415fd7d16630c285f21c3e3edd463456565e72cd39c08

## Not covered

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
