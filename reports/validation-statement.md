# Validation statement

This statement is rendered from the eight baselines alone, with no engine, clock or machine input.

## Supportable sentence

On 258 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 9.7e-13 mm (gate 1e-8 mm), optical path 3.9e-9 waves (2e-5), geometric MTF 1.5e-11 (1e-7), wave MTF 1.2e-9 (2e-8); the benchmark covers six wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.31, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.026. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

## Rungs

A configuration is one suite and named run with a case; the same state in two suites counts twice, and R4 in rays and MTF counts once. A configuration pair is two engines on one configuration and rung; a request pair is two engines on one request. Verdict counts count request pairs, including unsupported answers; refused states have no pairs.

The worst gated residual is the metric largest as a fraction of its own tolerance; zero tolerances rank zero at zero and a nonzero excess above every finite ratio. Each metric maximum is also listed in its own units. A recorded worst is the largest banded MTF difference across all pairs of that rung; set-aside differences of each external diffraction counterpart are listed separately. R6a measured request counts exclude fields set aside for phase step or convergence, even when the request verdict is PASS.

The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each rung.

| Rung | Compares | Mode | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |
|---|---|---|---:|---:|---:|---|---|
| r0 | Built layout, shape, aperture, index and sampled sag | gated | 302 | 906 | 906 | 906 PASS | sag.maxScaled 6.04e-16 1; focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28 |
| r1 | First-order quantities and pupils | gated | 302 | 906 | 906 | 906 PASS | firstOrder.maxAbs 4.32e-12 mm; focus-stations / certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1; optiland / ref at line 0, quantity frontFocalZ |
| r2 | Hits, directions, image landings and masks of identical rays | gated | 302 | 906 | 7062 | 7062 PASS | landing.maxDistance 4.45e-12 mm; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / optiland at field 1.83e1, line 0, ray 164 |
| r3 | Optical path, path to image and chief-relative OPD of identical rays | gated | 302 | 906 | 7062 | 7062 PASS | opticalPath.maxAbs 3.92e-9 waves; focus-stations / certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1; optiland / ref at field 0, line 0, ray 1209 |
| r4 | Comparator geometric MTF on identical rays | gated | 302 | 906 | 2706 | 2706 PASS | mtf.maxAbs 5.04e-11 1; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; optiland / ref at cut tangential, field 1.83e1, frequencyPerMm 100 |
| r4f | LV geometric MTF beside replay with LV's own sampling | gated | 302 | 302 | 302 | 302 PASS | mtf.maxAbs 2.10e-14 1; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / replay at cut tangential, field 1, frequencyPerMm 98 |
| r5 | LV diffraction MTF beside optiland FFT and the LV-ray wave estimate | recorded | 96 | 288 | 288 | 161 RECORDED, 31 ATTENTION, 96 UNSUPPORTED | mtfOffAxis.maxAbs 3.14e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 50 |
| r5g | Geometric MTF on each method's own pupil sampling | recorded | 96 | 288 | 864 | 712 RECORDED, 152 ATTENTION | mtfOffAxis.maxAbs 2.82e-2 1; benchmark / nikon-z-135f18-plena-ref; lv / optiland at cut sagittal, field 1, frequencyPerMm 40 |
| r6a | Comparator wave MTF on identical rays, in fields whose sampling settled | gated | 302 | 906 | 2706 | 2706 PASS | waveMtf.maxAbs 1.18e-9 1; benchmark / nikon-z-24-70f4s-wide-best-ref; lv / ref at cut tangential, field 4.33e1, frequencyPerMm 50 |
| r6b | LV sheared diffraction MTF beside comparator wave OTF on LV rays | recorded | 96 | 96 | 96 | 91 RECORDED, 5 ATTENTION | mtfOffAxis.maxAbs 7.88e-3 1; benchmark / canon-ef-135-f2l-usm-ref; lv / wave at cut tangential, field 5.00e-1, frequencyPerMm 100 |
| r6c | LV, LV-ray wave OTF and FFT beside comparator OTF of optiland raw wavefronts | recorded | 96 | 576 | 576 | 334 RECORDED, 98 ATTENTION, 144 UNSUPPORTED | mtfOffAxis.maxAbs 3.17e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; optiland / optiland-wave at cut tangential, field 1, frequencyPerMm 50 |

### Limits and metric maxima

#### r0

- tolerance: aperture.mismatches 0 elements
- tolerance: index.mismatches 0 elements
- tolerance: layout.mismatches 0 elements
- tolerance: sag.maxScaled 1.00e-12 1
- tolerance: shape.mismatches 0 elements
- aperture.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 906
- index.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 906
- layout.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 906
- sag.maxScaled 6.04e-16 1; focus-stations / certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1; lv / optiland at sample 6, surface 28; measured request pairs 906
- shape.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 906

#### r1

- tolerance: firstOrder.maxAbs 1.00e-9 mm
- tolerance: pupilRadius.maxScaled 1.00e-9 mm
- tolerance: pupilZ.maxScaled 1.00e-9 mm
- firstOrder.maxAbs 4.32e-12 mm; focus-stations / certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1; optiland / ref at line 0, quantity frontFocalZ; measured request pairs 906
- pupilRadius.maxScaled 1.01e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus2; lv / ref at line 0, quantity exitPupilSemiDiameter; measured request pairs 906
- pupilZ.maxScaled 2.61e-12 mm; focus-stations / certified-leica-summilux-c-18mm-t14-zoom0-focus2; lv / ref at line 0, quantity exitPupilZ; measured request pairs 906

#### r2

- tolerance: direction.maxAbs 1.00e-9 1
- tolerance: hits.maxDistance 1.00e-8 mm
- tolerance: landing.maxDistance 1.00e-8 mm
- tolerance: mask.mismatches 0 rays
- direction.maxAbs 6.63e-14 1; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / optiland at field 1.83e1, line 0, ray 164; measured request pairs 7062
- hits.maxDistance 4.37e-12 mm; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / optiland at field 1.83e1, line 0, ray 164, surface 23; measured request pairs 7062
- landing.maxDistance 4.45e-12 mm; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / optiland at field 1.83e1, line 0, ray 164; measured request pairs 7062
- mask.mismatches 0 rays; benchmark / canon-ef-135-f2l-usm-ref; lv / optiland; measured request pairs 7062
- mask.rimBand: 0
- rays.compared: 5181285

#### r3

- tolerance: opd.maxAbs 2.00e-5 waves
- tolerance: opticalPath.maxAbs 2.00e-5 waves
- tolerance: opticalPathToImage.maxAbs 2.00e-5 waves
- opd.maxAbs 3.39e-9 waves; features / rear-plate-rim-photopic; lv / ref at field 1.77e1, line 1, ray 399; measured request pairs 7062
- opticalPath.maxAbs 3.92e-9 waves; focus-stations / certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1; optiland / ref at field 0, line 0, ray 1209; measured request pairs 7062
- opticalPathToImage.maxAbs 3.19e-9 waves; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / optiland at field 1.83e1, line 0, ray 164; measured request pairs 7062

#### r4

- tolerance: mtf.maxAbs 1.00e-7 1
- mtf.maxAbs 5.04e-11 1; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; optiland / ref at cut tangential, field 1.83e1, frequencyPerMm 100; measured request pairs 2706
- rays.compared: 5181285
- rays.dropped: 0

#### r4f

- tolerance: fields.mismatches 0 elements
- tolerance: mtf.maxAbs 1.00e-9 1
- tolerance: sampling.mismatches 0 elements
- fields.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay; measured request pairs 302
- mtf.maxAbs 2.10e-14 1; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / replay at cut tangential, field 1, frequencyPerMm 98; measured request pairs 302
- sampling.mismatches 0 elements; benchmark / canon-ef-135-f2l-usm-ref; lv / replay; measured request pairs 302

#### r5

- attention: chiefLanding.maxAbs 1.00e-7 mm
- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 3.14e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 50; measured request pairs 160
- mtfOnAxis.maxAbs 2.74e-2 1; benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0, frequencyPerMm 60; measured request pairs 159
- fields.compared: 448
- fields.data: 0
- fields.flagged: 108
- fields.rimLost: 0
- fields.unavailable: 20

#### r5g

- attention: chiefLanding.maxAbs 1.00e-3 mm
- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 2.82e-2 1; benchmark / nikon-z-135f18-plena-ref; lv / optiland at cut sagittal, field 1, frequencyPerMm 40; measured request pairs 564
- mtfOnAxis.maxAbs 2.66e-2 1; benchmark / nikon-z-135f18-plena-ref; lv / optiland at cut tangential, field 0, frequencyPerMm 80; measured request pairs 288
- fields.compared: 852
- fields.data: 0
- fields.flagged: 12
- fields.rimLost: 0
- fields.unavailable: 0

#### r6a

- tolerance: waveMtf.maxAbs 2.00e-8 1
- convergence.maxAbs 1.03e-1 1; focus-stations / certified-thypoch-simera-50mm-f14-zoom0-focus1; lv / ref at cut sagittal, field 1.05e1, frequencyPerMm 90; measured request pairs 2700
- phaseStep.waves 3.89e2 waves; focus-stations / certified-fujifilm-gf80-f17-zoom0-focus1; lv / optiland at field 0, line 0, ray 474; measured request pairs 2700
- waveMtf.flagged 1.11e-9 1; focus-stations / certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1; lv / ref at cut tangential, field 3.26e1, frequencyPerMm 70; measured request pairs 726
- waveMtf.maxAbs 1.18e-9 1; benchmark / nikon-z-24-70f4s-wide-best-ref; lv / ref at cut tangential, field 4.33e1, frequencyPerMm 50; measured request pairs 1974
- rays.compared: 20662233
- rays.dropped: 0

#### r6b

- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 7.88e-3 1; benchmark / canon-ef-135-f2l-usm-ref; lv / wave at cut tangential, field 5.00e-1, frequencyPerMm 100; measured request pairs 75
- mtfOnAxis.maxAbs 7.54e-3 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / wave at cut sagittal, field 0, frequencyPerMm 40; measured request pairs 74
- fields.compared: 208
- fields.flagged: 80
- fields.unavailable: 0

#### r6c

- attention: chiefLanding.maxAbs 1.00e-7 mm
- attention: mtfOffAxis.maxAbs 1.00e-2 1
- attention: mtfOnAxis.maxAbs 5.00e-3 1
- mtfOffAxis.maxAbs 3.17e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; optiland / optiland-wave at cut tangential, field 1, frequencyPerMm 50; measured request pairs 366
- mtfOnAxis.maxAbs 2.73e-2 1; benchmark / sony-fe-20mm-f18-g-ref; lv / optiland at cut tangential, field 0, frequencyPerMm 60; measured request pairs 376
- fields.compared: 1048
- fields.data: 0
- fields.flagged: 218
- fields.rimLost: 0
- fields.unavailable: 30

## External diffraction counterparts

Both external diffraction counterparts are recorded side by side, with no preference claimed. Row counts include every requested field, cut and frequency at the last recorded sampling, including unavailable and set-aside rows; their classes and statuses are counted separately. Coverage lists the requested LV lines and the lines each counterpart answered, by named state and request.

The Z 50/1.2 FFT attribution is class method on the settled best-focus half field; earlier numerical and unsupported outcomes remain, as described in docs/z50f12-investigation.md.

| Rung | Counterpart | Configurations | Rows | Classes | Worst in band | Worst set aside |
|---|---|---:|---:|---|---|---|
| r5 | optiland | 96 | 6336 | {"method":2904,"numerical":44,"unsupported":3388} | mtf.maxAbs 3.14e-1 1; benchmark / nikon-z-24-70f4s-tele-ref; lv / optiland at cut tangential, field 1, frequencyPerMm 50 | mtf.maxAbs 7.38e-2 1; benchmark / nikkor-z50f12-ref; lv / optiland at cut tangential, field 5.00e-1, frequencyPerMm 20 |
| r6c | optiland-wave | 96 | 6336 | {"method":5852,"numerical":484} | mtf.maxAbs 2.61e-2 1; benchmark / sony-fe-20mm-f18-g-ref; lv / optiland-wave at cut tangential, field 0, frequencyPerMm 40 | mtf.maxAbs 1.49e-2 1; benchmark / sigma-35mm-f14-dg-hsm-a-ref; lv / optiland-wave at cut sagittal, field 1, frequencyPerMm 10 |

### r5: optiland

- LV requested lines (nm): 470, 510, 555, 587.5618, 610, 650
- Counterpart answered lines (nm): 587.5618
- Requested fields: 0, 0.5, 1
- Configurations with banded rows: 47
- Selected chief-landing sorting limits (mm): 1.00e-7
- Frequencies (cycles/mm): 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
- Row statuses: {"ATTENTION":256,"RECORDED":2648,"SET ASIDE":44,"UNSUPPORTED":3388}

| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: numerical / unconverged; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
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
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: unsupported / no-curve | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-f8-photopic / 0 | 555, 470, 510, 610, 650 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.00e-7 | UNSUPPORTED |
| benchmark | sony-fe-20mm-f18-g-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
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
- Row statuses: {"ATTENTION":443,"RECORDED":5409,"SET ASIDE":484}

| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | canon-ef-135-f2l-usm-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | canon-ef-135-f2l-usm-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | RECORDED |
| benchmark | fujifilm-fujinon-gf-63mm-f28-r-wr-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | sigma-35mm-f14-dg-hsm-a-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | nikkor-z50f12-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | ATTENTION |
| benchmark | sony-fe-400mm-f28-gm-oss-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-400mm-f28-gm-oss-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | nikon-z-24-70f4s-wide-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-tele-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-mc-105f28-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-mc-105f28-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | nikon-z-135f18-plena-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-135f18-plena-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | canon-ef-135-f2l-usm-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | canon-ef-135-f2l-usm-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
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
| benchmark | sigma-35mm-f14-dg-hsm-a-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | sigma-35mm-f14-dg-hsm-a-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-35mm-f14-dg-hsm-a-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | nikkor-z50f12-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-3 | ATTENTION |
| benchmark | nikkor-z50f12-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikkor-z50f12-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikkor-z50f12-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sony-fe-20mm-f18-g-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: numerical / unconverged | 1.00e-7 | ATTENTION |
| benchmark | sony-fe-20mm-f18-g-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: numerical / unconverged; 1: numerical / unconverged | 1.00e-3 | ATTENTION |
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
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-24-70f4s-wide-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-24-70f4s-tele-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-24-70f4s-tele-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
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
| benchmark | nikon-z-135f18-plena-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | ATTENTION |
| benchmark | nikon-z-135f18-plena-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
| benchmark | nikon-z-135f18-plena-f8-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | nikon-z-135f18-plena-f8-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-ref / 0 | 587.5618 | 587.5618 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-7 | RECORDED |
| benchmark | sigma-45mm-f28-dg-dn-contemporary-best-photopic / 0 | 555, 470, 510, 610, 650 | 555, 470, 510, 610, 650 | 0: method / two-methods; 0.5: method / two-methods; 1: method / two-methods | 1.00e-3 | ATTENTION |
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
| canon-ef-135-f2l-usm-ref | 8f1f7d95653af82da64d44b73a272e7eb84232c67ee643e47207e067064ee070 | yes |
| canon-ef-135-f2l-usm-photopic | e9e741608e3f5f054625e1189a93c16f57e44893080a8ee4a9451df894df4c60 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-ref | a878f44443376f43150577ade0fdbfbebd809fc9bd062250397b27b0ac3eeea6 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-photopic | a193bba6b71293a0b4bac4f7d5a5aff691fc23bc2499284e1c033ad238daec10 | yes |
| sigma-35mm-f14-dg-hsm-a-ref | ccc14e33b434a6ec5fa8af08a14217b9ff7dc32c9d4f8b92125186fa3a45c97b | yes |
| sigma-35mm-f14-dg-hsm-a-photopic | ecd0befffe5b28039511a637f8bd5c08c0932c526a143b07acfdc6e88c6c1ffa | no |
| nikkor-z50f12-ref | 167e686b31a7497ca34af22c245b0c6cc3ddc6ccd060343c987f04ec18ae4c5f | no |
| nikkor-z50f12-photopic | 6981c5efa2e0f14d167c0ff9b3465552a294ef75eece6e3af725cabc027843c2 | no |
| sony-fe-20mm-f18-g-ref | 2e2afa23bd756f5a1091b5d7f1e7f85e104c97472530f52a0ea0076b336b4cab | no |
| sony-fe-20mm-f18-g-photopic | 23b051950216b1004d67e9984a3181b877a25e5c1f50e7588fe868ade50fed35 | no |
| sony-fe-400mm-f28-gm-oss-ref | f0819763fb3976af512ce84e17ce149008c06fed4c2f0280f03abc3fe7313fe8 | yes |
| sony-fe-400mm-f28-gm-oss-photopic | e3fb8ca13685378d51194b1fdc6cc573018861b1913f5e65407774b352c9b811 | yes |
| sigma-105mm-f28-dg-dn-macro-art-ref | e11ed3cae518f0c789667ce443bee69fbbe7fadd303e7a960b052999300848b1 | yes |
| sigma-105mm-f28-dg-dn-macro-art-photopic | 50d94ea9ff30e0960b74dae45269cecd622dd75af41ca41a945e4761f1839d66 | yes |
| nikon-z-24-70f4s-wide-ref | 327403ce09e2fc94b6122c0799aba12156ffad3f9b726829aeccb18d31efd709 | yes |
| nikon-z-24-70f4s-wide-photopic | 06eff99a7dc852d126aa09c9eea6d4e7b19d5fc77d79c520b5624c3211295979 | yes |
| nikon-z-24-70f4s-tele-ref | ab9c8205a728d127b2ec6bf4b38f868de47d255de7807c917d0ba35ec4b8ca24 | yes |
| nikon-z-24-70f4s-tele-photopic | e7c0aa4bf2ee5a2b0afc8ac68e8a6115e586e7adcb01a741e880c320dba248bf | yes |
| nikon-z-mc-105f28-ref | b5caeb649af604b677236805c0045528ed083c75a1164f65a9148a11a7bfbc54 | yes |
| nikon-z-mc-105f28-photopic | 98d1037760a2c357308bccbe8a4ca815d8c9cce422e54b913d74275645db123d | yes |
| nikon-z-135f18-plena-ref | 0403f9a540eed64c9b7aeed98d14bde823ac3dc2167b69b0ce5c8447d26227be | yes |
| nikon-z-135f18-plena-photopic | d99ccec01961ff60514d1ae14ec6b29e59a96d0d11e3f02ea70dbd82169e30d3 | yes |
| sigma-45mm-f28-dg-dn-contemporary-ref | de1fd91c6b96ca5484034ae48a27924000fb59f1e8f719f78e2ee193da29d561 | yes |
| sigma-45mm-f28-dg-dn-contemporary-photopic | 3a3ae023a4365a29b0c93a8c939aa2f8c31db5cc4786aa230701c72effd5aac4 | no |
| canon-ef-135-f2l-usm-best-ref | 2052f579b97c15dd9e0edc1bf94089632145f94a37f8b462e0afe398f4ec6e31 | yes |
| canon-ef-135-f2l-usm-best-photopic | 79b7e9b31278c2f402a92f81eafb628841d74ac037fd6376fecd5eed21970735 | no |
| canon-ef-135-f2l-usm-f8-ref | 0d53a895f4385bf5e902ed19f86387d900c5d086bad060e2dac454ecec9da88b | yes |
| canon-ef-135-f2l-usm-f8-photopic | 521d837bca954736bc2d2667e116e7660775e964d9da682a90f0fd735af7113c | yes |
| canon-ef-135-f2l-usm-f8-best-ref | 7e0fd832eff94a9e934ed36c2576006b521bbc0ef6fd6621b822ebed3fc15a65 | yes |
| canon-ef-135-f2l-usm-f8-best-photopic | fe9314915a7f093ca6a8a3c784378ac00c0fcb7bef1a29b6a379da47561c4b76 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-ref | 34c53d2a6b58c93e8d5f5c57ba61802d9179eb35bfde6c9e7a55cdf50ad005b4 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-best-photopic | e91d1d7e689eb46a225d1bb0aef06dc8500e6d6228e3d0157c2d1e5581d591f3 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-ref | 8c21e5ccda69543a8a81500f39647479c9a40c1995aef338554cfba5eb00a1a7 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-photopic | b746236350485ae9ec195f9783db73acfacb6232e538e3d5ce5570c1d0a2aa0e | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-ref | e36a5fb0b20d0e796468d1e12f3989ecca7c61f42968766ae6bca649e6108f64 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f8-best-photopic | 8939436b32b8a852e78246831cef5b59133de1560b018fa59a62ab1d38b8f3f5 | yes |
| sigma-35mm-f14-dg-hsm-a-best-ref | b3ae10efe5903ebb30fb98cc8d7c90d6a40959a98be1811abec29ae491c860cc | yes |
| sigma-35mm-f14-dg-hsm-a-best-photopic | 703b866bdd7097d4dd79329c4d4a36e183dfdc4239a8f21a611906cba18504cf | no |
| sigma-35mm-f14-dg-hsm-a-f8-ref | be7f2899b89eed48461903c0cec43bfc3cf7d03e3e98f77199f75cd4db37b1d5 | yes |
| sigma-35mm-f14-dg-hsm-a-f8-photopic | 3795d592417d44294806bbd205307932cb56ff1001f51b9af77cdfdc084cde37 | yes |
| sigma-35mm-f14-dg-hsm-a-f8-best-ref | 00aa3e485403fa90dab9eec10a4e5b0f0a131d47180b3b1425f906ec587ae225 | yes |
| sigma-35mm-f14-dg-hsm-a-f8-best-photopic | ff081659525a48c5c301acff34b0765663d1637b594f8dd238cd4456f235d634 | yes |
| nikkor-z50f12-best-ref | f496edb177f4ddadcffa9730961c52de0907f1845d15d09f97ed0a390ae69d94 | yes |
| nikkor-z50f12-best-photopic | 784a2618eede167340d3e9221b8c297d46bbbaed2e06d55e39c311264f0a4a5f | no |
| nikkor-z50f12-f8-ref | db7f14bc7e96feab83fe3411ec36ce3f40dc835a1510fc3802f22bdd58e0dcde | yes |
| nikkor-z50f12-f8-photopic | 7b40a699ed2c88f9a10f3f39646bd27e3513e325e6c4940a92fa1d8b3c1a2f17 | yes |
| nikkor-z50f12-f8-best-ref | 45163bea58b70cf6a56acf4e4f5c0d7161cf49ab9bd3e9bed690d1cb9990a011 | yes |
| nikkor-z50f12-f8-best-photopic | fe1468edaf95d81d4c1ab8c6e982a77d15ba6e20cebd466b1866a6042174a464 | yes |
| sony-fe-20mm-f18-g-best-ref | d114031a9182fea934944b37136c68f65598238801f0361ff04c8be9dbe9a9ed | no |
| sony-fe-20mm-f18-g-best-photopic | 03770d45a5e3146819c912958891def321c830ee51586e7342b0ae05a7ee227d | no |
| sony-fe-20mm-f18-g-f8-ref | 49fed327bafd03598896526d87ec7171f5e4e726f6512ee032a170dafe6ba3c1 | yes |
| sony-fe-20mm-f18-g-f8-photopic | a212a2923f8ffd8470f0b1f6836e63d8db8c73205bfbfcbde61d702fe2023cb6 | yes |
| sony-fe-20mm-f18-g-f8-best-ref | deef77babf0cfbb33b79cdcc8ed6f380b9ef5be6359fc5304a2de7ce9fa6d98d | yes |
| sony-fe-20mm-f18-g-f8-best-photopic | 9dd6d0700dce02b99851ff84e785d9dac1ec496f6d4f0e5f4fe9f7c0520f5cdc | yes |
| sony-fe-400mm-f28-gm-oss-best-ref | c22815ddf3731a9489acd86fa7865bbe3ab8e23609c67d611c4ff086fa2bb109 | yes |
| sony-fe-400mm-f28-gm-oss-best-photopic | 68bbf55c713c5470bd5a49e58c3d3e117d22ae4ce66b02be75405bf7d92e3881 | yes |
| sony-fe-400mm-f28-gm-oss-f8-ref | 0974cc94e4d04caae55743254e1d71af9c01019abac16573fff95a27c7ecbe20 | yes |
| sony-fe-400mm-f28-gm-oss-f8-photopic | 640804ab2f8ad70507a85ee22ddf73f82e2341b0ef7eb422c35765ad92560e0d | yes |
| sony-fe-400mm-f28-gm-oss-f8-best-ref | 7fd76e9812af145629f497f05cb198333354a147d9fcec9268db43a0b03349f7 | yes |
| sony-fe-400mm-f28-gm-oss-f8-best-photopic | 184503ee6849951e105915674c915986959061bad57dac7c65df997cf83b8610 | yes |
| sigma-105mm-f28-dg-dn-macro-art-best-ref | 88fbfda5fc25f83643f694be062f52357d36912ce4a6ba7fe75aa29011f39730 | yes |
| sigma-105mm-f28-dg-dn-macro-art-best-photopic | 50df9f26ab69012743f173096e93babca09f19edda3d554f0d2cf43010030299 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-ref | 4fb64909817675acffa82d0047fd92df80c77bf6db471d516a8623eada7e36f0 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-photopic | 691e1e76fc5cd3bb185ff15911063f7495e3a4faa4420063eff2ceade93b378a | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-ref | 77c7bb8587a65f1728bc5dcbc6e10d5da0e9d31bf5af19f6ae9f66e960898b8b | yes |
| sigma-105mm-f28-dg-dn-macro-art-f8-best-photopic | 30e3597f67e2d564108a2585c616908903e32a3c88a37e313e3e7796768dae65 | yes |
| nikon-z-24-70f4s-wide-best-ref | 11939c22f49c3c0184e3620ffdb796a7bb13ecaf98c933f746a51d75f09488a4 | yes |
| nikon-z-24-70f4s-wide-best-photopic | 303e31f5ade720acd67d934169c6cc0f77527d54bb806e7c6d245723889ffbf9 | yes |
| nikon-z-24-70f4s-wide-f8-ref | a5957b6f15c089d50c0a644948511de4052644c6c1fa3863d7d893f5fc53a63b | yes |
| nikon-z-24-70f4s-wide-f8-photopic | f849b03951a2a6d4ebd62a8f76d30086bd16d9f0b1782b7bca082f79f7b36ec9 | yes |
| nikon-z-24-70f4s-wide-f8-best-ref | 61d7b43c1a213663dfc248e7d8a2c2238912e4ff623656745b2ad5fdf63f167b | yes |
| nikon-z-24-70f4s-wide-f8-best-photopic | 8091381339ef5c9edaa507b3a69a3a4ab2000d06d3cec8914839e09472796a4c | yes |
| nikon-z-24-70f4s-tele-best-ref | d8144040e169d3e83d1feaada545bce52371252135182e0436f63c9de0442f4b | yes |
| nikon-z-24-70f4s-tele-best-photopic | 07e3cb882e9dac1ec3f9ef22754ae4b0abbcddf4373de3e7a560a1cc23015abf | yes |
| nikon-z-24-70f4s-tele-f8-ref | c1783e5c5de7f829e47a84352531ef6c6d2d9d938508504693b20ff52616db71 | yes |
| nikon-z-24-70f4s-tele-f8-photopic | 84b4c2f3410b8bce36fa7d5cf994d9a2d89c1d1aad226bcf3f920f3fa2faed12 | yes |
| nikon-z-24-70f4s-tele-f8-best-ref | 16592d7e0ff140de7ac9fe6d32bb7c40e27440d5b5896ce4b4d9d668fe4a3c6e | yes |
| nikon-z-24-70f4s-tele-f8-best-photopic | 97efc252e05cc6507f706e85b7b58a11288c1466fa91949681772154821a0a3e | yes |
| nikon-z-mc-105f28-best-ref | 4b318ecdbd32caf730fe8066144391e67b7bc5f9503dcc700954333558f8e3db | yes |
| nikon-z-mc-105f28-best-photopic | 94582f866f3c4332793b12998189edbdf7fae5c3b8f38589254305d34bf3086a | yes |
| nikon-z-mc-105f28-f8-ref | 62626b3e8f2320cf56f9fed2217e9f1248c669c90987341dfa64f45dc22aca56 | yes |
| nikon-z-mc-105f28-f8-photopic | e27b43865a3dc776d6e7196faa75f5cca81b8bec759c7efc68a6c277175c99a1 | yes |
| nikon-z-mc-105f28-f8-best-ref | 7baef182ca68de51405f2b7bc5e5d97e626ec54ab84995a91c6f7019f81a03c2 | yes |
| nikon-z-mc-105f28-f8-best-photopic | 3239fe69619fbf39c2ceadd16a180cfd411bacb8f076a49d9d3eed449eb87e7b | yes |
| nikon-z-135f18-plena-best-ref | ecf6d1df4e79a7b3fd94b55822542023ceae396b307bc6b6a55cb1dc0ff24cf9 | yes |
| nikon-z-135f18-plena-best-photopic | 3dea04cb1d5f72c01368ee35c83d37fb993b412a0e3810bc61891172be599297 | yes |
| nikon-z-135f18-plena-f8-ref | c2318d538a784c5ec070fc31ac10b4dfcb0d64744f784760c11124e9bc61b371 | yes |
| nikon-z-135f18-plena-f8-photopic | 09a66de0b38248a185a941cb3b8a194df9e8ba1037a5e1da82a4c869f55ab6af | yes |
| nikon-z-135f18-plena-f8-best-ref | 99f3a1e02611f619f54733f2d6db59a720b170b77cf55c282ce050386f153a72 | yes |
| nikon-z-135f18-plena-f8-best-photopic | b76bdcfea59510911fe8caaec568909f077df90a008cd8cba1b9e2574f9cbada | yes |
| sigma-45mm-f28-dg-dn-contemporary-best-ref | 04595615c306969731e362b49ac82b2debaf9a1030bab29de8a5b6357ef43fa2 | yes |
| sigma-45mm-f28-dg-dn-contemporary-best-photopic | 9939f2aacfa472a85b96d54fb7a06cb3c296fcc8d36a81d0569244885ea8672b | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-ref | 54a6b4fd4493aa1cc466027ab57b9edc61cfd31e57c8f5ad89b66a55baf684e1 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-photopic | ad771ed160d2a9cf74878737b195f2eed26c222b29933be25e748eff74c626b7 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-ref | 1c0b103789ba44369ba3dff3a1d8a9776422c96a9dac30ae1eaffc6346cd327a | yes |
| sigma-45mm-f28-dg-dn-contemporary-f8-best-photopic | bec35fe3ac9cf33f43e39cd4db57188b197f9a75ae9e2842ca3a6432dffc9022 | yes |

### features

- Declared: 18; configurations: 18; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| odd-asphere-ref | d7eaaea7cad5c627b42d9936d1c639ca82a82f9f051ed4e53d4a5053496c8d58 | yes |
| odd-asphere-photopic | d7154b036a5aae7c7ec57ccf159839db4f7314a46399a3977c53708157d50c62 | yes |
| e-line-ref | a1f5acdf3680b184ce4239f5f983c74d733ed1673c4df2a378d1f1a399b222e1 | no |
| e-line-photopic | 776244eced3709e34b3a8f6c152b34fa51cd85733f55829a3aca1b50794cfb00 | no |
| asphere-a20-ref | 60215f518c4675590e72fc4e5bec2de0e0676aacb05347f7b09134b987cffdc4 | yes |
| asphere-a20-photopic | 6610f3acf1dd639a6caacd0296a222d175a0aa5b57946549dfdde60c8481da04 | yes |
| flat-base-asphere-ref | 8a75c7bd1159c6a16fde8b0ed9efd02b601a739677890d94c710fd2c3aeddcdf | yes |
| flat-base-asphere-photopic | 63332eacb501d1dab391f7b19f5da4697042781b9445c0659c0e65d1bcbcb02f | yes |
| rear-plate-rim-ref | 97fe62cbb976f1283ff01ac56aaf75d4da428861ba839a0e85616c051a425863 | yes |
| rear-plate-rim-photopic | d46065ab3b1323c5485c19053d6d972022ae4c0cf1ea58fb2f5a06fecde50ef2 | yes |
| fixed-iris-zoom-ref-wide | 46a897db7b98594adf12164e7e508db180cefa7eea01185d456041360e0055a9 | yes |
| fixed-iris-zoom-ref-tele | 1c6120c0e785476474203dd887268ef64d9173bc7aaa4ffc5e116d517c14f5cf | yes |
| fixed-iris-zoom-photopic-wide | cb63cfac23b97c309c2892ddaa5b88184f1cc72f317d215563a13dce03a93ea6 | yes |
| fixed-iris-zoom-photopic-tele | ba53849804b684d1eb6181ff4e8fa79dec012ea950bfffbf261cf35bc8326c35 | yes |
| zero-asphere-ref | 76be6f3124212a291325e0b41c2036523a6ba06daa031878b272f86b769664f0 | no |
| zero-asphere-photopic | cffd3246c128549c906a9b974c792ad4823f92355e31478ed3ef9385f9c90a79 | no |
| stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a | yes |
| stop-inside-element-photopic | f8181409b90487e9e7a2dd156ecc9ec1d021232fbd2a806a52ab5cefaff96377 | yes |

### states

- Declared: 128; configurations: 128; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | c0e87372783bbd8a8fbb5b8abcf34ab264401ab47744cb64a61c3e49db0a1698 | yes |
| canon-ef-135-f2l-usm-f5.6-photopic | 6e16cb41d3a1737e746cda1fabd1300b32e1b3a50b72e33ad3a5f14f1669a128 | yes |
| canon-ef-135-f2l-usm-f5.6-best-ref | 61bc40770280967851419083bffad65f35699994455895b9c378ae3442d977a5 | yes |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 2a0be2724fab8e1975fbbc3e5ea1c3fa7fd872cb97e8938f47094af1ec48226a | yes |
| canon-ef-135-f2l-usm-f11-ref | 4bd6eac33e3d5a171eb5ef2270fb40e9dc9ab29ad224e71b8a960b3784bc2ebf | yes |
| canon-ef-135-f2l-usm-f11-photopic | 46e839b123926690036f4477c1f8b6eab5fb57cc6b8398c54a525e0799591a35 | yes |
| canon-ef-135-f2l-usm-f11-best-ref | 3e2a3041c3855da032385dab90ce1a5223bb9154df4827dcaad94bea4d56ae72 | yes |
| canon-ef-135-f2l-usm-f11-best-photopic | 40f488bac07f13920a31f89daabe39542caf5c942934d16f403bd16d3f59f832 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | ac0c53a9e6287256a14bcb19610b924cd9ed9afa58911bd771112d8cad6c4092 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 6fa2b736847fc7b57d1dc4e1018f0b2e52565a65d7e79a0ceff749d24564db3d | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | cecfbcdb0d12a82be79efd0d244800de0b199f4c4345eceb90754a4f4f25f24e | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 7d9b4d1fb75a25becfc1d25a6a9d18f659f5ff53010f6968c05b221ebde32caf | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | d5bb8d6ca615f6e5915fa7b602f4ad13c17abca7f9a65a635e832793a275318b | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1e073ce15995cbf454326cb863293ff2563b111ffd36e48f10224a9595a83ad0 | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 42e040bd859dfa26cf5e6798c96c7542076a2ef26e2b5071d0574e57501ea00f | yes |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | f7c923f583d9c3f7ea15cccd0bc1a49091b4df00370f561090db0425ee019e45 | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | d7cb9811dd23d692fb8eec831f8f07effdac024692708297a55bfb20d83f9edc | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 26897873e891b58b82792c27fd4cf2866424a29fcdcd78c7b82ff9662fbdc43d | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | fece198ea407be993ca9bf2b8f884517cc0f70cc0a2bb9daeafb486fd1b5c467 | yes |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 718f9804619e8d99f21f9be8d273ef31843910a9c01caec7828ca849845d2da8 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 484c9d9c9b0574fa80df036c1f84ccf0cf8b6355b75eac27843753fba19c9901 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | ce5247479530f9f4298ae8bfd93a678a03ad5d597650d0c4e2e609e7c4a80642 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | ca87df8c11615b03da87ad26bcdf55d9f860792dfeb7d518b74ae56d53522020 | yes |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 2eff3fedeb25e680fa9e1bcd324fa38bbfe2ad21b282eaf175fe36622a37036c | yes |
| nikkor-z50f12-f5.6-ref | 395bb2a10d84250b4d016e57f4cd64be0ff2acbf5af268663dfb1a03973be0a2 | yes |
| nikkor-z50f12-f5.6-photopic | f70487954823beed0fef4592b3a73ad0a0bfbf5c3c4cd7b5a6b93e397b4fec7c | yes |
| nikkor-z50f12-f5.6-best-ref | 2477f9de6a098db5439f3679fee665737d4bf9582fe7a51f9a98f282d2e892ef | yes |
| nikkor-z50f12-f5.6-best-photopic | 53728fd1171f2edfb8b6a1ed5e9c434a033860bce8774651de787eea637745d5 | yes |
| nikkor-z50f12-f11-ref | 504e25b011c410bf425e597b9489394367d812b96f8af1ef469f44d40b1ee2c5 | yes |
| nikkor-z50f12-f11-photopic | 9d263f522abec6ef57362684f988b51fc6b98b6b59e93643db40996634a742d2 | yes |
| nikkor-z50f12-f11-best-ref | 00898aa06f0679bdefe874945adc5520a234e04750ac24f24f8a52e86944102c | yes |
| nikkor-z50f12-f11-best-photopic | a777af7634be32853fc468c91225d13e3b3995b6f526990e024a2663f33ec18d | yes |
| sony-fe-20mm-f18-g-f5.6-ref | ca355ce3e19a7e6e41d293d0624df8b0477a45ec3d6ba89cb33dd9a65f67b5da | yes |
| sony-fe-20mm-f18-g-f5.6-photopic | e8caf86b51b05e49385ff56ba1d2fd8e25327ea36f77785305cc9fde44a105bc | yes |
| sony-fe-20mm-f18-g-f5.6-best-ref | 74a2416cb466a94854d8976b2f788097ce8387bd58a538997371b607135f83b7 | yes |
| sony-fe-20mm-f18-g-f5.6-best-photopic | fa585305f7b7dd8bd979b2361918e582ba9436968bfec7556c4c7009ffbb82c8 | yes |
| sony-fe-20mm-f18-g-f11-ref | 72e4c5b839a2e628560e069e408341781e5e8dcb50ec7a18a65e1e01be8c35da | yes |
| sony-fe-20mm-f18-g-f11-photopic | 54fc7ff455da62e417dbb43a3238fd29395efa6deaca8745626415146428cfe5 | yes |
| sony-fe-20mm-f18-g-f11-best-ref | 5146d32441031213c3bc7aee41c0484572deda246eb0a3672189a9858f2481fb | yes |
| sony-fe-20mm-f18-g-f11-best-photopic | 41d5fda136cd146c1a1ad49a97c6407de0f74403f5e17c108711369e3745f9b7 | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 913940f673fca99b15d477593aa10e0932b7d55bd55abb45fc0efe4be43d76db | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 256f65678573fe0555d6a93eb2eee8bd1ed242d27c95589c84eccc63da23d2d3 | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | b48685f5c0be5f13bbf272166f6b66c0f0f23ceab0fe0e492dd1935bab44d5ca | yes |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 5995f5b6bb8a6b4323e972061e74f992cbe682f0011467b66c3b20a9b041a456 | yes |
| sony-fe-400mm-f28-gm-oss-f11-ref | 440403e6acb4f563e20e83d20f4bdf09894765e8a4dc080ead82aa5c0afa09ac | yes |
| sony-fe-400mm-f28-gm-oss-f11-photopic | f7542d71ec7dec46c61fec30e604d10dc33893d5c245b97b60ce87f9c742ddc2 | yes |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 411d4c0c1f66a286e3d942ea91924a9a11e871638ac37906d27c89ba996de910 | yes |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 75f79a2c148806e1968a75123e111e8bc328c701eaf73f69bd59c63d7d24bdcc | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 7234624d9e180264e0f5e45552e8631fc1b8c9e41f86061a5aa6ae7d61d3161d | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 6e311d5232f60db6dd439c2b54ab26e31957c48547245c09854ee5bf51ee7176 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 4d250fa32976fa524f5be74807586a1fd85b5fdfb99821053b115c92b1b3ce9f | yes |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 63f399c43a2cb8ad0e7af321dcadb60a4638bc1afb8fa93d9db21076f97ddd04 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | afa106a51bdec89d419dd8ae11a3bae3a0c0e41b1997ef77137b4b5d3509dfa4 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 847c169f18f40cc63f0cadded7c1ebde458a6b2a3285143d9e0266515330e3e8 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | cbe645ff996acb36602882677a89c3e22f05320d52b3c6afa56f4fa53472a2c2 | yes |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 4197a0931bd145c11f5e2fde6192ba7ed39f52bafa234ba9749125d9f1aebfba | yes |
| nikon-z-24-70f4s-f5.6-ref-wide | 43d293e0d03b0d81ac731903ea7291eaf268ffb49de710bc7e70bbc1cba14609 | yes |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 5074f7ae6e0a91f3e61e4dd5decb985875b0449b66fe1c7824ae1f26a336cd09 | yes |
| nikon-z-24-70f4s-f5.6-ref-tele | d146abd7b30bd4b6202661e89d3f2a6d12ce3a21a69296c31151a5d9203f1b8f | yes |
| nikon-z-24-70f4s-f5.6-photopic-wide | bd7e3e810de56bda5c27fd1a29485bed6acff93eb8295cacb7accc9d93159e95 | yes |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | ebf5b2c2259fa9616f0a39916806ae42f44678a66735d79242e53fa349670b38 | yes |
| nikon-z-24-70f4s-f5.6-photopic-tele | c46fe519bf959c6fdec85ad849b3926e89b9f3f1360aaa23e55d78436e7fefaf | yes |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 4623f24f37c3ff3ee04b106af1c1c1f32c5021eff3e95ef756e16efa15f52e2e | yes |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | ef7d7cd7188c5cdcbd6dab26d098fe0594e95365ade39ac9d69039a9e0f5e97c | yes |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 631f2e8a60a61fcb0269953842a24aa45c23bb22f59da2864216f015e09fde62 | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 59f1ea173aea03b0c488b26bdc049b72581318d81991c278e737a367795ebd9c | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 18f8f36f88edb46a5aa1c5eed1487fae139f0cdf4e3bf21a3fd7948029958d15 | yes |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | bff5282f4e28c431214b0b284850e83fafe7fd78f9ee8ed725aecf5d3f24962c | yes |
| nikon-z-24-70f4s-f11-ref-wide | 21482843518999fe0dcbfe3267b92c6f40591d2491c58df828a770245defd9aa | yes |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | a3f86b1b281dd0ad9e0aacacb290b65b8d99e112090a5f9fa40f6bf6cd265618 | yes |
| nikon-z-24-70f4s-f11-ref-tele | b29ffec9f36b8adfe171446f19817942c84d38d5b4d11dc13c316e9a405500c3 | yes |
| nikon-z-24-70f4s-f11-photopic-wide | 6eb129e3994f357248fde926dca0232eb4b23a6449f3855813dc8db8faa03a37 | yes |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | b1f1d5850e6a312d32215e16ba93a1878edf3dee4697cba64fe0a85b8856c873 | yes |
| nikon-z-24-70f4s-f11-photopic-tele | 46b987a1461cdab4a5edd70b39eb90ae5c87393aeb96cc1947de21bc3fc74df8 | yes |
| nikon-z-24-70f4s-f11-best-ref-wide | e28b742b29485ec7aadb5f1ca761b6a20835778f28768fb363a7f92c05f8d352 | yes |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | e7f9d2bf7379571ac1de0e31d6ab106e54dc1b55ffa50e2f5209d5669b9d0f5a | yes |
| nikon-z-24-70f4s-f11-best-ref-tele | b0ad205f7abced19915254b04a91554059b5bbd599e4b57a495834f4434de6ab | yes |
| nikon-z-24-70f4s-f11-best-photopic-wide | f8f8e0c2af46c911a7c88fc30a9a39fa4cd590519129b7e7e531f94b78426370 | yes |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 572b454fecdbc65fa7d8c7a5cd70fa2fab7bc9557f21038aaaec9bda0e505ebe | yes |
| nikon-z-24-70f4s-f11-best-photopic-tele | 79277a774f5efb9a724d2732aec6a147be6a104bb19054f82160ad0d1d8923de | yes |
| nikon-z-mc-105f28-f5.6-ref | 062545109261a8892b1d6430caad6d8c078b9ab526a5dee8834102ee243599c1 | yes |
| nikon-z-mc-105f28-f5.6-photopic | a1773eb592532e21fd5adb73d617d6d31b555cc832107df8be56caf96d4d69dc | yes |
| nikon-z-mc-105f28-f5.6-best-ref | ee3776a7aef5a826dda346d40320c50e8fd963e49d08fa5dd44c680701107a87 | yes |
| nikon-z-mc-105f28-f5.6-best-photopic | dab98e82bdb584faa367a4288f7517f7f4a182767982a10401934951f9d2a996 | yes |
| nikon-z-mc-105f28-f11-ref | b29a367787045441bf4b8d9eb6141a0ef1c60e62e74efd9e5070aced5fa89c7d | yes |
| nikon-z-mc-105f28-f11-photopic | e89e56f141f3c8a559162e5965025b6d59e996da986c551fa16935b0c14306a9 | yes |
| nikon-z-mc-105f28-f11-best-ref | 6d6d629ad6bdd902600b617c5b47b2d9fa6de48d5886f22b835a9a4ad6c52318 | yes |
| nikon-z-mc-105f28-f11-best-photopic | 77e9760dcd80b1d050e34585fb4ece553d6dea57f57ff09b93c6d3345de869e4 | yes |
| nikon-z-135f18-plena-f5.6-ref | 0e14dcf45d101f3ffc4f088aa9e195dd770df07b92ecd4547b3713741457072c | yes |
| nikon-z-135f18-plena-f5.6-photopic | b13e7bef38fd640c35817c7bed1bf1001a8a4dbd1c472dbf548f5fa1aa212c44 | yes |
| nikon-z-135f18-plena-f5.6-best-ref | 94c5f6e4885db9f33d61809c890835970e66a11058683d13e068d5436a29727d | yes |
| nikon-z-135f18-plena-f5.6-best-photopic | 0820824abdf7085c717fad4d38120b817df7761c01e7456d589d5eed7ca699f5 | yes |
| nikon-z-135f18-plena-f11-ref | 187718db3b86895a0664d0d39aaa844c1b356c072cfb0df871c09ec8b2f99de0 | yes |
| nikon-z-135f18-plena-f11-photopic | 65f295b75a1af7635f36afad1dd2ea2338f902c9c91e16f0d156de8ce4449a7b | yes |
| nikon-z-135f18-plena-f11-best-ref | db91461d9b73907a5a56ce65bfe94aa2fca85755f1ec738968b2e0a6fa40dead | yes |
| nikon-z-135f18-plena-f11-best-photopic | ec9d4eb91ca6d40ad63a8b6caa7af24ed753672cef1c5105cb1b3a68b600758d | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | ac930dee61058699460a7a827a03cf9ff9b9c621a22a7ece17029a93d8989e8f | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1507e90fb8d06cc5bedafcfe3ac51ba3afb45f9b6c5f5f25d337933b2d4d0e44 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 268c5840d37ec93f9e47bb19527b04e2c7ea02ae5d9d4fb1bf4e180f53f74e19 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | c685d8297b0209846e3441db9960938ae1cb246f9030e6270e015c9d02f10b72 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 44edcde6e319adf1a5b2b0f0b8d9ddb7aec872990e4d61e2198bba8fbed1a832 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 501110ed0f4ed088579f6176df5bedeca1a303da7e50014d892a075b8206e08e | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | dbb16f8147e05b2d1232133b6ad8c92ecdc72f136450cd93efa139220a7718e8 | yes |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | e8fa3d07ee50d20e52941b113dbfd39ae157d7486832ec7f6bef1d3ff6f82cd9 | yes |
| nikon-z-24-70f4s-open-ref-wide | 327403ce09e2fc94b6122c0799aba12156ffad3f9b726829aeccb18d31efd709 | yes |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 65305725fdb42f1b1ebc1517e989b060cf9412ff14921b29478818d7331fa746 | yes |
| nikon-z-24-70f4s-open-ref-tele | ab9c8205a728d127b2ec6bf4b38f868de47d255de7807c917d0ba35ec4b8ca24 | yes |
| nikon-z-24-70f4s-open-photopic-wide | 06eff99a7dc852d126aa09c9eea6d4e7b19d5fc77d79c520b5624c3211295979 | yes |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 683328e379b17b2a7147fc88d38fe28c131a7a4f8e917d3925fcb66684ebe748 | yes |
| nikon-z-24-70f4s-open-photopic-tele | e7c0aa4bf2ee5a2b0afc8ac68e8a6115e586e7adcb01a741e880c320dba248bf | yes |
| nikon-z-24-70f4s-open-best-ref-wide | 11939c22f49c3c0184e3620ffdb796a7bb13ecaf98c933f746a51d75f09488a4 | yes |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 821c70a576016f11658e60a31796a8de48e1c395be9d3e9c92fdb9a19c01e498 | yes |
| nikon-z-24-70f4s-open-best-ref-tele | d8144040e169d3e83d1feaada545bce52371252135182e0436f63c9de0442f4b | yes |
| nikon-z-24-70f4s-open-best-photopic-wide | 303e31f5ade720acd67d934169c6cc0f77527d54bb806e7c6d245723889ffbf9 | yes |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 972eff8a701d87e8063a84908b06e0303adea5dc94a821924e069940b1f92c5a | yes |
| nikon-z-24-70f4s-open-best-photopic-tele | 07e3cb882e9dac1ec3f9ef22754ae4b0abbcddf4373de3e7a560a1cc23015abf | yes |
| nikon-z-24-70f4s-f8-ref-wide | a5957b6f15c089d50c0a644948511de4052644c6c1fa3863d7d893f5fc53a63b | yes |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 39044dfb4336cc45eb0293c50592f9c204393fafb2bb07a8d5c70d123fd390d5 | yes |
| nikon-z-24-70f4s-f8-ref-tele | c1783e5c5de7f829e47a84352531ef6c6d2d9d938508504693b20ff52616db71 | yes |
| nikon-z-24-70f4s-f8-photopic-wide | f849b03951a2a6d4ebd62a8f76d30086bd16d9f0b1782b7bca082f79f7b36ec9 | yes |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | d08722c2efdf07ab213db947c9fa7203c3054e1fa873d3a0050ea5397eb42166 | yes |
| nikon-z-24-70f4s-f8-photopic-tele | 84b4c2f3410b8bce36fa7d5cf994d9a2d89c1d1aad226bcf3f920f3fa2faed12 | yes |
| nikon-z-24-70f4s-f8-best-ref-wide | 61d7b43c1a213663dfc248e7d8a2c2238912e4ff623656745b2ad5fdf63f167b | yes |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1543dbf071b51f3bd33c3d82a4b721040d6048370867e54c1091a4f83f2cfdf5 | yes |
| nikon-z-24-70f4s-f8-best-ref-tele | 16592d7e0ff140de7ac9fe6d32bb7c40e27440d5b5896ce4b4d9d668fe4a3c6e | yes |
| nikon-z-24-70f4s-f8-best-photopic-wide | 8091381339ef5c9edaa507b3a69a3a4ab2000d06d3cec8914839e09472796a4c | yes |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | ba444ae31a6a3af20b7ec8bda42d41629564af7a67aa7b641c4d44f767ef899c | yes |
| nikon-z-24-70f4s-f8-best-photopic-tele | 97efc252e05cc6507f706e85b7b58a11288c1466fa91949681772154821a0a3e | yes |

### focus-stations

- Declared: 62; configurations: 60; refused: 2

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| certified-fujifilm-gf80-f17-zoom0-focus1 | fc151b4a7fce9eb6bd7cc921ae0aac90889a0a0ce32ce45a29a1e82ee4829163 | no |
| certified-hasselblad-xcd-25mm-f25-v-zoom0-focus1 | 60619bd4baf81548766df4c3116e5e242c60b6e76eb91b5ba7b529d5bf98da43 | yes |
| certified-leica-summicron-sl-50mm-f2-asph-zoom0-focus1 | 132b9c776877d26b52cfee3c52c84222bd3ea592c01750c9c8343657878d8e01 | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus1 | 595902c51920e15a684e43442f525e782c5fd37cf04988fd37cecc8a37c3831a | yes |
| certified-leica-summilux-c-18mm-t14-zoom0-focus2 | f68826b235dcdb9b1a080ce6c6dce150615f139b9183dd3caf27f8730843c71e | no |
| certified-olympus-mzuiko-8mm-f18-fisheye-pro-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus1 | 1164cee682861c41cdaee67a2c90276d64d5de2fe42e604e3ebae359cff863c3 | no |
| certified-olympus-mzuiko-digital-ed-17mm-f12-pro-zoom0-focus2 | 20ee691a337d6dc6bab309e9198c10c7374a1a91d265b6e6a974b68ee81b201c | no |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus1 | bf047195927f492dbe4747fb624b130c606b392e3f16ff70286deb608dfc2341 | no |
| certified-olympus-mzuiko-digital-ed-45mm-f12-pro-zoom0-focus2 | 302349c7dd8c39bf7c9bab45e376a3645ef723aafa50f3d4b15c3b8502fab4ea | no |
| certified-olympus-zuiko-digital-ed-300mm-f28-zoom0-focus1 | 5ee5d6fc109ea15cef91551aff548035327ae5028efaec01df78fcc2b6608bbc | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom0-focus16 | 61b10ec1e9b1f97c48595bb029e1dd87e711967e557ec890debf2d1b78be23bd | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom32-focus16 | 4796c91049d6d85a7a7ead5ad24ce0f0559f0cd29463bbd93c08d2526d84522b | yes |
| certified-olympus-zuiko-digital-ed-90-250mm-f28-zoom64-focus16 | bebc9392adca28c39136e0b93ef7dab17fc07529a3bf2d2329cb33d87370b203 | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom0-focus1 | 10bbcde40490c2a5b6cb4fcdb237f2ce8a89a226b6b5c1c1074cc87df438b98f | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom1-focus1 | 3960852d628118b47a9025ca29343cac422df54bcc12632ea5e9b231455d10e0 | yes |
| certified-panasonic-lumix-g-vario-12-60mm-f35-56-zoom2-focus1 | eb7807b4cfcfd26953355cd6d2dc67b1e74c587de9d15e7e36dde33cd66d3c76 | yes |
| certified-panasonic-lumix-s-26mm-f8-zoom0-focus1 | 26022f540fbb0f394a84fe1bf7ba0b7e2c0483ac80c4d239346b603aae238b22 | yes |
| certified-pentax-fa-star-300mm-f45-ed-if-zoom0-focus10 | 5f620f64d9e311902a46343054f2ad6864724f805cad14c855f707d8614d7c6a | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus1 | 558d181f7fe332e3f23e8fdfad4450baebad65a414c4ccc62804034611b56743 | yes |
| certified-samyang-af-14mm-f28-ef-zoom0-focus2 | d444984ee236770b2f9ba0d4e1d135c698f24dc9c636595cbc35310d6a2bca6d | no |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus1 | 09377d60ff786893e1adbe31707a39fe50cde373b16ee745d20b4a98cbc63314 | yes |
| certified-sigma-105mm-f28-dg-dn-macro-art-zoom0-focus2 | af803a345eceb552147d179153ef223bf8679379eded36910c955aae8ab2253b | yes |
| certified-sigma-12mm-f14-dc-contemporary-zoom0-focus1 | 3836e9fa92a4a9bdd7ce5c136193abc660dbba9fcd4384eb7eb9588500b08bcd | no |
| certified-sigma-135mm-f14-dg-art-zoom0-focus1 | 162fbfc11fb7a78c9127dcf04561dcb3cf52f09c723c8bd9ac0f5ee0a2464aa8 | yes |
| certified-sigma-135mm-f14-dg-art-zoom0-focus2 | d6a1a73811dcd0b316bb34898cdd039502942c39a69062a8ab2c377aa0e2e84c | no |
| certified-sigma-15mm-f14-dg-dn-diagonal-fisheye-art-zoom0-focus1 | finite-conjugate-unavailable | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom0-focus1 | 1477f4fdb398fd9b71a31f246c2837fd16fb7c5f91bf6bf2879b16dc9932223a | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom1-focus1 | 66c1a2eaf12c6eeb84ccb9824fdb009ec3f7e7ada17037d8deb5c1958cbe12d8 | no |
| certified-sigma-18-35-f18-dc-hsm-art-zoom2-focus1 | 9533eca7053a8bc10f4eeae48eea4464ded9c10af7ff2d87ee539c6b915c4550 | no |
| certified-sigma-200mm-f2-dg-os-sports-zoom0-focus1 | a4833d79d00d382fa390dd019c9723f000a3e9c1293d8d966da9bf5fed7e6afc | no |
| certified-sigma-24mm-f2-dg-dn-contemporary-zoom0-focus1 | 8babe67e5197b131e65d73cdc653dcf3c192383218cb2e476f3b9aa47014ba70 | yes |
| certified-sigma-24mm-f35-dg-dn-zoom0-focus1 | a89f33e9185b8cf898740610c762695af016674daf383c23a6dcee5201a37cd4 | no |
| certified-sigma-28mm-f14-dg-hsm-art-zoom0-focus1 | 94333a4c6df8cc43a470b47e022a04a53db3e1d7d79a5ba80c6e56f98fca6528 | no |
| certified-sigma-35mm-f12-dg-ii-art-zoom0-focus1 | a8647fae8029be2bbb735502f3904d6bff855c77571825ed21fd270d131b91be | yes |
| certified-sigma-50mm-f12-dg-dn-art-zoom0-focus1 | 3e0050bebabe2ef394e5d2a37f4207cc23cec8692ccaaa1e5a1680f556ea3161 | no |
| certified-sigma-65mm-f2-dg-dn-zoom0-focus1 | c80693a543423dc3f2f66317ac902f03c0a2b95cbae540c9246886a7829a9f41 | no |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom0-focus1 | 1f2050f3ba63d37649fbe6d3b5bc5c9500708235a6e230e074cbb0cb0b823f8b | no |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom1-focus1 | 9861b90fd6db9b9f3a48574414fc54db4bb3d35e4305fd3501d3c01b90867182 | yes |
| certified-sigma-70-200mm-f28-dg-dn-os-sports-zoom2-focus1 | ad86753053be0d5553e0ac77582552827499aa8854a085dfaff6deeec538ef67 | no |
| certified-sigma-70-300mm-f4-56-dg-os-zoom0-focus9 | 84abefd3a467f7e971f22f378b13ad510daf83064a76ac598db4b54a71bdec5d | yes |
| certified-sigma-70-300mm-f4-56-dg-os-zoom40-focus4 | b1088647562098bff4d5314279289015235d449bf6e6ca512b103bbfceb4c6fd | no |
| certified-sigma-70-300mm-f4-56-dg-os-zoom80-focus2 | 42d45f93538e8180fad99717955a3b213beb7e8f041199719684fe202799fa7d | yes |
| certified-sigma-85mm-f12-dg-art-zoom0-focus1 | e30f376ef3f6eb25645b36ba5d2ab1ced553a01076092487ebd631db3ad217da | no |
| certified-sigma-90mm-f28-dg-dn-contemporary-zoom0-focus1 | c722c7755ca07f86f1eb5ec78d0147a3efa415ac37bb1ab9c2ee06c98dab7c87 | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom0-focus4 | 6c56c2c2c0d95b395b854cfaf466ccb5af0b6c17219d973cfb59e103c6812b24 | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom20-focus4 | ef02f7b2a5e99dbf32ab1bd453404e8ebe5457cad2c9ed81ee62022023eb2086 | yes |
| certified-sigma-apo-50-500mm-f45-63-dg-os-hsm-zoom64-focus4 | 344ffcebce2fd7e171947a10bf1678c99337548f1b863f0bc642925b37958288 | yes |
| certified-sigma-apo-macro-180mm-f56-uc-zoom0-focus1 | 5cf10d8c8b6422ed2e37591a15107cc7364b74bc8d8c9565670743267f111297 | yes |
| certified-sony-fe-600mm-f4-gm-oss-zoom0-focus1 | 094c8ed68417c334bf55145670ea50e80da7c4d891f3c9928ad34c528dba5f5b | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom0-focus8 | 81be87b898b8d464108529510c67cb301efc5ba64aa33e87df9a55c8c44afea8 | no |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom20-focus8 | 43123fa14ee4fbc8974b977b8ef3e55b0ade560f6b4f136fcde4b12a1c0360af | yes |
| certified-sony-sal-70-300mm-f45-56-g-ssm-zoom40-focus8 | fcc388dfb093202522dfc6b38721670eb337a04168b81f3e1a97b7bb38160e29 | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom0-focus1 | e843015bc39fa4c39ce7c8ee808652256e83bf19b0c46c3a1074d790c9acc203 | yes |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom1-focus1 | efa493ba8bf49dc60ce7a5f9297c0dd1865cc5c83a70aaf84053b6bc44f90838 | no |
| certified-tamron-35-150mm-f2-28-di-iii-vxd-a058-zoom2-focus1 | 42e0f9ef38bebc0d0a65967ef4c188c024c3c1964ffba9aaed6289e786797581 | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom0-focus1 | d8b0395277a164fdd227d1d0fc214a6f43ed5b8ee699a36d8a8f923b693cf311 | yes |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom1-focus1 | 79b9a2dd1a1f4b9e1a61920049b945fa20db71aa2baaba82caf74bd42428ac8a | no |
| certified-tamron-a065-70-180mm-f28-di-iii-vc-vxd-g2-zoom2-focus1 | 32e225863877c36beae5121e98e5190eb46496cb423de153b18086ae78704334 | no |
| certified-tamron-f072-90mm-f28-di-iii-macro-vxd-zoom0-focus1 | c7bd0cc65d8af8e0d38aae675c665c2fe627eec3a9b13e2c23be2f32a7a8908f | no |
| certified-thypoch-ksana-21mm-f35-zoom0-focus1 | 8f0d0bb5ce374c8c4e68ad7d302e4e21e8a42db7797f81d01f0b836a3cf2c378 | no |
| certified-thypoch-simera-50mm-f14-zoom0-focus1 | 0521f47cf726e1b8d53848d880a02b94f32fb78ec6c9a9326f58926990146863 | no |

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

- baselines/benchmark.json: bc70b1162a11c50c547b1e5b8cb1278823901ec440270d983592f3f22b6227ee
- baselines/benchmark.mtf.json: 3f508020fd827743c02f8db1944cc824dccfaa2411d836c7c4bfb7ec24e2914f
- baselines/features.json: 7c12ba32f791d63dd5ba44f4924c5224eee21ec5b9ed303a3e623c734d075328
- baselines/features.mtf.json: dc3331e66472b21a8348006c6113c29c0470923f91c2e7ed23bf3e0fbb1378fd
- baselines/states.json: e8b17c4289ca09270358fbd6e52b4a887451a19616b2ee654f37f9bb0c8c9f6c
- baselines/states.mtf.json: 35b7e6a8c9c8b28842688857082937c20b11c5dc89b13d75defd603aa44c72bc
- baselines/focus-stations.json: a095b3d19ba5e826593c023438c6547755d0facb980ebb0e7abe92d257563cb2
- baselines/focus-stations.mtf.json: 20685ca451b62b5e2b54aa0cbbf8f94576b5dd4d625250317f263b410842c303
