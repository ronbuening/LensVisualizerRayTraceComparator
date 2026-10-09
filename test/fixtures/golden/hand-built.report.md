# Comparison report: hand-built

## Inputs

| Input | Value |
|---|---|
| Suite | hand-built |
| Suite hash | 5555555555555555555555555555555555555555555555555555555555555555 |
| Contract version | 1.0 |
| Policy | rungs v3 |
| Policy hash | e5d4b2b491ff3425c5b5f3ad552232256fe7ccbbb6c033f407c81f1a2546865a |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| lv | available | 0.9 \| dev | ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff |
| optiland | available | 0.5.9 | operator<br>build |
| zemax | unavailable: spawn-failed | — | — |

### Runs

| Run | Case | Status |
|---|---|---|
| tele | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc | run |
| wide | — | not started: lens fixture a\|b.json: it cannot be read (ENOENT); second<br>problem |

## Verdict summary

3 of 7 pairs are FAIL or ERROR.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FLOOR | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 1 |
| BLOCKED | 1 | 0 |
| ERROR | 1 | 2 |

## Support matrix

| Run | Rung | lv | optiland | zemax |
|---|---|---|---|---|
| tele | r5, request 1 of 2 | ok | ok | error: spawn-failed |
| tele | r5, request 2 of 2 | ok | unsupported: feature surface.asphere.odd, option a\|b | — |
| tele | r0 | ok | pending | — |
| tele | r1 | ok | ok | — |

## Results

### tele

#### r5, request 1 of 2

Quantity `mtf.native`, compared independent-method, recorded. Request `1111111111111111111111111111111111111111111111111111111111111111`.

Reference vs each, against `lv`:

| Engine | mtf.maxAbs (band 5.00e-3) | spot.rms [mm] | extra.count [rays] | Verdict | Note |
|---|---|---|---|---|---|
| optiland | 1.25e-2 at field 14 deg, frequencyPerMm 40, line 5.00e-1 | 4.20e-4 | not finite at index 12 | ATTENTION | mtf.maxAbs 1.25e-2 is outside its attention band 5.00e-3 at field 14 deg, frequencyPerMm 40, line 5.00e-1 |
| zemax | — | — | — | ERROR | zemax ended as error (spawn-failed) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | zemax |
|---|---|---|---|
| lv | — | ATTENTION (mtf.maxAbs 1.25e-2 at field 14 deg, frequencyPerMm 40, line 5.00e-1) | ERROR |
| optiland | ATTENTION (mtf.maxAbs 1.25e-2 at field 14 deg, frequencyPerMm 40, line 5.00e-1) | — | ERROR |
| zemax | ERROR | ERROR | — |

#### r5, request 2 of 2

Quantity `mtf.native`, compared independent-method, recorded. Request `2222222222222222222222222222222222222222222222222222222222222222`.

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | UNSUPPORTED |
| optiland | UNSUPPORTED | — |

#### r0

Quantity `system.describe`, the policy has no entry for this rung. Request `1111111111111111111111111111111111111111111111111111111111111111`.

Reference vs each, against `lv`:

No other engine was compared.

#### r1

Quantity `paraxial.first-order`, compared direct, gated. Request `2222222222222222222222222222222222222222222222222222222222222222`.

Reference vs each, against `lv`:

| Engine | firstOrder.maxAbs (≤ 1.00e-9 mm) | Verdict | Note |
|---|---|---|---|
| optiland | — | BLOCKED | not judged: rung r0 failed for lv and optiland on this case |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| epZ\|RelStop[0] | -1.25000000e1 | — |
| epZ\|RelStop[1] | not finite | — |
| magnification[0] | -2.50000000e-1 | -2.50000000e-1 |
| magnification[1] | -2.50100000e-1 | — |

## Not covered

What this comparison does not show, whatever its verdicts:

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.
- The formation of a polychromatic MTF. optiland's FFT MTF is of one line and gives a modulus, so a run on several lines has no optiland row; its external counterpart is the comparator's estimator on optiland's wavefront, which is a later stage.
- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom positions between the two ends, and finite conjugates other than the states a run names.
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
