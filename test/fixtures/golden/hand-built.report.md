# Comparison report: hand-built

## Inputs

| Input | Value |
|---|---|
| Suite | hand-built |
| Suite hash | 5555555555555555555555555555555555555555555555555555555555555555 |
| Contract version | 1.0 |
| Limits file | v3 |
| Limits file hash | 6f5fbb754d2d10dd36e1c7b3afd705801745bcd0d2eb3a6df3a22a7a294902b4 |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| lv | available | 0.9 \| dev | ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff |
| optiland | available | 0.5.9 | operator<br>build |
| zemax | unavailable: spawn-failed | — | — |

### Runs

| Run | Lens state | Status |
|---|---|---|
| tele | cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc | run |
| wide | — | not started: lens fixture a\|b.json: it cannot be read (ENOENT); second<br>problem |

## Verdict summary

3 of 7 pairs are Fail or Error.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 0 | 0 |
| ATTENTION | 1 | 1 |
| UNSUPPORTED | 0 | 1 |
| BLOCKED | 1 | 0 |
| ERROR | 1 | 2 |

## Support matrix

| Run | Check | lv | optiland | zemax |
|---|---|---|---|---|
| tele | mtf-vs-optiland-fft, request 1 of 2 | ok | ok | error: spawn-failed |
| tele | mtf-vs-optiland-fft, request 2 of 2 | ok | unsupported: feature surface.asphere.odd, option a\|b | — |
| tele | built-system | ok | pending | — |
| tele | first-order | ok | ok | — |

## Results

### tele

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`, request 1 of 2

Quantity `mtf.native`: each engine's own method; side by side, no limit. Request `1111111111111111111111111111111111111111111111111111111111111111`.

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

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`, request 2 of 2

Quantity `mtf.native`: each engine's own method; side by side, no limit. Request `2222222222222222222222222222222222222222222222222222222222222222`.

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland |
|---|---|---|
| lv | — | UNSUPPORTED |
| optiland | UNSUPPORTED | — |

#### Built system — `built-system`

Quantity `system.describe`: the limits file has no entry for this check. Request `1111111111111111111111111111111111111111111111111111111111111111`.

Reference vs each, against `lv`:

No other engine was compared.

#### First-order data — `first-order`

Quantity `paraxial.first-order`: numbers of each engine set against each other; held to a limit. Request `2222222222222222222222222222222222222222222222222222222222222222`.

Reference vs each, against `lv`:

| Engine | firstOrder.maxAbs (≤ 1.00e-9 mm) | Verdict | Note |
|---|---|---|---|
| optiland | — | BLOCKED | not judged: rung built-system failed for lv and optiland on this case |

Recorded values, as each engine reports them. They are listed and never judged:

| Value | lv | optiland |
|---|---|---|
| epZ\|RelStop[0] | -1.25000000e1 | — |
| epZ\|RelStop[1] | not finite | — |
| magnification[0] | -2.50000000e-1 | -2.50000000e-1 |
| magnification[1] | -2.50100000e-1 | — |

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
