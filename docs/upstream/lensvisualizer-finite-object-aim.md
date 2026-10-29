# LensVisualizer: the aimed launch of a finite object starts from a chief ray that reaches no stop

Status: **resolved by LensVisualizer #940** (`6287f4393`, adopted by the comparator at Stage 6.8b; engine closure
`fc5ae923`): options (a) and (c) below. `prepareMtfFieldLaunch` hands the aim `chiefLaunch: [0, aim.root]`, which
`launchFrame` seeds the chief at (the straight line the fallback) and `fieldGeometryKey` keys by; and `fieldAtGrid` ends
a field whose lattice aims nothing as `aim-failed` at its first grid, in place of `empty-pupil` at every grid. Surveyed
again at `6287f4393` as in section 2 (67 states, 319 fields, 8 cells at the reference line): no field has a lattice all
unaimed, and each of the 47 fields below is aimed, its chief included, with no unaimed cell. The comparator's
`lv-field-unaimed` stays, met on no committed suite; the replay restates the `aim-failed` line for R4f. The history
follows as it was written.

Status then: **open; for the owner, not filed.** Observed at LV `607ff23ae` (clean; engine closure `f016b35b`), the
commit the comparator adopted at Stage 6.8b. The comparator reports LensVisualizer's MTF as it is and changes no gate
for this: a field of which LensVisualizer's aimed launch aims no cell is the coded problem `lv-field-unaimed` of that
field (`lvFieldRays`, `docs/gotchas.md`, "A finite object's stop lattice that LensVisualizer aims no cell of"), no set
is made of it and no engine is asked about it. This brief changes no LV source or prescription. It holds results and
lens keys only.

The owner's principle (2026-10-27) is one convention everywhere, OpticStudio with ray aiming and CODE V where it can.
Since #936 the MTF samples the real stop, as both do. At a finite object point it does so for no ray at all on 47
fields, because the aim starts from a ray LensVisualizer had already improved on.

## 1. The launch frame seeds the chief on the straight line from the object point to the stop centre

`prepareMtfFieldLaunch` (`src/optics/analysis/mtf/mtfTracing.ts`) solves a finite object's chief ray through the stop
centre, a scalar root on the launch height with a scan, and keeps it as the launch's `centerY`. The aimed launch is
handed only the object point and the launch plane:

```ts
const pupilAim: AimedPupilFieldGeometry | null = objectPoint
  ? { kind: "finite-object", objectPoint, leadZ }
```

`launchFrame` (`src/optics/analysis/pupils/aimedPupil.ts`) then seeds the field's chief on the straight line from the
object point to the stop centre:

```ts
const seedFraction = (stopZ - leadZ) / (stopZ - objectPoint[2]);
...
chief: axial ? [0, 0] : [objectPoint[0] * seedFraction, objectPoint[1] * seedFraction],
```

and `fieldModel` traces that seed to the stop without apertures (`chiefStop: stopAt(frame.chief)`). A wide lens has a
strongly negative front group: the straight line from a near object point at a large angle meets the front elements
far from where the real chief ray does, and misses a surface (`noBracket`), misses the first surface altogether, or
reflects totally. Then `chiefStop` is null, no Jacobian is formed, `fit` stays null, and `aimSample` returns every
sample, the stop centre included, as

```ts
return { status: "unaimed", reason: "trace-failed", launch: model.chief, stop: null, iterations: 0 };
```

A finer lattice is seeded from the coarser one, which has no aimed cell, and each cell falls back to the same lone
solve: every grid is lost alike. The collimated frame does not have this: it starts at the solved chief
(`{ uField, yChief }`).

## 2. Measured

Every focus station a lens of the catalog documents that exports (67 states in the script's walk; the focus-stations
suite runs 62), LensVisualizer's `MTF_FIELDS` (0, 0.25, 0.5, 0.75, 1) as
`computeMtfSteps` resolves them, the aimed lattice of 8 cells at the reference line, a read-only script through the
comparator's binding:

- **47 fields on 18 stations have no aimed cell**, each with every cell and the chief `unaimed` / `trace-failed`.
- **They are exactly the fields whose straight-line seed fails** to reach the stop: 43 `noBracket` (20 of them a miss of
  the first surface), four total internal reflections. No field whose seed fails has an aimed cell, and no field whose
  seed reaches the stop is lost.
- **No state at infinity** has such a field (benchmark, states, features).

| Lens key | Station (zoom position, focus) | Fields lost (of `MTF_FIELDS`) |
|---|---|---|
| `hasselblad-xcd-25mm-f25-v` | 0, 1 | 0.25, 0.5, 0.75, 1 |
| `leica-summilux-c-18mm-t14` | 0, 0.642 | 0.25, 0.5, 0.75, 1 |
| `leica-summilux-c-18mm-t14` | 0, 1 | 0.5, 0.75 |
| `olympus-mzuiko-digital-ed-17mm-f12-pro` | 0, 0.218 | 0.75, 1 |
| `olympus-mzuiko-digital-ed-17mm-f12-pro` | 0, 1 | 1 |
| `olympus-zuiko-digital-ed-7-14mm-f4` | 1, 1 | 0.25 |
| `panasonic-lumix-g-vario-12-60mm-f35-56` | 0, 1 | 0.5, 0.75, 1 |
| `samyang-af-14mm-f28-ef` | 0, 0.373 | 0.25, 0.5, 0.75, 1 |
| `samyang-af-14mm-f28-ef` | 0, 1 | 0.25 |
| `sigma-12mm-f14-dc-contemporary` | 0, 1 | 0.25, 0.5, 0.75, 1 |
| `sigma-18-35-f18-dc-hsm-art` | 0, 1 | 0.5, 0.75, 1 |
| `sigma-18-35-f18-dc-hsm-art` | 0.5, 1 | 0.5, 0.75, 1 |
| `sigma-18-35-f18-dc-hsm-art` | 1, 1 | 0.75, 1 |
| `sigma-24mm-f2-dg-dn-contemporary` | 0, 1 | 0.5, 0.75, 1 |
| `sigma-28mm-f14-dg-hsm-art` | 0, 1 | 0.5, 0.75, 1 |
| `sigma-apo-50-500mm-f45-63-dg-os-hsm` | 0, 1 | 0.5, 0.75, 1 |
| `tamron-35-150mm-f2-28-di-iii-vxd-a058` | 0, 1 | 0.75, 1 |
| `thypoch-ksana-21mm-f35` | 0, 1 | 0.75, 1 |

**One station in detail.** `panasonic-lumix-g-vario-12-60mm-f35-56` at its wide end and closest focus (the object
159.4 mm in front of the first vertex): at 27.1° the straight-line seed ends with `noBracket` at surface 3, at 47.9° it
misses the first surface; the chief ray `prepareMtfFieldLaunch` solved for the same fields crosses the stop within
4.3e-13 mm and 3.7e-10 mm of its centre. The axis is aimed in full (52 of 52 cells at 8 across).

**What the tab shows.** `computeMtf` of that station's three fields 0, 0.5, 1: the axis `converged` at 64 cells; both
off-axis fields `unavailable`, `empty-pupil`, "Too little pupil remains to estimate MTF.", at every grid up to 256,
with `validRays` 0 and `unaimedRays` 51468 (every cell of the disc of the 256 lattice, at the reference line) and the
chief's image height still stated (5.41 and 10.82 mm). So the MTF tab draws no curve for
those fields, and its message names a vignetted pupil where the cause is the aim. Before #936 the same fields were
traced on the launch plane and had curves.

## 3. Options

(a) **Seed the finite-object frame at the solved chief** (recommended): hand the aimed launch the chief launch point
`prepareMtfFieldLaunch` found, for example `{ kind: "finite-object", objectPoint, leadZ, chiefLaunch: [0, centerY] }`,
and let `launchFrame` take it as `chief` (the straight line remains the fallback when none is given). The field model's
cache key (`fieldGeometryKey`) must then include it. The chief then crosses the stop within the chief-ray solve's
acceptance, the Jacobian and the fit are formed about it as for a collimated field, and nothing else changes. (b) Where
`chiefStop` is null, solve the chief from the straight-line seed by a scan as `prepareMtfFieldLaunch` does, inside
`fieldModel`. (c) At the least, report a field whose chief cannot be aimed as such (`aim-failed`) rather than
`empty-pupil`.

## What the comparator does

A stop lattice of which LensVisualizer aims no cell is the coded problem `lv-field-unaimed` of that field, naming its
angle and line; no set is made and no engine is asked; `wave` and `flux` answer the field unavailable with that code. A
lattice of blocked cells and no aimed one keeps its set (LensVisualizer's blocking rays, which every engine stops).
When LensVisualizer aims these fields, the problem disappears by itself: the focus-stations suite then has their sets
(new records at the next refresh), traced by `lv`, `ref` and optiland, and judged by R2–R4 and R6a as every other field.
