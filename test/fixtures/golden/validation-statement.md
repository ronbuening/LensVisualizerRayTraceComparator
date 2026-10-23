# Validation statement

This statement is rendered from the eight baselines alone, with no engine, clock or machine input.

## Supportable sentence

On 8 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 0.016 mm (gate 0.125 mm), optical path 0.016 waves (0.125), geometric MTF 0.016 (0.125), wave MTF 0.016 (0.125); the benchmark covers three wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.13, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.13. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

## Rungs

A configuration is one suite and named run with a case; the same state in two suites counts twice, and R4 in rays and MTF counts once. A configuration pair is two engines on one configuration and rung; a request pair is two engines on one request. Verdict counts count request pairs, including unsupported answers; refused states have no pairs.

The worst gated residual is the metric largest as a fraction of its own tolerance; zero tolerances rank zero at zero and a nonzero excess above every finite ratio. Each metric maximum is also listed in its own units. A recorded worst is the largest banded MTF difference across all pairs of that rung; set-aside differences of each external diffraction counterpart are listed separately. R6a measured request counts exclude fields set aside for phase step or convergence, even when the request verdict is PASS.

The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each rung.

| Rung | Compares | Mode | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |
|---|---|---|---:|---:|---:|---|---|
| r0 | Built layout, shape, aperture, index and sampled sag | gated | 8 | 16 | 32 | 32 PASS | synthetic.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0 |
| r1 | First-order quantities and pupils | gated | 8 | 16 | 32 | 32 PASS | synthetic.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0 |
| r2 | Hits, directions, image landings and masks of identical rays | gated | 8 | 16 | 32 | 32 PASS | landing.maxDistance 1.56e-2 mm; benchmark / artificial-line; lv / optiland at field 0 |
| r3 | Optical path, path to image and chief-relative OPD of identical rays | gated | 8 | 16 | 32 | 32 PASS | opticalPath.maxAbs 1.56e-2 waves; benchmark / artificial-line; lv / optiland at field 0 |
| r4 | Comparator geometric MTF on identical rays | gated | 8 | 16 | 32 | 32 PASS | mtf.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0 |
| r4f | LV geometric MTF beside replay with LV's own sampling | gated | 8 | 8 | 16 | 16 PASS | mtf.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / replay at field 0 |
| r5 | LV diffraction MTF beside optiland FFT and the LV-ray wave estimate | recorded | 2 | 2 | 2 | 1 ATTENTION, 1 UNSUPPORTED | mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland at cut sagittal, field 0, frequencyPerMm 10 |
| r5g | Geometric MTF on each method's own pupil sampling | recorded | 2 | 2 | 2 | 2 ATTENTION | mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland at cut sagittal, field 0, frequencyPerMm 10 |
| r6a | Comparator wave MTF on identical rays, in fields whose sampling settled | gated | 8 | 16 | 32 | 32 PASS | waveMtf.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0 |
| r6b | LV sheared diffraction MTF beside comparator wave OTF on LV rays | recorded | 2 | 2 | 2 | 2 ATTENTION | mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / wave at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | LV, LV-ray wave OTF and FFT beside comparator OTF of optiland raw wavefronts | recorded | 2 | 2 | 2 | 2 ATTENTION | mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 0, frequencyPerMm 10 |

### Limits and metric maxima

#### r0

- tolerance: synthetic.maxAbs 1.25e-1 1
- tolerance: synthetic.zero 0 elements
- synthetic.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### r1

- tolerance: synthetic.maxAbs 1.25e-1 1
- tolerance: synthetic.zero 0 elements
- synthetic.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### r2

- tolerance: landing.maxDistance 1.25e-1 mm
- tolerance: synthetic.zero 0 elements
- landing.maxDistance 1.56e-2 mm; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### r3

- tolerance: opticalPath.maxAbs 1.25e-1 waves
- tolerance: synthetic.zero 0 elements
- opticalPath.maxAbs 1.56e-2 waves; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### r4

- tolerance: mtf.maxAbs 1.25e-1 1
- tolerance: synthetic.zero 0 elements
- mtf.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### r4f

- tolerance: mtf.maxAbs 1.25e-1 1
- tolerance: synthetic.zero 0 elements
- mtf.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / replay at field 0; measured request pairs 16
- synthetic.zero 0 elements; benchmark / artificial-line; lv / replay; measured request pairs 16

#### r5

- attention: chiefLanding.maxAbs 1.56e-2 mm
- attention: mtfOffAxis.maxAbs 1.25e-1 1
- attention: mtfOnAxis.maxAbs 6.25e-2 1
- mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland at cut sagittal, field 0, frequencyPerMm 10; measured request pairs 1

#### r5g

- attention: chiefLanding.maxAbs 1.56e-2 mm
- attention: mtfOffAxis.maxAbs 1.25e-1 1
- attention: mtfOnAxis.maxAbs 6.25e-2 1
- mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland at cut sagittal, field 0, frequencyPerMm 10; measured request pairs 2

#### r6a

- tolerance: synthetic.zero 0 elements
- tolerance: waveMtf.maxAbs 1.25e-1 1
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32
- waveMtf.maxAbs 1.56e-2 1; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 16

#### r6b

- attention: chiefLanding.maxAbs 1.56e-2 mm
- attention: mtfOffAxis.maxAbs 1.25e-1 1
- attention: mtfOnAxis.maxAbs 6.25e-2 1
- mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / wave at cut sagittal, field 0, frequencyPerMm 10; measured request pairs 2

#### r6c

- attention: chiefLanding.maxAbs 1.56e-2 mm
- attention: mtfOffAxis.maxAbs 1.25e-1 1
- attention: mtfOnAxis.maxAbs 6.25e-2 1
- mtfOnAxis.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 0, frequencyPerMm 10; measured request pairs 2

## External diffraction counterparts

Both external diffraction counterparts are recorded side by side, with no preference claimed. Row counts include every requested field, cut and frequency at the last recorded sampling, including unavailable and set-aside rows; their classes and statuses are counted separately. Coverage lists the requested LV lines and the lines each counterpart answered, by named state and request.

| Rung | Counterpart | Configurations | Rows | Classes | Worst in band | Worst set aside |
|---|---|---:|---:|---|---|---|
| r5 | optiland | 2 | 24 | {"method":4,"numerical":4,"unsupported":16} | mtf.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland at cut sagittal, field 0, frequencyPerMm 10 | mtf.maxAbs 3.75e-1 1; benchmark / artificial-line; lv / optiland at cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| r6c | optiland-wave | 2 | 24 | {"method":8,"numerical":8,"unsupported":8} | mtf.maxAbs 1.25e-1 1; benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 0, frequencyPerMm 10 | mtf.maxAbs 3.75e-1 1; benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 5.00e-1, frequencyPerMm 10 |

### r5: optiland

- LV requested lines (nm): 400, 500, 600
- Counterpart answered lines (nm): 500
- Requested fields: 0, 0.5, 1
- Configurations with banded rows: 1
- Selected chief-landing sorting limits (mm): 1.56e-2
- Frequencies (cycles/mm): 0, 10
- Row statuses: {"ATTENTION":2,"RECORDED":2,"SET ASIDE":4,"UNSUPPORTED":16}

| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | artificial-line / 0 | 500 | 500 | 0: method / two-methods; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.56e-2 | ATTENTION |
| benchmark | artificial-several / 0 | 400, 600 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.56e-2 | UNSUPPORTED |

### r6c: optiland-wave

- LV requested lines (nm): 400, 500, 600
- Counterpart answered lines (nm): 400, 500, 600
- Requested fields: 0, 0.5, 1
- Configurations with banded rows: 2
- Selected chief-landing sorting limits (mm): 1.56e-2
- Frequencies (cycles/mm): 0, 10
- Row statuses: {"ATTENTION":4,"RECORDED":4,"SET ASIDE":8,"UNSUPPORTED":8}

| Suite | State / request | LV lines (nm) | Counterpart lines (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | artificial-line / 0 | 500 | 500 | 0: method / two-methods; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.56e-2 | ATTENTION |
| benchmark | artificial-several / 0 | 400, 600 | 400, 600 | 0: method / two-methods; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.56e-2 | ATTENTION |

## States by suite

These are the states as the baselines name them, with their case hashes or coded source refusals. The baselines do not retain numeric slider positions, stop radii or image-plane shifts; those cannot be reconstructed here. The wavelength inventory is the union explicitly retained in the benchmark's recorded diffraction answers; other suites' per-line wavelengths are not retained in these baselines.

### benchmark

- Declared: 2; configurations: 2; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb | yes |
| artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc | yes |

### features

- Declared: 2; configurations: 2; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb | yes |
| artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc | yes |

### states

- Declared: 2; configurations: 2; refused: 0

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb | yes |
| artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc | yes |

### focus-stations

- Declared: 3; configurations: 2; refused: 1

| Named state | Case SHA-256 / refusal | Measured on R2/R3/R4/R6a for both LV/external pairs |
|---|---|---|
| artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb | yes |
| artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc | yes |
| refused-artificial | finite-conjugate-unavailable | no |

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

- baselines/benchmark.json: 11298f1ae1775648217b51d7461c687d2c8e3c34a40ec385954ef4f7dfd47460
- baselines/benchmark.mtf.json: 843d39766f6ba05e2cc922536108751f22a6dab181777d4254471e5cfafa9128
- baselines/features.json: 0c1cf93a913a05e592c0bb7a61fb144a33e88e52b4c57c01b327b7c011b39b0e
- baselines/features.mtf.json: 0576b518837206459e11bf659da06e8ac7c50ae0ef3696e776ff635abee41bd8
- baselines/states.json: a7bedfba219cf7528667347c186d8da3ea71faa6213233f04344c5491bac650a
- baselines/states.mtf.json: 16f5f7680a07f7683da87c38156d6cfdef65ad26264a772b7317e3e6a1111b04
- baselines/focus-stations.json: 79fa96e8a3180d71101c2dbdbc83d35577ac6a1fe6b00a04a306aa120bd4f1c9
- baselines/focus-stations.mtf.json: 606dbc2ef9d6945343e402947497d55b48f765f4774f648d5b7bd51216fb7f4b
