import assert from "node:assert/strict";
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { answerLvRays } from "../../../src/engines/lv/rays.ts";
import { answerLvFirstOrder } from "../../../src/engines/lv/firstOrder.ts";
import { exportPhase } from "../../../src/engines/lv/exportPhase.ts";
import { decodeNdArray, encodeF8 } from "../../../src/core/numeric/ndarray.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { freshLv, bind } from "./support.ts";

test("fake prepared diffractive state: literal phase, own trace and first order, no fabricated phase path", async (t) => {
  const lv = freshLv(t);
  mkdirSync(join(lv, "src/lens-data/zz-diffractive"), { recursive: true });
  copyFileSync(join(lv, "diffractive-lens.ts"), join(lv, "src/lens-data/zz-diffractive/Diffractive.data.ts"));
  const binding = await bind(t, lv);
  const made = await createLvExporter(binding).exportLens("zz-diffractive", {});
  assert.ok(made.ok);
  assert.equal(made.opticalCase.contract, "1.5");
  const model = await rebuildCase(binding, createLensBuilder(binding), made.opticalCase);
  assert.ok(model.ok);
  const phase = made.opticalCase.system.surfaces[0].diffractive!;
  assert.deepEqual(phase.terms, [{ radialPower: 2, coefficient: -0.005 }]);
  const answer = answerLvRays(binding.api, model.model, {
    line: 0,
    origins: encodeF8([0, 2, -3], [1, 3]),
    directions: encodeF8([0, 0, 1], [1, 3]),
    weights: encodeF8([1]),
  });
  assert.ok("data" in answer);
  assert.deepEqual(raysTraceQuantity.validateData(answer.data, 3), []);
  assert.equal(decodeNdArray(answer.data.opticalPath).values[0], 3);
  assert.match(answer.data.phasePathUnavailable!, /^lv-phase-path-unavailable:/);
  assert.ok(decodeNdArray(answer.data.phasePath!).values.every(Number.isNaN));
  const first = answerLvFirstOrder(binding.api, model.model);
  assert.ok(first.supported);
  assert.ok(Math.abs(decodeNdArray(first.data.efl).values[0] - 100) < 1e-12);
});
test("every unexpressible prepared phase is a coded refusal, including coefficient-cache drift", () => {
  const good = {
    kind: "radial-polynomial",
    referenceWavelengthNm: 500,
    diffractionOrder: 1,
    quadraticCoefficient: -0.125,
    terms: [{ radialPower: 2, coefficient: -0.125, derivativeCoefficient: -0.25 }],
  };
  assert.ok(exportPhase(good).phase);
  for (const changed of [
    { ...good, normalizationRadius: 10 },
    { ...good, quadraticCoefficient: 0 },
    { ...good, terms: [{ ...good.terms[0], derivativeCoefficient: 0 }] },
    { ...good, diffractionOrder: 0.5 },
    { ...good, referenceWavelengthNm: 0 },
  ])
    assert.equal(exportPhase(changed).problem?.code, "diffractive-phase-unsupported");
});

test("odd prepared phase powers remain literal rather than being assigned an even slot", () => {
  const odd = {
    kind: "radial-polynomial",
    referenceWavelengthNm: 500,
    diffractionOrder: 1,
    quadraticCoefficient: 0,
    terms: [{ radialPower: 3, coefficient: -0.01, derivativeCoefficient: -0.03 }],
  };
  assert.deepEqual(exportPhase(odd).phase?.terms, [{ radialPower: 3, coefficient: -0.01 }]);
});
