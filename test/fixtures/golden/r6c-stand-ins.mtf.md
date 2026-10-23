# MTF baseline of r6c-stand-ins

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
| Suite | r6c-stand-ins |
| Suite hash | 42859dd104196db2704aaaf6d38ad4e21e94bab0a2b28e1147aa7888ff5fa5d4 |
| Baseline hash | e18c8ac170771294dba2cbb01cf1b044bc3a9a07c541252b25e033021fefe00d |
| Contract version | 1.1 |
| Policy | rungs v1 |
| Policy hash | 6712023ebdae26142c51ef2fec56a763f4f2a951c91fc6eea04a4ec5a1fcffa7 |

| Engine | Version | Fingerprint | Adapter revision | Taken at |
|---|---|---|---|---|
| lv | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 | — | bias 0, failMode none, offersQuantities true |
| optiland | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 | — | bias 0, failMode none, offersQuantities true |
| optiland-wave | 1 | 324b7c3508eaea73b4fe516c15425c651b3e802d0237cfcbc3cd52efc5b595c4 | — | bias 0, failMode none, offersQuantities true |
| wave | 1 | a348558d728efd5c7b52a212b84aac868d7c2d5b1839c2f4a564dcd7f81d4f16 | — | bias 0, failMode none, offersQuantities true |

| Run | Case |
|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 |

## Summary

| Rung | Quantity | Runs | Requests | Pair | Runs by verdict | Requests by verdict |
|---|---|---|---|---|---|---|
| r6c | mtf.native | 3 | 3 | lv – optiland | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED |
| r6c | mtf.native | 3 | 3 | lv – optiland-wave | 3 ATTENTION | 3 ATTENTION |
| r6c | mtf.native | 3 | 3 | lv – wave | 3 RECORDED | 3 RECORDED |
| r6c | mtf.native | 3 | 3 | optiland – optiland-wave | 2 ATTENTION, 1 UNSUPPORTED | 2 ATTENTION, 1 UNSUPPORTED |
| r6c | mtf.native | 3 | 3 | optiland – wave | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED | 1 RECORDED, 1 ATTENTION, 1 UNSUPPORTED |
| r6c | mtf.native | 3 | 3 | optiland-wave – wave | 3 ATTENTION | 3 ATTENTION |

## Support

In how many runs the jobs of an engine ended in each way. An engine that cannot answer says so (unsupported),
with the code and the item it names; that is an answer and not a failure.

| Rung | Engine | Runs by status |
|---|---|---|
| r6c | lv | 3 ok |
| r6c | optiland | 2 ok, 1 unsupported (feature lines.polychromatic) |
| r6c | optiland-wave | 3 ok |
| r6c | wave | 3 ok |

## r6c

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
| lv – optiland-wave | chiefLanding.maxAbs [mm] | 4 | 3 of 3 | edge | field 1 |
| lv – optiland-wave | mtfOnAxis.maxAbs | 7.81e-3 | 3 of 3 | edge | cut sagittal, field 0, frequencyPerMm 10 |
| lv – optiland-wave | mtfFlagged.maxAbs | 0 | 2 of 3 | edge | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| lv – optiland-wave | fields.compared [elements] | 4 | 3 of 3 | — | — |
| lv – optiland-wave | fields.flagged [elements] | 2 | 3 of 3 | — | — |
| lv – optiland-wave | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| lv – optiland-wave | fields.data [elements] | 3 | 3 of 3 | — | — |
| lv – optiland-wave | fields.unavailable [elements] | 0 | 3 of 3 | — | — |
| lv – optiland-wave | mtfOffAxis.maxAbs | 0 | 1 of 3 | polychromatic | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| lv – wave | chiefLanding.maxAbs [mm] | 0 | 3 of 3 | edge | field 0 |
| lv – wave | mtfOnAxis.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 0, frequencyPerMm 10 |
| lv – wave | mtfOffAxis.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| lv – wave | mtfFlagged.maxAbs | 0 | 3 of 3 | edge | cut sagittal, field 1, frequencyPerMm 10 |
| lv – wave | fields.compared [elements] | 6 | 3 of 3 | — | — |
| lv – wave | fields.flagged [elements] | 3 | 3 of 3 | — | — |
| lv – wave | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| lv – wave | fields.data [elements] | 0 | 3 of 3 | — | — |
| lv – wave | fields.unavailable [elements] | 0 | 3 of 3 | — | — |
| optiland – optiland-wave | chiefLanding.maxAbs [mm] | 4 | 2 of 3 | edge | field 1 |
| optiland – optiland-wave | mtfOnAxis.maxAbs | 7.81e-3 | 2 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 10 |
| optiland – optiland-wave | mtfFlagged.maxAbs | 7.81e-3 | 1 of 3 | edge | cut tangential, field 5.00e-1, frequencyPerMm 30 |
| optiland – optiland-wave | fields.compared [elements] | 2 | 2 of 3 | — | — |
| optiland – optiland-wave | fields.flagged [elements] | 1 | 2 of 3 | — | — |
| optiland – optiland-wave | fields.rimLost [elements] | 0 | 2 of 3 | — | — |
| optiland – optiland-wave | fields.data [elements] | 3 | 2 of 3 | — | — |
| optiland – optiland-wave | fields.unavailable [elements] | 0 | 2 of 3 | — | — |
| optiland – wave | chiefLanding.maxAbs [mm] | 1.95e-3 | 2 of 3 | beyond | field 5.00e-1 |
| optiland – wave | mtfOnAxis.maxAbs | 3.91e-3 | 2 of 3 | beyond | cut sagittal, field 0, frequencyPerMm 50 |
| optiland – wave | mtfOffAxis.maxAbs | 7.81e-3 | 1 of 3 | edge | cut tangential, field 5.00e-1, frequencyPerMm 30 |
| optiland – wave | mtfFlagged.maxAbs | 1.25e-1 | 2 of 3 | edge | cut sagittal, field 1, frequencyPerMm 50 |
| optiland – wave | fields.compared [elements] | 3 | 2 of 3 | — | — |
| optiland – wave | fields.flagged [elements] | 2 | 2 of 3 | — | — |
| optiland – wave | fields.rimLost [elements] | 0 | 2 of 3 | — | — |
| optiland – wave | fields.data [elements] | 1 | 2 of 3 | — | — |
| optiland – wave | fields.unavailable [elements] | 0 | 2 of 3 | — | — |
| optiland-wave – wave | chiefLanding.maxAbs [mm] | 4 | 3 of 3 | edge | field 1 |
| optiland-wave – wave | mtfOnAxis.maxAbs | 7.81e-3 | 3 of 3 | edge | cut sagittal, field 0, frequencyPerMm 10 |
| optiland-wave – wave | mtfFlagged.maxAbs | 0 | 2 of 3 | edge | cut sagittal, field 5.00e-1, frequencyPerMm 10 |
| optiland-wave – wave | fields.compared [elements] | 4 | 3 of 3 | — | — |
| optiland-wave – wave | fields.flagged [elements] | 2 | 3 of 3 | — | — |
| optiland-wave – wave | fields.rimLost [elements] | 0 | 3 of 3 | — | — |
| optiland-wave – wave | fields.data [elements] | 3 | 3 of 3 | — | — |
| optiland-wave – wave | fields.unavailable [elements] | 0 | 3 of 3 | — | — |
| optiland-wave – wave | mtfOffAxis.maxAbs | 0 | 1 of 3 | polychromatic | cut sagittal, field 5.00e-1, frequencyPerMm 10 |

By run, each pair with its verdict and the judged metric that is largest against its tolerance, with the number of the run's requests it was measured in:

| Run | Requests | lv – optiland | lv – optiland-wave | lv – wave | optiland – optiland-wave | optiland – wave | optiland-wave – wave |
|---|---|---|---|---|---|---|---|
| edge | 1 | RECORDED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure |
| beyond | 1 | ATTENTION: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure | ATTENTION: no judged figure |
| polychromatic | 1 | UNSUPPORTED: no judged figure | ATTENTION: no judged figure | RECORDED: no judged figure | UNSUPPORTED: no judged figure | UNSUPPORTED: no judged figure | ATTENTION: no judged figure |

#### edge

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.000 | ok | ok | ok | unconverged | 0 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | numerical | unconverged |
| 1 | 8.000 | ok | unconverged | ok | ok | 4 | data | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown | data | chief-landing-apart | data | chief-landing-apart |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8711 | 0.8672 | 7.81e-3 | ATTENTION | method | 7.81e-3 | ATTENTION | method | 3.91e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7422 | 0.7500 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | -7.81e-3 | SET ASIDE | numerical |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.6250 | 0.5000 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### beyond

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | method | two-methods |
| 0.5 | 4.000 | ok | ok | ok | unconverged | 0 | numerical | unconverged: a sampling did not settle; the difference is shown apart, in no band | numerical | unconverged | data | chief-landing-apart |
| 1 | 8.000 | ok | unconverged | ok | ok | 4 | data | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown | data | chief-landing-apart | data | chief-landing-apart |

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8672 | 7.81e-3 | ATTENTION | method | 7.81e-3 | ATTENTION | method | 7.81e-3 | ATTENTION | method |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.4961 | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | -3.91e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | 0 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | — | SET ASIDE | data |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | — | SET ASIDE | data |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | — | SET ASIDE | data |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | — | SET ASIDE | data |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | — | SET ASIDE | data |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | SET ASIDE | numerical | 0 | SET ASIDE | numerical | — | SET ASIDE | data |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | SET ASIDE | data | — | SET ASIDE | data | — | SET ASIDE | data |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

#### polychromatic

The three-way diffraction comparison, with FFT and raw wavefront columns. The difference of a row is lv − optiland-wave.
The three-way comparison shows LensVisualizer's sheared estimate (lv), the comparator's wave OTF on
LensVisualizer's rays (wave), optiland's FFT MTF (optiland), and the comparator's OTF of optiland's raw
Wavefront.get_data samples (optiland-wave). Each uses its own sampling; no column is an arbiter of another.
The last column uses the radial optical cosines of optiland's chief-ray reference
sphere and intensity as cell flux. A quarter-wave step or a move on grid doubling outside the field's band
sets its differences aside as numerical. The reference-sphere model and the FFT axes remain method choices.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 1.00e-3 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland-wave` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | wave | optiland | optiland-wave | Chief rays apart [mm] | Class | Reason | wave − optiland-wave: class | Reason | optiland − optiland-wave: class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | — | ok | 0 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 0.5 | 4.000 | ok | ok | — | ok | 5.00e-6 | method | two-methods: both engines stand by their curves; the difference is held to the attention band | method | two-methods | unsupported | optiland is unsupported (feature lines.polychromatic) |
| 1 | 8.000 | ok | unconverged | — | ok | 4 | data | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown | data | chief-landing-apart | unsupported | optiland is unsupported (feature lines.polychromatic) |

On several lines optiland-wave is the comparator's sum of complex OTFs of optiland's raw wavefronts,
one wavefront.native call per line, evaluated at the requested frequencies. Each line is phase-shifted by
-2 pi nu times its chief landing's offset from line 0's chief landing, weighted by its case weight times
transmitted flux, and added before the modulus. The optiland FFT column remains unsupported on several lines.

Several-line fields use the chief-landing sorting limit 1.00e-3 mm from the policy.
The landings identify the field: LV's shared chief launch and optiland's line-0 chief are different rays;
a common reference point does not change the modulus.

| Field | Cut | Cycles/mm | lv | wave | optiland | optiland-wave | lv − optiland-wave | Status | Class | wave − optiland-wave | Status | Class | optiland − optiland-wave | Status | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | — | 0.8672 | 7.81e-3 | ATTENTION | method | 7.81e-3 | ATTENTION | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.8750 | 0.8750 | — | 0.8750 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | — | 0.8750 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | — | 0.8750 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | — | 0.7500 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | — | 0.5000 | 0 | RECORDED | method | 0 | RECORDED | method | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | — | 0.8750 | — | SET ASIDE | data | — | SET ASIDE | data | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | — | 0.7500 | — | SET ASIDE | data | — | SET ASIDE | data | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | — | 0.5000 | — | SET ASIDE | data | — | SET ASIDE | data | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8750 | 0.8750 | — | 0.8750 | — | SET ASIDE | data | — | SET ASIDE | data | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7500 | 0.7500 | — | 0.7500 | — | SET ASIDE | data | — | SET ASIDE | data | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.5000 | 0.5000 | — | 0.5000 | — | SET ASIDE | data | — | SET ASIDE | data | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

## Marked

Every request of a rung that is only written down whose two engines differ by more than an attention band,
with each figure above its band. A band is a width for attention; nothing here is a failure.

| Rung | Run | Field | Pair | Figures above their bands |
|---|---|---|---|---|
| r6c | edge | — | lv – optiland-wave | chiefLanding.maxAbs 4 (band 9.77e-4) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | edge | — | optiland – optiland-wave | chiefLanding.maxAbs 4 (band 9.77e-4) at field 1 |
| r6c | edge | — | optiland-wave – wave | chiefLanding.maxAbs 4 (band 9.77e-4) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | beyond | — | lv – optiland | chiefLanding.maxAbs 1.95e-3 (band 9.77e-4) at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r6c | beyond | — | lv – optiland-wave | chiefLanding.maxAbs 4 (band 9.77e-4) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | beyond | — | optiland – optiland-wave | chiefLanding.maxAbs 4 (band 9.77e-4) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | beyond | — | optiland – wave | chiefLanding.maxAbs 1.95e-3 (band 9.77e-4) at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 50 |
| r6c | beyond | — | optiland-wave – wave | chiefLanding.maxAbs 4 (band 9.77e-4) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | polychromatic | — | lv – optiland-wave | chiefLanding.maxAbs 4 (band 1.00e-3) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |
| r6c | polychromatic | — | optiland-wave – wave | chiefLanding.maxAbs 4 (band 1.00e-3) at field 1; mtfOnAxis.maxAbs 7.81e-3 (band 3.91e-3) at cut sagittal, field 0, frequencyPerMm 10 |

## Not covered

What this comparison does not show, whatever its verdicts:

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.
- A polychromatic curve of optiland's FFT class. It gives a one-line modulus, so several lines have no FFT row in R5 or R6c. R6c's external counterpart is the comparator's complex sum of optiland's raw wavefronts; its synthetic sum proof checks the declared weighting and phase convention, not physical spectral fidelity.
- optiland's geometric MTF takes no injected rays either. Its rays are an even grid on the stop surface, out to the clip radius; LensVisualizer's are a lattice across the entrance beam; neither is weighted by direction cosine. Rung R5g is recorded and never gated: a difference of the two pupil samplings is written down, not explained.
- The bins of optiland's geometric MTF. On one line optiland's curve is of landings counted into bins, and a field whose bins move a value by more than a band has no optiland curve. On several lines the sum over optiland's landings is the worker's, without bins, about the axis point of the image plane; LensVisualizer's is about a chief ray's landing.
- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom positions between the two ends, and finite conjugates other than the states a run names.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.
