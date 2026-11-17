# Validation statement

This statement is rendered from the eight baselines of the benchmark, features, states and focus-stations suites alone, with no engine, clock or machine input. It says what those baselines support, check by check, and what they do not cover.

## Supportable sentence

On 508 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 3.2e-11 mm (gate 1e-8 mm), optical path 9.3e-9 waves (2e-5), geometric MTF 3.5e-10 (1e-7), wave MTF 1.1e-9 (2e-8); the benchmark covers ten wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.49, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.0078. Configurations at which a known failure of one engine is listed (2, optiland's, where LensVisualizer and the reference tracer agree) are not counted. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

## Checks

A configuration is one named run of one suite, with its lens state; the same lens state in two suites counts twice, and check geometric-mtf, which is in both the ray and the MTF baselines, counts once. A configuration pair is two engines on one configuration and one check; a request pair is two engines on one request. The verdict counts count request pairs, answers that were not computed included; a refused lens state has no pairs.

The worst residual of a check held to a limit is the figure largest as a fraction of its own limit; a limit of zero ranks a value of zero at zero and any value above it above every finite ratio. The largest value of each figure is also listed in its own units. The worst of a side-by-side check is the largest MTF difference among the rows that have a review band, over every pair of that check; the differences set aside are listed apart for each external diffraction counterpart. The measured request counts of check wave-mtf leave out fields set aside for their phase step or convergence, even where the verdict of the request is Pass.

The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each check.

| Check | Id | Compares | Kind | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |
|---|---|---|---|---:|---:|---:|---|---|
| Built system | `built-system` | Built layout, shape, aperture, index and sampled sag | held to a limit | 753 | 2259 | 2259 | 2259 Pass | sag.maxScaled 6.04e-16 (no unit); focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28 |
| First-order data | `first-order` | First-order quantities and pupils | held to a limit | 753 | 2259 | 2259 | 2259 Pass | pupilZ.maxScaled 5.98e-11 mm; focus-stations / certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2; lv / optiland at line 0, quantity entrancePupilZ |
| Ray trace | `ray-trace` | Hits, directions, image landings and masks of identical rays | held to a limit | 752 | 2256 | 15267 | 15263 Pass; 4 Fail | mask.mismatches 26 rays; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; lv / optiland |
| Optical path | `optical-path` | Optical path, path to image and chief-relative OPD of identical rays | held to a limit | 752 | 2256 | 15267 | 15267 Pass | opd.maxAbs 2.37e-7 waves; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323 |
| Geometric MTF of the same rays | `geometric-mtf` | This tool's geometric MTF of identical rays, as each engine traces them | held to a limit | 752 | 2256 | 6555 | 6555 Pass | mtf.maxAbs 1.58e-9 (no unit); focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at cut tangential, field 6.42e1 deg, frequencyPerMm 96 |
| LensVisualizer's MTF sampling, replayed | `lv-mtf-replay` | LensVisualizer's geometric MTF beside a replay of its own sampling | held to a limit | 753 | 753 | 753 | 753 Pass | mtf.maxAbs 2.29e-14 (no unit); focus-stations / certified-canon-rf100f28-macro-zoom0-focus2; lv / replay-of-lv-mtf at cut sagittal, field 7.50e-1 of the image height, frequencyPerMm 2 |
| MTF beside optiland's FFT MTF | `mtf-vs-optiland-fft` | LensVisualizer's diffraction MTF beside optiland's FFT MTF and the wave estimate of LensVisualizer's rays | side by side, no limit | 96 | 288 | 288 | 161 Side by side; 31 Side by side, worth a look; 96 Not computed | mtfOffAxis.maxAbs 4.91e-1 (no unit); benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10 |
| Geometric MTF beside optiland's | `geometric-mtf-vs-optiland` | Geometric MTF on each method's own pupil sampling | side by side, no limit | 96 | 288 | 864 | 842 Side by side; 22 Side by side, worth a look | mtfOffAxis.maxAbs 1.22e-2 (no unit); benchmark / sony-fe-400mm-f28-gm-oss-best-ref; optiland / replay-of-lv-mtf at cut sagittal, field 1 of the image height, frequencyPerMm 100 |
| Wave MTF of the same rays | `wave-mtf` | This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled | held to a limit | 752 | 2256 | 6555 | 6555 Pass | waveMtf.maxAbs 1.10e-9 (no unit); focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; lv / optiland at cut tangential, field 4.33e1 deg, frequencyPerMm 90 |
| MTF beside the wave estimate of LensVisualizer's rays | `mtf-vs-wave-estimate` | LensVisualizer's sheared diffraction MTF beside this tool's wave OTF of LensVisualizer's rays | side by side, no limit | 96 | 96 | 96 | 95 Side by side; 1 Side by side, worth a look | mtfOffAxis.maxAbs 5.75e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / wave-mtf-of-lv-rays at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 30 |
| MTF beside the OTF of optiland's wavefront | `mtf-vs-optiland-wavefront` | LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts | side by side, no limit | 96 | 576 | 576 | 380 Side by side; 52 Side by side, worth a look; 144 Not computed | mtfOffAxis.maxAbs 2.75e-1 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 50 |

### Limits and largest values

#### Built system — `built-system`

- limit: aperture.mismatches 0 elements
- limit: index.mismatches 0 elements
- limit: layout.mismatches 0 elements
- limit: sag.maxScaled 1.00e-12 (no unit)
- limit: shape.mismatches 0 elements
- aperture.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 2259
- index.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 2259
- layout.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 2259
- sag.maxScaled 6.04e-16 (no unit); focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28; measured request pairs 2259
- shape.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 2259

#### First-order data — `first-order`

- limit: firstOrder.maxAbs 1.00e-9 mm
- limit: pupilRadius.maxScaled 1.00e-9 mm
- limit: pupilZ.maxScaled 1.00e-9 mm
- firstOrder.maxAbs 2.86e-11 mm; focus-stations / certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1; lv / optiland at line 0, quantity frontFocalZ; measured request pairs 2259
- pupilRadius.maxScaled 7.58e-12 mm; focus-stations / certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2; lv / optiland at line 0, quantity entrancePupilSemiDiameter; measured request pairs 2259
- pupilZ.maxScaled 5.98e-11 mm; focus-stations / certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2; lv / optiland at line 0, quantity entrancePupilZ; measured request pairs 2259

#### Ray trace — `ray-trace`

- limit: direction.maxAbs 1.00e-9 (no unit)
- limit: hits.maxDistance 1.00e-8 mm
- limit: landing.maxDistance 1.00e-8 mm
- limit: mask.mismatches 0 rays
- direction.maxAbs 1.38e-11 (no unit); focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323; measured request pairs 15267
- hits.maxDistance 3.96e-10 mm; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323, surface 35; measured request pairs 15267
- landing.maxDistance 4.13e-10 mm; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323; measured request pairs 15267
- mask.mismatches 26 rays; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; lv / optiland; measured request pairs 15267
- mask.rimBand: 0
- rays.compared: 14415807

#### Optical path — `optical-path`

- limit: opd.maxAbs 2.00e-5 waves
- limit: opticalPath.maxAbs 2.00e-5 waves
- limit: opticalPathToImage.maxAbs 2.00e-5 waves
- opd.maxAbs 2.37e-7 waves; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323; measured request pairs 15267
- opticalPath.maxAbs 2.23e-7 waves; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323; measured request pairs 15267
- opticalPathToImage.maxAbs 2.33e-7 waves; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at field 6.42e1 deg, line 0, ray 323; measured request pairs 15267

#### Geometric MTF of the same rays — `geometric-mtf`

- limit: mtf.maxAbs 1.00e-7 (no unit)
- mtf.maxAbs 1.58e-9 (no unit); focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; optiland / reference-tracer at cut tangential, field 6.42e1 deg, frequencyPerMm 96; measured request pairs 6555
- rays.compared: 14415807
- rays.dropped: 0

#### LensVisualizer's MTF sampling, replayed — `lv-mtf-replay`

- limit: fields.mismatches 0 elements
- limit: mtf.maxAbs 1.00e-9 (no unit)
- limit: sampling.mismatches 0 elements
- fields.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay-of-lv-mtf; measured request pairs 753
- mtf.maxAbs 2.29e-14 (no unit); focus-stations / certified-canon-rf100f28-macro-zoom0-focus2; lv / replay-of-lv-mtf at cut sagittal, field 7.50e-1 of the image height, frequencyPerMm 2; measured request pairs 752
- sampling.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay-of-lv-mtf; measured request pairs 753

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`

- sorting limit: chiefLanding.maxAbs 1.00e-7 mm
- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 4.91e-1 (no unit); benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10; measured request pairs 161
- mtfOnAxis.maxAbs 2.58e-2 (no unit); benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0 of the image height, frequencyPerMm 30; measured request pairs 172
- fields.compared: 452
- fields.data: 0
- fields.flagged: 104
- fields.rimLost: 0
- fields.unavailable: 20

#### Geometric MTF beside optiland's — `geometric-mtf-vs-optiland`

- sorting limit: chiefLanding.maxAbs 1.00e-3 mm
- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 1.22e-2 (no unit); benchmark / sony-fe-400mm-f28-gm-oss-best-ref; optiland / replay-of-lv-mtf at cut sagittal, field 1 of the image height, frequencyPerMm 100; measured request pairs 574
- mtfOnAxis.maxAbs 9.47e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-photopic; optiland / replay-of-lv-mtf at cut tangential, field 0 of the image height, frequencyPerMm 100; measured request pairs 288
- fields.compared: 862
- fields.data: 0
- fields.flagged: 2
- fields.rimLost: 0
- fields.unavailable: 0

#### Wave MTF of the same rays — `wave-mtf`

- limit: waveMtf.maxAbs 2.00e-8 (no unit)
- convergence.maxAbs 1.92e-1 (no unit); focus-stations / certified-viltrox-af-35f18-fe-zoom0-focus1; optiland / reference-tracer at cut tangential, field 3.23e1 deg, frequencyPerMm 40; measured request pairs 6501
- phaseStep.waves 6.27e3 waves; focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; lv / optiland at field 6.42e1 deg, line 0, ray 1226; measured request pairs 6504
- waveMtf.flagged 2.00e-9 (no unit); focus-stations / certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1; optiland / reference-tracer at cut sagittal, field 4.97e1 deg, frequencyPerMm 90; measured request pairs 3156
- waveMtf.maxAbs 1.10e-9 (no unit); focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1; lv / optiland at cut tangential, field 4.33e1 deg, frequencyPerMm 90; measured request pairs 3348
- rays.compared: 57687585
- rays.dropped: 0

#### MTF beside the wave estimate of LensVisualizer's rays — `mtf-vs-wave-estimate`

- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 5.75e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / wave-mtf-of-lv-rays at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 30; measured request pairs 76
- mtfOnAxis.maxAbs 5.42e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-best-ref; lv / wave-mtf-of-lv-rays at cut tangential, field 0 of the image height, frequencyPerMm 80; measured request pairs 83
- fields.compared: 214
- fields.flagged: 74
- fields.unavailable: 0

#### MTF beside the OTF of optiland's wavefront — `mtf-vs-optiland-wavefront`

- sorting limit: chiefLanding.maxAbs 1.00e-7 mm
- review band: mtfOffAxis.maxAbs 1.00e-2 (no unit)
- review band: mtfOnAxis.maxAbs 5.00e-3 (no unit)
- mtfOffAxis.maxAbs 2.75e-1 (no unit); benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 50; measured request pairs 369
- mtfOnAxis.maxAbs 2.62e-2 (no unit); benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0 of the image height, frequencyPerMm 30; measured request pairs 398
- fields.compared: 1056
- fields.data: 0
- fields.flagged: 210
- fields.rimLost: 0
- fields.unavailable: 30

## External diffraction counterparts

Both external diffraction counterparts are set side by side with LensVisualizer, with no preference claimed. Row counts include every requested field, cut and frequency at the last sampling written down, rows not computed and rows set aside included; their classes and statuses are counted apart. The coverage lists the wavelengths requested of LensVisualizer and the wavelengths each counterpart answered, by named state and request.

For the Nikkor Z 50 mm f/1.2 wide open at best focus, the tangential difference between optiland's FFT MTF and the other diffraction estimates at the half field, where every sampling settled, is classed as one of method. The outcomes of the other conditions remain as they were classed: wide open at the full field the FFT computes nothing (not computed), and on the design plane its sampling does not settle (not converged); docs/z50f12-investigation.md describes them.

| Check | Counterpart | Configurations | Rows | Rows by class | Worst of the rows with a review band | Worst set aside |
|---|---|---:|---:|---|---|---|
| MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft` | optiland | 96 | 6336 | 2882 the methods differ (`method`); 66 not converged (`numerical`); 3388 not computed by one engine (`unsupported`) | mtf.maxAbs 4.91e-1 (no unit); benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10 | mtf.maxAbs 4.59e-1 (no unit); benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 1 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `mtf-vs-optiland-wavefront` | otf-of-optiland-wavefront | 96 | 6336 | 5874 the methods differ (`method`); 462 not converged (`numerical`) | mtf.maxAbs 7.78e-3 (no unit); benchmark / nikon-z-24-70f4s-tele-best-photopic; lv / otf-of-optiland-wavefront at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 30 | mtf.maxAbs 6.93e-3 (no unit); benchmark / nikkor-z50f12-best-ref; lv / otf-of-optiland-wavefront at cut tangential, field 1 of the image height, frequencyPerMm 80 |

### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`: optiland

- Wavelengths asked of LensVisualizer (nm): 472.87, 484.76, 504.8, 530.82, 560, 587.5618, 589.18, 615.2, 635.24, 647.13
- Wavelengths the counterpart answered (nm): 587.5618
- Fields requested: 0, 0.5, 1
- Configurations with rows that have a review band: 47
- Chief-landing sorting limits (mm): 1.00e-7
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Rows by status: 295 Side by side, worth a look (`ATTENTION`); 2587 Side by side (`RECORDED`); 66 Set aside (`SET ASIDE`); 3388 Not computed (`UNSUPPORTED`)

| Suite | Named state / request | LensVisualizer wavelengths (nm) | Counterpart wavelengths (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Side by side, worth a look |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: numerical / unconverged; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | canon-ef-135-f2l-usm-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side, worth a look |
| benchmark | nikkor-z50f12-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-mc-105f28-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | Not computed |

### MTF beside the OTF of optiland's wavefront — `mtf-vs-optiland-wavefront`: otf-of-optiland-wavefront

- Wavelengths asked of LensVisualizer (nm): 472.87, 484.76, 504.8, 530.82, 560, 587.5618, 589.18, 615.2, 635.24, 647.13
- Wavelengths the counterpart answered (nm): 472.87, 484.76, 504.8, 530.82, 560, 587.5618, 589.18, 615.2, 635.24, 647.13
- Fields requested: 0, 0.5, 1
- Configurations with rows that have a review band: 96
- Chief-landing sorting limits (mm): 1.00e-7, 1.00e-3
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Rows by status: 20 Side by side, worth a look (`ATTENTION`); 5854 Side by side (`RECORDED`); 462 Set aside (`SET ASIDE`)

| Suite | Named state / request | LensVisualizer wavelengths (nm) | Counterpart wavelengths (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side, worth a look |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side, worth a look |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side, worth a look |
| benchmark | nikkor-z50f12-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side, worth a look |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-mc-105f28-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | Side by side |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic / 0 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 560, 530.82, 589.18, 504.8, 615.2, 484.76, 635.24, 472.87, 647.13 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | Side by side |

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
| canon-ef-135-f2l-usm-best-photopic | — | yes |
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

518 named states are declared, 511 are run with a lens state, and 7 are refused.

| Named state | Refusal | Measured on ray-trace, optical-path, geometric-mtf and wave-mtf for both pairs of LensVisualizer and an external engine |
|---|---|---|
| certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | — | no |
| certified-apo-lanthar-50f2-zoom0-focus1 | — | yes |
| certified-canon-ef-100mm-f28-macro-zoom0-focus1 | — | yes |
| certified-canon-ef-100mm-f28-macro-zoom0-focus2 | — | yes |
| certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | — | no |
| certified-canon-ef-135-f2l-usm-zoom0-focus1 | — | no |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | — | yes |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | — | yes |
| certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | — | yes |
| certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | — | yes |
| certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | — | no |
| certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | — | yes |
| certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | — | yes |
| certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | — | no |
| certified-canon-efm-22mm-f2-stm-zoom0-focus1 | — | yes |
| certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | — | no |
| certified-canon-fd-35-f2-zoom0-focus1 | — | no |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | — | yes |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | — | no |
| certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | — | no |
| certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | — | no |
| certified-canon-rf-50-f12-l-zoom0-focus1 | — | no |
| certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | — | no |
| certified-canon-rf-85f2-macro-zoom0-focus1 | — | yes |
| certified-canon-rf-85f2-macro-zoom0-focus2 | — | no |
| certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | — | no |
| certified-canon-rf100f28-macro-zoom0-focus1 | — | no |
| certified-canon-rf100f28-macro-zoom0-focus2 | — | no |
| certified-canon-tse-135mm-f4l-zoom0-focus1 | — | yes |
| certified-canon-tse-50f28l-macro-zoom0-focus1 | — | yes |
| certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | — | yes |
| certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | — | yes |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | — | yes |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | — | yes |
| certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | — | yes |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | — | yes |
| certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | — | yes |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | — | no |
| certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | — | no |
| certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | — | yes |
| certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | — | no |
| certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | — | no |
| certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | — | no |
| certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | — | no |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | — | no |
| certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | — | yes |
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | — | yes |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | — | yes |
| certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | — | yes |
| certified-fujifilm-gf-23mm-f4-zoom0-focus1 | — | yes |
| certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | — | yes |
| certified-fujifilm-gf80-f17-zoom0-focus1 | — | no |
| certified-fujifilm-xf-200-f2-zoom0-focus1 | — | yes |
| certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | — | no |
| certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | — | no |
| certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | — | yes |
| certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | — | no |
| certified-fujifilm-xf50-f1-zoom0-focus1 | — | no |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | — | yes |
| certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | — | yes |
| certified-fujifilm-xf80-f28-macro-zoom0-focus1 | — | no |
| certified-fujifilm-xf90f2-zoom0-focus1 | — | yes |
| certified-gf-120f4-macro-zoom0-focus1 | — | yes |
| certified-hasselblad-hc-macro-4-120-zoom0-focus1 | — | yes |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | — | yes |
| certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | — | yes |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | — | yes |
| certified-hasselblad-xcd-65-f28-zoom0-focus1 | — | no |
| certified-hasselblad-xcd-65-f28-zoom0-focus2 | — | yes |
| certified-konica-hexanon-60f12-zoom0-focus1 | — | no |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | — | yes |
| certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | — | yes |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | — | no |
| certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | — | yes |
| certified-laowa-105mm-f2-stf-zoom0-focus1 | — | yes |
| certified-laowa-12mm-f28-zero-d-zoom0-focus1 | — | yes |
| certified-laowa-15f4-macro-zoom0-focus1 | — | yes |
| certified-laowa-15mm-f2-zero-d-zoom0-focus1 | — | no |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | — | yes |
| certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | — | yes |
| certified-laowa-24f14-probe-zoom0-focus1 | — | yes |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | — | yes |
| certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | — | yes |
| certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | — | yes |
| certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | — | yes |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | — | yes |
| certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | — | yes |
| certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | — | no |
| certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | — | yes |
| certified-leica-apo-summicron-43f2-zoom0-focus1 | — | yes |
| certified-leica-apo-summicron-43f2-zoom0-focus2 | — | yes |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | — | yes |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | — | yes |
| certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | — | yes |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | — | yes |
| certified-leica-summilux-28f17-zoom0-focus1 | — | no |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | — | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | — | yes |
| certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | — | yes |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | — | yes |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | — | yes |
| certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | — | yes |
| certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | — | yes |
| certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | — | yes |
| certified-minolta-af-100mm-f2-zoom0-focus1 | — | no |
| certified-minolta-af-100mm-f28-macro-zoom0-focus1 | — | no |
| certified-minolta-af-100mm-f28-macro-zoom0-focus2 | — | no |
| certified-minolta-af-135mm-f28-zoom0-focus1 | — | no |
| certified-minolta-af-20mm-f28-zoom0-focus1 | — | no |
| certified-minolta-af-24mm-f28-zoom0-focus1 | — | yes |
| certified-minolta-af-300mm-f28-zoom0-focus1 | — | yes |
| certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | — | yes |
| certified-minolta-af-50mm-f28-macro-zoom0-focus1 | — | no |
| certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | — | yes |
| certified-minolta-stf-135f28-t45-zoom0-focus1 | — | yes |
| certified-nikkor-105-f14e-ed-zoom0-focus1 | — | no |
| certified-nikkor-28f14d-zoom0-focus1 | — | no |
| certified-nikkor-85f14d-zoom0-focus1 | — | no |
| certified-nikkor-85f14g-zoom0-focus1 | — | no |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | — | yes |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | — | yes |
| certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | — | no |
| certified-nikkor-afs-14-24f28-zoom0-focus3 | — | yes |
| certified-nikkor-afs-14-24f28-zoom0-focus4 | — | no |
| certified-nikkor-afs-14-24f28-zoom1-focus2 | — | yes |
| certified-nikkor-afs-14-24f28-zoom1-focus4 | — | no |
| certified-nikkor-afs-14-24f28-zoom2-focus1 | — | no |
| certified-nikkor-afs-14-24f28-zoom2-focus4 | — | no |
| certified-nikkor-afs-200-500f56e-zoom0-focus1 | — | yes |
| certified-nikkor-afs-200-500f56e-zoom1-focus1 | — | yes |
| certified-nikkor-afs-200-500f56e-zoom2-focus1 | — | yes |
| certified-nikkor-n-28f2-zoom0-focus1 | — | no |
| certified-nikkor-z-100-400-f4556-zoom0-focus1 | — | no |
| certified-nikkor-z-100-400-f4556-zoom1-focus1 | — | no |
| certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | — | yes |
| certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | — | yes |
| certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | — | yes |
| certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | — | no |
| certified-nikkor-z-28f28-zoom0-focus1 | — | no |
| certified-nikkor-z-50f18s-zoom0-focus1 | — | no |
| certified-nikkor-z-70-200f28-zoom0-focus1 | — | no |
| certified-nikkor-z-70-200f28-zoom1-focus1 | — | no |
| certified-nikkor-z-70-200f28-zoom2-focus1 | — | no |
| certified-nikkor-z-85f18s-zoom0-focus1 | — | no |
| certified-nikkor-z50f12-zoom0-focus1 | — | no |
| certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | — | yes |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | — | yes |
| certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | — | no |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | — | yes |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | — | yes |
| certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | — | yes |
| certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | — | yes |
| certified-nikon-af-fisheye-nikkor-16mm-f28d-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | — | no |
| certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | — | yes |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | — | no |
| certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | — | yes |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | — | no |
| certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | — | yes |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | — | no |
| certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | — | no |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | — | yes |
| certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | — | yes |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | — | yes |
| certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | — | yes |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | — | no |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | — | yes |
| certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | — | no |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | — | yes |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | — | yes |
| certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | — | no |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom1-focus1 | finite-conjugate-unavailable | no |
| certified-nikon-af-s-fisheye-nikkor-8-15mm-f35-45e-ed-zoom2-focus1 | finite-conjugate-unavailable | no |
| certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | — | no |
| certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | — | no |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | — | yes |
| certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | — | yes |
| certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | — | yes |
| certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | — | yes |
| certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | — | yes |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | — | yes |
| certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | — | yes |
| certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | — | no |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | — | no |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | — | yes |
| certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | — | yes |
| certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | — | no |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | — | no |
| certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | — | no |
| certified-nikon-afs-28f14e-zoom0-focus1 | — | no |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | — | yes |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | — | yes |
| certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | — | yes |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | — | yes |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | — | no |
| certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | — | no |
| certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | — | no |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | — | no |
| certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | — | yes |
| certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | — | no |
| certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | — | no |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | — | no |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | — | no |
| certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | — | no |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | — | no |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | — | no |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | — | yes |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | — | yes |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | — | no |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | — | yes |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | — | yes |
| certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | — | no |
| certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | — | no |
| certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | — | no |
| certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | — | no |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | — | yes |
| certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | — | no |
| certified-nikon-micro-60f28g-zoom0-focus1 | — | yes |
| certified-nikon-micro-60f28g-zoom0-focus2 | — | no |
| certified-nikon-nikkor-20mm-f4-zoom0-focus1 | — | yes |
| certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | — | no |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | — | yes |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | — | yes |
| certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | — | yes |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | — | no |
| certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | — | no |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | — | yes |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | — | no |
| certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | — | no |
| certified-nikon-nikkor-z-35f12s-zoom0-focus1 | — | no |
| certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | — | yes |
| certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | — | no |
| certified-nikon-z-14-24f28-s-zoom0-focus4 | — | no |
| certified-nikon-z-14-24f28-s-zoom0-focus5 | — | yes |
| certified-nikon-z-14-24f28-s-zoom1-focus3 | — | no |
| certified-nikon-z-14-24f28-s-zoom1-focus5 | — | yes |
| certified-nikon-z-14-24f28-s-zoom2-focus2 | — | yes |
| certified-nikon-z-14-24f28-s-zoom2-focus5 | — | no |
| certified-nikon-z-14-24f28-s-zoom3-focus1 | — | no |
| certified-nikon-z-14-24f28-s-zoom3-focus5 | — | no |
| certified-nikon-z-58f095-noct-zoom0-focus1 | — | no |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | — | no |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | — | yes |
| certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | — | yes |
| certified-nikon-z-mc-105f28-zoom0-focus1 | — | yes |
| certified-nikon-z-mc-105f28-zoom0-focus2 | — | yes |
| certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | — | yes |
| certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | — | yes |
| certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | — | no |
| certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | — | no |
| certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | — | yes |
| certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | — | yes |
| certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | — | yes |
| certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | — | no |
| certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | — | yes |
| certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | — | yes |
| certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | — | no |
| certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | — | no |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | — | yes |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | — | yes |
| certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | — | yes |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | — | yes |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | — | yes |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | — | no |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | — | no |
| certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | — | no |
| certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | — | no |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | — | yes |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | — | yes |
| certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | — | yes |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | — | no |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | — | no |
| certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | — | no |
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
| certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | — | no |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | — | yes |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | — | yes |
| certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | — | yes |
| certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | — | no |
| certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | — | no |
| certified-panasonic-leica-dg-9f17-zoom0-focus1 | — | yes |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | — | no |
| certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | — | no |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | — | no |
| certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | — | no |
| certified-panasonic-lumix-g-8mm-f35-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | — | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | — | no |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | — | no |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | — | yes |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | — | yes |
| certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | — | yes |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | — | yes |
| certified-panasonic-lumix-s-35-f18-zoom0-focus1 | — | no |
| certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | — | yes |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | — | yes |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | — | no |
| certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | — | no |
| certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | — | no |
| certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | — | no |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | — | yes |
| certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | — | yes |
| certified-pentax-da-star-300mm-f4-zoom0-focus1 | — | yes |
| certified-pentax-da-star-55mm-f14-zoom0-focus1 | — | no |
| certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | — | no |
| certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | — | yes |
| certified-pentax-f-135mm-f28-if-zoom0-focus1 | — | no |
| certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | — | no |
| certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | — | no |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | — | yes |
| certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | — | yes |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | — | no |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | — | yes |
| certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | — | yes |
| certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | — | no |
| certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | — | yes |
| certified-ricoh-gxr-a12-18f25-zoom0-focus1 | — | yes |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | — | yes |
| certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | — | no |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | — | no |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | — | yes |
| certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | — | no |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | — | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | — | yes |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | — | yes |
| certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | — | no |
| certified-samyang-af-18mm-f28-fe-zoom0-focus1 | — | no |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | — | yes |
| certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | — | no |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | — | no |
| certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | — | no |
| certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | — | yes |
| certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | — | no |
| certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | — | no |
| certified-samyang-xp-35mm-f1p2-zoom0-focus1 | — | no |
| certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | — | no |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | — | yes |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | — | yes |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | — | no |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | — | yes |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | — | no |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | — | yes |
| certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | — | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | — | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | — | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | — | no |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | — | no |
| certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | — | no |
| certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | — | no |
| certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | — | no |
| certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | — | no |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | — | yes |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | — | no |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | — | no |
| certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | — | no |
| certified-sigma-30mm-f28-dn-art-zoom0-focus1 | — | yes |
| certified-sigma-35-f14-dgdn-art-zoom0-focus1 | — | yes |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | — | yes |
| certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | — | no |
| certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | — | yes |
| certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | — | no |
| certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | — | yes |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | — | yes |
| certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | — | yes |
| certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | — | no |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | — | no |
| certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | — | no |
| certified-sigma-60mm-f28-dn-zoom0-focus1 | — | yes |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | — | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | — | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | — | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | — | no |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | — | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | — | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | — | yes |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | — | yes |
| certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | — | yes |
| certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | — | yes |
| certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | — | no |
| certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | — | no |
| certified-sigma-85f14-art-zoom0-focus1 | — | no |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | — | no |
| certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | — | no |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | — | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | — | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | — | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | — | yes |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | — | no |
| certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | — | no |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | — | no |
| certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | — | no |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | — | no |
| certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | — | no |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | — | yes |
| certified-sigma-art-40-f14-zoom0-focus1 | — | no |
| certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | — | no |
| certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | — | yes |
| certified-sigma-dp1x-16mm-f4-zoom0-focus1 | — | yes |
| certified-sigma-dp2m-30f28-zoom0-focus1 | — | yes |
| certified-sonnar-e-24f18-za-zoom0-focus1 | — | yes |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | — | yes |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | — | yes |
| certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | — | yes |
| certified-sony-e-20f28-zoom0-focus1 | — | no |
| certified-sony-e-50mm-f18-oss-zoom0-focus1 | — | no |
| certified-sony-e-50mm-f18-oss-zoom0-focus2 | — | yes |
| certified-sony-fe-1224f28-gm-zoom0-focus1 | — | yes |
| certified-sony-fe-1224f28-gm-zoom1-focus1 | — | yes |
| certified-sony-fe-1224f28-gm-zoom2-focus1 | — | yes |
| certified-sony-fe-135-f18-gm-zoom0-focus1 | — | yes |
| certified-sony-fe-135-f18-gm-zoom0-focus2 | — | yes |
| certified-sony-fe-14mm-f18-gm-zoom0-focus1 | — | yes |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | — | yes |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | — | yes |
| certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | — | yes |
| certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | — | yes |
| certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | — | yes |
| certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | — | no |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | — | yes |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | — | no |
| certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | — | no |
| certified-sony-fe-24-f28-g-zoom0-focus1 | — | no |
| certified-sony-fe-24mm-f14-gm-zoom0-focus1 | — | no |
| certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | — | no |
| certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | — | no |
| certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | — | no |
| certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | — | yes |
| certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | — | yes |
| certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | — | yes |
| certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | — | yes |
| certified-sony-fe-50mm-f12-gm-zoom0-focus1 | — | no |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | — | yes |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | — | no |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | — | yes |
| certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | — | yes |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | — | yes |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | — | yes |
| certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | — | yes |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | — | yes |
| certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | — | no |
| certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | — | yes |
| certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | — | yes |
| certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | — | no |
| certified-sony-planar-fe-50f14-za-zoom0-focus1 | — | yes |
| certified-sony-planar-fe-50f14-za-zoom0-focus2 | — | no |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | — | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | — | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | — | yes |
| certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | — | no |
| certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | — | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | — | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | — | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | — | no |
| certified-tamron-a056-70-180-f28-zoom0-focus1 | — | yes |
| certified-tamron-a056-70-180-f28-zoom1-focus1 | — | yes |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | — | yes |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | — | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | — | no |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | — | no |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | — | no |
| certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | — | no |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | — | yes |
| certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | — | yes |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | — | yes |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | — | yes |
| certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | — | yes |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | — | yes |
| certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | — | yes |
| certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | — | no |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | — | no |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | — | no |
| certified-ultron-28f2-asph-zoom0-focus1 | — | yes |
| certified-varisoft-rokkor-85f28-zoom0-focus1 | — | no |
| certified-viltrox-af-23mm-f14-zoom0-focus1 | — | no |
| certified-viltrox-af-35f18-fe-zoom0-focus1 | — | no |
| certified-viltrox-af-56mm-f14-e-zoom0-focus1 | — | no |
| certified-vivitar-series1-90f25-macro-zoom0-focus1 | — | yes |
| certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | — | yes |
| certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | — | no |
| certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | — | no |
| certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | — | yes |
| certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | — | no |
| certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | — | yes |
| certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | — | yes |
| certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | — | no |
| certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | — | no |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | — | no |
| certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | — | no |
| certified-voigtlander-nokton-x-35f12-zoom0-focus1 | — | no |
| certified-voigtlander-nokton-x-50f12-zoom0-focus1 | — | no |
| certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | — | no |
| certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | — | yes |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | — | no |
| certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | — | no |
| certified-yongnuo-yn-50mm-f14-zoom0-focus1 | — | no |
| certified-yongnuo-yn-50mm-f14-zoom0-focus2 | — | no |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | — | yes |
| certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | — | yes |
| certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | — | no |
| certified-zeiss-batis-18f28-zoom0-focus1 | — | yes |
| certified-zeiss-batis-85f18-zoom0-focus1 | — | yes |
| certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | — | yes |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | — | yes |
| certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | — | yes |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | — | yes |
| certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | — | no |

## Failures, classified

A listed failure keeps its verdict, Fail; each failing figure keeps its class, the hash of its evidence, the entry of docs/gotchas.md that explains it and a command that reproduces it in one run.

| Run | Check | Engines | Figure | Class | Gotcha | Reproducer |
|---|---|---|---|---|---|---|
| focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | Ray trace — `ray-trace` | lv / optiland | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |
| focus-stations / certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | Ray trace — `ray-trace` | optiland / reference-tracer | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |
| focus-stations / certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | Ray trace — `ray-trace` | lv / optiland | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |
| focus-stations / certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | Ray trace — `ray-trace` | optiland / reference-tracer | mask.mismatches | the methods differ (`method`) | docs/gotchas.md#on-an-asphere-optilands-iteration-starts-at-the-base-conic-and-goes-where-that-leads | node bin/lvrtc.mjs run suites/focus-stations-repro/certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1.json --checks ray-trace --jobs 4 |

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
| baselines/benchmark.json | 101a96f10122fcb7ec2244a389d79ef0979c34cefce9675ba702e8b4b7665906 |
| baselines/benchmark.mtf.json | c456fdce124a8037a76cdd51a3dc264f22e005db6719024d1825614b52079579 |
| baselines/features.json | 643aa141cb56fd1810abf83e270a52dc19a5fae5e2674187461a1efa5f05f624 |
| baselines/features.mtf.json | dab06e3d542b8a1aa6387a9179adcb05b0455eaaec896932b33eed9cb7c239ca |
| baselines/states.json | 03ba76735de737e9fcee937bc869362c66cb7674fa1a24cd33bb78c739a47581 |
| baselines/states.mtf.json | 52f727c6596d0cf95922ee4e0201a8cf5a715c90fa12a03bea28f3a1bcb4b4bf |
| baselines/focus-stations.json | f2f586a37b1c7ee7894060af1f52935fd0149de7128f97f6a9e57febc12d1d94 |
| baselines/focus-stations.mtf.json | 309f192760ffab74f533188e2578f83435eaf39f2c940f01af7fd45b08e88562 |

| Suite | Named state | Lens state (SHA-256) |
|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref | b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60 |
| benchmark | canon-ef-135-f2l-usm-photopic | b5db810e50204c2dc4f40c8720eec2acc118a3f5ba43ad7718e8e361f62c9a8c |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | 45f1fc0b454f809de9f793d565d6aa7bd8ca0460ea03e89c675039251c296a60 |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref | 18ef72984fad20ad086ba18f8b839edb2d9d142a51397b4b7c1a3cdf1565d456 |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic | 49eae83980d3a2b089251ac79188e8e6f11910bfd72f33cb245397531e11cf16 |
| benchmark | nikkor-z50f12-ref | 861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22 |
| benchmark | nikkor-z50f12-photopic | 84400e63b4de00e35171d3bd0bf8df3aa8e940f3d5dade0ee298761249c637e2 |
| benchmark | sony-fe-20mm-f18-g-ref | b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5 |
| benchmark | sony-fe-20mm-f18-g-photopic | 3ef2cff569dc2714ff638c58f6b0ca0c1a10f180c31a8cf76095e96b3648dbda |
| benchmark | sony-fe-400mm-f28-gm-oss-ref | 75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5 |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic | a58e00887093c8578107118a6f861e957b3ba012781c0061a213fc938268fd6d |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref | e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic | a164cd6b31901aed41e804b10704df98977ca3559bc547c2f876eefea0af010f |
| benchmark | nikon-z-24-70f4s-wide-ref | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| benchmark | nikon-z-24-70f4s-wide-photopic | 392526a2d4fb6800be21455fb7097f75e53156a130b490f79830e62460359a12 |
| benchmark | nikon-z-24-70f4s-tele-ref | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| benchmark | nikon-z-24-70f4s-tele-photopic | 9e3b47006624814732c91d238b73f183b938f21c947092003915ea16b13a4827 |
| benchmark | nikon-z-mc-105f28-ref | 70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb |
| benchmark | nikon-z-mc-105f28-photopic | ceaed4b7737a40f115bd46b8c7fff24f61a9b7586604a0c02db850a74702fc97 |
| benchmark | nikon-z-135f18-plena-ref | 449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab |
| benchmark | nikon-z-135f18-plena-photopic | 47a027ecb521ce8e8589f9605124d6b966785de4024b1793e9961dbcfcc75afa |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref | 2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic | e88166a19b0d185b63ed16ca4c493102684d84578284592096743da5fd9f8bdd |
| benchmark | canon-ef-135-f2l-usm-best-ref | b4f341d96e9f6e711ecf326eeb3cdaf3602a856cdfba61ec965ecc71b89499de |
| benchmark | canon-ef-135-f2l-usm-best-photopic | d022d1d09ec0c3f1f97aaeda79bbf7bac8382354750cc39f1f61c85c5bd39551 |
| benchmark | canon-ef-135-f2l-usm-f8-ref | d1fd0633e961ca14b7e8a890140c4d184c21a53e0969e4179e2f142257180fc7 |
| benchmark | canon-ef-135-f2l-usm-f8-photopic | 5624c31ade8c2dce2d418842c932156c9908c45e56ae5f54e37fffde325eeadd |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref | 9181a5e3a48bf546f4561ba7bb1b9fb5de2bdf85f2f1080c60230661b568ddca |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic | 190ba213f4cd3382515a63166c31a1022e87db7e6e988a7b5429ee08ec16e04f |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 52523bad0a00d71977e0eefafa46b9cda099b1324777dde14b699fab0c5b4b9b |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | 0f3003ead057d91b53fc9e415c3042ce341b94a92d1f9842bf5f349485ed230b |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 30e4a4eec70f588e984e1210446b9eb671089990b41bdf7c6425457f870b4ebd |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 97c17da6ba9d72f3117c31a581a0c80352297b0b981491838b96343093a6d15b |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | eb45ad15291d7f5e4556a8ab1655f8b325aa8433e5806470be1db9dbc663d1ae |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 21e0d632969768033832d4878a7ce45a0fbcd1eeba10c3646191b546e2b5f2ff |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref | 130981bdd7a4989b64f69069a4346f2004bccb5f4e41fddc1b856bcd792c7d4d |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic | 5913d6d21d5f2d295c681137b6de9ac9913a595fee807f1c0f181a0d92e90605 |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref | ce80398ec92f83206f4b4190f455665210292985b2b13c0bdc728983ac8ef72a |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic | 83204a76045d1fdc54c881aec747fc8a5061647e0801e76e5a3c1ce92cd7d596 |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref | 53d98c230d539a2f9f241accb3d0f4ceaab1006e5601e8c391d9ccf38239f723 |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic | fa6d44f03608ba916462eaf59e8bd91ab5acc13fe89d57fffd93de00397d1ed3 |
| benchmark | nikkor-z50f12-best-ref | 13cd75d2e0891cf4ab4f2e8c006a7719cdd7721caa4dce11e1faa6ab1f70e8f5 |
| benchmark | nikkor-z50f12-best-photopic | 06428079dd39a6f0571a0c620e76b836a7c1784e3cb93a5df740c7d484e9c620 |
| benchmark | nikkor-z50f12-f8-ref | b2e66abb6142cc758397469e55448599762d9712ba3d6cd768f8cea13b336b92 |
| benchmark | nikkor-z50f12-f8-photopic | 9e42b1517ecef299400be6273e4c29bd0584e1bdd4b1ff3f914d0641cd76591e |
| benchmark | nikkor-z50f12-f8-best-ref | 359dc743691cfd7a56b445301c5703d5ead4e6fc68863d5faf7c5d386acddfa5 |
| benchmark | nikkor-z50f12-f8-best-photopic | 7fae8fab9b7bbc5309fe77fee83fa5d2e22a2a8aeea3ae4afa56205a2ef83d58 |
| benchmark | sony-fe-20mm-f18-g-best-ref | 469d8f48aaac16ae2f6e2ce67f033e9eacff42111d6b3e1c1eb2c6450c40fb3a |
| benchmark | sony-fe-20mm-f18-g-best-photopic | 6c51a18fd8c3931a460501e3795f1a7d4c01b1b06bc3dc154bd2eb2049a1916a |
| benchmark | sony-fe-20mm-f18-g-f8-ref | cd2d5eb4481fbd7b01ae526b4808841fdcb6467f04d85b0cc0e040b2d2955ce0 |
| benchmark | sony-fe-20mm-f18-g-f8-photopic | bb94daaffcbff69694b9bdef6e69175a11092f05cd1c46d56a1fcac3b16dfa90 |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref | e169bad1480d89fff330c5fc66e0d06dcb23e767ffd4a9c0a14159caf68abb5e |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic | 37d59ff1e5b1edbaa1a43845368a9a99c43aaa1b08a62a09a7caa3e123c828ea |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref | 321e4ba0ce5c220609a55b35ac8a33079ccf30c7e3258a67ec1463edf2554afb |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic | 423a43df1a994c6b8e2e7e24e7caf046c25f6d888d7aaa51e07074d67a9606c3 |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref | bdba0ea2e9d167e31d49a03bd99c873d71bc7945b8b646ac3cb48b4710a872f2 |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic | 014750f1a6b31e976edcb5312a7ad64f02e45477eae8aa655544e97fa2b3f9cc |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref | 93e98f340fb7f23d10d90375c3c3953cd5c871e2867247ae73e24e3fa40b0e6d |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic | dd791f47eb36f29f371173696ad51e168a7ad96f6d04741433d3fe3afafc3663 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref | f74812129cc4c7918a44f8ec7cb6ce9882367b23bc0d991f04712a7e6cc9206e |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic | 2be793c1d19d2cd1f39ce7b5629143de2d6fb5053fff65bf733d8d6794b6377f |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref | 58eb582de9ad963ec75ab5f5009ec8889068ea50be5cdb6da32ac6d23f9c6698 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 7d5feaed48371fe19a27c2449deec812ccb7c4578866ce23a45d25b9decc9bdf |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 5285ea322b02f0fd436d12c9cd11c5e1abde75282625e1351b4d7c57d2f7cdd9 |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | b60f32c9e4e8e4a4a34d3a521ec4dda3455189bbe244cf42e4b2580fd91685ad |
| benchmark | nikon-z-24-70f4s-wide-best-ref | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| benchmark | nikon-z-24-70f4s-wide-best-photopic | c3e2ff5ca8846d295ca192a631c924ad89fac42eca1b4c18770d8f5617b8c506 |
| benchmark | nikon-z-24-70f4s-wide-f8-ref | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic | ab3760654d94804e8278e5cad2c61fac6237577dc6f556f1840b1c720c67ccc2 |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic | 6882783f3706c89459ea475b03c5097f00f8e10b8f38f8c7a912789db7f9c183 |
| benchmark | nikon-z-24-70f4s-tele-best-ref | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| benchmark | nikon-z-24-70f4s-tele-best-photopic | 744b809865d1a1116492bfbf856ab119ea41ab803108f9c981f69923f41cf76e |
| benchmark | nikon-z-24-70f4s-tele-f8-ref | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic | 3880b49fc9097685272f3f5f6b9410a3c721798228c33fa69503e366e3a28067 |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic | b3e22a7473a909ad089f72ea18ecbbea131ebcc8d3093090ae20e82ef40a8794 |
| benchmark | nikon-z-mc-105f28-best-ref | c83e32a7f5c48ad358d471710d082e4a5fb745e7baae2c989ec4a957709a8bbb |
| benchmark | nikon-z-mc-105f28-best-photopic | 7c836d3d9dac81afeef7ad9444282493a845677a40599b9ba868c0acb520fae6 |
| benchmark | nikon-z-mc-105f28-f8-ref | 904ae8663e1e238175e7d632b807c7b9efc4ab69381a92b0613675b2dbc891a9 |
| benchmark | nikon-z-mc-105f28-f8-photopic | babaeb332392e6e0d1d45fbc2ddb1d5225905c121b66eedbd07a508a9984e4d2 |
| benchmark | nikon-z-mc-105f28-f8-best-ref | d31b3e7efcdab37966e8b8135217738e6192f77faec1b974d94409d648accd72 |
| benchmark | nikon-z-mc-105f28-f8-best-photopic | 934e7354019aa488588a6855231337d044fa478ac607c7c0459df78d234f5c07 |
| benchmark | nikon-z-135f18-plena-best-ref | 0c9e2d7b9f2923c21fef404d7b86f7e31456364f77a5f300a13a06219d4add72 |
| benchmark | nikon-z-135f18-plena-best-photopic | d75a8ef4644486a1e3ffa0378794fea65884e3cc705489a31a15bf100b02861a |
| benchmark | nikon-z-135f18-plena-f8-ref | 7f0c3394b7c516d1ac234599e678abe8497b7cf9931f1dd3887a7869e8a703a8 |
| benchmark | nikon-z-135f18-plena-f8-photopic | e1359ab0d31fe8f96ca995c658970ee98ec85e4542b4656093a8fbebbc06304f |
| benchmark | nikon-z-135f18-plena-f8-best-ref | d4eca6fef5c902656e4eb45b1542385a3a1902907993d85a65365ff0d997f6ff |
| benchmark | nikon-z-135f18-plena-f8-best-photopic | cfc7ddb3dae7b25cbab97c42e1da02c7847f0e7e7e0a6155067cb837b6473ee9 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref | 0f2591032f4111cf837b08e5e70899199b943dfbe2e54ff2469d14fd9b70a7f0 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic | d505d5fe50407a200e223ebc26ae6af48c259efcbb71efc5c2447b622f74be50 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref | e44ac8f3c84fa88e4f62f0acd044815be365d1791d98ad87744f5c12e8eabc52 |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 7ade382558ccb747559665a351a3dff604cebd252fb6931651bce86af87aa04e |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 952ae77f90fd93161c6e9e1d307c8b2289770285efe2d2c42c56dc5a5cf47c5a |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 9200ca05a3c79f360cd2c0fc468bcd275d95a424a5e68946f7b8590091f678a5 |
| features | odd-asphere-ref | d24ce91f200b115d1ef919d9fdb14b4db87b5d67f8e38b63efca3cfd91ddf4af |
| features | odd-asphere-photopic | 23602f8f211374314f6aca3c06206a73cb862bf60596a9c91af736d5d904985f |
| features | e-line-ref | 0b0f82fadbb79be999e3bf439eb67044e620fd05941e7346e67e99d0a440171d |
| features | e-line-photopic | 11ab0d5042ca5dc4b00fd6f8e701516e359d2d61473d3dc9a8616f1ed73a5715 |
| features | asphere-a20-ref | b10db914a934de3a2a074ccd8d938e8f5a15df09bbbe41e90b3adfaec28de5b1 |
| features | asphere-a20-photopic | 4a9d1dc6968b423000c481555626b493e8e981f6b697448d2622958b5565fb06 |
| features | flat-base-asphere-ref | dcde783cdad5fd68c9aca52a808241a3d436c3f568576b791de8acdc0fd5f030 |
| features | flat-base-asphere-photopic | 02c8b825833f7787a9a89f8a2965581385c4f6f30ce76a7212ccb28d39d7fe07 |
| features | rear-plate-rim-ref | 31bf486acface061c777c104e2acb25e14f899a7dd2988b63d0838c8e46fba92 |
| features | rear-plate-rim-photopic | 20d2bce24646becd48944bc49d11181a1a7cf719757789ff15a63bbe19c3e9ff |
| features | fixed-iris-zoom-ref-wide | 4db46962ff43d333cab4430dc739c4afd7e77824ee7f7b12e37169b0be3111a3 |
| features | fixed-iris-zoom-ref-tele | 15567bb5f10f9c71fda356870eabbca30ac1c4c693c8e097521b2a4308432b72 |
| features | fixed-iris-zoom-photopic-wide | 657d721f00e4e7a2bb73dcf9e8ee7fef0d6dc7aea0445b6d30d5f3f1ffdf4514 |
| features | fixed-iris-zoom-photopic-tele | 816bafa86ff5cb14e956910bc94f377f02c31ebd5990ce11010aee245bc95bb4 |
| features | zero-asphere-ref | 7ecd42d1bcf433bc492fb0eafaae81190c604a9969bb0b9b867682ba13b421be |
| features | zero-asphere-photopic | e2a9fae8ddea306f59b9f7c6efdf336b32f235f7fa72ca555d0c992a8757d9a9 |
| features | stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a |
| features | stop-inside-element-photopic | 62a320eb14595b20780012fb759cf0ca701dbd2a599cd745025fd9abaaa9774d |
| states | canon-ef-135-f2l-usm-f5.6-ref | fb6313aafaef4cc6341c86d507a91837b5deab4417ccdeb699274d5ec65de76f |
| states | canon-ef-135-f2l-usm-f5.6-photopic | 0bb244ad3b91ebc1fcc8832ac3ff03c078403191a944eabb6d10f461477df3d1 |
| states | canon-ef-135-f2l-usm-f5.6-best-ref | cfb40db60c1920a71df2e3577d416c7c11811ad983785f4a3d7c2d4f2ed45d2b |
| states | canon-ef-135-f2l-usm-f5.6-best-photopic | 6f6a675260eaedb832bcd186ebc30233a62418137d8c7a022507cfb1c2f2f769 |
| states | canon-ef-135-f2l-usm-f11-ref | 3538c790a1ec7344597b37548aec69a2df46fcb828795c1bd678079a9ad78dc3 |
| states | canon-ef-135-f2l-usm-f11-photopic | b359219bb1416175a36043e267ed01226e18656fd692086a7bceff9700f917a5 |
| states | canon-ef-135-f2l-usm-f11-best-ref | fde75efe0d80ad2af8615df46ff798a3e3bf044409d58bf1a3e6271068eb31a3 |
| states | canon-ef-135-f2l-usm-f11-best-photopic | dd93d62ab085fac35f27ed48e997e93820bc52a1d53a87365835edaf5f003bce |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 11fe04d53f56df0f4217bea7f1df0135e80ac3aa14b3ec6a13c163756b00c748 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 527c4ba128c41cae2c4c564a71b48eaf20e50c257ba0d39b308978129d8e8766 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | fb61b013bd83b38b13284163754deed2b37a7d26ad84ca1fcc3db9ef49b1e0c4 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3db636c9403c6cd8b18d681856ddfaf0b7876d1fa113477592e1b33611911480 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 7c3073c4e7dbedf0705593abf810e4d84fd34d97d7903728a421926d55fa4dc4 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 2a721f0fb1532b9d5ffd33fc93a62c16dce316fd6158db9976215f6e1e0dc8b0 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 8cec235dbb1353ecce18595c4106e7ca14174f1935bfc6ac081648abec9e23c8 |
| states | fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | bd9145a0004d2ce2bd9a18e00f62f853263438016b3ed71d7cd8d67d43fdb5d2 |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-ref | 63c31b9a55e5f68d962ae0d5a47e737b4d5df1301a900eb50af363001d160a75 |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-photopic | c0b2ed818ce7b917f1f78d4687f40197b16b4179c60fe5f9af41e4f78ec3a473 |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 049584b5191a4fd43509da6d422906e44e14697e68119403dd03ccb064f8b1cb |
| states | sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 141995a92146307173e9b585842fa7fff2746eeeb285335bfc035c9efba5a576 |
| states | sigma-35mm-f14-dg-hsm-a-f11-ref | 02b1e001699f7823e93b41eef21cfbf7c3a7090a93803ba41f9b46d97b1b68b2 |
| states | sigma-35mm-f14-dg-hsm-a-f11-photopic | c1d3b6b6b7d1cb58e51a7b709b2aeb9f9f1018a777a5506e8d92f7f305bb8f6c |
| states | sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1409655514e43351da977a690ec1a2a38ed6ea92bb6e65758dbabe5775a6f5d7 |
| states | sigma-35mm-f14-dg-hsm-a-f11-best-photopic | f35e1467099875249f65562c5ed70bb947478465455ff5f61f83489e2010e004 |
| states | nikkor-z50f12-f5.6-ref | 93370aead6b9eb8def155ccf5f3a8780f977a3fda62560f1c44406cf3a1d7ceb |
| states | nikkor-z50f12-f5.6-photopic | 57df07f9ba1f3a042ee7e6fa6be30fc29de381148b021881249dbd60a47b8ebd |
| states | nikkor-z50f12-f5.6-best-ref | 40adc9d9360db7791e21a3b20e8c0c833654c32f19427a958dd20aced28d9ebf |
| states | nikkor-z50f12-f5.6-best-photopic | 5cda22433713055d2b77d6b86285cdd3d09f2f2e56abb9afb53b32c6d3ac51ab |
| states | nikkor-z50f12-f11-ref | 1a34a84b12ddaa766ccc173f659f2b44483089c9560aed71cf85aad1528b9335 |
| states | nikkor-z50f12-f11-photopic | 728b764ddf0eb1965a740c412d8a5ba04a7e9afedf9d5b3da418fa0395279529 |
| states | nikkor-z50f12-f11-best-ref | e230a19defd0b95cada536016457031dac54e94566818a5c97cb2e8295bc18ac |
| states | nikkor-z50f12-f11-best-photopic | 9409e03e1d8bb38c55d22e4b8e2db3580fba792241a42761745caa1b1ca20816 |
| states | sony-fe-20mm-f18-g-f5.6-ref | 032904853c0718dd4654541b6a26e293c3d584c9cc75b880e3327126e0f62550 |
| states | sony-fe-20mm-f18-g-f5.6-photopic | 7ffad7e07b4ab08be425b0f506835465f1b401e006cf3f60cc4a462eacb8a17e |
| states | sony-fe-20mm-f18-g-f5.6-best-ref | 6a018b55d80117d42be3a4b4cd945b3c0930f9544519c314aaed262281e346a2 |
| states | sony-fe-20mm-f18-g-f5.6-best-photopic | 7402bb519a0b3c238c15b9883b7986762130247590b55437c6f64ce3a86a7630 |
| states | sony-fe-20mm-f18-g-f11-ref | 66629bfed7b0cb8ab55ac7d50e6363ebefaa1922a52a3915db2e38f86de2b5be |
| states | sony-fe-20mm-f18-g-f11-photopic | da5535831a1823aeb9676680c2ea18d9571477d8a44cef460ac0ce541691ed0a |
| states | sony-fe-20mm-f18-g-f11-best-ref | 14626b8ab553320b14dfa90cf59ba2bd7b6b433033a0db1169424e5e61cea556 |
| states | sony-fe-20mm-f18-g-f11-best-photopic | ebd85cee697d657cdd866e95c41833268d97db7cec0e76ccc07d3c9f73784496 |
| states | sony-fe-400mm-f28-gm-oss-f5.6-ref | cfd2f4b05ff511406ee2fcf6445bb368a1e65da0aef98100ce96e52afd7ee8cc |
| states | sony-fe-400mm-f28-gm-oss-f5.6-photopic | 90e47ed96ae48b31a549611cfa8d20f8cba6e6a256fc2177231bdb56d89e02ae |
| states | sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 7978e8b6317cb261a60c5258a804dc0819ed21ec238ced93389bbed06f7820c1 |
| states | sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | f0b2fce6bdc5cfb52e92925ea7e26fea510ba8896ce41b523670055347ea72b6 |
| states | sony-fe-400mm-f28-gm-oss-f11-ref | 1a94040d1d518dd6202eb3867b88ddfc677b2127c68f0e0c14e80f86628c70d7 |
| states | sony-fe-400mm-f28-gm-oss-f11-photopic | e39d025209a0474bbbfcfa56b371f03857285eeaf1bb7aac2c795a327dd16267 |
| states | sony-fe-400mm-f28-gm-oss-f11-best-ref | e8134f174ecafd2430ad50cfb2ba0d0166b13d1551f90aa9d8ac0ffddbb9a459 |
| states | sony-fe-400mm-f28-gm-oss-f11-best-photopic | 6e35d1af49b71d869f74f02f4cc85dfb0559cdf3b3ca0f1e7035267465090e09 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 83bc7aa668f82b6b22a13b1acc5b0f5af9ce2968947f11528dea3c0fbeef39e9 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 06ea3987a51a1f4fb802733e5da21eabe412cbaea93831e7a7f156e7f4ca12c9 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | ace750e815937160ee6fb3ca0e4eb1171b25e239d6417acbed4fe523a22999d2 |
| states | sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | ea8f3c035915125e5bc1fb703a3fb652d17204f3124b91e6ff45f0eb424938d9 |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-ref | 849578276ae0917f9e2215c51c30145952bb7126cce058be7687a974b9a8dd4a |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 527fa6221c4f06288b21f4dd259313adea27de6c14cbb43703d3571412cf967b |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 8216f33f93629b810fa907bef02c40e5bcd420baec4ce1d6c8a81dd3bb7cffd6 |
| states | sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 71f5b1c10ac609ada5b900504422eb1e96f85f025a966a8454bde43267080c56 |
| states | nikon-z-24-70f4s-f5.6-ref-wide | ca4650a2f1cab8126617b31e5e196328c9e6047662925528c44d866fe77ec229 |
| states | nikon-z-24-70f4s-f5.6-ref-zoom0.5 | d6dd88710ac133d194348fdebe5810d09477eb6d54d7d92c5a43b78d42913ffc |
| states | nikon-z-24-70f4s-f5.6-ref-tele | 8b15e190d96badcfb4ffa2b7d3f4cdb4f140a3f73afd80711ce385e7b298967e |
| states | nikon-z-24-70f4s-f5.6-photopic-wide | 2510573456570987e5d44b6aa597d4b9a6521aa366516ccb26c50d4de6e746a9 |
| states | nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 984d5ef2391c973845a56a31608a036b988a3c088a4e187ed8dbe9d2d89cdf4e |
| states | nikon-z-24-70f4s-f5.6-photopic-tele | e8c82d27951c440cc1f88df20ba83f966a6c5ca34bd98f16f51d25af697bf0df |
| states | nikon-z-24-70f4s-f5.6-best-ref-wide | 534c54ca70f1030921493f470f9ee0d6a3d238dc3cd43dc509c0f8687e543ea7 |
| states | nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 672c59fea97eac2518485a560ed393242b1d93aea8dd8eb924af71026aad071b |
| states | nikon-z-24-70f4s-f5.6-best-ref-tele | 44724094bec9dc249b2d0587cd4722285afa329dc7ed3247d80487c9bf044284 |
| states | nikon-z-24-70f4s-f5.6-best-photopic-wide | c4350a7ae66a7c5d1636779198a6836b1d53a2eb1e95aafe0f500ec64ae45200 |
| states | nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | d270caa263c2905c8932495abc7d758bfb2b1667a41b4ebe112febd62c701ee1 |
| states | nikon-z-24-70f4s-f5.6-best-photopic-tele | aadb6362aadf68ffb639570a84368f0c679ad673dc9d9cc424405ba8089a11e8 |
| states | nikon-z-24-70f4s-f11-ref-wide | a9fc28dc90bb6ec393151512c95cd9bbed404b4e7aeb6110aee02edda8728dfb |
| states | nikon-z-24-70f4s-f11-ref-zoom0.5 | ee0b49410666fe2b115167d3da9eadc492967c802f4457c926b117aafe491428 |
| states | nikon-z-24-70f4s-f11-ref-tele | dc0cc7f4f4644e267e862cc6f513fefb957e91c401cd83910f1faafbba1851f1 |
| states | nikon-z-24-70f4s-f11-photopic-wide | c206eaf79209e5ec699430cdc0f5923ba2d445f39f590303bcc3c31d3e145403 |
| states | nikon-z-24-70f4s-f11-photopic-zoom0.5 | d0eeb6571d07edf32c0707c8f24cc801818361e470ce1fa8db1b20d3a5b7e715 |
| states | nikon-z-24-70f4s-f11-photopic-tele | 31131a9c3a5064a17fa061ed66bbb17d1974c17f8df3d11c86435b060550e15a |
| states | nikon-z-24-70f4s-f11-best-ref-wide | f286f2dfaa83049a3d5591572f3e47840cf0032e6287523202de250b62561b1f |
| states | nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 43c74496798ae9506b5038882eb2fe2fc934ecc74286ea98fdea22129bc9db3f |
| states | nikon-z-24-70f4s-f11-best-ref-tele | 86e79118d05b624fe13b031ef8c4cd8440be28a8e1bff83babd4d8424dbcd0ac |
| states | nikon-z-24-70f4s-f11-best-photopic-wide | ca0315a31df48b28a8ee654c39f2f02ba437e67d31827c1f66952c6a59f2a195 |
| states | nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | fc43f4c21ab2e5e37fcc04116fa881dbc610d1f88b9565f6b5c8e17e5a315587 |
| states | nikon-z-24-70f4s-f11-best-photopic-tele | 8531011372f3b6c16e25c9c91fa49e878b0a28d9c8d0b56739e42136bacad768 |
| states | nikon-z-mc-105f28-f5.6-ref | 817dcdb72789e4f19aeb0834fdf38f2df1f9981feeda0e849a6fbe878516246e |
| states | nikon-z-mc-105f28-f5.6-photopic | 1954ed6aa33432e181f9fd106f948530837acf3981c484de154a624c9498c51f |
| states | nikon-z-mc-105f28-f5.6-best-ref | c083a9ad451157303b51e15cc837a6458e778df9940e23c2ef9b74bd6a6d67f9 |
| states | nikon-z-mc-105f28-f5.6-best-photopic | 78b7b0222e6524bef7d55aee358b93d5363d600153e44d6d8af4cc3fdd37c665 |
| states | nikon-z-mc-105f28-f11-ref | c7f1b99704f56d90a1f686179860d380dced25c8cd033526fcecd4702519f9e4 |
| states | nikon-z-mc-105f28-f11-photopic | 66c219236a3dab53372e71ec0933249c1f3a0cb1d7ceafa34405dbf42544a103 |
| states | nikon-z-mc-105f28-f11-best-ref | 731774161533fcf291c1c1269e0e88539a0dd9e65da2ae8f74753a0b5ca2b774 |
| states | nikon-z-mc-105f28-f11-best-photopic | 7c36e2f71e511338791089c2160a0f0729bebb1d35521a01e99f81628e3a4655 |
| states | nikon-z-135f18-plena-f5.6-ref | 2f48866c86a5c78c9d9985591e3093550306be61ca1b1467ece2a6624837935b |
| states | nikon-z-135f18-plena-f5.6-photopic | d3405bf3cc1609ad7ad77300cfc39b172ddc595ed32c4a7626c66cd7353d6fde |
| states | nikon-z-135f18-plena-f5.6-best-ref | 360b7b852f441111c8d5acb454934d8d59d4eca6b658012be793c9e01569543b |
| states | nikon-z-135f18-plena-f5.6-best-photopic | cf84ceaabd4254ec2fc9096ce284edbf9776b072cf55de2525e4164ea2c39914 |
| states | nikon-z-135f18-plena-f11-ref | 9370a359110296269721cb8c84b7071d063f75cc1e19f176fc6e2e3e747090cf |
| states | nikon-z-135f18-plena-f11-photopic | a6664a204e5bf0ca48289e51350f5c0e606260a662d0b29334b24c34c03ab468 |
| states | nikon-z-135f18-plena-f11-best-ref | e6cc666f0c9c00122578523ed519d8b34a1e9dff2427209471960455699891ec |
| states | nikon-z-135f18-plena-f11-best-photopic | 93e46690ec176b9d2633393b625aaf006e059e11893e23d34d82fc88b75b4084 |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 199c2510c32fa327ab1821e2fab7968e7ad6a4bb2b9a9298f59fa94887b06bb2 |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 4cf6d7133ad5498fa5397bb6e8998034b7d8882c33d66a5680e260f1f2363e85 |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 8471bafaa095d48e703f204c34d8b0f411aaa31d1f1d70865eb3772e019aacbe |
| states | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 47a5da31cb8fe84438f6dc3d443dffceaa2edbe0025572c8875b9ebbb8a83ff1 |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-ref | f3fcc3b63cd7c8c3a567b5f318c8a9dd3e469e78af15979fd5edb6778d604839 |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 767aa6f20ae7d3f4801e196910ff99f05e24ca2ed20524b0e6e626f82ba5af85 |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | e8b060aaeb44cba02d576fc44c9725a7bd44cc6d4adb173931ddb86caf196c9b |
| states | sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 4178d8f26ba49800c75581368bca19314aa614248502ad7f4ac8a59f57da305a |
| states | nikon-z-24-70f4s-open-ref-wide | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| states | nikon-z-24-70f4s-open-ref-zoom0.5 | 0c1e3e17b791b8b76cc5311d51e8dbd6ad9592081d1f4e853b775cf8253d1f53 |
| states | nikon-z-24-70f4s-open-ref-tele | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| states | nikon-z-24-70f4s-open-photopic-wide | 392526a2d4fb6800be21455fb7097f75e53156a130b490f79830e62460359a12 |
| states | nikon-z-24-70f4s-open-photopic-zoom0.5 | 88a749d4f75279b33492f61035d826b4688f7c9e5ccf3d92dbc7f9c9549ca91e |
| states | nikon-z-24-70f4s-open-photopic-tele | 9e3b47006624814732c91d238b73f183b938f21c947092003915ea16b13a4827 |
| states | nikon-z-24-70f4s-open-best-ref-wide | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| states | nikon-z-24-70f4s-open-best-ref-zoom0.5 | e96a55399921f347d7e4cc74cfb6866870a4ce088279506abff48b416df2f370 |
| states | nikon-z-24-70f4s-open-best-ref-tele | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| states | nikon-z-24-70f4s-open-best-photopic-wide | c3e2ff5ca8846d295ca192a631c924ad89fac42eca1b4c18770d8f5617b8c506 |
| states | nikon-z-24-70f4s-open-best-photopic-zoom0.5 | dde35e9fddfe63b8cad5485f93c17dae02b028d2da4dd0f847b5aecb6eb4202f |
| states | nikon-z-24-70f4s-open-best-photopic-tele | 744b809865d1a1116492bfbf856ab119ea41ab803108f9c981f69923f41cf76e |
| states | nikon-z-24-70f4s-f8-ref-wide | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| states | nikon-z-24-70f4s-f8-ref-zoom0.5 | cfe08daed58c95d06787698fb20876419f0d64aeda8b760fcb3c39f5892f1a89 |
| states | nikon-z-24-70f4s-f8-ref-tele | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| states | nikon-z-24-70f4s-f8-photopic-wide | ab3760654d94804e8278e5cad2c61fac6237577dc6f556f1840b1c720c67ccc2 |
| states | nikon-z-24-70f4s-f8-photopic-zoom0.5 | ea8482dd9fbeb8c91ac688c1229a4abd30e352a2e55818abc1e5ea30fae8a5a8 |
| states | nikon-z-24-70f4s-f8-photopic-tele | 3880b49fc9097685272f3f5f6b9410a3c721798228c33fa69503e366e3a28067 |
| states | nikon-z-24-70f4s-f8-best-ref-wide | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| states | nikon-z-24-70f4s-f8-best-ref-zoom0.5 | c84d1fc5b9e9daa5909cc2530a508854046daba2153963653f5ff7f42ac3bdb5 |
| states | nikon-z-24-70f4s-f8-best-ref-tele | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| states | nikon-z-24-70f4s-f8-best-photopic-wide | 6882783f3706c89459ea475b03c5097f00f8e10b8f38f8c7a912789db7f9c183 |
| states | nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | b0a60930819cad6639b046939da301d87a82fd845e4c3aca8951a40bf4fdddb1 |
| states | nikon-z-24-70f4s-f8-best-photopic-tele | b3e22a7473a909ad089f72ea18ecbbea131ebcc8d3093090ae20e82ef40a8794 |
| focus-stations | certified-angenieux-dem-180mm-f23-apo-zoom0-focus1 | 5c34668074f689cf9183b6a6ac660a212014d2d9ba321f86d31abd8c76361b05 |
| focus-stations | certified-apo-lanthar-50f2-zoom0-focus1 | 6c952bd3bd5ed38d9c7a712150c178a559f076534d48d19af61f79c4b914fd71 |
| focus-stations | certified-canon-ef-100mm-f28-macro-zoom0-focus1 | ce27fcfe8f43af2f6846d9d2c2ce285d58ff162d3f21dde89898a39250b5627e |
| focus-stations | certified-canon-ef-100mm-f28-macro-zoom0-focus2 | 8962fef3413f982ac033b09ea61d32c378fe3330278dcbd457db4b822388956b |
| focus-stations | certified-canon-ef-100mm-f28l-is-macro-zoom0-focus1 | ad9124aebcc56a18d38a95b1813fc58f42219065d1397e953fb1ce3a6aefe852 |
| focus-stations | certified-canon-ef-135-f2l-usm-zoom0-focus1 | fc812ae448306763774a27a0e676b3ea9241f95c5c05f7151cfab5257e4b1689 |
| focus-stations | certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus1 | 0faacc06e86dae577571e68817af23fc42ecb3b4b3842bb238826f0bfeb071b3 |
| focus-stations | certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus2 | f8829f88dc97382f4008e1e3a9855b639ac2a3fceafe2309119aebaf3f6d316a |
| focus-stations | certified-canon-ef-180mm-f35l-macro-usm-zoom0-focus3 | 564ff7cc88206b522ad7fa827176d1ad80967727027a1977d8eb318bb384265a |
| focus-stations | certified-canon-ef-200mm-f1-8-l-usm-zoom0-focus1 | 7651d8630259c429808b018e6022e4d037ca0c71f0ad067ac43420908f6170f4 |
| focus-stations | certified-canon-ef-35mm-f14l-usm-zoom0-focus1 | 0bd69baad92b2cae1e5ea4edd1c5de7490750dac922f57d49bc36778d83354c3 |
| focus-stations | certified-canon-ef-50mm-f25-compact-macro-zoom0-focus1 | daf6cfe868bd42ca006571c9c7eb3060b3d1f1c73b0f73c9044cc0c17275d0ce |
| focus-stations | certified-canon-ef-m-32mm-f14-stm-zoom0-focus1 | 6b5f11f070ec176f69e8f4879536e2d7ca1dc7f99430aa40e97a906b0a40504d |
| focus-stations | certified-canon-ef-s-60mm-f28-macro-usm-zoom0-focus1 | 2115b237f50b56564aceed71f4d7423eb4180095d0c1576af0e5a44771f28522 |
| focus-stations | certified-canon-efm-22mm-f2-stm-zoom0-focus1 | 802d70438fb54dc5b8ccd30187489ae97681a0aef9ce2626d778fab7d7fe6731 |
| focus-stations | certified-canon-efm-28mm-f35-macro-is-stm-zoom0-focus1 | 8ff2779f4dbf10dc395d44543f671ff84d75d24b608e71475ff67d14097089fe |
| focus-stations | certified-canon-fd-35-f2-zoom0-focus1 | e5c81ba6fc286de1d990bbf5aa8d48ac577ed03d51ba7f8463f90f4afc6b0d4d |
| focus-stations | certified-canon-rf-24mm-f14-l-vcm-zoom0-focus1 | 01a6b6dbbf2ba0bbac49350703e4072f13d72e6bed5ec8338747b68053090605 |
| focus-stations | certified-canon-rf-24mm-f14-l-vcm-zoom0-focus2 | 42a23f2a0ae6b263e4dc0a4cf8433d90e050bc7f13ac37bb36cc2b358cb34312 |
| focus-stations | certified-canon-rf-24mm-f14-l-vcm-zoom0-focus3 | 58a5c1eeaa94dbf9e838a8e4d150fcd3a73fe3b0f2396b75083e28e1143b1b80 |
| focus-stations | certified-canon-rf-35mm-f18-macro-is-stm-zoom0-focus1 | a50e4d560132582eb61000485f8e268bc8b21298eb5246e20d0412fee4c33cdc |
| focus-stations | certified-canon-rf-50-f12-l-zoom0-focus1 | 5076dcdc32e65c5825a272fbbe9dbcbddedc054fb38849730bc562c3a87e11bd |
| focus-stations | certified-canon-rf-50mm-f14-l-vcm-zoom0-focus1 | 83609a5e72d9ce6600a90586fc0c9ad3f0eafc438662cce0216bbdc70915c1d7 |
| focus-stations | certified-canon-rf-85f2-macro-zoom0-focus1 | 789c8f3bec5cd171a0d7519d6aeaaf4eb7ae1a6e6a4675c202de04f79316dddb |
| focus-stations | certified-canon-rf-85f2-macro-zoom0-focus2 | 3adadad88e3f9e78189b4419e26e83620c9424e9600d2469fb5de84df1e9c1f4 |
| focus-stations | certified-canon-rf-85mm-f14-l-vcm-zoom0-focus1 | e37ca0c74deea030f61f876c281a78f1cbc105778198524c9f2678d67f5e30c8 |
| focus-stations | certified-canon-rf100f28-macro-zoom0-focus1 | 684850d3964d47a1480b350ca39439926b57e1d3b6ed13dcf1845c455cf5995c |
| focus-stations | certified-canon-rf100f28-macro-zoom0-focus2 | 7eb9c1747c30cca2eae96fe1f9f6976cdbb0c5159acc5387881b5d68ff10ad82 |
| focus-stations | certified-canon-tse-135mm-f4l-zoom0-focus1 | c2f5f0cae70fe4f0125dcf9a968cf3a9215a3ed30aa89ff785ebfe6c1099e50a |
| focus-stations | certified-canon-tse-50f28l-macro-zoom0-focus1 | c462eae2e34a6ff934b715aee222cda98ba4ca6a3e9da3bf98d680b0f8df260c |
| focus-stations | certified-fujifilm-fujinon-gf-30mm-f35-r-wr-zoom0-focus1 | 867e8c02e2e51290f19169455473f0736cdf6c334f34ddcbb5437a5def18cc59 |
| focus-stations | certified-fujifilm-fujinon-gf-50mm-f35-r-lm-wr-zoom0-focus1 | bedbeafbd8b76df390fb93c567b5ff9a50dc5ed24fad7a554408134e8cb33470 |
| focus-stations | certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom0-focus1 | fd45e49d468ba67fe404352aa54fd9489ef2d9ad21065112a48a04de84e93b33 |
| focus-stations | certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom1-focus1 | cf514c08dccef216facc5fb22e0ee7e375e6cc1bee1a0d34d02a6118666c5c79 |
| focus-stations | certified-fujifilm-fujinon-xc-15-45mm-f35-56-ois-pz-zoom2-focus1 | 90cf96e171022d27d56197f06bbec28a229a0737c081de58196bd98eb987d823 |
| focus-stations | certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom0-focus1 | 49c345c2e52f3954ef6986a110f49f8e4c16ca608087aa8c51dde5d7494030e1 |
| focus-stations | certified-fujifilm-fujinon-xf-150-600mm-f56-8-r-lm-ois-wr-zoom17-focus1 | a54061eb49a7332abfe3e4a0732282f2637c2f836da33e62f7ccc9082c00890d |
| focus-stations | certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus1 | 2b4eb17aff35f9e790fbabf2e17c4542cc0101cfffe01df8a67f140fdbe5d55d |
| focus-stations | certified-fujifilm-fujinon-xf-16mm-f14-r-wr-zoom0-focus2 | 1ad0d9cd4d627a5e5def4ab799f8b462de0b2ec322bd2ec3d4cd4a394d5e543c |
| focus-stations | certified-fujifilm-fujinon-xf-16mm-f28-r-wr-zoom0-focus1 | 4c574d45acf293c2731a0bdcfd114708e3a55bc7e52fa41fd2d5854133c79429 |
| focus-stations | certified-fujifilm-fujinon-xf-18-120mm-f4-lm-pz-wr-zoom1-focus1 | 8d3e9c7edae6b2c2c43cf2f4870f3d225129fbbc9cd3c85b3214086b44fcc380 |
| focus-stations | certified-fujifilm-fujinon-xf-18mm-f14-r-lm-wr-zoom0-focus1 | 56fd1537e25aeb09bebd48943fcf9e0571ec5683888626bf403e8e920a3a116f |
| focus-stations | certified-fujifilm-fujinon-xf-30mm-f28-r-lm-wr-macro-zoom0-focus1 | c3f6ab9a4c36016c5c215fb17f596e6b8feac444d5ab4b14da7c6dab40a05c2b |
| focus-stations | certified-fujifilm-fujinon-xf-50mm-f2-r-wr-zoom0-focus1 | 3707ec6d0b2b18c597ad86b2aa5bbeb4e03f3ae280e5c404cdf94178cd009b36 |
| focus-stations | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom0-focus1 | 112ec19c8e3e4419181223f7737bfdbc44f148a0c3f275de324d86a747d032d9 |
| focus-stations | certified-fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr-zoom1-focus1 | 584b729ce84978745a04dc3bf8b39b8ab7b2d3e8e416c2df213450f5fbfd3f39 |
| focus-stations | certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | fc71d244aec38864b73ef8750cc52141357ae769fe4d7ea80b387b46ff1a8e55 |
| focus-stations | certified-fujifilm-gf-20-35mm-f4-r-wr-zoom0-focus1 | f446a92e6cb96c11f590282a6f6ed6b5ca5b0d374e864ff67315d3e156beacba |
| focus-stations | certified-fujifilm-gf-20-35mm-f4-r-wr-zoom2-focus1 | acac46175d88ebc33f9f3d8f5b3a29855dd9e92dcfa802b5cd0d0d2be7515c97 |
| focus-stations | certified-fujifilm-gf-23mm-f4-zoom0-focus1 | ea2d44532a8c91e0d04294e0a1d84a51603275e9d54021b212453fb3086522f2 |
| focus-stations | certified-fujifilm-gf-30mm-f56-ts-zoom0-focus1 | a7e01309afe588ac573e98d860dc9bb1928ada5d412d937c5865d1830f5a784d |
| focus-stations | certified-fujifilm-gf80-f17-zoom0-focus1 | bbd4687c1f32e2819c4015cfb440908f2747d442e89dd218858a35f71743bad9 |
| focus-stations | certified-fujifilm-xf-200-f2-zoom0-focus1 | 57eede7a4660658d78f10f7e5bdef31c201856a8e0a702eaa374714616e2df37 |
| focus-stations | certified-fujifilm-xf-23mm-f14-r-lm-wr-zoom0-focus1 | ec7291d15103b514c588bbc7450886dbd0ca0371058a36dbfb1c300bce29de9f |
| focus-stations | certified-fujifilm-xf-23mm-f2-r-wr-zoom0-focus1 | e70a5e6c2523ef1c5f15237c1add4bee16418c22c401974c8888efac0485347f |
| focus-stations | certified-fujifilm-xf-23mm-f28-r-wr-zoom0-focus1 | 9cfb82047b41aaa73dc6c299e5251eca9b4b3de5c1cc85c7314c4e363c213994 |
| focus-stations | certified-fujifilm-xf-33mm-f14-r-lm-wr-zoom0-focus1 | 29be9da4bd581c2f6df4c0628a59cb9ba36e538547f522b427d26bddb2967c86 |
| focus-stations | certified-fujifilm-xf50-f1-zoom0-focus1 | 1a721be0c40439c6c12162e7a8daeab551d19ebce4bb52ef3497fee4b64ac58c |
| focus-stations | certified-fujifilm-xf60-f24-r-macro-zoom0-focus1 | a2d47f36c6de6e38a4587c95aa6ed65b72be5153667bdc794342635066589fa6 |
| focus-stations | certified-fujifilm-xf60-f24-r-macro-zoom0-focus2 | 9517919343753afb358267f8ee6c8c9638631d9ebf0e3bb14c73d221ccd22392 |
| focus-stations | certified-fujifilm-xf80-f28-macro-zoom0-focus1 | f4348412d8ada6b5e7244cc40e22fee41ebf5bec08950a8a3461a8d6c32602ce |
| focus-stations | certified-fujifilm-xf90f2-zoom0-focus1 | ea751965cfb356c705cae11ac5df50ede63180ce02a7f7e8d22088f789eda135 |
| focus-stations | certified-gf-120f4-macro-zoom0-focus1 | 859e2d8473c4047712d2e3d259adbc5c06cdea3c8afc8b20c2c7a60f52764f2a |
| focus-stations | certified-hasselblad-hc-macro-4-120-zoom0-focus1 | 99ab56e036398a2f560410acc8d4c3ed53e558490392fda9f65cd08829bdefc3 |
| focus-stations | certified-hasselblad-xcd-120-f35-macro-zoom0-focus1 | 9e41b5bf7c9d9808da24ed16dc969e7c9570ec20a98b4af03a0b087a25e2f969 |
| focus-stations | certified-hasselblad-xcd-120-f35-macro-zoom0-focus2 | 461df00281f0e7638d84e1fa536dfab7606024c56617883370749ebae5878686 |
| focus-stations | certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | e92c44ff169ec871c921b962020b502aabf40e71a8bfa6b0e41956ea10f0b00e |
| focus-stations | certified-hasselblad-xcd-65-f28-zoom0-focus1 | dc6964ddf994f4ff59e6739e9c8ddb0745dd481eb8a2e0559af59b59c69adf04 |
| focus-stations | certified-hasselblad-xcd-65-f28-zoom0-focus2 | c976f174252a57c034fcaab963c138cde01387cb928d2dbee26765819b3be3d6 |
| focus-stations | certified-konica-hexanon-60f12-zoom0-focus1 | 45a7fba1662ebb81adbf73fcaa61108fd6bcf75dce5a34b8168a312c33930fdf |
| focus-stations | certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom0-focus1 | 61dff6ad0f8653a79d6bce2c5f1777c068de81acdbf808a2145ce9ff8c717a49 |
| focus-stations | certified-konica-zoom-hexanon-ar-65-135mm-f4-zoom2-focus1 | ac88de07818d1997c7418aa3cd92c853bdd8819517bde1bc9ac520549d2fda32 |
| focus-stations | certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus1 | 84a8304e46408c1118c65f5873247775294406f17184073ab22adc63414883bd |
| focus-stations | certified-laowa-100mm-f28-tilt-shift-1x-macro-zoom0-focus2 | a6d17bd47a0871f57871bdd232f694596904922b047bfbe76c82b4c0ceb5f56f |
| focus-stations | certified-laowa-105mm-f2-stf-zoom0-focus1 | 44def313f172415f3368de89eb79ff998e5ebc47c5aa8fae6ff5009b4acfdd15 |
| focus-stations | certified-laowa-12mm-f28-zero-d-zoom0-focus1 | ae8bf10ab266a2ce09d1693beef4448f13f6a5ad8d43f4a4c367976aa280a808 |
| focus-stations | certified-laowa-15f4-macro-zoom0-focus1 | b61d935c9cf0e675d74beeded4eaf8b84d6aa5c4786e49d2fb656c4b07fec22b |
| focus-stations | certified-laowa-15mm-f2-zero-d-zoom0-focus1 | 23fc42411d1d3b37e418cea07c7d64edb7009922a7158d95492f0e84d1beaa04 |
| focus-stations | certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus1 | d4ffbc92564c8a7e7b1456a195ee466b4f660eb3baf89bf0565c2227c58c999d |
| focus-stations | certified-laowa-180mm-f45-ultra-macro-apo-zoom0-focus2 | e2bc6480c13ead2bc2124b518424eb048d6fbafad22781be6ce4076f9de788d4 |
| focus-stations | certified-laowa-24f14-probe-zoom0-focus1 | 435a3d3755ba07489dcd0e004b5af11fbfd6a7784a3d4eded8b180dc21483aab |
| focus-stations | certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus1 | b93af58a7695e8198c4a583a3c451ee155a8862c92cbf3595ac1fbf795769e3e |
| focus-stations | certified-laowa-55mm-f28-tilt-shift-1x-macro-zoom0-focus2 | 5233b189f5f1d6b28aa84b45f067f8986a3b2a19b165ebb2eb3284679fa02b10 |
| focus-stations | certified-laowa-58mm-f28-2x-macro-apo-zoom0-focus1 | 0c81bb5f0f5c7ba1831ab7955b0cd3d5f5584a06f7a3c7068ac360f5e7a1e150 |
| focus-stations | certified-laowa-65mm-f28-macro-apo-zoom0-focus1 | ebbe710591c2d156bf4f366ea244fd2da9d3bede664bece5a0504777483a4202 |
| focus-stations | certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus1 | d78bb4326af3a9d09e130d7a3ba8b28713fefa30cf56b1af3cc062c33ae5ee41 |
| focus-stations | certified-laowa-90mm-f28-ultra-macro-apo-zoom0-focus2 | 0506040b61fb5dcab42a625912f31be67a8ff0625d68dc8dc399880f29bf7bb7 |
| focus-stations | certified-laowa-argus-45mm-f095-ff-zoom0-focus1 | deef946578878a59f48320117d3658a4f9b2355db5194fe7a367c47f57bee64e |
| focus-stations | certified-leica-apo-macro-elmarit-tl-60-f28-zoom0-focus1 | 4e6d38646aa0a759ab9c82f5d3b93f301fea34b8a39da430419f3f8da422e906 |
| focus-stations | certified-leica-apo-summicron-43f2-zoom0-focus1 | 159888aa342c8ae987618fe1fc993a266153bd589007d5bf1e5878268d4dcae3 |
| focus-stations | certified-leica-apo-summicron-43f2-zoom0-focus2 | 1c088bb3ca6f4b6288a6958596862d388b6e6cf1e06dfb908c3faf021708f1a8 |
| focus-stations | certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom0-focus1 | 2ce4c6b72c0f592dfaf6a0d973bf9466b62ababa7d57dfb852b2a7cacc0f129a |
| focus-stations | certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom1-focus1 | e47656015310f4c2dce28192a28f357da8b3a88f74420af373a43d7c937b3784 |
| focus-stations | certified-leica-apo-vario-elmarit-sl-90-280-f28-4-zoom2-focus1 | 32d0f419c0c6019ae461fe8cff61f55752cb1dca77d69c08ddb1f4f14493603c |
| focus-stations | certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | ce632d6fe72f4ec5daa7775f71f8298fe22684b6c3b9829f1acd927901c5e613 |
| focus-stations | certified-leica-summilux-28f17-zoom0-focus1 | af344b9a7e77fe21f87dc08e240e83850814f44186e469096a8f555e50685326 |
| focus-stations | certified-leica-summilux-c-18mm-t14-zoom0-focus1 | b0f8f5466dfaa4f6b686d4163d2df66174f23018b6842d90c6c4ce65e012e360 |
| focus-stations | certified-leica-summilux-c-18mm-t14-zoom0-focus2 | e05ac48d6f62767ab2991094e24729bdc873f47fc38773f94ca29503318d786e |
| focus-stations | certified-leica-summilux-tl-35mm-f14-asph-zoom0-focus1 | ea900cc01fb5f407c9df388e5f1ee4bc61a650b6c8e3d23aadb90c257e54235e |
| focus-stations | certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom0-focus1 | 4152f2b7c34b5f44882aa905cf8362f99b02f71f7b5eb15dc1d3b867059d8671 |
| focus-stations | certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom1-focus1 | 24e7b94a60cf8c68b6afa7dcbcfc55acceb4a52b9f70d87cf907dc3844b0ac86 |
| focus-stations | certified-leica-super-vario-elmar-sl-16-35mm-f35-45-asph-zoom2-focus1 | d75d7b205f0834fbbd345842d876cb443851246b7ccac0a0618364ac049e12eb |
| focus-stations | certified-mamiya-sekor-af-150mm-f28-if-d-zoom0-focus1 | 9ba05d040ce805b201d30a537c87477839cfcfce29b201297aa94ade05efb061 |
| focus-stations | certified-mamiya-sekor-macro-c-80f4-zoom0-focus1 | 790aa5cecdcc610c7703d2ec5fb82f096955126195ae9f8a4458848d21d6975e |
| focus-stations | certified-minolta-af-100mm-f2-zoom0-focus1 | d3ae321dda0827021e59b859ea1470b060efeb927637e5316ceecb3c8456938b |
| focus-stations | certified-minolta-af-100mm-f28-macro-zoom0-focus1 | 6804416e4035b07ac8a46a0c4e8e959f444e6d364a333dd8d6906259882a2ef9 |
| focus-stations | certified-minolta-af-100mm-f28-macro-zoom0-focus2 | ade62a3814335cd59e35295ead89860c6be9ced44eaa2fa567afa1462a3fdc9c |
| focus-stations | certified-minolta-af-135mm-f28-zoom0-focus1 | 0f5f76a6967b584cb0217d85be3182f3a3b6ba69893e5ca75df30dcc26471a12 |
| focus-stations | certified-minolta-af-20mm-f28-zoom0-focus1 | 44d2f549841a23ea61f6c2b269973282ab3644126bab86b07998223903dea325 |
| focus-stations | certified-minolta-af-24mm-f28-zoom0-focus1 | cd0f69521e93cd744caf91590f827f422feab575099fa15d19a6795cfbb4ed9e |
| focus-stations | certified-minolta-af-300mm-f28-zoom0-focus1 | fb95d667fc58d585e4ee3283905b5c9fdc381829713cb7c0912f6bef91297370 |
| focus-stations | certified-minolta-af-400mm-f45-apo-g-zoom0-focus1 | 06387ad2a565df2c99eef1a4babe47b93816102bdfb86beb6489a33d59d1a5e4 |
| focus-stations | certified-minolta-af-50mm-f28-macro-zoom0-focus1 | f70e7ed164b5b5614d535e162bfff0764f4b40e8a98e7c572aa00d4feaf47231 |
| focus-stations | certified-minolta-md-apo-tele-600mm-f63-zoom0-focus1 | 8ce40609635aa0258c55da1680d4b0c057a98356d3f3d54cd6e8d46b8859411f |
| focus-stations | certified-minolta-stf-135f28-t45-zoom0-focus1 | 8572bf9def6e604f31ef06a63324a095be4c009ef0c0f32c71da007f499654de |
| focus-stations | certified-nikkor-105-f14e-ed-zoom0-focus1 | 4072db5bde9aaa4067c28a6cdef44ff4bd4cb7f55a8b9e8e853f9f20e8810626 |
| focus-stations | certified-nikkor-28f14d-zoom0-focus1 | 7a388e1ded3da7693342e85f2c73d6ab62e1dfcaf0724ef1474d00af7b11f257 |
| focus-stations | certified-nikkor-85f14d-zoom0-focus1 | 1e645acc20ab05c697006ad18ed89fb398ece259eb2a306bf554f1978ca78ba7 |
| focus-stations | certified-nikkor-85f14g-zoom0-focus1 | 9a99b242cacc763c1f2189d1dab865bde0be00249260bce057db3570e4cff2d1 |
| focus-stations | certified-nikkor-af-28-200-f3556-g-if-ed-zoom0-focus1 | 4a09d3a8f987ad3b67713a668d4dc7faf0878d79e1275e7b3e8ccf69f1b923e5 |
| focus-stations | certified-nikkor-af-28-200-f3556-g-if-ed-zoom1-focus1 | d424d68bbbd3e55009ba493fdb2d949dae372a2431e535cff19d51e4cf70af0c |
| focus-stations | certified-nikkor-af-28-200-f3556-g-if-ed-zoom2-focus1 | 931a2fd406cad9279fe0be0b778ebb691009d8acbe924901c543d1b24a7e3b8d |
| focus-stations | certified-nikkor-afs-14-24f28-zoom0-focus3 | 392f7858dd1be58882ba67d49e70feb6d13c622cec51514288e1c72753a7f8ec |
| focus-stations | certified-nikkor-afs-14-24f28-zoom0-focus4 | b9a9bc31d71e1800696c7f45ef090afdb33969fe49498187abb129640f999853 |
| focus-stations | certified-nikkor-afs-14-24f28-zoom1-focus2 | 79efb42674743a70db13c40e9af06c5258ce138b33a8513d796aa9aa7581ee79 |
| focus-stations | certified-nikkor-afs-14-24f28-zoom1-focus4 | f86c8e0d4e6f836c6eceb96817fe944fb1e88d9f3f473fbed86f8123604164c6 |
| focus-stations | certified-nikkor-afs-14-24f28-zoom2-focus1 | bbc4882e5753115eae9288813c62156932b7e08f7273cbc489af085560cb8f45 |
| focus-stations | certified-nikkor-afs-14-24f28-zoom2-focus4 | 6039d74b62d6fb47924f399e32fe99d771442f7215057ae531927dbfc2fd2a13 |
| focus-stations | certified-nikkor-afs-200-500f56e-zoom0-focus1 | d348a69fbaf62f115cce098cda966176b59d8d6c3d0b3e82f8d055c6d7ce4076 |
| focus-stations | certified-nikkor-afs-200-500f56e-zoom1-focus1 | 60ef1083ef5b277ed576e61a7e97773680882fbce4f418839d3f11385a6dd204 |
| focus-stations | certified-nikkor-afs-200-500f56e-zoom2-focus1 | a68b6e65c29807b2fe639ccf5ad4794d83e6dca34b3b887e873dfbcea618fc9d |
| focus-stations | certified-nikkor-n-28f2-zoom0-focus1 | 0df0a12e8bcd714c17d3df70457b5479c7805cb8dec96ecbcdff9dbc16d33825 |
| focus-stations | certified-nikkor-z-100-400-f4556-zoom0-focus1 | 8c8c77f96c10b8eacfbd3fc1e56b42548ff65f1d507af7c29925de173b8531ef |
| focus-stations | certified-nikkor-z-100-400-f4556-zoom1-focus1 | 09d642275bc71fbef0bafaed8683443df9b9d29c38cb04620f663cbb81d12660 |
| focus-stations | certified-nikkor-z-24-200-f4-63-vr-zoom0-focus1 | f9ea0af71ddd36e4a8c184e9753c762e1a4c25ef6bea6045f6022a3dcc7aa109 |
| focus-stations | certified-nikkor-z-24-200-f4-63-vr-zoom1-focus1 | d48d25aa87a341c43ff15b465cdeb06e7da694344187c0b3aab4393893ff92cf |
| focus-stations | certified-nikkor-z-24-200-f4-63-vr-zoom2-focus1 | 8684236b453c59e49443cbcc8c070933a39d6c9dcf563dfeed3d9be14df4760f |
| focus-stations | certified-nikkor-z-24-200-f4-63-vr-zoom3-focus1 | a0a15a83d3ed7673d0e78b1d8d3eb9fbc50185bdbe96fd181dcbb769e0c9618f |
| focus-stations | certified-nikkor-z-28f28-zoom0-focus1 | dc3580db5fed108703eca8fafda5af1ba45fe600857db72c7bf7ede8557039fd |
| focus-stations | certified-nikkor-z-50f18s-zoom0-focus1 | 21897a227bbb853bcd4cc71dd8eba6a16953d97145f6750aac38e544fa979faf |
| focus-stations | certified-nikkor-z-70-200f28-zoom0-focus1 | 33128ead666fb36d8e6fe9329ca957fcb2f0eb586da24b0eeec01792acf85dea |
| focus-stations | certified-nikkor-z-70-200f28-zoom1-focus1 | dedd97fdf238f1a66a0057a63076c7f33b88c1dd15f431bb435c2ecee8e0fe7d |
| focus-stations | certified-nikkor-z-70-200f28-zoom2-focus1 | 4e6a5b989dbe8b3ffc25404215469e94cf53d3a9bbc63c1af9443c130820dbe3 |
| focus-stations | certified-nikkor-z-85f18s-zoom0-focus1 | edbb96ac1dd518cf805a8d5918f02b104d12ecbb91052f3dcd123783fe425e3f |
| focus-stations | certified-nikkor-z50f12-zoom0-focus1 | bd29ef5fd591536de10c988994966313d1f28a5d2b580eaa6d90f2c60bde5e01 |
| focus-stations | certified-nikon-1-nikkor-10mm-f28-zoom0-focus1 | e53f27ceace560d73991e9bcb96a0e7c70156dd42b6e19adb344d32605b8ea94 |
| focus-stations | certified-nikon-1-nikkor-32mm-f12-zoom0-focus1 | 8aa5a1903fcbabfa7435996b009b84d7b4412c3c722b51aa242b779ad61e362e |
| focus-stations | certified-nikon-1-nikkor-32mm-f12-zoom0-focus2 | 99e6158c59a3c4448b2768a9ed22658dd48644a90db276e47c716c867ba52e73 |
| focus-stations | certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom0-focus1 | 605fcb3a60139187b3776a0e58308810a95317a0b0d6bf68c844279cca636741 |
| focus-stations | certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom1-focus1 | 08560a0361261e6deb8f7e763613d0cb430b3f3cba49e953710bac48b6a99c52 |
| focus-stations | certified-nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom-zoom2-focus1 | 8f9101aff121f6577afce3809663558ac9b08832d2dbeb42ce4038e1b946a3d3 |
| focus-stations | certified-nikon-af-dc-nikkor-135mm-f2-zoom0-focus1 | 835a3f4894190eac341511338e078eeb3679f3b38cdd713851417969644f2c51 |
| focus-stations | certified-nikon-af-i-nikkor-300mm-f2-8d-if-ed-zoom0-focus1 | bdc2ecb131b7c5c3d361bcd23f2307c4dbeee03f278c8c3cec6686c00eded124 |
| focus-stations | certified-nikon-af-i-nikkor-400mm-f28d-if-ed-zoom0-focus1 | 8b2d93d21f7961354203e2e5179b8fd4c504aa7712e12ea8db662e55e105b285 |
| focus-stations | certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus1 | e4534f9312bc71161e4fc6a6295497a8f1fc7d7f1609fd55f3f921521c1cef73 |
| focus-stations | certified-nikon-af-micro-nikkor-200mm-f4d-zoom0-focus2 | 0221da5b5bb203d882f689b59cad1f8b909f611dd942c9b5d0ec4c123daac840 |
| focus-stations | certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus1 | 31f53066dea2c6294cf28daea0e136feea6d0369cab2f702984e11db76a88256 |
| focus-stations | certified-nikon-af-micro-nikkor-60mm-f28d-zoom0-focus2 | 686e71c6302d225076c5993924fdc61918fcca5ea56bf9af4f164a1d24546c90 |
| focus-stations | certified-nikon-af-nikkor-35mm-f2d-zoom0-focus1 | fd2e77883f35206d2112c05382a7b376a6de21ebf2f015b79f54d7fe388cca8c |
| focus-stations | certified-nikon-af-nikkor-35mm-f2d-zoom0-focus2 | 9da7115b90a353e739ecde0ff5c2b0a2120c7edaa4c67c74df35751ac0f0ac83 |
| focus-stations | certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus1 | d97afe6603d4b63f38496846a3db634609e81c65d1eac93fae1a998bbd7e4468 |
| focus-stations | certified-nikon-af-s-dx-micro-nikkor-40mm-f28g-zoom0-focus2 | b24bae37c1ae83dcbe69c816172616509bef7ec9c1acf8984bc153301497b5c6 |
| focus-stations | certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus1 | 42f1dbbc8e8b0605718fa1fa1a369870a73d4e32087ff416ae4daaa871afe681 |
| focus-stations | certified-nikon-af-s-dx-micro-nikkor-85mm-f35g-ed-vr-zoom0-focus2 | 19b0b409c1d099a41bc27e3f89500fb13005c2233cf91e0d475e9e4abceb3395 |
| focus-stations | certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom0-focus1 | 2d5162a5955e30832987cd06e2fcc89a985b0b930167b3a7ad0adc59d0ada6b5 |
| focus-stations | certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom1-focus1 | bb27c7072ea9bd024c22bbb01ae0aa0c797eaa25f5a4c0eff344f378cc36cfda |
| focus-stations | certified-nikon-af-s-dx-nikkor-16-80mm-f28-4-e-ed-vr-zoom2-focus1 | 8f061a078ebc5c4139307303a8e911d3d89bad7533b0400bf313567d680cdf88 |
| focus-stations | certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom0-focus1 | 64c5132b877b8ca83b66f8846d27670a1806acdc717364ad151c5b952990a025 |
| focus-stations | certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom1-focus1 | dad35d019b2439ac9de2aa890ed216fdf0e40886d82a26f7e0b1c65b2d631589 |
| focus-stations | certified-nikon-af-s-dx-zoom-nikkor-18-55-f35-56g-ed-ii-zoom2-focus1 | 68b35565f88f91744b6636132ae821ba2f72073e8204c7085f9b83cce487f99d |
| focus-stations | certified-nikon-af-s-nikkor-24mm-f18g-ed-zoom0-focus1 | fe2bc2c4bbffc728042ba19ce5fbe014a847a21e7d67b0cf0ce66f219f880451 |
| focus-stations | certified-nikon-af-s-nikkor-35mm-f18g-ed-zoom0-focus1 | 0939568662f6e63e80886d326d78d8fedbeee8e4f90c910c6c141108ad86d65f |
| focus-stations | certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus1 | cf4bb2d23fa88ce9734d46fc7dc4988a4d3144f5bf3061bf06a7f909f10a5abb |
| focus-stations | certified-nikon-af-s-nikkor-500mm-f4e-fl-ed-vr-zoom0-focus2 | 975c342338c09237be950c661a8b3fe9046b524c65b4065f5af161c8e5178cc3 |
| focus-stations | certified-nikon-af-s-nikkor-500mm-f4g-ed-vr-zoom0-focus1 | ad75bc6dbf8cb4e245db332c69d0c30e7c089425c579c21fecb06fcfad54f5a4 |
| focus-stations | certified-nikon-af-s-nikkor-600mm-f4d-if-ed-ii-zoom0-focus1 | 2a320d30f30f6b02c0aa34758c9777a6810d207ebc9538f22751951b7dff87f0 |
| focus-stations | certified-nikon-af-s-nikkor-600mm-f4e-fl-ed-vr-zoom0-focus1 | 02820cf1696e9889fbed1432ad5fceb8cf546a806561e79598facb41f96e4e8b |
| focus-stations | certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus1 | 22c3ce3c7b92bc226a9dd3a41e1076faf8806db04739a46e8c9f9a799129db7a |
| focus-stations | certified-nikon-af-s-nikkor-800f56e-fl-ed-vr-zoom0-focus2 | c969a54e33addead73d39b6ba802c7b520ebcadf442d59e40e6367d1c17f07ff |
| focus-stations | certified-nikon-af-s-vr-200mm-f2g-if-ed-zoom0-focus1 | 6e692a0e199cabf63729ba05688dc2f5833a0bacaebd09a209711188ee722af9 |
| focus-stations | certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom0-focus1 | 3f67f17d8ce11038ee0c7d939f2c993d193ee11f42aec6fb402eb138501a9438 |
| focus-stations | certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom1-focus1 | ee5585114d371991ee9805ad2efb944874c8064340e69f81736cfdd8fc66226b |
| focus-stations | certified-nikon-af-zoom-micro-70-180mm-f45-56d-zoom2-focus1 | 367abc6436ca566810cd4ca1274edd659501866e6bc71e31ce98dffd71db5a43 |
| focus-stations | certified-nikon-af-zoom-nikkor-28-85mm-f3-5-4-5-zoom0-focus1 | 12cac0eecbb93d1a4878ac957929943ec9188893db8f81df3760e559f9ff2bb7 |
| focus-stations | certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom0-focus1 | bd1f4b506bafaa6bd9ce207d0267b310efb4480df403374f8c389bd8b93316fd |
| focus-stations | certified-nikon-af-zoom-nikkor-80-200mm-f28-ed-zoom1-focus1 | 8dc43e61563490593705f21fc90e6c0e4120fb645f8f3889474b71f3a3bf0409 |
| focus-stations | certified-nikon-afs-28f14e-zoom0-focus1 | bcb4e0d9695ea9a187fd996263abb0657bf1809cc9109e6b993e331c3f99cc39 |
| focus-stations | certified-nikon-afs-vr-200400f4g-if-ed-zoom0-focus1 | e82d9f1b13e2dfec5d0621aee24d83152d93c7765485eaf71ed34f5621767ea9 |
| focus-stations | certified-nikon-afs-vr-200400f4g-if-ed-zoom1-focus1 | 647232257bbf24ae9b5cee87edaf7dc3011d38dc5e1d79d5842e47e2f584cabd |
| focus-stations | certified-nikon-afs-vr-200400f4g-if-ed-zoom2-focus1 | 917aabd708bd0c3accb0b48be8282879c5fe76098b7aa89b07a03838ad083993 |
| focus-stations | certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom0-focus1 | fdbd44e4a0309a7ba3368115d96baaed6270bdd4a1a2610a0afe62f9da0b23d4 |
| focus-stations | certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom1-focus1 | 5ac566e7a358c1f238cf99f403c375a05ddc0377abe5f92b19ece1e2bd37e9a2 |
| focus-stations | certified-nikon-afs-vr-zoom-nikkor-70-200-f28g-if-ed-zoom2-focus1 | 9fa80a8f8b76373a5794eff64645fe4f5462d09c5dbd8457e271d8db4df647f5 |
| focus-stations | certified-nikon-ai-af-dc-nikkor-105mm-f2d-zoom0-focus1 | da13641599ed3385532694b0792b9ad2edb8b38aa4a548a67dc952a3ad0437d0 |
| focus-stations | certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus1 | b86c34c5d24a108feee173a4d89330720ac39c31317a5bc9908c95ea413633cb |
| focus-stations | certified-nikon-ai-af-micro-nikkor-105mm-f28s-zoom0-focus2 | a0fab34e925d88be12032221e721629fbd894e25c501c1562684efdbf8290220 |
| focus-stations | certified-nikon-ai-af-nikkor-85f18s-zoom0-focus1 | e130c3836ae82e58719e196787dbde814c8e72b34a421b8ad2572133478abf12 |
| focus-stations | certified-nikon-ai-af-s-nikkor-300mm-f28d-if-ed-zoom0-focus1 | cc4c40bbff38b43f3dc01ff889fb2b9ad0f862dd8200a344767621ca9447c90d |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom0-focus1 | 5ba1047765a6aae7848cbde785c501e32aed194f3ceb2962ddcb926db43bced0 |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom1-focus1 | e2f043f6aa82be4c267e3cdd6c294df9419ef866cf538714084f10999919182d |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-18-35mm-f3-5-4-5d-if-ed-zoom2-focus1 | 0c773c72ec1ce58d1c6755d4a43f04b90caff072d99a86ed7d01f5482aae6bb3 |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus5 | 831d890fac38889e8c6c6ec9cdeaad4bfd18e09c32982387c59c12270ecdac49 |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom0-focus6 | e5652d1c3daaad6f4a3ed9892ab11741a8f932f5dc2458c9f5fa565aca69db71 |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus2 | d18f229aef311b3ae7ae235af9ce3d7d161cd142e543ada2c6085b8aac418dfd |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus3 | bdb7bb2ffb29388eb18c6099c797fa10e73f9af0dfa0fd9785bdc47f34b7512a |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom7-focus6 | 8781ecb5ed087385d4dd3497a43a4c4041229ecc849d43564f1b7bf57f281a1b |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus1 | e46f7fc23b6b81b9504d692f07a02509514fcf459b419bc18052f6571ac35d54 |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus4 | 5b3114cea89417170a1af721f200b365cc6c403951cdc1c0cd8a9f5182e8fc77 |
| focus-stations | certified-nikon-ai-af-zoom-nikkor-24-85mm-f28-4d-if-zoom11-focus6 | bac47355d7cb929f0fde951b81b8b91696e2d8c9474d977e06fdc1c226ccefcf |
| focus-stations | certified-nikon-ai-micro-nikkor-105mm-f28s-zoom0-focus1 | 8e11925aa8e83363701522ca4785766eff807ebdf055a286100f3110c4e9dd45 |
| focus-stations | certified-nikon-ai-nikkor-200mm-f2-if-ed-zoom0-focus1 | 5d99c73aca6f15ba28ad8ee882bed261c100c449bf79bb5b638770941af19ef2 |
| focus-stations | certified-nikon-ais-nikkor-50mm-f12-zoom0-focus1 | 297a610a898bffb766f10ca2859678016eb7b8b86311a4532cc8614ba766fea5 |
| focus-stations | certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus1 | 524c077c583638b3a216c227157a7b731729c8a28584e14e63b25f53b3f43c51 |
| focus-stations | certified-nikon-medical-nikkor-120mm-f4-if-zoom0-focus2 | 1ce1424fcf14f48f9f60b894b00a0d269c4c96f6ecbe033e1d0528ae2a4f71ef |
| focus-stations | certified-nikon-micro-60f28g-zoom0-focus1 | e737912bcbff82b3d03bf32a448d9a965048e88f7bcfae2e13e2727efa3dcecd |
| focus-stations | certified-nikon-micro-60f28g-zoom0-focus2 | fec31ee7ac04ef6725d33f94c1acf20fcdbaa4ff1ac7e0592f7d0de5eb1a3558 |
| focus-stations | certified-nikon-nikkor-20mm-f4-zoom0-focus1 | 1954d56c9b208d2c2d2dc27f6e9c5f893304b2966e92cfdcceb4c6ba34a63fc7 |
| focus-stations | certified-nikon-nikkor-afs-24mm-f14g-zoom0-focus1 | cc40fbe56d554487389b2ca5930a912620bdeba2e8b3fde8b60d4f1f56a9950c |
| focus-stations | certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom0-focus1 | 2b44b4e897fbc575ef933b6a0b8668362129faaf2f305dff38fb31276bab59cd |
| focus-stations | certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom1-focus1 | 64b6f1847543465f6f9d0dbdc6f3296b084088aebe953e046ce687895bef4855 |
| focus-stations | certified-nikon-nikkor-z-180-600mm-f56-63-vr-zoom2-focus1 | be30e882d556f3c9cd9181ee1be6cdd92d44ef1762adc320a498f1116425d1d6 |
| focus-stations | certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus1 | df2e8df023f90e806a021f669c5474e7863544e43d0a46448289fe0e20e1a2ef |
| focus-stations | certified-nikon-nikkor-z-20mm-f18-s-zoom0-focus2 | ef717536eccebb3ced3319170b138e78f6822a9fe881c49ac4e49fae5b5c0fb2 |
| focus-stations | certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom0-focus1 | 425064aee516a775452de790cf0baa53090d54ee8846b04a293e5450f555e3f3 |
| focus-stations | certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom1-focus1 | 3185e3128845048ffb7ce63c19bff71a3cb3283180dd21716c820d9bdde7872e |
| focus-stations | certified-nikon-nikkor-z-24-70mm-f28-s-ii-zoom2-focus1 | 7b74926af86c489cbe255c6b24f5b1467b6fdc6774ab846c7f68bd6d16346192 |
| focus-stations | certified-nikon-nikkor-z-35f12s-zoom0-focus1 | 9ef266fd9a3fabdbad66080a68b52e494be33aeeb7ae2b0bc1811a1b379f5250 |
| focus-stations | certified-nikon-pc-nikkor-19mm-f4e-ed-zoom0-focus1 | 0542c0c0ef9c981052107f2272c1b5a9979004cd06350b57d3f233088f20c21e |
| focus-stations | certified-nikon-pce-micro-nikkor-45f28d-zoom0-focus1 | e476455a4bdc2b934087e7a0866848570fd751339a2bbca151316fc938166d57 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom0-focus4 | b0898bf3156193b3f5cac2fc1caeb92ba7c40ade3688afbd7bb62f0fd9c7f203 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom0-focus5 | 491592747df511322f3377e9573bde82967cdba2493f2d50ba87dfdd89c26e23 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom1-focus3 | ee99cc711bbba025a1862608b512cfa8f24d1e357b4ec3535044733c8be43955 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom1-focus5 | 41e4575aed432625ea38fbbda36e9b06d2d2ef8c7f1ef057e794f0a5606f36d3 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom2-focus2 | 007b3f60ef64e98cfb38b310e7f255d4095c9c75b092030c348c99081ee964e4 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom2-focus5 | 34e849567f7c80922f96328e21d6d27b028f76c875c61258e73e21f123655a3d |
| focus-stations | certified-nikon-z-14-24f28-s-zoom3-focus1 | f5314d24ac520723d63e4cf5fd8e66610c222e2d39a5b7a03d602386fa8818f7 |
| focus-stations | certified-nikon-z-14-24f28-s-zoom3-focus5 | f3176f9fcc81f8ee2345a84be6d6e9873147b54e3bc20340df67b30387514489 |
| focus-stations | certified-nikon-z-58f095-noct-zoom0-focus1 | 4da47b6461b25174c335ddccb114b7cc411de6c427c70b3730989ece3f033668 |
| focus-stations | certified-nikon-z-dx-18-140-f35-63-vr-zoom0-focus1 | ba658fb5ff0e02c4574f08acaad929a6eda4417d2edb03e30dd8e68062b75ac1 |
| focus-stations | certified-nikon-z-dx-18-140-f35-63-vr-zoom1-focus1 | a29affd282fc032939fa63bc117b7bf43c16a988542a73197e3ff2e5a8b6e158 |
| focus-stations | certified-nikon-z-dx-18-140-f35-63-vr-zoom2-focus1 | 74ba94d182bf9f3405647ee873889eab05d0562854bcfffffb331b0d79a7b4b3 |
| focus-stations | certified-nikon-z-mc-105f28-zoom0-focus1 | 9908419e0a2a982a12934f9dc2b6fc3360baf585a0bebbb50b50d8baf6aaead0 |
| focus-stations | certified-nikon-z-mc-105f28-zoom0-focus2 | 3089070b40af08c3893b79ec4543fdccf629723e6d354fdd7deb57da3e83b22f |
| focus-stations | certified-olympus-mzuiko-12-40-f28-pro-zoom0-focus1 | ac23c5b2dc605591d5ff9ec441fe63f32f33a0ed14c5d85e440896a2cccda722 |
| focus-stations | certified-olympus-mzuiko-12-40-f28-pro-zoom1-focus1 | 728d6eb879bdd4c65c32aa6beb1993a31f0dde88a015a755df4e06f3ee82411a |
| focus-stations | certified-olympus-mzuiko-12-40-f28-pro-zoom2-focus1 | f0a449e22ef95a6b481a3d6196366274aa5116641dfe7e6e4b94c43d1a1aa703 |
| focus-stations | certified-olympus-mzuiko-12mm-f2-zoom0-focus1 | 349ab1eb303865b9790456e6431af93dcd1b5141ec29259293e417545db8f0c4 |
| focus-stations | certified-olympus-mzuiko-14-42-3556-ii-zoom0-focus1 | 93952c999c082df5001435e1e592161f39288f8a75fc66c3b90a5bce37f8dc7d |
| focus-stations | certified-olympus-mzuiko-14-42-3556-ii-zoom1-focus1 | 058eb38708f0ab99e773d2dbf62a53778c8c53ebbfa4678459e7c62c9cb5319b |
| focus-stations | certified-olympus-mzuiko-14-42-3556-ii-zoom2-focus1 | 6acf99c154fb65f1b0cc9f36eed9106075a70a8eb6b094848dcc502fef15df0e |
| focus-stations | certified-olympus-mzuiko-17mm-f18-zoom0-focus1 | 6e70c91e6d7cc6e326d65e1ab7155615dcab0bb5f82daea56d0eb630868ed0bf |
| focus-stations | certified-olympus-mzuiko-40-150-f28-pro-zoom0-focus1 | 941b9f3552c170857c8232c9b301baf6ea76d1cdf7058e85e01a19a52c95c3ee |
| focus-stations | certified-olympus-mzuiko-40-150-f28-pro-zoom1-focus1 | 2e81f5a8166158b3919e164b17de6bce6ac6637b6d0657d1784ac1108069bae7 |
| focus-stations | certified-olympus-mzuiko-40-150-f28-pro-zoom2-focus1 | 01f43956285ddda07c90fa9ad3671fb6b9b71c730d3b98675295fbc704ada1ac |
| focus-stations | certified-olympus-mzuiko-75mm-f18-zoom0-focus1 | a4dfa43e5f2ab8425d9f654988bd8df4a576d80e56b7c70924fe63ffcc95b051 |
| focus-stations | certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom0-focus1 | f725438a5cbe874b4adfb4a833671aba7a31022b552c94b4d013287b25072996 |
| focus-stations | certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom20-focus1 | 02f5edeb04aa2f481168802e81a76451206f894ee349bd7610e2d6f0fcf5b44b |
| focus-stations | certified-olympus-mzuiko-digital-ed-12-50mm-f35-63-ez-zoom40-focus1 | 0ca515278e703e89c0f596874883afce28d3931771b45221d4e06ab4f00cbb59 |
| focus-stations | certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1ffeed7214f4c219837b85a1116192fabb1e72ff66cd098ede5710dd840281a8 |
| focus-stations | certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 9276015f4a09ae0df05099a0725962e7d7fa25e98db611b456bf45264207fc15 |
| focus-stations | certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 8270906e01b3faca8ae4a642653a0f2f6bbf6c56f6ed124c25e85fe787091421 |
| focus-stations | certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | e2778a011e81560e6271e675f6844482a66b7f3ad247d8746d3215ec4c08e3fe |
| focus-stations | certified-olympus-zuiko-auto-macro-50f2-zoom0-focus1 | 6615a48be75c6f6fa26b1a42130ea364669c46fedd33e9128f6de7524d51d98b |
| focus-stations | certified-olympus-zuiko-auto-w-18f35-zoom0-focus1 | 2ee3771ab72d0c281fed76de402171bd9b2b19b5dcb62ad4a10905b0ec6a4035 |
| focus-stations | certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom0-focus1 | 9ddf0f72e741c0ab7d7f8dfc4d2c99d27b9e09da69b40936d860cca598cb4c36 |
| focus-stations | certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom1-focus1 | 34ad44c5ea41864211b6a0feaab96c3cf004eb0a38cf0cb8b870313e9f008ca7 |
| focus-stations | certified-olympus-zuiko-digital-ed-12-60mm-f28-4-swd-zoom2-focus1 | 0af7d9da80c52f9d62cdea55966cc8f62d6058f7bc31172ba91d1b80e4dbbd0f |
| focus-stations | certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom0-focus1 | 2a8da6053f22442e37c2a321504feda0419b9091ab263023537afc6ece714d55 |
| focus-stations | certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom1-focus1 | 3f8466490daa40222c36e81edfacdb296bb64c3714ba96760520b6c5964fd039 |
| focus-stations | certified-olympus-zuiko-digital-ed-14-35mm-f2-swd-zoom2-focus1 | 8f8a78031bf7e8fc806be774f4bf08e9c42a725268ebc74d5236420614c58a62 |
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
| focus-stations | certified-om-system-mzuiko-digital-ed-20mm-f14-pro-zoom0-focus1 | 15ce45a11fb8c25e4f30394cd0155697b0547473df2d1d13fb12a80f9fab8421 |
| focus-stations | certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus1 | 601393a3044f1793e2d2545b95bb2f69d0a00cb5a06a312f32f8e744efe5afc2 |
| focus-stations | certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus2 | a4c88b2daaa7bc52746dddefefd46aac59efe96b3430ab84a4e4b38d4c98bc5b |
| focus-stations | certified-om-system-mzuiko-digital-ed-90mm-f35-macro-is-pro-zoom0-focus3 | 7c8acc3119b2e7ada9a7f95058f8096ef93e4cdc675484e32c4d62b439d43eb5 |
| focus-stations | certified-panasonic-dg-nocticron-42mm-f12-zoom0-focus1 | ac19c63d75ccb57c5527937bc59f8cca9420f82978f5d6a63cd8fbadbaf570aa |
| focus-stations | certified-panasonic-dg-summilux-12mm-f14-zoom0-focus1 | 34f712da6c8468a7c6ca58975f4a683a0883fd0826d06cdf3dca8a32a3571159 |
| focus-stations | certified-panasonic-leica-dg-9f17-zoom0-focus1 | 80efd11805c2f43e0fd79754d7442df6295341e7f1f9dd1d44c754640bf75da0 |
| focus-stations | certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus1 | 5acffd255bd16dec38ec7bf59a63e15fa10c945e5f08321db0295f5d929e4e0d |
| focus-stations | certified-panasonic-leica-dg-macro-elmarit-45mm-f28-asph-mega-ois-zoom0-focus2 | 01204c554aa6d3bdeb06a16826df2de8e1ba36f9872344a1ed008efa3c6624a7 |
| focus-stations | certified-panasonic-lumix-g-25mm-f17-zoom0-focus1 | 3d5a20b1376dd20de3a83345ef6c2da070da30cd40724d7103c3f967518f0708 |
| focus-stations | certified-panasonic-lumix-g-25mm-f17-zoom0-focus2 | d3441b94626128cabc8c5c29da20b912bb44299052020a329efda011d4872ccc |
| focus-stations | certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | cfdaf3f52ab425d4ee0490bd4bf40d7a91a37615f02c23c3749d3fce68b4622d |
| focus-stations | certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 9876f2f2d40b032687ef30fd0b77d64b7a3d678c0010822ca3458e440d0d8955 |
| focus-stations | certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 53c5ca7e688cbf9f0983edcc98da88609e0868a5b88deef5ce559d2fa68766d5 |
| focus-stations | certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom0-focus1 | 1d1a13beb4b3fdde736e2b84dbf482de67ca20bc8dc21fa0214b2e72b10752b6 |
| focus-stations | certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom1-focus1 | f57b92aba3b70ab8b91cfc624927040d5f86724eed27a742d5afa9274e2738c7 |
| focus-stations | certified-panasonic-lumix-g-vario-45-150mm-f4-56-mega-ois-zoom2-focus1 | dc7021dbc6deaddcb9df19913c9f755a79c14a608a808c8785586f2f0d05a489 |
| focus-stations | certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 |
| focus-stations | certified-panasonic-lumix-s-35-f18-zoom0-focus1 | bc33e93ab5f2c875b4f60667c1a5bcda0c1ae567f82d2b9eae6b0dcee7453aa0 |
| focus-stations | certified-panasonic-lumix-s-pro-50-f14-zoom0-focus1 | b4df0a69dc5cf7804243f87351e43e1006d0ce188717783759ff6ebb4cb4448e |
| focus-stations | certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom0-focus1 | 9e3671b68b403840708c861b293eab4466718217ad6e235927ac961fa04cde56 |
| focus-stations | certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom1-focus1 | 120f80d3effbe7e6ac8a0a96ee1abe43d1df8eed74f92f19bc9d1f713779d25f |
| focus-stations | certified-panasonic-lumix-s-pro-70-200-f4-ois-zoom2-focus1 | 68fd449102898daf1bf701b95f2946eaf6e9e77554f86c4890c4211607243b57 |
| focus-stations | certified-pentax-645-fa-120mm-f4-macro-zoom0-focus1 | 761065a107d93181d4d5ed66e89c7bd83b4d441a4474a14246ca40d8b4440385 |
| focus-stations | certified-pentax-a-200mm-f4-macro-ed-zoom0-focus2 | 2ce77b8c8478f44cf1301affd94fe1adf0353306e0804bebd70549913277aa15 |
| focus-stations | certified-pentax-da-35mm-f28-macro-limited-zoom0-focus1 | 081479b0cc17e7ccdabaf6955249c9932596d27eb50874b44a27822670d8891c |
| focus-stations | certified-pentax-da-35mm-f28-macro-limited-zoom0-focus2 | eafde4b337d5f55855eaf110fc1cc9235363cf6a392cf06a776b5f759af11c8c |
| focus-stations | certified-pentax-da-star-300mm-f4-zoom0-focus1 | ab34a3ff91510c89cb19e8c441094423985bf1408cfc596aa5b003e214040111 |
| focus-stations | certified-pentax-da-star-55mm-f14-zoom0-focus1 | 6d49ddfb2101e97394dfb91d4857a9426b2950b62cde091db0dba711b1cc5687 |
| focus-stations | certified-pentax-dfa-50mm-f14-sdm-aw-zoom0-focus1 | ccc15ae0dac7f791bb0ba97ce6ad703661508306683fcfa30ec8ec41db2cc383 |
| focus-stations | certified-pentax-dfa645-90f28-ed-aw-sr-macro-zoom0-focus1 | e812e383aefbf1378280012ca45313a098abf095b100503697336ceb47e9770f |
| focus-stations | certified-pentax-f-135mm-f28-if-zoom0-focus1 | a38d1660058fbc6279070839a7dc66cac1f49f705602936a3eb5cc5a2286a2b1 |
| focus-stations | certified-pentax-fa-31-f18-al-ltd-zoom0-focus1 | ac18424133a2877c2a9ccfe9a1461027dfe1744e7bc33821de795c5c99fabad4 |
| focus-stations | certified-pentax-fa-star-300mm-f28-ed-if-zoom0-focus10 | 8ee6b705de575b517031b3a81dac81eef3cb50c44acdb598629ac6b209d12f9a |
| focus-stations | certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | bb47082c2e9124e55765678231442de72d55ad3b834333c85b8837cf7f9ca5aa |
| focus-stations | certified-pentax-hd-d-fa645-35f35-al-if-zoom0-focus1 | 388cdbbd809ed76758c5305f5d30f99650d41f8a3c9788a8adb85dec99cf5420 |
| focus-stations | certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom0-focus1 | 87a4bd600ffd221c1d1f783cd9c114be47a31885a42a60661415550efbcdb540 |
| focus-stations | certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom1-focus1 | f7393efc5b8bfd9654922f69bcafd6fdcc4f210cffafc82157f543fe16a794f4 |
| focus-stations | certified-pentax-hd-da-18-50-f4-56-dc-wr-re-zoom2-focus1 | 36e163b6e545a541bf5d9bc90364f042d16505a5f3eb5ea2295f5b72e1a97b63 |
| focus-stations | certified-pentax-smc-da-14mm-f28-ed-if-zoom0-focus1 | fa1f47fa266f2a3b734acfc5875c2cf9a0da214158a05baeba3828f068c03bd3 |
| focus-stations | certified-ricoh-gr-digital-iii-6mm-f19-zoom0-focus1 | 85ef91b49c1fa0423ac07ee414f94cdf040b66ef9d240477cb1a803f56390510 |
| focus-stations | certified-ricoh-gxr-a12-18f25-zoom0-focus1 | ce59e97f80de480fbe56c5d266ec68ba77bf15ba53b00d1df1e9de8f066fc1ef |
| focus-stations | certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus1 | 473324337d1790b344feed7a92ba1f4ff05512853c904712e397db44a66c039e |
| focus-stations | certified-samsung-60mm-f28-macro-ed-ois-ssa-zoom0-focus2 | 353273b2752db6c3d95d49004937352b55c054170e4341ebc0e18808cde3a9b4 |
| focus-stations | certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom0-focus1 | a4839027e563f13d61a31e229062869ba6eaa7282129c0aa694e96538d5ef2a4 |
| focus-stations | certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom1-focus1 | 4709c8f33a736a0d5b0ce18089555ea8f27c78e57101c596a52d5203a59a099a |
| focus-stations | certified-samsung-nx-18-200mm-f35-63-ed-ois-zoom2-focus1 | a686006fbdc209c320c50f5cc0797233ece3248a37bbb2815c937e3172d6de54 |
| focus-stations | certified-samyang-af-14mm-f28-ef-zoom0-focus1 | f738c7fd1c6b1e0119057b5dce8dd097ac9e1e924d461103f9b9821fd323025c |
| focus-stations | certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 26cb89d09f607ed33c3dd367d9c8c05290608b97283f3a53140ceda948b6726e |
| focus-stations | certified-samyang-af-14mm-f2p8-fe-zoom0-focus1 | c1cc4adf97b7f0c66c8bf07884777b902c2fdf5272a85c7eacf53a1719e98c79 |
| focus-stations | certified-samyang-af-14mm-f2p8-fe-zoom0-focus2 | aae9784dbc44048cead30c8deddf34f02d016f0662ca2bb2cc5b631bd49a2b57 |
| focus-stations | certified-samyang-af-18mm-f28-fe-zoom0-focus1 | f032558f1e6a2c97026c9779f1f75b487587b87d66c754a952d3b835f3b36022 |
| focus-stations | certified-samyang-af-24mm-f1p8-fe-zoom0-focus1 | 14740286e1d8e6a61b0fcbc191ef101ef695bc4517d87b50926b31c61fc042ed |
| focus-stations | certified-samyang-af-24mm-f1p8-fe-zoom0-focus2 | 1fc23e9a256680d7ddc6cbe08d15501270f9922017435939abcc2625200066bb |
| focus-stations | certified-samyang-af-24mm-f2p8-fe-zoom0-focus1 | baf2330f967ed007a6cae2f177ef374e66b462a73849f5d41111de6c4f36541a |
| focus-stations | certified-samyang-af-24mm-f2p8-fe-zoom0-focus2 | bc450fda457115ba846d86598e3b69822f687d4db0c498104d66da8c39b215e5 |
| focus-stations | certified-samyang-af-35-150mm-f2-28-zoom0-focus1 | 5014298c052103c067414f21e7f30770ce9394aa999f7e69749824f03d2e0ef3 |
| focus-stations | certified-samyang-af-35-150mm-f2-28-zoom1-focus1 | 1ce110eb2269e161e845b12826cd2ef8764a483cd98ce8bbda5855b1c35efa3a |
| focus-stations | certified-samyang-af-35-150mm-f2-28-zoom2-focus1 | c75804344ae15f0b57f5c700da4bb7594c342c32c5814e792b877b93e7553466 |
| focus-stations | certified-samyang-xp-35mm-f1p2-zoom0-focus1 | 664a578c48b550979b0ed87a15f3d2c0360c9a069919cceab3e6d5568747213a |
| focus-stations | certified-sigma-105mm-f14-dg-hsm-art-zoom0-focus1 | 7da5afc39f4d2091c09c8c36255771cd94b5b59f91c86f4cd1676794eb201690 |
| focus-stations | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 77240b3249fc2f96cae82d1c5932f50dcef934088dc2120589ed64b46daa3b0f |
| focus-stations | certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 02dd902ccabd7e9efddefd7cf52710bb38253debd4b731f861f8cc74e4fef217 |
| focus-stations | certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 22f573c4dcca9f77d238821d35ca62ce41661714c27dafce162fe79e5c759f23 |
| focus-stations | certified-sigma-135mm-f14-dg-art-zoom0-focus1 | eeb1536ebab034372569abe5359886111aae56eca2050eb0801d93c8c1e67dab |
| focus-stations | certified-sigma-135mm-f14-dg-art-zoom0-focus2 | b549e5c3c090d253532f2bad999fb5293fb98117f7a7588ef80b18423f0e66a2 |
| focus-stations | certified-sigma-16mm-f14-dc-dn-zoom0-focus1 | 1f15f45d7800074e6b2c6895949fbe2c9903dc6d2bdf85639826c560bcf95606 |
| focus-stations | certified-sigma-17mm-f4-dg-dn-contemporary-zoom0-focus1 | 927d7b116e4613a1de27ec09b6727035206cf5b199e82dacf4255d0b24b68a92 |
| focus-stations | certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 894debefc6fdb16f1ab38c6055c2fb104509070cfe07cd49d9ad4f8bc92fbd76 |
| focus-stations | certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | e3c1b9c0842d88e4bb1ea57ece875089e1a6de335469b227438334a9f4a6016f |
| focus-stations | certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | acd7822027052cc1952f100f7114f829f03335fe258f4f7cec4b41880210e964 |
| focus-stations | certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 11e8a91c1e7e9666e6214e8dfa9a071aa95c30b044aa47782b4e7f85afc12bae |
| focus-stations | certified-sigma-20mm-f14-dg-dn-art-zoom0-focus1 | 1e6042680d6d2e5a8da8202abe64e21fa0d2815229524bd3ad0d2ee01452790f |
| focus-stations | certified-sigma-20mm-f14-dg-hsm-art-zoom0-focus1 | 83f213e2d7558446acf42627da06560785c15e5b892331d12c7b48c3c7f96548 |
| focus-stations | certified-sigma-23mm-f14-dc-dn-c-zoom0-focus1 | 67db6e012a0d70a8776e14237adab3e38dc06e3d5776dbe8f257feecee7dd0a9 |
| focus-stations | certified-sigma-24mm-f14-dg-hsm-art-zoom0-focus64 | acd45c4d3d13b956da700f7ef03591b83ccd3e342545ada1ebe2d9d82af37a2a |
| focus-stations | certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | b0be2f20e5b95353f9377fd656f14c691282d42c2e611dd69986cfcecb4b85e2 |
| focus-stations | certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 9aee102182725025ed61069c4cf367e7cebed4d547743098cb34574dfd66eaff |
| focus-stations | certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | cf90a40810f02e10d4a3f936a8edef233b88ecbd3a6ee545eaf703df4560b90b |
| focus-stations | certified-sigma-30mm-f14-dc-hsm-a-zoom0-focus1 | 4d0027fc761e6ab1e6c4a1bb5f0a0b1ff90dd4840f686a536eab37f6abfff3bf |
| focus-stations | certified-sigma-30mm-f28-dn-art-zoom0-focus1 | e251d77e7e9131f98e06713188eefd153ae215d1871161ee44cbc12719e3f642 |
| focus-stations | certified-sigma-35-f14-dgdn-art-zoom0-focus1 | 14041d465f783f711d167232e489aee39e28a20545e8bd03cf4c804363e15e52 |
| focus-stations | certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 17d8f3a57a99e1785f48b4b99a93338c1fe926853d879f06d38255370f1d221a |
| focus-stations | certified-sigma-35mm-f14-dg-hsm-a-zoom0-focus1 | 09c166a3940fa77c549513afef51aa55f9ca23a0bfaf697d02ea3d87596a9e5a |
| focus-stations | certified-sigma-35mm-f2-dg-dn-contemporary-zoom0-focus1 | 848e096ac814bc7eaa4915672cfce036c27f85ceea89254fe905572d130790ce |
| focus-stations | certified-sigma-45mm-f28-dg-dn-contemporary-zoom0-focus1 | 1dc8e1fdfc7b7c7704c42de95252b44e647cd6bbde66dac35bd9e53db525d699 |
| focus-stations | certified-sigma-500mm-f4-dg-os-hsm-sports-zoom0-focus1 | fb063dc8a16a740e133c1a53d3e2a7d7a83b2a37b4f39b913ffc2a92f91f3a8b |
| focus-stations | certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus1 | 644f8b54712f2e8e04d19e5cc291fca1a671d65e6459308809abb27e7b525280 |
| focus-stations | certified-sigma-500mm-f56-dg-dn-os-sports-zoom0-focus2 | 10dabd24f0793d136c68bb0bebe5c05bedad47ed5b0d4a6c5ec2e08a2abc3d10 |
| focus-stations | certified-sigma-50f14-dg-hsm-a-zoom0-focus1 | a8ca108087cb40470949c9d789c08b901afad730407cc38ab272e50a29a30aec |
| focus-stations | certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 851b25697188fac9d7e726bebd0f012893d277d9551e858f7d1dca682ecd9736 |
| focus-stations | certified-sigma-56mm-f14-dc-dn-contemporary-zoom0-focus64 | 0e48e496478c8c822adf0593b386dded544594b0ad9e8a52ee2df544dfd07851 |
| focus-stations | certified-sigma-60mm-f28-dn-zoom0-focus1 | 495e025cf111be7936c652fc8924ab3695e6f26fd67715bf663984ab58b65860 |
| focus-stations | certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 62d4f5600679b10f237e8aa57b30967f59bb7bfb16b5a7a4d351fb64dc84f4eb |
| focus-stations | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3a6c0b2f69addb626038c0990440dde5ddee0abfcb44a8e595df75e5589fe065 |
| focus-stations | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 18b137c95a0dea4adf0bc6590a8f3de81c6d67565837d10fce7c60af1a18a2f3 |
| focus-stations | certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | b4a9bef13532c7161f7793a1ecf28c9cafd8b539699dd9d40995b0a468bb9631 |
| focus-stations | certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus8 | 4c007de74973def2a32965907541cdd909b081ff8036fef4dde69926c5498cfa |
| focus-stations | certified-sigma-70-300mm-f4-56-dg-os-zoom20-focus4 | 827ce23a9b1f784a4b5c4dd72bd345210bc4f7ae826b576e158c4b22bfb38ac4 |
| focus-stations | certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus2 | 88fee4e84777e7181151c3b0a912d70efc6652ccbc666ad44e1fff00ce7865de |
| focus-stations | certified-sigma-70mm-f28-dg-macro-art-zoom0-focus32 | bf2ae8d971feac5f443b981f14fa33957883b73d39ebc168f1c7cd0fcf0e46a5 |
| focus-stations | certified-sigma-70mm-f28-dg-macro-art-zoom0-focus64 | 803b931ecef50d7dda14551d145463bb9d9f1b1973a4337dfd22bbc794d6bc72 |
| focus-stations | certified-sigma-80-400mm-f45-56-ex-os-zoom0-focus8 | 32df41682ad6ae1d40d27c62b3c23257cff59bbeda72184810f245cecd13493d |
| focus-stations | certified-sigma-80-400mm-f45-56-ex-os-zoom20-focus8 | b095f288ed25fe8811fa91dd9e7d4fb3d56cb6600479580147e3c47c574ebba9 |
| focus-stations | certified-sigma-80-400mm-f45-56-ex-os-zoom40-focus8 | 5fc447c1c97b82af66fdc84fa82ed93e9aba571bf7dbee8900b81a0579470d98 |
| focus-stations | certified-sigma-85f14-art-zoom0-focus1 | aa15565b6f8e0b8a19a8e9de0abd602df7b15519aaac747627a2d2bb3d425aee |
| focus-stations | certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 10bff0b1d82d13878aac8613719bc9056478c7706a675c17b4e2cd8e7f9de763 |
| focus-stations | certified-sigma-85mm-f14-ex-dg-hsm-zoom0-focus1 | 4e764b10904167610e81d01347a3757bd2104c01fc094d8a36b371e333dbc5aa |
| focus-stations | certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 22198c5be871fa98cbbb32e8975a4030730a7894a5e8eb7bfe84328a92f0e7bb |
| focus-stations | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | d3c8e53174c6be102245c0f585610a5113b69023d529bc4a8ef903ed7dab1b81 |
| focus-stations | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | e3494e8829f8776277b876a310757be1c87ad3383f203625023abbde92f0401e |
| focus-stations | certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 84e21a2ef03892e1c5b23daa5313ab4e43886ee541e31976e7cc56e6e12a3a67 |
| focus-stations | certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus1 | 7a92eb0b2623d19d04ac0bbdd7e48ac7cf8450c1b86206acc2de837ac97f7166 |
| focus-stations | certified-sigma-apo-macro-105mm-f28-os-hsm-zoom0-focus2 | d1ad44f0f8712fa04fac2430a80cafefe0168d1eb04e9afe3970c1cb4fa942bf |
| focus-stations | certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus1 | f1071f7701d9544665ca1b8cba89b6298fe21e31f40eaecf48871ea13984541e |
| focus-stations | certified-sigma-apo-macro-150mm-f28-os-hsm-zoom0-focus2 | 30adae30e309e63fe7f79aa0defa55431ba9f3dcbeb8c07add95aae76d033ff0 |
| focus-stations | certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus1 | 35ac75877ed19b347d55310611871ab060af15e1e0aad8d5f459f267d78e2002 |
| focus-stations | certified-sigma-apo-macro-180mm-f28-os-hsm-zoom0-focus2 | 5bca6fc27b2fd6d1feede4f149f3b430b050e36bb3f46d7c0cb05369c7da3944 |
| focus-stations | certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | e66d7ce98eb7ba9e080cb5247736616f8a44ddb243f3336b537bdb9343b9346f |
| focus-stations | certified-sigma-art-40-f14-zoom0-focus1 | 6c1a72f1e69116d071ef97afb36c586b5984eb87a0601ff1717c251359ba6615 |
| focus-stations | certified-sigma-art-85mm-f14-dgdn-zoom0-focus1 | c85c649ac9839fedd1d3bf57fc34380f2e10f992fa6b86b651701e301f00e666 |
| focus-stations | certified-sigma-dp0-quattro-14-f4-zoom0-focus1 | 31df4fbca3db4ce1a7d0789c03342c9eb3cc00ad6df044875139468bad49f815 |
| focus-stations | certified-sigma-dp1x-16mm-f4-zoom0-focus1 | e3073666315beed79ff59e2c692bfec2152164eab2826f940a3fc334d202a70e |
| focus-stations | certified-sigma-dp2m-30f28-zoom0-focus1 | cc8c28a93b9097140973bdac266cdd57da7b0670a4279e5295a5a281af075147 |
| focus-stations | certified-sonnar-e-24f18-za-zoom0-focus1 | 2f06f9bcbc1887e65bf6b4fc2eb2180f2a0d3169df951cc0c433569458660692 |
| focus-stations | certified-sony-e-18-200mm-f35-63-oss-le-zoom0-focus1 | 7a9028a0badf2cac69afe2330c58a585f0dca4f99afc5fad55bb354f04e73df1 |
| focus-stations | certified-sony-e-18-200mm-f35-63-oss-le-zoom1-focus1 | 22ace4eee4599b1f771d37fb1bcbe14a6b8e4182cbf3fcbd9be8115e94ed16b8 |
| focus-stations | certified-sony-e-18-200mm-f35-63-oss-le-zoom2-focus1 | f0e136e0d546b163221d5095f4f17e380886e39a352cc59e873e23fb8aa9285b |
| focus-stations | certified-sony-e-20f28-zoom0-focus1 | 1a0c0bc7d2d51d2fbb56aa8b555260fcb3c772b5ae9616bbb136a2578c361a36 |
| focus-stations | certified-sony-e-50mm-f18-oss-zoom0-focus1 | 27b663a5615d91fe77edd777f05b721c0ad540f510d8bf2cbbb9e6101cda4e41 |
| focus-stations | certified-sony-e-50mm-f18-oss-zoom0-focus2 | adaa2817d924e9cf327ba688b20b67043249829c0ad93dcdb2b62ec075a65bc4 |
| focus-stations | certified-sony-fe-1224f28-gm-zoom0-focus1 | b33aa5339bb9ddeb33d3c9ce6d639e6c864883c1c53664bebd259ab074b952fe |
| focus-stations | certified-sony-fe-1224f28-gm-zoom1-focus1 | 4e0f4450b3b158005ce99056ae0577dde01c3629be13c955237ab60f321a8478 |
| focus-stations | certified-sony-fe-1224f28-gm-zoom2-focus1 | 69867866857b24110b9845b805103797226d22377578c66bdb5acc68be8a17d4 |
| focus-stations | certified-sony-fe-135-f18-gm-zoom0-focus1 | 4687cf6f28faea869a03d74a28d106b6720c326f6ba8cce91a7630208f2f9815 |
| focus-stations | certified-sony-fe-135-f18-gm-zoom0-focus2 | df218c15a379cb447f964dd42c3fd68d1ee49e972b54a1d14bfcbccb6ff0cbdb |
| focus-stations | certified-sony-fe-14mm-f18-gm-zoom0-focus1 | 2de250f4482f403846ab240ce79473ce30f060ee2ca7e096a26c087a498d67b3 |
| focus-stations | certified-sony-fe-16-35mm-f28-gm-ii-zoom0-focus1 | e170a27bf0f04b35a07de0bd67b90b4650035a5fc506fa0cef4af6e64f8f56ac |
| focus-stations | certified-sony-fe-16-35mm-f28-gm-ii-zoom1-focus1 | bed3f4d42fa7546b3c173cb7141670e8fd1dbfd356fcf52aa5a874c11ec089c3 |
| focus-stations | certified-sony-fe-16-35mm-f28-gm-ii-zoom2-focus1 | 3a0e80a04ef80a6eca71853aade877480cd1a2db78f5b0c99001b256c714dd22 |
| focus-stations | certified-sony-fe-20-70mm-f4-g-zoom0-focus1 | 61a18f7079152b91baa90009f0f51c3d1d2153a4547413069e3e86227eca49ae |
| focus-stations | certified-sony-fe-20-70mm-f4-g-zoom1-focus1 | beba7c04a0ef502b737e829015f66df740c6776662da94153a2c451775f54e6b |
| focus-stations | certified-sony-fe-20-70mm-f4-g-zoom2-focus1 | 4bace493f4664aa07f715fb1fb8012792bdc6b80b1566961cfabaa68dc5648e7 |
| focus-stations | certified-sony-fe-24-70mm-f28-gm-ii-zoom0-focus1 | 07decfcb265dc340c54a16d3dc1183066b08f738d32d31be88671082753b7239 |
| focus-stations | certified-sony-fe-24-70mm-f28-gm-ii-zoom1-focus1 | 3d8ef6eae263508bd3535d283e9303bb9689ed1b6c6c8ca98bb44517d621dc1d |
| focus-stations | certified-sony-fe-24-70mm-f28-gm-ii-zoom2-focus1 | da0779f5c87036d8a52d726e1479c819a17d1bff8620f46cb711690553419ec1 |
| focus-stations | certified-sony-fe-24-f28-g-zoom0-focus1 | ff0673bd6d7835fca1ba2aac41f3f304bd21797344087881fbbe029d72ce63eb |
| focus-stations | certified-sony-fe-24mm-f14-gm-zoom0-focus1 | 7485fec643f9963ecef1b5ce3dd755a997fff9dd65a24e0940ee6d856fa975d5 |
| focus-stations | certified-sony-fe-28-70mm-f2-gm-zoom0-focus1 | 1fd3e0cb6537e5c04f6822ee06ba6f077accee2c4f048da2743c79ca5ee81cb4 |
| focus-stations | certified-sony-fe-28-70mm-f2-gm-zoom1-focus1 | 6b2555e7c9c4874fba7bcd91cbcd97283594ed6252b2d4f5508aba1a1187200e |
| focus-stations | certified-sony-fe-28-70mm-f2-gm-zoom2-focus1 | 5b2b3db5b33e53d26a56f798e4aafcae5762eb19479cdcd8e844c80c20797837 |
| focus-stations | certified-sony-fe-400-800-f63-8-g-oss-zoom0-focus1 | 6e2c35ab174efbaaadda6de665623c33a25f59f57dff9253128d1c9e253859b7 |
| focus-stations | certified-sony-fe-400-800-f63-8-g-oss-zoom1-focus1 | afd88c2a4303eb95ab8b0aad955b161a9d870fdf5e208375d233d2247b01466b |
| focus-stations | certified-sony-fe-400-800-f63-8-g-oss-zoom2-focus1 | 96317fcb0a131f9a546f9099feff2afbc17cf45bb0107ced1808690dcdc1d74f |
| focus-stations | certified-sony-fe-400mm-f28-gm-oss-zoom0-focus1 | 7345ce6b72b8f9b2a1bc62ec4e662576889c3d21bfd53949b26a2608acde241d |
| focus-stations | certified-sony-fe-50mm-f12-gm-zoom0-focus1 | f1649607a56464466650649403af2b9ad05c94f5acce89f1be347910be7fc2b0 |
| focus-stations | certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b |
| focus-stations | certified-sony-fe-70-200mm-f28-gm-ii-zoom0-focus1 | 8fb59498f29e1c7a00d63c2bb0f3985e3c4c6ef6ce6ee1e93433addae809ff90 |
| focus-stations | certified-sony-fe-70-200mm-f28-gm-ii-zoom1-focus1 | 999ac964b757f064eec7244e64e523dd6afa72d0807596d6ebbf45e9628e9d4d |
| focus-stations | certified-sony-fe-70-200mm-f28-gm-ii-zoom2-focus1 | 44f1e51b55435c93932e8d9736e3764c21b6bbe140735eea3214b4166181d329 |
| focus-stations | certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom0-focus1 | bde4a846cf5bd611100323ac4d8a3d417090282f743da51362336f88c273fc01 |
| focus-stations | certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom1-focus1 | 633723a1dc2769db9a0666da391db2494b78a19dd4e12c609efa5305da712fc4 |
| focus-stations | certified-sony-fe-70-200mm-f4-macro-g-oss-ii-zoom2-focus1 | d7fd59e8546239bf71a9aeff0fc2ab86112bb5595cd143046c9870821836b781 |
| focus-stations | certified-sony-fe-90mm-f2p8-macro-zoom0-focus1 | 5db1210c3a0639a822a4880f6f0de09018c8ff71d84ed0d51239a04f19e8eaa7 |
| focus-stations | certified-sony-fe-90mm-f2p8-macro-zoom0-focus2 | 16a485abb255681261aa49d6a97d95e273551d5a7890cb72178deae00b3907f5 |
| focus-stations | certified-sony-fe-pz-16-35-f4-g-zoom0-focus1 | 62c7c33f9322b26227c793e8d710a762a8dfce67c4e8ec59e932d9da73f23d70 |
| focus-stations | certified-sony-fe-pz-16-35-f4-g-zoom1-focus1 | 48875681410df43cf81628bd6a6939b87d37bbc0c201667ad8ca313a419a31b9 |
| focus-stations | certified-sony-fe-pz-16-35-f4-g-zoom2-focus1 | 072a6f509735e1345e75bc95430534bba1fbc0caa3676a0146c83fd39d6355c8 |
| focus-stations | certified-sony-planar-fe-50f14-za-zoom0-focus1 | 772babd6c9a9365f0c06a1be386c4b200c88d252ec58af695adc5373ef5ef674 |
| focus-stations | certified-sony-planar-fe-50f14-za-zoom0-focus2 | 492bc1ba7a17250067e06c3e6cc842178a6435cc801c84a36ecab033294d3246 |
| focus-stations | certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | c4cafe389ff19f2b3ac144e21ca3a2ece14048ff1d29f1bb6524fe0babf56aab |
| focus-stations | certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 7cdedfe0afa1f9483af937f9046fbb2ab00c5bc46d01efdccf884970dcd7f325 |
| focus-stations | certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | e29835a068866e0eb6f0b139d64a7097729dbf772bb0e5a01721d000d453e978 |
| focus-stations | certified-sony-sonnar-fe-35-f28-za-zoom0-focus1 | 7633bba353a8983bc790a2dc68ae352491a18b16adeb06c176d3ca00980bf411 |
| focus-stations | certified-sony-sonnar-fe-55f18-za-zoom0-focus1 | c59e472ec4b0a756f36635847d9a5d8a007cb1335beba2848dca7f4cdfadaecc |
| focus-stations | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | e9ad1a503946236f045733f560103e3933bd81639f95378052623200c2cfcc6b |
| focus-stations | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 994c354dbc1f23b34155f96356c86d66c874b96fc93a767ae4b11094eb343fc3 |
| focus-stations | certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 20423bc3d2cf0c94f92962d1a19b5c88df68a1182f58d8c4698435db7afac44a |
| focus-stations | certified-tamron-a056-70-180-f28-zoom0-focus1 | aaff9815c508484df48e929f734b02614f2ad1da679248c81ac9264b2be40f9f |
| focus-stations | certified-tamron-a056-70-180-f28-zoom1-focus1 | 30fb79f1d45ba3d665b716bf0001edb65e2c9637cd46cad2a0e304e078ea92eb |
| focus-stations | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | cf5bfc19bb19d9416ec8d7cb6d06d35602e9e22a6555ab611425d7cab311ca16 |
| focus-stations | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 25da8f06a8d3bdf2628ebb6d3ca7332233ad2a86a1f534cd812ccffcca269b8c |
| focus-stations | certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | ccbca3c4799d7e3c75230c6a96457fd805507f1aeb1485390433f3b99e2be175 |
| focus-stations | certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 4556b24f2345c91fef9e2df87e3544a6fc6a852e9a89c849d0fb11af035c1b97 |
| focus-stations | certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus1 | b79ae4124a45de47ebfee73fc4b4689acae2c77197bfac0a952f98759e9fdd03 |
| focus-stations | certified-tamron-sp-90mm-f2-8-di-macro-vc-usd-f004-zoom0-focus2 | 4b0c13af1b80402be0e38c1f4c97d98ec385ad8e0cbf10c7bbe16fa4d91e06cb |
| focus-stations | certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom0-focus1 | bb7e2824a128470069319c02fc1aa5491069b9f35000cd2e3379f930ce99c1f3 |
| focus-stations | certified-tamron-sp-a009-70-200mm-f28-vc-usd-zoom1-focus1 | 1658ead4b9b8a6945d4f886fd6b4f2358e432cb0db14597a18f655eeb1496d6f |
| focus-stations | certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom0-focus1 | 61c16fa7a19d167d2216f0758ae107781ddd314d445f87854dc9803e03163749 |
| focus-stations | certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom1-focus1 | db842ef619ba37a5a545e1d0ebe5fccb8d48e5901a671d6c881d8d200248d751 |
| focus-stations | certified-tamron-sp-a011-150-600mm-f5-63-vc-zoom2-focus1 | d2b22ff17294de53a18a34fd782a74e7cac93e8877e75f80dfa972469fe3dad1 |
| focus-stations | certified-tamron-sp-af-180mm-f35-di-zoom0-focus1 | 6bf046b2fca4fea51917e94fc1959015cc4f4437cfd5c2ade1428793816e54d7 |
| focus-stations | certified-tamron-sp-af-180mm-f35-di-zoom0-focus2 | 809dced0ccd1d74476ab9fd7caff0414696cac4b08bb964a88c013d09c3b5c8b |
| focus-stations | certified-tamron-sp-af-60mm-f2-di-ii-macro-zoom0-focus2 | a15a42e1725b3dfd44c739569624831b2e4ba525d66fd6b2685c72c86c3a7a2c |
| focus-stations | certified-thypoch-ksana-21mm-f35-zoom0-focus1 | f8e388d76b003371215471c21196c27490b0cbf74082366abf7113a8667555cb |
| focus-stations | certified-thypoch-simera-50mm-f14-zoom0-focus1 | ae188d3eb305c52019797e5d4b2b534ffaa03c876c648707567624a3b8f9a0fe |
| focus-stations | certified-ultron-28f2-asph-zoom0-focus1 | 36985dc667666fea51dd82482db70d8c6342354bcfea60439580f20ea2cd242f |
| focus-stations | certified-varisoft-rokkor-85f28-zoom0-focus1 | d74acafd5f1a120a23f631f49dec57a7a2776329f3cf0f04c3cf345bd0ddc0b4 |
| focus-stations | certified-viltrox-af-23mm-f14-zoom0-focus1 | 0ba1f8b7b11f3795ec893388432585a3e30850604a4933257082908e0cc2a15f |
| focus-stations | certified-viltrox-af-35f18-fe-zoom0-focus1 | 131790e53beabbc8535281b6d646b42ef96ab2214d7d0e5a475582ca50191163 |
| focus-stations | certified-viltrox-af-56mm-f14-e-zoom0-focus1 | d1d8b2bd8829d3adf76a6865164044a0c481b1c3cdac2fdc327ce297bbe050cb |
| focus-stations | certified-vivitar-series1-90f25-macro-zoom0-focus1 | 7654996fb632089dfd29c6b2245c17ee96b17824d4e33ee0e3bae8ced3dab74c |
| focus-stations | certified-voigtlander-apo-lanthar-28mm-f2-aspherical-vm-zoom0-focus1 | 54b85cd00d5757df1a7690834189a7539471ae96a6408a318ea39d051b37d27d |
| focus-stations | certified-voigtlander-apo-skopar-90f28-zoom0-focus1 | d718e729027e34c4a1644e690e48fcace48ac2f88c50b47471f79e66f38d4c44 |
| focus-stations | certified-voigtlander-apo-ultron-vm-90mm-f2-zoom0-focus1 | bf3a63249af567f91a1696b7ae9c36ce814a205b37e3e6f1f75a8ca4db0810fc |
| focus-stations | certified-voigtlander-color-skopar-18mm-f28-x-zoom0-focus1 | db4a7601df91386311957c60ac6633bb85d43ac337a51216a887e1bb583f92c1 |
| focus-stations | certified-voigtlander-color-skopar-28mm-f28-aspherical-sl-iis-zoom0-focus1 | 5b10afde2e0e4c2bfa5e5f389329a82778beb4076c4a6e3c9a4f419e27f354ba |
| focus-stations | certified-voigtlander-color-skopar-50mm-f22-vm-zoom0-focus1 | b3211d4baf264bbb33b984948e282ee7ecc999ded6b2e2b6d6425a5d19a329c5 |
| focus-stations | certified-voigtlander-macro-apo-lanthar-125-f25-zoom0-focus1 | 2e2275a5128c4ac0016656618a81699baea677bab35f9252203cdd51e4556ea2 |
| focus-stations | certified-voigtlander-macro-apo-ultron-x-35f2-zoom0-focus1 | f3b6869f0d15a83f79189993426a2d5fa8dfaeb48872cb8b441be70b99fb23a4 |
| focus-stations | certified-voigtlander-nokton-50f15-aspherical-ii-vm-zoom0-focus1 | bb2f07710783da47c173f000668231a798035d49e782f65753a19920c493d949 |
| focus-stations | certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus1 | 8335a5251045d2e93cd6afaa9dbb63a6ee8e82a7d176d59a2122424454f99b57 |
| focus-stations | certified-voigtlander-nokton-60mm-f095-mft-zoom0-focus2 | efa48c25e865d81a950205af366e4d5250f287bd11f60f4676e4097d6c02c147 |
| focus-stations | certified-voigtlander-nokton-x-35f12-zoom0-focus1 | 5af3e685a9cdeb32482328a03ce9567a90ef46f80de5f95541f88b2419f1ee9b |
| focus-stations | certified-voigtlander-nokton-x-50f12-zoom0-focus1 | 05dd837665b76e8d1d9ffe7ab7e0437d99f7452c4abb7fda31694106915f6389 |
| focus-stations | certified-voigtlander-portrait-heliar-75f18-zoom0-focus1 | bec4e1245fa65a0c61b712caa096ba28e5c2b8c83bdd9bb12c3c85c8207b87f1 |
| focus-stations | certified-voigtlander-ultron-27mm-f2-zoom0-focus1 | c1d668465d6f4597b9711c5a5352ef1d0e3d2609373e70238596ca492463c4e9 |
| focus-stations | certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus1 | 699a701d3a494ca103a19ab20b0af40b4d6b2442eb7ad76bebc9ae4f3187027e |
| focus-stations | certified-yongnuo-yn-33mm-f14-da-dsm-wl-pro-zoom0-focus2 | 6977feb12c003abef29cffa6f8a5111330f51d2dbe8f526b5c32ecd6cf4ba8fd |
| focus-stations | certified-yongnuo-yn-50mm-f14-zoom0-focus1 | ed6e459641a35aade871406359f2ebcab7bc1390fefef6c0ee392a9d517c3735 |
| focus-stations | certified-yongnuo-yn-50mm-f14-zoom0-focus2 | 2ff0526dedc1d039188ca6f063ddfbe899a27232ca9c07f4de8fac3f4e87c2cf |
| focus-stations | certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus1 | 393954eeb4eba0528f30c818a623a629ef1e6939dc121a8da99c53ee21fc0a08 |
| focus-stations | certified-yongnuo-yn-56mm-f14s-da-dsm-wl-pro-zoom0-focus2 | 7b1b24be56aa9ef6b569f6cf213e08b7f11003d965438e58bf31602ac182064a |
| focus-stations | certified-yongnuo-yn-85mm-f18s-df-dsm-zoom0-focus1 | c76e47f2877fc163b73ec7fbd77c17cce03f9214b2e9ed32eba9a1ec9a870f08 |
| focus-stations | certified-zeiss-batis-18f28-zoom0-focus1 | 9c98d0c2b41e30c63dc471bd0e5a187c972f53d8e3377f489e73d7164eff5f71 |
| focus-stations | certified-zeiss-batis-85f18-zoom0-focus1 | a331ea4d3d83ed0b5901de80966bae3218b9c21d088e71130b34d74497f7cf89 |
| focus-stations | certified-zeiss-otus-ml-85mm-f14-zoom0-focus1 | 1e3c3ef09f59892c59b86d22c0d7e2ba112c942371d076a7e747e44839323325 |
| focus-stations | certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus1 | a2f8c45732b7b0e74e295ac1cb3c8224682babff8adc93ad0da91963b42ad430 |
| focus-stations | certified-zeiss-sonnar-35f2-sony-rx1-zoom0-focus2 | adb398c00f907f3e52fa9ac9f80ee320518e5543ea7a10b56a02f40519cd13f3 |
| focus-stations | certified-zeiss-touit-50mm-f28-macro-zoom0-focus1 | ffd2647be8fcac307519aaa69a04776a7fc608a46c4b2d6bfeab3bbe5bd7f6e9 |
| focus-stations | certified-zeiss-touit-50mm-f28-macro-zoom0-focus2 | 754f2b025e25a0d6f94032965861cba8f085b662c0266e0148d87060343c8095 |
