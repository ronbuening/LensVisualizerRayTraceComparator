// The request-id snapshot (`requestSnapshot.ts`): every check's requests and options, planned on the fake
// LensVisualizer tree, held byte for byte to test/fixtures/request-snapshot.json. A rename of a check or an engine id
// must leave every request id and every option where it is; `node test/core/writeRequestSnapshot.ts` rewrites the file
// after a change that is meant to move one.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { requestIdentity } from "../../src/contract/request.ts";
import { LEGACY_CHECK_IDS, LEGACY_ENGINE_IDS } from "../../src/core/legacyIds.ts";
import { RUNGS } from "../../src/core/rungs.ts";
import { storeKey } from "../../src/core/resultStore.ts";
import { bind, freshLv } from "../engines/lv/support.ts";
import { SNAPSHOT_ENGINES, SNAPSHOT_FILE, UNCOVERED, heldPart, snapshotOf, snapshotText } from "./requestSnapshot.ts";
import type { RequestSnapshot } from "./requestSnapshot.ts";

/** Every string of a JSON value, keys included. */
function stringsOf(value: unknown, into: Set<string> = new Set()): Set<string> {
  if (typeof value === "string") into.add(value);
  else if (Array.isArray(value)) for (const each of value) stringsOf(each, into);
  else if (value !== null && typeof value === "object") {
    for (const [key, each] of Object.entries(value)) {
      into.add(key);
      stringsOf(each, into);
    }
  }
  return into;
}

test("every check's request ids and engine options are those of the snapshot", async (t) => {
  const lv = freshLv(t);
  await bind(t, lv);
  const { snapshot, plan } = await snapshotOf(lv);
  // The committed file is read under the ids of today, so it stays as written through the renames of check and engine
  // ids: only request ids, options, cases and quantities are held.
  const committed = JSON.parse(readFileSync(SNAPSHOT_FILE, "utf8")) as RequestSnapshot;
  assert.deepEqual(
    heldPart(snapshot),
    heldPart(committed),
    "a request id or an engine option moved: a rename of a check or an engine id must move none. Rewrite the " +
      "snapshot (node test/core/writeRequestSnapshot.ts) only at the end-of-project refresh or for a change meant to " +
      "move one, and read the diff",
  );
  // Until an id is renamed, the file is the bytes the writer writes.
  if (Object.keys(LEGACY_CHECK_IDS).length + Object.keys(LEGACY_ENGINE_IDS).length === 0)
    assert.equal(snapshotText(snapshot), readFileSync(SNAPSHOT_FILE, "utf8"));

  // Every check is planned, or listed with the reason no hermetic input plans it.
  for (const rung of RUNGS) {
    const planned = snapshot.checks.find((check) => check.check === rung.id)?.jobs.length ?? 0;
    assert.ok(planned > 0 || Object.hasOwn(UNCOVERED, rung.id), `check ${rung.id} is planned on no input`);
  }
  // Every engine of today is asked something, so its options are in the snapshot.
  for (const engine of SNAPSHOT_ENGINES) {
    assert.ok(
      snapshot.checks.some((check) => check.jobs.some((job) => job.engine === engine)),
      `no job of ${engine}`,
    );
  }

  // A request id is the case, the quantity and the spec, and nothing else: no check or engine id is in it.
  const ids = new Set([...RUNGS.map((rung) => rung.id), ...SNAPSHOT_ENGINES]);
  for (const job of plan.jobs) {
    const { request } = job;
    const { caseId, quantity, quantityVersion, spec } = request;
    assert.equal(request.id, requestIdentity({ caseId, quantity, quantityVersion, spec }));
    const named = [...stringsOf(spec), ...stringsOf(request.engineOptions ?? {})].filter((each) => ids.has(each));
    assert.deepEqual(named, [], `${job.rung.id} ${job.engineId}: a spec or an option names a check or an engine`);
  }
});

test("a store key names the engine id and no check id", () => {
  const parts = {
    requestId: "a".repeat(64),
    engineId: "ref",
    engineFingerprint: "b".repeat(64),
    adapterRevision: "c".repeat(64),
    engineOptions: { bundleGrid: 4 },
  };
  // The same answer under another engine id is another entry: a renamed engine's answers are computed again.
  assert.notEqual(storeKey(parts), storeKey({ ...parts, engineId: "reference-tracer" }));
  // Its parts are these and no others: no check id is among them, so a renamed check finds its answers.
  assert.equal(storeKey(parts), storeKey({ ...parts, ...({ rung: "r2" } as object) }));
});

test("the snapshot is held through a rename of check and engine ids, and a moved request id still fails", () => {
  const committed = JSON.parse(readFileSync(SNAPSHOT_FILE, "utf8")) as RequestSnapshot;
  const maps = { checks: { r2: "ray-trace", selftest: "pipeline-echo" }, engines: { ref: "aaa", flux: "zz-flux" } };
  const check = (id: string): string => (Object.hasOwn(maps.checks, id) ? maps.checks[id as "r2"] : id);
  const engine = (id: string): string => (Object.hasOwn(maps.engines, id) ? maps.engines[id as "ref"] : id);
  // The snapshot as a planner of the renamed ids would write it: new names, jobs in its engines' new order.
  const renamed: RequestSnapshot = {
    ...committed,
    suite: JSON.parse(JSON.stringify(committed.suite).replaceAll('"ref"', '"aaa"')),
    checks: committed.checks.map((each) => ({
      ...each,
      check: check(each.check),
      jobs: each.jobs.map((job) => ({ ...job, engine: engine(job.engine) })).reverse(),
    })),
    followUps: committed.followUps.map((each) => ({ ...each, check: check(each.check), engine: engine(each.engine) })),
  };
  assert.deepEqual(heldPart(renamed, maps), heldPart(committed, maps));
  // A request id that moved is still a difference.
  const moved = structuredClone(renamed);
  moved.checks[3].jobs[0] = { ...moved.checks[3].jobs[0], requestId: "0".repeat(64) };
  assert.notDeepEqual(heldPart(moved, maps), heldPart(committed, maps));
  // And so is an option that moved.
  const option = structuredClone(renamed);
  const at = option.checks.findIndex((each) => each.jobs.some((job) => job.options !== null));
  const job = option.checks[at].jobs.findIndex((each) => each.options !== null);
  option.checks[at].jobs[job] = { ...option.checks[at].jobs[job], options: { moved: 1 } };
  assert.notDeepEqual(heldPart(option, maps), heldPart(committed, maps));
});
