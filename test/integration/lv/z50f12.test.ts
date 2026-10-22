// The fixed-grid diagnostic must call the real LV estimator and reproduce its adaptive column at that grid.
// No prescription is pinned. Measured on LV ab0fd4cf, closure 94778d3d (the comparison is structural on other LV).
import assert from "node:assert/strict";
import { test } from "node:test";
import type { MtfNativeSpec } from "../../../src/contract/quantities/mtfNative.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { answerLvMtf } from "../../../src/engines/lv/mtf.ts";
import { lvFieldRays, lvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

test("fixed-grid sheared diagnostic equals LV's product on its chosen lattice", { skip: LV_UNAVAILABLE }, async (t) => {
  const binding = await loadLvBinding(LV_PATH);
  t.after(() => binding.close());
  const made = await createLvExporter(binding).exportLens("nikkor-z50f12", {
    aperture: { kind: "lv-f8-comparison" },
    lines: { kind: "reference" },
  });
  assert.ok(made.ok);
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), made.opticalCase);
  assert.ok(rebuilt.ok);
  const spec: MtfNativeSpec = {
    fields: { kind: "image-height-fractions", values: [0.5, 1] },
    frequenciesPerMm: [0, 10, 30, 50, 100],
    method: "diffraction",
    focus: "design",
  };
  const result = answerLvMtf(binding.api, rebuilt.model, spec);
  assert.ok("data" in result);
  const setup = lvLaunchSetup(binding.api, rebuilt.model);
  assert.ok(!("problem" in setup));
  for (const field of result.data.fields) {
    assert.notEqual(field.fieldAngleDeg, null);
    const rays = lvFieldRays(binding.api, rebuilt.model, setup, field.fieldAngleDeg as number, field.sampling.gridSize);
    assert.ok(!("problem" in rays));
    const bundle = binding.api.traceMtfBundle(
      rebuilt.model.state,
      setup.options,
      setup.support,
      rays.launch,
      rays.footprint,
      field.sampling.gridSize,
      setup.support.spectralLines[0],
      made.opticalCase.conditions.imageZ,
    );
    assert.ok(bundle);
    assert.ok(!Object.values(bundle.openBorders).some(Boolean));
    const otf = binding.api.shearedOtf(
      bundle,
      bundle.chief,
      made.opticalCase.conditions.lines[0].wavelengthNm * 1e-6,
      spec.frequenciesPerMm,
    );
    for (const cut of ["sagittal", "tangential"] as const) {
      const expected = decodeNdArray(field[cut]).values;
      otf[cut].real.forEach((real, i) =>
        assert.ok(Math.abs(Math.hypot(real, otf[cut].imaginary[i]) - expected[i]) < 1e-12),
      );
    }
  }
});
