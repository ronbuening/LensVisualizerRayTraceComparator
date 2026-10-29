# LensVisualizer: the vignetting tab sweeps one chord of a fixed pupil, and applies cos^4 of the field angle

Status: **resolved by LensVisualizer #931** (`4092f6a25`, adopted by the comparator at Stage 6.8b, LV `607ff23ae`): the
tab is now OpticStudio's two field analyses on one lattice on the real stop a field (the MTF's aimed stop lattice, 64
cells across the stop), its vignetting curve the share of the stop's samples that reach the image and its relative
illumination Rimmer's, each ray's direction referred to the chief ray's image point through a reference sphere: the
second suggestion below, with Rimmer's correction. On the benchmark R11b's two answers now differ per field off the axis
by at most 0.0037 in transmission and 0.0062 in relative illumination (`docs/REFERENCE.md`, "Stage 6.8b ... (part B)").
Before it, **resolved in part by LensVisualizer #925** (`5ba17c20c`, adopted by the comparator at Stage 6.6b, LV `098c91ef6`,
engine closure `fef2e248`): the tab traces each field's beam on its MTF's launch lattice (64 cells across the footprint,
one half mirrored), its geometric transmission the lit cells' area, and its relative illumination by conservation of
energy, the beam's flux times cos θ over the image area a unit of object solid angle covers, `(dh/dθ)(h / sin θ)` of lit
chief rays 0.01° apart or the median ray tube of the beam where they are vignetted. That is not the second suggestion
below (the cosine-space flux of the exit directions, Rimmer's method, OpticStudio's), which the engine `flux` computes;
R11b records the two routes side by side as two methods (per field off the axis on the benchmark, within 0.0110, median
0.0017). **Owner decision (2026-10-27)**: `flux` keeps Rimmer's method, and LensVisualizer is to move its tab to Rimmer's
relative illumination and to a vignetting curve of the share of stop samples transmitted (and to aim its spots, fans,
bokeh, zones and MTF at the real stop) in later changes, pending; the MTF's part landed in LV #936 (its aimed stop
lattice, adopted at Stage 6.8b, LV `607ff23ae`). The history follows as it was written, and the
measurements after the change are in `docs/REFERENCE.md`, "Stage 6.6b". For the owner; not filed. Observed at LV
`be077cbcd` (clean; engine closure `c866fbff` with the comparator's Stage 6.6 names) and optiland `4e893f53`. The comparator reports LensVisualizer's vignetting tab as it is
and changes no gate for this: rung R11a traces the tab's own sweeps, and LensVisualizer's own MTF launch lattice over
each field's beam, in `lv`, `ref` and optiland, and they pass the same rays everywhere and bring the same flux into the
image within 1.07e-13; rung R11b records the tab beside the comparator's flux in two dimensions on those lattices (the
engine `flux`, LensVisualizer's rays traced by LensVisualizer). This brief changes no LV source or prescription. It holds
results and lens keys only.

R11b's differences are of the tab's method, not of tracing. They are large where LensVisualizer's own MTF already knows
better: a wide angle's corner, and any vignetted field.

## 1. The sweep is a chord of the axis's entrance pupil, which the stop's image outgrows off the axis

`computeVignettingCurve` (`src/optics/analysis/vignetting/vignetting.ts`) traces, for each field, one meridional line of
rays at a fixed width about the field's solved chief ray:

```ts
const pupilFractions = evenlySpacedSigned(nPupil);
const pupilOffset = pupilFrac * currentEPSD;
prepared.ray(yChief + pupilOffset, uField)
```

`currentEPSD` is the axis's entrance-pupil radius. Where the stop's image grows and moves off the axis, the field's beam
on the first vertex plane is wider than that chord, and the rays beyond it are never launched: the sweep's fraction
cannot rise much above the axis's. The MTF footprint scan says so in its own header (`mtfFootprint.ts`: "In retrofocus
wide-angles the stop's image grows and shifts off axis, so a fixed entrance-pupil circle can miss most of the real flux
at the corner"), and LensVisualizer's MTF scans for the footprint (`findMtfFieldFootprint`); the vignetting tab does
not.

**Measured** (the 24 benchmark reference runs at the design plane, wide open and at the MTF tab's f/8 comparison; 232
fields, every one of them the same field in both answers, the chief rays landing within 7.1e-15 mm):

| Lens key | Field | Tab's geometric transmission | Beam's area, over the axis's | Tab's relative illumination | Traced |
|---|---|---:|---:|---:|---:|
| `sony-fe-20mm-f18-g` (f/8) | 47.0° | 1.021 | 1.794 | 0.221 | 0.374 |
| `nikon-z-24-70f4s` wide (f/8) | 40.4° | 1.011 | 1.490 | 0.340 | 0.613 |
| `nikon-z-24-70f4s` wide (f/8) | 43.3° | 1.011 | 1.637 | 0.284 | 0.548 |
| `sigma-35mm-f14-dg-hsm-a` (f/8) | 32.0° | 0.553 | 0.795 | 0.287 | 0.434 |
| `sony-fe-20mm-f18-g` (wide open) | 47.0° | 1.056 | 1.329 | 0.228 | 0.281 |

The beam's area is the area on the launch plane of LensVisualizer's own MTF lattice (128 cells across the beam) that
LensVisualizer traces through every aperture; the traced relative illumination is described in section 3. The tab
understates the illumination of these corners by up to 0.27 (absolute; 45 % of the traced figure).

The tab's axis is a chord too: on the Sony FE 20 mm wide open, 6 of its 96 axial rays are stopped, and every field is
normalised to that clipped axis (its geometric transmissions reach 1.067). The module's header notes the folding of a
residual axial vignetting into the normalisation.

## 2. A meridional chord is no area

The tab's geometric transmission is the share of its one chord that passes. Where an aperture cuts the beam into a
lens-shaped area, the chord through its middle is a larger share of the diameter than the area is of the disc:

| Lens key | Field | Tab (chord) | Beam's area |
|---|---|---:|---:|
| `canon-ef-135-f2l-usm` | 9.2° (edge) | 0.484 | 0.387 |
| `nikkor-z50f12` | 22.9° (edge) | 0.424 | 0.357 |

The module's header names this scope ("1D meridional analysis only; no sagittal or full 2D pupil integration").

## 3. cos^4 of the object-space field angle is no lens's falloff

The tab multiplies its transmitted intensity by `Math.pow(Math.cos(thetaRad), 4)` of the object-space angle. The
irradiance of a field's image point is the radiance times the projected solid angle of the exit pupil seen from it
(the area of the converging beam in image-space direction cosines, weighted by transmission); it is cos^4 of the field
angle only for an undistorted image of a pupil that subtends at the image as it does at the object. Per unit of
transmitted area (the relative illumination over the geometric transmission, which removes section 1 and 2):

| Lens key | Field | cos^4 | Traced |
|---|---|---:|---:|
| `nikon-z-24-70f4s` tele | 16.6° | 0.843 | 0.641 |
| `sigma-45mm-f28-dg-dn-contemporary` | 25.6° | 0.662 | 0.552 |
| `fujifilm-fujinon-gf-63mm-f28-r-wr` (f/8) | 24.4° | 0.687 | 0.773 |
| `nikon-z-24-70f4s` wide | 40.4° | 0.337 | 0.412 |

The traced figure comes two ways that share nothing: the area in cosine space of the exit beam of LensVisualizer's
lattice (the engine `flux`), and the object side's transmitted area times `cos θ` over the image mapping's Jacobian
`h h' / sin θ` of the chief rays' landings across the tab's own fields. The two agree within 0.011 on 368 fields
(median 0.0012). The module's header names the law ("cos^4 factor is applied to the object-space field angle").

## Suggestion

**Decision (owner, 2026-10-26).** LensVisualizer is to make both changes below. The change is pending in
LensVisualizer; until it lands R11b records the tab as it is, and afterwards the canaries of the tab's lines fail first,
and the comparator's vignetting sets, its asks and the measurements here are redone.

1. Sample each field's beam in two dimensions over the footprint LensVisualizer's MTF already finds
   (`findMtfFieldFootprint`, `mtfLaunchGrid`), and count its transmitted area, not a chord of the axis's pupil: this
   removes sections 1 and 2.
2. Take the relative illumination from the traced exit directions of that lattice (the area of its lit cells in
   image-space direction cosines, weighted by each ray's bulk transmission), not cos^4 of the object-space angle: this
   removes section 3. LensVisualizer's own rays give the comparator's figures exactly: the engine `flux` is that
   computation on LensVisualizer's lattices.

At 64 and 128 cells across the beam a field's figures agree on doubling within 0.01 on the benchmark; at 32 and 64 they
move by up to 0.02. When LensVisualizer changes the tab, the comparator's vignetting sets restate its rays and fail
their canaries first (`test/integration/lv/canaries.test.ts`); R11a then traces the new rays, and R11b's differences
fall to the estimator's resolution.

## What the comparator does

R11b sorts every field before any difference (R5's classes, indices that are not the case's, then the chief rays'
landing against 1e-5 mm) and records the geometric transmission, the falloff and the relative illumination of the
fields of two methods, with no attention band: on the benchmark all 232 fields, the largest differences 0.773, 0.202
and 0.273. R11b stays out of every baseline.
