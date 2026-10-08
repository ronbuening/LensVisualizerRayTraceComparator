# Comparison report: fake-faults

## Inputs

| Input | Value |
|---|---|
| Suite | fake-faults |
| Suite hash | d0a97adbd49af2fa7095fb5733b69d9e1f76813ad91912feec9f99f6f432d7f9 |
| Contract version | 1.0 |
| Policy | rungs v4 |
| Policy hash | 01abb393f5fd737168b05920418e8e79d4c921e26adb994b1062d559ea5cbfbb |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| fake-a | available | 1 | f3e820abc00b857d9d3feb859cdb68c43ccc5f95df0ed3c74f0f29ba49fddbe9 |
| fake-absent | unavailable: load-failed | — | — |
| fake-broken | available | 1 | 91bdc15eb704fb307acb781a01b7390ed839371343122148f5faedfebb3a7a44 |
| fake-far | available | 1 | 08cdc195f50ec2c08c45f0f02eac5007b1faf119749b830d2933156377ae6aa2 |

### Runs

| Run | Case | Status |
|---|---|---|
| singlet | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 | run |
| double-gauss | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a | run |
| missing | — | not started: lens fixture cases/missing.json: it cannot be read (ENOENT) |

## Verdict summary

18 of 18 pairs are FAIL or ERROR.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FLOOR | 0 | 0 |
| FAIL | 2 | 2 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 4 | 10 |

## Support matrix

| Run | Rung | fake-a | fake-absent | fake-broken | fake-far |
|---|---|---|---|---|---|
| singlet | selftest | ok | error: load-failed | error: protocol-error | ok |
| double-gauss | selftest | ok | error: load-failed | error: protocol-error | ok |

## Results

### singlet

#### selftest

Quantity `selftest.echo`, compared direct, gated. Request `e918174eae0474fefef649c6b59cc25b94c18510000301efd103c6fcaf5e55a6`.

Reference vs each, against `fake-a`:

| Engine | sum.abs (≤ 1.00e-12) | values.maxAbs (≤ 1.00e-12) | Verdict | Note |
|---|---|---|---|---|
| fake-absent | — | — | ERROR | fake-absent ended as error (load-failed) |
| fake-broken | — | — | ERROR | fake-broken ended as error (protocol-error) |
| fake-far | 3.00e-3 | 1.00e-3 at index 1 | FAIL | sum.abs 3.00e-3 exceeds its tolerance 1.00e-12; values.maxAbs 1.00e-3 exceeds its tolerance 1.00e-12 at index 1 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | fake-a | fake-absent | fake-broken | fake-far |
|---|---|---|---|---|
| fake-a | — | ERROR | ERROR | FAIL (sum.abs 3.00e-3) |
| fake-absent | ERROR | — | ERROR | ERROR |
| fake-broken | ERROR | ERROR | — | ERROR |
| fake-far | FAIL (sum.abs 3.00e-3) | ERROR | ERROR | — |

### double-gauss

#### selftest

Quantity `selftest.echo`, compared direct, gated. Request `f3a91e7a8bf5abda55545e9e0542c7b699c703b020b097b11331f217dd74e81c`.

Reference vs each, against `fake-a`:

| Engine | sum.abs (≤ 1.00e-12) | values.maxAbs (≤ 1.00e-12) | Verdict | Note |
|---|---|---|---|---|
| fake-absent | — | — | ERROR | fake-absent ended as error (load-failed) |
| fake-broken | — | — | ERROR | fake-broken ended as error (protocol-error) |
| fake-far | 1.20e-2 | 1.00e-3 at index 8 | FAIL | sum.abs 1.20e-2 exceeds its tolerance 1.00e-12; values.maxAbs 1.00e-3 exceeds its tolerance 1.00e-12 at index 8 |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | fake-a | fake-absent | fake-broken | fake-far |
|---|---|---|---|---|
| fake-a | — | ERROR | ERROR | FAIL (sum.abs 1.20e-2) |
| fake-absent | ERROR | — | ERROR | ERROR |
| fake-broken | ERROR | ERROR | — | ERROR |
| fake-far | FAIL (sum.abs 1.20e-2) | ERROR | ERROR | — |

## How to read this

Each pair of engines that answered one request gets one verdict.

| Verdict | Meaning |
|---|---|
| PASS | A gated rung: every judged metric is at or below its tolerance. |
| FLOOR | A gated rung: a judged metric is above its tolerance by the known numerical floor of one of the two engines. The rung's arbiter agrees with every other engine, and that engine is within the floor limit of the arbiter; the note gives the figures. It counts as a pass. |
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
