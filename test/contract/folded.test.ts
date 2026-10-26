import assert from "node:assert/strict";
import test from "node:test";
import { caseInvariantProblems } from "../../src/contract/case.ts";
import { makeRequest, requestIdentity } from "../../src/contract/request.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { negotiate } from "../../src/core/negotiate.ts";
import { refDescriptor } from "../../src/engines/ref/engine.ts";
import { rayTraceRequests } from "../../src/core/rungs.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { raysTraceQuantity } from "../../src/quantities/raysTrace.ts";
import { decodeNdArray, encodeF8, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { answerRays } from "../../src/engines/ref/rays.ts";
import { buildRefSystem } from "../../src/engines/ref/model.ts";
import { raysGeometryComparator } from "../../src/compare/raysGeometry.ts";
import { raysPathComparator } from "../../src/compare/raysPath.ts";
import { RAYS_SPEC_SINGLET, SINGLET_CASE } from "./corpus.ts";
import { MANGIN } from "../engines/ref/foldedFixture.ts";

const spec = {
  line: 0,
  origins: encodeF8([0, 5, -10], [1, 3]),
  directions: encodeF8([0, 0, 1], [1, 3]),
  weights: encodeF8([1]),
};

test("only folded requests carry quantityVersion: v1 identity stays exactly the original hash", () => {
  const [ordinary] = rayTraceRequests(SINGLET_CASE, { raySets: [RAYS_SPEC_SINGLET] });
  assert.equal(ordinary.contract, "1.0");
  assert.ok(!Object.hasOwn(ordinary, "quantityVersion"));
  assert.equal(
    ordinary.id,
    hashCanonical({ caseId: SINGLET_CASE.id, quantity: "rays.trace", spec: RAYS_SPEC_SINGLET }),
  );
  const [folded] = rayTraceRequests(MANGIN, { raySets: [spec] });
  assert.equal(folded.contract, "1.4");
  assert.equal(folded.quantityVersion, 2);
  assert.notEqual(folded.id, requestIdentity({ ...folded, quantityVersion: undefined }));
  assert.deepEqual(negotiate(MANGIN, folded, refDescriptor(), 1), []);
  const descriptor = refDescriptor();
  const v1Only = {
    ...descriptor,
    capabilities: {
      ...descriptor.capabilities,
      quantities: { ...descriptor.capabilities.quantities, "rays.trace": { version: 1 } },
    },
  };
  assert.ok(negotiate(MANGIN, folded, v1Only, 1).some(({ code }) => code === "quantity"));
  assert.ok(
    negotiate(MANGIN, makeRequest({ caseId: MANGIN.id, quantity: "rays.trace", spec }), refDescriptor()).some(
      ({ code }) => code === "quantity",
    ),
  );
  assert.ok(validateKind("request", { ...folded, contract: "1.0" }).some(({ path }) => path === "/quantityVersion"));
});

test("minor 4 rejects missing, out-of-range, and inapplicable medium references", () => {
  const problems = (path: typeof MANGIN.system.opticalPath, contract = "1.4") =>
    caseInvariantProblems({ ...MANGIN.system, opticalPath: path }, MANGIN.conditions, contract);
  assert.ok(problems(MANGIN.system.opticalPath, "1.2").length);
  assert.ok(problems([{ surfaceIndex: 100, interaction: "reflect" }]).length);
  assert.ok(problems([{ surfaceIndex: 0, interaction: "refract" }]).length);
  assert.ok(problems([{ surfaceIndex: 0, interaction: "refract", mediumAfter: 100 }]).length);
  assert.ok(problems([{ surfaceIndex: 0, interaction: "pass", mediumAfter: null }]).length);
});

test("v2 compares visits of a repeated surface and distinguishes unavailable OPL from zero", () => {
  const answer = answerRays(buildRefSystem(MANGIN), spec);
  assert.ok("data" in answer);
  assert.equal(answer.data.hits.$nd.shape[0], 3);
  assert.equal(MANGIN.system.surfaces.length, 2);
  assert.deepEqual(raysTraceQuantity.validateData(answer.data, 2), []);
  const geometry = raysGeometryComparator.compare(answer.data, answer.data, { opticalCase: MANGIN, spec });
  assert.ok(geometry.comparable);
  assert.ok(geometry.metrics.every(({ value }) => value === 0 || value === 1));
  const missing = {
    ...answer.data,
    pathUnavailable: "lv-folded-optical-path-unavailable",
    opticalPath: encodeF8([NaN]),
    opticalPathToImage: encodeF8([NaN]),
  };
  assert.deepEqual(raysTraceQuantity.validateData(missing, 2), []);
  assert.ok(raysTraceQuantity.validateData(missing, 1).length);
  const path = raysPathComparator.compare(answer.data, missing, { opticalCase: MANGIN, spec });
  assert.ok(path.comparable);
  assert.equal(path.metrics.length, 0);
  assert.equal(path.unmeasured?.length, 3);
  assert.ok(Number.isFinite(decodeNdArray(answer.data.opticalPath).values[0]));
});

test("v2 unrecorded visits: NaN exactly where flagged, never at the end or the exit visit, refused in v1, skipped by R2", () => {
  // The ray at height 5 through the Mangin: three visits, each recorded by ref.
  const answer = answerRays(buildRefSystem(MANGIN), spec);
  assert.ok("data" in answer);
  const hits = Float64Array.from(decodeNdArray(answer.data.hits).values);
  const withFlags = (flags: number[], blank: number[]) => {
    const edited = Float64Array.from(hits);
    for (const visit of blank) edited.fill(NaN, 3 * visit, 3 * visit + 3);
    return {
      ...answer.data,
      hits: encodeNdArray(edited, [3, 1, 3]),
      unrecordedHits: encodeNdArray(Uint8Array.from(flags), [3, 1]),
    };
  };
  const unrecorded = withFlags([0, 1, 0], [1]);
  assert.deepEqual(raysTraceQuantity.validateData(unrecorded, 2), []);
  assert.deepEqual(
    raysTraceQuantity.validateData(unrecorded, 1).map(({ path }) => path),
    ["/unrecordedHits"],
  );
  // A flag with a point, a point missing without a flag, and the exit visit flagged are each refused.
  for (const [flags, blank, path] of [
    [[0, 1, 0], [], "/hits"],
    [[0, 0, 0], [1], "/hits"],
    [[0, 0, 1], [2], "/unrecordedHits"],
    [[0, 2, 0], [1], "/unrecordedHits"],
  ] as const) {
    const issues = raysTraceQuantity.validateData(withFlags([...flags], [...blank]), 2);
    assert.deepEqual(
      issues.map((issue) => issue.path),
      [path],
      JSON.stringify(flags),
    );
  }
  // R2 compares every other visit, the exit direction and the landing; the unrecorded point is no metric.
  const moved = Float64Array.from(decodeNdArray(unrecorded.hits).values);
  const geometry = raysGeometryComparator.compare(answer.data, unrecorded, { opticalCase: MANGIN, spec });
  assert.ok(geometry.comparable);
  assert.equal(geometry.metrics.find(({ name }) => name === "hits.maxDistance")?.value, 0);
  assert.ok(Number.isNaN(moved[3]));
  assert.deepEqual(raysGeometryComparator.recorded?.(unrecorded)["hits.unrecorded"], [1]);
  assert.equal(raysGeometryComparator.recorded?.(answer.data)["hits.unrecorded"], undefined);
});
