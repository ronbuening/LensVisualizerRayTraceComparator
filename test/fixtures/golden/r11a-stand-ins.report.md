# Comparison report: r11a-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r11a-stand-ins |
| Suite hash | 052302ec782cfd714c6c2622ec60602793ce842789839767af17aeaa642c43e1 |
| Contract version | 1.0 |
| Policy | rungs v1 |
| Policy hash | 5f35bc35aedbf53588f6c365bcff58bb40a5b5a227662d00e2d89e22b32f660c |

### Engines

| Engine | Status | Version | Fingerprint | Adapter revision |
|---|---|---|---|---|
| moved | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| ref | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| stopped | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| turned | available | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |

### Runs

| Run | Case | Status |
|---|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c | run |

## Verdict summary

9 of 9 pairs are FAIL or ERROR.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FLOOR | 0 | 0 |
| FAIL | 3 | 6 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | moved | ref | stopped | turned |
|---|---|---|---|---|---|
| lens | r11a, request 1 of 3 | ok | ok | ok | ok |
| lens | r11a, request 2 of 3 | ok | ok | ok | ok |
| lens | r11a, request 3 of 3 | ok | ok | ok | ok |

## Results

### lens

#### r11a, request 1 of 3

Quantity `rays.trace`, compared identical-rays, gated. Request `1885953b4ac9e4f0ca84da87e19204a6b894b4733c7cc9c18dc05fff88c167c3`.

Reference vs each, against `ref`:

| Engine | illumination.maxAbs (≤ 1.00e-9) | landing.maxAbs (≤ 1.00e-8 mm) | mask.mismatches (≤ 0 rays) | mask.rimBand [rays] | transmission.maxAbs (≤ 0) | transmission.rimBandOrFailed | rays.compared [rays] | rays.dropped [rays] | fields.compared [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| moved | 0 at field 0, line 0 | 1.49e-8 at field 4, line 0, ray 102 | 0 | 0 | 0 at field 0, line 0 | 0 at field 0, line 0 | 183 | 0 | 3 | FAIL | landing.maxAbs 1.49e-8 exceeds its tolerance 1.00e-8 at field 4, line 0, ray 102 |
| stopped | 0 at field 0, line 0 | 0 at field 0, line 0, ray 100 | 1 at field 3, line 0, ray 44, surface 2 | 0 | 1.67e-2 at field 3, line 0 | 0 at field 0, line 0 | 182 | 1 at field 3, line 0, ray 44 | 3 | FAIL | mask.mismatches 1 exceeds its tolerance 0 at field 3, line 0, ray 44, surface 2; transmission.maxAbs 1.67e-2 exceeds its tolerance 0 at field 3, line 0 |
| turned | 1.54e-6 at field 4, line 0 | 0 at field 0, line 0, ray 100 | 0 | 0 | 0 at field 0, line 0 | 0 at field 0, line 0 | 183 | 0 | 3 | FAIL | illumination.maxAbs 1.54e-6 exceeds its tolerance 1.00e-9 at field 4, line 0 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | moved | ref | stopped | turned |
|---|---|---|---|---|
| moved | — | FAIL (landing.maxAbs 1.49e-8 at field 4, line 0, ray 102) | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) |
| ref | FAIL (landing.maxAbs 1.49e-8 at field 4, line 0, ray 102) | — | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) |
| stopped | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | — | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) |
| turned | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) | FAIL (illumination.maxAbs 1.54e-6 at field 4, line 0) | FAIL (mask.mismatches 1 at field 3, line 0, ray 44, surface 2) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | moved | ref | stopped | turned |
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
