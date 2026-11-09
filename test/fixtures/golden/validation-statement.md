# Validation statement

This statement is rendered from the eight baselines of the benchmark, features, states and focus-stations suites alone, with no engine, clock or machine input. It says what those baselines support, check by check, and what they do not cover.

## Supportable sentence

On 8 configurations across four suites, LensVisualizer, optiland and the reference tracer, given identical indices and apertures, trace the same rays within the gates, and the optical path, geometric MTF and wave MTF computed from those rays agree within theirs: worst landing 0.016 mm (gate 0.125 mm), optical path 0.016 waves (0.125), geometric MTF 0.016 (0.125), wave MTF 0.016 (0.125); the benchmark covers three wavelengths. LensVisualizer's diffraction MTF is recorded beside two external counterparts, with no preference between them: optiland's FFT MTF, of one wavelength, differs by up to 0.13, a difference classed as one of method; the comparator's OTF of optiland's own wavefront, per wavelength and photopic, differs by up to 0.13. Dispersion, white-light weighting beyond the stated lines, focus choice, stop sizing, states not named and the catalog beyond these suites are not covered.

## Checks

A configuration is one named run of one suite, with its lens state; the same lens state in two suites counts twice, and check r4, which is in both the ray and the MTF baselines, counts once. A configuration pair is two engines on one configuration and one check; a request pair is two engines on one request. The verdict counts count request pairs, answers that were not computed included; a refused lens state has no pairs.

The worst residual of a check held to a limit is the figure largest as a fraction of its own limit; a limit of zero ranks a value of zero at zero and any value above it above every finite ratio. The largest value of each figure is also listed in its own units. The worst of a side-by-side check is the largest MTF difference among the rows that have a review band, over every pair of that check; the differences set aside are listed apart for each external diffraction counterpart. The measured request counts of check r6a leave out fields set aside for their phase step or convergence, even where the verdict of the request is Pass.

The supportable sentence's figures are over the configurations it counts, while the table's figures are over every configuration of each check.

| Check | Id | Compares | Kind | Configurations | Configuration pairs | Request pairs | Verdicts | Worst residual |
|---|---|---|---|---:|---:|---:|---|---|
| Built system | `r0` | Built layout, shape, aperture, index and sampled sag | held to a limit | 8 | 16 | 32 | 32 Pass | synthetic.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0 |
| First-order data | `r1` | First-order quantities and pupils | held to a limit | 8 | 16 | 32 | 32 Pass | synthetic.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0 |
| Ray trace | `r2` | Hits, directions, image landings and masks of identical rays | held to a limit | 8 | 16 | 32 | 32 Pass | landing.maxDistance 1.56e-2 mm; benchmark / artificial-line; lv / optiland at field 0 |
| Optical path | `r3` | Optical path, path to image and chief-relative OPD of identical rays | held to a limit | 8 | 16 | 32 | 32 Pass | opticalPath.maxAbs 1.56e-2 waves; benchmark / artificial-line; lv / optiland at field 0 |
| Geometric MTF of the same rays | `r4` | This tool's geometric MTF of identical rays, as each engine traces them | held to a limit | 8 | 16 | 32 | 32 Pass | mtf.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0 |
| LensVisualizer's MTF sampling, replayed | `r4f` | LensVisualizer's geometric MTF beside a replay of its own sampling | held to a limit | 8 | 8 | 16 | 16 Pass | mtf.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / replay at field 0 |
| MTF beside optiland's FFT MTF | `r5` | LensVisualizer's diffraction MTF beside optiland's FFT MTF and the wave estimate of LensVisualizer's rays | side by side, no limit | 2 | 2 | 2 | 1 Side by side, worth a look; 1 Not computed | mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| Geometric MTF beside optiland's | `r5g` | Geometric MTF on each method's own pupil sampling | side by side, no limit | 2 | 2 | 2 | 2 Side by side, worth a look | mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| Wave MTF of the same rays | `r6a` | This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled | held to a limit | 8 | 16 | 32 | 32 Pass | waveMtf.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0 |
| MTF beside the wave estimate of LensVisualizer's rays | `r6b` | LensVisualizer's sheared diffraction MTF beside this tool's wave OTF of LensVisualizer's rays | side by side, no limit | 2 | 2 | 2 | 2 Side by side, worth a look | mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / wave at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront | `r6c` | LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts | side by side, no limit | 2 | 2 | 2 | 2 Side by side, worth a look | mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 0 of the image height, frequencyPerMm 10 |

### Limits and largest values

#### Built system — `r0`

- limit: synthetic.maxAbs 1.25e-1 (no unit)
- limit: synthetic.zero 0 elements
- synthetic.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### First-order data — `r1`

- limit: synthetic.maxAbs 1.25e-1 (no unit)
- limit: synthetic.zero 0 elements
- synthetic.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### Ray trace — `r2`

- limit: landing.maxDistance 1.25e-1 mm
- limit: synthetic.zero 0 elements
- landing.maxDistance 1.56e-2 mm; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### Optical path — `r3`

- limit: opticalPath.maxAbs 1.25e-1 waves
- limit: synthetic.zero 0 elements
- opticalPath.maxAbs 1.56e-2 waves; benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### Geometric MTF of the same rays — `r4`

- limit: mtf.maxAbs 1.25e-1 (no unit)
- limit: synthetic.zero 0 elements
- mtf.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0; measured request pairs 32
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32

#### LensVisualizer's MTF sampling, replayed — `r4f`

- limit: mtf.maxAbs 1.25e-1 (no unit)
- limit: synthetic.zero 0 elements
- mtf.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / replay at field 0; measured request pairs 16
- synthetic.zero 0 elements; benchmark / artificial-line; lv / replay; measured request pairs 16

#### MTF beside optiland's FFT MTF — `r5`

- sorting limit: chiefLanding.maxAbs 1.56e-2 mm
- review band: mtfOffAxis.maxAbs 1.25e-1 (no unit)
- review band: mtfOnAxis.maxAbs 6.25e-2 (no unit)
- mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland at cut sagittal, field 0 of the image height, frequencyPerMm 10; measured request pairs 1

#### Geometric MTF beside optiland's — `r5g`

- sorting limit: chiefLanding.maxAbs 1.56e-2 mm
- review band: mtfOffAxis.maxAbs 1.25e-1 (no unit)
- review band: mtfOnAxis.maxAbs 6.25e-2 (no unit)
- mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland at cut sagittal, field 0 of the image height, frequencyPerMm 10; measured request pairs 2

#### Wave MTF of the same rays — `r6a`

- limit: synthetic.zero 0 elements
- limit: waveMtf.maxAbs 1.25e-1 (no unit)
- synthetic.zero 0 elements; benchmark / artificial-line; lv / optiland; measured request pairs 32
- waveMtf.maxAbs 1.56e-2 (no unit); benchmark / artificial-line; lv / optiland at field 0; measured request pairs 16

#### MTF beside the wave estimate of LensVisualizer's rays — `r6b`

- sorting limit: chiefLanding.maxAbs 1.56e-2 mm
- review band: mtfOffAxis.maxAbs 1.25e-1 (no unit)
- review band: mtfOnAxis.maxAbs 6.25e-2 (no unit)
- mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / wave at cut sagittal, field 0 of the image height, frequencyPerMm 10; measured request pairs 2

#### MTF beside the OTF of optiland's wavefront — `r6c`

- sorting limit: chiefLanding.maxAbs 1.56e-2 mm
- review band: mtfOffAxis.maxAbs 1.25e-1 (no unit)
- review band: mtfOnAxis.maxAbs 6.25e-2 (no unit)
- mtfOnAxis.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 0 of the image height, frequencyPerMm 10; measured request pairs 2

## External diffraction counterparts

Both external diffraction counterparts are set side by side with LensVisualizer, with no preference claimed. Row counts include every requested field, cut and frequency at the last sampling written down, rows not computed and rows set aside included; their classes and statuses are counted apart. The coverage lists the wavelengths requested of LensVisualizer and the wavelengths each counterpart answered, by named state and request.

| Check | Counterpart | Configurations | Rows | Rows by class | Worst of the rows with a review band | Worst set aside |
|---|---|---:|---:|---|---|---|
| MTF beside optiland's FFT MTF — `r5` | optiland | 2 | 24 | 4 the methods differ (`method`); 4 not converged (`numerical`); 16 not computed by one engine (`unsupported`) | mtf.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland at cut sagittal, field 0 of the image height, frequencyPerMm 10 | mtf.maxAbs 3.75e-1 (no unit); benchmark / artificial-line; lv / optiland at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | optiland-wave | 2 | 24 | 8 the methods differ (`method`); 8 not converged (`numerical`); 8 not computed by one engine (`unsupported`) | mtf.maxAbs 1.25e-1 (no unit); benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 0 of the image height, frequencyPerMm 10 | mtf.maxAbs 3.75e-1 (no unit); benchmark / artificial-line; lv / optiland-wave at cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |

### MTF beside optiland's FFT MTF — `r5`: optiland

- Wavelengths asked of LensVisualizer (nm): 400, 500, 600
- Wavelengths the counterpart answered (nm): 500
- Fields requested: 0, 0.5, 1
- Configurations with rows that have a review band: 1
- Chief-landing sorting limits (mm): 1.56e-2
- Frequencies (cycles/mm): 0, 10
- Rows by status: 2 Side by side, worth a look (`ATTENTION`); 2 Side by side (`RECORDED`); 4 Set aside (`SET ASIDE`); 16 Not computed (`UNSUPPORTED`)

| Suite | Named state / request | LensVisualizer wavelengths (nm) | Counterpart wavelengths (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | artificial-line / 0 | 500 | 500 | 0: method / two-methods; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.56e-2 | Side by side, worth a look |
| benchmark | artificial-several / 0 | 400, 600 |  | 0: unsupported / no-curve; 0.5: unsupported / no-curve; 1: unsupported / no-curve | 1.56e-2 | Not computed |

### MTF beside the OTF of optiland's wavefront — `r6c`: optiland-wave

- Wavelengths asked of LensVisualizer (nm): 400, 500, 600
- Wavelengths the counterpart answered (nm): 400, 500, 600
- Fields requested: 0, 0.5, 1
- Configurations with rows that have a review band: 2
- Chief-landing sorting limits (mm): 1.56e-2
- Frequencies (cycles/mm): 0, 10
- Rows by status: 4 Side by side, worth a look (`ATTENTION`); 4 Side by side (`RECORDED`); 8 Set aside (`SET ASIDE`); 8 Not computed (`UNSUPPORTED`)

| Suite | Named state / request | LensVisualizer wavelengths (nm) | Counterpart wavelengths (nm) | Fields / classes / reasons | Landing sorting limit (mm) | Verdict |
|---|---|---|---|---|---|---|
| benchmark | artificial-line / 0 | 500 | 500 | 0: method / two-methods; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.56e-2 | Side by side, worth a look |
| benchmark | artificial-several / 0 | 400, 600 | 400, 600 | 0: method / two-methods; 0.5: numerical / unconverged; 1: unsupported / no-curve | 1.56e-2 | Side by side, worth a look |

## Lens states by suite

These are the lens states as the baselines name them, each with the code of its refusal where it was refused; the hash of each lens state that was run is under Identifiers. The baselines do not keep slider positions, stop radii or image-plane shifts as numbers, so those cannot be given here. The wavelengths listed are those the benchmark's diffraction answers keep; the other suites' baselines keep no wavelength.

### benchmark

2 named states are declared, 2 are run with a lens state, and 0 are refused.

| Named state | Refusal | Measured on r2, r3, r4 and r6a for both pairs of LensVisualizer and an external engine |
|---|---|---|
| artificial-line | — | yes |
| artificial-several | — | yes |

### features

2 named states are declared, 2 are run with a lens state, and 0 are refused.

| Named state | Refusal | Measured on r2, r3, r4 and r6a for both pairs of LensVisualizer and an external engine |
|---|---|---|
| artificial-line | — | yes |
| artificial-several | — | yes |

### states

2 named states are declared, 2 are run with a lens state, and 0 are refused.

| Named state | Refusal | Measured on r2, r3, r4 and r6a for both pairs of LensVisualizer and an external engine |
|---|---|---|
| artificial-line | — | yes |
| artificial-several | — | yes |

### focus-stations

3 named states are declared, 2 are run with a lens state, and 1 are refused.

| Named state | Refusal | Measured on r2, r3, r4 and r6a for both pairs of LensVisualizer and an external engine |
|---|---|---|
| artificial-line | — | yes |
| artificial-several | — | yes |
| refused-artificial | finite-conjugate-unavailable | no |

## Not covered

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so check r5 sets two methods side by side and holds them to no limit.

- A polychromatic curve of optiland's FFT class. It gives the modulus at one wavelength, so a run of several wavelengths has no FFT row in checks r5 or r6c. The external counterpart in check r6c is this tool's complex sum of optiland's raw wavefronts; its proof on synthetic sums checks the declared weighting and phase convention, not physical spectral fidelity.

- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Check r5g sets the two side by side and holds them to no limit: a difference of the two pupil samplings is written down, not explained.

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
| baselines/benchmark.json | 11298f1ae1775648217b51d7461c687d2c8e3c34a40ec385954ef4f7dfd47460 |
| baselines/benchmark.mtf.json | 843d39766f6ba05e2cc922536108751f22a6dab181777d4254471e5cfafa9128 |
| baselines/features.json | 0c1cf93a913a05e592c0bb7a61fb144a33e88e52b4c57c01b327b7c011b39b0e |
| baselines/features.mtf.json | 0576b518837206459e11bf659da06e8ac7c50ae0ef3696e776ff635abee41bd8 |
| baselines/states.json | a7bedfba219cf7528667347c186d8da3ea71faa6213233f04344c5491bac650a |
| baselines/states.mtf.json | 16f5f7680a07f7683da87c38156d6cfdef65ad26264a772b7317e3e6a1111b04 |
| baselines/focus-stations.json | 79fa96e8a3180d71101c2dbdbc83d35577ac6a1fe6b00a04a306aa120bd4f1c9 |
| baselines/focus-stations.mtf.json | 606dbc2ef9d6945343e402947497d55b48f765f4774f648d5b7bd51216fb7f4b |

| Suite | Named state | Lens state (SHA-256) |
|---|---|---|
| benchmark | artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb |
| benchmark | artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc |
| features | artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb |
| features | artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc |
| states | artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb |
| states | artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc |
| focus-stations | artificial-line | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb |
| focus-stations | artificial-several | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc |
