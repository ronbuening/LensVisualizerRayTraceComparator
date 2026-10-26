# LensVisualizer: front principal plane uses determinant +1 for an odd-reflection matrix

Status: **fixed in LV `f9fb75c86`**, included in the owner's clean `879c06102` checkout. For the owner; not filed.

Originally observed at LV `2e046d71`; the four unsuppressed R1 FAIL pairs below are historical.
Remeasured at `879c06102` with `--jobs 4`, R0–R3: 153 PASS, 87 UNSUPPORTED, zero FAIL/ERROR across both modes.
R0: 40 PASS; R1: 17 PASS / 23 UNSUPPORTED; R2: 80 PASS; R3: 16 PASS / 64 UNSUPPORTED.
The comparator still returns LV's native first-order values and changes no gate or floor. The defect description
and proof below document the pre-fix behavior; this brief changes no LV source or prescription.

`src/optics/first-order/cardinals.ts:126` computes the front principal position as
`frontVertexZ + objectIndex * (D - 1) / C`. The term `n (D - 1) / C` assumes a matrix determinant of +1.
At `cardinals.ts:213-218`, the folded matrix is built from physical slopes and the unsigned image-space index:
`A = marginal.y`, `B = chief.y`, `C = imageIndex * marginal.u`, `D = imageIndex * chief.u`.
The mirror step at `src/optics/math/paraxial.ts:91` is `u' = -u - 2y/R`; it gives determinant -1 after one
reflection. For matrix determinant `det = A D - B C`, the general front-principal term is
`n (D - det) / C`.

LV's own `reference-spherical-primary-mirror` data states the reference geometry: stop z = 0, mirror z = 100,
R = -200, image z = 0 (all in mm). The closed form is `f = R/2 = -100`, `F = F' = 0`,
`H = H' = +100`, and `EFL = F' - H' = -100`. Both principal planes are the mirror's vertex plane.
LV instead gives front principal z = -100. This reference system is sufficient to reproduce the defect;
no production-lens prescription is needed.

Refractive lenses and all determinant +1 cases must stay bit-identical, including their existing first-order
outputs. Preserve their arithmetic path when introducing determinant handling. The comparator's contract
uses global z positions and `EFL = F' - H'`; it must continue reporting LV's own result without compensation.

Suggested LV regression tests:

- The single-mirror reference above: assert both focal points, both principal planes, EFL and matrix determinant.
- A two-mirror Cassegrain: assert determinant +1 and retain its existing first-order results bit for bit.
- A refractive lens: assert determinant +1 and bit-identical first-order output before and after the fix.
