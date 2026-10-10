# MTF baseline of r5g-stand-ins

What the committed MTF baseline of the suite holds, rung by rung, for every run as it was run (a zoom at
each end). A gated rung has a tolerance: for every pair of engines the verdict and the largest value of each
metric over the requests of the run, with the number of requests the metric was measured in, since a rung
measures a figure only where its sampling can arbitrate. A rung of two methods has no tolerance: its figures
are written down beside an attention band, and its tables set the estimates side by side.

This file is rendered from the baseline alone (`lvrtc verify` makes it anew and fails on a byte of
difference): it holds results, counts, names and hashes, and nothing an engine traced. The hash of a run's
case says what its figures are of; `lvrtc baseline check --mtf` says whether the case and the engines are
still those, and what moved.

## Inputs

| Input | Value |
|---|---|
| Suite | r5g-stand-ins |
| Suite hash | 0b893087636f1fc875c66610f77a58553ae02d065d110fb089f1d7f81db029e9 |
| Baseline hash | dfa8bbd427269e4a8e4658ca5899f9a0e86f61248d0cb51c5a4b1181f241e2b3 |
| Contract version | 1.1 |
| Policy | rungs v1 |
| Policy hash | a3a1c92a5a4f633308de2ea2e5b0cd245786c9674e4b88be1bab832155a4fd68 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 | — | bias 0, failMode none, offersQuantities true |
| optiland | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 | — | bias 0, failMode none, offersQuantities true |
| replay | 1 | 529061c7703d71616ecacf2563d68b74164d3efc60b9b25f22068518c4322fd9 | — | bias 0, failMode none, offersQuantities true |

| Run | Case |
|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r5g | mtf.native | 3 | 3 | lv – optiland | 1 RECORDED, 2 ATTENTION | 1 RECORDED, 2 ATTENTION |
| r5g | mtf.native | 3 | 3 | lv – replay | 3 RECORDED | 3 RECORDED |
| r5g | mtf.native | 3 | 3 | optiland – replay | 1 RECORDED, 2 ATTENTION | 1 RECORDED, 2 ATTENTION |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r5g | lv | 3 ok |
| r5g | optiland | 3 ok |
| r5g | replay | 3 ok |

## r5g

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | chiefLanding.maxAbs [mm] | 1.95e-3 | 3 of 3 | beyond | field 5.00e-1 |
| lv – optiland | mtfOnAxis.maxAbs | 3.91e-3 | 3 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| lv – optiland | mtfOffAxis.maxAbs | 1.56e-2 | 2 of 3 | polychromatic | cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| lv – optiland | fields.compared [elements] | 6 | 3 of 3 | — | — |
| lv – optiland | fields.flagged [elements] | 1 | 3 of 3 | — | — |
| lv – optiland | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| lv – optiland | fields.data [elements] | 1 | 3 of 3 | — | — |
| lv – optiland | fields.unavailable [elements] | 1 | 3 of 3 | — | — |
| lv – optiland | mtfOnAxis.firstStepMaxAbs | 3.91e-3 | 1 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| lv – optiland | mtfFlagged.maxAbs | 6.25e-2 | 1 of 3 | beyond | cut tangential, field 1, frequencyPerMm 70 |
| lv – replay | chiefLanding.maxAbs [mm] | 0 | 3 of 3 | edge | field 0 |
| lv – replay | mtfOnAxis.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 0, frequencyPerMm 10 |
| lv – replay | mtfOffAxis.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| lv – replay | fields.compared [elements] | 9 | 3 of 3 | — | — |
| lv – replay | fields.flagged [elements] | 0 | 3 of 3 | — | — |
| lv – replay | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| lv – replay | fields.data [elements] | 0 | 3 of 3 | — | — |
| lv – replay | fields.unavailable [elements] | 0 | 3 of 3 | — | — |
| optiland – replay | chiefLanding.maxAbs [mm] | 1.95e-3 | 3 of 3 | beyond | field 5.00e-1 |
| optiland – replay | mtfOnAxis.maxAbs | 3.91e-3 | 3 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| optiland – replay | mtfOffAxis.maxAbs | 1.56e-2 | 2 of 3 | polychromatic | cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| optiland – replay | fields.compared [elements] | 6 | 3 of 3 | — | — |
| optiland – replay | fields.flagged [elements] | 1 | 3 of 3 | — | — |
| optiland – replay | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| optiland – replay | fields.data [elements] | 1 | 3 of 3 | — | — |
| optiland – replay | fields.unavailable [elements] | 1 | 3 of 3 | — | — |
| optiland – replay | mtfOnAxis.firstStepMaxAbs | 3.91e-3 | 1 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| optiland – replay | mtfFlagged.maxAbs | 6.25e-2 | 1 of 3 | beyond | cut tangential, field 1, frequencyPerMm 70 |

The engines' own geometric MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the
pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a
tolerance.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice
across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. On one line
optiland counts its landings into bins, and gives a curve only where the bins move it by less than a band.
Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its
curves moved between its last two samplings, which is that engine's own measure and judges no other.

On several lines the column of optiland is not a curve of optiland's own class, which is of one line: the rays
and their landings are optiland's, a line a call, and the sum over them, the lines added as complex numbers with
their weights before the modulus is taken, is the worker's.

A row is one field and cut of one run, at 10, 30, 50 cycles/mm. Under each engine is what it says of the field
(`optiland` with the step its row is of, where it was asked again); the third estimate is the comparator's
(`replay`). The status is the gravest of the row's frequencies; "all" is what the two engines came to over
every frequency of the request.

Rows by status: 10 RECORDED, 2 ATTENTION, 4 SET ASIDE, 2 UNSUPPORTED.

| Run | Field | Cut | lv | optiland | replay | Class | Status | All | lv 10 | optiland 10 | replay 10 | Δ 10 | lv 30 | optiland 30 | replay 30 | Δ 30 | lv 50 | optiland 50 | replay 50 | Δ 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| edge | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8711 | 0.8750 | 3.91e-3 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7422 | 0.7500 | 7.81e-3 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 1 | sagittal | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8750 | — | 0.8750 | — | 0.7500 | — | 0.7500 | — | 0.5000 | — | 0.5000 | — |
| edge | 1 | tangential | ok | no curve | ok | unsupported: no-curve | UNSUPPORTED | RECORDED | 0.8750 | — | 0.8750 | — | 0.7500 | — | 0.7500 | — | 0.5000 | — | 0.5000 | — |
| beyond | 0 | sagittal | ok | ok (geo512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.4961 | 0.5000 | 3.91e-3 |
| beyond | 0 | tangential | ok | ok (geo512) | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| beyond | 0.5 | sagittal | ok | ok (geo512) | ok | data: chief-landing-apart | SET ASIDE | ATTENTION | 0.8750 | 0.8750 | 0.8750 | — | 0.7500 | 0.7500 | 0.7500 | — | 0.5000 | 0.5000 | 0.5000 | — |
| beyond | 0.5 | tangential | ok | ok (geo512) | ok | data: chief-landing-apart | SET ASIDE | ATTENTION | 0.8750 | 0.8750 | 0.8750 | — | 0.7500 | 0.7500 | 0.7500 | — | 0.5000 | 0.5000 | 0.5000 | — |
| beyond | 1 | sagittal | ok | unconverged (geo512) | ok | numerical: unconverged | SET ASIDE | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| beyond | 1 | tangential | ok | unconverged (geo512) | ok | numerical: unconverged | SET ASIDE | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| polychromatic | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| polychromatic | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| polychromatic | 0.5 | sagittal | ok | ok | ok | method: two-methods | ATTENTION | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7656 | 0.7500 | -1.56e-2 | 0.5000 | 0.5000 | 0.5000 | 0 |
| polychromatic | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| polychromatic | 1 | sagittal | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| polychromatic | 1 | tangential | ok | ok | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

| Reason | Meaning |
|---|---|
| chief-landing-apart | the chief rays land further apart than the limit: two image points; no difference is shown |
| no-curve | an engine has no curve of the field |
| two-methods | both engines stand by their curves; the difference is held to the attention band |
| unconverged | a sampling did not settle; the difference is shown apart, in no band |

## Later steps

An engine that was asked a request once more, with a finer sampling, because of what its first answer came to.
Its first answer is what the support counts; the step is what its row of a table is of.

| Rung | Engine | Step | Runs | Requests asked again | Not ok |
|---|---|---|---|---|---|
| r5g | optiland | geo512 | 1 | 1 | — |

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

| Rung | Run | Field | Pair | Figures above their bands |
|---|---|---|---|---|
| r5g | beyond | — | lv – optiland | chiefLanding.maxAbs 1.95e-3 (band 9.77e-4) at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | beyond | — | optiland – replay | chiefLanding.maxAbs 1.95e-3 (band 9.77e-4) at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5g | polychromatic | — | lv – optiland | mtfOffAxis.maxAbs 1.56e-2 (band 7.81e-3) at cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| r5g | polychromatic | — | optiland – replay | mtfOffAxis.maxAbs 1.56e-2 (band 7.81e-3) at cut sagittal, field 5.00e-1, frequencyPerMm 30 |

## Not covered

What this comparison does not show, whatever its verdicts:

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.
- The formation of a polychromatic MTF. optiland's FFT MTF is of one line and gives a modulus, so a run on several lines has no optiland row in rung R5; its external counterpart is the comparator's estimator on optiland's wavefront, which is a later stage.
- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Rung R5g is recorded and never gated: a difference of the two pupil samplings is written down, not explained.
- The bins of optiland's geometric MTF. On one line optiland's curve is of landings counted into bins, and a field whose bins move a value by more than a band has no optiland curve. On several lines the sum over optiland's landings is the worker's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.
- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom positions between the two ends, and finite conjugates other than the states a run names.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.

### The engines' own MTF

A row of such a table is one field, cut and frequency, and has a status of its own:

| Status | Meaning |
|---|---|
| RECORDED | the difference is inside the attention band and was written down |
| ATTENTION | the difference is outside the attention band: worth a look, and not a failure |
| SET ASIDE | the row is in no band, and its class and reason say why |
| UNSUPPORTED | an engine has no curve of the field, so there is no difference |
| ERROR | an engine gave no result, or the two results cannot be set against each other |

A field has the class of its difference, decided in this order, and the reason beside it:

| Class | Meaning |
|---|---|
| unsupported | an engine has no answer |
| data | the two answers are not of the same input |
| convention | a declared transform is missing; this comparison has none to miss and never gives the class |
| numerical | an engine says that its own sampling did not settle |
| method | two methods, each standing by its own curves |
