# Comparison report: hand-built

## Inputs

| Input | Value |
|---|---|
| Suite | hand-built |
| Suite hash | 5555555555555555555555555555555555555555555555555555555555555555 |
| Contract version | 1.0 |
| Policy | rungs v3 |
| Policy hash | a4e595457068bfb3631898439e760cc107ba21ea5acb21faf7b6796f5f9a6b33 |

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

3 of 6 pairs are FAIL or ERROR.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 1 |
| ERROR | 1 | 2 |

## Support matrix

| Run | Rung | lv | optiland | zemax |
|---|---|---|---|---|
| tele | r5, request 1 of 2 | ok | ok | error: spawn-failed |
| tele | r5, request 2 of 2 | ok | unsupported: feature surface.asphere.odd, option a\|b | — |
| tele | r0 | ok | pending | — |

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

## How to read this

Each pair of engines that answered one request gets one verdict.

| Verdict | Meaning |
|---|---|
| PASS | A gated rung: every judged metric is at or below its tolerance. |
| FAIL | A gated rung: a judged metric is above its tolerance, or is not a number. |
| RECORDED | A recorded rung: the difference is written down. It is not a failure. |
| ATTENTION | A recorded rung: a metric is outside its attention band. It is worth a look and is not a failure. |
| UNSUPPORTED | One of the two engines cannot answer the request. That is an answer, not a failure. |
| ERROR | One of the two engines gave no result, or the two results cannot be compared. |

Only FAIL and ERROR fail a comparison. RECORDED and ATTENTION are not failures: a recorded rung compares
methods that are expected to differ, and its numbers are kept to be read, not to be gated.

A limit is shown in the heading of its metric: `≤` is the tolerance of a gated rung and `band` the attention
band of a recorded one. Numbers have 3 significant digits; `—` marks a place with nothing to compare, and
`not finite` a metric that is a NaN or an infinity. The reference-vs-each table and the pairwise matrix judge a
pair alike, so a pair that is in both has the same verdict in both.
