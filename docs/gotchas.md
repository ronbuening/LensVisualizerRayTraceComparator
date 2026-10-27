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
Historical measurements below are of LensVisualizer commit `d36f44b3`; those of rungs R2 and R3 were taken at
`3af45e3f`, whose engine files are the same, with two lens files corrected; those of the product MTF at `ed78cf40`,
with the same engine files again. The engine closure the comparator states has grown with what it loads of
LensVisualizer: it was `f6681074` (142 files) through rung R3, and `1827eefe` (151 files) from the product MTF on,
the same 142 and the nine files of LensVisualizer's MTF product, its aperture slider and its tab preferences. It became
`ff670f03` (the same 151 files) when LensVisualizer edited partial-dispersion fields in its glass catalogue:
at `1ed8cc3d` every case of the benchmark has the content hash it had, and every figure of the digest is the same.
The verdicts that policy version 4 changed (the floor of the exit direction, the radius of a far pupil) were measured at
`1ed8cc3d`, closure `ff670f03`, while one lens file of that checkout was being edited, which no result here is of.
The former digest of the benchmark was last written at `23631dc0`, with that closure and the same cases, each
named there by its content hash. Its figures are those of `3af45e3f` but for one lens, `sigma-35mm-f14-dg-hsm-a`,
whose launch rays moved by 7e-15 mm when the ray sets took the MTF tab's own seed (below): its largest differences
changed in the fifth digit, and no count changed. Since policy version 4 it has two more figures in R1, the radius
of a pupil scaled and plain, and `firstOrder.maxAbs` is of the six values that are no pupil's: in the two rows of
that lens it used to be a pupil's radius, which is now in the column of its own. The figures of the MTF replay and
of rung R4f were measured at `33ebdb30`, closure `78215d72`, still 151 files: what the replay added to the import
manifest (the refinement, the footprint's widening, the sampling constants, `computeMtfSteps`) is exported by files
the closure already held.

The figures of the entries on a rear plate that does not clip, on the stop radius and on the tolerance of 1e-12 mm
were measured at `31c34396` (branch `fix/771-intersection-tolerance`, closure `a52a7b8e`, 152 files), against the
then-committed baselines of `33ebdb30`. Unless an entry states a later commit, its measurements describe
LensVisualizer up to `33ebdb30`; its paths name the rewritten modules. Stage 3.12's current baselines and census
are of `ab0fd4cf` (closure `94778d3d`, 175 files), optiland `4e893f53`, policy version 11: R6a is gated at 2e-8,
and no rung or metric has a floor. All four saved baseline checks report every record `OK`; the historical
floor verdicts below are not the current state.

Where an entry says whose error a difference is, the ray was traced a third time, outside the repository, in
60-digit decimal arithmetic by a tracer that shares no code with either engine: Newton's method on the contract's
sag, and the textbook vector form of Snell's law. For the pairs whose verdict policy version 4 changed, and for
those it left failing, that was done again in the review of Stage 2.0, at closure `ff670f03` and in 50 digits,
by a tracer written afresh, on every ray both engines land of each set and not on its worst ray alone.

## LensVisualizer

### The rewritten public seam widens the closure

- **Where.** LV's public optics barrels, after rewrite merge `460f841f`; comparator manifest uses barrels where
  available and defining deep modules otherwise. At `643ef5d0` it loads 175 engine files, including non-MTF analysis.
- **Effect.** A change in those analysis modules can move the engine closure even when MTF values stay the same.
  The prepared-state cache retains two lenses; sweeping a catalog can evict a previous lens (performance only).
- **Handled.** Fingerprint the actual import closure; refuse a pre-rewrite LV plainly. Stage 3.12 measured the
  new numerics at `ab0fd4cf` (175 files); policy version 11 pins R6a at 2e-8 and removes R2/R3 floors, with
  all four baselines and the census rewritten; every record is `OK` in the saved baseline checks.
- **Class.** convention.

### V2 controls and prepared stop radii

- **Where.** V2 zooms have `zoom.stations`; finite stations are `focus.conjugates` with station/keyframe indices.
  A derived stop's canonical `source.sd` is the placeholder 0. `fopenAtZoom` is the unclamped station function;
  the UI imports `fopenAtZoomClamped as fopenAtZoom`.
- **Effect.** Reading V1 `zoomPositions` silently misses both zoom ends. Reading `source.sd` gives no physical
  stop radius, and using the plain aperture function loses the UI's clamping.
- **Handled.** Detect two or more V2 stations, resolve finite station controls, read the prepared stop surface's
  `sd`, and import `fopenAtZoomClamped`. Preserve the hook's multiplication/division order exactly.
- **Class.** data.

### The sag function is finite beyond the end of a conic

- **Where.** `conicPolySag` and `sag` in `src/optics/geometry/surfaceProfile.ts` clamp the root: where
  `1 − (1 + K) c² h²` is not above 0 they take it as `1e-12` (0 for a sphere), so the sag is a number at any height.
  The surface profile says where the surface really ends, `finiteRadiusLimit()`: `|R|` for a sphere and
  `1 / sqrt((1 + K) c²)` for a conic that closes. LensVisualizer's own intersection (`evaluateProfile` in
  `src/optics/geometry/intersect.ts`) evaluates a point beyond that height as no surface.
- **Effect.** The contract's sag is NaN there. An echo of `profile.sag(r)` alone would report a finite sag where
  every other engine reports none, and R0 would fail on a surface whose clear aperture is authored wider than the
  surface is.
- **Handled.** The engine `lv` reports NaN beyond `finiteRadiusLimit()` (`sagOf`, `src/engines/lv/describe.ts`),
  which is LensVisualizer's own rule and not the comparator's. Of the 18 678 surfaces of the lenses that export,
  none has a clear aperture beyond that height today; the nearest, the second surface of `russar-22-70f8`, is
  authored 1e-9 mm short of its radius.
- **Class.** convention.

### The stored pupil constants are not paraxial

- **Where.** `epZRelStop`, `xpZRelLastSurf` and `xpSD` of a RuntimeLens are found in `src/optics/first-order/lensConstants.ts`
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

- **Where.** `computeSystemMatrix` and `computeCardinalElementsFromState` in `src/optics/first-order/` trace
  `state.surfaces`, whose `nd` is the authored index: the d line, or the e line of an all-e lens.
- **Effect.** LensVisualizer has no cardinal points at the photopic lines, nor at the reference line of a lens that
  mixes d- and e-referenced glasses, which it traces with anchored indices.
- **Handled.** `lv` runs the kernel under that module, `paraxialTrace`, on rows of radius, gap and the
  line's index, and LensVisualizer's own `buildCardinalElementsFromMatrix` on the matrix. At a line of authored
  indices the result is `computeCardinalElementsFromState(state)` to the last bit, on all 868 lenses that export.
- **Class.** method.

### The paraxial kernel always starts in air

- **Where.** `traceParaxialSurfaces` in `src/optics/math/paraxial.ts` (exported as `paraxialTrace` by the optics
  barrel) starts every ray with the index 1 at the first row it is given.
- **Effect.** The rear group cannot be traced from the stop by handing the kernel the rows behind the stop: a stop
  inside an element (`zeiss-hologon-15f8`) would be traced as if it stood in air.
- **Handled.** The exit pupil is traced from a flat row in front that carries the stop's own index and gap: it
  puts the ray into the stop's medium with its reduced angle unchanged (`lineValues`,
  `src/engines/lv/firstOrder.ts`).
- **Class.** convention.

### The paraxial kernel is handed radii, and no lens has a term below A3

- **Where.** `paraxialTrace` takes rows of radius, gap and index; `ASPHERIC_COEFFICIENT_SCHEMA` in
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

- **Where.** `buildCardinalElementsFromMatrix` returns nothing when the matrix element `C`, the system's power in
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
  accessors at the state's zoom position (`fopenAtZoomClamped`, `wideOpenStopAtZoom`, `epAtZoomClamped`).
- **Class.** data.

### A rear plate without a published rim is a surface that does not clip

- **Where.** `expandRearPlates` in `src/optics/prescription/rearPlates.ts` makes two flat surfaces of every plate a
  lens file declares behind the lens. A plate that states no `sd` gets a generated one, 1.5 times the larger of
  the largest authored semi-diameter and the image semi-diagonal, and from `31c34396` on the two surfaces are
  marked `clips: false` (`CompiledSurface.clips`, `src/optics/types.ts`): `activeSemiDiameter` in
  `src/optics/trace/aperture.ts` then has no semi-diameter for them, so `evaluateAperture` calls no height
  outside, and the two searches for the surface that limits the half field skip them (`buildLens` in
  `first-order/lensConstants.ts`, `computeFieldGeometryAtState` in `field/geometry.ts`). Their `sd` is left as an envelope
  that ray launch and intersection bounds read. A plate with a published `sd` clips as before. Up to `33ebdb30`
  the generated rim clipped like any other.
- **Effect.** The contract could state no such surface, and the exporter's guard refused every lens that has one
  (`LensVisualizer traces surface RP1a with the semi-diameter null, expected 41.085`): 232 of the 1180 states of
  the catalog that can be exported, 6 of the 12 configurations of the benchmark (`fujifilm-fujinon-gf-63mm-f28-r-wr`,
  `nikkor-z50f12`, `nikon-z-24-70f4s` at both ends, `nikon-z-135f18-plena`, `sigma-45mm-f28-dg-dn-contemporary`) and
  one lens of the feature suite (`zeiss-touit-50mm-f28-macro`, the runs `odd-asphere-*`). The two plates of the
  feature suite with a published rim (`nikkor-z-35f18s`, `zeiss-zx1-distagon-35mm-f2`) clip, and are exported as
  they were. The guard did what it is for: an exporter that had gone on would have written a rim LensVisualizer
  does not trace by.
- **Handled.** Contract minor 2 states it: such a surface has `aperture.semiDiameter` null, its `sd` as
  `nominalSemiDiameter`, and its case the flag `aperture.unclipped` and the version `1.2`
  ([contract/CONTRACT.md](../contract/CONTRACT.md#cases-from-lensvisualizer)). `surfaceAperture` exports it only
  where the state marks the surface and `evaluateAperture`, asked at the envelope, beyond it and at the largest
  double, reports no semi-diameter and calls nothing outside; any other answer is thrown. Every engine builds it
  as a surface that stops no ray: `ref` with an infinite clip radius, `optiland` without a physical aperture
  (under optiland, below), and `lv` by asking LensVisualizer, whose tracer is the one that changed. Each answers
  `clipRadius` +Infinity in `system.describe`, and R0 holds the three to it. R2 has no rim band on such a surface:
  a ray one engine stopped there is a mismatch at any height. Source canaries hold the lines of LensVisualizer
  this rests on (`canaries.test.ts`).
- **Measured.** On the two suites the change moves no number. LensVisualizer at `31c34396` was set beside a copy
  of it, made outside the repository and outside LensVisualizer, in which the one expression of `rearPlates.ts` is
  put back so that a generated rim clips: for the six lenses with such a plate every ray set is the same bytes
  (450 sets), the stop radius, every field angle and the best-focus shift are the same doubles, and every figure
  of every pair of R0 to R4 is the same (750 pairs), as is every answer of R4f. No ray of these suites reaches a
  generated rim, and none limited a field: at 1.5 times the largest of the lens and the image the rim was never
  in the way. What changes is the case, which states another aperture, and with it the case's id and the id of
  every request about it.
- **Class.** data.

### The wide-open stop radius is the height of a traced ray, and moves with the intersection tolerance

- **Where.** `computeLensConstants` in `src/optics/first-order/lensConstants.ts`, behind `buildLens`, derives the
  stop surface's `sd` from a real marginal ray of the nominal entrance pupil (`nomRealY`), and for a zoom the
  same at each station; a fixed iris keeps its authored radius.
  `wideOpenStopAtZoom` hands that out, and it is the stop radius of a case.
- **Effect.** The radius is known to LensVisualizer's intersection tolerance and no better, and it is in the
  identity of the case twice, as `conditions.stopSemiDiameter` and as the stop surface's aperture. When the
  tolerance went from 1e-9 mm to 1e-12 mm (`31c34396`), the stop radius of 11 of the 12 configurations of the
  benchmark moved, by 1.6e-13 mm to 2.0e-10 mm (`sony-fe-400mm-f28-gm-oss`), and of 7 of the 9 configurations of
  the feature suite, by up to 3.3e-11 mm: every one of those cases has another id, and its launch rays, which
  LensVisualizer aims at that stop, are other bytes. So a change of LensVisualizer's numerics makes nearly every
  record of a baseline stale by case, and not only by engine. LensVisualizer's best axial focus moves with it, by
  up to 2.9e-9 mm on the benchmark; the field angles of the benchmark do not move at all, and one of the feature
  suite's by 6e-8 degrees (`nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom` at its wide end, full field).
- **Handled.** Nothing is rounded or pinned: a case is LensVisualizer's numbers to the bit, and `lvrtc baseline
  check` says STALE(case) and REFRESHABLE where the figures still hold. The canary of `nikkor-z50f12`'s stop
  radius in `test/integration/lv/export.test.ts` is held to 1e-9 mm, the looser tolerance, and names both values.
- **Class.** numerical.

### A sequential trace ends on the last surface, not on the image plane

- **Where.** `traceSequential` in `src/optics/trace/sequentialTrace.ts` returns `terminalPoint`, the hit on the last
  surface, `terminalDirection`, the direction behind it, and `reachedImagePlane: false`. Every caller carries the
  ray on by itself; the MTF's own helper is `mtfImagePoint` in `src/optics/analysis/mtf/mtfTracing.ts`, which takes an
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
  for the first, bit for bit, and adds `finalMedium` times the projection's distance for the second. The wave
  estimator adds what is missing, the path from the incident wavefront to the origin, from the request's own
  origins and directions (`launchPaths` in `src/estimators/waveOtf.ts`): the projection of the origin on the
  direction for an object at infinity, the length from the object plane for a finite one. It needs no chief ray.
- **Class.** convention.

### A hit lies within 1e-9 mm of its surface, not on it

**History (the 1e-9 mm numerics still in LV `33ebdb30`).** Current LV `ab0fd4cf` uses 1e-12 mm;
Stage 3.12, policy version 11, removes every R2/R3 floor. A pair above a gate is FAIL. The floor machinery
stays for a future engine with synthetic tests; Phase 5's catalog sweep will test whether a steep lens needs one.

- **Where.** `intersectProfile` in `src/optics/geometry/intersect.ts` iterates until the z of the ray is within
  `INTERSECTION_TOLERANCE` of the z of the surface (now in `src/optics/math/constants.ts`; historically 1e-9 mm) and takes that point for
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
  passed by the other, and none is failed. The former digest was `reports/benchmark/lv-floor.md`; the current
  record is `reports/benchmark/rays.md`. What the tolerance becomes behind a steep surface is the next entry.
- **Class.** numerical.

### Behind a steep surface 1e-9 mm is not 1e-9 mm any more

**History (the 1e-9 mm numerics still in LV `33ebdb30`).** Current LV `ab0fd4cf` uses 1e-12 mm;
Stage 3.12, policy version 11, removes every R2/R3 floor. A pair above a gate is FAIL. The floor machinery
stays for a future engine with synthetic tests; Phase 5's catalog sweep will test whether a steep lens needs one.

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

### From `31c34396` on a hit lies within 1e-12 mm of its surface

- **Where.** On LensVisualizer's branch `fix/771-intersection-tolerance` (commit `31c34396`, engine closure
  `a52a7b8e`, 152 files) `INTERSECTION_TOLERANCE` is 1e-12 mm, where it was 1e-9, with 48 iterations for 32. Where
  rounding keeps the residual from reaching it, `intersectProfile` accepts an iterate that can no longer move,
  within a bound made of its own operands (`sagResidualRoundoff`, `planeResidualRoundoff` in
  `src/optics/geometry/intersectTolerance.ts`); a hit on a plane is held to the same. The two entries above describe
  LensVisualizer up to `33ebdb30`.
- **Effect.** What the tolerance left in every figure is three orders smaller. The committed baselines, of
  `33ebdb30`, against the same suites at `31c34396`, `lv` against `ref` (against optiland every figure is within
  a tenth of these):

  | Figure, largest over the suite | benchmark, before | after | features, before | after |
  |---|---|---|---|---|
  | R2 `hits.maxDistance`, mm | 6.77e-9 | 1.88e-12 | 2.30e-9 | 1.96e-12 |
  | R2 `direction.maxAbs` | 3.13e-10 | 7.96e-14 | 2.07e-10 | 1.35e-13 |
  | R2 `landing.maxDistance`, mm | 9.12e-9 | 2.38e-12 | 1.10e-8 | 6.48e-12 |
  | R3 `opticalPath.maxAbs`, waves | 6.12e-6 | 5.93e-9 | 3.79e-6 | 4.72e-9 |
  | R3 `opticalPathToImage.maxAbs`, waves | 5.88e-6 | 5.68e-9 | 2.07e-5 | 1.10e-8 |
  | R3 `opd.maxAbs`, waves | 7.37e-6 | 5.99e-9 | 2.28e-5 | 1.22e-8 |
  | R4 `mtf.maxAbs` | 5.39e-8 | 1.19e-10 | 4.79e-8 | 2.43e-11 |
  | R6a `waveMtf.maxAbs` | 3.12e-6 | 1.73e-9 | 1.45e-6 | 1.13e-9 |

  The two exact tracers differ from each other by 1.2e-12 mm in a hit, 2.7e-9 waves in a path and 1.2e-9 in R6a,
  before and after: LensVisualizer is now within a factor of about two of what they agree to. The four records
  of the feature suite that were FLOOR, the steep field of `zeiss-hologon-15f8` in R2 and R3 against `ref` and
  against optiland (8 of 1242 requests of a pair), are PASS, and no pair of either suite is a floor. The seven
  runs of catalog lenses on which the floor rule was shown ("Behind a steep surface", above: floors, and failures
  beyond the floor's limits) are 138 pairs that all pass, the worst hit 7.4e-10 mm
  (`fujifilm-fujinon-xf-27mm-f28`) and the worst landing 8.5e-10 mm. R4f is where it was (1.2e-14, the same grid
  in every field of all 96 runs), R6a judges the fields it judged (208 of 288 on the benchmark, 24 of 54 on the
  feature suite), and no verdict of a recorded rung changed: R5, R5g and R6b set methods against each other, and
  moved by at most 2.4e-8 (LensVisualizer's diffraction MTF against optiland's), 2.0e-7 (the geometric ones) and
  3.1e-6 (whatever is set against the wave estimator on LensVisualizer's rays, which is the old tolerance in the
  optical path).
- **What moved besides.** The stop radius of nearly every lens, and with it every case ("The wide-open stop
  radius is the height of a traced ray", above); LensVisualizer's best axial focus, by up to 2.9e-9 mm; and one
  footprint: for `nikon-z-135f18-plena` on the photopic lines at full field LensVisualizer widens the sampled box
  once more (25 144 blocked rays become 51 064; the 43 976 that land and the grid of 128 stay). It widens where
  it finds flux in the guard band of a box that traced rays place, and it does so in the copy with clipping
  plates too: the numerics, not the plate. The replay follows it, and no figure does.
  No field angle of the benchmark moved, and no ray that one engine stops and another passes appeared. What does
  not move is what the tolerance never was: where two surfaces cross LensVisualizer still loses the ray
  (`noBracket`, below). Its traces cost 2.6 % more time (the 864 ray sets of the benchmark, 49.7 s to 51.0 s) and
  its product MTF with the replay 4.2 % more (175 s to 183 s).
- **Handled at Stage 3.10 (history).** No gate, floor limit or band changed then. At Stage 3.12, measured on
  LV `ab0fd4cf` (closure `94778d3d`, 175 files), policy version 11 pins R6a at 2e-8 and removes R2/R3 floors.
  Floor tests use synthetic policies; real-policy tests require PASS. The old 4e-5 pin described `33ebdb30`.
  That the figures above are LensVisualizer's and not the comparator's was held apart: the comparator as it is
  now, run on LensVisualizer `33ebdb30`, gives every case of both suites the id the baselines have and every
  figure of R0 to R4 to the last digit (1710 records, none changed).
- **Class.** numerical.

### A total internal reflection is "failed", and a miss is "failed" until it is proven

- **Where.** `finalizeTraceResult` in `src/optics/trace/utils.ts` gives every trace with a failure reason the
  status `failed`: a reflection as well as an intersection that was not found (`noBracket`,
  `noConvergedIntersection`). What is physical and what is numerical is decided afterwards, by
  `mtfTraceClassification` in `src/optics/analysis/mtf/mtfRayClassification.ts`: a clip and a total internal
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

- **Where.** `intersectSurfaceProfile` in `src/optics/geometry/intersect.ts` restricts an asphere to its authored
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
  of the eight was in a suite at that measurement. An integration test (`test/integration/lv/rungs.test.ts`) holds each to this, at
  the end of the zoom where it happens: the surface, LensVisualizer's `noBracket`, and the step backwards in
  `ref`'s trace; it fails on the day LensVisualizer traces through.
  **Stage 5.3, LV `879c06102`:** the seven affected catalog runs reproduce 34 / 498 / 146 / 1,078 / 8 / 356 / 30
  disagreements respectively for Bertele, Leica, the two Nikon tele ends, Nokton, Olympus and Pentax wide.
  All **2,150** disputed rays were checked, not just each metric's first ray: native LV says
  `failed / noBracket`, its native MTF classification is `blocked`, and the independent `exact.py` trace in
  60-digit Decimal arithmetic passes the disputed surface and agrees with ref's final status/end surface.
  Every exact disputed hit is behind the previous one; z steps span -1.480296 to -0.000191788 mm, well beyond
  LV's backward allowance. Optiland/ref has no mask disagreement on these requests. The original FAILs and
  their three-request aggregates remain unchanged. See the [catalog table](REFERENCE.md#stage-53-catalog-fail-attribution)
  and [all 83 row addresses](catalog-attribution.json). The existing crossing integration pin covers all seven
  current lenses, including both explicit tele states, and skips with `LV_UNAVAILABLE` when LV is absent.
  The seven are the lenses listed above but the Vivitar, whose lens file put its stop 1.2 mm behind surface 21 at
  `31c34396` and which loses no ray since. What a reader can repeat: each lens's one-run reproducer and
  `bin/catalog-attribution.mjs`, which requires the settled 60-digit trace on every disputed LV/ref ray (REFERENCE,
  "Stage 5.3 catalog FAIL attribution"); LensVisualizer's own `noBracket` and `blocked` are re-read by the tier-2
  pin on the first disputed ray of each lens, while the reading of all 2,150 was a one-off of the attribution,
  counted in the [evidence ledger](catalog-attribution.json) (`nativeLvNoBracketChecked`).
  **For the owner.** The class says where the difference comes from, not that LensVisualizer's answer is
  acceptable: LensVisualizer itself says it could not trace the ray (`failed`, `noBracket`), and its MTF
  classification then counts that failure as light a rim stopped, so its product MTF and working f-number change
  (f/4.92 for f/4 at the tele end of the 25–50). The prescriptions are also not physical at those heights: a stop
  or a face inside the glass of its neighbour. Whether LensVisualizer should step backwards as other sequential
  tracers and the contract do, count a failed trace apart from vignetting, or have these lens files corrected as
  the Vivitar's was, is the owner's to decide in LensVisualizer; nothing is filed, and the comparator keeps the
  FAIL until LensVisualizer changes.
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

- **Where.** `traceMtfBundle` in `src/optics/analysis/mtf/mtfTracing.ts` starts at `grid.columns / 2` when every
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
  `computeAnalysisFieldGeometryAtState`, `resolveMtfSpectrum`, `DEFAULT_MTF_PREFERENCES`, `MTF_FREQUENCIES`).
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

- **Where.** `geometricOtf`, `combineOtfs` and `otfMagnitude` in `src/optics/analysis/mtf/mtfMath.ts`, as `fieldAtGrid`
  in `src/optics/analysis/mtf/mtf.ts` calls them (read at `c05a2ab7`).
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

### The chief ray of an MTF field is one launch for every line

- **Where.** `prepareMtfFieldLaunch` and `traceMtfBundle` in `src/optics/analysis/mtf/mtfTracing.ts` ("One field's
  chief-ray launch, shared by every wavelength and refinement level"), and `solveChiefRay` in
  `src/optics/field/chiefRaySolve.ts`, whose residual at the stop is `CHIEF_RAY_RESIDUAL_TOLERANCE`, 1e-7 mm (read at
  `33ebdb30`).
- **Effect.** LensVisualizer solves the launch of a field's chief ray once and traces that one ray at every line.
  The reference point of a field, and the `imageHeightMm` its MTF states, is where that launch lands at the first
  line of the spectrum: at a line that is not the one the launch was solved at, it is a ray that misses the centre
  of the stop by the chromatic shift of the pupil. An engine that aims the chief ray of the first line at the
  centre of the stop for that line lands elsewhere. Measured on the benchmark against optiland's chief ray, at one
  field angle, bit for bit the same in both: on the reference line the two land within 9.2e-10 mm of each other in
  every one of 144 fields; on the photopic lines, whose first is 555 nm, 95 of the 96 off-axis fields land more
  than 1e-7 mm apart, by up to 3.0e-4 mm (`sony-fe-20mm-f18-g` at full field).
- **Handled.** Nothing is corrected. The modulus of a geometric MTF does not depend on the point its phases are
  measured from when one point serves every line, so the landing of a chief ray is no input of either curve of
  rung R5g, only a check that the two answers are of one field. That rung's limit on it is 1e-3 mm
  (`chiefLanding.maxAbs` of `r5g` in the policy), and every field's distance is in its table. Rung R5 keeps
  1e-7 mm: it has no optiland row on several lines. R6c's polychromatic diffraction comparison uses 1e-3 mm
  when either answer records several lines, by the owner's 2026-10-22 decision, and keeps 1e-7 mm for two
  one-line answers. It states which ray its reference is; a common origin also preserves that spectral modulus.
- **Class.** convention.

### The MTF of a field is decided grid by grid, and the footprint of one grid is the next grid's

- **Where.** `traceField`, `fieldAtGrid` and `refineMtfField` in `src/optics/analysis/mtf/mtf.ts`, the constants of
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

- **Where.** `geometricOtf` in `src/optics/analysis/mtf/mtfMath.ts`: plain sums in the order of the rays, and for a
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

### LensVisualizer has two wave estimates, and the one it shows reads no optical path

- **Where.** `shearedOtf` in `src/optics/analysis/mtf/mtfShearedOtf.ts`, the method "diffraction" of the MTF tab, and
  `waveLatticeOtf` in `mtfWavefront.ts`, which LensVisualizer's tests and chart report hold the first against and
  which is no product path.
- **Effect.** Both are Hopkins' autocorrelation on the launch lattice with the shear `lambda nu` in direction
  cosine times index, and both differ from the comparator's estimator (`src/estimators/waveOtf.ts`) in method:
  - `shearedOtf` reads no path at all. The phase of a pair is `-2 pi nu` times a mean of the landing errors of
    five rays along the shear (Boole's rule; Simpson's on three where an obstruction hides one), exact for a
    wavefront up to the sixth order along the shear and approximate beyond, and for a pair that straddles a gap
    the mean of its two ends. Sine and cosine come from a table of 4096 entries, good to 3e-7. It needs no
    quarter-wave validity and tends to the geometric OTF at low frequency.
  - `waveLatticeOtf` reads the path as the comparator does: launch phase, `opticalPathLengthMm`, and the stretch
    to the foot of the perpendicular from the reference, with the same quarter-wave criterion
    (`waveLatticePhaseStep`).
  - Both shear along the lines of the lattice: rows for the cut along x, columns for the one along y, the cosine
    looked up along that line alone. Off the axis a row is no line of constant cosine. The comparator finds the
    sheared point in both coordinates.
  - Both take the square root of the flux for the amplitude, without the area of cosine space a cell covers, and a
    pair is centred on a cell with both ends interpolated, so the overlap of two cells is a product of two ramps
    and not the area they share. The comparator's modulus is flux over area, each cell is one end of its pairs,
    and on an even lattice the overlap is the staircase's exactly.
  - `shearedOtf` traces half the lattice of a meridional field and mirrors it; `waveLatticeOtf` fills the cosines
    of dark cells along a line by a straight line. Sums are plain.
- **Handled.** Nothing is ported. The difference between LensVisualizer's sheared estimate and the comparator's
  estimator on the same rays is rung R6b, recorded and not gated: on one grid the two agree to about 5e-4 on the
  benchmark at f/8, and what the rung shows beyond that is the grid LensVisualizer stops at (below). R6a, the
  comparator's estimator on two engines' traces of the same rays, does not depend on any of it.
- **Class.** method.

### LensVisualizer's best focus is of a stop, of lines and of a grid cap

- **Where.** `resolveMtfFocus` in `src/optics/analysis/mtf/mtf.ts` and `findAxialBestFocus` in `mtfFocus.ts`: one
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
  station under V2 `focus.conjugates`, addressed by zoom station and focus keyframe (`finiteConjugates` in V1).
- **Effect.** A fisheye that documents a close-focus station has no conjugate LensVisualizer certifies for it. Its
  case at infinity focus exports on the reference line as before; the station does not.
- **Handled.** The exporter takes the object of a refocused state from `MtfSupport.conjugate` and from nothing
  else: such a station is `finite-conjugate-unavailable`, never exported with an object distance read from the
  lens file. The integration test of the focus stations asks the gate for each documented station, compares `lv`
  and `ref` at every one it certifies, holds every other to that refusal, and names it in its diagnostic. Seen
  first on a fisheye that was in LensVisualizer's working tree, not yet committed, at `b7deb221`.
- **Class.** data.

### A field can lie outside the model

- **Where.** `resolveMtfFieldTargets` in `src/optics/analysis/mtf/mtfFields.ts` resolves a fraction of the reference
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
  in `resolveVariableThickness` of `src/optics/state/stationTables.ts`). At the tele end `t` is 1, and
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

### LensVisualizer's launch lattice has more columns than the cells it is asked for

- **Where.** `mtfLaunchGrid` in `src/optics/analysis/mtf/mtfTracing.ts`: the step is of the beam,
  `max(beamWidth, beamHeight) / n`, and the lattice is laid over the whole scan window of the footprint, which is
  wider than the beam: `2 ceil(halfWidth / step)` columns.
- **Effect.** A lattice "at 64 cells" has 54 to 80 columns on the benchmark (72 for most fields), and one "at 32"
  half as many. `gridSize` in LensVisualizer's result is the n it asked for, never the columns.
- **Handled.** The engine `wave` states its `gridSize` as LensVisualizer does, the cells asked for; a ray set
  states the lattice as it is (`groups.lattice`), and the comparator of R6a reports those columns
  (`lattice.columns`). Never read one as the other. Measured at `33ebdb30`, closure `78215d72`.
- **Class.** convention.

### LensVisualizer stops refining a field where its own figure stops moving, and that is often 32 cells

- **Where.** `refineMtfField` in `src/optics/analysis/mtf/mtf.ts`: the grid of a field is the first of the ladder
  whose curves are within 0.01 of the grid before at the frequencies up to 50 cycles/mm
  (`MTF_CONVERGENCE_TOLERANCE`, `MTF_CONVERGENCE_BAND_LPMM`); its `maxDelta` is 1e-3 to 1e-2 where it stops.
- **Effect.** At f/8 that is 32 cells for 119 of the 144 fields of the benchmark. The diffraction estimate of such
  a field is that of a lattice of 32 cells, whose rim is a staircase. On the same 32 cells the comparator's wave
  estimator agrees with it to 4.5e-4 on average; at 64 cells the estimator itself has moved by 1e-3 to 8e-3, and
  R6b shows that difference, 2.9e-3 on average and 7.75e-3 at most.
- **Handled.** R6b is recorded, with bands of 0.005 and 0.01, and no pair is marked at f/8. The band on the axis
  is half of what LensVisualizer itself calls converged. A row near its band there is the difference of two
  lattices and no error of either method (`docs/REFERENCE.md`, "Rungs R6a and
  R6b"). To see the methods alone, run the rung with `sampling.bundleGrid: 16`, which puts the estimator on 32
  cells. Measured at `33ebdb30`, closure `78215d72`.
- **Class.** method (sampling).

## Any two engines

### A fast lens wide open is undersampled by any lattice a run can afford

- **Where.** The comparator's wave estimator (`src/estimators/waveOtf.ts`), on any engine's trace: the step of a
  wavefront from one cell of a lattice to the next is the transverse aberration times the step of the direction
  cosine, in waves.
- **Effect.** A lens at f/1.2 with a spot of 20 µm turns by a wave a cell at 32 cells across the beam and by half
  a wave at 64. On the benchmark `nikkor-z50f12` and `sony-fe-20mm-f18-g` have no field within a quarter wave a
  cell at 64 wide open, and the photopic lines of one lens reach 51 waves. Stopped down to f/8 every field is
  within 0.15 waves a cell.
- **Handled.** Such a field is flagged `undersampled`: its estimate may alias, R6a does not judge it and R6b puts
  it in no band. It would need 128 to 256 cells, sixteen to sixty-four times the rays; and there the transfer
  function is geometric to the accuracy that matters, which R4 holds on the lattice the run has. Never raise
  `QUARTER_WAVE`, and never judge a flagged field, to cover a lens.
- **Class.** numerical.

### A wave estimate on a lattice is good to about what it moves by on doubling, and the rim decides that

- **Where.** The same estimator: inside the pupil it is of second order in the cell; at the rim the pupil is the
  union of whole cells, a staircase, of first order.
- **Effect.** On the benchmark at f/8, where every lattice samples its wavefront, the wave MTF moves by 1e-3 to
  1.5e-2 from 32 cells to 64 (2e-3 to 5e-3 for most fields). That is common to every engine that traced the same
  rays and cancels in R6a, whose figures are a thousand times smaller. It does not cancel against another method.
- **Handled.** `CONVERGENCE_BANDS` are the bands of such a comparison, 0.005 on the axis and 0.01 off it, and a
  field that moves by more is flagged `not-converged`. The estimate of a converged field is still only within a
  band of its limit: it is an arbiter of a row that is far outside its band, and of none that is near it.
- **Class.** numerical.

### The gate of R6a is LensVisualizer's 1e-9 mm in the optical path

**History at `33ebdb30` (closure `78215d72`).** The 4e-5 gate below is superseded by Stage 3.12,
policy version 11: **2e-8**, ten times the measured 1.18e-9 rounded up to one digit, with **208 of 288**
benchmark fields judged. At LV `ab0fd4cf` (closure `94778d3d`, 175 files), `lv/ref` reaches 1.181e-9 and
`optiland/ref` 1.158e-9, while `lv/optiland` is within 1.560e-10. The bound now comes from the exact tracers'
agreement, the same scale as Stage 3.8's 1.15e-9, not LensVisualizer's rounding. The ref–optiland test holds
an absolute **2e-9**, including flagged fields. No floor is granted.

- **Where.** LensVisualizer meets a surface within 1e-9 mm of it ("A hit lies within 1e-9 mm of its surface",
  above), and the optical path carries that: 1.7e-6 of a wave at 590 nm for each surface it is off at.
- **Effect.** In a wave transfer function it shows as 1e-6 to 3e-6 of MTF (3.12e-6 at worst on the benchmark),
  where the two exact tracers agree to 1.15e-9.
- **Handled then.** R6a's gate, 4e-5, was ten times LensVisualizer's figure and so 35 000 times that of the exact
  tracers: it measures nothing of them, as R3's gate does not. A pair of `ref` and optiland near it would be a
  defect; whether the rung gets a floor, and the exact tracers a gate of their own, is the owner's. Measured at
  `33ebdb30`, closure `78215d72`, optiland `4e893f53`.
- **At `31c34396`**, where LensVisualizer meets a surface within 1e-12 mm, its largest figure over the same 208
  judged fields is 1.73e-9 against `ref` and 1.81e-9 against optiland, beside 1.17e-9 between the two: the gate is
  then 22 000 times LensVisualizer's figure too. It was not changed (Stage 3.10); a pin on that measurement would
  be 2e-8.
- **Class.** numerical.

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
  ray sets) before anything else is concluded. These are Stage 3.3 measurements at `33ebdb30`; policy version 11
  grants no floor on any rung. The Stage 3.12 measurements are in `docs/REFERENCE.md`.
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
- **Handled.** The builder gives every surface of a case that clips a `RadialAperture` of the case's clip radius,
  the stop surface like any other with the radius of the stop setting, and the image surface none. `verify_optic`
  reads each back and refuses an optic in which such a surface has none; `system.describe` echoes each as
  `clipRadius`, and R0 holds it to equality.
- **The one exception is the same rule, used on purpose.** A surface of the case that does not clip
  (`aperture.semiDiameter` null, contract minor 2: a rear plate whose rim LensVisualizer generated) is given no
  aperture at all, stated as `aperture=None`. That is optiland's own way of clipping nothing: a ray is stopped at
  no height, and a conic is met at its nearest admissible root, no aperture choosing between two
  (`_conic_intersection_distance` prefers a root inside the aperture when it is handed one). A
  `RadialAperture(r_max=inf)` was considered and is not the same thing: it is an aperture where the case has none,
  it still sets the intensity of a ray whose point is no number to 0 (`contains` is false for a NaN), and it is
  handed to the conic's root selection. `verify_optic` holds the surface to having none (`expected_aperture`), so
  a builder that put the plate's extent there as a rim is refused (`the class of its aperture is 'RadialAperture'
  in the optic optiland built and None in the case`), and one that left a clipping surface bare is refused the
  other way; a test makes each mistake on purpose (`test_build.py`). `system.describe` reads a surface without an
  aperture as `clipRadius` +Infinity and `innerClipRadius` 0, from the optic and not from the case. The surface
  keeps optiland's `semi_aperture` at the case's `nominalSemiDiameter`, which clips nothing: the heights of its
  sag are fractions of it.
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
  iteration starts there. On the eight lenses of the catalog where LensVisualizer loses rays at such a crossing
  (seven since the Vivitar's lens file was corrected),
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
  **Stage 5.3, LV `879c06102`, optiland `4e893f53`:** Russar full field has **120** mask disagreements,
  **88 at surface 1 and 32 at surface 9** (the metric's first ray names 9, not every ray's surface).
  Native optiland retains positive intensity on both spheres' wrong sheets: on ray 2 at surface 9 its local z is
  -22.3467147482 mm while its own sag is -22.1932012518 mm, a -0.1535134964 mm residual. The two roots of the
  quadric, recomputed in 60 digits from optiland's own incident points/directions, have negative sag-sheet factors
  `1 - (1 + K) z/R` on **every** disputed ray (largest factor -0.0003665271). Neither root is on the contracted
  sheet. LV and ref block these rays; optiland transmits 112 to the image and stops the other eight later at 5.
  The existing synthetic hemisphere test, `TraceTest.test_beyond_the_equator_of_a_hemisphere_optiland_passes_a_ray_on_the_far_side_of_the_sphere`,
  pins native fallback and transmission; it skips with `real_optiland_missing()`'s reason in the hermetic tier.
  Nothing is corrected or suppressed; both optiland pairs retain FAIL. See the [catalog evidence](catalog-attribution.json).
- **Class.** method.

### On an asphere optiland's iteration starts at the base conic, and goes where that leads

- **Where.** `NewtonRaphsonGeometry._solve_distance_primal` in `optiland/geometries/newton_raphson.py` starts
  Newton's method at the distance to the base conic and iterates on `sag(x, y) - z` until every ray of the batch is
  within the tolerance, or 100 times. Nothing restricts it to the clear aperture, and what it ends with is the
  answer.
- **Effect.** Three things, first measured on lenses of the catalog that are in no suite.
  **No start.** Where the line misses the base conic there is no start and no hit, whether or not the line meets
  the surface. A phone lens has surfaces whose polynomial undoes most of a steep base: surface 11 of
  `apple-iphone-12-main-wide` is a paraboloid that would be 1.1 mm deep at its rim and is 0.09 mm deep. optiland
  loses 3656 rays there over the 18 ray sets of that lens, and 2690 on surface 9 of
  `apple-iphone-7-wide-camera-lens`: 3576 and 2426 of them rays that `ref` and LensVisualizer land, 29 % and 20 %
  of the light of those sets.
  **Another crossing.** The polynomial of a surface, fitted to its clear aperture, turns back beyond the rim and
  may cross the line again there. From the base conic the iteration can reach that crossing first: on surface 2 of
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
  At LV `ab0fd4cf` (closure `94778d3d`, 175 files) and optiland `4e893f53`, the close-focus station 6 of
  `olympus-mzuiko-digital-ed-17mm-f12-pro` has two more such failures: rays 10 and 29 of request
  `5e3fdbd2d6f2d522e63c7f8c887671763f7e8cc8ce7cfa48d3474cbe15efbf8a`, both at surface 20 (indices are zero-based),
  an even asphere. Re-tracing the full batch, optiland stops ray 10 with intensity 0 at a point 0.125496 mm off
  its own surface along the normal; ray 29 has no hit (NaN coordinates and intensity 0). LV and `ref` both block
  each ray at that same surface, so no light is at stake. This focus-station case is outside the two suites:
  the measured fact above, "in the two suites optiland fails no ray", still stands. `assertR2` keeps LV and
  `ref` at zero failures; an optiland failure is allowed only on an asphere where both block that very ray at
  that same surface, with every such ray named in a diagnostic. The exception changes no pair verdict, mask
  check or gate; policy version 11 grants no floors.
  **Stage 5.3, LV `879c06102`, optiland `4e893f53`:** the current XF 8–16 wide and Nikon Z DX 16–50 wide
  each disagree only at full field, **28 and 57 rays at surface 2**, on curved-base aspheres. Native optiland's
  own converged iterates are genuine crossings beyond its aperture, with intensity zero. XF ray 1140 reaches
  radius 24.8911964379 mm against 21.800000001 mm clear radius; LV/ref's crossing is at 20.8095226892 mm.
  Nikon ray 108 reaches 23.0360049723 mm against 9.500000001 mm; LV/ref's is at 9.3724453987 mm.
  All 85 native points/iterations were read, with the batch kept intact. Their alternative LV/ref hits have
  60-digit sag residuals below 1e-8 mm; additionally, the full independent trace settled with ref on all 57 Nikon
  rays. The synthetic pin `TraceTest.test_an_asphere_seed_can_converge_beyond_the_rim_despite_an_in_aperture_crossing`
  derives two crossings analytically and checks optiland's actual outer hit and aperture stop. Its base is a plane,
  not a curved conic: it pins the mechanism (a seed from the base that converges on the crossing beyond the rim),
  not the catalog surfaces' seeds, which only the native reading above shows.
  The current XF 27 full field has **four** disagreements at surface 7, rays 51/55/60/84: all four native
  primal solves exhaust 100 iterations, `converged=false`, yet retain intensity 1 at radii 4.7762–4.9674 mm
  inside the 5.060000001 mm aperture. Absolute residuals against optiland's own sag are 0.396400–1.318095 mm.
  Native optiland lands three and stops one later at 8; LV/ref block all four at 7.
  **Newly measured Ricoh GR1:** full-field rays 830/869 exhaust 100 iterations at surface 0 with residuals
  5.1217701445 / 7.9907958728 mm, retaining intensity 1 inside its 6.500000001 mm aperture. It lands 830 and
  blocks 869 at 11; LV/ref block both at 0. The independent 60-digit trace also blocks both at 0.
  This is the same unverified final-iterate mechanism, not a rim rounding or an unsupported asphere. The new
  synthetic pin `TraceTest.test_an_unconverged_asphere_iterate_is_kept_and_can_transmit_a_ray_where_no_surface_is_met`
  uses Newton's 1 ↔ 0 cycle for `y^3 - 2y + 2`, proves no crossing within the aperture, and checks native
  100-step nonconvergence, positive intensity and the worker's retained landing. Both new pins skip with
  `real_optiland_missing()`'s reason without the real engine. The existing fabricated-row settle test
  also holds the policy that a live native ray is kept, even off the sag; no adapter filters these rays out.
  Full vertex-plane Decimal Newton does not settle on XF 27 and starts outside the valid sag domain on XF 8–16;
  those attempts are not used as confirmations. Attribution there rests on the native residual/root evidence,
  the common LV/ref mask and the analytic synthetic pins. Commands and all original row addresses are in
  [REFERENCE](REFERENCE.md#stage-53-catalog-fail-attribution) and [the evidence ledger](catalog-attribution.json).
  **For the owner.** As for LensVisualizer's crossing loss, the class names the origin, not an acceptable answer:
  a ray carried on from an iterate 0.4 to 8 mm off optiland's own surface, with `converged=false`, is optiland's
  behaviour to report upstream if the owner chooses; nothing is filed.
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

### optiland's FFT MTF is of one wavelength and gives a modulus: no polychromatic MTF is formed of it

- **Where.** `optiland/mtf/base.py` resolves one wavelength (`resolve_wavelength`), and `ScalarFFTMTF` keeps
  `abs(fft2(psf))`, each field's PSF centred by its own reference: the chief ray of that wavelength.
- **Effect.** A polychromatic MTF is the modulus of a weighted sum of the lines' complex transfer functions about
  one image point. Of the lines' moduli it cannot be formed: the lateral colour (each line's chief ray lands
  elsewhere) and every phase between the lines are lost, and a mean of moduli is an upper bound that is no MTF:
  two lines whose transfer functions have opposite signs at a frequency add up to their difference.
- **Handled.** `mtf.native` of `optiland` is of one line: a case of several lines is `unsupported`
  (`lines.polychromatic`) unless the engine option `line` names one, and the answer's `lines` holds that line
  alone. A test asks a case of two lines for its second and finds the answer of that line as a case of its own.
  The reference-line runs of the benchmark are answered as they are; the external counterpart of a photopic MTF
  is Stage 4.3, by the comparator's estimator on optiland's wavefront.
- **Class.** none of the ladder's: a limit of the method.

### One field optiland cannot compute raises for every field of the call

- **Where.** `BaseMTF.__init__` computes the PSF and the MTF of every field before it returns, and
  `ScalarFFTMTF.__init__` then asks `get_working_FNO` for each: a field whose four rim rays all fail raises
  `ValueError("Working F/# could not be calculated due to raytrace errors.")`, a field without a valid sample
  `ValueError("No valid ray samples found for chief-ray wavefront.")`.
- **Effect.** Asked for the axis and one such field at once, optiland gives neither.
- **Handled.** The worker asks one field a call, on an optic of its own, and an exception is that field's row:
  `unavailable`, with the class of the exception in its reason and optiland's words in a note. A test asks three
  fields with the middle one failing and finds the other two as they are alone, and asks optiland itself for two
  at once and is raised at. On the Nikkor Z 50 mm f/1.2 wide open the fields at 18° and 23° are such rows.
- **Class.** none of the ladder's.

### `num_rays` is OpticStudio's sampling number unless a grid size is stated

- **Where.** `ScalarFFTMTF.__init__`: without `grid_size` it calls `calculate_grid_size(num_rays)`
  (`optiland/psf/fft.py`), which puts `floor(32 * 2^((log2(num_rays) - 5) / 2))` rays across the pupil on a grid
  of `2 * num_rays`: 64 rays for 128, 90 for 256.
- **Effect.** A ladder of 128 and 256 asked that way is one of 64 and 90 rays.
- **Handled.** The worker states `grid_size = 2 * num_rays`, so `num_rays` is the rays across the pupil and the
  `num_rays` samples optiland gives end at the cut-off, and reads both numbers back from the analysis
  (`build-mismatch` otherwise). A test pins optiland's 64 on 256 and makes the mistake on purpose.
- **Class.** convention.

### optiland's positive field angle is an object toward -y, and its own rays fill the stop's clip radius

- **Where.** `AngleField.get_ray_origins` launches a field at `y` degrees from below the axis, toward +y; the
  contract's positive angle is an object toward +y. With `ray_tracer.set_aiming("robust")` a pupil coordinate of
  1 is a point at `aperture.r_max` of the stop surface (`FloatByStopStrategy`); without aiming it is a point of
  the paraxial entrance pupil, which the real beam of a fast lens does not fill (on the Nikkor Z 50 mm f/1.2 the
  rays through its rim are clipped at the stop, and `get_working_FNO` gives 1.185 where the stop's is 1.229).
- **Effect.** The optic of an MTF is the contract's system mirrored in y: the same MTF, and the chief ray's
  landing with the other sign. The pupil of optiland's own analyses is the clip radius of the stop, which for a
  case from LensVisualizer is the stop radius plus 1e-9 mm and in the Double-Gauss fixture 6.35 mm against a stop
  radius of 6.3412 mm.
- **Handled.** The worker gives optiland the angle as it is, reports the distance of the landing from the axis,
  and holds the launch direction of the chief ray to (0, sin, cos) of the angle; it sets the plan's aiming
  (`robust`, 50 iterations, 1e-10 mm) and reads back the radius the aimer takes. Tests hold the chief ray's
  landing and the frequency axis to rays through the centre and the rim of the stop traced in 60 digits, and
  find optiland's unaimed f-number of the Double-Gauss to be another.
- **Class.** convention.

### optiland calibrates its frequency axes with four rim rays, whatever became of them

- **Where.** `ScalarFFTMTF._get_mtf_frequency_steps` traces the rays at pupil (0, ±1) and (±1, 0) and takes the
  difference of each pair's directions, on the image surface, for the width of the pupil: the lag of one ray is
  that over `(num_rays - 1) * wavelength`. It does not read their intensity. A ray that an aperture stopped is
  traced on through the mathematical surfaces.
- **Effect.** Where the rim rays pass, or are stopped and stay near the beam, the axis is the beam's: on the
  Double-Gauss at 14° all four are stopped, land within 0.06 mm of the chief ray, and the field has its curves.
  Where a stopped ray leaves the lens the axis is that ray's: on the Nikkor Z 50 mm f/1.2 at 12° one lands 5 mm
  from the chief ray and the tangential lag is 6.14 cycles/mm beside a sagittal one of 5.33 (5.43 on the axis);
  on the Sony FE 20 mm f/1.8 at 47° one lands 19 mm away and the tangential lag is twice the sagittal. A rim ray
  that has no direction leaves a NaN in its lag.
- **Handled.** Nothing is corrected: the curves are optiland's. Each field states `rimRaysLit`, `rimRaysLost`
  and `rimLandingSpreadMm` under `sampling`, and an axis with a NaN is the status `no-frequency-axis`. The
  check of the tangential lag on this vignetted pupil is delivered in [Stage 4.2](z50f12-investigation.md):
  the settled best-focus half-field offset is class method, from the stop-grid/full-rim affine calibration;
  the design-plane sampling flag and full-field unavailability remain. Original measurement at optiland
  `4e893f53` on cases of LensVisualizer `33ebdb30`; Stage 4.2 remeasures at `ab0fd4cf`.
- **Class.** engine behaviour: recorded.

### A rim ray that was stopped and left the lens is counted by optiland's worker as neither lit nor lost

- **Where.** `FieldProbe` of `workers/python/lvrtc_optiland/mtf.py`: `rimRaysLost` counts the rim rays that have no
  landing or no direction, `rimRaysLit` those with an intensity above 0. A rim ray that an aperture stopped and
  that optiland traced on through the mathematical surfaces has a landing, a direction and no light.
- **Effect.** `rimRaysLost` above 0 means an axis that is a NaN, and such a field has no curve: on the benchmark
  all 10 fields with a lost rim ray are `unavailable`. The fields whose axis is a stopped ray's are not among
  them: full field of the Nikon Z 24-70 mm f/4 at its tele end (a rim ray 6.6 mm from the chief ray, and 0.31
  between LensVisualizer's tangential MTF and optiland's at 50 cycles/mm) and half field of the Z 50 mm f/1.2
  (5 mm, 0.07 to 0.10). A rim ray that is not lit says nothing by itself either: 96 of 134 fields with curves
  have fewer than four lit, most of them at f/8 and inside every band, since a ray aimed at the rim of the stop
  is clipped there by a rounding.
- **Handled.** Rung R5 keeps a field with `rimRaysLost` above 0 out of its bands (`rim-rays-lost`), which on the
  benchmark sets nothing aside, and shows `rimLandingSpreadMm` in the table of the fields beside every row. The
  fields above stand as `ATTENTION`, class `method`. A limit on the distance of a rim ray from the chief ray
  would tell them; none is pinned. [Stage 4.2](z50f12-investigation.md) measures the Z 50/1.2's pitches
  and attributes its settled best-focus half-field difference to method, without introducing such a limit.
  Original measurement at optiland `4e893f53` on cases of LensVisualizer `33ebdb30`.
- **Class.** method.

### A fraction of an image height is no field of optiland

- **Where.** `mtf.read_request`: optiland's fields are angles, and a case states no image height.
- **Effect.** A request that states its fields as fractions cannot be resolved by optiland, and a second request
  by angles would be another comparison than LensVisualizer's.
- **Handled.** Rung R5 hands optiland the angle the run's recipe resolved each fraction to, as the engine option
  `fieldAnglesDeg`, one for each field in their order; the answer names a field by its fraction and states the
  angle it computed with. Without the option such a spec is `unsupported` (`fields.image-height-fractions`), and
  an option that is not one finite angle a field is `option.fieldAnglesDeg`. For a spec of angles the option is
  not read. The landing of each engine's own chief ray is then held to the other's before any row
  (`chiefLanding.maxAbs`, 1e-7 mm).
- **Class.** convention.

### optiland's FFT takes a grid that is even on the stop for one that is even in direction cosines

- **Where.** `ScalarFFTPSF._generate_pupils` lays the wavefront on `linspace(-1, 1, num_rays)` in both normalised
  pupil coordinates and transforms that array as it is; `ScalarFFTMTF._get_mtf_frequency_steps` gives a lag of one
  cell one frequency, the rim rays' width over `num_rays - 1`, and says of itself that it "assumes approximately
  affine pupil-to-cosine mapping". With the worker's aiming a pupil coordinate is a point of the stop surface.
- **Effect.** The cut-off is the rim rays' and is right (held to a 60-digit marginal ray within 1e-7). Between 0
  and the cut-off a lag is a frequency only as far as a step on the stop is the same step in the direction cosine
  behind the lens everywhere on the pupil: true of a slow lens, and not of a fast one wide open, whose pupil
  aberration and sine condition bend that mapping, nor of a field whose pupil is cut by vignetting on one side.
  A wave OTF summed over the cosines themselves (the comparator's estimator, `docs/REFERENCE.md`) has no such
  assumption. The difference is of the method, not of the sampling: more rays do not remove it.
- **Handled.** Nothing is corrected: the curves are optiland's, and `method.params.pupil` says
  `stop-surface-grid`. Not measured in Stage 3.6; R5 (Stage 3.7) records the differences and R6c (Stage 4.1)
  sets the comparator's estimator on optiland's wavefront beside them.
- **Class.** method.

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
  warning in a log. Every other quantity than `system.describe`, `paraxial.first-order`, `rays.trace` and
  `mtf.native` is `unsupported` until its stage. Of the 1173 cases of the catalog on the reference line optiland has first-order
  data of every one.
- **Class.** none of the ladder's.

### optiland's geometric MTF multiplies in a diffraction limit unless it is told not to

- **Where.** `GeometricMTF.__init__` (`optiland/mtf/geometric.py`) has `scale=True`, and `_generate_mtf_data` then
  multiplies every curve by `(2/π)(φ − cos φ sin φ)`, `cos φ = ν / ν_c`: the MTF of a circular pupil without
  aberration, with the cut-off of the paraxial f-number, `ν_c = 1 / (λ · optic.paraxial.FNO())`.
- **Effect.** Asked without its options the class gives no geometric MTF but an estimate of a diffraction MTF: on
  the Double-Gauss, f/5 at the d line, the cut-off is 340 cycles/mm and a value at 50 cycles/mm is lowered to 0.81
  of itself.
- **Handled.** The worker states `scale=False` and reads back the flag and the factor the class says it multiplied
  by, `diff_limited_mtf` (`build-mismatch` otherwise). A test holds optiland's scaled curve to the unscaled one
  times the closed form, and makes the mistake on purpose.
- **Class.** convention.

### optiland's geometric MTF bins the landings, about no point, and counts every lit ray once

- **Where.** `GeometricMTF._compute_field_data`: `histogram(xi, bins=num_points + 1)` over the landings of one
  axis as the spot diagram recorded them, in the image surface's own coordinates, then the modulus of the sum of
  `count × exp(2πi ν centre)` over the bins, over the number of rays. `_center_spots`, which the spot diagram has
  for its radii, is not called; the intensity is read once, to leave out the rays that have none
  (`SpotDiagram._generate_field_data`). The frequencies are `linspace(0, max_freq, num_points)`: stated, in
  cycles/mm, with no rim ray traced for them.
- **Effect.** Nothing of the FFT's frequency axes applies, neither the rim rays that calibrate them nor the grid
  taken for one that is even in direction cosines: a field whose rim rays are all stopped has the same axis as
  any other. The bins are as many as the samples of the
  frequency axis, plus one, whatever the frequencies asked: a ray counts at the centre of its bin, which lowers a
  value by about `sin(πνw) / (πνw)` for bins of width w and tells nothing above `1 / (2w)`. A spot none of whose
  rays arrives is a curve of NaN, and nothing is raised. The modulus is of bins laid from the least landing to the
  greatest, so it knows no reference point, and no phase is kept.
- **Handled.** The worker asks for 2048 samples, which is 2049 bins, and sums the same landings without bins: a
  field one of whose values of optiland lies further from that sum than its band has no curves
  (`frequency-beyond-bins`), and `binningMaxDelta` states the distance for every field. On the Double-Gauss it is
  3e-6 on the axis, 2e-5 at 10° and 3e-5 at 14°, where the spot is 0.12 mm wide. An empty spot is `no-rays`. Tests
  write the class's sum out from its landings, move every landing by 3 mm and find the same modulus, hold the
  distance to the bound `2 sin(πνw / 2)` plus what the interpolation allows, and with nine bins find a field
  without curves.
- **Class.** method: recorded.

### `num_rays` of optiland's geometric MTF is rays across a grid that is even on the stop

- **Where.** `GeometricMTF.__init__` hands `num_rays` to `SpotDiagram` as its `num_rings`, with the distribution
  `"uniform"`: `UniformDistribution.generate_points` takes the points of `linspace(-1, 1, num_rays)` in both
  normalised pupil coordinates within the unit circle, 51040 for 256, and `optic.trace` launches them in one
  batch through the optic's aimer. With the worker's aiming a pupil coordinate is a point of the stop surface.
- **Effect.** Each ray stands for an equal area of the stop, and an aperture elsewhere removes rays: the spot of a
  vignetted field is that of the rays that arrive, with no rim ray deciding anything. A lattice that is even
  across the beam in front of the lens, as LensVisualizer's is, weights the same pupil by the distortion between
  the two: on the Double-Gauss on the axis the ray through the stop at the fraction p of its radius enters at
  10.015 p mm near the axis and at 10.024 p mm at the rim, a part in a thousand; a fast lens wide open has more.
  More rays do not remove that difference. Unlike the FFT the class assumes nothing of where a pupil point lies in
  direction cosines: a landing is a landing.
- **Handled.** Nothing is corrected: the rays are optiland's, and `method.params.pupil` says `stop-surface-grid`.
  The ladder is 128 and then 256 rays across, 512 by the engine option `geometricRays`: on the Double-Gauss the
  largest move of a value at 10, 30 or 50 cycles/mm is 0.0009 on the axis and 0.0013 at 14° from 128 to 256, and
  0.0004 from 256 to 512. A field takes 0.45 s at the first ladder and 0.95 s at the second, a line; a step of
  512 rays adds 0.8 GB to the worker's peak memory on that lens of 11 surfaces, as the FFT's does. Measured at
  optiland `4e893f53`.
- **Class.** method: recorded.

### optiland's geometric MTF is of one wavelength, and a spectrum is summed from its landings

- **Where.** `GeometricMTF.__init__` resolves one wavelength and `_generate_mtf_data` reads `field_data[0]`, with
  the note `TODO: add option for polychromatic MTF`. What it keeps is the modulus, of bins about no stated point.
- **Effect.** As for the FFT, no MTF of a spectrum can be read from the class's curves. Unlike the FFT's, its rays
  can form one: a landing is a point of the image plane, the same plane for every line.
- **Handled.** A case of several lines is answered by the worker's sum of optiland's own landings, each line on
  an optic of its own: the lines' sums of `w exp(−2πi ν u)` about the axis point of the image plane, added with
  the weights of the case as complex numbers and divided by the weighted flux, then the modulus
  (`geometric.sum_curves`; the comparator's `polychromaticOtf`). The sum has no bins, and the answer says whose it
  is: `method.name` is `spot-landings-sum`, and `geometric-mtf` only for one line, the case's only one or the one
  the engine option `line` names, whose curve is optiland's own. Every answer states how far optiland's own curve
  of a line lies from that line's sum. Lost: nothing of the lateral colour; the worker's sum is not a number of
  optiland's. A test sets two lines 14 micrometres apart behind a stop of half a micrometre and finds the closed
  form of two points, with the distance from chief rays traced in 60 digits.
- **Class.** method: recorded.

### optiland's geometric MTF of a fast lens wide open takes minutes at full field

- **Where.** `GeometricMTF` traces its grid through `optic.trace` with the aiming the worker states (`robust`, 50
  iterations, 1e-10 mm), all rays of a line in one batch.
- **Effect.** What a field costs depends on the lens and the field, by a factor of fifty. Measured on the
  benchmark at optiland `4e893f53` on this machine, a field and line on the ladder of 128 and 256 rays: about a
  second for most lenses and fields, 19 s at full field of the Z 50 mm f/1.2 wide open and 56 s at full field of
  the Sigma 35 mm f/1.4 wide open; on the five photopic lines those two fields take 87 s and 359 s. On the
  ladder of 256 and 512 rays three fields of the Sigma on one line took 405 s. At f/8 no field of the benchmark
  takes more than a few seconds. Where the time goes inside optiland was not measured.
- **Handled.** Two limits bound a request: the worker answers `time-budget` when a request has taken 300 s as
  its next field is begun, and the comparator ends a worker that has not answered in ten minutes and starts no
  other within a run. Rung R5g therefore asks one request a field (`geometricFieldMtfSpecs`), so that one field's
  cost is one request's, and asks the finer ladder only for a field on one line that is outside its band
  (`followUpsOf`). The slowest request of the benchmark, 359 s, is within a factor of 1.7 of the ten minutes: a
  slower machine, or a faster lens added to a suite, can pass it, and every job of optiland after it in that run
  is then an error.
- **Class.** method: recorded.

### A ray that ends at the last surface stays in optiland's spot, without a landing

- **Where.** `SpotDiagram._generate_field_data` leaves out the rays whose intensity on the image surface is 0. A
  ray totally reflected at a surface, or one that misses it, has no number from there on and loses its intensity
  at the next aperture test. Behind the last surface of a case there is none: the image surface has no aperture.
- **Effect.** Such a ray is counted into the spot with a landing of NaN, and `numpy.histogram` raises a
  `ValueError` for a range that is not finite: the geometric MTF of that field is not computed at all, whatever
  the other rays would give. Measured on glass of index 1.5 that ends in a sphere of radius 6 mm concave toward
  the image, where a ray along the axis is totally reflected beyond the height of 4 mm (`1.5 h / 6 > 1`): 84 of the
  172 rays of a grid of 16 across a stop of 5.5 mm.
- **Handled.** Nothing is removed from optiland's spot: the field is `unavailable` with the reason
  `optiland-raised-ValueError`, for one line and for several, and the note has optiland's message. A test pins it.
  No such field is known in the suites, which this half did not run.
- **Class.** method: recorded.

### Wavefront.get_data returns a compact reference-sphere wavefront, with the opposite sign to a path

- **Where.** `optiland/wavefront/wavefront.py` resolves fields and wavelengths to objects and `get_data` indexes
  `data[(field.coord, wavelength.value)]`. `ChiefRayStrategy` returns intersections with its chief-ray reference
  sphere, not positions on an even exit-pupil plane. OPD is `(opd_ref - opd) / (wavelength_um * 1e-3)`, in vacuum
  waves; intensity is the image row of its trace. The reference radius is the chief landing's distance to
  `exit_pupil_point_gcs()`, and its image index is read from the image surface at the primary line.
- **Effect.** OPD must be negated to use the comparator's path convention. The normalized stop grid is not a grid
  of these sphere coordinates or image-side optical cosines. A non-air image medium affects the sphere path as
  well as the optical cosines. An exit pupil's axial zero can be rounded by its paraxial computation.
- **Handled.** `wavefront.native` v1 preserves the raw sign, units, sphere points, center, radius and exit pupil.
  Its consumer `wavefrontOtf` states the reference-sphere model it uses: radial directions, n times transverse
  components, W=-lambda OPD, intensity as midpoint-cell flux. It claims no aberrated exit direction. The pure
  estimator calls the unchanged Hopkins kernel; all such differences remain recorded. `test_wavefront.py`,
  `test_opd_sign_units_and_sphere_coordinates_from_an_exact_refracting_surface`, derives a one-surface case in
  60-digit arithmetic: n=3/2, R=30 mm, paraxial focus 90 mm, stop/exit pupil z=0, ray-sphere intersections and
  signed OPD. Read-back fault tests change the image index, pupil, strategy, radius, chief plane and data keys.
- **Class.** convention (raw sign and units); method (the consumer's reference-sphere pupil model).

### Wavefront respects a supplied distribution; uniform includes the rim

- **Where.** `Wavefront._resolve_distribution` generates points only for a string distribution; a supplied
  `BaseDistribution` is returned as given. `UniformDistribution` uses linspace endpoints -1 and 1 and removes
  points outside the circle. `Wavefront.get_data` retains the compact order, with no square-grid indices.
- **Effect.** Asking for uniform points would put rays on the stop edge, where a rounding can clip them, and
  reshaping the compact result would put rays in the wrong cells. Changing num_rays cannot regenerate a supplied
  distribution. The FFT's own `_generate_pupils` has its own grid bookkeeping, which this operation does not use.
- **Handled.** The new worker supplies midpoint coordinates `(2 column + 1)/n - 1`, `(2 row + 1)/n - 1`, for even n,
  tracing only centers with radius strictly below one. Every returned row is scattered to its original square
  cell. The analysis's num_rays, both distribution coordinate arrays, their order and every result length are
  read back. `test_midpoints_strictly_inside_edge_and_row_major` proves the coordinates; real fresh-optic and
  deliberate-distribution-fault tests pin their use by Wavefront. The chief launch is checked on a separate
  fresh optic, without any rim trace, so a lost calibration ray cannot withhold a raw wavefront.
- **Class.** convention.

### Chief-ray wavefront zero-fills a nonfinite sample, including its intensity

- **Where.** `ChiefRayStrategy.compute_wavefront_data` forms a finite mask of OPD, all three pupil coordinates and
  intensity and writes zero to all five arrays outside it. It raises ValueError when no finite sample exists.
  A finite sample with intensity zero is not removed from the compact result.
- **Effect.** A zero OPD or a finite point does not say that a sample carries light. One bad field raises before
  a multi-field Wavefront construction returns any field.
- **Handled.** The worker calls one line/field/grid on each fresh optic, retains intensity and derives validity
  only from finite positive-intensity samples. Outside-circle square cells are zero and dark. A failed field
  has no samples and a reason; later fields continue. BuildMismatch, MemoryError and ImportError stay FATAL;
  REQUEST_BUDGET_S is checked between fields. A nonfinite reference sphere is likewise unavailable, not a build
  mismatch (`test_nonfinite_reference_is_an_unavailable_field_not_a_build_failure`).
  `test_get_data_zero_fills_a_nonfinite_sample_including_its_intensity`
  deliberately makes one traced coordinate nonfinite and pins the raw zeros. The real 0/14/40-degree fixture
  test pins one field's failure and the other's stable values. Stand-ins pin FATAL dispatch and the time budget.
- **Class.** unsupported where the field has no samples; numerical where a derived lattice is flagged.

### Chief-ray wavefront restores the phase at oblique infinite-conjugate launch planes

- **Where.** `ReferenceStrategy._restore_launch_phase` adds the object index times `d dot (origin - chief_origin)`
  to each ray's path for an AngleField at infinity, from retained launch states, before OPD is formed. It does
  not apply that correction to a finite object.
- **Effect.** Off-axis OPD is not obtained by subtracting the raw accumulated paths alone. Restoring this phase
  is part of optiland's own wavefront; the new operation must not add the correction again or fit tilt away.
- **Handled.** No phase is reconstructed by the worker. It reads get_data and retains `remove_tilt=False`.
  `test_raw_wavefront_restores_oblique_infinite_launch_phase` supplies synthetic retained states to the real
  strategy and derives the 0.3 mm phase addition from 0.6 times 0.5 mm. The OPD sign/unit test separately pins
  what get_data returns. Finite objects remain unsupported by this operation, as by the worker's native FFT.
- **Class.** convention.

### A finer vignetted FFT pupil keeps the full-rim affine calibration

- **Where.** optiland `ScalarFFTMTF._get_mtf_frequency_steps`, beside the endpoint stop grid
  of `ScalarFFTPSF._generate_pupils`; Stage 4.2 at optiland `4e893f53`, LV `ab0fd4cf`, closure `94778d3d`.
- **Effect.** On `nikkor-z50f12` at half field the tangential steps at 128/256/512 rays are
  12.270777 / 6.111328 / 3.049684 cycles/mm: the same 1558.3886945 cycles/mm full-rim bandwidth.
  All four rim rays carry no light, and one lands 4.990835 mm from the chief ray. At best focus
  T at 100 cycles/mm stays 0.301839 → 0.301717 (FFT 256→512), beside 0.203097 from LV's product,
  0.202370 from LV's own sheared estimate at 256 cells, 0.202284 from wave at 256, and 0.204518
  from the comparator's OTF of optiland's raw wavefront at 512. The four methods' last T moves are
  much smaller than that difference. A clipped mask alone is not a reason to shrink a frequency
  step: on an affine map the coordinate pitch stays the full grid's pitch, regardless of the mask.
  Here the transmitted pupil-to-cosine map is not affine; doubling the grid does not change that assumption.
- **Handled.** The [evidence note](z50f12-investigation.md) retains all frequencies, both cuts, all four
  conditions, flags, actual pupil extents and fixed-grid LV checks. No frequency scale is corrected and
  policy 12 is unchanged. The [upstream draft](upstream/optiland-vignetted-pupil-frequency-calibration.md)
  is a question about the method's supported domain. Pin: `CalibrationTest` in
  `workers/python/tests/optiland/test_pupil_diagnostic.py` calls the real calibrator on synthetic nonlinear
  cosine states with a clipped mask; its full-rim bandwidth is unchanged on doubling even though its
  central pitch differs. The fixture test also reads the real FFT's clipped mask and halved stop step.
  `test/integration/lv/z50f12.test.ts` holds the bound fixed-grid sheared call to LV's product at its chosen grid.
- **Class.** method, for the settled best-focus half-field offset. Unsupported full-field FFT and numerical
  design-plane / undersampled wave fields keep those earlier classes; the attribution does not erase them.

### A raw chief-centred wavefront needs its chief phase restored before a spectral sum

- **Where.** `wavefront.native` returns one optiland `Wavefront.get_data` line at a time, each about that line's
  own chief landing on the case plane. Its OPD retains tilt but does not carry the displacement of that origin
  from another line's chief. The worker remains one line per call.
- **Effect.** Adding those chief-centred OTFs directly loses lateral colour. For the synthetic two-line tilted
  square-pupil example the un-re-referenced sum differs from the declared analytic modulus by more than 0.1.
  Removing the line weights or transmitted flux also changes the modulus by more than 0.05 in that example.
  No combination of optiland's FFT moduli supplies the missing phase.
- **Handled.** `polychromaticWavefrontOtf` evaluates every raw line at the same requested frequencies, restores
  exp(-2 pi i nu (chief_l-chief_0)), weights by case weight times transmitted cell flux, and adds compensated
  complex numbers before the modulus. Line 0 is the case's reference line, and its chief landing is the common
  origin. Both pupil and chief coordinates retain optiland's declared mirrored-y frame; no extra reflection is
  applied. Every raw request is checked against that line's image index and the unchanged case plane. A missing
  line makes the field unavailable and names the line. The existing single-line operation stays unchanged.
  Pins: `test/estimators/polychromaticWavefrontOtf.test.ts` derives square and circular-pupil sums with rounding
  and rim bounds and negative controls; `test/engines/optiland/wavefrontEngine.test.ts` checks one call per line,
  mismatched line/index/plane replies and unavailable-line propagation; `test/integration/optiland/wavefront.test.ts`
  exercises the real worker and retains the FFT's several-line unsupported answer.
- **Class.** convention. The synthetic proof checks the declared sum; it does not identify historical spectral
  weights or remove differences between a reference-sphere pupil and traced exit directions. Policy 13 expands
  R6c to these rows and adds the owner's several-line chief-landing limit below; classes and 0.005/0.01 MTF bands
  do not change.

### Photopic chief heights identify a field, not one shared ray

- **Where.** The two Stage 4.3 best-photopic configurations at LV `ab0fd4cf`, optiland `4e893f53`.
  LV reuses one chief launch across lines, solved at the d line without a wavelength. At 555 nm (line 0 of the
  photopic spectrum) it misses the stop centre by the chromatic pupil shift; optiland-wave states optiland's
  line-0 chief aimed through the stop centre at 555 nm. The two `imageHeightMm` describe different rays:
  [the R5g measurement](#the-chief-ray-of-an-mtf-field-is-one-launch-for-every-line) reaches 3.0e-4 mm on the
  benchmark. `lv` and `wave` state the landing of the same LV launch.
- **Effect.** Canon half/full-field LV versus raw chief heights differ by 1.142272e-6 / 5.719029e-6 mm;
  Nikon by 1.067035e-6 / 2.493505e-6 mm. These exceed the one-line limit of 1e-7 mm, although the answers
  describe the same field. A common reference point multiplies the complete spectral sum by one phase and
  leaves its modulus unchanged; these chief offsets are only a sorting check, not an input of the curves.
- **Handled.** The owner's 2026-10-22 decision gives R6c two policy limits: `chiefLanding.maxAbs.attention`
  remains 1e-7 mm for two one-line answers; `attentionSeveralLines: 1e-3` mm applies when either answer records
  several lines. The case alone never selects it. R5 stays at 1e-7 mm and R5g keeps its single 1e-3 mm limit.
  Each answer records the chosen `chiefLandingLimitMm` with its wavelengths; comparator and report facts
  reproduce the same sorting, including baseline reports and peers. A linted wording template names the
  several-line limit in the report. Canon's off-axis LV/raw fields now enter the method band; Nikon half field
  enters it and full field is numerical / unconverged, shown apart in no band. Detailed re-measurements,
  differences, flags and reproduction commands are in
  [REFERENCE.md](REFERENCE.md#stage-43-photopic-complex-wavefront-sum-two-configurations).
  Hermetic synthetic cases in `test/report/r6c.test.ts` cover 5e-6 mm on one/several lines and beyond 1e-3 mm,
  including report sorting from recorded values.
- **Class.** convention. Never read two engines' several-line chief heights as the landing of one ray.

## Folded systems (Stage 5.2a)

- LV **mixed-reference is a data issue**. `samyang-af-35mm-f2p8-fe` mixes d- and e-referenced glasses without
  wavelength data for every glass. Its reference line cannot be translated as one physically coherent index
  table. Preserve LV's `mixed-reference` refusal; do not relabel either reference or invent dispersion.
- LV auto paths (`carl-zeiss-mirotar-500f45`, `minolta-250mm-f56-rf`, `vivitar-s1-450-f45`, the annular ring blocker
  and Cassegrain reference) select candidate hits per ray. Contract 1.4 supports fixed lists only:
  `folded-auto-path`. Newtonian also has an auto path plus tilted/off-axis geometry; the folded diffractive plate
  retains diffraction and tilted/off-axis exclusions. These are source refusals, not passing traces.
- LV 2e046d71 generalized tracing does not record OPL, even when `recordOpticalPath` is requested. The source
  explicitly calls that option sequential-only until phase-aware validation. V2's geometry can be returned with
  `lv-folded-optical-path-unavailable`; the R3 pair is UNSUPPORTED. The adapter does not sum LV hits to invent
  an OPL.
- LV 2e046d71 **omits passive visits from its hit history** (a transparent hole, an inactive side it ignores, a
  blocker outside its band: `passiveClipReason` returns null and the loop continues), but under `recordHeights`
  pushes a height for every visit whose intersection it found, before deciding whether it is passive. On
  `reference-annular-obscured-mirror` an axial ray at 10 mm records hits on STO and M1 only, with three heights.
  The adapter places each recorded hit on the one declared step whose kept height equals LV's
  `projectCoordinateToZ` of that hit with its incident direction, bit for bit, and answers the remaining
  steps as v2 `unrecordedHits`; R2 skips those points only. With this, LV's R2 on eight folded lenses agrees
  with ref and optiland within 9.5e-14 mm (hits), 1.9e-13 mm (landings), 4.0e-15 (directions), no mask mismatch.
  Pins: `test/integration/lv/folded.test.ts`; canaries in `canaries.test.ts`.
- LV 2e046d71's **explicit path is not only its declared visits**: once they are done, `traceGeneralized` searches
  the reflective surfaces (`findNearestGeneralizedSurfaceHit` restricted to them), the image plane competing.
  `reference-maksutov-cassegrain-meniscus` declares MEN1, MEN2, M1, SEC; 272 of the 513 probe rays of its two
  fields then meet M1 again outside its 8.1 mm hole, reflect, and are stopped by SEC's inactive back
  (`[1, 2, 5, 3, 5, 3]`).
  The raw case's fixed path sends them from SEC to the image plane. **Owner decision 2026-10-23: check the run's
  traced rays.** After generating the selected rungs' actual coarse/fine sets, the case source runs LV's existing
  post-path detector on those sets. A hit beyond the path is `folded-post-path-reflection`, a whole-run source
  refusal before any engine jobs: ref and optiland no longer compare that non-LV system. The other eight explicit
  lenses have no recorded post-path interaction on the suite's rays and receive a provenance confirmation naming
  exactly their coarse set hashes; fine sets are `unrequested` for R0–R3. Fine sets are checked too when a rung
  requests them. The note states finite coverage only; it is no claim about untraced rays. There is no static
  envelope check and no extra sampling. **Class: translation gap**, contained at run preparation; raw exports and
  the census still describe the declared geometry without this confirmation. Direct calls retain
  `lv-folded-post-path-interaction` as a request-time backstop.
- Historical LV `2e046d71` defect, **fixed in LV `f9fb75c86`**: the single-mirror front principal plane was wrong by one signed radius. The spherical-primary
  reference (STO z=0, M1 z=100, R=-200, image z=0) gives -100 mm, while the mirror vertex and analytic principal
  plane are +100 mm: f=R/2, F=F'=0, H=H'=100, EFL (F' minus H') -100. `computeFoldedReflectiveCardinals`
  (`src/optics/first-order/cardinals.ts:213-218`) builds A, B, C, D from rays traced in physical slope with an
  unsigned index (`imageIndex = marginal.n`; the mirror step `u' = -u - 2y/R`, `src/optics/math/paraxial.ts:91`),
  a matrix of determinant -1 after an odd number of reflections, and hands it to `buildCardinalElementsFromMatrix`,
  whose `frontPrincipalZ = frontVertexZ + n (D - 1) / C` (line 126) holds for determinant +1 only; with
  determinant d the term is `(D - d) / C`. Its focal points and rear principal point do not depend on the
  determinant and are right. The integration pin returns LV's native value; the classification is an LV
  implementation defect; before the fix R1 had to FAIL without correction, floor or unsupported relabelling. A formal stop at the mirror's focal plane has an exit pupil at infinity;
  ref proves that singularity with exact rational arithmetic, avoiding a rounded reciprocal's spurious pupil at
  10^18 mm. `folded.test.ts` proves both the exact singularity and a nearby finite pupil without a threshold.
  The owner fixed LV in `f9fb75c86`. At clean `879c06102`, the folded R0–R3 suite with `--jobs 4` gives
  153 PASS / 87 UNSUPPORTED / zero FAIL or ERROR across both modes (R1: 17 PASS / 23 UNSUPPORTED).
  The [historical brief](upstream/lensvisualizer-mirror-principal-plane.md) remains for the owner; not filed.
- optiland 4e893f53's factory uses **`material="mirror"`**, preserving the incident material and constructing
  `RefractiveReflectiveModel(is_reflective=True)`. Passing `is_reflective=True` as an extra surface keyword is
  silently ignored. The deliberate-mistake mirror test pins this behavior and the read-back rejects it.
- A native optiland `RadialAperture` transmits its annulus and blocks its hole; an LV folded mirror's hole is
  transparent, while an LV blocker stops its band and transmits both complements. The folded builder therefore
  installs `FoldedInteraction` policies on a second Optic with one native surface per visit. Their side filters,
  windows, medium references, native reflection and paraxial models, and the image policy are all read back.
  Intersections, Snell refraction and reflection remain optiland's kernels, and its rows remain the answer.
  Tests prove the closed blocked set, transparent mirror holes, reflection, Mangin return media and path, and
  deliberately corrupt every new policy read-back.
- Conditional traversal can retain a different medium from the nominal path. The folded policy charges each
  native line parameter to the actual per-ray medium, including the image stretch. `trace.path_lengths` then
  applies the existing native-direction-length correction. No hit or outgoing direction is replaced by ref's.
  optiland can propagate to a target behind its ray; v2 marks that visit blocked instead. A real return leg
  along -z has a positive parameter and adds OPL.
- The first development run exposed opaque-hole mask differences in Gregorian and Maksutov paths. An independent
  80-digit Decimal conic/Snell/reflection calculation confirmed transparent primary-hole passages followed by a
  negative target parameter. Gregorian axis ray 102 crossed the primary at radius 8.949320199690553 mm inside its
  transparent primary hole, then required a -109.0966028232654 mm step to the secondary. Maksutov axis
  ray 87 crossed the primary at radius 7.523714438565315 mm inside its transparent hole, then required a
  -64.90292611987391 mm step. Off-axis counterparts agreed with the same classification. The conditional native
  policy fixes this translation gap; no ray gate or rim band was changed. The independent diagnostic is
  `workers/python/diagnostics/folded.py`, taking temporary exported cases and stored request/answer arrays.

- optiland's standard curved-surface normals point toward -z, while a plane's points toward +z. A normal's
  orientation does not change native reflection/refraction, but it does change LV's incidence-side filter.
  The folded policy orients only the side-test normal toward +z and leaves the native kernel's normal intact.
  `test_native_curved_normals_are_reoriented_only_for_the_incident_side_policy` pins both the native sign and
  a front-only reflecting visit; the final folded suite pins its actual guarded production paths.

## Optiland radial phase surfaces (Stage 5.2b)

The radial phase model and the constant-period diffraction model are different native interfaces. LV's
W(r)=sum Cp r^p is an optical path in mm. `RadialPhaseProfile` expects radians, so its coefficient at r^p is
2 pi m Cp/lambda0_mm. `PhaseInteractionModel` projects the Cartesian gradient onto the real substrate normal;
its real-ray code operates on curved substrates despite its docstring calling it a plane-only thin sheet.
The builder keeps the actual substrate geometry and uses that native code. It verifies native radian coefficients
and lossless design-coordinate metadata, both parent pointers, classes, reflection and efficiency. R0 describes
the built metadata only after verifying its correspondence to the native coefficients. Tests: `test_phase.py`.
`DiffractiveInteractionModel` instead reads a grating vector, period and order from a grating geometry; it cannot
represent the required sparse radial polynomial by assigning one constant period.

Native phase interaction adds **+phase/k0** to `rays.opd`, with k0=2 pi/lambda_mm. Thus its recorded OPD is a wave
path, whereas the comparator's opticalPath remains the geometric sum of n times distance. The worker reads the
native phase at each recorded hit as phasePath and removes its accumulated sum before the existing geometric
length correction. Phase receives no geometric normalization correction. The plane test derives both paths and
the curved-sheet test derives the projected local grating equation; the batch-split test holds the row order.

Two native first-order routes disagree with the real-ray model. `raytrace/paraxial_ray_tracer.py::trace_generic`,
used by `optic.paraxial` accessors, reads radii/indices and explicit thin-lens powers and never dispatches a radial
phase profile. An isolated phase plane therefore has infinite accessor focal length despite finite real-ray
power. The worker refuses phase-bearing R1 with `optiland-phase-paraxial-unseen`, before any substrate-only value
can be returned. Separately, `PhaseInteractionModel.interact_paraxial_rays` subtracts the transmitted phase kick,
where the real-ray model adds it: a converging quadratic phase sends its direct paraxial ray outward. Both are
pinned in `PhaseTest.test_native_accessor_bypasses_phase_and_direct_model_has_opposite_paraxial_sign`; neither is
repaired by adapter arithmetic. Conditional folded policies have no phase dispatch and explicitly refuse
`optiland-folded-phase-unsupported` if a representable folded-phase case is supplied directly.

## LensVisualizer phase paths and first order (Stage 5.2b)

At LV 879c0610 (its phase, paraxial and sequential-trace sources unchanged since 2e046d71), sequential
`recordOpticalPath` adds intersection geometric segment OPL and no surface phase. Geometry and that geometric path
are comparable. The phase array is unavailable with `lv-phase-path-unavailable`;
R3's explicit unmeasured phase metric retains the code while its measured geometric metrics are judged normally.
The phase paraxial kernel uses `DEFAULT_PHASE_WAVELENGTH_NM` (helium d), independent of the phase design wavelength.
The binding reads that constant, passes LV's own compiled phase into its kernel, and refuses other requested
phase wavelengths with `lv-phase-paraxial-wavelength`. No computed replacement is inserted. Source canaries pin
these rules. LV's MTF support still excludes any surface with a phase, so the diffractive R0–R3 suite uses ordinary
angle/stop-envelope probes rather than treating an MTF-gate refusal as a request to approximate its launch.

LV permits radial exponents 2 through 32, including odd ones. Native RadialPhaseProfile is even only; such an
odd profile is `optiland-odd-radial-phase`, before building, rather than a coefficient shifted into an even slot.

## Spots and ray fans (Stage 6.2)

Measured at LensVisualizer `a94c0ecd7` (the tree of `879c06102`) and optiland `4e893f53`, on the benchmark.

### LensVisualizer's coma and bokeh pupil is a disc of the paraxial entrance pupil, on equal-area rings

- **Where.** `traceOffAxisBundleFromSamples` (`src/optics/analysis/aberration/offAxis.ts`) launches each pupil
  sample collimated, with the slopes `(0, uField)` of `computeOffAxisFieldGeometry`. It crosses the first vertex
  plane at `(x · EPSD, yChief + y · EPSD)`, where EPSD is the hook's paraxial entrance-pupil radius. The rings of
  `sampleCircularPupil` are equal-area, so the outer ring of the coma cloud lies at 0.914 of the radius, and no
  sample is on the rim. LensVisualizer assumes the beam that reaches the image is that disc about the paraxial
  chief ray. It aims no ray at the real stop.
- **Effect.** The real axial marginal ray that clears every aperture is 0.946 (Sigma 35 mm f/1.4) to 1.0048
  (GF 63 mm) of LensVisualizer's radius. Off the axis, pupil aberration moves where a sample really crosses the
  stop. optiland's `SpotDiagram` and `RayFan` aim through the real stop instead, with a hexapolar pupil and fan
  ends on the stop's rim. The same field therefore has a different spot in each:
  - RMS radii of the coma cloud differ by a median of 8 % and up to 72 % of LensVisualizer's;
  - bokeh tiles differ by a median of 6 % and up to 71 %;
  - the tangential fans differ by a median of 5 % of the fan's span and up to 61 % (5.3e-2 mm, Sony FE 20 mm
    near the rim).
- **Handled.** R7a traces exactly LensVisualizer's rays in every engine. They land alike to 6.5e-13 mm, so the
  tracing is judged and passes. R7b records the tabs beside optiland's classes. Its chief-landing sorting limit is
  1e-5 mm, and the spot and fan figures have no attention band (owner decision 2026-10-26). Whether
  LensVisualizer's pupil model is right for these tabs is a LensVisualizer assumption to look at, not settled; the
  band waits for that. Pinned by `test/integration/lv/spotRays.test.ts`, which gives the tabs' numbers to the bit
  from the restated rays traced by LensVisualizer's exact tracer, and by the canary "a sample of the tabs' pupil
  still crosses the first vertex plane where the spot sets launch it".
- **Class.** method: recorded.

### The tabs trace the authored indices, and the coma tab only at the design plane

- **Where.** Both tabs call `traceOffAxisBundleFromSamples(..., undefined)`, with no chromatic channel, so a ray
  sees each surface's authored `nd`. The coma tab lands on the image plane of `computeOffAxisFieldGeometry`, which
  is the design plane.
- **Effect.** A photopic case's line 0 is 555 nm, which is not the tabs' line. A best-focus case's plane is not
  the coma tab's plane.
- **Handled.** `lv` answers `spot.native` only for a case whose line 0 has the authored indices; otherwise it
  answers `lines.not-authored-reference`. It answers a coma pattern only on the design plane; otherwise it
  answers `focus.off-design`. On the benchmark these are 264 unsupported pairs of R7b and no error. R7a still
  traces the spot sets at every line of every case. Pinned by the canaries of the tabs' bundles and by
  `test/engines/lv/spot.test.ts` ("what the tabs do not draw is unsupported").
- **Class.** data: unsupported.

### The bokeh tab draws its infinity grid at its own best focus

- **Where.** `bokeh.ts` sets
  `infSensorZ = bf(0) + [imgZ(view) - imgZ(0)] + [bf(0) - bf(view)]`, the tab's own least-RMS plane, and lands
  every tile there.
- **Effect.** The tile the tab shows is not on the case's plane, neither the design plane nor the benchmark's
  `lv-best-axial` plane.
- **Handled.** R7b asks `computeBokehFieldFootprint` for the tile on the case's plane, whatever that plane is.
  It compares the tile at the design plane and at the best axial focus, never at the tab's own plane. Comparing
  there would need a new image-plane kind; the owner deferred it (2026-10-26), so the tab's own plane is not
  covered. Pinned by the canary on `infSensorZ` and by `test/engines/lv/spot.test.ts` ("a bokeh tile is
  intercepted at the plane of the case").
- **Class.** method: not covered.

### optiland's spot radius is about the chief ray unless it is asked about the centroid

- **Where.** `SpotDiagram` takes `reference="chief_ray"` by default, and `rms_spot_radius()` is then the RMS
  distance from where the chief ray lands, not from the spot's centroid.
- **Effect.** The default radius is the root of the squares of the radius about the centroid and the centroid's
  offset from the chief ray. It is no RMS radius in LensVisualizer's or the contract's sense.
- **Handled.** The worker asks `reference="centroid"`, in global coordinates, and reads both back (`spot_step`).
  It takes the centroid relative to the chief ray's own landing (`probe_field`). Pinned by
  `test_optilands_spot_radius_is_about_the_chief_ray_unless_it_is_asked_about_the_centroid` (`test_spot.py`),
  which holds the default to that root on a real lens.
- **Class.** convention: handled.

### optiland's ray fan refers to its middle ray, and to the mean of the lit rays when that is dark

- **Where.** `RayFan` gives each sample's error relative to the middle sample of the fan. When the middle ray is
  stopped, for example by a central obstruction, it silently refers to the mean of the lit rays instead.
- **Effect.** Such a fan is relative to another point than the chief ray's landing, and nothing in the answer
  says so.
- **Handled.** The worker checks the middle sample (`PUPIL_CENTRE_TOLERANCE`), and a fan whose middle ray is dark
  is the unavailable field `fan-centre-lost`. Pinned by
  `test_a_fan_whose_middle_ray_is_dark_is_referred_to_the_mean_and_the_worker_says_so` on an annular stop.
- **Class.** method: unavailable.

### optiland's outer ring and fan ends lie on the stop's rim, and are often stopped

- **Where.** The hexapolar distribution's outer ring and a fan's two end samples are aimed at the rim of the
  stop, a double whose height may be a rounding beyond the clip radius.
- **Effect.** On the axis of the fast benchmark lenses the whole outer ring is often lost:
  - 91 to 127 of a coma cloud's 127 rays land;
  - 271 to 331 of a bokeh tile's 331 land;
  - fan ends are NaN where LensVisualizer's land.

  LensVisualizer lands all of its own, since its outer ring is inside the disc. Why each ray is stopped was not
  separated lens by lens: it may be the rounding at the stop's rim, or a clear aperture that the stop's marginal
  ray does not clear.
- **Handled.** Nothing is removed from or added to optiland's spot. The rays launched and landed are recorded
  under `sampling`, and a fan's sample that landed in one answer only is counted (`fanSamples.unpaired`). The
  worker's tests accept the spot of all the rays or of those inside the rim, and nothing else. Pinned by
  `test_the_spot_on_the_axis_is_the_exact_rays_of_its_pupil_points_about_their_centroid` and
  `test_an_oblique_fan_is_the_contracts_frame_point_by_point`.
- **Class.** method: recorded.

## Axial rays (Stage 6.3)

Measured at LensVisualizer `45e6f852d` (engine closure `afef1f81`) and optiland `4e893f53`, on the benchmark.

### LensVisualizer's chromatic tab traces a d-line catalog glass at the catalog's own index, at every channel

- **Where.** `makeSurfaceDispersion` (`src/optics/chromatic/materialResolver.ts`) gives a glass whose d-line `nd` and
  `vd` it matched to a catalog entry the catalog's own Sellmeier index at each channel. That includes LensVisualizer's
  G channel, its reference channel: the d line, 587.56 nm, for a lens of d-line indices (the e line for a lens of
  e-line indices), and not the Fraunhofer g line, which is its channel V
  (`const nG = evaluateSellmeier(entry, CHANNEL_NM.G);`). A native e-line element is anchored to its
  authored index instead (`const anchor = ne - evaluateSellmeier(entry, E_LINE_CHANNEL_NM.G);`), and so is the MTF
  path (`anchoredIndexAtWavelength`, whose comment names the defocus anchoring prevents). The chromatic tab traces its
  channels with `state.lens.dispersion[i]?.indexAt(channel)`; the aberrations tab, the MTF and every case trace the
  authored indices.
- **Effect.** LensVisualizer's axial-colour section and its spherical-aberration section disagree on the d-line
  focus of one lens. A catalog match is accepted within `GLASS_ND_TOLERANCE` (3e-3) of the authored index: the Z 50 mm
  f/1.2 has three glasses 4.3e-4 to 7.0e-4 off, and its G-channel marginal focus moves 4.3e-3 mm wide open; the Z
  24-70 mm f/4 has one 2.3e-4 off, and moves 3.0e-2 mm at the tele end. Even a glass that matches is off by the
  catalog fit's own residual (6.8e-6 for one glass of three benchmark lenses, 7.7e-9 in the Sony FE 20 mm), and moves
  its lens's focus by 1e-6 to 2e-3 mm. The relative focus the chart plots moves by 1e-4 mm at most (all lines move
  nearly alike); the absolute `focusShiftMm` and the image-plane fan span are of the catalog's lens. Across the
  catalog 881 of 1,014 lenses have a medium whose G-channel index is not its authored one (328 by 1e-4 or more;
  LensVisualizer `36b5768bf`, nothing under `src/optics` or `src/lens-data` changed since `45e6f852d`): the owner's
  brief is `docs/upstream/lensvisualizer-loca-unanchored-index.md`.
- **Handled.** `lv` states, per line, how far the channel's indices are from the case's (`sampling.indexMaxDelta`),
  and R8b sorts a line whose answer states it above 0 as data, `indices-differ`, before its landing is looked at: two
  traces of one source of indices are the same bits, so any other value is other indices. On the benchmark that is
  all 24 colour lines (the three that landed within 1e-5 mm and were once counted as two methods are among them),
  and no colour figure is taken. R8a traces the case's own indices in every engine and is not touched. Whether
  LensVisualizer anchors these channels is the owner's. Pinned by the canary "the aberrations and chromatic tabs
  still present the sections the engine answers axial.native from" (the two lines of `materialResolver.ts`), by
  `test/engines/lv/axial.test.ts` ("axial colour is each line's channel of the section, with how far its indices are
  from the case's"), by `test/compare/axialNative.test.ts` ("a line traced at indices other than the case's is data,
  however near its landing"), and by `test/integration/optiland/r8.test.ts`, which holds the colour line of the Z 50
  mm to `indices-differ`.
- **Class.** data: recorded.

### An axial intercept is ill-conditioned for a ray near the axis

- **Where.** A ray behind the lens of slope `u = dy/dz` that two engines place a height `δ` apart crosses the axis
  `δ / |u|` apart. The spherical-aberration section's zones reach in to 0.05 of the pupil.
- **Effect.** On the benchmark the slopes run from 0.0031 (the GF 63 mm at f/8, zone 0.05) to 0.448 (the Z 50 mm
  f/1.2 at its marginal zone). A plain intercept difference of the shallowest ray is 320 times its height
  difference, 144 times what the same difference makes of the steepest ray. The largest plain difference on the
  benchmark is 4.3e-12 mm (the Z 24-70 mm tele stopped to f/8, where every slope is small), while no height
  difference exceeds 4.7e-13 mm.
- **Handled.** R8a judges the intercept on the transverse scale, its difference times the larger of the two slopes
  (`intercept.maxScaled`, 1e-8 mm, the gate R2 and R7a set on a height), and shows the plain difference beside it
  (`intercept.maxAbs`), never judged. The larger slope, never one engine's own: an engine whose slope is wrong and
  small would otherwise scale its own difference away. A crossing that overflows the doubles is `out-of-range`, not a
  NaN. Pinned by `test/compare/raysAxial.test.ts` ("an exit moved along y moves the ray's intercept by the step over
  its slope, judged as the step itself", "an engine's wrong, shallow slope cannot hide its intercept") and
  `test/estimators/axialIntercept.test.ts` (the `out-of-range` rays).
- **Class.** numerical: handled.

### Intercepts that agree do not bound the focus when the slopes differ

- **Where.** The least-squares focus of a set weights each pair's intercept by its squared slope. Two answers whose
  intercepts agree and whose exit slopes differ weight the zones differently.
- **Effect.** Their foci part although no intercept does: with one pair's slopes 1 + 2^-11 times the other's, every
  intercept figure is a rounding and `focus.maxScaled` is above the gate. A bound of the focus figure by the
  intercepts' (Cauchy–Schwarz) holds only where the two answers' slopes are the same.
- **Handled.** The focus figures (`focus.maxScaled`, `focusRms.maxAbs`) are R8a's only sign of a difference of the
  exit slopes on these rays, and are gated for it. Pinned by `test/compare/raysAxial.test.ts` ("slopes that differ
  with intercepts that agree show only in the focus figures, beyond the intercepts' bound").
- **Class.** numerical: handled.

### The paraxial chromatic focal shift is not the axial colour of the marginal rays

- **Where.** LensVisualizer's axial-colour section is of one real ray near the rim of the pupil at each channel;
  optiland's `F2()` at each line is of the paraxial ray.
- **Effect.** The two differ by the spherochromatism of the marginal zone. On the 12 benchmark configurations at the
  C, d and F lines the paraxial shift is up to 8.8e-2 mm from the real one (Nikon Z MC 105 mm, F − d: real −0.0426,
  paraxial +0.0453), of the other sign on four lenses.
- **Handled.** R8b records the real relative focus beside the other engine's paraxial shift
  (`paraxialFocalShift.maxAbs`) as the plan's "different quantity", and never bands it as an error; real is set
  against real in `relativeFocus.maxAbs`. Pinned by `test/compare/axialNative.test.ts` ("axial colour: each line's
  focus relative to the first, real beside real and beside the paraxial shift").
- **Class.** method: recorded.

### LensVisualizer's sections present only the authored line, its channels and the design plane

- **Where.** The spherical-aberration section traces with no channel (the authored indices); the axial-colour
  section traces its four channels, the lines C, d, F and g (C′, e, F′, g for a lens of native e-line indices); both
  present their figures on the design image plane.
- **Effect.** A photopic case has neither the authored line nor a channel; a best-focus case is off the plane.
- **Handled.** `lv` answers `axial.native` only where its sections present the figure, and otherwise answers
  `lines.not-authored-reference`, `lines.not-chromatic-channels`, `lines.mixed-reference` or `focus.off-design`:
  144 unsupported pairs of R8b on the benchmark, no error. R8a still traces the axial sets at every line of every
  case. Pinned by `test/engines/lv/axial.test.ts` ("what the sections do not present is unsupported" and "a case
  off the design plane is unsupported once the section says where its plane is").
- **Class.** data: unsupported.

### optiland's own axial launch is exactly parallel, at its paraxial entrance pupil

- **Where.** With its default `paraxial` aiming and an angle field on the axis, optiland's ray generator launches the
  pupil point `(0, f)` at `y0 = f · EPD / 2 · vy + y` toward `y1 = f · EPD · vy / 2` (`AngleField.get_ray_origins`,
  `ParaxialRayAimer`). With no vignetting factor (`vy` 1) the two are the same double, so `M` is 0 and `N` 1 exactly.
- **Effect.** R8b's optiland pupil is the paraxial entrance pupil, as LensVisualizer's tabs': the two radii agree to
  1.37e-11 of themselves on the benchmark (Sony FE 20 mm), and the spherical figures to 8.5e-12 mm. R7b's worker aims
  at the real stop instead (`robust`), whose pupil is LensVisualizer's to 0.946 to 1.0048. The pupil is of the first
  line asked, whose optic launches the rays for every line.
- **Handled.** The worker reads back the aiming, the one field on the axis without vignetting and of the type
  `AngleField`, no apodization, a finite `EPD()` other than 0, the length of every launched column, and each
  launched ray's x, height and direction, and refuses anything else as `build-mismatch`. Pinned by
  `test_each_setting_of_the_launch_is_read_back_with_the_mistake_made_on_purpose` and
  `test_the_rays_of_every_line_are_launched_in_the_pupil_of_the_first_line_asked` (`test_axial.py`).
- **Class.** convention: handled.

### The spherical aberration's identifying ray cannot tell pupils apart

- **Where.** R8b identifies a spherical-aberration line by the landing of its near-axis pair, the mean of the ray and
  its mirror image, which lands on the axis by symmetry whatever the pupil.
- **Effect.** Two answers of other pupil radii trace other rays at the same fractions, and their landing figure is 0:
  the landing alone never set a spherical line aside.
- **Handled.** R8b sorts a line as data, `pupils-apart`, where the two answers' pupil radii differ by more than
  `pupilRadius.relative`'s limit of 2e-10 of the larger, ten times the measured 1.37e-11 rounded up. Pinned by
  `test/compare/axialNative.test.ts` ("pupils whose radii differ beyond the limit set every line aside as data").
- **Class.** data: handled.

### optiland's axial pupil and focus are its first-order data, which do not see a phase or a vertex term

- **Where.** The pupil the worker launches in (`EPD()`) and the paraxial focus (`F2()`) are optiland's paraxial
  model, which reads radii and indices: it bypasses a radial phase profile and a term of power 1 or 2 of a polynomial
  sag.
- **Effect.** Asked directly, the worker would state of such a case the pupil and the focus of another lens: of a
  lens whose first surface has a term of power 2, the focus of the lens without it, 2.4 mm from the contract's; of a
  phase on a plane, no focus, where its rays cross at 100 mm.
- **Handled.** The engine refuses `axial.native` of such a case before anything is built, as it refuses
  `paraxial.first-order` (`first_order.term_refusals`: `optiland-phase-paraxial-unseen`,
  `surface.asphere.linear-term`, `surface.asphere.quadratic-term`). Pinned by
  `test_a_case_whose_first_order_data_optiland_does_not_see_is_refused_before_anything_is_built` and
  `test_without_the_refusal_optiland_would_state_the_focus_of_another_lens` (`test_axial.py`).
- **Class.** method: unsupported.

## Chief rays (Stage 6.4)

Measured at LensVisualizer `d6df08c7f` and `cfa91d0a5` (engine closure `c866fbff` with the stage's names, 178 files)
and optiland `4e893f53`, on the benchmark.

### LensVisualizer's chief ray below one degree is its paraxial estimate

- **Where.** `computeChiefRaySolve` (`src/optics/field/chiefRaySolve.ts`) returns the chief ray of the paraxial
  entrance pupil, `-epRatio · uField`, for every field under one degree
  (`if (Math.abs(fieldAngleDeg) < 1) { return { yLaunch: paraxialYChief, ... } }`), not a ray through the stop's
  centre. The pupils tab (`computeBothPupilAberrationProfiles`) makes its real entrance pupil of that launch over the
  paraxial one (`chiefRayCorrection` 1, `epShiftMm` 0 there) and its real exit pupil of that ray; the distortion
  curve's samples below one degree are of it too.
- **Effect.** Below one degree the tab's real pupils are those of the paraxial pupil's chief ray. The Sony FE 400 mm
  (half field 3.15°) has 5 of its 16 pupil fields there: its entrance pupil is 1.30 mm from that of optiland's chief
  ray through the stop's centre, its exit pupil 5.17e-2 mm. Four more lenses have one such field (5.6e-3 to 1.5e-2
  mm). At one degree and above every benchmark lens agrees within 5.0e-6 mm in both pupils. The two chief rays land
  within 2.5e-6 mm of each other, inside R9b's 1e-5 mm limit: the landing does not tell them apart.
- **Handled.** R9a traces LensVisualizer's own launch in every engine, so it is untouched. R9b records the pupils as two
  methods, with no band. The owner decided (2026-10-26) that LensVisualizer is to solve the real chief ray there too;
  the change is pending in LensVisualizer (brief `docs/upstream/lensvisualizer-chief-ray-conventions.md`, not filed),
  and until it lands this entry describes LensVisualizer as it is. Pinned by the canary "the distortion tab still traces
  the probe, the edge and its samples the chief sets restate" (the one-degree line) and by
  `test/integration/optiland/r9.test.ts`, which holds the Sony FE 400 mm's pupils below one degree to an `epShiftMm` of
  0 and more than 1 mm from optiland's, and above it to within 1e-5 mm.
- **Class.** method: recorded.

### LensVisualizer's lateral colour is one chief ray traced at every channel

- **Where.** `computeLateralColorCurve` traces the coma tab's chief ray of a field (`computeOffAxisFieldGeometry`,
  solved once at the authored indices, with no channel) at each channel (`traceOffAxisChiefRay` with the channel),
  and plots each channel's landing relative to G. optiland's chief ray of each line passes through the stop's centre
  at that line, the usual definition. The channels also trace a d-line catalog glass at the catalog's own index
  ("LensVisualizer's chromatic tab traces a d-line catalog glass at the catalog's own index, at every channel",
  above).
- **Effect.** On the 12 benchmark configurations at C, d and F (a temporary suite, not committed) the landings
  relative to the d line differ from optiland's by up to 1.09e-3 mm (the Sony FE 20 mm at its edge, F − d: −5.77e-3
  against −4.68e-3 mm); tracing LensVisualizer's own launch at the case's indices moves that by 3.8e-5 mm at most, so
  the rest is the one launch. On the reference line alone the G channel lands up to 7.19e-3 mm from optiland's chief
  ray at the case's index (the Z 24-70 mm wide end at its edge).
- **Handled.** `lv` states each line's `sampling.indexMaxDelta`, and R9b sorts a field above 0 as data,
  `indices-differ`, before any difference: on the benchmark every lateral-colour field (120 on 24 pairs) is data and no
  lateral-colour figure is taken; 22 of the pairs are ATTENTION by their landing. R9a judges the moves of identical
  rays between lines (`lateralColour.maxAbs`). The owner decided (2026-10-26) that LensVisualizer is to trace each
  channel's own chief ray; the change is pending in LensVisualizer (the brief above). Pinned by
  `test/engines/lv/chief.test.ts` ("lateral colour is each line's channel of the section, with how far its indices are
  from the case's"), `test/compare/chiefNative.test.ts` ("a field is sorted by R5's classes first, then by indices
  that are not the case's, then by its landing") and `test/integration/optiland/r9.test.ts`.
- **Class.** data (the indices) and method (the launch): recorded.

### LensVisualizer's distortion curve plots its targets

- **Where.** `computeDistortionCurve` takes evenly spaced target heights up to the edge chief ray's landing, inverts
  each to a field angle with solved chief rays, accepts an inversion whose ray lands within 1e-4 mm of its target, and
  plots the target as the real height; the ideal height and the percent are of the target and the angle.
- **Effect.** A plotted real height is not where the chief ray at the plotted angle lands: up to 9.8e-5 mm on the
  benchmark lenses, 3.7e-3 percentage points.
- **Handled.** `lv` states the curve as plotted (`figures`), identifies each field by the landing of its solved chief
  ray (`chiefLandingMm`), and states the difference (`sampling.inversionResidualMm`). R9a's distortion is of the
  landings of the same rays in every engine. Pinned by the canary named above ("a sample's chief ray lands within 1e-4
  mm of its target"), by `test/integration/lv/chiefRays.test.ts` (each sample within 1e-4 mm, the plotted height the
  target) and by `test/engines/lv/chief.test.ts` ("distortion is the curve as the tab plots it, the landing of each
  sample's solved chief ray beside it").
- **Class.** method: recorded.

### LensVisualizer's distortion scale is of a probe up to half a degree off the axis

- **Where.** `computeDistortionReference` scales the rectilinear reference by the paraxial pupil's chief ray at
  `Math.min(Math.max(geometry.halfFieldDeg * 0.01, 0.02), 0.5)` degrees; optiland's `RotationalDistortionModel` probes
  at 1e-10 of the half field.
- **Effect.** The probe's landing holds a little of the lens's distortion: the two scales differ by up to 8.5e-6 of
  the scale (the Z 24-70 mm wide end, a probe of 0.43°), median 1.9e-6.
- **Handled.** Each answer states its scale and probe (`reference.focalScaleMm`, `probeAngleDeg`); R9b records
  `focalScale.relative`, unbanded. R9a's distortion sets carry LensVisualizer's probe as a ray (`groups.chiefIndex`),
  so every engine scales by its own trace of the same ray. Pinned by the canary (the probe's line), by
  `test/integration/lv/chiefRays.test.ts` (the probe's height to the bit) and by `test/compare/chiefNative.test.ts`
  ("distortion: the differences of the percent, the real and ideal heights and the scales, field by field").
- **Class.** method: recorded.

### optiland's robust aimer gives its distortion model no scale

- **Where.** `RotationalDistortionModel.fit` (`optiland/analysis/distortion_strategies/model.py`) scales by the chief
  ray at `_NEAR_AXIS` (1e-10) of the half field. Under the `robust` aiming of the worker's other analyses, optiland
  launches a field that small along the axis.
- **Effect.** The probe lands on the axis, `_scale` is 0, and every ideal height is 0: the percent has no value.
- **Handled.** The worker asks the model under optiland's default `paraxial` aiming, which is what its `Distortion`
  analysis uses (accepted by the owner, 2026-10-26), reads the aiming back before and after, and identifies a field
  separately by the robust-aimed chief ray. A scale of 0 is the field's reason `no-scale`, never a number. Pinned by
  `test_chief.py` (`test_optilands_robust_aimer_launches_the_near_axis_probe_along_the_axis_and_gives_no_scale`, and the
  aiming faults of the read-back tests).
- **Class.** convention: handled.

### optiland's distortion is of the chief ray of its paraxial pupil

- **Where.** Under `paraxial` aiming the model's `ChiefRayReferencePoint` traces the ray at the pupil (0, 0), aimed at
  the centre of the paraxial entrance pupil, not of the real stop.
- **Effect.** Off the axis that ray misses the stop's centre by the pupil's aberration. R9b's
  `distortionPercent.maxAbs` is at most 0.0146 percentage points on the benchmark (the Z 24-70 mm tele at f/8, at
  16.6°), median 0.0042. Of it: optiland's paraxial chief ray against its robust one, up to 0.014 points;
  LensVisualizer's target against its landing (above), up to 3.7e-3; the two chief rays through the stop's centre,
  each on its own scale, up to 8.5e-4; on one scale, up to 3.6e-5 (the Sony FE 400 mm at 0.96°, below
  LensVisualizer's one degree).
- **Handled.** Recorded, no band. The answer states its aiming (`method.params.aiming`) and, per field, the model's
  own chief ray landing (`sampling.distortionLandingMm`) beside the robust one (`chiefLandingMm`). Pinned by
  `test_chief.py` (`test_the_distortion_of_a_sphere_that_is_its_own_stop_is_its_closed_form`, where the two rays are
  one).
- **Class.** method: recorded.

### A percent distortion and an exit pupil are ill-conditioned near the axis

- **Where.** A percent distortion is a displacement over an ideal height, which vanishes on the axis; an exit pupil
  is where a chief ray crosses the axis, `δ / |u|` apart for two exits a height `δ` apart at a slope `u`.
- **Effect.** A rounding of a landing near the axis is a large difference of percent, and of a shallow chief ray a
  long move of its crossing.
- **Handled.** R9a judges the displacement (`distortion.maxScaled`) and the crossing times the larger of the two
  slopes (`exitPupil.maxScaled`), each at 1e-8 mm, and shows the percent (`distortion.maxAbs`) and the plain crossing
  (`exitPupil.maxAbs`), never judged (the owner accepted the gate, 2026-10-26). Two conditionings remain, stated and
  not gated away. The exit-pupil figure is about `y dm / m` for exits at one height `y` whose slopes differ by `dm`:
  a nearly image-telecentric chief ray, its exit pupil finite but far (y 20 mm, m 2e-7), shows 1.1e-8 mm for one
  rounding of a direction (1.1e-16), and `lv-exit-pupil-at-infinity` does not catch it; the worst measured is 5.97e-13
  mm. The distortion figure is not on the transverse scale for the probe: a probe-landing difference moves every
  ideal point by the ray's slope over the probe's (about 100, 136 at a 50° half field, 200 to 270 for ultra-wide
  rectilinear lenses), so the probe's landing is held to about 4e-11 mm; landings agree to 3.6e-13 mm, and the worst
  measured figure is 3.83e-13 mm. A FAIL of either is attributed in extended precision before anything is concluded,
  and the gate is never widened for it. Pinned by `test/compare/raysChief.test.ts` ("a probe moved by less than the
  gate moves every ideal point by its slope ratio: the distortion fires alone", "an exit turned about its landing shows
  only in the exit pupil: the rung's sign of a wrong exit slope", "an engine's wrong, shallow exit slope cannot hide
  its crossing: the larger slope scales it, either way round").
- **Class.** numerical: handled.

### LensVisualizer's breathing chart is R1's focal length, and its positions between stations are no case

- **Where.** `computeFocusBreathingSeries` plots 21 evenly spaced focus positions, each `computeFocusEFL` of that
  prepared state, relative to its sample at infinity focus.
- **Effect.** At every exported state of the benchmark lenses (14 states, two of them focus stations) the chart's
  focal length is `lv`'s R1 focal length within 2 units in the last place. The chart's other positions have object
  distances LensVisualizer does not certify, which the exporter refuses: no other engine is asked about them.
- **Handled.** Breathing is judged by R1 wherever a state is a case; it has no rung of its own, and the positions
  between the stations are not covered (owner decision, 2026-10-26). Pinned by
  `test/integration/lv/breathing.test.ts` and the canary "the lateral-colour section and the breathing chart still
  read what the comparator restates".
- **Class.** method: not covered between stations.

## Field curves (Stage 6.5)

Measured at LensVisualizer `cfa91d0a5` (engine closure `c866fbff` with the stage's names) and optiland `4e893f53`, on
the benchmark.

### LensVisualizer's parabasal foci are of a pencil 0.01 mm wide

- **Where.** `computeStandardizedFieldFocus` (`src/optics/analysis/aberration/fieldCurvature.ts`) launches its four
  parabasal rays `±p` of the pupil beside the chief ray, `p = 0.01 / EPSD` held between 1e-4 and 0.02
  (`parabasalPupilFraction`): 0.01 mm on the first vertex plane. optiland's `FieldCurvature` crosses a pair at
  `±1e-5` of the pupil (its methods' default `delta`), 2.6e-5 to 3.6e-4 mm on the benchmark.
- **Effect.** A focus of a finite pencil moves from the infinitesimal one (Coddington's) by the square of its width:
  traced by LensVisualizer's own launch and tracer at 0.01, 0.001 and 0.0001 mm, the Sigma 45 mm's tangential focus at
  its edge (25.6°) is 5.72e-6, 5.1e-8 and 5.7e-9 mm from optiland's, the Z 24-70 mm's at f/8 on the axis 1.38e-6,
  1.38e-8 and 1.34e-10 mm. So R10b's fields differ by up to 5.72e-6 mm (tangential), 1.38e-6 (sagittal) and 6.66e-6
  (astigmatism), median 6.3e-8: fifteen times below the 0.1 µm the tab's readouts round to, and invisible on its plots.
  The least squares about the chief ray and optiland's crossing of the pair have the same limit: both cancel the term
  of the pupil's first power (coma), and differ in the second.
- **Handled.** **Owner decision (2026-10-26): no LensVisualizer change; the 0.01 mm pencil is a documented convention
  of LensVisualizer's.** R10b records the differences as two methods, within its attention bands of 1e-5 mm on the
  tangential and sagittal shifts and the astigmatism (policy 19, above the measured 6.66e-6 mm); R10a traces
  LensVisualizer's own pencil in every engine. Brief: `docs/upstream/lensvisualizer-parabasal-pencil.md` (not filed).
  Pinned by the canary "the field-curve sections still trace the fields, the parabasal rays and the fans the curvature
  sets restate" (the pupil fraction's lines) and by `test/integration/optiland/r10.test.ts` (the design run's fields
  within 1e-5 mm).
- **Class.** convention: recorded.

### LensVisualizer's field curves below one degree are about its paraxial chief ray

- **Where.** `computeOffAxisFieldGeometryScalar` takes the field's launch height from `solveChiefRayForRuntimeLens`,
  which below one degree is the paraxial pupil's chief ray ("LensVisualizer's chief ray below one degree is its
  paraxial estimate", above): the parabasal pencil is centred on it, not on the ray through the stop's centre that
  optiland's robust aimer centres its pair on.
- **Effect.** Coma moves a tangential focus with the centre of its pencil. On the Sony FE 400 mm (half field 3.15°,
  five fields of seventeen off the axis below one degree) the tangential foci there are up to 2.31e-6 mm from
  optiland's, the sagittal up to 1.23e-7; neither moves with the pencil's width (0.01 to 0.0001 mm), unlike the effect
  above. The two chief rays
  land within 2.52e-6 mm, inside R10b's 1e-5 mm limit.
- **Handled.** Recorded as two methods. The change to LensVisualizer's chief ray the owner decided at Stage 6.4
  (`docs/upstream/lensvisualizer-chief-ray-conventions.md`) will move these fields too. Pinned by
  `test/integration/optiland/r10.test.ts` (the telephoto's tangential foci below one degree more than 1e-6 mm apart, its
  sagittal foci a fifth of that).
- **Class.** method: recorded.

### optiland's FieldCurvature traces the axis with the field, and its robust aimer marches from the axis

- **Where.** `FieldCurvature._intersection_parabasal_tangential` traces its pairs at the normalised fields
  `linspace(0, 1, num_points)` in one `trace_generic`: asked at one field of an optic, the axis is in the batch.
  `RobustRayAimer._aim_rays_scoped` solves a batch's fields in order of their size, each seeded from the nearest field
  it has solved ("D8 field marching"), so the field is seeded from the axis.
- **Effect.** On the Sigma 35 mm at f/8 at its edge (27.95°) the pair of the field comes back NaN from such a batch,
  and from a batch of 0.5 and 1 it converges; alone, or with the field ahead of the axis in a batch of its own, it
  converges too. The worker's field is `no-focus`, unavailable: one field of the 408 on the benchmark.
- **Handled.** The worker asks the class as it is and reads its values; a focus that is no number is the field's
  reason, never a number, and R10b sorts it as unsupported. The worker does not warm optiland's aimer with the field
  first: a number must not depend on what was asked before it. Its check that the field's parabasal rays landed traces
  the analysis's own two batches again, axis included and in their shape (`parabasal_batches`), on the same optic, so
  the aimer reuses its pupil maps and the rays checked are the ones that gave the number. Held by the owner with the
  other upstream items (not reported). Pinned by `test_curvature.py` (the no-focus fault, and the rays traced again held
  to the analysis's own, bit for bit).
- **Class.** method: handled.

### A parabasal focus is ill-conditioned along the axis

- **Where.** A focus is `s = -Σ Δc Δu / Σ Δu²`: a parabasal ray's slope relative to its chief ray's, `Δu`, is about
  0.01 mm over the focal length (5e-4 to 2.5e-5 on the benchmark, 1.25e-5 for the diffractive suite's 800 mm
  lenses), so a difference `δ` of a relative landing moves the focus `δ / Δu` along the axis.
- **Effect.** Rounding alone moves the plain focus by thousands of times a landing's difference: on the benchmark the
  tangential foci of the same rays differ along the axis by up to 4.87e-9 mm (the Sony FE 400 mm at f/8) where their
  landings differ by 9.4e-13 mm, and on the diffractive suite by 1.20e-8 mm (the Canon RF 800 mm f/11): above 1e-8 mm
  on arithmetic alone. The sagittal foci of a mirror-symmetric pair differ by 6e-12 mm at most.
- **Handled.** R10a judges a focus on the transverse scale: the difference times the larger of the two answers' RMS
  relative slopes (`tangentialFocus.maxScaled`, `sagittalFocus.maxScaled`), about `|δΔc + s δΔu|` across the field
  at the focus, the distance a gate of R2 is of; the plain differences and the astigmatism are shown and never judged.
  The scaled figure amplifies a difference of the relative slopes by the distance `s` of the focus from the image
  plane (up to 0.38 mm on the benchmark, the Sony FE 20 mm at its edge): a slope known to 1.1e-16 then contributes
  4e-17 mm. Its worst on the benchmark is 1.33e-13 mm, 75,000 times inside the gate. Pinned by
  `test/compare/raysCurvature.test.ts` ("a landing moved along y moves the tangential focus by the step over the
  relative slope, judged as half the step", "the focus is scaled by the larger of the two answers' relative slopes,
  never the one engine's").
- **Class.** numerical: handled.

### LensVisualizer's chromatic field curves are its chromatic tab's channels

- **Where.** `computeChromaticFieldShifts` traces each field's parabasal rays at each channel R, G, B and V
  (`CHROMATIC_CHANNEL_ORDER`) from the launch solved at the authored indices, at the channel's catalog indices
  ("LensVisualizer's chromatic tab traces a d-line catalog glass at the catalog's own index, at every channel", above),
  and keeps each channel's shifts and no landing.
- **Effect.** A channel's line is not the case's indices where a glass was matched to a catalog, and its foci are of one
  launch at every channel.
- **Handled.** `lv` answers a line of a channel with the chromatic shifts, `chiefLandingMm` null and
  `sampling.indexMaxDelta`; R10b sorts such a field as data (`indices-differ`, or `chief-landing-unknown` where the
  indices agree). The benchmark's runs have no line of a channel but the reference line, which is the authored one; a
  photopic run has no line of LensVisualizer's field curves, and no R10b request. R10a traces the same rays at every
  line of the case. Pinned by `test/engines/lv/curvature.test.ts` ("at a channel's line the answer is the chromatic
  field curves, without a landing and with the indices' distance").
- **Class.** data: recorded.

### LensVisualizer's real-ray curves and Petzval surface have no counterpart in optiland's FieldCurvature

- **Where.** The field-curve section also draws the least-squares foci of its real-ray fans
  (`computeDiagnosticFieldFocus`, 51 rays a fan) and the Petzval surface of the stored Petzval sum
  (`petzvalShiftAtImageHeight`, paraxial).
- **Effect.** optiland's `FieldCurvature` is of parabasal pairs only.
- **Handled.** R10a traces the real-ray fans in every engine and judges their foci with the parabasal ones; `lv` states
  the real-ray shifts and the Petzval shift in `sampling` of R10b, recorded and never compared. The Petzval sum is a
  first-order quantity (Stage 6.8's Seidel sums).
- **Class.** method: not covered by R10b.
