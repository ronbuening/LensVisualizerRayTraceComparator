# Validation matrix of benchmark

This matrix is rendered from the benchmark's two baselines alone, with no engine, clock or machine input. It has a row for each LensVisualizer analysis tab, a row of the foundation they stand on, and a row of the analyses LensVisualizer has no tab of.

## Inputs

| Input | Value |
|---|---|
| Suite | benchmark |
| Limits file | v1 |
| LensVisualizer checkout | clean checkout |
| LensVisualizer engine files | 3 |
| Declared runs | 3 |
| Configurations | 2 |

| Engine | Name | Version |
|---|---|---|
| lv | LensVisualizer | stand-in |
| optiland | optiland | stand-in |
| ref | Reference tracer | stand-in |
| replay | Replay of LensVisualizer's MTF | stand-in |
| wave | Wave MTF of LensVisualizer's rays | stand-in |

## Rows

| Row | Checks held to a limit | Side-by-side checks |
|---|---|---|
| Built system, first-order data, rays and optical path | `r0`, `r1`, `r2`, `r3` | none |
| MTF | `r4`, `r4f`, `r6a` | `r5`, `r5g`, `r6b`, `r6c` |
| Coma and bokeh | `r7a` | `r7b` |
| Spherical aberration and axial colour | `r8a` | `r8b` |
| Distortion, lateral colour, pupils and breathing | `r9a`, `r1` | `r9b` |
| Field curves and astigmatism | `r10a` | `r10b` |
| Vignetting and relative illumination | `r11a` | `r11b` |
| Summary and cardinal elements | `r1` | `r12b` |
| Seidel sums, wavefront and Zernike fits (no LensVisualizer tab) | none | `r13b`, `r14b` |

A configuration is one named run of the benchmark, with its lens state. A configuration pair is two engines on one configuration and one check; a request pair is two engines on one request. Request-pair counts count every request pair, answers that were not computed included; configuration-pair counts count the worst verdict of each configuration pair. Check r4 is in both baselines and counts once.

A check held to a limit holds two engines to the limits of the limits file on the same input, and its verdicts are the ones the baseline holds.

A side-by-side check sets two methods beside each other with no limit and fails nothing: its counts say how many pairs were written down inside a review band, outside one, or without an answer to set beside the other.

A check marked as in no baseline is run only where a run names it and is kept out of every baseline, so this matrix names its quantity and engines and gives no figure of it.

## Built system, first-order data, rays and optical path

The foundation of every tab: the system each engine builds from the lens state, its first-order data, and the hits, landings and optical paths of the rays LensVisualizer launches for its MTF.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| Built system — `r0` | Built layout, shape, aperture, index and sampled sag | system.describe | lv, optiland, ref | 2 | 6 | 6 | 6 Pass | 6 Pass | every engine answered | baselines/benchmark.json |
| First-order data — `r1` | First-order quantities and pupils | paraxial.first-order | lv, optiland, ref | 2 | 6 | 6 | 6 Pass | 6 Pass | every engine answered | baselines/benchmark.json |
| Ray trace — `r2` | Hits, directions, image landings and masks of identical rays | rays.trace | lv, optiland, ref | 2 | 6 | 18 | 18 Pass | 6 Pass | every engine answered | baselines/benchmark.json |
| Optical path — `r3` | Optical path, path to image and chief-relative OPD of identical rays | rays.trace | lv, optiland, ref | 2 | 6 | 18 | 18 Pass | 6 Pass | every engine answered | baselines/benchmark.json |

### Not covered

- Folded paths and diffractive surfaces: the suites folded and diffractive have ray baselines of their own, outside the benchmark.

- The catalog beyond the benchmark: its baselines are a dated snapshot with a report of their own.

## MTF

LensVisualizer's MTF tab: this tool's geometric and wave MTF of LensVisualizer's launch rays as each engine traces them, LensVisualizer's own geometric MTF beside the replay of its sampling, and the engines' own MTF side by side.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| Geometric MTF of the same rays — `r4` | This tool's geometric MTF of identical rays, as each engine traces them | rays.trace | lv, optiland, ref | 2 | 6 | 12 | 12 Pass | 6 Pass | every engine answered | baselines/benchmark.json, baselines/benchmark.mtf.json |
| LensVisualizer's MTF sampling, replayed — `r4f` | LensVisualizer's geometric MTF beside a replay of its own sampling | mtf.native | lv, replay | 2 | 2 | 2 | 2 Pass | 2 Pass | every engine answered | baselines/benchmark.mtf.json |
| Wave MTF of the same rays — `r6a` | This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled | rays.trace | lv, optiland, ref | 2 | 6 | 12 | 12 Pass | 6 Pass | every engine answered | baselines/benchmark.mtf.json |

### Side by side

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| MTF beside optiland's FFT MTF — `r5` | LensVisualizer's diffraction MTF beside optiland's FFT MTF and the wave estimate of LensVisualizer's rays | mtf.native | lv, optiland, wave | 2 | 6 | 6 | 4 Side by side, worth a look; 2 Not computed | 4 Side by side, worth a look; 2 Not computed | optiland: 1 answered, 1 not computed | baselines/benchmark.mtf.json |
| MTF beside the wave estimate of LensVisualizer's rays — `r6b` | LensVisualizer's sheared diffraction MTF beside this tool's wave OTF of LensVisualizer's rays | mtf.native | lv, wave | 2 | 2 | 2 | 1 Side by side; 1 Side by side, worth a look | 1 Side by side; 1 Side by side, worth a look | every engine answered | baselines/benchmark.mtf.json |

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Geometric MTF beside optiland's — `r5g` | Geometric MTF on each method's own pupil sampling | none | none | not in the benchmark's baselines |
| MTF beside the OTF of optiland's wavefront — `r6c` | LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts | none | none | not in the benchmark's baselines |

### Not covered

- Each item of the fixed list at the end of this matrix, which every MTF report ends with.

## Coma and bokeh

LensVisualizer's coma and bokeh tabs: the rings and fans of the coma cloud and the bokeh tile's rings, each sample LensVisualizer's own aimed launch ray.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| Spot and fan rays — `r7a` | Spot and fan figures of the coma and bokeh tabs' rays, on identical rays | rays.trace | lv, optiland, ref | 2 | 6 | 24 | 16 Pass; 8 Not computed | 4 Pass; 2 Not computed | optiland: 1 answered, 1 not computed | baselines/benchmark.json |

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Spots and fans beside optiland's — `r7b` | LensVisualizer's coma and bokeh tabs beside optiland's SpotDiagram and RayFan | spot.native | lv, optiland | in no baseline; run only where named |

### Not covered

- The bokeh tile at the tab's own plane (infSensorZ): deferred.

- A finite object and a folded path: each is a coded problem of the run, never approximated; a coma fan on the axis is a coded problem of its field.

- The spot figures of check r7b have no review band, since the two engines sample the pupil on different rings; only its fan figure has one.

## Spherical aberration and axial colour

LensVisualizer's spherical-aberration section (aberrations tab) and axial-colour section (chromatic tab): the zones of the axial object, at the lens's own refractive indices and at each colour channel's own.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| Spherical aberration and axial colour rays — `r8a` | Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays | rays.trace | lv, optiland, ref | 2 | 6 | 12 | 12 Pass | 6 Pass | every engine answered | baselines/benchmark.json |

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Spherical aberration and axial colour beside optiland's — `r8b` | LensVisualizer's spherical-aberration and axial-colour sections beside optiland's own rays and focus | axial.native | lv, optiland | in no baseline; run only where named |

### Not covered

- The colour figures of check r8b have no review band.

- Bit identity of LensVisualizer's channel indices at the C, F and g lines: no committed suite asks for those wavelengths, and it is not pursued.

- A finite object and a folded path: coded problems of the run.

## Distortion, lateral colour, pupils and breathing

LensVisualizer's distortion and pupils tabs and its lateral-colour section: their chief rays, each colour channel's own. Breathing is the focal length of each prepared lens state, which check r1 compares; a test against LensVisualizer alone (breathing.test.ts) holds the breathing chart to that focal length.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| Chief rays (distortion, pupils, lateral colour) — `r9a` | Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays | rays.trace | lv, optiland, ref | 2 | 6 | 6 | 6 Pass | 6 Pass | every engine answered | baselines/benchmark.json |
| First-order data — `r1` | First-order quantities and pupils | paraxial.first-order | lv, optiland, ref | 2 | 6 | 6 | 6 Pass | 6 Pass | every engine answered | baselines/benchmark.json |

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Distortion, pupils and lateral colour beside optiland's — `r9b` | LensVisualizer's distortion, pupils and lateral-colour tabs beside optiland's distortion, chief rays and pupils | chief.native | lv, optiland | in no baseline; run only where named |

### Not covered

- Breathing between the focus stations LensVisualizer declares: a chart position between two stations is no lens state.

- A fisheye's distortion (lv-fisheye-projection): a coded problem of the set of rays.

- optiland's pupil aberration: another quantity, never asked for.

- The figures of check r9b have no review band.

## Field curves and astigmatism

LensVisualizer's field-curve and astigmatism sections (aberrations tab): the parabasal pencil and the real-ray fans of each field.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| Field-curve rays — `r10a` | Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays | rays.trace | lv, optiland, ref | 2 | 6 | 12 | 12 Pass | 6 Pass | every engine answered | baselines/benchmark.json |

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Field curves beside optiland's — `r10b` | LensVisualizer's field-curve sections beside optiland's FieldCurvature | curvature.native | lv, optiland | in no baseline; run only where named |

### Not covered

- LensVisualizer's parabasal pencil is 0.01 mm wide, a convention of its own: its foci are of a finite pencil, beside optiland's infinitesimal pair.

- Fields other than the sections' own field fractions.

## Vignetting and relative illumination

LensVisualizer's vignetting tab: an aimed lattice of rays on the real stop at each of its fields, the share of it that reaches the image and its flux there.

### Held to a limit

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Vignetting rays — `r11a` | Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays | none | none | not in the benchmark's baselines |

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Vignetting beside the flux estimate — `r11b` | LensVisualizer's vignetting tab beside this tool's flux estimate on LensVisualizer's lattices | vignetting.native | flux, lv | in no baseline; run only where named |

### Not covered

- optiland has no vignetting analysis: the counterpart in check r11b is this tool's own flux estimate on LensVisualizer's lattices, not an external engine.

- The relative illumination and the falloff of check r11b have no review band.

- Lens states outside the tab's beam model, and fields launched from a bounding sphere: coded problems, with no vignetting rays.

## Summary and cardinal elements

LensVisualizer's summary tab and aperture control: their readouts are of the prepared lens state and LensVisualizer's paraxial model, which check r1 compares; a test against LensVisualizer alone (summary.test.ts) holds the readouts to the first-order values of check r1; the tab traces no ray of its own.

### Held to a limit

| Check | Compares | Quantity | Engines | Configurations | Configuration pairs | Request pairs | Request-pair counts | Configuration-pair counts | Engines not answering | Baselines |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| First-order data — `r1` | First-order quantities and pupils | paraxial.first-order | lv, optiland, ref | 2 | 6 | 6 | 6 Pass | 6 Pass | every engine answered | baselines/benchmark.json |

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Summary beside optiland's — `r12b` | LensVisualizer's summary tab and aperture control beside optiland's paraxial accessors and working f-number | summary.native | lv, optiland | in no baseline; run only where named |

### Not covered

- The half field, the focus distance, the controls and the Current Perspective Pose section of the tab.

- The aperture control's paraxial working f-number beside the mark, shown only above a difference of 0.05.

- The stop and the track in check r12b are optiland's reading of the lens state: they hold the tab to the lens state, not two engines to each other.

## Seidel sums, wavefront and Zernike fits (no LensVisualizer tab)

LensVisualizer presents no Seidel sums, wavefront or Zernike coefficients: these checks set optiland beside this tool's own estimates, by OpticStudio's conventions, and LensVisualizer is not asked.

### Side by side

| Check | Compares | Quantity | Engines | Baselines |
|---|---|---|---|---|
| Seidel sums beside optiland's — `r13b` | This tool's Seidel sums of the reference model beside optiland's | seidel.native | optiland, ref-seidel | in no baseline; run only where named |
| Zernike fit beside optiland's — `r14b` | optiland's Zernike fit beside this tool's fit of the same raw wavefront samples | zernike.native | optiland, optiland-wave | in no baseline; run only where named |

### Not covered

- optiland's chromatic Seidel sums: optiland states none for a lens of one wavelength.

- The reference tracer as a third Zernike answer: the raw wavefront quantity (wavefront.native, version 1) carries no launch rays.

- OpticStudio's figures to the centroid.

- LensVisualizer, which has no tab of these analyses.

## Not covered

Beyond each row's own items, the fixed list that every MTF report ends with says what no comparison of this tool shows:

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

## Identifiers

The hashes that tell one version from another: of the suite file, of the limits file, of LensVisualizer's commit and engine code, of the two baseline files this matrix is rendered from, and of each engine's code and of this tool's code behind it.

| Identifier | Hash |
|---|---|
| Suite hash | dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd |
| Limits file hash | b32032395aa189b6f09936b542be7154e4d611122d299340bb341ba713f7312a |
| LensVisualizer commit | cccccccccccccccccccccccccccccccccccccccc |
| LensVisualizer engine code | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa |
| baselines/benchmark.json | a4af89aee4d91105c9b086491fc0b4942f9e284907e439c3bbad50766002ba76 |
| baselines/benchmark.mtf.json | 9668eda943f56095580972788388f20233b1503263f14b6111bff856cb02e39b |

| Engine | Engine code | This tool's code behind it |
|---|---|---|
| lv | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa | 2222222222222222222222222222222222222222222222222222222222222222 |
| optiland | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb | 8888888888888888888888888888888888888888888888888888888888888888 |
| ref | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb | 3333333333333333333333333333333333333333333333333333333333333333 |
| replay | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa | 6666666666666666666666666666666666666666666666666666666666666666 |
| wave | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa | 4444444444444444444444444444444444444444444444444444444444444444 |
