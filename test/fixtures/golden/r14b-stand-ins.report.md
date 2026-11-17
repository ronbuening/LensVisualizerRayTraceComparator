# Comparison report: r14b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r14b-stand-ins |
| Contract version | 1.0 |
| Limits file | v1 |

### Engines

| Engine | Status | Version |
|---|---|---|
| optiland | available | 1 |
| otf-of-optiland-wavefront | available | 1 |

### Runs

| Run | Status |
|---|---|
| lens | run |

## Verdict summary

No pair is Fail or Error, of 2 compared.

| Verdict | against the reference | every pair |
|---|---|---|
| Pass: within limit | 0 | 0 |
| Fail: beyond limit | 0 | 0 |
| Side by side | 1 | 1 |
| Side by side, worth a look | 0 | 0 |
| Not computed | 0 | 0 |
| Not judged (an earlier check failed) | 0 | 0 |
| Error | 0 | 0 |

## Support matrix

| Run | Check | optiland | otf-of-optiland-wavefront |
|---|---|---|---|
| lens | zernike-vs-optiland | ok | ok |

## Results

### lens

#### Zernike fit beside optiland's — `zernike-vs-optiland`

Quantity `zernike.native`: each engine's own method; side by side, no limit.

Reference vs each, against `optiland`:

| Engine | chiefLanding.maxAbs (band 1.00e-9 mm) | coefficients.maxAbs (band 4.00e-11 waves) | fitCondition.max (band 1000000) | fitResidualRms.maxAbs (band 7.00e-16 waves) | pvToChief.maxAbs [waves] | rmsToChief.maxAbs (band 2.00e-16 waves) | fields.compared [elements] | fields.data [elements] | fields.numerical [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| otf-of-optiland-wavefront | 0 at field 0 | 9.09e-13 at field 0, term 4 | 2.50e0 at field 0 | 0 at field 0 | 0 at field 0 | 0 at field 0 | 1 | 0 | 0 | 1 | RECORDED | field 20: unsupported, no-curve (optiland-zernike-fit: unavailable (optiland-raised-ValueError)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | optiland | otf-of-optiland-wavefront |
|---|---|---|
| optiland | — | RECORDED (coefficients.maxAbs 9.09e-13 at field 0, term 4) |
| otf-of-optiland-wavefront | RECORDED (coefficients.maxAbs 9.09e-13 at field 0, term 4) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | optiland | otf-of-optiland-wavefront |
|---|---|---|
| Z1[0] | 1.25000000e-1 | 1.25000000e-1 |
| Z1[1] | not finite | 5.00000000e-1 |
| Z2[0] | 0 | 0 |
| Z2[1] | not finite | 0 |
| Z3[0] | 0 | 0 |
| Z3[1] | not finite | -2.50000000e-1 |
| Z4[0] | 6.25000000e-2 | 6.25000000e-2 |
| Z4[1] | not finite | 1.25000000e-1 |
| fieldAngleDeg[0] | 0 | 0 |
| fieldAngleDeg[1] | 20 | 20 |
| fitCondition[0] | 2.50000000e0 | 2.50000000e0 |
| fitCondition[1] | not finite | 2.50000000e0 |
| fitResidualRmsWaves[0] | 9.53674316e-7 | 9.53674316e-7 |
| fitResidualRmsWaves[1] | not finite | 9.53674316e-7 |
| gridSize[0] | 8 | 8 |
| gridSize[1] | not finite | 8 |
| imageHeightMm[0] | 0 | 0 |
| imageHeightMm[1] | not finite | 8.50000000e0 |
| pvToChiefWaves[0] | 2.50000000e-1 | 2.50000000e-1 |
| pvToChiefWaves[1] | not finite | 2.50000000e-1 |
| rmsToChiefWaves[0] | 6.25000000e-2 | 6.25000000e-2 |
| rmsToChiefWaves[1] | not finite | 6.25000000e-2 |
| settled[0] | 1 | 1 |
| settled[1] | not finite | 1 |
| validSamples[0] | 32 | 32 |
| validSamples[1] | 0 | 32 |

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

Each pair of engines that answered one request gets one verdict. The verdict summary shows its label; the other
tables of this report show its stored value. This is each label, its stored value and what it means:

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

## Identifiers

The hashes that tell one version from another: of the suite file and of the limits file; of each engine's code
and, for an engine of this tool's own, of this tool's code behind it; of each run's lens state; and of each
request a section of the results is of.

| Identifier | Value |
|---|---|
| Suite file | 577c75a2a5045f333ae5d5d38feea947f07faf907cbf3d7825ad297e0396fe00 |
| Limits file | 8f98ac430a9e457454d3c4c7652d69ccf783a9cd1e86a8d54a3d939162bbdd9b |

| Engine | Engine code |
|---|---|
| optiland | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |
| otf-of-optiland-wavefront | 45749fab0ee9a0f72877424d177d5552c5a336c1e156521f21c2660dd96b7820 |

| Run | Lens state |
|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c |

| Run | Check | Request |
|---|---|---|
| lens | zernike-vs-optiland | 4acbe373f999cf47a832553f2e8fd7501f6dd86c5b88e0de059ecffe818ca8cb |
