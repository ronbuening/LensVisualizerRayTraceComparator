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
whose engine files are the same (closure `f6681074`), with two lens files corrected. The committed digest of the
benchmark was last written at `c3fc5a2d`, with the same engine files and the same cases, each named there by its
content hash: its figures are those of `3af45e3f`, number for number.

Where an entry says whose error a difference is, the ray was traced a third time, outside the repository, in
60-digit decimal arithmetic by a tracer that shares no code with either engine: Newton's method on the contract's
sag, and the textbook vector form of Snell's law.

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
  with every other engine within 1e-10 mm and 1e-7 waves and `lv` is within 1e-7 mm and 2e-4 waves of `ref`
  (`policy/rungs.v1.json`); it counts as a pass and is counted apart. In the suites, 4 of the 288 pairs of traced
  rays of `features` are `FLOOR`, all of the Hologon at full field, at 470 nm and 510 nm; the benchmark has none.
  Over the catalog, in one sweep outside the tests (868 lenses on their reference line and 808 on the photopic
  lines, at up to three fields each: 14 370 ray sets, 16.4 million rays), 39 pairs are `FLOOR` in R2 and 24 in R3,
  on eleven lenses. Ten are at their full field only. The eleventh, `fujinon-xf-23mm-f14-r`, is a floor at every
  field, the axis included: its hits are 1.0e-8 mm to 1.6e-8 mm off at surface 21, where the 60-digit trace puts
  `ref` 6e-13 mm from the truth on the worst ray of the axial pencil.
- **Not handled, and failing.** The floor has limits, and a direction has none: a difference of direction above 1e-9
  always fails. Five lenses of the catalog are beyond one or the other, in 19 pairs of R2 and one of R3, and those
  pairs are `FAIL`, as they should be until someone decides otherwise. At their full field:
  `apple-iphone-12-main-wide` (direction 2.9e-9 to 4.1e-9, with hits 1.1e-8 mm to 1.2e-8 mm off),
  `fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr` (direction 1.1e-9 to 4.0e-9, hits up to 1.15e-7 mm and landings up to
  1.20e-7 mm), `fujifilm-fujinon-xf-27mm-f28` at 510 nm (hits 1.8e-7 mm and direction 3.5e-9, on a ray that leaves a
  surface 3° short of the perpendicular to the axis) and `leica-apo-summicron-m-35f2` at 555 nm (direction 1.8e-9,
  landing 2.0e-7 mm and 3.3e-4 waves behind an exit 64° off the axis). At half its field, on the photopic lines only:
  `apple-iphone-7-wide-camera-lens` (direction 1.0e-9 to 1.4e-9, with every hit within its gate). In each, the
  60-digit trace puts `ref` between 5e-15 mm and 6e-13 mm from the truth and `lv` the rest. None is in a suite. A
  tighter or caller-set intersection tolerance in LensVisualizer would turn every one of them, and every `FLOOR`, into
  a `PASS`.
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
- **Handled.** Nothing is forgiven: each of these rays is one that `lv` stopped and `ref` passed, well inside the
  clear aperture, so it is a mask mismatch and the pair fails R2 (14 pairs on the reference line, 63 on the
  photopic lines, 2394 and 6998 rays). None of the six is in a suite. An integration test
  (`test/integration/lv/rungs.test.ts`) holds each to this: the surface, LensVisualizer's `noBracket`, and the
  step backwards in `ref`'s trace; it fails on the day LensVisualizer traces through.
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
- **Handled.** The ray sets ask with the lines of the case, so that the footprint is found at the case's own
  reference line, and with LensVisualizer's entrance pupil for the case's stop radius as the seed, which is the
  tab's number to rounding. A set is identified by its content, never by the request that made it. The tab's own
  request, to the bit, is reproduced where its MTF is.
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
- **Not handled, and failing.** The radius of that pupil is as large as it is far: 3.4 m at the d line and 6.3 m at
  650 nm, the same quotient. There the two engines hold 4.8e-10 mm and 1.35e-9 mm apart, 2e-13 of the radius. The
  amendment is of a pupil's position, and every other value keeps the plain 1e-9 mm, so the photopic case of this
  one lens still fails R1, by `exitPupilSemiDiameter` at 650 nm. Judging the radius of a pupil on the scale of the
  pupil's distance, as its position is, would pass it; that is a change of the gate, and the owner's to make. An
  integration test pins both halves (`test/integration/lv/engine.test.ts`). Over the 1676 cases of the catalog it
  is the only pair that fails R1; every value of every other lens that is not a pupil's position is within
  1.1e-11 mm, and every other pupil position within 1.9e-11 mm.
- **Class.** numerical.
