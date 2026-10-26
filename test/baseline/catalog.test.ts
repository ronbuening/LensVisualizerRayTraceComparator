import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import {
  classifyCatalog,
  failureEvidence,
  readKnownFailures,
  unclassifiedFailures,
  unusedKnownFailures,
} from "../../src/baseline/catalog.ts";
import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import { checkBaseline, checkFails } from "../../src/baseline/check.ts";
import { tempDir } from "../core/support.ts";
import { catalogRaw, catalogKnown } from "../report/catalogFixture.ts";

const policy = {
  contract: "1.3",
  kind: "policy" as const,
  version: 1,
  rungs: {
    r4: {
      quantity: "rays.trace",
      mode: "identical-rays" as const,
      class: "gated" as const,
      metrics: { "mtf.maxAbs": { unit: "1", tolerance: 1 / 8 } },
    },
  },
};
test("catalog admits only exact classified FAILs, retains FAIL, and round-trips", () => {
  const raw = catalogRaw();
  assert.equal(unclassifiedFailures(raw).length, 1);
  assert.equal(unclassifiedFailures(classifyCatalog(raw, [])).length, 1);
  const classified = classifyCatalog(raw, catalogKnown());
  assert.equal(classified.runs[0].rungs[0].pairs[0].verdict, "FAIL");
  assert.equal(unclassifiedFailures(classified).length, 0);
  assert.ok("baseline" in parseBaseline(baselineText(classified)));
  assert.equal(
    classifyCatalog({ ...raw, suite: { ...raw.suite, name: "other" } }, catalogKnown()).runs[0].rungs[0].pairs[0]
      .failures,
    undefined,
  );
});
test("unchanged known FAIL is OK; any changed figure, verdict, count or classification is DRIFT", () => {
  const baseline = classifyCatalog(catalogRaw(), catalogKnown());
  const records = checkBaseline(baseline, baseline, policy);
  assert.equal(records[0].outcome, "OK");
  assert.equal(records[0].verdict, "FAIL");
  assert.equal(checkFails(records), false);
  for (const change of ["figure", "location", "count", "class", "new"]) {
    const fresh = structuredClone(baseline);
    const rung = fresh.runs[0].rungs[0],
      pair = rung.pairs[0];
    if (change === "figure") Object.assign(pair.metrics[0], { value: 1 / 4 + 1 / 1024 });
    if (change === "location") Object.assign(pair.metrics[0], { where: { field: 1 } });
    if (change === "count") Object.assign(rung, { requests: 3 });
    if (change === "class") Object.assign(pair.failures![0], { class: "method" });
    if (change === "new") Object.assign(pair, { failures: undefined });
    const checked = checkBaseline(baseline, fresh, policy);
    assert.equal(checked[0].outcome, "DRIFT", change);
    assert.equal(checkFails(checked), true, change);
  }
  const changed = structuredClone(catalogRaw());
  Object.assign(changed.runs[0].rungs[0].pairs[0].metrics[0], { value: 1 / 4 + 1 / 1024 });
  assert.equal(unclassifiedFailures(classifyCatalog(changed, catalogKnown())).length, 1);
  const measured = structuredClone(baseline);
  Object.assign(measured.runs[0].rungs[0].pairs[0].metrics[0], { measured: 1 });
  const remeasured = structuredClone(measured);
  Object.assign(remeasured.runs[0].rungs[0].pairs[0].metrics[0], { measured: 2 });
  assert.equal(checkBaseline(measured, remeasured, policy)[0].outcome, "DRIFT");
  const noRuns = { ...baseline, runs: [] };
  assert.equal(checkBaseline(noRuns, baseline, policy)[0].outcome, "DRIFT");
  assert.equal(failureEvidence(2, baseline.runs[0].rungs[0].pairs[0]), catalogKnown()[0].evidenceHash);
});
test("known failure file rejects duplicates, missing attribution and malformed entries", (t) => {
  const root = tempDir(t);
  mkdirSync(join(root, "docs"));
  const file = join(root, "docs/known-failures.json");
  writeFileSync(file, JSON.stringify(catalogKnown()));
  assert.deepEqual(readKnownFailures(root), catalogKnown());
  for (const entries of [
    [...catalogKnown(), ...catalogKnown()],
    [{ ...catalogKnown()[0], class: "unknown" }],
    [{ ...catalogKnown()[0], reproducer: "echo skipped" }],
    {},
  ]) {
    writeFileSync(file, JSON.stringify(entries));
    assert.throws(() => readKnownFailures(root));
  }
});

test("catalog annotations require minor 6 and cannot leak into other suites", () => {
  const baseline = classifyCatalog(catalogRaw(), catalogKnown());
  assert.ok("problems" in parseBaseline(baselineText({ ...baseline, contract: "1.5" })));
  assert.ok("problems" in parseBaseline(baselineText({ ...baseline, suite: { ...baseline.suite, name: "other" } })));
  const error = structuredClone(baseline);
  Object.assign(error.runs[0].rungs[0].pairs[0], { verdict: "ERROR", failures: undefined });
  assert.equal(unclassifiedFailures(classifyCatalog(error, catalogKnown())).length, 1);
});

test("every exceeding metric of a FAIL needs its own entry, and an entry no classification uses is reported", () => {
  const raw = structuredClone(catalogRaw());
  const rung = raw.runs[0].rungs[0],
    pair = rung.pairs[0];
  Object.assign(pair.metrics[1], { value: 3, tolerance: 1 });
  const evidenceHash = failureEvidence(rung.requests, pair);
  const first = { ...catalogKnown()[0], evidenceHash };
  assert.equal(unclassifiedFailures(classifyCatalog(raw, [first])).length, 1);
  const both = [first, { ...first, metric: "rays.dropped" }];
  const classified = classifyCatalog(raw, both);
  assert.equal(unclassifiedFailures(classified).length, 0);
  assert.deepEqual(
    classified.runs[0].rungs[0].pairs[0].failures?.map((f) => f.metric),
    ["mtf.maxAbs", "rays.dropped"],
  );
  assert.deepEqual(unusedKnownFailures([classified], both), []);
  assert.deepEqual(unusedKnownFailures([classified], [...both, { ...first, rung: "r2" }]), [
    "catalog-artificial-prime r2 lv ref mtf.maxAbs",
  ]);
  assert.equal(unusedKnownFailures([], both).length, 2);
});
