# LensVisualizer: the summary tab's f-numbers and the stop they are of

Status: **resolved by LensVisualizer #933** (`445fa1711`, adopted by the comparator at Stage 6.8b,
LV `607ff23ae`, engine closure `f016b35b`). Decided by the owner on 2026-10-27 and not filed. LensVisualizer
presents OpticStudio's three f-numbers under their names, "Image-space f/#" (EFL / EPD of the paraxial pupil),
"Paraxial working f/#" (`1 / (2 n' |u'|)` of its own paraxial marginal ray at the current focus; it replaces the
thin-lens "eff. f/" beside the mark) and "Working f/#" (`computeWorkingFNumber`, `1 / (2 n' sin θ')` of the real
marginal ray aimed at the stop's rim), and sizes the stop by one rule at every f-number, the paraxial entrance pupil
`EFL / N` (`stopSemiDiameterForFNumber`, capped at the iris wide open; an authored schedule and a fixed iris kept),
in place of the real sizing ray and the linear stop-down. The canaries of the lines quoted below failed first and were
restated; the stop radius and case id of nearly every case moved; the summary's request, R12b's asks and the measurements were
redone (`docs/REFERENCE.md`, "Stage 6.8b": on the benchmark the image-space f-numbers within 1.1e-14 of optiland's,
the paraxial working ones within 2.0e-14, the working ones within 3.4e-9, the pupils within 8.5e-14 mm, the pupil to
the bit of R1's). The history follows as it was written. Observed at LV `098c91ef6` (clean; engine closure `fef2e248`) and optiland `4e893f53`. The comparator reports LensVisualizer's summary tab as it is and changes no gate for this: rung R1 judges
its first-order readouts (`test/integration/lv/summary.test.ts`: the cardinal focal length, back and front focus and
hiatus to the bit, the focal lengths within 8 units in the last place, the entrance pupil and the "Working f/#" within
3.4e-11 relative), and rung R12b records the tab and the aperture control beside optiland's own accessors and working
f-number. This brief changes no LV source or prescription. It holds results and lens keys only.

The owner's principle (2026-10-27) is that LensVisualizer be consistent with itself, with few exceptions, and match
OpticStudio with ray aiming and CODE V where it can. Every first-order value LensVisualizer computes from its prepared
state does (section 4). What follows are its f-numbers, which do not: they are of three definitions under two labels,
and the stop they are of is sized by one rule wide open and another stopped down.

## 1. "Working f/#" is the image-space f-number of the focused state

`computeOpticalSummary` (`src/optics/analysis/summary/summary.ts`) presents, under the label "Working f/#",

```ts
Math.abs(currentEFLMm) / entrancePupilDiameterMm
```

the current focal length of the prepared state over the hook's entrance pupil. That is OpticStudio's **Image Space
F/#**: the paraxial focal length over the paraxial entrance pupil diameter, defined at infinite conjugates whatever the
object distance. OpticStudio's **Working F/#** is `1 / (2 n' sin θ')` of the real marginal ray at the actual conjugate;
its **Paraxial Working F/#** is the same of the paraxial marginal ray.

**Measured.** The tab's value is optiland's `FNO()` (`f2() / EPD()`) to 1.45e-10 on every state of the three suites. The
working f-number of the real rim rays (optiland's `get_working_FNO` under robust aiming, OpticStudio's definition):

| Lens key | State | Tab "Working f/#" | Working F/#, real rim rays | Marked |
|---|---|---:|---:|---:|
| `nikon-z-135f18-plena` | wide open, infinity | 1.760 | 1.849 | 1.85 |
| `sony-fe-20mm-f18-g` | wide open, infinity | 1.772 | 1.844 | 1.85 |
| `nikkor-z50f12` | wide open, infinity | 1.186 | 1.229 | 1.23 |
| `sigma-105mm-f28-dg-dn-macro-art` | 1:2 station | 1.725 | 3.862 | 2.9 (eff. 4.22) |
| `sigma-105mm-f28-dg-dn-macro-art` | 1:1 station | 1.028 | 4.747 | 2.9 (eff. 4.32) |
| `tamron-f072-90mm-f28-di-iii-macro-vxd` | 1:1 station | 0.856 | 3.378 | 2.909 (eff. 3.82) |

At infinity the tab's value is up to 4.8% below the working f-number; at close focus it is no working f-number at all,
since the focused focal length shrinks while the pupil is of rays parallel to the axis.

**Options.** (a) Label the value "f/# (infinity)" or "Image-space f/#", as OpticStudio does; or (b) compute a working
f-number: `1 / (2 n' sin θ')` of the real marginal ray from the current conjugate's axial point through the stop's rim
(LensVisualizer's chief-ray solve already aims through the stop), or its paraxial counterpart of LensVisualizer's own
kernel. Either is consistent with the aperture control (section 3) only if that uses the same definition.

## 2. The stop is sized by a real ray wide open and scaled linearly stopped down

`computeLensConstants` (`src/optics/first-order/lensConstants.ts`):

```ts
const nominalEPSD = apertureReferenceFocalLength / (2 * baseNomFno);
const nomRealY = realTraceStopHeight(geometry, nominalEPSD, 0, stopIdx);
S[stopIdx].sd = isFinite(nomRealY) && Math.abs(nomRealY) > 1e-15 ? nomRealY : nominalEPSD * nomYRatio;
```

The wide-open stop is the height at the stop of a real ray entering parallel at `EFL / (2 N)`, unaimed and traced
without aperture checks; a zoom sizes each station so with its own N, and `wideOpenStopAtZoom` interpolates between
stations. The exceptions: a published stop schedule (`zoomStopSemiDiameters`) is authored; a stop inside an element
keeps its authored radius; a fixed-iris zoom keeps its first station's radius; a fisheye takes its projection's focal
length for `EFL`; where the real ray fails, the paraxial height `nominalEPSD × yRatio` stands in. That ray is the
marginal ray, and where the sine condition holds its working f-number is close to N: wide open the mark is within 0.34%
of the real rim rays' working f-number on all 12 benchmark configurations (the Canon EF 135 mm 2.0598 against 2.0598). The hook then stops down linearly (`useLensComputation.ts`):

```ts
const currentPhysStopSD = L ? (wideOpenStopSD * currentFOPEN) / fNumber : 0;
```

as though the wide-open stop were the paraxial image of `EFL / (2 N)`. It is not: its paraxial image is up to 5.1%
wider (the Plena's 75.16 mm against 71.51 mm), and every stopped-down state inherits the ratio:

| Lens key | Marked | Working F/#, real rim rays | Tab "Working f/#" |
|---|---:|---:|---:|
| `nikon-z-135f18-plena` | f/5.6 | 5.358 | 5.328 |
| `nikon-z-135f18-plena` | f/8 (the MTF tab's comparison) | 7.632 | 7.612 |
| `nikon-z-135f18-plena` | f/11 | 10.481 | 10.466 |
| `sony-fe-20mm-f18-g` | f/11 | 10.545 | 10.534 |
| `fujifilm-fujinon-gf-63mm-f28-r-wr` | f/11 | 11.048 | 11.053 |

So a marked f/11 is up to 4.95% faster than f/11 by either definition, while a marked wide-open aperture is right by
the real one and up to 4.9% off by the paraxial one.

**Options.** One rule at every N: (a) paraxial, the stop the paraxial image of an entrance pupil of `EFL / N`
(OpticStudio's Image Space F/# system aperture; the tab's image-space f-number is then N exactly); or (b) real, the stop
at each N whose aimed marginal ray's working f-number is N (the wide-open rule, applied at every N). (b) keeps today's
wide-open stops; (a) moves them by up to 5%. Every case's stop radius, and so every case id and baseline, moves with
either; the comparator follows LensVisualizer's stop whatever it is (it is the case's).

## 3. "eff. f/" is a thin-lens estimate of stored pupils

The aperture control shows `effectiveFNumber(fNumber, focusT, zoomT, L, aberrationT)` beside the mark at close focus
(`src/optics/first-order/fNumber.ts`): `N (1 + |m| / p)`, `m` the thin-lens magnification of the focused focal length at
the authored focus distance, `p` the stored infinity pupils' ratio. Against the paraxial working f-number of the same
state (optiland's `1 / (2 n' |u'|)` of its marginal ray from the axial object point, OpticStudio's Paraxial Working F/#)
it is −8.5% to +58% over the 61 focus stations:

| Lens key | Station | eff. f/ | Paraxial working F/# | Working F/#, real rim rays |
|---|---|---:|---:|---:|
| `sony-fe-600mm-f4-gm-oss` | close | 6.50 | 4.11 | 4.17 |
| `sigma-apo-macro-180mm-f56-uc` | close | 8.44 | 6.06 | 6.17 |
| `sigma-105mm-f28-dg-dn-macro-art` | 1:1 | 4.32 | 4.72 | 4.75 |

An internally focusing lens moves its pupils, and the thin-lens magnification is not the system's: the stored infinity
pupils and a thin lens are the estimate's two errors.

**Option.** LensVisualizer's own kernel gives the paraxial working f-number of the prepared state exactly (its marginal
ray from the conjugate's axial point, `1 / (2 n' |u'|)`), with no stored constant.

## 4. What is consistent, and what else was looked at

- **First-order values.** The cardinal focal length, back focus (from the last lens vertex, rear plates inside it), front
  focus, principal hiatus, image plane and total track (first vertex to image plane: OpticStudio's TOTR) are R1's to the
  bit; the current and infinity focal lengths within 8 units in the last place (`-1 / u'` of one ray, or the stored focal
  length at infinity, against the cardinal construction); the entrance pupil within 3.4e-11 relative (a real ray 1e-4 mm
  from the axis against the paraxial one). OpticStudio's BFL is measured from the last surface before the image surface,
  where LensVisualizer's BFD is from the last lens vertex, a modelled rear plate inside it; to be checked against
  OpticStudio's Conventions and Definitions before anything is changed.
- **The stop's sizing ray is clipped elsewhere** on the Sigma 35 mm f/1.4 wide open (surface 13, 0.58 mm outside its
  17.5 mm) and, by 1.3 µm, on the Canon EF 135 mm (surface 8), and at 12 of 61 focus stations the infinity stop is
  larger than the elements pass (the Sigma 105 mm at 1:1 by up to 1.31 mm). There the tab's pupil and f-numbers are of
  the stop, not of the beam LensVisualizer's own MTF traces. Tracing the sizing ray with aperture checks, or sizing the
  beam from the footprint the MTF already finds, would say so.
- **The half field** is the field whose solved chief ray lands at the image corner (half the stated image circle, or
  the format's diagonal) on 103 of 113 states, the last field whose chief ray clears every aperture on one (the GF 80 mm
  at its close station), and an authored trace field on nine (four as authored, five lowered by the corner); no engine
  has the quantity, and R9a judges the chief ray at that angle. **The focus readout** is the certified conjugate's
  object-to-image-plane distance to the bit on 60 of 61 stations, and 1.09 mm longer on the GF 110 mm T/S macro at 1:2.

The owner decided the f-numbers and the stop rule (status, above); the rest of section 4 is for the record. When
LensVisualizer changes, the canaries of the lines quoted above fail first (`test/integration/lv/canaries.test.ts`, Stage
6.7), and the summary's request, R12b's asks and these measurements are redone. That happened with #933 (status,
above): `sampling.lvThinLensEffectiveFNumber` is gone, and R12b records LensVisualizer's paraxial and real working
f-numbers at infinity focus.
