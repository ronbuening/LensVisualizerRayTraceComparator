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
  r0Rung,
  r1Rung,
  r2Rung,
  r3Rung,
  r4Rung,
  r4fRung,
  r5Rung,
  r5gRung,
  r6aRung,
  r6bRung,
  r6cRung,
  r7aRung,
  r7bRung,
  r8aRung,
  r8bRung,
  r9aRung,
  r9bRung,
  r10aRung,
  r10bRung,
  rayTraceRequests,
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

test("the rungs are selftest, r0 to r4, r4f, r5, r5g, r6a to r6c, r7a, r7b, r8a, r8b, r9a, r9b, r10a and r10b, in ladder order, and every rung asks for a quantity the comparator knows", () => {
  assert.deepEqual(
    RUNGS.map((definition) => definition.id),
    [
      "selftest",
      "r0",
      "r1",
      "r2",
      "r3",
      "r4",
      "r4f",
      "r5",
      "r5g",
      "r6a",
      "r6b",
      "r6c",
      "r7a",
      "r7b",
      "r8a",
      "r8b",
      "r9a",
      "r9b",
      "r10a",
      "r10b",
    ],
  );
  assert.deepEqual(
    [...RUNGS],
    [
      selftestRung,
      r0Rung,
      r1Rung,
      r2Rung,
      r3Rung,
      r4Rung,
      r4fRung,
      r5Rung,
      r5gRung,
      r6aRung,
      r6bRung,
      r6cRung,
      r7aRung,
      r7bRung,
      r8aRung,
      r8bRung,
      r9aRung,
      r9bRung,
      r10aRung,
      r10bRung,
    ],
  );
  // The two rungs of the coma and bokeh tabs are made from the run's spot sets, and no other is; the two of the
  // spherical-aberration and axial-colour sections from its axial sets, and no other is.
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsSpotRaySets === true),
    [r7aRung, r7bRung],
  );
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsAxialRaySets === true),
    [r8aRung, r8bRung],
  );
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsChiefRaySets === true),
    [r9aRung, r9bRung],
  );
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsCurvatureRaySets === true),
    [r10aRung, r10bRung],
  );
  // The rungs that trace rays are the four that compare traced rays, and one of them traces a finer lattice too.
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsRaySets === true),
    [r2Rung, r3Rung, r4Rung, r6aRung],
  );
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsFineRaySets === true),
    [r6aRung],
  );
  // Six rungs are made from the run's MTF recipe, and four of them are about engines of their own. Two of
  // those need an engine that is not on every machine, and are run only where they are named.
  assert.deepEqual(
    RUNGS.filter((definition) => definition.needsRecipe === true),
    [r4Rung, r4fRung, r5Rung, r5gRung, r6aRung, r6bRung, r6cRung],
  );
  assert.deepEqual(
    RUNGS.filter((definition) => definition.engines !== undefined),
    [r4fRung, r5Rung, r5gRung, r6bRung, r6cRung, r7bRung, r8bRung, r9bRung, r10bRung],
  );
  assert.deepEqual(
    RUNGS.filter((definition) => definition.onlyWhereNamed === true),
    [r5Rung, r5gRung, r6cRung, r7bRung, r8bRung, r9bRung, r10bRung],
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
  // One case, three rungs, three requests: no two rungs that need no rays ask the same thing.
  const ids = [selftestRung, r0Rung, r1Rung].map((rung) => rung.buildRequests(SINGLET, RUN)[0].id);
  assert.equal(new Set(ids).size, 3);
});

// ── r2 and r3 ────────────────────────────────────────────────────────────────────────────────────────────────────

test("r2 and r3 each build one rays.trace request for each ray set they are handed, in order, and none without sets", () => {
  for (const rung of [r2Rung, r3Rung]) {
    assert.equal(rung.quantity, "rays.trace");
    assert.equal(rung.needsRaySets, true);
    // Without inputs, and with none, there is nothing to ask: the rung reads no engine and no lens for its rays.
    assert.deepEqual(rung.buildRequests(SINGLET, RUN), []);
    assert.deepEqual(rung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  }
  assert.deepEqual(NO_RUNG_INPUTS, { raySets: [], recipe: null });
  assert.ok(Object.isFrozen(NO_RUNG_INPUTS) && Object.isFrozen(NO_RUNG_INPUTS.raySets));

  const raySets = [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }];
  const requests = r2Rung.buildRequests(SINGLET, RUN, { raySets });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.caseId, request.spec, request.engineOptions]),
    raySets.map((spec) => ["rays.trace", SINGLET.id, spec, undefined]),
  );
  for (const request of requests) {
    assert.deepEqual(validateKind("request", request), []);
    assert.deepEqual(QUANTITIES.get("rays.trace")?.validateSpec(request.spec), []);
  }
  assert.deepEqual(rayTraceRequests(SINGLET, { raySets }), requests);
  // The two rungs ask the very same requests: an engine that answered one has answered the other.
  assert.deepEqual(r3Rung.buildRequests(SINGLET, RUN, { raySets }), requests);
});

test("the id of a rays request is the content of its set: the same rays give the same id, any other bit another", () => {
  const raysRung = r2Rung;
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

test("a run that names no rungs gets every rung but those run only where named, in ladder order", () => {
  assert.deepEqual(selectRungs(undefined), [
    selftestRung,
    r0Rung,
    r1Rung,
    r2Rung,
    r3Rung,
    r4Rung,
    r4fRung,
    r6aRung,
    r6bRung,
    r7aRung,
    r8aRung,
    r9aRung,
    r10aRung,
  ]);
  assert.deepEqual(
    selectRungs(undefined),
    RUNGS.filter(
      (definition) =>
        definition !== r5Rung &&
        definition !== r5gRung &&
        definition !== r6cRung &&
        definition !== r7bRung &&
        definition !== r8bRung &&
        definition !== r9bRung &&
        definition !== r10bRung,
    ),
  );
  assert.deepEqual(selectRungs(["r5", "r0"]), [r0Rung, r5Rung]);
  assert.deepEqual(selectRungs(["r5g", "r5"]), [r5Rung, r5gRung]);
  const named: RungDefinition = { ...rung("b"), onlyWhereNamed: true };
  assert.deepEqual(
    selectRungs(undefined, [rung("a"), named]).map((definition) => definition.id),
    ["a"],
  );
  assert.deepEqual(selectRungs(["b"], [rung("a"), named]), [named]);
  const three = [rung("a"), rung("b"), rung("c")];
  assert.deepEqual(selectRungs(undefined, three), three);
  assert.notEqual(selectRungs(undefined, three), three, "a list of its own");
  // A rung that traces rays is a rung like any other, in its place on the ladder.
  assert.deepEqual(selectRungs(["r3", "r0"]), [r0Rung, r3Rung]);
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
    'unknown rung "R0": the rungs are selftest, r0, r1, r2, r3, r4, r4f, r5, r5g, r6a, r6b, r6c, r7a, r7b, r8a, r8b, r9a, r9b, r10a, r10b',
  );
  assert.equal(
    usageError(() => selectRungs(["R4", "selftest", "R0", "R4"])),
    'unknown rungs "R4", "R0": the rungs are selftest, r0, r1, r2, r3, r4, r4f, r5, r5g, r6a, r6b, r6c, r7a, r7b, r8a, r8b, r9a, r9b, r10a, r10b',
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
    "no rung was named: the rungs are selftest, r0, r1, r2, r3, r4, r4f, r5, r5g, r6a, r6b, r6c, r7a, r7b, r8a, r8b, r9a, r9b, r10a, r10b",
  );
});

// ── The rungs of the coma and bokeh tabs ─────────────────────────────────────────────────────────────────────────

test("r7a asks one rays.trace request of each spot set, each set once, and nothing of the run's ray sets", () => {
  const spots = [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }, structuredClone(RAYS_SPEC_SINGLET)];
  const requests = r7aRung.buildRequests(SINGLET, RUN, { raySets: [RAYS_SPEC_LATTICE], spotRaySets: spots });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec]),
    [
      ["rays.trace", RAYS_SPEC_SINGLET],
      ["rays.trace", { ...RAYS_SPEC_LATTICE, line: 0 }],
    ],
  );
  assert.deepEqual(r7aRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.equal(r7aRung.engines, undefined);
  assert.equal(r7aRung.onlyWhereNamed, undefined);
});

test("r7b asks the engines' own spot requests of the tabs, and hands optiland the angles of its spec's fields", () => {
  const coma = {
    spec: {
      line: 0,
      fields: { kind: "half-field-fractions", values: [0, 0.5] },
      pupil: { kind: "rings", rings: [1, 8], weighting: "area" },
    },
    fieldAnglesDeg: [0, 12.5],
  } as const;
  const fan = {
    spec: {
      line: 0,
      fields: { kind: "half-field-fractions", values: [0.7] },
      pupil: { kind: "fan", axis: "sagittal", samples: 51 },
    },
    fieldAnglesDeg: [17.5],
  } as const;
  const inputs = { raySets: [], spotAsks: [coma, fan] };
  const requests = r7bRung.buildRequests(SINGLET, RUN, inputs);
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec, request.engineOptions]),
    [
      ["spot.native", coma.spec, undefined],
      ["spot.native", fan.spec, undefined],
    ],
  );
  for (const request of requests) assert.ok(QUANTITIES.get("spot.native")?.validateSpec(request.spec).length === 0);
  assert.deepEqual(
    requests.map((request) => r7bRung.engineOptions?.(RUN, inputs, "optiland", request)),
    [{ fieldAnglesDeg: [0, 12.5] }, { fieldAnglesDeg: [17.5] }],
  );
  assert.equal(r7bRung.engineOptions?.(RUN, inputs, "lv", requests[0]), undefined);
  assert.deepEqual(r7bRung.engines, ["lv", "optiland"]);
  assert.equal(r7bRung.onlyWhereNamed, true);
});

// ── The rungs of the spherical-aberration and axial-colour sections ───────────────────────────────────────────────

test("r8a asks one rays.trace request of each axial set, each set once, and nothing of the run's ray sets", () => {
  const axial = [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }, structuredClone(RAYS_SPEC_SINGLET)];
  const requests = r8aRung.buildRequests(SINGLET, RUN, { raySets: [RAYS_SPEC_LATTICE], axialRaySets: axial });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec]),
    [
      ["rays.trace", RAYS_SPEC_SINGLET],
      ["rays.trace", { ...RAYS_SPEC_LATTICE, line: 0 }],
    ],
  );
  assert.deepEqual(r8aRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.equal(r8aRung.engines, undefined);
  assert.equal(r8aRung.onlyWhereNamed, undefined);
});

test("r8b asks the engines' own axial requests of the two sections, of lv and optiland only, where it is named", () => {
  const spherical = {
    kind: "spherical",
    lines: [0],
    nearAxis: 0.1,
    marginal: [0.97, 0.95],
    profile: [0.1, 0.5],
  } as const;
  const colour = { kind: "colour", lines: [0, 1], marginal: [0.97, 0.95] } as const;
  const inputs = { raySets: [], axialAsks: [spherical, colour] };
  const requests = r8bRung.buildRequests(SINGLET, RUN, inputs);
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec, request.engineOptions]),
    [
      ["axial.native", spherical, undefined],
      ["axial.native", colour, undefined],
    ],
  );
  for (const request of requests) assert.deepEqual(QUANTITIES.get("axial.native")?.validateSpec(request.spec), []);
  assert.deepEqual(r8bRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.deepEqual(r8bRung.engines, ["lv", "optiland"]);
  assert.equal(r8bRung.onlyWhereNamed, true);
});

// ── The rungs of the distortion, pupils and lateral-colour tabs ──────────────────────────────────────────────────

test("r9a asks one rays.trace request of each chief set, each set once, and nothing of the run's ray sets", () => {
  const chief = [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }, structuredClone(RAYS_SPEC_SINGLET)];
  const requests = r9aRung.buildRequests(SINGLET, RUN, { raySets: [RAYS_SPEC_LATTICE], chiefRaySets: chief });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec]),
    [
      ["rays.trace", RAYS_SPEC_SINGLET],
      ["rays.trace", { ...RAYS_SPEC_LATTICE, line: 0 }],
    ],
  );
  assert.deepEqual(r9aRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.equal(r9aRung.engines, undefined);
  assert.equal(r9aRung.onlyWhereNamed, undefined);
});

test("r9b asks the engines' own chief-ray requests of the three tabs, of lv and optiland only, where it is named", () => {
  const distortion = { kind: "distortion", lines: [0], maxFieldDeg: 20, fieldAnglesDeg: [5, 10, 20] } as const;
  const lateral = { kind: "lateral-colour", lines: [0, 1], maxFieldDeg: 20, fieldAnglesDeg: [0, 10] } as const;
  const inputs = { raySets: [], chiefAsks: [distortion, lateral] };
  const requests = r9bRung.buildRequests(SINGLET, RUN, inputs);
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec, request.engineOptions]),
    [
      ["chief.native", distortion, undefined],
      ["chief.native", lateral, undefined],
    ],
  );
  for (const request of requests) assert.deepEqual(QUANTITIES.get("chief.native")?.validateSpec(request.spec), []);
  assert.deepEqual(r9bRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.deepEqual(r9bRung.engines, ["lv", "optiland"]);
  assert.equal(r9bRung.onlyWhereNamed, true);
});

// ── The rungs of the field-curve sections ────────────────────────────────────────────────────────────────────────

test("r10a asks one rays.trace request of each curvature set, each set once, and nothing of the run's ray sets", () => {
  const curvature = [RAYS_SPEC_SINGLET, { ...RAYS_SPEC_LATTICE, line: 0 }, structuredClone(RAYS_SPEC_SINGLET)];
  const requests = r10aRung.buildRequests(SINGLET, RUN, { raySets: [RAYS_SPEC_LATTICE], curvatureRaySets: curvature });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec]),
    [
      ["rays.trace", RAYS_SPEC_SINGLET],
      ["rays.trace", { ...RAYS_SPEC_LATTICE, line: 0 }],
    ],
  );
  assert.deepEqual(r10aRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.deepEqual(r10aRung.buildRequests(SINGLET, RUN, { raySets: [], chiefRaySets: curvature }), []);
  assert.equal(r10aRung.engines, undefined);
  assert.equal(r10aRung.onlyWhereNamed, undefined);
});

test("r10b asks the engines' own field-curve request of the sections, of lv and optiland only, where it is named", () => {
  const ask = { lines: [0, 1], maxFieldDeg: 20, fieldAnglesDeg: [0, 5, 10, 15, 20] };
  const requests = r10bRung.buildRequests(SINGLET, RUN, { raySets: [], curvatureAsks: [ask] });
  assert.deepEqual(
    requests.map((request) => [request.quantity, request.spec, request.engineOptions]),
    [["curvature.native", ask, undefined]],
  );
  for (const request of requests) assert.deepEqual(QUANTITIES.get("curvature.native")?.validateSpec(request.spec), []);
  assert.deepEqual(r10bRung.buildRequests(SINGLET, RUN, NO_RUNG_INPUTS), []);
  assert.deepEqual(r10bRung.engines, ["lv", "optiland"]);
  assert.equal(r10bRung.onlyWhereNamed, true);
});
