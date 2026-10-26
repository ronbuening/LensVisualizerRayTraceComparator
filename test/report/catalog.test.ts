import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { baselineText, parseBaseline } from "../../src/baseline/build.ts";
import { writeBaselineFiles } from "../../src/cli/commands/baseline.ts";
import { createVerifyCommand } from "../../src/cli/commands/verify.ts";
import { createStatementCommand } from "../../src/cli/commands/statement.ts";
import { runCli } from "../../src/cli/main.ts";
import { baselineGateProblems, loadPolicy, loadPolicySnapshot } from "../../src/compare/policyFile.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import type { Policy } from "../../src/contract/policy.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { renderCatalog, quantiles } from "../../src/report/catalog.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { tempDir } from "../core/support.ts";
import { catalogInputs, catalogKnown, catalogRaw } from "./catalogFixture.ts";
import { statementInputs, STATEMENT_POLICY } from "./statementFixture.ts";
import { GOLDEN_DIR } from "./support.ts";

test("catalog quantiles, distinct R4 pairs, refusal codes, classes and goldens", () => {
  assert.deepEqual(quantiles([0, 1, 2, 3, 4]), { min: 0, median: 2, p90: 3.6, p99: 3.96, max: 4 });
  assert.deepEqual(quantiles([]), { min: null, median: null, p90: null, p99: null, max: null });
  const rendered = renderCatalog(catalogInputs());
  assert.equal(rendered.report.complete, true);
  assert.equal(rendered.report.states, 3);
  assert.deepEqual(rendered.report.pairs, { FAIL: 1, UNSUPPORTED: 1 });
  assert.deepEqual(rendered.report.unsupported.source, { "invented-refusal": 1 });
  assert.deepEqual(rendered.report.unsupported.engineRungs, { "invented-code artificial.item": 1 });
  assert.equal(rendered.report.failures[0].classifications[0].class, "numerical");
  assert.equal(renderCatalog([...catalogInputs()].reverse()).json, rendered.json);
  assert.equal(readFileSync(join(GOLDEN_DIR, "catalog.md"), "utf8"), rendered.markdown);
  assert.equal(readFileSync(join(GOLDEN_DIR, "catalog.json"), "utf8"), rendered.json);
  const mismatched = catalogInputs();
  Object.assign(mismatched[1].baseline.runs[0].rungs[0].pairs[0].metrics[0], { value: 0 });
  assert.throws(() => renderCatalog(mismatched), /duplicate catalog figures/);
});
/** A frozen stand-in policy, older than the policy at hand, that judges the stand-in catalog's r4 metric. */
function snapshotPolicy(version = 3): Policy {
  const policy = structuredClone(loadPolicy()) as { -readonly [K in keyof Policy]: Policy[K] };
  policy.version = version;
  const r4 = policy.rungs.r4 as { metrics: Record<string, unknown> };
  r4.metrics = { ...r4.metrics, "mtf.maxAbs": { tolerance: 1 / 8, unit: "1" } };
  return policy;
}
/** A root with the stand-in catalog at `recorded`, its known failures and reports; the snapshot directory holds `frozen`. */
function snapshotRoot(
  t: TestContext,
  recorded: Policy,
  frozen: readonly Policy[],
): { root: string; snapshots: string } {
  const root = tempDir(t),
    snapshots = join(tempDir(t), "snapshots");
  mkdirSync(snapshots);
  for (const policy of frozen)
    writeFileSync(join(snapshots, `rungs.v${policy.version}.json`), `${JSON.stringify(policy, null, 2)}\n`);
  mkdirSync(join(root, "docs"));
  writeFileSync(join(root, "docs/known-failures.json"), JSON.stringify(catalogKnown()));
  for (const input of catalogInputs())
    writeBaselineFiles(
      root,
      { ...input.baseline, policy: { version: recorded.version, hash: hashCanonical(recorded) } },
      input.file.includes(".mtf."),
    );
  return { root, snapshots };
}
async function verifyAt(root: string, snapshots: string, policy: Policy = loadPolicy(), args = ["verify"]) {
  const command = createVerifyCommand({ rootDir: root, cwd: root, policy, policySnapshots: snapshots });
  let out = "",
    err = "";
  const io = { stdout: (s: string) => void (out += s), stderr: (s: string) => void (err += s) };
  return { code: await runCli(args, io, [command]), out, err };
}

test("verify holds catalog statistics byte for byte and rejects removed classifications", async (t) => {
  const policy = snapshotPolicy();
  const { root, snapshots } = snapshotRoot(t, policy, [policy]);
  const command = createVerifyCommand({ rootDir: root, cwd: root, policySnapshots: snapshots });
  let out = "";
  const io = {
    stdout: (s: string) => {
      out += s;
    },
    stderr: (s: string) => {
      out += s;
    },
  };
  assert.equal(await runCli(["verify", "--write"], io, [command]), 0, out);
  assert.equal(await runCli(["verify"], io, [command]), 0, out);
  writeFileSync(join(root, "reports/catalog.md"), "edited");
  assert.equal(await runCli(["verify"], io, [command]), 1);
  await runCli(["verify", "--write"], io, [command]);
  writeFileSync(join(root, "docs/known-failures.json"), "[]");
  assert.equal(await runCli(["verify"], io, [command]), 1);
  // An entry that no classification uses is stale, and verify says so.
  const stale = { ...catalogKnown()[0], rung: "r2" };
  writeFileSync(join(root, "docs/known-failures.json"), JSON.stringify([...catalogKnown(), stale]));
  out = "";
  assert.equal(await runCli(["verify"], io, [command]), 1);
  assert.match(out, /no catalog baseline classifies catalog-artificial-prime r2 lv ref mtf\.maxAbs/);
  writeFileSync(join(root, "docs/known-failures.json"), JSON.stringify(catalogKnown()));
  assert.equal(await runCli(["verify"], io, [command]), 0, out);
  // The list excuses nothing outside the catalog: a FAIL in any other baseline is a problem of verify.
  const raw = catalogRaw();
  const current = loadPolicy();
  const other = {
    ...raw,
    contract: "1.3",
    suite: { ...raw.suite, name: "other" },
    policy: { version: current.version, hash: hashCanonical(current) },
    runs: raw.runs.map(({ features: _features, ...run }) => run),
  };
  writeBaselineFiles(root, other, false);
  out = "";
  assert.equal(await runCli(["verify"], io, [command]), 1);
  assert.match(out, /baselines\/other\.json: catalog-artificial-prime r4 lv ref FAIL: no baseline records it/);
});
test("a catalog snapshot under an older policy passes verify, held to its frozen policy and said to be a snapshot", async (t) => {
  const frozen = snapshotPolicy(3);
  const { root, snapshots } = snapshotRoot(t, frozen, [frozen]);
  assert.equal((await verifyAt(root, snapshots, loadPolicy(), ["verify", "--write"])).code, 0);
  // The policy at hand moves on (a later stage raises its version): the catalog is not refreshed and still holds.
  const later = { ...loadPolicy(), version: loadPolicy().version + 1 };
  const said = await verifyAt(root, snapshots, later);
  assert.equal(said.code, 0, said.err);
  assert.match(
    said.out,
    /^baselines\/catalog\.json: a baseline of 3 runs and 2 records, policy v3; .*; the catalog is a dated snapshot of policy v3, held to policy\/snapshots\/rungs\.v3\.json$/m,
  );
  assert.match(
    said.out,
    new RegExp(
      `^verify: the catalog is a dated snapshot of policy v3: it is held to the policy it records, not to the policy at hand \\(v${later.version}\\)`,
      "m",
    ),
  );
});

test("a catalog snapshot of an unknown, forged or inconsistent policy fails verify", async (t) => {
  const frozen = snapshotPolicy(3);
  const failing = async (
    recorded: Policy,
    known: readonly Policy[],
    pattern: RegExp,
    edit?: (root: string, snapshots: string) => void,
  ): Promise<void> => {
    const { root, snapshots } = snapshotRoot(t, recorded, known);
    assert.equal((await verifyAt(root, snapshots, loadPolicy(), ["verify", "--write"])).code !== 2, true);
    edit?.(root, snapshots);
    const said = await verifyAt(root, snapshots);
    assert.equal(said.code, 1, said.out);
    assert.match(said.err, pattern);
  };
  // No frozen policy of the recorded version.
  await failing(
    frozen,
    [],
    /baselines\/catalog\.json: a dated snapshot must record a known policy, and policy v3 \(\w+\) is not one: policy\/snapshots\/rungs\.v3\.json cannot be read \(ENOENT\); .*cp policy\/rungs\.v1\.json policy\/snapshots\/rungs\.v3\.json/,
  );
  // A recorded hash that is no frozen policy's: a forged record of v3.
  const forged = { ...frozen, rungs: { ...frozen.rungs, r4: { ...frozen.rungs.r4, class: "recorded" as const } } };
  await failing(forged, [frozen], /policy\/snapshots\/rungs\.v3\.json hashes to \w+, not to the recorded \w+/);
  // A frozen file of another version under the name.
  await failing(frozen, [], /policy\/snapshots\/rungs\.v3\.json states policy v4/, (_root, snapshots) =>
    writeFileSync(join(snapshots, "rungs.v3.json"), JSON.stringify(snapshotPolicy(4))),
  );
  // A gate recorded in the baseline that is not the frozen policy's.
  await failing(
    frozen,
    [frozen],
    /catalog-artificial-prime r4 lv ref mtf\.maxAbs: the gate is not the recorded policy's/,
    (root) => {
      const file = join(root, "baselines", "catalog.json");
      writeFileSync(file, readFileSync(file, "utf8").replace('"tolerance":0.125', '"tolerance":0.25'));
    },
  );
  // The two baselines of one snapshot of two policies.
  const older = snapshotPolicy(2);
  await failing(
    frozen,
    [frozen, older],
    /baselines\/catalog\.mtf\.json: it records policy v2 .* and baselines\/catalog\.json policy v3 .*: the baselines of one snapshot are of one policy/,
    (root) => {
      const file = join(root, "baselines", "catalog.mtf.json");
      const baseline = JSON.parse(readFileSync(file, "utf8")) as Baseline;
      writeFileSync(file, baselineText({ ...baseline, policy: { version: 2, hash: hashCanonical(older) } }));
    },
  );
  // A snapshot newer than the policy at hand.
  const ahead = snapshotPolicy(loadPolicy().version + 1);
  await failing(ahead, [ahead], /it records policy v\d+, later than the policy at hand/);
});

test("outside the catalog an older policy still fails verify, even one frozen as a snapshot", async (t) => {
  const frozen = snapshotPolicy(3);
  const { root, snapshots } = snapshotRoot(t, frozen, [frozen]);
  const raw = catalogRaw();
  const other = {
    ...raw,
    contract: "1.3",
    suite: { ...raw.suite, name: "other" },
    policy: { version: frozen.version, hash: hashCanonical(frozen) },
    runs: [raw.runs[2]].map(({ features: _features, ...run }) => run),
  };
  writeBaselineFiles(root, other, false);
  assert.equal((await verifyAt(root, snapshots, loadPolicy(), ["verify", "--write"])).code, 1);
  const said = await verifyAt(root, snapshots);
  assert.equal(said.code, 1);
  assert.match(
    said.err,
    /^lvrtc verify: baselines\/other\.json: it was judged by policy v3 \(\w+\), not by the policy at hand/m,
  );
  assert.doesNotMatch(said.err, /baselines\/catalog/);
});

test("the committed catalog is a snapshot of policy 15 at LensVisualizer 879c06102 whose frozen policy is genuine", () => {
  for (const file of ["catalog.json", "catalog.mtf.json"]) {
    const read = parseBaseline(readFileSync(join(REPO_ROOT, "baselines", file), "utf8"));
    assert.ok("baseline" in read, file);
    const { baseline } = read;
    assert.deepEqual(baseline.policy, {
      hash: "1db393cc152dc19e71ca79b07f474d3a837fa402f51632312a6fc5cbeb671524",
      version: 15,
    });
    assert.match(String(baseline.engines.find((engine) => engine.id === "lv")?.details.commit), /^879c06102/);
    const frozen = loadPolicySnapshot(baseline.policy);
    assert.ok("policy" in frozen, "problem" in frozen ? frozen.problem : "");
    assert.deepEqual(baselineGateProblems(baseline, frozen.policy), [], file);
  }
});

test("statement still reads exactly its eight files with folded, diffractive and catalog baselines present", async (t) => {
  const root = tempDir(t);
  for (const input of statementInputs()) writeBaselineFiles(root, input.baseline, input.file.includes(".mtf."));
  const command = createStatementCommand({ rootDir: root, cwd: root });
  const io = { stdout: (_s: string) => {}, stderr: (_s: string) => {} };
  assert.equal(await runCli(["statement"], io, [command]), 0);
  const before = readFileSync(join(root, "reports/validation-statement.json"), "utf8");
  for (const name of ["folded", "diffractive", "catalog"]) {
    const b = { ...statementInputs()[0].baseline, suite: { name, hash: "a".repeat(64) } };
    writeFileSync(join(root, "baselines", `${name}.json`), baselineText(b));
  }
  assert.equal(await runCli(["statement"], io, [command]), 0);
  assert.equal(readFileSync(join(root, "reports/validation-statement.json"), "utf8"), before);
  assert.equal((await import("../../src/report/statement.ts")).STATEMENT_FILES.length, 8);
  assert.equal(STATEMENT_POLICY.version, 1);
});
