# Comparison report: r10b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r10b-stand-ins |
| Suite hash | a41ac0822e1b6004ddd52e3842d0d4564923a079ec12e71bf3d45f8d4e9a93d7 |
| Contract version | 1.0 |
| Policy | rungs v1 |
| Policy hash | 24346812ea75c2f97d4cc4e8420135284a5307a3799522193de1422b57954ee5 |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| lv | available | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |

### Runs

| Run | Case | Status |
|---|---|---|
| lens | 5e86575ae0af7493b28942da1d0fa71b4683e02ce17743e04724058ddd28addd | run |

## Verdict summary

No pair is FAIL or ERROR, of 2 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FLOOR | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | lv | optiland |
|---|---|---|---|
| lens | r10b | ok | ok |

## Results

### lens

#### r10b

Quantity `curvature.native`, compared independent-method, recorded. Request `e0dbf4d996d770616c035c12225b1933fb76eae2709149b872e434157e809135`.

Reference vs each, against `lv`:

| Engine | astigmatism.maxAbs (band 1.00e-5 mm) | chiefLanding.maxAbs (band 1.00e-5 mm) | sagittalShift.maxAbs (band 1.00e-5 mm) | tangentialShift.maxAbs (band 1.00e-5 mm) | fields.compared [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| optiland | 1.53e-5 at field 20, line 0 | 0 at field 0, line 0 | 1.53e-5 at field 20, line 0 | 9.54e-7 at field 10, line 0 | 3 | 2 | 1 | ATTENTION | astigmatism.maxAbs 1.53e-5 is outside its attention band 1.00e-5 at field 20, line 0; sagittalShift.maxAbs 1.53e-5 is outside its attention band 1.00e-5 at field 20, line 0; line 1, field 0: data, indices-differ (lv-field-curves traced indices up to 1.53e-5 from the case's); line 1, field 10: data, indices-differ (lv-field-curves traced indices up to 1.53e-5 from the case's); line 1, field 20: unsupported, no-curve (optiland-field-curvature: unavailable (no-chief-landing)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | ATTENTION (astigmatism.maxAbs 1.53e-5 at field 20, line 0) |
| optiland | ATTENTION (astigmatism.maxAbs 1.53e-5 at field 20, line 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| chiefLandingMm[0] | 0 | 0 |
| chiefLandingMm[1] | -4 | -4 |
| chiefLandingMm[2] | -8 | -8 |
| chiefLandingMm[3] | not finite | 0 |
| chiefLandingMm[4] | not finite | -4 |
| chiefLandingMm[5] | not finite | not finite |
| fieldAngleDeg[0] | 0 | 0 |
| fieldAngleDeg[1] | 10 | 10 |
| fieldAngleDeg[2] | 20 | 20 |
| fieldAngleDeg[3] | 0 | 0 |
| fieldAngleDeg[4] | 10 | 10 |
| fieldAngleDeg[5] | 20 | 20 |
| indexMaxDelta[0] | not finite | — |
| indexMaxDelta[1] | not finite | — |
| indexMaxDelta[2] | not finite | — |
| indexMaxDelta[3] | 1.52587891e-5 | — |
| indexMaxDelta[4] | 1.52587891e-5 | — |
| indexMaxDelta[5] | 1.52587891e-5 | — |
| line[0] | 0 | 0 |
| line[1] | 0 | 0 |
| line[2] | 0 | 0 |
| line[3] | 1 | 1 |
| line[4] | 1 | 1 |
| line[5] | 1 | 1 |
| sagittalShiftMm[0] | 0 | 0 |
| sagittalShiftMm[1] | -9.76562500e-3 | -9.76562500e-3 |
| sagittalShiftMm[2] | -1.95312500e-2 | -1.95465088e-2 |
| sagittalShiftMm[3] | 0 | 0 |
| sagittalShiftMm[4] | -9.76562500e-3 | -9.76562500e-3 |
| sagittalShiftMm[5] | -1.95312500e-2 | not finite |
| settled[0] | 1 | 1 |
| settled[1] | 1 | 1 |
| settled[2] | 1 | 1 |
| settled[3] | 1 | 1 |
| settled[4] | 1 | 1 |
| settled[5] | 1 | not finite |
| tangentialShiftMm[0] | 0 | 0 |
| tangentialShiftMm[1] | 1.95312500e-2 | 1.95322037e-2 |
| tangentialShiftMm[2] | 3.90625000e-2 | 3.90625000e-2 |
| tangentialShiftMm[3] | 0 | 0 |
| tangentialShiftMm[4] | 1.95312500e-2 | 1.95312500e-2 |
| tangentialShiftMm[5] | 3.90625000e-2 | not finite |
| validSampleCount[0] | 4 | — |
| validSampleCount[1] | 4 | — |
| validSampleCount[2] | 4 | — |
| validSampleCount[3] | not finite | — |
| validSampleCount[4] | not finite | — |
| validSampleCount[5] | not finite | — |
| wavelengthNm[0] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[1] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[2] | 5.87561800e2 | 5.87561800e2 |
| wavelengthNm[3] | 5.37561800e2 | 5.37561800e2 |
| wavelengthNm[4] | 5.37561800e2 | 5.37561800e2 |
| wavelengthNm[5] | 5.37561800e2 | 5.37561800e2 |

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
