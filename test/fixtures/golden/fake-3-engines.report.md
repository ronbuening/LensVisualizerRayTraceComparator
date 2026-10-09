# Comparison report: fake-3-engines

## Inputs

| Input | Value |
|---|---|
| Suite | fake-3-engines |
| Suite hash | 4bd7cc1cd623fd9fc7a808d67bc494bdf269c445a77e7e9663ffcbde75b1b7a3 |
| Contract version | 1.0 |
| Policy | rungs v8 |
| Policy hash | 5087f29f8584b921294cbf524c4b67e129af644887deae0551d52bff3f1ad72b |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| fake-a | available | 1 | f3e820abc00b857d9d3feb859cdb68c43ccc5f95df0ed3c74f0f29ba49fddbe9 |
| fake-none | available | 1 | 3e2ad04f8c76a56bdcbfa850c697863cc99c2912d776c942e4123e79f5d109f5 |
| fake-pyn | available | 1 | fake-pyn fixture 1 |

### Runs

| Run | Case | Status |
|---|---|---|
| singlet | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 | run |
| double-gauss | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a | run |

## Verdict summary

No pair is FAIL or ERROR, of 10 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 2 | 2 |
| FLOOR | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 2 | 4 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | fake-a | fake-none | fake-pyn |
|---|---|---|---|---|
| singlet | selftest | ok | unsupported: quantity selftest.echo | ok |
| double-gauss | selftest | ok | unsupported: quantity selftest.echo | ok |

## Results

### singlet

#### selftest

Quantity `selftest.echo`, compared direct, gated. Request `e918174eae0474fefef649c6b59cc25b94c18510000301efd103c6fcaf5e55a6`.

Reference vs each, against `fake-a`:

| Engine | sum.abs (≤ 1.00e-12) | values.maxAbs (≤ 1.00e-12) | Verdict | Note |
|---|---|---|---|---|
| fake-none | — | — | UNSUPPORTED | fake-none is unsupported (quantity selftest.echo) |
| fake-pyn | 6.04e-14 | 2.04e-14 at index 1 | PASS |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | fake-a | fake-none | fake-pyn |
|---|---|---|---|
| fake-a | — | UNSUPPORTED | PASS (sum.abs 6.04e-14) |
| fake-none | UNSUPPORTED | — | UNSUPPORTED |
| fake-pyn | PASS (sum.abs 6.04e-14) | UNSUPPORTED | — |

### double-gauss

#### selftest

Quantity `selftest.echo`, compared direct, gated. Request `f3a91e7a8bf5abda55545e9e0542c7b699c703b020b097b11331f217dd74e81c`.

Reference vs each, against `fake-a`:

| Engine | sum.abs (≤ 1.00e-12) | values.maxAbs (≤ 1.00e-12) | Verdict | Note |
|---|---|---|---|---|
| fake-none | — | — | UNSUPPORTED | fake-none is unsupported (quantity selftest.echo) |
| fake-pyn | 1.71e-13 | 2.13e-14 at index 3 | PASS |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | fake-a | fake-none | fake-pyn |
|---|---|---|---|
| fake-a | — | UNSUPPORTED | PASS (sum.abs 1.71e-13) |
| fake-none | UNSUPPORTED | — | UNSUPPORTED |
| fake-pyn | PASS (sum.abs 1.71e-13) | UNSUPPORTED | — |

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
