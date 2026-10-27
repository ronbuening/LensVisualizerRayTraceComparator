import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { KINOFORM } from "../engines/ref/diffractiveFixture.ts";
import { caseInvariantProblems } from "../../src/contract/case.ts";
import { r1Rung, rayTraceRequests } from "../../src/core/rungs.ts";
import { decodeNdArray, encodeF8 } from "../../src/core/numeric/ndarray.ts";
import { buildRefSystem } from "../../src/engines/ref/model.ts";
import { answerRays } from "../../src/engines/ref/rays.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import { raysPathComparator } from "../../src/compare/raysPath.ts";
import type { JsonObject } from "../../src/contract/json.ts";
import { SINGLET_CASE } from "./corpus.ts";
import { requestIdentity } from "../../src/contract/request.ts";
const spec = {
  line: 0,
  origins: encodeF8([0, 2, -3], [1, 3]),
  directions: encodeF8([0, 0, 1], [1, 3]),
  weights: encodeF8([1]),
};
test("quantity versions and contract minor follow content; ordinary request expression is unchanged", () => {
  const r1 = r1Rung.buildRequests(KINOFORM, {} as never)[0];
  assert.equal(r1.quantityVersion, 2);
  assert.equal(r1.contract, "1.5");
  const r3 = rayTraceRequests(KINOFORM, { raySets: [spec] })[0];
  assert.equal(r3.quantityVersion, 3);
  assert.equal(r3.contract, "1.5");
  const ordinary = rayTraceRequests(SINGLET_CASE, { raySets: [spec] })[0];
  assert.equal(ordinary.quantityVersion, undefined);
  assert.equal(ordinary.contract, "1.0");
  assert.equal(ordinary.id, requestIdentity({ caseId: SINGLET_CASE.id, quantity: "rays.trace", spec }));
  assert.ok(caseInvariantProblems(KINOFORM.system, KINOFORM.conditions, "1.4").length);
});
test("v3 phase rows validate their shape, ended rays, unavailable values and lower-version refusal", () => {
  const answer = answerRays(buildRefSystem(KINOFORM), spec);
  assert.ok("data" in answer);
  assert.deepEqual(raysTraceQuantity.validateData(answer.data, 3), []);
  assert.ok(raysTraceQuantity.validateData(answer.data, 2).length);
  const { phasePath: _phase, ...without } = answer.data;
  assert.ok(raysTraceQuantity.validateData(without, 3).length);
  assert.ok(raysTraceQuantity.validateData({ ...answer.data, phasePath: encodeF8([0, 0], [2, 1]) }, 3).length);
  assert.ok(raysTraceQuantity.validateData({ ...answer.data, phasePathUnavailable: "unavailable" }, 3).length);
  assert.equal(decodeNdArray(answer.data.phasePath!).values[0], -0.02);
});
test("R3 measures geometry while LV phase is unsupported, and independently detects a phase-only fault", () => {
  const answer = answerRays(buildRefSystem(KINOFORM), spec);
  assert.ok("data" in answer);
  const context = { opticalCase: KINOFORM, spec };
  const phaseMissing = {
    ...answer.data,
    phasePathUnavailable: "lv-phase-path-unavailable",
    phasePath: encodeF8([NaN], [1, 1]),
  };
  const partial = raysPathComparator.compare(answer.data as JsonObject, phaseMissing, context);
  assert.ok(partial.comparable);
  assert.equal(partial.metrics.find((m) => m.name === "opticalPath.maxAbs")?.value, 0);
  assert.match(partial.unmeasured!.find((m) => m.name === "phasePath.maxAbs")!.reason, /UNSUPPORTED.*lv-phase/);
  const fault = raysPathComparator.compare(
    answer.data,
    { ...answer.data, phasePath: encodeF8([-0.019], [1, 1]) },
    context,
  );
  assert.ok(fault.comparable);
  assert.ok(Math.abs(fault.metrics.find((m) => m.name === "phasePath.maxAbs")!.value - 2) < 1e-12);
  const policy = JSON.parse(readFileSync(new URL("../../policy/rungs.v1.json", import.meta.url), "utf8"));
  assert.equal(policy.version, 19);
  assert.equal(policy.rungs.r3.metrics["phasePath.maxAbs"].tolerance, 2e-5);
});

test("ordinary unavailable geometric paths do not acquire an inapplicable phase metric", () => {
  const answer = answerRays(buildRefSystem(KINOFORM), spec);
  assert.ok("data" in answer);
  const missing = { ...answer.data, pathUnavailable: "lv-folded-optical-path-unavailable" };
  const compared = raysPathComparator.compare(missing, missing, { opticalCase: SINGLET_CASE, spec });
  assert.ok(compared.comparable);
  assert.deepEqual(compared.inapplicable, ["phasePath.maxAbs"]);
  assert.ok(compared.unmeasured?.every((metric) => metric.name !== "phasePath.maxAbs"));
});
