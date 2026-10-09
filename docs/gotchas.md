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
that lens it used to be a pupil's radius, which is now in the column of its own. The figures of the MTF replay and
of rung R4f were measured at `33ebdb30`, closure `78215d72`, still 151 files: what the replay added to the import
manifest (the refinement, the footprint's widening, the sampling constants, `computeMtfSteps`) is exported by files
the closure already held.

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

### The paraxial kernel is handed radii, and no lens has a term below A3

- **Where.** `traceParaxialSurfaces2` takes rows of radius, gap and index; `ASPHERIC_COEFFICIENT_SCHEMA` in
  `src/types/asphericSchema.ts` lists the conic constant, the even coefficients `A4` to `A20` and the odd ones
  `A3` to `A19`, and LensVisualizer's validation of a lens file knows no other key.
- **Effect.** None today. The contract allows a term of any power from 1, counts twice the coefficient of a term
  of power 2 as curvature at the vertex, and has no first-order data for a term of power 1. A lens with `A2` would
  be exported with the term (the exporter reads the power from the coefficient's name), LensVisualizer's sag would
  evaluate it, and its kernel would give the focal length of the lens without it.
- **Handled.** `lv` answers `paraxial.first-order` of a case with a term of power 1 or 2 as `unsupported`, with the
  item `surface.asphere.linear-term` or `surface.asphere.quadratic-term`, before the kernel is asked
  (`termItems`, `src/engines/lv/firstOrder.ts`); a test gives the fake tree both coefficients. optiland's own
  paraxial tracer reads the radius alone too, and its engine answers the same way (below); `ref` answers a term of
  power 2 by the contract's rule. The sweeps over the catalog would say so first: they hold every exported lens to
  an answer from `lv` and from optiland.
- **Class.** method.

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
- **With a third engine.** A floor needs every other engine within 1e-12 of `ref` in direction, a thousandth of the
  gate, and within 1e-10 mm in a hit and a landing, a hundredth. Stage 2.4 measured it with optiland (LensVisualizer
  `14da71d9`, closure `78215d72`). In the two suites the witness is there on every one of the 378 ray sets: optiland
  and `ref` are within 1.2e-12 mm in every hit, 2.1e-14 in direction and 8.9e-13 mm in landing, and the four floors of
  the Hologon are floors against `ref` and against optiland alike, with the reason naming both figures: optiland
  2.8e-15 in direction and 2.2e-13 mm in landing from `ref`, LensVisualizer 2.07e-10 and 1.10e-8 mm. Outside the
  suites it is not: on nineteen lenses of the catalog that the entries of this file name (460 ray sets), 50 pairs of
  `lv` and `ref` are `FLOOR` when the two are compared alone, and 36 with optiland beside them. The other 14 are
  `FAIL` with the reason "optiland does not agree with ref": three of `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr` at
  its wide end, three of `fujifilm-fujinon-xf-27mm-f28`, five of `apple-iphone-7-wide-camera-lens` and three of
  `russar-22-70f8`. In each the 60-digit trace puts the difference on optiland: on the worst ray of the first it is
  3.2e-11 from the truth in direction and 8.6e-10 mm in a hit, where `ref` is within 2.2e-13 and 5.8e-12 mm
  ([optiland's sums on an asphere](#on-an-asphere-optiland-is-as-exact-as-a-plain-sum-of-its-terms)). So the floor
  rule does what it says, and what it says is strict: an engine whose own arithmetic is a hundred times coarser
  than the arbiter's is no witness on a lens that magnifies arithmetic a thousand times, and LensVisualizer's floor
  was then not granted. That was policy version 4. The owner decided it on these figures: since policy version 5
  such a witness is named in the reason ("the witness did not corroborate", with its distance from `ref`) and
  withholds nothing, and only a witness that is nearer to `lv` than to `ref` fails the pair ("arbiter-suspect").
  No limit moved. The 14 pairs were not run again under version 5: they are outside the suites. In R3 it is the same on a smaller
  scale (Stage 2.5, LensVisualizer `c05a2ab7`, the same closure): in the suites optiland is within 3.5e-9 waves of
  `ref`, a thirtieth of the 1e-7 the rule asks, and the two floors of the Hologon in R3 are floors against both;
  on four of those lenses it is up to 9.7e-7 waves from `ref`, and 9 of 11 floors of R3 are `FAIL` beside it
  ([optiland's path](#optilands-optical-path-is-a-plain-sum-and-as-exact-as-its-hits)).
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

### The geometric OTF is a sum about the chief ray of the first line, and its magnitude is cut off at 1

- **Where.** `geometricOtf`, `combineOtfs` and `otfMagnitude` in `src/optics/analysis/mtfMath.ts`, as `fieldAtGrid`
  in `src/optics/analysis/mtf.ts` calls them (read at `c05a2ab7`).
- **Effect.** Four conventions and three habits, none of them exported as a rule. The conventions: the phase of a
  ray is `-2 pi nu u`; the cut along image x is the sagittal one and the cut along y the tangential one; `u` is
  measured from one point for every line of the spectrum, the landing of the chief ray at the first line, which
  LensVisualizer traces with no aperture checked, so that a clipped chief ray still gives a reference; and the
  lines add up as complex numbers, each weighted by its weight times the flux its rays carry, before the magnitude
  is taken. The habits: the magnitude is `min(1, ...)`; a list of three or more evenly spaced frequencies is
  answered by turning one phasor from frequency to frequency, so a value depends by a rounding on which list it
  was asked in; and a bundle without flux is an empty list, not a reason.
- **Handled.** The comparator's estimator (`src/estimators/geometricOtf.ts`) states the conventions and takes over
  no line: the sign, the axes and the weighting are tested on closed forms, and a source canary holds
  LensVisualizer's lines. The habits it does not share: every frequency is evaluated on its own, the modulus is as
  the sum gives it, and what cannot be computed is an outcome with a reason. The reference point is an argument.
  A chief ray of a ray set is traced as every other ray is, with the apertures checked: one that an aperture stops
  has no landing in `rays.trace`, and the estimator then says `no-reference`. The replay of LensVisualizer's own
  MTF (`src/engines/lv/replay.ts`) obtains its reference as LensVisualizer does: it is the `chief` of the bundle
  `traceMtfBundle` returns for the first line, which is that unclipped landing, and it is handed to every later
  line as LensVisualizer hands it.
- **Class.** convention.

### The MTF of a field is decided grid by grid, and the footprint of one grid is the next grid's

- **Where.** `traceField`, `fieldAtGrid` and `refineMtfField` in `src/optics/analysis/mtf.ts`, the constants of
  `mtfConstants.ts` and `expandMtfFootprint` in `mtfFootprint.ts` (read at `33ebdb30`). Only `refineMtfField`,
  `expandMtfFootprint`, `traceMtfBundle` and the constants are exported; the loop that ties them together is not.
- **Effect.** Which rays an MTF value is of is the outcome of a walk, not of a setting. A field starts at 16 cells
  across its beam and doubles (32, 64, 128, up to the request's cap) until two successive grids agree within 0.01
  at every frequency up to 50 cycles/mm, so the grid a field ends at depends on its curves, and two fields of one
  request end at different grids. A grid with fewer than 16 rays at a line is no pupil and sends the walk on. A
  grid whose rays reach the guard band of the footprint is traced again over a wider footprint, at most twice for
  a field over all its grids, and the widened footprint is the one every finer grid is laid over. The counts a
  result states (`validRays`, `blockedRays`, `failedRays`) are sums over the lines of the last grid. Change one
  ray's landing by enough to move a curve across 0.01 and the field ends at another grid, with four times the
  rays.
- **Handled.** The replay calls what is exported and restates the loop, the bookkeeping of a grid and the ladder
  line by line, each with a source canary. The walk itself is LensVisualizer's own `refineMtfField`, run on the
  replay's curves, so the test of convergence is not restated. Rung R4f holds the outcome to `computeMtf`: the
  grid of every field and its three counts must be the same numbers (`sampling.mismatches` 0), and a field's
  status the same (`fields.mismatches` 0). On the 480 fields of the benchmark they are. A decision that sat within
  a rounding of 0.01 could come out the other way in the replay, whose curves differ from LensVisualizer's by
  1e-14; that would be a mismatch of the sampling, reported as one and no difference of the MTF.
- **Class.** method.

### Two sums of the same terms differ in the fourteenth place

- **Where.** `geometricOtf` in `src/optics/analysis/mtfMath.ts`: plain sums in the order of the rays, and for a
  list of three or more evenly spaced frequencies one phasor a ray, turned from frequency to frequency by a
  rotation whose cosine and sine are rounded once.
- **Effect.** LensVisualizer's default list is 51 frequencies, 0 to 100 cycles/mm in steps of 2, so every value
  of its geometric MTF comes from the rotated phasor: the fiftieth value of a ray has been turned fifty times.
  Against the comparator's estimator, which reduces each phase on its own and compensates every sum, the largest
  difference over the 96 runs of the benchmark (480 fields, up to 63 000 rays a field and line set, both cuts) is
  1.25e-14, on `nikkor-z50f12` at its best focus on the reference line; on the photopic lines it is below 6.2e-15
  everywhere. Asked for 10 and 30 cycles/mm alone, LensVisualizer takes its other branch, a cosine and a sine a
  term: on two lenses of the benchmark the difference is then 5.0e-15 at most. (The fields end at other grids
  there: convergence is judged at the frequencies that were asked.)
- **Handled.** Nothing to handle: it is the size of the agreement rung R4f measures. The gate of the rung, 1e-9,
  provisional in the plan, was kept on this measurement, 80 000 times above it; no floor was needed. A value of
  LensVisualizer's that the rounding of a modulus leaves above 1 is cut off at 1 by LensVisualizer, and the engine
  `replay` writes the estimator's the same way, since the contract gives an MTF the range 0 to 1; at frequency 0
  both are exactly 1.
- **Class.** numerical.

### LensVisualizer's best focus is of a stop, of lines and of a grid cap

- **Where.** `resolveMtfFocus` in `src/optics/analysis/mtf.ts` and `findAxialBestFocus` in `mtfFocus.ts`: one
  search on the axial bundle, traced at every line of the request's spectrum over a grid of
  `min(MTF_FOCUS_GRID, the last size of the ladder)` cells, 64 unless the cap is 32. It runs for every request and
  is applied to every field when the focus mode is `best-axial`.
- **Effect.** "The best-focus plane of a lens" is not one plane. On the benchmark the reference line and the
  photopic lines of a lens have different best planes (`nikkor-z50f12`: -0.0471 and -0.0515 mm wide open), and so
  have wide open and f/8 (-0.0010 and -0.0154 mm for the same two sets of lines): four planes a lens. A request
  capped at 32 searches a coarser bundle and finds a fifth. The method of the request does not enter: the search
  is geometric whatever is asked.
- **Handled.** The plane is never computed by the comparator. A run with the image plane `lv-best-axial` is
  exported at `state.imgZ` plus the shift LensVisualizer states in the first step of `computeMtfSteps` for the
  stop, the lines and the grid cap of the run (`lvBestAxialFocus`), and is then a case like any other, which every
  engine is asked about. `lv` answers `mtf.native` about such a case only when its own search, asked again for the
  request at hand, gives that very plane, to the bit, and asks LensVisualizer for `best-axial`; any other moved
  plane is `image-plane.shifted`. The shift is added as LensVisualizer adds it (a canary holds the line), and the
  recipe of a run states it beside `conditions.imageZ - designImageZ`, which is the same shift to a rounding and
  not always to the bit: a sum and a difference of doubles.
- **Class.** method.

### The tab's f/8 is not the hook's f/8, though the two are the same number on every benchmark lens

- **Where.** `MtfTab.tsx` scales the two radii of its wide-open request by `fNumber / 8` for its comparison; the
  aperture slider of `useLensComputation.ts` at f/8 gives `(wideOpenStopSD × currentFOPEN) / 8`.
- **Effect.** `((w × fopen) / fNumber) × (fNumber / 8)` and `(w × fopen) / 8` are the same real number and two
  different sequences of roundings. On all 12 benchmark configurations they are the same double (measured at
  `33ebdb30`); on a synthetic lens of iris 12.7 mm, widest f/1.9 and slider f/2.87 they are one unit in the last
  place apart. The same holds for the seed of the footprint scan. A case is its numbers to the bit, and the
  profile `lv-tab-default` is about the tab's stop and no other.
- **Handled.** A run asks for the tab's comparison by name, `{ "kind": "lv-f8-comparison" }`, and gets the tab's
  expression, restated with a canary (`lvTabComparison`); `{ "kind": "f-number", "value": 8 }` stays the hook's.
  The seed for the comparison's stop is the comparison's own (`lvPupilSeed`). A lens the tab offers no comparison
  for is a run without a case (`f8-comparison-unavailable`), with the tab's reason. Every lens of the benchmark is
  offered one: the slowest wide open is f/4, and every one stops down to f/16 or beyond.
- **Class.** numerical.

### LensVisualizer's MTF has three spectra, two planes and one kind of field

- **Where.** `MtfOptions` (`src/types/mtf.ts`) names a spectrum (`reference`, `cdf`, `photopic`), a focus mode
  (`design`, `best-axial`, `auto`) and fractions of the reference image height. It has no wavelength list, no
  image-plane position and no field angle.
- **Effect.** A case on other lines, a case whose image plane was moved to anywhere but LensVisualizer's own best
  axial focus, and a request for fields by angle have no answer from LensVisualizer's product MTF. Nor has a reference wavelength that was asked for by number: such a
  case carries anchored indices, and LensVisualizer traces its reference spectrum with the authored ones. Its gate
  also limits one request: at `ed78cf40` to 101 fields and 501 frequencies, none above 1000 cycles/mm, and calls
  anything beyond `invalid-input`, the same reason it gives a request that is malformed.
- **Handled.** `lv` answers each `unsupported`, with an item that says which (`lines.custom-spectrum`,
  `image-plane.shifted`, `fields.angles-deg`, `fields.limits`, `frequenciesPerMm.limits`); nothing is substituted.
  The limits are asked of the gate, not restated: a request it has passed is asked again with the spec's fields
  and then with its frequencies, so a refusal is of that member and no failure of the engine. Its `engine-best`
  is LensVisualizer's `best-axial`: a geometric search on the axial bundle, whatever the method, whose shift the
  answer states. A comparison that wants another engine on LensVisualizer's plane asks that engine about a case at
  that plane: a run with the image plane `lv-best-axial` (above, "LensVisualizer's best focus is of a stop, of
  lines and of a grid cap"), which `lv` answers too, since it recognises its own plane.
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
  `samyang-af-35mm-f2p8-fe` (at LV `5278694b`; before that commit it was `sony-fe-14mm-f18-gm`, which has one
  reference since and exports), which lacks that data, and every lens with an annular aperture is a mirror lens
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
- **A third engine** says the same. optiland's own paraxial tracer places that exit pupil 1.04e-9 mm from where
  `ref` does at the d line and sizes it 4.6e-10 mm apart, as `lv` does (1.09e-9 mm and 4.8e-10 mm): on the scale of
  the pupil's distance 1.4e-10 and 6.0e-11, the largest of the 1173 reference-line cases of the catalog, and a pass
  (measured at `5278694b`, in `test/integration/optiland/r1.test.ts`). In exact rational arithmetic on the vertices,
  radii and indices of that case, optiland puts the pupil 3.8e-10 mm short of where it is, `lv` 4.3e-10 mm short
  and `ref` 6.6e-10 mm beyond, and its radius 1.7e-10 mm, 1.9e-10 mm and 2.9e-10 mm off in the same directions:
  1e-13 of the distance each, three roundings of one quotient. The largest difference of the catalog in a value
  that is no pupil's is of the same kind: the front focal point of `sony-fe-400-800-f63-8-g-oss` at its tele end
  lies 6.5 m in front of the lens, where optiland is 1.2e-11 mm from the exact point, `lv` 5.0e-11 mm and `ref`
  6.0e-11 mm.
- **Class.** numerical.

### The fraction of its distance a pupil is placed to grows with the distance

- **Where.** The angle a pupil's position divides by is what is left of a sum of terms of the size of the lens's
  power. Its rounding is of the size of one unit in the last place of those terms however little is left, so the
  position is known to about 1e-16 times its distance over the focal length, as a fraction of the distance: in
  millimetres the error grows as the square of the distance.
- **Effect.** A gate of 1e-12 of the distance holds while the pupil is within some thousands of focal lengths of a
  simple lens, and beyond that a verdict is a matter of how two roundings fall. Measured on a singlet of 52.87 mm
  (radii 61.3 and -47.9 mm, 5.1 mm of index 1.5168) with a plane stop a little behind its rear focal plane, which
  puts the entrance pupil far in front, and the image plane 100 mm behind the stop: `ref` against optiland
  (`4e893f53`) through `lvrtc run` and `lvrtc compare`, in a sweep outside the tests, and each engine against
  exact rational arithmetic on the numbers of the case:

  | Stop behind the focal plane | Entrance pupil | optiland from the exact position | `ref` from it | `pupilZ.maxScaled` | R1 |
  |---|---|---|---|---|---|
  | 0.1 mm | 28 m away | 2.3e-9 mm | 1.0e-9 mm | 4.3e-11 | `PASS` |
  | 0.01 mm | 280 m | 1.6e-7 mm | 7.6e-8 mm | 2.9e-10 | `PASS` |
  | 0.005 mm | 560 m | 1.7e-6 mm | 2.1e-7 mm | 2.6e-9 | `FAIL` |
  | 0.003 mm | 930 m | 1.2e-6 mm | 3.3e-7 mm | 9.8e-10 | `PASS` |
  | 0.002 mm | 1.4 km | 6.1e-6 mm | 2.1e-6 mm | 5.9e-9 | `FAIL` |
  | 0.001 mm | 2.8 km | 2.0e-5 mm | 8.0e-7 mm | 7.3e-9 | `FAIL` |

  The mirror image of the system, with the stop in front of the front focal plane and the exit pupil far behind,
  gives the same picture (4.4e-11, 4.4e-10, then 1.2e-9, 2.9e-9, 3.7e-10 and 5.1e-9; there `ref` is the farther
  from the exact pupil in two rows of six). Neither engine is wrong in any row: each is off by a rounding of the
  size of one unit in the last place of the terms the angle is left of, at most 7e-12 of the distance. Which way
  optiland's falls depends on more than the lens: it traces backwards in coordinates counted from the image
  surface, and with the image plane 25 mm behind the stop it has the pupil of the last row 1.1e-5 mm on the other
  side of the exact one. The radius of the pupil, on the same scale, stays inside the gate in every row (at most
  1.4e-10).
- **Handled.** Nothing, and no gate is widened for it: the nearest lens of the catalog has its pupil 7.7 m to 20 m
  away, 270 of its focal lengths at most, where the three engines are within 1.4e-10 on that scale ("A pupil that
  is metres away", above). A lens with a pupil some hundreds of metres away would have to be classified here
  before its R1 verdict means anything.
- **Class.** numerical.

### A pupil exactly at infinity is an infinity only where a sum cancels to the bit

- **Where.** The position of a pupil divides by the angle of a ray from the stop, and in a telecentric system
  that angle is the difference of two equal numbers. An engine has an infinity there only when its own arithmetic
  comes out at exactly 0, and the sign of the infinity is the sign of that zero and of the height above it.
- **Effect.** The same infinity in two answers is no difference, in position and in radius; an infinity against
  1e17 mm, or against the other infinity, is an infinite one and fails R1. On a plano-convex lens of 100 mm with
  its stop in its front focal plane (numbers that are doubles: `1 - 0.01 x 100`) `ref` and optiland both put the
  exit pupil at minus infinity with an infinite radius, and the pair passes. With numbers that are not doubles
  either engine may be left with a rounding where the other has a zero.
- **Handled.** Nothing: no gate is written for it. No lens of the catalog is telecentric to the bit; the nearest
  has its exit pupil 7.7 m to 20 m away (above), where every engine has a number.
- **Class.** numerical.

### A direction is a unit vector to a rounding, and a stretch is charged by its length

- **Where.** Every tracer holds a direction in three doubles, and the stretch from `p` to `p + t d` is `t |d|`
  long: the parameter `t` is a length only where `|d|` is 1. LensVisualizer and `ref` make unit vectors, to a
  rounding (a vector normalised in doubles is within 2.2e-16 of one); optiland makes none
  ([below](#optilands-optical-path-is-a-sum-of-steps-and-a-step-is-a-length-only-along-a-unit-vector)); a given
  ray may be 1e-12 from one by the contract.
- **Effect.** Until Stage 3.1 the comparator's own projection took the parameter to the image plane for the length
  of the last stretch, so `opticalPathToImage` of `lv` and of `ref` was charged index times parameter: off by the
  stretch times `|d| - 1`. For a unit vector to a rounding that is a unit or two in the last place of the stretch;
  for a direction twice as long it would have been half the stretch. No verdict rested on it.
- **Handled.** `projectToImagePlane` (`src/estimators/imageProjection.ts`) charges the length: the parameter times
  the length of the direction, that length carried in two doubles (`lengthOf`) and the product rounded once, to
  half a unit in its last place. The landing point is the same arithmetic as before, in every bit. A direction
  whose squares add up to exactly 1, or to within 5.5e-17 of it, gives the distance it gave before in every bit.
  Of directions normalised in doubles (200 000 of them, synthetic) 31 % give a distance one or two units in the
  last place away from the parameter, and 6 % of the paths to the image move by one unit of theirs. Of the 22 918
  rays of the benchmark that `lv` lands at the reference line, 721 have another path to the image than index
  times parameter, each held bit for bit to the length worked out in whole numbers
  (`test/integration/lv/rays.test.ts`). Which rays land is decided by the parameter, as before and as
  LensVisualizer's `mtfImagePoint` decides it. On the two suites (LensVisualizer `c05a2ab7`, closure `78215d72`;
  504 records) no figure of R0, R1 or R2 moved; in R3 six figures of the benchmark moved by at most 6.0e-11 waves
  and six of the features suite by at most 5.6e-11 waves, 3e-6 of the gate, and every record is `REFRESHABLE`.
- **Class.** numerical.

### A landing that passes R2 may be sixty times the gate of R4 in the phase of an MTF

- **Where.** The geometric MTF is the modulus of a sum of one term a ray, `w exp(-2 pi i nu (u - u_ref))`. A
  landing that is δ off turns its term by 2πνδ. R2 holds a landing to 1e-8 mm; at 100 cycles/mm that is a phase of
  6.3e-6, and R4 holds the MTF to 1e-7. So R2's gate does not imply R4's, on any engine: R4 is the tighter of the
  two by a factor of sixty at the highest frequency of LensVisualizer's MTF, and of thirty at 50 cycles/mm.
- **Effect.** On the benchmark (96 runs, 288 fields, 51 frequencies; LensVisualizer `33ebdb30`, closure
  `78215d72`) the largest difference of `lv` from `ref` is 5.39e-8, `sigma-45mm-f28-dg-dn-contemporary` at f/8 and
  best focus, full field, tangential, 98 cycles/mm, where R2 has LensVisualizer's landings within 7.6e-10 mm of
  `ref`'s: a bound of 4.7e-7 for that field, and a ninth of it measured, because the rays of a bundle are not off
  alike and what is common to them is a phase the modulus does not see. The largest landing of the benchmark is
  9.1e-9 mm (`sigma-35mm-f14-dg-hsm-a`, photopic), which would allow 5.7e-6. The two exact tracers, `ref` and
  optiland, are within 1.2e-11 of each other on every field: the 5e-8 is LensVisualizer's 1e-9 mm at a surface
  ([above](#a-hit-lies-within-1e-9-mm-of-its-surface-not-on-it)). At 10, 30 and 50 cycles/mm the largest of `lv`
  is 8.0e-9, 1.8e-8 and 4.0e-8.
- **Handled.** Nothing is widened. Every pair of both suites is `PASS`, LensVisualizer at 54 % of the gate at
  worst (48 % on the feature suite, on the Hologon), and R4 has no floor: a lens on which LensVisualizer's landings
  move the MTF by more than 1e-7 is `FAIL`, to be attributed with R2's figures for the same rays (they are the same
  ray sets) before anything else is concluded. Whether R4 is to have a floor of `lv` against `ref`, as R2 and R3
  have, is the owner's decision and was not taken in Stage 3.3.
- **Class.** numerical.

## optiland

Measured at optiland `4e893f53` (numba 0.65.1, numpy 2.3.5, Python 3.14.8). The figures of rung R0 were taken
with LensVisualizer at `b7deb221` (engine closure `46b028bc`, 151 files), over the suites and over every case of
the catalog: 2267 cases of 1173 systems, the primes once and the zooms at both ends, each on its reference line
and on the photopic lines, 53 378 surfaces in all. LensVisualizer moved to `1bf669ee` (closure `66027121`) while
the stage was written; the suites were run again there, with every figure the same. The figures of rung R1 were
taken with LensVisualizer at `5278694b` (engine closure `78215d72`, 151 files), over the suites, the 22 focus
stations LensVisualizer certifies there, and the 1173 cases of the catalog on the reference line. Those of rung R2,
the traced rays, were taken with LensVisualizer at `14da71d9` (the same closure): over the two suites, 378 ray
sets and 421 334 rays, and over nineteen lenses of the catalog that are in no suite and that other entries of this
file name, each on its reference line and on the photopic lines, a zoom at both ends, 460 ray sets and 561 506
rays; and at the 24 focus stations LensVisualizer certifies at `f3b4a337` (the same closure, six lens models more),
on the reference line, 72 ray sets and 100 004 rays that diverge from object points 40 mm to 2.3 m in front of the
lens, where all three engines stop the same rays and optiland is within 4.5e-12 mm, 6.8e-14 and 4.6e-12 mm of
`ref`. Those of rung R3, the optical path, were taken with LensVisualizer at `c05a2ab7` (the same closure; the
commit corrected rims and labels of six lens files, none of a suite): over the two suites, over the stations
again, and over the four lenses of the catalog on which optiland is no witness in R2, each on its reference line
and on the photopic lines, the zoom among them at both ends, 90 ray sets. Two entries below were found on
synthetic systems instead: 280 made at random, 2240 probe lattices traced by `ref` and optiland, in no test. Where
an entry says whose error a difference is, the ray was traced in 60-digit decimal arithmetic by a tracer that
shares no code with any engine.

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
  there in any case: `ref` compares a radius with the limit, optiland a square with a square. In the suites no ray
  comes that close: of the 421 334 rays of rung R2 not one is in a rim band, between any two of the three engines.
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
- **Handled.** The builder builds terms of power 1 and 2, as `odd_asphere` and as the first entry of
  `even_asphere`, reads them back, and `system.describe` echoes them; their sag is the contract's to rounding, held
  by the probe and by a test in 60-digit arithmetic. What optiland cannot answer for such a case is its own
  first-order data: the engine answers `paraxial.first-order` as `unsupported`, with the item
  `surface.asphere.quadratic-term` for a term of power 2 that is not 0 and `surface.asphere.linear-term` for one
  of power 1, as every engine does for the second (`first_order.term_refusals`). It is decided from the case,
  before anything is built, and is the engine's own answer: no flag of a descriptor says it, so the engine is
  asked. `ref` answers such a case by the contract's rule, so the pair is `UNSUPPORTED`, which fails nothing. A
  term whose coefficient is 0 is no term, here as in the contract. `lv`, whose kernel reads the radius alone too,
  answers the same way ("The paraxial kernel is handed radii", above); no lens of LensVisualizer has either term,
  its lowest coefficient being A3.
- **Class.** method.

### optiland measures the front of a lens from its first surface and the rear from the image surface

- **Where.** `optiland/paraxial.py`: `F1()`, `P1()` and `EPL()` are distances from the surface of index 1, the
  first of the lens; `F2()`, `P2()` and `XPL()` are distances from the image surface. The row "Back Focal Length"
  of optiland's own prescription report is `F2()`: how far the focal point lies from the image plane, not from the
  lens. `f1()` is the front focal length, negative for a positive lens.
- **Effect.** The contract states every position as a z from the first vertex, and the back focus from the last
  vertex of the lens. A value taken as it comes would be right for the three object-side positions of a lens whose
  first vertex is at 0, and wrong by the image plane's z for the three image-side ones.
- **Handled.** The worker adds the first vertex to the first three and the image plane to the last three, both
  read from the optic (`surfaces.positions`, which `verify_optic` holds to the case), and takes the back focus as
  its rear focal point minus the vertex of the case's `lastLensSurfaceIndex`, the one number of the case an optic
  cannot hold: optiland knows no rear plate. Each reference is checked on lenses whose closed forms are written
  out in the test (`test_first_order.py`): with the image plane at its design position, behind it, inside the
  lens, in front of the lens and a metre away, the rear focal point is the same to rounding.
- **Class.** convention.

### optiland takes the image space from the image surface, and refracts its paraxial rays there

- **Where.** `ParaxialRayTracer.trace_generic` refracts at every surface behind the object, the image surface
  among them, from the medium before it into the one it states; `surfaces.n(wavelength)[-1]`, the index after the
  image surface, is what optiland's wavefront code takes for the index of the image space. A surface added without
  a material is in air.
- **Effect.** A case whose last surface is followed by another medium than air, an immersed sensor, would end in
  an interface at the image plane that it does not have. The interface is flat and has no power, but the slope
  behind it is the one every image-side accessor divides by: one surface of radius 50 mm into an index of 1.5 has
  the focal length 150 mm by the contract (`rearFocalZ - rearPrincipalZ`, which is n'/P) and 100 mm by `f2()` of
  an optic whose image surface is in air, with the rear focal point 83.3 mm behind the image plane for 125 mm.
- **Handled.** The builder gives the image surface the medium after the last surface of the case, at the line,
  and `verify_optic` reads it back ("the index of the image space"); a test leaves it in air and finds both the
  message and the 100 mm. Every lens of LensVisualizer ends in air, where the two are the same optic.
- **Class.** convention.

### A pupil diameter of optiland has a sign

- **Where.** `FloatByStopAperture.compute_epd` divides the stop diameter by the height that a paraxial ray of
  height 1 has at the stop, and `Paraxial.XPD` is twice the height of the marginal ray in the plane of the exit
  pupil. Either height is negative where the stop is imaged upside down: a stop behind the focus of the lens in
  front of it, or one that the lens behind it images through its own focus. `FNO()`, `f2() / EPD()`, has the same
  sign.
- **Effect.** The contract's radius of a pupil is a size, never below 0. A stop 150 mm behind a lens of 50.7 mm
  has `EPD()` = -2.097 mm for a stop diameter of 4 mm.
- **Handled.** The worker halves the magnitude. optiland's f-number is recorded as optiland gives it, sign and
  all (`optilandFNumber`), and nothing judges it.
- **Class.** convention.

### The stop has two radii in optiland: the system's aperture and the stop surface's clip

- **Where.** With `set_aperture("float_by_stop_size", d)` the paraxial entrance pupil is `d` over the paraxial
  ray height at the stop (`optiland/aperture/float_by_stop.py`), and the marginal ray, the exit pupil and the
  f-number follow from it. optiland's ray aiming takes the stop's radius from the stop surface's own aperture,
  `aperture.r_max`: the clip limit, which for a case from LensVisualizer is the stop radius plus 1e-9 mm.
- **Effect.** The contract's pupils are images of `conditions.stopSemiDiameter`, never of a clip limit.
- **Handled.** The builder sets the system's aperture to twice `conditions.stopSemiDiameter` and the stop
  surface's aperture to the case's clip limit, each read back, and the worker asks `EPD()` and `XPD()`, which read
  the first. A test gives the stop surface a clip limit of 2.75 mm under a stop radius of 2 mm and finds the
  pupils of 2 mm. The rays optiland aims itself, which come with its own analyses in Phase 3, fill the second.
- **Class.** convention.

### An afocal system has an infinite focal length in optiland, or one of 1e17 mm

- **Where.** `Paraxial.f2` is the height of a parallel ray over the slope it leaves with. optiland has no test
  for a slope that is 0, or 0 to rounding (`f2_range` gives an infinity for a slope of exactly 0).
- **Effect.** A telescope of two surfaces whose powers 0.01 and 0.02 cancel to the bit has `f2()` = -inf, and
  every focal and principal point an infinity. The same construction with a gap that is no double is left with a
  power of -2.3e-18 per mm, and `f2()` is -2.9e17 mm: a number, with focal points to match.
- **Handled.** The worker calls a system afocal where `f2()` is no finite number, or where the power it stands
  for is at most 1e-12 of the sum of the magnitudes of the surfaces' powers, each read from the optic as optiland's
  own tracer reads it (`first_order.surface_power_scale`): the measure the reference engine uses, on optiland's
  numbers. It answers `unsupported` with the item `system.afocal`, naming the lines. Each engine still answers by
  a test of its own ("Afocal is an absolute test", above), and a pair of which one is unsupported fails nothing.
- **Class.** convention.

### With the entrance pupil at infinity optiland has no exit pupil diameter

- **Where.** `Paraxial.XPD` follows the marginal ray to the exit pupil, and `marginal_ray` launches it at the rim
  of the entrance pupil: at a height of `EPD() / 2` for an object at infinity, at an angle of `EPD() / (2 z)` for
  a finite one. With the stop in the rear focal plane of what stands in front of it, `EPL()` and `EPD()` are
  infinities, and the ray is `inf x 0`.
- **Effect.** `XPD()` is a NaN, for a system whose exit pupil is as finite as any: on a plano-convex lens with a
  plane stop in its rear focal plane the exit pupil is the stop itself. An exit pupil at infinity, the commoner
  telecentric lens, has no such trouble: `XPL()` and `XPD()` are the infinities their divisions give.
- **Short of infinity the same ray costs digits.** The exit pupil's radius comes out of a marginal ray that starts
  as high as the entrance pupil is wide, so optiland knows it to about 1e-16 of the entrance pupil's radius and not
  of its own. On the singlet of "The fraction of its distance a pupil is placed to grows with the distance"
  (above), whose stop of radius 1.3 mm is its exit pupil, optiland's exit pupil radius is 4.6e-14 mm off with the
  entrance pupil 0.69 m in radius, 2.9e-12 mm off at 69 m, 7.5e-10 mm off at 6.9 km and 3.0e-9 mm off at 69 km,
  where the reference engine, which sizes the exit pupil from the surfaces behind the stop alone, has 1.3 mm to
  the bit. That pupil lies centimetres from the image plane and is judged plainly, at 1e-9 mm: R1 would fail
  there for an entrance pupil some tens of kilometres wide, and the position of such a pupil has failed long
  before.
- **The two infinities are not always found together.** `EPL()` divides by an angle of a ray traced backwards from
  the stop and `EPD()` by a height of one traced forwards to it: the same quantity of the lens, rounded twice. On
  that singlet with the stop at the double nearest its rear focal point, `EPL()` is an infinity and `EPD()` is
  1.2e16 mm.
- **Handled.** A NaN is never a value. The worker answers `unsupported` with the item
  `system.telecentric.object-space` where optiland's `EPL()` or `EPD()` is an infinity, either of them, and the
  reference engine answers the case in full. Any other NaN, a focal length that is one among them, and an infinity
  that is no pupil's, is the engine's failure on that request, not an answer. No lens of the catalog has its
  entrance pupil at infinity.
- **Class.** method.

### optiland says of a ray only its intensity

- **Where.** `Surface._trace_real` in `optiland/surfaces/standard_surface.py` finds the distance to the surface,
  moves every ray there, adds index times distance to its path, clips (`BaseAperture.clip` sets the intensity of a
  ray outside the aperture to 0, and `RadialAperture.contains` is false for a NaN) and refracts. `SurfaceGroup.trace`
  does that on every surface in turn, the image surface included, for every ray, whatever became of it.
- **Effect.** A ray that an aperture stopped keeps its coordinates and is traced on to the image; one that missed a
  surface or was totally reflected is NaN from there, and is "stopped" by the next aperture test. Read by its
  numbers alone, a stopped ray lands like any other. optiland has no word for why a ray ended, and none for a
  failure of its own: an iteration that did not converge returns the point it has, and that point passes or fails
  the aperture test like a hit.
- **Handled.** A ray is ok when optiland's own measure says so: an intensity above 0 and a number for its point, its
  direction and its path on every surface, and for its point and its path on the image surface. It ended at the
  first surface where that is not so. Why it ended is said only on evidence
  ([contract](../contract/CONTRACT.md#the-engine-optiland)): a point
  on optiland's own sag of the surface with an intensity of 0 is an aperture; such a point with no direction, where
  optiland's radicand of Snell's law is negative, a total reflection; no point on a conic whose quadratic with the
  line has no root, a miss; anything else is `failed`, which is in no count of the mask in R2 and is listed beside
  it. Every value of a ray is NaN from its end surface on, whatever optiland recorded there. In the two suites
  optiland fails no ray: 242 442 of its 421 334 rays are ok and 178 892 blocked, each at the surface where `ref`
  and LensVisualizer end it.
- **Class.** convention.

### optiland takes the rays as they are, and lands them itself

- **Where.** `RealRays.__init__` keeps the arrays it is given and normalises nothing; `RealRays.refract` computes a
  direction from the one before and does not normalise it either. `ObjectSurface._trace_real` does nothing. The
  image surface is a surface like the others: a ray is carried to its plane by `t = -z / N`, its path grows by
  `t` times the index in front of it, and it is "refracted" into the same index.
- **Effect.** The rays of a request go in bit for bit, a `-0` included, and the first row optiland records is the
  rays as they were launched. The landing is the comparator's own projection, operation for operation: one
  division, and a multiplication and an addition a coordinate, so that two engines with one exit point and one
  direction land to the bit. A ray along the axis leaves a plane in the direction `u + 1 - u`, which is 1 less a
  rounding for most indices: optiland's directions are unit vectors to 1e-16, not to the bit. And optiland steps
  backwards to an image plane that lies behind the exit point, where the contract blocks the ray, or lands it at
  its exit point when the plane is within 1e-9 mm.
- **Handled.** The worker holds what optiland has at its object surface to the rays it was given, bit for bit, and
  refuses to answer about rays optiland changed. A spec whose directions are not unit vectors within 1e-12 is
  `bad-spec` before optiland sees it. The landing and the path to it are optiland's own image row, with the z of
  the point written as the plane's number; the contract's two rules of the image plane are the worker's
  (`trace.settle`), each with a test on a plate whose rear face is, or lies just behind, the image plane.
- **Class.** convention.

### optiland's optical path is a sum of steps, and a step is a length only along a unit vector

- **Where.** `Surface._trace_real` in `optiland/surfaces/standard_surface.py` adds `t * self.material_pre.n(rays.w)`
  to `rays.opd` on the way to each surface, with `t` the distance its geometry gives: `-z / N` for a plane, a root
  of `a t^2 + b t + c = 0` with `a = L^2 + M^2 + (1 + k) N^2` for a conic, and where the iteration ends for an
  asphere. That is the parameter of the line `p + t d`, for whatever length `d` has. `RealRays.__init__`
  normalises nothing, and `RealRays.refract` computes a direction from the one before without normalising it: of
  a direction `1 + e` long it makes one `1 + e (n / n')^2` long. `ObjectSurface._trace_real` does nothing, the
  image surface has the kernel of every surface, and `material_pre` is the medium after the surface before, found
  through a link between the two.
- **Effect.** Rule by rule the sum is the contract's. It starts at 0 at the ray's own origin; each stretch is
  charged to the medium the ray is in, which is air in front of the first surface and, on the way to the image
  plane, the medium after the last surface, whatever the image surface itself states; a step backwards is
  subtracted; a refraction adds nothing. But the contract's path is index times length, and `t` is a length only
  where `d` is a unit vector. A spec may state a direction within 1e-12 of one: with a direction 4.5e-13 longer,
  a ray from 16 m away has an `opd` 7.3e-9 mm short of its path, 1.2e-5 waves, where `ref`, which takes a step
  times the length of its direction, has the path. **And between unit vectors it shows too, in the last digits.**
  LensVisualizer's launch directions are within 1.6e-16 of unit vectors, by rational arithmetic on all 235 812
  rays of the benchmark. optiland's own are not: along the axis of a plate of index 1.5 it holds the direction
  `1 - 1.1e-16`, takes a step of 6.000000000000001 through 6 mm of glass, and has 14.000000000000002 for a path
  of 14; and what each refraction rounds stays in every direction after it, so that behind the 18 to 39 surfaces
  of a benchmark lens the directions of the rays that land are within 7.8e-15 of unit vectors (5.4e-15 in the
  feature suite, 7.5e-15 at the focus stations). On an axial ray of `nikon-z-mc-105f28` at 650 nm, whose every hit
  optiland has within 4.9e-14 mm of the 60-digit trace, its `opd` is 5.9e-10 waves from the path on the last
  surface and 7.4e-10 on the image plane, and 9.8e-10 relative to the chief ray's.
- **Handled.** In the adapter, as a matter of definition and not of precision: each stretch optiland added is
  taken times the length of the direction optiland held along it, added as `stretch x (|d| - 1)` with that excess
  exact before it is rounded once (`path_lengths`, `length_excess` in `workers/python/lvrtc_optiland/trace.py`),
  and the method's `params` say so (`opticalPath`). Otherwise the number is optiland's, the rounding of its sum
  included. On that ray the answer is 6.3e-11, 4.3e-11 and 6.5e-11 waves from the truth. Over the benchmark it
  moves a path by up to twenty units of its last place, 1.9e-9 waves (13 units and 5.6e-10 waves in the feature
  suite, 19 and 1.2e-9 at the stations), and leaves one path in seven as optiland's own bits; where optiland's hits
  are what is off, as on the rays that set the largest figures of R3, it changes nothing that shows (2.7e-9
  waves before and after). `verify_optic` reads the index optiland has in front of every surface, the image
  surface among them, and holds it to the case: a path is charged to a link, and to no value of a surface's own.
  Tests: the longer direction from 16 m, the plate along its axis, sixty spheres behind which optiland's sum is
  4 units of its last place from the 60-digit path and the sum of lengths 1.5, a link bent on purpose (6 mm of
  glass counted as 6 mm of air), and an image surface in another medium than the image space, which changes no
  path and is refused all the same (`test_path.py`, `test_build.py`). That the excess is exact shows on one
  stretch: over 500 directions from a point 20 m in front of a plane the answer is the length to a unit of its
  last place, half of it the rounding of optiland's division, where optiland's own sum, and the same sum times a
  length formed in doubles, are each up to one and a half units off. And the two engines are set against each
  other on it: the same 145 rays from 2 m, stated once with unit directions and once with directions 2^-41
  longer, have the same paths in optiland within 2.8e-8 waves and in `ref` within 1.5e-9, where a sum of steps
  would be 1.5e-6 short (`r3.test.ts`).
- **Class.** convention.

### optiland refracts a direction as a unit vector, and bends one that is longer as if it leaned more

- **Where.** `RealRays.refract` in `optiland/rays/real_rays.py`: `dot = L0 nx + M0 ny + N0 nz`,
  `root = sqrt(1 - u^2 (1 - dot^2))` with `u = n1 / n2`, and the refracted vector `u d0 + n (root - u dot)`. That
  is Snell's law for a unit vector `d0`. Nothing makes the direction one, neither where a ray is handed over nor
  after a refraction (the entry above).
- **Effect.** For a direction `1 + e` long the sine of incidence that the formula uses is `1 + e` times the
  ray's, so the ray is bent as if it met the surface that much more steeply, and what follows is another ray. At
  a plane across the axis a direction `(0, dy, dz)` becomes `(0, dy / n, sqrt(1 - (1 - dz^2) / n^2))` in the
  glass, where the ray of the contract has the sine `dy / (n |d|)`. Measured on a plate 100 mm thick that a ray
  meets 30° off its axis, against that closed form and against the trace in 60 digits: with a direction
  4.5e-13 longer than a unit vector the hit on the rear face is 1.0e-11 mm from the contract's and the path to it
  5.0e-12 mm, 8.6e-9 waves; at the 1e-12 that a spec may be off a unit vector by, 2.2e-11 mm and 1.9e-8 waves. It
  grows with the glass and with the lean: with the same direction through two lenses 13 mm long, 4e-13 mm in a
  hit, 1.4e-13 in the exit direction, 4e-10 waves to the last surface and 3e-9 to the image plane; through thirty
  spheres over 200 mm, 5e-12 mm, 1e-13 and 2e-10 waves. All of it is inside the gates of R2 and R3 by a factor
  of some hundreds, and at the contract's 1e-12 inside what the floor rule asks of a witness (1e-10 mm, 1e-12,
  1e-7 waves) by five on that plate, which a longer or steeper system would use up. `ref` divides a direction by
  its length before it bends it, and has the contract's ray. With the directions optiland computes itself, 8e-15
  from unit vectors behind the surfaces of a benchmark lens, the effect is a rounding.
- **Handled.** Nothing, and by intent: the worker hands a ray to optiland bit for bit, moves no point of the
  answer and bends no ray, so this is in the answer for R2 and R3 to measure. The lengths the worker makes of
  optiland's steps (the entry above) are the lengths of the ray optiland traced: of the 5.1e-8 waves that
  optiland's own sum is off on that plate, 8.6e-9 are left. No ray set has such a direction today:
  LensVisualizer's launch directions are within 1.6e-16 of unit vectors, and the probe lattice of a case file
  states `(0, -sin, cos)` of the field angle or divides each direction by its length. A source of rays that
  states directions to 1e-12 and no closer would make optiland a poorer witness by this much; the tolerance of
  the contract is the owner's to keep or to tighten. A test holds optiland's hit to the closed form above and
  the answer's path to index times length along that ray (`test_path.py`).
- **Class.** numerical.

### A conic is met in front of the ray, inside the aperture, or else on its far side

- **Where.** `_conic_candidates` and `_select_distance` in `optiland/backend/_conic.py`. Of the two roots of a line
  with a conic, one is admissible when it lies in front of the ray (`t > 0`) and on the sheet the sag describes;
  among admissible roots one inside the surface's aperture is preferred, then the nearer. Where no root is
  admissible optiland falls back to the root nearer the vertex, whatever sheet it is on and wherever on the line.
- **Effect.** The fallback is what makes optiland step backwards where two neighbouring surfaces cross: the hit
  behind the ray is the root nearer the vertex, a plane is met at `-z / N` whatever its sign, and an asphere's
  iteration starts there. On the eight lenses of the catalog where LensVisualizer loses rays at such a crossing,
  optiland passes them where `ref` does. It is a fallback, though, and no rule: optiland steps backwards only
  where no root is admissible. A ray behind the surface is inside its ball, and its line leaves the ball in front
  of it: through the far half for a ray near the axis of a sphere, which is no admissible root, but through the
  half the sag describes for a steep ray, and for most rays on a conic that reaches far (a conic constant toward
  −1 and below). optiland takes that crossing, far beyond the rim, and its aperture stops the ray there, where the
  contract passes it at the crossing behind it, inside the clear aperture. Measured on 160 synthetic systems made
  with gaps thinner than a sag (1280 probe lattices, 737 280 rays, in no test): on four of them optiland meets
  776 rays in front where `ref` steps back, 770 beyond the rim and 6 inside it, where they are totally
  reflected; 510 of them are rays `ref` lands, and the 60-digit trace is with `ref` on every one it settles, all
  but four at most. The fallback is also what carries a ray through the far side of a sphere: on a
  hemisphere whose clear aperture reaches its equator, a steep line that cuts the sphere only beyond the equator
  has no admissible root, the fallback root lies inside the aperture, and optiland refracts the ray there and
  carries it on. `russar-22-70f8` has two such surfaces (1 and 9): at its full field optiland passes 942 rays there
  that `ref` and LensVisualizer stop, and lands 874 rays more than either, 8 % of them all.
- **Handled.** Nothing is hidden: a ray optiland keeps alive is answered with the point optiland has, so those
  rays are mismatches of the mask and the pairs of optiland fail R2 on that lens (6 of its 18 ray sets, all at the
  full field), as they should. A test builds the hemisphere and finds the ray landed a quarter of a metre from
  the axis. A ray optiland stops at the crossing in front of it is `blocked`, at a point of the surface that an
  aperture stopped, and a mismatch of the mask where `ref` passes it; a test puts a steep ray behind a sphere set
  into the curve before it and finds it stopped 40 mm from the axis. optiland's own MTF of such a lens counts, or
  loses, those rays. No lens of a suite has such a surface, and at the 24 focus stations LensVisualizer certifies
  the three engines stop the same rays.
- **Class.** method.

### On an asphere optiland's iteration starts at the base conic, and goes where that leads

- **Where.** `NewtonRaphsonGeometry._solve_distance_primal` in `optiland/geometries/newton_raphson.py` starts
  Newton's method at the distance to the base conic and iterates on `sag(x, y) - z` until every ray of the batch is
  within the tolerance, or 100 times. Nothing restricts it to the clear aperture, and what it ends with is the
  answer.
- **Effect.** Three things, each measured on lenses of the catalog that are in no suite.
  **No start.** Where the line misses the base conic there is no start and no hit, whether or not the line meets
  the surface. A phone lens has surfaces whose polynomial undoes most of a steep base: surface 11 of
  `apple-iphone-12-main-wide` is a paraboloid that would be 1.1 mm deep at its rim and is 0.09 mm deep. optiland
  loses 3656 rays there over the 18 ray sets of that lens, and 2690 on surface 9 of
  `apple-iphone-7-wide-camera-lens`: 3576 and 2426 of them rays that `ref` and LensVisualizer land, 29 % and 20 %
  of the light of those sets.
  **Another crossing.** The polynomial of a surface, fitted to its clear aperture, turns back beyond the rim and
  may cross the line again there. From a flat base the iteration can reach that crossing first: on surface 2 of
  `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr` at its wide end, at the full field, optiland meets 162 rays 24.9 mm
  from the axis, 3 mm beyond the rim, and stops them, where the line meets the surface 20.8 mm from the axis and
  the contract passes it. `ref` and LensVisualizer stop the same rays one surface later, so no light is at stake
  there, and the mask differs.
  **No convergence.** Where it settles on nothing, the point it ends with is somewhere near: 0.6 mm and 1.6 mm from
  the surface on two rays of `fujifilm-fujinon-xf-27mm-f28` (surface 7, whose 18 terms cancel heavily). Outside
  the aperture such a point stops the ray; inside it the ray is refracted there and carried on, and 26 rays of
  that lens, 24 of `fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii`, 5 of `fujinon-xf-23mm-f14-r` and 5 of
  `apple-iphone-12-main-wide` pass a surface so that `ref` and LensVisualizer stop them at, 16 of the first to the
  image.
- **Handled.** By the rule of the entry above: no hit on an asphere is `failed`, as is a ray optiland stopped at a
  point that is not on the surface (7728 rays of those lenses in all), never `blocked`, which would claim a
  reason; a ray optiland carries on is answered as optiland has it. So the pairs of optiland fail R2 on the mask
  wherever it passed or stopped a ray on its own (27 ray sets of those lenses), and where it only lost rays they
  pass on the rays that are left: on the two phone lenses a fifth and a seventh of all rays are in no count. Read
  the count of failed rays beside a verdict. A test builds a paraboloid made shallow by a term and finds the ray
  lost that the contract passes. With a NaN in a batch the iteration also runs all its 100 steps for every ray of
  it, which is why a set takes 10 ms on most lenses and 200 ms on these.
- **Class.** method.

### On an asphere optiland is as exact as a plain sum of its terms

- **Where.** `EvenAsphere.sag` and `_surface_normal`, and the same of `OddAsphere`, add the terms of the polynomial
  one by one in double precision, and the normal's conic part is `x / (R sqrt(1 - (1 + k) r^2 / R^2))`, which loses
  its digits where a conic ends.
- **Effect.** The residual optiland iterates on and the normal it refracts with carry the rounding of those sums:
  on a surface whose terms reach 6e4 and sum to 0.09 that is some 1e-11 of slope. Traced in 60 digits, the two
  worst rays of the benchmark have optiland within 1.2e-12 mm of the truth in every hit and 2.0e-14 in direction,
  where `ref` is within 1.9e-14 mm and 1.2e-15. On lenses that magnify arithmetic it does not stay there: at the
  wide end of `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr`, at its full field, optiland is 7e-13 mm off after the first
  aspheres, 9e-12 mm off 22 surfaces on, and 8.6e-10 mm off at the end, 3.2e-11 in direction and 9.0e-10 mm in
  landing, on a ray where `ref` ends 5.8e-12 mm, 2.2e-13 and 6.1e-12 mm from the truth and LensVisualizer 2.1e-8
  mm. On `fujifilm-fujinon-xf-27mm-f28` it is 7.5e-10 mm and 1.0e-11 off (`ref` 4.5e-13 mm and 5.9e-15), on
  `apple-iphone-7-wide-camera-lens` 3.2e-11 mm and 1.3e-11 (`ref` 1.2e-14 mm and 4.9e-15). On `russar-22-70f8`,
  which has no asphere, it is the normal near the equator of a hemisphere: 1.5e-10 mm in landing (`ref` 1.9e-13).
  It is not the tolerance of the iteration: with 1e-13, 1e-14, 1e-15 and 0 in place of 1e-12 the largest figures
  of those lenses are 9e-10 mm to 1.5e-9 mm and 3e-11 to 4e-11, as before.
- **Handled.** Every such figure is far inside the gates of R2 (1e-8 mm, 1e-9), so the pairs of optiland pass on
  what they measure. What it costs is the floor: an engine that is 3e-11 from `ref` is not within the 1e-12 the
  floor rule asks of a witness, and on those four lenses 14 pairs of LensVisualizer that are `FLOOR` beside `ref`
  alone are `FAIL` beside optiland ("Behind a steep surface 1e-9 mm is not 1e-9 mm any more", above). Nothing is
  widened for it. In the suites optiland is within 1.2e-12 mm and 2.1e-14 of `ref` on every ray.
- **Class.** numerical.

### optiland's optical path is a plain sum, and as exact as its hits

- **Where.** The same line of `Surface._trace_real`: one multiplication and one addition a surface, in double
  precision, on a sum that starts at the ray's origin, over the hits optiland has
  ([above](#on-an-asphere-optiland-is-as-exact-as-a-plain-sum-of-its-terms)).
- **Effect.** Two things, the second the larger. **The sum.** Each addition rounds at the size of the path so far:
  a unit in the last place of 250 mm is 2.8e-14 mm, 5e-11 waves, and thirty surfaces add a few of those, where
  `ref` carries the path as a compensated sum and rounds once. **The hits.** A hit that is e off along the ray
  moves the path by about e/2, as a conic met from far away does (below): where optiland's hits are 1e-12 mm from
  the truth, its paths are some 2e-9 waves from it. In the two suites (378 ray sets, 242 442 rays that every
  engine lands) optiland is within 2.7e-9 waves of `ref` on the benchmark and 3.5e-9 on the feature suite, in the
  path to the last surface, to the image plane and relative to the chief ray; at the 24 focus stations within
  3.9e-9. Traced in 60 digits, the worst rays of those three have optiland 2.7e-9, 3.5e-9 and 3.9e-9 waves from the
  truth and `ref` within 1.6e-10: each figure is optiland's, and a twenty-fifth of the 1e-7 waves the floor rule
  asks of a witness. On the four lenses on which its hits are no witness in R2 it is none in R3 on three, each on
  its worst ray, in waves from the truth, to the last surface, to the image plane and relative to the chief ray:

  | Lens | Ray | optiland | `ref` | LensVisualizer |
  |---|---|---|---|---|
  | `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr`, wide end | 62.8°, 610 nm | 4.3e-7, 4.5e-7, 4.5e-7 | 2.9e-9, 3.1e-9, 3.0e-9 | 1.1e-5, 1.2e-5, 1.2e-5 |
  | `fujifilm-fujinon-xf-27mm-f28` | 27.6°, 510 nm | 8.9e-7, 9.7e-7, 9.7e-7 | 5.5e-10, 5.9e-10, 6.0e-10 | 6.6e-6, 7.1e-6, 5.7e-6 |
  | `russar-22-70f8` | 65.1°, 510 nm | 1.2e-9, 2.7e-7, 2.8e-7 | 6.5e-11, 3.7e-10, 8.4e-10 | 4.4e-9, 2.1e-7, 2.7e-6 |
  | `apple-iphone-7-wide-camera-lens` | 21.0°, 470 nm | 1.7e-8, 1.8e-8, 1.7e-8 | 1.0e-11, 9.3e-12, 1.3e-11 | 5.6e-7, 5.5e-7, 4.5e-7 |

  The figures of optiland against `ref` over those sets are the same to two digits (9.7e-7 waves at most, on the
  27 mm), and 1.8e-8 at the zoom's tele end. On the Russar the path to the last surface is right and the way from
  there to the image plane is not: the ray leaves 65° off the axis in a direction 2.9e-13 off, behind the normal
  near the equator of a hemisphere, and lands 1.5e-10 mm away after 132 mm. LensVisualizer's own worst rays of
  those lenses are 7.8e-5 waves (the zoom, 470 nm), 1.4e-4 (the 27 mm) and 2.7e-5 (the Russar) from the truth,
  where `ref` is within 5.7e-10 and optiland within 5.2e-7.
- **Handled.** Nothing: each such figure is inside the gate of R3 (2e-5 waves) by a factor of twenty or more, and
  every pair of optiland passes R3 on those lenses, all 90 ray sets. What it costs is the floor, as in R2. Of the
  11 pairs of `lv` and `ref` that are `FLOOR` in R3 on those lenses when the two are compared alone (4 of the
  zoom's wide end, 2 of the 27 mm, 5 of the Russar), 9 are `FAIL` beside optiland, with the reason "optiland does
  not agree with ref" (4, 2 and 3), and 2 of the Russar stay floors; the phone lens has no floor in R3. In R2 it
  is 14 of 17 on the same sets. No limit was changed for it: whether a witness that is inside the gate by a
  factor of twenty should withhold a floor is the owner's to decide, on these figures.
- **Class.** numerical.

### A conic is met from where the ray is, and from far away that costs the square of the distance

- **Where.** `_conic_candidates` forms the quadratic of the line with the conic from the ray's own position:
  `c = x^2 + y^2 + z (k z - 2 R)` and `b = 2 (L x + M y + N (k z - R))`, whose terms are of the size of the
  distance squared and cancel to the size of the lens.
- **Effect.** The hit is off optiland's own sag by a rounding of those terms, which is of the size of the square
  of the distance over the radius, in units of the last place of 1. Measured on a sphere of radius 30 mm with
  rays from a point at each distance: 8e-14 mm from 100 mm, 7e-12 mm from 1 m, 6e-10 mm from 10 m, 6e-8 mm from
  100 m and 2e-6 mm from 1 km. An asphere does better, because the iteration brings its hit home to the rounding
  of the distance and no further: 1.6e-11 mm from 100 m. `ref` carries the line to the surface's vertex plane
  first and solves from there.
- **What it costs the optical path** is half of it. The point optiland has lies on the ray's line, e beyond the
  surface or short of it, and the ray is refracted there: it has travelled e further in air and starts e nearer
  in the glass, along a direction the surface hardly turned, so its path is off by e (1 − n cos(turn)), half of e
  in a glass of 1.5. Measured on a lens whose front surface is that sphere, against the trace in 60 digits, over
  twenty rays from one point: from 2.3 m the first hit is 2.6e-11 mm off and the path to the image 1.3e-11 mm,
  2.2e-8 waves (3.8e-8 relative to another ray of the set); from 16 m, 7.6e-10 mm and 3.8e-10 mm, 6.5e-7 waves:
  inside the gate of R3 by a factor of thirty, and no longer the 1e-7 waves the floor rule asks of a witness; from
  100 m, 6.4e-8 mm and 3.2e-8 mm, 5.5e-5 waves: beyond the gate of R3 (2e-5), where R2 is beyond its own. A front
  surface of ten times the radius costs about a tenth: 3.1e-9 waves from 2.3 m, 1.1e-7 from 16 m and 4.4e-6 from
  100 m on a radius of 300 mm. With an asphere or a plane in front the path is right to a few
  units in the last place of the distance at every one of them (2.7e-11 mm, 4.7e-8 waves, from 100 m): what is
  left there is optiland's plain sum, each addition of which rounds at the size of the path so far, where `ref`
  carries a path as a compensated sum.
- **Where it arises.** Not in the suites, and not at a focus station. LensVisualizer's rays for an object at
  infinity start 10 mm or more in front of the lens, and its rays for a certified finite conjugate diverge from
  the object point but do not start there: it launches them from a plane in front of the lens, 18 mm to 75 mm from
  the first vertex at the 24 stations it certifies (halfway to an object nearer than that), and a ray's path is
  counted from that plane. The object of a station lies up to 2.3 m away, and optiland is within 4.5e-12 mm and
  3.9e-9 waves of `ref` there, as in the suites. The rays that do start at an object point are the probe lattices
  of a case file with a finite object, and any ray set that a later source launches from the object: a 400 mm lens
  focused at 1:40 has its object 16 m away.
- **Handled.** Nothing: it is a difference for R2 and R3 to measure. It is why the worker takes a point within
  1e-6 mm of the surface for a point of the surface (`ON_SURFACE_TOLERANCE_MM`) and not within 1e-10 mm: that
  tolerance tells a hit from a point that is somewhere else, and judges no precision. A test finds the two
  figures of the hit at 100 m (`test_trace.py`), and another the path's at 2.3 m, 16 m and 100 m, and that it is
  half the hit's (`test_path.py`).
- **Class.** numerical.

### The tolerance of an asphere's iteration is that of the batch it is traced in

- **Where.** `_effective_tolerance` in `optiland/geometries/newton_raphson.py` raises the tolerance the surface was
  built with to `8 eps max(1, |t|)`, with `|t|` the largest distance of the base conic from any ray of the batch:
  above 1e-12 mm once one ray is more than 563 mm from the surface. A ray that an aperture has stopped is still in
  the batch, on a path of its own.
- **Effect.** One ray decides how closely every ray of the batch is brought to the surface. With a ray that comes
  from 10 km away in the batch the tolerance is 1.8e-8 mm, and a ray beside it whose base conic lies 8e-9 mm from
  the asphere is left there, where alone it is brought within 1e-12 mm. On a curved base a ray without a point or
  without a direction has no distance, the largest distance is then no number, and the tolerance stays the
  surface's own.
  **On a flat base it does not.** The iteration of an asphere of infinite radius starts at the distance to the
  base plane, `-z / N`, and `_conic_intersection_distance` puts 1e-14 in place of an `N` that is not above it in
  magnitude, which a NaN is not. A ray that was totally reflected further up keeps its point and has no direction:
  it is 1e14 times its `z` from the plane, the tolerance of the batch is of the order of a millimetre, the base
  plane is within it for every ray, and no ray of the batch is brought to the surface. Each is left on the base
  plane, off the surface by its whole sag, with an intensity above 0, and is refracted there. The reflected ray
  need carry no light: one that an aperture stopped surfaces before is traced on like any other. Measured on 280
  synthetic systems, 98 of them with an asphere on a flat base (2240 probe lattices, in no test): 42 ray sets of
  11 systems have a hit of optiland 2e-4 mm to 0.17 mm from `ref`'s on such a surface, and the same ray traced
  alone is within 1e-12 mm of it; the 60-digit trace is within 2.3e-12 mm of `ref` on every ray of those sets
  that both engines land. In every one of the 42 a
  ray with a point and without a direction stands in front of the surface, and in 35 of them only rays that an
  aperture had stopped before: a probe lattice reaches past the first rim, and the rays it loses there are the
  ones that are reflected later.
- **Handled.** The rays of a request are one batch, as they were given: nothing is sorted or split to shield a ray
  from its neighbours, and a hit is answered as optiland has it, for R2 to measure. A set that this strikes fails
  R2 in the pairs of optiland, by a hit on a flat-base asphere that is off by the surface's sag, and the pair of
  LensVisualizer and `ref` is untouched; a floor of LensVisualizer on that set has no witness. Measured on the
  suites, where it does not arise: no ray that had ended is more than 22.5 mm from an asphere, the tolerance is
  1e-12 mm at every one of the 972 aspheric surfaces traced, and tracing the rays of each of the 378 sets again in
  groups that ended alike changed no bit of any answer, at four times the cost. The catalog has two lenses with
  an asphere on a flat base, `zeiss-zx1-distagon-35mm-f2`, which is in the feature suite, and
  `fujifilm-fujinar-210mm-f45`: with LensVisualizer's rays at six fields, wide open and at f/8, on lattices of 32
  and 64 cells (168 ray sets, 489 034 rays) no ray is reflected in front of either surface, and optiland is
  within 1.5e-12 mm of `ref` in every hit. A request of more than 16 384 rays is traced in batches of that size, in
  the order given. One test puts the far ray into the batch and finds the hit 8e-9 mm off; another puts a
  reflected ray in front of a flat-base asphere and finds its neighbours on the base plane, to the bit.
- **Class.** numerical.

### numba's JIT changes no bit of a trace

- **Where.** `optiland/backend/numpy_backend/conic.py` compiles the conic intersection with
  `@njit(cache=True, error_model="numpy")`, without fast-math; everything else of a trace is numpy.
- **Effect.** None on a figure: all 378 answers of the two suites are the same bytes with the JIT on and with it
  off, every array of every one. Off, the benchmark's 216 sets take the worker 20 s where they take 5 s.
- **Handled.** The JIT stays on, as optiland runs for its users. The comparison is repeated by a test
  (`test/integration/optiland/r2.test.ts`), which starts a second worker with the worker's own switch,
  `LVRTC_OPTILAND_JIT=off`: that worker states `jit: false`, so its fingerprint is another and none of its answers
  is ever found in the result store for one of the engine as it runs. numba's own `NUMBA_DISABLE_JIT` is not
  obeyed. The test holds every figure of every pair to 1e-13 between the two and every answer to 1e-12, and says
  how many answers are the same bytes.
- **Class.** none of the ladder's.

### What the builder refuses

- **Where.** `workers/python/lvrtc_optiland/build.py` and `engine.py`.
- **Effect.** The engine declares every feature flag of the contract and no limit: an annular aperture (`r_min`),
  several lines (an optic each), a finite object (the object surface at the object plane), even and odd aspheres
  of any power, a flat base and a conic constant. Of the 2267 cases of the catalog none is refused, and each
  passes R0 against `ref`.
- **Handled.** What it refuses is an optic that is not the case. Whatever of the build comes back from optiland
  as another value than the case states is an error of the code `build-mismatch`, with the surface, the field and
  both values, and nothing is described; a call of optiland that optiland has deprecated is an error too, not a
  warning in a log. Every other quantity than `system.describe`, `paraxial.first-order` and `rays.trace` is
  `unsupported` until its stage. Of the 1173 cases of the catalog on the reference line optiland has first-order
  data of every one.
- **Class.** none of the ladder's.
