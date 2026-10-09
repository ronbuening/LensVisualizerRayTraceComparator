# Comparison report: r5-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r5-stand-ins |
| Suite hash | 2683eeb778d1dbede78479314c82c226901206a79c0675f76566a26c181d231f |
| Contract version | 1.0 |
| Policy | rungs v1 |
| Policy hash | 98d2351601a94f80f1cf6be9cf1c0272a3f98573b7446c70e66db4edcdd8fa85 |

### Engines

| Engine | Status | Version | Fingerprint |
|---|---|---|---|
| lv | available | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |
| wave | available | 1 | a348558d728efd5c7b52a212b84aac868d7c2d5b1839c2f4a564dcd7f81d4f16 |

### Runs

| Run | Case | Status |
|---|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 | run |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a | run |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 | run |

## Verdict summary

No pair is FAIL or ERROR, of 15 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FLOOR | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 4 | 5 |
| ATTENTION | 1 | 2 |
| UNSUPPORTED | 1 | 2 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Rung | lv | optiland | wave |
|---|---|---|---|---|
| edge | r5 | ok | ok | ok |
| beyond | r5 | ok | ok | ok |
| polychromatic | r5 | ok | unsupported: feature lines.polychromatic | ok |

## Results

### edge

#### r5

Quantity `mtf.native`, compared independent-method, recorded. Request `62b036f845249e3d2d8428a1a806c9aaa438913be7ae4c4dd572741629152c70`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | mtfRimLost.maxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | mtfFlagged.maxAbs | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 0 | 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 10 | 1.25e-1 at cut sagittal, field 1, frequencyPerMm 50 | 2 | 0 | 1 | 0 | 0 | — | RECORDED | field 1: method, rim-rays-lost (scalar-fft-mtf lost 1 rim rays) |
| wave | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | — | 2 | 1 | 0 | 0 | 0 | 0 at cut sagittal, field 1, frequencyPerMm 10 | RECORDED | field 1: numerical, unconverged (hopkins-autocorrelation: unconverged (undersampled)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | wave |
|---|---|---|---|
| lv | — | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | — | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) |
| wave | RECORDED (chiefLanding.maxAbs 0 at field 0) | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | — |

The engines' own MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a tolerance.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland` is RECORDED; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | wave | Chief rays apart [mm] | Rim rays lost | Rim rays from chief ray [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | 0 | 0 | — | method | two-methods: both engines stand by their curves; the difference is held to the attention band |
| 0.5 | 4.000 | ok | ok | ok | 0 | 0 | — | method | two-methods: both engines stand by their curves; the difference is held to the attention band |
| 1 | 8.000 | ok | ok | unconverged | 0 | 1 | 4.50e0 | method | rim-rays-lost: an engine calibrated a frequency axis with a rim ray that was lost; the difference is shown apart, in no band |

| Field | Cut | Cycles/mm | lv | optiland | wave | lv − optiland | Status | Class |
|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8711 | 0.8750 | 3.91e-3 | RECORDED | method |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 0.5 | tangential | 30 | 0.7500 | 0.7422 | 0.7500 | 7.81e-3 | RECORDED | method |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | SET ASIDE | method |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | SET ASIDE | method |
| 1 | sagittal | 50 | 0.5000 | 0.6250 | 0.5000 | -1.25e-1 | SET ASIDE | method |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | SET ASIDE | method |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | SET ASIDE | method |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | SET ASIDE | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | wave |
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

#### r5

Quantity `mtf.native`, compared independent-method, recorded. Request `1a8f8a4b342f975b6dafd04cf4f86ace69a545dd7d72608495f2e3041cab0b02`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOffAxis.firstStepMaxAbs | mtfOnAxis.maxAbs (band 3.91e-3) | mtfOnAxis.firstStepMaxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | mtfFlagged.maxAbs | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 1.95e-3 at field 5.00e-1 | 1.95e-3 at cut tangential, field 1, frequencyPerMm 70 | 0 at cut sagittal, field 1, frequencyPerMm 10 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50 | 2 | 0 | 0 | 1 | 0 | — | ATTENTION | chiefLanding.maxAbs 1.95e-3 is outside its attention band 9.77e-4 at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 is outside its attention band 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50; judged with scalar-fft-mtf at its step fft512; the figures of the first answers are beside them; field 0.5: data, chief-landing-apart (the chief rays land 1.95e-3 mm apart) |
| wave | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | — | 0 at cut sagittal, field 0, frequencyPerMm 10 | — | 2 | 1 | 0 | 0 | 0 | 0 at cut sagittal, field 1, frequencyPerMm 10 | RECORDED | field 1: numerical, unconverged (hopkins-autocorrelation: unconverged (undersampled)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | wave |
|---|---|---|---|
| lv | — | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | — | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) |
| wave | RECORDED (chiefLanding.maxAbs 0 at field 0) | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | — |

The engines' own MTF, side by side. The difference of a row is lv − optiland fft512.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a tolerance.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

Over every frequency of the request `lv` against `optiland` is ATTENTION; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | optiland fft512 | wave | Chief rays apart [mm] | Rim rays lost | Rim rays from chief ray [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 0 | 0 | — | method | two-methods: both engines stand by their curves; the difference is held to the attention band |
| 0.5 | 4.000 | ok | ok | ok | ok | 1.95e-3 | 0 | — | data | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown |
| 1 | 8.000 | ok | ok | ok | unconverged | 0 | 0 | — | method | two-methods: both engines stand by their curves; the difference is held to the attention band |

| Field | Cut | Cycles/mm | lv | optiland | optiland fft512 | wave | lv − optiland fft512 | Status | Class |
|---|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 0 | sagittal | 50 | 0.5000 | 0.4961 | 0.4961 | 0.5000 | 3.91e-3 | ATTENTION | method |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | SET ASIDE | data |
| 0.5 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | SET ASIDE | data |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | SET ASIDE | data |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | — | SET ASIDE | data |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | — | SET ASIDE | data |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | — | SET ASIDE | data |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | RECORDED | method |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | RECORDED | method |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | RECORDED | method |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | wave |
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

#### r5

Quantity `mtf.native`, compared independent-method, recorded. Request `4b1a7a073e8806946d93ff3376dafe90cae86f487c5bb13d18dd24922e129561`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | mtfFlagged.maxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | — | — | — | — | — | — | — | — | — | UNSUPPORTED | optiland is unsupported (feature lines.polychromatic) |
| wave | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | 0 at cut sagittal, field 1, frequencyPerMm 10 | 2 | 1 | 0 | 0 | 0 | RECORDED | field 1: numerical, unconverged (hopkins-autocorrelation: unconverged (undersampled)) |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | wave |
|---|---|---|---|
| lv | — | UNSUPPORTED | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | UNSUPPORTED | — | UNSUPPORTED |
| wave | RECORDED (chiefLanding.maxAbs 0 at field 0) | UNSUPPORTED | — |

The engines' own MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the diffraction MTF, by its own method and its own sampling. No
column is a reference for another, and no difference in this table is held to a tolerance.

Attention bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land
more than 9.77e-4 mm apart are of two fields.

`lv` against `optiland` is UNSUPPORTED: optiland is unsupported (feature lines.polychromatic).

| Field | Angle [deg] | lv | optiland | wave | Chief rays apart [mm] | Rim rays lost | Rim rays from chief ray [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | — | ok | — | — | — | — | — |
| 0.5 | 4.000 | ok | — | ok | — | — | — | — | — |
| 1 | 8.000 | ok | — | unconverged | — | — | — | — | — |

| Field | Cut | Cycles/mm | lv | optiland | wave | lv − optiland | Status | Class |
|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | — | 0.8750 | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 30 | 0.7500 | — | 0.7500 | — | UNSUPPORTED | unsupported |
| 0 | sagittal | 50 | 0.5000 | — | 0.5000 | — | UNSUPPORTED | unsupported |
| 0 | tangential | 10 | 0.8750 | — | 0.8750 | — | UNSUPPORTED | unsupported |
| 0 | tangential | 30 | 0.7500 | — | 0.7500 | — | UNSUPPORTED | unsupported |
| 0 | tangential | 50 | 0.5000 | — | 0.5000 | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 10 | 0.8750 | — | 0.8750 | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 30 | 0.7500 | — | 0.7500 | — | UNSUPPORTED | unsupported |
| 0.5 | sagittal | 50 | 0.5000 | — | 0.5000 | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 10 | 0.8750 | — | 0.8750 | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 30 | 0.7500 | — | 0.7500 | — | UNSUPPORTED | unsupported |
| 0.5 | tangential | 50 | 0.5000 | — | 0.5000 | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 10 | 0.8750 | — | 0.8750 | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 30 | 0.7500 | — | 0.7500 | — | UNSUPPORTED | unsupported |
| 1 | sagittal | 50 | 0.5000 | — | 0.5000 | — | UNSUPPORTED | unsupported |
| 1 | tangential | 10 | 0.8750 | — | 0.8750 | — | UNSUPPORTED | unsupported |
| 1 | tangential | 30 | 0.7500 | — | 0.7500 | — | UNSUPPORTED | unsupported |
| 1 | tangential | 50 | 0.5000 | — | 0.5000 | — | UNSUPPORTED | unsupported |

A band is a width for attention, taken from a tolerance the plan withdrew. A difference inside it was written
down and says nothing more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | wave |
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

- optiland's FFT and Huygens MTF take no injected rays. An MTF of optiland's own is on optiland's own pupil grid, reference sphere and frequency axes, so rung R5 is recorded and never gated: it sets two methods side by side.
- The formation of a polychromatic MTF. optiland's FFT MTF is of one line and gives a modulus, so a run on several lines has no optiland row; its external counterpart is the comparator's estimator on optiland's wavefront, which is a later stage.
- Dispersion and white-light weighting. Every engine is handed the indices and the line weights LensVisualizer states; no glass catalog and no spectrum is checked against another.
- The choice of focus. A best-focus plane is LensVisualizer's own, handed to every engine as a plane; no engine searches for one of its own.
- The sizing of the stop. The stop radius, wide open and stopped down, is LensVisualizer's, by its own rule.
- Models of vignetting. Each engine clips rays at the apertures it is handed; how an engine's own MTF fills, samples and calibrates a clipped pupil is its method, and a difference that comes of it is written down, not explained.
- Zoom positions between the two ends, and finite conjugates other than the states a run names.
- Fields that an engine's own convergence test did not pass. Their figures are shown apart and enter no band.

## How to read this

Each pair of engines that answered one request gets one verdict.

| Verdict | Meaning |
|---|---|
| PASS | A gated rung: every judged metric is at or below its tolerance. |
| FLOOR | A gated rung: a judged metric is above its tolerance by the known numerical floor of one of the two engines. That engine is within the floor limit of the rung's arbiter, and no other engine sides with it against the arbiter; the note gives the figures, and names a witness that did not corroborate the arbiter. It counts as a pass. |
| FAIL | A gated rung: a judged metric is above its tolerance, or is not a number. |
| RECORDED | A recorded rung: the difference is written down. It is not a failure. |
| ATTENTION | A recorded rung: a metric is outside its attention band. It is worth a look and is not a failure. |
| UNSUPPORTED | One of the two engines cannot answer the request. That is an answer, not a failure. |
| BLOCKED | Both engines answered and the pair is not judged: an earlier rung, on which this one rests, failed for the same two engines on the same case. The failure is that rung's, and the note names it. |
| ERROR | One of the two engines gave no result, or the two results cannot be compared. |

Only FAIL and ERROR fail a comparison. FLOOR is a pass that is counted apart from PASS. RECORDED and ATTENTION
are not failures: a recorded rung compares methods that are expected to differ, and its numbers are kept to be
read, not to be gated. BLOCKED is not a second failure: two engines that built different systems would differ
in every rung after that one.

A limit is shown in the heading of its metric: `≤` is the tolerance of a gated rung, `band` the attention band
of a recorded one, and `floor ≤` how far the engine with a floor may be from the arbiter for a FLOOR. A metric
without a limit is shown and not judged. Where its name begins as a judged one's does, it stands beside that
one: `pupilZ.maxAbs`, the plain difference, beside `pupilZ.maxScaled`, the one on the scale that is judged.
Numbers have 3 significant digits, and a whole number, such as a count, is written in full.
A recorded value has 9 significant digits, or is a whole number in full, and is named with the index of its
element. `—` marks a place with nothing to compare, and `not finite` a number that is a NaN or an infinity.
The reference-vs-each table and the pairwise matrix judge a pair alike, so a pair that is in both has the same
verdict in both.

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
