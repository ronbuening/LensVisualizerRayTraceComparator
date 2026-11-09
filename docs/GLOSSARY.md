# Glossary

This glossary is generated from src/vocabulary by lvrtc verify --write: edit the vocabulary, not this file.

It is for reviewers who know optics and not this tool. LensVisualizer is under review; optiland is an independent external engine; the other engines are this tool's own. It says what each check compares, what it shows and what it does not show, and what the words on the screens and in the reports mean.

## Terms

The words used on screens and in reports, and the older words of this tool that each replaces.

| Term | Meaning | Replaces |
| --- | --- | --- |
| check | One comparison this tool makes of two engines' answers to the same request, such as the ray trace or the wave MTF. Each check is held to a limit or sets two answers side by side. | `rung`, `ladder` |
| held to a limit | A check whose figures must be at or below the limits of the limits file; it passes or fails. Every such check hands both engines the same input, often the very same rays. | `gated` |
| limit | The largest value a judged figure may take for a pair to pass. | `tolerance`, `gate` |
| side by side | A check that sets two methods' answers beside each other with no limit: each engine uses its own method and sampling, so a difference is written down and fails nothing. | `recorded` |
| review band | A width for attention on a side-by-side figure: a difference outside it is worth a look and is not a failure. | `attention band` |
| lens state | One lens as every engine is handed it: the lens at one zoom, focus and stop, with its wavelengths, field angles and image plane. | `case` |
| wavelength | One of the wavelengths a lens state is evaluated at, with its weight and the refractive index of every glass at it. | `line` |
| reference wavelength | The wavelength a lens's glasses are specified at: the d line (587.56 nm), or the e line for some lenses. | `reference line` |
| photopic | A set of several wavelengths weighted by the eye's daylight sensitivity, for white-light figures. |  |
| engine | A program that answers requests about a lens state: LensVisualizer under review, optiland as an independent external engine, or one of this tool's own. |  |
| verdict | What a check found of a pair: within or beyond its limit, side by side, not computed or an error. |  |
| lens configuration | A lens, or a zoom at one end, as a suite names it; each is run in several lens states (wavelengths, stops, image planes). | `configuration` |
| suite | A file under suites/ that names lenses, the states to run them in, the engines and the checks. |  |
| run | One lens state of a suite, run on its engines. A zoom with no zoom position stated is run at both ends, as two runs. |  |
| request | One question asked of every engine of a run, such as the trace of a set of rays or the MTF of a field. |  |
| pair | Two engines' answers to one request, which a check compares and gives one verdict. |  |
| identical rays | The very same rays, start point and direction to the last bit, handed to every engine to trace, so that what is compared is the tracing and not the choice of rays. |  |
| ray lattice | The square grid of rays LensVisualizer launches across the stop of a field, each aimed at its own point of the stop. |  |
| reference tracer | A small exact ray tracer in this repository, written from the optics alone and tested against closed forms, never against another tracer's output. | `ref` |
| baseline | The committed record of a suite's verdicts and figures, a file under baselines/. A baseline check runs the suite again and says what changed. |  |
| record | One entry of a baseline: the verdict and figures of one pair of engines in one check of one run. |  |
| run record | The file a run writes of what it asked, which engines answered and where each answer is kept. | `manifest` |
| result cache | Where each engine's answers are kept, keyed by the request and the engine version, so that an unchanged question is not asked again. | `store`, `result store` |
| limits file | The file under policy/ that holds every check's limits and review bands, with a version number. | `policy` |
| engine version | Two hashes that identify an answer's source: one of the engine's own code and one of this tool's code behind it. An answer is kept only for the version that gave it. | `fingerprint`, `adapter revision` |
| MTF setup | What LensVisualizer's MTF tab sets for a lens state: the field angles, the frequencies, the image plane and the sampling. | `recipe` |
| maintainer | The person who keeps this repository: writes the baselines, raises the limits file's version and runs cache maintenance. | `owner` |
| field | A direction of incoming light, given as an angle from the axis or as a fraction of the half field. |  |
| tangential and sagittal cuts | The two directions an MTF or a focus is given in: the tangential in the plane of the field and the axis, the sagittal across it. |  |
| stop | The aperture that limits the beam on the axis; its radius sets the f-number. |  |
| pupil | The image of the stop seen from the object side (entrance pupil) or from the image side (exit pupil). |  |
| design plane | The image plane where the lens prescription puts it. |  |
| best focus | The image plane LensVisualizer's own focus search finds for a stop and a set of wavelengths, handed to every engine as a plane. | `lv-best-axial` |

## Checks

A check held to a limit hands two engines the same input and passes or fails. A side-by-side check sets two methods beside each other with no limit and fails nothing. The id is the one stored today; the second id is the one it had before the ids were renamed, which the catalog snapshot and files written before the rename still name and which is still read.

### Pipeline echo (a test of this tool)

- Id: `pipeline-echo`, formerly `selftest`.
- Kind: held to a limit.
- Compares: An array this tool hands a test engine and the array the engine hands back.
- Shows: That this tool's requests, transports and comparisons carry numbers through unchanged.
- Does not show: Anything about a lens or about LensVisualizer: no optics is computed.

### Built system

- Id: `built-system`, formerly `r0`.
- Kind: held to a limit.
- Compares: Built layout, shape, aperture, index and sampled sag.
- Shows: That each engine built the same system from the lens state it was handed: the same surfaces at the same places, the same shapes, apertures and refractive indices, and the same sag at sampled heights, within the limit.
- Does not show: Whether the lens state LensVisualizer exports is a faithful model of the real lens: its prescription, glass data and stop size are LensVisualizer's own, handed to every engine.

### First-order data

- Id: `first-order`, formerly `r1`.
- Kind: held to a limit.
- Compares: First-order quantities and pupils.
- Shows: That the engines' paraxial models give the same focal length, focal and principal points, back focus and pupil positions and sizes, within the limit.
- Does not show: Anything about real rays outside the paraxial region, or whether LensVisualizer's lens data are the maker's design.

### Ray trace

- Id: `ray-trace`, formerly `r2`.
- Kind: held to a limit.
- Compares: Hits, directions, image landings and masks of identical rays.
- Shows: That, handed the same rays, the engines find the same hit points on every surface, the same exit directions and image landings, and stop the same rays, within the limit.
- Does not show: That the rays LensVisualizer launches are the ones that best model the lens, how LensVisualizer chooses or aims them, or anything about glass dispersion data.

### Optical path

- Id: `optical-path`, formerly `r3`.
- Kind: held to a limit.
- Compares: Optical path, path to image and chief-relative OPD of identical rays.
- Shows: That, handed the same rays, the engines compute the same optical path lengths, to each surface and to the image, and the same optical path difference from the chief ray, within the limit.
- Does not show: How an optical path is turned into a wavefront or an MTF: the MTF checks are about that, each with its own limit or none.

### Geometric MTF of the same rays

- Id: `geometric-mtf`, formerly `r4`.
- Kind: held to a limit.
- Compares: This tool's geometric MTF of identical rays, as each engine traces them.
- Shows: That one geometric MTF calculation of this tool, applied to each engine's trace of the same rays, gives curves within the limit of each other.
- Does not show: What LensVisualizer's own MTF tab computes, or how a geometric MTF stands beside a diffraction MTF: other checks set those side by side.

### LensVisualizer's MTF sampling, replayed

- Id: `lv-mtf-replay`, formerly `r4f`.
- Kind: held to a limit.
- Compares: LensVisualizer's geometric MTF beside a replay of its own sampling.
- Shows: That LensVisualizer's geometric MTF is, within the limit, the sum this tool forms of LensVisualizer's own sampled rays, with the same sampling grids, ray counts and field outcomes.
- Does not show: Whether LensVisualizer's sampling is fine enough for the lens: the replay repeats LensVisualizer's choices and does not test them.

### MTF beside optiland's FFT MTF

- Id: `mtf-vs-optiland-fft`, formerly `r5`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's diffraction MTF beside optiland's FFT MTF and the wave estimate of LensVisualizer's rays.
- Shows: LensVisualizer's diffraction MTF set beside optiland's FFT MTF and this tool's wave estimate on LensVisualizer's rays, field by field, each difference sorted by its cause before it is shown.
- Does not show: Which curve is nearer the lens: each engine uses its own pupil sampling, reference sphere and frequency axis, so a difference is written down and fails nothing. optiland's FFT gives one wavelength at a time, so a white-light run has no FFT row.

### Geometric MTF beside optiland's

- Id: `geometric-mtf-vs-optiland`, formerly `r5g`.
- Kind: side by side, no limit.
- Compares: Geometric MTF on each method's own pupil sampling.
- Shows: LensVisualizer's geometric MTF set beside optiland's own geometric MTF and the replay of LensVisualizer's sampling, each engine with its own rays and pupil sampling.
- Does not show: Which sampling is nearer the lens: both engines sample the stop, each on its own grid and with its own number of rays, so a difference is written down, not explained.

### Wave MTF of the same rays

- Id: `wave-mtf`, formerly `r6a`.
- Kind: held to a limit.
- Compares: This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled.
- Shows: That one wave-optics MTF calculation of this tool, applied to each engine's optical paths of the same rays, gives curves within the limit of each other, in fields whose sampling settled.
- Does not show: Fields whose sampling did not settle (a phase step above a quarter wave, or a move when the grid is doubled), which are set aside and not judged; nor what LensVisualizer's own diffraction MTF gives.

### MTF beside the wave estimate of LensVisualizer's rays

- Id: `mtf-vs-wave-estimate`, formerly `r6b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's sheared diffraction MTF beside this tool's wave OTF of LensVisualizer's rays.
- Shows: LensVisualizer's diffraction MTF set beside this tool's wave estimate on the rays LensVisualizer launches, field by field.
- Does not show: Which estimate is nearer the lens: the two sample the pupil on grids of their own, so a difference is written down and fails nothing.

### MTF beside the OTF of optiland's wavefront

- Id: `mtf-vs-optiland-wavefront`, formerly `r6c`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts.
- Shows: LensVisualizer's diffraction MTF and the wave estimate set beside optiland's FFT MTF and this tool's OTF of optiland's raw wavefront samples, field by field.
- Does not show: Which column is nearer the lens: no column is taken as the reference for another. The reference-sphere model and the FFT axes remain choices of each method.

### Spot and fan rays

- Id: `spot-rays`, formerly `r7a`.
- Kind: held to a limit.
- Compares: Spot and fan figures of the coma and bokeh tabs' rays, on identical rays.
- Shows: That, handed the rays LensVisualizer's coma and bokeh tabs launch, the engines give the same transverse errors, spot centroids and RMS radii, and stop the same rays, within the limit.
- Does not show: Whether the tabs sample the pupil finely enough; the bokeh tile at the tab's own plane is not covered.

### Spots and fans beside optiland's

- Id: `spot-vs-optiland`, formerly `r7b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's coma and bokeh tabs beside optiland's SpotDiagram and RayFan.
- Shows: LensVisualizer's spot and ray-fan figures set beside optiland's own spot diagram and ray fan of the field.
- Does not show: Which spot is nearer the lens: the two engines sample the pupil on different rings, so the spot figures have no review band; only the fan figure has one.

### Spherical aberration and axial colour rays

- Id: `axial-rays`, formerly `r8a`.
- Kind: held to a limit.
- Compares: Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays.
- Shows: That, handed the rays LensVisualizer's spherical-aberration and axial-colour sections launch, the engines find the same axial crossings and best focus, judged on the transverse scale, within the limit.
- Does not show: Anything about glass dispersion data: every engine is handed the same refractive indices.

### Spherical aberration and axial colour beside optiland's

- Id: `axial-vs-optiland`, formerly `r8b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's spherical-aberration and axial-colour sections beside optiland's own rays and focus.
- Shows: LensVisualizer's spherical-aberration and axial-colour figures set beside those of optiland's own rays, aimed at the same points of the stop.
- Does not show: Which figure is nearer the lens; the colour figures have no review band.

### Chief rays (distortion, pupils, lateral colour)

- Id: `chief-rays`, formerly `r9a`.
- Kind: held to a limit.
- Compares: Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays.
- Shows: That, handed the chief rays LensVisualizer's distortion, pupils and lateral-colour tabs launch, the engines give the same landings, distortion, lateral colour and exit-pupil crossings, within the limit.
- Does not show: How LensVisualizer finds the chief ray of each field angle; a fisheye's distortion is not covered.

### Distortion, pupils and lateral colour beside optiland's

- Id: `chief-vs-optiland`, formerly `r9b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's distortion, pupils and lateral-colour tabs beside optiland's distortion, chief rays and pupils.
- Shows: LensVisualizer's distortion curve, pupils and lateral colour set beside optiland's own distortion model, chief rays and pupils.
- Does not show: Which figure is nearer the lens; no figure of this comparison has a review band.

### Field-curve rays

- Id: `field-curve-rays`, formerly `r10a`.
- Kind: held to a limit.
- Compares: Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays.
- Shows: That, handed the rays LensVisualizer's field-curve sections launch, the engines find the same tangential and sagittal foci and chief landings, judged on the transverse scale, within the limit.
- Does not show: Whether LensVisualizer's 0.01 mm parabasal pencil, a convention of its own, is narrow enough to stand for an infinitesimal one.

### Field curves beside optiland's

- Id: `field-curve-vs-optiland`, formerly `r10b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's field-curve sections beside optiland's FieldCurvature.
- Shows: LensVisualizer's tangential and sagittal focus shifts and astigmatism set beside optiland's own field-curvature analysis.
- Does not show: Which focus is nearer the lens: LensVisualizer's foci are of a 0.01 mm pencil and optiland's of an infinitesimal one.

### Vignetting rays

- Id: `vignetting-rays`, formerly `r11a`.
- Kind: held to a limit.
- Compares: Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays.
- Shows: That, handed the beams LensVisualizer's vignetting tab launches, the engines let the same rays through and give the same flux into the image and the same chief landings, within the limit.
- Does not show: Whether the tab's lattice is fine enough; states outside the tab's beam model have no vignetting rays and are not covered.

### Vignetting beside the flux estimate

- Id: `vignetting-vs-flux-estimate`, formerly `r11b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's vignetting tab beside this tool's flux estimate on LensVisualizer's lattices.
- Shows: LensVisualizer's geometric transmission and relative illumination set beside this tool's flux estimate on LensVisualizer's own lattices.
- Does not show: An external engine's view: optiland has no vignetting analysis, so the other side is this tool's own estimate. The relative illumination and the falloff have no review band.

### Summary beside optiland's

- Id: `summary-vs-optiland`, formerly `r12b`.
- Kind: side by side, no limit.
- Compares: LensVisualizer's summary tab and aperture control beside optiland's paraxial accessors and working f-number.
- Shows: LensVisualizer's focal length, entrance pupil, stop, f-numbers and track set beside optiland's own paraxial values and working f-number.
- Does not show: The stop and the track as the work of two engines: optiland reads them back from the lens state, so they hold the tab to the lens state alone.

### Seidel sums beside optiland's

- Id: `seidel-vs-optiland`, formerly `r13b`.
- Kind: side by side, no limit.
- Compares: This tool's Seidel sums of the reference model beside optiland's.
- Shows: The third-order Seidel sums of this tool's reference model set beside optiland's own, surface by surface and in total.
- Does not show: LensVisualizer, which shows no Seidel sums; nor optiland's chromatic sums, which optiland does not state.

### Zernike fit beside optiland's

- Id: `zernike-vs-optiland`, formerly `r14b`.
- Kind: side by side, no limit.
- Compares: optiland's Zernike fit beside this tool's fit of the same raw wavefront samples.
- Shows: optiland's Zernike fit set beside this tool's fit of the same raw wavefront samples, coefficient by coefficient.
- Does not show: LensVisualizer, which shows no wavefront or Zernike coefficients. Both fits are of optiland's own wavefront, so neither tests optiland's tracing.

## Engines

The engines built into this tool. LensVisualizer is under review, optiland is an independent external engine, and the others are this tool's own. The id is the one stored today; the old id is the one it had before the ids were renamed, which the catalog snapshot and files written before the rename still name and which is still read.

| Engine | Id | Old id | What it is |
| --- | --- | --- | --- |
| LensVisualizer | `lv` | `lv` | LensVisualizer itself, loaded from a local checkout, asked for each figure as its own tabs ask for it, and made to trace the very rays every engine is handed in the checks held to a limit. |
| optiland | `optiland` | `optiland` | optiland, an open-source optical design library in Python, run by this tool in a worker process of its own. |
| Reference tracer | `reference-tracer` | `ref` | The reference tracer: a small exact ray tracer written in this repository from the optics alone, never from LensVisualizer's or optiland's code. |
| Reference Seidel sums | `reference-seidel` | `ref-seidel` | This tool's third-order Seidel sums of the reference tracer's model of the lens, written from the optics alone. |
| Replay of LensVisualizer's MTF | `replay-of-lv-mtf` | `replay` | LensVisualizer's own MTF sampling, repeated step by step, with the geometric MTF summed by this tool. |
| Wave MTF of LensVisualizer's rays | `wave-mtf-of-lv-rays` | `wave` | This tool's wave-optics MTF estimate, computed from the rays LensVisualizer launches and traces. |
| Flux of LensVisualizer's rays | `flux-of-lv-rays` | `flux` | This tool's estimate of transmission and relative illumination, from the ray lattices LensVisualizer launches and traces. |
| OTF of optiland's wavefront | `otf-of-optiland-wavefront` | `optiland-wave` | This tool's OTF and Zernike fit of the raw wavefront samples that optiland computes. |

## Suites

The suites committed under suites/.

| Suite | What it runs |
| --- | --- |
| `benchmark` | Twelve lens configurations (ten primes, and a zoom at both ends) on the reference wavelength and on photopic wavelengths, wide open and at f/8, at the design plane and at LensVisualizer's best focus: 96 runs. |
| `features` | One lens for each kind of lens data the benchmark lacks: an odd-order asphere, an e-line lens, a high-order asphere term, an asphere on a flat base, a rear plate rim, a fixed-iris zoom, an asphere without terms and a stop inside an element. |
| `states` | Every benchmark lens at f/5.6 and f/11 on both sets of wavelengths and both image planes, and the zoom at its published zoom positions. |
| `focus-stations` | The documented close-focus stations of the 35 catalog lenses that declare them, each at the object distance LensVisualizer states for it, wide open on the reference wavelength at the design plane. |
| `folded` | Sixteen mirror lenses whose light path folds back, on the built-system, first-order, ray-trace and optical-path checks. |
| `diffractive` | Eight lenses with diffractive surfaces, nine lens states, on the built-system, first-order, ray-trace and optical-path checks. |
| `smoke` | Two simple primes and a simple zoom: a quick first run of LensVisualizer and the reference tracer. |
| `catalog` | Every lens of LensVisualizer's catalog, wide open, at both zoom ends: the maintainer's full sweep. Its baselines are a dated snapshot. |
| `catalog-repro` | The files under suites/catalog-repro: each a one-run suite that repeats one catalog lens state a known failure was found on. |

## Verdicts

Each pair of engines that answered one request gets one verdict. The stored value is shown beside its label.

| Label | Stored | Meaning |
| --- | --- | --- |
| Pass: within limit | `PASS` | A check held to a limit: every judged figure is at or below its limit. |
| Within a known numerical floor | `FLOOR` | A check held to a limit: a judged figure is above its limit by a known numerical floor of one of the two engines, which a limits file may grant. It counts as a pass and is counted apart. |
| Fail: beyond limit | `FAIL` | A check held to a limit: a judged figure is above its limit, or is not a number. |
| Side by side | `RECORDED` | A side-by-side comparison with no limit: the difference is written down, inside its review band or with none. It is not a failure. |
| Side by side, worth a look | `ATTENTION` | A side-by-side comparison with no limit: a figure is outside its review band. It is not a failure. |
| Not computed | `UNSUPPORTED` | One of the two engines cannot compute what was asked. That is an answer, not a failure. |
| Not judged (an earlier check failed) | `BLOCKED` | The pair is not judged, whether or not both engines answered: an earlier check that this one rests on failed or ended in an error for the same two engines and the same lens state. |
| Error | `ERROR` | One of the two engines gave no result, or the two results cannot be compared. |

## Baseline outcomes

What lvrtc baseline check says of each record of a baseline when the suite is run again, why a record is out of date, and the dashboard's badges.

| Label | Stored | Meaning |
| --- | --- | --- |
| Unchanged | `OK` | The record's lens state, engines and limits are the baseline's; no verdict changed and no judged figure moved by more than its limit. |
| Out of date, still within limits | `REFRESHABLE` | Something the record depends on has changed; when run again, its verdicts are the same and no judged figure moved by more than its limit, so the baseline can be written anew. |
| Side-by-side figure moved | `MOVED` | In a side-by-side comparison a verdict changed, or a figure moved by more than its review band. It fails nothing. |
| Changed beyond limits | `DRIFT` | In a check held to a limit a verdict changed, or a judged figure moved by more than its limit. |
| New | `NEW` | The suite as it runs today has a record that the baseline lacks. |
| No longer run | `GONE` | The baseline has a record that the suite as it runs today lacks. |

| Label | Stored | Meaning |
| --- | --- | --- |
| lens data | `case` | The lens state the record was made from is not the one LensVisualizer exports today. |
| engine code | `engine` | The code of an engine, or this tool's code behind it, is not what it was when the record was written. |
| limits | `policy` | The limits file is not the one the record was judged by. |

| Label | Stored | Meaning |
| --- | --- | --- |
| Out of date | `STALE` | Something the record depends on has changed since it was written; the badge names what. |
| Up to date | `CURRENT` | Every reason a record could be out of date is known, and none holds. |
| Unknown | `NOT KNOWN` | Whether the record is out of date could not be judged; the badge names what is not known. |

## Difference classes

A side-by-side comparison sorts each difference by its cause before it shows it, in the order below; a row of an MTF comparison then has one of the statuses that follow.

| Label | Stored | Meaning |
| --- | --- | --- |
| not computed by one engine | `unsupported` | One engine has no answer, so there is no difference to show. |
| the inputs differ | `data` | The two answers are not of the same input (another field point or other wavelengths), so no difference is shown. |
| a convention differs | `convention` | A declared transform between the two engines' conventions is missing. |
| not converged | `numerical` | An engine says that its own sampling did not settle (in the Zernike comparison: the fit is ill-conditioned); the difference is shown apart, in no review band. |
| the methods differ | `method` | Two methods, each standing by its own answer; the difference is set beside the review band, if there is one. |

| Label | Stored | Meaning |
| --- | --- | --- |
| Side by side | `RECORDED` | The difference is inside the review band and was written down. |
| Side by side, worth a look | `ATTENTION` | The difference is outside the review band: worth a look, and not a failure. |
| Set aside | `SET ASIDE` | The row is in no review band, and its class and reason say why. |
| Not computed | `UNSUPPORTED` | An engine has no curve of the field, so there is no difference. |
| Error | `ERROR` | An engine gave no result, or the two results cannot be set against each other. |
