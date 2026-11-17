# Baseline of features: the MTF checks

This file is the committed record of the MTF checks of the suite features, as its MTF baseline holds them, for
every run (one lens state; a zoom lens is run at each end of its range wherever no zoom position is named). A
check held to a limit gives, for every pair of engines, the verdict and the largest value of each figure over
the requests of the run, with the number of requests the figure was measured in, since some checks measure a
figure only where their sampling settled. A side-by-side check has no limit: its figures are written down beside
a review band, and its tables set the engines' own estimates side by side.

The file is rendered from the baseline alone, so `lvrtc verify` can render it anew and compare it byte for byte:
it holds results, counts, names and hashes, and no ray an engine traced. `lvrtc baseline check --mtf` runs the
engines again and says whether the lens states and the engines are still those of the baseline, and what moved.
How to read this, near the end, says what each label and column means.

## Inputs

| Input | Value |
|---|---|
| Suite | features |
| Limits file | v25 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | clean checkout, 193 engine files |
| optiland | optiland | 0.6.2.post234+ga9e544a2 | backend numpy, clean checkout, JIT compilation on, Numba 0.65.1, NumPy 2.3.5, precision float64, Python 3.14.8, SciPy 1.16.3, 611 source files |
| reference-tracer | Reference tracer | 1 | 13 source files |
| replay-of-lv-mtf | Replay of LensVisualizer's MTF | 1 | clean checkout, 193 engine files |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 18 | 54 | lv – optiland | 18 Pass | 54 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 18 | 54 | lv – reference-tracer | 18 Pass | 54 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 18 | 54 | optiland – reference-tracer | 18 Pass | 54 Pass |
| LensVisualizer's MTF sampling, replayed — `lv-mtf-replay` | `mtf.native` | 18 | 18 | lv – replay-of-lv-mtf | 18 Pass | 18 Pass |
| Wave MTF of the same rays — `wave-mtf` | `rays.trace` | 18 | 54 | lv – optiland | 18 Pass | 54 Pass |
| Wave MTF of the same rays — `wave-mtf` | `rays.trace` | 18 | 54 | lv – reference-tracer | 18 Pass | 54 Pass |
| Wave MTF of the same rays — `wave-mtf` | `rays.trace` | 18 | 54 | optiland – reference-tracer | 18 Pass | 54 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Geometric MTF of the same rays — `geometric-mtf` | lv | 18 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 18 answered |
| Geometric MTF of the same rays — `geometric-mtf` | reference-tracer | 18 answered |
| LensVisualizer's MTF sampling, replayed — `lv-mtf-replay` | lv | 18 answered |
| LensVisualizer's MTF sampling, replayed — `lv-mtf-replay` | replay-of-lv-mtf | 18 answered |
| Wave MTF of the same rays — `wave-mtf` | lv | 18 answered |
| Wave MTF of the same rays — `wave-mtf` | optiland | 18 answered |
| Wave MTF of the same rays — `wave-mtf` | reference-tracer | 18 answered |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.70e-12 | 54 of 54 | stop-inside-element-ref | cut tangential, field 5.53e1 deg, frequencyPerMm 56 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 237404 | 54 of 54 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 54 of 54 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 54 of 54 | odd-asphere-photopic | — |
| lv – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 6.91e-12 | 54 of 54 | flat-base-asphere-ref | cut sagittal, field 0 deg, frequencyPerMm 100 |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 237404 | 54 of 54 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 54 of 54 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 54 of 54 | odd-asphere-photopic | — |
| optiland – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 7.22e-12 | 54 of 54 | flat-base-asphere-ref | cut tangential, field 0 deg, frequencyPerMm 100 |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 237404 | 54 of 54 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 54 of 54 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 54 of 54 | odd-asphere-photopic | — |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| odd-asphere-ref | 3 | Pass: mtf.maxAbs 4.03e-13 (3 of 3) | Pass: mtf.maxAbs 1.38e-12 (3 of 3) | Pass: mtf.maxAbs 1.75e-12 (3 of 3) |
| odd-asphere-photopic | 3 | Pass: mtf.maxAbs 7.41e-13 (3 of 3) | Pass: mtf.maxAbs 6.95e-13 (3 of 3) | Pass: mtf.maxAbs 6.29e-13 (3 of 3) |
| e-line-ref | 3 | Pass: mtf.maxAbs 7.08e-13 (3 of 3) | Pass: mtf.maxAbs 4.90e-13 (3 of 3) | Pass: mtf.maxAbs 7.35e-13 (3 of 3) |
| e-line-photopic | 3 | Pass: mtf.maxAbs 3.96e-13 (3 of 3) | Pass: mtf.maxAbs 3.77e-13 (3 of 3) | Pass: mtf.maxAbs 4.02e-13 (3 of 3) |
| asphere-a20-ref | 3 | Pass: mtf.maxAbs 8.84e-13 (3 of 3) | Pass: mtf.maxAbs 6.43e-12 (3 of 3) | Pass: mtf.maxAbs 7.19e-12 (3 of 3) |
| asphere-a20-photopic | 3 | Pass: mtf.maxAbs 5.19e-13 (3 of 3) | Pass: mtf.maxAbs 5.12e-12 (3 of 3) | Pass: mtf.maxAbs 5.01e-12 (3 of 3) |
| flat-base-asphere-ref | 3 | Pass: mtf.maxAbs 1.12e-12 (3 of 3) | Pass: mtf.maxAbs 6.91e-12 (3 of 3) | Pass: mtf.maxAbs 7.22e-12 (3 of 3) |
| flat-base-asphere-photopic | 3 | Pass: mtf.maxAbs 5.39e-13 (3 of 3) | Pass: mtf.maxAbs 6.79e-12 (3 of 3) | Pass: mtf.maxAbs 6.77e-12 (3 of 3) |
| rear-plate-rim-ref | 3 | Pass: mtf.maxAbs 1.35e-12 (3 of 3) | Pass: mtf.maxAbs 4.25e-12 (3 of 3) | Pass: mtf.maxAbs 5.55e-12 (3 of 3) |
| rear-plate-rim-photopic | 3 | Pass: mtf.maxAbs 1.02e-12 (3 of 3) | Pass: mtf.maxAbs 1.93e-12 (3 of 3) | Pass: mtf.maxAbs 2.18e-12 (3 of 3) |
| fixed-iris-zoom-ref-wide | 3 | Pass: mtf.maxAbs 3.17e-13 (3 of 3) | Pass: mtf.maxAbs 4.18e-12 (3 of 3) | Pass: mtf.maxAbs 3.92e-12 (3 of 3) |
| fixed-iris-zoom-ref-tele | 3 | Pass: mtf.maxAbs 4.73e-13 (3 of 3) | Pass: mtf.maxAbs 9.72e-13 (3 of 3) | Pass: mtf.maxAbs 1.20e-12 (3 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | Pass: mtf.maxAbs 2.01e-13 (3 of 3) | Pass: mtf.maxAbs 2.51e-12 (3 of 3) | Pass: mtf.maxAbs 2.40e-12 (3 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | Pass: mtf.maxAbs 3.53e-13 (3 of 3) | Pass: mtf.maxAbs 9.34e-13 (3 of 3) | Pass: mtf.maxAbs 1.04e-12 (3 of 3) |
| zero-asphere-ref | 3 | Pass: mtf.maxAbs 9.61e-13 (3 of 3) | Pass: mtf.maxAbs 3.46e-13 (3 of 3) | Pass: mtf.maxAbs 1.14e-12 (3 of 3) |
| zero-asphere-photopic | 3 | Pass: mtf.maxAbs 3.19e-13 (3 of 3) | Pass: mtf.maxAbs 1.53e-13 (3 of 3) | Pass: mtf.maxAbs 2.84e-13 (3 of 3) |
| stop-inside-element-ref | 3 | Pass: mtf.maxAbs 1.70e-12 (3 of 3) | Pass: mtf.maxAbs 6.00e-13 (3 of 3) | Pass: mtf.maxAbs 1.11e-12 (3 of 3) |
| stop-inside-element-photopic | 3 | Pass: mtf.maxAbs 4.19e-13 (3 of 3) | Pass: mtf.maxAbs 2.04e-13 (3 of 3) | Pass: mtf.maxAbs 4.61e-13 (3 of 3) |

## LensVisualizer's MTF sampling, replayed — `lv-mtf-replay`

Compares: LensVisualizer's geometric MTF beside a replay of its own sampling. Kind: held to a limit. Quantity asked of the engines: an engine's own MTF (`mtf.native`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – replay-of-lv-mtf | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.19e-14 | 18 of 18 | zero-asphere-ref | cut sagittal, field 1 of the image height, frequencyPerMm 8 |
| lv – replay-of-lv-mtf | Sampling grids, ray counts and ray outcomes that differ — `sampling.mismatches` | elements | ≤ 0 | 0 | 18 of 18 | — | — |
| lv – replay-of-lv-mtf | Fields whose outcome differs — `fields.mismatches` | elements | ≤ 0 | 0 | 18 of 18 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay-of-lv-mtf |
|---|---|---|
| odd-asphere-ref | 1 | Pass: mtf.maxAbs 5.00e-15 (1 of 1) |
| odd-asphere-photopic | 1 | Pass: mtf.maxAbs 2.55e-15 (1 of 1) |
| e-line-ref | 1 | Pass: mtf.maxAbs 8.44e-15 (1 of 1) |
| e-line-photopic | 1 | Pass: mtf.maxAbs 3.44e-15 (1 of 1) |
| asphere-a20-ref | 1 | Pass: mtf.maxAbs 8.22e-15 (1 of 1) |
| asphere-a20-photopic | 1 | Pass: mtf.maxAbs 2.55e-15 (1 of 1) |
| flat-base-asphere-ref | 1 | Pass: mtf.maxAbs 5.55e-15 (1 of 1) |
| flat-base-asphere-photopic | 1 | Pass: mtf.maxAbs 2.78e-15 (1 of 1) |
| rear-plate-rim-ref | 1 | Pass: mtf.maxAbs 7.11e-15 (1 of 1) |
| rear-plate-rim-photopic | 1 | Pass: mtf.maxAbs 2.78e-15 (1 of 1) |
| fixed-iris-zoom-ref-wide | 1 | Pass: mtf.maxAbs 8.55e-15 (1 of 1) |
| fixed-iris-zoom-ref-tele | 1 | Pass: mtf.maxAbs 8.77e-15 (1 of 1) |
| fixed-iris-zoom-photopic-wide | 1 | Pass: mtf.maxAbs 4.77e-15 (1 of 1) |
| fixed-iris-zoom-photopic-tele | 1 | Pass: mtf.maxAbs 2.78e-15 (1 of 1) |
| zero-asphere-ref | 1 | Pass: mtf.maxAbs 1.19e-14 (1 of 1) |
| zero-asphere-photopic | 1 | Pass: mtf.maxAbs 2.22e-15 (1 of 1) |
| stop-inside-element-ref | 1 | Pass: mtf.maxAbs 5.33e-15 (1 of 1) |
| stop-inside-element-photopic | 1 | Pass: mtf.maxAbs 2.33e-15 (1 of 1) |

## Wave MTF of the same rays — `wave-mtf`

Compares: This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a wave MTF value, on the finest lattice — `waveMtf.maxAbs` | (no unit) | ≤ 2.00e-8 | 8.00e-11 | 30 of 54 | flat-base-asphere-ref | cut tangential, field 3.17e1 deg, frequencyPerMm 70 |
| lv – optiland | Largest phase step between neighbouring cells of the lattice that carry light — `phaseStep.waves` | waves | — | 6.31e0 | 54 of 54 | e-line-photopic | field 2.34e1 deg, line 7, ray 1091 |
| lv – optiland | Largest move of a wave MTF value from the coarser lattice to the finer — `convergence.maxAbs` | (no unit) | — | 7.18e-2 | 54 of 54 | e-line-ref | cut tangential, field 2.34e1 deg, frequencyPerMm 90 |
| lv – optiland | Cells across the finest lattice — `lattice.columns` | cells | — | 64 | 54 of 54 | odd-asphere-ref | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 949926 | 54 of 54 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 54 of 54 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 54 of 54 | odd-asphere-photopic | — |
| lv – optiland | Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged) — `waveMtf.flagged` | (no unit) | — | 9.62e-11 | 24 of 54 | flat-base-asphere-photopic | cut tangential, field 3.17e1 deg, frequencyPerMm 70 |
| lv – reference-tracer | Largest difference of a wave MTF value, on the finest lattice — `waveMtf.maxAbs` | (no unit) | ≤ 2.00e-8 | 7.01e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1 deg, frequencyPerMm 60 |
| lv – reference-tracer | Largest phase step between neighbouring cells of the lattice that carry light — `phaseStep.waves` | waves | — | 6.31e0 | 54 of 54 | e-line-photopic | field 2.34e1 deg, line 7, ray 1091 |
| lv – reference-tracer | Largest move of a wave MTF value from the coarser lattice to the finer — `convergence.maxAbs` | (no unit) | — | 7.18e-2 | 54 of 54 | e-line-ref | cut tangential, field 2.34e1 deg, frequencyPerMm 90 |
| lv – reference-tracer | Cells across the finest lattice — `lattice.columns` | cells | — | 64 | 54 of 54 | odd-asphere-ref | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 949926 | 54 of 54 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 54 of 54 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 54 of 54 | odd-asphere-photopic | — |
| lv – reference-tracer | Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged) — `waveMtf.flagged` | (no unit) | — | 4.00e-10 | 24 of 54 | flat-base-asphere-ref | cut tangential, field 0 deg, frequencyPerMm 60 |
| optiland – reference-tracer | Largest difference of a wave MTF value, on the finest lattice — `waveMtf.maxAbs` | (no unit) | ≤ 2.00e-8 | 6.96e-10 | 30 of 54 | fixed-iris-zoom-photopic-tele | cut tangential, field 1.48e1 deg, frequencyPerMm 60 |
| optiland – reference-tracer | Largest phase step between neighbouring cells of the lattice that carry light — `phaseStep.waves` | waves | — | 6.31e0 | 54 of 54 | e-line-photopic | field 2.34e1 deg, line 7, ray 1091 |
| optiland – reference-tracer | Largest move of a wave MTF value from the coarser lattice to the finer — `convergence.maxAbs` | (no unit) | — | 7.18e-2 | 54 of 54 | e-line-ref | cut tangential, field 2.34e1 deg, frequencyPerMm 90 |
| optiland – reference-tracer | Cells across the finest lattice — `lattice.columns` | cells | — | 64 | 54 of 54 | odd-asphere-ref | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 949926 | 54 of 54 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 54 of 54 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 54 of 54 | odd-asphere-photopic | — |
| optiland – reference-tracer | Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged) — `waveMtf.flagged` | (no unit) | — | 4.03e-10 | 24 of 54 | flat-base-asphere-ref | cut tangential, field 0 deg, frequencyPerMm 60 |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| odd-asphere-ref | 3 | Pass: waveMtf.maxAbs 3.74e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.51e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.07e-11 (3 of 3) |
| odd-asphere-photopic | 3 | Pass: waveMtf.maxAbs 4.88e-12 (1 of 3) | Pass: waveMtf.maxAbs 5.84e-11 (1 of 3) | Pass: waveMtf.maxAbs 6.26e-11 (1 of 3) |
| e-line-ref | 3 | Pass: no judged figure | Pass: no judged figure | Pass: no judged figure |
| e-line-photopic | 3 | Pass: no judged figure | Pass: no judged figure | Pass: no judged figure |
| asphere-a20-ref | 3 | Pass: waveMtf.maxAbs 3.80e-12 (2 of 3) | Pass: waveMtf.maxAbs 4.25e-10 (2 of 3) | Pass: waveMtf.maxAbs 4.28e-10 (2 of 3) |
| asphere-a20-photopic | 3 | Pass: waveMtf.maxAbs 2.47e-12 (2 of 3) | Pass: waveMtf.maxAbs 3.53e-10 (2 of 3) | Pass: waveMtf.maxAbs 3.51e-10 (2 of 3) |
| flat-base-asphere-ref | 3 | Pass: waveMtf.maxAbs 8.00e-11 (2 of 3) | Pass: waveMtf.maxAbs 3.26e-10 (2 of 3) | Pass: waveMtf.maxAbs 3.33e-10 (2 of 3) |
| flat-base-asphere-photopic | 3 | Pass: waveMtf.maxAbs 5.72e-12 (2 of 3) | Pass: waveMtf.maxAbs 3.70e-10 (2 of 3) | Pass: waveMtf.maxAbs 3.74e-10 (2 of 3) |
| rear-plate-rim-ref | 3 | Pass: waveMtf.maxAbs 1.37e-11 (2 of 3) | Pass: waveMtf.maxAbs 2.46e-10 (2 of 3) | Pass: waveMtf.maxAbs 2.38e-10 (2 of 3) |
| rear-plate-rim-photopic | 3 | Pass: waveMtf.maxAbs 7.54e-12 (2 of 3) | Pass: waveMtf.maxAbs 1.40e-10 (2 of 3) | Pass: waveMtf.maxAbs 1.45e-10 (2 of 3) |
| fixed-iris-zoom-ref-wide | 3 | Pass: waveMtf.maxAbs 9.36e-12 (2 of 3) | Pass: waveMtf.maxAbs 2.02e-10 (2 of 3) | Pass: waveMtf.maxAbs 2.07e-10 (2 of 3) |
| fixed-iris-zoom-ref-tele | 3 | Pass: waveMtf.maxAbs 1.14e-11 (3 of 3) | Pass: waveMtf.maxAbs 6.55e-10 (3 of 3) | Pass: waveMtf.maxAbs 6.62e-10 (3 of 3) |
| fixed-iris-zoom-photopic-wide | 3 | Pass: waveMtf.maxAbs 4.57e-12 (2 of 3) | Pass: waveMtf.maxAbs 1.86e-10 (2 of 3) | Pass: waveMtf.maxAbs 1.86e-10 (2 of 3) |
| fixed-iris-zoom-photopic-tele | 3 | Pass: waveMtf.maxAbs 4.92e-12 (3 of 3) | Pass: waveMtf.maxAbs 7.01e-10 (3 of 3) | Pass: waveMtf.maxAbs 6.96e-10 (3 of 3) |
| zero-asphere-ref | 3 | Pass: no judged figure | Pass: no judged figure | Pass: no judged figure |
| zero-asphere-photopic | 3 | Pass: no judged figure | Pass: no judged figure | Pass: no judged figure |
| stop-inside-element-ref | 3 | Pass: waveMtf.maxAbs 4.17e-12 (2 of 3) | Pass: waveMtf.maxAbs 6.26e-12 (2 of 3) | Pass: waveMtf.maxAbs 4.88e-12 (2 of 3) |
| stop-inside-element-photopic | 3 | Pass: waveMtf.maxAbs 1.98e-12 (2 of 3) | Pass: waveMtf.maxAbs 2.50e-12 (2 of 3) | Pass: waveMtf.maxAbs 1.78e-12 (2 of 3) |

## Worth a look

Every request of a side-by-side check whose two engines differ by more than a review band, or whose chief rays
land further apart than a sorting limit, with each such figure. A review band is a width for attention, and a
sorting limit tells two image points apart; nothing here is a failure.

No request is worth a look by its review bands.

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

### Verdicts

A verdict is of one pair of engines: of one request, or, in a table by run, the worst over the requests of the
run. A table shows the label; the stored value is what the baseline file holds.

| Label | Stored value | Meaning |
|---|---|---|
| Pass: within limit | `PASS` | A check held to a limit: every judged figure is at or below its limit. |

### Checks

A check held to a limit judges two engines' answers to the same input against the limits of the limits file. A
side-by-side check sets two methods beside each other with no limit, and fails nothing. A section of this file
is headed by a check's title, with the id the baseline file stores it under.

| Check | Id | Kind | Compares |
|---|---|---|---|
| Geometric MTF of the same rays | `geometric-mtf` | held to a limit | This tool's geometric MTF of identical rays, as each engine traces them. |
| LensVisualizer's MTF sampling, replayed | `lv-mtf-replay` | held to a limit | LensVisualizer's geometric MTF beside a replay of its own sampling. |
| Wave MTF of the same rays | `wave-mtf` | held to a limit | This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled. |

### Engines

A pair is named by the ids of its two engines:

| Id | Engine |
|---|---|
| `lv` | LensVisualizer itself, loaded from a local checkout, asked for each figure as its own tabs ask for it, and made to trace the very rays every engine is handed in the checks held to a limit. |
| `optiland` | optiland, an open-source optical design library in Python, run by this tool in a worker process of its own. |
| `reference-tracer` | The reference tracer: a small exact ray tracer written in this repository from the optics alone, never from LensVisualizer's or optiland's code. |
| `replay-of-lv-mtf` | LensVisualizer's own MTF sampling, repeated step by step, with the geometric MTF summed by this tool. |

### Figures

A figure is named by its label, then the key the baseline file stores it under. The Limit column gives, for a
check held to a limit, the largest value a pair may have (`≤`); for a side-by-side check, the review band a
difference is set beside. A figure without either is shown and not judged; a chief-ray landing of a side-by-side
check is held to the sorting limit its tables state. Numbers have three significant digits, and a whole number,
such as a count, is written in full. `not finite` marks a number that is NaN or infinite, and `—` a place with
nothing to show.

Requests measured: in how many requests a pair has a value of the figure; a check measures some figures only where its sampling settled.

### Where

The place of a figure's largest value, as the requests name it:

| Place | Meaning |
|---|---|
| `cut` | the sagittal or the tangential cut of an MTF |
| `field` | in a check of the ray-trace quantity: the field angle of the set of rays, in degrees (shown with deg) |
| `field` | in a check of an engine's own MTF: the field as the request states it, a fraction of the image height, 0 on the axis and 1 at the edge of the image (shown with "of the image height"); an MTF table gives the angle beside it where the answers record one |
| `frequencyPerMm` | the spatial frequency, in cycles per millimetre |
| `line` | the index of a wavelength in the lens state's list of wavelengths, 0 being the first |
| `ray` | the index of a ray in its set |

This baseline does not keep the wavelengths themselves: a place names a wavelength by its index in the lens state alone.

### Run names

A run's name is the name the suite gives it, usually a lens key (in the features suite, the feature it exercises; in the catalog, `catalog-` then the lens key), then the parts below that apply. They are the naming of the committed suites; a lens key may hold the same letters as a part of its own.

| Part | Meaning |
|---|---|
| `-ref` | the lens state at the lens's reference wavelength alone |
| `-photopic` | the lens state on several wavelengths, weighted by the eye's daylight (photopic) response |
| `-wide, -tele` | a zoom lens at the short or the long end of its zoom range |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | aa823d9aab0a4315712625b81cb17b7a6db47656eaed465c5c3eb37a8c241077 |
| Baseline file | dab06e3d542b8a1aa6387a9179adcb05b0455eaaec896932b33eed9cb7c239ca |
| Limits file | 3e6d9a8477bb56df20f310e2184e19169b30a07dc7b373508b746d8211f476ad |
| Contract version of the baseline file | 1.1 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61 | 674d26ffb708596a5462f6199b1cb2c28df679003651e53ebb4bbde0e590be9a | commit f5b456fec7b69184844078f6ec6b1ac132f8ec58 |
| optiland | 2ca0f73256d5e0ead64aa3695522bef399721276bf11d612db34b7bf19c5ee39 | 59039a7b219f2882f1e4cabf8f43bc07a9fdf66ecb95d26f4076feca4406d853 | commit a9e544a2e058f1c1b64606e9ce90e6dc103efee1, distribution version 0.6.2.post234+ga9e544a2, source hash 1d35bfa2f7a6addd60f2c1057cd17e65a710a6a7d4e3a277e8675647d0262131 |
| reference-tracer | 1285061cefc83b4538eba70d6a45fc6f0186be2b876f122a3721e150c5a34ed3 | 49ce9a07661a4cb64d5850ff62a4c3ac138b08fee37d05c86596498dcd7db117 | — |
| replay-of-lv-mtf | f0066505c45b705ef5e22a44ee6303ae9f47de00e295faad6d72b6090cdd4a61 | 0f8e411dfa360a2b0db6a309e23b72c9122dd416d48e2b7c8037a2d8e713674b | commit f5b456fec7b69184844078f6ec6b1ac132f8ec58 |

| Run | Lens state |
|---|---|
| odd-asphere-ref | d24ce91f200b115d1ef919d9fdb14b4db87b5d67f8e38b63efca3cfd91ddf4af |
| odd-asphere-photopic | 23602f8f211374314f6aca3c06206a73cb862bf60596a9c91af736d5d904985f |
| e-line-ref | 0b0f82fadbb79be999e3bf439eb67044e620fd05941e7346e67e99d0a440171d |
| e-line-photopic | 11ab0d5042ca5dc4b00fd6f8e701516e359d2d61473d3dc9a8616f1ed73a5715 |
| asphere-a20-ref | b10db914a934de3a2a074ccd8d938e8f5a15df09bbbe41e90b3adfaec28de5b1 |
| asphere-a20-photopic | 4a9d1dc6968b423000c481555626b493e8e981f6b697448d2622958b5565fb06 |
| flat-base-asphere-ref | dcde783cdad5fd68c9aca52a808241a3d436c3f568576b791de8acdc0fd5f030 |
| flat-base-asphere-photopic | 02c8b825833f7787a9a89f8a2965581385c4f6f30ce76a7212ccb28d39d7fe07 |
| rear-plate-rim-ref | 31bf486acface061c777c104e2acb25e14f899a7dd2988b63d0838c8e46fba92 |
| rear-plate-rim-photopic | 20d2bce24646becd48944bc49d11181a1a7cf719757789ff15a63bbe19c3e9ff |
| fixed-iris-zoom-ref-wide | 4db46962ff43d333cab4430dc739c4afd7e77824ee7f7b12e37169b0be3111a3 |
| fixed-iris-zoom-ref-tele | 15567bb5f10f9c71fda356870eabbca30ac1c4c693c8e097521b2a4308432b72 |
| fixed-iris-zoom-photopic-wide | 657d721f00e4e7a2bb73dcf9e8ee7fef0d6dc7aea0445b6d30d5f3f1ffdf4514 |
| fixed-iris-zoom-photopic-tele | 816bafa86ff5cb14e956910bc94f377f02c31ebd5990ce11010aee245bc95bb4 |
| zero-asphere-ref | 7ecd42d1bcf433bc492fb0eafaae81190c604a9969bb0b9b867682ba13b421be |
| zero-asphere-photopic | e2a9fae8ddea306f59b9f7c6efdf336b32f235f7fa72ca555d0c992a8757d9a9 |
| stop-inside-element-ref | 9c90996c1ae092730c28de5e63b2d67f0ea5f3045e60138260d88992481de51a |
| stop-inside-element-photopic | 62a320eb14595b20780012fb759cf0ca701dbd2a599cd745025fd9abaaa9774d |
