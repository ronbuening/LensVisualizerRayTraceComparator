# Validation statement

This statement is rendered from the eight baselines alone, with no engine, clock or machine input.

## Supportable sentence

On 274 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 1.2e-12 mm (gate 1e-8 mm), optical path 3.5e-9 waves (2e-5), geometric MTF 1.5e-11 (1e-7), wave MTF 1.1e-9 (2e-8); the benchmark covers six wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.49, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.0081. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

## Rungs

A configuration is one suite and named run with a case; the same state in two suites counts twice, and R4 in rays and MTF counts once. A configuration pair is two engines on one configuration and rung; a request pair is two engines on one request. Verdict counts count request pairs, including unsupported answers; refused states have no pairs.

The worst gated residual is the metric largest as a fraction of its own tolerance; zero tolerances rank zero at zero and a nonzero excess above every finite ratio. Each metric maximum is also listed in its own units. A recorded worst is the largest banded MTF difference across all pairs of that rung; set-aside differences of each external diffraction counterpart are listed separately. R6a measured request counts exclude fields set aside for phase step or convergence, even when the request verdict is PASS.

The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each rung.

| Rung | Compares | Mode | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |
|---|---|---|---:|---:|---:|---|---|
| r0 | Built layout, shape, aperture, index and sampled sag | gated | 309 | 927 | 927 | 927 PASS | sag.maxScaled 6.04e-16 1; focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28 |
| r1 | First-order quantities and pupils | gated | 309 | 927 | 927 | 927 PASS | firstOrder.maxAbs 4.32e-12 mm; focus-stations / certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1; optiland / ref at line 0, quantity frontFocalZ |
| r2 | Hits, directions, image landings and masks of identical rays | gated | 309 | 927 | 7107 | 7107 PASS | hits.maxDistance 2.70e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus1; lv / optiland at field 4.07e1, line 0, ray 745, surface 32 |
| r3 | Optical path, path to image and chief-relative OPD of identical rays | gated | 309 | 927 | 7107 | 7107 PASS | opticalPath.maxAbs 3.63e-9 waves; focus-stations / certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1; lv / ref at field 5.72e1, line 0, ray 513 |
| r4 | Comparator geometric MTF on identical rays | gated | 309 | 927 | 2751 | 2751 PASS | mtf.maxAbs 1.48e-11 1; states / nikon-z-24-70f4s-f5.6-best-ref-tele; lv / ref at cut tangential, field 1.66e1, frequencyPerMm 92 |
| r4f | LV geometric MTF beside replay with LV's own sampling | gated | 309 | 309 | 309 | 309 PASS | mtf.maxAbs 1.58e-14 1; focus-stations / certified-sigma-24mm-f35-dg-dn-zoom0-focus1; lv / replay at cut sagittal, field 7.50e-1, frequencyPerMm 2 |
| r5 | LV diffraction MTF beside optiland FFT and the LV-ray wave estimate | recorded | 96 | 288 | 288 | 161 RECORDED, 31 ATTENTION, 96 UNSUPPORTED | mtfOffAxis.maxAbs 4.91e-1 1; benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 10 |
| r5g | Geometric MTF on each method's own pupil sampling | recorded | 96 | 288 | 864 | 842 RECORDED, 22 ATTENTION | mtfOffAxis.maxAbs 1.22e-2 1; benchmark / sony-fe-400mm-f28-gm-oss-best-ref; optiland / replay at cut sagittal, field 1, frequencyPerMm 100 |
| r6a | Comparator wave MTF on identical rays, in fields whose sampling settled | gated | 309 | 927 | 2751 | 2751 PASS | waveMtf.maxAbs 1.08e-9 1; states / nikon-z-24-70f4s-f5.6-best-ref-wide; lv / ref at cut tangential, field 4.33e1, frequencyPerMm 50 |
| r6b | LV sheared diffraction MTF beside comparator wave OTF on LV rays | recorded | 96 | 96 | 96 | 95 RECORDED, 1 ATTENTION | mtfOffAxis.maxAbs 5.75e-3 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / wave at cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| r6c | LV, LV-ray wave OTF and FFT beside comparator OTF of optiland raw wavefronts | recorded | 96 | 576 | 576 | 381 RECORDED, 51 ATTENTION, 144 UNSUPPORTED | mtfOffAxis.maxAbs 2.75e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 50 |

### Limits and metric maxima

#### r0

- tolerance: aperture.mismatches 0 elements
- tolerance: index.mismatches 0 elements
- tolerance: layout.mismatches 0 elements
- tolerance: sag.maxScaled 1.00e-12 1
- tolerance: shape.mismatches 0 elements
- aperture.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 927
- index.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 927
- layout.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 927
- sag.maxScaled 6.04e-16 1; focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28; measured request pairs 927
- shape.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 927

#### r1

- tolerance: firstOrder.maxAbs 1.00e-9 mm
- tolerance: pupilRadius.maxScaled 1.00e-9 mm
- tolerance: pupilZ.maxScaled 1.00e-9 mm
- firstOrder.maxAbs 4.32e-12 mm; focus-stations / certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1; optiland / ref at line 0, quantity frontFocalZ; measured request pairs 927
- pupilRadius.maxScaled 9.81e-13 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus2; lv / ref at line 0, quantity exitPupilSemiDiameter; measured request pairs 927
- pupilZ.maxScaled 2.61e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus2; lv / ref at line 0, quantity exitPupilZ; measured request pairs 927

#### r2

- tolerance: direction.maxAbs 1.00e-9 1
- tolerance: hits.maxDistance 1.00e-8 mm
- tolerance: landing.maxDistance 1.00e-8 mm
- tolerance: mask.mismatches 0 rays
- direction.maxAbs 4.46e-14 1; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus1; lv / optiland at field 4.07e1, line 0, ray 745; measured request pairs 7107
- hits.maxDistance 2.70e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus1; lv / optiland at field 4.07e1, line 0, ray 745, surface 32; measured request pairs 7107
- landing.maxDistance 1.20e-12 mm; focus-stations / certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1; optiland / ref at field 4.99e1, line 0, ray 812; measured request pairs 7107
- mask.mismatches 0 rays; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 7107
- mask.rimBand: 0
- rays.compared: 6781578

#### r3

- tolerance: opd.maxAbs 2.00e-5 waves
- tolerance: opticalPath.maxAbs 2.00e-5 waves
- tolerance: opticalPathToImage.maxAbs 2.00e-5 waves
- opd.maxAbs 3.14e-9 waves; focus-stations / certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1; optiland / ref at field 2.54e1, line 0, ray 546; measured request pairs 7107
- opticalPath.maxAbs 3.63e-9 waves; focus-stations / certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1; lv / ref at field 5.72e1, line 0, ray 513; measured request pairs 7107
- opticalPathToImage.maxAbs 3.11e-9 waves; features / asphere-a20-photopic; optiland / ref at field 2.42e1, line 1, ray 815; measured request pairs 7107

#### r4

- tolerance: mtf.maxAbs 1.00e-7 1
- mtf.maxAbs 1.48e-11 1; states / nikon-z-24-70f4s-f5.6-best-ref-tele; lv / ref at cut tangential, field 1.66e1, frequencyPerMm 92; measured request pairs 2751
- rays.compared: 6781578
- rays.dropped: 0

#### r4f

- tolerance: fields.mismatches 0 elements
- tolerance: mtf.maxAbs 1.00e-9 1
- tolerance: sampling.mismatches 0 elements
- fields.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay; measured request pairs 309
- mtf.maxAbs 1.58e-14 1; focus-stations / certified-sigma-24mm-f35-dg-dn-zoom0-focus1; lv / replay at cut sagittal, field 7.50e-1, frequencyPerMm 2; measured request pairs 309
- sampling.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay; measured request pairs 309

#### r5

- attention: chiefLanding.maxAbs 1.00e-7 mm
- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 4.91e-1 1; benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 10; measured request pairs 160
- mtfOnAxis.maxAbs 2.58e-2 1; benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0, frequencyPerMm 30; measured request pairs 171
- fields.compared: 449
- fields.data: 0
- fields.flagged: 107
- fields.rimLost: 0
- fields.unavailable: 20

#### r5g

- attention: chiefLanding.maxAbs 1.00e-3 mm
- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 1.22e-2 1; benchmark / sony-fe-400mm-f28-gm-oss-best-ref; optiland / replay at cut sagittal, field 1, frequencyPerMm 100; measured request pairs 566
- mtfOnAxis.maxAbs 8.84e-3 1; benchmark / nikon-z-24-70f4s-tele-best-ref; lv / optiland at cut tangential, field 0, frequencyPerMm 100; measured request pairs 288
- fields.compared: 854
- fields.data: 0
- fields.flagged: 10
- fields.rimLost: 0
- fields.unavailable: 0

#### r6a

- tolerance: waveMtf.maxAbs 2.00e-8 1
- convergence.maxAbs 1.58e-1 1; focus-stations / certified-thypoch-simera-50mm-f14-zoom0-focus1; lv / ref at cut tangential, field 2.01e1, frequencyPerMm 70; measured request pairs 2748
- phaseStep.waves 2.48e1 waves; benchmark / sigma-35mm-f14-dg-hsm-a-photopic; lv / optiland at field 3.19e1, line 2, ray 987; measured request pairs 2748
- waveMtf.flagged 1.17e-9 1; benchmark / nikon-z-24-70f4s-wide-best-ref; lv / ref at cut tangential, field 4.33e1, frequencyPerMm 50; measured request pairs 690
- waveMtf.maxAbs 1.08e-9 1; states / nikon-z-24-70f4s-f5.6-best-ref-wide; lv / ref at cut tangential, field 4.33e1, frequencyPerMm 50; measured request pairs 2058
- rays.compared: 27128112
- rays.dropped: 0

#### r6b

- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 5.75e-3 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / wave at cut sagittal, field 5.00e-1, frequencyPerMm 30; measured request pairs 75
- mtfOnAxis.maxAbs 5.42e-3 1; benchmark / nikon-z-24-70f4s-tele-best-ref; lv / wave at cut tangential, field 0, frequencyPerMm 80; measured request pairs 82
- fields.compared: 211
- fields.flagged: 77
- fields.unavailable: 0

#### r6c

- attention: chiefLanding.maxAbs 1.00e-7 mm
- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 2.75e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 50; measured request pairs 367
- mtfOnAxis.maxAbs 2.62e-2 1; benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0, frequencyPerMm 30; measured request pairs 396
- fields.compared: 1050
- fields.data: 0
- fields.flagged: 216
- fields.rimLost: 0
- fields.unavailable: 30

## External diffraction counterparts

Both external diffraction counterparts are recorded side by side, with no preference claimed. Row counts include every requested field, cut and frequency at the last recorded sampling, including unavailable and set-aside rows; their classes and statuses are counted separately. Coverage lists the requested LV lines and the lines each counterpart answered, by named state and request.

The Z 50/1.2 FFT attribution is class method on the settled best-focus half field; earlier numerical and unsupported outcomes remain, as described in docs/z50f12-investigation.md.

| Rung | Counterpart | Configurations | Rows | Classes | Worst in band | Worst set aside |
|---|---|---:|---:|---|---|---|
| r5 | optiland | 96 | 6336 | {"method":2882,"numerical":66,"unsupported":3388} | mtf.maxAbs 4.91e-1 1; benchmark / sony-fe-20mm-f18-g-best-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 10 | mtf.maxAbs 4.59e-1 1; benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 10 |
| r6c | optiland-wave | 96 | 6336 | {"method":5874,"numerical":462} | mtf.maxAbs 8.14e-3 1; benchmark / sigma-35mm-f14-dg-hsm-a-ref; lv / optiland-wave at cut sagittal, field 5.00e-1, frequencyPerMm 100 | mtf.maxAbs 7.96e-3 1; benchmark / nikkor-z50f12-photopic; lv / optiland-wave at cut tangential, field 1, frequencyPerMm 20 |

### r5: optiland

- LV requested lines (nm): 470, 510, 555, 587.5618, 610, 650
- Counterpart answered lines (nm): 587.5618
- Requested fields: 0, 0.5, 1
- Configurations with banded rows: 47
- Selected chief-landing sorting limits (mm): 1.00e-7
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Row statuses: {"ATTENTION":295,"RECORDED":2587,"SET ASIDE":66,"UNSUPPORTED":3388}

| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | ATTENTION |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: numerical / unconverged; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | canon-ef-135-f2l-usm-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | ATTENTION |
| benchmark | nikkor-z50f12-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-tele-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-mc-105f28-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-mc-105f28-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-mc-105f28-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |

### r6c: optiland-wave

- LV requested lines (nm): 470, 510, 555, 587.5618, 610, 650
- Counterpart answered lines (nm): 470, 510, 555, 587.5618, 610, 650
- Requested fields: 0, 0.5, 1
- Configurations with banded rows: 96
- Selected chief-landing sorting limits (mm): 1.00e-7, 1.00e-3
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Row statuses: {"ATTENTION":18,"RECORDED":5856,"SET ASIDE":462}

| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | canon-ef-135-f2l-usm-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | nikkor-z50f12-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-400mm-f28-gm-oss-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-mc-105f28-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-mc-105f28-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-mc-105f28-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |

## States by suite

These are the states as the baselines name them, with their case hashes or coded source refusals. The baselines do not retain numeric slider positions, stop radii or image-plane shifts; those cannot be reconstructed here. The wavelength inventory is the union explicitly retained in the benchmark's recorded diffraction answers; other suites' per-line wavelengths are not retained in these baselines.

### benchmark

- Declared: 96; configurations: 96; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| canon-ef-135-f2l-usm-ref | b57c2bcd2ba8aa9225f9abe5f2e4b2f763b3d67d1e1dc2e29186a19c9f4d0f60 | yes |
| canon-ef-135-f2l-usm-photopic | 5a1e4774772748058756cfcb4d918aedab000c3e4857e484254fe6688c651513 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | 650612fe98b240e91dec4edb5e47d115fdfce934fa09cbe9e89f8d388bd3440f | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | b241011c9681597d858ca830bb42493ed5d2719b1aa8782269e0f54cde52c35f | yes |
| sigma-35mm-f14-dg-hsm-a-ref | 998482d4e947545c167134a7dabe3f522863dc7d7a70aac77c25a969b4b4cb5e | yes |
| sigma-35mm-f14-dg-hsm-a-photopic | c14175c93aaf26b52e4fc4beda725340d2a3ad3e16d0f5c089800fdb3fb965ae | no |
| nikkor-z50f12-ref | 861a915ddd7dd32d774e7b798745bc1395913d8f13482022482c7d083e7acd22 | no |
| nikkor-z50f12-photopic | 25e839a37b367ed1c9f7298f4e44f9fdb017645f73647e4f965832cb1d28ede2 | no |
| sony-fe-20mm-f18-g-ref | b67aae200c54706fe97387ca9c5db8e03eb6da1fc64ec823bc694939ccbe78c5 | no |
| sony-fe-20mm-f18-g-photopic | 9bf71fcc2c01fb1e7c25546d8b6a2758be33c6bba8fe4742ebcd3fbac72405d7 | no |
| sony-fe-400mm-f28-gm-oss-ref | 75e87a15390874d2073026d386c42123ec98635fe2a7cea25090bc53cdb7c7c5 | yes |
| sony-fe-400mm-f28-gm-oss-photopic | 25a3d0697df2ed6fe2fd355a06ce5f7a89664142dadd6e7d5e049d3bbc636df7 | yes |
| sigma-105mm-f28-dg-dn-macro-art-ref | e3849910ab68459a2090f3b12b9b794afebe02db8c5b10670925ebc2360061c9 | yes |
| sigma-105mm-f28-dg-dn-macro-art-photopic | c5a507024e5ab43f94adcb83c67c948a9731a2af72fed96ac5515f6eb04f708e | yes |
| nikon-z-24-70f4s-wide-ref | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 | yes |
| nikon-z-24-70f4s-wide-photopic | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc | yes |
| nikon-z-24-70f4s-tele-ref | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a | yes |
| nikon-z-24-70f4s-tele-photopic | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 | yes |
| nikon-z-mc-105f28-ref | 70d5a589da4a75279b54dfadf45fbbcc39aa6339450f697551548258d7821bfb | yes |
| nikon-z-mc-105f28-photopic | e492101b147bcf0f0e156d83376aba617d1c24f20cfdcf0d82b48a03f8b4a92e | yes |
| nikon-z-135f18-plena-ref | 449063f9188b52288817615c6d255fa02cff9c9e52e44157614d5714a37258ab | yes |
| nikon-z-135f18-plena-photopic | 9ac66541b918eea604fa81c70999f824029cc1d2d481851438f0d5d7e86d8224 | yes |
| sigma-45mm-f28-dg-dn-contemporary-ref | 2c3afcd18b34bc408c4aca84bae8c07426878b3bf2345520ef31a6d3f17632a8 | yes |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 6f62ee09c0c8b3a1cc345e3ed0e0e27aebea0ce5e96cdbee7664ffbab4914e73 | no |
| canon-ef-135-f2l-usm-best-ref | b4f341d96e9f6e711ecf326eeb3cdaf3602a856cdfba61ec965ecc71b89499de | yes |
| canon-ef-135-f2l-usm-best-photopic | 69d4e5172b1877156ed6cc172c99847863dea3900c1a4bba283471c1e9e4d77a | no |
| canon-ef-135-f2l-usm-f8-ref | d1fd0633e961ca14b7e8a890140c4d184c21a53e0969e4179e2f142257180fc7 | yes |
| canon-ef-135-f2l-usm-f8-photopic | 731871199792070410cbec4aca73816955e53384dc92b9d251361f507f9f85ac | yes |
| canon-ef-135-f2l-usm-f8-best-ref | 9181a5e3a48bf546f4561ba7bb1b9fb5de2bdf85f2f1080c60230661b568ddca | yes |
| canon-ef-135-f2l-usm-f8-best-photopic | 1edb8e349eae5cb693e7fd3aa842407d2fcfbaac26476210431b6eb4bec8fcad | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 52523bad0a00d71977e0eefafa46b9cda099b1324777dde14b699fab0c5b4b9b | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | d86d998c5a70e9c1fa8f9878a114e0860ac1d0a2bb3794a556ed637b05f9061b | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 30e4a4eec70f588e984e1210446b9eb671089990b41bdf7c6425457f870b4ebd | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | 0a789bcb488ae70bd153a4390f164cf24647a72b9508108f7a6635b81735cd3a | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | eb45ad15291d7f5e4556a8ab1655f8b325aa8433e5806470be1db9dbc663d1ae | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 8ed243d16650b84e33194bedae63bbe3b1baf12d708588a18f2ba2b3427735f7 | yes |
| sigma-35mm-f14-dg-hsm-a-best-ref | b4a6f51c4fa23fafe13e4831599380720723bdf259d0a718ab99a9448fe12aaa | yes |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 0b3e9ccf74b09ec83e23522124fa0542fb27466441b4bddd5179ac95a29d268d | no |
| sigma-35mm-f14-dg-hsm-a-f8-ref | 739496a530c13d6dc687e54df4e26ed81c7ad18ebfbfbd15cecdb6588bc9a26a | yes |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 431366dc2d1dbc2767592aecce4cce8c6e3ebe9ae457d488afd0ab39e901c0eb | yes |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | c043b8a737c3aa1ea98906f50cb49cfa2859223b634c2641a55a8410507da665 | yes |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | 6cdcf10137f8cd397d51d00afe1f5cb89a6f997a542cea149d48c8f4a47e243c | yes |
| nikkor-z50f12-best-ref | 13cd75d2e0891cf4ab4f2e8c006a7719cdd7721caa4dce11e1faa6ab1f70e8f5 | yes |
| nikkor-z50f12-best-photopic | 6e335d456db27535278548bcc6d44f974db63b0f65ae8f9252f5ab3b2aaddc07 | yes |
| nikkor-z50f12-f8-ref | b2e66abb6142cc758397469e55448599762d9712ba3d6cd768f8cea13b336b92 | yes |
| nikkor-z50f12-f8-photopic | 97402aca20f0101b3bfcc039f1cd45547794bd302bc582f837cd86ea56658584 | yes |
| nikkor-z50f12-f8-best-ref | 359dc743691cfd7a56b445301c5703d5ead4e6fc68863d5faf7c5d386acddfa5 | yes |
| nikkor-z50f12-f8-best-photopic | c557755be3310618f79fba94e12eb3cae909f6784afb8b8d412dbeb156d35870 | yes |
| sony-fe-20mm-f18-g-best-ref | 469d8f48aaac16ae2f6e2ce67f033e9eacff42111d6b3e1c1eb2c6450c40fb3a | yes |
| sony-fe-20mm-f18-g-best-photopic | 8d1ccf9e5acdcf3be6daf5353b1f4b36ea8d1a2d317177447abaaa36bb9070ec | yes |
| sony-fe-20mm-f18-g-f8-ref | cd2d5eb4481fbd7b01ae526b4808841fdcb6467f04d85b0cc0e040b2d2955ce0 | yes |
| sony-fe-20mm-f18-g-f8-photopic | e989fae172bd203a3b2d51f1ddffbd17d364aadf4e801383aae83b5f778aae52 | yes |
| sony-fe-20mm-f18-g-f8-best-ref | e169bad1480d89fff330c5fc66e0d06dcb23e767ffd4a9c0a14159caf68abb5e | yes |
| sony-fe-20mm-f18-g-f8-best-photopic | cca38982ae4220225ccf9dec2ea690c58629a4334c81076b5626860f736d7ca1 | yes |
| sony-fe-400mm-f28-gm-oss-best-ref | 321e4ba0ce5c220609a55b35ac8a33079ccf30c7e3258a67ec1463edf2554afb | yes |
| sony-fe-400mm-f28-gm-oss-best-photopic | 432764ba66f320c6af37ef4906a016797499b5310599902028721d470024d9ea | yes |
| sony-fe-400mm-f28-gm-oss-f8-ref | bdba0ea2e9d167e31d49a03bd99c873d71bc7945b8b646ac3cb48b4710a872f2 | yes |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 5f85630002361a665e23772e378113957d44c6359ea572fa01c761ae4d2fbf51 | yes |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 93e98f340fb7f23d10d90375c3c3953cd5c871e2867247ae73e24e3fa40b0e6d | yes |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 2d91ab3ecb073567986f4cf5de5e83bbdcf61ccf8e9554cdc5e8e9f254947e4b | yes |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | f74812129cc4c7918a44f8ec7cb6ce9882367b23bc0d991f04712a7e6cc9206e | yes |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 3b68693f0aed670f4c8b9e652233d6bd9a14812a7d9301ae9efa867558dbdc39 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 58eb582de9ad963ec75ab5f5009ec8889068ea50be5cdb6da32ac6d23f9c6698 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | dc4dfa9211345eb02410bab772dae7de3f2796998d617b94b0f727c9c7928c06 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 5285ea322b02f0fd436d12c9cd11c5e1abde75282625e1351b4d7c57d2f7cdd9 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 9206ace874fc53d400781e67b497a2f70ae09367beb54a55edd489cc8b012871 | yes |
| nikon-z-24-70f4s-wide-best-ref | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 | yes |
| nikon-z-24-70f4s-wide-best-photopic | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 | yes |
| nikon-z-24-70f4s-wide-f8-ref | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba | yes |
| nikon-z-24-70f4s-wide-f8-photopic | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 | yes |
| nikon-z-24-70f4s-wide-f8-best-ref | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 | yes |
| nikon-z-24-70f4s-wide-f8-best-photopic | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 | yes |
| nikon-z-24-70f4s-tele-best-ref | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 | yes |
| nikon-z-24-70f4s-tele-best-photopic | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 | yes |
| nikon-z-24-70f4s-tele-f8-ref | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db | yes |
| nikon-z-24-70f4s-tele-f8-photopic | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf | yes |
| nikon-z-24-70f4s-tele-f8-best-ref | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 | yes |
| nikon-z-24-70f4s-tele-f8-best-photopic | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b | yes |
| nikon-z-mc-105f28-best-ref | c83e32a7f5c48ad358d471710d082e4a5fb745e7baae2c989ec4a957709a8bbb | yes |
| nikon-z-mc-105f28-best-photopic | b97782bbacd99c048ee69ac0d41c84639999e363374ce87d570d501253b5d594 | yes |
| nikon-z-mc-105f28-f8-ref | 904ae8663e1e238175e7d632b807c7b9efc4ab69381a92b0613675b2dbc891a9 | yes |
| nikon-z-mc-105f28-f8-photopic | 56a7dca87fd84d7f382a68e33acdb1c4f58f4afcec119b09ae72a671b836ff83 | yes |
| nikon-z-mc-105f28-f8-best-ref | d31b3e7efcdab37966e8b8135217738e6192f77faec1b974d94409d648accd72 | yes |
| nikon-z-mc-105f28-f8-best-photopic | 05c8d34726e50ab941b4d2caa0a807a96d9077dc3777e4fbb0aa8989c5f6a476 | yes |
| nikon-z-135f18-plena-best-ref | 0c9e2d7b9f2923c21fef404d7b86f7e31456364f77a5f300a13a06219d4add72 | yes |
| nikon-z-135f18-plena-best-photopic | 45ff06bb22f2b3d5be84433c71a1a6e7c4851c4c4d88c3770a88edc0f7922998 | yes |
| nikon-z-135f18-plena-f8-ref | 7f0c3394b7c516d1ac234599e678abe8497b7cf9931f1dd3887a7869e8a703a8 | yes |
| nikon-z-135f18-plena-f8-photopic | f060b855c73e9fb5b18b34e4b1122c30b2beb3de00ca30c00aa4be509825b324 | yes |
| nikon-z-135f18-plena-f8-best-ref | d4eca6fef5c902656e4eb45b1542385a3a1902907993d85a65365ff0d997f6ff | yes |
| nikon-z-135f18-plena-f8-best-photopic | 95151953a4343500ecce7683fbc710f87c1192f0245ee6b6de4948dbc4608652 | yes |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 0f2591032f4111cf837b08e5e70899199b943dfbe2e54ff2469d14fd9b70a7f0 | yes |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 8a471dcefb12901a1bf45cd2083cf701fcd4c20f6f515944215f4427e7c2f5cf | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | e44ac8f3c84fa88e4f62f0acd044815be365d1791d98ad87744f5c12e8eabc52 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | 34789d7b42b8949cf70123383a08237a20235661e5236fdbcd46d27bd2add967 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 952ae77f90fd93161c6e9e1d307c8b2289770285efe2d2c42c56dc5a5cf47c5a | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | 055522122a4c925fdd18f5062abd08ad34585b1567e670ad9591473bdca1eb53 | yes |

### features

- Declared: 18; configurations: 18; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| odd-asphere-ref | d24ce91f200b115d1ef919d9fdb14b4db87b5d67f8e38b63efca3cfd91ddf4af | yes |
| odd-asphere-photopic | 7806b61397ee501f285caf4f1cee9bf1c6520ae4c3d7c7ed0d00d64d1330b84c | yes |
| e-line-ref | 0b0f82fadbb79be999e3bf439eb67044e620fd05941e7346e67e99d0a440171d | no |
| e-line-photopic | 147b9a91fd1155441f1c4bda4f92a0ca16457f7b650bf341c21516c9ec0f2085 | no |
| asphere-a20-ref | b10db914a934de3a2a074ccd8d938e8f5a15df09bbbe41e90b3adfaec28de5b1 | yes |
| asphere-a20-photopic | bf3df7707349812ee033cd33587c2f90c050c99a1001e2839d5c2888f974af03 | yes |
| flat-base-asphere-ref | dcde783cdad5fd68c9aca52a808241a3d436c3f568576b791de8acdc0fd5f030 | yes |
| flat-base-asphere-photopic | fcdcf3abb8bca96c84790765c8597cb12447c677ef816fea1dbb4791acc9283f | yes |
| rear-plate-rim-ref | 31bf486acface061c777c104e2acb25e14f899a7dd2988b63d0838c8e46fba92 | yes |
| rear-plate-rim-photopic | 1c3b599816216a48f77fdca17950cc1778f026df247f0e841775a49f3f5ba71b | yes |
| fixed-iris-zoom-ref-wide | 4db46962ff43d333cab4430dc739c4afd7e77824ee7f7b12e37169b0be3111a3 | yes |
| fixed-iris-zoom-ref-tele | 15567bb5f10f9c71fda356870eabbca30ac1c4c693c8e097521b2a4308432b72 | yes |
| fixed-iris-zoom-photopic-wide | ef0e8df77391e0901a3d905eb1ba9da7390eae43bfdb4b7f94075ab244e0163d | yes |
| fixed-iris-zoom-photopic-tele | 203606c1bf1df23c8dc24ff146e9f31034a62bf5d1d627df8122ee51163641ee | yes |
| zero-asphere-ref | 7ecd42d1bcf433bc492fb0eafaae81190c604a9969bb0b9b867682ba13b421be | no |
| zero-asphere-photopic | 82a3b8c74b22a95f865dccbbc82d17404a7b7cd6724f9071ccd2b0c31d629bd1 | no |
| stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a | yes |
| stop-inside-element-photopic | f8181409b90487e9e7a2dd156ecc9ec1d021232fbd2a806a52ab5cefaff96377 | yes |

### states

- Declared: 128; configurations: 128; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | fb6313aafaef4cc6341c86d507a91837b5deab4417ccdeb699274d5ec65de76f | yes |
| canon-ef-135-f2l-usm-f5.6-photopic | b8452374e399797318f5bf31060a91fb510a16084a5afb3e6be6ef13063496e6 | yes |
| canon-ef-135-f2l-usm-f5.6-best-ref | cfb40db60c1920a71df2e3577d416c7c11811ad983785f4a3d7c2d4f2ed45d2b | yes |
| canon-ef-135-f2l-usm-f5.6-best-photopic | c24132ee4a6e88273a15fa7b038580d6af34b73039befbb7e08e041efa8d574e | yes |
| canon-ef-135-f2l-usm-f11-ref | 3538c790a1ec7344597b37548aec69a2df46fcb828795c1bd678079a9ad78dc3 | yes |
| canon-ef-135-f2l-usm-f11-photopic | 4b3888e3e44135a6341be52a170ef25e8f6613cfc09ea3338aff49182f2eb50f | yes |
| canon-ef-135-f2l-usm-f11-best-ref | fde75efe0d80ad2af8615df46ff798a3e3bf044409d58bf1a3e6271068eb31a3 | yes |
| canon-ef-135-f2l-usm-f11-best-photopic | 14847603e9b8882bc6969d619c27ff6639819038d8057f8c7863396cefdacad1 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 11fe04d53f56df0f4217bea7f1df0135e80ac3aa14b3ec6a13c163756b00c748 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 69f407ac3545cd29f360a84f86feb767647b5e08e0a6779f33da5e4b376d278e | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | fb61b013bd83b38b13284163754deed2b37a7d26ad84ca1fcc3db9ef49b1e0c4 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 958bf2882dfe47a5c55bc24b117e7e75139fd4ade2540a30966e262c0ad79e11 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 7c3073c4e7dbedf0705593abf810e4d84fd34d97d7903728a421926d55fa4dc4 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | f0f53b7a7c65c33fe10be69f5a2299f0490464845e77d681fb48f2bfcc10d3c6 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 8cec235dbb1353ecce18595c4106e7ca14174f1935bfc6ac081648abec9e23c8 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | df390f5440cda651600b10cad6ef60995d73c6561661120e2d5b08cd319ad60c | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | d697f32194b1ab48938fa6c330f96591bd77db9ac21e96e0c1ea8132c4c2ef3c | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 5b202930c7dda4b6795a60ebd2fad6f263e1c5e83b405c450763a7eb502201be | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | cf9ba22bb4b5f5bf556a3e643dbb2c6181e3e30f0c9926fc6500a9b95e649948 | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 6520f64ae1c8802b4576f4ed4a716e119a6b2b0d14f972d490a2a35f44201181 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 40785d2e0c725183d5e2e44edc8b24972bc72b99c5c3d6e2c202d61530a13cb8 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | b27674ee8be7e06d18f990d3d541b8b636a5e100bf7d8db396bada22c5c0cb87 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 61ff3c8c2377dfd9a8075c75037b091e2d0a4da435126f81f12852a3f577b38c | yes |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | ab907beab4a0590cad0157f85742779e5a7a3b3747964c85eaba7e49b694d70d | yes |
| nikkor-z50f12-f5.6-ref | 93370aead6b9eb8def155ccf5f3a8780f977a3fda62560f1c44406cf3a1d7ceb | yes |
| nikkor-z50f12-f5.6-photopic | 385c7c1d4e996fe30b06b3b3da60c5369b24e303e5504e9bf3a35a18c75b6116 | yes |
| nikkor-z50f12-f5.6-best-ref | 40adc9d9360db7791e21a3b20e8c0c833654c32f19427a958dd20aced28d9ebf | yes |
| nikkor-z50f12-f5.6-best-photopic | dfbc55f21b5bfdb94d025914183cf2ce81cae65921e142c50dc28881c41a97df | yes |
| nikkor-z50f12-f11-ref | 1a34a84b12ddaa766ccc173f659f2b44483089c9560aed71cf85aad1528b9335 | yes |
| nikkor-z50f12-f11-photopic | 54e397f8a3a165bf4289f3693de28a55d2d298c6b39859466d80e9c30bdba7e3 | yes |
| nikkor-z50f12-f11-best-ref | e230a19defd0b95cada536016457031dac54e94566818a5c97cb2e8295bc18ac | yes |
| nikkor-z50f12-f11-best-photopic | 00de2164a93bfc177a1e6b974b04656629fd4f9983b109f508a59969ef3209b8 | yes |
| sony-fe-20mm-f18-g-f5.6-ref | 032904853c0718dd4654541b6a26e293c3d584c9cc75b880e3327126e0f62550 | yes |
| sony-fe-20mm-f18-g-f5.6-photopic | 90768dd4f9cff94d6b4d1e8e89aa47b0fa795942082c1fcaa378b7e49c8c6b30 | yes |
| sony-fe-20mm-f18-g-f5.6-best-ref | 6a018b55d80117d42be3a4b4cd945b3c0930f9544519c314aaed262281e346a2 | yes |
| sony-fe-20mm-f18-g-f5.6-best-photopic | be213450ef3ba55cb97f2405f03cbe45eee22e9c339070562f09abfa44417bcb | yes |
| sony-fe-20mm-f18-g-f11-ref | 66629bfed7b0cb8ab55ac7d50e6363ebefaa1922a52a3915db2e38f86de2b5be | yes |
| sony-fe-20mm-f18-g-f11-photopic | f39722550d38b131d139e69c2e44e3e9dc81360822868e20e3019c23c2c64fff | yes |
| sony-fe-20mm-f18-g-f11-best-ref | 14626b8ab553320b14dfa90cf59ba2bd7b6b433033a0db1169424e5e61cea556 | yes |
| sony-fe-20mm-f18-g-f11-best-photopic | 91ab7e1b2e0a399a56c029c125fcf2ecb64abf78f33865037852fe9eab1f5dc3 | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | cfd2f4b05ff511406ee2fcf6445bb368a1e65da0aef98100ce96e52afd7ee8cc | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 831d378e9ada52a0fce8d30676e13de4ca0529c0ae031a271b2f38a1348cbe92 | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 7978e8b6317cb261a60c5258a804dc0819ed21ec238ced93389bbed06f7820c1 | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 7d9377f6dfbb1db84d432d50fda201c28438d00c0c22b75a8c776e16e9e3b393 | yes |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1a94040d1d518dd6202eb3867b88ddfc677b2127c68f0e0c14e80f86628c70d7 | yes |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 0a597562d6a7ba2141c992046ef765f2ae5a0e8a3c5ab32309f274d58961e5ab | yes |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | e8134f174ecafd2430ad50cfb2ba0d0166b13d1551f90aa9d8ac0ffddbb9a459 | yes |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 96bab879ff1b51208b31b3a7430f275fe19da370173d3ebbb626ff44879c27bd | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 83bc7aa668f82b6b22a13b1acc5b0f5af9ce2968947f11528dea3c0fbeef39e9 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | bee392758ecb32390004f98f6b12fd207c2819f3295a1c09572706c61e9f8a78 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | ace750e815937160ee6fb3ca0e4eb1171b25e239d6417acbed4fe523a22999d2 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | aab2ae39c1bde91b1bfd300d5a037d36ad1c6e728ef18aa1332875a69644862b | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 849578276ae0917f9e2215c51c30145952bb7126cce058be7687a974b9a8dd4a | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | e11209865b09b2ee83b249eeb30292b09385d4be43874895769ea5030815dd10 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 8216f33f93629b810fa907bef02c40e5bcd420baec4ce1d6c8a81dd3bb7cffd6 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | cad5d2b8147f295b805debf038e32279cd8034cf4c2f7e8fae16d195c0724c44 | yes |
| nikon-z-24-70f4s-f5.6-ref-wide | ca4650a2f1cab8126617b31e5e196328c9e6047662925528c44d866fe77ec229 | yes |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | d6dd88710ac133d194348fdebe5810d09477eb6d54d7d92c5a43b78d42913ffc | yes |
| nikon-z-24-70f4s-f5.6-ref-tele | 8b15e190d96badcfb4ffa2b7d3f4cdb4f140a3f73afd80711ce385e7b298967e | yes |
| nikon-z-24-70f4s-f5.6-photopic-wide | e5c579f82819d0fd17bab9b165a0d68268e3277d38c601955fc2454ca897f119 | yes |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | f3c166adc1996382f804c64643c8cf33410c689ded36162fc394be6b97c998b9 | yes |
| nikon-z-24-70f4s-f5.6-photopic-tele | 931e283aaa42145afd364f3f3c3151db6f4d3fff9e17a11a221670001f510d17 | yes |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 534c54ca70f1030921493f470f9ee0d6a3d238dc3cd43dc509c0f8687e543ea7 | yes |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 672c59fea97eac2518485a560ed393242b1d93aea8dd8eb924af71026aad071b | yes |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 44724094bec9dc249b2d0587cd4722285afa329dc7ed3247d80487c9bf044284 | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 372038f23d287d7729c48ac2a25f7d3063cf9259c9373e3d3cd9634c822a03fd | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 2d5f17c805d756e7c3f19e592c2ce7579ff815aae1622cc5fcbaab7822011cbe | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | da4a032bcd346477d4a2b163b9649d4c74d1418c7e149a6dbdbea0522ee7b1f7 | yes |
| nikon-z-24-70f4s-f11-ref-wide | a9fc28dc90bb6ec393151512c95cd9bbed404b4e7aeb6110aee02edda8728dfb | yes |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | ee0b49410666fe2b115167d3da9eadc492967c802f4457c926b117aafe491428 | yes |
| nikon-z-24-70f4s-f11-ref-tele | dc0cc7f4f4644e267e862cc6f513fefb957e91c401cd83910f1faafbba1851f1 | yes |
| nikon-z-24-70f4s-f11-photopic-wide | f9c46dad3bd50217adca4144a3c1685011d2501a69a8bdb43d036d6159fdcb82 | yes |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | ef9cc2d09aabd8f2df0079079e7dacf171bf68a97c3c9fc282e70a956ebbc50b | yes |
| nikon-z-24-70f4s-f11-photopic-tele | fce6bb24cd7ccf4a3348e9e142978fc681e2825120e5ffc4340b003c2396da9e | yes |
| nikon-z-24-70f4s-f11-best-ref-wide | f286f2dfaa83049a3d5591572f3e47840cf0032e6287523202de250b62561b1f | yes |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 43c74496798ae9506b5038882eb2fe2fc934ecc74286ea98fdea22129bc9db3f | yes |
| nikon-z-24-70f4s-f11-best-ref-tele | 86e79118d05b624fe13b031ef8c4cd8440be28a8e1bff83babd4d8424dbcd0ac | yes |
| nikon-z-24-70f4s-f11-best-photopic-wide | c9584523b47f693df0290b83b8b3ab63132e80dbe34e18a859114d18d4f42221 | yes |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | b618c6a4fc165f483f15a9ffe70b01d7c219b7bd22cbfe9a0e436fc6e275bb27 | yes |
| nikon-z-24-70f4s-f11-best-photopic-tele | fb30f78b0ecd7ccb01891e21c74d1b182e1237ff34e092d8918217830fcea6f0 | yes |
| nikon-z-mc-105f28-f5.6-ref | 817dcdb72789e4f19aeb0834fdf38f2df1f9981feeda0e849a6fbe878516246e | yes |
| nikon-z-mc-105f28-f5.6-photopic | 84c9c5f86529a56eb59c98d9699d5ceabde325d4dfd0135ea13b231a7e19947f | yes |
| nikon-z-mc-105f28-f5.6-best-ref | c083a9ad451157303b51e15cc837a6458e778df9940e23c2ef9b74bd6a6d67f9 | yes |
| nikon-z-mc-105f28-f5.6-best-photopic | eca0ec2a6833ea0a6ff84fb4abb54d35c8f0884779586cd39085eeaf2d62a0dd | yes |
| nikon-z-mc-105f28-f11-ref | c7f1b99704f56d90a1f686179860d380dced25c8cd033526fcecd4702519f9e4 | yes |
| nikon-z-mc-105f28-f11-photopic | 89aff2fe03f9a0a39fb0c4bbc056824d10cf57309e3b559a660da10dee6a9f76 | yes |
| nikon-z-mc-105f28-f11-best-ref | 731774161533fcf291c1c1269e0e88539a0dd9e65da2ae8f74753a0b5ca2b774 | yes |
| nikon-z-mc-105f28-f11-best-photopic | ae84db3c87b9edba7b3828e4921efe3eb322811fd888ce54fe3f5a1d583abd10 | yes |
| nikon-z-135f18-plena-f5.6-ref | 2f48866c86a5c78c9d9985591e3093550306be61ca1b1467ece2a6624837935b | yes |
| nikon-z-135f18-plena-f5.6-photopic | 158e1ca33d4c80e41a7176d144ce4462055ecc078db8065a1e7efd3b541b9a4b | yes |
| nikon-z-135f18-plena-f5.6-best-ref | 360b7b852f441111c8d5acb454934d8d59d4eca6b658012be793c9e01569543b | yes |
| nikon-z-135f18-plena-f5.6-best-photopic | b0a31528f934800ab842ca760d487916e75db648fde6dd0283b9bd01be5f1863 | yes |
| nikon-z-135f18-plena-f11-ref | 9370a359110296269721cb8c84b7071d063f75cc1e19f176fc6e2e3e747090cf | yes |
| nikon-z-135f18-plena-f11-photopic | f7d5ed81109323d03e7cabbcec21709cb2ab62c8f37cde1fdbf26f38a7f0334b | yes |
| nikon-z-135f18-plena-f11-best-ref | e6cc666f0c9c00122578523ed519d8b34a1e9dff2427209471960455699891ec | yes |
| nikon-z-135f18-plena-f11-best-photopic | 074e0e4a6c56b4a12f20042d69bad4350e9e7dd8b535d60c0e0616a67be4f882 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 199c2510c32fa327ab1821e2fab7968e7ad6a4bb2b9a9298f59fa94887b06bb2 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3b787987b0523c174ae63e6af6a90b3d6dcfe4209652fd059e3648e5c37110d8 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 8471bafaa095d48e703f204c34d8b0f411aaa31d1f1d70865eb3772e019aacbe | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 0707769a9b97ca9e568da11158f9c6b0510d96d06b860c7348139034fa593d97 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | f3fcc3b63cd7c8c3a567b5f318c8a9dd3e469e78af15979fd5edb6778d604839 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1da493f139dea309fe55d78925e539663d88b123a25265afb55d8c454315f1d3 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | e8b060aaeb44cba02d576fc44c9725a7bd44cc6d4adb173931ddb86caf196c9b | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 2e4db53842a8d8cfe73ba2f2a6fa0dd5b6e72515eed989fa6f6bda3dac11d4b3 | yes |
| nikon-z-24-70f4s-open-ref-wide | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 | yes |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 0c1e3e17b791b8b76cc5311d51e8dbd6ad9592081d1f4e853b775cf8253d1f53 | yes |
| nikon-z-24-70f4s-open-ref-tele | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a | yes |
| nikon-z-24-70f4s-open-photopic-wide | 1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc | yes |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 7d159e41726968a2d56b1cdfce31279b854f316d34d0b1fcc3fb2603407882ae | yes |
| nikon-z-24-70f4s-open-photopic-tele | 7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33 | yes |
| nikon-z-24-70f4s-open-best-ref-wide | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 | yes |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | e96a55399921f347d7e4cc74cfb6866870a4ce088279506abff48b416df2f370 | yes |
| nikon-z-24-70f4s-open-best-ref-tele | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 | yes |
| nikon-z-24-70f4s-open-best-photopic-wide | 308ca6f63558edc3dfd3df66d19251db71c6a1b4979d1c8bfacd90078f058234 | yes |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 167b20f99438e790211ba3b18cfc3484e6db92e7a3c4d3f83e3644d08704b87e | yes |
| nikon-z-24-70f4s-open-best-photopic-tele | 0b6c7a63d711ae9909429895f395bd491939e5b1a569991aa3974b8556a59400 | yes |
| nikon-z-24-70f4s-f8-ref-wide | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba | yes |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | cfe08daed58c95d06787698fb20876419f0d64aeda8b760fcb3c39f5892f1a89 | yes |
| nikon-z-24-70f4s-f8-ref-tele | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db | yes |
| nikon-z-24-70f4s-f8-photopic-wide | 4a7d855215279d3737eda8a3761e8a96a0092ad3976155196b8368f3a728df56 | yes |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | e8dcb7a4c161cdf893e35068d743936e001736696a42d5ece8d19551c4d1d4f3 | yes |
| nikon-z-24-70f4s-f8-photopic-tele | eaf4a65d5a26ba10c6052de8f026e23ff153a7fe64965ae26873a42f2d5c5abf | yes |
| nikon-z-24-70f4s-f8-best-ref-wide | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 | yes |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | c84d1fc5b9e9daa5909cc2530a508854046daba2153963653f5ff7f42ac3bdb5 | yes |
| nikon-z-24-70f4s-f8-best-ref-tele | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 | yes |
| nikon-z-24-70f4s-f8-best-photopic-wide | 938ab6f33460ce88478c7d5a7ea39de507459d0703fc620702aac11bf9cf26a4 | yes |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 8466fba19f559cbb012fc31dd8927bce9a4cb7969288ac043407b4ba7104c28b | yes |
| nikon-z-24-70f4s-f8-best-photopic-tele | 82f3d997a588bde6567ed9b36cdbd4cd2e5596158b253346ba7258e892734e3b | yes |

### focus-stations

- Declared: 69; configurations: 67; refused: 2

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| certified-fujifilm-gf-110mm-f56-ts-macro-zoom0-focus100 | fc71d244aec38864b73ef8750cc52141357ae769fe4d7ea80b387b46ff1a8e55 | yes |
| certified-fujifilm-gf80-f17-zoom0-focus1 | bbd4687c1f32e2819c4015cfb440908f2747d442e89dd218858a35f71743bad9 | no |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | e92c44ff169ec871c921b962020b502aabf40e71a8bfa6b0e41956ea10f0b00e | yes |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | ce632d6fe72f4ec5daa7775f71f8298fe22684b6c3b9829f1acd927901c5e613 | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | b0f8f5466dfaa4f6b686d4163d2df66174f23018b6842d90c6c4ce65e012e360 | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | e05ac48d6f62767ab2991094e24729bdc873f47fc38773f94ca29503318d786e | yes |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1ffeed7214f4c219837b85a1116192fabb1e72ff66cd098ede5710dd840281a8 | yes |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 9276015f4a09ae0df05099a0725962e7d7fa25e98db611b456bf45264207fc15 | yes |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | 8270906e01b3faca8ae4a642653a0f2f6bbf6c56f6ed124c25e85fe787091421 | no |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | e2778a011e81560e6271e675f6844482a66b7f3ad247d8746d3215ec4c08e3fe | no |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 673095cfc1f5665f4aa891be77f7cdb2eeef2dd706ea2d7769ea0e15425e4eec | yes |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom0-focus17 | b3794c6c5924cee466179682391e442c92d6fd70b1e0ab0b6ac97082d0b72852 | yes |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom32-focus17 | 0659c248d82dbf06c5521831ad34250a06d1f1b22c927cf1597770b0b227815d | yes |
| certified-olympus-zuiko-digital-ed-40-150mm-f4-56-zoom64-focus17 | f2ba46d7a8b2499a6bc7da15228827704f359e024db844b8fabb06c81d014ef9 | yes |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom0-focus1 | 874854625cf1dd589f47f331895c0b49532f902a20bbe796f268e2024ce7d9e3 | yes |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom16-focus1 | 99b6b35e6ae7faa9b94ac06d2c115bb160911667f256de438f8697ea9233b9cc | yes |
| certified-olympus-zuiko-digital-ed-7-14mm-f4-zoom32-focus1 | 568f93341d119dcc2a9f1949c2dcfcc3d63f99dc26c391280a71e591244fa8d6 | no |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 72842c3de154ccbb801450d8cbfb7800f0ec613c5773ac45f72186384e60381a | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 617deed34e0bc25befb3e30cb9c900e56525459a0186c7ec769967343f4edf14 | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | db455dd71151e3a29c1df1c0c947b229ff79eee1068aece790b732b3c16f3979 | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | cfdaf3f52ab425d4ee0490bd4bf40d7a91a37615f02c23c3749d3fce68b4622d | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 9876f2f2d40b032687ef30fd0b77d64b7a3d678c0010822ca3458e440d0d8955 | no |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | 53c5ca7e688cbf9f0983edcc98da88609e0868a5b88deef5ce559d2fa68766d5 | no |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 | yes |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | bb47082c2e9124e55765678231442de72d55ad3b834333c85b8837cf7f9ca5aa | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 1cf221df7808f788a07cd99f50581d1a29e85ab0147605229fcdb98755391574 | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | 73f942b93db286a48d6488b9326160e626b44540779630c68107f2ccdecdcdbe | yes |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 77240b3249fc2f96cae82d1c5932f50dcef934088dc2120589ed64b46daa3b0f | yes |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | 02dd902ccabd7e9efddefd7cf52710bb38253debd4b731f861f8cc74e4fef217 | yes |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 22f573c4dcca9f77d238821d35ca62ce41661714c27dafce162fe79e5c759f23 | no |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | eeb1536ebab034372569abe5359886111aae56eca2050eb0801d93c8c1e67dab | yes |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | b549e5c3c090d253532f2bad999fb5293fb98117f7a7588ef80b18423f0e66a2 | no |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 894debefc6fdb16f1ab38c6055c2fb104509070cfe07cd49d9ad4f8bc92fbd76 | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | e3c1b9c0842d88e4bb1ea57ece875089e1a6de335469b227438334a9f4a6016f | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | acd7822027052cc1952f100f7114f829f03335fe258f4f7cec4b41880210e964 | no |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | 11e8a91c1e7e9666e6214e8dfa9a071aa95c30b044aa47782b4e7f85afc12bae | no |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | b0be2f20e5b95353f9377fd656f14c691282d42c2e611dd69986cfcecb4b85e2 | yes |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | 9aee102182725025ed61069c4cf367e7cebed4d547743098cb34574dfd66eaff | no |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | cf90a40810f02e10d4a3f936a8edef233b88ecbd3a6ee545eaf703df4560b90b | no |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | 17d8f3a57a99e1785f48b4b99a93338c1fe926853d879f06d38255370f1d221a | yes |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 851b25697188fac9d7e726bebd0f012893d277d9551e858f7d1dca682ecd9736 | no |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | 62d4f5600679b10f237e8aa57b30967f59bb7bfb16b5a7a4d351fb64dc84f4eb | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 3a6c0b2f69addb626038c0990440dde5ddee0abfcb44a8e595df75e5589fe065 | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 18b137c95a0dea4adf0bc6590a8f3de81c6d67565837d10fce7c60af1a18a2f3 | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | b4a9bef13532c7161f7793a1ecf28c9cafd8b539699dd9d40995b0a468bb9631 | no |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 4c007de74973def2a32965907541cdd909b081ff8036fef4dde69926c5498cfa | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | 827ce23a9b1f784a4b5c4dd72bd345210bc4f7ae826b576e158c4b22bfb38ac4 | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 88fee4e84777e7181151c3b0a912d70efc6652ccbc666ad44e1fff00ce7865de | yes |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | 10bff0b1d82d13878aac8613719bc9056478c7706a675c17b4e2cd8e7f9de763 | no |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | 22198c5be871fa98cbbb32e8975a4030730a7894a5e8eb7bfe84328a92f0e7bb | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 412e617abaf928fcecb490c55b259bf98ca4e1182f4e19387b828932e214cf6e | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | 2e6f278dd2f1ec94b8db751221aa4ac992b55806dbb29b96094acb085c3b4e11 | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 61751a849d977beb5339e3ab0862718565f1ddf41ccb909140895b7cfe0037fd | yes |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | e66d7ce98eb7ba9e080cb5247736616f8a44ddb243f3336b537bdb9343b9346f | yes |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | c4cafe389ff19f2b3ac144e21ca3a2ece14048ff1d29f1bb6524fe0babf56aab | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 7cdedfe0afa1f9483af937f9046fbb2ab00c5bc46d01efdccf884970dcd7f325 | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | e29835a068866e0eb6f0b139d64a7097729dbf772bb0e5a01721d000d453e978 | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | a6a31446c8e77964319cfd9e664e1bc596c7dcf7d071707a5f2e609934b6492c | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | 2d27265e6b0031b00246d0f1424a01e4261bcadbe57dbe32dd1a87eecbb79c04 | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 5eb9db0466b9fe7137222fdbd30b1101ea26c50826f0dada18c5fc30bda6983d | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | ca2990fbd67f5671e0311331ed51997faa7843d6507d351fe6e33adeb6e19ea7 | yes |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 6fcf69c5570573dca2d419e83ee9a1671bd2ff98fac1e81bc881aa436a6a1995 | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 9ff925fa82ee6749b885459fb3e46177f1b31d4f7db5abce230e8c6460a16a33 | no |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | 32256a3f62cfc695eeda0d0a9a8d2fedd4bfc7a90553caf2fe35d12c853e02d8 | no |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 22234d65f21f2d91cbc3daa3c10f0584e73c9750c4ac1485b555741ea544d96f | no |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | ae188d3eb305c52019797e5d4b2b534ffaa03c876c648707567624a3b8f9a0fe | no |

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

## Sources

- baselines/benchmark.json: 1959dbedb724189ce0470a8bcef61b2c494acd11a77df1ce9869d38fe788481f
- baselines/benchmark.mtf.json: 1fc8cc6959bbd0dfe6da5ffb9d023822ed61426426fa00a69d995a7cf69ef739
- baselines/features.json: 88137cefd70ceeb9744bb25182038ef40e860fa1fe57969dc0cf6b164b00cd54
- baselines/features.mtf.json: 3e9f22e63d5227d837837e6feab8135fd239da477864f3c9f355239e30bbdd04
- baselines/states.json: 6272a953ebfbc81093b8fd57da25658c7f311d68e66a96d41365d5b00e8f10ec
- baselines/states.mtf.json: 4b79f1d6d2409e512d7ded22cdd57173e1890b732108ed2083722dd2ea87b5eb
- baselines/focus-stations.json: 5be19925fc6e4ee594e85a708155060a6d6a274217783dc65be7d61e75be4106
- baselines/focus-stations.mtf.json: 4d67c4c3607c3d179015fcd867942ce818bf525f6627a7bec4d91c730f00a37d
