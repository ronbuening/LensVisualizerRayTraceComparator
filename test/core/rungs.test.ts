import assert from "node:assert/strict";
import { test } from "node:test";

import { verifyCaseIdentity } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { PARAXIAL_FIRST_ORDER } from "../../src/contract/quantities/paraxialFirstOrder.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../../src/contract/quantities/selftestEcho.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../../src/contract/quantities/systemDescribe.ts";
import type { SystemDescribeSpec } from "../../src/contract/quantities/systemDescribe.ts";
import type { RunSpec } from "../../src/contract/runSpec.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { decodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import {
  NO_RUNG_INPUTS,
  RUNGS,
  judgedRungs,
  r0Rung,
  r1Rung,
  rayTraceRequests,
  raysRung,
  selectRungs,
  selftestRung,
} from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { ALL_FEATURES_CASE, RAYS_SPEC_LATTICE, RAYS_SPEC_SINGLET } from "../contract/corpus.ts";
import { DOUBLE_GAUSS, SINGLET, fakeEngine } from "./support.ts";

const RUN: RunSpec = {
  contract: CONTRACT_VERSION,
  kind: "run-spec",
  name: "a-run",
  lens: { kind: "fixture", path: "case.json" },
};

function rung(id: string): RungDefinition {
  return { id, quantity: SELFTEST_ECHO, buildRequests: () => [] };
}

/** The message of the `UsageError` that `select` must throw. */
function usageError(select: () => unknown): string {
  try {
    select();
  } catch (error) {
    assert.ok(error instanceof UsageError, String(error));
    return error.message;
  }
  return assert.fail("nothing was thrown; expected a UsageError");
}

// ── The registry ─────────────────────────────────────────────────────────────────────────────────────────────────

test("the rungs are selftest, r0, r1 and rays, in ladder order, and every rung asks for a quantity the comparator knows", () => {
  assert.deepEqual(
    RUNGS.map((definition) => definition.id),
    ["selftest", "r0", "r1", "rays"],
  );
  assert.deepEqual([...RUNGS], [selftestRung, r0Rung, r1Rung, raysRung]);
  // The rungs that are judged are the ones a run gets without naming any; rays is run only where it is named.
  assert.deepEqual(judgedRungs(), [selftestRung, r0Rung, r1Rung]);
  assert.deepEqual(
    RUNGS.filter((definition) => definition.onlyWhenNamed === true),
    [raysRung],
  );
  assert.equal(new Set(RUNGS.map((definition) => definition.id)).size, RUNGS.length);
  for (const definition of RUNGS) assert.ok(QUANTITIES.has(definition.quantity), definition.id);
  assert.ok(Object.isFrozen(RUNGS));
});

// ── selftest ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("selftest builds one selftest.echo request: every vertex z, then the stop semi-diameter, at scale 1", () => {
  assert.equal(selftestRung.quantity, SELFTEST_ECHO);
  const requests = selftestRung.buildRequests(SINGLET, RUN);
  assert.equal(requests.length, 1);
  const [request] = requests;
  assert.deepEqual(validateKind("request", request), []);
  assert.equal(request.quantity, SELFTEST_ECHO);
  assert.equal(request.caseId, SINGLET.id);
  assert.equal(request.engineOptions, undefined);
  assert.deepEqual(QUANTITIES.get(SELFTEST_ECHO)?.validateSpec(request.spec), []);

  const spec = request.spec as SelftestEchoSpec;
  assert.equal(spec.scale, 1);
  const values = decodeNdArray(spec.values);
  assert.deepEqual(values.shape, [3]);
  assert.deepEqual([...values.values], [0, 4, 5]);

  const gauss = decodeNdArray((selftestRung.buildRequests(DOUBLE_GAUSS, RUN)[0].spec as SelftestEchoSpec).values);
  const { surfaces } = DOUBLE_GAUSS.system;
  assert.deepEqual(gauss.shape, [surfaces.length + 1]);
  assert.deepEqual([...gauss.values], [...surfaces.map((surface) => surface.z), 6.341241012139779]);
});

test("selftest is a function of the case: equal cases give equal requests, different cases different ones", () => {
  const again = { ...RUN, name: "another-run", fields: { kind: "angles-deg", values: [0, 10] } } as const;
  assert.deepEqual(selftestRung.buildRequests(SINGLET, RUN), selftestRung.buildRequests(SINGLET, again));
  const ids = [SINGLET, DOUBLE_GAUSS, ALL_FEATURES_CASE].map((each) => selftestRung.buildRequests(each, RUN)[0].id);
  assert.equal(new Set(ids).size, 3);
});

test("selftest reads -0 as a case's identity does: a case that spells a vertex -0 gives the same request", () => {
  // The first vertex written as -0, as a case source that computes it may: the same case, with the same id.
  const spelled: OpticalCase = JSON.parse(JSON.stringify(SINGLET).replace('"z":0,', '"z":-0,'));
  assert.ok(Object.is(spelled.system.surfaces[0].z, -0));
  assert.deepEqual(verifyCaseIdentity(spelled), []);
  assert.equal(spelled.id, SINGLET.id);

  const [request] = selftestRung.buildRequests(spelled, RUN);
  assert.deepEqual(request, selftestRung.buildRequests(SINGLET, RUN)[0]);
  const { values } = decodeNdArray((request.spec as SelftestEchoSpec).values);
  assert.ok(Object.is(values[0], 0), "the element is 0, not -0");
});

test("an engine that conforms sends a selftest request's elements back unchanged", async (t) => {
  const adapter = await fakeEngine()("fake-a");
  t.after(() => adapter.close());
  for (const opticalCase of [SINGLET, DOUBLE_GAUSS]) {
    const [request] = selftestRung.buildRequests(opticalCase, RUN);
    const result = await adapter.run(request, opticalCase);
    assert.equal(result.status, "ok");
    assert.deepEqual((result.data as SelftestEchoData).values, (request.spec as SelftestEchoSpec).values);
  }
});

// ── r0 and r1 ────────────────────────────────────────────────────────────────────────────────────────────────────

test("r0 builds one system.describe request that states the nine default sag fractions", () => {
  assert.equal(r0Rung.quantity, SYSTEM_DESCRIBE);
  const requests = r0Rung.buildRequests(DOUBLE_GAUSS, RUN);
  assert.equal(requests.length, 1);
  const [request] = requests;
  assert.deepEqual(validateKind("request", request), []);
  assert.equal(request.caseId, DOUBLE_GAUSS.id);
  assert.equal(request.engineOptions, undefined);
  assert.deepEqual(request.spec, { sagFractions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1] });
  assert.deepEqual(request.spec, { sagFractions: DEFAULT_SAG_FRACTIONS });
  assert.deepEqual(QUANTITIES.get(SYSTEM_DESCRIBE)?.validateSpec(request.spec), []);
  // The rung's list is its own: the default cannot be changed through a request.
  assert.notEqual((request.spec as SystemDescribeSpec).sagFractions, DEFAULT_SAG_FRACTIONS);
  assert.ok(Object.isFrozen(DEFAULT_SAG_FRACTIONS));
});

test("r1 builds one paraxial.first-order request with the empty spec", () => {
  assert.equal(r1Rung.quantity, PARAXIAL_FIRST_ORDER);
  const requests = r1Rung.buildRequests(SINGLET, RUN);
  assert.equal(requests.length, 1);
  assert.deepEqual(validateKind("request", requests[0]), []);
  assert.equal(requests[0].caseId, SINGLET.id);
  assert.deepEqual(requests[0].spec, {});
  assert.deepEqual(QUANTITIES.get(PARAXIAL_FIRST_ORDER)?.validateSpec(requests[0].spec), []);
});

test("r0 and r1 are functions of the case alone: equal cases give equal requests, different cases different ones", () => {
  const again = { ...RUN, name: "another-run", aperture: { kind: "f-number", value: 8 } } as const;
  for (const rung of [r0Rung, r1Rung]) {
    assert.deepEqual(rung.buildRequests(SINGLET, RUN), rung.buildRequests(SINGLET, again), rung.id);
    const ids = [SINGLET, DOUBLE_GAUSS, ALL_FEATURES_CASE].map((each) => rung.buildRequests(each, RUN)[0].id);
    assert.equal(new Set(ids).size, 3, rung.id);
  }
  // One case, three rungs, three requests: no two rungs ask the same thing.
  const ids = judgedRungs().map((rung) => rung.buildRequests(SINGLET, RUN)[0].id);
  assert.equal(new Set(ids).size, 3);
});

// ── rays ─────────────────────────────────────────────────────────────────────────────────────────────────────────

test("rays builds one rays.trace request for each ray set it is handed, in their order, and none without sets", () => {
  assert.equal(raysRung.quantity, "rays.trace");
  assert.equal(raysRung.needsRaySets, true);
  assert.equal(raysRung.onlyWhenNamed, true);
  // Without inputs, and with none, there is nothing to ask: the rung reads no engine and no lens for its rays.
  assert.deepEqual(raysRung.buildRequests(SINGLET, RUN), []);
  assert.deepEqual(raysRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.deepEqual(NO_RUNG_INPUTS, { raySets: [] });
  assert.ok(Object.isFrozen(NO_RUNG_INPUTS) && Object.isFrozen(NO_RUNG_INPUTS.raySets));

  const raySets = [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }];
  const requests = raysRung.buildRequests(SINGLET, RUN, { raySets });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.caseId, request.spec, request.engineOptions]),
    raySets.map((spec) => ["rays.trace", SINGLET.id, spec, undefined]),
  );
  for (const request of requests) {
    assert.deepEqual(validateKind("request", request), []);
    assert.deepEqual(QUANTITIES.get("rays.trace")?.validateSpec(request.spec), []);
  }
  assert.deepEqual(rayTraceRequests(SINGLET, { raySets }), requests);
});

test("the id of a rays request is the content of its set: the same rays give the same id, any other bit another", () => {
  const idOf = (spec: typeof RAYS_SPEC_SINGLET, opticalCase: OpticalCase = SINGLET): string =>
    raysRung.buildRequests(opticalCase, RUN, { raySets: [spec] })[0].id;
  const id = idOf(RAYS_SPEC_SINGLET);
  // A copy with its keys in another order is the same set; the run it is traced for does not enter.
  const { weights, directions, origins, line } = structuredClone(RAYS_SPEC_SINGLET);
  assert.equal(idOf({ weights, directions, origins, line }), id);
  const again = { ...RUN, name: "another-run", fields: { kind: "angles-deg", values: [3] } } as const;
  assert.equal(raysRung.buildRequests(SINGLET, again, { raySets: [RAYS_SPEC_SINGLET] })[0].id, id);

  const moved = encodeNdArray(Float64Array.of(0, 0, -10, 0, 12.000000000000002, -10), [2, 3]);
  const others = [
    idOf({ ...RAYS_SPEC_SINGLET, origins: moved }),
    idOf({ ...RAYS_SPEC_SINGLET, weights: encodeNdArray(Float64Array.of(1, 0)) }),
    idOf({ ...RAYS_SPEC_SINGLET, line: 1 }),
    idOf({ ...RAYS_SPEC_SINGLET, groups: { chiefIndex: 0 } } as typeof RAYS_SPEC_SINGLET),
    idOf(RAYS_SPEC_SINGLET, DOUBLE_GAUSS),
  ];
  assert.equal(new Set([id, ...others]).size, 6);
  // A set that is handed over twice is asked for once, in the place of the first.
  const twice = raysRung.buildRequests(SINGLET, RUN, {
    raySets: [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }, structuredClone(RAYS_SPEC_SINGLET)],
  });
  assert.deepEqual(
    twice.map((request) => request.id),
    [id, idOf({ ...RAYS_SPEC_LATTICE, line: 0 } as unknown as typeof RAYS_SPEC_SINGLET)],
  );
});

// ── Selection ────────────────────────────────────────────────────────────────────────────────────────────────────

test("a run that names no rungs gets every rung that is judged, and none that is run only where it is named", () => {
  assert.deepEqual(selectRungs(undefined), [selftestRung, r0Rung, r1Rung]);
  assert.deepEqual(selectRungs(undefined), judgedRungs());
  const three = [rung("a"), rung("b"), rung("c")];
  assert.deepEqual(selectRungs(undefined, three), three);
  assert.notEqual(selectRungs(undefined, three), three, "a list of its own");
  const named = { ...rung("b"), onlyWhenNamed: true };
  assert.deepEqual(selectRungs(undefined, [three[0], named, three[2]]), [three[0], three[2]]);
  assert.deepEqual(selectRungs(["b", "a"], [three[0], named, three[2]]), [three[0], named]);
  // rays is a rung like any other once it is named, in its place on the ladder.
  assert.deepEqual(selectRungs(["rays", "r0"]), [r0Rung, raysRung]);
});

test("named rungs come in ladder order, each once, however they were named", () => {
  assert.deepEqual(selectRungs(["selftest"]), [selftestRung]);
  assert.deepEqual(selectRungs(["r1", "selftest", "r0", "r1"]), [selftestRung, r0Rung, r1Rung]);
  const three = [rung("a"), rung("b"), rung("c")];
  const ids = (selected: RungDefinition[]): string[] => selected.map((definition) => definition.id);
  assert.deepEqual(ids(selectRungs(["c", "a"], three)), ["a", "c"]);
  assert.deepEqual(ids(selectRungs(["b", "b", "a", "b"], three)), ["a", "b"]);
  assert.deepEqual(ids(selectRungs(["c", "b", "a"], three)), ["a", "b", "c"]);
});

test("an unknown rung is a usage error that names it and lists the rungs there are", () => {
  assert.equal(
    usageError(() => selectRungs(["R0"])),
    'unknown rung "R0": the rungs are selftest, r0, r1, rays',
  );
  assert.equal(
    usageError(() => selectRungs(["R4", "selftest", "R0", "R4"])),
    'unknown rungs "R4", "R0": the rungs are selftest, r0, r1, rays',
  );
  const three = [rung("a"), rung("b"), rung("c")];
  assert.equal(
    usageError(() => selectRungs(["a", "d"], three)),
    'unknown rung "d": the rungs are a, b, c',
  );
  // Ids are compared exactly, and a name every object inherits is not a rung.
  assert.match(
    usageError(() => selectRungs(["Selftest"])),
    /unknown rung "Selftest"/,
  );
  assert.match(
    usageError(() => selectRungs(["constructor"])),
    /unknown rung "constructor"/,
  );
  assert.match(
    usageError(() => selectRungs([""])),
    /unknown rung ""/,
  );
});

test("naming no rung at all is a usage error", () => {
  assert.equal(
    usageError(() => selectRungs([])),
    "no rung was named: the rungs are selftest, r0, r1, rays",
  );
});
