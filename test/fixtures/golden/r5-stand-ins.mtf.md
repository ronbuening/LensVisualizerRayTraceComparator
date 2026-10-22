# MTF baseline of r5-stand-ins

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
| Suite | r5-stand-ins |
| Suite hash | 2683eeb778d1dbede78479314c82c226901206a79c0675f76566a26c181d231f |
| Baseline hash | 5172cbfbdd383358dc8673e466fcb274e2484d15dde57a1fe38852ea144b9bbe |
| Contract version | 1.1 |
| Policy | rungs v1 |
| Policy hash | 98d2351601a94f80f1cf6be9cf1c0272a3f98573b7446c70e66db4edcdd8fa85 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 | — | bias 0, failMode none, offersQuantities true |
| optiland | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 | — | bias 0, failMode none, offersQuantities true |
| wave | 1 | a348558d728efd5c7b52a212b84aac868d7c2d5b1839c2f4a564dcd7f81d4f16 | — | bias 0, failMode none, offersQuantities true |

| Run | Case |
|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r5 | mtf.native | 3 | 3 | lv – optiland | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED |
| r5 | mtf.native | 3 | 3 | lv – wave | 3 RECORDED | 3 RECORDED |
| r5 | mtf.native | 3 | 3 | optiland – wave | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r5 | lv | 3 ok |
| r5 | optiland | 2 ok, 1 unsupported (feature lines.polychromatic) |
| r5 | wave | 3 ok |

## r5

Quantity `mtf.native`. The worst of every metric over the suite:

| Pair | Metric | Worst, or total | Requests measured | Run | Where |
|---|---|---|---|---|---|
| lv – optiland | chiefLanding.maxAbs [mm] | 1.95e-3 | 2 of 3 | beyond | field 5.00e-1 |
| lv – optiland | mtfOnAxis.maxAbs | 3.91e-3 | 2 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| lv – optiland | mtfOffAxis.maxAbs | 7.81e-3 | 2 of 3 | edge | cut tangential, field 5.00e-1, frequencyPerMm 30 |
| lv – optiland | mtfRimLost.maxAbs | 1.25e-1 | 1 of 3 | edge | cut sagittal, field 1, frequencyPerMm 50 |
| lv – optiland | fields.compared [elements] | 4 | 2 of 3 | — | — |
| lv – optiland | fields.flagged [elements] | 0 | 2 of 3 | — | — |
| lv – optiland | fields.rimLost [elements] | 1 | 2 of 3 | — | — |
| lv – optiland | fields.data [elements] | 1 | 2 of 3 | — | — |
| lv – optiland | fields.unavailable [elements] | 0 | 2 of 3 | — | — |
| lv – optiland | mtfOnAxis.firstStepMaxAbs | 3.91e-3 | 1 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| lv – optiland | mtfOffAxis.firstStepMaxAbs | 0 | 1 of 3 | beyond | cut sagittal, field 1, frequencyPerMm 10 |
| lv – wave | chiefLanding.maxAbs [mm] | 0 | 3 of 3 | edge | field 0 |
| lv – wave | mtfOnAxis.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 0, frequencyPerMm 10 |
| lv – wave | mtfOffAxis.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| lv – wave | mtfFlagged.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 1, frequencyPerMm 10 |
| lv – wave | fields.compared [elements] | 6 | 3 of 3 | — | — |
| lv – wave | fields.flagged [elements] | 3 | 3 of 3 | — | — |
| lv – wave | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| lv – wave | fields.data [elements] | 0 | 3 of 3 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 3 of 3 | — | — |
| optiland – wave | chiefLanding.maxAbs [mm] | 1.95e-3 | 2 of 3 | beyond | field 5.00e-1 |
| optiland – wave | mtfOnAxis.maxAbs | 3.91e-3 | 2 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| optiland – wave | mtfOffAxis.maxAbs | 7.81e-3 | 1 of 3 | edge | cut tangential, field 5.00e-1, frequencyPerMm 30 |
| optiland – wave | mtfFlagged.maxAbs | 1.25e-1 | 2 of 3 | edge | cut sagittal, field 1, frequencyPerMm 50 |
| optiland – wave | fields.compared [elements] | 3 | 2 of 3 | — | — |
| optiland – wave | fields.flagged [elements] | 2 | 2 of 3 | — | — |
| optiland – wave | fields.rimLost [elements] | 0 | 2 of 3 | — | — |
| optiland – wave | fields.data [elements] | 1 | 2 of 3 | — | — |
| optiland – wave | fields.unavailable [elements] | 0 | 2 of 3 | — | — |
| optiland – wave | mtfOnAxis.firstStepMaxAbs | 3.91e-3 | 1 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |

The engines' own MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a tolerance.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

Requests without a table, by what the two engines came to:

| Verdict | Requests | Runs | Reason |
|---|---|---|---|
| UNSUPPORTED | 1 | 1 | optiland is unsupported (feature lines.polychromatic) |

A row is one field and cut of one run, at 10, 30, 50 cycles/mm. Under each engine is what it says of the field
(`optiland` with the step its row is of, where it was asked again); the third estimate is the comparator's
(`wave`). The status is the gravest of the row's frequencies; "all" is what the two engines came to over
every frequency of the request.

Rows by status: 7 RECORDED, 1 ATTENTION, 4 SET ASIDE.

| Run | Field | Cut | lv | optiland | wave | Class | Status | All | lv 10 | optiland 10 | wave 10 | Δ 10 | lv 30 | optiland 30 | wave 30 | Δ 30 | lv 50 | optiland 50 | wave 50 | Δ 50 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| edge | 0 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8711 | 0.8750 | 3.91e-3 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 0 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 0.5 | sagittal | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 0.5 | tangential | ok | ok | ok | method: two-methods | RECORDED | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7422 | 0.7500 | 7.81e-3 | 0.5000 | 0.5000 | 0.5000 | 0 |
| edge | 1 | sagittal | ok | ok | unconverged | method: rim-rays-lost | SET ASIDE | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.6250 | 0.5000 | -1.25e-1 |
| edge | 1 | tangential | ok | ok | unconverged | method: rim-rays-lost | SET ASIDE | RECORDED | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| beyond | 0 | sagittal | ok | ok (fft512) | ok | method: two-methods | ATTENTION | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.4961 | 0.5000 | 3.91e-3 |
| beyond | 0 | tangential | ok | ok (fft512) | ok | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| beyond | 0.5 | sagittal | ok | ok (fft512) | ok | data: chief-landing-apart | SET ASIDE | ATTENTION | 0.8750 | 0.8750 | 0.8750 | — | 0.7500 | 0.7500 | 0.7500 | — | 0.5000 | 0.5000 | 0.5000 | — |
| beyond | 0.5 | tangential | ok | ok (fft512) | ok | data: chief-landing-apart | SET ASIDE | ATTENTION | 0.8750 | 0.8750 | 0.8750 | — | 0.7500 | 0.7500 | 0.7500 | — | 0.5000 | 0.5000 | 0.5000 | — |
| beyond | 1 | sagittal | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |
| beyond | 1 | tangential | ok | ok (fft512) | unconverged | method: two-methods | RECORDED | ATTENTION | 0.8750 | 0.8750 | 0.8750 | 0 | 0.7500 | 0.7500 | 0.7500 | 0 | 0.5000 | 0.5000 | 0.5000 | 0 |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

| Reason | Meaning |
|---|---|
| chief-landing-apart | the chief rays land further apart than the limit: two image points; no difference is shown |
| rim-rays-lost | an engine calibrated a frequency axis with a rim ray that was lost; the difference is shown apart, in no band |
| two-methods | both engines stand by their curves; the difference is held to the attention band |

## Later steps

An engine that was asked a request once more, with a finer sampling, because of what its first answer came to.
Its first answer is what the support counts; the step is what its row of a table is of.

| Rung | Engine | Step | Runs | Requests asked again | Not ok |
|---|---|---|---|---|---|
| r5 | optiland | fft512 | 1 | 1 | — |

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

| Rung | Run | Field | Pair | Figures above their bands |
|---|---|---|---|---|
| r5 | beyond | — | lv – optiland | chiefLanding.maxAbs 1.95e-3 (band 9.77e-4) at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r5 | beyond | — | optiland – wave | chiefLanding.maxAbs 1.95e-3 (band 9.77e-4) at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 50 |

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
