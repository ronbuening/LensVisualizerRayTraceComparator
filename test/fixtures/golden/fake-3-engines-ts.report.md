# Comparison report: fake-3-engines-ts

## Inputs

| Input | Value |
|---|---|
| Suite | fake-3-engines-ts |
| Suite hash | 7046422087950f18cf58425eaf5495de9e37580514e7b89c4f170df86685976c |
| Contract version | 1.0 |
| Limits file | v25 |
| Limits file hash | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| fake-a | available | 1 | f3e820abc00b857d9d3feb859cdb68c43ccc5f95df0ed3c74f0f29ba49fddbe9 |
| fake-near | available | 1 | e0a6e99cfe0ad98cca9b189c18f39f7f9ed52e2e37ed90f663946633a6cd9191 |
| fake-none | available | 1 | 3e2ad04f8c76a56bdcbfa850c697863cc99c2912d776c942e4123e79f5d109f5 |

### Runs

| Run | Lens state | Status |
|---|---|---|
| singlet | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 | run |
| double-gauss | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a | run |

## Verdict summary

No pair is Fail or Error, of 10 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 2 | 2 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 0 | 0 |
| UNSUPPORTED | 2 | 4 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Consensus

A consensus is looked for on each request of a check held to a limit that three or more engines were compared
on, pair by pair. An engine is placed where a pair of it is within or beyond the limits; a pair whose verdict is
Not computed, Not judged or Error places no engine. The consensus is the largest set of placed engines every two
of which are within the limits of each other, where it is the only largest such set and holds more than half of
the engines placed. An outlier is beyond the limits of every engine of the consensus; an engine apart is outside
the consensus and not beyond the limits of all of it. A consensus says which answers are within the limits of
each other, and no more.

Of 2 requests with a consensus to look for, 2 have one.

| Requests | Count |
|---|---|
| with a consensus | 2 |
| No consensus: the engines within the limits of each other split into two or more largest sets | 0 |
| No consensus: no two engines are within the limits of each other | 0 |
| No consensus: the largest set of engines within the limits of each other holds no more than half of the engines placed | 0 |

| Engine | In the consensus | Outlier | Apart | Placed, no consensus | Not placed |
|---|---|---|---|---|---|
| fake-a | 2 | 0 | 0 | 0 | 0 |
| fake-near | 2 | 0 | 0 | 0 | 0 |
| fake-none | 0 | 0 | 0 | 0 | 2 |

## Support matrix

| Run | Check | fake-a | fake-near | fake-none |
|---|---|---|---|---|
| singlet | pipeline-echo | ok | ok | unsupported: quantity selftest.echo |
| double-gauss | pipeline-echo | ok | ok | unsupported: quantity selftest.echo |

## Results

### singlet

#### Pipeline echo (a test of this tool) — `pipeline-echo`

Quantity `selftest.echo`: numbers of each engine set against each other; held to a limit. Request `e918174eae0474fefef649c6b59cc25b94c18510000301efd103c6fcaf5e55a6`.

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

Consensus: `fake-a`, `fake-near`, every two of them within the limits of each other; not placed: `fake-none`, with no pair within or beyond the limits.

### double-gauss

#### Pipeline echo (a test of this tool) — `pipeline-echo`

Quantity `selftest.echo`: numbers of each engine set against each other; held to a limit. Request `f3a91e7a8bf5abda55545e9e0542c7b699c703b020b097b11331f217dd74e81c`.

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

Consensus: `fake-a`, `fake-near`, every two of them within the limits of each other; not placed: `fake-none`, with no pair within or beyond the limits.

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

Each pair of engines that answered one request gets one verdict. A table of this report shows its stored value;
this is its label and what it means:

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
