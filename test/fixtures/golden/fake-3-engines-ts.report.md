# Comparison report: fake-3-engines-ts

## Inputs

| Input | Value |
|---|---|
| Suite | fake-3-engines-ts |
| Suite hash | d9a47b16c3b04fcb18d8caadae50aa24e457148d86e938eb28632a5d1dd75a85 |
| Contract version | 1.0 |
| Policy | rungs v2 |
| Policy hash | bbd20a76cbd643fcbaf3a4ceb600bc177594a01c83a75545320c638bded9f79b |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| fake-a | available | 1 | f3e820abc00b857d9d3feb859cdb68c43ccc5f95df0ed3c74f0f29ba49fddbe9 |
| fake-near | available | 1 | e0a6e99cfe0ad98cca9b189c18f39f7f9ed52e2e37ed90f663946633a6cd9191 |
| fake-none | available | 1 | 3e2ad04f8c76a56bdcbfa850c697863cc99c2912d776c942e4123e79f5d109f5 |

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
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 2 | 4 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | fake-a | fake-near | fake-none |
|---|---|---|---|---|
| singlet | selftest | ok | ok | unsupported: quantity selftest.echo |
| double-gauss | selftest | ok | ok | unsupported: quantity selftest.echo |

## Results

### singlet

#### selftest

Quantity `selftest.echo`, compared direct, gated. Request `e918174eae0474fefef649c6b59cc25b94c18510000301efd103c6fcaf5e55a6`.

Reference vs each, against `fake-a`:

| Engine | sum.abs (≤ 1.00e-12) | values.maxAbs (≤ 1.00e-12) | Verdict | Note |
|---|---|---|---|---|
| fake-near | 6.04e-14 | 2.04e-14 at index 1 | PASS |  |
| fake-none | — | — | UNSUPPORTED | fake-none is unsupported (quantity selftest.echo) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | fake-a | fake-near | fake-none |
|---|---|---|---|
| fake-a | — | PASS (sum.abs 6.04e-14) | UNSUPPORTED |
| fake-near | PASS (sum.abs 6.04e-14) | — | UNSUPPORTED |
| fake-none | UNSUPPORTED | UNSUPPORTED | — |

### double-gauss

#### selftest

Quantity `selftest.echo`, compared direct, gated. Request `f3a91e7a8bf5abda55545e9e0542c7b699c703b020b097b11331f217dd74e81c`.

Reference vs each, against `fake-a`:

| Engine | sum.abs (≤ 1.00e-12) | values.maxAbs (≤ 1.00e-12) | Verdict | Note |
|---|---|---|---|---|
| fake-near | 1.71e-13 | 2.13e-14 at index 3 | PASS |  |
| fake-none | — | — | UNSUPPORTED | fake-none is unsupported (quantity selftest.echo) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | fake-a | fake-near | fake-none |
|---|---|---|---|
| fake-a | — | PASS (sum.abs 1.71e-13) | UNSUPPORTED |
| fake-near | PASS (sum.abs 1.71e-13) | — | UNSUPPORTED |
| fake-none | UNSUPPORTED | UNSUPPORTED | — |

## How to read this

Each pair of engines that answered one request gets one verdict.

| Verdict | Meaning |
|---|---|
| PASS | A gated rung: every judged metric is at or below its tolerance. |
| FAIL | A gated rung: a judged metric is above its tolerance, or is not a number. |
| RECORDED | A recorded rung: the difference is written down. It is not a failure. |
| ATTENTION | A recorded rung: a metric is outside its attention band. It is worth a look and is not a failure. |
| UNSUPPORTED | One of the two engines cannot answer the request. That is an answer, not a failure. |
| BLOCKED | Both engines answered and the pair is not judged: an earlier rung, on which this one rests, failed for the same two engines on the same case. The failure is that rung's, and the note names it. |
| ERROR | One of the two engines gave no result, or the two results cannot be compared. |

Only FAIL and ERROR fail a comparison. RECORDED and ATTENTION are not failures: a recorded rung compares
methods that are expected to differ, and its numbers are kept to be read, not to be gated. BLOCKED is not a
second failure: two engines that built different systems would differ in every rung after that one.

A limit is shown in the heading of its metric: `≤` is the tolerance of a gated rung and `band` the attention
band of a recorded one. Numbers have 3 significant digits, and a whole number, such as a count, is written in full.
A recorded value has 9 significant digits and is named with the index of its element. `—` marks a place with
nothing to compare, and `not finite` a number that is a NaN or an infinity. The reference-vs-each table and the
pairwise matrix judge a pair alike, so a pair that is in both has the same verdict in both.
