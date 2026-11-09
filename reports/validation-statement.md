# Validation statement

This statement is rendered from the eight baselines of the benchmark, features, states and focus-stations suites alone, with no engine, clock or machine input. It says what those baselines support, check by check, and what they do not cover.

## Supportable sentence

On 276 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 1.2e-12 mm (gate 1e-8 mm), optical path 3.5e-9 waves (2e-5), geometric MTF 1.5e-11 (1e-7), wave MTF 1.1e-9 (2e-8); the benchmark covers six wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.49, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.0074. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

## Checks

A configuration is one named run of one suite, with its lens state; the same lens state in two suites counts twice, and check geometric-mtf, which is in both the ray and the MTF baselines, counts once. A configuration pair is two engines on one configuration and one check; a request pair is two engines on one request. The verdict counts count request pairs, answers that were not computed included; a refused lens state has no pairs.

The worst residual of a check held to a limit is the figure largest as a fraction of its own limit; a limit of zero ranks a value of zero at zero and any value above it above every finite ratio. The largest value of each figure is also listed in its own units. The worst of a side-by-side check is the largest MTF difference among the rows that have a review band, over every pair of that check; the differences set aside are listed apart for each external diffraction counterpart. The measured request counts of check wave-mtf leave out fields set aside for their phase step or convergence, even where the verdict of the request is Pass.

The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each check.

| Check | Id | Compares | Kind | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |
|---|---|---|---|---:|---:|---:|---|---|
| Built system | `built-system` | Built layout, shape, aperture, index and sampled sag | held to a limit | 314 | 942 | 942 | 942 Pass | sag.maxScaled 6.04e-16 (no unit); focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28 |
| First-order data | `first-order` | First-order quantities and pupils | held to a limit | 314 | 942 | 942 | 942 Pass | firstOrder.maxAbs 4.32e-12 mm; focus-stations / certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1; optiland / ref at line 0, quantity frontFocalZ |
| Ray trace | `ray-trace` | Hits, directions, image landings and masks of identical rays | held to a limit | 314 | 942 | 7152 | 7152 Pass | hits.maxDistance 2.70e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus1; lv / optiland at field 4.07e1 deg, line 0, ray 745, surface 32 |
| Optical path | `optical-path` | Optical path, path to image and chief-relative OPD of identical rays | held to a limit | 314 | 942 | 7152 | 7152 Pass | opticalPath.maxAbs 3.63e-9 waves; focus-stations / certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1; lv / ref at field 5.72e1 deg, line 0, ray 513 |
| Geometric MTF of the same rays | `geometric-mtf` | This tool's geometric MTF of identical rays, as each engine traces them | held to a limit | 314 | 942 | 2796 | 2796 Pass | mtf.maxAbs 1.48e-11 (no unit); states / nikon-z-24-70f4s-f5.6-best-ref-tele; lv / ref at cut tangential, field 1.66e1 deg, frequencyPerMm 92 |
| LensVisualizer's MTF sampling, replayed | `lv-mtf-replay` | LensVisualizer's geometric MTF beside a replay of its own sampling | held to a limit | 314 | 314 | 314 | 314 Pass | mtf.maxAbs 1.58e-14 (no unit); focus-stations / certified-sigma-24mm-f35-dg-dn-zoom0-focus1; lv / replay at cut sagittal, field 7.50e-1 of the image height, frequencyPerMm 2 |
| MTF beside optiland's FFT MTF | `mtf-vs-optiland-fft` | LensVisualizer's diffraction MTF beside optiland's FFT MTF and the wave estimate of LensVisualizer's rays | side by side, no limit | 96 | 288 | 288 | 161 Side by side; 31 Side by side, worth a look; 96 Not computed | mtfOffAxis.maxAbs 4.91e-1 (no unit); benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10 |
| Geometric MTF beside optiland's | `geometric-mtf-vs-optiland` | Geometric MTF on each method's own pupil sampling | side by side, no limit | 96 | 288 | 864 | 844 Side by side; 20 Side by side, worth a look | mtfOffAxis.maxAbs 1.22e-2 (no unit); benchmark / sony-fe-400mm-f28-gm-oss-best-ref; optiland / replay at cut sagittal, field 1 of the image height, frequencyPerMm 100 |
| Wave MTF of the same rays | `wave-mtf` | This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled | held to a limit | 314 | 942 | 2796 | 2796 Pass | waveMtf.maxAbs 1.08e-9 (no unit); states / nikon-z-24-70f4s-f5.6-best-ref-wide; lv / ref at cut tangential, field 4.33e1 deg, frequencyPerMm 50 |
| MTF beside the wave estimate of LensVisualizer's rays | `mtf-vs-wave-estimate` | LensVisualizer's sheared diffraction MTF beside this tool's wave OTF of LensVisualizer's rays | side by side, no limit | 96 | 96 | 96 | 95 Side by side; 1 Side by side, worth a look | mtfOffAxis.maxAbs 5.75e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / wave at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 30 |
| MTF beside the OTF of optiland's wavefront | `mtf-vs-optiland-wavefront` | LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts | side by side, no limit | 96 | 576 | 576 | 381 Side by side; 51 Side by side, worth a look; 144 Not computed | mtfOffAxis.maxAbs 2.75e-1 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 50 |

### Limits and largest values

#### Built system — `built-system`

- limit: aperture.mismatches 0 elements
- limit: index.mismatches 0 elements
- limit: layout.mismatches 0 elements
- limit: sag.maxScaled 1.00e-12 (no unit)
- limit: shape.mismatches 0 elements
- aperture.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 942
- index.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 942
- layout.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 942
- sag.maxScaled 6.04e-16 (no unit); focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28; measured request pairs 942
- shape.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 942

#### First-order data — `first-order`

- limit: firstOrder.maxAbs 1.00e-9 mm
- limit: pupilRadius.maxScaled 1.00e-9 mm
- limit: pupilZ.maxScaled 1.00e-9 mm
- firstOrder.maxAbs 4.32e-12 mm; focus-stations / certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1; optiland / ref at line 0, quantity frontFocalZ; measured request pairs 942
- pupilRadius.maxScaled 9.81e-13 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus2; lv / ref at line 0, quantity exitPupilSemiDiameter; measured request pairs 942
- pupilZ.maxScaled 2.61e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus2; lv / ref at line 0, quantity exitPupilZ; measured request pairs 942

#### Ray trace — `ray-trace`

- limit: direction.maxAbs 1.00e-9 (no unit)
- limit: hits.maxDistance 1.00e-8 mm
- limit: landing.maxDistance 1.00e-8 mm
- limit: mask.mismatches 0 rays
- direction.maxAbs 4.46e-14 (no unit); focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus1; lv / optiland at field 4.07e1 deg, line 0, ray 745; measured request pairs 7152
- hits.maxDistance 2.70e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus1; lv / optiland at field 4.07e1 deg, line 0, ray 745, surface 32; measured request pairs 7152
- landing.maxDistance 1.20e-12 mm; focus-stations / certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1; optiland / ref at field 4.99e1 deg, line 0, ray 812; measured request pairs 7152
- mask.mismatches 0 rays; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 7152
- mask.rimBand: 0
- rays.compared: 6867825

#### Optical path — `optical-path`

- limit: opd.maxAbs 2.00e-5 waves
- limit: opticalPath.maxAbs 2.00e-5 waves
- limit: opticalPathToImage.maxAbs 2.00e-5 waves
- opd.maxAbs 3.14e-9 waves; focus-stations / certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1; optiland / ref at field 2.54e1 deg, line 0, ray 546; measured request pairs 7152
- opticalPath.maxAbs 3.63e-9 waves; focus-stations / certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1; lv / ref at field 5.72e1 deg, line 0, ray 513; measured request pairs 7152
- opticalPathToImage.maxAbs 3.11e-9 waves; features / asphere-a20-photopic; optiland / ref at field 2.42e1 deg, line 1, ray 815; measured request pairs 7152

#### Geometric MTF of the same rays — `geometric-mtf`

- limit: mtf.maxAbs 1.00e-7 (no unit)
- mtf.maxAbs 1.48e-11 (no unit); states / nikon-z-24-70f4s-f5.6-best-ref-tele; lv / ref at cut tangential, field 1.66e1 deg, frequencyPerMm 92; measured request pairs 2796
- rays.compared: 6867825
- rays.dropped: 0

#### LensVisualizer's MTF sampling, replayed — `lv-mtf-replay`

- limit: fields.mismatches 0 elements
- limit: mtf.maxAbs 1.00e-9 (no unit)
- limit: sampling.mismatches 0 elements
- fields.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay; measured request pairs 314
- mtf.maxAbs 1.58e-14 (no unit); focus-stations / certified-sigma-24mm-f35-dg-dn-zoom0-focus1; lv / replay at cut sagittal, field 7.50e-1 of the image height, frequencyPerMm 2; measured request pairs 314
- sampling.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay; measured request pairs 314

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`

- sorting limit: chiefLanding.maxAbs 1.00e-7 mm
- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 4.91e-1 (no unit); benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10; measured request pairs 160
- mtfOnAxis.maxAbs 2.58e-2 (no unit); benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0 of the image height, frequencyPerMm 30; measured request pairs 171
- fields.compared: 449
- fields.data: 0
- fields.flagged: 107
- fields.rimLost: 0
- fields.unavailable: 20

#### Geometric MTF beside optiland's — `geometric-mtf-vs-optiland`

- sorting limit: chiefLanding.maxAbs 1.00e-3 mm
- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 1.22e-2 (no unit); benchmark / sony-fe-400mm-f28-gm-oss-best-ref; optiland / replay at cut sagittal, field 1 of the image height, frequencyPerMm 100; measured request pairs 576
- mtfOnAxis.maxAbs 8.84e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-best-ref; lv / optiland at cut tangential, field 0 of the image height, frequencyPerMm 100; measured request pairs 288
- fields.compared: 864
- fields.data: 0
- fields.flagged: 0
- fields.rimLost: 0
- fields.unavailable: 0

#### Wave MTF of the same rays — `wave-mtf`

- limit: waveMtf.maxAbs 2.00e-8 (no unit)
- convergence.maxAbs 1.58e-1 (no unit); focus-stations / certified-thypoch-simera-50mm-f14-zoom0-focus1; lv / ref at cut tangential, field 2.01e1 deg, frequencyPerMm 70; measured request pairs 2793
- phaseStep.waves 2.52e1 waves; benchmark / sigma-35mm-f14-dg-hsm-a-photopic; lv / optiland at field 3.19e1 deg, line 2, ray 987; measured request pairs 2793
- waveMtf.flagged 1.17e-9 (no unit); benchmark / nikon-z-24-70f4s-wide-best-ref; lv / ref at cut tangential, field 4.33e1 deg, frequencyPerMm 50; measured request pairs 705
- waveMtf.maxAbs 1.08e-9 (no unit); states / nikon-z-24-70f4s-f5.6-best-ref-wide; lv / ref at cut tangential, field 4.33e1 deg, frequencyPerMm 50; measured request pairs 2088
- rays.compared: 27473151
- rays.dropped: 0

#### MTF beside the wave estimate of LensVisualizer's rays — `mtf-vs-wave-estimate`

- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 5.75e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / wave at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 30; measured request pairs 75
- mtfOnAxis.maxAbs 5.42e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-best-ref; lv / wave at cut tangential, field 0 of the image height, frequencyPerMm 80; measured request pairs 82
- fields.compared: 211
- fields.flagged: 77
- fields.unavailable: 0

#### MTF beside the OTF of optiland's wavefront — `mtf-vs-optiland-wavefront`

- sorting limit: chiefLanding.maxAbs 1.00e-7 mm
- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 2.75e-1 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 50; measured request pairs 367
- mtfOnAxis.maxAbs 2.62e-2 (no unit); benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0 of the image height, frequencyPerMm 30; measured request pairs 396
- fields.compared: 1050
- fields.data: 0
- fields.flagged: 216
- fields.rimLost: 0
- fields.unavailable: 30

## External diffraction counterparts

Both external diffraction counterparts are set side by side with LensVisualizer, with no preference claimed. Row counts include every requested field, cut and frequency at the last sampling written down, rows not computed and rows set aside included; their classes and statuses are counted apart. The coverage lists the wavelengths requested of LensVisualizer and the wavelengths each counterpart answered, by named state and request.

For the Nikkor Z 50 mm f/1.2 wide open at best focus, the tangential difference between optiland's FFT MTF and the other diffraction estimates at the half field, where every sampling settled, is classed as one of method. The outcomes of the other conditions remain as they were classed: wide open at the full field the FFT computes nothing (not computed), and on the design plane its sampling does not settle (not converged); docs/z50f12-investigation.md describes them.

| Check | Counterpart | Configurations | Rows | Rows by class | Worst of the rows with a review band | Worst set aside |
|---|---|---:|---:|---|---|---|
| MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft` | optiland | 96 | 6336 | 2882 the methods differ (`method`); 66 not converged (`numerical`); 3388 not computed by one engine (`unsupported`) | mtf.maxAbs 4.91e-1 (no unit); benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10 | mtf.maxAbs 4.59e-1 (no unit); benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `mtf-vs-optiland-wavefront` | optiland-wave | 96 | 6336 | 5874 the methods differ (`method`); 462 not converged (`numerical`) | mtf.maxAbs 7.41e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-photopic; lv / optiland-wave at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 30 | mtf.maxAbs 7.96e-3 (no unit); benchmark / nikkor-z50f12-photopic; lv / optiland-wave at cut tangential, field 1 of the image height, frequencyPerMm 20 |

### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`: optiland

- Wavelengths asked of LensVisualizer (nm): 470, 510, 555, 587.5618, 610, 650
- Wavelengths the counterpart answered (nm): 587.5618
- Fields requested: 0, 0.5, 1
- Configurations with rows that have a review band: 47
- Chief-landing sorting limits (mm): 1.00e-7
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Rows by status: 295 Side by side, worth a look (`ATTENTION`); 2587 Side by side (`RECORDED`); 66 Set aside (`SET ASIDE`); 3388 Not computed (`UNSUPPORTED`)

| Suite | Named state / request | LensVisualizer wavelengths (nm) | Counterpart wavelengths (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Side by side, worth a look |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: numerical / unconverged; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | canon-ef-135-f2l-usm-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side, worth a look |
| benchmark | nikkor-z50f12-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |

### MTF beside the OTF of optiland's wavefront — `mtf-vs-optiland-wavefront`: optiland-wave

- Wavelengths asked of LensVisualizer (nm): 470, 510, 555, 587.5618, 610, 650
- Wavelengths the counterpart answered (nm): 470, 510, 555, 587.5618, 610, 650
- Fields requested: 0, 0.5, 1
- Configurations with rows that have a review band: 96
- Chief-landing sorting limits (mm): 1.00e-7, 1.00e-3
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Rows by status: 18 Side by side, worth a look (`ATTENTION`); 5856 Side by side (`RECORDED`); 462 Set aside (`SET ASIDE`)

| Suite | Named state / request | LensVisualizer wavelengths (nm) | Counterpart wavelengths (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side, worth a look |
| benchmark | nikkor-z50f12-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |

## Lens states by suite

These are the lens states as the baselines name them, each with the code of its refusal where it was refused; the hash of each lens state that was run is under Identifiers. The baselines do not keep slider positions, stop radii or image-plane shifts as numbers, so those cannot be given here. The wavelengths listed are those the benchmark's diffraction answers keep; the other suites' baselines keep no wavelength.

### benchmark

96 named states are declared, 96 are run with a lens state, and 0 are refused.

| Named state | Refusal | Measured on ray-trace, optical-path, geometric-mtf and wave-mtf for both pairs of LensVisualizer and an external engine |
|---|---|---|
| canon-ef-135-f2l-usm-ref | — | yes |
| canon-ef-135-f2l-usm-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-photopic | — | no |
| nikkor-z50f12-ref | — | no |
| nikkor-z50f12-photopic | — | no |
| sony-fe-20mm-f18-g-ref | — | no |
| sony-fe-20mm-f18-g-photopic | — | no |
| sony-fe-400mm-f28-gm-oss-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-photopic | — | yes |
| nikon-z-24-70f4s-wide-ref | — | yes |
| nikon-z-24-70f4s-wide-photopic | — | yes |
| nikon-z-24-70f4s-tele-ref | — | yes |
| nikon-z-24-70f4s-tele-photopic | — | yes |
| nikon-z-mc-105f28-ref | — | yes |
| nikon-z-mc-105f28-photopic | — | yes |
| nikon-z-135f18-plena-ref | — | yes |
| nikon-z-135f18-plena-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-photopic | — | no |
| canon-ef-135-f2l-usm-best-ref | — | yes |
| canon-ef-135-f2l-usm-best-photopic | — | no |
| canon-ef-135-f2l-usm-f8-ref | — | yes |
| canon-ef-135-f2l-usm-f8-photopic | — | yes |
| canon-ef-135-f2l-usm-f8-best-ref | — | yes |
| canon-ef-135-f2l-usm-f8-best-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-best-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-best-photopic | — | no |
| sigma-35mm-f14-dg-hsm-a-f8-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | — | yes |
| nikkor-z50f12-best-ref | — | yes |
| nikkor-z50f12-best-photopic | — | yes |
| nikkor-z50f12-f8-ref | — | yes |
| nikkor-z50f12-f8-photopic | — | yes |
| nikkor-z50f12-f8-best-ref | — | yes |
| nikkor-z50f12-f8-best-photopic | — | yes |
| sony-fe-20mm-f18-g-best-ref | — | yes |
| sony-fe-20mm-f18-g-best-photopic | — | yes |
| sony-fe-20mm-f18-g-f8-ref | — | yes |
| sony-fe-20mm-f18-g-f8-photopic | — | yes |
| sony-fe-20mm-f18-g-f8-best-ref | — | yes |
| sony-fe-20mm-f18-g-f8-best-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-best-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-best-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-f8-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-f8-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | — | yes |
| nikon-z-24-70f4s-wide-best-ref | — | yes |
| nikon-z-24-70f4s-wide-best-photopic | — | yes |
| nikon-z-24-70f4s-wide-f8-ref | — | yes |
| nikon-z-24-70f4s-wide-f8-photopic | — | yes |
| nikon-z-24-70f4s-wide-f8-best-ref | — | yes |
| nikon-z-24-70f4s-wide-f8-best-photopic | — | yes |
| nikon-z-24-70f4s-tele-best-ref | — | yes |
| nikon-z-24-70f4s-tele-best-photopic | — | yes |
| nikon-z-24-70f4s-tele-f8-ref | — | yes |
| nikon-z-24-70f4s-tele-f8-photopic | — | yes |
| nikon-z-24-70f4s-tele-f8-best-ref | — | yes |
| nikon-z-24-70f4s-tele-f8-best-photopic | — | yes |
| nikon-z-mc-105f28-best-ref | — | yes |
| nikon-z-mc-105f28-best-photopic | — | yes |
| nikon-z-mc-105f28-f8-ref | — | yes |
| nikon-z-mc-105f28-f8-photopic | — | yes |
| nikon-z-mc-105f28-f8-best-ref | — | yes |
| nikon-z-mc-105f28-f8-best-photopic | — | yes |
| nikon-z-135f18-plena-best-ref | — | yes |
| nikon-z-135f18-plena-best-photopic | — | yes |
| nikon-z-135f18-plena-f8-ref | — | yes |
| nikon-z-135f18-plena-f8-photopic | — | yes |
| nikon-z-135f18-plena-f8-best-ref | — | yes |
| nikon-z-135f18-plena-f8-best-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | — | yes |

### features

18 named states are declared, 18 are run with a lens state, and 0 are refused.

| Named state | Refusal | Measured on ray-trace, optical-path, geometric-mtf and wave-mtf for both pairs of LensVisualizer and an external engine |
|---|---|---|
| odd-asphere-ref | — | yes |
| odd-asphere-photopic | — | yes |
| e-line-ref | — | no |
| e-line-photopic | — | no |
| asphere-a20-ref | — | yes |
| asphere-a20-photopic | — | yes |
| flat-base-asphere-ref | — | yes |
| flat-base-asphere-photopic | — | yes |
| rear-plate-rim-ref | — | yes |
| rear-plate-rim-photopic | — | yes |
| fixed-iris-zoom-ref-wide | — | yes |
| fixed-iris-zoom-ref-tele | — | yes |
| fixed-iris-zoom-photopic-wide | — | yes |
| fixed-iris-zoom-photopic-tele | — | yes |
| zero-asphere-ref | — | no |
| zero-asphere-photopic | — | no |
| stop-inside-element-ref | — | yes |
| stop-inside-element-photopic | — | yes |

### states

128 named states are declared, 128 are run with a lens state, and 0 are refused.

| Named state | Refusal | Measured on ray-trace, optical-path, geometric-mtf and wave-mtf for both pairs of LensVisualizer and an external engine |
|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | — | yes |
| canon-ef-135-f2l-usm-f5.6-photopic | — | yes |
| canon-ef-135-f2l-usm-f5.6-best-ref | — | yes |
| canon-ef-135-f2l-usm-f5.6-best-photopic | — | yes |
| canon-ef-135-f2l-usm-f11-ref | — | yes |
| canon-ef-135-f2l-usm-f11-photopic | — | yes |
| canon-ef-135-f2l-usm-f11-best-ref | — | yes |
| canon-ef-135-f2l-usm-f11-best-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | — | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-f11-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | — | yes |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | — | yes |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | — | yes |
| nikkor-z50f12-f5.6-ref | — | yes |
| nikkor-z50f12-f5.6-photopic | — | yes |
| nikkor-z50f12-f5.6-best-ref | — | yes |
| nikkor-z50f12-f5.6-best-photopic | — | yes |
| nikkor-z50f12-f11-ref | — | yes |
| nikkor-z50f12-f11-photopic | — | yes |
| nikkor-z50f12-f11-best-ref | — | yes |
| nikkor-z50f12-f11-best-photopic | — | yes |
| sony-fe-20mm-f18-g-f5.6-ref | — | yes |
| sony-fe-20mm-f18-g-f5.6-photopic | — | yes |
| sony-fe-20mm-f18-g-f5.6-best-ref | — | yes |
| sony-fe-20mm-f18-g-f5.6-best-photopic | — | yes |
| sony-fe-20mm-f18-g-f11-ref | — | yes |
| sony-fe-20mm-f18-g-f11-photopic | — | yes |
| sony-fe-20mm-f18-g-f11-best-ref | — | yes |
| sony-fe-20mm-f18-g-f11-best-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-f11-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-f11-photopic | — | yes |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | — | yes |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | — | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | — | yes |
| nikon-z-24-70f4s-f5.6-ref-wide | — | yes |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f5.6-ref-tele | — | yes |
| nikon-z-24-70f4s-f5.6-photopic-wide | — | yes |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f5.6-photopic-tele | — | yes |
| nikon-z-24-70f4s-f5.6-best-ref-wide | — | yes |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f5.6-best-ref-tele | — | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | — | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | — | yes |
| nikon-z-24-70f4s-f11-ref-wide | — | yes |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f11-ref-tele | — | yes |
| nikon-z-24-70f4s-f11-photopic-wide | — | yes |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f11-photopic-tele | — | yes |
| nikon-z-24-70f4s-f11-best-ref-wide | — | yes |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f11-best-ref-tele | — | yes |
| nikon-z-24-70f4s-f11-best-photopic-wide | — | yes |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f11-best-photopic-tele | — | yes |
| nikon-z-mc-105f28-f5.6-ref | — | yes |
| nikon-z-mc-105f28-f5.6-photopic | — | yes |
| nikon-z-mc-105f28-f5.6-best-ref | — | yes |
| nikon-z-mc-105f28-f5.6-best-photopic | — | yes |
| nikon-z-mc-105f28-f11-ref | — | yes |
| nikon-z-mc-105f28-f11-photopic | — | yes |
| nikon-z-mc-105f28-f11-best-ref | — | yes |
| nikon-z-mc-105f28-f11-best-photopic | — | yes |
| nikon-z-135f18-plena-f5.6-ref | — | yes |
| nikon-z-135f18-plena-f5.6-photopic | — | yes |
| nikon-z-135f18-plena-f5.6-best-ref | — | yes |
| nikon-z-135f18-plena-f5.6-best-photopic | — | yes |
| nikon-z-135f18-plena-f11-ref | — | yes |
| nikon-z-135f18-plena-f11-photopic | — | yes |
| nikon-z-135f18-plena-f11-best-ref | — | yes |
| nikon-z-135f18-plena-f11-best-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | — | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | — | yes |
| nikon-z-24-70f4s-open-ref-wide | — | yes |
| nikon-z-24-70f4s-open-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-open-ref-tele | — | yes |
| nikon-z-24-70f4s-open-photopic-wide | — | yes |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-open-photopic-tele | — | yes |
| nikon-z-24-70f4s-open-best-ref-wide | — | yes |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-open-best-ref-tele | — | yes |
| nikon-z-24-70f4s-open-best-photopic-wide | — | yes |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-open-best-photopic-tele | — | yes |
| nikon-z-24-70f4s-f8-ref-wide | — | yes |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f8-ref-tele | — | yes |
| nikon-z-24-70f4s-f8-photopic-wide | — | yes |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f8-photopic-tele | — | yes |
| nikon-z-24-70f4s-f8-best-ref-wide | — | yes |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f8-best-ref-tele | — | yes |
| nikon-z-24-70f4s-f8-best-photopic-wide | — | yes |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | — | yes |
| nikon-z-24-70f4s-f8-best-photopic-tele | — | yes |

### focus-stations

74 named states are declared, 72 are run with a lens state, and 2 are refused.

| Named state | Refusal | Measured on ray-trace, optical-path, geometric-mtf and wave-mtf for both pairs of LensVisualizer and an external engine |
|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — | yes |
| certified-fujifilm-gf80-f17-zoom0-focus1 | — | no |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | — | yes |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | — | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | — | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | — | yes |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | — | yes |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | — | yes |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | — | no |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | — | no |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | — | yes |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | — | yes |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | — | yes |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | — | yes |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | — | yes |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | — | yes |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | — | no |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | — | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | — | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | — | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | — | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | — | no |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | — | no |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | — | yes |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | — | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | — | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | — | yes |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | — | yes |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | — | yes |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | — | no |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | — | yes |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | — | no |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | — | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | — | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | — | no |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | — | no |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | — | no |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | — | yes |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | — | no |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | — | no |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | — | yes |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | — | no |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | — | no |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | — | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | — | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | — | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | — | no |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | — | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | — | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | — | yes |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | — | yes |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | — | yes |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | — | no |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | — | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | — | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | — | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | — | yes |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | — | yes |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | — | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | — | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | — | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | — | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | — | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | — | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | — | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | — | yes |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | — | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | — | no |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | — | no |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | — | no |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | — | no |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | — | no |

## Not covered

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so check mtf-vs-optiland-fft sets two methods side by side and holds them to no limit.

- A polychromatic curve of optiland's FFT class. It gives the modulus at one wavelength, so a run of several wavelengths has no FFT row in checks mtf-vs-optiland-fft or mtf-vs-optiland-wavefront. The external counterpart in check mtf-vs-optiland-wavefront is this tool's complex sum of optiland's raw wavefronts; its proof on synthetic sums checks the declared weighting and phase convention, not physical spectral fidelity.

- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Check geometric-mtf-vs-optiland sets the two side by side and holds them to no limit: a difference of the two pupil samplings is written down, not explained.

- The bins of optiland's geometric MTF. At one wavelength optiland's curve is of landings counted into bins, and a field whose bins move a value by more than its convergence band (0.005 on the axis, 0.01 off it) has no optiland curve. At several wavelengths the sum over optiland's landings is this tool's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.

- Dispersion and white-light weighting. Every engine is handed the refractive indices and the wavelength weights LensVisualizer states; no glass catalog and no spectrum is checked against another.

- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.

- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.

- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.

- Zoom and focus positions other than the lens states a run names, and the catalog beyond these suites.

- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no review band.

## Identifiers

The SHA-256 hashes of the eight baseline files this statement is rendered from, and of each named lens state that was run.

| Baseline file | SHA-256 |
|---|---|
| baselines/benchmark.json | bc182fb3c2ab3c443fa0366454be22a7a71f26c4947db9fea03403ab531f953c |
| baselines/benchmark.mtf.json | ba1d7bce897c1aee77138ee29b41b86acccd490d254e539b25544fdfaf524793 |
| baselines/features.json | 6987e577bb2070d3e60c5c470b2d77897f5f32f2330cf5aa055394761d77049b |
| baselines/features.mtf.json | 4f3865164b85849e141ca33c7b46dc3a21eff2f2c4280fc7fd575ae27fd9b3d2 |
| baselines/states.json | 6d853f0406b97ce2b048226299f31260d77617cf27d2b84acf1456d139135ac4 |
| baselines/states.mtf.json | c8dc92051eba7902f3ab6aa9d5fe49bfae81739a054f236baba7c5633c757f63 |
| baselines/focus-stations.json | a28dc965cfc1b3a776f38376c110c351eaf3ef2c1bb8143862c0ac70a08be138 |
| baselines/focus-stations.mtf.json | d9842b43ece7463b52c0b80e454c762f4f8131c79d5f640cf3ab13f617063257 |

| Suite | Named state | Lens state (SHA-256) |
|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref | b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60 |
| benchmark | canon-ef-135-f2l-usm-photopic | 5a1e4774772748058756cfcb4d918aedab000c3e4857e484254fe6688c651513 |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | b241011c9681597d858ca830bb42493ed5d2719b1aa8782269e0f54cde52c35f |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref | 18ef72984fad20ad086ba18f8b839edb2d9d142a51397b4b7c1a3cdf1565d456 |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic | 7ff423e8023923c0d2ce5797fab6e1acce05b4d12bfb3528765c4020ba4fd7c9 |
| benchmark | nikkor-z50f12-ref | 861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22 |
| benchmark | nikkor-z50f12-photopic | 25e839a37b367ed1c9f7298f4e44f9fdb017645f73647e4f965832cb1d28ede2 |
| benchmark | sony-fe-20mm-f18-g-ref | b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5 |
| benchmark | sony-fe-20mm-f18-g-photopic | 9bf71fcc2c01fb1e7c25546d8b6a2758be33c6bba8fe4742ebcd3fbac72405d7 |
| benchmark | sony-fe-400mm-f28-gm-oss-ref | 75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5 |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic | 25a3d0697df2ed6fe2fd355a06ce5f7a89664142dadd6e7d5e049d3bbc636df7 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref | e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic | c5a507024e5ab43f94adcb83c67c948a9731a2af72fed96ac5515f6eb04f708e |
| benchmark | nikon-z-24-70f4s-wide-ref | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| benchmark | nikon-z-24-70f4s-wide-photopic | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc |
| benchmark | nikon-z-24-70f4s-tele-ref | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| benchmark | nikon-z-24-70f4s-tele-photopic | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 |
| benchmark | nikon-z-mc-105f28-ref | 70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb |
| benchmark | nikon-z-mc-105f28-photopic | e492101b147bcf0f0e156d83376aba617d1c24f20cfdcf0d82b48a03f8b4a92e |
| benchmark | nikon-z-135f18-plena-ref | 449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab |
| benchmark | nikon-z-135f18-plena-photopic | 9ac66541b918eea604fa81c70999f824029cc1d2d481851438f0d5d7e86d8224 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref | 2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic | 6f62ee09c0c8b3a1cc345e3ed0e0e27aebea0ce5e96cdbee7664ffbab4914e73 |
| benchmark | canon-ef-135-f2l-usm-best-ref | b4f341d96e9f6e711ecf326eeb3cdaf3602a856cdfba61ec965ecc71b89499de |
| benchmark | canon-ef-135-f2l-usm-best-photopic | 69d4e5172b1877156ed6cc172c99847863dea3900c1a4bba283471c1e9e4d77a |
| benchmark | canon-ef-135-f2l-usm-f8-ref | d1fd0633e961ca14b7e8a890140c4d184c21a53e0969e4179e2f142257180fc7 |
| benchmark | canon-ef-135-f2l-usm-f8-photopic | 731871199792070410cbec4aca73816955e53384dc92b9d251361f507f9f85ac |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref | 9181a5e3a48bf546f4561ba7bb1b9fb5de2bdf85f2f1080c60230661b568ddca |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic | 1edb8e349eae5cb693e7fd3aa842407d2fcfbaac26476210431b6eb4bec8fcad |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 52523bad0a00d71977e0eefafa46b9cda099b1324777dde14b699fab0c5b4b9b |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | d86d998c5a70e9c1fa8f9878a114e0860ac1d0a2bb3794a556ed637b05f9061b |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 30e4a4eec70f588e984e1210446b9eb671089990b41bdf7c6425457f870b4ebd |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0a789bcb488ae70bd153a4390f164cf24647a72b9508108f7a6635b81735cd3a |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | eb45ad15291d7f5e4556a8ab1655f8b325aa8433e5806470be1db9dbc663d1ae |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 8ed243d16650b84e33194bedae63bbe3b1baf12d708588a18f2ba2b3427735f7 |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref | 130981bdd7a4989b64f69069a4346f2004bccb5f4e41fddc1b856bcd792c7d4d |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic | 2876a9d3614dc1293aa063abda65053216c2d0dbe8fda26b4e7335de9a935417 |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref | ce80398ec92f83206f4b4190f455665210292985b2b13c0bdc728983ac8ef72a |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic | 2576f1abc7847ff787cf741fc8afe2a29ae1d6639c6dad9f3497291f972ac074 |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref | 53d98c230d539a2f9f241accb3d0f4ceaab1006e5601e8c391d9ccf38239f723 |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 42379a5556180d78b6be5ba5e140298c72a186b55b8221749f0c91a6fdb8760a |
| benchmark | nikkor-z50f12-best-ref | 13cd75d2e0891cf4ab4f2e8c006a7719cdd7721caa4dce11e1faa6ab1f70e8f5 |
| benchmark | nikkor-z50f12-best-photopic | 6e335d456db27535278548bcc6d44f974db63b0f65ae8f9252f5ab3b2aaddc07 |
| benchmark | nikkor-z50f12-f8-ref | b2e66abb6142cc758397469e55448599762d9712ba3d6cd768f8cea13b336b92 |
| benchmark | nikkor-z50f12-f8-photopic | 97402aca20f0101b3bfcc039f1cd45547794bd302bc582f837cd86ea56658584 |
| benchmark | nikkor-z50f12-f8-best-ref | 359dc743691cfd7a56b445301c5703d5ead4e6fc68863d5faf7c5d386acddfa5 |
| benchmark | nikkor-z50f12-f8-best-photopic | c557755be3310618f79fba94e12eb3cae909f6784afb8b8d412dbeb156d35870 |
| benchmark | sony-fe-20mm-f18-g-best-ref | 469d8f48aaac16ae2f6e2ce67f033e9eacff42111d6b3e1c1eb2c6450c40fb3a |
| benchmark | sony-fe-20mm-f18-g-best-photopic | 8d1ccf9e5acdcf3be6daf5353b1f4b36ea8d1a2d317177447abaaa36bb9070ec |
| benchmark | sony-fe-20mm-f18-g-f8-ref | cd2d5eb4481fbd7b01ae526b4808841fdcb6467f04d85b0cc0e040b2d2955ce0 |
| benchmark | sony-fe-20mm-f18-g-f8-photopic | e989fae172bd203a3b2d51f1ddffbd17d364aadf4e801383aae83b5f778aae52 |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref | e169bad1480d89fff330c5fc66e0d06dcb23e767ffd4a9c0a14159caf68abb5e |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic | cca38982ae4220225ccf9dec2ea690c58629a4334c81076b5626860f736d7ca1 |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref | 321e4ba0ce5c220609a55b35ac8a33079ccf30c7e3258a67ec1463edf2554afb |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic | 432764ba66f320c6af37ef4906a016797499b5310599902028721d470024d9ea |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref | bdba0ea2e9d167e31d49a03bd99c873d71bc7945b8b646ac3cb48b4710a872f2 |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic | 5f85630002361a665e23772e378113957d44c6359ea572fa01c761ae4d2fbf51 |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref | 93e98f340fb7f23d10d90375c3c3953cd5c871e2867247ae73e24e3fa40b0e6d |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic | 2d91ab3ecb073567986f4cf5de5e83bbdcf61ccf8e9554cdc5e8e9f254947e4b |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref | f74812129cc4c7918a44f8ec7cb6ce9882367b23bc0d991f04712a7e6cc9206e |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3b68693f0aed670f4c8b9e652233d6bd9a14812a7d9301ae9efa867558dbdc39 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref | 58eb582de9ad963ec75ab5f5009ec8889068ea50be5cdb6da32ac6d23f9c6698 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic | dc4dfa9211345eb02410bab772dae7de3f2796998d617b94b0f727c9c7928c06 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 5285ea322b02f0fd436d12c9cd11c5e1abde75282625e1351b4d7c57d2f7cdd9 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 9206ace874fc53d400781e67b497a2f70ae09367beb54a55edd489cc8b012871 |
| benchmark | nikon-z-24-70f4s-wide-best-ref | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| benchmark | nikon-z-24-70f4s-wide-best-photopic | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 |
| benchmark | nikon-z-24-70f4s-wide-f8-ref | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 |
| benchmark | nikon-z-24-70f4s-tele-best-ref | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| benchmark | nikon-z-24-70f4s-tele-best-photopic | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 |
| benchmark | nikon-z-24-70f4s-tele-f8-ref | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b |
| benchmark | nikon-z-mc-105f28-best-ref | c83e32a7f5c48ad358d471710d082e4a5fb745e7baae2c989ec4a957709a8bbb |
| benchmark | nikon-z-mc-105f28-best-photopic | b97782bbacd99c048ee69ac0d41c84639999e363374ce87d570d501253b5d594 |
| benchmark | nikon-z-mc-105f28-f8-ref | 904ae8663e1e238175e7d632b807c7b9efc4ab69381a92b0613675b2dbc891a9 |
| benchmark | nikon-z-mc-105f28-f8-photopic | 56a7dca87fd84d7f382a68e33acdb1c4f58f4afcec119b09ae72a671b836ff83 |
| benchmark | nikon-z-mc-105f28-f8-best-ref | d31b3e7efcdab37966e8b8135217738e6192f77faec1b974d94409d648accd72 |
| benchmark | nikon-z-mc-105f28-f8-best-photopic | 05c8d34726e50ab941b4d2caa0a807a96d9077dc3777e4fbb0aa8989c5f6a476 |
| benchmark | nikon-z-135f18-plena-best-ref | 0c9e2d7b9f2923c21fef404d7b86f7e31456364f77a5f300a13a06219d4add72 |
| benchmark | nikon-z-135f18-plena-best-photopic | 45ff06bb22f2b3d5be84433c71a1a6e7c4851c4c4d88c3770a88edc0f7922998 |
| benchmark | nikon-z-135f18-plena-f8-ref | 7f0c3394b7c516d1ac234599e678abe8497b7cf9931f1dd3887a7869e8a703a8 |
| benchmark | nikon-z-135f18-plena-f8-photopic | f060b855c73e9fb5b18b34e4b1122c30b2beb3de00ca30c00aa4be509825b324 |
| benchmark | nikon-z-135f18-plena-f8-best-ref | d4eca6fef5c902656e4eb45b1542385a3a1902907993d85a65365ff0d997f6ff |
| benchmark | nikon-z-135f18-plena-f8-best-photopic | 95151953a4343500ecce7683fbc710f87c1192f0245ee6b6de4948dbc4608652 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref | 0f2591032f4111cf837b08e5e70899199b943dfbe2e54ff2469d14fd9b70a7f0 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic | 8a471dcefb12901a1bf45cd2083cf701fcd4c20f6f515944215f4427e7c2f5cf |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref | e44ac8f3c84fa88e4f62f0acd044815be365d1791d98ad87744f5c12e8eabc52 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 34789d7b42b8949cf70123383a08237a20235661e5236fdbcd46d27bd2add967 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 952ae77f90fd93161c6e9e1d307c8b2289770285efe2d2c42c56dc5a5cf47c5a |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 055522122a4c925fdd18f5062abd08ad34585b1567e670ad9591473bdca1eb53 |
| features | odd-asphere-ref | d24ce91f200b115d1ef919d9fdb14b4db87b5d67f8e38b63efca3cfd91ddf4af |
| features | odd-asphere-photopic | 7806b61397ee501f285caf4f1cee9bf1c6520ae4c3d7c7ed0d00d64d1330b84c |
| features | e-line-ref | 0b0f82fadbb79be999e3bf439eb67044e620fd05941e7346e67e99d0a440171d |
| features | e-line-photopic | 147b9a91fd1155441f1c4bda4f92a0ca16457f7b650bf341c21516c9ec0f2085 |
| features | asphere-a20-ref | b10db914a934de3a2a074ccd8d938e8f5a15df09bbbe41e90b3adfaec28de5b1 |
| features | asphere-a20-photopic | bf3df7707349812ee033cd33587c2f90c050c99a1001e2839d5c2888f974af03 |
| features | flat-base-asphere-ref | dcde783cdad5fd68c9aca52a808241a3d436c3f568576b791de8acdc0fd5f030 |
| features | flat-base-asphere-photopic | fcdcf3abb8bca96c84790765c8597cb12447c677ef816fea1dbb4791acc9283f |
| features | rear-plate-rim-ref | 31bf486acface061c777c104e2acb25e14f899a7dd2988b63d0838c8e46fba92 |
| features | rear-plate-rim-photopic | 1c3b599816216a48f77fdca17950cc1778f026df247f0e841775a49f3f5ba71b |
| features | fixed-iris-zoom-ref-wide | 4db46962ff43d333cab4430dc739c4afd7e77824ee7f7b12e37169b0be3111a3 |
| features | fixed-iris-zoom-ref-tele | 15567bb5f10f9c71fda356870eabbca30ac1c4c693c8e097521b2a4308432b72 |
| features | fixed-iris-zoom-photopic-wide | ef0e8df77391e0901a3d905eb1ba9da7390eae43bfdb4b7f94075ab244e0163d |
| features | fixed-iris-zoom-photopic-tele | 203606c1bf1df23c8dc24ff146e9f31034a62bf5d1d627df8122ee51163641ee |
| features | zero-asphere-ref | 7ecd42d1bcf433bc492fb0eafaae81190c604a9969bb0b9b867682ba13b421be |
| features | zero-asphere-photopic | 82a3b8c74b22a95f865dccbbc82d17404a7b7cd6724f9071ccd2b0c31d629bd1 |
| features | stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a |
| features | stop-inside-element-photopic | f8181409b90487e9e7a2dd156ecc9ec1d021232fbd2a806a52ab5cefaff96377 |
| states | canon-ef-135-f2l-usm-f5.6-ref | fb6313aafaef4cc6341c86d507a91837b5deab4417ccdeb699274d5ec65de76f |
| states | canon-ef-135-f2l-usm-f5.6-photopic | b8452374e399797318f5bf31060a91fb510a16084a5afb3e6be6ef13063496e6 |
| states | canon-ef-135-f2l-usm-f5.6-best-ref | cfb40db60c1920a71df2e3577d416c7c11811ad983785f4a3d7c2d4f2ed45d2b |
| states | canon-ef-135-f2l-usm-f5.6-best-photopic | c24132ee4a6e88273a15fa7b038580d6af34b73039befbb7e08e041efa8d574e |
| states | canon-ef-135-f2l-usm-f11-ref | 3538c790a1ec7344597b37548aec69a2df46fcb828795c1bd678079a9ad78dc3 |
| states | canon-ef-135-f2l-usm-f11-photopic | 4b3888e3e44135a6341be52a170ef25e8f6613cfc09ea3338aff49182f2eb50f |
| states | canon-ef-135-f2l-usm-f11-best-ref | fde75efe0d80ad2af8615df46ff798a3e3bf044409d58bf1a3e6271068eb31a3 |
| states | canon-ef-135-f2l-usm-f11-best-photopic | 14847603e9b8882bc6969d619c27ff6639819038d8057f8c7863396cefdacad1 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 11fe04d53f56df0f4217bea7f1df0135e80ac3aa14b3ec6a13c163756b00c748 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 69f407ac3545cd29f360a84f86feb767647b5e08e0a6779f33da5e4b376d278e |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | fb61b013bd83b38b13284163754deed2b37a7d26ad84ca1fcc3db9ef49b1e0c4 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 958bf2882dfe47a5c55bc24b117e7e75139fd4ade2540a30966e262c0ad79e11 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 7c3073c4e7dbedf0705593abf810e4d84fd34d97d7903728a421926d55fa4dc4 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | f0f53b7a7c65c33fe10be69f5a2299f0490464845e77d681fb48f2bfcc10d3c6 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 8cec235dbb1353ecce18595c4106e7ca14174f1935bfc6ac081648abec9e23c8 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | df390f5440cda651600b10cad6ef60995d73c6561661120e2d5b08cd319ad60c |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-ref | 63c31b9a55e5f68d962ae0d5a47e737b4d5df1301a900eb50af363001d160a75 |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-photopic | c9b987d8cd81567b544cd64729e4f6c2b7f93f2c06393c51cc5701af4a7de658 |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 049584b5191a4fd43509da6d422906e44e14697e68119403dd03ccb064f8b1cb |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3928f6f17f07300923ac73beef345737c68861bac0dd626b2bdc9a2e792aaf76 |
| states | sigma-35mm-f14-dg-hsm-a-f11-ref | 02b1e001699f7823e93b41eef21cfbf7c3a7090a93803ba41f9b46d97b1b68b2 |
| states | sigma-35mm-f14-dg-hsm-a-f11-photopic | 3c2e09fba7575f45c009c963bbcc55903b738a3f4c8471749c346993dfc9baa6 |
| states | sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1409655514e43351da977a690ec1a2a38ed6ea92bb6e65758dbabe5775a6f5d7 |
| states | sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3bca4f688cc50138a13532313ab1d9904df3aee898807b4781ad77be191dbd07 |
| states | nikkor-z50f12-f5.6-ref | 93370aead6b9eb8def155ccf5f3a8780f977a3fda62560f1c44406cf3a1d7ceb |
| states | nikkor-z50f12-f5.6-photopic | 385c7c1d4e996fe30b06b3b3da60c5369b24e303e5504e9bf3a35a18c75b6116 |
| states | nikkor-z50f12-f5.6-best-ref | 40adc9d9360db7791e21a3b20e8c0c833654c32f19427a958dd20aced28d9ebf |
| states | nikkor-z50f12-f5.6-best-photopic | dfbc55f21b5bfdb94d025914183cf2ce81cae65921e142c50dc28881c41a97df |
| states | nikkor-z50f12-f11-ref | 1a34a84b12ddaa766ccc173f659f2b44483089c9560aed71cf85aad1528b9335 |
| states | nikkor-z50f12-f11-photopic | 54e397f8a3a165bf4289f3693de28a55d2d298c6b39859466d80e9c30bdba7e3 |
| states | nikkor-z50f12-f11-best-ref | e230a19defd0b95cada536016457031dac54e94566818a5c97cb2e8295bc18ac |
| states | nikkor-z50f12-f11-best-photopic | 00de2164a93bfc177a1e6b974b04656629fd4f9983b109f508a59969ef3209b8 |
| states | sony-fe-20mm-f18-g-f5.6-ref | 032904853c0718dd4654541b6a26e293c3d584c9cc75b880e3327126e0f62550 |
| states | sony-fe-20mm-f18-g-f5.6-photopic | 90768dd4f9cff94d6b4d1e8e89aa47b0fa795942082c1fcaa378b7e49c8c6b30 |
| states | sony-fe-20mm-f18-g-f5.6-best-ref | 6a018b55d80117d42be3a4b4cd945b3c0930f9544519c314aaed262281e346a2 |
| states | sony-fe-20mm-f18-g-f5.6-best-photopic | be213450ef3ba55cb97f2405f03cbe45eee22e9c339070562f09abfa44417bcb |
| states | sony-fe-20mm-f18-g-f11-ref | 66629bfed7b0cb8ab55ac7d50e6363ebefaa1922a52a3915db2e38f86de2b5be |
| states | sony-fe-20mm-f18-g-f11-photopic | f39722550d38b131d139e69c2e44e3e9dc81360822868e20e3019c23c2c64fff |
| states | sony-fe-20mm-f18-g-f11-best-ref | 14626b8ab553320b14dfa90cf59ba2bd7b6b433033a0db1169424e5e61cea556 |
| states | sony-fe-20mm-f18-g-f11-best-photopic | 91ab7e1b2e0a399a56c029c125fcf2ecb64abf78f33865037852fe9eab1f5dc3 |
| states | sony-fe-400mm-f28-gm-oss-f5.6-ref | cfd2f4b05ff511406ee2fcf6445bb368a1e65da0aef98100ce96e52afd7ee8cc |
| states | sony-fe-400mm-f28-gm-oss-f5.6-photopic | 831d378e9ada52a0fce8d30676e13de4ca0529c0ae031a271b2f38a1348cbe92 |
| states | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 7978e8b6317cb261a60c5258a804dc0819ed21ec238ced93389bbed06f7820c1 |
| states | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 7d9377f6dfbb1db84d432d50fda201c28438d00c0c22b75a8c776e16e9e3b393 |
| states | sony-fe-400mm-f28-gm-oss-f11-ref | 1a94040d1d518dd6202eb3867b88ddfc677b2127c68f0e0c14e80f86628c70d7 |
| states | sony-fe-400mm-f28-gm-oss-f11-photopic | 0a597562d6a7ba2141c992046ef765f2ae5a0e8a3c5ab32309f274d58961e5ab |
| states | sony-fe-400mm-f28-gm-oss-f11-best-ref | e8134f174ecafd2430ad50cfb2ba0d0166b13d1551f90aa9d8ac0ffddbb9a459 |
| states | sony-fe-400mm-f28-gm-oss-f11-best-photopic | 96bab879ff1b51208b31b3a7430f275fe19da370173d3ebbb626ff44879c27bd |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 83bc7aa668f82b6b22a13b1acc5b0f5af9ce2968947f11528dea3c0fbeef39e9 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | bee392758ecb32390004f98f6b12fd207c2819f3295a1c09572706c61e9f8a78 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | ace750e815937160ee6fb3ca0e4eb1171b25e239d6417acbed4fe523a22999d2 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | aab2ae39c1bde91b1bfd300d5a037d36ad1c6e728ef18aa1332875a69644862b |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-ref | 849578276ae0917f9e2215c51c30145952bb7126cce058be7687a974b9a8dd4a |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-photopic | e11209865b09b2ee83b249eeb30292b09385d4be43874895769ea5030815dd10 |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 8216f33f93629b810fa907bef02c40e5bcd420baec4ce1d6c8a81dd3bb7cffd6 |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | cad5d2b8147f295b805debf038e32279cd8034cf4c2f7e8fae16d195c0724c44 |
| states | nikon-z-24-70f4s-f5.6-ref-wide | ca4650a2f1cab8126617b31e5e196328c9e6047662925528c44d866fe77ec229 |
| states | nikon-z-24-70f4s-f5.6-ref-zoom0.5 | d6dd88710ac133d194348fdebe5810d09477eb6d54d7d92c5a43b78d42913ffc |
| states | nikon-z-24-70f4s-f5.6-ref-tele | 8b15e190d96badcfb4ffa2b7d3f4cdb4f140a3f73afd80711ce385e7b298967e |
| states | nikon-z-24-70f4s-f5.6-photopic-wide | e5c579f82819d0fd17bab9b165a0d68268e3277d38c601955fc2454ca897f119 |
| states | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | f3c166adc1996382f804c64643c8cf33410c689ded36162fc394be6b97c998b9 |
| states | nikon-z-24-70f4s-f5.6-photopic-tele | 931e283aaa42145afd364f3f3c3151db6f4d3fff9e17a11a221670001f510d17 |
| states | nikon-z-24-70f4s-f5.6-best-ref-wide | 534c54ca70f1030921493f470f9ee0d6a3d238dc3cd43dc509c0f8687e543ea7 |
| states | nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 672c59fea97eac2518485a560ed393242b1d93aea8dd8eb924af71026aad071b |
| states | nikon-z-24-70f4s-f5.6-best-ref-tele | 44724094bec9dc249b2d0587cd4722285afa329dc7ed3247d80487c9bf044284 |
| states | nikon-z-24-70f4s-f5.6-best-photopic-wide | 372038f23d287d7729c48ac2a25f7d3063cf9259c9373e3d3cd9634c822a03fd |
| states | nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 2d5f17c805d756e7c3f19e592c2ce7579ff815aae1622cc5fcbaab7822011cbe |
| states | nikon-z-24-70f4s-f5.6-best-photopic-tele | da4a032bcd346477d4a2b163b9649d4c74d1418c7e149a6dbdbea0522ee7b1f7 |
| states | nikon-z-24-70f4s-f11-ref-wide | a9fc28dc90bb6ec393151512c95cd9bbed404b4e7aeb6110aee02edda8728dfb |
| states | nikon-z-24-70f4s-f11-ref-zoom0.5 | ee0b49410666fe2b115167d3da9eadc492967c802f4457c926b117aafe491428 |
| states | nikon-z-24-70f4s-f11-ref-tele | dc0cc7f4f4644e267e862cc6f513fefb957e91c401cd83910f1faafbba1851f1 |
| states | nikon-z-24-70f4s-f11-photopic-wide | f9c46dad3bd50217adca4144a3c1685011d2501a69a8bdb43d036d6159fdcb82 |
| states | nikon-z-24-70f4s-f11-photopic-zoom0.5 | ef9cc2d09aabd8f2df0079079e7dacf171bf68a97c3c9fc282e70a956ebbc50b |
| states | nikon-z-24-70f4s-f11-photopic-tele | fce6bb24cd7ccf4a3348e9e142978fc681e2825120e5ffc4340b003c2396da9e |
| states | nikon-z-24-70f4s-f11-best-ref-wide | f286f2dfaa83049a3d5591572f3e47840cf0032e6287523202de250b62561b1f |
| states | nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 43c74496798ae9506b5038882eb2fe2fc934ecc74286ea98fdea22129bc9db3f |
| states | nikon-z-24-70f4s-f11-best-ref-tele | 86e79118d05b624fe13b031ef8c4cd8440be28a8e1bff83babd4d8424dbcd0ac |
| states | nikon-z-24-70f4s-f11-best-photopic-wide | c9584523b47f693df0290b83b8b3ab63132e80dbe34e18a859114d18d4f42221 |
| states | nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | b618c6a4fc165f483f15a9ffe70b01d7c219b7bd22cbfe9a0e436fc6e275bb27 |
| states | nikon-z-24-70f4s-f11-best-photopic-tele | fb30f78b0ecd7ccb01891e21c74d1b182e1237ff34e092d8918217830fcea6f0 |
| states | nikon-z-mc-105f28-f5.6-ref | 817dcdb72789e4f19aeb0834fdf38f2df1f9981feeda0e849a6fbe878516246e |
| states | nikon-z-mc-105f28-f5.6-photopic | 84c9c5f86529a56eb59c98d9699d5ceabde325d4dfd0135ea13b231a7e19947f |
| states | nikon-z-mc-105f28-f5.6-best-ref | c083a9ad451157303b51e15cc837a6458e778df9940e23c2ef9b74bd6a6d67f9 |
| states | nikon-z-mc-105f28-f5.6-best-photopic | eca0ec2a6833ea0a6ff84fb4abb54d35c8f0884779586cd39085eeaf2d62a0dd |
| states | nikon-z-mc-105f28-f11-ref | c7f1b99704f56d90a1f686179860d380dced25c8cd033526fcecd4702519f9e4 |
| states | nikon-z-mc-105f28-f11-photopic | 89aff2fe03f9a0a39fb0c4bbc056824d10cf57309e3b559a660da10dee6a9f76 |
| states | nikon-z-mc-105f28-f11-best-ref | 731774161533fcf291c1c1269e0e88539a0dd9e65da2ae8f74753a0b5ca2b774 |
| states | nikon-z-mc-105f28-f11-best-photopic | ae84db3c87b9edba7b3828e4921efe3eb322811fd888ce54fe3f5a1d583abd10 |
| states | nikon-z-135f18-plena-f5.6-ref | 2f48866c86a5c78c9d9985591e3093550306be61ca1b1467ece2a6624837935b |
| states | nikon-z-135f18-plena-f5.6-photopic | 158e1ca33d4c80e41a7176d144ce4462055ecc078db8065a1e7efd3b541b9a4b |
| states | nikon-z-135f18-plena-f5.6-best-ref | 360b7b852f441111c8d5acb454934d8d59d4eca6b658012be793c9e01569543b |
| states | nikon-z-135f18-plena-f5.6-best-photopic | b0a31528f934800ab842ca760d487916e75db648fde6dd0283b9bd01be5f1863 |
| states | nikon-z-135f18-plena-f11-ref | 9370a359110296269721cb8c84b7071d063f75cc1e19f176fc6e2e3e747090cf |
| states | nikon-z-135f18-plena-f11-photopic | f7d5ed81109323d03e7cabbcec21709cb2ab62c8f37cde1fdbf26f38a7f0334b |
| states | nikon-z-135f18-plena-f11-best-ref | e6cc666f0c9c00122578523ed519d8b34a1e9dff2427209471960455699891ec |
| states | nikon-z-135f18-plena-f11-best-photopic | 074e0e4a6c56b4a12f20042d69bad4350e9e7dd8b535d60c0e0616a67be4f882 |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 199c2510c32fa327ab1821e2fab7968e7ad6a4bb2b9a9298f59fa94887b06bb2 |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3b787987b0523c174ae63e6af6a90b3d6dcfe4209652fd059e3648e5c37110d8 |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 8471bafaa095d48e703f204c34d8b0f411aaa31d1f1d70865eb3772e019aacbe |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 0707769a9b97ca9e568da11158f9c6b0510d96d06b860c7348139034fa593d97 |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-ref | f3fcc3b63cd7c8c3a567b5f318c8a9dd3e469e78af15979fd5edb6778d604839 |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1da493f139dea309fe55d78925e539663d88b123a25265afb55d8c454315f1d3 |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | e8b060aaeb44cba02d576fc44c9725a7bd44cc6d4adb173931ddb86caf196c9b |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 2e4db53842a8d8cfe73ba2f2a6fa0dd5b6e72515eed989fa6f6bda3dac11d4b3 |
| states | nikon-z-24-70f4s-open-ref-wide | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| states | nikon-z-24-70f4s-open-ref-zoom0.5 | 0c1e3e17b791b8b76cc5311d51e8dbd6ad9592081d1f4e853b775cf8253d1f53 |
| states | nikon-z-24-70f4s-open-ref-tele | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| states | nikon-z-24-70f4s-open-photopic-wide | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc |
| states | nikon-z-24-70f4s-open-photopic-zoom0.5 | 7d159e41726968a2d56b1cdfce31279b854f316d34d0b1fcc3fb2603407882ae |
| states | nikon-z-24-70f4s-open-photopic-tele | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 |
| states | nikon-z-24-70f4s-open-best-ref-wide | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| states | nikon-z-24-70f4s-open-best-ref-zoom0.5 | e96a55399921f347d7e4cc74cfb6866870a4ce088279506abff48b416df2f370 |
| states | nikon-z-24-70f4s-open-best-ref-tele | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| states | nikon-z-24-70f4s-open-best-photopic-wide | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 |
| states | nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 167b20f99438e790211ba3b18cfc3484e6db92e7a3c4d3f83e3644d08704b87e |
| states | nikon-z-24-70f4s-open-best-photopic-tele | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 |
| states | nikon-z-24-70f4s-f8-ref-wide | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| states | nikon-z-24-70f4s-f8-ref-zoom0.5 | cfe08daed58c95d06787698fb20876419f0d64aeda8b760fcb3c39f5892f1a89 |
| states | nikon-z-24-70f4s-f8-ref-tele | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| states | nikon-z-24-70f4s-f8-photopic-wide | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 |
| states | nikon-z-24-70f4s-f8-photopic-zoom0.5 | e8dcb7a4c161cdf893e35068d743936e001736696a42d5ece8d19551c4d1d4f3 |
| states | nikon-z-24-70f4s-f8-photopic-tele | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf |
| states | nikon-z-24-70f4s-f8-best-ref-wide | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| states | nikon-z-24-70f4s-f8-best-ref-zoom0.5 | c84d1fc5b9e9daa5909cc2530a508854046daba2153963653f5ff7f42ac3bdb5 |
| states | nikon-z-24-70f4s-f8-best-ref-tele | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| states | nikon-z-24-70f4s-f8-best-photopic-wide | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 |
| states | nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 8466fba19f559cbb012fc31dd8927bce9a4cb7969288ac043407b4ba7104c28b |
| states | nikon-z-24-70f4s-f8-best-photopic-tele | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b |
| focus-stations | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | fc71d244aec38864b73ef8750cc52141357ae769fe4d7ea80b387b46ff1a8e55 |
| focus-stations | certified-fujifilm-gf80-f17-zoom0-focus1 | bbd4687c1f32e2819c4015cfb440908f2747d442e89dd218858a35f71743bad9 |
| focus-stations | certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | e92c44ff169ec871c921b962020b502aabf40e71a8bfa6b0e41956ea10f0b00e |
| focus-stations | certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | ce632d6fe72f4ec5daa7775f71f8298fe22684b6c3b9829f1acd927901c5e613 |
| focus-stations | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | b0f8f5466dfaa4f6b686d4163d2df66174f23018b6842d90c6c4ce65e012e360 |
| focus-stations | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | e05ac48d6f62767ab2991094e24729bdc873f47fc38773f94ca29503318d786e |
| focus-stations | certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1ffeed7214f4c219837b85a1116192fabb1e72ff66cd098ede5710dd840281a8 |
| focus-stations | certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 9276015f4a09ae0df05099a0725962e7d7fa25e98db611b456bf45264207fc15 |
| focus-stations | certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 8270906e01b3faca8ae4a642653a0f2f6bbf6c56f6ed124c25e85fe787091421 |
| focus-stations | certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | e2778a011e81560e6271e675f6844482a66b7f3ad247d8746d3215ec4c08e3fe |
| focus-stations | certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 673095cfc1f5665f4aa891be77f7cdb2eeef2dd706ea2d7769ea0e15425e4eec |
| focus-stations | certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus12 | b3794c6c5924cee466179682391e442c92d6fd70b1e0ab0b6ac97082d0b72852 |
| focus-stations | certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom16-focus12 | 0659c248d82dbf06c5521831ad34250a06d1f1b22c927cf1597770b0b227815d |
| focus-stations | certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus12 | f2ba46d7a8b2499a6bc7da15228827704f359e024db844b8fabb06c81d014ef9 |
| focus-stations | certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 874854625cf1dd589f47f331895c0b49532f902a20bbe796f268e2024ce7d9e3 |
| focus-stations | certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 99b6b35e6ae7faa9b94ac06d2c115bb160911667f256de438f8697ea9233b9cc |
| focus-stations | certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 568f93341d119dcc2a9f1949c2dcfcc3d63f99dc26c391280a71e591244fa8d6 |
| focus-stations | certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 72842c3de154ccbb801450d8cbfb7800f0ec613c5773ac45f72186384e60381a |
| focus-stations | certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 617deed34e0bc25befb3e30cb9c900e56525459a0186c7ec769967343f4edf14 |
| focus-stations | certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | db455dd71151e3a29c1df1c0c947b229ff79eee1068aece790b732b3c16f3979 |
| focus-stations | certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | cfdaf3f52ab425d4ee0490bd4bf40d7a91a37615f02c23c3749d3fce68b4622d |
| focus-stations | certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 9876f2f2d40b032687ef30fd0b77d64b7a3d678c0010822ca3458e440d0d8955 |
| focus-stations | certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 53c5ca7e688cbf9f0983edcc98da88609e0868a5b88deef5ce559d2fa68766d5 |
| focus-stations | certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 |
| focus-stations | certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | bb47082c2e9124e55765678231442de72d55ad3b834333c85b8837cf7f9ca5aa |
| focus-stations | certified-samyang-af-14mm-f28-ef-zoom0-focus1 | f738c7fd1c6b1e0119057b5dce8dd097ac9e1e924d461103f9b9821fd323025c |
| focus-stations | certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 26cb89d09f607ed33c3dd367d9c8c05290608b97283f3a53140ceda948b6726e |
| focus-stations | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 77240b3249fc2f96cae82d1c5932f50dcef934088dc2120589ed64b46daa3b0f |
| focus-stations | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 02dd902ccabd7e9efddefd7cf52710bb38253debd4b731f861f8cc74e4fef217 |
| focus-stations | certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 22f573c4dcca9f77d238821d35ca62ce41661714c27dafce162fe79e5c759f23 |
| focus-stations | certified-sigma-135mm-f14-dg-art-zoom0-focus1 | eeb1536ebab034372569abe5359886111aae56eca2050eb0801d93c8c1e67dab |
| focus-stations | certified-sigma-135mm-f14-dg-art-zoom0-focus2 | b549e5c3c090d253532f2bad999fb5293fb98117f7a7588ef80b18423f0e66a2 |
| focus-stations | certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 894debefc6fdb16f1ab38c6055c2fb104509070cfe07cd49d9ad4f8bc92fbd76 |
| focus-stations | certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | e3c1b9c0842d88e4bb1ea57ece875089e1a6de335469b227438334a9f4a6016f |
| focus-stations | certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | acd7822027052cc1952f100f7114f829f03335fe258f4f7cec4b41880210e964 |
| focus-stations | certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 11e8a91c1e7e9666e6214e8dfa9a071aa95c30b044aa47782b4e7f85afc12bae |
| focus-stations | certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | acd45c4d3d13b956da700f7ef03591b83ccd3e342545ada1ebe2d9d82af37a2a |
| focus-stations | certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | b0be2f20e5b95353f9377fd656f14c691282d42c2e611dd69986cfcecb4b85e2 |
| focus-stations | certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 9aee102182725025ed61069c4cf367e7cebed4d547743098cb34574dfd66eaff |
| focus-stations | certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | cf90a40810f02e10d4a3f936a8edef233b88ecbd3a6ee545eaf703df4560b90b |
| focus-stations | certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 17d8f3a57a99e1785f48b4b99a93338c1fe926853d879f06d38255370f1d221a |
| focus-stations | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 851b25697188fac9d7e726bebd0f012893d277d9551e858f7d1dca682ecd9736 |
| focus-stations | certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 0e48e496478c8c822adf0593b386dded544594b0ad9e8a52ee2df544dfd07851 |
| focus-stations | certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 62d4f5600679b10f237e8aa57b30967f59bb7bfb16b5a7a4d351fb64dc84f4eb |
| focus-stations | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3a6c0b2f69addb626038c0990440dde5ddee0abfcb44a8e595df75e5589fe065 |
| focus-stations | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 18b137c95a0dea4adf0bc6590a8f3de81c6d67565837d10fce7c60af1a18a2f3 |
| focus-stations | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | b4a9bef13532c7161f7793a1ecf28c9cafd8b539699dd9d40995b0a468bb9631 |
| focus-stations | certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 4c007de74973def2a32965907541cdd909b081ff8036fef4dde69926c5498cfa |
| focus-stations | certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 827ce23a9b1f784a4b5c4dd72bd345210bc4f7ae826b576e158c4b22bfb38ac4 |
| focus-stations | certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 88fee4e84777e7181151c3b0a912d70efc6652ccbc666ad44e1fff00ce7865de |
| focus-stations | certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | bf2ae8d971feac5f443b981f14fa33957883b73d39ebc168f1c7cd0fcf0e46a5 |
| focus-stations | certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 803b931ecef50d7dda14551d145463bb9d9f1b1973a4337dfd22bbc794d6bc72 |
| focus-stations | certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 10bff0b1d82d13878aac8613719bc9056478c7706a675c17b4e2cd8e7f9de763 |
| focus-stations | certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 22198c5be871fa98cbbb32e8975a4030730a7894a5e8eb7bfe84328a92f0e7bb |
| focus-stations | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | d3c8e53174c6be102245c0f585610a5113b69023d529bc4a8ef903ed7dab1b81 |
| focus-stations | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | e3494e8829f8776277b876a310757be1c87ad3383f203625023abbde92f0401e |
| focus-stations | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 84e21a2ef03892e1c5b23daa5313ab4e43886ee541e31976e7cc56e6e12a3a67 |
| focus-stations | certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | e66d7ce98eb7ba9e080cb5247736616f8a44ddb243f3336b537bdb9343b9346f |
| focus-stations | certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b |
| focus-stations | certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | c4cafe389ff19f2b3ac144e21ca3a2ece14048ff1d29f1bb6524fe0babf56aab |
| focus-stations | certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 7cdedfe0afa1f9483af937f9046fbb2ab00c5bc46d01efdccf884970dcd7f325 |
| focus-stations | certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | e29835a068866e0eb6f0b139d64a7097729dbf772bb0e5a01721d000d453e978 |
| focus-stations | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | e9ad1a503946236f045733f560103e3933bd81639f95378052623200c2cfcc6b |
| focus-stations | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 994c354dbc1f23b34155f96356c86d66c874b96fc93a767ae4b11094eb343fc3 |
| focus-stations | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 20423bc3d2cf0c94f92962d1a19b5c88df68a1182f58d8c4698435db7afac44a |
| focus-stations | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | cf5bfc19bb19d9416ec8d7cb6d06d35602e9e22a6555ab611425d7cab311ca16 |
| focus-stations | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 25da8f06a8d3bdf2628ebb6d3ca7332233ad2a86a1f534cd812ccffcca269b8c |
| focus-stations | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | ccbca3c4799d7e3c75230c6a96457fd805507f1aeb1485390433f3b99e2be175 |
| focus-stations | certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 4556b24f2345c91fef9e2df87e3544a6fc6a852e9a89c849d0fb11af035c1b97 |
| focus-stations | certified-thypoch-ksana-21mm-f35-zoom0-focus1 | f8e388d76b003371215471c21196c27490b0cbf74082366abf7113a8667555cb |
| focus-stations | certified-thypoch-simera-50mm-f14-zoom0-focus1 | ae188d3eb305c52019797e5d4b2b534ffaa03c876c648707567624a3b8f9a0fe |
| focus-stations | certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | f3b6869f0d15a83f79189993426a2d5fa8dfaeb48872cb8b441be70b99fb23a4 |
