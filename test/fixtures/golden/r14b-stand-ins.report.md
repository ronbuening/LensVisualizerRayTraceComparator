# Comparison report: r14b-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r14b-stand-ins |
| Suite hash | 577c75a2a5045f333ae5d5d38feea947f07faf907cbf3d7825ad297e0396fe00 |
| Contract version | 1.0 |
| Policy | rungs v1 |
| Policy hash | 288830c35311d983c5036df6739fe5823523b85ba7b0f0d1183fa055d0a47dfa |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |
| optiland-wave | available | 1 | 324b7c3508eaea73b4fe516c15425c651b3e802d0237cfcbc3cd52efc5b595c4 |

### Runs

| Run | Case | Status |
|---|---|---|
| lens | 3ea92f50c52c5a9fa2f6ddf5d09f3f540cefe04d71869a24615e9faeb50a7f1c | run |

## Verdict summary

No pair is FAIL or ERROR, of 2 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FLOOR | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 1 | 1 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | optiland | optiland-wave |
|---|---|---|---|
| lens | r14b | ok | ok |

## Results

### lens

#### r14b

Quantity `zernike.native`, compared independent-method, recorded. Request `4acbe373f999cf47a832553f2e8fd7501f6dd86c5b88e0de059ecffe818ca8cb`.

Reference vs each, against `optiland`:

| Engine | chiefLanding.maxAbs [mm] | coefficients.maxAbs [waves] | fitCondition.max | fitResidualRms.maxAbs [waves] | pvToChief.maxAbs [waves] | rmsToChief.maxAbs [waves] | fields.compared [elements] | fields.data [elements] | fields.numerical [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland-wave | 0 at field 0 | 9.09e-13 at field 0, term 4 | 2.50e0 at field 0 | 0 at field 0 | 0 at field 0 | 0 at field 0 | 1 | 0 | 0 | 1 | RECORDED | the rung sets no limit on chiefLanding.maxAbs: no field is set aside by its chief ray's landing; the rung sets no limit on fitCondition.max: no field is set aside by the condition of its fit; field 20: unsupported, no-curve (optiland-zernike-fit: unavailable (optiland-raised-ValueError)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | optiland | optiland-wave |
|---|---|---|
| optiland | — | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland-wave | RECORDED (chiefLanding.maxAbs 0 at field 0) | — |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | optiland | optiland-wave |
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
