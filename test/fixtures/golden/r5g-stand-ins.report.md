# Comparison report: r5g-stand-ins

## Inputs

| Input | Value |
|---|---|
| Suite | r5g-stand-ins |
| Suite hash | 0b893087636f1fc875c66610f77a58553ae02d065d110fb089f1d7f81db029e9 |
| Contract version | 1.0 |
| Limits file | v1 |
| Limits file hash | 366eeb007dfd32760617cec0f4c81f8391f64ecc2fd7a977d44f0073791034d6 |

### Engines

| Engine | Status | Version | Engine code |
|---|---|---|---|
| lv | available | 1 | e446589a9d2d1f032334b5e798670d49c6268734494645c2a0f45c4a5bc007a2 |
| optiland | available | 1 | 5b42de3b00b5524489ff7d64c6f9c2d9fd6d53eb0f33fb98439c766aa9b33d31 |
| replay-of-lv-mtf | available | 1 | 3425387646473bbf88d9c0bafc74a9879926834022d6156fc113ca1db7568666 |

### Runs

| Run | Lens state | Status |
|---|---|---|
| edge | 0318018e2bf0d3700b9594802bda35d77b49a9451eba43d7ea4f87bb49d7f1f8 | run |
| beyond | fd9331265b562f1702ee981c3415e32c8d3e89e98546901db15418dec6cac99a | run |
| polychromatic | f1a1f1bcf37a53d35013b1e6f15df51172e5291f3a76ec9e05aa5fc8a2d87625 | run |

## Verdict summary

No pair is Fail or Error, of 15 compared.

| Verdict | reference-vs-each | pairwise |
|---|---|---|
| PASS | 0 | 0 |
| FAIL | 0 | 0 |
| RECORDED | 4 | 5 |
| ATTENTION | 2 | 4 |
| UNSUPPORTED | 0 | 0 |
| BLOCKED | 0 | 0 |
| ERROR | 0 | 0 |

## Support matrix

| Run | Check | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|---|
| edge | geometric-mtf-vs-optiland | ok | ok | ok |
| beyond | geometric-mtf-vs-optiland | ok | ok | ok |
| polychromatic | geometric-mtf-vs-optiland | ok | ok | ok |

## Results

### edge

#### Geometric MTF beside optiland's — `geometric-mtf-vs-optiland`

Quantity `mtf.native`: each engine's own method; side by side, no limit. Request `98f0ae72937115eef465f68726347ab34dcc59b0f150f09c45a9a73e47cb0f08`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 0 | 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 10 | 2 | 0 | 0 | 0 | 1 | RECORDED | field 1: unsupported, no-curve (geometric-mtf: unavailable (frequency-beyond-bins)) |
| replay-of-lv-mtf | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | 3 | 0 | 0 | 0 | 0 | RECORDED |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|
| lv | — | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | — | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) |
| replay-of-lv-mtf | RECORDED (chiefLanding.maxAbs 0 at field 0) | RECORDED (mtfOffAxis.maxAbs 7.81e-3 at cut tangential, field 5.00e-1, frequencyPerMm 30) | — |

The engines' own geometric MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the
pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a
limit.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland` comes to Side by side; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | replay-of-lv-mtf | lv: across | lv: last change | optiland: across | optiland: last change | Chief rays apart [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | 64 | 1.95e-3 | 256 | 9.77e-4 | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 0.5 | 4.000 | ok | ok | ok | 64 | 1.95e-3 | 256 | 9.77e-4 | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 1 | 8.000 | ok | no curve | ok | 64 | 1.95e-3 | 256 | 9.77e-4 | 0 | not computed by one engine | no-curve: an engine has no curve of the field |

optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice
across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. At one wavelength
optiland counts its landings into bins, and gives a curve only where the bins move it by less than its convergence
band (0.005 on the axis, 0.01 off it).
Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its
curves moved between its last two samplings, which is that engine's own measure and judges no other.

| Field | Cut | Cycles/mm | lv | optiland | replay-of-lv-mtf | lv − optiland | Status | Class |
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

| Value | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|
| binningMaxDelta[0] | — | 2.44140625e-4 | — |
| binningMaxDelta[1] | — | 2.44140625e-4 | — |
| binningMaxDelta[2] | — | 3.12500000e-2 | — |
| coarseNumRays[0] | — | 128 | — |
| coarseNumRays[1] | — | 128 | — |
| coarseNumRays[2] | — | 128 | — |
| field[0] | 0 | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 1 | 1 | 1 |
| fieldAngleDeg[0] | 0 | 0 | 0 |
| fieldAngleDeg[1] | 4 | 4 | 4 |
| fieldAngleDeg[2] | 8 | 8 | 8 |
| gridSize[0] | 64 | — | — |
| gridSize[1] | 64 | — | — |
| gridSize[2] | 64 | — | — |
| imageHeightMm[0] | 0 | 0 | 0 |
| imageHeightMm[1] | 8 | 8 | 8 |
| imageHeightMm[2] | 16 | 16 | 16 |
| lineWavelengthNm[0] | 5.87561800e2 | 5.87561800e2 | 5.87561800e2 |
| maxDelta[0] | 1.95312500e-3 | 9.76562500e-4 | — |
| maxDelta[1] | 1.95312500e-3 | 9.76562500e-4 | — |
| maxDelta[2] | 1.95312500e-3 | 9.76562500e-4 | — |
| numRays[0] | — | 256 | — |
| numRays[1] | — | 256 | — |
| numRays[2] | — | 256 | — |
| settled[0] | 1 | 1 | 1 |
| settled[1] | 1 | 1 | 1 |
| settled[2] | 1 | not finite | 1 |

### beyond

#### Geometric MTF beside optiland's — `geometric-mtf-vs-optiland`

Quantity `mtf.native`: each engine's own method; side by side, no limit. Request `efb7d3cbde68bf207c46c0168019567e98675bd46446a7cab34f1df6a76f2459`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | mtfOnAxis.firstStepMaxAbs | mtfFlagged.maxAbs | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 1.95e-3 at field 5.00e-1 | — | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50 | 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50 | 6.25e-2 at cut tangential, field 1, frequencyPerMm 70 | 1 | 1 | 0 | 1 | 0 | ATTENTION | chiefLanding.maxAbs 1.95e-3 is outside its attention band 9.77e-4 at field 5.00e-1; mtfOnAxis.maxAbs 3.91e-3 is outside its attention band 3.91e-3 at cut sagittal, field 0, frequencyPerMm 50; mtfOffAxis.maxAbs was not measured: no field off the axis is in a band; judged with geometric-mtf at its step geo512; the figures of the first answers are beside them; field 0.5: data, chief-landing-apart (the chief rays land 1.95e-3 mm apart); field 1: numerical, unconverged (geometric-mtf: unconverged (sampling-not-settled)) |
| replay-of-lv-mtf | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | — | — | 3 | 0 | 0 | 0 | 0 | RECORDED |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|
| lv | — | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | — | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) |
| replay-of-lv-mtf | RECORDED (chiefLanding.maxAbs 0 at field 0) | ATTENTION (chiefLanding.maxAbs 1.95e-3 at field 5.00e-1) | — |

The engines' own geometric MTF, side by side. The difference of a row is lv − optiland geo512.
Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the
pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a
limit.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland` comes to Side by side, worth a look; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | optiland geo512 | replay-of-lv-mtf | lv: across | lv: last change | optiland geo512: across | optiland geo512: last change | Chief rays apart [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | ok | 64 | 1.95e-3 | 512 | 4.88e-4 | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 0.5 | 4.000 | ok | ok | ok | ok | 64 | 1.95e-3 | 512 | 4.88e-4 | 1.95e-3 | the inputs differ | chief-landing-apart: the chief rays land further apart than the limit: two image points; no difference is shown |
| 1 | 8.000 | ok | unconverged | unconverged | ok | 64 | 1.95e-3 | 512 | 4.88e-4 | 0 | not converged | unconverged: a sampling did not settle; the difference is shown apart, in no review band |

optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice
across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. At one wavelength
optiland counts its landings into bins, and gives a curve only where the bins move it by less than its convergence
band (0.005 on the axis, 0.01 off it).
Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its
curves moved between its last two samplings, which is that engine's own measure and judges no other.

| Field | Cut | Cycles/mm | lv | optiland | optiland geo512 | replay-of-lv-mtf | lv − optiland geo512 | Status | Class |
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
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | not converged |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | not converged |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | not converged |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0.8750 | 0 | Set aside | not converged |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0.7500 | 0 | Set aside | not converged |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0.5000 | 0 | Set aside | not converged |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|
| binningMaxDelta[0] | — | 2.44140625e-4 | — |
| binningMaxDelta[1] | — | 2.44140625e-4 | — |
| binningMaxDelta[2] | — | 2.44140625e-4 | — |
| binningMaxDelta#geo512[0] | — | 2.44140625e-4 | — |
| binningMaxDelta#geo512[1] | — | 2.44140625e-4 | — |
| binningMaxDelta#geo512[2] | — | 2.44140625e-4 | — |
| coarseNumRays[0] | — | 128 | — |
| coarseNumRays[1] | — | 128 | — |
| coarseNumRays[2] | — | 128 | — |
| coarseNumRays#geo512[0] | — | 256 | — |
| coarseNumRays#geo512[1] | — | 256 | — |
| coarseNumRays#geo512[2] | — | 256 | — |
| field[0] | 0 | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 1 | 1 | 1 |
| field#geo512[0] | — | 0 | — |
| field#geo512[1] | — | 5.00000000e-1 | — |
| field#geo512[2] | — | 1 | — |
| fieldAngleDeg[0] | 0 | 0 | 0 |
| fieldAngleDeg[1] | 4 | 4 | 4 |
| fieldAngleDeg[2] | 8 | 8 | 8 |
| fieldAngleDeg#geo512[0] | — | 0 | — |
| fieldAngleDeg#geo512[1] | — | 4 | — |
| fieldAngleDeg#geo512[2] | — | 8 | — |
| gridSize[0] | 64 | — | — |
| gridSize[1] | 64 | — | — |
| gridSize[2] | 64 | — | — |
| imageHeightMm[0] | 0 | 0 | 0 |
| imageHeightMm[1] | 8 | 8.00195313e0 | 8 |
| imageHeightMm[2] | 16 | 16 | 16 |
| imageHeightMm#geo512[0] | — | 0 | — |
| imageHeightMm#geo512[1] | — | 8.00195313e0 | — |
| imageHeightMm#geo512[2] | — | 16 | — |
| lineWavelengthNm[0] | 5.87561800e2 | 5.87561800e2 | 5.87561800e2 |
| lineWavelengthNm#geo512[0] | — | 5.87561800e2 | — |
| maxDelta[0] | 1.95312500e-3 | 9.76562500e-4 | — |
| maxDelta[1] | 1.95312500e-3 | 9.76562500e-4 | — |
| maxDelta[2] | 1.95312500e-3 | 9.76562500e-4 | — |
| maxDelta#geo512[0] | — | 4.88281250e-4 | — |
| maxDelta#geo512[1] | — | 4.88281250e-4 | — |
| maxDelta#geo512[2] | — | 4.88281250e-4 | — |
| numRays[0] | — | 256 | — |
| numRays[1] | — | 256 | — |
| numRays[2] | — | 256 | — |
| numRays#geo512[0] | — | 512 | — |
| numRays#geo512[1] | — | 512 | — |
| numRays#geo512[2] | — | 512 | — |
| settled[0] | 1 | 1 | 1 |
| settled[1] | 1 | 1 | 1 |
| settled[2] | 1 | 0 | 1 |
| settled#geo512[0] | — | 1 | — |
| settled#geo512[1] | — | 1 | — |
| settled#geo512[2] | — | 0 | — |

### polychromatic

#### Geometric MTF beside optiland's — `geometric-mtf-vs-optiland`

Quantity `mtf.native`: each engine's own method; side by side, no limit. Request `a56d4c883eb4e7deb65c2231e62c64049b47b0a45c088f55a1b3dbed1b967634`.

Reference vs each, against `lv`:

| Engine | chiefLanding.maxAbs (band 9.77e-4 mm) | mtfOffAxis.maxAbs (band 7.81e-3) | mtfOnAxis.maxAbs (band 3.91e-3) | fields.compared [elements] | fields.flagged [elements] | fields.rimLost [elements] | fields.data [elements] | fields.unavailable [elements] | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| optiland | 0 at field 0 | 1.56e-2 at cut sagittal, field 5.00e-1, frequencyPerMm 30 | 0 at cut sagittal, field 0, frequencyPerMm 10 | 3 | 0 | 0 | 0 | 0 | ATTENTION | mtfOffAxis.maxAbs 1.56e-2 is outside its attention band 7.81e-3 at cut sagittal, field 5.00e-1, frequencyPerMm 30 |
| replay-of-lv-mtf | 0 at field 0 | 0 at cut sagittal, field 5.00e-1, frequencyPerMm 10 | 0 at cut sagittal, field 0, frequencyPerMm 10 | 3 | 0 | 0 | 0 | 0 | RECORDED |  |

Pairwise, the verdict of each two engines and the metric nearest to or furthest past its limit:

| Engine | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|
| lv | — | ATTENTION (mtfOffAxis.maxAbs 1.56e-2 at cut sagittal, field 5.00e-1, frequencyPerMm 30) | RECORDED (chiefLanding.maxAbs 0 at field 0) |
| optiland | ATTENTION (mtfOffAxis.maxAbs 1.56e-2 at cut sagittal, field 5.00e-1, frequencyPerMm 30) | — | ATTENTION (mtfOffAxis.maxAbs 1.56e-2 at cut sagittal, field 5.00e-1, frequencyPerMm 30) |
| replay-of-lv-mtf | RECORDED (chiefLanding.maxAbs 0 at field 0) | ATTENTION (mtfOffAxis.maxAbs 1.56e-2 at cut sagittal, field 5.00e-1, frequencyPerMm 30) | — |

The engines' own geometric MTF, side by side. The difference of a row is lv − optiland.
Each column is one engine's own estimate of the geometric MTF, of its own rays through its own sampling of the
pupil, without diffraction. No column is a reference for another, and no difference in this table is held to a
limit.

Review bands: 3.91e-3 on the axis, 7.81e-3 off it. Two chief rays that land more than 9.77e-4 mm apart
are of two fields.

Over every frequency of the request `lv` against `optiland` comes to Side by side, worth a look; a row below has the
status of its own frequency.

| Field | Angle [deg] | lv | optiland | replay-of-lv-mtf | lv: across | lv: last change | optiland: across | optiland: last change | Chief rays apart [mm] | Class | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.000 | ok | ok | ok | 64 | 1.95e-3 | — | — | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 0.5 | 4.000 | ok | ok | ok | 64 | 1.95e-3 | — | — | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |
| 1 | 8.000 | ok | ok | ok | 64 | 1.95e-3 | — | — | 0 | the methods differ | two-methods: both engines stand by their curves; the difference is set beside the review band |

optiland's rays are an even grid on the stop surface, out to its clip radius; LensVisualizer's are a lattice
across the entrance beam, refined by LensVisualizer; neither is weighted by direction cosine. At one wavelength
optiland counts its landings into bins, and gives a curve only where the bins move it by less than its convergence
band (0.005 on the axis, 0.01 off it).
Beside each engine's flag is its own sampling of the field: cells or rays across the pupil, and how far its
curves moved between its last two samplings, which is that engine's own measure and judges no other.

On several wavelengths the column of optiland is not a curve of optiland's own class, which is of one wavelength:
the rays and their landings are optiland's, one wavelength a call, and the sum over them, the wavelengths added
as complex numbers with their weights before the modulus is taken, is this tool's.

| Field | Cut | Cycles/mm | lv | optiland | replay-of-lv-mtf | lv − optiland | Status | Class |
|---|---|---|---|---|---|---|---|---|
| 0 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0.5 | sagittal | 30 | 0.7500 | 0.7656 | 0.7500 | -1.56e-2 | Side by side, worth a look | the methods differ |
| 0.5 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 0.5 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 0.5 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 0.5 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 1 | sagittal | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 1 | sagittal | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 1 | sagittal | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |
| 1 | tangential | 10 | 0.8750 | 0.8750 | 0.8750 | 0 | Side by side | the methods differ |
| 1 | tangential | 30 | 0.7500 | 0.7500 | 0.7500 | 0 | Side by side | the methods differ |
| 1 | tangential | 50 | 0.5000 | 0.5000 | 0.5000 | 0 | Side by side | the methods differ |

A review band is a width for attention, not a limit. A difference inside it was written down and says nothing
more; a difference outside it is worth a look and fails nothing.

Recorded values, as each engine reports them. They are listed and never judged:

The MTF values at every frequency of the request are in `report.json`.

| Value | lv | optiland | replay-of-lv-mtf |
|---|---|---|---|
| field[0] | 0 | 0 | 0 |
| field[1] | 5.00000000e-1 | 5.00000000e-1 | 5.00000000e-1 |
| field[2] | 1 | 1 | 1 |
| fieldAngleDeg[0] | 0 | 0 | 0 |
| fieldAngleDeg[1] | 4 | 4 | 4 |
| fieldAngleDeg[2] | 8 | 8 | 8 |
| gridSize[0] | 64 | — | — |
| gridSize[1] | 64 | — | — |
| gridSize[2] | 64 | — | — |
| imageHeightMm[0] | 0 | 0 | 0 |
| imageHeightMm[1] | 8 | 8 | 8 |
| imageHeightMm[2] | 16 | 16 | 16 |
| lineWavelengthNm[0] | 4.86132700e2 | 4.86132700e2 | 4.86132700e2 |
| lineWavelengthNm[1] | 5.87561800e2 | 5.87561800e2 | 5.87561800e2 |
| lineWavelengthNm[2] | 6.56272500e2 | 6.56272500e2 | 6.56272500e2 |
| maxDelta[0] | 1.95312500e-3 | — | — |
| maxDelta[1] | 1.95312500e-3 | — | — |
| maxDelta[2] | 1.95312500e-3 | — | — |
| settled[0] | 1 | 1 | 1 |
| settled[1] | 1 | 1 | 1 |
| settled[2] | 1 | 1 | 1 |

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

Each pair of engines that answered one request gets one verdict. A table of this report shows its stored value;
this is its label and what it means:

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
