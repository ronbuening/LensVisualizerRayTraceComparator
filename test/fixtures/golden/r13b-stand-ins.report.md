# Comparison report: r13b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r13b-stand-ins |
| Suite hash | a179716fbc805a8ae2c69c91d1a5e16e0d4cfcc2ecd5bacb9ae4f5c627d181da |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | c52db6298c7fa1980246196311e3d3b817ad0cb8448810be658b5c5394ca8409 |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |
| ref-seidel | available | 1 | 548bba63ec0e2e7171ac9a2a0f93034b62728ae0681c5f0f6caad223033b6dfa |

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

| Run | Check | optiland | ref-seidel |
|---|---|---|---|
| lens | r13b | ok | ok |

## Results

### lens

#### Seidel sums beside optiland's — `r13b`

Quantity `seidel.native`: each engine's own method; side by side, no limit. Request `092ccb779e696cb2dd8a8bf72ba3e56f02b82f449d26a26bba6c92924b997455`.

Reference vs each, against `optiland`:

| Engine | ASTI.maxAbs [mm] | CLA.maxAbs [mm] | COMA.maxAbs [mm] | CTR.maxAbs [mm] | DIST.maxAbs [mm] | FCUR.maxAbs [mm] | SPHA.maxAbs [mm] | invariant.maxAbs (band 3.00e-14 mm) | surfaces.maxAbs [mm] | total.maxScaled (band 8.00e-15) | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ref-seidel | 0 | — | 0 | — | 0 | 0 | 9.31e-10 | 0 | 9.31e-10 at sum SPHA, surface 0 | 1.24e-9 at sum SPHA | ATTENTION | total.maxScaled 1.24e-9 is outside its attention band 8.00e-15 at sum SPHA; CLA.maxAbs was not measured: optiland-seidels states none; CTR.maxAbs was not measured: optiland-seidels states none |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | optiland | ref-seidel |
|---|---|---|
| optiland | — | ATTENTION (total.maxScaled 1.24e-9 at sum SPHA) |
| ref-seidel | ATTENTION (total.maxScaled 1.24e-9 at sum SPHA) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | optiland | ref-seidel |
|---|---|---|
| ASTI[0] | 6.25000000e-2 | 6.25000000e-2 |
| CLA[0] | not finite | 2.50000000e-1 |
| COMA[0] | 1.25000000e-1 | 1.25000000e-1 |
| CTR[0] | not finite | 6.25000000e-2 |
| DIST[0] | 1.56250000e-2 | 1.56250000e-2 |
| FCUR[0] | 1.25000000e-1 | 1.25000000e-1 |
| SPHA[0] | 2.50000001e-1 | 2.50000000e-1 |
| W020[0] | not finite | 2.12743579e2 |
| W040[0] | 5.31858949e1 | 5.31858947e1 |
| W111[0] | not finite | 1.06371789e2 |
| W131[0] | 1.06371789e2 | 1.06371789e2 |
| W220P[0] | 5.31858947e1 | 5.31858947e1 |
| W222[0] | 5.31858947e1 | 5.31858947e1 |
| W311[0] | 1.32964737e1 | 1.32964737e1 |
| invariant[0] | 1.25000000e0 | 1.25000000e0 |
| line[0] | 0 | 0 |
| marginalSlopeImageSpace[0] | -1.25000000e-1 | -1.25000000e-1 |
| maxFieldDeg[0] | 20 | 20 |
| settled[0] | 1 | 1 |
| wavelengthNm[0] | 5.87561800e2 | 5.87561800e2 |

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
