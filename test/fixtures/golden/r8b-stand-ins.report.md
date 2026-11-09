# Comparison report: r8b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r8b-stand-ins |
| Suite hash | 1ef05bb587a3687cdceca3e07923c3ca39f1e0489565bac0c154a1a18c9f563f |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | 2c33b876579870531ff8ec94116d71639f8129e757d3d0cba31d8342ce7b33b4 |

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

No pair is Fail or Error, of 4 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 1 | 1 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Check | lv | optiland |
|---|---|---|---|
| lens | axial-vs-optiland, request 1 of 2 | ok | ok |
| lens | axial-vs-optiland, request 2 of 2 | ok | ok |

## Results

### lens

#### Spherical aberration and axial colour beside optiland's — `axial-vs-optiland`, request 1 of 2

Quantity `axial.native`: each engine's own method; side by side, no limit. Request `b9e04ea6a0958ec5024aed1f0c408f2392cb4efe2766ac2992dcc97adc39dc8e`.

Reference vs each, against `lv`:

| Engine | bestFocus.maxAbs (band 1.00e-10 mm) | bestFocusRms.maxAbs (band 1.00e-10 mm) | landing.maxAbs (band 1.00e-5 mm) | lineFocus.maxAbs [mm] | longitudinalSa.maxAbs (band 1.00e-10 mm) | marginalIntercept.maxAbs (band 1.00e-10 mm) | nearAxisIntercept.maxAbs (band 1.00e-10 mm) | paraxialFocalShift.maxAbs [mm] | profile.maxAbs (band 1.00e-10 mm) | pupilRadius.relative (band 2.00e-10) | relativeFocus.maxAbs [mm] | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at line 0 | 0 at line 0 | 0 at line 0 | — | 9.77e-4 at line 0 | 0 at line 0 | 9.77e-4 at line 0 | — | 0 at line 0, ray 0 | 0 | — | 1 | 0 | 0 | ATTENTION | longitudinalSa.maxAbs 9.77e-4 is outside its attention band 1.00e-10 at line 0; nearAxisIntercept.maxAbs 9.77e-4 is outside its attention band 1.00e-10 at line 0 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | ATTENTION (longitudinalSa.maxAbs 9.77e-4 at line 0) |
| optiland | ATTENTION (longitudinalSa.maxAbs 9.77e-4 at line 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| bestFocusRmsMm[0] | 1.85546200e-1 | 1.85546200e-1 |
| bestFocusZ[0] | 5.91643804e1 | 5.91643804e1 |
| landingMm[0] | 0 | 0 |
| line[0] | 0 | 0 |
| marginalFraction[0] | 1 | 1 |
| marginalInterceptZ[0] | 59 | 59 |
| nearAxisInterceptZ[0] | 5.99384766e1 | 5.99375000e1 |
| paraxialFocusZ[0] | not finite | 5.97500000e1 |
| profileMm[0] | 0 | 0 |
| profileMm[1] | 8.46577949e-2 | 8.46577949e-2 |
| profileMm[2] | -3.01712317e-1 | -3.01712317e-1 |
| pupilRadiusMm[0] | 8 | 8 |
| settled[0] | 1 | 1 |
| wavelengthNm[0] | 5.87561800e2 | 5.87561800e2 |

#### Spherical aberration and axial colour beside optiland's — `axial-vs-optiland`, request 2 of 2

Quantity `axial.native`: each engine's own method; side by side, no limit. Request `4d86ea45b37bb3ad3b714a88df31256288077b97bf6826f923e83dcc557a1539`.

Reference vs each, against `lv`:

| Engine | bestFocus.maxAbs (band 1.00e-10 mm) | bestFocusRms.maxAbs (band 1.00e-10 mm) | landing.maxAbs (band 1.00e-5 mm) | lineFocus.maxAbs [mm] | longitudinalSa.maxAbs (band 1.00e-10 mm) | marginalIntercept.maxAbs (band 1.00e-10 mm) | nearAxisIntercept.maxAbs (band 1.00e-10 mm) | paraxialFocalShift.maxAbs [mm] | profile.maxAbs (band 1.00e-10 mm) | pupilRadius.relative (band 2.00e-10) | relativeFocus.maxAbs [mm] | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | — | — | 9.39e-7 at line 1 | 9.54e-7 at line 1 | — | — | — | 1.56e-2 at line 1 | — | 0 | 9.54e-7 at line 1 | 2 | 0 | 0 | RECORDED |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | RECORDED (landing.maxAbs 9.39e-7 at line 1) |
| optiland | RECORDED (landing.maxAbs 9.39e-7 at line 1) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| indexMaxDelta[0] | not finite | — |
| indexMaxDelta[1] | 0 | — |
| landingMm[0] | -8.88888889e-1 | -8.88888889e-1 |
| landingMm[1] | -8.73482597e-1 | -8.73483536e-1 |
| line[0] | 0 | 0 |
| line[1] | 1 | 1 |
| marginalFraction[0] | 1 | 1 |
| marginalFraction[1] | 1 | 1 |
| marginalInterceptZ[0] | 59 | 59 |
| marginalInterceptZ[1] | 5.90156260e1 | 5.90156250e1 |
| paraxialFocusZ[0] | not finite | 5.97500000e1 |
| paraxialFocusZ[1] | not finite | 5.97812500e1 |
| pupilRadiusMm[0] | 8 | 8 |
| settled[0] | 1 | 1 |
| settled[1] | 1 | 1 |
| wavelengthNm[0] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[1] | 5.37561800e2 | 5.37561800e2 |

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
