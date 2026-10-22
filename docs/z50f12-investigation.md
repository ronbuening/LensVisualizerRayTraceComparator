# Z 50/1.2: off-axis diffraction and tangential sampling (Stage 4.2)

- **Where.** `nikkor-z50f12`, reference line 587.5618 nm, image-height fractions 0.5 and 1,
  sagittal (S, image x) and tangential (T, image y), wide open and LV's f/8 comparison, at the design
  plane and LV's best axial plane. The four methods are LV's product **sheared** estimate (`lv`),
  the comparator's Hopkins OTF on LV's traced rays (`wave`), optiland `ScalarFFTMTF` (`optiland`),
  and the comparator's OTF of optiland `Wavefront.get_data` (`optiland-wave`). LV's separate
  `waveLatticeOtf` is not its product estimate and is not the `wave` column.
- **Effect.** The settled wide-open, best-focus, half-field tangential discrepancy is about **0.10**
  at 100 cycles/mm. Halving FFT sampling again barely changes it. At that point FFT 256/512 is
  **0.301839 / 0.301717**, LV's adaptive product is **0.203097**, fixed-grid LV 128/256 is
  **0.202506 / 0.202370**, wave 128/256 is **0.202685 / 0.202284**, and optiland-wave
  256/512 is **0.204600 / 0.204518**. The two raw-wavefront columns use different pupil models;
  their remaining roughly 0.002 difference is not attributed to a tracer defect here.
- **Handled.** Keep the engine's curves, their flags and the existing policy. Do not rescale an FFT
  frequency axis to the width of just the surviving pupil. Record the full table and the grid checks below.
  The upstream [question draft](upstream/optiland-vignetted-pupil-frequency-calibration.md) asks about the
  supported domain of the affine pupil approximation; it is not filed.
- **Class. method.** This is the attribution of the persistent Z 50/1.2 tangential offset, established
  on the **best-focus half field**, where FFT, wave at 256 and raw wavefront at 256/512 all stand by
  their curves. The implicated engine method is **optiland's stop-grid FFT and its full-rim affine
  cosine calibration**. Its own documented affine assumption is not satisfied across this pupil.
  This is not a missing declared comparator transform. The measured residual persists after each
  method's last sampling move is much smaller than the residual. A defect requiring an upstream
  numerical correction has not been proved; the draft is a question about method limits.

Classification is still applied in its required order to **each comparison**, before subtraction:
unsupported, data, convention, numerical, method. The class above does not override earlier outcomes.
Wide-open full-field FFT is **unsupported** at all three sizes; it raises ValueError, with two lost
calibration rim rays. Wide-open design-plane FFT is **numerical**, still flagged at 512 (maximum
change over both cuts 0.025132, driven by S). LV-ray wave estimates at design remain undersampled
through 256, and full-field wave is undersampled at best focus too. Such columns are evidence of
sampling, not arbiters. All f/8 columns stand by their curves. No data-class mismatch was found:
the three sizes of each condition have the same case, line, angles, stop and plane; chief landing
heights across the methods span at most **3.35e-11 mm** (policy sorting limit 1e-7 mm). The y-mirrored
optiland frame, sign, wavelength units, image index, frequency cuts and sphere model are declared
and checked by the existing adapters and tests. No convention defect was found.

The starting evidence is the committed [benchmark MTF report](../reports/benchmark/mtf.md),
R5, R5g, R6b and R6c rows of this key. R5/R6c already record the best-focus half-field attention
and the design/full-field qualifications. R5g uses geometric landings with a different pupil sampling
and is not a calibration of a diffraction-frequency axis. This stage attributes the recorded FFT
difference; it neither replaces those rows nor treats the geometric row as a diffraction reference.

## Identity and reproduction

Measured from comparator Stage 4.1 `8f930f3` plus this Stage 4.2 change, policy **12**, hash
`1bb254e47a99d76f428414e8dd3d347a4ec653d24f5ff79c2f08dd9ae59d5da1`. No gate, band or policy file changed.
LV **ab0fd4cf94836492b28470953812ed4afc98c0c6**, clean, 175 engine files, closure
`94778d3d4f0bc86fb092cbc7391f13f1b76780816257d30b074ea41a8c7a119b`.
The added binding export is from the already loaded public `mtf` barrel and changes neither that closure nor
LV's code. optiland **4e893f53aee1312f2d091680b93dd2279711e197**, stated version
`0.6.2.post117+g4e893f53`, source hash
`279af5c55d8ebe1610686b9dad3e6eeb22b1822037d59a0e5f148c2fb8937f38` (534 files), fingerprint
`bcfbf3916c1103b3b3b49a93117d3346a0bd6921ec35f01feb99bc1a2a6e39eb`.
The supplied optiland checkout is dirty in `pyproject.toml` and `uv.lock`; neither was changed.
Node 24.15.0; Python 3.14.8, numpy 2.3.5, scipy 1.16.3, numba 0.65.1, numpy float64, JIT on.

Run from this repository with its configured read-only checkouts:

```sh
INV=$(mktemp -d /tmp/lvrtc-z50f12.XXXXXX)
node bin/z50f12-investigation.mjs suite "$INV"
LVRTC_RUNS_DIR="$INV/runs" node bin/lvrtc.mjs run "$INV/suite.json"
LVRTC_RUNS_DIR="$INV/runs" node bin/lvrtc.mjs compare z50f12-investigation
node bin/z50f12-investigation.mjs table "$INV" > "$INV/table.md"
node bin/z50f12-investigation.mjs sampling "$INV" > "$INV/sampling.json"
node bin/z50f12-investigation.mjs lv-grid "$INV" > "$INV/lv-grid.json"
node bin/z50f12-investigation.mjs optiland-grid "$INV" > "$INV/optiland-grid.json"
```

From an empty temporary store the whole sequence takes about 11 minutes (re-run at review: the native
table, the fixed-grid LV values, the pupil extents and the FFT steps below came out identical). The helper selects only this key's four
reference-line benchmark conditions. It supplies `fftRays`
128/256/512, wave `bundleGrid` 32/64/128 (returned finer grids 64/128/256), and `wavefrontGrids`
64/128, 128/256, 256/512. `fftRays: 128` adds a diagnostic 64/128 pair; the default stays 128/256,
512 stays 256/512, and geometric sampling is unchanged. R6c has no automatic follow-up. All **48 jobs**
returned ok envelopes; an unavailable or unconverged field is retained inside its envelope. `compare`
exited 0, with recorded differences and attention rows, no request error. The tables cover every frequency
asked by R6c: **0, 10, ..., 100 cycles/mm**, the eleven samples `waveFrequencies` selects from the
LV recipe's default 0:2:100 grid. No claim about unasked intervening frequencies is made.

The best shifts are **-0.047060684177936546 mm** wide open and **-0.000956924723310983 mm** at f/8;
all methods receive LV's plane, and none searches for a different focus. Case vertex-plus-shift rounding
is retained. The `lv-grid` supplement calls the bound LV `traceMtfBundle` and **LV's own `shearedOtf`**
on fixed 32/64/128/256 grids at those same planes, without changing its adaptive product. Every bundle's
border was closed. `optiland-grid` checks the actual FFT endpoint distribution and the raw midpoint
wavefront grids; the Python process is started with `optilandWorkerEnvironment`, hygiene and protected
stdout. Neither supplement commits a prescription or changes an engine. All exported cases and raw data
remain in the temporary directory; only result numbers, counts, keys and hashes appear here.

The added binding export (`src/engines/lv/manifest.ts`) moves the adapter revisions of `lv`, `replay` and
`wave`, and the diagnostic FFT option (`lvrtc_optiland/mtf.py`) that of `optiland` and `optiland-wave`, with
their result-store keys. Existing baselines/reports are deliberately untouched, so a live `baseline check`
reports their records STALE(engine) until they are rewritten. This stage records evidence rather than
rewriting those artifacts.

## Tangential step and convergence

A clipped pupil is a mask, not a disc. Its illuminated extent and its **coordinate pitch** are different
quantities. With an affine stop-to-cosine map, the full stop's coordinate pitch remains the right FFT
pitch even when most cells are dark. Replacing the full width by the live width while keeping the same
number of stop samples would miscalibrate even an ideal affine clipped pupil.

For the current plane image, optiland assigns one tangential lag the frequency
`n * |d_y(+rim) - d_y(-rim)| / ((N-1) * lambda)`. Its endpoint grid has normalized stop pitch
`2/(N-1)`; zero padding is `2N` and does not halve this MTF lag. At half field wide open the
steps are **12.270777 / 6.111328 / 3.049684 cycles/mm** for N=128/256/512. Multiplying by
N-1 gives the same **1558.3886945 cycles/mm** full-rim bandwidth at every resolution. None of
these four rim rays carries light; none is counted lost, and one lands **4.990835 mm** from the
chief ray after being stopped at the design plane (**4.964223 mm** at best focus). The raw-wavefront
operation needs no such rim ray. At full field two
rim rays have no direction and the native FFT provides no curve, so no frequency calibration is inferred
from that missing column.

LV's lattice pitch is `max(beamWidth, beamHeight)/cells`, over a larger scan window, not diameter divided
by the number of columns. The fixed grids below halve that pitch exactly. Both LV's sheared estimate
and wave use this launch geometry; LV's sheared pairs use a local one-dimensional cosine pitch, whereas
wave locates each sheared point in two-dimensional optical-cosine space and accounts for cell area.
The raw-wavefront grids use midpoint stop pitch **2/N**, sphere radial cosines and the comparator's same
Hopkins kernel; there is no uniform assigned frequency lag. Their sphere directions are not traced exit
directions. The actual pupil extents and adjacent-cell pitches are reported below, without inferring a
disc from a vignetting factor.

Largest **tangential** move over the eleven frequencies on the last halving, with its frequency in parentheses:

| Condition | Field | LV fixed 128→256 | wave 128→256 | FFT 256→512 | raw 256→512 |
|---|---:|---:|---:|---:|---:|
| wide, design | 0.5 | 0.001118 (80) | 0.001099 (10)* | 0.003768 (10)* | 0.000534 (10) |
| wide, design | 1 | 0.002359 (20) | 0.002024 (20)* | — | 0.001168 (20) |
| wide, best | 0.5 | 0.000764 (20) | 0.001262 (20) | 0.001209 (10) | 0.000573 (20) |
| wide, best | 1 | 0.002760 (70) | 0.001665 (80)* | — | 0.000949 (20) |
| f/8, design | 0.5 | 0.000178 (30) | 0.000177 (30) | 0.000181 (20) | 0.000125 (60) |
| f/8, design | 1 | 0.000451 (40) | 0.000459 (20) | 0.000190 (40) | 0.000119 (50) |
| f/8, best | 0.5 | 0.000178 (30) | 0.000177 (30) | 0.000181 (20) | 0.000125 (60) |
| f/8, best | 1 | 0.000453 (40) | 0.000460 (20) | 0.000190 (40) | 0.000119 (50) |

A star means the **field** still has a numerical flag; a small T move does not erase an S or phase flag.
At design half field wave's phase step is **0.833286 / 0.472097 / 0.257085 waves** on 64/128/256,
just outside the quarter-wave criterion even on the finest grid. At best half field it is
**0.529229 / 0.309484 / 0.173811**, so the finest is usable. At full field best it is
**0.925522 / 0.628495 / 0.339227**, still unusable. Raw wavefront at 512 is within a quarter wave
at every off-axis field: **0.126927 / 0.211145** (design half/full), **0.089472 / 0.195960** (best).
Its last maximum move over **both** cuts is at most **0.001168** there. At f/8 all phase and grid flags
clear. The fine changes support convergence at the stated bands, not exact physical accuracy.

LV's adaptive product stops at **64/128** cells (half/full) wide open and **32/32** at f/8 at both
planes. Increasing a cap alone would not force a finer pupil. For example, fixed-grid LV T at 100 cycles/mm:

| Condition | Field | 32 cells | 64 | 128 | 256 |
|---|---:|---:|---:|---:|---:|
| wide, design | 0.5 | 0.139738 | 0.148460 | 0.146888 | 0.147285 |
| wide, design | 1 | 0.123475 | 0.120179 | 0.112074 | 0.111258 |
| wide, best | 0.5 | 0.217551 | 0.203097 | 0.202506 | 0.202370 |
| wide, best | 1 | 0.263176 | 0.272469 | 0.277480 | 0.279031 |
| f/8, design | 0.5 | 0.413836 | 0.412770 | 0.413690 | 0.413583 |
| f/8, design | 1 | 0.286864 | 0.288517 | 0.288409 | 0.288060 |
| f/8, best | 0.5 | 0.413892 | 0.412822 | 0.413744 | 0.413637 |
| f/8, best | 1 | 0.287661 | 0.289302 | 0.289202 | 0.288850 |

Thus LV's early stopping and each pupil's rim staircase move values, especially above the product's
50 cycles/mm convergence band, but cannot account for the roughly 0.10 settled FFT offset. This agrees with
the earlier f/8 32-cell note; it does not reclassify that sampling effect as an LV engine defect.

## Measured pupil extents

The following are **lit-center bounds**, not extrapolated continuous edges. Rims are staircases;
more samples approach the extent and divide the pitch, with small nonmonotonic boundary changes.
The LV and wave launch grids have identical geometry at the design and best planes. At 256 cells:

| Aperture | Field | columns × rows | launch cell mm (64 / 128 / 256) | lit cells at 256 | lattice y bounds mm | traced optical-cosine y bounds | local T cosine pitch min / max / median at 256 |
|---|---:|---|---|---:|---|---|---|
| wide | 0.5 | 288 × 224 | 0.675473 / 0.337736 / 0.168868 | 36992 | -16.295783 / 17.140124 | -0.483611 / 0.129825 | 0.003080 / 0.003256 / 0.003093 |
| wide | 1 | 294 × 165 | 0.591039 / 0.295519 / 0.147760 | 22268 | -7.219116 / 10.216527 | -0.511183 / -0.248829 | 0.002182 / 0.002755 / 0.002212 |
| f/8 | 0.5 | 288 × 288 | 0.103854 / 0.051927 / 0.025963 | 51986 | -3.336308 / 3.336308 | -0.230815 / -0.108717 | 0.000475 / 0.000476 / 0.000475 |
| f/8 | 1 | 288 × 288 | 0.103854 / 0.051927 / 0.025963 | 52970 | -3.414199 / 3.336308 | -0.408130 / -0.307106 | 0.000385 / 0.000390 / 0.000389 |

For example the wide half-field median traced pitch is **0.012371 / 0.006186 / 0.003093**
on 64/128/256 cells; full field **0.008849 / 0.004424 / 0.002212**. The corresponding illuminated
cosine widths at 256 are about **0.61344 / 0.26235**, not full discs centered on the chief cosine.
The smaller f/8 pitches and narrow pitch range explain its much easier sampling.

The FFT endpoint and raw midpoint grids below are on the **stop**, with normalized cell steps
**0.015748 / 0.007843 / 0.003914** (FFT 128/256/512) and
**0.015625 / 0.0078125 / 0.00390625** (raw). Bounds and lit counts are at 512. Pitch triples are
the median adjacent-y step at 128/256/512 in **radial reference-sphere optical cosines**,
not traced directions and not optiland's assigned uniform FFT lag. The optiland frame is mirrored in y.

| Condition | Field | Grid distribution | lit at 512 | normalized stop y bounds | radial optical-cosine y bounds | median T cosine pitch 128 / 256 / 512 |
|---|---:|---|---:|---|---|---|
| wide, design | 0.5 | FFT endpoints | 153882 | -0.816047 / 0.753425 | -0.129948 / 0.482975 | 0.006172 / 0.003074 / 0.001534 |
| wide, design | 0.5 | raw midpoints | 154504 | -0.814453 / 0.751953 | -0.129365 / 0.482398 | 0.006123 / 0.003062 / 0.001531 |
| wide, design | 1 | FFT endpoints | 68500 | -0.483366 / 0.326810 | 0.247868 / 0.511880 | 0.005118 / 0.002549 / 0.001272 |
| wide, design | 1 | raw midpoints | 68766 | -0.486328 / 0.326172 | 0.248027 / 0.512782 | 0.005078 / 0.002539 / 0.001269 |
| wide, best | 0.5 | FFT endpoints | 153882 | -0.816047 / 0.753425 | -0.130163 / 0.483184 | 0.006176 / 0.003076 / 0.001535 |
| wide, best | 0.5 | raw midpoints | 154504 | -0.814453 / 0.751953 | -0.129579 / 0.482606 | 0.006128 / 0.003064 / 0.001532 |
| wide, best | 1 | FFT endpoints | 68500 | -0.483366 / 0.326810 | 0.247785 / 0.511988 | 0.005122 / 0.002551 / 0.001273 |
| wide, best | 1 | raw midpoints | 68766 | -0.486328 / 0.326172 | 0.247944 / 0.512891 | 0.005082 / 0.002541 / 0.001270 |
| f/8, design | 0.5 | FFT endpoints | 205012 | -0.996086 / 0.996086 | 0.108516 / 0.230609 | 0.000966 / 0.000481 / 0.000240 |
| f/8, design | 0.5 | raw midpoints | 205892 | -0.998047 / 0.998047 | 0.108395 / 0.230728 | 0.000958 / 0.000479 / 0.000240 |
| f/8, design | 1 | FFT endpoints | 205012 | -0.996086 / 0.996086 | 0.307108 / 0.408223 | 0.000801 / 0.000399 / 0.000199 |
| f/8, design | 1 | raw midpoints | 205892 | -0.998047 / 0.998047 | 0.307008 / 0.408320 | 0.000795 / 0.000397 / 0.000199 |
| f/8, best | 0.5 | FFT endpoints | 205012 | -0.996086 / 0.996086 | 0.108515 / 0.230610 | 0.000966 / 0.000481 / 0.000240 |
| f/8, best | 0.5 | raw midpoints | 205892 | -0.998047 / 0.998047 | 0.108394 / 0.230729 | 0.000958 / 0.000479 / 0.000240 |
| f/8, best | 1 | FFT endpoints | 205012 | -0.996086 / 0.996086 | 0.307107 / 0.408223 | 0.000801 / 0.000399 / 0.000199 |
| f/8, best | 1 | raw midpoints | 205892 | -0.998047 / 0.998047 | 0.307007 / 0.408321 | 0.000795 / 0.000397 / 0.000199 |

At wide-open best half field the FFT pupil's local sphere-cosine pitches at N=512 range from
**0.001417831 to 0.001571209**, median **0.001534889**. Dividing those by lambda gives
**2.413075 to 2.674117 cycles/mm**, median **2.612302**, while optiland assigns **3.049684**
to every lag (16.7% above that median). The assigned number is calibrated from **traced rim
directions**; the diagnostic local values use the declared **reference-sphere model**. They are
not interchangeable models, but this measured mismatch, its persistence on refinement and
the independently settled LV-ray result support attribution to the combined FFT pupil/axis
approximation. The investigation does not apportion the entire residual between its secant scale,
non-affine map and pupil weighting, or claim that one scalar rescaling repairs it. At f/8 the analogous
local pitch range nearly collapses and the methods approach each other.

The FFT pupil itself can still be inspected at full field: `ScalarFFTPSF` has lit wavefront samples
there even though `ScalarFFTMTF` subsequently cannot supply a calibrated curve. These pupil summaries
do not turn that unavailable native FFT answer into a number.

## Full native tables

Each slash-separated group lists its three resolutions in the header's order. `lv` is the adaptive
product at the grid stated above. `*` is the returned field's unconverged flag; `—` is no curve.
The table is generated only from the CLI's stored answers by the `table` command above, rounded
to six decimals. The unrounded answers and all sampling flags stay in the temporary store.

### nikkor-z50f12-ref

| Field | Cut | cycles/mm | lv | wave 64 / 128 / 256 | optiland 128 / 256 / 512 | optiland-wave 128 / 256 / 512 |
|---:|---|---:|---:|---|---|---|
| 0.5 | S | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000* | 1.000000* / 1.000000* / 1.000000* | 1.000000* / 1.000000 / 1.000000 |
| 0.5 | S | 10 | 0.873289 | 0.874693* / 0.873641* / 0.873415* | 0.867736* / 0.871854* / 0.873653* | 0.871215* / 0.871606 / 0.871468 |
| 0.5 | S | 20 | 0.578856 | 0.579727* / 0.579378* / 0.578971* | 0.577338* / 0.580694* / 0.581873* | 0.573455* / 0.574144 / 0.573881 |
| 0.5 | S | 30 | 0.242576 | 0.242535* / 0.242093* / 0.241906* | 0.247924* / 0.245674* / 0.244133* | 0.234312* / 0.234327 / 0.234169 |
| 0.5 | S | 40 | 0.029440 | 0.030356* / 0.030197* / 0.030007* | 0.114805* / 0.059146* / 0.034014* | 0.037816* / 0.038941 / 0.038874 |
| 0.5 | S | 50 | 0.179908 | 0.180274* / 0.180272* / 0.179702* | 0.174772* / 0.187326* / 0.190844* | 0.186391* / 0.188094 / 0.187859 |
| 0.5 | S | 60 | 0.205063 | 0.203974* / 0.203715* / 0.202877* | 0.207205* / 0.218827* / 0.220341* | 0.207831* / 0.209108 / 0.208879 |
| 0.5 | S | 70 | 0.136029 | 0.134230* / 0.133455* / 0.132716* | 0.146234* / 0.152854* / 0.152931* | 0.135618* / 0.135857 / 0.135775 |
| 0.5 | S | 80 | 0.021025 | 0.021333* / 0.019205* / 0.018863* | 0.067276* / 0.036776* / 0.036591* | 0.019706* / 0.019020 / 0.019111 |
| 0.5 | S | 90 | 0.088628 | 0.088225* / 0.090404* / 0.090273* | 0.073751* / 0.079115* / 0.079558* | 0.091161* / 0.092134 / 0.091976 |
| 0.5 | S | 100 | 0.156983 | 0.156558* / 0.159821* / 0.159426* | 0.150708* / 0.157160* / 0.158142* | 0.161316* / 0.161965 / 0.161868 |
| 0.5 | T | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000* | 1.000000* / 1.000000* / 1.000000* | 1.000000* / 1.000000 / 1.000000 |
| 0.5 | T | 10 | 0.806753 | 0.810142* / 0.807208* / 0.806109* | 0.833876* / 0.848610* / 0.852378* | 0.802782* / 0.802899 / 0.802365 |
| 0.5 | T | 20 | 0.540153 | 0.538891* / 0.538027* / 0.538519* | 0.624326* / 0.613919* / 0.611208* | 0.530459* / 0.530456 / 0.530360 |
| 0.5 | T | 30 | 0.406882 | 0.406757* / 0.406860* / 0.407847* | 0.465206* / 0.449498* / 0.448634* | 0.399194* / 0.398662 / 0.398683 |
| 0.5 | T | 40 | 0.352972 | 0.354166* / 0.353862* / 0.353854* | 0.378681* / 0.375984* / 0.374699* | 0.346746* / 0.346050 / 0.345813 |
| 0.5 | T | 50 | 0.303629 | 0.304985* / 0.305826* / 0.305594* | 0.335382* / 0.335598* / 0.335651* | 0.298594* / 0.298043 / 0.297866 |
| 0.5 | T | 60 | 0.258496 | 0.255860* / 0.257176* / 0.257378* | 0.296426* / 0.297341* / 0.297218* | 0.249674* / 0.249201 / 0.249183 |
| 0.5 | T | 70 | 0.219993 | 0.219742* / 0.220411* / 0.221052* | 0.257160* / 0.257038* / 0.256553* | 0.213537* / 0.212834 / 0.212853 |
| 0.5 | T | 80 | 0.195095 | 0.196303* / 0.193751* / 0.194700* | 0.223780* / 0.221833* / 0.221757* | 0.188090* / 0.187219 / 0.187182 |
| 0.5 | T | 90 | 0.173503 | 0.174296* / 0.169708* / 0.170595* | 0.197179* / 0.195720* / 0.195770* | 0.164595* / 0.163917 / 0.163823 |
| 0.5 | T | 100 | 0.148460 | 0.150593* / 0.146698* / 0.147188* | 0.175868* / 0.174981* / 0.175217* | 0.140991* / 0.140914 / 0.140736 |
| 1 | S | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000* | — / — / — | 1.000000* / 1.000000* / 1.000000 |
| 1 | S | 10 | 0.815717 | 0.815497* / 0.815719* / 0.815445* | — / — / — | 0.811809* / 0.811480* / 0.811585 |
| 1 | S | 20 | 0.465835 | 0.463397* / 0.465406* / 0.464226* | — / — / — | 0.456977* / 0.455454* / 0.455611 |
| 1 | S | 30 | 0.169190 | 0.166687* / 0.168939* / 0.167335* | — / — / — | 0.159410* / 0.157953* / 0.157977 |
| 1 | S | 40 | 0.031283 | 0.030655* / 0.030678* / 0.032091* | — / — / — | 0.037754* / 0.038990* / 0.039208 |
| 1 | S | 50 | 0.138790 | 0.135701* / 0.138640* / 0.138944* | — / — / — | 0.141394* / 0.141650* / 0.142291 |
| 1 | S | 60 | 0.150268 | 0.146813* / 0.150856* / 0.150455* | — / — / — | 0.149695* / 0.148679* / 0.149265 |
| 1 | S | 70 | 0.099650 | 0.098954* / 0.100611* / 0.100691* | — / — / — | 0.096813* / 0.095784* / 0.095866 |
| 1 | S | 80 | 0.039875 | 0.043260* / 0.040107* / 0.040899* | — / — / — | 0.035251* / 0.035268* / 0.035122 |
| 1 | S | 90 | 0.000617 | 0.004367* / 0.000809* / 0.000008* | — / — / — | 0.004893* / 0.004233* / 0.004308 |
| 1 | S | 100 | 0.016873 | 0.013112* / 0.017245* / 0.016838* | — / — / — | 0.019415* / 0.018942* / 0.018867 |
| 1 | T | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000* | — / — / — | 1.000000* / 1.000000* / 1.000000 |
| 1 | T | 10 | 0.860736 | 0.861353* / 0.861108* / 0.862180* | — / — / — | 0.861510* / 0.861673* / 0.862530 |
| 1 | T | 20 | 0.713608 | 0.709228* / 0.714021* / 0.716044* | — / — / — | 0.712185* / 0.712323* / 0.713491 |
| 1 | T | 30 | 0.575396 | 0.571571* / 0.574894* / 0.576759* | — / — / — | 0.572757* / 0.572350* / 0.573361 |
| 1 | T | 40 | 0.455510 | 0.454492* / 0.455565* / 0.456427* | — / — / — | 0.453074* / 0.452230* / 0.452914 |
| 1 | T | 50 | 0.359355 | 0.362410* / 0.358154* / 0.358628* | — / — / — | 0.355682* / 0.355621* / 0.355775 |
| 1 | T | 60 | 0.280584 | 0.284066* / 0.279778* / 0.280442* | — / — / — | 0.278472* / 0.279270* / 0.278852 |
| 1 | T | 70 | 0.221262 | 0.226773* / 0.220448* / 0.219624* | — / — / — | 0.218312* / 0.218972* / 0.218496 |
| 1 | T | 80 | 0.175085 | 0.181412* / 0.173557* / 0.172315* | — / — / — | 0.172250* / 0.172272* / 0.171820 |
| 1 | T | 90 | 0.137677 | 0.141243* / 0.137132* / 0.136718* | — / — / — | 0.137807* / 0.136849* / 0.136338 |
| 1 | T | 100 | 0.112074 | 0.116656* / 0.110340* / 0.110313* | — / — / — | 0.111705* / 0.110059* / 0.109669 |

### nikkor-z50f12-best-ref

| Field | Cut | cycles/mm | lv | wave 64 / 128 / 256 | optiland 128 / 256 / 512 | optiland-wave 128 / 256 / 512 |
|---:|---|---:|---:|---|---|---|
| 0.5 | S | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000 | 1.000000* / 1.000000 / 1.000000 | 1.000000* / 1.000000 / 1.000000 |
| 0.5 | S | 10 | 0.934604 | 0.934894* / 0.934487* / 0.934450 | 0.932683* / 0.934476 / 0.935084 | 0.930665* / 0.930917 / 0.930886 |
| 0.5 | S | 20 | 0.815873 | 0.816070* / 0.816114* / 0.815954 | 0.815935* / 0.815547 / 0.815027 | 0.806370* / 0.806945 / 0.806842 |
| 0.5 | S | 30 | 0.723442 | 0.724171* / 0.724573* / 0.724298 | 0.720500* / 0.717147 / 0.715704 | 0.712254* / 0.712600 / 0.712420 |
| 0.5 | S | 40 | 0.673529 | 0.674697* / 0.674548* / 0.674202 | 0.662749* / 0.660210 / 0.659535 | 0.662829* / 0.662630 / 0.662391 |
| 0.5 | S | 50 | 0.637406 | 0.638315* / 0.636971* / 0.636661 | 0.622374* / 0.622564 / 0.622855 | 0.626167* / 0.625724 / 0.625440 |
| 0.5 | S | 60 | 0.592630 | 0.593485* / 0.591012* / 0.590768 | 0.579284* / 0.580398 / 0.580558 | 0.580003* / 0.579747 / 0.579429 |
| 0.5 | S | 70 | 0.540859 | 0.540742* / 0.538337* / 0.538152 | 0.529070* / 0.529069 / 0.528964 | 0.526510* / 0.526525 / 0.526197 |
| 0.5 | S | 80 | 0.490465 | 0.489963* / 0.488155* / 0.488107 | 0.477642* / 0.476466 / 0.476396 | 0.475869* / 0.475965 / 0.475638 |
| 0.5 | S | 90 | 0.446020 | 0.445886* / 0.444663* / 0.444875 | 0.430987* / 0.429901 / 0.429876 | 0.432630* / 0.432602 / 0.432293 |
| 0.5 | S | 100 | 0.408523 | 0.407989* / 0.406398* / 0.406974 | 0.390500* / 0.389945 / 0.390052 | 0.395048* / 0.394806 / 0.394548 |
| 0.5 | T | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000 | 1.000000* / 1.000000 / 1.000000 | 1.000000* / 1.000000 / 1.000000 |
| 0.5 | T | 10 | 0.945486 | 0.948709* / 0.946592* / 0.945675 | 0.952615* / 0.956528 / 0.957737 | 0.944982* / 0.945168 / 0.944775 |
| 0.5 | T | 20 | 0.849850 | 0.852620* / 0.851289* / 0.850027 | 0.878968* / 0.881045 / 0.881094 | 0.848366* / 0.848866 / 0.848294 |
| 0.5 | T | 30 | 0.751331 | 0.751120* / 0.750556* / 0.749936 | 0.796120* / 0.796216 / 0.796080 | 0.747284* / 0.747834 / 0.747479 |
| 0.5 | T | 40 | 0.656564 | 0.656256* / 0.655386* / 0.655456 | 0.713604* / 0.713223 / 0.712883 | 0.652381* / 0.652775 / 0.652664 |
| 0.5 | T | 50 | 0.569910 | 0.567596* / 0.566845* / 0.567282 | 0.634935* / 0.634373 / 0.634158 | 0.564482* / 0.564671 / 0.564677 |
| 0.5 | T | 60 | 0.487127 | 0.484348* / 0.483911* / 0.484343 | 0.561180* / 0.560106 / 0.559933 | 0.482420* / 0.482370 / 0.482427 |
| 0.5 | T | 70 | 0.406209 | 0.406665* / 0.405812* / 0.406026 | 0.491516* / 0.489977 / 0.489741 | 0.405318* / 0.405020 / 0.405083 |
| 0.5 | T | 80 | 0.331614 | 0.332986* / 0.332398* / 0.332428 | 0.425276* / 0.423412 / 0.423331 | 0.332906* / 0.332537 / 0.332547 |
| 0.5 | T | 90 | 0.265203 | 0.265720* / 0.264343* / 0.264186 | 0.362498* / 0.360672 / 0.360572 | 0.265835* / 0.265420 / 0.265395 |
| 0.5 | T | 100 | 0.203097 | 0.203836* / 0.202685* / 0.202284 | 0.303374* / 0.301839 / 0.301717 | 0.205024* / 0.204600 / 0.204518 |
| 1 | S | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000* | — / — / — | 1.000000* / 1.000000* / 1.000000 |
| 1 | S | 10 | 0.795697 | 0.793858* / 0.795509* / 0.795444* | — / — / — | 0.788624* / 0.788201* / 0.788279 |
| 1 | S | 20 | 0.643094 | 0.642556* / 0.643171* / 0.643085* | — / — / — | 0.634971* / 0.634968* / 0.635344 |
| 1 | S | 30 | 0.537937 | 0.540531* / 0.537501* / 0.537593* | — / — / — | 0.529547* / 0.529506* / 0.529823 |
| 1 | S | 40 | 0.419222 | 0.419043* / 0.418868* / 0.417534* | — / — / — | 0.408528* / 0.408222* / 0.408334 |
| 1 | S | 50 | 0.325030 | 0.323463* / 0.325012* / 0.323768* | — / — / — | 0.315589* / 0.313914* / 0.313756 |
| 1 | S | 60 | 0.223697 | 0.226032* / 0.223795* / 0.223390* | — / — / — | 0.214158* / 0.212641* / 0.212285 |
| 1 | S | 70 | 0.152230 | 0.153643* / 0.152469* / 0.151393* | — / — / — | 0.142790* / 0.141534* / 0.141314 |
| 1 | S | 80 | 0.088532 | 0.087660* / 0.088424* / 0.087266* | — / — / — | 0.079440* / 0.077928* / 0.077488 |
| 1 | S | 90 | 0.041785 | 0.043475* / 0.041792* / 0.041152* | — / — / — | 0.032873* / 0.032304* / 0.032072 |
| 1 | S | 100 | 0.013697 | 0.013733* / 0.013747* / 0.013252* | — / — / — | 0.006692* / 0.005904* / 0.005599 |
| 1 | T | 0 | 1.000000 | 1.000000* / 1.000000* / 1.000000* | — / — / — | 1.000000* / 1.000000* / 1.000000 |
| 1 | T | 10 | 0.874666 | 0.876408* / 0.875102* / 0.875547* | — / — / — | 0.875769* / 0.875930* / 0.876620 |
| 1 | T | 20 | 0.711669 | 0.710232* / 0.711452* / 0.711694* | — / — / — | 0.711400* / 0.710678* / 0.711627 |
| 1 | T | 30 | 0.530567 | 0.530174* / 0.531299* / 0.530872* | — / — / — | 0.532490* / 0.530541* / 0.531312 |
| 1 | T | 40 | 0.365554 | 0.367898* / 0.365687* / 0.364246* | — / — / — | 0.367366* / 0.364551* / 0.365235 |
| 1 | T | 50 | 0.250787 | 0.252660* / 0.251455* / 0.250513* | — / — / — | 0.252919* / 0.251320* / 0.251886 |
| 1 | T | 60 | 0.216388 | 0.214006* / 0.216905* / 0.217409* | — / — / — | 0.216513* / 0.216940* / 0.217636 |
| 1 | T | 70 | 0.233395 | 0.226886* / 0.235005* / 0.236397* | — / — / — | 0.234559* / 0.235454* / 0.236176 |
| 1 | T | 80 | 0.259814 | 0.253556* / 0.261314* / 0.262979* | — / — / — | 0.260240* / 0.261147* / 0.261887 |
| 1 | T | 90 | 0.277502 | 0.277862* / 0.277685* / 0.278177* | — / — / — | 0.274772* / 0.275955* / 0.276738 |
| 1 | T | 100 | 0.277480 | 0.278098* / 0.280600* / 0.281074* | — / — / — | 0.277164* / 0.278481* / 0.279177 |

### nikkor-z50f12-f8-ref

| Field | Cut | cycles/mm | lv | wave 64 / 128 / 256 | optiland 128 / 256 / 512 | optiland-wave 128 / 256 / 512 |
|---:|---|---:|---:|---|---|---|
| 0.5 | S | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 0.5 | S | 10 | 0.940003 | 0.939906 / 0.939457 / 0.939516 | 0.939786 / 0.939628 / 0.939527 | 0.939424 / 0.939315 / 0.939321 |
| 0.5 | S | 20 | 0.877616 | 0.877443 / 0.876697 / 0.876826 | 0.877227 / 0.876903 / 0.876711 | 0.876509 / 0.876362 / 0.876458 |
| 0.5 | S | 30 | 0.814275 | 0.814013 / 0.813290 / 0.813314 | 0.813714 / 0.813350 / 0.813220 | 0.812926 / 0.812871 / 0.812887 |
| 0.5 | S | 40 | 0.751010 | 0.750627 / 0.750214 / 0.750260 | 0.750483 / 0.750298 / 0.750144 | 0.750058 / 0.749734 / 0.749793 |
| 0.5 | S | 50 | 0.688354 | 0.689080 / 0.688467 / 0.688459 | 0.688673 / 0.688502 / 0.688304 | 0.688179 / 0.687872 / 0.687958 |
| 0.5 | S | 60 | 0.627953 | 0.629372 / 0.628419 / 0.628414 | 0.628498 / 0.628397 / 0.628260 | 0.628120 / 0.627800 / 0.627909 |
| 0.5 | S | 70 | 0.570162 | 0.571213 / 0.570437 / 0.570440 | 0.570549 / 0.570422 / 0.570326 | 0.570233 / 0.569884 / 0.569962 |
| 0.5 | S | 80 | 0.515101 | 0.515612 / 0.514698 / 0.514759 | 0.514851 / 0.514733 / 0.514650 | 0.514605 / 0.514228 / 0.514313 |
| 0.5 | S | 90 | 0.461050 | 0.462051 / 0.461408 / 0.461415 | 0.461301 / 0.461409 / 0.461290 | 0.461322 / 0.460898 / 0.460978 |
| 0.5 | S | 100 | 0.410194 | 0.410964 / 0.410417 / 0.410388 | 0.410126 / 0.410348 / 0.410251 | 0.410417 / 0.409902 / 0.409990 |
| 0.5 | T | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 0.5 | T | 10 | 0.939183 | 0.939075 / 0.939076 / 0.939060 | 0.939287 / 0.939123 / 0.939018 | 0.938943 / 0.938827 / 0.938835 |
| 0.5 | T | 20 | 0.878305 | 0.878092 / 0.878092 / 0.878060 | 0.878516 / 0.878188 / 0.878007 | 0.877861 / 0.877726 / 0.877805 |
| 0.5 | T | 30 | 0.817412 | 0.817094 / 0.817179 / 0.817356 | 0.817732 / 0.817422 / 0.817285 | 0.817159 / 0.817011 / 0.817045 |
| 0.5 | T | 40 | 0.756536 | 0.756338 / 0.757144 / 0.757079 | 0.757337 / 0.757161 / 0.756999 | 0.757064 / 0.756687 / 0.756767 |
| 0.5 | T | 50 | 0.695694 | 0.697282 / 0.697436 / 0.697400 | 0.697565 / 0.697498 / 0.697334 | 0.697438 / 0.697019 / 0.697104 |
| 0.5 | T | 60 | 0.638013 | 0.638269 / 0.638437 / 0.638561 | 0.638546 / 0.638570 / 0.638419 | 0.638544 / 0.638092 / 0.638217 |
| 0.5 | T | 70 | 0.581035 | 0.580298 / 0.580451 / 0.580546 | 0.580539 / 0.580496 / 0.580442 | 0.580664 / 0.580161 / 0.580250 |
| 0.5 | T | 80 | 0.524091 | 0.523249 / 0.523625 / 0.523616 | 0.523538 / 0.523583 / 0.523507 | 0.523778 / 0.523311 / 0.523362 |
| 0.5 | T | 90 | 0.467176 | 0.467341 / 0.467954 / 0.467964 | 0.467659 / 0.467901 / 0.467815 | 0.468192 / 0.467642 / 0.467728 |
| 0.5 | T | 100 | 0.413836 | 0.412790 / 0.413709 / 0.413603 | 0.413289 / 0.413614 / 0.413558 | 0.414111 / 0.413459 / 0.413540 |
| 1 | S | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 1 | S | 10 | 0.920744 | 0.919878 / 0.919427 / 0.919629 | 0.920029 / 0.919867 / 0.919773 | 0.919444 / 0.919360 / 0.919365 |
| 1 | S | 20 | 0.817507 | 0.815878 / 0.815189 / 0.815418 | 0.816345 / 0.815945 / 0.815752 | 0.814954 / 0.814961 / 0.815025 |
| 1 | S | 30 | 0.706542 | 0.704094 / 0.703691 / 0.703743 | 0.704894 / 0.704419 / 0.704234 | 0.703137 / 0.703200 / 0.703241 |
| 1 | S | 40 | 0.599479 | 0.596125 / 0.596167 / 0.596152 | 0.597449 / 0.596974 / 0.596737 | 0.595562 / 0.595537 / 0.595623 |
| 1 | S | 50 | 0.502806 | 0.499871 / 0.499686 / 0.499611 | 0.500864 / 0.500466 / 0.500222 | 0.498947 / 0.499008 / 0.499066 |
| 1 | S | 60 | 0.418854 | 0.417470 / 0.417244 / 0.417212 | 0.418498 / 0.418091 / 0.417826 | 0.416498 / 0.416632 / 0.416730 |
| 1 | S | 70 | 0.350012 | 0.349411 / 0.349516 / 0.349491 | 0.350820 / 0.350265 / 0.350087 | 0.348846 / 0.349006 / 0.349065 |
| 1 | S | 80 | 0.295357 | 0.295285 / 0.295313 / 0.295266 | 0.296513 / 0.296074 / 0.295808 | 0.294630 / 0.294877 / 0.294921 |
| 1 | S | 90 | 0.252854 | 0.252809 / 0.252702 / 0.252510 | 0.253688 / 0.253295 / 0.253059 | 0.251990 / 0.252224 / 0.252297 |
| 1 | S | 100 | 0.218754 | 0.219624 / 0.219323 / 0.218949 | 0.219942 / 0.219749 / 0.219516 | 0.218697 / 0.218776 / 0.218866 |
| 1 | T | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 1 | T | 10 | 0.923096 | 0.923207 / 0.922767 / 0.922649 | 0.923243 / 0.923051 / 0.922926 | 0.922643 / 0.922515 / 0.922527 |
| 1 | T | 20 | 0.841274 | 0.841600 / 0.841147 / 0.840688 | 0.841591 / 0.841190 / 0.841065 | 0.840472 / 0.840476 / 0.840501 |
| 1 | T | 30 | 0.757815 | 0.758290 / 0.757779 / 0.757535 | 0.758111 / 0.757982 / 0.757872 | 0.757479 / 0.757187 / 0.757249 |
| 1 | T | 40 | 0.675232 | 0.676636 / 0.676507 / 0.676060 | 0.676687 / 0.676529 / 0.676339 | 0.676010 / 0.675689 / 0.675764 |
| 1 | T | 50 | 0.596992 | 0.599495 / 0.598941 / 0.598600 | 0.598927 / 0.598905 / 0.598741 | 0.598570 / 0.598174 / 0.598293 |
| 1 | T | 60 | 0.525749 | 0.527415 / 0.526833 / 0.526462 | 0.526537 / 0.526502 / 0.526436 | 0.526456 / 0.526048 / 0.526119 |
| 1 | T | 70 | 0.458874 | 0.460655 / 0.460318 / 0.459906 | 0.459790 / 0.459857 / 0.459743 | 0.459881 / 0.459526 / 0.459598 |
| 1 | T | 80 | 0.397894 | 0.399108 / 0.399001 / 0.398592 | 0.398172 / 0.398385 / 0.398291 | 0.398716 / 0.398225 / 0.398308 |
| 1 | T | 90 | 0.340979 | 0.341736 / 0.341905 / 0.341514 | 0.340738 / 0.341182 / 0.341128 | 0.341735 / 0.341150 / 0.341256 |
| 1 | T | 100 | 0.286864 | 0.288118 / 0.288022 / 0.287670 | 0.286693 / 0.287194 / 0.287215 | 0.287869 / 0.287381 / 0.287420 |

### nikkor-z50f12-f8-best-ref

| Field | Cut | cycles/mm | lv | wave 64 / 128 / 256 | optiland 128 / 256 / 512 | optiland-wave 128 / 256 / 512 |
|---:|---|---:|---:|---|---|---|
| 0.5 | S | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 0.5 | S | 10 | 0.940108 | 0.940010 / 0.939561 / 0.939620 | 0.939890 / 0.939732 / 0.939631 | 0.939529 / 0.939420 / 0.939426 |
| 0.5 | S | 20 | 0.877968 | 0.877794 / 0.877047 / 0.877176 | 0.877575 / 0.877251 / 0.877060 | 0.876861 / 0.876714 / 0.876809 |
| 0.5 | S | 30 | 0.814933 | 0.814669 / 0.813943 / 0.813966 | 0.814364 / 0.814001 / 0.813871 | 0.813583 / 0.813526 / 0.813542 |
| 0.5 | S | 40 | 0.751969 | 0.751585 / 0.751167 / 0.751213 | 0.751432 / 0.751248 / 0.751095 | 0.751017 / 0.750690 / 0.750749 |
| 0.5 | S | 50 | 0.689576 | 0.690295 / 0.689677 / 0.689668 | 0.689877 / 0.689709 / 0.689512 | 0.689396 / 0.689085 / 0.689171 |
| 0.5 | S | 60 | 0.629370 | 0.630778 / 0.629818 / 0.629812 | 0.629890 / 0.629792 / 0.629656 | 0.629527 / 0.629202 / 0.629311 |
| 0.5 | S | 70 | 0.571688 | 0.572730 / 0.571946 / 0.571948 | 0.572050 / 0.571927 / 0.571832 | 0.571751 / 0.571396 / 0.571474 |
| 0.5 | S | 80 | 0.516654 | 0.517159 / 0.516236 / 0.516297 | 0.516380 / 0.516267 / 0.516185 | 0.516152 / 0.515770 / 0.515855 |
| 0.5 | S | 90 | 0.462569 | 0.463554 / 0.462902 / 0.462907 | 0.462784 / 0.462897 / 0.462780 | 0.462825 / 0.462395 / 0.462475 |
| 0.5 | S | 100 | 0.411609 | 0.412360 / 0.411803 / 0.411772 | 0.411501 / 0.411729 / 0.411633 | 0.411814 / 0.411292 / 0.411380 |
| 0.5 | T | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 0.5 | T | 10 | 0.939189 | 0.939081 / 0.939082 / 0.939066 | 0.939293 / 0.939129 / 0.939024 | 0.938950 / 0.938834 / 0.938842 |
| 0.5 | T | 20 | 0.878324 | 0.878110 / 0.878111 / 0.878079 | 0.878535 / 0.878206 / 0.878025 | 0.877881 / 0.877746 / 0.877825 |
| 0.5 | T | 30 | 0.817445 | 0.817127 / 0.817212 / 0.817389 | 0.817765 / 0.817455 / 0.817318 | 0.817194 / 0.817047 / 0.817081 |
| 0.5 | T | 40 | 0.756583 | 0.756383 / 0.757190 / 0.757125 | 0.757383 / 0.757207 / 0.757045 | 0.757114 / 0.756737 / 0.756816 |
| 0.5 | T | 50 | 0.695752 | 0.697338 / 0.697493 / 0.697456 | 0.697621 / 0.697554 / 0.697390 | 0.697499 / 0.697079 / 0.697164 |
| 0.5 | T | 60 | 0.638077 | 0.638331 / 0.638500 / 0.638624 | 0.638608 / 0.638632 / 0.638482 | 0.638612 / 0.638160 / 0.638285 |
| 0.5 | T | 70 | 0.581101 | 0.580363 / 0.580516 / 0.580611 | 0.580604 / 0.580561 / 0.580506 | 0.580735 / 0.580232 / 0.580321 |
| 0.5 | T | 80 | 0.524156 | 0.523312 / 0.523689 / 0.523681 | 0.523601 / 0.523646 / 0.523570 | 0.523850 / 0.523382 / 0.523433 |
| 0.5 | T | 90 | 0.467237 | 0.467400 / 0.468015 / 0.468025 | 0.467718 / 0.467960 / 0.467874 | 0.468260 / 0.467710 / 0.467796 |
| 0.5 | T | 100 | 0.413892 | 0.412843 / 0.413764 / 0.413657 | 0.413342 / 0.413667 / 0.413611 | 0.414173 / 0.413520 / 0.413602 |
| 1 | S | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 1 | S | 10 | 0.921079 | 0.920214 / 0.919762 / 0.919965 | 0.920363 / 0.920200 / 0.920106 | 0.919782 / 0.919696 / 0.919701 |
| 1 | S | 20 | 0.818596 | 0.816964 / 0.816274 / 0.816505 | 0.817425 / 0.817026 / 0.816833 | 0.816045 / 0.816050 / 0.816114 |
| 1 | S | 30 | 0.708476 | 0.706026 / 0.705620 / 0.705676 | 0.706814 / 0.706341 / 0.706157 | 0.705075 / 0.705134 / 0.705175 |
| 1 | S | 40 | 0.602135 | 0.598783 / 0.598821 / 0.598811 | 0.600090 / 0.599620 / 0.599384 | 0.598227 / 0.598196 / 0.598282 |
| 1 | S | 50 | 0.505962 | 0.503032 / 0.502844 / 0.502774 | 0.504009 / 0.503615 / 0.503372 | 0.502115 / 0.502169 / 0.502227 |
| 1 | S | 60 | 0.422274 | 0.420892 / 0.420662 / 0.420635 | 0.421901 / 0.421501 / 0.421236 | 0.419926 / 0.420051 / 0.420150 |
| 1 | S | 70 | 0.353476 | 0.352876 / 0.352977 / 0.352957 | 0.354266 / 0.353718 / 0.353541 | 0.352315 / 0.352465 / 0.352525 |
| 1 | S | 80 | 0.298690 | 0.298622 / 0.298645 / 0.298603 | 0.299831 / 0.299399 / 0.299134 | 0.297969 / 0.298206 / 0.298251 |
| 1 | S | 90 | 0.255929 | 0.255895 / 0.255782 / 0.255596 | 0.256754 / 0.256369 / 0.256134 | 0.255075 / 0.255300 / 0.255373 |
| 1 | S | 100 | 0.221496 | 0.222375 / 0.222068 / 0.221700 | 0.222676 / 0.222489 / 0.222257 | 0.221447 / 0.221516 / 0.221607 |
| 1 | T | 0 | 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 | 1.000000 / 1.000000 / 1.000000 |
| 1 | T | 10 | 0.923220 | 0.923330 / 0.922891 / 0.922773 | 0.923366 / 0.923174 / 0.923048 | 0.922768 / 0.922641 / 0.922653 |
| 1 | T | 20 | 0.841696 | 0.842019 / 0.841569 / 0.841109 | 0.842010 / 0.841609 / 0.841484 | 0.840897 / 0.840901 / 0.840926 |
| 1 | T | 30 | 0.758596 | 0.759067 / 0.758560 / 0.758314 | 0.758888 / 0.758760 / 0.758649 | 0.758266 / 0.757972 / 0.758034 |
| 1 | T | 40 | 0.676338 | 0.677736 / 0.677611 / 0.677163 | 0.677788 / 0.677631 / 0.677442 | 0.677121 / 0.676799 / 0.676874 |
| 1 | T | 50 | 0.598323 | 0.600818 / 0.600271 / 0.599928 | 0.600253 / 0.600234 / 0.600070 | 0.599908 / 0.599509 / 0.599628 |
| 1 | T | 60 | 0.527179 | 0.528834 / 0.528260 / 0.527885 | 0.527959 / 0.527926 / 0.527861 | 0.527890 / 0.527479 / 0.527550 |
| 1 | T | 70 | 0.460271 | 0.462040 / 0.461712 / 0.461296 | 0.461176 / 0.461247 / 0.461134 | 0.461283 / 0.460923 / 0.460995 |
| 1 | T | 80 | 0.399153 | 0.400352 / 0.400254 / 0.399841 | 0.399416 / 0.399633 / 0.399540 | 0.399977 / 0.399481 / 0.399564 |
| 1 | T | 90 | 0.342025 | 0.342765 / 0.342943 / 0.342548 | 0.341765 / 0.342213 / 0.342160 | 0.342781 / 0.342191 / 0.342297 |
| 1 | T | 100 | 0.287661 | 0.288898 / 0.288810 / 0.288454 | 0.287469 / 0.287974 / 0.287996 | 0.288664 / 0.288172 / 0.288211 |

## Verification

- `LVRTC_LV_PATH=/nonexistent LVRTC_OPTILAND_PYTHON=/nonexistent npm run check`: passes;
  typecheck, lint, format, hermetic Node/Python tests and four committed-baseline/report checks.
- `npm run test:lv`: 95 passed, none skipped.
- `npm run test:optiland`: 41 passed, none skipped, including the real-worker Python suite.
- The additional real-calibrator / diagnostic read-back tests pass on the configured optiland interpreter.
  The fixed-grid LV test also passes; the evidence table matches the CLI store's generated table exactly.
- Both read-only checkouts retain their original status and source identities. No baseline, reports/ or
  policy file was edited, and no git mutation or issue submission was performed.
