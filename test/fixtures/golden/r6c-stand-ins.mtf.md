# Baseline of r6c-stand-ins: the MTF checks

This file is the committed record of the MTF checks of the suite r6c-stand-ins, as its MTF baseline holds them, for
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
| Suite | r6c-stand-ins |
| Limits file | v1 |

| Engine | Name | Version | What the engine states of itself |
|---|---|---|---|
| lv | LensVisualizer | 1 | bias 0, failMode none, offersQuantities true |
| optiland | optiland | 1 | bias 0, failMode none, offersQuantities true |
| optiland-wave | OTF of optiland's wavefront | 1 | bias 0, failMode none, offersQuantities true |
| wave | Wave MTF of LensVisualizer's rays | 1 | bias 0, failMode none, offersQuantities true |

## Summary

| Check | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| MTF beside the OTF of optiland's wavefront — `r6c` | `mtf.native` | 3 | 3 | lv – optiland | 1 Side by side; 1 Side by side, worth a look; 1 Not computed | 1 Side by side; 1 Side by side, worth a look; 1 Not computed |
| MTF beside the OTF of optiland's wavefront — `r6c` | `mtf.native` | 3 | 3 | lv – optiland-wave | 3 Side by side, worth a look | 3 Side by side, worth a look |
| MTF beside the OTF of optiland's wavefront — `r6c` | `mtf.native` | 3 | 3 | lv – wave | 3 Side by side | 3 Side by side |
| MTF beside the OTF of optiland's wavefront — `r6c` | `mtf.native` | 3 | 3 | optiland – optiland-wave | 2 Side by side, worth a look; 1 Not computed | 2 Side by side, worth a look; 1 Not computed |
| MTF beside the OTF of optiland's wavefront — `r6c` | `mtf.native` | 3 | 3 | optiland – wave | 1 Side by side; 1 Side by side, worth a look; 1 Not computed | 1 Side by side; 1 Side by side, worth a look; 1 Not computed |
| MTF beside the OTF of optiland's wavefront — `r6c` | `mtf.native` | 3 | 3 | optiland-wave – wave | 3 Side by side, worth a look | 3 Side by side, worth a look |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot compute what was asked says so
(not computed), with the code and the item it names; that is an answer and not a failure.

| Check | Engine | Runs by status |
|---|---|---|
| MTF beside the OTF of optiland's wavefront — `r6c` | lv | 3 answered |
| MTF beside the OTF of optiland's wavefront — `r6c` | optiland | 2 answered, 1 not computed (feature lines.polychromatic) |
| MTF beside the OTF of optiland's wavefront — `r6c` | optiland-wave | 3 answered |
| MTF beside the OTF of optiland's wavefront — `r6c` | wave | 3 answered |

## MTF beside the OTF of optiland's wavefront — `r6c`

Compares: LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts. Kind: side by side, no limit. Quantity asked of the engines: an engine's own MTF (`mtf.native`).

The worst of every figure over the suite:

| Pair | Figure | Unit | Limit | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|---|---|
| lv – optiland | Largest distance between the two engines' chief-ray landings — `chiefLanding.maxAbs` | mm | — | 1.95e-3 | 2 of 3 | beyond | field 5.00e-1 of the image height |
| lv – optiland | Largest MTF difference on the axis — `mtfOnAxis.maxAbs` | (no unit) | review band 3.91e-3 | 3.91e-3 | 2 of 3 | beyond | cut sagittal, field 0 of the image height, frequencyPerMm 50 |
| lv – optiland | Largest MTF difference off the axis — `mtfOffAxis.maxAbs` | (no unit) | review band 7.81e-3 | 7.81e-3 | 2 of 3 | edge | cut tangential, field 5.00e-1 of the image height, frequencyPerMm 30 |
| lv – optiland | Largest MTF difference in fields where an engine lost a rim ray (in no review band) — `mtfRimLost.maxAbs` | (no unit) | — | 1.25e-1 | 1 of 3 | edge | cut sagittal, field 1 of the image height, frequencyPerMm 50 |
| lv – optiland | Fields compared — `fields.compared` | elements | — | 4 | 2 of 3 | — | — |
| lv – optiland | Fields set aside because a sampling did not settle — `fields.flagged` | elements | — | 0 | 2 of 3 | — | — |
| lv – optiland | Fields set aside because an engine lost a rim ray — `fields.rimLost` | elements | — | 1 | 2 of 3 | — | — |
| lv – optiland | Fields whose two answers are of different inputs — `fields.data` | elements | — | 1 | 2 of 3 | — | — |
| lv – optiland | Fields an engine has no answer for — `fields.unavailable` | elements | — | 0 | 2 of 3 | — | — |
| lv – optiland-wave | Largest distance between the two engines' chief-ray landings — `chiefLanding.maxAbs` | mm | — | 4 | 3 of 3 | edge | field 1 of the image height |
| lv – optiland-wave | Largest MTF difference on the axis — `mtfOnAxis.maxAbs` | (no unit) | review band 3.91e-3 | 7.81e-3 | 3 of 3 | edge | cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| lv – optiland-wave | Largest MTF difference in fields whose sampling did not settle (in no review band) — `mtfFlagged.maxAbs` | (no unit) | — | 0 | 2 of 3 | edge | cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |
| lv – optiland-wave | Fields compared — `fields.compared` | elements | — | 4 | 3 of 3 | — | — |
| lv – optiland-wave | Fields set aside because a sampling did not settle — `fields.flagged` | elements | — | 2 | 3 of 3 | — | — |
| lv – optiland-wave | Fields set aside because an engine lost a rim ray — `fields.rimLost` | elements | — | 0 | 3 of 3 | — | — |
| lv – optiland-wave | Fields whose two answers are of different inputs — `fields.data` | elements | — | 3 | 3 of 3 | — | — |
| lv – optiland-wave | Fields an engine has no answer for — `fields.unavailable` | elements | — | 0 | 3 of 3 | — | — |
| lv – optiland-wave | Largest MTF difference off the axis — `mtfOffAxis.maxAbs` | (no unit) | review band 7.81e-3 | 0 | 1 of 3 | polychromatic | cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |
| lv – wave | Largest distance between the two engines' chief-ray landings — `chiefLanding.maxAbs` | mm | — | 0 | 3 of 3 | edge | field 0 of the image height |
| lv – wave | Largest MTF difference on the axis — `mtfOnAxis.maxAbs` | (no unit) | review band 3.91e-3 | 0 | 3 of 3 | edge | cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| lv – wave | Largest MTF difference off the axis — `mtfOffAxis.maxAbs` | (no unit) | review band 7.81e-3 | 0 | 3 of 3 | edge | cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |
| lv – wave | Largest MTF difference in fields whose sampling did not settle (in no review band) — `mtfFlagged.maxAbs` | (no unit) | — | 0 | 3 of 3 | edge | cut sagittal, field 1 of the image height, frequencyPerMm 10 |
| lv – wave | Fields compared — `fields.compared` | elements | — | 6 | 3 of 3 | — | — |
| lv – wave | Fields set aside because a sampling did not settle — `fields.flagged` | elements | — | 3 | 3 of 3 | — | — |
| lv – wave | Fields set aside because an engine lost a rim ray — `fields.rimLost` | elements | — | 0 | 3 of 3 | — | — |
| lv – wave | Fields whose two answers are of different inputs — `fields.data` | elements | — | 0 | 3 of 3 | — | — |
| lv – wave | Fields an engine has no answer for — `fields.unavailable` | elements | — | 0 | 3 of 3 | — | — |
| optiland – optiland-wave | Largest distance between the two engines' chief-ray landings — `chiefLanding.maxAbs` | mm | — | 4 | 2 of 3 | edge | field 1 of the image height |
| optiland – optiland-wave | Largest MTF difference on the axis — `mtfOnAxis.maxAbs` | (no unit) | review band 3.91e-3 | 7.81e-3 | 2 of 3 | beyond | cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| optiland – optiland-wave | Largest MTF difference in fields whose sampling did not settle (in no review band) — `mtfFlagged.maxAbs` | (no unit) | — | 7.81e-3 | 1 of 3 | edge | cut tangential, field 5.00e-1 of the image height, frequencyPerMm 30 |
| optiland – optiland-wave | Fields compared — `fields.compared` | elements | — | 2 | 2 of 3 | — | — |
| optiland – optiland-wave | Fields set aside because a sampling did not settle — `fields.flagged` | elements | — | 1 | 2 of 3 | — | — |
| optiland – optiland-wave | Fields set aside because an engine lost a rim ray — `fields.rimLost` | elements | — | 0 | 2 of 3 | — | — |
| optiland – optiland-wave | Fields whose two answers are of different inputs — `fields.data` | elements | — | 3 | 2 of 3 | — | — |
| optiland – optiland-wave | Fields an engine has no answer for — `fields.unavailable` | elements | — | 0 | 2 of 3 | — | — |
| optiland – wave | Largest distance between the two engines' chief-ray landings — `chiefLanding.maxAbs` | mm | — | 1.95e-3 | 2 of 3 | beyond | field 5.00e-1 of the image height |
| optiland – wave | Largest MTF difference on the axis — `mtfOnAxis.maxAbs` | (no unit) | review band 3.91e-3 | 3.91e-3 | 2 of 3 | beyond | cut sagittal, field 0 of the image height, frequencyPerMm 50 |
| optiland – wave | Largest MTF difference off the axis — `mtfOffAxis.maxAbs` | (no unit) | review band 7.81e-3 | 7.81e-3 | 1 of 3 | edge | cut tangential, field 5.00e-1 of the image height, frequencyPerMm 30 |
| optiland – wave | Largest MTF difference in fields whose sampling did not settle (in no review band) — `mtfFlagged.maxAbs` | (no unit) | — | 1.25e-1 | 2 of 3 | edge | cut sagittal, field 1 of the image height, frequencyPerMm 50 |
| optiland – wave | Fields compared — `fields.compared` | elements | — | 3 | 2 of 3 | — | — |
| optiland – wave | Fields set aside because a sampling did not settle — `fields.flagged` | elements | — | 2 | 2 of 3 | — | — |
| optiland – wave | Fields set aside because an engine lost a rim ray — `fields.rimLost` | elements | — | 0 | 2 of 3 | — | — |
| optiland – wave | Fields whose two answers are of different inputs — `fields.data` | elements | — | 1 | 2 of 3 | — | — |
| optiland – wave | Fields an engine has no answer for — `fields.unavailable` | elements | — | 0 | 2 of 3 | — | — |
| optiland-wave – wave | Largest distance between the two engines' chief-ray landings — `chiefLanding.maxAbs` | mm | — | 4 | 3 of 3 | edge | field 1 of the image height |
| optiland-wave – wave | Largest MTF difference on the axis — `mtfOnAxis.maxAbs` | (no unit) | review band 3.91e-3 | 7.81e-3 | 3 of 3 | edge | cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| optiland-wave – wave | Largest MTF difference in fields whose sampling did not settle (in no review band) — `mtfFlagged.maxAbs` | (no unit) | — | 0 | 2 of 3 | edge | cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |
| optiland-wave – wave | Fields compared — `fields.compared` | elements | — | 4 | 3 of 3 | — | — |
| optiland-wave – wave | Fields set aside because a sampling did not settle — `fields.flagged` | elements | — | 2 | 3 of 3 | — | — |
| optiland-wave – wave | Fields set aside because an engine lost a rim ray — `fields.rimLost` | elements | — | 0 | 3 of 3 | — | — |
| optiland-wave – wave | Fields whose two answers are of different inputs — `fields.data` | elements | — | 3 | 3 of 3 | — | — |
| optiland-wave – wave | Fields an engine has no answer for — `fields.unavailable` | elements | — | 0 | 3 of 3 | — | — |
| optiland-wave – wave | Largest MTF difference off the axis — `mtfOffAxis.maxAbs` | (no unit) | review band 7.81e-3 | 0 | 1 of 3 | polychromatic | cut sagittal, field 5.00e-1 of the image height, frequencyPerMm 10 |

By run, each pair with its verdict and the judged figure that is largest against its limit, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – optiland-wave | lv – wave | optiland – optiland-wave | optiland – wave | optiland-wave – wave |
|---|---|---|---|---|---|---|---|
| edge | 1 | Side by side: no judged figure | Side by side, worth a look: no judged figure | Side by side: no judged figure | Side by side, worth a look: no judged figure | Side by side: no judged figure | Side by side, worth a look: no judged figure |
| beyond | 1 | Side by side, worth a look: no judged figure | Side by side, worth a look: no judged figure | Side by side: no judged figure | Side by side, worth a look: no judged figure | Side by side, worth a look: no judged figure | Side by side, worth a look: no judged figure |
| polychromatic | 1 | Not computed: no judged figure | Side by side, worth a look: no judged figure | Side by side: no judged figure | Not computed: no judged figure | Not computed: no judged figure | Side by side, worth a look: no judged figure |

#### edge

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), this tool's wave OTF of
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and this tool's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step, or a move on doubling the grid beyond the field's
convergence band, sets its differences aside as not converged. The reference-sphere model and the FFT axes remain
choices of each method.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland-wave` comes to Side by side, worth a look; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band | the methods differ | two-methods | the methods differ | two-methods |
| 0.5 | 4.000 | ok | ok | ok | unconverged | 0 | not converged | unconverged: a sampling did not settle; the difference is shown apart, in no review band | not converged | unconverged | not converged | unconverged |
| 1 | 8.000 | ok | unconverged | ok | ok | 4 | the inputs differ | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown | the inputs differ | chief-landing-apart | the inputs differ | chief-landing-apart |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8711 | 0.8672 | 7.81e-3 | Side by side, worth a look | the methods differ | 7.81e-3 | Side by side, worth a look | the methods differ | 3.91e-3 | Side by side | the methods differ |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | not converged | 0 | Set aside | not converged | 0 | Set aside | not converged |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | not converged | 0 | Set aside | not converged | 0 | Set aside | not converged |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | not converged | 0 | Set aside | not converged | 0 | Set aside | not converged |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | not converged | 0 | Set aside | not converged | 0 | Set aside | not converged |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7422 | 0.7500 | 0 | Set aside | not converged | 0 | Set aside | not converged | -7.81e-3 | Set aside | not converged |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | not converged | 0 | Set aside | not converged | 0 | Set aside | not converged |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.6250 | 0.5000 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

#### beyond

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), this tool's wave OTF of
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and this tool's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step, or a move on doubling the grid beyond the field's
convergence band, sets its differences aside as not converged. The reference-sphere model and the FFT axes remain
choices of each method.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland-wave` comes to Side by side, worth a look; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band | the methods differ | two-methods | the methods differ | two-methods |
| 0.5 | 4.000 | ok | ok | ok | unconverged | 0 | not converged | unconverged: a sampling did not settle; the difference is shown apart, in no review band | not converged | unconverged | the inputs differ | chief-landing-apart |
| 1 | 8.000 | ok | unconverged | ok | ok | 4 | the inputs differ | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown | the inputs differ | chief-landing-apart | the inputs differ | chief-landing-apart |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8672 | 7.81e-3 | Side by side, worth a look | the methods differ | 7.81e-3 | Side by side, worth a look | the methods differ | 7.81e-3 | Side by side, worth a look | the methods differ |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.4961 | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | -3.91e-3 | Side by side, worth a look | the methods differ |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | not converged | 0 | Set aside | not converged | — | Set aside | the inputs differ |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | not converged | 0 | Set aside | not converged | — | Set aside | the inputs differ |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | not converged | 0 | Set aside | not converged | — | Set aside | the inputs differ |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | not converged | 0 | Set aside | not converged | — | Set aside | the inputs differ |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | not converged | 0 | Set aside | not converged | — | Set aside | the inputs differ |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | not converged | 0 | Set aside | not converged | — | Set aside | the inputs differ |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Set aside | the inputs differ |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

#### polychromatic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), this tool's wave OTF of
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and this tool's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step, or a move on doubling the grid beyond the field's
convergence band, sets its differences aside as not converged. The reference-sphere model and the FFT axes remain
choices of each method.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 1.00e-3 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland-wave` comes to Side by side, worth a look; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band | the methods differ | two-methods | not computed by one engine | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.000 | ok | ok | — | ok | 5.00e-6 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band | the methods differ | two-methods | not computed by one engine | optiland is unsupported (feature lines.polychromatic) |
| 1 | 8.000 | ok | unconverged | — | ok | 4 | the inputs differ | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown | the inputs differ | chief-landing-apart | not computed by one engine | optiland is unsupported (feature lines.polychromatic) |

On several wavelengths optiland-wave is this tool's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per wavelength, evaluated at the requested frequencies. Each wavelength is
phase-shifted by -2 pi nu times its chief landing's offset from the chief landing of wavelength 0, weighted by
its weight in the lens state times the transmitted flux, and added before the modulus. The optiland FFT column
is not computed on several wavelengths.

Fields of several wavelengths use the chief-landing sorting limit 1.00e-3 mm of the limits file.
The landings identify the field: LensVisualizer's shared chief launch and optiland's chief ray of wavelength 0
are different rays; a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | — | 0.8672 | 7.81e-3 | Side by side, worth a look | the methods differ | 7.81e-3 | Side by side, worth a look | the methods differ | — | Not computed | not computed by one engine |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0 | tangential | 10 | 0.8750 | 0.8750 | — | 0.8750 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0 | tangential | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0 | tangential | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | — | 0.8750 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | — | 0.8750 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | Side by side | the methods differ | 0 | Side by side | the methods differ | — | Not computed | not computed by one engine |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | — | 0.8750 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Not computed | not computed by one engine |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | — | 0.7500 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Not computed | not computed by one engine |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | — | 0.5000 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Not computed | not computed by one engine |
| 1 | tangential | 10 | 0.8750 | 0.8750 | — | 0.8750 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Not computed | not computed by one engine |
| 1 | tangential | 30 | 0.7500 | 0.7500 | — | 0.7500 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Not computed | not computed by one engine |
| 1 | tangential | 50 | 0.5000 | 0.5000 | — | 0.5000 | — | Set aside | the inputs differ | — | Set aside | the inputs differ | — | Not computed | not computed by one engine |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

## Worth a look

Every request of a side-by-side check whose two engines differ by more than a review band, or whose chief rays
land further apart than a sorting limit, with each such figure. A review band is a width for attention, and a
sorting limit tells two image points apart; nothing here is a failure.

| Check | Run | Field | Pair | Figures above their review band or sorting limit |
|---|---|---|---|---|
| MTF beside the OTF of optiland's wavefront — `r6c` | edge | — | lv – optiland-wave | chiefLanding.maxAbs 4 (sorting limit 9.77e-4) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | edge | — | optiland – optiland-wave | chiefLanding.maxAbs 4 (sorting limit 9.77e-4) at field 1 of the image height |
| MTF beside the OTF of optiland's wavefront — `r6c` | edge | — | optiland-wave – wave | chiefLanding.maxAbs 4 (sorting limit 9.77e-4) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | beyond | — | lv – optiland | chiefLanding.maxAbs 1.95e-3 (sorting limit 9.77e-4) at field 5.00e-1 of the image height; mtfOnAxis.maxAbs 3.91e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 50 |
| MTF beside the OTF of optiland's wavefront — `r6c` | beyond | — | lv – optiland-wave | chiefLanding.maxAbs 4 (sorting limit 9.77e-4) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | beyond | — | optiland – optiland-wave | chiefLanding.maxAbs 4 (sorting limit 9.77e-4) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | beyond | — | optiland – wave | chiefLanding.maxAbs 1.95e-3 (sorting limit 9.77e-4) at field 5.00e-1 of the image height; mtfOnAxis.maxAbs 3.91e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 50 |
| MTF beside the OTF of optiland's wavefront — `r6c` | beyond | — | optiland-wave – wave | chiefLanding.maxAbs 4 (sorting limit 9.77e-4) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | polychromatic | — | lv – optiland-wave | chiefLanding.maxAbs 4 (sorting limit 1.00e-3) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |
| MTF beside the OTF of optiland's wavefront — `r6c` | polychromatic | — | optiland-wave – wave | chiefLanding.maxAbs 4 (sorting limit 1.00e-3) at field 1 of the image height; mtfOnAxis.maxAbs 7.81e-3 (review band 3.91e-3) at cut sagittal, field 0 of the image height, frequencyPerMm 10 |

## Not covered

What this comparison does not show, whatever its verdicts:

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

## How to read this

### Verdicts

A verdict is of one pair of engines: of one request, or, in a table by run, the worst over the requests of the
run. A table shows the label; the stored value is what the baseline file holds.

| Label | Stored value | Meaning |
|---|---|---|
| Side by side | `RECORDED` | A side-by-side comparison with no limit: the difference is written down, inside its review band or with none. It is not a failure. |
| Side by side, worth a look | `ATTENTION` | A side-by-side comparison with no limit: a figure is outside its review band. It is not a failure. |
| Not computed | `UNSUPPORTED` | One of the two engines cannot compute what was asked. That is an answer, not a failure. |

### Checks

A check held to a limit judges two engines' answers to the same input against the limits of the limits file. A
side-by-side check sets two methods beside each other with no limit, and fails nothing. A section of this file
is headed by a check's title, with the id the baseline file stores it under.

| Check | Id | Kind | Compares |
|---|---|---|---|
| MTF beside the OTF of optiland's wavefront | `r6c` | side by side, no limit | LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts. |

### Engines

A pair is named by the ids of its two engines:

| Id | Engine |
|---|---|
| `lv` | LensVisualizer itself, loaded from a local checkout, asked for each figure as its own tabs ask for it, and made to trace the very rays every engine is handed in the checks held to a limit. |
| `optiland` | optiland, an open-source optical design library in Python, run by this tool in a worker process of its own. |
| `optiland-wave` | This tool's OTF and Zernike fit of the raw wavefront samples that optiland computes. |
| `wave` | This tool's wave-optics MTF estimate, computed from the rays LensVisualizer launches and traces. |

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
| `field` | in a check of an engine's own MTF: the field as the request states it, a fraction of the image height, 0 on the axis and 1 at the edge of the image (shown with "of the image height"); an MTF table gives the angle beside it where the answers record one |
| `frequencyPerMm` | the spatial frequency, in cycles per millimetre |

### Wavelengths

Each wavelength by its index, as LensVisualizer's answers in this baseline record them:

| Wavelengths (nm), by index | Runs | For example |
|---|---|---|
| 0: 587.5618 | 2 | edge |
| 0: 587.5618; 1: 486.1327 | 1 | polychromatic |

### The engines' own MTF

Each frequency of a field and cut has a status of its own. A table with a row for each frequency shows that status; a table with a row for each field and cut shows the worst of its frequencies, and under All what the two engines came to over the whole request:

| Label | Stored value | Meaning |
|---|---|---|
| Side by side | `RECORDED` | The difference is inside the review band and was written down. |
| Side by side, worth a look | `ATTENTION` | The difference is outside the review band: worth a look, and not a failure. |
| Set aside | `SET ASIDE` | The row is in no review band, and its class and reason say why. |
| Not computed | `UNSUPPORTED` | An engine has no curve of the field, so there is no difference. |
| Error | `ERROR` | An engine gave no result, or the two results cannot be set against each other. |

A field has the class of its difference, decided in this order, and the reason beside it:

| Label | Stored value | Meaning |
|---|---|---|
| not computed by one engine | `unsupported` | One engine has no answer, so there is no difference to show. |
| the inputs differ | `data` | The two answers are not of the same input (another field point or other wavelengths), so no difference is shown. |
| a convention differs | `convention` | A declared transform between the two engines' conventions is missing. |
| not converged | `numerical` | An engine says that its own sampling did not settle (in the Zernike comparison: the fit is ill-conditioned); the difference is shown apart, in no review band. |
| the methods differ | `method` | Two methods, each standing by its own answer; the difference is set beside the review band, if there is one. |

## Identifiers

The hashes that tell one version from another: of the suite file, of this baseline file and of the limits file;
of each engine's code and of this tool's code behind it, with the commit and sources it states; and of each
run's lens state. `lvrtc baseline check` compares them with what the engines and LensVisualizer give today. The
contract version is that of the file format the baseline is written in.

| Identifier | Value |
|---|---|
| Suite file | 42859dd104196db2704aaaf6d38ad4e21e94bab0a2b28e1147aa7888ff5fa5d4 |
| Baseline file | e18c8ac170771294dba2cbb01cf1b044bc3a9a07c541252b25e033021fefe00d |
| Limits file | 6712023ebdae26142c51ef2fec56a763f4f2a951c91fc6eea04a4ec5a1fcffa7 |
| Contract version of the baseline file | 1.1 |

| Engine | Engine code | This tool's code behind it | Commit and sources |
|---|---|---|---|
| lv | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 | — | — |
| optiland | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 | — | — |
| optiland-wave | 324b7c3508eaea73b4fe516c15425c651b3e802d0237cfcbc3cd52efc5b595c4 | — | — |
| wave | a348558d728efd5c7b52a212b84aac868d7c2d5b1839c2f4a564dcd7f81d4f16 | — | — |

| Run | Lens state |
|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 |
