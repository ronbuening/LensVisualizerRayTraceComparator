# Comparison report: r11b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r11b-stand-ins |
| Suite hash | 5a90f384b839ddb495826ab1d059dc585ea1ea4ecd0f76cb7847a0c348c03aed |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | 3b976037ab80523f01669ab055d17a0994989e10e3d47c15e5c85de438db8fd6 |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| flux-of-lv-rays | available | 1 | a6d5e4d989d61448861d92742dc08908830fd0dd875ecd09ab3469ad9b2892f9 |
| lv | available | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |

### Runs

| Run | Lens state | Status |
|---|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c | run |

## Verdict summary

No pair is Fail or Error, of 2 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Check | flux-of-lv-rays | lv |
|---|---|---|---|
| lens | vignetting-vs-flux-estimate | ok | ok |

## Results

### lens

#### Vignetting beside the flux estimate — `vignetting-vs-flux-estimate`

Quantity `vignetting.native`: each engine's own method; side by side, no limit. Request `0367c7aa3b0b3c519764c40ad79da45fc9d382906565eba0da30f413f2189d96`.

Reference vs each, against `flux-of-lv-rays`:

| Engine | chiefLanding.maxAbs (band 1.00e-5 mm) | geometricTransmission.maxAbs (band 1.00e-2) | falloff.maxAbs | relativeIllumination.maxAbs | fields.compared [elements] | fields.data [elements] | fields.unconverged [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| lv | 2.44e-4 at field 24, line 0 | 6.25e-2 at field 8, line 0 | 7.62e-2 at field 8, line 0 | 1.25e-1 at field 8, line 0 | 2 | 1 | 1 | 0 | ATTENTION | chiefLanding.maxAbs 2.44e-4 is outside its attention band 1.00e-5 at field 24, line 0; geometricTransmission.maxAbs 6.25e-2 is outside its attention band 1.00e-2 at field 8, line 0; line 0, field 16: numerical, unconverged (lattice-flux: unconverged (not-converged)); line 0, field 24: data, chief-landing-apart (the chief rays land 2.44e-4 mm apart) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | flux-of-lv-rays | lv |
|---|---|---|
| flux-of-lv-rays | — | ATTENTION (chiefLanding.maxAbs 2.44e-4 at field 24, line 0) |
| lv | ATTENTION (chiefLanding.maxAbs 2.44e-4 at field 24, line 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | flux-of-lv-rays | lv |
|---|---|---|
| chiefLandingMm[0] | 0 | 0 |
| chiefLandingMm[1] | -4 | -4 |
| chiefLandingMm[2] | -8 | -8 |
| chiefLandingMm[3] | -1.19997559e1 | -12 |
| fieldAngleDeg[0] | 0 | 0 |
| fieldAngleDeg[1] | 8 | 8 |
| fieldAngleDeg[2] | 16 | 16 |
| fieldAngleDeg[3] | 24 | 24 |
| fieldSamples[0] | — | 9 |
| fieldSamples[1] | — | 9 |
| fieldSamples[2] | — | 9 |
| fieldSamples[3] | — | 9 |
| geometricTransmission[0] | 1 | 1 |
| geometricTransmission[1] | 9.37500000e-1 | 8.75000000e-1 |
| geometricTransmission[2] | 5.00000000e-1 | 7.50000000e-1 |
| geometricTransmission[3] | 6.25000000e-1 | 6.25000000e-1 |
| line[0] | 0 | 0 |
| line[1] | 0 | 0 |
| line[2] | 0 | 0 |
| line[3] | 0 | 0 |
| pupilSamples[0] | — | 192 |
| pupilSamples[1] | — | 192 |
| pupilSamples[2] | — | 192 |
| pupilSamples[3] | — | 192 |
| relativeIllumination[0] | 1 | 1 |
| relativeIllumination[1] | 8.75000000e-1 | 7.50000000e-1 |
| relativeIllumination[2] | 5.00000000e-1 | 5.00000000e-1 |
| relativeIllumination[3] | 2.50000000e-1 | 2.50000000e-1 |
| settled[0] | 1 | 1 |
| settled[1] | 1 | 1 |
| settled[2] | 0 | 1 |
| settled[3] | 1 | 1 |
| wavelengthNm[0] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[1] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[2] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[3] | 5.87561800e2 | 5.87561800e2 |

## Not covered

What this comparison does not show, whatever its verdicts:

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

## How to read this

Each pair of engines that answered one request gets one verdict. A table of this report shows its stored value;
this is its label and what it means:

| Label | Stored value | Meaning |
|---|---|---|
| Pass: within limit | `PASS` | A check held to a limit: every judged figure is at or below its limit. |
| Fail: beyond limit | `FAIL` | A check held to a limit: a judged figure is above its limit, or is not a number. |
| Side by side | `RECORDED` | A side-by-side comparison with no limit: the difference is written down, inside its review band or with none. It is not a failure. |
| Side by side, worth a look | `ATTENTION` | A side-by-side comparison with no limit: a figure is outside its review band. It is not a failure. |
| Not computed | `UNSUPPORTED` | One of the two engines cannot compute what was asked. That is an answer, not a failure. |
| Not judged (an earlier check failed) | `BLOCKED` | The pair is not judged, whether or not both engines answered: an earlier check that this one rests on failed or ended in an error for the same two engines and the same lens state. |
| Error | `ERROR` | One of the two engines gave no result, or the two results cannot be compared. |

Only Fail (`FAIL`) and Error (`ERROR`) fail a comparison.
Side by side (`RECORDED`) and Side by side, worth a look (`ATTENTION`) are not failures: a side-by-side check
compares methods that are expected to differ, and its numbers are kept to be read, not held to a limit. Not
judged (`BLOCKED`) is not a second failure: two engines that built different systems would differ in every check
after that one.

A limit is shown in the heading of its figure: `≤` is the limit of a check held to a limit, `band` the review
band of a side-by-side check. A figure
without a limit is shown and not judged. Where its name begins as a judged one's does, it stands beside that
one: `pupilZ.maxAbs`, the plain difference, beside `pupilZ.maxScaled`, the one on the scale that is judged.
Numbers have 3 significant digits, and a whole number, such as a count, is written in full.
A value written down has 9 significant digits, or is a whole number in full, and is named with the index of its
element. `—` marks a place with nothing to compare, and `not finite` a number that is a NaN or an infinity.
The reference-vs-each table and the pairwise matrix judge a pair alike, so a pair that is in both has the same
verdict in both.
