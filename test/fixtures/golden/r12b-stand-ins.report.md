# Comparison report: r12b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r12b-stand-ins |
| Suite hash | 51b2ad854e02a30921f72fd84d86379f887f06737f77337a2f0f39f92349209b |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | 65a29756a648447b22454e2e9a7bccaaaf9796472106d238b2af6a868c8cec52 |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| lv | available | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |

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

| Run | Check | lv | optiland |
|---|---|---|---|
| lens | summary-vs-optiland | ok | ok |

## Results

### lens

#### Summary beside optiland's — `summary-vs-optiland`

Quantity `summary.native`: each engine's own method; side by side, no limit. Request `913908b1d3392f9874a12d7fc3c3e60e81e371870583270462decac9f17d488f`.

Reference vs each, against `lv`:

| Engine | entrancePupilDiameter.maxAbs (band 2.00e-12 mm) | focalLength.maxAbs [mm] | imageSpaceFNumber.maxAbs (band 2.00e-13) | paraxialWorkingFNumber.maxAbs (band 2.00e-13) | rearFocus.maxAbs (band 1.00e-5 mm) | stopDiameter.maxAbs [mm] | totalTrack.maxAbs [mm] | workingFNumber.maxAbs (band 7.00e-8) | lines.compared [elements] | lines.data [elements] | lines.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 1.56e-2 at line 0 | 0 at line 0 | 4.94e-3 at line 0 | — | 2.44e-4 at line 1 | 0 at line 0 | 0 at line 0 | — | 1 | 1 | 0 | ATTENTION | entrancePupilDiameter.maxAbs 1.56e-2 is outside its attention band 2.00e-12 at line 0; imageSpaceFNumber.maxAbs 4.94e-3 is outside its attention band 2.00e-13 at line 0; rearFocus.maxAbs 2.44e-4 is outside its attention band 1.00e-5 at line 1; paraxialWorkingFNumber.maxAbs was not measured: lv-summary-tab states none; workingFNumber.maxAbs was not measured: lv-summary-tab states none; line 1: data, chief-landing-apart (the rear focal points lie 2.44e-4 mm apart) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | ATTENTION (imageSpaceFNumber.maxAbs 4.94e-3 at line 0) |
| optiland | ATTENTION (imageSpaceFNumber.maxAbs 4.94e-3 at line 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| entrancePupilDiameterMm[0] | 1.26406250e1 | 1.26250000e1 |
| entrancePupilDiameterMm[1] | 1.26250000e1 | 1.26250000e1 |
| exitPupilDiameterMm[0] | — | 1.45000000e1 |
| exitPupilDiameterMm[1] | — | 1.45000000e1 |
| focalLengthMm[0] | 5.05000000e1 | 5.05000000e1 |
| focalLengthMm[1] | 5.05000000e1 | 5.05000000e1 |
| halfFieldDeg[0] | 2.25000000e1 | not finite |
| halfFieldDeg[1] | 2.25000000e1 | not finite |
| imageSpaceFNumber[0] | 3.99505562e0 | 4 |
| imageSpaceFNumber[1] | 4 | 4 |
| line[0] | 0 | 0 |
| line[1] | 1 | 1 |
| lvThinLensEffectiveFNumber[0] | 4.25000000e0 | — |
| lvThinLensEffectiveFNumber[1] | 4.25000000e0 | — |
| nominalFNumber[0] | 4.25000000e0 | not finite |
| nominalFNumber[1] | 4.25000000e0 | not finite |
| paraxialWorkingFNumber[0] | not finite | 4 |
| paraxialWorkingFNumber[1] | not finite | 4 |
| rearFocalZ[0] | 5.85000000e1 | 5.85000000e1 |
| rearFocalZ[1] | 5.85000000e1 | 5.85002441e1 |
| settled[0] | 1 | 1 |
| settled[1] | 1 | 1 |
| stopDiameterMm[0] | 6 | 6 |
| stopDiameterMm[1] | 6 | 6 |
| totalTrackMm[0] | 60 | 60 |
| totalTrackMm[1] | 60 | 60 |
| wavelengthNm[0] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[1] | 5.37561800e2 | 5.37561800e2 |
| wideOpenNominalEntrancePupilDiameterMm[0] | not finite | — |
| wideOpenNominalEntrancePupilDiameterMm[1] | 1.18750000e1 | — |
| workingFNumber[0] | not finite | 4.12500000e0 |
| workingFNumber[1] | not finite | 4.12500000e0 |

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
