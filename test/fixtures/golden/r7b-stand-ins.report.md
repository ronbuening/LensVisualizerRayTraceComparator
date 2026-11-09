# Comparison report: r7b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r7b-stand-ins |
| Suite hash | 8ff478540d752a79710858c275a1bc087220e296a3c88ca5b240331a4b407bdd |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | f461c0312598cb69e2fb201158814adc00c58d1ddc26d5c0a98ed328bc6f075f |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| lv | available | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |

### Runs

| Run | Lens state | Status |
|---|---|---|
| singlet | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 | run |
| double-gauss | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a | run |

## Verdict summary

No pair is Fail or Error, of 8 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 3 | 3 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Check | lv | optiland |
|---|---|---|---|
| singlet | r7b, request 1 of 2 | ok | ok |
| singlet | r7b, request 2 of 2 | ok | ok |
| double-gauss | r7b, request 1 of 2 | ok | ok |
| double-gauss | r7b, request 2 of 2 | ok | ok |

## Results

### singlet

#### Spots and fans beside optiland's — `r7b`, request 1 of 2

Quantity `spot.native`: each engine's own method; side by side, no limit. Request `d2aca2992060b45019302ddbc42e36d6e21f05b69fca590ecb738dc3ecd19192`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 1.00e-5 mm) | fanError.maxAbs (band 9.00e-10 mm) | spotCentroid.maxAbs [mm] | spotRmsRadius.maxAbs [mm] | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 0 | — | 7.81e-3 at field 7.50e-1 | 1.95e-3 at field 7.50e-1 | 3 | 0 | 0 | RECORDED |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | RECORDED (chiefLanding.maxAbs 0 at field 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| centroidXMm[0] | 0 | 0 |
| centroidXMm[1] | 0 | 0 |
| centroidXMm[2] | 0 | 0 |
| centroidYMm[0] | 0 | 0 |
| centroidYMm[1] | -3.12500000e-2 | -3.51562500e-2 |
| centroidYMm[2] | -6.25000000e-2 | -5.46875000e-2 |
| field[0] | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 7.50000000e-1 | 7.50000000e-1 |
| fieldAngleDeg[0] | 0 | 0 |
| fieldAngleDeg[1] | 10 | 10 |
| fieldAngleDeg[2] | 15 | 15 |
| imageHeightMm[0] | 0 | 0 |
| imageHeightMm[1] | 8 | 8 |
| imageHeightMm[2] | 12 | 12 |
| lineWavelengthNm[0] | 5.87500000e2 | 5.87500000e2 |
| raysLanded[0] | 25 | 25 |
| raysLanded[1] | 25 | 25 |
| raysLanded[2] | 25 | 25 |
| raysLaunched[0] | 25 | 25 |
| raysLaunched[1] | 25 | 25 |
| raysLaunched[2] | 25 | 25 |
| rmsRadiusMm[0] | 1.56250000e-2 | 1.66015625e-2 |
| rmsRadiusMm[1] | 6.25000000e-2 | 6.25000000e-2 |
| rmsRadiusMm[2] | 1.25000000e-1 | 1.26953125e-1 |
| settled[0] | 1 | 1 |
| settled[1] | 1 | 1 |
| settled[2] | 1 | 1 |

#### Spots and fans beside optiland's — `r7b`, request 2 of 2

Quantity `spot.native`: each engine's own method; side by side, no limit. Request `cf379781ab01337c5c1d71897ecf40fabc0e90df207dba13b8dd1b6575287e61`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 1.00e-5 mm) | fanError.maxAbs (band 9.00e-10 mm) | spotCentroid.maxAbs [mm] | spotRmsRadius.maxAbs [mm] | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | fanSamples.unpaired [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 7.50e-1 | 3.91e-3 at field 7.50e-1, ray 1 | — | — | 1 | 0 | 0 | 2 | ATTENTION | fanError.maxAbs 3.91e-3 is outside its attention band 9.00e-10 at field 7.50e-1, ray 1 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | ATTENTION (fanError.maxAbs 3.91e-3 at field 7.50e-1, ray 1) |
| optiland | ATTENTION (fanError.maxAbs 3.91e-3 at field 7.50e-1, ray 1) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| fanErrorMm[0] | not finite | -2.50000000e-1 |
| fanErrorMm[1] | -1.25000000e-1 | -1.21093750e-1 |
| fanErrorMm[2] | 0 | 0 |
| fanErrorMm[3] | 2.50000000e-1 | 2.50000000e-1 |
| fanErrorMm[4] | 5.00000000e-1 | not finite |
| fanPupil[0] | -1 | -1 |
| fanPupil[1] | -5.00000000e-1 | -5.00000000e-1 |
| fanPupil[2] | 0 | 0 |
| fanPupil[3] | 5.00000000e-1 | 5.00000000e-1 |
| fanPupil[4] | 1 | 1 |
| field[0] | 7.50000000e-1 | 7.50000000e-1 |
| fieldAngleDeg[0] | 15 | 15 |
| imageHeightMm[0] | 12 | 12 |
| lineWavelengthNm[0] | 5.87500000e2 | 5.87500000e2 |
| raysLanded[0] | 4 | 4 |
| raysLaunched[0] | 5 | 5 |
| settled[0] | 1 | 1 |

### double-gauss

#### Spots and fans beside optiland's — `r7b`, request 1 of 2

Quantity `spot.native`: each engine's own method; side by side, no limit. Request `8e2516a7a52a64e23642f22003864000e5849932ceeecb294f220a945fd988c4`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 1.00e-5 mm) | fanError.maxAbs (band 9.00e-10 mm) | spotCentroid.maxAbs [mm] | spotRmsRadius.maxAbs [mm] | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 0 | — | 0 at field 0 | 0 at field 0 | 1 | 1 | 1 | RECORDED | field 0.5: data, chief-landing-unknown (no chief-ray landing from optiland-spot-diagram); field 0.75: unsupported, no-curve (optiland-spot-diagram: unavailable (optiland-raised-ValueError)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | RECORDED (chiefLanding.maxAbs 0 at field 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| centroidXMm[0] | 0 | 0 |
| centroidXMm[1] | 0 | 0 |
| centroidXMm[2] | 0 | not finite |
| centroidYMm[0] | 0 | 0 |
| centroidYMm[1] | -3.12500000e-2 | -3.12500000e-2 |
| centroidYMm[2] | -6.25000000e-2 | not finite |
| field[0] | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 7.50000000e-1 | 7.50000000e-1 |
| fieldAngleDeg[0] | 0 | 0 |
| fieldAngleDeg[1] | 10 | 10 |
| fieldAngleDeg[2] | 15 | 15 |
| imageHeightMm[0] | 0 | 0 |
| imageHeightMm[1] | 8 | not finite |
| imageHeightMm[2] | 12 | not finite |
| lineWavelengthNm[0] | 5.87500000e2 | 5.87500000e2 |
| raysLanded[0] | 25 | 25 |
| raysLanded[1] | 25 | 25 |
| raysLanded[2] | 25 | not finite |
| raysLaunched[0] | 25 | 25 |
| raysLaunched[1] | 25 | 25 |
| raysLaunched[2] | 25 | not finite |
| rmsRadiusMm[0] | 1.56250000e-2 | 1.56250000e-2 |
| rmsRadiusMm[1] | 6.25000000e-2 | 6.25000000e-2 |
| rmsRadiusMm[2] | 1.25000000e-1 | not finite |
| settled[0] | 1 | 1 |
| settled[1] | 1 | 1 |
| settled[2] | 1 | not finite |

#### Spots and fans beside optiland's — `r7b`, request 2 of 2

Quantity `spot.native`: each engine's own method; side by side, no limit. Request `24b3fcaaa4044aa0525b5a756189d69aa52e2cb17de909dfc4f4e29a09a6935f`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 1.00e-5 mm) | fanError.maxAbs (band 9.00e-10 mm) | spotCentroid.maxAbs [mm] | spotRmsRadius.maxAbs [mm] | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | fanSamples.unpaired [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 7.50e-1 | — | — | — | 0 | 1 | 0 | 0 | RECORDED | fanError.maxAbs was not measured: no field of two methods has figures in both answers; field 0.75: data, lines-differ (the answers are of the lines 546.07 and 587.5 nm) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | RECORDED (chiefLanding.maxAbs 0 at field 7.50e-1) |
| optiland | RECORDED (chiefLanding.maxAbs 0 at field 7.50e-1) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| fanErrorMm[0] | not finite | -2.50000000e-1 |
| fanErrorMm[1] | -1.25000000e-1 | -1.25000000e-1 |
| fanErrorMm[2] | 0 | 0 |
| fanErrorMm[3] | 2.50000000e-1 | 2.50000000e-1 |
| fanErrorMm[4] | 5.00000000e-1 | 5.00000000e-1 |
| fanPupil[0] | -1 | -1 |
| fanPupil[1] | -5.00000000e-1 | -5.00000000e-1 |
| fanPupil[2] | 0 | 0 |
| fanPupil[3] | 5.00000000e-1 | 5.00000000e-1 |
| fanPupil[4] | 1 | 1 |
| field[0] | 7.50000000e-1 | 7.50000000e-1 |
| fieldAngleDeg[0] | 15 | 15 |
| imageHeightMm[0] | 12 | 12 |
| lineWavelengthNm[0] | 5.87500000e2 | 5.46070000e2 |
| raysLanded[0] | 4 | 5 |
| raysLaunched[0] | 5 | 5 |
| settled[0] | 1 | 1 |

## Not covered

What this comparison does not show, whatever its verdicts:

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
