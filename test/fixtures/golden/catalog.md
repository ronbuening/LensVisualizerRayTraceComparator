# Catalog statistics

These are the statistics of the catalog sweep: every lens of LensVisualizer's catalog at the snapshot's commit, at each end of a zoom, wide open, at the reference wavelength and on the design image plane, rendered from the catalog's two baselines alone. The catalog's baselines are a dated snapshot, not refreshed with the others.

Both catalog baselines are present; the pairs of check r4, which is in both, are counted once.

A lens state's status is the worst verdict of its pairs; a pair count counts one record a run, check and pair of engines, and the groups of lens features overlap.

## Status counts

| Scope | Lens states | Lens states by status | Pairs by status |
|---|---|---|---|
| catalog | 3 | 1 Fail; 2 Not computed | 1 Fail; 1 Not computed |
| Lens feature: surface.asphere.even | 1 | 1 Fail | 1 Fail |
| Reason of the census: invented-refusal | 1 | 1 Not computed | none |

## Codes, by lens state and by engine

A census code counts the distinct lens states that carry it (such a state may still be compared: see the status counts); an engine code counts the distinct runs, checks and engines that refused with it.

| Code | Lens states with the code | Checks an engine refused |
|---|---|---|
| invented-code artificial.item | 0 | 1 |
| invented-refusal | 1 | 0 |

## Figures of the checks held to a limit

Quantiles interpolate linearly at (n - 1)p over the finite figures of the pairs of the checks held to a limit; figures that are not finite are counted apart and ranked first in each list of the worst ten.

### Geometric MTF of the same rays — `r4`: mtf.maxAbs, with no unit

| Pairs | Not finite | Min | Median | p90 | p99 | Max |
|---|---|---|---|---|---|---|
| 1 | 0 | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 |

| Run | Engines | Value |
|---|---|---|
| catalog-artificial-prime | lv / ref | 0.25 |

## Failures, classified

A listed failure keeps its verdict, Fail; each failing figure keeps its class, the hash of its evidence, the entry of docs/gotchas.md that explains it and a command that reproduces it in one run.

| Run | Check | Engines | Figure | Class | Gotcha | Reproducer |
|---|---|---|---|---|---|---|
| catalog-artificial-prime | r4 | lv / ref | mtf.maxAbs | numerical | docs/gotchas.md#artificial-example | node bin/lvrtc.mjs run suites/catalog-repro/artificial.json --rungs r4 --jobs 4 |

## How to read this

A lens state is one run of the sweep; a pair is two engines on one check of one run. A status or a verdict is
shown by its label; the stored value is what the catalog's baselines hold:

| Label | Stored value | Meaning |
|---|---|---|
| Fail: beyond limit | `FAIL` | A check held to a limit: a judged figure is above its limit, or is not a number. |
| Not computed | `UNSUPPORTED` | One of the two engines cannot compute what was asked. That is an answer, not a failure. |

The checks of the sweep, by the id a heading names:

| Check | Id | Compares |
|---|---|---|
| Geometric MTF of the same rays | `r4` | This tool's geometric MTF of identical rays, as each engine traces them. |

In the table of failures, Class says where a difference comes from, decided in the order unsupported, data, convention, numerical, method (method: the two engines' methods differ), and not that an engine is right; Gotcha is the entry of docs/gotchas.md that explains the difference, and Reproducer the command that reproduces it in one run:

| Class | Stored value |
|---|---|
| not converged | `numerical` |

## Sources

- baselines/catalog.json: 37a9211c976599ec51e8f93cbbe4c0de7444cd74dfe2957fd3ec950cc3fc93ba
- baselines/catalog.mtf.json: 2c8acb184e63ac4fa15232264d88183245c1a1754dd1181bb957c538b7bd829b

## Not covered

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so check r5 sets two methods side by side and holds them to no limit.

- A polychromatic curve of optiland's FFT class. It gives the modulus at one wavelength, so a run of several wavelengths has no FFT row in checks r5 or r6c. The external counterpart in check r6c is this tool's complex sum of optiland's raw wavefronts; its proof on synthetic sums checks the declared weighting and phase convention, not physical spectral fidelity.

- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Check r5g sets the two side by side and holds them to no limit: a difference of the two pupil samplings is written down, not explained.

- The bins of optiland's geometric MTF. At one wavelength optiland's curve is of landings counted into bins, and a field whose bins move a value by more than its convergence band (0.005 on the axis, 0.01 off it) has no optiland curve. At several wavelengths the sum over optiland's landings is this tool's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.

- Dispersion and white-light weighting. Every engine is handed the refractive indices and the wavelength weights LensVisualizer states; no glass catalog and no spectrum is checked against another.

- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.

- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.

- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.

- Zoom and focus positions other than the lens states a run names, and the catalog beyond these suites.

- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no review band.
