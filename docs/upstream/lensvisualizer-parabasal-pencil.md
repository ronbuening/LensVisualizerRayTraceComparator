# LensVisualizer: the field curves' parabasal pencil is 0.01 mm wide

Status: **decided by the owner, 2026-10-26: no LensVisualizer change.** The 0.01 mm parabasal pencil is a
documented convention of LensVisualizer's. Not filed. Observed at LV `cfa91d0a5` (clean; engine closure `c866fbff`
with the comparator's Stage 6.5 names) and optiland `4e893f53`. The comparator reports LensVisualizer's field curves as
they are and changes no gate for this: rung R10a traces LensVisualizer's own parabasal rays and real-ray fans in `lv`,
`ref` and optiland and their foci agree within 1.33e-13 mm across the field; rung R10b records the field curves beside
optiland's own `FieldCurvature`, with attention bands of 1e-5 mm on its three figures. This brief changes no LV source
or prescription. It holds results and lens keys only.

R10b's differences are LensVisualizer conventions, not tracing: the rays agree, the pencil does not. They are far
below what the aberrations tab displays; they are written down so that the owner's choice is on record.

## 1. The parabasal foci are of a pencil 0.01 mm wide, not infinitesimal

`computeStandardizedFieldFocus` (`src/optics/analysis/aberration/fieldCurvature.ts`) launches four "parabasal" rays
beside each field's chief ray, at a fixed physical height on the first vertex plane:

```ts
const FIELD_CURVATURE_PARABASAL_RAY_HEIGHT_MM = 0.01;
const FIELD_CURVATURE_PARABASAL_FRACTION_MIN = 1e-4;
const FIELD_CURVATURE_PARABASAL_FRACTION_MAX = 0.02;
const fraction = FIELD_CURVATURE_PARABASAL_RAY_HEIGHT_MM / entrancePupilSemiDiameter;
```

and takes the least-squares crossing of each pair with the chief ray as the tangential and sagittal focus. The usual
definition of field curves (Coddington's, and optiland's `FieldCurvature`, which crosses a pair at `±1e-5` of the
pupil) is the limit of an infinitesimal pencil. A pencil of height `h` focuses away from that limit by a term in `h²`
(the term in `h`, coma, cancels in both the least squares about the chief ray and the crossing of a symmetric pair).

**Measured** (benchmark reference runs, design plane, wide open and at the tab's f/8 comparison; 408 fields of 24
answers): LensVisualizer's foci differ from optiland's by up to 5.72e-6 mm (tangential), 1.38e-6 mm (sagittal) and
6.66e-6 mm (their difference, the astigmatic split); the median is 6.3e-8 mm. That this is the pencil and nothing else:
the same fields traced with LensVisualizer's own launch and tracer at a tenth and a hundredth of the height converge on
optiland's as the square of the height.

| Lens key | Field | Height 0.01 mm (LV's) | 0.001 mm | 0.0001 mm |
|---|---|---:|---:|---:|
| `sigma-45mm-f28-dg-dn-contemporary` | 25.6°, tangential | 5.72e-6 mm | 5.1e-8 mm | 5.7e-9 mm |
| `nikon-z-24-70f4s` (wide, f/8) | axis | 1.38e-6 mm | 1.38e-8 mm | 1.34e-10 mm |
| `nikkor-z50f12` | 22.9°, tangential | 5.34e-7 mm | 5.8e-9 mm | 1.3e-8 mm (optiland's own floor) |

The tab rounds its edge shifts to 0.01 mm (`formatSignedMm`) and its astigmatic splits to 0.1 µm (`formatSignedUm`);
the largest difference above is 0.0066 µm, fifteen times below the finest readout, and invisible on the plots. A
smaller height would move LensVisualizer's own rounding the other way: its least squares is formed in plain
arithmetic about the last vertex plane, and a focus is a relative landing over a relative slope of about the height
over the focal length.

**Decision (owner, 2026-10-26).** No change: LensVisualizer keeps its pencil of 0.01 mm, a documented convention of
its field curves. For the record, a height of 0.001 mm would bring them within 6e-8 mm of optiland's on the benchmark;
the comparator would see such a change as a change of the curvature sets' rays (R10a recomputes; its canary of the
height fails first).

## 2. Below one degree the pencil is centred on the paraxial chief ray

The field's launch height is `solveChiefRayForRuntimeLens`'s, which below one degree is the paraxial pupil's chief ray
(`docs/upstream/lensvisualizer-chief-ray-conventions.md`, item 1, whose change the owner has decided). Coma moves a
tangential focus with the centre of its pencil: on the Sony FE 400 mm (`sony-fe-400mm-f28-gm-oss`, half field 3.15°,
five fields off the axis below one degree) the tangential foci there are up to 2.31e-6 mm from optiland's about the
stop's centre, the sagittal up to 1.23e-7 mm, whatever the pencil's height. The change of the chief ray the owner
decided at Stage 6.4 will move these fields with it; no separate change is needed for the field curves.

## What the comparator does

R10b sorts every field before any difference (R5's classes, indices that are not the case's, then the chief rays'
landing against 1e-5 mm) and records the two foci and their difference for the fields of two methods: on the benchmark
every one of the 408 fields but one (optiland's own failure at the Sigma 35 mm's edge at f/8, `docs/gotchas.md`, held
by the owner with the other upstream items). Each of the three figures has an attention band of 1e-5 mm (owner
decision, 2026-10-26), above the pencil's 6.66e-6 mm: a pair beyond one is marked ATTENTION, and none on the benchmark
is.
