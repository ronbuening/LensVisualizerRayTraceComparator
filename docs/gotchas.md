# Gotchas

Behaviours of an engine that a comparison must know about, each with where it lives in the engine's source, what
it does to a comparison, and how the comparator deals with it. An entry is here because an engine really does
this, not because a tolerance was hard to meet: no gate is loosened for any of them.

Each entry has a **class**, the one the plan's ladder uses when two answers differ:

| Class | The difference comes from |
|---|---|
| data | inputs that were not identical |
| convention | a frame, a sign or a definition that one side states otherwise |
| numerical | floating-point arithmetic on a quantity that is right on both sides |
| method | two algorithms that do not compute the same thing |

Line numbers are not quoted: LensVisualizer changes daily. The integration tests in
`test/integration/lv/canaries.test.ts` pin the source lines these entries rest on and fail when one is rewritten.
Measured numbers are of LensVisualizer commit `d36f44b3`; those of rungs R2 and R3 were taken at `3af45e3f`,
whose engine files are the same, with two lens files corrected; those of the product MTF at `ed78cf40`, with the
same engine files again. The engine closure the comparator states has grown with what it loads of LensVisualizer:
it was `f6681074` (142 files) through rung R3, and `1827eefe` (151 files) from the product MTF on, the same 142
and the nine files of LensVisualizer's MTF product, its aperture slider and its tab preferences. It is `ff670f03`
(the same 151 files) since LensVisualizer edited partial-dispersion fields in its glass catalogue: at `1ed8cc3d`
every case of the benchmark has the content hash it had, and every figure of the digest is the same. The verdicts
that policy version 4 changed (the floor of the exit direction, the radius of a far pupil) were measured at
`1ed8cc3d`, closure `ff670f03`, while one lens file of that checkout was being edited, which no result here is of.
The committed digest of the benchmark was last written at `23631dc0`, with that closure and the same cases, each
named there by its content hash. Its figures are those of `3af45e3f` but for one lens, `sigma-35mm-f14-dg-hsm-a`,
whose launch rays moved by 7e-15 mm when the ray sets took the MTF tab's own seed (below): its largest differences
changed in the fifth digit, and no count changed. Since policy version 4 it has two more figures in R1, the radius
of a pupil scaled and plain, and `firstOrder.maxAbs` is of the six values that are no pupil's: in the two rows of
that lens it used to be a pupil's radius, which is now in the column of its own.

Where an entry says whose error a difference is, the ray was traced a third time, outside the repository, in
60-digit decimal arithmetic by a tracer that shares no code with either engine: Newton's method on the contract's
sag, and the textbook vector form of Snell's law. For the pairs whose verdict policy version 4 changed, and for
those it left failing, that was done again in the review of Stage 2.0, at closure `ff670f03` and in 50 digits,
by a tracer written afresh, on every ray both engines land of each set and not on its worst ray alone.

## LensVisualizer

### The sag function is finite beyond the end of a conic

- **Where.** `conicPolySag` and `sag` in `src/optics/internal/surfaceMath.ts` clamp the root: where
  `1 − (1 + K) c² h²` is not above 0 they take it as `1e-12` (0 for a sphere), so the sag is a number at any height.
  The surface profile says where the surface really ends, `finiteRadiusLimit()`: `|R|` for a sphere and
  `1 / sqrt((1 + K) c²)` for a conic that closes. LensVisualizer's own intersection (`evaluateProfile` in
  `src/optics/math/intersection.ts`) evaluates a point beyond that height as no surface.
- **Effect.** The contract's sag is NaN there. An echo of `profile.sag(r)` alone would report a finite sag where
  every other engine reports none, and R0 would fail on a surface whose clear aperture is authored wider than the
  surface is.
- **Handled.** The engine `lv` reports NaN beyond `finiteRadiusLimit()` (`sagOf`, `src/engines/lv/describe.ts`),
  which is LensVisualizer's own rule and not the comparator's. Of the 18 678 surfaces of the lenses that export,
  none has a clear aperture beyond that height today; the nearest, the second surface of `russar-22-70f8`, is
  authored 1e-9 mm short of its radius.
- **Class.** convention.

### The stored pupil constants are not paraxial

- **Where.** `epZRelStop`, `xpZRelLastSurf` and `xpSD` of a RuntimeLens are found in `src/optics/runtimeLens.ts`
  with real rays a small height and angle off the axis; `EP.epSD` is nominal, focal length over twice the
  f-number. All four are computed once per lens and zoom station, at infinity focus and with the authored indices,
  and read through `epZRelStopAtZoom`, `xpZRelLastSurfAtZoom`, `xpAtZoom` and `epAtZoom`, which interpolate
  between zoom stations. The diagram draws its pupil markers from them at any focus position.
- **Effect.** They differ from the paraxial images of the stop: on the 12 benchmark configurations by 3.5e-9 mm to
  2.5e-5 mm in the entrance pupil's position and by 5.2e-8 mm to 8.2e-6 mm in the exit pupil's, and the image of
  the stop is from 0.5 % smaller to 5.1 % larger than the nominal entrance pupil (`nikkor-z50f12`: 21.615 mm
  against a nominal 20.849 mm). They do not exist at any other line, and they are those of infinity focus: at a
  certified focus station they are up to 67 mm from the kernel's pupils (`sigma-105mm-f28-dg-dn-macro-art` at 1:1).
- **Handled.** They are `recorded`, under names that say `lvStored…` or `lvNominal…`, only at infinity focus and
  at a line traced with the authored indices. The compared pupils of `lv` are the kernel's images of the stop.
- **Class.** method.

### The first-order module answers for the authored indices only

- **Where.** `computeSystemMatrix2` and `computeCardinalElements2` in `src/optics/first-order/` trace
  `state.surfaces`, whose `nd` is the authored index: the d line, or the e line of an all-e lens.
- **Effect.** LensVisualizer has no cardinal points at the photopic lines, nor at the reference line of a lens that
  mixes d- and e-referenced glasses, which it traces with anchored indices.
- **Handled.** `lv` runs the kernel under that module, `traceParaxialSurfaces2`, on rows of radius, gap and the
  line's index, and LensVisualizer's own `buildCardinalElementsFromMatrix2` on the matrix. At a line of authored
  indices the result is `computeCardinalElements2(state)` to the last bit, on all 868 lenses that export.
- **Class.** method.

### The paraxial kernel always starts in air

- **Where.** `traceParaxialSurfaces2` in `src/optics/math/paraxial.ts` starts every ray with the index 1 at the
  first row it is given.
- **Effect.** The rear group cannot be traced from the stop by handing the kernel the rows behind the stop: a stop
  inside an element (`zeiss-hologon-15f8`) would be traced as if it stood in air.
- **Handled.** The exit pupil is traced from a flat row in front that carries the stop's own index and gap: it
  puts the ray into the stop's medium with its reduced angle unchanged (`lineValues`,
  `src/engines/lv/firstOrder.ts`).
- **Class.** convention.

### Afocal is an absolute test

- **Where.** `buildCardinalElementsFromMatrix2` returns nothing when the matrix element `C`, the system's power in
  1/mm, is below `1e-12` in magnitude.
- **Effect.** The reference engine calls a system afocal when its power is below `1e-12` of the sum of its
  surfaces' powers. A system between the two tests would be answered `unsupported` by one engine and not by the
  other. Every lens that exports has a focal length by both.
- **Handled.** Each engine answers by its own test; the pair is then `UNSUPPORTED`, which is not a failure.
- **Class.** convention.

### The wide-open f-number of a zoom is not `L.FOPEN`

- **Where.** `L.FOPEN` of a zoom lens is the smallest f-number over its zoom stations, and `L.stopPhysSD`,
  `L.EP` and `L.totalTrack` are those of the first station or the largest over all.
- **Effect.** A value read from the RuntimeLens is that of another zoom position.
- **Handled.** The comparator reads the prepared state, and takes what only the lens has through LensVisualizer's
  accessors at the state's zoom position (`fopenAtZoom2`, `wideOpenStopAtZoom`, `epAtZoom2`).
- **Class.** data.

### A sequential trace ends on the last surface, not on the image plane

- **Where.** `traceSequential` in `src/optics/trace/sequentialTrace.ts` returns `terminalPoint`, the hit on the last
  surface, `terminalDirection`, the direction behind it, and `reachedImagePlane: false`. Every caller carries the
  ray on by itself; the MTF's own helper is `mtfImagePoint` in `src/optics/analysis/mtfTracing.ts`, which takes an
  exit point up to 1e-9 mm behind the plane for a point of it, since a rear plate can end on the image plane.
- **Effect.** LensVisualizer has no image point and no optical path to the image to report: they depend on who
  projects, and two projections can differ where a plate ends on the plane.
- **Handled.** `lv` lands every ray with the comparator's own projection (`src/estimators/imageProjection.ts`),
  which is one division and one multiplication and addition a component, with the same 1e-9 mm. On the 22 918 rays
  of the benchmark that land (36 ray sets, reference line) it is `mtfImagePoint` to the last bit.
- **Class.** convention.

### The optical path is measured from where the ray was launched

- **Where.** `opticalPathLengthMm` in `traceSequential` starts at 0 at the ray's origin and adds index times
  length to each hit; it ends at the last surface.
- **Effect.** The paths of two rays of a bundle differ by where the launch plane cuts them as well as by the lens,
  and the path to the image is not in the result at all.
- **Handled.** The contract defines `opticalPath` exactly so, from the origin to the last surface, and
  `opticalPathToImage` as its continuation in the index of the image space; `lv` reports LensVisualizer's number
  for the first, bit for bit, and adds `finalMedium` times the projection's distance for the second. An estimator
  takes differences against the chief ray, whose index a ray set states.
- **Class.** convention.

### A hit lies within 1e-9 mm of its surface, not on it

- **Where.** `intersectProfile` in `src/optics/math/intersection.ts` iterates until the z of the ray is within
  `INTERSECTION_TOLERANCE` of the z of the surface (`src/optics/constants.ts`: 1e-9 mm) and takes that point for
  the hit. The tracer has no option for it. A plane is met in closed form, and a hit that lies up to the tolerance
  behind the start of its stretch is moved onto the start.
- **Effect.** Every hit, and every length and landing behind it, carries an error of up to that size, which no
  setting removes: on the same ray an exact tracer and LensVisualizer differ by about 1e-9 mm a hit.
- **Handled.** Measured with the reference engine's sag and normal on the case, which share nothing with
  LensVisualizer: over the 398 516 rays `lv` traces for the benchmark and the feature suite at every line (360 ray
  sets), the worst hit lies 9.99997e-10 mm from its surface along z, every hit of a ray that passed lies within the
  clip radius, and every surface bends every ray by Snell's law with the indices of the case to 6e-14, the
  directions taken from hit to hit. Over the whole catalog, in one sweep outside the tests (868 lenses on their
  reference line, 2 873 367 rays), the worst hit is as far off, and Snell's law holds to 1.5e-11. That worst is
  no tolerance but rounding: surface 7 of `fujifilm-fujinon-xf-27mm-f28` is an asphere of 18 terms whose slope
  terms reach 6e4 and sum to 0.09, and by rational arithmetic LensVisualizer's slope is 2.0e-11 from the exact
  one there and the reference engine's 3.2e-12. An integration test holds the benchmark's sets to all of it
  (`test/integration/lv/rays.test.ts`).
- **Judged.** Rungs R2 and R3 set `lv` against `ref`, which meets a surface to a few units in the last place. On
  the benchmark, 216 ray sets and 137 596 rays that both engines land, every pair passes: the largest hit distance
  is 6.8e-9 mm, the largest difference of a direction 3.1e-10 and of a landing 9.1e-9 mm (all three on
  `sigma-35mm-f14-dg-hsm-a` at 650 nm, 31.9°), and the optical path differs by at most 6.0e-6 waves to the last
  surface, 5.3e-6 to the image and 5.5e-6 relative to the chief ray. Not one ray is stopped by one engine and
  passed by the other, and none is failed. The committed digest is `reports/benchmark/lv-floor.md`. What the
  tolerance becomes behind a steep surface is the next entry.
- **Class.** numerical.

### Behind a steep surface 1e-9 mm is not 1e-9 mm any more

- **Where.** The same tolerance, `INTERSECTION_TOLERANCE`. An error along the ray at one surface is an error across
  it at the next, by the tangent of the angle between them, and a surface met near grazing incidence, or one that
  bends a ray almost back on itself, magnifies whatever arrives. So does the image plane, for a ray that lands
  far off the axis.
- **Effect.** Per-surface errors of `lv` and `ref` on one ray of `fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii` at its
  full field of 44.8°, against the 60-digit trace: both are flat for 17 surfaces (`lv` 2e-10 to 1e-9 mm, `ref`
  1e-15 to 6e-14 mm) and both jump at surface 17 by the same factor of about 40 (`lv` to 7.0e-9 mm, `ref` to
  4.3e-13 mm), ending at 4.0e-8 mm and 2.5e-12 mm. The reference engine is at rounding all the way; the surface
  magnifies. On `zeiss-hologon-15f8` (in the feature suite as `stop-inside-element`) the hits are within 2.2e-9 mm
  and the rays leave 54° off the axis, so the landing is 1.10e-8 mm off and the path to the image plane 2.07e-5
  waves: above both gates, with `ref` within 6e-15 mm and 2e-11 waves of the truth on that ray.
- **Handled.** That is what `FLOOR` is for. A pair of `lv` above a gate is a floor when the arbiter `ref` agrees
  with every other engine within 1e-10 mm, 1e-12 in direction and 1e-7 waves, and `lv` is within 1e-7 mm, 1e-8 in
  direction and 2e-4 waves of `ref` (`policy/rungs.v1.json`): ten times each gate. It counts as a pass and is
  counted apart. In the suites, 4 of the 324 pairs of traced rays of `features` are `FLOOR`, all of the Hologon at
  full field, at 470 nm and 510 nm; the benchmark has none.
  Over the catalog, in one sweep outside the tests (868 lenses on their reference line and 808 on the photopic
  lines, at up to three fields each: 14 370 ray sets, 9.5 million rays that both engines land), 53 pairs are
  `FLOOR` in R2 and 24 in R3, on thirteen lenses. Eleven are at their full field only. One,
  `fujinon-xf-23mm-f14-r`, is a floor at every field, the axis included: its hits are 1.0e-8 mm to 1.6e-8 mm off at
  surface 21, where the 60-digit trace puts `ref` 6e-13 mm from the truth on the worst ray of the axial pencil. Two
  of the thirteen are floors by the direction a ray leaves in, which had no floor until policy version 4 (the
  plan, "Amendments since approval") and so always failed: `apple-iphone-12-main-wide` at its full field, on every
  line (direction 2.9e-9 to 4.1e-9, with hits 1.06e-8 mm to 1.21e-8 mm off and every landing and path inside its
  gate), and `apple-iphone-7-wide-camera-lens` at half its field, on the photopic lines only (direction 1.02e-9
  to 1.44e-9, with every hit and landing within its gate). The largest direction of any floor is 4.07e-9, under
  half the limit. On every ray of those eleven sets (7561 rays) the 50-digit trace puts `ref` within 3.8e-14 mm
  of the truth in every hit and landing and within 1.5e-14 in direction: the whole of each figure is
  LensVisualizer's.
- **Not handled, and failing.** The floor has limits. Three lenses of the catalog are beyond one, in five pairs of R2
  and one of R3, and those pairs are `FAIL`, as they should be: nothing was widened for them, and each is a finding
  about LensVisualizer. All are at the full field: `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr` at three of its six lines (a
  landing 1.02e-7 mm off at the d line and 1.04e-7 mm at 650 nm, a hit 1.15e-7 mm and a landing 1.20e-7 mm off at 470
  nm; at 555 nm, 510 nm and 610 nm its hits, 2.5e-8 mm to 7.3e-8 mm off, and its directions, 1.1e-9 to 2.7e-9, are
  within the limits, and those three pairs are `FLOOR` since the direction has one), `fujifilm-fujinon-xf-27mm-f28` at
  510 nm (a hit 1.79e-7 mm off, with a direction of 3.5e-9 that is within its limit, on a ray that leaves a surface 3°
  short of the perpendicular to the axis) and `leica-apo-summicron-m-35f2` at 555 nm (a landing 1.96e-7 mm and a path
  3.3e-4 waves off behind an exit 64° off the axis, with every hit inside its gate). In each, the 60-digit trace puts
  `ref` between 5e-15 mm and 6e-13 mm from the truth on the worst ray and `lv` the rest. Over every ray of those sets,
  in the 50-digit trace: `ref` is within 1.7e-11 mm and 4.9e-13 in direction on all six lines of the zoom (3826 rays;
  its worst is the ray of 650 nm on which `lv` is 1.0e-7 mm off), within 7.3e-13 mm and 2.4e-14 on
  `fujifilm-fujinon-xf-27mm-f28`, and within 4.6e-12 mm of landing, 4.2e-14 in direction and 7.6e-9 waves on the Leica.
  None is in a suite. A tighter or caller-set intersection tolerance in LensVisualizer would turn every one of them, and
  every `FLOOR`, into a `PASS`.
- **To watch with a third engine.** A floor needs every other engine within 1e-12 of `ref` in direction, a thousandth of
  the gate, where a length has a hundredth. On the zoom above `ref` itself is up to 4.9e-13 from the truth in direction,
  half of that agreement, so an engine as exact as `ref` may be more than 1e-12 from it there: the three pairs of that
  zoom that are floors would then be `FAIL`, by the condition and not by a defect of either. Nothing is widened for it
  ahead of a measurement. On the Hologon, whose floors are the ones in a suite, `ref` is within 6.5e-16 of the truth in
  direction, 4.0e-14 mm in landing and 7.9e-11 waves on every ray of its full field.
- **Before and after policy version 4**, over that sweep at `1ed8cc3d`: R2 had 14 235 `PASS`, 39 `FLOOR` and 96
  `FAIL`, and has 14 235, 53 and 82; R3 has 14 345, 24 and 1, as it had. The 14 pairs that changed are the six of
  `apple-iphone-12-main-wide`, the five of `apple-iphone-7-wide-camera-lens` and three of
  `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr`: each had a direction between 1.0e-9 and 4.1e-9 as its only figure
  without a floor. No other verdict moved. Of the 82 that fail, 77 are rays LensVisualizer loses where two
  surfaces cross (below), which no floor reaches.
- **Class.** numerical.

### A total internal reflection is "failed", and a miss is "failed" until it is proven

- **Where.** `finalizeTraceResult` in `src/optics/trace/utils.ts` gives every trace with a failure reason the
  status `failed`: a reflection as well as an intersection that was not found (`noBracket`,
  `noConvergedIntersection`). What is physical and what is numerical is decided afterwards, by
  `mtfTraceClassification` in `src/optics/analysis/mtfRayClassification.ts`: a clip and a total internal
  reflection are `blocked`; a missed surface is `blocked` only where an independent test proves that the ray
  passes outside the surface's clear cap, and `failed` otherwise.
- **Effect.** Read by its status alone, a ray that passes a lens 60 mm off the axis and meets nothing would be a
  failure of the tracer, and every probe lattice that reaches past a front element would be full of them.
- **Handled.** `lv` reports LensVisualizer's own classification: `blocked` is status 1 and `failed` status 2. The
  end surface is the first surface the ray did not pass: the hit LensVisualizer marks as clipped, or the surface
  it has no hit on. On the benchmark's 39 302 launch rays not one is `failed`, and of the 16.4 million rays of the
  catalog sweep none is: every ray LensVisualizer does not land, it calls `blocked`. So no ray of `lv` is left out
  of the mask that R2 judges, and a ray it loses for a reason of its own is a mismatch there (the next two
  entries).
- **Class.** convention.

### Beyond a clear aperture a hit is computed by rules of LensVisualizer's own

- **Where.** `intersectSurfaceProfile` in `src/optics/math/intersection.ts` restricts an asphere to its authored
  cap (`selectAsphericCapHit`), the sag keeps a conic real beyond its end by clamping the root, and the search for
  a surface runs forward only, between bounds taken from the clear semi-diameter (`sequentialSurfaceMinT`,
  `sequentialSurfaceMaxT` in `src/optics/trace/pathPlanner.ts`). A ray stopped by an aperture still has a hit on
  the surface that stopped it.
- **Effect.** Where a ray is clipped, LensVisualizer's hit point need not be the point another engine computes for
  the same surface, and where two surfaces cross inside a clear aperture it finds no hit at all. The continuation
  of a surface is not small either: the polynomial of an aspheric front surface, evaluated where the outer cells
  of a wide field's lattice start, lies in front of LensVisualizer's launch plane in 20 ray sets of the catalog, by
  up to 1e8 mm (`sigma-28-45mm-f18-dg-dn` at full field). A rule that asked a ray to start in front of the formula
  would refuse those rays, which LensVisualizer traces without trouble.
- **Handled.** The contract takes a surface for its sag within its clear aperture, and nothing of the formula
  beyond: a ray starts in front of that part of the first surface, which every launch ray of the catalog does by
  10 mm or more, and a ray that does not meet a surface within its clear aperture is blocked there. It has no hit
  on the surface a ray ended at: every value of a ray is NaN from its end surface on, in every engine. Positions
  are compared on rays that passed.
- **Class.** method.

### Where two neighbouring surfaces cross, the ray is lost

- **Where.** `traceSequential` searches for the next surface forwards only, from the last hit, between the bounds
  of `sequentialSurfaceMinT` and `sequentialSurfaceMaxT` (`src/optics/trace/pathPlanner.ts`). A surface that lies
  behind the hit, by more than the 1e-9 mm it forgives, is not found: the trace ends `failed` with the reason
  `noBracket`, and `mtfTraceClassification` calls the ray `blocked`.
- **Effect.** A prescription can put a surface behind the one before it within both clear apertures: a stop or a
  flat face set into the curve of its neighbour, where the neighbour's sag at the rim is more than the gap at the
  vertex. A sequential trace follows the order of the prescription and steps back to it; that is what the contract
  asks and what `ref` does. LensVisualizer drops the ray, and its MTF is that of the rays that are left. Six lenses
  of the catalog do this at their default state, on their reference line (rays lost at fields 0, 0.5 and 1, of
  some 1100 to 1400 launched for each): `vivitar-series-1-70-210-f35` at surface 21 (484, 484, 500: every ray that
  reaches it more than 0.4 µm off the axis, because a curved face and a plane share a vertex there),
  `leica-elmarit-90f28` at 5 (216, 156, 126), `olympus-zuiko-auto-s-50f14` at 6 (212, 138, 6),
  `bertele-sonnar-50f2-scaled` at 6 (0, 30, 4), `pentax-da-18-55mm-f35-56-al` at 15 (16, 14, 0) and `nokton-50f1`
  at 7 (0, 8, 0). In the 60-digit trace every such ray passes the surface where `ref` puts it.
  A zoom can do it at one end and not at the other. At the tele end (one sweep outside the tests at `ed78cf40`:
  the 296 zooms that export, on the reference line and the photopic lines, 5056 ray sets, 3.4 million rays ok in
  both) three zooms do it: the Vivitar as at the wide end (484, 496, 520), and two that lose no ray at the wide
  end, whose stop plane comes to lie inside the curve before it: `nikon-ai-zoom-nikkor-25-50mm-f4` at 8 (380, 356,
  342: the gap in front of the stop closes) and `nikon-ai-s-zoom-nikkor-35-70mm-f35` at 15 (50, 48, 48: the iris
  opens past the circle in which the curve before it meets the stop's plane). LensVisualizer's MTF tab then
  traces f/4.92 at the tele end of the first, an f/4 lens, and f/3.62 for f/3.5 of the second. The Pentax does it
  at the wide end only.
- **Handled.** Nothing is forgiven: each of these rays is one that `lv` stopped and `ref` passed, well inside the
  clear aperture, so it is a mask mismatch and the pair fails R2 (14 pairs on the reference line, 63 on the
  photopic lines, 2394 and 6998 rays; at the tele end 9 and 35 pairs, with every other pair of that sweep passing
  R2 but six of `fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii` that are `FLOOR`, and every pair passing R3). None
  of the eight is in a suite. An integration test (`test/integration/lv/rungs.test.ts`) holds each to this, at
  the end of the zoom where it happens: the surface, LensVisualizer's `noBracket`, and the step backwards in
  `ref`'s trace; it fails on the day LensVisualizer traces through.
- **Class.** method.

### A ray bent past the perpendicular to the axis

- **Where.** The same forward search. Glass to air just inside the critical angle, at a point where the surface's
  normal leans from the axis, sends a ray out along the surface: more than 90° from the axis, travelling back.
- **Effect.** The line of such a ray still crosses the next surface, behind the ray. A tracer that intersects
  lines would take that for a hit and carry on: `ref` did, until it was held to LensVisualizer on
  `fujifilm-fujinon-xf-27mm-f28` at 510 nm, where two rays of the full-field lattice leave surface 10 at 94° to
  the axis.
- **Handled.** The contract says it: a ray that no longer travels toward +z behind a surface goes to no further
  surface and is blocked at the next one. LensVisualizer finds no intersection there (`noBracket`, classified
  `blocked`), `ref` does not look for one, and the two agree. It is the one place where the comparison corrected
  the reference engine and not the other way round.
- **Class.** convention.

### The MTF bundle traces half its lattice and mirrors the rest

- **Where.** `traceMtfBundle` in `src/optics/analysis/mtfTracing.ts` starts at `grid.columns / 2` when every
  profile is symmetric in x, and writes each ray a second time with x negated (`mirrorPupilRay`). The lattice has
  an even number of columns, so no cell is on the meridional plane, and the chief ray, `mtfLaunchRay(launch, 0, 0)`,
  is no cell of it.
- **Effect.** Half the rays of a bundle were never traced. Nor are they the other half of the lattice to the last
  bit: a cell's launch point is `x0 + (column + 0.5) × step`, which rounds differently on the two sides, so the
  mirror image of a traced cell is not exactly the cell opposite. On the benchmark, 4493 of the 11 441 mirrored
  rays equal a real trace of their cell in every bit, and the others lie within 3.5e-13 mm of it.
- **Handled.** A ray set holds every cell of the lattice as a ray of its own, at the cell's own launch point, and
  `lv` traces each: 39 266 cells where LensVisualizer's bundles trace 19 633. Its 11 441 rays that land, of those
  it did trace, are reproduced bit for bit, in origin, weight, landing and optical path. The chief ray follows the
  cells as the last ray, with weight 0.
- **Class.** method.

### A bundle is found once, at the reference line, from a seed

- **Where.** `findMtfFieldFootprint` scans the launch plane at `support.spectralLines[0]` only, starting from a box
  of 1.25 times `options.pupilSemiDiameterMm`; `mtfLaunchGrid` then divides the larger side of the beam it found.
  The MTF tab's seed is the entrance pupil of the wide-open stop scaled by the f-number
  (`currentEPSD` in `src/components/hooks/useLensComputation.ts`); LensVisualizer's audit scripts pass another.
- **Effect.** Every line of a case is traced with the rays of its reference line, and the lattice is another one
  for another seed, another reference line or another stop: `nikon-z-24-70f4s` at its wide end has 36 × 29 cells
  at full field on the d line and 36 × 31 with 555 nm as the reference line.
  The seed is no detail: on the 12 benchmark configurations the tab's MTF with the audit scripts' seed, the
  nominal pupil `L.EP.epSD`, in place of the tab's lies 0.003 to 0.013 from the tab's own (measured once, outside
  the tests; a test holds three of them to more than 0.001). A seed that is off by one unit in the last place
  moves the launch rays by some 1e-14 mm.
- **Handled.** The ray sets ask with the lines of the case, so that the footprint is found at the case's own
  reference line, and with the seed of the MTF tab: the pupil radius its hook hands over for the stop radius of
  the case (`lvPupilSeed`, `src/engines/lv/tabRequest.ts`), which the product MTF of `lv` asks with too. A set is
  identified by its content, never by the request that made it.
- **Class.** data.

### What the MTF tab asks is written in React, and nowhere else

- **Where.** `MtfTab.tsx` (`src/components/display/analysis/`) builds the options of `computeMtf` from
  `DEFAULT_MTF_PREFERENCES` and from two radii of the hook `useLensComputation.ts`: `currentPhysStopSD`,
  `(wideOpenStopSD × currentFOPEN) / fNumber`, and `currentEPSD`, `(baseEPSD × currentFOPEN) / fNumber`, with
  `baseEPSD` the entrance pupil of the wide-open iris found with the analysis field geometry. It names no
  frequencies, so the engine computes its 51 default ones, of which the tab draws two. A worker rebuilds the lens
  and runs the request. No function of LensVisualizer returns that request.
- **Effect.** "The MTF LensVisualizer presents" is the answer to that request and to no other. LensVisualizer's
  own scripts ask otherwise: its audit scripts with the nominal pupil and the stop of the first zoom station, its
  chart-regression report with a grid cap of 256, the fields and frequencies of the published charts and radii
  that are not scaled by the f-number.
- **Handled.** `src/engines/lv/tabRequest.ts` restates the hook and the tab expression by expression, on the
  functions and defaults they read, which the binding imports (`fNumberAtStopdown`,
  `computeAnalysisFieldGeometryAtState2`, `resolveMtfSpectrum`, `DEFAULT_MTF_PREFERENCES`, `MTF_FREQUENCIES`).
  The profile `lv-tab-default` of `mtf.native` is that request. Source canaries pin every restated expression,
  the defaults and the worker's call. On the 12 benchmark configurations the answer is `computeMtf` of a request
  spelled out a second time in the test, in every bit, and the lens rebuilt as the worker rebuilds it gives the
  same bits. The focus shift and the traced f-number of the eight configurations that are also in
  LensVisualizer's committed chart-regression report are that report's to its printed precision: the axial focus
  search and the traced aperture do not depend on what the report asks differently.
- **Class.** data.

### The iris the MTF tab traces wide open is not always the iris of the prepared state

- **Where.** The hook's `currentPhysStopSD` at wide open is `(wideOpenStopSD × currentFOPEN) / fNumber` with
  `fNumber` equal to `currentFOPEN`: a product divided by one of its factors, which in double arithmetic is not
  always the other factor again.
- **Effect.** On `nikon-z-mc-105f28` the stop radius the tab traces is one unit in the last place above the one
  of the prepared state, which is the one of the case a run exports for `wide-open`. The pupil radius does the
  same on `sigma-35mm-f14-dg-hsm-a`. Over the 868 lenses that export, at their default state (one sweep outside
  the tests, at `ed78cf40`), the stop radius is off its iris on 79 and the pupil radius off the entrance pupil of
  the iris on 81, never by more than 2e-16 of itself. One unit in the last place moves no MTF value that anyone
  reads, but it is another request and another case: a case's identity is its content.
- **Handled.** The profile `lv-tab-default` is about the tab's case, with the hook's stop radius, and `lvrtc mtf`
  builds that case (`src/engines/lv/tabProfile.ts`). For 11 of the 12 benchmark configurations it is the case the
  benchmark suite runs on the photopic lines; for `nikon-z-mc-105f28` it is another, and the engine refuses the
  profile on the suite's case (`bad-spec`) rather than answer about a stop that is not the tab's. An integration
  test holds the two statements together: the cases are the same exactly where the two radii are.
- **Class.** numerical.

### LensVisualizer's MTF has three spectra, two planes and one kind of field

- **Where.** `MtfOptions` (`src/types/mtf.ts`) names a spectrum (`reference`, `cdf`, `photopic`), a focus mode
  (`design`, `best-axial`, `auto`) and fractions of the reference image height. It has no wavelength list, no
  image-plane position and no field angle.
- **Effect.** A case on other lines, a case whose image plane was moved, and a request for fields by angle have
  no answer from LensVisualizer's product MTF. Nor has a reference wavelength that was asked for by number: such a
  case carries anchored indices, and LensVisualizer traces its reference spectrum with the authored ones. Its gate
  also limits one request: at `ed78cf40` to 101 fields and 501 frequencies, none above 1000 cycles/mm, and calls
  anything beyond `invalid-input`, the same reason it gives a request that is malformed.
- **Handled.** `lv` answers each `unsupported`, with an item that says which (`lines.custom-spectrum`,
  `image-plane.shifted`, `fields.angles-deg`, `fields.limits`, `frequenciesPerMm.limits`); nothing is substituted.
  The limits are asked of the gate, not restated: a request it has passed is asked again with the spec's fields
  and then with its frequencies, so a refusal is of that member and no failure of the engine. Its `engine-best`
  is LensVisualizer's `best-axial`: a geometric search on the axial bundle, whatever the method, whose shift the
  answer states. A later comparison that wants another engine on LensVisualizer's plane asks that engine about a
  case at that shift.
- **Class.** method.

### A lens outside the MTF path has no MTF, and says why

- **Where.** `assessMtfSupport` refuses a fisheye projection, an annular aperture, a folded path and a scale it
  has not verified; the tab then shows the gate's message and makes no request.
- **Effect.** 12 lenses that export (every one a fisheye, at `ed78cf40`) have a case on their reference line and
  no MTF in LensVisualizer.
- **Handled.** `lv` asks the gate first, on the reference line, and answers `mtf.native` for such a case
  `unsupported` with the gate's reason as the item (`unsupported-path`) and its message, whatever the spec asks.
  `lvrtc mtf` builds the reference-line case such a lens has, so the command presents what the tab presents: no
  MTF, and why. An integration test finds every such lens of the catalog and holds each answer to the gate.
- **Class.** data.

### A focus station a lens documents is certified only inside the MTF path

- **Where.** `assessMtfSupport` turns a lens outside its MTF path away (`unsupported-path`) before it looks at the
  focus position, so `MtfSupport.conjugate` is set only for a lens the path covers. A lens file may still list the
  station under `finiteConjugates`.
- **Effect.** A fisheye that documents a close-focus station has no conjugate LensVisualizer certifies for it. Its
  case at infinity focus exports on the reference line as before; the station does not.
- **Handled.** The exporter takes the object of a refocused state from `MtfSupport.conjugate` and from nothing
  else: such a station is `finite-conjugate-unavailable`, never exported with an object distance read from the
  lens file. The integration test of the focus stations asks the gate for each documented station, compares `lv`
  and `ref` at every one it certifies, holds every other to that refusal, and names it in its diagnostic. Seen
  first on a fisheye that was in LensVisualizer's working tree, not yet committed, at `b7deb221`.
- **Class.** data.

### A field can lie outside the model

- **Where.** `resolveMtfFieldTargets` in `src/optics/analysis/mtfFields.ts` resolves a fraction of the reference
  image height, which is the format corner where a lens declares a format, and marks it `outsideModel` when the
  height lies beyond the last one the authored clear apertures let light reach.
- **Effect.** The default fields of a ray rung are the fractions 0, 0.5 and 1, and the last of them has no rays on
  such a lens: of the first 120 lenses of the catalog, 11 end short of their format corner.
- **Handled.** The field is a coded problem of that run, `outside-modeled-field`, recorded in the manifest and
  printed; the other fields are traced, and the run does not fail for it. A field LensVisualizer finds no chief ray
  for is `chief-ray-failed`, and one whose beam is stopped altogether `vignetted`. The 12 benchmark configurations
  have rays at all three fields.
- **Class.** data.

### One lens has a glass that absorbs

- **Where.** `bulkTransmissionForTrace` in `src/optics/trace/bulkAbsorption.ts` multiplies `exp(−α × length)` over
  the stretches of a ray inside an element with `absorptionCoefficientPerMm`; `mtfImagePoint` returns it as the
  weight of a landing. One lens of the catalog has such an element: `minolta-stf-135f28-t45`.
- **Effect.** Its rays do not weigh alike: the transmitted rays of its axial bundle weigh from 0.84 down to 0.044.
  An MTF summed with equal weights would be another lens's.
- **Handled.** A ray's weight in a set is LensVisualizer's own: its launch weight times the transmission of its
  path at that line, taken from `mtfImagePoint`. An engine reads no weight; an estimator uses the column as it is.
  The case carries the note `bulk-absorption`.
- **Class.** data.

### No lens serves two of the translation paths

- **Where.** `assessMtfSupport` rejects a lens that mixes d- and e-referenced glasses unless every glass has
  catalog dispersion data (`mixed-reference`), and a folded path. The catalog has one lens of mixed references,
  `sony-fe-14mm-f18-gm`, which lacks that data, and every lens with an annular aperture is a mirror lens
  (`nikon-reflex-nikkor-c-500mm-f8` among them).
- **Effect.** The feature suite cannot have a run for "mixed d and e references" or for "an annular aperture":
  there is no case to run. With such runs in it, `lvrtc run suites/features.json` could only ever exit 1.
- **Handled.** The suite has no run for either path; the census lists both lenses with their codes. An
  integration test (`test/integration/lv/suites.test.ts`) exports the two lenses, and every other lens of the
  catalog that has either property, and fails on the day one of them has a case: that is when the run goes back.
- **Class.** data.

### A prime keeps whatever zoom position it is handed

- **Where.** `prepareRuntimeState(L, focusT, zoomT)` records the `zoomT` it is called with on the state, also for a
  lens that is no zoom (`L.isZoom` false): the surfaces of a prime at "zoom 0.5" are those at zoom 0, and
  `state.zoomT` says 0.5.
- **Effect.** A prime exported with a zoom position had the case id of the prime, since the identity of a case is
  its system and conditions, with a provenance that stated a position the lens does not have, and `lvrtc mtf`
  named its run `<key>-zoom0.5`: one case under two names.
- **Handled.** The exporter asks LensVisualizer for zoom 0 whenever `L.isZoom` is false (`exportCase`), so a prime
  has one case, one provenance and one run name whatever is stated; `lvrtc export`, `lenses show` and `mtf` say
  on the error stream that the position was ignored. It goes with the rule of the zoom: a zoom without a position
  is compared at both ends, and a prime has none (the plan, "Amendments since approval").
- **Class.** convention.

### The tele end is the zoom slider at 1, not the last station to the bit

- **Where.** `prepareRuntimeState` places a variable gap between two zoom stations as `a + (b - a) * t` (`lerp`,
  in `resolveVariableThickness` of `src/optics/prescription/variables.ts`). At the tele end `t` is 1, and
  `a + (b - a)` is not always `b` in doubles.
- **Effect.** At LensVisualizer `ed78cf40`, 278 of the 1320 variable gaps of the 297 zooms at zoom 1, on 229
  lenses, are not the gap authored for the last station: `1.4900000000000002` for `1.49`, at most 3.6e-15 mm off.
  At zoom 0 every gap is the first station's (`a + (b - a) * 0` is `a`), and the iris of
  `wideOpenStopAtZoom` is the station's at both ends. The widest f-number is interpolated alike
  (`fopenAtZoom`), which is why `lvrtc mtf` can say "wide open at f/3.5000000000000004" of a tele end.
- **Handled.** Nothing to handle between engines: the case is the state LensVisualizer traces at zoom 1, bit for
  bit, and every engine is asked about that case. It matters to whoever sets a case beside a patent's table, and
  to the zoom-station matrix (Stage 4.4): a station is reached through the slider, so its gaps need not be the
  authored ones either.
- **Class.** convention.

## Any two engines

### A pupil that is metres away cannot be placed to 1e-9 mm

- **Where.** The position of a pupil is a quotient, height over angle, of a ray from the stop. In a nearly
  telecentric lens the angle is small and is itself the remainder of a sum that cancels.
- **Effect.** `viltrox-af-75mm-f12-pro` has its exit pupil 7.7 m behind the first vertex at the d line and, at the
  photopic lines, from 1.4 m to 20 m behind it and 14 m in front of it. `lv` and `ref` place it 1.1e-9 mm apart at
  the d line and up to 3.0e-9 mm apart at 650 nm: 2e-13 of the distance, and above a plain gate of 1e-9 mm. Over
  the 1676 cases of the catalog (868 lenses on the reference line, 808 on the photopic lines) it is the only one
  that far apart; the next largest difference of a pupil's position is 1.9e-11 mm. Neither engine is wrong, and
  neither can do better: one unit in the last place of 20 m is 3.6e-12 mm. Worked out in exact rational arithmetic from
  the same radii, gaps and indices, the pupil lies up to 3.5e-9 mm from where `lv` puts it and up to 4.9e-9 mm
  from where `ref` does (both at 610 nm, where the two happen to err alike and differ by 1.4e-9 mm); at the d line
  `lv` is 1.8e-11 mm off and `ref` 1.1e-9 mm, and at 650 nm 2.7e-10 mm and 3.3e-9 mm. So no change to the
  reference engine alone would bring every line of this lens inside a plain gate of 1e-9 mm.
- **Handled.** The gate of R1 was amended for it (the plan, "Amendments since approval"): the position of a pupil
  passes within 1e-9 mm, or within 1e-12 of its distance from the image plane where that is larger. The comparator
  reports both figures, `pupilZ.maxAbs` and `pupilZ.maxScaled`, and judges the second. On this lens the exit
  pupils are 1.09e-9 mm apart at the d line and 3.03e-9 mm at 650 nm, which on the scale of their distance is
  1.4e-10 and 2.1e-10: its reference-line case passes R1.
- **The radius of that pupil** is as large as it is far: 3.4 m at the d line and 6.3 m at 650 nm, the same quotient.
  There the two engines hold 4.8e-10 mm and 1.35e-9 mm apart, 2e-13 of the radius. In exact rational arithmetic, as for
  the position, neither is wrong: with the gaps taken as exact `lv` is within 1.6e-9 mm of the radius at every line and
  `ref` within 2.2e-9 mm (both at 610 nm), and at 650 nm 1.2e-10 mm and 1.5e-9 mm. With the vertices of the case taken
  as exact in their place, which are the sums of those gaps and one rounding from them, the exact radius is another by
  6e-10 mm at 650 nm and by 1.2e-9 mm at 610 nm, and `lv` is then 5.2e-10 mm above it at 650 nm and `ref` 8.3e-10 mm
  below: what the radius is, to 1e-9 mm, depends on which of two equal statements of the lens is read. While only the
  position of a pupil was judged on the scale of its distance, the photopic case of this one lens failed R1, by
  `exitPupilSemiDiameter` at 650 nm, the only pair of the catalog that did. Since policy version 4 the radius of a pupil
  is judged as its position is, on the scale of the distance of the pupil it is the radius of (`pupilRadius.maxScaled`,
  with the plain figure `pupilRadius.maxAbs` beside it): 6.3e-11 at the d line and, with the pupil 14 m from the image
  plane at 650 nm, 9.4e-11. The lens passes R1 entirely, and so does every one of the 1676 cases of the catalog (at
  `1ed8cc3d`). It is a scale and no excuse: a radius is scaled by the distance of its own pupil and not by its own size,
  the radius of a pupil within a metre of the image plane keeps the plain 1e-9 mm, and on this lens 1e-11 of the
  distance still fails. An integration test pins all of it (`test/integration/lv/engine.test.ts`). Every value of every
  lens that is neither the position nor the radius of a pupil is within 1.1e-11 mm; every other pupil position is within
  1.9e-11 mm, and every other pupil radius within 4.2e-12 mm.
- **Class.** numerical.

## optiland

Measured at optiland `4e893f53` (numba 0.65.1, numpy 2.3.5, Python 3.14.8). The figures of rung R0 were taken
with LensVisualizer at `b7deb221` (engine closure `46b028bc`, 151 files), over the suites and over every case of
the catalog: 2267 cases of 1173 systems, the primes once and the zooms at both ends, each on its reference line
and on the photopic lines, 53 378 surfaces in all. LensVisualizer moved to `1bf669ee` (closure `66027121`) while
the stage was written; the suites were run again there, with every figure the same.

### Importing optiland writes into its own checkout

- **Where.** `optiland/backend/numpy_backend/conic.py`, `optiland/scatter.py` and
  `optiland/geometries/nurbs/nurbs_basis_functions.py` decorate functions with `@njit(cache=True)`. numba decides
  where such a function is cached when the decorator runs, on import (`numba/core/caching.py`): unless
  `NUMBA_CACHE_DIR` is set it takes the `__pycache__` beside the source and, to see whether it may write there,
  creates a temporary file in it and removes it. Later, when the function is first called, it writes an index
  (`.nbi`) and the machine code (`.nbc`) there: two such files of an earlier session lie in the checkout.
- **Effect.** A bare `import optiland` changes the modification time of three `__pycache__` directories of the
  checkout and leaves no file; a traced ray then leaves files. git sees neither: `__pycache__` is ignored.
  matplotlib, which optiland imports, writes a font cache into its configuration directory, and Python writes
  bytecode beside every source it imports.
- **Handled.** The worker's environment names a place for each under the comparator's cache directory, and the
  worker sets the same itself before it imports anything of optiland ([reference](REFERENCE.md#the-engine-optiland)).
  Bytecode is cached there too, since Stage 2.2: with a prefix (`PYTHONPYCACHEPREFIX`) Python reads and writes no
  `__pycache__` beside a source, and the worker turns the writing on only once it has checked that the prefix lies
  outside optiland. `npm run test:optiland` takes a recursive snapshot of the checkout and its environment before
  its first test and after a cold start with the JIT compiling and the bytecode being written, and nothing may
  differ. It was found the hard way: a timing
  experiment of Stage 2.1 that ran the interpreter with the variables in one unsplit shell word changed those
  three modification times, and nothing else.
- **Class.** none of the ladder's: it is no difference between answers, but a rule of the house.

### optiland has no version that identifies its code

- **Where.** There is no `optiland.__version__`; `importlib.metadata.version("optiland")` gives the
  distribution's, which for an editable install of a checkout ends in `.dYYYYMMDD`, the day of the install.
- **Effect.** Two installs of the same commit state different versions, and an edit to a source file states none.
- **Handled.** The engine's fingerprint is made of the checkout's commit and dirty flag, a hash of the package's
  Python sources and the versions it computes with ([contract](../contract/CONTRACT.md#engine-descriptor)); the
  version string is no part of it. Where the worker states the version, as the descriptor's `version` and as the
  detail `distVersion`, it leaves the day off (`stated_version`): `0.6.2.post117+g4e893f53`, which names the
  commit, and not `0.6.2.post117+g4e893f53.d20261007`. So no manifest and no report of a run holds a date.
- **Class.** none of the ladder's.

### What optiland loads may write to the standard output

- **Where.** Importing optiland loads matplotlib, vtk, numba and scipy. matplotlib logs "Matplotlib is building
  the font cache" on its first start, and numpy warns of an invalid value in a square root for a ray that misses a
  surface. Both go to the standard error as Python is set up by default; nothing promises that of every library,
  of a C library that writes to its own `stdout`, or of a later version.
- **Effect.** Anything written to the standard output of a worker would be read as a reply, and end the worker.
- **Handled.** The worker kit reserves the reply stream at the level of the file descriptor before optiland is
  imported (`protect_stdout`): file descriptor 1 is the log from then on, for Python, for a C library and for a
  child process alike.
- **Class.** none of the ladder's.

### Nothing clips a ray unless the surface has a physical aperture, the stop included

- **Where.** `Surface._trace_real` in `optiland/surfaces/standard_surface.py` clips only `if self.aperture`.
  `is_stop=True` marks the surface the system's aperture is measured at, and `set_aperture("float_by_stop_size",
  d)` says how wide the paraxial beam is there; neither stops a ray. optiland's own rays are aimed inside the
  pupil, so its own analyses never notice.
- **Effect.** Rays that are given, as every ray of rungs R2 to R4 is, would pass the iris and every rim: optiland
  would land rays that LensVisualizer and `ref` stop, and its MTF would be another lens's.
- **Handled.** The builder gives every surface of a case a `RadialAperture` of the case's clip radius, the stop
  surface like any other with the radius of the stop setting, and the image surface none. `verify_optic` reads
  each back and refuses an optic in which a surface has none; `system.describe` echoes each as `clipRadius`, and
  R0 holds it to equality.
- **Class.** convention.

### The surface factory drops a keyword it does not know

- **Where.** `GeometryFactory.create` in `optiland/surfaces/factories/geometry_factory.py` keeps of the keywords
  of `surfaces.add` those that are fields of the geometry's configuration, and says nothing of the rest:
  `tolerance=1e-12` for `tol=1e-12`, or `coefficients` on a `standard` surface, changes nothing and raises
  nothing.
- **Effect.** A misspelt or misplaced keyword builds another surface than was asked for, silently.
- **Handled.** Nothing the builder hands over is believed: `verify_optic` (`workers/python/lvrtc_optiland/build.py`)
  reads every value back from optiland's objects and holds it to the case, and an optic that differs is answered
  as an error of the code `build-mismatch` that names the surface and the field, before anything is described. A
  test renames `tol` and finds `surface 3 (4): tol is 1e-06 in the optic optiland built and 1e-12 in the case`.
- **Class.** convention.

### A surface's geometry does not say how it bends a ray

- **Where.** `SurfaceFactory.create_surface` in `optiland/surfaces/factories/surface_factory.py` gives a surface
  of the type `paraxial` a `Plane` for its geometry and a `ThinLensInteractionModel` for what it does to a ray; a
  phase profile and a grating have models of their own, a `material="mirror"` reflects, and `coating="fresnel"`
  takes intensity at the surface. The geometry, the aperture and the medium of such a surface are a plane's.
- **Effect.** An optic with a thin lens of 50 mm where the contract's every-feature case has its stop, a plane,
  holds every number of `system.describe` as the case states it, and has a focal length of 19.03 mm where the case
  has 26.86 mm (`optic.paraxial.f2()`). R0 would pass on it, and every rung after it would differ.
- **Handled.** `verify_optic` holds the class of each surface's interaction model to optiland's
  `RefractiveReflectiveModel`, its `is_reflective` to false and its coating to none, beside the geometry. The thin
  lens was built on purpose in the review of Stage 2.2 and passed the verification of that day; a test builds it
  now and finds `surface 2 (STO): the model of its interaction is 'ThinLensInteractionModel'`.
- **Class.** convention.

### An asphere built through the factory is intersected to 1e-6 mm

- **Where.** `EvenAsphereConfig` and `OddAsphereConfig` in `optiland/surfaces/factories/geometry_configs.py`
  default `tol` to 1e-6, a residual of the Newton iteration in mm, where the geometry classes themselves default
  to 1e-10. `surfaces.add(surface_type="even_asphere", ...)` goes through the configuration.
- **Effect.** A hit on an asphere would lie up to 1e-6 mm from the surface, a hundred times the gate of R2.
- **Handled.** The builder passes `tol=1e-12` and `max_iter=100` for every asphere, and `verify_optic` holds the
  built geometry to both: the first is the keyword the factory drops when it is misspelt (above).
- **Class.** numerical.

### The first coefficient of an even asphere is the term of power 2

- **Where.** `EvenAsphere.sag` in `optiland/geometries/even_asphere.py` adds `Ci * r2 ** (i + 1)`: entry `i` of
  `coefficients` multiplies r^(2i + 2), so the list starts at r^2. `OddAsphere.sag` adds `Ci * r ** (i + 1)`: its
  list starts at r^1. LensVisualizer's coefficients start at A4 (even) and A3 (odd).
- **Effect.** A list laid out as `[A4, A6, ...]` is a surface whose every term is one power of r^2 too low: a
  lens that differs from the case by fractions of a millimetre in sag, with nothing to say so.
- **Handled.** `coefficient_list` lays the list out to the highest power of the case, with 0 where the case has
  no term: `[0, A4, A6, ..., A20]` for an even asphere, `[0, 0, A3, A4, ...]` for one with an odd term. An asphere
  is even when every power it states is even, whatever the coefficients, as the feature flags of a case are.
  Three things hold the layout: the terms are read back by a rule written from optiland's two sag functions
  (`terms_of`) and held to the case's; the sag optiland evaluates is held to the contract's sag of the case's
  surface, which depends on no layout (`SAG_PROBE_FRACTIONS`: a builder and a reader that agreed on a wrong layout
  are found by it, and a test makes them agree so); and R0 compares the sag with two other engines. Measured over
  the catalog, powers up to 20: no term differs, and the sag of optiland and of `ref` differ by at most 6.0e-16 on
  the scale of the sag's rounding.
- **Class.** convention.

### A bare number as an aperture is a diameter, and so is the stop's size

- **Where.** `configure_aperture` in `optiland/physical_apertures/radial.py` makes of a number given as
  `aperture=` a `RadialAperture(r_max=number / 2)`; `RadialAperture(r_max=...)` itself takes a radius, and
  `r_min` for a central obstruction. `FloatByStopAperture` (`set_aperture("float_by_stop_size", value)`) takes the
  stop's diameter.
- **Effect.** A clip radius given as a bare number clips at half of it; a stop radius given as the stop's size
  halves the pupil.
- **Handled.** The builder passes `RadialAperture(r_max=semiDiameter, r_min=innerSemiDiameter)` and
  `2 x stopSemiDiameter`; `verify_optic` reads `r_max`, `r_min` and the aperture's value back, and
  `system.describe` states the stop radius as that value halved, which is the number again to the bit. A test
  passes the bare number and finds `aperture.r_max is 6.0 in the optic optiland built and 12.0 in the case`.
- **Class.** convention.

### The clip limit is inclusive to one unit in the last place of a square

- **Where.** `RadialAperture.contains` passes a ray where `x**2 + y**2 <= self.r_max**2` and
  `>= self.r_min**2`. The left side is numpy's, which squares by multiplying; the right side is a Python float
  raised to the power 2, which is the C library's `pow` and not always `r_max * r_max`: on this machine it is
  another double for 247 of 200 000 radii between 0.5 and 60 mm, the lower one for 202 of them.
- **Effect.** Both limits are inclusive, as the contract's are: a ray at the inner radius passes, and one at the
  clip radius passes for nearly every radius. For about one radius in a thousand a ray at exactly the clip radius,
  to the bit, is stopped; one unit in the last place inside it passes.
- **Handled.** Nothing: R0 compares the limit itself, which is the case's number, and a ray within 1e-8 mm of a
  limit is in the rim band of R2, where two engines may differ and nothing fails. No two engines could agree
  there in any case: `ref` compares a radius with the limit, optiland a square with a square.
- **Class.** numerical.

### An ideal material has one index, and first-order data is that of the primary wavelength

- **Where.** `IdealMaterial.n(wavelength)` in `optiland/materials/ideal.py` returns its index whatever the
  wavelength. Every accessor of `optic.paraxial`, the size of the entrance pupil and the reference of the exit
  pupil are evaluated at `optic.primary_wavelength`.
- **Effect.** One optic cannot hold the indices of two lines, and its first-order data is of one wavelength.
- **Handled.** One optic for each line of a case, with that line's index after each surface and that line's
  wavelength as its only one (`build_case`). `system.describe` reads the index table row by row, each row from
  its own optic. A test asks each optic at three wavelengths and gets its own row each time.
- **Class.** convention.

### A thickness places a surface at a running sum, and nothing places a shifted image plane

- **Where.** `CoordinateSystemFactory.create` in `optiland/surfaces/factories/coordinate_system_factory.py` puts
  a surface given `thickness=` at `float(z_prev) + float(t_prev)`, from 0 at the first surface. Given `z=` it puts
  the surface there, and from then on refuses `thickness=` on every later surface.
- **Effect.** R0 holds `vertexZ` and `imageZ` to the bit. A running sum of the case's thicknesses is the case's
  vertex only where the case's vertices are those sums. For a lens from LensVisualizer they are: measured on all
  1173 systems of the catalog, 27 481 surfaces, the sum is the vertex and the design image plane to the bit,
  because LensVisualizer's own `z` is that sum. The contract promises only 1e-9 mm between the two, and an image
  plane that was shifted is stated by no thickness: with the last gap stretched to reach it, `z + (imageZ - z)` is
  not `imageZ` on 7 to 12 of those 1173 systems, depending on the shift.
- **Handled.** The builder places every surface, the object and the image surface included, by `z=`, with the
  case's own number: nothing is added up. optiland's `surface.thickness` is then 0 on every surface, which its
  tracers do not read (its paraxial tracer and its real one both take positions from the coordinate systems;
  `verify_optic` holds `surfaces.positions`, the paraxial axis, to the same vertices). It matters to whoever
  prints a prescription of such an optic, which the comparator does not.
- **Class.** numerical.

### A standard surface without a radius is a plane, and a plane has no conic constant

- **Where.** `_create_standard` in the geometry factory returns a `Plane` for an infinite radius, whatever the
  conic constant; `_create_even_asphere` and `_create_odd_asphere` return an asphere of radius `inf`, which keeps
  its `k`.
- **Effect.** The contract echoes the conic constant an engine holds, and 0 for a plane. An asphere on a flat base
  states one, on which it shapes nothing; `ref` echoes it as stated.
- **Handled.** A shape of the kind `asphere` is always built as one of optiland's two aspheres, also where every
  coefficient is 0: `radius=inf` for a flat base. So `conic` comes back as the case states it, the curvature as
  `1 / inf`, which is 0, and the sag of a flat base is its terms alone (`r2 / (inf * ...)` is 0, not a NaN).
- **Class.** convention.

### The sag is written with the radius, is -0 at the vertex of a concave surface, and warns where it ends

- **Where.** `StandardGeometry.sag` evaluates `r2 / (R * (1 + sqrt(1 - (1 + k) * r2 / R**2)))`, where the contract
  writes the curvature; the aspheres add their terms to that one by one, without compensation.
- **Effect.** The sag agrees with the contract's to rounding and not to the bit, which is what the two sag metrics
  of R0 are for: over the catalog the largest difference from `ref` is 6.0e-16 on the scale of the sag's rounding
  (`tamron-35-150mm-f2-28-di-iii-vxd-a058`, surface 28), and 1.3e-10 mm in plain terms, on the surface of
  `russar-22-70f8` that ends 1e-9 mm short of a hemisphere. At a height of 0 on a surface of negative radius it is
  `0 / negative`, which is -0. Beyond the end of a conic the root is of a negative number: a NaN, with numpy's
  `RuntimeWarning: invalid value encountered in sqrt`. Where a conic ends, to the last place, the two forms round
  to different sides of 0: a conic of radius 10 and conic constant 0.5 ends at 10/sqrt(1.5), and at the double
  nearest to that, 8.16496580927726 mm, `1 - (1 + K) c^2 r^2` is -1.1e-16 in exact arithmetic. `ref` has -2.2e-16
  there and no sag; optiland's `1 - (1 + k) * r2 / R**2` is 0, and its sag is 6.67 mm. One double nearer the axis
  both have a sag, one double further out neither has. A hemisphere is not such a place: at a height that is the
  radius to the bit both roots are 0 or above, in every radius (`c r` never rounds above 1, and `r2 / R**2` is 1).
- **Handled.** `system.describe` writes -0 as 0 and every NaN as the one quiet NaN, and asks the sag with numpy's
  warnings off (`read_sag`). The builder's own probe of the sag skips a height within 1e-6 of the end of a conic,
  where one rounding decides between a number and none. R0 is not loosened for that one double: a sag that only
  one engine has is a NaN, which no limit admits, so a surface whose nominal semi-diameter, or a fraction of it
  that is asked, is that double fails R0 between optiland and `ref`. No surface of the catalog or of a suite is
  asked there; it was found with synthetic cases (61 cases at two sets of fractions: 119 pairs pass, and the 3
  that fail are this).
- **Class.** numerical.

### optiland keeps a surface's semi-aperture apart from the aperture that clips

- **Where.** `Surface.semi_aperture` (`set_semi_aperture`) is what optiland draws a surface to, and what its sag
  viewer evaluates a surface over; `Surface.aperture` is what clips. `optic.updater.update_paraxial()`, which its
  drawings and its optimiser call, overwrites the first with an estimate from paraxial ray heights.
- **Effect.** The contract has both too: `aperture.semiDiameter` clips, and the sag of `system.describe` is asked
  at fractions of `aperture.nominalSemiDiameter`, which on the stop surface is the stop setting.
- **Handled.** The builder sets each surface's semi-aperture to the case's nominal semi-diameter and
  `system.describe` multiplies the fractions with what it reads back, so that no number of an answer is taken from
  the case. The worker calls nothing that overwrites it, and `verify_optic` holds it to the case before anything
  is answered.
- **Class.** convention.

### optiland's first-order data does not see a term of power 2

- **Where.** The paraxial power of a surface is `(n2 - n1) / geometry.radius`
  (`optiland/interactions/refractive_reflective_model.py`, and `diff(n) / R` in
  `optiland/raytrace/paraxial_ray_tracer.py`): the coefficients of an asphere are in its sag and in its real rays,
  and not in `optic.paraxial`.
- **Effect.** The contract's first-order curvature is the base curvature plus twice the coefficient of a term of
  power 2. A singlet whose front surface has the term 1e-3 r^2 on a radius of 50 mm has the focal length 48.29 mm
  by the contract and 50.68 mm by `optic.paraxial.f2()`, which is that of the lens without the term. A term of
  power 1 has no first-order data at all, in any engine (`surface.asphere.linear-term`).
- **Handled.** Decided for the builder in Stage 2.2: it builds terms of power 1 and 2, as `odd_asphere` and as the
  first entry of `even_asphere`, reads them back, and `system.describe` echoes them; their sag is the contract's
  to rounding, held by the probe and by a test in 60-digit arithmetic. What optiland cannot answer for such a case
  is its own first-order data: `paraxial.first-order` of the engine (Stage 2.3) must be `unsupported` for a case
  with a term of power 2 that is not 0, as it is for a term of power 1 in every engine. No lens of LensVisualizer
  has either: its lowest coefficient is A3.
- **Class.** method.

### What the builder refuses

- **Where.** `workers/python/lvrtc_optiland/build.py` and `engine.py`.
- **Effect.** The engine declares every feature flag of the contract and no limit: an annular aperture (`r_min`),
  several lines (an optic each), a finite object (the object surface at the object plane), even and odd aspheres
  of any power, a flat base and a conic constant. Of the 2267 cases of the catalog none is refused, and each
  passes R0 against `ref`.
- **Handled.** What it refuses is an optic that is not the case. Whatever of the build comes back from optiland
  as another value than the case states is an error of the code `build-mismatch`, with the surface, the field and
  both values, and nothing is described; a call of optiland that optiland has deprecated is an error too, not a
  warning in a log. Every other quantity than `system.describe` is `unsupported` until its stage.
- **Class.** none of the ladder's.
