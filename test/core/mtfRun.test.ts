// The record of one `lvrtc mtf` on disk: where it goes, what its file holds and what a second run leaves behind.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { MTF_NATIVE } from "../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../src/contract/request.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { MTF_RUN_FILE, MTF_RUNS_DIRECTORY, mtfRunDirectory, mtfRunText, writeMtfRun } from "../../src/core/mtfRun.ts";
import type { MtfRun } from "../../src/core/mtfRun.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { ALL_FEATURES_CASE, MTF_SPEC_FRACTIONS, SINGLET_CASE } from "../contract/corpus.ts";
import { tempDir } from "./support.ts";

function recordOf(caseId: string): MtfRun {
  return {
    contract: CONTRACT_VERSION,
    kind: "mtf-run",
    name: "some-lens-zoom1",
    lensKey: "some-lens",
    profile: "some-profile",
    caseId,
    request: makeRequest({ caseId, quantity: MTF_NATIVE, spec: MTF_SPEC_FRACTIONS }),
    displayedFrequenciesPerMm: [10, 30],
    engines: [{ id: "broken", status: "unavailable", code: "load-failed" }],
    answers: [{ engine: "broken", status: "error", storeKey: null, error: { code: "load-failed" } }],
  };
}

test("a run is kept under mtf, its profile and its name: the record as canonical JSON, the case beside it", (t) => {
  const runsDir = tempDir(t);
  const directory = mtfRunDirectory(runsDir, "some-profile", "some-lens-zoom1");
  assert.equal(directory, join(runsDir, "mtf", "some-profile", "some-lens-zoom1"));
  assert.deepEqual([MTF_RUNS_DIRECTORY, MTF_RUN_FILE], ["mtf", "mtf.json"]);

  const record = recordOf(SINGLET_CASE.id);
  const file = writeMtfRun(directory, record, SINGLET_CASE);
  assert.equal(file, join(directory, "mtf.json"));
  assert.equal(readFileSync(file, "utf8"), `${canonicalJson(record)}\n`);
  assert.equal(mtfRunText(record), `${canonicalJson(record)}\n`);
  assert.deepEqual(readdirSync(directory).sort(), ["cases", "mtf.json"]);
  assert.equal(
    readFileSync(join(directory, "cases", `${SINGLET_CASE.id}.json`), "utf8"),
    `${canonicalJson(SINGLET_CASE)}\n`,
  );

  // The same run again is the same bytes; the run of another case replaces the record and leaves only its case.
  writeMtfRun(directory, record, SINGLET_CASE);
  assert.equal(readFileSync(file, "utf8"), mtfRunText(record));
  const other = recordOf(ALL_FEATURES_CASE.id);
  writeMtfRun(directory, other, ALL_FEATURES_CASE);
  assert.equal(readFileSync(file, "utf8"), mtfRunText(other));
  assert.deepEqual(readdirSync(join(directory, "cases")), [`${ALL_FEATURES_CASE.id}.json`]);
});
