import assert from "node:assert/strict";
import { test } from "node:test";

import { verifyCaseIdentity } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { SELFTEST_ECHO } from "../../src/contract/quantities/selftestEcho.ts";
import type { SelftestEchoData, SelftestEchoSpec } from "../../src/contract/quantities/selftestEcho.ts";
import type { RunSpec } from "../../src/contract/runSpec.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { decodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { RUNGS, selectRungs, selftestRung } from "../../src/core/rungs.ts";
import type { RungDefinition } from "../../src/core/rungs.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { QUANTITIES } from "../../src/quantities/index.ts";
import { ALL_FEATURES_CASE } from "../contract/corpus.ts";
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

test("Phase 0 has exactly one rung, selftest, and every rung asks for a quantity the comparator knows", () => {
  assert.deepEqual(
    RUNGS.map((definition) => definition.id),
    ["selftest"],
  );
  assert.equal(RUNGS[0], selftestRung);
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

// ── Selection ────────────────────────────────────────────────────────────────────────────────────────────────────

test("a run that names no rungs gets every rung", () => {
  assert.deepEqual(selectRungs(undefined), [...RUNGS]);
  assert.notEqual(selectRungs(undefined), RUNGS, "a list of its own");
  const three = [rung("a"), rung("b"), rung("c")];
  assert.deepEqual(selectRungs(undefined, three), three);
});

test("named rungs come in ladder order, each once, however they were named", () => {
  assert.deepEqual(selectRungs(["selftest"]), [selftestRung]);
  const three = [rung("a"), rung("b"), rung("c")];
  const ids = (selected: RungDefinition[]): string[] => selected.map((definition) => definition.id);
  assert.deepEqual(ids(selectRungs(["c", "a"], three)), ["a", "c"]);
  assert.deepEqual(ids(selectRungs(["b", "b", "a", "b"], three)), ["a", "b"]);
  assert.deepEqual(ids(selectRungs(["c", "b", "a"], three)), ["a", "b", "c"]);
});

test("an unknown rung is a usage error that names it and lists the rungs there are", () => {
  assert.equal(
    usageError(() => selectRungs(["R0"])),
    'unknown rung "R0": the rungs are selftest',
  );
  assert.equal(
    usageError(() => selectRungs(["R4", "selftest", "R0", "R4"])),
    'unknown rungs "R4", "R0": the rungs are selftest',
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
    "no rung was named: the rungs are selftest",
  );
});
