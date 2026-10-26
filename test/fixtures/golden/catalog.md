# Catalog statistics

Both catalog baselines are present; duplicate R4 pairs are counted once.

State statuses use the gravest pair verdict; pair counts use one aggregate per run, rung and engine pair, with feature groups overlapping.

## Status counts

| Scope | States | State statuses | Pair statuses |
|---|---|---|---|
| catalog | 3 | {"FAIL":1,"UNSUPPORTED":2} | {"FAIL":1,"UNSUPPORTED":1} |
| Feature: surface.asphere.even | 1 | {"FAIL":1} | {"FAIL":1} |
| Census reason: invented-refusal | 1 | {"UNSUPPORTED":1} | {} |

## Unsupported census

Source codes count distinct states; engine codes count distinct run, rung and engine refusals.

| Code | Source states | Engine rungs |
|---|---|---|
| invented-code artificial.item | 0 | 1 |
| invented-refusal | 1 | 0 |

## Gated pair figures

Quantiles interpolate linearly at (n - 1)p over finite gated pair figures; nonfinite figures are counted separately and ranked first in each worst-ten list.

### r4 / mtf.maxAbs (1)

| Pairs | Nonfinite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 1 | 0 | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 |

| Run | Engines | Value |
|---|---|---|
| catalog-artificial-prime | lv / ref | 0.25 |

## Classified FAILs

Listed failures remain FAIL; each failing metric retains its class, evidence hash, gotcha and one-run reproducer.

| Run | Rung | Engines | Metric | Class | Gotcha | Reproducer |
|---|---|---|---|---|---|---|
| catalog-artificial-prime | r4 | lv / ref | mtf.maxAbs | numerical | docs/gotchas.md#artificial-example | node bin/lvrtc.mjs run suites/catalog-repro/artificial.json --rungs r4 --jobs 4 |

## Sources

- baselines/catalog.json: 37a9211c976599ec51e8f93cbbe4c0de7444cd74dfe2957fd3ec950cc3fc93ba
- baselines/catalog.mtf.json: 2c8acb184e63ac4fa15232264d88183245c1a1754dd1181bb957c538b7bd829b

## Not covered

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.

- A polychromatic curve of optiland's FFT class. It gives a one-line modulus, so several lines have no FFT row in R5 or R6c. R6c's external counterpart is the comparator's complex sum of optiland's raw wavefronts; its synthetic sum proof checks the declared weighting and phase convention, not physical spectral fidelity.

- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Rung R5g is recorded and never gated: a difference of the two pupil samplings is written down, not explained.

- The bins of optiland's geometric MTF. On one line optiland's curve is of landings counted into bins, and a field whose bins move a value by more than a band has no optiland curve. On several lines the sum over optiland's landings is the worker's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.

- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.

- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.

- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.

- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.

- Zoom and focus positions other than the states a run names, and the catalog beyond these suites.

- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.
