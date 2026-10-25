import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { runSuite, planJobs } from "../../../src/core/orchestrator.ts";
import { loadSuiteValue } from "../../../src/core/suite.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { FOLDED_CONFIRMATION, confirmFoldedPath } from "../../../src/engines/lv/confirmPath.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { fineSampling, raySetId } from "../../../src/rays/raySets.ts";
import { fakeEngine, tempDir, watchedRegistry } from "../../core/support.ts";
import { freshLv, variantOf, bind } from "./support.ts";
import { validateKind } from "../../../src/contract/schemas.ts";

function confirmation(note: string) {
  const [code, runLabel, runHex, coarseLabel, coarse, fineLabel, fine] = note.split(":");
  assert.deepEqual(
    [code, runLabel, coarseLabel, fineLabel],
    ["folded-declared-path-confirmed", "run", "coarse", "fine"],
  );
  const sets = (text: string) => (text === "unrequested" ? null : text === "empty" ? [] : text.split("."));
  return { run: Buffer.from(runHex, "hex").toString("utf8"), coarse: sets(coarse), fine: sets(fine) };
}

const suite = {
  contract: "1.0",
  kind: "suite",
  name: "folded-confirmation",
  defaults: {
    engines: ["lv", "ref", "optiland"],
    rungs: ["r0", "r1", "r2", "r3"],
    fields: { kind: "angles-deg", values: [0, 0.25] },
    sampling: { bundleGrid: 4 },
  },
  runs: [{ name: "fold", lens: { kind: "lv", key: "zz-folded-mirror" } }],
};

test("a traced post-path mirror hit refuses the whole run before lv, ref or optiland is contacted", async (t) => {
  const lv = variantOf(freshLv(t), "continued", {
    "src/lens-data/zz-folded/FoldedMirror.data.ts": (text) =>
      text
        .replace("maxInteractions: 3 }", "maxInteractions: 4, after: [2] }")
        .replace("R: -120, d: 20,", "R: -120, d: -40,")
        .replace(
          "  ],",
          '    { label: "M2", R: 1e15, d: -20, nd: 1, sd: 12, interaction: { type: "reflect", incidentSide: "rear", inactiveSide: "block" } },\n  ],',
        ),
  });
  await bind(t, lv);
  const source = createLvCaseSource(lv);
  const loaded = await loadSuiteValue(suite, "test", { rootDir: lv, sources: { lv: source } });
  assert.ok(loaded.runs[0].opticalCase, "raw export still describes the declared path");
  const watched = watchedRegistry({ lv: fakeEngine(), ref: fakeEngine(), optiland: fakeEngine() });
  const result = await runSuite({
    suite: loaded,
    sources: { lv: source },
    registry: watched.registry,
    runsDir: tempDir(t),
  });
  assert.equal(result.manifest.runs[0].caseId, null);
  assert.match(result.manifest.runs[0].problems[0], /^folded-post-path-reflection: coarse set [a-f0-9]{64},/);
  assert.deepEqual(result.manifest.jobs, []);
  assert.deepEqual(watched.created, []);
  assert.deepEqual(watched.ran, []);
});

test("confirmed runs name the exact coarse/fine sets, keep identity, and retain notes for a shared case", async (t) => {
  const lv = freshLv(t);
  await bind(t, lv);
  const source = createLvCaseSource(lv);
  const loaded = await loadSuiteValue(
    {
      ...suite,
      runs: [...suite.runs, { ...suite.runs[0], name: "same-case-other-rays", sampling: { bundleGrid: 6 } }],
    },
    "test",
    { rootDir: lv, sources: { lv: source } },
  );
  const watched = watchedRegistry({ lv: fakeEngine(), ref: fakeEngine(), optiland: fakeEngine() });
  const input = { suite: loaded, sources: { lv: source }, registry: watched.registry, runsDir: tempDir(t) };
  const plan = await planJobs({ ...input, rungs: ["r0", "r2", "r6a"] });
  for (const run of plan.runs) {
    assert.ok(run.opticalCase);
    assert.equal(run.opticalCase.id, loaded.runs[0].opticalCase?.id);
    const note = run.opticalCase.provenance.notes?.find((note) => note.startsWith(FOLDED_CONFIRMATION));
    assert.ok(note);
    assert.deepEqual(validateKind("optical-case", run.opticalCase), []);
    assert.deepEqual(confirmation(note), {
      run: run.spec.name,
      coarse: plan.raySets.get(run.spec.name)?.sets,
      fine: plan.fineRaySets.get(run.spec.name)?.sets,
    });
    assert.ok(plan.fineRaySets.get(run.spec.name)!.sets.length > 0);
  }
  const result = await runSuite(input);
  const id = result.manifest.runs[0].caseId;
  assert.ok(id);
  const persisted = JSON.parse(readFileSync(join(input.runsDir, suite.name, "cases", `${id}.json`), "utf8"));
  assert.equal(persisted.provenance.notes.filter((note: string) => note.startsWith(FOLDED_CONFIRMATION)).length, 2);
});

test("a post-path hit found only in the actual fine sets also refuses the run; unrequested sets are never sampled", async (t) => {
  const binding = await bind(t, freshLv(t));
  const exporter = createLvExporter(binding);
  const result = await exporter.exportLens("zz-folded-mirror", {});
  assert.ok(result.ok);
  const run = {
    contract: "1.0",
    kind: "run-spec",
    name: "fine",
    lens: { kind: "lv", key: "zz-folded-mirror" },
  } as const;
  const coarse = await exporter.raySets(result.opticalCase, {
    fields: { kind: "angles-deg", values: [0] },
    sampling: { bundleGrid: 4 },
  });
  const fine = await exporter.raySets(result.opticalCase, {
    fields: { kind: "angles-deg", values: [0] },
    sampling: fineSampling({ bundleGrid: 4 }),
  });
  const fineY = decodeNdArray(fine.sets[0].origins).values[1];
  const original = binding.api.traceEngineRay;
  let calls = 0;
  const api = {
    ...binding.api,
    traceEngineRay: ((...args) => {
      calls++;
      const trace = original(...args);
      if (args[1].origin[1] !== fineY) return trace;
      return { ...trace, status: "clipped", heights: [0, 0, 0], failureReason: null };
    }) as typeof original,
  };
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), result.opticalCase);
  assert.ok(rebuilt.ok);
  const accepted = confirmFoldedPath(api, rebuilt.model, run, { coarse, fine: null });
  assert.ok(accepted.ok);
  assert.equal(calls, decodeNdArray(coarse.sets[0].weights).values.length);
  assert.deepEqual(confirmation(accepted.opticalCase.provenance.notes![0]), {
    run: "fine",
    coarse: coarse.sets.map(raySetId),
    fine: null,
  });
  const refused = confirmFoldedPath(api, rebuilt.model, run, { coarse, fine });
  assert.ok(!refused.ok);
  assert.match(refused.problems[0], /^folded-post-path-reflection: fine set /);
});

test("a sequential case passes run preparation untouched: the same case, no confirmation note", async (t) => {
  const lv = freshLv(t);
  await bind(t, lv);
  const source = createLvCaseSource(lv);
  const loaded = await loadSuiteValue(
    { ...suite, runs: [{ name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } }] },
    "test",
    { rootDir: lv, sources: { lv: source } },
  );
  const before = loaded.runs[0].opticalCase;
  assert.ok(before);
  const watched = watchedRegistry({ lv: fakeEngine(), ref: fakeEngine(), optiland: fakeEngine() });
  const plan = await planJobs({
    suite: loaded,
    sources: { lv: source },
    registry: watched.registry,
    runsDir: tempDir(t),
    rungs: ["r0", "r2", "r6a"],
  });
  assert.equal(plan.runs[0].opticalCase, before);
  assert.ok(!(before.provenance.notes ?? []).some((note) => note.startsWith(FOLDED_CONFIRMATION)));
  assert.ok(plan.jobs.length > 0 && plan.jobs.every((job) => job.opticalCase === before));
});
