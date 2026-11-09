# Comparison report: r8a-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r8a-stand-ins |
| Suite hash | f10cd53eea865dbe26a4903f66c1154d4defffb2ea55d23fd72de511b4c8be82 |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | fbff9d872284fc01ebc595d71d399e3441aba57ea1a4cfdb78c0d7d7382d583c |

### Engines

| Engine | Status | Version | Engine code | This tool's code behind it |
|---|---|---|---|---|
| moved | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| ref | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| stopped | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |

### Runs

| Run | Lens state | Status |
|---|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c | run |

## Verdict summary

6 of 10 pairs are Fail or Error.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 2 | 2 |
| FAIL | 2 | 4 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Consensus

A consensus is looked for on each request of a check held to a limit that three or more engines were compared
on, pair by pair. An engine is placed where a pair of it is within or beyond the limits; a pair whose verdict is
Not computed, Not judged or Error places no engine. The consensus is the largest set of placed engines every two
of which are within the limits of each other, where it is the only largest such set and holds more than half of
the engines placed. An outlier is beyond the limits of every engine of the consensus; an engine apart is outside
the consensus and not beyond the limits of all of it. A consensus says which answers are within the limits of
each other, and no more.

Of 2 requests with a consensus to look for, 2 have one.

| Requests | Count |
|---|---|
| with a consensus | 2 |
| No consensus: the engines within the limits of each other split into two or more largest sets | 0 |
| No consensus: no two engines are within the limits of each other | 0 |
| No consensus: the largest set of engines within the limits of each other holds no more than half of the engines placed | 0 |

| Engine | In the consensus | Outlier | Apart | Placed, no consensus | Not placed |
|---|---|---|---|---|---|
| moved | 1 | 1 | 0 | 0 | 0 |
| ref | 2 | 0 | 0 | 0 | 0 |
| stopped | 1 | 1 | 0 | 0 | 0 |

## Support matrix

| Run | Check | moved | ref | stopped |
|---|---|---|---|---|
| lens | r8a, request 1 of 2 | ok | ok | ok |
| lens | r8a, request 2 of 2 | ok | ok | ok |

## Results

### lens

#### Spherical aberration and axial colour rays — `r8a`, request 1 of 2

Quantity `rays.trace`: one estimator on each engine's trace of the same rays; held to a limit. Request `5677d6589e713d8406cdff800a2020b7cb8ecdba13ded30df306b5858ff3901f`.

Reference vs each, against `ref`:

| Engine | focus.maxScaled (≤ 1.00e-8 mm) | focus.maxAbs [mm] | focusRms.maxAbs (≤ 1.00e-8 mm) | intercept.maxScaled (≤ 1.00e-8 mm) | intercept.maxAbs [mm] | mask.mismatches (≤ 0 rays) | mask.rimBand [rays] | rays.compared [rays] | rays.dropped [rays] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| moved | 0 at field 0, line 0 | 0 at field 0, line 0 | 0 at field 0, line 0 | 0 at field 0, line 0, ray 0 | 0 at field 0, line 0, ray 0 | 0 | 0 | 6 | 0 | PASS |  |
| stopped | 0 at field 0, line 0 | 0 at field 0, line 0 | 0 at field 0, line 0 | 0 at field 0, line 0, ray 0 | 0 at field 0, line 0, ray 0 | 1 at field 0, line 0, ray 1, surface 0 | 0 | 5 | 1 at field 0, line 0, ray 1 | FAIL | mask.mismatches 1 exceeds its tolerance 0 at field 0, line 0, ray 1, surface 0 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | moved | ref | stopped |
|---|---|---|---|
| moved | — | PASS (focus.maxScaled 0 at field 0, line 0) | FAIL (mask.mismatches 1 at field 0, line 0, ray 1, surface 0) |
| ref | PASS (focus.maxScaled 0 at field 0, line 0) | — | FAIL (mask.mismatches 1 at field 0, line 0, ray 1, surface 0) |
| stopped | FAIL (mask.mismatches 1 at field 0, line 0, ray 1, surface 0) | FAIL (mask.mismatches 1 at field 0, line 0, ray 1, surface 0) | — |

Consensus: `moved`, `ref`, every two of them within the limits of each other; outlier: `stopped`, beyond the limits of every engine of the consensus.

Recorded values, as each engine reports them. They are listed and never judged:

| Value | moved | ref | stopped |
|---|---|---|---|
| axial.focusRmsMm[0] | 1.73451657e-3 | 1.73451657e-3 | 1.37119153e-3 |
| axial.focusZ[0] | 5.20210538e1 | 5.20210538e1 | 5.20106791e1 |
| rays.blocked[0] | 2 | 2 | 3 |
| rays.failed[0] | 0 | 0 | 0 |
| rays.ok[0] | 6 | 6 | 5 |

#### Spherical aberration and axial colour rays — `r8a`, request 2 of 2

Quantity `rays.trace`: one estimator on each engine's trace of the same rays; held to a limit. Request `acb8c5760a1db26d69ddfe878c934967c571fc4e7fa2bea5f98ca182a4e92b89`.

Reference vs each, against `ref`:

| Engine | focus.maxScaled (≤ 1.00e-8 mm) | focus.maxAbs [mm] | focusRms.maxAbs (≤ 1.00e-8 mm) | intercept.maxScaled (≤ 1.00e-8 mm) | intercept.maxAbs [mm] | mask.mismatches (≤ 0 rays) | mask.rimBand [rays] | rays.compared [rays] | rays.dropped [rays] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| moved | 2.56e-9 at field 0, line 1 | 6.20e-8 at field 0, line 1 | 1.56e-9 at field 0, line 1 | 1.49e-8 at field 0, line 1, ray 2 | 3.49e-7 at field 0, line 1, ray 2 | 0 | 0 | 6 | 0 | FAIL | intercept.maxScaled 1.49e-8 exceeds its tolerance 1.00e-8 at field 0, line 1, ray 2 |
| stopped | 0 at field 0, line 1 | 0 at field 0, line 1 | 0 at field 0, line 1 | 0 at field 0, line 1, ray 0 | 0 at field 0, line 1, ray 0 | 0 | 0 | 6 | 0 | PASS |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | moved | ref | stopped |
|---|---|---|---|
| moved | — | FAIL (intercept.maxScaled 1.49e-8 at field 0, line 1, ray 2) | FAIL (intercept.maxScaled 1.49e-8 at field 0, line 1, ray 2) |
| ref | FAIL (intercept.maxScaled 1.49e-8 at field 0, line 1, ray 2) | — | PASS (focus.maxScaled 0 at field 0, line 1) |
| stopped | FAIL (intercept.maxScaled 1.49e-8 at field 0, line 1, ray 2) | PASS (focus.maxScaled 0 at field 0, line 1) | — |

Consensus: `ref`, `stopped`, every two of them within the limits of each other; outlier: `moved`, beyond the limits of every engine of the consensus.

Recorded values, as each engine reports them. They are listed and never judged:

| Value | moved | ref | stopped |
|---|---|---|---|
| axial.focusRmsMm[0] | 1.80490707e-3 | 1.80490551e-3 | 1.80490551e-3 |
| axial.focusZ[0] | 5.01941812e1 | 5.01941811e1 | 5.01941811e1 |
| rays.blocked[0] | 2 | 2 | 2 |
| rays.failed[0] | 0 | 0 | 0 |
| rays.ok[0] | 6 | 6 | 6 |

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
