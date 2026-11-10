# Comparison report: r5-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r5-stand-ins |
| Contract version | 1.0 |
| Limits file | v1 |

### Engines

| Engine | Status | Version |
|---|---|---|
| lv | available | 1 |
| optiland | available | 1 |
| wave-mtf-of-lv-rays | available | 1 |

### Runs

| Run | Status |
|---|---|
| edge | run |
| beyond | run |
| polychromatic | run |

## Verdict summary

No pair is Fail or Error, of 15 compared.

| Verdict | against the reference | every pair |
|---|---|---|
| Pass: within limit | 0 | 0 |
| Fail: beyond limit | 0 | 0 |
| Side by side | 4 | 5 |
| Side by side, worth a look | 1 | 2 |
| Not computed | 1 | 2 |
| Not judged (an earlier check failed) | 0 | 0 |
| Error | 0 | 0 |

## Support matrix

| Run | Check | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|---|
| edge | mtf-vs-optiland-fft | ok | ok | ok |
| beyond | mtf-vs-optiland-fft | ok | ok | ok |
| polychromatic | mtf-vs-optiland-fft | ok | unsupported: feature lines.polychromatic | ok |

## Results

### edge

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`

Quantity `mtf.native`: each engine's own method; side by side, no limit.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | mtfRimLost.maxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | mtfFlagged.maxAbs | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 0 | 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 10 | 1.25e-1 at cut sagittal, field 1, frequencyPerMm 50 | 2 | 0 | 1 | 0 | 0 | — | RECORDED | field 1: method, rim-rays-lost (scalar-fft-mtf lost 1 rim rays) |
| wave-mtf-of-lv-rays | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | — | 2 | 1 | 0 | 0 | 0 | 0 at cut sagittal, field 1, frequencyPerMm 10 | RECORDED | field 1: numerical, unconverged (hopkins-autocorrelation: unconverged (undersampled)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|
| lv | — | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | — | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) |
| wave-mtf-of-lv-rays | RECORDED (chiefLanding.maxAbs 0 at field 0) | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | — |

The engines' own MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a limit.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland` comes to Side by side; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | wave-mtf-of-lv-rays | Chief rays apart [mm] | Rim rays lost | Rim rays from chief ray [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | 0 | 0 | — | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 0.5 | 4.000 | ok | ok | ok | 0 | 0 | — | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 1 | 8.000 | ok | ok | unconverged | 0 | 1 | 4.50e0 | the methods differ | rim-rays-lost: an engine calibrated a frequency axis with a rim ray that was lost; the difference is shown apart, in no review band |

| Field | Cut | Cycles/mm | lv | optiland | wave-mtf-of-lv-rays | lv − optiland | Status | Class |
|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8711 | 0.8750 | 3.91e-3 | Side by side | the methods differ |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0.5 | tangential | 30 | 0.7500 | 0.7422 | 0.7500 | 7.81e-3 | Side by side | the methods differ |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | the methods differ |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | the methods differ |
| 1 | sagittal | 50 | 0.5000 | 0.6250 | 0.5000 | -1.25e-1 | Set aside | the methods differ |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | the methods differ |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | the methods differ |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | the methods differ |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|
| field[0] | 0 | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 1 | 1 | 1 |
| fieldAngleDeg[0] | 0 | 0 | 0 |
| fieldAngleDeg[1] | 4 | 4 | 4 |
| fieldAngleDeg[2] | 8 | 8 | 8 |
| imageHeightMm[0] | 0 | 0 | 0 |
| imageHeightMm[1] | 8 | 8 | 8 |
| imageHeightMm[2] | 16 | 16 | 16 |
| lineWavelengthNm[0] | 5.87561800e2 | 5.87561800e2 | 5.87561800e2 |
| numRays[0] | — | 256 | — |
| numRays[1] | — | 256 | — |
| numRays[2] | — | 256 | — |
| rimLandingSpreadMm[0] | — | not finite | — |
| rimLandingSpreadMm[1] | — | not finite | — |
| rimLandingSpreadMm[2] | — | 4.50000000e0 | — |
| rimRaysLost[0] | — | 0 | — |
| rimRaysLost[1] | — | 0 | — |
| rimRaysLost[2] | — | 1 | — |
| settled[0] | 1 | 1 | 1 |
| settled[1] | 1 | 1 | 1 |
| settled[2] | 1 | 1 | 0 |

### beyond

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`

Quantity `mtf.native`: each engine's own method; side by side, no limit.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOffAxis.firstStepMaxAbs | mtfOnAxis.maxAbs (band 3.91e-3) | mtfOnAxis.firstStepMaxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | mtfFlagged.maxAbs | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 1.95e-3 at field 5.00e-1 | 1.95e-3 at cut tangential, field 1, frequencyPerMm 70 | 0 at cut sagittal, field 1, frequencyPerMm 10 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50 | 2 | 0 | 0 | 1 | 0 | — | ATTENTION | chiefLanding.maxAbs 1.95e-3 is outside its attention band 9.77e-4 at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 is outside its attention band 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50; judged with scalar-fft-mtf at its step fft512; the figures of the first answers are beside them; field 0.5: data, chief-landing-apart (the chief rays land 1.95e-3 mm apart) |
| wave-mtf-of-lv-rays | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | — | 0 at cut sagittal, field 0, frequencyPerMm 10 | — | 2 | 1 | 0 | 0 | 0 | 0 at cut sagittal, field 1, frequencyPerMm 10 | RECORDED | field 1: numerical, unconverged (hopkins-autocorrelation: unconverged (undersampled)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|
| lv | — | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | — | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) |
| wave-mtf-of-lv-rays | RECORDED (chiefLanding.maxAbs 0 at field 0) | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | — |

The engines' own MTF, side by side. The difference of a row is lv − optiland fft512.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a limit.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland` comes to Side by side, worth a look; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | optiland fft512 | wave-mtf-of-lv-rays | Chief rays apart [mm] | Rim rays lost | Rim rays from chief ray [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | 0 | — | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 0.5 | 4.000 | ok | ok | ok | ok | 1.95e-3 | 0 | — | the inputs differ | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown |
| 1 | 8.000 | ok | ok | ok | unconverged | 0 | 0 | — | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |

| Field | Cut | Cycles/mm | lv | optiland | optiland fft512 | wave-mtf-of-lv-rays | lv − optiland fft512 | Status | Class |
|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0 | sagittal | 50 | 0.5000 | 0.4961 | 0.4961 | 0.5000 | 3.91e-3 | Side by side, worth a look | the methods differ |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | Set aside | the inputs differ |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | Set aside | the inputs differ |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | Set aside | the inputs differ |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | Set aside | the inputs differ |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | Set aside | the inputs differ |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | Set aside | the inputs differ |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|
| field[0] | 0 | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 1 | 1 | 1 |
| field#fft512[0] | — | 0 | — |
| field#fft512[1] | — | 5.00000000e-1 | — |
| field#fft512[2] | — | 1 | — |
| fieldAngleDeg[0] | 0 | 0 | 0 |
| fieldAngleDeg[1] | 4 | 4 | 4 |
| fieldAngleDeg[2] | 8 | 8 | 8 |
| fieldAngleDeg#fft512[0] | — | 0 | — |
| fieldAngleDeg#fft512[1] | — | 4 | — |
| fieldAngleDeg#fft512[2] | — | 8 | — |
| imageHeightMm[0] | 0 | 0 | 0 |
| imageHeightMm[1] | 8 | 8.00195313e0 | 8 |
| imageHeightMm[2] | 16 | 16 | 16 |
| imageHeightMm#fft512[0] | — | 0 | — |
| imageHeightMm#fft512[1] | — | 8.00195313e0 | — |
| imageHeightMm#fft512[2] | — | 16 | — |
| lineWavelengthNm[0] | 5.87561800e2 | 5.87561800e2 | 5.87561800e2 |
| lineWavelengthNm#fft512[0] | — | 5.87561800e2 | — |
| numRays[0] | — | 256 | — |
| numRays[1] | — | 256 | — |
| numRays[2] | — | 256 | — |
| numRays#fft512[0] | — | 512 | — |
| numRays#fft512[1] | — | 512 | — |
| numRays#fft512[2] | — | 512 | — |
| rimRaysLost[0] | — | 0 | — |
| rimRaysLost[1] | — | 0 | — |
| rimRaysLost[2] | — | 0 | — |
| rimRaysLost#fft512[0] | — | 0 | — |
| rimRaysLost#fft512[1] | — | 0 | — |
| rimRaysLost#fft512[2] | — | 0 | — |
| settled[0] | 1 | 1 | 1 |
| settled[1] | 1 | 1 | 1 |
| settled[2] | 1 | 1 | 0 |
| settled#fft512[0] | — | 1 | — |
| settled#fft512[1] | — | 1 | — |
| settled#fft512[2] | — | 1 | — |

### polychromatic

#### MTF beside optiland's FFT MTF — `mtf-vs-optiland-fft`

Quantity `mtf.native`: each engine's own method; side by side, no limit.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | mtfFlagged.maxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | — | — | — | — | — | — | — | — | — | UNSUPPORTED | optiland is unsupported (feature lines.polychromatic) |
| wave-mtf-of-lv-rays | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | 0 at cut sagittal, field 1, frequencyPerMm 10 | 2 | 1 | 0 | 0 | 0 | RECORDED | field 1: numerical, unconverged (hopkins-autocorrelation: unconverged (undersampled)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|
| lv | — | UNSUPPORTED | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | UNSUPPORTED | — | UNSUPPORTED |
| wave-mtf-of-lv-rays | RECORDED (chiefLanding.maxAbs 0 at field 0) | UNSUPPORTED | — |

The engines' own MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a limit.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

`lv` against `optiland` is Not computed: optiland is unsupported (feature lines.polychromatic).

| Field | Angle [deg] | lv | optiland | wave-mtf-of-lv-rays | Chief rays apart [mm] | Rim rays lost | Rim rays from chief ray [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | — | ok | — | — | — | — | — |
| 0.5 | 4.000 | ok | — | ok | — | — | — | — | — |
| 1 | 8.000 | ok | — | unconverged | — | — | — | — | — |

| Field | Cut | Cycles/mm | lv | optiland | wave-mtf-of-lv-rays | lv − optiland | Status | Class |
|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | — | 0.8750 | — | Not computed | not computed by one engine |
| 0 | sagittal | 30 | 0.7500 | — | 0.7500 | — | Not computed | not computed by one engine |
| 0 | sagittal | 50 | 0.5000 | — | 0.5000 | — | Not computed | not computed by one engine |
| 0 | tangential | 10 | 0.8750 | — | 0.8750 | — | Not computed | not computed by one engine |
| 0 | tangential | 30 | 0.7500 | — | 0.7500 | — | Not computed | not computed by one engine |
| 0 | tangential | 50 | 0.5000 | — | 0.5000 | — | Not computed | not computed by one engine |
| 0.5 | sagittal | 10 | 0.8750 | — | 0.8750 | — | Not computed | not computed by one engine |
| 0.5 | sagittal | 30 | 0.7500 | — | 0.7500 | — | Not computed | not computed by one engine |
| 0.5 | sagittal | 50 | 0.5000 | — | 0.5000 | — | Not computed | not computed by one engine |
| 0.5 | tangential | 10 | 0.8750 | — | 0.8750 | — | Not computed | not computed by one engine |
| 0.5 | tangential | 30 | 0.7500 | — | 0.7500 | — | Not computed | not computed by one engine |
| 0.5 | tangential | 50 | 0.5000 | — | 0.5000 | — | Not computed | not computed by one engine |
| 1 | sagittal | 10 | 0.8750 | — | 0.8750 | — | Not computed | not computed by one engine |
| 1 | sagittal | 30 | 0.7500 | — | 0.7500 | — | Not computed | not computed by one engine |
| 1 | sagittal | 50 | 0.5000 | — | 0.5000 | — | Not computed | not computed by one engine |
| 1 | tangential | 10 | 0.8750 | — | 0.8750 | — | Not computed | not computed by one engine |
| 1 | tangential | 30 | 0.7500 | — | 0.7500 | — | Not computed | not computed by one engine |
| 1 | tangential | 50 | 0.5000 | — | 0.5000 | — | Not computed | not computed by one engine |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | wave-mtf-of-lv-rays |
|---|---|---|---|
| field[0] | 0 | — | 0 |
| field[1] | 5.00000000e-1 | — | 5.00000000e-1 |
| field[2] | 1 | — | 1 |
| fieldAngleDeg[0] | 0 | — | 0 |
| fieldAngleDeg[1] | 4 | — | 4 |
| fieldAngleDeg[2] | 8 | — | 8 |
| imageHeightMm[0] | 0 | — | 0 |
| imageHeightMm[1] | 8 | — | 8 |
| imageHeightMm[2] | 16 | — | 16 |
| lineWavelengthNm[0] | 5.87561800e2 | — | 5.87561800e2 |
| settled[0] | 1 | — | 1 |
| settled[1] | 1 | — | 1 |
| settled[2] | 1 | — | 0 |

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

Each pair of engines that answered one request gets one verdict. The verdict summary shows its label; the other
tables of this report show its stored value. This is each label, its stored value and what it means:

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

The hashes that tell one version from another: of the suite file and of the limits file; of each engine's code
and, for an engine of this tool's own, of this tool's code behind it; of each run's lens state; and of each
request a section of the results is of.

| Identifier | Value |
|---|---|
| Suite file | 2683eeb778d1dbede78479314c82c226901206a79c0675f76566a26c181d231f |
| Limits file | d7fcac99ad2089a29efc4031c3134c3777e39cf1afd4d85ef9b90cf57d1c54d2 |

| Engine | Engine code |
|---|---|
| lv | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |
| optiland | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |
| wave-mtf-of-lv-rays | f726f40bc7f30ada0156f055e3ecc24b6c8a629d916291e451c6ad946abeeb7c |

| Run | Lens state |
|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 |

| Run | Check | Request |
|---|---|---|
| edge | mtf-vs-optiland-fft | 62b036f845249e3d2d8428a1a806c9aaa438913be7ae4c4dd572741629152c70 |
| beyond | mtf-vs-optiland-fft | 1a8f8a4b342f975b6dafd04cf4f86ace69a545dd7d72608495f2e3041cab0b02 |
| polychromatic | mtf-vs-optiland-fft | 4b1a7a073e8806946d93ff3376dafe90cae86f487c5bb13d18dd24922e129561 |
