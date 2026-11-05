# Validation matrix of benchmark

This matrix is rendered from the benchmark's two baselines alone, with no engine, clock or machine input. It has a row for each LensVisualizer analysis tab, a row of the foundation they stand on, and a row of the analyses LensVisualizer has no tab of.

## Inputs

| Input | Value |
|---|---|
| Suite | benchmark |
| Suite hash | ca12c885c2454c3cb1a8d0c54d51128a20c4919c2ceb84c3d03a7404cceb75fa |
| Policy | rungs v24 |
| Policy hash | be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889 |
| LensVisualizer commit | 25f65d4b4213a21392cbae92680134906049b2ad |
| LensVisualizer dirty | false |
| LensVisualizer engine closure | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b |
| LensVisualizer engine files | 184 |
| Declared runs | 96 |
| Configurations | 96 |

| Engine | Version | Fingerprint | Adapter revision |
|---|---|---|---|
| lv | 1 | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | afad9cb89bd9a25fbfa5ee0ec335b1e315481414b7ba41da2f906c28856010c5 |
| optiland | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | 98f36151b0cdd2d3d3f82013841899de85309b22012967de64bbba662217fbcb |
| optiland-wave | 0.6.2.post117+g4e893f53 | bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb | f6e596a0a856e4c27449919d31e73b446c909add6809cbfdfbdf8ae6718b818f |
| ref | 1 | b7d0684b593261d14a1dfebb903774775bbe481a07ae2955689644dc0ffd919e | 2225e342b4fd8539480e933e59a3ca95a8ae2beeb24f45972b55fd4e4a59d357 |
| replay | 1 | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | 99024448fdb11f7eb293d0e54cf8281dc5272c57c468beeb30d66bb53ecf3409 |
| wave | 1 | 4669921bae7179c7eddd220fa367e696eae7acec3a5a788d0ca90da632d3eb6b | 956fcaf5a64e0a0873c6514edd117b9d5002f92623e4f05f6c06faa409926182 |

## Rows

| Row | Gated rungs | Recorded rungs |
|---|---|---|
| Built system, first-order data, rays and optical path | r0, r1, r2, r3 | none |
| MTF | r4, r4f, r6a | r5, r5g, r6b, r6c |
| Coma and bokeh | r7a | r7b |
| Spherical aberration and axial colour | r8a | r8b |
| Distortion, lateral colour, pupils and breathing | r9a, r1 | r9b |
| Field curves and astigmatism | r10a | r10b |
| Vignetting and relative illumination | r11a | r11b |
| Summary and cardinal elements | r1 | r12b |
| Seidel sums, wavefront and Zernike fits (no LensVisualizer tab) | none | r13b, r14b |

A configuration is one named run of the benchmark with a case. A configuration pair is two engines on one configuration and rung; a request pair is two engines on one request. Request-pair counts count every request pair, including unsupported answers; configuration-pair counts count the gravest verdict of each configuration pair. R4 is in both baselines and counts once.

A gated rung holds two engines to the tolerances of the policy on the same input, and its verdicts are the ones the baseline holds.

A recorded rung sets two methods side by side with no tolerance and fails nothing: its counts say how many pairs were written down inside an attention band, outside one, or without an answer to set beside the other.

A rung marked in no baseline is run only where a run names it and is kept out of every baseline, so this matrix names its quantity and engines and gives no figure of it.

## Built system, first-order data, rays and optical path

The foundation of every tab: the system each engine builds from the case, its first-order data, and the hits, landings and optical paths of LensVisualizer's own MTF launch rays.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r0 | Built layout, shape, aperture, index and sampled sag | system.describe | lv, optiland, ref | 96 | 288 | 288 | 288 PASS | 288 PASS | every engine ok | baselines/benchmark.json |
| r1 | First-order quantities and pupils | paraxial.first-order | lv, optiland, ref | 96 | 288 | 288 | 288 PASS | 288 PASS | every engine ok | baselines/benchmark.json |
| r2 | Hits, directions, image landings and masks of identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 2592 | 2592 PASS | 288 PASS | every engine ok | baselines/benchmark.json |
| r3 | Optical path, path to image and chief-relative OPD of identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 2592 | 2592 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Not covered

- Folded paths and diffractive surfaces: the suites folded and diffractive have rays baselines of their own, outside the benchmark.

- The catalog beyond the benchmark: its baselines are a dated snapshot with a report of their own.

## MTF

LensVisualizer's MTF tab: the comparator's geometric and wave MTF of LensVisualizer's launch rays traced by each engine, LensVisualizer's own geometric MTF beside the replay of its sampling, and the engines' own MTF side by side.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r4 | Comparator geometric MTF on identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 864 | 864 PASS | 288 PASS | every engine ok | baselines/benchmark.json, baselines/benchmark.mtf.json |
| r4f | LV geometric MTF beside replay with LV's own sampling | mtf.native | lv, replay | 96 | 96 | 96 | 96 PASS | 96 PASS | every engine ok | baselines/benchmark.mtf.json |
| r6a | Comparator wave MTF on identical rays, in fields whose sampling settled | rays.trace | lv, optiland, ref | 96 | 288 | 864 | 864 PASS | 288 PASS | every engine ok | baselines/benchmark.mtf.json |

### Recorded

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r5 | LV diffraction MTF beside optiland FFT and the LV-ray wave estimate | mtf.native | lv, optiland, wave | 96 | 288 | 288 | 161 RECORDED, 31 ATTENTION, 96 UNSUPPORTED | 161 RECORDED, 31 ATTENTION, 96 UNSUPPORTED | optiland: 48 ok, 48 unsupported | baselines/benchmark.mtf.json |
| r5g | Geometric MTF on each method's own pupil sampling | mtf.native | lv, optiland, replay | 96 | 288 | 864 | 844 RECORDED, 20 ATTENTION | 268 RECORDED, 20 ATTENTION | every engine ok | baselines/benchmark.mtf.json |
| r6b | LV sheared diffraction MTF beside comparator wave OTF on LV rays | mtf.native | lv, wave | 96 | 96 | 96 | 95 RECORDED, 1 ATTENTION | 95 RECORDED, 1 ATTENTION | every engine ok | baselines/benchmark.mtf.json |
| r6c | LV, LV-ray wave OTF and FFT beside comparator OTF of optiland raw wavefronts | mtf.native | lv, optiland, optiland-wave, wave | 96 | 576 | 576 | 381 RECORDED, 51 ATTENTION, 144 UNSUPPORTED | 381 RECORDED, 51 ATTENTION, 144 UNSUPPORTED | optiland: 48 ok, 48 unsupported | baselines/benchmark.mtf.json |

### Not covered

- Each item of the fixed block at the end of this matrix, which every MTF report ends with.

## Coma and bokeh

LensVisualizer's coma and bokeh tabs: the rings and fans of the coma cloud and the bokeh tile's rings, each sample LensVisualizer's aimed launch ray.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r7a | Spot and fan figures of the coma and bokeh tabs' rays, on identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 8640 | 8640 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r7b | LV's coma and bokeh tabs beside optiland's SpotDiagram and RayFan | spot.native | lv, optiland | in no baseline; run only where named |

### Not covered

- The bokeh tile at the tab's own plane (infSensorZ): deferred.

- A finite object and a folded path: coded problems of the run, never approximated; a coma fan on the axis is one of its field.

- The spot figures of R7b have no attention band, since the two engines sample the pupil on different rings; only its fan figure has one.

## Spherical aberration and axial colour

LensVisualizer's spherical-aberration section (aberrations tab) and axial-colour section (chromatic tab): the zones of the axial object, at the authored indices and at each colour channel's own.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r8a | Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 1872 | 1872 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r8b | LV's spherical-aberration and axial-colour sections beside optiland's own rays and focus | axial.native | lv, optiland | in no baseline; run only where named |

### Not covered

- The colour figures of R8b have no attention band.

- Bit identity of LensVisualizer's channel indices at the C, F and g lines: no committed suite asks those lines, and it is not pursued.

- A finite object and a folded path: coded problems of the run.

## Distortion, lateral colour, pupils and breathing

LensVisualizer's distortion and pupils tabs and its lateral-colour section: their chief rays, each colour channel's own; breathing is the focal length of each prepared state, which R1 compares; the LensVisualizer-only test breathing.test.ts holds the chart to R1's focal length.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r9a | Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 1152 | 1152 PASS | 288 PASS | every engine ok | baselines/benchmark.json |
| r1 | First-order quantities and pupils | paraxial.first-order | lv, optiland, ref | 96 | 288 | 288 | 288 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r9b | LV's distortion, pupils and lateral-colour tabs beside optiland's distortion, chief rays and pupils | chief.native | lv, optiland | in no baseline; run only where named |

### Not covered

- Breathing between the focus stations LensVisualizer declares: chart positions between stations are no case.

- A fisheye's distortion (lv-fisheye-projection): a coded problem of the set.

- optiland's pupil aberration: another quantity, never asked.

- The figures of R9b have no attention band.

## Field curves and astigmatism

LensVisualizer's field-curve and astigmatism sections (aberrations tab): the parabasal pencil and the real-ray fans of each field.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r10a | Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 1728 | 1728 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r10b | LV's field-curve sections beside optiland's FieldCurvature | curvature.native | lv, optiland | in no baseline; run only where named |

### Not covered

- LensVisualizer's parabasal pencil is 0.01 mm wide, a convention of its own: its foci are of a finite pencil, beside optiland's infinitesimal pair.

- Fields other than the sections' own field fractions.

## Vignetting and relative illumination

LensVisualizer's vignetting tab: an aimed lattice on the real stop at each of its fields, the share of it that reaches the image and its flux there.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r11a | Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays | rays.trace | lv, optiland, ref | 96 | 288 | 864 | 864 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r11b | LV's vignetting tab beside flux, the comparator's estimate on LV's lattices | vignetting.native | flux, lv | in no baseline; run only where named |

### Not covered

- optiland has no vignetting analysis: the counterpart in R11b is flux, the comparator's estimate on LensVisualizer's lattices, not an external engine.

- The relative illumination and the falloff of R11b have no attention band.

- States outside the tab's beam model, and fields launched from a bounding sphere: coded problems, with no vignetting set.

## Summary and cardinal elements

LensVisualizer's summary tab and aperture control: its readouts are of the prepared state and LensVisualizer's paraxial kernel, which R1 compares; the LensVisualizer-only test summary.test.ts holds its readouts to R1's values; the tab traces no ray of its own.

### Gated

| Rung | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not ok | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| r1 | First-order quantities and pupils | paraxial.first-order | lv, optiland, ref | 96 | 288 | 288 | 288 PASS | 288 PASS | every engine ok | baselines/benchmark.json |

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r12b | LV's summary tab and aperture control beside optiland's paraxial accessors and working f-number | summary.native | lv, optiland | in no baseline; run only where named |

### Not covered

- The half field, the focus distance, the controls and the Current Perspective Pose section of the tab.

- The aperture control's paraxial working f-number beside the mark, shown only above a difference of 0.05.

- The stop and the track of R12b are read back from the case: they hold the tab to the case, not two engines to each other.

## Seidel sums, wavefront and Zernike fits (no LensVisualizer tab)

LensVisualizer presents no Seidel sums, wavefront or Zernike coefficients: these rungs set optiland beside the comparator's own estimates, by OpticStudio's conventions, and no LensVisualizer answer is asked.

### Recorded

| Rung | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| r13b | The comparator's Seidel sums (ref-seidel) beside optiland's | seidel.native | optiland, ref-seidel | in no baseline; run only where named |
| r14b | optiland's Zernike fit beside the comparator's fit of the same raw wavefront samples (optiland-wave) | zernike.native | optiland, optiland-wave | in no baseline; run only where named |

### Not covered

- optiland's chromatic Seidel sums: optiland states none of an optic of one line.

- ref as a third Zernike answer: wavefront.native version 1 carries no launch rays.

- OpticStudio's figures to the centroid.

- LensVisualizer, which has no tab of these analyses.

## Not covered

Beyond each row's own items, the fixed block that every MTF report ends with says what no comparison of this tool shows:

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

## Sources

- baselines/benchmark.json: bc182fb3c2ab3c443fa0366454be22a7a71f26c4947db9fea03403ab531f953c
- baselines/benchmark.mtf.json: ba1d7bce897c1aee77138ee29b41b86acccd490d254e539b25544fdfaf524793
