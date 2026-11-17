# Comparison report: fake-faults

## Inputs

| Input | Value |
|---|---|
| Suite | fake-faults |
| Contract version | 1.0 |
| Limits file | v25 |

### Engines

| Engine | Status | Version |
|---|---|---|
| fake-a | available | 1 |
| fake-absent | unavailable: load-failed | — |
| fake-broken | available | 1 |
| fake-far | available | 1 |

### Runs

| Run | Status |
|---|---|
| singlet | run |
| double-gauss | run |
| missing | not started: lens fixture cases/missing.json: it cannot be read (ENOENT) |

## Verdict summary

18 of 18 pairs are Fail or Error.

| Verdict | against the reference | every pair |
|---|---|---|
| Pass: within limit | 0 | 0 |
| Fail: beyond limit | 2 | 2 |
| Side by side | 0 | 0 |
| Side by side, worth a look | 0 | 0 |
| Not computed | 0 | 0 |
| Not judged (an earlier check failed) | 0 | 0 |
| Error | 4 | 10 |

## Consensus

A consensus is looked for on each request of a check held to a limit that three or more engines were compared
on, pair by pair. An engine is placed where a pair of it is within or beyond the limits; a pair whose verdict is
Not computed, Not judged or Error places no engine. The consensus is the largest set of placed engines every two
of which are within the limits of each other, where it is the only largest such set and holds more than half of
the engines placed. An outlier is beyond the limits of every engine of the consensus; an engine apart is outside
the consensus and not beyond the limits of all of it. A consensus says which answers are within the limits of
each other, and no more.

Of 2 requests with a consensus to look for, 0 have one.

| Requests | Count |
|---|---|
| with a consensus | 0 |
| No consensus: the engines within the limits of each other split into two or more largest sets | 0 |
| No consensus: no two engines are within the limits of each other | 2 |
| No consensus: the largest set of engines within the limits of each other holds no more than half of the engines placed | 0 |

| Engine | In the consensus | Outlier | Apart | Placed, no consensus | Not placed |
|---|---|---|---|---|---|
| fake-a | 0 | 0 | 0 | 2 | 0 |
| fake-absent | 0 | 0 | 0 | 0 | 2 |
| fake-broken | 0 | 0 | 0 | 0 | 2 |
| fake-far | 0 | 0 | 0 | 2 | 0 |

## Support matrix

| Run | Check | fake-a | fake-absent | fake-broken | fake-far |
|---|---|---|---|---|---|
| singlet | pipeline-echo | ok | error: load-failed | error: protocol-error | ok |
| double-gauss | pipeline-echo | ok | error: load-failed | error: protocol-error | ok |

## Results

### singlet

#### Pipeline echo (a test of this tool) — `pipeline-echo`

Quantity `selftest.echo`: numbers of each engine set against each other; held to a limit.

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

No consensus: no two engines are within the limits of each other; not placed: `fake-absent`, `fake-broken`, with no pair within or beyond the limits.

### double-gauss

#### Pipeline echo (a test of this tool) — `pipeline-echo`

Quantity `selftest.echo`: numbers of each engine set against each other; held to a limit.

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

No consensus: no two engines are within the limits of each other; not placed: `fake-absent`, `fake-broken`, with no pair within or beyond the limits.

## Not covered

What this comparison does not show, whatever its verdicts:

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so check mtf-vs-optiland-fft sets two methods side by side and holds them to no limit.
- A polychromatic curve of optiland's FFT class. It gives the modulus at one wavelength, so a run of several wavelengths has no FFT row in checks mtf-vs-optiland-fft or mtf-vs-optiland-wavefront. The external counterpart in check mtf-vs-optiland-wavefront is this tool's complex sum of optiland's raw wavefronts; its proof on synthetic sums checks the declared weighting and phase convention, not physical spectral fidelity.
- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Check geometric-mtf-vs-optiland sets the two side by side and holds them to no limit: a difference of the two pupil samplings is written down, not explained.
- The bins of optiland's geometric MTF. At one wavelength optiland's curve is of landings counted into bins, and a field whose bins move a value by more than its convergence band (0.005 on the axis, 0.01 off it) has no optiland curve. At several wavelengths the sum over optiland's landings is this tool's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.
- Dispersion and white-light weighting. Every engine is handed the refractive indices and the wavelength weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom and focus positions other than the lens states a run names, and the catalog beyond these suites.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no review band.

## How to read this

Each pair of engines that answered one request gets one verdict. The verdict summary shows its label; the other
tables of this report show its stored value. This is each label, its stored value and what it means:

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

## Identifiers

The hashes that tell one version from another: of the suite file and of the limits file; of each engine's code
and, for an engine of this tool's own, of this tool's code behind it; of each run's lens state; and of each
request a section of the results is of.

| Identifier | Value |
|---|---|
| Suite file | 22a37172d5c544c75550ba99c7d619c6136b1cd5c45d844123316275d913579d |
| Limits file | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |

| Engine | Engine code |
|---|---|
| fake-a | f3e820abc00b857d9d3feb859cdb68c43ccc5f95df0ed3c74f0f29ba49fddbe9 |
| fake-absent | — |
| fake-broken | 91bdc15eb704fb307acb781a01b7390ed839371343122148f5faedfebb3a7a44 |
| fake-far | 08cdc195f50ec2c08c45f0f02eac5007b1faf119749b830d2933156377ae6aa2 |

| Run | Lens state |
|---|---|
| singlet | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 |
| double-gauss | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a |
| missing | — |

| Run | Check | Request |
|---|---|---|
| singlet | pipeline-echo | e918174eae0474fefef649c6b59cc25b94c18510000301efd103c6fcaf5e55a6 |
| double-gauss | pipeline-echo | f3a91e7a8bf5abda55545e9e0542c7b699c703b020b097b11331f217dd74e81c |
