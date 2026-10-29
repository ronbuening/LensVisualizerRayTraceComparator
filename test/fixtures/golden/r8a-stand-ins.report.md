# Comparison report: r8a-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r8a-stand-ins |
| Suite hash | f10cd53eea865dbe26a4903f66c1154d4defffb2ea55d23fd72de511b4c8be82 |
| Contract version | 1.0 |
| Policy | rungs v1 |
| Policy hash | fbff9d872284fc01ebc595d71d399e3441aba57ea1a4cfdb78c0d7d7382d583c |

### Engines

| Engine | Status | Version | Fingerprint | Adapter revision |
|---|---|---|---|---|
| moved | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| ref | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| stopped | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |

### Runs

| Run | Case | Status |
|---|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c | run |

## Verdict summary

6 of 10 pairs are FAIL or ERROR.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 2 | 2 |
| FLOOR | 0 | 0 |
| FAIL | 2 | 4 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | moved | ref | stopped |
|---|---|---|---|---|
| lens | r8a, request 1 of 2 | ok | ok | ok |
| lens | r8a, request 2 of 2 | ok | ok | ok |

## Results

### lens

#### r8a, request 1 of 2

Quantity `rays.trace`, compared identical-rays, gated. Request `5677d6589e713d8406cdff800a2020b7cb8ecdba13ded30df306b5858ff3901f`.

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

Recorded values, as each engine reports them. They are listed and never judged:

| Value | moved | ref | stopped |
|---|---|---|---|
| axial.focusRmsMm[0] | 1.73451657e-3 | 1.73451657e-3 | 1.37119153e-3 |
| axial.focusZ[0] | 5.20210538e1 | 5.20210538e1 | 5.20106791e1 |
| rays.blocked[0] | 2 | 2 | 3 |
| rays.failed[0] | 0 | 0 | 0 |
| rays.ok[0] | 6 | 6 | 5 |

#### r8a, request 2 of 2

Quantity `rays.trace`, compared identical-rays, gated. Request `acb8c5760a1db26d69ddfe878c934967c571fc4e7fa2bea5f98ca182a4e92b89`.

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

## How to read this

Each pair of engines that answered one request gets one verdict.

| Verdict | Meaning |
|---|---|
| PASS | A gated rung: every judged metric is at or below its tolerance. |
| FLOOR | A gated rung: a judged metric is above its tolerance by the known numerical floor of one of the two engines. That engine is within the floor limit of the rung's arbiter, and no other engine sides with it against the arbiter; the note gives the figures, and names a witness that did not corroborate the arbiter. It counts as a pass. |
| FAIL | A gated rung: a judged metric is above its tolerance, or is not a number. |
| RECORDED | A recorded rung: the difference is written down. It is not a failure. |
| ATTENTION | A recorded rung: a metric is outside its attention band. It is worth a look and is not a failure. |
| UNSUPPORTED | One of the two engines cannot answer the request. That is an answer, not a failure. |
| BLOCKED | Both engines answered and the pair is not judged: an earlier rung, on which this one rests, failed for the same two engines on the same case. The failure is that rung's, and the note names it. |
| ERROR | One of the two engines gave no result, or the two results cannot be compared. |

Only FAIL and ERROR fail a comparison. FLOOR is a pass that is counted apart from PASS. RECORDED and ATTENTION
are not failures: a recorded rung compares methods that are expected to differ, and its numbers are kept to be
read, not to be gated. BLOCKED is not a second failure: two engines that built different systems would differ
in every rung after that one.

A limit is shown in the heading of its metric: `≤` is the tolerance of a gated rung, `band` the attention band
of a recorded one, and `floor ≤` how far the engine with a floor may be from the arbiter for a FLOOR. A metric
without a limit is shown and not judged. Where its name begins as a judged one's does, it stands beside that
one: `pupilZ.maxAbs`, the plain difference, beside `pupilZ.maxScaled`, the one on the scale that is judged.
Numbers have 3 significant digits, and a whole number, such as a count, is written in full.
A recorded value has 9 significant digits, or is a whole number in full, and is named with the index of its
element. `—` marks a place with nothing to compare, and `not finite` a number that is a NaN or an infinity.
The reference-vs-each table and the pairwise matrix judge a pair alike, so a pair that is in both has the same
verdict in both.
