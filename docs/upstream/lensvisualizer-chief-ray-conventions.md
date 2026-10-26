# LensVisualizer: chief rays below one degree, and one chief ray for every lateral-colour channel

Status: **decision taken, LV change pending** (owner, 2026-10-26): both conventions below are to be changed in
LensVisualizer, a real chief ray below one degree for the pupils tab and the distortion curve, and each channel's own
chief ray for the lateral colour. The owner holds the implementation prompts. For the owner; not filed. Observed at LV
`d6df08c7f` and `cfa91d0a5` (clean; engine closure `c866fbff` with the comparator's Stage 6.4 names) and optiland
`4e893f53`. The comparator reports LensVisualizer's tabs as they are and changes no gate for this: rung R9a traces
LensVisualizer's own chief rays in `lv`, `ref` and optiland and they agree within 4.8e-13 mm; rung R9b records the tabs
beside optiland's own figures, with no attention band. This brief changes no LV source or prescription. It holds
results and lens keys only.

Two of the differences R9b records are LensVisualizer conventions, not tracing: the rays agree, the choice of ray does
not. The owner has decided that the tabs are to present the stop's chief ray in both cases (below).

## 1. Below one degree a chief ray is its paraxial estimate

`computeChiefRaySolve` (`src/optics/field/chiefRaySolve.ts`) returns the chief ray of the paraxial entrance pupil,
not one through the centre of the stop, for every field under one degree:

```ts
const paraxialYChief = -geom.epRatio * uField;
if (Math.abs(fieldAngleDeg) < 1) {
  return { yLaunch: paraxialYChief, uField, status: "converged", iterations: 0, launchSurface };
}
```

The pupils tab (`computeBothPupilAberrationProfiles`, `src/optics/analysis/pupils/pupilAberration.ts`) forms each
field's real entrance pupil from the solved launch over the paraxial one (`chiefRayCorrection`, then
`epShiftMm = (chiefRayCorrection - 1) * epRatio`), and its real exit pupil from that ray's exit. Below one degree the
correction is exactly 1, the entrance-pupil shift 0, and the exit pupil that of the paraxial pupil's chief ray. The
distortion curve's samples below one degree are of the same estimate.

**Measured** (benchmark reference runs, wide open; LensVisualizer's pupils beside the crossings of optiland's
robust-aimed chief ray, through the stop's centre):

| Lens key | Half field | Fields below 1° | Entrance pupil apart, below 1° | Exit pupil apart, below 1° |
|---|---:|---:|---:|---:|
| `sony-fe-400mm-f28-gm-oss` | 3.15° | 5 of 16 | 1.30 mm | 5.17e-2 mm |
| `nikon-z-mc-105f28` | 12.00° | 1 of 16 | 1.48e-2 mm | 6.35e-3 mm |
| `canon-ef-135-f2l-usm` | 9.17° | 1 of 16 | 9.27e-3 mm | 1.10e-2 mm |
| `sigma-105mm-f28-dg-dn-macro-art` | 11.65° | 1 of 16 | 5.94e-3 mm | 1.98e-3 mm |
| `nikon-z-135f18-plena` | 9.16° | 1 of 16 | 5.58e-3 mm | 1.39e-3 mm |

At one degree and above every benchmark lens agrees with optiland within 5.0e-6 mm in both pupils, so the tab's
real chief ray is the stop's chief ray there. The two chief rays land within 2.5e-6 mm of each other at every field,
so the landing alone does not tell them apart: near the axis the pupil of a long lens moves a long way for a small
change of launch height.

The same estimate also sets the distortion curve below one degree. On the Sony FE 400 mm at 0.96° LensVisualizer's
percent distortion and the one of a ray through the stop's centre on LensVisualizer's own scale differ by 3.6e-5
percentage points, which is small; the pupils are where it shows.

**Decision (owner, 2026-10-26).** LensVisualizer is to solve the real chief ray below one degree too, for the pupils
tab and the distortion curve (the solver already does above it). The change is pending in LensVisualizer; until it
lands R9b records the difference as it is, and afterwards the canary of the one-degree line fails first.

## 2. Lateral colour traces one chief ray at every channel

`computeLateralColorCurve` (`src/optics/analysis/chromatic/analysis.ts`) traces, at each channel, the coma tab's chief
ray of the field (`computeOffAxisFieldGeometry`, solved once at the authored indices, without a channel), and plots
each channel's landing relative to G. optiland's chief ray of each line passes through the centre of the stop at that
line, which is the usual definition of lateral colour (the chief ray of each wavelength). LensVisualizer's ray off its
reference channel misses the stop's centre by the pupil's own chromatic aberration.

**Measured** on the 12 benchmark configurations at the C, d and F lines (a temporary suite, `lines: { kind: "cdf" }`,
wide open; not committed), each line's chief-ray landing relative to the d line's, LensVisualizer against optiland:

| Lens key | Largest difference | Where | LensVisualizer | optiland |
|---|---:|---|---:|---:|
| `sony-fe-20mm-f18-g` | 1.09e-3 mm | F − d, 47.0° | −5.77e-3 mm | −4.68e-3 mm |
| `nikon-z-24-70f4s` (wide) | 2.70e-4 mm | F − d, 32.5° | 5.73e-3 mm | 6.00e-3 mm |
| `nikkor-z50f12` | 8.52e-5 mm | F − d, 22.9° | −1.39e-4 mm | −2.24e-4 mm |
| `fujifilm-fujinon-gf-63mm-f28-r-wr` | 7.51e-5 mm | C − d, 24.4° | −5.83e-3 mm | −5.90e-3 mm |
| `sigma-35mm-f14-dg-hsm-a` | 6.95e-5 mm | C − d, 32.0° | −5.96e-3 mm | −5.89e-3 mm |
| `nikon-z-mc-105f28` | 4.07e-5 mm | F − d, 12.0° | 1.07e-3 mm | 1.11e-3 mm |
| `sony-fe-400mm-f28-gm-oss` | 3.82e-5 mm | F − d, 2.4° | −1.96e-3 mm | −1.92e-3 mm |
| `sigma-105mm-f28-dg-dn-macro-art` | 2.97e-5 mm | F − d, 11.7° | −1.58e-3 mm | −1.61e-3 mm |
| `canon-ef-135-f2l-usm` | 2.46e-5 mm | F − d, 9.2° | 1.91e-3 mm | 1.88e-3 mm |
| `sigma-45mm-f28-dg-dn-contemporary` | 2.36e-5 mm | C − d, 25.6° | −4.32e-3 mm | −4.34e-3 mm |
| `nikon-z-24-70f4s` (tele) | 2.00e-5 mm | F − d, 16.6° | −4.19e-3 mm | −4.17e-3 mm |
| `nikon-z-135f18-plena` | 1.49e-5 mm | F − d, 9.2° | −1.19e-3 mm | −1.21e-3 mm |

The channels' indices are not the case's either (the d-line catalog glasses of
`lensvisualizer-loca-unanchored-index.md`), but tracing LensVisualizer's own launch at the case's indices moves these
differences by 3.8e-5 mm at most: the rest, up to 1.09e-3 mm (a fifth of the Sony FE 20 mm's lateral colour at its
edge), is the choice of one launch for every channel.

**Decision (owner, 2026-10-26).** The chart is to show each wavelength's own chief ray, each through the stop's
centre, solved per channel (`ChiefRayRequest` already takes a `channel`). The change is pending in LensVisualizer; until
it lands R9b records the difference as it is.

## Smaller conventions, recorded and not asked about

- **The distortion curve plots its target heights.** `computeDistortionCurve` inverts evenly spaced target heights
  to field angles and plots each target as the real height, accepting an inversion within 1e-4 mm of it; on the
  benchmark the plotted height is up to 9.8e-5 mm from the landing of the chief ray at the plotted angle, 3.7e-3
  percentage points at most.
- **The distortion scale is of a probe up to half a degree off the axis** (`min(max(0.01 · halfField, 0.02), 0.5)`
  degrees). Its landing includes a little of the lens's distortion: the scale is up to 8.5e-6 relative from
  optiland's, which probes at 1e-10 of the half field (the Z 24-70 mm wide end, a probe of 0.43°).

The comparator's evidence is in `docs/REFERENCE.md`, "Stage 6.4", and its entries are in `docs/gotchas.md`, "Chief
rays (Stage 6.4)".
