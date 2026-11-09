# History

The status paragraph the README carried until the plain-language rewrite, kept as it was.

**Status.** Phases 0 and 1 of the [plan](IMPLEMENTATION_PLAN.md) are complete. LensVisualizer (`lv`) and the
comparator's own reference tracer (`ref`) answer rungs R0 to R3 and agree on the benchmark suite, and `lvrtc mtf`
prints the MTF that LensVisualizer's own MTF tab shows. The first external engine,
[optiland](https://github.com/optiland/optiland), is Phase 2: the engine `optiland` builds every case in optiland
and answers rungs R0 to R3: the built system, its first-order data, the same rays traced by optiland's own tracer
and their optical paths, on which the three engines agree on both suites
([measured](REFERENCE.md#phase-2-r0-to-r3-on-three-engines)). Baselines of those runs close the phase.
Phase 3, MTF, is delivered through Stage 3.12: the comparator's own geometric estimator reproduces LensVisualizer's
geometric MTF on a replay of LensVisualizer's sampling to 1.7e-14, with every grid size and ray count the same,
on the benchmark wide open and at f/8, at the design plane and at LensVisualizer's best focus (rung R4f,
[measured](REFERENCE.md#the-mtf-recipe-the-replay-and-rung-r4f)); and the geometric MTF of the same rays, as
LensVisualizer, the reference tracer and optiland each land them, agrees within 1.2e-11 on the same benchmark
(rung R4, gated at 1e-7,
[measured](REFERENCE.md#rung-r4-the-geometric-mtf-of-the-same-rays)). The comparator's wave estimator, Hopkins'
autocorrelation of the pupil function from the optical paths of the same rays, is held to closed forms
([the wave OTF](REFERENCE.md#the-wave-otf)), and on the three engines' traces of the same rays it agrees
within 1.2e-9 wherever its lattice samples the wavefront (rung R6a, gated at 2e-8; a fast lens wide open is
undersampled and not judged). Beside LensVisualizer's own diffraction MTF it stays
within the plan's bands at f/8 and marks five of 96 runs for attention (rung R6b, recorded;
[measured](REFERENCE.md#rungs-r6a-and-r6b-the-wave-mtf)). The engine `optiland` answers with optiland's own
FFT MTF, one line and one field at a time, a field it cannot compute being a row with the reason
([optiland's own MTF](REFERENCE.md#optilands-own-mtf)). Rung R5 sets it beside LensVisualizer's product MTF
and the wave estimator, field by field, with the class of every difference: recorded and never gated. At f/8 all
24 reference-line runs of the benchmark are inside the plan's bands (at most 0.0041 on the axis, 0.0088 off it);
wide open 15 of 24 are marked for attention ([measured](REFERENCE.md#rung-r5-the-engines-own-mtf)). Rung R5g
does the same for the geometric MTF, which some manufacturers publish alone: LensVisualizer's beside optiland's
own, on the reference line and on the photopic lines, recorded and never gated. At 10, 30 and 50 cycles/mm no row
at f/8 is outside the bands (at most 0.0087); wide open 69 of 144 fields are marked
([measured](REFERENCE.md#rung-r5g-the-engines-own-geometric-mtf)). A report states what it does not cover,
and its wording is linted. These figures are measured at Stage 3.12: LensVisualizer `ab0fd4cf` (engine closure
`94778d3d`, 175 files), optiland `4e893f53`, policy version 11. All four baselines and the census are rewritten;
baseline check reports every record `OK` ([measured](REFERENCE.md#measured-at-stage-312)).
Phase 4 (LensVisualizer's default view, attribution and the [validation statement](../reports/validation-statement.md))
is delivered. Phase 5 is delivered through Stage 5.3: at LensVisualizer `879c06102` and policy version 15, mirror
and diffractive lenses have suites of their own, and the whole catalog, 1,341 states, is baselined on three engines, with
every FAIL classified and given a one-run reproducer ([catalog statistics](../reports/catalog.md),
[attribution](REFERENCE.md#stage-53-catalog-fail-attribution)).
