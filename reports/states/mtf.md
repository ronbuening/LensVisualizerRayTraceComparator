# Baseline of states: the MTF checks

This file is the committed record of the MTF checks of the suite states, as its MTF baseline holds them, for
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
| Suite | states |
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
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 128 | 384 | lv – optiland | 128 Pass | 384 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 128 | 384 | lv – reference-tracer | 128 Pass | 384 Pass |
| Geometric MTF of the same rays — `geometric-mtf` | `rays.trace` | 128 | 384 | optiland – reference-tracer | 128 Pass | 384 Pass |
| LensVisualizer's MTF sampling, replayed — `lv-mtf-replay` | `mtf.native` | 128 | 128 | lv – replay-of-lv-mtf | 128 Pass | 128 Pass |
| Wave MTF of the same rays — `wave-mtf` | `rays.trace` | 128 | 384 | lv – optiland | 128 Pass | 384 Pass |
| Wave MTF of the same rays — `wave-mtf` | `rays.trace` | 128 | 384 | lv – reference-tracer | 128 Pass | 384 Pass |
| Wave MTF of the same rays — `wave-mtf` | `rays.trace` | 128 | 384 | optiland – reference-tracer | 128 Pass | 384 Pass |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| Geometric MTF of the same rays — `geometric-mtf` | lv | 128 answered |
| Geometric MTF of the same rays — `geometric-mtf` | optiland | 128 answered |
| Geometric MTF of the same rays — `geometric-mtf` | reference-tracer | 128 answered |
| LensVisualizer's MTF sampling, replayed — `lv-mtf-replay` | lv | 128 answered |
| LensVisualizer's MTF sampling, replayed — `lv-mtf-replay` | replay-of-lv-mtf | 128 answered |
| Wave MTF of the same rays — `wave-mtf` | lv | 128 answered |
| Wave MTF of the same rays — `wave-mtf` | optiland | 128 answered |
| Wave MTF of the same rays — `wave-mtf` | reference-tracer | 128 answered |

## Geometric MTF of the same rays — `geometric-mtf`

Compares: This tool's geometric MTF of identical rays, as each engine traces them. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.10e-11 | 384 of 384 | sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | cut tangential, field 2.56e1 deg, frequencyPerMm 100 |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | 384 of 384 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 384 of 384 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.48e-11 | 384 of 384 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1 deg, frequencyPerMm 92 |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | 384 of 384 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 384 of 384 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – reference-tracer | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-7 | 1.43e-11 | 384 of 384 | nikon-z-24-70f4s-f5.6-best-ref-tele | cut tangential, field 1.66e1 deg, frequencyPerMm 94 |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 1923084 | 384 of 384 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 384 of 384 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | Pass: mtf.maxAbs 8.29e-13 (3 of 3) | Pass: mtf.maxAbs 6.43e-13 (3 of 3) | Pass: mtf.maxAbs 9.10e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | Pass: mtf.maxAbs 3.54e-13 (3 of 3) | Pass: mtf.maxAbs 4.99e-13 (3 of 3) | Pass: mtf.maxAbs 8.03e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | Pass: mtf.maxAbs 6.97e-13 (3 of 3) | Pass: mtf.maxAbs 5.98e-13 (3 of 3) | Pass: mtf.maxAbs 9.78e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 3.21e-13 (3 of 3) | Pass: mtf.maxAbs 5.87e-13 (3 of 3) | Pass: mtf.maxAbs 8.46e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-ref | 3 | Pass: mtf.maxAbs 3.34e-13 (3 of 3) | Pass: mtf.maxAbs 2.37e-13 (3 of 3) | Pass: mtf.maxAbs 4.88e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-photopic | 3 | Pass: mtf.maxAbs 8.58e-13 (3 of 3) | Pass: mtf.maxAbs 3.65e-13 (3 of 3) | Pass: mtf.maxAbs 6.93e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | Pass: mtf.maxAbs 3.53e-13 (3 of 3) | Pass: mtf.maxAbs 2.25e-13 (3 of 3) | Pass: mtf.maxAbs 5.00e-13 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.59e-13 (3 of 3) | Pass: mtf.maxAbs 4.33e-13 (3 of 3) | Pass: mtf.maxAbs 5.10e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | Pass: mtf.maxAbs 4.27e-13 (3 of 3) | Pass: mtf.maxAbs 6.20e-13 (3 of 3) | Pass: mtf.maxAbs 1.05e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | Pass: mtf.maxAbs 3.90e-13 (3 of 3) | Pass: mtf.maxAbs 5.55e-13 (3 of 3) | Pass: mtf.maxAbs 9.34e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | Pass: mtf.maxAbs 4.89e-13 (3 of 3) | Pass: mtf.maxAbs 4.45e-13 (3 of 3) | Pass: mtf.maxAbs 8.47e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 6.05e-13 (3 of 3) | Pass: mtf.maxAbs 2.36e-13 (3 of 3) | Pass: mtf.maxAbs 6.29e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | Pass: mtf.maxAbs 2.61e-13 (3 of 3) | Pass: mtf.maxAbs 3.00e-13 (3 of 3) | Pass: mtf.maxAbs 5.37e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | Pass: mtf.maxAbs 5.50e-13 (3 of 3) | Pass: mtf.maxAbs 2.45e-13 (3 of 3) | Pass: mtf.maxAbs 4.03e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | Pass: mtf.maxAbs 2.62e-13 (3 of 3) | Pass: mtf.maxAbs 3.09e-13 (3 of 3) | Pass: mtf.maxAbs 5.57e-13 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.37e-13 (3 of 3) | Pass: mtf.maxAbs 2.39e-13 (3 of 3) | Pass: mtf.maxAbs 4.40e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | Pass: mtf.maxAbs 4.36e-13 (3 of 3) | Pass: mtf.maxAbs 4.28e-12 (3 of 3) | Pass: mtf.maxAbs 4.29e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | Pass: mtf.maxAbs 2.89e-13 (3 of 3) | Pass: mtf.maxAbs 3.57e-13 (3 of 3) | Pass: mtf.maxAbs 3.60e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | Pass: mtf.maxAbs 4.23e-13 (3 of 3) | Pass: mtf.maxAbs 4.01e-12 (3 of 3) | Pass: mtf.maxAbs 4.14e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 3.38e-13 (3 of 3) | Pass: mtf.maxAbs 1.64e-12 (3 of 3) | Pass: mtf.maxAbs 1.70e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | Pass: mtf.maxAbs 1.55e-13 (3 of 3) | Pass: mtf.maxAbs 1.64e-12 (3 of 3) | Pass: mtf.maxAbs 1.72e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | Pass: mtf.maxAbs 4.81e-13 (3 of 3) | Pass: mtf.maxAbs 7.51e-14 (3 of 3) | Pass: mtf.maxAbs 5.29e-13 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | Pass: mtf.maxAbs 1.57e-13 (3 of 3) | Pass: mtf.maxAbs 1.64e-12 (3 of 3) | Pass: mtf.maxAbs 1.63e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.86e-13 (3 of 3) | Pass: mtf.maxAbs 2.27e-13 (3 of 3) | Pass: mtf.maxAbs 8.01e-13 (3 of 3) |
| nikkor-z50f12-f5.6-ref | 3 | Pass: mtf.maxAbs 3.12e-12 (3 of 3) | Pass: mtf.maxAbs 7.45e-12 (3 of 3) | Pass: mtf.maxAbs 7.39e-12 (3 of 3) |
| nikkor-z50f12-f5.6-photopic | 3 | Pass: mtf.maxAbs 2.66e-12 (3 of 3) | Pass: mtf.maxAbs 6.00e-12 (3 of 3) | Pass: mtf.maxAbs 7.09e-12 (3 of 3) |
| nikkor-z50f12-f5.6-best-ref | 3 | Pass: mtf.maxAbs 3.08e-12 (3 of 3) | Pass: mtf.maxAbs 7.34e-12 (3 of 3) | Pass: mtf.maxAbs 7.31e-12 (3 of 3) |
| nikkor-z50f12-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 2.62e-12 (3 of 3) | Pass: mtf.maxAbs 5.96e-12 (3 of 3) | Pass: mtf.maxAbs 6.77e-12 (3 of 3) |
| nikkor-z50f12-f11-ref | 3 | Pass: mtf.maxAbs 9.58e-13 (3 of 3) | Pass: mtf.maxAbs 6.61e-13 (3 of 3) | Pass: mtf.maxAbs 1.62e-12 (3 of 3) |
| nikkor-z50f12-f11-photopic | 3 | Pass: mtf.maxAbs 7.38e-13 (3 of 3) | Pass: mtf.maxAbs 2.41e-13 (3 of 3) | Pass: mtf.maxAbs 8.51e-13 (3 of 3) |
| nikkor-z50f12-f11-best-ref | 3 | Pass: mtf.maxAbs 9.25e-13 (3 of 3) | Pass: mtf.maxAbs 6.89e-13 (3 of 3) | Pass: mtf.maxAbs 1.61e-12 (3 of 3) |
| nikkor-z50f12-f11-best-photopic | 3 | Pass: mtf.maxAbs 8.32e-13 (3 of 3) | Pass: mtf.maxAbs 2.51e-13 (3 of 3) | Pass: mtf.maxAbs 8.68e-13 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | Pass: mtf.maxAbs 1.17e-12 (3 of 3) | Pass: mtf.maxAbs 2.97e-12 (3 of 3) | Pass: mtf.maxAbs 3.20e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | Pass: mtf.maxAbs 6.29e-13 (3 of 3) | Pass: mtf.maxAbs 2.86e-12 (3 of 3) | Pass: mtf.maxAbs 2.66e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.17e-12 (3 of 3) | Pass: mtf.maxAbs 3.03e-12 (3 of 3) | Pass: mtf.maxAbs 3.26e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 6.56e-13 (3 of 3) | Pass: mtf.maxAbs 3.13e-12 (3 of 3) | Pass: mtf.maxAbs 2.89e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-ref | 3 | Pass: mtf.maxAbs 6.67e-13 (3 of 3) | Pass: mtf.maxAbs 2.72e-12 (3 of 3) | Pass: mtf.maxAbs 2.88e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-photopic | 3 | Pass: mtf.maxAbs 2.76e-13 (3 of 3) | Pass: mtf.maxAbs 2.05e-12 (3 of 3) | Pass: mtf.maxAbs 1.93e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | Pass: mtf.maxAbs 6.94e-13 (3 of 3) | Pass: mtf.maxAbs 2.64e-12 (3 of 3) | Pass: mtf.maxAbs 2.82e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | Pass: mtf.maxAbs 2.96e-13 (3 of 3) | Pass: mtf.maxAbs 2.10e-12 (3 of 3) | Pass: mtf.maxAbs 1.96e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | Pass: mtf.maxAbs 5.13e-12 (3 of 3) | Pass: mtf.maxAbs 3.78e-12 (3 of 3) | Pass: mtf.maxAbs 6.99e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | Pass: mtf.maxAbs 3.59e-12 (3 of 3) | Pass: mtf.maxAbs 3.46e-12 (3 of 3) | Pass: mtf.maxAbs 6.71e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.43e-12 (3 of 3) | Pass: mtf.maxAbs 6.59e-13 (3 of 3) | Pass: mtf.maxAbs 1.56e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 3.06e-12 (3 of 3) | Pass: mtf.maxAbs 1.06e-12 (3 of 3) | Pass: mtf.maxAbs 2.00e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | Pass: mtf.maxAbs 1.57e-12 (3 of 3) | Pass: mtf.maxAbs 1.89e-12 (3 of 3) | Pass: mtf.maxAbs 3.30e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | Pass: mtf.maxAbs 2.36e-12 (3 of 3) | Pass: mtf.maxAbs 1.49e-12 (3 of 3) | Pass: mtf.maxAbs 2.89e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | Pass: mtf.maxAbs 2.13e-12 (3 of 3) | Pass: mtf.maxAbs 7.77e-13 (3 of 3) | Pass: mtf.maxAbs 2.44e-12 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | Pass: mtf.maxAbs 1.37e-12 (3 of 3) | Pass: mtf.maxAbs 3.36e-13 (3 of 3) | Pass: mtf.maxAbs 1.27e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | Pass: mtf.maxAbs 1.22e-12 (3 of 3) | Pass: mtf.maxAbs 1.95e-12 (3 of 3) | Pass: mtf.maxAbs 3.05e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | Pass: mtf.maxAbs 1.77e-12 (3 of 3) | Pass: mtf.maxAbs 1.78e-12 (3 of 3) | Pass: mtf.maxAbs 3.34e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.14e-12 (3 of 3) | Pass: mtf.maxAbs 1.82e-12 (3 of 3) | Pass: mtf.maxAbs 2.86e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 1.83e-12 (3 of 3) | Pass: mtf.maxAbs 1.85e-12 (3 of 3) | Pass: mtf.maxAbs 3.46e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | Pass: mtf.maxAbs 9.12e-13 (3 of 3) | Pass: mtf.maxAbs 1.95e-12 (3 of 3) | Pass: mtf.maxAbs 1.82e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | Pass: mtf.maxAbs 1.20e-12 (3 of 3) | Pass: mtf.maxAbs 9.78e-13 (3 of 3) | Pass: mtf.maxAbs 2.17e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | Pass: mtf.maxAbs 9.17e-13 (3 of 3) | Pass: mtf.maxAbs 1.97e-12 (3 of 3) | Pass: mtf.maxAbs 1.76e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | Pass: mtf.maxAbs 1.20e-12 (3 of 3) | Pass: mtf.maxAbs 9.64e-13 (3 of 3) | Pass: mtf.maxAbs 2.16e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | Pass: mtf.maxAbs 7.64e-12 (3 of 3) | Pass: mtf.maxAbs 4.98e-12 (3 of 3) | Pass: mtf.maxAbs 6.38e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 8.35e-13 (3 of 3) | Pass: mtf.maxAbs 5.38e-12 (3 of 3) | Pass: mtf.maxAbs 4.85e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | Pass: mtf.maxAbs 6.31e-13 (3 of 3) | Pass: mtf.maxAbs 1.35e-11 (3 of 3) | Pass: mtf.maxAbs 1.34e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | Pass: mtf.maxAbs 1.33e-12 (3 of 3) | Pass: mtf.maxAbs 4.79e-12 (3 of 3) | Pass: mtf.maxAbs 4.87e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 3.35e-13 (3 of 3) | Pass: mtf.maxAbs 4.39e-12 (3 of 3) | Pass: mtf.maxAbs 4.40e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | Pass: mtf.maxAbs 5.34e-13 (3 of 3) | Pass: mtf.maxAbs 5.28e-12 (3 of 3) | Pass: mtf.maxAbs 5.30e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | Pass: mtf.maxAbs 6.83e-12 (3 of 3) | Pass: mtf.maxAbs 1.21e-11 (3 of 3) | Pass: mtf.maxAbs 1.21e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 6.50e-13 (3 of 3) | Pass: mtf.maxAbs 7.61e-12 (3 of 3) | Pass: mtf.maxAbs 7.13e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | Pass: mtf.maxAbs 6.66e-13 (3 of 3) | Pass: mtf.maxAbs 1.48e-11 (3 of 3) | Pass: mtf.maxAbs 1.43e-11 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | Pass: mtf.maxAbs 1.30e-12 (3 of 3) | Pass: mtf.maxAbs 5.99e-12 (3 of 3) | Pass: mtf.maxAbs 6.06e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 5.30e-13 (3 of 3) | Pass: mtf.maxAbs 4.17e-12 (3 of 3) | Pass: mtf.maxAbs 4.35e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | Pass: mtf.maxAbs 5.95e-13 (3 of 3) | Pass: mtf.maxAbs 5.42e-12 (3 of 3) | Pass: mtf.maxAbs 5.26e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-wide | 3 | Pass: mtf.maxAbs 1.54e-12 (3 of 3) | Pass: mtf.maxAbs 6.63e-12 (3 of 3) | Pass: mtf.maxAbs 6.35e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 4.79e-13 (3 of 3) | Pass: mtf.maxAbs 1.60e-12 (3 of 3) | Pass: mtf.maxAbs 1.75e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-tele | 3 | Pass: mtf.maxAbs 7.35e-13 (3 of 3) | Pass: mtf.maxAbs 6.93e-12 (3 of 3) | Pass: mtf.maxAbs 7.67e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | Pass: mtf.maxAbs 7.66e-13 (3 of 3) | Pass: mtf.maxAbs 4.37e-12 (3 of 3) | Pass: mtf.maxAbs 4.41e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 2.67e-13 (3 of 3) | Pass: mtf.maxAbs 2.32e-12 (3 of 3) | Pass: mtf.maxAbs 2.31e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | Pass: mtf.maxAbs 4.65e-13 (3 of 3) | Pass: mtf.maxAbs 4.75e-12 (3 of 3) | Pass: mtf.maxAbs 5.05e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | Pass: mtf.maxAbs 1.41e-12 (3 of 3) | Pass: mtf.maxAbs 1.01e-11 (3 of 3) | Pass: mtf.maxAbs 9.77e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 5.36e-13 (3 of 3) | Pass: mtf.maxAbs 1.46e-12 (3 of 3) | Pass: mtf.maxAbs 1.48e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | Pass: mtf.maxAbs 6.77e-13 (3 of 3) | Pass: mtf.maxAbs 7.34e-12 (3 of 3) | Pass: mtf.maxAbs 8.01e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | Pass: mtf.maxAbs 7.43e-13 (3 of 3) | Pass: mtf.maxAbs 4.62e-12 (3 of 3) | Pass: mtf.maxAbs 4.66e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 2.79e-13 (3 of 3) | Pass: mtf.maxAbs 2.10e-12 (3 of 3) | Pass: mtf.maxAbs 2.11e-12 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | Pass: mtf.maxAbs 3.63e-13 (3 of 3) | Pass: mtf.maxAbs 2.63e-12 (3 of 3) | Pass: mtf.maxAbs 2.82e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-ref | 3 | Pass: mtf.maxAbs 9.14e-13 (3 of 3) | Pass: mtf.maxAbs 3.78e-12 (3 of 3) | Pass: mtf.maxAbs 3.51e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-photopic | 3 | Pass: mtf.maxAbs 4.30e-13 (3 of 3) | Pass: mtf.maxAbs 3.67e-12 (3 of 3) | Pass: mtf.maxAbs 3.46e-12 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | Pass: mtf.maxAbs 9.35e-13 (3 of 3) | Pass: mtf.maxAbs 8.77e-13 (3 of 3) | Pass: mtf.maxAbs 8.64e-13 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 4.02e-13 (3 of 3) | Pass: mtf.maxAbs 6.29e-13 (3 of 3) | Pass: mtf.maxAbs 6.66e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-ref | 3 | Pass: mtf.maxAbs 5.42e-13 (3 of 3) | Pass: mtf.maxAbs 4.66e-13 (3 of 3) | Pass: mtf.maxAbs 7.85e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-photopic | 3 | Pass: mtf.maxAbs 5.98e-13 (3 of 3) | Pass: mtf.maxAbs 4.26e-13 (3 of 3) | Pass: mtf.maxAbs 6.65e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-best-ref | 3 | Pass: mtf.maxAbs 5.81e-13 (3 of 3) | Pass: mtf.maxAbs 4.49e-13 (3 of 3) | Pass: mtf.maxAbs 7.34e-13 (3 of 3) |
| nikon-z-mc-105f28-f11-best-photopic | 3 | Pass: mtf.maxAbs 5.38e-13 (3 of 3) | Pass: mtf.maxAbs 3.87e-13 (3 of 3) | Pass: mtf.maxAbs 5.96e-13 (3 of 3) |
| nikon-z-135f18-plena-f5.6-ref | 3 | Pass: mtf.maxAbs 9.36e-13 (3 of 3) | Pass: mtf.maxAbs 7.36e-13 (3 of 3) | Pass: mtf.maxAbs 1.59e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-photopic | 3 | Pass: mtf.maxAbs 6.91e-13 (3 of 3) | Pass: mtf.maxAbs 8.87e-13 (3 of 3) | Pass: mtf.maxAbs 1.58e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.08e-12 (3 of 3) | Pass: mtf.maxAbs 9.74e-13 (3 of 3) | Pass: mtf.maxAbs 1.83e-12 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 6.80e-13 (3 of 3) | Pass: mtf.maxAbs 8.59e-13 (3 of 3) | Pass: mtf.maxAbs 1.53e-12 (3 of 3) |
| nikon-z-135f18-plena-f11-ref | 3 | Pass: mtf.maxAbs 6.08e-13 (3 of 3) | Pass: mtf.maxAbs 2.81e-13 (3 of 3) | Pass: mtf.maxAbs 3.73e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-photopic | 3 | Pass: mtf.maxAbs 2.75e-13 (3 of 3) | Pass: mtf.maxAbs 9.29e-13 (3 of 3) | Pass: mtf.maxAbs 6.56e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-best-ref | 3 | Pass: mtf.maxAbs 6.42e-13 (3 of 3) | Pass: mtf.maxAbs 2.88e-13 (3 of 3) | Pass: mtf.maxAbs 3.82e-13 (3 of 3) |
| nikon-z-135f18-plena-f11-best-photopic | 3 | Pass: mtf.maxAbs 2.75e-13 (3 of 3) | Pass: mtf.maxAbs 9.19e-13 (3 of 3) | Pass: mtf.maxAbs 6.44e-13 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | Pass: mtf.maxAbs 8.64e-12 (3 of 3) | Pass: mtf.maxAbs 4.91e-12 (3 of 3) | Pass: mtf.maxAbs 9.83e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | Pass: mtf.maxAbs 4.23e-12 (3 of 3) | Pass: mtf.maxAbs 4.10e-12 (3 of 3) | Pass: mtf.maxAbs 7.14e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | Pass: mtf.maxAbs 1.10e-11 (3 of 3) | Pass: mtf.maxAbs 7.54e-12 (3 of 3) | Pass: mtf.maxAbs 9.22e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | Pass: mtf.maxAbs 4.39e-12 (3 of 3) | Pass: mtf.maxAbs 3.18e-12 (3 of 3) | Pass: mtf.maxAbs 7.57e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | Pass: mtf.maxAbs 5.82e-13 (3 of 3) | Pass: mtf.maxAbs 6.06e-12 (3 of 3) | Pass: mtf.maxAbs 6.42e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | Pass: mtf.maxAbs 1.76e-13 (3 of 3) | Pass: mtf.maxAbs 2.07e-12 (3 of 3) | Pass: mtf.maxAbs 1.98e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | Pass: mtf.maxAbs 5.79e-13 (3 of 3) | Pass: mtf.maxAbs 7.62e-12 (3 of 3) | Pass: mtf.maxAbs 7.95e-12 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | Pass: mtf.maxAbs 1.69e-13 (3 of 3) | Pass: mtf.maxAbs 2.61e-12 (3 of 3) | Pass: mtf.maxAbs 2.49e-12 (3 of 3) |
| nikon-z-24-70f4s-open-ref-wide | 3 | Pass: mtf.maxAbs 2.38e-12 (3 of 3) | Pass: mtf.maxAbs 1.05e-11 (3 of 3) | Pass: mtf.maxAbs 1.13e-11 (3 of 3) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 1.11e-12 (3 of 3) | Pass: mtf.maxAbs 3.11e-12 (3 of 3) | Pass: mtf.maxAbs 3.40e-12 (3 of 3) |
| nikon-z-24-70f4s-open-ref-tele | 3 | Pass: mtf.maxAbs 1.23e-12 (3 of 3) | Pass: mtf.maxAbs 1.23e-11 (3 of 3) | Pass: mtf.maxAbs 1.16e-11 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-wide | 3 | Pass: mtf.maxAbs 2.77e-12 (3 of 3) | Pass: mtf.maxAbs 7.71e-12 (3 of 3) | Pass: mtf.maxAbs 7.93e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 4.90e-13 (3 of 3) | Pass: mtf.maxAbs 2.13e-12 (3 of 3) | Pass: mtf.maxAbs 2.25e-12 (3 of 3) |
| nikon-z-24-70f4s-open-photopic-tele | 3 | Pass: mtf.maxAbs 7.67e-13 (3 of 3) | Pass: mtf.maxAbs 7.52e-12 (3 of 3) | Pass: mtf.maxAbs 7.61e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | Pass: mtf.maxAbs 2.20e-12 (3 of 3) | Pass: mtf.maxAbs 1.13e-11 (3 of 3) | Pass: mtf.maxAbs 1.16e-11 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 1.22e-12 (3 of 3) | Pass: mtf.maxAbs 7.05e-12 (3 of 3) | Pass: mtf.maxAbs 6.42e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | Pass: mtf.maxAbs 9.15e-13 (3 of 3) | Pass: mtf.maxAbs 1.19e-11 (3 of 3) | Pass: mtf.maxAbs 1.18e-11 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | Pass: mtf.maxAbs 2.60e-12 (3 of 3) | Pass: mtf.maxAbs 9.87e-12 (3 of 3) | Pass: mtf.maxAbs 1.00e-11 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 7.13e-13 (3 of 3) | Pass: mtf.maxAbs 3.52e-12 (3 of 3) | Pass: mtf.maxAbs 3.84e-12 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | Pass: mtf.maxAbs 7.40e-13 (3 of 3) | Pass: mtf.maxAbs 7.81e-12 (3 of 3) | Pass: mtf.maxAbs 7.90e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-wide | 3 | Pass: mtf.maxAbs 5.96e-13 (3 of 3) | Pass: mtf.maxAbs 6.54e-12 (3 of 3) | Pass: mtf.maxAbs 6.46e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 7.67e-13 (3 of 3) | Pass: mtf.maxAbs 3.25e-12 (3 of 3) | Pass: mtf.maxAbs 3.34e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-tele | 3 | Pass: mtf.maxAbs 3.13e-13 (3 of 3) | Pass: mtf.maxAbs 6.62e-12 (3 of 3) | Pass: mtf.maxAbs 6.57e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | Pass: mtf.maxAbs 7.11e-13 (3 of 3) | Pass: mtf.maxAbs 4.06e-12 (3 of 3) | Pass: mtf.maxAbs 4.06e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 8.47e-13 (3 of 3) | Pass: mtf.maxAbs 2.55e-12 (3 of 3) | Pass: mtf.maxAbs 2.53e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | Pass: mtf.maxAbs 5.49e-13 (3 of 3) | Pass: mtf.maxAbs 8.72e-12 (3 of 3) | Pass: mtf.maxAbs 8.51e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | Pass: mtf.maxAbs 5.47e-13 (3 of 3) | Pass: mtf.maxAbs 1.18e-11 (3 of 3) | Pass: mtf.maxAbs 1.15e-11 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | Pass: mtf.maxAbs 1.04e-12 (3 of 3) | Pass: mtf.maxAbs 4.90e-12 (3 of 3) | Pass: mtf.maxAbs 5.85e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | Pass: mtf.maxAbs 7.95e-13 (3 of 3) | Pass: mtf.maxAbs 9.12e-12 (3 of 3) | Pass: mtf.maxAbs 8.33e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | Pass: mtf.maxAbs 6.94e-13 (3 of 3) | Pass: mtf.maxAbs 4.23e-12 (3 of 3) | Pass: mtf.maxAbs 4.27e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | Pass: mtf.maxAbs 9.43e-13 (3 of 3) | Pass: mtf.maxAbs 2.72e-12 (3 of 3) | Pass: mtf.maxAbs 2.28e-12 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | Pass: mtf.maxAbs 4.88e-13 (3 of 3) | Pass: mtf.maxAbs 2.50e-12 (3 of 3) | Pass: mtf.maxAbs 2.43e-12 (3 of 3) |

## LensVisualizer's MTF sampling, replayed — `lv-mtf-replay`

Compares: LensVisualizer's geometric MTF beside a replay of its own sampling. Kind: held to a limit. Quantity asked of the engines: an engine's own MTF (`mtf.native`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – replay-of-lv-mtf | Largest difference of an MTF value — `mtf.maxAbs` | (no unit) | ≤ 1.00e-9 | 1.23e-14 | 128 of 128 | nikon-z-24-70f4s-f5.6-ref-zoom0.5 | cut sagittal, field 1 of the image height, frequencyPerMm 14 |
| lv – replay-of-lv-mtf | Sampling grids, ray counts and ray outcomes that differ — `sampling.mismatches` | elements | ≤ 0 | 0 | 128 of 128 | — | — |
| lv – replay-of-lv-mtf | Fields whose outcome differs — `fields.mismatches` | elements | ≤ 0 | 0 | 128 of 128 | — | — |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – replay-of-lv-mtf |
|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 1 | Pass: mtf.maxAbs 3.22e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-photopic | 1 | Pass: mtf.maxAbs 1.22e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 1 | Pass: mtf.maxAbs 3.11e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-ref | 1 | Pass: mtf.maxAbs 3.33e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-photopic | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-best-ref | 1 | Pass: mtf.maxAbs 3.66e-15 (1 of 1) |
| canon-ef-135-f2l-usm-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.67e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 1 | Pass: mtf.maxAbs 5.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 1 | Pass: mtf.maxAbs 2.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 1 | Pass: mtf.maxAbs 5.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 1 | Pass: mtf.maxAbs 4.66e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 1 | Pass: mtf.maxAbs 2.00e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 1 | Pass: mtf.maxAbs 3.55e-15 (1 of 1) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 1 | Pass: mtf.maxAbs 5.44e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 1 | Pass: mtf.maxAbs 4.33e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 1.67e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 1 | Pass: mtf.maxAbs 2.89e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1 | Pass: mtf.maxAbs 4.44e-15 (1 of 1) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikkor-z50f12-f5.6-ref | 1 | Pass: mtf.maxAbs 3.44e-15 (1 of 1) |
| nikkor-z50f12-f5.6-photopic | 1 | Pass: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikkor-z50f12-f5.6-best-ref | 1 | Pass: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikkor-z50f12-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikkor-z50f12-f11-ref | 1 | Pass: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikkor-z50f12-f11-photopic | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikkor-z50f12-f11-best-ref | 1 | Pass: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikkor-z50f12-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-ref | 1 | Pass: mtf.maxAbs 5.11e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-photopic | 1 | Pass: mtf.maxAbs 2.33e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 1 | Pass: mtf.maxAbs 5.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 3.22e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-ref | 1 | Pass: mtf.maxAbs 4.44e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-photopic | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-best-ref | 1 | Pass: mtf.maxAbs 6.22e-15 (1 of 1) |
| sony-fe-20mm-f18-g-f11-best-photopic | 1 | Pass: mtf.maxAbs 2.22e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 1 | Pass: mtf.maxAbs 5.11e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 1 | Pass: mtf.maxAbs 1.67e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 1 | Pass: mtf.maxAbs 4.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 2.00e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1 | Pass: mtf.maxAbs 3.22e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 1 | Pass: mtf.maxAbs 3.55e-15 (1 of 1) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 1 | Pass: mtf.maxAbs 2.00e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 1 | Pass: mtf.maxAbs 5.77e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 1 | Pass: mtf.maxAbs 5.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 2.78e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 1 | Pass: mtf.maxAbs 3.66e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 1 | Pass: mtf.maxAbs 3.89e-15 (1 of 1) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 1 | Pass: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-wide | 1 | Pass: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 1.23e-14 (1 of 1) |
| nikon-z-24-70f4s-f5.6-ref-tele | 1 | Pass: mtf.maxAbs 6.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 4.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 1 | Pass: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 1 | Pass: mtf.maxAbs 4.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 8.99e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 1 | Pass: mtf.maxAbs 7.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 1 | Pass: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 5.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 1 | Pass: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-wide | 1 | Pass: mtf.maxAbs 5.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-ref-tele | 1 | Pass: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-wide | 1 | Pass: mtf.maxAbs 2.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-photopic-tele | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-wide | 1 | Pass: mtf.maxAbs 4.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-ref-tele | 1 | Pass: mtf.maxAbs 4.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 1 | Pass: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-ref | 1 | Pass: mtf.maxAbs 4.88e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-photopic | 1 | Pass: mtf.maxAbs 2.22e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-best-ref | 1 | Pass: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-mc-105f28-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-ref | 1 | Pass: mtf.maxAbs 3.66e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-photopic | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-best-ref | 1 | Pass: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-mc-105f28-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-ref | 1 | Pass: mtf.maxAbs 3.11e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-best-ref | 1 | Pass: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-135f18-plena-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-ref | 1 | Pass: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-photopic | 1 | Pass: mtf.maxAbs 1.89e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-best-ref | 1 | Pass: mtf.maxAbs 3.77e-15 (1 of 1) |
| nikon-z-135f18-plena-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 1 | Pass: mtf.maxAbs 4.00e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 1 | Pass: mtf.maxAbs 1.78e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 1 | Pass: mtf.maxAbs 4.11e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 1 | Pass: mtf.maxAbs 2.33e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 1 | Pass: mtf.maxAbs 3.89e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 1 | Pass: mtf.maxAbs 1.33e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 1 | Pass: mtf.maxAbs 3.44e-15 (1 of 1) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-wide | 1 | Pass: mtf.maxAbs 6.55e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 6.33e-15 (1 of 1) |
| nikon-z-24-70f4s-open-ref-tele | 1 | Pass: mtf.maxAbs 5.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-wide | 1 | Pass: mtf.maxAbs 3.33e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-24-70f4s-open-photopic-tele | 1 | Pass: mtf.maxAbs 2.66e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-wide | 1 | Pass: mtf.maxAbs 6.00e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 9.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-ref-tele | 1 | Pass: mtf.maxAbs 5.33e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-wide | 1 | Pass: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 3.22e-15 (1 of 1) |
| nikon-z-24-70f4s-open-best-photopic-tele | 1 | Pass: mtf.maxAbs 2.33e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-wide | 1 | Pass: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 5.77e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-ref-tele | 1 | Pass: mtf.maxAbs 2.89e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-wide | 1 | Pass: mtf.maxAbs 1.55e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-photopic-tele | 1 | Pass: mtf.maxAbs 1.67e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-wide | 1 | Pass: mtf.maxAbs 4.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 1 | Pass: mtf.maxAbs 4.22e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-ref-tele | 1 | Pass: mtf.maxAbs 3.00e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 1 | Pass: mtf.maxAbs 2.11e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 1 | Pass: mtf.maxAbs 2.44e-15 (1 of 1) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 1 | Pass: mtf.maxAbs 2.22e-15 (1 of 1) |

## Wave MTF of the same rays — `wave-mtf`

Compares: This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled. Kind: held to a limit. Quantity asked of the engines: ray trace (`rays.trace`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – optiland | Largest difference of a wave MTF value, on the finest lattice — `waveMtf.maxAbs` | (no unit) | ≤ 2.00e-8 | 2.63e-10 | 369 of 384 | nikkor-z50f12-f5.6-photopic | cut sagittal, field 1.19e1 deg, frequencyPerMm 100 |
| lv – optiland | Largest phase step between neighbouring cells of the lattice that carry light — `phaseStep.waves` | waves | — | 4.07e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1 deg, line 7, ray 2368 |
| lv – optiland | Largest move of a wave MTF value from the coarser lattice to the finer — `convergence.maxAbs` | (no unit) | — | 1.68e-2 | 384 of 384 | nikon-z-24-70f4s-open-ref-tele | cut sagittal, field 1.66e1 deg, frequencyPerMm 70 |
| lv – optiland | Cells across the finest lattice — `lattice.columns` | cells | — | 64 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-ref | — |
| lv – optiland | Rays both engines traced through — `rays.compared` | rays | — | 7687932 | 384 of 384 | — | — |
| lv – optiland | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 384 of 384 | — | — |
| lv – optiland | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – optiland | Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged) — `waveMtf.flagged` | (no unit) | — | 1.16e-10 | 15 of 384 | nikon-z-24-70f4s-open-photopic-wide | cut tangential, field 4.33e1 deg, frequencyPerMm 10 |
| lv – reference-tracer | Largest difference of a wave MTF value, on the finest lattice — `waveMtf.maxAbs` | (no unit) | ≤ 2.00e-8 | 1.08e-9 | 369 of 384 | nikon-z-24-70f4s-f5.6-best-ref-wide | cut tangential, field 4.33e1 deg, frequencyPerMm 50 |
| lv – reference-tracer | Largest phase step between neighbouring cells of the lattice that carry light — `phaseStep.waves` | waves | — | 4.07e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1 deg, line 7, ray 2368 |
| lv – reference-tracer | Largest move of a wave MTF value from the coarser lattice to the finer — `convergence.maxAbs` | (no unit) | — | 1.68e-2 | 384 of 384 | nikon-z-24-70f4s-open-ref-tele | cut sagittal, field 1.66e1 deg, frequencyPerMm 70 |
| lv – reference-tracer | Cells across the finest lattice — `lattice.columns` | cells | — | 64 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-ref | — |
| lv – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 7687932 | 384 of 384 | — | — |
| lv – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 384 of 384 | — | — |
| lv – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| lv – reference-tracer | Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged) — `waveMtf.flagged` | (no unit) | — | 1.17e-9 | 15 of 384 | nikon-z-24-70f4s-open-best-ref-wide | cut tangential, field 4.33e1 deg, frequencyPerMm 50 |
| optiland – reference-tracer | Largest difference of a wave MTF value, on the finest lattice — `waveMtf.maxAbs` | (no unit) | ≤ 2.00e-8 | 1.05e-9 | 369 of 384 | nikon-z-24-70f4s-f5.6-best-ref-wide | cut tangential, field 4.33e1 deg, frequencyPerMm 50 |
| optiland – reference-tracer | Largest phase step between neighbouring cells of the lattice that carry light — `phaseStep.waves` | waves | — | 4.07e-1 | 384 of 384 | nikon-z-24-70f4s-open-photopic-tele | field 1.66e1 deg, line 7, ray 2368 |
| optiland – reference-tracer | Largest move of a wave MTF value from the coarser lattice to the finer — `convergence.maxAbs` | (no unit) | — | 1.68e-2 | 384 of 384 | nikon-z-24-70f4s-open-ref-tele | cut sagittal, field 1.66e1 deg, frequencyPerMm 70 |
| optiland – reference-tracer | Cells across the finest lattice — `lattice.columns` | cells | — | 64 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-ref | — |
| optiland – reference-tracer | Rays both engines traced through — `rays.compared` | rays | — | 7687932 | 384 of 384 | — | — |
| optiland – reference-tracer | Rays only one engine traced through, left out of both sums — `rays.dropped` | rays | — | 0 | 384 of 384 | — | — |
| optiland – reference-tracer | Wavelengths compared — `lines.compared` | wavelengths | — | 9 | 384 of 384 | canon-ef-135-f2l-usm-f5.6-photopic | — |
| optiland – reference-tracer | Largest difference of a wave MTF value, in fields whose sampling did not settle (shown, not judged) — `waveMtf.flagged` | (no unit) | — | 1.16e-9 | 15 of 384 | nikon-z-24-70f4s-open-best-ref-wide | cut tangential, field 4.33e1 deg, frequencyPerMm 50 |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – reference-tracer | optiland – reference-tracer |
|---|---|---|---|---|
| canon-ef-135-f2l-usm-f5.6-ref | 3 | Pass: waveMtf.maxAbs 1.71e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.24e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.73e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 8.46e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.72e-12 (3 of 3) | Pass: waveMtf.maxAbs 8.87e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 1.75e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.40e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.43e-11 (3 of 3) |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 4.34e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.24e-12 (3 of 3) | Pass: waveMtf.maxAbs 8.79e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-ref | 3 | Pass: waveMtf.maxAbs 6.58e-12 (3 of 3) | Pass: waveMtf.maxAbs 3.62e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.64e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-photopic | 3 | Pass: waveMtf.maxAbs 4.85e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.42e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.10e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-ref | 3 | Pass: waveMtf.maxAbs 8.77e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.91e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.34e-12 (3 of 3) |
| canon-ef-135-f2l-usm-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 3.42e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.63e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.33e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 3 | Pass: waveMtf.maxAbs 8.10e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.06e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.28e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 5.89e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.46e-12 (3 of 3) | Pass: waveMtf.maxAbs 7.37e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 8.27e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.29e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.84e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 4.89e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.59e-12 (3 of 3) | Pass: waveMtf.maxAbs 5.95e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 3 | Pass: waveMtf.maxAbs 6.61e-12 (3 of 3) | Pass: waveMtf.maxAbs 5.86e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.95e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 3 | Pass: waveMtf.maxAbs 2.68e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.14e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.83e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 3 | Pass: waveMtf.maxAbs 5.92e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.89e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.79e-12 (3 of 3) |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 2.76e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.08e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.67e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 3 | Pass: waveMtf.maxAbs 8.40e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.30e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.38e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 1.32e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.11e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.13e-10 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 9.30e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.09e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.86e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 1.10e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.73e-11 (3 of 3) | Pass: waveMtf.maxAbs 6.55e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 3 | Pass: waveMtf.maxAbs 3.83e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.53e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.44e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | 3 | Pass: waveMtf.maxAbs 3.68e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.02e-12 (3 of 3) | Pass: waveMtf.maxAbs 9.99e-12 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 3 | Pass: waveMtf.maxAbs 4.16e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.76e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.56e-11 (3 of 3) |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 3.28e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.57e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.60e-11 (3 of 3) |
| nikkor-z50f12-f5.6-ref | 3 | Pass: waveMtf.maxAbs 2.11e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.55e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.27e-10 (3 of 3) |
| nikkor-z50f12-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 2.63e-10 (3 of 3) | Pass: waveMtf.maxAbs 3.41e-10 (3 of 3) | Pass: waveMtf.maxAbs 3.19e-10 (3 of 3) |
| nikkor-z50f12-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 2.02e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.46e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.17e-10 (3 of 3) |
| nikkor-z50f12-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 2.03e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.83e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.63e-10 (3 of 3) |
| nikkor-z50f12-f11-ref | 3 | Pass: waveMtf.maxAbs 1.20e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.27e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.86e-12 (3 of 3) |
| nikkor-z50f12-f11-photopic | 3 | Pass: waveMtf.maxAbs 3.52e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.23e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.42e-12 (3 of 3) |
| nikkor-z50f12-f11-best-ref | 3 | Pass: waveMtf.maxAbs 1.16e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.32e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.40e-12 (3 of 3) |
| nikkor-z50f12-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 1.40e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.83e-12 (3 of 3) | Pass: waveMtf.maxAbs 7.23e-12 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-ref | 3 | Pass: waveMtf.maxAbs 3.36e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.04e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.07e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 1.58e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.82e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.78e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 2.78e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.10e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.01e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 1.68e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.80e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.73e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-ref | 3 | Pass: waveMtf.maxAbs 1.45e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.72e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.70e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-photopic | 3 | Pass: waveMtf.maxAbs 4.18e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.84e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.85e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-ref | 3 | Pass: waveMtf.maxAbs 1.12e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.69e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.71e-10 (3 of 3) |
| sony-fe-20mm-f18-g-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 5.50e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.79e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.78e-10 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | 3 | Pass: waveMtf.maxAbs 4.67e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.92e-11 (3 of 3) | Pass: waveMtf.maxAbs 6.62e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 2.76e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.13e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.30e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 1.63e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.02e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.14e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 1.37e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.08e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.19e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-ref | 3 | Pass: waveMtf.maxAbs 2.13e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.99e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.79e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-photopic | 3 | Pass: waveMtf.maxAbs 9.05e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.63e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.20e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | 3 | Pass: waveMtf.maxAbs 9.73e-12 (3 of 3) | Pass: waveMtf.maxAbs 6.27e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.45e-11 (3 of 3) |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 4.96e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.21e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.12e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 3 | Pass: waveMtf.maxAbs 4.22e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.70e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.46e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 1.44e-11 (3 of 3) | Pass: waveMtf.maxAbs 6.13e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.83e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 4.24e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.22e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.20e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 9.30e-12 (3 of 3) | Pass: waveMtf.maxAbs 6.00e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.20e-11 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 3 | Pass: waveMtf.maxAbs 8.42e-12 (3 of 3) | Pass: waveMtf.maxAbs 8.90e-12 (3 of 3) | Pass: waveMtf.maxAbs 5.25e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 3 | Pass: waveMtf.maxAbs 4.35e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.41e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.26e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 3 | Pass: waveMtf.maxAbs 1.19e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.40e-12 (3 of 3) | Pass: waveMtf.maxAbs 5.68e-12 (3 of 3) |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 4.26e-12 (3 of 3) | Pass: waveMtf.maxAbs 3.03e-12 (3 of 3) | Pass: waveMtf.maxAbs 5.23e-12 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-wide | 3 | Pass: waveMtf.maxAbs 5.40e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.82e-10 (3 of 3) | Pass: waveMtf.maxAbs 9.34e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 2.48e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.53e-10 (3 of 3) | Pass: waveMtf.maxAbs 4.55e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-ref-tele | 3 | Pass: waveMtf.maxAbs 2.77e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.90e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.91e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-wide | 3 | Pass: waveMtf.maxAbs 6.40e-11 (3 of 3) | Pass: waveMtf.maxAbs 5.21e-10 (3 of 3) | Pass: waveMtf.maxAbs 5.21e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 7.31e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.00e-10 (3 of 3) | Pass: waveMtf.maxAbs 4.00e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-photopic-tele | 3 | Pass: waveMtf.maxAbs 7.23e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.87e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.81e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 3 | Pass: waveMtf.maxAbs 4.80e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.08e-9 (3 of 3) | Pass: waveMtf.maxAbs 1.05e-9 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 1.77e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.12e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.05e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 3 | Pass: waveMtf.maxAbs 2.51e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.66e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.61e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | 3 | Pass: waveMtf.maxAbs 6.30e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.73e-10 (3 of 3) | Pass: waveMtf.maxAbs 3.46e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 8.58e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.92e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.91e-10 (3 of 3) |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | 3 | Pass: waveMtf.maxAbs 9.83e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.53e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.59e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-wide | 3 | Pass: waveMtf.maxAbs 2.41e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.22e-10 (3 of 3) | Pass: waveMtf.maxAbs 3.16e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 8.49e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.34e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.28e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-ref-tele | 3 | Pass: waveMtf.maxAbs 1.03e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.13e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.25e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-wide | 3 | Pass: waveMtf.maxAbs 8.42e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.61e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.61e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 4.72e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.40e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.37e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-photopic-tele | 3 | Pass: waveMtf.maxAbs 6.01e-12 (3 of 3) | Pass: waveMtf.maxAbs 7.28e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.57e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-wide | 3 | Pass: waveMtf.maxAbs 1.95e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.74e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.69e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 7.97e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.57e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.57e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-ref-tele | 3 | Pass: waveMtf.maxAbs 1.06e-11 (3 of 3) | Pass: waveMtf.maxAbs 7.83e-11 (3 of 3) | Pass: waveMtf.maxAbs 6.73e-11 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-wide | 3 | Pass: waveMtf.maxAbs 7.87e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.32e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.33e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 5.13e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.34e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.33e-10 (3 of 3) |
| nikon-z-24-70f4s-f11-best-photopic-tele | 3 | Pass: waveMtf.maxAbs 6.24e-12 (3 of 3) | Pass: waveMtf.maxAbs 8.78e-11 (3 of 3) | Pass: waveMtf.maxAbs 8.90e-11 (3 of 3) |
| nikon-z-mc-105f28-f5.6-ref | 3 | Pass: waveMtf.maxAbs 1.66e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.00e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.97e-10 (3 of 3) |
| nikon-z-mc-105f28-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 1.04e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.03e-10 (3 of 3) | Pass: waveMtf.maxAbs 3.06e-10 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 1.67e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.71e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.63e-11 (3 of 3) |
| nikon-z-mc-105f28-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 1.22e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.20e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.25e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-ref | 3 | Pass: waveMtf.maxAbs 7.99e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.57e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.56e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-photopic | 3 | Pass: waveMtf.maxAbs 9.19e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.08e-12 (3 of 3) | Pass: waveMtf.maxAbs 7.90e-12 (3 of 3) |
| nikon-z-mc-105f28-f11-best-ref | 3 | Pass: waveMtf.maxAbs 1.13e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.55e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.45e-11 (3 of 3) |
| nikon-z-mc-105f28-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 9.76e-12 (3 of 3) | Pass: waveMtf.maxAbs 3.48e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.01e-11 (3 of 3) |
| nikon-z-135f18-plena-f5.6-ref | 3 | Pass: waveMtf.maxAbs 1.39e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.78e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.90e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 6.96e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.97e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.94e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 1.64e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.83e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.02e-10 (3 of 3) |
| nikon-z-135f18-plena-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 7.38e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.04e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.03e-10 (3 of 3) |
| nikon-z-135f18-plena-f11-ref | 3 | Pass: waveMtf.maxAbs 4.13e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.56e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.62e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-photopic | 3 | Pass: waveMtf.maxAbs 1.14e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.87e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.87e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-best-ref | 3 | Pass: waveMtf.maxAbs 4.01e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.72e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.56e-11 (3 of 3) |
| nikon-z-135f18-plena-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 9.86e-12 (3 of 3) | Pass: waveMtf.maxAbs 4.80e-11 (3 of 3) | Pass: waveMtf.maxAbs 4.79e-11 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 3 | Pass: waveMtf.maxAbs 1.56e-10 (3 of 3) | Pass: waveMtf.maxAbs 8.48e-10 (3 of 3) | Pass: waveMtf.maxAbs 8.49e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 3 | Pass: waveMtf.maxAbs 1.05e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.97e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.95e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 3 | Pass: waveMtf.maxAbs 1.70e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.35e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.36e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 3 | Pass: waveMtf.maxAbs 1.33e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.71e-10 (3 of 3) | Pass: waveMtf.maxAbs 7.70e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | 3 | Pass: waveMtf.maxAbs 5.94e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.41e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.47e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 3 | Pass: waveMtf.maxAbs 1.97e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.01e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.00e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | 3 | Pass: waveMtf.maxAbs 7.34e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.54e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.61e-10 (3 of 3) |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 3 | Pass: waveMtf.maxAbs 2.83e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.06e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.08e-10 (3 of 3) |
| nikon-z-24-70f4s-open-ref-wide | 3 | Pass: waveMtf.maxAbs 1.89e-11 (1 of 3) | Pass: waveMtf.maxAbs 4.25e-10 (1 of 3) | Pass: waveMtf.maxAbs 4.10e-10 (1 of 3) |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 1.49e-11 (2 of 3) | Pass: waveMtf.maxAbs 3.30e-10 (2 of 3) | Pass: waveMtf.maxAbs 3.39e-10 (2 of 3) |
| nikon-z-24-70f4s-open-ref-tele | 3 | Pass: waveMtf.maxAbs 1.44e-11 (2 of 3) | Pass: waveMtf.maxAbs 2.12e-10 (2 of 3) | Pass: waveMtf.maxAbs 2.14e-10 (2 of 3) |
| nikon-z-24-70f4s-open-photopic-wide | 3 | Pass: waveMtf.maxAbs 6.94e-12 (1 of 3) | Pass: waveMtf.maxAbs 1.29e-10 (1 of 3) | Pass: waveMtf.maxAbs 1.23e-10 (1 of 3) |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 7.33e-12 (1 of 3) | Pass: waveMtf.maxAbs 1.26e-10 (1 of 3) | Pass: waveMtf.maxAbs 1.22e-10 (1 of 3) |
| nikon-z-24-70f4s-open-photopic-tele | 3 | Pass: waveMtf.maxAbs 1.45e-11 (1 of 3) | Pass: waveMtf.maxAbs 2.56e-10 (1 of 3) | Pass: waveMtf.maxAbs 2.45e-10 (1 of 3) |
| nikon-z-24-70f4s-open-best-ref-wide | 3 | Pass: waveMtf.maxAbs 2.64e-11 (2 of 3) | Pass: waveMtf.maxAbs 6.01e-10 (2 of 3) | Pass: waveMtf.maxAbs 5.92e-10 (2 of 3) |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 1.62e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.67e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.67e-10 (3 of 3) |
| nikon-z-24-70f4s-open-best-ref-tele | 3 | Pass: waveMtf.maxAbs 8.19e-12 (2 of 3) | Pass: waveMtf.maxAbs 6.06e-11 (2 of 3) | Pass: waveMtf.maxAbs 6.73e-11 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-wide | 3 | Pass: waveMtf.maxAbs 1.09e-10 (3 of 3) | Pass: waveMtf.maxAbs 4.13e-10 (3 of 3) | Pass: waveMtf.maxAbs 4.37e-10 (3 of 3) |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 1.80e-11 (2 of 3) | Pass: waveMtf.maxAbs 1.54e-10 (2 of 3) | Pass: waveMtf.maxAbs 1.40e-10 (2 of 3) |
| nikon-z-24-70f4s-open-best-photopic-tele | 3 | Pass: waveMtf.maxAbs 5.83e-12 (1 of 3) | Pass: waveMtf.maxAbs 1.22e-10 (1 of 3) | Pass: waveMtf.maxAbs 1.17e-10 (1 of 3) |
| nikon-z-24-70f4s-f8-ref-wide | 3 | Pass: waveMtf.maxAbs 3.86e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.02e-9 (3 of 3) | Pass: waveMtf.maxAbs 1.03e-9 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 1.03e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.89e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.85e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-ref-tele | 3 | Pass: waveMtf.maxAbs 1.59e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.31e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.37e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-wide | 3 | Pass: waveMtf.maxAbs 1.10e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.99e-10 (3 of 3) | Pass: waveMtf.maxAbs 4.03e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 8.23e-12 (3 of 3) | Pass: waveMtf.maxAbs 2.23e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.19e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-photopic-tele | 3 | Pass: waveMtf.maxAbs 8.95e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.38e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.39e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-wide | 3 | Pass: waveMtf.maxAbs 4.11e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.41e-10 (3 of 3) | Pass: waveMtf.maxAbs 9.47e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | 3 | Pass: waveMtf.maxAbs 1.07e-11 (3 of 3) | Pass: waveMtf.maxAbs 2.17e-10 (3 of 3) | Pass: waveMtf.maxAbs 2.13e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-ref-tele | 3 | Pass: waveMtf.maxAbs 1.46e-11 (3 of 3) | Pass: waveMtf.maxAbs 9.93e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.03e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-wide | 3 | Pass: waveMtf.maxAbs 1.00e-11 (3 of 3) | Pass: waveMtf.maxAbs 3.46e-10 (3 of 3) | Pass: waveMtf.maxAbs 3.50e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | 3 | Pass: waveMtf.maxAbs 7.12e-12 (3 of 3) | Pass: waveMtf.maxAbs 1.68e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.64e-10 (3 of 3) |
| nikon-z-24-70f4s-f8-best-photopic-tele | 3 | Pass: waveMtf.maxAbs 1.08e-11 (3 of 3) | Pass: waveMtf.maxAbs 1.11e-10 (3 of 3) | Pass: waveMtf.maxAbs 1.16e-10 (3 of 3) |

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
| `-best` | focused on LensVisualizer's best axial focus for that stop and those wavelengths, in place of the lens's design image plane |
| `-f<N>` | at f/N, the stop LensVisualizer's own rule gives that f-number |
| `-wide, -tele` | a zoom lens at the short or the long end of its zoom range |
| `-zoom<T>` | a zoom lens at a zoom position LensVisualizer publishes: T runs from 0 at the short end of the range to 1 at the long end |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | 5485e0da47df4eacfeda987196b4a38dc66e5997d129600c55b0c76692b99f29 |
| Baseline file | 52f727c6596d0cf95922ee4e0201a8cf5a715c90fa12a03bea28f3a1bcb4b4bf |
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
| canon-ef-135-f2l-usm-f5.6-ref | fb6313aafaef4cc6341c86d507a91837b5deab4417ccdeb699274d5ec65de76f |
| canon-ef-135-f2l-usm-f5.6-photopic | 0bb244ad3b91ebc1fcc8832ac3ff03c078403191a944eabb6d10f461477df3d1 |
| canon-ef-135-f2l-usm-f5.6-best-ref | cfb40db60c1920a71df2e3577d416c7c11811ad983785f4a3d7c2d4f2ed45d2b |
| canon-ef-135-f2l-usm-f5.6-best-photopic | 6f6a675260eaedb832bcd186ebc30233a62418137d8c7a022507cfb1c2f2f769 |
| canon-ef-135-f2l-usm-f11-ref | 3538c790a1ec7344597b37548aec69a2df46fcb828795c1bd678079a9ad78dc3 |
| canon-ef-135-f2l-usm-f11-photopic | b359219bb1416175a36043e267ed01226e18656fd692086a7bceff9700f917a5 |
| canon-ef-135-f2l-usm-f11-best-ref | fde75efe0d80ad2af8615df46ff798a3e3bf044409d58bf1a3e6271068eb31a3 |
| canon-ef-135-f2l-usm-f11-best-photopic | dd93d62ab085fac35f27ed48e997e93820bc52a1d53a87365835edaf5f003bce |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-ref | 11fe04d53f56df0f4217bea7f1df0135e80ac3aa14b3ec6a13c163756b00c748 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-photopic | 527c4ba128c41cae2c4c564a71b48eaf20e50c257ba0d39b308978129d8e8766 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-ref | fb61b013bd83b38b13284163754deed2b37a7d26ad84ca1fcc3db9ef49b1e0c4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f5.6-best-photopic | 3db636c9403c6cd8b18d681856ddfaf0b7876d1fa113477592e1b33611911480 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-ref | 7c3073c4e7dbedf0705593abf810e4d84fd34d97d7903728a421926d55fa4dc4 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-photopic | 2a721f0fb1532b9d5ffd33fc93a62c16dce316fd6158db9976215f6e1e0dc8b0 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-ref | 8cec235dbb1353ecce18595c4106e7ca14174f1935bfc6ac081648abec9e23c8 |
| fujifilm-fujinon-gf-63mm-f28-r-wr-f11-best-photopic | bd9145a0004d2ce2bd9a18e00f62f853263438016b3ed71d7cd8d67d43fdb5d2 |
| sigma-35mm-f14-dg-hsm-a-f5.6-ref | 63c31b9a55e5f68d962ae0d5a47e737b4d5df1301a900eb50af363001d160a75 |
| sigma-35mm-f14-dg-hsm-a-f5.6-photopic | c0b2ed818ce7b917f1f78d4687f40197b16b4179c60fe5f9af41e4f78ec3a473 |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-ref | 049584b5191a4fd43509da6d422906e44e14697e68119403dd03ccb064f8b1cb |
| sigma-35mm-f14-dg-hsm-a-f5.6-best-photopic | 141995a92146307173e9b585842fa7fff2746eeeb285335bfc035c9efba5a576 |
| sigma-35mm-f14-dg-hsm-a-f11-ref | 02b1e001699f7823e93b41eef21cfbf7c3a7090a93803ba41f9b46d97b1b68b2 |
| sigma-35mm-f14-dg-hsm-a-f11-photopic | c1d3b6b6b7d1cb58e51a7b709b2aeb9f9f1018a777a5506e8d92f7f305bb8f6c |
| sigma-35mm-f14-dg-hsm-a-f11-best-ref | 1409655514e43351da977a690ec1a2a38ed6ea92bb6e65758dbabe5775a6f5d7 |
| sigma-35mm-f14-dg-hsm-a-f11-best-photopic | f35e1467099875249f65562c5ed70bb947478465455ff5f61f83489e2010e004 |
| nikkor-z50f12-f5.6-ref | 93370aead6b9eb8def155ccf5f3a8780f977a3fda62560f1c44406cf3a1d7ceb |
| nikkor-z50f12-f5.6-photopic | 57df07f9ba1f3a042ee7e6fa6be30fc29de381148b021881249dbd60a47b8ebd |
| nikkor-z50f12-f5.6-best-ref | 40adc9d9360db7791e21a3b20e8c0c833654c32f19427a958dd20aced28d9ebf |
| nikkor-z50f12-f5.6-best-photopic | 5cda22433713055d2b77d6b86285cdd3d09f2f2e56abb9afb53b32c6d3ac51ab |
| nikkor-z50f12-f11-ref | 1a34a84b12ddaa766ccc173f659f2b44483089c9560aed71cf85aad1528b9335 |
| nikkor-z50f12-f11-photopic | 728b764ddf0eb1965a740c412d8a5ba04a7e9afedf9d5b3da418fa0395279529 |
| nikkor-z50f12-f11-best-ref | e230a19defd0b95cada536016457031dac54e94566818a5c97cb2e8295bc18ac |
| nikkor-z50f12-f11-best-photopic | 9409e03e1d8bb38c55d22e4b8e2db3580fba792241a42761745caa1b1ca20816 |
| sony-fe-20mm-f18-g-f5.6-ref | 032904853c0718dd4654541b6a26e293c3d584c9cc75b880e3327126e0f62550 |
| sony-fe-20mm-f18-g-f5.6-photopic | 7ffad7e07b4ab08be425b0f506835465f1b401e006cf3f60cc4a462eacb8a17e |
| sony-fe-20mm-f18-g-f5.6-best-ref | 6a018b55d80117d42be3a4b4cd945b3c0930f9544519c314aaed262281e346a2 |
| sony-fe-20mm-f18-g-f5.6-best-photopic | 7402bb519a0b3c238c15b9883b7986762130247590b55437c6f64ce3a86a7630 |
| sony-fe-20mm-f18-g-f11-ref | 66629bfed7b0cb8ab55ac7d50e6363ebefaa1922a52a3915db2e38f86de2b5be |
| sony-fe-20mm-f18-g-f11-photopic | da5535831a1823aeb9676680c2ea18d9571477d8a44cef460ac0ce541691ed0a |
| sony-fe-20mm-f18-g-f11-best-ref | 14626b8ab553320b14dfa90cf59ba2bd7b6b433033a0db1169424e5e61cea556 |
| sony-fe-20mm-f18-g-f11-best-photopic | ebd85cee697d657cdd866e95c41833268d97db7cec0e76ccc07d3c9f73784496 |
| sony-fe-400mm-f28-gm-oss-f5.6-ref | cfd2f4b05ff511406ee2fcf6445bb368a1e65da0aef98100ce96e52afd7ee8cc |
| sony-fe-400mm-f28-gm-oss-f5.6-photopic | 90e47ed96ae48b31a549611cfa8d20f8cba6e6a256fc2177231bdb56d89e02ae |
| sony-fe-400mm-f28-gm-oss-f5.6-best-ref | 7978e8b6317cb261a60c5258a804dc0819ed21ec238ced93389bbed06f7820c1 |
| sony-fe-400mm-f28-gm-oss-f5.6-best-photopic | f0b2fce6bdc5cfb52e92925ea7e26fea510ba8896ce41b523670055347ea72b6 |
| sony-fe-400mm-f28-gm-oss-f11-ref | 1a94040d1d518dd6202eb3867b88ddfc677b2127c68f0e0c14e80f86628c70d7 |
| sony-fe-400mm-f28-gm-oss-f11-photopic | e39d025209a0474bbbfcfa56b371f03857285eeaf1bb7aac2c795a327dd16267 |
| sony-fe-400mm-f28-gm-oss-f11-best-ref | e8134f174ecafd2430ad50cfb2ba0d0166b13d1551f90aa9d8ac0ffddbb9a459 |
| sony-fe-400mm-f28-gm-oss-f11-best-photopic | 6e35d1af49b71d869f74f02f4cc85dfb0559cdf3b3ca0f1e7035267465090e09 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-ref | 83bc7aa668f82b6b22a13b1acc5b0f5af9ce2968947f11528dea3c0fbeef39e9 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-photopic | 06ea3987a51a1f4fb802733e5da21eabe412cbaea93831e7a7f156e7f4ca12c9 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-ref | ace750e815937160ee6fb3ca0e4eb1171b25e239d6417acbed4fe523a22999d2 |
| sigma-105mm-f28-dg-dn-macro-art-f5.6-best-photopic | ea8f3c035915125e5bc1fb703a3fb652d17204f3124b91e6ff45f0eb424938d9 |
| sigma-105mm-f28-dg-dn-macro-art-f11-ref | 849578276ae0917f9e2215c51c30145952bb7126cce058be7687a974b9a8dd4a |
| sigma-105mm-f28-dg-dn-macro-art-f11-photopic | 527fa6221c4f06288b21f4dd259313adea27de6c14cbb43703d3571412cf967b |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-ref | 8216f33f93629b810fa907bef02c40e5bcd420baec4ce1d6c8a81dd3bb7cffd6 |
| sigma-105mm-f28-dg-dn-macro-art-f11-best-photopic | 71f5b1c10ac609ada5b900504422eb1e96f85f025a966a8454bde43267080c56 |
| nikon-z-24-70f4s-f5.6-ref-wide | ca4650a2f1cab8126617b31e5e196328c9e6047662925528c44d866fe77ec229 |
| nikon-z-24-70f4s-f5.6-ref-zoom0.5 | d6dd88710ac133d194348fdebe5810d09477eb6d54d7d92c5a43b78d42913ffc |
| nikon-z-24-70f4s-f5.6-ref-tele | 8b15e190d96badcfb4ffa2b7d3f4cdb4f140a3f73afd80711ce385e7b298967e |
| nikon-z-24-70f4s-f5.6-photopic-wide | 2510573456570987e5d44b6aa597d4b9a6521aa366516ccb26c50d4de6e746a9 |
| nikon-z-24-70f4s-f5.6-photopic-zoom0.5 | 984d5ef2391c973845a56a31608a036b988a3c088a4e187ed8dbe9d2d89cdf4e |
| nikon-z-24-70f4s-f5.6-photopic-tele | e8c82d27951c440cc1f88df20ba83f966a6c5ca34bd98f16f51d25af697bf0df |
| nikon-z-24-70f4s-f5.6-best-ref-wide | 534c54ca70f1030921493f470f9ee0d6a3d238dc3cd43dc509c0f8687e543ea7 |
| nikon-z-24-70f4s-f5.6-best-ref-zoom0.5 | 672c59fea97eac2518485a560ed393242b1d93aea8dd8eb924af71026aad071b |
| nikon-z-24-70f4s-f5.6-best-ref-tele | 44724094bec9dc249b2d0587cd4722285afa329dc7ed3247d80487c9bf044284 |
| nikon-z-24-70f4s-f5.6-best-photopic-wide | c4350a7ae66a7c5d1636779198a6836b1d53a2eb1e95aafe0f500ec64ae45200 |
| nikon-z-24-70f4s-f5.6-best-photopic-zoom0.5 | d270caa263c2905c8932495abc7d758bfb2b1667a41b4ebe112febd62c701ee1 |
| nikon-z-24-70f4s-f5.6-best-photopic-tele | aadb6362aadf68ffb639570a84368f0c679ad673dc9d9cc424405ba8089a11e8 |
| nikon-z-24-70f4s-f11-ref-wide | a9fc28dc90bb6ec393151512c95cd9bbed404b4e7aeb6110aee02edda8728dfb |
| nikon-z-24-70f4s-f11-ref-zoom0.5 | ee0b49410666fe2b115167d3da9eadc492967c802f4457c926b117aafe491428 |
| nikon-z-24-70f4s-f11-ref-tele | dc0cc7f4f4644e267e862cc6f513fefb957e91c401cd83910f1faafbba1851f1 |
| nikon-z-24-70f4s-f11-photopic-wide | c206eaf79209e5ec699430cdc0f5923ba2d445f39f590303bcc3c31d3e145403 |
| nikon-z-24-70f4s-f11-photopic-zoom0.5 | d0eeb6571d07edf32c0707c8f24cc801818361e470ce1fa8db1b20d3a5b7e715 |
| nikon-z-24-70f4s-f11-photopic-tele | 31131a9c3a5064a17fa061ed66bbb17d1974c17f8df3d11c86435b060550e15a |
| nikon-z-24-70f4s-f11-best-ref-wide | f286f2dfaa83049a3d5591572f3e47840cf0032e6287523202de250b62561b1f |
| nikon-z-24-70f4s-f11-best-ref-zoom0.5 | 43c74496798ae9506b5038882eb2fe2fc934ecc74286ea98fdea22129bc9db3f |
| nikon-z-24-70f4s-f11-best-ref-tele | 86e79118d05b624fe13b031ef8c4cd8440be28a8e1bff83babd4d8424dbcd0ac |
| nikon-z-24-70f4s-f11-best-photopic-wide | ca0315a31df48b28a8ee654c39f2f02ba437e67d31827c1f66952c6a59f2a195 |
| nikon-z-24-70f4s-f11-best-photopic-zoom0.5 | fc43f4c21ab2e5e37fcc04116fa881dbc610d1f88b9565f6b5c8e17e5a315587 |
| nikon-z-24-70f4s-f11-best-photopic-tele | 8531011372f3b6c16e25c9c91fa49e878b0a28d9c8d0b56739e42136bacad768 |
| nikon-z-mc-105f28-f5.6-ref | 817dcdb72789e4f19aeb0834fdf38f2df1f9981feeda0e849a6fbe878516246e |
| nikon-z-mc-105f28-f5.6-photopic | 1954ed6aa33432e181f9fd106f948530837acf3981c484de154a624c9498c51f |
| nikon-z-mc-105f28-f5.6-best-ref | c083a9ad451157303b51e15cc837a6458e778df9940e23c2ef9b74bd6a6d67f9 |
| nikon-z-mc-105f28-f5.6-best-photopic | 78b7b0222e6524bef7d55aee358b93d5363d600153e44d6d8af4cc3fdd37c665 |
| nikon-z-mc-105f28-f11-ref | c7f1b99704f56d90a1f686179860d380dced25c8cd033526fcecd4702519f9e4 |
| nikon-z-mc-105f28-f11-photopic | 66c219236a3dab53372e71ec0933249c1f3a0cb1d7ceafa34405dbf42544a103 |
| nikon-z-mc-105f28-f11-best-ref | 731774161533fcf291c1c1269e0e88539a0dd9e65da2ae8f74753a0b5ca2b774 |
| nikon-z-mc-105f28-f11-best-photopic | 7c36e2f71e511338791089c2160a0f0729bebb1d35521a01e99f81628e3a4655 |
| nikon-z-135f18-plena-f5.6-ref | 2f48866c86a5c78c9d9985591e3093550306be61ca1b1467ece2a6624837935b |
| nikon-z-135f18-plena-f5.6-photopic | d3405bf3cc1609ad7ad77300cfc39b172ddc595ed32c4a7626c66cd7353d6fde |
| nikon-z-135f18-plena-f5.6-best-ref | 360b7b852f441111c8d5acb454934d8d59d4eca6b658012be793c9e01569543b |
| nikon-z-135f18-plena-f5.6-best-photopic | cf84ceaabd4254ec2fc9096ce284edbf9776b072cf55de2525e4164ea2c39914 |
| nikon-z-135f18-plena-f11-ref | 9370a359110296269721cb8c84b7071d063f75cc1e19f176fc6e2e3e747090cf |
| nikon-z-135f18-plena-f11-photopic | a6664a204e5bf0ca48289e51350f5c0e606260a662d0b29334b24c34c03ab468 |
| nikon-z-135f18-plena-f11-best-ref | e6cc666f0c9c00122578523ed519d8b34a1e9dff2427209471960455699891ec |
| nikon-z-135f18-plena-f11-best-photopic | 93e46690ec176b9d2633393b625aaf006e059e11893e23d34d82fc88b75b4084 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-ref | 199c2510c32fa327ab1821e2fab7968e7ad6a4bb2b9a9298f59fa94887b06bb2 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-photopic | 4cf6d7133ad5498fa5397bb6e8998034b7d8882c33d66a5680e260f1f2363e85 |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-ref | 8471bafaa095d48e703f204c34d8b0f411aaa31d1f1d70865eb3772e019aacbe |
| sigma-45mm-f28-dg-dn-contemporary-f5.6-best-photopic | 47a5da31cb8fe84438f6dc3d443dffceaa2edbe0025572c8875b9ebbb8a83ff1 |
| sigma-45mm-f28-dg-dn-contemporary-f11-ref | f3fcc3b63cd7c8c3a567b5f318c8a9dd3e469e78af15979fd5edb6778d604839 |
| sigma-45mm-f28-dg-dn-contemporary-f11-photopic | 767aa6f20ae7d3f4801e196910ff99f05e24ca2ed20524b0e6e626f82ba5af85 |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-ref | e8b060aaeb44cba02d576fc44c9725a7bd44cc6d4adb173931ddb86caf196c9b |
| sigma-45mm-f28-dg-dn-contemporary-f11-best-photopic | 4178d8f26ba49800c75581368bca19314aa614248502ad7f4ac8a59f57da305a |
| nikon-z-24-70f4s-open-ref-wide | baf5883c8fe1fe3b3bc3ce54df29d33f7815ce0b36c19858ee520040d0906997 |
| nikon-z-24-70f4s-open-ref-zoom0.5 | 0c1e3e17b791b8b76cc5311d51e8dbd6ad9592081d1f4e853b775cf8253d1f53 |
| nikon-z-24-70f4s-open-ref-tele | 8dd3c38f79512c8e7ca966ac09bc664a56558247e9905939c4eac322f2190b7a |
| nikon-z-24-70f4s-open-photopic-wide | 392526a2d4fb6800be21455fb7097f75e53156a130b490f79830e62460359a12 |
| nikon-z-24-70f4s-open-photopic-zoom0.5 | 88a749d4f75279b33492f61035d826b4688f7c9e5ccf3d92dbc7f9c9549ca91e |
| nikon-z-24-70f4s-open-photopic-tele | 9e3b47006624814732c91d238b73f183b938f21c947092003915ea16b13a4827 |
| nikon-z-24-70f4s-open-best-ref-wide | 62d96ffeab1ee441a493e20cc765c9c127be4f1229c82c3aaf27a6396df5fbd3 |
| nikon-z-24-70f4s-open-best-ref-zoom0.5 | e96a55399921f347d7e4cc74cfb6866870a4ce088279506abff48b416df2f370 |
| nikon-z-24-70f4s-open-best-ref-tele | 438bf375af81ecd80d950758d8e955c586efeb1491823600d9af2a4d08b987c8 |
| nikon-z-24-70f4s-open-best-photopic-wide | c3e2ff5ca8846d295ca192a631c924ad89fac42eca1b4c18770d8f5617b8c506 |
| nikon-z-24-70f4s-open-best-photopic-zoom0.5 | dde35e9fddfe63b8cad5485f93c17dae02b028d2da4dd0f847b5aecb6eb4202f |
| nikon-z-24-70f4s-open-best-photopic-tele | 744b809865d1a1116492bfbf856ab119ea41ab803108f9c981f69923f41cf76e |
| nikon-z-24-70f4s-f8-ref-wide | ed8aaa73b01961d36274403435feee84c6cb8bfb9211b236431eacf5db04faba |
| nikon-z-24-70f4s-f8-ref-zoom0.5 | cfe08daed58c95d06787698fb20876419f0d64aeda8b760fcb3c39f5892f1a89 |
| nikon-z-24-70f4s-f8-ref-tele | a76c758989f346f923ce488b7e1560778a612a5fc85c82a42b28836ed90ab1db |
| nikon-z-24-70f4s-f8-photopic-wide | ab3760654d94804e8278e5cad2c61fac6237577dc6f556f1840b1c720c67ccc2 |
| nikon-z-24-70f4s-f8-photopic-zoom0.5 | ea8482dd9fbeb8c91ac688c1229a4abd30e352a2e55818abc1e5ea30fae8a5a8 |
| nikon-z-24-70f4s-f8-photopic-tele | 3880b49fc9097685272f3f5f6b9410a3c721798228c33fa69503e366e3a28067 |
| nikon-z-24-70f4s-f8-best-ref-wide | a0271c9a00da51b882e5b0c6177d1e87108636b9ce7b3252f1794e7a576cd670 |
| nikon-z-24-70f4s-f8-best-ref-zoom0.5 | c84d1fc5b9e9daa5909cc2530a508854046daba2153963653f5ff7f42ac3bdb5 |
| nikon-z-24-70f4s-f8-best-ref-tele | b474dca4701ef6ae3fa7967b0c5ff8ae237cb6fc643faf3d829a72c2eb3df974 |
| nikon-z-24-70f4s-f8-best-photopic-wide | 6882783f3706c89459ea475b03c5097f00f8e10b8f38f8c7a912789db7f9c183 |
| nikon-z-24-70f4s-f8-best-photopic-zoom0.5 | b0a60930819cad6639b046939da301d87a82fd845e4c3aca8951a40bf4fdddb1 |
| nikon-z-24-70f4s-f8-best-photopic-tele | b3e22a7473a909ad089f72ea18ecbbea131ebcc8d3093090ae20e82ef40a8794 |
