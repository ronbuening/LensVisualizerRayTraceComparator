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
Measured numbers are of LensVisualizer commit `d36f44b3`.

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

## Any two engines

### A pupil that is metres away cannot be placed to 1e-9 mm

- **Where.** The position of a pupil is a quotient, height over angle, of a ray from the stop. In a nearly
  telecentric lens the angle is small and is itself the remainder of a sum that cancels.
- **Effect.** `viltrox-af-75mm-f12-pro` has its exit pupil 7.7 m behind the first vertex at the d line and, at the
  photopic lines, from 1.4 m to 20 m behind it and 14 m in front of it. `lv` and `ref` place it 1.1e-9 mm apart at
  the d line and up to 3.0e-9 mm apart at 650 nm: 2e-13 of the distance, and above the R1 gate of 1e-9 mm. Over
  the 1676 cases of the catalog (868 lenses on the reference line, 808 on the photopic lines) it is the only one
  that fails R1; the next largest difference of any value is 1.9e-11 mm. Neither engine is wrong, and neither
  can do better: one unit in the last place of 20 m is 3.6e-12 mm. Worked out in exact rational arithmetic from
  the same radii, gaps and indices, the pupil lies up to 3.5e-9 mm from where `lv` puts it and up to 4.9e-9 mm
  from where `ref` does (both at 610 nm, where the two happen to err alike and differ by 1.4e-9 mm); at the d line
  `lv` is 1.8e-11 mm off and `ref` 1.1e-9 mm, and at 650 nm 2.7e-10 mm and 3.3e-9 mm. So no change to the
  reference engine alone would bring every line of this lens inside the gate.
- **Handled.** The gate is as the plan states it, and the lens fails R1 by it. The lens is in neither suite, so
  the suites pass; a run of the whole catalog will show it as `FAIL`. What would judge it rightly is a comparison
  of pupils in reciprocal distance, which is also what a truly telecentric system needs; that is a change of the
  gate, and the owner's to make.
- **Class.** numerical.
