# Comparison report: r11a-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r11a-stand-ins |
| Contract version | 1.0 |
| Limits file | v1 |

### Engines

| Engine | Status | Version |
|---|---|---|
| moved | available | 1 |
| reference-tracer | available | 1 |
| stopped | available | 1 |
| turned | available | 1 |

### Runs

| Run | Status |
|---|---|
| lens | run |

## Verdict summary

9 of 9 pairs are Fail or Error.

| Verdict | against the reference | every pair |
|---|---|---|
| Pass: within limit | 0 | 0 |
| Fail: beyond limit | 3 | 6 |
| Side by side | 0 | 0 |
| Side by side, worth a look | 0 | 0 |
| Not computed | 0 | 0 |
| Not judged (an earlier check failed) | 0 | 0 |
| Error | 0 | 0 |

## Consensus

A consensus is looked for on each request of a check held to a limit that three or more engines were compared
on, pair by pair. An engine is placed where a pair of it is within or beyond the limits; a pair whose verdict is
Not computed, Not judged or Error places no engine. The consensus is the largest set of placed engines every two
of which are within the limits of each other, where it is the only largest such set and holds more than half of
the engines placed. An outlier is beyond the limits of every engine of the consensus; an engine apart is outside
the consensus and not beyond the limits of all of it. A consensus says which answers are within the limits of
each other, and no more.

Of 1 request with a consensus to look for, 0 have one.

| Requests | Count |
|---|---|
| with a consensus | 0 |
| No consensus: the engines within the limits of each other split into two or more largest sets | 0 |
| No consensus: no two engines are within the limits of each other | 1 |
| No consensus: the largest set of engines within the limits of each other holds no more than half of the engines placed | 0 |

| Engine | In the consensus | Outlier | Apart | Placed, no consensus | Not placed |
|---|---|---|---|---|---|
| moved | 0 | 0 | 0 | 1 | 0 |
| reference-tracer | 0 | 0 | 0 | 1 | 0 |
| stopped | 0 | 0 | 0 | 1 | 0 |
| turned | 0 | 0 | 0 | 1 | 0 |

## Support matrix

| Run | Check | moved | reference-tracer | stopped | turned |
|---|---|---|---|---|---|
| lens | vignetting-rays, request 1 of 3 | ok | ok | ok | ok |
| lens | vignetting-rays, request 2 of 3 | ok | ok | ok | ok |
| lens | vignetting-rays, request 3 of 3 | ok | ok | ok | ok |

## Results

### lens

#### Vignetting rays — `vignetting-rays`, request 1 of 3

Quantity `rays.trace`: one estimator on each engine's trace of the same rays; held to a limit.

Reference vs each, against `reference-tracer`:

| Engine | illumination.maxAbs (≤ 1.00e-9) | landing.maxAbs (≤ 1.00e-8 mm) | mask.mismatches (≤ 0 rays) | mask.rimBand [rays] | transmission.maxAbs (≤ 0) | transmission.rimBandOrFailed | rays.compared [rays] | rays.dropped [rays] | fields.compared [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| moved | 0 at field 0, line 0 | 1.49e-8 at field 4, line 0, ray 102 | 0 | 0 | 0 at field 0, line 0 | 0 at field 0, line 0 | 183 | 0 | 3 | FAIL | landing.maxAbs 1.49e-8 exceeds its tolerance 1.00e-8 at field 4, line 0, ray 102 |
| stopped | 0 at field 0, line 0 | 0 at field 0, line 0, ray 100 | 1 at field 3, line 0, ray 44, surface 2 | 0 | 1.67e-2 at field 3, line 0 | 0 at field 0, line 0 | 182 | 1 at field 3, line 0, ray 44 | 3 | FAIL | mask.mismatches 1 exceeds its tolerance 0 at field 3, line 0, ray 44, surface 2; transmission.maxAbs 1.67e-2 exceeds its tolerance 0 at field 3, line 0 |
| turned | 1.54e-6 at field 4, line 0 | 0 at field 0, line 0, ray 100 | 0 | 0 | 0 at field 0, line 0 | 0 at field 0, line 0 | 183 | 0 | 3 | FAIL | illumination.maxAbs 1.54e-6 exceeds its tolerance 1.00e-9 at field 4, line 0 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | moved | reference-tracer | stopped | turned |
|---|---|---|---|---|
| moved | — | FAIL (landing.maxAbs 1.49e-8 at field 4, line 0, ray 102) | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) |
| reference-tracer | FAIL (landing.maxAbs 1.49e-8 at field 4, line 0, ray 102) | — | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) |
| stopped | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | — | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) |
| turned | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | — |

No consensus: no two engines are within the limits of each other.

Recorded values, as each engine reports them. They are listed and never judged:

| Value | moved | reference-tracer | stopped | turned |
|---|---|---|---|---|
| fieldAngleDeg[0] | 0 | 0 | 0 | 0 |
| fieldAngleDeg[1] | 3 | 3 | 3 | 3 |
| fieldAngleDeg[2] | 4 | 4 | 4 | 4 |
| geometricTransmission[0] | 1 | 1 | 1 | 1 |
| geometricTransmission[1] | 9.66666667e-1 | 9.66666667e-1 | 9.50000000e-1 | 9.66666667e-1 |
| geometricTransmission[2] | 9.33333333e-1 | 9.33333333e-1 | 9.33333333e-1 | 9.33333333e-1 |
| rays.blocked[0] | 40 | 40 | 40 | 40 |
| rays.blocked[1] | 42 | 42 | 43 | 42 |
| rays.blocked[2] | 44 | 44 | 44 | 44 |
| rays.failed[0] | 0 | 0 | 0 | 0 |
| rays.failed[1] | 0 | 0 | 0 | 0 |
| rays.failed[2] | 0 | 0 | 0 | 0 |
| rays.ok[0] | 63 | 63 | 63 | 63 |
| rays.ok[1] | 61 | 61 | 60 | 61 |
| rays.ok[2] | 59 | 59 | 59 | 59 |
| relativeIllumination[0] | 1 | 1 | 1 | 1 |
| relativeIllumination[1] | 9.67739781e-1 | 9.67739781e-1 | 9.51158343e-1 | 9.67739781e-1 |
| relativeIllumination[2] | 9.35133158e-1 | 9.35133158e-1 | 9.35133158e-1 | 9.35134701e-1 |

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
| Suite file | e3ac095fb9768cb02d38054d6437a462fa96f040d8e4fab01334cea1a16fcf09 |
| Limits file | 21e282855578d12bb18027b74636778507dee2136c676e6b5aefc11b23626e9a |

| Engine | Engine code | This tool's code behind it |
|---|---|---|
| moved | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 |
| reference-tracer | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 |
| stopped | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 |
| turned | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 |

| Run | Lens state |
|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c |

| Run | Check | Request |
|---|---|---|
| lens | vignetting-rays, request 1 of 3 | 1885953b4ac9e4f0ca84da87e19204a6b894b4733c7cc9c18dc05fff88c167c3 |
