import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import type { RunLens, RunSpec } from "../../../src/contract/runSpec.ts";
import { validateKind } from "../../../src/contract/schemas.ts";
import { CONTRACT_VERSION, CONTRACT_VERSION_1_3 } from "../../../src/contract/version.ts";
import { loadSuiteValue } from "../../../src/core/suite.ts";
import { createLvCaseSource } from "../../../src/engines/lv/caseSource.ts";
import { freshLv } from "./support.ts";

function run(key: string, stations?: Extract<RunLens, { kind: "lv" }>["stations"]): RunSpec {
  return {
    contract: CONTRACT_VERSION_1_3,
    kind: "run-spec",
    name: "selected",
    lens: { kind: "lv", key, ...(stations ? { stations } : {}) },
  };
}

function edit(lv: string, file: string, before: string, after: string): void {
  const path = join(lv, file);
  const text = readFileSync(path, "utf8");
  assert.ok(text.includes(before));
  writeFileSync(path, text.replace(before, after));
}

test("published zoom expansion includes a published middle, excludes an unpublished knot, and preserves the ends-only default", async (t) => {
  const lv = freshLv(t);
  edit(lv, "src/lens-data/acme/AcmeZoom2448.data.ts", "[{}, {}]", "[{}, { published: false }, {}, {}]");
  const source = createLvCaseSource(lv);
  const selected = await source.expand(run("acme-zoom-24-48", "published-zoom"));
  assert.deepEqual(
    selected.map((run) => run.state?.zoomT),
    [0, 2 / 3, 1],
  );
  assert.deepEqual(
    selected.map((run) => run.name),
    ["selected-wide", `selected-zoom${2 / 3}`, "selected-tele"],
  );
  for (const run of selected) {
    assert.deepEqual(validateKind("run-spec", run), []);
    assert.ok((await source.resolve(run)).ok);
    assert.deepEqual(await source.expand(run), [run]);
  }
  assert.deepEqual(
    (await source.expand(run("acme-zoom-24-48"))).map((run) => run.state?.zoomT),
    [0, 1],
  );
  const explicit = { ...run("acme-zoom-24-48"), state: { zoomT: 0.25 } };
  assert.deepEqual(await source.expand(explicit), [explicit]);
  const prime = await source.expand(run("acme-singlet-50", "published-zoom"));
  assert.equal(prime.length, 1);
  assert.equal(prime[0].state, undefined);
});

test("certified focus expands the catalog declaration through LV's gate, once per station, into finite cases", async (t) => {
  const lv = freshLv(t);
  edit(
    lv,
    "src/lens-data/acme/AcmeSinglet50.data.ts",
    "conjugates: [{ zoomStation: 0, keyframe: 1 }]",
    "conjugates: [{ zoomStation: 0, keyframe: 1 }, { zoomStation: 0, keyframe: 1 }]",
  );
  const source = createLvCaseSource(lv);
  const runs = await source.expand(run("*", "certified-focus"));
  assert.equal(runs.length, 1);
  assert.equal(runs[0].name, "selected-acme-singlet-50-zoom0-focus1");
  assert.deepEqual(runs[0].state, { zoomT: 0, focus: { kind: "focusT", value: 1 } });
  const result = await source.resolve(runs[0]);
  assert.ok(result.ok);
  assert.deepEqual(result.opticalCase.conditions.object, { kind: "finite", z: -500 });
  assert.deepEqual(await source.expand(runs[0]), [runs[0]]);
  // The suite hashes its written selector, while its ordinary run names/cases follow the checkout.
  const written = {
    contract: CONTRACT_VERSION_1_3,
    kind: "suite",
    name: "stations",
    runs: [run("*", "certified-focus")],
  };
  const loaded = await loadSuiteValue(written, "synthetic suite", { rootDir: lv, sources: { lv: source } });
  const missing = await loadSuiteValue(written, "synthetic suite", { rootDir: lv });
  assert.equal(loaded.hash, missing.hash);
  assert.equal(loaded.runs.length, 1);
});

test("a refused or empty focus selection and conflicting explicit coordinates stay visible as coded run problems", async (t) => {
  const lv = freshLv(t);
  edit(
    lv,
    "src/lens-data/acme/AcmeSinglet50.data.ts",
    "  focusTravel: 5,",
    "  focusTravel: 5,\n  unverifiedScale: true,",
  );
  edit(
    lv,
    "src/optics/analysis/mtf/mtfSupport.ts",
    "  if (state.focusT !== 0) {",
    '  if (state.lens.runtime.source.unverifiedScale) return reject("unverified-scale", "Synthetic gate refusal.");\n  if (state.focusT !== 0) {',
  );
  const source = createLvCaseSource(lv);
  const selected = await source.expand(run("*", "certified-focus"));
  assert.equal(selected.length, 1);
  assert.equal(selected[0].name, "selected-acme-singlet-50-zoom0-focus1");
  assert.deepEqual(selected[0].state, { zoomT: 0, focus: { kind: "focusT", value: 1 } });
  assert.deepEqual(await source.expand(selected[0]), selected);
  const refused = await source.resolve(selected[0]);
  assert.ok(!refused.ok);
  assert.match(refused.problems[0], /^finite-conjugate-unavailable:/);
  const empty = run("zenith-doublet-100", "certified-focus");
  assert.deepEqual(await source.expand(empty), [empty]);
  const unresolved = await source.resolve(empty);
  assert.ok(!unresolved.ok);
  assert.match(unresolved.problems[0], /^no-certified-stations:/);
  const conflict = { ...run("acme-zoom-24-48", "published-zoom"), state: { zoomT: 0.5 } };
  assert.deepEqual(await source.expand(conflict), [conflict]);
  const result = await source.resolve(conflict);
  assert.ok(!result.ok);
  assert.match(result.problems[0], /^station-selection-conflict:/);
  const missing = createLvCaseSource(null);
  assert.deepEqual(await missing.expand(run("*", "certified-focus")), [run("*", "certified-focus")]);
  assert.ok(!(await missing.resolve(run("*", "certified-focus"))).ok);
});

test("a station selector is what minor 3 added: a suite that uses one and states an earlier minor is refused", async (t) => {
  const lv = freshLv(t);
  const source = createLvCaseSource(lv);
  const selected = { name: "selected", lens: { kind: "lv", key: "acme-zoom-24-48", stations: "published-zoom" } };
  for (const contract of [CONTRACT_VERSION, "1.2"]) {
    const written = { contract, kind: "suite", name: "stations", runs: [selected] };
    // The schema of minor 3 holds the member; the version the suite states does not.
    assert.deepEqual(validateKind("suite", written), []);
    await assert.rejects(
      loadSuiteValue(written, "synthetic suite", { rootDir: lv, sources: { lv: source } }),
      /run "selected": it states the contract 1\.[02] and selects stations \(lens\.stations\), which minor 3 added/,
    );
  }
  // A run may state its own version within a suite of an earlier one; a suite of 1.3 states it for every run.
  const own = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "stations",
    runs: [{ ...selected, contract: CONTRACT_VERSION_1_3 }],
  };
  assert.equal((await loadSuiteValue(own, "synthetic suite", { rootDir: lv, sources: { lv: source } })).runs.length, 2);
  // A suite of 1.3 that selects nothing is read as before.
  const plain = {
    contract: CONTRACT_VERSION_1_3,
    kind: "suite",
    name: "plain",
    runs: [{ name: "plain", lens: { kind: "lv", key: "acme-zoom-24-48" } }],
  };
  assert.equal(
    (await loadSuiteValue(plain, "synthetic suite", { rootDir: lv, sources: { lv: source } })).runs.length,
    2,
  );
});

test("catalog selector expands every key and both zoom ends without dropping source refusals", async (t) => {
  const lv = freshLv(t),
    source = createLvCaseSource(lv);
  const runs = await source.expand(run("*"));
  assert.ok(runs.length > 3);
  const zoom = runs.filter((r) => r.lens.kind === "lv" && r.lens.key === "acme-zoom-24-48");
  assert.deepEqual(
    zoom.map((r) => r.state?.zoomT),
    [0, 1],
  );
  assert.ok(runs.some((r) => r.name === "selected-acme-singlet-50"));
  for (const selected of runs) {
    assert.notEqual(selected.lens.kind === "lv" ? selected.lens.key : "", "*");
    assert.deepEqual(await source.expand(selected), [selected]);
  }
});
